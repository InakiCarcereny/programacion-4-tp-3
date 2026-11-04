import { describe, expect, it } from "vitest";
import { cartReducer, getSubtotal, initialCartState } from "@/context/cart-reducer";
import type { Product } from "@/types/product";

const muffin: Product = { id: 19, name: "Muffin de chocolate", price: 2500 };
const cake: Product = {
  id: 20,
  name: "Torta selva negra",
  price: 4200,
};

describe("cartReducer", () => {
  it("returns an empty cart as the initial state", () => {
    expect(initialCartState).toEqual({ items: [] });
  });

  describe("ADD action", () => {
    it("adds a new product with quantity 1", () => {
      const state = cartReducer(initialCartState, {
        type: "ADD",
        product: muffin,
      });
      expect(state.items).toEqual([{ product: muffin, quantity: 1 }]);
    });

    it("increases the quantity when the product is already in the cart", () => {
      const firstAdd = cartReducer(initialCartState, {
        type: "ADD",
        product: muffin,
      });
      const secondAdd = cartReducer(firstAdd, { type: "ADD", product: muffin });

      expect(secondAdd.items).toEqual([{ product: muffin, quantity: 2 }]);
    });

    it("keeps existing items untouched when adding a different product", () => {
      const withMuffin = cartReducer(initialCartState, {
        type: "ADD",
        product: muffin,
      });
      const withBoth = cartReducer(withMuffin, { type: "ADD", product: cake });

      expect(withBoth.items).toEqual([
        { product: muffin, quantity: 1 },
        { product: cake, quantity: 1 },
      ]);
    });
  });

  describe("INCREMENT action", () => {
    it("increases the quantity of an existing item by 1", () => {
      const withOne = cartReducer(initialCartState, {
        type: "ADD",
        product: muffin,
      });
      const state = cartReducer(withOne, {
        type: "INCREMENT",
        productId: muffin.id,
      });

      expect(state.items).toEqual([{ product: muffin, quantity: 2 }]);
    });

    it("does not affect items other than the one being incremented", () => {
      const withBoth = [
        { type: "ADD" as const, product: muffin },
        { type: "ADD" as const, product: cake },
      ].reduce(cartReducer, initialCartState);
      const state = cartReducer(withBoth, {
        type: "INCREMENT",
        productId: muffin.id,
      });

      expect(state.items).toEqual([
        { product: muffin, quantity: 2 },
        { product: cake, quantity: 1 },
      ]);
    });

    it("leaves the cart unchanged when incrementing a product that is not in it", () => {
      const state = cartReducer(initialCartState, {
        type: "INCREMENT",
        productId: muffin.id,
      });
      expect(state.items).toEqual([]);
    });
  });

  describe("DECREMENT action", () => {
    it("decreases the quantity of an existing item by 1", () => {
      const withTwo = [
        { type: "ADD" as const, product: muffin },
        { type: "ADD" as const, product: muffin },
      ].reduce(cartReducer, initialCartState);
      const state = cartReducer(withTwo, {
        type: "DECREMENT",
        productId: muffin.id,
      });

      expect(state.items).toEqual([{ product: muffin, quantity: 1 }]);
    });

    it("removes the item once its quantity reaches 0", () => {
      const withOne = cartReducer(initialCartState, {
        type: "ADD",
        product: muffin,
      });
      const state = cartReducer(withOne, {
        type: "DECREMENT",
        productId: muffin.id,
      });

      expect(state.items).toEqual([]);
    });

    it("leaves the cart unchanged when decrementing a product that is not in it", () => {
      const state = cartReducer(initialCartState, {
        type: "DECREMENT",
        productId: muffin.id,
      });
      expect(state.items).toEqual([]);
    });
  });

  describe("REMOVE action", () => {
    it("removes an item regardless of its quantity", () => {
      const withThree = [
        { type: "ADD" as const, product: muffin },
        { type: "ADD" as const, product: muffin },
        { type: "ADD" as const, product: muffin },
      ].reduce(cartReducer, initialCartState);
      const state = cartReducer(withThree, {
        type: "REMOVE",
        productId: muffin.id,
      });

      expect(state.items).toEqual([]);
    });

    it("only removes the targeted item, keeping the rest of the cart", () => {
      const withBoth = [
        { type: "ADD" as const, product: muffin },
        { type: "ADD" as const, product: cake },
      ].reduce(cartReducer, initialCartState);
      const state = cartReducer(withBoth, {
        type: "REMOVE",
        productId: muffin.id,
      });

      expect(state.items).toEqual([{ product: cake, quantity: 1 }]);
    });
  });

  describe("CLEAR action", () => {
    it("empties the cart regardless of its previous contents", () => {
      const withItems = [
        { type: "ADD" as const, product: muffin },
        { type: "ADD" as const, product: cake },
      ].reduce(cartReducer, initialCartState);
      const state = cartReducer(withItems, { type: "CLEAR" });

      expect(state.items).toEqual([]);
    });

    it("is a no-op on an already empty cart", () => {
      const state = cartReducer(initialCartState, { type: "CLEAR" });
      expect(state.items).toEqual([]);
    });
  });
});

describe("getSubtotal", () => {
  it("returns 0 for an empty cart", () => {
    expect(getSubtotal(initialCartState)).toBe(0);
  });

  it("returns the price of a single item times its quantity", () => {
    const state = cartReducer(initialCartState, {
      type: "ADD",
      product: muffin,
    });
    expect(getSubtotal(state)).toBe(2500);
  });

  it("sums the subtotal of every item in the cart", () => {
    const state = [
      { type: "ADD" as const, product: muffin },
      { type: "ADD" as const, product: muffin },
      { type: "ADD" as const, product: cake },
    ].reduce(cartReducer, initialCartState);

    expect(getSubtotal(state)).toBe(9200);
  });

  it("reflects quantity changes made through the reducer", () => {
    const withTwo = [
      { type: "ADD" as const, product: muffin },
      { type: "ADD" as const, product: muffin },
    ].reduce(cartReducer, initialCartState);
    const withOne = cartReducer(withTwo, {
      type: "DECREMENT",
      productId: muffin.id,
    });

    expect(getSubtotal(withOne)).toBe(2500);
  });
});
