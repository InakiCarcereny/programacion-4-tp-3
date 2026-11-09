import request from "supertest";
import { describe, expect, it } from "vitest";
import { createApp } from "@/app";

const app = createApp();

describe("POST /orders", () => {
  it("creates an order with a calculated total (201)", async () => {
    const res = await request(app)
      .post("/orders")
      .send({ items: [{ productId: "Pastry-1", quantity: 2 }] });
    expect(res.status).toBe(201);
    expect(res.body.id).toMatch(/^Order-\d+$/);
    expect(res.body.status).toBe("pending");
    expect(res.body.total).toBe(5000);
  });

  it("creates an order for a valid table and returns its mesaId", async () => {
    const res = await request(app)
      .post("/orders")
      .send({ mesaId: 4, items: [{ productId: "Pastry-1", quantity: 2 }] });
    expect(res.status).toBe(201);
    expect(res.body.mesaId).toBe(4);
    expect(res.body.status).toBe("pending");
    expect(res.body.total).toBe(5000);
  });

  it("omits mesaId for counter pickup orders", async () => {
    const res = await request(app)
      .post("/orders")
      .send({ items: [{ productId: "Pastry-1", quantity: 1 }] });
    expect(res.status).toBe(201);
    expect(res.body).not.toHaveProperty("mesaId");
  });

  it("accepts the maximum valid table", async () => {
    const res = await request(app)
      .post("/orders")
      .send({ mesaId: 20, items: [{ productId: "Pastry-1", quantity: 1 }] });
    expect(res.status).toBe(201);
    expect(res.body.mesaId).toBe(20);
  });

  it("returns 404 for a table that does not exist", async () => {
    const res = await request(app)
      .post("/orders")
      .send({ mesaId: 21, items: [{ productId: "Pastry-1", quantity: 1 }] });
    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: "Mesa 21 no encontrada" });
  });

  it("returns 400 for invalid mesaId values", async () => {
    const cases: Array<{ mesaId: unknown }> = [
      { mesaId: 0 },
      { mesaId: -1 },
      { mesaId: 1.5 },
      { mesaId: "4" },
    ];

    for (const { mesaId } of cases) {
      const res = await request(app)
        .post("/orders")
        .send({ mesaId, items: [{ productId: "Pastry-1", quantity: 1 }] });
      expect(res.status).toBe(400);
      expect(res.body).toEqual({ error: expect.any(String) });
    }
  });

  it("returns 400 for an empty order", async () => {
    const res = await request(app).post("/orders").send({ items: [] });
    expect(res.status).toBe(400);
    expect(res.body.error).toContain("Too small: expected array to have >=1 items");
  });

  it("returns 400 for a non-positive quantity", async () => {
    const res = await request(app)
      .post("/orders")
      .send({ items: [{ productId: "Pastry-1", quantity: 0 }] });
    expect(res.status).toBe(400);
    expect(res.body.error).toContain("Too small: expected number to be >0");
  });

  it("returns 400 for a fractional quantity", async () => {
    const res = await request(app)
      .post("/orders")
      .send({ items: [{ productId: "Pastry-1", quantity: 1.5 }] });
    expect(res.status).toBe(400);
    expect(res.body.error).toContain("Invalid input: expected int, received number");
  });

  it("returns 404 for a non-existent product", async () => {
    const res = await request(app)
      .post("/orders")
      .send({ items: [{ productId: "does-not-exist", quantity: 1 }] });
    expect(res.status).toBe(404);
    expect(res.body.error).toContain("Producto does-not-exist no encontrado");
  });
});

describe("GET /orders", () => {
  it("lists the created orders", async () => {
    await request(app)
      .post("/orders")
      .send({ items: [{ productId: "Pastry-2", quantity: 1 }] });
    const res = await request(app).get("/orders");
    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
  });
});

describe("GET /orders/:id", () => {
  it("returns an order by id", async () => {
    const created = await request(app)
      .post("/orders")
      .send({ items: [{ productId: "Pastry-1", quantity: 1 }] });
    const res = await request(app).get(`/orders/${created.body.id}`);
    expect(res.status).toBe(200);
    expect(res.body.total).toBe(2500);
  });

  it("returns the order with mesaId, status, items and total", async () => {
    const created = await request(app)
      .post("/orders")
      .send({ mesaId: 4, items: [{ productId: "Pastry-1", quantity: 2 }] });
    const res = await request(app).get(`/orders/${created.body.id}`);
    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      id: created.body.id,
      mesaId: 4,
      items: [{ productId: "Pastry-1", quantity: 2 }],
      status: "pending",
      total: 5000,
    });
  });

  it("returns 404 if the order does not exist", async () => {
    const res = await request(app).get("/orders/does-not-exist");
    expect(res.status).toBe(404);
  });
});
