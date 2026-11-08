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
  return { fg, bg, ratio: +r.toFixed(2), normalText: r >= 4.5, largeTextAndUI: r >= 3 };
});

// ---------- markdown per entry ----------
const list = a => (a || []).map(x => '- ' + x).join('\n');
function md(e) {
  if (e.type === 'component') return `# ${e.name}
Category: ${e.category} | Level: ${e.level || '-'} | Platforms: ${(e.platforms || []).join(', ')} | Industries: ${(e.industries || ['all']).join(', ')} | Tags: ${(e.tags || []).join(', ')}

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
  if (e.type === 'color') return `# ${e.name} (color set)\n\n${e.summary}\n\nIndustries: ${(e.industries||[]).join(', ')} | Mood: ${e.mood||'-'} | Tags: ${(e.tags||[]).join(', ')}\n\n## Roles\n${Object.entries(e.roles).map(([k, v]) => `- ${k}: ${v}`).join('\n')}\n\n## Contrast checks (WCAG 2.2)\n${e.contrast.map(c => `- ${c.fg} on ${c.bg}: ${c.ratio}:1 | normal text ${c.normalText ? 'PASS' : 'FAIL'} | large text/UI ${c.largeTextAndUI ? 'PASS' : 'FAIL'}`).join('\n')}\n\n## Guidance\n${list(e.guidance)}\n`;
  if (e.type === 'font-pairing') return `# ${e.name} (font pairing)\n\n${e.summary}\n\nIndustries: ${(e.industries||[]).join(', ')} | Tags: ${(e.tags||[]).join(', ')}\n\n## Roles\n${e.roles.map(r => `- ${r.role}: ${r.family} (${r.weights.join(', ')}), ${r.use}`).join('\n')}\n\n## Type scale\n${e.scale.map(s => `- ${s.token}: ${s.size} / ${s.lineHeight}`).join('\n')}\n\n## Why it works\n${e.whyItWorks}\n\n## Avoid\n${list(e.avoid)}\n\n## CSS\n\`\`\`css\n${e.css}\n\`\`\`\n`;
}
fs.rmSync(out, { recursive: true, force: true });
const folder = { component: 'components', color: 'colors', 'font-pairing': 'typography' };
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
- \`references/typography/\` for font pairings and type scales
- Desktop and mobile patterns are noted in each component's \`platforms\` field

## Rules
- IMPORTANT: Never hardcode colors or sizes when a token exists in the entry.
- IMPORTANT: Every interactive element needs a visible focus state and a keyboard path.
- Prefer the smallest component that fits the content; check content limits before choosing.
`);
w(path.join(out, 'data/library.json'), JSON.stringify(entries.map(({ md: _m, ...e }) => e), null, 2));

// ---------- site ----------
const tpl = fs.readFileSync(path.join(root, 'site-src/template.html'), 'utf8');
fs.copyFileSync(path.join(root, 'site-src/mambo.png'), (fs.mkdirSync(path.join(out, 'site'), { recursive: true }), path.join(out, 'site/mambo.png')));
w(path.join(out, 'site/index.html'), tpl.replace('/*__DATA__*/[]', JSON.stringify(entries).replace(/</g, '\\u003c')));
console.log(`Built ${entries.length} entries -> dist/ (site, llms.txt, skill, markdown, json)`);
