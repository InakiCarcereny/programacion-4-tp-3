import { Router } from "express";
import { getHealth } from "@/controllers/health.controller";
import { productRoutes } from "@/routes/product.routes";

export const router = Router();

router.get("/health", getHealth);
router.use("/products", productRoutes);
