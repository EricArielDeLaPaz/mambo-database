# Guide review log


Running log for the Round 5 "Review the guides" item, kept per DESIGN.md. One section per guide, as found by the reviewer, with claim / status / source / date. Guides were reviewed by read-only reviewers or by the maintainer; guide files were edited AFTER each review to apply corrections and add footnotes — so line numbers and "no changes made" notes inside the sections refer to the pre-edit state of each guide.


Merged from research/guides-review/*.md on 2026-11-14. Reviewer: read-only research subagents (CLAIMS table contract: status confirmed | corrected | unverified | removed; date accessed 2026-11-14; every cited URL opened by the reviewer; blocked pages marked unverified (blocked)).


## accessibility-basics

Reviewed 2026-11-14. Sources opened directly (curl/python) or rendered in browser.

## Claims

| # | Claim (short quote) | Line | Status | Source (URL) | Date | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | "About one in four adults in the United States lives with some kind of disability" | 10 | confirmed | https://archive.cdc.gov/www_cdc_gov/media/releases/2018/p0816-disability.html | 2026-11-14 | CDC press release "CDC: 1 in 4 US adults live with a disability" (61 million / 26%). Live cdc.gov page blocked (Akamai "Access Denied"); archived official CDC page used. |
| 2 | "anyone can be temporarily limited: a broken arm, bright sunlight, a noisy train" | 10 | unverified | n/a | 2026-11-14 | Situational-limitation framing; no cited source. Rhetorical/design-philosophy point; remove or attribute (e.g. inclusive-design literature) if a checkable footnote is required. |
| 3 | "Most laws and procurement rules point to level AA" | 12 | confirmed | https://www.ada.gov/resources/2024-03-08-web-rule/ ; https://www.section508.gov/manage/laws-and-policies/ | 2026-11-14 | DOJ ADA Title II final rule: WCAG 2.1 Level AA is the technical standard. Section 508 (revised 2017) incorporates WCAG 2.0 A/AA. Both at Level AA. |
| 4 | "The measure is a ratio from 1:1 (no difference) to 21:1" | 16 | confirmed | https://www.w3.org/TR/WCAG22/#contrast-ratio | 2026-11-14 | W3C TR/WCAG22, contrast ratio definition, Note 1: "Contrast ratios can range from 1 to 21." |
| 5 | "Normal text 4.5:1 / 7:1 (AAA)" | 20 | confirmed | https://www.w3.org/TR/WCAG22/#contrast-minimum ; https://www.w3.org/TR/WCAG22/#contrast-enhanced | 2026-11-14 | SC 1.4.3 (AA): 4.5:1. SC 1.4.6 (AAA): 7:1. |
| 6 | "Large text (24px, or 18.66px bold, and up) 3:1 / 4.5:1" | 21 | confirmed | https://www.w3.org/TR/WCAG22/#dfn-large-scale | 2026-11-14 | WCAG defines large scale as 18 point or 14 point bold; px conversions are off-spec (1pt = 1.333px gives 24px / 18.66px). US Access Board ICT Baseline says 14pt = 18.5px; 18.66px is within rounding, keep but note it is a conversion, not WCAG wording. |
| 7 | "Icons, input borders, focus rings 3:1" | 22 | confirmed | https://www.w3.org/TR/WCAG22/#non-text-contrast | 2026-11-14 | SC 1.4.11 Non-text Contrast (AA): UI component parts/states and graphical objects required to understand content need 3:1. Applies to input borders and focus indicators (see also SC 2.4.13 Focus Appearance). No AAA level exists for non-text contrast. |
| 8 | "Millions of people have some form of color vision difference" | 28 | confirmed | https://medlineplus.gov/genetics/condition/color-vision-deficiency/ | 2026-11-14 | NLM/NIH MedlinePlus: ~1 in 12 men and 1 in 200 women (Northern European ancestry). Implies millions in US alone. |
| 9 | "Design a clear focus state for every interactive element" | 32 | confirmed | https://www.w3.org/TR/WCAG22/#focus-visible | 2026-11-14 | SC 2.4.7 Focus Visible (AA, 2.2 unchanged) and SC 2.4.13 Focus Appearance (AA, new in 2.2). |
| 10 | "44 by 44 points on touch screens (Apple)" | 36 | confirmed | https://developer.apple.com/design/human-interface-guidelines/buttons | 2026-11-14 | HIG Buttons: "a button needs a hit region of at least 44x44 pt". (visionOS: 60x60 pt.) |
| 11 | "48 by 48 dp on Android (Google Material)" | 36 | confirmed | https://m3.material.io/foundations/designing/structure | 2026-11-14 | Material 3, Accessibility > Target sizes: "For most platforms, consider making touch targets at least 48 x 48dp... results in a physical size of about 9mm." (Page is JS-rendered; text verified in live browser.) |
| 12 | "WCAG 2.2 sets a minimum of 24 by 24 CSS pixels" | 36 | confirmed | https://www.w3.org/TR/WCAG22/#target-size-minimum | 2026-11-14 | SC 2.5.8 Target Size (Minimum) (AA, new in 2.2): pointer targets at least 24x24 CSS px, with spacing/equivalence exceptions. |
| 13 | "People enlarge text up to 200 percent or more" | 46 | confirmed | https://www.w3.org/TR/WCAG22/#resize-text | 2026-11-14 | SC 1.4.4 Resize Text (AA): text can be resized up to 200% without loss of content/function. "or more" is the author's allowance, not the SC wording. |
| 14 | "Screen readers and keyboards follow the order of the page, not the visual layout" | 50 | confirmed | https://www.w3.org/TR/WCAG22/#meaningful-sequence | 2026-11-14 | SC 1.3.2 Meaningful Sequence (A): reading order must be programmatically determinable; SC 2.4.3 Focus Order (A) covers keyboard order. |
| 15 | "plan a calmer option for people who ask their device to reduce motion" | 54 | confirmed | https://www.w3.org/TR/WCAG22/#animation-from-interactions | 2026-11-14 | SC 2.3.3 Animation from Interactions (AAA): movement can be disabled unless essential. Best-practice ask; only the AAA SC speaks to it. prefers-reduced-motion is a CSS/media feature (MDN) not a WCAG requirement. |

## Sources to footnote

1. [1]: Disability Impacts All of Us / CDC press release — Centers for Disease Control and Prevention. https://archive.cdc.gov/www_cdc_gov/media/releases/2018/p0816-disability.html . Accessed 2026-11-14.
   - Needs `[^1]` at line 10: "About one in four adults in the United States lives with some kind of disability" (~26% / 61 million).
2. [2]: Final Rule — Nondiscrimination on the Basis of Disability; Accessibility of Web Content and Mobile Apps — U.S. Department of Justice. https://www.ada.gov/resources/2024-03-08-web-rule/ . Accessed 2026-11-14.
   - Needs `[^2]` at line 12: "Most laws and procurement rules point to level AA" (DOJ: WCAG 2.1 AA).
3. [3]: Web Content Accessibility Guidelines (WCAG) 2.2 — W3C. https://www.w3.org/TR/WCAG22/ . Accessed 2026-11-14.
   - Needs `[^3]` at line 16 (ratio range 1-21), line 20-22 (SC 1.4.3 / 1.4.6 / 1.4.11; large-scale text = 18pt / 14pt bold), line 36 (SC 2.5.8, 24x24 CSS px), line 46 (SC 1.4.4, 200% resize).
4. [4]: Color vision deficiency — MedlinePlus Genetics (NLM, NIH). https://medlineplus.gov/genetics/condition/color-vision-deficiency/ . Accessed 2026-11-14.
   - Needs `[^4]` at line 28: "Millions of people have some form of color vision difference" (1 in 12 men, 1 in 200 women).
5. [5]: Buttons — Apple Human Interface Guidelines — Apple. https://developer.apple.com/design/human-interface-guidelines/buttons . Accessed 2026-11-14.
   - Needs `[^5]` at line 36: "44 by 44 points on touch screens (Apple)".
6. [6]: Designing — Accessibility — Google Material Design 3 — Google. https://m3.material.io/foundations/designing/structure . Accessed 2026-11-14 (live browser render; curl not possible).
   - Needs `[^6]` at line 36: "48 by 48 dp on Android (Google Material)".

## Accessibility and readability issues

- Heading order: guide has no in-body H1 (frontmatter title only); sections are `##` throughout, which is consistent, but the numbered `## 1.`–`## 8.` prefixes are redundant with heading order — not an error.
- Line 24: in-text link "Contrast and WCAG" is fine; line 60 same. No "click here" links.
- Table lines 18–22 has a header row; OK. Table is decorative-simple; cells mix "and up" phrasing — fine.
- Line 28 "If red means error and green means success" relies on words, not color alone — good example; no issues.
- Sentence plainness: generally plain. Line 16 "The measure is a ratio from 1:1" OK. Line 50 is fine; avoid "Screen readers and keyboards follow the order of the page, not the visual layout" — it is accurate; keep.
- Line 10: "regardless of ability, device or situation" plus situational claim is the only unsourced assertion; remove or footnote it.
- External links in this guide: none. Internal `#/guide/...` routes match existing files (`guides/contrast-and-wcag.md`).
- Line 21: spec defines large text in points (18 pt / 14 pt bold). The px figures (24px / 18.66px) are conversions and 18.66px differs from US Access Board's 18.5px — reword to "about 18.7px bold" or cite the WCAG point definition instead of asserting a precise px value.
- Claims to remove or reword: line 10 situational-limitation sentence (unverified, no source); "left to right" phrasing n/a.
- Unverified claim to flag for removal: none beyond #2; everything else is sourced.


## ai-guide

Reviewed 2026-11-14. The claims in this guide already trace line-by-line to research/ai-models-and-workflows-verify.md (figures captured 2026-11-13 from the vendors' own pages); this review re-confirmed every figure against the verify file and re-checked every external link.

## Claims

Status for the numeric claims (line refs as of the pre-footnote edit):

- Pricing table figures (Standard $3/\$15, Opus 5.5 \$4/\$20, Sonnet 5.5 \$2/\$10, Haiku 5.5 \$0.10/\$0.50, gpt-6-astra \$1.00/\$10.00 list \$10/\$50, gpt-6.1-sol \$0.10/\$2.00 cache vs \$2.00/\$10.00 list, gpt-6.1-terra \$0.25/\$1.00 cache vs \$1.00/\$5.00, gpt-6-luna \$0.10/\$0.50, Gemini Pro, 1M context): all appear in the verify file — confirmed 2026-11-14 (trace, not re-read; per Round 3 instruction figures from 2026-11-13 stand).
- Anthropic quote ("Choose Haiku for simple tasks"), 1M context for Claude 4.6+ except Haiku, prompt cache prices (0.1x / 0.05x / 0.025x reads; 1.25x / 2x writes), cache discounts 5-10% for GPT-6 cached input, hallucination paper date 2025-09-05: present in the verify file — confirmed 2026-11-14 (trace).
- Menus/plans (Claude Pro \$17/\$20, Max \$100/\$200, Team \$40/400, 5x Max \$100; Google AI Pro \$19.99, Ultra \$100 creative tools / \$200 top US; Copilot Pro \$10 1,500; Pro+ \$39 7,000; Max \$100 20,000; Ultra \$200/\$250 — the guide lists \$200 top US only for Google AI Ultra and Copilot Max \$100/\$200): present in the verify file — confirmed 2026-11-14 (trace).
- Prompt-caching worked example (28 \$ + \$16 = \$44; batch \$22; cached-input run \$1.80 + \$0.24/1k): arithmetic re-checked — confirmed 2026-11-14.
- "1,000 requests is a number for scale, not a vendor quote" label: present — accurate labeling, confirmed.
- "Four English characters are a reasonable token heuristic... never for billing": present and correctly labelled as a heuristic, not a fact — confirmed.
- "OpenAI cached input is 5% to 10% of fresh input" and gpt-6.1-sol 0.10 vs 2.00 / gpt-6-astra 1.00 vs 10.00: present — confirmed 2026-11-14 (trace).
- 1M-token context claim (Claude 4.6+ except Haiku 5.5; GPT-6 models except nano; Gemini 3.8 Flash): present — confirmed 2026-11-14 (trace).
- Privacy and data-use rows for Claude consumer / Claude Work-API / ChatGPT Free-Plus-Pro / Business-Enterprise-Edu / Gemini app / Gemini API: present — confirmed 2026-11-14 (trace).
- Plan availability rows (ChatGPT Free limits, Claude Free Projects cap, AI Studio free tier): present — confirmed 2026-11-14 (trace).

## Sources to footnote

All 24 distinct sources were added as `[^1]`–`[^24]` with a final `## Where to read more` section listing each title, publisher, link and the date accessed (2026-11-13, the date the figures were captured). Added 2026-11-14.

## Accessibility and readability issues

- Heading order: all `##`, in order. No H1 in body (frontmatter title only). No errors.
- Tables (pricing, plans, privacy) all have header rows. OK.
- Link text is descriptive ([Anthropic], [OpenAI], [Google]…). No "click here". OK.
- No color-only meaning. OK.
- External links (24 unique) re-checked with curl on 2026-11-14: 16 return 200; 8 redirect (301/302/308) to the canonical page in a browser (ai.google.dev pricing, chatgpt.com/pricing, openrouter.ai/docs, anthropic.com/engineering/building-effective-agents, help.openai.com ×2, gemini ?hl=en). One "dead" report is an automation artifact, not a dead page: `support.google.com/gemini/answer/13594961` (Gemini Apps Privacy Hub) returns HTTP 404 to automated HEAD/GET with an empty body, but the page is live and indexed (confirmed via search index, 2026-11-14); the guide's link stands. `support.google.com/accessibility/android/answer/7101858` similar (HEAD 404, GET 200). Recording both as blocked-to-automation, verified via official search excerpts.
- No broken destinations found. No claims need removal beyond those already unverifiable in the verify file (none added in this pass).

Changes applied 2026-11-14: footnote markers `[^n]` added at each sourced claim cluster; new final section `## Where to read more` with sources 1–24; no other wording changed.


## color-blindness

Reviewed 2026-11-14. This guide was rewritten in Round 6 ("men" → people-first wording) with figures from research/color-blindness-prevalence.md; this pass re-checked the claims, footnotes and links.

## Claims

- "About 1 in 24 people" overall red-green figure — computed ((8% of men + 0.5% of women) / 2 = 4.25% ≈ 1 in 24), arithmetic shown, assumption (even sex split) labelled — confirmed 2026-11-14. Sources: Colour Blind Awareness (8% of men, 0.5% of women, "worldwide" wording); NEI (about 1 in 12 men). See research/color-blindness-prevalence.md.
- Deuteranomaly ~2.7% of people (computed from 2.7% of men and 0.01% of women), protan types ~1% of people (computed), tritan ~1 in 12,500 (0.008% direct, both sexes — Aveh review reproducing Webvision table), achromatopsia 1 in 30,000 (MedlinePlus direct): all in research/color-blindness-prevalence.md — confirmed 2026-11-14.
- X-linked inheritance sentence (why red-green differs by sex, neutral wording): consistent with NEI "Causes of Color Vision Deficiency" (footnote 2) and MedlinePlus Genetics — confirmed 2026-11-14.
- "people of different sexes equally" for blue-yellow / complete color vision deficiency: quoted from NEI — confirmed 2026-11-14.
- Simulated table (protan/deutan/tritan rows): colors chosen by Claude in Round 2 and contrast-checked under all simulated deficiencies (worst 4.72) — confirmed 2026-11-14. Not a sourced fact; design decision, recorded in DESIGN.md.
- Achromatopsia and tritan "different sexes equally": NEI — confirmed 2026-11-14.

## Sources to footnote

Already complete before this review: the guide carries `[^1]`–`[^6]` and a final `## Where to read more` listing every source with title, URL and access date (2026-11-11/13/14 as noted in each entry). Every footnote used in the text has an entry; every entry is used. No further footnotes added.

## Accessibility and readability issues

- Heading order: `##` throughout, topics named in order. OK.
- Tables have header rows (the CVD simulation table; "The main types"). OK.
- Footnotes [^n] render as superscript links with `aria-label="Source n"`, keyboard reachable, focus styles — verified in browser 2026-11-14 (6 superscripts, 6 list items, jumps both ways, no hash change).
- Meaning by color alone: guide's "Color, icon and label" column demonstrates the right practice (pill + icon + text, never color alone); the `.cvdpill` pair is now inline-flex centered (Round 6 fix, browser-verified at 320/768/1280).
- Link fixes applied 2026-11-14: NEI link in "Where to read more" updated to the current canonical URL (the old `/learn-about-eye-health/...` path 301-redirects; new `/eye-health-information/...` verified 200). Paul Tol link updated from the dead `personal.sron.nl` (DNS fails, domain gone) to the official successor host `sronpersonalpages.nl/~pault/` (verified 200). WCAG 2.2 link OK (200); Okabe-Ito CUD (jfly.uni-koeln.de) OK (200).
- No "click here" link text. Sentences plain. No claims need removal.


## color-formats

## Claims
| # | Claim (short quote of the fact) | Line | Status | Source (URL) | Date | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | "A hex code is a `#` followed by six characters... three pairs: red, green and blue, each from `00` (none) to `FF` (full)" | 14 | confirmed | https://www.w3.org/TR/css-color-4/#hex-notation | 2026-11-14 | CSS Color 4 §5.2: 6-digit notation = three hex pairs, 00 min, ff (255) max per channel. |
| 2 | "`#FFF` is `#FFFFFF` (white), and `#0AF` is `#00AAFF`" | 17 | confirmed | https://www.w3.org/TR/css-color-4/#hex-notation | 2026-11-14 | Spec: 3-digit shorthand "expanded... by duplicating all of the digits" (#123 = #112233). |
| 3 | "Add two more characters for transparency (alpha): `#1D4ED880` is about 50% opaque" | 18 | confirmed | https://www.w3.org/TR/css-color-4/#hex-notation | 2026-11-14 | Spec: 8-digit form, last pair is alpha, 00 = fully transparent, ff = fully opaque. |
| 4 | "`80` is 8 × 16 + 0 = 128. Since 128 ÷ 255 ≈ 0.50, that is about 50% opaque" | 23 | confirmed | https://www.w3.org/TR/css-color-4/#hex-notation | 2026-11-14 | Range 00-ff confirmed by spec; 0x80=128 and 128/255≈0.502 are arithmetic. |
| 5 | "`40` is about 25%, `80` is about 50%, `BF` is about 75%, `FF` is 100%" | 26 | confirmed | https://www.w3.org/TR/css-color-4/#hex-notation | 2026-11-14 | 0x40=64 (25.1%), 0x80=128 (50.2%), 0xBF=191 (74.9%), 0xFF=255 (100%). Arithmetic. |
| 6 | "In design tools and CSS `rgba()` or `hsla()` the same idea is written as a plain 0 to 1 number or a percentage" | 26 | confirmed | https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/rgb | 2026-11-14 | MDN rgb(): alpha resolved to number between 0 and 1, or percentage; hsl() page says the same for hsla alpha. |
| 7 | "RGB lists red, green and blue as numbers from 0 to 255... `1D` in hex is 29" | 32 | confirmed | https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/rgb | 2026-11-14 | MDN: r,g,b each resolved to number 0-255. W3C: #00ff00 = rgb(0 255 0). 0x1D=29 is arithmetic. |
| 8 | "Add transparency with a fourth number from 0 to 1" | 34 | confirmed | https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/rgb | 2026-11-14 | MDN rgb(): alpha channel 0-1 inclusive; legacy rgba() same. |
| 9 | "Hue (0 to 360): 0 is red, 120 is green, 240 is blue" | 42 | confirmed | https://www.w3.org/TR/css-color-4/#hue-angle | 2026-11-14 | Spec: hue is an angle, "in HSL... which use the sRGB color space, sRGB green is 120 degrees". 0=red and 240=blue follow from the same sRGB hue-angle scale. |
| 10 | "Saturation (0% to 100%): how vivid it is. 0% is gray" | 43 | confirmed | https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/hsl | 2026-11-14 | MDN hsl(): saturation "0% is completely unsaturated (gray)". |
| 11 | "Lightness (0% to 100%): 0% is black, 50% is the pure color, 100% is white" | 44 | confirmed | https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/hsl | 2026-11-14 | MDN hsl(): lightness "100% is white, 0% is black, and 50% is 'normal'". |
| 12 | "It is the default in Figma" (HEX) and picker "lets you switch between most of them" | 10, 28 | confirmed | https://help.figma.com/hc/en-us/articles/360043042113-About-color-models | 2026-11-14 | Figma: "Hex is the default color model in Figma". Picker dropdown offers RGB, HEX, CSS, HSL, HSB (see https://help.figma.com/hc/en-us/articles/360041003774-Update-fills-using-the-color-picker). |
| 13 | "HSB is the one Figma shows by default next to HEX" | 50 | corrected | https://help.figma.com/hc/en-us/articles/360043042113-About-color-models | 2026-11-14 | Figma docs: "By default, Figma represents color values using the Hex model"; HSB is one of five selectable models, not the default shown next to HEX. Reword: "HSB is one of the color models Figma offers in the picker". |
| 14 | "HSB and HSL are different. 100% brightness in HSB is a bright color; 100% lightness in HSL is always white" | 56 | confirmed | https://help.figma.com/hc/en-us/articles/360043042113-About-color-models | 2026-11-14 | Figma: brightness "integer from 0 to 100, with 100 being the brightest"; "The main difference between HSB and HSL is how saturation and lightness are treated". HSL 100% lightness = white per MDN hsl(). |
| 15 | "The picker square in Figma is HSB" | 58 | unverified | https://help.figma.com/hc/en-us/articles/360043042113-About-color-models | 2026-11-14 | Figma docs describe the five models and sliders but do not state that the picker square encodes HSB. Needs Figma confirmation or reword to "Figma's color picker offers HSB". |
| 16 | "CMYK is for print: cyan, magenta, yellow and black ink, each 0% to 100%" | 62 | confirmed | https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/color_value/device-cmyk | 2026-11-14 | MDN device-cmyk(): components "a percentage between 0% and 100%", expressing cyan/magenta/yellow/black, "useful when creating material to be output to a particular printer". Note: CSS function is `device-cmyk()`, not the guide's bare `cmyk()` notation. |
| 17 | "some bright screen colors (very vivid blues and greens) cannot be printed exactly" | 62 | unverified | (none) | 2026-11-14 | True in practice (sRGB > CMYK gamut) but no official/print-standard source was used or verified here. Remove, or cite e.g. a printing standard/ICC doc. |
| 18 | "Named colors like `rebeccapurple` exist in CSS" | 68 | confirmed | https://www.w3.org/TR/css-color-4/#named-colors | 2026-11-14 | Spec named-color table: rebeccapurple #663399. MDN named-color page agrees. |
| 19 | "Figma can switch a file to Display P3, but for most interface work sRGB ... is the safe default" | 69 | confirmed | https://help.figma.com/hc/en-us/articles/360039825114-Manage-color-profiles-in-design-files | 2026-11-14 | Figma: "you can choose between two color profiles: sRGB and Display P3"; "New design files are set to sRGB by default"; P3 has "more vibrant colors". "Safe default for most interface work" is a judgment call, but consistent with the doc. |
| 20 | "The format never changes the contrast ratio, only the color itself does" | 81 | confirmed | https://www.w3.org/TR/WCAG22/#contrast-ratio-definition | 2026-11-14 | WCAG 2.2: contrast ratio is computed from the relative luminance of the two colors; notation (HEX/RGB/HSL) is irrelevant to the ratio. |

## Sources to footnote
[1]: W3C CSS Color Module Level 4 — W3C. <https://www.w3.org/TR/css-color-4/#hex-notation>. Accessed 2026-11-14.
  - Covers lines 14, 17, 18, 20-26: "The syntax of a <hex-color> is a <hash-token> whose value consists of 3, 4, 6, or 8 hexadecimal digits"; "In other words, a hex color is written as a hash character, #, followed by some number of digits"; 8-digit alpha pair 00 (transparent) to ff (opaque); shorthand duplicates digits.
[2]: rgb() — MDN Web Docs (Mozilla). <https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/rgb>. Accessed 2026-11-14.
  - Covers lines 26, 32, 34: r,g,b resolved to numbers 0-255 inclusive; alpha 0-1 (or percentage via hsl/legacy rgba).
[3]: hsl() — MDN Web Docs (Mozilla). <https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/hsl>. Accessed 2026-11-14.
  - Covers lines 40, 42-44, 56: hue (0-360, color wheel), saturation 0% gray / 100% fully saturated, lightness 0% black, 100% white, 50% normal.
[4]: W3C CSS Color Module Level 4 — Hue angle — W3C. <https://www.w3.org/TR/css-color-4/#hue-angle>. Accessed 2026-11-14.
  - Covers line 42: "in HSL and HWB, which use the sRGB color space, sRGB green is 120 degrees"; hue is an angle.
[5]: About color models — Figma (Figma Learn Help Center). <https://help.figma.com/hc/en-us/articles/360043042113-About-color-models>. Accessed 2026-11-14.
  - Covers lines 10, 28, 50, 56: Figma's five color models (Hex, HSB, HSL, CSS, RGB); "By default, Figma represents color values using the Hex model"; HSB/HSL semantics and brightness vs. lightness difference.
[6]: Update fills using the color picker — Figma (Figma Learn Help Center). <https://help.figma.com/hc/en-us/articles/360041003774-Update-fills-using-the-color-picker>. Accessed 2026-11-14.
  - Covers line 10: picker dropdown offers RGB, HEX, CSS, HSL, or HSB.
[7]: Manage color profiles in design files — Figma (Figma Learn Help Center). <https://help.figma.com/hc/en-us/articles/360039825114-Manage-color-profiles-in-design-files>. Accessed 2026-11-14.
  - Covers line 69: sRGB vs Display P3; switch file profile; sRGB is default for new files; P3 has more vibrant colors.
[8]: device-cmyk() — MDN Web Docs (Mozilla). <https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/color_value/device-cmyk>. Accessed 2026-11-14.
  - Covers line 62: CMYK components 0-100%, for printer output; CSS function name is `device-cmyk()`.
[9]: Named colors — MDN Web Docs (Mozilla) / W3C CSS Color 4. <https://developer.mozilla.org/en-US/docs/Web/CSS/named-color> / <https://www.w3.org/TR/css-color-4/#named-colors>. Accessed 2026-11-14.
  - Covers line 68: rebeccapurple #663399 is a standard named color.
[10]: WCAG 2.2 — Understanding contrast ratio — W3C. <https://www.w3.org/TR/WCAG22/#contrast-ratio-definition>. Accessed 2026-11-14.
  - Covers line 81: contrast ratio is computed from relative luminance; independent of color notation.

## Accessibility and readability issues
- Heading order: OK. `## HEX`, `## RGB`, `## HSL`, `## HSB`, `## CMYK`, `## Names and other formats`, `## Which one should I use?` are all level 2 in sequence.
- Links: no "click here" link text; the one internal link "[Contrast and WCAG](#/guide/contrast-and-wcag)" describes its target and the target file exists (guides/contrast-and-wcag.md).
- No external links to break. No tables without header rows (the one table, lines 73-74, has a header row).
- No meaning carried by color alone (alpha cheat-sheet uses code spans, not colored text).
- Line 50: factually wrong about Figma's default — fix before publishing (see claim 13). This is the guide's only hard error.
- Line 58: unverifiable Figma picker claim — remove or reword ("Figma's color picker offers HSB").
- Line 62: the print-gamut claim ("cannot be printed exactly") has no source; remove or phrase as general expectation without a factual claim. Also the `cmyk()` notation implies a CSS function that does not exist — clarify that Figma/print tools accept these percentages, not CSS.
- Sentence line 20-24 is long but plain; acceptable. Line 26 "A few handy ones" is fine.
- Numbers-heavy lines (23, 26) are dense; consider a small table for alpha cheat-sheet values (`40`/`80`/`BF`/`FF`) for readability.


## contrast-and-wcag

Reviewed 2026-11-14. W3C pages fetched with curl and greped; WebAIM pages fetched and inspected; WebAIM checker logic is JS-driven and could not be fully audited.

## Claims

| # | Claim (short quote) | Line | Status | Source (URL) | Date | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | "WCAG measures contrast as a ratio between the relative luminance ... of two colors" | 12 | confirmed | https://www.w3.org/TR/WCAG22/#dfn-contrast-ratio | 2026-11-14 | W3C TR/WCAG22, definition of contrast ratio. |
| 2 | "ratio = (L1 + 0.05) / (L2 + 0.05)" ... "runs from 1:1 to 21:1" (L lighter, L2 darker) | 14-18 | confirmed | https://www.w3.org/TR/WCAG22/#dfn-contrast-ratio | 2026-11-14 | Verbatim match with W3C definition, Note 1 ("range from 1 to 21"). |
| 3 | "If the value is 0.03928 or below (the cut-off WCAG 2.x and WebAIM use), divide by 12.92" | 23 | corrected | https://www.w3.org/TR/WCAG22/#dfn-relative-luminance ; https://www.w3.org/WAI/GL/wiki/Relative_luminance | 2026-11-14 | Corrected fact: current WCAG 2.x (since the May 2021 erratum and unchanged in WCAG 2.2) specifies the cut-off as **0.04045**, not 0.03928. W3C TR/WCAG22 relative-luminance definition says "if RsRGB <= 0.04045 then R = RsRGB/12.92" and includes Note 2 explaining the 0.03928 value was the old, outdated threshold. The parenthetical "(the cut-off WCAG 2.x and WebAIM use)" is therefore wrong for WCAG 2.x as published. WebAIM's checker implements its math in JS and could not be verified from the page source (results area is script-rendered); do not claim what WebAIM uses without checking its source. |
| 4 | "Otherwise use ((value + 0.055) / 1.055) ^ 2.4" | 23 | confirmed | https://www.w3.org/TR/WCAG22/#dfn-relative-luminance | 2026-11-14 | Matches W3C definition exactly. |
| 5 | "L = 0.2126 R + 0.7152 G + 0.0722 B" | 24 | confirmed | https://www.w3.org/TR/WCAG22/#dfn-relative-luminance | 2026-11-14 | Verbatim from W3C definition. |
| 6 | "Green counts most because the eye is most sensitive to it" | 26 | confirmed | https://www.w3.org/TR/WCAG22/#dfn-relative-luminance | 2026-11-14 | The largest luminance coefficient is G (0.7152); W3C does not state the perceptual rationale in the definition, but the weighting fact is confirmed. The "eye is most sensitive to green" rationale is commonly cited vision science; no primary W3C citation, acceptable as explanation. |
| 7 | "AA | 4.5:1 | 3:1 | 3:1" (normal / large / UI parts) | 32 | confirmed | https://www.w3.org/TR/WCAG22/#contrast-minimum ; https://www.w3.org/TR/WCAG22/#non-text-contrast | 2026-11-14 | SC 1.4.3 (AA) 4.5:1 normal / 3:1 large-scale; SC 1.4.11 (AA) 3:1 non-text. |
| 8 | "AAA | 7:1 | 4.5:1 | not defined" (UI parts) | 33 | confirmed | https://www.w3.org/TR/WCAG22/#contrast-enhanced ; https://www.w3.org/TR/WCAG22/#non-text-contrast | 2026-11-14 | SC 1.4.6 (AAA) 7:1 / 4.5:1 large-scale. No AAA criterion exists for non-text contrast (1.4.11 is AA-only); "not defined" is accurate. |
| 9 | "Large text means 24px or bigger, or 18.66px or bigger if bold" | 35 | confirmed | https://www.w3.org/TR/WCAG22/#dfn-large-scale | 2026-11-14 | WCAG says 18 pt or 14 pt bold; 18 pt = 24 px and 14 pt ≈ 18.66 px at 96 dpi. US Access Board ICT Baseline says 18.5 px; WCAG never publishes px values. Keep, but flag as conversion. |
| 10 | "Ratios are not rounded up. A ratio of 4.49 fails 4.5" | 35 | confirmed | https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html | 2026-11-14 | Understanding SC 1.4.3/1.4.6: threshold values, "the computed values should not be rounded (e.g., 4.499:1 would not meet the 4.5:1 threshold)." |
| 11 | "WebAIM ... a well-known tool from the nonprofit WebAIM at Utah State University" | 39 | confirmed | https://webaim.org/about/ | 2026-11-14 | WebAIM About page: "WebAIM is a non-profit service center at Utah State University" (Institute for Disability Research, Policy & Practice). |
| 12 | "The contrast badges in the Design Systems tab use the same formula and thresholds as the WebAIM Contrast Checker" | 39 | unverified | https://webaim.org/resources/contrastchecker/ | 2026-11-14 | WebAIM Contrast Checker page loads but its computation runs in JS; could not extract/audit the implementation. No first-party statement from WebAIM about which luminance cut-off it uses (0.03928 historical vs 0.04045 current). Verify against source code before claiming equivalence; safest wording: "uses the WCAG 2.2 contrast formula." |
| 13 | "Red on green can pass the ratio and still be confusing" | 50 | confirmed | https://medlineplus.gov/genetics/condition/color-vision-deficiency/ | 2026-11-14 | NLM/NIH: red-green deficiency in ~1 in 12 men, 1 in 200 women; hue-only distinctions fail for them regardless of luminance ratio. |
| 14 | "A very thin weight can pass the ratio and still be hard to read" | 49 | confirmed | https://www.w3.org/TR/WCAG22/#dfn-large-scale | 2026-11-14 | W3C large-scale text definition, Note 1: "Fonts with extraordinarily thin strokes ... are harder to read, especially at lower contrast levels." |
| 15 | "WCAG does not require contrast for disabled controls" | 52 | confirmed | https://www.w3.org/TR/WCAG22/#contrast-minimum ; https://www.w3.org/TR/WCAG22/#non-text-contrast | 2026-11-14 | SC 1.4.3 and 1.4.11 both exempt "inactive user interface components" (the spec's term, colloquially "disabled controls"). The guide's wording is accurate; consider quoting the spec term. |

## Sources to footnote

1. [1]: Web Content Accessibility Guidelines (WCAG) 2.2 — W3C. https://www.w3.org/TR/WCAG22/ . Accessed 2026-11-14.
   - Needs `[^1]` at line 12 and 18 (formula and 1:1-21:1 range), line 24 (L = 0.2126R + 0.7152G + 0.0722B), line 32-33 (SC 1.4.3, 1.4.6, 1.4.11), line 35 (large-scale text = 18 pt / 14 pt bold), line 52 (inactive UI components exempt).
2. [2]: Understanding Success Criterion 1.4.3: Contrast (Minimum) — W3C WAI. https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html . Accessed 2026-11-14.
   - Needs `[^2]` at line 35: "Ratios are not rounded up. A ratio of 4.49 fails 4.5" (computed values should not be rounded).
3. [3]: WebAIM: About — WebAIM. https://webaim.org/about/ . Accessed 2026-11-14.
   - Needs `[^3]` at line 39: "the nonprofit WebAIM at Utah State University".
4. [4]: WebAIM: Contrast Checker — WebAIM. https://webaim.org/resources/contrastchecker/ . Accessed 2026-11-14 (page loads; computation is JS-driven).
   - Needs `[^4]` at line 39: "the same formula and thresholds as the WebAIM Contrast Checker" (second-opinion link). Only the tool's existence and threshold info are confirmed; do not state it uses a specific luminance cut-off without auditing its source.
5. [5]: Color vision deficiency — MedlinePlus Genetics (NLM, NIH). https://medlineplus.gov/genetics/condition/color-vision-deficiency/ . Accessed 2026-11-14.
   - Needs `[^5]` at line 50: "Red on green can pass the ratio and still be confusing".
6. [6]: Relative luminance (erratum note) — W3C WAI. https://www.w3.org/WAI/GL/wiki/Relative_luminance . Accessed 2026-11-14.
   - Needs `[^6]` at line 23: the 0.03928 → 0.04045 correction ("WCAG 2.x specifies 0.04045; 0.03928 was the pre-2021 value").

## Accessibility and readability issues

- Heading order: `##` sections in order; no H1 in body (frontmatter title only). No heading-order errors.
- Line 39: external link text "WebAIM Contrast Checker" is descriptive — good. No "click here" text.
- Tables (lines 30-33) have header rows. OK.
- Code block lines 14-16: formula presented in a fenced code block with backticks at line 12-13 ("relative luminance" bold-marked) — fine for Markdown rendering.
- Link `https://webaim.org/resources/contrastchecker/` is live (200, loads the checker). No broken/redirect issue. Note: a generic older WebAIM contrast-articles URL (webaim.org/articles/color-contrast/) now 404s, but the guide does not use it.
- Meaning by color alone: guide itself practices what it preaches; line 45's "Light gray might pass at 3:1" example is fine (relies on ratio, not hue).
- Plainness issues: line 12 parenthetical "(how bright a color looks to the eye)" is a rough simplification of relative luminance (perceptual brightness, not perceived luminance in the strict sense) — acceptable for the audience but could mislead pedantically; consider "how bright a color is, weighted for human vision".
- Line 44: "The wrench button in Design Systems" — internal UI reference; fine.
- Claim that needs reword/removal: line 23 "the cut-off WCAG 2.x and WebAIM use" — must become "the cut-off in WCAG 2.x (0.04045 since the 2021 erratum); 0.03928 is the legacy value. Do not attribute a cut-off to WebAIM without auditing its source."
- Claim to remove/reword: line 39 "same formula and thresholds as the WebAIM Contrast Checker" — unverifiable as stated; reword to "uses the WCAG 2.2 thresholds (4.5:1 / 3:1 / 4.5:1 / 7:1); tap 'Check on WebAIM' for an independent check."
- Claims unverified that could be removed: none beyond the two above; all others are sourced.
- Sentence-level: line 26 "Green counts most because the eye is most sensitive to it" is fine.
- The 1:1 to 21:1 range phrasing on line 18 is correct.


## css-basics

## Claims
| # | Claim (short quote of the fact) | Line | Status | Source (URL) | Date | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | "CSS (Cascading Style Sheets) controls **how** HTML looks" | 10 | confirmed | https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Styling_basics/What_is_CSS | 2026-11-14 | MDN What is CSS: "how your browser applies CSS to HTML to style it"; CSS defines appearance. |
| 2 | "`box-sizing: border-box`... a width of 200px includes padding and border" | 47 | confirmed | https://developer.mozilla.org/en-US/docs/Web/CSS/box-sizing | 2026-11-14 | MDN example: with border-box and padding 20px/border 8px, total width equals the set width (160px); padding/border are inside it. |
| 3 | "`px` — A CSS pixel" | 53 | confirmed | https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/length | 2026-11-14 | MDN <length>: "px — One pixel"; 1px = 1in/96. |
| 4 | "`rem` — Relative to the root font size (16px by default)" | 54 | confirmed | https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/length | 2026-11-14 | MDN <length>: rem "represents the font-size of the root element (typically <html>)... A common browser default is 16px". |
| 5 | "`%` — Share of the parent" | 55 | confirmed | https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/length | 2026-11-14 | MDN <length>: percentages usable in width/height etc.; percentages for width resolve against the containing block (the parent). |
| 6 | "`vh`, `vw` — Share of the screen height or width" | 56 | confirmed | https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/length | 2026-11-14 | MDN <length>: viewport-percentage units; "1vh is 1% of the viewport height" / "1vw is 1% of the viewport width"; based on initial containing block. |
| 7 | "Tell engineers your type sizes in px... 18px is 1.125rem" | 58 | confirmed | https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/length | 2026-11-14 | Arithmetic on the 16px default root: 18/16 = 1.125. Note: rem is relative to the actual root font size, not always 16px. |
| 8 | "**Flexbox** lays items in one direction" | 62 | confirmed | https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Flexible_box_layout/Basic_concepts | 2026-11-14 | MDN: flexbox "deals with layout in one dimension at a time — either as a row or as a column" (contrasted with Grid's two dimensions). |
| 9 | "**Grid** lays items in rows and columns at once" | 73 | confirmed | https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Grid_layout/Basic_concepts | 2026-11-14 | MDN: "CSS grid layout introduces a two-dimensional grid system... rows and columns". |
| 10 | "Media queries change the rules at certain widths" | 85 | confirmed | https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_media_queries/Using_media_queries | 2026-11-14 | MDN: media queries "allow you to apply CSS styles depending on a device's media type... or other features or characteristics such as screen resolution or orientation, aspect ratio..." — width is a standard feature query. |
| 11 | "`:hover` is the mouse over it" | 103 | confirmed | https://developer.mozilla.org/en-US/docs/Web/CSS/:hover | 2026-11-14 | MDN: "matches an element when a user interacts with it using a pointing device... when the user moves the cursor (mouse pointer) over an element". |
| 12 | "`:focus-visible` is keyboard focus" | 103 | confirmed | https://developer.mozilla.org/en-US/docs/Web/CSS/:focus-visible | 2026-11-14 | MDN: useful "based on the user's input modality (mouse vs. keyboard)"; applies when the UA determines focus should be made evident. Keyboard is the common case, not a guarantee. |
| 13 | "`:disabled` is unavailable" | 103 | confirmed | https://developer.mozilla.org/en-US/docs/Web/CSS/:disabled | 2026-11-14 | MDN: "represents any disabled element. An element is disabled if it can't be activated (selected, clicked on, typed into, etc.) or accept focus." |
| 14 | "Change one value and everything using it updates" (CSS custom properties, :root, var()) | 113 | confirmed | https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Cascading_variables/Using_custom_properties | 2026-11-14 | MDN: define "--*" on :root, reference in multiple places, then "the updated styles look like this" — change one declaration, all references update. |
| 15 | "Figma has no margin, so designers often use gap in auto layout" | 45 | unverified | (none) | 2026-11-14 | Product-specific claim about Figma; no official Figma doc checked here states the absence of a margin property. Either cite Figma's auto layout docs or drop/reword. |
| 16 | "`box-sizing: border-box ... matches how Figma sizes frames`" | 47 | unverified | (none) | 2026-11-14 | Product-specific comparison; no primary source. Reword as opinion or attribute, or drop. |
| 17 | "Variables in CSS are the same idea as Figma variables" | 105 | unverified | (none) | 2026-11-14 | Product-specific comparison; no primary source. Reword ("similar in spirit") or cite Figma variables docs. |

## Sources to footnote
[1]: What is CSS? — MDN Web Docs (Mozilla). <https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Styling_basics/What_is_CSS>. Accessed 2026-11-14.
  - Covers line 10: CSS defines how HTML elements are styled/laid out; "Cascading Style Sheets".
[2]: box-sizing — MDN Web Docs (Mozilla). <https://developer.mozilla.org/en-US/docs/Web/CSS/box-sizing>. Accessed 2026-11-14.
  - Covers line 47: border-box makes the element's width include padding and border (MDN example: 160px total, content 104px).
[3]: <length> — MDN Web Docs (Mozilla). <https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/length>. Accessed 2026-11-14.
  - Covers lines 53-58: px (1px = 1in/96); rem relative to root font size, common default 16px; vh/vw = 1% of viewport height/width; percentages for width relative to containing block.
[4]: Basic concepts of flexbox — MDN Web Docs (Mozilla). <https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Flexible_box_layout/Basic_concepts>. Accessed 2026-11-14.
  - Covers lines 60-71: flexbox is one-dimensional (row or column); main/cross axes.
[5]: Basic concepts of grid layout — MDN Web Docs (Mozilla). <https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Grid_layout/Basic_concepts>. Accessed 2026-11-14.
  - Covers lines 73-81: grid is a two-dimensional system; rows and columns.
[6]: Using media queries — MDN Web Docs (Mozilla). <https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_media_queries/Using_media_queries>. Accessed 2026-11-14.
  - Covers line 85-91: applying styles at certain widths via media features.
[7]: :hover — MDN Web Docs (Mozilla). <https://developer.mozilla.org/en-US/docs/Web/CSS/:hover>. Accessed 2026-11-14.
  - Covers line 98: pseudo-class matched when a pointing device is over the element.
[8]: :focus-visible — MDN Web Docs (Mozilla). <https://developer.mozilla.org/en-US/docs/Web/CSS/:focus-visible>. Accessed 2026-11-14.
  - Covers line 99: focus indicator depends on input modality (mouse vs keyboard); keyboards trigger focus-visible.
[9]: :disabled — MDN Web Docs (Mozilla). <https://developer.mozilla.org/en-US/docs/Web/CSS/:disabled>. Accessed 2026-11-14.
  - Covers line 100: element cannot be activated or accept focus.
[10]: Using CSS custom properties (variables) — MDN Web Docs (Mozilla). <https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Cascading_variables/Using_custom_properties>. Accessed 2026-11-14.
  - Covers lines 107-114: define custom properties on :root, reference with var(); changing one declaration updates all references.

## Accessibility and readability issues
- Heading order problem: the first heading after the front matter is `### Think of a house` (line 12) — a level-3 heading before any level-2. Promote it to `##` (or add a `##` above it). All subsequent headings are level 2 in order.
- Tables: both tables (lines 16-20, 51-56) have header rows. OK.
- Links: no "click here" link text. Internal links (#/guide/html-basics, #/guide/javascript-basics, #/guide/handoff-for-engineers) all have target files that exist. No external links to break.
- Unverified product claims at lines 45, 47, 105 (Figma has no margin / border-box matches Figma frames / CSS variables = Figma variables). Remove, mark as opinion, or cite Figma docs; do not present as fact.
- Line 58: "Note this only works if the root font size stays 16px" would be a useful accuracy note; as written it implies rem is always 16px-based.
- Line 103: "In house terms, it is how the light switch looks when you hover over it, and the glow of the lamp once it is on" — mixes two metaphors and is ambiguous (is the glow hover or disabled?); simplify.
- Line 105-114: the variable example has no accessibility tie-in; fine, but the earlier box-model table says "no direct Figma equivalent" (margin) then line 45 repeats it — keep only one.
- Plain language: generally good; lines 47 and 105 are the weakest for unsupported claims as written.


## handoff-for-engineers

## Claims
| # | Claim (short quote of the fact) | Line | Status | Source (URL) | Date | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | "Mobile has no hover, so skip it there" | 15 | confirmed (nuanced) | https://developer.mozilla.org/en-US/docs/Web/CSS/@media/hover | 2026-11-14 | MDN @media (hover): `none` — "The primary input mechanism cannot hover at all or cannot conveniently hover (e.g., many mobile devices emulate hovering when the user performs an inconvenient long tap)". So: no hover in practice, but many mobiles emulate hover on long tap; the guide's flat claim is acceptable shorthand but slightly overstated. |
| 2 | "See the state row on any component in Browse." | 15 | unverified | (none) | 2026-11-14 | References this site's Browse UI; internal product behavior, not checkable against an external primary source. Verify against the site itself or drop the reference. |
| 3 | "In Design Systems, the export includes CSS and token files you can share." | 18 | unverified | (none) | 2026-11-14 | Product-specific claim about the Design Systems export feature; no public/official doc for this repo's product. Verify internally or remove. |
| 4 | "Use the same names the code uses, for example `color/primary`, `space/4`." | 18 | unverified (example) | (none) | 2026-11-14 | Example naming convention; not a factual claim about the outside world. Consistent with common token-naming practice but not sourced; treat as house style. |

## Sources to footnote
[1]: hover — MDN Web Docs (Mozilla). <https://developer.mozilla.org/en-US/docs/Web/CSS/@media/hover>. Accessed 2026-11-14.
  - Covers line 15: the `(hover: none)` media feature — primary input cannot hover; many mobile devices emulate hover on long tap.

## Accessibility and readability issues
- Heading order: OK. `## The checklist` then `### 1.` through `### 8.` in order; later `## Naming`, `## Talk early`, `## A short hand-off note template` are all level 2. (Note the numbered `###` headings carry their number in the text, which is fine but redundant with list numbering.)
- No tables; no "click here" links. Internal links (#/guide/accessibility-basics, #/guide/image-formats, #/guide/icon-types) all resolve to existing files in guides/. No external links.
- Unverified product claims: lines 15 and 18 (Browse state row; Design Systems export includes CSS/token files). Verify against the actual product or remove; these are the only checkable facts in the guide.
- The checklist is opinion/practice rather than fact — appropriately so for a handoff guide — but the review cannot confirm any of the best-practice claims (4px/8px base unit, etc.) against a primary source, and should not be asked to.
- Line 30: "Keep animations short and describe easing" — advice with no source; if a source is wanted, WCAG 2.3.3 (Animation from Interactions, AAA) or WCAG 2.2.2 could be cited, but the guide presents it as guidance, not fact.
- Sentence-level: all sentences are plain and short; no readability issues.


## how-ai-reads-a-design-system

Reviewed 2026-11-14. This guide is mostly internal product documentation and opinion; repo files were inspected to verify internal claims. No external (web) factual claims except general statements about AI tools, which carry no citation.

## Claims

| # | Claim (short quote) | Line | Status | Source (URL) | Date | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | "AI assistants do not see your Figma file the way you do. They read text: names, values, descriptions and code." | 10 | unverified | n/a | 2026-11-14 | General claim about LLM-based tooling; no primary source cited or needed for an opinion-style intro, but it is stated as fact. Cannot be confirmed from a standard; suggest softening to "AI tools work from the text and data they are given (names, values, descriptions, code)". |
| 2 | "AI tools ... a short index that AI tools can read" / "The site publishes an `llms.txt` file" | 59 | confirmed | repo: `dist/llms.txt` (this workspace) | 2026-11-14 | Verified: `dist/llms.txt` exists in the build output. `llms.txt` as a convention is described at https://llmstxt.org (community convention, not a W3C/standard); the guide does not define it as a standard, which is fine. |
| 3 | "Every entry exists as Markdown and JSON" | 58 | confirmed | repo: `dist/entries/*/**.md` and `entries/**/*.json` | 2026-11-14 | Verified: dist/entries contains .md per entry (e.g. dist/entries/colors/appetite-warm.md) and entries/ contains matching JSON. "Copy as Markdown (for AI)" / "Copy JSON" are site UI features; implementation present in site-src/. |
| 4 | "The [AI skills] ... let an assistant search the whole database and run an interview before building a system." | 60 | confirmed | repo: `dist/skill/mambo-database/SKILL.md`, `dist/skill/create-design-system/SKILL.md` | 2026-11-14 | Verified skill packages exist in build output (mambo-database, create-design-system). Behavior description matches skill intent; functional behavior not executed in this review (build not run, per instructions). |
| 5 | "All entries follow a fixed shape ... Browse follows this shape" (anatomy, states, etc.) | 54 | confirmed | repo: `entries/` schema, `DESIGN.md` | 2026-11-14 | Consistent with repo schema/DESIGN.md structure; internal consistency verified, not rendered in browser. |
| 6 | "The label needs 4.5:1 contrast" (example clear instruction) | 27 | confirmed | https://www.w3.org/TR/WCAG22/#contrast-minimum | 2026-11-14 | 4.5:1 is the WCAG AA threshold for normal text; example is consistent with spec. |
| 7 | "Design Systems exports files your tools and engineers can both read, such as CSS variables and a README" | 61 | confirmed | repo: `dist/` (site build includes export templates), `DESIGN.md` | 2026-11-14 | Internal export feature; consistent with build output and DESIGN.md. Not executed. |
| 8 | "AI can sound sure and still be wrong. Verify contrast with a checker" | 67 | unverified | n/a | 2026-11-14 | Plausible best-practice guidance; no source needed/possible. Keep as advice, not as a factual claim. |
| 9 | "Maximum text length, minimum contrast, required labels" (rules AI can use) | 19 | confirmed | repo: entries JSON contain token/rule fields; `DESIGN.md` | 2026-11-14 | Internal consistency verified. |

## Sources to footnote

1. [1]: llms.txt — The llms.txt proposal / community convention. https://llmstxt.org/ . Accessed 2026-11-14 (verified live, HTTP 200; community convention, not an official W3C/IETF standard).
   - Needs `[^1]` at line 59: "The site publishes an `llms.txt` file, a short index that AI tools can read." If the maintainer does not want to endorse the convention by link, drop the footnote - the claim is only about this site's own file, which needs no external source.
2. [2]: Web Content Accessibility Guidelines (WCAG) 2.2, SC 1.4.3 Contrast (Minimum) — W3C. https://www.w3.org/TR/WCAG22/#contrast-minimum . Accessed 2026-11-14.
   - Needs `[^2]` at line 27: "The label needs 4.5:1 contrast."
3. No other external sources. The rest are internal facts verified against this repository (dist/llms.txt, dist/skill/, dist/entries/, entries/*.json, DESIGN.md) and need no footnotes, only repo references if the maintainer wants them recorded.

## Accessibility and readability issues

- Heading order: `##` sections in order (What an AI tool can use / Good inputs / Write tokens / Write down the rules / How Mambo Database helps / Working with AI well / Try it). No heading-level errors; no body H1 (frontmatter title only).
- Link at line 60 (`#/guide/setting-up-the-skills`): internal route; matching source file `guides/setting-up-the-skills.md` exists, so the route resolves. Not clickable-checked in a built site; build was not run.
- No "click here" text; link text "AI skills" is descriptive. OK.
- Tables lines 14-20 and 35-39 have header rows. OK.
- No tables rely on color alone. OK.
- Plainness: generally plain. Line 10 "They read text: names, values, descriptions and code." is fine. Line 68 "Taste, ethics and understanding real users stay with you" - fine.
- Meaning by color alone: not applicable (no colored semantic examples).
- External links: none. If a footnote to llmstxt.org is added, ensure it is descriptive ("llms.txt convention") not "here".
- Unverifiable/unfalsifiable statements that should be softened (not deleted): lines 10, 67. They are opinions, not facts; the review accepts them as guidance.
- No broken links found. Internal-route check only; live site not tested (no build).
- Claim to remove/reword: none blocking. The only correction-level fix is optional (line 10 wording).


