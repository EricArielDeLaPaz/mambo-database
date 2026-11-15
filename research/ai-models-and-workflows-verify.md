# Research: ai-models-and-workflows — verification pass (item 2)

**For:** Mambo Database visual guide "AI models and workflows" (DESIGN.md item 5, Phase 2)
**Date accessed:** 2026-11-13 (all entries)
**Method:** direct reads of vendor pages in the automation browser; where a vendor page renders blank without JavaScript or blocks automation traffic, the exact wording was taken from a search-index excerpt of that same official page and is labelled **[official excerpt]`api-docs.deepseek.com`** like this. No third-party site fills a gap. Claims that stayed unreachable are marked **unverified** and must not appear in published copy.
**Labels:** `[official]` direct read of the vendor's own page · `[official excerpt]` vendor's own page text, copied via a search engine instead of a direct read (page was blank/blocked here) · `[unverified]` could not be confirmed on an official page · `[first-file]` claim carried from `research/ai-models-and-workflows.md`.

---

## 0. Honest limits of this pass

- **Google per-token prices**: `ai.google.dev/gemini-api/docs/pricing` loads (20,668 chars) but every price sits inside interactive controls with no `$` text in the DOM, so the exact input/output rates could **not** be extracted here. Marked unverified; the guide must not print a per-token Gemini figure.
- **`chatgpt.com/pricing`, `one.google.com/about/google-ai-plans`, `openai.com/chatgpt/pricing`**: all render 0 chars of text in the automation browser. ChatGPT/Google consumer plan facts below come from the vendors' own help/blog pages (or excerpts of them), never from third parties.
- **x.ai**: blocked by a Cloudflare security check (Cloudflare Ray ID a5a2ad4f8c222d44). The xAI row is **removed** per the plan.
- **`help.openai.com` articles** render 0 chars; their wording below is `[official excerpt]`.
- **Anthropic PDF rate cards** are not quoted here; the live docs pages serve as the current authority.

---

## 1. Anthropic prompt caching

Source: platform.claude.com/docs/en/build-with-claude/prompt-caching, direct read, 2026-11-13.

- **Cache-read fraction of base input price:**

> "Cache read tokens are 0.1 times the base input tokens price (see the table footnote for per-model exceptions)."
> Footnotes on the same page:
> "Cache hits and refreshes on Claude Fable 5.2, Claude Mythos 5.2, Claude Fable 5.1, and Claude Mythos 5.1 are priced at 0.025x the base input price."
> "Cache hits and refreshes on Claude Opus 5.5 and Claude Sonnet 5.5 are priced at 0.05x the base input price."
> Section "How to budget": "Cache reads: When cached content is used (10 percent of base input token price, with per-model exceptions)"

- **Cache write cost:**

> "Cache write tokens with a 5-minute TTL are 1.25 times the base input tokens price."
> "Cache write tokens with a 1-hour TTL are 2 times the base input tokens price."
> "Cache writes: When new content is written to the cache (25 percent more than base input tokens for 5-minute TTL)"

- The same page confirms current model names: Claude Fable 5.2, Claude Mythos 5.2, Claude Fable 5.1, Claude Mythos 5.1, Claude Opus 5.5, Claude Sonnet 5.5.

**Verdict on the first file:** the "0.05×–0.1×" cache-read multiplier was incomplete — Fable/Mythos lines hit 0.025×. The guide should quote the three-tier rule: 0.025× (Fable/Mythos), 0.05× (Opus/Sonnet 5.5), 0.1× (all other models incl. Haiku 5.5). 5-minute writes cost 1.25×; 1-hour writes 2×.

## 2. Plan names and monthly prices (official)

### Claude — claude.com/pricing, direct read, 2026-11-13

Plans listed on the page: **Free, Pro, Max, Ultra**, plus Team & Enterprise.

| Plan | Price | Wording on the page |
|---|---|---|
| Free | $0 | "Free for everyone" |
| Pro | $17/month (annual, $200 billed up front) · $20 if billed monthly | "Everything in Free, plus: More usage than Free, every 5 hours and every week* … Projects" |
| Max | $100 | "Everything in Pro, plus: 5x Pro usage every 5 hours and every week* … $100 a month in API credits to build on the Claude Platform† New" |
| Ultra | $200 | "Everything in Max, plus: 10x Pro usage every week* … $200 a month in API credits, up from $100 on Max† New" |
| Team & Enterprise | Enterprise: "$20 per seat per month plus usage billed at API rates" | — |

