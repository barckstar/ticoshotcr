import { describe, it, expect } from "vitest";
import {
  carritoReducer,
  total,
  conteo,
  faltanPrecios,
} from "./carrito";
import type { LineaCarrito } from "@/shared/types/carrito";
import type { Producto } from "@/shared/types/producto";

function producto(id: string, precio: number | null = 8000): Producto {
  return {
    id,
    nombre: id,
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

const linea = (p: Producto, cantidad = 1): LineaCarrito => ({
  producto: p,
  cantidad,
});

describe("carritoReducer", () => {
  it("agrega un producto nuevo con cantidad 1", () => {
    const estado = carritoReducer([], { tipo: "agregar", producto: producto("a") });
    expect(estado).toHaveLength(1);
    expect(estado[0].cantidad).toBe(1);
  });

  it("suma en vez de duplicar la línea cuando el producto ya está", () => {
    const a = producto("a");
    const estado = carritoReducer([linea(a)], { tipo: "agregar", producto: a });
    expect(estado).toHaveLength(1);
    expect(estado[0].cantidad).toBe(2);
  });

  it("no agrega un producto agotado, aunque se fuerce la acción", () => {
    const agotado = { ...producto("z"), disponible: false };
    expect(carritoReducer([], { tipo: "agregar", producto: agotado })).toHaveLength(0);
  });

  it("quitar elimina solo la línea indicada", () => {
    const estado = carritoReducer(
      [linea(producto("a")), linea(producto("b"))],
      { tipo: "quitar", id: "a" },
    );
    expect(estado.map((l) => l.producto.id)).toEqual(["b"]);
  });

  it("cantidad cero o negativa elimina la línea, nunca la deja en negativo", () => {
    const base = [linea(producto("a"), 3)];
    expect(carritoReducer(base, { tipo: "cambiarCantidad", id: "a", cantidad: 0 })).toHaveLength(0);
    expect(carritoReducer(base, { tipo: "cambiarCantidad", id: "a", cantidad: -2 })).toHaveLength(0);
  });

  it("no muta el estado que recibe", () => {
    const base = [linea(producto("a"))];
    const copia = structuredClone(base);
    carritoReducer(base, { tipo: "agregar", producto: producto("a") });
    expect(base).toEqual(copia);
  });
});

describe("total y faltanPrecios", () => {
  it("multiplica precio por cantidad", () => {
    expect(total([linea(producto("a", 8000), 3)])).toBe(24000);
  });

  /*
    LA PRUEBA QUE JUSTIFICA QUE `precio` SEA NULLABLE.

    Sumando null a secas el total sale NaN y formatoColones lo pinta como
    "₡NaN" en el carrito: no rompe nada, no avisa, y lo descubre el comprador.
  */
  it("ignora las líneas sin precio en vez de producir NaN", () => {
    const suma = total([
      linea(producto("a", 8000), 2),
      linea(producto("b", null), 5),
    ]);
    expect(Number.isNaN(suma)).toBe(false);
    expect(suma).toBe(16000);
  });

  it("avisa cuando alguna línea no tiene precio", () => {
    expect(faltanPrecios([linea(producto("a", 8000))])).toBe(false);
    expect(
      faltanPrecios([linea(producto("a", 8000)), linea(producto("b", null))]),
    ).toBe(true);
  });

  it("el carrito vacío suma cero y no le faltan precios", () => {
    expect(total([])).toBe(0);
    expect(faltanPrecios([])).toBe(false);
  });
});

describe("conteo", () => {
  it("suma las cantidades, no las líneas", () => {
    expect(conteo([linea(producto("a"), 2), linea(producto("b"), 3)])).toBe(5);
  });
});