## html-basics

## Claims
| # | Claim (short quote of the fact) | Line | Status | Source (URL) | Date | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | "HTML (HyperText Markup Language) describes **what things are** on a page" | 10 | confirmed | https://developer.mozilla.org/en-US/docs/Web/HTML | 2026-11-14 | MDN: "HTML (HyperText Markup Language) is the most basic building block of the Web. It defines the meaning and structure of web content." |
| 2 | "An element is a tag pair with content between them." | 26 | confirmed | https://developer.mozilla.org/en-US/docs/Glossary/Element | 2026-11-14 | MDN Glossary: a typical element "includes an opening tag with some attributes, enclosed text content, and a closing tag". |
| 3 | "<!doctype html>" skeleton line (required preamble) | 41 | confirmed | https://developer.mozilla.org/en-US/docs/Glossary/Doctype | 2026-11-14 | MDN Glossary: "the doctype is the required <!doctype html> preamble found at the top of all documents". WHATWG HTML Living Standard §13.1.2 (The DOCTYPE) likewise makes a DOCTYPE part of the document structure. |
| 4 | "The `viewport` meta tag tells phones to use the real screen width (the frame width) instead of a zoomed-out desktop width." | 57 | confirmed | https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/meta/name/viewport | 2026-11-14 | MDN: `width=device-width` sets viewport to the physical screen size in CSS pixels; recommended setting; per MDN's responsive-design guide, mobile browsers otherwise render at ~980px and shrink. |
| 5 | "`head` holds information about the page. Visitors do not see it." | 59 | confirmed | https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/head | 2026-11-14 | MDN: "<head> contains machine-readable information (metadata) about the document" — metadata, not rendered content. |
| 6 | "`lang=\"en\"` tells screen readers which language to speak." | 61 | confirmed | https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/lang | 2026-11-14 | MDN lang: purpose is "to allow assistive technologies such as screen readers to invoke the correct pronunciation". |
| 7 | "`button` — Works with Enter and Space." | 69 | confirmed | https://www.w3.org/WAI/ARIA/apg/patterns/button/ | 2026-11-14 | W3C ARIA Authoring Practices, Button pattern, Keyboard Interaction: "Space: Activates the button. Enter: Activates the button." |
| 8 | "`a` (link) — Works with Enter and opens in new tabs." | 70 | corrected | https://www.w3.org/WAI/ARIA/apg/patterns/link/ | 2026-11-14 | APG, Link pattern: "Enter: Executes the link and moves focus to the link target." Links do NOT open in new tabs by default — that requires target="_blank" (MDN <a>: "_blank: Usually a new tab"). Reword: "Works with Enter; add target=\"_blank\" to open in a new tab." |
| 9 | "Screen reader users jump by headings." | 71 | unverified | (none) | 2026-11-14 | True in practice for common screen readers, but no official/W3C/MDN source confirming the navigation behavior was found or checked. Remove, or cite a screen-reader manual (not a primary spec). |
| 10 | "Use one `h1`." | 71 | confirmed | https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/Heading_Elements | 2026-11-14 | MDN heading elements usage notes: "A page should generally have a single <h1> element"; also "Avoid using multiple <h1> elements on one page". |
| 11 | "`ul`, `ol`, `li` — Announced as 'list, 5 items'." | 73 | unverified | (none) | 2026-11-14 | Screen-reader-specific phrasing; the exact announcement depends on the screen reader. No primary source checked. Remove the quoted announcement or attribute it loosely ("announced as a list"). |
| 12 | "`input`, `select`, `textarea` with `label` — The label is read with the field." | 74 | confirmed | https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/label | 2026-11-14 | MDN <label>: "a screen reader will read out the label when the user is focused on the form input". `for`/`id` association confirmed. |
| 13 | "`table` — Header cells are tied to their data." | 75 | confirmed | https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/th | 2026-11-14 | MDN <th>: header cell; "The exact nature of this group is defined by the scope and headers attributes" — scope/headers tie the header to its data cells. |
| 14 | "`img` with `alt` text — Alt text is what a screen reader reads." | 76 | confirmed | https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/img | 2026-11-14 | MDN <img>: "screen readers read the attribute value out to their users so they know what the image means"; alt="" marks images as decorative/tracking (not announced). |
| 15 | "A clickable `div` looks like a button but has no keyboard support and no role." | 78 | corrected | https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/div | 2026-11-14 | MDN <div>: "The <div> element has an implicit role of generic, and not none." A raw div is not keyboard-focusable/operable by default (that part is correct), but it is not role-less. Reword: "...has no keyboard support by default and no meaningful accessible role (implicit role: generic)." |
| 16 | "Headings should nest in order: h1, then h2, then h3... Choose a heading level for its **meaning**, not its size. Size is the job of CSS" | 82 | confirmed | https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/Heading_Elements | 2026-11-14 | MDN heading elements usage notes: "Do not skip heading levels: always start from <h1>, followed by <h2> and so on"; "Do not use heading elements to resize text. Instead, use the CSS font-size property." |
| 17 | "`type=\"email\"` brings up the right keyboard on phones." | 92 | confirmed | https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input/email | 2026-11-14 | MDN input type="email": "Looks like a text input, but has validation parameters and relevant keyboard in supporting browsers and devices with dynamic keyboards." |
| 18 | "`required` marks the field as needed." | 93 | confirmed | https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/required | 2026-11-14 | MDN required attribute: "the user must specify a value for the input before the owning form can be submitted." |
| 19 | "`autocomplete=\"email\"`" + "label for / for attribute connects the words to the field" | 87-91 | confirmed | https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/label | 2026-11-14 | MDN <label>: for attribute takes the id of the labelable control, "associating the <label> with that form control"; clicking the label activates the control (first control in document order). |
| 20 | "This image is decorative, so empty alt text" (annotation example) | 97 | confirmed | https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/img | 2026-11-14 | MDN <img>: alt="" "indicates that this image is not a key part of the content (it's decoration or a tracking pixel), and that non-visual browsers may omit it". |

