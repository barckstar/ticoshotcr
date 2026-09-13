import { z } from "zod";
import { ProductoSchema, type Producto } from "@/shared/types/producto";
import crudo from "./productos.json";

/**
 * Los productos, validados AL IMPORTAR EL MODULO — o sea durante `next build`.
 *
 * Un precio escrito como texto, un id repetido o un color que no existe
 * rompen la compilacion, que es donde uno quiere enterarse. La alternativa es
 * enterarse con el catalogo en blanco en el telefono de un cliente.
 */
const ListaSchema = z
  .array(ProductoSchema)
  .min(1)
  .refine(
    (lista) => new Set(lista.map((p) => p.id)).size === lista.length,
    // Dos ids iguales rompen el carrito en silencio: `find` por id devuelve
    // siempre el primero y el segundo producto es inalcanzable.
    { message: "Hay ids de producto repetidos en productos.json" },
  );

export const productos: Producto[] = ListaSchema.parse(crudo);

export const idsDeProductos: string[] = productos.map((p) => p.id);

export function productoPorId(id: string): Producto | undefined {
  return productos.find((p) => p.id === id);
}

/**
 * `true` solo cuando TODOS los productos tienen precio.
 *
 * Mientras sea falso el sitio no escribe ningun numero: las tarjetas dicen
 * "Consultar", el carrito no suma un total y el mensaje de WhatsApp sale con
 * los precios a confirmar. Es una condicion calculada y no una bandera a mano
 * para que no se pueda quedar encendida por descuido.
 */
export const hayPrecios: boolean = productos.every((p) => p.precio !== null);
