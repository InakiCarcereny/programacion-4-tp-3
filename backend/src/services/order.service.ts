import { nextOrderId, orders } from "@/data/orders";
import { products } from "@/data/products";
import { isValidTable } from "@/data/tables";
import { NotFoundError } from "@/errors/AppError";
import { Order } from "@/models/Order";
import type { OrderItem } from "@/types/order";

const PREPARING_DELAY_MS = 8_000;
const DELIVERED_DELAY_MS = 16_000;

export function createOrder(items: OrderItem[], mesaId: number | null = null): Order {
  if (mesaId !== null && !isValidTable(mesaId)) {
    throw new NotFoundError(`Mesa ${mesaId} no encontrada`);
  }

  for (const item of items) {
    if (!products.some((product) => product.id === item.productId)) {
      throw new NotFoundError(`Producto ${item.productId} no encontrado`);
    }
  }

  const order = new Order(nextOrderId(), items, mesaId);
  orders.push(order);

  setTimeout(() => {
    order.status = "preparing";
  }, PREPARING_DELAY_MS);

  setTimeout(() => {
    order.status = "delivered";
  }, DELIVERED_DELAY_MS);

  return order;
}

export function listOrders(): Order[] {
  return orders;
}

export function findOrderById(id: string): Order | undefined {
  return orders.find((order) => order.id === id);
}
