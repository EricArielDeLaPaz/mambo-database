/* ===== Tools: contrast checker and color randomizer ===== */
const TOOLS = [['contrast', 'Contrast checker'], ['randomizer', 'Color randomizer']];
const h2x = (h, s, l) => { h = ((h % 360) + 360) % 360; s = Math.max(0, Math.min(1, s)); l = Math.max(0, Math.min(1, l)); const a = s * Math.min(l, 1 - l), f = n => { const k = (n + h / 30) % 12; return Math.round(255 * (l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1)))) }; return '#' + [f(0), f(8), f(4)].map(v => v.toString(16).padStart(2, '0')).join('') };
const rnd = (a, b) => a + Math.random() * (b - a);
const pick = a => a[Math.floor(Math.random() * a.length)];
const inkOn = bg => ratio('#000000', bg) >= ratio('#ffffff', bg) ? '#000000' : '#ffffff';
const TICK = '<span aria-hidden="true">✓</span>', CROSS = '<span aria-hidden="true">✕</span>';

function renderTools() {
  const id = TOOLS.some(t => t[0] === route().id) ? route().id : 'contrast';
  $('#app').innerHTML = `<main id="main" tabindex="-1" class="toolwrap"><div class="dbhead"><div><p class="eyebrow">Tools</p><h1>${id === 'contrast' ? 'Contrast checker' : 'Color randomizer'}</h1></div></div>
  <nav class="subtabs" aria-label="Tools">${TOOLS.map(t => `<a href="#/tools/${t[0]}" ${t[0] === id ? 'aria-current="page"' : ''}>${t[1]}</a>`).join('')}</nav><div id="toolbody"></div></main>`;
  document.title = TOOLS.find(t => t[0] === id)[1] + ' · Mambo Database';
  id === 'contrast' ? renderContrast($('#toolbody')) : renderRandomizer($('#toolbody'));
}

/* ---------- contrast checker (same math as WebAIM) ---------- */
const CT = { fg: '#1d4ed8', bg: '#ffffff' };
function renderContrast(el) {
  el.innerHTML = `<p class="lede">Check any two colors against the WCAG contrast rules. The math is the same as <a href="https://webaim.org/resources/contrastchecker/" target="_blank" rel="noopener">WebAIM's Contrast Checker</a>, and the ratio is cut off (not rounded) at two decimals like theirs, so 4.496 reads 4.49 and fails.</p>
  <div class="ct-in">${[['fg', 'Foreground (text or icon)'], ['bg', 'Background']].map(([k, l]) => `<div class="f ct-f"><label class="f-t" for="ct-${k}">${l}</label><div class="ct-row"><input type="color" id="ct-${k}-p" aria-label="${l} color picker" value="${CT[k]}"><input type="text" id="ct-${k}" value="${CT[k]}" maxlength="7" autocomplete="off" spellcheck="false" aria-describedby="ct-err-${k}"></div><p class="ct-err" id="ct-err-${k}" role="alert"></p></div>`).join('')}
  <button class="btn" id="ct-swap" type="button">Swap colors</button></div>
  <div id="ct-out" aria-live="polite"></div>`;
  const out = $('#ct-out', el);
  const update = () => {
    const r = ratio(CT.fg, CT.bg), rs = fmtRatio(r), rows = [['Normal text', 'AA', 4.5], ['Normal text', 'AAA', 7], ['Large text', 'AA', 3], ['Large text', 'AAA', 4.5], ['Graphics and UI components', 'AA', 3]];
    const need = r < 4.5 ? 4.5 : r < 7 ? 7 : 0, fix = need ? fixFg(CT.fg, CT.bg, need) : null, fr = fix ? ratio(fix, CT.bg) : 0;
    out.innerHTML = `<div class="ct-res"><div class="ct-score"><span class="eyebrow">Contrast ratio</span><strong>${rs}:1</strong></div>
    <div class="ct-prev" style="background:${esc(CT.bg)};color:${esc(CT.fg)}"><p class="ct-lg">Large text sample</p><p>Normal text sample. The quick brown fox jumps over the lazy dog.</p><span class="ct-ui" style="border-color:${esc(CT.fg)}">UI component</span></div>
    <table class="ct-tbl"><caption class="sr">WCAG results for this color pair</caption><thead><tr><th scope="col">Use</th><th scope="col">Level</th><th scope="col">Needs</th><th scope="col">Result</th></tr></thead><tbody>${rows.map(([u, lv, t]) => `<tr><th scope="row">${u}</th><td>WCAG ${lv}</td><td>${t}:1</td><td class="${r >= t ? 'pass' : 'fail'}">${r >= t ? TICK + ' Pass' : CROSS + ' Fail'}</td></tr>`).join('')}</tbody></table>
    <p class="note">Large text means 24px or bigger, or 18.66px or bigger in bold (14pt bold).</p>
    <div class="row ct-act"><a class="btn" href="${webaimUrl(CT.fg, CT.bg)}" target="_blank" rel="noopener">Check on WebAIM</a>${fix && fix !== CT.fg ? `<button class="btn solid" id="ct-fix" type="button">Use ${esc(fix)} for the foreground (${fmtRatio(fr)}:1, ${need === 4.5 ? 'passes AA' : 'passes AAA'})</button>` : ''}</div></div>`;
    const b = $('#ct-fix', out); if (b) b.onclick = () => { CT.fg = fix; sync(); update() };
  };
  const sync = () => ['fg', 'bg'].forEach(k => { $('#ct-' + k, el).value = CT[k]; $('#ct-' + k + '-p', el).value = CT[k]; $('#ct-err-' + k, el).textContent = ''; $('#ct-' + k, el).removeAttribute('aria-invalid') });
  ['fg', 'bg'].forEach(k => {
    $('#ct-' + k + '-p', el).oninput = e => { CT[k] = e.target.value.toLowerCase(); sync(); update() };
    $('#ct-' + k, el).oninput = e => { const n = normHex(e.target.value), err = $('#ct-err-' + k, el); if (n) { CT[k] = n; $('#ct-' + k + '-p', el).value = n; err.textContent = ''; e.target.removeAttribute('aria-invalid'); update() } else { err.textContent = 'Enter a hex color like #1d4ed8 or #fff.'; e.target.setAttribute('aria-invalid', 'true') } };
  });
  $('#ct-swap', el).onclick = () => { [CT.fg, CT.bg] = [CT.bg, CT.fg]; sync(); update() };
  update();
}

