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
- **Smartness score** is the Artificial Analysis Intelligence Index (higher is better), out of the 111 models it ranks.[^25] Coding uses its Coding Agent Index.[^26] Images use its image Arena rating.[^27]
- **Free** means you can use it in an app's free plan, with limited use. Limits change often, so expect to hit a cap now and then. Free plans may also use your chats to improve their models, so never paste client secrets into them.
- **Budget** means a plan of about $20 a month, or a model that costs up to about $2 input / $10 output per million tokens through the API.
- **Costly** is everything above that.

### Quick picks by need

| Your need | Free (limited use) | Budget | Costly |
| --- | --- | --- | --- |
| Everyday chat and quick answers | **Claude Free** with Sonnet 5.5.[^31] **ChatGPT Free** with GPT-5.6 Luna: everyday text chats are unlimited, and images, files and voice have separate limits.[^30] **Gemini** free plan with Flash-Lite.[^32] | A $20-a-month plan (Claude Pro, Google AI Pro). Or Claude Haiku 5.5 or GPT-6 Luna for fast, cheap answers. | Rarely worth it. A top model is more than chat needs. |
| Research and long documents | **ChatGPT Free** (it can search the web and read files you upload, with limits).[^30] **Claude Free** with Sonnet 5.5. **DeepSeek** (free chat with web search, per a June 2026 review).[^33] | Claude Sonnet 5.5 (1M-token window) or GPT-6.2 Sol. Gemini 4 Hydrogen also has a 1M window. | Claude Fable 5.2 (smartness 65, first place), GPT-6.2 Astra (62) or Gemini 4 Carbon (60).[^25] |
| Coding, including front-end | **Claude Free** with Sonnet 5.5. **ChatGPT Free**. **DeepSeek**, which is open-weight.[^33] | Claude Sonnet 5.5 (56.3% in Claude Code on the coding index) or GPT-6.2 Sol (52.2% in Codex).[^26] | Claude Fable 5.2 (58.5%) or Claude Opus 5.5 (58.2%) in Claude Code. Gemini 4 Carbon in Antigravity (55.5%). GPT-6 Astra in Codex (53.1%).[^26] The top three are within 0.3 points, so treat them as tied. |
| Designing: screenshots, UI feedback, design to code | **ChatGPT Free**, which lets you upload images and files.[^30] **Claude Free** and **Gemini** free: try one of your own screenshots and see how well it reads it. | Gemini 4 Hydrogen, Claude Sonnet 5.5 or GPT-6.2 Sol. | Gemini 4 Carbon, Claude Opus 5.5 or GPT-6.2 Astra for deep visual reasoning across many screens. |
| Writing and editing | **Claude Free** with Sonnet 5.5. **ChatGPT Free**. **Gemini** free plan. | Claude Sonnet 5.5, GPT-6.2 Sol or Gemini 4 Hydrogen. | Claude Opus 5.5 or GPT-6.2 Astra for brand voice and long documents. |
| Data and spreadsheets | **ChatGPT Free** has a data analysis tool, with limits.[^30] **Claude Free** with Sonnet 5.5. Check any numbers by hand. | GPT-6.2 Sol or Claude Sonnet 5.5. | GPT-6.2 Astra or Claude Opus 5.5 for messy data and multi-step analysis. |
| Making images | **ChatGPT Free** can create images, with its own limit.[^30] Other assistants, such as the Gemini app, also make images; check their current free limits. | MAI-Image-2.7-Flash (about $10 per 1,000 images). Nano Banana 2.1 or MAI-Image-2.7 (about $34 per 1,000).[^27] | GPT Image 2.6 (first place on the image Arena, about $211 per 1,000 images).[^27] |

Two honest limits. First, we could not find a live public ranking made specifically for design feedback, writing or spreadsheets. For those rows we used the general Intelligence Index, so test the shortlist on your own work. Second, the order inside a band is close. A few points on a leaderboard rarely matter more than price and speed for you. Free plans change often: Google moved free Gemini users to Flash-Lite only on 9 October 2026, for example.[^32]

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

