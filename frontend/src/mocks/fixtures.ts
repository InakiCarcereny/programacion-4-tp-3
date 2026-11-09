import type { Product } from "@/schemas/products";

export const productsFixture = [
  {
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
  },
  { id: 19, type: "pasteleria", name: "Muffin de chocolate", price: 2500 },
] satisfies Product[];

const varieties = [
  {
    name: "Brasil",
    description: "Acidez baja, cuerpo redondo y notas a chocolate y nuez",
  },
  {
    name: "Colombia",
    description: "Acidez media, cuerpo equilibrado y notas cítricas y florales",
  },
  {
    name: "Etiopia",
    description: "Acidez alta, cuerpo ligero y notas a frutas rojas y florales",
  },
] as const;

const sizes = ["Pocillo", "Mediano", "Taza grande"] as const;

const gramsPerType: Record<"expreso" | "filtrado", Record<(typeof sizes)[number], number>> = {
  expreso: { Pocillo: 18, Mediano: 27, "Taza grande": 36 },
  filtrado: { Pocillo: 6, Mediano: 15, "Taza grande": 25 },
};

const pricePerGram: Record<(typeof varieties)[number]["name"], number> = {
  Brasil: 140,
  Colombia: 180,
  Etiopia: 240,
};

const basePrice: Record<"expreso" | "filtrado", number> = {
  expreso: 2500,
  filtrado: 3200,
};

function buildCoffees(type: "expreso" | "filtrado"): Product[] {
  const coffees: Product[] = [];
  let id = type === "expreso" ? 1 : 10;

  for (const size of sizes) {
    for (const variety of varieties) {
      const grams = gramsPerType[type][size];

      coffees.push({
        id,
        type,
        name: `${type === "expreso" ? "Expreso" : "Filtrado"} ${size}`,
        size,
        grams,
        variety,
        price: basePrice[type] + grams * pricePerGram[variety.name],
      } as Product);

      id += 1;
    }
  }

  return coffees;
}

export const coffeeProductsFixture: Product[] = [
  ...buildCoffees("expreso"),
  ...buildCoffees("filtrado"),
  { id: 19, type: "pasteleria", name: "Muffin de chocolate", price: 2500 },
  { id: 20, type: "pasteleria", name: "Torta selva negra", price: 4200 },
];
