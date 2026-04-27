import { useState } from 'react';
import { useAdmin, ServiceItem } from '../context/AdminContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Plus, Pencil, Trash2, Wrench, GripVertical } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const availableIcons = [
    { value: 'Droplets', label: '💧 Água / Líquidos' },
    { value: 'Waves', label: '🌊 Ondas / Drenagem' },
    { value: 'ThermometerSnowflake', label: '❄️ Resfriamento' },
    { value: 'ArrowUp', label: '⬆️ Recalque' },
    { value: 'Flame', label: '🔥 Incêndio' },
    { value: 'Gauge', label: '🔘 Pressão / Boosters' },
    { value: 'Cog', label: '⚙️ Máquinas' },
    { value: 'PenTool', label: '🔧 Projetos Especiais' },
    { value: 'Wrench', label: '🛠️ Manutenção' },
    { value: 'Zap', label: '⚡ Elétrico' },
    { value: 'Shield', label: '🛡️ Proteção' },
    { value: 'Factory', label: '🏭 Industrial' },
];

const emptyService: ServiceItem = {
    id: '',
    title: '',
    description: '',
    icon: 'Wrench',
    order: 0,
};

export default function AdminServices() {
    const { services, addService, updateService, deleteService } = useAdmin();
    const { toast } = useToast();
    const [dialogOpen, setDialogOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [form, setForm] = useState<ServiceItem>(emptyService);

    const openNewDialog = () => {
        setForm({ ...emptyService, id: `service-${Date.now()}`, order: services.length });
        setIsEditing(false);
        setDialogOpen(true);
    };

    const openEditDialog = (service: ServiceItem) => {
        setForm({ ...service });
        setIsEditing(true);
        setDialogOpen(true);
    };

    const handleSubmit = async () => {
        if (!form.title.trim()) {
            toast({ title: 'Erro', description: 'Título é obrigatório.', variant: 'destructive' });
            return;
        }

        if (isEditing) {
            await updateService(form.id, form);
            toast({ title: 'Serviço atualizado', description: `${form.title} foi atualizado.` });
        } else {
            await addService(form);
            toast({ title: 'Serviço adicionado', description: `${form.title} foi adicionado.` });
        }
        setDialogOpen(false);
    };

    const handleDelete = async () => {
        if (deleteId) {
            const service = services.find((s) => s.id === deleteId);
            await deleteService(deleteId);
            toast({ title: 'Serviço removido', description: `${service?.title} foi removido.` });
            setDeleteId(null);
        }
    };

    const sortedServices = [...services].sort((a, b) => a.order - b.order);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
                        <Wrench className="w-8 h-8 text-primary" />
                        Serviços
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Gerencie os serviços exibidos na página de serviços
                    </p>
                </div>
                <Button onClick={openNewDialog}>
                    <Plus className="w-4 h-4 mr-2" />
                    Adicionar Serviço
                </Button>
            </div>

            {/* Services List */}
            <div className="space-y-3">
                {sortedServices.map((service) => {
                    const iconInfo = availableIcons.find((i) => i.value === service.icon);
                    return (
                        <Card key={service.id} className="group hover:shadow-md transition-shadow">
                            <CardContent className="p-4 flex items-start gap-4">
                                <div className="flex items-center gap-2 text-muted-foreground/40">
                                    <GripVertical className="w-5 h-5" />
                                </div>
                                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                                    <span className="text-lg">{iconInfo?.label.split(' ')[0] || '🔧'}</span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-semibold text-foreground">{service.title}</h3>
                                    <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                                        {service.description}
                                    </p>
                                </div>
                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                                    <Button variant="outline" size="sm" onClick={() => openEditDialog(service)}>
                                        <Pencil className="w-3 h-3 mr-1" />
                                        Editar
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="text-destructive"
                                        onClick={() => setDeleteId(service.id)}
                                    >
                                        <Trash2 className="w-3 h-3" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {services.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                    <Wrench className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>Nenhum serviço cadastrado ainda.</p>
                    <Button variant="outline" className="mt-4" onClick={openNewDialog}>
                        Adicionar primeiro serviço
                    </Button>
                </div>
            )}

            {/* Add/Edit Dialog */}
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle>{isEditing ? 'Editar Serviço' : 'Novo Serviço'}</DialogTitle>
                        <DialogDescription>
                            {isEditing ? 'Atualize as informações do serviço.' : 'Adicione um novo serviço.'}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label>Título *</Label>
                            <Input
                                value={form.title}
                                onChange={(e) => setForm({ ...form, title: e.target.value })}
                                placeholder="Ex: Manutenção Preventiva"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Descrição</Label>
                            <Textarea
                                value={form.description}
                                onChange={(e) => setForm({ ...form, description: e.target.value })}
                                placeholder="Descrição detalhada do serviço..."
                                rows={3}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Ícone</Label>
                            <Select
                                value={form.icon}
                                onValueChange={(value) => setForm({ ...form, icon: value })}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {availableIcons.map((icon) => (
                                        <SelectItem key={icon.value} value={icon.value}>
                                            {icon.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
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
                            Tem certeza que deseja remover este serviço? Esta ação não pode ser desfeita.
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
