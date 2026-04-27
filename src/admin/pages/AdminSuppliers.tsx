import { useState } from 'react';
import { useAdmin } from '../context/AdminContext';
import { SupplierBrand } from '@/data/supplierBrands';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Plus, Pencil, Trash2, ExternalLink, Factory } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import ImageUpload from '../components/ImageUpload';

export default function AdminSuppliers() {
    const { suppliers, addSupplier, updateSupplier, deleteSupplier } = useAdmin();
    const { toast } = useToast();
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [deleteIndex, setDeleteIndex] = useState<number | null>(null);
    const [form, setForm] = useState<SupplierBrand>({ name: '', logo: '', url: '' });

    const openNewDialog = () => {
        setForm({ name: '', logo: '', url: '' });
        setEditingIndex(null);
        setDialogOpen(true);
    };

    const openEditDialog = (index: number) => {
        setForm({ ...suppliers[index] });
        setEditingIndex(index);
        setDialogOpen(true);
    };

    const handleSubmit = async () => {
        if (!form.name.trim()) {
            toast({ title: 'Erro', description: 'Nome é obrigatório.', variant: 'destructive' });
            return;
        }

        if (editingIndex !== null) {
            await updateSupplier(editingIndex, form);
            toast({ title: 'Fornecedor atualizado', description: `${form.name} foi atualizado.` });
        } else {
            await addSupplier(form);
            toast({ title: 'Fornecedor adicionado', description: `${form.name} foi adicionado.` });
        }
        setDialogOpen(false);
    };

    const handleDelete = async () => {
        if (deleteIndex !== null) {
            const name = suppliers[deleteIndex].name;
            await deleteSupplier(deleteIndex);
            toast({ title: 'Fornecedor removido', description: `${name} foi removido.` });
            setDeleteIndex(null);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
                        <Factory className="w-8 h-8 text-primary" />
                        Fornecedores
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Gerencie as marcas e fornecedores parceiros
                    </p>
                </div>
                <Button onClick={openNewDialog}>
                    <Plus className="w-4 h-4 mr-2" />
                    Adicionar Fornecedor
                </Button>
            </div>

            {/* Suppliers Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {suppliers.map((supplier, index) => (
                    <Card key={index} className="group hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                            <div className="aspect-[3/2] bg-muted/50 rounded-lg flex items-center justify-center mb-3 overflow-hidden">
                                {supplier.logo ? (
                                    <img
                                        src={supplier.logo}
                                        alt={supplier.name}
                                        className="max-w-full max-h-full object-contain p-2"
                                    />
                                ) : (
                                    <Factory className="w-12 h-12 text-muted-foreground/30" />
                                )}
                            </div>
                            <h3 className="font-semibold text-sm truncate">{supplier.name}</h3>
                            {supplier.url && (
                                <a
                                    href={supplier.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1 mt-1"
                                >
                                    <ExternalLink className="w-3 h-3" />
                                    Visitar site
                                </a>
                            )}
                            <div className="flex gap-2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button variant="outline" size="sm" onClick={() => openEditDialog(index)}>
                                    <Pencil className="w-3 h-3 mr-1" />
                                    Editar
                                </Button>
                                <Button variant="outline" size="sm" className="text-destructive" onClick={() => setDeleteIndex(index)}>
                                    <Trash2 className="w-3 h-3" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {suppliers.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                    <Factory className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>Nenhum fornecedor cadastrado ainda.</p>
                    <Button variant="outline" className="mt-4" onClick={openNewDialog}>
                        Adicionar primeiro fornecedor
                    </Button>
                </div>
            )}

            {/* Add/Edit Dialog */}
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle>{editingIndex !== null ? 'Editar Fornecedor' : 'Novo Fornecedor'}</DialogTitle>
                        <DialogDescription>
                            {editingIndex !== null
                                ? 'Atualize as informações do fornecedor.'
                                : 'Adicione um novo fornecedor parceiro.'}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label>Nome do Fornecedor *</Label>
                            <Input
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                placeholder="Ex: Wilo"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Logo</Label>
                            <ImageUpload
                                value={form.logo}
                                onChange={(url) => setForm({ ...form, logo: url })}
                                folder="suppliers"
                                aspectRatio="landscape"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>URL do Site</Label>
                            <Input
                                value={form.url}
                                onChange={(e) => setForm({ ...form, url: e.target.value })}
                                placeholder="https://www.fornecedor.com"
                            />
                        </div>
                        <div className="flex justify-end gap-2">
                            <Button variant="outline" onClick={() => setDialogOpen(false)}>
                                Cancelar
                            </Button>
                            <Button onClick={handleSubmit}>
                                {editingIndex !== null ? 'Salvar' : 'Adicionar'}
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation */}
            <Dialog open={deleteIndex !== null} onOpenChange={() => setDeleteIndex(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirmar Exclusão</DialogTitle>
                        <DialogDescription>
                            Tem certeza que deseja remover{' '}
                            <strong>{deleteIndex !== null ? suppliers[deleteIndex]?.name : ''}</strong>?
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setDeleteIndex(null)}>
                            Cancelar
                        </Button>
                        <Button variant="destructive" onClick={handleDelete}>
                            Remover
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
