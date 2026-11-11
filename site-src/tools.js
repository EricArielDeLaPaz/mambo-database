/* ===== Tools: contrast checker and color randomizer ===== */
const TOOLS = [['contrast', 'Contrast checker', 'Check two colors against WCAG, same math as WebAIM.'], ['randomizer', 'Color randomizer', 'Random palettes and hues for light and dark themes.']];
const h2x = (h, s, l) => { h = ((h % 360) + 360) % 360; s = Math.max(0, Math.min(1, s)); l = Math.max(0, Math.min(1, l)); const a = s * Math.min(l, 1 - l), f = n => { const k = (n + h / 30) % 12; return Math.round(255 * (l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1)))) }; return '#' + [f(0), f(8), f(4)].map(v => v.toString(16).padStart(2, '0')).join('') };
const rnd = (a, b) => a + Math.random() * (b - a);
const pick = a => a[Math.floor(Math.random() * a.length)];
const inkOn = bg => ratio('#000000', bg) >= ratio('#ffffff', bg) ? '#000000' : '#ffffff';
const TICK = '<span aria-hidden="true">✓</span>', CROSS = '<span aria-hidden="true">✕</span>';

function renderTools() {
  const id = TOOLS.some(t => t[0] === route().id) ? route().id : 'contrast', cur = TOOLS.find(t => t[0] === id);
  $('#app').innerHTML = `<div class="layout" id="tlay"><aside id="tside" aria-label="Tools"><p class="wordmark"><img src="mambo.png" alt="">Mambo Database</p>
  <fieldset><legend class="eyebrow">Tool</legend>${TOOLS.map(t => `<label class="chk radio"><input type="radio" name="tool" value="${t[0]}" ${t[0] === id ? 'checked' : ''}><span><b>${t[1]}</b><small>${t[2]}</small></span></label>`).join('')}</fieldset>
  <p class="note">More tools will be added here.</p></aside>
  <main id="main" tabindex="-1" class="toolwrap"><div class="dbhead"><div><p class="eyebrow">Tools</p><h1>${cur[1]}</h1></div></div><div id="toolbody"></div></main></div>`;
  document.title = cur[1] + ' · Mambo Database';
  $$('input[name=tool]', $('#tside')).forEach(r => r.onchange = () => go('#/tools/' + r.value));
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
const RZ_KEY = 'mambo-database.tools.v2', DARK_BG = '#121212', LIGHT_BG = '#ffffff';
const SYS_DEFAULT = ['Primary', 'Secondary', 'Accent', 'Background', 'Surface', 'Border', 'Text', 'Text secondary', 'Success', 'Warning', 'Danger', 'Info'];
const HUES = [['Red', 0], ['Orange', 24], ['Amber', 40], ['Yellow', 52], ['Lime', 84], ['Green', 142], ['Teal', 174], ['Cyan', 193], ['Blue', 217], ['Indigo', 240], ['Purple', 272], ['Pink', 330]];
const ROLE_USE = { Primary: 'Main buttons, links and selected states.', Secondary: 'Supporting actions, tags and secondary buttons.', Tertiary: 'A rare third brand color for charts and illustrations.', Accent: 'Small highlights: badges, new labels and call-outs.', Success: 'Confirmations, completed steps and positive trends.', Warning: 'Cautions the person can still act on.', Danger: 'Errors, destructive actions and failed states.', Info: 'Tips, help and neutral status messages.', Link: 'Inline text links.', Highlight: 'Marking or highlighting text.', Other: 'A color you decide the job for.' };
const HUE_LIMITS = { min: 3, rec: 7, max: 8 };
const STEPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900], STEP_L = [.96, .9, .8, .7, .6, .5, .42, .34, .26, .18];
const THEME_NAME = { light: 'Light', dark: 'Dark' };
let RZ = null;

