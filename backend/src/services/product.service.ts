import { products } from "@/data/products";
import { Product } from "@/models/Product";

export function listProducts(): Product[] {
  return products;
}

export function findProductById(id: number): Product | undefined {
  return products.find((product) => product.id === id);
}