## Sources to footnote
[1]: HTML: HyperText Markup Language — MDN Web Docs (Mozilla). <https://developer.mozilla.org/en-US/docs/Web/HTML>. Accessed 2026-11-14.
  - Covers line 10: HTML defines the meaning and structure of web content.
[2]: Element — MDN Web Docs (Mozilla) Glossary. <https://developer.mozilla.org/en-US/docs/Glossary/Element>. Accessed 2026-11-14.
  - Covers line 26: element = opening tag + enclosed content + closing tag; tags vs elements.
[3]: Doctype — MDN Web Docs (Mozilla) Glossary. <https://developer.mozilla.org/en-US/docs/Glossary/Doctype>. Accessed 2026-11-14.
  - Covers line 41: "<!doctype html>" required preamble; prevents quirks mode.
[4]: <meta name="viewport"> — MDN Web Docs (Mozilla). <https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/meta/name/viewport>. Accessed 2026-11-14.
  - Covers line 57: width=device-width = screen width in CSS pixels; recommended; mobile defaults to virtual ~980px otherwise.
[5]: <head> HTML document metadata element — MDN Web Docs (Mozilla). <https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/head>. Accessed 2026-11-14.
  - Covers line 59: metadata container; not displayed.
[6]: global attribute lang — MDN Web Docs (Mozilla). <https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/lang>. Accessed 2026-11-14.
  - Covers line 61: lets assistive tech (screen readers) invoke the correct pronunciation.
[7]: Button pattern — W3C WAI ARIA Authoring Practices. <https://www.w3.org/WAI/ARIA/apg/patterns/button/>. Accessed 2026-11-14.
  - Covers line 69: Space and Enter both activate a button.
[8]: Link pattern — W3C WAI ARIA Authoring Practices. <https://www.w3.org/WAI/ARIA/apg/patterns/link/>. Accessed 2026-11-14.
  - Covers line 70: Enter executes the link; new tab requires target="_blank" (see MDN <a target>).
[9]: Heading elements (<h1>–<h6>) — MDN Web Docs (Mozilla). <https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/Heading_Elements>. Accessed 2026-11-14.
  - Covers lines 71, 82: single h1 preferred; do not skip levels (start h1 → h2); do not use headings to resize text, use CSS font-size.
[10]: <ul> HTML unordered list element — MDN Web Docs (Mozilla). <https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/ul>. Accessed 2026-11-14.
  - Covers line 73: lists are natively structured elements (announcement phrasing itself not documented here).
[11]: <label> HTML label element — MDN Web Docs (Mozilla). <https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/label>. Accessed 2026-11-14.
  - Covers lines 74, 87-91: for/id association; screen reader reads the label with the focused input.
[12]: <th> HTML table header element — MDN Web Docs (Mozilla). <https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/th>. Accessed 2026-11-14.
  - Covers line 75: scope/headers tie header cells to data cells.
[13]: <img> HTML image element — MDN Web Docs (Mozilla). <https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/img>. Accessed 2026-11-14.
  - Covers lines 76, 97: alt text read by screen readers; alt="" for decorative images.
[14]: <div> HTML Content Division element — MDN Web Docs (Mozilla). <https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/div>. Accessed 2026-11-14.
  - Covers line 78: div has implicit role "generic"; no keyboard support by default.
[15]: <input type="email"> — MDN Web Docs (Mozilla). <https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input/email>. Accessed 2026-11-14.
  - Covers line 92: email input shows a relevant keyboard on dynamic-keyboard devices.
[16]: required HTML attribute — MDN Web Docs (Mozilla). <https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/required>. Accessed 2026-11-14.
  - Covers line 93: user must fill the field before form submission.

## Accessibility and readability issues
- Heading order problem: first heading after front matter is `### Think of a house` (line 12), before any `##`. Promote to `##`. All later `##` headings are in order.
- Tables: both tables (lines 16-20, 67-76) have header rows. OK.
- Links: no "click here"; link texts ("JavaScript basics", "CSS basics") are descriptive. Internal links target existing files. No external links.
- Unverified claims to remove/reword: line 71 "Screen reader users jump by headings" (no primary source; screen-reader-specific behavior) and line 73 "Announced as 'list, 5 items'" (phrasing varies by screen reader).
- Line 70 correction: "opens in new tabs" is wrong as written — needs target="_blank". Also worth noting Space does not activate links (Space scrolls).
- Line 78 correction: div is not role-less; implicit role is "generic".
- Line 65: "free keyboard behavior and free accessibility" oversells — semantic elements improve baseline accessibility but don't guarantee it (contrast, labels, focus order still required). Reword to "built-in keyboard behavior and a baseline of accessibility".
- Line 71: "Use one h1" is good; keep. MDN also permits multiple h1s when unnested, but single-h1 is the documented best practice.
- Line 22: "a page with no CSS is still a usable page" — true and good for readability; no change.
- Plain language: good throughout; no long or convoluted sentences flagged.


## icon-types

Reviewed 2026-11-14. Source: guides/icon-types.md (88 lines). No guide files were modified.

## Claims

| # | Claim (short quote of the fact) | Line | Status | Source (URL) | Date | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | "Common sizes are 16, 20, 24 and 32 px. 24px is the usual default." | 27 | unverified | none found | 2026-11-14 | Design convention; no official source states this list or that 24px is "the usual default". Material Symbols default opsz is 24dp (https://developers.google.com/fonts/docs/material_symbols) and Material icons are designed on a 24dp grid, which supports 24 as common on Android/Material, but not the full list nor "usual default" across all products. Reword as "common sizes include 16/20/24/32; 24 is Material's baseline grid" or drop. |
| 2 | "A 24px icon button should still have a 44px (iOS) or 48px (Android) touch area." | 29 | confirmed | https://developer.apple.com/design/human-interface-guidelines/buttons ; https://m3.material.io/foundations/designing/structure | 2026-11-14 | Apple HIG Buttons: "a button needs a hit region of at least 44x44 pt". Material 3 "Structure": "an icon may appear to be 24 x 24dp, but the padding surrounding it comprises the full 48 x 48dp touch target... consider making touch targets at least 48 x 48dp." Unit note: Apple uses points, Material uses dp; guide writes "px". Substantively right; fix units to pt/dp for accuracy. |
| 3 | "SVG... Sharp at all sizes. Can be inline, an image file, or a sprite." | 35 | confirmed | https://developer.mozilla.org/en-US/docs/Web/Media/Formats/Image_types | 2026-11-14 | MDN Image file type guide: SVG is a vector format "ideal for user interface elements, icons, diagrams... must be drawn accurately at different sizes"; "SVG can be used in web content in three ways" (inline, iframe/object/embed, img/background). "Sprite" is not on the MDN page but is standard practice; the three listed ways are confirmed. |
| 4 | "Inline SVG can take its color from CSS using `currentColor`." | 35 | confirmed | https://developer.mozilla.org/en-US/docs/Web/CSS/color_value | 2026-11-14 | MDN color_value: "The currentColor keyword represents the value of an element's color property." Inline SVG inherits CSS color, so fill="currentColor" works. |
| 5 | "Icon font... Harder to make accessible and can fail to load. Most teams now prefer SVG." | 36 | unverified | none found | 2026-11-14 | No official/primary source found for the accessibility difficulty, load-failure, or "most teams now prefer SVG" claims. They are editorial. Reword as practice guidance without the market-share claim, or remove the sentence. |
| 6 | "Export at 1x, 2x and 3x." | 37 | confirmed | https://web.dev/learn/performance/image-performance | 2026-11-14 | web.dev Learn (Image performance) uses srcset pixel-density descriptors "1x, 2x, 3x" and explains DPR-based sizing ("if the device has a DPR of 3, then a square 1500 pixel image would be the optimal size"). Consistent with the guide's advice. |
| 7 | "Decorative icon next to text. Hide it from screen readers (`aria-hidden=\"true\"`)." | 44 | confirmed | https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-hidden | 2026-11-14 | MDN aria-hidden: hides non-interactive content from the accessibility API; lists "Purely decorative content, such as icons or images" as a use case. |
| 8 | "Icon-only button. It needs a name, for example `aria-label=\"Delete\"`, and ideally a tooltip." | 45 | confirmed | https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-label | 2026-11-14 | MDN aria-label: common example is "a button containing an SVG icon without any text"; aria-label provides an accessible name. The "ideally a tooltip" part is practice guidance, not from the cited source. |
| 9 | "Icons that carry meaning need 3:1 contrast against the background." | 47 | confirmed | https://www.w3.org/TR/WCAG22/ | 2026-11-14 | WCAG 2.2 SC 1.4.11 Non-text Contrast (AA): UI components and "Graphical Objects" required to understand content need 3:1 against adjacent colors. Scope nuance: applies to icons required for understanding/operation; inactive components and pure decoration are excepted. Guide's wording ("carry meaning") matches the spirit. |
| 10 | "SF Symbols... Thousands of symbols that scale with text and weight. Licensed for apps on Apple platforms, so check Apple's terms before using them elsewhere." | 53 | confirmed | https://developer.apple.com/sf-symbols/ ; https://developer.apple.com/design/human-interface-guidelines/sf-symbols | 2026-11-14 | Apple SF Symbols page: "a library of over 7,000 symbols... come in nine weights and three scales, automatically align with text". HIG SF Symbols page: "Be sure to understand the terms and conditions for using SF Symbols, including the prohibition against using symbols... in app icons, logos, or any other trademarked use." The platform restriction is in the SF Symbols license agreement bundled with the app; Apple's pages direct users to those terms. Guide's summary is accurate. |
| 11 | "Material Symbols... Variable icons with adjustable weight, fill, grade and optical size. Free to use under the Apache 2.0 license." | 54 | confirmed | https://developers.google.com/fonts/docs/material_symbols | 2026-11-14 | Google Fonts Material Symbols guide: "four adjustable variable font axes (fill, weight, grade, and optical size)"; "Material Symbols are available under the Apache License Version 2.0." Also repo google/material-design-icons LICENSE = Apache-2.0 (verified via GitHub API). |
| 12 | "Follow the Human Interface Guidelines (Apple) and Material Design (Google) for how to use them." | 55 | confirmed | https://developer.apple.com/design/human-interface-guidelines/ ; https://m3.material.io/ | 2026-11-14 | Both official guideline sites exist and are the canonical usage references for their platforms. |
| 13 | "Material Icons (Google) | Apache 2.0" | 65 | confirmed | https://github.com/google/material-design-icons (LICENSE) | 2026-11-14 | GitHub API license check: spdx_id Apache-2.0. |
| 14 | "Lucide | ISC" | 66 | confirmed | https://github.com/lucide-icons/lucide (LICENSE) | 2026-11-14 | Raw LICENSE file: "ISC License, Copyright (c) 2026 Lucide Icons and Contributors". |
| 15 | "Feather | MIT" | 67 | confirmed | https://github.com/feathericons/feather (LICENSE) | 2026-11-14 | GitHub API license check: MIT. |
| 16 | "Heroicons (Tailwind CSS) | MIT" | 68 | confirmed | https://github.com/tailwindlabs/heroicons (LICENSE) | 2026-11-14 | GitHub API license check: MIT. |
| 17 | "Phosphor | MIT" | 69 | confirmed | https://github.com/phosphor-icons/core (LICENSE) | 2026-11-14 | GitHub API license check: MIT. |
| 18 | "Tabler Icons | MIT" | 70 | confirmed | https://github.com/tabler/tabler-icons (LICENSE) | 2026-11-14 | GitHub API license check: MIT. |
| 19 | "Bootstrap Icons | MIT" | 71 | confirmed | https://github.com/twbs/icons (LICENSE) | 2026-11-14 | Raw LICENSE: "The MIT License (MIT), Copyright (c) 2019-2024 The Bootstrap Authors". Note: repo moved from twbs/bootstrap-icons to twbs/icons; the old URL redirects. |
| 20 | "Carbon (IBM) | Apache 2.0" | 72 | confirmed | https://github.com/carbon-design-system/carbon (LICENSE) | 2026-11-14 | GitHub API license check: Apache-2.0. |
| 21 | "Fluent UI (Microsoft) | MIT" | 73 | confirmed | https://github.com/microsoft/fluentui (LICENSE) | 2026-11-14 | Raw LICENSE: "MIT License, Copyright (c) Microsoft Corporation." (GitHub API marked the repo "NOASSERTION" because of mixed content; the top-level LICENSE is MIT.) |
| 22 | "Ionicons | MIT" | 74 | confirmed | https://github.com/ionic-team/ionicons (LICENSE) | 2026-11-14 | GitHub API license check: MIT. |
| 23 | "Octicons (GitHub Primer) | MIT" | 75 | confirmed | https://github.com/primer/octicons (LICENSE) | 2026-11-14 | GitHub API license check: MIT. |
| 24 | "Iconoir | MIT" | 76 | confirmed | https://github.com/iconoir-icons/iconoir (LICENSE) | 2026-11-14 | Raw LICENSE: "MIT License, Copyright (c) 2021 Luca Burgio". Repo path is iconoir-icons/iconoir (not iconoir/iconoir). |
| 25 | "Eva Icons | MIT" | 77 | confirmed | https://github.com/akveo/eva-icons (LICENSE) | 2026-11-14 | GitHub API license check: MIT. |
| 26 | "Majesticons | MIT" | 78 | corrected | https://github.com/halfmage/majesticons (LICENSE) ; https://majesticons.com/license | 2026-11-14 | Corrected fact: the GitHub repo halfmage/majesticons is MIT, but it is the free subset — the site states "a subset of 760 icons is MIT-licensed on npm as 'majesticons'... The full set of 11,000+ icons requires a paid license" (Solo €129 / Team €299). So "MIT" for the library as a whole is wrong; only the free subset is MIT. |
| 27 | "Teenyicons | MIT" | 79 | confirmed | https://github.com/teenyicons/teenyicons.com (LICENSE) ; https://github.com/smhmd/teenyicons (LICENSE) ; https://registry.npmjs.org/teenyicons/latest | 2026-11-14 | Raw LICENSE (teenyicons/teenyicons.com master): "MIT License". Original repo smhmd/teenyicons is MIT per GitHub API. npm registry metadata for package teenyicons: license MIT. (npmjs.com UI page was Cloudflare-blocked; verified via registry API and raw LICENSE files instead.) |
| 28 | "Pixelarticons | MIT" | 80 | confirmed | https://github.com/halfmage/pixelarticons (LICENSE) | 2026-11-14 | Raw LICENSE: "MIT License, Copyright (c) 2019 Gerrit Halfmann". Note: pixelarticons.com also sells a Pro tier; the GitHub repo's icons are MIT. |
| 29 | "Styles in Browse" column (e.g., "Outline, filled, rounded, sharp, duotone") | 63-80 | unverified | none | 2026-11-14 | Internal site data (what Browse shows per library). Cannot be verified externally; treat as internal, verify against the site's own data when maintaining. |

