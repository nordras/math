'use client';

import { useState } from 'react';
import { generateExercises, type GenerateExercisesInput } from '@/app/actions/generateExercises';

export default function GeneratorForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Estados do formulário
  const [totalProblems, setTotalProblems] = useState(50);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [useAI, setUseAI] = useState(false);
  const [format, setFormat] = useState<'grid' | 'contextual' | 'both'>('grid');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const input: GenerateExercisesInput = {
        totalProblems,
        difficulty,
        useAI,
        includeAnswerKey: false,
        studentName: 'Cecília',
        format,
      };

      const result = await generateExercises(input);

      if (!result.success) {
        setError(result.error || 'Erro ao gerar exercícios');
        setIsLoading(false);
        return;
      }

      // Abrir exercícios em novas abas
      if (format === 'both') {
        if (result.gridExerciseId) {
          window.open(`/exercise/${result.gridExerciseId}`, '_blank');
        }
        if (result.contextualExerciseId) {
          // Delay para não bloquear popups
          setTimeout(() => {
            window.open(`/exercise/${result.contextualExerciseId}`, '_blank');
          }, 100);
        }
      } else if (result.exerciseId) {
        window.open(`/exercise/${result.exerciseId}`, '_blank');
      }

      setIsLoading(false);
    } catch (err: any) {
      console.error('Erro ao gerar:', err);
      setError(err.message || 'Erro desconhecido');
      setIsLoading(false);
    }
  };

  return (
    <div className="card bg-base-100 shadow-2xl">
      <div className="card-body">
        <h2 className="card-title text-2xl text-primary mb-4">
          ✨ Gerador de Exercícios de Matemática
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Quantidade de Exercícios */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">
                📝 Quantidade de Exercícios
              </span>
              <span className="label-text-alt text-lg font-bold text-primary">
                {totalProblems}
              </span>
            </label>
            <input
              type="range"
              min="10"
              max="100"
              step="10"
              value={totalProblems}
              onChange={(e) => setTotalProblems(Number(e.target.value))}
              className="range range-primary"
            />
            <div className="w-full flex justify-between text-xs px-2 mt-1">
              <span>10</span>
              <span>30</span>
              <span>50</span>
              <span>70</span>
              <span>100</span>
            </div>
          </div>

          {/* Dificuldade */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">
                🎯 Dificuldade
              </span>
            </label>
            <select
              value={difficulty}
              onChange={(e) =>
                setDifficulty(e.target.value as 'easy' | 'medium' | 'hard')
              }
              className="select select-bordered select-primary w-full"
            >
              <option value="easy">😊 Fácil (1-10)</option>
              <option value="medium">😐 Médio (1-20)</option>
              <option value="hard">😤 Difícil (1-50)</option>
            </select>
          </div>

          {/* Formato */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">
                📋 Formato
              </span>
            </label>
            <select
              value={format}
              onChange={(e) =>
                setFormat(e.target.value as 'grid' | 'contextual' | 'both')
              }
              className="select select-bordered select-secondary w-full"
            >
              <option value="grid">📊 Grade (lista de problemas)</option>
              <option value="contextual">📖 Contextualizado (histórias)</option>
              <option value="both">🎁 Ambos (2 arquivos)</option>
            </select>
          </div>

          {/* Usar IA */}
          {(format === 'contextual' || format === 'both') && (
            <div className="form-control">
              <label className="label cursor-pointer justify-start gap-4">
                <input
                  type="checkbox"
                  checked={useAI}
                  onChange={(e) => setUseAI(e.target.checked)}
                  className="toggle toggle-accent"
                />
                <div>
                  <span className="label-text font-semibold">
                    🤖 Usar IA (Google Gemini)
                  </span>
                  <p className="text-xs text-base-content/60 mt-1">
                    Gera histórias mais criativas e variadas
                  </p>
                </div>
              </label>
            </div>
          )}

          {/* Erro */}
          {error && (
            <div className="alert alert-error">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="stroke-current shrink-0 h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>{error}</span>
            </div>
          )}

          {/* Botão Submit */}
          <div className="card-actions justify-end mt-6">
            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-primary btn-lg w-full text-lg"
            >
              {isLoading ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  Gerando...
                </>
              ) : (
                <>
                  ✨ Gerar Exercícios
                </>
              )}
            </button>
          </div>
        </form>

        <div className="divider"></div>

        <div className="text-sm text-base-content/60">
          <p className="font-semibold mb-2">ℹ️ Como funciona:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Escolha a quantidade e dificuldade dos exercícios</li>
            <li>Selecione o formato (grade simples ou com histórias)</li>
            <li>Clique em "Gerar" e uma nova aba será aberta</li>
            <li>Você pode imprimir ou salvar como PDF direto do navegador</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
