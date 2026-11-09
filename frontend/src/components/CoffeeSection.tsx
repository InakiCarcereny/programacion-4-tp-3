import { useState } from "react";
import { useCart } from "@/context/CartContext";
import type { Cafe, CoffeeSize, CoffeeVariety, Producto } from "@/schemas/products";
import { findCoffee, listCoffeeOrigins } from "@/utils/find-coffee";
import { formatPrice } from "@/utils/format-price";

const drinks: { tipo: Cafe["tipo"]; label: string }[] = [
  { tipo: "expreso", label: "Expreso" },
  { tipo: "filtrado", label: "Filtrado" },
];

const sizes: CoffeeSize[] = ["Pocillo", "Mediano", "Taza grande"];

interface CoffeeSectionProps {
  productos: Producto[];
}

export function CoffeeSection({ productos }: CoffeeSectionProps): JSX.Element {
  const { dispatch } = useCart();
  const [tipo, setTipo] = useState<Cafe["tipo"] | null>(null);
  const [tamanio, setTamanio] = useState<CoffeeSize | null>(null);
  const [origen, setOrigen] = useState<CoffeeVariety | null>(null);

  const origins = listCoffeeOrigins(productos);
  const selectedCoffee =
    tipo !== null && tamanio !== null && origen !== null
      ? findCoffee(productos, { tipo, tamanio, origen })
      : undefined;

  function priceFor(origenNombre: CoffeeVariety): string {
    if (tipo === null || tamanio === null) {
      return "—";
    }

    const coffee = findCoffee(productos, { tipo, tamanio, origen: origenNombre });

    return coffee === undefined ? "—" : formatPrice(coffee.finalPrice);
  }

  function handleAdd(): void {
    if (selectedCoffee === undefined) {
      return;
    }

    dispatch({
      type: "ADD",
      product: {
        id: selectedCoffee.id,
        name: selectedCoffee.name,
        price: selectedCoffee.finalPrice,
      },
    });
  }

  return (
    <section aria-labelledby="coffee-heading" className="coffee-section">
      <h2 id="coffee-heading" className="coffee-heading">
        Café
      </h2>

      <fieldset className="coffee-step">
        <legend className="coffee-step__legend">1 · Bebida</legend>

        <div className="coffee-options coffee-options--drinks">
          {drinks.map((drink) => (
            <button
              key={drink.tipo}
              type="button"
              className="coffee-option"
              aria-pressed={tipo === drink.tipo}
              onClick={() => setTipo(drink.tipo)}
            >
              {drink.label}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset className="coffee-step">
        <legend className="coffee-step__legend">2 · Tamaño</legend>

        <div className="coffee-options coffee-options--sizes">
          {sizes.map((size) => (
            <button
              key={size}
              type="button"
              className="coffee-option coffee-option--size"
              aria-pressed={tamanio === size}
              onClick={() => setTamanio(size)}
            >
              {size}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset className="coffee-step">
        <legend className="coffee-step__legend">3 · Origen</legend>

        <div className="coffee-origins">
          {origins.map((origin) => (
            <button
              key={origin.nombre}
              type="button"
              className="coffee-origin"
              aria-pressed={origen === origin.nombre}
              onClick={() => setOrigen(origin.nombre)}
            >
              <span className="coffee-origin__header">
                <span className="coffee-origin__name">{origin.nombre}</span>
                <span className="coffee-origin__price">{priceFor(origin.nombre)}</span>
              </span>

              <span className="coffee-origin__description">{origin.descripcion}</span>
            </button>
          ))}
        </div>
      </fieldset>

      <button
        type="button"
        className="coffee-add"
        disabled={selectedCoffee === undefined}
        onClick={handleAdd}
      >
        {selectedCoffee === undefined ? "Elegí bebida, tamaño y origen" : "Agregar al pedido"}
      </button>
    </section>
  );
}
