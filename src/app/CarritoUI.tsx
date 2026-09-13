"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { CarritoBoton } from "@/features/carrito/components/CarritoBoton";
import { CarritoDrawer } from "@/features/carrito/components/CarritoDrawer";
import { useCarrito } from "@/shared/lib/carrito";

/**
 * Une el boton flotante, el carrito y el checkout.
 *
 * VIVE EN `app/` Y NO DENTRO DE UNA FEATURE porque COMPONE DOS: carrito y
 * checkout. Una feature no importa de otra; la composicion se hace aqui, que
 * es el punto que la arquitectura designa para eso.
 */

/**
 * EL CHECKOUT SE CARGA APARTE, y esta es la optimizacion que mas pesaba del
 * sitio.
 *
 * `CarritoUI` se monta en el layout, asi que todo lo que importe viaja en la
 * carga inicial. El checkout arrastra su esquema de Zod —lo necesita para
 * validar el formulario— y eso eran 91 KB comprimidos que bajaba TODO EL
 * MUNDO: tambien quien entra, mira las botellas y se va sin abrir el carrito.
 *
 * `ssr: false` porque es un modal: no hay nada que server-renderizar de algo
 * que empieza cerrado.
 */
const CheckoutDrawer = dynamic(
  () =>
    import("@/features/checkout/components/CheckoutDrawer").then(
      (m) => m.CheckoutDrawer,
    ),
  { ssr: false },
);

export function CarritoUI() {
  const { cerrar, abierto } = useCarrito();
  const [checkoutAbierto, setCheckoutAbierto] = useState(false);

  /*
    SE ADELANTA LA DESCARGA AL ABRIR EL CARRITO, que es el paso anterior.

    Sin esto, cargar el checkout aparte solo mueve el costo: al pulsar
    "Continuar el pedido" habria que esperar a que baje el chunk, y en una
    conexion lenta eso es medio segundo en el que el boton parece no responder
    — justo en el momento de comprar, que es el peor sitio para dudar.

    Pidiendolo cuando se abre el carrito, para cuando el usuario decide
    continuar ya esta en memoria. Es el mismo especificador de modulo que usa
    `dynamic`, asi que el empaquetador genera UN chunk y la segunda llamada es
    un acierto de cache.
  */
  useEffect(() => {
    if (abierto) void import("@/features/checkout/components/CheckoutDrawer");
  }, [abierto]);

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

      {/*
        MONTADO SOLO CUANDO ESTA ABIERTO, y no siempre con `abierto={false}`.

        `dynamic` descarga el chunk en cuanto el componente se RENDERIZA. Si
        estuviera siempre en el arbol dejandole a el decidir con su prop, el
        chunk bajaria igual en la carga inicial y toda esta separacion no
        serviria de nada.
      */}
      {checkoutAbierto && (
        <CheckoutDrawer
          abierto
          onCerrar={() => setCheckoutAbierto(false)}
        />
      )}
    </>
  );
}
