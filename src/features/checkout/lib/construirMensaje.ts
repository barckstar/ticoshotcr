import { formatoColones } from "@/shared/lib/formatoColones";
import { negocio } from "@/shared/config/negocio";
import { SITIO_URL } from "@/shared/config/sitio";
import { medir, type MensajeMedido } from "@/shared/lib/whatsapp";
import type { LineaCarrito } from "@/shared/types/carrito";
import { etiquetaMetodoPago } from "../schema";
import type { DatosPedido } from "../schema";
import { enlaceUbicacion } from "./direccionesGuardadas";

/**
 * El mensaje que le llega a Ticoshot por WhatsApp.
 *
 * Es la unica salida del sitio. No hay pasarela de pago ni base de datos: todo
 * lo que el cliente escribio termina aqui, en un texto que alguien lee en un
 * telefono mientras hace otra cosa. Por eso el formato importa tanto como el
 * contenido — las lineas cortas, el total en negrita y la direccion en su
 * propio renglon no son estetica, son lo que hace que no se preparen mal tres
 * litros.
 *
 * `LIMITE_SEGURO` y `medir` viven en `shared/lib/whatsapp` porque eventos
 * tambien los necesita, y una feature no puede importar de otra.
 */

/** El mensaje de contacto, si algun dia se enciende `modoMuestra`. */
function construirMensajeContacto(): MensajeMedido {
  return medir(`${negocio.mensajeContacto}\n\n${SITIO_URL}`);
}

/**
 * El pedido de verdad.
 *
 * Vive en su PROPIA funcion exportada y no detras de un `if`, porque asi sus
 * pruebas lo ejercitan SIEMPRE, encendido o apagado el modo muestra. Metida
 * dentro del `if`, las pruebas del pedido pasaban a medir el mensaje de
 * contacto y dejaban de cubrir nada — paso de verdad en la plantilla.
 */
export function construirMensajePedido(
  lineas: LineaCarrito[],
  datos: DatosPedido,
  totalPedido: number,
): MensajeMedido {
  const partes: string[] = [`*PEDIDO — ${negocio.nombre}*`, ""];

  /*
    SIN PRECIO NO SE ESCRIBE UN NUMERO, ni aqui ni en la pantalla. Mientras el
    cliente no confirme cuanto vale el litro, la linea sale sin monto y el
    total dice "a confirmar". La alternativa —mandar ₡0, o peor, un precio de
    relleno— hace que quien recibe el pedido lea una cifra que no es suya y
    tenga que corregirla a mano en cada mensaje.
  */
  const faltanPrecios = lineas.some((l) => l.producto.precio === null);

  for (const l of lineas) {
    const litros = l.cantidad === 1 ? "litro" : "litros";
    const monto =
      l.producto.precio === null
        ? ""
        : `  ${formatoColones(l.producto.precio * l.cantidad)}`;

    partes.push(`${l.cantidad} ${litros} de ${l.producto.nombre}${monto}`);
  }

  partes.push("");
  partes.push(
    faltanPrecios
      ? "*TOTAL: a confirmar*"
      : `*TOTAL: ${formatoColones(totalPedido)}*`,
  );
  partes.push("");

  const modalidad = datos.modalidad === "entrega" ? "Entrega" : "Retiro";
  partes.push(`${modalidad} · ${datos.nombre} · ${datos.telefono}`);

  if (datos.modalidad === "entrega" && datos.direccion) {
    partes.push(datos.direccion);
    /*
      El enlace de Maps con las coordenadas exactas.

      WhatsApp no permite adjuntar un pin de ubicacion desde un enlace wa.me,
      asi que se manda el enlace: quien entrega lo toca y le abre la ruta. En
      la practica resuelve lo mismo y no cuesta nada — las coordenadas salen de
      navigator.geolocation, que es del navegador y no pide llave de API.
    */
    if (typeof datos.lat === "number" && typeof datos.lng === "number") {
      partes.push(`Ubicación: ${enlaceUbicacion(datos.lat, datos.lng)}`);
    }
  }

  partes.push(`Pago: ${etiquetaMetodoPago[datos.metodoPago]}`);

  if (datos.notas) partes.push(`Nota: ${datos.notas}`);

  if (datos.modalidad === "entrega") {
    // El costo del envio no lo calcula el sitio. Decirlo en el mensaje evita
    // el malentendido de que el total ya lo incluye.
    partes.push("El costo del envío se coordina aparte.");
  }

  return medir(partes.join("\n"));
}

/**
 * Lo que usa el checkout. Elige segun `negocio.modoMuestra`: en una muestra,
 * contacto; en el sitio de un cliente real —que es el caso de Ticoshot— el
 * pedido completo.
 */
export function construirMensaje(
  lineas: LineaCarrito[],
  datos: DatosPedido,
  totalPedido: number,
): MensajeMedido {
  return negocio.modoMuestra
    ? construirMensajeContacto()
    : construirMensajePedido(lineas, datos, totalPedido);
}
