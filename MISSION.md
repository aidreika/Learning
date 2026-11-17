# Mission: Neural networks for the Brawl game bot

## Why
The user is designing the bot of their card game Brawl (Miniature Warfare mode) — neural nets plus a tree search —
in design talks with Claude sessions (`aidreika/brawl`: `docs/BOT.md`, `docs/PRIORS.md`, `docs/NN_DESIGNER.md`).
They want to make the design decisions themselves: follow each proposal, see where it is wrong, argue from logic and
measurements, and choose. Today the explanations run ahead of what they hold (brawl DECISIONS 319: «я застрял ещё на
10 шагов назад»).

## Success looks like
- Explains in their own words, with an example from the game, how one training step changes a net's numbers and
  which positions a number learns from.
- Predicts what a card-passport design does to a rare or new card (e.g. Трикстер Токи, in no recorded game) before
  Claude says it.
- Reads a trial's results row (the move hint's "human's move first", the win chance's log-loss, cross-validation
  split by game, a learning curve) and says what it shows and what it does not.
- Judges the open forks of the bot design with reasons: the evaluator on stops or on mid-turn positions, shared or
  separate nets, the move hint before or after the move, who plays generation 0.
- Follows a design talk without asking questions only to keep it going.

## Constraints
- Does not write or read code: no coding exercises; interactive pages instead.
- Learns on an iPhone (16 Pro Max): every page works on a phone screen, as a claude.ai artifact.
- Lessons and reference pages in Russian; workspace files (this one, notes, records) in English.
- Explanations from the user's level, in numbered steps, one new idea per step, examples from the game (NOTES.md).

## Out of scope
- Writing or running training code themselves (the user chose "decide the design", not "build the nets").
