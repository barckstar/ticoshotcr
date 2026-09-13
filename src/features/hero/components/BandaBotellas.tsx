import { Botella } from "@/shared/components/ui/Botella";
import type { Producto } from "@/shared/types/producto";

/**
 * La banda de botellas que cruza el hero de izquierda a derecha.
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
 * Es DECORATIVA. Los productos de verdad, con su nombre y su precio, viven en
 * el catalogo; aqui son tres siluetas pasando. Por eso la banda no lleva
 * enlaces: un objetivo tactil que se mueve es imposible de acertar.
 */

type EstiloBanda = React.CSSProperties & Record<`--${string}`, string>;

export function BandaBotellas({ productos }: { productos: Producto[] }) {
  const juego = (oculto: boolean) => (
    <ul
      className="flex shrink-0 items-end gap-10 px-5 sm:gap-16"
      aria-hidden={oculto || undefined}
    >
      {productos.map((p) => (
        <li key={p.id} className="shrink-0">
          {p.imagen ? (
            /*
              Sin next/image a proposito: esta imagen esta sobre el pliegue y
              se repite seis veces. `next/image` le pondria lazy loading y un
              contenedor con su propia relacion de aspecto, que aqui solo
              agrega trabajo. Cuando lleguen las fotos reales se revisa.
            */
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={p.imagen.src}
              alt=""
              width={p.imagen.ancho}
              height={p.imagen.alto}
              className="h-36 w-auto drop-shadow-xl sm:h-52"
            />
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
    <div className="marquee pointer-events-none absolute inset-x-0 bottom-16 overflow-hidden sm:bottom-24">
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
