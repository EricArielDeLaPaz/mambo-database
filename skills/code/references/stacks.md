# Stack notes

Follow the project's own conventions when a repo exists. These are defaults only for a new project. Do not pin version numbers from memory: check the current docs or the existing `package.json`.

## How tokens reach the code (all stacks)
- Keep the design system's CSS custom properties file as the single source. Import it once at the root. Components use `var(--token)` only.
- Dark values live under `[data-theme="dark"]` and `@media (prefers-color-scheme: dark)` using the same names.
- If the tokens come as JSON, convert once to a CSS file (names unchanged) and tell the person which file is now the source.
- Tailwind projects: map theme values to the token variables; do not paste new hex values into config.

## Plain HTML, CSS and JS
One `index.html` per route or one page with sections; a `styles/` folder with `tokens.css`, `base.css`, `components.css`; small ES modules for behavior. No build step unless the person wants one. Good for static or content products.

## React with Vite
`src/components/<Name>/` per component (file, styles, test), `src/screens/` per screen, `src/data/` for fixtures and fetch functions, one router. Keep state next to where it is used; lift only when two siblings need it. Server data goes through one small module so loading, empty and error are handled in one place.

## Next.js
Use the router the project already uses. Server components for static parts, client components only for interaction. Loading and error boundaries per route map to the spec's `loading` and `error` states.

## Vue or Svelte
Single-file components per component and per screen; same folder idea as React; tokens through CSS variables in the component styles.

## Tests
Use the runner named in `stack.tests`, or the project's. Test behavior at the screen level (what a person sees and does) and cover each acceptance line you can; do not add a runner just to have one. Say what is untested.
