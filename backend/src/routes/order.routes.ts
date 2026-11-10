import { Router } from "express";
import { getOrderById, getOrders, postOrder } from "@/controllers/order.controller";

export const orderRoutes = Router();

orderRoutes.post("/", postOrder);
orderRoutes.get("/", getOrders);
orderRoutes.get("/:id", getOrderById);
