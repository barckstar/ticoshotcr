import type { CSSProperties, ReactNode } from "react";

/**
 * LOS ELEMENTOS DECORATIVOS DEL SITIO.
 *
 * Fruta y motivos tropicales en LINEA FINA Y CONTINUA, del mismo tipo que los
 * iconos de referencia que paso el cliente: trazo parejo, punta redonda, sin
 * relleno salvo donde la forma lo pide, y detalle suficiente para que cada uno
 * se reconozca solo.
 *
 * ============ SE REDIBUJARON ENTEROS ============
 * La primera version eran garabatos de crayon —trazo de 5 sobre lienzo de 100,
 * o sea el doble de grueso que esto— y no daban el nivel. El problema no era el
 * grosor solo: un trazo gordo se come el detalle, y sin detalle una naranja,
 * una manzana y un tomate son el mismo circulo con un rabito.
 *
 * Aqui el trazo es de 3 y cada dibujo lleva lo que lo hace unico: los ocho
 * gajos y el doble anillo de la corteza en la rodaja, el caliz de cinco hojas
 * del tomate, la muesca del tallo en la manzana, las escamas de la piña.
 * ================================================
 *
 * ============ POR QUE VIVEN EN `shared/` ============
 * Los usan el hero y TODAS las secciones. Metidos en `features/hero/`, el
 * catalogo tendria que importar de otra feature — lo unico que la arquitectura
 * prohibe de plano. Y ademas dejarian de ser reciclables.
 * ====================================================
 *
 * ============ POR QUE SVG EN LINEA Y NO IMAGENES ============
 *   - Son decenas repartidas por la pagina. Como <img> serian decenas de
 *     peticiones de red, y varias estan sobre el pliegue compitiendo con el LCP.
 *   - Heredan `currentColor`, asi que el mismo dibujo sirve en cualquier color
 *     de la paleta sin tener un archivo por variante.
 *   - Escalan sin pixelarse, de los 24px de un adorno chico a los 200 de uno
 *     grande. Un PNG de banco de iconos a 512 se ve blando en cuanto crece.
 *   - Son DIBUJOS PROPIOS, no un paquete descargado: no arrastran la
 *     atribucion que casi todas las licencias gratuitas de iconos exigen.
 * =============================================================
 *
 * TODOS SON DECORATIVOS. El contenedor lleva `aria-hidden` y `pointer-events:
 * none`: no se anuncian a un lector de pantalla —seria ruido puro— y nunca
 * roban un clic destinado a lo que tienen debajo.
 */

/* ────────────────────────── El trazo comun ────────────────────────── */

type Dibujo = { className?: string };

/**
 * El pulso de todos los dibujos.
 *
 * ============ POR QUE 3 Y NO 5 ============
 * Los iconos de referencia llevan ~11px de trazo sobre un lienzo de 512, que
 * en este de 100 son 2,15. Aqui se usa 3 —un pelo mas gordo— porque estos van
 * a un tercio de opacidad detras del texto, y a 2,15 el dibujo desaparece en
 * vez de insinuarse.
 *
 * Y a la inversa: al ADELGAZAR el trazo hubo que SUBIR la opacidad. La tinta
 * total es grosor por opacidad, y es la tinta —no la opacidad sola— lo que
 * cuenta para el reparto 70/30/10. Cinco al 22% y tres al 40% manchan casi
 * igual; el segundo se lee.
 * ==========================================
 */
const trazo = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 3,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

/* ────────────────────────── La fruta ────────────────────────── */

/**
 * Rodaja de naranja: ocho gajos y el doble anillo de la corteza.
 *
 * ============ EL GAJO SE DIBUJA UNA VEZ ============
 * Hay UN path y ocho rotaciones de 45°, no ocho paths a mano. Escritos uno por
 * uno habria que calcular dieciseis pares de coordenadas con senos y cosenos, y
 * el primero que saliera con un decimal de mas dejaria un gajo torcido — el
 * tipo de fallo que no se ve en el codigo y salta en pantalla.
 *
 * Con la rotacion la simetria esta GARANTIZADA por construccion.
 * ===================================================
 */
const GAJO =
  // Del borde interior al exterior, arco por fuera, y vuelta al centro.
  "M-2.16-6.66 L-11.43-35.19 A37 37 0 0 1 11.43-35.19 L2.16-6.66 " +
  "A7 7 0 0 0 -2.16-6.66 Z";

