"""The gate. Keep all 64-unit geometry here."""
BG = "#09090b"
FG = "#f4f4f5"
FG_INVERTED = "#09090b"
BG_LIGHT = "#f4f4f5"
MUTED = "#71717a"
STRUCTURE = "#3f3f46"
BRAND = "#10b981"
DENY = "#ef4444"
AMBER = "#f59e0b"
COLORS = {BG, FG, FG_INVERTED, BG_LIGHT, MUTED, STRUCTURE, BRAND, DENY, AMBER}

ARCH = "M14 26a18 10 0 0 1 36 0"
PILLARS = "M14 26v22 M50 26v22"
BASE = "M14 48h36"
DOORS_OPEN = "M14 37h12 M38 37h12"
DOORS_CLOSED = "M14 37h36"
DOORS_16 = "M14 37h10 M40 37h10"

def gate_paths(state="open", small=False):
    doors = DOORS_16 if small else (DOORS_CLOSED if state == "closed" else DOORS_OPEN)
    return f'<path d="{ARCH}"/><path d="{PILLARS}"/><path d="{BASE}"/><path d="{doors}"/>'

def gate_group(color, state="open", width=5, small=False):
    return (f'<g fill="none" stroke="{color}" stroke-width="{width}" '
            f'stroke-linecap="round" stroke-linejoin="round">{gate_paths(state, small)}</g>')

def svg_document(contents, width=64, height=64, viewbox="0 0 64 64"):
    return (f'<svg xmlns="http://www.w3.org/2000/svg" width="{width}" height="{height}" '
            f'viewBox="{viewbox}">{contents}</svg>')
