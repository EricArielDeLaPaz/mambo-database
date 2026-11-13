/* ===== core: helpers, color maths, dropdown, dialogs, context menu, tooltips, zip ===== */
const DATA = /*__DATA__*/[];
const FONTS = /*__FONTS__*/[];
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const slug = s => String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'item';
const uid = () => Math.random().toString(36).slice(2, 9);
const CHEV = '<svg class="chev" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="6 9 12 15 18 9"/></svg>';
const CHEV_R = '<svg class="chev" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="transform:rotate(-90deg)"><polyline points="6 9 12 15 18 9"/></svg>';
const CHECK = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>';
const WRENCH = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>';
const DL = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3v12m0 0l-4-4m4 4l4-4M5 21h14"/></svg>';

function toast(m) { const t = $('#toast'); t.textContent = m; t.classList.add('on'); clearTimeout(toast.h); toast.h = setTimeout(() => t.classList.remove('on'), 2000); }
async function copy(text, label) { try { await navigator.clipboard.writeText(text); toast('Copied ' + label); return true } catch { toast('Copy blocked. Select the text and copy it manually.'); return false } }
function download(name, data, type = 'text/plain') { const a = document.createElement('a'); a.href = URL.createObjectURL(data instanceof Blob ? data : new Blob([data], { type })); a.download = name; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 1000) }

