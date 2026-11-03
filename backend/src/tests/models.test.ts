import { describe, expect, it } from "vitest";
import { Espresso } from "@/models/Espresso";
import { FilteredCoffee } from "@/models/FilteredCoffee";
import { Pastry } from "@/models/Pastry";

describe("Espresso", () => {
  it("calculates the price of a Pocillo Brasil (18g * 140 + 2500)", () => {
    const coffee = new Espresso("Espresso-1", "Pocillo", "Brasil");
    expect(coffee.calculatePrice()).toBe(5020);
  });

  it("calculates the price of a Taza grande Etiopía (36g * 240 + 2500)", () => {
    const coffee = new Espresso("Espresso-2", "Taza grande", "Etiopia");
    expect(coffee.calculatePrice()).toBe(11140);
  });
});

describe("FilteredCoffee", () => {
  it("calculates the price of a Mediano Colombia (15g * 180 + 3200)", () => {
    const coffee = new FilteredCoffee("Filtered-1", "Mediano", "Colombia");
    expect(coffee.calculatePrice()).toBe(5900);
  });
});

describe("Pastry", () => {
  it("final price equals the base price, with no variable cost", () => {
    const muffin = new Pastry("Pastry-1", "Muffin de chocolate", 2500);
    expect(muffin.calculatePrice()).toBe(2500);
  });
});
