# 📚 Gerador de Exercícios de Matemática com IA

Sistema inteligente para gerar exercícios de matemática personalizados com contextos narrativos criados por IA.

<img width="727" height="1108" alt="image" src="https://github.com/user-attachments/assets/449b6c03-1ed2-48c7-9234-5b7e91c1930f" />

## 🚀 Início Rápido

```bash
# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env.local
# Edite .env.local e adicione sua GEMINI_API_KEY

# Rodar em desenvolvimento
npm run dev

# Compilar para produção
npm run build
npm start
```

Acesse: http://localhost:3000

## ✨ Funcionalidades

- 🎯 **Geração Inteligente**: Exercícios de adição, subtração, multiplicação e divisão
- 🤖 **IA Contextual**: Google Gemini cria problemas narrativos únicos
- 👦 **Nomes Dinâmicos**: Pool de 18 nomes multilíngues (PT/EN)
- 📊 **Formatos Múltiplos**: Grade compacta ou problemas contextualizados
- 📝 **Configurável**: Controle de dígitos, operações e dificuldade
- 💾 **Cache Inteligente**: Sistema de cache para performance
- ✅ **Gabarito Opcional**: Versões com e sem respostas

## 📁 Estrutura do Projeto

```
math/
├── app/                      # Next.js App Router (páginas e rotas)
├── components/               # Componentes React
│   └── GeneratorForm.tsx     # Formulário principal
├── lib/
│   ├── constants/            
│   │   └── namePool.ts/js    # Pool de nomes multilíngues (18 nomes)
│   ├── generators/           
│   │   ├── mathGenerator.js   # Gerador de problemas matemáticos
│   │   ├── aiEnhancer.js      # Integração com Gemini API
│   │   └── templateLibrary.js # Templates de fallback
│   ├── services/             
│   │   ├── MathGeneratorService.ts  # Serviço de geração
│   │   ├── AIEnhancerService.js     # Serviço de IA
│   │   └── HTMLFormatterService.js  # Formatação HTML
│   ├── cache/                
│   │   └── exerciseCache.js   # Cache em memória
│   └── utils/                
│       └── cache.js           # Cache de contextos IA
├── public/                   # Assets estáticos
├── __tests__/                # Testes Jest
├── assets/                   # SVGs e recursos
└── prototype-math/           # ⚠️ DEPRECATED - Não usar
    └── DEPRECATED.md         # Aviso de depreciação
```

## 🎨 Pool de Nomes

Sistema de nomes abstratos multilíngues para máxima variabilidade:

**Femininos**: Luna, Maya, Nina, Mia, Jade, Lara, Sofia, Ana, Emma  
**Masculinos**: Leo, Noah, Davi, Kai, Lucas, Theo, Samuel, Enzo, Miguel

## 🎯 Como Usar Este Material

## 📖 Multiplicação

### Ordem Sugerida de Estudo

1. **[Conceitos Básicos](multiplicacao/01-conceitos-basicos.md)** - O que é multiplicação? Grupos e adição repetida
2. **[Tabuada do 0 e do 1](multiplicacao/02-tabuada-0-e-1.md)** - Os casos especiais
3. **[Tabuada do 2](multiplicacao/03-tabuada-do-2.md)** - Aprendendo a dobrar
4. **[Tabuada do 5 e do 10](multiplicacao/04-tabuada-5-e-10.md)** - Descobrindo padrões
5. **[Arrays e Propriedade Comutativa](multiplicacao/05-arrays-e-propriedade-comutativa.md)** - Linhas e colunas
6. **[Tabuada do 3 e do 4](multiplicacao/06-tabuada-3-e-4.md)** - Praticando mais
7. **[Tabuada do 6 e do 9](multiplicacao/07-tabuada-6-e-9.md)** - Truques interessantes
8. **[Tabuada do 7 e do 8](multiplicacao/08-tabuada-7-e-8.md)** - Os desafios finais
9. **[Revisão e Prática Mista](multiplicacao/09-revisao-e-pratica-mista.md)** - Juntando tudo
10. **[Desafios e Aplicações](multiplicacao/10-desafios-e-aplicacoes.md)** - Problemas criativos

## 🎨 Dicas de Estudo

- ✏️ Use papel e lápis para desenhar os problemas
- 🧮 Conte nos dedos quando precisar
- 🎲 Use objetos reais (brinquedos, frutas) para formar grupos
- 📝 Refaça exercícios difíceis outro dia
- 🌟 Comemore cada conquista!

## 📅 Sugestão de Cronograma

- **Semanas 1-2**: Lições 1-2 (conceitos e casos especiais)
- **Semanas 3-4**: Lições 3-4 (tabuadas fáceis: 2, 5, 10)
- **Semana 5**: Lição 5 (arrays e propriedade comutativa)
- **Semanas 6-7**: Lições 6-7 (tabuadas intermediárias: 3, 4, 6, 9)
- **Semana 8**: Lição 8 (tabuadas desafiadoras: 7, 8)
- **Semanas 9-10**: Lições 9-10 (revisão e desafios)

**Importante**: Este cronograma é apenas uma sugestão. Ajuste conforme o ritmo de aprendizado.

## 🛠️ Tecnologias

- **Next.js 16** (App Router + Turbopack)
- **TypeScript** + **JavaScript**
- **Google Gemini API** (generative-ai)
- **Tailwind CSS** + **DaisyUI**
- **Jest** para testes

## 📝 Configuração

Crie `.env.local` com:

```env
GEMINI_API_KEY=sua_chave_aqui
```

## 🧪 Testes

```bash
npm test              # Rodar todos os testes
npm run test:watch    # Modo watch
```

## 📦 Scripts Disponíveis

```bash
npm run dev           # Desenvolvimento
npm run build         # Build de produção
npm start             # Servir produção
npm test              # Testes
npm run lint          # Linter
```

## Fontes
- https://storyset.com
- https://www.education.com/resources/grade-2/worksheets/english-language-arts/
- https://www.education.com/worksheet/article/2-math-minutes-addition/

---

*Material criado com ❤️ - Dezembro 2025*
