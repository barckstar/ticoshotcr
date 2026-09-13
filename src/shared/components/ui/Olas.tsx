/**
 * Las olas del hero.
 *
 * Tres capas de SVG a distinta velocidad, opacidad y altura. El parallax no
 * sale de calcular nada: sale de que la de adelante corre en 17s y la del
 * fondo en 41s. El ojo lee esa diferencia como profundidad.
 *
 * COMO FUNCIONA EL BUCLE SIN COSTURA
 * El elemento mide el 200% del ancho y el path lleva el dibujo REPETIDO. Al
 * correrlo un 50% exacto (`deriva-ola` en globals.css) el segundo ejemplar cae
 * justo donde estaba el primero y no hay salto. Cualquier otro porcentaje deja
 * una costura visible cada ciclo.
 *
 * VAN EN LINEA, no como <img src="ola.svg">. Estan sobre el pliegue y un <img>
 * seria otra peticion de red compitiendo con el LCP.
 *
 * LAS ALTURAS ESTAN MEDIDAS CONTRA LA BANDA DE FOTOS, que se pinta debajo de
 * ellas. La capa mas alta llega a 184px en escritorio y las tarjetas empiezan a
 * 96px: el agua les cubre el cuarto de abajo y las botellas se leen saliendo
 * del agua. Subirlas mas se traga la etiqueta, y las dos capas translucidas
 * dejan la foto lavada — eso ya paso una vez.
 */

/**
 * Cuatro periodos de 720 de ancho sobre un lienzo de 2880: el dibujo se repite
 * cada 1440, que es exactamente lo que se desplaza. De ahi el bucle limpio.
 */
const ONDA =
  "M0 70 c180 -50 540 50 720 0 c180 -50 540 50 720 0 " +
  "c180 -50 540 50 720 0 c180 -50 540 50 720 0 L2880 140 L0 140 Z";

type Capa = {
  color: string;
  opacidad: number;
  /** Segundos que tarda un ciclo. */
  duracion: number;
  /** Cuanto la empuja el scroll, relativo a las demas. */
  parallax: number;
  /** Alto en px del riel de esa capa. */
  alto: string;
  /** Desplazamiento vertical, para que las crestas no coincidan. */
  abajo: string;
};

const capas: Capa[] = [
  {
    color: "var(--color-durazno)",
    opacidad: 0.55,
    duracion: 41,
    parallax: 0.4,
    alto: "h-24 sm:h-32",
    abajo: "bottom-10 sm:bottom-14",
  },
  {
    color: "var(--color-coral-alt)",
    opacidad: 0.7,
    duracion: 27,
    parallax: 0.7,
    alto: "h-20 sm:h-28",
    abajo: "bottom-4 sm:bottom-6",
  },
  {
    color: "var(--color-crema)",
    opacidad: 1,
    duracion: 17,
    parallax: 1,
    alto: "h-16 sm:h-24",
    abajo: "bottom-0",
  },
];

/** Variables CSS propias: React no las tipa en `style`. */
type EstiloOla = React.CSSProperties & Record<`--${string}`, string>;

export function Olas({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={["pointer-events-none absolute inset-x-0 bottom-0", className]
        .filter(Boolean)
        .join(" ")}
    >
      {capas.map((capa) => (
        <div
          key={capa.duracion}
          className={`ola-scroll absolute inset-x-0 ${capa.abajo} ${capa.alto}`}
          style={{ "--ola-parallax": String(capa.parallax) } as EstiloOla}
        >
          <svg
            className="ola h-full"
            viewBox="0 0 2880 140"
            /* `none` deja que el SVG se estire al ancho real sin conservar
               proporcion: una ola tiene que cubrir la pantalla, no encajar. */
            preserveAspectRatio="none"
            style={{ "--ola-duracion": `${capa.duracion}s` } as EstiloOla}
          >
            <path d={ONDA} fill={capa.color} fillOpacity={capa.opacidad} />
          </svg>
        </div>
      ))}
    </div>
  );
}

/**
 * Ola quieta para separar secciones. No se anima: en medio de la pagina el
 * movimiento distrae de lo que se esta leyendo, y ademas serian cinco
 * animaciones infinitas mas corriendo a la vez.
 */
export function OlaDivisoria({
  color = "var(--color-crema)",
  invertida = false,
  className,
}: {
  color?: string;
  /** true = la curva mira hacia arriba. Para cerrar una seccion. */
  invertida?: boolean;
  className?: string;
}) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 1440 100"
      preserveAspectRatio="none"
      className={[
        "block h-12 w-full sm:h-20",
        invertida && "rotate-180",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <path
        d="M0 52 c240 -58 480 46 720 14 c240 -32 480 -50 720 6 L1440 100 L0 100 Z"
        fill={color}
      />
    </svg>
  );
}
