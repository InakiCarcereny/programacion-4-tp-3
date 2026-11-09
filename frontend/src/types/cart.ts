import type { Product } from "@/schemas/products";

export type CartProduct = Pick<Product, "id" | "name" | "price">;

export interface CartItem {
  product: CartProduct;
  quantity: number;
}

export interface CartState {
  items: CartItem[];
}

export type CartAction =
  | { type: "ADD"; product: CartProduct }
  | { type: "INCREMENT"; productId: number }
  | { type: "DECREMENT"; productId: number }
  | { type: "REMOVE"; productId: number }
  | { type: "CLEAR" };
