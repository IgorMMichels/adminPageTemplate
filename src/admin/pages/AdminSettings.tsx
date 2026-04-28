import { useState, useEffect } from 'react';
import { useAdmin } from '../context/AdminContext';
import { defaultSiteConfig } from '@/data/siteConfig';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Save, Building2, Phone, Mail, MapPin, Globe, Search, Database, CheckCircle2, AlertCircle, UploadCloud, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

export default function AdminSettings() {
  const { 
    siteConfig, 
    updateSiteConfig, 
    supabaseConnected, 
    dbHealth, 
    checkDatabaseHealth, 
    syncLocalToSupabase, 
    isMigrating 
  } = useAdmin();
  const { toast } = useToast();
  
// Guard against undefined siteConfig
  if (!siteConfig) {
    return <div className="flex items-center justify-center min-h-[60vh]">Loading...</div>;
  }
  
  const safeSiteConfig = siteConfig || defaultSiteConfig;
  const [company, setCompany] = useState(safeSiteConfig.company);
  const [hero, setHero] = useState(safeSiteConfig.hero);
  const [about, setAbout] = useState(safeSiteConfig.about);
  const [footer, setFooter] = useState(safeSiteConfig.footer);
  const [seo, setSeo] = useState(safeSiteConfig.seo);
  const [contact, setContact] = useState(safeSiteConfig.contact);
  const [migrationProgress, setMigrationProgress] = useState(0);
  const [migrationMessage, setMigrationMessage] = useState('');

  useEffect(() => {
    setCompany(safeSiteConfig.company);
    setHero(safeSiteConfig.hero);
    setAbout(safeSiteConfig.about);
    setFooter(safeSiteConfig.footer);
    setSeo(safeSiteConfig.seo);
    setContact(safeSiteConfig.contact);
  }, [safeSiteConfig]);

  const handleSave = () => {
    updateSiteConfig({ company, hero, about, footer, seo, contact });
    toast({ title: 'Configurações salvas', description: 'Todas as alterações foram aplicadas com sucesso.' });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Configurações</h1>
          <p className="text-muted-foreground mt-1">Gerencie as configurações gerais do site</p>
        </div>
        <Button onClick={handleSave}>
          <Save className="w-4 h-4 mr-2" />
          Salvar Todas Alterações
        </Button>
      </div>

      <Tabs defaultValue="empresa" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:grid-cols-7 h-auto gap-1">
          <TabsTrigger value="empresa" className="text-xs">🏢 Empresa</TabsTrigger>
          <TabsTrigger value="contato" className="text-xs">📞 Contato</TabsTrigger>
          <TabsTrigger value="hero" className="text-xs">🎯 Hero</TabsTrigger>
          <TabsTrigger value="sobre" className="text-xs">📋 Sobre</TabsTrigger>
          <TabsTrigger value="redes" className="text-xs">🌐 Redes</TabsTrigger>
          <TabsTrigger value="seo" className="text-xs">🔍 SEO</TabsTrigger>
          <TabsTrigger value="database" className="text-xs">🗄️ Banco de Dados</TabsTrigger>
        </TabsList>

        {/* Empresa Tab */}
        <TabsContent value="empresa">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-primary" />
                <CardTitle>Informações da Empresa</CardTitle>
              </div>
              <CardDescription>Dados principais que aparecem em todo o site</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Nome da Empresa</Label>
                  <Input
                    value={company.name}
                    onChange={(e) => setCompany({ ...company, name: e.target.value })}
                    placeholder="Admin Template"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Slogan</Label>
                  <Input
                    value={company.slogan}
                    onChange={(e) => setCompany({ ...company, slogan: e.target.value })}
placeholder="Sua empresa"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Descrição</Label>
                <Textarea
                  value={company.description}
                  onChange={(e) => setCompany({ ...company, description: e.target.value })}
                  placeholder="Descrição da empresa..."
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label>CNPJ</Label>
                <Input
                  value={company.cnpj}
                  onChange={(e) => setCompany({ ...company, cnpj: e.target.value })}
                  placeholder="00.000.000/0001-00"
                />
              </div>
              <div className="space-y-2">
                <Label>Ano de Fundação</Label>
                <Input
                  value={company.founded}
                  onChange={(e) => setCompany({ ...company, founded: e.target.value })}
                  placeholder="2013"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Contato Tab */}
        <TabsContent value="contato">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Phone className="w-5 h-5 text-primary" />
                  <CardTitle>Contato</CardTitle>
                </div>
                <CardDescription>Informações de contato exibidas no site</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Phone className="w-4 h-4" /> Telefone
                    </Label>
                    <Input
                      value={company.phone}
                      onChange={(e) => setCompany({ ...company, phone: e.target.value })}
                      placeholder="(47) 3433-3600"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Mail className="w-4 h-4" /> E-mail
                    </Label>
                    <Input
                      value={company.email}
                      onChange={(e) => setCompany({ ...company, email: e.target.value })}
                      placeholder="contato@exemplo.com"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>WhatsApp (número completo com código do país)</Label>
                  <Input
                    value={company.whatsapp}
                    onChange={(e) => setCompany({ ...company, whatsapp: e.target.value })}
                    placeholder="554738042623"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary" />
                  <CardTitle>Endereço</CardTitle>
                </div>
                <CardDescription>Localização da empresa</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Endereço Completo</Label>
                  <Input
                    value={company.address}
                    onChange={(e) => setCompany({ ...company, address: e.target.value })}
                    placeholder="Rua Industrial, 1234"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Cidade</Label>
                    <Input
                      value={company.city}
                      onChange={(e) => setCompany({ ...company, city: e.target.value })}
                      placeholder="Joinville"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Estado</Label>
                    <Input
                      value={company.state}
                      onChange={(e) => setCompany({ ...company, state: e.target.value })}
                      placeholder="SC"
                      maxLength={2}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Labels do Formulário de Contato</CardTitle>
                <CardDescription>Textos exibidos no formulário de contato do site</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Label Nome</Label>
                    <Input
                      value={contact.formLabels.name}
                      onChange={(e) =>
                        setContact({
                          ...contact,
                          formLabels: { ...contact.formLabels, name: e.target.value },
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Label E-mail</Label>
                    <Input
                      value={contact.formLabels.email}
                      onChange={(e) =>
                        setContact({
                          ...contact,
                          formLabels: { ...contact.formLabels, email: e.target.value },
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Label Telefone</Label>
                    <Input
                      value={contact.formLabels.phone}
                      onChange={(e) =>
                        setContact({
                          ...contact,
                          formLabels: { ...contact.formLabels, phone: e.target.value },
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Label Botão Enviar</Label>
                    <Input
                      value={contact.formLabels.submit}
                      onChange={(e) =>
                        setContact({
                          ...contact,
                          formLabels: { ...contact.formLabels, submit: e.target.value },
                        })
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Hero Tab */}
        <TabsContent value="hero">
          <Card>
            <CardHeader>
              <CardTitle>Seção Hero</CardTitle>
              <CardDescription>Banner principal da página inicial</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Título Principal</Label>
                <Input
                  value={hero.title}
                  onChange={(e) => setHero({ ...hero, title: e.target.value })}
                  placeholder="Título da seção"
                />
              </div>
              <div className="space-y-2">
                <Label>Subtítulo</Label>
                <Textarea
                  value={hero.subtitle}
                  onChange={(e) => setHero({ ...hero, subtitle: e.target.value })}
                  placeholder="Descrição da seção hero..."
                  rows={2}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Texto CTA Principal</Label>
                  <Input
                    value={hero.ctaText}
                    onChange={(e) => setHero({ ...hero, ctaText: e.target.value })}
                    placeholder="Solicitar Orçamento"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Texto CTA Secundário</Label>
                  <Input
                    value={hero.ctaSecondaryText}
                    onChange={(e) => setHero({ ...hero, ctaSecondaryText: e.target.value })}
                    placeholder="Ver Produtos"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Sobre Tab */}
        <TabsContent value="sobre">
          <Card>
            <CardHeader>
              <CardTitle>Seção Sobre</CardTitle>
              <CardDescription>Informações exibidas na seção "Sobre a Empresa"</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Título</Label>
                  <Input
                    value={about.title}
                    onChange={(e) => setAbout({ ...about, title: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Subtítulo</Label>
                  <Input
                    value={about.subtitle}
                    onChange={(e) => setAbout({ ...about, subtitle: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Descrição</Label>
                <Textarea
                  value={about.description}
                  onChange={(e) => setAbout({ ...about, description: e.target.value })}
                  rows={4}
                />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label>Anos</Label>
                  <Input
                    value={about.stats.years}
                    onChange={(e) =>
                      setAbout({ ...about, stats: { ...about.stats, years: e.target.value } })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Clientes</Label>
                  <Input
                    value={about.stats.clients}
                    onChange={(e) =>
                      setAbout({ ...about, stats: { ...about.stats, clients: e.target.value } })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Produtos</Label>
                  <Input
                    value={about.stats.products}
                    onChange={(e) =>
                      setAbout({ ...about, stats: { ...about.stats, products: e.target.value } })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Estados</Label>
                  <Input
                    value={about.stats.states}
                    onChange={(e) =>
                      setAbout({ ...about, stats: { ...about.stats, states: e.target.value } })
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Redes Sociais Tab */}
        <TabsContent value="redes">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-primary" />
                <CardTitle>Redes Sociais</CardTitle>
              </div>
              <CardDescription>Links das redes sociais exibidos no rodapé</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Facebook</Label>
                <Input
                  value={footer.socialLinks.facebook || ''}
                  onChange={(e) =>
                    setFooter({
                      ...footer,
                      socialLinks: { ...footer.socialLinks, facebook: e.target.value },
                    })
                  }
                  placeholder="https://facebook.com/..."
                />
              </div>
              <div className="space-y-2">
                <Label>Instagram</Label>
                <Input
                  value={footer.socialLinks.instagram || ''}
                  onChange={(e) =>
                    setFooter({
                      ...footer,
                      socialLinks: { ...footer.socialLinks, instagram: e.target.value },
                    })
                  }
                  placeholder="https://instagram.com/..."
                />
              </div>
              <div className="space-y-2">
                <Label>LinkedIn</Label>
                <Input
                  value={footer.socialLinks.linkedin || ''}
                  onChange={(e) =>
                    setFooter({
                      ...footer,
                      socialLinks: { ...footer.socialLinks, linkedin: e.target.value },
                    })
                  }
                  placeholder="https://linkedin.com/..."
                />
              </div>
              <div className="space-y-2">
                <Label>YouTube</Label>
                <Input
                  value={footer.socialLinks.youtube || ''}
                  onChange={(e) =>
                    setFooter({
                      ...footer,
                      socialLinks: { ...footer.socialLinks, youtube: e.target.value },
                    })
                  }
                  placeholder="https://youtube.com/..."
                />
              </div>
              <div className="space-y-2">
                <Label>Texto do Rodapé</Label>
                <Textarea
                  value={footer.description}
                  onChange={(e) => setFooter({ ...footer, description: e.target.value })}
                  rows={2}
                />
              </div>
              <div className="space-y-2">
                <Label>Copyright</Label>
                <Input
                  value={footer.copyright}
                  onChange={(e) => setFooter({ ...footer, copyright: e.target.value })}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* SEO Tab */}
        <TabsContent value="seo">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Search className="w-5 h-5 text-primary" />
                <CardTitle>SEO</CardTitle>
              </div>
              <CardDescription>Otimização para mecanismos de busca</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Título da Página (Title Tag)</Label>
                <Input
                  value={seo.title}
                  onChange={(e) => setSeo({ ...seo, title: e.target.value })}
                  placeholder="Admin Template | Solutions"
                />
                <p className="text-xs text-muted-foreground">
                  Recomendado: 50-60 caracteres ({seo.title.length} atualmente)
                </p>
              </div>
              <div className="space-y-2">
                <Label>Meta Description</Label>
                <Textarea
                  value={seo.description}
                  onChange={(e) => setSeo({ ...seo, description: e.target.value })}
                  rows={3}
                />
                <p className="text-xs text-muted-foreground">
                  Recomendado: 150-160 caracteres ({seo.description.length} atualmente)
                </p>
              </div>
              <div className="space-y-2">
                <Label>Palavras-chave (separadas por vírgula)</Label>
                <Textarea
                  value={seo.keywords.join(', ')}
                  onChange={(e) =>
                    setSeo({ ...seo, keywords: e.target.value.split(',').map((k) => k.trim()) })
                  }
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Database Tab */}
        <TabsContent value="database">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Globe className="w-5 h-5 text-primary" />
                  <CardTitle>Conectividade</CardTitle>
                </div>
                <CardDescription>Status e chaves de acesso ao Supabase</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-4 rounded-lg bg-muted/50 border space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Status Global:</span>
                    <Badge variant={supabaseConnected ? "default" : "secondary"} className={supabaseConnected ? "bg-emerald-500 hover:bg-emerald-600" : ""}>
                      {supabaseConnected ? 'CONECTADO' : 'MODO LOCAL'}
                    </Badge>
                  </div>

                  <div className="space-y-3">
                    <div className="space-y-1">
                      <Label className="text-[10px] uppercase text-muted-foreground">VITE_SUPABASE_URL</Label>
                      <Input 
                        readOnly 
                        value={import.meta.env.VITE_SUPABASE_URL || 'NÃO CONFIGURADO'} 
                        className="bg-background text-xs font-mono h-8"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[10px] uppercase text-muted-foreground">VITE_SUPABASE_ANON_KEY</Label>
                      <Input 
                        type="password"
                        readOnly 
                        value={import.meta.env.VITE_SUPABASE_ANON_KEY ? '••••••••••••••••' : 'NÃO CONFIGURADO'} 
                        className="bg-background text-xs font-mono h-8"
                      />
                    </div>
                  </div>
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full gap-2"
                    onClick={() => checkDatabaseHealth()}
                  >
                    <RefreshCw className="w-3 h-3" />
                    Recarregar Status
                  </Button>
                </div>

              <div className="space-y-4">
                <h4 className="font-semibold text-sm">Como configurar?</h4>
                <ol className="text-sm text-muted-foreground space-y-3 list-decimal pl-4">
                  <li>
                    Acesse o dashboard do <strong>Supabase</strong>.
                  </li>
                  <li>
                    Vá em <strong>Project Settings</strong> &gt; <strong>API</strong>.
                  </li>
                  <li>
                    Copie a <strong>Project URL</strong> e a <strong>Anon Key</strong>.
                  </li>
                  <li>
                    No arquivo <code>.env</code> na raiz do projeto, adicione:
                    <pre className="mt-2 p-3 bg-secondary text-white rounded-lg text-xs overflow-x-auto shadow-md border border-secondary/20">
{`VITE_SUPABASE_URL=sua_url_aqui
VITE_SUPABASE_ANON_KEY=sua_chave_aqui`}
                    </pre>
                  </li>
                </ol>
                
                <div className="pt-4">
                  <Button asChild className="w-full">
                    <a href="https://supabase.com/dashboard" target="_blank" rel="noopener noreferrer">
                      Abrir Supabase Dashboard
                    </a>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
