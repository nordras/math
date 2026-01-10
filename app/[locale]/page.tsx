import GeneratorForm from '@/components/GeneratorForm';
import { useTranslations } from 'next-intl';

export default function Home() {
  const t = useTranslations('Page');

  return (
    <div className="min-h-screen bg-linear-to-br from-pink-100 via-purple-100 to-orange-100">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-linear-to-r from-primary via-secondary to-accent mb-4">
            🎓 {t('title')}
          </h1>
          <p className="text-lg text-base-content/70">{t('subtitle')}</p>
        </div>

        <div className="max-w-2xl mx-auto">
          <GeneratorForm />
        </div>
      </div>
    </div>
  );
}
