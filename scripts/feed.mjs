#!/usr/bin/env node
// Daily feed generator for the Mambo Database. Node 18+, no dependencies.
//   node scripts/feed.mjs              fetch every enabled source, write feed/data/latest.json
//   node scripts/feed.mjs --fixtures   read feed/fixtures instead of the network, write feed/data/sample.json
//   options: --out <file>  --now <ISO date>
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { enrich } from './feed-brief.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const FEED = path.join(ROOT, 'feed');
const DAY = 86400000;

/* ---------- text helpers ---------- */
const ENT = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', rsquo: '’', lsquo: '‘', rdquo: '”', ldquo: '“', hellip: '…', mdash: '—', ndash: '–' };

export function decode(s = '') {
  return s.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (m, e) => {
    if (e[0] === '#') {
      const n = e[1].toLowerCase() === 'x' ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10);
      try { return String.fromCodePoint(n); } catch { return m; }
    }
    const v = ENT[e.toLowerCase()];
    return v === undefined ? m : v;
  });
}

export function stripHtml(html = '') {
  return decode(
    html
      .replace(/<(script|style)[\s\S]*?<\/\1>/gi, ' ')
      .replace(/<br\s*\/?>|<\/(p|div|li|h\d)>/gi, ' ')
      .replace(/<[^>]+>/g, ' ')
  ).replace(/\s+/g, ' ').trim();
}

export function summarize(text, max = 200) {
  const t = text.replace(/\s+/g, ' ').trim();
  if (t.length <= max) return t;
  const cut = t.slice(0, max);
  const dot = Math.max(cut.lastIndexOf('. '), cut.lastIndexOf('? '), cut.lastIndexOf('! '));
  if (dot > 80) return cut.slice(0, dot + 1);
  return cut.replace(/\s+\S*$/, '') + '…';
}

export function cleanSummary(text, title = '') {
  let t = text
    .replace(/^summary:\s*/i, '')
    .replace(/\s*The post\b.{0,200}?\bappeared first on\b.{0,80}$/i, '')
    // CSS-Tricks style footer: "<Title> originally handwritten and published with love on CSS-Tricks. You should ..."
    .replace(/\s*originally handwritten and published with love on\b.*$/i, '')
    .trim();
  // the footer starts with the post title, so remove that title when it is left dangling at the end
  if (title && t.toLowerCase().endsWith(title.toLowerCase())) t = t.slice(0, t.length - title.length).trim();
  if (t.toLowerCase() === title.toLowerCase()) t = '';
  return summarize(t);
}

export function slug(s = '') {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60);
}

export function canonicalUrl(u) {
  try {
    const x = new URL(u);
    x.hash = '';
    for (const k of [...x.searchParams.keys()]) if (/^(utm_|fbclid$|gclid$)/i.test(k)) x.searchParams.delete(k);
    x.pathname = x.pathname.replace(/\/+$/, '') || '/';
    const s = x.toString();
    return x.pathname === '/' && !x.search ? s.replace(/\/$/, '') : s;
  } catch { return u; }
}

/* ---------- RSS / Atom ---------- */
function blocks(xml, tag) {
  const re = new RegExp(`<${tag}(?:\\s[^>]*)?>[\\s\\S]*?</${tag}>`, 'gi');
  return xml.match(re) || [];
}
function inner(xml, tag) {
  const m = new RegExp(`<${tag}(?:\\s[^>]*)?>([\\s\\S]*?)</${tag}>`, 'i').exec(xml);
  return m ? m[1] : '';
}
// CDATA keeps its markup; plain text is XML-decoded once.
function val(raw) {
  const c = /^\s*<!\[CDATA\[([\s\S]*?)\]\]>\s*$/.exec(raw);
  return c ? c[1] : decode(raw);
}
function toIso(s) {
  const d = new Date((s || '').trim());
  return Number.isNaN(d.getTime()) ? null : d.toISOString();
}

