import { beforeEach, describe, expect, it } from "vitest";
import { orders } from "@/data/orders";
import { createOrder } from "@/services/order.service";
import { calculateSalesByProduct, calculateTotalRevenue } from "@/services/report.service";

beforeEach(() => {
  orders.length = 0;
});

describe("report service", () => {
  it("groups the units sold by product", () => {
    createOrder([{ productId: 19, quantity: 2 }]);
    createOrder([
      { productId: 1, quantity: 1 },
      { productId: 20, quantity: 3 },
    ]);
    createOrder([{ productId: 19, quantity: 2 }]);

    expect(calculateSalesByProduct()).toEqual([
      { productId: 19, name: "Muffin de chocolate", quantity: 4 },
      { productId: 1, name: "Expreso Pocillo", quantity: 1 },
      { productId: 20, name: "Torta selva negra", quantity: 3 },
    ]);
  });

  it("calculates the total revenue from the existing orders", () => {
    createOrder([{ productId: 19, quantity: 2 }]);
    createOrder([{ productId: 20, quantity: 1 }]);

    expect(calculateTotalRevenue()).toBe(5000 + 4200);
  });
});
