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
