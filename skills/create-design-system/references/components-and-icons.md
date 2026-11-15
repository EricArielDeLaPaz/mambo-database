# Step 5: components and icons

This is the step that points back to the Mambo site. Everything is read from bundled data; do not search the web.

## Components
1. Ask (one call): "Components" -> Use the preset for my product (Recommended) | Small starter (the core set only) | I will pick my own | Skip components.
2. Show the preset as one line of names (below). Let the person add or remove by typing names.
3. To pick their own: list the categories with `node scripts/pick.js components --platform <p>` (one line per component: id, name, category). Offer up to 4 categories per question call as multi-select with the 4 most common components in each, and take the rest from "Other".
4. For each chosen component run `node scripts/brief.js <id> <id> ...` (up to 8 ids per run). It prints a short card: what it is for, when to use, when not to, variants, states, tokens, accessibility role. Use these cards to write the component documentation. Do not open the full entries unless you are building the Figma handoff for that component (`entries/components/<id>.md`).
5. Keep only the states the system uses: default, focus (always), hover (pointer devices only), pressed, disabled, error where it applies.

### Presets (ids are real entries)
- **Core set (every product):** button, link, text-input, checkbox, radio, select, card, inline-alert, modal-dialog, toast, tooltip
- **Web app, SaaS or internal tool:** core + tabs, table, sidebar-navigation, top-navigation-bar, badge, tag, toggle-switch, search-field, pagination, empty-state, skeleton, breadcrumbs, menu, popover, date-picker, progress-bar
- **Mobile app:** core + bottom-tab-bar, top-navigation-bar, bottom-sheet, toggle-switch, segmented-control, list, search-field, floating-action-button, skeleton, empty-state. Add for iOS: ios-navigation-bar, ios-sheet, ios-alert, ios-action-sheet. Add for Android: android-top-app-bar, android-navigation-bar, android-snackbar, android-chip.
- **Marketplace or e-commerce:** core + search-field, rating, pagination, carousel, image-gallery, chip, badge, number-input, stepper, pricing-table, empty-state, login-form, password-input
- **Content site:** core + top-navigation-bar, footer, breadcrumbs, pagination, search-field, tag, avatar, banner, accordion
- **AI product:** core + chat-message, textarea, command-palette, file-uploader, skeleton, spinner, popover, menu, comment-thread

## Icons
1. Run `node scripts/pick.js icons` (one line per set: id, name, style, license, icon count). Ask (one call): "Icon style" -> Outline (Recommended) | Filled | Duotone or bold | I will choose a set.
2. Recommend one set using these criteria: style matches the feel (outline for professional and calm, filled for bold, rounded for friendly), license allows commercial use, enough icons for the product (count), one set only. Mention that SF Symbols cannot be redistributed, so it is not in the database; designers can use Apple's own app.
3. Keep the license and copyright notice with the icons (they are in each set's folder on the site). State that in the README.
4. Do not mix sets. List the 12 to 20 icons the product probably needs (menu, search, close, add, edit, delete, settings, user, check, alert, info, arrow, chevron, upload, download, calendar) and check each exists with `node scripts/pick.js icons --set <id> --has <name>`.
5. Icons that carry meaning need a text label or accessible name.