The practical form of the pattern is a loop: plan → worker executes → delegator reviews, with you deciding between steps. Use the cheaper models as workers and the strongest one as the judge, or skip the split entirely for one-shot questions where the overhead costs more than it saves.

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

As of 2026-11-13. Prices and limits change; check the vendor page. Each workflow below says which tier of model does which job. A "top-tier" model is the strongest and most costly one a vendor sells, such as Claude Fable 5.2 or Claude Opus 5.5, GPT-6.2 Astra, or Gemini 4 Carbon. A "mid-tier" model is the everyday choice, such as Claude Sonnet 5.5, GPT-6.2 Sol, or Gemini 4 Hydrogen. A "small" model is the fast, cheap one, such as Claude Haiku 5.5, GPT-6 Luna, or Gemini Flash-Lite.

### Free workflow

**What you get.** Claude Free[^19] gives limited chats with Claude Sonnet 5.5, a mid-tier model. ChatGPT Free[^18] gives limited use of a small model (GPT-5.6 Luna). Google's Gemini app and the AI Studio free tier[^17] give a small Gemini model (Flash-Lite) with a very large context window. Open-weight models such as DeepSeek are free through aggregators such as [OpenRouter](https://openrouter.ai/docs)[^24], with rate limits.

**How to work within the limits.**

1. Plan in one place. Use Claude Free (mid-tier) for the hard thinking: the brief, the structure of a page, a tricky bug. Spend your few messages on the questions that need the best reasoning you can get for free.
2. Hand the long reading to Gemini. Paste a long document, a long thread of feedback or a whole codebase into AI Studio and ask for a summary or a list of problems. Its large context is the reason to use it.
3. Use ChatGPT Free (small-model) for quick jobs: rewording a button label, naming ideas, a first draft of alt text.
4. Check the result somewhere else. Paste the answer to a second free assistant and ask it to find mistakes. Two small checks are cheaper than one wrong answer.
5. Batch your prompts. Put five related questions in one message instead of sending five messages, so one cap does more work.

**Example: a designer's free week.** Monday, summarise user interviews in Gemini. Tuesday, ask Claude Free for three layout options and the reasons for each. Wednesday, use ChatGPT Free to write microcopy for the chosen layout. Thursday, ask Claude Free to check the copy against your contrast and reading-level rules. Friday, ask a second assistant to review what you will send.

**Watch for.** Free plans can change or run out mid-task. Many vendors may use free-tier content to improve their models, and the rules differ by provider, so check before you send anything private. Never put client-confidential material into a free service.

### Budget workflow (about $20 a month)

**What you get.** Claude Pro costs $17 a month billed yearly or $20 monthly[^19]. Google AI Pro is $19.99 a month[^21], and Google AI Plus is an entry tier[^22]. GitHub Copilot Pro is $10 a month with 1,500 AI credits for editor completions, chat and agents[^20]. ChatGPT also has paid plans[^23]. Pick one daily driver, not all four. At this price a mid-tier model does almost everything, and you get a few messages with a top-tier model for the hardest problems.

**The split.**

- **Mid-tier model as the daily driver.** Claude Sonnet 5.5, GPT-6.2 Sol or Gemini 4 Hydrogen. It writes code, reviews designs, drafts documents and plans.
- **Small model for bulk.** Claude Haiku 5.5, GPT-6 Luna or Flash-Lite. Use it to tag a hundred icons, rename files, or clean up a spreadsheet of copy.
- **Top-tier model for one hard moment.** If you have a few messages, spend them on an architecture choice, a confusing bug, or a final review of something that ships. Do not use them for drafts.
- **Free tiers for throwaways.** Anything you do not mind losing goes to a free plan so your paid limit lasts.

