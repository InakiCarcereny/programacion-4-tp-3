import { beforeEach, describe, expect, it } from "vitest";
import { orders } from "@/data/orders";
import { createOrder } from "@/services/order.service";
import { calculateSalesByProduct, calculateTotalRevenue } from "@/services/report.service";

beforeEach(() => {
  orders.length = 0;
});

describe("report service", () => {
  it("groups the units sold by product", () => {
    createOrder([{ productId: "Pastry-1", quantity: 2 }]);
    createOrder([
      { productId: "Espresso-1", quantity: 1 },
      { productId: "Pastry-2", quantity: 3 },
    ]);
    createOrder([{ productId: "Pastry-1", quantity: 2 }]);

    expect(calculateSalesByProduct()).toEqual([
      { productId: "Pastry-1", name: "Muffin de chocolate", quantity: 4 },
      { productId: "Espresso-1", name: "Expreso Pocillo Brasil", quantity: 1 },
      { productId: "Pastry-2", name: "Torta selva negra", quantity: 3 },
    ]);
  });

  it("calculates the total revenue from the existing orders", () => {
    createOrder([{ productId: "Pastry-1", quantity: 2 }]);
    createOrder([{ productId: "Pastry-2", quantity: 1 }]);

    expect(calculateTotalRevenue()).toBe(5000 + 4200);
  });
});
