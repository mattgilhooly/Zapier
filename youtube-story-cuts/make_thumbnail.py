"""Draft YouTube thumbnails: guest face on the right, three words on the left.

Usage: python3 make_thumbnail.py <frame.jpg> <out.jpg> "<text>"
Frames are 1280x720 two-person grabs; the guest is in the right half.
"""
import sys
from PIL import Image, ImageDraw, ImageEnhance, ImageFilter, ImageFont

W, H = 1280, 720
NAVY = (2, 48, 71)  # brand caption color #023047
FONT = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"


def build(frame_path, out_path, text):
    frame = Image.open(frame_path).convert("RGB").resize((W, H))
    # Guest tile sits in the right half of the grid layout; stop short of
    # the channel logo in the bottom-right corner.
    guest = frame.crop((652, 14, 1165, 706))
    guest = ImageEnhance.Color(guest).enhance(0.8)  # muted, not loud
    scale = H / guest.height
    guest = guest.resize((int(guest.width * scale), H), Image.LANCZOS)
    guest = guest.filter(ImageFilter.UnsharpMask(radius=2, percent=80))

    canvas = Image.new("RGB", (W, H), NAVY)
    canvas.paste(guest, (W - guest.width, 0))

    # Soft fade from the navy panel into the photo.
    fade = Image.new("L", (160, H))
    for x in range(160):
        ImageDraw.Draw(fade).line([(x, 0), (x, H)], fill=int(255 * (1 - x / 159)))
    canvas.paste(Image.new("RGB", (160, H), NAVY), (W - guest.width, 0), fade)

    draw = ImageDraw.Draw(canvas)
    font = ImageFont.truetype(FONT, 104)
    lines = text.split("|")
    line_h = 124
    y = (H - line_h * len(lines)) // 2
    for line in lines:
        draw.text((56, y), line, font=font, fill="white")
        y += line_h
    canvas.save(out_path, quality=92)


if __name__ == "__main__":
    build(sys.argv[1], sys.argv[2], sys.argv[3])
