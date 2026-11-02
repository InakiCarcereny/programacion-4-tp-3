import { Product } from "@/models/Product";
import { CoffeeSize, CoffeeVariety, PRICE_PER_GRAM } from "@/types/coffee";

export abstract class Coffee extends Product {
  constructor(
    id: string,
    name: string,
    basePrice: number,
    public readonly size: CoffeeSize,
    public readonly grams: number,
    public readonly variety: CoffeeVariety,
  ) {
    super(id, name, basePrice);
  }

  protected get coffeeCost(): number {
    return this.grams * PRICE_PER_GRAM[this.variety];
  }

  public calculatePrice(): number {
    return this.coffeeCost + this.basePrice;
  }
}
