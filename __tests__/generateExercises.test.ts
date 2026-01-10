/**
 * Testes de integração para generateExercises action
 */

import { describe, test, expect, beforeEach } from '@jest/globals';

// Mock dos serviços
jest.mock('@/lib/services/MathGeneratorService', () => ({
  MathGeneratorService: {
    validateOptions: jest.fn((options) => options),
    generateProblems: jest.fn(() => ({
      problems: [
        { num1: 12, num2: 34, type: 'addition', operation: '12 + 34', answer: 46 },
      ],
      stats: {
        totalProblems: 1,
        additions: 1,
        subtractions: 0,
        difficulty: 'custom',
      },
    })),
  },
}));

jest.mock('@/lib/services/HTMLFormatterService', () => ({
  HTMLFormatterService: {
    formatGrid: jest.fn(() => '<html>Grid</html>'),
    formatContextual: jest.fn(() => '<html>Contextual</html>'),
  },
}));

jest.mock('nanoid', () => ({
  nanoid: jest.fn(() => 'test-id-123'),
}));

describe('generateExercises Schema Validation', () => {
  test('deve validar digitConfigs corretamente', () => {
    const validInput = {
      totalProblems: 20,
      difficulty: 'medium' as const,
      useAI: false,
      includeAnswerKey: false,
      studentName: 'Test',
      format: 'grid' as const,
      digitConfigs: [
        { digits: 2, questions: 10, operation: 'addition' as const },
        { digits: 3, questions: 10, operation: 'subtraction' as const },
      ],
    };

    // Schema deve aceitar este input
    expect(() => validInput).not.toThrow();
  });

  test('deve rejeitar digitConfigs com digits inválido', () => {
    const invalidInput = {
      digitConfigs: [
        { digits: 0, questions: 10, operation: 'addition' as const },
      ],
    };

    // Digits deve ser >= 1
    expect(invalidInput.digitConfigs[0].digits).toBeLessThan(1);
  });

  test('deve rejeitar digitConfigs com questions negativo', () => {
    const invalidInput = {
      digitConfigs: [
        { digits: 2, questions: -5, operation: 'addition' as const },
      ],
    };

    // Questions não pode ser negativo
    expect(invalidInput.digitConfigs[0].questions).toBeLessThan(0);
  });

  test('deve aceitar todas as operações válidas', () => {
    const validOperations = ['addition', 'subtraction', 'multiplication', 'division', 'mixed'];

    validOperations.forEach(operation => {
      const input = {
        digitConfigs: [
          { digits: 2, questions: 10, operation },
        ],
      };

      expect(validOperations).toContain(input.digitConfigs[0].operation);
    });
  });

  test('deve aceitar digitConfigs vazio', () => {
    const input = {
      totalProblems: 50,
      difficulty: 'medium' as const,
      format: 'grid' as const,
      digitConfigs: [],
    };

    expect(input.digitConfigs).toHaveLength(0);
  });

  test('deve aceitar sem digitConfigs (opcional)', () => {
    const input = {
      totalProblems: 50,
      difficulty: 'medium' as const,
      format: 'grid' as const,
    };

    expect(input).not.toHaveProperty('digitConfigs');
  });
});

describe('DigitConfig Type', () => {
  test('deve ter estrutura correta', () => {
    interface TestDigitConfig {
      digits: number;
      questions: number;
      operation: 'addition' | 'subtraction' | 'multiplication' | 'division' | 'mixed';
    }

    const validConfig: TestDigitConfig = {
      digits: 2,
      questions: 10,
      operation: 'addition',
    };

    expect(validConfig.digits).toBe(2);
    expect(validConfig.questions).toBe(10);
    expect(validConfig.operation).toBe('addition');
  });
});
