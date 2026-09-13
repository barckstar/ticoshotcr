import { z } from "zod";

/**
 * Los tres litros de Ticoshot.
 *
 * El esquema vive aqui, en `shared/`, y no en una feature: lo necesitan
 * `catalogo`, `kits`, `hero` y `carrito`. Meterlo en `features/catalogo/`
 * obligaria a las otras tres a importar de una feature ajena, que es
 * justo lo que la arquitectura prohibe.
 */

/**
 * Color de la etiqueta del producto.
 *
 * DECORATIVO. Identifica el producto en un filete, un punto o un badge, y
 * nunca es fondo de seccion ni lleva texto encima. Es la unica forma de usar
 * los tres colores de etiqueta sin romper el reparto 70/30/10: el acento del
 * sitio sigue siendo uno solo, el rojo del logo.
 */
export const ColorProducto = z.enum(["chiliguaro", "miguelito", "sangria"]);
export type ColorProducto = z.infer<typeof ColorProducto>;

export const ProductoSchema = z.object({
  id: z.string().min(1),
  nombre: z.string().min(1),
  /** Una linea. Es lo que se lee bajo el nombre en la tarjeta. */
  resumen: z.string().min(1),
  /** El parrafo largo, para la hoja de detalle. */
  descripcion: z.string().min(1),
  /** Ingredientes visibles. No es la receta: es lo que se puede contar. */
  notas: z.array(z.string().min(1)).min(1),
  color: ColorProducto,

  /**
   * Precio en colones, o `null` mientras el cliente no lo confirme.
   *
   * NULL Y NO UN NUMERO DE RELLENO. Un precio inventado se ve exactamente
   * igual que uno real: nadie nota que hay que cambiarlo, y el dia que el
   * sitio se publique el cliente estara vendiendo a un precio que no es suyo.
   * Con `null` el tipo OBLIGA a cada consumidor a decidir que hace sin precio
   * —la tarjeta escribe "Consultar", el carrito no suma, el mensaje de
   * WhatsApp dice "a confirmar"— y es imposible que se publique un numero
   * falso por descuido.
   *
   * `int()` y no `number()`: un precio con decimales en colones no existe, y
   * 8500.5 arrastraria el error hasta el total del pedido.
   */
  precio: z.int().positive().nullable(),

  /** Presentacion. Hoy todo es de litro; el medio litro esta sin confirmar. */
  litros: z.number().positive(),

  disponible: z.boolean(),

  /**
   * Foto del producto. `null` mientras el cliente no mande las originales:
   * la tarjeta dibuja entonces una botella en SVG con el color de la etiqueta.
   *
   * No se pone una foto bajada de Instagram como si fuera la definitiva.
   * Recomprimida y recortada se ve peor que el SVG, y ademas nadie se acuerda
   * despues de cual habia que reemplazar.
   */
  imagen: z
    .object({
      src: z.string().startsWith("/"),
      alt: z.string().min(1),
      ancho: z.int().positive(),
      alto: z.int().positive(),
    })
    .nullable(),
});

export type Producto = z.infer<typeof ProductoSchema>;
