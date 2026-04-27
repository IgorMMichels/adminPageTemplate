import { useState, useRef, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Upload, X, ImageIcon, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface ImageUploadProps {
    value?: string;
    onChange: (url: string) => void;
    onRemove?: () => void;
    bucket?: string;
    folder?: string;
    className?: string;
    aspectRatio?: 'square' | 'landscape' | 'portrait' | 'auto';
    maxSizeMB?: number;
}

export default function ImageUpload({
    value,
    onChange,
    onRemove,
    bucket = 'site-assets',
    folder = 'uploads',
    className,
    aspectRatio = 'auto',
    maxSizeMB = 5,
}: ImageUploadProps) {
    const [uploading, setUploading] = useState(false);
    const [dragOver, setDragOver] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { toast } = useToast();

    const aspectClasses = {
        square: 'aspect-square',
        landscape: 'aspect-video',
        portrait: 'aspect-[3/4]',
        auto: 'min-h-[200px]',
    };

    const uploadFile = useCallback(async (file: File) => {
        if (!file.type.startsWith('image/')) {
            toast({ title: 'Erro', description: 'Apenas imagens são permitidas.', variant: 'destructive' });
            return;
        }

        if (file.size > maxSizeMB * 1024 * 1024) {
            toast({ title: 'Erro', description: `A imagem deve ter no máximo ${maxSizeMB}MB.`, variant: 'destructive' });
            return;
        }

        if (!isSupabaseConfigured()) {
            // Fallback: use object URL for local preview
            const objectUrl = URL.createObjectURL(file);
            onChange(objectUrl);
            toast({ title: 'Aviso', description: 'Supabase não configurado. Imagem será salva apenas localmente.' });
            return;
        }

        setUploading(true);
        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

            const { error: uploadError } = await supabase.storage
                .from(bucket)
                .upload(fileName, file, { cacheControl: '3600', upsert: false });

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from(bucket)
                .getPublicUrl(fileName);

            onChange(publicUrl);
            toast({ title: 'Sucesso', description: 'Imagem enviada com sucesso!' });
        } catch (err: any) {
            console.error('Upload error:', err);
            toast({ title: 'Erro no upload', description: err.message || 'Falha ao enviar imagem.', variant: 'destructive' });
        } finally {
            setUploading(false);
        }
    }, [bucket, folder, maxSizeMB, onChange, toast]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) uploadFile(file);
        // Reset input so same file can be selected again
        e.target.value = '';
    };

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(false);
        const file = e.dataTransfer.files?.[0];
        if (file) uploadFile(file);
    }, [uploadFile]);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(true);
    };

    const handleDragLeave = () => setDragOver(false);

    const handleRemove = () => {
        if (onRemove) {
            onRemove();
        } else {
            onChange('');
        }
    };

    return (
        <div className={cn('relative', className)}>
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
            />

            {value ? (
                <div className={cn('relative group rounded-lg overflow-hidden border border-border', aspectClasses[aspectRatio])}>
                    <img
                        src={value}
                        alt="Preview"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <Button
                            type="button"
                            variant="secondary"
                            size="sm"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={uploading}
                        >
                            <Upload className="w-4 h-4 mr-1" />
                            Trocar
                        </Button>
                        <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={handleRemove}
                            disabled={uploading}
                        >
                            <X className="w-4 h-4 mr-1" />
                            Remover
                        </Button>
                    </div>
                    {uploading && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                            <Loader2 className="w-8 h-8 text-white animate-spin" />
                        </div>
                    )}
                </div>
            ) : (
                <div
                    onClick={() => !uploading && fileInputRef.current?.click()}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    className={cn(
                        'flex flex-col items-center justify-center rounded-lg border-2 border-dashed cursor-pointer transition-colors',
                        aspectClasses[aspectRatio],
                        dragOver
                            ? 'border-primary bg-primary/5'
                            : 'border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50',
                        uploading && 'pointer-events-none opacity-60'
                    )}
                >
                    {uploading ? (
                        <Loader2 className="w-8 h-8 text-muted-foreground animate-spin" />
                    ) : (
                        <>
                            <ImageIcon className="w-10 h-10 text-muted-foreground/50 mb-2" />
                            <p className="text-sm text-muted-foreground">
                                Clique ou arraste uma imagem
                            </p>
                            <p className="text-xs text-muted-foreground/70 mt-1">
                                PNG, JPG, GIF até {maxSizeMB}MB
                            </p>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}
