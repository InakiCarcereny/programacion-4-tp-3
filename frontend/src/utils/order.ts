import type { NewOrder, OrderStatus } from "@/schemas/orders";
import type { CartState } from "@/types/cart";

const statusLabels: Record<OrderStatus, string> = {
  pending: "Pendiente",
  preparing: "En preparación",
  delivered: "Entregado",
};

export function formatOrderStatus(status: OrderStatus): string {
  return statusLabels[status];
}

export function toNewOrder(cart: CartState, mesaId: number | null): NewOrder {
  return {
    mesaId,
    items: cart.items.map((item) => ({
      productId: String(item.product.id),
      quantity: item.quantity,
    })),
  };
}