/* ---------- colour maths ---------- */
function normHex(h) { h = String(h).trim().replace(/^#/, ''); if (/^[0-9a-f]{3}$/i.test(h)) h = h.split('').map(c => c + c).join(''); return /^[0-9a-f]{6}$/i.test(h) ? '#' + h.toLowerCase() : null }
/* ---------- color formats (HEX, RGB, HSL, HSB, CMYK). The last choice is remembered; HEX the first time. ---------- */
const CFMT = ['HEX', 'RGB', 'HSL', 'HSB', 'CMYK'], CF_KEY = 'mambo-database.colorfmt';
let colorFmt = (() => { try { const v = localStorage.getItem(CF_KEY); return CFMT.includes(v) ? v : 'HEX' } catch { return 'HEX' } })();
const setColorFmt = f => { colorFmt = f; try { localStorage.setItem(CF_KEY, f) } catch { } };
const rgbOf = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
const rgbHex = (r, g, b) => '#' + [r, g, b].map(v => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0')).join('');
const hslHex = (h, s, l) => { h = ((h % 360) + 360) % 360; const a = s * Math.min(l, 1 - l), f = n => { const k = (n + h / 30) % 12; return 255 * (l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1))) }; return rgbHex(f(0), f(8), f(4)) };
function fmtColor(hex, f = colorFmt) {
  const h = normHex(hex) || '#000000', [r, g, b] = rgbOf(h), p = x => Math.round(x * 100);
  if (f === 'RGB') return `rgb(${r}, ${g}, ${b})`;
  if (f === 'HSL') { const q = hsl(h); return `hsl(${Math.round(q.h)}, ${p(q.s)}%, ${p(q.l)}%)` }
  if (f === 'HSB') { const mx = Math.max(r, g, b) / 255, mn = Math.min(r, g, b) / 255, q = hsl(h); return `hsb(${Math.round(q.h)}, ${p(mx ? (mx - mn) / mx : 0)}%, ${p(mx)}%)` }
  if (f === 'CMYK') { const k = 1 - Math.max(r, g, b) / 255, c = k === 1 ? 0 : (1 - r / 255 - k) / (1 - k), m = k === 1 ? 0 : (1 - g / 255 - k) / (1 - k), y = k === 1 ? 0 : (1 - b / 255 - k) / (1 - k); return `cmyk(${p(c)}%, ${p(m)}%, ${p(y)}%, ${p(k)}%)` }
  return h.toUpperCase();
}
/* Accepts a hex code, or rgb()/hsl()/hsb()/cmyk() with or without the function name (bare numbers use the chosen format). */
function parseColor(str) {
  str = String(str).trim(); const hx = normHex(str); if (hx) return hx;
  const nums = (str.match(/-?\d*\.?\d+/g) || []).map(Number), kind = (str.match(/^(rgb|hsl|hsb|hsv|cmyk)/i) || [, colorFmt])[1].toUpperCase().replace('HSV', 'HSB');
  if (kind === 'RGB' && nums.length >= 3 && nums.slice(0, 3).every(n => n >= 0 && n <= 255)) return rgbHex(...nums);
  if (kind === 'HSL' && nums.length >= 3 && nums[1] <= 100 && nums[2] <= 100) return hslHex(nums[0], nums[1] / 100, nums[2] / 100);
  if (kind === 'HSB' && nums.length >= 3 && nums[1] <= 100 && nums[2] <= 100) { const v = nums[2] / 100, sb = nums[1] / 100, l = v * (1 - sb / 2); return hslHex(nums[0], l === 0 || l === 1 ? 0 : (v - l) / Math.min(l, 1 - l), l) }
  if (kind === 'CMYK' && nums.length >= 4 && nums.slice(0, 4).every(n => n >= 0 && n <= 100)) { const [c, m, y, k] = nums.map(n => n / 100); return rgbHex(255 * (1 - c) * (1 - k), 255 * (1 - m) * (1 - k), 255 * (1 - y) * (1 - k)) }
  return null;
}
const COLOR_HINT = 'a hex code like #1d4ed8, or rgb(29, 78, 216), hsl(224, 76%, 48%), hsb(224, 87%, 85%) or cmyk(87%, 64%, 0%, 15%)';
const cfmtSelect = () => `<label class="f cfmt"><span class="f-t">Color format</span><select data-cfmt aria-label="Color format">${CFMT.map(f => `<option ${f === colorFmt ? 'selected' : ''}>${f}</option>`).join('')}</select></label>`;
const wireCfmt = (root, onChange) => $$('select[data-cfmt]', root).forEach(sel => sel.addEventListener('change', () => { setColorFmt(sel.value); $$('select[data-cfmt]').forEach(o => { if (o !== sel) { o.value = sel.value; o.dispatchEvent(new Event('sync')) } }); onChange && onChange() }));
function lum(h) { const c = [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16) / 255).map(v => v <= .03928 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4); return .2126 * c[0] + .7152 * c[1] + .0722 * c[2] }
/* WebAIM shows the ratio cut off (not rounded) at 2 decimals, so 4.496 reads 4.49 and fails, never 4.50 */
const fmtRatio = r => (Math.floor(r * 100 + 1e-9) / 100).toFixed(2);
const webaimUrl = (fg, bg) => 'https://webaim.org/resources/contrastchecker/?fcolor=' + String(fg).replace('#', '').toUpperCase() + '&bcolor=' + String(bg).replace('#', '').toUpperCase();
function ratio(a, b) { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + .05) / (y + .05) }
function hsl(h) { let [r, g, b] = [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16) / 255); const mx = Math.max(r, g, b), mn = Math.min(r, g, b), d = mx - mn; let H = 0; if (d) { H = mx === r ? ((g - b) / d) % 6 : mx === g ? (b - r) / d + 2 : (r - g) / d + 4; H = (H * 60 + 360) % 360 } const L = (mx + mn) / 2, S = d ? d / (1 - Math.abs(2 * L - 1)) : 0; return { h: H, s: S, l: L } }
const isRed = h => { const c = hsl(h); return c.s > .3 && (c.h < 22 || c.h > 335) };
const isGreen = h => { const c = hsl(h); return c.s > .25 && c.h > 85 && c.h < 165 };
function fixFg(fg, bg, target) {
  const { h, s, l } = hsl(fg), conv = (H, S, L) => { const a = S * Math.min(L, 1 - L), f = n => { const k = (n + H / 30) % 12; return Math.round(255 * (L - a * Math.max(-1, Math.min(k - 3, 9 - k, 1)))) }; return '#' + [f(0), f(8), f(4)].map(v => v.toString(16).padStart(2, '0')).join('') };
  let best = null; for (let d = 1; d <= 100; d++) { for (const dir of [-1, 1]) { const L = l + dir * d / 100; if (L < 0 || L > 1) continue; const c = conv(h, s, L); if (ratio(c, bg) >= target) { if (!best || Math.abs(L - l) < best.d) best = { hex: c, d: Math.abs(L - l) } } } if (best) break }
  return best ? best.hex : (ratio('#000000', bg) >= ratio('#ffffff', bg) ? '#000000' : '#ffffff')
}

/* ---------- constants ---------- */
const TYPE = { component: 'Component', color: 'Color', typeface: 'Typography', icon: 'Icon', profile: 'Profile', document: 'Document' };
const TYPE_PLURAL = { component: 'Components', color: 'Colors', typeface: 'Typography', icon: 'Icons', profile: 'Profiles', document: 'Documents' };
const ICON_SETS = /*__ICONSETS__*/[];
const PLAT = { 'desktop-web': 'Desktop website', 'desktop-app': 'Desktop app', tablet: 'Tablet', 'mobile-web': 'Mobile website', ios: 'iOS app', android: 'Android app' };
const POINTER = ['desktop-web', 'desktop-app'];
const INDUSTRIES = [['all', 'All'], ['finance', 'Finance & fintech'], ['insurance', 'Insurance'], ['legal', 'Legal'], ['healthcare', 'Healthcare'], ['wellness', 'Wellness & fitness'], ['education', 'Education'], ['retail', 'Retail & e-commerce'], ['food-beverage', 'Food & beverage'], ['hospitality', 'Travel & hospitality'], ['technology', 'Technology & SaaS'], ['data', 'Data & analytics'], ['entertainment', 'Entertainment'], ['gaming', 'Gaming'], ['creative', 'Creative & media'], ['media', 'Publishing & media'], ['nonprofit', 'Nonprofit'], ['sustainability', 'Sustainability'], ['agriculture', 'Agriculture']];
const indLabel = k => (INDUSTRIES.find(i => i[0] === k) || [k, k])[1];

