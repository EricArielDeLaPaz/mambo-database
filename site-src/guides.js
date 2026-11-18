/* ===== Guides: short, plain-language lessons written in markdown (guides/*.md) ===== */
const GUIDES = MAMBO.guides;
const G = { q: '', scope: 'name', topics: new Set(), levels: new Set() };
const gById = id => GUIDES.find(g => g.id === id);
/* Which guides have been opened (saved in this browser). */
const READ_KEY = 'mambo-database.guides.read';
const readSet = () => { try { return new Set(JSON.parse(localStorage.getItem(READ_KEY)) || []) } catch { return new Set() } };
const setRead = (id, on) => { const r = readSet(); on ? r.add(id) : r.delete(id); try { localStorage.setItem(READ_KEY, JSON.stringify([...r])) } catch { } };
/* Live color-blindness demos for the color blindness guide (uses the same simulator as the Tools). */
const CVD_SAMPLE = [['Red', '#d62728'], ['Orange', '#ff7f0e'], ['Yellow', '#f2c500'], ['Green', '#2ca02c'], ['Blue', '#1f77b4'], ['Purple', '#8e44ad'], ['Pink', '#e377c2'], ['Gray', '#7f7f7f']];
const cvdRows = () => [['Typical vision', null]].concat(Object.keys(CVD).map(k => [CVD[k].label + ' (' + CVD[k].about + ')', k]));
const cvdDemoHtml = () => `<div class="tscroll"><table class="cvdtbl"><caption class="sr">The same eight colors as seen with typical vision and with each type of color blindness</caption><thead><tr><th scope="col">Vision</th>${CVD_SAMPLE.map(([n]) => `<th scope="col">${n}</th>`).join('')}</tr></thead><tbody>${cvdRows().map(([l, t]) => `<tr><th scope="row">${esc(l)}</th>${CVD_SAMPLE.map(([n, h]) => { const c = t ? simHex(h, t) : h; return `<td><span class="cvdsw" style="background:${c}" role="img" aria-label="${n} as ${esc(l)}: ${c.toUpperCase()}"></span><span class="cvdhx">${c.toUpperCase()}</span></td>` }).join('')}</tr>`).join('')}</tbody></table></div>`;
const cvdStatusHtml = () => { const ok = '#2e7d32', bad = '#c62828'; return `<div class="tscroll"><table class="cvdtbl"><caption class="sr">Success and danger shown by color alone, then with an icon and a label</caption><thead><tr><th scope="col">Vision</th><th scope="col">Color only</th><th scope="col">Color, icon and label</th></tr></thead><tbody>${cvdRows().map(([l, t]) => { const a = t ? simHex(ok, t) : ok, b = t ? simHex(bad, t) : bad; return `<tr><th scope="row">${esc(l)}</th><td><span class="cvdpill" style="background:${a}" role="img" aria-label="Status A"></span> <span class="cvdpill" style="background:${b}" role="img" aria-label="Status B"></span></td><td><span class="cvdpill lab" style="background:${a};color:${inkOn(a)}"><span aria-hidden="true">✓</span> Saved</span> <span class="cvdpill lab" style="background:${b};color:${inkOn(b)}"><span aria-hidden="true">✕</span> Failed</span></td></tr>` }).join('')}</tbody></table></div>` };
const gMatch = g => {
  if (G.topics.size && !G.topics.has(g.topic)) return false; if (G.levels.size && !G.levels.has(g.level)) return false;
  const q = G.q.trim().toLowerCase(); if (!q) return true;
  return (G.scope === 'name' ? g.title : G.scope === 'description' ? g.summary : g.body).toLowerCase().includes(q);
};
const gHl = (t, on) => { const q = G.q.trim(); if (!q || !on) return esc(t); const re = new RegExp('(' + q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'ig'); return String(t).split(re).map((x, i) => i % 2 ? '<mark>' + esc(x) + '</mark>' : esc(x)).join('') };
/* A small markdown renderer: headings, paragraphs, lists, tables, code blocks, quotes, bold, code, links. */
function inlineMd(t, fn) {
  const codes = []; t = t.replace(/`([^`]+)`/g, (_, c) => { codes.push(c); return '\u0000' + (codes.length - 1) + '\u0000' });
  t = esc(t).replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>').replace(/(^|[\s(])_([^_]+)_(?=[\s).,;:]|$)/g, '$1<em>$2</em>');
  if (fn) t = t.replace(/\[\^(\d+)\]/g, (m0, n0) => { const n = Number(n0); if (!fn.defs[n]) return m0; fn.seen[n] = (fn.seen[n] || 0) + 1; const id = fn.seen[n] === 1 ? 'fnref-' + n : 'fnref-' + n + '-' + fn.seen[n]; return '<sup class="fnref"><a class="fnlink" href="#src-' + n + '" id="' + id + '" data-fn="' + n + '" aria-label="Source ' + n + '">[' + n + ']</a></sup>' });
  t = t.replace(/\[([^\]]+)\]\(([^)\s]+)\)(\{\.btn\})?/g, (_, l, u, b) => /^(https?:|#|[\w./-]+\.(zip|md|txt))/.test(u) ? `<a ${b ? 'class="btn solid" ' : ''}href="${u}" ${/^https?:/.test(u) ? 'target="_blank" rel="noopener"' : ''}>${l}</a>` : l);
  return t.replace(/\u0000(\d+)\u0000/g, (_, i) => '<code>' + esc(codes[i]) + '</code>');
}
function mdToHtml(md) {
  /* Collect footnote definitions ([^n]: body) first; they render as a numbered list under the `## Where to read more` heading. */
  const defs = {}, lines = [];
  for (const raw of md.split('\n')) { const m = raw.match(/^\[\^(\d+)\]:\s?(.*)$/); if (m) { defs[Number(m[1])] = m[2]; continue } lines.push(raw) }
  /* Pre-scan for refs so the sources list (rendered at the heading) knows which sources have a jump target. */
  const used = {};
  for (const raw of lines) for (const m of raw.matchAll(/\[\^(\d+)\]/g)) { const n = Number(m[1]); if (Object.prototype.hasOwnProperty.call(defs, n)) used[n] = true }
  const fn = { defs, seen: {} };
  const fnList = () => `<ol class="fnlist">${Object.keys(defs).map(Number).sort((a, b) => a - b).map(n => `<li id="src-${n}" tabindex="-1" class="fn-item">${inlineMd(defs[n], fn)}${used[n] ? ` <a class="fnback" href="#fnref-${n}" data-fnback="${n}" aria-label="Back to text for source ${n}">&#8617; Back to text</a>` : ''}</li>`).join('')}</ol>`;
  let out = '', i = 0, sourcesDone = false;
  const slugH = t => t.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  while (i < lines.length) {
    const l = lines[i];
    if (/^```/.test(l)) { const lang = l.slice(3).trim(); const buf = []; i++; while (i < lines.length && !/^```/.test(lines[i])) buf.push(lines[i++]); i++; out += `<pre tabindex="0"><code${lang ? ` class="lang-${esc(lang)}"` : ''}>${esc(buf.join('\n'))}</code></pre>`; continue }
    let m;
    if (/^:::cvd-demo\s*$/.test(l)) { out += cvdDemoHtml(); i++; continue }
    if (/^:::cvd-status\s*$/.test(l)) { out += cvdStatusHtml(); i++; continue }
    if ((m = l.match(/^(#{2,3})\s+(.*)$/))) { const n = m[1].length; out += `<h${n} id="${slugH(m[2])}">${inlineMd(m[2], fn)}</h${n}>`; if (!sourcesDone && /^where to read more$/i.test(m[2].trim()) && Object.keys(defs).length) { out += fnList(); sourcesDone = true } i++; continue }
    if (/^\|.*\|\s*$/.test(l) && /^\|[\s:|-]+\|\s*$/.test(lines[i + 1] || '')) {
      const row = r => r.trim().replace(/^\||\|$/g, '').split('|').map(c => c.trim()); const head = row(l); i += 2; const rows = [];
      while (i < lines.length && /^\|.*\|\s*$/.test(lines[i])) rows.push(row(lines[i++]));
      out += `<div class="tscroll"><table><thead><tr>${head.map(c => `<th scope="col">${inlineMd(c, fn)}</th>`).join('')}</tr></thead><tbody>${rows.map(r => `<tr>${r.map((c, k) => k ? `<td>${inlineMd(c, fn)}</td>` : `<th scope="row">${inlineMd(c, fn)}</th>`).join('')}</tr>`).join('')}</tbody></table></div>`; continue
    }
    if (/^>\s?/.test(l)) { const buf = []; while (i < lines.length && /^>\s?/.test(lines[i])) buf.push(lines[i++].replace(/^>\s?/, '')); out += `<div class="callout" role="note">${inlineMd(buf.join(' '), fn)}</div>`; continue }
    if (/^\s*[-*]\s+/.test(l)) { const buf = []; while (i < lines.length && /^\s*[-*]\s+/.test(lines[i])) buf.push(lines[i++].replace(/^\s*[-*]\s+/, '')); out += `<ul>${buf.map(x => `<li>${inlineMd(x, fn)}</li>`).join('')}</ul>`; continue }
    if (/^\s*\d+\.\s+/.test(l)) { const buf = []; while (i < lines.length && /^\s*\d+\.\s+/.test(lines[i])) buf.push(lines[i++].replace(/^\s*\d+\.\s+/, '')); out += `<ol>${buf.map(x => `<li>${inlineMd(x, fn)}</li>`).join('')}</ol>`; continue }
    if (!l.trim()) { i++; continue }
    const buf = []; while (i < lines.length && lines[i].trim() && !/^(```|#{2,3}\s|>|\s*[-*]\s|\s*\d+\.\s|\|)/.test(lines[i])) buf.push(lines[i++]); out += `<p>${inlineMd(buf.join(' '), fn)}</p>`;
  }
  if (!sourcesDone && Object.keys(defs).length) out += fnList();
  return out;
}
/* Footnote jumps: the app owns location.hash (hash routing), so intercept the click instead of navigating, scroll the paired element into view and move keyboard focus to it. */
document.addEventListener('click', e => {
  const a = e.target.closest ? e.target.closest('.fnlink, .fnback') : null; if (!a) return;
  e.preventDefault();
  const id = a.classList.contains('fnlink') ? 'src-' + a.dataset.fn : 'fnref-' + a.dataset.fnback;
  const t = document.getElementById(id); if (!t) return;
  const smooth = !window.matchMedia || !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  t.scrollIntoView({ block: 'start', behavior: smooth ? 'smooth' : 'auto' });
  t.focus({ preventScroll: true });
});
function renderGuides() {
  const id = route().id, g = id && gById(id);
  $('#app').innerHTML = `<div class="layout" id="glay"><aside id="gside" aria-label="Guide filters"></aside><main id="main" tabindex="-1"></main></div>`;
  renderGuideFilters(); g ? renderGuide(g) : renderGuideList(id ? id : null);
}
function renderGuideFilters() {
  const topics = [...new Set(GUIDES.map(g => g.topic))], levels = ['Beginner', 'Intermediate'].filter(l => GUIDES.some(g => g.level === l));
  const n = (k, v) => GUIDES.filter(g => g[k] === v).length;
  $('#gside').innerHTML = `<p class="wordmark"><img src="mambo.png" alt="" decoding="async">Mambo Database</p>
  <label for="gq" class="eyebrow">Search</label>
  <input id="gq" type="search" placeholder="Search ${G.scope === 'name' ? 'titles' : G.scope === 'description' ? 'descriptions' : 'the full text'}" autocomplete="off" value="${esc(G.q)}">
  <div class="scope" role="group" aria-label="Search in">${[['name', 'Name'], ['description', 'Description'], ['content', 'Full text']].map(([k, l]) => `<button type="button" class="chip" data-gscope="${k}" aria-pressed="${G.scope === k}">${l}</button>`).join('')}</div>
  <fieldset><legend class="eyebrow">Topic</legend>${topics.map(t => `<label class="chk"><input type="checkbox" data-gtopic value="${esc(t)}" ${G.topics.has(t) ? 'checked' : ''}><span>${esc(t)}</span><span class="n">${n('topic', t)}</span></label>`).join('')}</fieldset>
  <fieldset><legend class="eyebrow">Level</legend>${levels.map(l => `<label class="chk"><input type="checkbox" data-glevel value="${esc(l)}" ${G.levels.has(l) ? 'checked' : ''}><span>${esc(l)}</span><span class="n">${n('level', l)}</span></label>`).join('')}</fieldset>
  <div class="row"><button class="btn sm" id="gclear" ${(G.q.trim() || G.topics.size || G.levels.size) ? '' : 'disabled'}>Clear filters</button></div>`;
  const list = () => { if (route().id) go('#/guides'); else { renderGuideList(); const c = $('#gclear'); if (c) c.disabled = !(G.q.trim() || G.topics.size || G.levels.size) } };
  $$('[data-gscope]', $('#gside')).forEach(b => b.onclick = () => { G.scope = b.dataset.gscope; renderGuideFilters(); list() });
  $('#gq').oninput = e => { G.q = e.target.value; list() };
  $$('input[data-gtopic]', $('#gside')).forEach(i => i.onchange = () => { i.checked ? G.topics.add(i.value) : G.topics.delete(i.value); renderGuideFilters(); list() });
  $$('input[data-glevel]', $('#gside')).forEach(i => i.onchange = () => { i.checked ? G.levels.add(i.value) : G.levels.delete(i.value); renderGuideFilters(); list() });
  $('#gclear').onclick = () => { G.q = ''; G.topics.clear(); G.levels.clear(); renderGuideFilters(); list() };
}
function renderGuideList(missing) {
  const items = GUIDES.filter(gMatch), rd = readSet();
  $('#main').innerHTML = `<div class="dbhead"><div><p class="eyebrow">Guides</p><h1>Learn the foundations</h1></div><p class="empty" role="status">${items.length} of ${GUIDES.length} guides</p></div>
  <p class="lede">Short, plain-language lessons for designers: how the web is built, how to hand work to engineers, and how AI reads your design system.</p>
  ${missing ? '<p class="callout" role="alert">That guide was not found. Pick one below.</p>' : ''}
  ${items.length ? `<ol class="glist">${items.map(g => `<li><a class="gcard" href="#/guide/${esc(g.id)}"><span class="gmeta"><span class="tag">${esc(g.topic)}</span><span class="tag">${esc(g.level)}</span></span><span class="gstat ${rd.has(g.id) ? 'is-read' : ''}">${rd.has(g.id) ? '<span aria-hidden="true">✓</span> Read' : 'Unread'}</span><strong>${gHl(g.title, G.scope === 'name')}</strong><span class="gmin">${g.minutes} min read</span><span>${gHl(g.summary, G.scope === 'description')}</span></a></li>`).join('')}</ol>` : '<p class="empty">No guides match these filters. Try clearing some.</p>'}`;
}
function renderGuide(g) {
  const i = GUIDES.findIndex(x => x.id === g.id), prev = GUIDES[i - 1], next = GUIDES[i + 1];
  const nav = (x, l) => x ? `<a class="gnav" href="#/guide/${esc(x.id)}"><span class="eyebrow">${l}</span><strong>${esc(x.title)}</strong></a>` : '<span></span>';
  $('#main').innerHTML = `<article class="guide"><p><a class="lnk" href="#/guides">← All guides</a></p>
  <p class="eyebrow">${esc(g.topic)} · ${esc(g.level)}</p><h1>${esc(g.title)}</h1><p class="gmin">${g.minutes} min read</p><p class="lede">${esc(g.summary)}</p>
  <div class="gbody">${mdToHtml(g.body)}</div><p class="gdone"><span class="gstat is-read" id="gread-s"><span aria-hidden="true">✓</span> Read</span> <button type="button" class="btn sm" id="gread-b">Mark as unread</button></p><nav class="gpn" aria-label="More guides">${nav(prev, 'Previous')}${nav(next, 'Next')}</nav></article>`;
  setRead(g.id, true);
  $('#gread-b').onclick = () => { const on = $('#gread-b').textContent === 'Mark as read'; setRead(g.id, on); $('#gread-b').textContent = on ? 'Mark as unread' : 'Mark as read'; $('#gread-s').hidden = !on; toast(on ? 'Marked as read' : 'Marked as unread') };
  document.title = g.title + ' · Mambo Database'; $('#main').focus({ preventScroll: true }); window.scrollTo(0, 0);
}
