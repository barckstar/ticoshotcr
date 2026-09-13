"use client";

import { useCarrito } from "@/shared/lib/carrito";
import { Boton } from "@/shared/components/ui/Boton";
import { IconoCarrito } from "@/shared/components/ui/Iconos";
import type { Producto } from "@/shared/types/producto";

/**
 * Agrega los litros del kit al carrito de un solo toque.
 *
 * METE LINEAS SUELTAS, NO UNA LINEA "KIT". Es la decision que importa aqui:
 * el carrito habla de litros, asi que el cliente puede quitar uno, cambiar la
 * cantidad de otro y el pedido que llega por WhatsApp sigue diciendo cuantos
 * litros de cada cosa hay que preparar. Una linea "Kit de playa x1" obligaria
 * a quien lo recibe a recordar que trae dentro — y a mantener esa equivalencia
 * en dos lugares.
 *
 * Isla de cliente diminuta, por lo mismo que BotonAgregar: la tarjeta del kit
 * es de servidor.
 */
export function BotonAgregarKit({
  productos,
  nombreKit,
  className,
}: {
  productos: Producto[];
  nombreKit: string;
  className?: string;
}) {
  const { agregar, abrir } = useCarrito();
  const disponibles = productos.filter((p) => p.disponible);

  if (disponibles.length === 0) {
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
        // `agregar` suma uno por id; los kits no repiten producto, asi que
        // cada llamada crea su propia linea.
        for (const p of disponibles) agregar(p);
        abrir();
      }}
    >
      <IconoCarrito className="size-5" />
      <span className="sr-only">Agregar {nombreKit}: </span>
      Agregar los {disponibles.length}
    </Boton>
  );
}
