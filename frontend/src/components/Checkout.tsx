import { useRef, useState } from "react";
import { CartView } from "@/components/CartView";
import { DoneView } from "@/components/DoneView";
import { useCart } from "@/context/CartContext";
import type { Order } from "@/schemas/orders";
import { ApiError, createOrder, NetworkError } from "@/services/client";
import { toNewOrder } from "@/utils/order";

type CheckoutState =
  | { status: "carrito" }
  | { status: "enviando" }
  | { status: "error"; message: string; retryable: boolean }
  | { status: "confirmado"; order: Order };

function isRetryable(error: unknown): boolean {
  return error instanceof NetworkError || (error instanceof ApiError && error.status >= 500);
}

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
    } catch (error) {
      setState({
        status: "error",
        message: error instanceof Error ? error.message : "No pudimos enviar el pedido",
        retryable: isRetryable(error),
      });
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
      <CartView table={mesa ?? undefined} onBack={onBack} onConfirm={handleConfirm} />

      {state.status === "enviando" && (
        <p role="status" className="text-secondary text-center mt-3 mb-0">
          Enviando pedido…
        </p>
      )}

      {state.status === "error" && (
        <div
          role="alert"
          className="d-flex justify-content-between align-items-center gap-2 border border-danger rounded-1 p-3 mt-3"
        >
          <span className="text-danger">{state.message}</span>

          {state.retryable && (
            <button type="button" className="btn btn-outline-dark btn-sm" onClick={handleConfirm}>
              Reintentar
            </button>
          )}
        </div>
      )}
    </>
  );
}
