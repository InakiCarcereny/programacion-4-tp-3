import { useRef, useState } from "react";
import { CartView } from "@/components/CartView";
import { DoneView } from "@/components/DoneView";
import { useCart } from "@/context/CartContext";
import type { Order } from "@/schemas/orders";
import { createOrder } from "@/services/client";
import { toNewOrder } from "@/utils/order";

type CheckoutState =
  | { status: "carrito" }
  | { status: "enviando" }
  | { status: "confirmado"; order: Order };

interface CheckoutProps {
  mesa: number | null;
  onBack?: () => void;
}

export function Checkout({ mesa, onBack }: CheckoutProps): JSX.Element {
  const { state: cart, dispatch } = useCart();
  const [state, setState] = useState<CheckoutState>({ status: "carrito" });
  const sending = useRef(false);

  const confirm = async (): Promise<void> => {
    if (sending.current) {
      return;
    }

    sending.current = true;
    setState({ status: "enviando" });

    try {
      const order = await createOrder(toNewOrder(cart, mesa));
      dispatch({ type: "CLEAR" });
      setState({ status: "confirmado", order });
    } finally {
      sending.current = false;
    }
  };

  const handleConfirm = (): void => {
    void confirm();
  };

  if (state.status === "confirmado") {
    return <DoneView order={state.order} />;
  }

  return (
    <>
      <CartView mesa={mesa ?? undefined} onBack={onBack} onConfirm={handleConfirm} />

      {state.status === "enviando" && (
        <p role="status" className="text-secondary text-center mt-3 mb-0">
          Enviando pedido…
        </p>
      )}
    </>
  );
}
