import { Espresso } from "@/models/Espresso";
import { FilteredCoffee } from "@/models/FilteredCoffee";
import { Product } from "@/models/Product";
import { CoffeeSize, CoffeeVariety } from "@/types/coffee";

const SIZES: CoffeeSize[] = ["Pocillo", "Mediano", "Taza grande"];
const VARIETIES: CoffeeVariety[] = ["Brasil", "Colombia", "Etiopia"];

export function generateCoffees(): Product[] {
  const products: Product[] = [];
  let espressoId = 1;

  for (const size of SIZES) {
    for (const variety of VARIETIES) {
      products.push(new Espresso(espressoId, size, variety));
      espressoId += 1;
    }
  }

  let filteredId = 10;
  for (const size of SIZES) {
    for (const variety of VARIETIES) {
      products.push(new FilteredCoffee(filteredId, size, variety));
      filteredId += 1;
    }
  }

  return products;
}
