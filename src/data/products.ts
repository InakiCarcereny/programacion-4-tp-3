import { generateCoffees } from "@/data/coffee-catalog";
import { generatePastries } from "@/data/pastry-catalog";
import { Product } from "@/models/Product";

export const products: Product[] = [...generateCoffees(), ...generatePastries()];
