import { z } from "zod";

export const coffeeSizeSchema = z.enum(["Pocillo", "Mediano", "Taza grande"]);

export const coffeeVarietySchema = z.enum(["Brasil", "Colombia", "Etiopia"]);

export const variedadSchema = z.object({
  nombre: coffeeVarietySchema,
  descripcion: z.string(),
});

const baseProductoSchema = z.object({
  id: z.string(),
  name: z.string(),
  basePrice: z.number(),
  finalPrice: z.number(),
});

const cafeSchema = baseProductoSchema.extend({
  tipo: z.enum(["expreso", "filtrado"]),
  tamanio: coffeeSizeSchema,
  gramosCafe: z.number(),
  variedad: variedadSchema,
});

const pasteleriaSchema = baseProductoSchema.extend({
  tipo: z.literal("pasteleria"),
});

export const productoSchema = z.union([cafeSchema, pasteleriaSchema]);

export const productosSchema = z.array(productoSchema);

export type Producto = z.infer<typeof productoSchema>;
export type Cafe = z.infer<typeof cafeSchema>;
export type Pasteleria = z.infer<typeof pasteleriaSchema>;
export type CoffeeSize = z.infer<typeof coffeeSizeSchema>;
export type CoffeeVariety = z.infer<typeof coffeeVarietySchema>;
