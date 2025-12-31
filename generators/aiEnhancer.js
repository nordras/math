/**
 * AI Enhancer - Integração com Google Gemini
 * Gera contextos narrativos diversos para problemas matemáticos
 */

const { GoogleGenerativeAI } = require('@google/generative-ai');
const TemplateLibrary = require('./templateLibrary');

class AIEnhancer {
  constructor(apiKey, options = {}) {
    this.apiKey = apiKey;
    this.enabled = !!apiKey;
    this.templateLibrary = new TemplateLibrary();
    this.options = {
      model: options.model || 'gemini-flash-latest',
      maxRetries: options.maxRetries || 3,
      temperature: options.temperature || 0.7,
      baseDelay: options.baseDelay || 1000, // 1 segundo base
      maxDelay: options.maxDelay || 60000, // 60 segundos máximo
      requestsPerMinute: options.requestsPerMinute || 10, // Limite conservador
      ...options
    };
    
    // Controle de rate limiting
    this.lastRequestTime = 0;
    this.requestCount = 0;
    this.quotaExceeded = false;
    this.quotaResetTime = null;

    if (this.enabled) {
      this.genAI = new GoogleGenerativeAI(apiKey);
      this.model = this.genAI.getGenerativeModel({ 
        model: this.options.model 
      });
    }
  }

  /**
   * Cria um prompt estruturado para o Gemini
   */
  createPrompt(problem) {
    const operation = problem.type === 'addition' ? 'adição' : 'subtração';
    const action = problem.type === 'addition' 
      ? 'juntar, ganhar, somar' 
      : 'tirar, dar, perder, usar';

    return `Você é um assistente educacional criando problemas de matemática para crianças brasileiras.

CONTEXTO DO PROBLEMA:
- Operação: ${operation} (${problem.num1} ${problem.operation} ${problem.num2})
- Resposta: ${problem.answer}
- Personagem: Cecília (menina brasileira, 7-9 anos)

REGRAS ESTRITAS:
1. Use APENAS português brasileiro informal e acolhedor
2. Crie UMA única frase curta (máximo 20 palavras) sobre Cecília
3. Use ações relacionadas a: ${action}
4. Tom POSITIVO e ALEGRE
5. Contextos permitidos: brinquedos, frutas, material escolar, animais fofos, natureza
6. DEVE incluir os números ${problem.num1} e ${problem.num2} na história
7. NÃO inclua a operação matemática (+, −, =)
8. NÃO inclua perguntas ou respostas
9. NÃO use palavras negativas: triste, perdeu (se evitável), quebrou, machucou

TEMAS SUGERIDOS:
🎨 Brinquedos: carrinhos, bonecas, blocos, bolas, ursinhos
🍎 Frutas: maçãs, morangos, bananas, laranjas
📚 Escola: lápis, livros, cadernos, figurinhas
🦋 Animais: borboletas, passarinhos, coelhos, gatinhos
🌸 Natureza: flores, estrelas, árvores

EXEMPLOS DE SAÍDA:
"Cecília tinha ${problem.num1} figurinhas e ganhou mais ${problem.num2} figurinhas da amiga."
"Cecília tem ${problem.num1} lápis de cor e comprou ${problem.num2} lápis novos."
"Cecília colheu ${problem.num1} morangos no jardim e deu ${problem.num2} morangos para a vovó."

Agora crie APENAS a frase narrativa (com os números ${problem.num1} e ${problem.num2}):`;
  }

  /**
   * Cria um prompt em lote para múltiplos problemas
   */
  createBatchPrompt(problems) {
    return `Você é um assistente educacional criando problemas de matemática para crianças brasileiras.

CONTEXTO GERAL:
- Personagem: Cecília (menina brasileira, 7-9 anos)
- Temas: brinquedos, frutas, material escolar, animais fofos, natureza

REGRAS ESTRITAS:
1. Use APENAS português brasileiro informal e acolhedor
2. Crie UMA única frase curta (máximo 20 palavras) para CADA problema
3. Tom POSITIVO e ALEGRE
4. DEVE incluir os números específicos na história
5. NÃO inclua operação matemática (+, −, =)
6. NÃO inclua perguntas ou respostas
7. NÃO use palavras negativas: triste, perdeu (se evitável), quebrou, machucou
8. VARIE os temas entre os problemas (não repita contextos similares)

Crie uma frase narrativa para CADA um dos ${problems.length} problemas abaixo.
Retorne APENAS as frases, uma por linha, numeradas de 1 a ${problems.length}:

${problems.map((p, i) => {
  const operation = p.type === 'addition' ? 'adição' : 'subtração';
  const action = p.type === 'addition' ? 'ganhar/juntar' : 'dar/usar';
  return `${i + 1}. Operação: ${operation} (${p.num1} ${p.operation} ${p.num2}) - Ação: ${action}`;
}).join('\n')}

FORMATO DE SAÍDA OBRIGATÓRIO:
1. [frase para o problema 1]
2. [frase para o problema 2]
3. [frase para o problema 3]
... e assim por diante`;
  }

