import { z } from "zod";
import { Seccion } from "@/shared/components/ui/Seccion";
import { Tarjeta } from "@/shared/components/ui/Tarjeta";
import { RevelarCascada, ItemCascada } from "@/shared/components/ui/Revelar";
import { ColorProducto } from "@/shared/types/producto";
import crudo from "../data/rituales.json";

/**
 * "Cómo se toma". El ritual de servicio de cada litro.
 *
 * ES LA SECCION QUE HACE QUE EL SITIO SE VEA CARO, y no cuesta una foto ni una
 * animacion: cuesta saber del producto. Cualquiera puede poner tres botellas
 * en una cuadricula; contar que el chiliguaro se sirve casi congelado y que
 * ponerle hielo arruina el picante es lo que separa una tienda de una marca.
 *
 * El campo `error` existe por eso. Decir lo que NO hay que hacer da mas
 * autoridad que cualquier adjetivo, y ademas es lo que la gente recuerda.
 */
const RitualSchema = z.object({
  /* Se valida contra el enum de colores de producto —los mismos tres ids— para
     que un ritual no pueda quedar huerfano si un dia cambia un producto. */
  producto: ColorProducto,
  titulo: z.string().min(1),
  temperatura: z.string().min(1),
  vaso: z.string().min(1),
  pasos: z.array(z.string().min(1)).min(2),
  error: z.string().min(1),
});

const rituales = z.array(RitualSchema).length(3).parse(crudo);

const filete: Record<z.infer<typeof ColorProducto>, string> = {
  chiliguaro: "bg-chiliguaro",
  miguelito: "bg-miguelito",
  sangria: "bg-sangria",
};

export function Ritual() {
  return (
    <Seccion
      id="ritual"
      antetitulo="El ritual"
      titulo="Cómo se toma cada uno"
      decorado="ritual"
      centrado
    >
      <RevelarCascada className="grid gap-7 lg:grid-cols-3">
        {rituales.map((r) => (
          <ItemCascada key={r.producto}>
            <Tarjeta className="flex h-full flex-col">
              <div className={`h-1.5 w-full ${filete[r.producto]}`} />

              <div className="flex flex-1 flex-col p-7">
                <h3 className="font-display text-2xl font-bold uppercase tracking-tight text-texto">
                  {r.titulo}
                </h3>

                <dl className="mt-4 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1.5 text-sm">
                  <dt className="font-semibold text-texto-suave">Temperatura</dt>
                  <dd className="text-texto">{r.temperatura}</dd>
                  <dt className="font-semibold text-texto-suave">Vaso</dt>
                  <dd className="text-texto">{r.vaso}</dd>
                </dl>

                {/* <ol> y no <ul>: son pasos en orden, y el orden importa
                    —el limón se muerde después—. El numero lo pinta el
                    contador de CSS para poder darle el estilo del acento. */}
                <ol className="mt-6 space-y-3">
                  {r.pasos.map((paso, i) => (
                    <li key={paso} className="flex gap-3 text-sm leading-relaxed text-texto">
                      <span
                        aria-hidden="true"
                        className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-acento font-display text-xs font-bold text-white"
                      >
                        {i + 1}
                      </span>
                      {paso}
                    </li>
                  ))}
                </ol>

                <p className="mt-auto pt-6 text-sm leading-relaxed text-texto-suave">
                  <strong className="font-display uppercase tracking-wide text-acento">
                    El error típico:{" "}
                  </strong>
                  {r.error}
                </p>
              </div>
            </Tarjeta>
          </ItemCascada>
        ))}
      </RevelarCascada>
    </Seccion>
  );
}
