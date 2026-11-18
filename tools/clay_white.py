"""Bring the Adjustable Corner Guard pictures to one clay white.

The printed parts photograph yellowish and dim (aged filament look); the render is a cold
paper white. Both are moved to the same white in CIELAB: L about 90 in the highlights,
a slightly warm a 0.8, b 4.5. Strong colours (the orange print stripes) keep their hue.
usage: python3 tools/clay_white.py photo|render <in.webp> <out.webp>
"""
import sys
import numpy as np
from PIL import Image
from skimage import color

TA, TB, TL = 0.8, 4.5, 90.0
kind, src, dst = sys.argv[1:4]
a = np.asarray(Image.open(src).convert("RGBA")).astype(float) / 255
lab = color.rgb2lab(a[..., :3])
L, A, B = lab[..., 0], lab[..., 1], lab[..., 2]
if kind == "render":
    # cold white: highlights down to the clay white, warmth growing with lightness
    L2 = L * (TL / 94.5)
    k = L2 / 100
    A2, B2 = A + TA * k, B + TB * k
else:
    # yellow, dim photo: lift the light, take most of the yellow out of the filament
    L2 = np.minimum(L * 1.16, 96)
    chroma = np.hypot(A, B)
    w = np.clip((chroma - 34) / 18, 0, 1)            # 0 filament (also its warm shadows), 1 strong colour (kept)
    k = L2 / 100
    A2 = w * A + (1 - w) * (A * 0.35 + TA * k)
    B2 = w * B + (1 - w) * (B * 0.3 + TB * k * 0.9)
rgb = np.clip(color.lab2rgb(np.dstack([L2, A2, B2])), 0, 1)
out = np.dstack([rgb, a[..., 3]])
Image.fromarray((out * 255).round().astype(np.uint8), "RGBA").save(dst, "WEBP", quality=84, method=6)
