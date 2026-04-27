import { useAdmin } from '../context/AdminContext';
import { Button } from '@/components/ui/button';
import { Menu, User, LogOut, Settings as SettingsIcon } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Link } from 'react-router-dom';

export default function AdminHeader() {
  const { user, logout, setSidebarOpen } = useAdmin();

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="flex items-center justify-between px-4 sm:px-8 py-3">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="flex lg:hidden hover:bg-slate-100 transition-colors"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-5 h-5 text-slate-600" />
          </Button>
          <div className="flex flex-col">
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-tight hidden sm:block">
              Gerenciamento Administrativo
            </h2>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest hidden sm:block">
              <span className="inline-flex items-center gap-1">
                <SettingsIcon className="w-3 h-3" />
                Admin Panel
              </span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="gap-3 hover:bg-slate-100 p-1 pr-3 rounded-xl border border-transparent hover:border-slate-200 transition-all">
                <div className="w-8 h-8 bg-secondary rounded-lg flex items-center justify-center shadow-md">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div className="flex flex-col items-start text-left hidden sm:flex">
                  <span className="text-xs font-bold text-slate-900 leading-none">{user?.username}</span>
                  <span className="text-[10px] text-muted-foreground mt-0.5 uppercase tracking-tighter font-bold">Administrador</span>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 p-2 rounded-xl shadow-xl border-slate-200">
              <DropdownMenuLabel className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-2 py-1.5">Minha Conta</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild className="rounded-lg cursor-pointer py-2">
                <Link to="/admin/settings" className="flex items-center gap-2">
                  <SettingsIcon className="w-4 h-4 text-slate-500" />
                  <span className="font-medium">Configurações</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout} className="rounded-lg cursor-pointer py-2 text-destructive focus:bg-destructive/10 focus:text-destructive">
                <LogOut className="w-4 h-4 mr-2" />
                <span className="font-bold">Encerrar Sessão</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
