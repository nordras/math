export interface DigitConfig {
  digits: number;
  questions: number;
}

export interface MathGeneratorOptions {
  totalProblems?: number;
  difficulty?: 'easy' | 'medium' | 'hard';
  additionRatio?: number;
  digitConfigs?: DigitConfig[];
}

export interface MathProblem {
  num1: number;
  num2: number;
  type: 'addition' | 'subtraction';
  operation: string;
  answer: number;
}

export interface MathStats {
  totalProblems: number;
  additions: number;
  subtractions: number;
  difficulty: string;
  rangeStart: number;
  rangeEnd: number;
}

export interface GenerateProblemsResult {
  problems: MathProblem[];
  stats: MathStats;
}

export declare namespace MathGeneratorService {
  function generateProblems(options: MathGeneratorOptions): GenerateProblemsResult;
  function validateOptions(options: MathGeneratorOptions): MathGeneratorOptions;
}

export { MathGeneratorService };
