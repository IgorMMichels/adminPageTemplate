# Admin Gating + Safe Supabase Client Implementation Plan

**Date:** 2026-04-25
**Status:** Planned / Scaffolding
**Author:** Antigravity (AI Orchestrator)

## 1. Overview
This plan outlines the steps to implement a non-breaking, opt-in admin gating mechanism and a hardened Supabase client initialization. The goal is to prevent accidental leakage of connection strings and ensure that administrative UI elements are only exposed when explicitly enabled via environment variables.

## 2. Objectives & Success Criteria
- **Gated UI**: Admin navigation and status indicators are hidden by default.
- **Safe Initialization**: The Supabase client is initialized lazily and only when configuration is present.
- **Type Safety**: Environment variables are properly typed in the Vite environment.
- **Non-Breaking**: Existing application flows remain functional even if Supabase is unconfigured or gating is disabled.

## 3. Implementation Details

### A. Frontend Gating (`src/admin/gating.tsx`)
- **AdminLinks**: Minimalist navigation for admin-only pages.
- **AdminGate**: A wrapper component that conditionally renders children based on `VITE_ADMIN_GATE`.
- **AdminStatus**: A visual indicator of Supabase configuration state.

### B. Safe Supabase Client (`src/lib/supabase.ts`)
- Use a **Proxy** pattern for the Supabase client to enforce lazy initialization.
- Provide `isSupabaseConfigured()` for runtime checks.
- Throw descriptive errors (without sensitive data) when the client is accessed but not configured.

### C. Environment Typings (`src/typings/vite-env.d.ts`)
- Define `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_ADMIN_GATE`, and `VITE_ADMIN_ENV` as optional strings in `ImportMetaEnv`.

## 4. Patch Guidance

### File: `src/admin/gating.tsx`
```tsx
import React from 'react';
import { isSupabaseConfigured } from "../lib/supabase";

export function AdminLinks(): JSX.Element {
  return (
    <nav aria-label="Admin Navigation" className="bg-slate-50 border-b border-slate-200 px-4 py-2">
      <ul className="flex gap-6 text-xs font-bold uppercase tracking-wider text-slate-600">
        <li><a href="/admin/dashboard" className="hover:text-primary transition-colors">Dashboard</a></li>
        <li><a href="/admin/users" className="hover:text-primary transition-colors">Users</a></li>
        <li><a href="/admin/settings" className="hover:text-primary transition-colors">Settings</a></li>
      </ul>
    </nav>
  );
}

export function AdminStatus(): JSX.Element {
  const configured = isSupabaseConfigured();
  return (
    <div className="px-4 py-1">
      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-tighter ${
        configured ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
      }`}>
        Supabase: {configured ? 'Connected' : 'Disconnected'}
      </span>
    </div>
  );
}

export function AdminGate({ children }: { children: React.ReactNode }): JSX.Element | null {
  const isEnabled = import.meta.env.VITE_ADMIN_GATE === 'true';
  const isDev = import.meta.env.VITE_ADMIN_ENV === 'dev' || !import.meta.env.VITE_ADMIN_ENV;
  
  if (!isEnabled) return null;
  return <>{children}</>;
}
```

### File: `src/lib/supabase.ts`
```typescript
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = (): boolean => {
  return !!(supabaseUrl && supabaseAnonKey);
};

let _supabase: SupabaseClient | null = null;

function getSupabaseClient(): SupabaseClient {
  if (_supabase) return _supabase;
  if (!isConfigured()) {
    throw new Error('Supabase is not configured. Check your environment variables.');
  }
  _supabase = createClient(supabaseUrl as string, supabaseAnonKey as string);
  return _supabase;
}

export const supabase = new Proxy({} as any, {
  get(_target, prop) {
    const client = getSupabaseClient();
    const value = (client as any)[prop];
    return typeof value === 'function' ? value.bind(client) : value;
  }
}) as any;
```

### File: `src/typings/vite-env.d.ts`
```typescript
interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL?: string;
  readonly VITE_SUPABASE_ANON_KEY?: string;
  readonly VITE_ADMIN_GATE?: string;
  readonly VITE_ADMIN_ENV?: 'dev' | 'stage' | 'prod';
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
```

## 5. Verification Plan

### Manual Verification
1. Set `VITE_ADMIN_GATE=true` in `.env`.
2. Verify that the Admin bar (Links + Status) appears at the top of the Index page.
3. Verify that the Status badge correctly reflects the presence of `VITE_SUPABASE_URL`.
4. Set `VITE_ADMIN_GATE=false` and verify the bar disappears.

### Automated Checks
- **Type Check**: Run `npm run type-check` to ensure `import.meta.env` properties are recognized.
- **Unit Test**: Mock `import.meta.env` to verify `AdminGate` behavior.

## 6. Rollback Plan
In case of unexpected regressions:
1. Revert `src/lib/supabase.ts` to use a placeholder client or a direct export.
2. Disable the gate by ensuring `VITE_ADMIN_GATE` is not set to `true` in the production environment.

## 7. Attestation
This plan is designed to be executed by an automated agent or manually. It prioritizes security and stability by decoupling UI exposure from core logic configuration.

**Signed:** Antigravity AI
