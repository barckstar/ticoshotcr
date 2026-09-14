/**
 * La costura entre dos secciones.
 *
 * Donde cambia el color de fondo quedaba una linea recta, dura, de borde a
 * borde: el corte mas barato que existe y el que mas delata una plantilla. Aqui
 * ese cambio pasa por una ola, en el mismo lenguaje que el hero.
 *
 * ============ COMO SE CONSTRUYE UNA COSTURA ============
 * El bloque lleva de fondo el color de ARRIBA y dibuja encima una ola rellena
 * con el color de ABAJO. El resultado es que la seccion siguiente "sube" por la
 * ola en vez de empezar en una linea.
 *
 * Por eso los dos colores son obligatorios: una costura que no sepa entre que
 * dos colores esta cose mal, y el fallo se ve como una franja del color
 * equivocado — que es justo lo que se venia a quitar.
 * =======================================================
 *
 * ============ EL BUCLE SIN COSTURA ============
 * Igual que en el hero: el SVG mide el 200% de ancho y lleva su dibujo
 * REPETIDO; al correrlo un 50% exacto, el segundo ejemplar cae donde estaba el
 * primero. Cualquier otro porcentaje deja un salto visible cada vuelta.
 * ==============================================
 */

/** Los fondos que de verdad usa el sitio. */
const colores = {
  crema: "var(--color-crema)",
  arena: "var(--color-superficie-alt)",
  coral: "var(--color-coral)",
  acento: "var(--color-acento)",
} as const;

export type ColorUnion = keyof typeof colores;

type EstiloUnion = React.CSSProperties & Record<`--${string}`, string>;

/**
 * Cuatro periodos de 720 sobre un lienzo de 2880: el dibujo se repite cada
 * 1440, que es exactamente lo que se desplaza. De ahi el bucle limpio.
 */
const ONDA =
  "M0 60 c180 -44 540 44 720 0 c180 -44 540 44 720 0 " +
  "c180 -44 540 44 720 0 c180 -44 540 44 720 0 L2880 120 L0 120 Z";

/** La misma onda con las crestas mas bajas, para la capa de atras. */
const ONDA_SUAVE =
  "M0 74 c180 -26 540 26 720 0 c180 -26 540 26 720 0 " +
  "c180 -26 540 26 720 0 c180 -26 540 26 720 0 L2880 120 L0 120 Z";

/**
 * La costura de olas. Es la de por defecto y la que se usa entre secciones.
 *
 * DOS CAPAS Y NO UNA. La de atras va al 45% de opacidad y corre mas lenta: esa
 * diferencia de velocidad es lo que el ojo lee como profundidad. Con una sola
 * capa se ve una cinta plana moviendose, no agua.
 */
export function UnionSeccion({
  de,
  a,
  invertida = false,
}: {
  /** El color de la seccion de ARRIBA. */
  de: ColorUnion;
  /** El color de la seccion de ABAJO. */
  a: ColorUnion;
  /** true = las crestas miran hacia arriba. Para cerrar una seccion. */
  invertida?: boolean;
}) {
  return (
    <div
      aria-hidden="true"
      className="relative -mt-px h-12 w-full overflow-hidden sm:h-20"
      style={{ background: colores[de] }}
    >
      <div className={invertida ? "rotate-180" : undefined}>
        {/* Capa de atras: mas lenta, mas suave, translucida. */}
        <svg
          className="ola absolute inset-0 h-full"
          viewBox="0 0 2880 120"
          preserveAspectRatio="none"
          style={{ "--ola-duracion": "34s" } as EstiloUnion}
        >
          <path d={ONDA_SUAVE} fill={colores[a]} fillOpacity={0.45} />
        </svg>

        {/* Capa de adelante: la que de verdad separa los dos colores. */}
        <svg
          className="ola absolute inset-0 h-full"
          viewBox="0 0 2880 120"
          preserveAspectRatio="none"
          style={{ "--ola-duracion": "21s" } as EstiloUnion}
        >
          <path d={ONDA} fill={colores[a]} />
        </svg>
      </div>
    </div>
  );
}

