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
├── pages/
│   └── Landing.tsx  # Landing page (customize for your project)
├── components/     # (add your own shared components here)
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
