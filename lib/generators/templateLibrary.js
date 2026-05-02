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
          '{name} tinha {num1} {item1} e doou {num2} {item1} para um amigo.',
          'No quarto havia {num1} {item1} e {name} guardou {num2} {item1}.',
          '{name} tinha {num1} {item1} e emprestou {num2} {item1} para sua prima.',
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
      multiplication: {
        fruits: [
          'Há {num1} cestas com {num2} {item1} em cada cesta.',
          '{name} colheu {num1} galhos com {num2} {item1} em cada galho.',
          'Em cada mesa da festa há {num2} {item1} e tem {num1} mesas.',
        ],
        toys: [
          '{name} tem {num1} caixas com {num2} {item1} em cada caixa.',
          'Há {num1} sacolas com {num2} {item1} em cada sacola.',
          '{name} organizou {num1} grupos de {num2} {item1}.',
        ],
        animals: [
          'No jardim há {num1} flores com {num2} {item1} pousados em cada flor.',
          '{name} viu {num1} árvores com {num2} {item1} em cada árvore.',
          'Há {num1} ninhos com {num2} {item1} em cada ninho.',
        ],
        school: [
          '{name} tem {num1} estojos com {num2} {item1} em cada estojo.',
          'Em cada mochila há {num2} {item1} e há {num1} mochilas.',
          '{name} separou {num1} grupos de {num2} {item1}.',
        ],
      },
      division: {
        fruits: [
          '{name} quer repartir {num1} {item1} igualmente entre {num2} amigos.',
          'Há {num1} {item1} para dividir em {num2} cestas com a mesma quantidade.',
          '{name} separou {num1} {item1} em {num2} grupos com a mesma quantidade.',
        ],
        toys: [
          '{name} tem {num1} {item1} para colocar em {num2} caixas iguais.',
          'Há {num1} {item1} para distribuir entre {num2} crianças.',
          '{name} quer guardar {num1} {item1} em {num2} potes com a mesma quantidade.',
        ],
        animals: [
          'Há {num1} {item1} que se dividiram em {num2} grupos iguais.',
          '{name} separou {num1} {item1} em {num2} ninhos com a mesma quantidade.',
          'No parque, {num1} {item1} foram para {num2} áreas com a mesma quantidade.',
        ],
        school: [
          '{name} quer dividir {num1} {item1} igualmente entre {num2} amigos.',
          'Há {num1} {item1} para distribuir entre {num2} alunos.',
          '{name} separou {num1} {item1} em {num2} grupos iguais.',
        ],
      },
    };

    this.items = {
      fruits: ['maçãs 🍎', 'morangos 🍓', 'bananas 🍌', 'laranjas 🍊', 'uvas 🍇'],
      toys: ['carrinhos 🚗', 'bonecas 🎀', 'bolas ⚽', 'blocos 🧱', 'ursinhos 🧸'],
      animals: ['borboletas 🦋', 'passarinhos 🐦', 'coelhos 🐰', 'gatinhos 🐱', 'cachorrinhos 🐶'],
      school: ['lápis ✏️', 'livros 📚', 'cadernos 📓', 'canetas 🖊️', 'borrachas'],
    };

    this.questions = {
      addition: [
        'Quantos no total?',
        'Quantos ficaram ao todo?',
        'Qual é o total?',
        'Quantos são juntos?',
        'Quantos tem agora?',
      ],
      subtraction: [
        'Quantos restaram?',
        'Quantos sobraram?',
        'Quantos ainda tem?',
        'Quanto sobrou?',
        'Com quantos ficou?',
      ],
      multiplication: [
        'Quantos ao todo?',
        'Quantos são no total?',
        'Qual o total?',
        'Quantos em todos os grupos?',
        'Quantos tem no total?',
      ],
      division: [
        'Quantos para cada um?',
        'Quanto cada um recebe?',
        'Quantos em cada grupo?',
        'Quanto fica para cada um?',
        'Quantos em cada parte?',
      ],
    };
  }

  /**
   * Selects a random item from an array
   */
  randomChoice(array) {
    return array[Math.floor(Math.random() * array.length)];
  }

  /**
   * Returns a random question for the given operation
   */
  getQuestion(operation) {
    const pool = this.questions[operation] || ['Qual é o resultado?'];
    return this.randomChoice(pool);
  }

  /**
   * Generates a context for a problem
   */
  getContext(operation, num1, num2) {
    const name = getRandomName();

    const operationContexts = this.contexts[operation];
    if (!operationContexts) {
      return `${name} precisa calcular ${num1} e ${num2}.`;
    }

    const categories = Object.keys(operationContexts);
    const category = this.randomChoice(categories);
    const templates = operationContexts[category];
    const template = this.randomChoice(templates);
    const items = this.items[category];
    const item = this.randomChoice(items);

    return template
      .replace(/{name}/g, name)
      .replace(/{num1}/g, num1)
      .replace(/{num2}/g, num2)
      .replace(/{item1}/g, item);
  }

  /**
   * Generates a complete contextualized problem
   */
  generateWordProblem(problem) {
    const context = this.getContext(problem.type, problem.num1, problem.num2);
    const question = this.getQuestion(problem.type);

    return {
      context,
      question,
      answer: problem.answer,
    };
  }
}

export default TemplateLibrary;
