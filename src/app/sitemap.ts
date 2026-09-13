import type { MetadataRoute } from "next";

const SITIO =
  process.env.NEXT_PUBLIC_SITIO_URL ?? "https://ticoshot.vercel.app";

/**
 * El sitemap de un sitio de UNA sola ruta.
 *
 * Las anclas (#productos, #eventos…) NO van aqui: para un buscador
 * `/#productos` y `/` son la misma URL, asi que listarlas no agrega paginas,
 * solo repite la misma nueve veces. Existe igual porque sin sitemap Google
 * tarda mas en descubrir un dominio nuevo, y este dominio es nuevo.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITIO,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
