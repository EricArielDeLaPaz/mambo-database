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
const FIRST = 'Aaliyah Aiden Amara Andre Anika Aria Arjun Ava Ayesha Benjamin Bianca Camila Carlos Chen Chloe Daniel Deja Diego Dmitri Elena Eli Emeka Emma Esperanza Ethan Fatima Felix Freya Gabriel Grace Hana Hassan Hiro Imani Isabella Ivan Jamal Jasmine Javier Jin Joaquin Kai Kamala Kenji Keisha Lars Layla Leila Leo Liam Lina Lucas Luna Malik Marcus Maya Mei Mateo Mina Mohammed Nadia Naomi Nia Noah Nora Olivia Omar Priya Rafael Rahul Ravi Rosa Ruth Sakura Samir Sana Santiago Sara Sofia Soren Tariq Tessa Thandi Theo Tomas Valentina Wei Xavier Yara Yuki Zainab Zane Zara Zoe'.split(' ');
const LAST = 'Abara Adeyemi Ahmed Alvarez Andersson Banerjee Bauer Bennett Brooks Castillo Chang Chavez Chowdhury Clarke Costa Cruz Dang Diaz Dubois Edwards Fernandez Fischer Flores Foster Garcia Gonzalez Gupta Hamidi Hansen Haruna Hernandez Hoang Hughes Ibrahim Ivanov Jackson Jensen Johansson Kapoor Kaur Khan Kim Kowalski Kumar Lee Lopez Mahmoud Martin Martinez Mbeki Mendoza Miller Mitchell Moreau Morales Murphy Nakamura Nguyen Novak Nowak Okafor Okoye Olsen Ortiz Osei Park Patel Perez Petrov Phillips Popov Ramirez Reyes Rivera Robinson Rossi Russo Saito Sanchez Santos Schmidt Sharma Silva Singh Smith Suzuki Tanaka Taylor Thompson Torres Tran Varga Vasquez Wang Watanabe Williams Wilson Wong Yamamoto Yilmaz Young Zhang Zhou'.split(' ');
const PERSONA = { n: 6, style: '', list: [] };
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
  el.innerHTML = `<p class="lede">Random first and last names with profile pictures, for personas, mockups and user-research boards. The pictures come from the <a href="#/browse/profile">Profiles</a> collection in Browse, so pick a style to match. Hover (or tab to) a picture to download or copy it. The pictures are CC0 (public domain): photos of real people (Realistic), cartoon illustrations and hand-drawn style pictures. No credit is required for any of them. Names are random combinations, so any match with a real person is a coincidence.</p>
  <div class="row" style="align-items:end"><label class="f"><span class="f-t">Style</span><select id="pe-style" aria-label="Profile picture style"><option value="">All styles</option>${styles.map(x => `<option ${x === PERSONA.style ? 'selected' : ''}>${esc(x)}</option>`).join('')}</select></label>
  <label class="f"><span class="f-t">How many</span><input type="number" id="pe-n" min="1" max="${MAXN}" step="1" inputmode="numeric" value="${PERSONA.n}" aria-describedby="pe-note"></label><button class="btn solid" id="pe-go" type="button">Generate again</button><button class="btn" id="pe-copyall" type="button">Copy all names</button></div>
  <p class="note" id="pe-note" role="status"></p>
  <ul class="persona-grid" id="pe-grid" aria-label="Personas"></ul>`;
  const note = () => { const pool = profPool().length, raw = parseInt($('#pe-n', el).value, 10); $('#pe-note', el).textContent = !raw || raw < 1 ? `Enter a number from 1 to ${MAXN}.` : raw > MAXN ? `The most at once is ${MAXN}. Showing ${MAXN}.` : raw > pool ? `This style has ${pool} pictures, so some will repeat. Choose All styles for more variety.` : `Pick any number from 1 to ${MAXN}. ${pool} pictures are available in ${PERSONA.style ? 'the ' + PERSONA.style + ' style' : 'all styles'}. Realistic photos are not in Profiles yet.` };
  const draw = () => {
    $('#pe-grid', el).innerHTML = PERSONA.list.map((p, i) => `<li class="persona"><div class="pav"><div class="pimg"><img src="${svgUri(p.e.svg)}" alt="Profile picture for ${esc(p.first)} ${esc(p.last)}" width="200" height="200" loading="lazy"></div><div class="pover"><button class="btn sm" data-dl="png" data-i="${i}" type="button">Download PNG</button><button class="btn sm" data-cpimg="${i}" type="button">Copy image</button></div></div>
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
const CVS = { text: '#1d4ed8\n#16a34a\n#dc2626\n#f59e0b\n#7c3aed\n#0a0a0a', tab: 'palette' };
function parseColorList(text) {
  return text.split(/\n|;/).map(l => l.trim()).filter(Boolean).map((l, i) => { const m = l.match(/^(.*?)[:=]\s*(.+)$/), nm = m ? m[1].trim() : '', hex = parseColor(m ? m[2] : l); return hex ? { name: nm || fmtColor(hex), hex } : null }).filter(Boolean).slice(0, 12);
}
function renderCvd(el) {
  el.innerHTML = `<p class="lede">About 1 in 12 men and 1 in 200 women have some form of color blindness. See how colors and pictures look with each type, and find color pairs that could be confused. These are close estimates, not medical tests.</p>
  <div class="seg-row"><div class="seg" role="radiogroup" aria-label="What to check">${[['palette', 'Colors'], ['image', 'An image']].map(([k, l]) => `<button type="button" role="radio" aria-checked="${CVS.tab === k}" data-cvt="${k}">${l}</button>`).join('')}</div></div><div id="cvd-body"></div>`;
  $$('[data-cvt]', el).forEach(b => b.onclick = () => { CVS.tab = b.dataset.cvt; renderCvd(el) });
  const body = $('#cvd-body', el);
  if (CVS.tab === 'palette') {
    body.innerHTML = `<div class="cvd-in"><label class="f"><span class="f-t">Your colors, one per line (any format; add a name like <code>Primary: #1d4ed8</code>)</span><textarea id="cv-t" rows="7" spellcheck="false">${esc(CVS.text)}</textarea></label>
    <div><label class="f"><span class="f-t">Or load from a design system</span><select id="cv-sys" aria-label="Load colors from a design system"><option value="">Choose one</option>${S.systems.map(s => `<option value="${s.id}">${esc(s.name)}</option>`).join('')}</select></label>${cfmtSelect()}</div></div><div id="cv-out"></div>`;
    const upd = () => {
      const cols = parseColorList($('#cv-t', body).value); CVS.text = $('#cv-t', body).value;
      $('#cv-out', body).innerHTML = cols.length ? `<div class="tscroll"><table class="cvd-t"><caption class="sr">Colors as seen with each type of color blindness</caption><thead><tr><th scope="col">Color</th><th scope="col">Normal vision</th>${Object.keys(CVD).map(k => `<th scope="col">${CVD[k].label}<small>${CVD[k].about}</small></th>`).join('')}</tr></thead><tbody>${cols.map(c => `<tr><th scope="row">${esc(c.name)}</th><td><i class="cv-sw" style="background:${c.hex}"></i><code>${esc(fmtColor(c.hex))}</code></td>${Object.keys(CVD).map(k => { const h = simHex(c.hex, k); return `<td><i class="cv-sw" style="background:${h}"></i><code>${esc(fmtColor(h))}</code></td>` }).join('')}</tr>`).join('')}</tbody></table></div>${cvdNotice(cols)}<p class="note">A pair is flagged when two colors look clearly different normally but become close for a type of color blindness. Protanopia and deuteranopia (red-green) are the most common; tritanopia and achromatopsia are rare.</p>` : '<p class="empty">Add at least two colors to check.</p>';
    };
    $('#cv-t', body).oninput = upd; $('#cv-sys', body).addEventListener('change', e => { const s = S.systems.find(x => x.id === e.target.value); if (s) { $('#cv-t', body).value = s.colors.map(c => c.name + ': ' + c.hex).join('\n'); upd() } });
    upgradeSelects(body); wireCfmt(body, upd); upd();
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
const BGR = { tol: 30, feather: 1, global: false, brush: 'none', size: 24 };
const MODK = /Mac|iPhone|iPad/.test(navigator.platform || '') ? '⌘' : 'Ctrl';
let BG_KEYS = null;
function renderBgRemove(el) {
  el.innerHTML = `<p class="lede">Remove a plain background and download the result as a transparent PNG. It works by finding the background color at the edges of your picture and clearing it, so it does best on solid or evenly colored backgrounds. It cannot recognize a person or object the way AI tools like remove.bg do, so for busy photos use the brush to clean up, or try a dedicated AI tool. Your image never leaves your device.</p>
  <div class="cx-drop" id="bg-drop" role="group" aria-label="Drop an image here or press Enter to choose one"><b>Drop an image here</b><span>or</span><button class="btn solid" type="button" id="bg-up">Choose an image from your device</button><input type="file" id="bg-file" accept="image/*" hidden></div><p class="ct-err" id="bg-err" role="alert"></p>
  <div id="bg-work" hidden><div class="bg-ctl"><label class="f"><span class="f-t">Tolerance: <output id="bg-tv"></output></span><input type="range" id="bg-tol" min="1" max="100" value="${BGR.tol}"></label><label class="f"><span class="f-t">Edge softness: <output id="bg-fv"></output> px</span><input type="range" id="bg-f" min="0" max="6" value="${BGR.feather}"></label>
  <label class="chk"><input type="checkbox" id="bg-glob" ${BGR.global ? 'checked' : ''}> Remove this color everywhere, not only around the edges</label></div>
  <div class="row bg-tools" id="bg-tools" style="align-items:end"><div class="seg" role="radiogroup" aria-label="Tool">${[['none', 'Pick background color'], ['erase', 'Erase brush'], ['restore', 'Restore brush']].map(([k, l]) => `<button type="button" role="radio" aria-checked="${BGR.brush === k}" data-br="${k}">${l}</button>`).join('')}</div><label class="f"><span class="f-t">Brush size: <output id="bg-sv"></output></span><input type="range" id="bg-size" min="4" max="120" value="${BGR.size}"></label><button class="btn" id="bg-rbrush" type="button">Reset brush settings</button>
  <span class="bg-hist"><button class="btn" id="bg-undo" type="button" aria-keyshortcuts="Control+Z Meta+Z" title="Undo (${MODK}+Z)" disabled>Undo</button><button class="btn" id="bg-redo" type="button" aria-keyshortcuts="Control+Shift+Z Control+Y Meta+Shift+Z" title="Redo (${MODK}+Shift+Z)" disabled>Redo</button></span></div>
  <p class="note" id="bg-help"></p><div class="bg-stage" id="bg-stage"><button class="btn sm bg-zoom-btn" id="bg-zoom" type="button" aria-label="Open zoomed editor">Zoom in</button><canvas id="bg-cv" aria-label="Image with the background removed. Click to pick the background color, or paint with the brush."></canvas></div>
  <div class="row"><button class="btn solid" id="bg-dl" type="button">Download PNG</button><button class="btn" id="bg-new" type="button">Choose another image</button><span class="empty" id="bg-info" role="status"></span></div></div>`;
  let W = 0, H = 0, orig = null, mask = null, manual = null, bgc = null, raf = 0;
  const cv = $('#bg-cv', el), cx = cv.getContext('2d');
  const sampleBg = () => { const d = orig.data, pts = [], m = 3; for (let x = 0; x < W; x += Math.max(1, W >> 5)) { pts.push((x) * 4, ((H - 1) * W + x) * 4) } for (let y = 0; y < H; y += Math.max(1, H >> 5)) { pts.push((y * W) * 4, (y * W + W - 1) * 4) } const q = c => { const a = pts.map(i => d[i + c]).sort((u, v) => u - v); return a[a.length >> 1] }; return [q(0), q(1), q(2)] };
  const compute = () => {
    const d = orig.data, tol = BGR.tol * 4.4, t2 = tol * tol, N = W * H, keep = new Uint8Array(N).fill(255), near = i => { const k = i * 4, dr = d[k] - bgc[0], dg = d[k + 1] - bgc[1], db = d[k + 2] - bgc[2]; return d[k + 3] < 10 || dr * dr + dg * dg + db * db <= t2 };
    if (BGR.global) { for (let i = 0; i < N; i++) if (near(i)) keep[i] = 0 }
    else { const st = [], seen = new Uint8Array(N), push = i => { if (!seen[i] && near(i)) { seen[i] = 1; st.push(i) } }; for (let x = 0; x < W; x++) { push(x); push((H - 1) * W + x) } for (let y = 0; y < H; y++) { push(y * W); push(y * W + W - 1) } while (st.length) { const i = st.pop(); keep[i] = 0; const x = i % W; if (x > 0) push(i - 1); if (x < W - 1) push(i + 1); if (i >= W) push(i - W); if (i < N - W) push(i + W) } }
    const f = BGR.feather; let a = Float32Array.from(keep);
    if (f > 0) { const blur = (src, horiz) => { const o = new Float32Array(N), r = f; for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { let s = 0, c = 0; for (let k = -r; k <= r; k++) { const xx = horiz ? x + k : x, yy = horiz ? y : y + k; if (xx < 0 || yy < 0 || xx >= W || yy >= H) continue; s += src[yy * W + xx]; c++ } o[y * W + x] = s / c } return o }; a = blur(blur(a, true), false) }
    mask = a;
  };
  const paint = () => {
    const out = cx.createImageData(W, H), d = orig.data;
    for (let i = 0; i < W * H; i++) { const k = i * 4; let al = mask[i]; if (manual[i] === 1) al = 0; else if (manual[i] === 2) al = 255; out.data[k] = d[k]; out.data[k + 1] = d[k + 1]; out.data[k + 2] = d[k + 2]; out.data[k + 3] = Math.round(al * d[k + 3] / 255) }
    cx.putImageData(out, 0, 0);
    $('#bg-info', el).textContent = `Background color found: ${fmtColor(rgbHex(...bgc))}`;
  };
  const redo = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(() => { compute(); paint() }) };
  /* undo / redo: a list of snapshots of everything that shapes the result */
  let hist = [], hi = -1;
  const snap = () => ({ m: manual.slice(), bgc: bgc.slice(), tol: BGR.tol, f: BGR.feather, g: BGR.global });
  const syncHist = () => { $('#bg-undo', document).disabled = hi <= 0; $('#bg-redo', document).disabled = hi >= hist.length - 1 };
  const commit = () => { if (!manual) return; hist = hist.slice(0, hi + 1); hist.push(snap()); if (hist.length > 30) hist.shift(); hi = hist.length - 1; syncHist() };
  const applySnap = h => { manual = h.m.slice(); bgc = h.bgc.slice(); BGR.tol = h.tol; BGR.feather = h.f; BGR.global = h.g; $('#bg-tol', el).value = h.tol; $('#bg-f', el).value = h.f; $('#bg-glob', el).checked = h.g; labels(); redo(); syncHist() };
  const undo = () => { if (hi > 0) { hi--; applySnap(hist[hi]) } }, redoStep = () => { if (hi < hist.length - 1) { hi++; applySnap(hist[hi]) } };
  const labels = () => { $('#bg-tv', el).textContent = BGR.tol; $('#bg-fv', el).textContent = BGR.feather; $('#bg-sv', document).textContent = BGR.size + ' px'; $('#bg-help', el).textContent = BGR.brush === 'none' ? 'Click the picture to choose which color counts as the background.' : BGR.brush === 'erase' ? 'Paint over parts you want removed.' : 'Paint over parts you want to bring back.' };
  const load = f => {
    if (!f || !/^image\//.test(f.type)) return $('#bg-err', el).textContent = 'That file is not an image.';
    const u = URL.createObjectURL(f), im = new Image();
    im.onload = () => { const s = Math.min(1, 1600 / Math.max(im.naturalWidth, im.naturalHeight)); W = Math.max(1, Math.round(im.naturalWidth * s)); H = Math.max(1, Math.round(im.naturalHeight * s)); cv.width = W; cv.height = H; cx.clearRect(0, 0, W, H); cx.drawImage(im, 0, 0, W, H); URL.revokeObjectURL(u); orig = cx.getImageData(0, 0, W, H); manual = new Uint8Array(W * H); bgc = sampleBg(); hist = []; hi = -1; commit(); $('#bg-err', el).textContent = ''; $('#bg-drop', el).hidden = true; $('#bg-work', el).hidden = false; labels(); redo() };
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
  let down = false; cv.onpointerdown = e => { if (!orig) return; if (BGR.brush === 'none') { const [x, y] = pos(e), k = (Math.min(H - 1, y) * W + Math.min(W - 1, x)) * 4; bgc = [orig.data[k], orig.data[k + 1], orig.data[k + 2]]; redo(); commit(); return } down = true; cv.setPointerCapture(e.pointerId); stamp(e) };
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
}

const TOOL_RENDER = { contrast: renderContrast, randomizer: renderRandomizer, cvd: renderCvd, lorem: renderLorem, persona: renderPersona, convert: renderConvert, bgremove: renderBgRemove, units: renderUnits };
