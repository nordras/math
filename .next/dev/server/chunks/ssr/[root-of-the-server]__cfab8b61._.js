module.exports = [
"[externals]/node:crypto [external] (node:crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:crypto", () => require("node:crypto"));

module.exports = mod;
}),
"[project]/lib/generators/mathGenerator.js [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
/**
 * Gerador Matemático Puro
 * Gera problemas de adição e subtração sem envolvimento de IA
 * Toda a lógica matemática é controlada e validada
 */ class MathGenerator {
    constructor(options = {}){
        this.options = {
            totalProblems: options.totalProblems || 50,
            additionRatio: options.additionRatio || 0.5,
            difficulty: options.difficulty || 'medium',
            avoidSequenceLength: options.avoidSequenceLength || 4,
            threeDigitRatio: options.threeDigitRatio || 0.25,
            ...options
        };
        this.difficultyLevels = {
            easy: {
                min: 1,
                max: 10,
                allowNegative: false
            },
            medium: {
                min: 1,
                max: 20,
                allowNegative: false
            },
            hard: {
                min: 1,
                max: 50,
                allowNegative: false
            }
        };
    }
    /**
   * Gera um número aleatório entre min e max (inclusivo)
   */ randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    /**
   * Embaralha um array usando Fisher-Yates 
   * https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle
   * https://youtu.be/4zx5bM2OcvA
   */ shuffle(array) {
        const shuffled = [
            ...array
        ];
        for(let i = shuffled.length - 1; i > 0; i--){
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [
                shuffled[j],
                shuffled[i]
            ];
        }
        return shuffled;
    }
    /**
   * Gera um problema de adição
   */ generateAddition(difficulty = 'medium', useThreeDigits = false) {
        const range = this.difficultyLevels[difficulty];
        let num1, num2;
        if (useThreeDigits) {
            // Números de 3 algarismos (100-999)
            num1 = this.randomInt(100, 999);
            num2 = this.randomInt(100, 999);
        } else {
            num1 = this.randomInt(range.min, range.max);
            num2 = this.randomInt(range.min, range.max);
        }
        return {
            type: 'addition',
            operation: '+',
            num1,
            num2,
            answer: num1 + num2,
            difficulty,
            threeDigits: useThreeDigits,
            display: `${num1} + ${num2}`
        };
    }
    /**
   * Gera um problema de subtração
   * Garante que o resultado seja sempre positivo (ou zero)
   */ generateSubtraction(difficulty = 'medium', useThreeDigits = false) {
        const range = this.difficultyLevels[difficulty];
        let num1, num2;
        if (useThreeDigits) {
            // Números de 3 algarismos (100-999)
            num1 = this.randomInt(100, 999);
            const maxNum2 = num1; // Garantir resultado positivo
            num2 = this.randomInt(100, maxNum2);
        } else {
            num1 = this.randomInt(range.min, range.max);
            const maxNum2 = range.allowNegative ? range.max : num1;
            num2 = this.randomInt(range.min, maxNum2);
        }
        return {
            type: 'subtraction',
            operation: '−',
            num1,
            num2,
            answer: num1 - num2,
            difficulty,
            threeDigits: useThreeDigits,
            display: `${num1} − ${num2}`
        };
    }
    /**
   * Gera um conjunto de problemas mistos
   */ generateMixedProblems() {
        const { totalProblems, additionRatio, difficulty, threeDigitRatio } = this.options;
        const problems = [];
        // Calcular quantos problemas de cada tipo
        const additionCount = Math.floor(totalProblems * additionRatio);
        const subtractionCount = totalProblems - additionCount;
        // Calcular quantos problemas terão 3 algarismos
        const threeDigitTotal = Math.floor(totalProblems * threeDigitRatio);
        const threeDigitAddition = Math.floor(threeDigitTotal * additionRatio);
        const threeDigitSubtraction = threeDigitTotal - threeDigitAddition;
        // Gerar problemas de adição
        for(let i = 0; i < additionCount; i++){
            const useThreeDigits = i < threeDigitAddition;
            problems.push(this.generateAddition(difficulty, useThreeDigits));
        }
        // Gerar problemas de subtração
        for(let i = 0; i < subtractionCount; i++){
            const useThreeDigits = i < threeDigitSubtraction;
            problems.push(this.generateSubtraction(difficulty, useThreeDigits));
        }
        // Embaralhar
        let shuffled = this.shuffle(problems);
        // Evitar sequências longas da mesma operação
        shuffled = this.avoidLongSequences(shuffled);
        // Adicionar número de ordem
        shuffled.forEach((problem, index)=>{
            problem.number = index + 1;
        });
        return shuffled;
    }
    /**
   * Evita sequências longas da mesma operação
   * Por exemplo, evita mais de 3 adições seguidas
   */ avoidLongSequences(problems) {
        const maxSequence = this.options.avoidSequenceLength;
        const result = [
            ...problems
        ];
        for(let i = 0; i < result.length - maxSequence; i++){
            // Contar quantos do mesmo tipo em sequência
            let count = 1;
            const currentType = result[i].type;
            for(let j = i + 1; j < result.length && j < i + maxSequence; j++){
                if (result[j].type === currentType) {
                    count++;
                } else {
                    break;
                }
            }
            // Se encontrou uma sequência muito longa, fazer swap
            if (count >= maxSequence) {
                // Procurar próximo elemento de tipo diferente
                for(let k = i + maxSequence; k < result.length; k++){
                    if (result[k].type !== currentType) {
                        // Swap
                        const temp = result[i + maxSequence - 1];
                        result[i + maxSequence - 1] = result[k];
                        result[k] = temp;
                        break;
                    }
                }
            }
        }
        return result;
    }
    /**
   * Valida se um problema está correto
   */ validateProblem(problem) {
        const { num1, num2, answer, type } = problem;
        if (type === 'addition') {
            return num1 + num2 === answer;
        } else if (type === 'subtraction') {
            return num1 - num2 === answer;
        }
        return false;
    }
    /**
   * Gera estatísticas sobre os problemas gerados
   */ getStatistics(problems) {
        const stats = {
            total: problems.length,
            addition: 0,
            subtraction: 0,
            threeDigits: 0,
            difficulty: this.options.difficulty,
            maxAnswer: 0,
            minAnswer: Infinity,
            avgAnswer: 0
        };
        let sumAnswers = 0;
        problems.forEach((problem)=>{
            if (problem.type === 'addition') stats.addition++;
            if (problem.type === 'subtraction') stats.subtraction++;
            if (problem.threeDigits) stats.threeDigits++;
            stats.maxAnswer = Math.max(stats.maxAnswer, problem.answer);
            stats.minAnswer = Math.min(stats.minAnswer, problem.answer);
            sumAnswers += problem.answer;
        });
        stats.avgAnswer = Math.round(sumAnswers / problems.length);
        return stats;
    }
}
const __TURBOPACK__default__export__ = MathGenerator;
}),
"[project]/lib/services/MathGeneratorService.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Service for generating math problems
 * Encapsulates MathGenerator business logic
 */ __turbopack_context__.s([
    "MathGeneratorService",
    ()=>MathGeneratorService
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$generators$2f$mathGenerator$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/generators/mathGenerator.js [app-rsc] (ecmascript)");
;
class MathGeneratorService {
    static generateProblems(options) {
        const { totalProblems = 50, difficulty = 'medium', additionRatio = 0.5, digitConfigs = null } = options;
        // If digitConfigs was provided, generate problems based on it
        if (digitConfigs && Array.isArray(digitConfigs) && digitConfigs.length > 0) {
            return this.generateFromDigitConfigs(digitConfigs);
        }
        // Fallback to old mode
        const generator = new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$generators$2f$mathGenerator$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"]({
            totalProblems,
            difficulty,
            additionRatio
        });
        const problems = generator.generateMixedProblems();
        const stats = generator.getStatistics(problems);
        return {
            problems,
            stats
        };
    }
    static generateFromDigitConfigs(digitConfigs) {
        const allProblems = [];
        for (const config of digitConfigs){
            const { digits, questions, operation } = config;
            if (questions <= 0) continue;
            // Determine range based on digits
            const min = Math.pow(10, digits - 1);
            const max = Math.pow(10, digits) - 1;
            for(let i = 0; i < questions; i++){
                const num1 = Math.floor(Math.random() * (max - min + 1)) + min;
                const num2 = Math.floor(Math.random() * (max - min + 1)) + min;
                let problemType;
                if (operation === 'mixed') {
                    const operations = [
                        'addition',
                        'subtraction',
                        'multiplication',
                        'division'
                    ];
                    problemType = operations[Math.floor(Math.random() * operations.length)];
                } else {
                    problemType = operation;
                }
                let problem;
                switch(problemType){
                    case 'addition':
                        problem = {
                            num1,
                            num2,
                            type: 'addition',
                            operation: `${num1} + ${num2}`,
                            answer: num1 + num2
                        };
                        break;
                    case 'subtraction':
                        const [larger, smaller] = num1 >= num2 ? [
                            num1,
                            num2
                        ] : [
                            num2,
                            num1
                        ];
                        problem = {
                            num1: larger,
                            num2: smaller,
                            type: 'subtraction',
                            operation: `${larger} - ${smaller}`,
                            answer: larger - smaller
                        };
                        break;
                    case 'multiplication':
                        problem = {
                            num1,
                            num2,
                            type: 'multiplication',
                            operation: `${num1} × ${num2}`,
                            answer: num1 * num2
                        };
                        break;
                    case 'division':
                        const divisorMin = config.divisorMin || 1;
                        const divisorMax = config.divisorMax || 10;
                        const divisor = Math.floor(Math.random() * (divisorMax - divisorMin + 1)) + divisorMin;
                        const quotient = Math.floor(Math.random() * (max - min + 1)) + min;
                        const dividend = divisor * quotient;
                        problem = {
                            num1: dividend,
                            num2: divisor,
                            type: 'division',
                            operation: `${dividend} ÷ ${divisor}`,
                            answer: quotient
                        };
                        break;
                    default:
                        problem = {
                            num1,
                            num2,
                            type: 'addition',
                            operation: `${num1} + ${num2}`,
                            answer: num1 + num2
                        };
                }
                allProblems.push(problem);
            }
        }
        // Calculate statistics
        const stats = {
            totalProblems: allProblems.length,
            additions: allProblems.filter((p)=>p.type === 'addition').length,
            subtractions: allProblems.filter((p)=>p.type === 'subtraction').length,
            multiplications: allProblems.filter((p)=>p.type === 'multiplication').length,
            divisions: allProblems.filter((p)=>p.type === 'division').length,
            difficulty: 'custom',
            digitConfigs: digitConfigs
        };
        return {
            problems: allProblems,
            stats
        };
    }
    static validateOptions(options) {
        const validDifficulties = [
            'easy',
            'medium',
            'hard'
        ];
        const { totalProblems, difficulty, additionRatio, digitConfigs } = options;
        const validated = {
            totalProblems: Math.max(1, Math.min(200, totalProblems || 50)),
            difficulty: validDifficulties.includes(difficulty) ? difficulty : 'medium',
            additionRatio: Math.max(0, Math.min(1, additionRatio || 0.5))
        };
        if (digitConfigs && Array.isArray(digitConfigs)) {
            validated.digitConfigs = digitConfigs.map((config)=>({
                    digits: Math.max(1, Math.min(5, config.digits || 2)),
                    questions: Math.max(0, Math.min(100, config.questions || 10)),
                    operation: [
                        'addition',
                        'subtraction',
                        'multiplication',
                        'division',
                        'mixed'
                    ].includes(config.operation) ? config.operation : 'addition',
                    divisorMin: config.divisorMin !== undefined ? Math.max(1, Math.min(100, config.divisorMin)) : 1,
                    divisorMax: config.divisorMax !== undefined ? Math.max(1, Math.min(100, config.divisorMax)) : 10
                }));
        }
        return validated;
    }
}
}),
"[project]/lib/constants/namePool.js [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Multilingual name pool for math exercises
 * Names selected to work well in both Portuguese and English
 */ __turbopack_context__.s([
    "NAME_POOL",
    ()=>NAME_POOL,
    "containsAnyName",
    ()=>containsAnyName,
    "getAllNamesString",
    ()=>getAllNamesString,
    "getConsistentName",
    ()=>getConsistentName,
    "getRandomName",
    ()=>getRandomName,
    "getRandomNames",
    ()=>getRandomNames
]);
const NAME_POOL = [
    // Feminine names
    {
        name: 'Luna',
        gender: 'feminine'
    },
    {
        name: 'Maya',
        gender: 'feminine'
    },
    {
        name: 'Nina',
        gender: 'feminine'
    },
    {
        name: 'Mia',
        gender: 'feminine'
    },
    {
        name: 'Jade',
        gender: 'feminine'
    },
    {
        name: 'Lara',
        gender: 'feminine'
    },
    {
        name: 'Sofia',
        gender: 'feminine'
    },
    {
        name: 'Ana',
        gender: 'feminine'
    },
    {
        name: 'Emma',
        gender: 'feminine'
    },
    // Masculine names
    {
        name: 'Leo',
        gender: 'masculine'
    },
    {
        name: 'Noah',
        gender: 'masculine'
    },
    {
        name: 'Davi',
        gender: 'masculine'
    },
    {
        name: 'Kai',
        gender: 'masculine'
    },
    {
        name: 'Lucas',
        gender: 'masculine'
    },
    {
        name: 'Theo',
        gender: 'masculine'
    },
    {
        name: 'Samuel',
        gender: 'masculine'
    },
    {
        name: 'Enzo',
        gender: 'masculine'
    },
    {
        name: 'Miguel',
        gender: 'masculine'
    }
];
function getRandomName(gender, seed) {
    const filteredPool = gender ? NAME_POOL.filter((n)=>n.gender === gender) : NAME_POOL;
    if (seed !== undefined) {
        // Deterministic randomization using seed
        const index = seed % filteredPool.length;
        return filteredPool[index].name;
    }
    // True randomization
    const randomIndex = Math.floor(Math.random() * filteredPool.length);
    return filteredPool[randomIndex].name;
}
function getRandomNames(count, gender) {
    const filteredPool = gender ? NAME_POOL.filter((n)=>n.gender === gender) : NAME_POOL;
    const shuffled = [
        ...filteredPool
    ].sort(()=>Math.random() - 0.5);
    return shuffled.slice(0, Math.min(count, shuffled.length)).map((n)=>n.name);
}
function getConsistentName(id, gender) {
    const filteredPool = gender ? NAME_POOL.filter((n)=>n.gender === gender) : NAME_POOL;
    // Generate simple hash from ID
    const hash = typeof id === 'string' ? id.split('').reduce((acc, char)=>acc + char.charCodeAt(0), 0) : id;
    const index = hash % filteredPool.length;
    return filteredPool[index].name;
}
function getAllNamesString() {
    return NAME_POOL.map((n)=>n.name).join(', ');
}
function containsAnyName(text) {
    const lowerText = text.toLowerCase();
    return NAME_POOL.some((n)=>lowerText.includes(n.name.toLowerCase()));
}
}),
"[project]/lib/generators/templateLibrary.js [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
/**
 * Template Library
 * Fallback templates for when AI is not available
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2f$namePool$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/constants/namePool.js [app-rsc] (ecmascript)");
;
class TemplateLibrary {
    constructor(){
        this.contexts = {
            addition: {
                fruits: [
                    '{name} colheu {num1} {item1} e depois colheu mais {num2} {item1}.',
                    'Há {num1} {item1} em uma cesta e {num2} {item1} em outra cesta.',
                    '{name} ganhou {num1} {item1} de sua avó e {num2} {item1} de seu tio.'
                ],
                toys: [
                    '{name} tem {num1} {item1} e ganhou mais {num2} {item1}.',
                    'No quarto de {name} há {num1} {item1} e ela comprou mais {num2} {item1}.',
                    '{name} organizou {num1} {item1} em uma prateleira e {num2} {item1} em outra.'
                ],
                animals: [
                    'No jardim, {name} viu {num1} {item1} pela manhã e {num2} {item1} à tarde.',
                    '{name} contou {num1} {item1} em uma árvore e {num2} {item1} em outra.',
                    'No parque há {num1} {item1} e chegaram mais {num2} {item1}.'
                ],
                school: [
                    '{name} tem {num1} {item1} e sua amiga emprestou {num2} {item1}.',
                    'Na mochila de {name} há {num1} {item1} e ela colocou mais {num2} {item1}.',
                    '{name} organizou {num1} {item1} na estante e depois mais {num2} {item1}.'
                ]
            },
            subtraction: {
                fruits: [
                    '{name} tinha {num1} {item1} e comeu {num2} {item1}.',
                    'Havia {num1} {item1} na fruteira e {name} pegou {num2} {item1}.',
                    '{name} colheu {num1} {item1} e deu {num2} {item1} para sua irmã.'
                ],
                toys: [
                    '{name} tinha {num1} {item1} e doou {num2} {item1}.',
                    'No quarto havia {num1} {item1} e {name} guardou {num2} {item1}.',
                    '{name} tinha {num1} {item1} e perdeu {num2} {item1}.'
                ],
                animals: [
                    '{name} viu {num1} {item1} no jardim e {num2} {item1} voaram.',
                    'Havia {num1} {item1} no lago e {num2} {item1} nadaram para longe.',
                    'No parque tinha {num1} {item1} e {num2} {item1} foram embora.'
                ],
                school: [
                    '{name} tinha {num1} {item1} e emprestou {num2} {item1} para um amigo.',
                    'Na mochila havia {num1} {item1} e {name} usou {num2} {item1}.',
                    '{name} tinha {num1} {item1} e deu {num2} {item1} para seu professor.'
                ]
            }
        };
        this.items = {
            fruits: [
                'maçãs 🍎',
                'morangos 🍓',
                'bananas 🍌',
                'laranjas 🍊',
                'uvas 🍇'
            ],
            toys: [
                'carrinhos 🚗',
                'bonecas 🎀',
                'bolas ⚽',
                'blocos 🧱',
                'ursinhos 🧸'
            ],
            animals: [
                'borboletas 🦋',
                'passarinhos 🐦',
                'coelhos 🐰',
                'gatinhos 🐱',
                'cachorrinhos 🐶'
            ],
            school: [
                'lápis ✏️',
                'livros 📚',
                'cadernos 📓',
                'canetas 🖊️',
                'borrachas'
            ]
        };
    }
    /**
   * Selects a random item from an array
   */ randomChoice(array) {
        return array[Math.floor(Math.random() * array.length)];
    }
    /**
   * Generates a context for a problem
   */ getContext(operation, num1, num2) {
        // Get a random name from the pool
        const name = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2f$namePool$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getRandomName"])();
        // Select random category
        const categories = Object.keys(this.contexts[operation]);
        const category = this.randomChoice(categories);
        // Select random template
        const templates = this.contexts[operation][category];
        const template = this.randomChoice(templates);
        // Select random item
        const items = this.items[category];
        const item = this.randomChoice(items);
        // Replace placeholders
        const context = template.replace(/{name}/g, name).replace(/{num1}/g, num1).replace(/{num2}/g, num2).replace(/{item1}/g, item);
        return context;
    }
    /**
   * Generates a complete contextualized problem
   */ generateWordProblem(problem) {
        const context = this.getContext(problem.type, problem.num1, problem.num2);
        const question = problem.type === 'addition' ? 'Quantos no total?' : 'Quantos restaram?';
        return {
            context,
            question,
            answer: problem.answer
        };
    }
}
const __TURBOPACK__default__export__ = TemplateLibrary;
}),
"[project]/lib/generators/aiEnhancer.js [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
/**
 * AI Enhancer - Google Gemini Integration
 * Generates diverse narrative contexts for math problems
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$google$2f$generative$2d$ai$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@google/generative-ai/dist/index.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$generators$2f$templateLibrary$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/generators/templateLibrary.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2f$namePool$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/constants/namePool.js [app-rsc] (ecmascript)");
;
;
;
class AIEnhancer {
    constructor(apiKey, options = {}){
        this.apiKey = apiKey;
        this.enabled = !!apiKey;
        this.templateLibrary = new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$generators$2f$templateLibrary$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"]();
        this.options = {
            model: options.model || 'gemini-flash-latest',
            maxRetries: options.maxRetries || 3,
            temperature: options.temperature || 0.7,
            baseDelay: options.baseDelay || 1000,
            maxDelay: options.maxDelay || 60000,
            requestsPerMinute: options.requestsPerMinute || 10,
            ...options
        };
        // Rate limiting control
        this.lastRequestTime = 0;
        this.requestCount = 0;
        this.quotaExceeded = false;
        this.quotaResetTime = null;
        if (this.enabled) {
            this.genAI = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$google$2f$generative$2d$ai$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["GoogleGenerativeAI"](apiKey);
            this.model = this.genAI.getGenerativeModel({
                model: this.options.model
            });
        }
    }
    /**
   * Creates a structured prompt for Gemini
   */ createPrompt(problem, characterName = null) {
        const name = characterName || (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2f$namePool$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getRandomName"])();
        const operation = problem.type === 'addition' ? 'adição' : 'subtração';
        const action = problem.type === 'addition' ? 'juntar, ganhar, somar' : 'tirar, dar, perder, usar';
        return `Você é um assistente educacional criando problemas de matemática para crianças brasileiras.

CONTEXTO DO PROBLEMA:
- Operação: ${operation} (${problem.num1} ${problem.operation} ${problem.num2})
- Resposta: ${problem.answer}
- Personagem: ${name} (criança brasileira, 7-9 anos)

REGRAS ESTRITAS:
1. Use APENAS português brasileiro informal e acolhedor
2. Crie UMA única frase curta (máximo 20 palavras) sobre ${name}
3. Use ações relacionadas a: ${action}
4. Tom POSITIVO e ALEGRE
5. Contextos permitidos: brinquedos, frutas, material escolar, animais fofos, natureza
6. DEVE incluir os números ${problem.num1} e ${problem.num2} na história
7. NÃO inclua a operação matemática (+, −, =)
8. NÃO inclua perguntas ou respostas
9. NÃO use palavras negativas: triste, perdeu (se evitável), quebrou, machucou

TEMAS SUGERIDOS:
🎨 Brinquedos: carrinhos, bonecas, blocos, bolas, ursinhos
🍎 Frutas: maçãs, morangos, bananas, laranjas
📚 Escola: lápis, livros, cadernos, figurinhas
🦋 Animais: borboletas, passarinhos, coelhos, gatinhos
🌸 Natureza: flores, estrelas, árvores

EXEMPLOS DE SAÍDA:
"${name} tinha ${problem.num1} figurinhas e ganhou mais ${problem.num2} figurinhas da amiga."
"${name} tem ${problem.num1} lápis de cor e comprou ${problem.num2} lápis novos."
"${name} colheu ${problem.num1} morangos no jardim e deu ${problem.num2} morangos para a vovó."

Agora crie APENAS a frase narrativa com o personagem ${name} (usando os números ${problem.num1} e ${problem.num2}):`;
    }
    /**
   * Creates a batch prompt for multiple problems
   */ createBatchPrompt(problems, characterNames = []) {
        const namesUsed = characterNames.length > 0 ? characterNames : problems.map(()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2f$namePool$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getRandomName"])());
        const namesString = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2f$namePool$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getAllNamesString"])();
        return `Você é um assistente educacional criando problemas de matemática para crianças brasileiras.

CONTEXTO GERAL:
- Use APENAS estes nomes de personagens: ${namesString}
- Para cada problema, use o nome especificado
- Temas: brinquedos, frutas, material escolar, animais fofos, natureza

REGRAS ESTRITAS:
1. Use APENAS português brasileiro informal e acolhedor
2. Crie UMA única frase curta (máximo 20 palavras) para CADA problema
3. Tom POSITIVO e ALEGRE
4. DEVE incluir os números específicos na história
5. NÃO inclua operação matemática (+, −, =)
6. NÃO inclua perguntas ou respostas
7. NÃO use palavras negativas: triste, perdeu (se evitável), quebrou, machucou
8. VARIE os temas entre os problemas (não repita contextos similares)

Crie uma frase narrativa para CADA um dos ${problems.length} problemas abaixo.
Retorne APENAS as frases, uma por linha, numeradas de 1 a ${problems.length}:

${problems.map((p, i)=>{
            const operation = p.type === 'addition' ? 'adição' : 'subtração';
            const action = p.type === 'addition' ? 'ganhar/juntar' : 'dar/usar';
            return `${i + 1}. Operação: ${operation} (${p.num1} ${p.operation} ${p.num2}) - Ação: ${action}`;
        }).join('\n')}

FORMATO DE SAÍDA OBRIGATÓRIO:
1. [frase para o problema 1]
2. [frase para o problema 2]
3. [frase para o problema 3]
... e assim por diante`;
    }
    /**
   * Waits minimum interval between requests to respect rate limits
   */ async waitForRateLimit() {
        const now = Date.now();
        const minInterval = 60 * 1000 / this.options.requestsPerMinute; // Minimum interval between requests
        const timeSinceLastRequest = now - this.lastRequestTime;
        if (timeSinceLastRequest < minInterval) {
            const waitTime = minInterval - timeSinceLastRequest;
            await this.sleep(waitTime);
        }
        this.lastRequestTime = Date.now();
    }
    /**
   * Extracts retry time from 429 error message
   */ extractRetryTime(errorMessage) {
        // Try to extract seconds "retry in 57.247271744s" or "Please retry in 57s"
        const secondsMatch = errorMessage.match(/retry in (\d+(?:\.\d+)?)\s*s/i);
        if (secondsMatch) {
            return Date.now() + parseFloat(secondsMatch[1]) * 1000;
        }
        // Default: 60 seconds
        return Date.now() + 60000;
    }
    /**
   * Generates a context using AI with retry and exponential backoff
   */ async generateContext(problem) {
        if (!this.enabled) {
            return this.templateLibrary.getContext(problem.type, problem.num1, problem.num2);
        }
        // If quota exceeded, check if reset time has passed
        if (this.quotaExceeded && this.quotaResetTime) {
            const now = Date.now();
            if (now < this.quotaResetTime) {
                const waitSeconds = Math.ceil((this.quotaResetTime - now) / 1000);
                console.warn(`⚠️  Quota exceeded. Reset in ${waitSeconds}s. Using template.`);
                return this.templateLibrary.getContext(problem.type, problem.num1, problem.num2);
            } else {
                // Reset quota
                this.quotaExceeded = false;
                this.quotaResetTime = null;
            }
        }
        let lastError = null;
        for(let attempt = 0; attempt < this.options.maxRetries; attempt++){
            try {
                // Rate limiting: wait between requests
                await this.waitForRateLimit();
                const prompt = this.createPrompt(problem);
                const result = await this.model.generateContent(prompt);
                const response = await result.response;
                let text = response.text().trim();
                // Remove quotes if they exist
                text = text.replace(/^["']|["']$/g, '');
                // Increment successful requests counter
                this.requestCount++;
                if (this.validateContext(text)) {
                    return text;
                } else {
                    return this.templateLibrary.getContext(problem.type, problem.num1, problem.num2);
                }
            } catch (error) {
                lastError = error;
                const errorMessage = error.message || '';
                // Check if it's a rate limit error (429) or quota exceeded
                if (errorMessage.includes('429') || errorMessage.includes('Too Many Requests') || errorMessage.includes('Quota exceeded')) {
                    this.quotaResetTime = this.extractRetryTime(errorMessage);
                    this.quotaExceeded = true;
                    return this.templateLibrary.getContext(problem.type, problem.num1, problem.num2);
                }
                // For other errors, retry with exponential backoff
                if (attempt < this.options.maxRetries - 1) {
                    const delay = Math.min(this.options.baseDelay * Math.pow(2, attempt), this.options.maxDelay);
                    await this.sleep(delay);
                }
            }
        }
        return this.templateLibrary.getContext(problem.type, problem.num1, problem.num2);
    }
    /**
   * Generates contexts for multiple problems in a single request
   */ async generateContextsBatch(problems) {
        if (!this.enabled || this.quotaExceeded) {
            return problems.map((p)=>this.templateLibrary.getContext(p.type, p.num1, p.num2));
        }
        let lastError = null;
        for(let attempt = 0; attempt < this.options.maxRetries; attempt++){
            try {
                await this.waitForRateLimit();
                const prompt = this.createBatchPrompt(problems);
                const result = await this.model.generateContent(prompt);
                const response = await result.response;
                let text = response.text().trim();
                this.requestCount++;
                // Parse das linhas numeradas
                const lines = text.split('\n').filter((line)=>line.trim());
                const contexts = [];
                for(let i = 0; i < problems.length; i++){
                    let context = null;
                    // Tentar encontrar linha correspondente
                    const linePattern = new RegExp(`^\\s*${i + 1}[\\.)\\-:]\\s*(.+)$`);
                    const matchingLine = lines.find((line)=>linePattern.test(line));
                    if (matchingLine) {
                        const match = matchingLine.match(linePattern);
                        context = match[1].trim().replace(/^["']|["']$/g, '');
                    } else if (lines[i]) {
                        // Fallback: usar linha por índice
                        context = lines[i].replace(/^\d+[\.)\-:]\s*/, '').trim().replace(/^["']|["']$/g, '');
                    }
                    // Validar contexto
                    if (context && this.validateContext(context)) {
                        contexts.push(context);
                    } else {
                        // Use template if validation fails
                        const p = problems[i];
                        contexts.push(this.templateLibrary.getContext(p.type, p.num1, p.num2));
                    }
                }
                return contexts;
            } catch (error) {
                lastError = error;
                const errorMessage = error.message || '';
                if (errorMessage.includes('429') || errorMessage.includes('Too Many Requests') || errorMessage.includes('Quota exceeded')) {
                    this.quotaResetTime = this.extractRetryTime(errorMessage);
                    this.quotaExceeded = true;
                    return problems.map((p)=>this.templateLibrary.getContext(p.type, p.num1, p.num2));
                }
                if (attempt < this.options.maxRetries - 1) {
                    const delay = Math.min(this.options.baseDelay * Math.pow(2, attempt), this.options.maxDelay);
                    await this.sleep(delay);
                }
            }
        }
        return problems.map((p)=>this.templateLibrary.getContext(p.type, p.num1, p.num2));
    }
    /**
   * Validates if the generated context is appropriate
   */ validateContext(text) {
        // Check length
        if (!text || text.length < 10 || text.length > 200) {
            return false;
        }
        // Inappropriate words
        const inappropriate = [
            'morte',
            'morrer',
            'matar',
            'violência',
            'sangue',
            'medo',
            'terror',
            'horror',
            'dor',
            'doer',
            'machucar',
            'feio',
            'horrível',
            'péssimo',
            'ruim'
        ];
        const lowerText = text.toLowerCase();
        if (inappropriate.some((word)=>lowerText.includes(word))) {
            return false;
        }
        // Check if it doesn't contain explicit numbers (avoid "3 + 2")
        if (/\d+\s*[+\-×÷]\s*\d+/.test(text)) {
            return false;
        }
        // Check if contains any name from the pool
        if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2f$namePool$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["containsAnyName"])(text)) {
            return false;
        }
        return true;
    }
    /**
   * Generates complete contextualized problem
   */ async generateWordProblem(problem) {
        const context = await this.generateContext(problem);
        const question = problem.type === 'addition' ? 'Quantos no total?' : 'Quantos restaram?';
        return {
            context,
            question,
            numbers: `${problem.num1} ${problem.operation} ${problem.num2} = ____`,
            answer: problem.answer
        };
    }
    /**
   * Generates multiple contexts in batch with internally managed rate limiting
   */ async generateBatch(problems) {
        const contexts = [];
        for (const problem of problems){
            const context = await this.generateContext(problem);
            contexts.push(context);
        // Rate limiting is now managed internally by waitForRateLimit
        }
        return contexts;
    }
    /**
   * Returns API usage statistics
   */ getUsageStats() {
        return {
            requestCount: this.requestCount,
            quotaExceeded: this.quotaExceeded,
            quotaResetTime: this.quotaResetTime,
            requestsPerMinute: this.options.requestsPerMinute
        };
    }
    /**
   * Helper for delay
   */ sleep(ms) {
        return new Promise((resolve)=>setTimeout(resolve, ms));
    }
    /**
   * Checks if AI is available
   */ isEnabled() {
        return this.enabled;
    }
    /**
   * Fallback to templates
   */ getFallbackContext(problem) {
        return this.templateLibrary.getContext(problem.type, problem.num1, problem.num2);
    }
}
const __TURBOPACK__default__export__ = AIEnhancer;
}),
"[externals]/fs [external] (fs, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("fs", () => require("fs"));

module.exports = mod;
}),
"[project]/lib/utils/cache.js [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
/**
 * Sistema de Cache para respostas da IA
 * Evita chamadas repetidas e melhora performance
 */ var __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/fs [external] (fs, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/path [external] (path, cjs)");
;
;
class CacheManager {
    constructor(cacheDir = './cache'){
        this.cacheDir = cacheDir;
        this.memoryCache = new Map();
    }
    /**
   * Inicializa o sistema de cache
   */ async init() {
        try {
            await __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["promises"].mkdir(this.cacheDir, {
                recursive: true
            });
            console.log('✅ Sistema de cache inicializado');
        } catch (error) {
            console.warn('⚠️  Erro ao criar diretório de cache:', error.message);
        }
    }
    /**
   * Gera uma chave única para o problema
   */ getCacheKey(problem) {
        return `${problem.type}-${problem.num1}-${problem.num2}`;
    }
    /**
   * Gera o caminho do arquivo de cache
   */ getCacheFilePath(key) {
        // Criar subdiretório por tipo de operação
        const type = key.split('-')[0];
        return __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(this.cacheDir, type, `${key}.json`);
    }
    /**
   * Busca no cache (memória primeiro, depois arquivo)
   */ async get(problem) {
        const key = this.getCacheKey(problem);
        // Tentar memória primeiro
        if (this.memoryCache.has(key)) {
            return this.memoryCache.get(key);
        }
        // Tentar arquivo
        try {
            const filePath = this.getCacheFilePath(key);
            const data = await __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["promises"].readFile(filePath, 'utf-8');
            const cached = JSON.parse(data);
            // Adicionar à memória
            this.memoryCache.set(key, cached.context);
            return cached.context;
        } catch (error) {
            // Não encontrado no cache
            return null;
        }
    }
    /**
   * Salva no cache (memória e arquivo)
   */ async set(problem, context) {
        const key = this.getCacheKey(problem);
        // Salvar na memória
        this.memoryCache.set(key, context);
        // Salvar em arquivo
        try {
            const filePath = this.getCacheFilePath(key);
            const dir = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].dirname(filePath);
            // Criar diretório se não existir
            await __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["promises"].mkdir(dir, {
                recursive: true
            });
            // Salvar dados
            const data = {
                key,
                context,
                problem: {
                    type: problem.type,
                    num1: problem.num1,
                    num2: problem.num2,
                    operation: problem.operation,
                    answer: problem.answer
                },
                timestamp: new Date().toISOString(),
                version: '1.0'
            };
            await __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["promises"].writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
        } catch (error) {
            console.warn(`⚠️  Erro ao salvar cache para ${key}:`, error.message);
        }
    }
    /**
   * Verifica se existe no cache
   */ async has(problem) {
        const key = this.getCacheKey(problem);
        if (this.memoryCache.has(key)) {
            return true;
        }
        try {
            const filePath = this.getCacheFilePath(key);
            await __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["promises"].access(filePath);
            return true;
        } catch  {
            return false;
        }
    }
    /**
   * Obtém estatísticas do cache
   */ async getStats() {
        try {
            const stats = {
                memorySize: this.memoryCache.size,
                fileCount: 0,
                totalSize: 0,
                byType: {}
            };
            // Contar arquivos por tipo
            for (const type of [
                'addition',
                'subtraction'
            ]){
                const typeDir = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(this.cacheDir, type);
                try {
                    const files = await __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["promises"].readdir(typeDir);
                    stats.byType[type] = files.length;
                    stats.fileCount += files.length;
                    // Calcular tamanho total
                    for (const file of files){
                        const filePath = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(typeDir, file);
                        const stat = await __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["promises"].stat(filePath);
                        stats.totalSize += stat.size;
                    }
                } catch  {
                    stats.byType[type] = 0;
                }
            }
            return stats;
        } catch (error) {
            return {
                error: error.message
            };
        }
    }
    /**
   * Limpa o cache
   */ async clear() {
        // Limpar memória
        this.memoryCache.clear();
        // Limpar arquivos
        try {
            await __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["promises"].rm(this.cacheDir, {
                recursive: true,
                force: true
            });
            await __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["promises"].mkdir(this.cacheDir, {
                recursive: true
            });
            console.log('✅ Cache limpo com sucesso');
        } catch (error) {
            console.warn('⚠️  Erro ao limpar cache:', error.message);
        }
    }
    /**
   * Pré-aquece o cache com problemas comuns
   */ async warmup(aiEnhancer, ranges = {
        min: 1,
        max: 20
    }) {
        console.log('🔥 Aquecendo cache...');
        const operations = [
            'addition',
            'subtraction'
        ];
        let generated = 0;
        let cached = 0;
        for (const type of operations){
            for(let i = ranges.min; i <= ranges.max; i++){
                for(let j = ranges.min; j <= ranges.max; j++){
                    const problem = {
                        type,
                        num1: i,
                        num2: j,
                        operation: type === 'addition' ? '+' : '−',
                        answer: type === 'addition' ? i + j : i - j
                    };
                    // Verificar se já existe
                    const exists = await this.has(problem);
                    if (!exists) {
                        const context = await aiEnhancer.generateContext(problem);
                        await this.set(problem, context);
                        generated++;
                        // Pequeno delay para respeitar rate limits
                        await this.sleep(100);
                    } else {
                        cached++;
                    }
                }
            }
        }
        console.log(`✅ Cache aquecido: ${generated} novos, ${cached} existentes`);
        return {
            generated,
            cached
        };
    }
    /**
   * Helper para delay
   */ sleep(ms) {
        return new Promise((resolve)=>setTimeout(resolve, ms));
    }
    /**
   * Carrega todos os itens do cache para memória
   */ async loadToMemory() {
        console.log('📥 Carregando cache para memória...');
        let count = 0;
        try {
            for (const type of [
                'addition',
                'subtraction'
            ]){
                const typeDir = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(this.cacheDir, type);
                try {
                    const files = await __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["promises"].readdir(typeDir);
                    for (const file of files){
                        if (file.endsWith('.json')) {
                            const filePath = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(typeDir, file);
                            const data = await __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["promises"].readFile(filePath, 'utf-8');
                            const cached = JSON.parse(data);
                            this.memoryCache.set(cached.key, cached.context);
                            count++;
                        }
                    }
                } catch  {
                // Diretório não existe ou está vazio
                }
            }
            console.log(`✅ ${count} itens carregados na memória`);
        } catch (error) {
            console.warn('⚠️  Erro ao carregar cache:', error.message);
        }
        return count;
    }
}
const __TURBOPACK__default__export__ = CacheManager;
}),
"[project]/lib/services/AIEnhancerService.js [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AIEnhancerService",
    ()=>AIEnhancerService
]);
/**
 * Serviço para geração de contextos narrativos com IA
 * Encapsula a lógica de negócio do AIEnhancer
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$generators$2f$aiEnhancer$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/generators/aiEnhancer.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils/cache.js [app-rsc] (ecmascript)");
;
;
class AIEnhancerService {
    /**
   * Gera problemas contextualizados
   * @param {Array} problems - Lista de problemas matemáticos
   * @param {number} count - Quantidade de problemas a contextualizar
   * @returns {Promise<Array>} - Problemas contextualizados
   */ static async generateContextualProblems(problems, count = 10) {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey || apiKey === 'your_api_key_here') {
            throw new Error('API key do Gemini não configurada');
        }
        const aiEnhancer = new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$generators$2f$aiEnhancer$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"](apiKey, {
            model: process.env.GEMINI_MODEL || 'gemini-2.0-flash-exp'
        });
        const cacheManager = new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"]('./cache');
        await cacheManager.init();
        await cacheManager.loadToMemory();
        // Selecionar problemas para contextualizar
        const selectedProblems = this.selectProblems(problems, count);
        const contextualProblems = [];
        // Separar cacheados e não-cacheados
        const problemsWithCache = [];
        const problemsNeedingGeneration = [];
        for (const problem of selectedProblems){
            const cached = await cacheManager.get(problem);
            if (cached) {
                problemsWithCache.push({
                    problem,
                    context: cached
                });
            } else {
                problemsNeedingGeneration.push(problem);
            }
        }
        // Gerar contextos para problemas não-cacheados
        let generatedContexts = [];
        if (problemsNeedingGeneration.length > 0) {
            generatedContexts = await aiEnhancer.generateContextsBatch(problemsNeedingGeneration);
            // Salvar no cache
            for(let i = 0; i < problemsNeedingGeneration.length; i++){
                await cacheManager.set(problemsNeedingGeneration[i], generatedContexts[i]);
            }
        }
        // Combinar resultados mantendo ordem original
        for (const problem of selectedProblems){
            const cached = problemsWithCache.find((p)=>p.problem === problem);
            let context;
            if (cached) {
                context = cached.context;
            } else {
                const index = problemsNeedingGeneration.indexOf(problem);
                context = generatedContexts[index];
            }
            const question = problem.type === 'addition' ? 'Quantos no total?' : 'Quantos restaram?';
            contextualProblems.push({
                context,
                question,
                answer: problem.answer,
                num1: problem.num1,
                num2: problem.num2,
                operation: problem.operation
            });
        }
        return contextualProblems;
    }
    /**
   * Seleciona problemas para contextualizar
   * @param {Array} problems - Lista completa de problemas
   * @param {number} count - Quantidade a selecionar
   * @returns {Array} - Problemas selecionados
   */ static selectProblems(problems, count) {
        const step = Math.floor(problems.length / count);
        const selected = [];
        for(let i = 0; i < count && i * step < problems.length; i++){
            selected.push(problems[i * step]);
        }
        return selected;
    }
}
}),
"[project]/lib/services/HTMLFormatterService.js [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "HTMLFormatterService",
    ()=>HTMLFormatterService
]);
/**
 * Service for formatting exercises to HTML
 * Adapts existing templates for web rendering
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2f$namePool$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/constants/namePool.js [app-rsc] (ecmascript)");
;
class HTMLFormatterService {
    /**
   * Formats grid problems to HTML
   * @param {Array} problems - Problem list
   * @param {object} stats - Statistics
   * @param {object} options - Formatting options
   * @returns {string} - Formatted HTML
   */ static formatGrid(problems, stats, options = {}) {
        const { includeAnswerKey = false, studentName = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2f$namePool$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getRandomName"])() } = options;
        const title = includeAnswerKey ? `Gabarito - ${stats.totalProblems || stats.total || problems.length} Exercícios de Matemática` : `${stats.totalProblems || stats.total || problems.length} Exercícios de Matemática para ${studentName}`;
        const problemsHtml = problems.map((problem, index)=>{
            const display = problem.operation;
            const answer = includeAnswerKey ? ` = <strong>${problem.answer}</strong>` : ' = _____';
            return `<div class="problem-item">
          <span class="problem-number">${index + 1})</span>
          <span class="problem-expression">${display}${answer}</span>
        </div>`;
        }).join('\n');
        return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Comic Sans MS', 'Comic Neue', cursive, sans-serif;
      padding: 40px;
      max-width: 900px;
      margin: 0 auto;
      background: white;
    }
    
    .header {
      text-align: center;
      margin-bottom: 30px;
      border-bottom: 3px solid #ff6b9d;
      padding-bottom: 20px;
    }
    
    h1 {
      color: #ff6b9d;
      font-size: 28px;
      margin-bottom: 10px;
    }
    
    .stats {
      color: #666;
      font-size: 14px;
      margin-top: 10px;
    }
    
    .stats-badge {
      display: inline-block;
      background: #f0f0f0;
      padding: 4px 12px;
      border-radius: 12px;
      margin: 0 5px;
    }
    
    .problems-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 15px 30px;
      margin-top: 30px;
    }
    
    .problem-item {
      display: flex;
      align-items: center;
      font-size: 18px;
      padding: 8px;
      border-bottom: 1px solid #eee;
    }
    
    .problem-number {
      color: #c084fc;
      font-weight: bold;
      margin-right: 10px;
      min-width: 35px;
    }
    
    .problem-expression {
      font-size: 20px;
      font-family: 'Courier New', monospace;
    }
    
    .problem-expression strong {
      color: #36d399;
    }
    
    .footer {
      margin-top: 40px;
      text-align: center;
      color: #999;
      font-size: 12px;
      border-top: 1px solid #eee;
      padding-top: 20px;
    }
    
    @media print {
      body {
        padding: 20px;
      }
      
      .no-print {
        display: none !important;
      }
      
      .problems-grid {
        break-inside: avoid;
      }
    }
    
    @media screen {
      .print-actions {
        position: fixed;
        top: 20px;
        right: 20px;
        display: flex;
        gap: 10px;
      }
      
      .btn {
        padding: 12px 24px;
        border: none;
        border-radius: 8px;
        font-size: 14px;
        font-weight: bold;
        cursor: pointer;
        transition: all 0.2s;
      }
      
      .btn-print {
        background: #ff6b9d;
        color: white;
      }
      
      .btn-print:hover {
        background: #ff5085;
        transform: translateY(-2px);
      }
      
      .btn-close {
        background: #e5e5e5;
        color: #333;
      }
      
      .btn-close:hover {
        background: #d0d0d0;
      }
    }
  </style>
