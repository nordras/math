export const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour
export const CLEANUP_INTERVAL_MS = 30 * 60 * 1000; // 30 minutes

export const DEFAULT_DIVISOR_MIN = 1;
export const DEFAULT_DIVISOR_MAX = 10;

export const THREE_DIGIT_RATIO = 0.25;

export const DEFAULT_TOTAL_PROBLEMS = 50;
export const MAX_PROBLEMS = 200;
export const MIN_PROBLEMS = 1;

export const MIN_DIGITS = 1;
export const MAX_DIGITS = 5;

export const MIN_QUESTIONS_PER_CONFIG = 0;
export const MAX_QUESTIONS_PER_CONFIG = 100;

export const OPERATION_LABELS = {
  addition: '➕ Adição',
  subtraction: '➖ Subtração',
  multiplication: '✖️ Multiplicação',
  division: '➗ Divisão',
  mixed: '🎲 Misto',
} as const;

export const DIFFICULTY_LABELS = {
  easy: 'Fácil',
  medium: 'Médio',
  hard: 'Difícil',
  custom: 'Personalizado',
} as const;
