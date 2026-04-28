import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { usePublicProducts } from "@/hooks/usePublicData";

interface ProductFiltersProps {
    selectedCategory: string | null;
    searchQuery: string;
    onCategoryChange: (categoryId: string | null) => void;
    onSearchChange: (query: string) => void;
    isMobileOpen: boolean;
    onMobileClose: () => void;
}

const ProductFilters = ({
    selectedCategory,
    searchQuery,
    onCategoryChange,
    onSearchChange,
    isMobileOpen,
    onMobileClose,
}: ProductFiltersProps) => {
    const { categories } = usePublicProducts();

    return (
        <>
            {/* Mobile Backdrop */}
            {isMobileOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={onMobileClose}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`
          fixed lg:relative inset-y-0 left-0 z-50 lg:z-0
          w-64 lg:w-full bg-card lg:bg-transparent border-r lg:border-0 border-border
          transform transition-transform duration-300
          ${isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          overflow-y-auto
        `}
            >
                {/* Mobile Header */}
                <div className="flex items-center justify-between p-4 border-b border-border lg:hidden">
                    <h2 className="font-bold text-foreground">Filtros</h2>
                    <Button variant="ghost" size="icon" onClick={onMobileClose}>
                        <X className="h-5 w-5" />
                    </Button>
                </div>

                <div className="p-4 lg:p-0">
                    {/* Search */}
                    <div className="relative mb-6">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="text"
                            placeholder="Buscar..."
                            value={searchQuery}
                            onChange={(e) => onSearchChange(e.target.value)}
                            className="pl-10 h-9 text-sm"
                        />
                    </div>

                    {/* Categories */}
                    <div>
                        <h3 className="text-xs font-semibold text-foreground mb-3 uppercase tracking-wider">
                            Categorias
                        </h3>
                        <div className="space-y-1">
                            <button
                                onClick={() => onCategoryChange(null)}
                                className={`w-full text-left px-3 py-2 text-sm transition-colors ${!selectedCategory
                                    ? "bg-primary text-primary-foreground font-medium"
                                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                    }`}
                            >
                                Todos os Produtos
                            </button>

                            {categories.map((category) => (
                                <button
                                    key={category.id}
                                    onClick={() => onCategoryChange(category.id)}
                                    className={`w-full text-left px-3 py-2 text-sm transition-colors ${selectedCategory === category.id
                                        ? "bg-primary text-primary-foreground font-medium"
                                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                        }`}
                                >
                                    {category.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Clear Filters */}
                    {(selectedCategory || searchQuery) && (
                        <Button
                            variant="outline"
                            size="sm"
                            className="w-full mt-6 text-xs"
                            onClick={() => {
                                onCategoryChange(null);
                                onSearchChange("");
                            }}
                        >
                            Limpar Filtros
                        </Button>
                    )}
                </div>
            </aside>
        </>
    );
};

export default ProductFilters;
