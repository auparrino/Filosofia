/*
 * La lección jugable: la teoría de cada semana se vuelve una secuencia de
 * pantallas cortas (mirá → la regla → la tabla → la trampa), y después de
 * cada bloque llega un chequeo rápido armado con el material del mismo
 * bloque.  Leer y recuperar enseguida (práctica de recuperación) fija más
 * que releer.  Las trampas son los errores del hispanohablante en el idioma
 * que estudia: las trae el paquete (LANG.rules.traps), igual que las clases
 * cerradas de «Completá la regla» (LANG.rules.classes) y los textos.
 */
(function (root) {
  "use strict";

  var LANG = root.LANG || {};
  var R = LANG.rules || {};
  var TR = R.traps || {};
  var TX = R.text || {};

  function strip(s) {
    return String(s == null ? "" : s).replace(/\*\*([^*]+)\*\*/g, "$1").replace(/\*([^*]+)\*/g, "$1").trim();
  }

  function shuffle(a, rnd) {
    a = a.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(rnd() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  function uniq(list) {
    var seen = {};
    return list.filter(function (x) { var k = x.toLowerCase(); if (!x || seen[k]) return false; seen[k] = 1; return true; });
  }

  // The Spanish side of an example that is a comment, not a translation.
  var COMMENT_ES = R.commentEs || /^(también|tambien|lo mismo|igual|ídem|idem|íd\.|más formal|más informal|formal|informal|coloquial)\b|^\(.*\)$|\((más )?(formal|informal|coloquial|habla|escrito)\)/i;
  // A block about accents: there a distractor that only changes one is the point.
  var ACCENT_BLOCK = R.accentBlock || /tilde|acento|acentu|circunflej|diacr|cedilla/i;
  // Table columns that hold a comment on the row, not the form it teaches.
  var COMMENT_COL = R.commentCols || /^(ejemplos?|notas?|ojo( con)?|qué pasa|pista del español|dónde|no es|no significa|calco a evitar|diferencia)$/i;
  var EXAMPLE_COL = /^ejemplos?(\s.*)?$/i,   // «Ejemplo», «Ejemplo en plural»…
      SPANISH_COL = R.spanishCols || /^(castellano|español)$/i;

  function usable(s) { return s && s.length <= 60 && s.indexOf(" / ") < 0 && !/^[-—–…]*$/.test(s); }
  // An example is a real pair only if the right side translates the left one:
  // «il jazz, o show = préstamos: se escriben…» is a comment, not a
  // translation, and makes a meaningless question.
  function translation(p) {
    // «o leite → os leites = masculino» is a table row with a comment, not a
    // sentence with its translation: no arrows, no lists, no suffix notes.
    if (/[→;=]|\s\/\s/.test(p[0]) || /[:«»→;=]|\s\/\s|(^|\s)-[a-zà-ÿ]/i.test(p[1])) return false;
    // «3. Artículo con el posesivo»: a numbered note or grammar talk, not a translation
    // «También es correcto sin eu.», «Lo mismo, más formal.», «Estoy en
    // camino (formal).»: a comment on the sentence, not what it says
    if (COMMENT_ES.test(p[1].trim())) return false;
    if (/^\d+\./.test(p[1].trim()) ||
        /\b(artículo|posesivo|plural|singular|verbo|adjetivo|pronombre|sustantivo|preposici|contracci|conjuga|regla|tiempo verbal|auxiliar|participio|infinitivo|subjuntivo)/i.test(p[1])) return false;
    var esWords = p[1].trim().split(/\s+/).length, itWords = p[0].trim().split(/\s+/).length;
    if (esWords < 2 && itWords > 1) return false;
    return usable(p[0]) && usable(p[1]) && !/,\s*\S+,/.test(p[0]) &&
      p[1].length <= p[0].length * 2 + 6;        // «rosa = s sonora, como una z inglesa»: no
  }

  // All examples of the lesson, as distractor material.
  function allEx(lesson) {
    var out = [];
    lesson.blocks.forEach(function (b) { (b.ex || []).forEach(function (p) { out.push([strip(p[0]), strip(p[1])]); }); });
    return out.filter(translation);
  }

  /* Trap versions of a right sentence: the errors a Spanish speaker makes
     in the language (LANG.rules.traps.word, one word at a time: the
     article, the contraction or articulated preposition, the Spanish word
     or spelling inside, accents, double consonants, plurals, endings…).
     week: the traps test only what has been taught by then.
     safe: only the changes that are always an error; another ending,
     person or auxiliary can be good language too.
     isWord: the glossary as a dictionary of the language's words (a
     capital that the dictionary knows is not a name). */
  var TOKEN = TR.tokenRe || /^([«"(¿¡]*)([A-Za-zÀ-ÿ']+(?:-[A-Za-zÀ-ÿ']+)*)([.,;:!?»")…]*)$/;
  function traps(sentence, rnd, week, isWord, safe) {
    week = week || 52;
    var toks = sentence.split(" ");
    var rule = [], loose = [];
    toks.forEach(function (t, i) {
      var m = t.match(TOKEN);
      if (!m) return;
      var w = m[2], low = w.toLowerCase();
      if (i > 0 && w[0] !== low[0]) return;          // a name (Roma, Rio, João) stays as it is
      var put = function (nw, bag) {
        if (w[0] !== low[0]) nw = nw.charAt(0).toUpperCase() + nw.slice(1);
        var c = toks.slice(); c[i] = m[1] + nw + m[3]; (bag || rule).push(c.join(" "));
      };
      if (TR.word) TR.word({ w: w, low: low, i: i, toks: toks, week: week, safe: safe, rnd: rnd,
                             isWord: isWord, put: put, rule: rule, loose: loose });
    });
    var clean = function (l) { return uniq(shuffle(l, rnd)).filter(function (c) { return c !== sentence; }); };
    var r = clean(rule);
    return r.concat(clean(loose).filter(function (c) { return r.indexOf(c) < 0; }));
  }

  // «¿Cómo se dice…?» from one of the block's examples.
  // Minimal pairs, «nono / nonno = noveno / abuelo», «avó / avô = abuela /
  // abuelo»: which one means…?
  function pairQuestion(b, rnd) {
    var pairs = (b.ex || []).map(function (p) { return [strip(p[0]).split(" / "), strip(p[1]).split(" / ")]; })
      .filter(function (p) { return p[0].length === 2 && p[1].length === 2 && p[0][0] !== p[0][1] &&
                                   p[1][0] !== p[1][1] && !/[:«»]/.test(p[1].join("")) &&
                                   // «pelo / pêlo = por el / pelo»: asking «pelo» gives it away
                                   p[1].every(function (es) { return p[0].indexOf(es.replace(/\s*\(.*\)/, "")) < 0; }); });
    if (!pairs.length) return null;
    var pk = pairs[Math.floor(rnd() * pairs.length)], k = rnd() < 0.5 ? 0 : 1;
    // Two options are a coin toss: a form from another pair of the block
    // makes it a real question (avó / avô / avós).
    var opts = pk[0].slice();
    var others = shuffle(pairs.filter(function (p) { return p !== pk; }), rnd);
    if (others.length) opts.push(others[0][0][Math.floor(rnd() * 2)]);
    return { kind: "pair", prompt: "¿Cuál significa «" + pk[1][k] + "»?", stem: "", answer: pk[0][k],
             options: shuffle(opts, rnd) };
  }

  function fold(s) { return String(s).normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase(); }
  function cleanTok(w) { return String(w).toLowerCase().replace(/^[«"(¿¡]+|[.,;:!?»")…]+$/g, ""); }
  // Does a word belong to what the block teaches (its forms, a suffix -ões,
  // a stem sar-, a word of a form of several words)?
  function isForm(fs, word) {
    var w = cleanTok(word);
    return !!w && fs.some(function (f) {
      if (f === w) return true;
      if (f.charAt(0) === "-" && f.length > 2) return w.slice(-(f.length - 1)) === f.slice(1);
      if (f.slice(-1) === "-" && f.length > 2) return w.indexOf(f.slice(0, -1)) === 0;
      return f.indexOf(" ") > 0 && f.split(/\s+/).indexOf(w) >= 0;
    });
  }
  // The words of an example marked with asterisks (*il* latte, si*gn*ore):
  // the indices, in the example without its marks.
  function marked(raw) {
    var inside = false, out = {};
    String(raw).trim().split(/\s+/).forEach(function (t, i) {
      var n = (t.replace(/\*\*/g, "").match(/\*/g) || []).length;
      if (inside || n) out[i] = 1;
      if (n % 2) inside = !inside;
    });
    return out;
  }
  // A trap version tests the block when the word it changes is a form of
  // the block or a marked word of the example.
  function onBlock(sentence, trap, fs, mk) {
    var a = sentence.split(" "), t = trap.split(" ");
    if (a.length !== t.length) return false;
    // An example with marks says exactly where the point is («*il* sale»:
    // the article, not the noun); without marks, the forms of the block.
    var marks = Object.keys(mk).length > 0;
    for (var i = 0; i < a.length; i++) {
      if (a[i] === t[i]) continue;
      if (marks ? mk[i] : (isForm(fs, a[i]) || isForm(fs, t[i]))) return true;
    }
    return false;
  }

  // «¿Cuál está bien?»: one example of the block and two versions of it with
  // the error the block warns about.
  function trapQuestion(lesson, b, rnd, week, isWord, avoid) {
    var pool = allEx(lesson);
    var known = {}; pool.forEach(function (p) { known[p[0].toLowerCase()] = 1; });
    var fs = forms(b), accents = ACCENT_BLOCK.test([b.h, b.r].join(" "));
    var mine = shuffle((b.ex || []).map(function (p) { return { raw: p[0], p: [strip(p[0]), strip(p[1])] }; })
      .filter(function (e) { return translation(e.p); }), rnd);
    for (var k = 0; k < mine.length; k++) {
      var pick = mine[k].p, mk = marked(mine[k].raw);
      var prompt = "¿Cuál está bien? «" + pick[1] + "»";
      if (avoid && avoid[prompt + "||" + pick[0]]) continue;
      var bare = function (t) { return fold(t) === fold(pick[0]); };
      var tr = traps(pick[0], rnd, week, isWord).filter(function (t) {
        return !known[t.toLowerCase()] && onBlock(pick[0], t, fs, mk);
      });
      // Not two options that only lose or change an accent, unless the
      // block is about accents: the rule, not the eye for a tilde.
      if (!accents) tr = tr.filter(function (t) { return !bare(t); }).concat(tr.filter(bare).slice(0, 1));
      tr = tr.slice(0, 2);
      // Only one mistake possible: the second option carries two.
      if (tr.length === 1) {
        var toks = pick[0].split(" ");
        var t2 = traps(tr[0], rnd, week, isWord).filter(function (t) {
          // two mistakes in two words is another sentence: half of it stays
          var same = t.split(" ").filter(function (w, j) { return w === toks[j]; }).length;
          return t !== pick[0] && t.toLowerCase() !== tr[0].toLowerCase() && !known[t.toLowerCase()] &&
                 same >= Math.ceil(toks.length / 2) && (accents || !bare(t) || !bare(tr[0]));
        })[0];
        if (t2) tr.push(t2);
      }
      // Always the same sentence with a mistake in it: other sentences of the
      // block give the answer away by their meaning, not by the rule.
      if (tr.length === 2)
        return { kind: "trap", prompt: prompt, stem: "", answer: pick[0], options: shuffle([pick[0]].concat(tr), rnd) };
    }
    return null;
  }

  // only: "trap" (the trap or the pair, what tests the block), "similar"
  // («¿Cómo se dice?» among the examples of the lesson), or both.
  function exQuestion(lesson, b, rnd, week, isWord, avoid, only) {
    var pool = allEx(lesson);
    var mine = (b.ex || []).map(function (p) { return [strip(p[0]), strip(p[1])]; })
      .filter(translation);
    if (!mine.length) return only === "similar" ? null : pairQuestion(b, rnd);
    var tq = only === "similar" ? null : trapQuestion(lesson, b, rnd, week, isWord, avoid);
    if (tq || only === "trap") return tq;
    var pick = mine[Math.floor(rnd() * mine.length)];
    // The most similar sentences are the useful distractors: same words,
    // another form (capiamo / capisco), not something obviously unrelated.
    var words = function (x) { return x.toLowerCase().replace(/[^a-zà-ÿ' -]/g, "").split(/\s+/); };
    var mw = words(pick[0]);
    var sim = function (x) {
      var w = words(x), n = 0;
      w.forEach(function (t) { if (mw.indexOf(t) >= 0) n += 2; else if (mw.some(function (m) { return m.slice(0, 4) === t.slice(0, 4) && t.length > 3; })) n += 1; });
      return n - Math.abs(w.length - mw.length) * 0.3 + rnd() * 0.5;
    };
    var others = uniq(shuffle(pool, rnd).map(function (p) { return p[0]; })
      .filter(function (x) { return x.toLowerCase() !== pick[0].toLowerCase(); })
      .sort(function (a, b) { return sim(b) - sim(a); })).slice(0, 2);
    // Another sentence of the block is a distractor only if it shares most of
    // the words: otherwise the meaning gives the answer away, not the rule.
    others = others.filter(function (x) { return sim(x) >= mw.length; });
    if (others.length < 2) return null;
    return { kind: "ex", prompt: TX.howSay || "¿Cómo se dice?", stem: pick[1], answer: pick[0],
             options: shuffle([pick[0]].concat(others), rnd) };
  }

  // A block with only text: blank one form of its rule and offer forms from
  // the rest of the lesson («Completá la regla»).
  // isWord: the glossary as a dictionary of the language's words.
  function ruleQuestion(lesson, b, rnd, isWord) {
    if (!isWord) return null;
    // Only clean forms of the language (every word known to the glossary,
    // an elided article aside: l'amica), never a Spanish word that happened
    // to sit between two asterisks.
    var clean = function (f) {
      f = f.trim();
      return f.length >= 3 && /^[a-zà-ÿ' -]+$/i.test(f) && f.indexOf("/") < 0 && !/^\s|\s$/.test(f) &&
        f.split(/[\s-]+/).every(function (w) { return isWord(w.replace(/^[a-zà-ÿ]+'/, "")) || isWord(w); }) ? f : null;
    };
    // Only the forms of the text shown as the stem (the rule and its
    // paragraphs): a form from the warning leaves the stem without a gap.
    var text = [b.r].concat(b.p || []).filter(Boolean).join(" ");
    var forms = (text.match(/\*([^*]{3,24})\*/g) || []).map(function (x) { return clean(x.replace(/\*/g, "")); })
      .filter(Boolean);
    forms = uniq(forms);
    if (!forms.length) return null;
    var pick = forms[Math.floor(rnd() * forms.length)];
    var all = [];
    lesson.blocks.forEach(function (bb) {
      var t = [bb.r].concat(bb.p || [], bb.ex ? bb.ex.map(function (e) { return e[0]; }) : [], [bb.warn, bb.tip]).filter(Boolean).join(" ");
      (t.match(/\*([^*]{3,24})\*/g) || []).forEach(function (x) { all.push(x.replace(/\*/g, "")); });
    });
    // Distractors of the same kind as the gap: same number of words and
    // either the same class (ser / estar, em / de / a, no / na) or a near
    // shape (falo / fala); «ter | melhor / falaremos» gives itself away.
    var others = uniq(shuffle(all, rnd).map(clean).filter(function (f) {
      return f && f.toLowerCase() !== pick.toLowerCase() && forms.indexOf(f) < 0 &&
        f.split(/\s+/).length === pick.split(/\s+/).length && akin(f.toLowerCase(), pick.toLowerCase());
    })).slice(0, 2);
    if (others.length < 2) return null;
    var src = [b.r].concat(b.p || []).filter(function (t) { return t && t.indexOf("*" + pick + "*") >= 0; })[0];
    if (!src) return null;
    var stem = strip(src.replace("*" + pick + "*", "___"));
    // A hole glued to letters or a stray asterisk: the markup was uneven.
    // The answer still in the stem gives itself away.
    if (/[a-zà-ÿ]___|___[a-zà-ÿ]/i.test(stem) || stem.indexOf("*") >= 0 || stem.indexOf("___") < 0 ||
        (" " + stem.toLowerCase().replace(/[^a-zà-ÿ' ]/g, " ") + " ").indexOf(" " + pick.toLowerCase() + " ") >= 0) return null;
    if (stem.length > 160) stem = stem.slice(0, 157) + "…";
    return { kind: "rule", prompt: "Completá la regla", stem: stem, answer: pick,
             options: shuffle([pick].concat(others), rnd) };
  }

  // Closed classes (LANG.rules.classes): «essere / avere», «em / de / a».
  var CLASSES = R.classes || [];
  function lev(a, b) {
    var m = [], i, j;
    for (i = 0; i <= a.length; i++) m[i] = [i];
    for (j = 0; j <= b.length; j++) m[0][j] = j;
    for (i = 1; i <= a.length; i++) for (j = 1; j <= b.length; j++)
      m[i][j] = Math.min(m[i - 1][j] + 1, m[i][j - 1] + 1, m[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    return m[a.length][b.length];
  }
  // Two forms are of a kind: same closed class, or at most half the letters apart.
  function akin(a, b) {
    if (CLASSES.some(function (c) { return c.indexOf(a) >= 0 && c.indexOf(b) >= 0; })) return true;
    return lev(a, b) <= Math.max(2, Math.floor(Math.max(a.length, b.length) / 2));
  }
  function overlap(a, b) {
    var wa = a.toLowerCase().split(/[^a-zà-ÿ']+/).filter(function (w) { return w.length > 2; });
    var wb = b.toLowerCase().split(/[^a-zà-ÿ']+/);
    return wa.filter(function (w) { return wb.indexOf(w) >= 0; }).length;
  }

  // «Completá la tabla» from one cell of the block's table.
  // A table of pairs side by side (Letra | Nombre | Letra | Nombre): two
  // tables of two columns, one under the other.
  function unpair(t) {
    var h = t.head || [], n = h.length;
    if (n < 4 || n % 2 || !strip(h[0])) return t;
    for (var k = 0; k < n / 2; k++) if (strip(h[k]) !== strip(h[k + n / 2])) return t;
    var rows = t.rows.map(function (r) { return r.slice(0, n / 2); })
      .concat(t.rows.map(function (r) { return r.slice(n / 2); }))
      .filter(function (r) { return r.some(function (c) { return strip(c); }); });
    return { head: h.slice(0, n / 2), rows: rows };
  }
  // A table that is a list («1 um», «12 doze», «30 trinta»): every cell a
  // number and its word.  «¿Cómo se escribe 12?»
  var NUMCELL = /^(\d[\d.]*)\s+([^\d].*)$/;
  function listQuestion(t, rnd, avoid) {
    var items = [];
    t.rows.forEach(function (r) {
      r.forEach(function (c) {
        strip(c).split(/,\s*(?=\d)/).forEach(function (x) {
          var m = NUMCELL.exec(x.trim());
          if (m) items.push([m[1], m[2].trim()]);
        });
      });
    });
    var cells = 0;
    t.rows.forEach(function (r) { r.forEach(function (c) { if (strip(c)) cells++; }); });
    var numeric = 0;
    t.rows.forEach(function (r) { r.forEach(function (c) { if (NUMCELL.test(strip(c))) numeric++; }); });
    if (!cells || numeric < cells * 0.8) return undefined;          // not a list
    var ok = items.filter(function (x) { return usable(x[1]) && !/[()]/.test(x[1]); });
    ok = shuffle(ok, rnd);
    for (var k = 0; k < ok.length; k++) {
      var p = ok[k], prompt = "¿Cómo se escribe el número?";
      if (avoid && avoid[prompt + "|" + p[0] + "|" + p[1]]) continue;
      var others = uniq(shuffle(ok, rnd).map(function (x) { return x[1]; })
        .filter(function (x) { return x.toLowerCase() !== p[1].toLowerCase(); }))
        .sort(function (a, b) { return lev(a.toLowerCase(), p[1].toLowerCase()) - lev(b.toLowerCase(), p[1].toLowerCase()); });
      if (others.length < 2) return null;
      return { kind: "table", prompt: prompt, stem: p[0], answer: p[1], options: shuffle([p[1]].concat(others.slice(0, 2)), rnd) };
    }
    return null;
  }
  // How much a row label shows up in a cell (ca, co, cu ↔ casa, cosa, cubo;
  // lo ↔ lo zio; -o ↔ libro): the example would give the row away.
  function echoes(label, cell) {
    var cw = cell.toLowerCase().split(/[^a-zà-ÿ']+/).filter(Boolean), n = 0;
    label.toLowerCase().split(/[^a-zà-ÿ'\-]+/).forEach(function (t) {
      if (t.charAt(0) === "-" && t.length > 1) { if (cw.some(function (w) { return w.slice(-(t.length - 1)) === t.slice(1); })) n++; }
      else if (t.slice(-1) === "-" && t.length > 1) { if (cw.some(function (w) { return w.indexOf(t.slice(0, -1)) === 0; })) n++; }
      else if (t.length >= 2 && cw.some(function (w) { return w.indexOf(t) === 0; })) n++;
    });
    return n;
  }
  function tableQuestion(b, rnd, avoid) {
    var t = b.table;
    if (!t || !t.rows || !t.rows.length) return null;
    var list = listQuestion(t, rnd, avoid);
    if (list !== undefined) return list;
    t = unpair(t);
    if (t.rows.length < 3 || t.rows[0].length < 2) return null;
    var head = t.head || [];
    var labelled = head.some(function (h) { return strip(h); });
    var hasExample = head.some(function (h) { return EXAMPLE_COL.test(strip(h)); });
    var key = function (q) { return q.prompt + "|" + q.stem + "|" + q.answer; };
    var tries = [];
    t.rows.forEach(function (r, ri) {
      for (var c = 1; c < r.length; c++) {
        var cell = strip(r[c]), hc = strip(head[c] || "");
        // A column without a name in a table that names them (the second
        // half of «con avere | · | con essere | ·») asks nothing clear.
        if (labelled && !hc) continue;
        // The example column: asked the other way round, example → row.
        var rev = EXAMPLE_COL.test(hc);
        // A comment on the row (Nota, Ojo…), or the Spanish of the example
        // column: not the form the block teaches.
        if (!rev && (COMMENT_COL.test(hc) || (hasExample && SPANISH_COL.test(hc)))) continue;
        if (rev && (!strip(head[0]) || !usable(cell))) continue;
        if (!rev && (!usable(cell) || cell.length > 32)) continue;
        var ask = rev ? 0 : c;
        var answer = rev ? strip(r[0]) : cell;
        if (!usable(answer) || answer.length > 32) continue;
        var col = uniq(t.rows.map(function (x) { return strip(x[ask]); }).filter(function (x) {
          return usable(x) && x.length <= 32 && x.toLowerCase() !== answer.toLowerCase();
        }));
        if (col.length >= 2 && strip(r[0])) tries.push({ ri: ri, c: c, cell: cell, answer: answer, col: col, rev: rev });
      }
    });
    // A cell that repeats words of its own row label («se eu for → se eu
    // fosse») is found by matching, not by knowing: only if the other
    // options repeat them too.  The options closest in shape go first.
    tries = shuffle(tries, rnd);
    for (var k = 0; k < tries.length; k++) {
      var p = tries[k], rowLabel = strip(t.rows[p.ri][0]), colLabel = strip(head[p.c] || ""), col;
      if (p.rev) {
        // «Ejemplo: casa, cosa, cubo → Se escribe»: only if the example
        // does not spell its row out (ca, co, cu).
        var own = echoes(p.answer, p.cell);
        col = p.col.filter(function (x) { return echoes(x, p.cell) >= own; });
      } else {
        var ov = overlap(p.cell, rowLabel);
        col = p.col.filter(function (x) { return overlap(x, rowLabel) >= Math.min(ov, 1); });
      }
      if (col.length < 2) continue;
      col = shuffle(col, rnd).sort(function (a, b) {
        return Math.abs(a.length - p.answer.length) - Math.abs(b.length - p.answer.length) ||
               lev(a.toLowerCase(), p.answer.toLowerCase()) - lev(b.toLowerCase(), p.answer.toLowerCase());
      });
      var q = p.rev
        ? { kind: "table", prompt: "Completá la tabla", stem: colLabel + ": " + p.cell + " → " + strip(head[0]),
            answer: p.answer, options: shuffle([p.answer].concat(col.slice(0, 2)), rnd) }
        : { kind: "table", prompt: "Completá la tabla",
            stem: (strip(head[0]) ? strip(head[0]) + ": " : "") + rowLabel + (colLabel ? " → " + colLabel : ""),
            answer: p.cell, options: shuffle([p.cell].concat(col.slice(0, 2)), rnd) };
      if (avoid && avoid[key(q)]) continue;
      return q;
    }
    return null;
  }

  // A check written by hand in tools/lessons («q»), for the blocks whose
  // text gives the generators nothing to work with (advice, a rule without
  // forms of the language, a table of labels).
  function handQuestion(b, rnd, avoid) {
    var qs = (b.q || []).filter(function (q) { return !avoid || !avoid[q.prompt + "|" + (q.stem || "") + "|" + q.answer]; });
    if (!qs.length) qs = b.q || [];
    if (!qs.length) return null;
    var q = qs[Math.floor(rnd() * qs.length)];
    return { kind: "hand", prompt: q.prompt, stem: q.stem || "", answer: q.answer,
             options: shuffle(q.options.slice(), rnd), fig: q.fig };
  }

  // A table that fits beside the rule: at most three rows of three columns.
  function smallTable(t) {
    return !!t && (t.rows || []).length <= 3 && (t.head || (t.rows[0] || [])).length <= 3;
  }
  /* The forms the block teaches, to be marked in its examples (signaling:
     d = 0,38): the italic forms of the rule and the short cells of its table. */
  function forms(b) {
    var out = [];
    var add = function (x) {
      strip(x).split(/\s*(?:\/|,|;|→|\+|=)\s*/).forEach(function (f) {
        f = f.replace(/[.!?¿¡«»()]/g, "").trim();
        if (f && f.length >= 2 && f.split(/\s+/).length <= 3 && /[a-zà-ÿ]/i.test(f)) out.push(f.toLowerCase());
      });
    };
    [b.r, b.warn, b.tip].concat(b.p || []).forEach(function (t) {
      // **bold** is emphasis on the Spanish, not a form (and it would pair
      // the wrong asterisks: «**en curso**. Gerundio: *-are*»)
      (String(t || "").replace(/\*\*[^*]+\*\*/g, " ").match(/\*([^*]+)\*/g) || []).forEach(function (m) { add(m.replace(/\*/g, "")); });
    });
    if (b.table) (b.table.rows || []).forEach(function (r) { r.slice(1).forEach(function (c) { if (strip(c).length <= 30) add(c); }); });
    return uniq(out).sort(function (a, b2) { return b2.length - a.length; });
  }

  function qkey(q) { return q.prompt + "|" + (q.stem || "") + "|" + q.answer; }

  // The playable sequence: intro, then each block followed by its check.
  function steps(lesson, rnd, week, isWord, only) {
    rnd = rnd || Math.random;
    // only: the block indices of one part of the lesson (a week studied in
    // several short sessions); the intro opens the first part only.
    var out = (!only || only.indexOf(0) >= 0) ? [{ kind: "intro" }] : [];
    // Never the same check twice in a row, nor again if another one is there.
    var asked = {}, last = null;
    var ask = function (q) { last = qkey(q); asked[last] = 1; out.push({ kind: "quiz", q: q }); };
    lesson.blocks.forEach(function (b, i) {
      if (only && only.indexOf(i) < 0) return;
      // One idea per screen (segmenting: Mayer 2017), the examples first
      // (PACE: the form in context, then the rule), the big tables as cards,
      // the trap on its own.
      if (b.ex && b.ex.length) out.push({ kind: "look", i: i });
      out.push({ kind: "rule", i: i });
      // A long table in screens of three or four rows, one under the other,
      // with a quick check on each group before the next one.
      if (b.table && !smallTable(b.table)) {
        var rows = b.table.rows || [], n = Math.ceil(rows.length / 4), size = Math.ceil(rows.length / n);
        for (var c = 0; c < n; c++) {
          var from = c * size, to = Math.min(rows.length, from + size);
          out.push({ kind: "table", i: i, from: from, to: to, chunk: c, chunks: n });
          if (n > 1 && c < n - 1) {
            var cq = tableQuestion({ table: { head: b.table.head, rows: rows.slice(from, to) } }, rnd, asked);
            if (cq) { cq.block = i; ask(cq); }
          }
        }
      }
      if (b.warn || b.tip || (b.more && b.more.length)) out.push({ kind: "trap", i: i });
      // The first generator with a check not asked yet in this lesson (the
      // whole table after its parts, a «q» already seen).
      var gens = [
        function () { return b.table && tableQuestion(b, rnd, asked); },
        // a «q» written by hand tests the block by construction: before the
        // automatic trap, which can only guess where the point is
        function () { return handQuestion(b, rnd, asked); },
        function () { return b.ex && exQuestion(lesson, b, rnd, week, isWord, asked, "trap"); },
        function () { return !b.table && ruleQuestion(lesson, b, rnd, isWord); },
        // other examples of the lesson as options: a check of meaning, the
        // last resort (not when the block has its own «qq» checks)
        function () { return b.ex && !(b.qq || []).length && exQuestion(lesson, b, rnd, week, isWord, asked, "similar"); },
        function () { return b.table && ruleQuestion(lesson, b, rnd, isWord); }
      ];
      var q = null, again = null;
      for (var g = 0; g < gens.length && !q; g++) {
        var cand = gens[g]();
        if (!cand) continue;
        if (!asked[qkey(cand)]) q = cand;
        else if (!again && qkey(cand) !== last) again = cand;
      }
      q = q || again;
      if (q) { q.block = i; ask(q); }
      // «qq»: checks written by hand, all of them asked, in order.
      (b.qq || []).forEach(function (h) {
        var hq = { kind: "hand", prompt: h.prompt, stem: h.stem || "", answer: h.answer,
                   options: shuffle(h.options.slice(), rnd), block: i, fig: h.fig };
        if (qkey(hq) !== last) ask(hq);
      });
    });
    return out;
  }

  var api = { steps: steps, traps: traps, strip: strip, exQuestion: exQuestion, tableQuestion: tableQuestion, forms: forms, smallTable: smallTable };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else root.Lezione = api;
})(this);
