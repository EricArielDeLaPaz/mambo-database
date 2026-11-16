# Branch: start from scratch

Read `decisions.md` when you reach step 2. Read `components-and-icons.md` at step 5 and `output-formats.md` at step 6.

## Step 1. Intake (two question calls)
**Call 1** (4 questions):
1. Industry (header "Industry"): Finance, insurance, legal | Health, wellness, education | Retail, food, travel, entertainment | Technology, data, media. Their typed "Other" is mapped to the nearest industry id (finance, insurance, legal, healthcare, wellness, education, retail, food-beverage, hospitality, technology, data, entertainment, gaming, creative, media, nonprofit, sustainability, agriculture).
2. Platforms (multi-select): Desktop web | Mobile web | iOS app | Android app.
3. Feel (multi-select, up to 3): Professional and trustworthy | Friendly and fun | Calm and fresh | Bold and premium.
4. Themes: Light only | Light and dark (Recommended).
Then ask in chat: the product name and one sentence on what it does.

**Call 2** (up to 4 questions):
1. Brand colors: "Yes, I will give hex codes" | "Extract from a logo or site" | "One color only" | "No, suggest some (Recommended)".
2. Brand fonts: "Yes, keep them" | "No, suggest a pair (Recommended)".
3. Accessibility target: "WCAG AA (Recommended)" | "AA, and AAA for body text".
4. Density: Compact | Comfortable (Recommended) | Spacious.
Ask for hex codes, font names, or the logo link in chat. If the person gave a logo, extract the dominant colors yourself or ask for hex codes; do not guess.
Write the answers to `progress.md`. **Close the step.**

## Step 2. Colors
- With brand colors: keep their hue. Adjust only lightness to pass contrast. Say what you changed and why.
- Without: run `node scripts/pick.js colors --industry <id> --mood "<words from feel>" --n 3` and show the three results as a short table (name, mood, primary, ratio). Let the person pick one, or ask for one change.
- Build the roles from `decisions.md` (brand, neutrals, feedback). If the person chose dark mode, derive the dark theme with the rules in `decisions.md`.
- Run `contrast.js` on every required pair listed in `decisions.md`, in each theme. Fix failures by changing lightness, then re-run.
- Write `tokens.json` (colors) and add a color table to `README.md`. **Close the step.**

## Step 3. Type
- With brand fonts: use them; say if one is not on Google Fonts (it must be installed locally to use in Figma).
- Without: run `node scripts/pick.js type --industry <id> --role body --n 3`, show each result with its verified pairing, and let the person pick.
- Set the scale from `decisions.md` (base, ratio, line heights, weights). Write it to `tokens.json`. **Close the step.**

## Step 4. Foundations
Set spacing, radius, elevation and motion from `decisions.md`, using the feel and density answers. Present the values in one small table, not prose. Write to `tokens.json`. **Close the step.**

## Step 5. Components and icons
Follow `components-and-icons.md`. Ask whether to use the preset for their product or pick their own; show what the preset contains before they decide. **Close the step.**

## Step 6. Document and export
Follow `output-formats.md`. Run `contrast.js` once more on the final values. Then tell the person: what files were made, what to check first, and that pasting the colors into the site's Design Systems tab will flag count and contrast problems. **Close the step.**