  /**
   * Aguarda intervalo mínimo entre requisições para respeitar rate limits
   */
  async waitForRateLimit() {
    const now = Date.now();
    const minInterval = (60 * 1000) / this.options.requestsPerMinute; // Intervalo mínimo entre requisições
    const timeSinceLastRequest = now - this.lastRequestTime;
    
    if (timeSinceLastRequest < minInterval) {
      const waitTime = minInterval - timeSinceLastRequest;
      await this.sleep(waitTime);
    }
    
    this.lastRequestTime = Date.now();
  }

  /**
   * Extrai tempo de retry da mensagem de erro 429
   */
  extractRetryTime(errorMessage) {
    // Tentar extrair segundos "retry in 57.247271744s" ou "Please retry in 57s"
    const secondsMatch = errorMessage.match(/retry in (\d+(?:\.\d+)?)\s*s/i);
    if (secondsMatch) {
      return Date.now() + (parseFloat(secondsMatch[1]) * 1000);
    }
    
    // Default: 60 segundos
    return Date.now() + 60000;
  }

  /**
   * Gera um contexto usando IA
   */
  /**
   * Gera um contexto usando IA com retry e backoff exponencial
   */
  async generateContext(problem) {
    if (!this.enabled) {
      return this.templateLibrary.getContext(problem.type, problem.num1, problem.num2);
    }

    // Se quota excedida, verificar se já passou o tempo de reset
    if (this.quotaExceeded && this.quotaResetTime) {
      const now = Date.now();
      if (now < this.quotaResetTime) {
        const waitSeconds = Math.ceil((this.quotaResetTime - now) / 1000);
        console.warn(`⚠️  Quota excedida. Reset em ${waitSeconds}s. Usando template.`);
        return this.templateLibrary.getContext(problem.type, problem.num1, problem.num2);
      } else {
        // Reset da quota
        this.quotaExceeded = false;
        this.quotaResetTime = null;
      }
    }

    let lastError = null;
    
    for (let attempt = 0; attempt < this.options.maxRetries; attempt++) {
      try {
        // Rate limiting: aguardar entre requisições
        await this.waitForRateLimit();
        
        const prompt = this.createPrompt(problem);
        const result = await this.model.generateContent(prompt);
        const response = await result.response;
        let text = response.text().trim();

        // Remover aspas se existirem
        text = text.replace(/^["']|["']$/g, '');

        // Incrementar contador de requisições bem-sucedidas
        this.requestCount++;

        // Validar a resposta
        if (this.validateContext(text)) {
          return text;
        } else {
          console.warn('⚠️  Contexto da IA falhou na validação, usando template');
          return this.templateLibrary.getContext(problem.type, problem.num1, problem.num2);
        }

      } catch (error) {
        lastError = error;
        const errorMessage = error.message || '';
        
        // Verificar se é erro de rate limit (429) ou quota excedida
        if (errorMessage.includes('429') || errorMessage.includes('Too Many Requests') || errorMessage.includes('Quota exceeded')) {
          console.warn(`⚠️  Quota/Rate limit excedido (erro 429)`);
          
          // Extrair tempo de retry da mensagem de erro
          this.quotaResetTime = this.extractRetryTime(errorMessage);
          this.quotaExceeded = true;
          
          const waitSeconds = Math.ceil((this.quotaResetTime - Date.now()) / 1000);
          console.warn(`   Próximo reset em: ${waitSeconds}s`);
          console.warn(`   Usando templates para requisições subsequentes...`);
          
          // Usar template imediatamente
          return this.templateLibrary.getContext(problem.type, problem.num1, problem.num2);
        }
        
        // Para outros erros, tentar novamente com backoff exponencial
        if (attempt < this.options.maxRetries - 1) {
          const delay = Math.min(
            this.options.baseDelay * Math.pow(2, attempt),
            this.options.maxDelay
          );
          console.warn(`⚠️  Tentativa ${attempt + 1}/${this.options.maxRetries} falhou.`);
          console.warn(`   Aguardando ${delay}ms antes de retry...`);
          await this.sleep(delay);
        }
      }
    }
    
    // Se todas as tentativas falharam, usar template
    console.warn('⚠️  Todas as tentativas falharam, usando template:', lastError?.message);
    return this.templateLibrary.getContext(problem.type, problem.num1, problem.num2);
  }

  /**
   * Gera contextos para múltiplos problemas em uma única requisição
   */
  async generateContextsBatch(problems) {
    if (!this.enabled || this.quotaExceeded) {
      return problems.map(p => this.templateLibrary.getContext(p.type, p.num1, p.num2));
    }

    let lastError = null;

    for (let attempt = 0; attempt < this.options.maxRetries; attempt++) {
      try {
        await this.waitForRateLimit();
        
        const prompt = this.createBatchPrompt(problems);
        const result = await this.model.generateContent(prompt);
        const response = await result.response;
        let text = response.text().trim();

        this.requestCount++;

        // Parse das linhas numeradas
        const lines = text.split('\n').filter(line => line.trim());
        const contexts = [];

        for (let i = 0; i < problems.length; i++) {
          let context = null;
          
          // Tentar encontrar linha correspondente
          const linePattern = new RegExp(`^\\s*${i + 1}[\\.)\\-:]\\s*(.+)$`);
          const matchingLine = lines.find(line => linePattern.test(line));
          
          if (matchingLine) {
            const match = matchingLine.match(linePattern);
            context = match[1].trim().replace(/^["']|["']$/g, '');
          } else if (lines[i]) {
            // Fallback: usar linha por índice
            context = lines[i].replace(/^\d+[\.)\-:]\s*/, '').trim().replace(/^["']|["']$/g, '');
          }

          // Validar contexto
          if (context && this.validateContext(context)) {
            contexts.push(context);
          } else {
            // Usar template se validação falhar
            const p = problems[i];
            contexts.push(this.templateLibrary.getContext(p.type, p.num1, p.num2));
          }
        }

        return contexts;

      } catch (error) {
        lastError = error;
        const errorMessage = error.message || '';
        
        if (errorMessage.includes('429') || errorMessage.includes('Too Many Requests') || errorMessage.includes('Quota exceeded')) {
          console.warn(`⚠️  Quota/Rate limit excedido (erro 429)`);
          this.quotaResetTime = this.extractRetryTime(errorMessage);
          this.quotaExceeded = true;
          
          const waitSeconds = Math.ceil((this.quotaResetTime - Date.now()) / 1000);
          console.warn(`   Próximo reset em: ${waitSeconds}s`);
          console.warn(`   Usando templates para todas as requisições...`);
          
          return problems.map(p => this.templateLibrary.getContext(p.type, p.num1, p.num2));
        }
        
        if (attempt < this.options.maxRetries - 1) {
          const delay = Math.min(
            this.options.baseDelay * Math.pow(2, attempt),
            this.options.maxDelay
          );
          console.warn(`⚠️  Tentativa ${attempt + 1}/${this.options.maxRetries} falhou.`);
          console.warn(`   Aguardando ${delay}ms antes de retry...`);
          await this.sleep(delay);
        }
      }
    }
    
    // Se todas as tentativas falharam, usar templates
    console.warn('⚠️  Todas as tentativas falharam, usando templates:', lastError?.message);
    return problems.map(p => this.templateLibrary.getContext(p.type, p.num1, p.num2));
  }

  /**
   * Valida se o contexto gerado é apropriado
   */
  validateContext(text) {
    // Verificar comprimento
    if (!text || text.length < 10 || text.length > 200) {
      return false;
    }

    // Palavras inadequadas
    const inappropriate = [
      'morte', 'morrer', 'matar', 'violência', 'sangue',
      'medo', 'terror', 'horror', 'dor', 'doer', 'machucar',
      'feio', 'horrível', 'péssimo', 'ruim'
    ];

    const lowerText = text.toLowerCase();
    if (inappropriate.some(word => lowerText.includes(word))) {
      return false;
    }

    // Verificar se não contém números explícitos (evitar "3 + 2")
    if (/\d+\s*[+\-×÷]\s*\d+/.test(text)) {
      return false;
    }

    // Verificar se contém "Cecília"
    if (!lowerText.includes('cecília') && !lowerText.includes('cecilia')) {
      return false;
    }

    return true;
  }

  /**
   * Gera problema contextualizado completo
   */
  async generateWordProblem(problem) {
    const context = await this.generateContext(problem);
    
    const question = problem.type === 'addition' 
      ? 'Quantos no total?'
      : 'Quantos restaram?';

    return {
      context,
      question,
      numbers: `${problem.num1} ${problem.operation} ${problem.num2} = ____`,
      answer: problem.answer
    };
  }

  /**
   * Gera múltiplos contextos em lote com rate limiting gerenciado internamente
   */
  async generateBatch(problems) {
    const contexts = [];

    for (const problem of problems) {
      const context = await this.generateContext(problem);
      contexts.push(context);
      // Rate limiting agora é gerenciado internamente pelo waitForRateLimit
    }

    return contexts;
  }

  /**
   * Retorna estatísticas de uso da API
   */
  getUsageStats() {
    return {
      requestCount: this.requestCount,
      quotaExceeded: this.quotaExceeded,
      quotaResetTime: this.quotaResetTime,
      requestsPerMinute: this.options.requestsPerMinute
    };
  }

  /**
   * Helper para delay
   */
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Verifica se a IA está disponível
   */
  isEnabled() {
    return this.enabled;
  }

  /**
   * Fallback para templates
   */
  getFallbackContext(problem) {
    return this.templateLibrary.getContext(problem.type, problem.num1, problem.num2);
  }
}

module.exports = AIEnhancer;
