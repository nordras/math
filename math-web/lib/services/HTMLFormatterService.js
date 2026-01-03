/**
 * Serviço para formatação de exercícios em HTML
 * Adapta os templates existentes para renderização web
 */

export class HTMLFormatterService {
  /**
   * Formata problemas em grade para HTML
   * @param {Array} problems - Lista de problemas
   * @param {object} stats - Estatísticas
   * @param {object} options - Opções de formatação
   * @returns {string} - HTML formatado
   */
  static formatGrid(problems, stats, options = {}) {
    const { includeAnswerKey = false, studentName = 'Cecília' } = options;

    const title = includeAnswerKey
      ? `Gabarito - ${stats.total} Exercícios de Matemática`
      : `${stats.total} Exercícios de Matemática para ${studentName}`;

    const problemsHtml = problems
      .map((problem, index) => {
        const display = `${problem.num1} ${problem.operation} ${problem.num2}`;
        const answer = includeAnswerKey ? ` = <strong>${problem.answer}</strong>` : ' = _____';
        
        return `<div class="problem-item">
          <span class="problem-number">${index + 1})</span>
          <span class="problem-expression">${display}${answer}</span>
        </div>`;
      })
      .join('\n');

    return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Comic Sans MS', 'Comic Neue', cursive, sans-serif;
      padding: 40px;
      max-width: 900px;
      margin: 0 auto;
      background: white;
    }
    
    .header {
      text-align: center;
      margin-bottom: 30px;
      border-bottom: 3px solid #ff6b9d;
      padding-bottom: 20px;
    }
    
    h1 {
      color: #ff6b9d;
      font-size: 28px;
      margin-bottom: 10px;
    }
    
    .stats {
      color: #666;
      font-size: 14px;
      margin-top: 10px;
    }
    
    .stats-badge {
      display: inline-block;
      background: #f0f0f0;
      padding: 4px 12px;
      border-radius: 12px;
      margin: 0 5px;
    }
    
    .problems-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 15px 30px;
      margin-top: 30px;
    }
    
    .problem-item {
      display: flex;
      align-items: center;
      font-size: 18px;
      padding: 8px;
      border-bottom: 1px solid #eee;
    }
    
    .problem-number {
      color: #c084fc;
      font-weight: bold;
      margin-right: 10px;
      min-width: 35px;
    }
    
    .problem-expression {
      font-size: 20px;
      font-family: 'Courier New', monospace;
    }
    
    .problem-expression strong {
      color: #36d399;
    }
    
    .footer {
      margin-top: 40px;
      text-align: center;
      color: #999;
      font-size: 12px;
      border-top: 1px solid #eee;
      padding-top: 20px;
    }
    
    @media print {
      body {
        padding: 20px;
      }
      
      .no-print {
        display: none !important;
      }
      
      .problems-grid {
        break-inside: avoid;
      }
    }
    
    @media screen {
      .print-actions {
        position: fixed;
        top: 20px;
        right: 20px;
        display: flex;
        gap: 10px;
      }
      
      .btn {
        padding: 12px 24px;
        border: none;
        border-radius: 8px;
        font-size: 14px;
        font-weight: bold;
        cursor: pointer;
        transition: all 0.2s;
      }
      
      .btn-print {
        background: #ff6b9d;
        color: white;
      }
      
      .btn-print:hover {
        background: #ff5085;
        transform: translateY(-2px);
      }
      
      .btn-close {
        background: #e5e5e5;
        color: #333;
      }
      
      .btn-close:hover {
        background: #d0d0d0;
      }
    }
  </style>
</head>
<body>
  <div class="print-actions no-print">
    <button class="btn btn-print" onclick="window.print()">🖨️ Imprimir</button>
    <button class="btn btn-close" onclick="window.close()">✖️ Fechar</button>
  </div>

  <div class="header">
    <h1>${title}</h1>
    <div class="stats">
      <span class="stats-badge">Total: ${stats.total}</span>
      <span class="stats-badge">Adição: ${stats.addition}</span>
      <span class="stats-badge">Subtração: ${stats.subtraction}</span>
      <span class="stats-badge">Dificuldade: ${this.getDifficultyLabel(stats.difficulty)}</span>
    </div>
    ${!includeAnswerKey ? `<div style="margin-top: 15px; font-size: 14px;">Nome: ___________________________ Data: ___/___/___</div>` : ''}
  </div>

  <div class="problems-grid">
    ${problemsHtml}
  </div>

  <div class="footer">
    <p>Material gerado com ❤️ para ${studentName} • ${new Date().toLocaleDateString('pt-BR')}</p>
  </div>