FAQ on the same page: "Most accounts have a limit that resets on a rolling five-hour session window, and paid plans add weekly limits on top." Plan list: **Free, Pro, Max, Ultra, Team, Enterprise**. There is no "Max 20×" name; **Ultra is the official name** for the $200 tier.

**Verdict on the first file:** "Claude Ultra / 'Max 20×' $200 [third-party]" → now **[official]** (Ultra, $200, claude.com/pricing). "Claude Max $100 (5× Pro)" → **[official]**. Claude Pro $17 annual / $20 monthly → **[official]** (was labelled partly third-party).

### ChatGPT — help.openai.com / chatgpt.com/pricing, accessed 2026-11-13

- **Plus** — "Price: $20/month (billed monthly). … API usage is separate and billed independently." — help.openai.com/en/articles/6950777-what-is-chatgpt-plus **[official excerpt]**
- **Pro** — "ChatGPT Pro now offers **Pro 500**, a new $500/month plan that includes GPT-6 Astra Ultrafast and GPT-6.1 Sol Ultrafast. **Pro 200** is also available for new subscriptions again." — help.openai.com/en/articles/9793128-about-chatgpt-pro-tiers **[official excerpt]**. The first file's "up to $200/mo (plans reported $100–$500)" is confirmed: there are exactly two Pro tiers, $200 and $500.
- **Free** — the plan exists and is listed on chatgpt.com/pricing; the price is $0. The pricing page itself renders blank in the automation browser; plan names also confirmed across multiple official help articles. **[official excerpt]**
- **ChatGPT Go** — not confirmed on any page reached; do not print a Go price.

**Verdict on the first file:** "ChatGPT Pro up to $200/mo [official]" → correct but incomplete: official pages now describe **Pro 200** and **Pro 500**. "ChatGPT Free [official]" stands.

### Google AI — support.google.com / blog.google, accessed 2026-11-13

- **Plan line-up (official):** "Google AI Plus", "Google AI Pro", "**Google AI Ultra** — choose between **Google AI Ultra 5x (20 TB of storage)** and **Google AI Ultra 20x (30 TB of storage)**" — support.google.com/googleone/answer/16286513 (Ultra), /16476811 (Pro), /14534406 (Plus) **[official excerpt]**.
- **Superseded names:** "Gemini Advanced"/"Google One AI Premium" retired; the support page text still shows legacy content but the live plan names are Plus/Pro/Ultra.
- **Google AI Pro price: $19.99/month** — "Unless cancelled earlier, Google AI Pro will automatically charge $19.99/month after the trial ends." — blog.google/innovation-and-ai/products/gemini-app/student-offer-google-ai (Back to School 2026) **[official excerpt]**
- **Google AI Plus price: $4.99/month or $7.99/month — official sources conflict.** Back-to-School 2026 post: "Google AI Plus will automatically charge $4.99/month …" while the availability announcement says "In the U.S., Google AI Plus is available for **$7.99/month**" — blog.google/products-and-platforms/products/google-one/google-ai-plus-availability/ **[official excerpt]**. Likely a price change between the two posts; **treat Plus pricing as unresolved until checked on one.google.com/about/google-ai-plans (page unreachable here) or in Eric's browser.**
- **Google AI Ultra prices (Google I/O 2026, official):** "We're launching a **$100/month AI Ultra plan**, specifically tailored for developers…" and "We're also reducing the monthly price of our top-tier AI Ultra plan **from $250 to $200**. You'll get the exact same capabilities — including a 20X higher usage limit in the Gemini app and Google Antigravity — now at a lower cost." — blog.google/products-and-platforms/products/google-one/google-ai-subscriptions/ "Google AI subscription updates from Google I/O 2026" **[official excerpt]**. (The original 2025-05-20 Ultra launch price was $249.99/month — blog.google/products-and-platforms/products/google-one/google-ai-ultra/ — now superseded.)
- The first file's "$99.99 / $199.99 for Ultra" is **wrong**; the official I/O 2026 figure is $100 (new tier) and $200 (top tier, was $250).

### GitHub Copilot — docs.github.com/en/copilot/get-started/plans, search-index content of the official page, 2026-11-13

