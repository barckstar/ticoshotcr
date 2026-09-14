import { z } from "zod";
import { Seccion } from "@/shared/components/ui/Seccion";
import { Logo } from "@/shared/components/ui/Logo";
import { Revelar } from "@/shared/components/ui/Revelar";
import { negocio } from "@/shared/config/negocio";
import crudo from "../data/hitos.json";

/**
 * "Quiénes somos", con la trayectoria dentro como linea de tiempo.
 *
 * TRES SECCIONES EN UNA. El cliente pidio historia, trayectoria y quienes
 * somos por separado. Son la misma informacion contada tres veces y en una
 * pagina unica se leerian como repeticion: el visitante baja, ve tres bloques
 * de texto sobre el mismo negocio y deja de leer en el segundo.
 *
 * EL CAMPO `confirmado` NO ES DECORACION. Lo que todavia no conto el dueno se
 * pinta atenuado y con la etiqueta "Por confirmar" a la vista. Escribir un
 * origen verosimil y dejarlo suelto seria inventarle un pasado a un negocio
 * que existe — la misma regla que se aplico a las resenas. Ademas asi el
 * propio sitio le ensena al cliente que le falta contar.
 */
const HitoSchema = z.object({
  ano: z.string().min(1),
  titulo: z.string().min(1),
  texto: z.string().min(1),
  confirmado: z.boolean(),
});

const hitos = z.array(HitoSchema).min(1).parse(crudo);

export function Historia() {
  const anos = new Date().getFullYear() - negocio.desde;

  return (
    <Seccion id="nosotros" antetitulo="Quiénes somos" titulo="Hecho con amor desde el 2020"
      decorado="nosotros">
      <div className="grid gap-14 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
        <div>
          <p className="text-lg leading-relaxed text-texto">
            {negocio.nombre} nació en {negocio.ciudad}, {negocio.provincia}, y
            hace {anos} años que hace lo mismo: llenar litros de lo que en Costa
            Rica se toma cuando hay algo que celebrar.
          </p>

          <p className="mt-5 leading-relaxed text-texto-suave">
            No hay planta ni receta industrial. Hay tres recetas que se afinaron
            a punta de repetirlas, botella de litro, y una etiqueta que dice 100%
            artesanal porque es exactamente lo que es.
          </p>

          <p className="mt-5 leading-relaxed text-texto-suave">
            Tampoco hay local. Se trabaja por encargo y se entrega, que para
            fiestas, playa y eventos resulta ser justo lo que la gente necesita.
          </p>

          {/* El emblema grande, como firma del bloque. Decorativo: el nombre
              ya esta escrito arriba y repetirlo seria ruido para un lector
              de pantalla. */}
          <Logo className="mt-10 h-28 w-auto text-acento/20" titulo={null} />
        </div>

        {/* LA TRAYECTORIA. La linea vertical es un pseudo-borde del <ol>, no
            un div por hito: asi es una sola linea continua y no se parte
            entre elementos. */}
        <ol className="relative space-y-9 border-l-2 border-borde pl-8">
          {hitos.map((hito) => (
            <li key={hito.titulo} className="relative">
              <Revelar direccion="derecha">
                <span
                  aria-hidden="true"
                  className={`absolute -left-[2.4rem] top-1.5 size-4 rounded-full ring-4 ring-crema ${
                    hito.confirmado ? "bg-acento" : "bg-borde"
                  }`}
                />

                <p className="font-display text-sm font-bold uppercase tracking-[0.2em] text-acento">
                  {hito.ano}
                </p>

                <h3
                  className={`mt-1 font-display text-xl font-bold uppercase tracking-tight ${
                    hito.confirmado ? "text-texto" : "text-texto-suave"
                  }`}
                >
                  {hito.titulo}
                </h3>

                <p className="mt-2 leading-relaxed text-texto-suave">
                  {hito.texto}
                </p>

                {!hito.confirmado && (
                  <p className="mt-2.5 inline-block rounded-full bg-superficie-alt px-3 py-1 text-xs font-semibold uppercase tracking-wide text-texto-suave">
                    Por confirmar con el cliente
                  </p>
                )}
              </Revelar>
            </li>
          ))}
        </ol>
      </div>
    </Seccion>
  );
}
