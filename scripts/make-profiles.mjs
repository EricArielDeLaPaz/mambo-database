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
const AV_TOPS = ['hijab', 'turban', 'bob', 'bun', 'curly', 'curvy', 'dreads', 'fro', 'froBand', 'longButNotTooLong', 'miaWallace', 'shavedSides', 'straight02', 'straight01', 'straightAndStrand', 'dreads01', 'dreads02', 'frizzle', 'shaggy', 'shaggyMullet', 'shortCurly', 'shortFlat', 'shortRound', 'shortWaved', 'sides', 'theCaesar', 'theCaesarAndSidePart', 'bigHair'];
const STYLES = [
  { folder: 'avataaars', key: 'avataaars', style: 'Illustrated', label: 'Avataaars', skinKey: 'skinColor', hair: true, opt: { top: AV_TOPS, topProbability: 100, mouth: ['smile', 'default', 'twinkle', 'serious'], eyes: ['default', 'happy', 'squint'], eyebrows: ['defaultNatural', 'default', 'raisedExcitedNatural', 'flatNatural'], accessories: ['prescription01', 'prescription02', 'round', 'wayfarers'], accessoriesProbability: 20, clothing: ['blazerAndShirt', 'blazerAndSweater', 'collarAndSweater', 'hoodie', 'overall', 'shirtCrewNeck', 'shirtScoopNeck', 'shirtVNeck'], facialHairProbability: 25 } },
  { folder: 'micah', key: 'micah', style: 'Drawing', label: 'Micah', skinKey: 'baseColor', hair: true, opt: { hair: ['full', 'pixie', 'fonze', 'turban'], hairProbability: 100, mouth: ['smile', 'laughing', 'smirk'], eyes: ['eyes', 'round', 'smiling'], glassesProbability: 25, facialHairProbability: 20 } },
];
// Licenses that allow commercial use. Anything else stops the script.
const OK_LICENSE = /CC0|CC BY 4\.0|Free for personal and commercial use/;
const PER_TONE = 5, lic = {};
// small seeded random so the output is the same every time
const rng = s => { let h = 2166136261; for (const c of s) h = Math.imul(h ^ c.charCodeAt(0), 16777619); return () => { h += 0x6D2B79F5; let t = h; t = Math.imul(t ^ t >>> 15, t | 1); t ^= t + Math.imul(t ^ t >>> 7, t | 61); return ((t ^ t >>> 14) >>> 0) / 4294967296 } };
for (const s of STYLES) {
  const st = col[s.key], m = st.meta, dir = path.join(root, 'profiles', s.folder); fs.rmSync(dir, { recursive: true, force: true }); fs.mkdirSync(dir, { recursive: true });
  if (!OK_LICENSE.test(m.license.name)) throw new Error(s.label + ' license is not on the allowed list: ' + m.license.name);
  lic[s.folder] = { attribution: /CC BY/.test(m.license.name), style: s.style, label: s.label, creator: m.creator, license: m.license.name, licenseUrl: m.license.url, source: m.source, tool: 'DiceBear ' + (JSON.parse(fs.readFileSync(path.join(scratch, 'node_modules/@dicebear/core/package.json'), 'utf8')).version) };
  let n = 0;
  for (let t = 0; t < TONES.length; t++) for (let k = 0; k < PER_TONE; k++) {
    n++; const seed = `${s.folder}-${TONES[t][1]}-${k}`, r = rng(seed), opt = { seed, size: 256, [s.skinKey]: [TONES[t][1]], backgroundColor: [BG[Math.floor(r() * BG.length)]], backgroundType: ['solid'] };
    if (s.hair) opt.hairColor = [HAIR[Math.floor(r() * HAIR.length)]];
    Object.assign(opt, s.opt || {});
    const svg = createAvatar(st, opt).toString().replace(/<\?xml[^>]*\?>\s*/, '').replace(/>\s+</g, '><').trim();
    fs.writeFileSync(path.join(dir, `${String(n).padStart(2, '0')}-${TONES[t][1]}.svg`), svg + '\n');
  }
  fs.writeFileSync(path.join(dir, 'LICENSE.txt'), `${s.label} by ${m.creator}\nLicense: ${m.license.name} (${m.license.url})\nSource: ${m.source}\nGenerated with DiceBear (https://www.dicebear.com), MIT licensed code.\n` + (/CC0/.test(m.license.name) ? 'CC0 places the artwork in the public domain; no attribution is required, but it is given here anyway.\n' : /CC BY/.test(m.license.name) ? 'CC BY 4.0 allows commercial use, but you must give credit to the creator, link to the license and say if you changed it. Credit line: "' + s.label + ' by ' + m.creator + ', CC BY 4.0".\n' : 'The creator allows personal and commercial use. Please credit the creator where you can.\n'));
}
const prev = fs.existsSync(path.join(root, 'profiles/LICENSES.json')) ? JSON.parse(fs.readFileSync(path.join(root, 'profiles/LICENSES.json'), 'utf8')) : { styles: {} }; if (prev.styles.realistic) lic.realistic = prev.styles.realistic;
fs.writeFileSync(path.join(root, 'profiles/LICENSES.json'), JSON.stringify({ tones: Object.fromEntries(TONES.map(([n, h]) => [h, n])), styles: lic }, null, 1) + '\n');
console.log(Object.keys(lic).filter(k => k !== 'realistic').map(k => k + ': ' + fs.readdirSync(path.join(root, 'profiles', k)).filter(f => f.endsWith('.svg')).length).join(', '));
