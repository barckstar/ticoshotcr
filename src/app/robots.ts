import type { MetadataRoute } from "next";
import { negocio } from "@/shared/config/negocio";
import { SITIO_URL } from "@/shared/config/sitio";
import { reglasRobots } from "@/shared/lib/robots";

/**
 * El robots.txt.
 *
 * Mientras `negocio.publicado` sea false, los BUSCADORES quedan fuera: el sitio
 * todavia ensena "Consultar precio" y un aviso de "no publicar asi", y que
 * Google lo indexe asi es peor que no salir en Google, porque el fragmento de
 * los resultados se queda con esos marcadores durante semanas.
 *
 * Los rastreadores de vista previa —WhatsApp, Facebook, Twitter— SI pasan, y
 * tienen que pasar: respetan robots.txt, y bloquearlos apaga la tarjeta del
 * enlace al compartirlo. El porque completo esta en `shared/lib/robots.ts`.
 *
 * La decision de que se permite vive ahi y no aqui, porque esto es una ruta de
 * Next y no se puede cargar desde una prueba de Node.
 */
export default function robots(): MetadataRoute.Robots {
  return reglasRobots(negocio.publicado, SITIO_URL);
}
