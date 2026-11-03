import { Router } from "express";
import { getProductById, getProducts } from "@/controllers/product.controller";

export const productRoutes = Router();

productRoutes.get("/", getProducts);
productRoutes.get("/:id", getProductById);