const fx = (fg, bg, t) => ratio(fg, bg) >= t ? fg : fixFg(fg, bg, t);
const mkc = (role, name) => ({ id: uid(), role, name: name || role, hex: '#000000', dk: '#000000', locked: false, dkLock: false });
const rzList = () => RZ.mode === 'system' ? RZ.sys : RZ.rand;
const themesOn = () => ['light', 'dark'].filter(t => RZ.themes[t]);
const val = (c, t) => t === 'dark' ? c.dk : c.hex;
const bgFor = (list, t) => { if (RZ.mode !== 'system') return t === 'dark' ? DARK_BG : LIGHT_BG; const b = list.find(c => c.role === 'Background'); return b ? val(b, t) : (t === 'dark' ? DARK_BG : LIGHT_BG) };
const isChromatic = c => RZ.mode !== 'system' || !NEUTRAL.includes(c.role);
const famOf = hex => { const q = hsl(hex); let best = HUES[0], bd = 999; HUES.forEach(h => { const d = Math.min(Math.abs(q.h - h[1]), 360 - Math.abs(q.h - h[1])); if (d < bd) { bd = d; best = h } }); return best[0] };
const kebab = s => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

function saveRz() { try { localStorage.setItem(RZ_KEY, JSON.stringify({ mode: RZ.mode, themes: RZ.themes, rand: RZ.rand, sys: RZ.sys })) } catch { } }
function rzInit() {
  if (RZ) return;
  let d = null; try { d = JSON.parse(localStorage.getItem(RZ_KEY)) } catch { }
  const ok = d && Array.isArray(d.sys) && Array.isArray(d.rand);
  RZ = { mode: ok && d.mode === 'random' ? 'random' : 'system', themes: ok && d.themes && (d.themes.light || d.themes.dark) ? { light: !!d.themes.light, dark: !!d.themes.dark } : { light: true, dark: false }, rand: ok ? d.rand.filter(c => normHex(c.hex)) : [], sys: ok ? d.sys.filter(c => normHex(c.hex) && ROLES.includes(c.role)) : [], hist: [] };
  if (!RZ.sys.length) { RZ.sys = SYS_DEFAULT.map(r => mkc(r)); genSystem(RZ.sys) }
  if (!RZ.rand.length) { RZ.rand = [1, 2, 3, 4, 5].map(i => mkc('Other', 'Color ' + i)); genRandom(RZ.rand) }
  deriveDark(RZ.sys, true); deriveDark(RZ.rand, false);
}

