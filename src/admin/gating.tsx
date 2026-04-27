import React from 'react';

// Lightweight Admin gating scaffold. Non-intrusive and opt-in via env flag.

export function AdminLinks(): JSX.Element {
  // Minimal placeholder admin navigation that can be wired later.
  return (
    <nav aria-label="Admin Navigation" className="bg-slate-50 border-b border-slate-200 px-4 py-2">
      <ul className="flex gap-6 text-xs font-bold uppercase tracking-wider text-slate-600">
        <li><a href="/admin/dashboard" className="hover:text-primary transition-colors cursor-pointer">Dashboard</a></li>
        <li><a href="/admin/users" className="hover:text-primary transition-colors cursor-pointer">Users</a></li>
        <li><a href="/admin/settings" className="hover:text-primary transition-colors cursor-pointer">Settings</a></li>
      </ul>
    </nav>
  );
}

import { isSupabaseConfigured } from "../lib/supabase";
export function AdminStatus(): JSX.Element {
  const configured = isSupabaseConfigured ? isSupabaseConfigured() : false;
  return (
    <div className="px-4 py-1">
      <span
        className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-tighter ${
          configured ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}
      >
        Supabase: {configured ? 'Connected' : 'Disconnected'}
      </span>
    </div>
  );
}

export function AdminGate({ children }: { children: React.ReactNode }): JSX.Element | null {
  const isEnabled = import.meta.env.VITE_ADMIN_GATE === 'true';
  // Optional: check for specific environments if needed
  if (!isEnabled) return null;
  return <>{children}</>;
}

export default AdminLinks;
