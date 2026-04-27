import { useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { SiteConfig, defaultSiteConfig } from '@/data/siteConfig';

export function useSupabaseSiteConfig() {
  const [siteConfig, setSiteConfig] = useState<SiteConfig>(defaultSiteConfig);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSiteConfig = useCallback(async () => {
    if (!isSupabaseConfigured()) {
      // Try to load from localStorage as fallback
      const stored = localStorage.getItem('admin_site_config');
      if (stored) {
        setSiteConfig({ ...defaultSiteConfig, ...JSON.parse(stored) });
      }
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('site_config')
        .select('*');

      if (error) throw error;

      if (data && data.length > 0) {
        const config: Partial<SiteConfig> = {};
        data.forEach((row) => {
          if (row.key === 'products_section') {
            (config as any).products = row.value;
          } else {
            (config as any)[row.key] = row.value;
          }
        });
        setSiteConfig({ ...defaultSiteConfig, ...config });
      }
      setError(null);
    } catch (err: any) {
      console.error('Error fetching site config:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSiteConfig();
  }, [fetchSiteConfig]);

  const updateSiteConfig = async (updates: Partial<SiteConfig>) => {
    // Update local state immediately
    setSiteConfig((prev) => {
      const updated = { ...prev };
      Object.keys(updates).forEach((key) => {
        const k = key as keyof SiteConfig;
        if (typeof updates[k] === 'object' && updates[k] !== null) {
          (updated[k] as any) = { ...(prev[k] as any), ...(updates[k] as any) };
        } else {
          (updated[k] as any) = updates[k];
        }
      });
      return updated;
    });

    if (!isSupabaseConfigured()) {
      // Save to localStorage as fallback
      localStorage.setItem('admin_site_config', JSON.stringify({ ...siteConfig, ...updates }));
      return { success: true };
    }

    try {
      // Update each key in the database
      for (const [key, value] of Object.entries(updates)) {
        const dbKey = key === 'products' ? 'products_section' : key;
        const { error } = await supabase
          .from('site_config')
          .upsert({ key: dbKey, value });

        if (error) throw error;
      }

      return { success: true };
    } catch (err: any) {
      console.error('Error updating site config:', err);
      return { success: false, error: err.message };
    }
  };

  const resetSiteConfig = async () => {
    setSiteConfig(defaultSiteConfig);
    
    if (!isSupabaseConfigured()) {
      localStorage.removeItem('admin_site_config');
      return { success: true };
    }

    try {
      // Reset all config values to defaults
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

      return { success: true };
    } catch (err: any) {
      console.error('Error resetting site config:', err);
      return { success: false, error: err.message };
    }
  };

  return {
    siteConfig,
    loading,
    error,
    updateSiteConfig,
    resetSiteConfig,
    refetch: fetchSiteConfig,
  };
}