/* Completely random: spread hues around the wheel so the colors differ from each other. */
function genRandom(list) {
  const base = rnd(0, 360); let i = 0;
  list.forEach(c => { if (c.locked) return; c.hex = h2x(base + i * 137.5 + rnd(-15, 15), rnd(.45, .9), rnd(.3, .75)); i++ });
}
/* Light theme first. Each role gets a color that fits its job; text-like roles are nudged until they pass WCAG AA on the Background. */
function genSystem(list) {
  const by = r => list.find(c => c.role === r), lk = r => { const c = by(r); return c && c.locked };
  const anchor = ['Primary', 'Secondary', 'Accent', 'Tertiary'].map(by).find(c => c && c.locked);
  const h0 = anchor ? hsl(anchor.hex).h : rnd(0, 360);
  const bg = lk('Background') ? by('Background').hex : (Math.random() < .4 ? '#ffffff' : h2x(h0, rnd(.15, .5), rnd(.965, .99)));
  const gen = {
    'Background': () => bg, 'Surface': () => h2x(h0, .2, .95), 'Surface variant': () => h2x(h0, .2, .91), 'Overlay': () => h2x(h0, .3, .08),
    'Neutral': () => h2x(h0, .08, .5), 'Border': () => fx(h2x(h0, .1, .6), bg, 3), 'Text': () => fx(h2x(h0, .2, .08), bg, 7), 'Text secondary': () => fx(h2x(h0, .1, .35), bg, 4.5), 'Disabled': () => h2x(h0, .05, .7),
    'Primary': () => fx(h2x(h0, rnd(.6, .85), rnd(.4, .5)), bg, 4.5), 'Secondary': () => fx(h2x(h0 + pick([30, -30, 150, 180, 210]), rnd(.45, .75), rnd(.35, .5)), bg, 4.5),
    'Tertiary': () => fx(h2x(h0 + pick([120, 240, -120]), rnd(.45, .75), rnd(.35, .5)), bg, 4.5), 'Accent': () => fx(h2x(h0 + pick([150, 180, 210]), rnd(.7, .95), rnd(.45, .55)), bg, 4.5),
    'Success': () => fx(h2x(rnd(135, 155), rnd(.6, .75), rnd(.3, .4)), bg, 4.5), 'Warning': () => fx(h2x(rnd(28, 40), .85, rnd(.35, .45)), bg, 4.5), 'Danger': () => fx(h2x(pick([354, 358, 2, 6]), rnd(.65, .8), rnd(.4, .48)), bg, 4.5), 'Info': () => fx(h2x(rnd(200, 215), rnd(.7, .85), rnd(.35, .45)), bg, 4.5),
    'Link': () => fx(h2x(h0, .75, .45), bg, 4.5), 'Highlight': () => h2x(rnd(45, 55), .9, .85), 'Other': () => fx(h2x(rnd(0, 360), rnd(.45, .85), rnd(.35, .55)), bg, 3)
  };
  list.forEach(c => { if (!c.locked) c.hex = (gen[c.role] || gen.Other)() });
  const inv = by('Inverse text'), pr = by('Primary'); if (inv && !inv.locked) inv.hex = inkOn(pr ? pr.hex : bg);
}
/* Dark theme: the opposite of each light color, kept accessible. Backgrounds flip dark, text flips light, and brand and feedback colors keep their hue but get lighter only as much as the contrast needs. */
function deriveDark(list, sys) {
  const bgI = sys && list.find(c => c.role === 'Background'); let bgd = DARK_BG;
  if (bgI) { if (!bgI.dkLock) { const q = hsl(bgI.hex); bgI.dk = h2x(q.h, Math.min(q.s, .25) * .8, .09) } bgd = bgI.dk }
  list.forEach(c => {
    if (c === bgI || c.dkLock) return; const q = hsl(c.hex), t = Math.min(q.s, .2), r = c.role;
    c.dk = !sys ? fx(c.hex, bgd, 4.5) : r === 'Surface' ? h2x(q.h, Math.min(q.s, .25) * .8, .13) : r === 'Surface variant' ? h2x(q.h, Math.min(q.s, .25) * .8, .18) : r === 'Overlay' ? h2x(q.h, .3, .04) : r === 'Neutral' ? c.hex : r === 'Border' ? fx(h2x(q.h, t, .4), bgd, 3) : r === 'Text' ? fx(h2x(q.h, t, .95), bgd, 7) : r === 'Text secondary' ? fx(h2x(q.h, t, .75), bgd, 4.5) : r === 'Disabled' ? h2x(q.h, Math.min(q.s, .1), .35) : r === 'Highlight' ? h2x(q.h, q.s, .35) : r === 'Inverse text' ? c.dk : fx(c.hex, bgd, 4.5);
  });
  const inv = list.find(c => c.role === 'Inverse text'), pr = list.find(c => c.role === 'Primary'); if (sys && inv && !inv.dkLock) inv.dk = inkOn(pr ? pr.dk : bgd);
}

