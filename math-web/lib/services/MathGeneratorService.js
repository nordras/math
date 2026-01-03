/**
 * Serviço para geração de problemas matemáticos
 * Encapsula a lógica de negócio do MathGenerator
 */

const MathGenerator = require('../generators/mathGenerator');

export class MathGeneratorService {
  /**
   * Gera problemas matemáticos
   * @param {object} options - Opções de geração
   * @returns {object} - Problemas e estatísticas
   */
  static generateProblems(options) {
    const {
      totalProblems = 50,
      difficulty = 'medium',
      additionRatio = 0.5,
    } = options;

    const generator = new MathGenerator({
      totalProblems,
      difficulty,
      additionRatio,
    });

    const problems = generator.generateMixedProblems();
    const stats = generator.getStatistics(problems);

    return {
      problems,
      stats,
    };
  }

  /**
   * Valida as opções de geração
   * @param {object} options - Opções a validar
   * @returns {object} - Opções validadas
   */
  static validateOptions(options) {
    const validDifficulties = ['easy', 'medium', 'hard'];
    const { totalProblems, difficulty, additionRatio } = options;

    return {
      totalProblems: Math.max(1, Math.min(200, totalProblems || 50)),
      difficulty: validDifficulties.includes(difficulty) ? difficulty : 'medium',
      additionRatio: Math.max(0, Math.min(1, additionRatio || 0.5)),
    };
  }
}
