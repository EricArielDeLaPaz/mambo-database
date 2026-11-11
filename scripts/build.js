#!/usr/bin/env node
// Builds every output from entries/**/*.json. No dependencies.
const fs = require('fs'), path = require('path');
const root = path.join(__dirname, '..');
const out = path.join(root, 'dist');
const read = p => JSON.parse(fs.readFileSync(p, 'utf8'));
const walk = d => fs.readdirSync(d, { withFileTypes: true }).flatMap(e => e.isDirectory() ? walk(path.join(d, e.name)) : e.name.endsWith('.json') ? [path.join(d, e.name)] : []);
const w = (p, s) => { fs.mkdirSync(path.dirname(p), { recursive: true }); fs.writeFileSync(p, s); };

// ---------- load + validate ----------
const entries = walk(path.join(root, 'entries')).map(read);
const ids = new Set(); const errors = [];
for (const e of entries) {
  const key = e.type + '/' + e.id;
  if (ids.has(key)) errors.push('duplicate ' + key); ids.add(key);
  if (e.type === 'component') {
    const schema = read(path.join(root, 'schema/component.schema.json'));
    for (const f of schema.required) if (e[f] === undefined) errors.push(`${key}: missing "${f}"`);
    if (e.summary && e.summary.length > 240) errors.push(`${key}: summary over 240 chars`);
  }
}
for (const e of entries) if (e.type === 'component') for (const r of [...(e.related || []), ...(e.alternatives || [])])
  if (!ids.has('component/' + r)) console.warn(`note: ${e.id} references "${r}", which has no entry yet`);
if (errors.length) { console.error(errors.join('\n')); process.exit(1); }

// ---------- contrast ----------
const lum = hex => { const c = [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16) / 255).map(v => v <= .03928 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4); return .2126 * c[0] + .7152 * c[1] + .0722 * c[2]; };
const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + .05) / (y + .05); };
for (const e of entries) if (e.type === 'color') e.contrast = e.pairs.map(([fg, bg]) => {
  const r = ratio(e.roles[fg], e.roles[bg]);
  return { fg, bg, ratio: Math.floor(r * 100 + 1e-9) / 100, normalText: r >= 4.5, largeTextAndUI: r >= 3 };
});

