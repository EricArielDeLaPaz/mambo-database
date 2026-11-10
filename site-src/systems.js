/* ===== Design Systems ===== */
const FONT_ROLES = ['Display', 'Heading', 'Subheading', 'Body', 'Caption', 'Label', 'Button', 'Quote', 'Mono'];
const FILL_ORDER = ['Body', 'Display', 'Heading', 'Mono', 'Caption', 'Label'];
const WEIGHTS = [[100, 'Thin'], [200, 'Extra Light'], [300, 'Light'], [400, 'Regular'], [500, 'Medium'], [600, 'Semi Bold'], [700, 'Bold'], [800, 'Extra Bold'], [900, 'Black']];
const WPRIORITY = [400, 700, 600, 500, 300, 800, 200, 900, 100];
const keepThree = a => WPRIORITY.filter(w => a.includes(w)).slice(0, 3).sort((x, y) => x - y);
/* Ranges are guidance drawn from published design-system writing (EightShapes, UXPin), not a single study. */
const LIMITS = { brand: { min: 1, rec: 3, max: 4 }, neutral: { min: 3, max: 8 }, feedback: { min: 2, max: 4 }, colors: { min: 6, rec: 14, max: 16 }, families: 2, weights: 3, radii: 4 };
const DEFAULT_HEX = { Primary: '#1d4ed8', Secondary: '#0f766e', Tertiary: '#7c3aed', Accent: '#b45309', Background: '#ffffff', Surface: '#fafafa', Border: '#8a8a8a', Text: '#0a0a0a', 'Text secondary': '#525252', Success: '#166534', Warning: '#92400e', Danger: '#b91c1c', Info: '#0369a1' };
const FONTMAP = new Map(FONTS.map(f => [f[0], f]));
const NON_FIGMA = [['SF Pro', 'https://developer.apple.com/fonts/', 'Apple fonts for Apple platforms'], ['Segoe UI', 'https://learn.microsoft.com/en-us/typography/font-list/segoe-ui', 'Windows system font'], ['Helvetica Neue', null], ['Avenir Next', null], ['Proxima Nova', null], ['Futura', null], ['Gotham', null]];
const NOT_IN_FIGMA = 'This typeface isn\'t built into Figma. If you plan to use it, download it and install it on your computer (or have an admin upload it) before using it in Figma.';
const findLink = n => 'https://www.google.com/search?q=' + encodeURIComponent(n + ' font download');
const dragging = { type: null, ids: [] };

