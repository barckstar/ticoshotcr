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

import { Palmera } from "./Decorados";

/**
 * Los fondos que de verdad usa el sitio, mas los dos del mar.
 *
 * `mar` y `espuma` NO son tokens nuevos: son el azul de etiqueta del Miguelito
 * y el azul de los garabatos de sus publicaciones, con otro nombre porque aqui
 * cumplen otro papel. Se listan aparte de `ColorUnion` a proposito — una
 * costura entre secciones nunca puede ser azul, solo la escena de la playa lo
 * usa.
 */
const colores = {
  crema: "var(--color-crema)",
  arena: "var(--color-superficie-alt)",
  coral: "var(--color-coral)",
  acento: "var(--color-acento)",
  mar: "var(--color-crayon)",
  espuma: "var(--color-miguelito)",
} as const;

export type ColorUnion = "crema" | "arena" | "coral" | "acento";

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
 *
 * ============ LA DE ATRAS LLEVA LAS CRESTAS MAS ALTAS ============
 * Estaba al reves, y por eso NO SE VEIA NINGUNA de las dos cosas de arriba: la
 * de atras era `ONDA_SUAVE`, que sube hasta y=48, y la de adelante `ONDA`, que
 * sube hasta y=16. Una ola mas alta delante tapa por completo a una mas baja
 * detras — siempre, en todo momento del ciclo. Quedaban dos SVG animandose para
 * que se viera uno.
 *
 * No lo delataba nada: como aqui las dos se rellenan del MISMO color, el
 * resultado era correcto de casualidad. Se vio al pintarlas de colores
 * distintos en la playa.
 * ==================================================================
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
        {/* Capa de atras: crestas ALTAS, lenta y translucida. Es la que asoma. */}
        <svg
          className="ola absolute inset-0 h-full"
          viewBox="0 0 2880 120"
          preserveAspectRatio="none"
          style={{ "--ola-duracion": "34s" } as EstiloUnion}
        >
          <path d={ONDA} fill={colores[a]} fillOpacity={0.45} />
        </svg>

        {/* Capa de adelante: mas baja y opaca, la que separa los dos colores. */}
        <svg
          className="ola absolute inset-0 h-full"
          viewBox="0 0 2880 120"
          preserveAspectRatio="none"
          style={{ "--ola-duracion": "21s" } as EstiloUnion}
        >
          <path d={ONDA_SUAVE} fill={colores[a]} />
        </svg>
      </div>
    </div>
  );
}

/**
 * El cierre de la pagina: sol, palmeras, arena y mar.
 *
 * Va una sola vez, antes del pie. Es el unico sitio donde el sitio se permite
 * una escena completa en vez de un adorno suelto: al final ya no compite con
 * nada que haya que leer, y es lo ultimo que queda en la cabeza.
 *
 * ============ EL AGUA ES AZUL, Y SALE DE LA PALETA ============
 * Estuvo pintada del rojo del pie, para entrar en el sin costura. No funciono:
 * una franja roja al pie de la pagina no se lee como mar, se lee como una
 * franja roja.
 *
 * Los dos colores ya estaban: `crayon` (#7CC4E8) es el azul de los garabatos de
 * sus publicaciones y `miguelito` (#98EDD8) el menta de la botella. Agua azul
 * con espuma menta es, ademas, exactamente como se ve el mar de aqui. Asi que
 * el mar NO trae un color nuevo al sitio — no hizo falta inventar un token ni
 * tocar el reparto 70/30/10.
 *
 * El rojo sigue estando, pero abajo del todo y en una ola baja: ahi hace lo
 * unico que tenia que hacer, que es entregarle la pagina al pie sin una linea
 * recta de por medio.
 * ==============================================================
 */
