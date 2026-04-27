import { useState } from 'react';
import { useAdmin, ServiceImage } from '../context/AdminContext';
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
import { Plus, Trash2, ImageIcon, Pencil } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import ImageUpload from '../components/ImageUpload';

export default function AdminServiceImages() {
    const { serviceImages, addServiceImage, updateServiceImage, deleteServiceImage } = useAdmin();
    const { toast } = useToast();
    const [dialogOpen, setDialogOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [form, setForm] = useState<ServiceImage>({ id: '', url: '', caption: '', order: 0 });

    const openNewDialog = () => {
        setForm({ id: `img-${Date.now()}`, url: '', caption: '', order: serviceImages.length });
        setIsEditing(false);
        setDialogOpen(true);
    };

    const openEditDialog = (image: ServiceImage) => {
        setForm({ ...image });
        setIsEditing(true);
        setDialogOpen(true);
    };

    const handleSubmit = async () => {
        if (!form.url) {
            toast({ title: 'Erro', description: 'Selecione uma imagem.', variant: 'destructive' });
            return;
        }

        if (isEditing) {
            await updateServiceImage(form.id, form);
            toast({ title: 'Imagem atualizada', description: 'A imagem foi atualizada com sucesso.' });
        } else {
            await addServiceImage(form);
            toast({ title: 'Imagem adicionada', description: 'A imagem foi adicionada à galeria.' });
        }
        setDialogOpen(false);
    };

    const handleDelete = async () => {
        if (deleteId) {
            await deleteServiceImage(deleteId);
            toast({ title: 'Imagem removida', description: 'A imagem foi removida da galeria.' });
            setDeleteId(null);
        }
    };

    const sortedImages = [...serviceImages].sort((a, b) => a.order - b.order);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
                        <ImageIcon className="w-8 h-8 text-primary" />
                        Imagens dos Serviços
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Galeria de imagens dos serviços realizados
                    </p>
                </div>
                <Button onClick={openNewDialog}>
                    <Plus className="w-4 h-4 mr-2" />
                    Adicionar Imagem
                </Button>
            </div>

            {/* Images Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {sortedImages.map((image) => (
                    <Card key={image.id} className="group hover:shadow-md transition-shadow overflow-hidden">
                        <div className="aspect-video bg-muted/50 relative overflow-hidden">
                            <img
                                src={image.url}
                                alt={image.caption || 'Imagem do serviço'}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                <Button variant="secondary" size="sm" onClick={() => openEditDialog(image)}>
                                    <Pencil className="w-3 h-3 mr-1" />
                                    Editar
                                </Button>
                                <Button variant="destructive" size="sm" onClick={() => setDeleteId(image.id)}>
                                    <Trash2 className="w-3 h-3" />
                                </Button>
                            </div>
                        </div>
                        <CardContent className="p-3">
                            <p className="text-sm text-muted-foreground truncate">
                                {image.caption || 'Sem legenda'}
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {serviceImages.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                    <ImageIcon className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>Nenhuma imagem adicionada ainda.</p>
                    <Button variant="outline" className="mt-4" onClick={openNewDialog}>
                        Adicionar primeira imagem
                    </Button>
                </div>
            )}

            {/* Add/Edit Dialog */}
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle>{isEditing ? 'Editar Imagem' : 'Nova Imagem'}</DialogTitle>
                        <DialogDescription>
                            {isEditing ? 'Atualize a imagem e legenda.' : 'Adicione uma nova imagem à galeria.'}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label>Imagem *</Label>
                            <ImageUpload
                                value={form.url}
                                onChange={(url) => setForm({ ...form, url })}
                                folder="service-images"
                                aspectRatio="landscape"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Legenda</Label>
                            <Input
                                value={form.caption}
                                onChange={(e) => setForm({ ...form, caption: e.target.value })}
                                placeholder="Descrição da imagem..."
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Ordem</Label>
                            <Input
                                type="number"
                                value={form.order}
                                onChange={(e) => setForm({ ...form, order: parseInt(e.target.value) || 0 })}
                                min={0}
                            />
                        </div>
                        <div className="flex justify-end gap-2">
                            <Button variant="outline" onClick={() => setDialogOpen(false)}>
                                Cancelar
                            </Button>
                            <Button onClick={handleSubmit}>
                                {isEditing ? 'Salvar' : 'Adicionar'}
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation */}
            <Dialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirmar Exclusão</DialogTitle>
                        <DialogDescription>
                            Tem certeza que deseja remover esta imagem? Esta ação não pode ser desfeita.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setDeleteId(null)}>
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
