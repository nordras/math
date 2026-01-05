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
      digitConfigs = null,
    } = options;

    // Se digitConfigs foi fornecido, gerar problemas baseado nele
    if (digitConfigs && Array.isArray(digitConfigs) && digitConfigs.length > 0) {
      return this.generateFromDigitConfigs(digitConfigs);
    }

    // Fallback para o modo antigo
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
   * Gera problemas baseado em configurações de algarismos
   * @param {Array} digitConfigs - Configurações por algarismo
   * @returns {object} - Problemas e estatísticas
   */
  static generateFromDigitConfigs(digitConfigs) {
    let allProblems = [];
    
    for (const config of digitConfigs) {
      const { digits, questions, operation } = config;
      
      if (questions <= 0) continue;
      
      // Determinar range baseado nos algarismos
      const min = Math.pow(10, digits - 1);
      const max = Math.pow(10, digits) - 1;
      
      // Gerar problemas para esta configuração
      for (let i = 0; i < questions; i++) {
        const num1 = Math.floor(Math.random() * (max - min + 1)) + min;
        const num2 = Math.floor(Math.random() * (max - min + 1)) + min;
        
        let problemType;
        if (operation === 'mixed') {
          const operations = ['addition', 'subtraction', 'multiplication', 'division'];
          problemType = operations[Math.floor(Math.random() * operations.length)];
        } else {
          problemType = operation;
        }
        
        let problem;
        switch (problemType) {
          case 'addition':
            problem = {
              num1,
              num2,
              type: 'addition',
              operation: `${num1} + ${num2}`,
              answer: num1 + num2,
            };
            break;
          case 'subtraction':
            // Garantir que num1 >= num2 para evitar negativos
            const [larger, smaller] = num1 >= num2 ? [num1, num2] : [num2, num1];
            problem = {
              num1: larger,
              num2: smaller,
              type: 'subtraction',
              operation: `${larger} - ${smaller}`,
              answer: larger - smaller,
            };
            break;
          case 'multiplication':
            problem = {
              num1,
              num2,
              type: 'multiplication',
              operation: `${num1} × ${num2}`,
              answer: num1 * num2,
            };
            break;
          case 'division':
            const divisorMin = config.divisorMin || 1;
            const divisorMax = config.divisorMax || 10;
            const divisor = Math.floor(Math.random() * (divisorMax - divisorMin + 1)) + divisorMin;
            const quotient = Math.floor(Math.random() * (max - min + 1)) + min;
            const dividend = divisor * quotient;
            problem = {
              num1: dividend,
              num2: divisor,
              type: 'division',
              operation: `${dividend} ÷ ${divisor}`,
              answer: quotient,
            };
            break;
        }
        
        allProblems.push(problem);
      }
    }
    
    // Calcular estatísticas
    const stats = {
      totalProblems: allProblems.length,
      additions: allProblems.filter(p => p.type === 'addition').length,
      subtractions: allProblems.filter(p => p.type === 'subtraction').length,
      multiplications: allProblems.filter(p => p.type === 'multiplication').length,
      divisions: allProblems.filter(p => p.type === 'division').length,
      difficulty: 'custom',
      digitConfigs: digitConfigs,
    };
    
    return {
      problems: allProblems,
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
    const { totalProblems, difficulty, additionRatio, digitConfigs } = options;

    const validated = {
      totalProblems: Math.max(1, Math.min(200, totalProblems || 50)),
      difficulty: validDifficulties.includes(difficulty) ? difficulty : 'medium',
      additionRatio: Math.max(0, Math.min(1, additionRatio || 0.5)),
    };

    // Validar digitConfigs se fornecido
    if (digitConfigs && Array.isArray(digitConfigs)) {
      validated.digitConfigs = digitConfigs.map(config => ({
        digits: Math.max(1, Math.min(5, config.digits || 2)),
        questions: Math.max(0, Math.min(100, config.questions || 10)),
        operation: ['addition', 'subtraction', 'multiplication', 'division', 'mixed'].includes(config.operation)
          ? config.operation
          : 'addition',
        divisorMin: config.divisorMin !== undefined ? Math.max(1, Math.min(100, config.divisorMin)) : 1,
        divisorMax: config.divisorMax !== undefined ? Math.max(1, Math.min(100, config.divisorMax)) : 10,
      }));
    }

    return validated;
  }
}
