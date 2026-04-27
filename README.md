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
│   ├── components/
│   ├── context/
│   ├── hooks/
│   ├── pages/
│   └── index.ts
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
