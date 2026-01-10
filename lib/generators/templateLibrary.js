/**
 * Template Library
 * Fallback templates for when AI is not available
 */

import { getRandomName } from '../constants/namePool.ts';

class TemplateLibrary {
  constructor() {
    this.contexts = {
      addition: {
        fruits: [
          '{name} colheu {num1} {item1} e depois colheu mais {num2} {item1}.',
          'Há {num1} {item1} em uma cesta e {num2} {item1} em outra cesta.',
          '{name} ganhou {num1} {item1} de sua avó e {num2} {item1} de seu tio.',
        ],
        toys: [
          '{name} tem {num1} {item1} e ganhou mais {num2} {item1}.',
          'No quarto de {name} há {num1} {item1} e ela comprou mais {num2} {item1}.',
          '{name} organizou {num1} {item1} em uma prateleira e {num2} {item1} em outra.',
        ],
        animals: [
          'No jardim, {name} viu {num1} {item1} pela manhã e {num2} {item1} à tarde.',
          '{name} contou {num1} {item1} em uma árvore e {num2} {item1} em outra.',
          'No parque há {num1} {item1} e chegaram mais {num2} {item1}.',
        ],
        school: [
          '{name} tem {num1} {item1} e sua amiga emprestou {num2} {item1}.',
          'Na mochila de {name} há {num1} {item1} e ela colocou mais {num2} {item1}.',
          '{name} organizou {num1} {item1} na estante e depois mais {num2} {item1}.',
        ],
      },
      subtraction: {
        fruits: [
          '{name} tinha {num1} {item1} e comeu {num2} {item1}.',
          'Havia {num1} {item1} na fruteira e {name} pegou {num2} {item1}.',
          '{name} colheu {num1} {item1} e deu {num2} {item1} para sua irmã.',
        ],
        toys: [
          '{name} tinha {num1} {item1} e doou {num2} {item1}.',
          'No quarto havia {num1} {item1} e {name} guardou {num2} {item1}.',
          '{name} tinha {num1} {item1} e perdeu {num2} {item1}.',
        ],
        animals: [
          '{name} viu {num1} {item1} no jardim e {num2} {item1} voaram.',
          'Havia {num1} {item1} no lago e {num2} {item1} nadaram para longe.',
          'No parque tinha {num1} {item1} e {num2} {item1} foram embora.',
        ],
        school: [
          '{name} tinha {num1} {item1} e emprestou {num2} {item1} para um amigo.',
          'Na mochila havia {num1} {item1} e {name} usou {num2} {item1}.',
          '{name} tinha {num1} {item1} e deu {num2} {item1} para seu professor.',
        ],
      },
    };

    this.items = {
      fruits: ['maçãs 🍎', 'morangos 🍓', 'bananas 🍌', 'laranjas 🍊', 'uvas 🍇'],
      toys: ['carrinhos 🚗', 'bonecas 🎀', 'bolas ⚽', 'blocos 🧱', 'ursinhos 🧸'],
      animals: ['borboletas 🦋', 'passarinhos 🐦', 'coelhos 🐰', 'gatinhos 🐱', 'cachorrinhos 🐶'],
      school: ['lápis ✏️', 'livros 📚', 'cadernos 📓', 'canetas 🖊️', 'borrachas'],
    };
  }

  /**
   * Selects a random item from an array
   */
  randomChoice(array) {
    return array[Math.floor(Math.random() * array.length)];
  }

  /**
   * Generates a context for a problem
   */
  getContext(operation, num1, num2) {
    // Get a random name from the pool
    const name = getRandomName();

    // Select random category
    const categories = Object.keys(this.contexts[operation]);
    const category = this.randomChoice(categories);

    // Select random template
    const templates = this.contexts[operation][category];
    const template = this.randomChoice(templates);

    // Select random item
    const items = this.items[category];
    const item = this.randomChoice(items);

    // Replace placeholders
    const context = template
      .replace(/{name}/g, name)
      .replace(/{num1}/g, num1)
      .replace(/{num2}/g, num2)
      .replace(/{item1}/g, item);

    return context;
  }

  /**
   * Generates a complete contextualized problem
   */
  generateWordProblem(problem) {
    const context = this.getContext(problem.type, problem.num1, problem.num2);

    const question = problem.type === 'addition' ? 'Quantos no total?' : 'Quantos restaram?';

    return {
      context,
      question,
      answer: problem.answer,
    };
  }
}

export default TemplateLibrary;
