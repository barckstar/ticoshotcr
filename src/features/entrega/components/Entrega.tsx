import { Seccion } from "@/shared/components/ui/Seccion";
import { Tarjeta } from "@/shared/components/ui/Tarjeta";
import { BotonEnlace } from "@/shared/components/ui/Boton";
import { IconoWhatsApp } from "@/shared/components/ui/Iconos";
import { enlaceWhatsApp, negocio } from "@/shared/config/negocio";

/**
 * "No tenemos local, tenemos moto".
 *
 * CONVIERTE LA FALTA EN ARGUMENTO. Un sitio de un negocio sin local
 * normalmente deja el hueco donde iria el mapa, o peor: pone un mapa de la
 * ciudad como si fuera una direccion. Las dos cosas leen como que el negocio
 * esta a medias. Decirlo de frente —trabajamos por encargo y llegamos— lo
 * convierte en lo que de verdad es: la razon por la que sirven para fiestas.
 *
 * NO PROMETE COBERTURA QUE NO TENEMOS. Se listan SOLO los lugares que el
 * cliente confirmo —hoy San Ramon de Alajuela— y lo demas se presenta como
 * algo que se organiza, no como cobertura. "Llegamos a todo Alajuela" es la
 * clase de promesa que termina con alguien esperando un pedido que no va a
 * salir.
 */
export function Entrega() {
  const zonas = negocio.zonaEntrega;

  return (
    <Seccion
      id="entrega"
      antetitulo="Entregas"
      titulo="No tenemos local. Tenemos moto."
      decorado="entrega"
    >
      <div className="grid gap-7 lg:grid-cols-3">
        <Tarjeta className="p-7">
          <h3 className="font-display text-xl font-bold uppercase tracking-tight text-texto">
            Se trabaja por encargo
          </h3>
          <p className="mt-3 leading-relaxed text-texto-suave">
            Cada litro se prepara cuando se pide. No hay estante con botellas
            esperando: por eso llega fresco y por eso conviene avisar con
            tiempo si la cantidad es grande.
          </p>
        </Tarjeta>

        <Tarjeta className="p-7">
          <h3 className="font-display text-xl font-bold uppercase tracking-tight text-texto">
            Retiro o entrega
          </h3>
          <p className="mt-3 leading-relaxed text-texto-suave">
            Podés pasar a recogerlo o te lo llevamos. Al hacer el pedido se
            elige, y si es entrega el sitio manda tu ubicación exacta en el
            mismo mensaje para que nadie ande dando vueltas.
          </p>
        </Tarjeta>

        <Tarjeta className="p-7">
          <h3 className="font-display text-xl font-bold uppercase tracking-tight text-texto">
            {zonas ? "Dónde llegamos" : "El envío se coordina"}
          </h3>

          {zonas ? (
            <>
              <ul className="mt-3 space-y-2">
                {zonas.map((z) => (
                  <li key={z} className="flex items-center gap-2.5 text-texto-suave">
                    <span aria-hidden="true" className="size-1.5 rounded-full bg-acento" />
                    {z}
                  </li>
                ))}
              </ul>

              {/*
                Fuera de la zona se ORGANIZA, que no es lo mismo que "llegamos".
                La diferencia importa: lo primero invita a preguntar, lo segundo
                es una promesa que quizá no se pueda cumplir. Por eso son dos
                campos distintos en negocio.ts.
              */}
              {negocio.entregaFueraDeZona && (
                <p className="mt-4 leading-relaxed text-texto-suave">
                  ¿Vas para otro lado? Se organiza. Escribinos con el día y el
                  lugar y te decimos de una vez si se puede.
                </p>
              )}
            </>
          ) : (
            <p className="mt-3 leading-relaxed text-texto-suave">
              Salimos de {negocio.ciudad}, {negocio.provincia}. El costo y el
              alcance del envío se acuerdan por WhatsApp según a dónde vaya —
              no es lo mismo el centro que una playa a dos horas.
            </p>
          )}
        </Tarjeta>
      </div>

      <div className="mt-10 flex flex-col items-center gap-4 rounded-3xl bg-superficie-alt px-7 py-10 text-center">
        <h3 className="max-w-xl text-balance font-display text-2xl font-bold uppercase tracking-tight text-texto">
          ¿Vas para la playa o tenés un plan lejos?
        </h3>
        <p className="max-w-lg text-balance leading-relaxed text-texto-suave">
          Escribinos con el día y el lugar. Si se puede llegar, se llega; y si
          no, te lo decimos de una vez.
        </p>
        <BotonEnlace
          href={enlaceWhatsApp(
            `Hola ${negocio.nombre}, ¿llegan hasta donde yo estoy? Les cuento el plan:`,
          )}
          tamano="lg"
          className="mt-2"
        >
          <IconoWhatsApp className="size-5" />
          Preguntar por WhatsApp
        </BotonEnlace>
      </div>
    </Seccion>
  );
}
