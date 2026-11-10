/* ===== Guides: short, plain-language lessons written in markdown (guides/*.md) ===== */
const GUIDES = /*__GUIDES__*/[];
const G = { q: '', scope: 'name', topics: new Set(), levels: new Set() };
const gById = id => GUIDES.find(g => g.id === id);
const gMatch = g => {
  if (G.topics.size && !G.topics.has(g.topic)) return false; if (G.levels.size && !G.levels.has(g.level)) return false;
  const q = G.q.trim().toLowerCase(); if (!q) return true;
  return (G.scope === 'name' ? g.title : G.scope === 'description' ? g.summary : g.body).toLowerCase().includes(q);
};
const gHl = (t, on) => { const q = G.q.trim(); if (!q || !on) return esc(t); const re = new RegExp('(' + q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'ig'); return String(t).split(re).map((x, i) => i % 2 ? '<mark>' + esc(x) + '</mark>' : esc(x)).join('') };
/* A small markdown renderer: headings, paragraphs, lists, tables, code blocks, quotes, bold, code, links. */
function inlineMd(t) {
  const codes = []; t = t.replace(/`([^`]+)`/g, (_, c) => { codes.push(c); return '\u0000' + (codes.length - 1) + '\u0000' });
  t = esc(t).replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>').replace(/(^|[\s(])_([^_]+)_(?=[\s).,;:]|$)/g, '$1<em>$2</em>');
  t = t.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_, l, u) => /^(https?:|#|[\w./-]+\.(zip|md|txt))/.test(u) ? `<a href="${u}" ${/^https?:/.test(u) ? 'target="_blank" rel="noopener"' : ''}>${l}</a>` : l);
  return t.replace(/\u0000(\d+)\u0000/g, (_, i) => '<code>' + esc(codes[i]) + '</code>');
}
function mdToHtml(md) {
  const lines = md.split('\n'); let out = '', i = 0;
  const slugH = t => t.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  while (i < lines.length) {
    const l = lines[i];
    if (/^```/.test(l)) { const lang = l.slice(3).trim(); const buf = []; i++; while (i < lines.length && !/^```/.test(lines[i])) buf.push(lines[i++]); i++; out += `<pre tabindex="0"><code${lang ? ` class="lang-${esc(lang)}"` : ''}>${esc(buf.join('\n'))}</code></pre>`; continue }
    let m;
    if ((m = l.match(/^(#{2,3})\s+(.*)$/))) { const n = m[1].length; out += `<h${n} id="${slugH(m[2])}">${inlineMd(m[2])}</h${n}>`; i++; continue }
    if (/^\|.*\|\s*$/.test(l) && /^\|[\s:|-]+\|\s*$/.test(lines[i + 1] || '')) {
      const row = r => r.trim().replace(/^\||\|$/g, '').split('|').map(c => c.trim()); const head = row(l); i += 2; const rows = [];
      while (i < lines.length && /^\|.*\|\s*$/.test(lines[i])) rows.push(row(lines[i++]));
      out += `<div class="tscroll"><table><thead><tr>${head.map(c => `<th scope="col">${inlineMd(c)}</th>`).join('')}</tr></thead><tbody>${rows.map(r => `<tr>${r.map((c, k) => k ? `<td>${inlineMd(c)}</td>` : `<th scope="row">${inlineMd(c)}</th>`).join('')}</tr>`).join('')}</tbody></table></div>`; continue
    }
    if (/^>\s?/.test(l)) { const buf = []; while (i < lines.length && /^>\s?/.test(lines[i])) buf.push(lines[i++].replace(/^>\s?/, '')); out += `<div class="callout" role="note">${inlineMd(buf.join(' '))}</div>`; continue }
    if (/^\s*[-*]\s+/.test(l)) { const buf = []; while (i < lines.length && /^\s*[-*]\s+/.test(lines[i])) buf.push(lines[i++].replace(/^\s*[-*]\s+/, '')); out += `<ul>${buf.map(x => `<li>${inlineMd(x)}</li>`).join('')}</ul>`; continue }
    if (/^\s*\d+\.\s+/.test(l)) { const buf = []; while (i < lines.length && /^\s*\d+\.\s+/.test(lines[i])) buf.push(lines[i++].replace(/^\s*\d+\.\s+/, '')); out += `<ol>${buf.map(x => `<li>${inlineMd(x)}</li>`).join('')}</ol>`; continue }
    if (!l.trim()) { i++; continue }
    const buf = []; while (i < lines.length && lines[i].trim() && !/^(```|#{2,3}\s|>|\s*[-*]\s|\s*\d+\.\s|\|)/.test(lines[i])) buf.push(lines[i++]); out += `<p>${inlineMd(buf.join(' '))}</p>`;
  }
  return out;
}
function renderGuides() {
  const id = route().id, g = id && gById(id);
  $('#app').innerHTML = `<div class="layout" id="glay"><aside id="gside" aria-label="Guide filters"></aside><main id="main" tabindex="-1"></main></div>`;
  renderGuideFilters(); g ? renderGuide(g) : renderGuideList(id ? id : null);
}
function renderGuideFilters() {
  const topics = [...new Set(GUIDES.map(g => g.topic))], levels = ['Beginner', 'Intermediate'].filter(l => GUIDES.some(g => g.level === l));
  const n = (k, v) => GUIDES.filter(g => g[k] === v).length;
  $('#gside').innerHTML = `<p class="wordmark"><img src="mambo.png" alt="">Mambo Database</p>
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
  const items = GUIDES.filter(gMatch);
  $('#main').innerHTML = `<div class="dbhead"><div><p class="eyebrow">Guides</p><h1>Learn the foundations</h1></div><p class="empty" role="status">${items.length} of ${GUIDES.length} guides</p></div>
  <p class="lede">Short, plain-language lessons for designers: how the web is built, how to hand work to engineers, and how AI reads your design system.</p>
  ${missing ? '<p class="callout" role="alert">That guide was not found. Pick one below.</p>' : ''}
  ${items.length ? `<ol class="glist">${items.map(g => `<li><a class="gcard" href="#/guide/${esc(g.id)}"><span class="gmeta"><span class="tag">${esc(g.topic)}</span><span class="tag">${esc(g.level)}</span><span class="empty">${g.minutes} min read</span></span><strong>${gHl(g.title, G.scope === 'name')}</strong><span>${gHl(g.summary, G.scope === 'description')}</span></a></li>`).join('')}</ol>` : '<p class="empty">No guides match these filters. Try clearing some.</p>'}`;
}
function renderGuide(g) {
  const i = GUIDES.findIndex(x => x.id === g.id), prev = GUIDES[i - 1], next = GUIDES[i + 1];
  const nav = (x, l) => x ? `<a class="gnav" href="#/guide/${esc(x.id)}"><span class="eyebrow">${l}</span><strong>${esc(x.title)}</strong></a>` : '<span></span>';
  $('#main').innerHTML = `<article class="guide"><p><a class="lnk" href="#/guides">← All guides</a></p>
  <p class="eyebrow">${esc(g.topic)} · ${esc(g.level)} · ${g.minutes} min read</p><h1>${esc(g.title)}</h1><p class="lede">${esc(g.summary)}</p>
  <div class="gbody">${mdToHtml(g.body)}</div><nav class="gpn" aria-label="More guides">${nav(prev, 'Previous')}${nav(next, 'Next')}</nav></article>`;
  document.title = g.title + ' · Mambo Database'; $('#main').focus({ preventScroll: true }); window.scrollTo(0, 0);
}
