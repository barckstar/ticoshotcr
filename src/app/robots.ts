import type { MetadataRoute } from "next";
import { SITIO_URL } from "@/shared/config/sitio";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${SITIO_URL}/sitemap.xml`,
  };
}
