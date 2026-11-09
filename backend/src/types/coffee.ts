export type CoffeeSize = "Pocillo" | "Mediano" | "Taza grande";

export type CoffeeVariety = "Brasil" | "Colombia" | "Etiopia";

export const PRICE_PER_GRAM: Record<CoffeeVariety, number> = {
  Brasil: 140,
  Colombia: 180,
  Etiopia: 240,
};

export const VARIETY_DESCRIPTIONS: Record<CoffeeVariety, string> = {
  Brasil: "Acidez baja, cuerpo redondo y notas a chocolate y nuez",
  Colombia: "Acidez media, cuerpo equilibrado y notas cítricas y florales",
  Etiopia: "Acidez alta, cuerpo ligero y notas a frutas rojas y florales",
};
