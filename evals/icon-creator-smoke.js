#!/usr/bin/env node
// Browser test for the Icon creator tool (needs Playwright with Chromium; skips if missing).  node scripts/build.js && node evals/icon-creator-smoke.js
let chromium; try { ({ chromium } = require('playwright')) } catch { console.log('skip: playwright not installed'); process.exit(0) }
const path = require('path'), file = 'file://' + path.join(__dirname, '..', 'dist/site/index.html');
let fails = 0; const t = (n, ok, x) => { if (!ok) fails++; console.log((ok ? 'ok   ' : 'FAIL ') + n + (ok || x === undefined ? '' : '  -> ' + JSON.stringify(x))) };
(async () => {
  const b = await chromium.launch(), p = await b.newPage({ viewport: { width: 1280, height: 900 } }), errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.route(/fonts\.(googleapis|gstatic)\.com/, r => r.abort());
  await p.goto(file); await p.waitForSelector('table.db'); await p.evaluate(() => location.hash = '#/tools/iconcreator'); await p.waitForSelector('#ic-grid .ic-cell');
  const on = () => p.$$eval('.ic-cell.on', c => c.map(x => `${x.dataset.r},${x.dataset.c}`)), cell = (r, c) => p.$(`.ic-cell[data-r="${r}"][data-c="${c}"]`);
  const center = async (r, c) => { const bx = await (await cell(r, c)).boundingBox(); return [bx.x + bx.width / 2, bx.y + bx.height / 2] };
  const drag = async (a, b2) => { const [x1, y1] = await center(...a), [x2, y2] = await center(...b2); await p.mouse.move(x1, y1); await p.mouse.down(); await p.mouse.move(x2, y2, { steps: 8 }); await p.mouse.up() };
  t('toolbar has Draw, Eraser, Move, Symmetry, Show guide as buttons with text', (await p.$$eval('.ic-tools button', bs => bs.map(x => x.textContent.trim()))).join('|').includes('Draw|Eraser|Move|Symmetry'), await p.$$eval('.ic-tools button', bs => bs.map(x => x.textContent.trim())));
  t('no checkbox for the eraser or guide', await p.$('#ic-eraser') === null && await p.$('input#ic-guide') === null);
  t('guide button sits above the Grid size control', (await (await p.$('#ic-guide')).boundingBox()).y < (await (await p.$('#ic-size')).boundingBox()).y);
  await drag([3, 3], [3, 6]); t('dragging draws a row of 4 cells', (await on()).length === 4, await on());
  await p.click('[data-tool="erase"]'); await drag([3, 4], [3, 5]); t('eraser button clears dragged cells', (await on()).join() === '3,3,3,6', await on());
  await p.click('[data-tool="draw"]'); await p.click('#ic-undo'); t('undo restores', (await on()).length === 4);
  await p.click('#ic-clear');
  await p.click('#ic-sym'); await drag([2, 2], [4, 2]); const sym = await on(); t('symmetry mirrors left and right', sym.length === 6 && sym.includes('3,21'), sym);
  await p.click('[data-sym="both"]'); await p.click('#ic-clear'); await p.click('.ic-cell[data-r="1"][data-c="1"]'); t('both mode makes 4 cells', (await on()).length === 4, await on());
  await p.click('#ic-sym'); await p.click('#ic-clear');
  await drag([5, 5], [5, 7]); await p.click('[data-tool="move"]'); await drag([5, 6], [8, 9]); t('move tool drags the drawing by (3,3)', (await on()).join() === '8,8,8,9,8,10', await on());
  await drag([8, 9], [0, 0]); const box = await on(); t('move stops at the edge, nothing lost', box.length === 3 && box.every(k => +k.split(',')[1] >= 0), box);
  await (await cell(0, 0)).focus(); await p.keyboard.press('ArrowDown'); t('arrow key moves the drawing in Move mode', (await on()).every(k => +k.split(',')[0] === 1), await on());
  await p.click('[data-tool="draw"]'); await p.click('#ic-clear'); await drag([4, 4], [4, 7]);
  await p.click('#ic-resize-btn'); await p.fill('#ic-rw', '8'); await p.dispatchEvent('#ic-rw', 'input'); const r2 = await on(); t('resize preview doubles a 4x1 drawing to 8x2 (proportions kept)', r2.length === 16, r2);
  await p.click('#ic-rs-cancel'); t('cancel restores the drawing', (await on()).length === 4);
  await p.click('#ic-resize-btn'); await p.fill('#ic-rw', '8'); await p.dispatchEvent('#ic-rw', 'input'); await p.click('#ic-rs-ok'); t('apply keeps the stretched drawing', (await on()).length === 16);
  await p.click('#ic-undo'); t('undo after resize restores 4 cells', (await on()).length === 4);
  await p.evaluate(() => { const s = document.querySelector('#ic-size'); s.value = '48'; s.dispatchEvent(new Event('change')) }); await p.waitForTimeout(200);
  const big = await on(); t('switching 24 to 48 keeps and doubles the drawing (4 cells to 16)', big.length === 16 && await p.$$eval('.ic-cell', c => c.length) === 48 * 48, big.length);
  await p.click('#ic-undo'); t('undo goes back to the 24 grid with the drawing', await p.$$eval('.ic-cell', c => c.length) === 576 && (await on()).length === 4);
  await p.evaluate(() => { const s = document.querySelector('#ic-size'); s.value = '16'; s.dispatchEvent(new Event('change')) }); t('shrinking to 16 keeps something', (await on()).length > 0);
  await p.click('#ic-guide'); t('guide button toggles the guide off', await p.$eval('#ic-guide-lines', e => e.hidden) === true && await p.getAttribute('#ic-guide', 'aria-pressed') === 'false');
  t('no page errors', !errs.length, errs);
  await b.close(); console.log(fails ? `\n${fails} failed` : '\nall passed'); process.exit(fails ? 1 : 0);
})();
