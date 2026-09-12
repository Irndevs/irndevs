#!/usr/bin/env python3
"""Validate the static site without third-party dependencies."""

from pathlib import Path
import re
import sys

ROOT = Path(__file__).resolve().parents[1]
MAX_PAGE_BYTES = 500_000
errors = []
warnings = []

for page in sorted(ROOT.glob("*.html")):
    text = page.read_text(encoding="utf-8")
    relative = page.relative_to(ROOT)

    if "<title>" not in text:
        errors.append(f"{relative}: missing <title>")
    if 'meta name="description"' not in text:
        errors.append(f"{relative}: missing meta description")
    if len(re.findall(r"<h1\b", text, re.IGNORECASE)) != 1:
        errors.append(f"{relative}: expected exactly one h1")

    ids = re.findall(r'\bid=["\']([^"\']+)', text)
    for element_id in sorted(set(ids)):
        if ids.count(element_id) > 1:
            errors.append(f"{relative}: duplicate id '{element_id}'")

    for href in re.findall(r'href=["\']([^"\']+)["\']', text, re.IGNORECASE):
        target = href.split("#", 1)[0].split("?", 1)[0]
        if not target or target.startswith(("http://", "https://", "mailto:", "tel:", "javascript:")):
            continue
        if target.endswith((".html", ".xml")) and not (page.parent / target).exists():
            errors.append(f"{relative}: broken local link '{href}'")

    if 'href="https://linkedin.com"' in text:
        errors.append(f"{relative}: generic LinkedIn URL")
    if page.name == "jogos.html" and "Snake e Memory" in text:
        errors.append(f"{relative}: stale two-game description")

    if page.stat().st_size > MAX_PAGE_BYTES:
        warnings.append(f"{relative}: {page.stat().st_size // 1000} KB; move embedded media to assets")

if errors:
    print("Errors:")
    print("\n".join(f"- {item}" for item in errors))
if warnings:
    print("Warnings:")
    print("\n".join(f"- {item}" for item in warnings))

if errors:
    sys.exit(1)

print(f"Validated {len(list(ROOT.glob('*.html')))} HTML pages: OK")
if warnings:
    print(f"{len(warnings)} performance warning(s) remain")
