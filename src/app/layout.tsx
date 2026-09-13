import type { Metadata, Viewport } from "next";
import { Outfit, Inter } from "next/font/google";
import { negocio } from "@/shared/config/negocio";
import { SITIO_URL } from "@/shared/config/sitio";
import { productos, idsDeProductos } from "@/shared/data/productos";
import { Navbar } from "@/shared/components/layout/Navbar";
import { Footer } from "@/shared/components/layout/Footer";
import { BarraSocial } from "@/shared/components/layout/BarraSocial";
import { PuertaEdad } from "@/shared/components/layout/PuertaEdad";
import { SCRIPT_EDAD } from "@/shared/lib/edad";
import { ObservadorRevelado } from "@/shared/components/ui/ObservadorRevelado";
import { CarritoProvider } from "@/shared/lib/carrito";
import {
  EtiquetaJsonLd,
  jsonLdNegocio,
  jsonLdProducto,
  jsonLdPreguntas,
} from "@/shared/lib/jsonLd";
import { preguntas } from "@/features/faq/components/Faq";
import { CarritoUI } from "./CarritoUI";
import "./globals.css";

/*
  Outfit para titulares: geometrica, redondeada y con mucha personalidad en
  mayusculas, que es como esta escrito todo el sitio. Inter para el cuerpo.
  Las dos por next/font, o sea auto-alojadas: sin peticion a Google en tiempo
  de carga y sin salto de fuente.
*/
const display = Outfit({
  variable: "--fuente-display",
  subsets: ["latin"],
  weight: ["600", "700"],
  display: "swap",
});

