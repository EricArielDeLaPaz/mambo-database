---
id: ai-guide
title: AI models and workflows: a working guide
summary: How to choose a starting model, set up delegator-and-worker workflows, and know when to pay for which plan, from the pricing and data pages of the big vendors.
topic: Design systems & AI
level: Intermediate
order: 15
---

This is a working reference for designers and developers who use AI tools day to day: which model to start with, how to set up a delegator-and-worker workflow, what to pay for, and what to watch out for. Everything here is **as of 2026-11-13**, with links to the official pages so you can check before you spend. Prices, plans and limits change often — treat the links, not the numbers, as the durable part of this guide.

> **Label reminder.** Figures marked [official] come straight from the vendors' own pricing, documentation or help pages. Claims we could not confirm on an official page are either written without numbers or left out. No third-party blog prices appear here.

## Choosing a starting model

Every model family ships with tiers: small and fast, mid, and large and expensive. Start on the **smallest tier that passes a quick test on your own hardest five examples** and only move up. For a designer-developer the rule of thumb looks like this (task → where to start → why):

| Task | Start with | Move up when | Stay cheap because |
| --- | --- | --- | --- |
| Daily chat and quick answers | Free tier or small-class model | Answers are vague or need multi-step reasoning | Most turns don't need frontier reasoning |
| Writing (copy, email, docs) | Mid tier | Structural rewrites or brand voice come out flat | Small models handle short edits fine |
| Designing (critiques, naming, tokens) | Mid tier with image input | You need deep visual reasoning across many frames | Most design feedback is pattern-matching |
| Coding | Mid tier for edits; large tier for multi-file refactors | The model can't hold the diff in its head | Latency of big models compounds over many turns |
| Researching | Large tier with a big context window | Sources must be read whole and cited precisely | Large context costs tokens you are billed for |

Anthropic's own wording: "Choose Haiku for simple tasks, Sonnet for most production workloads, and Opus for the most complex reasoning." [Official: Claude platform pricing page](https://platform.claude.com/docs/en/about-claude/pricing)[^1]

**Move up when** (a) the same task needs two or more retries at the small tier, (b) output quality varies run to run, (c) the task spans many files or frames, or (d) the stakes are client work. **Move down when** (a) the task is mechanical, (b) you need speed, or (c) your budget is capped. This tiering is practice, not a lab finding; use it as a starting point and test on your own examples.

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
[^4]: Gemini API pricing — Google. https://ai.google.dev/gemini-api/docs/pricing. Accessed 2026-11-13. (Per-token prices sit behind interactive controls on that page, so this guide prints none.)
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
