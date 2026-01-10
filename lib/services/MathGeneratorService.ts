/**
 * Service for generating math problems
 * Encapsulates MathGenerator business logic
 */

import type { DigitConfig, MathProblem, MathStats } from '../types/math';
import MathGenerator from '../generators/mathGenerator.js';

type Operation = 'addition' | 'subtraction' | 'multiplication' | 'division' | 'mixed';

interface GenerateProblemsOptions {
  totalProblems?: number;
  difficulty?: 'easy' | 'medium' | 'hard';
  additionRatio?: number;
  digitConfigs?: DigitConfig[];
}

interface GenerateProblemsResult {
  problems: MathProblem[];
  stats: MathStats;
}

export class MathGeneratorService {
  static generateProblems(options: GenerateProblemsOptions): GenerateProblemsResult {
    const {
      totalProblems = 50,
      difficulty = 'medium',
      additionRatio = 0.5,
      digitConfigs = null,
    } = options;

    // If digitConfigs was provided, generate problems based on it
    if (digitConfigs && Array.isArray(digitConfigs) && digitConfigs.length > 0) {
      return this.generateFromDigitConfigs(digitConfigs);
    }

    // Fallback to old mode
    const generator = new MathGenerator({
      totalProblems,
      difficulty,
      additionRatio,
    });

    const problems = generator.generateMixedProblems();
    const oldStats = generator.getStatistics(problems);

    // Convert old stats format to new MathStats format
    const stats: MathStats = {
      totalProblems: oldStats.total || problems.length,
      additions: oldStats.addition || 0,
      subtractions: oldStats.subtraction || 0,
      multiplications: 0,
      divisions: 0,
      difficulty: oldStats.difficulty,
    };

    return {
      problems,
      stats,
    };
  }

  static generateFromDigitConfigs(digitConfigs: DigitConfig[]): GenerateProblemsResult {
    const allProblems: MathProblem[] = [];
    
    for (const config of digitConfigs) {
      const { digits, questions, operation } = config;
      
      if (questions <= 0) continue;
      
      // Determine range based on digits
      const min = Math.pow(10, digits - 1);
      const max = Math.pow(10, digits) - 1;
      
      for (let i = 0; i < questions; i++) {
        const num1 = Math.floor(Math.random() * (max - min + 1)) + min;
        const num2 = Math.floor(Math.random() * (max - min + 1)) + min;
        
        let problemType: Operation;
        if (operation === 'mixed') {
          const operations: Operation[] = ['addition', 'subtraction', 'multiplication', 'division'];
          problemType = operations[Math.floor(Math.random() * operations.length)];
        } else {
          problemType = operation;
        }
        
        let problem: MathProblem;
        switch (problemType) {
          case 'addition':
            problem = {
              num1,
              num2,
              type: 'addition' as const,
              operation: `${num1} + ${num2}`,
              answer: num1 + num2,
            };
            break;
          case 'subtraction':
            const [larger, smaller] = num1 >= num2 ? [num1, num2] : [num2, num1];
            problem = {
              num1: larger,
              num2: smaller,
              type: 'subtraction' as const,
              operation: `${larger} - ${smaller}`,
              answer: larger - smaller,
            };
            break;
          case 'multiplication':
            problem = {
              num1,
              num2,
              type: 'multiplication' as any,
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
              type: 'division' as any,
              operation: `${dividend} ÷ ${divisor}`,
              answer: quotient,
            };
            break;
          default:
            problem = {
              num1,
              num2,
              type: 'addition' as const,
              operation: `${num1} + ${num2}`,
              answer: num1 + num2,
            };
        }
        
        allProblems.push(problem);
      }
    }
    
    // Calculate statistics
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

  static validateOptions(options: GenerateProblemsOptions): GenerateProblemsOptions {
    const validDifficulties: Array<'easy' | 'medium' | 'hard'> = ['easy', 'medium', 'hard'];
    const { totalProblems, difficulty, additionRatio, digitConfigs } = options;

    const validated: GenerateProblemsOptions = {
      totalProblems: Math.max(1, Math.min(200, totalProblems || 50)),
      difficulty: (validDifficulties.includes(difficulty as any) ? difficulty : 'medium') as 'easy' | 'medium' | 'hard',
      additionRatio: Math.max(0, Math.min(1, additionRatio || 0.5)),
    };

    if (digitConfigs && Array.isArray(digitConfigs)) {
      validated.digitConfigs = digitConfigs.map(config => ({
        digits: Math.max(1, Math.min(5, config.digits || 2)),
        questions: Math.max(0, Math.min(100, config.questions || 10)),
        operation: (['addition', 'subtraction', 'multiplication', 'division', 'mixed'].includes(config.operation)
          ? config.operation
          : 'addition') as Operation,
        divisorMin: config.divisorMin !== undefined ? Math.max(1, Math.min(100, config.divisorMin)) : 1,
        divisorMax: config.divisorMax !== undefined ? Math.max(1, Math.min(100, config.divisorMax)) : 10,
      }));
    }

    return validated;
  }
}
