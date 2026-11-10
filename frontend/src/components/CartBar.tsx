import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/utils/format-price";

interface CartBarProps {
  onViewCart?: () => void;
}

export function CartBar({ onViewCart }: CartBarProps): JSX.Element {
  const { state, subtotal } = useCart();
  const itemCount = state.items.reduce((total, item) => total + item.quantity, 0);

  return (
    <button
      type="button"
      className="btn btn-primary w-100 d-flex justify-content-between align-items-center py-3 rounded-1"
      onClick={onViewCart}
    >
      <span>Ver pedido ({itemCount})</span>
      <span className="font-monospace">{formatPrice(subtotal)}</span>
    </button>
  );
}
