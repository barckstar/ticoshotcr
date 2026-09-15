import {
  Adorno,
  CapaDecorados,
  Chile,
  Coco,
  Estrella,
  HojaPalma,
  Lima,
  Manzana,
  Monstera,
  Naranja,
  Nube,
  Palmera,
  Pina,
  Rayas,
  RodajaNaranja,
  Tomate,
  Velero,
  type AnimacionDecorado,
} from "./Decorados";

/**
 * El juego de adornos de cada seccion, listo para usar en una linea.
 *
 * ============ POR QUE UNA RECETA POR SECCION Y NO ADORNOS SUELTOS ============
 * Colocarlos a mano en cada seccion tiene dos problemas que solo se ven con el
 * sitio entero delante:
 *
 *   1. Se repiten sin querer. Con nueve secciones y quince dibujos, es facil
 *      poner el mismo tomate en el mismo sitio dos veces y que el sitio se vea
 *      con plantilla.
 *   2. Se acumulan. Cada uno parece inofensivo, pero veinte adornos animados a
 *      la vez son veinte capas en el compositor.
 *
 * Con las recetas aqui se ve DE UN VISTAZO cuantos hay en cada seccion y si
 * alguno se repite. Ninguna pasa de cinco.
 * ============================================================================
 *
 * LA FRUTA NO ES AL AZAR: cada seccion lleva la de su contenido. El tomate y el
 * chile donde se habla del chiliguaro, el coco donde el miguelito, la naranja
 * y la lima donde la sangria, la piña donde se monta la barra. Un adorno que
 * tiene que ver con lo que se lee deja de ser relleno.
 */

/**
 * ============ LA OPACIDAD DEPENDE DEL COLOR, NO DEL CAPRICHO ============
 * Todos iban al 22% y los claros quedaban en aranazos. No era una impresion:
 * el menta #98EDD8 sobre el crema #FFF4EC da 1,30:1 y el #7FD4C1 da 1,61:1 —a
 * plena opacidad—, asi que al 22% no es que se vean poco, es que no estan.
 *
 * Los oscuros son el caso contrario: el vino da 10,30:1, y pasado 0,35 dejan de
 * ser fondo y se ponen a pelear con el texto de encima.
 *
 * Asi que son dos niveles. Y el de los claros es ALTO a proposito: un color de
 * 1,6:1 al 80% sigue siendo una insinuacion, no una mancha. Lo que cuenta para
 * el reparto 70/30/10 es la TINTA —color por grosor por opacidad—, nunca el
 * numero de la opacidad suelto.
 * ========================================================================
 */
/** Vino, rojo: pesan solos. Mas arriba dejan de ser fondo. */
const TENUE = 0.3;
/** Menta, crayon, amarillo: sin esto no llegan a verse. */
const VIVO = 0.8;

export type VarianteDecorado =
  | "catalogo"
  | "kits"
  | "ritual"
  | "nosotros"
  | "eventos"
  | "resenas"
  | "entrega"
  | "faq";

type Pieza = {
  /** El dibujo. */
  dibujo: React.ReactNode;
  /** Posición y tamaño. */
  donde: string;
  /** Color: siempre uno de la paleta, vía `text-*`. */
  color: string;
  animacion: AnimacionDecorado;
  retraso?: number;
  duracion?: number;
  opacidad: number;
};

