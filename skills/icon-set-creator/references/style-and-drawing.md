# Style spec and drawing rules

These are Mambo's working defaults, chosen to match the library sets and the checks in `scripts/icons.js`. They are not quoted from a standard. Where a number matters (grid, stroke), confirm it against `research/icon-design.md` if that file exists in the project.

## icon-spec.json (defaults)
```json
{"grid":24,"padding":2,"stroke":2,"linecap":"round","linejoin":"round","style":"outline"}
```
- `grid` 24 and `padding` 2: the live area is 2 to 22. For an outline icon the stroke edge (shape box grown by half the stroke) must stay inside it, so path coordinates stay within 3 to 21 with stroke 2.
- `stroke` 2 on a 24 grid reads well at 24px and survives 16px; use 1.5 only for a lighter brand, never mix in one set.
- `linecap` and `linejoin` `round` for friendly or calm, `butt` and `miter` for technical or sharp. One choice for the whole set.
- `style` `outline` (stroke, `fill="none"`, `stroke="currentColor"`) or `filled` (`fill="currentColor"`, no stroke). Do not mix in one set; a filled "active" variant is a second set with the same names and a `-filled` suffix.
- Corner rule: pick one radius for rounded rectangles (for example `rx="2"`) and use it everywhere.

## Drawing rules
1. File: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">` then shapes. No width or height, no `<style>`, no `<defs>`, no gradients, no masks, no text, no images, no `transform`.
2. Only `path`, `circle`, `ellipse`, `rect`, `line`, `polyline`, `polygon`. No fixed colors (only `currentColor` or `none`).
3. Snap points to whole or half units. Keep parallel lines parallel and equal gaps equal (2 units between sibling strokes at least, so they do not merge at 16px).
4. Keep the main shape inside the live area; let a single accent (a dot, a badge) use the corner of it.
5. Same concept size: a "box" shape fills about 18 of 24 units; a tall shape (like a phone) 12 wide by 20 tall; a wide one 20 by 14. Round shapes may be 1 unit larger than square ones so they look equal.
6. Name files in kebab-case by meaning (`arrow-right`, `trash`), not by look. One concept per file.
7. Test it small: preview shows 16, 24 and 96. If two features touch at 16px, remove detail.

## Meaning and accessibility (WCAG 2.2)
- Decorative icon next to a text label: `aria-hidden="true"`.
- Icon that stands alone: give the control an accessible name (visible text, `aria-label`, or `<title>`); icon-only buttons name the button, not the SVG.
- An icon that is the only way to tell something apart needs 3:1 contrast against its background (WCAG 1.4.11). Check with the contrast script of the design-system skills, not by eye.
- Never rely on color alone to carry meaning.

## Common concepts for a product (12 to 20)
menu, search, close, add, edit, delete, settings, user, check, alert, info, arrow-right, chevron-down, upload, download, calendar, home, bell, heart, share. Add domain icons from the person's product (a plumber needs pipe, wrench, droplet).
