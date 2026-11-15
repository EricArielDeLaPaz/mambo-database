# Profile style research — CC0 DiceBear candidates (accessed 2026-11-14)

Goal: clean, modern, popular avatar styles Mambo can generate and publish with no copyright risk. Hard rules from the plan: CC0 1.0 (or equivalent public-domain dedication) only, no attribution, commercial use and redistribution allowed, no photos or likenesses of real people, deterministic output.

Method: license, creator, source and option lists were read from each style's own published npm package metadata (unpkg.com/@dicebear/<style>@latest/lib/index.js, the same source `scripts/make-profiles.mjs` reads via `require`). Downloads are from the official npm API (api.npmjs.org, last week). Versions are the `dist-tags.latest` from registry.npmjs.org. Looks were verified by rendering two samples per style with `@dicebear/core` 9.4.3 in a scratch folder and viewing the output. Nothing below is from a blog.

## Recommendation

Add **Lorelei** as the new profile style: CC0 1.0, by Lisa Wischofsky; takes any skin-tone hex (the repo's 8-tone palette can be passed straight through), 48 hair variants, 5 glasses variants, ~291 million head/hair/face combinations from its option enums, and 290,618 downloads last week. Runner-up: **Notionists Neutral** (CC0, same family as the existing Drawing style) if a skin-tone-free line drawing is wanted instead. Pixel Art is CC0 and popular but was deliberately removed from the site earlier, so it is listed for completeness, not recommended.

## Candidates whose own metadata says CC0 1.0

| Style | Creator | License (exact) | Attribution | Variation options (enum counts) | Skin tones / hair / glasses | Look (verified from rendered samples) | Popularity (npm last week) | Package · version |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Lorelei | Lisa Wischofsky | CC0 1.0 (https://creativecommons.org/publicdomain/zero/1.0/) | No | head 4, hair 48, eyes 24, mouth 27, nose 6, eyebrows 13, beard 2, glasses 5, earrings 3 → 291,133,440 combos | Yes (free-form `skinColor` hex) / 48 hair / 5 glasses | Soft flat cartoon heads, big expressive eyes, many hairstyles | 290,618 | @dicebear/lorelei · 9.4.2 (latest tag) |
| Lorelei Neutral | Lisa Wischofsky | CC0 1.0 (same URL) | No | eyebrows 13, eyes 24, mouth 27, nose 6, glasses 5, freckles 1 → 252,720 combos | No skin color (features only) / no hair / 5 glasses | Lorelei's face parts drawn without the skin-colored head, on any background | 276,629 | @dicebear/lorelei-neutral · 9.4.2 |
| Notionists Neutral | Zoish | CC0 1.0 (same URL) | No | brows 13, eyes 5, lips 30, nose 20, glasses 11 → 429,000 combos | No skin color / no hair / 11 glasses | Black-ink doodle face parts, no skin fill (neutral sibling of the existing Drawing style) | 277,758 | @dicebear/notionists-neutral · 9.4.2 |
| Thumbs | DiceBear | CC0 1.0 (https://www.dicebear.com) | No | eyes 36, face 5, mouth 5, shape 1 → 900 combos | No skin color / no hair / no glasses | Cute rounded blob characters with tiny faces on solid backgrounds | 299,707 | @dicebear/thumbs · 9.4.2 |
| Pixel Art | DiceBear | CC0 1.0 (https://www.figma.com/community/file/1198754108850888330) | No | hair 45, glasses 14, beard 8, eyes 12, mouth 23, clothing 23, hat 10, accessories 4 → 1,279,756,800 combos | Yes (free-form `skinColor`) / 45 hair / 14 glasses | 8-bit pixel people with hair, beards, clothes, hats | 282,972 | @dicebear/pixel-art · 9.4.2 |
| Pixel Art Neutral | DiceBear | CC0 1.0 (same Figma URL) | No | eyes 12, mouth 23, glasses 14 → 3,864 combos | No skin color / no hair / 14 glasses | Pixel faces without skin color on flat backgrounds | 275,276 | @dicebear/pixel-art-neutral · 9.4.2 |
| Glass | DiceBear | CC0 1.0 (https://www.dicebear.com) | No | shape1/shape2 enums | No | Abstract glassy shapes, not a person | n/a | @dicebear/glass · 9.4.2 |
| Identicon | DiceBear | CC0 1.0 (https://www.dicebear.com) | No | row1–row5, rowColor | No | Geometric identicon pattern, not a person | n/a | @dicebear/identicon · 9.4.2 |
| Initials | DiceBear | CC0 1.0 (https://github.com/dicebear/dicebear) | No | font/text options | No | Letters on a colored square, not a person | n/a | @dicebear/initials · 9.4.2 |
| Rings | DiceBear | CC0 1.0 (https://www.dicebear.com) | No | ring1–ring5 + rotations/colors | No | Concentric ring pattern, not a person | n/a | @dicebear/rings · 9.4.2 |
| Shapes | DiceBear | CC0 1.0 (https://www.dicebear.com) | No | shape1–shape3 + offsets/colors | No | Overlapping geometric shapes, not a person | n/a | @dicebear/shapes · 9.4.2 |

Already in the site (for reference, both CC0 1.0): Open Peeps by Pablo Stanley (Illustrated, 326,438 downloads last week), Notionists by Zoish (Drawing, 318,450).

## Checked and rejected (not CC0 in their own metadata)

Avataaars / Avataaars Neutral ("Free for personal and commercial use", avataaars.com), Bottts / Bottts Neutral (same), Adventurer, Adventurer Neutral, Big Ears, Big Ears Neutral, Big Smile, Croodles, Croodles Neutral, Dylan, Fun Emoji, Micah, Miniavs, Personas, ToonHead (all "CC BY 4.0" in metadata) — attribution required, so `make-profiles.mjs` rejects them. Icons (Bootstrap Icons, MIT) and Shapes-style abstractions are not person avatars.

Notes: "variations" counts are the option-enum products (upper bound; probabilities gate some options, seeds are deterministic). npm download counts are package downloads, not unique users. The 9.4.3 version the repo's profiles were generated with installed fine in the scratch folder even though the registry's latest tag reads 9.4.2.

Sources: https://unpkg.com/@dicebear/<style>@latest/lib/index.js (metadata) · https://api.npmjs.org/downloads/point/last-week/@dicebear/<style> (downloads) · https://registry.npmjs.org/@dicebear/<style> (versions) · https://api.github.com/repos/dicebear/dicebear (10,085 stars, shared repo) — all accessed 2026-11-14.
