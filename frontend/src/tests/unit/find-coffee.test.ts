import { describe, expect, it } from "vitest";
import { coffeeProductsFixture } from "@/mocks/fixtures";
import { findCoffee, listCoffeeOrigins } from "@/utils/find-coffee";

describe("findCoffee", () => {
  it("finds the espresso matching size and origin", () => {
    const coffee = findCoffee(coffeeProductsFixture, {
      type: "expreso",
      size: "Mediano",
      origin: "Colombia",
    });

    expect(coffee).toMatchObject({
      id: 5,
      type: "expreso",
      name: "Expreso Mediano",
      size: "Mediano",
      price: 7360,
      variety: { name: "Colombia" },
    });
  });

  it("finds a filtered coffee matching size and origin", () => {
    const coffee = findCoffee(coffeeProductsFixture, {
      type: "filtrado",
      size: "Taza grande",
      origin: "Etiopia",
    });

    expect(coffee).toMatchObject({
      id: 18,
      type: "filtrado",
      name: "Filtrado Taza grande",
      price: 9200,
      size: "Taza grande",
      variety: { name: "Etiopia" },
    });
  });

  it("returns undefined when the combination does not exist", () => {
    const withoutColombia = coffeeProductsFixture.filter(
      (product) => product.type !== "pasteleria" && product.variety.name !== "Colombia",
    );

    expect(
      findCoffee(withoutColombia, {
        type: "expreso",
        size: "Mediano",
        origin: "Colombia",
      }),
    ).toBeUndefined();
  });

  it("ignores pastries", () => {
    const onlyPastries = coffeeProductsFixture.filter((product) => product.type === "pasteleria");

    expect(
      findCoffee(onlyPastries, {
        type: "expreso",
        size: "Mediano",
        origin: "Colombia",
      }),
    ).toBeUndefined();
  });
});

describe("listCoffeeOrigins", () => {
  it("lists each origin once with its description", () => {
    const origins = listCoffeeOrigins(coffeeProductsFixture);

    expect(origins).toHaveLength(3);
    expect(origins).toEqual(
      expect.arrayContaining([
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
      ]),
    );
  });

  it("returns no origins when there are only pastries", () => {
    const onlyPastries = coffeeProductsFixture.filter((product) => product.type === "pasteleria");

    expect(listCoffeeOrigins(onlyPastries)).toEqual([]);
  });
});
