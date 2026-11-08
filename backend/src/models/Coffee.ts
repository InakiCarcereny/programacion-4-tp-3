import { COFFEE_VARIETY_DESCRIPTIONS } from "@/data/coffee-varieties";
import { Product } from "@/models/Product";
import type { CoffeeType, Product as IProduct } from "@/types/product";
import { CoffeeSize, CoffeeVariety, PRICE_PER_GRAM } from "@/types/coffee";

export abstract class Coffee extends Product {
  constructor(
    id: string,
    name: string,
    basePrice: number,
    public readonly size: CoffeeSize,
    public readonly grams: number,
    public readonly variety: CoffeeVariety,
    tipo: CoffeeType,
  ) {
    super(id, name, basePrice, tipo);
  }

  protected get coffeeCost(): number {
    return this.grams * PRICE_PER_GRAM[this.variety];
  }

  public calculatePrice(): number {
    return this.coffeeCost + this.basePrice;
  }

  public override toJSON(): IProduct {
    return {
      ...super.toJSON(),
      tamanio: this.size,
      gramosCafe: this.grams,
      variedad: {
        nombre: this.variety,
        descripcion: COFFEE_VARIETY_DESCRIPTIONS[this.variety],
      },
    };
  }
}
