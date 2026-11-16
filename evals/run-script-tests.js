#!/usr/bin/env node
// Deterministic checks for the scripts the skills rely on. Run after `node scripts/build.js`:  node evals/run-script-tests.js
// The *.json files in this folder are behavior evaluations for the model; these tests cover the scripts only.
const { spawnSync } = require('child_process'), fs = require('fs'), os = require('os'), path = require('path');
const root = path.join(__dirname, '..'), fx = path.join(__dirname, 'fixtures'), sk = n => path.join(root, 'skills', n, 'scripts');
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'mambo-evals-')); let fails = 0, n = 0;
const run = (script, args, cwd) => spawnSync('node', [script, ...args], { encoding: 'utf8', cwd });
const t = (name, ok, extra) => { n++; if (!ok) { fails++; console.log('FAIL ' + name + (extra ? '\n  ' + extra : '')) } else console.log('ok   ' + name) };
// contrast
let r = run(path.join(sk('create-design-system'), 'contrast.js'), ['#111111', '#ffffff']); t('contrast passes #111 on white', r.status === 0 && /18\.88/.test(r.stdout), r.stdout);
r = run(path.join(sk('create-design-system'), 'contrast.js'), ['#8a8a8a', '#ffffff']); t('contrast fails #8a8a8a on white (3.45)', r.status === 1 && /3\.45:1/.test(r.stdout), r.stdout);
// audit
const audit = path.join(sk('design-system-audit'), 'audit.js');
r = run(audit, ['code', path.join(fx, 'src'), '--tokens', path.join(fx, 'tokens.css')]);
t('audit finds contrast errors in tokens', r.status === 1 && /Text secondary on Background/.test(r.stdout) && /Border on Background/.test(r.stdout), r.stdout.slice(0, 400));
t('audit finds hardcoded colors, spacing, focus, outline', ['hardcoded-color', 'off-scale-spacing', 'no-focus-style', 'outline-removed'].every(k => r.stdout.includes(k)), r.stdout.slice(0, 400));
t('audit flags Tailwind and inline spacing in tsx', /Tailwind p-\[13px\]/.test(r.stdout) && /inline style/.test(r.stdout));
const work = path.join(tmp, 'src'); fs.cpSync(path.join(fx, 'src'), work, { recursive: true });
run(audit, ['code', work, '--tokens', path.join(fx, 'tokens.css'), '--plan', path.join(tmp, 'plan.json'), '--out', path.join(tmp, 'before.json')]);
const plan = JSON.parse(fs.readFileSync(path.join(tmp, 'plan.json'), 'utf8')); t('audit plan has fixes, none approved', plan.length >= 4 && plan.every(p => p.approve === false));
r = run(audit, ['apply', path.join(tmp, 'plan.json'), '--root', work]); t('apply with nothing approved changes nothing', /Nothing is approved/.test(r.stdout) && fs.readFileSync(path.join(work, 'a.css'), 'utf8') === fs.readFileSync(path.join(fx, 'src/a.css'), 'utf8'));
plan.forEach(p => p.approve = true); fs.writeFileSync(path.join(tmp, 'plan.json'), JSON.stringify(plan));
r = run(audit, ['apply', path.join(tmp, 'plan.json'), '--root', work]); t('apply applies approved fixes', /Applied \d+ of \d+/.test(r.stdout) && fs.readFileSync(path.join(work, 'a.css'), 'utf8').includes('var(--primary)') && fs.readFileSync(path.join(work, 'a.css'), 'utf8').includes('padding:12px 20px'), r.stdout);
// token sync
const sync = path.join(sk('token-sync'), 'sync.js'), css = path.join(tmp, 'code.css'); fs.copyFileSync(path.join(fx, 'code.css'), css);
r = run(sync, ['diff', path.join(fx, 'figma.json'), css, '--out', path.join(tmp, 'ch.json')]);
t('sync finds 1 mismatch, 1 missing in code, 1 missing in figma, 1 rename', r.status === 1 && /4 difference/.test(r.stdout) && /value-mismatch\] x1/.test(r.stdout) && /missing-in-code\] x1/.test(r.stdout) && /missing-in-figma\] x1/.test(r.stdout) && /possible-rename\] x1/.test(r.stdout), r.stdout);
const ch = JSON.parse(fs.readFileSync(path.join(tmp, 'ch.json'), 'utf8')); ch.forEach(c => { if (c.kind === 'value-mismatch' || c.kind === 'missing-in-code') c.approve = true }); fs.writeFileSync(path.join(tmp, 'ch.json'), JSON.stringify(ch));
r = run(sync, ['apply', path.join(tmp, 'ch.json'), '--code', css]); t('sync apply edits approved entries', /Applied 2 of 2/.test(r.stdout), r.stdout);
r = run(sync, ['diff', path.join(fx, 'figma.json'), css]); t('sync re-run leaves only the 2 unapproved differences', /2 difference/.test(r.stdout), r.stdout);
// icons
const icons = path.join(sk('icon-set-creator'), 'icons.js');
r = run(icons, ['check', path.join(fx, 'icons/ok.svg')]); t('icons: clean icon passes', r.status === 0, r.stdout);
r = run(icons, ['check', path.join(fx, 'icons/bad.svg')]); t('icons: bad icon fails with viewBox, image and color errors', r.status === 1 && /viewBox/.test(r.stdout) && /<image>/.test(r.stdout) && /fixed color/.test(r.stdout), r.stdout);
r = run(icons, ['check', path.join(fx, 'icons/over.svg')]); t('icons: out-of-area rect and square cap fail', r.status === 1 && /live area/.test(r.stdout) && /linecap/.test(r.stdout), r.stdout);
// pick.js needs the built data
const data = path.join(root, 'dist/skill/create-design-system/data/library-lite.json');
if (fs.existsSync(data)) { r = run(path.join(root, 'dist/skill/create-design-system/scripts/pick.js'), ['colors', '--industry', 'finance', '--n', '1']); t('pick.js returns a color set', r.status === 0 && /\| primary #/.test(r.stdout), r.stdout) } else console.log('skip pick.js (run node scripts/build.js first)');
console.log(`\n${n - fails}/${n} passed`); process.exit(fails ? 1 : 0);
