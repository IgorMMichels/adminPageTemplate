import { useAdmin } from '../context/AdminContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Package, 
  FileText, 
  Settings, 
  TrendingUp, 
  ShoppingCart, 
  Database, 
  CloudOff, 
  Loader2, 
  ArrowRight,
  Plus,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

export default function AdminDashboard() {
  const { products, categories, siteConfig, loading, supabaseConnected, refreshData } = useAdmin();

  const stats = [
    {
      title: 'Total de Produtos',
      value: products.length,
      icon: Package,
      gradient: 'from-blue-500/10 to-blue-600/10',
      iconColor: 'text-blue-600',
      borderColor: 'border-blue-100',
      link: '/admin/products',
    },
    {
      title: 'Categorias',
      value: categories.length,
      icon: ShoppingCart,
      gradient: 'from-purple-500/10 to-purple-600/10',
      iconColor: 'text-purple-600',
      borderColor: 'border-purple-100',
      // Link should point to the categories management page, not products
      link: '/admin/categories',
    },
    {
      title: 'Produtos em Destaque',
      value: products.filter((p) => p.featured).length,
      icon: TrendingUp,
      gradient: 'from-emerald-500/10 to-emerald-600/10',
      iconColor: 'text-emerald-600',
      borderColor: 'border-emerald-100',
      link: '/admin/products',
    },
    {
      title: 'Seções Editáveis',
      value: 8,
      icon: FileText,
      gradient: 'from-orange-500/10 to-orange-600/10',
      iconColor: 'text-orange-600',
      borderColor: 'border-orange-100',
      link: '/admin/messages',
    },
  ];

  const quickActions = [
    {
      title: 'Adicionar Produto',
      description: 'Cadastre um novo produto no catálogo',
      icon: Plus,
      link: '/admin/products?action=new',
      color: 'bg-primary/10 text-primary',
    },
    {
      title: 'Editar Mensagens',
      description: 'Altere textos e conteúdos do site',
      icon: FileText,
      link: '/admin/messages',
      color: 'bg-blue-50 text-blue-600',
    },
    {
      title: 'Configurações',
      description: 'Dados da empresa e contato',
      icon: Settings,
      link: '/admin/settings',
      color: 'bg-slate-100 text-slate-600',
    },
  ];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="relative">
          <Loader2 className="w-12 h-12 animate-spin text-primary" />
          <div className="absolute inset-0 blur-xl bg-primary/20 animate-pulse rounded-full" />
        </div>
        <div className="text-center">
          <h3 className="text-lg font-medium">Carregando painel</h3>
          <p className="text-muted-foreground">Sincronizando seus dados...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground lg:text-5xl">
            Dashboard
          </h1>
            <p className="text-lg text-muted-foreground mt-2 max-w-2xl">
              Gerencie o catálogo, serviços e informações de forma centralizada.
            </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={refreshData} className="text-muted-foreground hover:text-primary">
            <Loader2 className={cn("w-4 h-4 mr-2", loading && "animate-spin")} />
            Sincronizar
          </Button>

          {supabaseConnected ? (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 text-sm font-medium">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              Supabase Online
            </div>
          ) : (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 text-amber-700 border border-amber-100 text-sm font-medium">
              <CloudOff className="w-3.5 h-3.5" />
              Modo Local
            </div>
          )}
        </div>
      </div>

{/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat, index) => (
          <Link key={stat.title} to={stat.link} className="group">
            <Card className={cn(
              "relative overflow-hidden transition-all duration-300 border-none shadow-sm group-hover:shadow-md group-hover:-translate-y-1",
              "bg-white border border-slate-100"
            )}>
              <div className={cn("absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 rounded-full blur-3xl opacity-20", stat.gradient)} />
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{stat.title}</p>
                    <p className="text-4xl font-black tracking-tight">{stat.value}</p>
                  </div>
                  <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center transition-transform duration-500 group-hover:rotate-12 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800")}>
                    <stat.icon className={cn("w-7 h-7", stat.iconColor, "dark:text-white")} />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-xs font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                  Gerenciar <ArrowRight className="w-3 h-3 ml-1" />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Products */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold tracking-tight">Produtos Recentes</h2>
            <Button variant="ghost" size="sm" asChild className="text-primary hover:text-primary hover:bg-primary/5">
              <Link to="/admin/products" className="flex items-center">
                Ver Todos <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
          
          <Card className="shadow-sm border-slate-200/60 overflow-hidden">
            <CardContent className="p-0">
              <div className="divide-y divide-slate-100">
                {products.length === 0 ? (
                  <div className="p-12 text-center">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Package className="w-8 h-8 text-slate-300" />
                    </div>
                    <h3 className="text-lg font-medium text-slate-900">Sem produtos</h3>
                    <p className="text-muted-foreground mt-1 text-sm">Seu catálogo está vazio no momento.</p>
                    <Button variant="outline" size="sm" className="mt-4" asChild>
                      <Link to="/admin/products?action=new">Começar a cadastrar</Link>
                    </Button>
                  </div>
                ) : (
                  products.slice(0, 5).map((product) => (
                    <div key={product.id} className="group flex items-center gap-4 p-4 transition-colors hover:bg-slate-50/80">
                      <div className="relative w-14 h-14 shrink-0 overflow-hidden rounded-xl border border-slate-100 bg-white">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-slate-900 truncate group-hover:text-primary transition-colors">{product.name}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded uppercase">{product.brand}</span>
                          <span className="text-[10px] text-muted-foreground">•</span>
                          <span className="text-xs text-muted-foreground truncate">
                             {categories.find((c) => c.id === product.category)?.name || product.category}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {product.featured && (
                          <Badge variant="outline" className="bg-amber-50 text-amber-600 border-amber-200 text-[10px] font-bold uppercase">Destaque</Badge>
                        )}
                        <Button variant="ghost" size="icon" className="rounded-full opacity-0 group-hover:opacity-100 transition-opacity" asChild>
                          <Link to={`/admin/products?edit=${product.id}`}>
                            <ChevronRight className="w-5 h-5 text-slate-400" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions & Side Info */}
        <div className="space-y-8">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold tracking-tight">Ações Rápidas</h2>
            <div className="grid grid-cols-1 gap-3">
              {quickActions.map((action) => (
                <Link key={action.title} to={action.link} className="group">
                  <Card className="hover:border-primary/40 transition-all duration-300 shadow-sm overflow-hidden active:scale-[0.98]">
                    <CardContent className="p-4 flex items-center gap-4">
                      <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110", action.color)}>
                        <action.icon className="w-6 h-6" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-bold text-slate-900 text-sm leading-tight">{action.title}</h3>
                        <p className="text-xs text-muted-foreground truncate mt-0.5">{action.description}</p>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold tracking-tight">Informações do Site</h2>
            <Card className="bg-secondary text-white border-none shadow-lg overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl -mr-16 -mt-16" />
              <CardHeader className="pb-2 border-b border-white/10">
                <CardTitle className="text-base text-white">Dados da Empresa</CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-4">
                <div className="space-y-3">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">Empresa</span>
                    <span className="text-sm font-medium">{siteConfig.company.name}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">E-mail de Contato</span>
                    <span className="text-sm font-medium truncate">{siteConfig.company.email}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">Telefone</span>
                    <span className="text-sm font-medium">{siteConfig.company.phone}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">Localização</span>
                    <span className="text-sm font-medium">{siteConfig.company.city}, {siteConfig.company.state}</span>
                  </div>
                </div>
                <Button variant="secondary" size="sm" className="w-full font-bold bg-white/10 hover:bg-white/20 border-white/10 text-white" asChild>
                  <Link to="/admin/settings">Editar Informações</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
