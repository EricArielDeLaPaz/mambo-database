/* ===== store: design systems saved in this browser ===== */
const ROLE_GROUPS = { 'Brand': ['Primary', 'Secondary', 'Tertiary', 'Accent'], 'Neutral': ['Background', 'Surface', 'Surface variant', 'Neutral', 'Border', 'Text', 'Text secondary', 'Inverse text', 'Disabled', 'Overlay'], 'Feedback': ['Success', 'Warning', 'Danger', 'Info'], 'Other': ['Link', 'Highlight', 'Other'] };
const ROLES = Object.values(ROLE_GROUPS).flat();
const BRAND = ROLE_GROUPS.Brand, NEUTRAL = ROLE_GROUPS.Neutral, FEEDBACK = ROLE_GROUPS.Feedback, BGROLES = ['Background', 'Surface', 'Surface variant', 'Overlay'];
const STATE_LIST = [['default', 'Default'], ['hover', 'Hover (pointer devices)'], ['focus', 'Focus (keyboard)'], ['pressed', 'Pressed / active'], ['disabled', 'Disabled'], ['loading', 'Loading'], ['error', 'Error'], ['selected', 'Selected']];
const KEY = 'mambo-database.systems.v2', OLD = 'mambo-database.systems.v1';
const S = { last: null, folders: ['Unsorted'], systems: [], active: null, checked: new Set(), collapsed: new Set() };

function flat(o, p = []) { return Object.entries(o || {}).flatMap(([k, v]) => v && typeof v === 'object' && !('$value' in v) ? flat(v, [...p, k]) : [[[...p, k].join('-'), v && v.$value !== undefined ? v.$value : v]]) }
function newSystem(o = {}) {
  return { id: uid(), name: 'Untitled system', folder: 'Unsorted', platforms: ['desktop', 'mobile-web', 'mobile-app'], industry: 'all', colors: [{ id: uid(), name: 'Background', hex: '#ffffff', role: 'Background' }, { id: uid(), name: 'Text', hex: '#0a0a0a', role: 'Text' }], fonts: [], states: ['default', 'focus', 'disabled', 'error'], spacing: '4', radii: '4, 8, 12', components: [], ...o }
}
function loadStore() {
  try {
    const d = JSON.parse(localStorage.getItem(KEY));
    if (d && d.systems) {
      S.folders = d.folders && d.folders.length ? d.folders : ['Unsorted']; if (!S.folders.includes('Unsorted')) S.folders.unshift('Unsorted'); S.systems = d.systems; S.active = d.active || null; S.last = d.last || S.active;
      S.systems.forEach(sy => { sy.components = sy.components || []; sy.fonts.forEach(f => { if (!Array.isArray(f.weights)) f.weights = String(f.weights || '').split(',').map(x => parseInt(x, 10)).filter(Boolean) }) }); return
    }
  } catch { }
  try { (JSON.parse(localStorage.getItem(OLD)) || []).forEach(o => { const cols = flat(o.tokens).filter(([k, v]) => normHex(v)).map(([k, v]) => ({ id: uid(), name: k, hex: normHex(v), role: 'Other' })); S.systems.push(newSystem({ name: o.name, colors: cols })) }) } catch { }
}
let prevActive = null;
/* S.last = the system the person last picked or edited. It is the default for every Add to dropdown. */
function saveStore() { if (S.active && S.systems.some(x => x.id === S.active) && (S.active !== prevActive || (typeof route === 'function' && route().view === 'systems'))) S.last = S.active; prevActive = S.active; try { localStorage.setItem(KEY, JSON.stringify({ folders: S.folders, systems: S.systems, active: S.active, last: S.last })) } catch { toast('Storage unavailable in this browser.') } }
const lastSysId = () => [S.last, S.active].find(id => id && S.systems.some(x => x.id === id)) || (S.systems[0] && S.systems[0].id) || '__new';
const cur = () => S.systems.find(s => s.id === S.active);
const mobileOnly = s => s.platforms.length > 0 && s.platforms.every(p => p !== 'desktop');
const industryMatch = e => { const s = cur(); if (!s || s.industry === 'all') return true; const i = e.industries || ['all']; return i.includes('all') || i.includes(s.industry) };

