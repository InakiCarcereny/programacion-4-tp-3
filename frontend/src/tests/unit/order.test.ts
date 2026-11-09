import { describe, expect, it } from "vitest";
import type { CartState } from "@/types/cart";
import { formatOrderStatus, toNewOrder } from "@/utils/order";

describe("formatOrderStatus", () => {
  it("translates every status the api can return", () => {
    expect(formatOrderStatus("pending")).toBe("Pendiente");
    expect(formatOrderStatus("preparing")).toBe("En preparación");
    expect(formatOrderStatus("delivered")).toBe("Entregado");
  });
});

describe("toNewOrder", () => {
  const cart: CartState = {
    items: [
      { product: { id: 5, name: "Expreso Mediano Colombia", price: 7360 }, quantity: 2 },
      { product: { id: 19, name: "Muffin de chocolate", price: 2500 }, quantity: 1 },
    ],
  };

  it("builds the order body with the table and the cart items", () => {
    expect(toNewOrder(cart, 4)).toEqual({
      mesaId: 4,
      items: [
        { productId: "5", quantity: 2 },
        { productId: "19", quantity: 1 },
      ],
    });
  });

  it("leaves the table empty when the order is for the bar", () => {
    expect(toNewOrder(cart, null).mesaId).toBeNull();
  });

  it("does not send prices to the api", () => {
    const body = toNewOrder(cart, 4);

    expect(JSON.stringify(body)).not.toContain("7360");
  });
});
