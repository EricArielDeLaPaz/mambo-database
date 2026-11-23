/* ===== Tools, part 2: colorblind checks, Color Extract, and the content and file tools ===== */
const CAMERA_ICON = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3z"/><circle cx="12" cy="13" r="3.5"/></svg>';

/* ---------- colorblindness ---------- */
const CVD = {
  protanopia: { label: 'Protanopia', about: 'no red cones', m: [[.152286, 1.052583, -.204868], [.114503, .786281, .099216], [-.003882, -.048116, 1.051998]] },
  deuteranopia: { label: 'Deuteranopia', about: 'no green cones', m: [[.367322, .860646, -.227968], [.280085, .672501, .047413], [-.01182, .04294, .968881]] },
  tritanopia: { label: 'Tritanopia', about: 'no blue cones', m: [[1.255528, -.076749, -.178779], [-.078411, .930809, .147602], [.004733, .691367, .3039]] },
  achromatopsia: { label: 'Achromatopsia', about: 'no color vision', m: null }
};
const toLin = v => { v /= 255; return v <= .04045 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4 };
const fromLin = v => { v = Math.max(0, Math.min(1, v)); return Math.round(255 * (v <= .0031308 ? v * 12.92 : 1.055 * v ** (1 / 2.4) - .055)) };
function simRgb(r, g, b, type) {
  const [R, G, B] = [toLin(r), toLin(g), toLin(b)], t = CVD[type];
  if (!t.m) { const y = fromLin(.2126 * R + .7152 * G + .0722 * B); return [y, y, y] }
  return t.m.map(row => fromLin(row[0] * R + row[1] * G + row[2] * B));
}
const simHex = (hex, type) => rgbHex(...simRgb(...rgbOf(normHex(hex) || '#000000'), type));
function labOf(hex) {
  const [R, G, B] = rgbOf(hex).map(toLin), X = (R * .4124 + G * .3576 + B * .1805) / .95047, Y = R * .2126 + G * .7152 + B * .0722, Z = (R * .0193 + G * .1192 + B * .9505) / 1.08883, f = t => t > .008856 ? Math.cbrt(t) : 7.787 * t + 16 / 116;
  return [116 * f(Y) - 16, 500 * (f(X) - f(Y)), 200 * (f(Y) - f(Z))];
}
const deltaE = (a, b) => { const p = labOf(a), q = labOf(b); return Math.hypot(p[0] - q[0], p[1] - q[1], p[2] - q[2]) };
/* Two colors are flagged when they look clearly different normally (distance 20 or more) but get close (under 11) for someone with a type of color blindness. */
const CVD_SEM = ['Success', 'Warning', 'Danger', 'Info'], CVD_GUIDE = '#/guide/color-blindness';
const CVD_KEEP = ['Background', 'Text', 'Primary', 'Text secondary', 'Link', 'Surface', 'Border'];
function cvdIssues(colors) {
  const out = [], list = colors.filter(c => normHex(c.hex));
  for (let i = 0; i < list.length; i++) for (let j = i + 1; j < list.length; j++) {
    const a = list[i], b = list[j], base = deltaE(a.hex, b.hex); if (base < 20) continue;
    const types = Object.keys(CVD).filter(t => deltaE(simHex(a.hex, t), simHex(b.hex, t)) < 11);
    if (types.length) out.push({ a, b, types, semantic: !!a.role && !!b.role && CVD_SEM.includes(a.role) && CVD_SEM.includes(b.role) });
  }
  return out;
}
/* Find the smallest lightness change to one color of a pair that makes the pair safe for every type, without creating new problems or breaking contrast on the background. */
function cvdFix(pair, colors, bg, avoid) {
  const before = cvdIssues(colors).length, rank = c => { const i = CVD_KEEP.indexOf(c.role); return i < 0 ? 99 : i };
  const sides = rank(pair.a) < rank(pair.b) ? ['b', 'a'] : ['a', 'b'];
  for (const side of sides) {
    if (avoid && avoid.has(pair[side].id)) continue;
    const c = pair[side], o = pair[side === 'a' ? 'b' : 'a'], q = hsl(c.hex), need = bg ? (ratio(c.hex, bg) >= 4.5 ? 4.5 : ratio(c.hex, bg) >= 3 ? 3 : 0) : 0;
    for (let d = .02; d <= .5; d += .02) for (const sg of [1, -1]) {
      const l = q.l + sg * d; if (l < .06 || l > .94) continue;
      const hex = hslHex(q.h, q.s, l); if (need && ratio(hex, bg) < need) continue;
      if (!Object.keys(CVD).every(t => deltaE(simHex(hex, t), simHex(o.hex, t)) >= 11)) continue;
      if (cvdIssues(colors.map(x => x === c ? { ...x, hex } : x)).length < before) return { side, color: c, other: o, hex };
    }
  }
  return null;
}
const cvdSq = h => `<i class="sq" style="background:${esc(h)}"></i>`;
/* opt.fix: show a Fix button per pair (the caller wires [data-cvdfix]); opt.bg: background used to keep contrast when fixing. */
function cvdNotice(colors, label, opt = {}) {
  const iss = cvdIssues(colors), more = `<a href="${CVD_GUIDE}">Read more about color blindness</a>`;
  if (!iss.length) return `<p class="cvd ok">${TICK} <b>Colorblind check${label ? ' (' + esc(label) + ')' : ''}:</b> no two colors are likely to be confused. This is an estimate, so also test with the Colorblind simulator. ${more}.</p>`;
  const sem = iss.some(x => x.semantic);
  return `<div class="cvd warn" role="note"><p><b><span aria-hidden="true">!</span> Colorblind check${label ? ' (' + esc(label) + ')' : ''}: ${iss.length} pair${iss.length > 1 ? 's' : ''} may look alike to some people.</b> This is a heads up, not a rule against these colors. Add an icon, label or pattern so the meaning never depends on color alone. ${more}.</p><ul>${iss.map((x, i) => {
    const fx = opt.fix ? cvdFix(x, colors, opt.bg) : null;
    return `<li><span class="cvd-pair">${cvdSq(x.a.hex)} ${esc(x.a.name)} and ${cvdSq(x.b.hex)} ${esc(x.b.name)}: ${x.types.map(t => CVD[t].label + ' (' + CVD[t].about + ')').join(', ')}${x.semantic ? ' <span class="tag">Used together on purpose</span>' : ''}</span>${opt.fix ? (fx ? `<span class="fixwrap"><button type="button" class="btn sm" data-cvdfix="${esc(fx.color.id || '')}" data-hex="${fx.hex}" aria-describedby="fp-${i}">Fix</button><span class="fixprev" role="tooltip" id="fp-${i}"><b>Before</b><span class="fp-row">${cvdSq(x.a.hex)}${cvdSq(x.b.hex)}</span><b>After</b><span class="fp-row">${cvdSq(fx.side === 'a' ? fx.hex : x.a.hex)}${cvdSq(fx.side === 'b' ? fx.hex : x.b.hex)}</span><span class="fp-t">${esc(fx.color.name)} changes from ${esc(fmtColor(fx.color.hex))} to ${esc(fmtColor(fx.hex))}. Hue stays the same; only lightness moves, so the pair is easier to tell apart for every type.</span></span></span>` : '<span class="note">No small change fixes this one. Use an icon or label.</span>') : ''}</li>`;
  }).join('')}</ul>${sem ? '<p class="note">Feedback colors like success and danger are usually shown together, because most people read green and red as good and bad. Some types of color blindness cannot tell them apart. You do not have to drop them: keep the colors and add an icon (a check or a warning sign) and a text label so everyone gets the same message.</p>' : ''}</div>`;
}

/* ---------- Color Extract: pull the main colors out of an image ---------- */
function extractColors(canvas, n) {
  const w = canvas.width, h = canvas.height, d = canvas.getContext('2d').getImageData(0, 0, w, h).data, px = [];
  for (let i = 0; i < d.length; i += 4) if (d[i + 3] > 128) px.push([d[i], d[i + 1], d[i + 2]]);
  if (!px.length) return [];
  const total = px.length; let boxes = [px];
  while (boxes.length < n) {
    boxes.sort((a, b) => b.length - a.length); const bx = boxes.shift(); if (bx.length < 2) { boxes.push(bx); break }
    const rng = [0, 1, 2].map(c => { let mn = 255, mx = 0; for (const p of bx) { if (p[c] < mn) mn = p[c]; if (p[c] > mx) mx = p[c] } return mx - mn }), ch = rng.indexOf(Math.max(...rng));
    bx.sort((a, b) => a[ch] - b[ch]); const mid = bx.length >> 1; boxes.push(bx.slice(0, mid), bx.slice(mid));
  }
  const res = boxes.filter(b => b.length).map(b => { const s = [0, 0, 0]; for (const p of b) { s[0] += p[0]; s[1] += p[1]; s[2] += p[2] } return { hex: rgbHex(s[0] / b.length, s[1] / b.length, s[2] / b.length), pct: b.length / total * 100 } }).sort((a, b) => b.pct - a.pct);
  const merged = []; res.forEach(c => { const m = merged.find(x => deltaE(x.hex, c.hex) < 6); m ? m.pct += c.pct : merged.push(c) });
  return merged;
}
let cxStream = null;
const stopCam = () => { if (cxStream) { cxStream.getTracks().forEach(t => t.stop()); cxStream = null } };
/* opt.system: add to that design system (Design Systems tab). Without it, the buttons add to the randomizer or a design system picked in the dialog. */
function openColorExtract(opt = {}) {
  const sysMode = !!opt.system, rzSys = !sysMode && rzListMode() === 'system', roleSel = sysMode || rzSys;
  const api = openDialog(`<div class="mdl-f cx"><div class="cx-head"><h2 id="mdl-t">Color Extract</h2><button class="x" id="cx-x" aria-label="Close Color Extract">${X_ICON}</button></div>
  <p class="note" style="margin:0 0 10px">Pick the main colors out of any image. Images are read in your browser and never uploaded anywhere.</p>
  <div class="cx-grid"><div class="cx-left">
    <div class="cx-drop" id="cx-drop" role="group" aria-label="Drop an image here or press Enter to choose a file"><b>Drop an image here</b><span>or</span><div class="row" style="justify-content:center;margin:0"><button class="btn" type="button" id="cx-up">Upload image</button><button class="btn" type="button" id="cx-cam">${CAMERA_ICON}Camera</button></div><input type="file" id="cx-file" accept="image/*" hidden></div>
    <form class="cx-url" id="cx-url"><label class="f"><span class="f-t">Or paste an image link</span><input type="text" id="cx-link" placeholder="https://example.com/photo.jpg" autocomplete="off"></label><button class="btn" type="submit">Load</button></form>
    <p class="ct-err" id="cx-err" role="alert"></p>
    <div class="cx-cam" id="cx-camwrap" hidden><video id="cx-video" playsinline muted></video><div class="row" style="margin:6px 0 0"><button class="btn solid" type="button" id="cx-snap">Take photo</button><button class="btn" type="button" id="cx-camoff">Cancel</button></div></div>
    <div class="cx-img" id="cx-imgwrap" hidden><img id="cx-img" alt="The image you chose, used to find colors"><div class="cx-sq" id="cx-sq" role="group" aria-label="Colors found"></div></div>
  </div><div class="cx-right" id="cx-right"><p class="empty">Choose an image to see its colors.</p></div></div></div>`, 'wide');
  const d = api.el, $d = s => $(s, d), close = () => { stopCam(); api.close(null) };
  $d('#cx-x').onclick = close; d.addEventListener('close', stopCam);
  let work = null, count = 8, found = [];
  const err = m => { $d('#cx-err').textContent = m || '' };
  const loadImg = (src, cors) => new Promise((res, rej) => { const im = new Image(); if (cors) im.crossOrigin = 'anonymous'; im.onload = () => res(im); im.onerror = () => rej(new Error('load')); im.src = src });
  const useImage = im => {
    const s = Math.min(1, 700 / Math.max(im.naturalWidth || im.width, im.naturalHeight || im.height)); work = document.createElement('canvas'); work.width = Math.max(1, Math.round((im.naturalWidth || im.width) * s)); work.height = Math.max(1, Math.round((im.naturalHeight || im.height) * s));
    work.getContext('2d').drawImage(im, 0, 0, work.width, work.height);
    try { work.getContext('2d').getImageData(0, 0, 1, 1) } catch { work = null; return err('That site does not allow other sites to read its pictures. Download the image and upload it instead.') }
    err(''); $d('#cx-img').src = work.toDataURL('image/png'); $d('#cx-imgwrap').hidden = false; $d('#cx-drop').hidden = true; $d('#cx-camwrap').hidden = true; stopCam(); run();
  };
  const fromFile = f => { if (!f || !/^image\//.test(f.type)) return err('That file is not an image.'); const u = URL.createObjectURL(f); loadImg(u).then(im => { useImage(im); URL.revokeObjectURL(u) }).catch(() => err('That image could not be opened.')) };
  $d('#cx-up').onclick = () => $d('#cx-file').click(); $d('#cx-file').onchange = e => fromFile(e.target.files[0]);
  $d('#cx-drop').onkeydown = e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); $d('#cx-file').click() } };
  ['dragover', 'dragenter'].forEach(t => d.addEventListener(t, e => { e.preventDefault(); $d('#cx-drop').classList.add('over') })); ['dragleave', 'drop'].forEach(t => d.addEventListener(t, () => $d('#cx-drop').classList.remove('over')));
  d.addEventListener('drop', e => { e.preventDefault(); fromFile(e.dataTransfer.files[0]) });
  $d('#cx-url').onsubmit = e => { e.preventDefault(); const u = $d('#cx-link').value.trim(); if (!/^https?:\/\//i.test(u)) return err('Enter a link that starts with http:// or https://'); err(''); loadImg(u, true).then(useImage).catch(() => err('That image could not be loaded. The link may be wrong, or the site may block other sites from reading its pictures. Download it and upload it instead.')) };
  $d('#cx-cam').onclick = async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) return err('This browser or page cannot use a camera. Camera access needs a secure (https) page.');
    try { cxStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } }); const v = $d('#cx-video'); v.srcObject = cxStream; await v.play(); $d('#cx-camwrap').hidden = false; err('') } catch { err('The camera could not be opened. Allow camera access in your browser, or upload an image instead.') }
  };
  $d('#cx-camoff').onclick = () => { stopCam(); $d('#cx-camwrap').hidden = true };
  $d('#cx-snap').onclick = () => { const v = $d('#cx-video'); if (!v.videoWidth) return; const c = document.createElement('canvas'); c.width = v.videoWidth; c.height = v.videoHeight; c.getContext('2d').drawImage(v, 0, 0); useImage(c) };
  function run() {
    if (!work) return; found = extractColors(work, count);
    const sysOpts = typeof sysOptions === 'function' ? sysOptions() : '';
    $d('#cx-sq').innerHTML = found.map((c, i) => `<button type="button" class="cx-s" style="background:${c.hex}" data-i="${i}" aria-label="Copy ${esc(fmtColor(c.hex))}" title="${esc(fmtColor(c.hex))}"></button>`).join('');
    $d('#cx-right').innerHTML = `<div class="row cx-ctl"><label class="f"><span class="f-t">Colors to find</span><select id="cx-n" aria-label="Number of colors to find">${[3, 4, 5, 6, 8, 10, 12].map(n => `<option ${n === count ? 'selected' : ''}>${n}</option>`).join('')}</select></label>${cfmtSelect()}${!sysMode ? `<label class="f"><span class="f-t">Design system</span><select id="cx-sys" aria-label="Design system to add to">${sysOpts}</select></label>` : ''}</div>
    <ul class="cx-list">${found.map((c, i) => `<li><i class="cx-sw" style="background:${c.hex}"></i><div class="cx-v"><code>${esc(fmtColor(c.hex))}</code><span>${c.pct.toFixed(c.pct < 10 ? 1 : 0)}% of the image${colorFmt !== 'HEX' ? ' · ' + c.hex.toUpperCase() : ''}</span></div>${roleSel ? `<label class="f"><span class="sr">Role for ${esc(c.hex)}</span><select data-role="${i}" aria-label="Role for ${esc(c.hex)}">${['Other', ...ROLES.filter(r => r !== 'Other')].map(r => `<option>${r}</option>`).join('')}</select></label>` : ''}<div class="cx-b"><button class="btn sm" type="button" data-copy="${i}">Copy</button>${sysMode ? `<button class="btn sm solid" type="button" data-addsys="${i}">Add to ${esc(opt.system.name)}</button>` : `<button class="btn sm solid" type="button" data-addrz="${i}">Add to randomizer</button><button class="btn sm" type="button" data-addds="${i}">Add to design system</button>`}</div></li>`).join('')}</ul>
    ${cvdNotice(found.map((c, i) => ({ name: fmtColor(c.hex), hex: c.hex })))}<p class="note" id="cx-msg" role="status"></p>`;
    upgradeSelects($d('#cx-right')); wireCfmt($d('#cx-right'), run);
    $d('#cx-n').addEventListener('change', e => { count = +e.target.value; run() });
    $$('[data-copy]', d).forEach(b => b.onclick = () => copy(fmtColor(found[+b.dataset.copy].hex), fmtColor(found[+b.dataset.copy].hex)));
    $$('.cx-s', d).forEach(b => b.onclick = () => copy(fmtColor(found[+b.dataset.i].hex), fmtColor(found[+b.dataset.i].hex)));
    const roleOf = i => { const s = $d('[data-role="' + i + '"]'); return s ? s.value : 'Other' }, msg = t => { $d('#cx-msg').innerHTML = t };
    $$('[data-addsys]', d).forEach(b => b.onclick = () => { const i = +b.dataset.addsys, c = found[i], role = roleOf(i), s = opt.system, ex = role !== 'Other' && s.colors.find(x => x.role === role); if (ex) { ex.hex = c.hex; ex.source = 'Color Extract' } else s.colors.push({ id: uid(), name: role === 'Other' ? 'Extracted ' + (s.colors.length + 1) : role, hex: c.hex, role, source: 'Color Extract' }); sortColors(s); saveStore(); msg(`${CHECK} Added ${esc(fmtColor(c.hex))} as ${esc(role)}.`); opt.onAdd && opt.onAdd() });
    $$('[data-addrz]', d).forEach(b => b.onclick = () => { const i = +b.dataset.addrz; msg(rzAddExtracted(found[i].hex, roleOf(i))) });
    $$('[data-addds]', d).forEach(b => b.onclick = async () => { const i = +b.dataset.addds, s = await addColorsToSystem($d('#cx-sys'), [{ role: roleOf(i), name: roleOf(i) === 'Other' ? 'Extracted' : roleOf(i), hex: found[i].hex }], 'Color Extract'); if (s) msg(`${CHECK} Added to ${esc(s.name)}.`) });
  }
  $d('#cx-sq').addEventListener('click', () => { });
  return api;
}

