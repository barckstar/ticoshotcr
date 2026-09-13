import type { MetadataRoute } from "next";
import { negocio } from "@/shared/config/negocio";
import { SITIO_URL } from "@/shared/config/sitio";

/**
 * El robots.txt.
 *
 * MIENTRAS `negocio.publicado` SEA FALSE, BLOQUEA A TODOS. El sitio todavia
 * ensena "Consultar precio" y un aviso de "no publicar asi" en las resenas:
 * que Google lo indexe asi es peor que no salir en Google, porque el fragmento
 * de los resultados se queda con esos marcadores durante semanas.
 *
 * No impide abrirlo ni compartirlo por WhatsApp — eso es Open Graph, que no
 * pasa por aqui.
 */
export default function robots(): MetadataRoute.Robots {
  if (!negocio.publicado) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }

  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${SITIO_URL}/sitemap.xml`,
  };
}
