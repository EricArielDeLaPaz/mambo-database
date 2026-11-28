import { calendar, filterOrder } from './lib/compose.mjs';

const STORE = 'mambo-feed-filters-v1';
const ACCESS_STORE = 'mambo-feed-access-v1';
let access = { free: true, members: true };
const PANES = 'mambo-feed.panes';
const $ = (s, r = document) => r.querySelector(s);
const STEP = 14;      // days added each time "Show earlier days" is used
const MAX_DAYS = 90;

let data = null;
let selected = new Set();
let openDate = null;
let shown = STEP;
let lastDate = null;

/* Feed text comes from third parties: build everything with textContent, and only link to http(s) URLs. */
function el(tag, props = {}, ...kids) {
  const n = document.createElement(tag);
  for (const [k, v] of Object.entries(props)) {
    if (k === 'class') n.className = v;
    else if (k === 'text') n.textContent = v;
    else n.setAttribute(k, v);
  }
  for (const k of kids) if (k) n.append(k);
  return n;
}
function safeUrl(u) {
  try { const x = new URL(u); return x.protocol === 'https:' || x.protocol === 'http:' ? x.href : null; } catch { return null; }
}
const fmtDate = (iso, opts) => new Intl.DateTimeFormat('en-US', { timeZone: 'UTC', ...opts }).format(new Date(iso.length === 10 ? iso + 'T00:00:00Z' : iso));
const longDate = (d) => fmtDate(d, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
const shortDate = (d) => fmtDate(d, { weekday: 'short', month: 'short', day: 'numeric' });
const plural = (n, w) => `${n} ${w}${n === 1 ? '' : 's'}`;
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

function readSaved() {
  try { const v = JSON.parse(localStorage.getItem(STORE)); return Array.isArray(v) ? v : null; } catch { return null; }
}
function readAccess() {
  try { const v = JSON.parse(localStorage.getItem(ACCESS_STORE)); if (v && typeof v === 'object') access = { free: v.free !== false, members: v.members !== false }; } catch { /* default: show both */ }
}
function saveAccess() {
  try { localStorage.setItem(ACCESS_STORE, JSON.stringify(access)); } catch { /* private mode */ }
}
/* Items carry access 'free' (default) or 'members' (the source may put some posts behind a membership or paywall). */
function visibleDays() {
  return data.days
    .map((d) => ({ date: d.date, items: d.items.filter((i) => ((i.access || 'free') === 'free' ? access.free : access.members)) }))
    .filter((d) => d.items.length);
}
function save() {
  try { localStorage.setItem(STORE, JSON.stringify([...selected])); } catch { /* private mode: the page still works */ }
}

async function getData() {
  for (const [file, fell] of [['data/latest.json', false], ['data/sample.json', true]]) {
    try {
      const r = await fetch(file, { cache: 'no-cache' });
      if (r.ok) { const j = await r.json(); j.fellBack = fell; return j; }
    } catch { /* try the next file */ }
  }
  throw new Error('no data');
}

const readyIds = () => new Set(data.filters.filter((f) => !f.group && f.ready).map((f) => f.id));
const suggested = () => new Set(data.filters.filter((f) => !f.group && f.ready && f.default).map((f) => f.id));
const byId = () => Object.fromEntries(data.filters.map((f) => [f.id, f]));

/* ---------- resizable panes, same behavior as Browse: drag a line, arrow keys, double-click to reset ---------- */
function initPanes(lay) {
  const w = { l: 340, r: 520 };
  try { Object.assign(w, JSON.parse(localStorage.getItem(PANES)) || {}); } catch { /* keep defaults */ }
  w.l = clamp(Number(w.l) || 340, 240, 560); w.r = clamp(Number(w.r) || 520, 320, 980);
  const apply = () => {
    lay.style.setProperty('--wl', w.l + 'px'); lay.style.setProperty('--wr', w.r + 'px');
    for (const h of lay.querySelectorAll('.rz[data-rz]')) {
      const l = h.dataset.rz === 'left';
      h.setAttribute('aria-valuemin', l ? 240 : 320); h.setAttribute('aria-valuemax', l ? 560 : 980); h.setAttribute('aria-valuenow', Math.round(l ? w.l : w.r));
    }
  };
  const persist = () => { try { localStorage.setItem(PANES, JSON.stringify(w)); } catch { /* ignore */ } };
  apply();
  for (const h of lay.querySelectorAll('.rz')) {
    const side = h.dataset.rz;
    h.addEventListener('pointerdown', (e) => {
      e.preventDefault(); h.setPointerCapture(e.pointerId); h.classList.add('drag'); document.body.classList.add('resizing');
      const move = (ev) => {
        const r = lay.getBoundingClientRect();
        if (side === 'left') w.l = clamp(ev.clientX - r.left, 240, Math.max(280, Math.min(560, r.width - 440)));
        else w.r = clamp(r.right - ev.clientX, 320, Math.max(340, Math.min(980, r.width - w.l - 320)));
        apply();
      };
      const up = () => { h.removeEventListener('pointermove', move); h.removeEventListener('pointerup', up); h.classList.remove('drag'); document.body.classList.remove('resizing'); persist(); };
      h.addEventListener('pointermove', move); h.addEventListener('pointerup', up);
    });
    h.addEventListener('keydown', (e) => {
      const d = e.key === 'ArrowLeft' ? -16 : e.key === 'ArrowRight' ? 16 : 0;
      if (!d) return;
      e.preventDefault();
      if (side === 'left') w.l = clamp(w.l + d, 240, 560); else w.r = clamp(w.r - d, 320, 980);
      apply(); persist();
    });
    h.addEventListener('dblclick', () => { if (side === 'left') w.l = 340; else w.r = 520; apply(); persist(); });
  }
}

/* ---------- filters panel ---------- */
function buildSide() {
  const side = $('#side');
  side.replaceChildren();
  const logo = el('img', { src: '../mambo.png', alt: '', decoding: 'async' });
  logo.addEventListener('error', () => logo.remove());
  side.append(el('p', { class: 'wordmark' }, logo, 'Daily feed'));
  const reset = el('button', { type: 'button', class: 'btn sm', id: 'reset', text: 'Suggested filters' });
  const clear = el('button', { type: 'button', class: 'btn sm', id: 'clear', text: 'Clear filters' });
  reset.addEventListener('click', () => { selected = suggested(); changed(); });
  clear.addEventListener('click', () => { selected = new Set(); changed(); });
  side.append(el('div', { class: 'row' }, reset, clear));
  const acc = el('fieldset', {}, el('legend', { class: 'eyebrow', text: 'Access' }));
  for (const [key, label, note] of [['free', 'Free to read', 'Open to everyone'], ['members', 'May need a membership', 'Medium and linked articles that can be behind a paywall']]) {
    const input = el('input', { type: 'checkbox', id: 'a-' + key, 'data-access': key });
    input.checked = access[key];
    input.addEventListener('change', () => { access[key] = input.checked; saveAccess(); changed(); });
    acc.append(el('label', { class: 'chk', for: input.id }, input, el('span', { class: 't' }, label, el('small', { text: note }))));
  }
  side.append(acc);
  for (const g of data.filters.filter((f) => f.group)) {
    const fs = el('fieldset', {}, el('legend', { class: 'eyebrow', text: g.label }));
    for (const f of data.filters.filter((x) => x.parent === g.id)) {
      const input = el('input', { type: 'checkbox', value: f.id, id: 'f-' + f.id });
      input.checked = selected.has(f.id);
      input.disabled = !f.ready;
      input.addEventListener('change', () => {
        if (input.checked) selected.add(f.id); else selected.delete(f.id);
        changed();
      });
      const text = el('span', { class: 't' }, f.product ? `${f.label} ` : f.label);
      if (f.product) text.append(el('span', { class: 'p', text: `(${f.product})` }));
      if (!f.ready) text.append(el('small', { text: f.soon || 'No source yet' }));
      fs.append(el('label', { class: 'chk' + (f.ready ? '' : ' off'), for: input.id }, input, text));
    }
    side.append(fs);
  }
  side.append(el('p', { class: 'note', text: 'Your choices are saved in this browser only.' }));
}

function syncChecks() {
  for (const i of document.querySelectorAll('#side input[type=checkbox]')) i.checked = selected.has(i.value);
}

function setBanner() {
  const b = $('#banner');
  b.hidden = false;
  if (data.sample || data.fellBack) {
    b.textContent = 'Sample data. These are real items from 18 to 24 November 2026 gathered while building the feed, not today’s digest. The live feed rebuilds every day.';
    return;
  }
  b.hidden = true;
}

/* ---------- day cards ---------- */
function cal() {
  const end = data.latestDigest || (data.generated || new Date().toISOString()).slice(0, 10);
  return calendar(visibleDays(), [...selected], filterOrder(data.filters), end, shown);
}

function renderDays() {
  const out = $('#out');
  const sel = [...selected];
  if (!access.free && !access.members) {
    out.replaceChildren(el('p', { class: 'msg' }, el('strong', { text: 'No access type is on. ' }), 'Turn on Free to read or May need a membership.'));
    $('#status').textContent = 'No access type is on.';
    $('#count').textContent = '';
    return;
  }
  if (!sel.length) {
    out.replaceChildren(el('p', { class: 'msg' }, el('strong', { text: 'No filters are on. ' }), 'Turn on at least one filter to see your days.'));
    $('#status').textContent = 'No filters are on.';
    $('#count').textContent = '';
    return;
  }
  const days = cal();
  const labels = byId();
  const list = el('ul', { class: 'days', 'aria-label': 'Days' });
  for (const d of days) {
    let card;
    if (d.count) {
      const sources = new Set(d.sections.flatMap((s) => s.items.map((i) => i.source)));
      const tags = el('span', { class: 'tags' }, ...d.sections.map((s) => el('span', { class: 'tag', text: labels[s.filter].label })));
      card = el('button', { type: 'button', class: 'daycard', 'data-date': d.date, 'aria-pressed': String(d.date === openDate) },
        el('span', { class: 'date', text: shortDate(d.date) }),
        el('span', { class: 'title', text: d.title }),
        el('span', { class: 'meta', text: `${plural(d.count, 'update')} from ${plural(sources.size, 'source')}` }),
        tags);
      card.addEventListener('click', () => { lastDate = d.date; openDay(d.date); });
    } else {
      card = el('div', { class: 'daycard none' },
        el('span', { class: 'date', text: shortDate(d.date) }),
        el('span', { class: 'title', text: 'Nothing new' }));
    }
    list.append(el('li', {}, card));
  }
  const nodes = [list];
  const vd = visibleDays();
  const oldestData = vd.length ? vd[vd.length - 1].date : null;
  const oldestShown = days[days.length - 1].date;
  if (shown < MAX_DAYS && oldestData && oldestData < oldestShown) {
    const more = el('button', { type: 'button', class: 'btn sm', text: 'Show earlier days' });
    more.addEventListener('click', () => { shown = Math.min(MAX_DAYS, shown + STEP); renderDays(); });
    nodes.push(more);
  }
  out.replaceChildren(...nodes);
  const withNews = days.filter((d) => d.count).length;
  $('#count').textContent = `${withNews} of the last ${days.length} days have updates`;
  $('#status').textContent = `${plural(withNews, 'day')} with updates out of the last ${days.length}.`;
}

/* ---------- one item in a post ---------- */
const KIND = { model: 'New model', experiment: 'Experiment', research: 'Research', release: 'Release', guidance: 'Guidance', book: 'Book', news: 'News' };

function itemCard(it) {
  const url = safeUrl(it.link);
  const brief = it.brief || {};
  const tags = el('span', { class: 'tags' }, el('span', { class: 'tag kind-' + (it.kind || 'news'), text: KIND[it.kind] || KIND.news }));
  for (const m of it.models || []) tags.append(el('span', { class: 'tag', text: m }));
  if (it.access === 'members') tags.append(el('span', { class: 'tag', text: 'May need membership' }));
  const li = el('li', { class: 'item' }, tags, el('h3', { text: it.headline || it.title }), el('p', { class: 'src', text: it.sourceName }));
  // "what" is the plain description; setup and result only appear when the publisher's own text says them
  const what = brief.what || it.summary;
  if (what) li.append(el('p', { class: 'sum', text: what }));
  if (brief.setup || brief.result) {
    const dl = el('dl', { class: 'brief' });
    if (brief.setup) dl.append(el('dt', { text: 'Setup' }), el('dd', { text: brief.setup }));
    if (brief.result) dl.append(el('dt', { text: 'Result' }), el('dd', { text: brief.result }));
    li.append(dl);
  }
  if (url) li.append(el('a', { class: 'more', href: url, target: '_blank', rel: 'noopener noreferrer', 'aria-label': `Read more at ${it.sourceName}: ${it.title} (opens in a new tab)` }, `Read more at ${it.sourceName} ↗`));
  return li;
}

/* ---------- post panel ---------- */
const X_ICON = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>';

function showPost() {
  const lay = $('#lay'), d = $('#detail');
  const day = openDate ? cal().find((x) => x.date === openDate) : null;
  const open = !!(day && day.count);
  lay.classList.toggle('has-detail', open);
  d.hidden = !open; $('.rz-r', lay).hidden = !open; $('#dbd').hidden = !open;
  document.body.classList.toggle('sheet-open', open);
  for (const c of document.querySelectorAll('button.daycard')) c.setAttribute('aria-pressed', String(open && c.dataset.date === openDate));
  if (!open) { d.replaceChildren(); return; }

  const labels = byId();
  const close = el('button', { type: 'button', class: 'x', 'aria-label': 'Close post' });
  close.innerHTML = X_ICON;
  close.addEventListener('click', closeDay);
  const head = el('div', { class: 'd-head' }, el('span', { class: 'grab', 'aria-hidden': 'true' }), el('span', { class: 'eyebrow', text: longDate(day.date) }), close);
  const sources = new Set(day.sections.flatMap((s) => s.items.map((i) => i.source)));
  const title = el('h1', { id: 'post-title', text: day.title });
  const body = el('div', { class: 'd-body', id: 'dbody', tabindex: '-1' }, title,
    el('p', { class: 'post-meta', text: `${plural(day.count, 'update')} from ${plural(sources.size, 'source')} in ${plural(day.sections.length, 'section')}` }));
  for (const s of day.sections) {
    const f = labels[s.filter];
    const hid = 'sec-' + s.filter;
    const h2 = el('h2', { id: hid, text: f.label });
    if (f.product) h2.append(el('span', { class: 'p', text: f.product }));
    const list = el('ul', { class: 'items' });
    for (const it of s.items) list.append(itemCard(it));
    body.append(el('section', { class: 'sec', 'aria-labelledby': hid }, h2, list));
  }
  d.setAttribute('aria-label', `Post for ${longDate(day.date)}`);
  d.replaceChildren(head, body);

  // swipe down on the handle closes the sheet on phones
  let y0 = null;
  head.addEventListener('touchstart', (ev) => { y0 = ev.touches[0].clientY; }, { passive: true });
  head.addEventListener('touchmove', (ev) => { if (y0 !== null && ev.touches[0].clientY - y0 > 90) { y0 = null; closeDay(); } }, { passive: true });
  head.addEventListener('touchend', () => { y0 = null; });
}

function openDay(date) {
  openDate = date;
  showPost();
  if (location.hash !== '#' + date) history.replaceState(null, '', '#' + date);
  const body = $('#dbody');
  if (body) { body.scrollTop = 0; body.focus({ preventScroll: true }); }
  $('#status').textContent = `Opened the post for ${longDate(date)}.`;
}

function closeDay() {
  openDate = null;
  showPost();
  history.replaceState(null, '', location.pathname + location.search);
  const card = lastDate ? document.querySelector(`button.daycard[data-date="${lastDate}"]`) : null;
  (card || $('#main')).focus({ preventScroll: true });
}

function changed() {
  save(); syncChecks(); renderDays(); showPost();
}

function fromHash() {
  const m = /^#(\d{4}-\d{2}-\d{2})$/.exec(location.hash);
  if (!m) return;
  const d = cal().find((x) => x.date === m[1]);
  if (d && d.count) { openDate = m[1]; showPost(); }
  else if (openDate) { openDate = null; showPost(); }
}

async function init() {
  try {
    data = await getData();
  } catch {
    $('#out').replaceChildren(el('p', { class: 'msg' }, el('strong', { text: 'The feed could not load. ' }), 'Open this page from a web server (for example "npx serve" in the repo) instead of a file, and check that feed/data/latest.json exists.'));
    return;
  }
  readAccess();
  const ready = readyIds();
  const saved = readSaved();
  selected = saved === null ? suggested() : new Set(saved.filter((id) => ready.has(id)));

  initPanes($('#lay'));
  const here = $('.nav .tab[aria-current]');
  if (here) here.scrollIntoView({ inline: 'center', block: 'nearest' });
  buildSide();
  setBanner();
  renderDays();
  fromHash();
  $('#dbd').addEventListener('click', closeDay);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && openDate) closeDay(); });
  window.addEventListener('hashchange', () => { if (!location.hash) { openDate = null; showPost(); } else fromHash(); });
}

init();
