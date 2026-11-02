import { Coffee } from "@/models/Coffee";
import { CoffeeSize, CoffeeVariety } from "@/types/coffee";

const FILTERED_GRAMS: Record<CoffeeSize, number> = {
  Pocillo: 6,
  Mediano: 15,
  "Taza grande": 25,
};

export class FilteredCoffee extends Coffee {
  static readonly BASE_PRICE = 3200;

  constructor(id: string, size: CoffeeSize, variety: CoffeeVariety) {
    super(
      id,
      `Filtrado ${size} ${variety}`,
      FilteredCoffee.BASE_PRICE,
      size,
      FILTERED_GRAMS[size],
      variety,
    );
  }
}
