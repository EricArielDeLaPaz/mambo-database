# Research: ai-models-and-workflows

**For:** Mambo Database visual guide "AI models and workflows" (DESIGN.md item 5, Phase 2)
**Audience:** a UX/front-end designer-developer using free Gemini keys, OpenRouter free tier, and Claude (via Hermes), building design and portfolio projects.
**Date accessed:** 2026-11-13. Prices change; verify on the official pages before publishing or buying.
**Labels used:** [official] = official documentation or official pricing page · [third-party] = reputable third-party reporting · [unconfirmed] = not verified.

---

## 1. Choosing a starting model by task

**Rule of thumb:** every model family ships "small" (fast, cheap) and "large" (slow, expensive, smarter) tiers. Start on the smallest tier that passes a quick test on *your* hardest 5 examples, and only move up. For a designer-developer the tiering looks like this (verified against public pricing, labels per row):

| Task | Start with | Move up when | Stay cheap because |
|---|---|---|---|
| Daily chat / quick answers | free tier or Flash-class (Gemini Flash, Claude Haiku, GPT-5 mini-class) | answers are vague, reasoning is shallow, or you need multi-step logic | most turns don't need frontier reasoning |
| Writing (copy, emails, docs) | mid tier (Sonnet / GPT-5 / Gemini 3 Flash) | long-form, brand voice, or structural rewrites come out flat | small models handle short edits fine |
| Designing (critiques, Figma feedback, naming, tokens) | mid tier with image input | you need deep visual reasoning across many frames or a full design system review | most design feedback is pattern-matching, not genius work |
| Coding | mid tier for edits/bugs; large tier for multi-file refactors, architecture, tricky state | the model can't hold the diff in its head or fix the same bug twice | large-model latency compounds over many turns |
| Researching (this file, literature, comparisons) | large tier with a big context window (1M-class) | sources must be read whole and cited precisely | large context windows are expensive; truncate what you send |

**When to move up vs. down** — move up when: (a) the same task needs 2+ retries at the small tier, (b) output quality is inconsistent run-to-run, (c) the task spans many files/frames/sources and the small model drops things, (d) stakes are high (client work, legal/financial wording). Move down when: (a) the task is mechanical (reformatting, translation, summarising), (b) you only need speed (live chat, autocomplete), (c) volume is high and budget is capped. [unconfirmed as a universal law — this is practice distilled, not a lab finding; supported by Anthropic's and OpenAI's documentation recommending iterative evaluation.]

**How tiers are named across vendors (as of 2026-11-13):**

| Vendor | Small / fast | Mid | Large / frontier | Source |
|---|---|---|---|---|
| Anthropic | Haiku 5.5 ($0.10 / $0.50 per MTok) | Sonnet 5.5 ($2 / $10) | Opus 5.5 ($8 / $40); Fable/Mythos 5.2 line | [official] anthropic.com/claude/opus, platform.claude.com docs (pricing PDF 2026-05-12 & 2026-07-24) |
| OpenAI | GPT-5 mini / nano-class | GPT-5 (launch: $1.25 in / $10 out, 2025-08, [community]) | GPT-5.4 family (page: Mar 2026) | [official] developers.openai.com/api/docs/pricing (prices frequently updated) |
| Google | Gemini 3 Flash-class | Gemini 3 Pro-class | Gemini 3 Pro/Advanced line | [official] aistudio.google.com/docs/pricing (page content not extracted 2026-11-13; rate limits official) |
| xAI | Grok fast tiers | Grok 4.3 ($1.25 / $2.50, doubles past 200k ctx) | Grok 4.6 ($2 / $6) | [third-party] cloudzero.com blog 2026-08-27; lindy.ai 2026-10-19 |
| DeepSeek | V3.2 ($0.209 / $0.310 per MTok, 163k ctx) | R1 reasoning ($0.55 / $2.19) | V3.2 top tier | [third-party] pricepertoken.com 2025-12-01, tutorsbot.com 2026 |

---

## 2. Tokens and context

