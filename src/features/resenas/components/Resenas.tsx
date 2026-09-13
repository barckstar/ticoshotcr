import { z } from "zod";
import { Seccion } from "@/shared/components/ui/Seccion";
import { Tarjeta } from "@/shared/components/ui/Tarjeta";
import { RevelarCascada, ItemCascada } from "@/shared/components/ui/Revelar";
import { negocio } from "@/shared/config/negocio";
import crudo from "../data/resenas.json";

/**
 * Reseñas.
 *
 * ================== LA REGLA DE ESTE ARCHIVO ==================
 * TICOSHOT EXISTE Y ESTAS RESEÑAS LAS VAN A LEER CLIENTES DE VERDAD decidiendo
 * si compran. Un testimonio inventado con nombre verosimil no es relleno de
 * diseño: es publicidad engañosa —lo que persigue la Ley 7472 del consumidor
 * en Costa Rica— y quien responde por ella es la marca del cliente, no quien
 * hizo la pagina.
 *
 * El material real existe y es gratis: los comentarios de sus propios posts de
 * Facebook e Instagram, y las capturas de WhatsApp que el dueño ya tiene. Se
 * transcriben LITERALES, con el nombre de pila y la plataforma.
 *
 * Mientras tanto quedan estos marcadores, que dicen en su propio texto que son
 * marcadores. Se ven asi A PROPOSITO: una reseña de relleno bien escrita se
 * publica por descuido, una que se anuncia como pendiente no.
 * ==============================================================
 */
const ResenaSchema = z.object({
  autor: z.string().min(1),
  /**
   * De donde salio. `pendiente` es el unico valor que pinta el aviso; los
   * otros son fuentes reales. Es un enum y no texto libre para que no se pueda
   * colar una fuente inventada escribiendo cualquier cosa.
   */
  fuente: z.enum(["instagram", "facebook", "whatsapp", "google", "pendiente"]),
  texto: z.string().min(1),
});

const resenas = z.array(ResenaSchema).min(1).parse(crudo);

const etiquetaFuente: Record<string, string> = {
  instagram: "Comentario en Instagram",
  facebook: "Comentario en Facebook",
  whatsapp: "Mensaje de WhatsApp",
  google: "Reseña en Google",
  pendiente: "Marcador — falta la reseña real",
};

/** Las estrellas solo se pintan cuando la reseña es real. */
function Estrellas() {
  return (
    <div className="flex gap-1" aria-label="5 de 5">
      {[0, 1, 2, 3, 4].map((i) => (
        <svg key={i} viewBox="0 0 20 20" className="size-4 fill-acento" aria-hidden="true">
          <path d="M10 1l2.6 5.3 5.9.9-4.3 4.1 1 5.8L10 14.4 4.8 17.1l1-5.8L1.5 7.2l5.9-.9z" />
        </svg>
      ))}
    </div>
  );
}

export function Resenas() {
  const todasPendientes = resenas.every((r) => r.fuente === "pendiente");

  return (
    <Seccion
      id="resenas"
      antetitulo="Lo que dicen"
      titulo="Reseñas de quienes ya lo probaron"
      centrado
      className="bg-superficie-alt"
    >
      {todasPendientes && (
        <div className="mx-auto mb-10 max-w-2xl rounded-2xl border-2 border-dashed border-acento/40 bg-crema p-6 text-center">
          <p className="font-display text-sm font-bold uppercase tracking-[0.15em] text-acento">
            Sección pendiente — no publicar así
          </p>
          <p className="mt-3 text-sm leading-relaxed text-texto-suave">
            Aquí van comentarios <strong>reales</strong>, transcritos de los
            posts de {negocio.instagramHandle}, de Facebook o de capturas de
            WhatsApp. No se inventan: {negocio.nombre} es un negocio de verdad y
            un testimonio falso lo firma su marca.
          </p>
        </div>
      )}

      <RevelarCascada className="grid gap-7 lg:grid-cols-3">
        {resenas.map((r, i) => {
          const pendiente = r.fuente === "pendiente";

          return (
            <ItemCascada key={`${r.autor}-${i}`}>
              <Tarjeta
                /* El marcador va sobre el crema del fondo y con borde de
                   trazos: tiene que verse que es un hueco por llenar, no una
                   tarjeta terminada. */
                fondo={
                  pendiente
                    ? "bg-crema ring-borde"
                    : "bg-superficie ring-borde"
                }
                className={`flex h-full flex-col p-7 ${
                  pendiente ? "border-2 border-dashed border-borde" : ""
                }`}
              >
                {!pendiente && <Estrellas />}

                <blockquote className={`flex-1 ${pendiente ? "" : "mt-4"}`}>
                  <p
                    className={`leading-relaxed ${
                      pendiente ? "italic text-texto-suave" : "text-texto"
                    }`}
                  >
                    {pendiente ? r.texto : `«${r.texto}»`}
                  </p>
                </blockquote>

                <footer className="mt-6 border-t border-borde pt-4">
                  <p className="font-display text-sm font-bold uppercase tracking-wide text-texto">
                    {r.autor}
                  </p>
                  <p className="mt-0.5 text-xs font-medium text-texto-suave">
                    {etiquetaFuente[r.fuente]}
                  </p>
                </footer>
              </Tarjeta>
            </ItemCascada>
          );
        })}
      </RevelarCascada>
    </Seccion>
  );
}
