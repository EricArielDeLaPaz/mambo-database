#!/usr/bin/env node
// Mechanical design-system audit. Run it instead of reading the code yourself.
//   node audit.js code <folder> [--tokens tokens.json|tokens.css] [--examples 5] [--out findings.json] [--baseline earlier-findings.json]
//   node audit.js tokens <tokens.json|tokens.css>
// Prints a short summary (counts by rule plus a few examples). Full findings go to --out.
// Exit code 1 if any error-level finding exists.
const fs = require('fs'), path = require('path');
const [mode, target, ...rest] = process.argv.slice(2);
const opt = (k, d) => { const i = rest.indexOf('--' + k); return i >= 0 && rest[i + 1] !== undefined ? rest[i + 1] : d };
if (!['code', 'tokens'].includes(mode) || !target) { console.error('Usage: node audit.js code <folder> [--tokens file] [--examples 5] [--out file] [--baseline file]\n       node audit.js tokens <file>'); process.exit(2) }
const EX = +opt('examples', 5), findings = [];
const add = (sev, rule, file, line, msg) => findings.push({ sev, rule, file, line, msg });

// ---- contrast (0.04045 cut-off like the other Mambo copies; ratios cut off, not rounded) ----
const hex6 = h => { h = h.replace('#', ''); if (h.length === 3 || h.length === 4) h = [...h].map(c => c + c).join(''); return h.slice(0, 6) };
const lum = h => { h = hex6(h); const c = [0, 2, 4].map(i => parseInt(h.slice(i, i + 2), 16) / 255).map(v => v <= .04045 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4); return .2126 * c[0] + .7152 * c[1] + .0722 * c[2] };
const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return Math.floor(((x + .05) / (y + .05)) * 100 + 1e-9) / 100 };
const isHex = s => typeof s === 'string' && /^#([0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/i.test(s.trim());
const norm = s => '#' + hex6(s.trim()).toLowerCase();

