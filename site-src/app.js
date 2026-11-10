/* ===== app shell ===== */
function render() {
  closeCtx(); tip.hidden = true; if (ddOpen) ddOpen.close();
  const r = route();
  $$('.tab').forEach(t => t.setAttribute('aria-selected', t.dataset.view === r.view));
  if (r.view === 'systems') renderSystems();
  else if ($('#lay')) showDetail(); /* same Browse page: only the right panel changes */
  else renderBrowse();
}
$$('.tab').forEach(t => t.onclick = () => go(t.dataset.view === 'systems' ? '#/systems' : '#/'));
window.addEventListener('hashchange', render);
function renderFooter() {
  const fonts = DATA.filter(e => e.type === 'typeface').sort((a, b) => a.name.localeCompare(b.name));
  $('#foot').innerHTML = `<div class="foot-in"><h2>Credits and licenses</h2>
  <p><b>Typefaces.</b> Every typeface in this database is open source software licensed under the <a href="licenses/OFL-1.1.txt">SIL Open Font License, Version 1.1</a>. Each is copyright its own authors, listed below. The fonts are provided through <a href="https://fonts.google.com" target="_blank" rel="noopener">Google Fonts</a>. This site links to Google's servers for previews and does not host or sell font files. You may use, study, share and embed them in commercial work. Fonts may not be sold by themselves, and a modified font with a Reserved Font Name must be renamed. Read the <a href="https://openfontlicense.org/" target="_blank" rel="noopener">license FAQ</a>.</p>
  <p><b>Language support</b> is calculated from the fonts' character sets using the <a href="https://github.com/googlefonts/lang" target="_blank" rel="noopener">Google Fonts language data</a>.</p>
  <p><b>Mambo Database</b> code and original entries are © 2026 Eric Ariel De La Paz, <a href="https://github.com/EricArielDeLaPaz/mambo-database/blob/main/LICENSE" target="_blank" rel="noopener">MIT License</a>. Google Fonts is a trademark of Google LLC, and this project is not affiliated with or endorsed by Google or by any font author. Font names belong to their owners.</p>
  <details><summary>Font copyright notices (${fonts.length})</summary><ul class="notices">${fonts.map(f => `<li><a href="#/entry/${esc(f.id)}"><b>${esc(f.name)}</b></a> · ${esc(f.copyright)} · designer ${esc(f.designer)} · SIL OFL 1.1</li>`).join('')}</ul><p class="note">The same list is in <a href="https://github.com/EricArielDeLaPaz/mambo-database/blob/main/THIRD_PARTY_NOTICES.md" target="_blank" rel="noopener">THIRD_PARTY_NOTICES.md</a>.</p></details></div>`;
}
loadStore(); renderFooter(); render();
