# Testes Unitários - Prototype Math

## 📋 Estrutura de Testes

```
__tests__/
├── mathGenerator.test.js       # Testes do gerador de problemas
├── templateLibrary.test.js     # Testes dos templates
├── package.json                 # Configuração Jest
└── README.md                    # Este arquivo
```

## 🚀 Como Executar

### Instalar dependências
```bash
cd prototype-math/__tests__
npm install
cd ..
```

### Executar todos os testes
```bash
cd prototype-math
npm test
```

### Executar em modo watch
```bash
npm run test:watch
```

### Executar com cobertura
```bash
npm run test:coverage
```

## 📊 Cobertura de Testes

### MathGenerator (30 testes)
#### Constructor (2 testes)
- ✅ Instância com opções padrão
- ✅ Aceita opções customizadas

#### randomInt (2 testes)
- ✅ Gera número entre min e max
- ✅ Inclui min e max como valores possíveis

#### shuffle (2 testes)
- ✅ Embaralha array
- ✅ Não modifica array original

#### generateAddition (7 testes)
- ✅ Gera problema de adição válido
- ✅ Respeita dificuldade easy (1-10)
- ✅ Respeita dificuldade medium (1-20)
- ✅ Respeita dificuldade hard (1-50)
- ✅ Gera números de 3 algarismos quando solicitado
- ✅ Tem display formatado

#### generateSubtraction (4 testes)
- ✅ Gera problema de subtração válido
- ✅ Garante resultado não-negativo
- ✅ Gera números de 3 algarismos quando solicitado
- ✅ Tem display formatado

#### generateMixedProblems (4 testes)
- ✅ Gera quantidade correta de problemas
- ✅ Respeita ratio de adição
- ✅ Inclui problemas de 3 algarismos
- ✅ Embaralha problemas

#### validateProblem (4 testes)
- ✅ Valida adição correta
- ✅ Invalida adição incorreta
- ✅ Valida subtração correta
- ✅ Invalida subtração incorreta

#### getStatistics (2 testes)
- ✅ Calcula estatísticas corretas
- ✅ Inclui difficulty das opções

### TemplateLibrary (18 testes)
#### Constructor (3 testes)
- ✅ Inicializa com contextos de adição e subtração
- ✅ Tem categorias de contextos
- ✅ Tem itens para cada categoria

#### getContext (7 testes)
- ✅ Retorna contexto para adição
- ✅ Retorna contexto para subtração
- ✅ Inclui números no contexto
- ✅ Retorna contextos diferentes para múltiplas chamadas
- ✅ Funciona com números grandes
- ✅ Usa fallback para tipo desconhecido

#### formatContext (4 testes)
- ✅ Substitui placeholders num1 e num2
- ✅ Substitui placeholder item1
- ✅ Mantém template se item não fornecido
- ✅ Funciona com múltiplos placeholders do mesmo tipo

#### Variedade de contextos (6 testes)
- ✅ Múltiplos templates de adição para frutas
- ✅ Múltiplos templates de subtração para brinquedos
- ✅ Itens variados para frutas
- ✅ Itens variados para brinquedos
- ✅ Itens variados para animais
- ✅ Itens variados para escola

#### Integração (2 testes)
- ✅ Gera contexto válido para problema de adição
- ✅ Gera contexto válido para problema de subtração

## 🎯 Total
- **48 testes** passando
- **Cobertura:** generators/mathGenerator.js e generators/templateLibrary.js

## 📝 Exemplos de Uso

### Testar geração de problemas
```javascript
const generator = new MathGenerator({ totalProblems: 20 });
const problems = generator.generateMixedProblems();
// Retorna array com 20 problemas mistos
```

### Testar templates
```javascript
const library = new TemplateLibrary();
const context = library.getContext('addition', 15, 8);
// Retorna: "Cecília colheu 15 maçãs e depois colheu mais 8 maçãs."
```

## 🔧 Configuração Jest

Jest configurado em `package.json`:
- Ambiente: Node.js
- Padrão de busca: `**/__tests__/**/*.test.js`
- Cobertura: `generators/`, `templates/`, `utils/`

## 🐛 Bugs Encontrados e Corrigidos

Durante os testes, garantimos que:
1. Subtrações sempre resultam em valores não-negativos
2. Números de 3 algarismos estão no range 100-999
3. Shuffle não modifica array original
4. Templates incluem corretamente os números

## 📈 Próximos Passos

1. ✅ Testes para MathGenerator
2. ✅ Testes para TemplateLibrary
3. ⏳ Testes para AIEnhancer (se necessário)
4. ⏳ Testes de integração end-to-end