/* ---------- custom dropdown (upgrades every <select>) ---------- */
let ddOpen = null;
function ddName(sel) {
  if (sel.getAttribute('aria-label')) return sel.getAttribute('aria-label');
  if (sel.id) { const l = document.querySelector('label[for="' + sel.id + '"]'); if (l) return l.textContent.trim() }
  const l = sel.closest('label'); if (l) { const t = [...l.childNodes].filter(n => n.nodeType === 3).map(n => n.textContent).join('').trim(); if (t) return t; const sp = l.querySelector('.f-t'); if (sp) return sp.textContent.trim() }
  return 'Choose an option';
}
function upgradeSelects(root = document) {
  $$('select:not([data-up])', root).forEach(sel => {
    sel.dataset.up = '1';
    const wrap = document.createElement('div'); wrap.className = 'dd';
    sel.parentNode.insertBefore(wrap, sel);
    const btn = document.createElement('button'); btn.type = 'button'; btn.className = 'dd-btn';
    btn.setAttribute('aria-haspopup', 'listbox'); btn.setAttribute('aria-expanded', 'false'); btn.setAttribute('aria-label', ddName(sel));
    const list = document.createElement('div'); list.className = 'dd-list'; list.setAttribute('role', 'listbox'); list.hidden = true; list.setAttribute('aria-label', ddName(sel));
    wrap.append(btn, list, sel);
    sel.classList.add('dd-native'); sel.tabIndex = -1; sel.setAttribute('aria-hidden', 'true');
    const sync = () => { const o = sel.options[sel.selectedIndex]; btn.innerHTML = `<span class="dd-val">${esc(o ? o.text : '')}</span>${CHEV}`; btn.disabled = sel.disabled; btn.setAttribute('aria-label', ddName(sel) + ': ' + (o ? o.text : '')) };
    sync(); sel.addEventListener('change', sync);
    const render = () => {
      list.innerHTML = ''; let n = 0;
      const add = o => { const d = document.createElement('div'); d.className = 'dd-opt'; d.setAttribute('role', 'option'); d.tabIndex = -1; d.dataset.i = o.index; d.id = 'dd' + uid(); d.setAttribute('aria-selected', o.selected); if (o.disabled) d.setAttribute('aria-disabled', 'true'); d.innerHTML = `<span>${esc(o.text)}</span>${o.selected ? CHECK : ''}`; list.appendChild(d); n++ };
      [...sel.children].forEach(ch => { if (ch.tagName === 'OPTGROUP') { const g = document.createElement('div'); g.className = 'dd-grp'; g.setAttribute('role', 'presentation'); g.textContent = ch.label; list.appendChild(g); [...ch.children].forEach(add) } else add(ch) });
    };
    const close = (focusBtn) => { list.hidden = true; btn.setAttribute('aria-expanded', 'false'); wrap.classList.remove('open'); if (ddOpen && ddOpen.wrap === wrap) ddOpen = null; if (focusBtn) btn.focus() };
    const open = () => {
      if (sel.disabled) return; if (ddOpen) ddOpen.close(); render(); list.hidden = false; btn.setAttribute('aria-expanded', 'true'); wrap.classList.add('open'); ddOpen = { wrap, close };
      list.classList.remove('up'); const r = list.getBoundingClientRect(); if (r.bottom > innerHeight - 8 && btn.getBoundingClientRect().top > r.height + 16) list.classList.add('up');
      (list.querySelector('[aria-selected=true]') || list.querySelector('.dd-opt:not([aria-disabled])'))?.focus();
    };
    const choose = o => { if (o.getAttribute('aria-disabled')) return; sel.selectedIndex = +o.dataset.i; sel.dispatchEvent(new Event('change', { bubbles: true })); close(true) };
    btn.addEventListener('click', () => list.hidden ? open() : close(true));
    btn.addEventListener('keydown', e => { if (['ArrowDown', 'ArrowUp'].includes(e.key)) { e.preventDefault(); open() } });
    list.addEventListener('click', e => { const o = e.target.closest('.dd-opt'); if (o) choose(o) });
    let buf = '', bt;
    list.addEventListener('keydown', e => {
      const opts = $$('.dd-opt:not([aria-disabled])', list), i = opts.indexOf(document.activeElement);
      if (e.key === 'ArrowDown') { e.preventDefault(); opts[Math.min(opts.length - 1, i + 1)].focus() }
      else if (e.key === 'ArrowUp') { e.preventDefault(); opts[Math.max(0, i - 1)].focus() }
      else if (e.key === 'Home') { e.preventDefault(); opts[0].focus() } else if (e.key === 'End') { e.preventDefault(); opts[opts.length - 1].focus() }
      else if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); if (i >= 0) choose(opts[i]) }
      else if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); close(true) }
      else if (e.key === 'Tab') close(false)
      else if (e.key.length === 1) { buf += e.key.toLowerCase(); clearTimeout(bt); bt = setTimeout(() => buf = '', 600); const m = opts.find(o => o.textContent.trim().toLowerCase().startsWith(buf)); if (m) m.focus() }
    });
    wrap._close = close;
  });
}
document.addEventListener('mousedown', e => { if (ddOpen && !ddOpen.wrap.contains(e.target)) ddOpen.close() });

