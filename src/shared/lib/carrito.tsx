"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import type { Producto } from "@/shared/types/producto";
import type { AccionCarrito, LineaCarrito } from "@/shared/types/carrito";
import { leerCrudo, escribirCrudo, suscribir } from "@/shared/lib/almacenLocal";

const CLAVE = "ticoshot-carrito";

/**
 * Reducer puro, exportado aparte para probarlo sin React.
 * Nunca muta: siempre devuelve un arreglo nuevo.
 */
export function carritoReducer(
  estado: LineaCarrito[],
  accion: AccionCarrito,
): LineaCarrito[] {
  switch (accion.tipo) {
    case "agregar": {
      // Un producto agotado no entra al carrito, aunque se fuerce la accion.
      if (!accion.producto.disponible) return estado;

      const existe = estado.find((l) => l.producto.id === accion.producto.id);
      if (existe) {
        return estado.map((l) =>
          l.producto.id === accion.producto.id ? { ...l, cantidad: l.cantidad + 1 } : l,
        );
      }
      return [...estado, { producto: accion.producto, cantidad: 1 }];
    }

    case "cambiarCantidad": {
      // Cero o menos elimina la linea: evita cantidades negativas.
      if (accion.cantidad <= 0) {
        return estado.filter((l) => l.producto.id !== accion.id);
      }
      return estado.map((l) =>
        l.producto.id === accion.id ? { ...l, cantidad: accion.cantidad } : l,
      );
    }

    case "quitar":
      return estado.filter((l) => l.producto.id !== accion.id);

    case "ponerNota":
      return estado.map((l) =>
        l.producto.id === accion.id
          ? { ...l, nota: accion.nota.trim() || undefined }
          : l,
      );

    case "vaciar":
      return [];

    case "hidratar":
      return accion.lineas;
  }
}

/**
 * Suma SOLO las lineas que tienen precio.
 *
 * El precio de un producto es `number | null` mientras el cliente no lo
 * confirme (ver `shared/types/producto.ts`). Sumando `null` a secas el total
 * sale `NaN` y `formatoColones` lo pinta como "₡NaN" en el carrito — un fallo
 * que no rompe nada, no avisa, y lo descubre el comprador.
 *
 * Se acompana SIEMPRE de `faltanPrecios`: un total de ₡0 con tres litros
 * dentro es peor que no mostrar total.
 */
export function total(lineas: LineaCarrito[]): number {
  return lineas.reduce(
    (suma, l) => suma + (l.producto.precio ?? 0) * l.cantidad,
    0,
  );
}

/** `true` si alguna linea del carrito no tiene precio confirmado. */
export function faltanPrecios(lineas: LineaCarrito[]): boolean {
  return lineas.some((l) => l.producto.precio === null);
}

export function conteo(lineas: LineaCarrito[]): number {
  return lineas.reduce((suma, l) => suma + l.cantidad, 0);
}

const VACIO: LineaCarrito[] = [];

/**
 * Lee el carrito guardado y DESCARTA los productos que ya no existen en el catalogo.
 *
 * Sin esto, un carrito viejo en localStorage sobrevive a un cambio de catalogo y
 * el cliente podria terminar enviando por WhatsApp un pedido de algo que el
 * negocio ya no vende. Paso de verdad al reemplazar el catalogo de muestra por
 * el real.
 */
function parsear(crudo: string | null, idsValidos?: Set<string>): LineaCarrito[] {
  if (!crudo) return VACIO;
  try {
    const dato = JSON.parse(crudo);
    if (!Array.isArray(dato)) return VACIO;
    const lineas = dato as LineaCarrito[];
    if (!idsValidos) return lineas;
    const vigentes = lineas.filter((l) => idsValidos.has(l.producto?.id));
    return vigentes.length === lineas.length ? lineas : vigentes;
  } catch {
    return VACIO;
  }
}

type ValorCarrito = {
  lineas: LineaCarrito[];
  agregar: (producto: Producto) => void;
  cambiarCantidad: (id: string, cantidad: number) => void;
  quitar: (id: string) => void;
  ponerNota: (id: string, nota: string) => void;
  vaciar: () => void;
  cantidadDe: (id: string) => number;
  total: number;
  /** Alguna linea no tiene precio confirmado: el total esta incompleto. */
  faltanPrecios: boolean;
  conteo: number;
  abierto: boolean;
  abrir: () => void;
  cerrar: () => void;
};

const CarritoContexto = createContext<ValorCarrito | null>(null);

export function CarritoProvider({
  children,
  idsDelCatalogo,
}: {
  children: ReactNode;
  /**
   * Ids de los productos vigentes. Se inyecta desde el layout para no acoplar la
   * feature del carrito con la del catalogo: una feature nunca importa de otra.
   */
  idsDelCatalogo?: string[];
}) {
  const [abierto, setAbierto] = useState(false);
  const idsValidos = useMemo(
    () => (idsDelCatalogo ? new Set(idsDelCatalogo) : undefined),
    [idsDelCatalogo],
  );

  /*
    localStorage es el almacen real y se lee con useSyncExternalStore. Asi no
    hace falta hidratar con un setState dentro de un efecto (patron que React 19
    marca por provocar renders en cascada) y el desajuste servidor/cliente lo
    resuelve React: en el servidor devuelve el snapshot vacio y en el cliente el
    guardado.
  */
  const crudo = useSyncExternalStore(
    useCallback((f) => suscribir(CLAVE, f), []),
    () => leerCrudo(CLAVE),
    () => null, // snapshot del servidor: carrito vacio
  );

  const lineas = useMemo(() => parsear(crudo, idsValidos), [crudo, idsValidos]);

  const despachar = useCallback(
    (accion: AccionCarrito) => {
      const siguiente = carritoReducer(
        parsear(leerCrudo(CLAVE), idsValidos),
        accion,
      );
      escribirCrudo(CLAVE, JSON.stringify(siguiente));
    },
    [idsValidos],
  );

  const valor = useMemo<ValorCarrito>(
    () => ({
      lineas,
      agregar: (producto) => despachar({ tipo: "agregar", producto }),
      cambiarCantidad: (id, cantidad) =>
        despachar({ tipo: "cambiarCantidad", id, cantidad }),
      quitar: (id) => despachar({ tipo: "quitar", id }),
      ponerNota: (id, nota) => despachar({ tipo: "ponerNota", id, nota }),
      vaciar: () => despachar({ tipo: "vaciar" }),
      cantidadDe: (id) => lineas.find((l) => l.producto.id === id)?.cantidad ?? 0,
      total: total(lineas),
      faltanPrecios: faltanPrecios(lineas),
      conteo: conteo(lineas),
      abierto,
      abrir: () => setAbierto(true),
      cerrar: () => setAbierto(false),
    }),
    [lineas, despachar, abierto],
  );

  return (
    <CarritoContexto.Provider value={valor}>{children}</CarritoContexto.Provider>
  );
}

export function useCarrito(): ValorCarrito {
  const ctx = useContext(CarritoContexto);
  if (!ctx) {
    throw new Error("useCarrito debe usarse dentro de <CarritoProvider>");
  }
  return ctx;
}
