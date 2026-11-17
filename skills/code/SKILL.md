---
name: code
description: Builds the front end of a designed product from a design handoff, one vertical slice at a time, and checks each slice with scripts for tokens, contrast, states and accessibility before calling it done. Use after the design skill, when asked to build, code or implement screens from a handoff, a spec or a design system, or /code.
---

# Code the front end from the handoff

Build one thin slice, prove it works, then stop. The handoff is the spec; the scripts are the proof.

## Start
1. Read `references/shared-protocol.md` (first-run check, how to ask, progress file, closing format, token rules).
2. If `progress.md` exists, ask: continue or start over.
3. Find the handoff: the path the person gives, else `design/handoff`. Run `node scripts/handoff.js check <folder>`. Fix nothing silently: if it prints errors, say which, and send the person back to the `design` skill's handoff step (or fix the JSON only if they say so). No handoff at all: ask for a one-page brief and write a handoff yourself with the same format, then run the check.
4. Ask one call, up to 3 questions (skip any the handoff already answers):
   - **Stack** (header "Stack"): the handoff's `stack.framework` (Recommended) | Plain HTML, CSS and JS | React with Vite | Next.js. `unknown` must be asked. If `stack.repo` or an existing project is given, read its conventions first and follow them; do not change its stack.
   - **Scope** (header "Scope"): "First slice only (Recommended)" | "One slice at a time, I will say next" | "All slices, report at the end".
   - **Checks** (header "Checks"): "Scripts only (Recommended)" | "Scripts plus a browser check at 4 widths" (only if a browser tool exists).
5. Ask open questions from `openQuestions` that block the first slice, in one plain-chat message.

## Loop (one slice per pass)
1. **Pick:** `node scripts/handoff.js next <folder> --done <ids from progress.md>`. Take the first ready slice. Read only its screens' spec files and the tokens file.
2. **Plan in 5 lines:** files to add or change, the components reused from the design system, the tests or checks that will prove each acceptance line. Say which checks you cannot run.
3. **Build:** read `references/build-rules.md`, and `references/stacks.md` for the chosen stack. Tokens by name, every state in the screen spec, realistic content from the spec.
4. **Verify:** read `references/verify.md` and run it. A slice is done only when every acceptance line is shown true (name how) and the audit prints no errors.
5. **Record:** update `progress.md` (slice done, decisions with a one-line why, anything skipped), commit the slice if the project uses git and the person asked for commits, then close with the shared shape and wait (unless Scope said "All slices").

## Wrap-up
Write `code/README.md`: how to run it, what was built per slice, checks run with results, checks not run, open questions. Then say what to do first.

## Rules
- The handoff wins over your taste. If it is wrong or silent, ask or note an assumption in `progress.md`; do not quietly change it.
- Do not add a framework, library or build tool the handoff and project do not already use. Do not add features, screens or abstractions the slice does not need.
- Do not call work finished on "it renders". Finished means acceptance lines shown true and `audit.js` clean.
- Never lower a contrast or focus requirement to pass a check; change the color or restore the focus style.
- Use only what a script or file you opened shows when you report; say what you did not check.
