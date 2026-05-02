/**
 * AI Enhancer Service - Geração de contextos narrativos para problemas matemáticos
 * Serviço de alto nível que orquestra a geração de problemas contextualizados
 */

import AIEnhancer from '../generators/aiEnhancer.js';
import type { AIProviderConfig, ContextualProblem, MathProblem } from '../types/math';

const DEFAULT_CONTEXTUAL_PROBLEMS_COUNT = 10;

const QUESTION_VARIATIONS = {
  addition: [
    'Quantos no total?',
    'Quantos tem agora?',
    'Quantos ficaram ao todo?',
    'Qual é o total?',
    'Quantos são juntos?',
    'Qual é a soma?',
    'Quantos ao todo?',
  ],
  subtraction: [
    'Quantos restaram?',
    'Quantos sobraram?',
    'Quantos ainda tem?',
    'Quantos ficaram?',
    'Quanto sobrou?',
    'Qual é a diferença?',
    'Com quantos ficou?',
  ],
  multiplication: [
    'Quantos ao todo?',
    'Quantos são no total?',
    'Qual o total?',
    'Quantos tem no total?',
    'Qual é o produto?',
    'Quantos em todos os grupos?',
    'Quantos são ao todo?',
  ],
  division: [
    'Quantos para cada um?',
    'Quanto cada um recebe?',
    'Quantos em cada grupo?',
    'Quanto fica para cada um?',
    'Quantos sobram para cada um?',
    'Qual é o quociente?',
    'Quanto cabe em cada parte?',
  ],
} as const;

interface AIEnhancerConfig {
  apiKey: string;
  model?: string;
}

function validateApiKey(apiKey: string | undefined): asserts apiKey is string {
  if (!apiKey || apiKey === 'your_api_key_here') {
    throw new Error('API key do Gemini não configurada. Configure GEMINI_API_KEY no arquivo .env');
  }
}

function createAIEnhancer(config: AIEnhancerConfig): AIEnhancer {
  return new AIEnhancer(config.apiKey, {
    model: config.model || 'gemini-2.0-flash-exp',
  });
}

/**
 * Validates an AI-generated question before using it
 */
function validateAIQuestion(text: string | null | undefined): boolean {
  if (!text || typeof text !== 'string') return false;
  const trimmed = text.trim();
  if (trimmed.length < 5 || trimmed.length > 120) return false;
  if (!trimmed.endsWith('?')) return false;
  if (/\d+\s*[+\-×÷]\s*\d+/.test(trimmed)) return false;
  return true;
}

/**
 * Seleciona problemas uniformemente distribuídos da lista completa
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
 * Retorna uma pergunta do pool baseada no tipo de operação
 */
export function getQuestionForOperation(operationType: MathProblem['type']): string {
  const questions = QUESTION_VARIATIONS[operationType] || ['Qual é o resultado?'];
  return questions[Math.floor(Math.random() * questions.length)];
}

/**
 * Transforma problemas básicos em problemas contextualizados
 */
export function buildContextualProblems(
  problems: MathProblem[],
  contexts: string[],
  aiQuestions: (string | null)[] | null = null
): ContextualProblem[] {
  return problems.map((problem, index) => {
    const poolQuestion = getQuestionForOperation(problem.type);
    const rawAiQuestion = aiQuestions?.[index] ?? null;
    const generatedQuestion = validateAIQuestion(rawAiQuestion) ? rawAiQuestion! : undefined;

    return {
      context: contexts[index],
      question: poolQuestion,
      generatedQuestion,
      answer: problem.answer,
      num1: problem.num1,
      num2: problem.num2,
      operation: problem.operation,
    };
  });
}

/**
 * Gera problemas matemáticos com contextos narrativos usando IA
 */
export async function generateContextualProblems(
  problems: MathProblem[],
  count: number = DEFAULT_CONTEXTUAL_PROBLEMS_COUNT,
  providerConfig?: AIProviderConfig
): Promise<ContextualProblem[]> {
  const selectedProblems = selectProblems(problems, count);

  // New path: explicit provider config supplied (including 'none' → templates)
  if (providerConfig) {
    const { generateContextsBatchWithProvider } = await import('./AIProviderService');
    const { contexts, questions } = await generateContextsBatchWithProvider(
      selectedProblems,
      providerConfig
    );
    return buildContextualProblems(selectedProblems, contexts, questions);
  }

  // Legacy: read Gemini API key from environment
  const apiKey = process.env.GEMINI_API_KEY;
  validateApiKey(apiKey);

  const model = process.env.GEMINI_MODEL;
  const aiEnhancer = createAIEnhancer({ apiKey, model });

  const { contexts, questions } = await aiEnhancer.generateContextsBatch(selectedProblems);
  return buildContextualProblems(selectedProblems, contexts, questions);
}

export function getApiUsageStats(apiKey: string) {
  const aiEnhancer = createAIEnhancer({ apiKey });
  return aiEnhancer.getUsageStats();
}
