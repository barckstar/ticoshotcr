import { Logo } from "@/shared/components/ui/Logo";
import { Olas } from "@/shared/components/ui/Olas";
import { BotonEnlace } from "@/shared/components/ui/Boton";
import { IconoWhatsApp } from "@/shared/components/ui/Iconos";
import { enlaceWhatsApp, mensajeConsulta, negocio } from "@/shared/config/negocio";
import type { Producto } from "@/shared/types/producto";
import { Garabatos } from "./Garabatos";
import { BandaBotellas } from "./BandaBotellas";

/**
 * El hero. LO UNICO SOBRE EL PLIEGUE, y por eso el archivo mas delicado del
 * sitio.
 *
 * CERO JAVASCRIPT. Es un componente de servidor y no importa ninguno de
 * cliente. Todo lo que se mueve aqui —olas, banda, flotacion, garabatos— son
 * `@keyframes` de CSS que arrancan en el primer pintado, y la reaccion al
 * scroll es `animation-timeline` nativo. Si algo de esto dependiera del
 * observador de revelado, que vive en un `useEffect`, el hero quedaria
 * invisible hasta que llegue el JavaScript: exactamente los 4.401 ms de render
 * delay que la plantilla vino a matar.
 *
 * CERO VIDEO. El LCP es el degradado, que se pinta con el HTML. El video de
 * sus reels va en una banda mas abajo, donde puede cargar perezoso.
 *
 * CONTRASTE: el titular va en MARRON sobre el coral (7,51:1). El blanco sobre
 * coral da 2,32:1 y no pasa AA, aunque sea lo que usan en sus posts.
 */
export function Hero({ productos }: { productos: Producto[] }) {
  return (
    <section
      id="inicio"
      className="relative isolate flex min-h-svh flex-col items-center justify-center overflow-hidden pt-24 pb-56 sm:pb-72"
    >
      {/*
        EL LCP. Un degradado en capas, sin una sola peticion de red: el
        navegador lo pinta en cuanto tiene el CSS. Reproduce el atardecer
        coral de sus publicaciones.
      */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(120% 90% at 12% 8%, #FFD9A8 0%, transparent 55%)," +
            "radial-gradient(100% 80% at 88% 18%, #FFA0A8 0%, transparent 50%)," +
            "radial-gradient(140% 110% at 50% 100%, #FF8A5B 0%, #FFB07C 45%, #F7C8B0 100%)",
        }}
      />

      <Garabatos />

      {/*
        LA TARJETA.

        `flota` la mece despacio siempre; `card-scroll` la corre y la desvanece
        conforme se baja. Son dos animaciones en el MISMO elemento y por eso
        van en capas distintas del DOM: `transform` no se puede componer, la
        segunda declaracion pisaria a la primera y una de las dos se perderia.
      */}
      <div className="card-scroll relative z-10 px-5">
        <div className="flota">
          <div className="mx-auto w-full max-w-sm rounded-[2rem] border border-white/60 bg-superficie/85 p-8 text-center shadow-[0_20px_60px_rgba(150,60,30,0.22)] backdrop-blur-md sm:p-10">
            <Logo
              className="mx-auto h-32 w-auto text-acento sm:h-40"
              conTexto
              titulo={`${negocio.nombre}, 100% artesanal`}
            />

            <p className="mt-6 text-balance text-sm font-medium leading-relaxed text-texto sm:text-base">
              Litros de chiliguaro, miguelito y sangría.
              <br />
              Hechos con amor en {negocio.ciudad} desde el {negocio.desde}.
            </p>

            <div className="mt-7 flex flex-col gap-3">
              {/* El boton que pidio el cliente. Baja al catalogo, que es
                  donde de verdad se ordena. */}
              <BotonEnlace href="#productos" tamano="lg">
                Ordenar
              </BotonEnlace>

              <BotonEnlace
                href={enlaceWhatsApp(mensajeConsulta())}
                variante="contorno"
                tamano="lg"
              >
                <IconoWhatsApp className="size-5" />
                {negocio.whatsappVisible}
              </BotonEnlace>
            </div>
          </div>
        </div>
      </div>

      <BandaBotellas productos={productos} />

      <Olas />
    </section>
  );
}
