import type { ButtonHTMLAttributes, AnchorHTMLAttributes, ReactNode } from "react";

type Variante = "acento" | "contorno" | "fantasma" | "claro";
type Tamano = "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-display font-semibold uppercase tracking-wide " +
  "transition-transform duration-200 active:scale-95 " +
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-acento " +
  "disabled:opacity-50 disabled:pointer-events-none";

/*
  CONTRASTE, medido:

  `acento`   blanco sobre el rojo #D32027 -> 5.24:1. Es la unica combinacion
             de la paleta que permite texto blanco, y por eso es el boton
             principal de todo el sitio.

  `contorno` texto MARRON, no rojo. Estos botones se usan sobre el coral del
             hero, donde el rojo cae a 2.26:1 — ilegible. El marron sobre
             coral da 7.51:1. El borde si puede ser rojo: un borde es
             decorativo y no lo alcanza la regla de texto.

  `claro`    para cuando el fondo ya es rojo (el pie, un badge): superficie
             blanca con texto rojo, 4.85:1.

  Regla general: sobre el coral o sobre un degradado, el texto va MARRON.
  El blanco solo sobre rojo. Nunca al reves.
*/
const variantes: Record<Variante, string> = {
  acento: "bg-acento text-white hover:bg-acento-alt",
  contorno: "border-2 border-acento text-texto hover:bg-acento hover:text-white",
  fantasma: "text-texto hover:text-acento",
  claro: "bg-superficie text-acento hover:bg-crema-alt",
};

const tamanos: Record<Tamano, string> = {
  md: "px-5 py-2.5 text-sm",
  lg: "px-7 py-3.5 text-base",
};

function clases(variante: Variante, tamano: Tamano, extra?: string) {
  return [base, variantes[variante], tamanos[tamano], extra]
    .filter(Boolean)
    .join(" ");
}

type BotonProps = {
  variante?: Variante;
  tamano?: Tamano;
  children: ReactNode;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export function Boton({
  variante = "acento",
  tamano = "md",
  className,
  children,
  ...props
}: BotonProps) {
  return (
    <button className={clases(variante, tamano, className)} {...props}>
      {children}
    </button>
  );
}

type BotonEnlaceProps = {
  href: string;
  variante?: Variante;
  tamano?: Tamano;
  children: ReactNode;
} & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href">;

/**
 * Misma apariencia que Boton, pero navega.
 *
 * El sitio es de UNA sola ruta: aqui todo enlace interno es un ancla (#seccion)
 * o un enlace externo (WhatsApp, redes). Por eso se usa <a> y no <Link>: no hay
 * navegacion de cliente que prefetchear, y next/link sobre un ancla de la misma
 * pagina no aporta nada.
 */
export function BotonEnlace({
  href,
  variante = "acento",
  tamano = "md",
  className,
  children,
  ...props
}: BotonEnlaceProps) {
  const externo = href.startsWith("http");

  return (
    <a
      href={href}
      className={clases(variante, tamano, className)}
      {...(externo ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      {...props}
    >
      {children}
    </a>
  );
}
