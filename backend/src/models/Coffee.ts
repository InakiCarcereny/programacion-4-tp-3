import { Product } from "@/models/Product";
import { CoffeeSize, CoffeeVariety, PRICE_PER_GRAM, VARIETY_DESCRIPTIONS } from "@/types/coffee";
import type { CoffeeProduct } from "@/types/product";

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

  public abstract get type(): "espresso" | "filtered";

  public calculatePrice(): number {
    return this.grams * PRICE_PER_GRAM[this.variety] + this.basePrice;
  }

  public toJSON(): CoffeeProduct {
    return {
      id: this.id,
      type: this.type,
      name: this.name,
      size: this.size,
      coffeeGrams: this.grams,
      variety: {
        name: this.variety,
        description: VARIETY_DESCRIPTIONS[this.variety],
      },
      price: this.calculatePrice(),
    };
  }
}
