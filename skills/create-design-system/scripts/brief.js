#!/usr/bin/env node
// Prints a short documentation card for each component id, so you do not have to open the full entries.
// Usage: node brief.js <id> [<id> ...]   (up to 8 per run)
const fs = require('fs'), path = require('path');
const L = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'library-lite.json'), 'utf8')).components;
const ids = process.argv.slice(2).slice(0, 8);
if (!ids.length) { console.error('Usage: node brief.js <id> [<id> ...]'); process.exit(2) }
for (const id of ids) {
  const c = L.find(x => x.id === id);
  if (!c) { console.log(`# ${id}\nNo such component. Run: node pick.js components\n`); continue }
  console.log(`# ${c.name} (${c.id})
For: ${c.summary}
Use when: ${(c.whenToUse || []).join(' | ')}
Do not use when: ${(c.whenNotToUse || []).join(' | ')}${c.alternatives && c.alternatives.length ? ' (alternatives: ' + c.alternatives.join(', ') + ')' : ''}
Variants: ${(c.variants || []).join(', ')}
States: default${(c.states || []).length ? ', ' + c.states.join(', ') : ''}
Tokens: ${(c.tokens || []).join(', ')}
Accessibility: ${c.role || 'see entry'}
Platforms: ${(c.platforms || []).join(', ')}
`);
}
