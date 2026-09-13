import { Tarjeta } from "@/shared/components/ui/Tarjeta";
import type { Servicio } from "../lib/servicio";

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
 * RECIBE LOS DATOS YA VALIDADOS, no los parsea. El esquema de Zod vive en
 * `../lib/servicio.ts` y lo ejecuta `app/page.tsx`, que es de servidor: este
 * componente lo importa `Eventos.tsx`, que lleva "use client", y todo lo que
 * importa un componente de cliente se vuelve codigo de cliente. Teniendo el
 * parseo aqui, Zod entero bajaba al navegador para validar tres parrafos.
 */
export function ServicioBarra({ servicio }: { servicio: Servicio[] }) {
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
