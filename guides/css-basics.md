---
id: css-basics
title: CSS basics for designers
summary: The box model, units, layout with flexbox (auto layout) and grid (layout grid), and design tokens (variables) as CSS variables, explained with the Figma ideas you already know.
topic: HTML & CSS
level: Beginner
order: 6
---

CSS (Cascading Style Sheets) controls **how** HTML looks: color, type, spacing, layout.

### Think of a house

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
4. **Margin** (no direct Figma equivalent): space outside the box, pushing neighbors away. Figma has no margin, so designers often use gap in auto layout.

Most sites add `box-sizing: border-box`, which means a width of 200px includes padding and border. It matches how Figma sizes frames.

## Units

| Unit | Meaning | Use for |
| --- | --- | --- |
| `px` | A CSS pixel | Borders, fine detail |
| `rem` | Relative to the root font size (16px by default) | Type and spacing, so people who change their text size are respected |
| `%` | Share of the parent | Widths |
| `vh`, `vw` | Share of the screen height or width | Full-screen sections |

Tell engineers your type sizes in px, and they can convert: 18px is 1.125rem.

## Layout: flexbox (auto layout) and grid (layout grid)

**Flexbox** lays items in one direction. It is the same idea as Figma auto layout.

```css
.row {
  display: flex;
  gap: 16px;
  align-items: center;
  justify-content: space-between;
}
```

**Grid** lays items in rows and columns at once, like a layout grid.

```css
.cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}
```

## Responsive design

Media queries change the rules at certain widths.

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

`:hover` is the mouse over it, `:focus-visible` is keyboard focus, `:disabled` is unavailable. Each state you list in Design Systems becomes rules like these. In house terms, it is how the light switch looks when you hover over it, and the glow of the lamp once it is on.

## Variables are design tokens (Figma variables)

```css
:root {
  --color-primary: #1d4ed8;
  --space-2: 8px;
  --radius-md: 8px;
}
.button { background: var(--color-primary); padding: var(--space-2); }
```

Variables in CSS are the same idea as Figma variables. Change one value and everything using it updates. Use matching names in design and code. See [Hand-off for engineers](#/guide/handoff-for-engineers).
