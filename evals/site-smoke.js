#!/usr/bin/env node
// Browser smoke test for the Browse page's batched rows. Needs Playwright with Chromium; skips if it is missing.
//   node scripts/build.js && node evals/site-smoke.js [cpuThrottle=4]
let chromium; try { ({ chromium } = require('playwright')) } catch { console.log('skip: playwright not installed'); process.exit(0) }
const path = require('path'), file = 'file://' + path.join(__dirname, '..', 'dist/site/index.html'), rate = +(process.argv[2] || 4);
let fails = 0; const t = (n, ok, x) => { if (!ok) fails++; console.log((ok ? 'ok   ' : 'FAIL ') + n + (ok || x === undefined ? '' : '  -> ' + x)) };
(async () => {
  const b = await chromium.launch(), p = await b.newPage({ viewport: { width: 1280, height: 800 } }), errs = [];
  p.on('pageerror', e => errs.push(e.message));
  const c = await p.context().newCDPSession(p); await c.send('Emulation.setCPUThrottlingRate', { rate });
  await p.route(/fonts\.(googleapis|gstatic)\.com/, r => r.abort());
  const rows = () => p.$$eval('table.db tbody tr', r => r.length), head = () => p.$eval('.dbhead .empty', e => e.textContent);
  await p.goto(file); await p.waitForSelector('table.db tbody tr');
  const total = +(await head()).match(/^(\d+) of/)[1];
  t('first draw is one batch (60 rows)', await rows() === 60, await rows());
  t('note says how many are shown', /Showing 60 of \d+/.test(await p.textContent('#morenote')));
  await p.evaluate(() => document.querySelectorAll('table.db tbody tr')[30].scrollIntoView()); await p.waitForFunction(() => document.querySelectorAll('table.db tbody tr').length > 60, null, { timeout: 5000 }).catch(() => { });
  const r2 = await rows(); t('scrolling past the middle loads more', r2 > 60 && r2 < total, r2);
  await p.click('#morebtn'); t('Show more button adds a batch', await rows() > r2);
  await p.fill('#q', 'button'); await p.waitForTimeout(500);
  const n = +(await head()).match(/^(\d+) of/)[1]; t('search narrows the list', n > 0 && n < total && await rows() === Math.min(60, n), `${n} ${await rows()}`);
  await p.fill('#q', ''); await p.waitForTimeout(400);
  await p.click('input[data-type][value="icon"]'); await p.waitForSelector('#selall');
  await p.click('#selall'); t('select all selects every icon, not only drawn rows', /^3631 selected/.test(await p.textContent('#expn')), await p.textContent('#expn'));
  await p.evaluate(() => window.scrollTo(0, 1e6)); await p.waitForTimeout(1500);
  const stable = async () => { let a = await rows(), b2; do { await p.waitForTimeout(500); b2 = a; a = await rows() } while (a !== b2); return a };
  const all = await stable(), checked = await p.$$eval('input[data-sel]', i => i.filter(x => x.checked).length); t('rows drawn later are ticked', checked === all && all > 60, `${checked}/${all}`);
  await p.click('#clear'); await p.waitForSelector('table.db tbody tr');
  const id = await p.evaluate(() => DATA.slice().sort((a, b) => b.name.localeCompare(a.name))[0].id);
  await p.goto(file + '#/entry/' + id); await p.reload(); await p.waitForSelector('table.db tbody tr');
  t('a linked entry far down the list is drawn', await p.$(`tr[data-eid="${id}"]`) !== null);
  await p.click('th[aria-sort] button[data-sort="name"]'); await p.waitForTimeout(300); t('sorting resets to one batch', await rows() <= 120, await rows());
  t('no page errors', !errs.length, errs.join(' | '));
  await b.close(); console.log(fails ? `\n${fails} failed` : '\nall passed'); process.exit(fails ? 1 : 0);
})();
