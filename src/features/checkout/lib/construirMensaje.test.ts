import { describe, it, expect } from "vitest";
import { construirMensajePedido } from "./construirMensaje";
import { LIMITE_SEGURO } from "@/shared/lib/whatsapp";
import type { LineaCarrito } from "@/shared/types/carrito";
import type { Producto } from "@/shared/types/producto";
import type { DatosPedido } from "../schema";

/**
 * El mensaje de WhatsApp es la UNICA salida del sitio: no hay pasarela ni base
 * de datos. Si sale mal, el pedido sale mal — y nadie se entera hasta que
 * alguien prepara tres litros de lo que no era.
 *
 * Se prueba `construirMensajePedido` y no `construirMensaje` a proposito: la
 * segunda depende de `negocio.modoMuestra`, asi que el dia que esa bandera se
 * encienda para ensenar el sitio estas pruebas pasarian a medir el mensaje de
 * contacto y dejarian de cubrir nada. Paso de verdad en la plantilla.
 */

function producto(
  id: string,
  nombre: string,
  precio: number | null = 8000,
): Producto {
  return {
    id,
    nombre,
    resumen: "resumen",
    descripcion: "descripcion",
    notas: ["guaro"],
    color: "chiliguaro",
    precio,
    litros: 1,
    disponible: true,
    imagen: null,
    advertencia: null,
  };
}

const datosBase: DatosPedido = {
  nombre: "Ana",
  telefono: "8888-8888",
  modalidad: "retiro",
  metodoPago: "sinpe",
};

const lineas: LineaCarrito[] = [
  { producto: producto("chiliguaro", "Chiliguaro"), cantidad: 2 },
  { producto: producto("sangria", "Sangría"), cantidad: 1 },
];

describe("construirMensajePedido", () => {
  it("escribe cada línea con su cantidad en litros y su monto", () => {
    const { texto } = construirMensajePedido(lineas, datosBase, 24000);
    expect(texto).toContain("2 litros de Chiliguaro");
    expect(texto).toContain("1 litro de Sangría");
    expect(texto).toContain("₡16.000");
  });

  it("singulariza 'litro' con uno solo", () => {
    const { texto } = construirMensajePedido(
      [{ producto: producto("a", "Miguelito"), cantidad: 1 }],
      datosBase,
      8000,
    );
    expect(texto).toContain("1 litro de Miguelito");
    expect(texto).not.toContain("1 litros");
  });

  it("pone el total en negrita", () => {
    const { texto } = construirMensajePedido(lineas, datosBase, 24000);
    expect(texto).toContain("*TOTAL: ₡24.000*");
  });

  /*
    SIN PRECIO NO VIAJA UN NUMERO. Mientras el cliente no confirme cuanto vale
    el litro, mandar ₡0 —o peor, un precio de relleno— hace que quien recibe el
    pedido lea una cifra que no es suya.
  */
  it("con un producto sin precio, el total dice 'a confirmar' y no un monto", () => {
    const { texto } = construirMensajePedido(
      [{ producto: producto("a", "Chiliguaro", null), cantidad: 2 }],
      datosBase,
      0,
    );
    expect(texto).toContain("*TOTAL: a confirmar*");
    expect(texto).not.toContain("₡0");
    expect(texto).toContain("2 litros de Chiliguaro");
  });

  it("incluye la nota de una línea", () => {
    const { texto } = construirMensajePedido(
      [{ producto: producto("a", "Chiliguaro"), cantidad: 1, nota: "bien frío" }],
      datosBase,
      8000,
    );
    expect(texto).toContain("bien frío");
  });

  it("en retiro no manda dirección ni ubicación", () => {
    const { texto } = construirMensajePedido(
      lineas,
      { ...datosBase, direccion: "Barrio X", lat: 10, lng: -84 },
      24000,
    );
    expect(texto).toContain("Retiro");
    expect(texto).not.toContain("Barrio X");
    expect(texto).not.toContain("Ubicación:");
  });

  it("en entrega manda la dirección y el enlace del pin", () => {
    const { texto } = construirMensajePedido(
      lineas,
      {
        ...datosBase,
        modalidad: "entrega",
        direccion: "200 m sur de la iglesia",
        lat: 10.0891,
        lng: -84.4622,
      },
      24000,
    );
    expect(texto).toContain("Entrega");
    expect(texto).toContain("200 m sur de la iglesia");
    expect(texto).toContain("Ubicación:");
    expect(texto).toContain("10.0891");
  });

  it("avisa que el envío se coordina aparte, solo en entrega", () => {
    const conEntrega = construirMensajePedido(
      lineas,
      { ...datosBase, modalidad: "entrega", direccion: "Barrio X" },
      24000,
    ).texto;
    const conRetiro = construirMensajePedido(lineas, datosBase, 24000).texto;

    expect(conEntrega).toContain("El costo del envío se coordina aparte.");
    expect(conRetiro).not.toContain("El costo del envío");
  });

  it("escribe el método de pago con su etiqueta legible, no con el id", () => {
    const { texto } = construirMensajePedido(lineas, datosBase, 24000);
    expect(texto).toContain("Sinpe Móvil");
    expect(texto).not.toContain("Pago: sinpe");
  });

  /*
    LA GUARDA CONTRA EL TRUNCADO SILENCIOSO. WhatsApp en iOS corta el mensaje
    sin avisar: el pedido llega a medias y nadie se entera. El largo que cuenta
    es el CODIFICADO, no el del texto plano — cada tilde o "ñ" ocupa tres
    caracteres una vez pasada por encodeURIComponent, y este mensaje esta lleno
    de las dos.
  */
  it("mide el largo YA CODIFICADO, no el del texto plano", () => {
    const { texto, largoCodificado } = construirMensajePedido(
      lineas,
      datosBase,
      24000,
    );
    expect(largoCodificado).toBe(encodeURIComponent(texto).length);
    expect(largoCodificado).toBeGreaterThan(texto.length);
  });

  it("un pedido normal no se acerca al límite", () => {
    expect(construirMensajePedido(lineas, datosBase, 24000).excedeLimite).toBe(false);
  });

  it("marca excedeLimite cuando el pedido se pasa", () => {
    const enormes: LineaCarrito[] = Array.from({ length: 40 }, (_, i) => ({
      producto: producto(`p${i}`, `Producto con nombre larguísimo número ${i}`),
      cantidad: 3,
      nota: "una indicación muy detallada que ocupa su buen espacio",
    }));
    const mensaje = construirMensajePedido(enormes, datosBase, 999000);
    expect(mensaje.largoCodificado).toBeGreaterThan(LIMITE_SEGURO);
    expect(mensaje.excedeLimite).toBe(true);
  });
});
