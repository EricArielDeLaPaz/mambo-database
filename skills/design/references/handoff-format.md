# Handoff format

`design/handoff/handoff.json` is the contract between the design skill and the code skill. Keep it small; the detail lives in the screen files.

```json
{
  "product": { "name": "Dog Walk", "type": "marketplace", "oneLine": "Book vetted dog walkers nearby" },
  "stack": { "framework": "react-vite", "styling": "css-tokens", "tests": "vitest", "repo": "" },
  "designSystem": { "path": "design-system", "tokens": "design-system/tokens.css" },
  "screens": [
    { "id": "home", "name": "Find a walker", "route": "/", "purpose": "Search walkers by area and date",
      "components": ["text-input", "button", "card"], "states": ["default", "loading", "empty", "error"],
      "spec": "screens/home.md" }
  ],
  "slices": [
    { "id": "s1-search", "title": "Search and see results", "goal": "A person can search and see walker cards",
      "screens": ["home"], "blockedBy": [],
      "acceptance": ["Typing an area and pressing Search lists at least 3 walkers", "Empty result shows a message and a way to widen the search"] }
  ],
  "openQuestions": ["Payment provider?"]
}
```

## Fields
- `stack.framework`: `html`, `react-vite`, `nextjs`, `vue`, `svelte`, or `unknown`. `unknown` makes the code skill ask. `repo` is a path when extending an existing project, else empty.
- `designSystem.tokens`: a CSS file of custom properties or a JSON tokens file. Optional but strongly recommended; the code skill audits against it.
- `screens[].components`: Mambo Database ids when one fits, else a plain name.
- `screens[].states`: only the ones that apply. A screen that loads data must list `loading`, `empty` and `error`; the check warns when it does not.
- `screens[].spec`: path relative to the handoff folder; the file must exist.
- `slices[].blockedBy`: ids of slices that must be done first. No cycles.
- `slices[].acceptance`: one line each, checkable by a person. At least one per slice.

## Screen file (`screens/<id>.md`), at most 60 lines
Purpose; layout (a labeled block outline, mobile first, then what changes at 768 and 1024); content with real example text and limits; per component: states, tokens by name, behavior; accessibility (roles, keyboard order, focus, labels, error text); data needed (fields and where they come from, or "static").

## Rules
- No value without a token name when a token exists. Say "color: text-secondary", not "#6b7280".
- No "TBD". Unknowns go to `openQuestions` and the person answers before the slice that needs them starts.
- Every claim about a number (limits, sizes) is either from the person or marked as an assumption in the screen file.
