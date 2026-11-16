# AI skills for designers: landscape, people, optimization (Claude, 2026-11-15)

Replaces Hermes's earlier draft, which credited skills to repos that do not have them. Every claim below cites a page that was opened (page names in brackets). Search-result-only items are marked (listing only). Rankings are Claude's judgment, based on how often and how prominently a skill appears in Figma's and Snyk's lists; no page gives usage numbers.

## 1. Landscape (verified to exist)

Source key: [F] https://www.figma.com/resource-library/claude-skills-for-design/ · [S] https://snyk.io/articles/top-claude-skills-ui-ux-engineers/ · [A] https://playbooks.com/skills/anthropics/skills (16 skills in `anthropics/skills`: claude-api, frontend-design, theme-factory, skill-creator, algorithmic-art, docx, doc-coauthoring, internal-comms, pptx, webapp-testing, xlsx, brand-guidelines, pdf, slack-gif-creator, web-artifacts-builder, canvas-design; none is an icon, audit or docs-generator skill)

| # | Skill | What it does | Author / source |
|---|---|---|---|
| 1 | figma-use | Read and act on a Figma file: components, layers, variables, frames | Figma [F] |
| 2 | figma-generate-design | Build screens/components from your component library | Figma [F] |
| 3 | audit-design-system | Flags designs that drifted from the design system; read-only; checks missing shared components, local overrides, unbound tokens; JSON or markdown output | Chris Goebel, Edenspiekermann [F]; https://skills.sh/edenspiekermann/skills/audit-design-system (workflow section was collapsed, steps UNVERIFIED) |
| 4 | apply-design-system | Reconnects one-off elements to the right components and tokens | Chris Goebel [F] |
| 5 | frontend-design | Defines purpose, tone and constraints before generating UI; opinionated, pair with a design-system skill for internal tools | Anthropic [F][S] |
| 6 | figma-generate-library | Generates Figma components from a codebase to close gaps | Figma [F] |
| 7 | figma Code Connect | Writes `.figma.ts` templates mapping Figma components to code; needs Figma MCP, published components, Organization or Enterprise plan | Figma https://developers.figma.com/docs/figma-mcp-server/skill-figma-code-connect |
| 8 | sync-figma-token | Compares token values between Figma variables and code, flags divergence | Anish Karthik, Firebender [F] |
| 9 | web-design-guidelines | Audits UI code against 100+ rules (a11y, performance, UX), reports `file:line` | Vercel [S] |
| 10 | AccessLint | WCAG 2.1 A/AA: contrast-checker, refactor, use-of-color, link-purpose skills plus reviewer agent and MCP server (8 stars at time of article) | accesslint [S] |
| 11 | create-voice | Screen-reader specs (VoiceOver, TalkBack, ARIA) from Figma components | Ian Guisard, Uber [F] |
| 12 | rad-spacing | Applies spacing variables with fallback when no token matches | Nolan Perkins, Rad Collab [F] |
| 13 | icon-set-generator | Cohesive project-specific SVG icon sets from one style engine; Tessl review score 69; weaknesses: no fix-and-retry loop when an icon fails the consistency check, core action relies on an external reference file | jezweb https://tessl.io/registry/skills/github/jezweb/claude-skills/icon-set-generator/review |
| 14 | Designer Skills Collection | 63 skills + 27 commands in 8 plugins (research, systems, strategy, UI, interaction, prototyping/testing, design ops, toolkit); commands such as /discover, /strategize, /handoff chain skills | MC Dean https://marieclairedean.substack.com/p/i-built-63-design-skills-for-claude |
| 15 | cc-figma-component / cc-figma-tokens | Generate Figma components and token variables from one shared JSON spec | Nick Villapiano, One North [F] |
| 16 | UI/UX Pro Max | Searchable database of styles, palettes, font pairings, UX guidelines via a Python CLI (read the script before running) | nextlevelbuilder [S] |
| 17 | Vercel composition-patterns, react-best-practices | Component architecture; 57 React/Next performance rules | Vercel [S] (more engineer than designer) |

Not found: any verified `icon-creator`, `design-system-audit` (in `anthropics/skills`), `component-docs-generator`, `dark-mode-mapper`, `form-ux-auditor`, `design-critique-simulator` or `responsive-qa` as named by the earlier draft. UNVERIFIED, do not rely on them.

Security caveat from [S]: read SKILL.md and scripts and check `allowed-tools` before installing community skills; Snyk's ToxicSkills research found prompt injection and malicious payloads in the ecosystem; scanners can give false safety.

## 2. People and how they organize skills

