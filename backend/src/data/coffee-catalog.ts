import { Espresso } from "@/models/Espresso";
import { FilteredCoffee } from "@/models/FilteredCoffee";
import { Product } from "@/models/Product";
import { CoffeeSize, CoffeeVariety } from "@/types/coffee";

const SIZES: CoffeeSize[] = ["Pocillo", "Mediano", "Taza grande"];
const VARIETIES: CoffeeVariety[] = ["Brasil", "Colombia", "Etiopia"];

export function generateCoffees(): Product[] {
  const products: Product[] = [];
  let counter = 1;

  for (const size of SIZES) {
    for (const variety of VARIETIES) {
      products.push(new Espresso(`Espresso-${counter}`, size, variety));
      counter += 1;
    }
  }

  counter = 1;
  for (const size of SIZES) {
    for (const variety of VARIETIES) {
      products.push(new FilteredCoffee(`Filtered-${counter}`, size, variety));
      counter += 1;
    }
  }

  return products;
}