function renderSystems() {
  $('#app').innerHTML = `<div class="sys-layout"><aside class="sys-side" id="sside" aria-label="Your design systems"></aside><main id="main" tabindex="-1"></main></div>`;
  renderTree(); renderEditor();
}
async function deleteSystems(ids) {
  const names = S.systems.filter(s => ids.includes(s.id)).map(s => s.name);
  const ok = await ask({ title: ids.length > 1 ? `Delete ${ids.length} design systems?` : `Delete "${names[0]}"?`, body: 'This permanently removes ' + (ids.length > 1 ? 'them' : 'it') + ' from this browser. This cannot be undone.', confirm: 'Delete', danger: true });
  if (!ok) return; S.systems = S.systems.filter(s => !ids.includes(s.id)); ids.forEach(i => S.checked.delete(i)); if (!cur()) S.active = null; saveStore(); renderTree(); renderEditor();
}
async function deleteFolder(f) {
  const n = S.systems.filter(s => s.folder === f).length;
  if (!await ask({ title: `Delete folder "${f}"?`, body: n ? `It holds ${n} design system${n > 1 ? 's' : ''}. They move to Unsorted.` : 'The folder is empty.', confirm: 'Delete folder', danger: true })) return;
  S.systems.forEach(s => { if (s.folder === f) s.folder = 'Unsorted' }); S.folders = S.folders.filter(x => x !== f); saveStore(); renderTree(); renderEditor();
}
async function renameFolderPrompt(o) { const n = await ask({ title: 'Rename folder', input: { label: 'Folder name', value: o }, confirm: 'Rename' }); if (n) commitFolderName(o, n) }
function commitFolderName(o, n) { n = (n || '').trim(); if (!n || n === o) return renderTree(); if (S.folders.includes(n)) { toast('That folder already exists.'); return renderTree() } S.folders = S.folders.map(f => f === o ? n : f); S.systems.forEach(s => { if (s.folder === o) s.folder = n }); saveStore(); renderTree(); renderEditor() }
function inlineEdit(btn, value, commit) {
  const input = document.createElement('input'); input.type = 'text'; input.value = value; input.className = 'inl'; input.setAttribute('aria-label', 'Name'); input.maxLength = 60;
  btn.replaceWith(input); input.focus(); input.setSelectionRange(0, 0); let done = false;
  const fin = ok => { if (done) return; done = true; ok ? commit(input.value) : renderTree() };
  input.onkeydown = e => { if (e.key === 'Enter') { e.preventDefault(); fin(true) } else if (e.key === 'Escape') { e.preventDefault(); fin(false) } e.stopPropagation() };
  input.onblur = () => fin(true);
}
function moveSystems(ids, folder, beforeId) {
  const moving = S.systems.filter(s => ids.includes(s.id)); if (!moving.length) return;
  moving.forEach(s => s.folder = folder); S.systems = S.systems.filter(s => !ids.includes(s.id));
  const idx = beforeId ? S.systems.findIndex(s => s.id === beforeId) : -1;
  if (idx >= 0) S.systems.splice(idx, 0, ...moving); else S.systems.push(...moving);
  saveStore(); renderTree();
}
function exportMenu(s, x, y) {
  ctxMenu(x, y, [
    { label: 'Everything (.zip)', act: () => { download(slug(s.name) + '.zip', exportZip(s)); showFigma('tokens') } },
    { label: 'Tokens (.json)', act: () => { download(slug(s.name) + '.tokens.json', JSON.stringify(tokens(s), null, 2), 'application/json'); showFigma('tokens') } },
    { label: 'CSS variables (.css)', act: () => download(slug(s.name) + '.css', cssVars(s), 'text/css') },
    { label: 'Components (.html)', disabled: !s.components.length, why: 'Add a component first', act: () => { const all = s.components.map(c => compById(c.id)).filter(Boolean); download(slug(s.name) + '-components.html', `<!doctype html><html lang="en"><meta charset="utf-8"><title>${esc(s.name)} components</title><style>body{margin:0;padding:32px;font-family:system-ui,sans-serif}section{margin-bottom:48px}h2{font:700 14px ui-monospace,monospace;text-transform:uppercase;color:#525252}</style>${s.components.map(c => { const e = compById(c.id); return e ? `<section><h2>${esc(e.name)}</h2><style>${compCss(e, c.states)}</style>${e.code.html}</section>` : '' }).join('')}</html>`, 'text/html'); showFigma('html') } },
    { label: 'Summary (.md)', act: () => download(slug(s.name) + '.md', systemReadme(s), 'text/markdown') }
  ]);
}
function systemMenu(s, x, y) {
  ctxMenu(x, y, [
    { label: 'Open', act: () => { S.active = s.id; renderTree(); renderEditor() } },
    { label: 'Rename', act: () => { const b = $(`[data-open="${s.id}"]`); b ? inlineEdit(b, s.name, v => { s.name = v.trim() || s.name; saveStore(); renderTree(); renderEditor() }) : 0 } },
    { label: 'Export everything (.zip)', act: () => { download(slug(s.name) + '.zip', exportZip(s)); showFigma('tokens') } },
    { label: 'Export tokens (.json)', act: () => { download(slug(s.name) + '.tokens.json', JSON.stringify(tokens(s), null, 2), 'application/json'); showFigma('tokens') } },
    '-', { label: 'Delete', danger: true, act: () => deleteSystems([s.id]) }
  ]);
}
function renderTree() {
  const folderOf = f => S.systems.filter(s => s.folder === f);
  $('#sside').innerHTML = `<p class="wordmark"><img src="mambo.png" alt="">Mambo Database</p>
  <div class="row" style="margin-top:0"><button class="btn solid sm" id="newsys">+ New system</button><button class="btn sm" id="newfolder">+ New folder</button></div>
  ${S.systems.length ? '<p class="note" style="margin:0 0 6px">Double-click to rename, right-click for more, drag to move.</p>' : '<p class="empty">No systems yet. Create one to get started.</p>'}
  ${S.folders.map(f => { const items = folderOf(f), open = !S.collapsed.has(f); return `<div class="folder" data-folder="${esc(f)}"><div class="folder-h" ${f !== 'Unsorted' ? 'draggable="true"' : ''} data-fh="${esc(f)}"><input type="checkbox" aria-label="Select all in ${esc(f)}" data-folder-all="${esc(f)}" ${items.length && items.every(s => S.checked.has(s.id)) ? 'checked' : ''} ${items.length ? '' : 'disabled'}>
   <button class="fold" data-fold="${esc(f)}" aria-expanded="${open}"><span class="foldc ${open ? '' : 'closed'}">${CHEV}</span><span class="fname">${esc(f)}</span> <span class="n">(${items.length})</span></button></div>
   ${open ? items.map(s => `<div class="sysrow" draggable="true" data-sid="${s.id}" ${S.active === s.id ? 'aria-current="true"' : ''}><input type="checkbox" aria-label="Select ${esc(s.name)}" data-check="${s.id}" ${S.checked.has(s.id) ? 'checked' : ''}><button data-open="${s.id}">${esc(s.name)}</button></div>`).join('') || '<p class="empty dropnote">Empty. Drop a system here.</p>' : ''}</div>` }).join('')}
  ${S.checked.size ? `<div class="bulk" role="group" aria-label="Actions for ${S.checked.size} selected"><b>${S.checked.size} selected</b>
   <label class="f"><span class="f-t">Move to folder</span><select id="moveto"><option value="">Choose...</option>${S.folders.map(f => `<option>${esc(f)}</option>`).join('')}</select></label>
   <div class="row" style="margin:0"><button class="btn sm" id="bjson">Download JSON</button><button class="btn sm" id="bcss">Download CSS</button><button class="btn sm danger" id="bdel">Delete</button></div></div>` : ''}`;
  const q = s => $(s, $('#sside')), qa = s => $$(s, $('#sside'));
  upgradeSelects($('#sside'));
  q('#newsys').onclick = () => { const s = newSystem(); S.systems.push(s); S.active = s.id; saveStore(); renderTree(); renderEditor(); $('#main').focus() };
  q('#newfolder').onclick = async () => { const n = await ask({ title: 'New folder', input: { label: 'Folder name' }, confirm: 'Create' }); if (!n) return; if (S.folders.includes(n)) return toast('That folder already exists.'); S.folders.push(n); saveStore(); renderTree() };
  qa('[data-open]').forEach(b => { b.onclick = () => { if (S.active === b.dataset.open) return; S.active = b.dataset.open; saveStore(); qa('.sysrow').forEach(r => r.removeAttribute('aria-current')); b.closest('.sysrow').setAttribute('aria-current', 'true'); renderEditor() }; b.ondblclick = () => { const s = S.systems.find(x => x.id === b.dataset.open); inlineEdit(b, s.name, v => { s.name = v.trim() || s.name; saveStore(); renderTree(); renderEditor() }) } });
  qa('[data-check]').forEach(i => i.onchange = () => { i.checked ? S.checked.add(i.dataset.check) : S.checked.delete(i.dataset.check); renderTree(); renderEditor() });
  qa('[data-folder-all]').forEach(i => i.onchange = () => { folderOf(i.dataset.folderAll).forEach(s => i.checked ? S.checked.add(s.id) : S.checked.delete(s.id)); renderTree(); renderEditor() });
  qa('[data-fold]').forEach(b => { const f = b.dataset.fold; let t = 0; b.onclick = () => { clearTimeout(t); t = setTimeout(() => { S.collapsed.has(f) ? S.collapsed.delete(f) : S.collapsed.add(f); renderTree() }, 230) }; if (f !== 'Unsorted') b.ondblclick = () => { clearTimeout(t); S.collapsed.delete(f); inlineEdit(b, f, v => commitFolderName(f, v)) } });
  /* right-click */
  qa('.sysrow').forEach(r => r.oncontextmenu = e => { e.preventDefault(); const s = S.systems.find(x => x.id === r.dataset.sid); if (S.checked.size > 1 && S.checked.has(s.id)) ctxMenu(e.clientX, e.clientY, [{ label: `Delete ${S.checked.size} selected`, danger: true, act: () => deleteSystems([...S.checked]) }]); else systemMenu(s, e.clientX, e.clientY) });
  qa('.folder-h').forEach(h => h.oncontextmenu = e => { e.preventDefault(); const f = h.dataset.fh; const items = [{ label: 'New system here', act: () => { const s = newSystem({ folder: f }); S.systems.push(s); S.active = s.id; saveStore(); renderTree(); renderEditor() } }]; if (f !== 'Unsorted') items.push({ label: 'Rename', act: () => { const b = $(`[data-fold="${CSS.escape(f)}"]`, $('#sside')); b && inlineEdit(b, f, v => commitFolderName(f, v)) } }, '-', { label: 'Delete folder', danger: true, act: () => deleteFolder(f) }); ctxMenu(e.clientX, e.clientY, items) });
  /* drag and drop */
  qa('.sysrow').forEach(r => { r.ondragstart = e => { const id = r.dataset.sid; dragging.type = 'sys'; dragging.ids = S.checked.has(id) ? [...S.checked] : [id]; e.dataTransfer.effectAllowed = 'move'; e.dataTransfer.setData('text/plain', id); r.classList.add('dragging') }; r.ondragend = () => { dragging.type = null; qa('.over,.dragging').forEach(x => x.classList.remove('over', 'dragging')) };
    r.ondragover = e => { if (dragging.type === 'sys') { e.preventDefault(); r.classList.add('over-row') } }; r.ondragleave = () => r.classList.remove('over-row');
    r.ondrop = e => { if (dragging.type !== 'sys') return; e.preventDefault(); e.stopPropagation(); const t = S.systems.find(x => x.id === r.dataset.sid); if (!dragging.ids.includes(t.id)) moveSystems(dragging.ids, t.folder, t.id) } });
  qa('.folder-h[draggable]').forEach(h => { h.ondragstart = e => { dragging.type = 'folder'; dragging.ids = [h.dataset.fh]; e.dataTransfer.effectAllowed = 'move'; e.dataTransfer.setData('text/plain', h.dataset.fh) }; h.ondragend = () => { dragging.type = null } });
  qa('.folder').forEach(fd => { const f = fd.dataset.folder;
    fd.ondragover = e => { if (dragging.type === 'sys' || (dragging.type === 'folder' && dragging.ids[0] !== f && f !== 'Unsorted')) { e.preventDefault(); fd.classList.add('over') } }; fd.ondragleave = e => { if (!fd.contains(e.relatedTarget)) fd.classList.remove('over') };
    fd.ondrop = e => { e.preventDefault(); fd.classList.remove('over'); if (dragging.type === 'sys') moveSystems(dragging.ids, f); else if (dragging.type === 'folder') { const a = dragging.ids[0]; S.folders = S.folders.filter(x => x !== a); S.folders.splice(S.folders.indexOf(f), 0, a); saveStore(); renderTree() } } });
  const mv = q('#moveto'); if (mv) mv.onchange = () => { if (!mv.value) return; moveSystems([...S.checked], mv.value); toast('Moved'); renderEditor() };
  const bj = q('#bjson'); if (bj) { bj.onclick = () => { const o = {}; S.systems.filter(s => S.checked.has(s.id)).forEach(s => o[s.name] = tokens(s)); download('design-systems.tokens.json', JSON.stringify(o, null, 2), 'application/json'); showFigma('tokens') }; q('#bcss').onclick = () => download('design-systems.css', S.systems.filter(s => S.checked.has(s.id)).map(s => '/* ' + s.name + ' */\n' + cssVars(s)).join('\n'), 'text/css'); q('#bdel').onclick = () => deleteSystems([...S.checked]) }
}