const VUELTAS = [0, 45, 90, 135, 180, 225, 270, 315];

export function RodajaNaranja({ className }: Dibujo) {
  return (
    <svg viewBox="0 0 100 100" className={className} {...trazo}>
      {/* Los dos anillos son la CORTEZA vista de canto. Sin el interior la
          rodaja se lee como una rueda de carro. */}
      <circle cx="50" cy="50" r="47" />
      <circle cx="50" cy="50" r="42" />
      <g transform="translate(50 50)">
        {VUELTAS.map((a) => (
          <path key={a} d={GAJO} transform={`rotate(${a})`} />
        ))}
      </g>
    </svg>
  );
}

/**
 * Naranja entera con un gajo cortado delante. De la sangria.
 *
 * El gajo delante no es adorno: una naranja entera sola es un circulo con una
 * hoja, o sea lo mismo que la manzana y el tomate a tamaño chico. El corte es
 * lo que la vuelve inconfundible sin tener que leer nada.
 */
export function Naranja({ className }: Dibujo) {
  return (
    <svg viewBox="0 0 100 100" className={className} {...trazo}>
      {/* La fruta entera, detras y desplazada a la izquierda. */}
      <path d="M44 20a33 33 0 1 0 12 64" />
      <path d="M50 21a33 33 0 0 1 20 10" strokeWidth={2.4} />
      {/* Hoja y tallo. */}
      <path d="M44 20q-2-10 6-11 3 5 1 11" strokeWidth={2.6} />
      <path d="M43 19q-12 1-13-11 12-1 13 11Z" strokeWidth={2.6} />

      {/* El gajo: media rodaja apoyada, con su corteza y tres cuñas. */}
      <path d="M28 62h58a29 29 0 0 1-58 0Z" />
      <path d="M34 62a23 23 0 0 0 46 0" strokeWidth={2.4} />
      <path d="M57 62v23M57 62 40 78M57 62l17 16" strokeWidth={2.4} />
      {/* Las pepitas, que es lo que remata el corte. */}
      <path d="M48 71v2M66 71v2M57 78v2" strokeWidth={2.6} />
    </svg>
  );
}

/** Media lima: la media luna con sus gajos. */
export function Lima({ className }: Dibujo) {
  return (
    <svg viewBox="0 0 100 100" className={className} {...trazo}>
      <path d="M14 66a36 36 0 0 1 72 0Z" />
      <path d="M21 66a29 29 0 0 1 58 0" strokeWidth={2.4} />
      {/* Cinco cuñas desde el centro del corte. */}
      <path
        d="M50 66V37M50 66 30 52M50 66l20-14M50 66 37 43M50 66l13-23"
        strokeWidth={2.4}
      />
    </svg>
  );
}

/**
 * Piña. Para eventos y catering, que es donde se monta la barra.
 *
 * ============ LAS ESCAMAS SON GALONES, NO UNA REJILLA ============
 * La rejilla en diagonal de la piña de verdad se sale del cuerpo por los
 * lados, y recortarla pide un `clipPath` — que necesita un `id` unico, y estos
 * dibujos se repiten en la pagina: dos con el mismo `id` y el navegador aplica
 * el primero a los dos.
 *
 * Los galones se colocan por fila DENTRO del ancho que el ovalo deja a esa
 * altura, asi que no hace falta recortar nada. Y a tamaño chico leen igual.
 * ==================================================================
 */
