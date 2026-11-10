import { Router } from "express";
import { getBestSellingProduct, getRevenue } from "@/controllers/report.controller";

export const reportRoutes = Router();

reportRoutes.get("/revenue", getRevenue);
reportRoutes.get("/best-selling", getBestSellingProduct);
