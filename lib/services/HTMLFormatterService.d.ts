/**
 * Declarações de tipos para HTMLFormatterService
 */

import type { MathProblem, MathStats } from '../types/math';
import type { ContextualProblem } from './AIEnhancerService';

export interface FormatterOptions {
  includeAnswerKey?: boolean;
  studentName?: string;
}

export declare namespace HTMLFormatterService {
  function formatGrid(
    problems: MathProblem[],
    stats: MathStats,
    options?: FormatterOptions
  ): string;
  
  function formatContextual(
    problems: ContextualProblem[],
    stats: MathStats,
    options?: FormatterOptions
  ): string;
}

export { HTMLFormatterService };
