-- =============================================
-- SOLUS MOTOBOMBAS - SUPABASE DATABASE SCHEMA
-- =============================================
-- Run this SQL in your Supabase SQL Editor
-- Go to: https://supabase.com/dashboard > Your Project > SQL Editor

-- =============================================
-- 1. CATEGORIES TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    icon TEXT DEFAULT '📦',
    count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default categories
INSERT INTO categories (id, name, icon, count) VALUES
    ('bombas', 'Bombas', '💧', 0),
    ('bombas-especiais', 'Bombas Especiais', '⚡', 0),
    ('bombas-inline', 'Bombas Inline', '🔄', 0),
    ('bombas-recirculacao', 'Bombas de Recirculação', '♻️', 0),
    ('pressurizadores', 'Pressurizadores', '📈', 0),
    ('multicelulares', 'Multicelulares', '🔋', 0),
    ('submersiveis', 'Submersíveis', '🌊', 0),
    ('misturadores', 'Misturadores', '🌀', 0),
    ('geradores', 'Geradores', '🔌', 0),
    ('projetos-especiais', 'Projetos Especiais', '🛠️', 0)
ON CONFLICT (id) DO NOTHING;

-- =============================================
-- 2. PRODUCTS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    short_description TEXT,
    full_description TEXT,
    category TEXT REFERENCES categories(id) ON DELETE SET NULL,
    subcategory TEXT,
    image TEXT DEFAULT '/placeholder.svg',
    specs JSONB DEFAULT '[]'::jsonb,
    applications TEXT[] DEFAULT '{}',
    brand TEXT,
    featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(featured);
CREATE INDEX IF NOT EXISTS idx_products_brand ON products(brand);

