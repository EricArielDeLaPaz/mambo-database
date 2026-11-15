---
id: html-basics
title: HTML basics for designers
summary: How a web page is structured, the elements you will meet most, and why choosing the right one matters for accessibility and hand-off.
topic: HTML & CSS
level: Beginner
order: 5
---

HTML (HyperText Markup Language) describes **what things are** on a page: a heading, a button, a list.[^1] CSS then decides how they look. Knowing HTML helps you name layers well, design the right states and talk to engineers.

## Think of a house

A website is a bit like a house. Each of the three web languages has its own job.

| Part of the house | Language | What it does |
| --- | --- | --- |
| The frame and rooms: walls, doors, which rooms exist | HTML | Structure. What is on the page and what each thing is. |
| Paint, furniture, lighting, decorating | CSS | Looks. How everything is styled and arranged. |
| Electricity and plumbing | JavaScript | Behavior. What happens when you flip a switch. See [JavaScript basics](#/guide/javascript-basics). |

This guide is about the frame. A house with no paint is still a house, and a page with no CSS is still a usable page.

## Elements, attributes and nesting

An element is a tag pair with content between them.[^2]

```html
<a href="/pricing" class="link">See pricing</a>
```

- `a` is the element (a link).
- `href` and `class` are **attributes**, extra information about the element.
- "See pricing" is the content.

Elements nest like rooms inside a house, and furniture inside rooms. This is why Figma frames inside frames map well to HTML.

## The skeleton of a page

Every page starts with a `<!DOCTYPE html>` line (the doctype). It tells the browser this is modern HTML, so the page renders the same everywhere.[^3]

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Page title</title>
  </head>
  <body>
    <header>...</header>
    <nav>...</nav>
    <main>...</main>
    <footer>...</footer>
  </body>
</html>
```

The `viewport` meta tag tells phones to use the real screen width (the frame width) instead of a zoomed-out desktop width.[^4]

- `head` holds information about the page. Visitors do not see it.[^5]
- `body` holds what they see.
- `lang="en"` tells screen readers which language to speak.[^6]

## Pick the element that matches the job

These are called **semantic** elements. They give meaning, built-in keyboard behavior and a baseline of accessibility.[^1]

| You are designing | Element | Why |
| --- | --- | --- |
| Something that does an action (save, open a menu) | `button` | Works with Enter and Space.[^7] |
| Something that goes somewhere | `a` (link) | Works with Enter. A link does not open a new tab unless you add `target="_blank"`.[^8] |
| Page title and sections | `h1` to `h6` | Use one `h1`, and nest the rest in order.[^9] |
| Main navigation | `nav` | Announced as navigation. |
| A list of items | `ul`, `ol`, `li` | Announced as a list, with its item count.[^10] |
| A form field | `input`, `select`, `textarea` with `label` | The label is read with the field.[^11] |
| Data in rows and columns | `table` | Header cells are tied to their data.[^12] |
| Images | `img` with `alt` text | Alt text is what a screen reader reads.[^13] |

> **Common mistake.** A clickable `div` looks like a button but has no keyboard support by default and no meaningful accessible role (implicit role: generic). Ask engineers to use a real `button`.[^14]

## Headings are an outline

Headings should nest in order: `h1`, then `h2`, then `h3`. Choose a heading level for its **meaning**, not its size. Size is the job of CSS, the paint.[^9] In your designs, name text styles for meaning (Heading 1, Heading 2) as well as size.

## Forms

```html
<label for="email">Email address</label>
<input id="email" type="email" autocomplete="email" required>
```

- `label` and `for` connect the words to the field.[^11]
- `type="email"` brings up the right keyboard on phones.[^15]
- `required` marks the field as needed.[^16]

## Why this helps with hand-off

When you know the elements, you can annotate designs clearly: "This is a button, not a link", "This list is a `ul`", "This image is decorative, so empty alt text".[^13]

Next: [CSS basics](#/guide/css-basics).

## Where to read more

[^1]: HTML: HyperText Markup Language — MDN Web Docs (Mozilla). https://developer.mozilla.org/en-US/docs/Web/HTML . Accessed 2026-11-14.
[^2]: Element — MDN Web Docs (Mozilla) Glossary. https://developer.mozilla.org/en-US/docs/Glossary/Element . Accessed 2026-11-14.
[^3]: Doctype — MDN Web Docs (Mozilla) Glossary. https://developer.mozilla.org/en-US/docs/Glossary/Doctype . Accessed 2026-11-14.
[^4]: <meta name="viewport"> — MDN Web Docs (Mozilla). https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/meta/name/viewport . Accessed 2026-11-14.
[^5]: <head> — MDN Web Docs (Mozilla). https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/head . Accessed 2026-11-14.
[^6]: global attribute lang — MDN Web Docs (Mozilla). https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/lang . Accessed 2026-11-14.
[^7]: Button pattern — W3C WAI ARIA Authoring Practices. https://www.w3.org/WAI/ARIA/apg/patterns/button/ . Accessed 2026-11-14.
[^8]: Link pattern — W3C WAI ARIA Authoring Practices. https://www.w3.org/WAI/ARIA/apg/patterns/link/ . Accessed 2026-11-14.
[^9]: Heading elements (<h1>–<h6>) — MDN Web Docs (Mozilla). https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/Heading_Elements . Accessed 2026-11-14.
[^10]: <ul> — MDN Web Docs (Mozilla). https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/ul . Accessed 2026-11-14.
[^11]: <label> — MDN Web Docs (Mozilla). https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/label . Accessed 2026-11-14.
[^12]: <th> — MDN Web Docs (Mozilla). https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/th . Accessed 2026-11-14.
[^13]: <img> — MDN Web Docs (Mozilla). https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/img . Accessed 2026-11-14.
[^14]: <div> — MDN Web Docs (Mozilla). https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/div . Accessed 2026-11-14.
[^15]: <input type="email"> — MDN Web Docs (Mozilla). https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input/email . Accessed 2026-11-14.
[^16]: required attribute — MDN Web Docs (Mozilla). https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/required . Accessed 2026-11-14.
