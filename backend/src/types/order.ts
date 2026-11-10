export type OrderStatus = "pending" | "preparing" | "delivered";

export interface OrderItem {
  productId: number;
  quantity: number;
}

export interface Order {
  id: string;
  mesaId?: number | null;
  items: OrderItem[];
  status: OrderStatus;
  total: number;
}