- **Lauren Tan (poteto):** no primary source found (her own repo, blog or talk page). A community repo "lauren-poteto-rules" exists but states it is an independent adaptation, not her release (https://skillsllm.com/skill/lauren-poteto-rules). Its structure (one SKILL.md, eight sections: working with the human; evidence; repeatable verification; codebase as memory; durable constraints; supported path; evaluating rules and skills; scaling autonomy) must NOT be attributed to her. Her workflow is UNVERIFIED.
- **Anthropic Claude Code team:** skills fall into recurring types and the best fit one: Library/API reference, Product verification, Data fetching, Business-process automation, Code scaffolding, Code quality and review (list cut off). Skills are folders with scripts, assets and data, not just markdown; gotchas lists and saved logs across runs help. Source: https://weekly-digest.pages.dev/content/2033949937936085378 (excerpt only; a secondary digest, not Anthropic's page).
- **Addy Osmani:** keep CLAUDE.md/AGENTS.md near 200 lines (citing Anthropic guidance); keep descriptions specific (discovery shows names and descriptions within roughly 1% of context); put hard constraints in tests, hooks or permissions, not only prose; remove generic advice, code summaries and stale rules; test a removal by running a real task without local skills; audit every couple of weeks to monthly. Source: https://addyosmani.com/blog/audit-your-agent-files/
- **MC Dean (design skills):** favor structure over volume; give frameworks and decision criteria; model how a practitioner thinks; writing the skill exposed which expertise was essential vs habit. Organized as 8 plugins with commands that chain skills. Source: link in row 14.
- **Figma's list [F]:** skills come from many named designers and agencies (Edenspiekermann, Uber, Rad Collab, Firebender, One North), mostly Figma-connected.

## 3. Optimization rules (Anthropic's official authoring page)
Source: https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices
- `name` max 64 chars, lowercase/numbers/hyphens, no "anthropic" or "claude"; `description` non-empty, max 1,024 chars, third person, says what it does AND when to use it with trigger terms; vague descriptions fail because Claude picks one skill from possibly 100+.
- SKILL.md body under 500 lines; references one level deep; a table of contents on reference files over 100 lines; split by domain so unused context stays unloaded.
- Prefer scripts for deterministic work: more reliable and saves tokens; say whether to run or read the script; scripts must handle errors and document every constant; give specific, actionable validation errors.
- Match freedom to fragility (exact script for fragile steps, text for judgment). Give one default, not a menu.
- Use checklists and validate-fix-repeat loops; plan-validate-execute for risky batches.
- Build at least three evaluations before finishing, measure a baseline without the skill, write the minimum that passes; test with Haiku, Sonnet and Opus. The page says there is no built-in evaluation runner.
- Prefer gerund names (`processing-pdfs`); avoid `helper`, `utils`, `tools`.
- Other evidence: Tessl's review of icon-set-generator rewards progressive disclosure and trigger terms and penalizes missing retry loops and missing inline examples.

## 4. Where Mambo's skills stand against this
- Done already: short SKILL.md routers, references loaded per branch, scripts for contrast, picking and auditing, specific descriptions.
- Gaps found: (a) no evaluations exist for any Mambo skill (Anthropic asks for at least three each); (b) names are noun-style (`product`, `create-design-system`); fine but inconsistent with the gerund preference; (c) never tested on Haiku/Sonnet/Opus; (d) descriptions should be re-checked for third person and trigger terms; (e) audit skill lacked the Figma checks that Edenspiekermann's skill names (missing shared components, local overrides, unbound tokens), now added to `figma-audit.md`.

## 5. Per-skill detail for candidates to add (Mambo-fit, in priority order)
1. **design-system-audit for Figma (in progress, built):** why: designers need to catch drift before handoff. How to optimize: read-only; script the counts; JSON findings file plus a short markdown report; sample large files; say what was not checked. Mambo link: yes (roles, limits, 4-pt scale).
2. **apply-design-system / fix pass:** why: an audit without a fix path stalls. Optimize: plan-validate-execute with a `changes.json` the person approves; re-run the audit for before/after. Mambo link: yes (token names).
3. **token-sync (Figma variables vs code CSS/JSON):** why: values drift between Figma and code, especially when vibecoding. Optimize: script the diff of two token maps; the model only explains and proposes. Mambo link: yes (W3C export shape).
4. **icon-set creator:** why: designers need a cohesive custom set, not one-off icons. Optimize: one style spec (grid, stroke, corner rule), batch review checkpoints, a script that checks viewBox, stroke and fill consistency and a fix-and-retry loop (the gap in the reviewed skill). Mambo link: yes, compare to the 3,631 library icons first.
5. **accessibility-handoff (screen-reader and focus specs from components):** why: specs are routinely skipped. Optimize: template per component type, contrast via script. Mambo link: yes (component entries have accessibility fields).
6. **component-handoff-docs:** why: AI and developers need documented purpose per component. Optimize: generate from the Mambo component entry shape, not free-form. Mambo link: yes.

## 6. Shortlist to build next
1. Finish and test design-system-audit on a real Figma file and a real vibecoded CSS file.
2. token-sync, because it reuses the audit's token reader.
3. icon-set creator, because Mambo already holds icon data and criteria.
4. A fix-pass mode for the audit (item 2 above).
5. Add three evaluations per existing skill (Anthropic's page asks for them).

## Searched but not found or not opened
Lauren Tan's own materials; Figma's own audit page (blocked); Edenspiekermann skill workflow (collapsed); full text of Anthropic's "how we use skills" post (only a digest excerpt); usage or install counts for any skill.
