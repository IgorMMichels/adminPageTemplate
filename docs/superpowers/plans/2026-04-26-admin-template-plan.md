# Admin Template Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Convert the existing Solus Motobombas frontend project into a clean, reusable admin template with generic landing page, removed Solus branding, and Supabase-ready schema for future projects.

**Architecture:** Delete all Solus-specific frontend files (pages, components, data, assets). Modify admin files to use generic `admin_` storage keys and `admin`/`0000` credentials. Create a new Landing page that reads from localStorage (same shape as future Supabase `landing_page` table). All work is local-only — no network access. Schema.sql is updated for future project deployments.

**Tech Stack:** Vite 5, React 18, TypeScript, shadcn-ui, Tailwind CSS v4, React Router DOM v6, TanStack Query v5, Supabase JS v2 (schema only)

---

## File Structure

### Files to CREATE:
| File | Responsibility |
|------|---------------|
| `src/pages/Landing.tsx` | Landing page reading from localStorage with fallback placeholders |
| `INTEGRATION_GUIDELINES.md` | Guide for future projects to connect Supabase and customize |
| `README.md` | Updated project README (replaces Lovable-generated version) |

### Files to MODIFY:
| File | Responsibility |
|------|---------------|
| `src/data/siteConfig.ts` | Replace Solus defaults with generic placeholders |
| `src/data/productsData.ts` | Replace with empty array |
| `src/data/clientBrands.ts` | Replace with empty array |
| `src/data/supplierBrands.ts` | Replace with empty array |
| `src/App.tsx` | Remove public routes, add Landing route |
| `src/admin/context/AdminContext.tsx` | Change storage keys `solus_` → `admin_`, credentials to `admin`/`0000`, generic defaults |
| `src/admin/pages/AdminLogin.tsx` | Remove "Solus Motobombas" text, use generic branding |
| `src/admin/components/AdminHeader.tsx` | Remove "Solus Motobombas" branding |
| `src/admin/components/AdminSidebar.tsx` | Remove "Solus Admin" text |
| `index.html` | Generic title and meta tags |
| `src/index.css` | Remove Solus comment |
| `supabase/schema.sql` | Add `landing_page` table |

### Files to DELETE:
| File | Reason |
|------|--------|
| `src/pages/Index.tsx` | Solus frontend page |
| `src/pages/Products.tsx` | Solus frontend page |
| `src/pages/Services.tsx` | Solus frontend page |
| `src/pages/NotFound.tsx` | Solus frontend page |
| `src/components/Hero.tsx` | Solus component |
| `src/components/Header.tsx` | Solus component |
| `src/components/Footer.tsx` | Solus component |
| `src/components/Features.tsx` | Solus component |
| `src/components/Clients.tsx` | Solus component |
| `src/components/Brands.tsx` | Solus component |
| `src/components/CTA.tsx` | Solus component |
| `src/components/ContactForm.tsx` | Solus component |
| `src/components/ContactForm.backup.tsx` | Solus component |
| `src/components/Company.tsx` | Solus component |
| `src/components/ImpactAreas.tsx` | Solus component |
| `src/components/NavLink.tsx` | Solus component |
| `src/components/ServicesHome.tsx` | Solus component |
| `src/components/VideoSection.tsx` | Solus component |
| `src/components/WhatsAppButton.tsx` | Solus component |
| `src/hooks/usePublicData.ts` | Solus hook |
| `src/assets/` (all files) | Solus images |

---

### Task 1: Update siteConfig.ts with generic placeholders

**Files:**
- Modify: `src/data/siteConfig.ts`

- [ ] **Step 1: Replace file with generic placeholder data**

