// Turns a feed item into a quick-to-read brief: what kind of news it is, the model name, and (when the text says so)
// what it is, how it was set up and what came out of it. Pure functions plus one optional page fetch. No dependencies.
// Everything here only picks sentences the publisher wrote; nothing is invented.
import { stripHtml, decode } from './feed.mjs';

export const KIND_LABEL = { model: 'New model', experiment: 'Experiment', research: 'Research', release: 'Release', guidance: 'Guidance', book: 'Book', news: 'News' };

const FAMILIES = 'Claude|Gemini|GPT|Qwen|Llama|Grok|DeepSeek|Mistral|Magistral|Devstral|Voxtral|Timestral|Genie|Muse|Sora|Veo|Imagen|Gemma|Copilot|Phi|Nemotron';
const NAME_RE = new RegExp(`\\b(${FAMILIES})(?=[\\s\\d.-])[\\w .+-]{0,32}`, 'g');
const RELEASE_RE = /\b(introducing|introduces|introduce|new|launch(?:es|ed|ing)?|releas(?:es|ed|ing)|available|announc(?:es|ed|ing)|unveil(?:s|ed|ing)?|debut(?:s|ed)?|rolls? out|open[- ]sourc(?:es|ed)|now (?:live|here))\b/i;
const EXPERIMENT_RE = /\b(plays?|played|playing|tested|testing|put to the test|beats?|beat the game|speed ?run\w*|head-to-head|versus|vs\.?|challenge[ds]?|experiment\w*|pits?|pitted|we (?:gave|let|asked|tried))\b/i;

/* Model names in a title: "Introducing Claude Fable 5.2 and Claude Mythos 5.2" -> ["Claude Fable 5.2", "Claude Mythos 5.2"]. */
export function modelNames(title = '') {
  const found = [];
  const family = new RegExp(`^(?:${FAMILIES})(?=[\\s\\d.-])`);
  for (const m of title.matchAll(NAME_RE)) {
    // a match can hold several names ("Claude Fable 5.2 and Claude Mythos 5.2"), so split on the connecting words first
    const parts = m[0].split(/\s+(?:and|with|for|in|is|are|was|were|now|from|to|on|that|at|by|as|—|–)\s+|[,:;()!?]|\s-\s/i);
    for (let s of parts) {
      s = s.trim();
      if (!family.test(s)) continue;
      // keep a capitalised model word after the number ("Gemini 4 Neon"), but drop trailing lowercase words
      s = s.replace(/\s+[a-z][\w-]*(?:\s+[a-z][\w-]*)*$/, '').replace(/[.\s-]+$/, '');
      if (!/\d/.test(s) || s.length < 4) continue;
      if (!found.includes(s)) found.push(s);
    }
  }
  return found.slice(0, 2);
}

const TECH = new Set(['anthropic', 'openai', 'google', 'apple', 'qwen', 'microsoft', 'meta', 'mistral', 'xai', 'deepseek', 'models', 'research', 'optimization', 'experiments']);

export function classify(item, source = {}) {
  const f = new Set(item.filters || []);
  const title = item.title || '';
  const names = modelNames(title);
  if ((source.type === 'hf-models') || (names.length && RELEASE_RE.test(title))) return 'model';
  if ([...f].some((x) => TECH.has(x)) && EXPERIMENT_RE.test(title)) return 'experiment';
  if (f.has('books')) return 'book';
  if (source.type === 'hf-papers' || f.has('research')) return 'research';
  if (/\b(release notes?|v?\d+\.\d+(?:\.\d+)?\b.*\brelease|released)\b/i.test(title) || source.type === 'atom' && /releases\.atom/.test(source.url || '')) return 'release';
  if (f.has('accessibility') || f.has('design-systems') || f.has('google-design') || f.has('apple-design')) return 'guidance';
  return 'news';
}

