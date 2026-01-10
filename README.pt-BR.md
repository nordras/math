🇧🇷 **Português** | [🇺🇸 English](README.md)

# 📚 Gerador de Exercícios de Matemática

Uma ferramenta educacional para criar exercícios de matemática personalizados com ou sem contextos gerados por IA.

**🌐 Demo Online:** [https://math-rust-tau.vercel.app/](https://math-rust-tau.vercel.app/)

> ⚠️ **Atenção:** A versão hospedada na Vercel **não** inclui funcionalidades de IA. Para usar contextos narrativos gerados por IA, você deve rodar o projeto localmente com sua própria chave da API Gemini.

<img width="727" height="1108" alt="image" src="https://github.com/user-attachments/assets/449b6c03-1ed2-48c7-9234-5b7e91c1930f" />

## ✨ Funcionalidades

- 🎯 Gera exercícios de adição, subtração, multiplicação e divisão
- 🤖 Contextos narrativos criados por IA usando Google Gemini
- 👦 Nomes de personagens dinâmicos em múltiplos idiomas
- 📊 Múltiplos formatos de saída (compacto ou detalhado)
- 📝 Dificuldade e quantidade de exercícios personalizáveis
- ✅ Gabarito opcional

## 🚀 Início Rápido

### Opção 1: Experimente Online (sem IA)

Visite [https://math-rust-tau.vercel.app/](https://math-rust-tau.vercel.app/) para gerar exercícios básicos sem contextos gerados por IA.

### Opção 2: Rode Localmente (com IA) ⭐

**Para usar contextos narrativos gerados por IA, siga estes passos:**

```bash
# Clone o repositório
git clone https://github.com/igorferreira007/math.git
cd math

# Instale as dependências
npm install

# Configure o ambiente com sua chave da API Gemini
cp .env.example .env.local
# Edite .env.local e adicione sua GEMINI_API_KEY

# Execute o servidor de desenvolvimento
npm run dev
```

Acesse em [http://localhost:3000](http://localhost:3000)

**Obtenha sua chave gratuita da API Gemini em:** [Google AI Studio](https://makersuite.google.com/app/apikey)

## 🛠️ Tecnologias

- **Next.js 16** (App Router + Turbopack)
- **TypeScript** + **JavaScript**
- **Google Gemini API**
- **Tailwind CSS** + **DaisyUI**
- **Jest** para testes

## 📝 Configuração

Crie um arquivo `.env.local`:

```env
GEMINI_API_KEY=sua_chave_api_aqui
```

Obtenha sua chave em: [Google AI Studio](https://makersuite.google.com/app/apikey)

## 📁 Estrutura do Projeto

```
math/
├── app/                    # Páginas e rotas do Next.js
├── components/             # Componentes React
├── lib/
│   ├── constants/         # Pool de nomes e constantes
│   ├── generators/        # Geradores de exercícios
│   ├── services/          # Serviços de lógica de negócio
│   └── utils/             # Funções utilitárias
├── __tests__/             # Arquivos de teste
└── public/                # Arquivos estáticos
```

## 🧪 Testes

```bash
npm test              # Executar todos os testes
npm run test:watch    # Modo watch
```

## 📦 Scripts Disponíveis

```bash
npm run dev      # Servidor de desenvolvimento
npm run build    # Build de produção
npm start        # Servir build de produção
npm test         # Executar testes
npm run lint     # Executar linter
```

## 📄 Licença

Licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

## 👨‍💻 Autor

**Igor Paiva Ferreira**

- 📧 Email: igorkmail@gmail.com
- 💼 LinkedIn: [igor-paiva-ferreira](https://www.linkedin.com/in/igor-paiva-ferreira)

---

Feito com ❤️ para a educação de Cecília
