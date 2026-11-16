---
name: create-design-system
description: Guides a person from zero to a documented, accessible design system. Asks whether they already have one in Figma, want to start from the Mambo Database, or start from scratch, then builds colors, type, foundations, components and icons one step at a time. Use when asked to create, start, document or set up a design system, or /create-design-system.
---

# Create a design system

Ask first, build second, and stop after every step.

## Start
1. Read `references/shared-protocol.md` (first-run check, how to ask, progress file, research handoff, closing format, token rules).
2. If `progress.md` exists, ask: continue or start over.
3. Ask one question, header "Start from": **Do you already have a design system?**
   - "Yes, in Figma" -> read `references/branch-figma.md`
   - "Use the Mambo Database" -> read `references/branch-library.md`
   - "Start from scratch" -> read `references/branch-scratch.md`
   Follow that file. Do not read the other two.

## Steps (every branch uses some or all)
1 Intake -> 2 Colors -> 3 Type -> 4 Foundations (spacing, radius, elevation, motion) -> 5 Components and icons -> 6 Document and export. Each branch file says which steps it skips or changes. Do one step, write its output, close with the shape in the shared protocol, and wait.

## Where the Mambo site is used
Only these steps use the Mambo Database. Everything else is standalone.
- Colors and Type (library and scratch branches): `node scripts/pick.js` reads the bundled data. No web access needed.
- Components and icons: offer a preset or let the person pick. `references/components-and-icons.md` has the presets and how to read the data. For pictures, point to Browse at https://ericarieldelapaz.github.io/mambo-database/
- Checking the result: the site's contrast checker and Design Systems tab flag contrast and count problems if the person pastes the output in.

## Rules (always)
- Use these color role names exactly: Primary, Secondary, Tertiary, Accent / Background, Surface, Surface variant, Neutral, Border, Text, Text secondary, Inverse text, Disabled, Overlay / Success, Warning, Danger, Info / Link, Highlight.
- Counts: brand colors 1 to 4 (aim for 3), neutrals 3 to 8, feedback colors 2 to 4, all colors 6 to 16 (aim for 14 or fewer). At most 2 typefaces plus an optional mono, 3 weights each.
- Spacing uses the 4-point scale: 4, 8, 12, 16, 20, 24, 32. Touch targets are at least 44px.
- Check every text/background pair and every UI border/icon pair in every theme with `node scripts/contrast.js`: 4.5:1 for text, 3:1 for large text and UI. Never estimate. Never lower the bar; change the color instead. Never use color alone to carry meaning.
- State assumptions at the top of any output made without an answer. Ask before building.
- More colors, fonts or weights than the limits need a reason, written down.

## Output
Write to a `design-system/` folder: `README.md` (the documentation), `tokens.json`, `tokens.css`, `components/` (one file per chosen component) and `progress.md`. Formats are in `references/output-formats.md`. Describe what each token and component is for; that is what lets an AI remember it later.
