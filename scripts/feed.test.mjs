// Run: node --test scripts/feed.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  decode, stripHtml, summarize, cleanSummary, canonicalUrl,
  parseFeed, parseHfModels, parseHfPapers, tagItem, processSource, buildDays, run
} from './feed.mjs';
import { assignSections, daysFor, postTitle, shorten, filterOrder } from '../feed/lib/compose.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const cfg = JSON.parse(await readFile(path.join(ROOT, 'feed', 'sources.json'), 'utf8'));
const known = new Set(cfg.filters.filter((f) => !f.group).map((f) => f.id));
const NOW = new Date('2026-11-24T08:00:00Z');

test('decode handles named, decimal and hex entities', () => {
  assert.equal(decode('Tom &amp; Jerry &#8217;s &#x2014; &nbsp;ok &bogus;'), 'Tom & Jerry ’s —  ok &bogus;');
});

test('stripHtml removes tags, scripts and extra spaces', () => {
  assert.equal(stripHtml('<p>Hello <b>world</b></p><script>x()</script><p>again&nbsp;now</p>'), 'Hello world again now');
});

test('summarize cuts at a sentence or word boundary', () => {
  const long = 'First sentence is here and it is fairly long so that the cut lands after it. ' + 'word '.repeat(60);
  const s = summarize(long, 120);
  assert.ok(s.length <= 121);
  assert.ok(s.endsWith('.') || s.endsWith('…'));
  assert.equal(summarize('short', 200), 'short');
});

test('cleanSummary drops boilerplate and a summary that repeats the title', () => {
  assert.equal(cleanSummary('Summary: Pick the right method.'), 'Pick the right method.');
  assert.equal(cleanSummary('Real text. Foo originally handwritten and published with love on CSS-Tricks. You should really get the newsletter as well.', 'Foo'), 'Real text.');
  assert.equal(cleanSummary('Real text. The post Foo appeared first on Bar Blog.', 'Foo'), 'Real text.');
  assert.equal(cleanSummary('Same Title', 'same title'), '');
});

test('canonicalUrl removes tracking params and trailing slash', () => {
  assert.equal(canonicalUrl('https://a.com/x/?utm_source=rss&id=3#top'), 'https://a.com/x?id=3');
  assert.equal(canonicalUrl('https://a.com/x/'), 'https://a.com/x');
  assert.equal(canonicalUrl('https://a.com/'), 'https://a.com');
  assert.equal(canonicalUrl('not a url'), 'not a url');
});

test('parseFeed reads RSS with CDATA, escaped HTML and categories', () => {
  const xml = `<rss><channel><item><title><![CDATA[Hello &amp; <b>World</b>]]></title><link>https://x.com/a</link>
    <pubDate>Mon, 23 Nov 2026 18:00:00 +0000</pubDate><description>&lt;p&gt;Escaped &lt;b&gt;html&lt;/b&gt;&lt;/p&gt;</description>
    <category>One</category><category><![CDATA[Two]]></category></item></channel></rss>`;
  const [i] = parseFeed(xml);
  assert.equal(i.title, 'Hello & World');
  assert.equal(i.link, 'https://x.com/a');
  assert.equal(i.published, '2026-11-23T18:00:00.000Z');
  assert.equal(i.summary, 'Escaped html');
  assert.deepEqual(i.categories, ['One', 'Two']);
});

test('parseFeed reads Atom, prefers rel=alternate, falls back to updated', () => {
  const xml = `<feed xmlns="http://www.w3.org/2005/Atom"><entry><id>tag:x,1</id><title>Rel</title>
    <link rel="self" href="https://x.com/self"/><link rel="alternate" href="https://x.com/page?a=1&amp;b=2"/>
    <updated>2026-11-19T17:34:17.165Z</updated><summary>Short</summary></entry></feed>`;
  const [i] = parseFeed(xml);
  assert.equal(i.link, 'https://x.com/page?a=1&b=2');
  assert.equal(i.published, '2026-11-19T17:34:17.165Z');
  assert.equal(i.id, 'tag:x,1');
});

test('parseFeed gives published=null for a bad date instead of throwing', () => {
  const [i] = parseFeed('<rss><channel><item><title>T</title><link>https://x.com</link><pubDate>not a date</pubDate></item></channel></rss>');
  assert.equal(i.published, null);
});

test('parseHfModels uses createdAt, not lastModified', () => {
  const [m] = parseHfModels([{ id: 'Qwen/Q-1', createdAt: '2026-04-21T07:50:43.000Z', lastModified: '2026-11-20T00:00:00Z', pipeline_tag: 'text-generation', tags: ['license:apache-2.0'] }]);
  assert.equal(m.published, '2026-04-21T07:50:43.000Z');
  assert.equal(m.title, 'Q-1');
  assert.match(m.summary, /apache-2\.0/);
});

