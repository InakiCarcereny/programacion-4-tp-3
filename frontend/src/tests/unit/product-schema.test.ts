import { describe, expect, it } from "vitest";
import { productSchema, productsSchema } from "@/schemas/products";

const espressoMedium = {
  id: 5,
  type: "expreso",
  name: "Expreso Mediano",
  size: "Mediano",
  grams: 27,
  variety: {
    name: "Colombia",
    description: "Acidez media, cuerpo equilibrado y notas cítricas y florales",
  },
  price: 7360,
};

const muffin = { id: 19, type: "pasteleria", name: "Muffin de chocolate", price: 2500 };

describe("productSchema", () => {
  it("accepts the product contract from the spec", () => {
    expect(productSchema.safeParse(espressoMedium).success).toBe(true);
  });

  it("accepts a pastry without coffee-only fields", () => {
    expect(productSchema.safeParse(muffin).success).toBe(true);
  });

  it("rejects a product with a string id", () => {
    expect(productSchema.safeParse({ ...espressoMedium, id: "5" }).success).toBe(false);
  });

  it("rejects a coffee without its variety", () => {
    const coffee = {
      id: 5,
      type: "expreso",
      name: "Expreso Mediano",
      size: "Mediano",
      grams: 27,
      price: 7360,
    };
    expect(productSchema.safeParse(coffee).success).toBe(false);
  });

  it("rejects an unknown type", () => {
    expect(productSchema.safeParse({ ...muffin, type: "bebida" }).success).toBe(false);
  });

  it("rejects a product without a price", () => {
    expect(
      productSchema.safeParse({ id: 19, type: "pasteleria", name: "Muffin de chocolate" }).success,
    ).toBe(false);
  });

  it("rejects the legacy payload with basePrice and finalPrice", () => {
    const legacy = {
      id: "Espresso-1",
      name: "Expreso Pocillo Brasil",
      basePrice: 5000,
      finalPrice: 5900,
    };
    expect(productSchema.safeParse(legacy).success).toBe(false);
  });
});

describe("productsSchema", () => {
  it("accepts the menu payload", () => {
    expect(productsSchema.safeParse([espressoMedium, muffin]).success).toBe(true);
  });
});
