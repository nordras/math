/**
 * Testes unitários para MathGenerator
 */

const MathGenerator = require('../generators/mathGenerator');

describe('MathGenerator', () => {
  describe('Constructor', () => {
    test('deve criar instância com opções padrão', () => {
      const generator = new MathGenerator();
      
      expect(generator.options.totalProblems).toBe(50);
      expect(generator.options.additionRatio).toBe(0.5);
      expect(generator.options.difficulty).toBe('medium');
      expect(generator.options.threeDigitRatio).toBe(0.25);
    });

    test('deve aceitar opções customizadas', () => {
      const generator = new MathGenerator({
        totalProblems: 100,
        additionRatio: 0.7,
        difficulty: 'hard',
        threeDigitRatio: 0.5,
      });
      
      expect(generator.options.totalProblems).toBe(100);
      expect(generator.options.additionRatio).toBe(0.7);
      expect(generator.options.difficulty).toBe('hard');
      expect(generator.options.threeDigitRatio).toBe(0.5);
    });
  });

  describe('randomInt', () => {
    test('deve gerar número entre min e max', () => {
      const generator = new MathGenerator();
      
      for (let i = 0; i < 100; i++) {
        const num = generator.randomInt(1, 10);
        expect(num).toBeGreaterThanOrEqual(1);
        expect(num).toBeLessThanOrEqual(10);
      }
    });

    test('deve incluir min e max como valores possíveis', () => {
      const generator = new MathGenerator();
      const results = new Set();
      
      for (let i = 0; i < 1000; i++) {
        results.add(generator.randomInt(1, 3));
      }
      
      expect(results.has(1)).toBe(true);
      expect(results.has(2)).toBe(true);
      expect(results.has(3)).toBe(true);
      expect(results.size).toBe(3);
    });
  });

  describe('shuffle', () => {
    test('deve embaralhar array', () => {
      const generator = new MathGenerator();
      const original = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
      const shuffled = generator.shuffle(original);
      
      expect(shuffled).toHaveLength(original.length);
      expect(shuffled.sort((a, b) => a - b)).toEqual(original);
      
      // Com 10 elementos, é muito improvável manter ordem original
      let isDifferent = false;
      for (let i = 0; i < original.length; i++) {
        if (original[i] !== shuffled[i]) {
          isDifferent = true;
          break;
        }
      }
      expect(isDifferent).toBe(true);
    });

    test('não deve modificar array original', () => {
      const generator = new MathGenerator();
      const original = [1, 2, 3, 4, 5];
      const copy = [...original];
      
      generator.shuffle(original);
      
      expect(original).toEqual(copy);
    });
  });

  describe('generateAddition', () => {
    test('deve gerar problema de adição válido', () => {
      const generator = new MathGenerator();
      const problem = generator.generateAddition('medium');
      
      expect(problem.type).toBe('addition');
      expect(problem.operation).toBe('+');
      expect(problem.answer).toBe(problem.num1 + problem.num2);
      expect(problem.difficulty).toBe('medium');
      expect(problem.threeDigits).toBe(false);
    });

    test('deve respeitar dificuldade easy (1-10)', () => {
      const generator = new MathGenerator();
      
      for (let i = 0; i < 20; i++) {
        const problem = generator.generateAddition('easy');
        expect(problem.num1).toBeGreaterThanOrEqual(1);
        expect(problem.num1).toBeLessThanOrEqual(10);
        expect(problem.num2).toBeGreaterThanOrEqual(1);
        expect(problem.num2).toBeLessThanOrEqual(10);
      }
    });

    test('deve respeitar dificuldade medium (1-20)', () => {
      const generator = new MathGenerator();
      
      for (let i = 0; i < 20; i++) {
        const problem = generator.generateAddition('medium');
        expect(problem.num1).toBeGreaterThanOrEqual(1);
        expect(problem.num1).toBeLessThanOrEqual(20);
        expect(problem.num2).toBeGreaterThanOrEqual(1);
        expect(problem.num2).toBeLessThanOrEqual(20);
      }
    });

    test('deve respeitar dificuldade hard (1-50)', () => {
      const generator = new MathGenerator();
      
      for (let i = 0; i < 20; i++) {
        const problem = generator.generateAddition('hard');
        expect(problem.num1).toBeGreaterThanOrEqual(1);
        expect(problem.num1).toBeLessThanOrEqual(50);
        expect(problem.num2).toBeGreaterThanOrEqual(1);
        expect(problem.num2).toBeLessThanOrEqual(50);
      }
    });

    test('deve gerar números de 3 algarismos quando solicitado', () => {
      const generator = new MathGenerator();
      
      for (let i = 0; i < 20; i++) {
        const problem = generator.generateAddition('medium', true);
        expect(problem.num1).toBeGreaterThanOrEqual(100);
        expect(problem.num1).toBeLessThanOrEqual(999);
        expect(problem.num2).toBeGreaterThanOrEqual(100);
        expect(problem.num2).toBeLessThanOrEqual(999);
        expect(problem.threeDigits).toBe(true);
      }
    });

    test('deve ter display formatado', () => {
      const generator = new MathGenerator();
      const problem = generator.generateAddition('easy');
      
      expect(problem.display).toBe(`${problem.num1} + ${problem.num2}`);
    });
  });

  describe('generateSubtraction', () => {
    test('deve gerar problema de subtração válido', () => {
      const generator = new MathGenerator();
      const problem = generator.generateSubtraction('medium');
      
      expect(problem.type).toBe('subtraction');
      expect(problem.operation).toBe('−');
      expect(problem.answer).toBe(problem.num1 - problem.num2);
      expect(problem.difficulty).toBe('medium');
    });

    test('deve garantir resultado não-negativo', () => {
      const generator = new MathGenerator();
      
      for (let i = 0; i < 50; i++) {
        const problem = generator.generateSubtraction('medium');
        expect(problem.answer).toBeGreaterThanOrEqual(0);
        expect(problem.num1).toBeGreaterThanOrEqual(problem.num2);
      }
    });

    test('deve gerar números de 3 algarismos quando solicitado', () => {
      const generator = new MathGenerator();
      
      for (let i = 0; i < 20; i++) {
        const problem = generator.generateSubtraction('medium', true);
        expect(problem.num1).toBeGreaterThanOrEqual(100);
        expect(problem.num1).toBeLessThanOrEqual(999);
        expect(problem.num2).toBeGreaterThanOrEqual(100);
        expect(problem.num2).toBeLessThanOrEqual(problem.num1);
        expect(problem.threeDigits).toBe(true);
        expect(problem.answer).toBeGreaterThanOrEqual(0);
      }
    });

    test('deve ter display formatado', () => {
      const generator = new MathGenerator();
      const problem = generator.generateSubtraction('easy');
      
      expect(problem.display).toBe(`${problem.num1} − ${problem.num2}`);
    });
  });

  describe('generateMixedProblems', () => {
    test('deve gerar quantidade correta de problemas', () => {
      const generator = new MathGenerator({ totalProblems: 30 });
      const problems = generator.generateMixedProblems();
      
      expect(problems).toHaveLength(30);
    });

    test('deve respeitar ratio de adição', () => {
      const generator = new MathGenerator({
        totalProblems: 100,
        additionRatio: 0.7,
      });
      const problems = generator.generateMixedProblems();
      
      const additions = problems.filter(p => p.type === 'addition').length;
      const subtractions = problems.filter(p => p.type === 'subtraction').length;
      
      expect(additions).toBeGreaterThan(60); // Aproximadamente 70%
      expect(additions).toBeLessThan(80);
      expect(subtractions).toBeGreaterThan(20); // Aproximadamente 30%
      expect(subtractions).toBeLessThan(40);
    });

    test('deve incluir problemas de 3 algarismos', () => {
      const generator = new MathGenerator({
        totalProblems: 40,
        threeDigitRatio: 0.5, // 50% com 3 algarismos
      });
      const problems = generator.generateMixedProblems();
      
      const threeDigitProblems = problems.filter(p => p.threeDigits).length;
      
      expect(threeDigitProblems).toBeGreaterThan(15); // Aproximadamente 50%
      expect(threeDigitProblems).toBeLessThan(25);
    });

    test('deve embaralhar problemas', () => {
      const generator = new MathGenerator({
        totalProblems: 50,
        additionRatio: 0.5,
      });
      const problems = generator.generateMixedProblems();
      
      // Verificar que não são todos de um tipo seguidos
      let hasAlternation = false;
      for (let i = 0; i < problems.length - 1; i++) {
        if (problems[i].type !== problems[i + 1].type) {
          hasAlternation = true;
          break;
        }
      }
      
      expect(hasAlternation).toBe(true);
    });
  });

  describe('validateProblem', () => {
    test('deve validar adição correta', () => {
      const generator = new MathGenerator();
      const problem = {
        num1: 5,
        num2: 3,
        answer: 8,
        type: 'addition',
      };
      
      expect(generator.validateProblem(problem)).toBe(true);
    });

    test('deve invalidar adição incorreta', () => {
      const generator = new MathGenerator();
      const problem = {
        num1: 5,
        num2: 3,
        answer: 9,
        type: 'addition',
      };
      
      expect(generator.validateProblem(problem)).toBe(false);
    });

    test('deve validar subtração correta', () => {
      const generator = new MathGenerator();
      const problem = {
        num1: 10,
        num2: 3,
        answer: 7,
        type: 'subtraction',
      };
      
      expect(generator.validateProblem(problem)).toBe(true);
    });

    test('deve invalidar subtração incorreta', () => {
      const generator = new MathGenerator();
      const problem = {
        num1: 10,
        num2: 3,
        answer: 6,
        type: 'subtraction',
      };
      
      expect(generator.validateProblem(problem)).toBe(false);
    });
  });

  describe('getStatistics', () => {
    test('deve calcular estatísticas corretas', () => {
      const generator = new MathGenerator();
      const problems = [
        { type: 'addition', answer: 10, threeDigits: false },
        { type: 'addition', answer: 20, threeDigits: false },
        { type: 'subtraction', answer: 5, threeDigits: false },
        { type: 'subtraction', answer: 15, threeDigits: true },
      ];
      
      const stats = generator.getStatistics(problems);
      
      expect(stats.total).toBe(4);
      expect(stats.addition).toBe(2);
      expect(stats.subtraction).toBe(2);
      expect(stats.threeDigits).toBe(1);
      expect(stats.maxAnswer).toBe(20);
      expect(stats.minAnswer).toBe(5);
      expect(stats.avgAnswer).toBe(12); // (10+20+5+15)/4 = 12.5 arredondado
    });

    test('deve incluir difficulty das opções', () => {
      const generator = new MathGenerator({ difficulty: 'hard' });
      const problems = [
        { type: 'addition', answer: 10, threeDigits: false },
      ];
      
      const stats = generator.getStatistics(problems);
      
      expect(stats.difficulty).toBe('hard');
    });
  });
});
