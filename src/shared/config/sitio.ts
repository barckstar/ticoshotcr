/**
 * La URL publica del sitio. UN solo lugar, y a prueba de valores raros.
 *
 * ============ POR QUE ESTE ARCHIVO EXISTE ============
 * El despliegue en Vercel REVENTO por esto:
 *
 *     TypeError: Invalid URL
 *       at metadataBase: new URL(SITIO)
 *       code: 'ERR_INVALID_URL', input: ''
 *
 * La linea era esta, repetida en cinco archivos:
 *
 *     process.env.NEXT_PUBLIC_SITIO_URL ?? "https://..."
 *
 * `??` SOLO cae al valor por defecto con `null` o `undefined`. Una variable de
 * entorno definida pero VACIA es la cadena `""`, que no es ninguno de los dos:
 * pasa de largo, y `new URL("")` lanza.
 *
 * Y ese es el caso normal, no uno raro. Quien crea la variable en el panel de
 * Vercel y la deja sin rellenar obtiene exactamente `""`. Para variables de
 * entorno `??` es casi siempre el operador equivocado.
 * ====================================================
 *
 * El orden de preferencia va de lo mas explicito a lo mas automatico:
 *
 *   1. `NEXT_PUBLIC_SITIO_URL`, si trae algo que de verdad es una URL.
 *   2. El dominio que Vercel asigna al despliegue. No lleva protocolo.
 *   3. Un valor fijo, para que nada se caiga nunca por esto.
 */

/** El respaldo final. Coincide con el nombre del repositorio. */
const POR_DEFECTO = "https://ticoshotcr.vercel.app";

function resolver(): string {
  const propia = process.env.NEXT_PUBLIC_SITIO_URL?.trim();
  if (propia) {
    try {
      /*
        Se normaliza a `origin`: descarta la barra final, la ruta y la
        query. Sin esto, poner "https://ticoshot.cr/" en el panel produce
        rutas con doble barra —"https://ticoshot.cr//sitemap.xml"— que
        funcionan de milagro pero salen feas en el SEO.
      */
      return new URL(propia).origin;
    } catch {
      /*
        Trae algo que no es una URL: por ejemplo "ticoshot.cr" sin protocolo,
        que es el error mas comun al rellenar el panel. Se sigue de largo en
        vez de tumbar el build entero por un dato de configuracion.
      */
    }
  }

  /*
    Los que pone Vercel solo. `VERCEL_PROJECT_PRODUCTION_URL` es el dominio
    estable de produccion; `VERCEL_URL` es el del despliegue concreto, que
    cambia en cada commit — sirve para las vistas previas.

    Vienen SIN protocolo ("algo.vercel.app"), de ahi el `https://` a mano.
  */
  const vercel = (
    process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL
  )?.trim();
  if (vercel) return `https://${vercel}`;

  return POR_DEFECTO;
}

export const SITIO_URL = resolver();
