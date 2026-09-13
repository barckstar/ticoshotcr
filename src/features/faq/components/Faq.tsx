import { z } from "zod";
import { Seccion } from "@/shared/components/ui/Seccion";
import { BotonEnlace } from "@/shared/components/ui/Boton";
import { IconoWhatsApp } from "@/shared/components/ui/Iconos";
import { enlaceWhatsApp, mensajeConsulta } from "@/shared/config/negocio";
import crudo from "../data/preguntas.json";

/**
 * Preguntas frecuentes.
 *
 * `<details>` NATIVO Y NO UN ACORDEON DE REACT. Tres razones, en orden de
 * importancia:
 *
 *   1. Es cero JavaScript. Un acordeon propio obligaria a que toda la seccion
 *      fuera de cliente para guardar cual esta abierto.
 *   2. Ya viene accesible: el navegador maneja el foco, el teclado y lo
 *      anuncia como desplegable sin que haya que escribir un solo `aria-`.
 *   3. El buscador del navegador (Ctrl+F) encuentra texto dentro de un
 *      <details> cerrado y lo abre solo. Un acordeon de React desmonta el
 *      contenido y ahi no hay nada que encontrar.
 *
 * Este contenido alimenta ademas el JSON-LD de FAQPage: ver shared/lib/jsonLd.
 */
const PreguntaSchema = z.object({
  pregunta: z.string().min(1),
  respuesta: z.string().min(1),
});

export const preguntas = z.array(PreguntaSchema).min(1).parse(crudo);

export function Faq() {
  return (
    <Seccion
      id="preguntas"
      antetitulo="Preguntas"
      titulo="Lo que siempre nos preguntan"
      centrado
    >
      <div className="mx-auto max-w-3xl">
        <ul className="space-y-3">
          {preguntas.map(({ pregunta, respuesta }) => (
            <li key={pregunta}>
              <details className="group rounded-2xl bg-superficie px-6 ring-1 ring-borde">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 text-left font-display text-lg font-semibold text-texto focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-acento">
                  {pregunta}
                  {/* El signo + que se vuelve −. Solo rota: va en GPU. */}
                  <span
                    aria-hidden="true"
                    className="relative size-5 shrink-0 text-acento transition-transform duration-300 group-open:rotate-45"
                  >
                    <span className="absolute left-1/2 top-1/2 h-0.5 w-4 -translate-x-1/2 -translate-y-1/2 bg-current" />
                    <span className="absolute left-1/2 top-1/2 h-4 w-0.5 -translate-x-1/2 -translate-y-1/2 bg-current" />
                  </span>
                </summary>
                <p className="pb-5 leading-relaxed text-texto-suave">
                  {respuesta}
                </p>
              </details>
            </li>
          ))}
        </ul>

        <div className="mt-10 text-center">
          <p className="text-texto-suave">¿Te quedó otra duda?</p>
          <BotonEnlace
            href={enlaceWhatsApp(mensajeConsulta())}
            tamano="lg"
            className="mt-4"
          >
            <IconoWhatsApp className="size-5" />
            Preguntanos
          </BotonEnlace>
        </div>
      </div>
    </Seccion>
  );
}
