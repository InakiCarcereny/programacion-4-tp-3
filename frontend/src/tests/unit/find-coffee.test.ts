import { describe, expect, it } from "vitest";
import { productosFixture } from "@/mocks/fixtures";
import { findCoffee, listCoffeeOrigins } from "@/utils/find-coffee";

describe("findCoffee", () => {
  it("finds the espresso matching size and origin", () => {
    const coffee = findCoffee(productosFixture, {
      tipo: "expreso",
      tamanio: "Mediano",
      origen: "Colombia",
    });

    expect(coffee).toMatchObject({
      id: "Espresso-5",
      name: "Expreso Mediano Colombia",
      basePrice: 2500,
      finalPrice: 7360,
      tamanio: "Mediano",
      variedad: { nombre: "Colombia" },
    });
  });

  it("finds a filtered coffee matching size and origin", () => {
    const coffee = findCoffee(productosFixture, {
      tipo: "filtrado",
      tamanio: "Taza grande",
      origen: "Etiopia",
    });

    expect(coffee).toMatchObject({
      id: "Filtered-9",
      name: "Filtrado Taza grande Etiopia",
      finalPrice: 9200,
      tamanio: "Taza grande",
      variedad: { nombre: "Etiopia" },
    });
  });

  it("returns undefined when the combination does not exist", () => {
    const withoutColombia = productosFixture.filter(
      (producto) => producto.tipo !== "pasteleria" && producto.variedad.nombre !== "Colombia",
    );

    expect(
      findCoffee(withoutColombia, {
        tipo: "expreso",
        tamanio: "Mediano",
        origen: "Colombia",
      }),
    ).toBeUndefined();
  });

  it("ignores pastries", () => {
    const onlyPastries = productosFixture.filter((producto) => producto.tipo === "pasteleria");

    expect(
      findCoffee(onlyPastries, {
        tipo: "expreso",
        tamanio: "Mediano",
        origen: "Colombia",
      }),
    ).toBeUndefined();
  });
});

describe("listCoffeeOrigins", () => {
  it("lists each origin once with its description", () => {
    const origins = listCoffeeOrigins(productosFixture);

    expect(origins).toHaveLength(3);
    expect(origins).toEqual(
      expect.arrayContaining([
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
      ]),
    );
  });

  it("returns no origins when there are only pastries", () => {
    const onlyPastries = productosFixture.filter((producto) => producto.tipo === "pasteleria");

    expect(listCoffeeOrigins(onlyPastries)).toEqual([]);
  });
});
