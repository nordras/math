import { notFound } from 'next/navigation';
import { getExerciseCache } from '@/lib/cache/exerciseCache';

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ExercisePage({ params }: PageProps) {
  const { id } = await params;
  const cache = getExerciseCache();
  
  const exercise = cache.get(id);

  if (!exercise) {
    notFound();
  }

  // Retornar o HTML puro
  return (
    <div dangerouslySetInnerHTML={{ __html: exercise.html }} />
  );
}

// Metadados dinâmicos
export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  const cache = getExerciseCache();
  const exercise = cache.get(id);

  if (!exercise) {
    return {
      title: 'Exercício não encontrado',
    };
  }

  const typeLabel = exercise.type === 'grid' ? 'Grade' : 'Contextualizado';
  return {
    title: `Exercício ${typeLabel} - Gerador de Matemática`,
    description: `Exercício de matemática com ${exercise.stats.total} problemas`,
  };
}
