#!/usr/bin/env node

/**
 * Gerador de Exercícios de Matemática com IA
 * Gera 50 problemas mistos de adição e subtração
 */

require('dotenv').config();
const fs = require('fs').promises;
const path = require('path');
const MathGenerator = require('./generators/mathGenerator');
const AIEnhancer = require('./generators/aiEnhancer');
const CacheManager = require('./utils/cache');
const GridFormatter = require('./templates/grid');

// Configuração
const CONFIG = {
  totalProblems: parseInt(process.env.TOTAL_PROBLEMS) || 50,
  difficulty: process.env.DIFFICULTY || 'medium',
  useAI: process.env.USE_AI === 'true',
  geminiApiKey: process.env.GEMINI_API_KEY,
  outputDir: './adicao-subtracao',
  cacheDir: './cache'
};

// Verificar argumentos de linha de comando
const args = process.argv.slice(2);
if (args.includes('--no-ai')) {
  CONFIG.useAI = false;
}
if (args.includes('--with-ai')) {
  CONFIG.useAI = true;
}
if (args.includes('--easy')) {
  CONFIG.difficulty = 'easy';
}
if (args.includes('--hard')) {
  CONFIG.difficulty = 'hard';
}

/**
 * Função principal
 */
async function main() {
  console.log('🎓 Gerador de Exercícios de Matemática\n');
  console.log('═══════════════════════════════════════\n');

  try {
    // 1. Inicializar componentes
    console.log('📦 Inicializando componentes...');
    
    const mathGenerator = new MathGenerator({
      totalProblems: CONFIG.totalProblems,
      difficulty: CONFIG.difficulty,
      additionRatio: 0.5
    });

    const cacheManager = new CacheManager(CONFIG.cacheDir);
    await cacheManager.init();

    // Verificar se deve usar IA
    let aiEnhancer = null;
    if (CONFIG.useAI) {
      if (!CONFIG.geminiApiKey || CONFIG.geminiApiKey === 'your_api_key_here') {
        console.log('⚠️  Chave da API Gemini não configurada');
        console.log('   Configure GEMINI_API_KEY no arquivo .env');
        console.log('   Obtenha em: https://makersuite.google.com/app/apikey');
        console.log('   Continuando SEM IA (usando templates)...\n');
        CONFIG.useAI = false;
      } else {
        const modelName = process.env.GEMINI_MODEL || 'gemini-flash-latest';
        aiEnhancer = new AIEnhancer(CONFIG.geminiApiKey, { model: modelName });
        console.log(`✅ IA habilitada (Google Gemini - ${modelName})\n`);
      }
    } else {
      console.log('ℹ️  Modo SEM IA (usando templates)\n');
    }

    const gridFormatter = new GridFormatter({
      columns: 5,
      style: 'text'
    });

    // 2. Gerar problemas matemáticos
    console.log('🧮 Gerando problemas matemáticos...');
    const problems = mathGenerator.generateMixedProblems();
    const stats = mathGenerator.getStatistics(problems);
    
    console.log(`✅ ${problems.length} problemas gerados`);
    console.log(`   - Adição: ${stats.addition}`);
    console.log(`   - Subtração: ${stats.subtraction}`);
    if (stats.threeDigits > 0) {
      console.log(`   - Com 3 algarismos: ${stats.threeDigits} (${Math.round(stats.threeDigits / stats.total * 100)}%)`);
    }
    console.log(`   - Dificuldade: ${CONFIG.difficulty}\n`);

    // 3. Gerar exercício em grade (sem contexto narrativo)
    console.log('📄 Gerando folha de exercícios (grade)...');
    const gridExercise = gridFormatter.generateComplete(problems, stats, {
      includeStats: true,
      includeAnswerKey: false
    });

    // 4. Criar diretório de saída
    await fs.mkdir(CONFIG.outputDir, { recursive: true });

    // 5. Salvar exercício em grade
    const gridFilePath = path.join(
      CONFIG.outputDir, 
      `exercicio-50-problemas-${CONFIG.difficulty}.md`
    );
    await fs.writeFile(gridFilePath, gridExercise, 'utf-8');
    console.log(`✅ Exercício em grade salvo: ${gridFilePath}\n`);

    // 6. Gerar versão com gabarito
    const gridWithAnswers = gridFormatter.generateComplete(problems, stats, {
      includeStats: true,
      includeAnswerKey: true
    });
    const answerKeyPath = path.join(
      CONFIG.outputDir,
      `exercicio-50-problemas-${CONFIG.difficulty}-gabarito.md`
    );
    await fs.writeFile(answerKeyPath, gridWithAnswers, 'utf-8');
    console.log(`✅ Gabarito salvo: ${answerKeyPath}\n`);

    // 7. Gerar problemas contextualizados (se IA habilitada ou usar templates)
    if (CONFIG.useAI || true) { // Sempre gerar, usando templates se necessário
      console.log('📚 Gerando problemas contextualizados...');
      
      // Carregar cache na memória
      await cacheManager.loadToMemory();

      // Selecionar 10 problemas aleatórios para contextualizar
      const selectedProblems = [];
      const step = Math.floor(problems.length / 10);
      for (let i = 0; i < 10; i++) {
        selectedProblems.push(problems[i * step]);
      }

      const contextualProblems = [];
      
      // Separar problemas cacheados e não-cacheados
      const problemsWithCache = [];
      const problemsNeedingGeneration = [];
      
      for (const problem of selectedProblems) {
        const cached = await cacheManager.get(problem);
        if (cached) {
          problemsWithCache.push({ problem, context: cached });
          console.log(`   ✓ Cache: ${problem.num1} ${problem.operation} ${problem.num2}`);
        } else {
          problemsNeedingGeneration.push(problem);
        }
      }
      
      // Gerar contextos em lote para problemas não-cacheados
      let generatedContexts = [];
      if (problemsNeedingGeneration.length > 0) {
        if (aiEnhancer) {
          const modelName = process.env.GEMINI_MODEL || 'gemini-flash-latest';
          console.log(`   🔄 Gerando ${problemsNeedingGeneration.length} contextos com IA (${modelName})...`);
          generatedContexts = await aiEnhancer.generateContextsBatch(problemsNeedingGeneration);
          console.log(`   ✓ ${problemsNeedingGeneration.length} contextos gerados em 1 request`);
        } else {
          generatedContexts = problemsNeedingGeneration.map(p => 
            `Cecília tem ${p.num1} itens e ${p.type === 'addition' ? 'ganhou' : 'deu'} ${p.num2} itens.`
          );
          console.log(`   ✓ ${problemsNeedingGeneration.length} templates gerados`);
        }
        
        // Salvar no cache
        for (let i = 0; i < problemsNeedingGeneration.length; i++) {
          await cacheManager.set(problemsNeedingGeneration[i], generatedContexts[i]);
        }
      }
      
      // Combinar resultados mantendo ordem original
      for (const problem of selectedProblems) {
        const cached = problemsWithCache.find(p => p.problem === problem);
        let context;
        
        if (cached) {
          context = cached.context;
        } else {
          const index = problemsNeedingGeneration.indexOf(problem);
          context = generatedContexts[index];
        }

        const question = problem.type === 'addition' 
          ? 'Quantos no total?'
          : 'Quantos restaram?';

        contextualProblems.push({
          context,
          question,
          answer: problem.answer,
          num1: problem.num1,
          num2: problem.num2,
          operation: problem.operation
        });
      }

      // Gerar documento com problemas contextualizados
      const contextualExercise = gridFormatter.generateWithContext(
        contextualProblems,
        stats,
        {
          includeStats: false,
          includeAnswerKey: false
        }
      );

      const contextualPath = path.join(
        CONFIG.outputDir,
        `problemas-contextualizados-${CONFIG.difficulty}.md`
      );
      await fs.writeFile(contextualPath, contextualExercise, 'utf-8');
      console.log(`✅ Problemas contextualizados salvos: ${contextualPath}\n`);

      // Versão com gabarito
      const contextualWithAnswers = gridFormatter.generateWithContext(
        contextualProblems,
        stats,
        {
          includeStats: false,
          includeAnswerKey: true
        }
      );
      const contextualAnswerPath = path.join(
        CONFIG.outputDir,
        `problemas-contextualizados-${CONFIG.difficulty}-gabarito.md`
      );
      await fs.writeFile(contextualAnswerPath, contextualWithAnswers, 'utf-8');
      console.log(`✅ Gabarito contextualizado salvo: ${contextualAnswerPath}\n`);
    }

    // 8. Exibir estatísticas do cache
    const cacheStats = await cacheManager.getStats();
    console.log('💾 Estatísticas do Cache:');
    console.log(`   - Em memória: ${cacheStats.memorySize} itens`);
    console.log(`   - Em arquivo: ${cacheStats.fileCount} itens`);
    console.log(`   - Adição: ${cacheStats.byType?.addition || 0}`);
    console.log(`   - Subtração: ${cacheStats.byType?.subtraction || 0}\n`);

    // 9. Exibir estatísticas da API (se IA habilitada)
    if (aiEnhancer && aiEnhancer.isEnabled()) {
      const apiStats = aiEnhancer.getUsageStats();
      console.log('🤖 Estatísticas da API Gemini:');
      console.log(`   - Requisições realizadas: ${apiStats.requestCount}`);
      console.log(`   - Limite por minuto: ${apiStats.requestsPerMinute}`);
      if (apiStats.quotaExceeded) {
        const resetTime = new Date(apiStats.quotaResetTime).toLocaleTimeString('pt-BR');
        console.log(`   - ⚠️  Quota excedida. Reset em: ${resetTime}`);
      } else {
        console.log(`   - Status: ✅ Normal`);
      }
      console.log();
    }

    // 10. Resumo final
    console.log('═══════════════════════════════════════');
    console.log('✅ GERAÇÃO CONCLUÍDA COM SUCESSO!\n');
    console.log('📁 Arquivos gerados:');
    console.log(`   1. ${gridFilePath}`);
    console.log(`   2. ${answerKeyPath}`);
    if (CONFIG.useAI || true) {
      console.log(`   3. ${path.join(CONFIG.outputDir, `problemas-contextualizados-${CONFIG.difficulty}.md`)}`);
      console.log(`   4. ${path.join(CONFIG.outputDir, `problemas-contextualizados-${CONFIG.difficulty}-gabarito.md`)}`);
    }
    console.log('\n🎉 Bons estudos para Cecília!');

  } catch (error) {
    console.error('❌ Erro durante a geração:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

/**
 * Helper para delay
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Executar
if (require.main === module) {
  main();
}

module.exports = { main };
