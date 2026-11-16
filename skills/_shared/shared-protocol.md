# Shared protocol

Read this once at the start. It is the same in every Mambo skill.

## 1. First run: check what you can use, then tell the person in 3 lines
Look for these (silently, by trying, not by assuming): a question tool (AskUserQuestion or similar), web search and fetch, a way to start a subagent or use a smaller, faster model, file writing, running scripts (node), and for design systems a Figma connector.
Then say what you found, what mode that puts you in, and the token savers in section 6. Example: "I can ask tappable questions, write files and run scripts. I cannot start a cheaper agent here, so for research I will write a brief you can run elsewhere. I will keep a short progress file so you can continue in a new chat."
If something is missing, use its fallback below. Never say a tool is unavailable before trying it.

## 2. Asking questions
- Use the question tool: up to 4 questions per call, 2 to 4 options each, a short header (12 characters or fewer). Put the recommended option first and add "(Recommended)". Use multi-select only for tick lists. The person can always type their own answer.
- Without the tool, ask the same questions as a numbered list; the person replies with numbers. For tick lists show `[x]` and `[ ]` and let them reply with changes.
- Open answers (names, hex codes, links) are asked in plain chat, not as options.
- Ask only what changes the next step. Never repeat a question already answered in the progress file. One call per step, not one question per message.

## 3. Progress file
`progress.md` in the working folder (or in the canvas or artifact if you cannot write files). At most 60 lines, in this order: Answers (one line each), Decisions (one line each with a short why), Steps (`[ ]` or `[x]` plus the output path), Next.
Update it after every step. At the start, if it exists, ask: continue or start over. Tell the person they can start a new chat after any phase; the file carries the context, which saves tokens.

## 4. Research handoff
For any step that needs information from outside the conversation, ask once (4 options):
1. **Search the web here** (Recommended for 1 to 3 quick lookups).
2. **Hand it to a cheaper agent**, for longer work. Write a 5-bullet brief: goal; what to find; preferred sources; output file `research/<topic>.md`; evidence rules (a source URL for every claim, mark anything unverified, no quotation marks around words that are not in the source). If you can start a subagent on a smaller or faster model, start it with the brief. If not, give the person the brief to run in another tool and say: "Tell me when the file is ready."
3. **Use my notes:** the person pastes text or attaches a file (md, txt, pdf or csv).
4. **Skip it** and mark the step's assumptions clearly.
After research, read the result once, keep a summary of at most 150 words plus the file path in the conversation, and cite only what you read.

## 5. After every step (always this shape)
- **Done:** one or two sentences naming exactly what was created or changed (paths, counts).
- **Why:** one line, only when a choice was not obvious.
- **Next:** the next step by name, with one line on what it will do. End with: "Say next when you are ready, or tell me what to change." Do not start the next step.

## 6. Token efficiency without losing quality
- Load only the reference file for the current branch or step. Do not re-read files already in context.
- Run the scripts instead of reading data. Do not open an index you do not need.
- Put full outputs in files. In chat, show at most 10 lines.
- No recaps of earlier steps; the progress file has them.
- Hand bulk reading (long documents, many pages) to a cheaper agent with a brief.
- Suggest a fresh chat after a long phase.
- Quality stays fixed: verify numbers with scripts, never lower the contrast bar, list assumptions, and say what you could not verify.