/* ---------- Lorem ipsum generator ---------- */
const LOREM_WORDS = 'lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua enim ad minim veniam quis nostrud exercitation ullamco laboris nisi aliquip ex ea commodo consequat duis aute irure in reprehenderit voluptate velit esse cillum fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt culpa qui officia deserunt mollit anim id est laborum curabitur pretium tincidunt lacus nunc malesuada vestibulum ante primis faucibus orci luctus ultrices posuere cubilia curae integer vitae justo eget magna fermentum iaculis eu non diam phasellus vestibulum lorem sed risus ultricies tristique nulla aliquet porttitor lacus luctus accumsan tortor posuere ac ut consequat semper viverra nam libero justo laoreet sit amet cursus sit amet dictum sit amet justo donec enim diam vulputate ut pharetra sit amet aliquam id diam maecenas ultricies mi eget mauris pharetra et ultrices neque ornare aenean euismod elementum nisi quis eleifend quam adipiscing vitae proin sagittis nisl rhoncus mattis rhoncus urna neque viverra'.split(' ');
const LOREM_START = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit';
const LOREM_MAX = { paragraphs: 50, sentences: 200, words: 5000, characters: 20000 };
const LOREM_STATE = { type: 'paragraphs', n: 3, classic: true };
function loremSentence(first) {
  const len = 6 + Math.floor(Math.random() * 11); let w = [];
  for (let i = 0; i < len; i++) w.push(pick(LOREM_WORDS));
  if (len > 9 && Math.random() < .6) { const at = 3 + Math.floor(Math.random() * (len - 6)); w[at] += ',' }
  let t = w.join(' '); if (first) t = LOREM_START;
  return t[0].toUpperCase() + t.slice(1) + '.';
}
function loremWords(n, classic) {
  const out = classic ? LOREM_START.toLowerCase().replace(',', '').split(' ') : []; let prev = '';
  while (out.length < n) { let w = pick(LOREM_WORDS); if (w === prev) continue; out.push(w); prev = w } return out.slice(0, n);
}
function makeLorem(type, n, classic) {
  if (type === 'words') return loremWords(n, classic).join(' ');
  if (type === 'sentences') return Array.from({ length: n }, (_, i) => loremSentence(classic && i === 0)).join(' ');
  if (type === 'paragraphs') return Array.from({ length: n }, (_, p) => Array.from({ length: 3 + Math.floor(Math.random() * 4) }, (_, i) => loremSentence(classic && p === 0 && i === 0)).join(' ')).join('\n\n');
  let t = classic ? LOREM_START + '. ' : ''; while (t.length < n) t += loremSentence(false) + ' ';
  t = t.slice(0, n); if (/[ ,]$/.test(t) && n > 1) t = t.slice(0, -1) + '.'; return t;
}
function renderLorem(el) {
  const S = LOREM_STATE;
  el.innerHTML = `<p class="lede">Placeholder text for layouts. Choose a type and an amount and the text updates as you go. Characters and words are exact, so asking for 100 characters gives you exactly 100, letters and spaces included.</p>
  <div class="lorem-ctl"><label class="f"><span class="f-t">Type</span><select id="lo-type" aria-label="Type of text">${Object.keys(LOREM_MAX).map(k => `<option value="${k}" ${S.type === k ? 'selected' : ''}>${k[0].toUpperCase() + k.slice(1)}</option>`).join('')}</select></label>
  <label class="f"><span class="f-t">Amount</span><input type="number" id="lo-n" min="1" inputmode="numeric" value="${S.n}" aria-describedby="lo-max"></label>
  <label class="chk"><input type="checkbox" id="lo-classic" ${S.classic ? 'checked' : ''}> Start with "Lorem ipsum dolor sit amet"</label></div><p class="note" id="lo-max"></p>
  <div class="lorem-out"><div class="row" style="margin:0 0 8px"><button class="btn solid" id="lo-copy" type="button">Copy text</button><span class="empty" id="lo-stats" role="status"></span></div><div id="lo-text" class="lorem-text" tabindex="0" aria-label="Generated text"></div></div>`;
  let text = '';
  const gen = () => {
    const max = LOREM_MAX[S.type], raw = parseInt($('#lo-n', el).value, 10); let n = raw;
    $('#lo-max', el).textContent = !raw || raw < 1 ? `Enter a number from 1 to ${max.toLocaleString()}.` : raw > max ? `The most ${S.type} at once is ${max.toLocaleString()}. Showing ${max.toLocaleString()}.` : `1 to ${max.toLocaleString()} ${S.type}.`;
    n = Math.min(max, Math.max(1, n || 1)); S.n = n;
    text = makeLorem(S.type, n, S.classic);
    $('#lo-text', el).innerHTML = text.split('\n\n').map(p => `<p>${esc(p)}</p>`).join('');
    const words = text.trim().split(/\s+/).length, sent = (text.match(/[.!?](\s|$)/g) || []).length;
    $('#lo-stats', el).textContent = `${text.length.toLocaleString()} characters · ${words.toLocaleString()} words${S.type !== 'words' && S.type !== 'characters' ? ' · ' + sent + ' sentences' : ''}`;
  };
  $('#lo-type', el).addEventListener('change', e => { S.type = e.target.value; gen() });
  $('#lo-n', el).oninput = gen; $('#lo-classic', el).onchange = e => { S.classic = e.target.checked; gen() };
  $('#lo-copy', el).onclick = () => copy(text, 'text');
  upgradeSelects(el); gen();
}

/* ---------- Unit converter ---------- */
const UNITS = [['px', 'Pixels (px)'], ['rem', 'rem'], ['em', 'em'], ['pt', 'Points (pt)'], ['pc', 'Picas (pc)'], ['in', 'Inches (in)'], ['cm', 'Centimeters (cm)'], ['mm', 'Millimeters (mm)'], ['vw', 'Viewport width (vw)'], ['vh', 'Viewport height (vh)'], ['vmin', 'vmin'], ['vmax', 'vmax'], ['%', 'Percent of font size (%)']];
const UNIT_STATE = { v: 16, from: 'px', base: 16, vw: 1440, vh: 900 };
function unitToPx(v, u, S) { return { px: v, rem: v * S.base, em: v * S.base, pt: v * 96 / 72, pc: v * 16, in: v * 96, cm: v * 96 / 2.54, mm: v * 96 / 25.4, vw: v * S.vw / 100, vh: v * S.vh / 100, vmin: v * Math.min(S.vw, S.vh) / 100, vmax: v * Math.max(S.vw, S.vh) / 100, '%': v * S.base / 100 }[u] }
function pxToUnit(px, u, S) { return { px: px, rem: px / S.base, em: px / S.base, pt: px * 72 / 96, pc: px / 16, in: px / 96, cm: px * 2.54 / 96, mm: px * 25.4 / 96, vw: px / S.vw * 100, vh: px / S.vh * 100, vmin: px / Math.min(S.vw, S.vh) * 100, vmax: px / Math.max(S.vw, S.vh) * 100, '%': px / S.base * 100 }[u] }
const unitNum = n => { const r = Math.round(n * 10000) / 10000; return String(r) };
function renderUnits(el) {
  const S = UNIT_STATE;
  el.innerHTML = `<p class="lede">Convert between CSS units. Handy for turning a Figma size in px into rem for handoff, or points for print. Results update as you type.</p>
  <div class="unit-ctl"><label class="f"><span class="f-t">Value</span><input type="number" id="un-v" step="any" value="${S.v}"></label><label class="f"><span class="f-t">Unit</span><select id="un-from" aria-label="Unit to convert from">${UNITS.map(u => `<option value="${u[0]}" ${S.from === u[0] ? 'selected' : ''}>${u[1]}</option>`).join('')}</select></label></div>
  <details class="src" open><summary>Settings that rem, em, % and viewport units depend on</summary><div class="unit-ctl"><label class="f"><span class="f-t">Base font size (px)</span><input type="number" id="un-base" min="1" value="${S.base}"></label><label class="f"><span class="f-t">Viewport width (px)</span><input type="number" id="un-vw" min="1" value="${S.vw}"></label><label class="f"><span class="f-t">Viewport height (px)</span><input type="number" id="un-vh" min="1" value="${S.vh}"></label></div><p class="note">Browsers use 16px as the base font size unless a site changes it. The viewport is the visible page area, like the frame size in Figma. em assumes the parent text is the base font size.</p></details>
  <div class="tscroll"><table class="ct-tbl"><caption class="sr">Converted values</caption><thead><tr><th scope="col">Unit</th><th scope="col">Value</th><th scope="col"><span class="sr">Copy</span></th></tr></thead><tbody id="un-rows"></tbody></table></div>`;
  const upd = () => {
    S.v = parseFloat($('#un-v', el).value) || 0; S.from = $('#un-from', el).value; ['base', 'vw', 'vh'].forEach(k => { const x = parseFloat($('#un-' + k, el).value); S[k] = x > 0 ? x : S[k] });
    const px = unitToPx(S.v, S.from, S);
    $('#un-rows', el).innerHTML = UNITS.map(u => { const val = unitNum(pxToUnit(px, u[0], S)) + (u[0] === '%' ? '%' : u[0]); return `<tr class="${u[0] === S.from ? 'cur' : ''}"><th scope="row">${esc(u[1])}</th><td><code>${esc(val)}</code></td><td><button class="btn sm" type="button" data-cp="${esc(val)}">Copy</button></td></tr>` }).join('');
    $$('[data-cp]', el).forEach(b => b.onclick = () => copy(b.dataset.cp, b.dataset.cp));
  };
  ['v', 'base', 'vw', 'vh'].forEach(k => $('#un-' + k, el).oninput = upd); $('#un-from', el).addEventListener('change', upd);
  upgradeSelects(el); upd();
}

/* ---------- Persona generator ---------- */
const FIRST = 'Alex Jordan Taylor Morgan Riley Casey Avery Quinn Rowan Skyler Jamie Charlie Sam Kai Robin Dakota Emerson Finley Harper Hayden Kendall Logan Parker Peyton Reese River Sage Sawyer Spencer Tatum Blair Cameron Devon Elliott Frankie Gerry Harley Hunter Indigo Jessie Jules Justice Kamari Marlowe Milan North Ocean Phoenix Remy Rory Saint Shiloh Stevie Vale'.split(' ');
const LAST = 'Abara Adeyemi Ahmed Alvarez Andersson Banerjee Bauer Bennett Brooks Castillo Chang Chavez Chowdhury Clarke Costa Cruz Dang Diaz Dubois Edwards Fernandez Fischer Flores Foster Garcia Gonzalez Gupta Hamidi Hansen Haruna Hernandez Hoang Hughes Ibrahim Ivanov Jackson Jensen Johansson Kapoor Kaur Khan Kim Kowalski Kumar Lee Lopez Mahmoud Martin Martinez Mbeki Mendoza Miller Mitchell Moreau Morales Murphy Nakamura Nguyen Novak Nowak Okafor Okoye Olsen Ortiz Osei Park Patel Perez Petrov Phillips Popov Ramirez Reyes Rivera Robinson Rossi Russo Saito Sanchez Santos Schmidt Sharma Silva Singh Smith Suzuki Tanaka Taylor Thompson Torres Tran Varga Vasquez Wang Watanabe Williams Wilson Wong Yamamoto Yilmaz Young Zhang Zhou'.split(' ');
const PERSONA = { n: 6, style: 'Illustrated', list: [] };
const profPool = () => DATA.filter(e => e.type === 'profile' && (!PERSONA.style || e.category === PERSONA.style));
const profStyleList = () => [...new Set(DATA.filter(e => e.type === 'profile').map(e => e.category))].sort(styleSort);
function newPersonas(n) {
  const pool = profPool(), out = []; let bag = [];
  for (let i = 0; i < n; i++) { if (!bag.length) bag = pool.slice().sort(() => Math.random() - .5); out.push({ first: pick(FIRST), last: pick(LAST), e: bag.pop() }) }
  return out;
}
async function svgToPngBlob(svg, size = 512) {
  if (!/ width=/.test(svg.slice(0, 200))) svg = svg.replace('<svg ', `<svg width="${size}" height="${size}" `);
  const url = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml' })), im = await new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = rej; i.src = url }), c = document.createElement('canvas'); c.width = c.height = size; c.getContext('2d').drawImage(im, 0, 0, size, size); URL.revokeObjectURL(url);
  return new Promise(res => c.toBlob(res, 'image/png'));
}
function renderPersona(el) {
  const styles = profStyleList(), MAXN = 100;
  el.innerHTML = `<p class="lede">Random first and last names with profile pictures, for personas, mockups and user-research boards. The pictures come from the <a href="#/browse/profile">Profiles</a> collection in Browse, so pick a style to match. Hover (or tab to) a picture to download or copy it. The pictures are CC0 (public domain): cartoon illustrations and hand-drawn style pictures. No credit is required for any of them. Names are random combinations, so any match with a real person is a coincidence.</p>
  <div class="row" style="align-items:end"><label class="f"><span class="f-t">Style</span><select id="pe-style" aria-label="Profile picture style">${styles.map(x => `<option ${x === PERSONA.style ? 'selected' : ''}>${esc(x)}</option>`).join('')}</select></label>
  <label class="f"><span class="f-t">How many</span><input type="number" id="pe-n" min="1" max="${MAXN}" step="1" inputmode="numeric" value="${PERSONA.n}" aria-describedby="pe-note"></label><button class="btn solid" id="pe-go" type="button">Generate again</button><button class="btn" id="pe-copyall" type="button">Copy all names</button></div>
  <p class="note" id="pe-note" role="status"></p>
  <ul class="persona-grid" id="pe-grid" aria-label="Personas"></ul>`;
  const note = () => { const pool = profPool().length, raw = parseInt($('#pe-n', el).value, 10); $('#pe-note', el).textContent = !raw || raw < 1 ? `Enter a number from 1 to ${MAXN}.` : raw > MAXN ? `The most at once is ${MAXN}. Showing ${MAXN}.` : raw > pool ? `This style has ${pool} pictures, so some will repeat. Try a different style for more variety.` : `Pick any number from 1 to ${MAXN}. ${pool} pictures are available in ${PERSONA.style ? 'the ' + PERSONA.style + ' style' : 'the Illustrated style'}. ` };
  const draw = () => {
    $('#pe-grid', el).innerHTML = PERSONA.list.map((p, i) => `<li class="persona"><div class="pav"><div class="pimg"><img src="${svgUri(p.e.svg)}" alt="Profile picture for ${esc(p.first)} ${esc(p.last)}" width="200" height="200" loading="lazy" decoding="async"></div><div class="pover"><button class="btn sm" data-dl="png" data-i="${i}" type="button">Download PNG</button><button class="btn sm" data-cpimg="${i}" type="button">Copy image</button></div></div>
    <div class="pname"><div><span class="eyebrow">First name</span><b>${esc(p.first)}</b></div><button class="btn sm" data-cn="first" data-i="${i}" type="button" aria-label="Copy first name ${esc(p.first)}">Copy</button></div>
    <div class="pname"><div><span class="eyebrow">Last name</span><b>${esc(p.last)}</b></div><button class="btn sm" data-cn="last" data-i="${i}" type="button" aria-label="Copy last name ${esc(p.last)}">Copy</button></div>
    <button class="btn sm" data-cn="full" data-i="${i}" type="button">Copy full name</button></li>`).join('');
    $$('[data-cn]', el).forEach(b => b.onclick = () => { const p = PERSONA.list[+b.dataset.i], t = b.dataset.cn === 'first' ? p.first : b.dataset.cn === 'last' ? p.last : p.first + ' ' + p.last; copy(t, t) });
    $$('[data-dl]', el).forEach(b => b.onclick = async () => { const p = PERSONA.list[+b.dataset.i]; download((p.first + '-' + p.last).toLowerCase() + '.png', await svgToPngBlob(p.e.svg), 'image/png') });
    $$('[data-cpimg]', el).forEach(b => b.onclick = async () => { const p = PERSONA.list[+b.dataset.cpimg]; try { await navigator.clipboard.write([new ClipboardItem({ 'image/png': svgToPngBlob(p.e.svg) })]); toast('Copied image') } catch { copy(p.e.svg, 'image as SVG code (this browser cannot copy pictures)') } });
  };
  const gen = () => { const raw = parseInt($('#pe-n', el).value, 10); PERSONA.n = Math.min(MAXN, Math.max(1, raw || 1)); note(); PERSONA.list = newPersonas(PERSONA.n); draw() };
  let t; $('#pe-n', el).oninput = () => { note(); clearTimeout(t); const raw = parseInt($('#pe-n', el).value, 10); if (raw >= 1) t = setTimeout(gen, 300) };
  $('#pe-n', el).onchange = () => { $('#pe-n', el).value = Math.min(MAXN, Math.max(1, parseInt($('#pe-n', el).value, 10) || PERSONA.n)); gen() };
  $('#pe-style', el).addEventListener('change', e => { PERSONA.style = e.target.value; gen() }); $('#pe-go', el).onclick = gen;
  $('#pe-copyall', el).onclick = () => copy(PERSONA.list.map(p => p.first + ' ' + p.last).join('\n'), 'names');
  upgradeSelects(el); gen();
}