/* ---------- color randomizer ---------- */
const RZ_KEY = 'mambo-database.tools.v1', DARK_BG = '#121212', LIGHT_BG = '#ffffff';
const SYS_DEFAULT = ['Primary', 'Secondary', 'Accent', 'Background', 'Surface', 'Border', 'Text', 'Text secondary', 'Success', 'Warning', 'Danger', 'Info'];
const HUES = [['Red', 0], ['Orange', 24], ['Amber', 40], ['Yellow', 52], ['Lime', 84], ['Green', 142], ['Teal', 174], ['Cyan', 193], ['Blue', 217], ['Indigo', 240], ['Purple', 272], ['Pink', 330]];
const HUE_ROLES = { Primary: 'Main buttons, links and selected states.', Secondary: 'Supporting actions, tags and secondary buttons.', Tertiary: 'A rare third brand color for charts and illustrations.', Accent: 'Small highlights: badges, new labels and call-outs.', Success: 'Confirmations, completed steps and positive trends.', Warning: 'Cautions the person can still act on.', Danger: 'Errors, destructive actions and failed states.', Info: 'Tips, help and neutral status messages.' };
const HUE_LIMITS = { hues: { min: 3, rec: 7, max: 8 } };
const STEPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900], STEP_L = [.96, .9, .8, .7, .6, .5, .42, .34, .26, .18];
const OTHER = ['Link', 'Highlight', 'Other'];
let RZ = null;

