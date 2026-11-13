# Profiles

Profile pictures of people facing the camera, for personas, mockups and design work. They appear in Browse under **Profiles** and feed the **Persona generator** tool.

| Folder | Style | Artwork | License |
| --- | --- | --- | --- |
| `realistic/` | Realistic | 63 photos of real people from the [royalty-free-user-avatars](https://github.com/leonadler/royalty-free-user-avatars) collection (CC0 1.0). Each original is on Pexels or Unsplash. | Free for commercial use (Pexels / Unsplash license) |
| `avataaars/` | Illustrated (cartoony) | Avataaars by Pablo Stanley | Free for personal and commercial use |
| `notionists/` | Drawing (human-like) | Notionists by Zoish | CC0 1.0 (public domain) |

Avataaars has 40 pictures across eight skin tones; Notionists has 40 black-and-white line drawings with no skin color. Both have varied hair, glasses and facial hair and are made with [DiceBear](https://www.dicebear.com) (MIT code) by `scripts/make-profiles.mjs`. The script stops if a style's license is not on its allowed list (CC0 or free for personal and commercial use).

## Realistic photos
`scripts/make-photos.py` builds them: it keeps only photos facing the camera with the eyes visible and a credit link to Pexels or Unsplash, crops them square and resizes them to 256 px. `realistic/photos.json` links every photo to its original page.

These show real people. The photos are only meant for everyday uses such as mockups, personas and examples. Avoid sensitive uses (health, crime, politics, adult content) and do not suggest the person endorses anything. We cannot verify a model release for each photo; we rely on the Pexels and Unsplash licenses and the collection's CC0 statement. If a person asks to have their photo removed, delete it from `photos.json` and rebuild.
