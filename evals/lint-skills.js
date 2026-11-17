#!/usr/bin/env node
// Lints every skills/*/SKILL.md against the rules in Anthropic's authoring page and one hazard found in the wild:
// agents drop a skill silently if its frontmatter YAML fails to parse (for example an unquoted "word: word" in a description).
//   node evals/lint-skills.js      exit 1 on any error
const fs = require('fs'), path = require('path');
const root = path.join(__dirname, '..', 'skills'); let errs = 0, warns = 0;
const bad = (w, m) => { errs++; console.log('ERROR ' + w + ': ' + m) }, warn = (w, m) => { warns++; console.log('warn  ' + w + ': ' + m) };
for (const dir of fs.readdirSync(root, { withFileTypes: true }).filter(d => d.isDirectory() && d.name !== '_shared')) {
  const file = path.join(root, dir.name, 'SKILL.md'), w = `skills/${dir.name}`; if (!fs.existsSync(file)) { bad(w, 'no SKILL.md'); continue }
  const src = fs.readFileSync(file, 'utf8'), m = src.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/); if (!m) { bad(w, 'no frontmatter block'); continue }
  const fm = {}; let key = null; for (const ln of m[1].split(/\r?\n/)) { const k = ln.match(/^([a-zA-Z-]+):\s*(.*)$/); if (k) { key = k[1]; fm[key] = k[2] } else if (key) fm[key] += ' ' + ln.trim() }
  const name = fm.name, desc = (fm.description || '').trim();
  if (!name || !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(name) || name.length > 64 || /anthropic|claude/.test(name)) bad(w, 'name must be kebab-case, 64 chars max, without "anthropic" or "claude"');
  else if (name !== dir.name) bad(w, `name "${name}" differs from the folder name`);
  if (!desc) bad(w, 'empty description'); else { if (desc.length > 1024) bad(w, `description is ${desc.length} chars (max 1024)`);
    if (!/^["'>|]/.test(desc) && /:\s/.test(desc)) bad(w, 'unquoted ": " inside the description can break YAML parsing; remove the colon or quote the text');
    if (/\b(I|you|your)\b/.test(desc.replace(/\/[\w-]+/g, ''))) warn(w, 'description should be third person (found I/you/your)');
    if (!/use when|use for|when /i.test(desc)) warn(w, 'description should say when to use the skill') }
  const lines = src.split('\n').length; if (lines > 500) bad(w, `SKILL.md is ${lines} lines (max 500)`);
  const refs = path.join(root, dir.name, 'references');
  if (fs.existsSync(refs)) for (const f of fs.readdirSync(refs, { withFileTypes: true })) { if (f.isDirectory()) bad(w, `references/${f.name} is nested; keep references one level deep`);
    else if (f.name.endsWith('.md')) { const t = fs.readFileSync(path.join(refs, f.name), 'utf8').split('\n'); if (t.length > 100 && !/contents|^- \[/im.test(t.slice(0, 15).join('\n'))) warn(w, `references/${f.name} has ${t.length} lines and no table of contents`) }
    if (!src.includes(f.name.replace(/\.md$/, '')) && f.name !== 'shared-protocol.md') warn(w, `references/${f.name} is never mentioned in SKILL.md`) }
  console.log(`ok    ${w}: ${lines} lines`);
}
console.log(`\n${errs} errors, ${warns} warnings`); process.exit(errs ? 1 : 0);
