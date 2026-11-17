# Notes

## How this user wants to be taught
Most of this comes from the brawl repo, where the user set it for Claude design sessions: `docs/roles/PLANNER.md`
→ "First find the user's level", `docs/DECISIONS.md` 243, 261, 319.
- **Chat in Russian; lessons and reference pages in Russian; workspace files in English** (user, 2026-11-17).
- **Numbered steps.** Each step says what it is about and which question it serves, brings ONE new thing with an
  example from the game, and ends with what it established. «Непонятно на шаге N» must be a full answer.
- **Start from where the user is.** A term the user uses is not a term they hold — never infer the level from
  vocabulary. When unsure, ask 1–3 short questions (options from «не знаю» up to the detailed level).
- **No compressed chains of conclusions.** Previous answers left the user "ten steps behind"; they then asked
  questions only to keep the explanation going. Watch for that sign.
- **Nothing simplified away** (DECISIONS 243): do not drop details or hide terms; give a Russian wording next to a
  term instead. Simple ≠ leaving out.
- **Put each new idea back into the full picture** (DECISIONS 261): what it changes, where it goes.
- **Examples from the game**: real card names from `aidreika/brawl` `packages/cards/src/sets/` (e.g. Жрица ярости,
  Скверносерд-мучитель, Полководец из преисподней — demons in `hs.ts`; Трикстер Токи in `custom.gen.ts`).
- Mark toy numbers as toy; do not present made-up data as the user's measurements.

## About the user
- Expert in the game's rules; designs the bot; does not code (Claude sessions write all code).
- Reads on an iPhone 16 Pro Max in the Claude app; claude.ai artifacts are their normal medium.
- Has seen real numbers from the 2026-11-17 NN trial (brawl `docs/BOT.md` → Results log): move hint 39.6% "human's
  move first", win chance log-loss 0.599, etc. — good material for later lessons on reading results.

## Delivery
- The course is ONE claude.ai artifact: `index.html` (the course page) + `lessons/*.html` + `reference/*.html` +
  `assets/*` as its files, so relative links work. Republish to the same URL after each lesson.
- Course artifact URL: https://claude.ai/artifact/1Mi5amFTqQ1LGiXciw6F4Z (private). Republish `index.html` with every
  page in `files` (paths as in the repo).
- `reference/glossary.html` is the glossary (format: `.claude/skills/teach/GLOSSARY-FORMAT.md`); there is no
  separate GLOSSARY.md — one store.

## The bot design, as context (do not teach it as settled — everything in it is a draft)
- Nets: С1 evaluator (P(win) of a position), С2 move hint, С3 kill priorities, С4 lethal gate, … (BOT.md → Codes).
- The live discussion (2026-11-17): the **card passport** — a tree of groups/tags wired to a card's numbers + the
  card's own learned vector; how a shared meaning splits between group numbers and own numbers; rare and new cards.
- Concepts the design talks already lean on, roughly in teaching order: a weight / one training step → a number
  learns only where it took part → shared numbers (groups) vs own numbers and the split → penalties
  (regularisation) → layers and non-linearity → softmax / the move hint → log-loss, held-out games,
  cross-validation → overfitting and weights per example → Adam vs plain descent → search + nets (AlphaZero loop) →
  distillation (big teacher, small net).

## Next session
- Open lesson 2 with two retrieval questions on lesson 1 (spacing), before any new idea.
- Lesson 1 quiz results are not visible to Claude: ask the user how it went and which steps were unclear.
- Promote «скорость обучения», «участие», «общий вес группы» to the glossary once the user uses them correctly.
- Lesson 2 candidate: how a shared meaning splits between the group weight and the cards' own weights (n / (n + 1)
  with plain descent), and what a penalty on the own weights does — the trainer component can take a penalty option.