export function Playa({ a }: { a: ColorUnion }) {
  return (
    <div
      aria-hidden="true"
      className="relative -mt-px h-56 w-full overflow-hidden sm:h-72"
      style={{ background: colores.crema }}
    >
      {/*
        EL SOL. Baja despacio y vuelve — no se pone del todo: si desapareciera,
        la escena se quedaria vacia la mitad del ciclo.
      */}
      <div className="deco deco-flotar absolute left-1/2 top-3 -translate-x-1/2 sm:top-5">
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

        ============ LAS TRES ALTURAS ESTAN ATADAS ============
        La cresta de la arena cae al 40% de este SVG, asi que queda a 0,6 × su
        altura del borde de abajo. Con la arena a 288px eso son 173; el mar sube
        112; y la diferencia —61px— es la PLAYA que se ve.

        Ha hecho falta subir la escena entera a 288px para que las dos cosas
        quepan: con 256 el mar se quedaba en una cinta de 25px, que no se lee
        como mar. Las tres alturas estan atadas por esa resta — si se cambia
        una, hay que rehacerla.
        =======================================================
      */}
      <svg
        className="absolute inset-x-0 bottom-0 h-56 w-full sm:h-72"
        viewBox="0 0 1440 100"
        preserveAspectRatio="none"
      >
        <path
          d="M0 40 c240 -28 480 24 720 8 c240 -16 480 -26 720 6 L1440 100 L0 100 Z"
          fill="var(--color-durazno)"
        />
      </svg>

      {/*
        Las palmeras van DESPUES de la arena para quedar encima, y por encima de
        la linea del agua: mas abajo las tapa el mar y se ven cortadas por la
        mitad. El agua sube a 56px en movil y 80 desde `sm`, asi que ninguna
        baja de ahi.
      */}
      <PalmeraPlaya
        className="absolute bottom-24 left-[6%] w-20 text-menta sm:bottom-32 sm:w-28"
        retraso={0}
        duracion={11}
      />
      <PalmeraPlaya
        className="absolute bottom-28 right-[8%] w-16 text-menta/80 sm:bottom-36 sm:w-24"
        retraso={1.4}
        duracion={13}
      />

      {/*
        EL MAR. La ESPUMA va detras y con las crestas ALTAS; el agua delante y
        mas baja. Asi el menta asoma por encima del azul como la lengua de
        espuma que deja una ola al romper — que es lo que hace que se lea agua
        y no dos cintas de color.

        Al reves —espuma baja detras, agua alta delante— la espuma no existe:
        queda tapada al 100% en todo momento del ciclo. Fue asi hasta que se
        pintaron de colores distintos y se vio.

        Las velocidades tambien van al reves de la intuicion: la de atras, mas
        lenta (30s). Esa diferencia es lo que el ojo lee como profundidad.
      */}
      <div className="absolute inset-x-0 bottom-0 h-20 overflow-hidden sm:h-28">
        <svg
          className="ola absolute inset-0 h-full"
          viewBox="0 0 2880 120"
          preserveAspectRatio="none"
          style={{ "--ola-duracion": "30s" } as EstiloUnion}
        >
          <path d={ONDA} fill={colores.espuma} />
        </svg>
        <svg
          className="ola absolute inset-0 h-full"
          viewBox="0 0 2880 120"
          preserveAspectRatio="none"
          style={{ "--ola-duracion": "21s" } as EstiloUnion}
        >
          <path d={ONDA_SUAVE} fill={colores.mar} />
        </svg>
      </div>

      {/*
        LA ENTREGA AL PIE. Baja y de crestas suaves: no es parte del mar, es la
        linea con la que el footer rojo empieza sin un corte recto. Estaba a
        32px y volvia a leerse como la franja roja que se vino a quitar.

        Lleva `ONDA` —la de crestas altas— y no `ONDA_SUAVE`: en una banda tan
        baja, la suave solo mueve 4px y el resultado es una regla recta, que es
        justo lo que se venia a evitar. Con la alta oscila entre 12 y 21px sobre
        24, y ahi si se lee ondulada.
      */}
      <div className="absolute inset-x-0 bottom-0 h-5 overflow-hidden sm:h-6">
        <svg
          className="ola absolute inset-0 h-full"
          viewBox="0 0 2880 120"
          preserveAspectRatio="none"
          style={{ "--ola-duracion": "24s" } as EstiloUnion}
        >
          <path d={ONDA} fill={colores[a]} />
        </svg>
      </div>
    </div>
  );
}

/**
 * La palmera de la escena. Es la MISMA de los adornos de seccion, solo que
 * meciendose: un segundo dibujo de palmera aqui seria la misma cosa en dos
 * estilos, que es justo lo que se nota.
 */
function PalmeraPlaya({
  className,
  retraso,
  duracion,
}: {
  className: string;
  retraso: number;
  duracion: number;
}) {
  return (
    <div
      className={`deco deco-vaiven ${className}`}
      style={
        {
          "--deco-retraso": `${retraso}s`,
          "--deco-duracion": `${duracion}s`,
          /* El giro nace en la BASE del tronco, no en el centro del dibujo:
             una palmera que bascula por la mitad se ve despegada del suelo. */
          transformOrigin: "50% 92%",
        } as EstiloUnion
      }
    >
      <Palmera className="w-full" />
    </div>
  );
}
