import { assignSections, daysFor, postTitle, filterLabel, filterOrder } from './lib/compose.mjs';

const STORE = 'mambo-feed-filters-v1';
const $ = (s) => document.querySelector(s);

let data = null;
let selected = new Set();
let currentDate = null;

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

function readSaved() {
  try { const v = JSON.parse(localStorage.getItem(STORE)); return Array.isArray(v) ? v : null; } catch { return null; }
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

function buildFilters() {
  const host = $('#filter-groups');
  host.replaceChildren();
  for (const g of data.filters.filter((f) => f.group)) {
    const fs = el('fieldset', {}, el('legend', { text: g.label }));
    for (const f of data.filters.filter((x) => x.parent === g.id)) {
      const input = el('input', { type: 'checkbox', value: f.id, id: 'f-' + f.id });
      input.checked = selected.has(f.id);
      input.disabled = !f.ready;
      input.addEventListener('change', () => {
        if (input.checked) selected.add(f.id); else selected.delete(f.id);
        save(); render();
      });
      const text = el('span', { class: 't', text: filterLabel(f) });
      if (!f.ready) text.append(el('small', { text: f.soon || 'No source yet' }));
      fs.append(el('label', { class: 'fl' + (f.ready ? '' : ' off'), for: input.id }, input, text));
    }
    host.append(fs);
  }
}

function syncChecks() {
  for (const i of document.querySelectorAll('#filter-groups input')) i.checked = selected.has(i.value);
}

function setBanner() {
  const b = $('#banner');
  b.hidden = false;
  if (data.sample || data.fellBack) {
    b.textContent = 'Sample data. These are real items from 18 to 24 November 2026 gathered while building the feed, not today’s digest. Run "node scripts/feed.mjs" to make a live one.';
    return;
  }
  const failed = (data.sources || []).filter((s) => s.ok === false).map((s) => s.name || s.id);
  b.textContent = 'Updated ' + longDate(data.generated) + (failed.length ? '. Could not read: ' + failed.join(', ') + '. Items from those sources may be missing today.' : '');
}

function render() {
  const out = $('#out');
  const sel = [...selected];
  $('#filters-summary').textContent = `Filters (${sel.length} on)`;

  if (!sel.length) {
    $('#daynav').hidden = true;
    out.replaceChildren(el('p', { class: 'msg' }, el('strong', { text: 'No filters are on. ' }), 'Turn on at least one filter to build your post.'));
    $('#status').textContent = 'No filters are on.';
    return;
  }
  const days = daysFor(data.days, sel);
  if (!days.length) {
    $('#daynav').hidden = true;
    out.replaceChildren(el('p', { class: 'msg' }, el('strong', { text: 'Nothing new for these filters yet. ' }), 'Try turning on more filters.'));
    $('#status').textContent = 'Nothing new for these filters.';
    return;
  }
  let idx = days.findIndex((d) => d.date === currentDate);
  if (idx < 0) idx = 0;
  const day = days[idx];
  currentDate = day.date;

  const nav = $('#daynav');
  nav.hidden = false;
  const select = $('#day');
  select.replaceChildren(...days.map((d) => el('option', { value: d.date, text: `${shortDate(d.date)} (${d.items.length})` })));
  select.value = day.date;
  $('#older').disabled = idx === days.length - 1;
  $('#newer').disabled = idx === 0;

  const sections = assignSections(day.items, sel, filterOrder(data.filters));
  const byId = Object.fromEntries(data.filters.map((f) => [f.id, f]));
  const sources = new Set(day.items.map((i) => i.source));

  const head = el('header', { class: 'post-head' },
    el('h2', { text: postTitle(sections) }),
    el('p', { class: 'post-meta', text: `${longDate(day.date)} · ${day.items.length} update${day.items.length === 1 ? '' : 's'} from ${sources.size} source${sources.size === 1 ? '' : 's'}` })
  );
  const nodes = [head];
  sections.forEach((s, n) => {
    const f = byId[s.filter];
    const hid = 'sec-' + s.filter;
    const h3 = el('h3', { id: hid, text: f.label });
    if (f.product) h3.append(el('span', { class: 'p', text: f.product }));
    const list = el('ul', { class: 'items' });
    for (const it of s.items) {
      const url = safeUrl(it.link);
      const li = el('li', { class: 'item' }, el('h4', { text: it.title }), el('p', { class: 'src', text: it.sourceName }));
      if (it.summary) li.append(el('p', { class: 'sum', text: it.summary }));
      if (url) {
        const a = el('a', { class: 'more', href: url, target: '_blank', rel: 'noopener noreferrer', 'aria-label': `Read more at ${it.sourceName}: ${it.title} (opens in a new tab)` }, `Read more at ${it.sourceName} ↗`);
        li.append(a);
      }
      list.append(li);
    }
    nodes.push(el('section', { class: 'sec', 'aria-labelledby': hid }, h3, list));
    void n;
  });
  out.replaceChildren(...nodes);
  $('#status').textContent = `Showing ${day.items.length} updates in ${sections.length} section${sections.length === 1 ? '' : 's'} for ${longDate(day.date)}.`;
}

function step(delta) {
  const days = daysFor(data.days, [...selected]);
  const idx = days.findIndex((d) => d.date === currentDate);
  const next = days[idx + delta];
  if (next) { currentDate = next.date; render(); }
}

async function init() {
  try {
    data = await getData();
  } catch {
    $('#out').replaceChildren(el('p', { class: 'msg' }, el('strong', { text: 'The feed could not load. ' }), 'Open this page from a web server (for example "npx serve" in the repo) instead of a file, and check that feed/data/latest.json exists.'));
    return;
  }
  const ready = readyIds();
  const saved = readSaved();
  selected = new Set((saved || [...suggested()]).filter((id) => ready.has(id)));
  if (saved === null) selected = suggested();

  buildFilters();
  setBanner();
  $('#reset').addEventListener('click', () => { selected = suggested(); save(); syncChecks(); render(); });
  $('#clear').addEventListener('click', () => { selected = new Set(); save(); syncChecks(); render(); });
  $('#day').addEventListener('change', (e) => { currentDate = e.target.value; render(); });
  $('#older').addEventListener('click', () => step(1));
  $('#newer').addEventListener('click', () => step(-1));
  $('#filters').open = window.matchMedia('(min-width: 821px)').matches;
  render();
}

init();
