#!/usr/bin/env node
// Usage: node contrast.js <fg> <bg> [<fg> <bg> ...]
// Prints the WCAG 2.2 contrast ratio for each pair and whether it passes. Ratios are cut off (not rounded) at 2 decimals, like WebAIM.
// Exit code 1 if any pair fails AA for normal text (4.5:1), so a failure is hard to miss. 3:1 is the bar for large text and UI.
const norm = h => { h = String(h).replace('#', ''); if (h.length === 3) h = [...h].map(c => c + c).join(''); if (!/^[0-9a-f]{6}$/i.test(h)) { console.error('Bad hex: ' + h); process.exit(2) } return h };
// 0.04045 is the current WCAG 2.x cut-off (0.03928 is the pre-2021 value; both give the same result for 8-bit hex colors)
const lum = h => { const c = [0, 2, 4].map(i => parseInt(norm(h).slice(i, i + 2), 16) / 255).map(v => v <= .04045 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4); return .2126 * c[0] + .7152 * c[1] + .0722 * c[2] };
const a = process.argv.slice(2);
if (a.length < 2 || a.length % 2) { console.error('Usage: node contrast.js <fg> <bg> [<fg> <bg> ...]'); process.exit(2) }
let fails = 0;
for (let i = 0; i < a.length; i += 2) {
  const [x, y] = [lum(a[i]), lum(a[i + 1])].sort((p, q) => q - p), r = (x + .05) / (y + .05), cut = Math.floor(r * 100 + 1e-9) / 100;
  const t = v => cut >= v ? 'PASS' : 'FAIL'; if (cut < 4.5) fails++;
  console.log(`${a[i]} on ${a[i + 1]}  ${cut.toFixed(2)}:1  text ${t(4.5)}  large/UI ${t(3)}  AAA text ${t(7)}`);
}
if (fails) console.log(`${fails} pair(s) fail AA for normal text. Change the color, not the bar.`);
process.exit(fails ? 1 : 0);
