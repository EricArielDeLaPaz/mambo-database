---
id: setting-up-the-skills
title: Setting up the AI skills
summary: Download the two skills, add them to Claude, and use /create-design-system to build an accessible design system by conversation.
topic: Setup
level: Beginner
order: 2
---

A **skill** is a folder of instructions that an AI assistant can load when a task matches. Mambo Database offers two.

| Skill | What it does |
| --- | --- |
| `create-design-system` | Interviews you about your product, then picks accessible colors, type and optional components from this database. Run it with `/create-design-system`. |
| `mambo-database` | Gives an assistant the whole database as plain files it can search: components, color sets and typefaces. |

## Get the files

Download the zip files:

- [create-design-system-skill.zip](create-design-system-skill.zip)
- [mambo-database-skill.zip](mambo-database-skill.zip)

Each zip contains one folder with a `SKILL.md` file inside. That file is the entry point. The assistant reads its short description to decide when to use the skill.

## Add them

Where you add a skill depends on the tool. The steps below describe the common cases. Menus change, so check your tool's own help if something looks different.

1. **Claude on the web or desktop.** Open Settings, find the Skills or Capabilities area, and upload the zip files.
2. **Claude Code and other coding agents.** Unzip the folder into your skills directory. For Claude Code that is `~/.claude/skills/` for all projects, or `.claude/skills/` inside one project.
3. **Anything else.** Skills are just markdown. You can paste the contents of `SKILL.md` into the start of a chat, or point the tool at the folder.

## Try it

Start a new chat and type `/create-design-system`. You will be asked a few short questions: what the product is, who it is for, the feel you want, and the platforms. Then it proposes colors, type and components, and checks the contrast of every pair.

> **Tip.** Answer in your own words. "Calm banking app for first-time savers, mobile first" tells the skill more than "fintech".

## When something goes wrong

- **The slash command does nothing.** The skill is probably not in the right folder. Check that `SKILL.md` sits directly inside the skill folder, not inside a second nested folder.
- **The colors look different from the site.** The skill reads the same data as the site. Ask it which entry it used and open that entry in Browse to compare.
- **You want to edit the result.** Paste the output into a new system in the Design Systems tab. It will flag contrast and count problems for you.