/* ---------- Colorblind simulator ---------- */
const CVS = { lines: [['#1d4ed8', '#16a34a', '#dc2626', '#f59e0b', '#7c3aed', '#0a0a0a']], tab: 'palette' };
const CV_MAX_LINES = 12, CV_MAX_BOXES = 12; /* plan caps: at most 12 lines, at most 12 boxes per line, never fewer */
const cvFmtOf = raw => {
  const s = String(raw).trim();
  if (normHex(s)) return 'HEX';
  const m = s.match(/^(rgb|hsl|hsb|hsv|cmyk)/i);
  if (m) return m[1].toUpperCase().replace('HSV', 'HSB');
  return colorFmt; /* bare numbers: the shared global format, since this tool has no format picker of its own */
};
const cvLine = ln => {
  const boxes = ln.map(raw => { const hex = parseColor(raw); return { raw, hex, fmt: hex ? cvFmtOf(raw) : '' }; });
  const first = boxes.find(b => b.hex);
  const fmt = first ? first.fmt : 'HEX';
  return { boxes, fmt, colors: boxes.filter(b => b.hex).map(b => ({ name: fmtColor(b.hex, fmt), hex: b.hex, fmt })) };
};
function renderCvd(el) {
  el.innerHTML = `<p class="lede">About 1 in 24 people have red-green color blindness, the most common form; the rate varies with ancestry. See how colors and pictures look with each type, and find color pairs that could be confused. These are close estimates, not medical tests.</p>
  <div class="seg-row"><div class="seg" role="radiogroup" aria-label="What to check">${[['palette', 'Colors'], ['image', 'An image']].map(([k, l]) => `<button type="button" role="radio" aria-checked="${CVS.tab === k}" data-cvt="${k}">${l}</button>`).join('')}</div></div><div id="cvd-body"></div>`;
  $$('[data-cvt]', el).forEach(b => b.onclick = () => { CVS.tab = b.dataset.cvt; renderCvd(el) });
  const body = $('#cvd-body', el);
  if (CVS.tab === 'palette') {
    CVS.lines = [CVS.lines.flat()]; /* one flat list of colors: no separate lines */
    body.innerHTML = `<div class="cvd-in"><div class="cv-lines">${CVS.lines.map((ln, li) => {
      const p = cvLine(ln);
      const boxes = ln.map((raw, bi) => `<div class="cv-cell"><div class="cv-box"><span class="cv-swb"><button type="button" class="cv-pick" data-pick="${bi}" aria-label="Edit color ${bi + 1}, currently ${p.boxes[bi].hex ? esc(fmtColor(p.boxes[bi].hex)) : 'not set'}"><i class="cv-sw" aria-hidden="true" data-sw="${li}-${bi}"></i></button><input type="color" class="cv-native" data-native="${bi}" tabindex="-1" aria-hidden="true" value="${p.boxes[bi].hex || '#000000'}"></span><label class="sr" for="cv-b-${li}-${bi}">Color ${bi + 1}</label><input type="text" id="cv-b-${li}-${bi}" class="cv-in" value="${esc(raw)}" spellcheck="false" autocomplete="off" data-line="${li}" data-box="${bi}" aria-describedby="cv-e-${li}-${bi}"><button type="button" class="cv-rm" data-rm="${li}-${bi}" aria-label="Remove color ${bi + 1}">&times;</button></div><p class="ct-err" id="cv-e-${li}-${bi}" role="alert"></p></div>`).join('');
      return `<div class="cv-line" data-line="${li}"><div class="cv-boxes">${boxes}</div><div class="cv-foot"><button type="button" class="btn sm solid" id="cv-addc" data-addc="${li}"${ln.length >= CV_MAX_BOXES ? ' disabled' : ''}>Add color</button>${ln.length >= CV_MAX_BOXES ? `<span class="note" role="status">Maximum of ${CV_MAX_BOXES} colors.</span>` : ''}</div></div>`;
    }).join('')}</div><div class="cv-side"><label class="f"><span class="f-t">Or load from a design system</span><select id="cv-sys" aria-label="Load colors from a design system"><option value="">Choose one</option>${S.systems.map(s => `<option value="${s.id}">${esc(s.name)}</option>`).join('')}</select></label></div></div><div id="cv-out"></div>`;
    const upd = () => {
      $$('.cv-in', body).forEach(inp => { CVS.lines[+inp.dataset.line][+inp.dataset.box] = inp.value });
      const all = CVS.lines.map(cvLine);
      const cols = all.flatMap((l, li) => l.colors.map(c => ({ ...c, line: li })));
      all.forEach((l, li) => l.boxes.forEach((b, bi) => {
        const inp = $(`#cv-b-${li}-${bi}`, body), err = $(`#cv-e-${li}-${bi}`, body), sw = $(`[data-sw="${li}-${bi}"]`, body);
        if (!inp || !err) return;
        if (b.raw.trim() && !b.hex) { inp.setAttribute('aria-invalid', 'true'); err.textContent = 'Enter ' + COLOR_HINT + '.'; if (sw) sw.style.background = '' }
        else { inp.removeAttribute('aria-invalid'); err.textContent = ''; if (sw) sw.style.background = b.hex || '' }
      }));
      $('#cv-out', body).innerHTML = cols.length ? `<div class="tscroll"><table class="cvd-t"><caption class="sr">Colors as seen with each type of color blindness</caption><thead><tr><th scope="col">Color</th><th scope="col">Normal vision</th>${Object.keys(CVD).map(k => `<th scope="col">${CVD[k].label}<small>${CVD[k].about}</small></th>`).join('')}</tr></thead><tbody>${cols.map(c => `<tr><th scope="row">${esc(c.name)}</th><td><i class="cv-sw" style="background:${c.hex}"></i><code>${esc(fmtColor(c.hex, c.fmt))}</code></td>${Object.keys(CVD).map(k => { const h = simHex(c.hex, k); return `<td><i class="cv-sw" style="background:${h}"></i><code>${esc(fmtColor(h, c.fmt))}</code></td>` }).join('')}</tr>`).join('')}</tbody></table></div>${cvdNotice(cols)}<p class="note">A pair is flagged when two colors look clearly different normally but become close for a type of color blindness. Protanopia and deuteranopia (red-green) are the most common; tritanopia and achromatopsia are rare.</p>` : '<p class="empty">Add at least two colors to check.</p>';
      all[0].boxes.forEach((b, bi) => { const pb = $(`[data-pick="${bi}"]`, body), nat = $(`[data-native="${bi}"]`, body); if (pb) pb.setAttribute('aria-label', `Edit color ${bi + 1}, currently ${b.hex ? fmtColor(b.hex) : 'not set'}`); if (nat && b.hex && nat.value !== b.hex) nat.value = b.hex });
    };
    $$('.cv-in', body).forEach(inp => inp.oninput = upd);
    $$('.cv-rm', body).forEach(btn => btn.onclick = () => { const [li, bi] = btn.dataset.rm.split('-').map(Number); if (CVS.lines[li].length > 1) { CVS.lines[li].splice(bi, 1); renderCvd(el) } });
    $$('[data-addc]', body).forEach(btn => btn.onclick = () => { const li = +btn.dataset.addc; if (CVS.lines[li].length < CV_MAX_BOXES) { CVS.lines[li].push(''); renderCvd(el); const nb = $(`#cv-b-${li}-${CVS.lines[li].length - 1}`, el); if (nb) nb.focus() } });
    /* Clicking a swatch opens the browser's own color picker (the invisible native input sits over it so the popup opens beside the swatch). Typing in the text box and picking stay in sync live, without redrawing the row, so focus never jumps. */
    $$('.cv-pick', body).forEach(btn => btn.onclick = () => { const nat = $(`[data-native="${btn.dataset.pick}"]`, body); if (!nat) return; try { nat.showPicker() } catch { nat.click() } });
    $$('.cv-native', body).forEach(nat => nat.oninput = () => { const txt = $(`#cv-b-0-${nat.dataset.native}`, body); if (txt) { txt.value = fmtColor(nat.value); txt.dispatchEvent(new Event('input')) } });
    $('#cv-sys', body).addEventListener('change', e => { const s = S.systems.find(x => x.id === e.target.value); if (s) { CVS.lines = [s.colors.map(c => c.hex).slice(0, CV_MAX_BOXES)]; renderCvd(el) } });
    upgradeSelects(body); upd();
  } else {
    body.innerHTML = `<div class="cx-drop" id="cv-drop" role="group" aria-label="Drop an image here or press Enter to choose one"><b>Drop an image here</b><span>or</span><button class="btn" type="button" id="cv-up">Upload image</button><input type="file" id="cv-file" accept="image/*" hidden></div><p class="ct-err" id="cv-err" role="alert"></p><div class="cvd-imgs" id="cv-imgs"></div>`;
    const show = f => {
      if (!f || !/^image\//.test(f.type)) return $('#cv-err', body).textContent = 'That file is not an image.';
      const u = URL.createObjectURL(f), im = new Image();
      im.onload = () => {
        const s = Math.min(1, 520 / im.naturalWidth, 420 / im.naturalHeight), w = Math.max(1, Math.round(im.naturalWidth * s)), h = Math.max(1, Math.round(im.naturalHeight * s));
        const base = document.createElement('canvas'); base.width = w; base.height = h; const bx = base.getContext('2d'); bx.drawImage(im, 0, 0, w, h); URL.revokeObjectURL(u); const data = bx.getImageData(0, 0, w, h);
        $('#cv-imgs', body).innerHTML = [['original', 'Normal vision'], ...Object.keys(CVD).map(k => [k, CVD[k].label + ' (' + CVD[k].about + ')'])].map(([k, l]) => `<figure><canvas data-k="${k}" width="${w}" height="${h}" role="img" aria-label="${esc(l)}"></canvas><figcaption>${esc(l)}</figcaption></figure>`).join('');
        $$('canvas', body).forEach(c => { const o = new ImageData(new Uint8ClampedArray(data.data), w, h); if (c.dataset.k !== 'original') for (let i = 0; i < o.data.length; i += 4) { const r = simRgb(o.data[i], o.data[i + 1], o.data[i + 2], c.dataset.k); o.data[i] = r[0]; o.data[i + 1] = r[1]; o.data[i + 2] = r[2] } c.getContext('2d').putImageData(o, 0, 0) });
        $('#cv-err', body).textContent = '';
      }; im.onerror = () => $('#cv-err', body).textContent = 'That image could not be opened.'; im.src = u;
    };
    $('#cv-up', body).onclick = () => $('#cv-file', body).click(); $('#cv-file', body).onchange = e => show(e.target.files[0]);
    $('#cv-drop', body).onkeydown = e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); $('#cv-file', body).click() } };
    const dz = $('#cv-drop', body); ['dragover', 'dragenter'].forEach(t => dz.addEventListener(t, e => { e.preventDefault(); dz.classList.add('over') })); ['dragleave', 'drop'].forEach(t => dz.addEventListener(t, () => dz.classList.remove('over'))); dz.addEventListener('drop', e => { e.preventDefault(); show(e.dataTransfer.files[0]) });
  }
}

