# Starting level: knows training reduces error, not how a single number moves

The user pictures training as "the net compares its answer with the right one and shifts its weights so the error
gets smaller" (their own choice in the level check, 2026-11-17); derivatives, the learning rate and why Adam behaves
differently from plain descent are not held. They do not code. In the brawl design talk the same day a check showed:
"the card passport is numbers that training picks" — held; "a link learns only from positions it took part in" —
only partly; of the passport-tree scheme, only variant 1 was followed.

**Evidence**: the user's answers to the level questions of this workspace; brawl `docs/BOT.md` → Card passport, the
note on the user's level next to DECISIONS 319.

**Implications**: start with what one training step does to each number, in a model small enough to compute by
hand (a sum of card numbers); do not assume layers, softmax or log-loss. The first gap to close is "a number moves
only where it took part" — the passport debate (variants 1–3, the own vector's penalty, new cards) rests on it.
