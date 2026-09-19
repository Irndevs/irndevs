#!/usr/bin/env python3
"""Validate the static site without third-party dependencies.

Checks per page: title, description, single h1, duplicate ids (static HTML only —
ids inside <script> templates are ignored), local links/CSS/JS, canonical, closing tags,
site-nav.js, accessible names for form controls, and hreflang on /en/ pages.
Site-wide: sitemap <-> files consistency (indexable pages must be listed; noindex pages must not).
"""

from pathlib import Path
import re
import sys

ROOT = Path(__file__).resolve().parents[1]
BASE = "https://irndevs.com/"
MAX_PAGE_BYTES = 500_000
errors = []
warnings = []

# páginas que não precisam de menu/canonical/etc.
NO_NAV = {"admin.html"}
NOT_IN_SITEMAP = {"404.html", "offline.html"}

SCRIPT_OR_STYLE = re.compile(r"<(script|style)\b[^>]*>.*?</\1>", re.IGNORECASE | re.DOTALL)
FORM_CONTROL = re.compile(r"<(input|select|textarea)\b([^>]*)>", re.IGNORECASE)


CODE_SAMPLES = re.compile(r"<(pre|code)\b[^>]*>.*?</\1>", re.IGNORECASE | re.DOTALL)


def strip_code(text):
    """Remove <script>/<style> so JS/CSS strings are not mistaken for markup."""
    return SCRIPT_OR_STYLE.sub("", text)


def strip_samples(text):
    """Also drop <pre>/<code> blocks: they show HTML as text, not real references."""
    return CODE_SAMPLES.sub("", strip_code(text))


def is_noindex(text):
    return bool(re.search(r'<meta[^>]+name="robots"[^>]+noindex', text, re.IGNORECASE))


def expected_url(relative):
    rel = relative.as_posix()
    if rel == "index.html":
        return BASE
    if rel == "en/index.html":
        return BASE + "en/"
    return BASE + rel


pages = sorted(list(ROOT.glob("*.html")) + list((ROOT / "en").glob("*.html")))
indexable = {}

for page in pages:
    relative = page.relative_to(ROOT)
    if page.name.startswith("google") and page.suffix == ".html":
        continue
    text = page.read_text(encoding="utf-8")
    markup = strip_code(text)
    noindex = is_noindex(text)
    is_en = relative.parts[0] == "en"

    if "<title>" not in text:
        errors.append(f"{relative}: missing <title>")
    if 'meta name="description"' not in text:
        errors.append(f"{relative}: missing meta description")
    if len(re.findall(r"<h1\b", markup, re.IGNORECASE)) != 1:
        errors.append(f"{relative}: expected exactly one h1")

    # truncated files / missing menu
    if "</body>" not in text or "</html>" not in text:
        errors.append(f"{relative}: missing </body> or </html> (truncated file?)")
    if page.name not in NO_NAV and "site-nav.js" not in text:
        errors.append(f"{relative}: site-nav.js not loaded (page would have no menu)")

    # duplicate ids — static markup only
    ids = re.findall(r'\bid=["\']([^"\']+)', markup)
    for element_id in sorted(set(ids)):
        if ids.count(element_id) > 1:
            errors.append(f"{relative}: duplicate id '{element_id}'")

    # local links, stylesheets and scripts
    for href in re.findall(r'(?:href|src)=["\']([^"\']+)["\']', strip_samples(text), re.IGNORECASE):
        target = href.split("#", 1)[0].split("?", 1)[0]
        if not target or target.startswith(("http://", "https://", "mailto:", "tel:", "javascript:", "data:", "//")):
            continue
        if target.endswith((".html", ".xml", ".css", ".js", ".svg", ".webp", ".png", ".jpg", ".json")):
            base = ROOT if target.startswith("/") else page.parent
            if not (base / target.lstrip("/")).exists():
                errors.append(f"{relative}: broken local reference '{href}'")

    # canonical
    canonical = re.search(r'<link[^>]+rel="canonical"[^>]+href="([^"]+)"', text)
    if not noindex:
        if not canonical:
            errors.append(f"{relative}: missing canonical")
        elif canonical.group(1) != expected_url(relative):
            errors.append(f"{relative}: canonical is {canonical.group(1)} (expected {expected_url(relative)})")

    # EN pages: hreflang pair
    if is_en and not noindex:
        for lang in ("en", "pt-BR", "x-default"):
            if f'hreflang="{lang}"' not in text:
                errors.append(f"{relative}: missing hreflang={lang}")

    # form controls need an accessible name
    labelled = set(re.findall(r'<label[^>]*\bfor="([^"]+)"', markup, re.IGNORECASE))
    for match in FORM_CONTROL.finditer(markup):
        attrs = match.group(2)
        kind = re.search(r'type="([^"]+)"', attrs)
        if kind and kind.group(1).lower() in ("hidden", "submit", "button", "image"):
            continue
        if "aria-label" in attrs or "aria-labelledby" in attrs or 'aria-hidden="true"' in attrs:
            continue
        control_id = re.search(r'\bid="([^"]+)"', attrs)
        if control_id and control_id.group(1) in labelled:
            continue
        before = markup[: match.start()]
        if before.rfind("<label") > before.rfind("</label>"):
            continue  # wrapped by <label>
        errors.append(f"{relative}: <{match.group(1)}{' id=' + control_id.group(1) if control_id else ''}> has no label/aria-label")

    if 'href="https://linkedin.com"' in text or "linkedin.com/in/desenvolvedor" in text:
        errors.append(f"{relative}: generic LinkedIn URL")
    if page.name == "jogos.html" and "Snake e Memory" in text:
        errors.append(f"{relative}: stale two-game description")

    if page.stat().st_size > MAX_PAGE_BYTES:
        warnings.append(f"{relative}: {page.stat().st_size // 1000} KB; move embedded media to assets")

    if not noindex and page.name not in NOT_IN_SITEMAP:
        indexable[relative.as_posix()] = page

# sitemap <-> files
sitemap_path = ROOT / "sitemap.xml"
if sitemap_path.exists():
    listed = set()
    for loc in re.findall(r"<loc>([^<]+)</loc>", sitemap_path.read_text(encoding="utf-8")):
        if not loc.startswith(BASE):
            errors.append(f"sitemap.xml: unexpected host in {loc}")
            continue
        path = loc[len(BASE):] or "index.html"
        if path.endswith("/"):
            path += "index.html"
        listed.add(path)
    for path in sorted(listed):
        if not (ROOT / path).exists():
            errors.append(f"sitemap.xml: lists missing file '{path}'")
        elif path.endswith(".html") and is_noindex((ROOT / path).read_text(encoding="utf-8")):
            errors.append(f"sitemap.xml: lists noindex page '{path}'")
    for path in sorted(set(indexable) - listed):
        errors.append(f"sitemap.xml: missing indexable page '{path}'")
else:
    errors.append("sitemap.xml not found")

if errors:
    print("Errors:")
    print("\n".join(f"- {item}" for item in errors))
if warnings:
    print("Warnings:")
    print("\n".join(f"- {item}" for item in warnings))

if errors:
    sys.exit(1)

total = len([p for p in pages if not p.name.startswith("google")])
print(f"Validated {total} HTML pages: OK")
if warnings:
    print(f"{len(warnings)} performance warning(s) remain")