/* ---------- limits, shown the same way as in Design Systems ---------- */
function limitRows(rows) {
  return `<ul class="lim">${rows.map(([label, n, L]) => { const rec = L.rec || L.max, st = n < L.min ? ['bad', 'Below the minimum'] : n > L.max ? ['bad', 'Over the maximum'] : n > rec ? ['warn', 'Above recommended'] : ['ok', 'In the healthy range']; return `<li class="${st[0]}"><b>${label}</b><span class="n">${n}</span><span class="r">min ${L.min} · recommended up to ${rec} · max ${L.max}</span><em>${st[0] === 'ok' ? TICK : '<span aria-hidden="true">!</span>'} ${st[1]}</em></li>` }).join('')}</ul>`;
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
const sortRoles = list => { const idx = r => { const i = ROLES.indexOf(r); return i < 0 ? 999 : i }; list.sort((a, b) => idx(a.role) - idx(b.role)) };

function renderRandomizer(el) {
  rzInit();
  const rerender = f => { renderRandomizer(el); if (f) { const t = $(f, el); if (t) t.focus() } };
  const list = rzList(), sys = RZ.mode === 'system', TH = sys ? themesOn() : ['light'], both = TH.length > 1;
  const snap = () => { RZ.hist.push({ mode: RZ.mode, s: JSON.stringify(list) }); if (RZ.hist.length > 30) RZ.hist.shift() };
  const seg = (name, v, opts) => `<div class="seg" role="radiogroup" aria-label="${name}">${opts.map(([k, l]) => `<button type="button" role="radio" aria-checked="${v === k}" data-${name.toLowerCase()}="${k}">${l}</button>`).join('')}</div>`;
  const chromatic = list.filter(isChromatic), fams = [...new Set(chromatic.map(c => famOf(c.hex)))];
  let h = `<p class="lede">Randomize a palette, lock the colors you like, and keep going until it feels right. Locked colors stay put. The hues below always come from the palette you just made. Everything is saved in this browser.</p>
  <div class="rz-top"><div><span class="f-t">Output</span>${seg('Mode', RZ.mode, [['system', 'For a design system'], ['random', 'Completely random']])}</div>
  ${sys ? `<fieldset class="themes"><legend class="f-t">Theme</legend><label class="chk"><input type="checkbox" data-theme="light" ${RZ.themes.light ? 'checked' : ''}> Light</label><label class="chk"><input type="checkbox" data-theme="dark" ${RZ.themes.dark ? 'checked' : ''}> Dark</label></fieldset>` : ''}
  <div class="rz-go"><button class="btn solid big" data-act="random" type="button">Randomize</button><button class="btn" data-act="undo" type="button" ${RZ.hist.length ? '' : 'disabled'}>Undo</button></div></div>
  <p class="note">${sys ? 'Each role gets a color that fits its job, and text-like roles are adjusted to pass WCAG AA on the Background. Tick Light, Dark or both: the dark version of each color is the accessible opposite of the light one (a white Background becomes near-black). Lock a Primary, Secondary or Accent and the rest will match its hue.' : 'Every color is random and spread around the color wheel. Roles are not assigned, so they are added to a design system as Other.'} The randomizer follows simple color rules; it is not an AI model.</p>`;
  h += `<h2 class="h3">Palette</h2>`;
  h += sys ? limitRows([['Brand colors', cnt(list, BRAND), LIMITS.brand], ['Neutrals', cnt(list, NEUTRAL), LIMITS.neutral], ['Feedback colors', cnt(list, FEEDBACK), LIMITS.feedback], ['All colors', list.length, LIMITS.colors]]) : `<p class="note"><b>${list.length} colors.</b> Minimum 2, maximum 12. Design systems usually settle on 6 to 16 colors in total (recommended up to ${LIMITS.colors.rec}).</p>`;
  h += `<ul class="rz-grid ${both ? 'two' : ''}" aria-label="Palette">${list.map(c => {
    const checkR = sys && c.role !== 'Background' && [...BRAND, ...FEEDBACK, 'Text', 'Text secondary', 'Link', 'Border'].includes(c.role), need = c.role === 'Border' ? 3 : 4.5;
    return `<li class="rz-card" data-id="${c.id}"><div class="rz-sws">${TH.map(t => { const v = val(c, t); return `<div class="rz-sw" data-th="${t}" style="background:${esc(v)};color:${inkOn(v)}"><b>${esc(c.name)}</b><span>${esc(v.toUpperCase())}</span>${sys ? `<small>${THEME_NAME[t]}</small>` : ''}${c.locked && t === TH[0] ? '<em>Locked</em>' : ''}</div>` }).join('')}</div>
    ${TH.map(t => { if (!checkR) return ''; const r = ratio(val(c, t), bgFor(list, t)); return `<p class="rz-r ${r >= need ? 'pass' : 'fail'}">${r >= need ? TICK : CROSS} ${fmtRatio(r)}:1${both ? ' ' + THEME_NAME[t] : ''} on Background${r >= need ? '' : ' (needs ' + need + ':1)'}</p>` }).join('') || '<p class="rz-r"> </p>'}
    <div class="rz-bar"><button type="button" class="ib" data-lock="${c.id}" aria-pressed="${c.locked}" aria-label="Lock ${esc(c.name)}" title="${c.locked ? 'Unlock' : 'Lock'}">${c.locked ? '🔒' : '🔓'}</button>${TH.map(t => `<button type="button" class="ib" data-copyhex="${c.id}" data-th="${t}" aria-label="Copy ${esc(c.name)} ${both ? THEME_NAME[t].toLowerCase() + ' ' : ''}hex code">Copy${both ? ' ' + THEME_NAME[t][0] : ''}</button>`).join('')}${TH.map(t => `<label class="ib pick" title="Edit color"><span class="sr">Edit ${esc(c.name)} ${both ? THEME_NAME[t].toLowerCase() : ''} color</span><input type="color" data-edit="${c.id}" data-th="${t}" value="${esc(val(c, t))}"><span aria-hidden="true">Edit${both ? ' ' + THEME_NAME[t][0] : ''}</span></label>`).join('')}<button type="button" class="ib" data-remove="${c.id}" aria-label="Remove ${esc(c.name)}" title="Remove">✕</button></div></li>`;
  }).join('')}</ul>`;
  if (sys) {
    const avail = ROLES.filter(r => (r === 'Other' || !list.some(c => c.role === r)) && !(BRAND.includes(r) && cnt(list, BRAND) >= LIMITS.brand.max) && !(NEUTRAL.includes(r) && cnt(list, NEUTRAL) >= LIMITS.neutral.max) && !(FEEDBACK.includes(r) && cnt(list, FEEDBACK) >= LIMITS.feedback.max));
    h += `<div class="row rz-add">${list.length < LIMITS.colors.max && avail.length ? `<label class="f"><span class="f-t">Add another color</span><select id="rz-role">${avail.map(r => `<option>${r}</option>`).join('')}</select></label><button class="btn" data-act="add" type="button">Add color</button>` : `<p class="note" role="status">${list.length >= LIMITS.colors.max ? `You have reached the maximum of ${LIMITS.colors.max} colors.` : 'Every role that fits is already in the palette.'} Remove one to add another.</p>`}</div>`;
  } else h += `<div class="row rz-add"><button class="btn" data-act="dec" type="button" ${list.length <= 2 ? 'disabled' : ''}>Fewer colors</button><button class="btn" data-act="inc" type="button" ${list.length >= 12 ? 'disabled' : ''}>More colors</button><span class="note">Minimum 2, maximum 12.</span></div>`;
  h += `<div class="row"><button class="btn" data-act="copycss" type="button">Copy CSS variables</button><button class="btn" data-act="copyhex" type="button">Copy hex codes${both ? ' (Light)' : ''}</button></div>
  <div class="panel addrow"><h2 style="font-size:16px;margin:0 0 8px">Add to a design system</h2><div class="row" style="margin:0;align-items:end"><label class="f" style="min-width:220px"><span class="f-t">Design system</span><select id="rz-sys">${sysOptions()}</select></label><button class="btn solid" data-act="rz-sys-go" type="button">Add to design system</button><span class="empty" id="rz-sys-msg" role="status"></span></div>${sys ? `<p class="note" style="margin:8px 0 0">Design systems store one color per role, so ${both ? 'the Light colors are' : TH[0] === 'dark' ? 'the Dark colors are' : 'these colors are'} added. Copy the CSS variables to get ${both ? 'both themes' : 'the code'}.</p>` : ''}</div>`;

  /* ----- hues of this palette ----- */
  h += `<h2 class="h3">Hues of this palette</h2><p class="note">A hue is a color family, like red or blue. These are the families your palette uses. Each color shows its shade scale with the closest shade to ${sys ? 'its light and dark versions' : 'its light and dark versions'} marked, so you can see what it is for and what replaces it in the other theme. Click a hue below to add that family to the palette, or click a used one to remove it.</p>
  <div class="huegrid" role="group" aria-label="Hues">${HUES.map(([n, d]) => { const on = fams.includes(n), full = !on && fams.length >= HUE_LIMITS.max; return `<button type="button" class="huechip" data-hue="${n}" aria-pressed="${on}" ${full ? 'disabled' : ''}><i style="background:${h2x(d, .75, .5)}"></i>${n}</button>` }).join('')}</div>
  ${limitRows([['Hues in use', fams.length, HUE_LIMITS]])}<p class="note">Guidance from published design-system writing (<a href="https://www.uxpin.com/studio/blog/choose-color-pallete/" target="_blank" rel="noopener">UXPin</a> suggests 5 to 7 base hues). Fewer than 3 leaves no room for brand plus success and danger. These are sensible limits, not rules.</p>
  <ul class="hue-list">${chromatic.map(c => {
    const q = hsl(c.hex), qd = hsl(c.dk), s0 = Math.max(.35, Math.min(.9, q.s)), sc = STEPS.map((st, i) => ({ step: st, hex: h2x(q.h, s0, STEP_L[i]) })), near = l => sc.reduce((a, b) => Math.abs(STEP_L[STEPS.indexOf(b.step)] - l) < Math.abs(STEP_L[STEPS.indexOf(a.step)] - l) ? b : a), L = near(q.l), D = near(qd.l), fam = famOf(c.hex);
    const rows = (sys ? themesOn() : ['light', 'dark']).map(t => { const v = val(c, t), r = ratio(v, bgFor(list, t)); return `<div><span class="eyebrow">${THEME_NAME[t]} mode${t === 'dark' ? ' (inverse)' : ''}</span><p><i class="sq" style="background:${esc(v)}"></i> ${esc(v.toUpperCase())} · closest shade <b>${(t === 'dark' ? D : L).step}</b></p><p class="${r >= 3 ? 'pass' : 'fail'}">${r >= 4.5 ? TICK : r >= 3 ? '<span aria-hidden="true">~</span>' : CROSS} ${fmtRatio(r)}:1 on ${sys ? 'Background' : t === 'dark' ? DARK_BG : 'white'}${r >= 4.5 ? '' : r >= 3 ? ' (large text and UI only)' : ' (too low)'}</p></div>` }).join('');
    return `<li class="hue-card"><div class="hue-head"><i class="dot" style="background:${esc(c.hex)}"></i><h3>${fam}</h3><span class="tag">${esc(c.name)}</span>${sys ? `<label class="f"><span class="sr">Role for ${esc(c.name)}</span><select data-huerole="${c.id}" aria-label="Role for ${esc(c.name)}">${ROLES.filter(r => !NEUTRAL.includes(r)).map(r => `<option ${r === c.role ? 'selected' : ''}>${r}</option>`).join('')}</select></label>` : ''}</div>
    ${sys ? `<p class="note" style="margin:6px 0">${esc(c.role)}: ${ROLE_USE[c.role] || ''}${FEEDBACK.includes(c.role) ? ' Pair it with an icon or text, never color alone.' : ''}</p>` : ''}
    <div class="scale" role="img" aria-label="${fam} shades from 50 to 900. Light mode is closest to ${L.step}, dark mode is closest to ${D.step}.">${sc.map(x => `<div style="background:${x.hex};color:${inkOn(x.hex)}"><span>${x.step}</span>${x.step === L.step && (!sys || RZ.themes.light) ? '<b>Light</b>' : ''}${x.step === D.step && (!sys || RZ.themes.dark) ? '<b>Dark</b>' : ''}</div>`).join('')}</div><div class="modes">${rows}</div></li>`
  }).join('') || '<li class="note">This palette has no colored roles yet.</li>'}</ul>
  <div class="row"><button class="btn" data-act="copyhuecss" type="button">Copy hue scales as CSS variables</button></div>`;
  el.innerHTML = h; upgradeSelects(el); saveRz();

  /* ----- events ----- */
  $$('[data-mode]', el).forEach(b => b.onclick = () => { RZ.mode = b.dataset.mode; rerender('[data-mode="' + RZ.mode + '"]') });
  $$('input[data-theme]', el).forEach(i => i.onchange = () => { RZ.themes[i.dataset.theme] = i.checked; if (!RZ.themes.light && !RZ.themes.dark) { RZ.themes[i.dataset.theme] = true; toast('Keep at least one theme ticked.') } rerender('[data-theme="' + i.dataset.theme + '"]') });
  const act = (a, fn) => $$('[data-act="' + a + '"]', el).forEach(b => b.onclick = fn);
  act('random', () => { snap(); sys ? genSystem(list) : genRandom(list); deriveDark(list, sys); if (list.every(c => c.locked)) toast('Every color is locked. Unlock one to randomize.'); rerender('[data-act="random"]') });
  act('undo', () => { const x = RZ.hist.pop(); if (!x) return; if (x.mode === 'system') RZ.sys = JSON.parse(x.s); else RZ.rand = JSON.parse(x.s); RZ.mode = x.mode; rerender('[data-act="random"]') });
  /* Adding a color should not change the others, so lock them while the new one is generated. */
  const addOne = c => { snap(); const o = list.map(x => x.locked); list.forEach(x => x.locked = true); list.push(c); sys ? genSystem(list) : genRandom(list); list.forEach((x, i) => { if (i < o.length) x.locked = o[i] }); if (sys) sortRoles(list); deriveDark(list, sys) };
  act('add', () => { const r = $('#rz-role', el).value; const c = mkc(r, r === 'Other' ? 'Other ' + (list.filter(x => x.role === 'Other').length + 1) : r); addOne(c); rerender('[data-lock="' + c.id + '"]') });
  act('inc', () => { const c = mkc('Other', 'Color ' + (list.length + 1)); addOne(c); rerender('[data-act="inc"]') });
  act('dec', () => { snap(); const c = [...list].reverse().find(x => !x.locked) || list[list.length - 1]; list.splice(list.indexOf(c), 1); rerender('[data-act="dec"]') });
  $$('[data-lock]', el).forEach(b => b.onclick = () => { const c = list.find(x => x.id === b.dataset.lock); c.locked = !c.locked; if (!c.locked) { c.dkLock = false; deriveDark(list, sys) } rerender('[data-lock="' + c.id + '"]') });
  $$('[data-remove]', el).forEach(b => b.onclick = () => { if (list.length <= 1) return toast('Keep at least one color.'); snap(); const i = list.findIndex(x => x.id === b.dataset.remove); list.splice(i, 1); deriveDark(list, sys); const n = list[Math.min(i, list.length - 1)]; rerender(n ? '[data-remove="' + n.id + '"]' : null) });
  $$('[data-copyhex]', el).forEach(b => b.onclick = () => { const c = list.find(x => x.id === b.dataset.copyhex), v = val(c, b.dataset.th); copy(v.toUpperCase(), c.name + ' ' + v.toUpperCase()) });
  $$('input[data-edit]', el).forEach(i => {
    const c = list.find(x => x.id === i.dataset.edit), t = i.dataset.th, sw = $('.rz-sw[data-th="' + t + '"]', i.closest('.rz-card'));
    i.oninput = () => { sw.style.background = i.value; sw.style.color = inkOn(i.value); $('span', sw).textContent = i.value.toUpperCase() };
    i.onchange = () => { if (t === 'dark') { c.dk = i.value.toLowerCase(); c.dkLock = true } else { c.hex = i.value.toLowerCase(); deriveDark(list, sys) } c.locked = true; rerender('[data-edit="' + c.id + '"][data-th="' + t + '"]') };
  });
  const nameOf = (c, k) => sys ? kebab(c.role) + (list.filter(x => x.role === c.role).length > 1 ? '-' + (list.filter(x => x.role === c.role).indexOf(c) + 1) : '') : String(k + 1);
  act('copycss', () => { const one = t => list.map((c, k) => `--color-${nameOf(c, k)}: ${val(c, t)};`); copy(TH.length === 2 ? ':root {\n  ' + one('light').join('\n  ') + '\n}\n@media (prefers-color-scheme: dark) {\n  :root {\n    ' + one('dark').join('\n    ') + '\n  }\n}' : ':root {\n  ' + one(TH[0]).join('\n  ') + '\n}', 'CSS variables') });
  act('copyhex', () => copy(list.map(c => val(c, TH[0]).toUpperCase()).join('\n'), 'hex codes'));
  act('rz-sys-go', async () => { const s = await addColorsToSystem($('#rz-sys', el), list.map(c => ({ role: sys ? c.role : 'Other', name: c.name, hex: val(c, TH[0]) })), 'Color randomizer'); if (s) { rerender(); $('#rz-sys-msg', el).innerHTML = `${CHECK} Added to ${esc(s.name)}. <a href="#/systems">Open it</a>` } });
  /* hues */
  $$('[data-hue]', el).forEach(b => b.onclick = () => {
    const n = b.dataset.hue, deg = HUES.find(x => x[0] === n)[1], same = chromatic.filter(c => famOf(c.hex) === n);
    if (same.length) { if (list.length <= 1) return; snap(); list.splice(list.indexOf(same[same.length - 1]), 1); deriveDark(list, sys); return rerender('[data-hue="' + n + '"]') }
    let c;
    if (sys) {
      const used = list.map(x => x.role), role = ['Primary', 'Secondary', 'Accent', 'Tertiary', 'Info', 'Success', 'Warning', 'Danger'].find(r => !used.includes(r) && !(BRAND.includes(r) && cnt(list, BRAND) >= LIMITS.brand.max) && !(FEEDBACK.includes(r) && cnt(list, FEEDBACK) >= LIMITS.feedback.max)) || 'Other';
      if (list.length >= LIMITS.colors.max) return toast('The palette is at its maximum of ' + LIMITS.colors.max + ' colors. Remove one first.');
      c = mkc(role, role === 'Other' ? 'Other ' + (list.filter(x => x.role === 'Other').length + 1) : role);
    } else { if (list.length >= 12) return toast('The palette is at its maximum of 12 colors.'); c = mkc('Other', 'Color ' + (list.length + 1)) }
    snap(); c.hex = fx(h2x(deg, .72, .45), bgFor(list, 'light'), 4.5); list.push(c); if (sys) sortRoles(list); deriveDark(list, sys); rerender('[data-hue="' + n + '"]');
  });
  $$('select[data-huerole]', el).forEach(s => s.addEventListener('change', () => { const c = list.find(x => x.id === s.dataset.huerole); snap(); c.role = s.value; c.name = s.value; sortRoles(list); deriveDark(list, sys); rerender('[data-huerole="' + c.id + '"]') }));
  act('copyhuecss', () => copy(':root {\n' + chromatic.map((c, k) => { const q = hsl(c.hex), s0 = Math.max(.35, Math.min(.9, q.s)), nm = sys ? kebab(c.role) : 'color-' + (k + 1); return STEPS.map((st, i) => `  --${nm}-${st}: ${h2x(q.h, s0, STEP_L[i])};`).join('\n') }).join('\n') + '\n}', 'hue scales'));
}
