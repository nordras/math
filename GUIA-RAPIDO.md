# 🚀 Guia Rápido - Gerador de Exercícios

## Instalação (Apenas na Primeira Vez)

```bash
npm install
```

## Uso Simples

### Gerar exercícios SEM IA (recomendado para começar)

```bash
npm start
```

Isso vai gerar 4 arquivos em `adicao-subtracao/`:
- ✅ Exercício com 50 problemas (sem respostas)
- ✅ Gabarito (com respostas)
- ✅ 10 problemas contextualizados (sem respostas)
- ✅ Gabarito contextualizado (com respostas)

## Níveis de Dificuldade

```bash
# Fácil - números de 1 a 10
npm start -- --easy

# Médio - números de 1 a 20 (padrão)
npm start

# Difícil - números de 1 a 50
npm start -- --hard
```

## Usar IA (Opcional)

### 1. Obter Chave da API (Grátis)

1. Acesse: https://makersuite.google.com/app/apikey
2. Clique em "Create API Key"
3. Copie a chave gerada

### 2. Configurar

Crie um arquivo `.env` (copie de `.env.example`):

```bash
cp .env.example .env
```

Edite `.env` e cole sua chave:

```env
GEMINI_API_KEY=sua_chave_aqui
USE_AI=true
```

### 3. Gerar com IA

```bash
npm run generate:with-ai
```

## Arquivos Gerados

Todos os arquivos ficam em `adicao-subtracao/`:

```
adicao-subtracao/
├── exercicio-50-problemas-easy.md              ← Exercício fácil
├── exercicio-50-problemas-easy-gabarito.md     ← Gabarito fácil
├── exercicio-50-problemas-medium.md            ← Exercício médio
├── exercicio-50-problemas-medium-gabarito.md   ← Gabarito médio
├── exercicio-50-problemas-hard.md              ← Exercício difícil
├── exercicio-50-problemas-hard-gabarito.md     ← Gabarito difícil
└── problemas-contextualizados-*.md             ← Problemas com história
```

## Exemplos

### Gerar exercício fácil sem IA
```bash
npm start -- --easy --no-ai
```

### Gerar exercício difícil com IA
```bash
npm start -- --hard --with-ai
```

### Gerar exercício médio (padrão)
```bash
npm start
```

## Dicas

✅ **Comece sem IA** - Funciona perfeitamente com templates  
✅ **Use a IA depois** - Apenas para variar os contextos  
✅ **Cache automático** - A IA só é chamada uma vez por problema  
✅ **Grátis para sempre** - Gemini Free Tier: 1.500 requests/dia  

## Problemas?

### "Cannot find module"
```bash
npm install
```

### "API Key inválida"
- Verifique se copiou a chave completa
- Confira se está no arquivo `.env`
- Use `--no-ai` para gerar sem IA

### Números muito difíceis?
```bash
npm start -- --easy
```

### Números muito fáceis?
```bash
npm start -- --hard
```

## O Que Você Vai Ter

1. **Exercício em Grade (50 problemas)**
   ```
      5        12         8         3
   + 3      − 7       + 6       + 4
   ____     ____      ____      ____
   ```

2. **Problemas Contextualizados (10 problemas)**
   ```
   Cecília tem 5 maçãs e ganhou 3 maçãs.
   Quantos no total?
   
   Resposta: __________
   ```

3. **Gabaritos**
   - Para conferir as respostas
   - Ideal para pais/professores

## Tudo Pronto! 🎉

Agora é só rodar:

```bash
npm start
```

E os exercícios estarão em `adicao-subtracao/` prontos para imprimir!

---

**Feito com ❤️ para Cecília**
