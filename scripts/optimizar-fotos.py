# -*- coding: utf-8 -*-
"""
Prepara las fotos de Ticoshot para el sitio.

Lee los originales de `research/assets/` —que no se versionan— y escribe en
`public/` solo las versiones que el sitio realmente sirve.

POR QUE UNA RECETA Y NO "LO HICE A MANO UNA VEZ"
Un recorte hecho a ojo en un editor no se puede repetir ni explicar. El dia que
el cliente mande las fotos definitivas hay que volver a hacer exactamente lo
mismo, y nadie se acuerda de que recorte era. Aqui esta escrito: se corre otra
vez y sale igual.

QUE PRODUCE, Y POR QUE CADA UNO

  productos/<id>.webp        1080x1350 (4:5). El original del post, tal cual.
                             Lo usa la tarjeta del catalogo y la banda del
                             hero, a traves de next/image, que genera los
                             tamanos intermedios solo.

  productos/<id>-sq.webp     900x900. Recorte CUADRADO ANCLADO ABAJO.
                             No centrado: en las tres fotos la etiqueta vive
                             en la mitad inferior, y un recorte centrado la
                             corta justo por el medio. Lo usan la miniatura
                             del carrito y las tarjetas de kits.

  marca/icon-*.png           Favicon en 32, 192 y 512, y el de Apple en 180.
  marca/og.jpg               1200x630 para las vistas previas de WhatsApp y
                             Facebook. SOLO el logo, rojo sobre blanco.

  video/hero-poster.webp     La portada del video de la seccion de eventos.
                             Ver `poster()`.

El JPEG de origen ya viene recomprimido por Instagram, asi que se guarda en
WebP con calidad 82: por debajo se empiezan a ver bloques en los degradados
del fondo pintado, que es justo donde mas se nota.
"""

import subprocess
import sys
from pathlib import Path

try:
    from PIL import Image
except ImportError:
    sys.exit("Falta Pillow.  pip install Pillow")

RAIZ = Path(__file__).resolve().parent.parent
ORIGEN = RAIZ / "research" / "assets"
PRODUCTOS = RAIZ / "public" / "productos"
MARCA = RAIZ / "public" / "marca"

CALIDAD = 82

"""
Los tres litros, y SOLO ellos.

`los-tres.jpg` no esta en esta lista aunque exista en `research/assets/`: es la
foto de familia y el sitio nunca la sirve suelta. Se usa como ORIGEN de la
imagen de Open Graph, y ya. Tenerla aqui generaba `los-tres.webp` y
`los-tres-sq.webp` en `public/`, dos archivos que no referencia nadie — el peor
tipo de peso muerto, porque parecen en uso.
"""
FOTOS = ["chiliguaro", "miguelito", "sangria"]


def kb(ruta: Path) -> str:
    return f"{ruta.stat().st_size / 1024:.0f} KB"


def recorte_cuadrado(im: Image.Image) -> Image.Image:
    """
    Cuadrado ANCLADO ABAJO.

    En las tres fotos la botella entra por arriba y la etiqueta —que es lo que
    identifica el producto de un vistazo— queda en la mitad inferior. Un
    recorte centrado, que es lo que hace todo el mundo por defecto, la parte
    justo por la mitad y deja una miniatura que no dice que es.
    """
    ancho, alto = im.size
    lado = min(ancho, alto)
    izq = (ancho - lado) // 2
    arriba = alto - lado  # pegado al borde de abajo
    return im.crop((izq, arriba, izq + lado, arriba + lado))


def guardar_webp(im: Image.Image, destino: Path, ancho: int | None = None) -> None:
    if ancho and im.width > ancho:
        alto = round(im.height * ancho / im.width)
        im = im.resize((ancho, alto), Image.LANCZOS)
    destino.parent.mkdir(parents=True, exist_ok=True)
    im.save(destino, "WEBP", quality=CALIDAD, method=6)
    print(f"  {destino.relative_to(RAIZ)}  {im.width}x{im.height}  {kb(destino)}")