Direct URL: https://docs.github.com/en/copilot/get-started/plans · also https://docs.github.com/en/enterprise-cloud@latest/copilot/get-started/plans

> "The following table shows what's included with each paid plan.
> | Copilot Pro | $10 USD | 1,000 | 500 | 1,500 |
> | Copilot Pro+ | $39 USD | 3,900 | 3,100 | 7,000 |
> | Copilot Max | $100 USD | 10,000 | 10,000 | 20,000 |
> Copilot Free and Copilot Student both have an allowance of AI credits."

> "Copilot Business | $19 USD | 1,900
> Copilot Enterprise | $39 USD | 3,900" per user per month; credits are pooled at the billing entity; "1 AI credit = $0.01 USD"; "Code completions and next edit suggestions are not billed in AI credits and remain unlimited for all paid plans."
> June–September 2026 promotion: Business 3,000 / Enterprise 7,000 credits per user per month (usage-based billing docs).
> **Settle `$10 AI credits` vs `7,000 AI credits`:** the first file was wrong on Pro ("$10 in AI credits/month") — Pro is **\$10/month for 1,500 total AI credits** (1,000 base + 500 flex). **7,000 AI credits is the Pro+ allowance** (\$39/month). Business = **1,900** (not "1,900/7000"), Enterprise = **3,900**. Copilot Max (new) = **20,000** (\$100/month).

## 3. Current model names and API prices

### Anthropic — platform.claude.com/docs/en/about-claude/pricing, direct read, 2026-11-13 (USD per MTok)

| Model | Input | Output | Cache hit | Batches in / out | Fast mode |
|---|---|---|---|---|---|
| Claude Fable 5.2 | $8.00 | $40.00 | $0.20 (0.025×, official footnote) | $4.00 / $20.00 | $16.00 / $80.00 |
| Claude Opus 5.5 | $4.00 | $20.00 | $0.20 (0.05×) | $2.00 / $10.00 | $8.00 / $40.00 |
| Claude Sonnet 5.5 | $2.00 | $10.00 | $0.10 (0.05×) | $1.00 / $5.00 | — |
| Claude Haiku 5.5 | $0.10 | $0.50 | $0.01 (0.1×) | $0.05 / $0.25 | — |
| Claude Fable 5.1 | (priced like Fable 5.2 class; cache hit $0.25, 0.025×) | | | | |
| Claude Mythos 5.2 / 5.1 | (Mythos-class; cache hit 0.025×) | | | | |

Also on the page: Opus 4.8–4.1, Opus 4, Sonnet 5/4.6/4.5/4, Haiku 4.5, Fable 5/Mythos 5 legacy rows; "1M token context for Claude 4.6+ models is included except on Haiku 5.5". Model-role wording: "Choose Haiku for simple tasks, Sonnet for most production workloads, and Opus for the most complex reasoning." (same page)

**First-file correction:** the first file priced "Opus 5.5 ($8 / $40)" from an anthropic.com/claude/opus snippet — that is the **Fast mode** price. Standard-tier Opus 5.5 is **$4 / $20**. Anthropic itself markets Haiku/Sonnet/Opus as the tier trio (Haiku → Sonnet → Opus), full stop.

### OpenAI — developers.openai.com/api/docs/pricing, direct read, 2026-11-13 (USD per MTok)

Structure: **Flagship models** split into Standard / Flex/Batch (−50%) / Fast ("Priority processing was renamed Fast mode on July 30, 2026") / Ultrafast (only gpt-6-astra and gpt-6.1-sol).

**Standard tier:**

| Model | Input | Output | Cached input | 30m write | 12h write |
|---|---|---|---|---|---|
| gpt-6-astra | $10.00 | $50.00 | $1.00 (0.1×) | $12.50 (1.25×) | $25.00 (2.5×) |
| gpt-6.1-sol | $2.00 | $10.00 | $0.10 | $2.50 | $5.00 |
| gpt-6.1-terra | $1.00 | $5.00 | $0.05 | $1.25 | $2.50 |
| gpt-6-luna | $0.10 | $0.50 | $0.01 | $0.125 | $0.25 |

