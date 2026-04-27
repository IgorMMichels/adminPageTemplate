export interface Product {
    id: string;
    name: string;
    shortDescription: string;
    fullDescription: string;
    category: string;
    subcategory?: string;
    image: string;
    specs: {
        label: string;
        value: string;
    }[];
    applications: string[];
    brand: string;
    featured?: boolean;
}

export interface Category {
    id: string;
    name: string;
    icon: string;
    count: number;
    description: string;
}

export const categories: Category[] = [];

export const products: Product[] = [
    {
        id: "product-1",
        name: "Produto 1",
        shortDescription: "Descrição curta do produto 1.",
        fullDescription: "Descrição completa do produto 1, incluindo detalhes técnicos e aplicações.",
        category: "categoria-1",
        image: "/placeholder.svg",
        specs: [
            { label: "Vazão", value: "10 m³/h" },
            { label: "Potência", value: "1.5 kW" },
        ],
        applications: ["Aplicação 1", "Aplicação 2"],
        brand: "Marca 1",
        featured: true,
    },
    {
        id: "product-2",
        name: "Produto 2",
        shortDescription: "Descrição curta do produto 2.",
        fullDescription: "Descrição completa do produto 2, incluindo detalhes técnicos e aplicações.",
        category: "categoria-1",
        image: "/placeholder.svg",
        specs: [
            { label: "Vazão", value: "20 m³/h" },
            { label: "Potência", value: "3 kW" },
        ],
        applications: ["Aplicação 1", "Aplicação 3"],
        brand: "Marca 2",
        featured: false,
    },
    {
        id: "product-3",
        name: "Produto 3",
        shortDescription: "Descrição curta do produto 3.",
        fullDescription: "Descrição completa do produto 3, incluindo detalhes técnicos e aplicações.",
        category: "categoria-2",
        image: "/placeholder.svg",
        specs: [
            { label: "Vazão", value: "30 m³/h" },
            { label: "Potência", value: "5 kW" },
        ],
        applications: ["Aplicação 2", "Aplicação 3"],
        brand: "Marca 3",
        featured: false,
    },
];

export const getProductsByCategory = (categoryId: string): Product[] => {
    return products.filter((product) => product.category === categoryId);
};

export const getFeaturedProducts = (): Product[] => {
    return products.filter((product) => product.featured);
};

export const searchProducts = (query: string): Product[] => {
    const lowercaseQuery = query.toLowerCase();
    return products.filter(
        (product) =>
            product.name.toLowerCase().includes(lowercaseQuery) ||
            product.shortDescription.toLowerCase().includes(lowercaseQuery) ||
            product.category.toLowerCase().includes(lowercaseQuery) ||
            product.brand.toLowerCase().includes(lowercaseQuery)
    );
};
