import type { Producto } from "@/shared/types/producto";

export type LineaCarrito = {
  producto: Producto;
  cantidad: number;
  nota?: string;
};

export type AccionCarrito =
  | { tipo: "agregar"; producto: Producto }
  | { tipo: "cambiarCantidad"; id: string; cantidad: number }
  | { tipo: "quitar"; id: string }
  | { tipo: "ponerNota"; id: string; nota: string }
  | { tipo: "vaciar" }
  | { tipo: "hidratar"; lineas: LineaCarrito[] };
