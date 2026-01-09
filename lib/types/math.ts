/**
 * Tipos compartilhados para geração de exercícios
 */

export interface DigitConfig {
  digits: number;
  questions: number;
  operation: 'addition' | 'subtraction' | 'multiplication' | 'division' | 'mixed';
  divisorMin?: number;
  divisorMax?: number;
}

export interface MathProblem {
  num1: number;
  num2: number;
  type: 'addition' | 'subtraction' | 'multiplication' | 'division';
  operation: string;
  answer: number;
}

export interface MathStats {
  totalProblems: number;
  total?: number;
  additions: number;
  subtractions: number;
  multiplications?: number;
  divisions?: number;
  difficulty: string;
  rangeStart?: number;
  rangeEnd?: number;
  digitConfigs?: DigitConfig[];
}

export interface GenerateProblemsResult {
  problems: MathProblem[];
  stats: MathStats;
}
