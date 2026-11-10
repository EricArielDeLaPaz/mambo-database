---
id: accessibility-basics
title: Accessibility basics for designers
summary: The handful of accessibility habits that prevent most problems, with the standards behind them.
topic: Accessibility
level: Beginner
order: 3
---

Accessibility means people can use what you make regardless of ability, device or situation. About one in four adults in the United States lives with some kind of disability, and anyone can be temporarily limited: a broken arm, bright sunlight, a noisy train.

The shared standard is the **Web Content Accessibility Guidelines (WCAG)**. Most laws and procurement rules point to level **AA**. You do not need to memorize WCAG. A few habits cover most of it.

## 1. Color contrast

Text must stand out from its background. The measure is a ratio from 1:1 (no difference) to 21:1 (black on white).

| What | AA needs | AAA needs |
| --- | --- | --- |
| Normal text | 4.5:1 | 7:1 |
| Large text (24px, or 18.66px bold, and up) | 3:1 | 4.5:1 |
| Icons, input borders, focus rings | 3:1 | 3:1 |

Read more in [Contrast and WCAG](#/guide/contrast-and-wcag).

## 2. Never use color alone

If red means "error" and green means "success", some people cannot tell them apart. About 1 in 12 men has some form of color vision difference. Add an icon, a label or a pattern.

## 3. Show focus

People who use a keyboard, switch or voice control move through a page one control at a time. They need to **see where they are**. Design a clear focus state for every interactive element. This is why the Design Systems checklist always asks for a Focus state.

## 4. Make targets big enough

Small buttons are hard for people with tremors, large fingers, or a bumpy bus ride. A common guide is **44 by 44 points** on touch screens (Apple) and **48 by 48 dp** on Android (Google Material). WCAG 2.2 sets a minimum of 24 by 24 CSS pixels.

## 5. Write real text and labels

- Every form field needs a visible label. A placeholder is not a label because it disappears.
- Buttons should say what they do: "Save changes", not "Submit".
- Links should make sense out of context: "Read the pricing guide", not "Click here".

## 6. Support zoom and text size

People enlarge text up to 200 percent or more. Do not lock layouts so tightly that text is cut off. Use relative units in code and leave room in your designs.

## 7. Design the order

Screen readers and keyboards follow the order of the page, not the visual layout. Think about reading order: heading first, then content, then actions.

## 8. Respect motion

Some animation can make people dizzy or sick. Keep it short, avoid large movement, and plan a calmer option for people who ask their device to reduce motion.

> **A simple test.** Put your mouse away and try your design with only Tab, Shift+Tab, Enter, Space and the arrow keys. Can you reach and use everything? Can you always see where you are?

## Where to go next

- [Contrast and WCAG](#/guide/contrast-and-wcag)
- Every component in **Browse** lists its role, keyboard behavior and focus notes under Accessibility.
