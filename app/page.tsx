import GeneratorForm from '@/components/GeneratorForm';

export default function Home() {
  return (
    <div className="min-h-screen bg-linear-to-br from-pink-100 via-purple-100 to-orange-100">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-linear-to-r from-primary via-secondary to-accent mb-4">
            🎓 Gerador de Exercícios de Matemática
          </h1>
          <p className="text-lg text-base-content/70">
            Crie exercícios personalizados de forma rápida e fácil
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <GeneratorForm />
        </div>
      </div>
    </div>
  );
}
