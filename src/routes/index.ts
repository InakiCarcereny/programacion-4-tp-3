import { Router } from "express";
import { getHealth } from "@/controllers/health.controller";
import { orderRoutes } from "@/routes/order.routes";
import { productRoutes } from "@/routes/product.routes";
import { reportRoutes } from "@/routes/report.routes";

export const router = Router();

router.get("/health", getHealth);
router.use("/products", productRoutes);
router.use("/orders", orderRoutes);
router.use("/reports", reportRoutes);
