---
id: image-formats
title: Image formats: PNG, JPG, WebP, AVIF, GIF and SVG
summary: What each image format is good at, when to choose it, and how to export for the web.
topic: Assets
level: Beginner
order: 8
---

Choosing the right format keeps pages fast and images sharp. The big split is **raster** (a grid of pixels) versus **vector** (shapes described by math).

## Quick chooser

| Format | Type | Transparency | Best for | Watch out for |
| --- | --- | --- | --- | --- |
| PNG | Raster, lossless | Yes | Screenshots, UI graphics, images with sharp edges or text | Large files for photos |
| JPG (JPEG) | Raster, lossy | No | Photographs | Blurry edges and artifacts on text and flat color. Repeated saving lowers quality. |
| WebP | Raster, lossy or lossless | Yes | A modern all-round replacement for PNG and JPG, smaller files | Very old software may not open it |
| AVIF | Raster, lossy or lossless | Yes | Photos at the smallest file size | Slower to create. Provide a fallback for older browsers. |
| GIF | Raster, 256 colors | 1-bit only | Tiny, simple animations | Big files and rough color. Prefer video or animated WebP. |
| SVG | Vector | Yes | Logos, icons, simple illustrations, diagrams | Not for photos. Complex files can get heavy. |

## Lossless and lossy

- **Lossless** keeps every pixel exactly. PNG is lossless.
- **Lossy** throws away detail the eye is unlikely to notice to make files smaller. JPG is lossy. A quality setting around 70 to 85 percent is a common balance.

## When to pick each

- **A photo on a page.** Use WebP or AVIF, with JPG as a fallback.
- **A screenshot or an interface mockup.** Use PNG, or lossless WebP.
- **A logo or icon.** Use SVG. It stays sharp at any size and can change color with CSS.
- **A short looping clip.** Use a muted video, or animated WebP. Avoid GIF for anything long.
- **A transparent product cutout.** Use PNG, WebP or AVIF.

## Sizes and sharpness

Phones and laptops pack more pixels into the same space. A screen with a pixel ratio of 2 needs an image twice as wide as its on-screen size to look sharp.

- Export raster images at **1x, 2x and often 3x**.
- Name files clearly: `hero@2x.webp`.
- Do not export bigger than needed. A 4000px photo shown at 400px wastes data.

## Accessibility and performance

- Give every meaningful image **alt text** that says what it communicates. Use empty alt text (`alt=""`) for decoration.
- Put text in real HTML text, not inside images, so it can be read, resized and translated.
- Keep important images under a few hundred kilobytes when you can. Tell engineers which image is the hero so they can load it first.

## The picture element

Engineers can offer several formats and let the browser pick the best one.

```html
<picture>
  <source srcset="photo.avif" type="image/avif">
  <source srcset="photo.webp" type="image/webp">
  <img src="photo.jpg" alt="Two people reviewing a design on a laptop" width="800" height="600">
</picture>
```

Setting `width` and `height` reserves the space and stops the page from jumping as the image loads.

Next: [Icon types and formats](#/guide/icon-types).
