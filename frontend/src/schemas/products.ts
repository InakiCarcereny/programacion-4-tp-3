import { z } from "zod";

export const productoSchema = z.object({
  id: z.string(),
  name: z.string(),
  basePrice: z.number(),
  finalPrice: z.number(),
});

export const productosSchema = z.array(productoSchema);

export type Producto = z.infer<typeof productoSchema>;
