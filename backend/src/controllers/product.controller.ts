import { NextFunction, Request, Response } from "express";
import { NotFoundError } from "@/errors/AppError";
import { findProductById, listProducts } from "@/services/product.service";

export function getProducts(_req: Request, res: Response): void {
  const products = listProducts().map((product) => product.toJSON());
  res.json(products);
}

export function getProductById(req: Request, res: Response, next: NextFunction): void {
  const product = findProductById(req.params.id);
  if (!product) {
    return next(new NotFoundError(`Producto ${req.params.id} no encontrado`));
  }

  res.json(product.toJSON());
}
