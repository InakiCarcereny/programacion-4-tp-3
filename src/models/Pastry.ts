import { Product } from "@/models/Product";

export class Pastry extends Product {
  public calculatePrice(): number {
    return this.basePrice;
  }
}