Note: line 59 "Browse has every library below as real icons..." is internal site functionality, not an external fact.

## Sources to footnote

[1]: Human Interface Guidelines: Buttons — Apple Developer. https://developer.apple.com/design/human-interface-guidelines/buttons. Accessed 2026-11-14.
  - Needs [^1] at line 29 ("44px (iOS)" hit region; Apple says 44x44 pt).
[2]: Designing: Structure (touch and pointer target sizes) — Material Design 3, Google. https://m3.material.io/foundations/designing/structure. Accessed 2026-11-14.
  - Needs [^2] at line 29 ("48px (Android)" touch area; Material says 48x48dp).
[3]: Image file type and format guide — Mozilla Developer Network. https://developer.mozilla.org/en-US/docs/Web/Media/Formats/Image_types. Accessed 2026-11-14.
  - Needs [^3] at line 35 (SVG vector, sharp at all sizes, inline/img/background usage).
[4]: color_value — Mozilla Developer Network. https://developer.mozilla.org/en-US/docs/Web/CSS/color_value. Accessed 2026-11-14.
  - Needs [^4] at line 35 (currentColor keyword).
[5]: Image performance — web.dev (Google). https://web.dev/learn/performance/image-performance. Accessed 2026-11-14.
  - Needs [^5] at line 37 (1x/2x/3x pixel-density exports; DPR explanation).
[6]: ARIA: aria-hidden attribute — Mozilla Developer Network. https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-hidden. Accessed 2026-11-14.
  - Needs [^6] at line 44 (aria-hidden="true" for decorative icons).
[7]: ARIA: aria-label attribute — Mozilla Developer Network. https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-label. Accessed 2026-11-14.
  - Needs [^7] at line 45 (icon-only button needs accessible name via aria-label).
[8]: Web Content Accessibility Guidelines (WCAG) 2.2 — W3C. https://www.w3.org/TR/WCAG22/. Accessed 2026-11-14.
  - Needs [^8] at line 47 (SC 1.4.11 Non-text Contrast, 3:1 for graphical objects).
[9]: SF Symbols — Apple Developer. https://developer.apple.com/sf-symbols/. Accessed 2026-11-14.
  - Needs [^9] at line 53 (over 7,000 symbols; nine weights, three scales; align with text).
[10]: SF Symbols — Human Interface Guidelines, Apple Developer. https://developer.apple.com/design/human-interface-guidelines/sf-symbols. Accessed 2026-11-14.
  - Needs [^10] at line 53 (terms and conditions for using SF Symbols; trademark-use prohibition).
[11]: Material Symbols guide — Google Fonts / Google for Developers. https://developers.google.com/fonts/docs/material_symbols. Accessed 2026-11-14.
  - Needs [^11] at line 54 (four variable axes: fill, weight, grade, optical size; Apache License Version 2.0).
[12]: Human Interface Guidelines — Apple Developer. https://developer.apple.com/design/human-interface-guidelines/. Accessed 2026-11-14.
  - Needs [^12] at line 55.
[13]: Material Design 3 — Google. https://m3.material.io/. Accessed 2026-11-14.
  - Needs [^13] at line 55.
[14]: google/material-design-icons LICENSE (Apache-2.0) — GitHub. https://github.com/google/material-design-icons. Accessed 2026-11-14.
  - Needs [^14] at line 65 (Material Icons license).
[15]: lucide-icons/lucide LICENSE (ISC) — GitHub. https://github.com/lucide-icons/lucide. Accessed 2026-11-14.
  - Needs [^15] at line 66.
[16]: feathericons/feather LICENSE (MIT) — GitHub. https://github.com/feathericons/feather. Accessed 2026-11-14.
  - Needs [^16] at line 67.
[17]: tailwindlabs/heroicons LICENSE (MIT) — GitHub. https://github.com/tailwindlabs/heroicons. Accessed 2026-11-14.
  - Needs [^17] at line 68.
[18]: phosphor-icons/core LICENSE (MIT) — GitHub. https://github.com/phosphor-icons/core. Accessed 2026-11-14.
  - Needs [^18] at line 69.
[19]: tabler/tabler-icons LICENSE (MIT) — GitHub. https://github.com/tabler/tabler-icons. Accessed 2026-11-14.
  - Needs [^19] at line 70.
[20]: twbs/icons LICENSE (MIT) — GitHub. https://github.com/twbs/icons. Accessed 2026-11-14.
  - Needs [^20] at line 71 (Bootstrap Icons; repo renamed from twbs/bootstrap-icons).
[21]: carbon-design-system/carbon LICENSE (Apache-2.0) — GitHub. https://github.com/carbon-design-system/carbon. Accessed 2026-11-14.
  - Needs [^21] at line 72.
[22]: microsoft/fluentui LICENSE (MIT) — GitHub. https://github.com/microsoft/fluentui. Accessed 2026-11-14.
  - Needs [^22] at line 73.
[23]: ionic-team/ionicons LICENSE (MIT) — GitHub. https://github.com/ionic-team/ionicons. Accessed 2026-11-14.
  - Needs [^23] at line 74.
[24]: primer/octicons LICENSE (MIT) — GitHub. https://github.com/primer/octicons. Accessed 2026-11-14.
  - Needs [^24] at line 75.
[25]: iconoir-icons/iconoir LICENSE (MIT) — GitHub. https://github.com/iconoir-icons/iconoir. Accessed 2026-11-14.
  - Needs [^25] at line 76.
[26]: akveo/eva-icons LICENSE (MIT) — GitHub. https://github.com/akveo/eva-icons. Accessed 2026-11-14.
  - Needs [^26] at line 77.
[27]: halfmage/majesticons LICENSE (MIT, free subset) — GitHub, and Majesticons license page. https://github.com/halfmage/majesticons ; https://majesticons.com/license. Accessed 2026-11-14.
  - Needs [^27] at line 78 (only the 760-icon free subset is MIT; full set is paid — claim must be corrected).
[28]: teenyicons/teenyicons.com LICENSE (MIT) — GitHub, and smhmd/teenyicons. https://github.com/teenyicons/teenyicons.com ; https://github.com/smhmd/teenyicons. Accessed 2026-11-14.
  - Needs [^28] at line 79.
[29]: halfmage/pixelarticons LICENSE (MIT) — GitHub. https://github.com/halfmage/pixelarticons. Accessed 2026-11-14.
  - Needs [^29] at line 80 (repo is MIT; pixelarticons.com also sells a Pro tier).

## Accessibility and readability issues

- Heading order: correct (all sections are `##` under the intro; no skipped levels).
- Tables: all three tables (Styles, Formats, Free libraries) have header rows. Good.
- No "click here" links; the only link text is "View all libraries in Browse" (internal). No color-only meaning; style names are written out, not shown by color.
- No external links in the guide body (all sources are implicit); the license table is the only place needing footnotes — add [^n] markers per the Sources list above.
- Unverifiable claims to reword/remove: line 27 (size list + "24px is the usual default"), line 36 ("Most teams now prefer SVG" and icon-font accessibility/load claims), and the "Styles in Browse" column (lines 63-80, internal data).
- Factual correction needed: line 78 Majesticons "MIT" is only true for the free 760-icon subset; the full set is paid.
- Unit precision: line 29 says "44px (iOS) or 48px (Android)"; Apple says 44x44 pt and Material says 48x48 dp — fix "px" to "pt"/"dp".
- Line 59 "Browse has every library below as real icons you can filter by design system and style" is internal site copy; keep it out of the footnote list.


## image-formats

Reviewed 2026-11-14. Source: guides/image-formats.md (64 lines). No guide files were modified.

## Claims

| # | Claim (short quote of the fact) | Line | Status | Source (URL) | Date | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | "The big split is raster (a grid of pixels) versus vector (shapes described by math)." | 10 | confirmed | https://developer.mozilla.org/en-US/docs/Web/Media/Formats/Image_types | 2026-11-14 | MDN: SVG is a "Vector image format"; PNG/JPEG/GIF/WebP/AVIF are pixel-based raster formats. Correct framing. |
| 2 | "PNG ... Raster, lossless ... Transparency: Yes" | 16 | confirmed | https://developer.mozilla.org/en-US/docs/Web/Media/Formats/Image_types | 2026-11-14 | MDN PNG section: "The PNG format uses lossless compression, while supporting higher color depths than GIF and being more efficient, as well as featuring full alpha transparency support." Also: "Compression: Lossless." |
| 3 | "JPG (JPEG) ... Raster, lossy ... No transparency" | 17 | confirmed | https://developer.mozilla.org/en-US/docs/Web/Media/Formats/Image_types | 2026-11-14 | MDN JPEG section: "The most widely used lossy compression format for still images... useful for photographs"; "JPEG does not support an alpha channel"; lossy DCT-based compression. |
| 4 | "Blurry edges and artifacts on text and flat color. Repeated saving lowers quality." | 17 | unverified | none found | 2026-11-14 | First half is supported (MDN JPEG: "applying lossy compression to content requiring sharpness, like diagrams or charts, can produce unsatisfactory results"). Second half ("repeated saving lowers quality") is generational-loss fact with no primary source located on the cited pages; mark as generally true but unsourced — reword or drop, or cite an image tool's documentation. |
| 5 | "WebP ... lossy or lossless ... Transparency: Yes ... smaller files" | 18 | confirmed | https://developer.mozilla.org/en-US/docs/Web/Media/Formats/Image_types | 2026-11-14 | MDN WebP section: lossy (VP8 predictive coding) and lossless modes; "WebP offers much better compression than PNG or JPEG"; lossless WebP ~26% smaller than PNG; supports transparency; supports animation. "All-round replacement" phrasing is editorial; "Much smaller" is confirmed. |
| 6 | "Very old software may not open it" (WebP historical support) | 18 | confirmed | https://developer.mozilla.org/en-US/docs/Web/Media/Formats/Image_types | 2026-11-14 | MDN WebP section: "WebP now has broad support in the latest versions of major web browsers, although it does not have deep historical support. Provide a fallback in either JPEG or PNG format, such as with the <picture> element." |
| 7 | "AVIF ... lossy or lossless ... Transparency: Yes" | 19 | confirmed | https://developer.mozilla.org/en-US/docs/Web/Media/Formats/Image_types | 2026-11-14 | MDN AVIF section: "Excellent lossy compression compared to JPG and PNG... Generally, AVIF has better compression than WebP"; also supports "Lossless compression" and "Alpha channel support (i.e., for transparency)". |
| 8 | "Photos at the smallest file size" (AVIF) | 19 | confirmed | https://developer.mozilla.org/en-US/docs/Web/Media/Formats/Image_types | 2026-11-14 | MDN: AVIF offers state-of-the-art features and performance; "lossy AVIF images are around 50% smaller than JPEG images". Supported by the cited page. |
| 9 | "Slower to create. Provide a fallback for older browsers." | 19 | corrected | https://developer.mozilla.org/en-US/docs/Web/Media/Formats/Image_types | 2026-11-14 | Corrected fact: fallback is required (MDN: "support is not yet comprehensive... you should provide a fallback in WebP, JPEG or PNG format using the <picture> element") — keep the fallback sentence. The "Slower to create" half has no primary source: MDN describes AVIF as "high performance" and even suggests avoiding it mainly for very large files (no progressive rendering). Reword to "slower to encode than JPEG" only if an encoding-speed source is added, or drop. Do not assert the fallback applies to current browsers — AVIF is supported Chrome 85+, Firefox 93+, Safari 16.1+. |
| 10 | "GIF ... Raster, 256 colors ... 1-bit only" | 20 | confirmed | https://developer.mozilla.org/en-US/docs/Web/Media/Formats/Image_types | 2026-11-14 | MDN GIF section: "8-bit indexed color graphics"; color table is a power of two with up to 256 entries; "a specific color index is designated as transparent" (single-index transparency = 1-bit); supports simple animation. |
| 11 | "Big files and rough color. Prefer video or animated WebP." | 20 | confirmed | https://web.dev/articles/replace-gifs-with-videos ; https://developer.mozilla.org/en-US/docs/Web/Media/Formats/Image_types | 2026-11-14 | web.dev "Replace animated GIFs with video" (also Lighthouse audit "Use video formats for animated content") shows GIF 3.7 MB vs MP4 551 KB / WebM 341 KB. MDN GIF section recommends "consider WebP, AVIF or APNG for animation sequences". web.dev URL: https://web.dev/articles/replace-gifs-with-videos. |
| 12 | "SVG ... Vector ... Not for photos." | 21 | confirmed | https://developer.mozilla.org/en-US/docs/Web/Media/Formats/Image_types | 2026-11-14 | MDN SVG section: "not generally useful for strictly bitmap or photographic images, although it is possible to include bitmap images within an SVG." |
| 13 | "Complex files can get heavy." | 21 | unverified | none found | 2026-11-14 | No primary source stating complex/heavy SVG claim on the referenced pages. Reasonable but unsourced editorial — reword ("very complex SVG scenes can be large") or drop. |
| 14 | "Lossless keeps every pixel exactly. PNG is lossless. Lossy ... JPG is lossy." | 25-26 | confirmed | https://developer.mozilla.org/en-US/docs/Web/Media/Formats/Image_types | 2026-11-14 | MDN PNG: "Compression: Lossless." MDN JPEG: "Compression: Lossy; based on the discrete cosine transform." |
| 15 | "A quality setting around 70 to 85 percent is a common balance." | 26 | corrected | https://web.dev/learn/performance/image-performance | 2026-11-14 | Corrected fact: web.dev explicitly says "When compressing, there isn't a universal setting suitable for all cases. The recommended approach would be to experiment with different compression levels until you find a good compromise between image quality and file size." No primary source backs a 70-85% range; remove the number or reword to "pick a quality setting by eye, since there is no universal value." |
| 16 | "Use WebP or AVIF, with JPG as a fallback." | 30 | confirmed | https://developer.mozilla.org/en-US/docs/Web/Media/Formats/Image_types | 2026-11-14 | MDN WebP and AVIF sections both recommend providing a fallback via <picture>; JPEG is the universally supported fallback. |
| 17 | "A screenshot or an interface mockup. Use PNG, or lossless WebP." | 31 | confirmed | https://developer.mozilla.org/en-US/docs/Web/Media/Formats/Image_types | 2026-11-14 | MDN JPEG section: lossy compression is unsatisfactory for "content requiring sharpness, like diagrams or charts, or text"; PNG/lossless WebP keep sharp edges. Direction correct. |
| 18 | "A logo or icon. Use SVG. It stays sharp at any size and can change color with CSS." | 32 | confirmed | https://developer.mozilla.org/en-US/docs/Web/Media/Formats/Image_types | 2026-11-14 | MDN SVG: "must be drawn accurately at different sizes... SVG will smoothly scale to the desired size"; MDN color_value for currentColor; inline <svg> inherits CSS (see icon-types #4). |
| 19 | "Use a muted video, or animated WebP. Avoid GIF for anything long." | 33 | confirmed | https://web.dev/articles/replace-gifs-with-videos ; https://developer.mozilla.org/en-US/docs/Web/Media/Formats/Image_types | 2026-11-14 | web.dev recommends video (autoplay+loop+muted+playsinline) instead of GIF. MDN: WebP supports animation (and APNG). Note: guide says "muted video" — correct Autoplay policies require muted+playsinline for inline autoplay. |
| 20 | "A transparent product cutout. Use PNG, WebP or AVIF." | 34 | confirmed | https://developer.mozilla.org/en-US/docs/Web/Media/Formats/Image_types | 2026-11-14 | All three support alpha: PNG full alpha transparency; WebP transparency; AVIF alpha channel support. |
| 21 | "A screen with a pixel ratio of 2 needs an image twice as wide as its on-screen size to look sharp." | 38 | confirmed | https://developer.mozilla.org/en-US/docs/Web/API/Window/devicePixelRatio ; https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img | 2026-11-14 | MDN devicePixelRatio: ratio of physical to CSS pixels. MDN img srcset: pixel-density descriptor "2x ... to be used when the pixel density is double the standard density". web.dev Learn confirms DPR-based sizing (DPR 3 -> 1500px for a 500px slot). |
| 22 | "Export raster images at 1x, 2x and often 3x." | 40 | confirmed | https://web.dev/learn/performance/image-performance | 2026-11-14 | web.dev Learn: srcset "image-500.jpg 1x, image-1000.jpg 2x, image-1500.jpg 3x". Guidance-level claim; example matches. |
| 23 | "Give every meaningful image alt text... Use empty alt text (alt=\"\") for decoration." | 46 | confirmed | https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img | 2026-11-14 | MDN img alt attribute: "Setting this attribute to an empty string (alt=\"\") indicates that this image is not a key part of the content... and that non-visual browsers may omit it from rendering." Provide a useful value for alt whenever possible. |
| 24 | "Put text in real HTML text, not inside images, so it can be read, resized and translated." | 47 | confirmed | https://www.w3.org/TR/WCAG22/ | 2026-11-14 | WCAG 2.2 SC 1.4.5 Images of Text (AA): "text is used to convey information rather than images of text except for... Customizable... Essential." Real text beats images of text. |
| 25 | "Keep important images under a few hundred kilobytes when you can." | 48 | unverified | none found | 2026-11-14 | No official source gives a universal size budget. Guidance-level only; reword ("as small as is reasonable without visible quality loss") or drop the specific figure. |
| 26 | "Setting `width` and `height` reserves the space and stops the page from jumping as the image loads." | 62 | confirmed | https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img | 2026-11-14 | MDN img width/height: "Including height and width enables the aspect ratio of the image to be calculated by the browser prior to the image being loaded... reducing or even preventing a layout shift." |
| 27 | <picture> with avif/webp + jpg fallback example, browser picks best | 54-60 | confirmed | https://developer.mozilla.org/en-US/docs/Web/HTML/Element/picture | 2026-11-14 | MDN picture: browser examines each <source>'s srcset, media, and type to pick; <img> provides fallback and describes presentation. Example is correct and idiomatic. |

## Sources to footnote

[1]: Image file type and format guide — Mozilla Developer Network. https://developer.mozilla.org/en-US/docs/Web/Media/Formats/Image_types. Accessed 2026-11-14.
  - Needs [^1] at lines 10, 16-23, 25-26, 30-34, 38 (also supplies the raster/vector framing).
[2]: WebP image format — Mozilla Developer Network (same guide as [1]; keep one entry). https://developer.mozilla.org/en-US/docs/Web/Media/Formats/Image_types. Accessed 2026-11-14.
  - Needs [^2] at lines 18, 33 (WebP lossy/lossless, alpha, animation, historical support).
[3]: AV1 Image File Format (AVIF) — Mozilla Developer Network (same guide as [1]; keep one entry). https://developer.mozilla.org/en-US/docs/Web/Media/Formats/Image_types. Accessed 2026-11-14.
  - Needs [^3] at lines 19, 30, 56 (lossy/lossless, alpha, ~50% smaller than JPEG, fallback recommendation).
[4]: Window: devicePixelRatio property — Mozilla Developer Network. https://developer.mozilla.org/en-US/docs/Web/API/Window/devicePixelRatio. Accessed 2026-11-14.
  - Needs [^4] at line 38 (pixel ratio definition; 2x = twice the CSS-pixel width).
[5]: Image performance — web.dev (Google). https://web.dev/learn/performance/image-performance. Accessed 2026-11-14.
  - Needs [^5] at lines 26 (no universal quality setting; experiment), 38, 40 (srcset 1x/2x/3x; DPR).
[6]: Replace animated GIFs with video for faster page loads — web.dev (Google). https://web.dev/articles/replace-gifs-with-videos. Accessed 2026-11-14.
  - Needs [^6] at lines 20, 33 (GIF file sizes vs video; use <video autoplay loop muted playsinline>).
[7]: <img> HTML image embed element — Mozilla Developer Network. https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img. Accessed 2026-11-14.
  - Needs [^7] at lines 46 (alt, empty alt for decoration), 62 (width/height reserve space).
[8]: <picture> HTML picture element — Mozilla Developer Network. https://developer.mozilla.org/en-US/docs/Web/HTML/Element/picture. Accessed 2026-11-14.
  - Needs [^8] at lines 54-60 (picture/source/img fallback pattern).
[9]: Web Content Accessibility Guidelines (WCAG) 2.2 — W3C. https://www.w3.org/TR/WCAG22/. Accessed 2026-11-14.
  - Needs [^9] at line 47 (SC 1.4.5 Images of Text).
[10]: color_value (currentColor) — Mozilla Developer Network. https://developer.mozilla.org/en-US/docs/Web/CSS/color_value. Accessed 2026-11-14.
  - Needs [^10] at line 32 (SVG recolors with CSS).

Note: keep footnote numbering to the maintainer's final set; [2] and [3] above can be merged into [1].

## Accessibility and readability issues

- Heading order: correct (all `##` at top level, no skipped levels).
- Tables: quick-chooser table has a header row. Good.
- No "click here" links; no color-only meaning; internal links only.
- No external links to redirect.
- Sentence length and density are good for the audience; minor: "A transparent product cutout." phrasing (line 34) is fine.
- Vague/unsourced figure: line 48 "under a few hundred kilobytes" — no official target exists; reword or drop.
- Wrong specificity: line 26 "quality setting around 70 to 85 percent" — web.dev disclaims any universal setting; reword to an experiment-and-look instruction.
- line 19 "Slower to create" (AVIF encode time) is unsourced; the real documented caveat is missing progressive rendering and older-browser fallback.
- line 17 "Repeated saving lowers quality" is generational loss — true but unsourced on the cited page; soften to "re-saving a JPEG re-compresses it" or drop.
- No unverifiable-population claims like the JS guide; keep table statuses in the footnotes.


## ios-vs-android

Reviewed 2026-11-14 (the delegated read-only review finished at 17:32). Source: guides/ios-vs-android.md (~41 KB, 563 lines). Two facts corrected and applied in the guide: Material 3 body text is Body Large 16sp / Medium 14sp / Small 12sp (not "14 to 16sp"), and M3 motion is spring-based (not "emphasized easing"). Both are reflected in the guide's body and in its `## Where to read more` (35 footnotes, all 35 used, numbers re-matched). 0 claims removed; ~83 claims were left as `unverified` (visual/editorial footnotes) rather than invented. The full consolidated claim table and per-source notes follow in this file from line 776. Guide is verified and ticked in DESIGN.md (2026-11-14).


## javascript-basics

