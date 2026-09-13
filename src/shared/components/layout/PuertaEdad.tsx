import { Logo } from "@/shared/components/ui/Logo";
import { negocio } from "@/shared/config/negocio";
import { BotonEdad } from "./BotonEdad";

/**
 * Puerta de edad. Vender licor no es vender hamburguesas.
 *
 * COMO EVITA EL PARPADEO Y LA HIDRATACION ROTA
 *
 * El problema clasico: si el componente decide con `localStorage` si pintarse,
 * el servidor —que no tiene localStorage— siempre dice "pintalo", y quien ya
 * habia confirmado ve el modal aparecer y desaparecer en cada carga.
 *
 * La solucion es la misma que usan los conmutadores de tema: el modal SIEMPRE
 * se pinta en el HTML, y un script diminuto en el <head> marca
 * `data-edad="ok"` en <html> ANTES del primer pintado. CSS lo esconde a partir
 * de ese atributo. No hay estado de React de por medio, asi que no hay
 * desajuste posible entre servidor y cliente.
 *
 * `SCRIPT_EDAD` y `CLAVE_EDAD` viven en `shared/lib/edad.ts`, un modulo SIN
 * "use client", porque los necesitan las dos mitades. Ver ahi por que.
 *
 * SIN JAVASCRIPT tambien funciona, con el patron `:target`: el boton es un
 * ancla a `#entrar` y CSS esconde la puerta cuando ese ancla es el objetivo.
 * No se recuerda entre visitas —no hay donde guardarlo sin JavaScript— pero la
 * puerta se abre, que es lo que no puede fallar.
 */

export function PuertaEdad() {
  return (
    <div
      className="puerta-edad"
      role="dialog"
      aria-modal="true"
      aria-labelledby="puerta-edad-titulo"
    >
      <div className="flex min-h-full items-center justify-center bg-texto/92 p-5 backdrop-blur-sm">
        <div className="w-full max-w-md rounded-3xl bg-superficie p-8 text-center shadow-2xl sm:p-10">
          <Logo className="mx-auto h-20 w-auto text-acento" titulo={null} />

          <h1
            id="puerta-edad-titulo"
            className="mt-6 font-display text-2xl font-bold uppercase tracking-tight text-texto"
          >
            ¿Tenés {negocio.edadMinima} años o más?
          </h1>

          <p className="mt-3 text-sm leading-relaxed text-texto-suave">
            {negocio.nombre} vende bebidas con alcohol. En Costa Rica la venta a
            menores de {negocio.edadMinima} años está prohibida.
          </p>

          <div className="mt-8 flex flex-col gap-3">
            <BotonEdad />
            {/*
              Un enlace de verdad, no un boton: quien no tiene la edad se va del
              sitio. Salir por el buscador es la salida honesta — no hay nada
              aqui que mostrarle.
            */}
            <a
              href="https://www.google.com"
              className="rounded-full px-5 py-2.5 font-display text-sm font-semibold uppercase tracking-wide text-texto-suave transition-colors hover:text-acento focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-acento"
            >
              No, soy menor
            </a>
          </div>

          <p className="mt-7 text-xs leading-relaxed text-texto-suave">
            Tomar con moderación. Si vas a manejar, no tomés.
          </p>
        </div>
      </div>
    </div>
  );
}