```typescript
export interface SEOConfig {
  title: string;
  description: string;
  keywords: string[];
}

export interface HeroConfig {
  title: string;
  subtitle: string;
  description: string;
  image: string;
}

export interface AboutConfig {
  title: string;
  subtitle: string;
  description: string;
  image: string;
}

export interface FeaturesConfig {
  title: string;
  subtitle: string;
  items: FeatureItem[];
}

export interface FeatureItem {
  icon: string;
  title: string;
  description: string;
}

export interface ProductsConfig {
  title: string;
  subtitle: string;
  description: string;
}

export interface ServicesConfig {
  title: string;
  subtitle: string;
  description: string;
}

export interface ContactConfig {
  title: string;
  subtitle: string;
  address: string;
  phone: string;
  email: string;
}

export interface FooterConfig {
  description: string;
  copyright: string;
}

export interface SiteConfig {
  company: {
    name: string;
    tagline: string;
    description: string;
    logo: string;
  };
  hero: HeroConfig;
  about: AboutConfig;
  features: FeaturesConfig;
  products: ProductsConfig;
  services: ServicesConfig;
  contact: ContactConfig;
  footer: FooterConfig;
  seo: SEOConfig;
}

export const defaultSiteConfig: SiteConfig = {
  company: {
    name: "Your Company Name",
    tagline: "Your Tagline Here",
    description: "Brief description of your company and what you do.",
    logo: "/placeholder.svg",
  },
  hero: {
    title: "Your Hero Title",
    subtitle: "Your Hero Subtitle",
    description: "A brief description of your main value proposition.",
    image: "/placeholder.svg",
  },
  about: {
    title: "About Us",
    subtitle: "Learn more about what we do",
    description: "A brief description of your company's mission and values.",
    image: "/placeholder.svg",
  },
  features: {
    title: "Our Features",
    subtitle: "What makes us different",
    description: "A brief overview of the key features you offer.",
    items: [
      { icon: "Star", title: "Feature 1", description: "Description of feature 1." },
      { icon: "Shield", title: "Feature 2", description: "Description of feature 2." },
      { icon: "Zap", title: "Feature 3", description: "Description of feature 3." },
    ],
  },
  products: {
    title: "Our Products",
    subtitle: "What we offer",
    description: "A brief overview of the products you provide.",
  },
  services: {
    title: "Our Services",
    subtitle: "What we do",
    description: "A brief overview of the services you offer.",
  },
  contact: {
    title: "Contact Us",
    subtitle: "Get in touch",
    address: "Your Address Here",
    phone: "(00) 0000-0000",
    email: "contact@example.com",
  },
  footer: {
    description: "A brief description for the footer area.",
    copyright: "© 2026 Your Company Name. All rights reserved.",
  },
  seo: {
    title: "Your Company Name",
    description: "Description for search engines and social media.",
    keywords: ["keyword1", "keyword2", "keyword3"],
  },
};
```

- [ ] **Step 2: Verify the file loads without errors**

Run: `npx tsc --noEmit src/data/siteConfig.ts`
Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add src/data/siteConfig.ts
git commit -m "refactor: replace siteConfig with generic placeholders"
```

---

### Task 2: Update productsData.ts with empty array

**Files:**
- Modify: `src/data/productsData.ts`

- [ ] **Step 1: Replace file with empty array**

```typescript
export interface Product {
  id: string;
  name: string;
  shortDescription: string;
  fullDescription: string;
  category: string;
  subcategory?: string;
  image: string;
  specs: string[];
  applications: string[];
  brand: string;
  featured: boolean;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  count: number;
  image: string;
}

export const products: Product[] = [];
export const categories: Category[] = [];
```

- [ ] **Step 2: Verify the file loads without errors**

Run: `npx tsc --noEmit src/data/productsData.ts`
Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add src/data/productsData.ts
git commit -m "refactor: replace productsData with empty arrays"
```

---

### Task 3: Update clientBrands.ts and supplierBrands.ts with empty arrays

**Files:**
- Modify: `src/data/clientBrands.ts`
- Modify: `src/data/supplierBrands.ts`

- [ ] **Step 1: Replace clientBrands.ts with empty array**

```typescript
export interface ClientBrand {
  name: string;
  logo: string;
}

export const clientBrands: ClientBrand[] = [];
```

- [ ] **Step 2: Replace supplierBrands.ts with empty array**

```typescript
export interface SupplierBrand {
  name: string;
  logo: string;
}

export const supplierBrands: SupplierBrand[] = [];
```

- [ ] **Step 3: Verify both files load without errors**

Run: `npx tsc --noEmit src/data/clientBrands.ts src/data/supplierBrands.ts`
Expected: No errors.

- [ ] **Step 4: Commit**

