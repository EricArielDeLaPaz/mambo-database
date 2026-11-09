/* ===== Browse: database view ===== */
const B = { q: '', types: new Set(), cats: new Set(), plats: new Set(), industry: 'all', tags: new Set(), sort: 'name', dir: 1 };
const clipStore = {}; let curStates = [];
const route = () => { const h = location.hash.replace(/^#\/?/, ''); if (h === 'systems') return { view: 'systems' }; if (h.startsWith('entry/')) return { view: 'browse', id: h.slice(6) }; return { view: 'browse' } };
const go = h => { location.hash = h };

function matches(e) {
  if (B.types.size && !B.types.has(e.type)) return false;
  if (B.cats.size && !B.cats.has(e.category)) return false;
  if (B.plats.size) { const p = e.platforms || []; if (![...B.plats].some(x => p.includes(x))) return false }
  if (B.industry !== 'all') { const i = e.industries || ['all']; if (!(i.includes('all') || i.includes(B.industry))) return false }
  if (B.tags.size) { const t = e.tags || []; if (![...B.tags].every(x => t.includes(x))) return false }
  const q = B.q.trim().toLowerCase(); if (!q) return true;
  return (e.name + ' ' + e.summary + ' ' + (e.category || '') + ' ' + (e.tags || []).join(' ') + ' ' + (e.md || '')).toLowerCase().includes(q);
}
const countBy = (fn, items) => { const m = {}; items.forEach(e => [].concat(fn(e) || []).forEach(k => m[k] = (m[k] || 0) + 1)); return m };
const checkbox = (grp, val, label, n, on) => `<label class="chk"><input type="checkbox" data-grp="${grp}" value="${esc(val)}" ${on ? 'checked' : ''}><span>${esc(label)}</span><span class="n">${n}</span></label>`;

function renderBrowse() {
  const r = route(), e = r.id && DATA.find(x => x.id === r.id);
  $('#app').innerHTML = `<div class="layout"><aside id="side" aria-label="Filters"></aside><main id="main" tabindex="-1"></main></div>`;
  renderFilters();
  if (e) { $('#main').innerHTML = renderEntry(e); wireEntry(e); upgradeSelects($('#main')) } else renderResults();
}
const filtersActive = () => !!(B.q.trim() || B.types.size || B.cats.size || B.plats.size || B.tags.size || B.industry !== 'all');
function renderFilters() {
  const types = countBy(e => e.type, DATA), cats = countBy(e => e.category, DATA.filter(e => !B.types.size || B.types.has(e.type))), plats = countBy(e => e.platforms, DATA), tags = countBy(e => e.tags, DATA);
  const catList = Object.keys(cats).sort();
  $('#side').innerHTML = `<p class="wordmark"><img src="mambo.png" alt="">Mambo Database</p>
  <label class="f" style="margin-bottom:10px"><span class="eyebrow f-t">Design system</span><select id="syssel"><option value="">None</option>${S.systems.map(s => `<option value="${s.id}" ${S.active === s.id ? 'selected' : ''}>${esc(s.name)}</option>`).join('')}</select></label>
  <label for="q" class="eyebrow">Search</label>
  <input id="q" type="search" placeholder="modal, contrast, finance..." autocomplete="off" value="${esc(B.q)}">
  <fieldset><legend class="eyebrow">Type</legend>${Object.keys(TYPE).map(t => checkbox('types', t, TYPE_PLURAL[t], types[t] || 0, B.types.has(t))).join('')}</fieldset>
  <fieldset><legend class="eyebrow">Category</legend>${catList.map(c => checkbox('cats', c, c, cats[c], B.cats.has(c))).join('')}</fieldset>
  <fieldset><legend class="eyebrow">Platform</legend>${Object.keys(PLAT).map(p => checkbox('plats', p, PLAT[p], plats[p] || 0, B.plats.has(p))).join('')}</fieldset>
  <fieldset><legend class="eyebrow"><label for="ind">Industry</label></legend><select id="ind">${INDUSTRIES.map(([k, l]) => `<option value="${k}" ${B.industry === k ? 'selected' : ''}>${esc(l)}</option>`).join('')}</select></fieldset>
  <fieldset><legend class="eyebrow">Tags</legend><div class="chips">${Object.keys(tags).sort().map(t => `<button class="chip" aria-pressed="${B.tags.has(t)}" data-tag="${esc(t)}">${esc(t)}</button>`).join('')}</div></fieldset>
  <div class="row"><button class="btn sm" id="clear" ${filtersActive() ? "" : "disabled"}>Clear filters</button></div>`;
  upgradeSelects($('#side'));
  $('#syssel').onchange = ev => { S.active = ev.target.value || null; saveStore(); if (route().id) renderBrowse(); else renderResults() };
  $('#q').oninput = ev => { B.q = ev.target.value; afterFilter(false); const c = $('#clear'); if (c) c.disabled = !filtersActive() };
  $$('input[data-grp]', $('#side')).forEach(i => i.onchange = () => { const s = B[i.dataset.grp]; i.checked ? s.add(i.value) : s.delete(i.value); if (i.dataset.grp === 'types') { B.cats.forEach(c => { if (B.types.size && !DATA.some(e => e.category === c && B.types.has(e.type))) B.cats.delete(c) }) } afterFilter(i.dataset.grp === 'types') });
  $('#ind').onchange = ev => { B.industry = ev.target.value; afterFilter(false); const c = $('#clear'); if (c) c.disabled = !filtersActive() };
  $$('[data-tag]', $('#side')).forEach(b => b.onclick = () => { const t = b.dataset.tag; B.tags.has(t) ? B.tags.delete(t) : B.tags.add(t); afterFilter(true) });
  $('#clear').onclick = () => { B.q = ''; B.types.clear(); B.cats.clear(); B.plats.clear(); B.tags.clear(); B.industry = 'all'; if (route().id) go('#/'); else { renderFilters(); renderResults() } };
}
function afterFilter(refresh) { if (route().id) { go('#/') } else { if (refresh) renderFilters(); renderResults() } }
const sortVal = (e, k) => k === 'name' ? e.name : k === 'type' ? TYPE[e.type] : k === 'category' ? e.category : k === 'platforms' ? (e.platforms || []).join() : (e.industries || ['all']).join();
function renderResults() {
  const items = DATA.filter(matches).sort((a, b) => sortVal(a, B.sort).localeCompare(sortVal(b, B.sort)) * B.dir);
  const th = (k, l) => `<th scope="col" aria-sort="${B.sort === k ? (B.dir > 0 ? 'ascending' : 'descending') : 'none'}"><button data-sort="${k}">${l}${B.sort === k ? `<span class="sortc ${B.dir > 0 ? '' : 'flip'}">${CHEV}</span>` : ''}</button></th>`;
  $('#main').innerHTML = `<div class="dbhead"><div><p class="eyebrow">Database</p><h1>Browse everything</h1></div><p class="empty" role="status">${items.length} of ${DATA.length} entries${B.industry !== 'all' ? ' · industry: ' + esc(indLabel(B.industry)) : ''}</p></div>
  ${items.length ? `<table class="db"><thead><tr>${th('name', 'Name')}${th('type', 'Type')}${th('category', 'Category')}${th('platforms', 'Platforms')}${th('industries', 'Industries')}</tr></thead><tbody>${items.map(e => `<tr>
   <td data-l="Name"><button class="name-btn" data-open="${esc(e.id)}">${esc(e.name)}</button><span class="sum">${esc(e.summary)}</span>${e.type === 'color' ? `<span class="swatchrow" aria-hidden="true">${Object.entries(e.roles).slice(0, 8).map(([k, c]) => `<i style="background:${esc(c)}" data-tip="${tipData(k, c, Object.entries(e.roles).filter(([x]) => x !== k).map(([x, y]) => ({ name: x, hex: y })), true)}"></i>`).join('')}</span>` : ''}</td>
   <td data-l="Type">${TYPE[e.type]}</td><td data-l="Category">${esc(e.category)}</td>
   <td data-l="Platforms">${(e.platforms || []).map(p => `<span class="tag">${esc(PLAT[p] || p)}</span>`).join('') || '<span class="empty">n/a</span>'}</td>
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
const meta = e => `<div class="meta">${(e.platforms || []).map(p => `<span class="tag">${esc(PLAT[p] || p)}</span>`).join('')}${(e.industries || ['all']).map(i => `<span class="tag">Industry: ${esc(indLabel(i))}</span>`).join('')}${(e.tags || []).map(t => `<span class="tag">#${esc(t)}</span>`).join('')}</div>`;
function addToSystemRow(kind) {
  const def = S.active || (S.systems[0] && S.systems[0].id) || '__new';
  return `<div class="panel addrow"><h2 style="font-size:16px;margin:0 0 8px">Add to a design system</h2><div class="row" style="margin:0;align-items:end"><label class="f" style="min-width:220px"><span class="f-t">Design system</span><select id="addsys">${S.systems.map(s => `<option value="${s.id}" ${def === s.id ? 'selected' : ''}>${esc(s.name)}</option>`).join('')}<option value="__new" ${def === '__new' ? 'selected' : ''}>+ New design system</option></select></label><button class="btn solid" id="addbtn">${kind}</button><span id="addmsg" role="status" class="empty"></span></div></div>`;
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
  clipStore.css = e.css;
  return `${back}<p class="eyebrow">Typography · ${esc(e.category)}</p><h1>${esc(e.name)}</h1><p>${esc(e.summary)}</p>${meta(e)}
  <div class="row"><button class="btn solid" data-copy="css">Copy CSS</button><button class="btn" data-copy="md">Copy as Markdown (for AI)</button><button class="btn" data-copy="json">Copy JSON</button></div>
  ${addToSystemRow('Use pairing')}
  <h2>Roles</h2><table><thead><tr><th>Role</th><th>Family</th><th>Weights</th><th>Use</th></tr></thead><tbody>${e.roles.map(r => `<tr><td>${esc(r.role)}</td><td>${esc(r.family)}</td><td>${r.weights.join(', ')}</td><td>${esc(r.use)}</td></tr>`).join('')}</tbody></table>
  <h2>Type scale</h2><table><thead><tr><th>Token</th><th>Size</th><th>Line height</th></tr></thead><tbody>${e.scale.map(s => `<tr><td>${esc(s.token)}</td><td>${esc(s.size)}</td><td>${esc(s.lineHeight)}</td></tr>`).join('')}</tbody></table>
  <h2>Why it works</h2><p>${esc(e.whyItWorks)}</p><h2>Avoid</h2>${ul(e.avoid)}<h2>CSS</h2>${codeBlock('CSS', e.css, 'css')}
  <p class="note">All three families are on Google Fonts, which are open source and built into Figma.</p>`;
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
  $('#addbtn').onclick = async () => {
    let id = $('#addsys').value, s;
    if (id === '__new') { const n = await ask({ title: 'Name your design system', input: { label: 'Name', value: 'My design system' }, confirm: 'Create' }); if (!n) return; s = newSystem({ name: n }); S.systems.push(s) } else s = S.systems.find(x => x.id === id);
    if (e.type === 'component') { s.components = s.components.filter(c => c.id !== e.id); s.components.push({ id: e.id, states: curStates.slice() }) }
    else if (e.type === 'color') { Object.entries(e.roles).forEach(([k, v]) => { if (k === 'border') return; const role = SET_ROLE[k] || 'Other'; if (!s.colors.some(c => c.hex === v && c.role === role)) s.colors.push({ id: uid(), name: role, hex: v, role, source: e.name }) }) }
    else { s.fonts = e.roles.map(r => ({ id: uid(), role: r.role === 'display' ? 'Display' : r.role === 'mono' ? 'Mono' : 'Body', family: r.family, weights: r.weights.slice() })) }
    S.active = s.id; saveStore(); $('#addmsg').innerHTML = `${CHECK} Added to ${esc(s.name)}. <a href="#/systems">Open it</a>`; toast('Added to ' + s.name);
  };
  $('#main').addEventListener('click', ev => { const b = ev.target.closest('[data-copy]'); if (b) copy(clipStore[b.dataset.copy], b.textContent.replace(/^Copy /, '').toLowerCase().split(' (')[0]) });
  $('#main').focus({ preventScroll: true }); window.scrollTo(0, 0);
}
const SET_ROLE = { bg: 'Background', surface: 'Surface', ink: 'Text', 'text-secondary': 'Text secondary', primary: 'Primary', 'primary-text': 'Inverse text', accent: 'Accent', danger: 'Danger', 'border-strong': 'Border', 'text-primary': 'Text' };