-- =============================================
-- 3. SITE CONFIG TABLE (key-value store)
-- =============================================
CREATE TABLE IF NOT EXISTS site_config (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default site configuration
INSERT INTO site_config (key, value) VALUES
    ('company', '{
        "name": "Solus Motobombas",
        "slogan": "Reinventar para ser Solus",
        "description": "Soluções completas em bombeamento para todos os segmentos.",
        "phone": "(47) 3433-3600",
        "email": "contato@solusmotobombas.com.br",
        "whatsapp": "5547999999999",
        "address": "Rua Industrial, 1234",
        "city": "Joinville",
        "state": "SC",
        "cnpj": "00.000.000/0001-00"
    }'::jsonb),
    ('hero', '{
        "title": "Reinventar para ser Solus",
        "subtitle": "Soluções em Bombeamento de Alta Performance para Indústria, Agricultura e Residências",
        "ctaText": "Solicitar Orçamento",
        "ctaSecondaryText": "Ver Produtos"
    }'::jsonb),
    ('about', '{
        "title": "Sobre a Solus",
        "subtitle": "Tradição e Inovação em Bombeamento",
        "description": "Com mais de 20 anos de experiência, a Solus Motobombas se consolidou como referência em soluções de bombeamento.",
        "stats": {
            "years": "20+",
            "clients": "5.000+",
            "products": "500+",
            "states": "27"
        }
    }'::jsonb),
    ('features', '{
        "title": "Por que escolher a Solus?",
        "subtitle": "Diferenciais que fazem a diferença",
        "items": [
            {"id": "quality", "title": "Qualidade Premium", "description": "Trabalhamos apenas com as melhores marcas do mercado mundial."},
            {"id": "support", "title": "Suporte Técnico", "description": "Equipe especializada disponível para dimensionamento e assistência."},
            {"id": "delivery", "title": "Entrega Rápida", "description": "Estoque próprio e logística eficiente para todo o Brasil."},
            {"id": "warranty", "title": "Garantia Estendida", "description": "Produtos com garantia de fábrica e suporte pós-venda."}
        ]
    }'::jsonb),
    ('products_section', '{
        "title": "Nossos Produtos",
        "subtitle": "Catálogo completo de soluções em bombeamento",
        "ctaText": "Ver Todos os Produtos"
    }'::jsonb),
    ('services', '{
        "title": "Serviços",
        "subtitle": "Soluções completas para seu projeto",
        "items": [
            {"id": "consulting", "title": "Consultoria Técnica", "description": "Dimensionamento e especificação de equipamentos."},
            {"id": "installation", "title": "Instalação", "description": "Instalação profissional com equipe certificada."},
            {"id": "maintenance", "title": "Manutenção", "description": "Manutenção preventiva e corretiva."},
            {"id": "parts", "title": "Peças de Reposição", "description": "Peças originais com pronta entrega."}
        ]
    }'::jsonb),
    ('contact', '{
        "title": "Entre em Contato",
        "subtitle": "Estamos prontos para atender você",
        "formLabels": {
            "name": "Nome completo",
            "email": "E-mail",
            "phone": "Telefone",
            "message": "Mensagem",
            "submit": "Enviar Mensagem"
        }
    }'::jsonb),
    ('footer', '{
        "description": "Solus Motobombas - Sua parceira em soluções de bombeamento há mais de 20 anos.",
        "copyright": "© 2024 Solus Motobombas. Todos os direitos reservados.",
        "socialLinks": {
            "facebook": "https://facebook.com/solusmotobombas",
            "instagram": "https://instagram.com/solusmotobombas",
            "linkedin": "https://linkedin.com/company/solusmotobombas"
        }
    }'::jsonb),
    ('seo', '{
        "title": "Solus Motobombas | Soluções em Bombeamento",
        "description": "Solus Motobombas - Soluções completas em bombeamento para indústria, agricultura e residências.",
        "keywords": ["motobombas", "bombas d água", "bombeamento", "Wilo", "pressurizadores"]
    }'::jsonb)
ON CONFLICT (key) DO NOTHING;

-- =============================================
-- 4. CLIENTS & SUPPLIERS TABLES
-- =============================================
CREATE TABLE IF NOT EXISTS clients (
    name TEXT PRIMARY KEY,
    logo TEXT,
    url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS suppliers (
    name TEXT PRIMARY KEY,
    logo TEXT,
    url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- 5. SERVICES & SERVICE IMAGES TABLES
-- =============================================
CREATE TABLE IF NOT EXISTS services (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    icon TEXT,
    "order" INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS service_images (
    id TEXT PRIMARY KEY,
    url TEXT NOT NULL,
    caption TEXT,
    "order" INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default services
INSERT INTO services (id, title, description, icon, "order") VALUES
    ('ete', 'Estações de Tratamento de Efluentes (ETE''s)', 'Manutenção e reparo de sistemas de bombeamento para tratamento de efluentes industriais e sanitários.', 'Droplets', 0),
    ('chuva', 'Captação e Aproveitamento de Água da Chuva', 'Sistemas de bombeamento para captação, armazenamento e distribuição de água pluvial.', 'Waves', 1),
    ('resfriamento', 'Torres de Resfriamento', 'Manutenção de bombas para sistemas de refrigeração industrial e torres de resfriamento.', 'ThermometerSnowflake', 2),
    ('drenagem', 'Sistemas de Drenagem', 'Bombas de drenagem para remoção de água em subsolos, galerias e áreas alagáveis.', 'Waves', 3),
    ('recalque', 'Bombas de Recalque', 'Instalação e manutenção de sistemas de recalque para edifícios e condomínios.', 'ArrowUp', 4),
    ('incendio', 'Sistemas Preventivo de Incêndio', 'Bombas de incêndio conforme normas ABNT, com manutenção preventiva e corretiva.', 'Flame', 5),
    ('boosters', 'Estações Boosters', 'Sistemas pressurizadores para garantir pressão adequada em redes de distribuição.', 'Gauge', 6),
    ('refrigeracao', 'Sistemas de Refrigeração de Máquinas', 'Bombas para injetoras, extrusoras, centros de usinagem, eletroerosão, chiller e outros equipamentos industriais.', 'Cog', 7),
    ('montagens', 'Montagens Especiais', 'Projetos e montagens customizadas para necessidades específicas de bombeamento.', 'PenTool', 8)
ON CONFLICT (id) DO NOTHING;

-- =============================================
-- 6. ADMIN USERS TABLE (optional - for Supabase Auth)
-- =============================================
CREATE TABLE IF NOT EXISTS admin_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login TIMESTAMP WITH TIME ZONE
);

-- =============================================
-- 7. ROW LEVEL SECURITY (RLS)
-- =============================================

-- Enable RLS on all tables
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_images ENABLE ROW LEVEL SECURITY;

-- Public read access for all tables
CREATE POLICY "Public read access for categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Public read access for products" ON products FOR SELECT USING (true);
CREATE POLICY "Public read access for site_config" ON site_config FOR SELECT USING (true);
CREATE POLICY "Public read access for clients" ON clients FOR SELECT USING (true);
CREATE POLICY "Public read access for suppliers" ON suppliers FOR SELECT USING (true);
CREATE POLICY "Public read access for services" ON services FOR SELECT USING (true);
CREATE POLICY "Public read access for service_images" ON service_images FOR SELECT USING (true);

-- Authenticated users can modify (simplified for now)
CREATE POLICY "Enable all for authenticated users on categories" ON categories FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all for authenticated users on products" ON products FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all for authenticated users on site_config" ON site_config FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all for authenticated users on clients" ON clients FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all for authenticated users on suppliers" ON suppliers FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all for authenticated users on services" ON services FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all for authenticated users on service_images" ON service_images FOR ALL USING (true) WITH CHECK (true);

-- =============================================
-- 8. FUNCTIONS & TRIGGERS
-- =============================================

-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_site_config_updated_at BEFORE UPDATE ON site_config FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON services FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to update category product count
CREATE OR REPLACE FUNCTION update_category_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE categories SET count = count + 1 WHERE id = NEW.category;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE categories SET count = count - 1 WHERE id = OLD.category;
    ELSIF TG_OP = 'UPDATE' AND OLD.category != NEW.category THEN
        UPDATE categories SET count = count - 1 WHERE id = OLD.category;
        UPDATE categories SET count = count + 1 WHERE id = NEW.category;
    END IF;
    RETURN COALESCE(NEW, OLD);
END;
$$ language 'plpgsql';

-- Trigger for category count
CREATE TRIGGER update_category_count_trigger
    AFTER INSERT OR UPDATE OR DELETE ON products
    FOR EACH ROW EXECUTE FUNCTION update_category_count();

-- =============================================
-- 9. INSERT SAMPLE PRODUCTS
-- =============================================
INSERT INTO products (id, name, short_description, full_description, category, image, specs, applications, brand, featured) VALUES
    ('wilo-stratos-maxo', 'Wilo-Stratos MAXO', 'Bomba de rotor molhado de alta eficiência com conectividade inteligente.', 'A Wilo-Stratos MAXO representa o próximo nível de bombas inteligentes.', 'bombas', '/placeholder.svg', '[{"label": "Vazão máx.", "value": "16 m³/h"}, {"label": "Altura manométrica", "value": "16 m"}, {"label": "Potência", "value": "1.5 kW"}]'::jsonb, ARRAY['Aquecimento', 'Climatização', 'Água gelada'], 'Wilo', true),
    ('wilo-cronoline-il', 'Wilo-CronoLine-IL', 'Bomba inline de simples estágio para aplicações de alta demanda.', 'A Wilo-CronoLine-IL é uma bomba inline robusta.', 'bombas-inline', '/placeholder.svg', '[{"label": "Vazão máx.", "value": "180 m³/h"}, {"label": "Altura manométrica", "value": "65 m"}]'::jsonb, ARRAY['HVAC', 'Sistemas de aquecimento'], 'Wilo', false),
    ('pressurizador-pw', 'Pressurizador PW Series', 'Sistema de pressurização compacto para aplicações residenciais.', 'O Pressurizador PW Series oferece pressão constante e silenciosa.', 'pressurizadores', '/placeholder.svg', '[{"label": "Vazão máx.", "value": "3.6 m³/h"}, {"label": "Pressão máx.", "value": "40 m"}]'::jsonb, ARRAY['Residencial', 'Apartamentos'], 'Schneider', true),
    ('submersivel-twu', 'Wilo-Sub TWU 4', 'Bomba submersível para água limpa de poços profundos.', 'A Wilo-Sub TWU 4 é uma bomba submersível de alta qualidade.', 'submersiveis', '/placeholder.svg', '[{"label": "Vazão máx.", "value": "10 m³/h"}, {"label": "Altura máx.", "value": "200 m"}]'::jsonb, ARRAY['Poços artesianos', 'Irrigação'], 'Wilo', true)
ON CONFLICT (id) DO NOTHING;
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