**Flex/Batch tier:** half of Standard (astra $5/$25; sol $1/$5; terra $0.50/$2.50; luna $0.05/$0.25). **Fast tier:** 2× Standard. **Ultrafast:** astra $60/$300, sol $12.00/$60.00. "GPT-5.6 Sol's promotional pricing is available until November 30, 2026." (footnote on the page, Price details)
**Specialized:** gpt-6-cyber ($20/$100, Daybreak Cyber Trusted Access), gpt-6-rosalind ($15/$75, Rosalind Life Sciences), gpt-6-astra-law ($10/$50; "GPT-6 Astra for Law promotional pricing is available at least through December 31, 2026"), chat-latest ($5/$30). Deprecated: gpt-4.1-2025-04-14 ($25/$12) legacy.

- **gpt-5.4** — official model page EXISTS: developers.openai.com/api/docs/models/gpt-5.4 (`.md` version read 2026-11-13): "Model ID: `gpt-5.4` … GPT-5.4 is a flagship model for complex professional work. … Default snapshot: `gpt-5.4-2026-03-05` … Reasoning.effort supports: none (default), low, medium, high and xhigh." **Not on the current pricing page** — no current price can be quoted → **price unverified**.
- **gpt-5.2** — official model page EXISTS: developers.openai.com/api/docs/models/gpt-5.2 — "GPT-5.2 is our previous flagship model for complex professional work. We recommend using the latest GPT-6 Astra." **Not on the current pricing page** → **price unverified**.
- **"GPT-5 (launch $1.25/$10, 2025-08, community)"** — not on the current pricing page (GPT-5 family was delisted from Flagship); the $1.25/$10 figure cannot be re-confirmed on an official page → **price unverified, remove from published copy**.
- **"GPT-5 mini / nano-class" small tier** — not on the current official pricing page; the official small tier is now **gpt-6-luna** ($0.10/$0.50). The first file's small-tier naming is outdated.
- **"Neontron Ultra", "Inkling"** — no official source found on any vendor page read (they circulate as third-party/OpenRouter-style free-tier names) → **remove**.
- **Grok 4.6 / Grok 4.3 pricing** — x.ai unreachable (Cloudflare block); only third-party blogs carry those numbers → **remove** per the plan.
- **Regional uplift:** "Regional processing (data residency) endpoints are charged a 10% uplift for models released on or after March 5, 2026. FedRAMP endpoints are also charged a 10% uplift." (pricing page footnote)
- **Web search tool:** $10.00 / 1k calls + content tokens billed at model rates. (Optional context for the guide.)

### Google — ai.google.dev/gemini-api/docs/pricing, direct read, 2026-11-13; per-token prices not extractable (see §0)

Official model line-up on the page (no prices readable here):

> "Gemini 4 Carbon — `gemini-4-carbon` — Our most capable reasoning model, built for complex software engineering, deep mathematical and scientific problem solving … long-decode generation up to 1M tokens." (not available on the Free tier)
> "Gemini 4 Argon — `gemini-4-argon` — Our efficient Gemini 4 frontier reasoning model. It delivers Gemini 4 intelligence with faster responses and lower token spend per turn …"
> "Gemini 4 Hydrogen — `gemini-4-hydrogen` — Brings cutting-edge intelligence to everyone, with speed and efficiency for everyday coding and agentic workflows, featuring a unified 1M-token context window …"
> "Gemini 3.8 Flash — `gemini-3.8-flash` — Our most intelligent Flash model, engineered for long-horizon software engineering, autonomous agents, and complex enterprise workflows."
> "Gemini 3.6 Flash — `gemini-3.6-flash` — Our previous generation Flash model …"
> "Gemini 3.5 Transcribe | Transcribe Live | Flash-Lite · Gemini Omni 1.2/1.1 Flash · Gemini 3.8 Live · Gemini 3.5 Live Translate · Gemini 3.1 Flash-Lite · Gemini 3.1 Pro Preview · Gemini 3 Flash Preview · Gemini 3 Pro Image (Nano Banana Pro) · Gemini 2.5 Pro · Gemini 2.5 Flash · Gemini 2.5 Flash-Lite …"

i.e. the first file's "Gemini 3 Pro-class" large tier is outdated: the official frontier is the **Gemini 4 line (Carbon / Argon / Hydrogen)**, Flash-class is **Gemini 3.8 Flash**, and legacy 2.5/3 Pro rows remain listed.

**Per-token prices: unverified** (controls render client-side; no numeric content present in the extracted DOM). The guide must link the page and print no figure.

### DeepSeek — api-docs.deepseek.com/quick_start/pricing, direct read, 2026-11-13

