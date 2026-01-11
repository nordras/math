/**
 * Math Generator Service - Geração de problemas matemáticos
 * Serviço de alto nível usando padrão funcional puro
 */

import MathGenerator from '../generators/mathGenerator.js';
import type {
  DigitConfig,
  GenerateProblemsResult,
  MathGeneratorOptions,
  MathOperation,
  MathProblem,
  MathStats,
} from '../types/math';

/** Constantes de configuração */
const MIN_PROBLEMS = 1;
const MAX_PROBLEMS = 200;
const DEFAULT_PROBLEMS = 50;
const DEFAULT_ADDITION_RATIO = 0.5;
const DEFAULT_DIFFICULTY = 'medium';
const MIN_DIGITS = 1;
const MAX_DIGITS = 5;
const MIN_DIVISOR = 1;
const MAX_DIVISOR = 100;

/**
 * Clamp (limita) um valor entre min e max
 */
function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

/**
 * Gera um número aleatório inteiro entre min e max (inclusive)
 */
function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Calcula range de números baseado na quantidade de dígitos
 */
function getNumberRange(digits: number): { min: number; max: number } {
  const min = 10 ** (digits - 1);
  const max = 10 ** digits - 1;
  return { min, max };
}

/**
 * Seleciona operação aleatória para modo misto
 */
function selectRandomOperation(): MathOperation {
  const operations: MathOperation[] = ['addition', 'subtraction', 'multiplication', 'division'];
  return operations[Math.floor(Math.random() * operations.length)];
}

/**
 * Cria problema de adição
 */
function createAdditionProblem(num1: number, num2: number): MathProblem {
  return {
    num1,
    num2,
    type: 'addition',
    operation: `${num1} + ${num2}`,
    answer: num1 + num2,
  };
}

/**
 * Cria problema de subtração (sempre positivo)
 */
function createSubtractionProblem(num1: number, num2: number): MathProblem {
  const [larger, smaller] = num1 >= num2 ? [num1, num2] : [num2, num1];
  return {
    num1: larger,
    num2: smaller,
    type: 'subtraction',
    operation: `${larger} - ${smaller}`,
    answer: larger - smaller,
  };
}

/**
 * Cria problema de multiplicação
 */
function createMultiplicationProblem(num1: number, num2: number): MathProblem {
  return {
    num1,
    num2,
    type: 'multiplication',
    operation: `${num1} × ${num2}`,
    answer: num1 * num2,
  };
}

/**
 * Cria problema de divisão (sempre exata)
 */
function createDivisionProblem(
  minValue: number,
  maxValue: number,
  divisorMin: number,
  divisorMax: number
): MathProblem {
  const divisor = randomInt(divisorMin, divisorMax);
  const quotient = randomInt(minValue, maxValue);
  const dividend = divisor * quotient;

  return {
    num1: dividend,
    num2: divisor,
    type: 'division',
    operation: `${dividend} ÷ ${divisor}`,
    answer: quotient,
  };
}

/**
 * Cria um problema matemático baseado na operação especificada
 */
function createProblemByOperation(
  operation: MathOperation,
  num1: number,
  num2: number,
  config?: Pick<DigitConfig, 'divisorMin' | 'divisorMax' | 'digits'>
): MathProblem {
  switch (operation) {
    case 'addition':
      return createAdditionProblem(num1, num2);
    case 'subtraction':
      return createSubtractionProblem(num1, num2);
    case 'multiplication':
      return createMultiplicationProblem(num1, num2);
    case 'division': {
      const { min, max } = getNumberRange(config?.digits ?? 2);
      return createDivisionProblem(
        min,
        max,
        config?.divisorMin ?? MIN_DIVISOR,
        config?.divisorMax ?? 10
      );
    }
  }
}

/**
 * Gera um único problema baseado na configuração
 */
function generateSingleProblem(config: DigitConfig): MathProblem {
  const { digits, operation } = config;
  const { min, max } = getNumberRange(digits);
  const num1 = randomInt(min, max);
  const num2 = randomInt(min, max);

  const selectedOperation: MathOperation =
    operation === 'mixed' ? selectRandomOperation() : operation;

  return createProblemByOperation(selectedOperation, num1, num2, config);
}

/**
 * Gera múltiplos problemas baseado em uma configuração
 */
function generateProblemsFromConfig(config: DigitConfig): MathProblem[] {
  const problems: MathProblem[] = [];

  for (let i = 0; i < config.questions; i++) {
    problems.push(generateSingleProblem(config));
  }

  return problems;
}

/**
 * Calcula estatísticas dos problemas gerados
 */
