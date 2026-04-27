import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAdmin } from '../context/AdminContext';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Package,
  MessageSquare,
  Settings,
  LogOut,
  X,
  Building2,
  Wrench,
  ImageIcon,
  Users,
  Factory,
  Lock,
  ChevronRight,
  Monitor,
  Instagram,
  Github
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

import { Tag } from 'lucide-react';

const siteMenuItems = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
  { label: 'Empresa', icon: Building2, path: '/admin/settings' },
  { label: 'Categorias', icon: Tag, path: '/admin/categories' },
  { label: 'Serviços', icon: Wrench, path: '/admin/services' },
  { label: 'Imagens dos Serviços', icon: ImageIcon, path: '/admin/service-images' },
  { label: 'Textos do Site', icon: MessageSquare, path: '/admin/messages' },
  { label: 'Linhas e Produtos', icon: Package, path: '/admin/products' },
  { label: 'Clientes', icon: Users, path: '/admin/clients' },
  { label: 'Fornecedores', icon: Factory, path: '/admin/suppliers' },
];

const adminMenuItems = [
  { label: 'Configurações', icon: Settings, path: '/admin/settings' },
  { label: 'Alterar Senha', icon: Lock, path: '/admin/change-password' },
];

export default function AdminSidebar() {
  const { sidebarOpen, setSidebarOpen, logout } = useAdmin();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const isActive = (path: string) => {
    if (path === '/admin') return location.pathname === '/admin';
    return location.pathname.startsWith(path);
  };

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-40 lg:hidden transition-all duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-0 left-0 h-full bg-white text-slate-900 border-r border-slate-200 z-50 transition-all duration-500 flex flex-col overflow-x-hidden shadow-2xl lg:shadow-none',
          'w-[280px]',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full',
          'lg:translate-x-0'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 bg-slate-50">
            <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center shadow-sm transform -rotate-3 transition-transform hover:rotate-0">
              <img src="/favicon.ico" alt="Admin Template" className="w-7 h-7 object-contain" />
            </div>
            <div>
              <div className="flex items-center gap-2 px-2">
                <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Settings className="h-4 w-4 text-primary" />
                </div>
                <span className="font-semibold text-sm">Admin Panel</span>
              </div>
              <div className="flex items-center gap-1.5 mt-0.5 pl-2">
                <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Painel Ativo</p>
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden text-slate-500 hover:bg-slate-200"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-6 overflow-y-auto overflow-x-hidden custom-scrollbar">
          {/* SITE Section */}
          <div className="px-6 mb-4">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
              Gerenciamento
            </span>
          </div>
          <ul className="space-y-1.5 px-3 mb-8">
            {siteMenuItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  end={item.path === '/admin'}
                  onClick={() => setSidebarOpen(false)}
                  className={({ isActive }) => cn(
                    'group flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-all duration-300',
                    isActive
                      ? 'bg-primary/10 text-primary shadow-sm'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-secondary'
                  )}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className={cn(
                      "w-4.5 h-4.5 transition-transform duration-500 group-hover:scale-110",
                      isActive(item.path) ? "text-primary" : "text-slate-600 group-hover:text-primary"
                    )} />
                    {item.label}
                  </div>
                  {isActive(item.path) && (
                    <ChevronRight className="w-4 h-4 text-primary" />
                  )}
                </NavLink>
              </li>
            ))}
          </ul>

          <div className="px-6">
            <Separator className="bg-slate-200 mb-8" />
          </div>

          {/* ADMINISTRATION Section */}
          <div className="px-6 mb-4">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
              Configurações
            </span>
          </div>
          <ul className="space-y-1.5 px-3">
            {adminMenuItems.map((item) => (
              <li key={item.path + item.label}>
                <NavLink
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={({ isActive }) => cn(
                    'group flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-300',
                    isActive && item.label !== 'Configurações'
                      ? 'bg-primary/10 text-primary shadow-sm'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-secondary'
                  )}
                >
                    <item.icon className={cn(
                      "w-4.5 h-4.5 transition-transform duration-500 group-hover:scale-110",
                      isActive(item.path) && item.label !== 'Configurações' ? "text-primary dark:text-primary" : "text-slate-600 dark:text-slate-100 group-hover:text-primary"
                    )} />
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer Area */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 space-y-4">
          {/* Developer Info */}
          <div className="px-2 py-2 rounded-lg bg-slate-100/50">
            <p className="text-[10px] font-bold text-slate-500 text-center uppercase tracking-wide">
              Desenvolvido por
            </p>
            <p className="text-xs font-black text-slate-700 text-center">
              Igor Marcon Michels @2026
            </p>
            <div className="flex justify-center gap-3 mt-2">
              <a
                href="https://instagram.com/igormichels_"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-500 hover:text-[#E1306C] transition-colors"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://github.com/igormmichels"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-500 hover:text-slate-900 transition-colors"
              >
                <Github className="w-4 h-4" />
              </a>
            </div>
          </div>
          
          <Button 
            variant="ghost" 
            className="w-full justify-start gap-3 text-slate-600 hover:bg-slate-200 hover:text-secondary text-xs font-bold"
            asChild
          >
            <a href="/" target="_blank">
              <Monitor className="w-4 h-4" />
              Visualizar Site
            </a>
          </Button>
          
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-slate-500 hover:bg-destructive/10 hover:text-destructive transition-all duration-300 w-full"
          >
            <LogOut className="w-4 h-4" />
            Encerrar Sessão
          </button>
        </div>
      </aside>
    </>
  );
}
