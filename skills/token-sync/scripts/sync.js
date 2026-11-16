#!/usr/bin/env node
// Compare design tokens from Figma with tokens in code. Run it instead of comparing by eye.
//   node sync.js diff <figma.json> <code.css|code.json> [--examples 6] [--out changes.json]
//   node sync.js apply <changes.json> --code <code.css> [--dry]
// figma.json is either the Figma variables shape described in references/formats.md or W3C design-tokens JSON.
// diff exits 1 if any difference exists. apply edits CSS custom properties only, and only entries with "approve": true.
const fs = require('fs');
const [mode, a1, a2, ...rest] = process.argv.slice(2);
const all = process.argv.slice(2);
const opt = (k, d) => { const i = all.indexOf('--' + k); return i >= 0 && all[i + 1] !== undefined && !all[i + 1].startsWith('--') ? all[i + 1] : d };
const has = k => all.includes('--' + k);
const usage = () => { console.error('Usage: node sync.js diff <figma.json> <code.css|json> [--examples 6] [--out changes.json]\n       node sync.js apply <changes.json> --code <file.css> [--dry]'); process.exit(2) };
if (!['diff', 'apply'].includes(mode) || !a1) usage();

// ---------- value helpers ----------
const hex = h => { h = h.replace('#', '').toLowerCase(); if (h.length === 3 || h.length === 4) h = [...h].map(c => c + c).join(''); return '#' + (h.length === 8 && h.endsWith('ff') ? h.slice(0, 6) : h) };
const to255 = v => Math.round(Math.max(0, Math.min(1, v)) * 255).toString(16).padStart(2, '0');
function normValue(v) {
  if (v === null || v === undefined) return '';
  if (typeof v === 'object') { // Figma API color {r,g,b,a} with 0..1 floats
    if ('r' in v) return hex('#' + to255(v.r) + to255(v.g) + to255(v.b) + (v.a !== undefined && v.a < 1 ? to255(v.a) : '')); if ('$value' in v) return normValue(v.$value); return JSON.stringify(v) }
  if (typeof v === 'number') return String(v);
  const s = String(v).trim().toLowerCase().replace(/\s+/g, ' ');
  if (/^#([0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/.test(s)) return hex(s);
  let m = s.match(/^rgba?\(\s*(\d+)[\s,]+(\d+)[\s,]+(\d+)(?:[\s,\/]+([\d.]+))?\s*\)$/);
  if (m) return hex('#' + [m[1], m[2], m[3]].map(n => (+n).toString(16).padStart(2, '0')).join('') + (m[4] !== undefined && +m[4] < 1 ? to255(+m[4]) : ''));
  m = s.match(/^(-?\d*\.?\d+)(px|rem)?$/); if (m) return String(+m[1] * (m[2] === 'rem' ? 16 : 1));
  return s;
}
const isColor = v => /^#[0-9a-f]{6}([0-9a-f]{2})?$/.test(v);
const normName = n => n.toLowerCase().replace(/^--/, '').replace(/[\/._\s]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
const keysOf = n => { const k = normName(n), parts = k.split('-'); return [...new Set([k, /^(color|colors|colour)$/.test(parts[0]) && parts.length > 1 ? parts.slice(1).join('-') : k])] };

// ---------- readers: each returns { light: {name: {value, raw}}, dark: {...} } ----------
function cssBlocks(css) { // [{ sel, body, bodyStart, bodyEnd, dark }] offsets are in the original text
  const clean = css.replace(/\/\*[\s\S]*?\*\//g, m => ' '.repeat(m.length)), out = [];
  const scan = (from, to, dark) => { let i = from; while (i < to) {
    const o = clean.indexOf('{', i); if (o < 0 || o >= to) break; const head = clean.slice(i, o).trim(); let d = 1, j = o + 1;
    while (j < to && d) { if (clean[j] === '{') d++; else if (clean[j] === '}') d--; j++ }
    if (head.startsWith('@')) scan(o + 1, j - 1, dark || /prefers-color-scheme:\s*dark/.test(head)); else out.push({ sel: head, bodyStart: o + 1, bodyEnd: j - 1, body: clean.slice(o + 1, j - 1), dark: dark || /dark/i.test(head) });
    i = j } };
  scan(0, clean.length, false); return out;
}
function readCss(file) {
  const raw = fs.readFileSync(file, 'utf8'), t = { light: {}, dark: {} };
  for (const b of cssBlocks(raw)) for (const m of b.body.matchAll(/--([\w-]+)\s*:\s*([^;]+)(?:;|$)/g)) t[b.dark ? 'dark' : 'light'][normName(m[1])] = { value: m[2].trim(), raw: '--' + m[1] };
  return t;
}
function readW3c(obj) {
  const t = { light: {}, dark: {} };
  const walk = (o, p, theme) => { for (const [k, v] of Object.entries(o)) { if (k.startsWith('$')) continue;
    if (v && typeof v === 'object' && '$value' in v) t[theme][normName([...p, k].join('-'))] = { value: v.$value, raw: [...p, k].join('.') };
    else if (v && typeof v === 'object') walk(v, [...p, k], /^dark$/i.test(k) ? 'dark' : theme) } };
  walk(obj, [], 'light'); return t;
}
function readFigma(obj) {
  if (!obj.collections) return readW3c(obj);
  const t = { light: {}, dark: {} };
  for (const c of obj.collections) { const modes = c.modes || ['Default'], darkMode = modes.find(m => /dark/i.test(m)), lightMode = modes.find(m => !/dark/i.test(m)) || modes[0];
    for (const v of c.variables) { const vals = v.values || {};
      if (lightMode in vals) t.light[normName(v.name)] = { value: vals[lightMode], raw: v.name };
      if (darkMode && darkMode in vals) t.dark[normName(v.name)] = { value: vals[darkMode], raw: v.name } } }
  return t;
}
function aliasTarget(set, name) { const e = set[name]; if (!e) return null; let v = e.value; if (v && typeof v === 'object' && 'alias' in v) return normName(v.alias);
  if (typeof v !== 'string') return null; const m = v.trim().match(/^var\(\s*--([\w-]+)\s*(?:,[^)]*)?\)$/) || v.trim().match(/^\{([^}]+)\}$/); return m ? normName(m[1]) : null }
function resolve(set, name, seen = new Set()) { // follow var(--x), {a.b} and {alias} one chain
  const e = set[name]; if (!e) return undefined; let v = e.value;
  if (v && typeof v === 'object' && 'alias' in v) v = '{' + v.alias + '}';
  if (typeof v === 'string') { const m = v.trim().match(/^var\(\s*--([\w-]+)\s*(?:,[^)]*)?\)$/) || v.trim().match(/^\{([^}]+)\}$/);
    if (m) { const k = normName(m[1]); if (seen.has(k)) return v; seen.add(k); const r = resolve(set, k, seen); return r === undefined ? v : r } }
  return v;
}