// ---------- markdown per entry ----------
const list = a => (a || []).map(x => '- ' + x).join('\n');
function md(e) {
  if (e.type === 'component') return `# ${e.name}
Category: ${e.category} | Level: ${e.level || '-'} | Platforms: ${(e.platforms || []).join(', ')} | Industries: ${(e.industries || ['all']).join(', ')}

${e.summary}

## Anatomy
${e.anatomy.map(a => `- **${a.part}** (${a.required ? 'required' : 'optional'}): ${a.purpose}`).join('\n')}

## Variants and content limits
${e.variants.map(v => `### ${v.name} (\`${v.id}\`)\n${v.use}\n${Object.entries(v.contentLimits).map(([k, x]) => `- ${k}: ${x}`).join('\n')}${v.width ? `\n- width: ${v.width}` : ''}${v.height ? `\n- height: ${v.height}` : ''}`).join('\n\n')}

## When to use
${list(e.whenToUse)}

## When not to use
${list(e.whenNotToUse)}

Alternatives: ${(e.alternatives || []).join(', ') || 'none'}

## Tokens
${(e.tokens || []).map(t => '`' + t + '`').join(', ')}

## Accessibility
- Role: ${e.accessibility.role}
${e.accessibility.keyboard.map(k => '- Keyboard: ' + k).join('\n')}
- Focus: ${e.accessibility.focus}
${list(e.accessibility.notes)}

## Code
\`\`\`html
${e.code.html}
\`\`\`
\`\`\`css
${e.code.css}
\`\`\`
${e.code.js ? '```js\n' + e.code.js + '\n```' : ''}
Related: ${(e.related || []).join(', ')}
`;
  if (e.type === 'color') return `# ${e.name} (color set)\n\n${e.summary}\n\nIndustries: ${(e.industries||[]).join(', ')} | Mood: ${e.mood||'-'}\n\n## Roles\n${Object.entries(e.roles).map(([k, v]) => `- ${k}: ${v}`).join('\n')}\n\n## Contrast checks (WCAG 2.2)\n${e.contrast.map(c => `- ${c.fg} on ${c.bg}: ${c.ratio}:1 | normal text ${c.normalText ? 'PASS' : 'FAIL'} | large text/UI ${c.largeTextAndUI ? 'PASS' : 'FAIL'}`).join('\n')}\n\n## Guidance\n${list(e.guidance)}\n`;
  if (e.type === 'typeface') return `# ${e.name} (typeface)\n\n${e.summary}\n\nCategory: ${e.category} | Roles: ${e.roles.join(', ')} | Weights: ${e.weights.join(', ')} | Industries: ${(e.industries||[]).join(', ')}\n\n## Details\n- Designer: ${e.designer}\n- Font version: ${e.fontVersion || 'n/a'}; Google Fonts file version ${e.apiVersion} (updated ${e.lastModified})\n- Scripts: ${e.scripts.join(', ')}\n- Languages supported: ${e.languageCount} (examples: ${e.languages.slice(0, 15).join(', ')})\n- Web font (.woff2, ${e.woff2Subset} subset, weight ${e.woff2Weight}): ${e.woff2}\n- License: SIL Open Font License 1.1 (https://openfontlicense.org/)\n- Copyright: ${e.copyright}\n- Source: ${e.source}\n\n## Pairings\nVerified: both fonts are on Google Fonts and the suggested weights exist.\n${e.pairings.map(p => `- **${p.family}** works as the ${p.role === 'body' ? 'body' : 'header / display'} font for ${e.name} (display weights ${p.displayWeights.join(', ')}; body weights ${p.bodyWeights.join(', ')}). ${p.why}`).join('\n')}\n\n## CSS\n\`\`\`css\n${e.css}\n\`\`\`\n`;
}
fs.rmSync(out, { recursive: true, force: true });
const folder = { component: 'components', color: 'colors', typeface: 'typography' };
const skillRef = path.join(out, 'skill/mambo-database/references');
for (const e of entries) { const rel = `${folder[e.type]}/${e.id}.md`; e.md = md(e); w(path.join(out, 'entries', rel), e.md); w(path.join(skillRef, rel), e.md); }

// ---------- index, llms.txt, skill ----------
const idx = entries.map(e => `- [${e.name}](${folder[e.type]}/${e.id}.md) (${e.type}${e.category ? ', ' + e.category : ''}): ${e.summary}`).join('\n');
w(path.join(out, 'entries/index.md'), `# Mambo database index\n\n${idx}\n`);
w(path.join(skillRef, 'index.md'), `# Mambo database index\n\n${idx}\n`);
w(path.join(out, 'llms.txt'), `# Mambo Database\n\n> An open, structured library of UI components, color sets and font pairings with anatomy, content limits, accessibility notes and code. Written for designers and AI assistants.\n\n## Entries\n\n${entries.map(e => `- [${e.name}](entries/${folder[e.type]}/${e.id}.md): ${e.summary}`).join('\n')}\n\n## Data\n\n- [Full data as JSON](data/library.json)\n`);
w(path.join(out, 'skill/mambo-database/SKILL.md'), `---
name: mambo-database
description: Use for any UI or visual design task (components, overlays, buttons, cards, pages, color palettes, accessible contrast, font pairings, mobile or desktop layouts). Look up the matching entry for anatomy, content limits, accessibility rules and code before designing or coding.
---

# Mambo database

Consult this library before inventing a component, color set or font pairing.

## How to use
1. Read \`references/index.md\` to find the entries that match the task.
2. Open only the one to three entry files you need. Do not read the whole folder.
3. Follow the entry's anatomy, content limits and accessibility rules. Use its tokens by name instead of raw hex values.
4. If an entry says "when not to use", switch to the listed alternative.
5. Check contrast with the color entry's computed ratios, and prefer colors whose industries include the project's industry; body text needs 4.5:1, large text and UI borders 3:1.

## Branches
- \`references/components/\` for overlays, buttons, cards and other parts, each with variants and code
- \`references/colors/\` for color sets with contrast results and the industries they suit
- \`references/typography/\` for single typefaces, each with its verified header/display and body pairings
- Desktop and mobile patterns are noted in each component's \`platforms\` field

## Rules
- IMPORTANT: Never hardcode colors or sizes when a token exists in the entry.
- IMPORTANT: Every interactive element needs a visible focus state and a keyboard path.
- Prefer the smallest component that fits the content; check content limits before choosing.
`);
w(path.join(out, 'data/library.json'), JSON.stringify(entries.map(({ md: _m, ...e }) => e), null, 2));

