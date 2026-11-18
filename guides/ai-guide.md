---
id: ai-guide
title: AI models and workflows: a working guide
summary: Pick a model by what you need to do (free, budget or costly, from any vendor), set up delegator-and-worker workflows, and know when to pay for which plan.
topic: Design systems & AI
level: Intermediate
order: 15
---

This is a working reference for designers and developers who use AI tools day to day: which model to start with, how to set up a delegator-and-worker workflow, what to pay for, and what to watch out for. Everything here is **as of 2026-11-13**, with links to the official pages so you can check before you spend. Prices, plans and limits change often — treat the links, not the numbers, as the durable part of this guide.

> **Label reminder.** Figures marked [official] come straight from the vendors' own pricing, documentation or help pages. Where a vendor page could not be read, we use a named tracking site and mark the figure [third-party, confirm] so you check it before you spend. Smartness scores and ratings come from the leaderboards named in the notes. Claims we could not confirm are written without numbers or left out.

## Choosing a starting model

Start with what you need to do, not with a brand. This section lists good models for each job in three bands: **free**, **budget** and **costly**. It uses current rankings from independent sites, not just one company's models. Everything here is as of **2026-11-17**, and rankings move fast.

**How to read it**
- **Smartness score** is the Artificial Analysis Intelligence Index (higher is better).[^25] Coding uses its Coding Agent Index.[^26] Images use its image Arena rating.[^27]
- **Prices** are in US dollars per million tokens (input / output), unless it says otherwise. **Cost per task** is what Artificial Analysis paid to run its own test set. It shows what a model really costs to use, because some models "think" for a long time and use many tokens.
- **Free** means a free plan, a free API tier, or an open-weight model (the files are public). Open-weight models cost nothing to download, but you must run them on a computer or a host that may charge you.
- **Budget** means up to about $2 input / $10 output per million tokens, or a plan of about $20 a month. **Costly** is everything above that.

### Quick picks by need

| Your need | Free | Budget | Costly |
| --- | --- | --- | --- |
| Everyday chat and quick answers | The free plans of ChatGPT and Claude. Or Gemini 3.5 Flash in Google AI Studio. | Claude Haiku 5.5 or GPT-6 Luna for fast, cheap answers. A $20 plan (Claude Pro or Google AI Pro) for daily use. | Rarely worth it. A top model is more than chat needs. |
| Research and long documents | Gemini 3.5 Flash in Google AI Studio (free API tier). Open-weight Kimi K3.1 Pro if you can host it. | Claude Sonnet 5.5 (1M-token window) or GPT-6.2 Sol. Gemini 4 Hydrogen also has a 1M window. | Gemini 4 Carbon, GPT-6.2 Astra or Claude Fable 5.2 for the hardest, highest-stakes questions. |
| Coding (including front-end) | Gemini 3.5 Flash (free API tier). Open-weight DeepSeek V4.1 Flash or Kimi K3.1 Pro. | Claude Sonnet 5.5 or GPT-6.2 Sol. GPT-6.1 Terra for lower cost. | Claude Fable 5.2 or Claude Opus 5.5 in Claude Code. Gemini 4 Carbon in Antigravity. GPT-6 Astra in Codex. |
| Designing (reading screenshots, UI feedback, design to code) | Gemini 3 Flash Preview or Gemini 2.5 Flash (free API tier; Google lists text, image and video input). | Gemini 4 Hydrogen, Claude Sonnet 5.5 or GPT-6.2 Sol. Test with your own screenshots. | Gemini 4 Carbon, Claude Opus 5.5 or GPT-6.2 Astra for deep visual reasoning across many screens. |
| Writing and editing | Free plans of ChatGPT or Claude. | Claude Sonnet 5.5, GPT-6.2 Sol or Gemini 4 Hydrogen. | Claude Opus 5.5 or GPT-6.2 Astra for brand voice and long documents. |
| Data and spreadsheets | Gemini 3.5 Flash (free API tier). | GPT-6.2 Sol or Claude Sonnet 5.5. Check results by hand. | GPT-6.2 Astra or Claude Opus 5.5 for messy data and multi-step analysis. |
| Making images | No top image model has a confirmed free tier. The best open-weight one, H3-Image, ranks 27th. | MAI-Image-2.7-Flash (about $10 per 1,000 images). Nano Banana 2.1 or MAI-Image-2.7 (about $34 per 1,000). | GPT Image 2.6 (ranked first, about $211 per 1,000 images). |

