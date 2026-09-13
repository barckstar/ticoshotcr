"use client";

import { CLAVE_EDAD } from "@/shared/lib/edad";

/**
 * El unico JavaScript de la puerta de edad, y es una isla de cliente diminuta.
 *
 * Es un ANCLA y no un <button> a proposito: el `href="#entrar"` hace que la
 * puerta se abra por CSS aunque el JavaScript no haya llegado o falle. El
 * `onClick` solo agrega lo que CSS no puede hacer — recordarlo para la proxima
 * visita. Un <button> sin JavaScript no hace absolutamente nada.
 */
export function BotonEdad() {
  return (
    <a
      href="#entrar"
      onClick={() => {
        // En modo privado o con el almacenamiento bloqueado esto lanza. Que
        // no se pueda recordar la respuesta no puede impedir entrar.
        try {
          window.localStorage.setItem(CLAVE_EDAD, "1");
        } catch {
          /* sin memoria entre visitas, pero la puerta se abre igual */
        }
        document.documentElement.dataset.edad = "ok";
      }}
      className="inline-flex items-center justify-center rounded-full bg-acento px-7 py-3.5 font-display text-base font-semibold uppercase tracking-wide text-white transition-transform duration-200 hover:bg-acento-alt active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-acento"
    >
      Sí, soy mayor de edad
    </a>
  );
}
