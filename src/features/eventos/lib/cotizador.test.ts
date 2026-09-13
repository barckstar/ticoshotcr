import { describe, it, expect } from "vitest";
import {
  litrosParaPersonas,
  repartirLitros,
  explicarCalculo,
  shotsPorPersona,
  SHOTS_POR_LITRO,
  MAX_PERSONAS,
} from "./cotizador";

/**
 * El cotizador se prueba porque da un NUMERO QUE EL CLIENTE USA PARA COMPRAR.
 * Un error aqui no rompe nada visible: solo hace que alguien pida siete litros
 * para una fiesta de sesenta personas y se entere a las diez de la noche.
 */

const nombres = {
  chiliguaro: "Chiliguaro",
  sangria: "Sangría",
  miguelito: "Miguelito",
};

describe("litrosParaPersonas", () => {
  it("calcula con la medida de barra: 20 shots por litro", () => {
    // 100 personas x 4 shots = 400 shots = 20 litros exactos.
    expect(litrosParaPersonas(100, "normal")).toBe(400 / SHOTS_POR_LITRO);
  });

  it("redondea SIEMPRE hacia arriba", () => {
    // 61 x 4 / 20 = 12,2 litros. Nunca 12: quedarse corto es el error caro.
    expect(litrosParaPersonas(61, "normal")).toBe(13);
    expect(litrosParaPersonas(21, "suave")).toBe(3); // 2,1
  });

  it("sube con la intensidad", () => {
    // 50 personas: 2, 4 y 7 shots cada una, sobre 20 shots por litro.
    expect(litrosParaPersonas(50, "suave")).toBe(5);
    expect(litrosParaPersonas(50, "normal")).toBe(10);
    expect(litrosParaPersonas(50, "fuerte")).toBe(18); // 17,5 redondeado arriba
  });

  it("devuelve 0 sin invitados, para no recomendar nada a un formulario vacío", () => {
    expect(litrosParaPersonas(0)).toBe(0);
    expect(litrosParaPersonas(-5)).toBe(0);
  });

  it("no explota con basura de un input de texto", () => {
    expect(litrosParaPersonas(Number.NaN)).toBe(0);
    expect(litrosParaPersonas(Number.POSITIVE_INFINITY)).toBe(0);
  });

  it("acota en MAX_PERSONAS", () => {
    expect(litrosParaPersonas(99999, "normal")).toBe(
      litrosParaPersonas(MAX_PERSONAS, "normal"),
    );
  });

  it("ignora la parte decimal de las personas", () => {
    // Medio invitado no existe; un input de número puede mandarlo igual.
    expect(litrosParaPersonas(10.9, "normal")).toBe(litrosParaPersonas(10, "normal"));
  });
});

describe("explicarCalculo", () => {
  /*
    La cuenta que se pinta en pantalla tiene que dar EL MISMO numero que la
    funcion que calcula. Si se separan, el cliente lee una cuenta que no cuadra
    con el resultado de arriba y deja de creerle al sitio entero.
  */
  it("la cuenta escrita coincide con el resultado, en todo el rango", () => {
    for (const intensidad of ["suave", "normal", "fuerte"] as const) {
      for (const personas of [1, 7, 30, 60, 123, 500]) {
        const litros = litrosParaPersonas(personas, intensidad);
        const texto = explicarCalculo(personas, intensidad, litros);
        expect(texto).toContain(`${personas} personas`);
        expect(texto).toContain(`${shotsPorPersona[intensidad]} shots`);
        expect(texto).toContain(`${personas * shotsPorPersona[intensidad]} shots`);
        expect(texto).toContain(`${litros}`);
      }
    }
  });
});

describe("repartirLitros", () => {
  /*
    ESTA ES LA PRUEBA QUE JUSTIFICA EL METODO DEL RESTO MAYOR.

    Redondeando cada parte por su cuenta, 9 litros en 40/35/25 dan
    round(3,6)=4, round(3,15)=3 y round(2,25)=2, que suman 9 de casualidad;
    pero 3 litros dan round(1,2)=1, round(1,05)=1 y round(0,75)=1, que suman 3,
    y 6 litros dan round(2,4)=2, round(2,1)=2 y round(1,5)=2, que suman 6...
    hasta que uno no suma y el cliente lee "13 litros" arriba y una lista de 14.
    Aqui se comprueba para TODO el rango util, no para los casos que se me
    ocurran.
  */
  it("la suma del reparto es siempre igual al total, de 1 a 300 litros", () => {
    for (let litros = 1; litros <= 300; litros++) {
      const mezcla = repartirLitros(litros, nombres);
      const suma = mezcla.reduce((s, m) => s + m.litros, 0);
      expect(suma, `falló con ${litros} litros`).toBe(litros);
    }
  });

  it("nunca devuelve una línea en cero", () => {
    for (let litros = 1; litros <= 60; litros++) {
      for (const m of repartirLitros(litros, nombres)) {
        expect(m.litros).toBeGreaterThan(0);
      }
    }
  });

  it("le da la mayor parte al chiliguaro, que es el clásico", () => {
    const mezcla = repartirLitros(20, nombres);
    const chiliguaro = mezcla.find((m) => m.id === "chiliguaro");
    expect(chiliguaro?.litros).toBe(8);
    for (const m of mezcla) {
      expect(m.litros).toBeLessThanOrEqual(chiliguaro!.litros);
    }
  });

  it("usa los nombres que se le pasan, no los ids", () => {
    expect(repartirLitros(10, nombres)[0].nombre).toBe("Chiliguaro");
  });

  it("con un solo litro devuelve una sola línea", () => {
    const mezcla = repartirLitros(1, nombres);
    expect(mezcla).toHaveLength(1);
    expect(mezcla[0].litros).toBe(1);
  });

  it("sin litros no devuelve nada", () => {
    expect(repartirLitros(0, nombres)).toEqual([]);
  });
});