const sans = Inter({
  variable: "--fuente-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITIO_URL),
  title: {
    default: `${negocio.nombre} | Chiliguaro, Miguelito y Sangría en ${negocio.ciudad}`,
    template: `%s | ${negocio.nombre}`,
  },
  description: `Litros de chiliguaro, miguelito y sangría 100% artesanales, hechos en ${negocio.ciudad} de ${negocio.provincia} desde el ${negocio.desde}. Pedí por WhatsApp al ${negocio.whatsappVisible}.`,
  keywords: [
    "chiliguaro San Ramón",
    "chiliguaro artesanal Costa Rica",
    "miguelito Costa Rica",
    "sangría artesanal Alajuela",
    "licores para fiestas San Ramón",
    "Ticoshot",
  ],
  alternates: { canonical: "/" },
  /*
    La imagen de compartir: 1200x630, que es lo que piden Facebook y WhatsApp.

    EL NOMBRE DEL ARCHIVO ES PARTE DEL CONTRATO. WhatsApp y Facebook cachean la
    imagen POR URL y no vuelven a pedirla: se cambio el diseño de `og.jpg` y las
    vistas previas siguieron mostrando la vieja durante horas. Al cambiar esta
    imagen hay que cambiarle el nombre — de ahi el sufijo.
    La compone `scripts/optimizar-fotos.py` recortando una franja horizontal de
    la foto de los tres, centrada en las etiquetas — encajar la foto 4:5 entera
    deja dos bandas vacias a los lados y las botellas salen diminutas.

    Instagram NO lee Open Graph: no genera vista previa de enlaces. Ahi la
    imagen sirve igual, pero como material que se sube a mano.
  */
  openGraph: {
    type: "website",
    locale: "es_CR",
    siteName: negocio.nombre,
    title: `${negocio.nombre} | 100% artesanal`,
    description: `Chiliguaro, Miguelito y Sangría en litro. Desde ${negocio.ciudad}, ${negocio.provincia}. Pedí por WhatsApp.`,
    url: "/",
    images: [
      {
        url: "/marca/og-logo.jpg",
        width: 1200,
        height: 630,
        alt: `Chiliguaro, Miguelito y Sangría de ${negocio.nombre}`,
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${negocio.nombre} | 100% artesanal`,
    description: `Chiliguaro, Miguelito y Sangría en litro. Pedí por WhatsApp.`,
    images: ["/marca/og-logo.jpg"],
  },
  applicationName: negocio.nombre,

  /*
    Quien firma el sitio. Google los usa para el panel de conocimiento, y en
    algunos lectores aparece como autor del contenido.
  */
  authors: [{ name: negocio.nombre, url: negocio.instagram }],
  creator: negocio.nombre,
  publisher: negocio.nombre,
  category: "Bebidas",

  /*
    `telephone: false` apaga que iOS convierta CUALQUIER numero del texto en un
    enlace de llamada. El telefono del sitio ya es un enlace de WhatsApp puesto
    a mano; sin esto, Safari tambien subraya el "8943 9595" del pie y las
    cantidades de las preguntas frecuentes, y se ve como si el sitio tuviera
    enlaces rotos por todos lados.
  */
  formatDetection: { telephone: false, date: false, address: false },

  manifest: "/manifest.webmanifest",

  /* Al guardarlo en la pantalla de inicio de un iPhone. */
  appleWebApp: {
    capable: true,
    title: negocio.nombre,
    statusBarStyle: "default",
  },

  icons: {
    icon: [
      { url: "/marca/icon.png", sizes: "32x32", type: "image/png" },
      { url: "/marca/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/marca/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/marca/apple-icon.png", sizes: "180x180" }],
  },
  /*
    NOINDEX MIENTRAS NO ESTE PUBLICADO. Ver `negocio.publicado` — el sitio
    todavia ensena marcadores de "por confirmar" que no deben salir en Google.
    `nocache` y `noimageindex` ademas evitan que quede copia en cache y que las
    fotos se indexen por su cuenta.
  */
  robots: negocio.publicado
    ? { index: true, follow: true }
    : { index: false, follow: false, nocache: true, noimageindex: true },
};

export const viewport: Viewport = {
  /* El crema del fondo: la barra del navegador en móvil se tiñe igual que la
     página y el hero se ve de borde a borde. */
  themeColor: "#FFF4EC",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es-CR"
      className={`${display.variable} ${sans.variable} h-full antialiased`}
      /*
        El script de la puerta de edad le pone `data-edad` a <html> ANTES de
        que React hidrate, asi que React encuentra un atributo que el no
        escribio y avisa de desajuste de hidratacion. Es el precio conocido de
        este patron —next-themes hace exactamente lo mismo— y se paga aqui.

        `suppressHydrationWarning` solo calla UN nivel: este elemento y sus
        atributos. No apaga los avisos del resto del arbol, asi que un
        desajuste de verdad mas abajo se sigue viendo.
      */
      suppressHydrationWarning
    >
      <head>
        {/*
          ESTE SCRIPT CORRE ANTES DEL PRIMER PINTADO y es lo que evita que
          quien ya confirmó la edad vea el modal aparecer y desaparecer en cada
          carga. Es el mismo patrón de los conmutadores de tema. Son ~90 bytes
          en línea: no hay peticion de red que espere.
        */}
        <script dangerouslySetInnerHTML={{ __html: SCRIPT_EDAD }} />
      </head>
      <body className="flex min-h-full flex-col">
        {/* Datos estructurados. TODO sale de negocio.ts: nada inventado. */}
        <EtiquetaJsonLd datos={jsonLdNegocio()} />
        {productos.map((p) => (
          <EtiquetaJsonLd key={p.id} datos={jsonLdProducto(p)} />
        ))}
        <EtiquetaJsonLd datos={jsonLdPreguntas(preguntas)} />

        {/*
          El ancla del respaldo sin JavaScript de la puerta de edad. Es hermano
          de `.puerta-edad` a proposito: el selector `#entrar:target ~
          .puerta-edad` de globals.css depende de que los dos cuelguen del
          mismo padre. Moverlo dentro de otro elemento rompe la puerta para
          quien no tenga JavaScript, y en silencio.
        */}
        <span id="entrar" className="sr-only" />
        <PuertaEdad />

        <CarritoProvider idsDelCatalogo={idsDeProductos}>
          <Navbar />
          <BarraSocial />
          {children}
          <Footer />
          <CarritoUI />

          {/*
            Todo el JavaScript del revelado al hacer scroll, en un solo lugar.
            Gracias a él, Revelar y las secciones que lo usan siguen siendo
            componentes de servidor.
          */}
          <ObservadorRevelado />
        </CarritoProvider>
      </body>
    </html>
  );
}