const mkc = (role, name) => ({ id: uid(), role, name: name || role, hex: '#000000', locked: false });
const rzList = () => RZ.mode === 'system' ? RZ.sys : RZ.rand;
function saveRz() { try { localStorage.setItem(RZ_KEY, JSON.stringify({ mode: RZ.mode, theme: RZ.theme, view: RZ.view, rand: RZ.rand, sys: RZ.sys, hues: RZ.hues })) } catch { } }
function rzInit() {
  if (RZ) return;
  let d = null; try { d = JSON.parse(localStorage.getItem(RZ_KEY)) } catch { }
  RZ = d && Array.isArray(d.sys) && Array.isArray(d.rand) && Array.isArray(d.hues) ? { mode: d.mode === 'random' ? 'random' : 'system', theme: d.theme === 'dark' ? 'dark' : 'light', view: d.view === 'hues' ? 'hues' : 'palette', rand: d.rand, sys: d.sys, hues: d.hues, hist: [] } : { mode: 'system', theme: 'light', view: 'palette', rand: [], sys: [], hues: [], hist: [] };
  RZ.rand = RZ.rand.filter(c => normHex(c.hex)); RZ.sys = RZ.sys.filter(c => normHex(c.hex) && ROLES.includes(c.role)); RZ.hues = RZ.hues.filter(h => HUES.some(x => x[0] === h.hue) && HUE_ROLES[h.role]);
  if (!RZ.sys.length) { RZ.sys = SYS_DEFAULT.map(r => mkc(r)); genSystem(RZ.sys, RZ.theme) }
  if (!RZ.rand.length) { RZ.rand = [1, 2, 3, 4, 5].map(i => mkc('Other', 'Color ' + i)); genRandom(RZ.rand) }
  if (!RZ.hues.length) RZ.hues = [['Blue', 'Primary'], ['Teal', 'Secondary'], ['Green', 'Success'], ['Amber', 'Warning'], ['Red', 'Danger']].map(([hue, role]) => ({ hue, role }));
}

/* Completely random: spread hues around the wheel so the colors differ from each other. */
function genRandom(list) {
  const base = rnd(0, 360); let i = 0;
  list.forEach(c => { if (c.locked) return; c.hex = h2x(base + i * 137.5 + rnd(-15, 15), rnd(.45, .9), rnd(.3, .75)); i++ });
}
/* For a design system: every role gets a color that makes sense for that job, and text-like roles are nudged until they pass WCAG AA on the Background. */
function genSystem(list, theme) {
  const dark = theme === 'dark', by = r => list.find(c => c.role === r), lk = r => { const c = by(r); return c && c.locked };
  const anchor = ['Primary', 'Secondary', 'Accent', 'Tertiary'].map(by).find(c => c && c.locked);
  const h0 = anchor ? hsl(anchor.hex).h : rnd(0, 360);
  const bg = lk('Background') ? by('Background').hex : (dark ? h2x(h0, rnd(.1, .25), rnd(.07, .1)) : (Math.random() < .4 ? '#ffffff' : h2x(h0, rnd(.15, .5), rnd(.965, .99))));
  const gen = {
    'Background': () => bg, 'Surface': () => dark ? h2x(h0, .15, .13) : h2x(h0, .2, .95), 'Surface variant': () => dark ? h2x(h0, .15, .18) : h2x(h0, .2, .91), 'Overlay': () => h2x(h0, .3, .08),
    'Neutral': () => h2x(h0, .08, .5), 'Border': () => fixFg(h2x(h0, .1, dark ? .4 : .6), bg, 3), 'Text': () => fixFg(h2x(h0, dark ? .1 : .2, dark ? .95 : .08), bg, 7), 'Text secondary': () => fixFg(h2x(h0, .1, dark ? .75 : .35), bg, 4.5),
    'Disabled': () => h2x(h0, .05, dark ? .35 : .7),
    'Primary': () => fixFg(h2x(h0, rnd(.6, .85), rnd(.4, .5)), bg, 4.5), 'Secondary': () => fixFg(h2x(h0 + pick([30, -30, 150, 180, 210]), rnd(.45, .75), rnd(.35, .5)), bg, 4.5),
    'Tertiary': () => fixFg(h2x(h0 + pick([120, 240, -120]), rnd(.45, .75), rnd(.35, .5)), bg, 4.5), 'Accent': () => fixFg(h2x(h0 + pick([150, 180, 210]), rnd(.7, .95), rnd(.45, .55)), bg, 4.5),
    'Success': () => fixFg(h2x(rnd(135, 155), rnd(.6, .75), rnd(.3, .4)), bg, 4.5), 'Warning': () => fixFg(h2x(rnd(28, 40), .85, rnd(.35, .45)), bg, 4.5), 'Danger': () => fixFg(h2x(pick([354, 358, 2, 6]), rnd(.65, .8), rnd(.4, .48)), bg, 4.5), 'Info': () => fixFg(h2x(rnd(200, 215), rnd(.7, .85), rnd(.35, .45)), bg, 4.5),
    'Link': () => fixFg(h2x(h0, .75, .45), bg, 4.5), 'Highlight': () => h2x(rnd(45, 55), .9, dark ? .35 : .85), 'Other': () => fixFg(h2x(rnd(0, 360), rnd(.45, .85), rnd(.35, .55)), bg, 3)
  };
  list.forEach(c => { if (!c.locked) c.hex = (gen[c.role] || gen.Other)() });
  const inv = by('Inverse text'), pr = by('Primary'); if (inv && !inv.locked) inv.hex = inkOn(pr ? pr.hex : bg);
}

