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

  protected get coffeeCost(): number {
    return this.grams * PRICE_PER_GRAM[this.variety];
  }

  public calculatePrice(): number {
    return this.coffeeCost + this.basePrice;
  }

  public toJSON(): CoffeeProduct {
    return {
      ...super.toJSON(),
      type: this.type,
      size: this.size,
      grams: this.grams,
      variety: { name: this.variety, description: VARIETY_DESCRIPTIONS[this.variety] },
    };
  }
}
