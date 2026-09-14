/**
 * La mecanica de la banda del hero: dar la vuelta y frenar.
 *
 * ============ POR QUE ESTA FUERA DEL COMPONENTE ============
 * `BandaBotellas.tsx` lleva `"use client"` e importa `next/image`, asi que no
 * se puede cargar desde una prueba de Node — que es como corre Vitest en este
 * proyecto.
 *
 * Y justo aqui esta lo unico de la banda que puede fallar en silencio: el
 * calculo del salto entre copias. Si sale mal, la tira pega un tiron a mitad
 * del lanzamiento y no lo cazan ni el build, ni el lint, ni los tipos. Aparte,
 * es lo que pasa CUANDO se suelta con fuerza, o sea lo que menos se prueba a
 * mano.
 * ===========================================================
 */

/**
 * Cuantas veces se repite la lista de productos en la pista.
 *
 * MANDA EN TRES SITIOS a la vez: cuantos juegos pinta el componente, el
 * `--marquee-copias` que el `@keyframes` usa para calcular su desplazamiento,
 * y el ancho del salto de `desplazar()`. Por eso vive aqui y no suelto en el
 * componente: los tres tienen que leer el mismo numero o el bucle salta.
 */
export const COPIAS = 6;

/**
 * Lo unico que `desplazar` necesita de un carril.
 *
 * Tipo estructural y no `HTMLDivElement`: asi la prueba puede pasarle un
 * objeto plano sin montar un DOM, y el elemento real encaja igual.
 */
export type Carril = {
  scrollLeft: number;
  readonly scrollWidth: number;
  readonly clientWidth: number;
};

/**
 * Mueve el carril `delta` pixeles, dando la vuelta por los extremos.
 *
 * ============ POR QUE NO SE TOPA CON EL BORDE ============
 * La pista son COPIAS juegos IDENTICOS, asi que lo que se ve en `x` y en
 * `x + unaCopia` es exactamente el mismo pixel. Saltar una copia entera al
 * pasarse de un extremo es, en pantalla, invisible — y deja la tira girando
 * sin fin en vez de estrellarse contra el final del scroll a mitad de un
 * lanzamiento, que es justo cuando mas se notaria.
 *
 * La condicion del salto NO es que el rango sea mas ancho que una copia: es
 * que el punto equivalente CAIGA DENTRO del rango. Son cosas distintas y la
 * diferencia importa — en una pantalla muy ancha el rango de scroll se queda
 * en unos cientos de pixeles, mucho menos que una copia, y aun asi hay sitios
 * a los que saltar. Solo cuando no queda ninguno se limita contra el borde,
 * que es lo que hace cualquier carrusel.
 * ========================================================
 */
export function desplazar(carril: Carril, delta: number) {
  const copia = carril.scrollWidth / COPIAS;
  const maximo = carril.scrollWidth - carril.clientWidth;
  let x = carril.scrollLeft + delta;

  while (x < 0 && x + copia <= maximo) x += copia;
  while (x > maximo && x - copia >= 0) x -= copia;

  carril.scrollLeft = Math.min(Math.max(x, 0), maximo);
}

/**
 * ============ EL LANZAMIENTO ============
 * Soltar la tira en movimiento no la deja clavada: sigue rodando y frena sola,
 * mas lejos cuanto mas fuerte el tiron. Sin esto el gesto se siente como
 * arrastrar una caja por el suelo, no como empujar algo que rueda.
 * ========================================
 */

/** Cuanta velocidad sobrevive a cada fotograma de 16 ms. */
export const ROCE = 0.94;

/** px/ms por debajo de los cuales el lanzamiento ya no se ve, y se corta. */
export const VELOCIDAD_MINIMA = 0.015;

/**
 * Tope de la velocidad de salida, px/ms.
 *
 * Un tiron muy rapido puede medir 10 px/ms, y eso cruza la pista entera en un
 * parpadeo: se lee como un salto, no como un giro. Cuatro es rapido y todavia
 * seguible con la vista.
 */
export const VELOCIDAD_MAXIMA = 4;

/**
 * La velocidad que queda tras `dt` milisegundos de roce.
 *
 * EL ROCE SE ELEVA A `dt/16` Y NO SE APLICA A PELO. Un telefono que va a 30
 * fps entrega fotogramas del doble de largos: multiplicando por `ROCE` una vez
 * por fotograma, ahi frenaria en la mitad del tiempo que en un portatil a 60.
 * El recorrido tiene que depender del tiron, no de lo rapido que pinte el
 * aparato.
 */
export function frenarPorRoce(velocidad: number, dt: number) {
  return velocidad * Math.pow(ROCE, dt / 16);
}

/**
 * Mezcla la velocidad instantanea con la que se traia.
 *
 * Se mide entre DOS eventos seguidos y no sobre el gesto entero: lo que manda
 * el lanzamiento es el ultimo tiron, no el promedio de un arrastre que pudo
 * empezar lento. Pero a pelo tampoco sirve — el ultimo `pointermove` antes de
 * levantar el dedo suele venir casi quieto, y mataria el impulso justo en el
 * evento que lo decide. De ahi la mezcla: manda lo nuevo, sin tirar lo viejo.
 */
export function suavizarVelocidad(instantanea: number, anterior: number) {
  return instantanea * 0.75 + anterior * 0.25;
}

/** Recorta la velocidad de salida al tope, conservando el sentido. */
export function limitarVelocidad(velocidad: number) {
  return Math.max(-VELOCIDAD_MAXIMA, Math.min(velocidad, VELOCIDAD_MAXIMA));
}