/* ---------- limits, shown the same way as in Design Systems ---------- */
function limitRows(rows) {
  return `<ul class="lim">${rows.map(([label, n, L, unit]) => { const rec = L.rec || L.max, st = n < L.min ? ['bad', 'Below the minimum'] : n > L.max ? ['bad', 'Over the maximum'] : n > rec ? ['warn', 'Above recommended'] : ['ok', 'In the healthy range']; return `<li class="${st[0]}"><b>${label}</b><span class="n">${n}${unit || ''}</span><span class="r">min ${L.min} · recommended up to ${rec} · max ${L.max}</span><em>${st[0] === 'ok' ? TICK : '<span aria-hidden="true">!</span>'} ${st[1]}</em></li>` }).join('')}</ul>`;
}
const cnt = (list, grp) => list.filter(c => grp.includes(c.role)).length;

/* ---------- add to a design system ---------- */
async function addColorsToSystem(sel, items, source) {
  let s, isNew = false;
  if (sel.value === '__new') { const n = await ask({ title: 'Name your design system', input: { label: 'Name', value: 'My design system' }, confirm: 'Create' }); if (!n) return null; s = newSystem({ name: n }); isNew = true }
  else s = S.systems.find(x => x.id === sel.value);
  if (!s) { toast('Pick a design system first.'); return null }
  const clash = [...new Set(items.filter(i => i.role !== 'Other' && s.colors.some(c => c.role === i.role && c.hex !== i.hex)).map(i => i.role))];
  if (clash.length && !isNew && !(await ask({ title: 'Replace existing colors?', body: `${s.name} already has ${clash.join(', ')}. Those will change to the new colors. Other colors stay as they are.`, confirm: 'Replace' }))) return null;
  if (isNew) S.systems.push(s);
  items.forEach(i => {
    const ex = i.role !== 'Other' && s.colors.find(c => c.role === i.role);
    if (ex) { ex.hex = i.hex; ex.source = source } else if (!s.colors.some(c => c.hex === i.hex && c.role === i.role)) s.colors.push({ id: uid(), name: i.name, hex: i.hex, role: i.role, source });
  });
  sortColors(s); S.last = s.id; S.active = s.id; saveStore(); toast('Added to ' + s.name);
  return s;
}
const addRow = (id, label) => `<div class="panel addrow"><h2 style="font-size:16px;margin:0 0 8px">Add to a design system</h2><div class="row" style="margin:0;align-items:end"><label class="f" style="min-width:220px"><span class="f-t">Design system</span><select id="${id}">${sysOptions()}</select></label><button class="btn solid" data-act="${id}-go" type="button">${label}</button><span class="empty" id="${id}-msg" role="status"></span></div></div>`;

/* ---------- hues ---------- */
const hueScale = h => STEPS.map((st, i) => ({ step: st, hex: h2x(h, .75, STEP_L[i]) }));
function hueShades(h) {
  const sc = hueScale(h), light = sc.find(x => ratio(x.hex, LIGHT_BG) >= 4.5) || sc[sc.length - 1], dark = [...sc].reverse().find(x => ratio(x.hex, DARK_BG) >= 4.5) || sc[0];
  return { sc, light, dark };
}
const hueDeg = n => HUES.find(h => h[0] === n)[1];
const kebab = s => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

