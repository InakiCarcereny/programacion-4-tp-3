import { Product } from "@/models/Product";

export class Pastry extends Product {
  constructor(id: string, name: string, basePrice: number) {
    super(id, name, basePrice, "pasteleria");
  }

  public calculatePrice(): number {
    return this.basePrice;
  }
}
