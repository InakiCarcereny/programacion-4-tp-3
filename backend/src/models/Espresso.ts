import { Coffee } from "@/models/Coffee";
import { CoffeeSize, CoffeeVariety } from "@/types/coffee";

const ESPRESSO_GRAMS: Record<CoffeeSize, number> = {
  Pocillo: 18,
  Mediano: 27,
  "Taza grande": 36,
};

export class Espresso extends Coffee {
  static readonly BASE_PRICE = 2500;

  constructor(id: string, size: CoffeeSize, variety: CoffeeVariety) {
    super(
      id,
      `Expreso ${size} ${variety}`,
      Espresso.BASE_PRICE,
      size,
      ESPRESSO_GRAMS[size],
      variety,
    );
  }
}
