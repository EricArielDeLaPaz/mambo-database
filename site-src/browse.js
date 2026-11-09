/* ===== Browse: database view ===== */
const B = { q: '', types: new Set(), cats: new Set(), plats: new Set(), inds: new Set(), scope: 'name', sort: 'name', dir: 1 };
const clipStore = {}; let curStates = [];
const route = () => { const h = location.hash.replace(/^#\/?/, ''); if (h === 'systems') return { view: 'systems' }; if (h.startsWith('entry/')) return { view: 'browse', id: h.slice(6) }; return { view: 'browse' } };
const go = h => { location.hash = h };

function matches(e) {
  if (B.types.size && !B.types.has(e.type)) return false;
  if (B.cats.size && !B.cats.has(e.category)) return false;
  if (!platOk(e)) return false;
  if (B.inds.size) { const i = e.industries || ['all']; if (!(i.includes('all') || [...B.inds].some(x => i.includes(x)))) return false }
  const q = B.q.trim().toLowerCase(); if (!q) return true;
  return (B.scope === 'name' ? e.name : e.summary).toLowerCase().includes(q);
}
/* Platform only narrows components; colors and typography always show. */
const platOk = e => !B.plats.size || e.type !== 'component' || (e.platforms || []).some(x => B.plats.has(x));
const hl = t => { const q = B.q.trim(); if (!q) return esc(t); const re = new RegExp('(' + q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'ig'); return String(t).split(re).map((x, i) => i % 2 ? '<mark>' + esc(x) + '</mark>' : esc(x)).join('') };
const countBy = (fn, items) => { const m = {}; items.forEach(e => [].concat(fn(e) || []).forEach(k => m[k] = (m[k] || 0) + 1)); return m };
const checkbox = (grp, val, label, n, on) => `<label class="chk"><input type="checkbox" data-grp="${grp}" value="${esc(val)}" ${on ? 'checked' : ''}><span>${esc(label)}</span><span class="n">${n}</span></label>`;

function renderBrowse() {
  const r = route(), e = r.id && DATA.find(x => x.id === r.id);
  $('#app').innerHTML = `<div class="layout"><aside id="side" aria-label="Filters"></aside><main id="main" tabindex="-1"></main></div>`;
  renderFilters();
  if (e) { $('#main').innerHTML = renderEntry(e); wireEntry(e); upgradeSelects($('#main')) } else renderResults();
}
const filtersActive = () => !!(B.q.trim() || B.types.size || B.cats.size || B.plats.size || B.inds.size);
function renderFilters() {
  const types = countBy(e => e.type, DATA), cats = countBy(e => e.category, DATA.filter(e => (!B.types.size || B.types.has(e.type)) && platOk(e))), plats = countBy(e => e.platforms, DATA.filter(e => e.type === 'component')), inds = countBy(e => (e.industries || ['all']).includes('all') ? INDUSTRIES.slice(1).map(i => i[0]) : e.industries, DATA);
  const catList = Object.keys(cats).sort();
  $('#side').innerHTML = `<p class="wordmark"><img src="mambo.png" alt="">Mambo Database</p>
  <label class="f" style="margin-bottom:10px"><span class="eyebrow f-t">Design system</span><select id="syssel"><option value="">None</option>${S.systems.map(s => `<option value="${s.id}" ${S.active === s.id ? 'selected' : ''}>${esc(s.name)}</option>`).join('')}</select></label>
  <label for="q" class="eyebrow">Search</label>
  <input id="q" type="search" placeholder="${B.scope === 'name' ? 'Search names' : 'Search descriptions'}" autocomplete="off" value="${esc(B.q)}">
  <div class="scope" role="group" aria-label="Search in">${[['name', 'Name'], ['description', 'Description']].map(([k, l]) => `<button type="button" class="chip" data-scope="${k}" aria-pressed="${B.scope === k}">${l}</button>`).join('')}</div>
  <fieldset><legend class="eyebrow">Type</legend>${[['', 'All', DATA.length]].concat(Object.keys(TYPE).map(t => [t, TYPE_PLURAL[t], types[t] || 0])).map(([v, l, n]) => `<label class="chk"><input type="radio" name="type" data-type value="${v}" ${(B.types.has(v) || (!v && !B.types.size)) ? 'checked' : ''}><span>${esc(l)}</span><span class="n">${n}</span></label>`).join('')}</fieldset>
  ${B.types.size === 1 ? `<fieldset><legend class="eyebrow">${esc(TYPE_PLURAL[[...B.types][0]])} category</legend>${catList.map(c => checkbox('cats', c, c, cats[c], B.cats.has(c))).join('')}</fieldset>` : ''}
  <fieldset><legend class="eyebrow">Platform <span class="note" style="text-transform:none;letter-spacing:0;font-family:var(--font-body)">(components)</span></legend>${Object.keys(PLAT).map(p => checkbox('plats', p, PLAT[p], plats[p] || 0, B.plats.has(p))).join('')}</fieldset>
  <fieldset><legend class="eyebrow">Industry</legend>${INDUSTRIES.slice(1).map(([k, l]) => checkbox('inds', k, l, inds[k] || 0, B.inds.has(k))).join('')}</fieldset>
  <div class="row"><button class="btn sm" id="clear" ${filtersActive() ? "" : "disabled"}>Clear filters</button></div>`;
  upgradeSelects($('#side'));
  $$('[data-scope]', $('#side')).forEach(b => b.onclick = () => { B.scope = b.dataset.scope; renderFilters(); if (route().id) go('#/'); else renderResults() });
  $('#syssel').onchange = ev => { S.active = ev.target.value || null; saveStore(); if (route().id) renderBrowse(); else renderResults() };
  $('#q').oninput = ev => { B.q = ev.target.value; afterFilter(false); const c = $('#clear'); if (c) c.disabled = !filtersActive() };
  $$('input[data-type]', $('#side')).forEach(i => i.onchange = () => { B.types = i.value ? new Set([i.value]) : new Set(); B.cats.clear(); afterFilter(true) });
  $$('input[data-grp]', $('#side')).forEach(i => i.onchange = () => { const s = B[i.dataset.grp]; i.checked ? s.add(i.value) : s.delete(i.value); afterFilter(true) });
  $('#clear').onclick = () => { B.q = ''; B.types.clear(); B.cats.clear(); B.plats.clear(); B.inds.clear(); if (route().id) go('#/'); else { renderFilters(); renderResults() } };
}
function afterFilter(refresh) { if (route().id) { go('#/') } else { if (refresh) renderFilters(); renderResults() } }
const sortVal = (e, k) => k === 'name' ? e.name : k === 'type' ? TYPE[e.type] : k === 'category' ? e.category : k === 'platforms' ? (e.platforms || []).join() : (e.industries || ['all']).join();
function renderResults() {
  const items = DATA.filter(matches).sort((a, b) => sortVal(a, B.sort).localeCompare(sortVal(b, B.sort)) * B.dir);
  const th = (k, l) => `<th scope="col" aria-sort="${B.sort === k ? (B.dir > 0 ? 'ascending' : 'descending') : 'none'}"><button data-sort="${k}">${l}${B.sort === k ? `<span class="sortc ${B.dir > 0 ? '' : 'flip'}">${CHEV}</span>` : ''}</button></th>`;
  $('#main').innerHTML = `<div class="dbhead"><div><p class="eyebrow">Database</p><h1>Browse everything</h1></div><p class="empty" role="status">${items.length} of ${DATA.length} entries</p></div>
  ${items.length ? `<table class="db"><thead><tr>${th('name', 'Name')}${th('type', 'Type')}${B.types.size === 1 ? th('category', 'Category') : ''}${th('platforms', 'Platforms')}${th('industries', 'Industries')}</tr></thead><tbody>${items.map(e => `<tr>
   <td data-l="Name"><button class="name-btn" data-open="${esc(e.id)}">${B.scope === 'name' ? hl(e.name) : esc(e.name)}</button><span class="sum">${B.scope === 'description' ? hl(e.summary) : esc(e.summary)}</span>${e.type === 'color' ? `<span class="swatchrow" aria-hidden="true">${Object.entries(e.roles).slice(0, 8).map(([k, c]) => `<i style="background:${esc(c)}" data-tip="${tipData(k, c, Object.entries(e.roles).filter(([x]) => x !== k).map(([x, y]) => ({ name: x, hex: y })), true)}"></i>`).join('')}</span>` : ''}</td>
   <td data-l="Type">${TYPE[e.type]}</td>${B.types.size === 1 ? `<td data-l="Category">${esc(e.category)}</td>` : ''}
   <td data-l="Platforms">${(e.platforms || []).map(p => `<span class="tag">${esc(PLAT[p] || p)}</span>`).join('') || '<span class="empty">Any</span>'}</td>
   <td data-l="Industries">${(e.industries || ['all']).map(i => `<span class="tag">${esc(indLabel(i))}</span>`).join('')}</td></tr>`).join('')}</tbody></table>` : '<p class="empty">No entries match these filters. Try clearing some.</p>'}`;
  $$('[data-sort]', $('#main')).forEach(b => b.onclick = () => { const k = b.dataset.sort; if (B.sort === k) B.dir *= -1; else { B.sort = k; B.dir = 1 } renderResults() });
  $$('[data-open]', $('#main')).forEach(b => b.onclick = () => go('#/entry/' + b.dataset.open));
}
const ul = a => '<ul class="plain">' + (a || []).map(x => `<li>${esc(x)}</li>`).join('') + '</ul>';
const codeBlock = (label, code, id) => `<div class="codehead"><strong>${label}</strong><button class="btn sm" data-copy="${id}">Copy</button></div><pre><code>${esc(code)}</code></pre>`;
function previewDoc(e, ids) {
  const fix = 'html,body{min-height:100%}body{margin:0;padding:32px;box-sizing:border-box;background:#fafafa;font-family:system-ui,sans-serif}.pv{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:16px;min-height:240px}dialog{position:static!important;margin:0!important;display:block}.sheet-scrim{display:none}.sheet{position:static!important;width:min(100%,380px);border-radius:20px!important}';
  return `<!doctype html><meta charset=utf-8><style>${compCss(e, ids)}\n${fix}</style><div class="pv">${e.code.html.replace('<dialog ', '<dialog open ')}</div>`;
}
const meta = e => `<div class="meta">${(e.platforms || []).map(p => `<span class="tag">${esc(PLAT[p] || p)}</span>`).join('')}${(e.industries || ['all']).map(i => `<span class="tag">Industry: ${esc(indLabel(i))}</span>`).join('')}</div>`;
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
function renderEntry(e) {
  Object.keys(clipStore).forEach(k => delete clipStore[k]);
  clipStore.md = e.md; clipStore.json = JSON.stringify(e, (k, v) => k === 'md' ? undefined : v, 2);
  const back = `<button class="btn sm back" id="back"><span style="display:inline-flex;transform:rotate(90deg)">${CHEV}</span> Back to results</button>`;
  if (e.type === 'component') {
    curStates = statesFor(e, cur());
    clipStore.html = e.code.html; clipStore.js = e.code.js || '';
    const sy = cur();
    return `${back}<p class="eyebrow">${esc(e.category)} · ${esc(e.level || '')}</p><h1>${esc(e.name)}</h1><p>${esc(e.summary)}</p>${meta(e)}
  <div class="row"><button class="btn solid" id="figma-copy">Copy HTML + CSS for Figma</button><button class="btn" id="dl-html">Download .html (all variants)</button><button class="btn" data-copy="md">Copy as Markdown (for AI)</button><button class="btn" data-copy="json">Copy JSON</button></div>
  ${addToSystemRow('Add component')}
  <h2>Live preview</h2><iframe class="preview" id="pv" title="Preview of ${esc(e.name)}" sandbox="allow-same-origin" srcdoc="${esc(previewDoc(e, curStates))}"></iframe>
  <h2>States</h2><p class="note">${sy ? `Matched to <b>${esc(sy.name)}</b>: only states you use are included.` : 'No design system selected, so every state is included. Pick one in the sidebar to match it.'} Default is always included, and the download contains every variant.</p>
  <div class="states" id="statebox">${(e.states || []).map(s => `<label class="chk" title="${esc(s.note || '')}"><input type="checkbox" data-st="${s.id}" ${curStates.includes(s.id) ? 'checked' : ''}>${esc(s.label)}${s.when === 'pointer' ? ' <span class="tag">pointer only</span>' : ''}</label>`).join('') || '<span class="empty">No extra states.</span>'}</div>
  <h2>Anatomy</h2><table><thead><tr><th>Part</th><th>Required</th><th>Purpose</th></tr></thead><tbody>${e.anatomy.map(a => `<tr><td><b>${esc(a.part)}</b></td><td>${a.required ? 'Yes' : 'Optional'}</td><td>${esc(a.purpose)}</td></tr>`).join('')}</tbody></table>
  <h2>Variants and content limits</h2>${e.variants.map(v => `<h3>${esc(v.name)}</h3><p>${esc(v.use)}</p><ul class="plain">${Object.entries(v.contentLimits).map(([k, x]) => `<li><b>${esc(k)}:</b> ${esc(x)}</li>`).join('')}</ul>`).join('')}
  <h2>When to use</h2>${ul(e.whenToUse)}<h2>When not to use</h2>${ul(e.whenNotToUse)}
  ${e.alternatives ? `<p><b>Alternatives:</b> ${e.alternatives.map(a => compById(a) ? `<a href="#/entry/${esc(a)}">${esc(compById(a).name)}</a>` : esc(a)).join(', ')}</p>` : ''}
  <h2>Tokens</h2><div>${(e.tokens || []).map(t => `<span class="tag">${esc(t)}</span>`).join('')}</div>
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
  <h2>Contrast checks</h2><table><thead><tr><th>Pair</th><th>Ratio</th><th>Normal text (4.5)</th><th>Large text / UI (3)</th></tr></thead><tbody>${e.contrast.map(c => `<tr><td>${esc(c.fg)} on ${esc(c.bg)}</td><td>${c.ratio}:1</td><td class="${c.normalText ? 'pass' : 'fail'}">${c.normalText ? '✓ Pass' : '✕ Fail'}</td><td class="${c.largeTextAndUI ? 'pass' : 'fail'}">${c.largeTextAndUI ? '✓ Pass' : '✕ Fail'}</td></tr>`).join('')}</tbody></table>
  <h2>Guidance</h2>${ul(e.guidance)}`;
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
  clipStore.css = compCss(e, curStates); clipStore.both = `<!-- ${e.name} -->\n<style>\n${clipStore.css}\n</style>\n${e.code.html}`;
  const cw = $('#codewrap'); if (cw) cw.innerHTML = codeBlock('HTML', e.code.html, 'html') + codeBlock('CSS (with selected states)', clipStore.css, 'css') + (e.code.js ? codeBlock('JS', e.code.js, 'js') : '');
  const pv = $('#pv'); if (pv) { pv.srcdoc = previewDoc(e, curStates); pv.onload = () => { try { pv.style.height = Math.min(620, Math.max(260, pv.contentDocument.documentElement.scrollHeight + 4)) + 'px' } catch { } } }
}
function wireEntry(e) {
  $('#back').onclick = () => go('#/');
  if (e.type === 'component') {
    refreshComponent(e);
    $$('[data-st]').forEach(i => i.onchange = () => { const a = new Set(curStates); i.checked ? a.add(i.dataset.st) : a.delete(i.dataset.st); curStates = [...a]; refreshComponent(e) });
    $('#figma-copy').onclick = async () => { await copy(clipStore.both, 'HTML + CSS'); showFigma('html') };
    $('#dl-html').onclick = () => { download(e.id + '.html', compDoc(e, curStates), 'text/html'); showFigma('html') };
  }
  const systemFrom = async sel => { const id = sel.value; if (id === '__new') { const n = await ask({ title: 'Name your design system', input: { label: 'Name', value: 'My design system' }, confirm: 'Create' }); if (!n) return null; const s = newSystem({ name: n }); S.systems.push(s); return s } return S.systems.find(x => x.id === id) };
  const targetSystem = () => systemFrom($('#addsys'));
  const syncSys = (v, from) => { S.last = v; saveStore(); $$('#addsys,[data-pairsys]').forEach(sel => { if (sel !== from && sel.value !== v && [...sel.options].some(o => o.value === v)) { sel.value = v; sel.dispatchEvent(new Event('change')) } }) };
  $$('#addsys,[data-pairsys]').forEach(sel => sel.addEventListener('change', () => { if (sel.value !== '__new') syncSys(sel.value, sel) }));
  $$('[data-usepair]').forEach(b => b.onclick = async () => { const sel = $('[data-pairsys]', b.closest('.pair')), s = await systemFrom(sel); if (!s) return; const p = e.pairings.find(x => x.id === b.dataset.usepair), pd = p.role === 'body'; const mk = (role, fam, w) => ({ id: uid(), role, family: fam, weights: w.slice() }); s.fonts = s.fonts.filter(f => !['Display', 'Body'].includes(f.role)); s.fonts.unshift(mk('Display', pd ? e.name : p.family, p.displayWeights), mk('Body', pd ? p.family : e.name, p.bodyWeights)); S.last = s.id; S.active = s.id; saveStore(); toast('Pairing added to ' + s.name); $('[data-pairmsg]', b.closest('.pair')).innerHTML = `${CHECK} Added to ${esc(s.name)}. <a href="#/systems">Open it</a>` });
  $$('.pair [data-open]').forEach(b => b.onclick = () => go('#/entry/' + b.dataset.open));
  $('#addbtn').onclick = async () => {
    const s = await targetSystem(); if (!s) return;
    if (e.type === 'component') { s.components = s.components.filter(c => c.id !== e.id); s.components.push({ id: e.id, states: curStates.slice() }) }
    else if (e.type === 'color') { Object.entries(e.roles).forEach(([k, v]) => { if (k === 'border') return; const role = SET_ROLE[k] || 'Other'; if (!s.colors.some(c => c.hex === v && c.role === role)) s.colors.push({ id: uid(), name: role, hex: v, role, source: e.name }) }) }
    else { const role = e.roles[0] === 'display' ? 'Display' : e.roles[0] === 'mono' ? 'Mono' : 'Body'; s.fonts = s.fonts.filter(f => f.role !== role); s.fonts.push({ id: uid(), role, family: e.name, weights: keepThree(e.weights.filter(w => [400, 500, 600, 700].includes(w))) }) }
    S.last = s.id; S.active = s.id; saveStore(); $('#addmsg').innerHTML = `${CHECK} Added to ${esc(s.name)}. <a href="#/systems">Open it</a>`; toast('Added to ' + s.name);
  };
  $('#main').addEventListener('click', ev => { const b = ev.target.closest('[data-copy]'); if (b) copy(clipStore[b.dataset.copy], b.textContent.replace(/^Copy /, '').toLowerCase().split(' (')[0]) });
  $('#main').focus({ preventScroll: true }); window.scrollTo(0, 0);
}
const SET_ROLE = { bg: 'Background', surface: 'Surface', ink: 'Text', 'text-secondary': 'Text secondary', primary: 'Primary', 'primary-text': 'Inverse text', accent: 'Accent', danger: 'Danger', 'border-strong': 'Border', 'text-primary': 'Text' };
