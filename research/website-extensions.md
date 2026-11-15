# Browser extensions for web designers / front-end developers (live-site work)

Scope: extensions used on live websites, Chrome-first. Every Chrome Web Store listing below was opened and read directly (HTTP 200) on 2026-11-14; Firefox status was checked against the official addons.mozilla.org API and Edge status against Microsoft Edge Add-ons store search on the same date. Prices, publishers, versions and user counts are as shown on the store page at check time. Descriptions are paraphrased in my own words; no store copy is reproduced.

## Summary table

| Extension | Category | Free/Paid | Browsers | Checked |
|---|---|---|---|---|
| Grayscale Screen | Vision-deficiency simulation (grayscale converter) | Free | Chrome only (no Firefox/Edge listing found) | 2026-11-14 |
| Web Disability Simulator | Vision-deficiency / disability simulation | Free | Chrome only (no Firefox/Edge listing found) | 2026-11-14 |
| Colorblindly | Color-vision-deficiency simulation | Free | Chrome only (project states Chrome-only) | 2026-11-14 |
| ColorZilla | Color picker / eyedropper | Free | Chrome, Firefox, Edge | 2026-11-14 |
| Eye Dropper | Color picker / eyedropper | Free | Chrome; same-name Firefox/Edge listings not confirmed as same project | 2026-11-14 |
| WhatFont | Font identifier | Free | Chrome, Edge; Firefox only via same-name third-party listings | 2026-11-14 |
| CSS Peeper | CSS inspector / style extractor | Freemium | Chrome, Edge; no Firefox listing found | 2026-11-14 |
| VisBug | CSS inspector / visual design tools | Free | Chrome, Firefox, Edge | 2026-11-14 |
| CSS Scan | Design-token / style extractor | Paid | Chrome (vendor site claims Firefox/Safari/Edge builds; no store listings found) | 2026-11-14 |
| axe DevTools | Contrast / accessibility checker | Freemium | Chrome, Firefox, Edge | 2026-11-14 |
| WAVE Evaluation Tool | Contrast / accessibility checker | Free | Chrome, Firefox; Edge per vendor site, listing unconfirmed | 2026-11-14 |
| Page Ruler | Ruler / measure tool | Free | Chrome, Edge; Firefox same-name listing unconfirmed | 2026-11-14 |
| PerfectPixel | Ruler / measure + design-overlay compare | Freemium | Chrome, Firefox, Edge | 2026-11-14 |
| Responsive Viewer | Responsive viewport tester | Free | Chrome; same-name Edge listing unconfirmed | 2026-11-14 |
| Window Resizer | Responsive viewport tester | Free | Chrome; Firefox/Edge same-name listings unconfirmed | 2026-11-14 |
| GoFullPage | Screenshot / full-page capture | Free | Chrome, Firefox, Edge | 2026-11-14 |
| FireShot | Screenshot / full-page capture | Freemium | Chrome, Firefox, Edge | 2026-11-14 |
| Imageye | Asset / image extractor | Free | Chrome, Edge; no Firefox listing found | 2026-11-14 |
| SVG Export | Asset / SVG extractor | Free | Chrome, Firefox, Edge | 2026-11-14 |
| Pesticide (without hover bar) | Grid / layout overlay (element outlines) | Free | Chrome only (AMO "Pesticide" is a different project) | 2026-11-14 |
| Dark Reader | Dark-mode / forced-color preview | Free | Chrome, Firefox, Edge | 2026-11-14 |
| Animation Policy | Motion / reduced-motion tester | Free | Chrome only (no Firefox/Edge listing found) | 2026-11-14 |
| MotionBlock | Motion / reduced-motion tester | Free | Chrome only (no Firefox/Edge listing found) | 2026-11-14 |

## Entries

### 1. Grayscale Screen
- Publisher: paperlite831 (individual developer)
- What it does: Applies a one-toggle grayscale filter to the whole page, which doubles as a crude check for places where color alone carries meaning.
- Price: Free
- Store page: https://chromewebstore.google.com/detail/grayscale-screen/mccgphkdghdpebkjkokhbodbjobpihal
- Browsers: Chrome (verified); Firefox/Edge: no listing for this extension found in either store's search on the check date.
- License/terms: Proprietary; no open-source license stated on the store page.
- Listing info: v1.0, updated 2023-06-04, ~3,000 users shown.
- Checked: 2026-11-14

