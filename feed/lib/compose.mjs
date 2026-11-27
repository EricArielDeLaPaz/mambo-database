// Pure helpers shared by the feed page and the tests.

export function filterOrder(filters) {
  return filters.filter((f) => !f.group).map((f) => f.id);
}

// Keep only the items that match at least one selected filter.
export function daysFor(days, selected) {
  const sel = new Set(selected);
  return days
    .map((d) => ({ date: d.date, items: d.items.filter((i) => i.filters.some((f) => sel.has(f))) }))
    .filter((d) => d.items.length);
}

// One section per selected filter. Each item appears once, under the first selected filter (in registry order) it carries.
export function assignSections(items, selected, order) {
  const sel = new Set(selected);
  const sections = new Map(order.filter((f) => sel.has(f)).map((f) => [f, []]));
  for (const it of items) {
    const first = order.find((f) => sel.has(f) && it.filters.includes(f));
    if (first) sections.get(first).push(it);
  }
  return [...sections].filter(([, list]) => list.length).map(([filter, list]) => ({ filter, items: list }));
}

export function shorten(text, max = 60) {
  if (text.length <= max) return text;
  return text.slice(0, max).replace(/[\s,;:–—-]+\S*$/, '') + '…';
}

// Post title: the "top change" is the newest new-model release in the post, else the newest item.
// The rest of the post is counted, so the title reads as a generalization of the day.
export function postTitle(sections) {
  const all = sections.flatMap((s) => s.items);
  if (!all.length) return 'Nothing new for these filters';
  const models = all.filter((i) => i.filters && i.filters.includes('models'));
  const pool = models.length ? models : all;
  const top = [...pool].sort((a, b) => b.published.localeCompare(a.published))[0];
  const rest = all.length - 1;
  return shorten((top.headline || top.title).replace(/\.$/, ''), 72) + (rest ? ` and ${rest} more update${rest > 1 ? 's' : ''}` : '');
}

export function filterLabel(f) {
  return f.product ? `${f.label} (${f.product})` : f.label;
}

// Add whole days to a YYYY-MM-DD date (UTC).
export function addDays(date, n) {
  const d = new Date(date + 'T00:00:00Z');
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}

// One entry per calendar day, newest first, ending at endDate. A day with nothing for the selected filters has count 0.
export function calendar(days, selected, order, endDate, count) {
  const byDate = new Map(days.map((d) => [d.date, d]));
  const out = [];
  for (let i = 0; i < count; i++) {
    const date = addDays(endDate, -i);
    const day = byDate.get(date);
    const sections = day ? assignSections(day.items, selected, order) : [];
    const n = sections.reduce((a, s) => a + s.items.length, 0);
    out.push({ date, sections, count: n, title: n ? postTitle(sections) : '' });
  }
  return out;
}
