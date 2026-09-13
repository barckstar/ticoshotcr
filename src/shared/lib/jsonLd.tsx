import type { WithContext, Thing, Organization, Product, FAQPage } from "schema-dts";
import { negocio } from "@/shared/config/negocio";
import { SITIO_URL } from "@/shared/config/sitio";
import type { Producto } from "@/shared/types/producto";

/**
 * Datos estructurados. Es lo que lee Google para entender que es este sitio.
 *
 * VA TIPADO CON `schema-dts` y no como un objeto suelto: una propiedad mal
 * escrita en JSON-LD no produce ningun error —ni en el build ni en el
 * navegador—, simplemente Google la ignora y uno se entera meses despues
 * mirando por que el negocio no sale en las busquedas.
 */

export function EtiquetaJsonLd({ datos }: { datos: WithContext<Thing> }) {
  return (
    <script
      type="application/ld+json"
      /*
        El contenido lo genera este archivo a partir de `negocio.ts`, no entra
        nada del usuario. Aun asi se escapa `<` — un `</script>` dentro de una
        cadena cerraria la etiqueta antes de tiempo y romperia la pagina.
      */
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(datos).replace(/</g, "\\u003c"),
      }}
    />
  );
}

/**
 * El negocio.
 *
 * ES `Organization` Y NO `LocalBusiness`, y esa es la decision que importa
 * aqui. `LocalBusiness` describe un lugar al que se puede ir: pide `address` y
 * Google lo usa para ponerlo en el mapa. Ticoshot NO TIENE LOCAL. Declararlo
 * como negocio local sin direccion es contarle a Google algo que no es, y
 * ponerle una direccion inventada mandaria gente a la casa de alguien.
 *
 * `areaServed` dice lo que si es cierto: desde donde sale y hasta donde llega.
 */
export function jsonLdNegocio(): WithContext<Organization> {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITIO_URL}#negocio`,
    name: negocio.nombre,
    description: negocio.tagline,
    url: SITIO_URL,
    telephone: `+${negocio.whatsapp}`,
    foundingDate: String(negocio.desde),

    /*
      EL LOGO ES LO QUE GOOGLE PONE EN EL PANEL DE CONOCIMIENTO. Sin el, sale
      el favicon recortado o nada. Tiene que ser una URL ABSOLUTA: una ruta
      relativa aqui no la resuelve nadie, porque el JSON-LD lo leen rastreadores
      que no tienen el contexto de la pagina.
    */
    logo: `${SITIO_URL}/marca/icon-512.png`,
    image: `${SITIO_URL}/marca/og-logo.jpg`,

    /*
      El canal real de atencion. `contactType` con un valor del vocabulario de
      schema.org —no texto libre— es lo que permite que Google lo entienda como
      punto de contacto y no como un dato suelto.
    */
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "sales",
      telephone: `+${negocio.whatsapp}`,
      availableLanguage: "Spanish",
      areaServed: negocio.pais,
    },
    areaServed: {
      "@type": "City",
      name: negocio.ciudad,
      containedInPlace: {
        "@type": "AdministrativeArea",
        name: negocio.provincia,
      },
    },
    sameAs: [negocio.facebook, negocio.instagram],
  };
}

/**
 * Los productos.
 *
 * SIN `offers` MIENTRAS NO HAYA PRECIO. Google exige `price` dentro de una
 * oferta; poner 0 declara que el producto es gratis y puede llegar a salir asi
 * en los resultados. Sin oferta el producto se indexa igual, solo que sin
 * precio — que es exactamente la verdad hoy.
 */
export function jsonLdProducto(producto: Producto): WithContext<Product> {
  const base: WithContext<Product> = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${producto.nombre} Ticoshot`,
    description: producto.descripcion,
    brand: { "@type": "Brand", name: negocio.nombre },
    category: "Bebida alcohólica",
    size: `${producto.litros} L`,

    /*
      LA IMAGEN ES OBLIGATORIA para que Google muestre el producto como
      resultado enriquecido. Sin ella el bloque se indexa pero nunca sale con
      foto, que es justo lo que hace que alguien haga clic.

      Van las DOS proporciones. Google recomienda 16:9, 4:3 y 1:1 para poder
      elegir segun donde lo pinte; aqui existen la vertical y la cuadrada, asi
      que se ofrecen las dos en vez de obligarlo a recortar una.

      Absolutas por lo mismo que el logo: quien lee esto no tiene el contexto
      de la pagina.
    */
    ...(producto.imagen
      ? {
          image: [
            `${SITIO_URL}${producto.imagen.vertical.src}`,
            `${SITIO_URL}${producto.imagen.cuadrada.src}`,
          ],
        }
      : {}),
  };

  if (producto.precio === null) return base;

  return {
    ...base,
    offers: {
      "@type": "Offer",
      price: producto.precio,
      priceCurrency: "CRC",
      availability: producto.disponible
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      seller: { "@type": "Organization", name: negocio.nombre },
    },
  };
}

/**
 * Las preguntas frecuentes.
 *
 * Recibe las preguntas por parametro en vez de importarlas: `shared/` no puede
 * importar de una feature, y las preguntas viven en `features/faq/`. Quien las
 * une es `app/layout.tsx`, que es el lugar que la arquitectura designa para
 * componer.
 */
export function jsonLdPreguntas(
  preguntas: { pregunta: string; respuesta: string }[],
): WithContext<FAQPage> {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: preguntas.map((p) => ({
      "@type": "Question",
      name: p.pregunta,
      acceptedAnswer: { "@type": "Answer", text: p.respuesta },
    })),
  };
}
