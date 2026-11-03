import { Pastry } from "@/models/Pastry";
import { Product } from "@/models/Product";

export function generatePastries(): Product[] {
  return [
    new Pastry("Pastry-1", "Muffin de chocolate", 2500),
    new Pastry("Pastry-2", "Torta selva negra", 4200),
  ];
}
