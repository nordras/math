# 📐 Arquitetura do Sistema - Gerador de Exercícios de Matemática

## Visão Geral do Sistema

Este documento descreve a arquitetura completa do sistema de geração de exercícios matemáticos com IA.

## Diagrama de Arquitetura

```mermaid
graph TB
    subgraph "Frontend - Next.js App Router"
        A[app/page.tsx<br/>Landing Page] --> B[components/GeneratorForm.tsx<br/>Formulário de Configuração]
        B --> C[app/actions/generateExercises.ts<br/>Server Action]
        D[app/exercise/id/page.tsx<br/>Visualização de Exercícios]
    end

    subgraph "Camada de Serviços"
        C --> E[MathGeneratorService<br/>Geração de Problemas]
        C --> F[AIEnhancerService<br/>Contextualização com IA]
        C --> G[HTMLFormatterService<br/>Formatação HTML]
        C --> H[ExerciseCache<br/>Sistema de Cache]
    end

    subgraph "Geradores e Utilitários"
        E --> I[mathGenerator.js<br/>Lógica Matemática]
        F --> J[aiEnhancer.js<br/>Integração Gemini API]
        F --> K[templateLibrary.js<br/>Templates Fallback]
        I --> L[namePool.ts<br/>18 Nomes Multilíngues]
    end

    subgraph "Dados e Configuração"
        H --> M[(Cache em Memória<br/>Exercícios Gerados)]
        N[.env.local<br/>GEMINI_API_KEY]
        J --> N
    end

    B -->|Submete Configuração| C
    C -->|Gera ID único| O[nanoid]
    C -->|Retorna ID| D
    D -->|Busca no Cache| H
    H -->|HTML Renderizado| D

    style A fill:#e1f5ff
    style B fill:#e1f5ff
    style D fill:#e1f5ff
    style C fill:#fff4e6
    style E fill:#f0f9ff
    style F fill:#f0f9ff
    style G fill:#f0f9ff
    style H fill:#f0f9ff
    style I fill:#f5f5f5
    style J fill:#f5f5f5
    style K fill:#f5f5f5
    style L fill:#f5f5f5
    style M fill:#ffe6e6
    style N fill:#ffe6e6
```

## Fluxo de Geração de Exercícios

```mermaid
sequenceDiagram
    participant User as Usuário
    participant Form as GeneratorForm
    participant Action as generateExercises<br/>(Server Action)
    participant Math as MathGeneratorService
    participant AI as AIEnhancerService
    participant HTML as HTMLFormatterService
    participant Cache as ExerciseCache
    participant Page as Exercise Page

    User->>Form: Configura exercícios<br/>(dígitos, operações, formato)
    Form->>Action: generateExercises(input)
    
    Action->>Action: Valida input com Zod
    Action->>Action: getRandomName() se necessário
    
    Action->>Math: generateProblems(options)
    Math-->>Action: {problems, stats}
    
    alt Formato = Grid ou Both
        Action->>HTML: formatGrid(problems, stats)
        HTML-->>Action: gridHtml
        Action->>Cache: set(gridId, data)
    end
    
    alt Formato = Contextual ou Both
        alt useAI = true
            Action->>AI: generateContextualProblems(problems)
            AI->>AI: Chama Gemini API
            AI-->>Action: contextualProblems
        else useAI = false
            Action->>Action: Usa templateLibrary
        end
        Action->>HTML: formatContextual(problems, stats)
        HTML-->>Action: contextualHtml
        Action->>Cache: set(contextualId, data)
    end
    
    Action-->>Form: {success, exerciseId(s)}
    Form->>Page: window.open(/exercise/[id])
    Page->>Cache: getExerciseCache().get(id)
    Cache-->>Page: {html, stats, options}
    Page-->>User: Exibe exercícios formatados
```

## Fluxo de Dados - Configuração de Dígitos

```mermaid
flowchart LR
    A[Input do Usuário] --> B{digitConfigs?}
    
    B -->|Sim| C[Modo Configuração<br/>de Dígitos]
    B -->|Não| D[Modo Legado]
    
    C --> E[Para cada config:<br/>- digits<br/>- questions<br/>- operation<br/>- divisorMin/Max]
    
    E --> F[generateFromDigitConfigs]
    D --> G[generateMixedProblems]
    
    F --> H[Problemas Gerados]
    G --> H
    
    H --> I[Estatísticas<br/>- totalProblems<br/>- por operação]
    
    style A fill:#e1f5ff
    style C fill:#d4edda
    style D fill:#fff3cd
    style H fill:#d1ecf1
    style I fill:#d1ecf1
```

