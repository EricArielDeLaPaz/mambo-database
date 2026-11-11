---
id: color-formats
title: Color formats: HEX, RGB, HSL, HSB and CMYK
summary: What each way of writing a color means, which one to use where, and how to convert between them with the Figma color picker you already know.
topic: Color
level: Beginner
order: 11
---

A color can be written several ways. They all describe the same color; they just use different numbers. Figma's color picker lets you switch between most of them, and so does every color field on this site (the last format you pick is remembered).

## HEX

A hex code is a `#` followed by six characters, like `#1D4ED8`. It is three pairs: red, green and blue, each from `00` (none) to `FF` (full).

- `#1D4ED8` means red `1D`, green `4E`, blue `D8`.
- A short form exists when each pair repeats: `#FFF` is `#FFFFFF` (white), and `#0AF` is `#00AAFF`.
- Add two more characters for transparency (alpha): `#1D4ED880` is about 50% opaque.

**Use it for:** handing colors to engineers, design tokens, and anywhere a short, copyable code is easiest. It is the default in Figma and on this site.

## RGB

RGB lists red, green and blue as numbers from 0 to 255: `rgb(29, 78, 216)`. It is the same information as HEX, written in plain numbers (`1D` in hex is 29).

- Add transparency with a fourth number from 0 to 1: `rgba(29, 78, 216, 0.5)`.

**Use it for:** code that needs transparency, or when you want to calculate with the channels.

## HSL

HSL describes a color the way people think about it: `hsl(224, 76%, 48%)`.

- **Hue** (0 to 360): the color family on a wheel. 0 is red, 120 is green, 240 is blue.
- **Saturation** (0% to 100%): how vivid it is. 0% is gray.
- **Lightness** (0% to 100%): 0% is black, 50% is the pure color, 100% is white.

**Use it for:** making tints and shades. Keep the hue and saturation, and change only lightness. That is how a shade scale (50 to 900) is built, like on the Hues part of the Color randomizer.

## HSB (also called HSV)

HSB is the one Figma shows by default next to HEX: `hsb(224, 87%, 85%)`.

- **Hue** is the same wheel as HSL.
- **Saturation** is how much color there is, from washed out (0%) to full (100%).
- **Brightness** (or Value) is how bright, from black (0%) to the brightest version (100%).

HSB and HSL are different. 100% brightness in HSB is a bright color; 100% lightness in HSL is always white.

**Use it for:** picking colors by eye in a design tool. The picker square in Figma is HSB.

## CMYK

CMYK is for print: cyan, magenta, yellow and black ink, each 0% to 100%: `cmyk(87%, 64%, 0%, 15%)`. Screens mix light, printers mix ink, so some bright screen colors (very vivid blues and greens) cannot be printed exactly. Expect print to look a little duller.

**Use it for:** anything going to a printer. The numbers here are a simple conversion; a print shop may adjust them with a color profile.

## Names and other formats

- **Named colors** like `rebeccapurple` exist in CSS, but they are limited, so most teams use HEX or tokens.
- **Color spaces** like Display P3 can show more vivid colors on modern screens. Figma can switch a file to Display P3, but for most interface work sRGB (everything above) is the safe default.

## Which one should I use?

| Situation | Use |
| --- | --- |
| Handoff and design tokens | HEX |
| Transparency in code | RGB with alpha |
| Building tints and shades | HSL |
| Picking by eye in a design tool | HSB |
| Print | CMYK |

Whichever you use, check contrast afterward. The format never changes the contrast ratio, only the color itself does. See [Contrast and WCAG](#/guide/contrast-and-wcag).
