/* ===== Browse: database view ===== */
const B = { q: '', types: new Set(), cats: new Set(), plats: new Set(), inds: new Set(), styles: new Set(), scope: 'name', sort: 'name', dir: 1 };
const clipStore = {}; let curStates = [];
const route = () => { const h = location.hash.replace(/^#\/?/, ''); if (h === 'systems') return { view: 'systems' }; if (h === 'guides') return { view: 'guides' }; if (h === 'tools') return { view: 'tools' }; if (h.startsWith('tools/')) return { view: 'tools', id: h.slice(6) }; if (h.startsWith('browse/')) { B.types = new Set([h.slice(7)]); B.cats.clear(); B.styles.clear(); try { history.replaceState(null, '', '#/') } catch { } return { view: 'browse' } } if (h.startsWith('guide/')) return { view: 'guides', id: h.slice(6) }; if (h.startsWith('entry/')) return { view: 'browse', id: h.slice(6) }; return { view: 'browse' } };
const go = h => { location.hash = h };

function matches(e) {
  if (B.types.size && !B.types.has(e.type)) return false;
  if (B.cats.size && !B.cats.has(e.category)) return false;
  if (!platOk(e)) return false;
  if (B.styles.size && styleShown() && !B.styles.has(e.style)) return false;
  if (B.inds.size && (e.type === 'color' || e.type === 'typeface')) { const i = e.industries || ['all']; if (!(i.includes('all') || [...B.inds].some(x => i.includes(x)))) return false }
  const q = B.q.trim().toLowerCase(); if (!q) return true;
  return (B.scope === 'name' ? e.name + ' ' + (e.keywords || '') : e.summary).toLowerCase().includes(q);
}
/* Platform only narrows components; colors and typography always show. */
/* Industry only applies to colors and typography. Style only applies to icons (and profiles). */
const indShown = () => !B.types.size || [...B.types].some(t => t === 'color' || t === 'typeface');
const styleShown = () => B.types.size === 1 && [...B.types][0] === 'icon';
const STYLE_ORDER = ['Realistic', 'Illustrated', 'Drawing', 'Outline', 'Filled', 'Duotone', 'Rounded', 'Sharp', 'Bold', 'Light', 'Thin', 'Realistic', 'Illustrated', 'Flat', 'Cartoon', 'Pixel', 'Sketch'];
const styleSort = (a, b) => { const x = STYLE_ORDER.indexOf(a), y = STYLE_ORDER.indexOf(b); return (x < 0 ? 99 : x) - (y < 0 ? 99 : y) || a.localeCompare(b) };
/* Component states: ticking one here ticks it for every component, and unticking clears it (same choice the details panel remembers). */
const stateUnion = () => { const m = new Map(STATE_LIST.map(([id, l]) => [id, { id, label: l, n: 0 }])); DATA.filter(e => e.type === 'component').forEach(e => (e.states || []).forEach(x => { const r = m.get(x.id) || (m.set(x.id, { id: x.id, label: x.label, n: 0 }), m.get(x.id)); r.n++ })); return [...m.values()].filter(r => r.n) };
const stateOn = id => id === 'default' || (PREF.on.includes(id) ? true : PREF.off.includes(id) ? false : (cur() ? cur().states.includes(id) : true));
const statesShown = () => B.types.size === 1 && B.types.has('component');
const platShown = () => !B.types.size || B.types.has('component');
const platOk = e => !B.plats.size || !platShown() || e.type !== 'component' || (e.platforms || []).some(x => B.plats.has(x));
const hl = t => { const q = B.q.trim(); if (!q) return esc(t); const re = new RegExp('(' + q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'ig'); return String(t).split(re).map((x, i) => i % 2 ? '<mark>' + esc(x) + '</mark>' : esc(x)).join('') };
const countBy = (fn, items) => { const m = {}; items.forEach(e => [].concat(fn(e) || []).forEach(k => m[k] = (m[k] || 0) + 1)); return m };
const checkbox = (grp, val, label, n, on) => `<label class="chk"><input type="checkbox" data-grp="${grp}" value="${esc(val)}" ${on ? 'checked' : ''}><span>${esc(label)}</span><span class="n">${n}</span></label>`;

function renderBrowse() {
  $('#app').innerHTML = `<div class="layout3" id="lay"><aside id="side" aria-label="Filters"></aside><div class="rz" data-rz="left" role="separator" aria-orientation="vertical" aria-label="Resize filters panel. Use left and right arrow keys." tabindex="0"></div><main id="main" tabindex="-1"></main><div class="rz rz-r" data-rz="right" role="separator" aria-orientation="vertical" aria-label="Resize details panel. Use left and right arrow keys." tabindex="0" hidden></div><aside id="detail" class="dpanel" aria-label="Details" hidden></aside></div><div class="sheet-bd" id="dbd" hidden></div>`;
  renderFilters(); renderResults(); initPanes($('#lay')); showDetail();
}
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const PANES_KEY = 'mambo-database.panes';
/* Resizable panes, like the side panels in Figma. Drag a line, use arrow keys, or double-click to reset. */
function initPanes(lay) {
  const w = { l: 290, r: 520 }; try { Object.assign(w, JSON.parse(localStorage.getItem(PANES_KEY)) || {}) } catch { }
  const apply = () => { lay.style.setProperty('--wl', w.l + 'px'); lay.style.setProperty('--wr', w.r + 'px'); $$('.rz[data-rz]', lay).forEach(h => { const l = h.dataset.rz === 'left'; h.setAttribute('aria-valuemin', l ? 200 : 320); h.setAttribute('aria-valuemax', l ? 560 : 980); h.setAttribute('aria-valuenow', Math.round(l ? w.l : w.r)) }) }, save = () => { try { localStorage.setItem(PANES_KEY, JSON.stringify(w)) } catch { } }; apply();
  $$('.rz', lay).forEach(h => { const side = h.dataset.rz;
    h.onpointerdown = e => { e.preventDefault(); h.setPointerCapture(e.pointerId); h.classList.add('drag'); document.body.classList.add('resizing');
      const move = ev => { const r = lay.getBoundingClientRect(); if (side === 'left') w.l = clamp(ev.clientX - r.left, 200, Math.max(240, Math.min(560, r.width - 440))); else w.r = clamp(r.right - ev.clientX, 320, Math.max(340, Math.min(980, r.width - w.l - 320))); apply() };
      const up = () => { h.removeEventListener('pointermove', move); h.removeEventListener('pointerup', up); h.classList.remove('drag'); document.body.classList.remove('resizing'); save() };
      h.addEventListener('pointermove', move); h.addEventListener('pointerup', up) };
    h.onkeydown = e => { const d = e.key === 'ArrowLeft' ? -16 : e.key === 'ArrowRight' ? 16 : 0; if (!d) return; e.preventDefault(); if (side === 'left') w.l = clamp(w.l + d, 200, 560); else w.r = clamp(w.r - d, 320, 980); apply(); save() };
    h.ondblclick = () => { if (side === 'left') w.l = 290; else w.r = 520; apply(); save() };
  });
}
const X_ICON = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>';
function showDetail() {
  const id = route().id, e = id && DATA.find(x => x.id === id); const lay = $('#lay'), d = $('#detail'); if (!lay) return;
  lay.classList.toggle('has-detail', !!e); d.hidden = !e; $('.rz-r', lay).hidden = !e; $('#dbd').hidden = !e; document.body.classList.toggle('sheet-open', !!e);
  $$('tr[data-eid]', lay).forEach(tr => tr.classList.toggle('sel', tr.dataset.eid === id));
  if (!e) { d.innerHTML = ''; return }
  fillDetail(d, e, () => go('#/')); $('#dbd').onclick = () => go('#/');
}
/* Fills a right-hand details panel (Browse and Design Systems share it). */
function fillDetail(d, e, close) {
  d.setAttribute('role', 'region'); d.setAttribute('aria-label', 'Details for ' + e.name);
  d.innerHTML = `<div class="d-head"><span class="grab" aria-hidden="true"></span><span class="eyebrow">Details</span><button class="x" id="dclose" aria-label="Close details">${X_ICON}</button></div><div class="d-body" id="dbody">${renderEntry(e)}</div>`;
  wireEntry(e, d); upgradeSelects(d); d.scrollTop = 0; $('#dbody').scrollTop = 0;
  $('#dclose').onclick = close;
  let y0 = null; const head = $('.d-head', d); head.ontouchstart = ev => { y0 = ev.touches[0].clientY }; head.ontouchmove = ev => { if (y0 !== null && ev.touches[0].clientY - y0 > 90) { y0 = null; close() } }; head.ontouchend = () => { y0 = null };
}
let onEntryAdded = null;
document.addEventListener('keydown', ev => { if (ev.key === 'Escape' && route().id && route().view === 'browse' && !document.querySelector('dialog.mdl') && !ddOpen && !ctxEl && !ev.defaultPrevented) go('#/') });
const filtersActive = () => !!(B.q.trim() || B.types.size || B.cats.size || B.styles.size || (B.plats.size && platShown()) || (B.inds.size && indShown()));
function renderFilters() {
  const types = countBy(e => e.type, DATA), cats = countBy(e => e.category, DATA.filter(e => (!B.types.size || B.types.has(e.type)) && platOk(e))), plats = countBy(e => e.platforms, DATA.filter(e => e.type === 'component')), inds = countBy(e => (e.industries || ['all']).includes('all') ? INDUSTRIES.slice(1).map(i => i[0]) : e.industries, DATA.filter(e => e.type === 'color' || e.type === 'typeface')), sty = countBy(e => e.style, DATA.filter(e => styleShown() && e.type === [...B.types][0] && (!B.cats.size || B.cats.has(e.category))));
  const catList = (B.types.has('profile') ? Object.keys(cats).sort(styleSort) : Object.keys(cats).sort());
  $('#side').innerHTML = `<p class="wordmark"><img src="mambo.png" alt="">Mambo Database</p>
  <label class="f" style="margin-bottom:10px"><span class="eyebrow f-t">Design system</span><select id="syssel"><option value="">None</option>${S.systems.map(s => `<option value="${s.id}" ${S.active === s.id ? 'selected' : ''}>${esc(s.name)}</option>`).join('')}</select></label>
  <label for="q" class="eyebrow">Search</label>
  <input id="q" type="search" placeholder="${B.scope === 'name' ? 'Search names' : 'Search descriptions'}" autocomplete="off" value="${esc(B.q)}">
  <div class="scope" role="group" aria-label="Search in">${[['name', 'Name'], ['description', 'Description']].map(([k, l]) => `<button type="button" class="chip" data-scope="${k}" aria-pressed="${B.scope === k}">${l}</button>`).join('')}</div>
  <fieldset><legend class="eyebrow">Type</legend>${[['', 'All', DATA.length]].concat(Object.keys(TYPE).map(t => [t, TYPE_PLURAL[t], types[t] || 0])).map(([v, l, n]) => `<label class="chk"><input type="radio" name="type" data-type value="${v}" ${(B.types.has(v) || (!v && !B.types.size)) ? 'checked' : ''}><span>${esc(l)}</span><span class="n">${n}</span></label>`).join('')}</fieldset>
  ${B.types.size === 1 ? `<fieldset><legend class="eyebrow">${[...B.types][0] === 'profile' ? 'Style' : esc(TYPE_PLURAL[[...B.types][0]]) + ' category'}</legend>${catList.map(c => checkbox('cats', c, c, cats[c], B.cats.has(c))).join('')}</fieldset>` : ''}
  ${styleShown() ? `<fieldset><legend class="eyebrow">${[...B.types][0] === 'icon' ? 'Icon style' : 'Style'}</legend>${Object.keys(sty).sort(styleSort).map(c => checkbox('styles', c, c, sty[c], B.styles.has(c))).join('')}</fieldset>` : ''}
  ${platShown() ? `<fieldset><legend class="eyebrow">Platform</legend>${Object.keys(PLAT).map(p => checkbox('plats', p, PLAT[p], plats[p] || 0, B.plats.has(p))).join('')}</fieldset>` : ''}
  ${statesShown() ? `<fieldset><legend class="eyebrow">Component states</legend><p class="note" style="margin:0 0 6px">Ticking a state turns it on for every component. Unticking turns it off.</p>${stateUnion().map(r => `<label class="chk"><input type="checkbox" data-stf="${esc(r.id)}" ${stateOn(r.id) ? 'checked' : ''} ${r.id === 'default' ? 'disabled' : ''}><span>${esc(r.label)}</span><span class="n">${r.n}</span></label>`).join('')}</fieldset>` : ''}
  ${indShown() ? `<fieldset><legend class="eyebrow">Industry</legend>${INDUSTRIES.slice(1).map(([k, l]) => checkbox('inds', k, l, inds[k] || 0, B.inds.has(k))).join('')}</fieldset>` : ''}
  <div class="row"><button class="btn sm" id="clear" ${filtersActive() ? "" : "disabled"}>Clear filters</button></div>`;
  upgradeSelects($('#side'));
  $$('[data-scope]', $('#side')).forEach(b => b.onclick = () => { B.scope = b.dataset.scope; renderFilters(); renderResults() });
  $('#syssel').onchange = ev => { S.active = ev.target.value || null; saveStore(); renderResults(); showDetail() };
  $('#q').oninput = ev => { B.q = ev.target.value; afterFilter(false); const c = $('#clear'); if (c) c.disabled = !filtersActive() };
  $$('input[data-type]', $('#side')).forEach(i => i.onchange = () => { B.types = i.value ? new Set([i.value]) : new Set(); B.cats.clear(); B.styles.clear(); afterFilter(true) });
  $$('input[data-grp]', $('#side')).forEach(i => i.onchange = () => { const s = B[i.dataset.grp]; i.checked ? s.add(i.value) : s.delete(i.value); afterFilter(true) });
  $$('input[data-stf]', $('#side')).forEach(i => i.onchange = () => { const id = i.dataset.stf; PREF.on = PREF.on.filter(x => x !== id); PREF.off = PREF.off.filter(x => x !== id); (i.checked ? PREF.on : PREF.off).push(id); savePref(); showDetail() });
  $('#clear').onclick = () => { B.q = ''; B.types.clear(); B.cats.clear(); B.plats.clear(); B.inds.clear(); B.styles.clear(); renderFilters(); renderResults() };
}
function afterFilter(refresh) { if (refresh) renderFilters(); renderResults() }
const sortVal = (e, k) => k === 'name' ? e.name : k === 'type' ? TYPE[e.type] : k === 'category' ? e.category : k === 'style' ? (e.style || '') : k === 'platforms' ? (e.platforms || []).join() : (e.industries || ['all']).join();
function renderResults() {
  const items = DATA.filter(matches).sort((a, b) => sortVal(a, B.sort).localeCompare(sortVal(b, B.sort)) * B.dir), xt = expType();
  const th = (k, l) => `<th scope="col" aria-sort="${B.sort === k ? (B.dir > 0 ? 'ascending' : 'descending') : 'none'}"><button data-sort="${k}">${l}${B.sort === k ? `<span class="sortc ${B.dir > 0 ? '' : 'flip'}">${CHEV}</span>` : ''}</button></th>`;
  const sample = e => e.type === 'typeface' ? `<span class="tsample" data-font="${esc(e.name)}" style="font-family:'${esc(e.name)}',${fontFallback(e.name)}">The quick brown fox jumps over the lazy dog. 0123456789</span>` : '';
  $('#main').innerHTML = `<div class="dbhead"><div><p class="eyebrow">Database</p><h1>Browse everything</h1></div><p class="empty" role="status">${items.length} of ${DATA.length} entries</p></div>
  ${xt ? `<div class="expbar" id="expbar"><label class="chk"><input type="checkbox" id="selall"><span>Select all</span></label><span class="expn" id="expn" role="status"></span><div class="expw" id="expw"></div></div>` : ''}
  ${items.length ? `<table class="db"><thead><tr>${xt ? '<th scope="col" class="selc"><span class="sr">Select</span></th>' : ''}${th('name', 'Name')}${th('type', 'Type')}${B.types.size === 1 ? th('category', B.types.has('profile') ? 'Style' : 'Category') : ''}${styleShown() ? th('style', 'Style') : ''}${platShown() ? th('platforms', 'Platforms') : ''}${indShown() ? th('industries', 'Industries') : ''}</tr></thead><tbody>${items.map(e => `<tr data-eid="${esc(e.id)}" class="${route().id === e.id ? 'sel' : ''}">
   ${xt ? `<td class="selc"><input type="checkbox" data-sel="${esc(e.id)}" ${SEL[xt].includes(e.id) ? 'checked' : ''} aria-label="Select ${esc(e.name)}${e.type === 'icon' ? ' (' + esc(e.category) + ')' : ''}"></td>` : ''}
   <td data-l="Name"><button class="name-btn" data-open="${esc(e.id)}">${B.scope === 'name' ? hl(e.name) : esc(e.name)}</button><span class="sum">${B.scope === 'description' ? hl(e.summary) : esc(e.summary)}</span>${sample(e)}${e.type === 'profile' ? `<span class="iconprev pfprev" aria-hidden="true"><img src="${svgUri(e.svg)}" alt="" width="48" height="48" loading="lazy"></span>` : ''}${e.type === 'color' ? (cvdOf(e).length ? `<span class="docmeta cvdnote">Colorblind note: ${cvdOf(e).length} pair${cvdOf(e).length > 1 ? 's' : ''} may look alike to some people. <a href="${CVD_GUIDE}">Read more</a></span>` : e.category === 'accessible' ? '<span class="docmeta">Color-blind accessible</span>' : '') : ''}${e.type === 'document' ? `<span class="docmeta">${esc(e.publisher)} · For ${esc((e.audience || []).join(' and '))}</span>` : ''}${e.type === 'icon' ? `<span class="iconprev" aria-hidden="true">${iconSvg(e, 24)}</span>` : ''}${e.type === 'color' ? `<span class="swatchrow" aria-hidden="true">${Object.entries(e.roles).slice(0, 8).map(([k, c]) => `<i style="background:${esc(c)}" data-tip="${tipData(k, c, Object.entries(e.roles).filter(([x]) => x !== k).map(([x, y]) => ({ name: x, hex: y })), true)}"></i>`).join('')}</span>` : ''}</td>
   <td data-l="Type">${TYPE[e.type]}</td>${B.types.size === 1 ? `<td data-l="Category">${esc(e.category)}</td>` : ''}${styleShown() ? `<td data-l="Style">${esc(e.style || '')}</td>` : ''}
   ${platShown() ? `<td data-l="Platforms">${(e.platforms || []).map(p => `<span class="tag">${esc(PLAT[p] || p)}</span>`).join('') || '<span class="empty">Any</span>'}</td>` : ''}
   ${indShown() ? `<td data-l="Industries">${e.type === 'color' || e.type === 'typeface' ? (e.industries || ['all']).map(i => `<span class="tag">${esc(indLabel(i))}</span>`).join('') : '<span class="empty">Not used</span>'}</td>` : ''}</tr>`).join('')}</tbody></table>` : '<p class="empty">No entries match these filters. Try clearing some.</p>'}`;
  $$('[data-sort]', $('#main')).forEach(b => b.onclick = () => { const k = b.dataset.sort; if (B.sort === k) B.dir *= -1; else { B.sort = k; B.dir = 1 } renderResults() });
  $$('[data-open]', $('#main')).forEach(b => b.onclick = () => go('#/entry/' + b.dataset.open));
  watchFonts(); wireExport(items, xt);
}
/* Typography rows show a sample in the font; the font file is fetched only when the row scrolls into view. */
const fontFallback = f => ({ serif: 'Georgia, serif', monospace: 'ui-monospace, monospace' }[(FONTMAP.get(f) || [])[1]] || 'system-ui, sans-serif');
let fontIO = null;
function watchFonts() {
  if (fontIO) fontIO.disconnect(); const els = $$('.tsample[data-font]'); if (!els.length) return;
  if (!('IntersectionObserver' in window)) { els.slice(0, 40).forEach(x => loadFontCss(x.dataset.font)); return }
  fontIO = new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting) { loadFontCss(en.target.dataset.font); fontIO.unobserve(en.target) } }), { rootMargin: '300px' }); els.forEach(x => fontIO.observe(x));
}

