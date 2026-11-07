import type { CoffeeSize } from "@/types/coffee";

export type ProductType = "espresso" | "filtered" | "pastry";

export interface Variety {
  name: string;
  description: string;
}

export interface Product {
  id: string;
  type: ProductType;
  name: string;
  price: number;
}

export interface CoffeeProduct extends Product {
  type: "espresso" | "filtered";
  size: CoffeeSize;
  coffeeGrams: number;
  variety: Variety;
}
