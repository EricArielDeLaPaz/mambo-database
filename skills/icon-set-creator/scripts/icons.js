#!/usr/bin/env node
// Check and preview a custom SVG icon set. Run it instead of judging icons by eye.
//   node icons.js check <folder|file.svg ...> [--spec icon-spec.json]   exit 1 if any icon has an error
//   node icons.js preview <folder> [--spec icon-spec.json] [--out preview.html]
// icon-spec.json (all optional; defaults shown): {"grid":24,"padding":2,"stroke":2,"linecap":"round","linejoin":"round","style":"outline"}
// style is "outline" (stroke, fill none) or "filled" (fill, no stroke). The live area is padding..grid-padding; a stroked shape's edge (path box grown by stroke/2) must stay inside it.
const fs = require('fs'), path = require('path');
const [cmd, ...args] = process.argv.slice(2);
const opt = (k, d) => { const i = args.indexOf('--' + k); return i >= 0 && args[i + 1] !== undefined ? args[i + 1] : d };
const specFile = opt('spec'), spec = Object.assign({ grid: 24, padding: 2, stroke: 2, linecap: 'round', linejoin: 'round', style: 'outline' }, specFile ? JSON.parse(fs.readFileSync(specFile, 'utf8')) : {});
const targets = args.filter((a, i) => !a.startsWith('--') && !(i && args[i - 1].startsWith('--')));
if (!['check', 'preview'].includes(cmd) || !targets.length) { console.error('Usage: node icons.js check <folder|files> [--spec f]\n       node icons.js preview <folder> [--spec f] [--out preview.html]'); process.exit(2) }
const list = t => fs.statSync(t).isDirectory() ? fs.readdirSync(t).filter(f => f.endsWith('.svg')).sort().map(f => path.join(t, f)) : [t];
const files = targets.flatMap(list);

// ---------- geometry ----------
function pathBox(d) { // bounding box of path data using end points and control points (control box can over-estimate curves slightly)
  const tok = [...d.matchAll(/([a-zA-Z])|(-?(?:\d+\.?\d*|\.\d+)(?:e[-+]?\d+)?)/gi)].map(m => m[1] || +m[2]);
  let i = 0, cmd = '', x = 0, y = 0, sx = 0, sy = 0, box = [Infinity, Infinity, -Infinity, -Infinity];
  const pt = (px, py) => { box = [Math.min(box[0], px), Math.min(box[1], py), Math.max(box[2], px), Math.max(box[3], py)] };
  const num = () => { const v = tok[i++]; if (typeof v !== 'number') throw new Error('bad path data'); return v };
  while (i < tok.length) {
    if (typeof tok[i] === 'string') cmd = tok[i++];
    const rel = cmd === cmd.toLowerCase(), C = cmd.toUpperCase(), ox = rel ? x : 0, oy = rel ? y : 0;
    if (C === 'Z') { x = sx; y = sy; continue }
    if (C === 'M') { x = ox + num(); y = oy + num(); sx = x; sy = y; pt(x, y); cmd = rel ? 'l' : 'L' }
    else if (C === 'L' || C === 'T') { x = ox + num(); y = oy + num(); pt(x, y) }
    else if (C === 'H') { x = ox + num(); pt(x, y) }
    else if (C === 'V') { y = oy + num(); pt(x, y) }
    else if (C === 'C') { pt(ox + num(), oy + num()); pt(ox + num(), oy + num()); x = ox + num(); y = oy + num(); pt(x, y) }
    else if (C === 'S' || C === 'Q') { pt(ox + num(), oy + num()); x = ox + num(); y = oy + num(); pt(x, y) }
    else if (C === 'A') { const rx = num(), ry = num(); num(); num(); num(); x = ox + num(); y = oy + num(); pt(x, y); void rx; void ry }
    else throw new Error('unknown path command ' + cmd);
  }
  return box;
}
const attr = (tag, n) => { const m = tag.match(new RegExp('(?:^|\\s)' + n + '\\s*=\\s*"([^"]*)"')); return m ? m[1] : undefined };
function shapeBox(tag, name) {
  const n = k => parseFloat(attr(tag, k) || 0);
  if (name === 'path') return pathBox(attr(tag, 'd') || '');
  if (name === 'circle') return [n('cx') - n('r'), n('cy') - n('r'), n('cx') + n('r'), n('cy') + n('r')];
  if (name === 'ellipse') return [n('cx') - n('rx'), n('cy') - n('ry'), n('cx') + n('rx'), n('cy') + n('ry')];
  if (name === 'rect') return [n('x'), n('y'), n('x') + n('width'), n('y') + n('height')];
  if (name === 'line') return [Math.min(n('x1'), n('x2')), Math.min(n('y1'), n('y2')), Math.max(n('x1'), n('x2')), Math.max(n('y1'), n('y2'))];
  if (name === 'polyline' || name === 'polygon') { const p = (attr(tag, 'points') || '').trim().split(/[\s,]+/).map(Number); const xs = p.filter((_, k) => k % 2 === 0), ys = p.filter((_, k) => k % 2); return [Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)] }
  return null;
}

