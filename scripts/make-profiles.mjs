// Generates the Profiles images from DiceBear styles that are released under CC0 1.0 (public domain dedication).
// Usage: npm i @dicebear/core @dicebear/collection in a scratch folder, then:
//   node scripts/make-profiles.mjs <scratch folder>
// Output: profiles/<style-folder>/*.svg, profiles/LICENSES.json (creator, license and source read from each style's own metadata).
// Photos (Realistic style) are not generated here. To add some, put the files in profiles/realistic/ and describe them in profiles/photos.json (see profiles/README.md).
import fs from 'fs'; import path from 'path'; import { createRequire } from 'module';
const scratch = path.resolve(process.argv[2] || '/tmp/db'), req = createRequire(path.join(scratch, 'x.js')), root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const { createAvatar } = req('@dicebear/core'), col = req('@dicebear/collection');
const TONES = [['Very light', 'ffe0cc'], ['Light', 'f6c9a6'], ['Light brown', 'e4a672'], ['Medium brown', 'c68642'], ['Brown', 'a0693f'], ['Dark brown', '7a4a2b'], ['Deep brown', '5a3825'], ['Deepest brown', '3f2a1d']];
const HAIR = ['1b1b1b', '2e1d12', '4a2c17', '6b4423', 'a0522d', 'c9a24a', 'd9d9d9', '0f0f0f'], BG = ['e8eef7', 'f7ece8', 'ecf7e8', 'f3e8f7', 'f7f3e8', 'e8f5f7'];
const STYLES = [
  { folder: 'lorelei', key: 'lorelei', style: 'Illustrated', label: 'Lorelei', hair: true, opt: { mouth: ['happy01', 'happy02', 'happy03', 'happy04', 'happy05', 'happy06', 'happy07', 'happy08', 'happy09', 'happy10', 'happy11', 'happy12', 'happy13', 'happy14', 'happy15', 'happy16', 'happy17', 'happy18'], glassesProbability: 25, frecklesProbability: 15 } },
  { folder: 'open-peeps', key: 'openPeeps', style: 'Drawing', label: 'Open Peeps', hair: false, opt: { face: ['calm', 'smile', 'smileBig', 'smileTeethGap', 'cute', 'lovingGrin1', 'lovingGrin2'], accessories: ['glasses', 'glasses2', 'glasses3', 'glasses4', 'glasses5'], accessoriesProbability: 25, maskProbability: 0, facialHairProbability: 25 } },
  { folder: 'pixel-art', key: 'pixelArt', style: 'Pixel', label: 'Pixel Art', hair: true, opt: { mouth: ['happy01', 'happy02', 'happy03', 'happy04', 'happy05', 'happy06', 'happy07', 'happy08', 'happy09', 'happy10', 'happy11', 'happy12', 'happy13'] } },
];
const PER_TONE = 5, lic = {};
// small seeded random so the output is the same every time
const rng = s => { let h = 2166136261; for (const c of s) h = Math.imul(h ^ c.charCodeAt(0), 16777619); return () => { h += 0x6D2B79F5; let t = h; t = Math.imul(t ^ t >>> 15, t | 1); t ^= t + Math.imul(t ^ t >>> 7, t | 61); return ((t ^ t >>> 14) >>> 0) / 4294967296 } };
for (const s of STYLES) {
  const st = col[s.key], m = st.meta, dir = path.join(root, 'profiles', s.folder); fs.rmSync(dir, { recursive: true, force: true }); fs.mkdirSync(dir, { recursive: true });
  if (!/CC0/.test(m.license.name)) throw new Error(s.label + ' is not CC0: ' + m.license.name);
  lic[s.folder] = { style: s.style, label: s.label, creator: m.creator, license: m.license.name, licenseUrl: m.license.url, source: m.source, tool: 'DiceBear ' + (JSON.parse(fs.readFileSync(path.join(scratch, 'node_modules/@dicebear/core/package.json'), 'utf8')).version) };
  let n = 0;
  for (let t = 0; t < TONES.length; t++) for (let k = 0; k < PER_TONE; k++) {
    n++; const seed = `${s.folder}-${TONES[t][1]}-${k}`, r = rng(seed), opt = { seed, size: 256, skinColor: [TONES[t][1]], backgroundColor: [BG[Math.floor(r() * BG.length)]], backgroundType: ['solid'] };
    if (s.hair) opt.hairColor = [HAIR[Math.floor(r() * HAIR.length)]];
    Object.assign(opt, s.opt || {});
    const svg = createAvatar(st, opt).toString().replace(/<\?xml[^>]*\?>\s*/, '').replace(/>\s+</g, '><').trim();
    fs.writeFileSync(path.join(dir, `${String(n).padStart(2, '0')}-${TONES[t][1]}.svg`), svg + '\n');
  }
  fs.writeFileSync(path.join(dir, 'LICENSE.txt'), `${s.label} by ${m.creator}\nLicense: ${m.license.name} (${m.license.url})\nSource: ${m.source}\nGenerated with DiceBear (https://www.dicebear.com), MIT licensed code. CC0 places the artwork in the public domain; no attribution is required, but it is given here anyway.\n`);
}
fs.writeFileSync(path.join(root, 'profiles/LICENSES.json'), JSON.stringify({ tones: Object.fromEntries(TONES.map(([n, h]) => [h, n])), styles: lic }, null, 1) + '\n');
console.log(Object.keys(lic).map(k => k + ': ' + fs.readdirSync(path.join(root, 'profiles', k)).filter(f => f.endsWith('.svg')).length).join(', '));
