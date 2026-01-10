/**
 * Tipos de variáveis de ambiente
 */
declare namespace NodeJS {
  interface ProcessEnv {
    /** Chave de API do Google Gemini */
    GEMINI_API_KEY: string;
    /** Modelo do Gemini a ser usado (opcional, padrão: gemini-2.0-flash-exp) */
    GEMINI_MODEL?: string;
  }
}
