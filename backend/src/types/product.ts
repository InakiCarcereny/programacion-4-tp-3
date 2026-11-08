import type { CoffeeSize, CoffeeVariety } from "@/types/coffee";

export type CoffeeType = "expreso" | "filtrado";

export type ProductType = CoffeeType | "pasteleria";

export interface CoffeeVarietyInfo {
  nombre: CoffeeVariety;
  descripcion: string;
}

export interface Product {
  id: string;
  name: string;
  basePrice: number;
  finalPrice: number;
  tipo: ProductType;
  tamanio?: CoffeeSize;
  gramosCafe?: number;
  variedad?: CoffeeVarietyInfo;
}
