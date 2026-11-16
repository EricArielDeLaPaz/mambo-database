---
name: design-system-audit
description: Audits an existing design system or UI codebase for drift and accessibility problems, then produces a prioritized fix list. Works on a code folder, a tokens file (JSON or CSS) or a Figma file. Use when asked to audit, review, lint, check or clean up a design system, tokens or styles, or /design-system-audit.
---

# Design system audit

Measure with scripts, judge with the checklist, report briefly, and fix only what the person approves.

## Start
1. Read `references/shared-protocol.md` (first-run check, how to ask, progress file, research handoff, closing format, token rules).
2. If `progress.md` exists, ask: continue or start over.
3. Ask one call, up to 3 questions:
   - **What are we auditing?** (header "Source"): "A code folder" / "A tokens file (JSON or CSS)" / "A Figma file" / "A Mambo Database export".
   - **How deep?** (header "Depth"): "Quick scan (Recommended)" = scripts only; "Full audit" = scripts plus the manual checklist; "Compare to a reference system" = also research how Material, Carbon, Polaris or similar handle the same thing (use the research handoff).
   - **What should I do with the findings?** (header "Output"): "Report only (Recommended)" / "Report and a fix list" / "Report and apply fixes after I approve".
4. Ask for the path, tokens file or Figma link in plain chat. Do not guess paths.

## Steps (do one, write its output, close with the shared shape, wait)
1 Scope -> 2 Measure -> 3 Judge -> 4 Report -> 5 Fix (only if chosen).
- **Measure**
  - Code folder: `node scripts/audit.js code <folder> [--tokens <tokens file>] --out audit-findings.json` (on a re-run add `--baseline <earlier audit-findings.json>` to see before and after)
  - Tokens file or Mambo export: `node scripts/audit.js tokens <file>`
  - Figma: read `references/figma-audit.md`, then run the pairs it produces through `node scripts/contrast.js`.
  Never read the whole codebase to find these things; the scripts do it. Open a file only to confirm one finding.
- **Judge** (Full audit and Compare only): read `references/checks.md` and work through the checks the scripts cannot do (naming, component states, documentation, a11y behavior). Sample at most 5 components. Say what you did not check.
- **Report**: read `references/report-format.md` and write `audit-report.md`. In chat show at most 10 lines: counts, the top 3 problems, and the path.
- **Fix**: change the smallest thing that fixes each finding (swap hex for the matching `var(--token)`, move spacing to the nearest scale step, restore a focus style). Never lower a contrast bar; change the color. Re-run the script and report before and after counts. Do not touch anything the person did not approve.

## Rules
- Report only what a script or a file you opened shows. Every finding has a file and line, or a token name.
- Rank by harm: accessibility errors first, then token drift, then consistency, then nice-to-haves.
- Do not call a result "compliant" or "accessible". Say which checks passed and which were not run.
- Ask before any fix. If research is needed, use the handoff in the shared protocol and require a source URL for every claim.
- The Mambo site is optional: for naming, roles and limits, point to https://ericarieldelapaz.github.io/mambo-database/ and the `create-design-system` skill.
