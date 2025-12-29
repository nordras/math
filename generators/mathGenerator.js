/**
 * Gerador Matemático Puro
 * Gera problemas de adição e subtração sem envolvimento de IA
 * Toda a lógica matemática é controlada e validada
 */

class MathGenerator {
  constructor(options = {}) {
    this.options = {
      totalProblems: options.totalProblems || 50,
      additionRatio: options.additionRatio || 0.5,
      difficulty: options.difficulty || 'medium',
      avoidSequenceLength: options.avoidSequenceLength || 4,
      threeDigitRatio: options.threeDigitRatio || 0.25, // 25% com 3 algarismos
      ...options
    };

    this.difficultyLevels = {
      easy: { min: 1, max: 10, allowNegative: false },
      medium: { min: 1, max: 20, allowNegative: false },
      hard: { min: 1, max: 50, allowNegative: false }
    };
  }

  /**
   * Gera um número aleatório entre min e max (inclusivo)
   */
  randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  /**
   * Embaralha um array usando Fisher-Yates
   */
  shuffle(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  /**
   * Gera um problema de adição
   */
  generateAddition(difficulty = 'medium', useThreeDigits = false) {
    const range = this.difficultyLevels[difficulty];
    let num1, num2;
    
    if (useThreeDigits) {
      // Números de 3 algarismos (100-999)
      num1 = this.randomInt(100, 999);
      num2 = this.randomInt(100, 999);
    } else {
      num1 = this.randomInt(range.min, range.max);
      num2 = this.randomInt(range.min, range.max);
    }

    return {
      type: 'addition',
      operation: '+',
      num1,
      num2,
      answer: num1 + num2,
      difficulty,
      threeDigits: useThreeDigits,
      display: `${num1} + ${num2}`
    };
  }

  /**
   * Gera um problema de subtração
   * Garante que o resultado seja sempre positivo (ou zero)
   */
  generateSubtraction(difficulty = 'medium', useThreeDigits = false) {
    const range = this.difficultyLevels[difficulty];
    let num1, num2;
    
    if (useThreeDigits) {
      // Números de 3 algarismos (100-999)
      num1 = this.randomInt(100, 999);
      const maxNum2 = num1; // Garantir resultado positivo
      num2 = this.randomInt(100, maxNum2);
    } else {
      num1 = this.randomInt(range.min, range.max);
      const maxNum2 = range.allowNegative ? range.max : num1;
      num2 = this.randomInt(range.min, maxNum2);
    }

    return {
      type: 'subtraction',
      operation: '−',
      num1,
      num2,
      answer: num1 - num2,
      difficulty,
      threeDigits: useThreeDigits,
      display: `${num1} − ${num2}`
    };
  }

  /**
   * Gera um conjunto de problemas mistos
   */
  generateMixedProblems() {
    const { totalProblems, additionRatio, difficulty, threeDigitRatio } = this.options;
    const problems = [];

    // Calcular quantos problemas de cada tipo
    const additionCount = Math.floor(totalProblems * additionRatio);
    const subtractionCount = totalProblems - additionCount;
    
    // Calcular quantos problemas terão 3 algarismos
    const threeDigitTotal = Math.floor(totalProblems * threeDigitRatio);
    const threeDigitAddition = Math.floor(threeDigitTotal * additionRatio);
    const threeDigitSubtraction = threeDigitTotal - threeDigitAddition;

    // Gerar problemas de adição
    for (let i = 0; i < additionCount; i++) {
      const useThreeDigits = i < threeDigitAddition;
      problems.push(this.generateAddition(difficulty, useThreeDigits));
    }

    // Gerar problemas de subtração
    for (let i = 0; i < subtractionCount; i++) {
      const useThreeDigits = i < threeDigitSubtraction;
      problems.push(this.generateSubtraction(difficulty, useThreeDigits));
    }

    // Embaralhar
    let shuffled = this.shuffle(problems);

    // Evitar sequências longas da mesma operação
    shuffled = this.avoidLongSequences(shuffled);

    // Adicionar número de ordem
    shuffled.forEach((problem, index) => {
      problem.number = index + 1;
    });

    return shuffled;
  }

  /**
   * Evita sequências longas da mesma operação
   * Por exemplo, evita mais de 3 adições seguidas
   */
  avoidLongSequences(problems) {
    const maxSequence = this.options.avoidSequenceLength;
    const result = [...problems];

    for (let i = 0; i < result.length - maxSequence; i++) {
      // Contar quantos do mesmo tipo em sequência
      let count = 1;
      const currentType = result[i].type;

      for (let j = i + 1; j < result.length && j < i + maxSequence; j++) {
        if (result[j].type === currentType) {
          count++;
        } else {
          break;
        }
      }

      // Se encontrou uma sequência muito longa, fazer swap
      if (count >= maxSequence) {
        // Procurar próximo elemento de tipo diferente
        for (let k = i + maxSequence; k < result.length; k++) {
          if (result[k].type !== currentType) {
            // Swap
            const temp = result[i + maxSequence - 1];
            result[i + maxSequence - 1] = result[k];
            result[k] = temp;
            break;
          }
        }
      }
    }

    return result;
  }

  /**
   * Valida se um problema está correto
   */
  validateProblem(problem) {
    const { num1, num2, answer, type } = problem;

    if (type === 'addition') {
      return num1 + num2 === answer;
    } else if (type === 'subtraction') {
      return num1 - num2 === answer;
    }

    return false;
  }

  /**
   * Gera estatísticas sobre os problemas gerados
   */
  getStatistics(problems) {
    const stats = {
      total: problems.length,
      addition: 0,
      subtraction: 0,
      threeDigits: 0,
      difficulty: this.options.difficulty,
      maxAnswer: 0,
      minAnswer: Infinity,
      avgAnswer: 0
    };

    let sumAnswers = 0;

    problems.forEach(problem => {
      if (problem.type === 'addition') stats.addition++;
      if (problem.type === 'subtraction') stats.subtraction++;
      if (problem.threeDigits) stats.threeDigits++;

      stats.maxAnswer = Math.max(stats.maxAnswer, problem.answer);
      stats.minAnswer = Math.min(stats.minAnswer, problem.answer);
      sumAnswers += problem.answer;
    });

    stats.avgAnswer = Math.round(sumAnswers / problems.length);

    return stats;
  }
}

module.exports = MathGenerator;
