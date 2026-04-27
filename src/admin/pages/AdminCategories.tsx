import { useState } from 'react';
import { useAdmin } from '../context/AdminContext';
import { Category } from '@/data/productsData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Trash2, Pencil, Plus, ArrowRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Textarea } from '@/components/ui/textarea';

// Helper: simple slugify for id
const slugify = (text: string) => text.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-')
  .replace(/(^-|-$)/g, '');

const emptyCategory: Category = {
  id: '',
  name: '',
  icon: '🏷️',
  count: 0,
  description: '',
};

export default function AdminCategories() {
  const { categories, addCategory, updateCategory, deleteCategory } = useAdmin();
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [form, setForm] = useState<Category>(emptyCategory);
  const [deleteCandidate, setDeleteCandidate] = useState<Category | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const openNew = () => {
    setEditing(null);
    setForm({ ...emptyCategory, name: '', icon: '🏷️', count: 0, description: '' });
    setDialogOpen(true);
  };

  const openEdit = (cat: Category) => {
    setEditing(cat);
    setForm({ ...cat });
    setDialogOpen(true);
  };

  const handleSubmit = async () => {
    if (editing) {
      // Update existing
      const updates: Partial<Category> = { name: form.name, icon: form.icon, description: form.description };
      await updateCategory(editing.id, updates);
      toast({ title: 'Categoria atualizada', description: 'As alterações foram salvas.' });
    } else {
      // Create new with generated id
      const id = slugify(form.name || `categoria-${Date.now()}`);
      const newCat: Category = { ...form, id };
      await addCategory(newCat);
      toast({ title: 'Categoria adicionada', description: 'Nova categoria criada com sucesso.' });
    }
    setDialogOpen(false);
  };

  const confirmDelete = (cat: Category) => {
    setDeleteCandidate(cat);
    setDeleteDialogOpen(true);
  };

  const performDelete = async () => {
    if (deleteCandidate) {
      await deleteCategory(deleteCandidate.id);
      toast({ title: 'Categoria removida', description: 'A categoria foi removida.' });
      setDeleteCandidate(null);
      setDeleteDialogOpen(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Categorias</h1>
          <p className="text-muted-foreground mt-1">Gerencie as categorias de produtos</p>
        </div>
        <Button onClick={openNew}>
          <Plus className="w-4 h-4 mr-2" />
          Nova Categoria
        </Button>
      </div>

      {/* Categories Table */}
      <Card>
        <CardHeader>
          <CardTitle>Categorias Existentes</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ícone</TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead>Contagem</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map((cat) => (
                  <TableRow key={cat.id}>
                    <TableCell className="pt-4 pb-4">{cat.icon}</TableCell>
                    <TableCell className="pt-4 pb-4">{cat.name}</TableCell>
                    <TableCell className="pt-4 pb-4">{cat.count}</TableCell>
                    <TableCell className="pt-4 pb-4">{cat.description}</TableCell>
                    <TableCell className="pt-4 pb-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => openEdit(cat)}>
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive"
                          onClick={() => confirmDelete(cat)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editing ? 'Editar Categoria' : 'Nova Categoria'}</DialogTitle>
            <DialogDescription>
              {editing ? 'Altere os dados da categoria' : 'Crie uma nova categoria para organizar seus produtos'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <Label>Nome</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Nova Categoria" />
            </div>
            <div className="space-y-2">
              <Label>Ícone</Label>
              <Input value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} placeholder="🏷️" />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Descrição</Label>
            <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleSubmit}>{editing ? 'Salvar Alterações' : 'Adicionar Categoria'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir a categoria "{deleteCandidate?.name}"? Isso pode afetar produtos associados.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteCandidate(null)}>Cancelar</Button>
            <Button variant="destructive" onClick={performDelete}>Excluir</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
