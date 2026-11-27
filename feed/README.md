# Daily feed

A short daily post of what is new in tech and design. Each filter a visitor turns on adds one section to that day's post. Choices are saved in the visitor's browser (localStorage) only, so there are no accounts and nothing per-user on a server.

## How it works

1. `scripts/feed.mjs` reads every enabled source in `feed/sources.json`, keeps recent items, tags them with filters, groups them by day and writes `feed/data/latest.json`.
2. `feed/index.html` loads that one shared file. Like Browse, it has three resizable panes: filters on the left, one card per day in the middle ("Nothing new" when the day has nothing for the chosen filters), and the day's post on the right when a card is opened. A day can be linked as `/feed/#2026-11-24`. If `latest.json` is missing it shows `sample.json` with a "Sample data" banner.
3. Post title = the newest new-model release in the post (else the newest item), plus a count of the other updates.

## Commands (Node 18+, no dependencies)

| Command | What it does |
|---|---|
| `node scripts/feed.mjs` | Fetch all sources, write `feed/data/latest.json`. Prints one line per source. Exits 1 and keeps the old file if every network source fails. |
| `node scripts/feed.mjs --fixtures` | Rebuild `feed/data/sample.json` from `feed/fixtures/` (no network). |
| `node --test scripts/feed.test.mjs` | Run the tests. |
| `npx serve` then open `/feed/` | View the page. It needs a web server, not a `file://` page. |

## Files

- `feed/sources.json`: the filter tree, the tagging rules and every source with its audit note. Edit this to add or remove things.
- `feed/manual/*.json`: sources with no feed (Anthropic news, Apple design "What's new"). Add new items by hand: `title`, `link`, `published` (ISO date), `summary`.
- `feed/lib/compose.mjs`: how a day's items become sections and a title.
- `feed/fixtures/`: trimmed real items from 18 to 24 November 2026, used by the tests and the sample.

## Rules worth keeping

- Hugging Face models: use `createdAt`, never `lastModified` (a bulk update touched 2024 models on 2026-11-20).
- Every source has its own `windowDays`; a feed whose newest item is over 45 days old is reported as STALE.
- Feed text is third-party: the page builds everything with `textContent` and links only to `http(s)` URLs.
- Spacing is on the 4-point scale, text is at least 4.5:1 and UI borders at least 3:1 in light and dark (checked in a browser, see below).

## Before the first live run

Run `node scripts/feed.mjs` and read each source line. These were NOT confirmed live:

- OpenAI: item titles were not visible in the audit text. If it says `0 kept of N`, open the feed and check for `<title>`.
- arXiv (`rss.arxiv.org/rss/cs.LG+cs.CL`): the URL pattern is from arXiv's help page; the feed was never fetched.
- Hugging Face models `sort=createdAt`: untested. Hugging Face daily papers: item count unknown.
- Apple Developer news and Android Developers: only parsed from fixtures or audit text. Apple's feed is mostly App Store business news, so `excludeTitle` may need tuning.
- Added 2026-11-25 from the watcher text: Microsoft blog RSS (newest 2026-11-17), Mistral and DeepSeek model lists from Hugging Face (newest 2026-10-15 and 2026-10-17), DeepSeek API change log (by hand, `feed/manual/deepseek-updates.json`). Mistral's news page has no feed link or dates, so only its Hugging Face releases are covered.
- Not ready, so shown disabled: Meta (no feed; newest dated page item is 2026-07-27), xAI (x.ai/news returned 403).

## Going live (in `.github/workflows/pages.yml`)

The workflow runs `node scripts/feed.mjs` (a failure does not block the deploy; the page then shows the sample with its notice), copies the feed page into `_site/feed/`, and runs daily at 10:05 and 11:05 UTC (5:05 a.m. Central in summer and winter). The added lines, for reference:

```yaml
          mkdir -p _site/feed
          cp feed/index.html feed/feed.js feed/feed.css _site/feed/
          cp -r feed/lib feed/data _site/feed/
```

and a fresh `latest.json` before that step so the site is never stuck on sample data:

```yaml
      - name: Daily feed
        run: node scripts/feed.mjs
```

plus a daily trigger under `on:`: `schedule: [{ cron: "5 10,11 * * *" }]` (5:05 a.m. Central in summer and winter; the run that is too early just republishes the same day). Commits made by a workflow's own token do not start other workflows, so generating the feed inside this workflow is simpler than committing `latest.json`. Trade-off: history older than each feed's own window is not kept.

## Checked in a browser (Chromium, 2026-11-24)

No console errors apart from the expected `latest.json` 404 before a live run. Light text minimum 7.49:1, dark minimum 8.13:1, unchecked box border 3.31:1 light and 4.94:1 dark. No spacing values off the 4-point scale. No horizontal scroll at 320px. All buttons, links and filter rows at least 44px high. Checkbox toggles with Space and shows a 2px focus ring. A feed with script tags, `javascript:` and `data:` links rendered as plain text with no script run. Not checked: a real screen reader, Safari, Firefox.

## When a day is posted

The post for a date comes out at 5:00 a.m. Central (America/Chicago, daylight saving handled) on that date and holds what was published since 5:00 a.m. the day before. Nothing newer is shown until the next 5:00 a.m. Items that only carry a date count as that date. The rule lives in `digest` in `sources.json`; the generator writes `latestDigest` and the page ends its calendar there.

## Experiments & demos

The `Experiments & demos` filter picks up titles that name an AI product and an experiment word (plays, tested, beats, speedrun, versus, simulation). Sources: TechCrunch AI, Ars Technica AI and Simon Willison (new 2026-11-26, not yet read live: check the first deploy log). Standout past stories, such as Claude finishing Pokémon FireRed from screenshots, live in `manual/experiments-showcase.json` with a brief taken from the source.
