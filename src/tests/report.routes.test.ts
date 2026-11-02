import express from "express";
import request from "supertest";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { reportRoutes } from "@/routes/report.routes";
import { calculateTotalRevenue, findBestSellingProduct } from "@/services/report.service";

vi.mock("@/services/report.service");

const app = express();
app.use("/reports", reportRoutes);

beforeEach(() => {
  vi.resetAllMocks();
});

describe("GET /reports/revenue", () => {
  it("devuelve 200 con el revenue", async () => {
    vi.mocked(calculateTotalRevenue).mockReturnValue(500);

    const res = await request(app).get("/reports/revenue");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ revenue: 500 });
  });
});

describe("GET /reports/best-selling", () => {
  it("devuelve 200 con el producto más vendido", async () => {
    const best = { productId: "p1", name: "Café", quantity: 5 };
    vi.mocked(findBestSellingProduct).mockReturnValue(best);

    const res = await request(app).get("/reports/best-selling");

    expect(res.status).toBe(200);
    expect(res.body).toEqual(best);
  });
});
