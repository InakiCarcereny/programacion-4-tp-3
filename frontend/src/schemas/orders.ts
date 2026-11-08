import { z } from "zod";

export const orderItemSchema = z.object({
  productId: z.string(),
  quantity: z.number().int().positive(),
});

export const orderStatusSchema = z.enum(["pending", "preparing", "delivered"]);

export const orderSchema = z.object({
  id: z.string(),
  mesaId: z.number().int().positive().nullable().optional(),
  items: z.array(orderItemSchema),
  status: orderStatusSchema,
  total: z.number(),
});

export type OrderItem = z.infer<typeof orderItemSchema>;
export type OrderStatus = z.infer<typeof orderStatusSchema>;
export type Order = z.infer<typeof orderSchema>;

export interface NewOrder {
  mesaId: number | null;
  items: OrderItem[];
}
