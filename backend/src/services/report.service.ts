import { products } from "@/data/products";
import { NotFoundError } from "@/errors/AppError";
import { listOrders } from "@/services/order.service";
import { findProductById } from "@/services/product.service";
import type { ProductSales } from "@/types/report";

export function calculateTotalRevenue(): number {
  return listOrders().reduce((total, order) => total + order.calculateTotal(products), 0);
}

export function calculateSalesByProduct(): ProductSales[] {
  const sales = new Map<string, ProductSales>();

  for (const order of listOrders()) {
    for (const item of order.items) {
      const product = findProductById(item.productId);
      if (!product) {
        throw new NotFoundError(`Producto ${item.productId} no encontrado`);
      }

      const quantity = (sales.get(product.id)?.quantity ?? 0) + item.quantity;
      sales.set(product.id, { productId: product.id, name: product.name, quantity });
    }
  }

  return [...sales.values()];
}

export function findBestSellingProduct(): ProductSales | undefined {
  return calculateSalesByProduct().reduce<ProductSales | undefined>(
    (best, current) => (!best || current.quantity > best.quantity ? current : best),
    undefined,
  );
}
