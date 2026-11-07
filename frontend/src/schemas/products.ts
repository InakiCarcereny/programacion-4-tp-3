import { z } from "zod";

export const productSchema = z.object({
  id: z.string(),
  name: z.string(),
  basePrice: z.number(),
  finalPrice: z.number(),
});

export const productsSchema = z.array(productSchema);

export type Product = z.infer<typeof productSchema>;