/* ---------- modal dialogs (replace browser confirm / prompt) ---------- */
function openDialog(inner, cls = '') {
  const d = document.createElement('dialog'); d.className = 'mdl ' + cls; d.setAttribute('aria-labelledby', 'mdl-t'); d.innerHTML = inner; document.body.appendChild(d);
  const prev = document.activeElement; let done = false;
  const api = { el: d, close(v) { if (done) return; done = true; d.close(); d.remove(); prev && prev.focus && prev.focus(); api.res(v) } };
  api.p = new Promise(r => api.res = r);
  d.addEventListener('cancel', e => { e.preventDefault(); api.close(null) });
  d.addEventListener('mousedown', e => { if (e.target === d) api.close(null) });
  d.showModal(); return api;
}
function ask(o) {
  const api = openDialog(`<form class="mdl-f"><h2 id="mdl-t">${esc(o.title)}</h2>${o.body ? `<p>${esc(o.body)}</p>` : ''}${o.input ? `<label class="f"><span class="f-t">${esc(o.input.label)}</span><input type="text" id="mdl-in" maxlength="60" value="${esc(o.input.value || '')}"></label>` : ''}<div class="mdl-actions"><button class="btn" type="button" id="mdl-c">Cancel</button><button class="btn ${o.danger ? 'danger' : 'solid'}" type="submit" id="mdl-ok">${esc(o.confirm || 'OK')}</button></div></form>`);
  const d = api.el; $('#mdl-c', d).onclick = () => api.close(null);
  $('form', d).onsubmit = e => { e.preventDefault(); api.close(o.input ? ($('#mdl-in', d).value.trim() || null) : true) };
  (o.input ? $('#mdl-in', d) : (o.danger ? $('#mdl-c', d) : $('#mdl-ok', d))).focus(); if (o.input) $('#mdl-in', d).select();
  return api.p.then(v => o.input ? v : v === true);
}
function stepsDialog(o) {
  const api = openDialog(`<div class="mdl-f"><h2 id="mdl-t">${esc(o.title)}</h2>${o.intro ? `<p>${o.intro}</p>` : ''}<ol class="steps">${o.steps.map(s => `<li>${s}</li>`).join('')}</ol>${o.note ? `<p class="note">${o.note}</p>` : ''}<div class="mdl-actions">${o.link ? `<a class="btn" href="${esc(o.link[0])}" target="_blank" rel="noopener">${esc(o.link[1])}</a>` : ''}<button class="btn solid" id="mdl-ok" type="button">Got it</button></div></div>`, 'wide');
  $('#mdl-ok', api.el).onclick = () => api.close(true); $('#mdl-ok', api.el).focus(); return api.p;
}
const FIGMA_STEPS = {
  html: { title: 'Bring this into Figma', intro: 'Figma has no direct paste for web code, so use an importer plugin. These are the steps for <b>html.to.design</b>, a third-party plugin.', steps: ['Your code is <b>copied</b> (or downloaded). Keep it handy.', 'In Figma, open a design file, then open the <b>Plugins</b> menu and search for <b>html.to.design</b>. Run it.', 'Open the plugin\'s <b>Editor</b> tab.', 'Paste the HTML and CSS into the input area (Ctrl/Cmd + V).', 'Click <b>Create</b>. Your code becomes editable layers.'], note: 'Plugin menus and limits can change. See the plugin\'s own docs if a step looks different.', link: ['https://html.to.design/docs/code-tab', 'Open the plugin docs'] },
  tokens: { title: 'Bring these tokens into Figma', intro: 'Tokens are exported in the W3C design tokens format. Figma needs a plugin such as <b>Tokens Studio for Figma</b> to read them.', steps: ['Your tokens file is <b>downloaded</b> (or copied).', 'In Figma, open <b>Plugins</b> and run <b>Tokens Studio for Figma</b>.', 'Choose the option to <b>import or load tokens</b>, then paste the JSON or pick the file.', 'Apply the tokens. The plugin can also create Figma variables from them.', 'Install your fonts first (see below) so text styles resolve correctly.'], note: 'Menu names differ between plugin versions. Check the plugin\'s own help if needed.' },
  font: { title: 'Using a font that is not built into Figma', intro: 'Google Fonts are built into Figma. Other fonts must be on your computer first.', steps: ['<b>Download</b> the font file (TTF or OTF) from its source.', '<b>Install</b> it: Font Book on Mac, or the Fonts folder on Windows.', 'Use <b>Figma desktop</b>, which includes the font helper. In a browser you must install the Figma font installer.', 'Restart Figma or reload the file, then pick the font in the font menu.', 'On Organization or Enterprise plans an admin can upload fonts for the whole team.'], note: 'Check the font\'s license before using it in shared work.' }
};
const showFigma = k => stepsDialog(FIGMA_STEPS[k]);

