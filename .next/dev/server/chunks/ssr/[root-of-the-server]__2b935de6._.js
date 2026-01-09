module.exports = [
"[project]/app/favicon.ico.mjs { IMAGE => \"[project]/app/favicon.ico (static in ecmascript, tag client)\" } [app-rsc] (structured image object, ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/app/favicon.ico.mjs { IMAGE => \"[project]/app/favicon.ico (static in ecmascript, tag client)\" } [app-rsc] (structured image object, ecmascript)"));
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[project]/app/layout.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/app/layout.tsx [app-rsc] (ecmascript)"));
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
"[project]/app/exercise/[id]/page.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ExercisePage,
    "generateMetadata",
    ()=>generateMetadata
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$api$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/next/dist/api/navigation.react-server.js [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/components/navigation.react-server.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$cache$2f$exerciseCache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/cache/exerciseCache.js [app-rsc] (ecmascript)");
;
;
;
async function ExercisePage({ params }) {
    const { id } = await params;
    const cache = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$cache$2f$exerciseCache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getExerciseCache"])();
    const exercise = cache.get(id);
    if (!exercise) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["notFound"])();
    }
    // Retornar o HTML puro
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        dangerouslySetInnerHTML: {
            __html: exercise.html
        }
    }, void 0, false, {
        fileName: "[project]/app/exercise/[id]/page.tsx",
        lineNumber: 22,
        columnNumber: 5
    }, this);
}
async function generateMetadata({ params }) {
    const { id } = await params;
    const cache = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$cache$2f$exerciseCache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getExerciseCache"])();
    const exercise = cache.get(id);
    if (!exercise) {
        return {
            title: 'Exercício não encontrado'
        };
    }
    const typeLabel = exercise.type === 'grid' ? 'Grade' : 'Contextualizado';
    return {
        title: `Exercício ${typeLabel} - Gerador de Matemática`,
        description: `Exercício de matemática com ${exercise.stats.total} problemas`
    };
}
}),
"[project]/app/exercise/[id]/page.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/app/exercise/[id]/page.tsx [app-rsc] (ecmascript)"));
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__2b935de6._.js.map