// ---------- checks ----------
function checkOne(file) {
  const out = [], err = m => out.push({ sev: 'error', msg: m }), warn = m => out.push({ sev: 'warn', msg: m });
  const src = fs.readFileSync(file, 'utf8'), root = (src.match(/<svg\b[^>]*>/) || [])[0];
  if (!root) { err('no <svg> element'); return out }
  const vb = (attr(root, 'viewBox') || '').trim().split(/[\s,]+/).map(Number), G = spec.grid;
  if (vb.length !== 4 || vb.some(isNaN)) err('missing viewBox'); else if (vb[0] !== 0 || vb[1] !== 0 || vb[2] !== G || vb[3] !== G) err(`viewBox is ${vb.join(' ')}, expected 0 0 ${G} ${G}`);
  const w = attr(root, 'width'), h = attr(root, 'height'); if ((w && w !== String(G)) || (h && h !== String(G))) warn(`width/height ${w || '-'}x${h || '-'} differ from ${G}; prefer none or ${G}`);
  for (const bad of ['image', 'text', 'style', 'script', 'foreignObject', 'filter', 'mask', 'clipPath', 'use', 'defs', 'linearGradient', 'radialGradient']) if (new RegExp('<' + bad + '\\b', 'i').test(src)) err(`<${bad}> is not allowed in an icon (flatten it to simple shapes)`);
  if (/\sstyle\s*=/.test(src)) err('inline style attribute; use attributes only');
  if (/\stransform\s*=/.test(src)) warn('transform found; bake it into the coordinates');
  const tags = [...src.matchAll(/<(path|circle|ellipse|rect|line|polyline|polygon)\b[^>]*>/gi)].map(m => ({ tag: m[0], name: m[1].toLowerCase() }));
  if (!tags.length) err('no shapes'); if (tags.length > 12) warn(`${tags.length} shapes; icons this complex rarely stay legible at 16px`);
  const all = [root, ...tags.map(t => t.tag)];
  for (const t of all) for (const k of ['fill', 'stroke']) { const v = attr(t, k); if (v && !/^(none|currentColor)$/i.test(v)) err(`${k}="${v}" is a fixed color; use currentColor or none so the icon follows text color`) }
  const get = k => { const v = new Set(all.map(t => attr(t, k)).filter(v => v !== undefined)); return [...v] };
  if (spec.style === 'outline') {
    const sw = get('stroke-width'); if (!sw.length) err(`no stroke-width; expected ${spec.stroke}`); else if (sw.some(v => +v !== +spec.stroke)) err(`stroke-width ${sw.join(', ')} differs from the spec ${spec.stroke}`);
    if (!get('stroke').includes('currentColor')) err('stroke is not currentColor');
    const fills = get('fill').filter(v => v !== 'none'); if (fills.length) warn('outline icon has filled shapes: ' + fills.join(', '));
    for (const [k, want] of [['stroke-linecap', spec.linecap], ['stroke-linejoin', spec.linejoin]]) { const v = get(k); if (!v.length) warn(`no ${k}; expected ${want}`); else if (v.some(x => x !== want)) err(`${k} ${v.join(', ')} differs from the spec ${want}`) }
  } else {
    if (get('stroke').some(v => v !== 'none')) warn('filled icon has strokes; flatten them or switch the spec to outline');
    if (!get('fill').includes('currentColor') && !/<svg[^>]*\sfill="currentColor"/.test(src)) err('fill is not currentColor');
  }
  const grow = spec.style === 'outline' ? spec.stroke / 2 : 0, lo = spec.padding - 0.1, hi = G - spec.padding + 0.1;
  for (const t of tags) { let b; try { b = shapeBox(t.tag, t.name) } catch (e) { err(`<${t.name}> ${e.message}`); continue }
    if (!b || b.some(v => !isFinite(v))) { err(`<${t.name}> has no readable geometry`); continue }
    const [x0, y0, x1, y1] = [b[0] - grow, b[1] - grow, b[2] + grow, b[3] + grow];
    if (x0 < lo || y0 < lo || x1 > hi || y1 > hi) err(`<${t.name}> reaches ${r(x0)},${r(y0)} to ${r(x1)},${r(y1)}; the live area is ${spec.padding} to ${G - spec.padding}`) }
  for (const d of src.matchAll(/\sd="([^"]*)"/g)) { if (d[1].length > 1500) warn('very long path data (' + d[1].length + ' chars)'); if (/\d\.\d{3,}/.test(d[1])) { warn('more than 2 decimal places in path data; round to 2'); break } }
  return out;
}
const r = v => Math.round(v * 100) / 100;

