# Step 6: document and export

Documentation is the point: it is how an AI (or a new teammate) remembers what each thing is for. Write every description in plain words and keep each one short.

## Files
`design-system/README.md`, `tokens.json`, `tokens.css`, `components/<id>.md`, `progress.md`.

## tokens.json (W3C design tokens; same shape as the Mambo site's export)
```json
{
  "color": { "primary": { "$value": "#1d4ed8", "$type": "color", "$description": "Primary. Main actions and links. Not for large backgrounds." } },
  "typography": { "body-inter": { "fontFamily": { "$value": "Inter", "$type": "fontFamily" }, "fontWeight": { "$value": [400, 600], "$type": "fontWeight" }, "$description": "Body text and UI labels." } },
  "spacing": { "base": { "$value": "4px", "$type": "dimension" } },
  "radius": { "r1": { "$value": "8px", "$type": "dimension" } },
  "shadow": {}
}
```
Every `$description` names the role, when to use it and one thing not to use it for. For a dark theme add a second file `tokens.dark.json` with the same keys.

## tokens.css
`:root { --color-<name>: #hex; --font-<role>: 'Family', system-ui, sans-serif; --space-base: 4px; --radius-1: 8px; --shadow-<name>: ...; }` and the same variables under `@media (prefers-color-scheme: dark)` and `:root[data-theme="dark"]` when dark mode is included.

## README.md
1. One paragraph: what the system is for, who uses it, platforms, themes.
2. Colors: a table with name, role, hex, what it is for, and the contrast ratios for its required pairs in each theme.
3. Type: families, weights, the scale table, line heights.
4. Foundations: spacing scale, radius, elevation, motion.
5. Components: a list linking to each `components/<id>.md`.
6. Icons: the set, its license and where the notice is kept.
7. Decisions and assumptions: each choice with one line of why; anything not verified.
8. How to use this with AI: "Use tokens by name, not by hex. Read `components/<id>.md` before building a component."

## components/<id>.md (from `scripts/brief.js`)
```
# <Name>
For: <one sentence>
Use when: ... | Do not use when: ... (use <alternative> instead)
Variants: ... | States: default, focus, ...
Tokens: <system token names>
Accessibility: role, keyboard, focus
```
Map the entry's token names to this system's roles: `color.primary` -> Primary; `color.primary-text` -> Inverse text; `color.text.primary` -> Text; `color.text.secondary` -> Text secondary; `color.text.danger` and `color.danger` -> Danger; `color.surface.default` -> Background; `color.surface.subtle`, `color.surface.raised`, `color.surface.container` -> Surface; `color.surface.overlay` -> Surface; `color.surface.inverse` -> Text (inverse use); `color.border.default` and `color.border.strong` -> Border; `color.scrim` -> Overlay; `color.link` -> Link; `color.accent` -> Accent; `color.success`, `color.warning` -> Success, Warning; `radius.*` -> radius sizes; `space.N` -> N x 4px; `shadow.*` -> elevation levels; `motion.*` -> motion durations. If a token has no mapping, say so and propose one.

## Figma handoff (when the person will build it in Figma)
- One variable collection per kind (Color, Type, Spacing, Radius) with modes Light and Dark. Name variables by role, for example `color/primary`.
- One component set per component, named like the entry, with variant properties `State` and `Style`. Use the entry's "Figma handoff", "States" and "Static frame" sections.
- Write each variable's and component's description from the same text as the README.

## Closing message
Use the shared closing shape. Name the files created, the first thing to check, and that the site's Design Systems tab will flag count and contrast problems if the colors are pasted in.