export function Pina({ className }: Dibujo) {
  return (
    <svg viewBox="0 0 100 100" className={className} {...trazo}>
      {/* El cuerpo. */}
      <ellipse cx="50" cy="63" rx="22" ry="27" />

      {/* Las escamas. Cada fila cabe en el ancho del ovalo a su altura. */}
      <g strokeWidth={2.2}>
        <path d="M35 46l5 5 5-5M45 46l5 5 5-5M55 46l5 5 5-5" />
        <path d="M30 55l5 5 5-5M40 55l5 5 5-5M50 55l5 5 5-5M60 55l5 5 5-5" />
        <path d="M30 64l5 5 5-5M40 64l5 5 5-5M50 64l5 5 5-5M60 64l5 5 5-5" />
        <path d="M30 73l5 5 5-5M40 73l5 5 5-5M50 73l5 5 5-5M60 73l5 5 5-5" />
        <path d="M35 82l5 5 5-5M45 82l5 5 5-5M55 82l5 5 5-5" />
      </g>

      {/* El penacho: cinco hojas cerradas, de dentro hacia afuera. */}
      <path d="M50 36q-5-12 0-22 5 10 0 22Z" strokeWidth={2.6} />
      <path d="M48 37q-10-8-12-19 12 4 12 19Z" strokeWidth={2.6} />
      <path d="M52 37q10-8 12-19-12 4-12 19Z" strokeWidth={2.6} />
      <path d="M46 38q-13-3-18-11 13-2 18 11Z" strokeWidth={2.6} />
      <path d="M54 38q13-3 18-11-13-2-18 11Z" strokeWidth={2.6} />
    </svg>
  );
}

/**
 * Coco partido. El del miguelito.
 *
 * ============ LOS DOS CIRCULOS VAN DESCENTRADOS ============
 * Se dibujo tres veces. Las dos primeras tenian el hueco CONCENTRICO con la
 * cascara, y a 100px y un tercio de opacidad eso no es un coco: es una diana.
 *
 * Descentrando el interior, la corteza pasa de 5px a la derecha a 17 a la
 * izquierda. Esa banda desigual es exactamente lo que dice "media cascara
 * vista de lado" — y es lo unico que sobrevive cuando el dibujo se encoge. Los
 * pelos del borde grueso rematan la lectura.
 * ===========================================================
 */
export function Coco({ className }: Dibujo) {
  return (
    <svg viewBox="0 0 100 100" className={className} {...trazo}>
      <circle cx="50" cy="52" r="36" />
      <circle cx="56" cy="48" r="25" strokeWidth={2.6} />
      {/* La fibra de la cascara, solo donde se ve gruesa. */}
      <g strokeWidth={2.2}>
        <path d="M20 70l5-4M15 59l6-2M14 47l6 1M19 36l5 4M27 27l4 5" />
      </g>
      {/* El borde del corte, que separa la pulpa del hueco. */}
      <path d="M43 32a25 25 0 0 1 24 4" strokeWidth={2.2} />
    </svg>
  );
}

/** Manzana, con la muesca del tallo y su hoja. */
export function Manzana({ className }: Dibujo) {
  return (
    <svg viewBox="0 0 100 100" className={className} {...trazo}>
      <path d="M50 32c7-8 20-9 27 0 8 10 6 28-2 42-6 11-13 18-25 18s-19-7-25-18c-8-14-10-32-2-42 7-9 20-8 27 0Z" />
      {/* El tallo sale de la MUESCA, no de la coronilla: es lo que la separa
          de la naranja a tamaño chico. */}
      <path d="M50 32q-1-9-5-14" strokeWidth={2.6} />
      <path d="M52 26q2-13 16-13 2 12-16 13Z" strokeWidth={2.6} />
      <path d="M71 64q4-6 5-13" strokeWidth={2.4} />
    </svg>
  );
}

/** Tomate. El del chiliguaro. */
export function Tomate({ className }: Dibujo) {
  return (
    <svg viewBox="0 0 100 100" className={className} {...trazo}>
      {/* Mas ancho que alto: es lo primero que lo separa de la manzana. */}
      <ellipse cx="50" cy="59" rx="27" ry="25" />
      {/* El caliz: cinco hojas, dos abiertas y dos altas. */}
      <g strokeWidth={2.6}>
        <path d="M50 34q-13-1-18-8 12-5 18 8Z" />
        <path d="M50 34q13-1 18-8-12-5-18 8Z" />
        <path d="M50 34q-8-6-7-14 10 4 7 14Z" />
        <path d="M50 34q8-6 7-14-10 4-7 14Z" />
        <path d="M50 34v-12" />
      </g>
      <path d="M33 54q3-8 11-12" strokeWidth={2.4} />
    </svg>
  );
}

/**
 * Chile picante.
 *
 * ============ LA PUNTA ES TODO ============
 * El primero salio berenjena: cuerpo gordo y parejo, curva floja y la punta
 * redondeada. Un chile no es un ovalo curvado — es una vaina ANCHA ARRIBA que
 * se afila hasta un pico, y la vaina tiene que girar de verdad, no insinuar la
 * curva.
 *
 * Aqui el borde derecho baja recto y el izquierdo se le acerca hasta cerrar en
 * un pico en (30,84). Esa asimetria entre los dos lados es lo que lo separa de
 * cualquier otra hortaliza redonda del juego.
 * ==========================================
 */
