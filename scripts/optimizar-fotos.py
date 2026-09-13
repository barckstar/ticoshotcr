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
                             Facebook, compuesto desde la foto de los tres.

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
    with Image.open(ORIGEN / "los-tres.jpg") as tres:
        tres = tres.convert("RGB")
        """
        1200x630 es lo que piden Facebook y WhatsApp. La foto es 4:5, o sea
        mucho mas alta que ancha: se recorta una FRANJA HORIZONTAL centrada en
        las etiquetas en vez de encajar la foto entera, porque encajada deja
        dos bandas vacias a los lados y las botellas salen diminutas.
        """
        ancho, alto = tres.size
        alto_franja = round(ancho * 630 / 1200)
        # Centrada un poco por debajo de la mitad: ahi estan las etiquetas.
        centro = round(alto * 0.56)
        arriba = max(0, min(centro - alto_franja // 2, alto - alto_franja))
        franja = tres.crop((0, arriba, ancho, arriba + alto_franja))
        franja = franja.resize((1200, 630), Image.LANCZOS)
        MARCA.mkdir(parents=True, exist_ok=True)
        franja.save(MARCA / "og.jpg", "JPEG", quality=86, optimize=True, progressive=True)
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
