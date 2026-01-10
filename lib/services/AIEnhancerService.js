/**
 * Generate context for AI-enhanced math problems
 * Encapsulates the business logic of the AIE
 */
import AIEnhancer from '../generators/aiEnhancer.js';
import CacheManager from '../utils/cache.js';

export class AIEnhancerService {
  /**
   * Generate problems with context
   * @param {Array} problems - Lista de problemas matemáticos
   * @param {number} count - Quantidade de problemas a contextualizar
   * @returns {Promise<Array>} - Problemas contextualizados
   */
  static async generateContextualProblems(problems, count = 10) {
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey || apiKey === 'your_api_key_here') {
      throw new Error('API key do Gemini não configurada');
    }

    const aiEnhancer = new AIEnhancer(apiKey, {
      model: process.env.GEMINI_MODEL || 'gemini-2.0-flash-exp',
    });

    const cacheManager = new CacheManager('./cache');
    await cacheManager.init();
    await cacheManager.loadToMemory();

    // SelSelect problems to contextualize
    const selectedProblems = this.selectProblems(problems, count);
    const contextualProblems = [];

    // SSplit cache and without cache
    const problemsWithCache = [];
    const problemsNeedingGeneration = [];

    for (const problem of selectedProblems) {
      const cached = await cacheManager.get(problem);
      if (cached) {
        problemsWithCache.push({ problem, context: cached });
      } else {
        problemsNeedingGeneration.push(problem);
      }
    }

    // Generate contexts for problems without cache
    let generatedContexts = [];
    if (problemsNeedingGeneration.length > 0) {
      generatedContexts = await aiEnhancer.generateContextsBatch(
        problemsNeedingGeneration
      );

      // Save to cache
      for (let i = 0; i < problemsNeedingGeneration.length; i++) {
        await cacheManager.set(problemsNeedingGeneration[i], generatedContexts[i]);
      }
    }

    // Combine results maintaining original order
    for (const problem of selectedProblems) {
      const cached = problemsWithCache.find((p) => p.problem === problem);
      let context;

      if (cached) {
        context = cached.context;
      } else {
        const index = problemsNeedingGeneration.indexOf(problem);
        context = generatedContexts[index];
      }

      const question =
        problem.type === 'addition' ? 'Quantos no total?' : 'Quantos restaram?';

      contextualProblems.push({
        context,
        question,
        answer: problem.answer,
        num1: problem.num1,
        num2: problem.num2,
        operation: problem.operation,
      });
    }

    return contextualProblems;
  }

  /**
   * Select problems to contextualize
   * @param {Array} problems - Full list of problems
   * @param {number} count - Number to select
   * @returns {Array} - Selected problems
   */
  static selectProblems(problems, count) {
    const step = Math.floor(problems.length / count);
    const selected = [];

    for (let i = 0; i < count && i * step < problems.length; i++) {
      selected.push(problems[i * step]);
    }

    return selected;
  }
}
