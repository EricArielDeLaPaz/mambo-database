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
| `dist/skill/create-design-system/` | The `/create-design-system` skill: interviews you about the feel and platform, then picks accessible colors, type and optional components |
| `dist/skill/mambo-database/` | A ready‑made agent skill (`SKILL.md` + references). Copy the folder into your skills directory |
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
