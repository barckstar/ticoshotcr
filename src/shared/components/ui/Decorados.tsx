import type { CSSProperties, ReactNode } from "react";

/**
 * LOS ELEMENTOS DECORATIVOS DEL SITIO, en el estilo de sus publicaciones.
 *
 * Son los garabatos de crayon y las frutas que aparecen pintados a mano en los
 * fondos coral de Ticoshot: tomate y chile del chiliguaro, coco del miguelito,
 * naranja y lima de la sangria, mas hojas tropicales y nubes.
 *
 * ============ POR QUE VIVEN EN `shared/` ============
 * Los usan el hero y TODAS las secciones. Metidos en `features/hero/`, el
 * catalogo tendria que importar de otra feature — lo unico que la arquitectura
 * prohibe de plano. Y ademas dejarian de ser reciclables, que es justo lo que
 * se pidio.
 * ====================================================
 *
 * ============ POR QUE SVG EN LINEA Y NO IMAGENES ============
 *   - Son decenas repartidas por la pagina. Como <img> serian decenas de
 *     peticiones de red, y varias estan sobre el pliegue compitiendo con el LCP.
 *   - Heredan `currentColor`, asi que el mismo dibujo sirve en cualquier color
 *     de la paleta sin tener un archivo por variante.
 *   - Escalan sin pixelarse, de los 24px de un adorno chico a los 200 de uno
 *     grande.
 * =============================================================
 *
 * TODOS SON DECORATIVOS. El contenedor lleva `aria-hidden` y `pointer-events:
 * none`: no se anuncian a un lector de pantalla —seria ruido puro— y nunca
 * roban un clic destinado a lo que tienen debajo.
 */

/* ────────────────────────── Los dibujos ────────────────────────── */

/*
  Todos con `fill="none"` y trazo grueso de punta redonda: es el gesto de
  crayon de sus publicaciones. El relleno se usa solo donde la forma lo pide
  —la pulpa de una fruta partida— y siempre con `fillOpacity` baja, para que
  el dibujo se lea como un trazo encima del fondo y no como una pegatina.
*/

type Dibujo = { className?: string };

const trazo = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 5,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

/** Tomate. El del chiliguaro. */
export function Tomate({ className }: Dibujo) {
  return (
    <svg viewBox="0 0 100 100" className={className} {...trazo}>
      <path d="M50 26c15 0 27 12 27 27S65 84 50 84 23 70 23 53s12-27 27-27Z" />
      {/* El cáliz: cinco hojas cortas saliendo del tallo. */}
      <path d="M50 26v-9M50 26l-13-7M50 26l13-7M50 26l-9 5M50 26l9 5" />
      {/* Un brillo, que es lo que lo separa de una manzana. */}
      <path d="M37 45c2-5 6-8 10-9" strokeWidth={4} opacity={0.55} />
    </svg>
  );
}

/** Chile picante, con su rabito curvo. */
export function Chile({ className }: Dibujo) {
  return (
    <svg viewBox="0 0 100 100" className={className} {...trazo}>
      <path d="M62 24c8 10 10 26 3 40-7 15-22 22-33 18-8-3-10-11-5-17 6-7 16-8 22-18 5-9 4-18 13-23Z" />
      <path d="M62 24c-4-6-2-10 3-11M65 13c4 1 7 4 7 8" strokeWidth={4.5} />
    </svg>
  );
}

/** Media naranja: el corte con los gajos. De la sangría. */
export function Naranja({ className }: Dibujo) {
  return (
    <svg viewBox="0 0 100 100" className={className} {...trazo}>
      <circle cx="50" cy="50" r="30" />
      <circle cx="50" cy="50" r="23" strokeWidth={3.5} opacity={0.6} />
      {/* Ocho gajos. Menos se lee como una rueda; más, como una mancha. */}
      <path d="M50 27v46M27 50h46M34 34l32 32M66 34L34 66" strokeWidth={3.5} opacity={0.75} />
    </svg>
  );
}