### 2. Web Disability Simulator
- Publisher: Metamatrix (developer Patrik Hassel)
- What it does: Adds filter-based simulations of how a page renders for several disability types (color blindness, low vision, dyslexia-style effects) so designers can spot perception problems.
- Price: Free
- Store page: https://chromewebstore.google.com/detail/web-disability-simulator/olioanlbgbpmdlgjnnampnnlohigkjla
- Browsers: Chrome (verified); Firefox/Edge: no listing for this extension found in either store's search on the check date.
- License/terms: Proprietary; no open-source license stated on the store page.
- Listing info: v1.1.1, updated 2025-02-11, ~20,000 users shown.
- Checked: 2026-11-14

### 3. Colorblindly
- Publisher: oftheheadland
- What it does: Lays a CSS color filter over the page to simulate eight color-vision deficiencies (protanopia/deuteranopia/tritanopia and weak variants) for checking whether meaning survives without color.
- Price: Free
- Store page: https://chromewebstore.google.com/detail/colorblindly/floniaahmccleoclneebhhmnjgdfijgg
- Browsers: Chrome (verified); the project's GitHub states it is Chrome-only; no Firefox/Edge listing found.
- License/terms: MIT (GitHub repo oftheheadland/Colorblindly, linked from the project).
- Listing info: v2.5, updated 2025-04-24, ~100,000 users shown.
- Checked: 2026-11-14

