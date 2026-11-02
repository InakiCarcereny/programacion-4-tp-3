import { NextFunction, Request, Response } from "express";
import { products } from "@/data/products";
import { AppError, NotFoundError } from "@/errors/AppError";
import { createOrder, findOrderById, listOrders } from "@/services/order.service";
import { createOrderSchema } from "@/schemas/order.schema";

export function postOrder(req: Request, res: Response, next: NextFunction): void {
  const parsed = createOrderSchema.safeParse(req.body);
  if (!parsed.success) {
    return next(new AppError(parsed.error.issues[0].message));
  }

  try {
    const order = createOrder(parsed.data.items);
    res.status(201).json(order.toJSON(products));
  } catch (error) {
    next(error);
  }
}

export function getOrders(_req: Request, res: Response): void {
  const orders = listOrders().map((order) => order.toJSON(products));
  res.json(orders);
}

export function getOrderById(req: Request, res: Response, next: NextFunction): void {
  const order = findOrderById(req.params.id);
  if (!order) {
    return next(new NotFoundError(`Orden ${req.params.id} no encontrada`));
  }

  res.json(order.toJSON(products));
}
