'use client';

import { useState } from 'react';
import { generateExercises, type GenerateExercisesInput } from '@/app/actions/generateExercises';

export default function GeneratorForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [digitConfigs, setDigitConfigs] = useState([
    { digits: 2, questions: 10, operation: 'addition' as const },
    { digits: 3, questions: 12, operation: 'mixed' as const },
  ]);
  const [useAI, setUseAI] = useState(false);
  const [format, setFormat] = useState<'grid' | 'contextual' | 'both'>('grid');
  const totalProblems = digitConfigs.reduce((sum, config) => sum + config.questions, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const input: GenerateExercisesInput = {
        totalProblems,
        difficulty: 'medium', // Usar medium como padrão, será sobrescrito pela lógica de algarismos
        useAI,
        includeAnswerKey: false,
        studentName: 'Cecília',
        format,
        digitConfigs, // Adiciona as configurações de algarismos
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
          <div className="alert alert-info">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="stroke-current shrink-0 w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            <span className="font-semibold">
              Total de Perguntas: {totalProblems}
            </span>
          </div>

          <div className="space-y-4">
            <label className="label">
              <span className="label-text font-semibold text-lg">
                🔢 Configuração por Algarismos
              </span>
            </label>

            {digitConfigs.map((config, index) => (
              <div key={index} className="card bg-base-200 shadow-md">
                <div className="card-body p-4">
                  <div className="flex items-center gap-4">
                    <div className="form-control flex-1">
                      <label className="label">
                        <span className="label-text">Algarismos</span>
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="5"
                        value={config.digits}
                        onChange={(e) => {
                          const newConfigs = [...digitConfigs];
                          newConfigs[index].digits = Number(e.target.value);
                          setDigitConfigs(newConfigs);
                        }}
                        className="input input-bordered input-primary w-full"
                      />
                    </div>

                    <div className="form-control flex-1">
                      <label className="label">
                        <span className="label-text">Perguntas</span>
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={config.questions}
                        onChange={(e) => {
                          const newConfigs = [...digitConfigs];
                          newConfigs[index].questions = Number(e.target.value);
                          setDigitConfigs(newConfigs);
                        }}
                        className="input input-bordered input-secondary w-full"
                      />
                    </div>

                    <div className="form-control flex-1">
                      <label className="label">
                        <span className="label-text">Operação</span>
                      </label>
                      <select
                        value={config.operation}
                        onChange={(e) => {
                          const newConfigs = [...digitConfigs];
                          newConfigs[index].operation = e.target.value as any;
                          setDigitConfigs(newConfigs);
                        }}
                        className="select select-bordered select-accent w-full"
                      >
                        <option value="addition">➕ Adição</option>
                        <option value="subtraction">➖ Subtração</option>
                        <option value="multiplication">✖️ Multiplicação</option>
                        <option value="division">➗ Divisão</option>
                        <option value="mixed">🎲 Misto</option>
                      </select>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        const newConfigs = digitConfigs.filter((_, i) => i !== index);
                        setDigitConfigs(newConfigs);
                      }}
                      className="btn btn-error btn-sm mt-8"
                      disabled={digitConfigs.length === 1}
                    >
                      ❌
                    </button>
                  </div>

                  {(config.operation === 'division' || config.operation === 'mixed') && (
                    <div className="flex items-center gap-4 mt-3 pl-4 pr-4 pb-2">
                      <div className="form-control flex-1">
                        <label className="label">
                          <span className="label-text text-sm">Divisor Mínimo</span>
                        </label>
                        <input
                          type="number"
                          min="1"
                          max="100"
                          value={config.divisorMin || 1}
                          onChange={(e) => {
                            const newConfigs = [...digitConfigs];
                            newConfigs[index].divisorMin = Number(e.target.value);
                            setDigitConfigs(newConfigs);
                          }}
                          className="input input-bordered input-sm w-full"
                        />
                      </div>

                      <div className="form-control flex-1">
                        <label className="label">
                          <span className="label-text text-sm">Divisor Máximo</span>
                        </label>
                        <input
                          type="number"
                          min="1"
                          max="100"
                          value={config.divisorMax || 10}
                          onChange={(e) => {
                            const newConfigs = [...digitConfigs];
                            newConfigs[index].divisorMax = Number(e.target.value);
                            setDigitConfigs(newConfigs);
                          }}
                          className="input input-bordered input-sm w-full"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={() => {
                setDigitConfigs([...digitConfigs, { digits: 2, questions: 10, operation: 'addition' }]);
              }}
              className="btn btn-outline btn-primary w-full"
            >
              ➕ Adicionar Configuração
            </button>
          </div>

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
            <li>Configure quantas perguntas quer para cada quantidade de algarismos</li>
            <li>Exemplo: 2 algarismos = 10 perguntas, 3 algarismos = 12 perguntas</li>
            <li>Selecione o formato (grade simples ou com histórias)</li>
            <li>Clique em "Gerar" e uma nova aba será aberta</li>
            <li>Você pode imprimir ou salvar como PDF direto do navegador</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
