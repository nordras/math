'use server';

import { z } from 'zod';
import { nanoid } from 'nanoid';
import { MathGeneratorService } from '@/lib/services/MathGeneratorService';
import { AIEnhancerService } from '@/lib/services/AIEnhancerService';
import { HTMLFormatterService } from '@/lib/services/HTMLFormatterService';
import { getExerciseCache } from '@/lib/cache/exerciseCache';

// Schema de validação
const GenerateExercisesSchema = z.object({
  totalProblems: z.number().int().min(1).max(200).default(50),
  difficulty: z.enum(['easy', 'medium', 'hard']).default('medium'),
  useAI: z.boolean().default(false),
  includeAnswerKey: z.boolean().default(false),
  studentName: z.string().default('Cecília'),
  format: z.enum(['grid', 'contextual', 'both']).default('grid'),
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
 * Server Action para gerar exercícios de matemática
 */
export async function generateExercises(
  input: GenerateExercisesInput
): Promise<GenerateExercisesResult> {
  try {
    // Validar input
    const validatedInput = GenerateExercisesSchema.parse(input);

    // Validar opções e gerar problemas
    const options = MathGeneratorService.validateOptions(validatedInput);
    const { problems, stats } = MathGeneratorService.generateProblems(options);

    const cache = getExerciseCache();
    const result: GenerateExercisesResult = { success: true };

    // Gerar exercício em grade
    if (validatedInput.format === 'grid' || validatedInput.format === 'both') {
      const gridHtml = HTMLFormatterService.formatGrid(problems, stats, {
        includeAnswerKey: validatedInput.includeAnswerKey,
        studentName: validatedInput.studentName,
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

    // Gerar problemas contextualizados (com IA se habilitado)
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
              studentName: validatedInput.studentName,
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
          console.error('Erro ao gerar contextos com IA:', aiError);
          return {
            success: false,
            error: `Erro ao gerar contextos com IA: ${aiError.message}`,
          };
        }
      } else {
        // Usar templates simples sem IA
        const simpleContextual = AIEnhancerService.selectProblems(
          problems,
          10
        ).map((p) => ({
          context: `Cecília tem ${p.num1} itens e ${p.type === 'addition' ? 'ganhou' : 'deu'} ${p.num2} itens.`,
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
            studentName: validatedInput.studentName,
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
    console.error('Erro ao gerar exercícios:', error);
    return {
      success: false,
      error: error.message || 'Erro desconhecido ao gerar exercícios',
    };
  }
}
