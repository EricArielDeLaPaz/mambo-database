#!/usr/bin/env python3
"""Builds the Realistic profile pictures from the 'royalty-free-user-avatars' (inter-faces) collection.
Usage: git clone --depth 1 https://github.com/leonadler/royalty-free-user-avatars <dir>; python3 scripts/make-photos.py <dir>
Only photos facing the camera, with eyes visible and a credit link to Pexels or Unsplash, are kept.
Output: profiles/realistic/NN.jpg and profiles/realistic/photos.json (source link for every photo)."""
import json, os, re, sys
from PIL import Image
src = sys.argv[1]; root = os.path.dirname(os.path.dirname(os.path.abspath(__file__))); out = os.path.join(root, 'profiles/realistic')
# Left out: sunglasses, hats or hands over the face, looking away, and photos whose credit link is missing, duplicated or from another site.
SKIP = {2,3,4,8,10,12,13,15,17,18,19,20,22,23,24,26,27,29,32,38,40,43,48,53,54,63,64,95,99}
credits = {}
for l in open(os.path.join(src, 'CREDITS.md')):
    m = re.match(r'- \[(\d+)\.jpg\]\((\S+)\)', l)
    if m: credits[int(m.group(1))] = m.group(2)
os.makedirs(out, exist_ok=True)
for f in os.listdir(out): os.remove(os.path.join(out, f))
meta = []
for n in sorted(credits):
    url = credits[n]
    if n in SKIP or not re.match(r'https://(www\.pexels\.com|unsplash\.com)/', url): continue
    im = Image.open(os.path.join(src, '500 x 500', f'{n:03d}.jpg')).convert('RGB').resize((256, 256), Image.LANCZOS)
    k = len(meta) + 1; im.save(os.path.join(out, f'{k:02d}.jpg'), quality=72, optimize=True, progressive=True)
    meta.append({'file': f'{k:02d}.jpg', 'source': url, 'site': 'Pexels' if 'pexels' in url else 'Unsplash'})
json.dump(meta, open(os.path.join(out, 'photos.json'), 'w'), indent=1)
print(len(meta), 'photos', sum(os.path.getsize(os.path.join(out, m['file'])) for m in meta) // 1024, 'KB')
lp = os.path.join(root, 'profiles/LICENSES.json'); lic = json.load(open(lp))
lic['styles']['realistic'] = {'style': 'Realistic', 'label': 'Portrait photo', 'photo': True, 'creator': 'Various photographers (see each photo)', 'license': 'CC0 1.0', 'licenseUrl': 'https://creativecommons.org/publicdomain/zero/1.0/', 'source': 'https://github.com/leonadler/royalty-free-user-avatars', 'tool': 'Collection "inter-faces" (CC0 1.0), photos cropped and resized'}
json.dump(lic, open(lp, 'w'), indent=1); open(lp, 'a').write('\n')
open(os.path.join(out, 'LICENSE.txt'), 'w').write('''Realistic profile pictures
Photos come from the "royalty-free-user-avatars" (inter-faces) collection, https://github.com/leonadler/royalty-free-user-avatars, released under CC0 1.0.
Each original was published on Pexels (https://www.pexels.com/license/) or Unsplash (https://unsplash.com/license) and is free to use commercially without credit.
The link to every original is in photos.json. The photos were cropped to a square and resized.
These show real people. Do not use them in a way that puts the person in a bad light (for example medical, political, criminal or adult content), and do not suggest the person endorses a product.
''')
