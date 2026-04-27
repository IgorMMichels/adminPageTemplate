import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Settings, Database } from 'lucide-react';

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
              <Settings className="h-6 w-6 text-primary" />
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
                <Settings className="h-10 w-10 text-primary" />
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
                  <Settings className="h-6 w-6 text-blue-600" />
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
                  <Settings className="h-6 w-6 text-purple-600" />
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
