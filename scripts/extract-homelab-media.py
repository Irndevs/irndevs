#!/usr/bin/env python3
"""Extract embedded Homelab images into static assets."""

from pathlib import Path
import base64
import re

ROOT = Path(__file__).resolve().parents[1]
PAGE = ROOT / "homelab.html"
OUTPUT = ROOT / "assets" / "img" / "homelab"
text = PAGE.read_text(encoding="utf-8")
pattern = re.compile(r'src="data:image/(png|jpeg|jpg);base64,([A-Za-z0-9+/=]+)"')
count = 0
OUTPUT.mkdir(parents=True, exist_ok=True)

def replace(match):
    global count
    count += 1
    extension = "jpg" if match.group(1) in ("jpeg", "jpg") else "png"
    filename = f"homelab-{count:02d}.{extension}"
    (OUTPUT / filename).write_bytes(base64.b64decode(match.group(2)))
    return f'src="assets/img/homelab/{filename}"'

updated, replacements = pattern.subn(replace, text)
if replacements == 0:
    raise SystemExit("No embedded Homelab images found")

PAGE.write_text(updated, encoding="utf-8")
print(f"Extracted {replacements} images to {OUTPUT.relative_to(ROOT)}")
