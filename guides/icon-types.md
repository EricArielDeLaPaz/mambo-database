---
id: icon-types
title: Icon types, formats and libraries
summary: Outline versus filled icons, sizes and grids, SVG and other formats, and the main free icon libraries and system icon sets.
topic: Assets
level: Beginner
order: 9
---

Icons are small pictures that speed up scanning. Used well, they support text. Used alone, they can confuse.

## Styles

| Style | Looks like | Often used for |
| --- | --- | --- |
| Outline (line) | Thin strokes, hollow | Default, inactive states |
| Filled (solid) | Solid shapes | Selected or active states, emphasis |
| Duotone | Two tones or opacity levels | Marketing, empty states |
| Rounded or sharp | Corner treatment | Matches the brand's personality |
| Bold, light or thin | Stroke weight of the same icon | Matches text weight or brand tone |
| Pixel | Blocky, retro look | Games and playful brands |

Pick **one style per product** and keep stroke weight consistent. Mixing outline and filled is fine only when it means something, such as inactive and active.

## Sizes and grids

- Common sizes are **16, 20, 24 and 32 px**. Material Symbols are designed on a 24px grid.[^11]
- Icons sit on a grid with a little padding (live area) so they feel balanced.
- The **icon size is not the tap target.** A 24px icon button should still have a 44pt (iOS) or 48dp (Android) touch area.[^1][^2]

## Formats

| Format | Use | Notes |
| --- | --- | --- |
| SVG | The standard for the web and most apps | Sharp at all sizes. Can be inline, an image file, or a sprite. Inline SVG can take its color from CSS using `currentColor`.[^3][^4] |
| Icon font | Older approach | One font file of glyphs. Has accessibility and loading pitfalls, so many teams prefer SVG. |
| PNG | App icons, email, places SVG is not supported | Export at 1x, 2x and 3x.[^5] |
| PDF | Some native iOS workflows | Vector. Engineers will say if they need it. |

> **Share a format with engineers.** In Figma, make the icon a component and keep its frame at the real size (such as 24 by 24). Flatten strokes only if asked. Export as SVG.

## Accessible icons

- **Decorative icon next to text.** Hide it from screen readers (`aria-hidden="true"`).[^6]
- **Icon-only button.** It needs a name, for example `aria-label="Delete"`, and ideally a tooltip.[^7]
- **Meaning.** Common icons (search, close, home) are understood. Unusual ones need a label.
- **Color.** Icons that carry meaning need 3:1 contrast against the background.[^8]

## System icon sets

Platforms ship their own icons that match their interface.

- **SF Symbols** (Apple). Thousands of symbols that scale with text and weight. Licensed for apps on Apple platforms, so check Apple's terms before using them elsewhere.[^9][^10]
- **Material Symbols** (Google). Variable icons with adjustable weight, fill, grade and optical size. Free to use under the Apache 2.0 license.[^11]
- Follow the **Human Interface Guidelines** (Apple[^12]) and **Material Design** (Google[^13]) for how to use them.

## Free libraries (check each license)

Browse has every library below as real icons you can filter by design system and style, then copy or download.

