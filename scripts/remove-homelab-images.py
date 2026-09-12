from pathlib import Path
import re

page = Path(__file__).resolve().parents[1] / "homelab.html"
text = page.read_text(encoding="utf-8")

def image_note(match):
    alt = match.group(1).strip()
    return f'<div class="infra-img-note">Registro textual: {alt}.</div>'

text = re.sub(r'<img\b[^>]*\balt="([^"]*)"[^>]*>', image_note, text, flags=re.IGNORECASE)
text = re.sub(r'\s*onclick="openLightbox\(this\)"', '', text)
text = re.sub(r'\s*<div class="infra-img-overlay">.*?</div>', '', text, flags=re.DOTALL)
text = re.sub(r'\n\s*<div class="lightbox".*?</div>\n', '\n', text, flags=re.DOTALL)
text = re.sub(r'\n\s*// Lightbox.*?\n\s*document.addEventListener\(\'keydown\'.*?\n\s*\}\);', '', text, flags=re.DOTALL)
page.write_text(text, encoding="utf-8")
print("Imagens do laboratorio removidas; textos preservados")
