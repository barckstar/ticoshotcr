# Ticoshot

Sitio de **Ticoshot** — chiliguaro, miguelito y sangría artesanales en litro,
desde San Ramón de Alajuela, Costa Rica.

Una sola página con carrito, checkout por WhatsApp y cotizador de eventos.

## Arrancar

```bash
npm install
npm run dev
```

## Comandos

| Comando | Qué hace |
|---|---|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de producción |
| `npm run test` | Pruebas (Vitest) |
| `npm run typecheck` | TypeScript sin emitir |
| `npm run lint` | ESLint |

## Antes de publicar

**Este sitio todavía no está listo para publicarse.** Faltan precios, reseñas
reales y varios datos del negocio. La lista completa está en
[PENDIENTE.md](PENDIENTE.md).

Lo que falta **se ve en la página** a propósito: los precios dicen "Consultar",
las reseñas llevan un aviso de sección pendiente y los hitos sin confirmar salen
atenuados. Un dato de relleno se ve idéntico a uno real y nadie se acuerda
después de cuál había que cambiar.

## Variables de entorno

```bash
cp .env.example .env.local
```

`NEXT_PUBLIC_SITIO_URL` — la URL pública. La usan el sitemap, el `robots.txt`,
el JSON-LD y las vistas previas de Open Graph. Hay que ponerla con el dominio
real antes de publicar.

## Documentación

- [CLAUDE.md](CLAUDE.md) — arquitectura, paleta, y las reglas que costaron caro
- [PENDIENTE.md](PENDIENTE.md) — qué falta y qué preguntarle al cliente
- [docs/superpowers/specs/](docs/superpowers/specs/) — el diseño aprobado

## Stack

Next.js 16 · React 19 · TypeScript estricto · Tailwind CSS v4 · Zod · Vitest ·
Vercel. Animación en CSS puro, sin librerías.
