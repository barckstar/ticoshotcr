import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";

/**
 * ESTA PRUEBA NACE DE UN DESPLIEGUE CAIDO.
 *
 * Vercel rompio el build con `TypeError: Invalid URL` e `input: ''`. La causa
 * era `process.env.NEXT_PUBLIC_SITIO_URL ?? "https://..."`, repetido en cinco
 * archivos: `??` solo cae al valor por defecto con `null` o `undefined`, y una
 * variable de entorno DEFINIDA PERO VACIA es `""`, que no es ninguno de los
 * dos. Pasaba de largo y `new URL("")` lanzaba.
 *
 * El modulo se carga con `import()` dinamico dentro de cada caso a proposito:
 * `SITIO_URL` se resuelve UNA VEZ al evaluar el modulo, asi que cambiar
 * `process.env` despues no tendria ningun efecto. `vi.resetModules()` obliga a
 * evaluarlo de nuevo con el entorno de cada prueba.
 */

const ENTORNO = { ...process.env };

async function cargar(): Promise<string> {
  const { SITIO_URL } = await import("./sitio");
  return SITIO_URL;
}

beforeEach(() => {
  vi.resetModules();
  delete process.env.NEXT_PUBLIC_SITIO_URL;
  delete process.env.VERCEL_URL;
  delete process.env.VERCEL_PROJECT_PRODUCTION_URL;
});

afterEach(() => {
  process.env = { ...ENTORNO };
});

describe("SITIO_URL", () => {
  it("usa la variable propia cuando trae una URL válida", async () => {
    process.env.NEXT_PUBLIC_SITIO_URL = "https://ticoshot.cr";
    expect(await cargar()).toBe("https://ticoshot.cr");
  });

  /* EL CASO EXACTO QUE TUMBO EL DESPLIEGUE. */
  it("NO revienta con la variable definida pero vacía", async () => {
    process.env.NEXT_PUBLIC_SITIO_URL = "";
    const url = await cargar();
    expect(url).not.toBe("");
    expect(() => new URL(url)).not.toThrow();
  });

  it("tampoco revienta si solo trae espacios", async () => {
    process.env.NEXT_PUBLIC_SITIO_URL = "   ";
    const url = await cargar();
    expect(() => new URL(url)).not.toThrow();
  });

  /*
    El error mas comun al rellenar el panel de Vercel: pegar el dominio sin
    protocolo. `new URL("ticoshot.cr")` lanza, y antes eso tumbaba el build.
  */
  it("ignora un valor que no es una URL en vez de tumbar el build", async () => {
    process.env.NEXT_PUBLIC_SITIO_URL = "ticoshot.cr";
    const url = await cargar();
    expect(() => new URL(url)).not.toThrow();
    expect(url).not.toContain("ticoshot.cr/");
  });

  it("normaliza a origin: sin barra final, sin ruta, sin query", async () => {
    process.env.NEXT_PUBLIC_SITIO_URL = "https://ticoshot.cr/algo/?x=1";
    expect(await cargar()).toBe("https://ticoshot.cr");
  });

  it("cae al dominio de producción de Vercel, agregándole el protocolo", async () => {
    process.env.VERCEL_PROJECT_PRODUCTION_URL = "ticoshotcr.vercel.app";
    expect(await cargar()).toBe("https://ticoshotcr.vercel.app");
  });

  it("prefiere el de producción sobre el del despliegue concreto", async () => {
    process.env.VERCEL_PROJECT_PRODUCTION_URL = "ticoshotcr.vercel.app";
    process.env.VERCEL_URL = "ticoshotcr-abc123.vercel.app";
    expect(await cargar()).toBe("https://ticoshotcr.vercel.app");
  });

  it("usa el del despliegue concreto si no hay uno de producción", async () => {
    process.env.VERCEL_URL = "ticoshotcr-abc123.vercel.app";
    expect(await cargar()).toBe("https://ticoshotcr-abc123.vercel.app");
  });

  it("sin nada definido, devuelve un valor por defecto usable", async () => {
    const url = await cargar();
    expect(() => new URL(url)).not.toThrow();
    expect(url.startsWith("https://")).toBe(true);
  });
});