```bash
git add src/data/clientBrands.ts src/data/supplierBrands.ts
git commit -m "refactor: replace client and supplier data with empty arrays"
```

---

### Task 4: Create Landing.tsx page

**Files:**
- Create: `src/pages/Landing.tsx`

- [ ] **Step 1: Create the Landing page component**

```tsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Gear, Database, Template } from 'lucide-react';

interface LandingPageData {
  title: string;
  description: string;
  logo_url?: string;
  cta_text: string;
  cta_link: string;
}

const DEFAULT_LANDING: LandingPageData = {
  title: "Your Project Name",
  description: "A modern admin template for your next project.",
  logo_url: undefined,
  cta_text: "Go to Admin",
  cta_link: "/admin/login",
};

export default function Landing() {
  const [data, setData] = useState<LandingPageData>(DEFAULT_LANDING);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('landing_page');
      if (stored) {
        const parsed = JSON.parse(stored);
        setData({ ...DEFAULT_LANDING, ...parsed });
      }
    } catch (e) {
      console.error('Failed to parse landing_page from localStorage:', e);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col">
      {/* Header */}
      <header className="w-full border-b border-slate-200 bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          {data.logo_url ? (
            <img src={data.logo_url} alt="Logo" className="h-10 w-auto object-contain" />
          ) : (
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Gear className="h-6 w-6 text-primary" />
            </div>
          )}
          <Button asChild variant="outline" size="sm">
            <Link to="/admin/login">Admin Login</Link>
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            {data.logo_url ? (
              <img src={data.logo_url} alt="Logo" className="h-20 w-auto object-contain mx-auto" />
            ) : (
              <div className="mx-auto h-20 w-20 rounded-2xl bg-primary/10 flex items-center justify-center">
                <Gear className="h-10 w-10 text-primary" />
              </div>
            )}
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900">
              {data.title}
            </h1>
            <p className="text-lg md:text-xl text-slate-600 max-w-xl mx-auto">
              {data.description}
            </p>
          </div>

          <Button asChild size="lg" className="text-lg px-8">
            <Link to={data.cta_link}>{data.cta_text}</Link>
          </Button>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12">
            <Card className="border-slate-200 shadow-sm">
              <CardContent className="pt-6 text-center space-y-3">
                <div className="mx-auto h-12 w-12 rounded-lg bg-blue-50 flex items-center justify-center">
                  <Gear className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-slate-900">Admin Panel</h3>
                <p className="text-sm text-slate-600">
                  Manage your project content, products, and settings via a modern admin dashboard.
                </p>
              </CardContent>
            </Card>

            <Card className="border-slate-200 shadow-sm">
              <CardContent className="pt-6 text-center space-y-3">
                <div className="mx-auto h-12 w-12 rounded-lg bg-green-50 flex items-center justify-center">
                  <Database className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-slate-900">Supabase Ready</h3>
                <p className="text-sm text-slate-600">
                  Connect your own Supabase instance and deploy with full backend support.
                </p>
              </CardContent>
            </Card>

            <Card className="border-slate-200 shadow-sm">
              <CardContent className="pt-6 text-center space-y-3">
                <div className="mx-auto h-12 w-12 rounded-lg bg-purple-50 flex items-center justify-center">
                  <Template className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="font-semibold text-slate-900">Reusable Template</h3>
                <p className="text-sm text-slate-600">
                  Built as a template for future projects. Clean, configurable, and ready to go.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-slate-200 bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-slate-500">
          &copy; 2026 {data.title}. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
```

- [ ] **Step 2: Verify the file compiles**

Run: `npx tsc --noEmit src/pages/Landing.tsx`
Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add src/pages/Landing.tsx
git commit -m "feat: add generic landing page with localStorage support"
```

---

### Task 5: Update App.tsx — remove public routes, add Landing route

**Files:**
- Modify: `src/App.tsx`

- [ ] **Step 1: Replace App.tsx with cleaned routes**

```tsx
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";

// Landing
import Landing from "./pages/Landing";

