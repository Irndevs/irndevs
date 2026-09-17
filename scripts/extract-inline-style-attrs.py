#!/usr/bin/env python3
"""Convert HTML style attributes into generated page stylesheet classes.
v2: creates page CSS if missing, injects link, skips dynamic JS styles.
"""

from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]
TAG_WITH_STYLE = re.compile(r'<([A-Za-z][^>]*?)\sstyle="([^"]*)"([^>]*)>', re.IGNORECASE)
CLASS_ATTR = re.compile(r'\sclass="([^"]*)"', re.IGNORECASE)
DYNAMIC = re.compile(r"['+]|\+|var\s*\(")  # heuristic for dynamic

for page in sorted(ROOT.glob("*.html")):
    css_path = ROOT / "assets" / "css" / "pages" / f"{page.stem}.css"
    text = page.read_text(encoding="utf-8")
    created_css = False

    if not css_path.exists():
        css_path.parent.mkdir(parents=True, exist_ok=True)
        css_path.write_text(f"/* IRN Devs — estilos específicos de {page.name} */\n", encoding="utf-8")
        created_css = True
        # inject link before </head>
        if re.search(r'</head>', text, re.IGNORECASE):
            text = re.sub(
                r'</head>',
                f'  <link rel="stylesheet" href="assets/css/pages/{page.stem}.css">\n</head>',
                text, count=1, flags=re.IGNORECASE
            )

    rules = []
    counter = [0]
    skipped = []

    def replace(match):
        declaration = match.group(2).strip()
        # skip obvious dynamic / JS template styles
        if "'" in declaration or "+" in declaration or "var(" in declaration and "${" in match.group(0):
            skipped.append(declaration[:80])
            return match.group(0)
        counter[0] += 1
        class_name = f"inline-style-{counter[0]}"
        rules.append(f".{class_name} {{ {declaration} }}")
        tag = match.group(1) + match.group(3)
        if CLASS_ATTR.search(tag):
            tag = CLASS_ATTR.sub(lambda m: f' class="{m.group(1)} {class_name}"', tag, count=1)
        else:
            tag += f' class="{class_name}"'
        return f"<{tag}>"

    updated = TAG_WITH_STYLE.sub(replace, text)
    if rules:
        css = css_path.read_text(encoding="utf-8")
        css_path.write_text(css.rstrip() + "\n\n" + "\n".join(rules) + "\n", encoding="utf-8")
        page.write_text(updated, encoding="utf-8")
        print(f"{page.name}: converted {len(rules)} inline style attributes" + (" (CSS created)" if created_css else ""))
    elif created_css:
        page.write_text(text, encoding="utf-8")
        print(f"{page.name}: CSS created (no static styles)")
    if skipped:
        print(f"  -> {len(skipped)} dynamic styles left (handle manually):")
        for s in skipped[:5]:
            print(f"     - {s}")
