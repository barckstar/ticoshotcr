import type { ReactNode } from "react";
import { Contenedor } from "./Contenedor";
import { Revelar } from "./Revelar";

/**
 * Seccion anclada. El `id` es el destino de las anclas del navbar.
 *
 * Todo el sitio es UNA sola pagina, asi que estos ids son la navegacion
 * entera: cambiar uno rompe el navbar, el pie y el sitemap a la vez.
 *
 * `scroll-mt-24` compensa el navbar fijo. Sin eso, al pulsar un ancla el
 * titulo queda debajo de la barra y parece que el enlace fallo.
 *
 * El antetitulo, el titulo y el contenido entran escalonados al hacer scroll.
 */
export function Seccion({
  id,
  titulo,
  antetitulo,
  children,
  centrado = false,
  className,
}: {
  id: string;
  titulo: string;
  antetitulo?: string;
  children: ReactNode;
  centrado?: boolean;
  className?: string;
}) {
  return (
    <section
      id={id}
      className={["scroll-mt-24 py-20 sm:py-28", className]
        .filter(Boolean)
        .join(" ")}
    >
      <Contenedor>
        <div className={centrado ? "flex flex-col items-center text-center" : ""}>
          {antetitulo && (
            <Revelar direccion="izquierda">
              <div className="flex items-center gap-3">
                <span className="h-px w-8 bg-acento" aria-hidden="true" />
                {/*
                  14px y no 12px. El rojo sobre crema mide 4.85:1: pasa AA, pero
                  con muy poco margen, y a 12px un texto con ese contraste se
                  lee mal de verdad en un telefono al sol. Es el mismo antetitulo
                  que en la plantilla iba a 12px, subido a proposito.
                */}
                <span className="font-display text-sm font-semibold uppercase tracking-[0.28em] text-acento">
                  {antetitulo}
                </span>
                {centrado && <span className="h-px w-8 bg-acento" aria-hidden="true" />}
              </div>
            </Revelar>
          )}

          <Revelar retraso={0.08}>
            <h2 className="mt-4 max-w-2xl font-display text-4xl font-bold uppercase leading-[0.95] tracking-tight text-texto sm:text-5xl">
              {titulo}
            </h2>
          </Revelar>
        </div>

        <Revelar retraso={0.16} className="mt-10">
          {children}
        </Revelar>
      </Contenedor>
    </section>
  );
}
