import { Pastry } from "@/models/Pastry";
import { Product } from "@/models/Product";

export function generatePastries(): Product[] {
  return [new Pastry(19, "Muffin de chocolate", 2500), new Pastry(20, "Torta selva negra", 4200)];
}
