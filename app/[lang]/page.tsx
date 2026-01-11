import GeneratorForm from '@/components/GeneratorForm';
import { notFound } from 'next/navigation';
import type { PageProps } from '@/types/page';
import { getDictionary, hasLocale } from './dictionaries';

export default async function Home({ params }: PageProps) {
  const { lang } = await params;
  
  if (!hasLocale(lang)) {
    notFound();
  }
  
  const dict = await getDictionary(lang);

  return (
    <main className="min-h-screen bg-linear-to-br from-pink-100 via-purple-100 to-orange-100">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-linear-to-r from-primary via-secondary to-accent mb-4">
            {dict.home.title}
          </h1>
          <p className="text-lg text-base-content/70">
            {dict.home.subtitle}
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <GeneratorForm dict={dict.form} />
        </div>
      </div>
    </main>
  );
}
