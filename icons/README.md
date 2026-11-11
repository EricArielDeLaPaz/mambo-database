# Icons

Curated UI icons from free, commercially usable open source icon libraries, grouped by the design system they come from.
Each folder holds normalized SVGs (`currentColor`, no fixed size) plus the library's original `LICENSE`. Metadata is in `sets.json`.
To re-import, `npm pack` the packages listed in `sets.json` into one folder and run `node scripts/import-icons.mjs <folder>`.

## Licenses (checked against each package's LICENSE file)
MIT: Feather, Heroicons, Tabler, Phosphor, Bootstrap Icons, Fluent UI System Icons, Ionicons, Octicons. ISC: Lucide. Apache-2.0: Material Icons, Carbon.
All allow commercial use, modification and redistribution when the copyright notice and license text are kept. Apache-2.0 also asks that changes are stated (these files were normalized).

## Not included, and why
- **SF Symbols (Apple, iOS and macOS):** Apple's license limits the symbols to apps for Apple platforms and does not allow redistributing them, so they cannot be in an open database. Designers can use Apple's free SF Symbols app directly.
- **Remix Icon:** its January 2026 license forbids distributing the icons as a collection or building a competing icon library.
- **Font Awesome Free:** its icons require attribution (CC BY 4.0), and we kept to libraries that need only the license notice.
- Brand and company logos (for example Simple Icons) are excluded because trademarks are not covered by icon licenses.