// ---- read tokens (W3C JSON or CSS custom properties) into { light: {name: hex}, dark: {...} } ----
function readTokens(file) {
  const raw = fs.readFileSync(file, 'utf8'), themes = { light: {}, dark: {} };
  if (file.endsWith('.json')) {
    const walk = (o, p, theme) => { for (const [k, v] of Object.entries(o)) {
      if (k.startsWith('$')) continue;
      if (v && typeof v === 'object' && '$value' in v) { if (isHex(v.$value)) themes[theme][[...p, k].join('-').toLowerCase()] = norm(v.$value) }
      else if (v && typeof v === 'object') walk(v, [...p, k], /^dark$/i.test(k) ? 'dark' : theme);
    } };
    walk(JSON.parse(raw), [], 'light');
  } else {
    for (const b of cssBlocks(raw)) for (const m of b.body.matchAll(/--([\w-]+)\s*:\s*(#[0-9a-fA-F]{3,8})\s*;/g)) themes[b.dark ? 'dark' : 'light'][m[1].toLowerCase()] = norm(m[2]);
  }
  return themes;
}
// Split CSS into rule blocks, marking those inside @media (prefers-color-scheme: dark) or with a dark selector.
function cssBlocks(css) {
  css = css.replace(/\/\*[\s\S]*?\*\//g, ''); const out = [];
  const scan = (text, dark) => { let i = 0; while (i < text.length) {
    const o = text.indexOf('{', i); if (o < 0) break; const head = text.slice(i, o).trim(); let d = 1, j = o + 1;
    while (j < text.length && d) { if (text[j] === '{') d++; else if (text[j] === '}') d--; j++ }
    const body = text.slice(o + 1, j - 1);
    if (head.startsWith('@')) scan(body, dark || /prefers-color-scheme:\s*dark/.test(head)); else out.push({ sel: head, body, dark: dark || /dark/i.test(head) });
    i = j } };
  scan(css, false); return out;
}

// ---- token checks: contrast pairs and counts ----
const PAIRS = [ // [label, foreground matcher, background matcher, minimum, kind]
  ['Text on Background', /(^|-)(text|ink|foreground)$/, /(^|-)(background|bg)$/, 4.5, 'text'],
  ['Text on Surface', /(^|-)(text|ink|foreground)$/, /(^|-)surface$/, 4.5, 'text'],
  ['Text secondary on Background', /(text-secondary|secondary-text|muted)$/, /(^|-)(background|bg)$/, 4.5, 'text'],
  ['Text secondary on Surface', /(text-secondary|secondary-text|muted)$/, /(^|-)surface$/, 4.5, 'text'],
  ['Inverse text on Primary', /(inverse-text|text-inverse|on-primary|primary-text)$/, /(^|-)primary$/, 4.5, 'text'],
  ['Link on Background', /(^|-)link$/, /(^|-)(background|bg)$/, 4.5, 'text'],
  ['Primary on Background (UI)', /(^|-)primary$/, /(^|-)(background|bg)$/, 3, 'ui'],
  ['Border on Background (UI)', /(^|-)border$/, /(^|-)(background|bg)$/, 3, 'ui'],
  ['Danger on Background (UI)', /(^|-)(danger|error)$/, /(^|-)(background|bg)$/, 3, 'ui'],
  ['Success on Background (UI)', /(^|-)success$/, /(^|-)(background|bg)$/, 3, 'ui'],
  ['Warning on Background (UI)', /(^|-)warning$/, /(^|-)(background|bg)$/, 3, 'ui'],
  ['Info on Background (UI)', /(^|-)info$/, /(^|-)(background|bg)$/, 3, 'ui'],
];
const pick = (map, re) => { const k = Object.keys(map).filter(n => re.test(n)).sort((a, b) => a.length - b.length)[0]; return k && [k, map[k]] };
function checkTokens(file, themes) {
  let checked = 0;
  for (const theme of ['light', 'dark']) { const m = themes[theme]; if (!Object.keys(m).length) continue;
    const n = new Set(Object.values(m)).size; if (n < 6 || n > 16) add('warn', 'color-count', file, 0, `${theme}: ${n} distinct colors (aim for 6 to 16)`);
    for (const [label, fg, bg, min, kind] of PAIRS) { const f = pick(m, fg), b = pick(m, bg); if (!f || !b || f[0] === b[0]) continue; checked++;
      const r = ratio(f[1], b[1]); if (r < min) add('error', 'contrast', file, 0, `${theme}: ${label} ${f[1]} on ${b[1]} = ${r}:1, needs ${min}:1 (${f[0]} / ${b[0]})`) } }
  if (!Object.keys(themes.dark).length) add('info', 'no-dark-theme', file, 0, 'No dark tokens found (a "dark" group in JSON, or a dark selector / prefers-color-scheme block in CSS)');
  if (!checked) add('info', 'no-pairs', file, 0, 'No text/background pairs could be matched by name. Use the Mambo role names (Text, Background, Surface, Primary, Border) or check pairs by hand with contrast.js');
}

// ---- code scan ----
const SKIP = new Set(['node_modules', 'dist', 'build', '.git', '.next', 'coverage', 'vendor', '.svelte-kit', 'out']);
const EXT = /\.(css|scss|less|html|jsx|tsx|vue|svelte|astro|js|ts)$/;
function files(dir, acc = []) { for (const e of fs.readdirSync(dir, { withFileTypes: true })) { if (SKIP.has(e.name)) continue; const p = path.join(dir, e.name);
  if (e.isDirectory()) files(p, acc); else if (EXT.test(e.name) && !/\.min\./.test(e.name) && fs.statSync(p).size < 500000) acc.push(p) } return acc }
const usage = { tok: 0, hard: 0 };
const ON_SCALE = new Set([0, 4, 8, 12, 16, 20, 24, 32]), LARGE_OK = v => v > 32 && v % 8 === 0;
function scanCode(dir, tokenMap, tokensHaveDark) {
  const fl = files(dir), valToToken = {}, stats = { radius: new Set(), size: new Set(), weight: new Set(), family: new Set() };
  for (const [k, v] of Object.entries(tokenMap || {})) (valToToken[v] = valToToken[v] || k);
  let hasDark = !!tokensHaveDark; usage.tok = 0; usage.hard = 0;
  for (const f of fl) { const rel = path.relative(dir, f), lines = fs.readFileSync(f, 'utf8').split('\n'), text = lines.join('\n'), isCss = /\.(css|scss|less)$/.test(f);
    if (/prefers-color-scheme:\s*dark|\.dark\b|data-theme|data-mode/.test(text)) hasDark = true;
    if (isCss) { if (/:hover/.test(text) && !/:focus/.test(text)) add('warn', 'no-focus-style', rel, 0, 'Has :hover styles but no :focus or :focus-visible styles');
      if ((/\btransition\s*:|\banimation\s*:/.test(text)) && !/prefers-reduced-motion/.test(text)) add('info', 'no-reduced-motion', rel, 0, 'Uses transitions or animations without a prefers-reduced-motion rule') }
    lines.forEach((ln, i) => { const n = i + 1, code = ln.replace(/\/\*.*?\*\//g, '');
      const defn = /^\s*--[\w-]+\s*:/.test(code); // token definitions are allowed to hold hex
      if (!defn) usage.tok += (code.match(/var\(\s*--/g) || []).length;
      if (!defn) for (const m of code.matchAll(/\b(?:rgba?|hsla?)\(\s*[\d.%\s,\/-]+\)/g)) { usage.hard++; add('warn', 'hardcoded-color', rel, n, `${m[0]} is a literal color, not a token`) }
      for (const m of code.matchAll(/\b(?:[a-z]+:)*(-?[pm][trblxy]?|gap(?:-[xy])?|space-[xy]|inset(?:-[xy])?)-\[(-?\d*\.?\d+)px\]/g)) { const px = Math.abs(+m[2]); if (!(ON_SCALE.has(px) || LARGE_OK(px))) add('warn', 'off-scale-spacing', rel, n, `Tailwind ${m[0]}: ${m[2]}px is not on the 4-point scale`) }
      for (const m of code.matchAll(/\b(padding|margin|gap|rowGap|columnGap)(?:Top|Right|Bottom|Left|Horizontal|Vertical|Inline|Block)?\s*:\s*(-?\d+(?:\.\d+)?)\s*[,}]/g)) { const px = Math.abs(+m[2]); if (!(ON_SCALE.has(px) || LARGE_OK(px))) add('warn', 'off-scale-spacing', rel, n, `${m[0].replace(/\s*[,}]$/, '')}: ${m[2]}px is not on the 4-point scale (inline style)`) }
      if (!defn) for (const m of code.matchAll(/#[0-9a-fA-F]{3,8}\b/g)) { if (!isHex(m[0])) continue; usage.hard++; const t = valToToken[norm(m[0])];
        add('warn', 'hardcoded-color', rel, n, t ? `${m[0]} matches token ${t}; use var(--${t})` : `${m[0]} is not a token` + (tokenMap ? ' (not in the tokens file)' : '')) }
      for (const m of code.matchAll(/\b(padding|margin|gap|row-gap|column-gap)(-(?:top|right|bottom|left|inline|block)(?:-(?:start|end))?)?\s*:\s*([^;}{]+)/g)) {
        for (const v of m[3].matchAll(/(-?\d*\.?\d+)px/g)) { const px = Math.abs(+v[1]); if (ON_SCALE.has(px) || LARGE_OK(px)) continue; add('warn', 'off-scale-spacing', rel, n, `${m[1]}${m[2] || ''}: ${v[1]}px is not on the 4-point scale (4, 8, 12, 16, 20, 24, 32, then multiples of 8)`) } }
      if (/outline\s*:\s*(none|0)\b/.test(code) && !/:focus-visible/.test(ln)) add('warn', 'outline-removed', rel, n, 'outline removed; make sure a visible focus style replaces it');
      for (const m of code.matchAll(/border-radius\s*:\s*([^;}{]+)/g)) stats.radius.add(m[1].trim());
      for (const m of code.matchAll(/font-size\s*:\s*(\d*\.?\d+(?:px|rem))/g)) stats.size.add(m[1]);
      for (const m of code.matchAll(/font-weight\s*:\s*(\d{3}|bold|normal)/g)) stats.weight.add(m[1]);
      for (const m of code.matchAll(/font-family\s*:\s*([^;}{]+)/g)) if (!/var\(/.test(m[1])) stats.family.add(m[1].split(',')[0].replace(/["']/g, '').trim().toLowerCase());
    }) }
  if (stats.radius.size > 5) add('warn', 'too-many-radii', '', 0, `${stats.radius.size} different border-radius values: ${[...stats.radius].slice(0, 8).join(' | ')}`);
  if (stats.size.size > 8) add('warn', 'too-many-sizes', '', 0, `${stats.size.size} different font sizes: ${[...stats.size].slice(0, 10).join(', ')}`);
  if (stats.weight.size > 4) add('warn', 'too-many-weights', '', 0, `${stats.weight.size} different font weights: ${[...stats.weight].join(', ')}`);
  if (stats.family.size > 3) add('warn', 'too-many-families', '', 0, `${stats.family.size} font families: ${[...stats.family].join(', ')}`);
  if (!hasDark) add('info', 'no-dark-mode', '', 0, 'No dark-mode selector or prefers-color-scheme rule found anywhere');
  return fl.length;
}

let scanned = 0, tokenMap = null, tokDark = false;
const tfile = mode === 'tokens' ? target : opt('tokens');
if (tfile) { const t = readTokens(tfile); tokenMap = { ...t.light }; tokDark = Object.keys(t.dark).length > 0; checkTokens(path.basename(tfile), t) }
if (mode === 'code') scanned = scanCode(target, tokenMap, tokDark);

// ---- report ----
const by = {}; for (const f of findings) (by[f.rule] = by[f.rule] || []).push(f);
const order = { error: 0, warn: 1, info: 2 }, rules = Object.entries(by).sort((a, b) => order[a[1][0].sev] - order[b[1][0].sev] || b[1].length - a[1].length);
const cnt = s => findings.filter(f => f.sev === s).length;
console.log(`Audit of ${target}${scanned ? ` (${scanned} files)` : ''}: ${cnt('error')} errors, ${cnt('warn')} warnings, ${cnt('info')} notes`);
for (const [rule, list] of rules) { console.log(`\n[${list[0].sev}] ${rule} x${list.length}`); for (const f of list.slice(0, EX)) console.log(`  ${f.file ? f.file + (f.line ? ':' + f.line : '') + ' ' : ''}${f.msg}`); if (list.length > EX) console.log(`  ... ${list.length - EX} more (use --out to save all)`) }
if (mode === 'code' && usage.tok + usage.hard) console.log(`\nColor usage: ${usage.tok} via var(--token), ${usage.hard} literal (${Math.round(100 * usage.tok / (usage.tok + usage.hard))}% tokenized)`);
if (!findings.length) console.log('No findings. Remember the script cannot judge component quality, naming or documentation; see references/checks.md for the manual checks.');
if (opt('baseline')) { const prev = JSON.parse(fs.readFileSync(opt('baseline'), 'utf8')), c = a => a.reduce((m, f) => (m[f.rule] = (m[f.rule] || 0) + 1, m), {}), P = c(prev), C = c(findings);
  console.log('\nChange since baseline (rule: before -> after):'); for (const r of new Set([...Object.keys(P), ...Object.keys(C)])) console.log(`  ${r}: ${P[r] || 0} -> ${C[r] || 0}`) }
if (opt('out')) { fs.writeFileSync(opt('out'), JSON.stringify(findings, null, 1)); console.log(`\nAll findings written to ${opt('out')}`) }
process.exit(cnt('error') ? 1 : 0);
