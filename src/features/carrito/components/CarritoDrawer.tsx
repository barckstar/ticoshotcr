"use client";

import { useEffect, useRef } from "react";
import { Botella } from "@/shared/components/ui/Botella";
import { useCarrito } from "@/shared/lib/carrito";
import { formatoColones } from "@/shared/lib/formatoColones";
import { negocio } from "@/shared/config/negocio";

/**
 * Panel del carrito. Es un drawer y no una pagina, que es lo que permite que
 * el sitio entero siga siendo UNA sola ruta.
 *
 * NO LLEVA SUGERENCIAS. La plantilla ofrecia acompanamientos aqui, y con un
 * menu de cuarenta platos eso tiene sentido. Ticoshot vende TRES cosas: quien
 * llego al carrito ya vio las tres en la misma pantalla, y ofrecerle la que le
 * falta seria repetirle lo que acaba de decidir no llevar. Si un dia hay mas
 * sabores, se vuelve a poner.
 *
 * Accesibilidad: atrapa el foco, cierra con Escape, bloquea el scroll del
 * fondo y se anuncia como dialogo.
 */
export function CarritoDrawer({ onIrAlCheckout }: { onIrAlCheckout: () => void }) {
  const {
    lineas,
    abierto,
    cerrar,
    cambiarCantidad,
    quitar,
    total,
    faltanPrecios,
    vaciar,
  } = useCarrito();
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!abierto) return;

    const anterior = document.activeElement as HTMLElement | null;
    document.body.style.overflow = "hidden";

    function alPulsar(e: KeyboardEvent) {
      if (e.key === "Escape") {
        cerrar();
        return;
      }
      if (e.key !== "Tab" || !panel.current) return;

      const focos = panel.current.querySelectorAll<HTMLElement>(
        'button, [href], input, textarea, select, [tabindex]:not([tabindex="-1"])',
      );
      if (focos.length === 0) return;
      const primero = focos[0];
      const ultimo = focos[focos.length - 1];

      if (e.shiftKey && document.activeElement === primero) {
        e.preventDefault();
        ultimo.focus();
      } else if (!e.shiftKey && document.activeElement === ultimo) {
        e.preventDefault();
        primero.focus();
      }
    }

    document.addEventListener("keydown", alPulsar);
    panel.current?.querySelector<HTMLElement>("button")?.focus();

    return () => {
      document.removeEventListener("keydown", alPulsar);
      document.body.style.overflow = "";
      anterior?.focus();
    };
  }, [abierto, cerrar]);

  if (!abierto) return null;

  return (
    /*
        `h-[100dvh]` ademas de `inset-0`: un elemento fijo se dimensiona contra
        el viewport de MAQUETA, que en Android se queda corto cuando la barra
        de direcciones se retrae. El drawer terminaba unos pixeles antes del
        borde y por esa rendija asomaba lo que hubiera detras. `dvh` sigue el
        viewport real. No se pudo reproducir en el navegador de escritorio: es
        una correccion dirigida al comportamiento de Android.
      */
      <div className="fixed inset-0 h-[100dvh] z-[60]">
      <div
        className="absolute inset-0 bg-texto/70 backdrop-blur-sm"
        onClick={cerrar}
        aria-hidden="true"
      />

      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby="titulo-carrito"
        className="absolute inset-y-0 right-0 flex w-full max-w-md flex-col border-l border-borde bg-superficie shadow-2xl"
      >
        <header className="flex items-center justify-between gap-4 border-b border-borde px-5 py-4">
          <h2
            id="titulo-carrito"
            className="font-display text-xl font-bold uppercase tracking-wide text-texto"
          >
            Tu pedido
          </h2>
          <button
            type="button"
            onClick={cerrar}
            aria-label="Cerrar el carrito"
            className="grid size-9 place-items-center rounded-full text-2xl leading-none text-texto-suave transition-colors hover:text-acento focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-acento"
          >
            ×
          </button>
        </header>

        {lineas.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 p-8 text-center">
            <p className="text-texto-suave">Todavía no has puesto nada.</p>
            <button
              type="button"
              onClick={cerrar}
              className="font-display text-sm font-semibold uppercase tracking-wide text-acento hover:underline"
            >
              Ver los tres
            </button>
          </div>
        ) : (
          <>
            <ul className="flex-1 divide-y divide-borde overflow-y-auto px-5">
              {lineas.map((l) => (
                <li key={l.producto.id} className="py-4">
                  <div className="flex gap-3">
                    {/*
                      El recorte CUADRADO, no la foto vertical. La vertical
                      metida en un hueco cuadrado con `object-cover` recorta
                      por el centro y parte la etiqueta justo por la mitad:
                      la miniatura deja de decir que producto es. Sin foto
                      todavia, la botella dibujada — ver Botella.tsx.

                      Sin next/image a proposito: son 64px dentro de un drawer
                      que solo existe si el usuario lo abre. El optimizador de
                      imagenes para una miniatura de 64px cuesta mas de lo que
                      ahorra.
                    */}
                    <div className="grid size-16 shrink-0 place-items-center overflow-hidden rounded-lg bg-superficie-alt">
                      {l.producto.imagen ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={l.producto.imagen.cuadrada.src}
                          alt={l.producto.imagen.cuadrada.alt}
                          width={l.producto.imagen.cuadrada.ancho}
                          height={l.producto.imagen.cuadrada.alto}
                          loading="lazy"
                          className="size-full object-cover"
                        />
                      ) : (
                        <Botella
                          color={l.producto.color}
                          nombre={l.producto.nombre}
                          className="h-14 w-auto"
                        />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="font-display text-sm font-semibold uppercase tracking-wide text-texto">
                            {l.producto.nombre}
                          </h3>
                          {l.producto.advertencia && (
                            <p className="mt-0.5 text-[11px] font-semibold uppercase tracking-wide text-acento">
                              {l.producto.advertencia}
                            </p>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => quitar(l.producto.id)}
                          aria-label={`Quitar ${l.producto.nombre} del pedido`}
                          className="text-xs text-texto-suave transition-colors hover:text-acento"
                        >
                          Quitar
                        </button>
                      </div>

                      <div className="mt-2 flex items-center justify-between gap-3">
                        <div className="inline-flex items-center gap-1 rounded-full border border-borde">
                          <button
                            type="button"
                            onClick={() =>
                              cambiarCantidad(l.producto.id, l.cantidad - 1)
                            }
                            aria-label={`Quitar una unidad de ${l.producto.nombre}`}
                            className="grid size-7 place-items-center rounded-full text-texto transition-colors hover:text-acento"
                          >
                            −
                          </button>
                          <span className="min-w-5 text-center text-sm font-semibold text-texto">
                            {l.cantidad}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              cambiarCantidad(l.producto.id, l.cantidad + 1)
                            }
                            aria-label={`Agregar una unidad de ${l.producto.nombre}`}
                            className="grid size-7 place-items-center rounded-full text-texto transition-colors hover:text-acento"
                          >
                            +
                          </button>
                        </div>
                        <p className="font-display font-bold text-acento">
                          {l.producto.precio === null
                            ? "Consultar"
                            : formatoColones(l.producto.precio * l.cantidad)}
                        </p>
                      </div>

                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <footer className="border-t border-borde p-5">
              <div className="flex items-baseline justify-between">
                <span className="font-display uppercase tracking-wide text-texto-suave">
                  Total
                </span>
                <span className="font-display text-3xl font-bold text-acento">
                  {faltanPrecios ? "A confirmar" : formatoColones(total)}
                </span>
              </div>
              <p className="mt-1 text-xs text-texto-suave">
                El envío no está incluido: se coordina por WhatsApp.
              </p>

              <button
                type="button"
                onClick={onIrAlCheckout}
                className="mt-4 w-full rounded-full bg-acento py-3.5 font-display font-semibold uppercase tracking-wide text-white transition-transform duration-200 hover:bg-acento-alt active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-acento-alt"
              >
                Continuar el pedido
              </button>

              {/* Antes era un texto gris de 12px que nadie encontraba.
                  Ahora es un boton real, con borde y su icono. */}
              <button
                type="button"
                onClick={vaciar}
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-full border border-borde py-2.5 text-sm text-texto-suave transition-colors hover:border-acento/60 hover:text-acento"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="size-4"
                  aria-hidden="true"
                >
                  <path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14" />
                  <path d="M10 11v6M14 11v6" />
                </svg>
                Vaciar el pedido
              </button>

              <p className="mt-3 text-center text-xs text-texto-suave">
                Se coordina por WhatsApp {negocio.whatsappVisible}
              </p>
            </footer>
          </>
        )}
      </div>
    </div>
  );
}
