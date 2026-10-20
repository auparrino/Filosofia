/*
 * Las frases — el banco de conversación.  La gramática del recorrido te da
 * el sistema; estas frases te dan el habla: bloques listos, de alta
 * frecuencia, para decir sin pensar.
 *
 * El contenido es del paquete de cada idioma (docs/lang/<código>/
 * frasi_data.js → window.FRASI_DATA): las escenas (SCENES, cada frase
 * [lengua meta, castellano, nota?], con `week` opcional: la semana en la
 * que se abre; sin `week`, abierta desde el principio), las palabras que
 * el cloze no pregunta (STOP), las consignas (ui) y las tablas de errores
 * del hispanohablante para el «Adiviná» (traps; sin tablas, las trampas
 * salen de Lezione.traps y las reglas del idioma).
 *
 * El texto en la lengua meta vive en `f.t`, y también en `f.it` y `f.pt`
 * (los nombres de siempre de cada app, que siguen leyendo el motor y las
 * pantallas).  Los ids («frase:<escena>:<n>») no cambian: las tarjetas de
 * repaso guardadas siguen valiendo.
 *
 * Acá está la lógica de los ejercicios de frase (fichas, escucha,
 * escritura, lampo, «Adiviná»), sin dependencias del DOM, así se prueba con
 * Node.
 */
