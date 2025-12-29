/**
 * Formatador de Grade - Gera layout Markdown para exercícios
 */

class GridFormatter {
  constructor(options = {}) {
    this.options = {
      columns: options.columns || 5,
      includeAnswers: options.includeAnswers || false,
      style: options.style || 'text', // 'text' ou 'html'
      ...options
    };
  }

  /**
   * Gera grade de exercícios em formato texto
   */
  generateTextGrid(problems) {
    const { columns } = this.options;
    let grid = '\n';

    // Formato de lista vertical numerada
    problems.forEach((problem, index) => {
      const num = index + 1;
      const letter = String.fromCharCode(65 + (index % 10)); // A-J
      
      grid += `**${num}.**  ${problem.num1} ${problem.operation} ${problem.num2} = ______\n\n`;
    });

    return grid;
  }

  /**
   * Gera grade de exercícios em formato HTML
   */
  generateHtmlGrid(problems) {
    const { columns } = this.options;
    let html = '<div style="display: grid; grid-template-columns: repeat(' + columns + ', 1fr); gap: 30px; text-align: center; font-family: monospace; font-size: 18px; margin: 20px 0;">\n\n';

    problems.forEach((problem) => {
      html += '<div style="border: 1px solid #ddd; padding: 15px; border-radius: 5px;">\n';
      html += `  <div style="font-size: 20px; font-weight: bold;">${problem.num1}</div>\n`;
      html += `  <div style="font-size: 20px; font-weight: bold;">${problem.operation} ${problem.num2}</div>\n`;
      html += '  <div style="border-top: 2px solid #333; margin: 5px 0; padding-top: 5px;">____</div>\n';
      html += '</div>\n\n';
    });

    html += '</div>\n';
    return html;
  }

  /**
   * Gera cabeçalho do exercício
   */
  generateHeader(options = {}) {
    const {
      title = '50 Problemas Mistos: Adição e Subtração',
      studentName = 'Cecília',
      difficulty = 'Médio',
      totalProblems = 50
    } = options;

    return `# 📝 ${title}

**Nome:** ${studentName} ________________  **Data:** ____/____/____

**Nível de Dificuldade:** ${difficulty}  
**Total de Problemas:** ${totalProblems}

---

## 📋 Instruções

Resolva todos os problemas abaixo. Tome seu tempo e confira suas respostas!

- ✏️  Escreva a resposta em cada linha abaixo do problema
- 🧮 Use papel de rascunho se precisar
- ✅ Confira suas contas antes de finalizar
- 💪 Faça o seu melhor!

---

`;
  }

  /**
   * Gera seção de resultados
   */
  generateResultsSection(totalProblems = 50) {
    return `---

## 📊 Resultado

**Problemas Resolvidos:** ______ / ${totalProblems}  
**Acertos:** ______ / ${totalProblems}  
**Porcentagem:** ______%  
**Tempo Total:** ______ minutos

---

## 🏆 Classificação

| Acertos | Classificação | Desempenho |
|---------|---------------|------------|
| ${Math.floor(totalProblems * 0.9)}-${totalProblems} | 🌟🌟🌟 | Excelente! Incrível! |
| ${Math.floor(totalProblems * 0.75)}-${Math.floor(totalProblems * 0.89)} | 🌟🌟 | Muito Bom! Continue assim! |
| ${Math.floor(totalProblems * 0.6)}-${Math.floor(totalProblems * 0.74)} | 🌟 | Bom! Você está aprendendo! |
| 0-${Math.floor(totalProblems * 0.59)} | 💪 | Continue Praticando! |

---

**Parabéns pelo esforço, Cecília! 🎉**

> "A matemática é a música da razão." - James Joseph Sylvester

`;
  }

