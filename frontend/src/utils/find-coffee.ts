import type { Product } from "@/schemas/products";

type CoffeeProduct = Extract<Product, { type: "expreso" | "filtrado" }>;
type CoffeeType = CoffeeProduct["type"];

export interface CoffeeSelection {
  type: CoffeeType;
  size: string;
  origin: string;
}

export interface CoffeeOrigin {
  name: string;
  description: string;
}

export function findCoffee(
  products: Product[],
  selection: CoffeeSelection,
): CoffeeProduct | undefined {
  return products.find(
    (product): product is CoffeeProduct =>
      product.type !== "pasteleria" &&
      product.type === selection.type &&
      product.size === selection.size &&
      product.variety.name === selection.origin,
  );
}

export function listCoffeeOrigins(products: Product[]): CoffeeOrigin[] {
  const origins = new Map<string, CoffeeOrigin>();

  for (const product of products) {
    if (product.type === "pasteleria") {
      continue;
    }

    if (!origins.has(product.variety.name)) {
      origins.set(product.variety.name, {
        name: product.variety.name,
        description: product.variety.description,
      });
    }
  }

  return [...origins.values()];
}