/* ---------- right-click / context menu ---------- */
let ctxEl = null;
function closeCtx() { if (ctxEl) { ctxEl.remove(); ctxEl = null } }
function ctxMenu(x, y, items, onClose) {
  closeCtx(); const m = document.createElement('div'); m.className = 'ctxm'; m.setAttribute('role', 'menu'); const prev = document.activeElement;
  items.forEach(it => { if (it === '-') { const h = document.createElement('div'); h.className = 'ctx-sep'; h.setAttribute('role', 'separator'); m.appendChild(h); return } const b = document.createElement('button'); b.type = 'button'; b.setAttribute('role', 'menuitem'); b.className = 'ctx-i' + (it.danger ? ' danger' : ''); b.textContent = it.label; if (it.disabled) { b.disabled = true; b.title = it.why || '' } b.onclick = () => { closeCtx(); prev && prev.focus && prev.focus(); it.act() }; m.appendChild(b) });
  document.body.appendChild(m); ctxEl = m;
  const r = m.getBoundingClientRect(); m.style.left = Math.max(8, Math.min(x, innerWidth - r.width - 8)) + 'px'; m.style.top = Math.max(8, Math.min(y, innerHeight - r.height - 8)) + 'px';
  const bs = $$('.ctx-i:not(:disabled)', m); bs[0] && bs[0].focus();
  m.addEventListener('keydown', e => { const i = bs.indexOf(document.activeElement); if (e.key === 'ArrowDown') { e.preventDefault(); bs[(i + 1) % bs.length].focus() } else if (e.key === 'ArrowUp') { e.preventDefault(); bs[(i - 1 + bs.length) % bs.length].focus() } else if (e.key === 'Escape') { e.preventDefault(); closeCtx(); prev && prev.focus && prev.focus() } else if (e.key === 'Tab') closeCtx() });
}
document.addEventListener('mousedown', e => { if (ctxEl && !ctxEl.contains(e.target)) closeCtx() });
window.addEventListener('blur', closeCtx); window.addEventListener('resize', closeCtx);