test('parseHfPapers reads the nested paper object', () => {
  const [p] = parseHfPapers([{ paper: { id: '2611.1', title: 'T', summary: 'S', upvotes: 5, submittedOnDailyAt: '2026-11-23T00:00:00.000Z' } }]);
  assert.equal(p.link, 'https://huggingface.co/papers/2611.1');
  assert.equal(p.score, 5);
  assert.equal(p.published, '2026-11-23T00:00:00.000Z');
});

test('tagItem: product versions are models, plain product names are not, e-books are books', () => {
  const src = { filters: ['google'] };
  const t = (title, summary = '') => tagItem({ title, summary }, src, cfg.rules, known);
  assert.ok(t('Introducing Claude Fable 5.2').includes('models'));
  assert.ok(t('See what 6 builders make with Gemini 4 Hydrogen').includes('models'));
  assert.ok(!t('Things to do with Gemini Canvas').includes('models'));
  assert.ok(t('Interview', 'a new e-book for designers').includes('books'));
  assert.ok(!t('Facebook news').includes('books'));
  assert.ok(t('A faster way to compress and quantize models').includes('optimization'));
  assert.ok(t('Using color well').includes('color'), 'whole word "color" in a title is tagged');
  assert.ok(!t('A trip to Colorado').includes('color'), 'a longer word that starts with "color" is not tagged');
});

test('tagItem drops filter ids that are not in the registry', () => {
  assert.deepEqual(tagItem({ title: 'x', summary: '' }, { filters: ['nope', 'google'] }, [], known), ['google']);
});

const raw = (title, published, extra = {}) => ({ title, link: `https://x.com/${encodeURIComponent(title)}`, published, summary: 'S', ...extra });

test('processSource drops old, future, undated and excluded items and flags a stale feed', () => {
  const src = { id: 's', name: 'S', filters: ['google'], windowDays: 14, excludeTitle: 'promo' };
  const { items, report } = processSource(src, [
    raw('fresh', '2026-11-23T10:00:00.000Z'),
    raw('old', '2026-10-01T10:00:00.000Z'),
    raw('future', '2026-12-30T10:00:00.000Z'),
    raw('promo day', '2026-11-23T10:00:00.000Z'),
    raw('undated', null)
  ], cfg.rules, NOW, known);
  assert.deepEqual(items.map((i) => i.title), ['fresh']);
  assert.equal(report.dropped, 4);
  assert.equal(report.stale, false);
  const stale = processSource(src, [raw('a', '2025-09-23T04:00:00.000Z')], cfg.rules, NOW, known);
  assert.equal(stale.report.stale, true);
  assert.equal(stale.items.length, 0);
});

test('processSource: include pattern and excludeLink', () => {
  const src = { id: 's', name: 'S', filters: ['research'], include: 'quantiz', excludeLink: '/skip/' };
  const { items } = processSource(src, [
    raw('Low-bit quantization wins', '2026-11-23T10:00:00.000Z'),
    raw('Unrelated paper', '2026-11-23T10:00:00.000Z'),
    { ...raw('Quantization in /skip/', '2026-11-23T10:00:00.000Z'), link: 'https://x.com/skip/1' }
  ], cfg.rules, NOW, known);
  assert.deepEqual(items.map((i) => i.title), ['Low-bit quantization wins']);
});

test('processSource: maxPerDay keeps the highest-scored items per day', () => {
  const src = { id: 'p', name: 'P', filters: ['research'], maxPerDay: 2 };
  const { items } = processSource(src, [
    raw('a', '2026-11-23T00:00:00.000Z', { score: 1 }),
    raw('b', '2026-11-23T00:00:00.000Z', { score: 9 }),
    raw('c', '2026-11-23T00:00:00.000Z', { score: 5 }),
    raw('d', '2026-11-22T00:00:00.000Z', { score: 0 })
  ], cfg.rules, NOW, known);
  assert.deepEqual(items.map((i) => i.title).sort(), ['b', 'c', 'd']);
});