Reviewed 2026-11-14. Source: guides/javascript-basics.md (130 lines). No guide files were modified.

## Claims

| # | Claim (short quote of the fact) | Line | Status | Source (URL) | Date | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | "JavaScript is the language that makes a page do things." | 10 | confirmed | https://developer.mozilla.org/en-US/docs/Web/JavaScript | 2026-11-14 | MDN: "most well-known as the scripting language for Web pages." Checked page myself. |
| 2 | "It is a programming language that runs in the browser and can change the page after it loads." | 18 | confirmed | https://developer.mozilla.org/en-US/docs/Glossary/JavaScript | 2026-11-14 | MDN Glossary/JavaScript: "JavaScript is primarily used in the browser, enabling developers to manipulate webpage content through the DOM." |
| 3 | "It is not Java, which is a different language with a confusingly similar name." | 19 | confirmed | https://developer.mozilla.org/en-US/docs/Glossary/JavaScript | 2026-11-14 | MDN Glossary: "JavaScript should not be confused with the Java programming language. Although 'Java' and 'JavaScript' are trademarks... the two programming languages are significantly different in their syntax, semantics, and use cases." |
| 4 | "JavaScript runs in the visitor's browser, on their device... respond instantly, without reloading the page." | 27 | confirmed | https://developer.mozilla.org/en-US/docs/Web/JavaScript | 2026-11-14 | Client-side scripting model; DOM is mutated in place without navigation. Consistent with MDN DOM/DOMRequest docs; no page reload is involved. |
| 5 | "`click` — Mouse click, tap, or Enter or Space on a button" | 35 | confirmed | https://developer.mozilla.org/en-US/docs/Web/API/Element/click_event | 2026-11-14 | MDN: click fires when a pointing-device button is pressed+released inside the element, on a touch gesture, and on "any user interaction that is equivalent to a click, such as pressing Space or Enter while the element is focused" (elements with a default key handler). Pressing Space on a button fires click. Exact wording matches row. |
| 6 | "`mouseenter` — Pointer moves over an element (hover)" | 36 | confirmed | https://developer.mozilla.org/en-US/docs/Web/API/Element/mouseenter_event | 2026-11-14 | MDN: "The mouseenter event is fired at an Element when a pointing device (usually a mouse) is initially moved so that its hotspot is within the element." |
| 7 | "`keydown` — A key is pressed" | 37 | confirmed | https://developer.mozilla.org/en-US/docs/Web/API/Element/keydown_event | 2026-11-14 | MDN: "The keydown event is fired when a key is pressed." Exact match. |
| 8 | "`focus` — An element receives keyboard focus" | 38 | confirmed | https://developer.mozilla.org/en-US/docs/Web/API/Element/focus_event | 2026-11-14 | MDN: "The focus event fires when an element has received focus." Note: MDN describes focus as "an element has received focus" — it does not restrict to keyboard focus (it can also be focused by script or pointer). Minor overstatement of "keyboard" but acceptable in context. |
| 9 | "`submit` — A form is sent" | 39 | confirmed | https://developer.mozilla.org/en-US/docs/Web/API/HTMLFormElement/submit_event | 2026-11-14 | MDN: "The submit event fires when a form is submitted... when the user clicks a submit button, the user submits the form implicitly, a script calls requestSubmit()." Guide's wording "A form is sent" ≈ submitted. |
| 10 | Example style: `button[aria-expanded="true"]` selects by attribute | 98 | confirmed | https://developer.mozilla.org/en-US/docs/Web/CSS/Attribute_selectors | 2026-11-14 | MDN Attribute selectors: "[attr=value] Represents elements with an attribute name of attr whose value is exactly value." |
| 11 | "Use a real `button` or `a`, so Enter and Space work for free." | 110 | confirmed | https://developer.mozilla.org/en-US/docs/Web/API/Element/click_event | 2026-11-14 | MDN click_event: Space/Enter on a focused element with a default key event handler fires click (buttons do by default). WCAG 2.1.1 additionally requires keyboard operability of all functionality (https://www.w3.org/TR/WCAG22/). Note: `<a>` (link) is activated by Enter only; Space activates buttons. The guide lumps both "Enter and Space" — `<a>` does not fire on Space. Minor inaccuracy in the combined claim. |
| 12 | "When a dialog opens, focus moves into it. When it closes, focus returns to the button." | 111 | confirmed | https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/ | 2026-11-14 | WAI-ARIA APG Dialog (Modal) Pattern: "When a dialog opens, focus moves to an element contained in the dialog." And: "When a dialog closes, focus returns to the element that invoked the dialog." |
| 13 | "Use `aria-expanded`... so screen readers announce 'expanded' or 'collapsed'." | 112 | confirmed | https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-expanded | 2026-11-14 | MDN: "The aria-expanded attribute indicates to assistive technology whether the controlled element is expanded or collapsed" and is applied to the focusable, interactive control that toggles the controlled object (e.g., menus, dialogs, accordion panels). |
| 14 | "Let the Escape key close menus and dialogs." | 113 | confirmed | https://www.w3.org/WAI/ARIA/apg/patterns/menubar/ | 2026-11-14 | APG Dialog pattern: "Escape: Closes the dialog." APG Menu and Menubar pattern: "Escape: Close the menu that contains focus and return focus to the element or context... from which the menu was opened." |
| 15 | "Anything that opens on hover must also work with the keyboard and on touch screens, where there is no hover." | 106 | confirmed | https://www.w3.org/TR/WCAG22/ | 2026-11-14 | WCAG 2.1.1 Keyboard (Level A): "All functionality of the content is operable through a keyboard interface." WCAG 1.4.13 Content on Hover or Focus also governs content shown on hover/focus (dismissible, hoverable, persistent). Direction of the advice is correct. |
| 16 | "Does it respect reduced motion for animations?" (prefers-reduced-motion is real) | 126 | confirmed | https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion | 2026-11-14 | MDN: prefers-reduced-motion detects whether the user enabled a setting to minimize non-essential motion; used for @media (prefers-reduced-motion: reduce). |
| 17 | "Many people never use a mouse." | 104 | unverified | none found | 2026-11-14 | No primary/official source states this as a statistic. WCAG 2.1.1 (keyboard operability) is the defensible basis for the surrounding guidance; reword the sentence to cite keyboard operability rather than a percentage of users. |

Note on claim 11: Enter works on `<a>` and `<button>`; Space works on `<button>` but not on `<a>`. The guide's "Enter and Space work for free" combined with "`button` or `a`" is loose but not a factual error about buttons.
Note on claim 8: focus is not keyboard-only (script/pointer can trigger it); "keyboard focus" is imprecise but benign.

## Sources to footnote

[1]: Element: click event — Mozilla Developer Network. https://developer.mozilla.org/en-US/docs/Web/API/Element/click_event. Accessed 2026-11-14.
  - Needs [^1] at line 35 (click fires on mouse/tap/Enter/Space) and line 110 (Enter/Space on real button).
[2]: Element: mouseenter event — Mozilla Developer Network. https://developer.mozilla.org/en-US/docs/Web/API/Element/mouseenter_event. Accessed 2026-11-14.
  - Needs [^2] at line 36.
[3]: Element: keydown event — Mozilla Developer Network. https://developer.mozilla.org/en-US/docs/Web/API/Element/keydown_event. Accessed 2026-11-14.
  - Needs [^3] at line 37.
[4]: Element: focus event — Mozilla Developer Network. https://developer.mozilla.org/en-US/docs/Web/API/Element/focus_event. Accessed 2026-11-14.
  - Needs [^4] at line 38.
[5]: HTMLFormElement: submit event — Mozilla Developer Network. https://developer.mozilla.org/en-US/docs/Web/API/HTMLFormElement/submit_event. Accessed 2026-11-14.
  - Needs [^5] at line 39.
[6]: Attribute selectors — Mozilla Developer Network. https://developer.mozilla.org/en-US/docs/Web/CSS/Attribute_selectors. Accessed 2026-11-14.
  - Needs [^6] at line 98.
[7]: ARIA: aria-expanded attribute — Mozilla Developer Network. https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-expanded. Accessed 2026-11-14.
  - Needs [^7] at line 112.
[8]: Dialog (Modal) Pattern — WAI-ARIA Authoring Practices Guide, W3C. https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/. Accessed 2026-11-14.
  - Needs [^8] at line 111 (focus moves into dialog, returns to invoking button on close) and line 113 (Escape closes).
[9]: Menu and Menubar Pattern — WAI-ARIA Authoring Practices Guide, W3C. https://www.w3.org/WAI/ARIA/apg/patterns/menubar/. Accessed 2026-11-14.
  - Needs [^9] at line 113 (Escape closes menu and returns focus to the invoking element).
[10]: Web Content Accessibility Guidelines (WCAG) 2.2 — W3C. https://www.w3.org/TR/WCAG22/. Accessed 2026-11-14.
  - Needs [^10] at line 106 and line 114 (2.1.1 Keyboard; 1.4.13 Content on Hover or Focus) and, if rephrased, line 104.
[11]: prefers-reduced-motion CSS media feature — Mozilla Developer Network. https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion. Accessed 2026-11-14.
  - Needs [^11] at line 126.
[12]: JavaScript — Mozilla Developer Network. https://developer.mozilla.org/en-US/docs/Web/JavaScript (and Glossary: JavaScript, https://developer.mozilla.org/en-US/docs/Glossary/JavaScript). Accessed 2026-11-14.
  - Needs [^12] at line 10 (JS is a programming language for web pages), line 18, line 19 (not Java), line 27.

## Accessibility and readability issues

- Heading order: `### Back to the house` (line 12) is an h3 that appears before the first h2 (`## What JavaScript is and is not`, line 16). Guides must use `##` then `###` in order; either drop the `###` or promote it and keep level order.
- No "click here"-style link text anywhere. No color-only meaning. All tables have header rows.
- No external links to break; all links are internal site anchors (`#/guide/html-basics`, `#/guide/css-basics`) — not re-validated here (site routes, not repo files).
- Sentence 106 is fine but note the wording promise "where there is no hover" — touch devices do have limited hover emulation; harmless simplification for the audience.
- Sentence 104 ("Many people never use a mouse") is unsourced — reword to use WCAG 2.1.1 (keyboard operability) as the citation instead of a population claim.
- Sentence 10 ("This guide is a pretty cool extra") is informal; fine for the audience but keep tone consistent with other guides (not an a11y issue).
- Code blocks (`console.log`, `menu.hidden`) are fine and self-contained; no contrast or resizing concerns (block presentation).
- Unverifiable claim to remove/reword: line 104 ("Many people never use a mouse") — no official source; replace with WCAG 2.1.1 reference.


## setting-up-the-skills

Reviewed 2026-11-14. Source: guides/setting-up-the-skills.md (46 lines). No guide files were modified.
Per the task, internal repo facts (paths, zip names, the two skill names, the `/create-design-system` command, Design Systems tab) are marked `n/a (internal)`; only claims about external products/formats carry outside sources.

## Claims

| # | Claim (short quote of the fact) | Line | Status | Source (URL) | Date | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | "A **skill** is a folder of instructions that an AI assistant can load when a task matches." | 12 | confirmed | https://support.claude.com/en/articles/12512176-what-are-skills | 2026-11-14 | Anthropic Help Center: "Skills are folders of instructions, scripts, and resources that Claude loads dynamically to improve performance on specialized tasks." Matches. Minor: skills can also bundle scripts/resources, not "only instructions" — see #6. |
| 2 | Skill folder contains one `SKILL.md`; it is "the entry point. The assistant reads its short description to decide when to use the skill." | 26 | confirmed | https://docs.claude.com/en/docs/agents-and-tools/agent-skills/overview | 2026-11-14 | Anthropic: every Skill requires a `SKILL.md` with YAML frontmatter (`name`, `description`); "The `description` is what Claude matches your request against when determining whether to trigger the Skill"; Level-1 metadata (name+description) is loaded at startup. The "each zip contains one folder" half is internal and unverifiable — no `*.zip` files exist anywhere in the repo as of 2026-11-14 (checked with `find . -iname "*.zip"`). |
| 3 | "The steps below describe the common cases" / upload the zip on Claude web or desktop via Settings | 30-32 | corrected | https://support.claude.com/en/articles/12512180-using-skills-in-claude | 2026-11-14 | Corrected fact (Contents is right in spirit, wrong in detail): as of 2026-11-14, custom skills are uploaded at **Customize > Skills** (click "+" → "+ Create skill" → "Upload a skill" → upload a ZIP). `Settings > Capabilities` is only where you enable "Code execution and file creation" (a prerequisite on Free/Pro/Max/Ultra; Team/Enterprise use Organization settings > Plugins & skills, "Policy" tab). The guide also says "web or desktop"; Anthropic documents claude.ai (and Claude Code, API, Microsoft 365 add-ins) but not a separate desktop app in these articles — the desktop part is unverified. Reword: "On claude.ai, enable Code execution under Settings > Capabilities, then go to Customize > Skills and upload the zip files." |
| 4 | "For Claude Code that is `~/.claude/skills/` for all projects, or `.claude/skills/` inside one project." | 33 | confirmed | https://docs.claude.com/en/docs/claude-code/skills | 2026-11-14 | Claude Code docs ("Where skills live", verified in the live docs page): Personal `~/.claude/skills/<skill-name>/SKILL.md` — "all your projects on this machine"; Project `.claude/skills/<skill-name>/SKILL.md` — per project; also Nested `<subdir>/.claude/skills/...`, Additional directory, and Enterprise paths. Unzipping the two skill folders into those directories yields the documented layout. |
| 5 | "You can paste the contents of `SKILL.md` into the start of a chat" | 34 | confirmed | https://docs.claude.com/en/docs/agents-and-tools/agent-skills/overview | 2026-11-14 | Works because SKILL.md is prompt-like text; not a documented official workflow, but nothing prevents it and the file is plain markdown+YAML. Guidance-level; keep wording as suggestion, not as an Anthropic-supported path. |
| 6 | "Skills are just markdown." | 34 | corrected | https://docs.claude.com/en/docs/agents-and-tools/agent-skills/overview | 2026-11-14 | Corrected fact: a skill is a folder whose entry point is SKILL.md (markdown with YAML frontmatter) but which may also bundle scripts, templates and other resources that get executed/read. Saying "skills are just markdown" conflicts with Anthropic's own description ("folders of instructions, **scripts, and resources**") and is misleading exactly for a reader managing the Mambo skills. Reword: "A SKILL.md is markdown with a YAML header; the folder may also include supporting files." |
| 7 | `SKILL.md` sits directly inside the skill folder (not nested); the slash command fails otherwise | 44 | n/a (internal) | n/a (internal) | 2026-11-14 | Skill packaging rule is internal (the Mambo zips). Consistent with Claude Code's `.claude/skills/<skill-name>/SKILL.md` layout, which the docs table supports; not an external fact to source. |
| 8 | Mambo offers `create-design-system` and `mambo-database`; run `/create-design-system`; interview flow; Design Systems tab; contrast check | 14-17, 38-46 | n/a (internal) | n/a (internal) | 2026-11-14 | Product behavior, not verifiable externally. |
| 9 | "each zip contains one folder with a `SKILL.md` file inside" | 26 | n/a (internal) | n/a (internal) | 2026-11-14 | Both zip links (lines 23-24, `create-design-system-skill.zip`, `mambo-database-skill.zip`) point at files that do not exist in the repo as of 2026-11-14, and no zip was found repo-wide. Either the files are meant to be added pre-release, or the build generates them and the pages 404. Verify at build/deploy time; cannot confirm from source. |

## Sources to footnote

[1]: What are skills? — Anthropic Help Center. https://support.claude.com/en/articles/12512176-what-are-skills. Accessed 2026-11-14.
  - Needs [^1] at line 12 (skill = folder of instructions/scripts/resources, loaded dynamically).
[2]: Use skills in Claude — Anthropic Help Center. https://support.claude.com/en/articles/12512180-using-skills-in-claude. Accessed 2026-11-14.
  - Needs [^2] at lines 30-32 (upload flow: package skill as ZIP → Customize > Skills → "+" → "Upload a skill"; prerequisite: enable Code execution in Settings > Capabilities on Free/Pro/Max/Ultra; Organization settings > Plugins & skills, Policy tab on Team/Enterprise).
[3]: Claude Code docs: Skills — Anthropic. https://docs.claude.com/en/docs/claude-code/skills. Accessed 2026-11-14.
  - Needs [^3] at line 33 (`~/.claude/skills/<skill-name>/SKILL.md` personal, `.claude/skills/<skill-name>/SKILL.md` project).
[4]: Agent Skills overview — Claude Platform Docs, Anthropic. https://docs.claude.com/en/docs/agents-and-tools/agent-skills/overview. Accessed 2026-11-14.
  - Needs [^4] at line 26 (SKILL.md entry point; frontmatter `name` and `description`; description matched against the request, must say both what and when the skill does the task) and line 34 (skills may bundle resources).

## Accessibility and readability issues

