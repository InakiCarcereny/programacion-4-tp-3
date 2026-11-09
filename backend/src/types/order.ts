export type OrderStatus = "pending" | "preparing" | "delivered";

export interface OrderItem {
  productId: number;
  quantity: number;
}

export interface Order {
  id: string;
  mesaId?: number;
  items: OrderItem[];
  status: OrderStatus;
  total: number;
}
