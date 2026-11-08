import type { Order } from "@/schemas/orders";
import { formatPrice } from "@/utils/format-price";
import { formatOrderStatus } from "@/utils/order";

interface DoneViewProps {
  order: Order;
}

export function DoneView({ order }: DoneViewProps): JSX.Element {
  return (
    <section aria-labelledby="done-heading" className="d-flex flex-column gap-3 flex-grow-1">
      <h1 id="done-heading" className="font-display fs-1 fw-light mb-0">
        Pedido confirmado
      </h1>

      <p className="text-secondary mb-0">
        {order.mesaId ? `Te lo llevamos a la mesa ${order.mesaId}.` : "Retiralo en la barra."}
      </p>

      <dl className="mb-0 border-top">
        <div className="d-flex justify-content-between py-3 border-bottom">
          <dt className="fw-normal text-secondary">Número de pedido</dt>
          <dd className="mb-0 fw-semibold font-monospace">{order.id}</dd>
        </div>

        <div className="d-flex justify-content-between py-3 border-bottom">
          <dt className="fw-normal text-secondary">Estado</dt>
          <dd className="mb-0 fw-semibold">{formatOrderStatus(order.status)}</dd>
        </div>

        <div className="d-flex justify-content-between py-3 border-bottom">
          <dt className="fw-normal text-secondary">Total</dt>
          <dd className="mb-0 fw-semibold font-monospace">{formatPrice(order.total)}</dd>
        </div>
      </dl>
    </section>
  );
}
