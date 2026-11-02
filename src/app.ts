import express, { type Express } from "express";
import { errorHandler } from "@/middlewares/error-handler";
import { router } from "@/routes";

export function createApp(): Express {
  const app = express();

  app.use(express.json());
  app.use("/", router);
  app.use(errorHandler);

  return app;
}
