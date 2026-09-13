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

  marca/logo.webp            El emblema en 512, para el pie y compartir.
  marca/icon-*.png           Favicon en 32, 192 y 512, y el de Apple en 180.
  marca/og.jpg               1200x630 para las vistas previas de WhatsApp y
                             Facebook, compuesto desde la foto de los tres.

  hero/f-###.webp            Los 64 fotogramas del hero. Ver `secuencia()`.

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

# Los tres litros, mas la foto de familia.
FOTOS = ["chiliguaro", "miguelito", "sangria", "los-tres"]


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

    print("\nFranja de los tres, para el cotizador:")
    with Image.open(ORIGEN / "los-tres.jpg") as tres:
        tres = tres.convert("RGB")
        """
        Se recorta ENTRE los dos bloques de texto que la foto trae quemados: el
        titular de arriba ("LOS QUE NO TE PUEDEN FALTAR") y el remate de abajo
        ("EN LA HIELERA NI EN NINGUN PLAN"). Lo que queda son las tres botellas
        con sus etiquetas, que es lo unico que hace falta cuando encima va a ir
        el resultado del calculo.

        Dos textos superpuestos no se leen ni uno ni otro, y el de la foto no se
        puede mover.
        """
        ancho, alto = tres.size
        arriba = round(alto * 0.30)  # justo debajo del titular
        abajo = round(alto * 0.85)  # justo encima del remate
        guardar_webp(
            tres.crop((0, arriba, ancho, abajo)),
            PRODUCTOS / "los-tres-banda.webp",
        )

    print("\nMarca:")
    with Image.open(ORIGEN / "logo.jpg") as logo:
        logo = logo.convert("RGB")
        guardar_webp(logo, MARCA / "logo.webp", 512)

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


def secuencia() -> None:
    """
    Trocea el video del hero en la secuencia de fotogramas que dibuja el canvas.

    POR QUE FOTOGRAMAS SUELTOS Y NO EL VIDEO. La tecnica se llama
    *scroll-driven image sequence* y es la que usa Apple en las paginas de los
    AirPods. Scrubear un <video> moviendole `currentTime` le pide al
    decodificador que busque un fotograma arbitrario en tiempo real: va a
    tirones y en Safari de iPhone es donde peor se porta. Dibujar una imagen ya
    descargada es instantaneo. Ver `SecuenciaHero.tsx`.

    LOS NUMEROS SALEN DE MEDIR, no de elegir bonito. Se probaron cinco
    combinaciones sobre este video de 8 segundos (tamanos en disco, que
    redondean por bloque; el elegido pesa 872 KB de bytes reales):

        fps  ancho  calidad   en disco
          8    640       72    1372 KB
          8    640       55    1128 KB
          8    540       60    1004 KB   <- el elegido (872 KB reales)
          6    540       60     760 KB   (48 fotogramas: el scrub va a saltos)
          8    480       62     904 KB

    8 fotogramas por segundo son 64 en total, que es donde el recorrido deja de
    notarse escalonado. Bajar a 6 ahorra 244 KB y se ve a saltos — el fondo es
    pintado y suave, asi que lo que se nota no es la nitidez sino el salto.
    """
    origen = ORIGEN / "hero.mp4"
    if not origen.exists():
        print("\n(sin research/assets/hero.mp4: se salta la secuencia)")
        return

    destino = RAIZ / "public" / "hero"
    destino.mkdir(parents=True, exist_ok=True)
    for viejo in destino.glob("*.webp"):
        viejo.unlink()

    print("\nSecuencia del hero:")
    orden = [
        "ffmpeg", "-y", "-v", "error", "-i", str(origen),
        "-vf", "fps=8,scale=540:-2",
        "-c:v", "libwebp", "-quality", "60", "-compression_level", "6",
        str(destino / "f-%03d.webp"),
    ]
    if subprocess.run(orden).returncode != 0:
        sys.exit("ffmpeg falló al extraer los fotogramas")

    cuadros = sorted(destino.glob("*.webp"))
    total = sum(f.stat().st_size for f in cuadros)
    print(f"  {destino.relative_to(RAIZ)}/f-###.webp  "
          f"{len(cuadros)} fotogramas  {total / 1024:.0f} KB")

    """
    El conteo va ESCRITO en el componente (`TOTAL = 64`). Si un dia se cambian
    los fps aqui y alla no, el canvas pide fotogramas que no existen o deja
    fuera los ultimos, y no lo caza nada. Que reviente el script.
    """
    if len(cuadros) != 64:
        sys.exit(
            f"Salieron {len(cuadros)} fotogramas y SecuenciaHero.tsx espera 64. "
            "Actualizá TOTAL ahí o los fps de aquí."
        )


if __name__ == "__main__":
    main()
    secuencia()
