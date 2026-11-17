# Verify a slice

Run in this order. Put long output in `code/verify-<slice>.md`; show at most 10 lines in chat.

## 1. The project's own checks
Run what exists: build, type-check, lint, unit tests (single files while working, the whole suite once at the end of the slice). Do not install tools only to verify. Report what ran and what did not exist.

## 2. Mambo audit (always)
`node scripts/audit.js code <source folder> --tokens <tokens file> --out code/audit.json` (on later slices add `--baseline code/audit.json`).
- Errors (contrast, focus, outline removed, hardcoded colors on a tokenized project) must be zero. Fix by changing the code, never the bar.
- Warnings (off-scale spacing, missing reduced-motion, no dark mode) are fixed unless the person accepts them; list the accepted ones in `progress.md`.
- For token pairs, `node scripts/contrast.js <fg> <bg>` checks any single pair.

## 3. Acceptance lines
For each line in the slice: say how it was shown true (test name, a command and its output, or the exact page action and result). A line you cannot show is reported as not verified, not as passed.

## 4. States and accessibility by reading
Open each screen file of the slice and tick every listed state against the code (search for the state's handling). Check keyboard order, focus visibility, labels and error text by reading the markup. If a browser tool exists and the person chose it, load the page at 320, 768, 1024 and 1440 pixels, check no horizontal scroll and no console errors, and look at a screenshot per width.

## 5. Two-axis review before closing
- **Spec:** does the code do what the screen file and acceptance lines say, nothing more?
- **Standards:** does it follow the project's conventions and the build rules (tokens, simplicity, no dead code)?
List findings by harm, fix them, re-run steps 2 and 3. Rank accessibility first.

## Report (in `code/verify-<slice>.md`)
Slice id; checks run and results; acceptance lines with how each was shown; not verified; assumptions; files changed.
