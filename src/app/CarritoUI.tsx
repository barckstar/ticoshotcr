"use client";

import { useState } from "react";
import { CarritoBoton } from "@/features/carrito/components/CarritoBoton";
import { CarritoDrawer } from "@/features/carrito/components/CarritoDrawer";
import { CheckoutDrawer } from "@/features/checkout/components/CheckoutDrawer";
import { useCarrito } from "@/shared/lib/carrito";

/**
 * Une el boton flotante, el carrito y el checkout.
 *
 * VIVE EN `app/` Y NO DENTRO DE UNA FEATURE porque COMPONE DOS: carrito y
 * checkout. Una feature no importa de otra; la composicion se hace aqui, que
 * es el punto que la arquitectura designa para eso.
 */
export function CarritoUI() {
  const { cerrar, abierto } = useCarrito();
  const [checkoutAbierto, setCheckoutAbierto] = useState(false);

  return (
    <>
      {/*
        El boton flotante desaparece mientras hay un drawer abierto. Ofrecer
        "Ver pedido" con el pedido ya en pantalla no aporta nada, y encima se
        montaba sobre el propio drawer: se veian dos y hasta tres pastillas
        apiladas en el borde inferior.
      */}
      {!abierto && !checkoutAbierto && <CarritoBoton />}

      <CarritoDrawer
        onIrAlCheckout={() => {
          cerrar();
          setCheckoutAbierto(true);
        }}
      />

      <CheckoutDrawer
        abierto={checkoutAbierto}
        onCerrar={() => setCheckoutAbierto(false)}
      />
    </>
  );
}
