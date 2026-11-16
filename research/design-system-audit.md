# Design system audit research (Claude, 2026-11-15)

Written by Claude with web search and page fetches, because Hermes did not deliver this brief. Each claim cites a page that was opened. Anything not opened is marked UNVERIFIED.

## 1. How audits are done
- Brad Frost's interface inventory catalogs the distinct visual treatments of each component (headings, fields, buttons, tabs and so on) with screenshots, grouped by component so duplicates sit side by side; inconsistency shows as many similar-but-different treatments of one component. Its stated purposes: groundwork for a design system, showing redundancy, making sure nothing is missed. Source: https://v9.bradfrost.com/blog/post/interface-inventory
- Figma's design-system-audit solution pages (https://www.figma.com/solutions/design-system-audits/ and /ai-design-system-audit/) could not be fetched (robots disallowed), so their claims are UNVERIFIED. The search titles show Figma ships a "check designs for design system compliance" feature (https://www.createwith.com/tool/figma/updates/figma-releases-check-designs-for-design-system-compliance-across-team-plans, search result only, not opened).
- Not researched: Material, Carbon, Polaris, GOV.UK, Spectrum audit checklists. UNVERIFIED.

## 2. Code drift and the tools that detect it
- `stylelint-declaration-strict-value` requires listed CSS properties to use variables, functions or allowed values, so hex colors and unit numbers are flagged. Options: property list or /RegExp/, `ignoreValues`, `expandShorthand`, `autoFixFunc`. Limits: no autofix unless you write the function; shorthand values are ambiguous (`background: white` vs `url()`), and variables inside shorthands cannot be resolved. Source: https://npmjs.com/package/stylelint-declaration-strict-value
- Mozilla's `stylelint-plugin-mozilla` has rules that require design tokens for color, background-color, border-color and text color. Source (search result, rule pages not opened): https://firefox-source-docs.mozilla.org/code-quality/lint/linters/stylelint-plugin-mozilla/rules/use-design-tokens/color.html
- Open-source Figma lint tools named in search results (not opened, UNVERIFIED what they check): https://github.com/vutran/dslint, https://gh.r-mj.com/codeandtheory/ctdslint

## 3. Report formats in existing AI skills (all opened)
- `wesleysmits/agent-skills` design-token-validator: finds token source, extracts names by category, scans with grep for hardcoded colors (hex, rgb, hsl), raw px spacing, inline React styles and Tailwind arbitrary values, maps each violation to a token, reports file, line, value and suggested token, with counts and "auto-fixable" counts. Severity: error for colors and layout spacing, warning for inline styles and magic numbers, info for possibly intentional one-offs. Source: https://playbooks.com/skills/wesleysmits/agent-skills/design-token-validator
- `borghei/Claude-Skills` design-auditor: scripts for contrast (WCAG 1.4.3 and 1.4.11), token compliance as a percentage, an "AI slop" detector; three A-F grades; exit codes 0/1/2; optional baseline trend. Weaknesses visible on the page: the design grade is subjective, the slop detector is regex-based and reads only HTML and CSS, token compliance does not check the token file itself, and only contrast is automated for accessibility. Source: https://borghei.github.io/Claude-Skills/skills/engineering/design-auditor.html
- Anthropic `knowledge-work-plugins` design-system skill (audit / document / extend): audit report is a component table with a score out of 100. The registry review says the audit mode has no defined method and no validation checkpoints; the score method is not shown. Source: https://tessl.io/registry/skills/github/anthropics/knowledge-work-plugins/design-system/review

## 4. What this changed in our skill
- Added detection the competitors have: rgb()/hsl() literals, Tailwind arbitrary spacing (`p-[13px]`), inline-style numeric spacing, and a "% tokenized" line.
- Added `--baseline` so re-runs show per-rule before/after (design-auditor has a baseline trend).
- Added an interface-inventory check (Brad Frost) to `references/checks.md`.
- Kept our differences: we audit the token file itself (contrast in light and dark, color counts), we separate script-measured from agent-judged checks, and the report must say what was not checked.
- Not adopted: letter grades or a /100 score. Their inputs are subjective, and the pages above give no verified method.

## Searched but not found or not opened
Figma audit pages (blocked); Material, Carbon, Polaris, GOV.UK, Spectrum audit checklists; Figma MCP detached-instance APIs; W3C tokens validators (only the dslint and ctdslint names seen).
