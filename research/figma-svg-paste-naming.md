# Research: figma-svg-paste-naming

**Question:** when SVG code is pasted onto the Figma canvas from the clipboard (what the Browse icon "Copy SVG" button produces), what decides the name of the frame or layer that is created? For example the `id` attribute, a `<title>` element, `data-name`, or something else — and does it differ between the Figma web and desktop apps?
**Date accessed:** 2026-11-13.

## Short answer

The only SVG attribute with documented, multiply-corroborated evidence of naming imported layers is **`id`**. Figma reads `id` and uses it as the layer name; `<title>`, `name=`, `inkscape:label` and other metadata do not name layers. Without an `id`, shapes arrive with generic names such as "Vector", and a file import arrives inside a frame named after the file name. This evidence comes from file drag-and-drop import tests (including one by Figma community staff) rather than from clipboard paste of raw code, so the mapping for **paste specifically is consistent but not officially documented** — treat it as a strong inference, not a confirmed fact. No source documents any difference between the Figma web app and the desktop app; that remains **unconfirmed**. The site's current "Copy SVG" output has no `id`, so pasting it creates unnamed layers.

## Findings

| # | Finding | Source URL | Date accessed | Confidence |
|---|---|---|---|---|
| 1 | Raw SVG markup can be pasted straight onto the Figma canvas and becomes editable vector layers (a malformed `xmlns` — an extra apostrophe — broke it in one report; fixing the attribute made paste work). | https://forum.figma.com/ask-the-community-7/paste-svg-code-no-longer-available-29257 | 2026-11-13 | Forum report (self-verified by the poster, marked SOLVED) |
| 2 | Figma names imported layers from the SVG `id` attribute. In a staff-run test, `<ellipse id="bruh">` imported with the layer named `bruh`, verified through the Layers panel and the REST API; `name=` and `title=` do not do this — paths arrive as "Vector". | https://forum.figma.com/report-a-problem-6/stop-wiping-out-svg-element-ids-on-import-56776 ; https://forum.figma.com/ask-the-community-7/svg-import-retain-path-names-34017 | 2026-11-13 | Forum report (first tested by Figma community staff; second is a SOLVED community answer: "Add an id attribute.") |
| 3 | Figma ignores `inkscape:label` and uses the standard `id` attribute to name imported layers and frames. | https://salivity.github.io/inkscape/article/export-inkscape-to-figma-without-losing-layer-names | 2026-11-13 | Third-party guide (consistent with #2) |
| 4 | A dragged-in SVG file "generally arrives as a frame named after the file, with a vector layer for each shape inside it" — i.e. the container frame takes the file name, shapes take their `id`s. | https://www.plotcaster.com/learn/svg-in-figma/ | 2026-11-13 | Third-party guide (untested by us) |
| 5 | Official help: copy the asset in the other tool as SVG, then right-click the Figma canvas and choose "Paste here" (or Ctrl/Cmd+V). SVG marker and pattern elements are not included in the import. No official statement on layer naming. | https://help.figma.com/hc/en-us/articles/360040030374-Copy-assets-between-design-tools | 2026-11-13 | Official documentation (silent on naming) |
| 6 | The `id`↔layer-name mapping is bidirectional on export: Figma's SVG export setting "Include 'id' attribute" writes each layer's name into the exported `id` attribute. This is the export side of the same rule. | https://www.plotcaster.com/learn/svg-in-figma/ ; https://stackoverflow.com/questions/66960484/set-css-class-id-in-figma-and-have-it-declared-on-the-exported-svg-file | 2026-11-13 | Third-party guide + Stack Overflow answer (consistent) |
| 7 | Whether the root `<svg id="…">` names the container frame when raw code is pasted (as opposed to a file being dragged in) | — | 2026-11-13 | **Unconfirmed** — no source found; needs a hands-on test in a Figma file. |
| 8 | Any difference between the Figma web app and the desktop app in how pasted SVG is named | — | 2026-11-13 | **Unconfirmed** — no source found; all tests above were on one platform or did not say. |
| 9 | Whether `data-name` (used by some tools to carry layer names) has any effect on Figma import | — | 2026-11-13 | **Unconfirmed** — no source found either way. |

## What this means for the site (for Phase 2, not done now)

- The Browse "Copy SVG" button emits `iconSvg()` output with no `id` attribute anywhere, so a pasted icon currently gets generic layer names ("Vector"). The best-supported attribute to add is `id` on the root `<svg>` (or on child shapes); the exact root-level behaviour on paste is unconfirmed (#7).
- Any Phase 2 change here should be verified by hand in both the Figma web app and the desktop app before it ships, since no documentation covers the difference (#8).

*No repo code was changed for this item, per the plan.*