/* ---------- hover overlays (white) ---------- */
const tip = document.createElement('div'); tip.className = 'ctip'; tip.hidden = true; tip.setAttribute('aria-hidden', 'true'); document.body.appendChild(tip);
const tipData = (name, hex, others, sys) => esc(JSON.stringify({ n: name, h: hex, sys: sys ? 1 : 0, o: others.map(o => ({ n: o.name, h: o.hex })) }));
let tipSys = null, tipEl = null, hideT = 0;
function sysCompare(d) {
  if (!S.systems.length) return '<div class="sysbox"><div class="mut">Create a design system in Design Systems to see how this color fits.</div></div>';
  const sys = S.systems.find(x => x.id === (tipSys || S.active)) || S.systems[0];
  const rows = sys.colors.filter(o => normHex(o.hex)).slice(0, 10).map(o => { const r = ratio(d.h, o.hex), t = v => r >= v ? '✓' : '✕'; return `<div class="r"><i style="background:${esc(o.hex)};color:${esc(d.h)}">Aa</i><span>${esc(o.name)} ${esc(o.hex)}</span><em>${fmtRatio(r)}:1 AA ${t(4.5)} AAA ${t(7)}</em></div>` }).join('');
  return `<div class="sysbox"><label class="f"><span class="f-t">Try it in</span><select id="tipsys" aria-label="Design system to compare with">${S.systems.map(x => `<option value="${x.id}" ${x.id === sys.id ? 'selected' : ''}>${esc(x.name)}</option>`).join('')}</select></label>${rows ? `<div class="mut" style="margin:6px 0 2px">With <b>${esc(sys.name)}</b> colors:</div>${rows}` : '<div class="mut" style="margin-top:6px">This system has no colors yet.</div>'}</div>`;
}
function showTip(el) {
  let html = '', inter = false;
  clearTimeout(hideT);
  if (el.dataset.tipfix) {
    let d; try { d = JSON.parse(el.dataset.tipfix) } catch { return }
    html = `<b>Fix contrast</b><div class="fx"><i class="sq" style="background:${esc(d.from)}"></i>${esc(d.n)} ${esc(d.from)} <span aria-hidden="true">→</span> <i class="sq" style="background:${esc(d.to)}"></i>${esc(d.to)}</div><div class="fx">Ratio <b>${d.r0}:1</b> <span aria-hidden="true">→</span> <b>${d.r1}:1</b> on ${esc(d.bgn)} ${esc(d.bg)}</div><div class="prev" style="background:${esc(d.bg)};color:${esc(d.to)}">Aa Preview text</div>`;
  } else if (el.dataset.tiptext) { html = esc(el.dataset.tiptext) }
  else if (el.dataset.tip) {
    let d; try { d = JSON.parse(el.dataset.tip) } catch { return }
    const cap = d.sys ? 5 : 12, rows = d.o.filter(o => normHex(o.h)).slice(0, cap).map(o => { const r = ratio(d.h, o.h), t = v => r >= v ? '✓' : '✕'; return `<div class="r"><i style="background:${esc(o.h)};color:${esc(d.h)}">Aa</i><span>${esc(o.n)} ${esc(o.h)}</span><em>${fmtRatio(r)}:1 AA ${t(4.5)} AAA ${t(7)}</em></div>` }).join('');
    html = `<b>${esc(d.n)}</b> <span class="mut">${esc(d.h)}</span>${rows ? `<div class="mut" style="margin:4px 0 2px">This color on top of:</div>${rows}` : ''}${d.o.length > cap ? `<div class="mut" style="padding-top:3px">+${d.o.length - cap} more</div>` : ''}`;
    if (d.sys) { html += sysCompare(d); inter = true }
  } else return;
  tipEl = el; tip.innerHTML = html; tip.hidden = false; tip.classList.toggle('int', inter);
  if (inter) { const sel = $('#tipsys', tip); if (sel) { upgradeSelects(tip); sel.onchange = () => { tipSys = sel.value; showTip(el) } } }
  const b = el.getBoundingClientRect(), w = tip.offsetWidth, h = tip.offsetHeight;
  let x = Math.min(Math.max(8, b.left), innerWidth - w - 8), y = b.bottom + (inter ? 2 : 8); if (y + h > innerHeight - 8) y = Math.max(8, b.top - h - (inter ? 2 : 8));
  tip.style.left = x + 'px'; tip.style.top = y + 'px';
}
const tipTarget = e => e.target.closest && e.target.closest('[data-tip],[data-tipfix],[data-tiptext]');
const hideTip = () => { if (tip.classList.contains('int') && (tip.matches(':hover') || tip.contains(document.activeElement) || (ddOpen && tip.contains(ddOpen.wrap)))) return; tip.hidden = true };
const hideSoon = () => { clearTimeout(hideT); hideT = setTimeout(hideTip, tip.classList.contains('int') ? 260 : 0) };
document.addEventListener('mouseover', e => { if (tip.contains(e.target)) { clearTimeout(hideT); return } const t = tipTarget(e); if (t && t !== tipEl || (t && tip.hidden)) showTip(t); else if (t) clearTimeout(hideT) });
document.addEventListener('mouseout', e => { if (tipTarget(e) || tip.contains(e.target)) hideSoon() });
document.addEventListener('focusin', e => { const t = tipTarget(e); if (t) showTip(t) });
document.addEventListener('focusout', () => hideSoon());
document.addEventListener('keydown', e => { if (e.key === 'Escape' && !ddOpen) tip.hidden = true });
window.addEventListener('scroll', () => { tip.hidden = true }, { passive: true });

