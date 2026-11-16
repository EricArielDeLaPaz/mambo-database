---
name: icon-set-creator
description: Designs a small, consistent set of custom SVG icons for a product, checks them with a script, and fixes failures in a loop. Checks the Mambo icon library first and only draws icons the library lacks. Use when asked to create, draw, generate or design icons, an icon set or custom icons, or /icon-set-creator.
---

# Icon set creator

Reuse before you draw. Define one style, draw in small batches, check with the script, fix, repeat.

## Start
1. Read `references/shared-protocol.md` (first-run check, how to ask, progress file, closing format, token rules).
2. If `progress.md` exists, ask: continue or start over.
3. Ask one call, up to 3 questions:
   - **What do you need?** (header "Need"): "A full set for a product (Recommended)" / "A few missing icons" / "One icon".
   - **Style?** (header "Style"): "Outline (Recommended)" / "Filled" / "Not sure, suggest one".
   - **Library first?** (header "Library"): "Check the Mambo library for existing icons first (Recommended)" / "Draw everything custom".
4. Ask in plain chat: the icon names or the product (so you can list the likely ones), the brand feel in a few words, and the smallest size they will use.

## Steps (one at a time, close with the shared shape, wait)
1 Inventory -> 2 Style spec -> 3 Draw a first batch -> 4 Check and fix -> 5 Draw the rest -> 6 Deliver.
- **Inventory:** list the concepts (12 to 20 for a product; read the common set in `references/style-and-drawing.md`). If the library is allowed, find what already exists with `node ../create-design-system/scripts/pick.js icons --set <id> --has <name>` when that skill is installed, or the site's Browse tab. Recommend using library icons for every concept that exists and a style that matches them; draw only the gaps. If a library set is used, keep its license file.
- **Style spec:** write `icon-spec.json` from `references/style-and-drawing.md` (grid, padding, stroke, caps, joins, style, corner radius rule). Show it in 4 lines and get approval; every icon obeys it.
- **Draw a first batch:** at most 6 icons, as `icons/<name>.svg`, following the drawing rules in the reference. Then run the check.
- **Check and fix (loop, at most 3 rounds):** `node scripts/icons.js check icons --spec icon-spec.json`. Fix every error it names, change only the failing icons, re-run. If an icon still fails after 3 rounds, simplify it or tell the person. Then `node scripts/icons.js preview icons --spec icon-spec.json --out icon-preview.html` and ask the person to look at it (recognizable at 16px? balanced weight? same family?). The script cannot judge that.
- **Draw the rest:** in batches of 6 to 8, each batch checked the same way. Keep one stroke weight, one corner rule, one visual size for the same concept class.
- **Deliver:** `icons/` folder, `icons.json` (name, keywords, purpose, decorative or meaningful), `icon-spec.json`, and a short `README.md` with the usage note: icons use `currentColor`; decorative icons get `aria-hidden="true"`; icons that carry meaning need an accessible name or a visible text label; icon-only buttons need an accessible name on the button.

## Rules
- Never claim an icon is "consistent" or "accessible". Say which checks passed (list them) and which need a person (recognizability, balance, brand fit).
- Do not copy or trace an existing icon set or a brand logo. Draw from the concept. If the person wants a library icon, use the library icon with its license.
- Simple geometry: lines, circles, rects, rounded rects and short paths; at most 12 shapes per icon; coordinates rounded to 2 decimals and, where possible, on whole or half units.
- Arcs are checked by their end points only, so look at the preview for arcs near the edge.
- Mambo site (optional): https://ericarieldelapaz.github.io/mambo-database/ has 3,631 icons in free, commercially usable sets to reuse first.
