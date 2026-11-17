# Neural networks for the Brawl bot — Resources

## Knowledge

- [Book (Russian translation): Michael Nielsen, «Нейросети и глубокое обучение», ch. 1](https://habr.com/ru/post/456738/)
  The classic free introduction, translated chapter by chapter on Habr (SLY_G, 2019). Section «Обучение с
  градиентным спуском»: the ball rolling into the valley, the update rule w → w − η·∂C/∂w, η = «скорость
  обучения». Use for: what one training step is.
- [Same book, ch. 2: «как работает алгоритм обратного распространения»](https://habr.com/ru/post/457980/)
  Section «Четыре фундаментальных уравнения…», equation BP4: a weight's gradient = its input × the error after it;
  «весовой выход нейронов с низкой активацией обучается медленно». Use for: why a number that did not take part
  does not move; later, how layers pass the error back.
- [Book (Russian): «Учебник по машинному обучению» from Yandex ShAD](https://contest.yandex.ru/tracks/ml)
  (education.yandex.ru/handbook/ml redirects here). A university-level Russian handbook. Chapters: 5 «Глубинное
  обучение — введение» (fully connected nets, backpropagation), 7 «Глубинное обучение — практика» (representation
  learning ≈ embeddings), 14 «Оптимизация в ML» (SGD), 11 «Взаимодействие со средой» (reinforcement learning).
  Use for: a second, more rigorous Russian explanation; chapter URLs not yet checked one by one.
- [Video + written lesson (English): 3Blue1Brown, "Gradient descent, how neural networks learn"](https://www.3blue1brown.com/lessons/gradient-descent)
  The best visual explanation of training; part of the series that starts at
  [«But what is a Neural Network?»](https://www.3blue1brown.com/lessons/neural-networks). No Russian version found.
  Use for: the picture of descent, when the user wants to see it move.
- [Course module (English): Google ML Crash Course, "Embeddings"](https://developers.google.com/machine-learning/crash-course/embeddings)
  An embedding as a learned vector per item, trained as a layer of a net. English only (`?hl=ru` stays English).
  Use for: the card's own vector in the card passport.
- [Paper: Silver et al., "Mastering the game of Go without human knowledge", Nature 550, 354–359 (2017)](https://doi.org/10.1038/nature24270)
  AlphaGo Zero: one net predicts the search's moves and the game's winner; the search with the net plays better
  than the net alone, and that drives the loop. Use for: the search + nets design (С1, С2, self-play), later.

## Wisdom (Communities)

- [Open Data Science (ods.ai)](https://ods.ai)
  The largest Russian-speaking ML community (Slack / Mattermost, Telegram @ods_ru). Use for: questions in Russian,
  sanity checks of a design idea by practitioners.
- [Leela Chess Zero Discord](https://discord.gg/pKujYxD) (listed on [lczero.org/dev/wiki](https://lczero.org/dev/wiki/))
  The open-source project that rebuilt AlphaZero for chess: nets + search + volunteer self-play. Use for: how
  real people design, train and test search-with-nets bots; English.

## Gaps
- A trusted Russian source on embeddings / learned item vectors (Yandex ch. 7 is a candidate, unread).
- Sources on search + nets for card games with hidden information (Hearthstone-like), not only Go and chess.
- A Russian visual explanation of gradient descent at 3Blue1Brown's level.
