import {
  IconoFacebook,
  IconoInstagram,
  IconoWhatsApp,
} from "@/shared/components/ui/Iconos";
import { enlaceWhatsApp, mensajeConsulta, negocio } from "@/shared/config/negocio";
import {
  BotonCompartir,
  IconoCompartir,
} from "@/shared/components/ui/BotonCompartir";

/**
 * Barra lateral de redes, pegada al borde derecho.
 *
 * Encogida y semitransparente en reposo, a tamano completo al pasar el cursor
 * por encima, con `origin-right` para que no se despegue del borde al escalar.
 *
 * OCULTA EN MOVIL. A 375px un riel fijo a la derecha siempre termina tapando
 * contenido — en la plantilla se comia el final del subtitulo del hero. En
 * movil las redes siguen a mano desde el menu y desde el pie, asi que no se
 * pierde nada.
 *
 * NO LLEVA "COMO LLEGAR". Ticoshot no tiene local: un icono de mapa aqui
 * prometeria una direccion que no existe.
 */
const redes = [
  {
    nombre: "WhatsApp",
    href: enlaceWhatsApp(mensajeConsulta()),
    Icono: IconoWhatsApp,
  },
  { nombre: "Instagram", href: negocio.instagram, Icono: IconoInstagram },
  { nombre: "Facebook", href: negocio.facebook, Icono: IconoFacebook },
];

export function BarraSocial() {
  return (
    <div className="barra-social group/barra fixed right-0 top-1/2 z-40 hidden -translate-y-1/2 sm:block">
      <ul className="flex origin-right scale-90 flex-col gap-5 rounded-l-2xl border-y border-l border-acento/20 bg-superficie/80 p-3 opacity-85 shadow-[0_4px_24px_rgba(180,90,50,0.18)] backdrop-blur-md transition-all duration-300 group-hover/barra:scale-100 group-hover/barra:opacity-100 sm:gap-6 sm:p-4">
        {redes.map(({ nombre, href, Icono }) => (
          <li key={nombre}>
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="group/enlace relative block rounded-full focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-acento"
            >
              <span className="sr-only">
                {nombre} de {negocio.nombre}
              </span>
              <span className="icono-social block text-acento">
                <Icono className="size-6 sm:size-7" />
              </span>

              {/* Etiqueta que asoma desde la izquierda al pasar el cursor. */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute right-full top-1/2 mr-4 hidden -translate-y-1/2 translate-x-3 whitespace-nowrap rounded bg-acento px-3 py-1 font-display text-xs font-semibold uppercase tracking-wide text-white opacity-0 shadow-lg transition-all duration-300 group-hover/enlace:translate-x-0 group-hover/enlace:opacity-100 md:block"
              >
                {nombre}
                <span className="absolute left-full top-1/2 -translate-y-1/2 border-4 border-transparent border-l-acento" />
              </span>
            </a>
          </li>
        ))}

        {/* Compartir cierra la barra: no es una red, es una accion. */}
        <li className="border-t border-acento/20 pt-4 sm:pt-5">
          <BotonCompartir className="group/enlace relative block rounded-full focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-acento">
            <span className="sr-only">
              Compartir el sitio de {negocio.nombre}
            </span>
            <span className="icono-social block text-acento">
              <IconoCompartir className="size-6 sm:size-7" />
            </span>
            <span
              aria-hidden="true"
              className="pointer-events-none absolute right-full top-1/2 mr-4 hidden -translate-y-1/2 translate-x-3 whitespace-nowrap rounded bg-acento px-3 py-1 font-display text-xs font-semibold uppercase tracking-wide text-white opacity-0 shadow-lg transition-all duration-300 group-hover/enlace:translate-x-0 group-hover/enlace:opacity-100 md:block"
            >
              Compartir
              <span className="absolute left-full top-1/2 -translate-y-1/2 border-4 border-transparent border-l-acento" />
            </span>
          </BotonCompartir>
        </li>
      </ul>
    </div>
  );
}