// ---------- diff ----------
function diff(figma, code) {
  const items = [];
  for (const theme of ['light', 'dark']) {
    const F = figma[theme], own = code[theme], C = theme === 'dark' ? { ...code.light, ...code.dark } : own; if (!Object.keys(F).length && !Object.keys(C).length) continue;
    const cIndex = {}; for (const n of Object.keys(C)) for (const k of keysOf(n)) cIndex[k] = cIndex[k] || n;
    const usedC = new Set(), onlyF = [];
    for (const fn of Object.keys(F)) {
      const cn = keysOf(fn).map(k => cIndex[k]).find(Boolean);
      if (!cn) { onlyF.push(fn); continue }
      usedC.add(cn); const fa = aliasTarget(F, fn), ca = aliasTarget(C, cn);
      if (fa && ca && keysOf(fa).some(k => keysOf(ca).includes(k))) continue; // both point at the same token; any difference is reported on that token
      const fv = normValue(resolve(F, fn)), cv = normValue(resolve(C, cn));
      if (fv !== cv) items.push({ kind: 'value-mismatch', theme, figmaName: F[fn].raw, codeName: C[cn].raw, figma: fv, code: cv, action: 'set-code', approve: false });
    }
    const onlyC = Object.keys(C).filter(n => !usedC.has(n) && (theme === 'light' || n in own));
    const byVal = {}; for (const cn of onlyC) { const v = normValue(resolve(C, cn)); (byVal[v] = byVal[v] || []).push(cn) }
    for (const fn of onlyF) { const fv = normValue(resolve(F, fn)), cand = (byVal[fv] || []).filter(c => !usedC.has(c));
      if (cand.length && (isColor(fv) || /^\d/.test(fv))) { items.push({ kind: 'possible-rename', theme, figmaName: F[fn].raw, codeName: C[cand[0]].raw, figma: fv, code: fv, note: 'same value, different name; decide which name wins', approve: false }); usedC.add(cand[0]) }
      else items.push({ kind: 'missing-in-code', theme, figmaName: F[fn].raw, codeName: '--' + fn, figma: fv, code: '', action: 'add-to-code', approve: false }) }
    for (const cn of onlyC) if (!usedC.has(cn)) items.push({ kind: 'missing-in-figma', theme, figmaName: '', codeName: C[cn].raw, figma: '', code: normValue(resolve(C, cn)), action: 'add-to-figma (do in Figma, with approval)', approve: false });
  }
  items.forEach((it, i) => it.id = i + 1); return items;
}

