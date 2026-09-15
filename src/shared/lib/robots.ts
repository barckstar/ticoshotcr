import type { MetadataRoute } from "next";

/**
 * Las reglas del robots.txt.
 *
 * ============ BLOQUEAR A TODOS TAMBIEN APAGA LA VISTA PREVIA ============
 * Esto empezo siendo una linea: mientras el sitio no este publicado,
 * `User-Agent: * / Disallow: /`. La intencion era correcta —el sitio todavia
 * ensena "Consultar precio" y un aviso de "no publicar asi", y que Google
 * indexe eso es peor que no salir en Google— pero la regla se llevo por delante
 * algo que no tenia nada que ver.
 *
 * `facebookexternalhit` es el rastreador que genera la vista previa de los
 * enlaces en WhatsApp Y en Facebook, y RESPETA robots.txt. Prohibido el paso,
 * no lee la pagina; sin leerla no hay Open Graph que valga, por perfectos que
 * esten los `<meta>`. Resultado: compartir el enlace por WhatsApp no mostraba
 * ni titulo ni imagen.
 *
 * Y no habia forma de cazarlo desde dentro: los meta tags estaban bien, la
 * imagen respondia 200, las medidas cuadraban con las declaradas. Todo lo
 * verificable en el sitio estaba correcto — el "no" lo daba un archivo distinto.
 *
 * La solucion es que robots.txt no es una sola regla: se le da su propio grupo
 * a cada rastreador social. Un rastreador obedece SOLO al grupo mas especifico
 * que coincida con su nombre, asi que el `*` de abajo deja de aplicarles.
 * ========================================================================
 */

/**
 * Los que arman la tarjeta de un enlace pegado en un chat.
 *
 * NINGUNO INDEXA: no ponen la pagina en un buscador, solo leen los `<meta>` de
 * Open Graph para dibujar la vista previa. Por eso pueden pasar aunque el sitio
 * siga sin publicarse — el motivo de bloquear era el fragmento en los
 * resultados de Google, y esto no lo toca.
 *
 * `facebookexternalhit` cubre WhatsApp, Facebook, Instagram y Messenger, que
 * comparten rastreador; los demas van aparte porque cada uno usa el suyo.
 */
export const RASTREADORES_SOCIALES = [
  "facebookexternalhit",
  "Facebot",
  "WhatsApp",
  "Twitterbot",
  "Slackbot-LinkExpanding",
  "TelegramBot",
  "Discordbot",
  "LinkedInBot",
] as const;

export function reglasRobots(
  publicado: boolean,
  sitioUrl: string,
): MetadataRoute.Robots {
  if (!publicado) {
    return {
      rules: [
        /* Primero los especificos, y solo despues la puerta cerrada. */
        ...RASTREADORES_SOCIALES.map((userAgent) => ({
          userAgent,
          allow: "/",
        })),
        { userAgent: "*", disallow: "/" },
      ],
      /*
        SIN `sitemap` mientras no este publicado. Es una invitacion a recorrer
        el sitio entero, y aqui justo se le esta diciendo a los buscadores que
        no lo hagan.
      */
    };
  }

  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${sitioUrl}/sitemap.xml`,
  };
}