test('buildDays groups by UTC date, sorts newest first, dedupes and keeps recent history', () => {
  const mk = (id, published) => ({ id, title: id, published, filters: ['google'] });
  const prev = [{ date: '2026-11-10', items: [mk('keep', '2026-11-10T09:00:00.000Z'), mk('ancient', '2026-09-01T09:00:00.000Z')] }];
  const days = buildDays([mk('a', '2026-11-23T10:00:00.000Z'), mk('b', '2026-11-23T12:00:00.000Z'), mk('a', '2026-11-23T10:00:00.000Z'), mk('c', '2026-11-20T01:00:00.000Z')], prev, NOW);
  assert.deepEqual(days.map((d) => d.date), ['2026-11-23', '2026-11-20', '2026-11-10']);
  assert.deepEqual(days[0].items.map((i) => i.id), ['b', 'a']);
  assert.ok(!JSON.stringify(days).includes('ancient'));
});

test('manual sources: items that share one link all survive', () => {
  const src = { id: 'm', name: 'M', type: 'manual', filters: ['apple-design'], windowDays: 30 };
  const same = 'https://developer.apple.com/design/whats-new/';
  const { items } = processSource(src, [
    { title: 'New product bezels', link: same, published: '2026-11-06T00:00:00.000Z', summary: 'a' },
    { title: 'Updated Live Activities UI kits', link: same, published: '2026-11-06T00:00:00.000Z', summary: 'b' }
  ], cfg.rules, NOW, known);
  assert.equal(items.length, 2);
  assert.notEqual(items[0].id, items[1].id);
  assert.equal(buildDays(items, [], NOW).flatMap((d) => d.items).length, 2);
});

test('accessibility is tagged from the title only', () => {
  const src = { filters: ['trends'] };
  assert.ok(tagItem({ title: 'WCAG 3 draft updated', summary: '' }, src, cfg.rules, known).includes('accessibility'));
  assert.ok(!tagItem({ title: 'A resource for old articles', summary: 'covers web accessibility' }, src, cfg.rules, known).includes('accessibility'));
});

test('compose: each item lands in one section, under the first selected filter', () => {
  const order = ['anthropic', 'google', 'models'];
  const items = [
    { id: '1', title: 'Gemini 4', published: '2026-11-23T10:00:00.000Z', filters: ['google', 'models'] },
    { id: '2', title: 'Other model', published: '2026-11-23T09:00:00.000Z', filters: ['models'] }
  ];
  const both = assignSections(items, ['models', 'google'], order);
  assert.deepEqual(both.map((s) => [s.filter, s.items.length]), [['google', 1], ['models', 1]]);
  assert.deepEqual(assignSections(items, ['models'], order).map((s) => [s.filter, s.items.length]), [['models', 2]]);
  assert.deepEqual(assignSections(items, ['anthropic'], order), []);
});

test('compose: more filters add more sections', () => {
  const order = ['a', 'b', 'c'];
  const items = [{ id: '1', title: 't1', published: '2026-11-23T10:00:00.000Z', filters: ['a'] }, { id: '2', title: 't2', published: '2026-11-23T11:00:00.000Z', filters: ['b'] }, { id: '3', title: 't3', published: '2026-11-23T12:00:00.000Z', filters: ['c'] }];
  assert.equal(assignSections(items, ['a'], order).length, 1);
  assert.equal(assignSections(items, ['a', 'b'], order).length, 2);
  assert.equal(assignSections(items, ['a', 'b', 'c'], order).length, 3);
});

test('compose: postTitle uses the newest item and counts the rest', () => {
  const s = [{ filter: 'a', items: [{ title: 'Old one', published: '2026-11-23T08:00:00.000Z' }] }, { filter: 'b', items: [{ title: 'Introducing Claude Fable 5.2.', published: '2026-11-23T12:00:00.000Z' }, { title: 'Third', published: '2026-11-23T09:00:00.000Z' }] }];
  assert.equal(postTitle(s), 'Introducing Claude Fable 5.2 and 2 more updates');
  assert.equal(postTitle([{ filter: 'a', items: [{ title: 'Solo', published: '2026-11-23T08:00:00.000Z' }] }]), 'Solo');
  assert.equal(postTitle([]), 'Nothing new for these filters');
  assert.ok(shorten('word '.repeat(30), 60).endsWith('…'));
});

test('compose: daysFor hides days with no matching items', () => {
  const days = [{ date: 'd1', items: [{ filters: ['a'] }] }, { date: 'd2', items: [{ filters: ['b'] }] }];
  assert.deepEqual(daysFor(days, ['b']).map((d) => d.date), ['d2']);
});