function calculateStats(
  problems: MathProblem[],
  difficulty: string,
  digitConfigs?: DigitConfig[]
): MathStats {
  return {
    totalProblems: problems.length,
    total: problems.length,
    additions: problems.filter((p) => p.type === 'addition').length,
    subtractions: problems.filter((p) => p.type === 'subtraction').length,
    multiplications: problems.filter((p) => p.type === 'multiplication').length,
    divisions: problems.filter((p) => p.type === 'division').length,
    difficulty,
    digitConfigs,
  };
}

/**
 * Gera problemas usando o sistema de digitConfigs
 */
function generateFromDigitConfigs(digitConfigs: DigitConfig[]): GenerateProblemsResult {
  const allProblems = digitConfigs
    .filter((config) => config.questions > 0)
    .flatMap((config) => generateProblemsFromConfig(config));

  const stats = calculateStats(allProblems, 'custom', digitConfigs);

  return { problems: allProblems, stats };
}

/**
 * Gera problemas usando o modo legado (MathGenerator)
 */
function generateFromLegacyMode(options: MathGeneratorOptions): GenerateProblemsResult {
  const {
    totalProblems = DEFAULT_PROBLEMS,
    difficulty = DEFAULT_DIFFICULTY,
    additionRatio = DEFAULT_ADDITION_RATIO,
  } = options;

  const generator = new MathGenerator({
    totalProblems,
    difficulty,
    additionRatio,
  });

  const problems = generator.generateMixedProblems();
  const oldStats = generator.getStatistics(problems);

  const stats: MathStats = {
    totalProblems: oldStats.total ?? problems.length,
    total: oldStats.total ?? problems.length,
    additions: oldStats.addition ?? 0,
    subtractions: oldStats.subtraction ?? 0,
    multiplications: 0,
    divisions: 0,
    difficulty: oldStats.difficulty,
  };

  return { problems, stats };
}

/**
 * Valida e normaliza as opções de geração
 */
export function validateOptions(options: MathGeneratorOptions): MathGeneratorOptions {
  const validDifficulties = ['easy', 'medium', 'hard'] as const;
  const validOperations = [
    'addition',
    'subtraction',
    'multiplication',
    'division',
    'mixed',
  ] as const;

  const validated: MathGeneratorOptions = {
    totalProblems: clamp(options.totalProblems ?? DEFAULT_PROBLEMS, MIN_PROBLEMS, MAX_PROBLEMS),
    difficulty: validDifficulties.includes(options.difficulty ?? DEFAULT_DIFFICULTY)
      ? options.difficulty
      : DEFAULT_DIFFICULTY,
    additionRatio: clamp(options.additionRatio ?? DEFAULT_ADDITION_RATIO, 0, 1),
  };

  if (options.digitConfigs && Array.isArray(options.digitConfigs)) {
    validated.digitConfigs = options.digitConfigs.map((config) => ({
      digits: clamp(config.digits ?? 2, MIN_DIGITS, MAX_DIGITS),
      questions: clamp(config.questions ?? 10, 0, MAX_PROBLEMS),
      operation: validOperations.includes(config.operation) ? config.operation : 'addition',
      divisorMin:
        config.divisorMin !== undefined
          ? clamp(config.divisorMin, MIN_DIVISOR, MAX_DIVISOR)
          : MIN_DIVISOR,
      divisorMax:
        config.divisorMax !== undefined ? clamp(config.divisorMax, MIN_DIVISOR, MAX_DIVISOR) : 10,
    }));
  }

  return validated;
}

/**
 * Gera problemas matemáticos baseado nas opções fornecidas
 * @param options - Opções de geração (totalProblems, difficulty, additionRatio, digitConfigs)
 * @returns Resultado contendo problemas gerados e estatísticas
 *
 * @example
 * ```typescript
 * // Gerar usando digitConfigs
 * const result = generateProblems({
 *   digitConfigs: [
 *     { digits: 2, questions: 10, operation: 'addition' }
 *   ]
 * });
 *
 * // Gerar usando modo legado
 * const result2 = generateProblems({
 *   totalProblems: 50,
 *   difficulty: 'medium',
 *   additionRatio: 0.5
 * });
 * ```
 */
export function generateProblems(options: MathGeneratorOptions): GenerateProblemsResult {
  const validatedOptions = validateOptions(options);

  // Se digitConfigs está presente, usar novo sistema
  if (
    validatedOptions.digitConfigs &&
    Array.isArray(validatedOptions.digitConfigs) &&
    validatedOptions.digitConfigs.length > 0
  ) {
    return generateFromDigitConfigs(validatedOptions.digitConfigs);
  }

  // Fallback para modo legado
  return generateFromLegacyMode(validatedOptions);
}