  /**
   * Gera seção de estatísticas sobre os problemas
   */
  generateStatsSection(stats) {
    let statsText = `---

## 📈 Sobre Este Exercício

- **Total de Problemas:** ${stats.total}
- **Problemas de Adição:** ${stats.addition} (${Math.round(stats.addition / stats.total * 100)}%)
- **Problemas de Subtração:** ${stats.subtraction} (${Math.round(stats.subtraction / stats.total * 100)}%)`;

    if (stats.threeDigits > 0) {
      statsText += `\n- **Problemas com 3 Algarismos:** ${stats.threeDigits} (${Math.round(stats.threeDigits / stats.total * 100)}%)`;
    }

    statsText += `
- **Nível de Dificuldade:** ${this.getDifficultyLabel(stats.difficulty)}
- **Menor Resposta:** ${stats.minAnswer}
- **Maior Resposta:** ${stats.maxAnswer}
- **Resposta Média:** ${stats.avgAnswer}

`;
    
    return statsText;
  }

  /**
   * Obtém label de dificuldade
   */
  getDifficultyLabel(difficulty) {
    const labels = {
      easy: 'Fácil (números até 10)',
      medium: 'Médio (números até 20)',
      hard: 'Difícil (números até 50)'
    };
    return labels[difficulty] || difficulty;
  }

  /**
   * Gera gabarito (folha de respostas)
   */
  generateAnswerKey(problems) {
    let answerKey = `---

## 📖 Gabarito (Para o Professor)

`;

    const { columns } = this.options;
    
    // Formato de lista em colunas para o gabarito
    for (let i = 0; i < problems.length; i += columns) {
      const row = problems.slice(i, i + columns);
      const answers = row.map((p, idx) => {
        const num = i + idx + 1;
        return `**${num}.** ${p.answer}`.padEnd(12, ' ');
      });
      answerKey += answers.join('  ') + '\n';
    }

    return answerKey;
  }

  /**
   * Gera documento completo
   */
  generateComplete(problems, stats, options = {}) {
    const {
      includeAnswerKey = false,
      includeStats = true,
      style = this.options.style
    } = options;

    let markdown = '';

    // Cabeçalho
    markdown += this.generateHeader({
      totalProblems: problems.length,
      difficulty: this.getDifficultyLabel(stats.difficulty)
    });

    // Grade de problemas
    markdown += '## 🧮 Problemas\n';
    
    if (style === 'html') {
      markdown += this.generateHtmlGrid(problems);
    } else {
      markdown += this.generateTextGrid(problems);
    }

    // Seção de resultados
    markdown += this.generateResultsSection(problems.length);

    // Estatísticas (opcional)
    if (includeStats) {
      markdown += this.generateStatsSection(stats);
    }

    // Gabarito (opcional)
    if (includeAnswerKey) {
      markdown += this.generateAnswerKey(problems);
    }

    return markdown;
  }

  /**
   * Gera exercício com problemas contextualizados
   */
  generateWithContext(problemsWithContext, stats, options = {}) {
    let markdown = '';

    // Cabeçalho
    markdown += this.generateHeader({
      title: '📚 Problemas Contextualizados: Adição e Subtração',
      totalProblems: problemsWithContext.length,
      difficulty: this.getDifficultyLabel(stats.difficulty)
    });

    // Problemas com contexto
    markdown += '## 📖 Problemas\n\n';

    problemsWithContext.forEach((item, index) => {
      markdown += `### Problema ${index + 1}\n\n`;
      markdown += `${item.context}\n\n`;
      
      // Adicionar a operação matemática
      if (item.num1 !== undefined && item.num2 !== undefined) {
        markdown += `\n\`\`\`\n  ${item.num1}\n${item.operation} ${item.num2}\n____\n\`\`\`\n\n`;
      }
      
      markdown += `${item.question}\n\n`;
      markdown += `**Resposta:** __________________\n\n`;
      markdown += `---\n\n`;
    });

    // Seção de resultados
    markdown += this.generateResultsSection(problemsWithContext.length);

    // Estatísticas (opcional)
    if (options.includeStats) {
      markdown += this.generateStatsSection(stats);
    }

    // Gabarito (opcional)
    if (options.includeAnswerKey) {
      markdown += '\n## 📖 Gabarito (Para o Professor)\n\n';
      problemsWithContext.forEach((item, index) => {
        markdown += `**${index + 1}.** ${item.answer}\n`;
      });
    }

    return markdown;
  }
}

module.exports = GridFormatter;