## Estrutura de Componentes

```mermaid
graph TD
    A[app/layout.tsx<br/>Layout Global] --> B[app/page.tsx<br/>Home Page]
    B --> C[GeneratorForm.tsx<br/>Formulário Principal]
    
    C --> D{Configurações}
    D --> E[Digit Configs<br/>Array de configurações]
    D --> F[Opções Gerais<br/>useAI, format, etc]
    
    E --> G[Config Item<br/>- digits: number<br/>- questions: number<br/>- operation: enum<br/>- divisorMin/Max: number]
    
    H[app/exercise/id/page.tsx] --> I{Tipo de Exercício}
    I --> J[Grid Format<br/>Formato compacto]
    I --> K[Contextual Format<br/>Problemas narrativos]
    
    style A fill:#f8f9fa
    style B fill:#e1f5ff
    style C fill:#fff4e6
    style H fill:#e1f5ff
    style J fill:#d4edda
    style K fill:#d4edda
```

## Camadas do Sistema

### 1. Camada de Apresentação (Frontend)
- **Next.js 16** com App Router
- **React 19** com Server Components
- **TailwindCSS + DaisyUI** para estilização
- **Zod** para validação de formulários

### 2. Camada de Negócio (Services)
- **MathGeneratorService**: Orquestra geração de problemas matemáticos
- **AIEnhancerService**: Integração com Google Gemini API
- **HTMLFormatterService**: Formata saída em HTML pronto para impressão
- **ExerciseCache**: Cache em memória com TTL

### 3. Camada de Dados
- **Cache em memória**: Map com TTL de 24h
- **Gemini API**: Fonte externa para geração de contextos narrativos
- **Name Pool**: 18 nomes multilíngues (PT/EN)

## Tipos de Dados Principais

```typescript
// DigitConfig - Configuração por nível de dígitos
{
  digits: number,          // 1-5 dígitos
  questions: number,       // Quantidade de questões
  operation: Operation,    // Tipo de operação
  divisorMin?: number,     // Divisor mínimo (divisão)
  divisorMax?: number      // Divisor máximo (divisão)
}

// MathProblem - Problema individual
{
  num1: number,
  num2: number,
  operation: Operation,
  answer: number
}

// MathStats - Estatísticas dos exercícios
{
  totalProblems: number,
  additions: number,
  subtractions: number,
  multiplications: number,
  divisions: number
}

// CachedExercise - Exercício em cache
{
  type: 'grid' | 'contextual',
  html: string,
  stats: MathStats,
  options: GenerateExercisesInput
}
```

## Tecnologias e Dependências

### Principais
- **Next.js 16**: Framework React com SSR
- **React 19**: Biblioteca UI
- **TypeScript**: Type safety
- **Zod**: Schema validation
- **@google/generative-ai**: Integração Gemini
- **nanoid**: Geração de IDs únicos

### Dev Tools
- **Biome**: Linter e formatter
- **Jest**: Testes unitários
- **TailwindCSS**: Estilização

## Padrões de Arquitetura

1. **Server Actions**: Comunicação cliente-servidor type-safe
2. **Service Layer**: Separação de responsabilidades
3. **Cache Pattern**: Otimização de performance
4. **Factory Pattern**: Geração de problemas configurável
5. **Strategy Pattern**: Múltiplos formatos de saída

## Segurança e Performance

- **Server-side validation**: Zod schemas em Server Actions
- **Cache com TTL**: Evita consumo excessivo de memória
- **API Key protection**: Variáveis de ambiente (.env.local)
- **Error boundaries**: Tratamento robusto de erros
- **Rate limiting**: Controlado pela Gemini API

## Extensibilidade

O sistema foi projetado para fácil extensão:

1. **Novos tipos de operações**: Adicionar em `Operation` enum
2. **Novos formatos**: Implementar em `HTMLFormatterService`
3. **Novas fontes de IA**: Abstrair `AIEnhancerService`
4. **Novos idiomas**: Expandir `namePool.ts`
5. **Persistência**: Substituir cache em memória por DB

## API Routes

```
GET  /                        - Landing page com formulário
POST /actions/generateExercises - Server Action (geração)
GET  /exercise/[id]           - Visualização de exercício
GET  /api/cache               - API de gerenciamento de cache
```

---

**Última atualização**: Janeiro 2026  
**Versão**: 0.1.0