export function Chile({ className }: Dibujo) {
  return (
    <svg viewBox="0 0 100 100" className={className} {...trazo}>
      <path d="M53 31C69 37 71 59 59 73c-9 10-21 14-28 12-4-2-1-6 5-8 14-5 22-19 19-42Z" />
      {/* El cabillo, con su curva y el gancho del final. */}
      <path d="M53 31q-4-9 2-13" strokeWidth={2.6} />
      <path d="M55 18q8 0 9 8" strokeWidth={2.6} />
      {/* El hombro, donde el fruto se pega al cabillo. */}
      <path d="M48 33q6 2 9 6" strokeWidth={2.2} />
    </svg>
  );
}

/* ────────────────────────── Lo tropical ────────────────────────── */

/**
 * Rama de palma. La unica RELLENA del juego.
 *
 * Va maciza a proposito: entre tanto contorno hace falta una pieza con peso, o
 * la pagina entera se lee como un plano tecnico.
 *
 * ============ ES PLUMA, NO ABANICO ============
 * Se probo primero como abanico —seis hojas saliendo de un mismo punto— y
 * quedo una mancha: al converger todas en el centro, los seis rellenos se
 * funden en un borron del que no sale ninguna forma.
 *
 * Repartidas A LO LARGO DE UN TALLO no se tocan nunca, y ademas es lo que hace
 * la palma de verdad. Menguan hacia la punta porque una rama de folioalos
 * todos iguales se lee como un peine.
 * ==============================================
 *
 * Elipses giradas y no paths: los pares quedan simetricos por construccion, sin
 * calcular una sola curva a mano.
 */
const FOLIOLOS = [
  { cx: 6.8, cy: 68.3, a: -140, rx: 15 },
  { cx: 25.2, cy: 68.3, a: -40, rx: 15 },
  { cx: 12.8, cy: 53.3, a: -140, rx: 14 },
  { cx: 31.2, cy: 53.3, a: -40, rx: 14 },
  { cx: 23.8, cy: 39.3, a: -140, rx: 12.5 },
  { cx: 42.2, cy: 39.3, a: -40, rx: 12.5 },
  { cx: 37.8, cy: 27.3, a: -140, rx: 10.5 },
  { cx: 56.2, cy: 27.3, a: -40, rx: 10.5 },
  { cx: 66, cy: 24, a: -62, rx: 9 },
];

