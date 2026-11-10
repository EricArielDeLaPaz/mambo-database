---
id: contrast-and-wcag
title: Contrast and WCAG, step by step
summary: How the contrast ratio is calculated, the pass marks, and how this site's checker matches WebAIM.
topic: Accessibility
level: Intermediate
order: 4
---

## What the ratio means

WCAG measures contrast as a ratio between the **relative luminance** (how bright a color looks to the eye) of two colors.

```
ratio = (L1 + 0.05) / (L2 + 0.05)
```

`L1` is the lighter color's luminance and `L2` the darker one's. The result runs from 1:1 to 21:1.

## How luminance is worked out

1. Turn each channel (red, green, blue) into a number from 0 to 1.
2. Linearize it. If the value is 0.03928 or below (the cut-off WCAG 2.x and WebAIM use), divide by 12.92. Otherwise use `((value + 0.055) / 1.055) ^ 2.4`.
3. Combine: `L = 0.2126 R + 0.7152 G + 0.0722 B`.

Green counts most because the eye is most sensitive to it.

## The pass marks

| Level | Normal text | Large text | UI parts and graphics |
| --- | --- | --- | --- |
| AA | 4.5:1 | 3:1 | 3:1 |
| AAA | 7:1 | 4.5:1 | not defined |

**Large text** means 24px or bigger, or 18.66px or bigger if bold. Ratios are **not rounded up**. A ratio of 4.49 fails 4.5.

## How this site checks

The contrast badges in the Design Systems tab use the same formula and thresholds as the [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/), a well-known tool from the nonprofit WebAIM at Utah State University. If you want a second opinion, use the "Check on WebAIM" links beside each pair. They open the checker with both colors filled in.

## Fixing a failing pair

- **Darken the text or lighten the background.** Small changes to lightness are usually enough.
- **Keep the hue.** The wrench button in Design Systems keeps your color's hue and adjusts its lightness until it passes.
- **Use a larger size.** Light gray might pass at 3:1 for a big heading but not for body text.

## What a ratio cannot tell you

- **Thin fonts.** A very thin weight can pass the ratio and still be hard to read.
- **Color blindness.** Red on green can pass the ratio and still be confusing. See [Accessibility basics](#/guide/accessibility-basics).
- **Text over images.** The ratio is only meaningful against a known solid color. Add a scrim or solid panel behind the text.
- **Disabled controls.** WCAG does not require contrast for disabled controls, but people still need to find them. Aim for readable anyway.

> **Rule of thumb.** Aim a little above the minimum, for example 5:1 for body text. Screens, sunlight and aging eyes all reduce real-world contrast.
