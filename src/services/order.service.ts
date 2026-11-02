import { nextOrderId, orders } from "@/data/orders";
import { products } from "@/data/products";
import { NotFoundError } from "@/errors/AppError";
import { Order } from "@/models/Order";
import type { OrderItem } from "@/types/order";

export function createOrder(items: OrderItem[]): Order {
  for (const item of items) {
    if (!products.some((product) => product.id === item.productId)) {
      throw new NotFoundError(`Producto ${item.productId} no encontrado`);
    }
  }
  const order = new Order(nextOrderId(), items);
  orders.push(order);
  return order;
}

export function listOrders(): Order[] {
  return orders;
}

export function findOrderById(id: string): Order | undefined {
  return orders.find((order) => order.id === id);
}