(function (root) {
  "use strict";

  var DATA = root.FRASI_DATA || { SCENES: [] };
  var SCENES = DATA.SCENES || [];
  /* The scenes of the work route (lang/<código>/trabajo_data.js, js/trabajo.js):
     their phrases are phrases like these (same ids «frase:<escena>:<n>», same
     exercises, same review), but they live on their own screen: they stay out
     of SCENES (the lists of Allena, the scenes of the week, the simulation). */
  var WORK = ((root.TRABAJO_DATA || {}).SCENES || []).filter(function (s) { return s && s.phrases && s.phrases.length; });
  var UI = DATA.ui || {};
  var STOP = DATA.STOP || [];

  /* ------------------------------------------------------------- índice */

  // p[3], optional: the register (f formal, n neutral, c colloquial, e
  // written only); DATA.registro says it in words, at the start of the note.
  var REGISTRO = DATA.registro || {};
  var ALL = [];
  SCENES.concat(WORK).forEach(function (s) {
    s.phrases.forEach(function (p, i) {
      ALL.push({
        id: "frase:" + s.id + ":" + i,
        scene: s.id,
        week: s.week,
        t: p[0],
        it: p[0],          // nombres heredados del campo: el motor y la interfaz leen `it`
        pt: p[0],
        es: p[1],
        reg: p[3] || "",
        work: WORK.indexOf(s) >= 0 ? 1 : 0,
        note: (REGISTRO[p[3]] ? REGISTRO[p[3]] + " " : "") + (p[2] || "")
      });
    });
  });

  var BY_ID = {};
  ALL.forEach(function (f) { BY_ID[f.id] = f; });

  // A word capitalised in mid-sentence is a name (Firenze, Copacabana, Borges).
  var PROPER = {};
  ALL.forEach(function (f) {
    var t = String(f.it).replace(/«|»/g, "").split(/\s+/);
    for (var i = 1; i < t.length; i++) {
      var w = t[i].replace(/^[.,!?;:…"]+|[.,!?;:…"]+$/g, "");
      if (/^[A-ZÀ-Ý]/.test(w) && !/[.!?…]$/.test(t[i - 1])) PROPER[w] = true;
    }
  });

  // The week each scene opens (none: open from the start).
  var SCENE_WEEK = {};
  SCENES.concat(WORK).forEach(function (s) { SCENE_WEEK[s.id] = s.week; });

  function scene(id) {
    var all = SCENES.concat(WORK);
    for (var i = 0; i < all.length; i++) if (all[i].id === id) return all[i];
    return null;
  }

  function ofScene(id) {
    return ALL.filter(function (f) { return f.scene === id; });
  }

  // The scenes already open in a given week of the course.
  function openScenes(week) {
    return SCENES.filter(function (s) { return (s.week || 1) <= (week || 1); });
  }

  /* --------------------------------------------------------- comparar */

  function shuffle(a, rnd) {
    a = a.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor((rnd || Math.random)() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  // Words as the learner sees them on the tiles (punctuation kept on the word).
  function tiles(s) {
    return String(s).replace(/«|»/g, "").split(/\s+/).filter(Boolean);
  }

  /* Tiles as shown on screen: no punctuation and no sentence-initial capital,
     or the tiles give the order away ("Ciao," first, "stai?" last).  Proper
     nouns keep their capital (PROPER is filled at load, see above). */
  function tileWords(s) {
    return tiles(s).map(function (t) {
      var w = t.replace(/^[.,!?;:…"]+|[.,!?;:…"]+$/g, "");
      return PROPER[w] ? w : w.charAt(0).toLowerCase() + w.slice(1);
    }).filter(Boolean);
  }

  // Words as the grader compares them: lower case, no punctuation, no
  // accents or cedilla.  Phrase drills train speed of recall, so a missing
  // accent on a phone keyboard is not an error here (the grammar rounds stay
  // strict).  A hyphen counts as a space (chamo-me = chamo me) and the
  // apostrophe disappears (dov'è = dove, d'água = dagua).
  function words(s) {
    return String(s == null ? "" : s)
      .toLowerCase()
      .normalize("NFD").replace(/[̀-ͯ]/g, "")
      .replace(/[’‘`´]/g, "'")
      .replace(/'/g, "")
      .replace(/[^a-z0-9 ]+/g, " ")
      .split(/\s+/)
      .filter(Boolean);
  }

  // Longest common subsequence of two word lists.
  function lcs(a, b) {
    var prev = [], cur, i, j;
    for (j = 0; j <= b.length; j++) prev[j] = 0;
    for (i = 1; i <= a.length; i++) {
      cur = [0];
      for (j = 1; j <= b.length; j++) {
        cur[j] = a[i - 1] === b[j - 1] ? prev[j - 1] + 1
               : Math.max(prev[j], cur[j - 1]);
      }
      prev = cur;
    }
    return prev[b.length];
  }

  /* Similarity 0..1 between what was written and the target, word by word.
     Returns also which target words were hit, so the UI can colour them. */
  function compare(said, target) {
    var s = words(said), t = words(target);
    if (!t.length) return { score: 0, hits: [] };
    var common = lcs(s, t);
    var score = (2 * common) / (s.length + t.length || 1);
    var pool = s.slice();
    var hits = t.map(function (w) {
      var k = pool.indexOf(w);
      if (k >= 0) { pool.splice(k, 1); return true; }
      return false;
    });
    return { score: score, hits: hits };
  }

  /* A written phrase: exact words = right; one slip in a longer phrase =
     close.  Word order counts, because that is what makes it sound native. */
  function gradeWritten(given, target) {
    var r = compare(given, target);
    var same = words(given).join(" ") === words(target).join(" ");
    r.verdict = same ? "giusto" : r.score >= 0.8 ? "quasi" : "sbagliato";
    return r;
  }

  /* ------------------------------------------- errores del hispanohablante

     traps(frase) devuelve la misma frase con los errores típicos de quien
     habla español: la palabra española que se cuela, la contracción
     deshecha a la española, la grafía española…  Nunca un error que se
     descarte por el sentido: siempre la misma frase.  Con las tablas del
     paquete (FRASI_DATA.traps: span, alone, contr, art, spell, loose) se
     recorre la frase acá; sin tablas, las trampas son las de
     Lezione.traps(…, safe), con las reglas del idioma. */

  function uniq(a) {
    var seen = {};
    return a.filter(function (x) { if (seen[x]) return false; seen[x] = 1; return true; });
  }

  function lezione() {
    return root.Lezione || (typeof require === "function" ? (function () { try { return require("./lezione.js"); } catch (e) { return null; } })() : null);
  }

  function tableTraps(T, sentence, rnd, week) {
    // T.from: the week each table starts to count (a contraction is not a
    // trap before the week that teaches it).
    var from = T.from || {};
    var on = function (k) { return !from[k] || (week || 52) >= from[k]; };
    var toks = String(sentence).split(" ");
    var rule = [], soft = [];
    var has = function (o, k) { return !!o && Object.prototype.hasOwnProperty.call(o, k); };
    toks.forEach(function (t, i) {
      var m = t.match(/^([«"(¿¡]*)([A-Za-zÀ-ÿ'-]+)([.,;:!?»")…]*)$/);
      if (!m) return;
      var w = m[2], low = w.toLowerCase();
      if (i > 0 && w[0] !== low[0]) return;          // a name (Rio, Bia) stays as it is
      var hasNext = !!toks[i + 1];
      var put = function (nw, bag) {
        if (w[0] !== low[0]) nw = nw.charAt(0).toUpperCase() + nw.slice(1);
        var c = toks.slice(); c[i] = m[1] + nw + m[3]; bag.push(c.join(" "));
      };
      if (on("span") && has(T.span, low)) {
        // alone at the end of the sentence it can be another word (muito → mucho, not muy)
        put(!hasNext && has(T.alone, low) ? T.alone[low] : T.span[low], rule);
      }
      if (on("contr") && has(T.contr, low) && hasNext) put(T.contr[low], rule);
      if (on("art") && has(T.art, low) && hasNext) put(T.art[low], soft);
      if (on("spell") && T.spell) T.spell(low).forEach(function (x) { put(x, rule); });
      if (on("loose") && T.loose) T.loose(low).forEach(function (x) { put(x, soft); });
    });
    var same = words(sentence).join(" ");
    var clean = function (l) {
      return uniq(shuffle(l, rnd)).filter(function (c) { return words(c).join(" ") !== same; });
    };
    var r = clean(rule);
    return r.concat(clean(soft).filter(function (c) { return r.indexOf(c) < 0; }));
  }

  /* week: the week of the phrase's scene.  The traps test only the grammar
     taught by then (no «em o» before the contractions, no «lo bagno»
     before the articles); without a week, everything (52). */
  function traps(sentence, rnd, week) {
    rnd = rnd || Math.random;
    week = week || 52;
    if (DATA.traps) return tableTraps(DATA.traps, sentence, rnd, week);
    var Lz = lezione();
    if (!Lz || !Lz.traps) return [];
    var same = words(sentence).join(" ");
    return Lz.traps(sentence, rnd, week, null, true).filter(function (t) { return words(t).join(" ") !== same; });
  }

  /* The same phrase with a word that always goes first (FRASI_DATA.glue:
     article, preposition, clitic) swapped with the next one (a palavra →
     palavra a, ci vediamo → vediamo ci): wrong by its form, never by its
     sense, and never another right order (Não sei / Sei não).  The
     punctuation stays where it was. */
  var GLUE = {};
  (DATA.glue || []).forEach(function (w) { GLUE[w] = true; });
  function orderVariants(sentence) {
    var toks = String(sentence).split(" ");
    var parts = toks.map(function (t) {
      var m = t.match(/^([«"(¿¡]*)(.*?)([.,;:!?»")…]*)$/);
      return { pre: m[1], w: m[2], post: m[3] };
    });
    var out = [];
    for (var i = 0; i + 1 < parts.length; i++) {
      var a = parts[i], b = parts[i + 1];
      // not across a comma or a stop, not with a name or a quoted word
      if (!a.w || !b.w || a.post || b.pre || a.pre || /[«"]/.test(b.post)) continue;
      if (!GLUE[a.w.toLowerCase()] || a.w.toLowerCase() === b.w.toLowerCase()) continue;
      if ((i > 0 && PROPER[a.w]) || PROPER[b.w] || !/^[A-Za-zÀ-ÿ']+$/.test(b.w)) continue;
      var c = parts.map(function (p) { return { pre: p.pre, w: p.w, post: p.post }; });
      var first = a.w.charAt(0) !== a.w.charAt(0).toLowerCase();
      var wa = b.w, wb = a.w;
      if (first) {
        wa = wa.charAt(0).toUpperCase() + wa.slice(1);
        if (!PROPER[wb]) wb = wb.charAt(0).toLowerCase() + wb.slice(1);
      }
      c[i].w = wa; c[i + 1].w = wb;
      out.push(c.map(function (p) { return p.pre + p.w + p.post; }).join(" "));
    }
    var same = words(sentence).join(" ");
    return uniq(out).filter(function (o) { return words(o).join(" ") !== same; });
  }

  /* --------------------------------------------------------- ejercicios */

  /* Cada frase genera ejercicios de tipo distinto.  Todos comparten la
     forma de los ítems del curso (id, type, prompt, stem, answer), más el
     campo `frase` que lleva la frase de origen. */

  function tilesItem(f) {
    var own = tileWords(f.it);
    var others = shuffle(ALL.filter(function (g) { return g.scene === f.scene && g.id !== f.id; }));
    var extra = [];
    var have = words(f.it);
    for (var i = 0; i < others.length && extra.length < 3; i++) {
      var cand = tileWords(others[i].it);
      var w = cand[Math.floor(Math.random() * cand.length)];
      var key = words(w).join(" ");
      if (key && have.indexOf(key) < 0 && extra.every(function (e) {
        return words(e).join(" ") !== key;
      })) extra.push(w);
    }
    return {
      id: f.id, frase: f, src: "frasi", type: "tiles",
      prompt: UI.tiles || "Armá la frase",
      stem: f.es,
      tiles: shuffle(own.concat(extra)),
      answer: f.it, accept: [f.it], note: f.note
    };
  }

  /* The phrases that look most like f on one side («es» or «it»): same
     scene, words in common, similar length, both questions or neither.
     Distractors that could be told apart by their look give the answer away. */
  function similar(f, n, side) {
    var key = function (x) { return String(x[side] || ""); };
    var toks = function (x) {
      return key(x).toLowerCase().split(/[^a-zà-ÿ']+/).filter(function (w) { return w.length > 2; });
    };
    var mine = toks(f), used = {};
    used[key(f)] = true;
    var score = function (g) {
      var gw = toks(g);
      return mine.filter(function (w) { return gw.indexOf(w) >= 0; }).length * 2 + (g.scene === f.scene ? 2 : 0) -
        Math.abs(key(g).length - key(f).length) / 12 + (/\?$/.test(key(g)) === /\?$/.test(key(f)) ? 1 : 0);
    };
    return shuffle(ALL).filter(function (g) {
      if (g.id === f.id || used[key(g)]) return false;
      used[key(g)] = true;
      return true;
    }).slice(0, 120).sort(function (a, b) { return score(b) - score(a); }).slice(0, n);
  }

  function listenItem(f) {
    var best = similar(f, 3, "es");
    return {
      id: f.id, frase: f, src: "frasi", type: "listen",
      prompt: "Escuchá: ¿qué significa?",
      stem: f.it,
      options: shuffle([f.es].concat(best.map(function (g) { return g.es; }))),
      answer: f.es, accept: [f.es], note: f.note
    };
  }

  function writeItem(f) {
    return {
      id: f.id, frase: f, src: "frasi", type: "write",
      prompt: UI.write || "Escribilo (las tildes no cuentan)",
      stem: f.es,
      answer: f.it, accept: [f.it], note: f.note
    };
  }

  function flashItem(f) {
    return {
      id: f.id, frase: f, src: "frasi", type: "flash",
      prompt: "¿Cómo se dice? Pensalo y tocá para ver",
      stem: f.es,
      answer: f.it, accept: [f.it], note: f.note
    };
  }

  /* Cloze en contexto: la frase entera, una palabra para recordar.
     Recuperar una palabra dentro de su bloque la ata al bloque (Nation 2013). */
  function clozeItem(f) {
    var toks = tiles(f.it);
    var cands = [];
    toks.forEach(function (t, i) {
      var core = t.replace(/^[^A-Za-zÀ-ÿ]+|[^A-Za-zÀ-ÿ]+$/g, "");
      if (core.length >= 3 && /^[A-Za-zÀ-ÿ]+$/.test(core) &&
          STOP.indexOf(core.toLowerCase()) < 0) cands.push({ i: i, core: core });
    });
    if (!cands.length) return tilesItem(f);
    var c = cands[Math.floor(Math.random() * cands.length)];
    var stem = toks.map(function (t, i) {
      return i === c.i ? t.replace(c.core, "___") : t;
    }).join(" ");
    return {
      id: f.id, frase: f, src: "frasi", type: "cloze",
      prompt: "Completá la frase: «" + f.es + "»",
      stem: stem,
      answer: c.core, accept: [c.core], note: f.note
    };
  }

  /* Dictado: escuchar y escribir une sonido y grafía. */
  function dictationItem(f) {
    return {
      id: f.id, frase: f, src: "frasi", type: "dictation",
      prompt: UI.dictation || "Dictado: escuchá y escribí lo que oís",
      stem: f.it,
      answer: f.it, accept: [f.it], note: f.note
    };
  }

  /* Pretest: intentar adivinar antes de ver la respuesta mejora el
     recuerdo, aun cuando se falla (Kornell, Hays & Bjork 2009; Richland,
     Kornell & Kao 2009).  No cuesta vidas ni entra en el repaso.
     Las opciones son la misma frase con el error del hispanohablante
     (Grazie mile, Muy obrigado, Vamos a la praia), con solo la gramática
     ya enseñada en la semana de la escena: se adivina por la forma, nunca
     por el sentido.  Nunca otra frase entera: si no alcanzan las trampas,
     la misma frase con dos errores o con dos palabras cambiadas de lugar,
     y si tampoco, dos opciones.  Sin ninguna versión equivocada posible
     no hay «Adiviná»: null, y la frase se presenta con su tarjeta.
     `why` marca las opciones armadas sin una regla del diagnóstico (el
     orden), para poder decir qué tienen de malo. */
  function guessItem(f, rnd) {
    rnd = rnd || Math.random;
    var seen = {};
    seen[words(f.it).join(" ")] = true;
    var n0 = words(f.it).length;
    var fresh = function (t) {
      var k = words(t).join(" ");
      // a one- or two-word phrase keeps its shape: «Dai!» is «come on!», not
      // «da + i» to be split into «Da il!»
      if (seen[k] || (n0 <= 2 && words(t).length !== n0)) return false;
      seen[k] = true;
      return true;
    };
    var others = traps(f.it, rnd, f.week).filter(fresh).slice(0, 2);
    var why = {};
    // Only one mistake possible: the second option carries two.
    if (others.length === 1) {
      var two = traps(others[0], rnd, f.week).filter(fresh)[0];
      if (two) others.push(two);
    }
    // Still short: the same words in another order.
    if (others.length < 2) {
      shuffle(orderVariants(f.it), rnd).filter(fresh).slice(0, 2 - others.length).forEach(function (o) {
        others.push(o); why[o] = "order";
      });
    }
    if (!others.length) return null;
    return {
      id: f.id, frase: f, src: "frasi", type: "guess",
      prompt: "Adiviná antes de aprenderla: ¿cuál está bien? (no pasa nada si le errás)",
      stem: f.es,
      options: shuffle([f.it].concat(others), rnd),
      answer: f.it, accept: [f.it], note: f.note, why: why
    };
  }

  /* What a wrong option of the «Adiviná» changes, in words: the fallback
     when the diagnosis of the language has nothing specific to say
     («Tu opción dice *dos* donde va *dois*.»). */
  function explainOption(option, it) {
    var clean = function (s) { return tiles(s).map(function (t) { return t.replace(/^[.,!?;:…"¿¡()]+|[.,!?;:…"()]+$/g, ""); }); };
    var o = clean(option), a = clean(it.answer);
    var low = function (x) { return x.toLowerCase(); };
    var i = 0;
    while (i < o.length && i < a.length && low(o[i]) === low(a[i])) i++;
    var j = 0;
    while (j < o.length - i && j < a.length - i && low(o[o.length - 1 - j]) === low(a[a.length - 1 - j])) j++;
    var bad = o.slice(i, o.length - j).join(" "), good = a.slice(i, a.length - j).join(" ");
    if (it.why && it.why[option] === "order") {
      return "Es el orden: se dice *" + low(good) + "*, no *" + low(bad) + "*. El artículo, la preposición y el pronombre van antes de su palabra.";
    }
    if (!bad && !good) return "";
    if (!bad) return "A tu opción le falta *" + good + "*.";
    if (!good) return "Tu opción tiene *" + bad + "* de más.";
    return "Tu opción dice *" + bad + "* donde va *" + good + "*.";
  }

  // The «Frase nueva» card (afterGuess: it comes right after its «Adiviná»).
  function introItem(f, afterGuess) {
    return { id: f.id, frase: f, src: "frasi", type: "intro",
             prompt: "Frase nueva", stem: f.it, answer: f.it, note: f.note, afterGuess: !!afterGuess };
  }

  function pickItem(f, opts) {
    opts = opts || {};
    // Known phrases are asked to be produced more often than recognised:
    // recall is what makes you fast when you talk.
    // Desirable difficulty (Bjork 1994): a phrase seen for the first time is
    // recognised (tiles); once it is known, it has to be produced.
    var kinds = opts.silent ? ["tiles", "cloze", "flash", "write", "write"]
                            : ["tiles", "cloze", "listen", "dictation", "flash", "write", "write"];
    // A phrase met for the first time today is recognised before it is
    // produced: tiles (the words are given) or its meaning by ear; writing
    // it from memory waits for another session.
    if (opts.fresh) kinds = opts.silent ? ["tiles"] : ["tiles", "tiles", "listen"];
    var k = kinds[Math.floor(Math.random() * kinds.length)];
    return k === "tiles" ? tilesItem(f) : k === "listen" ? listenItem(f)
         : k === "write" ? writeItem(f) : k === "cloze" ? clozeItem(f)
         : k === "dictation" ? dictationItem(f) : flashItem(f);
  }

  /* Una sesión de escena: primero presenta las frases nuevas, después las
     pone a prueba con tipos de ejercicio distintos. */
  function sceneSession(sceneId, cards, opts) {
    opts = opts || {};
    var list = ofScene(sceneId);
    var fresh = list.filter(function (f) { return !cards[f.id]; });
    var known = list.filter(function (f) { return cards[f.id]; });
    // Six new phrases a session: a scene of 18 closes in three sessions, and
    // each session visibly moves the counter (4 a session felt like repeats).
    var newOnes = fresh.slice(0, opts.newCount || 6);
    var out = [];
    // Each new phrase is met (half of them guessed first, and then always
    // shown on its «Frase nueva» card, with its note and how it is built),
    // then recognised later in the session: tiles or by ear, never written
    // from memory the day it was first seen.
    newOnes.forEach(function (f, i) {
      var g = i % 2 === 0 ? guessItem(f) : null;
      if (g) out.push(g);
      out.push(introItem(f, !!g));
    });
    var isNew = {};
    newOnes.forEach(function (f) { isNew[f.id] = true; });
    // Known phrases: the ones due or seen longest ago first.
    var byAge = known.slice().sort(function (a, b) {
      return ((cards[a.id] || {}).due || 0) - ((cards[b.id] || {}).due || 0) + (Math.random() - 0.5) * 86400000;
    });
    var drill = newOnes.concat(byAge.slice(0, Math.max(0, 10 - newOnes.length)));
    shuffle(drill).forEach(function (f) {
      out.push(pickItem(f, { silent: opts.silent, fresh: isNew[f.id] }));
    });
    return out;
  }

  // How many phrases of a scene have been seen at least once.
  function progress(sceneId, cards) {
    var list = ofScene(sceneId), seen = 0, strong = 0;
    list.forEach(function (f) {
      var c = cards[f.id];
      if (c) { seen++; if (c.interval >= 3) strong++; }
    });
    return { total: list.length, seen: seen, strong: strong };
  }

  // Phrase of the day: same for the whole calendar day.  With a week, only
  // phrases of scenes already open (no Camões for a beginner).
  function ofTheDay(d, week) {
    d = d || new Date();
    var talk = ALL.filter(function (f) { return !f.work; });
    var pool = week ? talk.filter(function (f) { return (f.week || 1) <= week; }) : talk;
    if (!pool.length) pool = talk;
    if (!pool.length) return null;                  // a package without phrases yet
    var n = d.getFullYear() * 400 + d.getMonth() * 31 + d.getDate();
    return pool[(n * 7919) % pool.length];
  }

  var api = {
    SCENES: SCENES,
    WORK: WORK,
    SCENE_WEEK: SCENE_WEEK,
    ALL: ALL,
    BY_ID: BY_ID,
    scene: scene,
    ofScene: ofScene,
    openScenes: openScenes,
    tiles: tiles,
    tileWords: tileWords,
    PROPER: PROPER,
    words: words,
    compare: compare,
    gradeWritten: gradeWritten,
    traps: traps,
    tilesItem: tilesItem,
    listenItem: listenItem,
    similar: similar,
    writeItem: writeItem,
    clozeItem: clozeItem,
    dictationItem: dictationItem,
    guessItem: guessItem,
    introItem: introItem,
    explainOption: explainOption,
    orderVariants: orderVariants,
    flashItem: flashItem,
    pickItem: pickItem,
    sceneSession: sceneSession,
    progress: progress,
    ofTheDay: ofTheDay
  };

  if (typeof module === "object" && module.exports) module.exports = api;
  else root.Frasi = api;
})(typeof window !== "undefined" ? window : globalThis);