/** Rodaja de lima: media luna, que la distingue de la naranja entera. */
export function Lima({ className }: Dibujo) {
  return (
    <svg viewBox="0 0 100 100" className={className} {...trazo}>
      <path d="M22 62a32 32 0 0 1 56 0Z" />
      <path d="M50 62V36M35 62c0-9 5-17 12-22M65 62c0-9-5-17-12-22" strokeWidth={3.5} opacity={0.7} />
    </svg>
  );
}

/**
 * Coco con pajilla. El del miguelito.
 *
 * SE DIBUJO DOS VECES. La primera era un coco PARTIDO, con el anillo de pulpa
 * dentro: sobre el papel esta bien, pero al tamaño real —unos 100px y al 22%
 * de opacidad— el anillo interior y el contorno se leian como dos circulos
 * concentricos, o sea una diana. El detalle que lo hacia un coco desaparecia
 * justo al encogerlo.
 *
 * Con la pajilla y la hojita se reconoce de un vistazo aunque sea una mancha:
 * la silueta ya no es un circulo, y eso es lo unico que sobrevive a un dibujo
 * pequeño y translucido.
 */
export function Coco({ className }: Dibujo) {
  return (
    <svg viewBox="0 0 100 100" className={className} {...trazo}>
      {/* El coco: una esfera con la base algo achatada. */}
      <path d="M50 34c16 0 28 12 28 27S66 90 50 90 22 78 22 61s12-27 28-27Z" />
      {/* El agujero de arriba, por donde entra la pajilla. */}
      <path d="M40 40q10 7 20 0" strokeWidth={4} />
      {/* La pajilla, inclinada: derecha parece un palo clavado. */}
      <path d="M54 40 72 12" strokeWidth={5} />
      <path d="M72 12q6-4 10 0" strokeWidth={4.5} />
      {/* Una hojita, que es lo que lo manda a la playa. */}
      <path d="M40 38q-14-10-22-4 4 10 22 4Z" strokeWidth={4} />
    </svg>
  );
}

/** Manzana. */
export function Manzana({ className }: Dibujo) {
  return (
    <svg viewBox="0 0 100 100" className={className} {...trazo}>
      <path d="M50 32c6-6 16-7 22-1 7 7 6 20 0 31-5 9-12 20-22 20s-17-11-22-20c-6-11-7-24 0-31 6-6 16-5 22 1Z" />
      <path d="M50 32V19" strokeWidth={4.5} />
      {/* La hoja. */}
      <path d="M50 22c6-8 15-8 18-6-1 6-8 11-18 6Z" strokeWidth={4} />
    </svg>
  );
}

/** Hoja de palmera. */
export function Palmera({ className }: Dibujo) {
  return (
    <svg viewBox="0 0 100 100" className={className} {...trazo}>
      <path d="M50 88C50 60 52 36 62 14" strokeWidth={5} />
      {/* Las pinnas, a pares y decreciendo hacia la punta. */}
      <path d="M58 30c-9-6-20-6-27 1M58 30c10-4 20-1 25 7M55 46c-10-5-21-3-27 5M55 46c10-3 20 1 24 9M52 62c-9-4-19-1-24 6M52 62c9-2 18 2 21 9" strokeWidth={4} />
    </svg>
  );
}

/** Hoja tropical tipo costilla de Adán. */
export function Monstera({ className }: Dibujo) {
  return (
    <svg viewBox="0 0 100 100" className={className} {...trazo}>
      <path d="M50 86C42 62 30 48 30 34c0-12 9-20 20-20s20 8 20 20c0 14-12 28-20 52Z" />
      <path d="M50 78V26" strokeWidth={4} />
      {/* Los cortes, que son lo que la identifica. */}
      <path d="M50 40H36M50 54H39M50 40h14M50 54h11" strokeWidth={3.5} opacity={0.75} />
    </svg>
  );
}

