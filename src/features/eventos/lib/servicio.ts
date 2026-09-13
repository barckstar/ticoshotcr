import { z } from "zod";
import crudo from "../data/servicio.json";

/**
 * Lo que se ofrece en un evento: los tres bloques del servicio de barra.
 *
 * ============ POR QUE EL PARSEO VIVE AQUI Y NO EN EL COMPONENTE ============
 * Estaba dentro de `ServicioBarra.tsx`, que no lleva "use client"... pero lo
 * importa `Eventos.tsx`, que si. Y EN REACT ESO BASTA: todo lo que importa un
 * componente de cliente se vuelve codigo de cliente, en cascada. Zod entero
 * viajaba al navegador para validar tres parrafos que nunca cambian.
 *
 * Eran 91 KB comprimidos en la carga inicial y no lo delataba nada: ni el
 * build, ni el lint, ni los tipos. Se vio midiendo los chunks.
 *
 * Ahora el parseo lo hace `app/page.tsx`, que es de servidor, y los datos
 * bajan por props ya validados. Zod se queda del lado del build.
 *
 * REGLA GENERAL: un esquema de Zod nunca debe ser alcanzable desde un
 * componente de cliente, salvo que valide un FORMULARIO — que es el unico caso
 * donde de verdad hace falta en el navegador. Ver `features/checkout/schema.ts`.
 * ==========================================================================
 */
const ServicioSchema = z.object({
  titulo: z.string().min(1),
  texto: z.string().min(1),
});

export type Servicio = z.infer<typeof ServicioSchema>;

export const servicio: Servicio[] = z.array(ServicioSchema).min(1).parse(crudo);
