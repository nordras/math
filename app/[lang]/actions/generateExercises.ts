'use server';

import { z } from 'zod';
import { getRandomName } from '@/lib/constants/namePool';
import { generateContextualProblems } from '@/lib/services/AIEnhancerService';
import { formatContextual, formatGrid } from '@/lib/services/HTMLFormatterService';
import { generateProblems, validateOptions } from '@/lib/services/MathGeneratorService';
import type { GenerateProblemsResult } from '@/lib/types/math';

// Validation schema
const GenerateExercisesSchema = z.object({
  totalProblems: z.number().int().min(1).max(200).default(50),
  difficulty: z.enum(['easy', 'medium', 'hard']).default('medium'),
  useAI: z.boolean().default(false),
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
      })
    )
    .optional(),
});

export type GenerateExercisesInput = z.infer<typeof GenerateExercisesSchema>;

export interface GenerateExercisesResult {
  success: boolean;
  html?: string;
  gridHtml?: string;
  contextualHtml?: string;
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
    const options = validateOptions({
      ...validatedInput,
      digitConfigs: validatedInput.digitConfigs,
    });
    const { problems, stats } = generateProblems(options) as GenerateProblemsResult;

    const result: GenerateExercisesResult = { success: true };

    //Generate HTML grid format
    if (validatedInput.format === 'grid' || validatedInput.format === 'both') {
      const gridHtml = formatGrid(problems, stats, {
        includeAnswerKey: validatedInput.includeAnswerKey,
        studentName,
      });

      result.gridHtml = gridHtml;
      if (validatedInput.format === 'grid') {
        result.html = gridHtml;
      }
    }

    // Generate contextualized problems (with AI if enabled)
    if (validatedInput.format === 'contextual' || validatedInput.format === 'both') {
      if (validatedInput.useAI) {
        try {
          const contextualProblems = await generateContextualProblems(problems, 10);

          const contextualHtml = formatContextual(contextualProblems, stats, {
            includeAnswerKey: validatedInput.includeAnswerKey,
            studentName,
          });

          result.contextualHtml = contextualHtml;
          if (validatedInput.format === 'contextual') {
            result.html = contextualHtml;
          }
        } catch (aiError: unknown) {
          console.error('Error generating contexts with AI:', aiError);
          return {
            success: false,
            error: `Error generating contexts with AI: ${aiError instanceof Error ? aiError.message : String(aiError)}`,
          };
        }
      } else {
        // Use simple templates without AI (hardcoded for now - should be improved)
        const simpleContextual = problems.slice(0, 10).map((p) => ({
          context: `${studentName} tem ${p.num1} itens e ${p.type === 'addition' ? 'ganhou' : 'deu'} ${p.num2} itens.`,
          question: p.type === 'addition' ? 'Quantos no total?' : 'Quantos restaram?',
          answer: p.answer,
          num1: p.num1,
          num2: p.num2,
          operation: p.operation,
        }));

        const contextualHtml = formatContextual(simpleContextual, stats, {
          includeAnswerKey: validatedInput.includeAnswerKey,
          studentName,
        });

        result.contextualHtml = contextualHtml;
        if (validatedInput.format === 'contextual') {
          result.html = contextualHtml;
        }
      }
    }

    return result;
  } catch (error: unknown) {
    console.error('Error generating exercises:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error generating exercises',
    };
  }
}