> "Model prices are listed in units of per 1M tokens." — MODEL: `deepseek-flash` · `deepseek-v4-pro`; MODEL VERSION: DeepSeek-V4.1-Flash-1017 · DeepSeek-V4-Pro-0813; "CONTEXT LENGTH 1M · MAX OUTPUT MAXIMUM: 384K"; off-peak cache-hit inputs listed at $0.003 / $0.022 (full off-peak/peak grid on page); base URLs api.deepseek.com and api.deepseek.com/anthropic.

The first file's "$0.209/$0.310, 163K ctx, V3.2" is **outdated** — V3.2 is no longer on the official pricing page. Replace with the V4 line or omit. Comparative claims like "extremely cheap API" remain safe at a qualitative level.

## 4. Consumer chat apps — training defaults and retention (official)

### Anthropic — privacy.claude.com / anthropic.com, accessed 2026-11-13

**Consumer (Free, Pro, Max — article dated March 16, 2026)** — privacy.claude.com/en/articles/10023580-is-my-data-used-for-model-training — direct read, 2026-11-13:

> "We will use your chats and coding sessions (including to improve our models) if: You choose to allow us to use your chats and coding sessions to improve Claude … Your conversations are flagged for safety review (in which case we may use or analyze them to improve our ability to detect and enforce our Usage Policy, including training models for use by our Safeguards team, consistent with Anthropic's safety mission) … By otherwise explicitly opting in to training (e.g. joining our Trusted Tester Program)."
> "Chat and coding session data we may use for improving our models includes the entire related conversation, along with any content, custom styles or conversation preferences, as well as data collected when using Claude for Chrome. It does not include raw content from connectors (e.g. Google Drive)…"
> "Incognito chats are not used to improve Claude, even if you have enabled Model Improvement…"

**Opt-in, not opt-out** (anthropic.com/news/updates-to-our-consumer-terms, 2025-08-28, official: "Claude Free, Pro, and Max users can now opt in to having conversations used to improve models, with a five-year retention period for participants.")
Settings page: privacy.claude.com/en/articles/12109829-how-do-i-change-my-model-improvement-privacy-settings (Aug 3, 2026).

**Commercial (Claude for Work, Anthropic API)** — privacy.claude.com/en/articles/7996868 — excerpt: "For our commercial products such as Claude for Work and the Anthropic API … **By default, we will not use your inputs or outputs from our commercial products to train our models.**"

Note: the privacy article still says "Free, Pro, Max"; Ultra is covered under consumer products (Max-family) but is not named in the article — flag, do not infer.

### OpenAI — help.openai.com, accessed 2026-11-13 **[official excerpt; pages render blank here]**

- "When you use our services for individuals (**Free, Plus, Pro**), we may use your content to train our models. You can choose whether your conversations help improve our models. To opt out, turn off **Improve the model for everyone** under **Settings > Data controls** in ChatGPT, or select **Do not train on my content** in our Privacy Portal. Either option is sufficient … After you opt out, we won't use your new conversations to improve our models." — help.openai.com/en/articles/5722486-how-your-data-is-used-for-improving-model-performance
- "On personal workspaces with ChatGPT Free, Plus, or Pro, data sharing is enabled by default. You can turn off Improve the model for everyone and keep your chat history." — help.openai.com/en/articles/7730893-data-controls-in-chatgpt
- "With ChatGPT **Business, ChatGPT Enterprise, ChatGPT Edu and our API Platform offerings, by default, we don't use provided inputs and outputs to train our models.** … If you are on a ChatGPT Plus, ChatGPT Pro or ChatGPT Free plan on a personal workspace, data sharing is enabled for you by default…" — help.openai.com/en/articles/8983130-how-does-chatgpt-use-my-data

So: consumer Free/Plus/Pro = **on by default, one toggle off**; Business/Enterprise/Edu/API = **off by default**.

### Google — support.google.com/gemini/answer/13594961 (Gemini Apps Privacy Hub; notice "Last updated: October 13, 2026"; page Oct 26, 2026), accessed 2026-11-13 **[official excerpt]**

