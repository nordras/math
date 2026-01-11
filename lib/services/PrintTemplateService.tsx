/**
 * Print Template Components
 * React components for generating printable exercise HTML using renderToStaticMarkup
 */

import { renderToStaticMarkup } from 'react-dom/server';
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
 * Print Actions Component - Print and Close buttons
 */
function PrintActions({ variant = 'grid' }: { variant?: 'grid' | 'contextual' }) {
  return (
    <div className="print-actions no-print">
      <button
        type="button"
        className={`btn btn-print ${variant === 'contextual' ? 'contextual' : ''}`}
        onClick={() => window.print()}
      >
        🖨️ Imprimir
      </button>
      <button type="button" className="btn btn-close" onClick={() => window.close()}>
        ✖️ Fechar
      </button>
    </div>
  );
}

/**
 * Score Section Component - Student results tracking area
 */
function ScoreSection({
  totalProblems,
  variant = 'grid',
}: {
  totalProblems: number;
  variant?: 'grid' | 'contextual';
}) {
  return (
    <div className={`score-section ${variant === 'contextual' ? 'contextual' : ''}`}>
      <h2>📊 Meu Resultado</h2>
      <div className="score-grid">
        <div className="score-item">
          <div className="score-label">Total de Questões</div>
          <div className="score-value">{totalProblems}</div>
        </div>
        <div className="score-item correct">
          <div className="score-label">Acertos</div>
          <div className="score-value correct">____</div>
        </div>
        <div className="score-item grade">
          <div className="score-label">Minha Nota</div>
          <div className="score-value grade">____</div>
        </div>
      </div>
      <div className="score-message">🌟 Parabéns pelo esforço! Continue praticando!</div>
    </div>
  );
}

/**
 * Grid Template Component - For standard arithmetic problems
 */
interface GridTemplateProps {
  problems: MathProblem[];
  stats: MathStats;
  includeAnswerKey?: boolean;
}

function GridTemplate({ problems, stats, includeAnswerKey = false }: GridTemplateProps) {
  const totalCount = stats.totalProblems || stats.total || problems.length;
  const title = includeAnswerKey
    ? `Gabarito - ${totalCount} Exercícios`
    : `Exercícios de Matemática - ${totalCount} questões`;

  return (
    <html lang="pt-BR">

      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{title}</title>
        <link rel="stylesheet" href="/styles/exercise-print.css" />
      </head>
      <body>
        <PrintActions variant="grid" />

        <div className="header">
          <h1>{title}</h1>
          <div className="stats">
            <span className="stats-badge">Total: {stats.totalProblems || problems.length}</span>
            <span className="stats-badge">Adições: {stats.additions || 0}</span>
            <span className="stats-badge">Subtrações: {stats.subtractions || 0}</span>
            {stats.multiplications && (
              <span className="stats-badge">Multiplicações: {stats.multiplications}</span>
            )}
            {stats.divisions && <span className="stats-badge">Divisões: {stats.divisions}</span>}
            <span className="stats-badge">Dificuldade: {getDifficultyLabel(stats.difficulty)}</span>
          </div>
          {!includeAnswerKey && (
            <div className="student-info">
              Nome: ___________________________ Data: ___/___/___
            </div>
          )}
        </div>

        <div className="problems-grid">
          {problems.map((problem, index) => (
            <div key={`${problem.num1}-${problem.num2}-${problem.operation}`} className="problem-item">
              <span className="problem-number">{index + 1})</span>
              <span className="problem-expression">
                {problem.operation}
                {includeAnswerKey ? (
                  <>
                    {' '}
                    = <strong>{problem.answer}</strong>
                  </>
                ) : (
                  ' = _____'
                )}
              </span>
            </div>
          ))}
        </div>

        {!includeAnswerKey && <ScoreSection totalProblems={totalCount} variant="grid" />}

        <div className="footer">
          <p>{new Date().toLocaleDateString('pt-BR')}</p>
        </div>
      </body>
    </html>
  );
}

/**
 * Contextual Template Component - For story-based word problems
 */
interface ContextualTemplateProps {
  contextualProblems: ContextualProblem[];
  includeAnswerKey?: boolean;
  studentName?: string;
}

function ContextualTemplate({
  contextualProblems,
  includeAnswerKey = false,
  studentName = getRandomName(),
}: ContextualTemplateProps) {
  const title = includeAnswerKey
    ? 'Gabarito - Problemas Contextualizados'
    : `Problemas Contextualizados para ${studentName}`;

  return (
    <html lang="pt-BR">

      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{title}</title>
        <link rel="stylesheet" href="/styles/exercise-print.css" />
      </head>
      <body className="contextual-body">
        <PrintActions variant="contextual" />

        <div className="header contextual-header">
          <h1>{title}</h1>
          {!includeAnswerKey && (
            <div className="student-info">
              Nome: ___________________________ Data: ___/___/___
            </div>
          )}
        </div>

        {contextualProblems.map((problem, index) => (
          <div key={`${problem.num1}-${problem.num2}-${problem.operation}`} className="problem-card">
            <div className="problem-header">
              <span className="problem-number">Problema {index + 1}</span>
            </div>
            <div className="problem-context">{problem.context}</div>
            <div className="problem-question">{problem.question}</div>
            {includeAnswerKey ? (
              <div className="answer">
                <strong>Resposta:</strong> {problem.answer}
                <span className="operation-hint">
                  ({problem.num1} {problem.operation} {problem.num2})
                </span>
              </div>
            ) : (
              <div className="answer-space">
                <strong>Resposta:</strong> _______________
              </div>
            )}
          </div>
        ))}

        {!includeAnswerKey && (
          <ScoreSection totalProblems={contextualProblems.length} variant="contextual" />
        )}

        <div className="footer">
          <p>{new Date().toLocaleDateString('pt-BR')}</p>
        </div>
      </body>
    </html>
  );
}

/**
 * Render Grid Template to HTML String
 */
export function renderGridTemplate(
  problems: MathProblem[],
  stats: MathStats,
  options: { includeAnswerKey?: boolean } = {}
): string {
  const html = renderToStaticMarkup(
    <GridTemplate
      problems={problems}
      stats={stats}
      includeAnswerKey={options.includeAnswerKey}
    />
  );
  return `<!DOCTYPE html>${html}`;
}

/**
 * Render Contextual Template to HTML String
 */
export function renderContextualTemplate(
  contextualProblems: ContextualProblem[],
  options: { includeAnswerKey?: boolean; studentName?: string } = {}
): string {
  const html = renderToStaticMarkup(
    <ContextualTemplate
      contextualProblems={contextualProblems}
      includeAnswerKey={options.includeAnswerKey}
      studentName={options.studentName}
    />
  );
  return `<!DOCTYPE html>${html}`;
}