export function parseFeed(xml) {
  const atom = /<feed[\s>]/i.test(xml) && !/<rss[\s>]/i.test(xml);
  const out = [];
  for (const e of blocks(xml, atom ? 'entry' : 'item')) {
    let link = '';
    if (atom) {
      const links = [...e.matchAll(/<link\b([^>]*?)\/?>/gi)].map((m) => m[1]);
      const pick = links.find((a) => /rel=["']alternate["']/i.test(a)) || links.find((a) => !/rel=/i.test(a)) || links[0] || '';
      link = decode((/href=["']([^"']+)["']/i.exec(pick) || [])[1] || '');
    } else {
      link = stripHtml(val(inner(e, 'link')));
    }
    const body = atom ? inner(e, 'summary') || inner(e, 'content') : inner(e, 'description') || inner(e, 'content:encoded');
    const cats = atom
      ? [...e.matchAll(/<category\b[^>]*term=["']([^"']+)["']/gi)].map((m) => decode(m[1]))
      : blocks(e, 'category').map((c) => stripHtml(val(inner(c, 'category') || c.replace(/<\/?category[^>]*>/gi, ''))));
    const title = stripHtml(val(inner(e, 'title')));
    const full = atom ? inner(e, 'content') : inner(e, 'content:encoded');
    out.push({
      text: full ? stripHtml(val(full)).slice(0, 6000) : '',
      title,
      link,
      id: stripHtml(val(inner(e, atom ? 'id' : 'guid'))) || link,
      published: toIso(val(inner(e, atom ? 'published' : 'pubDate')) || val(inner(e, 'updated')) || val(inner(e, 'dc:date'))),
      summary: stripHtml(val(body)),
      categories: cats.filter(Boolean)
    });
  }
  return out;
}

/* ---------- Hugging Face JSON ---------- */
export function parseHfModels(json) {
  return (Array.isArray(json) ? json : []).map((m) => {
    const license = ((m.tags || []).find((t) => t.startsWith('license:')) || '').slice(8);
    return {
      title: String(m.id || '').split('/').pop(),
      link: `https://huggingface.co/${m.id}`,
      id: m.id,
      published: toIso(m.createdAt),
      summary: `${m.pipeline_tag || 'model'} · ${license || 'license not listed'}`,
      categories: []
    };
  });
}

export function parseHfPapers(json) {
  return (Array.isArray(json) ? json : []).map((x) => {
    const p = x.paper || x;
    return {
      title: stripHtml(p.title || x.title || ''),
      link: `https://huggingface.co/papers/${p.id}`,
      id: p.id,
      published: toIso(p.submittedOnDailyAt || x.publishedAt || p.publishedAt),
      summary: stripHtml(p.summary || x.summary || ''),
      text: stripHtml(p.summary || x.summary || ''),
      score: p.upvotes || 0,
      categories: []
    };
  });
}

/* ---------- tagging and digest ---------- */
export function tagItem(item, source, rules, known) {
  const set = new Set(source.filters || []);
  const all = `${item.title} ${item.summary}`;
  for (const r of rules) {
    if (new RegExp(r.match, 'i').test(r.field === 'title' ? item.title : all)) set.add(r.filter);
  }
  return [...set].filter((f) => !known || known.has(f));
}

export function processSource(source, rawItems, rules, now, known) {
  const newest = rawItems.map((i) => i.published).filter(Boolean).sort().pop() || null;
  const report = { id: source.id, ok: true, fetched: rawItems.length, newest, stale: !newest || now - new Date(newest) > 45 * DAY, kept: 0, dropped: 0 };
  const win = (source.windowDays || 14) * DAY;
  const inc = source.include ? new RegExp(source.include, 'i') : null;
  const exT = source.excludeTitle ? new RegExp(source.excludeTitle, 'i') : null;
  const exL = source.excludeLink ? new RegExp(source.excludeLink, 'i') : null;
  let items = [];
  for (const r of rawItems) {
    const t = r.published ? new Date(r.published) : null;
    const ok = r.title && r.link && t && now - t <= win && t - now <= DAY &&
      (!inc || inc.test(`${r.title} ${r.summary}`)) && !(exT && exT.test(r.title)) && !(exL && exL.test(r.link));
    if (!ok) { report.dropped++; continue; }
    const base = { title: r.title, summary: cleanSummary(r.summary || '', r.title) };
    // release feeds: an entry with no description (just a version tag) tells a reader nothing
    if (source.minSummary && base.summary.length < source.minSummary) { report.dropped++; continue; }
    const filters = tagItem({ ...base }, source, rules, known);
    if (!filters.length) { report.dropped++; continue; }
    // Hand-kept sources often point many items at one page, so the title is part of their id.
    const id = source.type === 'manual' ? `${canonicalUrl(r.link)}#${slug(r.title)}` : canonicalUrl(r.link);
    const item = {
      id, title: r.title, link: r.link, published: r.published,
      source: source.id, sourceName: source.name, summary: base.summary, filters, score: r.score || 0
    };
    if (source.access === 'members') item.access = 'members';
    if (r.text) item.text = r.text;
    // hand-kept items may carry their own brief: what / setup / result
    const mb = Object.fromEntries(['what', 'setup', 'result'].filter((k) => r[k]).map((k) => [k, String(r[k])]));
    if (Object.keys(mb).length) { item.brief = mb; item.manualBrief = true; }
    items.push(item);
  }
  if (source.maxPerDay) {
    const byDay = new Map();
    for (const i of items) { const d = i.published.slice(0, 10); (byDay.get(d) || byDay.set(d, []).get(d)).push(i); }
    items = [...byDay.values()].flatMap((a) => a.sort((x, y) => y.score - x.score || y.published.localeCompare(x.published)).slice(0, source.maxPerDay));
  }
  report.kept = items.length;
  return { items, report };
}

/* ---------- the 5:00 a.m. digest ----------
   The post for date D comes out at 5:00 a.m. Central on D and holds what was published since 5:00 a.m. the day before.
   Anything newer waits for the next morning. Items that only carry a date (midnight UTC) belong to that date. */
export const DIGEST = { timeZone: 'America/Chicago', hour: 5 };
function wallClock(date, timeZone) {
  const p = Object.fromEntries(new Intl.DateTimeFormat('en-US', { timeZone, hourCycle: 'h23', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' }).formatToParts(date).map((x) => [x.type, x.value]));
  return Date.UTC(+p.year, +p.month - 1, +p.day, +p.hour, +p.minute, +p.second);
}
const ymd = (ms) => new Date(ms).toISOString().slice(0, 10);
export function digestDate(iso, cfg = DIGEST) {
  if (/T00:00:00(?:\.000)?Z$/.test(iso)) return iso.slice(0, 10);
  return ymd(wallClock(new Date(iso), cfg.timeZone) - cfg.hour * 3600e3 + DAY);
}
export function latestDigest(now, cfg = DIGEST) {
  return ymd(wallClock(now, cfg.timeZone) - cfg.hour * 3600e3);
}

export function buildDays(items, previousDays = [], now, keepDays = 30, cfg = DIGEST) {
  const latest = latestDigest(now, cfg);
  const seen = new Map();
  const add = (i) => { if (!seen.has(i.id)) seen.set(i.id, i); };
  items.forEach(add);
  for (const d of previousDays) for (const i of d.items) if (now - new Date(i.published) <= keepDays * DAY) add(i);
  const byDate = new Map();
  for (const i of seen.values()) { const d = digestDate(i.published, cfg); if (d > latest) continue; (byDate.get(d) || byDate.set(d, []).get(d)).push(i); }
  return [...byDate.keys()].sort().reverse().map((date) => ({
    date,
    items: byDate.get(date).sort((a, b) => b.published.localeCompare(a.published))
  }));
}

/* ---------- loading ---------- */
async function fetchText(url) {
  const ctl = new AbortController();
  const timer = setTimeout(() => ctl.abort(), 15000);
  try {
    const r = await fetch(url, { signal: ctl.signal, headers: { 'user-agent': 'mambo-database-feed/1.0', accept: 'application/rss+xml, application/atom+xml, application/json, text/xml, */*' } });
    if (!r.ok) throw new Error('HTTP ' + r.status);
    return await r.text();
  } finally { clearTimeout(timer); }
}

async function readIfExists(file) {
  try { return await readFile(file, 'utf8'); } catch (e) { if (e.code === 'ENOENT') return null; throw e; }
}

async function loadRaw(source, fixtures) {
  if (source.type === 'manual') {
    const t = await readIfExists(path.join(FEED, 'manual', `${source.id}.json`));
    if (t === null) return null;
    return (JSON.parse(t).items || []).map((i) => ({ ...i, published: toIso(i.published), id: i.link }));
  }
  const ext = source.type === 'hf-models' || source.type === 'hf-papers' ? 'json' : 'xml';
  const text = fixtures ? await readIfExists(path.join(FEED, 'fixtures', `${source.id}.${ext}`)) : await fetchText(source.url);
  if (text === null) return null;
  if (source.type === 'hf-models') return parseHfModels(JSON.parse(text));
  if (source.type === 'hf-papers') return parseHfPapers(JSON.parse(text));
  return parseFeed(text);
}

export async function run({ fixtures = false, out, now = new Date() } = {}) {
  const cfg = JSON.parse(await readFile(path.join(FEED, 'sources.json'), 'utf8'));
  const known = new Set(cfg.filters.filter((f) => !f.group).map((f) => f.id));
  const outFile = out || path.join(FEED, 'data', fixtures ? 'sample.json' : 'latest.json');
  const prevText = fixtures ? null : await readIfExists(outFile);
  const prev = prevText ? JSON.parse(prevText) : { days: [] };

  const all = [];
  const reports = [];
  for (const s of cfg.sources.filter((x) => x.enabled)) {
    try {
      const raw = await loadRaw(s, fixtures);
      if (raw === null) { reports.push({ id: s.id, ok: true, skipped: 'no fixture or manual file' }); continue; }
      const { items, report } = processSource(s, raw, cfg.rules, now, known);
      all.push(...items);
      reports.push(report);
    } catch (e) {
      reports.push({ id: s.id, ok: false, error: String(e.message || e) });
    }
  }

  // every report carries the source name and type, so the page can say which sources failed
  const meta = new Map(cfg.sources.map((x) => [x.id, x]));
  for (const r of reports) { r.name = meta.get(r.id).name; r.type = meta.get(r.id).type; }
  // if no network source could be read, keep the previous file: stamping it "generated now" would hide the problem
  const net = reports.filter((r) => r.type !== 'manual' && !r.skipped);
  if (!fixtures && net.length && net.every((r) => !r.ok)) {
    throw new Error(`every network source failed (${net.length}); kept the previous file. First error: ${net[0].error}`);
  }

  const sourcesById = new Map(cfg.sources.map((x) => [x.id, x]));
  const offline = async () => { throw new Error('offline'); };
  const briefStats = await enrich(all, sourcesById, { doFetch: fixtures ? offline : globalThis.fetch });
  for (const it of all) delete it.manualBrief;

  const digest = { ...DIGEST, ...(cfg.digest || {}) };
  // hand-picked standouts live in their own list and are never presented as today's news
  const showcaseIds = new Set(cfg.sources.filter((x) => x.showcase).map((x) => x.id));
  const showcase = all.filter((i) => showcaseIds.has(i.source)).sort((a, b) => b.published.localeCompare(a.published));
  const days = buildDays(all.filter((i) => !showcaseIds.has(i.source)), prev.days, now, 30, digest);
  const readyBySource = new Set(cfg.sources.filter((s) => s.enabled).flatMap((s) => s.filters));
  const readyByRule = new Set(cfg.rules.map((r) => r.filter));
  const filters = cfg.filters.map((f) => (f.group ? f : { ...f, ready: !f.soon && (readyBySource.has(f.id) || readyByRule.has(f.id)) }));

  const result = { generated: now.toISOString(), latestDigest: latestDigest(now, digest), sample: fixtures, filters, sources: reports, briefs: briefStats, showcase, days };
  await mkdir(path.dirname(outFile), { recursive: true });
  await writeFile(outFile, JSON.stringify(result, null, 2) + '\n');
  return { outFile, result };
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  const a = process.argv.slice(2);
  const arg = (n) => (a.includes(n) ? a[a.indexOf(n) + 1] : undefined);
  const fixtures = a.includes('--fixtures');
  const now = arg('--now') ? new Date(arg('--now')) : fixtures ? new Date('2026-11-24T12:00:00Z') : new Date();
  let done;
  try { done = await run({ fixtures, out: arg('--out'), now }); } catch (e) { console.error('feed.mjs: ' + e.message); process.exit(1); }
  const { outFile, result } = done;
  const items = result.days.reduce((n, d) => n + d.items.length, 0);
  console.log(`Wrote ${outFile}: ${result.days.length} days, ${items} items`);
  const b = result.briefs;
  console.log(`  briefs: ${b.fromFeedText} from feed text, ${b.fromPage} from article pages (${b.pageTried} tried, ${b.pageFailed} failed)`);
  const kinds = {}; for (const d of result.days) for (const i of d.items) kinds[i.kind] = (kinds[i.kind] || 0) + 1;
  console.log('  kinds: ' + Object.entries(kinds).map(([k, n]) => `${k} ${n}`).join(', '));
  const sample = result.days.flatMap((d) => d.items).filter((i) => i.brief).slice(0, 4);
  for (const i of sample) console.log(`  sample brief [${i.kind}] ${i.headline || i.title}: ${JSON.stringify(i.brief)}`);
  for (const r of result.sources) {
    const note = r.skipped ? `skipped (${r.skipped})` : r.ok ? `${r.kept} kept of ${r.fetched}${r.stale ? ', STALE (newest ' + r.newest + ')' : ''}` : `FAILED: ${r.error}`;
    console.log(`  ${r.id}: ${note}`);
  }
}
