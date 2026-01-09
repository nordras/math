/**
 * Declarações de tipos para AIEnhancerService
 */

import type { MathProblem } from '../types/math';

export interface ContextualProblem {
  context: string;
  question: string;
  answer: number;
  num1: number;
  num2: number;
  operation: string;
}

export declare namespace AIEnhancerService {
  function generateContextualProblems(
    problems: MathProblem[],
    count?: number
  ): Promise<ContextualProblem[]>;
  
  function selectProblems(problems: MathProblem[], count: number): MathProblem[];
}

export { AIEnhancerService };
