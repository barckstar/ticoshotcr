import { describe, it, expect } from "vitest";
import { construirMensajeEvento, type DatosEvento } from "./mensajeEvento";
import { LIMITE_SEGURO } from "@/shared/lib/whatsapp";

/**
 * La consulta de evento es una de las DOS salidas del sitio, junto con el
 * pedido del carrito. No hay base de datos: si el mensaje sale mal, la consulta
 * sale mal, y nadie se entera hasta que alguien cotiza una boda con los datos
 * de otra.
 */

const base: DatosEvento = {
  nombre: "Ana",
  telefono: "8888-8888",
  personas: 60,
  intensidad: "normal",
  fecha: "Sábado 12",
  lugar: "San Ramón centro",
  tipo: "Cumpleaños",
  notas: "",
};

describe("construirMensajeEvento", () => {
  it("se anuncia como CONSULTA y no como pedido", () => {
    const { texto } = construirMensajeEvento(base);
    expect(texto).toContain("*CONSULTA DE EVENTO");
    expect(texto).not.toContain("PEDIDO");
  });

  it("lleva los datos que el bartender necesita para cotizar", () => {
    const { texto } = construirMensajeEvento(base);
    expect(texto).toContain("Ana · 8888-8888");
    expect(texto).toContain("Personas: 60");
    expect(texto).toContain("Cumpleaños");
    expect(texto).toContain("Sábado 12");
    expect(texto).toContain("San Ramón centro");
  });

  it("escribe el ambiente con su etiqueta legible, no con el id", () => {
    const { texto } = construirMensajeEvento(base);
    expect(texto).toContain("la mayoría se anima");
    expect(texto).not.toContain("Ambiente: normal");
  });

  /*
    LA REGLA QUE SOBREVIVIO AL COTIZADOR. El sitio ya no estima litros: no sabe
    cuanto toma la gente de otro, y una cifra con aire de exactitud es como
    termina alguien con seis litros de sobra. Esta prueba existe para que nadie
    lo vuelva a meter sin darse cuenta.
  */
  it("NO manda ninguna cantidad de litros calculada por el sitio", () => {
    const { texto } = construirMensajeEvento(base);
    expect(texto).not.toMatch(/\d+\s*litros?/i);
    expect(texto).not.toContain("shots");
  });

  it("incluye la nota solo cuando hay una", () => {
    expect(construirMensajeEvento(base).texto).not.toContain("Nota:");
    expect(
      construirMensajeEvento({ ...base, notas: "sin picante" }).texto,
    ).toContain("Nota: sin picante");
  });

  /*
    WhatsApp en iOS TRUNCA sin avisar. El largo que cuenta es el CODIFICADO: en
    este mensaje casi todo lleva tilde o "ñ", y cada una ocupa tres caracteres
    una vez pasada por encodeURIComponent.
  */
  it("mide el largo ya codificado, no el del texto plano", () => {
    const { texto, largoCodificado } = construirMensajeEvento(base);
    expect(largoCodificado).toBe(encodeURIComponent(texto).length);
    expect(largoCodificado).toBeGreaterThan(texto.length);
  });

  it("una consulta normal no se acerca al límite", () => {
    const m = construirMensajeEvento(base);
    expect(m.largoCodificado).toBeLessThan(LIMITE_SEGURO);
    expect(m.excedeLimite).toBe(false);
  });

  it("marca excedeLimite con una nota larguísima", () => {
    const m = construirMensajeEvento({ ...base, notas: "á".repeat(600) });
    expect(m.excedeLimite).toBe(true);
  });
});
