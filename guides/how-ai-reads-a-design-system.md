---
id: how-ai-reads-a-design-system
title: How AI reads a design system
summary: Why clear names, tokens and written rules make AI tools more useful, and how to prepare your own system.
topic: Design systems & AI
level: Intermediate
order: 10
---

AI assistants do not see your Figma file the way you do. They read **text**: names, values, descriptions and code. The clearer that text, the better the result.

## What an AI tool can use

| Source | What it learns |
| --- | --- |
| Tokens (colors, spacing, type, radius) | The exact values and what each is for |
| Component descriptions | When to use it, when not to, and what it is called |
| States and variants | What needs to exist besides the default |
| Rules and limits | Maximum text length, minimum contrast, required labels |
| Code | How the component is actually built |

## Good inputs make good outputs

Compare two instructions.

- **Vague.** "Make a button that looks nice."
- **Clear.** "Use `color/primary` for the fill and `color/primary-text` for the label. Radius `radius-md`. Include hover, focus-visible, pressed and disabled states. The label needs 4.5:1 contrast."

The second one is possible only when your system is written down with names.

## Write tokens with meaning

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
- The site publishes an `llms.txt` file, a short index that AI tools can read to learn what is here.
- The [AI skills](#/guide/setting-up-the-skills) let an assistant search the whole database and run an interview before building a system.
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
