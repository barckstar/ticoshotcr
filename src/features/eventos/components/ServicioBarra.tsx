import { z } from "zod";
import { Tarjeta } from "@/shared/components/ui/Tarjeta";
import crudo from "../data/servicio.json";

/**
 * Lo que de verdad se ofrece en un evento.
 *
 * ESTA SECCION NO ES "TE VENDEMOS LITROS". El dueno de Ticoshot es bartender
 * con mas de cinco anos de barra, asi que un evento no se limita a sus tres
 * productos: monta la barra completa, y con los contactos del gremio consigue
 * el guaro y los licores mas baratos de lo que costarian comprandolos por
 * cuenta propia.
 *
 * Eso cambia por completo lo que vale la seccion. Antes decia "surtimos tu
 * fiesta con nuestros litros", que compite contra ir al supermercado. Ahora
 * dice "ponemos la barra y ademas el licor te sale mas barato", que no compite
 * con nadie.
 *
 * Va ARRIBA del cotizador a proposito: el cotizador habla solo de los litros
 * de la casa, y sin este bloque delante alguien podria leer que el servicio se
 * acaba ahi.
 */
const ServicioSchema = z.object({
  titulo: z.string().min(1),
  texto: z.string().min(1),
});

const servicio = z.array(ServicioSchema).min(1).parse(crudo);

export function ServicioBarra() {
  return (
    <div className="mb-14 grid gap-6 lg:grid-cols-3">
      {servicio.map(({ titulo, texto }) => (
        <Tarjeta key={titulo} className="p-7">
          <h3 className="font-display text-xl font-bold uppercase tracking-tight text-texto">
            {titulo}
          </h3>
          <p className="mt-3 leading-relaxed text-texto-suave">{texto}</p>
        </Tarjeta>
      ))}
    </div>
  );
}
