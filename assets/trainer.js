/* Training simulator (component). A net whose evaluation of a position is the sum of the weights that take part
   in it: every card has its own weight; a card in a group also brings the group's weight.
   One training step on a position: evaluation; error = right answer − evaluation (win +1, loss −1);
   every weight += rate × error × participation, where participation = how many times the weight was summed into
   this evaluation (1 for a card in hand, 0 for a card not in it; for a group, the number of its cards in hand).

   Markup: <div class="trainer"><script type="application/json">{config}</script></div>
   Config: {
     "rate": 0.1, "scale": 1.5,
     "cards":  [{ "id": "zh", "name": "Жрица ярости", "group": "dem", "tag": "нет в партиях" }, …],
     "groups": [{ "id": "dem", "name": "Демоны" }],            // optional
     "positions": [{ "hand": ["zh", "fb"], "win": true }, …],
     "probes": [{ "hand": ["toki"] }, …],                        // positions not in the data: what the net says
     "runs": 100                                                 // epochs for the «run» button
   } */
(function () {
  'use strict';

  function fmt(x, d) {
    d = d === undefined ? 2 : d;
    var r = Math.round(x * Math.pow(10, d)) / Math.pow(10, d);
    if (r === 0) r = 0; // no −0
    return r.toFixed(d).replace('-', '−').replace('.', ',');
  }
  function signed(x, d) {
    var s = fmt(x, d);
    return s.charAt(0) === '−' || /^0,0+$/.test(s) ? s : '+' + s;
  }
  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text !== undefined) e.textContent = text;
    return e;
  }

  function init(root) {
    var src = root.querySelector('script[type="application/json"]');
    if (!src) return;
    var cfg = JSON.parse(src.textContent);
    var rate = cfg.rate || 0.1;
    var scale = cfg.scale || 1.5;
    var runs = cfg.runs || 100;
    var cards = cfg.cards;
    var groups = cfg.groups || [];
    var byId = {};
    cards.forEach(function (c) { byId[c.id] = c; });

    // The weights, in display order: the cards' own, then the groups'.
    var keys = cards.map(function (c) { return { key: 'c:' + c.id, card: c }; })
      .concat(groups.map(function (g) { return { key: 'g:' + g.id, group: g }; }));

    function part(hand, k) {
      var n = 0;
      hand.forEach(function (id) {
        if (k.card && k.card.id === id) n++;
        if (k.group && byId[id] && byId[id].group === k.group.id) n++;
      });
      return n;
    }
    function predict(w, hand) {
      var s = 0;
      keys.forEach(function (k) { s += w[k.key] * part(hand, k); });
      return s;
    }
    function target(p) { return p.win ? 1 : -1; }
    function train(w, p) {
      var err = target(p) - predict(w, p.hand);
      var shift = {};
      keys.forEach(function (k) {
        shift[k.key] = rate * err * part(p.hand, k);
        w[k.key] += shift[k.key];
      });
      return shift;
    }

    var st;
    function reset() {
      var w = {};
      keys.forEach(function (k) { w[k.key] = 0; });
      st = { w: w, i: 0, epoch: 1, phase: 'shown', shift: null, before: null, ran: false };
    }

    // ---- DOM ----
    root.textContent = '';
    var top = el('div', 'tr-top');
    var where = el('span', 'eyebrow');
    top.appendChild(where);
    var pos = el('div', 'tr-pos');
    var calc = el('div', 'tr-calc formula');
    calc.setAttribute('aria-live', 'polite');
    var hint = el('p', 'tr-hint small muted');
    var list = el('div', 'tr-weights');
    var ctl = el('div', 'tr-ctl');
    var bStep = el('button', 'btn primary');
    bStep.type = 'button';
    var bRun = el('button', 'btn', 'Прогнать ' + runs + ' кругов');
    bRun.type = 'button';
    var bReset = el('button', 'btn', 'Сначала');
    bReset.type = 'button';
    ctl.appendChild(bStep); ctl.appendChild(bRun); ctl.appendChild(bReset);
    var probes = el('div', 'tr-probes');
    [top, pos, calc, hint, list, ctl, probes].forEach(function (n) { root.appendChild(n); });

    function chip(id) {
      var c = byId[id];
      return el('span', 'chip', c ? c.name : id);
    }
    function handNode(hand) {
      var f = el('span', 'tr-hand');
      hand.forEach(function (id) { f.appendChild(chip(id)); });
      return f;
    }
    function weightName(k) {
      if (k.card) {
        var n = el('span', 'chip', k.card.name);
        return n;
      }
      return el('span', 'chip group', 'вес группы «' + k.group.name + '»');
    }

    function render() {
      var p = cfg.positions[st.i];
      var w = st.phase === 'applied' ? st.before : st.w;
      var est = predict(w, p.hand);
      var err = target(p) - est;

      where.textContent = (st.ran ? 'После ' + (st.epoch - 1) + ' кругов · ' : 'Круг ' + st.epoch + ' · ') +
        'позиция ' + (st.i + 1) + ' из ' + cfg.positions.length;

      pos.textContent = '';
      pos.appendChild(el('span', 'tr-label', 'Рука:'));
      pos.appendChild(handNode(p.hand));
      var b = el('span', 'badge ' + (p.win ? 'win' : 'loss'), p.win ? 'Победа · +1' : 'Поражение · −1');
      pos.appendChild(b);

      // the evaluation, term by term
      var terms = [];
      keys.forEach(function (k) {
        var n = part(p.hand, k);
        for (var j = 0; j < n; j++) terms.push(fmt(w[k.key]));
      });
      calc.textContent = '';
      var r1 = el('div', 'row');
      r1.appendChild(document.createTextNode('Оценка = ' + (terms.length > 1 ? terms.join(' + ') + ' = ' : '')));
      r1.appendChild(el('b', 'w', fmt(est)));
      var r2 = el('div', 'row');
      r2.appendChild(document.createTextNode('Ошибка = ' + (p.win ? '+1' : '−1') + ' − ' +
        (est < 0 ? '(' + fmt(est) + ')' : fmt(est)) + ' = '));
      r2.appendChild(el('b', '', signed(err)));
      calc.appendChild(r1); calc.appendChild(r2);

      hint.textContent = st.phase === 'shown'
        ? 'Прежде чем нажать: какие веса сдвинутся и в какую сторону?'
        : 'Сдвиг = скорость ' + fmt(rate, 1) + ' × ошибка × участие. Подсвечено то, что сдвинулось.';

      // weights
      list.textContent = '';
      keys.forEach(function (k) {
        var row = el('div', 'tr-row');
        var name = el('div', 'tr-name');
        name.appendChild(weightName(k));
        var tag = k.card && k.card.tag;
        if (tag) name.appendChild(el('span', 'tr-tag', tag));
        if (k.card && k.card.group) {
          var g = groups.filter(function (x) { return x.id === k.card.group; })[0];
          if (g) name.appendChild(el('span', 'tr-tag group', g.name));
        }
        var val = el('div', 'tr-val num', fmt(st.w[k.key]));
        var bar = el('div', 'tr-bar');
        var fill = el('span', st.w[k.key] < 0 ? 'neg' : 'pos');
        var frac = Math.min(1, Math.abs(st.w[k.key]) / scale) * 50;
        fill.style.width = frac + '%';
        if (st.w[k.key] < 0) fill.style.right = '50%'; else fill.style.left = '50%';
        bar.appendChild(fill);
        var line = el('div', 'tr-shift small num');
        if (st.phase === 'applied' && st.shift) {
          var n = part(p.hand, k);
          var s = st.shift[k.key];
          line.textContent = fmt(rate, 1) + ' × (' + signed(err) + ') × ' + n + ' = ' + (n ? signed(s) : '0');
          if (n && Math.abs(s) > 1e-9) row.classList.add('lit'); else row.classList.add('idle');
        } else {
          line.textContent = ' ';
        }
        row.appendChild(name); row.appendChild(val); row.appendChild(bar); row.appendChild(line);
        list.appendChild(row);
      });

      bStep.textContent = st.phase === 'shown' ? 'Сдвинуть веса' : 'Следующая позиция';

      // probes
      probes.textContent = '';
      if (cfg.probes && cfg.probes.length) {
        probes.appendChild(el('div', 'eyebrow', 'Что сеть сейчас говорит о позиции'));
        cfg.probes.forEach(function (pr) {
          var r = el('div', 'tr-probe');
          r.appendChild(handNode(pr.hand));
          var v = predict(st.w, pr.hand);
          var say = Math.abs(v) < 0.005 ? 'ничего не знает' : v > 0 ? 'считает выигрышной' : 'считает проигрышной';
          var out = el('span', 'tr-say');
          out.appendChild(el('b', 'num', fmt(v)));
          out.appendChild(document.createTextNode(' · ' + say));
          r.appendChild(out);
          probes.appendChild(r);
        });
      }
    }

    bStep.addEventListener('click', function () {
      if (st.phase === 'shown') {
        st.before = Object.assign({}, st.w);
        st.shift = train(st.w, cfg.positions[st.i]);
        st.phase = 'applied';
      } else {
        st.i++;
        if (st.i >= cfg.positions.length) { st.i = 0; st.epoch++; }
        st.phase = 'shown';
        st.shift = null;
        st.ran = false;
      }
      render();
    });
    bRun.addEventListener('click', function () {
      if (st.phase === 'applied') { st.i++; if (st.i >= cfg.positions.length) { st.i = 0; st.epoch++; } }
      for (var e = 0; e < runs; e++) {
        for (var j = 0; j < cfg.positions.length; j++) {
          train(st.w, cfg.positions[st.i]);
          st.i++;
          if (st.i >= cfg.positions.length) { st.i = 0; st.epoch++; }
        }
      }
      st.phase = 'shown';
      st.shift = null;
      st.ran = true;
      render();
    });
    bReset.addEventListener('click', function () { reset(); render(); });

    reset();
    render();
  }

  function boot() { document.querySelectorAll('.trainer').forEach(init); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
