import {
  Adorno,
  CapaDecorados,
  Chile,
  Coco,
  Estrella,
  Lima,
  Manzana,
  Monstera,
  Naranja,
  Nube,
  Palmera,
  Rayas,
  Tomate,
  type AnimacionDecorado,
} from "./Decorados";

/**
 * El juego de adornos de cada seccion, listo para usar en una linea.
 *
 * ============ POR QUE UNA RECETA POR SECCION Y NO ADORNOS SUELTOS ============
 * Colocarlos a mano en cada seccion tiene dos problemas que solo se ven con el
 * sitio entero delante:
 *
 *   1. Se repiten sin querer. Con nueve secciones y once dibujos, es facil
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
 * y la lima donde la sangria. Un adorno que tiene que ver con lo que se lee
 * deja de ser relleno.
 *
 * LA OPACIDAD ES BAJA A PROPOSITO —entre 0,16 y 0,3— porque son FONDO. Subirla
 * los pone a competir con el texto que llevan encima, y ademas rompe el
 * reparto 70/30/10: manchas grandes de color de etiqueta donde deberia haber
 * superficie.
 */

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
  opacidad?: number;
};

/*
  Las posiciones van en PORCENTAJE y no en pixeles: una seccion mide distinto
  en un telefono que en un escritorio, y un adorno anclado a 200px del borde
  izquierdo termina encima del texto en cuanto la columna se estrecha.

  Varias llevan `hidden lg:block`. No es capricho: en movil el ancho util es la
  columna de texto entera, asi que los adornos laterales no tienen donde
  ponerse sin estorbar. Se quedan los de las esquinas.
*/
const recetas: Record<VarianteDecorado, Pieza[]> = {
  catalogo: [
    { dibujo: <Tomate className="w-full" />, donde: "left-[3%] top-[12%] w-24 sm:w-32", color: "text-chiliguaro", animacion: "giro", duracion: 46 },
    { dibujo: <Chile className="w-full" />, donde: "right-[4%] top-[30%] w-20 sm:w-28", color: "text-acento", animacion: "vaiven", retraso: 1.2 },
    { dibujo: <Coco className="w-full" />, donde: "left-[8%] bottom-[10%] hidden w-24 lg:block", color: "text-miguelito", animacion: "zoom", retraso: 0.6 },
    { dibujo: <Naranja className="w-full" />, donde: "right-[7%] bottom-[16%] hidden w-28 lg:block", color: "text-sangria", animacion: "giro", duracion: 60, retraso: 2 },
    { dibujo: <Estrella className="w-full" />, donde: "left-[22%] top-[6%] w-5 sm:w-7", color: "text-estrella", animacion: "destello", opacidad: 0.6 },
  ],

  kits: [
    { dibujo: <Coco className="w-full" />, donde: "right-[5%] top-[14%] w-24 sm:w-32", color: "text-miguelito", animacion: "zoom" },
    { dibujo: <Lima className="w-full" />, donde: "left-[4%] top-[34%] w-20 sm:w-28", color: "text-menta", animacion: "flotar", retraso: 1 },
    { dibujo: <Palmera className="w-full" />, donde: "left-[10%] bottom-[8%] hidden w-28 lg:block", color: "text-menta", animacion: "vaiven", retraso: 0.4, duracion: 11 },
    { dibujo: <Estrella className="w-full" />, donde: "right-[18%] bottom-[18%] w-5 sm:w-6", color: "text-estrella", animacion: "destello", retraso: 1.6, opacidad: 0.6 },
  ],

  ritual: [
    { dibujo: <Chile className="w-full" />, donde: "left-[4%] top-[16%] w-20 sm:w-28", color: "text-acento", animacion: "vaiven" },
    { dibujo: <Lima className="w-full" />, donde: "right-[5%] top-[40%] w-24 sm:w-32", color: "text-menta", animacion: "giro", duracion: 52, retraso: 1.4 },
    { dibujo: <Rayas className="w-full" />, donde: "left-[26%] top-[8%] w-12 sm:w-16", color: "text-menta", animacion: "destello", retraso: 0.8, opacidad: 0.5 },
    { dibujo: <Nube className="w-full" />, donde: "right-[12%] bottom-[10%] hidden w-32 lg:block", color: "text-crayon", animacion: "deriva", retraso: 2 },
  ],

  nosotros: [
    { dibujo: <Monstera className="w-full" />, donde: "right-[3%] top-[10%] w-24 sm:w-36", color: "text-menta", animacion: "vaiven", duracion: 12 },
    { dibujo: <Naranja className="w-full" />, donde: "left-[5%] bottom-[12%] hidden w-28 lg:block", color: "text-sangria", animacion: "giro", duracion: 58, retraso: 1 },
    { dibujo: <Nube className="w-full" />, donde: "left-[8%] top-[8%] w-28 sm:w-36", color: "text-crayon", animacion: "deriva", retraso: 0.5 },
  ],

  eventos: [
    { dibujo: <Palmera className="w-full" />, donde: "left-[3%] top-[12%] w-28 sm:w-36", color: "text-menta", animacion: "vaiven", duracion: 10 },
    { dibujo: <Palmera className="w-full" />, donde: "right-[4%] bottom-[10%] hidden w-32 lg:block", color: "text-menta", animacion: "vaiven", retraso: 1.8, duracion: 13 },
    { dibujo: <Lima className="w-full" />, donde: "right-[10%] top-[22%] w-20 sm:w-24", color: "text-menta", animacion: "flotar", retraso: 0.7 },
    { dibujo: <Estrella className="w-full" />, donde: "left-[24%] bottom-[14%] w-5 sm:w-7", color: "text-estrella", animacion: "destello", retraso: 1.2, opacidad: 0.6 },
  ],

  resenas: [
    { dibujo: <Nube className="w-full" />, donde: "left-[5%] top-[12%] w-28 sm:w-36", color: "text-crayon", animacion: "deriva" },
    { dibujo: <Manzana className="w-full" />, donde: "right-[5%] bottom-[14%] hidden w-24 lg:block", color: "text-sangria", animacion: "zoom", retraso: 1.1 },
    { dibujo: <Estrella className="w-full" />, donde: "right-[16%] top-[16%] w-6 sm:w-8", color: "text-estrella", animacion: "destello", opacidad: 0.6 },
    { dibujo: <Estrella className="w-full" />, donde: "left-[18%] bottom-[20%] w-4 sm:w-5", color: "text-estrella", animacion: "destello", retraso: 1.9, opacidad: 0.5 },
  ],

  entrega: [
    { dibujo: <Monstera className="w-full" />, donde: "left-[4%] bottom-[12%] w-24 sm:w-32", color: "text-menta", animacion: "vaiven", duracion: 11 },
    { dibujo: <Palmera className="w-full" />, donde: "right-[4%] top-[14%] w-28 sm:w-36", color: "text-menta", animacion: "vaiven", retraso: 1.3 },
    { dibujo: <Nube className="w-full" />, donde: "right-[22%] bottom-[16%] hidden w-32 lg:block", color: "text-crayon", animacion: "deriva", retraso: 0.9 },
  ],

  faq: [
    { dibujo: <Lima className="w-full" />, donde: "left-[4%] top-[14%] w-20 sm:w-28", color: "text-menta", animacion: "giro", duracion: 50 },
    { dibujo: <Tomate className="w-full" />, donde: "right-[5%] top-[36%] w-20 sm:w-28", color: "text-chiliguaro", animacion: "zoom", retraso: 1.5 },
    { dibujo: <Estrella className="w-full" />, donde: "left-[20%] bottom-[12%] w-5 sm:w-6", color: "text-estrella", animacion: "destello", retraso: 0.6, opacidad: 0.6 },
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
          opacidad={p.opacidad ?? 0.22}
        >
          {p.dibujo}
        </Adorno>
      ))}
    </CapaDecorados>
  );
}
