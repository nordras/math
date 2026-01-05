/**
 * Sistema de Cache para respostas da IA
 * Evita chamadas repetidas e melhora performance
 */

import { promises as fs } from 'fs';
import path from 'path';

class CacheManager {
  constructor(cacheDir = './cache') {
    this.cacheDir = cacheDir;
    this.memoryCache = new Map();
  }

  /**
   * Inicializa o sistema de cache
   */
  async init() {
    try {
      await fs.mkdir(this.cacheDir, { recursive: true });
      console.log('✅ Sistema de cache inicializado');
    } catch (error) {
      console.warn('⚠️  Erro ao criar diretório de cache:', error.message);
    }
  }

  /**
   * Gera uma chave única para o problema
   */
  getCacheKey(problem) {
    return `${problem.type}-${problem.num1}-${problem.num2}`;
  }

  /**
   * Gera o caminho do arquivo de cache
   */
  getCacheFilePath(key) {
    // Criar subdiretório por tipo de operação
    const type = key.split('-')[0];
    return path.join(this.cacheDir, type, `${key}.json`);
  }

  /**
   * Busca no cache (memória primeiro, depois arquivo)
   */
  async get(problem) {
    const key = this.getCacheKey(problem);

    // Tentar memória primeiro
    if (this.memoryCache.has(key)) {
      return this.memoryCache.get(key);
    }

    // Tentar arquivo
    try {
      const filePath = this.getCacheFilePath(key);
      const data = await fs.readFile(filePath, 'utf-8');
      const cached = JSON.parse(data);

      // Adicionar à memória
      this.memoryCache.set(key, cached.context);

      return cached.context;
    } catch (error) {
      // Não encontrado no cache
      return null;
    }
  }

  /**
   * Salva no cache (memória e arquivo)
   */
  async set(problem, context) {
    const key = this.getCacheKey(problem);

    // Salvar na memória
    this.memoryCache.set(key, context);

    // Salvar em arquivo
    try {
      const filePath = this.getCacheFilePath(key);
      const dir = path.dirname(filePath);

      // Criar diretório se não existir
      await fs.mkdir(dir, { recursive: true });

      // Salvar dados
      const data = {
        key,
        context,
        problem: {
          type: problem.type,
          num1: problem.num1,
          num2: problem.num2,
          operation: problem.operation,
          answer: problem.answer
        },
        timestamp: new Date().toISOString(),
        version: '1.0'
      };

      await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
    } catch (error) {
      console.warn(`⚠️  Erro ao salvar cache para ${key}:`, error.message);
    }
  }

  /**
   * Verifica se existe no cache
   */
  async has(problem) {
    const key = this.getCacheKey(problem);
    
    if (this.memoryCache.has(key)) {
      return true;
    }

    try {
      const filePath = this.getCacheFilePath(key);
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Obtém estatísticas do cache
   */
  async getStats() {
    try {
      const stats = {
        memorySize: this.memoryCache.size,
        fileCount: 0,
        totalSize: 0,
        byType: {}
      };

      // Contar arquivos por tipo
      for (const type of ['addition', 'subtraction']) {
        const typeDir = path.join(this.cacheDir, type);
        try {
          const files = await fs.readdir(typeDir);
          stats.byType[type] = files.length;
          stats.fileCount += files.length;

          // Calcular tamanho total
          for (const file of files) {
            const filePath = path.join(typeDir, file);
            const stat = await fs.stat(filePath);
            stats.totalSize += stat.size;
          }
        } catch {
          stats.byType[type] = 0;
        }
      }

      return stats;
    } catch (error) {
      return { error: error.message };
    }
  }

  /**
   * Limpa o cache
   */
  async clear() {
    // Limpar memória
    this.memoryCache.clear();

    // Limpar arquivos
    try {
      await fs.rm(this.cacheDir, { recursive: true, force: true });
      await fs.mkdir(this.cacheDir, { recursive: true });
      console.log('✅ Cache limpo com sucesso');
    } catch (error) {
      console.warn('⚠️  Erro ao limpar cache:', error.message);
    }
  }

  /**
   * Pré-aquece o cache com problemas comuns
   */
  async warmup(aiEnhancer, ranges = { min: 1, max: 20 }) {
    console.log('🔥 Aquecendo cache...');
    
    const operations = ['addition', 'subtraction'];
    let generated = 0;
    let cached = 0;

    for (const type of operations) {
      for (let i = ranges.min; i <= ranges.max; i++) {
        for (let j = ranges.min; j <= ranges.max; j++) {
          const problem = {
            type,
            num1: i,
            num2: j,
            operation: type === 'addition' ? '+' : '−',
            answer: type === 'addition' ? i + j : i - j
          };

          // Verificar se já existe
          const exists = await this.has(problem);
          if (!exists) {
            const context = await aiEnhancer.generateContext(problem);
            await this.set(problem, context);
            generated++;

            // Pequeno delay para respeitar rate limits
            await this.sleep(100);
          } else {
            cached++;
          }
        }
      }
    }

    console.log(`✅ Cache aquecido: ${generated} novos, ${cached} existentes`);
    
    return { generated, cached };
  }

  /**
   * Helper para delay
   */
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Carrega todos os itens do cache para memória
   */
  async loadToMemory() {
    console.log('📥 Carregando cache para memória...');
    let count = 0;

    try {
      for (const type of ['addition', 'subtraction']) {
        const typeDir = path.join(this.cacheDir, type);
        try {
          const files = await fs.readdir(typeDir);
          
          for (const file of files) {
            if (file.endsWith('.json')) {
              const filePath = path.join(typeDir, file);
              const data = await fs.readFile(filePath, 'utf-8');
              const cached = JSON.parse(data);
              
              this.memoryCache.set(cached.key, cached.context);
              count++;
            }
          }
        } catch {
          // Diretório não existe ou está vazio
        }
      }

      console.log(`✅ ${count} itens carregados na memória`);
    } catch (error) {
      console.warn('⚠️  Erro ao carregar cache:', error.message);
    }

    return count;
  }
}

export default CacheManager;
