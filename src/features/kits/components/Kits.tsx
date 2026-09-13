import { Seccion } from "@/shared/components/ui/Seccion";
import { Tarjeta } from "@/shared/components/ui/Tarjeta";
import { Botella } from "@/shared/components/ui/Botella";
import { RevelarCascada, ItemCascada } from "@/shared/components/ui/Revelar";
import type { Producto } from "@/shared/types/producto";
import type { Kit } from "../lib/kits";
import { BotonAgregarKit } from "./BotonAgregarKit";

/**
 * "Armá tu hielera". Combinaciones de litros, en un toque.
 *
 * La idea sale de su propio Instagram: tienen un carrusel titulado "Kit de
 * imperdibles para la playa". Ya lo venden asi; el sitio solo lo pone donde se
 * puede comprar.
 *
 * Recibe los productos YA RESUELTOS desde `app/page.tsx`. El kit guarda ids;
 * convertirlos en productos es composicion entre dos features y eso se hace
 * en `app/`, no aqui.
 */
export function Kits({
  kits,
  productosDeKit,
}: {
  kits: Kit[];
  /** id de kit -> los productos que lo componen, en orden. */
  productosDeKit: Record<string, Producto[]>;
}) {
  return (
    <Seccion
      id="kits"
      antetitulo="Combos"
      titulo="Armá tu hielera"
      centrado
      className="bg-superficie-alt"
    >
      <RevelarCascada className="grid gap-7 lg:grid-cols-3">
        {kits.map((kit) => {
          const incluye = productosDeKit[kit.id] ?? [];

          return (
            <ItemCascada key={kit.id}>
              <Tarjeta className="flex h-full flex-col">
                {/* Las botellas del kit, juntas. Se superponen un poco para
                    que se lean como un conjunto y no como una fila. */}
                <div className="flex items-end justify-center gap-0 bg-crema px-6 py-8">
                  {incluye.map((p, i) => (
                    <Botella
                      key={p.id}
                      color={p.color}
                      nombre={p.nombre}
                      className={`h-44 w-auto drop-shadow-lg ${i > 0 ? "-ml-6" : ""}`}
                    />
                  ))}
                </div>

                <div className="flex flex-1 flex-col p-7">
                  <h3 className="font-display text-2xl font-bold uppercase tracking-tight text-texto">
                    {kit.nombre}
                  </h3>
                  <p className="mt-1.5 text-sm font-semibold text-acento">
                    {kit.gancho}
                  </p>

                  <p className="mt-4 text-sm leading-relaxed text-texto">
                    {kit.descripcion}
                  </p>

                  <dl className="mt-5 space-y-1.5 text-sm">
                    <div className="flex gap-2">
                      <dt className="font-semibold text-texto-suave">Lleva:</dt>
                      <dd className="text-texto">
                        {incluye.map((p) => p.nombre).join(" · ")}
                      </dd>
                    </div>
                    <div className="flex gap-2">
                      <dt className="font-semibold text-texto-suave">Alcanza:</dt>
                      {/*
                        "Alcanza para" y no "es para": es una estimacion nuestra
                        sobre cuanta gente cubre, no una promesa del cliente.
                      */}
                      <dd className="text-texto">{kit.para}</dd>
                    </div>
                  </dl>

                  <div className="mt-auto pt-7">
                    <BotonAgregarKit
                      productos={incluye}
                      nombreKit={kit.nombre}
                      className="w-full"
                    />
                  </div>
                </div>
              </Tarjeta>
            </ItemCascada>
          );
        })}
      </RevelarCascada>
    </Seccion>
  );
}
