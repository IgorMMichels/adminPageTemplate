import { useState } from 'react';
import { useAdmin } from '../context/AdminContext';
import { defaultSiteConfig } from '@/data/siteConfig';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Save, RotateCcw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function AdminMessages() {
  const { siteConfig, updateSiteConfig, resetSiteConfig } = useAdmin();
  const { toast } = useToast();
  
  // Use siteConfig from context, fallback to default
  const safeSiteConfig = siteConfig || defaultSiteConfig;
  
  // All hooks called unconditionally - no early returns!
  const [localConfig, setLocalConfig] = useState(safeSiteConfig);

  const handleSave = () => {
    updateSiteConfig(localConfig);
    toast({ title: 'Alterações salvas', description: 'As mensagens foram atualizadas com sucesso.' });
  };

  const handleReset = () => {
    resetSiteConfig();
    setLocalConfig(safeSiteConfig);
    toast({ title: 'Configurações resetadas', description: 'Todas as mensagens voltaram ao padrão.' });
  };

  const updateField = (section: string, field: string, value: any) => {
    setLocalConfig((prev) => ({
      ...prev,
      [section]: {
        ...(prev as any)[section],
        [field]: value,
      },
    }));
  };

  const updateNestedField = (section: string, subsection: string, field: string, value: any) => {
    setLocalConfig((prev) => ({
      ...prev,
      [section]: {
        ...(prev as any)[section],
        [subsection]: {
          ...((prev as any)[section] as any)[subsection],
          [field]: value,
        },
      },
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Mensagens do Site</h1>
          <p className="text-muted-foreground mt-1">Edite os textos e conteúdos exibidos no site</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleReset}>
            <RotateCcw className="w-4 h-4 mr-2" />
            Resetar
          </Button>
          <Button onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" />
            Salvar Alterações
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="hero" className="space-y-4">
        <TabsList className="flex-wrap h-auto gap-2">
          <TabsTrigger value="hero">Hero</TabsTrigger>
          <TabsTrigger value="about">Sobre</TabsTrigger>
          <TabsTrigger value="features">Diferenciais</TabsTrigger>
          <TabsTrigger value="products">Produtos</TabsTrigger>
          <TabsTrigger value="services">Serviços</TabsTrigger>
          <TabsTrigger value="contact">Contato</TabsTrigger>
          <TabsTrigger value="footer">Rodapé</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
        </TabsList>

        {/* Hero Section */}
        <TabsContent value="hero">
          <Card>
            <CardHeader>
              <CardTitle>Seção Hero (Banner Principal)</CardTitle>
              <CardDescription>Primeira seção que o visitante vê ao acessar o site</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Título Principal</Label>
                <Input
                  value={localConfig.hero.title}
                  onChange={(e) => updateField('hero', 'title', e.target.value)}
                  placeholder="Admin Template"
                />
              </div>
              <div className="space-y-2">
                <Label>Subtítulo</Label>
                <Textarea
                  value={localConfig.hero.subtitle}
                  onChange={(e) => updateField('hero', 'subtitle', e.target.value)}
                  placeholder="Soluções em Bombeamento..."
                  rows={2}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Texto do Botão Principal</Label>
                  <Input
                    value={localConfig.hero.ctaText}
                    onChange={(e) => updateField('hero', 'ctaText', e.target.value)}
                    placeholder="Solicitar Orçamento"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Texto do Botão Secundário</Label>
                  <Input
                    value={localConfig.hero.ctaSecondaryText}
                    onChange={(e) => updateField('hero', 'ctaSecondaryText', e.target.value)}
                    placeholder="Ver Produtos"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* About Section */}
        <TabsContent value="about">
          <Card>
            <CardHeader>
              <CardTitle>Seção Sobre a Empresa</CardTitle>
              <CardDescription>Informações institucionais e estatísticas</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Título</Label>
                <Input
                  value={localConfig.about.title}
                  onChange={(e) => updateField('about', 'title', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Subtítulo</Label>
                <Input
                  value={localConfig.about.subtitle}
                  onChange={(e) => updateField('about', 'subtitle', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Descrição</Label>
                <Textarea
                  value={localConfig.about.description}
                  onChange={(e) => updateField('about', 'description', e.target.value)}
                  rows={4}
                />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label>Anos de Experiência</Label>
                  <Input
                    value={localConfig.about.stats.years}
                    onChange={(e) => updateNestedField('about', 'stats', 'years', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Total de Clientes</Label>
                  <Input
                    value={localConfig.about.stats.clients}
                    onChange={(e) => updateNestedField('about', 'stats', 'clients', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Produtos</Label>
                  <Input
                    value={localConfig.about.stats.products}
                    onChange={(e) => updateNestedField('about', 'stats', 'products', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Estados Atendidos</Label>
                  <Input
                    value={localConfig.about.stats.states}
                    onChange={(e) => updateNestedField('about', 'stats', 'states', e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Features Section */}
        <TabsContent value="features">
          <Card>
            <CardHeader>
              <CardTitle>Seção Diferenciais</CardTitle>
              <CardDescription>Por que escolher a nossa solução</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Título</Label>
                <Input
                  value={localConfig.features.title}
                  onChange={(e) => updateField('features', 'title', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Subtítulo</Label>
                <Input
                  value={localConfig.features.subtitle}
                  onChange={(e) => updateField('features', 'subtitle', e.target.value)}
                />
              </div>
              <div className="space-y-4 mt-4">
                {localConfig.features.items.map((item, index) => (
                  <div key={item.id} className="p-4 border rounded-lg space-y-3">
                    <div className="space-y-2">
                      <Label>Título do Item {index + 1}</Label>
                      <Input
                        value={item.title}
                        onChange={(e) => {
                          const newItems = [...localConfig.features.items];
                          newItems[index] = { ...item, title: e.target.value };
                          setLocalConfig((prev) => ({
                            ...prev,
                            features: { ...prev.features, items: newItems },
                          }));
                        }}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Descrição</Label>
                      <Textarea
                        value={item.description}
                        onChange={(e) => {
                          const newItems = [...localConfig.features.items];
                          newItems[index] = { ...item, description: e.target.value };
                          setLocalConfig((prev) => ({
                            ...prev,
                            features: { ...prev.features, items: newItems },
                          }));
                        }}
                        rows={2}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Products Section */}
        <TabsContent value="products">
          <Card>
            <CardHeader>
              <CardTitle>Seção de Produtos</CardTitle>
              <CardDescription>Textos da seção de produtos na home</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Título</Label>
                <Input
                  value={localConfig.products.title}
                  onChange={(e) => updateField('products', 'title', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Subtítulo</Label>
                <Input
                  value={localConfig.products.subtitle}
                  onChange={(e) => updateField('products', 'subtitle', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Texto do Botão CTA</Label>
                <Input
                  value={localConfig.products.ctaText}
                  onChange={(e) => updateField('products', 'ctaText', e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Services Section */}
        <TabsContent value="services">
          <Card>
            <CardHeader>
              <CardTitle>Seção de Serviços</CardTitle>
              <CardDescription>Lista de serviços oferecidos</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Título</Label>
                <Input
                  value={localConfig.services.title}
                  onChange={(e) => updateField('services', 'title', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Subtítulo</Label>
                <Input
                  value={localConfig.services.subtitle}
                  onChange={(e) => updateField('services', 'subtitle', e.target.value)}
                />
              </div>
              <div className="space-y-4 mt-4">
                {localConfig.services.items.map((item, index) => (
                  <div key={item.id} className="p-4 border rounded-lg space-y-3">
                    <div className="space-y-2">
                      <Label>Título do Serviço {index + 1}</Label>
                      <Input
                        value={item.title}
                        onChange={(e) => {
                          const newItems = [...localConfig.services.items];
                          newItems[index] = { ...item, title: e.target.value };
                          setLocalConfig((prev) => ({
                            ...prev,
                            services: { ...prev.services, items: newItems },
                          }));
                        }}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Descrição</Label>
                      <Textarea
                        value={item.description}
                        onChange={(e) => {
                          const newItems = [...localConfig.services.items];
                          newItems[index] = { ...item, description: e.target.value };
                          setLocalConfig((prev) => ({
                            ...prev,
                            services: { ...prev.services, items: newItems },
                          }));
                        }}
                        rows={2}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Contact Section */}
        <TabsContent value="contact">
          <Card>
            <CardHeader>
              <CardTitle>Seção de Contato</CardTitle>
              <CardDescription>Formulário e informações de contato</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Título</Label>
                <Input
                  value={localConfig.contact.title}
                  onChange={(e) => updateField('contact', 'title', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Subtítulo</Label>
                <Input
                  value={localConfig.contact.subtitle}
                  onChange={(e) => updateField('contact', 'subtitle', e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Label: Nome</Label>
                  <Input
                    value={localConfig.contact.formLabels.name}
                    onChange={(e) => updateNestedField('contact', 'formLabels', 'name', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Label: E-mail</Label>
                  <Input
                    value={localConfig.contact.formLabels.email}
                    onChange={(e) => updateNestedField('contact', 'formLabels', 'email', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Label: Telefone</Label>
                  <Input
                    value={localConfig.contact.formLabels.phone}
                    onChange={(e) => updateNestedField('contact', 'formLabels', 'phone', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Label: Mensagem</Label>
                  <Input
                    value={localConfig.contact.formLabels.message}
                    onChange={(e) => updateNestedField('contact', 'formLabels', 'message', e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Texto do Botão</Label>
                <Input
                  value={localConfig.contact.formLabels.submit}
                  onChange={(e) => updateNestedField('contact', 'formLabels', 'submit', e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Footer Section */}
        <TabsContent value="footer">
          <Card>
            <CardHeader>
              <CardTitle>Rodapé</CardTitle>
              <CardDescription>Textos e links do rodapé</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Descrição</Label>
                <Textarea
                  value={localConfig.footer.description}
                  onChange={(e) => updateField('footer', 'description', e.target.value)}
                  rows={2}
                />
              </div>
              <div className="space-y-2">
                <Label>Copyright</Label>
                <Input
                  value={localConfig.footer.copyright}
                  onChange={(e) => updateField('footer', 'copyright', e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Facebook URL</Label>
                  <Input
                    value={localConfig.footer.socialLinks.facebook || ''}
                    onChange={(e) => updateNestedField('footer', 'socialLinks', 'facebook', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Instagram URL</Label>
                  <Input
                    value={localConfig.footer.socialLinks.instagram || ''}
                    onChange={(e) => updateNestedField('footer', 'socialLinks', 'instagram', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>LinkedIn URL</Label>
                  <Input
                    value={localConfig.footer.socialLinks.linkedin || ''}
                    onChange={(e) => updateNestedField('footer', 'socialLinks', 'linkedin', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>YouTube URL</Label>
                  <Input
                    value={localConfig.footer.socialLinks.youtube || ''}
                    onChange={(e) => updateNestedField('footer', 'socialLinks', 'youtube', e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* SEO Section */}
        <TabsContent value="seo">
          <Card>
            <CardHeader>
              <CardTitle>SEO</CardTitle>
              <CardDescription>Otimização para mecanismos de busca</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Título da Página (Title Tag)</Label>
                <Input
                  value={localConfig.seo.title}
                  onChange={(e) => updateField('seo', 'title', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Meta Description</Label>
                <Textarea
                  value={localConfig.seo.description}
                  onChange={(e) => updateField('seo', 'description', e.target.value)}
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label>Palavras-chave (separadas por vírgula)</Label>
                <Input
                  value={localConfig.seo.keywords.join(', ')}
                  onChange={(e) =>
                    updateField(
                      'seo',
                      'keywords',
                      e.target.value.split(',').map((k) => k.trim())
                    )
                  }
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
