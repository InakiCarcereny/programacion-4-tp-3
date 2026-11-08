import { describe, expect, it } from "vitest";
import { productoSchema } from "@/schemas/products";

const espresso = {
  id: "Espresso-5",
  tipo: "expreso",
  name: "Expreso Mediano Colombia",
  basePrice: 2500,
  finalPrice: 7360,
  tamanio: "Mediano",
  gramosCafe: 27,
  variedad: {
    nombre: "Colombia",
    descripcion: "Acidez media, cuerpo equilibrado y notas cítricas y florales",
  },
};

const pastry = {
  id: "Pastry-1",
  tipo: "pasteleria",
  name: "Muffin de chocolate",
  basePrice: 2500,
  finalPrice: 2500,
};

describe("productoSchema", () => {
  it("accepts a coffee with its type and variety details", () => {
    const parsed = productoSchema.safeParse(espresso);

    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data).toEqual(espresso);
    }
  });

  it("rejects a product without tipo", () => {
    const withoutTipo = {
      id: espresso.id,
      name: espresso.name,
      basePrice: espresso.basePrice,
      finalPrice: espresso.finalPrice,
      tamanio: espresso.tamanio,
      gramosCafe: espresso.gramosCafe,
      variedad: espresso.variedad,
    };

    const parsed = productoSchema.safeParse(withoutTipo);

    expect(parsed.success).toBe(false);
  });

  it("rejects an unknown tipo", () => {
    const parsed = productoSchema.safeParse({ ...espresso, tipo: "te" });

    expect(parsed.success).toBe(false);
  });

  it("accepts a pastry with tipo pasteleria", () => {
    const parsed = productoSchema.safeParse(pastry);

    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data).toEqual(pastry);
    }
  });
});
