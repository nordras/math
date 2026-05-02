'use client';

import { useEffect, useId, useState } from 'react';
import { type GenerateExercisesInput, generateExercises } from '@/app/actions/generateExercises';
import type { AIProvider } from '@/lib/types/math';

type DigitConfig = {
  id: string;
  digits: number;
  questions: number;
  operation: 'addition' | 'subtraction' | 'multiplication' | 'division' | 'mixed';
  divisorMin?: number;
  divisorMax?: number;
};

// Preset configurations for recommended exercises
const PRESETS: Record<string, Omit<DigitConfig, 'id'>[]> = {
  '50-variados': [
    { digits: 3, questions: 0,  operation: 'addition' },
    { digits: 3, questions: 5,  operation: 'division',       divisorMin: 2,  divisorMax: 2 },
    { digits: 3, questions: 5,  operation: 'division',       divisorMin: 3,  divisorMax: 3 },
    { digits: 3, questions: 5,  operation: 'subtraction' },
    { digits: 3, questions: 5,  operation: 'multiplication' },
    { digits: 3, questions: 5,  operation: 'subtraction' },
    { digits: 4, questions: 10, operation: 'division',       divisorMin: 6,  divisorMax: 10 },
  ],
};

function makeConfigs(defs: Omit<DigitConfig, 'id'>[]): DigitConfig[] {
  return defs.map((d) => ({ ...d, id: crypto.randomUUID() }));
}

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
  const providerSelectId = useId();
  const presetSelectId = useId();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedPreset, setSelectedPreset] = useState('');

  const [digitConfigs, setDigitConfigs] = useState<DigitConfig[]>([
    { id: '1', digits: 2, questions: 10, operation: 'addition' },
    { id: '2', digits: 3, questions: 12, operation: 'mixed' },
  ]);

  const [format, setFormat] = useState<'grid' | 'contextual' | 'both'>('grid');
  const [aiProvider, setAiProvider] = useState<AIProvider>('none');
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [ollamaModel, setOllamaModel] = useState('llama3.2');

  const totalProblems = digitConfigs.reduce((sum, c) => sum + c.questions, 0);
  const needsKey = aiProvider === 'gemini' || aiProvider === 'openai' || aiProvider === 'deepseek';
  const isOllama = aiProvider === 'ollama';
  const showAISection = format === 'contextual' || format === 'both';

  // Replace server-side IDs with client UUIDs after hydration
  useEffect(() => {
    setDigitConfigs((prev) => prev.map((c) => ({ ...c, id: crypto.randomUUID() })));
  }, []);

  const applyPreset = (key: string) => {
    setSelectedPreset(key);
    if (key && PRESETS[key]) {
      setDigitConfigs(makeConfigs(PRESETS[key]));
    }
  };

  const updateConfig = (index: number, patch: Partial<DigitConfig>) => {
    const next = [...digitConfigs];
    next[index] = { ...next[index], ...patch };
    setDigitConfigs(next);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const input: GenerateExercisesInput = {
        totalProblems,
        difficulty: 'medium',
        includeAnswerKey: false,
        format,
        digitConfigs,
        aiProvider,
        apiKey: needsKey ? apiKey : undefined,
        ollamaModel: isOllama ? ollamaModel : undefined,
      };

      const result = await generateExercises(input);

      if (!result.success) {
        setError(result.error || dict?.errorGenerate || 'Erro ao gerar exercícios');
        setIsLoading(false);
        return;
      }

      if (format === 'both') {
        if (result.gridHtml) {
          const w = window.open('', '_blank');
          w?.document.write(result.gridHtml);
          w?.document.close();
        }
        if (result.contextualHtml) {
          setTimeout(() => {
            const w = window.open('', '_blank');
            if (w && result.contextualHtml) {
              w.document.write(result.contextualHtml);
              w.document.close();
            }
          }, 100);
        }
      } else if (result.html) {
        const w = window.open('', '_blank');
        w?.document.write(result.html);
        w?.document.close();
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

          {/* ── Preset Selector ── */}
          <div className="form-control">
            <label htmlFor={presetSelectId} className="label">
              <span className="label-text font-semibold">📚 Exercícios Recomendados</span>
            </label>
            <select
              id={presetSelectId}
              value={selectedPreset}
              onChange={(e) => applyPreset(e.target.value)}
              className="select select-bordered select-primary w-full"
            >
              <option value="">— Configuração personalizada —</option>
              <option value="50-variados">50 exercícios variados</option>
            </select>
          </div>

          {/* ── Total counter ── */}
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
              />
            </svg>
            <span className="font-semibold">
              {dict?.totalQuestions || 'Total de Perguntas'}: {totalProblems}
            </span>
          </div>

          {/* ── Digit Configs ── */}
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
                        <span className="label-text">{dict?.digits || 'Algarismos'}</span>
                      </label>
                      <input
                        id={`digits-${config.id}`}
                        type="number"
                        min="1"
                        max="5"
                        value={config.digits}
                        onChange={(e) => updateConfig(index, { digits: Number(e.target.value) })}
                        className="input input-bordered input-primary w-full"
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
                        onChange={(e) => updateConfig(index, { questions: Number(e.target.value) })}
                        className="input input-bordered input-secondary w-full"
                      />
                    </div>

                    <div className="form-control flex-1">
                      <label htmlFor={`operation-${config.id}`} className="label">
                        <span className="label-text">{dict?.operation || 'Operação'}</span>
                      </label>
                      <select
                        id={`operation-${config.id}`}
                        value={config.operation}
                        onChange={(e) =>
                          updateConfig(index, {
                            operation: e.target.value as DigitConfig['operation'],
                          })
                        }
                        className="select select-bordered select-accent w-full"
                      >
                        <option value="addition">{dict?.operations?.addition || '➕ Adição'}</option>
                        <option value="subtraction">{dict?.operations?.subtraction || '➖ Subtração'}</option>
                        <option value="multiplication">{dict?.operations?.multiplication || '✖️ Multiplicação'}</option>
                        <option value="division">{dict?.operations?.division || '➗ Divisão'}</option>
                        <option value="mixed">{dict?.operations?.mixed || '🎲 Misto'}</option>
                      </select>
                    </div>

                    <button
                      type="button"
                      onClick={() => setDigitConfigs(digitConfigs.filter((_, i) => i !== index))}
                      className="btn btn-error btn-sm mt-8 mb-2"
                      disabled={digitConfigs.length === 1}
                      aria-label="Remover configuração"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="white"
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
                          value={config.divisorMin ?? 1}
                          onChange={(e) => updateConfig(index, { divisorMin: Number(e.target.value) })}
                          className="input input-bordered input-sm w-full"
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
                          value={config.divisorMax ?? 10}
                          onChange={(e) => updateConfig(index, { divisorMax: Number(e.target.value) })}
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
              onClick={() =>
                setDigitConfigs([
                  ...digitConfigs,
                  { id: crypto.randomUUID(), digits: 2, questions: 10, operation: 'addition' },
                ])
              }
              className="btn btn-outline btn-primary w-full"
            >
              {dict?.addConfig || '➕ Adicionar Configuração'}
            </button>
          </div>

          {/* ── Format ── */}
          <div className="form-control">
            <label htmlFor={formatSelectId} className="label">
              <span className="label-text font-semibold">{dict?.format || '📋 Formato'}</span>
            </label>
            <select
              id={formatSelectId}
              value={format}
              onChange={(e) => setFormat(e.target.value as typeof format)}
              className="select select-bordered select-secondary w-full"
            >
              <option value="grid">{dict?.formatOptions?.grid || '📊 Grade (lista de problemas)'}</option>
              <option value="contextual">{dict?.formatOptions?.contextual || '📖 Contextualizado (histórias)'}</option>
              <option value="both">{dict?.formatOptions?.both || '🎁 Ambos (2 arquivos)'}</option>
            </select>
          </div>

          {/* ── AI Provider ── */}
          {showAISection && (
            <div className="card bg-base-200 shadow-sm">
              <div className="card-body p-4 space-y-3">
                <div className="form-control">
                  <label htmlFor={providerSelectId} className="label">
                    <span className="label-text font-semibold">🤖 Provedor de IA</span>
                  </label>
                  <select
                    id={providerSelectId}
                    value={aiProvider}
                    onChange={(e) => {
                      setAiProvider(e.target.value as AIProvider);
                      setApiKey('');
                      setShowKey(false);
                    }}
                    className="select select-bordered select-accent w-full"
                  >
                    <option value="none">Sem IA (templates)</option>
                    <option value="gemini">Gemini (Google)</option>
                    <option value="openai">GPT-4o (OpenAI)</option>
                    <option value="deepseek">DeepSeek</option>
                    <option value="ollama">Ollama (local)</option>
                  </select>
                </div>

                {needsKey && (
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text text-sm">🔑 Chave de API</span>
                    </label>
                    <div className="flex gap-2">
                      <input
                        type={showKey ? 'text' : 'password'}
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        placeholder={
                          aiProvider === 'gemini'
                            ? 'AIza...'
                            : aiProvider === 'openai'
                            ? 'sk-...'
                            : 'sk-...'
                        }
                        className="input input-bordered input-sm flex-1"
                        autoComplete="off"
                      />
                      <button
                        type="button"
                        onClick={() => setShowKey(!showKey)}
                        className="btn btn-sm btn-ghost"
                        aria-label={showKey ? 'Ocultar chave' : 'Exibir chave'}
                      >
                        {showKey ? '🙈' : '👁'}
                      </button>
                    </div>
                    <p className="text-xs text-base-content/50 mt-1">
                      A chave é usada apenas nesta geração e não é armazenada.
                    </p>
                  </div>
                )}

                {isOllama && (
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text text-sm">🦙 Modelo Ollama</span>
                    </label>
                    <input
                      type="text"
                      value={ollamaModel}
                      onChange={(e) => setOllamaModel(e.target.value)}
                      placeholder="llama3.2"
                      className="input input-bordered input-sm w-full"
                    />
                    <p className="text-xs text-base-content/50 mt-1">
                      Requer <code>ollama serve</code> rodando em localhost:11434
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── Error ── */}
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

          {/* ── Submit ── */}
          <div className="card-actions justify-end mt-6">
            <button
              type="submit"
              disabled={isLoading || totalProblems === 0}
              className="btn btn-primary btn-lg w-full text-lg"
            >
              {isLoading ? (
                <>
                  <span className="loading loading-spinner loading-sm" />
                  {dict?.generating || 'Gerando...'}
                </>
              ) : (
                dict?.generate || '✨ Gerar Exercícios'
              )}
            </button>
          </div>
        </form>

        <div className="divider" />

        <div className="text-sm text-base-content/60">
          <p className="font-semibold mb-2">{dict?.howItWorksTitle || 'ℹ️ Como funciona:'}</p>
          <ul className="list-disc list-inside space-y-1">
            {dict?.howItWorks ? (
              dict.howItWorks.map((item) => <li key={item}>{item}</li>)
            ) : (
              <>
                <li>Selecione um preset ou configure manualmente os algarismos e operações</li>
                <li>Escolha o formato: grade (contas), contextualizado (histórias) ou ambos</li>
                <li>Para histórias, escolha um provedor de IA ou use os templates embutidos</li>
                <li>Clique em Gerar para abrir os exercícios em nova aba prontos para impressão</li>
              </>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