**What tokens are.** Models read and write subword chunks, not characters. English text averages ~4 characters per token (rule of thumb [third-party/official heuristic — OpenAI and Anthropic both describe roughly the same ratio; token counting is model-specific]). All billing is per million tokens (MTok), split into **input** (what you send, cheaper) and **output** (what it writes, more expensive — often 4–10× input price).

**Context window.** The maximum tokens the model can process in one request — input + output + (for reasoning models) internal reasoning tokens. As of 2026-11-13: 1M class (Gemini 3 Pro, Neontron Ultra, Inkling line, newer Claude/GPT flagships), 400K (GPT-5 launch [official community post 2025-08-07]), 163K (DeepSeek V3.2 [third-party]). Exceeding it truncates or errors; the model does not "remember" past chats unless you resend them.

**Budgeting.** Cost per 1,000 requests ≈ (input_tokens × price_in + output_tokens × price_out) / 1e6. Example: 2,000 input + 500 output tokens, GPT-5 launch prices ($1.25/$10 per MTok): (2000×1.25 + 500×10)/1e6 ≈ **$0.0075 per request ≈ $7.50 per 1,000 requests** [computed, not a vendor quote]. Note free-tier history (OpenRouter): 50 requests/day at 20 req/min until $10 lifetime credits are bought, then 1,000/day, reset at UTC midnight [third-party GitHub comparison 2026-10; openrouter.ai/docs official for the mechanism].

**Prompt caching.** Both Anthropic and OpenAI discount repeated input:
- Anthropic: cache hits at a fraction of input price — Sonnet/Opus cache-hit multiplier 0.05×–0.1× depending on tier [official: platform.claude.com docs, search snippet 2026]
- OpenAI: cached input priced well below fresh input; GPT-5 launch quoted "90% cache discount" [community.openai.com 2025-08-07 — verify current rate on developers.openai.com/api/docs/pricing]
- Gemini: context caching for repeated large prefixes [official billing doc exists: ai.google.dev/gemini-api/docs/billing]
**How to budget with caching:** put stable material (system prompt, docs, codebase) first and dynamic material last; cached prefix tokens cost ~10% of fresh ones, so a chatbot with a 10k-token system prompt costs far less than its gross input suggests.

**Counting tokens before you send.** Don't estimate by eye for large prompts: use the provider's token-count endpoint (Anthropic `count_tokens` [official docs]) or the tokenizer tool in AI Studio, or treat 1 token ≈ 4 English characters for a rough check. Free heuristic is fine for planning; never for billing disputes.

---

## 3. Delegator and worker workflows

**The pattern.** One model (the **delegator**) reads the goal, decomposes it, assigns subtasks, and reviews results; other model **workers** execute them. This mirrors how Claude is used inside Hermes: Claude plans, workers/sub-agents build and search, the delegator verifies. In this project the pattern is literal: the delegator (Claude, inside Hermes) reads the `DESIGN.md` plan, the worker executes each unchecked item, the delegator reviews the result, `research/` files hand off between phases, and the first step is always `git pull` before editing. When multiple models are used, the split is by cost/strength: frontier model plans + judges; small fast model writes/rewrites/tests.

**Patterns worth naming** [source: Anthropic, "Building effective agents" — official engineering blog: anthropic.com/engineering/building-effective-agents; patterns paraphrased from that article + industry usage]:

1. **Prompt chaining / pipeline** — fixed steps: draft → refine → format. Add a gate between steps; stop early if the gate fails. Use when the task has a natural sequence (outline → sections → edit).
2. **Routing** — classifier sends requests to specialists (billing question → billing prompt; code bug → code prompt). Use when task types are known and distinct.
3. **Parallelization (sectioning)** — split independent pieces to workers concurrently, merge. Use when subtasks don't depend on each other (three research questions at once).
4. **Parallelization (voting/judge)** — same prompt many times, take majority/best. Use when quality is noisy.
5. **Orchestrator–workers** — delegator decides the decomposition *dynamically* (the plan isn't fixed), spawns workers, re-plans. Most like real delegation; most expensive.
6. **Evaluator–optimizer** — worker drafts, evaluator critiques, iterate until pass. Use when quality bar is explicit and testable (tests pass, contrast ≥ 4.5, etc.).
7. **Human-in-the-loop** — the human approves gates: irreversible actions, purchases, publishing, design decisions. Hermes' "Follow Claude's plan" workflow is exactly this: unchecked boxes run autonomously, only blockers/design decisions pause.

**When to use delegator-worker vs single chat.** Use the pattern when the task spans many files/pages, needs independent verification, or benefits from parallelism. Skip it for one-shot questions (the delegator overhead costs more than it saves) and when every step needs a human's taste anyway.

**Delegator failure modes to design against:** workers can't ask questions, so the delegator's brief must be self-contained (files, constraints, format of the answer — exactly how sub-agents are tasked inside Hermes). Verify worker output before acting on it; never trust "I ran the tests" as fact — re-run or spot-check. Prefer verification prompts that demand evidence (command output, file path) over confidence claims.

**Human steps in** at: (a) goals requiring taste/brand, (b) irreversible side effects (payments, deploys, pushes to shared branches, deleting data), (c) privacy-sensitive data, (d) external commitments (clients, legal). Everything else can run.

---

## 4. Common AI features — what they do, when they help, what they cost

Definitions drawn from vendor docs (linked). "Overuse cost" is practice, labelled accordingly. What this means: assumes every claim is a hallucination until corroborated.
**Connectors / MCP.** One server, many clients. Anthropic's connectors doc says connectors give Claude access to a tool/data source (MCP = open standard; Anthropic → claude.com/docs/extend/overview; some MCP servers local, some hosted). ChatGPT/Claude/Gemini all support the same model context protocol differently.
**Projects (Claude) / ChatGPT Projects.** Persistent workspace: uploads + instructions scoped to one endeavour, so you don't re-explain context.
**Memory.** In-chat recall of user preferences and facts across sessions (Claude memory; ChatGPT memory, toggleable; Gemini Activity). Help long term by making tone/format sticky; overuse cost: stale or wrong "remembered" facts quietly shaping answers — audit periodically, delete entries that are wrong.
**Custom instructions (ChatGPT) / Instructions (Claude).** Account- or project-wide behaviour text. Help when the same workflow repeats; overuse cost: instructions nobody reads anymore, conflicting rules, and a long prompt tax on *every* message.
**Skills (Claude / agent harnesses).** A folder with `SKILL.md` of procedures the model loads when a task matches — this file itself is written under that pattern. Help by encoding repeatable playbooks ("follow Claude's plan"); overuse cost: skills you never update — stale instructions worse than none.
**Plugins / agents.** Bundles of skills + connectors for rollout to a team, and autonomous multi-step agents (Claude Code, Copilot agents, Codex, Hermes). Help when work is multi-step with verifiable end states; overuse cost: unattended agents with write access — always keep a human approval gate on irreversible steps.

**What belongs where — long-term help vs. clutter:**

| Feature | Long-term help | Overuse cost |
|---|---|---|
| Custom instructions | one-time setup, every chat benefits | conflicting rules, forgotten prompt tax |
| Projects | client/product-scoped knowledge | abandoned projects, stale knowledge |
| Memory | stable preferences carried over | wrong facts entrenched — prune it |
| Connectors / MCP | live data + actions inside chat | broad permissions, prompt-injection surface |
| Skills | repeatable playbooks for recurring tasks | stale playbooks; maintenance burden |
| Plugins / agents | org-wide rollout, parallel multi-step work | cost, blast radius, review fatigue |

Rule: everything in this table adds *persistent context or persistent capability*. Add it only when the same friction occurs 3+ times, then keep it small and audit on a schedule. [Overuse-cost column: practice distilled, not vendor guidance.]

---

## 5. Workflows by budget

All plan prices "as of 2026-11-13", from the sources next to each row.

### 5a. Free tier — $0, general-purpose

| Plan / product | What you get | Limits (as of) | Source |
|---|---|---|---|
| Claude Free [claude.com/pricing] | chat, small context, some features | rate limits; fewer models | [official] claude.com/pricing |
| ChatGPT Free [chatgpt.com/pricing] | chat, limited models | message caps, slower models | [official] chatgpt.com/pricing |
| Gemini Free / AI Studio [aistudio.google.com/docs/pricing] | Gemini Flash/Pro access, AI Studio free | rate limits; **free-tier content may be used to improve products** (Google's policy) | [official] aistudio.google.com/docs/billing; maximem.ai 2025 (third-party, confirm on Google terms) |
| OpenRouter `:free` models [openrouter.ai/docs] | 17–25 free open-weight models (Llama, Qwen, Gemma, DeepSeek R1, Nemotron) | 20 req/min; **50 req/day until $10 lifetime credits bought, then 1,000/day; resets UTC midnight**; one host per free model; some free providers may train on prompts | [official mechanism] openrouter.ai/docs/api-reference/limits; [third-party verification] codyvolckmar GitHub 2026-10-05, truefoundry.com 2026-10-05 |
| Llama / open weights | weights free to self-host | your hardware/GPU budget | [official] llama meta distribution terms |

**Free-tier workflow that works:** OpenRouter free models for reasoning/coding with `max_tokens` small; AI Studio Gemini for big context; ChatGPT/Claude free for brainstorming. Accept the 50/day cap; batch your prompts. **Do not put private client data into free endpoints whose providers may train** — check OpenRouter's per-provider data policy before routing (9 of 19 free models ran on may-train providers as of 2026-10) [third-party].

### 5b. Low budget — under ~$30/month

| Plan / product | Price (as of 2026-11-13) | What it unlocks | Source |
|---|---|---|---|
| Claude Pro | $20/mo ($17/mo annual) | 5× Free usage, Opus, Claude Code included | [third-party] freeacademy.ai 2026-02-17, klymentiev.com 2026-09-12; [official] claude.com/pricing |
| ChatGPT Plus | $20/mo | GPT models, Codex-ish tooling, higher caps | [official] chatgpt.com/pricing; [third-party] intuitionlabs.ai 2025-11-15 |
| Google AI Plus | $4.99/mo | entry Gemini consumer plan | [third-party] pricepertoken.com 2026-06-25 |
| Google AI Pro | $19.99/mo (was "Gemini Advanced") | full Gemini, AI Studio credits | [third-party] zemith.com & pricepertoken.com, checked 2026-11-13 |
| DeepSeek API (pay-as-you-go) | ~$0.21/$0.31 per MTok (V3.2) | extremely cheap API | [third-party] pricepertoken.com 2025-12-01 |
| OpenAI API (pay-as-you-go) | GPT-5 launch example $1.25/$10 per MTok | usage-based, no subscription | [official] developers.openai.com/api/docs/pricing (updated frequently; verify) |
| GitHub Copilot Pro | $10/mo ($10 AI credits/mo); Pro+ $39/mo ($39 credits) | inline completions + chat + agents | [official] github.blog/2026 announcement + docs.github.com plans table |
| Claude Code | included in Claude Pro/Max — no separate fee | terminal coding agent | [third-party] diyai.io 2026-10-17; [official] claude.com/pricing |

**Low-budget workflow that works:** Claude Pro as the daily driver (includes Claude Code — the best $20/mo coding path for this stack), AI Studio free tier for giant-context research, DeepSeek for batch/bulk transforms, OpenRouter `:free` for experiments. Total ≈ $20/month.

### 5c. Paid high-end — serious money, serious throughput

| Plan / product | Price (as of 2026-11-13) | What it unlocks | Source |
|---|---|---|---|
| Claude Max | $100/mo (5× Pro) | heavy daily Claude Code/chat usage | [third-party] freeacademy.ai, klymentiev.com, userightai.com 2026-10-20; [official] claude.com/pricing ($100/$200 tiers) |
| Claude Ultra / "Max 20×" | $200/mo | 10–20× Pro; weekly caps instead of 5-5h limits | [third-party] same as above |
| ChatGPT Pro | up to $200/mo (plans reported $100–$500) | top-tier models, effectively unmetered | [official] chatgpt.com/pricing; [third-party] intuitionlabs.ai |
| Google AI Ultra | $99.99/mo (5×) or $199.99/mo (20×) | max Gemini capacity + storage | [third-party] pricepertoken.com, zemith.com, aiworldtoday.com 2026-07-30 |
| SuperGrok / X Subscription Premium | $30/mo | Grok 4.x, images, X bundle | [third-party] cloudzero.com 2026-08-27, lindy.ai 2026-10-19, tooljunction.io 2026-10-17 |
| Copilot Pro+ / Max | $39–$100/mo | 7,000 AI credits, premium models incl. Opus | [third-party] claudegpt.si 2026-11-04; [official] github.blog |
| Direct API + big spend | pay per token | best for agents & automation | [official] vendor pricing pages |

**High-end workflow that works:** Opus-class model as default for client work and architecture; Sonnet-class for all edits; Haiku/Flash-class workers for bulk; Claude Code or Codex as the terminal agent; Hermes sub-agents for parallel research; human review at publish/deploy gates. Budget reality check: at 1,000 heavy agent runs a month, API spend routinely exceeds subscription cost — but subscriptions win for interactive use.

---

## 6. Limits and good habits

**Hallucinations.** All large models produce fluent falsehoods. OpenAI's own research (why-language-models-hallucinate, 2025-09-05) attributes this to training objectives that reward guessing over abstaining; Anthropic's Claude Platform Docs has a guardrails page on reducing hallucinations (platform.claude.com/docs — reduce-hallucinations) [both official]. Practical habits:
- Ask for sources; then **open them** — a plausible-looking citation is often fabricated.
- For code: run it. For numbers: recompute. For facts: cross-check two sources. For anything client-facing: human review before shipping.
- Prefer "I don't know" prompts; models guess rather than abstain unless explicitly told.
- Small evaluation set: keep 5–10 golden tasks for your domain and re-run them on any prompt/model change.

**Privacy.** Defaults differ by surface, not by model:
- Anthropic API & Claude for Work/Enterprise: **not used for training by default** [official: privacy.claude.com article 2026-08-18; platform.claude.com api-and-data-retention doc — commercial prompts not used for training; "Covered Models" require 30-day retention]
- OpenAI API / ChatGPT Business / Enterprise: **not used for training by default** [official: openai.com/business-data; developers.openai.com your-data guide; zero-data-retention offering 2026-08-19]
- Consumer ChatGPT: can be toggled off; otherwise may be used. ChatGPT Enterprise/Business/Edu: no training by default.
- Google **free** tier / AI Studio: content may be used to improve products; **paid** Gemini API (billing enabled) is not [official: aistudio.google.com/docs/billing — free content may be used for product improvement]
- OpenRouter free models: ~half the free providers may train; check the per-provider data policy toggle before routing sensitive prompts [third-party: truefoundry.com 2026-10-05]

**Copyright & licensing.** Generated output may resemble training data; you are responsible for what you ship. Do not paste client-confidential material into free/consumer surfaces that may train. For image/asset generation, check the provider's output licence (most consumer plans grant broad commercial rights; read the current terms — they change). Open-weight models (Llama etc.) have their own use policies. Record model + date for anything under client contract. [All of the above is summarised from vendor terms as of 2026-11-13 — verify before contractual reliance.]

**Other hard limits worth designing around:**
- **Context amnesia:** no persistence between API calls; you pay per token resent. Projects/memory/skills exist precisely to patch this — use them, deliberately.
- **Rate limits & quotas:** free tiers cap per-minute and per-day (OpenRouter 20/min, 50/day); paid plans cap per-5-hour and weekly at very high volumes (Claude Max); a failed request can still count against caps [openrouter docs, third-party verification].
- **Single-host free endpoints:** free models run on one provider; when it's down, there is no fallback. Paid paid models route across providers [third-party: truefoundry 2026-10-05].
- **Quantization drift (free):** free endpoints are often 4-bit; capabilities (esp. long context) differ from the paid twin — e.g. Gemma 4 31B free caps at 32K output vs 262K paid [third-party: truefoundry 2026-10-05].
- **Latency compounding:** agent loops multiply token cost and user wait; keep workers small and parallel.

**Good-habit checklist to bake into the guide:**
1. Verify before trusting; never ship unreviewed client-facing output.
2. Know which surface you're on (free vs paid vs API) and its data terms.
3. Put stable context first (prompt caching), volatile questions last.
4. Budget with the 4-chars-≈-1-token heuristic; count precisely before big jobs.
5. One feature at a time — memory, projects, connectors each add persistent surface.
6. Keep an eval set; pin model names; re-test on upgrades.
7. Pause at human gates: money, publishing, irreversible deletions, brand decisions.

---

## Sources (accessed 2026-11-13 unless noted)

Official documentation / pricing pages:
- anthropic.com/claude/opus — Opus $8/$40 per MTok, US-only inference 1.1× [official]
- platform.claude.com/docs/en/manage-claude/api-and-data-retention — API data retention [official]
- privacy.claude.com/en/articles/7996868 — commercial data not used for training by default [official]
- www-cdn.anthropic.com PDF rate cards 2026-05-12 & 2026-07-24 [official]
- claude.com/pricing — Free/Pro/Max/Team/Enterprise plans [official]
- support.claude.com Pro/Max/Ultra help articles [official]
- developers.openai.com/api/docs/pricing — API pricing (frequently updated) [official]
- openai.com/business-data & openai.com/index/offering-zero-data-retention-for-frontier-models (2026-08-19) [official]
- platform.claude.com/docs — token counting & prompt caching docs [official]
- aistudio.google.com/docs/pricing & ai.google.dev/gemini-api/docs/billing — free tier & paid terms [official]
- chatgpt.com/pricing [official]
- github.blog GitHub Copilot moving to usage-based billing (Jun 1 2026 announcement) & docs.github.com Copilot plans [official]
- openai.com/index/why-language-models-hallucinate (2025-09-05) [official]
- platform.claude.com/docs — Reduce hallucinations guardrails [official]
- anthropic.com/engineering/building-effective-agents [official]
- claude.com/docs/extend/overview — connectors, skills, plugins [official]

Third-party reporting (used for plan limits, free-tier mechanics, Grok & DeepSeek prices, OpenRouter free-tier detail):
- freeacademy.ai/blog/claude-free-vs-pro-vs-max-comparison-2026 (2026-02-17)
- klymentiev.com/blog/claude-plans (2026-09-12)
- userightai.com/claude-max-limits (2026-10-20)
- pricepertoken.com/subscriptions/gemini, /chatgpt, /pricing-page/model/deepseek-v3.2 (2026-06-25, 2025-12-01)
- zemith.com/en/learn/gemini-pricing (checked 2026-11-13); aiworldtoday.com (2026-07-30)
- cloudzero.com/blog/grok-pricing (2026-08-27); lindy.ai/blog/grok-pricing (2026-10-19); tooljunction.io (2026-10-17)
- intuitionlabs.ai ChatGPT plans (2025-11-15); claudegpt.si/news/github-copilot-pricing (2026-11-04)
- diyai.io Claude Code pricing (2026-10-17)
- openrouter.ai official free-models docs [official]; codyvolckmar openrouter-free-models GitHub (2026-10-05); truefoundry.com/blog/openrouter-free-models (2026-10-05); utilengine.com/blog/openrouter-free-models (2026-10) [third-party]
- alyssacaridi.com Claude skills/projects/connectors (2026-07-07); claudedigest.com (project instructions); salivity.github.io (id-attribute naming — used in figma-svg-paste-naming.md)

Marked unconfirmed in text: Figma paste-vs-import root-level naming (see figma-svg-paste-naming.md), web-vs-desktop Figma differences, exact GPT-5.2/Gemini 3 per-token prices (pricing pages mutate too often to quote from memory), Cursor Pro price (~$20/mo widely reported, not re-verified here), and the universal validity of the "move up/down a tier" rule (practice, not lab finding).
