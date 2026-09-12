#!/usr/bin/env python3
"""Move inline CSS from public HTML pages into page stylesheets."""

from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "assets" / "css" / "pages"
STYLE_BLOCK = re.compile(r"<style(?:\s[^>]*)?>(.*?)</style>", re.IGNORECASE | re.DOTALL)

OUTPUT.mkdir(parents=True, exist_ok=True)

for page in sorted(ROOT.glob("*.html")):
    text = page.read_text(encoding="utf-8")
    matches = list(STYLE_BLOCK.finditer(text))
    if not matches:
        continue

    css_parts = [match.group(1).strip() for match in matches if match.group(1).strip()]
    if not css_parts:
        continue

    css_path = OUTPUT / f"{page.stem}.css"
    css_path.write_text("\n\n".join(css_parts) + "\n", encoding="utf-8")
    link = f'<link rel="stylesheet" href="assets/css/pages/{page.stem}.css">'
    updated = STYLE_BLOCK.sub(link, text)
    page.write_text(updated, encoding="utf-8")
    print(f"{page.name} -> {css_path.relative_to(ROOT)}")
