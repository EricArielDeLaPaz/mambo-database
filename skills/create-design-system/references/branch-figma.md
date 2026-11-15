# Branch: the design system is already in Figma

The goal is to understand it, close gaps, and write down what each part is for. Read `decisions.md` when you check gaps, `components-and-icons.md` if components are missing, and `output-formats.md` at the end.

## Step 1. Connect
Ask in chat for the Figma file link. If a Figma connector is available, use it. If not, say so and ask for one of: the variables exported as JSON, screenshots of the styles and component pages, or a pasted list of variables and component names. Do not ask for the whole file.

## Step 2. Read lightly (this is where tokens go)
Read in this order and stop when you have enough:
1. Variable collections, modes (for example Light and Dark) and values.
2. Text styles, effect styles (shadows) and grid or spacing variables.
3. Component names, variant properties and descriptions. Names and properties only; do not read every component's full layers.
4. Code Connect mappings, if any.
Hand very large files to a cheaper agent with a brief (shared protocol, section 4). Save findings to `design-system/figma-audit.md`; keep a summary of at most 150 words in the conversation.

## Step 3. Report gaps (one table)
Compare what exists with this checklist and show only the rows that need attention:
- Color roles named by role (not `blue-500`), counts inside the limits in SKILL.md, a value for every theme.
- Contrast: run `node scripts/contrast.js` on every text/background and UI pair in each theme.
- Type: at most 2 typefaces, 3 weights, a scale with line heights, body at 16px or larger.
- Spacing on the 4-point scale; radius, elevation and motion defined.
- Components: states present (default, hover on pointer devices, focus, pressed, disabled, error where it applies), 44px touch targets, descriptions written.
- Descriptions: every variable and component says what it is for.
**Close the step.**

## Step 4. Decide
Ask (multi-select): Document everything (what each token and component is for) | Fix contrast and naming gaps | Add missing components from the Mambo Database | Export tokens and CSS. Do only what is ticked.

## Step 5. Do it
- Documentation: write a description for each variable and component (role, when to use, when not to). Use the shapes in `output-formats.md`.
- Fixes: propose each change as old value -> new value with the new ratio. Ask before writing anything into Figma; otherwise write files only.
- Missing components: follow `components-and-icons.md`, then build the Figma handoff from each component's markdown (`entries/components/<id>.md`: states, device variants, static frame, values used).
**Close the step.**

## Step 6. Export
Write `README.md`, `tokens.json` and `tokens.css` from the final values (`output-formats.md`). **Close the step.**
