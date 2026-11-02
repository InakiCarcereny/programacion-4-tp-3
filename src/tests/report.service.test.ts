import { beforeEach, describe, expect, it, vi } from "vitest";
import { NotFoundError } from "@/errors/AppError";
import { listOrders } from "@/services/order.service";
import { findProductById } from "@/services/product.service";
import {
  calculateSalesByProduct,
  calculateTotalRevenue,
  findBestSellingProduct,
} from "@/services/report.service";

vi.mock("@/data/products", () => ({ products: [] }));
vi.mock("@/services/order.service");
vi.mock("@/services/product.service");

const mockListOrders = vi.mocked(listOrders);
const mockFindProductById = vi.mocked(findProductById);

type OrderStub = ReturnType<typeof listOrders>[number];
type ProductStub = NonNullable<ReturnType<typeof findProductById>>;

const fakeOrder = (items: { productId: string; quantity: number }[], total = 0): OrderStub =>
  ({ items, calculateTotal: vi.fn().mockReturnValue(total) }) as unknown as OrderStub;

const fakeProduct = (id: string, name: string): ProductStub =>
  ({ id, name }) as unknown as ProductStub;

const catalog: Record<string, ProductStub> = {
  p1: fakeProduct("p1", "Café"),
  p2: fakeProduct("p2", "Medialuna"),
};

beforeEach(() => {
  vi.resetAllMocks();
  mockFindProductById.mockImplementation((id: string) => catalog[id]);
});

describe("calculateTotalRevenue", () => {
  it("devuelve 0 si no hay pedidos", () => {
    mockListOrders.mockReturnValue([]);
    expect(calculateTotalRevenue()).toBe(0);
  });

  it("suma el total de todos los pedidos", () => {
    mockListOrders.mockReturnValue([fakeOrder([], 100), fakeOrder([], 250)]);
    expect(calculateTotalRevenue()).toBe(350);
  });
});

describe("calculateSalesByProduct", () => {
  it("devuelve lista vacía si no hay pedidos", () => {
    mockListOrders.mockReturnValue([]);
    expect(calculateSalesByProduct()).toEqual([]);
  });

  it("acumula cantidades del mismo producto entre pedidos", () => {
    mockListOrders.mockReturnValue([
      fakeOrder([{ productId: "p1", quantity: 2 }]),
      fakeOrder([
        { productId: "p1", quantity: 3 },
        { productId: "p2", quantity: 1 },
      ]),
    ]);

    expect(calculateSalesByProduct()).toEqual([
      { productId: "p1", name: "Café", quantity: 5 },
      { productId: "p2", name: "Medialuna", quantity: 1 },
    ]);
  });

  it("lanza NotFoundError si el producto no existe", () => {
    mockListOrders.mockReturnValue([fakeOrder([{ productId: "x", quantity: 1 }])]);
    expect(() => calculateSalesByProduct()).toThrow(NotFoundError);
  });
});

describe("findBestSellingProduct", () => {
  it("devuelve undefined si no hay ventas", () => {
    mockListOrders.mockReturnValue([]);
    expect(findBestSellingProduct()).toBeUndefined();
  });

  it("devuelve el producto con más unidades vendidas", () => {
    mockListOrders.mockReturnValue([
      fakeOrder([
        { productId: "p1", quantity: 1 },
        { productId: "p2", quantity: 4 },
      ]),
    ]);
    expect(findBestSellingProduct()).toEqual({ productId: "p2", name: "Medialuna", quantity: 4 });
  });
});
