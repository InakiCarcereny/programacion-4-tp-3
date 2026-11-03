import type { Product } from "@/models/Product";
import type { Order as IOrder, OrderItem, OrderStatus } from "@/types/order";

export class Order {
  constructor(
    public readonly id: string,
    public readonly items: OrderItem[],
    public readonly status: OrderStatus = "pending",
  ) {}

  public calculateTotal(products: Product[]): number {
    return this.items.reduce((total, item) => {
      const product = products.find((p) => p.id === item.productId);
      if (!product) {
        throw new Error(`Producto ${item.productId} no encontrado`);
      }
      return total + product.calculatePrice() * item.quantity;
    }, 0);
  }

  public toJSON(products: Product[]): IOrder {
    return {
      id: this.id,
      items: this.items,
      status: this.status,
      total: this.calculateTotal(products),
    };
  }
}
