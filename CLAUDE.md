# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start dev server (Next.js)
npm run build        # Production build
npm run lint         # Biome linter check
npm run format       # Biome auto-format (writes files)
npm run test         # Jest (all tests)
npm run test:watch   # Jest watch mode
npm run test:coverage # Jest with coverage report
```

Tests live in `__tests__/` and match `**/__tests__/**/*.test.js`. Run a single test file:
```bash
npx jest __tests__/myFile.test.js
```

## Code Style (Biome)

- 2-space indentation, 100-char line width, single quotes, always semicolons, ES5 trailing commas
- `noExplicitAny` and `noUnusedVariables` are errors; `useExhaustiveDependencies` is a warning
- Run `npm run format` before committing; linting is not auto-fixed by `lint`

## Architecture

### Request Flow

```
Browser → middleware.ts (locale detection/redirect)
       → app/[lang]/page.tsx (loads dictionary, renders GeneratorForm)
       → GeneratorForm.tsx (client component, form state)
       → generateExercises() server action
       → MathGeneratorService (generates raw problems)
       → AIEnhancerService / AIProviderService (contextual narratives)
       → PrintFormatterService (renders HTML string)
       → window.open() writes HTML directly into a new tab
```

### Two Parallel Server Actions

`app/actions/generateExercises.ts` and `app/[lang]/actions/generateExercises.ts` have identical schemas and logic. The `[lang]` version is the one used by the multilingual page. Both must be kept in sync when changing the Zod schema or generation logic.

### Math Generation

`MathGeneratorService.ts` has two modes:
- **digitConfigs mode** (primary): array of `{ digits, questions, operation, divisorMin?, divisorMax? }` — generates numbers in the range `[10^(digits-1), 10^digits - 1]`
- **Legacy mode**: `{ totalProblems, difficulty, additionRatio }` — delegates to `mathGenerator.js` (addition/subtraction only)

Division problems generate an exact-integer result: `dividend = divisor × quotient`; the `digits` config controls the quotient's digit range, not the dividend.

### Contextual Problem Generation

When format is `contextual` or `both`, `AIEnhancerService.generateContextualProblems()` is called:
1. Selects up to 10 problems uniformly from the full set
2. If `providerConfig` is passed → delegates to `AIProviderService.generateContextsBatchWithProvider()`
3. If no config → falls back to legacy Gemini path via env `GEMINI_API_KEY`

`AIProviderService` dispatches by provider:
- `gemini` → `AIEnhancer` class (uses `@google/generative-ai`)
- `openai` → OpenAI SDK, `baseURL: https://api.openai.com/v1`, model `gpt-4o`
- `deepseek` → OpenAI SDK, `baseURL: https://api.deepseek.com`, model `deepseek-chat`
- `ollama` → OpenAI SDK, `baseURL: http://localhost:11434/v1` (or custom), apiKey `'ollama'`
- `none` → `TemplateLibrary` directly (no AI call)

Any provider failure silently falls back to `TemplateLibrary`. API keys are passed as server action parameters — never stored or logged.

### Multilingual System

- Routes: `/pt-BR`, `/en-US`, `/es` — auto-detected from `Accept-Language` header via `middleware.ts`
- Dictionary files: `app/[lang]/dictionaries/{pt-BR,en-US,es}.json`
- The `dict` object shape is driven by the JSON structure; `GeneratorForm` receives `dict.form` as a prop and uses it for all labels, with hardcoded Portuguese fallbacks for any missing key
- **When adding UI text**: add the key to all three JSON files AND update the `dict?` prop type in `GeneratorForm.tsx`

### Template Fallback System

`TemplateLibrary` provides narrative context for all four operations (addition, subtraction, multiplication, division), organized by category (fruits, toys, animals, school). Each category has templates with `{name}`, `{num1}`, `{num2}`, `{item1}` placeholders. Names come from the 18-name pool in `lib/constants/namePool.ts`.

`AIEnhancer` validates each AI-generated context: 10–200 chars, no inappropriate words, no explicit math operators (`\d+\s*[+\-×÷]\s*\d+`), must contain a name from the pool. Generated questions must end with `?` and be 5–120 chars.

### Output Format

`PrintFormatterService` produces self-contained HTML strings referencing `/styles/exercise-print.css` (served from `public/`). The HTML is written directly into a new browser tab via `window.open('', '_blank')` + `document.write()`. There is no server-side rendering of the output page.

### Pedagogy Context

This tool generates exercises for Cecília (age 7). Content must be:
- Portuguese Brazilian, positive/encouraging tone
- Themes limited to: animals, toys, fruits/food, school materials, nature
- No answer keys shown to the student, no adult themes, no negative outcomes in narratives