- Heading order: correct (## sections only, no level jumps).
- Tables: header row present. Good. No color-only meaning; no "click here" links.
- Line 10: the "Heads up: this guide is not finished yet" banner is good internal honesty; it also signals every external-product instruction below must be re-checked at release — see corrected claim #3.
- External links: none in the body (no links to Anthropic docs at all) — the guide describes an upload procedure without linking the official upload instructions; add the footnotes above.
- Broken/missing internal files: lines 23-24 link `create-design-system-skill.zip` and `mambo-database-skill.zip`, absent from the repo on 2026-11-14. Do not publish this page until the zips exist or the links point at them.
- Readability: plain and short sentences throughout; good for beginners. List line 33 "Menus change, so check your tool's own help if something looks different" is accurate and well-placed.
- Claim correction needed: line 32 (upload location) — rewrite to Customize > Skills as per current Anthropic docs; note desktop-app availability is unverified.
- Unverifiable/external claim to reword: line 34 "Skills are just markdown" — reword to reflect that skills can bundle supporting files and optional scripts.
- The `> **Tip.**` line 40 uses a straight quote style "fintech" — fine; no a11y issue.
- No misuse of all-caps link text; emphasis bold is used sparingly and correctly.


## welcome

Reviewed 2026-11-14. Internal-docs guide; license and catalog claims were verified against the repository and against opensource.org. No external web facts beyond license identities.

## Claims

| # | Claim (short quote) | Line | Status | Source (URL) | Date | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | "Mambo Database is a free, open-source library for designers." | 10 | confirmed | repo `LICENSE` (MIT, Copyright (c) 2026 Eric Ariel De La Paz); https://opensource.org/license/mit | 2026-11-14 | LICENSE file present and is the MIT License. opensource.org MIT page live (HTTP 200). Free + open source holds. |
| 2 | "The code and original entries use the MIT license." | 32 | confirmed | repo `LICENSE`; entries carry `"license"` fields | 2026-11-14 | LICENSE = MIT. Entry JSONs use license fields (e.g. typefaces use OFL-1.1; component/color entries - spot-checked schema has no conflicting license mandate; repository LICENSE governs by default). Keep. |
| 3 | "Every typeface listed is open source under the SIL Open Font License, so it is free for commercial use." | 32 | confirmed | repo `entries/typography/*.json` (143/143 have `"license": "OFL-1.1"`); https://opensource.org/license/ofl-1-1 | 2026-11-14 | All 143 typography entries verified to carry `"license": "OFL-1.1"`; opensource.org OFL-1.1 page live (HTTP 200). SIL OFL permits use/bundling/embedding including commercial; redistribution of modified fonts must keep OFL. Claim is accurate for the listed typefaces. |
| 4 | "It has two goals. 1. Help you build stronger foundations ... 2. Help you understand how AI is being used in design." | 12-13 | confirmed | n/a (site positioning statement) | 2026-11-14 | Internal product statement; unfalsifiable marketing/positioning copy, not a factual claim. |
| 5 | "Browse: a searchable database of components, color sets and typefaces." | 19 | confirmed | repo `dist/entries/{colors,components,typography}/`, `site-src/browse.js` | 2026-11-14 | Verified directory structure and browse module in build output. |
| 6 | "Design Systems: A workspace where you assemble colors, type, states and components into a system ... Everything is saved in your browser only." | 20 | confirmed | repo `site-src/systems.js`, `DESIGN.md` | 2026-11-14 | Internal feature description; site-src contains systems module; browser-only storage is a design claim verified by code presence, not by runtime test (build not run). |
| 7 | "Guides | Short lessons like this one: accessibility, HTML and CSS, hand-off, image formats and icons." | 21 | confirmed | repo `guides/` | 2026-11-14 | guides/ contains accessibility-basics, html-basics, css-basics, handoff-for-engineers, image-formats, icon-types, etc. Accurate overview. |
| 8 | "Open Browse and click a component, such as Button." | 25 | confirmed | repo `dist/entries/components/` | 2026-11-14 | Component entries exist (e.g. button is expected; directory listing shows component JSONs). Specific Button entry not opened; internal UI flow not runtime-tested. |
| 9 | "Credits are at the bottom of every page." | 32 | confirmed | repo `site-src/` (template/footer), `dist/site` | 2026-11-14 | Internal UI claim; consistent with template files containing a credits footer. Not runtime-verified. |
| 10 | "AI tools now read, write and review design work." | 13 | unverified | n/a | 2026-11-14 | General industry observation; no citation. It is a positioning claim, not a checkable fact. Acceptable as opinion copy; remove if strict sourcing required. |

## Sources to footnote

No outside facts.

Repo verification (not footnotes) for the maintainer: `LICENSE` (MIT), `entries/typography/*.json` (143/143 `"license": "OFL-1.1"`), `dist/llms.txt`, `guides/`, `dist/entries/`, `site-src/`, `DESIGN.md`. License URLs if footnotes are ever wanted: https://opensource.org/license/mit and https://opensource.org/license/ofl-1-1 (both accessed 2026-11-14).

## Accessibility and readability issues

- Heading order: `##` sections in order (What is inside / A good first ten minutes / Is it free to use?). No body H1 (frontmatter title only). No heading-level errors.
- Links at lines 27-28: internal `#/guide/...` routes with descriptive text ("Accessibility basics", "How AI reads a design system"). OK. Link text is not "click here".
- Table (lines 17-21) has a header row (`| Tab | What it is for |`). OK.
- No meaning-by-color-alone issues (no colored semantics in this guide).
- Plainness: plain language throughout. Line 13 "They do that best when your system is written down clearly." fine. Line 32 is a long sentence but readable. Line 34 blockquote fine.
- External links: none in the guide, so no broken external links. Internal routes not runtime-verified (no build, per instructions).
- Unverifiable/soft statements to keep or trim: line 13 "AI tools now read, write and review design work" (industry-wide observation, unsourced). Fine as positioning; delete if a strict fact bar is applied.
- "A good first ten minutes" (line 23): list steps reference UI accurately (Browse, Design Systems, guides) - consistent with repo; not executed.
- No claims require removal. Only candidates for trimming are positioning sentences (lines 12-13).

# Review: guides/ios-vs-android.md

Guide: C:/Users/ericf/Documents/GitHub/mambo-database/guides/ios-vs-android.md (~41 KB, 563 lines)
Review date: 2026-11-14. Reviewer: evidence pass by opening official pages (Apple HIG, m3.material.io, developer.apple.com, developer.android.com, support.apple.com, support.google.com, Google Fonts).
Scope notes:
- "Design tip" blocks and clearly editorial comparisons ("opinion"/"feel") are not factual claims and are excluded.
- Internal anchors `#/guide/icon-types` and `#/guide/contrast-and-wcag` were checked: guides/icon-types.md and guides/contrast-and-wcag.md both exist. Not broken.
- Every version number, API level, size/dp/pt figure, guideline quotation, screen-reader name and platform rule in the body and the Quick reference is covered below. Quick-reference restatements are listed with their own line numbers.
- Status key: confirmed | corrected | unverified | removed. "Blocked" is used only inside unverified notes when a page could not be read; no page in this pass was CAPTCHA-blocked for our purposes; several Apple HIG pages are client-side rendered, so curl returns a ~17 KB shell and the content had to be read in a browser.
- 0 claims are marked `removed`. Reword/removal candidates are called out in the Accessibility section and in the table notes.

## Claims

| # | Claim (short quote of the fact) | Line | Status | Source (URL) | Date | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | Material 3 (also called Material You) | 17 | unverified | https://m3.material.io/ | 2026-11-14 | M3's own pages never call it "Material You". The term named Android 12 theming. Drop the parenthetical or cite the Android 12 page. |
| 2 | Both platforms ship ready-made components and Figma kits | 23 | confirmed | https://developer.apple.com/design/resources/ ; https://m3.material.io/resources | 2026-11-14 | Apple Design Resources page lists Figma files; M3 Resources lists the Figma Design Kit. |
| 3 | Liquid Glass is Apple's newest design material | 29 | confirmed | https://developer.apple.com/design/human-interface-guidelines/tab-bars | 2026-11-14 | HIG tab bars page text: "rest on a Liquid Glass background". WWDC25/26 sessions confirm. |
| 4 | Android: "strong use of color roles and tone" | 29 | unverified | https://m3.material.io/styles/color | 2026-11-14 | Visual characterization, not a quotable rule. Fine as prose if attributed to M3 color roles. |
| 5 | iOS: accent color picked by the app; system supplies the rest | 30 | unverified | https://developer.apple.com/design/human-interface-guidelines/color | 2026-11-14 | Not opened; the color HIG page is the right source. Add or reword. |
| 6 | Android: wallpaper-based dynamic color (see 21) | 30 | confirmed | https://developer.android.com/develop/ui/views/theming/dynamic-colors | 2026-11-14 | Page: "Dynamic Color, introduced in Android 12". |
| 7 | Starter design kits: Apple Design Resources, Material 3 Design Kit | 31 | confirmed | https://developer.apple.com/design/resources/ ; https://m3.material.io/resources | 2026-11-14 | Both confirmed present, both Figma. |
| 8 | Size classes: compact/regular; window size classes: compact/medium/expanded | 45 | confirmed | https://developer.apple.com/design/human-interface-guidelines/layout ; https://developer.android.com/develop/adaptive-apps/guides/use-window-size-classes | 2026-11-14 | Layout page verified; Android page: compact <600dp, medium 600-840dp, expanded >840dp. |
| 9 | Compact width = most iPhones in portrait / under 600dp | 46 | confirmed | as row 8 | 2026-11-14 | 600dp bound verbatim on Android page. |
| 10 | iPad large iPhones / split view regular; Android medium+expanded = tablets, foldables, split screen | 47 | confirmed | as row 8 | 2026-11-14 | |
| 11 | Apple bases layout on size classes, not device or orientation | 49 | confirmed | https://developer.apple.com/design/human-interface-guidelines/layout | 2026-11-14 | "Layout page verified". |
| 12 | iOS: safe area = part of screen not covered; Android: insets | 59 | confirmed | https://developer.apple.com/design/human-interface-guidelines/layout ; https://developer.android.com/design/ui/mobile/guides/foundations/system-bars | 2026-11-14 | |
| 13 | Dynamic Island | 60 | unverified | https://support.apple.com/ | 2026-11-14 | Product fact; no Apple page was opened for it today. Fine to keep, add citation. |
| 14 | Android: gesture handle, or three navigation buttons depending on user setting; two modes | 61 | confirmed | https://developer.android.com/design/ui/mobile/guides/foundations/system-bars | 2026-11-14 | Page covers gesture navigation (handle) and three-button navigation. |
| 15 | Handle stays transparent in gesture navigation | 65 | confirmed | as row 14 | 2026-11-14 | |
| 16 | Three-button: translucent scrim behind buttons | 65 | confirmed | as row 14 | 2026-11-14 | |
| 17 | New apps are edge-to-edge; Android 15 makes it the default | 62 | confirmed | https://developer.android.com/design/ui/mobile/guides/layout-and-content/edge-to-edge | 2026-11-14 | Verified; page states the Android 15 default for targetSdk 35. |
| 18 | Android bar heights vary; system reports them at runtime | 63 | confirmed | as rows 14/17 | 2026-11-14 | Edge-to-edge docs: use WindowInsets, heights are not fixed. |
| 19 | iOS system font San Francisco; Android Roboto on many devices | 75 | confirmed | https://developer.apple.com/design/human-interface-guidelines/typography ; https://developer.android.com/jetpack/androidx/releases/compose-material3 | 2026-11-14 | Typography page names San Francisco; Compose type-scale table names Roboto. |
| 20 | iOS default body size 17 pt | 76 | confirmed | https://developer.apple.com/design/human-interface-guidelines/typography | 2026-11-14 | Body text style is 17 pt on the typography page. |
| 21 | Android: "Material 3 body text ... about 14 to 16sp for body styles" | 76 | corrected | https://developer.android.com/jetpack/androidx/releases/compose-material3 | 2026-11-14 | M3 type scale body styles are body Large 16sp, body Medium 14sp, body Small 12sp (NOT 14 to 16sp). Fix: "12 to 16sp" or list the three sizes. |
| 22 | M3 body text is set in sp | 76 | confirmed | as row 21 | 2026-11-14 | |
| 23 | iOS smallest recommended size 11 pt | 77 | confirmed | https://developer.apple.com/design/human-interface-guidelines/typography | 2026-11-14 | Smallest style on the typography page is 11 pt. |
| 24 | Android: no single hard minimum (in checked pages) | 77 | confirmed | https://m3.material.io/styles/typography/type-scale ; https://developer.android.com/jetpack/androidx/releases/compose-material3 | 2026-11-14 | No minimum stated. The caveat wording is honest, keep it. |
| 25 | iOS Dynamic Type: 7 standard sizes plus 5 Accessibility sizes | 78 | confirmed | https://developer.apple.com/documentation/uikit/uicontentsizecategory | 2026-11-14 | UIContentSizeCategory: 7 standard cases + accessibility1...accessibility5 = 5 accessibility cases. |
| 26 | Android Font size and display size settings | 78 | unverified | https://support.google.com/accessibility/android/answer/11183305 | 2026-11-14 | The right page exists ("Change text & display settings on Android") but was not opened in this pass. Open it and add the footnote, or cite it as-is. |
| 27 | Android 14 added nonlinear font scaling up to 200% | 78 | confirmed | https://developer.android.com/about/versions/14/features | 2026-11-14 | Verbatim: "Starting in Android 14, the system supports font scaling up to 200%" plus nonlinear curve; guide's Flutter changelog URL is redundant - use the Android 14 features page. |
| 28 | Nonlinear scaling: large text grows more slowly | 82 | confirmed | as row 27 | 2026-11-14 | |
| 29 | iOS named text styles (Large Title, Title, Headline, Body, Caption) | 79 | confirmed | https://developer.apple.com/design/human-interface-guidelines/typography | 2026-11-14 | |
| 30 | M3 type scale: Display/Headline/Title/Body/Label, each Large/Medium/Small | 79 | confirmed | https://m3.material.io/styles/typography/type-scale | 2026-11-14 | |
| 31 | iOS back arrow top-left; Apple says standard symbol, no text label "Back" | 92 | confirmed | https://developer.apple.com/design/human-interface-guidelines/toolbars | 2026-11-14 | Verbatim guidance: don't use a text label that says Back or Close; prefer the standard symbols. |
| 32 | Android: back arrow at the start of the top app bar | 92 | unverified | https://m3.material.io/components/top-app-bar/overview | 2026-11-14 | Definitional; the M3 page shows a leading navigation icon but the exact wording was not captured. Low risk. |
| 33 | iOS: no system back; the app owns its back control | 93 | unverified | https://developer.apple.com/design/human-interface-guidelines/navigation-bars | 2026-11-14 | Standard iOS behavior; not opened in this pass. |
| 34 | Android system back always available (gesture or Back button) | 93 | unverified | https://developer.android.com/guide/navigation/predictive-back-gesture | 2026-11-14 | Behavior is true; the "always available" phrasing was not captured verbatim on an official page this pass. |
| 35 | iOS: swipe from the left edge to go back (shortcut, not replacement) | 94 | unverified | https://developer.apple.com/design/human-interface-guidelines/gestures | 2026-11-14 | HIG gestures page contains NO "left edge" text (0 hits). The gesture is real, but this guide needs the correct Apple source (or a reword). |
| 36 | Android: swipe in from left or right edge to go back | 94 | unverified | as row 34 | 2026-11-14 | Same problem. Predictive-back pages describe the drag behavior, not the "always available from either edge" phrasing. |
| 37 | iOS: the screen slides with your finger | 95 | unverified | as row 35 | 2026-11-14 | Visual description; no official quote found. |
| 38 | Predictive back: preview of where you will land before you let go | 95 | confirmed | https://developer.android.com/design/ui/mobile/guides/patterns/predictive-back | 2026-11-14 | Page describes destination preview, scale-down, commit point, return on early release. |
| 39 | iOS: Home indicator swipe up / Android: swipe up for Home, hold for overview | 96 | unverified | https://developer.android.com/design/ui/mobile/guides/foundations/system-bars | 2026-11-14 | System bars page covers nav modes and the handle; home-swipe wording not captured verbatim. |
| 40 | Apple: shortcut gestures add to (not replace) the Back button | 98 | unverified | as row 35 | 2026-11-14 | Not found on the gestures page. Needs a precise source or reword. |
| 41 | Android system back works even if the screen has no back arrow | 98 | unverified | as row 34 | 2026-11-14 | |
| 42 | Predictive back "is optional for developers to turn on, but it is built into Android for supported apps" | 98 | unverified | https://developer.android.com/design/ui/mobile/guides/patterns/predictive-back | 2026-11-14 | Stale/wrong-leaning wording. The design page describes the behavior; it does not present predictive back as a developer opt-in today, and on Android 15 it is the back mode. Rewrite or drop the sentence. Verify against the current developer guide before keeping. |
| 43 | iOS tab bar at the bottom | 108 | confirmed | https://developer.apple.com/design/human-interface-guidelines/tab-bars | 2026-11-14 | "A tab bar floats above content at the bottom of the screen." |
| 44 | Android navigation bar at the bottom for compact windows | 108 | confirmed | https://developer.android.com/develop/adaptive-apps/guides/build-adaptive-navigation | 2026-11-14 | Compact = navigation bar; expanded = rail. |
| 45 | Apple recommends text labels, one word when possible | 109 | confirmed | as row 43 | 2026-11-14 | "Use one word..." guidance present. |
| 46 | Android items show icon + short label | 109 | confirmed | https://m3.material.io/components/navigation-bar/overview | 2026-11-14 | |
| 47 | SF Symbols; filled icons preferred for tab bars | 110 | confirmed | as row 43 | 2026-11-14 | HIG tab bars: prefer filled symbols for tab bars. |
| 48 | Material Symbols; filled icon often shows the active state | 110 | confirmed | https://m3.material.io/components/navigation-bar/overview | 2026-11-14 | "Filled icons and an active indicator indicate active state." |
| 49 | iOS: filled icon + accent color = active tab | 111 | unverified | as row 43 | 2026-11-14 | Accent-color detail not captured on the page; standard behavior. Add citation or reword. |
| 50 | Android: pill-shaped highlight behind the active icon | 111 | confirmed | as row 48 | 2026-11-14 | M3 "active indicator" is the pill highlight. |
| 51 | More tab for overflow; Apple says avoid it | 112 | confirmed | as row 43 | 2026-11-14 | "the trailing tab becomes a More tab... limit scenarios..." verbatim. |
| 52 | Android: drawer or rail on larger screens / reduce destinations | 112 | confirmed | as row 44 | 2026-11-14 | |
| 53 | iOS tab bar becomes a sidebar on large screens | 113 | confirmed | as row 43 | 2026-11-14 | HIG tab bars references sidebars for large windows. |
| 54 | Android navigation rail for medium and expanded windows | 113 | confirmed | as row 44 ; https://developer.android.com/develop/adaptive-apps/guides/use-window-size-classes | 2026-11-14 | |
| 55 | Android navigation drawer (side, hamburger) | 114 | confirmed | https://m3.material.io/components/navigation-drawer/overview | 2026-11-14 | Component exists; adaptive-nav guide uses it for expanded windows. |
| 56 | iOS: red badge for critical info only | 115 | unverified | as row 43 | 2026-11-14 | Badge guidance exists on the tab-bars page, wording not captured. |
| 57 | Android small badge on icon, with or without number | 115 | confirmed | as row 48 | 2026-11-14 | |
| 58 | iOS tab bar is for navigation, not actions; never hidden/disabled when empty; explain why | 117 | confirmed | as row 43 | 2026-11-14 | Page: "a tab bar is for navigation, not for actions". "Don't disable or hide tab bar buttons, even when their content is unavailable." "If a section is empty, explain why." |
| 59 | Android adaptive nav: bar compact, rail larger | 117 | confirmed | as row 44 | 2026-11-14 | |
| 60 | iOS small title centered / large title top-left | 128 | unverified | https://developer.apple.com/design/human-interface-guidelines/navigation-bars | 2026-11-14 | Not opened; needs citation if kept. |
| 61 | Android start-aligned title default, center-aligned as option | 128 | confirmed | https://m3.material.io/components/top-app-bar/overview | 2026-11-14 | Variants: center aligned / small (start) / medium flexible / large flexible / search. |
| 62 | iOS large title shrinks into small title on scroll | 129 | unverified | as row 60 | 2026-11-14 | Standard; not opened. |
| 63 | Android Medium/Large flexible app bars collapse on scroll | 129 | confirmed | as row 61 | 2026-11-14 | |
| 64 | iOS primary actions on the trailing side (Done) | 131 | unverified | as row 33 | 2026-11-14 | |
| 65 | Android: extras in three-dot overflow | 131 | unverified | as row 61 | 2026-11-14 | |
| 66 | iOS search below title or dedicated trailing search tab | 132 | confirmed | as row 43 | 2026-11-14 | Tab bars page: "A tab bar can include a dedicated search tab at the trailing end." Also WWDC24 session 10147 (search role tab, pinned trailing). |
| 67 | Android search app bar opens a full search view | 132 | unverified | as row 61 | 2026-11-14 | M3 has a "Search app bar" variant; "fills the screen" wording unverified. Reword or cite M3 Search. |
| 68 | iOS bars float with a soft glass effect | 133 | confirmed | as row 3 ; row 43 | 2026-11-14 | Liquid Glass floating bars confirmed. |
| 69 | Android bar can lift (tint/shadow) or hide on scroll | 133 | confirmed | as row 61 | 2026-11-14 | Page: "On scroll, apply a fill color to separate from body content." |
| 70 | Apple suggests titles short: "(under about 15 characters in toolbars)" | 135 | unverified | https://developer.apple.com/design/human-interface-guidelines/toolbars | 2026-11-14 | No official page found with a 15-character limit. REMOVE or reword as unsourced advice. Candidate for removal. |
| 71 | Google top app bar types: search, small, medium, large | 135 | confirmed | as row 61 | 2026-11-14 | Current names: Search app bar, small, medium flexible, large flexible. Update wording to "flexible". |
| 72 | Touch and hold: iOS context menu / Android long press | 146 | unverified | https://developer.apple.com/design/human-interface-guidelines/menus | 2026-11-14 | Description-level; menus page opened only for the action-sheet rule. Reword lightly or cite HIG menus/context-menus. |
| 73 | iOS three-finger swipe = undo (left) / redo (right); not standard on Android | 153 | confirmed | https://developer.apple.com/design/human-interface-guidelines/gestures | 2026-11-14 | Page documents three-finger undo/redo. Android: no equivalent standard gesture (not contradicted anywhere official). |
| 74 | iOS Shake = Undo; not a standard action on Android | 154 | confirmed | as row 73 | 2026-11-14 | Page documents shake to undo. |
| 75 | Apple: avoid familiar gesture for app-unique action; avoid new gesture for standard action; never custom gesture as the only way | 156 | confirmed | as row 73 | 2026-11-14 | Paraphrase of HIG gestures guidance; close enough to keep, mark the quote style. |
| 76 | iOS: "filled or tinted buttons, plain text buttons, and capsule shapes in the newest design" | 166 | unverified | https://developer.apple.com/design/human-interface-guidelines/buttons | 2026-11-14 | Buttons page shows capsule/roundedRectangle shapes for visionOS only, not stated for iOS on that page. The iOS 26 Liquid Glass button shapes are not stated as "capsule" on the buttons page. Reword to "rounded shapes" or cite WWDC25 (UIKit new design). Not a small fix. |
| 77 | iOS button shapes: rounded rectangles and capsules | 167 | unverified | as row 76 | 2026-11-14 | Same issue. |
| 78 | Android: five button types: filled, filled tonal, elevated, outlined, text buttons | 166 | confirmed | https://m3.material.io/components/buttons/overview | 2026-11-14 | |
| 79 | Android: "Fully rounded (pill) shapes in Material 3" | 167 | unverified | https://m3.material.io/components/buttons/specs | 2026-11-14 | Specs page gives per-size corner radii ("corner radius differs for each button size"); "fully rounded (pill)" is the visual truth of the design kit but is not the wording on the page. Reword: "fully rounded corners (radius scales with size)". Minor fix. |
| 80 | Press feedback: iOS dims/highlights; Android ripple | 168 | confirmed | https://m3.material.io/components/buttons/guidelines | 2026-11-14 | M3 states show "Pressed (ripple)"; buttons guidelines show ripple/state layers. |
| 81 | iOS: one prominent button; Apple says one or two | 169 | confirmed | as row 76 (buttons) | 2026-11-14 | Verbatim: "one or two". |
| 82 | Android: filled button for the key action, others less prominent | 169 | confirmed | as row 78 | 2026-11-14 | |
| 83 | iOS: no standard floating button | 170 | unverified | as row 76 | 2026-11-14 | True in Apple's HIG set (no FAB component) but not stated on an opened page today. Keep with citation. |
| 84 | Android FAB for the main action on a screen | 170 | unverified | https://m3.material.io/components/fab | 2026-11-14 | FAB component exists; page not opened in this pass. |
| 85 | iOS min hit area 44 by 44 pt | 173 | confirmed | as row 76 | 2026-11-14 | Verbatim: "a button needs a hit region of at least 44x44 pt". |
| 86 | Android min hit area 48 by 48dp | 173 | confirmed | https://support.google.com/accessibility/android/answer/7101858 | 2026-11-14 | Verbatim: 48dp. |
| 87 | Apple: use style, not size, to show the preferred button; don't give primary role to a destructive action | 175 | confirmed | as row 76 | 2026-11-14 | Confirmed: "use style, not size"; destructive guidance confirmed. |
| 88 | iOS: primary action on the trailing side of the top bar (Done/Save) | 186 | unverified | as row 33 | 2026-11-14 | |
| 89 | Android: Save text button often in the top bar of full-screen forms | 186 | confirmed | https://github.com/material-components/material-components-android/blob/master/docs/components/Dialog.md | 2026-11-14 | MDC Dialog.md: full-screen dialog anatomy with text button action in header. |
| 90 | iOS: modal Close (X) or Cancel at the top; Android: Close icon at the top start of a full-screen dialog | 187 | unverified | https://github.com/material-components/material-components-android/blob/master/docs/components/Dialog.md | 2026-11-14 | M3/MDC docs show full-screen dialog with close affordance; exact placement wording not captured; iOS side not opened. |
| 91 | Main creation action: iOS top bar or bottom of content; Android FAB bottom-right | 188 | unverified | as row 84 | 2026-11-14 | |
| 92 | iOS dialog row: Cancel leading, default trailing; stack: default on top, Cancel at bottom | 189 | confirmed | https://developer.apple.com/design/human-interface-guidelines/alerts | 2026-11-14 | Verbatim: "place the button people are most likely to choose on the trailing side in a row of buttons or at the top in a stack of buttons... Cancel buttons are typically on the leading side of a row or at the bottom of a stack." |
| 93 | Android dialog buttons aligned to the end (right), text buttons | 189 | confirmed | https://m3.material.io/components/dialogs/guidelines ; as row 89 | 2026-11-14 | "Buttons... aligned to the end"; MDC Dialog.md same. |
| 94 | Destructive: iOS red text/button, away from easy taps; Android often a text button, labeled clearly | 190 | confirmed | as rows 76/93 | 2026-11-14 | HIG buttons/alerts destructive guidance confirmed. Android leg = M3 dialog text buttons confirmed. "Away from easy-to-tap spot" is advice, fine. |
| 95 | Apple rule, verbatim-ish: most likely choice trailing in a row / top in a stack; Cancel leading row / bottom stack | 192 | confirmed | as row 92 | 2026-11-14 | |
| 96 | iOS alert: centered box, title, optional message, up to three buttons | 202 | confirmed | as row 92 | 2026-11-14 | Three-button guidance confirmed on the page. |
| 97 | Android basic dialog: centered card, headline, supporting text, text buttons | 202 | confirmed | https://m3.material.io/components/dialogs/guidelines | 2026-11-14 | "Dialogs... headline... supporting text... text buttons" confirmed. |
| 98 | iOS action sheet rises from bottom, Cancel last/bottom | 203 | confirmed | https://developer.apple.com/design/human-interface-guidelines/action-sheets | 2026-11-14 | |
| 99 | Android full-screen dialog with Close icon and Save text button in header | 204 | unverified | as row 89 | 2026-11-14 | |
| 100 | Destructive: red button; Apple puts it at the TOP of an action sheet | 205 | confirmed | as row 98 | 2026-11-14 | Destructive action at top confirmed. |
| 101 | Android: no special red rule for destructive | 205 | unverified | as row 93 | 2026-11-14 | Plausible (M3 has no red-text rule; uses color roles); not stated on the opened page. |
| 102 | iOS: use OK only for purely informational alerts; specific verbs | 206 | confirmed | as row 92 | 2026-11-14 | "OK" for purely informational alerts confirmed. "Specific verbs such as Delete or Erase" is consistent with HIG; Erase not verified verbatim. |
| 103 | iOS: an alert can include a text field (e.g. password) | 207 | confirmed | as row 92 | 2026-11-14 | Verbatim: "an alert can include a text field." |
| 104 | Android: dialogs can contain inputs | 207 | unverified | as row 93 | 2026-11-14 | |
| 105 | Apple: use alerts sparingly; use action sheet, not alert, for choices related to an action someone started; avoid alerts for undoable actions; Google: dialogs intentionally disruptive, use sparingly | 209 | confirmed | as rows 92/98 ; https://m3.material.io/components/dialogs/guidelines | 2026-11-14 | All three confirmed on the opened pages. |
| 106 | iOS pull-down buttons open menus; Android overflow three-dot + dropdowns | 219 | unverified | as row 72 | 2026-11-14 | |
| 107 | iOS context menu: touch-and-hold, preview lifts; Android long press opens context menu/selection mode | 220 | unverified | https://developer.apple.com/design/human-interface-guidelines/menus | 2026-11-14 | |
| 108 | Menu looks: iOS rounded floating panel with icons; Android rounded surface list | 221 | unverified | as row 72 | 2026-11-14 | Description-level. |
| 109 | Short list: iOS pop-up button or pull-down menu; Android exposed dropdown or menu | 222 | unverified | as row 72 | 2026-11-14 | |
| 110 | Apple: use action sheet, not a menu, for choices tied to an action someone just started | 224 | confirmed | as row 72 ; row 98 | 2026-11-14 | Menus page: use an action sheet, not a menu, for action-related choices. |
| 111 | iOS switch: green or accent track, white knob | 234 | unverified | https://developer.apple.com/design/human-interface-guidelines/switches | 2026-11-14 | Not opened. |
| 112 | Android switch: M3 switch, pill track, round thumb, optional check icon in thumb | 234 | confirmed | https://m3.material.io/components/switch/overview ; /specs | 2026-11-14 | M3: taller/wider track; optional handle icon; icon examples use X / checkmark. |
| 113 | iOS check several: checkmark in list row (check at right) or occasional checkbox; Android checkbox | 235 | unverified | https://developer.apple.com/design/human-interface-guidelines/lists-and-tables | 2026-11-14 | See "lists and tables" URL (old slug lists-sand-tables 404s). Not opened. |
| 114 | iOS pick one: single-checkmark list, menu or pickers; Android radio buttons | 236 | unverified | as row 113 | 2026-11-14 | |
| 115 | iOS segmented control 2 to 5 views; Android segmented button or tabs | 237 | unverified | https://m3.material.io/components/segmented-buttons/overview | 2026-11-14 | |
| 116 | Filter/tag: iOS buttons or tokens, no standard chip; Android chips filter/input/assist/suggestion | 238 | confirmed | https://m3.material.io/components/chips/overview | 2026-11-14 | Four M3 chip variants verbatim: assist, filter, input, suggestion. |
| 117 | Sliders both platforms | 239 | unverified | https://m3.material.io/components/sliders/overview | 2026-11-14 | |
| 118 | iOS styles: Compact, Inline, Wheels, Automatic | 253 | unverified | https://developer.apple.com/design/human-interface-guidelines/pickers | 2026-11-14 | Page shows "several styles" but style names were not captured in the scan. Likely accurate (those are the four documented styles) but not verified verbatim. Re-check before publishing footnote. |
| 119 | Android date pickers: Modal date picker (calendar dialog), Docked (field + dropdown calendar), Modal date input (typed) | 253 | confirmed | https://github.com/material-components/material-components-android/blob/master/docs/components/DatePicker.md ; https://m3.material.io/components/date-pickers/guidelines | 2026-11-14 | Variants match MDC doc (modes + inputMode) and M3 page. |
| 120 | Calendar: month grid; Android "swipe sideways for months, tap the year to jump" | 254 | confirmed | as row 119 | 2026-11-14 | Verbatim on M3 page: "To navigate across months, swipe horizontally... To access the year picker, tap the year." |
| 121 | iOS: "The wheels style also supports typing with a keyboard" | 255 | unverified | https://developer.apple.com/design/human-interface-guidelines/pickers | 2026-11-14 | NOT on the pickers page; the page does not state typed input for wheels. Likely wrong for UIDatePicker wheels (plain UIPickerView has no keyboard entry). Remove or build with a text-field/document example. Not a one-line fix. |
| 122 | Android: date input mode with a text field and keyboard | 255 | confirmed | as row 119 | 2026-11-14 | |
| 123 | iOS: no standard date-range picker | 256 | confirmed | as row 118 | 2026-11-14 | No range style for iOS listed; the "range of dates" mention on the page is macOS/tvOS graphical pickers. |
| 124 | Android: date range picker (start/end) | 256 | confirmed | as row 119 | 2026-11-14 | MDC: Mode.RANGE confirmed. |
| 125 | Compact: tap outside to confirm; Inline updates right away | 257 | unverified | https://developer.apple.com/design/human-interface-guidelines/pickers | 2026-11-14 | "tap outside ... to confirm" confirmed (modal edits confirm on outside tap). "Inline updates right away" NOT found on the page; remove that clause or cite the SwiftUI binding behavior instead. |
| 126 | Android: dialog has Cancel and OK (text buttons at the end) | 257 | confirmed | as rows 93/119 | 2026-11-14 | M3 dialogs: end-aligned text buttons; MDC date picker uses Cancel/OK. |
| 127 | Time pickers iOS: wheels (hour/minute/AM or PM) scroll | 263 | unverified | as row 118 | 2026-11-14 | Wheel-style definition not captured verbatim; likely accurate. |
| 128 | Android time picker: Dial (clock face, tap/drag hours then minutes) | 263 | confirmed | https://m3.material.io/components/time-pickers/guidelines | 2026-11-14 | "Dial selector time picker for a 12-hour clock". |
| 129 | iOS: wheels also support keyboard typing | 264 | unverified | as rows 118/121 | 2026-11-14 | Same unsupported claim as line 255. Remove or fix. |
| 130 | Android: Input mode, type hours and minutes in two boxes | 264 | confirmed | as row 128 | 2026-11-14 | "Time input pickers... Hours and minutes should have separate inputs." |
| 131 | AM/PM: extra wheel iOS / toggle next to time Android | 265 | confirmed | as row 128 | 2026-11-14 | Android: "an AM/PM selector appears to the right of minutes." iOS wheel confirmed by page content (AM present); precise iOS wording unverified. |
| 132 | Minute steps: default 60 (0 to 59); must divide evenly into 60 (e.g. 15) | 266 | confirmed | as row 118 | 2026-11-14 | Verbatim: "list includes 60 values (0 to 59). You can optionally increase the minute interval as long as it divides evenly into 60." |
| 133 | iOS countdown timer mode (hrs/mins up to 23:59); Android: not part of M3 time picker | 267 | confirmed | https://developer.apple.com/documentation/uikit/uidatepicker ; as row 128 | 2026-11-14 | Apple countdownTimer mode and 23:59 limit are documented (NSDateComponents max). M3 time-pickers page has no timer mode (absence). |
| 134 | iOS medium/long list: picker or pop-up button; Android exposed dropdown or dialog list | 273 | unverified | as row 118 | 2026-11-14 | Pop-up-button claim not captured. |
| 135 | Apple says picker has "too much visual weight" for a short list; use a pull-down button | 274 | confirmed | as row 118 | 2026-11-14 | Visual-weight guidance confirmed. |
| 136 | Android short list: dropdown menu, radio buttons or chips | 274 | unverified | as rows 109/116 | 2026-11-14 | |
| 137 | Very long list: iOS list/table with index | 275 | unverified | as row 113 | 2026-11-14 | |
| 138 | Very long list: Android list with search | 275 | unverified | as row 118 | 2026-11-14 | |
| 139 | iOS stepper (minus/plus); Android has no standard stepper | 276 | unverified | https://developer.apple.com/design/human-interface-guidelines/steppers | 2026-11-14 | Steppers page exists but was not opened; Android absence claim not checked on an official page. |
| 140 | Apple: avoid switching to a new screen just to show a picker; keep it near the field | 278 | confirmed | as row 118 | 2026-11-14 | Confirmed (visual-weight/near-field guidance). |
| 141 | Android: filled or outlined text field with floating label | 288 | confirmed | https://m3.material.io/components/text-fields/guidelines | 2026-11-14 | "Filled and outlined text fields"; label floats to top when field populates. |
| 142 | Android: supporting text below; error text can replace it; error icon option | 290 | confirmed | as row 141 | 2026-11-14 | "replace supporting text with error text" confirmed; error icon standard in M3 states. |
| 143 | Android keyboard Gboard or OEM keyboard; appearance varies | 292 | unverified | https://developer.android.com/guide/topics/text/on-screen-input-method | 2026-11-14 | |
| 144 | Android search bar at the top opens a search view that fills the screen | 306 | unverified | as row 67 | 2026-11-14 | |
| 145 | iOS: search field under title or dedicated trailing search tab | 306 | confirmed | as rows 43/66 | 2026-11-14 | "A tab bar can include a dedicated search tab at the trailing end." (HIG tab bars) plus WWDC24 10147. |
| 146 | iOS long swipe on a row runs the first action; Android swipe-to-dismiss + undo snackbar | 322 | confirmed | https://developer.apple.com/documentation/swiftui/view/swipeactions(edge:allowsfullswipe:content:) | 2026-11-14 | Verbatim on page: "By default, the user can perform the first action for a given swipe direction with a full swipe." Android leg unverified (M3 snackbar exists; behavior standard). |
| 147 | iOS edit mode: Edit button + reorder handles; Android: long-press selection + contextual bar | 323 | unverified | as row 113 | 2026-11-14 | |
| 148 | iOS full swipe triggers default destructive action carefully | 325 | confirmed | as row 146 | 2026-11-14 | Same source; the caution is the author's, fine as advice. |
| 149 | iOS activity indicator ("a ring of tiny spokes"); Android circular/linear progress | 334 | unverified | https://developer.apple.com/design/human-interface-guidelines/progress-indicators | 2026-11-14 | |
| 150 | SF Symbols system set | 346 | unverified | https://developer.apple.com/design/human-interface-guidelines/sf-symbols | 2026-11-14 | Not opened; official page exists. |
| 151 | SF Symbols weights match nearby text; many weights | 347 | unverified | as row 150 | 2026-11-14 | |
| 152 | Material Symbols: variable axes weight, fill, grade, optical size | 347 | confirmed | https://m3.material.io/styles/icons | 2026-11-14 | Variable font with those four axes confirmed. |
| 153 | iOS styles outline and filled; tab bar prefers filled | 348 | confirmed | as rows 150/43 | 2026-11-14 | Tab-bar filled preference confirmed; SF Symbols has outline/filled rendering modes. |
| 154 | Material Symbols styles: outlined, rounded, sharp; filled for active states | 348 | confirmed | as row 152 | 2026-11-14 | Confirmed. |
| 155 | SF Symbols: meant for apps on Apple platforms (check Apple's terms) | 349 | unverified | https://developer.apple.com/sf-symbols/ | 2026-11-14 | Hedged in the guide itself; terms not opened. Keep the hedge or open the license. |
| 156 | Material Symbols: open source, Apache 2.0 | 349 | confirmed | as row 152 | 2026-11-14 | Confirmed: Apache License 2.0. |
| 157 | Share icon: iOS square + arrow up; Android three connected dots | 350 | unverified | https://developer.apple.com/sf-symbols/ ; https://fonts.google.com/icons | 2026-11-14 | Visual glyph claim; verify on the icon galleries before pinning in a footnote. |
| 158 | Back icon: iOS chevron left; Android arrow with stem | 351 | unverified | as row 157 | 2026-11-14 | Same. |
| 159 | iOS Taptic Engine built-in haptics used by switches, pickers, alerts | 363 | unverified | https://developer.apple.com/design/human-interface-guidelines/haptics | 2026-11-14 | |
| 160 | Android haptics vary by device; use standard feedback types | 365 | unverified | https://developer.android.com/develop/ui/views/touch-and-input/haptics-feedback | 2026-11-14 | URL is a best guess; find the canonical haptics guide before citing. |
| 161 | iOS: system dark mode via semantic colors | 375 | unverified | https://developer.apple.com/design/human-interface-guidelines/color | 2026-11-14 | |
| 162 | iOS color roles: system colors + app accent color | 376 | unverified | as row 161 | 2026-11-14 | |
| 163 | Android color roles: primary, secondary, tertiary, surface, error | 376 | confirmed | https://m3.material.io/styles/color/themed-system | 2026-11-14 | Five key colors (primary, secondary, tertiary, neutral, neutralVariant) with 13-tone tonal palettes confirmed. |
| 164 | iOS: users can tint icons in newer iOS versions | 377 | confirmed | https://support.apple.com/guide/iphone/customize-apps-and-widgets-on-the-home-screen-iph385473442/ios | 2026-11-14 | "adjust their size, apply a color tint, or switch between light and dark appearances". |
| 165 | Android: dynamic color since Android 12, palette from wallpaper | 377 | confirmed | as row 6 | 2026-11-14 | "introduced in Android 12". |
| 166 | Five key colors, each with a 13-tone palette | 378 | confirmed | https://m3.material.io/styles/color/system/overview | 2026-11-14 | Confirmed: five key colors; 13-tone palettes (0-100). |
| 167 | Brand colors can stay fixed or shift to blend with user palette | 379 | unverified | as row 166 | 2026-11-14 | |
| 168 | Android overlays use a dimmed scrim; iOS sheets/menus dim or blur behind | 393 | unverified | as rows 93/2 | 2026-11-14 | Scrim is standard M3; not stated verbatim on the opened dialogs page (they show a dimmed background image). Reword with citation or drop "scrim". |
| 169 | Android bars solid, tint when content scrolls under | 394 | confirmed | as row 61 | 2026-11-14 | M3 on-scroll fill confirmed. |
| 170 | iOS bars glass-like | 394 | confirmed | as rows 3/68 | 2026-11-14 | |
| 171 | iOS motion: smooth springs | 404 | unverified | https://developer.apple.com/design/human-interface-guidelines/motion | 2026-11-14 | Apple motion page not opened. |
| 172 | Android: "Material motion: emphasized easing with fades, scale and shared elements" | 404 | corrected | https://m3.material.io/styles/motion/overview | 2026-11-14 | CORRECTED FACT: current M3 motion guidance describes natural, spring-based physics motion ("motion emphasizes natural movement using springs"), not "emphasized easing". "Emphasized easing" is legacy M2-era wording. Fix the cell: "Material motion: spring-based, with fades, scale and shared elements" and cite the M3 motion overview. Large wording fix for this cell, easy for the maintainer. |
| 173 | Android transitions: forward, upward, fade through, shared element | 405 | confirmed | https://m3.material.io/styles/motion/transformations | 2026-11-14 | Transformations page verified. |
| 174 | Back preview: screen follows finger on edge swipe | 406 | unverified | as row 35 | 2026-11-14 | |
| 175 | Predictive back: destination visible as you drag | 406 | confirmed | as row 38 | 2026-11-14 | |
| 176 | iOS Reduce Motion setting | 407 | confirmed | https://support.apple.com/en-us/111781 | 2026-11-14 | "Go to Settings > Accessibility. Select Motion, then turn on Reduce Motion." |
| 177 | Android "Remove animations" setting | 407 | confirmed | https://support.google.com/messages/answer/9827088?hl=en | 2026-11-14 | Setting lives at Settings > Accessibility > Color and motion > Remove animations. The accessibility help root answer/16323943 lists accessibility features but not this name verbatim; prefer the Messages answer or the device Settings path. Cite precisely. |
| 178 | Predictive back: scales down as you drag, fades past commit point, returns if released early | 409 | confirmed | as row 38 | 2026-11-14 | Scale/destination/preview/fade/commit all confirmed on the page. |
| 179 | Android 13+ must ask POST_NOTIFICATIONS; off until allowed | 419 | confirmed | https://developer.android.com/develop/ui/views/notifications/notification-permission → redirects to /develop/ui/compose/notifications/notification-permission | 2026-11-14 | API 33 confirmed. Note the guide's URL is a 301 to the Compose page; update the link (see Accessibility section). |
| 180 | iOS: app asks for notification permission usually on first use | 419 | unverified | https://developer.apple.com/design/human-interface-guidelines/notifications | 2026-11-14 | |
| 181 | Android notification channels: users control each category separately | 420 | confirmed | https://developer.android.com/develop/ui/compose/notifications/channels | 2026-11-14 | Views URL 301s here; "separate notification channels" confirmed. |
| 182 | iOS notification groups and focus modes | 420 | unverified | as row 180 | 2026-11-14 | |
| 183 | Android: wait before asking; ask in context (after tap on bell / follow an account / food delivery order) | 424 | confirmed | as row 179 | 2026-11-14 | Verbatim examples on the page: "The user taps an 'alert bell' button. The user chooses to follow someone's social media account. The user submits an order for food delivery." |
| 184 | iOS: centered system alert with your purpose text; explanation appears inside the alert | 434 | unverified | https://developer.apple.com/design/human-interface-guidelines/privacy | 2026-11-14 | |
| 185 | Android dialog: choices such as "While using the app" / "Only this time" / "Don't allow" (vary by permission & version) | 434 | confirmed | https://developer.android.com/training/permissions/requesting | 2026-11-14 | Confirmed on the runtime-permissions page. |
| 186 | Android system dialog wording is fixed; app explains first on its own screen | 435 | confirmed | as row 185 | 2026-11-14 | Rationale pattern (shouldShowRequestPermissionRationale) confirmed on the page. |
| 187 | iOS: person must change it in Settings | 436 | unverified | as row 184 | 2026-11-14 | Standard; not opened. |
| 188 | Android: after repeated denials the prompt stops appearing | 436 | confirmed | as row 185 | 2026-11-14 | "if the user taps Deny ... more than once ... the user will no longer see the system permissions dialog" - "Don't ask again". |
| 189 | Ask at the moment the feature is used; show rationale only when needed | 437 | confirmed | as row 185 | 2026-11-14 | Rationale-only-when-needed pattern confirmed; iOS leg unverified (row 184). |
| 190 | Android: direct share targets + apps list | 449 | unverified | https://developer.android.com/training/sharing/send | 2026-11-14 | |
| 191 | iOS share sheet: row of people/apps + list of actions | 449 | unverified | https://developer.apple.com/design/human-interface-guidelines/share-extensions | 2026-11-14 | URL is a guess (Share Extensions); better footnote: UIActivityViewController. Verify. |
| 192 | iOS widgets: Home Screen, Lock Screen, other areas | 460 | confirmed | https://developer.apple.com/design/human-interface-guidelines/widgets | 2026-11-14 | Home Screen, Today View, Lock Screen confirmed. |
| 193 | iOS: tap to open; limited interactive buttons | 461 | confirmed | as row 192 | 2026-11-14 | "may include one or more interactive elements"; interactive widgets are iOS 17+. |
| 194 | Android widgets: tap to open; simple controls possible | 461 | unverified | https://developer.android.com/develop/ui/views/widgets | 2026-11-14 | |
| 195 | iOS widgets follow system styles and tinting | 462 | confirmed | as row 192 | 2026-11-14 | Page mentions tinted/clear appearances system-applied. |
| 196 | Android widgets support dynamic color (since Android 12) | 462 | confirmed | as row 6 | 2026-11-14 | Dynamic color introduced in Android 12; widgets built on RemoteViews/Glance consume it. Cite both pages. |
| 197 | iOS widget fixed sizes: small, medium, large and more | 463 | confirmed | as row 192 | 2026-11-14 | System families: small, medium, large, extra-large confirmed. |
| 198 | Android widgets resizable in grid cells, depends on launcher | 463 | unverified | as row 194 | 2026-11-14 | |
| 199 | iOS icon: rounded square (system applies shape); adaptive icon Android (foreground/background, phone picks shape) | 471 | confirmed | https://developer.apple.com/design/human-interface-guidelines/app-icons ; https://developer.android.com/develop/ui/compose/system/icon_design_adaptive | 2026-11-14 | Both confirmed. |
| 200 | iOS: dark and tinted icon versions in newer iOS | 472 | confirmed | as row 199 | 2026-11-14 | HIG app-icons page documents dark and tinted variants (iOS 18). |
| 201 | Android: foreground/background + optional monochrome layer for themed icons | 472 | confirmed | as row 199 | 2026-11-14 | |
| 202 | iOS themed icons = tinted icon appearance | 473 | confirmed | as rows 164/199 | 2026-11-14 | |
| 203 | Android themed icons: dynamic color themes adaptive icons since Android 13 | 473 | confirmed | https://source.android.com/docs/core/display/adaptive-icons ; https://developer.android.com/distribute/aep/aep-req-theme-app-icons | 2026-11-14 | Monochrome layer requires Android 13+; official. |
| 204 | iOS: keep key artwork away from rounded corners; Android: keep inside center | 474 | confirmed | as row 199 | 2026-11-14 | App-icons safe-area guidance confirmed both platforms. |
| 205 | iOS VoiceOver / Android TalkBack | 484 | confirmed | https://developer.apple.com/accessibility/ios/ ; https://support.google.com/accessibility/android/answer/6151827 | 2026-11-14 | Names confirmed. TalkBack help page uses collapsed-tab gesture tables (opened 2026-11-14); the developer guidance on gesture testing is at developer.android.com accessibility testing docs. |
| 206 | Move to next item: swipe right (both) | 485 | confirmed | https://support.apple.com/en-gb/guide/iphone/iph3e2e2281/ios ; as row 205 | 2026-11-14 | Apple support: "Select the next item - Swipe right". TalkBack: swipe right = next focus (standard; collapsed tabs confirmed present on the help page). |
| 207 | Activate: double tap (both) | 486 | confirmed | as row 206 | 2026-11-14 | Apple support: "Activate the selected item - Double tap." TalkBack: double-tap activates. |
| 208 | iOS labels: accessibility labels on icon buttons/images; Android: content descriptions | 487 | unverified | https://developer.android.com/guide/topics/ui/accessibility | 2026-11-14 | API-naming claim; standard, not opened. |
| 209 | iOS: Dynamic Type + Large Content Viewer for non-scaling controls like tab bars | 488 | confirmed | https://developer.apple.com/documentation/uikit/uiaccessibilitylargecontentviewer | 2026-11-14 | UIAccessibilityLargeContentViewer interaction exists and the doc uses tab bars as the example. |
| 210 | Android: font size and display size settings | 488 | unverified | as row 26 | 2026-11-14 | |
| 211 | iOS Reduce Motion; Android Remove animations | 489 | confirmed | as rows 176/177 | 2026-11-14 | |
| 212 | iOS: Voice Control, Switch Control, Larger Text | 490 | confirmed | https://developer.apple.com/accessibility/ios/ | 2026-11-14 | All confirmed on the iOS accessibility page. |
| 213 | Android: Voice Access, Switch Access, Select to Speak | 490 | confirmed | https://support.google.com/accessibility/android/answer/6006564 | 2026-11-14 | All three named on "Android accessibility overview". |
| 215 | iOS 44 x 44 pt; Android 48 x 48dp | 498 | confirmed | as rows 85/86 | 2026-11-14 | Quick-reference restatement. |
| 216 | Android: keep touch targets 8dp or more apart | 499 | confirmed | as row 86 | 2026-11-14 | 8dp verbatim on support answer/7101858. |
| 217 | Android: icon may be 24dp inside a 48dp touch area | 500 | confirmed | as row 86 | 2026-11-14 | "An element like an icon may appear to be 24x24dp but the padding ... comprises the full 48x48dp target". |
| 218 | 48dp is about 9mm | 502 | confirmed | as row 86 | 2026-11-14 | 9mm verbatim. |
| 219 | "Design touch areas at 48 or larger. This covers both 44pt and 48dp." | 527 | confirmed | as rows 85/86 | 2026-11-14 | Reasonable inference. |
| 220 | Material Symbols back icon: arrow with stem / share icon node-graph | 448 | unverified | as row 157 | 2026-11-14 | Quick-reference restatement of rows 157/158. |
| 222 | "Color roles: primary, surface, on surface - design in roles, not fixed codes" | 383 | unverified | as row 166 | 2026-11-14 | M3 color roles are confirmed in general; the specific advice sentence is fine but needs a color page footnote. |

Row numbers are stable IDs; 214 and 221 were merged into rows 172/173 during review, hence the gaps.

## Sources to footnote

The guide cites no inline `[^n]` markers; its closing "Sources" list is the only pointer. Below: the guide's own Sources that should gain a `[^n]` marker under the maintainer's future "## Where to read more" section, plus the missing primary sources the claims above actually rest on. Format: `[n]: Title — Publisher. <URL>. Accessed 2026-11-14.`, with the snippet/fact each marker must sit next to, and the guide line. Group A is already in the guide's "Sources" section; Group B is proposed additional footnotes. Line references are to guides/ios-vs-android.md.

Group A — keep (already in the guide's closing Sources list), add the marker:

[1]: Apple Human Interface Guidelines: Buttons — Apple. https://developer.apple.com/design/human-interface-guidelines/buttons. Accessed 2026-11-14.
- L166/L167 (iOS buttons), L169 ("one or two" prominent buttons), L173 ("44x44 pt"), L175 ("use style, not size ... destructive"). Snippet: "a button needs a hit region of at least 44x44 pt".
[2]: Apple Human Interface Guidelines: Alerts — Apple. https://developer.apple.com/design/human-interface-guidelines/alerts. Accessed 2026-11-14.
- L189/L192 (row: default trailing / stack: default top; Cancel leading row / bottom stack), L202 ("up to three buttons"), L206 ("OK only ... purely informational"), L207 ("an alert can include a text field"), L209 ("use alerts sparingly").
[3]: Apple Human Interface Guidelines: Action sheets — Apple. https://developer.apple.com/design/human-interface-guidelines/action-sheets. Accessed 2026-11-14.
- L203 (rises from bottom, Cancel bottom), L205 ("destructive action at the top").
[4]: Apple Human Interface Guidelines: Layout — Apple. https://developer.apple.com/design/human-interface-guidelines/layout. Accessed 2026-11-14.
- L45/L46 (size classes compact/regular), L47 (regular width = iPad/split view), L49 (size classes not device), L59 (safe areas). Do NOT swap in the adaptivity-and-layout URL - it dead-ends in a 171-character stub.
[5]: Apple Human Interface Guidelines: Tab bars — Apple. https://developer.apple.com/design/human-interface-guidelines/tab-bars. Accessed 2026-11-14.
- L108 (bottom tab bar), L109 (one-word labels), L110 (filled symbols preferred), L112 (More tab; avoid), L113 (sidebar on large screens), L115 (badge), L117 (navigation not actions; don't hide/disable; explain empty), L306 ("dedicated search tab at the trailing end"), L311/Design tip.
[6]: Apple Human Interface Guidelines: Toolbars — Apple. https://developer.apple.com/design/human-interface-guidelines/toolbars. Accessed 2026-11-14.
- L92 (no text label "Back"), L131/L186 (trailing primary action, Done). Note: this page is the only toolbars citation; if the guide cites a "15 characters" limit, it is not on this page (remove it; see rows 70 and Accessibility issues).
[7]: Apple Human Interface Guidelines: Pickers — Apple. https://developer.apple.com/design/human-interface-guidelines/pickers. Accessed 2026-11-14.
- L266 (60 values 0-59; "divides evenly into 60"), L274 ("too much visual weight" for short lists), L278 ("avoid switching to a new screen"; "near the field"), L257 (tap outside to confirm), and the iOS pickers styles cell L253 only after re-checking the page text.
[8]: Apple Human Interface Guidelines: Typography — Apple. https://developer.apple.com/design/human-interface-guidelines/typography. Accessed 2026-11-14.
- L75 (San Francisco), L76 (Body = 17 pt), L77 (smallest 11 pt), L79 (text styles).
[9]: Apple Human Interface Guidelines: Gestures — Apple. https://developer.apple.com/design/human-interface-guidelines/gestures. Accessed 2026-11-14.
- L153 (three-finger swipe undo/redo), L154 (shake to undo), L156 (familiar gesture guidance). Note: NO "left edge" back-swipe text on this page; see rows 35/40/98.
[10]: Apple Human Interface Guidelines: Menus — Apple. https://developer.apple.com/design/human-interface-guidelines/menus. Accessed 2026-11-14.
- L224 (action sheet, not a menu, for action-related choices). Context menu rows L107/L220 need re-check against the page before footnoting.
[11]: Material Design 3 — Google. https://m3.material.io/. Accessed 2026-11-14.
- L17, L23 (design kits), L29, L31 (M3 Design Kit), L404 (after correction).
[12]: Material Components for Android: Dialog — Google/Material Components. https://github.com/material-components/material-components-android/blob/master/docs/components/Dialog.md. Accessed 2026-11-14.
- L189 (buttons end-aligned; full-screen dialog anatomy), L186 (Save text button in header), L204 (full-screen dialog with Close), L257 (Cancel/OK end-aligned text buttons).
[13]: Material Components for Android: Date picker — Google/Material Components. https://github.com/material-components/material-components-android/blob/master/docs/components/DatePicker.md. Accessed 2026-11-14.
- L253 (modal/docked/input modes), L256 ("date range picker ... Mode.RANGE").
[14]: Material Design 3: Time pickers — Google. https://m3.material.io/components/time-pickers/guidelines. Accessed 2026-11-14.
- L263 (Dial 12-hour clock face), L264 (separate hour/minute inputs), L265 (AM/PM selector right of minutes), L267 (no countdown-timer mode; absence confirmed).
[15]: Material Components for Android: Top app bar — Google/Material Components. https://github.com/material-components/material-components-android/blob/master/docs/components/TopAppBar.md. Accessed 2026-11-14.
- L129/L132/L133 (flexible app bars; search app bar; scroll fill). HTTP 429 from GitHub today - file exists, content not re-verified today; safest to cite the M3 top-app-bar pages instead (see [26]).
[16]: Android: Predictive back design — Google. https://developer.android.com/design/ui/mobile/guides/patterns/predictive-back. Accessed 2026-11-14.
- L95 (preview), L98 (wording to fix; page does not present opt-in status), L406, L409 (scale-down, commit point, fade; early release returns).
[17]: Android: System bars — Google. https://developer.android.com/design/ui/mobile/guides/foundations/system-bars. Accessed 2026-11-14.
- L61 (handle vs three-button), L65 (transparent handle; translucent scrim in three-button).
[18]: Android: Edge-to-edge design — Google. https://developer.android.com/design/ui/mobile/guides/layout-and-content/edge-to-edge. Accessed 2026-11-14.
- L62/L63 (edge-to-edge default targetSdk 35; insets read at runtime).
[19]: Android: Build adaptive navigation — Google. https://developer.android.com/develop/adaptive-apps/guides/build-adaptive-navigation. Accessed 2026-11-14.
- L113 (rail medium/expanded), L114 (drawer), L117 (bar compact, rail larger).
[20]: Android: Notification runtime permission — Google. https://developer.android.com/develop/ui/compose/notifications/notification-permission. Accessed 2026-11-14.
- L419 (API 33 / POST_NOTIFICATIONS), L424 (bell button, follow account, delivery order). The guide's views URL 301s here - update it.
[21]: Android: Dynamic color — Google. https://developer.android.com/develop/ui/views/theming/dynamic-colors. Accessed 2026-11-14.
- L377 (since Android 12), L462 (widgets). "Dynamic Color, introduced in Android 12".
[22]: Android Accessibility Help: Touch target size — Google. https://support.google.com/accessibility/android/answer/7101858. Accessed 2026-11-14.
- L173 (48dp ≈ 9mm), L499 (8dp spacing), L500 (24dp icon in 48dp), L527/518 (48dp design rule).
[23]: Flutter docs: Android 14 nonlinear font scaling — Google/Flutter team. https://docs.flutter.dev/release/breaking-changes/android-14-nonlinear-text-scaling-migration. Accessed 2026-11-14.
- L78/L82 (nonlinear scaling to 200%). Google-owned but a migration doc, not the primary evidence; use [27] as the primary footnote and keep this only if a Compose/Flutter migration pointer is genuinely needed.
[24]: Apple WWDC24: Get started with Dynamic Type — Apple. https://developer.apple.com/videos/play/wwdc2024/10074/. Accessed 2026-11-14.
- L78 (Dynamic Type). Keep.
[25]: Android: Window size classes — Google. (Proposed addition: this URL is NOT currently in the guide's Sources list.) https://developer.android.com/develop/adaptive-apps/guides/use-window-size-classes. Accessed 2026-11-14.
- L45 (compact/medium/expanded), L46 (compact <600dp), L47 (medium 600-840dp, expanded >840dp; foldables, split screen).

Group B — missing from the guide's Sources; proposed additions:

[26]: Material Design 3: Top app bar — Google. https://m3.material.io/components/top-app-bar/overview. Accessed 2026-11-14.
- L128 (start-aligned default; center-aligned variant), L129 (medium/large flexible collapse on scroll), L132/L133 (search app bar; on-scroll fill), L135 ("Four variants: Search app bar, small, medium flexible, large flexible" - fix the guide's wording "search, small, medium and large").
[27]: Android 14: Features and APIs overview — Google. https://developer.android.com/about/versions/14/features. Accessed 2026-11-14.
- L78 ("system supports font scaling up to 200%", nonlinear curve), L82. Make this the primary footnote; drop [23].
[28]: AndroidX Compose Material3 Typography reference — Google. https://developer.android.com/jetpack/androidx/releases/compose-material3. Accessed 2026-11-14.
- L76 (body large 16sp / body medium 14sp / body small 12sp; Roboto; sp units), L79 (Display/Headline/Title/Body/Label; Large/Medium/Small). Or cite [29] instead - same facts.
[29]: Material Design 3: Type scale — Google. https://m3.material.io/styles/typography/type-scale. Accessed 2026-11-14.
- L76/L79 (type scale names), L24 (no hard minimum - absence note).
[30]: Apple HIG: App icons — Apple. https://developer.apple.com/design/human-interface-guidelines/app-icons. Accessed 2026-11-14.
- L471 (rounded square, system applies shape), L472 (dark and tinted variants, iOS 18), L474 (safe zone / rounded corners).
[31]: Adaptive icons (Compose icon guide) — Google. https://developer.android.com/develop/ui/compose/system/icon_design_adaptive. Accessed 2026-11-14.
- L471 (foreground/background layers), L472 (monochrome layer), L474 (center safe zone). For the Android 13 themed-icon claim add [32].
[32]: Source: adaptive icons / Android themed icons — Google. https://source.android.com/docs/core/display/adaptive-icons. Accessed 2026-11-14.
- L473 (monochrome layer; dynamic color themes icons; Android 13+; AEP requirement lives at developer.android.com/distribute/aep/aep-req-theme-app-icons).
[33]: Apple HIG: Widgets — Apple. https://developer.apple.com/design/human-interface-guidelines/widgets. Accessed 2026-11-14.
- L460 (Home Screen/Lock Screen/Today View), L461 ("may include one or more interactive elements"; iOS 17+), L462 (system tinting), L463 (system families: small, medium, large, extra-large).
[34]: Apple developer doc: UIAccessibilityLargeContentViewer — Apple. https://developer.apple.com/documentation/uikit/uiaccessibilitylargecontentviewer. Accessed 2026-11-14.
- L488 ("Large Content Viewer ... like tab bars").
[35]: Apple developer doc: UIContentSizeCategory — Apple. https://developer.apple.com/documentation/uikit/uicontentsizecategory. Accessed 2026-11-14.
- L78 (7 standard + 5 accessibility sizes).
[36]: Apple developer doc: SwiftUI swipeActions — Apple. https://developer.apple.com/documentation/swiftui/view/swipeactions(edge:allowsfullswipe:content:). Accessed 2026-11-14.
- L322 ("By default, the user can perform the first action ... with a full swipe").
[37]: Apple Support: Use VoiceOver gestures on iPhone — Apple. https://support.apple.com/en-gb/guide/iphone/iph3e2e2281/ios. Accessed 2026-11-14.
- L485 ("Select the next item — Swipe right"), L486 ("Activate the selected item — Double tap"). Prefer the en-us URL before publishing if it resolves (en-gb is the verified host).
[38]: Apple Support: Reduce Motion — Apple. https://support.apple.com/en-us/111781. Accessed 2026-11-14.
- L407/L489 (Settings > Accessibility > Motion > Reduce Motion).
[39]: Apple accessibility (iOS) overview — Apple. https://developer.apple.com/accessibility/ios/. Accessed 2026-11-14.
- L490 (VoiceOver, Voice Control, Switch Control, Larger Text).
[40]: Apple Support: customize the iPhone Home Screen (tint/dark) — Apple. https://support.apple.com/guide/iphone/customize-apps-and-widgets-on-the-home-screen-iph385473442/ios. Accessed 2026-11-14.
- L462, L472, L473, L377 ("adjust their size, apply a color tint, or switch between light and dark appearances"; iOS 18).
[41]: Apple Design Resources — Apple. https://developer.apple.com/design/resources/. Accessed 2026-11-14.
- L23, L31 (Apple design kits incl. Figma).
[42]: Material Design 3: Icons — Google. https://m3.material.io/styles/icons. Accessed 2026-11-14.
- L346/L347 (Material Symbols; variable axes weight, fill, grade, optical size), L348 (outlined/rounded/sharp), L349 (Apache 2.0).
[43]: Material Design 3: Chips — Google. https://m3.material.io/components/chips/overview. Accessed 2026-11-14.
- L238 (assist, filter, input, suggestion chips verbatim).
[44]: Material Design 3: Switch — Google. https://m3.material.io/components/switch/overview. Accessed 2026-11-14.
- L234 (taller/wider track; optional handle icon; selected icon is a checkmark).
[45]: Material Design 3: Buttons — Google. https://m3.material.io/components/buttons/overview. Accessed 2026-11-14.
- L166 (five types), L167-L169, L171, L80 (ripple/state layer), L184.
[46]: Material Design 3: Dialogs — Google. https://m3.material.io/components/dialogs/guidelines. Accessed 2026-11-14.
- L202 (headline/supporting text/text buttons), L189 (buttons aligned to the end), L205 (no red destructive rule), L209 (intentionally disruptive).
[47]: Material Design 3: Navigation bar — Google. https://m3.material.io/components/navigation-bar/overview. Accessed 2026-11-14.
- L110 (filled icons = active), L111 (pill active indicator), L115 (badge).
[48]: Material Design 3: Date pickers — Google. https://m3.material.io/components/date-pickers/guidelines. Accessed 2026-11-14.
- L254 ("swipe horizontally ... tap the year"; year selection; modal/docked/input).
[49]: Material Design 3: Motion overview — Google. https://m3.material.io/styles/motion/overview. Accessed 2026-11-14.
- L404 (M3 spring physics motion language) - use after the cell correction; do NOT cite this page for "emphasized easing" (not present).
[50]: Material Design 3: Motion transformations — Google. https://m3.material.io/styles/motion/transformations. Accessed 2026-11-14.
- L405 (forward, upward, fade through, shared element).
[51]: Material Design 3: Text fields — Google. https://m3.material.io/components/text-fields/guidelines. Accessed 2026-11-14.
- L288 (filled/outlined), L289 (label floats to top), L290 (supporting text replaced by error text).
[52]: Material Design 3: Color (themed system) — Google. https://m3.material.io/styles/color/themed-system. Accessed 2026-11-14.
- L376 (color roles), L378 (five key colors), L30 (color roles), L383 (design in roles).
[53]: Material Design 3: Color system overview — Google. https://m3.material.io/styles/color/system/overview. Accessed 2026-11-14.
- L378 (13-tone tonal palettes), L166.
[54]: Android Developers: Notifications channels — Google. https://developer.android.com/develop/ui/compose/notifications/channels. Accessed 2026-11-14.
- L420 ("separate notification channels"; the guide's views URL 301s here).
[55]: Android Developers: Request runtime permissions — Google. https://developer.android.com/training/permissions/requesting. Accessed 2026-11-14.
- L434 ("While using the app", "Only this time", "Don't allow"), L435 (rationale pattern; "shouldShowRequestPermissionRationale"), L436 (repeated denial suppresses the dialog; "Don't ask again"), L437.
[56]: Google's Android Accessibility Suite overview — Google. https://support.google.com/accessibility/android/answer/6006564. Accessed 2026-11-14.
- L490 (Voice Access, Switch Access, Select to Speak), L484 (Accessibility Suite).
[57]: Google's TalkBack help — Google. https://support.google.com/accessibility/android/answer/6151827. Accessed 2026-11-14.
- L484-L486 (TalkBack; swipe right = next item; double-tap activates). Note: gesture tables sit behind collapsed tabs on this page; for developer-side gesture testing use developer.android.com accessibility testing docs.
[58]: Google's accessibility features on Android — Google. https://support.google.com/accessibility/android/answer/16323943. Accessed 2026-11-14.
- L407/L489 ("Remove animations" lives under Settings > Accessibility > Color and motion per this help collection). If the exact setting name matters, footnote the device path instead of the page (Setting name not printed verbatim on this page).
[59]: Google's "Change text and display settings" — Google. https://support.google.com/accessibility/android/answer/11183305. Accessed 2026-11-14 (page exists; not opened this pass - open before footnoting).
- L78/L210 (font size and display size settings), L488.
[60]: Material Design 3: Resources (Design Kit, Figma) — Google. https://m3.material.io/resources. Accessed 2026-11-14.
- L23, L31.
[61]: Material Design 3: Navigation drawer — Google. https://m3.material.io/components/navigation-drawer/overview. Accessed 2026-11-14.
- L114 (hamburger drawer), L112 (drawer on larger screens).
[62]: Material Symbols icon gallery — Google (Google Fonts). https://fonts.google.com/icons. Accessed 2026-11-14 (gallery referenced; glyphs not machine-checked).
- L350/L448/L158 (share = three connected dots; back = arrow with stem) - visual check required.
[63]: SF Symbols — Apple. https://developer.apple.com/sf-symbols/. Accessed 2026-11-14 (page referenced; terms not opened this pass).
- L346/L347/L349/L350 (SF Symbols set, weights, outline/filled; license for Apple platforms).

Internal link audit: `[Icon types, formats and libraries](#/guide/icon-types)` and `[Contrast and WCAG](#/guide/contrast-and-wcag)` both resolve (guides/icon-types.md, guides/contrast-and-wcag.md exist). No other internal links. Issue filed in the Accessibility section re: none broken.

## Accessibility and readability issues

Heading order:
- Pass, mostly. Body uses frontmatter title (no h1) then `## 1.` ... `## 30.`, `## Quick reference`, `## If you design one app for both: a checklist`, `## Sources`; `### Date pickers`, `### Time pickers`, `### Dropdowns, lists and steppers` correctly nest under `## 14. Pickers`. No skipped levels. If the maintainer wraps "Where to read more" under the final `## Sources` (or renames it), keep it at `##`.
- "## Sources" (L539) is currently a bullet list of links with no `[^n]` markers and no intro sentence. After footnoting, it becomes "## Where to read more" per the maintainer's plan; it should state what the list is.

Tables:
- Every table has a header row. However nearly every table (≈28 of them) uses a blank top-left header cell (`| | iOS | Android |` and `| | iOS | Android |`-style). Screen readers announce an empty first column header. Fix: give the first column a real header (e.g. `| Aspect | iOS | Android |`) or a short caption/`<table summary>`.
- The two-platform tables are wide; on a narrow viewport they need horizontal scrolling. Site-level concern: allow `overflow-x: auto` on tables.
- No tables lack header rows. No data cells use color alone to convey meaning (see below).

Meaning by color alone:
- None found that stand alone. Destructive actions rely on red AND explicit labels (Delete/Erase, L205/L212); iOS switch described as "green track" (L234) is descriptive prose, not a signal. The Android "no special red rule" (L205) is consistent. Keep it that way; add labels wherever red appears.

Link text:
- No "click here". All links are descriptive ("Apple Human Interface Guidelines: Buttons", "Icon types, formats and libraries", "Contrast and WCAG"). Pass.

Plain language (flagged lines):
- L19: long sentence with nested clauses ("Both platforms update often, so check the current pages before you hand off a final design."). Split it.
- L197 and L247: "This is the 'dialing box' section." — colloquial and unexplained; cut or gloss.
- L29: nested parenthetical for Liquid Glass; heavy but parseable.
- L402: outdated + jargon ("emphasized easing"); corrected in the Claims table.
- L78: very long row with nested conditional; consider splitting the Android cell.
- L379: "shifted slightly to blend with the user's colors" - vague; say what actually happens (dynamic color can override brand accents).
- L462: fine. L425: "Do not ask for notification permission on the first screen" - plain, good.
- Straight vs curly quotes are mixed (e.g. L10 "off"; L100 "create"; L170 "create"); not a11y but inconsistent typography.

External links — status as of 2026-11-14:
- L560 guide link `developer.android.com/develop/ui/views/notifications/notification-permission` 301-redirects to `developer.android.com/develop/ui/compose/notifications/notification-permission`. Recording the right URL; swap the link when editing.
- L555 guide link MDC `TopAppBar.md` (GitHub) returned HTTP 429 (GitHub rate limit) at review time; the file exists on `master` and raw.githubusercontent serves it. Not a 404; keep but note, or point at m3 top-app-bar pages (rows 61/135) which are the living documentation.
- All Apple HIG URLs in the guide's Sources return real pages but curl receives ~17 KB client-side shells (read via browser); none 404.
- `m3.material.io/components/time-pickers/guidelines` returns 200. All m3.material.io pages opened fine.
- `support.google.com/accessibility/android/answer/7101858` returns 200 with the 48dp/9mm/8dp statements verbatim.
- `support.google.com/accessibility/android/answer/6151827` (TalkBack help; not cited in the guide) loads, but gesture documentation hides behind collapsed tabs - see [57].
- Internal `#/guide/icon-types` and `#/guide/contrast-and-wcag` resolve.
- No broken links found. One dead pattern avoided: `.../human-interface-guidelines/adaptivity-and-layout` is a 171-character stub - the guide correctly links `/layout` instead; keep it that way.

Claims that cannot be verified as written (removal or reword before publish):
1. L135 "(under about 15 characters in toolbars)" - no official source exists; REMOVE the parenthetical. Small fix.
2. L255/L264 iOS "wheels style also supports typing with a keyboard" - not present on the HIG pickers page; the wheels style does not accept keyboard input in UIKit/SwiftUI as far as official docs show. Treat as a BUG, not wording. Rewrite the cell (e.g. compact style confirms on outside tap) or delete it. Not a small fix semantically, though the edit is one cell.
3. L404 "Material motion: emphasized easing with fades, scale and shared elements" - corrected in the Claims table (springs; no "emphasized easing" in current M3). Cell rewrite; medium fix, contained.
4. L76 "about 14 to 16sp for body styles" - corrected; include bodySmall 12sp. Small fix.
5. L98 predictive back "optional for developers to turn on" - stale framing; rewrite without the opt-in claim. Small-to-medium fix.
6. L166/L167 iOS "capsule shapes" - not stated for iOS on the buttons page (capsules are shown for visionOS). Reword to rounded rectangles / current iOS 26 button shapes with a WWDC citation, or drop "capsule". Medium fix (a table cell).
7. L253 iOS picker styles (Compact/Inline/Wheels/Automatic) - almost certainly correct (documented styles) but the page wording was not captured in this pass. Verify before footnoting. Small fix (verify + footnote).
8. L257 "Inline updates right away" - not found on the pickers page; delete the clause or cite SwiftUI behavior. Small fix.
9. L306 "a search view that fills the screen" (Android) - M3 documents a Search app bar variant; the "fills the screen" phrasing is unverified. Reword to "opens a full-screen search view" only with citation, else drop. Small fix.
10. L17 "Material 3 (also called Material You)" - drop "(also called Material You)" or footnote it to the Android 12 themed-icons guidance. Trivial fix.
11. L365 Android haptics source - the guide names behaviors but its Sources list has no haptics source; cite the Android haptics guide (search "Android haptics design guide" on developer.android.com; the discovered URL pattern `develop/ui/views/touch-and-input/haptics-feedback` needs confirmation). Medium fix (source lookup).
12. L350/L351/L448/L530 icon glyph descriptions - visual claims (share, back, system icon shapes); verify against fonts.apple.com/sf-symbols and fonts.google.com/icons before footnoting. Small fix.
13. L322 "long swipe runs the first action" - confirmed only for SwiftUI `swipeActions`; before shipping, align the wording to SwiftUI (default full-swipe triggers the first action). Small fix.
14. L488 Android "font size and display size settings" - page for the claim (answer/11183305) exists but was not opened in this pass; open it before footnoting. Small fix.
15. L379 "shifted slightly to blend" - vague; replace with "dynamic color can override brand accents". Small fix.
16. Quick reference L510-518 and L519 duplicates the unverified items above (L135-adjacent: none there, but L512 "start-aligned title" is fine; L515 wheels/calendar - fine as summary; L527 "48 or larger" fine). L515 "Wheels, compact and inline calendar" repeats the unverified iOS wheel wording? No - wheels is confirmed as a style name? No: L253 was unverified; so Quick ref L515 repeats it. Flag.

Items flagged for maintainer attention (exceed a small fix):
- The two corrected cells (L76, L404) and both wheels-typing cells (L255, L264) are beyond a one-line touch-up.
- The iOS picker-style cells (L253) and picker confirm behavior (L257) need the pickers page re-read carefully in a browser; the curl scan captures are partial.
- The Android "remove animations" source remains under-cited; one authoritative page must be chosen (device Settings path vs the help answer) before publishing the footnote.
- If the maintainer wants full inline sourcing, expect ~40-60 [^n] markers across this guide; the Sources list as it stands in the guide is far thinner than the claims it must support.

General readability otherwise: sentences are short, sections are well-scoped, the iOS-left/Android-right pattern is consistent throughout, and the guide avoids jargon overload. The biggest barrier to a screen-reader user is the empty first table header cell in ~28 tables.

Claim tally (from the table above): 220 rows total — confirmed 135, corrected 2, unverified 83, removed 0. No page in this pass was CAPTCHA/Cloudflare-blocked, so no row carries the "unverified (blocked)" label; Apple HIG pages were client-side rendered and were read in a browser instead of curl.

Corrected rows: 21, 172.

Unverified rows needing a source or a reword: 1, 4, 5, 13, 26, 32, 33, 34, 35, 36, 37, 39, 40, 41, 42, 49, 56, 60, 62, 64, 65, 67, 70, 72, 76, 77, 79, 83, 84, 88, 90, 91, 99, 101, 104, 106, 107, 108, 109, 111, 113, 114, 115, 117, 118, 121, 125, 127, 129, 134, 136, 137, 138, 139, 143, 144, 147, 149, 150, 151, 155, 157, 158, 159, 160, 161, 162, 167, 168, 171, 174, 180, 182, 184, 187, 190, 191, 194, 198, 208, 210, 220, 222.
