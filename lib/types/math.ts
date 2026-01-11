/**
 * Tipos compartilhados para geração de exercícios matemáticos
 */

/** Operações matemáticas suportadas */
export type MathOperation = 'addition' | 'subtraction' | 'multiplication' | 'division';

/** Configuração de dígitos para geração de problemas */
export interface DigitConfig {
  /** Número de dígitos */
  digits: number;
  /** Quantidade de questões */
  questions: number;
  /** Operação matemática */
  operation: MathOperation | 'mixed';
  /** Divisor mínimo (apenas para divisão) */
  divisorMin?: number;
  /** Divisor máximo (apenas para divisão) */
  divisorMax?: number;
}

/** Níveis de dificuldade */
export type DifficultyLevel = 'easy' | 'medium' | 'hard';

/** Opções para geração de problemas matemáticos */
export interface MathGeneratorOptions {
  /** Total de problemas a gerar */
  totalProblems?: number;
  /** Nível de dificuldade */
  difficulty?: DifficultyLevel;
  /** Proporção de adições (0-1) */
  additionRatio?: number;
  /** Configurações de dígitos */
  digitConfigs?: DigitConfig[];
}

/** Problema matemático individual */
export interface MathProblem {
  /** Primeiro número */
  num1: number;
  /** Segundo número */
  num2: number;
  /** Tipo de operação */
  type: MathOperation;
  /** Símbolo da operação */
  operation: string;
  /** Resposta correta */
  answer: number;
}

/** Estatísticas de problemas gerados */
export interface MathStats {
  /** Total de problemas */
  totalProblems: number;
  /** Total (legado, equivalente a totalProblems) */
  total?: number;
  /** Quantidade de adições */
  additions: number;
  /** Quantidade de subtrações */
  subtractions: number;
  /** Quantidade de multiplicações */
  multiplications?: number;
  /** Quantidade de divisões */
  divisions?: number;
  /** Nível de dificuldade */
  difficulty: string;
  /** Início do range de números */
  rangeStart?: number;
  /** Fim do range de números */
  rangeEnd?: number;
  /** Configurações de dígitos usadas */
  digitConfigs?: DigitConfig[];
}

/** Resultado da geração de problemas */
export interface GenerateProblemsResult {
  /** Lista de problemas gerados */
  problems: MathProblem[];
  /** Estatísticas da geração */
  stats: MathStats;
}

/** Problema matemático com contexto narrativo */
export interface ContextualProblem {
  /** Contexto narrativo do problema */
  context: string;
  /** Pergunta a ser respondida */
  question: string;
  /** Resposta correta */
  answer: number;
  /** Primeiro número (para referência) */
  num1: number;
  /** Segundo número (para referência) */
  num2: number;
  /** Símbolo da operação */
  operation: string;
}
