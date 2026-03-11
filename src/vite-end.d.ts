/// <reference types="vite/client" />
declare const GITHUB_RUNTIME_PERMANENT_NAME: string
declare const BASE_KV_SERVICE_URL: string

interface ImportMetaEnv {
  // ── Backend (injected at build time by vite.config.ts define block) ────────
  readonly API_URL?: string
  readonly WS_URL?: string

  // ── Supabase (standard Vercel integration names, via NEXT_PUBLIC_ envPrefix) ─
  readonly NEXT_PUBLIC_SUPABASE_URL?: string
  readonly NEXT_PUBLIC_SUPABASE_ANON_KEY?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

interface UserInfo {
  avatarUrl: string
  email: string
  id: string
  isOwner: boolean
  login: string
}

declare global {
  interface Window {
    spark: {
      llmPrompt: (strings: readonly string[] | TemplateStringsArray, ...values: unknown[]) => string
      llm: (prompt: string, modelName?: string, jsonMode?: boolean) => Promise<string>
      user: () => Promise<UserInfo>
      kv: {
        keys: () => Promise<string[]>
        get: <T>(key: string) => Promise<T | undefined>
        set: <T>(key: string, value: T) => Promise<void>
        delete: (key: string) => Promise<void>
      }
    }
  }
}