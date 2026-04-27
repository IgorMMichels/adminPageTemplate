import { useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { Category } from '@/data/productsData';
import { categories as defaultCategories } from '@/data/productsData';

export function useSupabaseCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = useCallback(async () => {
    if (!isSupabaseConfigured()) {
      setCategories(defaultCategories);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      if (error) throw error;
      
      setCategories(data || []);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching categories:', err);
      setError(err.message);
      setCategories(defaultCategories);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const addCategory = async (category: Category) => {
    if (!isSupabaseConfigured()) {
      setCategories((prev) => [...prev, category]);
      return { success: true };
    }

    try {
      const { error } = await supabase
        .from('categories')
        .insert(category);

      if (error) throw error;
      
      await fetchCategories();
      return { success: true };
    } catch (err: any) {
      console.error('Error adding category:', err);
      return { success: false, error: err.message };
    }
  };

  const updateCategory = async (id: string, updates: Partial<Category>) => {
    if (!isSupabaseConfigured()) {
      setCategories((prev) => prev.map((c) => (c.id === id ? { ...c, ...updates } : c)));
      return { success: true };
    }

    try {
      const { error } = await supabase
        .from('categories')
        .update(updates)
        .eq('id', id);

      if (error) throw error;
      
      await fetchCategories();
      return { success: true };
    } catch (err: any) {
      console.error('Error updating category:', err);
      return { success: false, error: err.message };
    }
  };

  const deleteCategory = async (id: string) => {
    if (!isSupabaseConfigured()) {
      setCategories((prev) => prev.filter((c) => c.id !== id));
      return { success: true };
    }

    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      await fetchCategories();
      return { success: true };
    } catch (err: any) {
      console.error('Error deleting category:', err);
      return { success: false, error: err.message };
    }
  };

  return {
    categories,
    loading,
    error,
    addCategory,
    updateCategory,
    deleteCategory,
    refetch: fetchCategories,
  };
}
