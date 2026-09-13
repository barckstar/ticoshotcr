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
      /*
        ALTO: 82svh, no 100svh.

        Un hero de pantalla completa deja al visitante con cero pistas de que
        hay algo mas abajo; tiene que apostar a que si. Cortandolo antes, el
        borde de la seccion siguiente ASOMA, y eso es lo que invita a bajar sin
        tener que ponerle una flechita parpadeando.

        `svh` y no `vh`: en el movil `vh` se mide contra el viewport CON la
        barra del navegador retraida, asi que al cargar la pagina el hero nace
        mas alto que la pantalla y el asomo desaparece justo donde importa.
      */
      className="relative isolate flex min-h-[88svh] flex-col items-center justify-center overflow-hidden pt-24 pb-72 sm:pb-96"
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
          <div className="mx-auto w-full max-w-sm rounded-[2rem] border border-white/60 bg-superficie/85 p-7 text-center shadow-[0_20px_60px_rgba(150,60,30,0.22)] backdrop-blur-md sm:p-8">
            <Logo
              className="mx-auto h-24 w-auto text-acento sm:h-28"
              conTexto
              titulo={`${negocio.nombre}, 100% artesanal`}
            />

            <p className="mt-5 text-balance text-sm font-medium leading-relaxed text-texto">
              Litros de chiliguaro, miguelito y sangría.
              <br />
              Hechos con amor en {negocio.ciudad} desde el {negocio.desde}.
            </p>

            <div className="mt-6 flex flex-col gap-2.5">
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

      {/*
        LAS OLAS VAN ANTES QUE LA BANDA, y el orden aqui es el orden de
        pintado: lo que va despues queda encima.

        Al reves —que era como estaba— las tres capas de ola se pintaban SOBRE
        las fotos, y las dos de atras son translucidas (55% y 70%): las
        botellas salian lavadas, como detras de un vidrio esmerilado. Con las
        fotos encima, las botellas se leen y la ola de adelante sigue cerrando
        la seccion por debajo de ellas.
      */}
      {/*
        LA BANDA VA ANTES QUE LAS OLAS, y el orden aqui es el orden de pintado:
        lo que va despues queda encima. Asi el agua pasa POR DELANTE de las
        tarjetas y las botellas se leen saliendo de ella.

        Estuvo al reves un tiempo, y por una razon: las dos capas de ola de
        atras son translucidas (55% y 70%), asi que cubriendo la tarjeta ENTERA
        dejaban la foto lavada, como tras un vidrio esmerilado. Lo que lo
        arregla no es el orden sino la ALTURA: las olas llegan a 184px y las
        tarjetas empiezan a 96px, o sea que el agua les toca el cuarto de abajo
        y la etiqueta queda siempre por encima de la linea de flotacion.
      */}
      <BandaBotellas productos={productos} />

      <Olas />
    </section>
  );
}
