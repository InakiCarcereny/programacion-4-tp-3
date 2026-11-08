import type { Product as IProduct, ProductType } from "@/types/product";

export abstract class Product {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly basePrice: number,
    public readonly tipo: ProductType,
  ) {}

  public abstract calculatePrice(): number;

  public toJSON(): IProduct {
    return {
      id: this.id,
      name: this.name,
      basePrice: this.basePrice,
      finalPrice: this.calculatePrice(),
      tipo: this.tipo,
    };
  }
}
