# Mambo Database — AGENTS.md

## Overview
The **Mambo Database** is an open, structured library of UI components, color sets, and typefaces with verified pairings. It is built for two audiences:

* **Designers** – to browse curated components, pull ready‑made token sets, and access guides for building design systems.
* **AI Agents** – to query structured data (JSON entries, `llms.txt`, `library.json`) so that tools such as Hermes can generate better, tailored design systems based on user needs.

## Data Model

### Entry Format
Each component or token set lives as a JSON file under `entries/`. Example: `entries/components/button.json`.

Required fields (per `schema/component.schema.json`):
- `id` – unique identifier
- `name` – human‑readable name
- `description` – short description
- `category` – e.g. `components`, `colors`, `typography`
- `tokens` – design‑token map (colors, typography, spacing)
- `contrastRatio` – auto‑computed; must meet WCAG AA for normal text
- `metadata` – source, license, designer, last‑updated

Optional fields:
- `previewImage` – relative path to a preview image under `icons/`
- `variants` – array of variant configurations
- `accessibilityNotes` – any known a11y considerations

### Guides
Plain Markdown files under `guides/*.md`. Each guide needs a front‑matter block with:
- `id` – unique identifier
- `title` – guide title
- `summary` – 1‑2 sentence overview
- `topic` – e.g. `color`, `accessibility`, `component‑pattern`
- `level` – `beginner`, `intermediate`, `advanced`
- `order` – numeric ordering

Guides are the source for the “Guides” tab on the live site. Adding a new guide is as simple as creating a new `.md` file and running the build.

### Generated Output
Running `node scripts/build.js` produces:

| Output | Purpose |
|---|---|
| `dist/site/index.html` | Searchable site (open directly in a browser) |
| `dist/entries/**/*.md` | One small Markdown file per entry, for AI to read |
| `icons/` | Curated UI icons from free, commercially usable libraries, grouped by design system, with each library's license |
| `guides/*.md` (source) | The Guides tab. Add a file and rebuild |
| `dist/llms.txt` | Index for AI tools that read `llms.txt` |
| `dist/data/library.json` | All data in one file |
| `dist/skill/create-design-system/` | The `/create-design-system` skill: asks whether you have a design system in Figma, want one from the database, or start from scratch, then builds and documents colors, type, foundations, components and icons step by step |
| `dist/skill/design/` | The `/design` skill: asks the product type, proposes the steps to tick or untick, guides research, definition and design one step at a time, and ends with a checked build-ready handoff |
| `dist/skill/code/` | The `/code` skill: builds the front end from that handoff one vertical slice at a time and verifies each slice with the audit and contrast scripts |
| `dist/skill/design-system-audit/` | The `/design-system-audit` skill: audits a code folder, tokens file or Figma file with scripts (contrast, hardcoded colors, off-scale spacing, focus styles), then writes a prioritized report and optional fixes |
| `dist/skill/token-sync/` | The `/token-sync` skill: compares Figma variables with code tokens (CSS or JSON), shows drift per mode, applies approved changes |
| `dist/skill/icon-set-creator/` | The `/icon-set-creator` skill: reuses library icons first, then drafts custom SVG icons from one style spec, checking each batch with a script |
| `.github/workflows/pages.yml` | GitHub Pages deployment (push to `main` triggers rebuild & deploy) |

## How to Add / Update an Entry

1. **Copy an existing entry** – e.g. `entries/components/modal-dialog.json`.
2. **Edit the JSON** – modify `name`, `tokens`, `description`, add `accessibilityNotes` if needed. The schema validates required fields; the build script computes contrast ratios automatically.
3. **Run the build** – `node scripts/build.js`. This regenerates all output files and checks that all contrast ratios meet WCAG AA.
4. **Commit & push** – `git add`, `git commit -m "add modal-dialog entry"`, `git push`. The GitHub Action will rebuild the site.

## How to Query the Database from an AI Agent (e.g., Hermes)

