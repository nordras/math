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
      model: options.model || 'gemini-pro',
      maxRetries: options.maxRetries || 2,
      temperature: options.temperature || 0.7,
      ...options
    };

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
2. Crie UMA única frase curta (máximo 15 palavras) sobre Cecília
3. Use ações relacionadas a: ${action}
4. Tom POSITIVO e ALEGRE
5. Contextos permitidos: brinquedos, frutas, material escolar, animais fofos, natureza
6. NÃO mencione números ou operações matemáticas
7. NÃO inclua perguntas ou respostas
8. NÃO use palavras negativas: triste, perdeu (se evitável), quebrou, machucou

TEMAS SUGERIDOS:
🎨 Brinquedos: carrinhos, bonecas, blocos, bolas, ursinhos
🍎 Frutas: maçãs, morangos, bananas, laranjas
📚 Escola: lápis, livros, cadernos, figurinhas
🦋 Animais: borboletas, passarinhos, coelhos, gatinhos
🌸 Natureza: flores, estrelas, árvores

EXEMPLO DE SAÍDA:
"Cecília tem 3 caixas de lápis de cor com 4 lápis em cada uma"

Agora crie APENAS a frase narrativa (sem números, sem pergunta):`;
  }

  /**
   * Gera um contexto usando IA
   */
  async generateContext(problem) {
    if (!this.enabled) {
      return this.templateLibrary.getContext(problem.type, problem.num1, problem.num2);
    }

    try {
      const prompt = this.createPrompt(problem);
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      let text = response.text().trim();

      // Remover aspas se existirem
      text = text.replace(/^["']|["']$/g, '');

      // Validar a resposta
      if (this.validateContext(text)) {
        return text;
      } else {
        console.warn('⚠️  Contexto da IA falhou na validação, usando template');
        return this.templateLibrary.getContext(problem.type, problem.num1, problem.num2);
      }

    } catch (error) {
      console.warn('⚠️  Erro ao chamar IA, usando template:', error.message);
      return this.templateLibrary.getContext(problem.type, problem.num1, problem.num2);
    }
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
   * Gera múltiplos contextos em lote com rate limiting
   */
  async generateBatch(problems, delayMs = 200) {
    const contexts = [];

    for (const problem of problems) {
      const context = await this.generateContext(problem);
      contexts.push(context);

      // Respeitar rate limits (máx 15 requests/minuto)
      if (this.enabled) {
        await this.sleep(delayMs);
      }
    }

    return contexts;
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
