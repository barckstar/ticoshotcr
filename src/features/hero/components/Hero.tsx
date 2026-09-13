import { Logo } from "@/shared/components/ui/Logo";
import { Olas } from "@/shared/components/ui/Olas";
import { BotonEnlace } from "@/shared/components/ui/Boton";
import { IconoWhatsApp } from "@/shared/components/ui/Iconos";
import { enlaceWhatsApp, mensajeConsulta, negocio } from "@/shared/config/negocio";
import { VideoFondo } from "./VideoFondo";

/**
 * El hero. LO UNICO SOBRE EL PLIEGUE, y por eso el archivo mas delicado del
 * sitio.
 *
 * ================== POR QUE AHORA SI HAY VIDEO ==================
 * La primera version no lo llevaba, y el motivo sigue siendo cierto: un video
 * es lo mas caro que se puede poner arriba. Lo que cambio es COMO se paga.
 *
 *   - El LCP NO es el video. El fondo de verdad es un degradado en capas que
 *     se pinta con el HTML, y el video va encima SIN `poster`. Sin poster, el
 *     video deja de ser candidato a LCP y el candidato vuelve a ser el bloque
 *     de texto de la tarjeta, que ya viene en el HTML.
 *   - El video pesa 267 KB: ocho segundos, sin audio, 720x1280, con el indice
 *     al principio del archivo. Ver `scripts/optimizar-fotos.py`.
 *   - Mientras no ha cargado se ve el degradado, que es el mismo atardecer
 *     coral. No hay hueco negro ni salto de color, solo menos movimiento.
 *
 * Aun asi hay que MEDIRLO sobre el build de produccion: es la clase de
 * decision que se justifica con un Lighthouse, no con un razonamiento. Queda
 * anotado en PENDIENTE.md.
 * ===============================================================
 *
 * EL VIDEO REEMPLAZO A LA BANDA DE FOTOS Y A LOS GARABATOS. Los dos hacian ya
 * lo que hace el video —botellas cruzando de izquierda a derecha, garabatos de
 * crayon— y tenerlos a la vez era ruido: tres movimientos distintos peleandose
 * en la misma pantalla.
 *
 * CERO JAVASCRIPT salvo el video. La tarjeta, el logo y el texto son de
 * servidor; lo que se mueve son `@keyframes` y `animation-timeline` nativo.
 */
export function Hero() {
  return (
    <section
      id="inicio"
      /*
        ALTO: 82svh, no 100svh.

        Un hero de pantalla completa deja al visitante con cero pistas de que
        hay algo mas abajo; tiene que apostar a que si. Cortandolo antes, el
        borde de la seccion siguiente ASOMA, y eso invita a bajar sin tener que
        ponerle una flechita parpadeando.

        `svh` y no `vh`: en el movil `vh` se mide contra el viewport CON la
        barra del navegador retraida, asi que al cargar la pagina el hero nace
        mas alto que la pantalla y el asomo desaparece justo donde importa.
      */
      className="relative isolate flex min-h-[82svh] flex-col items-center justify-center overflow-hidden pt-20 pb-28 sm:pb-36"
    >
      {/*
        EL LCP. Un degradado en capas, sin una sola peticion de red: el
        navegador lo pinta en cuanto tiene el CSS. Reproduce el atardecer coral
        del video, asi que mientras el video carga no se ve un hueco sino la
        misma escena, quieta.
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

      {/*
        El video con su parallax. El envoltorio existe para separar las dos
        transformaciones: aqui vive el desplazamiento atado al scroll, y el
        video de dentro solo se encarga de cubrir. `transform` es una sola
        propiedad — declararla dos veces en el mismo elemento pierde una.
      */}
      <div aria-hidden="true" className="capa-parallax absolute inset-0 -z-10">
        <VideoFondo />
      </div>

      {/*
        LA TARJETA, y las tres animaciones que lleva encima.

        VAN EN TRES ELEMENTOS ANIDADOS Y NO EN UNO, por lo mismo:

          [perspective]  da profundidad al giro. No es `transform`, pero tiene
                         que estar en el PADRE del elemento que gira.
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
    </section>
  );
}
