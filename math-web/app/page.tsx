import GeneratorForm from '@/components/GeneratorForm';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-orange-100">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent mb-4">
            🎓 Matemática para Cecília
          </h1>
          <p className="text-lg text-base-content/70">
            Gerador de exercícios personalizados com tecnologia e carinho ❤️
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <GeneratorForm />
        </div>

        <div className="text-center mt-12 text-base-content/60">
          <p className="text-sm">
            Desenvolvido com ❤️ usando Next.js e Google Gemini AI
          </p>
        </div>
      </div>
    </div>
  );
}
