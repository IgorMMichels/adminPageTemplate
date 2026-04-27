// Client logos data (placeholder)
export interface ClientBrand {
    name: string;
    logo: string;
    url: string;
}

// Client logos data (placeholder)
export const clientBrands: ClientBrand[] = [];

// Split brands into 3 groups for the 3 lanes
export const brandsRow1 = clientBrands.slice(0, 8);
export const brandsRow2 = clientBrands.slice(8, 16);
export const brandsRow3 = clientBrands.slice(16, 23);
