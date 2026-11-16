#!/usr/bin/env node
// Looks things up in the bundled Mambo Database data so you never have to read the data files.
//   node pick.js colors [--industry finance] [--mood "calm trust"] [--n 3] | [--show <id>]
//   node pick.js type [--industry finance] [--role body|display|mono] [--q serif] [--n 3]
//   node pick.js components [--platform ios] [--category forms]
//   node pick.js icons [--style outline] | [--set <id> --has <name>]
const fs = require('fs'), path = require('path');
const load = f => JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', f), 'utf8'));
const args = process.argv.slice(2), cmd = args.shift();
const opt = (k, d) => { const i = args.indexOf('--' + k); return i >= 0 && args[i + 1] !== undefined ? args[i + 1] : d };
const N = +opt('n', 3);
const lum = h => { const c = [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16) / 255).map(v => v <= .04045 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4); return .2126 * c[0] + .7152 * c[1] + .0722 * c[2] };
const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return Math.floor(((x + .05) / (y + .05)) * 100 + 1e-9) / 100 };
const words = s => String(s || '').toLowerCase().split(/[^a-z]+/).filter(w => w.length > 2);
const ind = opt('industry'), mood = words(opt('mood', ''));

if (cmd === 'colors') {
  const L = load('library-lite.json').colors, show = opt('show');
  if (show) { const c = L.find(x => x.id === show); if (!c) { console.log('No color set "' + show + '"'); process.exit(1) } console.log(c.name + ' | ' + c.mood + ' | ' + c.industries.join(', ')); Object.entries(c.roles).forEach(([k, v]) => console.log('  ' + k + ': ' + v)); process.exit(0) }
  const rows = L.map(c => {
    const r = c.roles, mw = words(c.mood);
    const score = (ind ? (c.industries.includes(ind) ? 3 : c.industries.includes('all') ? 1 : 0) : 0) + mood.filter(w => mw.some(m => m.startsWith(w.slice(0, 4)))).length * 2;
    const tx = r.ink && r.bg ? ratio(r.ink, r.bg) : null, pt = r.primary && r['primary-text'] ? ratio(r['primary-text'], r.primary) : null, pb = r.primary && r.bg ? ratio(r.primary, r.bg) : null;
    return { c, score, line: `${c.id} | ${c.name} | ${c.mood} | primary ${r.primary} | ink on bg ${tx}:1 | text on primary ${pt}:1 | primary on bg ${pb}:1 | ${c.industries.join(',')}` };
  }).sort((a, b) => b.score - a.score || a.c.id.localeCompare(b.c.id)).slice(0, N);
  rows.forEach(r => console.log(r.line)); console.log('(use --show <id> for every role)');
} else if (cmd === 'type') {
  const L = load('library-lite.json').typography, role = opt('role'), q = (opt('q', '') || '').toLowerCase();
  const rows = L.filter(t => !role || t.roles.includes(role)).map(t => {
    const score = (ind ? (t.industries.includes(ind) ? 3 : t.industries.includes('all') ? 1 : 0) : 0) + (q && (t.category + ' ' + t.name).toLowerCase().includes(q) ? 2 : 0);
    const pairs = t.pairsWith.slice(0, 2).map(p => `${p.family} as ${p.as} (display ${p.displayWeights.join('/')}, body ${p.bodyWeights.join('/')})`).join('; ');
    return { score, line: `${t.name} | ${t.category} | roles ${t.roles.join('/')} | pairs with: ${pairs || 'none verified'} | ${t.industries.join(',')}` };
  }).sort((a, b) => b.score - a.score || a.line.localeCompare(b.line)).slice(0, N);
  rows.forEach(r => console.log(r.line));
} else if (cmd === 'components') {
  const L = load('library-lite.json').components, p = opt('platform'), cat = opt('category');
  L.filter(c => (!p || c.platforms.includes(p)) && (!cat || c.category === cat)).forEach(c => console.log(`${c.id} | ${c.name} | ${c.category}`));
} else if (cmd === 'icons') {
  const S = load('icon-sets.json'), set = opt('set'), has = (opt('has', '') || '').toLowerCase();
  if (set) { const s = S.find(x => x.id === set); if (!s) { console.log('No icon set "' + set + '"'); process.exit(1) } const hit = s.names.filter(n => n.includes(has)).slice(0, 8); console.log(hit.length ? hit.join(', ') : 'none matching "' + has + '"'); }
  else { const st = (opt('style', '') || '').toLowerCase(); S.filter(s => !st || s.style.toLowerCase().includes(st)).forEach(s => console.log(`${s.id} | ${s.name} | ${s.style} | ${s.license} | ${s.names.length} icons`)) }
} else { console.error('Usage: node pick.js colors|type|components|icons [options]  (see the top of this file)'); process.exit(2) }