/* ---------- zip (store only, no dependencies) ---------- */
const CRC_T = (() => { const t = []; for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1; t[n] = c >>> 0 } return t })();
const crc32 = b => { let c = -1; for (let i = 0; i < b.length; i++) c = CRC_T[(c ^ b[i]) & 255] ^ (c >>> 8); return (c ^ -1) >>> 0 };
function makeZip(files) {
  const enc = new TextEncoder(), parts = [], central = []; let off = 0;
  for (const f of files) {
    const name = enc.encode(f.name), data = enc.encode(f.data), crc = crc32(data);
    const lh = new Uint8Array(30 + name.length), dv = new DataView(lh.buffer);
    dv.setUint32(0, 0x04034b50, true); dv.setUint16(4, 20, true); dv.setUint16(6, 0x0800, true); dv.setUint16(12, 0x21, true); dv.setUint32(14, crc, true); dv.setUint32(18, data.length, true); dv.setUint32(22, data.length, true); dv.setUint16(26, name.length, true); lh.set(name, 30);
    parts.push(lh, data);
    const ch = new Uint8Array(46 + name.length), cv = new DataView(ch.buffer);
    cv.setUint32(0, 0x02014b50, true); cv.setUint16(4, 20, true); cv.setUint16(6, 20, true); cv.setUint16(8, 0x0800, true); cv.setUint16(14, 0x21, true); cv.setUint32(16, crc, true); cv.setUint32(20, data.length, true); cv.setUint32(24, data.length, true); cv.setUint16(28, name.length, true); cv.setUint32(42, off, true); ch.set(name, 46);
    central.push(ch); off += lh.length + data.length;
  }
  const cs = central.reduce((a, b) => a + b.length, 0), end = new Uint8Array(22), ev = new DataView(end.buffer);
  ev.setUint32(0, 0x06054b50, true); ev.setUint16(8, files.length, true); ev.setUint16(10, files.length, true); ev.setUint32(12, cs, true); ev.setUint32(16, off, true);
  return new Blob([...parts, ...central, end], { type: 'application/zip' });
}

