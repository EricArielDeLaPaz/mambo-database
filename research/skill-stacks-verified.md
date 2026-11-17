# Skill stacks: Matt Pocock, Addy Osmani, pstack (verified from shallow clones, Claude, 2026-11-16)

Method: `git clone --depth 1`; counted SKILL.md lines, read descriptions, headings and the skills that matter for building front ends. No Hermes output used.

## Matt Pocock: https://github.com/mattpocock/skills (MIT, plugin 1.3.2)
- 40 SKILL.md files in `skills/engineering` (20), `productivity` (7), `misc` (4), `in-progress` (8), 7 to 170 lines each (most under 140). Several skills are 7 to 17 line stubs that just call another skill (`grill-with-docs`, `grill-me`, `implement`).
- Flow: `grill-with-docs` (interview, writes glossary and ADRs) -> `to-spec` (synthesize, no interview, publish to tracker) -> `to-tickets` (tracer-bullet tickets with blocking edges) -> `implement` or `implement-spec` (task graph, fresh subagent per ticket in its own worktree, merger subagent, then `code-review`) -> `tdd` at pre-agreed seams.
- Worth borrowing: spec to tickets as a task graph with a "frontier" of ready tickets; agree test seams before writing tests; fresh context per unit of work and communication by context pointers (paths), not copied text; two-axis review (Standards and Spec); `disable-model-invocation: true` on skills that should only run when called; `setup-*` skill that configures a repo once; `writing-for-agents` (how to write skills).
- Not front-end specific: nothing about UI, tokens or accessibility.

## Addy Osmani: https://github.com/addyosmani/agent-skills (MIT)
- 24 skills in `skills/` (192 to 400 lines each), plus `agents/` (code-reviewer, security-auditor, test-engineer, web-performance-auditor), `commands/` (build, spec, planning, review, ship, test and others), `hooks/`, `references/` (accessibility, performance, security, testing, definition-of-done checklists), `evals/` and `docs/skill-anatomy.md`.
- Anatomy it prescribes: frontmatter with what plus "Use when", then Overview, When to Use, Process, Common Rationalizations, Red Flags, Verification. Description limit 1024.
- Front-end: `frontend-ui-engineering` (346 lines): verify with what the project has, component architecture, design system adherence, "Avoid the AI aesthetic" table, spacing/type/color rules, WCAG 2.1 AA, loading and transitions, rationalizations, red flags, verification checklist (320/768/1024/1440, states, axe). Also `incremental-implementation` (vertical slices, scope discipline, rollback-friendly), `spec-driven-development`, `planning-and-task-breakdown`, `browser-testing-with-devtools`, `performance-optimization`, `code-review-and-quality`, `constraint-driven-development` (written quality bar agents may not lower).
- Worth borrowing: rationalizations and red-flags tables, a verification checklist as the last section, referencing shared checklists, "say which checks you could not run".

## pstack: Lauren Tan (poteto)'s stack. Original repo not found at github.com/poteto/pstack by name; verified the MIT port https://github.com/michael-denyer/pstack-claude (README: port of Lauren Tan's Cursor pstack; also includes MIT-licensed imports from Cursor)
- About 60 skills under `plugins/pstack/skills`, 6 to 175 lines. Router: `poteto-mode` (175) routes a goal to a playbook; `setup-pstack` configures models per role. Roles: `architect` (sketch types and signatures before code), `how`/`why`, `arena` (N parallel candidates, graft the best), `swarm`, `interrogate` (adversarial review), `babysit` (drive PR to mergeable), `deslop`, `no-comments`, `show-me-your-work` (decision log), `create-verification-skill` (project skill that drives the app as a user does), `correct` (make repeated agent mistakes impossible by architecture, types or lint), and about 25 one-page `principle-*` skills (prove it works, fix root causes, subtract before you add, test behavior, never block on the human for reversible work, build the lever, exhaust the design space for novel UI).
- No UI or front-end skill in the list I read, other than `principle-exhaust-the-design-space` (build 2 to 3 competing prototypes for a novel interaction) and `principle-experience-first`.
- Worth borrowing: principles as tiny single-purpose skills; "prove it works against the real artifact"; encode repeated corrections as lints; project-local verification skill.

## What Mambo took from this (applied in `design` and `code`)
| Idea | Source | Where |
|---|---|---|
| Machine-checkable handoff with slices and blocking edges, ready "frontier" | Pocock to-tickets, implement-spec | `design/scripts/handoff.js`, `handoff.json` |
| Vertical slices, scope discipline, simplicity first | Addy incremental-implementation | `code/references/build-rules.md` |
| Rationalizations and red flags tables, AI-look table | Addy frontend-ui-engineering | same |
| Verification checklist, say what was not run | Addy, pstack prove-it-works | `code/references/verify.md` |
| Two-axis review (Spec and Standards) | Pocock code-review | verify step 5 |
| Handoff wins over taste; ask or note assumptions | pstack never-block-on-the-human (reversible) | `code/SKILL.md` Rules |

## Not adopted
Subagent-per-ticket orchestration and worktrees (needs a harness Mambo users may not have; revisit), issue-tracker publishing, TDD-first (the code skill tests at the screen level and says what is untested), Pocock's `disable-model-invocation` (Claude.ai skills may not honor it).

## Not verified
Lauren Tan's original repo; pstack's `playbooks` content beyond the README; whether Addy's evals actually pass.
