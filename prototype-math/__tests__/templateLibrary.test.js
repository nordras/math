/**
 * Testes unitários para TemplateLibrary
 */

const TemplateLibrary = require('../generators/templateLibrary');

describe('TemplateLibrary', () => {
  let library;

  beforeEach(() => {
    library = new TemplateLibrary();
  });

  describe('Constructor', () => {
    test('deve inicializar com contextos de adição e subtração', () => {
      expect(library.contexts).toBeDefined();
      expect(library.contexts.addition).toBeDefined();
      expect(library.contexts.subtraction).toBeDefined();
    });

    test('deve ter categorias de contextos', () => {
      expect(library.contexts.addition.fruits).toBeDefined();
      expect(library.contexts.addition.toys).toBeDefined();
      expect(library.contexts.addition.animals).toBeDefined();
      expect(library.contexts.addition.school).toBeDefined();
      
      expect(library.contexts.subtraction.fruits).toBeDefined();
      expect(library.contexts.subtraction.toys).toBeDefined();
      expect(library.contexts.subtraction.animals).toBeDefined();
      expect(library.contexts.subtraction.school).toBeDefined();
    });

    test('deve ter itens para cada categoria', () => {
      expect(library.items).toBeDefined();
      expect(library.items.fruits).toBeDefined();
      expect(library.items.toys).toBeDefined();
      expect(library.items.animals).toBeDefined();
      expect(library.items.school).toBeDefined();
    });
  });

  describe('getContext', () => {
    test('deve retornar contexto para adição', () => {
      const context = library.getContext('addition', 5, 3);
      
      expect(typeof context).toBe('string');
      expect(context).toBeTruthy();
      expect(context).toContain('5');
      expect(context).toContain('3');
      expect(context.toLowerCase()).toContain('cecília');
    });

    test('deve retornar contexto para subtração', () => {
      const context = library.getContext('subtraction', 10, 4);
      
      expect(typeof context).toBe('string');
      expect(context).toBeTruthy();
      expect(context).toContain('10');
      expect(context).toContain('4');
      expect(context.toLowerCase()).toContain('cecília');
    });

    test('deve incluir números no contexto', () => {
      const context = library.getContext('addition', 12, 7);
      
      expect(context).toContain('12');
      expect(context).toContain('7');
    });

    test('deve retornar contextos diferentes para múltiplas chamadas', () => {
      const contexts = new Set();
      
      for (let i = 0; i < 20; i++) {
        const context = library.getContext('addition', 5, 3);
        contexts.add(context);
      }
      
      // Com múltiplas categorias e templates, deve haver variedade
      expect(contexts.size).toBeGreaterThan(1);
    });

    test('deve funcionar com números grandes', () => {
      const context = library.getContext('addition', 123, 456);
      
      expect(context).toContain('123');
      expect(context).toContain('456');
    });

    test('deve usar fallback para tipo desconhecido', () => {
      const context = library.getContext('unknown', 5, 3);
      
      expect(typeof context).toBe('string');
      expect(context).toBeTruthy();
      // Deve usar adição como fallback
      expect(context).toContain('5');
      expect(context).toContain('3');
    });
  });

  describe('formatContext', () => {
    test('deve substituir placeholders num1 e num2', () => {
      const template = 'Cecília tinha {num1} maçãs e ganhou {num2} maçãs.';
      const formatted = library.formatContext(template, 5, 3);
      
      expect(formatted).toBe('Cecília tinha 5 maçãs e ganhou 3 maçãs.');
      expect(formatted).not.toContain('{num1}');
      expect(formatted).not.toContain('{num2}');
    });

    test('deve substituir placeholder item1', () => {
      const template = 'Cecília tem {num1} {item1} e ganhou {num2} {item1}.';
      const formatted = library.formatContext(template, 5, 3, 'carrinhos');
      
      expect(formatted).toBe('Cecília tem 5 carrinhos e ganhou 3 carrinhos.');
      expect(formatted).not.toContain('{item1}');
    });

    test('deve manter template se item não fornecido', () => {
      const template = 'Cecília tem {num1} {item1}.';
      const formatted = library.formatContext(template, 5, 3);
      
      // Se não fornece item, mantém o placeholder ou substitui por padrão
      expect(formatted).toContain('5');
    });

    test('deve funcionar com múltiplos placeholders do mesmo tipo', () => {
      const template = '{num1} e {num1} e {num2}';
      const formatted = library.formatContext(template, 7, 4);
      
      expect(formatted).toBe('7 e 7 e 4');
    });
  });

  describe('Variedade de contextos', () => {
    test('deve ter múltiplos templates de adição para frutas', () => {
      expect(library.contexts.addition.fruits.length).toBeGreaterThan(1);
    });

    test('deve ter múltiplos templates de subtração para brinquedos', () => {
      expect(library.contexts.subtraction.toys.length).toBeGreaterThan(1);
    });

    test('deve ter itens variados para frutas', () => {
      expect(library.items.fruits.length).toBeGreaterThan(3);
      expect(library.items.fruits).toContain('maçãs');
    });

    test('deve ter itens variados para brinquedos', () => {
      expect(library.items.toys.length).toBeGreaterThan(3);
    });

    test('deve ter itens variados para animais', () => {
      expect(library.items.animals.length).toBeGreaterThan(3);
    });

    test('deve ter itens variados para escola', () => {
      expect(library.items.school.length).toBeGreaterThan(3);
      expect(library.items.school).toContain('lápis');
    });
  });

  describe('Integração com MathGenerator', () => {
    test('deve gerar contexto válido para problema de adição', () => {
      const problem = {
        type: 'addition',
        num1: 15,
        num2: 8,
        answer: 23,
      };
      
      const context = library.getContext(problem.type, problem.num1, problem.num2);
      
      expect(context).toContain(String(problem.num1));
      expect(context).toContain(String(problem.num2));
      expect(context.toLowerCase()).toContain('cecília');
    });

    test('deve gerar contexto válido para problema de subtração', () => {
      const problem = {
        type: 'subtraction',
        num1: 20,
        num2: 7,
        answer: 13,
      };
      
      const context = library.getContext(problem.type, problem.num1, problem.num2);
      
      expect(context).toContain(String(problem.num1));
      expect(context).toContain(String(problem.num2));
      expect(context.toLowerCase()).toContain('cecília');
    });
  });
});
