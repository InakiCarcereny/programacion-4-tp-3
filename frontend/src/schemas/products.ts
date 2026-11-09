import { z } from "zod";

export const varietySchema = z.object({
  name: z.string(),
  description: z.string(),
});

const productBase = {
  id: z.number().int(),
  name: z.string(),
  price: z.number(),
};

export const espressoSchema = z.object({
  ...productBase,
  type: z.literal("expreso"),
  size: z.string(),
  grams: z.number(),
  variety: varietySchema,
});

export const filteredSchema = z.object({
  ...productBase,
  type: z.literal("filtrado"),
  size: z.string(),
  grams: z.number(),
  variety: varietySchema,
});

export const pastrySchema = z.object({
  ...productBase,
  type: z.literal("pasteleria"),
});

export const productSchema = z.discriminatedUnion("type", [
  espressoSchema,
  filteredSchema,
  pastrySchema,
]);

export const productsSchema = z.array(productSchema);

export type Product = z.infer<typeof productSchema>;
