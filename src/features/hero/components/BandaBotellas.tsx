import Image from "next/image";
import { Botella } from "@/shared/components/ui/Botella";
import type { Producto } from "@/shared/types/producto";

/**
 * La banda de fotos que cruza el hero de izquierda a derecha.
 *
 * Son las publicaciones de Ticoshot pasando como una tira: el fondo coral
 * pintado a mano de cada foto es parte de su identidad, asi que se montan como
 * tarjetas con su marco y su sombra —una tira de Instagram— en vez de
 * recortarles el fondo.
 *
 * COMO SE HACE UN MARQUEE QUE NO SALTA
 * La pista lleva la lista DUPLICADA y se desplaza exactamente un 50%: cuando
 * el primer juego termina de salir, el segundo esta justo donde empezo el
 * primero. La copia va con `aria-hidden` para que un lector de pantalla no
 * anuncie seis botellas donde hay tres.
 *
 * `width: max-content` en la pista es lo que permite que el 50% signifique
 * "la mitad del contenido". Con un ancho en porcentaje el calculo se haria
 * sobre el contenedor y el bucle saltaria.
 *
 * ES DECORATIVA. Los productos de verdad, con su nombre y su precio, viven en
 * el catalogo; aqui son fotos pasando. Por eso la banda no lleva enlaces: un
 * objetivo tactil que se mueve es imposible de acertar.
 */

type EstiloBanda = React.CSSProperties & Record<`--${string}`, string>;

/** Inclinaciones fijas por posicion. Ver el comentario de abajo. */
const INCLINACION = ["-rotate-3", "rotate-2", "-rotate-1"];

export function BandaBotellas({ productos }: { productos: Producto[] }) {
  const juego = (oculto: boolean) => (
    <ul
      className="flex shrink-0 items-end gap-6 px-3 sm:gap-10 sm:px-5"
      aria-hidden={oculto || undefined}
    >
      {productos.map((p, i) => (
        <li
          key={p.id}
          /*
            La inclinacion sale de la POSICION, no de `Math.random()`. Un valor
            al azar se calcula distinto en el servidor y en el cliente, y React
            marca desajuste de hidratacion — ademas de que la tira cambiaria de
            forma en cada carga sin que nadie lo pidiera.
          */
          className={`shrink-0 ${INCLINACION[i % INCLINACION.length]}`}
        >
          {p.imagen ? (
            <div className="relative h-44 w-35 overflow-hidden rounded-2xl border-4 border-white/80 shadow-[0_14px_36px_rgba(150,60,30,0.3)] sm:h-60 sm:w-48">
              <Image
                src={p.imagen.vertical.src}
                alt=""
                fill
                /* La tarjeta mide 140px en movil y 192px desde `sm`. Sin
                   `sizes`, next/image sirve la de 1080 de ancho — sobre el
                   pliegue y seis veces. */
                sizes="(max-width: 640px) 140px, 192px"
                className="object-cover"
              />
            </div>
          ) : (
            <Botella
              color={p.color}
              nombre={p.nombre}
              className="h-36 w-auto drop-shadow-xl sm:h-52"
            />
          )}
        </li>
      ))}
    </ul>
  );

  return (
    <div className="marquee pointer-events-none absolute inset-x-0 bottom-6 overflow-hidden sm:bottom-10">
      <div
        className="marquee-pista flex"
        style={{ "--marquee-duracion": "38s" } as EstiloBanda}
      >
        {juego(false)}
        {juego(true)}
      </div>
    </div>
  );
}