function renderRandomizer(el) {
  rzInit();
  const rerender = f => { renderRandomizer(el); if (f) { const t = $(f, el); if (t) t.focus() } };
  const list = rzList(), sys = RZ.mode === 'system';
  const seg = (name, val, opts) => `<div class="seg" role="radiogroup" aria-label="${name}">${opts.map(([v, l]) => `<button type="button" role="radio" aria-checked="${val === v}" data-${name.toLowerCase()}="${v}">${l}</button>`).join('')}</div>`;
  let h = `<p class="lede">Randomize a palette, lock the colors you like, and keep going until it feels right. Locked colors stay put when you randomize. Everything is saved in this browser.</p>
  <div class="seg-row">${seg('View', RZ.view, [['palette', 'Palette'], ['hues', 'Hues']])}</div>`;
  if (RZ.view === 'palette') {
    h += `<div class="rz-top"><div><span class="f-t">Output</span>${seg('Mode', RZ.mode, [['system', 'For a design system'], ['random', 'Completely random']])}</div>${sys ? `<div><span class="f-t">Theme</span>${seg('Theme', RZ.theme, [['light', 'Light'], ['dark', 'Dark']])}</div>` : ''}
    <div class="rz-go"><button class="btn solid big" data-act="random" type="button">Randomize</button><button class="btn" data-act="undo" type="button" ${RZ.hist.length ? '' : 'disabled'}>Undo</button></div></div>
    <p class="note">${sys ? 'Each role gets a color that fits its job. Text-like roles are adjusted to pass WCAG AA on the Background. Lock a Primary, Secondary or Accent and the rest will match its hue.' : 'Every color is random and spread around the color wheel. Roles are not assigned, so they are added to a design system as Other.'} The randomizer follows simple color rules; it is not an AI model.</p>`;
    h += sys ? `<h2 class="h3">Limits for a design system</h2>${limitRows([['Brand colors', cnt(list, BRAND), LIMITS.brand], ['Neutrals', cnt(list, NEUTRAL), LIMITS.neutral], ['Feedback colors', cnt(list, FEEDBACK), LIMITS.feedback], ['All colors', list.length, LIMITS.colors]])}` : `<p class="note"><b>${list.length} colors.</b> Most palettes use 2 to 12 here. Design systems usually settle on 6 to 16 colors in total (recommended up to ${LIMITS.colors.rec}).</p>`;
    const bgc = sys && list.find(c => c.role === 'Background');
    h += `<ul class="rz-grid" aria-label="Palette">${list.map(c => {
      const ink = inkOn(c.hex), showR = bgc && c.role !== 'Background' && [...BRAND, ...FEEDBACK, 'Text', 'Text secondary', 'Link', 'Border'].includes(c.role), need = c.role === 'Border' ? 3 : 4.5, r = showR ? ratio(c.hex, bgc.hex) : 0;
      return `<li class="rz-card" data-id="${c.id}"><div class="rz-sw" style="background:${esc(c.hex)};color:${ink}"><b>${esc(c.name)}</b><span>${esc(c.hex.toUpperCase())}</span>${c.locked ? '<em>Locked</em>' : ''}</div>
      ${showR ? `<p class="rz-r ${r >= need ? 'pass' : 'fail'}">${r >= need ? TICK : CROSS} ${fmtRatio(r)}:1 on Background${r >= need ? '' : ' (needs ' + need + ':1)'}</p>` : '<p class="rz-r"> </p>'}
      <div class="rz-bar"><button type="button" class="ib" data-lock="${c.id}" aria-pressed="${c.locked}" aria-label="Lock ${esc(c.name)}" title="${c.locked ? 'Unlock' : 'Lock'}">${c.locked ? '🔒' : '🔓'}</button><button type="button" class="ib" data-copyhex="${c.id}" aria-label="Copy ${esc(c.name)} hex code" title="Copy hex">Copy</button><label class="ib pick" title="Edit color"><span class="sr">Edit ${esc(c.name)}</span><input type="color" data-edit="${c.id}" value="${esc(c.hex)}"><span aria-hidden="true">Edit</span></label><button type="button" class="ib" data-remove="${c.id}" aria-label="Remove ${esc(c.name)}" title="Remove">✕</button></div></li>`;
    }).join('')}</ul>`;
    if (sys) {
      const total = list.length, avail = ROLES.filter(r => (r === 'Other' || !list.some(c => c.role === r)) && !(BRAND.includes(r) && cnt(list, BRAND) >= LIMITS.brand.max) && !(NEUTRAL.includes(r) && cnt(list, NEUTRAL) >= LIMITS.neutral.max) && !(FEEDBACK.includes(r) && cnt(list, FEEDBACK) >= LIMITS.feedback.max));
      h += `<div class="row rz-add">${total < LIMITS.colors.max && avail.length ? `<label class="f"><span class="f-t">Add another color</span><select id="rz-role">${avail.map(r => `<option>${r}</option>`).join('')}</select></label><button class="btn" data-act="add" type="button">Add color</button>` : `<p class="note" role="status">${total >= LIMITS.colors.max ? `You have reached the maximum of ${LIMITS.colors.max} colors.` : 'Every role that fits is already in the palette.'} Remove one to add another.</p>`}</div>`;
    } else {
      h += `<div class="row rz-add"><button class="btn" data-act="dec" type="button" ${list.length <= 2 ? 'disabled' : ''}>Fewer colors</button><button class="btn" data-act="inc" type="button" ${list.length >= 12 ? 'disabled' : ''}>More colors</button><span class="note">Minimum 2, maximum 12.</span></div>`;
    }
    h += `<div class="row"><button class="btn" data-act="copycss" type="button">Copy CSS variables</button><button class="btn" data-act="copyhex" type="button">Copy hex codes</button></div>${addRow('rz-sys', 'Add to design system')}`;
  } else {
    const hs = RZ.hues, used = hs.map(x => x.role), dup = [...new Set(used.filter((r, i) => used.indexOf(r) !== i))];
    h += `<p class="note">A hue is a color family, like red or blue. Choose how many your system uses and give each a job. Each hue gets a light-mode shade and an inverse dark-mode shade that stays readable on dark surfaces.</p>
    <h2 class="h3">Pick your hues</h2><div class="huegrid" role="group" aria-label="Hues">${HUES.map(([n, d]) => { const on = hs.some(x => x.hue === n), full = !on && hs.length >= HUE_LIMITS.hues.max; return `<button type="button" class="huechip" data-hue="${n}" aria-pressed="${on}" ${full ? 'disabled' : ''}><i style="background:${h2x(d, .75, .5)}"></i>${n}</button>` }).join('')}</div>
    ${limitRows([['Hues', hs.length, HUE_LIMITS.hues]])}<p class="note">Guidance from published design-system writing (<a href="https://www.uxpin.com/studio/blog/choose-color-pallete/" target="_blank" rel="noopener">UXPin</a> suggests 5 to 7 base hues). Fewer than 3 leaves no room for brand plus success and danger. These are sensible limits, not rules.</p>
    ${limitRows([['Brand roles', cnt(hs, BRAND), LIMITS.brand], ['Feedback roles', cnt(hs, FEEDBACK), LIMITS.feedback]])}${dup.length ? `<p class="callout" role="alert">${dup.join(', ')} ${dup.length > 1 ? 'are' : 'is'} assigned to more than one hue. Give each hue its own role.</p>` : ''}
    <ul class="hue-list">${hs.map((x, i) => { const { sc, light, dark } = hueShades(hueDeg(x.hue)), rl = ratio(light.hex, LIGHT_BG), rd = ratio(dark.hex, DARK_BG); return `<li class="hue-card"><div class="hue-head"><i class="dot" style="background:${light.hex}"></i><h3>${x.hue}</h3><label class="f"><span class="sr">Role for ${x.hue}</span><select data-huerole="${i}" aria-label="Role for ${x.hue}">${Object.keys(HUE_ROLES).map(r => `<option ${r === x.role ? 'selected' : ''}>${r}</option>`).join('')}</select></label><button type="button" class="ib" data-huedel="${i}" aria-label="Remove ${x.hue}">✕</button></div>
      <p class="note" style="margin:6px 0">${esc(x.role)}: ${HUE_ROLES[x.role]}${FEEDBACK.includes(x.role) ? ' Pair it with an icon or text, never color alone.' : ''}</p>
      <div class="scale" role="img" aria-label="${x.hue} shades from 50 to 900. Light mode uses ${light.step}, dark mode uses ${dark.step}.">${sc.map(s => `<div style="background:${s.hex};color:${inkOn(s.hex)}"><span>${s.step}</span>${s.step === light.step ? '<b>Light</b>' : ''}${s.step === dark.step ? '<b>Dark</b>' : ''}</div>`).join('')}</div>
      <div class="modes"><div><span class="eyebrow">Light mode</span><p><i class="sq" style="background:${light.hex}"></i> <b>${light.step}</b> ${light.hex.toUpperCase()}</p><p class="${rl >= 4.5 ? 'pass' : 'fail'}">${rl >= 4.5 ? TICK : CROSS} ${fmtRatio(rl)}:1 on white</p></div>
      <div><span class="eyebrow">Dark mode (inverse)</span><p><i class="sq" style="background:${dark.hex}"></i> <b>${dark.step}</b> ${dark.hex.toUpperCase()}</p><p class="${rd >= 4.5 ? 'pass' : 'fail'}">${rd >= 4.5 ? TICK : CROSS} ${fmtRatio(rd)}:1 on ${DARK_BG}</p></div></div></li>` }).join('')}</ul>
    <div class="row"><button class="btn" data-act="copyhuecss" type="button">Copy CSS variables (light and dark)</button></div>${addRow('rz-hsys', 'Add light-mode colors to design system')}<p class="note">Design systems store one color per role, so the light-mode shades are added. Copy the CSS variables to get the dark-mode shades too.</p>`;
  }
  el.innerHTML = h; upgradeSelects(el); saveRz();

  /* ----- events ----- */
  $$('[data-view]', el).forEach(b => b.onclick = () => { RZ.view = b.dataset.view; rerender('[data-view="' + RZ.view + '"]') });
  $$('[data-mode]', el).forEach(b => b.onclick = () => { RZ.mode = b.dataset.mode; rerender('[data-mode="' + RZ.mode + '"]') });
  $$('[data-theme]', el).forEach(b => b.onclick = () => { if (RZ.theme === b.dataset.theme) return; RZ.theme = b.dataset.theme; RZ.hist.push({ mode: 'system', s: JSON.stringify(RZ.sys) }); genSystem(RZ.sys, RZ.theme); rerender('[data-theme="' + RZ.theme + '"]') });
  const act = (a, fn) => $$('[data-act="' + a + '"]', el).forEach(b => b.onclick = fn);
  act('random', () => { RZ.hist.push({ mode: RZ.mode, s: JSON.stringify(list) }); if (RZ.hist.length > 30) RZ.hist.shift(); sys ? genSystem(list, RZ.theme) : genRandom(list); if (list.every(c => c.locked)) toast('Every color is locked. Unlock one to randomize.'); rerender('[data-act="random"]') });
  act('undo', () => { const x = RZ.hist.pop(); if (!x) return; if (x.mode === 'system') RZ.sys = JSON.parse(x.s); else RZ.rand = JSON.parse(x.s); RZ.mode = x.mode; rerender('[data-act="random"]') });
  /* Adding a color should not change the others, so generate only the new one. */
  act('add', () => { const r = $('#rz-role', el).value, c = mkc(r, r === 'Other' ? 'Other ' + (list.filter(x => x.role === 'Other').length + 1) : r), others = list.map(x => x.locked); list.forEach(x => x.locked = true); list.push(c); genSystem(list, RZ.theme); list.forEach((x, i) => { if (i < others.length) x.locked = others[i] }); sortRoles(list); rerender('[data-lock="' + c.id + '"]') });
  act('inc', () => { const c = mkc('Other', 'Color ' + (list.length + 1)), o = list.map(x => x.locked); list.forEach(x => x.locked = true); list.push(c); genRandom(list); list.forEach((x, i) => { if (i < o.length) x.locked = o[i] }); rerender('[data-act="inc"]') });
  act('dec', () => { const c = [...list].reverse().find(x => !x.locked) || list[list.length - 1]; list.splice(list.indexOf(c), 1); rerender('[data-act="dec"]') });
  $$('[data-lock]', el).forEach(b => b.onclick = () => { const c = list.find(x => x.id === b.dataset.lock); c.locked = !c.locked; rerender('[data-lock="' + c.id + '"]') });
  $$('[data-remove]', el).forEach(b => b.onclick = () => { if (list.length <= 1) return toast('Keep at least one color.'); const i = list.findIndex(x => x.id === b.dataset.remove); list.splice(i, 1); rerender(list[Math.min(i, list.length - 1)] ? '[data-remove="' + list[Math.min(i, list.length - 1)].id + '"]' : null) });
  $$('[data-copyhex]', el).forEach(b => b.onclick = () => { const c = list.find(x => x.id === b.dataset.copyhex); copy(c.hex.toUpperCase(), c.name + ' ' + c.hex.toUpperCase()) });
  $$('input[data-edit]', el).forEach(i => {
    const c = list.find(x => x.id === i.dataset.edit), card = i.closest('.rz-card');
    i.oninput = () => { c.hex = i.value.toLowerCase(); const sw = $('.rz-sw', card); sw.style.background = c.hex; sw.style.color = inkOn(c.hex); $('span', sw).textContent = c.hex.toUpperCase() };
    i.onchange = () => { c.hex = i.value.toLowerCase(); c.locked = true; rerender('[data-edit="' + c.id + '"]') };
  });
  act('copycss', () => copy(':root {\n' + list.map((c, k) => `  --color-${sys ? kebab(c.role) + (list.filter(x => x.role === c.role).length > 1 ? '-' + (list.filter(x => x.role === c.role).indexOf(c) + 1) : '') : k + 1}: ${c.hex};`).join('\n') + '\n}', 'CSS variables'));
  act('copyhex', () => copy(list.map(c => c.hex.toUpperCase()).join('\n'), 'hex codes'));
  act('rz-sys-go', async () => { const s = await addColorsToSystem($('#rz-sys', el), list.map(c => ({ role: sys ? c.role : 'Other', name: sys ? c.name : c.name, hex: c.hex })), 'Color randomizer'); if (s) { rerender(); const m = $('#rz-sys-msg', el); m.innerHTML = `${CHECK} Added to ${esc(s.name)}. <a href="#/systems">Open it</a>` } });
  /* hues */
  $$('[data-hue]', el).forEach(b => b.onclick = () => {
    const n = b.dataset.hue, i = RZ.hues.findIndex(x => x.hue === n);
    if (i >= 0) RZ.hues.splice(i, 1); else { if (RZ.hues.length >= HUE_LIMITS.hues.max) return; const used = RZ.hues.map(x => x.role); RZ.hues.push({ hue: n, role: ['Primary', 'Secondary', 'Accent', 'Tertiary', 'Info', 'Success', 'Warning', 'Danger'].find(r => !used.includes(r)) || 'Accent' }) }
    rerender('[data-hue="' + n + '"]');
  });
  $$('select[data-huerole]', el).forEach(s => s.addEventListener('change', () => { RZ.hues[+s.dataset.huerole].role = s.value; const i = s.dataset.huerole; rerender('[data-huerole="' + i + '"]') }));
  $$('[data-huedel]', el).forEach(b => b.onclick = () => { RZ.hues.splice(+b.dataset.huedel, 1); rerender('[data-hue]') });
  act('copyhuecss', () => { const rows = RZ.hues.map(x => ({ n: kebab(x.role) + '-' + kebab(x.hue), ...hueShades(hueDeg(x.hue)) })); copy(':root {\n' + rows.map(r => `  --color-${r.n}: ${r.light.hex};`).join('\n') + '\n}\n@media (prefers-color-scheme: dark) {\n  :root {\n' + rows.map(r => `    --color-${r.n}: ${r.dark.hex};`).join('\n') + '\n  }\n}', 'CSS variables') });
  act('rz-hsys-go', async () => { const s = await addColorsToSystem($('#rz-hsys', el), RZ.hues.map(x => ({ role: x.role, name: x.role, hex: hueShades(hueDeg(x.hue)).light.hex })), 'Color randomizer hues'); if (s) { rerender(); const m = $('#rz-hsys-msg', el); m.innerHTML = `${CHECK} Added to ${esc(s.name)}. <a href="#/systems">Open it</a>` } });
}
const sortRoles = list => { const idx = r => { const i = ROLES.indexOf(r); return i < 0 ? 999 : i }; list.sort((a, b) => idx(a.role) - idx(b.role)) };
