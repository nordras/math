/**
 * Print Formatter Service
 * Generates printable HTML using template strings with external CSS
 * Uses /public/styles/exercise-print.css for all styling
 */

import type { ContextualProblem, MathProblem, MathStats } from '@/lib/types/math';
import { getRandomName } from '@/lib/constants/namePool';

/**
 * Returns the difficulty label based on difficulty level
 */
function getDifficultyLabel(difficulty: string): string {
  const difficultyMap: Record<string, string> = {
    easy: 'Fácil',
    medium: 'Médio',
    hard: 'Difícil',
  };

  return difficultyMap[difficulty] || difficultyMap.medium;
}

/**
 * Render Grid Template to HTML String
 */
export function renderGridTemplate(
  problems: MathProblem[],
  stats: MathStats,
  options: { includeAnswerKey?: boolean } = {}
): string {
  const { includeAnswerKey = false } = options;
  const totalCount = stats.totalProblems || stats.total || problems.length;
  const title = includeAnswerKey
    ? `Gabarito - ${totalCount} Exercícios`
    : `Exercícios de Matemática - ${totalCount} questões`;

  const problemsHtml = problems
    .map((problem, index) => {
      const answer = includeAnswerKey ? ` = <strong>${problem.answer}</strong>` : ' = _____';
      return `<div class="problem-item">
        <span class="problem-number">${index + 1})</span>
        <span class="problem-expression">${problem.operation}${answer}</span>
      </div>`;
    })
    .join('\n          ');

  const scoreSection = !includeAnswerKey
    ? `
  <div class="score-section">
    <h2>📊 Meu Resultado</h2>
    <div class="score-grid">
      <div class="score-item">
        <div class="score-label">Total de Questões</div>
        <div class="score-value">${totalCount}</div>
      </div>
      <div class="score-item correct">
        <div class="score-label">Acertos</div>
        <div class="score-value correct">____</div>
      </div>
      <div class="score-item grade">
        <div class="score-label">Minha Nota</div>
        <div class="score-value grade">____</div>
      </div>
    </div>
    <div class="score-message">🌟 Parabéns pelo esforço! Continue praticando!</div>
  </div>`
    : '';

  return `<!DOCTYPE html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${title}</title>
    <link rel="stylesheet" href="/styles/exercise-print.css" />
  </head>
  <body>
    <div class="print-actions no-print">
      <button type="button" class="btn btn-print" onclick="window.print()">🖨️ Imprimir</button>
      <button type="button" class="btn btn-close" onclick="window.close()">✖️ Fechar</button>
    </div>

    <div class="header">
      <h1>${title}</h1>
      <div class="stats">
        <span class="stats-badge">Total: ${stats.totalProblems || problems.length}</span>
        <span class="stats-badge">Adições: ${stats.additions || 0}</span>
        <span class="stats-badge">Subtrações: ${stats.subtractions || 0}</span>
        ${stats.multiplications ? `<span class="stats-badge">Multiplicações: ${stats.multiplications}</span>` : ''}
        ${stats.divisions ? `<span class="stats-badge">Divisões: ${stats.divisions}</span>` : ''}
        <span class="stats-badge">Dificuldade: ${getDifficultyLabel(stats.difficulty)}</span>
      </div>
      ${!includeAnswerKey ? '<div class="student-info">Nome: ___________________________ Data: ___/___/___</div>' : ''}
    </div>

    <div class="problems-grid">
      ${problemsHtml}
    </div>

    ${scoreSection}

    <div class="footer">
      <p>${new Date().toLocaleDateString('pt-BR')}</p>
    </div>
  </body>
</html>`;
}

/**
 * Render Contextual Template to HTML String
 */
export function renderContextualTemplate(
  contextualProblems: ContextualProblem[],
  options: { includeAnswerKey?: boolean; studentName?: string } = {}
): string {
  const { includeAnswerKey = false, studentName = getRandomName() } = options;
  const title = includeAnswerKey
    ? 'Gabarito - Problemas Contextualizados'
    : `Problemas Contextualizados para ${studentName}`;

  const problemsHtml = contextualProblems
    .map((problem, index) => {
      // Priorizar pergunta gerada pela IA se disponível, senão usar do pool
      const displayQuestion = problem.generatedQuestion || problem.question;
      
      const answerHtml = includeAnswerKey
        ? `<div class="answer">
            <strong>Resposta:</strong> ${problem.answer}
            <span class="operation-hint">(${problem.num1} ${problem.operation} ${problem.num2})</span>
           </div>`
        : '<div class="answer-space"><strong>Resposta:</strong> _______________</div>';

      return `<div class="problem-card">
        <div class="problem-header">
          <span class="problem-number">Problema ${index + 1}</span>
        </div>
        <div class="problem-context">${problem.context}</div>
        <div class="problem-question">${displayQuestion}</div>
        ${answerHtml}
      </div>`;
    })
    .join('\n    ');

  const scoreSection = !includeAnswerKey
    ? `
  <div class="score-section contextual">
    <h2>📊 Meu Resultado</h2>
    <div class="score-grid">
      <div class="score-item">
        <div class="score-label">Total de Questões</div>
        <div class="score-value">${contextualProblems.length}</div>
      </div>
      <div class="score-item correct">
        <div class="score-label">Acertos</div>
        <div class="score-value correct">____</div>
      </div>
      <div class="score-item grade">
        <div class="score-label">Minha Nota</div>
        <div class="score-value grade">____</div>
      </div>
    </div>
    <div class="score-message">🌟 Parabéns pelo esforço! Continue praticando!</div>
  </div>`
    : '';

  return `<!DOCTYPE html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${title}</title>
    <link rel="stylesheet" href="/styles/exercise-print.css" />
  </head>
  <body class="contextual-body">
    <div class="print-actions no-print">
      <button type="button" class="btn btn-print contextual" onclick="window.print()">🖨️ Imprimir</button>
      <button type="button" class="btn btn-close" onclick="window.close()">✖️ Fechar</button>
    </div>

    <div class="header contextual-header">
      <h1>${title}</h1>
      ${!includeAnswerKey ? '<div class="student-info">Nome: ___________________________ Data: ___/___/___</div>' : ''}
    </div>

    ${problemsHtml}

    ${scoreSection}

    <div class="footer">
      <p>${new Date().toLocaleDateString('pt-BR')}</p>
    </div>
  </body>
</html>`;
}
