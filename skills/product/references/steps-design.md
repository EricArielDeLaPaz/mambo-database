# Design steps

These are the steps that can use the Mambo site. Each card says how.

## wireframes: Wireframes (low fidelity)
- **Purpose:** lay out each key screen so structure is settled before visual design.
- **Ask:** which flows to wireframe first (from user-flows); the target device sizes.
- **Research:** none.
- **Write:** for each screen, a text wireframe (a labeled block layout), the components it needs, and the content it shows. Name components with the Mambo Database ids when one fits (for example `button`, `tabs`, `table`, `modal-dialog`); pull the short card with `node scripts/brief.js <id>` if the create-design-system skill is installed, or open the entry on the site.
- **Site:** components (Browse). Optional.
- **Done when:** every screen in the chosen flows has a layout and a component list.

## design-system: Design system
- **Purpose:** define colors, type, foundations, components and icons once so screens stay consistent.
- **Ask:** whether to start now or later; whether they already have a system (Figma, Mambo Database, or none).
- **Research:** none here; the other skill handles its own.
- **Do:** hand off to the `create-design-system` skill. If it is installed, tell the person to run it (or read its SKILL.md and follow it in this chat), and record the output folder in `progress.md`. Do not rebuild its steps here. If it is not installed, write a one-page design brief (feel, colors, type, platforms, component list) and say where to get the skill.
- **Site:** colors, typography, components, icons. This is the main tie-in.
- **Done when:** `design-system/README.md` exists, or the brief is written.

## ui-prototype: UI design and prototype
- **Purpose:** turn the wireframes into visual screens with the design system and make a clickable prototype of the key flows.
- **Ask:** the tool (Figma or other); fidelity (key screens only or all).
- **Research:** none.
- **Write:** a build list per screen (components, states, content, tokens by name), the prototype's click paths, and the states that must be drawn (empty, loading, error). If the person uses Figma and a Figma connector is available, offer to create or update frames; ask before writing into their file.
- **Site:** component states and "Copy HTML + CSS for Figma" frames. Optional.
- **Done when:** the key flows can be clicked through with no dead ends.

## usability-testing: Usability test plan
- **Purpose:** check the prototype with real people before building.
- **Ask:** how many participants and how they will be found; remote or in person.
- **Research:** none.
- **Write:** 3 to 5 tasks with success criteria, a script (intro, tasks, follow-ups, wrap-up), a note template, how findings will be rated (severity), and a one-page report template. Solo: a light version with 3 tasks and 3 to 5 people.
- **Done when:** a person unfamiliar with the product could run the test from the plan.
