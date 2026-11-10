import { Router } from "express";
import { resetTestData, seedTestData } from "@/controllers/test.controller";

export const testRoutes = Router();

testRoutes.post("/reset", resetTestData);
testRoutes.post("/seed", seedTestData);
