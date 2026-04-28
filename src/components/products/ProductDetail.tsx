import { X, ShoppingCart, Phone, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import type { Product } from "@/data/productsData";
import { usePublicSiteConfig } from "@/hooks/usePublicData";

interface ProductDetailProps {
    product: Product | null;
    isOpen: boolean;
    onClose: () => void;
}

const ProductDetail = ({ product, isOpen, onClose }: ProductDetailProps) => {
    const { siteConfig } = usePublicSiteConfig();
    if (!product) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed inset-4 md:inset-10 lg:inset-20 bg-card rounded-2xl shadow-2xl z-50 overflow-hidden flex flex-col"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b border-border bg-muted/50">
                            <div>
                                <span className="text-xs font-medium text-primary uppercase tracking-wider">
                                    {product.brand}
                                </span>
                                <h2 className="text-xl font-bold text-foreground">{product.name}</h2>
                            </div>
                            <Button variant="ghost" size="icon" onClick={onClose}>
                                <X className="h-5 w-5" />
                            </Button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto">
                            <div className="grid lg:grid-cols-2 gap-8 p-6">
                                {/* Image */}
                                <div className="aspect-square bg-muted rounded-xl overflow-hidden">
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                {/* Details */}
                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-lg font-semibold text-foreground mb-2">
                                            Descrição
                                        </h3>
                                        <p className="text-muted-foreground leading-relaxed">
                                            {product.fullDescription}
                                        </p>
                                    </div>

                                    {/* Specifications */}
                                    <div>
                                        <h3 className="text-lg font-semibold text-foreground mb-3">
                                            Especificações Técnicas
                                        </h3>
                                        <div className="grid grid-cols-2 gap-3">
                                            {product.specs.map((spec, index) => (
                                                <div
                                                    key={index}
                                                    className="p-3 bg-muted rounded-lg"
                                                >
                                                    <p className="text-xs text-muted-foreground mb-1">
                                                        {spec.label}
                                                    </p>
                                                    <p className="font-semibold text-foreground">
                                                        {spec.value}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Applications */}
                                    <div>
                                        <h3 className="text-lg font-semibold text-foreground mb-3">
                                            Aplicações
                                        </h3>
                                        <div className="flex flex-wrap gap-2">
                                            {product.applications.map((app, index) => (
                                                <span
                                                    key={index}
                                                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium"
                                                >
                                                    <Check className="h-3 w-3" />
                                                    {app}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer Actions */}
                        <div className="p-4 border-t border-border bg-muted/50 flex flex-col sm:flex-row gap-3">
                            <Button variant="hero" size="lg" className="flex-1">
                                <ShoppingCart className="mr-2 h-5 w-5" />
                                Solicitar Orçamento
                            </Button>
                            <a
                                href={`https://wa.me/${siteConfig.company.whatsapp}?text=Olá! Gostaria de saber mais sobre o produto ${product.name}.`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-1"
                            >
                                <Button
                                    variant="outline"
                                    size="lg"
                                    className="w-full border-[#25D366] text-[#25D366] hover:bg-[#25D366] hover:text-white"
                                >
                                    <Phone className="mr-2 h-5 w-5" />
                                    Falar com Especialista
                                </Button>
                            </a>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default ProductDetail;
