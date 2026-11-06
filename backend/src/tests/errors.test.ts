import request from "supertest";
import { describe, expect, it } from "vitest";
import { createApp } from "@/app";
import { AppError, NotFoundError } from "@/errors/AppError";
import { toErrorResponse } from "@/middlewares/error-handler";

const app = createApp();

function bodyParserError(): SyntaxError & { status: number } {
  return Object.assign(new SyntaxError("Unexpected token } in JSON"), { status: 400 });
}

function decodeError(): URIError & { status: number } {
  return Object.assign(new URIError("Failed to decode param '%'"), { status: 400 });
}

describe("toErrorResponse (unit)", () => {
  it("maps a NotFoundError to 404 keeping the message", () => {
    expect(toErrorResponse(new NotFoundError("Producto X no encontrado"))).toEqual({
      status: 404,
      body: { error: "Producto X no encontrado" },
    });
  });

  it("maps an AppError to 400 keeping the message", () => {
    expect(toErrorResponse(new AppError("items invalidos"))).toEqual({
      status: 400,
      body: { error: "items invalidos" },
    });
  });

  it("maps a body-parser JSON error to 400 with a friendly message", () => {
    expect(toErrorResponse(bodyParserError())).toEqual({
      status: 400,
      body: { error: "JSON invalido" },
    });
  });

  it("maps a param decode error to 400 instead of 500", () => {
    expect(toErrorResponse(decodeError())).toEqual({
      status: 400,
      body: { error: "Failed to decode param '%'" },
    });
  });

  it("falls back to 500 with a uniform body for unexpected errors", () => {
    expect(toErrorResponse(new Error("boom"))).toEqual({
      status: 500,
      body: { error: "Error interno de servidor" },
    });
  });
});

describe("error contract (integration)", () => {
  it("returns 404 { error } for an unknown product", async () => {
    const res = await request(app).get("/products/does-not-exist");
    expect(res.status).toBe(404);
    expect(Object.keys(res.body)).toEqual(["error"]);
    expect(typeof res.body.error).toBe("string");
  });

  it("returns 404 { error } for an unknown order", async () => {
    const res = await request(app).get("/orders/does-not-exist");
    expect(res.status).toBe(404);
    expect(Object.keys(res.body)).toEqual(["error"]);
  });

  it("returns 404 { error } for an unknown route", async () => {
    const res = await request(app).get("/ruta-inexistente");
    expect(res.status).toBe(404);
    expect(Object.keys(res.body)).toEqual(["error"]);
  });

  it("returns 400 { error } for a param that cannot be decoded, never 500", async () => {
    const res = await request(app).get("/products/%");
    expect(res.status).toBe(400);
    expect(Object.keys(res.body)).toEqual(["error"]);
  });

  it("returns 400 { error } for a malformed JSON body", async () => {
    const res = await request(app)
      .post("/orders")
      .set("Content-Type", "application/json")
      .send("{invalid json");
    expect(res.status).toBe(400);
    expect(Object.keys(res.body)).toEqual(["error"]);
  });
});
