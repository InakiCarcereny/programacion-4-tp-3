import type { NextFunction, Request, Response } from "express";
import { beforeEach, describe, expect, it, vi, type Mock } from "vitest";
import { getBestSellingProduct, getRevenue } from "@/controllers/report.controller";
import { NotFoundError } from "@/errors/AppError";
import { calculateTotalRevenue, findBestSellingProduct } from "@/services/report.service";

vi.mock("@/services/report.service");

const mockRevenue = vi.mocked(calculateTotalRevenue);
const mockBest = vi.mocked(findBestSellingProduct);

const req = {} as Request;

const makeRes = (): { res: Response; json: Mock } => {
  const json = vi.fn();
  return { res: { json } as unknown as Response, json };
};

beforeEach(() => {
  vi.resetAllMocks();
});

describe("getRevenue", () => {
  it("responde con el revenue", () => {
    mockRevenue.mockReturnValue(500);
    const { res, json } = makeRes();

    getRevenue(req, res, vi.fn());

    expect(json).toHaveBeenCalledWith({ revenue: 500 });
  });

  it("pasa el error a next si el service falla", () => {
    const error = new Error("boom");
    mockRevenue.mockImplementation(() => {
      throw error;
    });
    const next: NextFunction = vi.fn();

    getRevenue(req, makeRes().res, next);

    expect(next).toHaveBeenCalledWith(error);
  });
});

describe("getBestSellingProduct", () => {
  it("responde con el producto más vendido", () => {
    const best = { productId: "p1", name: "Café", quantity: 5 };
    mockBest.mockReturnValue(best);
    const { res, json } = makeRes();

    getBestSellingProduct(req, res, vi.fn());

    expect(json).toHaveBeenCalledWith(best);
  });

  it("llama a next con NotFoundError si no hay ventas", () => {
    mockBest.mockReturnValue(undefined);
    const next: NextFunction = vi.fn();

    getBestSellingProduct(req, makeRes().res, next);

    expect(next).toHaveBeenCalledWith(expect.any(NotFoundError));
  });

  it("pasa el error a next si el service falla", () => {
    const error = new Error("boom");
    mockBest.mockImplementation(() => {
      throw error;
    });
    const next: NextFunction = vi.fn();

    getBestSellingProduct(req, makeRes().res, next);

    expect(next).toHaveBeenCalledWith(error);
  });
});
