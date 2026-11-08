import request from "supertest";
import { describe, expect, it } from "vitest";
import { createApp } from "@/app";

const app = createApp();

describe("GET /products", () => {
  it("returns the full catalog (20 products)", async () => {
    const res = await request(app).get("/products");
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(20);
  });
});

describe("GET /products/:id", () => {
  it("returns an existing product", async () => {
    const res = await request(app).get("/products/Pastry-1");
    expect(res.status).toBe(200);
    expect(res.body.name).toBe("Muffin de chocolate");
    expect(res.body.finalPrice).toBe(2500);
  });

  it("returns 404 if the product does not exist", async () => {
    const res = await request(app).get("/products/does-not-exist");
    expect(res.status).toBe(404);
  });
});

describe("GET /products contract", () => {
  it("returns the product type for every product", async () => {
    const res = await request(app).get("/products");
    expect(res.status).toBe(200);

    const tipos: Array<string | undefined> = res.body.map((p: { tipo?: string }) => p.tipo);
    expect(tipos.filter((t) => t === "expreso")).toHaveLength(9);
    expect(tipos.filter((t) => t === "filtrado")).toHaveLength(9);
    expect(tipos.filter((t) => t === "pasteleria")).toHaveLength(2);
  });

  it("returns the coffee details and price for Espresso-5", async () => {
    const res = await request(app).get("/products/Espresso-5");
    expect(res.status).toBe(200);
    expect(res.body).toEqual(
      expect.objectContaining({
        tipo: "expreso",
        name: "Expreso Mediano Colombia",
        tamanio: "Mediano",
        gramosCafe: 27,
        finalPrice: 7360,
        variedad: {
          nombre: "Colombia",
          descripcion: "Acidez media, cuerpo equilibrado y notas cítricas y florales",
        },
      }),
    );
  });

  it("returns tipo pasteleria for a pastry", async () => {
    const res = await request(app).get("/products/Pastry-1");
    expect(res.status).toBe(200);
    expect(res.body).toEqual(
      expect.objectContaining({
        tipo: "pasteleria",
        name: "Muffin de chocolate",
        finalPrice: 2500,
      }),
    );
  });
});
