import { z } from "zod";
import crudo from "../data/kits.json";

/**
 * Los kits: combinaciones de litros con un nombre.
 *
 * Un kit NO guarda su propio precio. El precio de un kit es la suma de sus
 * litros, y en cuanto se guardara aparte tendria que mantenerse sincronizado
 * a mano con el catalogo: el dia que suba el chiliguaro, el kit se queda con
 * el precio viejo y nadie lo nota hasta que un cliente reclama.
 *
 * El descuento por combo todavia no esta confirmado por el cliente. Cuando lo
 * este se agrega aqui como un porcentaje y se aplica sobre la suma, que sigue
 * siendo un calculo y no un numero copiado.
 */
const KitSchema = z.object({
  id: z.string().min(1),
  nombre: z.string().min(1),
  /** La linea corta que va bajo el nombre. */
  gancho: z.string().min(1),
  descripcion: z.string().min(1),
  /** Ids de `productos.json`. Se comprueba que existan al cargar. */
  productos: z.array(z.string().min(1)).min(2),
  /** Cuanta gente cubre. Estimacion, no promesa. */
  para: z.string().min(1),
});

export type Kit = z.infer<typeof KitSchema>;

const ListaSchema = z
  .array(KitSchema)
  .min(1)
  .refine((lista) => new Set(lista.map((k) => k.id)).size === lista.length, {
    message: "Hay ids de kit repetidos en kits.json",
  });

export const kits: Kit[] = ListaSchema.parse(crudo);

/**
 * Comprueba que todo producto citado por un kit exista de verdad.
 *
 * Se llama desde `app/page.tsx`, que es quien tiene las dos listas delante:
 * `kits` no puede importar los productos por su cuenta sin que una feature
 * dependa de otra. Y no puede ser solo un comentario de buena fe — un id mal
 * escrito aqui deja un kit que agrega dos litros en vez de tres, en silencio.
 *
 * Corre durante `next build`, asi que rompe la compilacion y no la pagina.
 */
export function verificarKits(idsDeProductos: string[]): void {
  const validos = new Set(idsDeProductos);
  for (const kit of kits) {
    for (const id of kit.productos) {
      if (!validos.has(id)) {
        throw new Error(
          `El kit "${kit.id}" cita el producto "${id}", que no existe en productos.json`,
        );
      }
    }
  }
}
