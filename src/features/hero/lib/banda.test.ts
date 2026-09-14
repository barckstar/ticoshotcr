import { describe, expect, it } from "vitest";
import {
  COPIAS,
  ROCE,
  VELOCIDAD_MAXIMA,
  VELOCIDAD_MINIMA,
  desplazar,
  frenarPorRoce,
  limitarVelocidad,
  suavizarVelocidad,
  type Carril,
} from "./banda";

/**
 * Las medidas reales, medidas en el navegador a 1014px de ancho: seis copias
 * de tres tarjetas dan 4464px de pista, o sea 744 por copia.
 */
const PISTA = 4464;
const COPIA = PISTA / COPIAS; // 744
const PANTALLA = 1014;
const MAXIMO = PISTA - PANTALLA; // 3450

function carril(scrollLeft: number, clientWidth = PANTALLA): Carril {
  return { scrollLeft, scrollWidth: PISTA, clientWidth };
}

describe("desplazar", () => {
  it("mueve lo que se le pide cuando hay sitio de sobra", () => {
    const c = carril(1000);
    desplazar(c, 250);
    expect(c.scrollLeft).toBe(1250);
  });

  it("acepta desplazamientos negativos", () => {
    const c = carril(1000);
    desplazar(c, -250);
    expect(c.scrollLeft).toBe(750);
  });

  it("da la vuelta por la izquierda saltando UNA copia exacta", () => {
    const c = carril(100);
    desplazar(c, -300); // -200, fuera de rango

    /*
      El salto tiene que ser de una copia CLAVADA. Cualquier otro valor deja la
      pista en un punto que no coincide con el anterior y la tira pega un tiron
      visible — el mismo fallo que tenia el marquee escrito con `-50%`.
    */
    expect(c.scrollLeft).toBe(-200 + COPIA);
  });

  it("da la vuelta por la derecha saltando UNA copia exacta", () => {
    const c = carril(MAXIMO - 100);
    desplazar(c, 300); // 3650, pasado del maximo

    expect(c.scrollLeft).toBe(MAXIMO - 100 + 300 - COPIA);
  });

  it("deja la vuelta siempre dentro del rango que el scroll admite", () => {
    // Un lanzamiento fuerte: 4 px/ms durante 32 ms son 128px por fotograma.
    const c = carril(MAXIMO - 10);
    for (let i = 0; i < 200; i++) {
      desplazar(c, 128);
      expect(c.scrollLeft).toBeGreaterThanOrEqual(0);
      expect(c.scrollLeft).toBeLessThanOrEqual(MAXIMO);
    }
  });

  it("nunca se queda clavado en un extremo mientras haya copias donde saltar", () => {
    const c = carril(0);
    for (let i = 0; i < 100; i++) desplazar(c, -128);

    // Si el salto no funcionara, 100 pasos hacia atras lo dejarian en 0.
    expect(c.scrollLeft).toBeGreaterThan(0);
  });

  it("sigue saltando aunque el rango sea MAS CORTO que una copia", () => {
    /*
      Pantalla de 4000px sobre una pista de 4464: quedan 464px de scroll, menos
      de una copia (744). La tentacion es pensar que ahi ya no hay a donde
      saltar — y es falso. Lo que hace falta no es que quepa una copia en el
      rango, sino que el punto equivalente CAIGA dentro de el. 900 se sale, pero
      900 − 744 = 156 no, y ensena exactamente los mismos pixeles.
    */
    const c = carril(400, 4000);
    desplazar(c, 500);
    expect(c.scrollLeft).toBe(900 - COPIA);

    const d = carril(100, 4000);
    desplazar(d, -500);
    expect(d.scrollLeft).toBe(-400 + COPIA);
  });

  it("se limita contra el borde cuando NINGUN punto equivalente cabe", () => {
    /*
      Pantalla de 4400: quedan 64px de scroll. 900 se sale, 156 tambien, y
      restar otra copia daria negativo. No queda ningun sitio equivalente
      dentro del rango, asi que lo unico correcto es topar — y sobre todo no
      salirse, que dejaria la banda medio en blanco.
    */
    const c = carril(400, 4400);
    desplazar(c, 500);
    expect(c.scrollLeft).toBe(64);

    const d = carril(40, 4400);
    desplazar(d, -500);
    expect(d.scrollLeft).toBe(0);
  });
});

describe("frenarPorRoce", () => {
  it("aplica el roce tal cual en un fotograma de 16 ms", () => {
    expect(frenarPorRoce(1, 16)).toBeCloseTo(ROCE, 10);
  });

  it("FRENA LO MISMO a 30 fps que a 60 fps", () => {
    /*
      Esta es la razon de que el roce se eleve a `dt/16`. Dos fotogramas de 16ms
      tienen que dejar la misma velocidad que uno de 32: si no, el recorrido del
      lanzamiento dependeria de lo rapido que pinte el aparato y en un telefono
      lento la banda frenaria a mitad de camino.
    */
    const a60 = frenarPorRoce(frenarPorRoce(3, 16), 16);
    const a30 = frenarPorRoce(3, 32);
    expect(a60).toBeCloseTo(a30, 10);
  });

  it("siempre frena, nunca acelera", () => {
    expect(Math.abs(frenarPorRoce(2, 16))).toBeLessThan(2);
    expect(Math.abs(frenarPorRoce(-2, 16))).toBeLessThan(2);
  });

  it("conserva el sentido del tiron", () => {
    expect(frenarPorRoce(-2, 16)).toBeLessThan(0);
  });

  it("llega al corte en algo mas de un segundo desde la velocidad tope", () => {
    let v = VELOCIDAD_MAXIMA;
    let ms = 0;
    while (Math.abs(v) >= VELOCIDAD_MINIMA && ms < 10_000) {
      v = frenarPorRoce(v, 16);
      ms += 16;
    }

    /*
      El recorrido tiene que durar lo que dura un vistazo. Menos de medio
      segundo no se lee como inercia sino como un tiron; mas de tres, la banda
      parece que se quedo colgada y el visitante no sabe si ya puede tocarla.
    */
    expect(ms).toBeGreaterThan(500);
    expect(ms).toBeLessThan(3000);
  });
});

describe("suavizarVelocidad", () => {
  it("le da el peso al tiron nuevo", () => {
    expect(suavizarVelocidad(1, 0)).toBeCloseTo(0.75, 10);
  });

  it("no deja que un ultimo evento quieto mate el impulso", () => {
    /*
      El caso real: el dedo venia a 2 px/ms y el ultimo `pointermove` antes de
      levantarse mide 0. A pelo saldria 0 y la banda quedaria clavada justo
      cuando mas se espera que ruede.
    */
    expect(suavizarVelocidad(0, 2)).toBeGreaterThan(VELOCIDAD_MINIMA);
  });
});

describe("limitarVelocidad", () => {
  it("recorta un tiron desbocado", () => {
    expect(limitarVelocidad(12)).toBe(VELOCIDAD_MAXIMA);
    expect(limitarVelocidad(-12)).toBe(-VELOCIDAD_MAXIMA);
  });

  it("deja pasar lo que ya esta dentro del tope", () => {
    expect(limitarVelocidad(1.5)).toBe(1.5);
  });
});
