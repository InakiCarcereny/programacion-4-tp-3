import type { Request, Response } from "express";
import { resetOrders } from "@/data/orders";
import { reseedProducts } from "@/data/products";

export function resetTestData(_req: Request, res: Response): void {
  resetOrders();
  res.status(204).send();
}

export function seedTestData(_req: Request, res: Response): void {
  reseedProducts();
  resetOrders();
  res.status(204).send();
}
