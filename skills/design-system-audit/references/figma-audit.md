# Auditing a Figma file

Use the Figma connector if present (load its skill first if one is listed). If there is no connector, ask the person to paste the variables and styles list, or to export tokens, and audit that as a tokens file.

1. Read variables and collections once: names, modes (Light, Dark), values, aliases. Save them to `figma-tokens.json` in W3C shape (`$value`, `$type`, groups by role) so the script can read them: `node scripts/audit.js tokens figma-tokens.json`. Put dark-mode values in a top-level `dark` group.
2. Read styles (text, effect, grid) and list sizes, weights and families; flag counts over the limits in `checks.md`.
3. Figma-specific drift (the checks Edenspiekermann's audit skill names, https://skills.sh/edenspiekermann/skills/audit-design-system): missing shared components (a hand-drawn button where a library one exists), local overrides on instances, and unbound tokens (a fill, stroke, radius, spacing or text style that is a raw value instead of a variable or style). Count each on the sampled frames and list node names.
3b. List components: name, variant properties, states. Sample up to 5 for the component checks. Note any without a description.
4. Count detached instances and hardcoded fills or strokes on a sample of 3 frames (a fill with no variable bound is drift).
5. Check pairs the script could not match by name with `node scripts/contrast.js <fg> <bg> ...`.
6. Save raw findings to `audit-findings.json`; do not paste the file contents into chat.

Say what share of the file you sampled. Never claim the whole file was audited if you sampled.
