"use client";

import { useCarrito } from "@/shared/lib/carrito";
import { Boton } from "@/shared/components/ui/Boton";
import { IconoCarrito } from "@/shared/components/ui/Iconos";
import type { Producto } from "@/shared/types/producto";

/**
 * El boton de agregar, aislado en su propia isla de cliente.
 *
 * Se separo de la tarjeta A PROPOSITO. La tarjeta es el 90% del marcado
 * —titulo, descripcion, notas, botella— y no necesita JavaScript para nada;
 * si llevara "use client" todo eso viajaria al navegador para hidratar un
 * unico boton. Asi la tarjeta es de servidor y solo cruza esto.
 */
export function BotonAgregar({
  producto,
  className,
}: {
  producto: Producto;
  className?: string;
}) {
  const { agregar, abrir, cantidadDe } = useCarrito();
  const enCarrito = cantidadDe(producto.id);

  if (!producto.disponible) {
    return (
      <Boton disabled className={className} tamano="lg">
        Agotado
      </Boton>
    );
  }

  return (
    <Boton
      className={className}
      tamano="lg"
      onClick={() => {
        agregar(producto);
        // Abrir el carrito confirma que el toque hizo algo. Sin esto, en
        // movil el boton parece no responder: el contador del carrito
        // flotante queda fuera de la vista.
        abrir();
      }}
    >
      <IconoCarrito className="size-5" />
      {enCarrito > 0 ? `Agregar otro (${enCarrito})` : "Agregar"}
    </Boton>
  );
}
