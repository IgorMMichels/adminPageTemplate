import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { SiteConfig, defaultSiteConfig } from '@/data/siteConfig';
import { Product, Category, products as defaultProducts, categories as defaultCategories } from '@/data/productsData';
import { ClientBrand, clientBrands as defaultClients } from '@/data/clientBrands';
import { SupplierBrand, supplierBrands as defaultSuppliers } from '@/data/supplierBrands';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { invalidatePublicDataCache } from '@/hooks/usePublicData';

// Service type for admin management
export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  order: number;
}

// Service image for gallery
export interface ServiceImage {
  id: string;
  url: string;
  caption: string;
  order: number;
}

interface AdminUser {
  username: string;
  isAuthenticated: boolean;
}

interface AdminContextType {
  // Auth
  user: AdminUser | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
  changePassword: (currentPassword: string, newPassword: string) => boolean;

  // Site Config
  siteConfig: SiteConfig;
  updateSiteConfig: (config: Partial<SiteConfig>) => Promise<void>;
  resetSiteConfig: () => Promise<void>;

  // Products
  products: Product[];
  categories: Category[];
  addProduct: (product: Product) => Promise<void>;
  updateProduct: (id: string, product: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  addCategory: (category: Category) => Promise<void>;
  updateCategory: (id: string, category: Partial<Category>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;

  // Clients
  clients: ClientBrand[];
  addClient: (client: ClientBrand) => Promise<void>;
  updateClient: (index: number, client: ClientBrand) => Promise<void>;
  deleteClient: (index: number) => Promise<void>;

  // Suppliers
  suppliers: SupplierBrand[];
  addSupplier: (supplier: SupplierBrand) => Promise<void>;
  updateSupplier: (index: number, supplier: SupplierBrand) => Promise<void>;
  deleteSupplier: (index: number) => Promise<void>;

  // Services
  services: ServiceItem[];
  addService: (service: ServiceItem) => Promise<void>;
  updateService: (id: string, service: Partial<ServiceItem>) => Promise<void>;
  deleteService: (id: string) => Promise<void>;

  // Service Images
  serviceImages: ServiceImage[];
  addServiceImage: (image: ServiceImage) => Promise<void>;
  updateServiceImage: (id: string, image: Partial<ServiceImage>) => Promise<void>;
  deleteServiceImage: (id: string) => Promise<void>;

  // Loading states
  loading: boolean;
  supabaseConnected: boolean;
  refreshData: () => Promise<void>;
  
  // Database Health & Sync
  dbHealth: Record<string, boolean>;
  checkDatabaseHealth: () => Promise<void>;
  syncLocalToSupabase: (onProgress?: (progress: number, message: string) => void) => Promise<boolean>;
  isMigrating: boolean;

  // UI State
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

// Read credentials from env, fallback to defaults
const getAdminCredentials = () => ({
  username: import.meta.env.VITE_ADMIN_USERNAME || 'admin',
  password: import.meta.env.VITE_ADMIN_PASSWORD || '0000',
});

// Helper to safely parse JSON from localStorage
const safeGetItem = <T,>(key: string, defaultValue: T): T => {
  try {
    const stored = localStorage.getItem(key);
    if (!stored) return defaultValue;
    const parsed = JSON.parse(stored);
    return { ...defaultValue, ...parsed };
  } catch (e) {
    console.error(`Error parsing ${key} from localStorage:`, e);
    localStorage.removeItem(key); // Remove invalid data
    return defaultValue;
  }
};

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

// Default services matching the Services page (generic placeholders)
const defaultServices: ServiceItem[] = [
  { id: 'service-1', title: "Service 1", description: "Description of service 1.", icon: 'Gear', order: 0 },
  { id: 'service-2', title: "Service 2", description: "Description of service 2.", icon: 'Star', order: 1 },
  { id: 'service-3', title: "Service 3", description: "Description of service 3.", icon: 'Zap', order: 2 },
];

// Helper functions for database conversion
const dbToProduct = (row: any): Product => ({
  id: row.id,
  name: row.name,
  shortDescription: row.short_description || '',
  fullDescription: row.full_description || '',
  category: row.category || '',
  subcategory: row.subcategory,
  image: row.image || '/placeholder.svg',
  specs: row.specs || [],
  applications: row.applications || [],
  brand: row.brand || '',
  featured: row.featured || false,
});

const productToDb = (product: Product) => ({
  id: product.id,
  name: product.name,
  short_description: product.shortDescription,
  full_description: product.fullDescription,
  category: product.category,
  subcategory: product.subcategory,
  image: product.image,
  specs: product.specs,
  applications: product.applications,
  brand: product.brand,
  featured: product.featured,
});

export function AdminProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.user);
      return stored ? JSON.parse(stored) : null;
    } catch (e) {
      console.error('Error parsing user from localStorage:', e);
      localStorage.removeItem(STORAGE_KEYS.user);
      return null;
    }
  });

  // Deep merge helper - merges source into target, filling missing fields from target
