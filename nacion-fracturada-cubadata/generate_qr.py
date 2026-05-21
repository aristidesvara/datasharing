from pathlib import Path

from PIL import Image, ImageDraw, ImageFont
from reportlab.graphics.barcode import qr


ROOT = Path(__file__).resolve().parent
ASSETS = ROOT / "assets"
URL = "https://aristidesvara.github.io/datasharing/nacion-fracturada-cubadata/"

NAVY = "#17263c"
TEAL = "#14b8c7"
BG = "#f7fbfc"
MUTED = "#526474"


def get_font(size: int, bold: bool = False) -> ImageFont.FreeTypeFont | ImageFont.ImageFont:
    candidates = [
        "/System/Library/Fonts/Supplemental/Arial Bold.ttf" if bold else "/System/Library/Fonts/Supplemental/Arial.ttf",
        "/System/Library/Fonts/Helvetica.ttc",
    ]
    for path in candidates:
        try:
            return ImageFont.truetype(path, size=size)
        except Exception:
            continue
    return ImageFont.load_default()


def qr_matrix(value: str):
    widget = qr.QrCodeWidget(value)
    widget.qr.make()
    return widget.qr.modules


def draw_qr_png(value: str, out_path: Path) -> None:
    matrix = qr_matrix(value)
    modules = len(matrix)
    scale = 18
    quiet = 4
    qr_size = (modules + quiet * 2) * scale
    card_w = 1200
    card_h = 1600

    image = Image.new("RGB", (card_w, card_h), BG)
    draw = ImageDraw.Draw(image)

    title_font = get_font(58, bold=True)
    sub_font = get_font(33, bold=False)
    url_font = get_font(30, bold=True)
    small_font = get_font(24, bold=False)

    draw.rectangle([0, 0, 22, card_h], fill=TEAL)
    draw.text((80, 92), "CubaData Brief", fill=NAVY, font=url_font)
    draw.text((80, 155), "¿Hay un cambio de mentalidad en Cuba?", fill=NAVY, font=title_font)
    draw.text((80, 240), "Seis evidencias contra seis especulaciones", fill=MUTED, font=sub_font)

    qr_x = (card_w - qr_size) // 2
    qr_y = 390
    draw.rounded_rectangle([qr_x - 28, qr_y - 28, qr_x + qr_size + 28, qr_y + qr_size + 28], radius=28, fill="white", outline="#d8e7ec", width=3)

    for r, row in enumerate(matrix):
        for c, is_dark in enumerate(row):
            if is_dark:
                x0 = qr_x + (c + quiet) * scale
                y0 = qr_y + (r + quiet) * scale
                draw.rectangle([x0, y0, x0 + scale - 1, y0 + scale - 1], fill=NAVY)

    draw.text((80, 1110), "Escanea para abrir el micrositio", fill=NAVY, font=sub_font)
    draw.text((80, 1170), value, fill=TEAL, font=url_font)
    draw.text((80, 1250), "Dr. Arístides A. Vara-Horna / Universidad de San Martín de Porres", fill=MUTED, font=small_font)
    draw.text((80, 1290), "Foro Diario de Cuba 2026", fill=MUTED, font=small_font)
    draw.text((80, 1410), "Enlace publico de GitHub Pages para compartir desde cualquier dispositivo.", fill=MUTED, font=small_font)

    image.save(out_path, "PNG")


def draw_qr_svg(value: str, out_path: Path) -> None:
    matrix = qr_matrix(value)
    modules = len(matrix)
    quiet = 4
    size = modules + quiet * 2
    rects = []
    for r, row in enumerate(matrix):
        for c, is_dark in enumerate(row):
            if is_dark:
                rects.append(f'<rect x="{c + quiet}" y="{r + quiet}" width="1" height="1"/>')
    svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {size} {size}" role="img" aria-label="QR {value}">
  <rect width="{size}" height="{size}" fill="white"/>
  <g fill="{NAVY}">
    {"".join(rects)}
  </g>
</svg>
'''
    out_path.write_text(svg, encoding="utf-8")


if __name__ == "__main__":
    ASSETS.mkdir(parents=True, exist_ok=True)
    draw_qr_png(URL, ASSETS / "qr-micrositio-publico.png")
    draw_qr_svg(URL, ASSETS / "qr-micrositio-publico.svg")
    print(URL)
    print(ASSETS / "qr-micrositio-publico.png")
    print(ASSETS / "qr-micrositio-publico.svg")
