---
id: accessibility-basics
title: Accessibility basics for designers
summary: The handful of accessibility habits that prevent most problems, with the standards behind them.
topic: Accessibility
level: Beginner
order: 3
---

Accessibility means people can use what you make regardless of ability, device or situation. About one in four adults in the United States lives with some kind of disability[^1], and anyone can be temporarily limited: a broken arm, bright sunlight, a noisy train[^7].

The shared standard is the **Web Content Accessibility Guidelines (WCAG)**. Most laws and procurement rules point to level **AA**[^2]. You do not need to memorize WCAG. A few habits cover most of it.

## 1. Color contrast

Text must stand out from its background. The measure is a ratio from 1:1 (no difference) to 21:1 (black on white)[^3].

| What | AA needs | AAA needs |
| --- | --- | --- |
| Normal text | 4.5:1 | 7:1 |
| Large text (24px, or 18.7px if bold, and up) | 3:1 | 4.5:1 |
| Icons, input borders, focus rings[^3] | 3:1 | 3:1 |

Read more in [Contrast and WCAG](#/guide/contrast-and-wcag).

## 2. Never use color alone

If red means "error" and green means "success", some people cannot tell them apart. Millions of people have some form of color vision difference[^4]. Add an icon, a label or a pattern.

## 3. Show focus

People who use a keyboard, switch or voice control move through a page one control at a time. They need to **see where they are**. Design a clear focus state for every interactive element[^3]. This is why the Design Systems checklist always asks for a Focus state.

## 4. Make targets big enough

Small buttons are hard for people with tremors, large fingers, or a bumpy bus ride. A common guide is **44 by 44 points** on touch screens (Apple[^5]) and **48 by 48 dp** on Android (Google Material[^6]). WCAG 2.2 sets a minimum of 24 by 24 CSS pixels[^3].

## 5. Write real text and labels

- Every form field needs a visible label. A placeholder is not a label because it disappears.
- Buttons should say what they do: "Save changes", not "Submit".
- Links should make sense out of context: "Read the pricing guide", not "Click here".

## 6. Support zoom and text size

People enlarge text up to 200 percent or more[^3]. Do not lock layouts so tightly that text is cut off. Use relative units in code and leave room in your designs.

## 7. Design the order

Screen readers and keyboards follow the order of the page, not the visual layout[^3]. Think about reading order: heading first, then content, then actions.

## 8. Respect motion

Some animation can make people dizzy or sick. Keep it short, avoid large movement, and plan a calmer option for people who ask their device to reduce motion[^3].

> **A simple test.** Put your mouse away and try your design with only Tab, Shift+Tab, Enter, Space and the arrow keys. Can you reach and use everything? Can you always see where you are?

## Where to go next

- [Contrast and WCAG](#/guide/contrast-and-wcag)
- Every component in **Browse** lists its role, keyboard behavior and focus notes under Accessibility.

## Where to read more

- In this database: [axe DevTools](#/entry/axe-devtools), [WAVE Evaluation Tool](#/entry/wave-evaluation-tool), [Animation Policy](#/entry/animation-policy) and [MotionBlock](#/entry/motionblock) — browser extensions for automated accessibility audits and testing a page with motion reduced or removed.

[^1]: Disability Impacts All of Us (press release) — Centers for Disease Control and Prevention. https://archive.cdc.gov/www_cdc_gov/media/releases/2018/p0816-disability.html . Accessed 2026-11-14. (About 1 in 4 US adults, 61 million, live with some kind of disability.)
[^2]: Nondiscrimination on the Basis of Disability; Accessibility of Web Content and Mobile Apps (final rule) — U.S. Department of Justice. https://www.ada.gov/resources/2024-03-08-web-rule/ . Accessed 2026-11-14. (WCAG 2.1 Level AA is the technical standard.) See also Section 508 — U.S. General Services Administration. https://www.section508.gov/manage/laws-and-policies/ . Accessed 2026-11-14.
[^3]: Web Content Accessibility Guidelines (WCAG) 2.2 — W3C. https://www.w3.org/TR/WCAG22/ . Accessed 2026-11-14. (Contrast ratio range; SC 1.4.3 and 1.4.6 thresholds; large-scale text = 18 pt / 14 pt bold, which is 24px and about 18.7px at 96 dpi; SC 1.4.11 non-text contrast 3:1; SC 1.4.4 resize to 200%; SC 2.4.7 focus visible; SC 2.5.8 target size 24x24 CSS px; SC 2.3.3 animation from interactions.)
[^4]: Color vision deficiency — MedlinePlus Genetics, U.S. National Library of Medicine. https://medlineplus.gov/genetics/condition/color-vision-deficiency/ . Accessed 2026-11-14.
[^5]: Buttons — Apple Human Interface Guidelines. https://developer.apple.com/design/human-interface-guidelines/buttons . Accessed 2026-11-14. (Hit region of at least 44x44 pt.)
[^6]: Designing: Accessibility — Google Material Design 3. https://m3.material.io/foundations/designing/structure . Accessed 2026-11-14. (Touch targets of at least 48x48 dp, about 9 mm.)
[^7]: Inclusive design — Microsoft. https://inclusive.microsoft.design/ . Accessed 2026-11-14. (Situational limitations: the design insight behind "a broken arm, bright sunlight, a noisy train".)
