---
id: handoff-for-engineers
title: Hand-off: what engineers need from you
summary: A practical checklist for clean design hand-off, covering states, spacing, tokens (variables), responsive behavior, content and accessibility.
topic: Hand-off
level: Intermediate
order: 7
---

Good hand-off means an engineer can build your design without guessing. Most delays come from missing information, not hard code.

## The checklist

### 1. Every state
For each interactive component, design or describe: default, hover (desktop only), focus, pressed, disabled, loading and error. Mobile has no hover, so skip it there. See the state row on any component in Browse.

### 2. Tokens (variables), not loose values
Use named styles and variables for color, type, spacing and radius. Use the same names the code uses, for example `color/primary`, `space/4`. In Design Systems, the export includes CSS and token files you can share.

### 3. Spacing on a scale
Pick a base unit, 4px or 8px, and use multiples (4, 8, 12, 16, 24, 32). Fewer values mean fewer decisions and less drift.

### 4. Responsive behavior
Show the small and large layouts, and say what changes between them: stack (switch to a vertical auto layout), hide, wrap (auto layout wrap), shrink. Name the widths where it changes.

### 5. Real content and limits
Show long names, empty lists, error messages and translations. Say the maximum lengths. Each component entry in Browse lists content limits for this reason.

### 6. Interaction and motion
Describe what happens on click, hover and after submit: where focus goes, what changes, how long it takes. Keep animations short and describe easing.

### 7. Accessibility notes
List the heading levels, reading order, label text, alt text and keyboard behavior. Mark which items are decorative. See [Accessibility basics](#/guide/accessibility-basics).

### 8. Assets
Name and export images and icons for the right format and sizes. See [Image formats](#/guide/image-formats) and [Icon types](#/guide/icon-types).

## Naming

Use plain, consistent names. A layer called `Button/Primary/Hover` beats `Rectangle 245`. Names in Figma, tickets and code should match as closely as possible.

## Talk early

Show engineers work in progress. Ask what is hard, what already exists in code, and what can be reused. Reusing an existing component is almost always faster than building a new variation.

## A short hand-off note template

```
What: Checkout page, mobile and desktop
States: default, focus, error, loading
Breakpoints: 390, 820, 1280
Tokens: from "Brand v2" file
Notes: error summary receives focus after submit
Open questions: should the promo field collapse?
```