### 4. ColorZilla
- Publisher: Iosart Labs LLC
- What it does: Eyedropper-and-picker suite that reads any pixel on the page, copies the value in several formats, and adds a gradient editor and a page-wide color analyzer.
- Price: Free
- Store page: https://chromewebstore.google.com/detail/colorzilla/bhlhnicpbhignbdhedgjhgdocnmhomnp
- Browsers: Chrome (verified); Firefox yes (AMO "colorzilla", author Alex Sirota: https://addons.mozilla.org/en-US/firefox/addon/colorzilla/); Edge yes (https://microsoftedge.microsoft.com/addons/detail/dficlbaoinpdhpbeikhmnbpgfoekegeo).
- License/terms: Proprietary; no open-source license stated on the store page.
- Listing info: v4.1, updated 2024-05-22, ~4,000,000 users shown.
- Checked: 2026-11-14

### 5. Eye Dropper
- Publisher: eyedropper.org
- What it does: Captures a color from the page or anywhere on screen with a keyboard shortcut, copies it in multiple formats, and keeps palettes and pick history.
- Price: Free
- Store page: https://chromewebstore.google.com/detail/eye-dropper/hmdcmlfkchdmnmnmheododdhjedfccka
- Browsers: Chrome (verified); Firefox: AMO has same-name eyedropper add-ons but by other authors (e.g. "Color Picker - Eye Dropper" by Abdul Wahab), not confirmed as this project; Edge: same-name listing at https://microsoftedge.microsoft.com/addons/detail/bfhdeinfmlaabpnoagpmaghfhidoidbk, author match unconfirmed.
- License/terms: Proprietary; no open-source license stated on the store page.
- Listing info: v4.10.3.17, updated 2026-07-15, ~1,000,000 users shown.
- Checked: 2026-11-14

### 6. WhatFont
- Publisher: chengyinliu.com (Chengyin Liu)
- What it does: Hover-over font inspector that reports family, size, weight and color of text and detects which web-font service is serving it.
- Price: Free
- Store page: https://chromewebstore.google.com/detail/whatfont/jabopobgcpjmedljpbcaablpmlmfcogm
- Browsers: Chrome (verified); Firefox: no same-publisher listing on AMO (only same-name add-ons by other authors); Edge yes via community port "WhatFont for Microsoft Edge" (https://microsoftedge.microsoft.com/addons/detail/mnmachmhlpblookdiaaeedcnjpnbmpji), described as posted for Chengyin Liu.
- License/terms: Proprietary per Chrome listing; the Edge port notes the extension is open source with rights reserved by Chengyin Liu.
- Listing info: v3.3.0, updated 2026-10-12, ~3,000,000 users shown.
- Checked: 2026-11-14

### 7. CSS Peeper
- Publisher: Sparkglare Sp. z o.o.
- What it does: Designer-oriented panel that lists a page's colors, typography and downloadable assets and shows the CSS values behind the element under the cursor, with premium features behind in-app purchases.
- Price: Freemium (store lists in-app purchases)
- Store page: https://chromewebstore.google.com/detail/css-peeper/mbnbehikldjhnfehhnaidhjhoofhpehk
- Browsers: Chrome (verified); Edge yes (https://microsoftedge.microsoft.com/addons/detail/anpmnhecdmglokefgjkloellpkhcmnen, same tagline; author not independently confirmed); Firefox: no listing found.
- License/terms: Proprietary; store page links Terms & Conditions and Privacy Policy (csspeeper.com).
- Listing info: v1.2.4, updated 2026-11-14, ~400,000 users shown.
- Checked: 2026-11-14

### 8. VisBug
- Publisher: Google Ireland, Ltd. (GoogleChromeLabs project)
- What it does: Open-source in-page design toolbar that lets you move, resize, restyle and measure live elements, and inspect spacing, alignment and accessibility properties like a design tool.
- Price: Free
- Store page: https://chromewebstore.google.com/detail/visbug/cdockenadnadldjbbgcallicgledbeoc
- Browsers: Chrome (verified); Firefox yes (AMO "visbug" by argyleink: https://addons.mozilla.org/en-US/firefox/addon/visbug/); Edge yes (https://microsoftedge.microsoft.com/addons/detail/visbug/kdmdoinnkaeognnpegpkepdnggeaodkn).
- License/terms: Apache-2.0 (GitHub repo GoogleChromeLabs/ProjectVisBug).
- Listing info: v0.4.10, updated 2024-11-20, ~200,000 users shown.
- Checked: 2026-11-14

### 9. CSS Scan
- Publisher: getcssscan.com (Guilherme Vieira Rizzo listed as developer)
- What it does: Paid point-and-copy inspector that shows the active CSS of any hovered element with declarations cleaned up, including pseudo-classes and media queries, with optional Tailwind output.
- Price: Paid (store text: "This extension is paid and requires a license to use it"; license at getcssscan.com)
- Store page: https://chromewebstore.google.com/detail/css-scan/gieabiemggnpnminflinemaickipbebg
- Browsers: Chrome (verified); vendor site claims Chrome, Firefox, Safari and Edge builds, but no Firefox AMO or Edge Add-ons listing was found in store search.
- License/terms: Proprietary commercial license (purchase required).
- Listing info: v4.5, updated 2026-04-16, ~10,000 users shown, in-app purchases offered.
- Checked: 2026-11-14

### 10. axe DevTools
- Publisher: Deque Systems Inc
- What it does: Runs automated WCAG accessibility checks (including color-contrast rules) inside the browser and walks you through failures with guided tests.
- Price: Freemium (free core; paid Pro tier per deque.com)
- Store page: https://chromewebstore.google.com/detail/axe-devtools-web-accessib/lhdoppojpmngadmnindnejefpokejbdd
- Browsers: Chrome (verified); Firefox yes (AMO "axe-devtools" by Deque Systems Inc.: https://addons.mozilla.org/en-US/firefox/addon/axe-devtools/); Edge yes (https://microsoftedge.microsoft.com/addons/detail/axe-devtools-web-access/kcenlimkmjjkdfcaleembgmldmnnlfkn).
- License/terms: Proprietary; store page links Deque's terms of use for the extension (deque.com/terms-of-use/axe-ext).
- Listing info: v4.140.0, updated 2026-10-28, ~400,000 users shown.
- Checked: 2026-11-14

### 11. WAVE Evaluation Tool
- Publisher: WebAIM
- What it does: WebAIM's evaluation extension injects icons and indicators onto the live page to flag accessibility errors, alerts and structural issues, with all analysis done locally in the browser.
- Price: Free
- Store page: https://chromewebstore.google.com/detail/wave-evaluation-tool/jbbplnpkjmmeebjpijfedlgcdilocofh
- Browsers: Chrome (verified); Firefox yes (AMO "WAVE Accessibility Extension" by WebAIM: https://addons.mozilla.org/en-US/firefox/addon/wave-accessibility-tool/); Edge: wave.webaim.org/extension states a WAVE Edge extension exists, but no Edge Add-ons listing was confirmed in store search.
- License/terms: Proprietary; no open-source license stated on the store page.
- Listing info: v3.3.1.0, updated 2026-05-08 (changelog on page); user count not shown in fetched page text.
- Checked: 2026-11-14

### 12. Page Ruler
- Publisher: leocompson
- What it does: Drags a labeled pixel ruler rectangle over the page that continuously reports width, height, start and end coordinates for measuring elements and spacing.
- Price: Free
- Store page: https://chromewebstore.google.com/detail/page-ruler/jcbmcnpepaddcedmjdcmhbekjhbfnlff
- Browsers: Chrome (verified); Firefox: AMO "Page Ruler" by Leonardo (https://addons.mozilla.org/en-US/firefox/addon/page-ruler/) is plausibly the same project but the publisher match could not be confirmed; Edge yes: https://microsoftedge.microsoft.com/addons/detail/page-ruler/dbbmodidecniimhhohmohndfdhhfcdbo carries the same description text.
- License/terms: Proprietary; no open-source license stated on the store page.
- Listing info: v0.1.8, updated 2026-07-12, ~500,000 users shown.
- Checked: 2026-11-14

### 13. PerfectPixel
- Publisher: WELLDONECODE LLC
- What it does: Drops a semi-transparent mockup (PNG/JPG/SVG) onto the live page with opacity, blend modes and click-through controls so the build can be compared against the design pixel-for-pixel.
- Price: Freemium (free tier 2 layers per domain; paid Pro per store text)
- Store page: https://chromewebstore.google.com/detail/perfectpixel-by-welldonec/dkaagdgjmgdmbnecmcefdhjekcoceebi
- Browsers: Chrome (verified); Firefox yes (AMO "PerfectPixel by WellDoneCode (pixel perfect)" by WELLDONECODE: https://addons.mozilla.org/en-US/firefox/addon/perfectpixel/); Edge yes (https://microsoftedge.microsoft.com/addons/detail/perfectpixel-by-welldonec/oolfkllppnieaaddmlfgljpboeagcobk).
- License/terms: Proprietary; no open-source license stated on the store page.
- Listing info: v3.2.0.9, updated 2026-11-08, ~300,000 users shown, in-app purchases offered.
- Checked: 2026-11-14

### 14. Responsive Viewer
- Publisher: bojita.com
- What it does: Renders the page inside preset device frames (desktop, laptop, tablet, mobile) with custom dimensions, rotation and a pixel-grid overlay for responsive checks.
- Price: Free
- Store page: https://chromewebstore.google.com/detail/responsive-viewer/idkjhjlkhcoagockknjpbkkakbcegifk
- Browsers: Chrome (verified); Firefox: no listing found; Edge: same-name "Responsive viewer For Edge" listing (https://microsoftedge.microsoft.com/addons/detail/iedmgngpbobnofibfaniioeobecbpkdn) found, author match unconfirmed.
- License/terms: Proprietary; no open-source license stated on the store page.
- Listing info: v1.4, updated 2025-11-15, ~388 users shown.
- Checked: 2026-11-14

### 15. Window Resizer
- Publisher: coolx10.com
- What it does: Resizes the browser window or viewport to saved presets or custom dimensions, with shortcuts and import/export, for testing layouts at different resolutions.
- Price: Free
- Store page: https://chromewebstore.google.com/detail/window-resizer/kkelicaakdanhinjdeammmilcgefonfh
- Browsers: Chrome (verified); Firefox: AMO "Window Resizer" by Softpulse Infotech (https://addons.mozilla.org/en-US/firefox/addon/window-resizer/) and Edge: listing https://microsoftedge.microsoft.com/addons/detail/window-resizer/jjlhbpaepbfkgmjdcndigpcfaliggpfj (bitbucket.org/antwhere) both exist but are not confirmed as the same publisher as the Chrome item.
- License/terms: Proprietary; no open-source license stated on the Chrome store page.
- Listing info: v2.7.0, updated 2024-07-04, ~800,000 users shown.
- Checked: 2026-11-14

### 16. GoFullPage
- Publisher: Full Page LLC
- What it does: Captures the entire scrollable page as a PNG or PDF in one click, stitching it automatically, without requesting extra permissions.
- Price: Free
- Store page: https://chromewebstore.google.com/detail/gofullpage-full-page-scre/fdpohaocaechififmbbbbbknoalclacl
- Browsers: Chrome (verified); Firefox yes (AMO "GoFullPage - Full Page Screen Capture" by GoFullPage: https://addons.mozilla.org/en-US/firefox/addon/gofullpage-screenshot/); Edge yes (https://microsoftedge.microsoft.com/addons/detail/gofullpage-full-page-sc/hfaciehifhdcgoolaejkoncjciicbemc); gofullpage.com also states "Also available on Edge & Firefox".
- License/terms: Proprietary on the store; the listing links the original open-source project (GitHub mrcoles/full-page-screen-capture-chrome-extension, MIT).
- Listing info: v8.11, updated 2026-11-07, ~11,000,000 users shown.
- Checked: 2026-11-14

### 17. FireShot
- Publisher: getfireshot.com (Evgeny Suslikov)
- What it does: Captures the visible area, a selection, or the full page, then annotates, saves or exports the result to PDF/PNG/clipboard or an external editor.
- Price: Freemium (free core; paid Pro per getfireshot.com)
- Store page: https://chromewebstore.google.com/detail/take-webpage-screenshots/mcbpblocgmgfnpjjppndjkmgjaogfceg
- Browsers: Chrome (verified); Firefox yes (AMO "Full Page Screen Capture - FireShot" by Evgeny Suslikov: https://addons.mozilla.org/en-US/firefox/addon/fireshot/); Edge yes (https://microsoftedge.microsoft.com/addons/detail/take-webpage-screenshots-/fcbmiimfkmkkkffjlopcpdlgclncnknm); getfireshot.com lists Chrome, Edge, Firefox and other Chromium/Mozilla browsers.
- License/terms: Proprietary; no open-source license stated on the store page.
- Listing info: v2.1.4.22, updated 2026-11-14, ~3,000,000 users shown.
- Checked: 2026-11-14

### 18. Imageye
- Publisher: imageye.net
- What it does: Finds every image on a page (including srcset variants, CSS backgrounds and inline SVGs), filters them by size/type/layout, converts formats and bulk-downloads them individually or as a ZIP.
- Price: Free (store listing shows no paid tier; imageye.net markets an optional Pro)
- Store page: https://chromewebstore.google.com/detail/image-downloader-imageye/agionbommeaifngbhincahgmoflcikhm
- Browsers: Chrome (verified); Edge yes (https://microsoftedge.microsoft.com/addons/detail/image-downloader-imagey/amonifmmondcchihhngflfheklnabffa); Firefox: no listing found.
- License/terms: Proprietary; no open-source license stated on the store page.
- Listing info: v7.5.7, updated 2026-10-29, ~2,000,000 users shown.
- Checked: 2026-11-14

### 19. SVG Export
- Publisher: svgexport.io (delanebob)
- What it does: Scans a site for inline and linked SVGs and exports them as SVG, PNG or JPEG with styles inlined, ready to paste into tools like Figma.
- Price: Free
- Store page: https://chromewebstore.google.com/detail/svg-export/naeaaedieihlkmdajjefioajbbdbdjgp
- Browsers: Chrome (verified); Firefox yes (AMO "SVG Export" by delanebob: https://addons.mozilla.org/en-US/firefox/addon/svg_export/); Edge yes (https://microsoftedge.microsoft.com/addons/detail/svg-export/eehngmhcinichpjooegigoineafdfekl, also by delanebob); svgexport.io states "For Chrome, Firefox, and Edge".
- License/terms: Proprietary; no open-source license stated on the store page.
- Listing info: v3.1.0, updated 2026-07-21, ~200,000 users shown.
- Checked: 2026-11-14

### 20. Pesticide (without hover bar)
- Publisher: Michael K (michaelkolesidis.com)
- What it does: Injects colored outlines around every element to expose box-model spacing and nesting at a glance for CSS layout debugging, without altering hover styling.
- Price: Free
- Store page: https://chromewebstore.google.com/detail/pesticide-without-hover-b/ibaidbcedfbojihflojeekadmebnlbpb
- Browsers: Chrome (verified); Firefox: AMO "Pesticide" (https://addons.mozilla.org/en-US/firefox/addon/pesticide/) is a different project by another author; no Edge listing found.
- License/terms: AGPL-3.0 (stated on the store page; matches GitHub michaelkolesidis/pesticide-without-hover-bar).
- Listing info: v3.0.0, updated 2025-07-15, ~1,000 users shown.
- Checked: 2026-11-14

### 21. Dark Reader
- Publisher: Dark Reader Ltd
- What it does: Generates dynamic dark themes for any site via several filter modes, with per-site controls and system-dark-mode sync, useful for previewing forced-dark rendering.
- Price: Free
- Store page: https://chromewebstore.google.com/detail/dark-reader/eimadpbcbfnmbkopoojfekhnkhdbieeh
- Browsers: Chrome (verified); Firefox yes (AMO "Dark Reader" by Dark Reader Ltd: https://addons.mozilla.org/en-US/firefox/addon/darkreader/); Edge yes (https://microsoftedge.microsoft.com/addons/detail/dark-reader/ifoakfbpdcdoeenechcleahebpibofpc).
- License/terms: MIT (GitHub repo darkreader/darkreader); the store page additionally requires agreement to darkreader.org terms of use on install.
- Listing info: v4.9.135, updated 2026-11-06, ~7,000,000 users shown.
- Checked: 2026-11-14

### 22. Animation Policy
- Publisher: chrome-a11y-extensions
- What it does: Controls page motion by running image/GIF/SVG animations only once or disabling them entirely, which tests how a page behaves with animation removed (videos unaffected).
- Price: Free
- Store page: https://chromewebstore.google.com/detail/animation-policy/ncigbofjfbodhkaffojakplpmnleeoee
- Browsers: Chrome (verified); Firefox/Edge: no listing found in either store's search on the check date.
- License/terms: Proprietary; no open-source license or source link stated on the store page.
- Listing info: v0.2, updated 2024-03-05, ~10,000 users shown.
- Checked: 2026-11-14

### 23. MotionBlock
- Publisher: molodchyk.com
- What it does: Blocks GIFs, CSS/JS/SVG animations, parallax and other motion globally or per site so designers can verify a page's reduced-motion state and readability.
- Price: Free
- Store page: https://chromewebstore.google.com/detail/motionblock-gif-blocker-a/hakggpkloechnmgdkojohpahbglnhcng
- Browsers: Chrome (verified); Firefox/Edge: no listing found in either store's search on the check date.
- License/terms: GPL-3.0 (stated on the store page; GitHub molodchyk/MotionBlock).
- Listing info: v1.0.1, updated 2026-07-05, ~133 users shown.
- Checked: 2026-11-14

## Method note

All 23 Chrome Web Store pages were opened and read directly (HTTP 200) on 2026-11-14, with Firefox availability checked via the official addons.mozilla.org search API and Edge availability via Microsoft Edge Add-ons store search; ratings were deliberately excluded because store review counts could not be read reliably from the fetched page text. NoCoffee Vision Simulator was dropped because no official Chrome Web Store listing could be located for it, and several same-name Firefox/Edge listings (Eye Dropper, Responsive Viewer, Window Resizer, Page Ruler) were kept in the file only with explicit "unconfirmed publisher" notes because store metadata did not let me attribute them to the same developer.
