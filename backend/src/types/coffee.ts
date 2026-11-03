export type CoffeeSize = "Pocillo" | "Mediano" | "Taza grande";

export type CoffeeVariety = "Brasil" | "Colombia" | "Etiopia";

export const PRICE_PER_GRAM: Record<CoffeeVariety, number> = {
  Brasil: 140,
  Colombia: 180,
  Etiopia: 240,
};
