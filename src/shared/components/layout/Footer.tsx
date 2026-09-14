import { Logo } from "@/shared/components/ui/Logo";
import { Contenedor } from "@/shared/components/ui/Contenedor";
import {
  IconoFacebook,
  IconoInstagram,
  IconoWhatsApp,
} from "@/shared/components/ui/Iconos";
import { enlaceWhatsApp, mensajeConsulta, negocio } from "@/shared/config/negocio";

const secciones = [
  { href: "#productos", texto: "Los tres" },
  { href: "#kits", texto: "Armá tu hielera" },
  { href: "#ritual", texto: "Cómo se toma" },
  { href: "#nosotros", texto: "Quiénes somos" },
  { href: "#eventos", texto: "Eventos y catering" },
  { href: "#entrega", texto: "Entregas" },
  { href: "#resenas", texto: "Reseñas" },
  { href: "#preguntas", texto: "Preguntas" },
] as const;

export function Footer() {
  const anos = new Date().getFullYear() - negocio.desde;

  return (
    <footer className="mt-auto">
      {/*
        AQUI NO VA LA OLA. La pone `<Playa>` al final de `app/page.tsx`, junto
        con el sol y las palmeras, y ya entra al rojo del pie. Tener las dos
        pintaba dos olas seguidas.
      */}
      <div className="bg-acento text-white">
        <Contenedor className="py-14">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr]">
            <div>
              {/*
                El logo aqui va en BLANCO sobre el rojo: 5.24:1. Es la unica
                superficie del sitio donde el blanco es legible.
              */}
              <Logo className="h-24 w-auto text-white" titulo={negocio.nombre} />
              <p className="mt-5 max-w-xs text-sm leading-relaxed text-white/90">
                {negocio.tagline} Desde {negocio.ciudad}, {negocio.provincia},
                hace {anos} años.
              </p>
            </div>

            <nav aria-label="Secciones del sitio">
              <h2 className="font-display text-sm font-bold uppercase tracking-[0.2em]">
                El sitio
              </h2>
              <ul className="mt-4 space-y-2.5">
                {secciones.map(({ href, texto }) => (
                  <li key={href}>
                    <a
                      href={href}
                      className="text-sm text-white/90 underline-offset-4 transition-colors hover:text-white hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
                    >
                      {texto}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            <div>
              <h2 className="font-display text-sm font-bold uppercase tracking-[0.2em]">
                Escribinos
              </h2>
              <ul className="mt-4 space-y-3">
                <li>
                  <a
                    href={enlaceWhatsApp(mensajeConsulta())}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2.5 text-sm text-white/90 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
                  >
                    <IconoWhatsApp className="size-5 shrink-0" />
                    {negocio.whatsappVisible}
                  </a>
                </li>
                <li>
                  <a
                    href={negocio.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2.5 text-sm text-white/90 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
                  >
                    <IconoInstagram className="size-5 shrink-0" />
                    {negocio.instagramHandle}
                  </a>
                </li>
                <li>
                  <a
                    href={negocio.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2.5 text-sm text-white/90 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
                  >
                    <IconoFacebook className="size-5 shrink-0" />
                    Ticoshot CR
                  </a>
                </li>
              </ul>

              {/*
                No hay direccion porque no hay local. Decirlo es mejor que dejar
                el hueco: quien busca un dato y no lo encuentra asume que el
                sitio esta incompleto.
              */}
              <p className="mt-5 text-sm text-white/80">
                Sin local fijo. Trabajamos por encargo y entregamos.
              </p>
            </div>
          </div>

          {/*
            AVISO DE CONSUMO RESPONSABLE. Obligacion de cualquiera que venda
            licor, no un adorno legal: va en el pie de TODAS las paginas.
          */}
          <div className="mt-12 border-t border-white/25 pt-7">
            <p className="text-sm font-semibold">
              Prohibida la venta a menores de {negocio.edadMinima} años.
              Tomá con moderación. Si vas a manejar, no tomés.
            </p>
            <p className="mt-4 text-xs text-white/75">
              © {new Date().getFullYear()} {negocio.nombre}. {negocio.ciudad},{" "}
              {negocio.provincia}, Costa Rica.
            </p>
          </div>
        </Contenedor>
      </div>
    </footer>
  );
}
