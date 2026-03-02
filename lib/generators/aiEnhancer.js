/**
 * AI Enhancer - Google Gemini Integration
 * Generates diverse narrative contexts for math problems
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import { containsAnyName, getAllNamesString, getRandomName } from '../constants/namePool.ts';
import TemplateLibrary from './templateLibrary.js';

class AIEnhancer {
  constructor(apiKey, options = {}) {
    this.apiKey = apiKey;
    this.enabled = !!apiKey;
    this.templateLibrary = new TemplateLibrary();
    this.options = {
      model: options.model || 'gemini-2.0-flash-exp',
      maxRetries: options.maxRetries || 3,
      temperature: options.temperature || 0.7,
      baseDelay: options.baseDelay || 1000, // 1 second base
      maxDelay: options.maxDelay || 60000, // 60 seconds maximum
      requestsPerMinute: options.requestsPerMinute || 10, // Conservative limit
      ...options,
    };

    // Rate limiting control
    this.lastRequestTime = 0;
    this.requestCount = 0;
    this.quotaExceeded = false;
    this.quotaResetTime = null;

    if (this.enabled) {
      this.genAI = new GoogleGenerativeAI(apiKey);
      this.model = this.genAI.getGenerativeModel({
        model: this.options.model,
      });
    }
  }

  /**
   * Creates a structured prompt for Gemini
   */
  createPrompt(problem, characterName = null) {
    const name = characterName || getRandomName();
    const operationMap = {
      addition: { name: 'adição', action: 'juntar, ganhar, somar' },
      subtraction: { name: 'subtração', action: 'tirar, dar, perder, usar' },
      multiplication: { name: 'multiplicação', action: 'grupos de, vezes, multiplicar' },
      division: { name: 'divisão', action: 'dividir, repartir, distribuir' }
    };
    const opInfo = operationMap[problem.type] || { name: 'operação', action: 'calcular' };

    return `Você é um assistente educacional criando problemas de matemática para crianças brasileiras.

CONTEXTO DO PROBLEMA:
- Operação: ${opInfo.name} (${problem.num1} ${problem.operation} ${problem.num2})
- Resposta: ${problem.answer}
- Personagem: ${name} (criança brasileira, 7-9 anos)

REGRAS ESTRITAS:
1. Use APENAS português brasileiro informal e acolhedor
2. Crie UMA única frase curta (máximo 20 palavras) sobre ${name}
3. Use ações relacionadas a: ${opInfo.action}
4. Tom POSITIVO e ALEGRE
5. Contextos permitidos: brinquedos, frutas, material escolar, animais fofos, natureza
6. DEVE incluir os números ${problem.num1} e ${problem.num2} na história
7. NÃO inclua a operação matemática (+, −, ×, ÷, =)
8. Crie uma pergunta VARIADA e CRIATIVA (não use sempre a mesma)
9. NÃO use palavras negativas: triste, perdeu (se evitável), quebrou, machucou

TEMAS SUGERIDOS:
🎨 Brinquedos: carrinhos, bonecas, blocos, bolas, ursinhos
🍎 Frutas: maçãs, morangos, bananas, laranjas
📚 Escola: lápis, livros, cadernos, figurinhas
🦋 Animais: borboletas, passarinhos, coelhos, gatinhos
🌸 Natureza: flores, estrelas, árvores

EXEMPLOS DE SAÍDA (JSON):
{"context": "${name} tinha ${problem.num1} figurinhas e ganhou mais ${problem.num2} figurinhas da amiga.", "question": "Quantas figurinhas ${name} tem agora?"}
{"context": "${name} tem ${problem.num1} lápis de cor e comprou ${problem.num2} lápis novos.", "question": "Quantos lápis ${name} possui no total?"}

Agora crie UM JSON com context e question para ${name} (usando os números ${problem.num1} e ${problem.num2}):`;
  }

  /**
   * Creates a batch prompt for multiple problems
   */
  createBatchPrompt(problems, characterNames = []) {
    const _namesUsed =
      characterNames.length > 0 ? characterNames : problems.map(() => getRandomName());
    const namesString = getAllNamesString();

    return `Você é um assistente educacional criando problemas de matemática para crianças brasileiras.

CONTEXTO GERAL:
- Use APENAS estes nomes de personagens: ${namesString}
- Para cada problema, use o nome especificado
- Temas: brinquedos, frutas, material escolar, animais fofos, natureza

REGRAS ESTRITAS:
1. Use APENAS português brasileiro informal e acolhedor
2. Crie UMA única frase curta (máximo 20 palavras) para CADA problema
3. Tom POSITIVO e ALEGRE
4. DEVE incluir os números específicos na história
5. NÃO inclua operação matemática (+, −, ×, ÷, =)
6. Crie perguntas VARIADAS e CRIATIVAS (mude a formulação entre problemas)
7. NÃO use palavras negativas: triste, perdeu (se evitável), quebrou, machucou
8. VARIE os temas entre os problemas (não repita contextos similares)

VARIAÇÕES DE PERGUNTAS SUGERIDAS:
➕ Adição: "Quantos no total?", "Quantos tem agora?", "Quantos ficaram?", "Qual o total?"
➖ Subtração: "Quantos restaram?", "Quantos sobraram?", "Quantos ainda tem?", "Quanto sobrou?"
✖️ Multiplicação: "Quantos ao todo?", "Quantos são no total?", "Qual o total?"
➗ Divisão: "Quantos para cada um?", "Quanto cada um recebe?", "Quantos em cada grupo?"

Crie um objeto JSON para CADA um dos ${problems.length} problemas abaixo.
Retorne APENAS os JSONs, um por linha, numerados de 1 a ${problems.length}:

${problems
  .map((p, i) => {
    const operationMap = {
      addition: { name: 'adição', action: 'ganhar/juntar' },
      subtraction: { name: 'subtração', action: 'dar/usar' },
      multiplication: { name: 'multiplicação', action: 'grupos/vezes' },
      division: { name: 'divisão', action: 'dividir/repartir' }
    };
    const opInfo = operationMap[p.type] || { name: 'operação', action: 'calcular' };
    return `${i + 1}. Operação: ${opInfo.name} (${p.num1} ${p.operation} ${p.num2}) - Ação: ${opInfo.action}`;
  })
  .join('\n')}

FORMATO DE SAÍDA OBRIGATÓRIO (JSON):
1. {"context": "[frase narrativa do problema 1]", "question": "[pergunta variada 1]"}
2. {"context": "[frase narrativa do problema 2]", "question": "[pergunta variada 2]"}
3. {"context": "[frase narrativa do problema 3]", "question": "[pergunta variada 3]"}
... e assim por diante`;
  }

  /**
   * Waits minimum interval between requests to respect rate limits
   */
  async waitForRateLimit() {
    const now = Date.now();
    const minInterval = (60 * 1000) / this.options.requestsPerMinute; // Minimum interval between requests
    const timeSinceLastRequest = now - this.lastRequestTime;

    if (timeSinceLastRequest < minInterval) {
      const waitTime = minInterval - timeSinceLastRequest;
      await this.sleep(waitTime);
    }

    this.lastRequestTime = Date.now();
  }

  /**
   * Extracts retry time from 429 error message
   */
  extractRetryTime(errorMessage) {
    // Try to extract seconds "retry in 57.247271744s" or "Please retry in 57s"
    const secondsMatch = errorMessage.match(/retry in (\d+(?:\.\d+)?)\s*s/i);
    if (secondsMatch) {
      return Date.now() + parseFloat(secondsMatch[1]) * 1000;
    }

    // Default: 60 seconds
    return Date.now() + 60000;
  }

  /**
   * Generates a context using AI with retry and exponential backoff
   */
  async generateContext(problem) {
    if (!this.enabled) {
      return this.templateLibrary.getContext(problem.type, problem.num1, problem.num2);
    }

    // If quota exceeded, check if reset time has passed
    if (this.quotaExceeded && this.quotaResetTime) {
      const now = Date.now();
      if (now < this.quotaResetTime) {
        const waitSeconds = Math.ceil((this.quotaResetTime - now) / 1000);
        console.warn(`⚠️  Quota exceeded. Reset in ${waitSeconds}s. Using template.`);
        return this.templateLibrary.getContext(problem.type, problem.num1, problem.num2);
      } else {
        // Reset quota
        this.quotaExceeded = false;
        this.quotaResetTime = null;
      }
    }

    let _lastError = null;

    for (let attempt = 0; attempt < this.options.maxRetries; attempt++) {
      try {
        // Rate limiting: wait between requests
        await this.waitForRateLimit();

        const prompt = this.createPrompt(problem);
        const result = await this.model.generateContent(prompt);
        const response = await result.response;
        let text = response.text().trim();

        // Remove quotes if they exist
        text = text.replace(/^["']|["']$/g, '');

        // Increment successful requests counter
        this.requestCount++;

        if (this.validateContext(text)) {
          return text;
        } else {
          return this.templateLibrary.getContext(problem.type, problem.num1, problem.num2);
        }
      } catch (error) {
        _lastError = error;
        const errorMessage = error.message || '';

        // Check if it's a rate limit error (429) or quota exceeded
        if (
          errorMessage.includes('429') ||
          errorMessage.includes('Too Many Requests') ||
          errorMessage.includes('Quota exceeded')
        ) {
          this.quotaResetTime = this.extractRetryTime(errorMessage);
          this.quotaExceeded = true;
          return this.templateLibrary.getContext(problem.type, problem.num1, problem.num2);
        }

        // For other errors, retry with exponential backoff
        if (attempt < this.options.maxRetries - 1) {
          const delay = Math.min(this.options.baseDelay * 2 ** attempt, this.options.maxDelay);
          await this.sleep(delay);
        }
      }
    }

    return this.templateLibrary.getContext(problem.type, problem.num1, problem.num2);
  }

  /**
   * Generates contexts for multiple problems in a single request
   * Returns both contexts and questions generated by AI
   */
  async generateContextsBatch(problems) {
    if (!this.enabled || this.quotaExceeded) {
      return {
        contexts: problems.map((p) => this.templateLibrary.getContext(p.type, p.num1, p.num2)),
        questions: null, // null indica que deve usar pool de perguntas
      };
    }

    let _lastError = null;

    for (let attempt = 0; attempt < this.options.maxRetries; attempt++) {
      try {
        await this.waitForRateLimit();

        const prompt = this.createBatchPrompt(problems);
        const result = await this.model.generateContent(prompt);
        const response = await result.response;
        const text = response.text().trim();

        this.requestCount++;

        // Parse das linhas numeradas
        const lines = text.split('\n').filter((line) => line.trim());
        const contexts = [];
        const questions = [];

        for (let i = 0; i < problems.length; i++) {
          let context = null;
          let question = null;

          // Tentar encontrar linha correspondente
          const linePattern = new RegExp(`^\\s*${i + 1}[\\.)\\-:]\\s*(.+)$`);
          const matchingLine = lines.find((line) => linePattern.test(line));

          if (matchingLine) {
            const match = matchingLine.match(linePattern);
            const content = match[1].trim();
            
            // Tentar parsear como JSON (novo formato)
            try {
              const parsed = JSON.parse(content);
              if (parsed.context && parsed.question) {
                context = parsed.context.trim().replace(/^["']|["']$/g, '');
                question = parsed.question.trim().replace(/^["']|["']$/g, '');
              }
            } catch (_jsonError) {
              // Fallback: formato antigo (apenas texto)
              context = content.replace(/^["']|["']$/g, '');
            }
          } else if (lines[i]) {
            // Fallback: usar linha por índice
            const content = lines[i]
              .replace(/^\d+[.)\-:]\s*/, '')
              .trim();
            
            try {
              const parsed = JSON.parse(content);
              if (parsed.context && parsed.question) {
                context = parsed.context.trim().replace(/^["']|["']$/g, '');
                question = parsed.question.trim().replace(/^["']|["']$/g, '');
              }
            } catch (_jsonError) {
              context = content.replace(/^["']|["']$/g, '');
            }
          }

          // Validar contexto
          if (context && this.validateContext(context)) {
            contexts.push(context);
            questions.push(question); // pode ser null
          } else {
            // Use template if validation fails
            const p = problems[i];
            contexts.push(this.templateLibrary.getContext(p.type, p.num1, p.num2));
            questions.push(null); // usar pool de perguntas
          }
        }

        return { contexts, questions };
      } catch (error) {
        _lastError = error;
        const errorMessage = error.message || '';

        if (
          errorMessage.includes('429') ||
          errorMessage.includes('Too Many Requests') ||
          errorMessage.includes('Quota exceeded')
        ) {
          this.quotaResetTime = this.extractRetryTime(errorMessage);
          this.quotaExceeded = true;
          return {
            contexts: problems.map((p) => this.templateLibrary.getContext(p.type, p.num1, p.num2)),
            questions: null,
          };
        }

        if (attempt < this.options.maxRetries - 1) {
          const delay = Math.min(this.options.baseDelay * 2 ** attempt, this.options.maxDelay);
          await this.sleep(delay);
        }
      }
    }

    return {
      contexts: problems.map((p) => this.templateLibrary.getContext(p.type, p.num1, p.num2)),
      questions: null,
    };
  }

  /**
   * Validates if the generated context is appropriate
   */
  validateContext(text) {
    // Check length
    if (!text || text.length < 10 || text.length > 200) {
      return false;
    }

    // Inappropriate words
    const inappropriate = [
      'morte',
      'morrer',
      'matar',
      'violência',
      'sangue',
      'medo',
      'terror',
      'horror',
      'dor',
      'doer',
      'machucar',
      'feio',
      'horrível',
      'péssimo',
      'ruim',
    ];

    const lowerText = text.toLowerCase();
    if (inappropriate.some((word) => lowerText.includes(word))) {
      return false;
    }

    // Check if it doesn't contain explicit numbers (avoid "3 + 2")
    if (/\d+\s*[+\-×÷]\s*\d+/.test(text)) {
      return false;
    }

    // Check if contains any name from the pool
    if (!containsAnyName(text)) {
      return false;
    }

    return true;
  }

  /**
   * Generates complete contextualized problem
   */
  async generateWordProblem(problem) {
    const context = await this.generateContext(problem);

    const question = problem.type === 'addition' ? 'Quantos no total?' : 'Quantos restaram?';

    return {
      context,
      question,
      numbers: `${problem.num1} ${problem.operation} ${problem.num2} = ____`,
      answer: problem.answer,
    };
  }

  /**
   * Generates multiple contexts in batch with internally managed rate limiting
   */
  async generateBatch(problems) {
    const contexts = [];

    for (const problem of problems) {
      const context = await this.generateContext(problem);
      contexts.push(context);
      // Rate limiting is now managed internally by waitForRateLimit
    }

    return contexts;
  }

  /**
   * Returns API usage statistics
   */
  getUsageStats() {
    return {
      requestCount: this.requestCount,
      quotaExceeded: this.quotaExceeded,
      quotaResetTime: this.quotaResetTime,
      requestsPerMinute: this.options.requestsPerMinute,
    };
  }

  /**
   * Helper for delay
   */
  sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Checks if AI is available
   */
  isEnabled() {
    return this.enabled;
  }

  /**
   * Fallback to templates
   */
  getFallbackContext(problem) {
    return this.templateLibrary.getContext(problem.type, problem.num1, problem.num2);
  }
}

export default AIEnhancer;