def main() -> None:
    faltan = [f for f in FOTOS + ["logo"] if not (ORIGEN / f"{f}.jpg").exists()]
    if faltan:
        sys.exit(f"Faltan originales en {ORIGEN}: {', '.join(faltan)}")

    print("Fotos de producto:")
    for nombre in FOTOS:
        with Image.open(ORIGEN / f"{nombre}.jpg") as im:
            im = im.convert("RGB")
            guardar_webp(im, PRODUCTOS / f"{nombre}.webp")
            guardar_webp(recorte_cuadrado(im), PRODUCTOS / f"{nombre}-sq.webp", 900)

    print("\nMarca:")
    with Image.open(ORIGEN / "logo.jpg") as logo:
        logo = logo.convert("RGB")
        """
        NO se guarda un logo.webp. El sitio dibuja el emblema con SVG en linea
        (`shared/components/ui/Logo.tsx`): hereda `currentColor`, escala sin
        pixelarse y no cuesta una peticion de red. Un PNG del logo aqui seria
        un archivo que nadie referencia — el peor tipo de peso muerto, porque
        parece en uso. De esta foto solo salen los ICONOS, que si tienen que
        ser mapa de bits.
        """

        # Los iconos van en PNG: es lo unico que entienden TODOS los sitios
        # donde termina un favicon, incluidos los que no leen WebP.
        MARCA.mkdir(parents=True, exist_ok=True)
        for lado, archivo in [
            (32, "icon.png"),
            (192, "icon-192.png"),
            (512, "icon-512.png"),
            (180, "apple-icon.png"),
        ]:
            icono = logo.resize((lado, lado), Image.LANCZOS)
            icono.save(MARCA / archivo, "PNG", optimize=True)
            print(f"  {(MARCA / archivo).relative_to(RAIZ)}  {lado}x{lado}  {kb(MARCA / archivo)}")

    print("\nOpen Graph:")
    """
    La imagen de las vistas previas: SOLO EL LOGO, rojo sobre blanco.

    Se probo componiendolo sobre la foto de las tres botellas y no funciona,
    por dos razones que solo se ven mirando el resultado:

      1. El centro de esa foto es la etiqueta del Miguelito, que TAMBIEN es un
         circulo blanco con el logo dentro. Quedaban dos logos apilados.
      2. Aun resolviendolo con una placa detras, al tamaño real de un chat
         —unos 250 px de ancho— la foto y el logo compiten y no gana ninguno.

    Un logo solo, grande y centrado, se lee a cualquier tamaño y sobrevive a
    cualquier recorte. Y eso ultimo importa: WhatsApp, Facebook y X no muestran
    el 1200x630 entero, cada uno lo RECORTA a su proporcion, y en un chat de
    WhatsApp el recorte se acerca al cuadrado.
    """
    with Image.open(ORIGEN / "logo.jpg") as marca:
        gris = marca.convert("L")
        """
        El logo viene ROJO SOBRE BLANCO en un JPEG, o sea sin transparencia. La
        mascara se saca del propio dibujo: lo que NO es blanco es tinta.

        `point` mapea cada nivel de gris a opacidad —255 donde el pixel es
        oscuro, 0 donde es blanco— con una rampa entre 110 y 200 en vez de un
        corte seco. El corte seco deja los bordes dentados; la rampa conserva
        el suavizado del original.

        Se repinta con el ROJO del reparto 70/30/10 en vez de conservar el del
        JPEG: asi el color es exacto y no el que haya sobrevivido a la
        compresion de Instagram.
        """
        mascara = gris.point(
            lambda v: 255 if v < 110 else (0 if v > 200 else int((200 - v) * 255 / 90))
        )

        """
        El logo ocupa el 74% del ALTO, no del ancho. El lienzo es 1200x630 y el
        logo es cuadrado: midiendolo contra el ancho se saldria por arriba y
        por abajo.
        """
        lado = round(630 * 0.74)
        mascara = mascara.resize((lado, lado), Image.LANCZOS)

        lienzo = Image.new("RGB", (1200, 630), (255, 255, 255))
        tinta = Image.new("RGB", mascara.size, (211, 32, 39))
        lienzo.paste(tinta, ((1200 - lado) // 2, (630 - lado) // 2), mascara)

        MARCA.mkdir(parents=True, exist_ok=True)
        lienzo.save(MARCA / "og.jpg", "JPEG", quality=90, optimize=True, progressive=True)
        print(f"  {(MARCA / 'og.jpg').relative_to(RAIZ)}  1200x630  {kb(MARCA / 'og.jpg')}")


def poster() -> None:
    """
    Saca la portada del video de eventos.

    DEL SEGUNDO 7,5, no del primer fotograma. En este video el principio es
    fondo coral VACIO —las botellas van entrando de a una— asi que un poster
    del segundo cero seria una portada que no dice que se vende. A los 7,5 ya
    estan las tres juntas con sus etiquetas.

    Es la misma regla que en la plantilla: la portada tiene que decir que hay
    dentro. Alli se resolvia usando una foto en vez de un fotograma; aqui el
    fotograma correcto ES la foto de familia, porque el video termina en ella.
    """
    origen = ORIGEN / "hero.mp4"
    if not origen.exists():
        print("\n(sin research/assets/hero.mp4: se salta el poster)")
        return

    destino = RAIZ / "public" / "video" / "hero-poster.webp"
    destino.parent.mkdir(parents=True, exist_ok=True)

    print("\nPortada del video:")
    orden = [
        "ffmpeg", "-y", "-v", "error", "-ss", "7.5", "-i", str(origen),
        "-frames:v", "1", "-c:v", "libwebp", "-quality", "80", str(destino),
    ]
    if subprocess.run(orden).returncode != 0:
        sys.exit("ffmpeg falló al sacar la portada")
    print(f"  {destino.relative_to(RAIZ)}  {kb(destino)}")


if __name__ == "__main__":
    main()
    poster()
