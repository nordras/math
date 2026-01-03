/**
 * Biblioteca de Templates
 * Templates de fallback para quando a IA não estiver disponível
 */

class TemplateLibrary {
  constructor() {
    this.contexts = {
      addition: {
        fruits: [
          'Cecília colheu {num1} {item1} e depois colheu mais {num2} {item1}.',
          'Há {num1} {item1} em uma cesta e {num2} {item1} em outra cesta.',
          'Cecília ganhou {num1} {item1} de sua avó e {num2} {item1} de seu tio.'
        ],
        toys: [
          'Cecília tem {num1} {item1} e ganhou mais {num2} {item1}.',
          'No quarto de Cecília há {num1} {item1} e ela comprou mais {num2} {item1}.',
          'Cecília organizou {num1} {item1} em uma prateleira e {num2} {item1} em outra.'
        ],
        animals: [
          'No jardim, Cecília viu {num1} {item1} pela manhã e {num2} {item1} à tarde.',
          'Cecília contou {num1} {item1} em uma árvore e {num2} {item1} em outra.',
          'No parque há {num1} {item1} e chegaram mais {num2} {item1}.'
        ],
        school: [
          'Cecília tem {num1} {item1} e sua amiga emprestou {num2} {item1}.',
          'Na mochila de Cecília há {num1} {item1} e ela colocou mais {num2} {item1}.',
          'Cecília organizou {num1} {item1} na estante e depois mais {num2} {item1}.'
        ]
      },
      subtraction: {
        fruits: [
          'Cecília tinha {num1} {item1} e comeu {num2} {item1}.',
          'Havia {num1} {item1} na fruteira e Cecília pegou {num2} {item1}.',
          'Cecília colheu {num1} {item1} e deu {num2} {item1} para sua irmã.'
        ],
        toys: [
          'Cecília tinha {num1} {item1} e doou {num2} {item1}.',
          'No quarto havia {num1} {item1} e Cecília guardou {num2} {item1}.',
          'Cecília tinha {num1} {item1} e perdeu {num2} {item1}.'
        ],
        animals: [
          'Cecília viu {num1} {item1} no jardim e {num2} {item1} voaram.',
          'Havia {num1} {item1} no lago e {num2} {item1} nadaram para longe.',
          'No parque tinha {num1} {item1} e {num2} {item1} foram embora.'
        ],
        school: [
          'Cecília tinha {num1} {item1} e emprestou {num2} {item1} para um amigo.',
          'Na mochila havia {num1} {item1} e Cecília usou {num2} {item1}.',
          'Cecília tinha {num1} {item1} e deu {num2} {item1} para seu professor.'
        ]
      }
    };

    this.items = {
      fruits: ['maçãs 🍎', 'morangos 🍓', 'bananas 🍌', 'laranjas 🍊', 'uvas 🍇'],
      toys: ['carrinhos 🚗', 'bonecas 🎀', 'bolas ⚽', 'blocos 🧱', 'ursinhos 🧸'],
      animals: ['borboletas 🦋', 'passarinhos 🐦', 'coelhos 🐰', 'gatinhos 🐱', 'cachorrinhos 🐶'],
      school: ['lápis ✏️', 'livros 📚', 'cadernos 📓', 'canetas 🖊️', 'borrachas']
    };
  }

  /**
   * Seleciona um item aleatório de um array
   */
  randomChoice(array) {
    return array[Math.floor(Math.random() * array.length)];
  }

  /**
   * Gera um contexto para um problema
   */
  getContext(operation, num1, num2) {
    // Selecionar categoria aleatória
    const categories = Object.keys(this.contexts[operation]);
    const category = this.randomChoice(categories);

    // Selecionar template aleatório
    const templates = this.contexts[operation][category];
    const template = this.randomChoice(templates);

    // Selecionar item aleatório
    const items = this.items[category];
    const item = this.randomChoice(items);

    // Substituir placeholders
    const context = template
      .replace(/{num1}/g, num1)
      .replace(/{num2}/g, num2)
      .replace(/{item1}/g, item);

    return context;
  }

  /**
   * Gera um problema contextualizado completo
   */
  generateWordProblem(problem) {
    const context = this.getContext(problem.type, problem.num1, problem.num2);
    
    const question = problem.type === 'addition' 
      ? 'Quantos no total?'
      : 'Quantos restaram?';

    return {
      context,
      question,
      answer: problem.answer
    };
  }
}

module.exports = TemplateLibrary;
