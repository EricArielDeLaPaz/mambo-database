# Taste skill (Leonxlnx), verified notes (Claude, 2026-11-16)

Written after reviewing Hermes's `designer-skills.md`, which had unreliable parts (see end). Only facts from pages that were opened are listed.

## Repo facts
- Repo: https://github.com/Leonxlnx/taste-skill (Hermes named `taste-skill-classics`; the Tessl page for the repo does not mention a repo by that name: https://tessl.io/registry/skills/github/Leonxlnx/taste-skill).
- License: MIT, per the explainer https://mer.vin/2026/07/taste-skill-explained-anti-slop-agent-skills-for-ai-frontend-design/ (the Tessl page states no license; confirm in the repo's LICENSE file before reuse).
- Layout (explainer): `skills/` with `SKILL.md` files, `CHANGELOG.md`, `examples/`, `research/laziness/` (a corpus on LLM output truncation that informs the `full-output-enforcement` skill and is not needed at install).
- The core `skills/taste-skill/SKILL.md` is about 900 lines (explainer). Anthropic's authoring page asks for a body under 500 lines (https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices), so this is a different philosophy: one big opinionated file, not a router with references.
- 13 installable variants (explainer): code skills (design-taste-frontend, design-taste-frontend-v1, gpt-taste, image-to-code, redesign-existing-projects, high-end-visual-design, minimalist-ui, industrial-brutalist-ui, full-output-enforcement), a DESIGN.md skill (stitch-design-taste), image skills (imagegen-frontend-web, imagegen-frontend-mobile, brandkit).
- Three dials, 1 to 10: DESIGN_VARIANCE default 8, MOTION_INTENSITY default 6, VISUAL_DENSITY default 4.
- Encodes: banned "AI tells" (em-dashes, section-number eyebrows in heroes, fake div-based UI chrome, fake screenshots), WCAG-checked button contrast, no scroll listeners in React state, preferred icon sets (Phosphor, HugeIcons, Radix, Tabler; Lucide discouraged), a default stack (Next.js, Tailwind v4, motion/react, isolated GSAP components).
- Out of scope per its own docs: dashboards, data tables, native mobile, realtime collaboration UIs. Install: `npx skills add https://github.com/Leonxlnx/taste-skill` (Vercel agent-skills CLI).
- Versioning: v2 experimental, no releases or tags; the changelog and `main` are the reference.

## What Mambo can learn (judgment, not from a source)
- Anti-pattern lists and a small number of numeric dials give the model a way to be opinionated without long prose.
- Mambo's skills are routers with scripts; taste-skill is the opposite. For design quality (not process), an opt-in "design taste" reference inside a Mambo skill could carry a short banned-patterns list and exact values, loaded only when the person asks for visual polish.
- Not adopted: 900-line single files, framework-specific defaults (Next.js, GSAP).

## Problems found in Hermes's `designer-skills.md` (do not rely on it)
- Nearly every skill lists "~132 lines" for SKILL.md, which cannot be true (taste-skill's core file is about 900 lines).
- Its header says 12,847 bytes; the file on disk was about 25 KB.
- It says "License: MIT (inferred from GitHub default)" for several repos; GitHub has no default license, so that is not evidence.
- "Testing" fields are generic ("pre-flight check matrix", "visual verification") with no source.
- Repo names were not checked against the repos (Leonxlnx's repo name is wrong).
- Some descriptions match real pages (for example the Figma list entries), so parts are usable only after opening the source.

## Problems found in Hermes's `icon-design.md` (do not rely on it)
- The five icon systems are described with near-identical text ("1.5px base stroke at 24x24, corners about 2-3px, no padding"), which is a template, not research. Its own Tabler line also contradicts it ("stroke=2 for standard").
- Naming claims such as Material "mdi-" prefixes belong to a different project (Material Design Icons community library).
- "Lucide CLI: `npx lucide --lint`" and "Tabler lint" were not verified to exist.
- No claim has a deep link; the references are landing pages.
- The icon-set-creator defaults (24 grid, padding 2, stroke 2) stay as Mambo working defaults.
