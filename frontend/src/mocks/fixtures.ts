import type { Cafe, CoffeeSize, CoffeeVariety, Producto } from "@/schemas/products";

interface VarietyFixture {
  nombre: CoffeeVariety;
  descripcion: string;
}

const variedades: VarietyFixture[] = [
  {
    nombre: "Brasil",
    descripcion: "Acidez baja, cuerpo intenso y notas a chocolate y nuez",
  },
  {
    nombre: "Colombia",
    descripcion: "Acidez media, cuerpo equilibrado y notas cítricas y florales",
  },
  {
    nombre: "Etiopia",
    descripcion: "Acidez alta, cuerpo ligero y notas florales y frutales",
  },
];

const tamanios: CoffeeSize[] = ["Pocillo", "Mediano", "Taza grande"];

const gramosPorTipo: Record<"expreso" | "filtrado", Record<CoffeeSize, number>> = {
  expreso: { Pocillo: 18, Mediano: 27, "Taza grande": 36 },
  filtrado: { Pocillo: 6, Mediano: 15, "Taza grande": 25 },
};

const precioPorGramo: Record<CoffeeVariety, number> = {
  Brasil: 140,
  Colombia: 180,
  Etiopia: 240,
};

const basePrice: Record<"expreso" | "filtrado", number> = {
  expreso: 2500,
  filtrado: 3200,
};

function buildCoffees(tipo: "expreso" | "filtrado"): Cafe[] {
  let counter = 1;
  const coffees: Cafe[] = [];

  for (const tamanio of tamanios) {
    for (const variedad of variedades) {
      const gramosCafe = gramosPorTipo[tipo][tamanio];
      const name = `${tipo === "expreso" ? "Expreso" : "Filtrado"} ${tamanio} ${variedad.nombre}`;
      const idPrefix = tipo === "expreso" ? "Espresso" : "Filtered";

      coffees.push({
        id: `${idPrefix}-${counter}`,
        tipo,
        name,
        basePrice: basePrice[tipo],
        finalPrice: basePrice[tipo] + gramosCafe * precioPorGramo[variedad.nombre],
        tamanio,
        gramosCafe,
        variedad,
      });

      counter += 1;
    }
  }

  return coffees;
}

export const productosFixture: Producto[] = [
  ...buildCoffees("expreso"),
  ...buildCoffees("filtrado"),
  {
    id: "Pastry-1",
    tipo: "pasteleria",
    name: "Muffin de chocolate",
    basePrice: 2500,
    finalPrice: 2500,
  },
  {
    id: "Pastry-2",
    tipo: "pasteleria",
    name: "Torta selva negra",
    basePrice: 4200,
    finalPrice: 4200,
  },
];