- "If you don't enter confidential information … or Google to use to improve its services, including machine-learning technologies."
- "**If the Keep Activity setting is on:** Your chats … Google uses your activity to provide, develop, and improve its services (including training generative AI models), as well as to protect Google, its users, and the public with the help of human reviewers."
- "**If the Keep Activity setting is off:** Your future chats won't appear in your Activity, and won't be used to train our AI models, unless you choose to send Google feedback. Future chats are still saved for 72 hours…"
- "You can change your auto-delete setting in Gemini Apps Activity from the default of **18 months** to 3 months, 36 months, or indefinite."
- "Chats are disconnected from your account before being sent to service providers." — human review: "A subset of chats are reviewed by human reviewers (including Google's trained service providers) to help improve Google services. … Reviewed chats are retained for up to three years." / "Chats reviewed by human reviewers … are not deleted when you delete your activity."
- "Temporary chats are not used to train Google's AI models."
- "Audio and Gemini Live videos and screenshares aren't used to improve Google services by default."
- Paid-vs-free consumer plans: nothing in the notice carves out personal paid tiers (Plus/Pro/Ultra) — quotas and storage differ, data treatment does not (the only subscription mention is collecting "Subscription information"). Label any such statement in the guide as **"not stated by Google; do not treat paid consumer plans as training-free"**.
- **API/AI Studio:** "To access higher rate limits, use advanced models, and ensure your prompts and responses are **not used to improve Google products**, you can link a billing account …" — aistudio.google.com/docs/billing, direct read, 2026-11-13 → **Free tier content may be used to improve Google products; paid tier is not.** Gloss on 429: free tier rate limits per model.

**Guide-level rule (verified):** Free/unpaid surfaces across all three vendors may improve models; only Claude (opt-in), ChatGPT (toggle off), Gemini app (Keep Activity off = the only opt-out, couples with history), Gemini API paid tier, Anthropic commercial, OpenAI Business/Enterprise/Edu/API, are not used.

## 5. Official definitions (URL + short quote each), all accessed 2026-11-13

| Term | Quote | URL |
|---|---|---|
| **Skills** | "A custom skill is a folder with a SKILL.md file of instructions, and optionally scripts and reference files, that Claude loads when a task matches the skill's description." | https://claude.com/docs/skills/how-to (direct read) |
| **Projects** | "Projects allow you to create self-contained workspaces with their own chat histories and knowledge bases. Within each project, you can upload documents, provide context, and have focused chats with Claude." | https://support.claude.com/en/articles/9517075-what-are-projects (official excerpt; updated Oct 30, 2026) |
| **Memory** | "Claude can also remember context from your chats and carry it into new conversations and Cowork tasks." — "Memory is on by default for Free, Pro, Max, and Ultra plans on the web, Claude Desktop, and Claude Mobile. On Team and Enterprise plans, owners control whether memory is available. Each project has its own memory." | https://support.claude.com/en/articles/11817273-use-claude-s-chat-search-and-memory-to-build-on-previous-context (official excerpt) · memory-default detail: https://support.claude.com/en/articles/9519177-how-can-i-create-and-manage-projects |
| **Custom instructions** | "Any instructions you add here will be applied to all of your conversations with Claude." — (Claude calls them "Instructions", under Settings → Your Claude; profile-wide) · Organization instructions available for Team/Enterprise owners ("Set custom instructions that Claude follows in every conversation across your organization") | https://support.claude.com/en/articles/10185728-understanding-claude-s-personalization-features (official excerpt) · https://support.claude.com/en/articles/14546867-set-organization-instructions (official excerpt, Aug 31, 2026) · ChatGPT equivalent: help.openai.com "Custom instructions" exists **[unverified — page not read]** |
| **Connectors / MCP** | "You can customize Claude with MCP connectors, skills, and plugins. MCP connectors give Claude access to a tool or data source, and skills teach it how to do a task the way you or your team does it." — MCP itself: "The Model Context Protocol (MCP) is an open standard for connecting AI agents to external tools and data sources." | https://claude.com/docs/extend/overview (official excerpt) · https://code.claude.com/docs/en/agent-sdk/mcp (official excerpt) |
| **Plugins / agents** | "MCP connectors give it access to your tools, skills teach it how you do a task, and plugins package both as one install." — "A Claude Code plugin is a directory of skills, agents, hooks, MCP servers, or other components that Claude Code installs and loads as one unit." | https://claude.com/docs/extend/overview (official excerpt) · https://code.claude.com/docs/en/plugins/overview (official excerpt) |