[View all libraries in Browse](#/browse/icon){.btn}

| Library | License (at time of writing) | Styles in Browse |
| --- | --- | --- |
| Material Icons (Google) | Apache 2.0[^14] | Outline, filled, rounded, sharp, duotone |
| Lucide | ISC[^15] | Outline |
| Feather | MIT[^16] | Outline |
| Heroicons (Tailwind CSS) | MIT[^17] | Outline and filled |
| Phosphor | MIT[^18] | Outline, filled, bold, light, thin, duotone |
| Tabler Icons | MIT[^19] | Outline and filled |
| Bootstrap Icons | MIT[^20] | Outline and filled |
| Carbon (IBM) | Apache 2.0[^21] | Outline and filled |
| Fluent UI (Microsoft) | MIT[^22] | Outline and filled |
| Ionicons | MIT[^23] | Outline, filled and sharp |
| Octicons (GitHub Primer) | MIT[^24] | Outline |
| Iconoir | MIT[^25] | Outline and filled |
| Eva Icons | MIT[^26] | Outline and filled |
| Majesticons | MIT (a free subset of 760 icons); the full library needs a paid license[^27] | Outline and filled |
| Teenyicons | MIT[^28] | Outline and filled (15px grid) |
| Pixelarticons | MIT[^29] | Pixel |

Always check the license on the project page before shipping, and keep any required notice.

## Choosing

1. Match the platform. Use SF Symbols on iOS and Material on Android where it makes sense.
2. Use a single library for a product when possible, so style and weight stay consistent.
3. Check that the set has every icon you need before you commit.

## Where to read more

- In this database: [SVG Export](#/entry/svg-export) — a browser extension for exporting the SVGs on a page as SVG, PNG or JPEG, with styles inlined.

Sources for the facts above. The "Styles in Browse" column lists what this site's Browse shows for each library; it was checked against the site's own data on 2026-11-14 and is not an outside fact.

[^1]: Human Interface Guidelines: Buttons — Apple Developer. https://developer.apple.com/design/human-interface-guidelines/buttons . Accessed 2026-11-14.
[^2]: Designing: Structure — Material Design 3, Google. https://m3.material.io/foundations/designing/structure . Accessed 2026-11-14.
[^3]: Image file type and format guide — MDN Web Docs (Mozilla). https://developer.mozilla.org/en-US/docs/Web/Media/Formats/Image_types . Accessed 2026-11-14.
[^4]: color_value — MDN Web Docs (Mozilla). https://developer.mozilla.org/en-US/docs/Web/CSS/color_value . Accessed 2026-11-14.
[^5]: Image performance — web.dev (Google). https://web.dev/learn/performance/image-performance . Accessed 2026-11-14.
[^6]: ARIA: aria-hidden attribute — MDN Web Docs (Mozilla). https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-hidden . Accessed 2026-11-14.
[^7]: ARIA: aria-label attribute — MDN Web Docs (Mozilla). https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-label . Accessed 2026-11-14.
[^8]: Web Content Accessibility Guidelines (WCAG) 2.2 — W3C. https://www.w3.org/TR/WCAG22/ . Accessed 2026-11-14. (SC 1.4.11 Non-text Contrast.)
[^9]: SF Symbols — Apple Developer. https://developer.apple.com/sf-symbols/ . Accessed 2026-11-14.
[^10]: SF Symbols — Human Interface Guidelines, Apple Developer. https://developer.apple.com/design/human-interface-guidelines/sf-symbols . Accessed 2026-11-14.
[^11]: Material Symbols guide — Google for Developers. https://developers.google.com/fonts/docs/material_symbols . Accessed 2026-11-14.
[^12]: Human Interface Guidelines — Apple Developer. https://developer.apple.com/design/human-interface-guidelines/ . Accessed 2026-11-14.
[^13]: Material Design 3 — Google. https://m3.material.io/ . Accessed 2026-11-14.
[^14]: google/material-design-icons LICENSE (Apache-2.0) — GitHub. https://github.com/google/material-design-icons . Accessed 2026-11-14.
[^15]: lucide-icons/lucide LICENSE (ISC) — GitHub. https://github.com/lucide-icons/lucide . Accessed 2026-11-14.
[^16]: feathericons/feather LICENSE (MIT) — GitHub. https://github.com/feathericons/feather . Accessed 2026-11-14.
[^17]: tailwindlabs/heroicons LICENSE (MIT) — GitHub. https://github.com/tailwindlabs/heroicons . Accessed 2026-11-14.
[^18]: phosphor-icons/core LICENSE (MIT) — GitHub. https://github.com/phosphor-icons/core . Accessed 2026-11-14.
[^19]: tabler/tabler-icons LICENSE (MIT) — GitHub. https://github.com/tabler/tabler-icons . Accessed 2026-11-14.
[^20]: twbs/icons LICENSE (MIT) — GitHub. https://github.com/twbs/icons . Accessed 2026-11-14. (Repository renamed from twbs/bootstrap-icons.)
[^21]: carbon-design-system/carbon LICENSE (Apache-2.0) — GitHub. https://github.com/carbon-design-system/carbon . Accessed 2026-11-14.
[^22]: microsoft/fluentui LICENSE (MIT) — GitHub. https://github.com/microsoft/fluentui . Accessed 2026-11-14.
[^23]: ionic-team/ionicons LICENSE (MIT) — GitHub. https://github.com/ionic-team/ionicons . Accessed 2026-11-14.
[^24]: primer/octicons LICENSE (MIT) — GitHub. https://github.com/primer/octicons . Accessed 2026-11-14.
[^25]: iconoir-icons/iconoir LICENSE (MIT) — GitHub. https://github.com/iconoir-icons/iconoir . Accessed 2026-11-14.
[^26]: akveo/eva-icons LICENSE (MIT) — GitHub. https://github.com/akveo/eva-icons . Accessed 2026-11-14.
[^27]: halfmage/majesticons (MIT free subset of 760 icons) — GitHub; Majesticons — https://majesticons.com/license . Accessed 2026-11-14.
[^28]: teenyicons/teenyicons.com LICENSE (MIT) — GitHub. https://github.com/teenyicons/teenyicons.com . Accessed 2026-11-14.
[^29]: halfmage/pixelarticons LICENSE (MIT) — GitHub. https://github.com/halfmage/pixelarticons . Accessed 2026-11-14.
