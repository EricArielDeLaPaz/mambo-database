---
id: color-blindness
title: Color blindness: the types and how each one sees color
summary: What color blindness is, the main types, how common they are, and a live look at how the same colors appear to each type, with ways to design so nobody gets left out.
topic: Accessibility
level: Beginner
order: 13
---

About **1 in 12 men and 1 in 200 women** have some form of color vision deficiency, according to the National Eye Institute (for people of Northern European descent; rates differ in other groups). That is millions of people using your product. "Color blind" rarely means seeing only gray. Most people see color, but some colors that look different to you look the same, or almost the same, to them.

## Why it happens

The eye has three kinds of color-sensing cells (cones): **L** (long wavelengths, red), **M** (medium, green) and **S** (short, blue). Color blindness happens when one kind is missing or works differently. Your brain compares the signals from all three to make color, so when one signal changes, certain pairs of colors collapse into one.

## The main types

| Type | What is different | How common | What gets confused |
| --- | --- | --- | --- |
| Deuteranomaly and deuteranopia | Green cones weak (anomaly) or missing (anopia) | The most common. About 5% of men | Reds, greens, browns and oranges. Some purples and blues. |
| Protanomaly and protanopia | Red cones weak or missing | About 2% of men | Same families as above, and red looks darker, almost black on dark backgrounds. |
| Tritanomaly and tritanopia | Blue cones weak or missing | Rare. Roughly 1 in 10,000 | Blues and greens, yellows and pinks or light grays. |
| Achromatopsia | Little or no color vision | Very rare. Roughly 1 in 30,000 | Everything is shades of gray. Often with light sensitivity. |

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

- National Eye Institute: [Color blindness](https://www.nei.nih.gov/learn-about-eye-health/eye-conditions-and-diseases/color-blindness)
- WCAG 2.2: [Understanding Use of Color (1.4.1)](https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html)
- Okabe and Ito, [Color Universal Design](https://jfly.uni-koeln.de/color/)
- Paul Tol, [Colour schemes](https://personal.sron.nl/~pault/)
