import request from "supertest";
import { describe, expect, it } from "vitest";
import { createApp } from "@/app";

const app = createApp();

describe("E2E API", () => {
  it("GET /health returns 200 with status ok", async () => {
    const res = await request(app).get("/health");

    expect(res.status).toBe(200);
    expect(res.body.status).toBe("ok");
    expect(typeof res.body.uptime).toBe("number");
    expect(typeof res.body.timestamp).toBe("string");
  });

  it("GET /products returns the full catalog with the expected contract", async () => {
    const res = await request(app).get("/products");

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(20);
    for (const product of res.body) {
      expect(product).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          name: expect.any(String),
          basePrice: expect.any(Number),
          finalPrice: expect.any(Number),
        }),
      );
    }
  });

  it("GET /products/:id returns an existing product and 404 if it doesn't exist", async () => {
    const found = await request(app).get("/products/Pastry-1");
    expect(found.status).toBe(200);
    expect(found.body).toEqual(
      expect.objectContaining({
        id: "Pastry-1",
        name: "Muffin de chocolate",
        basePrice: 2500,
        finalPrice: 2500,
      }),
    );

    const missing = await request(app).get("/products/Producto-inexistente");
    expect(missing.status).toBe(404);
    expect(missing.body).toEqual({
      error: "Producto Producto-inexistente no encontrado",
    });
  });

  it("GET /reports/revenue returns 0 when there are no sales", async () => {
    const res = await request(app).get("/reports/revenue");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ revenue: 0 });
  });

  it("GET /reports/best-selling returns 404 when there are no sales", async () => {
    const res = await request(app).get("/reports/best-selling");

    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: "No hay ventas registradas" });
  });

  it("GET /orders starts empty", async () => {
    const res = await request(app).get("/orders");

    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it("POST /orders creates an order with the expected contract", async () => {
    const res = await request(app)
      .post("/orders")
      .send({ items: [{ productId: "Pastry-1", quantity: 2 }] });

    expect(res.status).toBe(201);
    expect(res.body).toEqual({
      id: "Order-1",
      items: [{ productId: "Pastry-1", quantity: 2 }],
      status: "pending",
      total: 5000,
    });
  });

  it("GET /orders/:id returns the created order and GET /orders lists it", async () => {
    const byId = await request(app).get("/orders/Order-1");
    expect(byId.status).toBe(200);
    expect(byId.body).toEqual({
      id: "Order-1",
      items: [{ productId: "Pastry-1", quantity: 2 }],
      status: "pending",
      total: 5000,
    });

    const list = await request(app).get("/orders");
    expect(list.status).toBe(200);
    expect(list.body).toHaveLength(1);
    expect(list.body[0].id).toBe("Order-1");
  });

  it("GET /reports/revenue sums the total of the created orders", async () => {
    const res = await request(app).get("/reports/revenue");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ revenue: 5000 });
  });

  it("GET /reports/best-selling returns the best-selling product", async () => {
    const res = await request(app).get("/reports/best-selling");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      productId: "Pastry-1",
      name: "Muffin de chocolate",
      quantity: 2,
    });
  });

  it("POST /orders rejects invalid payloads with 400/404", async () => {
    const noItems = await request(app).post("/orders").send({});
    expect(noItems.status).toBe(400);
    expect(noItems.body).toEqual({
      error: "Orden tiene que tener por lo menos un item",
    });

    const invalidQuantity = await request(app)
      .post("/orders")
      .send({ items: [{ productId: "Pastry-1", quantity: 0 }] });
    expect(invalidQuantity.status).toBe(400);
    expect(invalidQuantity.body).toEqual({
      error: "Cantidad invalida para producto Pastry-1",
    });

    const nonExistentProduct = await request(app)
      .post("/orders")
      .send({ items: [{ productId: "Producto-inexistente", quantity: 1 }] });
    expect(nonExistentProduct.status).toBe(404);
    expect(nonExistentProduct.body).toEqual({
      error: "Producto Producto-inexistente no encontrado",
    });
  });

  it("GET /orders/:id for a non-existent order returns 404", async () => {
    const res = await request(app).get("/orders/Order-999");

    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: "Orden Order-999 no encontrada" });
  });

  it("POST /orders with invalid JSON returns 400", async () => {
    const res = await request(app)
      .post("/orders")
      .set("Content-Type", "application/json")
      .send("{ no es json");

    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: "JSON invalido" });
  });

  it("an unknown route returns 404", async () => {
    const res = await request(app).get("/ruta-inexistente");

    expect(res.status).toBe(404);
    expect(res.body.error).toMatch(/no encontrada/);
  });
});
