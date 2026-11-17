# Designer skills, verified from shallow clones (Claude, 2026-11-16)

Method: `git clone --depth 1` of each repo, then a script counted SKILL.md lines, read frontmatter, `##` headings, subfolders and the LICENSE file. Facts below are from the files, not from summaries. Date: 2026-11-16 (commit at clone time, not pinned).

| Repo | License file | Skills | SKILL.md lines | Support folders |
|---|---|---|---|---|
| https://github.com/Leonxlnx/taste-skill | LICENSE, MIT | 1 (`design-taste-frontend` 2.5.1) | 382 | references (2 files), scripts (13 .mjs/.html), library, assets; tests/ at repo root |
| https://github.com/jakubkrehel/skills | LICENSE, MIT | 14 (afk, better-accessibility, better-colors, better-interface, better-layout, better-typography, better-ui, better-writing, break, build-design, explain-interface, interface-review, state-machine, variant) | 84 to 166 | none |
| https://github.com/ibelick/ui-skills | LICENSE, MIT | 9 (baseline-ui, component-canvas, create-canvas, create-design-md, fixing-accessibility, fixing-metadata, fixing-motion-performance, improve-ui, ui-skills-root) | 60 to 255 | improve-ui has references/plan-template.md |
| https://github.com/edenspiekermann/skills | NO LICENSE FILE found | 3 (apply-design-system 221, audit-design-system 236, fix-design-system-finding 166) | 166 to 236 | none |
| https://github.com/vercel-labs/agent-skills | NO LICENSE FILE at repo root | 9 (composition-patterns, deploy-to-vercel, react-best-practices, react-native-skills, react-view-transitions, vercel-cli-with-tokens, vercel-optimize, web-design-guidelines 40 lines, writing-guidelines) | 40 to 354 | rules/ (3 skills), references/ (2), scripts/ (vercel-optimize) |

None of the 40 skills sets `allowed-tools` in its frontmatter.

## Where Hermes's `designer-skills.md` was wrong (checked against the clones)
- "~132 lines" for most skills: real counts range 40 to 354.
- ibelick skills `motion-ui`, `color-systems`, `typography-scale`, `layout-grid` do not exist in `ibelick/ui-skills`.
- Leonxlnx's "taste-skill-v1, v2-experimental, soft-skill, minimalist-skill, brutalist-skill, gpt-tasteskill, stitch-skill" are not in current `main` (one skill).
- Edenspiekermann has 3 skills, not 4; there is no `create-design-system` there. No LICENSE file, so "MIT (inferred)" is unsupported; treat the text as all rights reserved and learn from the ideas only.
- Jakub Krehel: the 14 skills are right and MIT is right.
- Firebender's `sync-figma-token` repo was not cloned or verified here.

## Patterns worth borrowing (each tied to a file)
1. Evidence before opinion. `better-interface` has sections "Evidence, not taste", "Require evidence", "Rank by user impact", "Prefer the cheaper fix", "Consolidate systemic findings", "Review without mutating by default", "Before you finish" (jakubkrehel/skills, skills/better-interface/SKILL.md, headings at lines 14 to 130).
2. Say what NOT to flag. `audit-design-system` has "What To Flag", "What Not To Flag" and "Evidence Standard" (good evidence: a plain frame where an instance belongs, raw values beside tokenized peers; weak evidence: "this looks custom") (edenspiekermann/skills, skills/audit-design-system/SKILL.md lines 53 to 98).
3. Choose output by consumer: JSON for machines, markdown for people ("Output Format Selection", same file line 12).
4. Reconstruct the local system, prove, then vet findings before reporting (`improve-ui`, ibelick/ui-skills).
5. Gate in a real browser: taste-skill ships a finish gate and checkers as scripts (gate.mjs, consistency.mjs, copy-lint.mjs) and tests that frontmatter parses (tests/frontmatter.mjs notes that agents silently drop a skill whose YAML frontmatter fails to parse, for example an unquoted "word: word" in a description).
6. Ship as a plugin: `.claude-plugin/marketplace.json` lists skills with name, version, license, keywords.
7. Router-sized skills: Jakub's skills stay at 84 to 166 lines with no sub-folders; taste-skill uses 382 lines plus references and scripts. Both are under or near Anthropic's 500-line limit.

## Not adopted
- Taste-skill's size and framework defaults (React/Next, GSAP) and its website-only scope.
- Any Edenspiekermann or Vercel text (no license file found); ideas only.

## Applied to Mambo in this change
- Audit skill gained "What not to flag", an evidence standard, consolidation of systemic findings and ranking by impact (own wording).
- `evals/lint-skills.js` checks every skill's frontmatter (name, description length, YAML-hazard colons), SKILL.md length and reference depth.

## Not verified
Firebender sync-figma-token, MC Dean's collection, Lauren Tan, Figma's own skills (not cloned); license of Vercel's skills (no root file, a nested license may exist).
