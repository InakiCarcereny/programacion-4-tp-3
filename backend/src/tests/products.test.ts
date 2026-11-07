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

  it("returns every product with its type, name and price", async () => {
    const res = await request(app).get("/products");
    expect(res.status).toBe(200);
    for (const product of res.body) {
      expect(product).toEqual(
        expect.objectContaining({
          type: expect.any(String),
          name: expect.any(String),
          price: expect.any(Number),
        }),
      );
      expect(["espresso", "filtered", "pastry"]).toContain(product.type);
    }
  });

  it("returns the domain price and variety of the spec example coffee", async () => {
    const res = await request(app).get("/products");
    const medium = res.body.find((p: { name: string }) => p.name === "Expreso Mediano");

    expect(medium).toEqual(
      expect.objectContaining({
        type: "espresso",
        name: "Expreso Mediano",
        size: "Mediano",
        coffeeGrams: 27,
        variety: {
          name: "Colombia",
          description: "Acidez media, cuerpo equilibrado y notas cítricas y florales",
        },
        price: 7360,
      }),
    );
  });

  it("returns a product by id", async () => {
    const res = await request(app).get("/products/Pastry-1");
    expect(res.status).toBe(200);
    expect(res.body).toEqual(
      expect.objectContaining({
        type: "pastry",
        name: "Muffin de chocolate",
        price: 2500,
      }),
    );
  });

  it("returns 404 if the product does not exist", async () => {
    const res = await request(app).get("/products/does-not-exist");
    expect(res.status).toBe(404);
  });
});