Two honest limits. First, we could not find a live public ranking made specifically for design critique, writing or spreadsheets. For those rows we used the general Intelligence Index, so test the shortlist on your own work. Second, the order inside a band is close. A few points on a leaderboard rarely matter more than price and speed for you.

### The numbers behind the picks

| Model | Vendor | Smartness (Intelligence Index) | Cost per task | Price per 1M tokens (in / out) |
| --- | --- | --- | --- | --- |
| Claude Fable 5.2 | Anthropic | 65 | $26.54 | $8 / $40 (our 2026-11-13 check; the page we could read today lists Fable 5.1 at $10 / $50)[^1] |
| GPT-6.2 Astra | OpenAI | 62 | $4.00 | $8 / $40 [third-party, confirm][^28] |
| Gemini 4 Carbon | Google | 60 | $5.48 | not on the Google page we could read[^4] |
| Claude Opus 5.5 | Anthropic | 59 | $10.04 | $4 / $20 [official][^1] |
| GPT-6.2 Sol | OpenAI | 57 | $1.01 | $2 / $10 [third-party, confirm][^28] |
| Claude Sonnet 5.5 | Anthropic | 55 | $10.02 | $2 / $10 [official][^1] |
| Gemini 4 Hydrogen | Google | 54 | $3.16 | not on the Google page we could read[^4] |
| GPT-6.1 Terra | OpenAI | 51 | $0.96 | $1 / $5 [third-party, confirm][^28] |
| Kimi K3.1 Pro (open weights) | Moonshot | 46 | $3.68 | $2 / $10 [third-party; another site lists less, so check][^29] |
| Claude Haiku 5.5 | Anthropic | 36 | $0.41 | $0.10 / $0.50 up to 100K tokens [official][^1] |
| DeepSeek V4.1 Flash (open weights) | DeepSeek | 33 | $0.60 | $0.15 to $0.30 / $0.60 to $1.20, depending on the hour [third-party][^29] |
| Gemini 3.5 Flash | Google | not ranked there | not listed | $1.50 / $9, with a free API tier [official][^4] |

What this shows. **A cheap price per token is not always a cheap task.** Claude Sonnet 5.5 and GPT-6.2 Sol cost the same per token, but Sonnet's test run cost about ten times more because it used many more tokens. GPT-6.2 Astra scores 62 at $4.00 a task, while Claude Fable 5.2 scores 65 at $26.54. Open-weight Kimi K3.1 Pro (46) is the strongest downloadable model we could confirm on that leaderboard.

### For coding specifically

| Agent and model | Coding Agent Index |
| --- | --- |
| Claude Code with Claude Fable 5.2 | 58.5% |
| Devin Fusion CLI with Claude Opus 5.5 and GPT-6 Luna | 58.4% |
| Claude Code with Claude Opus 5.5 | 58.2% |
| Claude Code with Claude Sonnet 5.5 | 56.3% |
| Antigravity CLI with Gemini 4 Carbon | 55.5% |
| Codex with GPT-6 Astra | 53.1% |
| Codex with GPT-6.1 Sol | 52.2% |

The top three are within 0.3 points, so treat them as tied. The score measures both the model and the coding tool together, so the same model can score differently in a different tool.[^26]

### For making images

| Model | Arena rating | Price per 1,000 images |
| --- | --- | --- |
| GPT Image 2.6 Sunburst | 1261 | $210.72 |
| MAI-Image-2.7 (Microsoft) | 1214 | $34.82 |
| Kling Image 4.0 | 1180 | $63.00 |
| Nano Banana 2.1 (Google) | 1176 | $33.60 |
| Grok Imagine Image 2.0 (xAI) | 1167 | $60.00 |
| MAI-Image-2.7-Flash | 1158 | $10.24 |

Prices are for 1024 × 1024 images with default settings.[^27] Google's own page lists Imagen 4 Fast at $0.02 per image and Gemini 2.5 Flash Image at $0.039 per image, with no free tier.[^4]

