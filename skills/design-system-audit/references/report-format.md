# audit-report.md

Keep it under 120 lines. Order:

1. **Summary** (5 lines): what was audited, date, depth, counts of errors / warnings / notes, and what was NOT checked.
2. **Fix first** (up to 5): each is `severity | rule | where | what is wrong | the fix`. Accessibility before drift.
3. **Findings by rule**: one block per rule from the script: count, up to 3 examples with file:line, and the single fix that clears most of them (for example "replace 14 hardcoded #2563eb with var(--primary)").
4. **Manual checks**: each check from `checks.md` that was run, with pass or fail and the evidence (file or token). List the checks that were skipped.
5. **Before and after** (only if fixes were applied): counts per rule from re-running with `--baseline`, plus the list of fixes the person declined or that were skipped.
6. **Next**: the next audit step or fix batch, in one line.

Never list a finding without a location. Never pad with advice that is not tied to a finding. Full detail stays in `audit-findings.json`.
- Output for a person is markdown (`audit-report.md`); output for another tool or a later re-run is the JSON from `--out`. Write both only when asked.
