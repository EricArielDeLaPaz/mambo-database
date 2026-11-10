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

Pick **one style per product** and keep stroke weight consistent. Mixing outline and filled is fine only when it means something, such as inactive and active.

## Sizes and grids

- Common sizes are **16, 20, 24 and 32 px**. 24px is the usual default.
- Icons sit on a grid with a little padding (live area) so they feel balanced.
- The **icon size is not the tap target.** A 24px icon button should still have a 44px (iOS) or 48px (Android) touch area.

## Formats

| Format | Use | Notes |
| --- | --- | --- |
| SVG | The standard for the web and most apps | Sharp at all sizes. Can be inline, an image file, or a sprite. Inline SVG can take its color from CSS using `currentColor`. |
| Icon font | Older approach | One font file of glyphs. Harder to make accessible and can fail to load. Most teams now prefer SVG. |
| PNG | App icons, email, places SVG is not supported | Export at 1x, 2x and 3x. |
| PDF | Some native iOS workflows | Vector. Engineers will say if they need it. |

> **Share a format with engineers.** In Figma, mark the icon as a component, keep the frame at its size (such as 24 by 24), flatten strokes only if asked, and export as SVG.

## Accessible icons

- **Decorative icon next to text.** Hide it from screen readers (`aria-hidden="true"`).
- **Icon-only button.** It needs a name, for example `aria-label="Delete"`, and ideally a tooltip.
- **Meaning.** Common icons (search, close, home) are understood. Unusual ones need a label.
- **Color.** Icons that carry meaning need 3:1 contrast against the background.

## System icon sets

Platforms ship their own icons that match their interface.

- **SF Symbols** (Apple). Thousands of symbols that scale with text and weight. Licensed for apps on Apple platforms, so check Apple's terms before using them elsewhere.
- **Material Symbols** (Google). Variable icons with adjustable weight, fill, grade and optical size. Free to use under the Apache 2.0 license.
- Follow the **Human Interface Guidelines** (Apple) and **Material Design** (Google) for how to use them.

## Free libraries (check each license)

| Library | License (at time of writing) | Style |
| --- | --- | --- |
| Material Symbols | Apache 2.0 | Outline, rounded, sharp |
| Lucide | ISC | Clean outline |
| Feather | MIT | Simple outline |
| Heroicons | MIT | Outline and solid |
| Phosphor | MIT | Six weights |
| Tabler Icons | MIT | Large outline set |
| Bootstrap Icons | MIT | Mixed, general-purpose |

Always check the license on the project page before shipping, and keep any required notice.

## Choosing

1. Match the platform. Use SF Symbols on iOS and Material on Android where it makes sense.
2. Use a single library for a product when possible, so style and weight stay consistent.
3. Check that the set has every icon you need before you commit.