export function HojaPalma({ className }: Dibujo) {
  return (
    <svg viewBox="0 0 100 100" className={className} fill="currentColor">
      {FOLIOLOS.map(({ cx, cy, a, rx }, i) => (
        <ellipse
          key={i}
          cx={cx}
          cy={cy}
          rx={rx}
          ry="3.6"
          transform={`rotate(${a} ${cx} ${cy})`}
        />
      ))}
      {/* El raquis, que es lo que las ensarta a todas. */}
      <path
        d="M14 92C14 64 32 40 66 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

/**
 * Hoja tipo costilla de Adan.
 *
 * ============ LOS CORTES VAN EN EL CONTORNO ============
 * La primera version era un ovalo cerrado con rayas cruzandolo por dentro, y
 * eso no es una monstera: es un globo con una red encima. Los cortes de esta
 * planta se MUERDEN EL BORDE — entran desde afuera y se paran antes del nervio
 * central. Si el contorno sigue siendo liso, no hay dibujo que lo arregle.
 *
 * Aqui el contorno los lleva dentro: sale al ancho, vuelve hacia el nervio,
 * sale otra vez. Y se dibuja UNA MITAD, espejada con `scale(-1 1)`: escrita dos
 * veces a mano, el dia que se retoque un lobulo el otro lado se queda como
 * estaba y la hoja sale coja.
 * =======================================================
 */
/*
  ANCHA, casi tanto como alta. La primera salio de 48 de ancho por 74 de alto y
  con esa proporcion no es una monstera: es una hoja de roble. Esta planta tiene
  la hoja casi redonda —72 por 78 aqui— y lo mas ancho a media altura.
*/
const MITAD_MONSTERA =
  "M50 10 C64 10 73 17 74 28 L57 32 C75 34 86 40 86 50 L58 54 " +
  "C74 56 81 60 79 68 L57 70 C65 72 69 75 67 81 C62 86 54 88 50 88";

export function Monstera({ className }: Dibujo) {
  return (
    <svg viewBox="0 0 100 100" className={className} {...trazo}>
      <path d={MITAD_MONSTERA} />
      <path d={MITAD_MONSTERA} transform="translate(100 0) scale(-1 1)" />
      {/* Nervio central y peciolo. */}
      <path d="M50 12v76" strokeWidth={2.4} />
      <path d="M50 88q0 6-4 9" strokeWidth={2.6} />
    </svg>
  );
}

/** Palmera entera. Para la playa y la seccion de entregas. */
export function Palmera({ className }: Dibujo) {
  return (
    <svg viewBox="0 0 100 100" className={className} {...trazo}>
      {/* El tronco, con sus anillos. Dos curvas que se abren hacia abajo. */}
      <path d="M43 92q0-30 5-54M57 92q0-30-5-54" />
      <g strokeWidth={2.2}>
        <path d="M45 80h10M44 70h11M45 60h9M46 51h8M47 44h6" />
      </g>
      {/* Cinco pencas desde la corona. */}
      <g strokeWidth={2.6}>
        <path d="M50 38c-15-2-29 2-37 11 2-15 21-24 37-11Z" />
        <path d="M50 38c-11-11-25-17-37-15 8-11 29-7 37 15Z" />
        <path d="M50 38c15-2 29 2 37 11-2-15-21-24-37-11Z" />
        <path d="M50 38c11-11 25-17 37-15-8-11-29-7-37 15Z" />
        <path d="M50 38c-3-13 1-25 9-31 7 13 2 25-9 31Z" />
      </g>
      {/* Los cocos de la corona. */}
      <circle cx="44" cy="43" r="3" strokeWidth={2.4} />
      <circle cx="55" cy="44" r="3" strokeWidth={2.4} />
    </svg>
  );
}

/** Velero. El unico motivo de mar del juego; va donde se habla de entregas. */
export function Velero({ className }: Dibujo) {
  return (
    <svg viewBox="0 0 100 100" className={className} {...trazo}>
      {/* Casco. */}
      <path d="M12 68h76q-6 17-22 17H34Q18 85 12 68Z" />
      <circle cx="30" cy="76" r="3" strokeWidth={2.4} />
      {/* Mastil y las dos velas. */}
      <path d="M50 64V13" />
      <path d="M56 64V22l22 42Z" />
      <path d="M44 64V20L18 64Z" />
      <path d="M44 34H27M44 48H21" strokeWidth={2.2} />
      {/* El agua. */}
      <path d="M6 92q7-5 14 0t14 0 14 0 14 0 14 0" strokeWidth={2.4} />
    </svg>
  );
}

/* ────────────────────────── Los garabatos de sus posts ────────────────────────── */

/** Nube de trazo suelto: el gesto a mano alzada de sus fondos. */
export function Nube({ className }: Dibujo) {
  return (
    <svg viewBox="0 0 120 70" className={className} {...trazo} strokeWidth={2.8}>
      <path d="M18 52q-14-2-12-14t16-10q2-18 20-18t22 14q16-8 26 4t4 24q6 6-2 12" />
      <path d="M26 60q-10 0-9-8" strokeWidth={2.4} />
    </svg>
  );
}

/** Estrella de cuatro puntas concavas. La que salpica sus carruseles. */
export function Estrella({ className }: Dibujo) {
  return (
    <svg viewBox="0 0 40 40" className={className} fill="currentColor">
      {/* Concavas: una estrella de rombos se lee como diamante. */}
      <path d="M20 0q4 16 20 20-16 4-20 20-4-16-20-20 16-4 20-20Z" />
    </svg>
  );
}

/** Rayitas sueltas: el gesto de "brillo" a mano. */
export function Rayas({ className }: Dibujo) {
  return (
    <svg viewBox="0 0 50 40" className={className} {...trazo} strokeWidth={3}>
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
  /** 0 a 1. Son fondo: con este trazo fino se mueven entre 0,3 y 0,5. */
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
  opacidad = 0.4,
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