test('fixtures run: stale and not-ready sources are reported, sample has real sections', async () => {
  const { result } = await run({ fixtures: true, out: path.join(ROOT, 'feed', 'data', 'sample.json'), now: NOW });
  assert.equal(result.sample, true);
  const ids = result.days.flatMap((d) => d.items);
  assert.ok(ids.length > 10);
  assert.ok(ids.every((i) => i.filters.length && i.title && i.link.startsWith('http')));
  assert.ok(!ids.some((i) => /almanac|Conference/i.test(i.link + i.title)), 'excluded items are gone');
  assert.ok(ids.some((i) => i.filters.includes('books')), 'the e-book item is tagged as a book');
  assert.equal(ids.filter((i) => i.source === 'anthropic-news').length, 2, 'both Anthropic posts are kept');
  assert.equal(ids.filter((i) => i.source === 'apple-design-whats-new').length, 4, 'all four Apple design items are kept');
  const byId = Object.fromEntries(result.sources.map((s) => [s.id, s]));
  assert.equal(byId['qwen-hf'].kept, 0, 'Qwen releases from April are outside the 30 day window');
  assert.ok(byId['openai-news'].skipped, 'sources without a fixture are skipped, not failed');
  const f = Object.fromEntries(result.filters.filter((x) => !x.group).map((x) => [x.id, x]));
  assert.equal(f.anthropic.ready, true);
  assert.equal(f.microsoft.ready, true);
  assert.equal(f.deepseek.ready, true);
  assert.equal(f.meta.ready, false);
  assert.equal(f.xai.ready, false);
  assert.equal(f.mine.ready, false);
  assert.ok(filterOrder(result.filters).includes('mine'));
});

test('design rules: Material phrases and Apple design terms are tagged, chip names are not', () => {
  const t = (title, summary = '') => tagItem({ title, summary }, { filters: [] }, cfg.rules, known);
  assert.ok(t('Building with Material 3 Expressive').includes('google-design'));
  assert.ok(!t('Apple M3 MacBook Pro review').includes('google-design'));
  assert.ok(!t('Jetpack Compose November release').includes('google-design'), 'Compose alone is not design news');
  assert.ok(t('What is new in Liquid Glass').includes('apple-design'));
  assert.ok(t('Updates to the Human Interface Guidelines').includes('apple-design'));
});

test('run: when every network source fails it throws and leaves the previous file alone', async () => {
  const { mkdtemp, writeFile: wf, readFile: rf } = await import('node:fs/promises');
  const { tmpdir } = await import('node:os');
  const dir = await mkdtemp(path.join(tmpdir(), 'feedtest-'));
  const out = path.join(dir, 'latest.json');
  await wf(out, '{"keep":"me","days":[]}');
  const realFetch = globalThis.fetch;
  globalThis.fetch = async () => { throw new Error('offline'); };
  try {
    await assert.rejects(run({ fixtures: false, out, now: NOW }), /every network source failed/);
  } finally { globalThis.fetch = realFetch; }
  assert.equal(await rf(out, 'utf8'), '{"keep":"me","days":[]}');
});

test('run: a partial failure still writes, and names the failed sources', async () => {
  const { mkdtemp, readFile: rf } = await import('node:fs/promises');
  const { tmpdir } = await import('node:os');
  const dir = await mkdtemp(path.join(tmpdir(), 'feedtest-'));
  const out = path.join(dir, 'latest.json');
  const realFetch = globalThis.fetch;
  globalThis.fetch = async (url) => {
    if (String(url).includes('alistapart')) return new Response('<rss><channel><item><title>Fresh post</title><link>https://alistapart.com/article/fresh/</link><pubDate>Mon, 23 Nov 2026 10:00:00 +0000</pubDate><description>Hello.</description></item></channel></rss>', { status: 200 });
    throw new Error('offline');
  };
  try {
    const { result } = await run({ fixtures: false, out, now: NOW });
    const failed = result.sources.filter((s) => s.ok === false);
    assert.ok(failed.length > 5 && failed.every((s) => s.name && s.type));
    assert.ok(result.days.flatMap((d) => d.items).some((i) => i.title === 'Fresh post'));
    assert.equal(JSON.parse(await rf(out, 'utf8')).sample, false);
  } finally { globalThis.fetch = realFetch; }
});

test('compose: a new-model release is the headline even when a newer non-model item exists', () => {
  const sections = [
    { filter: 'anthropic', items: [{ title: 'Introducing Claude Fable 5.2', published: '2026-11-24T00:00:00.000Z', filters: ['anthropic', 'models'] }] },
    { filter: 'trends', items: [{ title: 'Designed for a Dead Language', published: '2026-11-24T02:01:00.000Z', filters: ['trends'] }] }
  ];
  assert.equal(postTitle(sections), 'Introducing Claude Fable 5.2 and 1 more update');
  assert.equal(postTitle([sections[1]]), 'Designed for a Dead Language');
});
