/**
 * La puerta de edad, en lo que comparten el servidor y el cliente.
 *
 * ESTE ARCHIVO NO LLEVA "use client", Y ESA ES TODA SU RAZON DE SER.
 *
 * `CLAVE_EDAD` vivia en `BotonEdad.tsx`, que si lo lleva, y `PuertaEdad.tsx`
 * —componente de SERVIDOR— la importaba de ahi para armar el script. El
 * resultado salio en el HTML asi:
 *
 *     localStorage.getItem(undefined)
 *
 * Un modulo marcado "use client" no le entrega VALORES al servidor: le entrega
 * REFERENCIAS que el empaquetador resuelve en el navegador. Leer una constante
 * suya durante el render del servidor da `undefined`, y no lo caza ni
 * TypeScript —el tipo sigue siendo `string`— ni el build ni el lint. La puerta
 * de edad seguia pintandose bien; lo unico que fallaba era que NUNCA se
 * recordaba la respuesta, y eso solo se ve abriendo el sitio dos veces.
 *
 * Regla: lo que necesiten las dos mitades va en un modulo neutro como este.
 */

/** Clave en localStorage. La usan el script del <head> y el boton. */
export const CLAVE_EDAD = "ticoshot-edad";

/**
 * El script que corre ANTES del primer pintado, en linea en el <head>.
 *
 * Marca `data-edad="ok"` en <html> para que CSS esconda la puerta sin que haya
 * que esperar a React. Sin el, quien ya confirmo ve el modal aparecer y
 * desaparecer en cada carga.
 *
 * La clave se interpola con `JSON.stringify` y no entre comillas a mano: asi
 * queda citada y escapada por construccion, y no hay forma de romper el script
 * cambiando el nombre de la clave.
 */
export const SCRIPT_EDAD =
  `try{if(localStorage.getItem(${JSON.stringify(CLAVE_EDAD)})==="1")` +
  `document.documentElement.dataset.edad="ok"}catch(e){}`;
