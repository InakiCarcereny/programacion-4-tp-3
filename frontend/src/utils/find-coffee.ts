import type { Cafe, CoffeeSize, CoffeeVariety, Producto } from "@/schemas/products";

export interface CoffeeSelection {
  tipo: Cafe["tipo"];
  tamanio: CoffeeSize;
  origen: CoffeeVariety;
}

export interface CoffeeOrigin {
  nombre: CoffeeVariety;
  descripcion: string;
}

export function findCoffee(productos: Producto[], selection: CoffeeSelection): Cafe | undefined {
  return productos.find(
    (producto): producto is Cafe =>
      producto.tipo !== "pasteleria" &&
      producto.tipo === selection.tipo &&
      producto.tamanio === selection.tamanio &&
      producto.variedad.nombre === selection.origen,
  );
}

export function listCoffeeOrigins(productos: Producto[]): CoffeeOrigin[] {
  const origins = new Map<CoffeeVariety, CoffeeOrigin>();

  for (const producto of productos) {
    if (producto.tipo === "pasteleria") {
      continue;
    }

    if (!origins.has(producto.variedad.nombre)) {
      origins.set(producto.variedad.nombre, {
        nombre: producto.variedad.nombre,
        descripcion: producto.variedad.descripcion,
      });
    }
  }

  return [...origins.values()];
}
