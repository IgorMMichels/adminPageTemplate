# Admin Template Design — 2026-04-26

## Overview

Convert the existing "Solus Motobombas" frontend project into a **reusable admin template** for future projects. All Solus-specific content is removed. The admin panel is preserved as a generic, configurable template. A new clean landing page reads content from localStorage (Supabase-ready shape) with hardcoded placeholders as fallback. All work is done **locally with no network access** — Supabase schema is prepared for future projects to deploy.

---

## Tech Stack (unchanged)

- **Build**: Vite 5 + TypeScript
- **UI**: React 18 + shadcn-ui + Tailwind CSS v4 + Radix UI primitives
- **Routing**: React Router DOM v6
- **State**: TanStack Query v5 + React Context
- **Backend-ready**: Supabase JS v2 (schema prepared, not called locally)

---

## Part 1: Files to DELETE (Solus Frontend)

All Solus-specific frontend content is removed entirely:

```
DELETE src/pages/Index.tsx
DELETE src/pages/Products.tsx
DELETE src/pages/Services.tsx
DELETE src/pages/NotFound.tsx

DELETE src/components/Hero.tsx
DELETE src/components/Header.tsx
DELETE src/components/Footer.tsx
DELETE src/components/Features.tsx
DELETE src/components/Clients.tsx
DELETE src/components/Brands.tsx
DELETE src/components/CTA.tsx
DELETE src/components/ContactForm.tsx
DELETE src/components/ContactForm.backup.tsx
DELETE src/components/Company.tsx
DELETE src/components/ImpactAreas.tsx
DELETE src/components/NavLink.tsx
DELETE src/components/ServicesHome.tsx
DELETE src/components/VideoSection.tsx
DELETE src/components/WhatsAppButton.tsx

# Data files are KEPT but modified with generic placeholders (see Part 7)
# DELETE src/data/siteConfig.ts          ← KEPT, modified
# DELETE src/data/productsData.ts       ← KEPT, modified
# DELETE src/data/clientBrands.ts      ← KEPT, modified
# DELETE src/data/supplierBrands.ts   ← KEPT, modified

DELETE src/hooks/usePublicData.ts

DELETE src/assets/ (all Solus images)
```

---

## Part 2: Files to MODIFY

### `src/App.tsx`
- Remove all public routes (`/`, `/products`, `/services`)
- Add single landing route: `<Route path="/" element={<Landing />} />`
- Keep all `/admin/*` routes unchanged

### `src/index.css`
- Remove Solus comment header (`/* Brand Colors - Solus Motobombas */`)
- Keep all Tailwind/shadcn utility classes and CSS variables

### `src/admin/context/AdminContext.tsx`
- Change `STORAGE_KEYS` prefixes: `solus_` → `admin_`
  - `solus_admin_user` → `admin_user`
  - `solus_site_config` → `admin_site_config`
  - `solus_products` → `admin_products`
  - `solus_categories` → `admin_categories`
  - `solus_clients` → `admin_clients`
  - `solus_suppliers` → `admin_suppliers`
  - `solus_services` → `admin_services`
  - `solus_service_images` → `admin_service_images`
  - `solus_admin_password` → `admin_password`
- Change `getAdminCredentials()`:
  - username: `Felipe Salvador` → `admin`
  - password: `admin123` → `0000`
- Replace all Solus default data with generic placeholders (empty arrays or neutral strings)
- Keep all CRUD logic and Supabase integration intact

### `src/admin/pages/AdminLogin.tsx`
- Remove "Solus Motobombas" text and logo reference
- Change title to "Painel Administrativo" or "Admin Panel"
- Keep layout/structure identical

### `src/admin/components/AdminHeader.tsx`
- Remove "Solus Motobombas" branding text
- Use generic "Admin Panel" or project name from config

### `src/admin/components/AdminSidebar.tsx`
- Remove "Solus Admin" text
- Use generic "Admin" branding

### `src/lib/supabase.ts`
- Keep connection logic as-is (generic enough)
- Ensure no Solus references in comments

### `src/index.html` (root)
- Change title from "Solus Motobombas | Reinventar para ser Solus" to "Admin Template"
- Update og:title and meta description to generic content

---

## Part 3: New Landing Page (`src/pages/Landing.tsx`)

### Data Shape (matches future Supabase `landing_page` table)

```typescript
interface LandingPageData {
  title: string;
  description: string;
  logo_url?: string;
  cta_text: string;
  cta_link: string;
}
```

### localStorage Key
- Key: `landing_page`
- Stored as JSON string
- Same shape as future Supabase row

