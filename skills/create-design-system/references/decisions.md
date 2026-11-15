# Decisions: turning answers into values

Starting points, not rules. Always check contrast afterwards.

## Feel -> direction
| Feel | Color direction | Type direction | Shape |
|---|---|---|---|
| Professional | Navy or slate primary, lots of neutral | Clean sans | Small radii |
| Trustworthy | Blue or deep teal, restrained accent | Humanist sans, readable body | Small radii, clear borders |
| Fun | Violet, coral or yellow accents on white | Rounded or geometric display | Large radii |
| Calm | Soft teal or sage, warm neutrals | Light to regular weights, generous line height | Medium radii |
| Bold | Near-black with one saturated accent | Heavy display weights | Sharp or pill |
| Premium | Black, ivory, one muted metallic | Serif display with a clean sans | Small radii, lots of space |
| Friendly | Warm accent, soft neutrals | Rounded sans | Medium radii |
| Technical | Neutral grays, one electric accent | Sans with a mono | Small radii |
| Warm, appetizing | Reds, oranges, cream | Friendly serif or sans | Medium radii |
| Fresh | Green and white | Light geometric sans | Medium radii |

Industry hints: finance and legal lean blue and neutral; healthcare and wellness lean teal and green; food leans warm; kids and games allow bright palettes but text still needs 4.5:1. The four feel groups in the intake map to: Professional and trustworthy = Professional + Trustworthy; Friendly and fun = Friendly + Fun; Calm and fresh = Calm + Fresh; Bold and premium = Bold + Premium.

## Required contrast pairs (check each theme)
| Pair | Minimum |
|---|---|
| Text on Background, Surface and Surface variant | 4.5:1 |
| Text secondary on Background and Surface | 4.5:1 |
| Inverse text on Primary, Secondary and each feedback color used as a fill | 4.5:1 |
| Link on Background | 4.5:1 |
| Success, Warning, Danger, Info used as text on Background | 4.5:1 |
| Primary, feedback colors and icons used without text | 3:1 |
| Borders that identify an input or button, and the focus ring, on Background and Surface | 3:1 |
Placeholder text counts as text. Disabled controls are exempt from the minimum but should stay legible. Pair color with an icon or text; never red against green alone.

## Dark mode (derive from light, then re-check every pair)
- Background about 8 to 12 percent lightness (pure black only if asked). Surface and Surface variant one and two steps lighter, about 4 to 6 points each.
- Text about 92 to 96 percent lightness; Text secondary about 70 percent.
- Accents: keep the hue, raise lightness and lower saturation a little until the pairs pass on the dark Background.
- Re-pick feedback colors for the dark theme; do not reuse the light values.
- Show elevation with a lighter surface and a border; shadows barely show on dark.

## Type
Body is 16px or larger on mobile. Line height: body 1.5, UI labels 1.25, headings 1.2 at 24px and above and 1.3 below. Weights: at most 3 (for example 400, 600, 700).
| Density | xs | sm | base | lg | xl | 2xl | 3xl |
|---|---|---|---|---|---|---|---|
| Compact (desktop only, body 14) | 12 | 13 | 14 | 18 | 20 | 24 | 32 |
| Comfortable (default) | 12 | 14 | 16 | 20 | 24 | 32 | 40 |
| Spacious | 14 | 16 | 18 | 24 | 32 | 40 | 48 |

## Spacing
The 4-point scale: `space.1` 4, `space.2` 8, `space.3` 12, `space.4` 16, `space.5` 20, `space.6` 24, `space.8` 32 (px). Interactive controls are at least 44px tall on touch screens. Control height on pointer devices: compact 36, comfortable 40, spacious 48.

## Radius (at most 4 values: sm, md, lg, pill)
| Feel | sm / md / lg |
|---|---|
| Professional, trustworthy, technical, premium | 2 or 4 / 8 / 12 |
| Calm, friendly, warm, fresh | 8 / 12 / 16 |
| Fun | 12 / 16 / 24 |
| Bold | 0 or 4 / 8 / 12 |
`pill` is 999px for buttons and tags.

## Elevation (three levels)
- raised (cards): `0 1px 2px rgba(0,0,0,.08)`
- overlay (menus, popovers): `0 8px 16px -4px rgba(0,0,0,.16)`
- modal: `0 24px 48px -12px rgba(0,0,0,.25)`

## Motion
`motion.duration.fast` 100 to 150ms, `base` 200 to 250ms, `slow` 300 to 400ms. Ease-out when something enters, ease-in when it leaves. Respect `prefers-reduced-motion`: replace movement with a fade or nothing.

## Roles to build
Brand: Primary (always), then Secondary, Tertiary, Accent as needed. Neutral: Background, Surface, Surface variant, Border, Text, Text secondary, Inverse text, Disabled, Overlay. Feedback: Success, Warning, Danger, Info. Other: Link, Highlight.
