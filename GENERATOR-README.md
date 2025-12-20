# 🎓 Gerador de Exercícios de Matemática com IA

Sistema automatizado para gerar exercícios de matemática (adição e subtração) personalizados para Cecília, com integração opcional de IA (Google Gemini) para criar contextos narrativos diversos.

## ✨ Funcionalidades

- 📝 Gera 50 exercícios mistos (adição + subtração)
- 🤖 Integração opcional com Google Gemini AI (free tier)
- 💾 Sistema de cache inteligente (evita chamadas repetidas à API)
- 📊 Múltiplos níveis de dificuldade (fácil, médio, difícil)
- 📄 Saída em Markdown formatado
- 🎯 Problemas contextualizados com Cecília como protagonista
- 📖 Geração automática de gabaritos
- 🔄 Fallback automático para templates quando IA não disponível

## 📦 Instalação

### 1. Instalar dependências

```bash
npm install
```

### 2. Configurar API do Gemini (Opcional)

Se quiser usar IA para gerar contextos diversos:

1. Obtenha uma chave gratuita em: https://makersuite.google.com/app/apikey
2. Copie o arquivo de exemplo:
   ```bash
   cp .env.example .env
   ```
3. Edite `.env` e adicione sua chave:
   ```env
   GEMINI_API_KEY=sua_chave_aqui
   USE_AI=true
   ```

**Free Tier do Gemini:**
- ✅ 1.500 requests/dia
- ✅ Sem cartão de crédito
- ✅ Ideal para uso educacional

## 🚀 Uso

### Modo Básico (sem IA)

```bash
npm start
```

ou

```bash
npm run generate:no-ai
```

Usa templates pré-definidos para contextos narrativos.

### Modo com IA

```bash
npm run generate:with-ai
```

Usa Google Gemini para gerar contextos narrativos diversos e criativos.

### Níveis de Dificuldade

```bash
# Fácil (números 1-10)
npm start -- --easy

# Médio (números 1-20) - padrão
npm start

# Difícil (números 1-50)
npm start -- --hard
```

## 📁 Arquivos Gerados

Todos os arquivos são salvos em `adicao-subtracao/`:

1. **`exercicio-50-problemas-[nivel].md`**
   - 50 exercícios em grade 5×10
   - Formato tradicional para impressão
   - Sem respostas

2. **`exercicio-50-problemas-[nivel]-gabarito.md`**
   - Mesma folha com gabarito incluído
   - Para o professor/pai

3. **`problemas-contextualizados-[nivel].md`**
   - 10 problemas com narrativas contextualizadas
   - Histórias com Cecília
   - Formato de palavra problema

4. **`problemas-contextualizados-[nivel]-gabarito.md`**
   - Versão com respostas

## 🛠️ Estrutura do Projeto

```
math/
├── generators/
│   ├── mathGenerator.js       # Geração de problemas matemáticos
│   ├── aiEnhancer.js          # Integração com Gemini AI
│   └── templateLibrary.js     # Templates de fallback
├── utils/
│   └── cache.js               # Sistema de cache
├── templates/
│   └── grid.js                # Formatação Markdown
├── cache/                     # Cache de respostas da IA (gerado)
├── adicao-subtracao/          # Exercícios gerados (gerado)
├── index.js                   # Script principal
├── package.json
├── .env.example
└── GENERATOR-README.md        # Este arquivo
```

## 🎯 Características dos Exercícios

### Problemas em Grade

```
   5         12          8          3
+ 3       − 7        + 6        + 4
____      ____       ____       ____
```

- Layout 5 colunas × 10 linhas
- 50 problemas no total
- 50% adição, 50% subtração
- Embaralhamento inteligente (evita sequências longas)

### Problemas Contextualizados

Exemplo gerado por IA:

> "Cecília colheu 8 morangos fresquinhos no jardim da vovó e depois encontrou mais 5 morangos escondidos. Quantos morangos ela tem no total?"

Exemplo com template:

> "Cecília tinha 12 lápis e emprestou 5 lápis para um amigo. Quantos lápis restaram?"

## ⚙️ Configurações Avançadas

Edite o arquivo `.env`:

```env
# API Key do Google Gemini
GEMINI_API_KEY=your_api_key_here

# Habilitar/Desabilitar IA
USE_AI=true

# Quantidade de problemas
TOTAL_PROBLEMS=50

# Nível de dificuldade (easy, medium, hard)
DIFFICULTY=medium
```

## 💾 Sistema de Cache

O cache armazena contextos gerados pela IA para:
- ✅ Evitar chamadas repetidas à API
- ✅ Acelerar gerações futuras
- ✅ Funcionar offline (após primeira geração)
- ✅ Economizar quota da API

Cache é salvo em: `cache/addition/` e `cache/subtraction/`

## 📊 Níveis de Dificuldade

| Nível  | Intervalo | Características |
|--------|-----------|----------------|
| Fácil  | 1-10      | Sem reagrupamento |
| Médio  | 1-20      | Números familiares |
| Difícil| 1-50      | Números maiores |

## 📝 Exemplos de Uso

### Gerar exercício fácil sem IA

```bash
npm start -- --easy --no-ai
```

### Gerar exercício difícil com IA

```bash
npm start -- --hard --with-ai
```

### Personalizar via código

```javascript
const MathGenerator = require('./generators/mathGenerator');

const generator = new MathGenerator({
  totalProblems: 100,
  difficulty: 'medium',
  additionRatio: 0.6  // 60% adição, 40% subtração
});

const problems = generator.generateMixedProblems();
```

## 🎓 Pedagogia

Os exercícios seguem princípios pedagógicos:

- ✅ Progressão gradual de dificuldade
- ✅ Variedade de operações (evita padrões repetitivos)
- ✅ Contextualização com situações do cotidiano
- ✅ Feedback visual com emojis
- ✅ Personalização (Cecília como protagonista)
- ✅ Gamificação (níveis de conquista)

## 🔒 Segurança

O sistema implementa:

- ✅ Validação de conteúdo gerado pela IA
- ✅ Filtros de palavras inadequadas
- ✅ Verificação de respostas matemáticas
- ✅ Fallback automático para templates seguros
- ✅ Sem exposição de API keys no código

## 📄 Licença

MIT

---

**Feito com ❤️ para Cecília e todos que amam matemática!**
