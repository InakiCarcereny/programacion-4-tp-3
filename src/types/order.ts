export type OrderStatus = "pending" | "preparing" | "delivered";

export interface OrderItem {
  productId: string;
  quantity: number;
}

export interface Order {
  id: string;
  items: OrderItem[];
  status: OrderStatus;
  total: number;
}
