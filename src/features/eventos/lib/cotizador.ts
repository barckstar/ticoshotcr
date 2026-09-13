/**
 * El cotizador de eventos: de "somos 60" a "necesitás 9 litros".
 *
 * POR QUE ESTO NO ES EL CARRITO
 * Un carrito para tres litros y un carrito para una boda de 120 personas son
 * dos problemas distintos. El segundo no tiene precio cerrado hasta saber
 * cuanta gente, que fecha y donde; lo que necesita quien organiza una fiesta
 * no es un boton de comprar, es un numero — cuanto compro para no quedarme
 * corto. Eso es lo que da esta funcion, y despues abre WhatsApp.
 *
 * LOS NUMEROS SON ESTIMACIONES Y EL SITIO LO DICE. Nadie puede saber cuanto
 * toma la gente de otro; dar una cifra con aire de exactitud es como termina
 * alguien con seis litros de sobra o con la fiesta seca a las nueve.
 */

/** Un litro da 20 shots de 50 ml. Es medida de barra, no estimacion. */
export const SHOTS_POR_LITRO = 20;

export type Intensidad = "suave" | "normal" | "fuerte";

/**
 * Shots por persona en TODO el evento, no por hora.
 *
 * Por hora obliga a preguntar cuanto dura la fiesta, y quien la organiza no
 * sabe esa respuesta: sabe cuanta gente invito. Una pregunta menos es una
 * pregunta menos que abandonar.
 *
 * ================== ESTOS TRES NUMEROS SON UN SUPUESTO ==================
 * No salen de ningun dato: los puso quien programo el sitio. El dueno de
 * Ticoshot es bartender con mas de cinco anos de barra y sabe cuanto toma la
 * gente de verdad; estos valores son un punto de partida hasta que el los
 * corrija, y corregirlos es editar esta tabla y nada mas.
 *
 * POR ESO EL SUPUESTO SE ENSENA EN PANTALLA. Cada opcion dice a cuantos shots
 * por persona equivale, y la tarjeta del resultado escribe la cuenta completa.
 * Un cotizador que devuelve "12 litros" sin decir de donde salen no se puede
 * discutir: o se le cree o no. Ensenando la cuenta, quien organiza la fiesta
 * ve el supuesto y dice "nosotros tomamos mas que eso" — que es exactamente la
 * conversacion que hay que tener antes de comprar, no despues.
 * ========================================================================
 */
export const shotsPorPersona: Record<Intensidad, number> = {
  suave: 2,
  normal: 4,
  fuerte: 7,
};

export const etiquetaIntensidad: Record<Intensidad, string> = {
  suave: "Tranquilo — se toma poco",
  normal: "Normal — la mayoría se anima",
  fuerte: "Fiesta grande — se toma de verdad",
};

/** La cuenta escrita, para que el supuesto se vea y se pueda discutir. */
export function explicarCalculo(
  personas: number,
  intensidad: Intensidad,
  litros: number,
): string {
  const shots = shotsPorPersona[intensidad];
  const total = Math.floor(personas) * shots;
  return `${Math.floor(personas)} personas × ${shots} shots = ${total} shots ÷ ${SHOTS_POR_LITRO} por litro = ${litros} ${litros === 1 ? "litro" : "litros"}`;
}

/** Tope de invitados que acepta el formulario. */
export const MAX_PERSONAS = 500;

/**
 * Litros que hacen falta.
 *
 * SIEMPRE REDONDEA HACIA ARRIBA, y no es pereza: los litros no se venden por
 * mitades, y de los dos errores posibles quedarse corto en una fiesta es el
 * caro. 61 personas dan 12,2 litros y la respuesta son 13.
 *
 * Devuelve 0 con cero personas —no 1— para que el formulario vacio no muestre
 * una recomendacion que nadie pidio.
 */
export function litrosParaPersonas(
  personas: number,
  intensidad: Intensidad = "normal",
): number {
  if (!Number.isFinite(personas) || personas <= 0) return 0;
  const acotado = Math.min(Math.floor(personas), MAX_PERSONAS);
  return Math.ceil((acotado * shotsPorPersona[intensidad]) / SHOTS_POR_LITRO);
}

export type Mezcla = { id: string; nombre: string; litros: number };

/**
 * Reparte los litros entre los tres productos.
 *
 * El reparto por defecto sale de como se vende: el chiliguaro es el clasico y
 * se lleva la mayor parte, la sangria la piden los que no toman picante y el
 * miguelito es el especialista.
 *
 * EL REDONDEO NO PUEDE PERDER LITROS. Repartir 13 en 40/35/25 da 5,2 / 4,55 /
 * 3,25: redondeando cada uno por su cuenta salen 5+5+3=13 por suerte, pero con
 * 7 litros salen 3+2+2=7 y con 11 salen 4+4+3=11... y con 9 salen 4+3+2=9. No
 * siempre cuadra, y cuando no cuadra el cliente ve "9 litros" arriba y una
 * lista que suma 10. Por eso se reparte por el metodo del resto mayor: se
 * asigna la parte entera y los litros que sobran van a quien tenga la fraccion
 * mas grande. La suma cuadra siempre, por construccion.
 */
const REPARTO: { id: string; peso: number }[] = [
  { id: "chiliguaro", peso: 0.4 },
  { id: "sangria", peso: 0.35 },
  { id: "miguelito", peso: 0.25 },
];

export function repartirLitros(
  litros: number,
  nombres: Record<string, string>,
): Mezcla[] {
  if (litros <= 0) return [];

  const crudos = REPARTO.map((r) => ({
    id: r.id,
    nombre: nombres[r.id] ?? r.id,
    exacto: litros * r.peso,
  }));

  const conParteEntera = crudos.map((c) => ({
    ...c,
    litros: Math.floor(c.exacto),
    resto: c.exacto - Math.floor(c.exacto),
  }));

  let faltan =
    litros - conParteEntera.reduce((suma, c) => suma + c.litros, 0);

  // Los litros sobrantes, de mayor a menor resto.
  const porResto = [...conParteEntera].sort((a, b) => b.resto - a.resto);
  for (const c of porResto) {
    if (faltan <= 0) break;
    c.litros += 1;
    faltan -= 1;
  }

  /*
    Con pocos litros alguno puede quedar en 0 —con 2 litros el miguelito no
    entra— y una linea "Miguelito: 0 litros" solo confunde. Se filtra.
  */
  return conParteEntera
    .filter((c) => c.litros > 0)
    .map(({ id, nombre, litros }) => ({ id, nombre, litros }));
}