**Example: a developer's budget week.** Pay for one plan, such as Claude Pro. Monday, plan the feature with the mid-tier model and write the steps down. Tuesday and Wednesday, build with the mid-tier model in the editor, one small step at a time, running the tests after each. Thursday, use the small model for the boring bulk work, such as updating 60 strings. Friday, spend two top-tier messages on a review of the whole change, then read the review yourself before you merge.

**Watch for.** Paid plans still have usage limits that reset every few hours or every week. If you hit the limit often, move the bulk jobs to a small model before you upgrade.

### High-end workflow

**What you get.** Higher plans raise the limits and open the top-tier models. Claude Max is $100 a month (5x Pro usage plus $100 in API credits) and Claude Ultra is $200 a month (10x Pro usage)[^19]. ChatGPT Pro has Pro 200 and Pro 500 tiers, and the $500 tier includes GPT-6 Astra Ultrafast[^23]. Google AI Ultra has a $100 developer tier and a $200 top tier[^21]. GitHub Copilot Pro+ is $39 a month and Max is $100 a month, with more credits for premium models[^20]. Teams that pay by the token use the API instead[^1].

**The split.**

- **Top-tier model as the planner and judge.** Claude Fable 5.2, Claude Opus 5.5, GPT-6.2 Astra or Gemini 4 Carbon. It writes the plan, makes the architecture calls, and reviews finished work against a clear bar (tests pass, contrast is at least 4.5:1).
- **Mid-tier models as the builders.** Claude Sonnet 5.5, GPT-6.2 Sol or Gemini 4 Hydrogen do the bulk of the writing and coding, one planned step at a time. Several can work on separate steps at once.
- **Small models for volume.** Claude Haiku 5.5, GPT-6 Luna or Flash-Lite sort, tag, translate and format.
- **A terminal agent for the repo, and you for the gates.** The agent edits files and runs tests. You approve anything that ships, spends money, or deletes data.

**Example: shipping a new feature.** The top-tier model reads the request and writes a plan of ten small steps with a test for each. Mid-tier models build the steps in order, and a small model writes the release notes and updates the docs. The top-tier model then reviews the full change and lists risks. You read the list, fix the two that matter, and press deploy yourself.

**Example: a design-system refresh.** A small model lists every color and size used across the screens. A mid-tier model groups them into tokens. The top-tier model checks the result against your 4.5:1 text contrast and 3:1 interface contrast rules and flags what breaks in dark mode. You decide which fixes keep the brand.

**Watch for.** Top-tier models cost the most per message and are slower. Use them where a mistake is costly and the work is hard to check, and use a cheaper tier everywhere else. See "Delegator and worker workflows" above for how to hand work between tiers.

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
[^30]: ChatGPT Free tier FAQ — OpenAI help. https://help.openai.com/en/articles/9275245-chatgpt-free-tier-faq. Accessed 2026-11-17. Free users get GPT-5.6 Luna, "unlimited everyday text chats", and web search, file uploads, data analysis and image generation with separate limits. The page says the default model and limits can change.
[^31]: "Claude Opus 5.5 is included with Pro, and Free still misses out" — Notebookcheck, 2026-09-23. https://www.notebookcheck.net/Claude-Opus-5-5-is-included-with-Pro-and-Free-still-misses-out.1406452.0.html. Accessed 2026-11-17. Reports that free accounts get Sonnet and Haiku, and Opus 5.5 is paid-only. Anthropic's own free-usage page (https://support.claude.com/en/articles/8602283-about-free-claude-usage) says usage resets on a rolling five-hour session and varies with demand, but does not name the models.
[^32]: "Google moves free Gemini to Flash-Lite and launches Nano Banana 2.1" — The Next Web, 2026-10-09. https://thenextweb.com/news/gemini-flash-lite-free-users-nano-banana-2-1. Accessed 2026-11-17. A news report, not a Google page.
[^33]: "Best Free AI Chatbots You Can Actually Use in 2026" — fast.io, updated 2026-06-06. https://fast.io/resources/best-free-ai-chatbot-2026/. Accessed 2026-11-17. A third-party review that is five months old; check that DeepSeek's free chat still offers this.
