import { negocio } from "@/shared/config/negocio";

/**
 * Todo lo que sabe el sitio sobre mandar un mensaje por WhatsApp.
 *
 * VIVE EN `shared/` Y NO EN EL CHECKOUT. Lo necesitan DOS features: el
 * checkout arma el pedido de litros y eventos arma la cotizacion de la fiesta.
 * Si esto se quedara en `features/checkout/`, eventos tendria que importar de
 * otra feature — lo unico que la arquitectura prohibe de plano. Cuando dos
 * features necesitan lo mismo, sube a shared.
 */

/**
 * Margen seguro para el texto YA CODIFICADO que viaja dentro de la URL.
 *
 * Los navegadores aceptan mucho mas, pero WhatsApp en iOS TRUNCA ANTES Y LO
 * HACE EN SILENCIO: el pedido llega a medias, el cliente cree que lo mando
 * completo y quien lo recibe no tiene forma de saber que falta. Por eso el
 * limite se mide y se avisa en pantalla en vez de confiar en el navegador.
 */
export const LIMITE_SEGURO = 1500;

export type MensajeMedido = {
  texto: string;
  largoCodificado: number;
  excedeLimite: boolean;
};

/** Mide el texto ya codificado, que es el largo que de verdad viaja. */
export function medir(texto: string): MensajeMedido {
  const largoCodificado = encodeURIComponent(texto).length;
  return {
    texto,
    largoCodificado,
    excedeLimite: largoCodificado > LIMITE_SEGURO,
  };
}

/** Abre WhatsApp con el mensaje ya escrito. */
export function enviarPorWhatsApp(texto: string): void {
  const url = `https://wa.me/${negocio.whatsapp}?text=${encodeURIComponent(texto)}`;
  window.open(url, "_blank", "noopener,noreferrer");
}
