'use server';

import { z } from 'zod';
import { nanoid } from 'nanoid';
import { MathGeneratorService } from '@/lib/services/MathGeneratorService';
import { AIEnhancerService } from '@/lib/services/AIEnhancerService';
import { HTMLFormatterService } from '@/lib/services/HTMLFormatterService';
import { getExerciseCache } from '@/lib/cache/exerciseCache.js';
import { getRandomName } from '@/lib/constants/namePool';
import type { GenerateProblemsResult } from '@/lib/types/math';

// Validation schema
const GenerateExercisesSchema = z.object({
  totalProblems: z.number().int().min(1).max(200).default(50),
  difficulty: z.enum(['easy', 'medium', 'hard']).default('medium'),
  useAI: z.boolean().default(false),
  includeAnswerKey: z.boolean().default(false),
  studentName: z.string().optional(),
  format: z.enum(['grid', 'contextual', 'both']).default('grid'),
  digitConfigs: z.array(z.object({
    digits: z.number().int().min(1).max(5),
    questions: z.number().int().min(0).max(100),
    operation: z.enum(['addition', 'subtraction', 'multiplication', 'division', 'mixed']),
    divisorMin: z.number().int().min(1).max(100).optional(),
    divisorMax: z.number().int().min(1).max(100).optional(),
  })).optional(),
});

export type GenerateExercisesInput = z.infer<typeof GenerateExercisesSchema>;

export interface GenerateExercisesResult {
  success: boolean;
  exerciseId?: string;
  gridExerciseId?: string;
  contextualExerciseId?: string;
  error?: string;
}

/**
 * Server Action to generate math exercises
 */
export async function generateExercises(
  input: GenerateExercisesInput
): Promise<GenerateExercisesResult> {
  try {
    // Validate input
    const validatedInput = GenerateExercisesSchema.parse(input);

    // Use random name from pool if not provided
    const studentName = validatedInput.studentName || getRandomName();

    // Validate options and generate problems
    const options = MathGeneratorService.validateOptions({
      ...validatedInput,
      digitConfigs: validatedInput.digitConfigs,
    });
    const { problems, stats } = MathGeneratorService.generateProblems(options) as GenerateProblemsResult;

    const cache = getExerciseCache();
    const result: GenerateExercisesResult = { success: true };

    // Gerar exercício em grade
    if (validatedInput.format === 'grid' || validatedInput.format === 'both') {
      const gridHtml = HTMLFormatterService.formatGrid(problems, stats, {
        includeAnswerKey: validatedInput.includeAnswerKey,
        studentName,
      });

      const gridId = nanoid(10);
      cache.set(gridId, {
        type: 'grid',
        html: gridHtml,
        stats,
        options: validatedInput,
      });

      result.gridExerciseId = gridId;
      if (validatedInput.format === 'grid') {
        result.exerciseId = gridId;
      }
    }

    // Generate contextualized problems (with AI if enabled)
    if (
      validatedInput.format === 'contextual' ||
      validatedInput.format === 'both'
    ) {
      if (validatedInput.useAI) {
        try {
          const contextualProblems =
            await AIEnhancerService.generateContextualProblems(problems, 10);

          const contextualHtml = HTMLFormatterService.formatContextual(
            contextualProblems,
            stats,
            {
              includeAnswerKey: validatedInput.includeAnswerKey,
              studentName,
            }
          );

          const contextualId = nanoid(10);
          cache.set(contextualId, {
            type: 'contextual',
            html: contextualHtml,
            stats,
            options: validatedInput,
          });

          result.contextualExerciseId = contextualId;
          if (validatedInput.format === 'contextual') {
            result.exerciseId = contextualId;
          }
        } catch (aiError: any) {
          console.error('Error generating contexts with AI:', aiError);
          return {
            success: false,
            error: `Error generating contexts with AI: ${aiError.message}`,
          };
        }
      } else {
        // Use simple templates without AI
        const simpleContextual = AIEnhancerService.selectProblems(
          problems,
          10
        ).map((p) => ({
          context: `${studentName} tem ${p.num1} itens e ${p.type === 'addition' ? 'ganhou' : 'deu'} ${p.num2} itens.`,
          question:
            p.type === 'addition' ? 'Quantos no total?' : 'Quantos restaram?',
          answer: p.answer,
          num1: p.num1,
          num2: p.num2,
          operation: p.operation,
        }));

        const contextualHtml = HTMLFormatterService.formatContextual(
          simpleContextual,
          stats,
          {
            includeAnswerKey: validatedInput.includeAnswerKey,
            studentName,
          }
        );

        const contextualId = nanoid(10);
        cache.set(contextualId, {
          type: 'contextual',
          html: contextualHtml,
          stats,
          options: validatedInput,
        });

        result.contextualExerciseId = contextualId;
        if (validatedInput.format === 'contextual') {
          result.exerciseId = contextualId;
        }
      }
    }

    return result;
  } catch (error: any) {
    console.error('Error generating exercises:', error);
    return {
      success: false,
      error: error.message || 'Unknown error generating exercises',
    };
  }
}
