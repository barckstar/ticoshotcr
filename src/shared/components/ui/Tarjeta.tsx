import type { ReactNode } from "react";

/**
 * Superficie del 30% del reparto: blanco sobre el crema del fondo.
 *
 * POR QUE EL FONDO ES UNA PROP Y NO SE PISA CON `className`
 *
 * Antes el fondo estaba fijo aqui como `bg-superficie` y quien queria otro le
 * pasaba `className="bg-acento"`. NO FUNCIONA, y falla de la peor manera: dos
 * utilidades de `background-color` tienen la MISMA especificidad, asi que gana
 * la que Tailwind haya puesto mas abajo en la hoja — no la que uno escribio
 * despues. La tarjeta del resultado del cotizador, que tenia que ser roja,
 * salia blanca con el texto blanco encima: invisible. Ni el build ni el lint
 * dicen nada.
 *
 * Con `fondo` el llamante REEMPLAZA en vez de competir, y el resultado no
 * depende del orden de generacion de la hoja de estilos.
 *
 * El acento NUNCA es fondo por defecto. El rojo es el 10% del reparto y vive
 * en botones, precios y badges; como fondo de todas las tarjetas dejaria de
 * ser acento. La prop existe para las excepciones contadas, no para la norma.
 */
export function Tarjeta({
  children,
  className,
  fondo = "bg-superficie ring-borde",
}: {
  children: ReactNode;
  className?: string;
  /** Fondo y color del anillo, juntos. Ej: `"bg-acento ring-acento"`. */
  fondo?: string;
}) {
  return (
    <div
      className={[
        "overflow-hidden rounded-3xl ring-1",
        "shadow-[0_2px_20px_rgba(180,90,50,0.07)]",
        fondo,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </div>
  );
}
