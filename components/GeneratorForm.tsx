'use client';

import { useEffect, useId, useState } from 'react';
import { type GenerateExercisesInput, generateExercises } from '@/app/actions/generateExercises';

interface GeneratorFormProps {
  dict?: {
    title: string;
    totalQuestions: string;
    digitConfigTitle: string;
    digits: string;
    questions: string;
    operation: string;
    operations: {
      addition: string;
      subtraction: string;
      multiplication: string;
      division: string;
      mixed: string;
    };
    divisorMin: string;
    divisorMax: string;
    addConfig: string;
    format: string;
    formatOptions: {
      grid: string;
      contextual: string;
      both: string;
    };
    useAI: string;
    useAIDescription: string;
    generate: string;
    generating: string;
    errorGenerate: string;
    errorUnknown: string;
    howItWorksTitle: string;
    howItWorks: string[];
  };
}

export default function GeneratorForm({ dict }: GeneratorFormProps = {}) {
  const formatSelectId = useId();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [digitConfigs, setDigitConfigs] = useState<
    Array<{
      id: string;
      digits: number;
      questions: number;
      operation: 'addition' | 'subtraction' | 'multiplication' | 'division' | 'mixed';
      divisorMin?: number;
      divisorMax?: number;
    }>
  >([
    { id: '1', digits: 2, questions: 10, operation: 'addition' as const },
    { id: '2', digits: 3, questions: 12, operation: 'mixed' as const },
  ]);
  const [useAI, setUseAI] = useState(false);
  const [format, setFormat] = useState<'grid' | 'contextual' | 'both'>('grid');
  const totalProblems = digitConfigs.reduce((sum, config) => sum + config.questions, 0);

  // Generate unique IDs on mount to avoid hydration mismatch
  useEffect(() => {
    setDigitConfigs(prev => prev.map(config => ({
      ...config,
      id: crypto.randomUUID()
    })));
  }, []);

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
        studentName: undefined, // Usar nome aleatório do pool
        format,
        digitConfigs, // Adiciona as configurações de algarismos
      };

      const result = await generateExercises(input);

      if (!result.success) {
        setError(result.error || dict?.errorGenerate || 'Erro ao gerar exercícios');
        setIsLoading(false);
        return;
      }

      // Abrir exercícios em novas abas exibindo HTML diretamente
      if (format === 'both') {
        if (result.gridHtml) {
          const gridWindow = window.open('', '_blank');
          gridWindow?.document.write(result.gridHtml);
          gridWindow?.document.close();
        }
        if (result.contextualHtml) {
          // Delay para não bloquear popups
          setTimeout(() => {
            const contextWindow = window.open('', '_blank');
            if (contextWindow && result.contextualHtml) {
              contextWindow.document.write(result.contextualHtml);
              contextWindow.document.close();
            }
          }, 100);
        }
      } else if (result.html) {
        const exerciseWindow = window.open('', '_blank');
        exerciseWindow?.document.write(result.html);
        exerciseWindow?.document.close();
      }

      setIsLoading(false);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : (dict?.errorUnknown || 'Erro desconhecido'));
      setIsLoading(false);
    }
  };

  return (
    <div className="card bg-base-100 shadow-2xl">
      <div className="card-body">
        <h2 className="card-title text-2xl text-primary mb-4">
          {dict?.title || '✨ Gerador de Exercícios de Matemática'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="alert alert-info">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="stroke-current shrink-0 w-6 h-6"
              role="img"
              aria-label="Informação"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            <span className="font-semibold">{dict?.totalQuestions || 'Total de Perguntas'}: {totalProblems}</span>
          </div>

          <div className="space-y-4">
            <div className="label">
              <span className="label-text font-semibold text-lg">
                {dict?.digitConfigTitle || '🔢 Configuração por Algarismos'}
              </span>
            </div>

            {digitConfigs.map((config, index) => (
              <div key={config.id} className="card bg-base-200 shadow-md">
                <div className="card-body p-4">
                  <div className="flex items-center gap-4">
                    <div className="form-control flex-1">
                      <label htmlFor={`digits-${config.id}`} className="label">
                        <span className="label-text">{dict?.digits || 'Perguntas'}</span>
                      </label>
                      <input
                        id={`digits-${config.id}`}
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
                        aria-label={dict?.digits || 'Perguntas'}
                      />
                    </div>

                    <div className="form-control flex-1">
                      <label htmlFor={`questions-${config.id}`} className="label">
                        <span className="label-text">{dict?.questions || 'Perguntas'}</span>
                      </label>
                      <input
                        id={`questions-${config.id}`}
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
                        aria-label={dict?.questions || 'Perguntas'}
                      />
                    </div>

                    <div className="form-control flex-1">
                      <label htmlFor={`operation-${config.id}`} className="label">
                        <span className="label-text">{dict?.operation || 'Operação'}</span>
                      </label>
                      <select
                        id={`operation-${config.id}`}
                        value={config.operation}
                        onChange={(e) => {
                          const newConfigs = [...digitConfigs];
                          newConfigs[index].operation = e.target.value as
                            | 'addition'
                            | 'subtraction'
                            | 'multiplication'
                            | 'division'
                            | 'mixed';
                          setDigitConfigs(newConfigs);
                        }}
                        className="select select-bordered select-accent w-full"
                        aria-label={dict?.operation || 'Operação'}
                      >
                        <option value="addition">{dict?.operations.addition || '➕ Adição'}</option>
                        <option value="subtraction">{dict?.operations.subtraction || '➖ Subtração'}</option>
                        <option value="multiplication">{dict?.operations.multiplication || '✖️ Multiplicação'}</option>
                        <option value="division">{dict?.operations.division || '➗ Divisão'}</option>
                        <option value="mixed">{dict?.operations.mixed || '🎲 Misto'}</option>
                      </select>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        const newConfigs = digitConfigs.filter((_, i) => i !== index);
                        setDigitConfigs(newConfigs);
                      }}
                      className="btn btn-error btn-sm mt-8 mb-2"
                      disabled={digitConfigs.length === 1}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="white"
                        role="img"
                        aria-label="Remover configuração"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>

                  {(config.operation === 'division' || config.operation === 'mixed') && (
                    <div className="flex items-center gap-4 mt-3 pl-4 pr-4 pb-2">
                      <div className="form-control flex-1">
                        <label htmlFor={`divisor-min-${config.id}`} className="label">
                          <span className="label-text text-sm">{dict?.divisorMin || 'Divisor Mínimo'}</span>
                        </label>
                        <input
                          id={`divisor-min-${config.id}`}
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
                          aria-label={dict?.divisorMin || 'Divisor Mínimo'}
                        />
                      </div>

                      <div className="form-control flex-1">
                        <label htmlFor={`divisor-max-${config.id}`} className="label">
                          <span className="label-text text-sm">{dict?.divisorMax || 'Divisor Máximo'}</span>
                        </label>
                        <input
                          id={`divisor-max-${config.id}`}
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
                          aria-label={dict?.divisorMax || 'Divisor Máximo'}
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
                setDigitConfigs([
                  ...digitConfigs,
                  {
                    id: crypto.randomUUID(),
                    digits: 2,
                    questions: 10,
                    operation: 'addition' as const,
                  },
                ]);
              }}
              className="btn btn-outline btn-primary w-full"
            >
              {dict?.addConfig || '➕ Adicionar Configuração'}
            </button>
          </div>

          <div className="form-control">
            <label htmlFor={formatSelectId} className="label">
              <span className="label-text font-semibold">{dict?.format || '📋 Formato'}</span>
            </label>
            <select
              id={formatSelectId}
              value={format}
              onChange={(e) => setFormat(e.target.value as 'grid' | 'contextual' | 'both')}
              className="select select-bordered select-secondary w-full"
              aria-label={dict?.format || 'Formato'}
            >
              <option value="grid">{dict?.formatOptions.grid || '📊 Grade (lista de problemas)'}</option>
              <option value="contextual">{dict?.formatOptions.contextual || '📖 Contextualizado (histórias)'}</option>
              <option value="both">{dict?.formatOptions.both || '🎁 Ambos (2 arquivos)'}</option>
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
                  <span className="label-text font-semibold">{dict?.useAI || '🤖 Usar IA (Google Gemini)'}</span>
                  <p className="text-xs text-base-content/60 mt-1">
                    {dict?.useAIDescription || 'Gera histórias mais criativas e variadas'}
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
                role="img"
                aria-label="Erro"
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
                  {dict?.generating || 'Gerando...'}
                </>
              ) : (
                dict?.generate || '✨ Gerar Exercícios'
              )}
            </button>
          </div>
        </form>

        <div className="divider"></div>

        <div className="text-sm text-base-content/60">
          <p className="font-semibold mb-2">{dict?.howItWorksTitle || 'ℹ️ Como funciona:'}</p>
          <ul className="list-disc list-inside space-y-1">
            {dict?.howItWorks ? (
              dict.howItWorks.map((item) => <li key={item}>{item}</li>)
            ) : (
              <>
                <li>Configure quantos algarismos e questões deseja por operação</li>
                <li>Escolha entre formato grade (lista de problemas) ou contextualizado (histórias)</li>
                <li>Opcionalmente, use IA para gerar histórias mais criativas</li>
                <li>Clique em "Gerar Exercícios" para criar o documento HTML</li>
                <li>Os exercícios serão abertos em uma nova aba do navegador prontos para impressão</li>
              </>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
