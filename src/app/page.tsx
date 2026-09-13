import { productos, idsDeProductos } from "@/shared/data/productos";
import { kits, verificarKits } from "@/features/kits/lib/kits";
import { Hero } from "@/features/hero/components/Hero";
import { Catalogo } from "@/features/catalogo/components/Catalogo";
import { Kits } from "@/features/kits/components/Kits";
import { Ritual } from "@/features/ritual/components/Ritual";
import { Historia } from "@/features/historia/components/Historia";
import { Eventos } from "@/features/eventos/components/Eventos";
import { Resenas } from "@/features/resenas/components/Resenas";
import { Entrega } from "@/features/entrega/components/Entrega";
import { Faq } from "@/features/faq/components/Faq";
import type { Producto } from "@/shared/types/producto";

/**
 * LA PAGINA. Una sola ruta, nueve secciones ancladas.
 *
 * ESTE ARCHIVO ES EL PUNTO DE COMPOSICION. Es el unico lugar del sitio donde
 * se conocen dos features a la vez, y por eso es el unico que puede unirlas:
 * lee los productos y los kits y se los pasa por props a quien los necesite.
 * `features/kits/` no puede importar los productos por su cuenta sin romper la
 * regla de que una feature nunca importa de otra.
 *
 * Casi todo lo de aqui es de SERVIDOR. Solo tres cosas cruzan al navegador:
 * los botones de agregar, el drawer del carrito/checkout (montado en el
 * layout) y el cotizador de eventos.
 */

// Un id mal escrito en kits.json deja un kit con dos litros en vez de tres, en
// silencio. Esto lo convierte en un fallo de `next build`.
verificarKits(idsDeProductos);

/** id de kit -> sus productos, resueltos una vez y en orden. */
const productosDeKit: Record<string, Producto[]> = Object.fromEntries(
  kits.map((k) => [
    k.id,
    k.productos
      .map((id) => productos.find((p) => p.id === id))
      .filter((p): p is Producto => p !== undefined),
  ]),
);

export default function Inicio() {
  return (
    <main>
      <Hero productos={productos} />
      <Catalogo productos={productos} />
      <Kits kits={kits} productosDeKit={productosDeKit} />
      <Ritual />
      <Historia />
      <Eventos />
      <Resenas />
      <Entrega />
      <Faq />
    </main>
  );
}