/* ---- editor pieces ---- */
let curSys = null;
const isHid = k => !!(curSys && (curSys.hidden || []).includes(k));
const advice = (ok, label, text, fix, key) => {
  if (key && isHid(key)) return `<div class="advice hid"><span class="txt empty">Hidden: ${esc(label)}</span><button type="button" class="lnk" data-unhide="${esc(key)}">Unhide</button></div>`;
  return `<div class="advice ${ok ? '' : 'warn'}" role="note"><b aria-hidden="true">${ok ? '✓' : '✕'}</b><span class="sr">${ok ? 'Good: ' : 'Needs attention: '}</span><span class="txt"><strong>${esc(label)}.</strong> ${esc(text)}</span>${fix ? `<button class="fixbtn" data-fix="${esc(fix.k)}" ${fix.d ? `data-d="${esc(fix.d)}"` : ''} aria-label="Fix: ${esc(fix.l)}" data-tiptext="${esc(fix.l)}">${WRENCH}</button>` : ''}${key ? `<button type="button" class="lnk" data-hide="${esc(key)}" aria-label="Hide this note: ${esc(label)}">Hide</button>` : ''}</div>`;
};
function rangeAdvice(label, n, L, hint, roles, addRole, key) {
  const rec = L.rec || L.max, ok = n >= L.min && n <= rec;
  const text = n < L.min ? `Add at least ${L.min}. ${hint}` : n > L.max ? `Over the maximum of ${L.max}. Remove or merge some.` : n > rec ? `Above the recommended ${rec} (maximum ${L.max}).` : `${L.min} to ${rec} is the healthy range. ${hint}`;
  return advice(ok, `${n} ${label.toLowerCase()}`, text, n < L.min && addRole ? { k: 'addrole', l: 'Add a ' + addRole + ' color', d: addRole } : null, key);
}
function contrastBlock(c, s) {
  const others = s.colors.filter(o => o.id !== c.id && normHex(o.hex) && normHex(c.hex)); if (!others.length) return '';
  return others.map(o => {
    const r = ratio(c.hex, o.hex), bd = (l, ok) => `<span class="bd ${ok ? '' : 'no'}">${l} ${ok ? '✓' : '✕'}</span>`;
    const rg = (isRed(c.hex) && isGreen(o.hex)) || (isGreen(c.hex) && isRed(o.hex));
    let fix = '';
    if (r < 4.5) { const tgt = (BGROLES.includes(c.role) && !BGROLES.includes(o.role)) ? o : c, oth = tgt === c ? o : c, f = fixFg(tgt.hex, oth.hex, 4.5); const d = { n: tgt.name, from: tgt.hex, to: f, r0: fmtRatio(ratio(tgt.hex, oth.hex)), r1: fmtRatio(ratio(f, oth.hex)), bg: oth.hex, bgn: oth.name }; fix = `<button class="fixbtn" data-fixcolor="${tgt.id}" data-hex="${f}" aria-label="Fix: change ${esc(tgt.name)} to ${f}" data-tipfix="${esc(JSON.stringify(d))}">${WRENCH}</button>` }
    return `<div class="cr"><div class="aa" style="background:${o.hex};color:${c.hex}" aria-hidden="true">Aa</div><div class="meta"><b>on ${esc(o.name)}</b> ${esc(o.hex)} · <b>${fmtRatio(r)}:1</b>
     <div class="badges">${bd('AA', r >= 4.5)}${bd('AA large', r >= 3)}${bd('AAA', r >= 7)}${bd('AAA large', r >= 4.5)}${bd('UI 3:1', r >= 3)}${fix}</div>
     <div class="note"><a class="lnk" href="${webaimUrl(c.hex, o.hex)}" target="_blank" rel="noopener">Check on WebAIM<span class="sr"> (opens in a new tab): ${esc(c.name)} on ${esc(o.name)}</span></a></div>
     ${rg ? '<div class="note"><b>Red and green:</b> people with color blindness may not tell these apart even when the ratio looks fine. Add an icon or text.</div>' : ''}</div></div>`
  }).join('');
}
function checklist(s) {
  const has = r => s.colors.some(c => c.role === r), fam = s.fonts.filter(f => f.family.trim());
  const items = [[s.name.trim() && s.name !== 'Untitled system', 'Name your system', '#f-name'], [s.platforms.length > 0, 'Choose what it is for', '[data-plat]'], [has('Primary'), 'A Primary color', '#addcolor'], [has('Background') && has('Text'), 'A Background and a Text color', '#addcolor'], [has('Danger') && has('Success'), 'Success and Danger colors for feedback', '#addcolor'], [fam.some(f => f.role === 'Display' || f.role === 'Body'), 'At least a Body typeface', '#addfont'], [s.states.includes('focus'), 'A Focus state (always required for keyboard users)', '[data-state=focus]'], [!!s.spacing, 'A spacing base unit', '#f-space']];
  const done = items.filter(i => i[0]).length;
  return `<div class="panel"><h2>Setup checklist: ${done} of ${items.length}</h2><ul class="check">${items.map(([ok, l, t]) => `<li><b aria-hidden="true">${ok ? '✓' : '○'}</b><button type="button" class="lnk jump ${ok ? '' : 'empty'}" data-jump="${esc(t)}" aria-label="${ok ? 'Done' : 'Still needed'}: ${esc(l)}. Go to it.">${ok ? 'Done: ' : 'Still needed: '}${esc(l)}</button></li>`).join('')}</ul><p class="note" style="margin:8px 0 0">Select an item to jump to it.</p></div>`;
}
function jump(sel) {
  const el = $(sel, $('#main')); if (!el) return; let t = el; if (el.tagName === 'SELECT') { const b = el.closest('.f') && $('.dd-btn', el.closest('.f')); if (b) t = b }
  t.scrollIntoView({ block: 'center', behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' }); t.focus({ preventScroll: true });
  const pn = t.closest('.panel'); if (pn) { pn.classList.add('flash'); setTimeout(() => pn.classList.remove('flash'), 1600) }
}
/* components that most products need, in the order we suggest them */
const ESSENTIALS = ['button', 'text-input', 'checkbox', 'radio', 'toggle-switch', 'select', 'link', 'card', 'modal-dialog', 'tabs', 'toast', 'inline-alert', 'badge', 'top-navigation-bar'];
const PLAT_ESSENTIALS = { ios: ['ios-navigation-bar', 'bottom-tab-bar', 'ios-action-sheet', 'ios-swipe-actions', 'pull-to-refresh'], android: ['android-top-app-bar', 'android-navigation-bar', 'android-snackbar', 'floating-action-button', 'pull-to-refresh'], 'mobile-web': ['bottom-sheet', 'bottom-tab-bar'], tablet: ['navigation-rail', 'sidebar-navigation'], 'desktop-web': ['sidebar-navigation', 'table', 'menu'], 'desktop-app': ['sidebar-navigation', 'toolbar', 'menu'] };
const compOsDefault = (e, s) => ['ios', 'android'].filter(o => s.platforms.includes(o) && e.os && e.os[o]);
function suggestComponents(s) {
  const have = new Set(s.components.map(c => c.id)), seen = new Set(), ids = [];
  [...ESSENTIALS, ...s.platforms.flatMap(p => PLAT_ESSENTIALS[p] || [])].forEach(id => { if (seen.has(id)) return; seen.add(id); const e = compById(id); if (!e || have.has(id)) return; if (s.platforms.length && !(e.platforms || []).some(x => s.platforms.includes(x))) return; ids.push(id) });
  if (!ids.length) return s.components.length ? '' : '';
  return `<div class="dbhead" style="margin:18px 0 4px"><h3 style="margin:0">Suggested components</h3><button type="button" class="btn sm" id="addallcomp">Add all ${ids.length}</button></div><p class="note" style="margin:0 0 8px">The usual building blocks for ${s.platforms.length ? esc(s.platforms.map(p => PLAT[p]).join(', ')) : 'any product'}. Add the ones you need.</p>
  <div class="sugg">${ids.slice(0, 12).map(id => { const e = compById(id); return `<div class="sugg-card"><b>${esc(e.name)}</b><span class="note">${esc(e.summary)}</span><div class="row" style="margin:6px 0 0"><button type="button" class="btn sm" data-sugcomp="${esc(id)}" aria-label="Add ${esc(e.name)}">Add</button></div></div>` }).join('')}</div>${ids.length > 12 ? `<p class="note">${ids.length - 12} more suggested. Add all to include them.</p>` : ''}`;
}
function viewComponent(c) {
  const e = compById(c.id); if (!e) return;
  const api = openDialog(`<div class="mdl-f"><h2 id="mdl-t">${esc(e.name)}</h2><p>${esc(e.summary)}</p><p class="note">The states you ticked${(c.os || []).length ? ', with the ' + c.os.map(o => OS_LABEL[o]).join(' and ') + ' variant' + (c.os.length > 1 ? 's' : '') : ''}, side by side.</p><div id="vf" class="frames"></div><div class="row" style="justify-content:flex-end"><a class="btn sm" href="#/entry/${esc(e.id)}">Open in Browse</a><button type="button" class="btn solid sm" id="vclose">Close</button></div></div>`, 'wide');
  renderFrames($('#vf', api.el), e, c.states, [''].concat(c.os || [])); $('#vclose', api.el).onclick = () => api.close(null); $('a', api.el).onclick = () => api.close(null);
}
function suggestColors(s) {
  const sets = DATA.filter(e => e.type === 'color' && industryMatch(e));
  return `<div class="dbhead" style="margin:18px 0 4px"><h3 style="margin:0">Suggested for ${sysInds(s).includes('all') ? 'any industry' : esc(indSummary(s))}</h3><button class="viewall" data-viewall="color">View all <span aria-hidden="true">→</span></button></div>
  <div class="sugg">${sets.slice(0, 4).map(e => { const keys = Object.keys(e.roles); return `<div class="sugg-card"><b>${esc(e.name)}</b><span class="note">${esc(e.mood || '')}</span><div class="swatchrow">${['primary', 'accent', 'ink', 'surface'].filter(k => e.roles[k]).map(k => `<button class="chip nob" data-tip="${tipData(e.name + ' ' + k, e.roles[k], keys.filter(x => x !== k).map(x => ({ name: x, hex: e.roles[x] })))}" data-addcolor="${esc(e.roles[k])}" data-src="${esc(e.name)}" data-role="${SET_ROLE[k] || 'Other'}" aria-label="Add ${esc(e.name)} ${k} ${esc(e.roles[k])}"><i style="background:${esc(e.roles[k])}"></i></button>`).join('')}</div><button class="btn sm" data-addset="${esc(e.id)}" ${Object.entries(e.roles).filter(([k]) => k !== 'border').every(([k, v]) => s.colors.some(c => c.hex === v && c.source === e.name)) ? 'disabled' : ''}>Add whole set</button></div>` }).join('') || '<p class="empty">No suggestions for this industry yet.</p>'}</div>`;
}
function suggestFonts(s) {
  const pairs = []; DATA.filter(e => e.type === 'typeface' && industryMatch(e)).forEach(e => e.pairings.filter(p => p.role === 'body').forEach(p => pairs.push({ d: e, b: DATA.find(x => x.id === p.id), p })));
  const picks = pairs.sort((x, y) => x.d.name.localeCompare(y.d.name)).filter((x, i, a) => a.findIndex(z => z.d.id === x.d.id) === i).slice(0, 4);
  return `<div class="dbhead" style="margin:18px 0 4px"><h3 style="margin:0">Suggested pairings</h3><button class="viewall" data-viewall="typeface">View all <span aria-hidden="true">→</span></button></div><div class="sugg">${picks.map(x => `<div class="sugg-card"><b>${esc(x.d.name)} + ${esc(x.p.family)}</b><span class="note">Header / display + body. ${esc(x.p.why)}</span><div class="row" style="margin:8px 0 0"><button class="btn sm" data-usepair="${esc(x.d.id)}|${esc(x.p.id)}">Use this pairing</button></div></div>`).join('') || '<p class="empty">No pairings for this industry yet.</p>'}</div>`;
}
const sortColors = s => { const idx = r => { const i = ROLES.indexOf(r); return i < 0 ? 999 : i }; s.colors = s.colors.map((c, i) => [c, i]).sort((a, b) => idx(a[0].role) - idx(b[0].role) || a[1] - b[1]).map(x => x[0]) };
const GRIP = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><circle cx="9" cy="6" r="1.6"/><circle cx="15" cy="6" r="1.6"/><circle cx="9" cy="12" r="1.6"/><circle cx="15" cy="12" r="1.6"/><circle cx="9" cy="18" r="1.6"/><circle cx="15" cy="18" r="1.6"/></svg>';
function revealColor(id) { const el = document.getElementById('cc-' + id); if (!el) return; const r = el.getBoundingClientRect(); if (r.top < 90 || r.bottom > innerHeight - 10) el.scrollIntoView({ block: 'center', behavior: matchMedia('(prefers-reduced-motion:reduce)').matches ? 'auto' : 'smooth' }); el.classList.add('flash'); setTimeout(() => el.classList.remove('flash'), 1300) }
function colorCard(c, s) {
  const same = s.colors.filter(o => o.role === c.role && (o.source || '') === (c.source || '')), pos = same.indexOf(c);
  const others = s.colors.filter(o => o.id !== c.id);
  return `<div class="colorcard" data-grp="${esc(c.source || '')}" data-cid="${c.id}" id="cc-${c.id}"><div class="colortop"><div class="mv"><button type="button" class="grip" data-grip="${c.id}" aria-label="Drag ${esc(c.name)} to reorder" data-tiptext="Drag to reorder. Dropping on another role changes the role.">${GRIP}</button><button type="button" data-mv="-1" data-id="${c.id}" aria-label="Move ${esc(c.name)} up" ${pos <= 0 ? 'disabled' : ''}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 15 12 9 18 15"/></svg></button><button type="button" data-mv="1" data-id="${c.id}" aria-label="Move ${esc(c.name)} down" ${pos >= same.length - 1 ? 'disabled' : ''}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg></button></div><span class="pick" data-tip="${tipData(c.name, c.hex, others)}"><input type="color" value="${normHex(c.hex) || '#000000'}" data-cf="picker" aria-label="Pick color for ${esc(c.name)}"></span>
   <label class="f"><span class="f-t">Name</span><input type="text" data-cf="name" value="${esc(c.name)}"></label><label class="f"><span class="f-t">Hex</span><input type="text" data-cf="hex" value="${esc(c.hex)}" maxlength="7"></label>
   <label class="f"><span class="f-t">Role</span><select data-cf="role">${Object.entries(ROLE_GROUPS).map(([g, rs]) => `<optgroup label="${g}">${rs.map(r => `<option ${c.role === r ? 'selected' : ''}>${r}</option>`).join('')}</optgroup>`).join('')}</select></label><button class="btn sm" data-rmcolor="${c.id}">Remove</button></div>
   <div class="contrast-box" data-cb="${c.id}">${contrastBlock(c, s)}</div></div>`;
}
function colorGroups(s) {
  const srcs = [...new Set(s.colors.filter(c => c.source).map(c => c.source))], mine = s.colors.filter(c => !c.source);
  const groups = []; if (mine.length || !srcs.length) groups.push({ title: 'Your colors', items: mine }); srcs.forEach(src => groups.push({ title: 'From ' + src, src, items: s.colors.filter(c => c.source === src) }));
  return groups.map(g => `<section class="cgroup"><div class="cg-h"><h3>${esc(g.title)} <span class="tag">${g.items.length}</span></h3>${g.src ? `<button class="btn sm" data-rmsource="${esc(g.src)}">Remove set</button>` : ''}</div>${g.items.map(c => colorCard(c, s)).join('') || '<p class="empty">No colors yet. Add one below.</p>'}</section>`).join('');
}
/* font picker (searchable listbox) */
function loadFontCss(fam) { const g = FONTMAP.get(fam); if (!g || document.getElementById('gf-' + slug(fam))) return; const w = [400, 700].filter(x => g[2].includes(x)); const l = document.createElement('link'); l.id = 'gf-' + slug(fam); l.rel = 'stylesheet'; l.href = 'https://fonts.googleapis.com/css2?family=' + encodeURIComponent(fam).replace(/%20/g, '+') + ':wght@' + (w.length ? w : [g[2][0]]).join(';') + '&display=swap'; document.head.appendChild(l) }
function fontPicker(f) {
  const inF = FONTMAP.has(f.family), known = inF || NON_FIGMA.some(n => n[0] === f.family);
  return `<div class="fp" data-fp="${f.id}"><button type="button" class="dd-btn fp-btn" aria-haspopup="listbox" aria-expanded="false" aria-label="Typeface: ${esc(f.family || 'none chosen')}"><span class="dd-val">${esc(f.family || 'Choose a typeface')}</span>${CHEV}</button>
   ${f.family && !inF ? `<a class="dlbtn" href="${esc((NON_FIGMA.find(n => n[0] === f.family) || [])[1] || findLink(f.family))}" target="_blank" rel="noopener" data-tiptext="${esc(NOT_IN_FIGMA)}" data-figmafont aria-label="Download ${esc(f.family)}. Not built into Figma.">${DL}</a>` : ''}
   <div class="dd-list fp-list" hidden><input type="search" class="fp-search" placeholder="Search ${FONTS.length.toLocaleString()} fonts" aria-label="Search typefaces"><div class="fp-cats" role="group" aria-label="Category">${['all', 'sans-serif', 'serif', 'display', 'handwriting', 'monospace'].map(c => `<button type="button" class="chip" data-fcat="${c}" aria-pressed="${c === 'all'}">${c === 'all' ? 'All' : c}</button>`).join('')}</div><div class="fp-opts" role="listbox" aria-label="Typefaces"></div></div></div>`;
}
function wireFontPicker(root, s, onPick) {
  $$('.fp', root).forEach(fp => {
    const f = s.fonts.find(x => x.id === fp.dataset.fp), btn = $('.fp-btn', fp), list = $('.fp-list', fp), search = $('.fp-search', fp), opts = $('.fp-opts', fp); let cat = 'all';
    const close = focus => { list.hidden = true; btn.setAttribute('aria-expanded', 'false'); fp.classList.remove('open'); if (ddOpen && ddOpen.wrap === fp) ddOpen = null; if (focus) btn.focus() };
    const draw = () => {
      const q = search.value.trim().toLowerCase();
      const g = FONTS.filter(x => (cat === 'all' || x[1] === cat) && (!q || x[0].toLowerCase().includes(q)));
      const n = NON_FIGMA.filter(x => cat === 'all' && (!q || x[0].toLowerCase().includes(q)));
      const row = (name, extra = '') => `<div class="dd-opt" role="option" tabindex="-1" data-fam="${esc(name)}" aria-selected="${f.family === name}"><span>${esc(name)}</span>${extra}</div>`;
      opts.innerHTML = `<div class="dd-grp" role="presentation">Built into Figma (Google Fonts) · ${g.length}</div>` + g.slice(0, 80).map(x => row(x[0], `<span class="tag">${esc(x[1])}</span>${f.family === x[0] ? CHECK : ''}`)).join('') + (g.length > 80 ? `<div class="dd-more">Showing 80 of ${g.length}. Keep typing to narrow it down.</div>` : '') +
        (n.length ? `<div class="dd-grp" role="presentation">Not built into Figma</div>` + n.map(x => row(x[0], `<a class="dlbtn" href="${esc(x[1] || findLink(x[0]))}" target="_blank" rel="noopener" data-tiptext="${esc(NOT_IN_FIGMA)}" data-figmafont aria-label="Download ${esc(x[0])}. Not built into Figma.">${DL}</a>`)).join('') : '') +
        (q && !g.length && !n.length ? row(search.value.trim(), `<a class="dlbtn" href="${esc(findLink(search.value.trim()))}" target="_blank" rel="noopener" data-tiptext="${esc(NOT_IN_FIGMA)}" data-figmafont aria-label="Find a download for ${esc(search.value.trim())}. Not built into Figma.">${DL}</a>`).replace('<span>', '<span>Use "').replace('</span>', '"</span>') : '');
    };
    const open = () => { if (ddOpen) ddOpen.close(); list.hidden = false; btn.setAttribute('aria-expanded', 'true'); fp.classList.add('open'); ddOpen = { wrap: fp, close }; draw(); list.classList.remove('up'); const r = list.getBoundingClientRect(); if (r.bottom > innerHeight - 8 && btn.getBoundingClientRect().top > r.height + 16) list.classList.add('up'); search.focus() };
    btn.onclick = () => list.hidden ? open() : close(true);
    btn.onkeydown = e => { if (e.key === 'ArrowDown') { e.preventDefault(); open() } };
    search.oninput = draw;
    $$('[data-fcat]', fp).forEach(b => b.onclick = () => { cat = b.dataset.fcat; $$('[data-fcat]', fp).forEach(x => x.setAttribute('aria-pressed', x === b)); draw() });
    const pick = el => { onPick(f, el.dataset.fam); close(false) };
    opts.onclick = e => { if (e.target.closest('.dlbtn')) { showFigma('font'); return } const o = e.target.closest('.dd-opt'); if (o) pick(o) };
    list.onkeydown = e => {
      const os = $$('.dd-opt', opts), i = os.indexOf(document.activeElement);
      if (e.key === 'ArrowDown') { e.preventDefault(); (i < 0 ? os[0] : os[Math.min(os.length - 1, i + 1)])?.focus() } else if (e.key === 'ArrowUp') { e.preventDefault(); i <= 0 ? search.focus() : os[i - 1].focus() }
      else if (e.key === 'Enter' && i >= 0) { e.preventDefault(); pick(os[i]) } else if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); close(true) } else if (e.key === 'Tab') close(false)
    };
    wrap_close: fp._close = close;
  });
}
function pickFont(s, f, fam) {
  f.family = fam; const g = FONTMAP.get(fam);
  if (g && g[2].length) { f.weights = f.weights.filter(w => g[2].includes(w)); if (!f.weights.length) f.weights = [g[2].includes(400) ? 400 : g[2][0]] }
  loadFontCss(fam); saveStore(); renderEditor();
}
const WHERE = '<p class="note" style="margin-top:6px">Guidance drawn from published design-system writing, not a single study: <a href="https://eightshapes.com/articles/color-in-design-systems/">EightShapes</a> (one to a few brand colors, a few neutrals, four feedback colors, roughly 10 to 14 base colors) and <a href="https://www.uxpin.com/studio/blog/choose-color-pallete/">UXPin</a> (1 to 2 primary, 1 accent, a neutral scale, four feedback colors, 5 to 7 base hues). Treat them as sensible limits, not rules.</p>';