/* ---------- export selection (icons, typography, components). Ticks are saved in this browser and survive switching type or closing the tab. ---------- */
const SEL_KEY = 'mambo-database.selected.v1', EXPORTABLE = ['icon', 'typeface', 'component'], SEL = { icon: [], typeface: [], component: [] };
const BY_ID = new Map(DATA.map(e => [e.id, e]));
try { const d = JSON.parse(localStorage.getItem(SEL_KEY)); if (d) EXPORTABLE.forEach(t => { SEL[t] = (d[t] || []).filter(id => BY_ID.has(id)) }) } catch { }
const saveSel = () => { try { localStorage.setItem(SEL_KEY, JSON.stringify(SEL)) } catch { } };
const expType = () => { const t = B.types.size === 1 ? [...B.types][0] : null; return EXPORTABLE.includes(t) ? t : null };
const EXPORTS = { icon: [['svg', 'Copy SVG'], ['jsx', 'Copy React (.JSX)'], ['dl', 'Download SVG'], ['sys', 'Add to design system']], typeface: [['css', 'Copy CSS'], ['json', 'Copy JSON'], ['sys', 'Add to design system']], component: [['figma', 'Copy HTML + CSS for Figma'], ['json', 'Copy JSON'], ['html', 'Download .html'], ['sys', 'Add to design system']] };
const pascal = s => String(s).replace(/(^|[^a-z0-9]+)([a-z0-9])/gi, (m, a, b) => b.toUpperCase());
const stripMd = e => JSON.parse(JSON.stringify(e, (k, v) => k === 'md' || k === 'svg' && e.type !== 'icon' ? undefined : v));
const compBoth = e => { const st = applyPref(e, statesFor(e, cur())), os = PREF.os.filter(o => e.os && e.os[o]); return `<!-- ${e.name} -->\n<style>\n${compCss(e, st, os)}\n</style>\n${compBody(e, os)}${e.code.js ? '\n<script>\n' + e.code.js + '\n<\/script>' : ''}` };
async function pickSystem(title, confirm) {
  const api = openDialog(`<form class="mdl-f"><h2 id="mdl-t">${esc(title)}</h2><label class="f"><span class="f-t">Design system</span><select id="ps-sel">${sysOptions()}</select></label><div class="mdl-actions"><button class="btn" type="button" id="ps-c">Cancel</button><button class="btn solid" id="ps-ok">${esc(confirm)}</button></div></form>`);
  const d = api.el; upgradeSelects(d); $('#ps-c', d).onclick = () => api.close(null); $('form', d).onsubmit = e => { e.preventDefault(); api.close($('#ps-sel', d).value) };
  const v = await api.p; if (!v) return null;
  if (v === '__new') { const n = await ask({ title: 'Name your design system', input: { label: 'Name', value: 'My design system' }, confirm: 'Create' }); if (!n) return null; const s = newSystem({ name: n }); S.systems.push(s); return s }
  return S.systems.find(x => x.id === v) || null;
}
async function runExport(type, act) {
  const items = SEL[type].map(id => BY_ID.get(id)).filter(Boolean), n = items.length, many = n > 1; if (!n) return toast('Tick at least one first.');
  const word = type === 'icon' ? 'icon' : type === 'typeface' ? 'typeface' : 'component', what = n + ' ' + word + (many ? 's' : '');
  if (act === 'sys') {
    const s = await pickSystem('Add ' + what + ' to a design system', 'Add'); if (!s) return;
    if (type === 'icon') { s.icons = s.icons || []; items.forEach(e => { if (!s.icons.some(x => x.id === e.id)) s.icons.push({ id: e.id, name: e.name, setId: e.setId, set: e.category, style: e.style, svg: e.svg }) }) }
    else if (type === 'component') items.forEach(e => { s.components = s.components.filter(c => c.id !== e.id); s.components.push({ id: e.id, states: applyPref(e, statesFor(e, s)), os: PREF.os.filter(o => e.os && e.os[o]) }) });
    else { const spare = FONT_ROLES.filter(r => !['Display', 'Body', 'Mono'].includes(r)); items.forEach(e => { let role = e.roles[0] === 'display' ? 'Display' : e.roles[0] === 'mono' ? 'Mono' : 'Body'; const same = s.fonts.find(f => f.family === e.name); if (same) { same.weights = keepThree(e.weights.filter(w => [400, 500, 600, 700].includes(w))); return } if (many && s.fonts.some(f => f.role === role)) role = spare.find(r => !s.fonts.some(f => f.role === r)) || role; s.fonts = s.fonts.filter(f => f.role !== role); s.fonts.push({ id: uid(), role, family: e.name, weights: keepThree(e.weights.filter(w => [400, 500, 600, 700].includes(w))) }) }) }
    S.last = s.id; S.active = s.id; saveStore(); toast('Added ' + what + ' to ' + s.name); return;
  }
  if (type === 'icon') {
    if (act === 'svg') return copy(items.map(e => many ? `<!-- ${e.name} (${e.category}) -->\n` + iconSvg(e, curIconSize) : iconSvg(e, curIconSize)).join('\n\n'), what + ' as SVG');
    if (act === 'jsx') return copy(items.map(e => iconJsx(e, curIconSize, many ? pascal(e.setId) + pascal(e.name) + 'Icon' : null)).join('\n\n'), what + ' as React');
    if (act === 'dl') return many ? download('icons.zip', makeZip(items.map(e => ({ name: `icons/${e.setId}-${slug(e.name)}.svg`, data: iconSvg(e, curIconSize) }))), 'application/zip') : download(items[0].setId + '-' + slug(items[0].name) + '.svg', iconSvg(items[0], curIconSize), 'image/svg+xml');
  }
  if (type === 'typeface') {
    items.forEach(e => loadFontCss(e.name));
    if (act === 'css') return copy(items.map(e => e.css).join('\n\n'), what + ' CSS');
    if (act === 'json') return copy(JSON.stringify(many ? items.map(stripMd) : stripMd(items[0]), null, 2), what + ' as JSON');
  }
  if (type === 'component') {
    if (act === 'figma') { const ok = await copy(items.map(compBoth).join('\n\n'), what + ' (HTML + CSS)'); if (ok) showFigma('html'); return }
    if (act === 'json') return copy(JSON.stringify(many ? items.map(stripMd) : stripMd(items[0]), null, 2), what + ' as JSON');
    if (act === 'html') { const doc = e => compDoc(e, applyPref(e, statesFor(e, cur())), PREF.os.filter(o => e.os && e.os[o])); return many ? download('components.zip', makeZip(items.map(e => ({ name: `components/${e.id}.html`, data: doc(e) }))), 'application/zip') : download(items[0].id + '.html', doc(items[0]), 'text/html') }
  }
}
/* An Export dropdown (also used for the floating one at the bottom right). */
function selExportMenu(host, type, up) {
  host.innerHTML = `<button type="button" class="btn solid exp-btn" aria-haspopup="menu" aria-expanded="false">Export${CHEV}</button><div class="exp-menu${up ? ' up' : ''}" role="menu" aria-label="Export options" hidden>${EXPORTS[type].map(([k, l]) => `<button type="button" role="menuitem" data-exp="${k}">${l}</button>`).join('')}</div>`;
  const btn = $('.exp-btn', host), menu = $('.exp-menu', host), items = () => $$('[role=menuitem]', menu);
  const close = f => { menu.hidden = true; btn.setAttribute('aria-expanded', 'false'); if (f) btn.focus() }, open = () => { menu.hidden = false; btn.setAttribute('aria-expanded', 'true'); items()[0].focus() };
  btn.onclick = () => menu.hidden ? open() : close();
  host.onkeydown = e => { if (e.key === 'Escape' && !menu.hidden) { e.preventDefault(); e.stopPropagation(); close(true) } else if ((e.key === 'ArrowDown' || e.key === 'ArrowUp') && !menu.hidden) { e.preventDefault(); const a = items(), i = a.indexOf(document.activeElement); a[(i + (e.key === 'ArrowDown' ? 1 : -1) + a.length) % a.length].focus() } else if (e.key === 'ArrowDown' && menu.hidden && document.activeElement === btn) { e.preventDefault(); open() } };
  $$('[data-exp]', menu).forEach(b => b.onclick = () => { close(true); runExport(type, b.dataset.exp) });
  document.addEventListener('pointerdown', ev => { if (!host.contains(ev.target)) { menu.hidden = true; btn.setAttribute('aria-expanded', 'false') } });
}
let expIO = null;
function wireExport(items, xt) {
  $$('.expfloat').forEach(x => x.remove()); if (expIO) { expIO.disconnect(); expIO = null } if (!xt) return;
  const ids = items.map(e => e.id), all = $('#selall'), n = $('#expn');
  const fl = document.createElement('div'); fl.className = 'expfloat'; fl.hidden = true; fl.setAttribute('aria-label', 'Export selected'); $('#main').appendChild(fl); selExportMenu($("#expw"), xt, false); selExportMenu(fl, xt, true);
  let topVisible = true;
  const upd = () => { if (!$('#expw') || !document.body.contains(all)) { if (expIO) { expIO.disconnect(); expIO = null } return } const c = SEL[xt].length, inView = ids.filter(i => SEL[xt].includes(i)).length; n.textContent = c ? `${c} selected` + (c !== inView ? ` (${inView} shown)` : '') : 'None selected'; all.checked = ids.length > 0 && inView === ids.length; all.indeterminate = inView > 0 && inView < ids.length; fl.hidden = !c || topVisible; $$('.exp-btn', $('#expw')).forEach(b => b.disabled = !c); $$('.exp-btn', fl).forEach(b => b.textContent = `Export (${c})`) };
  if ('IntersectionObserver' in window) { expIO = new IntersectionObserver(es => { topVisible = es[0].isIntersecting; upd() }); expIO.observe($('#expbar')) }
  $$('input[data-sel]', $('#main')).forEach(i => i.onchange = () => { const a = SEL[xt]; if (i.checked) { if (!a.includes(i.dataset.sel)) a.push(i.dataset.sel) } else SEL[xt] = a.filter(x => x !== i.dataset.sel); saveSel(); upd() });
  all.onchange = () => { const on = new Set(SEL[xt]); ids.forEach(i => all.checked ? on.add(i) : on.delete(i)); SEL[xt] = [...on]; saveSel(); $$('input[data-sel]', $('#main')).forEach(i => i.checked = on.has(i.dataset.sel)); upd() };
  upd();
}
const ul = a => '<ul class="plain">' + (a || []).map(x => `<li>${esc(x)}</li>`).join('') + '</ul>';
const codeBlock = (label, code, id) => `<div class="codehead"><strong>${label}</strong><button class="btn sm" data-copy="${id}">Copy</button></div><pre><code>${esc(code)}</code></pre>`;
function previewDoc(e, ids, os) {
  const fix = `html,body{min-height:100%}body{margin:0;padding:32px;box-sizing:border-box;background:#fafafa;font-family:system-ui,sans-serif}.pv{display:flex;flex-direction:column;align-items:center;justify-content:flex-start;gap:16px;min-height:${Math.max(200, (e.code.pvHeight || 200) - 64)}px}.os-block{margin-bottom:24px;width:100%}.os-block h2{font:700 12px ui-monospace,monospace;letter-spacing:.04em;color:#525252}.sr{position:absolute;width:1px;height:1px;overflow:hidden}`;
  return `<!doctype html><meta charset=utf-8><meta name=viewport content="width=device-width,initial-scale=1"><style>${compCss(e, ids, os)}\n${fix}</style><div class="pv">${os && os.length ? compBody(e, os, true) : e.code.html}</div>${e.code.js ? '<script>' + e.code.js.replace(/<\/script/gi, '<\\/script') + '<\/script>' : ''}`;
}
const meta = e => `<div class="meta">${(e.platforms || []).map(p => `<span class="tag">${esc(PLAT[p] || p)}</span>`).join('')}${e.type === 'component' ? '' : (e.industries || ['all']).map(i => `<span class="tag">Industry: ${esc(indLabel(i))}</span>`).join('')}</div>`;
const sysOptions = () => { const def = lastSysId(); return S.systems.map(s => `<option value="${s.id}" ${def === s.id ? 'selected' : ''}>${esc(s.name)}</option>`).join('') + `<option value="__new" ${def === '__new' ? 'selected' : ''}>+ New design system</option>` };
function addToSystemRow(kind) {
  const def = lastSysId();
  return `<div class="panel addrow"><h2 style="font-size:16px;margin:0 0 8px">Add to a design system</h2><div class="row" style="margin:0;align-items:end"><label class="f" style="min-width:220px"><span class="f-t">Design system</span><select id="addsys">${S.systems.map(s => `<option value="${s.id}" ${def === s.id ? 'selected' : ''}>${esc(s.name)}</option>`).join('')}<option value="__new" ${def === '__new' ? 'selected' : ''}>+ New design system</option></select></label><button class="btn solid" id="addbtn">${kind}</button><span id="addmsg" role="status" class="empty"></span></div></div>`;
}
const OFL_URL = 'https://openfontlicense.org/', OFL_FILE = 'licenses/OFL-1.1.txt';
const cssLink = e => `<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=${e.name.replace(/ /g, '+')}:wght@${e.weights.filter(w => [400, 500, 600, 700].includes(w)).join(';') || e.weights[0]}&display=swap">`;
const drow = (k, v) => `<tr><th scope="row">${k}</th><td>${v}</td></tr>`;
function typeDetails(e) {
  return `<table class="detail"><tbody>
  ${drow('Designer', esc(e.designer))}
  ${drow('Font version', esc(e.fontVersion || 'n/a') + ' <span class="note">(version recorded in the font file)</span>')}
  ${drow('Google Fonts file version', esc(e.apiVersion) + ' <span class="note">(updated ' + esc(e.lastModified) + ', added ' + esc(e.dateAdded) + ')</span>')}
  ${drow('Weights', e.weights.join(', '))}
  ${drow('Scripts', esc(e.scripts.join(', ')))}
  ${drow('Subsets served', esc(e.subsets.filter(x => x !== 'menu').join(', ')))}
  ${drow('Languages', `${e.languageCount.toLocaleString()} supported <details class="src"><summary>See languages</summary><p class="note">The ${e.languages.length} most widely spoken are listed. Support means the font includes every letter in a language's standard alphabet.</p><p>${esc(e.languages.join(', '))}${e.languageCount > e.languages.length ? ', and ' + (e.languageCount - e.languages.length).toLocaleString() + ' more' : ''}.</p></details>`)}
  ${drow('Web font (.woff2)', `<code class="url">${esc(e.woff2)}</code> <button class="btn sm" data-copy="woff2">Copy URL</button><div class="note">${esc(e.woff2Subset)} subset, weight ${e.woff2Weight}, file version ${esc(e.apiVersion)}. This file path changes when Google publishes a new version. For production, use the stylesheet below, or download the family from Google Fonts and host it yourself (the license allows both).</div>`)}
  ${drow('Stylesheet', `<code class="url">${esc(cssLink(e))}</code> <button class="btn sm" data-copy="csslink">Copy link tag</button>`)}
  ${drow('License', `<a href="${OFL_FILE}">SIL Open Font License 1.1</a> · free for personal and commercial use · <a href="${OFL_URL}" target="_blank" rel="noopener">FAQ</a>`)}
  ${drow('Copyright', esc(e.copyright) + (e.reserved ? '<div class="note">This font has a Reserved Font Name. Modified versions must use a different name.</div>' : ''))}
  ${drow('Source', `<a href="${esc(e.source)}" target="_blank" rel="noopener">View ${esc(e.name)} on Google Fonts</a>`)}
  </tbody></table>`;
}
let curOS = [];
/* Choices carry across components: tick a state or a device variant once and every component you open follows. */
const PREF_KEY = 'mambo-database.prefs';
const PREF = (() => { const p = { os: [], on: [], off: [] }; try { Object.assign(p, JSON.parse(localStorage.getItem(PREF_KEY)) || {}) } catch { } return p })();
const savePref = () => { try { localStorage.setItem(PREF_KEY, JSON.stringify(PREF)) } catch { } };
const applyPref = (e, ids) => { const all = (e.states || []).map(x => x.id); return all.filter(id => PREF.on.includes(id) ? true : PREF.off.includes(id) ? false : ids.includes(id)) };

/* ---------- icons ---------- */
const iconSvg = (e, size) => e.svg.replace('<svg ', `<svg width="${size}" height="${size}" `);
const iconJsx = (e, size, nm) => { const body = e.svg.replace(/<svg /, `<svg width={${size}} height={${size}} `).replace(/([a-z]+)-([a-z]+)=/g, (m, a, b) => a + b[0].toUpperCase() + b.slice(1) + '='); return `export function ${nm || e.name.replace(/ /g, '') + 'Icon'}(props) {\n  return (\n    ${body.replace('>', ' {...props}>')}\n  );\n}` };
const iconUri = (e, size) => 'data:image/svg+xml,' + encodeURIComponent(iconSvg(e, size).replace(/currentColor/g, '#000000'));
let curIconSize = 24;
function iconClip(e) { clipStore.svg = iconSvg(e, curIconSize); clipStore.jsx = iconJsx(e, curIconSize); clipStore.uri = `background-image: url("${iconUri(e, curIconSize)}");\nwidth: ${curIconSize}px;\nheight: ${curIconSize}px;`; }
const CVD_ROLE = { danger: 'Danger', success: 'Success', warning: 'Warning', info: 'Info' };
const cvdColors = e => Object.entries(e.roles).filter(([k]) => ['primary', 'accent', 'danger', 'success', 'warning', 'info'].includes(k)).map(([k, v]) => ({ id: k, name: k, hex: v, role: CVD_ROLE[k] || '' }));
const cvdCache = new Map(), cvdOf = e => { if (!cvdCache.has(e.id)) cvdCache.set(e.id, cvdIssues(cvdColors(e))); return cvdCache.get(e.id) };
const svgUri = svg => 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg), profFile = e => 'profile-' + slug(e.set) + '-' + e.id.split('-').pop();
function profileDetails(e) {
  clipStore.svg = e.svg;
  const what = e.photo ? 'A photo of a real person facing the camera.' : e.category === 'Illustrated' ? 'A cartoon-style profile picture of a person facing the camera.' : 'A hand-drawn style profile picture of a person facing the camera.';
  const lic = e.photo ? `<a href="${esc(e.licenseUrl)}" target="_blank" rel="noopener">${esc(e.license)}<span class="sr"> (opens in a new tab)</span></a> as declared by the photo collection (originals: <a href="${esc(e.origLicenseUrl)}" target="_blank" rel="noopener">Pexels or Unsplash license<span class="sr"> (opens in a new tab)</span></a>) · free to use in personal and commercial work without credit. Do not use the photo in a way that puts the person in a bad light or suggests they endorse something. <a href="licenses/profiles/${esc(e.id.split('-').slice(1, -1).join('-'))}-LICENSE.txt" target="_blank" rel="noopener">Notice</a>`
    : `<a href="${esc(e.licenseUrl)}" target="_blank" rel="noopener">${esc(e.license)}<span class="sr"> (opens in a new tab)</span></a> · ${e.attribution ? '<b>free for commercial use, but you must credit the creator</b> (for example "' + esc(e.set) + ' by ' + esc(e.creator) + ', ' + esc(e.license) + '") and say if you changed it' : /CC0/.test(e.license) ? 'public domain dedication, so you can use it in personal and commercial work without asking or crediting' : 'free for personal and commercial use; crediting the creator is kind'}. <a href="licenses/profiles/${esc(e.id.split('-').slice(1, -1).join('-'))}-LICENSE.txt" target="_blank" rel="noopener">Notice</a>`;
  return `<p class="eyebrow">Profile · ${esc(e.category)}</p><h1>${esc(e.name)}</h1><p>${what} Free for commercial use${e.attribution ? ' with credit' : ''}.</p>
  <div class="meta"><span class="tag">Style: ${esc(e.category)}</span>${e.tone ? `<span class="tag">Skin tone: ${esc(e.tone)}</span>` : ''}<span class="tag">${esc(e.license)}</span></div>
  <div class="pfhero"><img src="${svgUri(e.svg)}" alt="${e.photo ? 'Photo' : 'Illustrated'} profile picture, ${esc(e.category.toLowerCase())} style" width="256" height="256"></div>
  <div class="row"><button class="btn solid" id="pf-png" type="button">Download PNG</button>${e.photo ? '' : '<button class="btn" id="pf-svg" type="button">Download SVG</button>'}<button class="btn" id="pf-cpimg" type="button">Copy image</button>${e.photo ? '' : '<button class="btn" data-copy="svg">Copy SVG</button>'}<button class="btn" data-copy="json">Copy JSON</button></div>
  <table class="detail"><tbody>${drow(e.photo ? 'Photo' : 'Artwork', e.photo ? `${esc(e.creator)} · <a href="${esc(e.source)}" target="_blank" rel="noopener">Original<span class="sr"> (opens in a new tab)</span></a>` : `${esc(e.set)} by ${esc(e.creator)} · <a href="${esc(e.source)}" target="_blank" rel="noopener">Source<span class="sr"> (opens in a new tab)</span></a>`)}${drow('License', lic)}${drow(e.photo ? 'Real person' : 'Made up', e.photo ? 'This shows a real person. Use it for mockups, personas and examples, and avoid sensitive topics such as health, crime or politics.' : 'These are illustrations of invented people, not photos of anyone real.')}</tbody></table>`
}
function docDetails(e) {
  clipStore.link = e.url; const host = (() => { try { return new URL(e.url).host } catch { return e.url } })();
  return `<p class="eyebrow">Document · ${esc(e.category)}</p><h1>${esc(e.name)}</h1><p>${esc(e.summary)}</p>
  <div class="meta"><span class="tag">${esc(e.category)}</span>${(e.audience || []).map(a => `<span class="tag">For ${esc(a)}</span>`).join('')}</div>
  <div class="row"><a class="btn solid" href="${esc(e.url)}" target="_blank" rel="noopener">Open documentation<span class="sr"> (opens in a new tab)</span></a><button class="btn" data-copy="link">Copy link</button><button class="btn" data-copy="md">Copy as Markdown (for AI)</button><button class="btn" data-copy="json">Copy JSON</button></div>
  <table class="detail"><tbody>${drow('Publisher', esc(e.publisher))}${drow('Address', `<a href="${esc(e.url)}" target="_blank" rel="noopener">${esc(host)}</a>`)}${drow('About this link', 'Mambo Database links to the official documentation and does not copy it. The content belongs to its publisher and keeps its own license.')}</tbody></table>`;
}
function iconDetails(e) {
  const set = ICON_SETS.find(x => x.id === e.setId) || {}, others = DATA.filter(x => x.type === 'icon' && x.name === e.name && x.id !== e.id).sort((a, b) => a.category.localeCompare(b.category));
  iconClip(e);
  return `<p class="eyebrow">Icon · ${esc(e.category)}</p><h1>${esc(e.name)}</h1><p>${esc(e.summary)}</p>
  <div class="meta"><span class="tag">${esc(e.category)}</span><span class="tag">Style: ${esc(e.style)}</span><span class="tag">${esc(e.license)}</span></div>
  <div class="iconhero"><div class="ih light" aria-hidden="true"><span id="ico-pv">${iconSvg(e, curIconSize)}</span></div><div class="ih dark" aria-hidden="true"><span id="ico-pv2">${iconSvg(e, curIconSize)}</span></div></div>
  <div class="row" style="align-items:end"><label class="f" style="min-width:140px"><span class="f-t">Size (px)</span><select id="ico-size" aria-label="Icon size in pixels">${[16, 20, 24, 32, 48, 64].map(n => `<option ${n === curIconSize ? 'selected' : ''}>${n}</option>`).join('')}</select></label>
  <button class="btn solid" data-copy="svg">Copy SVG</button><button class="btn" data-copy="jsx">Copy React (JSX)</button><button class="btn" data-copy="uri">Copy CSS background</button><button class="btn" id="ico-dl">Download .svg</button></div>
  <p class="note">The icon uses <code>currentColor</code>, so it takes the text color of wherever you place it. To use it in Figma, copy the SVG and paste it onto the canvas; it arrives as an editable vector.</p>
  <h2>License</h2><table class="detail"><tbody>
  ${drow('Design system', esc(e.category))}
  ${drow('Library', `<a href="${esc(set.website)}" target="_blank" rel="noopener">${esc(e.set)}</a> · ${esc(set.package || '')}`)}
  ${drow('License', `<a href="licenses/icons/${esc(e.libId || e.setId)}-LICENSE.txt" target="_blank" rel="noopener">${esc(e.license)}</a>. Keep the copyright notice when you redistribute the files.`)}
  ${drow('Copyright', esc(set.copyright || ''))}
  ${drow('Source', `<a href="${esc(set.source)}" target="_blank" rel="noopener">${esc(set.source)}</a>`)}
  ${set.note ? drow('Note', esc(set.note)) : ''}
  </tbody></table>
  ${others.length ? `<h2>The same icon in other design systems (${others.length})</h2><ul class="iconalt">${others.map(o => `<li><button class="name-btn" data-open="${esc(o.id)}"><span class="ia" aria-hidden="true">${iconSvg(o, 28)}</span>${esc(o.category)}</button></li>`).join('')}</ul>` : ''}`;
}
function renderEntry(e) {
  Object.keys(clipStore).forEach(k => delete clipStore[k]);
  clipStore.md = e.md; clipStore.json = JSON.stringify(e, (k, v) => k === 'md' || (k === 'svg' && e.photo) ? undefined : v, 2);
  const back = '';
  if (e.type === 'icon') return iconDetails(e);
  if (e.type === 'document') return docDetails(e);
  if (e.type === 'profile') return profileDetails(e);
  if (e.type === 'component') {
    curStates = applyPref(e, statesFor(e, cur())); curOS = PREF.os.filter(o => e.os && e.os[o]);
    clipStore.html = e.code.html; clipStore.js = e.code.js || '';
    const sy = cur();
    return `${back}<p class="eyebrow">${esc(e.category)} · ${esc(e.level || '')}</p><h1>${esc(e.name)}</h1><p>${esc(e.summary)}</p>${meta(e)}
  <div class="row"><button class="btn solid" id="figma-copy">Copy HTML + CSS for Figma</button><button class="btn" id="dl-html">Download .html (all variants)</button><button class="btn" data-copy="md">Copy as Markdown (for AI)</button><button class="btn" data-copy="json">Copy JSON</button></div>
  ${addToSystemRow('Add component')}
  <h2>Variants</h2><p class="note">Every state side by side, left to right, like variant frames in Figma. Pointer states (hover, pressed) are shown forced on.</p>
  ${(e.os && (e.os.ios || e.os.android)) ? `<div class="states" id="osbox" role="group" aria-label="Show device variants"><span class="f-t">Also show</span>${['ios', 'android'].filter(o => e.os[o]).map(o => `<label class="chk"><input type="checkbox" data-os="${o}" ${curOS.includes(o) ? 'checked' : ''}>${OS_LABEL[o]} variant</label>`).join('')}</div>` : ''}
  <div id="frames" class="frames" role="group" aria-label="All states of ${esc(e.name)}"></div>
  <div class="dbhead" style="margin:0"><h2>Coded version</h2><button type="button" class="btn sm" id="pv-reset">Reset demo</button></div><p class="note">The full component as it ships, running as real HTML, CSS and JavaScript. Try it with the keyboard.</p><iframe class="preview" id="pv" title="Coded version of ${esc(e.name)}" sandbox="allow-same-origin allow-scripts" srcdoc="${esc(previewDoc(e, curStates, curOS))}"></iframe>
  <h2>States</h2><p class="note">${sy ? `Matched to <b>${esc(sy.name)}</b>: only states you use are included.` : 'No design system selected, so every state is included. Pick one in the sidebar to match it.'} Default is always included, and the download contains every variant.</p>
  <div class="states" id="statebox">${(e.states || []).map(s => `<label class="chk" title="${esc(s.note || '')}"><input type="checkbox" data-st="${s.id}" ${curStates.includes(s.id) ? 'checked' : ''}>${esc(s.label)}${s.when === 'pointer' ? ' <span class="tag">pointer only</span>' : ''}</label>`).join('') || '<span class="empty">No extra states.</span>'}</div>
  <h2>Anatomy</h2><table><thead><tr><th>Part</th><th>Required</th><th>Purpose</th></tr></thead><tbody>${e.anatomy.map(a => `<tr><td><b>${esc(a.part)}</b></td><td>${a.required ? 'Yes' : 'Optional'}</td><td>${esc(a.purpose)}</td></tr>`).join('')}</tbody></table>
  <h2>Variants and content limits</h2>${e.variants.map(v => `<h3>${esc(v.name)}</h3><p>${esc(v.use)}</p><ul class="plain">${Object.entries(v.contentLimits).map(([k, x]) => `<li><b>${esc(k)}:</b> ${esc(x)}</li>`).join('')}</ul>`).join('')}
  <h2>When to use</h2>${ul(e.whenToUse)}<h2>When not to use</h2>${ul(e.whenNotToUse)}
  ${e.alternatives ? `<p><b>Alternatives:</b> ${e.alternatives.map(a => compById(a) ? `<a href="#/entry/${esc(a)}">${esc(compById(a).name)}</a>` : esc(a)).join(', ')}</p>` : ''}
  <h2>Tokens (variables)</h2><div>${(e.tokens || []).map(t => `<span class="tag">${esc(t)}</span>`).join('')}</div>
  <h2>Accessibility</h2><p><b>Role:</b> ${esc(e.accessibility.role)}</p><h3>Keyboard</h3>${ul(e.accessibility.keyboard)}<h3>Focus</h3><p>${esc(e.accessibility.focus)}</p><h3>Notes</h3>${ul(e.accessibility.notes)}
  <h2>Code</h2><div id="codewrap"></div>`;
  }
  if (e.type === 'color') {
    clipStore.vars = ':root {\n' + Object.entries(e.roles).map(([k, v]) => `  --color-${k}: ${v};`).join('\n') + '\n}';
    return `${back}<p class="eyebrow">Color · ${esc(e.category)}</p><h1>${esc(e.name)}</h1><p>${esc(e.summary)}</p>${meta(e)}
  <p><b>Mood:</b> ${esc(e.mood || '')}</p>
  <div class="row"><button class="btn solid" data-copy="vars">Copy CSS variables</button><button class="btn" data-copy="md">Copy as Markdown (for AI)</button><button class="btn" data-copy="json">Copy JSON</button></div>
  ${addToSystemRow('Add colors')}
  <h2>Roles</h2><div class="swatches">${Object.entries(e.roles).map(([k, v]) => `<div class="sw" tabindex="0" data-tip="${tipData(k, v, Object.entries(e.roles).filter(([x]) => x !== k).map(([x, y]) => ({ name: x, hex: y })), true)}"><i style="background:${esc(v)}"></i><span>${esc(k)}<br>${esc(v)}</span></div>`).join('')}</div>
  <h2>Colorblind check</h2>${cvdNotice(cvdColors(e), '')}${e.category === 'accessible' ? '<p class="note">This set is in the Accessible colors category because it is built from a published color-blind safe palette. These are chosen to stay distinguishable for the common red-green and blue-yellow types. Total color blindness (achromatopsia) is rare and depends on lightness alone, so some pairs below may still be listed. Always add an icon or text as well, so color is never the only signal.</p>' : ''}
  <h2>Contrast checks</h2><table><thead><tr><th>Pair</th><th>Ratio</th><th>Normal text (4.5)</th><th>Large text / UI (3)</th></tr></thead><tbody>${e.contrast.map(c => `<tr><td>${esc(c.fg)} on ${esc(c.bg)}</td><td>${c.ratio.toFixed(2)}:1 <a class="lnk" href="${webaimUrl(e.roles[c.fg], e.roles[c.bg])}" target="_blank" rel="noopener">WebAIM<span class="sr"> (opens in a new tab): ${esc(c.fg)} on ${esc(c.bg)}</span></a></td><td class="${c.normalText ? 'pass' : 'fail'}">${c.normalText ? '✓ Pass' : '✕ Fail'}</td><td class="${c.largeTextAndUI ? 'pass' : 'fail'}">${c.largeTextAndUI ? '✓ Pass' : '✕ Fail'}</td></tr>`).join('')}</tbody></table>
  <h2>Guidance</h2>${ul(e.guidance)}${e.credit ? `<h2>Source</h2><p>${esc(e.credit.text)} <a href="${esc(e.credit.url)}" target="_blank" rel="noopener">Read the source<span class="sr"> (opens in a new tab)</span></a></p>` : ''}`;
  }
  clipStore.css = e.css; clipStore.woff2 = e.woff2; clipStore.csslink = cssLink(e); loadFontCss(e.name);
  const fb = f => ({ serif: 'Georgia, serif', monospace: 'ui-monospace, monospace' }[(FONTMAP.get(f) || [])[1]] || 'system-ui, sans-serif');
  const pairCard = p => { const mineIsDisplay = p.role === 'body'; const dispF = mineIsDisplay ? e.name : p.family, bodyF = mineIsDisplay ? p.family : e.name; loadFontCss(p.family);
    return `<article class="pair"><div class="pair-h"><button class="name-btn" data-open="${esc(p.id)}">${esc(p.family)}</button><span class="tag">${p.role === 'body' ? 'Body font' : 'Header / Display font'}</span></div>
    <p class="note">This works as the ${p.role === 'body' ? 'body' : 'header / display'} font for ${esc(e.name)}.</p>
    <p>${esc(p.why)}</p>
    <div class="pair-pv"><div style="font:700 26px/1.2 '${esc(dispF)}',${fb(dispF)}">The quick brown fox</div><div style="font:400 16px/1.6 '${esc(bodyF)}',${fb(bodyF)}">Body text sits underneath the heading. Good typography is mostly about readable spacing and clear hierarchy.</div></div>
    <p class="note">Suggested weights: ${esc(dispF)} ${p.displayWeights.join(', ')} · ${esc(bodyF)} ${p.bodyWeights.join(', ')}</p>
    <div class="row addpair"><label class="f"><span class="f-t">Add to</span><select data-pairsys aria-label="Design system for the ${esc(p.family)} pairing">${sysOptions()}</select></label><button class="btn solid sm" data-usepair="${esc(p.id)}">Add pairing</button><span class="empty" role="status" data-pairmsg></span></div></article>` };
  return `${back}<p class="eyebrow">Typography · ${esc(e.category)}</p><h1>${esc(e.name)}</h1><p>${esc(e.summary)}</p>${meta(e)}
  <div class="row"><button class="btn solid" data-copy="css">Copy CSS</button><button class="btn" data-copy="md">Copy as Markdown (for AI)</button><button class="btn" data-copy="json">Copy JSON</button><a class="btn" href="${esc(e.source)}" target="_blank" rel="noopener">View on Google Fonts</a></div>
  ${addToSystemRow('Add typeface')}
  <h2>Preview</h2><div class="fsample" style="font-family:'${esc(e.name)}',${fb(e.name)};font-size:32px;line-height:1.3">${esc(e.name)}<br><span style="font-size:18px">ABCDEFGHIJKLMNOPQRSTUVWXYZ abcdefghijklmnopqrstuvwxyz 0123456789</span></div>
  <h2>Typography details</h2>${typeDetails(e)}
  <h2>Pairings (${e.pairings.length})</h2><p class="note">Every pairing is checked: both fonts are on Google Fonts, the suggested weights exist, and the body font is a text face. Open one to see its own pairings.</p>
  <div class="pairs">${e.pairings.map(pairCard).join('')}</div>
  <h2>CSS</h2>${codeBlock('CSS', e.css, 'css')}`;
}
function refreshComponent(e) {
  clipStore.css = compCss(e, curStates, curOS); clipStore.both = `<!-- ${e.name} -->\n<style>\n${clipStore.css}\n</style>\n${compBody(e, curOS)}${e.code.js ? '\n<script>\n' + e.code.js + '\n<\/script>' : ''}`;
  const cw = $('#codewrap'); if (cw) cw.innerHTML = codeBlock('HTML', e.code.html, 'html') + codeBlock('CSS (with selected states)', clipStore.css, 'css') + (e.code.js ? codeBlock('JS', e.code.js, 'js') : '');
  const fr = $('#frames'); if (fr) renderFrames(fr, e, curStates, [''].concat(curOS));
  const pv = $('#pv'); if (pv) { pv.srcdoc = previewDoc(e, curStates, curOS); pv.onload = () => { try { pv.style.height = Math.min(1100, Math.max(e.code.pvHeight || 260, pv.contentDocument.documentElement.scrollHeight + 4)) + 'px' } catch { } } }
}
function wireEntry(e, root) {
  if (e.type === 'profile') {
    $('#pf-png', root).onclick = async () => download(profFile(e) + '.png', await svgToPngBlob(e.svg, 512), 'image/png'); if ($('#pf-svg', root)) $('#pf-svg', root).onclick = () => download(profFile(e) + '.svg', e.svg, 'image/svg+xml');
    $('#pf-cpimg', root).onclick = async () => { try { await navigator.clipboard.write([new ClipboardItem({ 'image/png': svgToPngBlob(e.svg, 512) })]); toast('Copied image') } catch { copy(e.svg, 'image as SVG code (this browser cannot copy pictures)') } };
    root.addEventListener('click', ev => { const b = ev.target.closest('[data-copy]'); if (b) copy(clipStore[b.dataset.copy], b.textContent.replace(/^Copy /, '').toLowerCase()) }); return
  }
  if (e.type === 'document') { root.addEventListener('click', ev => { const b = ev.target.closest('[data-copy]'); if (b) copy(clipStore[b.dataset.copy], b.dataset.copy === 'link' ? 'link' : b.textContent.replace(/^Copy /, '').toLowerCase()) }); return }
  if (e.type === 'icon') {
    const sz = $('#ico-size'), upd = () => { curIconSize = +sz.value; iconClip(e); $('#ico-pv').innerHTML = iconSvg(e, curIconSize); $('#ico-pv2').innerHTML = iconSvg(e, curIconSize) };
    sz.addEventListener('change', upd); $('#ico-dl').onclick = () => download(e.setId + '-' + e.name.toLowerCase().replace(/ /g, '-') + '.svg', clipStore.svg, 'image/svg+xml');
    $$('[data-open]', root).forEach(b => b.onclick = () => go('#/entry/' + b.dataset.open));
    root.addEventListener('click', ev => { const b = ev.target.closest('[data-copy]'); if (b) copy(clipStore[b.dataset.copy], b.textContent.replace(/^Copy /, '').toLowerCase()) });
    return;
  }
  if (e.type === 'component') {
    refreshComponent(e);
    $$('[data-os]').forEach(i => i.onchange = () => { const o = i.dataset.os; PREF.os = i.checked ? [...new Set([...PREF.os, o])] : PREF.os.filter(x => x !== o); savePref(); curOS = PREF.os.filter(x => e.os && e.os[x]); refreshComponent(e) });
    $$('[data-st]').forEach(i => i.onchange = () => { const a = new Set(curStates), id = i.dataset.st; i.checked ? a.add(id) : a.delete(id); curStates = [...a]; PREF.on = PREF.on.filter(x => x !== id); PREF.off = PREF.off.filter(x => x !== id); (i.checked ? PREF.on : PREF.off).push(id); savePref(); refreshComponent(e) });
    $('#pv-reset').onclick = () => { const pv = $('#pv'); pv.srcdoc = previewDoc(e, curStates, curOS) + '<!-- ' + Date.now() + ' -->' };
    $('#figma-copy').onclick = async () => { await copy(clipStore.both, 'HTML + CSS'); showFigma('html') };
    $('#dl-html').onclick = () => download(e.id + '.html', compDoc(e, curStates, curOS), 'text/html');
  }
  const systemFrom = async sel => { const id = sel.value; if (id === '__new') { const n = await ask({ title: 'Name your design system', input: { label: 'Name', value: 'My design system' }, confirm: 'Create' }); if (!n) return null; const s = newSystem({ name: n }); S.systems.push(s); return s } return S.systems.find(x => x.id === id) };
  const targetSystem = () => systemFrom($('#addsys'));
  const syncSys = (v, from) => { S.last = v; saveStore(); $$('#addsys,[data-pairsys]').forEach(sel => { if (sel !== from && sel.value !== v && [...sel.options].some(o => o.value === v)) { sel.value = v; sel.dispatchEvent(new Event('change')) } }) };
  $$('#addsys,[data-pairsys]').forEach(sel => sel.addEventListener('change', () => { if (sel.value !== '__new') syncSys(sel.value, sel) }));
  $$('[data-usepair]').forEach(b => b.onclick = async () => { const sel = $('[data-pairsys]', b.closest('.pair')), s = await systemFrom(sel); if (!s) return; const p = e.pairings.find(x => x.id === b.dataset.usepair), pd = p.role === 'body'; const mk = (role, fam, w) => ({ id: uid(), role, family: fam, weights: w.slice() }); s.fonts = s.fonts.filter(f => !['Display', 'Body'].includes(f.role)); s.fonts.unshift(mk('Display', pd ? e.name : p.family, p.displayWeights), mk('Body', pd ? p.family : e.name, p.bodyWeights)); S.last = s.id; S.active = s.id; saveStore(); toast('Pairing added to ' + s.name); $('[data-pairmsg]', b.closest('.pair')).innerHTML = `${CHECK} Added to ${esc(s.name)}. <a href="#/systems">Open it</a>` });
  $$('.pair [data-open]').forEach(b => b.onclick = () => go('#/entry/' + b.dataset.open));
  $('#addbtn').onclick = async () => {
    const s = await targetSystem(); if (!s) return;
    if (e.type === 'component') { s.components = s.components.filter(c => c.id !== e.id); s.components.push({ id: e.id, states: curStates.slice(), os: curOS.slice() }) }
    else if (e.type === 'color') { Object.entries(e.roles).forEach(([k, v]) => { if (k === 'border') return; const role = SET_ROLE[k] || 'Other'; if (!s.colors.some(c => c.hex === v && c.role === role)) s.colors.push({ id: uid(), name: role, hex: v, role, source: e.name }) }) }
    else { const role = e.roles[0] === 'display' ? 'Display' : e.roles[0] === 'mono' ? 'Mono' : 'Body'; s.fonts = s.fonts.filter(f => f.role !== role); s.fonts.push({ id: uid(), role, family: e.name, weights: keepThree(e.weights.filter(w => [400, 500, 600, 700].includes(w))) }) }
    S.last = s.id; S.active = s.id; saveStore(); $('#addmsg').innerHTML = `${CHECK} Added to ${esc(s.name)}.${route().view === 'systems' ? '' : ' <a href="#/systems">Open it</a>'}`; toast('Added to ' + s.name); if (onEntryAdded && route().view === 'systems') onEntryAdded(s);
  };
  root.addEventListener('click', ev => { const b = ev.target.closest('[data-copy]'); if (b) copy(clipStore[b.dataset.copy], b.textContent.replace(/^Copy /, '').toLowerCase().split(' (')[0]) });
}
const SET_ROLE = { success: 'Success', warning: 'Warning', info: 'Info', bg: 'Background', surface: 'Surface', ink: 'Text', 'text-secondary': 'Text secondary', primary: 'Primary', 'primary-text': 'Inverse text', accent: 'Accent', danger: 'Danger', 'border-strong': 'Border', 'text-primary': 'Text' };
