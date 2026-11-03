import express, { type Express } from "express";
import { errorHandler, notFoundHandler } from "@/middlewares/error-handler";
import { router } from "@/routes";

export function createApp(): Express {
  const app = express();

  app.use(express.json());
  app.use("/", router);
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
