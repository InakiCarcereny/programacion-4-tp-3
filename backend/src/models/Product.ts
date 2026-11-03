import type { Product as IProduct } from "@/types/product";

export abstract class Product {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly basePrice: number,
  ) {}

  public abstract calculatePrice(): number;

  public toJSON(): IProduct {
    return {
      id: this.id,
      name: this.name,
      basePrice: this.basePrice,
      finalPrice: this.calculatePrice(),
    };
  }
}