function renderEditor() {
  const main = $('#main'); const s = cur(); curSys = s; tip.hidden = true;
  if (S.checked.size > 1) { main.innerHTML = `<p class="eyebrow">Selection</p><h1>${S.checked.size} systems selected</h1><p>Use the actions at the bottom of the left panel to move, download or delete them. Click a system name to open and edit one.</p><ul class="plain">${S.systems.filter(x => S.checked.has(x.id)).map(x => `<li>${esc(x.name)} <span class="tag">${esc(x.folder)}</span></li>`).join('')}</ul>`; return }
  if (!s) { main.innerHTML = `<p class="eyebrow">Design Systems</p><h1>Build and keep your design systems</h1><p>Create a system from our template. It tells you what is needed, warns you when you add too much, and checks color contrast as you pick colors. Everything is saved in this browser only. Nothing is uploaded.</p><div class="row"><button class="btn solid" id="empty-new">+ New system</button></div>`; $('#empty-new').onclick = () => $('#newsys').click(); return }
  s.fonts.forEach(f => loadFontCss(f.family)); sortColors(s);
  const cntR = rs => s.colors.filter(c => rs.includes(c.role)).length;
  const mob = mobileOnly(s), brand = cntR(BRAND), neu = cntR(NEUTRAL), fb = cntR(FEEDBACK), fams = [...new Set(s.fonts.filter(f => f.role !== 'Mono' && f.family.trim()).map(f => f.family.trim().toLowerCase()))].length;
  const radii = String(s.radii).split(',').map(x => x.trim()).filter(Boolean).length;
  main.innerHTML = `<div class="dbhead"><div><p class="eyebrow">Design system</p><h1>${esc(s.name)}</h1></div><button class="btn solid" id="exp" aria-haspopup="menu">Export <span style="display:inline-flex">${CHEV}</span></button></div>
  ${checklist(s)}
  <div class="panel" id="p-about"><h2>1. About this system</h2><div class="grid2">
   <label class="f"><span class="f-t">Name</span><input type="text" id="f-name" value="${esc(s.name)}"></label>
   <label class="f"><span class="f-t">Folder</span><select id="f-folder">${S.folders.map(f => `<option ${s.folder === f ? 'selected' : ''}>${esc(f)}</option>`).join('')}</select></label>
   <div class="f"><span class="f-t" id="f-ind-l">Industry</span><div class="dd ms" id="f-ind"><button type="button" class="dd-btn" id="f-ind-btn" aria-haspopup="true" aria-expanded="false" aria-labelledby="f-ind-l f-ind-v"><span class="dd-val" id="f-ind-v">${esc(indSummary(s))}</span>${CHEV}</button><div class="dd-list ms-list" role="group" aria-label="Industries" hidden>${INDUSTRIES.map(([k, l]) => `<label class="dd-opt ms-opt"><span class="ms-l"><input type="checkbox" data-ind="${k}" ${sysInds(s).includes(k) ? 'checked' : ''}>${esc(l)}</span></label>`).join('')}</div></div></div></div>
   <fieldset><legend class="eyebrow">What is it for?</legend><div class="states">${Object.entries(PLAT).map(([k, l]) => `<label class="chk"><input type="checkbox" data-plat="${k}" ${s.platforms.includes(k) ? 'checked' : ''}>${l}</label>`).join('')}</div></fieldset>
   ${mob ? advice(true, 'Mobile only', 'No hover states needed, so they are hidden below. Use 44px touch targets and 16px minimum body text.', null, 'plat') : s.platforms.length ? advice(true, 'Includes desktop', 'Design hover and keyboard focus states. Keep body text 16px or larger on mobile.', null, 'plat') : advice(false, 'Nothing selected', 'Choose at least one platform so we can tailor the advice.', { k: 'plat', l: 'Select all platforms' }, 'plat')}</div>
  <div class="panel"><h2>2. Colors</h2>
   ${rangeAdvice('Brand colors', brand, LIMITS.brand, 'Primary, Secondary, Tertiary and Accent.', BRAND, 'Primary', 'brand')}
   ${rangeAdvice('Neutrals', neu, LIMITS.neutral, 'Background, Surface, Border, Text and similar.', NEUTRAL, 'Border', 'neutral')}
   ${rangeAdvice('Feedback colors', fb, LIMITS.feedback, 'Success, Warning, Danger and Info. Four is the common set.', FEEDBACK, !s.colors.some(c => c.role === 'Success') ? 'Success' : !s.colors.some(c => c.role === 'Danger') ? 'Danger' : 'Warning', 'feedback')}
   ${rangeAdvice('All colors', s.colors.length, LIMITS.colors, 'Core colors, before tints and shades.', null, null, 'allcolors')}
   <details class="src"><summary>Where these numbers come from <span class="foldc closed" style="display:inline-flex">${CHEV}</span></summary>${WHERE}</details>
   ${s.colors.length ? `<div class="strip" role="group" aria-label="Your colors. Hover or focus a color to see its contrast with the others.">${s.colors.map(c => `<button class="swb" style="background:${esc(c.hex)}" data-goto="${c.id}" data-tip="${tipData(c.name, c.hex, s.colors.filter(o => o.id !== c.id))}" aria-label="${esc(c.name)} ${esc(c.hex)}"></button>`).join('')}</div>` : ''}
   <div id="colorlist">${colorGroups(s)}</div>
   <div class="row"><button class="btn solid sm" id="addcolor">+ Add color</button></div>
   ${suggestColors(s)}</div>
  <div class="panel"><h2>3. Typography</h2>
   ${fams === 0 ? advice(false, 'No typeface yet', 'Add at least a Body typeface.', { k: 'addfont', l: 'Add a Body typeface' }, 'fonts') : advice(fams <= LIMITS.families, fams + ' typeface' + (fams === 1 ? '' : 's'), fams <= LIMITS.families ? `We advise ${LIMITS.families} or fewer, plus one mono if you show code.` : `We advise ${LIMITS.families} or fewer. More slows loading and looks busy.`, null, 'fonts')}
   ${s.fonts.map(f => { const custom = !FONT_ROLES.includes(f.role), g = FONTMAP.get(f.family); return `<div class="fontrow" data-fid="${f.id}"><div class="f"><label class="f"><span class="f-t">Role</span><select data-ff="rolesel">${FONT_ROLES.map(r => `<option ${f.role === r ? 'selected' : ''}>${r}</option>`).join('')}<option value="__custom" ${custom ? 'selected' : ''}>Custom...</option></select></label>${custom ? `<input type="text" data-ff="rolecustom" aria-label="Custom role name" value="${esc(f.role === 'Custom' ? '' : f.role)}" placeholder="Role name" style="margin-top:6px">` : ''}</div>
    <div class="f"><span class="f-t">Typeface</span>${fontPicker(f)}</div><button class="btn sm" data-rmfont="${f.id}">Remove</button>
    ${f.family ? `<div class="wide fsample" style="font-family:'${esc(f.family)}',system-ui,sans-serif">Aa Quick brown fox jumps over the lazy dog</div>` : ''}
    ${f.family && !g ? `<div class="wide note">Not built into Figma. Use the download icon beside the name.</div>` : ''}
    <div class="wide"><span class="eyebrow">Weights</span><div class="wchips" role="group" aria-label="Weights for ${esc(f.family || f.role)}">${WEIGHTS.map(([n, l]) => { const off = g && !g[2].includes(n); return `<label class="${off ? 'off' : ''}"><input type="checkbox" data-fw="${n}" ${f.weights.includes(n) ? 'checked' : ''} ${off ? 'disabled' : ''}>${n} ${l}</label>` }).join('')}</div>
    ${f.weights.length > LIMITS.weights ? advice(false, f.weights.length + ' weights', `We advise ${LIMITS.weights} or fewer per typeface, for example 400 Regular, 600 Semi Bold, 700 Bold.`, { k: 'weights', l: 'Keep the best 3 weights', d: f.id }, 'w-' + f.id) : ''}</div></div>` }).join('') || '<p class="empty">No typefaces yet.</p>'}
   <div class="row"><button class="btn solid sm" id="addfont">+ Add typeface</button></div>${suggestFonts(s)}
   <p class="note" style="margin-top:12px">Only fonts under the SIL Open Font License are listed. They are free for commercial use and built into Figma. Showing a preview loads the font from Google's servers. Credits and licenses are at the bottom of every page. <a href="https://fonts.google.com/knowledge" target="_blank" rel="noopener">About Google Fonts</a></p></div>
  <div class="panel"><h2>4. Interaction states</h2><div class="states">${STATE_LIST.map(([k, l]) => { const off = k === 'hover' && mob; return `<label class="chk" ${off ? 'title="Not needed for mobile-only"' : ''}><input type="checkbox" data-state="${k}" ${s.states.includes(k) && !off ? 'checked' : ''} ${off ? 'disabled' : ''}>${l}${off ? ' (not needed on mobile)' : ''}</label>` }).join('')}</div>
   ${s.states.includes('focus') ? '' : advice(false, 'Focus is missing', 'Keyboard and switch users need a visible focus state on every interactive element (WCAG 2.4.7).', { k: 'focus', l: 'Add the Focus state' }, 'focus')}</div>
  <div class="panel" id="p-comps"><h2>5. Components</h2>
   ${s.components.length ? s.components.map(c => { const e = compById(c.id); if (!e) return ''; c.os = c.os || []; const osk = ['ios', 'android'].filter(o => e.os && e.os[o]); return `<div class="compline" data-comp="${esc(c.id)}" title="Click to view"><div><b>${esc(e.name)}</b> <span class="tag">${esc(e.category)}</span><div class="states" style="margin-top:6px" role="group" aria-label="States for ${esc(e.name)}">${(e.states || []).map(st => `<label class="chk"><input type="checkbox" data-cst="${esc(st.id)}" ${c.states.includes(st.id) ? 'checked' : ''}>${esc(st.label.split(' (')[0])}</label>`).join('')}</div>${osk.length ? `<div class="states" style="margin-top:6px" role="group" aria-label="Device variants for ${esc(e.name)}"><span class="note">Device variants:</span>${osk.map(o => `<label class="chk"><input type="checkbox" data-cos="${o}" ${c.os.includes(o) ? 'checked' : ''}>${OS_LABEL[o]}</label>`).join('')}</div>` : ''}</div><div class="row" style="margin:0"><button class="btn sm" data-viewcomp="${esc(c.id)}">View</button><button class="btn sm" data-rmcomp="${esc(c.id)}">Remove</button></div></div>` }).join('') : '<p class="empty">No components yet. Add some from Browse and they are included when you export.</p>'}
   <div class="row"><button class="btn solid sm" id="browsecomp">Browse components</button></div>${suggestComponents(s)}</div>
  <div class="panel"><h2>6. Spacing and corners</h2><div class="grid2"><label class="f"><span class="f-t">Spacing base unit</span><select id="f-space"><option value="4" ${s.spacing === '4' ? 'selected' : ''}>4px (fine control)</option><option value="8" ${s.spacing === '8' ? 'selected' : ''}>8px (simple and common)</option></select></label>
   <label class="f"><span class="f-t">Corner radius (comma separated)</span><input type="text" id="f-radii" value="${esc(s.radii)}"></label></div>
   ${advice(radii <= LIMITS.radii, radii + ' corner radius value' + (radii === 1 ? '' : 's'), `We advise ${LIMITS.radii} or fewer values. Pills are for buttons; tags and cards use small or medium radii.`, radii > LIMITS.radii ? { k: 'radii', l: 'Keep the first ' + LIMITS.radii + ' radius values' } : null, 'radii')}</div>
  <div class="row"><button class="btn danger" id="x-del">Delete this system</button></div>`;
  upgradeSelects(main); wireEditor(s);
}
function wireEditor(s) {
  const m = $('#main'), set = (k, v) => { s[k] = v; saveStore() }, rerender = () => { renderEditor() };
  $('#exp').onclick = e => { const r = e.currentTarget.getBoundingClientRect(); exportMenu(s, r.left - 120, r.bottom + 6) };
  $$('[data-fix]', m).forEach(b => b.onclick = () => {
    const k = b.dataset.fix, d = b.dataset.d;
    if (k === 'weights') { const f = s.fonts.find(x => x.id === d); f.weights = keepThree(f.weights) }
    else if (k === 'radii') s.radii = String(s.radii).split(',').map(x => x.trim()).filter(Boolean).slice(0, LIMITS.radii).join(', ');
    else if (k === 'focus') s.states = [...new Set([...s.states, 'focus'])]; else if (k === 'plat') s.platforms = Object.keys(PLAT);
    else if (k === 'addfont') s.fonts.push({ id: uid(), role: FILL_ORDER.find(r => !s.fonts.some(f => f.role === r)) || 'Custom', family: '', weights: [400, 700] });
    else if (k === 'addrole') s.colors.push({ id: uid(), name: d, hex: DEFAULT_HEX[d] || '#6b7280', role: d });
    saveStore(); tip.hidden = true; rerender(); toast('Fixed');
  });
  const bindFixColor = root => $$('[data-fixcolor]', root).forEach(b => b.onclick = () => { const c = s.colors.find(x => x.id === b.dataset.fixcolor); c.hex = b.dataset.hex; saveStore(); tip.hidden = true; rerender(); toast('Color updated to ' + c.hex) });
  bindFixColor(m);
  $$('[data-goto]', m).forEach(b => b.onclick = () => { const el = document.getElementById('cc-' + b.dataset.goto); el.scrollIntoView({ block: 'center' }); $('[data-cf=name]', el).focus() });
  $$('[data-viewall]', m).forEach(b => b.onclick = () => { B.types = new Set([b.dataset.viewall]); B.inds = new Set(sysInds(s).filter(x => x !== 'all')); B.cats.clear(); B.plats.clear(); B.q = ''; go('#/') });
  $('#f-name').oninput = e => { set('name', e.target.value || 'Untitled system'); $('h1', m).textContent = s.name }; $('#f-name').onchange = () => renderTree();
  $('#f-folder').onchange = e => { set('folder', e.target.value); renderTree() };
  { /* multi-select industry dropdown: stays open while ticking; closes on outside click, the arrow/button, or choosing All */
    const wrap = $('#f-ind'), btn = $('#f-ind-btn'), list = $('.ms-list', wrap), boxes = $$('input[data-ind]', wrap); let dirty = false;
    const sync = () => { boxes.forEach(b => b.checked = sysInds(s).includes(b.dataset.ind)); $('#f-ind-v').textContent = indSummary(s) };
    const close = focusBtn => { if (list.hidden) return; list.hidden = true; btn.setAttribute('aria-expanded', 'false'); wrap.classList.remove('open'); if (ddOpen && ddOpen.wrap === wrap) ddOpen = null; if (dirty) { dirty = false; rerender() } else if (focusBtn) btn.focus() };
    const open = () => { if (ddOpen) ddOpen.close(); list.hidden = false; btn.setAttribute('aria-expanded', 'true'); wrap.classList.add('open'); ddOpen = { wrap, close } };
    btn.onclick = () => list.hidden ? open() : close(true);
    wrap.addEventListener('keydown', ev => { if (ev.key === 'Escape' && !list.hidden) { ev.preventDefault(); ev.stopPropagation(); close(true) } });
    boxes.forEach(b => b.onchange = () => { const k = b.dataset.ind; let a = sysInds(s).filter(x => x !== 'all');
      if (k === 'all') { set('industries', ['all']); dirty = true; sync(); close(true); return }
      b.checked ? a.push(k) : (a = a.filter(x => x !== k)); if (!a.length) a = ['all']; set('industries', a); dirty = true; sync() });
  }
  $$('[data-plat]', m).forEach(i => i.onchange = () => { const a = new Set(s.platforms); i.checked ? a.add(i.dataset.plat) : a.delete(i.dataset.plat); set('platforms', [...a]); if (i.checked && POINTER.includes(i.dataset.plat) && !s.states.includes('hover')) set('states', [...s.states, 'hover']); rerender() });
  $$('[data-state]', m).forEach(i => i.onchange = () => { const a = new Set(s.states); i.checked ? a.add(i.dataset.state) : a.delete(i.dataset.state); set('states', [...a]); rerender() });
  $('#f-space').onchange = e => { set('spacing', e.target.value); rerender() }; $('#f-radii').onchange = e => { set('radii', e.target.value); rerender() };
  $('#addcolor').onclick = () => { const nid = uid(); s.colors.push({ id: nid, name: 'Color ' + (s.colors.length + 1), hex: '#1d4ed8', role: 'Other' }); sortColors(s); saveStore(); rerender(); const last = document.getElementById('cc-' + nid); $('[data-cf=name]', last).focus({ preventScroll: true }); revealColor(nid) };
  $$('[data-addcolor]', m).forEach(b => b.onclick = () => { s.colors.push({ id: uid(), name: b.dataset.role, hex: b.dataset.addcolor, role: b.dataset.role, source: b.dataset.src }); saveStore(); rerender(); toast('Added to ' + b.dataset.src) });
  $$('[data-addset]', m).forEach(b => b.onclick = () => { const e = DATA.find(x => x.id === b.dataset.addset); Object.entries(e.roles).forEach(([k, v]) => { if (k === 'border') return; const role = SET_ROLE[k] || 'Other'; if (!s.colors.some(c => c.hex === v && c.role === role && c.source === e.name)) s.colors.push({ id: uid(), name: role, hex: v, role, source: e.name }) }); saveStore(); rerender(); toast('Added ' + e.name) });
  $$('[data-rmsource]', m).forEach(b => b.onclick = async () => { if (await ask({ title: `Remove "${b.dataset.rmsource}" colors?`, body: 'Only the colors added from this set are removed.', confirm: 'Remove', danger: true })) { s.colors = s.colors.filter(c => c.source !== b.dataset.rmsource); saveStore(); rerender() } });
  $$('[data-rmcolor]', m).forEach(b => b.onclick = () => { s.colors = s.colors.filter(c => c.id !== b.dataset.rmcolor); saveStore(); rerender() });
  const syncTips = () => { $$('.pick', m).forEach(el => { const id = el.closest('.colorcard').dataset.cid, c = s.colors.find(x => x.id === id); el.dataset.tip = JSON.stringify({ n: c.name, h: c.hex, o: s.colors.filter(o => o.id !== id).map(o => ({ n: o.name, h: o.hex })) }) }); $$('.swb', m).forEach(el => { const c = s.colors.find(x => x.id === el.dataset.goto); el.style.background = c.hex; el.dataset.tip = JSON.stringify({ n: c.name, h: c.hex, o: s.colors.filter(o => o.id !== c.id).map(o => ({ n: o.name, h: o.hex })) }) }) };
  const refresh = () => { $$('[data-cb]', m).forEach(el => { const c = s.colors.find(x => x.id === el.dataset.cb); if (c) el.innerHTML = contrastBlock(c, s) }); bindFixColor(m); syncTips() };
  $$('.colorcard', m).forEach(card => { const c = s.colors.find(x => x.id === card.dataset.cid);
    $('[data-cf=picker]', card).oninput = e => { c.hex = e.target.value; $('[data-cf=hex]', card).value = c.hex; saveStore(); refresh() };
    $('[data-cf=hex]', card).oninput = e => { const h = normHex(e.target.value); if (h) { c.hex = h; $('[data-cf=picker]', card).value = h; saveStore(); refresh() } };
    $('[data-cf=name]', card).oninput = e => { c.name = e.target.value; saveStore() }; $('[data-cf=name]', card).onchange = () => refresh();
    $('[data-cf=role]', card).onchange = e => { c.role = e.target.value; sortColors(s); saveStore(); rerender(); revealColor(c.id) } });
  const afterMove = id => { saveStore(); rerender(); revealColor(id) };
  $$('[data-mv]', m).forEach(b => b.onclick = () => {
    const c = s.colors.find(x => x.id === b.dataset.id), d = +b.dataset.mv, same = s.colors.filter(o => o.role === c.role && (o.source || '') === (c.source || '')), j = same.indexOf(c) + d, o = same[j]; if (!o) return;
    const a = s.colors.indexOf(c), z = s.colors.indexOf(o); s.colors[a] = o; s.colors[z] = c; afterMove(c.id);
    const nb = $(`[data-mv="${d}"][data-id="${c.id}"]`, m); (nb && !nb.disabled ? nb : $(`[data-mv="${-d}"][data-id="${c.id}"]`, m))?.focus();
  });
  let dragId = null;
  $$('.colorcard', m).forEach(card => {
    const grip = $('[data-grip]', card); grip.onmousedown = () => card.draggable = true; grip.onmouseup = () => card.draggable = false;
    card.ondragstart = e => { dragId = card.dataset.cid; e.dataTransfer.effectAllowed = 'move'; e.dataTransfer.setData('text/plain', dragId); card.classList.add('dragging'); tip.hidden = true };
    card.ondragend = () => { dragId = null; card.draggable = false; $$('.dragging,.over-top,.over-bot', m).forEach(x => x.classList.remove('dragging', 'over-top', 'over-bot')) };
    card.ondragover = e => { if (!dragId || dragId === card.dataset.cid) return; const dg = s.colors.find(x => x.id === dragId); if ((dg.source || '') !== card.dataset.grp) return; e.preventDefault(); const r = card.getBoundingClientRect(), top = e.clientY < r.top + r.height / 2; card.classList.toggle('over-top', top); card.classList.toggle('over-bot', !top); if (e.clientY < 90) scrollBy(0, -18); else if (e.clientY > innerHeight - 70) scrollBy(0, 18) };
    card.ondragleave = () => card.classList.remove('over-top', 'over-bot');
    card.ondrop = e => { if (!dragId) return; e.preventDefault(); const dg = s.colors.find(x => x.id === dragId), tg = s.colors.find(x => x.id === card.dataset.cid); if (!dg || dg === tg || (dg.source || '') !== (tg.source || '')) return; const before = card.classList.contains('over-top'); const changed = dg.role !== tg.role; s.colors = s.colors.filter(x => x !== dg); const i = s.colors.indexOf(tg); s.colors.splice(before ? i : i + 1, 0, dg); dg.role = tg.role; sortColors(s); afterMove(dg.id); if (changed) toast('Role changed to ' + dg.role) };
  });
  $('#addfont').onclick = () => { s.fonts.push({ id: uid(), role: FILL_ORDER.find(r => !s.fonts.some(f => f.role === r)) || 'Custom', family: '', weights: [400, 700] }); saveStore(); rerender() };
  $$('[data-rmfont]', m).forEach(b => b.onclick = () => { s.fonts = s.fonts.filter(f => f.id !== b.dataset.rmfont); saveStore(); rerender() });
  $$('.fontrow', m).forEach(row => { const f = s.fonts.find(x => x.id === row.dataset.fid);
    $('[data-ff=rolesel]', row).onchange = e => { f.role = e.target.value === '__custom' ? 'Custom' : e.target.value; saveStore(); rerender() };
    const rc = $('[data-ff=rolecustom]', row); if (rc) rc.onchange = e => { f.role = e.target.value.trim() || 'Custom'; saveStore(); rerender() };
    $$('[data-fw]', row).forEach(i => i.onchange = () => { const w = new Set(f.weights); i.checked ? w.add(+i.dataset.fw) : w.delete(+i.dataset.fw); f.weights = [...w].sort((a, b) => a - b); saveStore(); rerender() }) });
  wireFontPicker(m, s, (f, fam) => pickFont(s, f, fam));
  $$('[data-figmafont]', m).forEach(a => a.onclick = () => showFigma('font'));
  $$('[data-usepair]', m).forEach(b => b.onclick = () => { const [di, bi] = b.dataset.usepair.split('|'), d = DATA.find(x => x.id === di), p = d.pairings.find(x => x.id === bi); const mk = (role, fam, w) => ({ id: uid(), role, family: fam, weights: w.slice() }); s.fonts = s.fonts.filter(f => !['Display', 'Body'].includes(f.role)); s.fonts.unshift(mk('Display', d.name, p.displayWeights), mk('Body', p.family, p.bodyWeights)); saveStore(); rerender(); toast('Applied ' + d.name + ' + ' + p.family) });
  $$('[data-cst]', m).forEach(i => i.onchange = () => { const c = s.components.find(x => x.id === i.closest('[data-comp]').dataset.comp), a = new Set(c.states); i.checked ? a.add(i.dataset.cst) : a.delete(i.dataset.cst); c.states = [...a]; saveStore() });
  $$('[data-hide]', m).forEach(b => b.onclick = () => { s.hidden = [...new Set([...(s.hidden || []), b.dataset.hide])]; saveStore(); rerender() });
  $$('[data-unhide]', m).forEach(b => b.onclick = () => { s.hidden = (s.hidden || []).filter(x => x !== b.dataset.unhide); saveStore(); rerender() });
  $$('[data-jump]', m).forEach(b => b.onclick = () => jump(b.dataset.jump));
  $$('[data-cos]', m).forEach(i => i.onchange = () => { const c = s.components.find(x => x.id === i.closest('[data-comp]').dataset.comp), a = new Set(c.os || []); i.checked ? a.add(i.dataset.cos) : a.delete(i.dataset.cos); c.os = ['ios', 'android'].filter(o => a.has(o)); saveStore() });
  $$('[data-viewcomp]', m).forEach(b => b.onclick = () => viewComponent(s.components.find(c => c.id === b.dataset.viewcomp)));
  $$('.compline', m).forEach(r => r.onclick = ev => { if (ev.target.closest('button,input,label,a')) return; viewComponent(s.components.find(c => c.id === r.dataset.comp)) });
  const addSug = id => { const e = compById(id); if (e && !s.components.some(c => c.id === id)) s.components.push({ id, states: statesFor(e, s), os: compOsDefault(e, s) }) };
  $$('[data-sugcomp]', m).forEach(b => b.onclick = () => { addSug(b.dataset.sugcomp); saveStore(); rerender(); toast('Component added') });
  const aa = $('#addallcomp'); if (aa) aa.onclick = () => { [...ESSENTIALS, ...s.platforms.flatMap(p => PLAT_ESSENTIALS[p] || [])].forEach(id => { const e = compById(id); if (e && (!s.platforms.length || (e.platforms || []).some(x => s.platforms.includes(x)))) addSug(id) }); saveStore(); rerender(); toast('Suggested components added') };
  $$('[data-rmcomp]', m).forEach(b => b.onclick = () => { s.components = s.components.filter(c => c.id !== b.dataset.rmcomp); saveStore(); rerender() });
  $('#browsecomp').onclick = () => { B.types = new Set(['component']); B.cats.clear(); B.plats.clear(); B.q = ''; B.inds.clear(); go('#/') };
  $('#x-del').onclick = () => deleteSystems([s.id]);
}
