/* Quiz (component): immediate feedback, first-try score.
   Markup:
   <section class="quiz">
     <div class="quiz-q" data-correct="2">            <!-- 1-based index of the right option -->
       <p class="q-text">…</p>
       <div class="q-opts"><button type="button">…</button> …</div>
       <div class="q-why">…why the right answer is right…</div>
     </div> …
   </section>
   The script adds the score line and the «Пройти заново» button. */
(function () {
  'use strict';
  function init(quiz) {
    var qs = Array.prototype.slice.call(quiz.querySelectorAll('.quiz-q'));
    var score = document.createElement('p');
    score.className = 'quiz-score';
    score.setAttribute('aria-live', 'polite');
    var again = document.createElement('button');
    again.type = 'button';
    again.className = 'btn';
    again.textContent = 'Пройти заново';
    var foot = document.createElement('div');
    foot.className = 'quiz-foot';
    foot.appendChild(score);
    foot.appendChild(again);
    quiz.appendChild(foot);

    function update() {
      var done = qs.filter(function (q) { return q.dataset.done; });
      var right = done.filter(function (q) { return q.dataset.done === 'right'; });
      score.textContent = done.length < qs.length
        ? 'Отвечено: ' + done.length + ' из ' + qs.length
        : 'Верно с первой попытки: ' + right.length + ' из ' + qs.length +
          (right.length === qs.length ? '. Отлично.' : '. Разберите пояснения к ошибкам и пройдите заново через день.');
    }

    qs.forEach(function (q, qi) {
      var correct = parseInt(q.dataset.correct, 10) - 1;
      var opts = Array.prototype.slice.call(q.querySelectorAll('.q-opts button'));
      var why = q.querySelector('.q-why');
      q.setAttribute('role', 'group');
      opts.forEach(function (b, i) {
        b.type = 'button';
        b.id = b.id || 'q' + (qi + 1) + 'o' + (i + 1);
        b.addEventListener('click', function () {
          if (q.dataset.done) return;
          q.dataset.done = i === correct ? 'right' : 'wrong';
          opts.forEach(function (o, j) {
            o.disabled = true;
            if (j === correct) o.classList.add('right');
          });
          if (i !== correct) b.classList.add('wrong');
          if (why) {
            why.hidden = false;
            why.dataset.verdict = i === correct ? 'Верно.' : 'Неверно.';
          }
          update();
        });
      });
      if (why) why.hidden = true;
    });

    again.addEventListener('click', function () {
      qs.forEach(function (q) {
        delete q.dataset.done;
        q.querySelectorAll('.q-opts button').forEach(function (o) {
          o.disabled = false;
          o.classList.remove('right', 'wrong');
        });
        var why = q.querySelector('.q-why');
        if (why) why.hidden = true;
      });
      update();
      qs[0].scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    update();
  }
  function boot() { document.querySelectorAll('.quiz').forEach(init); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
