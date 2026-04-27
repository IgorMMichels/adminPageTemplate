/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL?: string;
  readonly VITE_SUPABASE_ANON_KEY?: string;
  readonly VITE_ADMIN_GATE?: string;
  readonly VITE_ADMIN_ENV?: 'dev' | 'stage' | 'prod';
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
