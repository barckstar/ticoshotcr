import { Logo } from "@/shared/components/ui/Logo";
import { Olas } from "@/shared/components/ui/Olas";
import { BotonEnlace } from "@/shared/components/ui/Boton";
import { IconoWhatsApp } from "@/shared/components/ui/Iconos";
import { enlaceWhatsApp, mensajeConsulta, negocio } from "@/shared/config/negocio";
import { SecuenciaHero } from "./SecuenciaHero";

/**
 * El hero. LO UNICO SOBRE EL PLIEGUE, y por eso el archivo mas delicado del
 * sitio.
 *
 * ============== COMO FUNCIONA: EL HERO FIJADO ==============
 * La seccion mide DOS PANTALLAS y su contenido va `sticky` pegado arriba. Al
 * bajar, la pagina se mueve pero el hero se queda quieto: esa pantalla de
 * recorrido es la que hace avanzar la secuencia de fotogramas del fondo —las
 * botellas pasando— y al final suelta la tarjeta.
 *
 * DOS PANTALLAS Y NO CUATRO. Un scrub de Apple ocupa tres o cuatro, pero Apple
 * esta contando la historia de un producto; aqui el objetivo es que la gente
 * llegue al catalogo y ordene. Cada pantalla de mas es una pantalla mas entre
 * el visitante y el boton de comprar. Con dos, el recorrido se siente y el
 * catalogo sigue a un scroll de distancia.
 *
 * Y DURANTE TODO EL RECORRIDO EL BOTON "ORDENAR" SIGUE EN PANTALLA, porque la
 * tarjeta esta fijada con el resto. Un hero que se apodera del scroll y ademas
 * esconde su llamada a la accion es un hero que cuesta ventas.
 * ==========================================================
 *
 * EL LCP ES EL TEXTO DE LA TARJETA, que ya viene en el HTML. El fondo es un
 * degradado en capas —ni una peticion de red— y encima va un <canvas>, que no
 * es candidato a LCP. Mientras la secuencia baja, el hero se ve como el mismo
 * atardecer coral, quieto.
 *
 * LA SECUENCIA REEMPLAZO AL VIDEO, Y ANTES A LA BANDA DE FOTOS. Ver
 * `SecuenciaHero.tsx` para por que un canvas y no un <video>.
 */
export function Hero() {
  return (
    <section
      id="inicio"
      /*
        `svh` y no `vh`: en el movil `vh` se mide contra el viewport CON la
        barra del navegador retraida, asi que la seccion nace mas alta que la
        pantalla y el recorrido del scrub se descuadra justo donde importa.
      */
      className="relative h-[200svh]"
    >
      {/*
        LO QUE SE VE. `sticky` mas `h-svh`: ocupa exactamente una pantalla y se
        queda pegado mientras la seccion de 200svh pasa por detras.
      */}
      <div className="sticky top-0 flex h-svh flex-col items-center justify-center overflow-hidden">
        {/*
          EL FONDO BASE. Un degradado en capas, sin una sola peticion de red: el
          navegador lo pinta en cuanto tiene el CSS. Reproduce el atardecer
          coral de la secuencia, asi que mientras los fotogramas bajan no se ve
          un hueco sino la misma escena, quieta.
        */}
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-20"
          style={{
            background:
              "radial-gradient(120% 90% at 12% 8%, #FFD9A8 0%, transparent 55%)," +
              "radial-gradient(100% 80% at 88% 18%, #FFA0A8 0%, transparent 50%)," +
              "radial-gradient(140% 110% at 50% 100%, #FF8A5B 0%, #FFB07C 45%, #F7C8B0 100%)",
          }}
        />

        <SecuenciaHero />

        {/*
          LA TARJETA, y las dos animaciones que lleva encima.

          VAN EN ELEMENTOS ANIDADOS Y NO EN UNO. `transform` es UNA sola
          propiedad: dos reglas que la declaren sobre el mismo elemento no se
          suman, la segunda pisa a la primera y una de las dos se pierde en
          silencio.

            [perspective]  da profundidad al giro. No es `transform`, pero
                           tiene que estar en el PADRE del que gira.
            card-scroll    el viaje y la vuelta, atados al scroll.
            flota          el mecido lento de siempre.
        */}
        <div className="relative z-10 px-5 [perspective:1400px]">
          <div className="card-scroll">
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
        </div>

        <Olas />
      </div>
    </section>
  );
}
