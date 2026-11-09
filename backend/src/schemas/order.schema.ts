import { z } from "zod";

export const createOrderSchema = z.object({
  mesaId: z.number().int().positive().optional(),
  items: z
    .array(
      z.object({
        productId: z.number().int().positive(),
        quantity: z.number().int().positive(),
      }),
    )
    .min(1),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
