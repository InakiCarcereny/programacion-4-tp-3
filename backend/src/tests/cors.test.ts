import request from "supertest";
import { describe, expect, it } from "vitest";
import { createApp } from "@/app";

const app = createApp();
const ORIGIN = "http://localhost:5173";

describe("CORS", () => {
  it("answers the preflight with access-control-allow-origin", async () => {
    const res = await request(app)
      .options("/products")
      .set("Origin", ORIGIN)
      .set("Access-Control-Request-Method", "GET");
    expect(res.headers["access-control-allow-origin"]).toBe("*");
  });

  it("sends the header on a GET response", async () => {
    const res = await request(app).get("/products").set("Origin", ORIGIN);
    expect(res.headers["access-control-allow-origin"]).toBe("*");
  });

  it("allows the content-type header needed by POST /orders", async () => {
    const res = await request(app)
      .options("/orders")
      .set("Origin", ORIGIN)
      .set("Access-Control-Request-Method", "POST")
      .set("Access-Control-Request-Headers", "content-type");
    expect(res.headers["access-control-allow-headers"]).toContain("content-type");
  });
});
