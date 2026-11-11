// Imports a small, curated set of common UI icons from free, commercially usable open-source icon libraries.
// Usage: node scripts/import-icons.mjs <dir containing the unpacked npm packages>   (see icons/README.md)
// Output: icons/<set>/<concept>.svg (normalized, currentColor) and icons/<set>/LICENSE. icons/sets.json is kept by hand.
import fs from 'fs'; import path from 'path';
const src = process.argv[2] || '/tmp/ic', root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const C = {
  home: 'home house', search: 'search magnifying-glass magnify search-24', settings: 'settings cog gear', user: 'user person', users: 'users people group user-group', plus: 'plus add', minus: 'minus remove subtract',
  close: 'x close cross x-mark', check: 'check checkmark done', menu: 'menu bars-3 list hamburger', 'more-horizontal': 'more-horizontal ellipsis ellipsis-horizontal more-horiz kebab-horizontal dots-three',
  'more-vertical': 'more-vertical ellipsis-vertical more-vert kebab-vertical dots-three-vertical overflow-menu--vertical', 'arrow-left': 'arrow-left arrow-back', 'arrow-right': 'arrow-right arrow-forward', 'arrow-up': 'arrow-up arrow-upward', 'arrow-down': 'arrow-down arrow-downward',
  'chevron-left': 'chevron-left chevron-back caret-left', 'chevron-right': 'chevron-right chevron-forward caret-right', 'chevron-up': 'chevron-up caret-up', 'chevron-down': 'chevron-down caret-down expand-more',
  edit: 'edit pencil pencil-square pen', trash: 'trash trash-2 trash-can delete delete-bin', copy: 'copy clipboard document-duplicate content-copy copy-file', download: 'download arrow-down-tray', upload: 'upload arrow-up-tray', share: 'share share-2 arrow-up-on-square',
  link: 'link link-2 chain', 'external-link': 'external-link arrow-top-right-on-square open-in-new launch link-external', mail: 'mail envelope', bell: 'bell notification notifications', calendar: 'calendar calendar-days event', clock: 'clock time access-time',
  heart: 'heart favorite favorite-border', star: 'star grade', bookmark: 'bookmark', lock: 'lock lock-closed', unlock: 'unlock lock-open lock-unlocked', eye: 'eye visibility view', 'eye-off': 'eye-off eye-slash visibility-off view--off', filter: 'filter funnel filter-list',
  sort: 'sort arrows-up-down arrow-up-down sort-by-alpha arrow--up-down', refresh: 'refresh refresh-cw arrow-path arrows-clockwise reload restart', info: 'info information-circle', warning: 'warning alert-triangle exclamation-triangle triangle-alert exclamation-triangle-fill',
  error: 'error alert-circle x-circle exclamation-circle circle-alert', help: 'help help-circle question-mark-circle question-circle', camera: 'camera photo-camera', image: 'image photo picture', video: 'video videocam', mic: 'mic microphone', phone: 'phone call', message: 'message message-square chat chat-bubble-left chat-bubble',
  send: 'send paper-airplane paper-plane-tilt', attach: 'paperclip attach attach-file', file: 'file document file-text document-text', folder: 'folder', save: 'save floppy-disk device-floppy', print: 'printer print', cloud: 'cloud', 'map-pin': 'map-pin pin location-on location map-marker geo-alt',
  globe: 'globe language public earth', sun: 'sun light-mode brightness', moon: 'moon dark-mode', wifi: 'wifi', battery: 'battery battery-full', bluetooth: 'bluetooth', volume: 'volume-2 volume-up speaker-high speaker volume--up', play: 'play play-arrow', pause: 'pause', stop: 'stop square', 'skip-forward': 'skip-forward skip-next fast-forward',
  'skip-back': 'skip-back skip-previous rewind', shuffle: 'shuffle', repeat: 'repeat', cart: 'shopping-cart shopping-cart-simple cart shopping_cart', 'credit-card': 'credit-card credit_card', wallet: 'wallet', tag: 'tag sell', gift: 'gift', 'shopping-bag': 'shopping-bag bag shopping_bag handbag',
  grid: 'grid layout-grid squares-2x2 grid-view apps grid-2x2', list: 'list list-bullet list-ul view-list', layout: 'layout layout-dashboard dashboard', sidebar: 'sidebar panel-left side-panel', maximize: 'maximize arrows-pointing-out fullscreen', minimize: 'minimize arrows-pointing-in fullscreen-exit', 'zoom-in': 'zoom-in magnifying-glass-plus', 'zoom-out': 'zoom-out magnifying-glass-minus',
  undo: 'undo arrow-uturn-left arrow-counter-clockwise', redo: 'redo arrow-uturn-right arrow-clockwise', 'log-in': 'log-in arrow-right-end-on-rectangle login sign-in', 'log-out': 'log-out arrow-left-start-on-rectangle logout sign-out', shield: 'shield shield-check security', key: 'key', 'thumbs-up': 'thumbs-up hand-thumb-up thumb-up like', 'thumbs-down': 'thumbs-down hand-thumb-down thumb-down dislike',
  flag: 'flag', compass: 'compass explore', 'bar-chart': 'bar-chart bar-chart-2 chart-bar bar-chart-fill bar_chart chart--bar', 'pie-chart': 'pie-chart chart-pie chart--pie', 'trending-up': 'trending-up arrow-trending-up chart-line-up graph-up-arrow', 'trending-down': 'trending-down arrow-trending-down chart-line-down graph-down-arrow', activity: 'activity pulse',
  database: 'database circle-stack', server: 'server', code: 'code code-bracket', terminal: 'terminal command-line', cpu: 'cpu cpu-chip chip', package: 'package cube archive-box inventory-2', truck: 'truck local-shipping', briefcase: 'briefcase work', book: 'book book-open', award: 'award trophy', coffee: 'coffee', zap: 'zap bolt flash lightning',
  'sliders': 'sliders sliders-horizontal adjustments-horizontal tune settings--adjust', 'rotate': 'rotate-cw rotate-right', 'bookmark-add': 'bookmark-plus', 'smile': 'smile face-smile mood emoji-happy', 'building': 'building building-2 building-office domain', 'map': 'map', 'music': 'music musical-note music-note', 'power': 'power power-settings-new', 'cursor': 'mouse-pointer cursor-arrow-rays mouse-pointer-2', 'layers': 'layers square-3-stack-3d stack', 'clipboard': 'clipboard clipboard-document assignment', 'inbox': 'inbox', 'archive': 'archive archive-box', 'at-sign': 'at-sign at-symbol alternate-email at', 'hash': 'hash hashtag tag-hash'
};
const kebab = n => n.replace(/_/g, '-'), snake = n => n.replace(/-/g, '_'), dbl = n => n.replace(/-/g, '--');
const L = (dir, f) => n => [path.join(dir, n + '.svg')];
const P = (...a) => path.join(src, ...a);
const SETS = [
  { id: 'material-icons', dir: P('_material-design-icons_svg/package/outlined'), file: n => [snake(n)], lic: P('_material-design-icons_svg/package/LICENSE') },
  { id: 'lucide', dir: P('lucide-static/package/icons'), file: n => [kebab(n)], lic: P('lucide-static/package/LICENSE') },
  { id: 'feather', dir: P('feather-icons/package/dist/icons'), file: n => [kebab(n)], lic: P('feather-icons/package/LICENSE') },
  { id: 'heroicons', dir: P('heroicons/package/24/outline'), file: n => [kebab(n)], lic: P('heroicons/package/LICENSE') },
  { id: 'tabler', dir: P('_tabler_icons/package/icons/outline'), file: n => [kebab(n)], lic: P('_tabler_icons/package/LICENSE') },
  { id: 'phosphor', dir: P('_phosphor-icons_core/package/assets/regular'), file: n => [kebab(n)], lic: P('_phosphor-icons_core/package/LICENSE') },
  { id: 'bootstrap-icons', dir: P('bootstrap-icons/package/icons'), file: n => [kebab(n)], lic: P('bootstrap-icons/package/LICENSE') },
  { id: 'carbon', dir: P('_carbon_icons/package/svg/32'), file: n => [kebab(n), dbl(kebab(n))], lic: P('_carbon_icons/package/LICENSE') },
  { id: 'fluent', dir: P('_fluentui_svg-icons/package/icons'), file: n => [snake(n) + '_24_regular'], lic: null },
  { id: 'ionicons', dir: P('ionicons/package/dist/svg'), file: n => [kebab(n) + '-outline', kebab(n)], lic: P('ionicons/package/LICENSE') },
  { id: 'octicons', dir: P('_primer_octicons/package/build/svg'), file: n => [kebab(n) + '-24'], lic: P('_primer_octicons/package/LICENSE') },
];
function norm(raw) {
  raw = raw.replace(/<!--[\s\S]*?-->/g, '').replace(/<title>[\s\S]*?<\/title>/g, '').replace(/<desc>[\s\S]*?<\/desc>/g, '');
  const m = raw.match(/<svg\b([^>]*)>([\s\S]*)<\/svg>\s*$/); if (!m) return null;
  const at = k => { const r = m[1].match(new RegExp('(?:^|\\s)' + k + '="([^"]*)"')); return r && r[1] };
  const vb = at('viewBox') || `0 0 ${at('width') || 24} ${at('height') || 24}`, fill = at('fill'), stroke = at('stroke');
  const keep = { fill: fill === 'none' ? 'none' : 'currentColor' }; if (stroke) keep.stroke = 'currentColor';
  for (const k of ['stroke-width', 'stroke-linecap', 'stroke-linejoin']) { const v = at(k); if (v) keep[k] = v.replace('px', '') }
  const body = m[2].replace(/\s*\n\s*/g, '').replace(/(fill|stroke)="(#[0-9a-fA-F]{3,8}|black|white|rgb[^"]*)"/g, '$1="currentColor"').replace(/stroke-width="([\d.]+)px"/g, 'stroke-width="$1"').trim();
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}"${Object.entries(keep).map(([k, v]) => ` ${k}="${v}"`).join('')}>${body}</svg>`;
}
// Hand-picked file names where the obvious name is a different icon, or only a filled version exists.
const O = {
  'material-icons': { 'arrow-left': 'arrow_back', 'arrow-right': 'arrow_forward', heart: 'favorite_border', star: 'star_border', bookmark: 'bookmark_border', camera: 'photo_camera', battery: null, help: 'help_outline', error: 'error_outline', briefcase: 'work_outline', tag: 'sell', maximize: 'fullscreen', minimize: 'fullscreen_exit', filter: 'filter_list', file: 'description', award: 'emoji_events', compass: 'explore', 'bar-chart': 'bar_chart', stop: 'stop_circle', server: 'dns', 'thumbs-up': 'thumb_up', 'thumbs-down': 'thumb_down' },
  'bootstrap-icons': { minus: 'dash-lg', plus: 'plus-lg', info: 'info-circle', help: 'question-circle' },
  ionicons: { help: 'help-circle-outline', stop: 'stop-circle-outline' }
};
const report = {};
for (const s of SETS) {
  const out = path.join(root, 'icons', s.id); fs.rmSync(out, { recursive: true, force: true }); fs.mkdirSync(out, { recursive: true });
  let n = 0;
  for (const [concept, syn] of Object.entries(C)) {
    let found = null; const ov = O[s.id] && O[s.id][concept]; if (ov === null) continue; if (ov && fs.existsSync(path.join(s.dir, ov + '.svg'))) found = path.join(s.dir, ov + '.svg');
    if (!found) for (const cand of [concept, ...syn.split(' ')]) { for (const f of s.file(cand)) { const p = path.join(s.dir, f + '.svg'); if (fs.existsSync(p)) { found = p; break } } if (found) break }
    if (!found) continue;
    const svg = norm(fs.readFileSync(found, 'utf8')); if (!svg) continue;
    fs.writeFileSync(path.join(out, concept + '.svg'), svg + '\n'); n++;
  }
  if (s.lic) fs.copyFileSync(s.lic, path.join(out, 'LICENSE'));
  report[s.id] = n;
}
fs.writeFileSync(path.join(root, 'icons/concepts.json'), JSON.stringify(Object.fromEntries(Object.entries(C).map(([k, v]) => [k, v.split(' ').filter(x => x !== k)])), null, 1) + '\n');
console.log(report, 'concepts', Object.keys(C).length);
