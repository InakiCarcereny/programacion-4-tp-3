import { Order } from "@/models/Order";

export const orders: Order[] = [];

let counter = 0;

export function nextOrderId(): string {
  counter += 1;
  return `Order-${counter}`;
}

export function resetOrders(): void {
  orders.length = 0;
  counter = 0;
}
