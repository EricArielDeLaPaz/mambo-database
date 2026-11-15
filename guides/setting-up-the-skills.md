---
id: setting-up-the-skills
title: Setting up the AI skills
summary: Download the two skills, add them to Claude, and use /create-design-system to build an accessible design system by conversation.
topic: Setup
level: Beginner
order: 2
---

> **Heads up: this guide is not finished yet.** The AI skills are still being developed, so some steps may change or not work as described. Once the skills are fully built, this guide will be updated.

A **skill** is a folder of instructions (and sometimes scripts and other files) that an AI assistant can load when a task matches.[^1] Mambo Database offers two.

| Skill | What it does |
| --- | --- |
| `create-design-system` | Interviews you about your product, then picks accessible colors, type and optional components from this database. Run it with `/create-design-system`. |
| `mambo-database` | Gives an assistant the whole database as plain files it can search: components, color sets and typefaces. |

## Get the files

**Download coming soon.** The zip files are not published yet; check back here for the links.

Each zip contains one folder with a `SKILL.md` file inside. That file is the entry point. The assistant reads its short description to decide when to use the skill.[^4]

## Add them

Where you add a skill depends on the tool. The steps below describe the common cases. Menus change, so check your tool's own help if something looks different.

1. **Claude on the web.** Enable Code execution under Settings > Capabilities if it is not already on, then go to Customize > Skills, click "+" and choose "Upload a skill" to add the zip files. The steps for a desktop app are not confirmed; check your tool's own help if it differs.[^2]
2. **Claude Code and other coding agents.** Unzip the folder into your skills directory. For Claude Code that is `~/.claude/skills/` for all projects, or `.claude/skills/` inside one project.[^3]
3. **Anything else.** A `SKILL.md` is markdown with a YAML header; the folder may also include supporting files and scripts. You can paste the contents of `SKILL.md` into the start of a chat, or point the tool at the folder.[^4]

## Try it

Start a new chat and type `/create-design-system`. You will be asked a few short questions: what the product is, who it is for, the feel you want, and the platforms. Then it proposes colors, type and components, and checks the contrast of every pair.

> **Tip.** Answer in your own words. "Calm banking app for first-time savers, mobile first" tells the skill more than "fintech".

## When something goes wrong

- **The slash command does nothing.** The skill is probably not in the right folder. Check that `SKILL.md` sits directly inside the skill folder, not inside a second nested folder.
- **The colors look different from the site.** The skill reads the same data as the site. Ask it which entry it used and open that entry in Browse to compare.
- **You want to edit the result.** Paste the output into a new system in the Design Systems tab. It will flag contrast and count problems for you.

## Where to read more

[^1]: What are skills? — Anthropic Help Center. https://support.claude.com/en/articles/12512176-what-are-skills . Accessed 2026-11-14.
[^2]: Use skills in Claude — Anthropic Help Center. https://support.claude.com/en/articles/12512180-using-skills-in-claude . Accessed 2026-11-14.
[^3]: Claude Code docs: Skills — Anthropic. https://docs.claude.com/en/docs/claude-code/skills . Accessed 2026-11-14.
[^4]: Agent Skills overview — Claude Platform Docs, Anthropic. https://docs.claude.com/en/docs/agents-and-tools/agent-skills/overview . Accessed 2026-11-14.
