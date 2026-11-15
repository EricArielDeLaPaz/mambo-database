---
id: color-blindness
title: Color blindness: the types and how each one sees color
summary: What color blindness is, the main types, how common they are, and a live look at how the same colors appear to each type, with ways to design so nobody gets left out.
topic: Accessibility
level: Beginner
order: 13
---

About **1 in 24 people** have red-green color vision deficiency, the most common form, and the exact rate varies with ancestry.[^1] That is millions of people using your product. "Color blind" rarely means seeing only gray. Most people see color, but some colors that look different to you look the same, or almost the same, to them.

## Why it happens

The eye has three kinds of color-sensing cells (cones): **L** (long wavelengths, red), **M** (medium, green) and **S** (short, blue). Color blindness happens when one kind is missing or works differently. Your brain compares the signals from all three to make color, so when one signal changes, certain pairs of colors collapse into one. Red-green color blindness is passed down through the X chromosome. A person with one X chromosome who inherits the gene has it; a person with two X chromosomes needs the gene on both, which is rare. That is why red-green color blindness is far more common in people with one X chromosome.[^2]

## The main types

| Type | What is different | How common | What gets confused |
| --- | --- | --- | --- |
| Deuteranomaly and deuteranopia | Green cones weak (anomaly) or missing (anopia) | The most common. About 2.7% of people (computed)[^3] | Reds, greens, browns and oranges. Some purples and blues. |
| Protanomaly and protanopia | Red cones weak or missing | About 0.5% of people (computed)[^4] | Same families as above, and red looks darker, almost black on dark backgrounds. |
| Tritanomaly and tritanopia | Blue cones weak or missing | Very rare. Roughly 1 in 12,500 people[^5] | Blues and greens, yellows and pinks or light grays. |
| Achromatopsia | Little or no color vision | Very rare. Roughly 1 in 30,000 people[^6] | Everything is shades of gray. Often with light sensitivity. |

The "anomaly" forms are partial (the cones work, just shifted). The "anopia" forms are complete (the cones are missing). Our checkers simulate the complete forms, which are the strictest test: if a pair works there, it works for the milder forms too.

## See it for yourself

The first row is typical vision. The other rows show the same eight colors as each type is estimated to see them. Look for colors that become the same or nearly the same.

:::cvd-demo

## Success and danger need extra help

Green for good and red for bad is a convention almost everyone knows, and we do not suggest dropping it. The problem is that red and green can look the same to the most common types of color blindness. The fix is simple: **never let color be the only signal.** Add an icon and a word.

:::cvd-status

Notice how the first pair (color only) is hard to tell apart for several rows, while the second pair (color, icon and label) is clear for everyone. This is also a WCAG rule: success criterion 1.4.1, Use of Color.

## How to design for it

- **Add a second signal.** Icons, labels, patterns, underlines on links, shapes on chart markers, or different line styles.
- **Change lightness, not only hue.** Two colors that differ a lot in how light or dark they are stay different for every type. Test by converting your design to grayscale.
- **Avoid risky pairs side by side.** Red and green, green and brown, blue and purple, and pink and gray are the classic confusions.
- **Use a color-blind-safe palette for charts and data.** Palettes like Okabe and Ito and Paul Tol's sets were built so each color stays distinct. In Mambo Database, look for the **Accessible** tag in Colors.
- **Check, do not guess.** Use the Colorblind simulator in Tools, and the warnings on the Color randomizer and Design Systems pages. They estimate when two colors might look alike. They are a heads up, not a ban on any color.
- **Keep contrast.** Contrast is a different test. A pair can pass WCAG contrast and still be confused by a color-blind person if both colors have the same lightness. Do both checks.

> **A note on the estimates.** The simulations here use published color-vision models (Machado, Oliveira and Fernandes, 2009) for complete deficiencies. Real people vary a lot, so treat the simulation as a guide and, for important work, test with real users.

## Where to read more

- National Eye Institute: [Color blindness](https://www.nei.nih.gov/eye-health-information/eye-conditions-and-diseases/color-blindness)
- WCAG 2.2: [Understanding Use of Color (1.4.1)](https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html)
- Okabe and Ito, [Color Universal Design](https://jfly.uni-koeln.de/color/)
- Paul Tol, [Colour schemes](https://sronpersonalpages.nl/~pault/)
- In this database: [Grayscale Screen](#/entry/grayscale-screen), [Web Disability Simulator](#/entry/web-disability-simulator) and [Colorblindly](#/entry/colorblindly) — free browser extensions for checking a page in grayscale or through simulated color-vision deficiency.

[^1]: Computed: (8% of men + 0.5% of women) / 2 = 4.25%, about 1 in 24 people, assuming an even male/female split. Inputs: Colour Blind Awareness, "Colour blindness" and "Types of colour blindness" — https://www.colourblindawareness.org/colour-blindness/ and https://www.colourblindawareness.org/colour-blindness/types-of-colour-blindness/ — "worldwide 8% of men and 0.5% of women have a red/green type of colour vision deficiency"; the UK overall is about 4.5% of the entire population (about 3 million people); about 300 million people worldwide have colour blindness. National Eye Institute reports about 1 in 12 men. Rates differ by ancestry: about 10-11% of men in Scandinavia, fewer in sub-Saharan Africa. Accessed 2026-11-14.
[^2]: National Eye Institute, "Causes of Color Vision Deficiency" — https://nei.nih.gov/eye-health-information/eye-conditions-and-diseases/color-blindness/causes-color-vision-deficiency — "Parents pass down the genes for red-green color vision deficiency through the X chromosome. ... Males have only 1 X chromosome from their mother. ... Females have 2 X chromosomes ... To inherit red-green color vision deficiency, both X chromosomes must carry the gene." Blue-yellow color vision deficiency and complete color vision deficiency "involve other chromosomes, so they affect people of different sexes equally." Accessed 2026-11-14.
[^3]: Computed: (5% of men + 0.4% of women) / 2 = 2.7%, assuming an even male/female split. Inputs: Webvision, "Prevalence of congenital color deficiencies" (Kalloniatis M, Luu C, 2011), reproduced as Table 3 in "Defects of colour vision: A review of congenital and acquired colour vision deficiencies" — https://avehjournal.org/index.php/aveh/article/download/365/646. Colour Blind Awareness gives the male split: "The 8% of colour blind men ... can be divided approximately into 1% deuteranopes, 1% protanopes, 1% protanomalous and 5% deuteranomalous." Accessed 2026-11-14.
[^4]: Computed: (1% of men + 0.01% of women) / 2 = 0.505%, about 1 in 200 people, assuming an even male/female split. Inputs: Webvision prevalence table, same source as source 3 (accessed 2026-11-14).
[^5]: Webvision prevalence table: "Tritanopia 0.008% / 0.008%" (males / females) — the same rate in both sexes, so no computation is needed; 0.008% is about 1 in 12,500 people. Tritanomaly is listed as "rare" in both sexes; no numeric rate is published. Same source as source 3 (accessed 2026-11-14).
[^6]: MedlinePlus Genetics (NLM), "Achromatopsia" — https://medlineplus.gov/genetics/condition/achromatopsia/ — "Achromatopsia affects approximately 1 in 30,000 people worldwide." (In the Pingelapese island population, 4-10% have a total absence of color vision.) Accessed 2026-11-14.
