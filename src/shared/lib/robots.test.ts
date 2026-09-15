import { describe, expect, it } from "vitest";
import { RASTREADORES_SOCIALES, reglasRobots } from "./robots";

const URL_SITIO = "https://ticoshotcr.vercel.app";

/** Saca la lista de grupos, venga como objeto suelto o como array. */
function grupos(r: ReturnType<typeof reglasRobots>) {
  return Array.isArray(r.rules) ? r.rules : [r.rules];
}

function grupoDe(r: ReturnType<typeof reglasRobots>, userAgent: string) {
  return grupos(r).find((g) => g?.userAgent === userAgent);
}

describe("reglasRobots, sin publicar", () => {
  const reglas = reglasRobots(false, URL_SITIO);

  it("cierra la puerta a los buscadores", () => {
    expect(grupoDe(reglas, "*")?.disallow).toBe("/");
  });

  /*
    LA PRUEBA QUE FALTABA. El robots.txt era una sola regla `* / Disallow` y eso
    apagaba la vista previa de los enlaces en WhatsApp: su rastreador respeta
    robots.txt, y sin poder leer la pagina no hay Open Graph que valga. Los meta
    tags estaban perfectos, la imagen daba 200 y las medidas cuadraban — todo lo
    verificable en el sitio estaba bien, y el "no" lo daba este archivo.
  */
  it.each([...RASTREADORES_SOCIALES])(
    "deja pasar a %s aunque el sitio no este publicado",
    (agente) => {
      expect(grupoDe(reglas, agente)?.allow).toBe("/");
    },
  );

  it("cubre WhatsApp con el rastreador de Facebook, que es el que usa", () => {
    expect(RASTREADORES_SOCIALES).toContain("facebookexternalhit");
  });

  it("le da a cada social SU PROPIO grupo", () => {
    /*
      No vale meterlos en el mismo grupo que el `*`: un rastreador obedece solo
      al grupo mas especifico que coincide con su nombre. Sin grupo propio, cae
      en el `*` y queda bloqueado igual.
    */
    for (const agente of RASTREADORES_SOCIALES) {
      const g = grupoDe(reglas, agente);
      expect(g).toBeDefined();
      expect(g?.disallow).toBeUndefined();
    }
  });

  it("no anuncia el sitemap, que es una invitacion a recorrerlo entero", () => {
    expect(reglas.sitemap).toBeUndefined();
  });
});

describe("reglasRobots, publicado", () => {
  const reglas = reglasRobots(true, URL_SITIO);

  it("abre a todos", () => {
    expect(grupoDe(reglas, "*")?.allow).toBe("/");
    expect(grupoDe(reglas, "*")?.disallow).toBeUndefined();
  });

  it("anuncia el sitemap en absoluto", () => {
    expect(reglas.sitemap).toBe(`${URL_SITIO}/sitemap.xml`);
  });
});