### 1. Read the flat data file
- `dist/data/library.json` contains **every entry** in a single JSON object. Access it via `fetch('dist/data/library.json')` or read the file directly from the repo.

### 2. Read individual entries
- Each entry JSON is at `entries/<name>.json`. Example: `entries/components/button.json`.

### 3. Read the guide index
- `guides/` folder holds all human‑written guides. Open any `.md` file to see the front‑matter + body.

### 4. Use `llms.txt`
- `dist/llms.txt` is a simple text index that AI tools can parse quickly. It lists each entry’s `id`, `name`, and `topic`. Example line:
  ```
  button   components   UI component with accessible color tokens
  ```

### 5. Query pattern for design‑system generation
When building a design system for a new product:

1. **Fetch `library.json`** – get the full catalog.
2. **Filter by category** – e.g. `components` or `colors`.
3. **Select entries with suitable contrast ratios** – the JSON already contains `contrastRatio`; filter out anything below 4.5:1 for normal text.
4. **Pull token maps** – each entry’s `tokens` object contains color variables, typography scales, spacing scales. Merge them into your own design‑system JSON.
5. **Optionally reference guides** – pick a guide that matches the desired style (e.g., “color‑palette‑basics”) and follow its recommendations.

## Build & Development Workflow

| Step | Command | Description |
|---|---|---|
| Install | `npm i` (optional; the script has no external deps) | Not required – the build uses only Node 18+ built‑ins. |
| Build | `node scripts/build.js` | Generates all dist assets, validates schemas, computes contrast. |
| Serve locally | Open `dist/site/index.html` in a browser, or run a local `npx serve` | The site reflects the latest built output. |
| Add a guide | Create `guides/foo.md` with front‑matter, then `node scripts/build.js` | The guide appears on the live site after rebuild. |
| Update an entry | Edit `entries/*.json`, then `node scripts/build.js` | Contrast ratios and MD files update automatically. |

## Accessibility Guarantees
- All color entries have an automatically computed contrast ratio (WCAG AA for normal text, 3:1 for large text).
- The build script aborts if any entry fails the contrast check, preventing inaccessible tokens from being published.
- Guides include accessibility notes where relevant (e.g., “ensure 4.5:1 contrast for body text”).