</head>
<body>
  <div class="print-actions no-print">
    <button class="btn btn-print" onclick="window.print()">🖨️ Imprimir</button>
    <button class="btn btn-close" onclick="window.close()">✖️ Fechar</button>
  </div>

  <div class="header">
    <h1>${title}</h1>
    <div class="stats">
      <span class="stats-badge">Total: ${stats.totalProblems || problems.length}</span>
      <span class="stats-badge">Adição: ${stats.additions || 0}</span>
      <span class="stats-badge">Subtração: ${stats.subtractions || 0}</span>
      ${stats.multiplications ? `<span class="stats-badge">Multiplicação: ${stats.multiplications}</span>` : ''}
      ${stats.divisions ? `<span class="stats-badge">Divisão: ${stats.divisions}</span>` : ''}
      <span class="stats-badge">Dificuldade: ${this.getDifficultyLabel(stats.difficulty)}</span>
    </div>
    ${!includeAnswerKey ? `<div style="margin-top: 15px; font-size: 14px;">Nome: ___________________________ Data: ___/___/___</div>` : ''}
  </div>

  <div class="problems-grid">
    ${problemsHtml}
  </div>

  ${!includeAnswerKey ? `
  <div class="score-section" style="margin-top: 40px; padding: 20px; border: 2px solid #ff6b9d; border-radius: 12px; text-align: center;">
    <h2 style="color: #ff6b9d; margin-bottom: 15px; font-size: 22px;">📊 Meu Resultado</h2>
    <div style="display: flex; justify-content: center; gap: 20px; flex-wrap: wrap;">
      <div style="background: #f0f0f0; padding: 15px 30px; border-radius: 8px;">
        <div style="font-size: 14px; color: #666;">Total de Questões</div>
        <div style="font-size: 32px; font-weight: bold; color: #c084fc;">${stats.totalProblems || problems.length}</div>
      </div>
      <div style="background: #f0fdf4; padding: 15px 30px; border-radius: 8px;">
        <div style="font-size: 14px; color: #666;">Acertos</div>
        <div style="font-size: 32px; font-weight: bold; color: #36d399;">____</div>
      </div>
      <div style="background: #fff7ed; padding: 15px 30px; border-radius: 8px;">
        <div style="font-size: 14px; color: #666;">Minha Nota</div>
        <div style="font-size: 32px; font-weight: bold; color: #fb923c;">____</div>
      </div>
    </div>
    <div style="margin-top: 20px; color: #666; font-size: 14px;">
      🌟 Parabéns pelo esforço! Continue praticando!
    </div>
  </div>
  ` : ''}

  <div class="footer">
    <p>Material gerado com ❤️ para ${studentName} • ${new Date().toLocaleDateString('pt-BR')}</p>
  </div>
