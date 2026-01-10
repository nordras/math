/**
 * AI Enhancer Service - Geração de contextos narrativos para problemas matemáticos
 * Serviço de alto nível que orquestra a geração de problemas contextualizados
 */
import type { MathProblem, ContextualProblem } from '../types/math';
import AIEnhancer from '../generators/aiEnhancer.js';

/** Constantes de configuração */
const DEFAULT_CONTEXTUAL_PROBLEMS_COUNT = 10;

/** Configurações do AI Enhancer */
interface AIEnhancerConfig {
  apiKey: string;
  model?: string;
}

/**
 * Valida se a chave de API do Gemini está configurada
 * @throws {Error} Se a API key estiver ausente ou for placeholder
 */
function validateApiKey(apiKey: string | undefined): asserts apiKey is string {
  if (!apiKey || apiKey === 'your_api_key_here') {
    throw new Error(
      'API key do Gemini não configurada. Configure GEMINI_API_KEY no arquivo .env'
    );
  }
}

/**
 * Cria instância do AI Enhancer com configuração
 */
function createAIEnhancer(config: AIEnhancerConfig): AIEnhancer {
  return new AIEnhancer(config.apiKey, {
    model: config.model || 'gemini-2.0-flash-exp',
  });
}

/**
 * Seleciona problemas uniformemente distribuídos da lista completa
 * @param problems - Lista completa de problemas
 * @param count - Quantidade de problemas a selecionar
 * @returns Lista de problemas selecionados uniformemente
 */
export function selectProblems(problems: MathProblem[], count: number): MathProblem[] {
  if (count <= 0) return [];
  if (count >= problems.length) return problems;

  const step = Math.floor(problems.length / count);
  const selected: MathProblem[] = [];

  for (let i = 0; i < count && i * step < problems.length; i++) {
    selected.push(problems[i * step]);
  }

  return selected;
}

/**
 * Determina a pergunta apropriada baseada no tipo de operação
 * @param operationType - Tipo de operação matemática
 * @returns Texto da pergunta
 */
export function getQuestionForOperation(operationType: MathProblem['type']): string {
  switch (operationType) {
    case 'addition':
      return 'Quantos no total?';
    case 'subtraction':
      return 'Quantos restaram?';
    case 'multiplication':
      return 'Quantos ao todo?';
    case 'division':
      return 'Quantos para cada um?';
    default:
      return 'Qual é o resultado?';
  }
}

/**
 * Transforma problemas básicos em problemas contextualizados
 * @param problems - Problemas básicos
 * @param contexts - Contextos narrativos gerados pela IA
 * @returns Problemas com contexto narrativo
 */
export function buildContextualProblems(
  problems: MathProblem[],
  contexts: string[]
): ContextualProblem[] {
  return problems.map((problem, index) => ({
    context: contexts[index],
    question: getQuestionForOperation(problem.type),
    answer: problem.answer,
    num1: problem.num1,
    num2: problem.num2,
    operation: problem.operation,
  }));
}

/**
 * Gera problemas matemáticos com contextos narrativos usando IA
 * @param problems - Lista de problemas matemáticos básicos
 * @param count - Quantidade de problemas a contextualizar (padrão: 10)
 * @returns Promessa com lista de problemas contextualizados
 * @throws {Error} Se a API key não estiver configurada
 *
 * @example
 * ```typescript
 * const basicProblems = [{ num1: 5, num2: 3, type: 'addition', operation: '+', answer: 8 }];
 * const contextual = await generateContextualProblems(basicProblems, 1);
 * // Result: [{ context: "Maria tinha 5 maçãs e ganhou 3...", question: "Quantos no total?", ... }]
 * ```
 */
export async function generateContextualProblems(
  problems: MathProblem[],
  count: number = DEFAULT_CONTEXTUAL_PROBLEMS_COUNT
): Promise<ContextualProblem[]> {
  const apiKey = process.env.GEMINI_API_KEY;
  validateApiKey(apiKey);

  const model = process.env.GEMINI_MODEL;
  const aiEnhancer = createAIEnhancer({ apiKey, model });

  // Selecionar problemas uniformemente distribuídos
  const selectedProblems = selectProblems(problems, count);

  // Gerar contextos para todos os problemas selecionados em batch
  const generatedContexts = await aiEnhancer.generateContextsBatch(selectedProblems);

  // Combinar problemas com contextos
  return buildContextualProblems(selectedProblems, generatedContexts);
}

/**
 * Obtém estatísticas de uso da API
 * @param apiKey - Chave de API do Gemini
 * @returns Estatísticas de uso da API
 */
export function getApiUsageStats(apiKey: string) {
  const aiEnhancer = createAIEnhancer({ apiKey });
  return aiEnhancer.getUsageStats();
}