/* ---------- component code helpers (shared by Browse and Export) ---------- */
function compStates(e, ids) { return (e.states || []).filter(s => ids.includes(s.id)) }
const OS_LABEL = { ios: 'iOS', android: 'Android' };
const stripComments = css => css.replace(/\/\*[\s\S]*?\*\//g, '');
/* Prefix every selector so a block of CSS only affects one wrapper (used for OS variants). */
function scopeCss(css, pre) {
  css = stripComments(css); let out = '', i = 0;
  while (i < css.length) {
    const open = css.indexOf('{', i); if (open < 0) { out += css.slice(i); break }
    const head = css.slice(i, open).trim(); let d = 1, j = open + 1;
    while (j < css.length && d) { if (css[j] === '{') d++; else if (css[j] === '}') d--; j++ }
    const body = css.slice(open + 1, j - 1);
    if (/^@(media|supports)/.test(head)) out += head + '{' + scopeCss(body, pre) + '}';
    else if (head.startsWith('@')) out += head + '{' + body + '}';
    else out += head.split(',').map(x => { x = x.trim(); return /^(:root|html|body)/.test(x) ? x : pre + ' ' + x }).join(',') + '{' + body + '}';
    i = j;
  }
  return out;
}
const osBase = (e, o) => (e.os && e.os[o]) || {};
function compCss(e, ids, os) {
  const st = compStates(e, ids).map(s => `/* ${s.label} */\n${s.css}`).join('\n');
  if (!os || !os.length) return e.code.css + '\n' + st;
  return os.map(o => `/* ${OS_LABEL[o]} */\n` + scopeCss(e.code.css + '\n' + (osBase(e, o).css || '') + '\n' + st, '.os-' + o)).join('\n');
}
/* Same component twice on one page: give the copy unique ids and radio names so labels, aria links and radio groups stay separate. */
function uniq(html, sfx) {
  const ids = new Set(); html.replace(/\sid="([^"]+)"/g, (_, i) => ids.add(i));
  return html.replace(/(\s(?:id|for|aria-controls|aria-describedby|aria-labelledby)=")([^"]*)"/g, (m, a, v) => a + v.split(/\s+/).map(t => ids.has(t) ? t + sfx : t).join(' ') + '"')
    .replace(/<input\b[^>]*>/g, tag => /type="radio"/.test(tag) ? tag.replace(/(\sname=")([^"]+)"/, '$1$2' + sfx + '"') : tag);
}
function compBody(e, os, withDefault) {
  if (!os || !os.length) return e.code.html;
  const blocks = os.map(o => `<section class="os-block"><h2>${OS_LABEL[o]}</h2><div class="os-${o}">${uniq(osBase(e, o).html || e.code.html, '-' + o)}</div></section>`);
  if (withDefault) blocks.unshift(`<section class="os-block"><h2>Default</h2><div>${e.code.html}</div></section>`);
  return blocks.join('\n');
}
function compDoc(e, ids, os) { return `<!doctype html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1">\n<title>${esc(e.name)}</title>\n<style>\nbody{margin:0;padding:32px;font-family:system-ui,sans-serif}\n.os-block{margin-bottom:32px}.os-block h2{font:700 12px ui-monospace,monospace;text-transform:uppercase;letter-spacing:.08em;color:#525252}\n${compCss(e, ids, os)}\n</style>\n</head>\n<body>\n${compBody(e, os)}\n${e.code.js ? '<script>\n' + e.code.js + '\n<\/script>\n' : ''}</body>\n</html>\n` }

/* ---------- state frames: every state side by side, like variants in Figma ---------- */
const STATE_MAP = [[/:hover/g, '.is-hover'], [/:focus-visible/g, '.is-focus'], [/:focus-within/g, '.is-focus'], [/:focus/g, '.is-focus'], [/:active/g, '.is-pressed'], [/:disabled/g, '.is-disabled'], [/:checked/g, '.is-checked']];
function forceCss(css) {
  css = stripComments(css).trim().replace(/^@media\s*\(hover:\s*hover\)\s*\{([\s\S]*)\}$/, '$1');
  STATE_MAP.forEach(([re, r]) => { css = css.replace(re, r) }); return css;
}
const STATE_TOKEN = /(\.is-(?:hover|focus|pressed|disabled|checked)|\[[^\]]*\])/g;
/* Add the state class or attribute to the first matching element so the forced CSS applies. */
function applyForced(root, css) {
  const st = document.createElement('style'); st.textContent = css; root.appendChild(st); const sheet = st.sheet; if (!sheet) return;
  const walk = rules => [...rules].forEach(r => {
    if (r.cssRules && !r.selectorText) return walk(r.cssRules);
    if (!r.selectorText) return;
    r.selectorText.split(',').forEach(sel => {
      sel = sel.trim().replace(/::?[a-z-]+(\([^)]*\))?$/i, m => m.startsWith('::') ? '' : m);
      const m = sel.match(/([^\s>+~]*)$/); const last = m ? m[1] : sel; const head = sel.slice(0, sel.length - last.length);
      const toks = last.match(STATE_TOKEN) || []; if (!toks.length) return;
      const base = head + last.replace(STATE_TOKEN, ''); let el; try { el = root.querySelector(base || '*') } catch { return }
      if (!el) return;
      toks.forEach(t => { if (t[0] === '.') el.classList.add(t.slice(1)); else { const mm = t.match(/^\[([^\]=~|^$*]+)(?:[~|^$*]?=["']?([^"'\]]*)["']?)?\]$/); if (mm) el.setAttribute(mm[1], mm[2] || '') } });
    });
  });
  walk(sheet.cssRules);
}
const FRAME_FIX = ':host{display:block}.sheet{animation:none!important}.fr [role=menu],.fr [role=listbox],.fr [role=tooltip],.fr .pop{position:static!important;inset:auto!important;margin-top:6px!important}.fr .m-scrim{position:static!important;display:block!important;background:none!important}.fr [hidden]{display:revert}.fr .row,.fr .acts{flex-wrap:wrap}*{box-sizing:border-box}.fr{padding:20px 18px;font-family:system-ui,sans-serif}dialog{position:static!important;margin:0!important;display:block}.sheet-scrim{display:none}.sheet{position:static!important;width:min(100%,380px);border-radius:20px!important}.sr{position:absolute;width:1px;height:1px;overflow:hidden}';
function renderFrames(host, e, stateIds, osList) {
  host.innerHTML = ''; host.classList.add('frames');
  const rows = (osList && osList.length ? osList : ['']);
  const states = [{ id: 'default', label: 'Default', css: '' }].concat(compStates(e, stateIds).filter(s => s.id !== 'default'));
  rows.forEach(o => {
    const row = document.createElement('div'); row.className = 'frow';
    if (o) { const h = document.createElement('p'); h.className = 'eyebrow'; h.textContent = OS_LABEL[o]; row.appendChild(h) }
    const strip = document.createElement('div'); strip.className = 'fstrip';
    states.forEach(s => {
      const cell = document.createElement('figure'); cell.className = 'fcell';
      const cap = document.createElement('figcaption'); cap.textContent = s.label.replace(/\s*\(.*\)/, ''); const box = document.createElement('div'); box.className = 'fbox';
      const root = box.attachShadow({ mode: 'open' }); const base = e.code.css + '\n' + (o ? (osBase(e, o).css || '') : '');
      root.innerHTML = `<style>${FRAME_FIX}${base}</style><div class="fr">${o ? (osBase(e, o).frame || osBase(e, o).html || e.code.frame || e.code.html) : (e.code.frame || e.code.html)}</div>`;
      if (s.id !== 'default') applyForced(root, forceCss(s.css));
      cell.append(cap, box); strip.appendChild(cell);
    });
    row.appendChild(strip); host.appendChild(row);
  });
}
const compById = id => DATA.find(x => x.id === id && x.type === 'component');
