import { useCart } from "@/context/CartContext";
import type { CartProduct } from "@/types/cart";
import { formatPrice } from "@/utils/format-price";

const defaultPastries: CartProduct[] = [
  { id: 19, name: "Muffin de chocolate", price: 2500 },
  { id: 20, name: "Torta selva negra", price: 4200 },
];

interface PastrySectionProps {
  pastries?: CartProduct[];
}

export function PastrySection({ pastries = defaultPastries }: PastrySectionProps): JSX.Element {
  const { dispatch } = useCart();

  return (
    <section aria-labelledby="pastry-heading" className="d-flex flex-column gap-2">
      <h2 id="pastry-heading" className="fs-2 fw-light mb-0 font-display">
        Pastelería
      </h2>

      <ul className="list-unstyled mb-0">
        {pastries.map((pastry) => (
          <li
            key={pastry.id}
            className="d-flex justify-content-between align-items-center py-3 border-bottom"
          >
            <div>
              <p className="fw-semibold mb-0">{pastry.name}</p>

              <p className="text-success mb-0">{formatPrice(pastry.price)}</p>
            </div>

            <button
              type="button"
              className="btn btn-outline-dark rounded-1"
              aria-label={`Agregar ${pastry.name}`}
              onClick={() => dispatch({ type: "ADD", product: pastry })}
            >
              Agregar
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
