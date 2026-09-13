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
 * ============ POR QUE SEIS COPIAS Y NO DOS ============
 * Un marquee sin costura necesita DOS cosas, y la segunda se paso por alto al
 * escribirlo la primera vez:
 *
 *   1. Que el desplazamiento sea exactamente el ancho de UN juego. Eso lo
 *      resuelve la formula `-100% / copias` del @keyframes.
 *
 *   2. Que la pista TOTAL sea mas ancha que la pantalla mas un juego. Esto es
 *      lo que fallaba: con dos copias de tres tarjetas la pista media unos
 *      1392 px en escritorio, asi que en una pantalla de 1440 no alcanzaba ni
 *      a cubrirla. Las botellas se amontonaban a la izquierda y quedaba un
 *      hueco enorme a la derecha — se veia como si la banda estuviera rota, no
 *      como una tira pasando.
 *
 * Con seis copias la pista mide unos 4176 px, que cubre hasta pantallas de
 * ~3480 px. Son 18 tarjetas en el DOM pero solo TRES imagenes distintas: el
 * navegador las pide una vez y reusa el resto. El costo es marcado, no red.
 * ======================================================
 *
 * ES DECORATIVA. Los productos de verdad, con su nombre y su precio, viven en
 * el catalogo; aqui son fotos pasando. Por eso la banda no lleva enlaces: un
 * objetivo tactil que se mueve es imposible de acertar.
 */

type EstiloBanda = React.CSSProperties & Record<`--${string}`, string>;

/**
 * Cuantas veces se repite la lista.
 *
 * VIAJA TAMBIEN EN UNA VARIABLE CSS, porque el `@keyframes` necesita el mismo
 * numero para calcular el desplazamiento. Cambiarlo aqui y no alla hace que el
 * bucle salte en cada vuelta, y es de los fallos que solo se ven mirando fijo
 * durante medio minuto.
 */
const COPIAS = 6;

/** Inclinaciones fijas por posicion. Ver el comentario de abajo. */
const INCLINACION = ["-rotate-3", "rotate-2", "-rotate-1"];

export function BandaBotellas({ productos }: { productos: Producto[] }) {
  const juego = (copia: number) => (
    <ul
      key={copia}
      className="flex shrink-0 items-end gap-6 px-3 sm:gap-10 sm:px-5"
      /* Solo la primera copia se anuncia: un lector de pantalla no tiene por
         que oir dieciocho botellas donde hay tres. */
      aria-hidden={copia > 0 || undefined}
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
                   `sizes`, next/image serviria la de 1080 de ancho — sobre el
                   pliegue y dieciocho veces. */
                sizes="(max-width: 640px) 140px, 192px"
                className="object-cover"
              />
            </div>
          ) : (
            <Botella
              color={p.color}
              nombre={p.nombre}
              className="h-44 w-auto drop-shadow-xl sm:h-60"
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
        style={
          {
            "--marquee-duracion": "38s",
            "--marquee-copias": String(COPIAS),
          } as EstiloBanda
        }
      >
        {Array.from({ length: COPIAS }, (_, i) => juego(i))}
      </div>
    </div>
  );
}