// ---------- apply (CSS only) ----------
function applyCss(file, items, dry) {
  let css = fs.readFileSync(file, 'utf8'), done = 0; const skipped = [];
  const edits = items.filter(i => i.approve === true && (i.action === 'set-code' || i.action === 'add-to-code'));
  for (const it of edits) {
    const blocks = cssBlocks(css), dark = it.theme === 'dark', name = it.codeName.startsWith('--') ? it.codeName : '--' + it.codeName;
    if (it.action === 'set-code') {
      const re = new RegExp('(' + name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\s*:\\s*)([^;]+)(;|$)');
      const b = blocks.find(x => x.dark === dark && re.test(css.slice(x.bodyStart, x.bodyEnd)));
      if (b) { const body = css.slice(b.bodyStart, b.bodyEnd).replace(re, `$1${it.figma}$3`); css = css.slice(0, b.bodyStart) + body + css.slice(b.bodyEnd); done++; continue }
    }
    {
      const b = blocks.find(x => x.dark === dark && /:root|html|\[data-theme/.test(x.sel));
      const line = `  ${name}: ${it.figma};\n`;
      if (b) { const before = css.slice(0, b.bodyEnd).replace(/\s+$/, ''), tail = css.slice(b.bodyEnd); css = before + (/[;{]$/.test(before) ? '' : ';') + '\n' + line + tail }
      else css += dark ? `\n@media (prefers-color-scheme: dark) {\n  :root {\n${line}  }\n}\n` : `\n:root {\n${line}}\n`;
      done++;
    }
  }
  if (!dry && done) fs.writeFileSync(file, css);
  console.log(`${dry ? 'Would apply' : 'Applied'} ${done} of ${edits.length} approved change(s) to ${file}.`); skipped.forEach(s => console.log('  skipped ' + s));
  if (!items.some(i => i.approve === true)) console.log('Nothing is approved. Set "approve": true on the entries the person agreed to.');
}

if (mode === 'apply') {
  const file = opt('code'); if (!file) usage();
  if (!/\.css$/.test(file)) { console.error('apply edits CSS files only. For JSON, change the values by hand from changes.json.'); process.exit(2) }
  applyCss(file, JSON.parse(fs.readFileSync(a1, 'utf8')), has('dry')); process.exit(0);
}
if (!a2) usage();
const figma = readFigma(JSON.parse(fs.readFileSync(a1, 'utf8'))), code = a2.endsWith('.json') ? readW3c(JSON.parse(fs.readFileSync(a2, 'utf8'))) : readCss(a2);
const items = diff(figma, code), EX = +opt('examples', 6), kinds = ['value-mismatch', 'missing-in-code', 'missing-in-figma', 'possible-rename'];
const n = t => Object.keys(figma[t]).length + ' Figma / ' + Object.keys(code[t]).length + ' code';
console.log(`Token sync: light ${n('light')}; dark ${n('dark')}. ${items.length} difference(s).`);
for (const k of kinds) { const l = items.filter(i => i.kind === k); if (!l.length) continue; console.log(`\n[${k}] x${l.length}`);
  for (const i of l.slice(0, EX)) console.log(`  #${i.id} ${i.theme}: ${i.figmaName || '-'} ${i.kind === 'missing-in-code' ? '= ' + i.figma : ''}${i.kind === 'value-mismatch' ? '(' + i.codeName + ') Figma ' + i.figma + ' vs code ' + i.code : ''}${i.kind === 'missing-in-figma' ? i.codeName + ' = ' + i.code : ''}${i.kind === 'possible-rename' ? '<-> ' + i.codeName + ' (' + i.figma + ')' : ''}`);
  if (l.length > EX) console.log(`  ... ${l.length - EX} more (use --out)`) }
if (!items.length) console.log('Figma and code match for every token that both sides define. The script compares values only; it does not judge whether the token set is good.');
if (opt('out')) { fs.writeFileSync(opt('out'), JSON.stringify(items, null, 1)); console.log(`\nAll differences written to ${opt('out')} (set "approve": true on entries to apply).`) }
process.exit(items.length ? 1 : 0);
