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

  it("returns 404 if the order does not exist", async () => {
    const res = await request(app).get("/orders/does-not-exist");
    expect(res.status).toBe(404);
  });
});
