import { negocio } from "@/shared/config/negocio";
import { medir, type MensajeMedido } from "@/shared/lib/whatsapp";
import {
  etiquetaIntensidad,
  type Intensidad,
  type Mezcla,
} from "./cotizador";

export type DatosEvento = {
  nombre: string;
  telefono: string;
  personas: number;
  intensidad: Intensidad;
  /** Texto libre: "sábado 12", "en tres semanas", "todavía no sé". */
  fecha: string;
  /** Dónde es. No se pide pin de GPS: falta mucho para el día del evento. */
  lugar: string;
  tipo: string;
  notas: string;
};

/**
 * Arma la cotizacion que llega por WhatsApp.
 *
 * ES UNA CONSULTA, NO UN PEDIDO, y el mensaje lo dice en la primera linea. La
 * diferencia importa para quien lo recibe: un pedido se prepara, una consulta
 * se responde con un precio. Confundirlos hace que el dueno cocine para una
 * boda que todavia no estaba cerrada.
 *
 * NO LLEVA NINGUN TOTAL EN COLONES. Los precios de los litros todavia no estan
 * confirmados, y aunque lo estuvieran un evento se cotiza a mano: hay traslado,
 * hielo, fecha y cantidad de gente de por medio. Mandar una cifra calculada
 * por el sitio la convierte en una promesa que despues hay que desdecir.
 */
export function construirMensajeEvento(
  datos: DatosEvento,
  litros: number,
  mezcla: Mezcla[],
): MensajeMedido {
  const partes: string[] = [
    `*CONSULTA DE EVENTO — ${negocio.nombre}*`,
    "",
    `${datos.nombre} · ${datos.telefono}`,
    "",
    `Tipo: ${datos.tipo}`,
    `Personas: ${datos.personas}`,
    `Fecha: ${datos.fecha}`,
    `Lugar: ${datos.lugar}`,
    `Ambiente: ${etiquetaIntensidad[datos.intensidad]}`,
    "",
    `*Cálculo del sitio: ${litros} ${litros === 1 ? "litro" : "litros"}*`,
  ];

  for (const m of mezcla) {
    partes.push(`${m.litros}x ${m.nombre}`);
  }

  if (datos.notas) partes.push("", `Nota: ${datos.notas}`);

  /*
    Que el calculo es una estimacion va EN EL MENSAJE y no solo en la pantalla.
    Quien lo recibe tiene que poder decir "son mas" sin quedar como que
    incumple algo que el sitio ya habia prometido.
  */
  partes.push(
    "",
    "Los litros son una estimación del sitio. Quedo atento a su recomendación y al precio.",
  );

  return medir(partes.join("\n"));
}
