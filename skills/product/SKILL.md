---
name: product
description: Guides a person from zero to one on a new product. Asks the product type, proposes the steps that fit it (research, definition, design, build and launch) for the person to tick or untick, then works through the chosen steps one at a time and asks before any web research. Use when asked to plan, shape or build a new product, or /product.
---

# Build a product, 0 to 1

Ask first, work one step at a time, stop after every step.

## Start
1. Read `references/shared-protocol.md` (first-run check, how to ask, progress file, research handoff, closing format, token rules).
2. If `progress.md` exists, ask: continue or start over.
3. **Intake** (one question call, 4 questions):
   - Product type (header "Type"): Software app (SaaS or internal tool) | Mobile app | Marketplace or e-commerce | AI-powered product. Typed "Other" covers content sites and anything else; map it to the nearest type.
   - Audience: Customers | Internal staff | Both | Not sure.
   - Where are you now: Just an idea | Problem is validated | I have designs or a prototype | Already built, improving it.
   - Team: Solo | Small team | Larger team.
   Then ask in chat: the product name and one sentence on what it does and for whom.
4. Read `references/product-types.md`. It lists which steps are recommended, optional or skipped for this type, and how the "where are you now" answer changes the starting point.

## Choose the steps
Show the plan, then let the person tick or untick.
- **Call 1:** four multi-select questions, one per phase (Discovery, Definition, Design, Build and launch). Options are that phase's core steps. Mark the recommended ones "(Recommended)". The person selects the steps they want.
- **Call 2:** one multi-select question, "Anything specific to <type>?", with that type's extra steps.
- Without the question tool, print the plan as a checklist with the recommended steps pre-ticked `[x]` and let them reply with changes.
Write the chosen steps to `progress.md` in order. Steps not chosen are "skipped by choice"; the person can say "add <step>" at any time.

## Work through the steps
For each chosen step, in order:
1. Read only that phase's file: `steps-discovery.md`, `steps-definition.md`, `steps-design.md`, `steps-launch.md`, or `steps-extras.md`. Read only the card you need.
2. If the card says **Research: web**, run the research handoff (shared protocol, section 4) before doing anything else. Save results to `research/<topic>.md`.
3. Ask only the questions the card lists, in one call. Do the work.
4. Write the output to `product/NN-<step-id>.md` using the template below. Update `progress.md`.
5. Close with the shape in the shared protocol: what you did, the next step, then wait.

### Output template
```
# <Step name>
Product: <name> | Type: <type> | Date: <today>
## Summary (5 lines at most)
## Details (the sections the card lists)
## Assumptions and open questions
## Sources (only if research was used: a URL for every claim)
```

## Where the Mambo site is used
Only the design-related steps: the design system step hands off to the `create-design-system` skill, and the wireframe, UI, handoff and accessibility steps can use the Mambo Database (components, colors, typography, guides) at https://ericarieldelapaz.github.io/mambo-database/. The cards say which. Everything else is standalone.

## Wrap-up
When the last chosen step is done, write `product/README.md`: the list of outputs with one line each, the open questions, and the three riskiest assumptions. Then tell the person what to do first.

## Rules
- Never invent research. If a step needs facts you do not have, run the research handoff or mark it as an assumption.
- Do not start a step the person did not choose; offer it instead.
- Keep chat replies short; the files hold the detail.