/* ---------- File converter (images, in the browser) ---------- */
const zipCrcTable = (() => { const t = new Uint32Array(256); for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; t[n] = c >>> 0 } return t })();
const zipCrc = u8 => { let c = 0xffffffff; for (let i = 0; i < u8.length; i++) c = zipCrcTable[(c ^ u8[i]) & 255] ^ (c >>> 8); return (c ^ 0xffffffff) >>> 0 };
function makeBinZip(files) { /* files: [{name, data:Uint8Array}], stored without compression */
  const enc = new TextEncoder(), parts = [], cd = []; let off = 0;
  const u16 = n => [n & 255, n >> 8 & 255], u32 = n => [n & 255, n >> 8 & 255, n >> 16 & 255, n >> 24 & 255];
  files.forEach(f => { const nm = enc.encode(f.name), c = zipCrc(f.data), h = new Uint8Array([0x50, 0x4b, 3, 4, 20, 0, 0, 8, 0, 0, 0, 0, 0x21, 0, ...u32(c), ...u32(f.data.length), ...u32(f.data.length), ...u16(nm.length), 0, 0]); parts.push(h, nm, f.data); cd.push({ nm, c, size: f.data.length, off }); off += h.length + nm.length + f.data.length });
  const cdStart = off; cd.forEach(e => { const h = new Uint8Array([0x50, 0x4b, 1, 2, 20, 0, 20, 0, 0, 8, 0, 0, 0, 0, 0x21, 0, ...u32(e.c), ...u32(e.size), ...u32(e.size), ...u16(e.nm.length), 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, ...u32(e.off)]); parts.push(h, e.nm); off += h.length + e.nm.length });
  parts.push(new Uint8Array([0x50, 0x4b, 5, 6, 0, 0, 0, 0, ...u16(cd.length), ...u16(cd.length), ...u32(off - cdStart), ...u32(cdStart), 0, 0])); return new Blob(parts, { type: 'application/zip' });
}
const CONV_OUT = [['png', 'PNG', 'image/png'], ['jpg', 'JPG', 'image/jpeg'], ['webp', 'WEBP', 'image/webp'], ['bmp', 'BMP', 'image/bmp'], ['ico', 'ICO (icon)', 'image/x-icon'], ['pdf', 'PDF (one image per page)', 'application/pdf']];
const CONV = { files: [], target: 'png', quality: 90, bg: '#ffffff' };
const u8cat = parts => { const n = parts.reduce((a, p) => a + p.length, 0), o = new Uint8Array(n); let i = 0; parts.forEach(p => { o.set(p, i); i += p.length }); return o };
async function convertImage(file, fmt, q, bg) {
  const url = URL.createObjectURL(file), im = await new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = () => rej(new Error('decode')); i.src = url });
  let w = im.naturalWidth || im.width || 300, h = im.naturalHeight || im.height || 150; if (fmt === 'ico') { const s = Math.min(1, 256 / Math.max(w, h)); w = Math.round(w * s); h = Math.round(h * s) }
  const c = document.createElement('canvas'); c.width = w; c.height = h; const x = c.getContext('2d'); if (['jpg', 'bmp', 'pdf'].includes(fmt)) { x.fillStyle = bg; x.fillRect(0, 0, w, h) } x.drawImage(im, 0, 0, w, h); URL.revokeObjectURL(url);
  const blob = type => new Promise(res => c.toBlob(res, type, q / 100));
  if (fmt === 'png' || fmt === 'jpg' || fmt === 'webp') { const b = await blob(CONV_OUT.find(o => o[0] === fmt)[2]); if (!b || b.type !== CONV_OUT.find(o => o[0] === fmt)[2]) throw new Error('This browser cannot save ' + fmt.toUpperCase()); return b }
  if (fmt === 'bmp') { const d = x.getImageData(0, 0, w, h).data, row = (w * 3 + 3) & ~3, size = 54 + row * h, o = new Uint8Array(size), dv = new DataView(o.buffer); o[0] = 66; o[1] = 77; dv.setUint32(2, size, true); dv.setUint32(10, 54, true); dv.setUint32(14, 40, true); dv.setInt32(18, w, true); dv.setInt32(22, h, true); dv.setUint16(26, 1, true); dv.setUint16(28, 24, true); dv.setUint32(34, row * h, true); for (let yy = 0; yy < h; yy++) for (let xx = 0; xx < w; xx++) { const s = (yy * w + xx) * 4, t = 54 + (h - 1 - yy) * row + xx * 3; o[t] = d[s + 2]; o[t + 1] = d[s + 1]; o[t + 2] = d[s] } return new Blob([o], { type: 'image/bmp' }) }
  if (fmt === 'ico') { const png = new Uint8Array(await (await blob('image/png')).arrayBuffer()), hd = new Uint8Array(22), dv = new DataView(hd.buffer); dv.setUint16(2, 1, true); dv.setUint16(4, 1, true); hd[6] = w >= 256 ? 0 : w; hd[7] = h >= 256 ? 0 : h; dv.setUint16(10, 1, true); dv.setUint16(12, 32, true); dv.setUint32(14, png.length, true); dv.setUint32(18, 22, true); return new Blob([hd, png], { type: 'image/x-icon' }) }
  if (fmt === 'pdf') { const jpg = new Uint8Array(await (await blob('image/jpeg')).arrayBuffer()), te = new TextEncoder(), objs = [], pw = w * .75, ph = h * .75, content = `q ${pw} 0 0 ${ph} 0 0 cm /Im0 Do Q`; const parts = [te.encode('%PDF-1.4\n')], offs = []; let pos = parts[0].length; const add = p => { parts.push(p); pos += p.length };
    const obj = (n, body) => { offs[n] = pos; add(te.encode(`${n} 0 obj\n`)); body.forEach(add); add(te.encode('\nendobj\n')) };
    obj(1, [te.encode('<< /Type /Catalog /Pages 2 0 R >>')]); obj(2, [te.encode('<< /Type /Pages /Kids [3 0 R] /Count 1 >>')]); obj(3, [te.encode(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pw} ${ph}] /Resources << /XObject << /Im0 4 0 R >> >> /Contents 5 0 R >>`)]);
    obj(4, [te.encode(`<< /Type /XObject /Subtype /Image /Width ${w} /Height ${h} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${jpg.length} >>\nstream\n`), jpg, te.encode('\nendstream')]); obj(5, [te.encode(`<< /Length ${content.length} >>\nstream\n${content}\nendstream`)]);
    const xr = pos; add(te.encode(`xref\n0 6\n0000000000 65535 f \n${[1, 2, 3, 4, 5].map(n => String(offs[n]).padStart(10, '0') + ' 00000 n \n').join('')}trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${xr}\n%%EOF`)); return new Blob([u8cat(parts)], { type: 'application/pdf' }) }
  throw new Error('Unknown format');
}
const fmtSize = n => n < 1024 ? n + ' B' : n < 1048576 ? (n / 1024).toFixed(1) + ' KB' : (n / 1048576).toFixed(1) + ' MB';
function renderConvert(el) {
  el.innerHTML = `<p class="lede">Convert images from one format to another, as many as you like at once. Everything happens in your browser; your files never leave your device. Right now this handles images (PNG, JPG, WEBP, GIF, BMP, SVG, AVIF, ICO and anything else your browser can open).</p>
  <div class="cx-drop" id="cv-drop" role="group" aria-label="Drop images here or press Enter to choose images"><b>Drop images here</b><span>or</span><button class="btn solid" type="button" id="cv-up">Choose images from your device</button><input type="file" id="cv-file" accept="image/*" multiple hidden></div>
  <div class="row conv-opt" style="align-items:end"><label class="f"><span class="f-t">Convert to</span><select id="cv-target" aria-label="Convert to">${CONV_OUT.map(o => `<option value="${o[0]}" ${CONV.target === o[0] ? 'selected' : ''}>${o[1]}</option>`).join('')}</select></label>
  <label class="f"><span class="f-t">Quality (JPG, WEBP, PDF): <output id="cv-qv">${CONV.quality}</output>%</span><input type="range" id="cv-q" min="30" max="100" value="${CONV.quality}"></label>
  <label class="f"><span class="f-t">Background for formats without transparency</span><input type="color" id="cv-bg" value="${CONV.bg}" aria-label="Background color"></label></div>
  <div id="cv-list"></div><div class="row" id="cv-actions" hidden><button class="btn solid" type="button" id="cv-zip">Download</button><button class="btn" type="button" id="cv-clear">Clear list</button></div>`;
  const list = $('#cv-list', el), baseName = n => n.replace(/\.[^.]+$/, '');
  const draw = () => {
    $('#cv-actions', el).hidden = !CONV.files.length; $('#cv-zip', el).textContent = CONV.files.filter(f => f.out).length > 1 ? 'Download all' : 'Download';
    list.innerHTML = CONV.files.length ? `<div class="tscroll"><table class="ct-tbl"><caption class="sr">Files to convert</caption><thead><tr><th scope="col">File</th><th scope="col">Size</th><th scope="col">Status</th><th scope="col"><span class="sr">Actions</span></th></tr></thead><tbody>${CONV.files.map((f, i) => `<tr><th scope="row">${esc(f.file.name)}</th><td>${fmtSize(f.file.size)}</td><td class="${f.err ? 'fail' : f.out ? 'pass' : ''}">${f.err ? esc(f.err) : f.out ? TICK + ' ' + esc(baseName(f.file.name)) + '.' + f.fmt + ' (' + fmtSize(f.out.size) + ')' : 'Converting…'}</td><td>${f.out ? `<button class="btn sm" data-dl="${i}" type="button">Download</button>` : ''}<button class="btn sm" data-rm="${i}" type="button" aria-label="Remove ${esc(f.file.name)}">Remove</button></td></tr>`).join('')}</tbody></table></div>` : '';
    $$('[data-dl]', list).forEach(b => b.onclick = () => { const f = CONV.files[+b.dataset.dl]; download(baseName(f.file.name) + '.' + f.fmt, f.out, f.out.type) });
    $$('[data-rm]', list).forEach(b => b.onclick = () => { CONV.files.splice(+b.dataset.rm, 1); draw() });
  };
  const run = async f => { f.out = null; f.err = ''; f.fmt = CONV.target; draw(); try { f.out = await convertImage(f.file, CONV.target, CONV.quality, CONV.bg) } catch (e) { f.err = /decode/.test(e.message) ? 'This file could not be read as an image.' : e.message } draw() };
  const add = files => { [...files].forEach(file => { if (!file.type.startsWith('image/') && !/\.(ico|bmp|avif|heic)$/i.test(file.name)) { CONV.files.push({ file, err: 'Not an image. Only images can be converted for now.' }); return } const f = { file }; CONV.files.push(f); run(f) }); draw() };
  $('#cv-up', el).onclick = () => $('#cv-file', el).click(); $('#cv-file', el).onchange = e => { add(e.target.files); e.target.value = '' };
  const dz = $('#cv-drop', el); dz.onkeydown = e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); $('#cv-file', el).click() } };
  ['dragover', 'dragenter'].forEach(t => dz.addEventListener(t, e => { e.preventDefault(); dz.classList.add('over') })); ['dragleave', 'drop'].forEach(t => dz.addEventListener(t, () => dz.classList.remove('over'))); dz.addEventListener('drop', e => { e.preventDefault(); add(e.dataTransfer.files) });
  const redo = () => CONV.files.forEach(f => { if (f.file.type.startsWith('image/') || f.out) run(f) });
  $('#cv-target', el).addEventListener('change', e => { CONV.target = e.target.value; redo() });
  let qt; $('#cv-q', el).oninput = e => { CONV.quality = +e.target.value; $('#cv-qv', el).textContent = CONV.quality; clearTimeout(qt); qt = setTimeout(redo, 250) };
  $('#cv-bg', el).oninput = e => { CONV.bg = e.target.value; redo() };
  $('#cv-clear', el).onclick = () => { CONV.files = []; draw() };
  $('#cv-zip', el).onclick = async () => { const ok = CONV.files.filter(f => f.out); if (!ok.length) return toast('Nothing converted yet.'); if (ok.length === 1) { const f = ok[0]; return download(baseName(f.file.name) + '.' + f.fmt, f.out, f.out.type) } const used = new Set(); const items = await Promise.all(ok.map(async f => { let n = baseName(f.file.name) + '.' + f.fmt, k = 1; while (used.has(n)) n = baseName(f.file.name) + '-' + (k++) + '.' + f.fmt; used.add(n); return { name: n, data: new Uint8Array(await f.out.arrayBuffer()) } })); download("converted-images.zip", makeBinZip(items), 'application/zip') };
  upgradeSelects(el); draw();
}

/* ---------- Background remover (color-based, in the browser) ---------- */
/* ---------- Optional on-device model through ONNX Runtime Web (WebGPU), inside a Web Worker ---------- */
/* Each model is downloaded by the visitor's own browser only after they agree, and the browser caches it. Sizes come from the model's Hugging Face page. */
const BGAI_ORT = 'https://cdn.jsdelivr.net/npm/onnxruntime-web@1.27.0/dist/';
/* Only models whose license allows this use are listed. To add one, read its license first, then add a row here. */
const BGAI_MODELS = {
  standard: { tier: 'Standard', name: 'BiRefNet Lite (WebGPU build)', repo: 'runes/birefnet-lite-webgpu', file: 'birefnet_lite_webgpu_fp16.onnx', bytes: 123000000, mib: 117.3, device: 'webgpu', inp: 'input_image', license: 'MIT', page: 'https://huggingface.co/runes/birefnet-lite-webgpu', about: 'Cuts out people, animals and objects, including on busy backgrounds. This is a copy of the MIT-licensed BiRefNet Lite that was rewritten to run on your graphics chip through WebGPU. It works at 1024 pixels.', specs: 'about 8 GB of memory and a recent graphics chip (built-in graphics, or a card with about 4 GB or more of its own memory)' }
};
const BGAI = { model: 'none', agreed: {}, got: {}, worker: null, url: '', inline: false, started: false, pend: null, idleT: 0, ready: false, loaded: '', onIdle: null };
/* The last model the visitor used, and that they agreed to it, is remembered on this device only. */
const BGAI_KEY = 'mambo-bgai-v1';
const bgaiSave = () => { try { localStorage.setItem(BGAI_KEY, JSON.stringify({ model: BGAI.model, agreed: BGAI.agreed, got: BGAI.got })) } catch { } };
(() => { try { const s = JSON.parse(localStorage.getItem(BGAI_KEY) || '{}'); for (const k of Object.keys(BGAI_MODELS)) if (s.agreed && s.agreed[k] === true) { BGAI.agreed[k] = true; if (s.got && s.got[k] === true) BGAI.got[k] = true } if (BGAI_MODELS[s.model] && BGAI.agreed[s.model]) BGAI.model = s.model } catch { } })();
/* The worker body is a function that is sent to the browser as text, so the page stays one file. It must not use anything from outside itself. */
function bgaiWorkerMain(host) {
  host = host || self;
  let ort = null, sess = null, key = '';
  const S = 1024, mean = [0.485, 0.456, 0.406], std = [0.229, 0.224, 0.225];
  const say = (m, t) => host.postMessage(m, t || []);
  say({ type: 'hello' });
  /* The model file comes from the browser cache when it was downloaded before, otherwise from the network, and is then cached. */
  const fetchModel = async (url, size) => {
    let c = null; try { c = self.caches ? await self.caches.open('transformers-cache') : null } catch { }
    const hit = c && await c.match(url);
    if (hit) { const b = await hit.arrayBuffer(); say({ type: 'progress', p: { status: 'progress', file: 'model.onnx', loaded: b.byteLength, total: b.byteLength } }); return b }
    const r = await fetch(url); if (!r.ok) throw new Error('The download failed with status ' + r.status);
    const total = +r.headers.get('content-length') || size, rd = r.body.getReader(), chunks = []; let loaded = 0;
    for (; ;) { const { done, value } = await rd.read(); if (done) break; chunks.push(value); loaded += value.length; say({ type: 'progress', p: { status: 'progress', file: 'model.onnx', loaded: Math.min(loaded, total), total } }) }
    const buf = new Uint8Array(loaded); let o = 0; for (const ch of chunks) { buf.set(ch, o); o += ch.length }
    if (c) { try { await c.put(url, new Response(buf, { headers: { 'content-length': String(loaded) } })) } catch { } }
    return buf.buffer;
  };
  const prep = (px, w, h) => {
    const out = new Float32Array(3 * S * S), plane = S * S, x0 = new Int32Array(S), x1 = new Int32Array(S), xw = new Float32Array(S);
    for (let x = 0; x < S; x++) { const fx = Math.max(0, (x + 0.5) * w / S - 0.5), a = Math.min(w - 1, Math.floor(fx)); x0[x] = a; x1[x] = Math.min(w - 1, a + 1); xw[x] = fx - a }
    for (let y = 0; y < S; y++) {
      const fy = Math.max(0, (y + 0.5) * h / S - 0.5), y0 = Math.min(h - 1, Math.floor(fy)), y1 = Math.min(h - 1, y0 + 1), wy = fy - y0;
      for (let x = 0; x < S; x++) {
        const a = (y0 * w + x0[x]) * 4, b = (y0 * w + x1[x]) * 4, c = (y1 * w + x0[x]) * 4, e = (y1 * w + x1[x]) * 4, wx = xw[x];
        for (let k = 0; k < 3; k++) out[k * plane + y * S + x] = (((px[a + k] * (1 - wx) + px[b + k] * wx) * (1 - wy) + (px[c + k] * (1 - wx) + px[e + k] * wx) * wy) / 255 - mean[k]) / std[k];
      }
    }
    return out;
  };
  const post = (lg, w, h) => {
    const sg = new Float32Array(S * S), out = new Uint8Array(w * h);
    for (let i = 0; i < sg.length; i++) sg[i] = 1 / (1 + Math.exp(-lg[i]));
    for (let y = 0; y < h; y++) {
      const fy = Math.min(S - 1, Math.max(0, (y + 0.5) * S / h - 0.5)), y0 = Math.floor(fy), y1 = Math.min(S - 1, y0 + 1), wy = fy - y0;
      for (let x = 0; x < w; x++) {
        const fx = Math.min(S - 1, Math.max(0, (x + 0.5) * S / w - 0.5)), x0 = Math.floor(fx), x1 = Math.min(S - 1, x0 + 1), wx = fx - x0;
        out[y * w + x] = Math.round(255 * ((sg[y0 * S + x0] * (1 - wx) + sg[y0 * S + x1] * wx) * (1 - wy) + (sg[y1 * S + x0] * (1 - wx) + sg[y1 * S + x1] * wx) * wy));
      }
    }
    return out;
  };
  host.onmessage = async e => {
    const d = e.data;
    try {
      if (d.type === 'load') {
        if (!ort) { const mod = await import(d.ortUrl + 'ort.webgpu.min.mjs'); ort = mod.default || mod; ort.env.wasm.wasmPaths = d.ortUrl }
        if (!sess || key !== d.url) {
          sess = null;
          const buf = await fetchModel(d.url, d.size);
          sess = await ort.InferenceSession.create(buf, { executionProviders: ['webgpu'] });
          key = d.url;
        }
        say({ type: 'ready' });
      } else if (d.type === 'free') {
        try { sess && sess.release && await sess.release() } catch { }
        sess = null; key = '';
      } else if (d.type === 'run') {
        const input = prep(new Uint8ClampedArray(d.buffer), d.width, d.height);
        const res = await sess.run({ [d.inp]: new ort.Tensor('float32', input, [1, 3, S, S]) });
        const t = Object.values(res)[0], out = post(t.data, d.width, d.height);
        try { t.dispose && t.dispose() } catch { }
        say({ type: 'mask', buffer: out.buffer }, [out.buffer]);
      }
    } catch (err) { say({ type: 'error', message: typeof err === 'number' ? 'The model runtime stopped with an internal error (code ' + err + ')' : String((err && err.message) || err) }) }
  };
}
function bgaiCaps() {
  const n = navigator, c = n.connection || {};
  let why = '';
  if (typeof WebAssembly === 'undefined') why = 'This browser cannot run these models because it needs WebAssembly.';
  else if (window.isSecureContext === false) why = 'These models need a secure (https) page.';
  return { ok: !why, why, webgpu: !!n.gpu, mobile: n.userAgentData ? !!n.userAgentData.mobile : /Android|iPhone|iPad|Mobi/.test(n.userAgent || ''), mem: n.deviceMemory || 0, cores: n.hardwareConcurrency || 0, saveData: !!c.saveData };
}
/* Only a suggestion. These browser hints are rounded and some browsers hide them, so the visitor can always choose. */
const bgaiSuggest = c => !c.webgpu || c.mobile || (c.mem && c.mem < 4) ? 'none' : 'standard';
const bgaiDescribe = c => `Your browser reports: ${c.webgpu ? 'WebGPU available' : c.gpuOff ? 'WebGPU present but no graphics adapter found (hardware acceleration may be off)' : 'no WebGPU'}${c.mobile ? ', a phone or tablet' : ''}${c.mem ? ', about ' + c.mem + ' GB of memory (a rounded hint)' : ', no memory hint'}${c.cores ? ', ' + c.cores + ' processor threads' : ''}${c.saveData ? ', Data Saver on (the download may use your mobile data)' : ''}. We suggest ${(BGAI_MODELS[bgaiSuggest(c)] || { tier: 'No model' }).tier}.`;
/* Plain-language help for each problem, with steps for the visitor's own browser. A web page cannot open a browser's settings pages, so the card offers the address to copy. */
const BGAI_BROWSERS = { chrome: 'Chrome', edge: 'Edge', brave: 'Brave', firefox: 'Firefox', safari: 'Safari', other: 'Another browser' };
const BGAI_SYS = { chrome: ['chrome://settings/system', 'chrome://gpu', 'the menu (three dots) > Settings > System'], edge: ['edge://settings/system', 'edge://gpu', 'the menu (three dots) > Settings > System and performance'], brave: ['brave://settings/system', 'brave://gpu', 'the menu (three lines) > Settings > System'] };
function bgaiBrowser() {
  const u = navigator.userAgent || '';
  if (navigator.brave) return 'brave';
  if (/Edg\//.test(u)) return 'edge';
  if (/Firefox\//.test(u)) return 'firefox';
  if (/Chrome\/|Chromium\//.test(u) && !/OPR\//.test(u)) return 'chrome';
  if (/Safari\//.test(u) && !/Chrome|Chromium/.test(u)) return 'safari';
  return 'other';
}
const bgaiClassify = m => /no usable WebGPU|graphics adapter/i.test(m) ? 'gpu' : /kernel|zero-sized|not supported|unsupported/i.test(m) ? 'kernel' : /internal error/i.test(m) ? 'crash' : /backend|wasm|worker/i.test(m) ? 'worker' : /fetch|network|import|404|offline|download/i.test(m) ? 'net' : /memory|alloc|out of|oom/i.test(m) ? 'mem' : 'other';
function bgaiFix(kind, br) {
  if (kind === 'gpu') {
    const s = BGAI_SYS[br], t = 'Graphics acceleration is off or unavailable', x = 'Your browser offers WebGPU but could not find a graphics chip to use, so the models are turned off and No model still works. A remote desktop, a virtual machine or an app\'s built-in browser can also have no graphics chip, so try a regular browser window.';
    if (s) return { title: t, text: x, steps: ['Open ' + s[2] + '.', 'Turn on "Use graphics acceleration when available".', 'Click Relaunch (or Restart) so the change applies.', 'To check, type ' + s[1] + ' in the address bar. WebGPU should say "Hardware accelerated".', 'If it still says disabled, update your graphics driver and restart the computer.'], copy: { label: 'Copy settings address', value: s[0] }, note: 'Browsers do not let a web page open their settings, so copy the address and paste it into a new tab.' };
    if (br === 'firefox') return { title: t, text: x, steps: ['Open the menu (three lines) > Settings > General > Performance.', 'Untick "Use recommended performance settings".', 'Tick "Use hardware acceleration when available", then restart Firefox.', 'WebGPU support in Firefox depends on your system. If it stays off, use No model, or try Chrome or Edge to use a model.'] };
    if (br === 'safari') return { title: t, text: x, steps: ['WebGPU needs a recent Safari. Open the Apple menu > System Settings > General > Software Update and install any update.', 'If it stays off, use No model, or try Chrome or Edge to use a model.'] };
    return { title: t, text: x, steps: ['Look for a "hardware acceleration" or "graphics acceleration" option in your browser settings, usually under System or Performance, and turn it on.', 'Or try Chrome or Edge to use a model.'] };
  }
  if (kind === 'worker') {
    const file = location.protocol === 'file:';
    return file ? { title: 'This page is running from a file', text: 'The page was opened straight from a file on your computer. Browsers block background workers there, so the model runs on the page itself and the page can freeze for a moment while it works. It still works, and it is not a problem on the live website.', steps: ['Open the site from its web address, or run a small local server.', 'To run one, open a terminal in the site folder and run npx serve.', 'Open the address it prints, usually http://localhost:3000.'], copy: { label: 'Copy the command', value: 'npx serve' } }
      : { title: 'The browser blocked a background worker', text: 'Your browser or an extension stopped this page from starting a background worker. The model still runs on the page itself, but the page can freeze for a moment while it works.', steps: ['Turn off extensions that block scripts or workers for this site, then reload the page.', 'Or try another browser, such as Chrome or Edge.'] };
  }
  if (kind === 'kernel') return { title: 'Your graphics chip or browser cannot run this model', text: 'WebGPU stopped on an operation it could not run. This depends on your browser version and graphics driver, not on your picture, so trying the same image again will not help.', steps: ['Update your browser to the newest version and restart it.', 'Update your graphics driver, then restart the computer.', 'If it still fails, use No model, or try another browser or device.', 'Press Copy details and send it along if you report the problem.'] };
  if (kind === 'crash') return { title: 'The model stopped unexpectedly', text: 'The model runtime hit an internal error. This usually means the device ran out of memory (graphics or system) or does not support something this model needs. The larger the model, the more likely it is.', steps: ['Pick No model, or try a device with more memory.', 'Close other tabs and apps, then reload this page.', 'Update your browser and your graphics driver.'] };
  if (kind === 'net') return { title: 'The model could not be downloaded', text: 'The page could not reach the place where the model is stored (Hugging Face, through the jsDelivr network). Your connection, a work or school network, or a blocker may be stopping it.', steps: ['Check that you are online, then press Try again.', 'Turn off ad blockers and privacy extensions for this site, or allow huggingface.co and cdn.jsdelivr.net.', 'If you are on a work or school network or a VPN, try another network.'] };
  if (kind === 'mem') return { title: 'Not enough memory', text: 'The device ran out of memory while running this model.', steps: ['Close other tabs and apps, then reload this page.', 'Pick No model, or try a device with more memory.'] };
  return { title: 'The model could not finish', text: 'Something unexpected stopped the model. The message above is the browser\'s own wording.', steps: ['Press Try again.', 'If it keeps happening, pick No model.', 'If you report it, include the message above and which browser you use.'] };
}
/* Some browsers only hand out a graphics adapter for a particular request, so try the usual ones before deciding there is none. */
async function bgaiAdapter() {
  if (!navigator.gpu) return null;
  for (const o of [undefined, { powerPreference: 'high-performance' }, { powerPreference: 'low-power' }]) { try { const a = await navigator.gpu.requestAdapter(o); if (a) return a } catch { } }
  return null;
}
function bgaiFree(why) {
  clearTimeout(BGAI.idleT);
  const p = BGAI.pend; BGAI.pend = null;
  if (BGAI.worker) { BGAI.worker.terminate(); BGAI.worker = null }
  if (BGAI.url) { URL.revokeObjectURL(BGAI.url); BGAI.url = '' }
  BGAI.ready = false; BGAI.loaded = '';
  if (p) p.reject(new Error(why || 'cancelled'));
}
/* Runs the worker body. If the browser cannot start a Web Worker from this page, the same code runs on the page itself and the model's own helper thread keeps it responsive. */
function bgaiSpawn() {
  if (!BGAI.inline) {
    try {
      BGAI.url = URL.createObjectURL(new Blob(['(' + bgaiWorkerMain.toString() + ')()'], { type: 'text/javascript' }));
      return new Worker(BGAI.url, { type: 'module' });
    } catch (err) { BGAI.inline = true }
  }
  const w = { onmessage: null }, host = { onmessage: null, postMessage: m => setTimeout(() => w.onmessage && w.onmessage({ data: m }), 0) };
  bgaiWorkerMain(host);
  w.postMessage = m => setTimeout(() => host.onmessage({ data: m }), 0);
  w.terminate = () => { w.onmessage = null; host.onmessage({ data: { type: 'free' } }) };
  return w;
}
function bgaiCall(msg, transfer, onProgress) {
  return new Promise((resolve, reject) => {
    if (!BGAI.worker) {
      BGAI.started = false;
      const w = BGAI.worker = bgaiSpawn();
      w.onmessage = e => { const d = e.data, p = BGAI.pend; if (d.type === 'hello') { BGAI.started = true; return } if (!p) return; if (d.type === 'progress') { p.onProgress && p.onProgress(d.p); return } BGAI.pend = null; if (d.type === 'error') p.reject(new Error(d.message)); else p.resolve(d) };
      w.onerror = e => { if (e.preventDefault) e.preventDefault(); const p = BGAI.pend, er = new Error((e.message || 'The browser could not start the background worker') + (e.filename ? ' (' + e.filename.slice(0, 60) + ')' : '')); er.nostart = !BGAI.started; BGAI.pend = null; bgaiFree(); if (p) p.reject(er) };
    }
    BGAI.pend = { resolve, reject, onProgress };
    BGAI.worker.postMessage(msg, transfer || []);
  });
}
/* If the worker cannot start, the model is loaded on the page itself instead. */
async function bgaiLoad(m, onProgress) {
  const go = () => bgaiCall({ type: 'load', ortUrl: BGAI_ORT, url: 'https://huggingface.co/' + m.repo + '/resolve/main/' + m.file, size: m.bytes }, null, onProgress);
  if (!(await bgaiAdapter())) throw new Error('This device has no usable WebGPU graphics adapter');
  try { await go() }
  catch (err) {
    if (!(err && err.nostart) || BGAI.inline) throw err;
    BGAI.inline = true; bgaiFree(); await go();
  }
  BGAI.ready = true; BGAI.loaded = m.id;
}
/* One picture at a time. After a minute without use the worker is closed, which frees the model's memory. */
async function bgaiEnsure(id, stage) {
  clearTimeout(BGAI.idleT);
  if (!BGAI.ready || !BGAI.worker || BGAI.loaded !== id) {
    stage({ stage: 'prepare' });
    await bgaiLoad({ id, ...BGAI_MODELS[id] }, p => { if (p && p.status === 'progress' && /\.onnx$/.test(p.file || '') && p.total) stage({ stage: 'download', loaded: p.loaded, total: p.total }) });
  }
  BGAI.idleT = setTimeout(() => { bgaiFree(); if (BGAI.onIdle) BGAI.onIdle() }, 60000);
}
async function bgaiRun(id, img, stage) {
  await bgaiEnsure(id, stage);
  clearTimeout(BGAI.idleT);
  stage({ stage: 'infer' });
  const buf = img.data.slice().buffer;
  const r = await bgaiCall({ type: 'run', buffer: buf, width: img.width, height: img.height, inp: BGAI_MODELS[id].inp }, [buf]);
  BGAI.idleT = setTimeout(() => { bgaiFree(); if (BGAI.onIdle) BGAI.onIdle() }, 60000);
  return new Uint8Array(r.buffer);
}
const BGR = { tol: 30, feather: 1, global: false, brush: 'none', size: 24, mode: 'color' };
const MODK = /Mac|iPhone|iPad/.test(navigator.platform || '') ? '⌘' : 'Ctrl';
let BG_KEYS = null;
function renderBgRemove(el) {
  el.innerHTML = `<p class="lede">Remove the background from a picture and download it as a transparent PNG. Pick a model below to cut out people from busy photos, or use no model for plain backgrounds, then touch up with the brush. Your image never leaves your device.</p>
  <section class="panel bg-ai" id="bg-ai" aria-labelledby="bg-ai-h"></section>
  <div class="cx-drop" id="bg-drop" role="group" aria-label="Drop an image here or press Enter to choose one"><b>Drop an image here</b><span>or</span><button class="btn solid" type="button" id="bg-up">Choose an image from your device</button><input type="file" id="bg-file" accept="image/*" hidden></div><p class="ct-err" id="bg-err" role="alert"></p><p class="note" id="bg-gate" hidden>Download the selected model first, or pick No model. You can add a picture as soon as the model is ready.</p>
  <div id="bg-work" hidden><div class="bg-ctl"><label class="f"><span class="f-t">Tolerance: <output id="bg-tv"></output></span><input type="range" id="bg-tol" min="1" max="100" value="${BGR.tol}"></label><label class="f"><span class="f-t">Edge softness: <output id="bg-fv"></output> px</span><input type="range" id="bg-f" min="0" max="6" value="${BGR.feather}"></label>
  <label class="chk"><input type="checkbox" id="bg-glob" ${BGR.global ? 'checked' : ''}> Remove this color everywhere, not only around the edges</label></div>
  <div class="row bg-tools" id="bg-tools" style="align-items:end"><div class="seg" role="radiogroup" aria-label="Tool">${[['none', 'Pick background color'], ['erase', 'Erase brush'], ['restore', 'Restore brush']].map(([k, l]) => `<button type="button" role="radio" aria-checked="${BGR.brush === k}" data-br="${k}">${l}</button>`).join('')}</div><label class="f"><span class="f-t">Brush size: <output id="bg-sv"></output></span><input type="range" id="bg-size" min="4" max="120" value="${BGR.size}"></label><button class="btn" id="bg-rbrush" type="button">Reset brush settings</button>
  <span class="bg-hist"><button class="btn" id="bg-undo" type="button" aria-keyshortcuts="Control+Z Meta+Z" title="Undo (${MODK}+Z)" disabled>Undo</button><button class="btn" id="bg-redo" type="button" aria-keyshortcuts="Control+Shift+Z Control+Y Meta+Shift+Z" title="Redo (${MODK}+Shift+Z)" disabled>Redo</button></span></div>
  <p class="note" id="bg-help"></p><div class="bg-stage" id="bg-stage"><button class="btn sm bg-zoom-btn" id="bg-zoom" type="button" aria-label="Open zoomed editor">Zoom in</button><canvas id="bg-cv" aria-label="Image with the background removed. Click to pick the background color, or paint with the brush."></canvas></div>
  <div class="row"><button class="btn solid" id="bg-dl" type="button">Download PNG</button><button class="btn" id="bg-new" type="button">Choose another image</button><span class="empty" id="bg-info" role="status"></span></div></div>`;
  let W = 0, H = 0, orig = null, mask = null, manual = null, bgc = null, raf = 0, aiMask = null, aiFor = '';
  const cv = $('#bg-cv', el), cx = cv.getContext('2d');
  const sampleBg = () => { const d = orig.data, pts = [], m = 3; for (let x = 0; x < W; x += Math.max(1, W >> 5)) { pts.push((x) * 4, ((H - 1) * W + x) * 4) } for (let y = 0; y < H; y += Math.max(1, H >> 5)) { pts.push((y * W) * 4, (y * W + W - 1) * 4) } const q = c => { const a = pts.map(i => d[i + c]).sort((u, v) => u - v); return a[a.length >> 1] }; return [q(0), q(1), q(2)] };
  const compute = () => {
    const d = orig.data, tol = BGR.tol * 4.4, t2 = tol * tol, N = W * H, keep = new Uint8Array(N).fill(255), near = i => { const k = i * 4, dr = d[k] - bgc[0], dg = d[k + 1] - bgc[1], db = d[k + 2] - bgc[2]; return d[k + 3] < 10 || dr * dr + dg * dg + db * db <= t2 };
    if (BGR.mode === 'ai' && aiMask && aiMask.length === N) { for (let i = 0; i < N; i++) keep[i] = aiMask[i] }
    else if (BGR.global) { for (let i = 0; i < N; i++) if (near(i)) keep[i] = 0 }
    else { const st = [], seen = new Uint8Array(N), push = i => { if (!seen[i] && near(i)) { seen[i] = 1; st.push(i) } }; for (let x = 0; x < W; x++) { push(x); push((H - 1) * W + x) } for (let y = 0; y < H; y++) { push(y * W); push(y * W + W - 1) } while (st.length) { const i = st.pop(); keep[i] = 0; const x = i % W; if (x > 0) push(i - 1); if (x < W - 1) push(i + 1); if (i >= W) push(i - W); if (i < N - W) push(i + W) } }
    const f = BGR.feather; let a = Float32Array.from(keep);
    if (f > 0) { const blur = (src, horiz) => { const o = new Float32Array(N), r = f; for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { let s = 0, c = 0; for (let k = -r; k <= r; k++) { const xx = horiz ? x + k : x, yy = horiz ? y : y + k; if (xx < 0 || yy < 0 || xx >= W || yy >= H) continue; s += src[yy * W + xx]; c++ } o[y * W + x] = s / c } return o }; a = blur(blur(a, true), false) }
    mask = a;
  };
  const paint = () => {
    const out = cx.createImageData(W, H), d = orig.data;
    for (let i = 0; i < W * H; i++) { const k = i * 4; let al = mask[i]; if (manual[i] === 1) al = 0; else if (manual[i] === 2) al = 255; out.data[k] = d[k]; out.data[k + 1] = d[k + 1]; out.data[k + 2] = d[k + 2]; out.data[k + 3] = Math.round(al * d[k + 3] / 255) }
    cx.putImageData(out, 0, 0);
    $('#bg-info', el).textContent = BGR.mode === 'ai' && aiMask ? 'Cut out with ' + BGAI_MODELS[aiFor].name + '.' : `Background color found: ${fmtColor(rgbHex(...bgc))}`;
  };
  const redo = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(() => { compute(); paint() }) };
  /* undo / redo: a list of snapshots of everything that shapes the result */
  let hist = [], hi = -1;
  const snap = () => ({ m: manual.slice(), bgc: bgc.slice(), tol: BGR.tol, f: BGR.feather, g: BGR.global });
  const syncHist = () => { $('#bg-undo', document).disabled = hi <= 0; $('#bg-redo', document).disabled = hi >= hist.length - 1 };
  const commit = () => { if (!manual) return; hist = hist.slice(0, hi + 1); hist.push(snap()); if (hist.length > 30) hist.shift(); hi = hist.length - 1; syncHist() };
  const applySnap = h => { manual = h.m.slice(); bgc = h.bgc.slice(); BGR.tol = h.tol; BGR.feather = h.f; BGR.global = h.g; $('#bg-tol', el).value = h.tol; $('#bg-f', el).value = h.f; $('#bg-glob', el).checked = h.g; labels(); redo(); syncHist() };
  const undo = () => { if (hi > 0) { hi--; applySnap(hist[hi]) } }, redoStep = () => { if (hi < hist.length - 1) { hi++; applySnap(hist[hi]) } };
  const labels = () => { $('#bg-tv', el).textContent = BGR.tol; $('#bg-fv', el).textContent = BGR.feather; $('#bg-sv', document).textContent = BGR.size + ' px'; $('#bg-help', el).textContent = BGR.mode === 'ai' && BGR.brush === 'none' ? 'The model cut-out is applied. Use the brushes to fix details, or pick No model above to go back.' : BGR.brush === 'none' ? 'Click the picture to choose which color counts as the background.' : BGR.brush === 'erase' ? 'Paint over parts you want removed.' : 'Paint over parts you want to bring back.'; syncMode() };
  /* ----- optional on-device models: a model runs in a Web Worker on this device, only after the visitor agrees ----- */
  const aiBox = $('#bg-ai', el), caps = bgaiCaps();
  if (BGAI.model !== 'none' && BGAI_MODELS[BGAI.model].device === 'webgpu' && !caps.webgpu) BGAI.model = 'none';
  const ui = { sel: BGAI.model, phase: 'idle', msg: '', busy: false, cancelled: false, again: false, br: bgaiBrowser(), open: {}, gen: 0, where: '', pct: 0 };
  /* A browser can offer WebGPU yet have no usable graphics adapter (for example with hardware acceleration off), so check before offering the WebGPU models. */
  if (caps.webgpu) (async () => {
    if (await bgaiAdapter()) return;
    caps.webgpu = false; caps.gpuOff = true;
    if (BGAI.model !== 'none' && BGAI_MODELS[BGAI.model].device === 'webgpu') { BGAI.model = 'none'; ui.sel = 'none'; bgaiSave() }
    if (ui.sel !== 'none' && BGAI_MODELS[ui.sel].device === 'webgpu') ui.sel = 'none';
    if (ui.phase !== 'work') drawAi();
  })();
  const syncMode = () => {
    const ai = BGR.mode === 'ai' && !!aiMask, pick = $('[data-br="none"]', document);
    $('#bg-tol', el).disabled = ai; $('#bg-glob', el).disabled = ai; if (pick) pick.disabled = ai;
  };
  const applyAi = () => { BGR.mode = 'ai'; if (BGR.brush === 'none') { const eb = $('[data-br="erase"]', document); if (eb) eb.click() } labels(); redo(); commit() };
  /* Changing the model, or choosing another picture, always starts from an empty drop zone, so a result is never mixed between models. */
  const resetImage = () => { cancelAnimationFrame(raf); orig = null; mask = null; manual = null; bgc = null; aiMask = null; aiFor = ''; hist = []; hi = -1; BGR.mode = 'color'; $('#bg-work', el).hidden = true; $('#bg-drop', el).hidden = false; $('#bg-file', el).value = ''; $('#bg-err', el).textContent = ''; labels(); syncHist() };
  const rmModel = async k => {
    const m = BGAI_MODELS[k];
    if (ui.busy && BGAI.model === k) { ui.gen++; ui.busy = false }
    if (BGAI.loaded === k || (BGAI.model === k && !BGAI.got[k])) bgaiFree('cancelled');
    BGAI.agreed[k] = false; BGAI.got[k] = false;
    if (ui.sel === k) { BGAI.model = 'none'; ui.sel = 'none'; resetImage() }
    let gone = false; try { if (window.caches && await caches.has('transformers-cache')) { const c = await caches.open('transformers-cache'); for (const q of await c.keys()) if (q.url.includes('/' + m.repo + '/') && await c.delete(q)) gone = true } } catch { }
    setPhase('idle', gone ? `Removed ${m.name}. The downloaded files were deleted from this browser.` : `Removed ${m.name}. No downloaded files were found in this browser.`, '#bg-ai-sel');
  };
  /* A real percentage while downloading. The later steps have no exact progress, so they show a fixed step mark, never a bouncing bar. */
  const prog = (pct, txt) => { const p = $('#bg-ai-pr', aiBox), t = $('#bg-ai-pt', aiBox), o = $('#bg-ai-pc', aiBox); ui.pct = Math.max(0, Math.min(100, Math.round(pct))); if (p) p.value = ui.pct; if (o) o.textContent = ui.pct + '%'; if (t) t.textContent = txt };
  const setPhase = (phase, msg, focus) => { ui.phase = phase; ui.msg = msg || ''; bgaiSave(); drawAi(focus) };
  const selectModel = id => {
    if (ui.busy) { ui.gen++; ui.busy = false; bgaiFree('cancelled') }
    ui.sel = id; ui.msg = ''; ui.where = '';
    resetImage();
    if (id === 'none') { bgaiFree(); BGAI.model = 'none'; return setPhase('idle', '', '#bg-ai-sel') }
    if (!BGAI.agreed[id]) return setPhase('idle', '', '#bg-ai-sel');
    BGAI.model = id;
    if (BGAI.got[id]) return setPhase('idle', '', '#bg-ai-sel');
    runAi();
  };
  const drawAi = focus => {
    if (!aiBox.isConnected) return;
    const M = BGAI_MODELS, id = ui.sel, m = M[id], busy = ui.phase === 'work';
    let activeShown = false;
    let h = `<h2 class="h3" id="bg-ai-h" tabindex="-1">Cut-out model <span class="tag">${busy ? 'Working' : ui.phase === 'err' ? 'Problem' : BGAI.model !== 'none' && BGAI.got[BGAI.model] ? 'On' : 'Off'}</span></h2>`;
    if (!caps.ok) { aiBox.innerHTML = h + `<p>${esc(caps.why)}</p>`; return }
    h += `<label class="f"><span class="f-t">Model</span><select id="bg-ai-sel"><option value="none" ${id === 'none' ? 'selected' : ''}>No model</option>${Object.keys(M).map(k => `<option value="${k}" ${k === id ? 'selected' : ''} ${M[k].device === 'webgpu' && !caps.webgpu ? 'disabled' : ''}>${esc(M[k].tier)}: ${esc(M[k].name)}, ${M[k].mib} MiB${M[k].device === 'webgpu' && !caps.webgpu ? ', needs WebGPU' : BGAI.got[k] ? ', downloaded' : ' download'}</option>`).join('')}</select></label>`;
    if (id !== 'none' && m) h += `<div class="bg-specs"><h3>Your device</h3><p id="bg-ai-dev">${esc(bgaiDescribe(caps))}</p><h3>This model needs</h3><p>${esc(m.specs)}</p><p class="note">Recommended specs are our estimate and have not been measured.</p></div>`;
    if (busy) h += `<p class="sr" role="status">The model started. Use the Cancel button to stop it.</p><p id="bg-ai-pt">${esc(ui.msg)}</p><div class="bg-prog"><progress id="bg-ai-pr" max="100" value="${ui.pct || 0}" aria-labelledby="bg-ai-pt"></progress><output id="bg-ai-pc">${ui.pct || 0}%</output></div><div class="row"><button class="btn" type="button" id="bg-ai-cancel">Cancel</button></div>`;
    else if (ui.phase === 'err') {
      const dl = ui.where === 'download', det = ['Model: ' + m.tier + ' ' + m.name + ' (' + m.repo + ')', 'Runs on ' + m.device + ' (' + m.file + ')', 'Failed at: ' + (dl ? 'downloading the model' : 'processing the image'), 'Message: ' + ui.msg, 'Memory: ' + (caps.mem || 'unknown') + ' GB, cores: ' + (caps.cores || 'unknown') + ', WebGPU: ' + (caps.webgpu ? 'yes' : 'no'), 'Worker: ' + (BGAI.inline ? 'inline' : 'separate'), 'Browser: ' + navigator.userAgent].join('\n');
      h += `<p role="alert">${esc(ui.msg)}</p><div class="row">${dl ? '<button class="btn solid" type="button" id="bg-ai-retry">Try the download again</button>' : '<button class="btn solid" type="button" id="bg-ai-retry">Try this image again</button><button class="btn" type="button" id="bg-ai-newimg">Choose a different image</button>'}<button class="btn" type="button" data-copy="${esc(det)}">Copy details</button></div>`;
    }
    else if (id === 'none') h += `<p class="note">No model is used. The color found at the edges of the picture is cleared, which suits plain backgrounds. Nothing is downloaded. Pick a model to cut out people or objects from busier photos.</p><p class="note" id="bg-ai-dev">${esc(bgaiDescribe(caps))}</p>${ui.msg ? `<p role="status">${esc(ui.msg)}</p>` : ''}`;
    else if (!BGAI.agreed[id]) h += `<p>${esc(m.about)}</p>
      <h3>What it uses on your device</h3>
      <ul class="bg-ai-list"><li>A one-time download of ${m.mib} MiB, kept in your browser cache so it does not download again.</li><li>Your processor and memory while it works. It frees that memory after a minute without use, and you can cancel at any time.</li></ul>
      <label class="chk"><input type="checkbox" id="bg-ai-ok"> I agree to download this model and let this page use my device to run it. My choice is remembered on this device.</label>
      <div class="row"><button class="btn solid" type="button" id="bg-ai-on" disabled>Download and use ${esc(m.name)}</button></div>
      <p class="note">Model: <a href="${m.page}" target="_blank" rel="noopener">${esc(m.name)}</a>, ${esc(m.license)} license. It runs with ONNX Runtime Web and downloads from Hugging Face. Your picture is not uploaded anywhere.</p>`;
    else if (!BGAI.got[id]) h += `<p>${esc(ui.msg || 'This model is not downloaded yet.')}</p><div class="row"><button class="btn solid" type="button" id="bg-ai-dl">Download ${esc(m.name)}, ${m.mib} MiB</button></div>`;
    else { activeShown = true; h += `<p id="bg-ai-st" role="status">${esc(ui.msg || (orig ? 'Ready.' : 'Ready. Choose an image and the model runs on it automatically.'))}</p><div class="row"><button class="btn" type="button" id="bg-ai-free">Free memory now</button><button class="btn" type="button" id="bg-ai-rm">Remove model</button></div><p class="note">Using ${esc(m.name)}, ${m.mib} MiB. Pick No model above to stop using it. Remove model also deletes the downloaded files from this browser.</p>` }
    const have = Object.keys(M).filter(k => BGAI.got[k] && !(activeShown && k === id));
    if (!busy && have.length) h += `<h3>Downloaded on this device</h3><ul class="bg-ai-list">${have.map(k => `<li>${esc(M[k].name)}, ${M[k].mib} MiB <button class="btn sm" type="button" data-rm="${k}" aria-label="Remove ${esc(M[k].name)} from this device">Remove</button></li>`).join('')}</ul>`;
    const issue = kind => {
      const f = bgaiFix(kind, ui.br), open = !!ui.open[kind];
      return `<div class="bg-issue" role="group" aria-labelledby="bg-is-${kind}"><h3 id="bg-is-${kind}">${esc(f.title)}</h3><p>${esc(f.text)}</p><div class="row"><button class="btn" type="button" data-help="${kind}" aria-expanded="${open}" aria-controls="bg-fix-${kind}">${open ? 'Hide the steps' : 'Show me how to fix this'}</button>${f.copy ? `<button class="btn" type="button" data-copy="${esc(f.copy.value)}">${esc(f.copy.label)}</button>` : ''}</div>
      <div id="bg-fix-${kind}" ${open ? '' : 'hidden'}>${kind === 'gpu' ? `<label class="f"><span class="f-t">Your browser</span><select id="bg-ai-br" data-browser="${kind}">${Object.keys(BGAI_BROWSERS).map(k => `<option value="${k}" ${k === ui.br ? 'selected' : ''}>${BGAI_BROWSERS[k]}</option>`).join('')}</select></label>` : ''}<ol class="bg-ai-list">${f.steps.map(x => `<li>${esc(x)}</li>`).join('')}</ol>${f.note ? `<p class="note">${esc(f.note)}${f.copy ? ' Address: <code>' + esc(f.copy.value) + '</code>' : ''}</p>` : ''}</div></div>`;
    };
    if (!busy) {
      const kinds = []; if (caps.gpuOff) kinds.push('gpu'); if (BGAI.inline) kinds.push('worker');
      if (ui.phase === 'err') { const k = bgaiClassify(ui.msg); if (!kinds.includes(k)) kinds.push(k) }
      h += kinds.map(issue).join('');
    }
    aiBox.innerHTML = h;
    const on = (q, fn) => { const b = $(q, aiBox); if (b) b.onclick = fn };
    const pk = $('#bg-ai-sel', aiBox); if (pk) pk.onchange = () => selectModel(pk.value);
    $$('[data-help]', aiBox).forEach(b => b.onclick = () => { const k = b.dataset.help; ui.open[k] = !ui.open[k]; $('#bg-fix-' + k, aiBox).hidden = !ui.open[k]; b.setAttribute('aria-expanded', String(ui.open[k])); b.textContent = ui.open[k] ? 'Hide the steps' : 'Show me how to fix this' });
    $$('[data-copy]', aiBox).forEach(b => b.onclick = async () => { let done = false; try { await navigator.clipboard.writeText(b.dataset.copy); done = true } catch { } if (typeof toast === 'function') toast(done ? 'Copied.' : 'Could not copy. Select the text in the steps and copy it.') });
    const bs = $('#bg-ai-br', aiBox); if (bs) bs.onchange = () => { ui.br = bs.value; drawAi('#bg-ai-br') };
    const ok = $('#bg-ai-ok', aiBox); if (ok) ok.onchange = () => { $('#bg-ai-on', aiBox).disabled = !ok.checked };
    on('#bg-ai-on', () => { BGAI.agreed[id] = true; BGAI.model = id; runAi() });
    on('#bg-ai-dl', () => { BGAI.model = id; runAi() });
    on('#bg-ai-free', () => { bgaiFree(); setPhase('idle', 'Memory freed. The next cut-out reloads the model from your browser cache.', '#bg-ai-h') });
    on('#bg-ai-rm', () => rmModel(id));
    $$('[data-rm]', aiBox).forEach(b => b.onclick = () => rmModel(b.dataset.rm));
    on('#bg-ai-newimg', () => { resetImage(); setPhase('idle', '', '#bg-up') });
    on('#bg-ai-cancel', () => { ui.cancelled = true; bgaiFree('cancelled') });
    on('#bg-ai-retry', () => runAi());
    gate();
    if (focus) { const t = $(focus, aiBox); if (t) t.focus() }
  };
  const runAi = async () => {
    const id = BGAI.model;
    if (ui.busy || id === 'none') return;
    let mine = orig, where = BGAI.got[id] ? 'image' : 'download'; const t0 = Date.now(), gen = ++ui.gen; ui.busy = true; ui.cancelled = false; ui.sel = id; ui.where = '';
    ui.pct = 0; setPhase('work', where === 'download' ? 'Starting the download...' : 'Preparing the model on your device...');
    const stage = s => {
      if (!aiBox.isConnected) return;
      if (s.stage === 'download') { const f = s.total ? s.loaded / s.total : 0; prog(85 * f, `Downloading the model: ${(s.loaded / 1048576).toFixed(1)} of ${(s.total / 1048576).toFixed(1)} MiB`) }
      else if (s.stage === 'prepare') prog(ui.pct > 0 ? 90 : 50, 'Preparing the model on your device...');
      else prog(95, 'Removing the background from your picture. You can edit it as soon as it is done...');
    };
    try {
      await bgaiEnsure(id, stage);
      if (gen !== ui.gen) return;
      BGAI.got[id] = true; where = 'image'; mine = orig;
      if (!mine) return setPhase('idle', 'Downloaded. Choose an image and the model runs on it before you can edit.');
      const m = await bgaiRun(id, mine, stage);
      if (gen !== ui.gen || orig !== mine) return;
      if (m.length !== W * H) throw new Error('The result did not match the picture.');
      aiMask = m; aiFor = id; $('#bg-work', el).hidden = false; applyAi();
      setPhase('idle', `Done in ${((Date.now() - t0) / 1000).toFixed(1)} s with ${BGAI_MODELS[id].name}.${BGAI.inline ? ' Your browser could not start a background worker, so the page may pause while the model works.' : ''}`);
    } catch (err) {
      if (gen !== ui.gen) return;
      bgaiFree();
      if (aiBox.isConnected) {
        const raw = (err && err.message) || 'unknown error';
        if (ui.cancelled || raw === 'cancelled') { if (orig && !aiMask) resetImage(); setPhase('idle', where === 'download' ? 'Download cancelled. Nothing was kept.' : 'Cancelled. Choose the image again when you are ready.', '#bg-ai-sel') }
        else { ui.where = where; setPhase('err', where === 'download' ? 'The model could not be downloaded: ' + raw + '. Check your connection, then try the download again.' : 'The model could not process this image: ' + raw + '. You can try this image again or choose a different one.', '#bg-ai-h') }
      }
    } finally { if (gen !== ui.gen) return; ui.busy = false; if (ui.again) { ui.again = false; runAi() } }
  };
  const aiAfterLoad = () => {
    if (!(BGAI.model !== 'none' && caps.ok)) return drawAi();
    if (ui.busy) { ui.again = true; bgaiFree('cancelled'); return }
    runAi();
  };
  const gated = () => ui.sel !== 'none' && (!BGAI.got[ui.sel] || ui.phase === 'work' || ui.phase === 'err');
  const gate = () => { const g = gated(); $('#bg-up', el).disabled = g; $('#bg-file', el).disabled = g; $('#bg-gate', el).hidden = !g; if (!g && /^(Download the selected|Wait until)/.test($('#bg-err', el).textContent)) $('#bg-err', el).textContent = '' };
  const load = f => {
    if (gated()) return $('#bg-err', el).textContent = ui.phase === 'work' ? 'Wait until the model has finished.' : 'Download the selected model first, or pick No model.';
    if (!f || !/^image\//.test(f.type)) return $('#bg-err', el).textContent = 'That file is not an image.';
    const u = URL.createObjectURL(f), im = new Image();
    im.onload = () => { const s = Math.min(1, 1600 / Math.max(im.naturalWidth, im.naturalHeight)); W = Math.max(1, Math.round(im.naturalWidth * s)); H = Math.max(1, Math.round(im.naturalHeight * s)); cv.width = W; cv.height = H; cx.clearRect(0, 0, W, H); cx.drawImage(im, 0, 0, W, H); URL.revokeObjectURL(u); orig = cx.getImageData(0, 0, W, H); manual = new Uint8Array(W * H); bgc = sampleBg(); hist = []; hi = -1; commit(); $('#bg-err', el).textContent = ''; $('#bg-drop', el).hidden = true; $('#bg-work', el).hidden = ui.sel !== 'none'; aiMask = null; BGR.mode = 'color'; labels(); redo(); aiAfterLoad() };
    im.onerror = () => $('#bg-err', el).textContent = 'That image could not be opened.'; im.src = u;
  };
  $('#bg-up', el).onclick = () => $('#bg-file', el).click(); $('#bg-file', el).onchange = e => load(e.target.files[0]); $('#bg-new', el).onclick = () => { $('#bg-work', el).hidden = true; $('#bg-drop', el).hidden = false; $('#bg-file', el).value = '' };
  const dz = $('#bg-drop', el); dz.onkeydown = e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); $('#bg-file', el).click() } };
  ['dragover', 'dragenter'].forEach(t => dz.addEventListener(t, e => { e.preventDefault(); dz.classList.add('over') })); ['dragleave', 'drop'].forEach(t => dz.addEventListener(t, () => dz.classList.remove('over'))); dz.addEventListener('drop', e => { e.preventDefault(); load(e.dataTransfer.files[0]) });
  $('#bg-tol', el).oninput = e => { BGR.tol = +e.target.value; labels(); redo() }; $('#bg-f', el).oninput = e => { BGR.feather = +e.target.value; labels(); redo() }; $('#bg-size', document).oninput = e => { BGR.size = +e.target.value; labels(); moveRing() };
  ['#bg-tol', '#bg-f'].forEach(q => $(q, el).addEventListener('change', commit));
  $('#bg-glob', el).onchange = e => { BGR.global = e.target.checked; redo(); commit() };
  $$('[data-br]', document).forEach(b => b.onclick = () => { BGR.brush = b.dataset.br; $$('[data-br]', document).forEach(x => x.setAttribute('aria-checked', x === b)); labels(); cv.style.cursor = BGR.brush === 'none' ? 'crosshair' : 'none'; ring.hidden = true });
  $('#bg-rbrush', document).onclick = () => { BGR.size = 24; $('#bg-size', document).value = 24; labels(); toast('Brush size reset.') };
  $('#bg-undo', document).onclick = undo; $('#bg-redo', document).onclick = redoStep;
  $('#bg-dl', el).onclick = () => cv.toBlob(b => download('background-removed.png', b, 'image/png'), 'image/png');
  const pos = e => { const r = cv.getBoundingClientRect(); return [Math.floor((e.clientX - r.left) * W / r.width), Math.floor((e.clientY - r.top) * H / r.height), W / r.width] };
  const stamp = e => { const [x, y, sc] = pos(e), rad = BGR.size / 2 * sc, v = BGR.brush === 'erase' ? 1 : 2; for (let yy = Math.max(0, Math.floor(y - rad)); yy <= Math.min(H - 1, y + rad); yy++) for (let xx = Math.max(0, Math.floor(x - rad)); xx <= Math.min(W - 1, x + rad); xx++) if ((xx - x) ** 2 + (yy - y) ** 2 <= rad * rad) manual[yy * W + xx] = v; paint() };
  let down = false; cv.onpointerdown = e => { if (!orig) return; if (BGR.brush === 'none') { if (BGR.mode === 'ai') return; const [x, y] = pos(e), k = (Math.min(H - 1, y) * W + Math.min(W - 1, x)) * 4; bgc = [orig.data[k], orig.data[k + 1], orig.data[k + 2]]; redo(); commit(); return } down = true; cv.setPointerCapture(e.pointerId); stamp(e) };
  /* a circle that follows the pointer and matches the brush size */
  $$('.bg-ring').forEach(r => r.remove()); const ring = document.createElement('div'); ring.className = 'bg-ring'; ring.hidden = true; ring.setAttribute('aria-hidden', 'true'); document.body.appendChild(ring);
  let lastEv = null; const moveRing = () => { if (!lastEv || BGR.brush === 'none') { ring.hidden = true; return } ring.hidden = false; ring.dataset.mode = BGR.brush; ring.style.width = ring.style.height = BGR.size + 'px'; ring.style.transform = `translate(${lastEv.clientX - BGR.size / 2}px,${lastEv.clientY - BGR.size / 2}px)` };
  cv.onpointermove = e => { lastEv = e; moveRing(); if (down) stamp(e) }; cv.onpointerenter = e => { lastEv = e; moveRing() }; cv.onpointerleave = () => { lastEv = null; ring.hidden = true };
  const endStroke = () => { if (down) { down = false; commit() } }; cv.onpointerup = endStroke; cv.onpointercancel = endStroke; cv.style.cursor = 'crosshair';
  /* zoomed editor: the same canvas and tool bar move into a near full screen layer */
  const zoomBtn = $('#bg-zoom', el), tools = $('#bg-tools', el), stage = $('#bg-stage', el);
  let ov = null;
  const fit = () => { if (!ov) return; const z = $('.bg-zstage', ov), cs = getComputedStyle(z), aw = z.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight), ah = z.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom), k = Math.min(aw / W, ah / H); cv.style.width = Math.max(40, Math.floor(W * k)) + 'px'; cv.style.height = Math.max(40, Math.floor(H * k)) + 'px' };
  window.addEventListener('resize', fit);
  const closeZoom = () => { if (!ov) return; const mk = $('#bg-mk-c', document); stage.appendChild(cv); const m2 = $('#bg-mk-t', document); m2.replaceWith(tools); mk && mk.remove(); ov.remove(); ov = null; cv.style.width = cv.style.height = ''; document.body.classList.remove('bg-zooming'); zoomBtn.focus(); ring.hidden = true };
  const openZoom = () => {
    if (!orig || ov) return;
    const mt = document.createElement('i'); mt.id = 'bg-mk-t'; mt.hidden = true; tools.replaceWith(mt);
    ov = document.createElement('div'); ov.className = 'bg-zoom'; ov.setAttribute('role', 'dialog'); ov.setAttribute('aria-modal', 'true'); ov.setAttribute('aria-label', 'Zoomed editor');
    ov.innerHTML = '<div class="bg-zbar"><div class="bg-zbar-in"></div><button type="button" class="bg-zx" aria-label="Close zoomed view">×</button></div><div class="bg-zstage"><i id="bg-mk-c" hidden></i></div>';
    $('.bg-zbar-in', ov).appendChild(tools); $('.bg-zstage', ov).appendChild(cv); document.body.appendChild(ov); document.body.classList.add('bg-zooming');
    $('.bg-zx', ov).onclick = closeZoom; ov.addEventListener('pointerdown', e => { if (e.target === ov || e.target.classList.contains('bg-zstage')) closeZoom() });
    fit(); requestAnimationFrame(fit); if (window.ResizeObserver) new ResizeObserver(fit).observe($('.bg-zstage', ov)); $('.bg-zx', ov).focus();
  };
  zoomBtn.onclick = openZoom;
  /* keyboard: undo and redo, plus Escape to leave the zoomed view */
  if (BG_KEYS) document.removeEventListener('keydown', BG_KEYS);
  BG_KEYS = e => {
    if (!document.body.contains(cv)) { document.removeEventListener('keydown', BG_KEYS); BG_KEYS = null; return }
    if (e.key === 'Escape' && ov) { e.preventDefault(); closeZoom(); return }
    if ($('#bg-work', el).hidden) return;
    const t = e.target, typing = t && (t.isContentEditable || t.tagName === 'TEXTAREA' || (t.tagName === 'INPUT' && !['range', 'checkbox', 'radio', 'button'].includes(t.type)));
    if (typing || !(e.ctrlKey || e.metaKey) || e.altKey) return;
    const k = e.key.toLowerCase();
    if (k === 'z' && !e.shiftKey) { e.preventDefault(); undo() } else if ((k === 'z' && e.shiftKey) || k === 'y') { e.preventDefault(); redoStep() }
  };
  document.addEventListener('keydown', BG_KEYS);
  BGAI.onIdle = () => { if (aiBox.isConnected) setPhase('idle', 'Memory freed after a minute without use. The next cut-out reloads the model from your browser cache.') };
  drawAi();
}

/* ---------- Icon creator: draw a pixel icon on a grid ---------- */
const IC_SIZES = [16, 20, 24, 32, 48, 64];
const IC_CELL = { 16: 32, 20: 24, 24: 20, 32: 16, 48: 8, 64: 8 };
const ICO = { size: 24, filled: new Set(), undo: [], tool: 'draw', sym: false, symMode: 'lr', guide: true, name: '' };
const icKey = (r, c) => r + ',' + c;
const icName = () => (ICO.name || '').trim();
const icStem = () => icName().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
const icSvg = (withId) => {
  const n = ICO.size, out = [];
  for (let r = 0; r < n; r++) {
    let c = 0;
    while (c < n) {
      if (ICO.filled.has(icKey(r, c))) { let e = c; while (e < n && ICO.filled.has(icKey(r, e))) e++; out.push(`<rect x="${c}" y="${r}" width="${e - c}" height="1"/>`); c = e } else c++
    }
  }
  return out.length ? `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${n} ${n}" fill="currentColor" shape-rendering="crispEdges"${withId ? ` id="${icStem()}-icon"` : ''}>${out.join('')}</svg>` : '';
};
/* Drawing helpers. A drawing is a Set of "row,col" keys. */
const icBox = set => { let r0 = 1e9, r1 = -1, c0 = 1e9, c1 = -1; for (const k of set) { const [r, c] = k.split(',').map(Number); if (r < r0) r0 = r; if (r > r1) r1 = r; if (c < c0) c0 = c; if (c > c1) c1 = c } return r1 < 0 ? null : { r0, r1, c0, c1 } };
/* Stretch the cells inside box sb into a w by h block at (r0, c0). A target cell is filled when at least half of the source area behind it is filled; if that would erase everything (a big shrink of thin lines), any filled area counts. */
const icResample = (cells, sb, r0, c0, w, h) => {
  const sw = sb.c1 - sb.c0 + 1, sh = sb.r1 - sb.r0 + 1, cov = [];
  for (let r = 0; r < h; r++) for (let c = 0; c < w; c++) {
    const y0 = sb.r0 + r * sh / h, y1 = sb.r0 + (r + 1) * sh / h, x0 = sb.c0 + c * sw / w, x1 = sb.c0 + (c + 1) * sw / w; let on = 0, tot = 0;
    for (let y = Math.floor(y0); y < Math.ceil(y1); y++) for (let x = Math.floor(x0); x < Math.ceil(x1); x++) { const a = (Math.min(y + 1, y1) - Math.max(y, y0)) * (Math.min(x + 1, x1) - Math.max(x, x0)); tot += a; if (cells.has(icKey(y, x))) on += a }
    cov.push([r, c, tot ? on / tot : 0]);
  }
  let out = cov.filter(x => x[2] >= 0.5); if (!out.length && cells.size) out = cov.filter(x => x[2] > 0);
  return new Set(out.map(x => icKey(r0 + x[0], c0 + x[1])));
};
const IC_ICO = (d) => `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
const IC_ICONS = {
  draw: IC_ICO('<path d="M4 20l1-4L16 5l3 3L8 19z"/><path d="M14 7l3 3"/>'),
  erase: IC_ICO('<path d="M20 20H9L4 15a2 2 0 010-3l8-8a2 2 0 013 0l5 5a2 2 0 010 3l-7 8"/><path d="M8 8l8 8"/>'),
  move: IC_ICO('<path d="M12 3v18M3 12h18M12 3l-3 3M12 3l3 3M12 21l-3-3M12 21l3-3M3 12l3-3M3 12l3 3M21 12l-3-3M21 12l-3 3"/>'),
  sym: IC_ICO('<path d="M12 3v18" stroke-dasharray="2 3"/><path d="M9 7L4 12l5 5z"/><path d="M15 7l5 5-5 5z"/>'),
  guide: IC_ICO('<rect x="4" y="4" width="16" height="16" rx="1" stroke-dasharray="3 2"/><path d="M12 4v16M4 12h16"/>'),
  resize: IC_ICO('<path d="M14 4h6v6M10 20H4v-6M20 4l-7 7M4 20l7-7"/>')
};
function renderIconCreator(el) {
  const tbtn = (id, label) => `<button type="button" class="btn ic-tool" data-tool="${id}" aria-pressed="${ICO.tool === id}">${IC_ICONS[id]}<span>${label}</span></button>`;
  el.innerHTML = `<p class="lede">Draw an icon on a grid, name it, then export it as SVG or add it to a design system. Pick a tool, then click or drag on the grid. Right-click also erases. The exported SVG uses one merged <code>&lt;rect&gt;</code> per row run and <code>currentColor</code>, like the icons in Browse.</p>
  <div class="ic-tools" role="toolbar" aria-label="Drawing tools">
    <div class="ic-toolgrp" role="group" aria-label="Tool">${tbtn('draw', 'Draw')}${tbtn('erase', 'Eraser')}${tbtn('move', 'Move')}</div>
    <div class="ic-toolgrp">
      <button type="button" class="btn ic-tool" id="ic-sym" aria-pressed="${ICO.sym}">${IC_ICONS.sym}<span>Symmetry</span></button>
      <span class="ic-symmode" id="ic-symmode" role="group" aria-label="Mirror direction" ${ICO.sym ? '' : 'hidden'}>${[['lr', 'Left and right'], ['ud', 'Up and down'], ['both', 'Both']].map(([k, l]) => `<button type="button" class="btn ic-tool sm" data-sym="${k}" aria-pressed="${ICO.symMode === k}">${l}</button>`).join('')}</span>
    </div>
    <div class="ic-toolgrp"><button type="button" class="btn ic-tool" id="ic-guide" aria-pressed="${ICO.guide}">${IC_ICONS.guide}<span>Show guide</span></button></div>
  </div>
  <p class="note ic-hint" id="ic-hint"></p>
  <div class="row ic-bar">
    <label class="f"><span class="f-t">Grid size</span><select id="ic-size" aria-label="Grid size">${IC_SIZES.map(n => `<option value="${n}" ${n === ICO.size ? 'selected' : ''}>${n} × ${n}</option>`).join('')}</select></label>
    <button class="btn" id="ic-resize-btn" type="button">${IC_ICONS.resize}<span>Resize drawing</span></button>
    <button class="btn" id="ic-clear" type="button">Clear</button>
    <button class="btn" id="ic-undo" type="button" disabled>Undo</button>
  </div>
  <div class="panel ic-resize" id="ic-resize" hidden>
    <h2 style="font-size:16px;margin:0 0 4px">Resize drawing</h2>
    <p class="note" id="ic-rs-now" style="margin:0 0 8px"></p>
    <div class="row" style="align-items:end"><label class="f"><span class="f-t">Width: <output id="ic-rw-v"></output> cells</span><input type="range" id="ic-rw" min="1" step="1"></label><label class="f"><span class="f-t">Height: <output id="ic-rh-v"></output> cells</span><input type="range" id="ic-rh" min="1" step="1"></label><label class="chk ic-chk"><input type="checkbox" id="ic-rk" checked> Keep proportions</label></div>
    <div class="row" style="margin:8px 0 0"><button class="btn solid" id="ic-rs-ok" type="button">Apply</button><button class="btn" id="ic-rs-cancel" type="button">Cancel</button></div>
  </div>
  <div class="ic-gridwrap"><div class="ic-grid" id="ic-grid" role="group" aria-label="Icon grid. Use the arrow keys to move between cells, Space or Enter to toggle a cell. With the Move tool, the arrow keys move the drawing."></div>
    <div class="ic-guide" id="ic-guide-lines" aria-hidden="true" ${ICO.guide ? '' : 'hidden'}><span class="ic-live"></span><span class="ic-ch"></span><span class="ic-cv"></span></div></div>
  <ul class="ic-list panel" aria-label="Icon drawing guidelines">
    <li>Keep a live-area margin of about 1/12 of the grid (2px on a 24px grid). The Show guide button shows the boundary and center lines.</li>
    <li>One idea per icon.</li>
    <li>Keep the stroke or fill weight consistent.</li>
    <li>Simple shapes and little detail, especially at small sizes.</li>
    <li>Check the icon at 16px before shipping.</li>
    <li>The icon size is not the tap target. Aim for 44px (iOS) or 48px (Android) touch areas.</li>
  </ul>
  <p class="note"><a href="#/guide/icon-types">Read the full icon types guide</a> for styles, grids and libraries.</p>
  <div class="f ic-name"><label class="f-t" for="ic-name">Icon name</label><input type="text" id="ic-name" maxlength="40" autocomplete="off" spellcheck="false" value="${esc(ICO.name)}" aria-describedby="ic-name-err"><code id="ic-file" class="ic-file"></code><p class="ct-err" id="ic-name-err" role="alert"></p></div>
  <div class="row ic-bar"><button class="btn solid" id="ic-copy" type="button">Copy SVG</button><button class="btn" id="ic-dl" type="button">Download .svg</button></div>
  <div class="panel addrow"><h2 style="font-size:16px;margin:0 0 8px">Add to a design system</h2><div class="row" style="margin:0;align-items:end"><label class="f" style="min-width:220px"><span class="f-t">Design system</span><select id="ic-sys" aria-label="Design system to add the icon to">${sysOptions()}</select></label><button class="btn solid" id="ic-add" type="button">Add to design system</button><span class="empty" id="ic-sys-msg" role="status"></span></div><p class="note" style="margin:8px 0 0">Custom icons are added with the name, a <code>Custom</code> set and <code>Pixel</code> style. They are written into the exported zip under <code>icons/</code> like any other icon.</p></div>`;
  const grid = $('#ic-grid', el), guide = $('#ic-guide-lines', el), nameIn = $('#ic-name', el), err = $('#ic-name-err', el), fileOut = $('#ic-file', el), undoBtn = $('#ic-undo', el), sizeSel = $('#ic-size', el), panel = $('#ic-resize', el);
  const cellPx = () => IC_CELL[ICO.size];
  const buildGrid = () => {
    const n = ICO.size, s = cellPx();
    grid.style.gridTemplateColumns = `repeat(${n}, ${s}px)`;
    guide.style.setProperty('--m', Math.max(2, Math.round(n / 12)) * s + 'px');
    grid.innerHTML = '';
    for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) {
      const b = document.createElement('button');
      b.type = 'button'; b.className = 'ic-cell'; b.dataset.r = r; b.dataset.c = c;
      b.style.width = b.style.height = s + 'px';
      b.setAttribute('aria-pressed', 'false');
      b.setAttribute('aria-label', `Row ${r + 1}, column ${c + 1}, empty`);
      b.tabIndex = (r === 0 && c === 0) ? 0 : -1;
      grid.appendChild(b);
    }
    paintAll();
  };
  const cellBtn = (r, c) => grid.children[r * ICO.size + c];
  const setCell = (b, on) => { b.classList.toggle('on', on); b.setAttribute('aria-pressed', on ? 'true' : 'false'); b.setAttribute('aria-label', `Row ${+b.dataset.r + 1}, column ${+b.dataset.c + 1}, ${on ? 'filled' : 'empty'}`) };
  const paintAll = () => { for (let r = 0; r < ICO.size; r++) for (let c = 0; c < ICO.size; c++) setCell(cellBtn(r, c), ICO.filled.has(icKey(r, c))) };
  /* Undo keeps the grid size with each step, so undoing a size change or resize brings the old drawing back. */
  const commit = () => { ICO.undo.push({ n: ICO.size, cells: Array.from(ICO.filled) }); if (ICO.undo.length > 30) ICO.undo.shift(); undoBtn.disabled = false };
  const setSize = (n) => { ICO.size = n; if (+sizeSel.value !== n) { sizeSel.value = String(n); sizeSel.dispatchEvent(new Event('change')) } buildGrid() };
  const cellAt = ev => { const t = document.elementFromPoint(ev.clientX, ev.clientY), b = t && t.closest && t.closest('.ic-cell'); return b && grid.contains(b) ? [+b.dataset.r, +b.dataset.c] : null };
  /* Symmetry: every change is also made at the mirrored cells. */
  const mirrors = (r, c) => { const n = ICO.size, out = [[r, c]]; if (!ICO.sym) return out; const lr = ICO.symMode !== 'ud', ud = ICO.symMode !== 'lr'; if (lr) out.push([r, n - 1 - c]); if (ud) out.push([n - 1 - r, c]); if (lr && ud) out.push([n - 1 - r, n - 1 - c]); return out };
  const put = (r, c, on) => mirrors(r, c).forEach(([y, x]) => { const k = icKey(y, x); if (on) ICO.filled.add(k); else ICO.filled.delete(k); setCell(cellBtn(y, x), on) });
  const hints = { draw: 'Click or drag to fill cells. Click a filled cell to clear it.', erase: 'Click or drag to clear cells.', move: 'Drag the drawing to move it, or press the arrow keys. It stops at the edges so nothing is lost.' };
  const syncTools = () => {
    $$('[data-tool]', el).forEach(b => b.setAttribute('aria-pressed', String(b.dataset.tool === ICO.tool)));
    $('#ic-sym', el).setAttribute('aria-pressed', String(ICO.sym)); $('#ic-symmode', el).hidden = !ICO.sym;
    $$('[data-sym]', el).forEach(b => b.setAttribute('aria-pressed', String(b.dataset.sym === ICO.symMode)));
    $('#ic-hint', el).textContent = hints[ICO.tool] + (ICO.sym && ICO.tool !== 'move' ? ' Symmetry is on: changes are mirrored.' : '');
    grid.dataset.tool = ICO.tool;
  };
  const resizing = () => !panel.hidden;
  grid.addEventListener('contextmenu', e => e.preventDefault());
  let scrub = null, mv = null;
  const shift = (base, dr, dc) => new Set(Array.from(base, k => { const [r, c] = k.split(',').map(Number); return icKey(r + dr, c + dc) }));
  const moveBy = (base, box, dr, dc) => { const n = ICO.size; dr = Math.max(-box.r0, Math.min(n - 1 - box.r1, dr)); dc = Math.max(-box.c0, Math.min(n - 1 - box.c1, dc)); return [dr, dc] };
  grid.addEventListener('pointerdown', e => {
    if (resizing()) return; const p = cellAt(e); if (!p) return;
    if (ICO.tool === 'move' && e.button !== 2) { const box = icBox(ICO.filled); if (!box) return; mv = { start: p, base: new Set(ICO.filled), box, last: [0, 0], committed: false }; grid.setPointerCapture(e.pointerId); e.preventDefault(); return }
    commit();
    scrub = (ICO.tool === 'erase' || e.button === 2) ? 'erase' : (ICO.filled.has(icKey(p[0], p[1])) ? 'erase' : 'fill');
    put(p[0], p[1], scrub === 'fill');
    grid.setPointerCapture(e.pointerId); e.preventDefault();
  });
  grid.addEventListener('pointermove', e => {
    if (mv) { const p = cellAt(e); if (!p) return; const [dr, dc] = moveBy(mv.base, mv.box, p[0] - mv.start[0], p[1] - mv.start[1]); if (dr === mv.last[0] && dc === mv.last[1]) return; if (!mv.committed) { ICO.undo.push({ n: ICO.size, cells: Array.from(mv.base) }); undoBtn.disabled = false; mv.committed = true } mv.last = [dr, dc]; ICO.filled = shift(mv.base, dr, dc); paintAll(); return }
    if (!scrub) return;
    const p = cellAt(e); if (!p) return;
    const on = scrub === 'fill'; if (on === ICO.filled.has(icKey(p[0], p[1])) && mirrors(p[0], p[1]).every(([y, x]) => on === ICO.filled.has(icKey(y, x)))) return;
    put(p[0], p[1], on);
  });
  const endScrub = () => { scrub = null; mv = null };
  grid.addEventListener('pointerup', endScrub); grid.addEventListener('pointercancel', endScrub);
  grid.addEventListener('keydown', e => {
    if (resizing()) return; const t = e.target.closest('.ic-cell'); if (!t) return;
    let r = +t.dataset.r, c = +t.dataset.c;
    const moves = { ArrowUp: [-1, 0], ArrowDown: [1, 0], ArrowLeft: [0, -1], ArrowRight: [0, 1] };
    if (moves[e.key] && ICO.tool === 'move') { e.preventDefault(); const box = icBox(ICO.filled); if (!box) return; const [dr, dc] = moveBy(ICO.filled, box, moves[e.key][0], moves[e.key][1]); if (!dr && !dc) return; commit(); ICO.filled = shift(ICO.filled, dr, dc); paintAll(); return }
    if (moves[e.key]) { e.preventDefault(); const mvd = moves[e.key], n = ICO.size; r = Math.min(n - 1, Math.max(0, r + mvd[0])); c = Math.min(n - 1, Math.max(0, c + mvd[1])); t.tabIndex = -1; const nb = cellBtn(r, c); nb.tabIndex = 0; nb.focus(); return }
    if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); if (ICO.tool === 'move') return; commit(); const k = icKey(r, c); put(r, c, ICO.tool === 'erase' ? false : !ICO.filled.has(k)) }
  });
  $$('[data-tool]', el).forEach(b => b.onclick = () => { ICO.tool = b.dataset.tool; syncTools() });
  $('#ic-sym', el).onclick = () => { ICO.sym = !ICO.sym; syncTools() };
  $$('[data-sym]', el).forEach(b => b.onclick = () => { ICO.symMode = b.dataset.sym; syncTools() });
  $('#ic-guide', el).onclick = e => { ICO.guide = !ICO.guide; e.currentTarget.setAttribute('aria-pressed', String(ICO.guide)); guide.hidden = !ICO.guide };
  $('#ic-clear', el).onclick = () => { if (resizing()) return; if (!ICO.filled.size) return toast('The grid is already empty.'); commit(); ICO.filled.clear(); paintAll() };
  $('#ic-undo', el).onclick = () => { if (resizing() || !ICO.undo.length) return; const u = ICO.undo.pop(); if (u.n !== ICO.size) setSize(u.n); ICO.filled = new Set(u.cells); paintAll(); undoBtn.disabled = !ICO.undo.length };
  /* Changing the grid size keeps the drawing: it is scaled to the new grid (and Undo brings the old one back). */
  sizeSel.addEventListener('change', e => {
    const n = +e.target.value; if (n === ICO.size) return;
    if (resizing()) { e.target.value = String(ICO.size); return }
    if (ICO.filled.size) { commit(); const old = ICO.size; ICO.size = n; ICO.filled = icResample(ICO.filled, { r0: 0, c0: 0, r1: old - 1, c1: old - 1 }, 0, 0, n, n); toast(`Drawing scaled to ${n} × ${n}. Undo brings the old one back.`) }
    else ICO.size = n;
    buildGrid();
  });
  /* Resize drawing: stretch what is drawn (its bounding box) and preview it live on the grid. */
  let rs = null;
  const rsApply = () => {
    const w = +$('#ic-rw', el).value, h = +$('#ic-rh', el).value, n = ICO.size; $('#ic-rw-v', el).textContent = w; $('#ic-rh-v', el).textContent = h;
    const r0 = Math.min(rs.box.r0, n - h), c0 = Math.min(rs.box.c0, n - w);
    ICO.filled = icResample(rs.base, rs.box, r0, c0, w, h); paintAll();
  };
  const rsClose = (keep) => {
    if (!rs) return; if (!keep) { ICO.filled = rs.base; paintAll() } else { ICO.undo.push({ n: ICO.size, cells: Array.from(rs.base) }); if (ICO.undo.length > 30) ICO.undo.shift() }
    rs = null; panel.hidden = true; undoBtn.disabled = !ICO.undo.length; $('#ic-resize-btn', el).focus();
  };
  $('#ic-resize-btn', el).onclick = () => {
    if (resizing()) return rsClose(false); const box = icBox(ICO.filled); if (!box) return toast('Draw something first, then resize it.');
    const bw = box.c1 - box.c0 + 1, bh = box.r1 - box.r0 + 1; rs = { base: new Set(ICO.filled), box, ratio: bh / bw };
    $('#ic-rs-now', el).textContent = `Your drawing is ${bw} × ${bh} cells on a ${ICO.size} × ${ICO.size} grid. Move the sliders to stretch it; the grid shows the result.`;
    for (const id of ['#ic-rw', '#ic-rh']) { const i = $(id, el); i.max = ICO.size; i.value = id === '#ic-rw' ? bw : bh }
    panel.hidden = false; rsApply(); $('#ic-rw', el).focus();
  };
  $('#ic-rw', el).oninput = () => { if (rs && $('#ic-rk', el).checked) { let w = +$('#ic-rw', el).value, h = Math.round(w * rs.ratio); if (h > ICO.size) { h = ICO.size; w = Math.max(1, Math.round(h / rs.ratio)); $('#ic-rw', el).value = w } $('#ic-rh', el).value = Math.max(1, h) } rsApply() };
  $('#ic-rh', el).oninput = () => { if (rs && $('#ic-rk', el).checked) { let h = +$('#ic-rh', el).value, w = Math.round(h / rs.ratio); if (w > ICO.size) { w = ICO.size; h = Math.max(1, Math.round(w * rs.ratio)); $('#ic-rh', el).value = h } $('#ic-rw', el).value = Math.max(1, w) } rsApply() };
  $('#ic-rs-ok', el).onclick = () => rsClose(true); $('#ic-rs-cancel', el).onclick = () => rsClose(false);
  panel.addEventListener('keydown', e => { if (e.key === 'Escape') rsClose(false) });
  const nameState = () => {
    const n = icName(); fileOut.textContent = (icStem() || 'name') + '-icon.svg';
    let msg = '';
    if (!n) msg = 'Enter a name for the icon. The name is required before you can export.';
    else if (n.length > 40) msg = 'Keep the name to 40 characters or fewer.';
    else if (!/^[A-Za-z0-9 -]+$/.test(n)) msg = 'Use only letters, numbers, spaces and hyphens.';
    err.textContent = msg; nameIn.setAttribute('aria-invalid', msg ? 'true' : 'false');
    return !msg;
  };
  nameIn.addEventListener('input', () => { ICO.name = nameIn.value; nameState() });
  const exportReady = () => { if (resizing()) { toast('Apply or cancel the resize first.'); return false } if (!nameState()) { nameIn.focus(); return false } if (!ICO.filled.size) { toast('Draw something on the grid first.'); return false } return true };
  $('#ic-copy', el).onclick = async () => { if (!exportReady()) return; await copy(icSvg(true), (icStem() || 'icon') + '-icon.svg') };
  $('#ic-dl', el).onclick = () => { if (!exportReady()) return; download(icStem() + '-icon.svg', icSvg(true), 'image/svg+xml') };
  $('#ic-add', el).onclick = async () => {
    if (!exportReady()) return;
    const sel = $('#ic-sys', el);
    let s;
    if (sel.value === '__new') { const n = await ask({ title: 'Name your design system', input: { label: 'Name', value: 'My design system' }, confirm: 'Create' }); if (!n) return; s = newSystem({ name: n }); S.systems.push(s) }
    else s = S.systems.find(x => x.id === sel.value);
    if (!s) return toast('Pick a design system first.');
    s.icons = s.icons || [];
    if (s.icons.some(x => x.name === icName())) return toast('This system already has an icon with that name.');
    s.icons.push({ id: uid(), name: icName(), setId: 'custom', set: 'Custom', style: 'Pixel', svg: icSvg() });
    S.last = s.id; S.active = s.id; saveStore();
    $('#ic-sys-msg', el).innerHTML = `${CHECK} Added to ${esc(s.name)}. <a href="#/systems">Open it</a>`;
    toast('Added to ' + s.name);
  };
  undoBtn.disabled = !ICO.undo.length;
  buildGrid(); syncTools(); upgradeSelects(el); nameState();
}

const TOOL_RENDER = { contrast: renderContrast, randomizer: renderRandomizer, cvd: renderCvd, lorem: renderLorem, persona: renderPersona, convert: renderConvert, bgremove: renderBgRemove, units: renderUnits, iconcreator: renderIconCreator };
