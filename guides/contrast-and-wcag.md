---
id: contrast-and-wcag
title: Contrast and WCAG, step by step
summary: How the contrast ratio is calculated, the pass marks, and how this site's checker matches WebAIM.
topic: Accessibility
level: Intermediate
order: 4
---

## What the ratio means

WCAG measures contrast as a ratio between the **relative luminance** (how bright a color is, weighted for human vision) of two colors.[^1]

```
ratio = (L1 + 0.05) / (L2 + 0.05)
```

`L1` is the lighter color's luminance and `L2` the darker one's. The result runs from 1:1 to 21:1.

## How luminance is worked out

1. Turn each channel (red, green, blue) into a number from 0 to 1.
2. Linearize it. If the value is 0.04045 or below (the WCAG 2.x cut-off; 0.03928 was the value before the May 2021 erratum[^6]), divide by 12.92. Otherwise use `((value + 0.055) / 1.055) ^ 2.4`.
3. Combine: `L = 0.2126 R + 0.7152 G + 0.0722 B`.

Green counts most because the eye is most sensitive to it.

## The pass marks

| Level | Normal text | Large text | UI parts and graphics |
| --- | --- | --- | --- |
| AA | 4.5:1 | 3:1 | 3:1 |
| AAA | 7:1 | 4.5:1 | not defined |

**Large text** means 24px or bigger, or 18.66px or bigger if bold (the spec's 18 pt and 14 pt bold)[^1]. Ratios are **not rounded up**[^2]. A ratio of 4.49 fails 4.5.

## How this site checks

The contrast badges in the Design Systems tab use the WCAG 2.2 formula and pass marks[^1]. For an independent check, use the "Check on WebAIM" links beside each pair. They open the [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/) with both colors filled in. WebAIM is a nonprofit at Utah State University[^3][^4].

## Fixing a failing pair

- **Darken the text or lighten the background.** Small changes to lightness are usually enough.
- **Keep the hue.** The wrench button in Design Systems keeps your color's hue and adjusts its lightness until it passes.
- **Use a larger size.** Light gray might pass at 3:1 for a big heading but not for body text.

## What a ratio cannot tell you

- **Thin fonts.** A very thin weight can pass the ratio and still be hard to read.
- **Color blindness.** Red on green can pass the ratio and still be confusing[^5]. See [Accessibility basics](#/guide/accessibility-basics).
- **Text over images.** The ratio is only meaningful against a known solid color. Add a scrim (a semi-transparent overlay fill) or solid panel behind the text.
- **Disabled controls.** WCAG does not require contrast for disabled ("inactive") controls[^1], but people still need to find them. Aim for readable anyway.

> **Rule of thumb.** Aim a little above the minimum, for example 5:1 for body text. Screens, sunlight and aging eyes all reduce real-world contrast.

## Where to read more

- In this database: [axe DevTools](#/entry/axe-devtools), [WAVE Evaluation Tool](#/entry/wave-evaluation-tool) and [Dark Reader](#/entry/dark-reader) — browser extensions for automated contrast checks and a dark-mode preview.

[^1]: Web Content Accessibility Guidelines (WCAG) 2.2 — W3C. https://www.w3.org/TR/WCAG22/ . Accessed 2026-11-14. (Contrast ratio definition, relative luminance including the 0.04045 cut-off, SC 1.4.3 and 1.4.6 thresholds, large-scale text = 18 pt / 14 pt bold, SC 1.4.11 non-text contrast, inactive UI components exempt.)
[^2]: Understanding Success Criterion 1.4.3: Contrast (Minimum) — W3C WAI. https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html . Accessed 2026-11-14. ("The computed values should not be rounded (e.g., 4.499:1 would not meet the 4.5:1 threshold).")
[^3]: WebAIM: About — WebAIM, Utah State University. https://webaim.org/about/ . Accessed 2026-11-14.
[^4]: Contrast Checker — WebAIM. https://webaim.org/resources/contrastchecker/ . Accessed 2026-11-14.
[^5]: Color vision deficiency — MedlinePlus Genetics, U.S. National Library of Medicine. https://medlineplus.gov/genetics/condition/color-vision-deficiency/ . Accessed 2026-11-14.
[^6]: Relative luminance — W3C WAI GL wiki. https://www.w3.org/WAI/GL/wiki/Relative_luminance . Accessed 2026-11-14. (History of the 0.03928 to 0.04045 correction.)
