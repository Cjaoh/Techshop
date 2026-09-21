/** Forme brute renvoyée par l'API NestJS (Prisma sérialise Decimal en chaîne). */
export interface ProductApi {
  id: number;
  title: string;
  description: string;
  price: string;
  category: string;
  image: string;
  stock: number;
  createdAt: string;
  updatedAt: string;
}

/** Modèle utilisé par l'application Angular. */
export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  /** Absent de notre backend : optionnel, les composants gèrent déjà son absence. */
  rating?: { rate: number; count: number };
  stock?: number;
}

/** Convertit un produit API en produit applicatif (price : string -> number). */
export function toProduct(api: ProductApi): Product {
  return {
    id: api.id,
    title: api.title,
    description: api.description,
    price: Number(api.price),
    category: api.category,
    image: api.image,
    stock: api.stock,
  };
}