// ---------- third-party notices (font credits) ----------
const tf = entries.filter(e => e.type === 'typeface').sort((a, b) => a.name.localeCompare(b.name));
const notices = `# Third-party notices\n\nMambo Database lists and links to open source typefaces. Every typeface below is licensed under the SIL Open Font License, Version 1.1 (see licenses/OFL-1.1.txt and https://openfontlicense.org/). The font files are not stored in this repository; previews load from Google Fonts (https://fonts.google.com).\n\nCopyright notices are taken from each font's OFL.txt in https://github.com/google/fonts. Designers are from the Google Fonts METADATA.\n\n${tf.map(f => `## ${f.name}\n- Copyright: ${f.copyright}\n- Designer: ${f.designer}\n- Version: ${f.fontVersion || 'n/a'} (Google Fonts file version ${f.apiVersion})\n- License: SIL OFL 1.1${f.reserved ? ' (has a Reserved Font Name)' : ''}\n- Source: ${f.source}\n`).join('\n')}`;
w(path.join(root, 'THIRD_PARTY_NOTICES.md'), notices); w(path.join(out, 'THIRD_PARTY_NOTICES.md'), notices);
fs.mkdirSync(path.join(out, 'site/licenses'), { recursive: true }); fs.copyFileSync(path.join(root, 'licenses/OFL-1.1.txt'), path.join(out, 'site/licenses/OFL-1.1.txt'));

// ---------- create-design-system skill ----------
const dsSkill = path.join(root, 'skills/create-design-system'), dsOut = path.join(out, 'skill/create-design-system');
const copyDir = (a, d) => fs.readdirSync(a, { withFileTypes: true }).forEach(f => f.isDirectory() ? copyDir(path.join(a, f.name), path.join(d, f.name)) : (fs.mkdirSync(d, { recursive: true }), fs.copyFileSync(path.join(a, f.name), path.join(d, f.name))));
copyDir(dsSkill, dsOut);
w(path.join(dsOut, 'library-lite.json'), JSON.stringify({
  colors: entries.filter(e => e.type === 'color').map(e => ({ id: e.id, name: e.name, mood: e.mood, industries: e.industries, roles: e.roles })),
  typography: entries.filter(e => e.type === 'typeface').map(e => ({ id: e.id, name: e.name, category: e.category, roles: e.roles, industries: e.industries, pairsWith: e.pairings.map(p => ({ family: p.family, as: p.role === 'body' ? 'body' : 'display', displayWeights: p.displayWeights, bodyWeights: p.bodyWeights })) })),
  components: entries.filter(e => e.type === 'component').map(e => ({ id: e.id, name: e.name, category: e.category, platforms: e.platforms, states: (e.states || []).map(s => s.id) }))
}, null, 1));

// ---------- guides (markdown with front matter; kept out of the Browse database) ----------
const guidesDir = path.join(root, 'guides');
const guides = fs.existsSync(guidesDir) ? fs.readdirSync(guidesDir).filter(f => f.endsWith('.md')).map(f => {
  const raw = fs.readFileSync(path.join(guidesDir, f), 'utf8').replace(/\r\n/g, '\n'), m = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!m) throw new Error(`guides/${f}: missing front matter`);
  const g = { body: m[2].trim() }; m[1].split('\n').forEach(l => { const i = l.indexOf(':'); if (i > 0) g[l.slice(0, i).trim()] = l.slice(i + 1).trim() });
  for (const k of ['id', 'title', 'summary', 'topic', 'level', 'order']) if (!g[k]) throw new Error(`guides/${f}: missing "${k}"`);
  g.order = +g.order; g.minutes = Math.max(1, Math.round(g.body.split(/\s+/).length / 200)); return g;
}).sort((a, b) => a.order - b.order) : [];
for (const g of guides) w(path.join(out, 'entries/guides', g.id + '.md'), `# ${g.title}\n\n${g.summary}\n\nTopic: ${g.topic} | Level: ${g.level}\n\n${g.body}\n`);
if (guides.length) w(path.join(out, 'entries/guides/index.md'), `# Mambo guides\n\n${guides.map(g => `- [${g.title}](${g.id}.md) (${g.topic}, ${g.level}): ${g.summary}`).join('\n')}\n`);

