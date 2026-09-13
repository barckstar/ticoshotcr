import { negocio } from "@/shared/config/negocio";
import { medir, type MensajeMedido } from "@/shared/lib/whatsapp";
import { etiquetaIntensidad, type Intensidad } from "./evento";

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
 * Arma la consulta de evento que llega por WhatsApp.
 *
 * ES UNA CONSULTA, NO UN PEDIDO, y el mensaje lo dice en la primera linea. La
 * diferencia importa para quien lo recibe: un pedido se prepara, una consulta
 * se responde con un precio. Confundirlos hace que el dueno cocine para una
 * boda que todavia no estaba cerrada.
 *
 * NO LLEVA NINGUN NUMERO CALCULADO POR EL SITIO. Antes mandaba una estimacion
 * de litros; se quito con el cotizador. El sitio no sabe cuanto toma la gente
 * de otro, y una cifra con aire de exactitud es como termina alguien con seis
 * litros de sobra o con la fiesta seca a las nueve. Lo que manda son los DATOS
 * —cuanta gente, que dia, donde, que ambiente— para que el numero lo ponga
 * quien lleva cinco anos detras de una barra.
 */
export function construirMensajeEvento(datos: DatosEvento): MensajeMedido {
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
  ];

  if (datos.notas) partes.push("", `Nota: ${datos.notas}`);

  partes.push(
    "",
    "Me interesa el servicio de barra. Quedo atento a su recomendación y al precio.",
  );

  return medir(partes.join("\n"));
}
