---
name: token-sync
description: Compares design tokens in a Figma file with tokens in code (CSS custom properties or W3C JSON), shows what drifted, and applies approved fixes. Use when asked to sync, compare, diff or reconcile Figma variables with code, check that Figma and CSS match, or /token-sync. Works for vibe-coded CSS too.
---

# Token sync

Compare with a script, decide with the person, change only what they approve.

## Start
1. Read `references/shared-protocol.md` (first-run check, how to ask, progress file, closing format, token rules).
2. If `progress.md` exists, ask: continue or start over.
3. Ask one call, up to 3 questions:
   - **Which side is the source of truth?** (header "Truth"): "Figma (Recommended)" / "Code" / "Decide per difference".
   - **Where are the code tokens?** (header "Code"): "A CSS file" / "A W3C tokens JSON file" / "Paste them here".
   - **Where do the Figma variables come from?** (header "Figma"): "Read them with the Figma connector (Recommended)" / "I will paste or attach an export".
4. Ask for the path or Figma link in plain chat. Do not guess paths.

## Steps (one at a time, close with the shared shape, wait)
1 Read -> 2 Compare -> 3 Decide -> 4 Apply -> 5 Verify.
- **Read:** read `references/formats.md`. Save the Figma variables as `figma-variables.json` in the shape shown there. With the connector, read them once; do not paste them into chat. State how many variables and modes you read, and whether anything was skipped (for example a collection you could not read).
- **Compare:** `node scripts/sync.js diff figma-variables.json <code file> --out changes.json`. Never compare by eye. In chat show the script's summary only.
- **Decide:** for each difference the truth side wins, unless the person decides otherwise. Rules:
  - `value-mismatch`: take the source-of-truth value. If the truth is Figma, the code changes (`set-code`). If the truth is code, the Figma variable changes (do it in Figma, step 4).
  - `missing-in-code`: add to code, or delete from Figma if it is unused. Ask.
  - `missing-in-figma`: add the variable in Figma, or remove it from code if it is dead. Ask.
  - `possible-rename`: same value, different name. Ask which name wins; never rename silently.
  Ask in batches (one question call per kind). Set `"approve": true` in `changes.json` only for what the person agreed to.
- **Apply:** code side: `node scripts/sync.js apply changes.json --code <file.css> --dry`, show the count, then run it without `--dry`. For a JSON code file, make the edits by hand from `changes.json`. Figma side: use the Figma connector (load its Figma-writing skill first if one is listed), change only approved variables, and keep a list of what changed.
- **Verify:** run `diff` again and report before and after counts. Remaining differences must be ones the person chose to keep.

## Rules
- Report only what the script printed. Say what was not compared (styles, components, anything outside variables and custom properties).
- Compare in every mode: Light and Dark (the script maps a Figma mode whose name contains "dark" to dark).
- Colors compare as hex, `rem` as 16px. If a value cannot be normalized the script compares text; say so.
- Both sides pointing at the same token (alias to alias) are not a difference; fix the target token.
- Never change anything on either side without approval. Never delete a token because it looks unused; search for it first or ask.
- If a color pair changes, re-check contrast with the `design-system-audit` skill's `scripts/contrast.js` before applying.
