import type { CoffeeSize } from "@/types/coffee";

export type ProductType = "expreso" | "filtrado" | "pasteleria";

export interface Variety {
  name: string;
  description: string;
}

export interface Product {
  id: number;
  type: ProductType;
  name: string;
  price: number;
}

export interface CoffeeProduct extends Product {
  type: "expreso" | "filtrado";
  size: CoffeeSize;
  coffeeGrams: number;
  variety: Variety;
}
