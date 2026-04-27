import { useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { Product } from '@/data/productsData';
import { products as defaultProducts } from '@/data/productsData';

// Convert database row to Product interface
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

// Convert Product to database row
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

export function useSupabaseProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    if (!isSupabaseConfigured()) {
      setProducts(defaultProducts);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setProducts(data?.map(dbToProduct) || []);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching products:', err);
      setError(err.message);
      // Fallback to default products
      setProducts(defaultProducts);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const addProduct = async (product: Product) => {
    if (!isSupabaseConfigured()) {
      setProducts((prev) => [...prev, product]);
      return { success: true };
    }

    try {
      const { error } = await supabase
        .from('products')
        .insert(productToDb(product));

      if (error) throw error;
      
      await fetchProducts();
      return { success: true };
    } catch (err: any) {
      console.error('Error adding product:', err);
      return { success: false, error: err.message };
    }
  };

  const updateProduct = async (id: string, updates: Partial<Product>) => {
    if (!isSupabaseConfigured()) {
      setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)));
      return { success: true };
    }

    try {
      const dbUpdates: any = {};
      if (updates.name !== undefined) dbUpdates.name = updates.name;
      if (updates.shortDescription !== undefined) dbUpdates.short_description = updates.shortDescription;
      if (updates.fullDescription !== undefined) dbUpdates.full_description = updates.fullDescription;
      if (updates.category !== undefined) dbUpdates.category = updates.category;
      if (updates.subcategory !== undefined) dbUpdates.subcategory = updates.subcategory;
      if (updates.image !== undefined) dbUpdates.image = updates.image;
      if (updates.specs !== undefined) dbUpdates.specs = updates.specs;
      if (updates.applications !== undefined) dbUpdates.applications = updates.applications;
      if (updates.brand !== undefined) dbUpdates.brand = updates.brand;
      if (updates.featured !== undefined) dbUpdates.featured = updates.featured;

      const { error } = await supabase
        .from('products')
        .update(dbUpdates)
        .eq('id', id);

      if (error) throw error;
      
      await fetchProducts();
      return { success: true };
    } catch (err: any) {
      console.error('Error updating product:', err);
      return { success: false, error: err.message };
    }
  };

  const deleteProduct = async (id: string) => {
    if (!isSupabaseConfigured()) {
      setProducts((prev) => prev.filter((p) => p.id !== id));
      return { success: true };
    }

    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      await fetchProducts();
      return { success: true };
    } catch (err: any) {
      console.error('Error deleting product:', err);
      return { success: false, error: err.message };
    }
  };

  return {
    products,
    loading,
    error,
    addProduct,
    updateProduct,
    deleteProduct,
    refetch: fetchProducts,
  };
}