</body>
</html>
`;
  }

  /**
   * Formata problemas contextualizados para HTML
   * @param {Array} contextualProblems - Lista de problemas contextualizados
   * @param {object} stats - Estatísticas
   * @param {object} options - Opções de formatação
   * @returns {string} - HTML formatado
   */
  static formatContextual(contextualProblems, stats, options = {}) {
    const { includeAnswerKey = false, studentName = 'Cecília' } = options;

    const title = includeAnswerKey
      ? 'Gabarito - Problemas Contextualizados'
      : `Problemas Contextualizados para ${studentName}`;

    const problemsHtml = contextualProblems
      .map((problem, index) => {
        const answerHtml = includeAnswerKey
          ? `<div class="answer">
              <strong>Resposta:</strong> ${problem.answer}
              <span class="operation-hint">(${problem.num1} ${problem.operation} ${problem.num2})</span>
             </div>`
          : `<div class="answer-space">
              <strong>Resposta:</strong> _______________
             </div>`;

        return `
        <div class="problem-card">
          <div class="problem-header">
            <span class="problem-number">Problema ${index + 1}</span>
          </div>
          <div class="problem-context">${problem.context}</div>
          <div class="problem-question">${problem.question}</div>
          ${answerHtml}
        </div>
        `;
      })
      .join('\n');

    return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Comic Sans MS', 'Comic Neue', cursive, sans-serif;
      padding: 40px;
      max-width: 800px;
      margin: 0 auto;
      background: #fafafa;
      line-height: 1.6;
    }
    
    .header {
      text-align: center;
      margin-bottom: 30px;
      background: white;
      padding: 30px;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    
    h1 {
      color: #c084fc;
      font-size: 28px;
      margin-bottom: 10px;
    }
    
    .problem-card {
      background: white;
      border-radius: 12px;
      padding: 25px;
      margin-bottom: 25px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      border-left: 4px solid #ff6b9d;
    }
    
    .problem-header {
      margin-bottom: 15px;
    }
    
    .problem-number {
      background: #ff6b9d;
      color: white;
      padding: 6px 16px;
      border-radius: 20px;
      font-weight: bold;
      font-size: 14px;
    }
    
    .problem-context {
      font-size: 16px;
      color: #333;
      margin-bottom: 12px;
      line-height: 1.8;
    }
    
    .problem-question {
      font-weight: bold;
      color: #fb923c;
      font-size: 17px;
      margin-bottom: 15px;
    }
    
    .answer {
      background: #f0fdf4;
      border: 2px solid #36d399;
      border-radius: 8px;
      padding: 12px;
      margin-top: 15px;
      font-size: 16px;
      color: #166534;
    }
    
    .answer strong {
      color: #36d399;
    }
    
    .operation-hint {
      color: #666;
      font-size: 14px;
      margin-left: 10px;
    }
    
    .answer-space {
      border: 2px dashed #ccc;
      border-radius: 8px;
      padding: 20px;
      margin-top: 15px;
      background: #fafafa;
    }
    
    .footer {
      margin-top: 40px;
      text-align: center;
      color: #999;
      font-size: 12px;
    }
    
    @media print {
      body {
        padding: 20px;
        background: white;
      }
      
      .no-print {
        display: none !important;
      }
      
      .problem-card {
        break-inside: avoid;
        box-shadow: none;
        border: 1px solid #ddd;
      }
    }
    
    @media screen {
      .print-actions {
        position: fixed;
        top: 20px;
        right: 20px;
        display: flex;
        gap: 10px;
        z-index: 1000;
      }
      
      .btn {
        padding: 12px 24px;
        border: none;
        border-radius: 8px;
        font-size: 14px;
        font-weight: bold;
        cursor: pointer;
        transition: all 0.2s;
        box-shadow: 0 2px 4px rgba(0,0,0,0.2);
      }
      
      .btn-print {
        background: #c084fc;
        color: white;
      }
      
      .btn-print:hover {
        background: #a855f7;
        transform: translateY(-2px);
      }
      
      .btn-close {
        background: #e5e5e5;
        color: #333;
      }
      
      .btn-close:hover {
        background: #d0d0d0;
      }
    }
  </style>
</head>
<body>
  <div class="print-actions no-print">
    <button class="btn btn-print" onclick="window.print()">🖨️ Imprimir</button>
    <button class="btn btn-close" onclick="window.close()">✖️ Fechar</button>
  </div>

  <div class="header">
    <h1>${title}</h1>
    ${!includeAnswerKey ? `<div style="margin-top: 15px; font-size: 14px;">Nome: ___________________________ Data: ___/___/___</div>` : ''}
  </div>

  ${problemsHtml}

  <div class="footer">
    <p>Material gerado com ❤️ para ${studentName} • ${new Date().toLocaleDateString('pt-BR')}</p>
  </div>
</body>
</html>
`;
  }

  /**
   * Retorna o label da dificuldade
   */
  static getDifficultyLabel(difficulty) {
    const labels = {
      easy: 'Fácil',
      medium: 'Médio',
      hard: 'Difícil',
    };
    return labels[difficulty] || 'Médio';
  }
}
