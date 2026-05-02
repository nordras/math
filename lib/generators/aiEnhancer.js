/**
 * AI Enhancer - Google Gemini Integration
 * Generates diverse narrative contexts for math problems
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import { containsAnyName, getAllNamesString, getRandomName, getRandomNames } from '../constants/namePool.ts';
import TemplateLibrary from './templateLibrary.js';

const QUESTION_POOL = {
  addition: [
    'Quantos no total?',
    'Quantos ficaram ao todo?',
    'Qual é o total?',
    'Quantos são juntos?',
    'Quantos tem agora?',
  ],
  subtraction: [
    'Quantos restaram?',
    'Quantos sobraram?',
    'Quantos ainda tem?',
    'Quanto sobrou?',
    'Com quantos ficou?',
  ],
  multiplication: [
    'Quantos ao todo?',
    'Quantos são no total?',
    'Qual o total?',
    'Quantos em todos os grupos?',
    'Quantos tem no total?',
  ],
  division: [
    'Quantos para cada um?',
    'Quanto cada um recebe?',
    'Quantos em cada grupo?',
    'Quanto fica para cada um?',
    'Quantos em cada parte?',
  ],
};

function pickQuestion(operationType) {
  const pool = QUESTION_POOL[operationType] || ['Qual é o resultado?'];
  return pool[Math.floor(Math.random() * pool.length)];
}

class AIEnhancer {
  constructor(apiKey, options = {}) {
    this.apiKey = apiKey;
    this.enabled = !!apiKey;
    this.templateLibrary = new TemplateLibrary();
    this.options = {
      model: options.model || 'gemini-2.0-flash-exp',
      maxRetries: options.maxRetries || 3,
      temperature: options.temperature || 0.7,
      baseDelay: options.baseDelay || 1000,
      maxDelay: options.maxDelay || 60000,
      requestsPerMinute: options.requestsPerMinute || 10,
      ...options,
    };

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
   * Creates a structured prompt for a single problem
   */
  createPrompt(problem, characterName = null) {
    const name = characterName || getRandomName();
    const operationMap = {
      addition: { name: 'adição', action: 'juntar, ganhar, somar' },
      subtraction: { name: 'subtração', action: 'tirar, dar, usar' },
      multiplication: { name: 'multiplicação', action: 'grupos de, vezes, multiplicar' },
      division: { name: 'divisão', action: 'dividir, repartir, distribuir' },
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
   * Creates a batch prompt for multiple problems, assigning a unique name per problem
   */
  createBatchPrompt(problems) {
    const names = getRandomNames(problems.length);
    const namesString = getAllNamesString();

    const problemLines = problems
      .map((p, i) => {
        const operationMap = {
          addition: { name: 'adição', action: 'ganhar/juntar' },
          subtraction: { name: 'subtração', action: 'dar/usar' },
          multiplication: { name: 'multiplicação', action: 'grupos/vezes' },
          division: { name: 'divisão', action: 'dividir/repartir' },
        };
        const opInfo = operationMap[p.type] || { name: 'operação', action: 'calcular' };
        return `${i + 1}. Operação: ${opInfo.name} (${p.num1} ${p.operation} ${p.num2}) - Ação: ${opInfo.action} - Personagem: ${names[i]}`;
      })
      .join('\n');

    return `Você é um assistente educacional criando problemas de matemática para crianças brasileiras.

CONTEXTO GERAL:
- Nomes disponíveis: ${namesString}
- Para cada problema, use EXATAMENTE o personagem indicado
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
➕ Adição: "Quantos no total?", "Quantos tem agora?", "Quantos ficaram ao todo?"
➖ Subtração: "Quantos restaram?", "Quantos sobraram?", "Quanto sobrou?"
✖️ Multiplicação: "Quantos ao todo?", "Quantos em todos os grupos?", "Qual o total?"
➗ Divisão: "Quantos para cada um?", "Quanto cada um recebe?", "Quantos em cada grupo?"

Crie um objeto JSON para CADA um dos ${problems.length} problemas abaixo.
Retorne APENAS os JSONs, um por linha, numerados de 1 a ${problems.length}:

${problemLines}

FORMATO DE SAÍDA OBRIGATÓRIO (JSON em linha única):
1. {"context": "[frase narrativa com o personagem indicado]", "question": "[pergunta variada]"}
2. {"context": "[frase narrativa com o personagem indicado]", "question": "[pergunta variada]"}
... e assim por diante`;
  }

  /**
   * Parses the AI batch response into an array of {context, question} objects.
   * Handles markdown code fences, JSON arrays, and numbered line formats.
   */
  parseAIBatchResponse(text, count) {
    // Strip markdown code fences
    const clean = text
      .replace(/```(?:json)?\n?/gi, '')
      .replace(/```/g, '')
      .trim();

    // Try JSON array first
    try {
      const arr = JSON.parse(clean);
      if (Array.isArray(arr) && arr.every((p) => p?.context && p?.question)) {
        return arr.slice(0, count);
      }
    } catch (_e) {}

    // Line-by-line: strip numeric prefix, parse JSON
    const results = [];
    for (const line of clean.split('\n').filter((l) => l.trim())) {
      const stripped = line.replace(/^\s*\d+[.):\-\s]+/, '').trim();
      try {
        const parsed = JSON.parse(stripped);
        if (parsed?.context && parsed?.question) {
          results.push(parsed);
          if (results.length === count) break;
        }
      } catch (_e) {}
    }
    return results;
  }

  /**
   * Validates an AI-generated question
   */
  validateQuestion(text) {
    if (!text || typeof text !== 'string') return false;
    const trimmed = text.trim();
    if (trimmed.length < 5 || trimmed.length > 120) return false;
    if (!trimmed.endsWith('?')) return false;
    if (/\d+\s*[+\-×÷]\s*\d+/.test(trimmed)) return false;
    return true;
  }

  /**
   * Waits minimum interval between requests to respect rate limits
   */
  async waitForRateLimit() {
    const now = Date.now();
    const minInterval = (60 * 1000) / this.options.requestsPerMinute;
    const timeSinceLastRequest = now - this.lastRequestTime;

    if (timeSinceLastRequest < minInterval) {
      await this.sleep(minInterval - timeSinceLastRequest);
    }

    this.lastRequestTime = Date.now();
  }

  /**
   * Extracts retry time from 429 error message
   */
  extractRetryTime(errorMessage) {
    const secondsMatch = errorMessage.match(/retry in (\d+(?:\.\d+)?)\s*s/i);
    if (secondsMatch) {
      return Date.now() + parseFloat(secondsMatch[1]) * 1000;
    }
    return Date.now() + 60000;
  }

  /**
   * Generates a context using AI with retry and exponential backoff
   */
  async generateContext(problem) {
    if (!this.enabled) {
      return this.templateLibrary.getContext(problem.type, problem.num1, problem.num2);
    }

    if (this.quotaExceeded && this.quotaResetTime) {
      const now = Date.now();
      if (now < this.quotaResetTime) {
        console.warn(`⚠️  Quota exceeded. Using template.`);
        return this.templateLibrary.getContext(problem.type, problem.num1, problem.num2);
      }
      this.quotaExceeded = false;
      this.quotaResetTime = null;
    }

    for (let attempt = 0; attempt < this.options.maxRetries; attempt++) {
      try {
        await this.waitForRateLimit();

        const prompt = this.createPrompt(problem);
        const result = await this.model.generateContent(prompt);
        const response = await result.response;
        let text = response.text().trim();

        this.requestCount++;

        // Try parsing as JSON (prompt asks for JSON)
        try {
          const parsed = JSON.parse(text);
          if (parsed?.context) {
            text = parsed.context.trim();
          }
        } catch (_e) {
          text = text.replace(/^["']|["']$/g, '');
        }

        if (this.validateContext(text)) {
          return text;
        }
        return this.templateLibrary.getContext(problem.type, problem.num1, problem.num2);
      } catch (error) {
        const errorMessage = error.message || '';

        if (
          errorMessage.includes('429') ||
          errorMessage.includes('Too Many Requests') ||
          errorMessage.includes('Quota exceeded')
        ) {
          this.quotaResetTime = this.extractRetryTime(errorMessage);
          this.quotaExceeded = true;
          return this.templateLibrary.getContext(problem.type, problem.num1, problem.num2);
        }

        if (attempt < this.options.maxRetries - 1) {
          const delay = Math.min(this.options.baseDelay * 2 ** attempt, this.options.maxDelay);
          await this.sleep(delay);
        }
      }
    }

    return this.templateLibrary.getContext(problem.type, problem.num1, problem.num2);
  }

  /**
   * Generates contexts and questions for multiple problems in a single batch request
   */
  async generateContextsBatch(problems) {
    if (!this.enabled || this.quotaExceeded) {
      return {
        contexts: problems.map((p) => this.templateLibrary.getContext(p.type, p.num1, p.num2)),
        questions: null,
      };
    }

    for (let attempt = 0; attempt < this.options.maxRetries; attempt++) {
      try {
        await this.waitForRateLimit();

        const prompt = this.createBatchPrompt(problems);
        const result = await this.model.generateContent(prompt);
        const response = await result.response;
        const text = response.text().trim();

        this.requestCount++;

        const parsed = this.parseAIBatchResponse(text, problems.length);

        const contexts = [];
        const questions = [];

        for (let i = 0; i < problems.length; i++) {
          const item = parsed[i];
          const context = item?.context?.trim().replace(/^["']|["']$/g, '') || null;
          const question = item?.question?.trim().replace(/^["']|["']$/g, '') || null;

          if (context && this.validateContext(context)) {
            contexts.push(context);
            questions.push(this.validateQuestion(question) ? question : null);
          } else {
            const p = problems[i];
            contexts.push(this.templateLibrary.getContext(p.type, p.num1, p.num2));
            questions.push(null);
          }
        }

        return { contexts, questions };
      } catch (error) {
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
    if (!text || text.length < 10 || text.length > 200) {
      return false;
    }

    const inappropriate = [
      'morte', 'morrer', 'matar', 'violência', 'sangue', 'medo',
      'terror', 'horror', 'dor', 'doer', 'machucar', 'feio',
      'horrível', 'péssimo', 'ruim',
    ];

    const lowerText = text.toLowerCase();
    if (inappropriate.some((word) => lowerText.includes(word))) {
      return false;
    }

    if (/\d+\s*[+\-×÷]\s*\d+/.test(text)) {
      return false;
    }

    if (!containsAnyName(text)) {
      return false;
    }

    return true;
  }

  /**
   * Generates a complete contextualized problem (legacy single-problem method)
   */
  async generateWordProblem(problem) {
    const context = await this.generateContext(problem);
    const question = pickQuestion(problem.type);

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
    }
    return contexts;
  }

  getUsageStats() {
    return {
      requestCount: this.requestCount,
      quotaExceeded: this.quotaExceeded,
      quotaResetTime: this.quotaResetTime,
      requestsPerMinute: this.options.requestsPerMinute,
    };
  }

  sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  isEnabled() {
    return this.enabled;
  }

  getFallbackContext(problem) {
    return this.templateLibrary.getContext(problem.type, problem.num1, problem.num2);
  }
}

export default AIEnhancer;
