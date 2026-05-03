/**
 * AI Provider Service - Abstração unificada de provedores de IA
 * Suporta Gemini, OpenAI, DeepSeek e Ollama com a mesma interface de saída
 */

import AIEnhancer from '../generators/aiEnhancer.js';
import TemplateLibrary from '../generators/templateLibrary.js';
import type { AIProviderConfig, MathProblem } from '../types/math';

const DEFAULT_OLLAMA_MODEL = 'llama3.2';
const DEFAULT_OLLAMA_BASE_URL = 'http://localhost:11434/v1';
const DEEPSEEK_BASE_URL = 'https://api.deepseek.com';
const OPENAI_BASE_URL = 'https://api.openai.com/v1';

type BatchResult = {
  contexts: string[];
  questions: (string | null)[] | null;
};

function getTemplateLibrary(): TemplateLibrary {
  return new TemplateLibrary();
}

function buildTemplateFallback(problems: MathProblem[], lib: TemplateLibrary): BatchResult {
  return {
    contexts: problems.map((p) => lib.getContext(p.type, p.num1, p.num2)),
    questions: null,
  };
}

/**
 * Generates contexts via Gemini (reuses existing AIEnhancer)
 */
async function generateWithGemini(
  problems: MathProblem[],
  apiKey: string,
  model?: string
): Promise<BatchResult> {
  const enhancer = new AIEnhancer(apiKey, {
    model: model || process.env.GEMINI_MODEL || 'gemini-2.0-flash-exp',
  });
  return enhancer.generateContextsBatch(problems);
}

/**
 * Generates contexts via OpenAI-compatible API (OpenAI, DeepSeek, Ollama)
 */
async function generateWithOpenAICompat(
  problems: MathProblem[],
  opts: { apiKey: string; baseURL: string; model: string }
): Promise<BatchResult> {
  const { OpenAI } = await import('openai');
  const lib = getTemplateLibrary();

  const client = new OpenAI({ apiKey: opts.apiKey, baseURL: opts.baseURL });

  // Reuse the same batch prompt builder from AIEnhancer
  const enhancer = new AIEnhancer(null);
  const prompt = enhancer.createBatchPrompt(problems);

  let rawText: string;
  try {
    const response = await client.chat.completions.create({
      model: opts.model,
      messages: [
        {
          role: 'system',
          content:
            'Você é um assistente educacional especializado em criar problemas de matemática para crianças brasileiras. Siga as instruções com precisão e retorne apenas o JSON solicitado.',
        },
        { role: 'user', content: prompt },
      ],
      temperature: 0.7,
    });
    rawText = response.choices[0]?.message?.content ?? '';
  } catch (error) {
    const msg = (error as Error).message || '';
    if (msg.includes('ECONNREFUSED') || msg.includes('ENOTFOUND') || msg.includes('connect')) {
      throw new Error(
        `Ollama não encontrado em ${opts.baseURL.replace('/v1', '')}. Verifique se o servidor está rodando com "ollama serve".`
      );
    }
    if (msg.includes('401') || msg.includes('403') || msg.includes('Unauthorized')) {
      throw new Error('Chave de API inválida ou sem permissão.');
    }
    throw error;
  }

  const parsed = enhancer.parseAIBatchResponse(rawText, problems.length);
  const contexts: string[] = [];
  const questions: (string | null)[] = [];

  for (let i = 0; i < problems.length; i++) {
    const item = parsed[i];
    const context = item?.context?.trim().replace(/^["']|["']$/g, '') || null;
    const question = item?.question?.trim().replace(/^["']|["']$/g, '') || null;

    if (context && enhancer.validateContext(context)) {
      contexts.push(context);
      questions.push(enhancer.validateQuestion(question) ? question : null);
    } else {
      const p = problems[i];
      contexts.push(lib.getContext(p.type, p.num1, p.num2));
      questions.push(null);
    }
  }

  return { contexts, questions };
}

/**
 * Generates contexts and questions for a batch of problems using the specified AI provider.
 * Falls back to templates on any unrecoverable error.
 */
export async function generateContextsBatchWithProvider(
  problems: MathProblem[],
  config: AIProviderConfig
): Promise<BatchResult> {
  const lib = getTemplateLibrary();

  try {
    switch (config.provider) {
      case 'none':
        return buildTemplateFallback(problems, lib);

      case 'gemini': {
        if (!config.apiKey) throw new Error('Chave de API do Gemini não informada.');
        return generateWithGemini(problems, config.apiKey);
      }

      case 'openai': {
        if (!config.apiKey) throw new Error('Chave de API da OpenAI não informada.');
        return generateWithOpenAICompat(problems, {
          apiKey: config.apiKey,
          baseURL: OPENAI_BASE_URL,
          model: 'gpt-4o',
        });
      }

      case 'deepseek': {
        if (!config.apiKey) throw new Error('Chave de API do DeepSeek não informada.');
        return generateWithOpenAICompat(problems, {
          apiKey: config.apiKey,
          baseURL: DEEPSEEK_BASE_URL,
          model: 'deepseek-chat',
        });
      }

      case 'ollama': {
        return generateWithOpenAICompat(problems, {
          apiKey: 'ollama',
          baseURL: config.ollamaBaseUrl || DEFAULT_OLLAMA_BASE_URL,
          model: config.ollamaModel || DEFAULT_OLLAMA_MODEL,
        });
      }

      default:
        return buildTemplateFallback(problems, lib);
    }
  } catch (error) {
    const msg = (error as Error).message || '';
    console.warn(`[AIProviderService] Falha no provedor ${config.provider}: ${msg}. Usando templates.`);
    return buildTemplateFallback(problems, lib);
  }
}