// Admin imports
import {
  AdminProvider,
  AdminLayout,
  AdminLogin,
  AdminDashboard,
  AdminProducts,
  AdminMessages,
  AdminSettings,
  AdminClients,
  AdminSuppliers,
  AdminServices,
  AdminServiceImages,
  AdminChangePassword,
  AdminCategories,
} from "./admin";

const queryClient = new QueryClient();

const ScrollToTop = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      setTimeout(() => {
        const element = document.querySelector(hash);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);

  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AdminProvider>
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            {/* Landing Page */}
            <Route path="/" element={<Landing />} />

            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="messages" element={<AdminMessages />} />
              <Route path="settings" element={<AdminSettings />} />
              <Route path="clients" element={<AdminClients />} />
              <Route path="suppliers" element={<AdminSuppliers />} />
              <Route path="services" element={<AdminServices />} />
              <Route path="service-images" element={<AdminServiceImages />} />
              <Route path="categories" element={<AdminCategories />} />
              <Route path="change-password" element={<AdminChangePassword />} />
            </Route>

            {/* Catch-all */}
            <Route path="*" element={<Landing />} />
          </Routes>
        </BrowserRouter>
      </AdminProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
```

- [ ] **Step 2: Verify the file compiles**

Run: `npx tsc --noEmit src/App.tsx`
Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add src/App.tsx
git commit -m "refactor: remove public routes, add landing page route"
```

---

### Task 6: Update AdminContext.tsx — generic credentials and storage keys

**Files:**
- Modify: `src/admin/context/AdminContext.tsx`

- [ ] **Step 1: Update getAdminCredentials and STORAGE_KEYS**

Replace lines 96-112:

```typescript
// Read credentials from env, fallback to defaults
const getAdminCredentials = () => ({
  username: import.meta.env.VITE_ADMIN_USERNAME || 'admin',
  password: import.meta.env.VITE_ADMIN_PASSWORD || '0000',
});

const STORAGE_KEYS = {
  user: 'admin_user',
  siteConfig: 'admin_site_config',
  products: 'admin_products',
  categories: 'admin_categories',
  clients: 'admin_clients',
  suppliers: 'admin_suppliers',
  services: 'admin_services',
  serviceImages: 'admin_service_images',
  password: 'admin_password',
};
```

- [ ] **Step 2: Update defaultServices to generic placeholder**

Replace lines 115-125:

```typescript
// Default services (generic placeholder)
const defaultServices: ServiceItem[] = [
  { id: 'service-1', title: "Service 1", description: "Description of service 1.", icon: 'Gear', order: 0 },
  { id: 'service-2', title: "Service 2", description: "Description of service 2.", icon: 'Star', order: 1 },
  { id: 'service-3', title: "Service 3", description: "Description of service 3.", icon: 'Zap', order: 2 },
];
```

- [ ] **Step 3: Verify the file compiles**

Run: `npx tsc --noEmit src/admin/context/AdminContext.tsx`
Expected: No errors.

- [ ] **Step 4: Commit**

```bash
git add src/admin/context/AdminContext.tsx
git commit -m "refactor: update admin credentials to admin/0000 and generic storage keys"
```

---

### Task 7: Update AdminLogin.tsx — remove Solus branding

**Files:**
- Modify: `src/admin/pages/AdminLogin.tsx`

- [ ] **Step 1: Replace lines 42-46 with generic branding**

```tsx
// Replace the img and CardDescription:
<div className="mx-auto h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center">
  <Gear className="h-8 w-8 text-primary" />
</div>
<div>
  <CardTitle className="text-2xl font-bold">Admin Panel</CardTitle>
  <CardDescription>Sign in to your admin dashboard</CardDescription>
</div>
```

- [ ] **Step 2: Remove the Lock import if not used elsewhere, keep User**

Keep imports as: `import { Button } from '@/components/ui/button';` etc. — `Gear` from `lucide-react`.

- [ ] **Step 3: Verify the file compiles**

Run: `npx tsc --noEmit src/admin/pages/AdminLogin.tsx`
Expected: No errors.

- [ ] **Step 4: Commit**

```bash
git add src/admin/pages/AdminLogin.tsx
git commit -m "refactor: remove Solus branding from admin login page"
```

---

### Task 8: Update AdminHeader.tsx and AdminSidebar.tsx — remove Solus branding

**Files:**
- Modify: `src/admin/components/AdminHeader.tsx`
- Modify: `src/admin/components/AdminSidebar.tsx`

- [ ] **Step 1: Update AdminHeader.tsx — replace Solus branding**

Find line with "Solus Motobombas" and replace:

```tsx
// Look for the brand text in the header, replace with:
<div className="flex items-center gap-2">
  <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
    <Gear className="h-4 w-4 text-primary" />
  </div>
  <span className="font-semibold">Admin Panel</span>
</div>
```

- [ ] **Step 2: Update AdminSidebar.tsx — replace "Solus Admin"**

Find line with "Solus Admin" and replace:

```tsx
// Replace the sidebar header text:
<div className="flex items-center gap-2 px-2">
  <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
    <Gear className="h-4 w-4 text-primary" />
  </div>
  <span className="font-semibold text-sm">Admin Panel</span>
</div>
```

- [ ] **Step 3: Verify both files compile**

Run: `npx tsc --noEmit src/admin/components/AdminHeader.tsx src/admin/components/AdminSidebar.tsx`
Expected: No errors.

- [ ] **Step 4: Commit**

```bash
git add src/admin/components/AdminHeader.tsx src/admin/components/AdminSidebar.tsx
git commit -m "refactor: remove Solus branding from admin header and sidebar"
```

---

### Task 9: Update index.html (root) — generic title and meta

**Files:**
- Modify: `index.html`

- [ ] **Step 1: Replace title and meta tags**

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Admin Template</title>
    <meta name="description" content="A reusable admin template built with Vite, React, and shadcn-ui." />
    
    <!-- Open Graph -->
    <meta property="og:title" content="Admin Template" />
    <meta property="og:description" content="A modern admin template for your next project." />
    <meta property="og:type" content="website" />
    
    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="Admin Template" />
    <meta name="twitter:description" content="A modern admin template for your next project." />
    
    <script type="module" src="/src/main.tsx"></script>
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>
```

- [ ] **Step 2: Commit**

```bash
git add index.html
git commit -m "refactor: update index.html with generic title and meta tags"
```

---

### Task 10: Update src/index.css — remove Solus comment

**Files:**
- Modify: `src/index.css`

- [ ] **Step 1: Remove the Solus comment**

Find and remove:
```css
/* Brand Colors - Solus Motobombas */
```

Keep all CSS variables and Tailwind directives intact.

- [ ] **Step 2: Commit**

```bash
git add src/index.css
git commit -m "refactor: remove Solus comment from index.css"
```

---

### Task 11: Delete all Solus frontend files

**Files:**
- Delete: `src/pages/Index.tsx`
- Delete: `src/pages/Products.tsx`
- Delete: `src/pages/Services.tsx`
- Delete: `src/pages/NotFound.tsx`
- Delete: `src/components/Hero.tsx`
- Delete: `src/components/Header.tsx`
- Delete: `src/components/Footer.tsx`
- Delete: `src/components/Features.tsx`
- Delete: `src/components/Clients.tsx`
- Delete: `src/components/Brands.tsx`
- Delete: `src/components/CTA.tsx`
- Delete: `src/components/ContactForm.tsx`
- Delete: `src/components/ContactForm.backup.tsx`
- Delete: `src/components/Company.tsx`
- Delete: `src/components/ImpactAreas.tsx`
- Delete: `src/components/NavLink.tsx`
- Delete: `src/components/ServicesHome.tsx`
- Delete: `src/components/VideoSection.tsx`
- Delete: `src/components/WhatsAppButton.tsx`
- Delete: `src/hooks/usePublicData.ts`
- Delete: `src/assets/` (entire directory)

- [ ] **Step 1: Delete all files**

```bash
cd "C:\Users\igor\Desktop\adminPageTemplate"
rm src/pages/Index.tsx
rm src/pages/Products.tsx
rm src/pages/Services.tsx
rm src/pages/NotFound.tsx
rm src/components/Hero.tsx
rm src/components/Header.tsx
rm src/components/Footer.tsx
rm src/components/Features.tsx
rm src/components/Clients.tsx
rm src/components/Brands.tsx
rm src/components/CTA.tsx
rm src/components/ContactForm.tsx
rm src/components/ContactForm.backup.tsx
rm src/components/Company.tsx
rm src/components/ImpactAreas.tsx
rm src/components/NavLink.tsx
rm src/components/ServicesHome.tsx
rm src/components/VideoSection.tsx
rm src/components/WhatsAppButton.tsx
rm src/hooks/usePublicData.ts
rm -rf src/assets/
```

- [ ] **Step 2: Verify deletion**

Run: `ls src/pages/ && ls src/components/ && ls src/hooks/ && ls src/assets/ 2>&1`
Expected: Only `Landing.tsx` in pages/, only admin-related components in components/, only admin hooks in hooks/, `No such file or directory` for assets.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "refactor: delete all Solus frontend files and assets"
```

---

### Task 12: Update schema.sql — add landing_page table

**Files:**
- Modify: `supabase/schema.sql`

- [ ] **Step 1: Add landing_page table to schema**

Append to the end of `supabase/schema.sql`:

```sql
-- Landing page content table
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

-- Insert default row
INSERT INTO landing_page (title, description) VALUES ('Your Project Name', 'A modern admin template for your next project.')
ON CONFLICT DO NOTHING;
```

- [ ] **Step 2: Commit**

```bash
git add supabase/schema.sql
git commit -m "feat: add landing_page table to schema for future projects"
```

---

### Task 13: Create INTEGRATION_GUIDELINES.md

**Files:**
- Create: `INTEGRATION_GUIDELINES.md`

- [ ] **Step 1: Create the integration guidelines document**

```markdown
# Integration Guidelines - Admin Template

## Quick Start (New Project)

1. Clone this template
   ```bash
   git clone <your-repo-url>
   cd <project-name>
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Start development server
   ```bash
   npm run dev
   ```

4. Access the admin panel
   - Go to http://localhost:5173
   - Login: `admin` / `0000`

---

## Connecting Your Supabase Project

### 1. Create a Supabase Project
- Go to https://supabase.com and create a new project
- Save your project URL and anon key

### 2. Run the Database Schema
- Open the SQL Editor in your Supabase project dashboard
- Copy the contents of `supabase/schema.sql`
- Paste and run it in the SQL Editor
- This creates all necessary tables: `landing_page`, `site_config`, `products`, `categories`, `clients`, `suppliers`, `services`, `service_images`, `messages`

### 3. Configure Environment Variables
Create a `.env` file in the project root:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_ADMIN_USERNAME=your-admin-username
VITE_ADMIN_PASSWORD=your-admin-password
```

### 4. Restart Development Server
```bash
npm run dev
```

---

## Customizing the Landing Page

### Option A: Via Admin Panel (After Supabase Connected)
1. Login to `/admin/login`
2. Go to Settings
3. Update landing page fields (title, description, logo URL, CTA text)

### Option B: Via localStorage (Local Development)
In your browser console:
```javascript
localStorage.setItem('landing_page', JSON.stringify({
  title: "My Project",
  description: "My project description here.",
  logo_url: "/my-logo.png",
  cta_text: "Get Started",
  cta_link: "/admin/login"
}));
// Then refresh the page
```

---

## Changing Admin Credentials

### Via Environment Variables (Recommended)
Set in your `.env` file:
```env
VITE_ADMIN_USERNAME=myusername
VITE_ADMIN_PASSWORD=mypassword
```

### Via Admin Panel
1. Login to admin
2. Go to "Change Password"
3. Enter current password (`0000`) and new password

---

## Removing Unused Admin Sections

If your project doesn't need certain admin sections (Products, Clients, Suppliers, Services, etc.):

1. Delete the corresponding page file in `src/admin/pages/`
2. Remove the route from `src/App.tsx`
3. Remove related hooks in `src/admin/hooks/`
4. Remove related imports from `src/admin/index.ts`

Example - removing Products section:
```bash
rm src/admin/pages/AdminProducts.tsx
# Then edit src/App.tsx to remove the products route
# Then edit src/admin/index.ts to remove the export
```

---

## Deployment

### Build for Production
```bash
npm run build
```

The output will be in the `dist/` directory.

### Deploy to Vercel
1. Push your code to GitHub
2. Import the project in Vercel
3. Set environment variables in Vercel project settings
4. Deploy!

---

## Project Structure
```
src/
├── admin/          # Admin panel (keep this)
│   ├── components/
│   ├── context/
│   ├── hooks/
│   ├── pages/
│   └── index.ts
├── components/     # (add your own shared components here)
├── pages/
│   └── Landing.tsx  # Landing page (customize for your project)
├── lib/
│   └── supabase.ts
├── data/           # (add your own data files here)
└── App.tsx         # Main app with routes
```

---

## Support

This template uses:
- **Vite** - Build tool
- **React 18** - UI library
- **shadcn-ui** - Component library
- **Tailwind CSS v4** - Styling
- **Supabase** - Backend (connect your own)
```

- [ ] **Step 2: Commit**

```bash
git add INTEGRATION_GUIDELINES.md
git commit -m "docs: add integration guidelines for future projects"
```

---

### Task 14: Update README.md

**Files:**
- Modify: `README.md`

- [ ] **Step 1: Replace README with template-appropriate content**

```markdown
# Admin Page Template

A reusable admin template built with Vite, React, shadcn-ui, and Tailwind CSS. Ready to connect to your own Supabase project.

## Tech Stack
- **Build Tool**: Vite 5 + TypeScript
- **Frontend**: React 18
- **UI Library**: shadcn-ui + Tailwind CSS v4 + Radix UI
- **Routing**: React Router DOM v6
- **State Management**: TanStack Query v5 + React Context
- **Backend Ready**: Supabase JS v2

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Visit http://localhost:5173 to see the landing page.

## Admin Access

- **URL**: http://localhost:5173/admin/login
- **Username**: `admin`
- **Password**: `0000`

## Admin Sections

- **Dashboard** - Overview and statistics
- **Products** - Manage product catalog
- **Messages** - View contact form submissions
- **Settings** - Configure site content and landing page
- **Clients** - Manage client logos
- **Suppliers** - Manage supplier logos
- **Services** - Manage service offerings
- **Service Images** - Manage service gallery
- **Categories** - Manage product categories
- **Change Password** - Update admin password

## Customization

### Landing Page
The landing page reads content from `localStorage` (key: `landing_page`) with fallback to placeholder text. After connecting Supabase, you can update it via the Admin Settings page.

### Connecting Supabase
See [INTEGRATION_GUIDELINES.md](./INTEGRATION_GUIDELINES.md) for step-by-step instructions on connecting your own Supabase project.

### Removing Unused Sections
If you don't need certain admin sections, delete the corresponding files in `src/admin/pages/` and remove the routes from `src/App.tsx`.

## Building for Production

```bash
npm run build
```

Output will be in the `dist/` directory.

## Project Structure

```
src/
├── admin/          # Admin panel
├── pages/
│   └── Landing.tsx  # Customizable landing page
├── components/     # Shared components (add your own)
├── lib/
│   └── supabase.ts
├── data/           # Data files (customize for your project)
└── App.tsx
```

---

Made with ❤️ using [shadcn-ui](https://ui.shadcn.com/) and [Vite](https://vitejs.dev/).
```

- [ ] **Step 2: Commit**

```bash
git add README.md
git commit -m "docs: update README for admin template"
```

---

## Self-Review Checklist

**1. Spec coverage:**
- [x] Delete all Solus frontend files → Task 11
- [x] Remove Solus references from admin files → Tasks 6, 7, 8
- [ ] Create clean landing page → Task 4
- [x] Update credentials to admin/0000 → Task 6
- [x] Generic placeholder data → Tasks 1, 2, 3
- [x] Add landing_page table to schema → Task 12
- [x] Create INTEGRATION_GUIDELINES.md → Task 13
- [x] Update README.md → Task 14
- [x] Update index.html with generic content → Task 9
- [x] Remove Solus comment from CSS → Task 10

**2. Placeholder scan:** No TBD, TODO, or incomplete sections found.

**3. Type consistency:** All types and interfaces match across tasks. The `LandingPageData` interface in Task 4 matches the `landing_page` table schema in Task 12.

**4. No network access:** All tasks use localStorage or local file operations. No Supabase calls during development.