### Fallback (hardcoded placeholders)
```typescript
const DEFAULT_LANDING = {
  title: "Your Project Name",
  description: "A modern admin template for your next project.",
  logo_url: undefined,
  cta_text: "Go to Admin",
  cta_link: "/admin/login",
};
```

### Layout (shadcn components)
```
Page Container (min-h-screen, gradient background)
├── Hero Section (centered)
│   ├── Logo (from localStorage → fallback: Gear icon / generic)
│   ├── Title (text-4xl, font-bold)
│   ├── Description (text-muted-foreground, max-w-2xl)
│   └── CTA Button → /admin/login (variant="default", size="lg")
├── Features Section (3-column grid)
│   ├── Card: "Admin Panel" → manage content via dashboard
│   ├── Card: "Supabase Ready" → connect your own Supabase instance
│   └── Card: "Reusable Template" → built for future projects
└── Footer (minimal, text-center, text-sm text-muted-foreground)
```

### Behavior
- On mount: reads `localStorage.getItem('landing_page')`
- If found and valid JSON → use it
- If not found → use `DEFAULT_LANDING`
- No network calls, no Supabase access
- Future projects can update via admin Settings or directly in localStorage

---

## Part 4: Supabase Schema (`supabase/schema.sql`)

All tables kept for template use. New table added:

```sql
-- New table for landing page content
CREATE TABLE IF NOT EXISTS landing_page (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL DEFAULT 'Your Project Name',
  description TEXT NOT NULL DEFAULT 'A modern admin template for your next project.',
  logo_url TEXT,
  cta_text TEXT NOT NULL DEFAULT 'Go to Admin',
  cta_link TEXT NOT NULL DEFAULT '/admin/login',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS (future projects configure policies)
ALTER TABLE landing_page ENABLE ROW LEVEL SECURITY;
```

Existing tables kept: `products`, `categories`, `clients`, `suppliers`, `services`, `service_images`, `site_config`, `messages`. Future projects run this full schema to set up their instance.

---

## Part 5: Integration Guidelines (`INTEGRATION_GUIDELINES.md`)

New file at project root. Covers:

1. **Quick Start** — clone, npm install, npm run dev, login at /admin/login (admin/0000)
2. **Connecting Supabase** — create project, run schema.sql, set .env vars (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_ADMIN_USERNAME`, `VITE_ADMIN_PASSWORD`)
3. **Customizing Landing Page** — via admin panel (after Supabase) or localStorage (local dev)
4. **Changing Admin Credentials** — via .env or admin panel
5. **Removing Unused Admin Sections** — delete page files, remove routes from App.tsx, remove related hooks

---

## Part 6: README.md

Replace Lovable-generated README with:

```markdown
# Admin Page Template

A reusable admin template built with Vite, React, shadcn-ui, and Tailwind CSS.
Ready to connect to your own Supabase project.

## Tech Stack
- Vite + React 18 + TypeScript
- shadcn-ui + Tailwind CSS v4
- React Router DOM v6
- TanStack Query v5
- Supabase-ready

## Quick Start
1. `npm install`
2. `npm run dev`
3. Visit http://localhost:5173
4. Login: admin / 0000

## Admin Sections
- Dashboard
- Products
- Messages
- Settings
- Clients
- Suppliers
- Services
- Service Images
- Categories
- Change Password

## Customization
See INTEGRATION_GUIDELINES.md for connecting to your Supabase project
and customizing the landing page for your needs.
```

---

## Part 7: Generic Placeholder Data

### `src/data/siteConfig.ts`
- `company.name`: `"Your Company Name"`
- `hero.title`: `"Your Hero Title"`
- `about.title`: `"About Us"`
- All Solus-specific text replaced with neutral placeholders

### `src/data/productsData.ts`
- Replace with empty array: `[]`

### `src/data/clientBrands.ts`
- Replace with empty array: `[]`

### `src/data/supplierBrands.ts`
- Replace with empty array: `[]`

---

## Summary of Changes

| Category | Action | Count |
|----------|--------|-------|
| Delete files | Solus frontend pages, components, data, hooks, assets | ~25 files |
| Modify files | App.tsx, AdminContext.tsx, Login, Header, Sidebar, index.html, index.css | ~8 files |
| New files | Landing.tsx, INTEGRATION_GUIDELINES.md, updated README.md, design doc | 4 files |
| Schema | Add `landing_page` table to schema.sql | 1 table added |

All work is **local only** — no network access, no Supabase calls during development.
