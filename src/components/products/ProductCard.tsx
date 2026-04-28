import { ArrowRight, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import type { Product } from "@/data/productsData";

interface ProductCardProps {
    product: Product;
    onViewDetails: (product: Product) => void;
}

const ProductCard = ({ product, onViewDetails }: ProductCardProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="group bg-card border border-border overflow-hidden hover:border-primary/50 hover:shadow-md transition-all"
        >
            {/* Image */}
            <div className="aspect-square bg-muted overflow-hidden relative">
                <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-contain p-4 transition-transform duration-300 group-hover:scale-105"
                />
                {product.featured && (
                    <span className="absolute top-3 left-3 px-2 py-1 bg-primary text-primary-foreground text-[10px] font-semibold uppercase tracking-wider">
                        Destaque
                    </span>
                )}
            </div>

            {/* Content */}
            <div className="p-4 border-t border-border">
                <div className="text-[10px] text-primary font-semibold uppercase tracking-wider mb-1">
                    {product.brand}
                </div>
                <h3 className="text-sm font-bold text-foreground mb-1 line-clamp-1">
                    {product.name}
                </h3>
                <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
                    {product.shortDescription}
                </p>

                {/* Specs */}
                <div className="flex gap-4 mb-4 text-xs">
                    {product.specs.slice(0, 2).map((spec, index) => (
                        <div key={index}>
                            <span className="text-muted-foreground">{spec.label}: </span>
                            <span className="font-medium text-foreground">{spec.value}</span>
                        </div>
                    ))}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 text-xs h-8"
                        onClick={() => onViewDetails(product)}
                    >
                        Ver Detalhes
                    </Button>
                    <Button variant="hero" size="sm" className="flex-1 text-xs h-8">
                        Orçamento
                    </Button>
                </div>
            </div>
        </motion.div>
    );
};

export default ProductCard;