</body>
</html>
`;
    }
    /**
   * Formats contextualized problems to HTML
   * @param {Array} contextualProblems - List of contextualized problems
   * @param {object} stats - Statistics
   * @param {object} options - Formatting options
   * @returns {string} - Formatted HTML
   */ static formatContextual(contextualProblems, stats, options = {}) {
        const { includeAnswerKey = false, studentName = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2f$namePool$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getRandomName"])() } = options;
        const title = includeAnswerKey ? 'Gabarito - Problemas Contextualizados' : `Problemas Contextualizados para ${studentName}`;
        const problemsHtml = contextualProblems.map((problem, index)=>{
            const answerHtml = includeAnswerKey ? `<div class="answer">
              <strong>Resposta:</strong> ${problem.answer}
              <span class="operation-hint">(${problem.num1} ${problem.operation} ${problem.num2})</span>
             </div>` : `<div class="answer-space">
              <strong>Resposta:</strong> _______________
             </div>`;
            return `
        <div class="problem-card">
          <div class="problem-header">
            <span class="problem-number">Problema ${index + 1}</span>
          </div>
          <div class="problem-context">${problem.context}</div>
          <div class="problem-question">${problem.question}</div>
          ${answerHtml}
        </div>
        `;
        }).join('\n');
        return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Comic Sans MS', 'Comic Neue', cursive, sans-serif;
      padding: 40px;
      max-width: 800px;
      margin: 0 auto;
      background: #fafafa;
      line-height: 1.6;
    }
    
    .header {
      text-align: center;
      margin-bottom: 30px;
      background: white;
      padding: 30px;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    
    h1 {
      color: #c084fc;
      font-size: 28px;
      margin-bottom: 10px;
    }
    
    .problem-card {
      background: white;
      border-radius: 12px;
      padding: 25px;
      margin-bottom: 25px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      border-left: 4px solid #ff6b9d;
    }
    
    .problem-header {
      margin-bottom: 15px;
    }
    
    .problem-number {
      background: #ff6b9d;
      color: white;
      padding: 6px 16px;
      border-radius: 20px;
      font-weight: bold;
      font-size: 14px;
    }
    
    .problem-context {
      font-size: 16px;
      color: #333;
      margin-bottom: 12px;
      line-height: 1.8;
    }
    
    .problem-question {
      font-weight: bold;
      color: #fb923c;
      font-size: 17px;
      margin-bottom: 15px;
    }
    
    .answer {
      background: #f0fdf4;
      border: 2px solid #36d399;
      border-radius: 8px;
      padding: 12px;
      margin-top: 15px;
      font-size: 16px;
      color: #166534;
    }
    
    .answer strong {
      color: #36d399;
    }
    
    .operation-hint {
      color: #666;
      font-size: 14px;
      margin-left: 10px;
    }
    
    .answer-space {
      border: 2px dashed #ccc;
      border-radius: 8px;
      padding: 20px;
      margin-top: 15px;
      background: #fafafa;
    }
    
    .footer {
      margin-top: 40px;
      text-align: center;
      color: #999;
      font-size: 12px;
    }
    
    @media print {
      body {
        padding: 20px;
        background: white;
      }
      
      .no-print {
        display: none !important;
      }
      
      .problem-card {
        break-inside: avoid;
        box-shadow: none;
        border: 1px solid #ddd;
      }
    }
    
    @media screen {
      .print-actions {
        position: fixed;
        top: 20px;
        right: 20px;
        display: flex;
        gap: 10px;
        z-index: 1000;
      }
      
      .btn {
        padding: 12px 24px;
        border: none;
        border-radius: 8px;
        font-size: 14px;
        font-weight: bold;
        cursor: pointer;
        transition: all 0.2s;
        box-shadow: 0 2px 4px rgba(0,0,0,0.2);
      }
      
      .btn-print {
        background: #c084fc;
        color: white;
      }
      
      .btn-print:hover {
        background: #a855f7;
        transform: translateY(-2px);
      }
      
      .btn-close {
        background: #e5e5e5;
        color: #333;
      }
      
      .btn-close:hover {
        background: #d0d0d0;
      }
    }
  </style>
</head>
<body>
  <div class="print-actions no-print">
    <button class="btn btn-print" onclick="window.print()">🖨️ Imprimir</button>
    <button class="btn btn-close" onclick="window.close()">✖️ Fechar</button>
  </div>

  <div class="header">
    <h1>${title}</h1>
    ${!includeAnswerKey ? `<div style="margin-top: 15px; font-size: 14px;">Nome: ___________________________ Data: ___/___/___</div>` : ''}
  </div>

  ${problemsHtml}

  ${!includeAnswerKey ? `
  <div class="score-section" style="margin-top: 40px; padding: 20px; border: 2px solid #c084fc; border-radius: 12px; text-align: center;">
    <h2 style="color: #c084fc; margin-bottom: 15px; font-size: 22px;">📊 Meu Resultado</h2>
    <div style="display: flex; justify-content: center; gap: 20px; flex-wrap: wrap;">
      <div style="background: #f0f0f0; padding: 15px 30px; border-radius: 8px;">
        <div style="font-size: 14px; color: #666;">Total de Questões</div>
        <div style="font-size: 32px; font-weight: bold; color: #c084fc;">${contextualProblems.length}</div>
      </div>
      <div style="background: #f0fdf4; padding: 15px 30px; border-radius: 8px;">
        <div style="font-size: 14px; color: #666;">Acertos</div>
        <div style="font-size: 32px; font-weight: bold; color: #36d399;">____</div>
      </div>
      <div style="background: #fff7ed; padding: 15px 30px; border-radius: 8px;">
        <div style="font-size: 14px; color: #666;">Minha Nota</div>
        <div style="font-size: 32px; font-weight: bold; color: #fb923c;">____</div>
      </div>
    </div>
    <div style="margin-top: 20px; color: #666; font-size: 14px;">
      🌟 Parabéns pelo esforço! Continue praticando!
    </div>
  </div>
  ` : ''}

  <div class="footer">
    <p>Material gerado com ❤️ para ${studentName} • ${new Date().toLocaleDateString('pt-BR')}</p>
  </div>
</body>
</html>
`;
    }
    /**
   * Returns the difficulty label
   */ static getDifficultyLabel(difficulty) {
        const labels = {
            easy: 'Fácil',
            medium: 'Médio',
            hard: 'Difícil'
        };
        return labels[difficulty] || 'Médio';
    }
}
}),
"[project]/lib/cache/exerciseCache.js [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getExerciseCache",
    ()=>getExerciseCache
]);
/**
 * Cache em memória para exercícios gerados
 * Usa Map para armazenar temporariamente os exercícios
 */ class ExerciseCache {
    constructor(){
        this.cache = new Map();
    }
    /**
   * Salva um exercício no cache
   * @param {string} id - ID único do exercício
   * @param {object} data - Dados do exercício
   */ set(id, data) {
        this.cache.set(id, {
            data,
            timestamp: Date.now()
        });
    }
    /**
   * Busca um exercício do cache
   * @param {string} id - ID único do exercício
   * @returns {object|null} - Dados do exercício ou null
   */ get(id) {
        const entry = this.cache.get(id);
        if (!entry) {
            return null;
        }
        const ONE_HOUR = 60 * 60 * 1000;
        if (Date.now() - entry.timestamp > ONE_HOUR) {
            this.cache.delete(id);
            return null;
        }
        return entry.data;
    }
    /**
   * Remove um exercício do cache
   * @param {string} id - ID único do exercício
   */ delete(id) {
        this.cache.delete(id);
    }
    /**
   * Limpa todos os exercícios expirados
   */ cleanup() {
        const ONE_HOUR = 60 * 60 * 1000;
        const now = Date.now();
        for (const [id, entry] of this.cache.entries()){
            if (now - entry.timestamp > ONE_HOUR) {
                this.cache.delete(id);
            }
        }
    }
    /**
   * Retorna estatísticas do cache
   */ getStats() {
        return {
            size: this.cache.size,
            keys: Array.from(this.cache.keys())
        };
    }
}
// Singleton usando global para persistir durante hot reload
const globalForCache = /*TURBOPACK member replacement*/ __turbopack_context__.g;
function getExerciseCache() {
    if (!globalForCache.__exerciseCache) {
        globalForCache.__exerciseCache = new ExerciseCache();
        // Cleanup automático a cada 30 minutos
        setInterval(()=>{
            globalForCache.__exerciseCache.cleanup();
        }, 30 * 60 * 1000);
    }
    return globalForCache.__exerciseCache;
}
}),
"[project]/lib/constants/namePool.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Multilingual name pool for math exercises
 * Names selected to work well in both Portuguese and English
 */ __turbopack_context__.s([
    "NAME_POOL",
    ()=>NAME_POOL,
    "containsAnyName",
    ()=>containsAnyName,
    "getAllNamesString",
    ()=>getAllNamesString,
    "getConsistentName",
    ()=>getConsistentName,
    "getRandomName",
    ()=>getRandomName,
    "getRandomNames",
    ()=>getRandomNames
]);
const NAME_POOL = [
    // Feminine names
    {
        name: 'Luna',
        gender: 'feminine'
    },
    {
        name: 'Maya',
        gender: 'feminine'
    },
    {
        name: 'Nina',
        gender: 'feminine'
    },
    {
        name: 'Mia',
        gender: 'feminine'
    },
    {
        name: 'Jade',
        gender: 'feminine'
    },
    {
        name: 'Lara',
        gender: 'feminine'
    },
    {
        name: 'Sofia',
        gender: 'feminine'
    },
    {
        name: 'Ana',
        gender: 'feminine'
    },
    {
        name: 'Emma',
        gender: 'feminine'
    },
    // Masculine names
    {
        name: 'Leo',
        gender: 'masculine'
    },
    {
        name: 'Noah',
        gender: 'masculine'
    },
    {
        name: 'Davi',
        gender: 'masculine'
    },
    {
        name: 'Kai',
        gender: 'masculine'
    },
    {
        name: 'Lucas',
        gender: 'masculine'
    },
    {
        name: 'Theo',
        gender: 'masculine'
    },
    {
        name: 'Samuel',
        gender: 'masculine'
    },
    {
        name: 'Enzo',
        gender: 'masculine'
    },
    {
        name: 'Miguel',
        gender: 'masculine'
    }
];
function getRandomName(gender, seed) {
    const filteredPool = gender ? NAME_POOL.filter((n)=>n.gender === gender) : NAME_POOL;
    if (seed !== undefined) {
        // Deterministic randomization using seed
        const index = seed % filteredPool.length;
        return filteredPool[index].name;
    }
    // True randomization
    const randomIndex = Math.floor(Math.random() * filteredPool.length);
    return filteredPool[randomIndex].name;
}
function getRandomNames(count, gender) {
    const filteredPool = gender ? NAME_POOL.filter((n)=>n.gender === gender) : NAME_POOL;
    const shuffled = [
        ...filteredPool
    ].sort(()=>Math.random() - 0.5);
    return shuffled.slice(0, Math.min(count, shuffled.length)).map((n)=>n.name);
}
function getConsistentName(id, gender) {
    const filteredPool = gender ? NAME_POOL.filter((n)=>n.gender === gender) : NAME_POOL;
    // Generate simple hash from ID
    const hash = typeof id === 'string' ? id.split('').reduce((acc, char)=>acc + char.charCodeAt(0), 0) : id;
    const index = hash % filteredPool.length;
    return filteredPool[index].name;
}
function getAllNamesString() {
    return NAME_POOL.map((n)=>n.name).join(', ');
}
function containsAnyName(text) {
    const lowerText = text.toLowerCase();
    return NAME_POOL.some((n)=>lowerText.includes(n.name.toLowerCase()));
}
}),
"[project]/app/actions/generateExercises.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/* __next_internal_action_entry_do_not_use__ [{"40772723c14579758b17be2e8fe43eb50d0cb9bfd1":"generateExercises"},"",""] */ __turbopack_context__.s([
    "generateExercises",
    ()=>generateExercises
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__ = __turbopack_context__.i("[project]/node_modules/zod/v4/classic/external.js [app-rsc] (ecmascript) <export * as z>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$nanoid$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/nanoid/index.js [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$services$2f$MathGeneratorService$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/services/MathGeneratorService.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$services$2f$AIEnhancerService$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/services/AIEnhancerService.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$services$2f$HTMLFormatterService$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/services/HTMLFormatterService.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$cache$2f$exerciseCache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/cache/exerciseCache.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2f$namePool$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/constants/namePool.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
;
;
;
;
;
;
;
;
// Validation schema
const GenerateExercisesSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    totalProblems: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().int().min(1).max(200).default(50),
    difficulty: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
        'easy',
        'medium',
        'hard'
    ]).default('medium'),
    useAI: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].boolean().default(false),
    includeAnswerKey: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].boolean().default(false),
    studentName: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
    format: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
        'grid',
        'contextual',
        'both'
    ]).default('grid'),
    digitConfigs: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
        digits: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().int().min(1).max(5),
        questions: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().int().min(0).max(100),
        operation: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
            'addition',
            'subtraction',
            'multiplication',
            'division',
            'mixed'
        ]),
        divisorMin: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().int().min(1).max(100).optional(),
        divisorMax: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().int().min(1).max(100).optional()
    })).optional()
});
async function generateExercises(input) {
    try {
        // Validate input
        const validatedInput = GenerateExercisesSchema.parse(input);
        // Use random name from pool if not provided
        const studentName = validatedInput.studentName || (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2f$namePool$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getRandomName"])();
        // Validate options and generate problems
        const options = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$services$2f$MathGeneratorService$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["MathGeneratorService"].validateOptions({
            ...validatedInput,
            digitConfigs: validatedInput.digitConfigs
        });
        const { problems, stats } = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$services$2f$MathGeneratorService$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["MathGeneratorService"].generateProblems(options);
        const cache = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$cache$2f$exerciseCache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getExerciseCache"])();
        const result = {
            success: true
        };
        // Gerar exercício em grade
        if (validatedInput.format === 'grid' || validatedInput.format === 'both') {
            const gridHtml = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$services$2f$HTMLFormatterService$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["HTMLFormatterService"].formatGrid(problems, stats, {
                includeAnswerKey: validatedInput.includeAnswerKey,
                studentName
            });
            const gridId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$nanoid$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["nanoid"])(10);
            cache.set(gridId, {
                type: 'grid',
                html: gridHtml,
                stats,
                options: validatedInput
            });
            result.gridExerciseId = gridId;
            if (validatedInput.format === 'grid') {
                result.exerciseId = gridId;
            }
        }
        // Generate contextualized problems (with AI if enabled)
        if (validatedInput.format === 'contextual' || validatedInput.format === 'both') {
            if (validatedInput.useAI) {
                try {
                    const contextualProblems = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$services$2f$AIEnhancerService$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["AIEnhancerService"].generateContextualProblems(problems, 10);
                    const contextualHtml = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$services$2f$HTMLFormatterService$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["HTMLFormatterService"].formatContextual(contextualProblems, stats, {
                        includeAnswerKey: validatedInput.includeAnswerKey,
                        studentName
                    });
                    const contextualId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$nanoid$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["nanoid"])(10);
                    cache.set(contextualId, {
                        type: 'contextual',
                        html: contextualHtml,
                        stats,
                        options: validatedInput
                    });
                    result.contextualExerciseId = contextualId;
                    if (validatedInput.format === 'contextual') {
                        result.exerciseId = contextualId;
                    }
                } catch (aiError) {
                    console.error('Error generating contexts with AI:', aiError);
                    return {
                        success: false,
                        error: `Error generating contexts with AI: ${aiError.message}`
                    };
                }
            } else {
                // Use simple templates without AI
                const simpleContextual = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$services$2f$AIEnhancerService$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["AIEnhancerService"].selectProblems(problems, 10).map((p)=>({
                        context: `${studentName} tem ${p.num1} itens e ${p.type === 'addition' ? 'ganhou' : 'deu'} ${p.num2} itens.`,
                        question: p.type === 'addition' ? 'Quantos no total?' : 'Quantos restaram?',
                        answer: p.answer,
                        num1: p.num1,
                        num2: p.num2,
                        operation: p.operation
                    }));
                const contextualHtml = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$services$2f$HTMLFormatterService$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["HTMLFormatterService"].formatContextual(simpleContextual, stats, {
                    includeAnswerKey: validatedInput.includeAnswerKey,
                    studentName
                });
                const contextualId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$nanoid$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["nanoid"])(10);
                cache.set(contextualId, {
                    type: 'contextual',
                    html: contextualHtml,
                    stats,
                    options: validatedInput
                });
                result.contextualExerciseId = contextualId;
                if (validatedInput.format === 'contextual') {
                    result.exerciseId = contextualId;
                }
            }
        }
        return result;
    } catch (error) {
        console.error('Error generating exercises:', error);
        return {
            success: false,
            error: error.message || 'Unknown error generating exercises'
        };
    }
}
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    generateExercises
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(generateExercises, "40772723c14579758b17be2e8fe43eb50d0cb9bfd1", null);
}),
"[project]/.next-internal/server/app/page/actions.js { ACTIONS_MODULE0 => \"[project]/app/actions/generateExercises.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$actions$2f$generateExercises$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/actions/generateExercises.ts [app-rsc] (ecmascript)");
;
}),
"[project]/.next-internal/server/app/page/actions.js { ACTIONS_MODULE0 => \"[project]/app/actions/generateExercises.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "40772723c14579758b17be2e8fe43eb50d0cb9bfd1",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$actions$2f$generateExercises$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["generateExercises"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$app$2f$actions$2f$generateExercises$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i('[project]/.next-internal/server/app/page/actions.js { ACTIONS_MODULE0 => "[project]/app/actions/generateExercises.ts [app-rsc] (ecmascript)" } [app-rsc] (server actions loader, ecmascript) <locals>');
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$actions$2f$generateExercises$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/actions/generateExercises.ts [app-rsc] (ecmascript)");
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__cfab8b61._.js.map