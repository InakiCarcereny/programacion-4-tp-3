import { Product } from "@/models/Product";

export class Pastry extends Product {
  public get type(): "pasteleria" {
    return "pasteleria";
  }

  public calculatePrice(): number {
    return this.basePrice;
  }
}
