import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/utils/format-price";

interface CartViewProps {
  onConfirm?: () => void;
  onBack?: () => void;
  mesa?: number;
}

export function CartView({ onConfirm, onBack, mesa }: CartViewProps): JSX.Element {
  const { state, dispatch, subtotal } = useCart();
  const isEmpty = state.items.length === 0;

  return (
    <section className="d-flex flex-column gap-3 flex-grow-1">
      <button
        type="button"
        className="btn btn-link p-0 text-dark text-decoration-none d-inline-flex align-items-center gap-1 align-self-start"
        onClick={onBack}
      >
        ← Volver al menú
      </button>

      <h1 className="font-display fs-1 fw-light mb-2">Tu pedido</h1>

      {isEmpty ? (
        <p className="text-center text-secondary py-4">Tu carrito está vacío</p>
      ) : (
        <ul className="list-unstyled mb-0">
          {state.items.map((item) => (
            <li
              key={item.product.id}
              className="d-flex justify-content-between align-items-start py-3"
            >
              <div className="d-flex flex-column gap-2">
                <span className="fw-semibold">{item.product.name}</span>

                <div className="d-inline-flex align-items-center border rounded-1">
                  <button
                    type="button"
                    className="btn btn-sm border-0 px-2"
                    aria-label={`Disminuir cantidad de ${item.product.name}`}
                    onClick={() =>
                      dispatch({
                        type: "DECREMENT",
                        productId: item.product.id,
                      })
                    }
                  >
                    −
                  </button>

                  <span
                    className="px-2 border-start border-end font-monospace"
                    data-testid={`quantity-${item.product.id}`}
                  >
                    {item.quantity}
                  </span>

                  <button
                    type="button"
                    className="btn btn-sm border-0 px-2"
                    aria-label={`Aumentar cantidad de ${item.product.name}`}
                    onClick={() =>
                      dispatch({
                        type: "INCREMENT",
                        productId: item.product.id,
                      })
                    }
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="d-flex flex-column align-items-end gap-2">
                <span className="font-monospace">
                  {formatPrice(item.product.price * item.quantity)}
                </span>

                <button
                  type="button"
                  className="btn btn-link btn-sm text-success p-0"
                  aria-label={`Eliminar ${item.product.name}`}
                  onClick={() => dispatch({ type: "REMOVE", productId: item.product.id })}
                >
                  Eliminar
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className="d-flex justify-content-between align-items-center pt-2 border-top">
        <span className="fw-semibold">Subtotal</span>

        <span className="fw-semibold font-monospace">{formatPrice(subtotal)}</span>
      </div>

      <p className="text-secondary small mb-0">
        Orientativo. El total final lo confirma la cafetería.
      </p>

      <div className="flex-grow-1" />

      <p className="small mb-0">{mesa ? `Se entrega en la mesa ${mesa}.` : "Retiro en barra."}</p>

      <button
        type="button"
        className="btn btn-success w-100 py-3 rounded-1"
        disabled={isEmpty}
        onClick={onConfirm}
      >
        Confirmar pedido
      </button>
    </section>
  );
}