/* "New Gemini model: Gemini 4 Neon". Only for real releases; anything else keeps its own title. */
/* First useful clause of release notes: "What's Changed - Fix X by @a in #1" -> "Fix X". */
export function releaseLead(summary = '', max = 90) {
  let t = summary.replace(/\s+/g, ' ').trim()
    .replace(/^(?:#+\s*)?(?:what'?s (?:changed|new)|changelog|release notes?|highlights|summary)\b[:\s-]*/i, '')
    .replace(/^[-*•\s]+/, '');
  t = t.split(/(?<=[.!?])\s|\s[-*•]\s/)[0].replace(/\s+(?:by|in|via)\s+@\S+.*$/i, '').replace(/\s+\(?#\d+\)?.*$/, '').trim();
  if (t.length > max) t = t.slice(0, max).replace(/\s+\S*$/, '') + '…';
  return t.replace(/[.\s]+$/, '');
}

export function headline(item, kind, source = {}) {
  if (kind === 'release') {
    // a bare version number says nothing, so put what the release is about next to it
    const product = String(source.name || '').replace(/\s+releases?$/i, '');
    const lead = releaseLead(item.summary);
    if (!product || !lead) return '';
    const version = item.title.toLowerCase().includes(product.toLowerCase()) ? item.title : `${product} ${item.title}`;
    return `${version}: ${lead}`;
  }
  if (kind !== 'model') return '';
  const names = modelNames(item.title);
  // Hugging Face model ids carry the company in the source name ("Mistral (Hugging Face)")
  if (source.type === 'hf-models') {
    const company = String(source.name || '').replace(/\s*\(.*\)$/, '');
    return `New ${company} model: ${names[0] || item.title}`;
  }
  if (!names.length) return '';
  const family = names[0].split(/[\s-]/)[0];
  const many = names.length > 1;
  return `New ${family} model${many ? 's' : ''}: ${names.join(' and ')}`;
}

/* ---------- sentence picking ---------- */
function sentences(text) {
  return text
    .replace(/\s+/g, ' ')
    .split(/(?<=[.!?])\s+(?=[A-Z“"(])/)
    .map((s) => s.trim())
    .filter((s) => s.length >= 40 && s.length <= 280 && !/\b(subscribe|newsletter|cookie|sign up|read more|click here|all rights reserved|follow us)\b/i.test(s));
}
const SETUP_RE = /\b(we (?:gave|set up|built|ran|trained|evaluated|tested|used|let|asked)|(?:was|were) (?:given|tested|trained|evaluated|run|asked|built)|(?:the|our) (?:setup|task|test|experiment|benchmark|harness|scaffold|agent|prompt)|each (?:model|agent|run)|using (?:a|an|the)|by (?:combining|using|pairing))\b/i;
const RESULT_RE = /\b(results?|found that|finds that|outperform\w*|achiev\w+|reach(?:es|ed)|improv\w+|faster|slower|beat|beats|completed|scor(?:es|ed)|reduc\w+|cuts?|up to|compared (?:to|with)|than)\b/i;
const HAS_NUMBER = /\d/;

export function pickBrief(paragraphs, { summary = '', title = '' } = {}) {
  const sents = paragraphs.flatMap((p) => sentences(p));
  const clean = (s) => s.replace(/\s+/g, ' ').trim();
  const brief = {};
  const first = sents.find((s) => s.toLowerCase() !== title.toLowerCase());
  if (first && (summary.length < 100 || first.length > summary.length)) brief.what = shortSentence(first);
  const setup = sents.find((s) => SETUP_RE.test(s) && s !== first);
  if (setup) brief.setup = shortSentence(clean(setup));
  const result = sents.find((s) => RESULT_RE.test(s) && HAS_NUMBER.test(s) && s !== first && s !== setup);
  if (result) brief.result = shortSentence(clean(result));
  return brief;
}
function shortSentence(s, max = 240) {
  return s.length <= max ? s : s.slice(0, max).replace(/\s+\S*$/, '') + '…';
}

/* ---------- page text ---------- */
export function pageParagraphs(html) {
  const body = html.replace(/<(script|style|nav|header|footer|aside|form)[\s\S]*?<\/\1>/gi, ' ');
  const region = /<(article|main)[\s>][\s\S]*?<\/\1>/i.exec(body);
  const src = region ? region[0] : body;
  const paras = [...src.matchAll(/<p(?:\s[^>]*)?>([\s\S]*?)<\/p>/gi)].map((m) => stripHtml(m[1])).filter((p) => p.length >= 60);
  const meta = /<meta[^>]+(?:property|name)=["'](?:og:description|description)["'][^>]*content=["']([^"']+)["']/i.exec(html)
    || /<meta[^>]+content=["']([^"']+)["'][^>]*(?:property|name)=["'](?:og:description|description)["']/i.exec(html);
  const lead = meta ? decode(meta[1]).trim() : '';
  return { lead, paras: paras.slice(0, 20) };
}

async function fetchPage(url, doFetch) {
  const ctl = new AbortController();
  const timer = setTimeout(() => ctl.abort(), 10000);
  try {
    const r = await doFetch(url, { signal: ctl.signal, headers: { 'user-agent': 'mambo-database-feed/1.0', accept: 'text/html' } });
    if (!r.ok) throw new Error('HTTP ' + r.status);
    const type = r.headers && r.headers.get ? r.headers.get('content-type') || '' : 'text/html';
    if (!/html/i.test(type)) throw new Error('not html');
    return (await r.text()).slice(0, 400000);
  } finally { clearTimeout(timer); }
}

/* Add kind, headline, model names and a brief to every item. Items keep working if any step fails. */
export async function enrich(items, sourcesById, { doFetch = globalThis.fetch, maxPages = 40, concurrency = 5 } = {}) {
  const stats = { items: items.length, fromFeedText: 0, fromPage: 0, pageTried: 0, pageFailed: 0 };
  for (const it of items) {
    const source = sourcesById.get(it.source) || {};
    it.kind = classify(it, source);
    const h = headline(it, it.kind, source);
    if (h) it.headline = h;
    const names = modelNames(it.title);
    if (names.length) it.models = names;
  }
  // 1) text the feed already carried (full content or an abstract)
  const needPage = [];
  for (const it of items) {
    if (it.manualBrief) continue;
    const paras = it.text ? [it.text] : [];
    const b = paras.length ? pickBrief(paras, { summary: it.summary, title: it.title }) : {};
    if (Object.keys(b).length) { it.brief = b; stats.fromFeedText++; }
    const source = sourcesById.get(it.source) || {};
    const wantsPage = ['model', 'experiment', 'news', 'research'].includes(it.kind) && source.type !== 'manual' && source.type !== 'hf-models' && source.type !== 'hf-papers' && /^https?:/.test(it.link);
    if (wantsPage && !(it.brief && it.brief.setup && it.brief.result)) needPage.push(it);
  }
  // 2) the article page, newest first, a limited number per run
  const queue = needPage.sort((a, b) => b.published.localeCompare(a.published)).slice(0, maxPages);
  let next = 0;
  const worker = async () => {
    while (next < queue.length) {
      const it = queue[next++];
      stats.pageTried++;
      try {
        const html = await fetchPage(it.link, doFetch);
        const { lead, paras } = pageParagraphs(html);
        const b = pickBrief([lead, ...paras].filter(Boolean), { summary: it.summary, title: it.title });
        const merged = { ...(it.brief || {}), ...b };
        if (Object.keys(merged).length) { it.brief = merged; stats.fromPage++; }
      } catch { stats.pageFailed++; }
    }
  };
  await Promise.all(Array.from({ length: concurrency }, worker));
  for (const it of items) delete it.text;
  return stats;
}
