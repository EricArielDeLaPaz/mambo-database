---
id: image-formats
title: Image formats: PNG, JPG, WebP, AVIF, GIF and SVG
summary: What each image format is good at, when to choose it, and how to export for the web.
topic: Assets
level: Beginner
order: 8
---

Choosing the right format keeps pages fast and images sharp. The big split is **raster** (a grid of pixels) versus **vector** (shapes described by math).[^1]

## Quick chooser

| Format | Type | Transparency | Best for | Watch out for |
| --- | --- | --- | --- | --- |
| PNG[^1] | Raster, lossless | Yes | Screenshots, UI graphics, images with sharp edges or text | Large files for photos |
| JPG (JPEG) | Raster, lossy | No | Photographs | Blurry edges and artifacts on text and flat color. Re-saving a JPEG re-compresses it.[^1] |
| WebP[^1] | Raster, lossy or lossless | Yes | A modern all-round replacement for PNG and JPG, smaller files | Very old software may not open it |
| AVIF[^1] | Raster, lossy or lossless | Yes | Photos at the smallest file size | Provide a `<picture>` fallback for older browsers.[^1] |
| GIF[^1] | Raster, 256 colors | 1-bit only | Tiny, simple animations | Big files and rough color. Prefer video or animated WebP.[^4] |
| SVG[^1] | Vector | Yes | Logos, icons, simple illustrations, diagrams | Not for photos. Very complex SVG scenes can be large.[^1] |

## Lossless and lossy

- **Lossless** keeps every pixel exactly. PNG is lossless.[^1]
- **Lossy** throws away detail the eye is unlikely to notice to make files smaller. JPG is lossy.[^1] There is no universal quality setting; experiment until you find the balance.[^3]

## When to pick each

- **A photo on a page.** Use WebP or AVIF, with JPG as a fallback.[^1]
- **A screenshot or an interface mockup.** Use PNG, or lossless WebP.[^1]
- **A logo or icon.** Use SVG. It stays sharp at any size and can change color with CSS.[^8]
- **A short looping clip.** Use a muted video, or animated WebP. Avoid GIF for anything long.[^1][^4]
- **A transparent product cutout.** Use PNG, WebP or AVIF.[^1]

## Sizes and sharpness

Phones and laptops pack more pixels into the same space. A screen with a pixel ratio of 2 needs an image twice as wide as its on-screen size to look sharp.[^2][^3]

- Export raster images at **1x, 2x and often 3x**.[^3]
- Name files clearly: `hero@2x.webp`.
- Do not export bigger than needed. A 4000px photo shown at 400px wastes data.

## Accessibility and performance

- Give every meaningful image **alt text** that says what it communicates. Use empty alt text (`alt=""`) for decoration.[^5]
- Put text in real HTML text, not inside images, so it can be read, resized and translated.[^7]
- Keep important images as small as is reasonable without visible quality loss. Tell engineers which image is the hero so they can load it first.

## The picture element

Engineers can offer several formats and let the browser pick the best one.[^6]

```html
<picture>
  <source srcset="photo.avif" type="image/avif">
  <source srcset="photo.webp" type="image/webp">
  <img src="photo.jpg" alt="Two people reviewing a design on a laptop" width="800" height="600">
</picture>
```

Setting `width` and `height` reserves the space and stops the page from jumping as the image loads.[^5]

Next: [Icon types and formats](#/guide/icon-types).

## Where to read more

- In this database: [Imageye](#/entry/imageye) and [SVG Export](#/entry/svg-export) — browser extensions for finding, filtering and downloading every image (including SVGs) on a page.

[^1]: Image file type and format guide — MDN Web Docs (Mozilla). https://developer.mozilla.org/en-US/docs/Web/Media/Formats/Image_types . Accessed 2026-11-14.
[^2]: Window: devicePixelRatio property — MDN Web Docs (Mozilla). https://developer.mozilla.org/en-US/docs/Web/API/Window/devicePixelRatio . Accessed 2026-11-14.
[^3]: Image performance — web.dev (Google). https://web.dev/learn/performance/image-performance . Accessed 2026-11-14.
[^4]: Replace animated GIFs with video for faster page loads — web.dev (Google). https://web.dev/articles/replace-gifs-with-videos . Accessed 2026-11-14.
[^5]: <img> HTML image embed element — MDN Web Docs (Mozilla). https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img . Accessed 2026-11-14.
[^6]: <picture> HTML picture element — MDN Web Docs (Mozilla). https://developer.mozilla.org/en-US/docs/Web/HTML/Element/picture . Accessed 2026-11-14.
[^7]: Web Content Accessibility Guidelines (WCAG) 2.2 — W3C. https://www.w3.org/TR/WCAG22/ . Accessed 2026-11-14. (SC 1.4.5 Images of Text.)
[^8]: color_value (currentColor) — MDN Web Docs (Mozilla). https://developer.mozilla.org/en-US/docs/Web/CSS/color_value . Accessed 2026-11-14.