Overuse-costs and table contents from the first file's §4 are **practice distilled**, not vendor guidance — keep them labelled that way.

## 6. OpenRouter free-tier mechanics (for completeness; required by §5)

Not re-verified this pass (out of the required scope). First file stands as labelled: openrouter.ai/docs (mechanism [official]), verification via codyvolckmar/truefoundry (2026-10, third-party). Keep the labels as they are.

## 7. Corrections to `ai-models-and-workflows.md` (item 3 must apply these)

| First file says | Official wording (this pass) |
|---|---|
| Opus 5.5 $8/$40 | **$4/$20** Standard · $8/$40 Fast mode (anthropic API pricing page) |
| Cache-read 0.05–0.1× | **0.025×** (Fable/Mythos) · **0.05×** (Opus/Sonnet 5.5) · **0.1×** (others); writes **1.25×** (5-min) / **2×** (1-hr) |
| OpenAI row "GPT-5 mini/nano · $1.25/$10 launch" | GPT-6 family: **gpt-6-luna $0.10/$0.50** (small), **gpt-6.1-sol $2/$10** (mid), **gpt-6-astra $10/$50** (frontier); **GPT-5.4 & GPT-5.2 exist officially but current prices are unverified (delisted from pricing page)**; $1.25/$10 launch figure unverifiable |
| "GPT-5.4 family (page: Mar 2026)" | Confirmed: `gpt-5.4`, default snapshot `gpt-5.4-2026-03-05`, 2026-03-05; reasoning.effort none/low/medium/high/xhigh |
| "Gemini 3 Pro-class / Advanced" large tier | **Gemini 4 Carbon** (frontier) · **Gemini 4 Argon** (efficient frontier) · **Gemini 4 Hydrogen** (everyday, 1M ctx) · **3.8 Flash** (Flash class); per-token prices **unverified** |
| DeepSeek V3.2 $0.209/$0.310, 163K | V4 line (deepseek-flash / deepseek-v4-pro), 1M ctx, 384K max output; V3.2 removed from official pricing page |
| Grok 4.3 / 4.6 rows | **Remove** (x.ai Cloudflare-blocked; third-party only) |
| Neontron Ultra / Inkling line (1M class) | **Remove** (no official source) |
| Copilot Pro $10 ($10 credits), Pro+ 7,000 | Pro **$10 → 1,500** (1,000+500 flex) · Pro+ **$39 → 7,000** (3,900+3,100 flex) · Max **$100 → 20,000** · Business **$19 → 1,900** · Enterprise **$39 → 3,900** |
| "Claude Ultra / 'Max 20×' $200 [third-party]" | **Ultra $200**, official (10× Pro usage, $200/mo API credits New) |
| "Claude Max $100 (5× Pro)" | Official; also carries **$100/mo API credits New** |
| "ChatGPT Pro up to $200/mo" | **Pro 200** and **Pro 500** ($500, GPT-6 Astra/Sol Ultrafast) |
| "Google AI Ultra $99.99/$199.99" | **$100/mo** new developer tier + **$200/mo** top tier (was $250; Google I/O 2026) |
| "Google AI Plus $4.99" | **$4.99 (back-to-school trial end) vs $7.99 (U.S. availability)** — official conflict; unresolved |
| Consumer training "toggleable / may be used" (ChatGPT) | Free/Plus/Pro **on by default**; opt-out via Settings → Data controls (exact wording §4) |
| Claude consumer data use | **Opt-in only** (exact wording §4); commercial = not used by default |
| Gemini app training "on" | Keep Activity **on by default** (18-month auto-delete); reviewed chats retained 3 yrs; off → no training + 72-h retention; temp chats never train |
| "ChatGPT Business/Enterprise no training default" | Confirmed (exact wording §4) |
| "Free-tier Gemini may improve products" | Confirmed: aistudio billing page — free tier content may be used to improve Google products; paid tier is not |
| Skills/Projects/Memory/Custom instructions/Connectors/Plugins definitions | See §5 (all six have official URLs + short quotes) |

## 8. Verified-source index (for the guide's citations)

