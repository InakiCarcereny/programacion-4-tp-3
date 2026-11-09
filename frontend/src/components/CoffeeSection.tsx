import { useState } from "react";
import { useCart } from "@/context/CartContext";
import type { Product } from "@/schemas/products";
import { findCoffee, listCoffeeOrigins } from "@/utils/find-coffee";
import { formatPrice } from "@/utils/format-price";

type CoffeeType = "expreso" | "filtrado";
type CoffeeSize = "Pocillo" | "Mediano" | "Taza grande";

const drinks: { type: CoffeeType; label: string }[] = [
  { type: "expreso", label: "Expreso" },
  { type: "filtrado", label: "Filtrado" },
];

const sizes: CoffeeSize[] = ["Pocillo", "Mediano", "Taza grande"];

interface CoffeeSectionProps {
  products: Product[];
}

export function CoffeeSection({ products }: CoffeeSectionProps): JSX.Element {
  const { dispatch } = useCart();
  const [drink, setDrink] = useState<CoffeeType | null>(null);
  const [size, setSize] = useState<CoffeeSize | null>(null);
  const [origin, setOrigin] = useState<string | null>(null);

  const origins = listCoffeeOrigins(products);
  const selectedCoffee =
    drink !== null && size !== null && origin !== null
      ? findCoffee(products, { type: drink, size, origin })
      : undefined;

  function priceFor(originName: string): string {
    if (drink === null || size === null) {
      return "—";
    }

    const coffee = findCoffee(products, { type: drink, size, origin: originName });

    return coffee === undefined ? "—" : formatPrice(coffee.price);
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
        price: selectedCoffee.price,
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
          {drinks.map((option) => (
            <button
              key={option.type}
              type="button"
              className="coffee-option"
              aria-pressed={drink === option.type}
              onClick={() => setDrink(option.type)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset className="coffee-step">
        <legend className="coffee-step__legend">2 · Tamaño</legend>

        <div className="coffee-options coffee-options--sizes">
          {sizes.map((option) => (
            <button
              key={option}
              type="button"
              className="coffee-option coffee-option--size"
              aria-pressed={size === option}
              onClick={() => setSize(option)}
            >
              {option}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset className="coffee-step">
        <legend className="coffee-step__legend">3 · Origen</legend>

        <div className="coffee-origins">
          {origins.map((option) => (
            <button
              key={option.name}
              type="button"
              className="coffee-origin"
              aria-pressed={origin === option.name}
              onClick={() => setOrigin(option.name)}
            >
              <span className="coffee-origin__header">
                <span className="coffee-origin__name">{option.name}</span>
                <span className="coffee-origin__price">{priceFor(option.name)}</span>
              </span>

              <span className="coffee-origin__description">{option.description}</span>
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
