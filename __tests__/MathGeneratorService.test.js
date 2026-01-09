/**
 * Testes unitários para MathGeneratorService
 */

const { MathGeneratorService } = require('../lib/services/MathGeneratorService');

describe('MathGeneratorService', () => {
  describe('validateOptions', () => {
    test('deve validar opções básicas corretamente', () => {
      const options = {
        totalProblems: 50,
        difficulty: 'medium',
        additionRatio: 0.5,
      };

      const validated = MathGeneratorService.validateOptions(options);

      expect(validated.totalProblems).toBe(50);
      expect(validated.difficulty).toBe('medium');
      expect(validated.additionRatio).toBe(0.5);
    });

    test('deve limitar totalProblems entre 1 e 200', () => {
      expect(MathGeneratorService.validateOptions({ totalProblems: -10 }).totalProblems).toBe(1);
      expect(MathGeneratorService.validateOptions({ totalProblems: 0 }).totalProblems).toBeGreaterThanOrEqual(1);
      expect(MathGeneratorService.validateOptions({ totalProblems: 300 }).totalProblems).toBe(200);
      expect(MathGeneratorService.validateOptions({ totalProblems: 100 }).totalProblems).toBe(100);
    });

    test('deve usar dificuldade padrão para valores inválidos', () => {
      expect(MathGeneratorService.validateOptions({ difficulty: 'invalid' }).difficulty).toBe('medium');
      expect(MathGeneratorService.validateOptions({}).difficulty).toBe('medium');
    });

    test('deve validar digitConfigs corretamente', () => {
      const options = {
        digitConfigs: [
          { digits: 2, questions: 10, operation: 'addition' },
          { digits: 3, questions: 15, operation: 'multiplication' },
        ],
      };

      const validated = MathGeneratorService.validateOptions(options);

      expect(validated.digitConfigs).toHaveLength(2);
      expect(validated.digitConfigs[0]).toEqual({
        digits: 2,
        questions: 10,
        operation: 'addition',
      });
      expect(validated.digitConfigs[1]).toEqual({
        digits: 3,
        questions: 15,
        operation: 'multiplication',
      });
    });

    test('deve limitar digits entre 1 e 5', () => {
      const options = {
        digitConfigs: [
          { digits: 0, questions: 10, operation: 'addition' },
          { digits: 10, questions: 10, operation: 'addition' },
          { digits: 3, questions: 10, operation: 'addition' },
        ],
      };

      const validated = MathGeneratorService.validateOptions(options);

      // 0 se torna 1, 10 se torna 5, 3 permanece 3
      expect(validated.digitConfigs[0].digits).toBeGreaterThanOrEqual(1);
      expect(validated.digitConfigs[0].digits).toBeLessThanOrEqual(5);
      expect(validated.digitConfigs[1].digits).toBeGreaterThanOrEqual(1);
      expect(validated.digitConfigs[1].digits).toBeLessThanOrEqual(5);
      expect(validated.digitConfigs[2].digits).toBe(3);
    });

    test('deve limitar questions entre 0 e 100', () => {
      const options = {
        digitConfigs: [
          { digits: 2, questions: -5, operation: 'addition' },
          { digits: 2, questions: 200, operation: 'addition' },
          { digits: 3, questions: 10, operation: 'addition' },
        ],
      };

      const validated = MathGeneratorService.validateOptions(options);

      expect(validated.digitConfigs[0].questions).toBe(0);
      expect(validated.digitConfigs[1].questions).toBe(100);
      expect(validated.digitConfigs[2].questions).toBe(10);
    });

    test('deve usar operação padrão para valores inválidos', () => {
      const options = {
        digitConfigs: [
          { digits: 2, questions: 10, operation: 'invalid' },
        ],
      };

      const validated = MathGeneratorService.validateOptions(options);

      expect(validated.digitConfigs[0].operation).toBe('addition');
    });
  });

  describe('generateProblems', () => {
    test('deve gerar problemas com digitConfigs', () => {
      const options = {
        digitConfigs: [
          { digits: 2, questions: 5, operation: 'addition' },
          { digits: 2, questions: 5, operation: 'subtraction' },
        ],
      };

      const result = MathGeneratorService.generateProblems(options);

      expect(result.problems).toHaveLength(10);
      expect(result.stats.totalProblems).toBe(10);
      expect(result.stats.additions).toBe(5);
      expect(result.stats.subtractions).toBe(5);
    });

    test('deve gerar números com quantidade correta de algarismos', () => {
      const options = {
        digitConfigs: [
          { digits: 2, questions: 10, operation: 'addition' },
        ],
      };

      const result = MathGeneratorService.generateProblems(options);

      result.problems.forEach(problem => {
        expect(problem.num1).toBeGreaterThanOrEqual(10);
        expect(problem.num1).toBeLessThanOrEqual(99);
        expect(problem.num2).toBeGreaterThanOrEqual(10);
        expect(problem.num2).toBeLessThanOrEqual(99);
      });
    });

    test('deve gerar adições corretamente', () => {
      const options = {
        digitConfigs: [
          { digits: 2, questions: 5, operation: 'addition' },
        ],
      };

      const result = MathGeneratorService.generateProblems(options);

      result.problems.forEach(problem => {
        expect(problem.type).toBe('addition');
        expect(problem.answer).toBe(problem.num1 + problem.num2);
        expect(problem.operation).toContain('+');
      });
    });

    test('deve gerar subtrações sem resultados negativos', () => {
      const options = {
        digitConfigs: [
          { digits: 2, questions: 10, operation: 'subtraction' },
        ],
      };

      const result = MathGeneratorService.generateProblems(options);

      result.problems.forEach(problem => {
        expect(problem.type).toBe('subtraction');
        expect(problem.answer).toBeGreaterThanOrEqual(0);
        expect(problem.answer).toBe(problem.num1 - problem.num2);
        expect(problem.num1).toBeGreaterThanOrEqual(problem.num2);
        expect(problem.operation).toContain('-');
      });
    });

    test('deve gerar multiplicações corretamente', () => {
      const options = {
        digitConfigs: [
          { digits: 2, questions: 5, operation: 'multiplication' },
        ],
      };

      const result = MathGeneratorService.generateProblems(options);

      result.problems.forEach(problem => {
        expect(problem.type).toBe('multiplication');
        expect(problem.answer).toBe(problem.num1 * problem.num2);
        expect(problem.operation).toContain('×');
      });
    });

    test('deve gerar divisões exatas', () => {
      const options = {
        digitConfigs: [
          { digits: 2, questions: 10, operation: 'division' },
        ],
      };

      const result = MathGeneratorService.generateProblems(options);

      result.problems.forEach(problem => {
        expect(problem.type).toBe('division');
        expect(problem.num1 / problem.num2).toBe(problem.answer);
        expect(Number.isInteger(problem.answer)).toBe(true);
        expect(problem.operation).toContain('÷');
      });
    });

    test('deve gerar operações mistas', () => {
      const options = {
        digitConfigs: [
          { digits: 2, questions: 40, operation: 'mixed' },
        ],
      };

      const result = MathGeneratorService.generateProblems(options);

      const types = new Set(result.problems.map(p => p.type));
      
      // Com 40 problemas aleatórios, devemos ter pelo menos 2 tipos diferentes
      expect(types.size).toBeGreaterThanOrEqual(2);
      expect(result.problems).toHaveLength(40);
    });

    test('deve ignorar configurações com 0 perguntas', () => {
      const options = {
        digitConfigs: [
          { digits: 2, questions: 0, operation: 'addition' },
          { digits: 3, questions: 10, operation: 'subtraction' },
        ],
      };

      const result = MathGeneratorService.generateProblems(options);

      expect(result.problems).toHaveLength(10);
      expect(result.stats.totalProblems).toBe(10);
    });

    test('deve usar gerador antigo quando digitConfigs não é fornecido', () => {
      const options = {
        totalProblems: 20,
        difficulty: 'medium',
        additionRatio: 0.5,
      };

      const result = MathGeneratorService.generateProblems(options);

      expect(result.problems).toBeDefined();
      expect(result.problems.length).toBeGreaterThan(0);
      expect(result.stats).toBeDefined();
      // O gerador antigo pode ter stats diferentes, apenas verificamos que existe
    });

    test('deve gerar estatísticas corretas', () => {
      const options = {
        digitConfigs: [
          { digits: 2, questions: 10, operation: 'addition' },
          { digits: 2, questions: 5, operation: 'subtraction' },
          { digits: 2, questions: 3, operation: 'multiplication' },
          { digits: 2, questions: 2, operation: 'division' },
        ],
      };

      const result = MathGeneratorService.generateProblems(options);

      expect(result.stats.totalProblems).toBe(20);
      expect(result.stats.additions).toBe(10);
      expect(result.stats.subtractions).toBe(5);
      expect(result.stats.multiplications).toBe(3);
      expect(result.stats.divisions).toBe(2);
      expect(result.stats.difficulty).toBe('custom');
      expect(result.stats.digitConfigs).toEqual(options.digitConfigs);
    });
  });

  describe('generateFromDigitConfigs', () => {
    test('deve ser chamado quando digitConfigs é fornecido', () => {
      const spy = jest.spyOn(MathGeneratorService, 'generateFromDigitConfigs');
      
      const options = {
        digitConfigs: [
          { digits: 2, questions: 5, operation: 'addition' },
        ],
      };

      MathGeneratorService.generateProblems(options);

      expect(spy).toHaveBeenCalledWith(options.digitConfigs);
      
      spy.mockRestore();
    });

    test('não deve ser chamado quando digitConfigs não é fornecido', () => {
      const spy = jest.spyOn(MathGeneratorService, 'generateFromDigitConfigs');
      
      const options = {
        totalProblems: 10,
        difficulty: 'easy',
      };

      MathGeneratorService.generateProblems(options);

      expect(spy).not.toHaveBeenCalled();
      
      spy.mockRestore();
    });
  });
});
