# Branch: use the Mambo Database

The database holds color sets with computed contrast, typefaces with verified pairings, components and icons. This branch picks from it instead of designing from nothing. Read `decisions.md` at step 4, `components-and-icons.md` at step 5, `output-formats.md` at step 6.

## Step 1. Intake (one question call, 4 questions)
1. Industry (header "Industry"): Finance, insurance, legal | Health, wellness, education | Retail, food, travel, entertainment | Technology, data, media. Map their typed "Other" to the nearest industry id.
2. Platforms (multi-select): Desktop web | Mobile web | iOS app | Android app.
3. Feel (multi-select, up to 3): Professional and trustworthy | Friendly and fun | Calm and fresh | Bold and premium.
4. Themes: Light only | Light and dark (Recommended).
Ask in chat for the product name and one sentence on what it does. Write answers to `progress.md`. **Close the step.**

## Step 2. Colors
Run `node scripts/pick.js colors --industry <id> --mood "<words>" --n 3`. Show the three as a table (name, mood, primary, text ratio). The person picks one. Offer exactly one tweak round (change the primary, warmer or cooler neutrals). If they want to swap in a brand color, adjust lightness only and re-check. Derive dark mode if chosen (`decisions.md`). Run `contrast.js` on every required pair in each theme. Write `tokens.json`. **Close the step.**

## Step 3. Type
Run `node scripts/pick.js type --industry <id> --role body --n 3`. Each result lists verified pairings with weights. The person picks one pair. Write it to `tokens.json`. **Close the step.**

## Step 4. Foundations
Set the type scale, spacing, radius, elevation and motion from `decisions.md` using the feel answers. One small table. **Close the step.**

## Step 5. Components and icons
Follow `components-and-icons.md`. **Close the step.**

## Step 6. Document and export
Follow `output-formats.md`. Name the database set each choice came from in the README so the source is traceable. **Close the step.**