if (guides.length) fs.appendFileSync(path.join(out, 'llms.txt'), `\n## Guides\n\n${guides.map(g => `- [${g.title}](entries/guides/${g.id}.md): ${g.summary}`).join('\n')}\n`);

// ---------- site ----------

// ---------- icons (free, commercially usable libraries; kept out of the per-entry markdown) ----------
const iconSets = read(path.join(root, 'icons/sets.json')), iconConcepts = read(path.join(root, 'icons/concepts.json'));
const iconEntries = [];
for (const set of iconSets) {
  const dir = path.join(root, 'icons', set.id);
  for (const f of fs.readdirSync(dir).filter(x => x.endsWith('.svg')).sort()) {
    const concept = f.slice(0, -4), name = concept.split('-').map(x => x[0].toUpperCase() + x.slice(1)).join(' ');
    iconEntries.push({ id: `icon-${set.id}-${concept}`, type: 'icon', name, category: set.designSystem, set: set.name, setId: set.id, style: set.style, license: set.license, summary: `${name} icon from ${set.name} (${set.style}), ${set.license}.`, keywords: [concept, ...(iconConcepts[concept] || [])].join(' '), industries: ['all'], svg: fs.readFileSync(path.join(dir, f), 'utf8').trim() });
  }
  fs.mkdirSync(path.join(out, 'site/licenses/icons'), { recursive: true }); fs.copyFileSync(path.join(dir, 'LICENSE'), path.join(out, `site/licenses/icons/${set.id}-LICENSE.txt`));
}
w(path.join(out, 'data/icons.json'), JSON.stringify({ sets: iconSets, icons: iconEntries.map(({ type, summary, ...e }) => e) }));
w(path.join(out, 'entries/icons/index.md'), `# Icons\n\n${iconEntries.length} UI icons from ${iconSets.length} free, commercially usable libraries, grouped by design system. SVG source is in data/icons.json.\n\n${iconSets.map(x => `- **${x.designSystem}**: ${x.name}, ${x.style}, ${x.license}. ${x.copyright}. [Source](${x.source})`).join('\n')}\n`);
fs.appendFileSync(path.join(out, 'llms.txt'), `\n## Icons\n\n- [Icon libraries and licenses](entries/icons/index.md): ${iconEntries.length} UI icons, all free for commercial use.\n- [All icon SVGs as JSON](data/icons.json)\n`);
const tpl = fs.readFileSync(path.join(root, 'site-src/template.html'), 'utf8');
fs.copyFileSync(path.join(root, 'site-src/mambo.png'), (fs.mkdirSync(path.join(out, 'site'), { recursive: true }), path.join(out, 'site/mambo.png')));
const src = f => fs.readFileSync(path.join(root, 'site-src', f), 'utf8');
const fonts = JSON.parse(fs.readFileSync(path.join(root, 'data/google-fonts.json'), 'utf8'));
let js = ['core.js', 'store.js', 'browse.js', 'systems.js', 'guides.js', 'tools.js', 'app.js'].map(src).join('\n');
js = js.replace('/*__DATA__*/[]', () => JSON.stringify([...entries, ...iconEntries]).replace(/</g, '\\u003c')).replace('/*__ICONSETS__*/[]', () => JSON.stringify(iconSets)).replace('/*__FONTS__*/[]', () => JSON.stringify(fonts)).replace('/*__GUIDES__*/[]', () => JSON.stringify(guides).replace(/</g, '\\u003c'));
w(path.join(out, 'site/index.html'), tpl.replace('/*__CSS__*/', () => src('styles.css')).replace('/*__JS__*/', () => js.replace(/<\/script/gi, '<\\/script')));
console.log(`Built ${entries.length} entries + ${iconEntries.length} icons + ${guides.length} guides -> dist/ (site, llms.txt, skill, markdown, json)`);
