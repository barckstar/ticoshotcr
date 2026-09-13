/**
 * Lo que el sitio necesita saber de un evento.
 *
 * ESTE ARCHIVO ERA UN COTIZADOR y ya no lo es. Calculaba litros a partir de
 * cuanta gente iba —`personas × shots ÷ 20`— y pintaba el resultado. Se quito
 * a pedido del cliente.
 *
 * La razon de fondo es buena: los shots por persona los habia puesto el
 * programador, no el bartender, y un numero inventado que el sitio presenta
 * como calculo es peor que no dar ninguno. Quien tiene mas de cinco anos de
 * barra sabe cuanto se toma en una fiesta de sesenta personas; el sitio no.
 *
 * Lo que queda es lo que de verdad hace falta: recoger los datos del evento y
 * mandarlos por WhatsApp para que el numero lo diga quien sabe.
 */

export type Intensidad = "suave" | "normal" | "fuerte";

/**
 * Como va a estar el ambiente.
 *
 * Sobrevivio al cotizador porque no era parte del calculo: es CONTEXTO para
 * quien cotiza. No es lo mismo surtir un almuerzo de oficina que una fiesta de
 * graduacion, y esa diferencia la tiene que saber el bartender antes de dar un
 * precio.
 */
export const etiquetaIntensidad: Record<Intensidad, string> = {
  suave: "Tranquilo — se toma poco",
  normal: "Normal — la mayoría se anima",
  fuerte: "Fiesta grande — se toma de verdad",
};

/**
 * Tope de invitados que acepta el formulario.
 *
 * No es un limite del negocio: es una guarda contra el campo numerico. Sin el,
 * alguien escribe 99999999 y eso viaja tal cual en el mensaje de WhatsApp.
 */
export const MAX_PERSONAS = 500;
