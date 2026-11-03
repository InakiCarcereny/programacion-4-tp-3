import { NextFunction, Request, Response } from "express";
import { NotFoundError } from "@/errors/AppError";
import { calculateTotalRevenue, findBestSellingProduct } from "@/services/report.service";

export function getRevenue(_req: Request, res: Response, next: NextFunction): void {
  try {
    res.json({ revenue: calculateTotalRevenue() });
  } catch (error) {
    next(error);
  }
}

export function getBestSellingProduct(_req: Request, res: Response, next: NextFunction): void {
  try {
    const bestSelling = findBestSellingProduct();
    if (!bestSelling) {
      return next(new NotFoundError("No hay ventas registradas"));
    }

    res.json(bestSelling);
  } catch (error) {
    next(error);
  }
}
