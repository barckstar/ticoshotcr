import type { Producto } from "@/shared/types/producto";

export type LineaCarrito = {
  producto: Producto;
  cantidad: number;
};

export type AccionCarrito =
  | { tipo: "agregar"; producto: Producto }
  | { tipo: "cambiarCantidad"; id: string; cantidad: number }
  | { tipo: "quitar"; id: string }
  | { tipo: "vaciar" }
  | { tipo: "hidratar"; lineas: LineaCarrito[] };
