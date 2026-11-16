# Input formats

## Figma variables (`figma-variables.json`)
Build this from the Figma connector's variable listing (for the Figma MCP server, the variable-definitions tool and, for modes, the file's variable collections). Keep it small: names, type and one value per mode.
```json
{"collections":[{"name":"Colors","modes":["Light","Dark"],"variables":[
  {"name":"color/text","type":"COLOR","values":{"Light":"#111111","Dark":"#f5f5f5"}},
  {"name":"color/brand","type":"COLOR","values":{"Light":{"alias":"color/primary"},"Dark":"#60a5fa"}},
  {"name":"spacing/md","type":"FLOAT","values":{"Light":16,"Dark":16}}]}]}
```
- Colors may be `#rrggbb`, `#rrggbbaa`, `rgb()` text or the API object `{"r":0..1,"g":0..1,"b":0..1,"a":0..1}`.
- Numbers (FLOAT) are pixels. Strings are compared as text.
- An alias is `{"alias":"other/name"}`.
- A mode name containing "dark" is the dark theme; the first other mode is light. Extra modes (brand A, brand B) are not compared; say so.
- A W3C design-tokens file also works as the Figma side (groups become names; a top-level `dark` group is the dark theme).

## Code
- CSS custom properties anywhere in the file: `:root`, `html`, `[data-theme=...]`. A block is dark if it is inside `@media (prefers-color-scheme: dark)` or its selector contains "dark". Dark inherits light values it does not redefine.
- W3C JSON (`$value`), same rules as above.
- Not supported: Tailwind v3 `theme.extend` JS objects, SCSS variables, CSS-in-JS themes. Ask the person to export them to CSS custom properties or JSON first, or read the values and write them to a temporary JSON file in the W3C shape.

## Name matching
Names are lower-cased with `/`, `.`, `_` and spaces turned into `-`. A leading `color-` is optional, so `color/text` matches `--text` and `--color-text`. Same value but a different name is reported as `possible-rename`, never matched automatically.

## changes.json
One object per difference: `id, kind, theme, figmaName, codeName, figma, code, action, approve`. `apply` edits CSS only and only entries with `"approve": true` and action `set-code` or `add-to-code`. New tokens are named `--<normalized-figma-name>`; rename them to the project's convention if the person says so.
