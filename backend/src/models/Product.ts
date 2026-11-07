import type { Product as IProduct, ProductType } from "@/types/product";

export abstract class Product {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly basePrice: number,
  ) {}

  public abstract get type(): ProductType;

  public abstract calculatePrice(): number;

  public toJSON(): IProduct {
    return {
      id: this.id,
      type: this.type,
      name: this.name,
      price: this.calculatePrice(),
    };
  }
}
