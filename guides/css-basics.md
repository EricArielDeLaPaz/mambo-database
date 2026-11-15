---
id: css-basics
title: CSS basics for designers
summary: The box model, units, layout with flexbox (auto layout) and grid (layout grid), and design tokens (variables) as CSS variables, explained with the Figma ideas you already know.
topic: HTML & CSS
level: Beginner
order: 6
---

CSS (Cascading Style Sheets) controls **how** HTML looks: color, type, spacing, layout.[^1]

## Think of a house

A website is a bit like a house. Each of the three web languages has its own job.

| Part of the house | Language | What it does |
| --- | --- | --- |
| The frame and rooms: walls, doors, which rooms exist | HTML | Structure. What is on the page and what each thing is. See [HTML basics](#/guide/html-basics). |
| Paint, furniture, lighting, decorating | CSS | Looks. How everything is styled and arranged. |
| Electricity and plumbing | JavaScript | Behavior. What happens when you flip a switch. See [JavaScript basics](#/guide/javascript-basics). |

This guide is about the decorating. The same house can be painted and furnished in a hundred ways without moving a single wall.

## How a rule is written

```css
.button {
  background: #1d4ed8;
  color: #ffffff;
  padding: 12px 20px;
  border-radius: 8px;
}
```

- `.button` is the **selector**: which elements to style (`.` means a class).
- Each line is a **property** and a **value**.

## The box model

Every element is a box with four layers, from inside out:

1. **Content**: the text or image.
2. **Padding**: space inside the box, around the content (like Figma padding).
3. **Border**: the line around the padding (like a Figma stroke).
4. **Margin** (no direct Figma equivalent): space outside the box, pushing neighbors away. Designers often use the gap in auto layout instead.[^2]

Most sites add `box-sizing: border-box`, which means a width of 200px includes padding and border.[^2] That is usually what you want.

## Units

| Unit | Meaning | Use for |
| --- | --- | --- |
| `px` | A CSS pixel | Borders, fine detail |
| `rem` | Relative to the root font size (16px by default)[^3] | Type and spacing, so people who change their text size are respected |
| `%` | Share of the parent | Widths |
| `vh`, `vw` | Share of the screen height or width[^3] | Full-screen sections |

Tell engineers your type sizes in px, and they can convert: 18px is 1.125rem. That only holds while the root font size stays 16px.[^3]

## Layout: flexbox (auto layout) and grid (layout grid)

**Flexbox** lays items in one direction. It is the same idea as Figma auto layout.[^4]

```css
.row {
  display: flex;
  gap: 16px;
  align-items: center;
  justify-content: space-between;
}
```

**Grid** lays items in rows and columns at once, like a layout grid.[^5]

```css
.cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}
```

## Responsive design

Media queries change the rules at certain widths.[^6]

```css
@media (max-width: 820px) {
  .cards { grid-template-columns: 1fr; }
}
```

Design at least a small and a large version, and tell engineers where the layout should change. Those are your **breakpoints** (the frame widths where the layout changes).

## States

```css
.button:hover { background: #1e40af; }
.button:focus-visible { outline: 3px solid #1d4ed8; outline-offset: 2px; }
.button:disabled { opacity: .5; }
```

`:hover` is the mouse over it[^7], `:focus-visible` is keyboard focus[^8], `:disabled` is unavailable[^9]. Each state you list in Design Systems becomes rules like these. In house terms: hover is the switch looking ready under your hand, focus-visible is the glow once it is flipped, and disabled is the switch that does nothing.

## Variables are design tokens (Figma variables)

```css
:root {
  --color-primary: #1d4ed8;
  --space-2: 8px;
  --radius-md: 8px;
}
.button { background: var(--color-primary); padding: var(--space-2); }
```

Variables in CSS are similar in spirit to Figma variables. Change one value and everything using it updates.[^10] Use matching names in design and code. See [Hand-off for engineers](#/guide/handoff-for-engineers).

## Where to read more

- In this database: [CSS Peeper](#/entry/css-peeper), [VisBug](#/entry/visbug), [WhatFont](#/entry/whatfont) and [Pesticide](#/entry/pesticide-without-hover-bar) — browser extensions for reading computed styles, measuring type and seeing the box-model outline of every element.

[^1]: What is CSS? — MDN Web Docs (Mozilla). https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Styling_basics/What_is_CSS . Accessed 2026-11-14.
[^2]: box-sizing — MDN Web Docs (Mozilla). https://developer.mozilla.org/en-US/docs/Web/CSS/box-sizing . Accessed 2026-11-14.
[^3]: <length> — MDN Web Docs (Mozilla). https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/length . Accessed 2026-11-14.
[^4]: Basic concepts of flexbox — MDN Web Docs (Mozilla). https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Flexible_box_layout/Basic_concepts . Accessed 2026-11-14.
[^5]: Basic concepts of grid layout — MDN Web Docs (Mozilla). https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Grid_layout/Basic_concepts . Accessed 2026-11-14.
[^6]: Using media queries — MDN Web Docs (Mozilla). https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_media_queries/Using_media_queries . Accessed 2026-11-14.
[^7]: :hover — MDN Web Docs (Mozilla). https://developer.mozilla.org/en-US/docs/Web/CSS/:hover . Accessed 2026-11-14.
[^8]: :focus-visible — MDN Web Docs (Mozilla). https://developer.mozilla.org/en-US/docs/Web/CSS/:focus-visible . Accessed 2026-11-14.
[^9]: :disabled — MDN Web Docs (Mozilla). https://developer.mozilla.org/en-US/docs/Web/CSS/:disabled . Accessed 2026-11-14.
[^10]: Using CSS custom properties (variables) — MDN Web Docs (Mozilla). https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Cascading_variables/Using_custom_properties . Accessed 2026-11-14.
