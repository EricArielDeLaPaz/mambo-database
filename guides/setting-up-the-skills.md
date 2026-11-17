---
id: setting-up-the-skills
title: Setting up the AI skills
summary: Download the six skills, add them to Claude, and use them to build a design system, design a product, build it from the handoff, audit a design system, sync tokens or draw a custom icon set step by step, while keeping token use low.
topic: Setup
level: Beginner
order: 2
---

> **New.** These skills are new and have not been tested in every tool. If a step does not work as described, tell us which tool you used and what happened.

A **skill** is a folder of instructions (and sometimes scripts and other files) that an AI assistant can load when a task matches.[^1] Mambo Database offers six.

| Skill | What it does |
| --- | --- |
| `create-design-system` | Takes you from nothing to a documented, accessible design system. It first asks whether you already have one in Figma, want to start from the Mambo Database, or want to start from scratch, then asks different questions for each. Run it with `/create-design-system`. |
| `design` | Takes you from an idea to a designed product. It asks the product type, proposes the steps that fit (research, definition, design, launch) for you to tick or untick, works through them one at a time, and ends with a checked handoff folder. Run it with `/design`. |
| `code` | Builds the front end from that handoff one slice at a time and checks every slice with scripts (tokens, contrast, states, accessibility) before moving on. Run it with `/code`. |
| `design-system-audit` | Checks an existing design system for problems. It audits a code folder, a tokens file or a Figma file, runs scripts to measure contrast, hardcoded colors, off-scale spacing and missing focus styles, then writes a short prioritized report and, if you approve, fixes. Run it with `/design-system-audit`. |
| `token-sync` | Compares the variables in a Figma file with the tokens in your code (CSS custom properties or tokens JSON), shows every value that drifted or is missing on either side, asks which side wins, then applies only the changes you approve. Run it with `/token-sync`. |
| `icon-set-creator` | Designs a small, consistent set of custom SVG icons. It checks the Mambo icon library first and only draws the gaps, writes one style spec, draws in small batches, checks each batch with a script (grid, stroke, colors, live area) and fixes failures before moving on. Run it with `/icon-set-creator`. |

The skills work on their own, but they chain: `design` ends with a handoff folder that `code` builds from, and `design-system-audit` checks what `code` produced.

## Get the files

- [create-design-system-skill.zip](https://ericarieldelapaz.github.io/mambo-database/create-design-system-skill.zip)
- [design-skill.zip](https://ericarieldelapaz.github.io/mambo-database/design-skill.zip)
- [code-skill.zip](https://ericarieldelapaz.github.io/mambo-database/code-skill.zip)
- [design-system-audit-skill.zip](https://ericarieldelapaz.github.io/mambo-database/design-system-audit-skill.zip)
- [token-sync-skill.zip](https://ericarieldelapaz.github.io/mambo-database/token-sync-skill.zip)
- [icon-set-creator-skill.zip](https://ericarieldelapaz.github.io/mambo-database/icon-set-creator-skill.zip)

Each zip contains one folder with a `SKILL.md` file inside. That file is the entry point. The assistant reads its short description to decide when to use the skill.[^4]

## Add them

Where you add a skill depends on the tool. The steps below describe the common cases. Menus change, so check your tool's own help if something looks different.

1. **Claude on the web.** Enable Code execution under Settings > Capabilities if it is not already on, then go to Customize > Skills, click "+" and choose "Upload a skill" to add the zip files (one at a time). The steps for a desktop app are not confirmed; check your tool's own help if it differs.[^2]
2. **Claude Code and other coding agents.** Unzip the folder into your skills directory. For Claude Code that is `~/.claude/skills/` for all projects, or `.claude/skills/` inside one project.[^3]
3. **Anything else.** A `SKILL.md` is markdown with a YAML header; the folder may also include supporting files and scripts. You can paste the contents of `SKILL.md` into the start of a chat, or point the tool at the folder.[^4]

## What happens when you start one

1. **A quick check.** The skill looks at what your assistant can do (ask questions with tappable options, search the web, start a cheaper helper, write files, run scripts) and tells you in three lines what mode it will use and how it will save tokens.
2. **Questions in batches.** If your assistant has a question tool, you get tappable options. If not, you get a numbered list and reply with numbers. You can always type your own answer.
3. **One step at a time.** After each step it tells you exactly what it made, then the next step. Nothing runs ahead of you. Say "next" when you are ready, or ask for a change.
4. **A progress file.** It keeps a short `progress.md` with your answers, decisions and finished steps. If you come back later or start a new chat, it offers to continue.

### The design system skill

- **Already in Figma:** it reads your variables, styles and component names (not the whole file), reports gaps against a checklist, then documents what each token and component is for, fixes what you choose, and exports.
- **From the Mambo Database:** it asks about industry, platforms, feel and themes, proposes color sets and type pairings from the database with contrast already checked, then sets foundations, components and icons.
- **From scratch:** the same questions plus brand colors, brand fonts, accessibility target and density. It builds the palette, type scale, spacing, radius, elevation and motion, and verifies every contrast pair with a script instead of estimating.
- **Components and icons** is the step that points back to this site. You can take a preset for your product type or pick your own.

### The design skill

- It proposes steps for your product type and where you are now. A solo founder with a validated problem gets a different plan than a team starting from an idea.
- When a step needs outside facts (for example a competitive audit), it asks first whether to search the web, hand the work to a cheaper helper, use research notes you paste or attach, or skip it.
- The design system step hands off to the design system skill.
- The last step writes a handoff folder (one file per screen plus a `handoff.json` with the build slices). A script checks it, so the next skill does not have to guess.

### The code skill

- Run it after the design skill. It reads the handoff, asks the stack once, then builds one thin slice at a time: tokens by name, every state, accessibility built in.
- After each slice it runs the project's own checks and the Mambo audit, and reports which acceptance lines it could show are true and which it could not verify.

## Keep token use low

- Answer in batches and in your own words; one clear sentence beats many follow-ups.
- Hand long research to a cheaper helper, or bring your own notes, instead of having the main chat read many pages.
- Start a new chat after a long phase. The progress file carries your answers forward.
- Do not paste whole files into the chat. Attach them, or give a link.
- Everything long is written to files; the chat shows short summaries.

## When something goes wrong

- **The slash command does nothing.** The skill is probably not in the right folder. Check that `SKILL.md` sits directly inside the skill folder, not inside a second nested folder.
- **No tappable questions.** Your assistant has no question tool. The skill falls back to a numbered list; reply with the numbers.
- **The scripts will not run.** Code execution may be off. The skill can still work from the written tables, but color suggestions and contrast checks are then less exact; turn code execution on if you can.
- **The colors look different from the site.** The skill reads the same data as the site. Ask it which color set it used and open that entry in Browse to compare.
- **You want to edit the result.** Paste the colors into a new system in the Design Systems tab. It flags contrast and count problems for you.

## Where to read more

[^1]: What are skills? — Anthropic Help Center. https://support.claude.com/en/articles/12512176-what-are-skills . Accessed 2026-11-14.
[^2]: Use skills in Claude — Anthropic Help Center. https://support.claude.com/en/articles/12512180-using-skills-in-claude . Accessed 2026-11-14.
[^3]: Claude Code docs: Skills — Anthropic. https://docs.claude.com/en/docs/claude-code/skills . Accessed 2026-11-14.
[^4]: Agent Skills overview — Claude Platform Docs, Anthropic. https://docs.claude.com/en/docs/agents-and-tools/agent-skills/overview . Accessed 2026-11-14.
