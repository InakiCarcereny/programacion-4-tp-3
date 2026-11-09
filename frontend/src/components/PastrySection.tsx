import { useCart } from "@/context/CartContext";
import type { Product } from "@/types/product";
import { formatPrice } from "@/utils/format-price";

const defaultPastries: Product[] = [
  { id: "Pastry-1", name: "Muffin de chocolate", price: 2500 },
  { id: "Pastry-2", name: "Torta selva negra", price: 4200 },
];

interface PastrySectionProps {
  pastries?: Product[];
}

export function PastrySection({ pastries = defaultPastries }: PastrySectionProps): JSX.Element {
  const { dispatch } = useCart();

  return (
    <section aria-labelledby="pastry-heading" className="pastry-section">
      <h2 id="pastry-heading" className="pastry-heading">
        Pastelería
      </h2>

      <ul className="pastry-list">
        {pastries.map((pastry) => (
          <li key={pastry.id} className="pastry-item">
            <div className="pastry-info">
              <p className="pastry-name">{pastry.name}</p>

              <p className="pastry-price">{formatPrice(pastry.price)}</p>
            </div>

            <button
              type="button"
              className="pastry-add"
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