### When to move up or down
**Move up** when the same task needs two or more retries, the quality changes from run to run, the work spans many files or screens, or the work is for a client. **Move down** when the task is mechanical, you need speed, or your budget is capped. Start with the smallest model that passes a test on your own five hardest examples. This is practice, not a lab result, so check it on your own work.

Anthropic puts it this way: "Choose Haiku for simple tasks, Sonnet for most production workloads, and Opus for the most complex reasoning." [Official: Claude platform pricing page](https://platform.claude.com/docs/en/about-claude/pricing)[^1]

## Tokens and context

Models read and write **tokens**, chunks of roughly four English characters each. Billing is **per million tokens (MTok)** and split into **input** (what you send, cheaper) and **output** (what the model writes, often 4–10× the input price). Every request is bounded by a **context window** — the total tokens it can process, input plus output, and input and output both count against it.

A rough but useful budget formula:

```
cost per request ≈ (input_tokens × price_in + output_tokens × price_out) / 1,000,000
```

Worked example with Sonnet 5.5 prices ($2 input / $10 output per MTok, [official][^1]): 2,000 input tokens + 500 output tokens ≈ (2000 × 2 + 500 × 10) / 1e6 ≈ **$0.009 for one request, about $9 per 1,000 requests** [computed, not a vendor quote].

**Prompt caching** discounts repeated input dramatically. Anthropic charges **0.1× the normal input price** to read cached text for most models. It is **0.05×** for Opus 5.5 and Sonnet 5.5, and **0.025×** for the Fable and Mythos 5.x lines. Writing to the cache costs **1.25×** (kept 5 minutes) or **2×** (kept 1 hour). OpenAI cached input is 5% to 10% of fresh input on the GPT-6 family (gpt-6.1-sol caches at $0.10 against $2.00; gpt-6-astra at $1.00 against $10.00). To use this, put stable material (system prompt, documentation, codebase) first and changing content last. Only the repeated start of a prompt gets the discount. [Official: Anthropic prompt caching](https://platform.claude.com/docs/en/build-with-claude/prompt-caching)[^2] · [Official: OpenAI pricing](https://developers.openai.com/api/docs/pricing)[^3]

**Don't estimate by eye for large jobs.** Use the provider's token-count tool or a tokenizer endpoint. The 1-token ≈ 4 English characters heuristic is fine for planning, never for billing questions.

## What the official API pages list today

As of 2026-11-13. Prices and model line-ups change; check the vendor pages before you budget.

| Model | Input $/MTok | Output $/MTok | Provider page |
| --- | --- | --- | --- |
| Claude Fable 5.2 | 8.00 | 40.00 | [Anthropic](https://platform.claude.com/docs/en/about-claude/pricing)[^1] |
| Claude Opus 5.5 | 4.00 | 20.00 | [Anthropic](https://platform.claude.com/docs/en/about-claude/pricing)[^1] |
| Claude Sonnet 5.5 | 2.00 | 10.00 | [Anthropic](https://platform.claude.com/docs/en/about-claude/pricing)[^1] |
| Claude Haiku 5.5 | 0.10 | 0.50 | [Anthropic](https://platform.claude.com/docs/en/about-claude/pricing)[^1] |
| gpt-6-astra | 10.00 | 50.00 | [OpenAI](https://developers.openai.com/api/docs/pricing)[^3] |
| gpt-6.1-sol | 2.00 | 10.00 | [OpenAI](https://developers.openai.com/api/docs/pricing)[^3] |
| gpt-6.1-terra | 1.00 | 5.00 | [OpenAI](https://developers.openai.com/api/docs/pricing)[^3] |
| gpt-6-luna | 0.10 | 0.50 | [OpenAI](https://developers.openai.com/api/docs/pricing)[^3] |
| Gemini 4 line (Carbon / Argon / Hydrogen), Gemini 3.8 Flash | see page | see page | [Google](https://ai.google.dev/gemini-api/docs/pricing)[^4] |

Google's current frontier line is **Gemini 4 Carbon** (most capable reasoning), **Gemini 4 Argon** (efficient frontier), **Gemini 4 Hydrogen** (everyday, 1M-token context), and **Gemini 3.8 Flash** (Flash class). Their exact per-token prices are not printed here because they are not readable from the current Google pricing page without a browser — open the linked page for the numbers. OpenAI's pricing page lists the GPT-6 family. Older GPT-5 models exist but show no current price there, so none is printed here. Anthropic's page lists older models too and offers 1M-token context on Claude 4.6+ models except Haiku 5.5. [^4][^3][^1]

## Delegator and worker workflows

The pattern from Anthropic's "Building effective agents" essay is the shape behind every serious AI setup:

- **Prompt chaining** — fixed steps (outline → sections → edit) with a gate between them; stop early if a gate fails.
- **Routing** — a classifier sends each request to the right specialist (code bug → coding prompt, copy question → writing prompt).
- **Parallelization** — split independent pieces to workers at once and merge (three research questions in parallel), or run the same prompt several times and keep the best (voting/judge).
- **Orchestrator–workers** — the plan isn't fixed; the orchestrator decides the decomposition as it goes. Most powerful, most expensive.
- **Evaluator–optimizer** — a worker drafts, an evaluator critiques, iterate until it passes an explicit bar (tests pass, contrast ≥ 4.5).
- **Human in the loop** — the person approves gates: money, publishing, irreversible deletions, brand decisions.
- [Official: Building effective agents](https://www.anthropic.com/engineering/building-effective-agents)[^5]

Here is the pattern on this very guide. Claude writes the plan as unchecked items in `DESIGN.md`. Hermes (the worker) pulls the repo with `git pull` and does the unchecked items in order. Claude reviews the result. Anything that needs the web goes to Hermes as a `- [ ] Research:` item, and the answer is saved to a `research/<topic>.md` file for Claude to read. The human decides between steps. That loop — plan → worker executes → delegator reviews — is the practical form of the pattern. Use the cheap models as workers and the expensive one as the judge, or skip the split entirely for one-shot questions where the overhead costs more than it saves.

**When a single assistant is enough.** One chat for: one-shot questions, anything where every step needs your taste, anything irreversible. **When the pattern pays off.** Tasks spanning many files or sources, anything needing independent verification, or anything with a checkable end state (passing tests, clean build, all contrast ratios green).

**Brief workers like you'd brief a contractor.** Workers can't ask questions, so the brief must be self-contained: the files involved, the constraints, and the exact format of the answer. Check their output before you trust it — "I ran the tests" is a claim, not evidence; re-run or spot-check.

## When to step in

Label: practice, not vendor guidance — Claude builds the plan, you make the calls. Some points of the loop are yours and no worker or reviewer should be put through them:

- Goals that need your taste, brand judgment or product sense.
- Irreversible actions: payments, deploys, pushes to shared branches, deleting data.
- Privacy-sensitive data — yours, your clients', your users'.
- Commitments to clients or other people — you own the promise, the tool never does.
- Any worker result you have not checked yourself, no matter how confident the report sounds.

## AI features — what they pay off and what they cost

Each of these features adds **persistent context or persistent capability** — memory, other chats, always-on behaviour. Add one when the same friction has happened three times, not on first sight.

| Feature | Long-term payoff | Overuse cost |
| --- | --- | --- |
| Custom instructions / Instructions | One-time setup, every chat benefits | Conflicting rules, forgotten prompt tax |
| Projects (self-contained workspaces with their own chat history and knowledge base) | Client- or product-scoped knowledge | Abandoned projects, stale knowledge |
| Memory | Stable preferences and facts carried across chats | Wrong facts entrenched and quietly shaping answers — prune it |
| Skills (`SKILL.md` folders loaded when a task matches) | Repeatable playbooks become one command | Stale playbooks — audit them like code |
| MCP connectors (tools or data sources) | Live systems inside the conversation | Broad permissions, injection surface |
| Plugins | Anthropic bundles connectors and skills into one install for teams | Cost and blast radius — keep a human gate |

Definitions, from the vendors: a custom skill "is a folder with a SKILL.md file of instructions, and optionally scripts and reference files, that Claude loads when a task matches the skill's description" ([Claude skills docs](https://claude.com/docs/skills/how-to)[^6]). Projects are "self-contained workspaces with their own chat histories and knowledge bases" ([Claude help](https://support.claude.com/en/articles/9517075-what-are-projects)[^7]). Claude's memory carries context from chats into new conversations and is on by default for Free, Pro, Max and Ultra plans (Team/Enterprise owners control it) ([Claude help](https://support.claude.com/en/articles/11817273-use-claude-s-chat-search-and-memory-to-build-on-previous-context)[^8]). "Any instructions you add here will be applied to all of your conversations with Claude" ([Claude personalization](https://support.claude.com/en/articles/10185728-understanding-claude-s-personalization-features)[^9]). "MCP connectors give Claude access to a tool or data source, and skills teach it how to do a task the way you or your team does it" ([Claude extend docs](https://claude.com/docs/extend/overview)[^10]).

Related guides: [Setting up the AI skills](#/guide/setting-up-the-skills) and [How AI reads a design system](#/guide/how-ai-reads-a-design-system).

## Free, budget and high-end workflows

As of 2026-11-13. Prices and limits change; check the vendor page.

| Plan | Price | Good for | Official page |
| --- | --- | --- | --- |
| ChatGPT Free | Free plan; see OpenAI's pricing page | Occasional brainstorming | [OpenAI pricing](https://chatgpt.com/pricing)[^18] |
| Claude Free | $0 | Occasional Claude chats | [claude.com/pricing](https://claude.com/pricing)[^19] |
| AI Studio free tier | $0 | Big-context research on Gemini | [Google AI Studio billing](https://aistudio.google.com/docs/billing)[^17] |
| Claude Pro | $17/mo annual · $20 monthly | More usage than Free, plus Projects | [claude.com/pricing](https://claude.com/pricing)[^19] |
| GitHub Copilot Pro | $10/mo · 1,500 AI credits | Completions, chat, agents in the editor | [Copilot plans](https://docs.github.com/en/copilot/get-started/plans)[^20] |
| Google AI Pro | $19.99/mo | Everyday Gemini app use | [Google I/O 2026](https://blog.google/products-and-platforms/products/google-one/google-ai-subscriptions/)[^21] |
| Google AI Plus | See Google's plans page | Entry Gemini app tier | [Google plans](https://one.google.com/about/google-ai-plans/)[^22] |
| Claude Max | $100/mo (5× Pro usage, plus $100 API credits/mo) | 5× Pro usage every 5 hours and every week | [claude.com/pricing](https://claude.com/pricing)[^19] |
| Claude Ultra | $200/mo (10× Pro usage, $200 API credits/mo) | 10× Pro usage every week | [claude.com/pricing](https://claude.com/pricing)[^19] |
| ChatGPT Pro | Pro 200 · Pro 500 ($500, GPT-6 Astra Ultrafast) | See OpenAI's page for what each tier includes | [OpenAI help](https://help.openai.com/en/articles/9793128-about-chatgpt-pro-tiers)[^23] |
| Google AI Ultra | $100/mo new developer tier · $200/mo top tier (was $250) | Max Gemini capacity + storage | [Google I/O 2026](https://blog.google/products-and-platforms/products/google-one/google-ai-subscriptions/)[^21] |
| Copilot Pro+ / Max | $39/mo (7,000 credits) · $100/mo (20,000 credits) | Premium models + agents | [Copilot plans](https://docs.github.com/en/copilot/get-started/plans)[^20] |

**Free-tier workflow that works.** Free open-weight models from an aggregator such as [OpenRouter](https://openrouter.ai/docs)[^24] or the AI Studio free tier[^17] for reasoning and big-context research, ChatGPT or Claude free tiers for brainstorming. Accept the caps and batch your prompts. Never put client-confidential material into a free service. Many vendors may use free-tier content to improve their models, and the rules differ by provider, so check before sending anything sensitive.

**Budget workflow that works (≈ $20/month).** Claude Pro as the daily driver, the AI Studio free tier for anything that needs a large context, and the free tiers for throwaways.

**High-end workflow that works.** Use a top-tier model for client work and architecture, a mid-tier model for the rest, and small, fast models for bulk jobs. Add a terminal agent for the repo and a human review before you publish or deploy.

## Limits, privacy and good habits

**Nothing a model says is automatically true.** Large models sometimes state false things in a confident, fluent way. OpenAI's own research says this happens because training rewards confident guessing over saying "I don't know" ([OpenAI research, 2025-09-05](https://openai.com/index/why-language-models-hallucinate/)[^11]). Keep these habits:

1. Verify before trusting; never ship unreviewed client-facing output.
2. Know which surface you are on — free, paid or API — and what it does with your data.
3. Put stable context first (caching), volatile questions last.
4. Budget with the 4-characters-≈-1-token heuristic; count precisely before big jobs.
5. One new feature at a time — memory, projects, connectors each add persistent surface.
6. Keep five to ten golden tasks for your domain; re-run them on any prompt or model change.
7. Pause at human gates: money, publishing, deletions, brand.

**Privacy defaults, from the vendors themselves** (as of 2026-11-13):

| Surface | Used for training? | Opt out / retention | Source |
| --- | --- | --- | --- |
| Claude Free / Pro / Max | Only if you opt in, or if a conversation is flagged for safety review. People who opt in have five-year retention. | Toggle in Settings; Incognito chats are never used | [Anthropic Privacy Center](https://privacy.claude.com/en/articles/10023580-is-my-data-used-for-model-training)[^12] |
| Claude for Work / API | No — by default | Standard API terms | [Anthropic Privacy Center](https://privacy.claude.com/en/articles/7996868-is-my-data-used-for-model-training)[^13] |
| ChatGPT Free / Plus / Pro | Yes by default | Settings → Data controls → turn off "Improve the model for everyone" | [OpenAI help](https://help.openai.com/en/articles/5722486-how-your-data-is-used-for-improving-model-performance)[^14] |
| ChatGPT Business / Enterprise / Edu / API | No — by default | Enterprise terms | [OpenAI help](https://help.openai.com/en/articles/8983130-how-does-chatgpt-use-my-data)[^15] |
| Gemini app (personal account) | Yes by default (Keep Activity on; 18-month auto-delete) | Turn off Keep Activity → no training, chats kept 72 h; human-reviewed chats kept up to 3 years and aren't deleted with your activity; temporary chats never train | [Gemini Apps Privacy Hub](https://support.google.com/gemini/answer/13594961)[^16] |
| Gemini API / AI Studio free tier | Yes — free tier may improve Google products | Enable billing (paid tier is not used for product improvement) | [Google AI Studio billing](https://aistudio.google.com/docs/billing)[^17] |

A paid personal plan does not always change data use. Google's Gemini app notice describes no exception for paid personal plans, so do not assume Plus, Pro or Ultra keeps your chats out of training; check the Keep Activity setting. Claude's consumer plans are opt-in for training; ChatGPT's consumer plans are on by default until you turn the setting off.

**Rate limits and quotas** differ by vendor and plan. Free tiers cap requests per minute and per day. Claude's paid plans cap usage in rolling five-hour windows plus a weekly allowance. A failed request can still count against a cap. If a call fails, check your quota before you retry in a loop.

## Where to read more

All sources below are the vendors' own pages. Figures were read from them on 2026-11-13, and prices change often, so re-check before you budget.

[^1]: Claude platform pricing — Anthropic. https://platform.claude.com/docs/en/about-claude/pricing. Accessed 2026-11-13.
[^2]: Prompt caching — Anthropic. https://platform.claude.com/docs/en/build-with-claude/prompt-caching. Accessed 2026-11-13.
[^3]: API pricing — OpenAI. https://developers.openai.com/api/docs/pricing. Accessed 2026-11-13.
[^4]: Gemini API pricing — Google. https://ai.google.dev/gemini-api/docs/pricing. Accessed 2026-11-13 and 2026-11-17. On 2026-11-17 the page listed Gemini 3.5 Flash, 3.1 Flash-Lite, 3.1 Pro Preview, 3 Flash Preview and the 2.5 models with prices, but not the Gemini 4 line.
[^5]: Building effective agents — Anthropic. https://www.anthropic.com/engineering/building-effective-agents. Accessed 2026-11-13.
[^6]: Skills — Claude docs. https://claude.com/docs/skills/how-to. Accessed 2026-11-13.
[^7]: What are projects? — Claude help. https://support.claude.com/en/articles/9517075-what-are-projects. Accessed 2026-11-13.
[^8]: Use Claude's chat, search and memory to build on previous context — Claude help. https://support.claude.com/en/articles/11817273-use-claude-s-chat-search-and-memory-to-build-on-previous-context. Accessed 2026-11-13.
[^9]: Understanding Claude's personalization features — Claude help. https://support.claude.com/en/articles/10185728-understanding-claude-s-personalization-features. Accessed 2026-11-13.
[^10]: Extend Claude with connectors and skills — Claude docs. https://claude.com/docs/extend/overview. Accessed 2026-11-13.
[^11]: Why language models hallucinate — OpenAI. https://openai.com/index/why-language-models-hallucinate/. Accessed 2026-11-13.
[^12]: Is my data used for model training? — Anthropic Privacy Center. https://privacy.claude.com/en/articles/10023580-is-my-data-used-for-model-training. Accessed 2026-11-13.
[^13]: Is my data used for model training? (work and API) — Anthropic Privacy Center. https://privacy.claude.com/en/articles/7996868-is-my-data-used-for-model-training. Accessed 2026-11-13.
[^14]: How your data is used for improving model performance — OpenAI help. https://help.openai.com/en/articles/5722486-how-your-data-is-used-for-improving-model-performance. Accessed 2026-11-13.
[^15]: How does ChatGPT use my data? — OpenAI help. https://help.openai.com/en/articles/8983130-how-does-chatgpt-use-my-data. Accessed 2026-11-13.
[^16]: Gemini Apps Privacy Hub — Google. https://support.google.com/gemini/answer/13594961. Accessed 2026-11-13.
[^17]: Billing — Google AI Studio. https://aistudio.google.com/docs/billing. Accessed 2026-11-13.
[^18]: ChatGPT pricing — OpenAI. https://chatgpt.com/pricing. Accessed 2026-11-13.
[^19]: Claude pricing — Anthropic. https://claude.com/pricing. Accessed 2026-11-13.
[^20]: Plans — GitHub Copilot docs. https://docs.github.com/en/copilot/get-started/plans. Accessed 2026-11-13.
[^21]: Google AI subscriptions — Google blog. https://blog.google/products-and-platforms/products/google-one/google-ai-subscriptions/. Accessed 2026-11-13.
[^22]: Google AI plans — Google. https://one.google.com/about/google-ai-plans/. Accessed 2026-11-13.
[^23]: About ChatGPT Pro tiers — OpenAI help. https://help.openai.com/en/articles/9793128-about-chatgpt-pro-tiers. Accessed 2026-11-13.
[^24]: OpenRouter documentation — OpenRouter. https://openrouter.ai/docs. Accessed 2026-11-13.
[^25]: Artificial Analysis LLM leaderboard (Intelligence Index, cost per task) — Artificial Analysis. https://artificialanalysis.ai/leaderboards/models. Accessed 2026-11-17. The page showed no update date.
[^26]: Artificial Analysis Coding Agent Index, as shown by BenchLM (data captured 2026-11-16) — https://benchlm.ai/benchmarks/aaCodingAgents. Accessed 2026-11-17. Original: https://artificialanalysis.ai/agents/coding-agents.
[^27]: Artificial Analysis Text to Image Arena — Artificial Analysis. https://artificialanalysis.ai/text-to-image/arena/leaderboard-text. Accessed 2026-11-17. It lists H3-Image as the leading open-weights model (rating 1066, rank 27).
[^28]: OpenAI API pricing as tracked by BenchLM (synced 2026-11-17) — https://benchlm.ai/openai/api-pricing. Accessed 2026-11-17. A third-party table; OpenAI's own pricing page (https://developers.openai.com/api/docs/pricing) could not be opened that day, so confirm there.
[^29]: China AI Pricing 2026 — Capital and Compute (updated 2026-10-24). https://capitalandcompute.net/md/china-ai-pricing.md. Accessed 2026-11-17. A third-party table. The tracking site ModelGrep (https://modelgrep.com/leaderboard) lists a lower input price for Kimi K3.1 Pro, so confirm with the vendor.
