'use server';

import { z } from 'zod';
import { getRandomName } from '@/lib/constants/namePool';
import { generateContextualProblems } from '@/lib/services/AIEnhancerService';
import { renderContextualTemplate, renderGridTemplate } from '@/lib/services/PrintFormatterService';
import { generateProblems, validateOptions } from '@/lib/services/MathGeneratorService';
import type { AIProviderConfig, GenerateProblemsResult } from '@/lib/types/math';

const GenerateExercisesSchema = z.object({
  totalProblems: z.number().int().min(1).max(200).default(50),
  difficulty: z.enum(['easy', 'medium', 'hard']).default('medium'),
  includeAnswerKey: z.boolean().default(false),
  studentName: z.string().optional(),
  format: z.enum(['grid', 'contextual', 'both']).default('grid'),
  digitConfigs: z
    .array(
      z.object({
        digits: z.number().int().min(1).max(5),
        questions: z.number().int().min(0).max(100),
        operation: z.enum(['addition', 'subtraction', 'multiplication', 'division', 'mixed']),
        divisorMin: z.number().int().min(1).max(100).optional(),
        divisorMax: z.number().int().min(1).max(100).optional(),
        multiplierMin: z.number().int().min(1).max(100).optional(),
        multiplierMax: z.number().int().min(1).max(100).optional(),
      })
    )
    .optional(),
  aiProvider: z.enum(['gemini', 'openai', 'deepseek', 'ollama', 'none']).default('none'),
  apiKey: z.string().optional(),
  ollamaModel: z.string().optional(),
  ollamaBaseUrl: z.string().optional(),
});

export type GenerateExercisesInput = z.infer<typeof GenerateExercisesSchema>;

export interface GenerateExercisesResult {
  success: boolean;
  html?: string;
  gridHtml?: string;
  contextualHtml?: string;
  error?: string;
}

export async function generateExercises(
  input: GenerateExercisesInput
): Promise<GenerateExercisesResult> {
  try {
    const validatedInput = GenerateExercisesSchema.parse(input);
    const studentName = validatedInput.studentName || getRandomName();

    const options = validateOptions({
      ...validatedInput,
      digitConfigs: validatedInput.digitConfigs,
    });
    const { problems, stats } = generateProblems(options) as GenerateProblemsResult;

    const result: GenerateExercisesResult = { success: true };

    if (validatedInput.format === 'grid' || validatedInput.format === 'both') {
      const gridHtml = renderGridTemplate(problems, stats, {
        includeAnswerKey: validatedInput.includeAnswerKey,
      });
      result.gridHtml = gridHtml;
      if (validatedInput.format === 'grid') result.html = gridHtml;
    }

    if (validatedInput.format === 'contextual' || validatedInput.format === 'both') {
      try {
        const providerConfig: AIProviderConfig = {
          provider: validatedInput.aiProvider,
          apiKey: validatedInput.apiKey,
          ollamaModel: validatedInput.ollamaModel,
          ollamaBaseUrl: validatedInput.ollamaBaseUrl,
        };

        const contextualProblems = await generateContextualProblems(problems, 10, providerConfig);

        const contextualHtml = renderContextualTemplate(contextualProblems, {
          includeAnswerKey: validatedInput.includeAnswerKey,
          studentName,
        });

        result.contextualHtml = contextualHtml;
        if (validatedInput.format === 'contextual') result.html = contextualHtml;
      } catch (aiError: unknown) {
        console.error('Error generating contextual problems:', aiError);
        return {
          success: false,
          error: `Erro ao gerar problemas contextualizados: ${aiError instanceof Error ? aiError.message : String(aiError)}`,
        };
      }
    }

    return result;
  } catch (error: unknown) {
    console.error('Error generating exercises:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido ao gerar exercícios',
    };
  }
}