/** Nube de crayón: el trazo a mano alzada que repite en sus fondos. */
export function Nube({ className }: Dibujo) {
  return (
    <svg viewBox="0 0 120 70" className={className} {...trazo} strokeWidth={4}>
      <path d="M18 52q-14-2-12-14t16-10q2-18 20-18t22 14q16-8 26 4t4 24q6 6-2 12" />
      <path d="M26 60q-10 0-9-8" strokeWidth={3.5} opacity={0.7} />
    </svg>
  );
}

/** Estrella de cuatro puntas cóncavas. La que salpica sus carruseles. */
export function Estrella({ className }: Dibujo) {
  return (
    <svg viewBox="0 0 40 40" className={className} fill="currentColor">
      {/* Cóncavas: una estrella de rombos se lee como diamante. */}
      <path d="M20 0q4 16 20 20-16 4-20 20-4-16-20-20 16-4 20-20Z" />
    </svg>
  );
}

/** Rayitas sueltas: el gesto de "brillo" a mano. */
export function Rayas({ className }: Dibujo) {
  return (
    <svg viewBox="0 0 50 40" className={className} {...trazo} strokeWidth={4}>
      <path d="M4 30 16 6M22 34 32 4M38 30l8-18" />
    </svg>
  );
}

/* ────────────────────────── El envoltorio ────────────────────────── */

/**
 * Las animaciones disponibles. Los `@keyframes` viven en globals.css.
 *
 * TODAS mueven SOLO `transform` y `opacity`, que van en el compositor y no
 * provocan reflow. Cualquiera que toque ancho, alto o posicion obligaria al
 * navegador a recalcular la maqueta en cada fotograma — con veinte adornos en
 * pantalla, eso se siente en un telefono.
 */
export type AnimacionDecorado =
  | "zoom"
  | "giro"
  | "vaiven"
  | "flotar"
  | "deriva"
  | "destello";

export type Decorado = {
  /** El dibujo. */
  children: ReactNode;
  /** Posición y tamaño: clases de Tailwind. Ej: `"left-[8%] top-[20%] w-20"` */
  className: string;
  animacion?: AnimacionDecorado;
  /** Segundos. Escalona los adornos para que no se muevan a coro. */
  retraso?: number;
  /** Segundos que dura un ciclo. Por defecto, uno lento por animación. */
  duracion?: number;
  /** 0 a 1. Los adornos son fondo: rara vez pasan de 0,5. */
  opacidad?: number;
};

type EstiloDecorado = CSSProperties & Record<`--${string}`, string>;

/**
 * Coloca y anima UN adorno.
 *
 * El envoltorio existe porque `transform` es una sola propiedad: si la
 * animacion y la posicion se declararan en el mismo elemento, la segunda
 * pisaria a la primera. Aqui el `<span>` posiciona y el de dentro anima.
 */
export function Adorno({
  children,
  className,
  animacion,
  retraso = 0,
  duracion,
  opacidad = 0.35,
}: Decorado) {
  return (
    <span className={`absolute ${className}`} style={{ opacity: opacidad }}>
      <span
        className={animacion ? `deco deco-${animacion}` : undefined}
        style={
          {
            "--deco-retraso": `${retraso}s`,
            ...(duracion ? { "--deco-duracion": `${duracion}s` } : {}),
          } as EstiloDecorado
        }
      >
        {children}
      </span>
    </span>
  );
}

/**
 * La capa de adornos de una seccion.
 *
 * `inset-0` mas `overflow-hidden`: un adorno colocado cerca del borde puede
 * asomar fuera, y sin recorte el documento gana ancho y aparece scroll
 * horizontal. Ya paso con las olas del hero.
 *
 * `-z-10` lo manda detras del contenido. La seccion que lo use necesita
 * `relative isolate` para que ese z-index no se escape a la pagina entera.
 */
export function CapaDecorados({ children }: { children: ReactNode }) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
    >
      {children}
    </div>
  );
}