## When to Ask for Approval
- Adding a new component that changes the overall token set structure.
- Modifying the schema (`schema/component.schema.json`) – this affects all future entries.
- Changing the build script behavior (e.g., new required fields).
- Deploying to GitHub Pages when the change is a major re‑organization of the data model.
## Reusable Fixes & Findings
- If `node scripts/build.js` fails with EPERM on `dist/`, a leftover `python3 -m http.server` (or any process) still has `dist/site` as its working directory; find it (`netstat -ano | grep 8767`), `Stop-Process -Id <pid> -Force`, delete `dist`, rebuild. 2026-11-13: PID 28024 was the previous session's server.
- For grid layouts sized from JS state, write `grid-template-columns`/`grid-template-rows` directly from the state value (e.g. `repeat(24, 20px)`) instead of routing pixel sizes through a CSS custom property set via `style.setProperty`; if nothing declares that property in CSS the grid silently collapses to zero width. 2026-11-13: Icon creator grid cells rendered zero-width until switched to a direct repeat() value.
- Plan items can arrive already satisfied: before editing, grep site-src for the exact string the plan targets (e.g. "All styles") and verify the desired end-state in code/data first — do not invent options or rename existing ones. 2026-11-13: Persona Style dropdown needed no change (default was Realistic). 2026-11-14: Realistic was removed and the Persona default is Illustrated.
- New component entries must use only categories in use (overlays, forms, data-display, conversation added 2026-11-13) or a deliberate new one; keep 4-pt spacing, 44px touch targets, visible :focus-visible, and never color-only meaning. Schema platforms field is effectively free-form in practice (entries use desktop-web/desktop-app/tablet/mobile-web/ios/android) even though the schema enum says otherwise — do not "fix" entries to match the enum without asking.
- After drafting a guide that cites prices, plans, model names, limits or quotations, trace each figure and each quotation to a specific line in the matching `research/*-verify.md` file. Anything unverified is omitted or written without numbers. Never put quotation marks around words that are not in the source, and never leave notes to the editor in published copy. 2026-11-13: the first AI guide draft broke all three.
- WCAG's relative-luminance cut-off in current WCAG 2.x text is 0.04045; 0.03928 is the pre-May-2021 erratum value. For 8-bit sRGB hex inputs the two are provably identical (no 8-bit component lands between them), so a mismatch between code and docs is invisible on hex colors — fix it anyway to keep docs and code aligned. 2026-11-14: `core.js lum()` used .03928 while tools2.js used .04045; core.js aligned and the contrast guide corrected. Later the same day, on Eric's instruction, the `lum()` copy in `scripts/build.js` was synced to the guides' fix (.04045) as well — check all three copies (`core.js`, `tools2.js`, `scripts/build.js`) whenever either constant changes.
- Wiring a new Browse entry type (2026-11-14, "Website extension"): keep the new type's field set identical in shape to the nearest existing type (documents) so no schema change is needed, then touch exactly five places — `TYPE`/`TYPE_PLURAL` in `site-src/core.js`; the `folder` map + an `md()` branch in `scripts/build.js`; a detail renderer + dispatch + `wireEntry` branch + row meta note in `site-src/browse.js`; entries under `entries/<plural>/`; and a type row + license row in `README.md`. Rebuild and verify: type-filter row count, detail panel rows, store links `target="_blank" rel="noopener"`, guide click-through, `dist/llms.txt` lists the new entries, 320px `scrollWidth` stays at the viewport width.
- `site-src/guides.js` renders only `##`/`###` headings, paragraphs, lists, tables, code blocks, `>` quotes, `**bold**`, `` `code` `` and links. Single-asterisk `*italics*` are not supported and show as literal asterisks; use plain text.
- Rendering big lists in `site-src` got expensive because every keystroke rebuilt the whole table. Pattern that works: (1) debounce search/filter input ~150 ms and let results lag a keystroke behind; (2) render heavy preview content (icons, big SVGs) as empty placeholders filled by IntersectionObserver with ~400 px rootMargin, plus a zero-size guard (`.iconprev[data-ico]{width:24px;height:24px}`) or the observer never fires; (3) delegate click/change events on the container instead of per-row listeners; (4) `loading="lazy" decoding="async"` on every image; (5) measure before and after (rows, DOM nodes, keystroke-to-list-updated, scroll) and only then claim improvement. 2026-11-14: default Browse went 51,902 -> 42,114 nodes, keystroke path ~262 ms -> 91-170 ms + 150 ms debounce; file size did NOT move (5.6 MB inline icons) — the big lever is splitting data at build time (Step C, needs Claude review).
- Fixing a long guide end‑to‑end (e.g., iOS vs Android): apply each reviewer finding against its own source first, then edit the guide; apply corrections/removals with byte‑checked anchors; renumber footnotes sequentially after edits; verify the guide builds, renders correctly, and every footnote has a definition; merge the full per‑guide review content into `research/guides-review.md`; delete the per‑guide file after merging. 2026-11-14: ios-vs-android.md (≈40 KB) edited and merged, RESEARCH log updated.
- Skills (2026-11-15): the sources are `skills/create-design-system/`, `skills/design/`, `skills/code/`, `skills/design-system-audit/` and `skills/_shared/shared-protocol.md`; the build copies the shared protocol into each and adds data for the scripts (`data/library-lite.json`, `data/icon-sets.json`, `entries/components/*.md`). The model never reads those data files; it runs `scripts/pick.js` and `scripts/brief.js` (the old 110 KB `library-lite.json` would cost about 30k tokens). Preset component ids in `components-and-icons.md` must be real entry ids, so re-check them whenever components are added or renamed. `contrast.js` uses the .04045 cut-off like the other copies. The old `mambo-database` lookup skill was removed on Eric's instruction (2026-11-15); the entries are still available as `dist/entries/` and `llms.txt`.
- Component export paths (2026-11-15): "Copy HTML + CSS for Figma" is `figmaDoc()` in `site-src/core.js`. It renders the same frames as the Variants strip (`renderFrames`), so overlays appear open and pointer states are forced on, and it pins each frame's width to the live width. Use `Math.ceil`, never `Math.round`, for that width: a frame 257.33px wide rounded to 257px wraps its last item. Frames pin their own text styles (`font:400 16px/1.6`, `color:#0a0a0a`) because shadow DOM inherits the site's body color, and the frame box is always white, so dark mode gave light text on white. The old copy used the raw working code, and 20 components lost most of their visible text (hidden or fixed-position overlays). The working code stays in the HTML/CSS/JS blocks and the .html download. Verify with a Playwright run that renders `figmaDoc()` in a clean page and compares each frame to the live one (404 frames, 1 known outlier: image-gallery, whose sample images do not exist).
- Component markdown (2026-11-15): `md()` in `scripts/build.js` now adds States, Device variants, Static frame (for Figma), Values used and Figma handoff via `compExtras()`. "Values used" is read mechanically from the CSS, never guessed, because most component CSS holds raw hex values and the entry only lists token names.
- Audit skill (2026-11-15): `skills/design-system-audit/scripts/audit.js` has its own `lum()` (.04045) — a fourth copy beside `core.js`, `tools2.js` and `scripts/build.js` — so check it whenever that constant changes. `contrast.js` is copied into the audit skill at build from `create-design-system`. The tokens check matches colors to pairs by role NAME (Text, Background, Surface, Primary, Border, ...), so a tokens file with other names yields "no pairs matched", not a pass. Tested on a fixture only (4 contrast errors, hardcoded hex, off-scale spacing, missing focus found); not yet run on a real repo or inside Claude.
- Audit research (2026-11-15): Hermes did not deliver `research/design-system-audit.md` (said done three times, file never existed, Gemini free-tier quota errors), so Claude wrote it from pages it opened. The audit script was extended from it (rgb/hsl, Tailwind arbitrary and inline-style spacing, tokenized share, `--baseline`). Figma's own audit pages were blocked, so those claims stay UNVERIFIED.
- Token-sync skill (2026-11-15): `skills/token-sync/scripts/sync.js` compares Figma variables (a small JSON shape, see `references/formats.md`) with CSS custom properties or W3C JSON, per Light/Dark mode, and `apply` edits CSS only for entries marked `approve: true`. Name matching is by normalized name (optional `color-` prefix); same value with a different name is a `possible-rename`, never auto-matched. Alias-to-alias pairs are not reported (the target is). Tested on a fixture only; the Figma connector read step (variable listing and mode names) was not run against a real file.
- Audit fix mode (2026-11-15): `audit.js ... --plan plan.json` writes mechanical fixes (hex to `var(--token)` only for CSS token files, spacing to the nearest scale step) and `audit.js apply plan.json --root <dir>` applies only `approve: true` entries. A hex-to-token match is by VALUE only, so the skill tells the agent to drop entries whose token role does not fit the property; a fixture run turned `color:#fff` into `var(--background)` before that rule was added. Tested on a fixture only.
- Icon-set-creator skill (2026-11-16): `skills/icon-set-creator/scripts/icons.js` checks SVGs against `icon-spec.json` (viewBox, allowed elements, currentColor, stroke width/caps/joins, live area with stroke grown by half, decimals) and writes a preview page. Path boxes use end points and control points, so curves can be over-flagged and ARCS ARE UNDER-CHECKED (end points only). Defaults (24 grid, 2 padding, 2 stroke) are Mambo working defaults, not quoted standards; `research/icon-design.md` from Hermes was requested to confirm them and has not been read yet. Tested on three fixture SVGs only.
- Evals (2026-11-16): `evals/<skill>.json` holds three behavior evaluations per skill in Anthropic's format (query, files, expected_behavior); there is no runner for those, so a person or a model reads the transcript against the list. `evals/run-script-tests.js` runs 15 deterministic checks on the scripts (contrast, audit, token-sync, icons, pick) against `evals/fixtures/`; run it after `node scripts/build.js` whenever a skill script changes. Not wired into CI. The behavior evals have not been run against Claude yet.

