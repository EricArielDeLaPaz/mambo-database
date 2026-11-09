#!/usr/bin/env node
// Usage: node contrast.js "#111111" "#ffffff"  ->  ratio and WCAG 2.2 results
const n = h => { h = String(h).replace('#', ''); if (h.length === 3) h = [...h].map(c => c + c).join(''); if (!/^[0-9a-f]{6}$/i.test(h)) { console.error('Bad hex: ' + h); process.exit(2) } return h };
const lum = h => { const c = [0, 2, 4].map(i => parseInt(n(h).slice(i, i + 2), 16) / 255).map(v => v <= .03928 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4); return .2126 * c[0] + .7152 * c[1] + .0722 * c[2] };
const [a, b] = process.argv.slice(2); if (!a || !b) { console.error('Usage: node contrast.js <hex> <hex>'); process.exit(2) }
const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p), r = (x + .05) / (y + .05), t = v => r >= v ? 'PASS' : 'FAIL';
console.log(`${r.toFixed(2)}:1  AA text ${t(4.5)}  AA large/UI ${t(3)}  AAA text ${t(7)}  AAA large ${t(4.5)}`);
