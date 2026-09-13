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

/**
 * Una foto ya optimizada, de las que produce `scripts/optimizar-fotos.py`.
 *
 * `ancho` y `alto` son OBLIGATORIOS y no un extra: sin ellos el navegador no
 * sabe cuanto espacio reservar, la pagina da un salto cuando la foto termina
 * de cargar, y eso es exactamente lo que Lighthouse mide como CLS.
 */
const FotoSchema = z.object({
  src: z.string().startsWith("/"),
  alt: z.string().min(1),
  ancho: z.int().positive(),
  alto: z.int().positive(),
});

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
   * Las fotos del producto, en sus DOS recortes.
   *
   * Son las fotos propias de Ticoshot, las mismas de sus publicaciones: el
   * fondo coral pintado a mano es parte de su identidad, no un fondo de
   * relleno. Los recortes los produce `scripts/optimizar-fotos.py` a partir de
   * los originales de `research/assets/`, que no se versionan.
   *
   * DOS RECORTES Y NO UNO, porque un solo archivo no sirve para los dos usos:
   *
   *   `vertical` (4:5)  La foto completa del post. Tarjeta del catalogo y
   *                     banda del hero, donde hay alto de sobra.
   *   `cuadrada` (1:1)  Recorte anclado abajo, centrado en la etiqueta.
   *                     Miniatura del carrito y tarjetas de kits. Encajar la
   *                     vertical en un hueco cuadrado con `object-cover`
   *                     recorta por el CENTRO y parte la etiqueta en dos.
   *
   * `null` deja que la tarjeta dibuje la botella en SVG (ver `Botella.tsx`).
   * Sigue siendo el respaldo para cualquier sabor nuevo que aun no tenga foto.
   */
  imagen: z
    .object({
      vertical: FotoSchema,
      cuadrada: FotoSchema,
    })
    .nullable(),

  /**
   * Aviso de conservacion, si el producto lo necesita. `null` si no.
   *
   * VA EN LA TARJETA Y EN EL CARRITO, no escondido en las preguntas
   * frecuentes. El Miguelito lleva leche condensada y necesita refrigeracion:
   * quien lo compra tiene que saberlo ANTES de meterlo en el carro y dejarlo
   * al sol, no despues de que se le eche a perder.
   */
  advertencia: z.string().min(1).nullable(),
});

export type Producto = z.infer<typeof ProductoSchema>;
