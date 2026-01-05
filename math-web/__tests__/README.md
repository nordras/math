# Testes Unitários - Math Web

## 📋 Estrutura de Testes

```
__tests__/
├── MathGeneratorService.test.js    # Testes do serviço de geração
├── generateExercises.test.ts       # Testes do schema e validação
├── package.json                     # Dependências de teste
└── README.md                        # Este arquivo
```

## 🚀 Como Executar

### Instalar dependências
```bash
cd __tests__
npm install
cd ..
```

### Executar todos os testes
```bash
npm run test
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

### MathGeneratorService
- ✅ Validação de opções básicas
- ✅ Validação de digitConfigs
- ✅ Limites de valores (digits, questions)
- ✅ Geração de problemas por algarismos
- ✅ Operações matemáticas (adição, subtração, multiplicação, divisão)
- ✅ Operações mistas
- ✅ Geração de estatísticas
- ✅ Fallback para modo antigo

### Schema Validation
- ✅ Validação de estrutura digitConfigs
- ✅ Validação de operações válidas
- ✅ Validação de limites numéricos
- ✅ digitConfigs opcional

## 🧪 Casos de Teste Importantes

### 1. Geração de Problemas com DigitConfigs
```javascript
const options = {
  digitConfigs: [
    { digits: 2, questions: 10, operation: 'addition' },
    { digits: 3, questions: 12, operation: 'mixed' },
  ],
};
```

### 2. Validação de Limites
- **digits**: 1-5
- **questions**: 0-100
- **operation**: addition | subtraction | multiplication | division | mixed

### 3. Garantias
- Subtrações sem resultados negativos
- Divisões exatas (sem resto)
- Números com quantidade correta de algarismos

## 🐛 Problemas Resolvidos

1. **digitConfigs não processado**
   - ❌ Antes: Service ignorava digitConfigs
   - ✅ Depois: Implementado `generateFromDigitConfigs()`

2. **Validação faltando**
   - ❌ Antes: Sem validação de digitConfigs
   - ✅ Depois: Validação completa em `validateOptions()`

3. **Estatísticas incorretas**
   - ❌ Antes: Stats não incluíam novas operações
   - ✅ Depois: Stats com multiplications, divisions, digitConfigs

## 📝 Adicionar Novos Testes

1. Criar arquivo em `__tests__/`
2. Seguir padrão de nomenclatura: `*.test.js` ou `*.test.ts`
3. Usar describe/test do Jest
4. Executar `npm run test` para validar

## 🔧 Configuração

Jest está configurado em [`jest.config.js`](../jest.config.js):
- Ambiente: Node.js
- Padrão de busca: `**/__tests__/**/*.test.js`
- Cobertura: `lib/**/*.js`
