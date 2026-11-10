---
id: html-basics
title: HTML basics for designers
summary: How a web page is structured, the elements you will meet most, and why choosing the right one matters for accessibility and hand-off.
topic: HTML & CSS
level: Beginner
order: 5
---

HTML (HyperText Markup Language) describes **what things are** on a page: a heading, a button, a list. CSS then decides how they look. Knowing HTML helps you name layers well, design the right states and talk to engineers.

## Elements, attributes and nesting

An element is a tag pair with content between them.

```html
<a href="/pricing" class="link">See pricing</a>
```

- `a` is the element (a link).
- `href` and `class` are **attributes**, extra information about the element.
- "See pricing" is the content.

Elements nest like boxes inside boxes. This is why Figma frames inside frames map well to HTML.

## The skeleton of a page

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

The `viewport` meta tag tells phones to use the real screen width (the frame width) instead of a zoomed-out desktop width.

- `head` holds information about the page. Visitors do not see it.
- `body` holds what they see.
- `lang="en"` tells screen readers which language to speak.

## Pick the element that matches the job

These are called **semantic** elements. They give meaning, free keyboard behavior and free accessibility.

| You are designing | Element | Why |
| --- | --- | --- |
| Something that does an action (save, open a menu) | `button` | Works with Enter and Space. |
| Something that goes somewhere | `a` (link) | Works with Enter and opens in new tabs. |
| Page title and sections | `h1` to `h6` | Screen reader users jump by headings. Use one `h1`. |
| Main navigation | `nav` | Announced as navigation. |
| A list of items | `ul`, `ol`, `li` | Announced as "list, 5 items". |
| A form field | `input`, `select`, `textarea` with `label` | The label is read with the field. |
| Data in rows and columns | `table` | Header cells are tied to their data. |
| Images | `img` with `alt` text | Alt text is what a screen reader reads. |

> **Common mistake.** A clickable `div` looks like a button but has no keyboard support and no role. Ask engineers to use a real `button`.

## Headings are an outline

Headings should nest in order: `h1`, then `h2`, then `h3`. Choose a heading level for its **meaning**, not its size. Size is the job of CSS. In your designs, name text styles for meaning (Heading 1, Heading 2) as well as size.

## Forms

```html
<label for="email">Email address</label>
<input id="email" type="email" autocomplete="email" required>
```

- `label` and `for` connect the words to the field.
- `type="email"` brings up the right keyboard on phones.
- `required` marks the field as needed.

## Why this helps with hand-off

When you know the elements, you can annotate designs clearly: "This is a button, not a link", "This list is a `ul`", "This image is decorative, so empty alt text".

Next: [CSS basics](#/guide/css-basics).