/**
 * El cierre de la pagina: sol, palmeras, arena y agua.
 *
 * Va una sola vez, antes del pie. Es el unico sitio donde el sitio se permite
 * una escena completa en vez de un adorno suelto: al final ya no compite con
 * nada que haya que leer, y es lo ultimo que queda en la cabeza.
 *
 * TODO CON LA PALETA DEL SITIO. Un atardecer de playa con azules de stock se
 * saldria del reparto 70/30/10 — aqui el agua es el coral del hero y la arena
 * el mismo crema de las superficies.
 */
export function Playa({ a }: { a: ColorUnion }) {
  return (
    <div
      aria-hidden="true"
      className="relative -mt-px h-40 w-full overflow-hidden sm:h-56"
      style={{ background: colores.crema }}
    >
      {/*
        EL SOL. Baja despacio y vuelve — no se pone del todo: si desapareciera,
        la escena se quedaria vacia la mitad del ciclo.
      */}
      <div className="deco deco-flotar absolute left-1/2 top-4 -translate-x-1/2 sm:top-6">
        <svg viewBox="0 0 120 120" className="w-16 text-acento/70 sm:w-24">
          <circle cx="60" cy="60" r="26" fill="currentColor" />
          {/* Doce rayos. El giro lento los hace latir sin que se note el truco. */}
          <g
            stroke="currentColor"
            strokeWidth="5"
            strokeLinecap="round"
            className="deco deco-giro origin-center"
            style={{ "--deco-duracion": "70s" } as EstiloUnion}
          >
            <path d="M60 8v14M60 98v14M8 60h14M98 60h14M23 23l10 10M87 87l10 10M97 23l-10 10M33 87l-10 10" />
          </g>
        </svg>
      </div>

      {/*
        LA ARENA VA EN DURAZNO, no en el color `arena` de las superficies.

        Se probo con `arena` (#FBE7DA) y no se veia: contra el crema del fondo
        (#FFF4EC) son casi el mismo color, asi que la playa quedaba sin suelo y
        las palmeras parecian flotando. El durazno es el tono mas calido de la
        misma familia y es el unico que de verdad separa la arena del cielo.

        Quieta, sin animacion: es suelo, no agua.
      */}
      <svg
        className="absolute inset-x-0 bottom-0 h-20 w-full sm:h-24"
        viewBox="0 0 1440 100"
        preserveAspectRatio="none"
      >
        <path
          d="M0 40 c240 -28 480 24 720 8 c240 -16 480 -26 720 6 L1440 100 L0 100 Z"
          fill="var(--color-durazno)"
        />
      </svg>

      {/*
        Las palmeras van DESPUES de la arena para quedar encima, y apoyadas en
        ella: puestas mas abajo las tapa el agua y se ven cortadas por la mitad.
      */}
      <Palmera className="absolute bottom-14 left-[6%] w-16 text-menta/70 sm:bottom-20 sm:w-24" retraso={0} />
      <Palmera className="absolute bottom-16 right-[8%] w-14 text-menta/60 sm:bottom-24 sm:w-20" retraso={1.4} />

      {/* Y el agua encima de la arena, que es la unica que se mueve. */}
      <div className="absolute inset-x-0 bottom-0 h-10 overflow-hidden sm:h-14">
        <svg
          className="ola absolute inset-0 h-full"
          viewBox="0 0 2880 120"
          preserveAspectRatio="none"
          style={{ "--ola-duracion": "26s" } as EstiloUnion}
        >
          <path d={ONDA} fill={colores[a]} />
        </svg>
      </div>
    </div>
  );
}

/** La palmera de la escena. Se mece, con su propio desfase. */
function Palmera({ className, retraso }: { className: string; retraso: number }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={`deco deco-vaiven ${className}`}
      style={
        {
          "--deco-retraso": `${retraso}s`,
          "--deco-duracion": "11s",
          /* El giro nace en la BASE del tronco, no en el centro del dibujo:
             una palmera que bascula por la mitad se ve despegada del suelo. */
          transformOrigin: "50% 90%",
        } as EstiloUnion
      }
      fill="none"
      stroke="currentColor"
      strokeWidth="5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M50 92C50 64 52 40 62 18" />
      <path d="M58 34c-9-6-20-6-27 1M58 34c10-4 20-1 25 7M55 50c-10-5-21-3-27 5M55 50c10-3 20 1 24 9" strokeWidth={4} />
    </svg>
  );
}
