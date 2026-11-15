---
id: how-ai-reads-a-design-system
title: How AI reads a design system
summary: Why clear names, tokens (variables) and written rules make AI tools more useful, and how to prepare your own system.
topic: Design systems & AI
level: Intermediate
order: 10
---

AI assistants work from the text and data they are given, not the picture you see. They read **text**: names, values, descriptions and code. The clearer that text, the better the result.

## What an AI tool can use

| Source | What it learns |
| --- | --- |
| Tokens (variables: colors, spacing, type, radius) | The exact values and what each is for |
| Component descriptions | When to use it, when not to, and what it is called |
| States and variants | What needs to exist besides the default |
| Rules and limits | Maximum text length, minimum contrast, required labels |
| Code | How the component is actually built |

## Good inputs make good outputs

Compare two instructions.

- **Vague.** "Make a button that looks nice."
- **Clear.** "Use `color/primary` for the fill and `color/primary-text` for the label. Radius `radius-md`. Include hover, focus-visible, pressed and disabled states. The label needs 4.5:1 contrast[^2]."

The second one is possible only when your system is written down with names.

## Write tokens (variables) with meaning

Name by **role**, not by value.

| Weak | Better |
| --- | --- |
| `blue-500` used everywhere | `color-primary`, `color-link`, `color-focus` |
| `gray-light` | `color-surface`, `color-border` |
| `red` | `color-danger` |

If you rebrand, role names stay valid. An AI tool also understands "use the danger color for errors" and "use text on the surface color".

## Write down the rules

A component page that includes these is far easier for people and AI to follow:

1. What it is and when to use it.
2. When **not** to use it, and the better alternative.
3. Anatomy: its parts and which are required.
4. Variants and states.
5. Content limits (for example, a label of 24 characters or fewer).
6. Accessibility: role, keyboard behavior, focus.

Every component in Browse follows this shape.

## How Mambo Database helps

- Every entry exists as **Markdown** and **JSON**. Use "Copy as Markdown (for AI)" or "Copy JSON" to paste an entry into an assistant.
- The site publishes an `llms.txt` file, a short index that AI tools can read to learn what is here.[^1]
- The [AI skills](#/guide/setting-up-the-skills) walk an assistant through building a system step by step, and they write down what each token and component is for, so the next assistant (or person) can read it.
- Design Systems exports files your tools and engineers can both read, such as CSS variables and a README.

## Working with AI well

- **Give context.** Say who the product is for, the platform, the brand feel and the constraints.
- **Ask for reasons.** "Why this color for primary?" helps you learn and spot weak choices.
- **Check the work.** AI can sound sure and still be wrong. Verify contrast with a checker, check states in the browser and test with a keyboard.
- **Keep the judgment.** AI is good at drafts, variations and consistency. Taste, ethics and understanding real users stay with you.

## Try it

1. Create a system in Design Systems and give every color a clear role.
2. Export it.
3. Paste the README into an assistant and ask it to describe your system back to you. Anything it gets wrong shows where your documentation is unclear.

## Where to read more

The other claims in this guide describe this site and its repository (dist/llms.txt, the AI skills, the export files, the entry shape); they were verified against the repo itself on 2026-11-14 and need no outside sources.

[^1]: llms.txt — the site convention for a short, plain-text index of a site, written by its maintainers. https://llmstxt.org/ . Accessed 2026-11-14. (A community convention, not an official standard.)
[^2]: Web Content Accessibility Guidelines (WCAG) 2.2, Success Criterion 1.4.3 Contrast (Minimum) — W3C. https://www.w3.org/TR/WCAG22/#contrast-minimum . Accessed 2026-11-14.