/*
  Las posiciones van en PORCENTAJE y no en pixeles: una seccion mide distinto
  en un telefono que en un escritorio, y un adorno anclado a 200px del borde
  izquierdo termina encima del texto en cuanto la columna se estrecha.

  Varias llevan `hidden lg:block`. No es capricho: en movil el ancho util es la
  columna de texto entera, asi que los adornos laterales no tienen donde
  ponerse sin estorbar. Se quedan los de las esquinas.

  ============ LOS TAMAÑOS TIENEN QUE SER MUY DISTINTOS ============
  Estaban todos entre w-20 y w-36 — un tercio de diferencia entre el mayor y el
  menor. A esa distancia el ojo no lee "grande y chico", lee "todos parecidos",
  y el fondo entero se vuelve una cenefa repetida.

  Ahora cada seccion tiene UNA pieza de ancla grande (w-44 a w-60 en escritorio),
  una media y una o dos chicas, con hasta quince veces de diferencia entre la
  mayor y la menor. Esa distancia es la que da profundidad y la que hace que se
  lea pintado a mano y no colocado por un script.

  La grande siempre va en una ESQUINA y casi siempre en `hidden lg:block`: en el
  centro competiria con el texto, y en movil no cabe.
  ==================================================================
*/
const recetas: Record<VarianteDecorado, Pieza[]> = {
  catalogo: [
    { dibujo: <Tomate className="w-full" />, donde: "left-[2%] top-[8%] w-32 sm:w-44", color: "text-chiliguaro", animacion: "giro", duracion: 46, opacidad: TENUE },
    { dibujo: <Chile className="w-full" />, donde: "right-[6%] top-[30%] w-14 sm:w-20", color: "text-acento", animacion: "vaiven", retraso: 1.2, opacidad: TENUE },
    { dibujo: <Coco className="w-full" />, donde: "left-[7%] bottom-[10%] hidden w-24 lg:block", color: "text-sangria", animacion: "zoom", retraso: 0.6, opacidad: TENUE },
    { dibujo: <RodajaNaranja className="w-full" />, donde: "right-[2%] bottom-[6%] hidden w-52 lg:block", color: "text-sangria", animacion: "giro", duracion: 60, retraso: 2, opacidad: TENUE },
    { dibujo: <Estrella className="w-full" />, donde: "left-[22%] top-[6%] w-4 sm:w-6", color: "text-estrella", animacion: "destello", opacidad: VIVO },
  ],

  kits: [
    { dibujo: <Coco className="w-full" />, donde: "right-[2%] top-[8%] w-40 sm:w-56", color: "text-sangria", animacion: "zoom", opacidad: TENUE },
    { dibujo: <Lima className="w-full" />, donde: "left-[5%] top-[36%] w-14 sm:w-20", color: "text-menta", animacion: "flotar", retraso: 1, opacidad: VIVO },
    { dibujo: <HojaPalma className="w-full" />, donde: "left-[9%] bottom-[6%] hidden w-28 lg:block", color: "text-menta", animacion: "vaiven", retraso: 0.4, duracion: 11, opacidad: VIVO },
    { dibujo: <Estrella className="w-full" />, donde: "right-[20%] bottom-[16%] w-4 sm:w-5", color: "text-estrella", animacion: "destello", retraso: 1.6, opacidad: VIVO },
  ],

  ritual: [
    { dibujo: <Chile className="w-full" />, donde: "left-[3%] top-[14%] w-24 sm:w-32", color: "text-acento", animacion: "vaiven", opacidad: TENUE },
    { dibujo: <Lima className="w-full" />, donde: "right-[2%] top-[34%] w-40 sm:w-56", color: "text-menta", animacion: "giro", duracion: 52, retraso: 1.4, opacidad: VIVO },
    { dibujo: <Rayas className="w-full" />, donde: "left-[26%] top-[8%] w-10 sm:w-14", color: "text-menta", animacion: "destello", retraso: 0.8, opacidad: VIVO },
    { dibujo: <Nube className="w-full" />, donde: "left-[2%] bottom-[6%] hidden w-36 lg:block", color: "text-crayon", animacion: "deriva", retraso: 2, opacidad: VIVO },
  ],

  nosotros: [
    { dibujo: <Monstera className="w-full" />, donde: "right-[2%] top-[6%] w-40 sm:w-60", color: "text-menta", animacion: "vaiven", duracion: 12, opacidad: VIVO },
    { dibujo: <Naranja className="w-full" />, donde: "left-[6%] bottom-[14%] hidden w-16 lg:block", color: "text-sangria", animacion: "flotar", retraso: 1, opacidad: TENUE },
    { dibujo: <Nube className="w-full" />, donde: "left-[7%] top-[10%] w-24 sm:w-32", color: "text-crayon", animacion: "deriva", retraso: 0.5, opacidad: VIVO },
  ],

  eventos: [
    { dibujo: <Pina className="w-full" />, donde: "left-[2%] top-[8%] w-32 sm:w-44", color: "text-menta", animacion: "zoom", duracion: 10, opacidad: VIVO },
    { dibujo: <Palmera className="w-full" />, donde: "right-[2%] bottom-[4%] hidden w-44 lg:block", color: "text-menta", animacion: "vaiven", retraso: 1.8, duracion: 13, opacidad: VIVO },
    { dibujo: <Lima className="w-full" />, donde: "right-[4%] top-[26%] w-12 sm:w-16", color: "text-menta", animacion: "flotar", retraso: 0.7, opacidad: VIVO },
    { dibujo: <Estrella className="w-full" />, donde: "left-[24%] bottom-[14%] w-4 sm:w-6", color: "text-estrella", animacion: "destello", retraso: 1.2, opacidad: VIVO },
  ],

  resenas: [
    { dibujo: <Nube className="w-full" />, donde: "left-[4%] top-[10%] w-32 sm:w-44", color: "text-crayon", animacion: "deriva", opacidad: VIVO },
    { dibujo: <Manzana className="w-full" />, donde: "right-[6%] bottom-[16%] hidden w-16 lg:block", color: "text-sangria", animacion: "zoom", retraso: 1.1, opacidad: TENUE },
    { dibujo: <Estrella className="w-full" />, donde: "right-[16%] top-[16%] w-5 sm:w-7", color: "text-estrella", animacion: "destello", opacidad: VIVO },
    { dibujo: <Estrella className="w-full" />, donde: "left-[6%] bottom-[26%] w-3 sm:w-4", color: "text-estrella", animacion: "destello", retraso: 1.9, opacidad: VIVO },
  ],

  entrega: [
    { dibujo: <Velero className="w-full" />, donde: "left-[3%] bottom-[10%] w-32 sm:w-44", color: "text-crayon", animacion: "flotar", duracion: 11, opacidad: VIVO },
    { dibujo: <Palmera className="w-full" />, donde: "right-[2%] top-[8%] w-40 sm:w-56", color: "text-menta", animacion: "vaiven", retraso: 1.3, opacidad: VIVO },
    { dibujo: <Monstera className="w-full" />, donde: "right-[24%] bottom-[14%] hidden w-20 lg:block", color: "text-menta", animacion: "vaiven", retraso: 0.9, duracion: 14, opacidad: VIVO },
  ],

  faq: [
    { dibujo: <RodajaNaranja className="w-full" />, donde: "left-[2%] top-[10%] w-36 sm:w-52", color: "text-sangria", animacion: "giro", duracion: 50, opacidad: TENUE },
    { dibujo: <Tomate className="w-full" />, donde: "right-[6%] top-[38%] w-16 sm:w-20", color: "text-chiliguaro", animacion: "zoom", retraso: 1.5, opacidad: TENUE },
    { dibujo: <Estrella className="w-full" />, donde: "left-[20%] bottom-[12%] w-4 sm:w-6", color: "text-estrella", animacion: "destello", retraso: 0.6, opacidad: VIVO },
  ],
};

/**
 * Pinta el juego de adornos de una seccion.
 *
 * La seccion que lo use necesita `relative isolate`: `relative` para que las
 * posiciones absolutas se midan contra ella, e `isolate` para que el `-z-10`
 * de la capa no se escape y mande los adornos detras del fondo de la pagina.
 */
export function DecoradosSeccion({ variante }: { variante: VarianteDecorado }) {
  return (
    <CapaDecorados>
      {recetas[variante].map((p, i) => (
        <Adorno
          key={i}
          className={`${p.donde} ${p.color}`}
          animacion={p.animacion}
          retraso={p.retraso}
          duracion={p.duracion}
          opacidad={p.opacidad}
        >
          {p.dibujo}
        </Adorno>
      ))}
    </CapaDecorados>
  );
}