- `evals/lint-skills.js` checks every skill's frontmatter (name, description length, YAML colon hazard), SKILL.md length and reference depth. Run it with the script tests before a PR. Designer-skill facts are in `research/designer-skills-verified.md`.
- `design` replaces the old `product` skill (2026-11-16): same steps, plus a `handoff` step that writes `design/handoff/handoff.json` and screen specs, validated by `skills/design/scripts/handoff.js` (copied into `code` at build). The `code` skill builds from it in slices and verifies with `audit.js` and `contrast.js` (copied at build). Research: `research/skill-stacks-verified.md`. Eval files: `evals/design.json`, `evals/code.json`.

## Website performance (2026-11-16)
Rules to keep Browse usable on slow computers as data grows:
- Browse draws rows in batches of `PAGE` (60). A `IntersectionObserver` watches the row in the middle of what is drawn; when it is on screen or already passed, the next batch is added (so loads happen at 50% of the rows shown). A "Show N more" button is the fallback. A linked entry is always drawn. Select all works on the whole filtered list, not only drawn rows.
- All data is one `<script type="application/json" id="mambo-data">` block read with `JSON.parse` (not JavaScript literals). New data goes into that object in `scripts/build.js`.
- Sorting uses precomputed keys and one `Intl.Collator`; search text is cached per entry in a WeakMap. Do not go back to `localeCompare` inside a sort or `toLowerCase` inside `matches`.
- Icon previews and font samples load only near the viewport (existing); keep new heavy content behind the same pattern.
- Measured with Chromium at 6x CPU slowdown (file://, fonts blocked): page load 5.9 s to 1.4 s, filtering to icons 2.7 s to 0.12 s, DOM nodes after first draw 42,362 to 1,358. Check with `node evals/site-smoke.js [cpuSlowdown]` (needs Playwright).
- Still true: `dist/site/index.html` is about 5.9 MB because icon and profile SVGs are inline (3.4 MB of the data). If it keeps growing, split icons and profiles into per-set files fetched on demand; this needs care for opening the page from a file and for the export and design-system code that reads `e.svg`.

- Icon creator (Tools, 2026-11-16): toolbar of buttons (Draw, Eraser, Move, Symmetry with Left and right / Up and down / Both, Show guide) above the Grid size row; Resize drawing panel stretches the drawing with a live preview; changing the grid size scales the drawing instead of clearing it; Undo restores earlier sizes. Browser test: `node evals/icon-creator-smoke.js` (needs Playwright). Fixed along the way: the live-area guide margin was wrong until the grid size was changed, and drag-drawing used the event target, which pointer capture redirects to the grid (cells are now found with `elementFromPoint`).

- AI guide "Choosing a starting model" (2026-11-17): rewritten by need (chat, research, coding, design, writing, data, images) with free, budget and costly picks from all vendors. Ranking data: Artificial Analysis leaderboard, Coding Agent Index (via BenchLM) and Text to Image Arena; prices: Anthropic and Google official pages, OpenAI and Chinese-lab prices from third-party trackers marked "[third-party, confirm]". Not found live: a vision/design leaderboard, LMArena current boards (cached page was from 2025 and a direct fetch was blocked), OpenAI's own pricing page (blocked). Hermes was briefed but never responded, so Claude did this research. Refresh the numbers before relying on them; rankings change within weeks.
