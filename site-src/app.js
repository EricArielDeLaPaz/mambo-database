/* ===== app shell ===== */
function render() {
  closeCtx(); tip.hidden = true; if (ddOpen) ddOpen.close();
  const r = route();
  $$('.tab').forEach(t => t.setAttribute('aria-selected', t.dataset.view === r.view));
  r.view === 'systems' ? renderSystems() : renderBrowse();
}
$$('.tab').forEach(t => t.onclick = () => go(t.dataset.view === 'systems' ? '#/systems' : '#/'));
window.addEventListener('hashchange', render);
loadStore(); render();