if (cmd === 'check') {
  let errs = 0, warns = 0, bad = 0; const lines = [];
  for (const f of files) { const res = checkOne(f); const e = res.filter(x => x.sev === 'error'), w = res.filter(x => x.sev === 'warn'); errs += e.length; warns += w.length; if (e.length) bad++;
    if (res.length) lines.push(`${path.basename(f)}\n` + res.map(x => `  ${x.sev}: ${x.msg}`).join('\n')) }
  console.log(`Icon check (${files.length} icons, ${spec.style}, grid ${spec.grid}, live area ${spec.padding} to ${spec.grid - spec.padding}, stroke ${spec.stroke}): ${bad} failing, ${errs} errors, ${warns} warnings`);
  lines.slice(0, 40).forEach(l => console.log(l)); if (lines.length > 40) console.log(`... ${lines.length - 40} more icons with findings`);
  if (!errs && !warns) console.log('All icons pass the mechanical checks. The script cannot judge whether the shapes are recognizable or visually balanced; look at the preview.');
  process.exit(errs ? 1 : 0);
}
// preview
const G = spec.grid, P = spec.padding, cells = files.map(f => { const svg = fs.readFileSync(f, 'utf8').replace(/<\?xml[^>]*>/, '').trim(), name = path.basename(f, '.svg');
  const sized = s => svg.replace(/<svg\b([^>]*)>/, (m, a) => `<svg${a.replace(/\s(width|height)="[^"]*"/g, '')} width="${s}" height="${s}">`);
  return `<figure><div class="k" style="--g:${G};--p:${P}">${sized(96)}</div><div class="row"><span>${sized(24)}</span><span class="dk">${sized(24)}</span><span>${sized(16)}</span></div><figcaption>${name}</figcaption></figure>` });
const html = `<!doctype html><meta charset="utf-8"><title>Icon preview</title><style>body{font:14px system-ui;margin:16px;background:#fff;color:#111}.g{display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:16px}figure{margin:0;border:1px solid #d4d4d4;border-radius:8px;padding:12px;text-align:center}.k{position:relative;width:96px;height:96px;margin:0 auto 8px;outline:1px dashed #94a3b8}.k::after{content:"";position:absolute;inset:calc(var(--p)/var(--g)*100%);background:#e11d4818;pointer-events:none}.row{display:flex;gap:8px;justify-content:center;align-items:center}.dk{background:#111;color:#fff;padding:4px;border-radius:4px}figcaption{margin-top:8px;font-size:12px}</style><p>Pink box = live area (${P} to ${G - P} of ${G}). Sizes 96, 24 (light and dark), 16.</p><div class="g">${cells.join('')}</div>`;
fs.writeFileSync(opt('out', 'icon-preview.html'), html); console.log(`Preview of ${files.length} icons written to ${opt('out', 'icon-preview.html')}`);