1. platform.claude.com/docs/en/build-with-claude/prompt-caching — accessed 2026-11-13 (direct)
2. platform.claude.com/docs/en/about-claude/pricing — accessed 2026-11-13 (direct)
3. claude.com/pricing — accessed 2026-11-13 (direct)
4. claude.com/docs/skills/how-to — accessed 2026-11-13 (direct)
5. claude.com/docs/extend/overview — accessed 2026-11-13 (excerpt)
6. support.claude.com/en/articles/9517075-what-are-projects — accessed 2026-11-13 (excerpt)
7. support.claude.com/en/articles/11817273-use-claude-s-chat-search-and-memory-to-build-on-previous-context — accessed 2026-11-13 (excerpt)
8. support.claude.com/en/articles/10185728-understanding-claude-s-personalization-features — accessed 2026-11-13 (excerpt)
9. support.claude.com/en/articles/14546867-set-organization-instructions — accessed 2026-11-13 (excerpt)
10. privacy.claude.com/en/articles/10023580-is-my-data-used-for-model-training — accessed 2026-11-13 (direct)
11. privacy.claude.com/en/articles/7996868-is-my-data-used-for-model-training (commercial article) — accessed 2026-11-13 (excerpt)
12. anthropic.com/news/updates-to-our-consumer-terms (2025-08-28) — accessed 2026-11-13 (excerpt)
13. developers.openai.com/api/docs/pricing — accessed 2026-11-13 (direct)
14. developers.openai.com/api/docs/models/gpt-5.4 · /gpt-5.2 — accessed 2026-11-13 (direct, `.md`)
15. help.openai.com/en/articles/6950777 (Plus $20) — accessed 2026-11-13 (excerpt)
16. help.openai.com/en/articles/9793128 (Pro 200/Pro 500) — accessed 2026-11-13 (excerpt)
17. help.openai.com/en/articles/5722486 · /7730893 · /8983130 (training defaults) — accessed 2026-11-13 (excerpt)
18. help.openai.com/en/articles/13086943 not used (404) — projects URL is the one in §5
19. blog.google — Google AI subscription updates from Google I/O 2026 ($100 Ultra / $250→$200 top tier) — accessed 2026-11-13 (excerpt)
20. blog.google — google-ai-plus-availability ($7.99 U.S.) — accessed 2026-11-13 (excerpt)
21. blog.google — student-offer-google-ai (Pro $19.99 after trial; Plus $4.99) — accessed 2026-11-13 (excerpt)
22. support.google.com/googleone/answer/16286513 (Ultra line-up) — accessed 2026-11-13 (excerpt)
23. support.google.com/gemini/answer/13594961 (Gemini Apps Privacy Hub, notice last updated 2026-10-13) — accessed 2026-11-13 (excerpt)
24. aistudio.google.com/docs/billing — accessed 2026-11-13 (direct)
25. aistudio.google.com/docs/pricing / ai.google.dev/gemini-api/docs/pricing — accessed 2026-11-13 (direct; model names confirmed, prices unreadable → unverified)
26. ai.google.dev/gemini-api/docs/billing (context caching/billing existence) — first-file reference; not re-read
27. docs.github.com/en/copilot/get-started/plans — accessed 2026-11-13 (official, search-index content used; page body confirmed via excerpts, 5 passages quote the same tables)
28. api-docs.deepseek.com/quick_start/pricing — accessed 2026-11-13 (direct)
29. x.ai/api — accessed 2026-11-13 (Cloudflare block → no official confirmation possible)
30. openai.com/index/why-language-models-hallucinate (2025-09-05) — not re-read this pass; first-file citation stands
31. anthropic.com/engineering/building-effective-agents — not re-read this pass; first-file citation stands

## 9. Claims that stay **unverified** and must not appear in published copy

- Per-token Gemini 4 / Gemini 3 prices (Carbon, Argon, Hydrogen, 3.8 Flash …).
- GPT-5.4 and GPT-5.2 current prices (model pages exist; pricing page carries no price).
- GPT-5 launch price $1.25/$10 (2025-08-07).
- Google AI Plus monthly price ($4.99 vs $7.99 — official conflict).
- chatgpt.com/pricing Free tier $0 (plan exists; price not directly readable here).
- Any Grok/DeepSeek per-token price from third parties.
- xAI existence of official pricing (unreachable).
- Retention numbers NOT in this file or the first file (e.g. "ChatGPT temporal chats 30 days" — appears in help-center excerpt: Temporary Chats deleted after 30 days; treat as **official excerpt, moderate confidence**).
- Claude Ultra privacy-article coverage wording (the consumer article names Free/Pro/Max; Ultra not individually named).
