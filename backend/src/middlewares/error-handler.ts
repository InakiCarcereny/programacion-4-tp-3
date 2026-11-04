import { NextFunction, Request, Response } from "express";
import { AppError, NotFoundError } from "@/errors/AppError";

export function notFoundHandler(req: Request, _res: Response, next: NextFunction): void {
  next(new NotFoundError(`Ruta ${req.method} ${req.originalUrl} no encontrada`));
}

export interface ErrorResponse {
  status: number;
  body: { error: string };
}

function isBodyParserError(err: Error): err is Error & { status: number } {
  return (
    err instanceof SyntaxError &&
    "status" in err &&
    typeof (err as { status: unknown }).status === "number"
  );
}

function readNumericStatus(err: Error): number | undefined {
  const candidate = err as { status?: unknown; statusCode?: unknown };
  if (typeof candidate.status === "number") return candidate.status;
  if (typeof candidate.statusCode === "number") return candidate.statusCode;
  return undefined;
}

export function toErrorResponse(err: Error): ErrorResponse {
  if (isBodyParserError(err)) {
    return { status: err.status, body: { error: "JSON invalido" } };
  }

  if (err instanceof AppError) {
    return { status: err.statusCode, body: { error: err.message } };
  }

  const status = readNumericStatus(err);
  if (status !== undefined && status >= 400 && status < 500) {
    return { status, body: { error: err.message } };
  }

  return { status: 500, body: { error: "Error interno de servidor" } };
}

export function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction): void {
  const { status, body } = toErrorResponse(err);

  if (status >= 500) {
    console.error(err);
  }

  res.status(status).json(body);
}