/* the states a component should show for a given system */
function statesFor(e, s) {
  const all = (e.states || []).map(x => x.id);
  if (!s) return all;
  return (e.states || []).filter(x => s.states.includes(x.id) && !(x.when === 'pointer' && mobileOnly(s))).map(x => x.id);
}

/* ---------- export builders ---------- */
function tokens(s) {
  const t = { color: {}, typography: {}, spacing: { base: { $value: s.spacing + 'px', $type: 'dimension' } }, radius: {} };
  s.colors.forEach(c => { t.color[slug(c.name)] = { $value: c.hex, $type: 'color', $description: c.role + (c.source ? ' (from ' + c.source + ')' : '') } });
  s.fonts.forEach(f => { t.typography[slug(f.role + '-' + f.family)] = { fontFamily: { $value: f.family, $type: 'fontFamily' }, fontWeight: { $value: f.weights.slice(), $type: 'fontWeight' }, $description: f.role } });
  String(s.radii).split(',').map(x => x.trim()).filter(Boolean).forEach((r, i) => { t.radius['r' + (i + 1)] = { $value: /px|rem|%/.test(r) ? r : r + 'px', $type: 'dimension' } });
  return t;
}
function cssVars(s) {
  return ':root {\n' + s.colors.map(c => `  --color-${slug(c.name)}: ${c.hex};`).join('\n') + '\n' + s.fonts.map(f => `  --font-${slug(f.role)}: '${f.family}', system-ui, sans-serif;`).join('\n') + `\n  --space-base: ${s.spacing}px;\n` + String(s.radii).split(',').map(x => x.trim()).filter(Boolean).map((r, i) => `  --radius-${i + 1}: ${/px|rem|%/.test(r) ? r : r + 'px'};`).join('\n') + '\n}\n';
}
function systemReadme(s) {
  const fg = s.colors.filter(c => !BGROLES.includes(c.role)), bg = s.colors.filter(c => BGROLES.includes(c.role));
  const rows = []; fg.forEach(f => bg.forEach(b => { const r = ratio(f.hex, b.hex); rows.push(`| ${f.name} ${f.hex} | ${b.name} ${b.hex} | ${r.toFixed(2)}:1 | ${r >= 4.5 ? '✓' : '✕'} | ${r >= 7 ? '✓' : '✕'} | ${r >= 3 ? '✓' : '✕'} |`) }));
  return `# ${s.name}\n\nFor: ${s.platforms.map(p => PLAT[p]).join(', ') || 'not set'}\nIndustry: ${indLabel(s.industry)}\nSpacing base: ${s.spacing}px\nCorner radii: ${s.radii}\nStates: ${s.states.join(', ')}\n\n## Colors\n${s.colors.map(c => `- ${c.name} (${c.role}): ${c.hex}`).join('\n')}\n\n## Typography\n${s.fonts.map(f => `- ${f.role}: ${f.family} (${f.weights.join(', ')})`).join('\n') || '- none yet'}\n\n## Components\n${s.components.map(c => { const e = compById(c.id); return e ? `- ${e.name} (states: ${['default', ...c.states.filter(x => x !== 'default')].join(', ')})` : '' }).join('\n') || '- none yet'}\n\n## Contrast report\nForeground colors on background colors. AA needs 4.5:1 for text, AAA 7:1, UI parts 3:1.\n\n| Foreground | Background | Ratio | AA | AAA | UI 3:1 |\n|---|---|---|---|---|---|\n${rows.join('\n') || '| (add background and foreground colors) | | | | | |'}\n`;
}
function systemFiles(s) {
  const files = [{ name: slug(s.name) + '/tokens.json', data: JSON.stringify(tokens(s), null, 2) }, { name: slug(s.name) + '/variables.css', data: cssVars(s) }, { name: slug(s.name) + '/README.md', data: systemReadme(s) }];
  s.components.forEach(c => { const e = compById(c.id); if (e) files.push({ name: `${slug(s.name)}/components/${e.id}.html`, data: compDoc(e, c.states) }) });
  return files;
}
function exportZip(s) { return makeZip(systemFiles(s)) }
