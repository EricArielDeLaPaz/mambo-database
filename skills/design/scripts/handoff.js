#!/usr/bin/env node
// Validates and orders a design handoff folder (see references/handoff-format.md).
//   node scripts/handoff.js check <folder>                 exit 1 on errors
//   node scripts/handoff.js next  <folder> [--done a,b]    prints the slices that are ready now (all blockers done)
const fs = require('fs'), path = require('path');
const [, , mode, dir, ...rest] = process.argv;
if (!['check', 'next'].includes(mode) || !dir) { console.log('Usage: handoff.js check <folder> | next <folder> [--done id,id]'); process.exit(2) }
const file = path.join(dir, 'handoff.json');
if (!fs.existsSync(file)) { console.log(`ERROR no handoff.json in ${dir}`); process.exit(1) }
let h; try { h = JSON.parse(fs.readFileSync(file, 'utf8')) } catch (e) { console.log('ERROR handoff.json is not valid JSON: ' + e.message); process.exit(1) }
const errs = [], warns = [], E = m => errs.push(m), W = m => warns.push(m), arr = x => Array.isArray(x) ? x : [];
const FW = ['html', 'react-vite', 'nextjs', 'vue', 'svelte', 'unknown'];
if (!h.product || !h.product.name) E('product.name is missing');
if (!h.stack || !FW.includes(h.stack.framework)) E(`stack.framework must be one of ${FW.join(', ')}`);
if (h.designSystem && h.designSystem.tokens) { const tp = path.resolve(dir, '..', h.designSystem.tokens); if (!fs.existsSync(tp) && !fs.existsSync(path.resolve(h.designSystem.tokens))) E(`designSystem.tokens not found: ${h.designSystem.tokens}`) } else W('no designSystem.tokens: the code skill cannot audit against tokens');
const screens = arr(h.screens), slices = arr(h.slices), sid = new Set(), lid = new Set();
if (!screens.length) E('no screens'); if (!slices.length) E('no slices');
for (const s of screens) {
  if (!s.id || sid.has(s.id)) E(`screen id missing or duplicate: ${s.id}`); sid.add(s.id);
  for (const k of ['name', 'purpose']) if (!s[k]) E(`screen ${s.id}: ${k} is missing`);
  if (!arr(s.components).length) E(`screen ${s.id}: no components`);
  if (!arr(s.states).length) E(`screen ${s.id}: no states`);
  else if (/list|table|feed|results|search|dashboard/i.test(`${s.name} ${s.purpose}`) && !['loading', 'empty', 'error'].every(x => s.states.includes(x))) W(`screen ${s.id}: looks data-driven but is missing loading, empty or error`);
  if (!s.spec) E(`screen ${s.id}: spec path missing`); else if (!fs.existsSync(path.join(dir, s.spec))) E(`screen ${s.id}: spec file not found: ${s.spec}`);
  else { const t = fs.readFileSync(path.join(dir, s.spec), 'utf8'); if (/\bTBD\b/i.test(t)) E(`screen ${s.id}: spec contains TBD; move it to openQuestions`); if (t.split('\n').length > 60) W(`screen ${s.id}: spec is over 60 lines`); const bad = [...t.matchAll(/\b(\d+)px\b/g)].map(m => +m[1]).filter(n => n > 0 && n < 33 && ![1, 2, 4, 8, 12, 16, 20, 24, 32].includes(n)); if (bad.length) W(`screen ${s.id}: pixel values off the 4-point scale: ${[...new Set(bad)].join(', ')}`) }
}
for (const l of slices) {
  if (!l.id || lid.has(l.id)) E(`slice id missing or duplicate: ${l.id}`); lid.add(l.id);
  if (!l.title) E(`slice ${l.id}: title missing`);
  if (!arr(l.acceptance).length) E(`slice ${l.id}: needs at least one acceptance line`);
  if (!arr(l.screens).length) W(`slice ${l.id}: touches no screens`);
  for (const x of arr(l.screens)) if (!sid.has(x)) E(`slice ${l.id}: unknown screen ${x}`);
}
for (const l of slices) for (const b of arr(l.blockedBy)) if (!lid.has(b)) E(`slice ${l.id}: unknown blocker ${b}`);
const used = new Set(slices.flatMap(l => arr(l.screens))); for (const s of screens) if (!used.has(s.id)) W(`screen ${s.id} is not part of any slice`);
const indeg = {}, adj = {}; slices.forEach(l => { indeg[l.id] = arr(l.blockedBy).length; adj[l.id] = [] }); slices.forEach(l => arr(l.blockedBy).forEach(b => adj[b] && adj[b].push(l.id)));
const q = Object.keys(indeg).filter(k => indeg[k] === 0), order = []; while (q.length) { const k = q.shift(); order.push(k); adj[k].forEach(n => { if (--indeg[n] === 0) q.push(n) }) }
if (order.length !== slices.length && !errs.some(e => /unknown blocker|duplicate/.test(e))) E('slices have a blocking cycle');
if (arr(h.openQuestions).length) W(`${h.openQuestions.length} open question(s): ${h.openQuestions.join(' | ')}`);
if (mode === 'check') {
  errs.forEach(e => console.log('ERROR ' + e)); warns.forEach(w => console.log('warn  ' + w));
  console.log(`\n${screens.length} screens, ${slices.length} slices, ${errs.length} errors, ${warns.length} warnings. Order: ${order.join(' -> ') || 'n/a'}`); process.exit(errs.length ? 1 : 0);
}
if (errs.length) { errs.forEach(e => console.log('ERROR ' + e)); process.exit(1) }
const di = rest.indexOf('--done'), done = new Set(di >= 0 ? (rest[di + 1] || '').split(',').filter(Boolean) : []);
const ready = slices.filter(l => !done.has(l.id) && arr(l.blockedBy).every(b => done.has(b)));
if (!ready.length) console.log(done.size === slices.length ? 'All slices are done.' : 'No slice is ready (blocked).');
ready.forEach(l => console.log(`${l.id}: ${l.title}\n  screens: ${arr(l.screens).join(', ')}\n  acceptance:\n${arr(l.acceptance).map(a => '   - ' + a).join('\n')}`));