function deepMerge<T extends Record<string, any>>(target: T, source: Partial<T>): T {
  const result = { ...target };
  for (const key in source) {
    if (source[key] !== undefined) {
      if (typeof source[key] === 'object' && source[key] !== null && !Array.isArray(source[key])) {
        result[key] = deepMerge(target[key] || {}, source[key]);
      } else {
        result[key] = source[key];
      }
    }
  }
  return result;
}

const [siteConfig, setSiteConfig] = useState<SiteConfig>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.siteConfig);
      const parsed = stored ? JSON.parse(stored) : {};
      // Deep merge: stored values take precedence, defaultSiteConfig fills missing fields
      return deepMerge(defaultSiteConfig, parsed);
    } catch (e) {
      console.error('Error parsing siteConfig from localStorage:', e);
      localStorage.removeItem(STORAGE_KEYS.siteConfig);
      return defaultSiteConfig;
    }
  });

  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.products);
      return stored ? JSON.parse(stored) : defaultProducts;
    } catch (e) {
      console.error('Error parsing products from localStorage:', e);
      localStorage.removeItem(STORAGE_KEYS.products);
      return defaultProducts;
    }
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.categories);
      return stored ? JSON.parse(stored) : defaultCategories;
    } catch (e) {
      console.error('Error parsing categories from localStorage:', e);
      localStorage.removeItem(STORAGE_KEYS.categories);
      return defaultCategories;
    }
  });

  const [clients, setClients] = useState<ClientBrand[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.clients);
      return stored ? JSON.parse(stored) : defaultClients;
    } catch (e) {
      console.error('Error parsing clients from localStorage:', e);
      localStorage.removeItem(STORAGE_KEYS.clients);
      return defaultClients;
    }
  });

  const [suppliers, setSuppliers] = useState<SupplierBrand[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.suppliers);
      return stored ? JSON.parse(stored) : defaultSuppliers;
    } catch (e) {
      console.error('Error parsing suppliers from localStorage:', e);
      localStorage.removeItem(STORAGE_KEYS.suppliers);
      return defaultSuppliers;
    }
  });

  const [services, setServices] = useState<ServiceItem[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.services);
      return stored ? JSON.parse(stored) : defaultServices;
    } catch (e) {
      console.error('Error parsing services from localStorage:', e);
      localStorage.removeItem(STORAGE_KEYS.services);
      return defaultServices;
    }
  });

  const [serviceImages, setServiceImages] = useState<ServiceImage[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.serviceImages);
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      console.error('Error parsing serviceImages from localStorage:', e);
      localStorage.removeItem(STORAGE_KEYS.serviceImages);
      return [];
    }
  });

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [supabaseConnected, setSupabaseConnected] = useState(false);
  const [dbHealth, setDbHealth] = useState<Record<string, boolean>>({});
  const [isMigrating, setIsMigrating] = useState(false);

  // Custom password stored in localStorage (overrides env)
  const [customPassword, setCustomPassword] = useState<string | null>(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.password);
    } catch (e) {
      console.error('Error parsing password from localStorage:', e);
      localStorage.removeItem(STORAGE_KEYS.password);
      return null;
    }
  });

  const loadData = async () => {
    if (!isSupabaseConfigured()) {
      setLoading(false);
      return;
    }

    const timeoutId = setTimeout(() => {
      setLoading(false);
    }, 10000);

    try {
      setLoading(true);
      const [
        productsRes,
        categoriesRes,
        clientsRes,
        suppliersRes,
        servicesRes,
        imagesRes,
        configRes
      ] = await Promise.all([
        supabase.from('products').select('*').order('created_at', { ascending: false }),
        supabase.from('categories').select('*').order('name'),
        supabase.from('clients').select('*').order('name'),
        supabase.from('suppliers').select('*').order('name'),
        supabase.from('services').select('*').order('order'),
        supabase.from('service_images').select('*').order('order'),
        supabase.from('site_config').select('*')
      ]);

      if (!productsRes.error) {
        if (productsRes.data && productsRes.data.length > 0) setProducts(productsRes.data.map(dbToProduct));
        setSupabaseConnected(true);
      }
      if (!categoriesRes.error && categoriesRes.data) setCategories(categoriesRes.data);
      if (!clientsRes.error && clientsRes.data) setClients(clientsRes.data);
      if (!suppliersRes.error && suppliersRes.data) setSuppliers(suppliersRes.data);
      if (!servicesRes.error && servicesRes.data) setServices(servicesRes.data);
      if (!imagesRes.error && imagesRes.data) setServiceImages(imagesRes.data);

      if (!configRes.error && configRes.data && configRes.data.length > 0) {
        const config: Partial<SiteConfig> = {};
        configRes.data.forEach((row) => {
          if (row.key === 'products_section') {
            (config as any).products = row.value;
          } else {
            (config as any)[row.key] = row.value;
          }
        });
        setSiteConfig({ ...defaultSiteConfig, ...config });
      }
    } catch (err) {
      console.error('Error loading from Supabase:', err);
    } finally {
      clearTimeout(timeoutId);
      setLoading(false);
    }
  };

  const refreshData = async () => {
    await loadData();
    if (isSupabaseConfigured()) await checkDatabaseHealth();
  };

  const checkDatabaseHealth = async () => {
    if (!isSupabaseConfigured()) return;
    
    const tables = ['products', 'categories', 'site_config', 'clients', 'suppliers', 'services', 'service_images'];
    const health: Record<string, boolean> = {};
    
    await Promise.all(tables.map(async (table) => {
      try {
        const { error } = await supabase.from(table).select('count', { count: 'exact', head: true });
        health[table] = !error;
      } catch (err) {
        health[table] = false;
      }
    }));
    
    setDbHealth(health);
  };

  const syncLocalToSupabase = async (onProgress?: (progress: number, message: string) => void) => {
    if (!isSupabaseConfigured() || isMigrating) return false;
    
    setIsMigrating(true);
    let success = true;
    
    try {
      const totalSteps = 7;
      let currentStep = 0;

      const updateProgress = (message: string) => {
        currentStep++;
        const progress = Math.round((currentStep / totalSteps) * 100);
        if (onProgress) onProgress(progress, message);
      };

      updateProgress('Sincronizando categorias...');
      const { error: catErr } = await supabase.from('categories').upsert(categories);
      if (catErr) throw catErr;

      updateProgress('Sincronizando produtos...');
      const dbProducts = products.map(productToDb);
      const { error: prodErr } = await supabase.from('products').upsert(dbProducts);
      if (prodErr) throw prodErr;

      updateProgress('Sincronizando configurações...');
      const configRows = [
        { key: 'company', value: siteConfig.company },
        { key: 'hero', value: siteConfig.hero },
        { key: 'about', value: siteConfig.about },
        { key: 'features', value: siteConfig.features },
        { key: 'products_section', value: siteConfig.products },
        { key: 'services', value: siteConfig.services },
        { key: 'contact', value: siteConfig.contact },
        { key: 'footer', value: siteConfig.footer },
        { key: 'seo', value: siteConfig.seo }
      ];
      const { error: confErr } = await supabase.from('site_config').upsert(configRows);
      if (confErr) throw confErr;

      updateProgress('Sincronizando clientes...');
      const { error: clientErr } = await supabase.from('clients').upsert(clients);
      if (clientErr) throw clientErr;

      updateProgress('Sincronizando fornecedores...');
      const { error: suppErr } = await supabase.from('suppliers').upsert(suppliers);
      if (suppErr) throw suppErr;

      updateProgress('Sincronizando serviços...');
      const { error: servErr } = await supabase.from('services').upsert(services);
      if (servErr) throw servErr;

      updateProgress('Sincronizando galeria...');
      const { error: imgErr } = await supabase.from('service_images').upsert(serviceImages);
      if (imgErr) throw imgErr;

      updateProgress('Sincronização concluída!');
      setSupabaseConnected(true);
      await checkDatabaseHealth();
    } catch (err) {
      console.error('Migration failed:', err);
      success = false;
      if (onProgress) onProgress(0, `Erro: ${err instanceof Error ? err.message : 'Falha desconhecida'}`);
    } finally {
      setIsMigrating(false);
    }
    
    return success;
  };

  useEffect(() => {
    loadData();
    if (isSupabaseConfigured()) {
      checkDatabaseHealth();
    }
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.user);
    }
  }, [user]);

  // Persist to localStorage as backup
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.siteConfig, JSON.stringify(siteConfig));
  }, [siteConfig]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.products, JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.categories, JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.clients, JSON.stringify(clients));
  }, [clients]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.suppliers, JSON.stringify(suppliers));
  }, [suppliers]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.services, JSON.stringify(services));
  }, [services]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.serviceImages, JSON.stringify(serviceImages));
  }, [serviceImages]);

  // Auth functions
  const login = (username: string, password: string): boolean => {
    const creds = getAdminCredentials();
    const currentPassword = customPassword || creds.password;
    if (username === creds.username && password === currentPassword) {
      setUser({ username, isAuthenticated: true });
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
  };

  const changePassword = (currentPassword: string, newPassword: string): boolean => {
    const creds = getAdminCredentials();
    const currentStoredPassword = customPassword || creds.password;
    if (currentPassword !== currentStoredPassword) {
      return false;
    }
    setCustomPassword(newPassword);
    localStorage.setItem(STORAGE_KEYS.password, newPassword);
    return true;
  };

  // Site config functions
  const updateSiteConfig = async (config: Partial<SiteConfig>) => {
    setSiteConfig((prev) => {
      const updated = { ...prev };
      Object.keys(config).forEach((key) => {
        const k = key as keyof SiteConfig;
        if (typeof config[k] === 'object' && config[k] !== null) {
          (updated[k] as any) = { ...(prev[k] as any), ...(config[k] as any) };
        } else {
          (updated[k] as any) = config[k];
        }
      });
      return updated;
    });

    invalidatePublicDataCache();

    if (isSupabaseConfigured()) {
      try {
        for (const [key, value] of Object.entries(config)) {
          const dbKey = key === 'products' ? 'products_section' : key;
          await supabase.from('site_config').upsert({ key: dbKey, value });
        }
      } catch (err) {
        console.error('Error updating site config in Supabase:', err);
      }
    }
  };

  const resetSiteConfig = async () => {
    setSiteConfig(defaultSiteConfig);
    invalidatePublicDataCache();

    if (isSupabaseConfigured()) {
      try {
        const configEntries = [
          { key: 'company', value: defaultSiteConfig.company },
          { key: 'hero', value: defaultSiteConfig.hero },
          { key: 'about', value: defaultSiteConfig.about },
          { key: 'features', value: defaultSiteConfig.features },
          { key: 'products_section', value: defaultSiteConfig.products },
          { key: 'services', value: defaultSiteConfig.services },
          { key: 'contact', value: defaultSiteConfig.contact },
          { key: 'footer', value: defaultSiteConfig.footer },
          { key: 'seo', value: defaultSiteConfig.seo },
        ];

        for (const entry of configEntries) {
          await supabase.from('site_config').upsert(entry);
        }
      } catch (err) {
        console.error('Error resetting site config in Supabase:', err);
      }
    }
  };

  // Product functions
  const addProduct = async (product: Product) => {
    setProducts((prev) => [...prev, product]);
    invalidatePublicDataCache();

    if (isSupabaseConfigured()) {
      try {
        await supabase.from('products').insert(productToDb(product));
      } catch (err) {
        console.error('Error adding product to Supabase:', err);
      }
    }

    const category = categories.find((c) => c.id === product.category);
    if (category) {
      await updateCategory(category.id, { count: category.count + 1 });
    }
  };

  const updateProduct = async (id: string, productUpdates: Partial<Product>) => {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...productUpdates } : p)));
    invalidatePublicDataCache();

    if (isSupabaseConfigured()) {
      try {
        const dbUpdates: any = {};
        if (productUpdates.name !== undefined) dbUpdates.name = productUpdates.name;
        if (productUpdates.shortDescription !== undefined) dbUpdates.short_description = productUpdates.shortDescription;
        if (productUpdates.fullDescription !== undefined) dbUpdates.full_description = productUpdates.fullDescription;
        if (productUpdates.category !== undefined) dbUpdates.category = productUpdates.category;
        if (productUpdates.subcategory !== undefined) dbUpdates.subcategory = productUpdates.subcategory;
        if (productUpdates.image !== undefined) dbUpdates.image = productUpdates.image;
        if (productUpdates.specs !== undefined) dbUpdates.specs = productUpdates.specs;
        if (productUpdates.applications !== undefined) dbUpdates.applications = productUpdates.applications;
        if (productUpdates.brand !== undefined) dbUpdates.brand = productUpdates.brand;
        if (productUpdates.featured !== undefined) dbUpdates.featured = productUpdates.featured;

        await supabase.from('products').update(dbUpdates).eq('id', id);
      } catch (err) {
        console.error('Error updating product in Supabase:', err);
      }
    }
  };

  const deleteProduct = async (id: string) => {
    const product = products.find((p) => p.id === id);
    setProducts((prev) => prev.filter((p) => p.id !== id));
    invalidatePublicDataCache();

    if (isSupabaseConfigured()) {
      try {
        await supabase.from('products').delete().eq('id', id);
      } catch (err) {
        console.error('Error deleting product from Supabase:', err);
      }
    }

    if (product) {
      const category = categories.find((c) => c.id === product.category);
      if (category && category.count > 0) {
        await updateCategory(category.id, { count: category.count - 1 });
      }
    }
  };

  // Category functions
  const addCategory = async (category: Category) => {
    setCategories((prev) => [...prev, category]);
    invalidatePublicDataCache();

    if (isSupabaseConfigured()) {
      try {
        await supabase.from('categories').insert(category);
      } catch (err) {
        console.error('Error adding category to Supabase:', err);
      }
    }
  };

  const updateCategory = async (id: string, categoryUpdates: Partial<Category>) => {
    setCategories((prev) => prev.map((c) => (c.id === id ? { ...c, ...categoryUpdates } : c)));
    invalidatePublicDataCache();

    if (isSupabaseConfigured()) {
      try {
        await supabase.from('categories').update(categoryUpdates).eq('id', id);
      } catch (err) {
        console.error('Error updating category in Supabase:', err);
      }
    }
  };

  const deleteCategory = async (id: string) => {
    setProducts((prev) => prev.filter((p) => p.category !== id));
    setCategories((prev) => prev.filter((c) => c.id !== id));
    invalidatePublicDataCache();

    if (isSupabaseConfigured()) {
      try {
        await supabase.from('products').delete().eq('category', id);
        await supabase.from('categories').delete().eq('id', id);
      } catch (err) {
        console.error('Error deleting category from Supabase:', err);
      }
    }
  };

  // Client functions
  const addClient = async (client: ClientBrand) => {
    setClients((prev) => [...prev, client]);
    invalidatePublicDataCache();

    if (isSupabaseConfigured()) {
      try {
        await supabase.from('clients').insert(client);
      } catch (err) {
        console.error('Error adding client to Supabase:', err);
      }
    }
  };

  const updateClient = async (index: number, client: ClientBrand) => {
    setClients((prev) => prev.map((c, i) => (i === index ? client : c)));
    invalidatePublicDataCache();

    if (isSupabaseConfigured()) {
      try {
        await supabase.from('clients').update(client).eq('name', client.name);
      } catch (err) {
        console.error('Error updating client in Supabase:', err);
      }
    }
  };

  const deleteClient = async (index: number) => {
    const client = clients[index];
    setClients((prev) => prev.filter((_, i) => i !== index));
    invalidatePublicDataCache();

    if (isSupabaseConfigured() && client) {
      try {
        await supabase.from('clients').delete().eq('name', client.name);
      } catch (err) {
        console.error('Error deleting client from Supabase:', err);
      }
    }
  };

  // Supplier functions
  const addSupplier = async (supplier: SupplierBrand) => {
    setSuppliers((prev) => [...prev, supplier]);
    invalidatePublicDataCache();

    if (isSupabaseConfigured()) {
      try {
        await supabase.from('suppliers').insert(supplier);
      } catch (err) {
        console.error('Error adding supplier to Supabase:', err);
      }
    }
  };

  const updateSupplier = async (index: number, supplier: SupplierBrand) => {
    setSuppliers((prev) => prev.map((s, i) => (i === index ? supplier : s)));
    invalidatePublicDataCache();

    if (isSupabaseConfigured()) {
      try {
        await supabase.from('suppliers').update(supplier).eq('name', supplier.name);
      } catch (err) {
        console.error('Error updating supplier in Supabase:', err);
      }
    }
  };

  const deleteSupplier = async (index: number) => {
    const supplier = suppliers[index];
    setSuppliers((prev) => prev.filter((_, i) => i !== index));
    invalidatePublicDataCache();

    if (isSupabaseConfigured() && supplier) {
      try {
        await supabase.from('suppliers').delete().eq('name', supplier.name);
      } catch (err) {
        console.error('Error deleting supplier from Supabase:', err);
      }
    }
  };

  // Service functions
  const addService = async (service: ServiceItem) => {
    setServices((prev) => [...prev, service]);
    invalidatePublicDataCache();

    if (isSupabaseConfigured()) {
      try {
        await supabase.from('services').insert(service);
      } catch (err) {
        console.error('Error adding service to Supabase:', err);
      }
    }
  };

  const updateService = async (id: string, serviceUpdates: Partial<ServiceItem>) => {
    setServices((prev) => prev.map((s) => (s.id === id ? { ...s, ...serviceUpdates } : s)));
    invalidatePublicDataCache();

    if (isSupabaseConfigured()) {
      try {
        await supabase.from('services').update(serviceUpdates).eq('id', id);
      } catch (err) {
        console.error('Error updating service in Supabase:', err);
      }
    }
  };

  const deleteService = async (id: string) => {
    setServices((prev) => prev.filter((s) => s.id !== id));
    invalidatePublicDataCache();

    if (isSupabaseConfigured()) {
      try {
        await supabase.from('services').delete().eq('id', id);
      } catch (err) {
        console.error('Error deleting service from Supabase:', err);
      }
    }
  };

  // Service Image functions
  const addServiceImage = async (image: ServiceImage) => {
    setServiceImages((prev) => [...prev, image]);
    invalidatePublicDataCache();

    if (isSupabaseConfigured()) {
      try {
        await supabase.from('service_images').insert(image);
      } catch (err) {
        console.error('Error adding service image to Supabase:', err);
      }
    }
  };

  const updateServiceImage = async (id: string, imageUpdates: Partial<ServiceImage>) => {
    setServiceImages((prev) => prev.map((img) => (img.id === id ? { ...img, ...imageUpdates } : img)));
    invalidatePublicDataCache();

    if (isSupabaseConfigured()) {
      try {
        await supabase.from('service_images').update(imageUpdates).eq('id', id);
      } catch (err) {
        console.error('Error updating service image in Supabase:', err);
      }
    }
  };

  const deleteServiceImage = async (id: string) => {
    setServiceImages((prev) => prev.filter((img) => img.id !== id));
    invalidatePublicDataCache();

    if (isSupabaseConfigured()) {
      try {
        await supabase.from('service_images').delete().eq('id', id);
      } catch (err) {
        console.error('Error deleting service image from Supabase:', err);
      }
    }
  };

  const value: AdminContextType = {
    user,
    login,
    logout,
    isAuthenticated: !!user?.isAuthenticated,
    changePassword,
    siteConfig,
    updateSiteConfig,
    resetSiteConfig,
    products,
    categories,
    addProduct,
    updateProduct,
    deleteProduct,
    addCategory,
    updateCategory,
    deleteCategory,
    clients,
    addClient,
    updateClient,
    deleteClient,
    suppliers,
    addSupplier,
    updateSupplier,
    deleteSupplier,
    services,
    addService,
    updateService,
    deleteService,
    serviceImages,
    addServiceImage,
    updateServiceImage,
    deleteServiceImage,
    loading,
    supabaseConnected,
    refreshData,
    sidebarOpen,
    setSidebarOpen,
  };

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
}
