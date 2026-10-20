/*
 * La fábrica de preguntas.  Convierte el curso (los ítems de autor de
 * data/course.json), el banco y el conjugador del idioma en rondas
 * jugables: la ronda de la semana, el jefe, Dominala, el repaso, la pausa
 * del café y el Lampo / Relâmpago.
 *
 * Lo que depende de la lengua lo trae el paquete: las personas del
 * conjugador y cuáles se ejercitan (LANG.rules.persons), las formas que
 * también valen (LANG.rules.conj, Conj.accepted), los distractores de cada
 * lengua (LANG.rules.distract: artículos, preposiciones articuladas o
 * contracciones, clases cerradas, pronombres pegados, plurales), las
 * palabras de la semana (LANG.rules.vocab), la semana de cada escena de
 * frases (LANG.rules.sceneWeek) y los textos (LANG.rules.text).
 */
(function (root) {
  "use strict";

  var LANG = root.LANG || {};
  var R = LANG.rules || {};
  var P = R.persons || {};
  var CR = R.conj || {};
  var DR = R.distract || {};
  var TX = R.text || {};

  // The conjugator is the language's (docs/lang/<code>/conjugator.js): it
  // is loaded before, as window.Conj.
  var Conj = root.Conj || null;
  var Frasi = root.Frasi || null;
  var Lab = root.Lab || null;
  var Banca = root.Banca || null;
  var Duelli = root.Duelli || null;
  var Lez = root.Lezione || null;
  var Engine = root.Engine || null;

  function shuffle(a, rnd) {
    a = a.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor((rnd ? rnd() : Math.random()) * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  function sample(a, n) { return shuffle(a).slice(0, n); }

  /* Variety: never-seen items first, then the ones due, then those seen
     longest ago.  What was answered well in the last two days only comes
     back if there is nothing else. */
  function pickFresh(pool, n, state) {
    var cards = (state && state.cards) || {};
    var now = Date.now(), DAY = 86400000;
    var recog = (state && state.recog) || {};
    var rank = function (it) {
      var c = cards[it.id];
      // recognised right, with no card (Reglas.afterAnswer): seen, and next time written
      if (!c && recog[it.id]) return now - recog[it.id] * 60000 < 2 * DAY ? 4 + Math.random() : 2 + Math.random();
      if (!c) return 0 + Math.random();
      if (!c.due || c.due <= now) return 1 + Math.random();
      var last = c.last || (c.due - (c.interval || 0) * DAY);
      return now - last < 2 * DAY ? 4 + Math.random() : 2 + Math.random() + (c.due - now) / (365 * DAY);
    };
    // The same exercise can live under two ids (a book item and an authored
    // one: «limão → limões»): one session asks it once.
    var seen = {};
    return pool.filter(Boolean)
      .map(function (it) { return { it: it, r: rank(it) }; })
      .sort(function (a, b) { return a.r - b.r; })
      .filter(function (x) {
        var k = sameKey(x.it);
        if (seen[x.it.id] || seen[k]) return false;
        seen[x.it.id] = seen[k] = 1;
        return true;
      })
      .slice(0, n).map(function (x) { return x.it; });
  }
  function sameKey(it) {
    var stem = String(it.stem || "").toLowerCase();
    // a bare «___» says nothing: there the question is in the prompt
    if (!/[a-zà-ÿ]/.test(stem)) stem += "|" + String(it.prompt || "").toLowerCase();
    return "=" + stem + "|" + String(it.answer || "").toLowerCase();
  }

  // Bank items near the week's level, to top up a short week without repeating.
  function bankFill(state, n) {
    var out = [];
    if (!Banca || !Banca.loaded()) return out;
    for (var i = 0; i < n * 3 && out.length < n; i++) {
      var it = Banca.pausaItem(state);
      if (it && !out.some(function (o) { return o.id === it.id; })) out.push(it);
    }
    return out;
  }

  /* ------------------------------------------------ preguntas de conjugación */

  /* The persons of the conjugator (0-5), labelled by the language.  Some
     are never asked (persons.skip: «vós»), some seldom
     (persons.weighted, a pool of persons to draw from); the third persons
     can rotate among their pronouns (persons.third: ele, ela, você). */
  var PERSON_LABEL = P.labels || ["1", "2", "3", "4", "5", "6"];
  var THIRD = P.third || null;
  var SKIP = P.skip || [];
  function personLabel(p) {
    if (THIRD && p === 2) return THIRD[0][Math.floor(Math.random() * THIRD[0].length)];
    if (THIRD && p === 5) return THIRD[1][Math.floor(Math.random() * THIRD[1].length)];
    return PERSON_LABEL[p];
  }
  var WEIGHTED = P.weighted || null;
  function skipped(i) { return SKIP.indexOf(i) >= 0; }

  /* The conjugator (docs/lang/<code>/conjugator.js) knows:
     - defective verbs (reaver): conjugate(inf, t, { partial: true }) gives
       null in the persons that do not exist, and throws without partial;
     - info(inf).persons: the persons that make sense (chover: [2];
       custar, acontecer, doer: [2, 5]);
     - accepted(inf, t): the six lists of right answers (double participles:
       tinha pagado / tinha pago, and the like);
     and the language may know other right forms (conj.alt: the verbs
     with essere or avere, mancare, salire…).
     Everything is read defensively, so the drills run on every
     conjugator. */
  function infoOf(verb) { try { return Conj.info(verb) || {}; } catch (e) { return {}; } }
  // A «tense» that conjugate() does not take (it is not in ALL_TENSES): the
  // imperative, the gerund, the participle, when the curriculum lists them
  // as the week's tenses (pt: gerúndio, particípio, imperativo).
  function outsideConjugate(tense) {
    return !!Conj.ALL_TENSES && Conj.ALL_TENSES.indexOf(tense) < 0;
  }
  // The verb has no such form, and the gym does not ask it: no imperative
  // (poder, caber: imperative() gives null; chover, with one person only).
  function lacksForm(verb, tense) {
    if (tense !== "imperativo" || !CR.imperativeForms || !Conj.imperative || !outsideConjugate(tense)) return false;
    var own = infoOf(verb).persons;
    try { return !Conj.imperative(verb) || !!(own && own.length === 1); } catch (e) { return false; }
  }
  function conjForms(verb, tense) {
    if (tense === "imperativo" && CR.imperativeForms && Conj.imperative && outsideConjugate(tense)) {
      // imperative(inf): the language's persons, or null (poder, caber)
      if (lacksForm(verb, tense)) throw new Error("sin imperativo: " + verb);
      return CR.imperativeForms(Conj.imperative(verb));
    }
    try { return Conj.conjugate(verb, tense, { partial: true }); }
    catch (e) { return Conj.conjugate(verb, tense); }
  }
  /* The non-finite forms (gerund, participle) when conjugate() does not take
     them: one form, asked without a person.  { answer, accept, wrong } or
     null.  wrong: what gets mixed up with it — the form of a learner who
     treats the verb as regular (fazido, vido), the other non-finite form,
     the infinitive, the present. */
  function nonFinite(verb, tense) {
    if ((tense !== "gerundio" && tense !== "participio") || !outsideConjugate(tense)) return null;
    var fn = tense === "gerundio" ? Conj.gerund : Conj.participle;
    if (!fn) return null;
    var answer = fn(verb);
    if (!answer) return null;
    var accept = [answer];
    if (tense === "participio" && Conj.participles) {
      var ps = Conj.participles(verb) || {};
      [ps.irregular, ps.regular].forEach(function (x) { if (x && accept.indexOf(x) < 0) accept.push(x); });
    }
    var wrong = [];
    function add(f) { if (f && accept.indexOf(f) < 0 && wrong.indexOf(f) < 0) wrong.push(f); }
    try { add(Conj.regular && Conj.regular(verb, tense)); } catch (e) { /* sin forma regular */ }
    try { add(tense === "gerundio" ? Conj.participle && Conj.participle(verb) : Conj.gerund && Conj.gerund(verb)); } catch (e) { /* */ }
    add(String(verb).replace(/-.*$/, ""));
    try { add(Conj.conjugate(verb, "presente")[2]); } catch (e) { /* */ }
    try { add(Conj.conjugate(verb, (Conj.ALL_TENSES || [])[1])[0]); } catch (e) { /* */ }
    return { answer: answer, accept: accept, wrong: wrong };
  }
  function nonFiniteItem(verb, tense, nf, typed) {
    var item = {
      id: (typed ? "conjw:" : "conj:") + verb + ":" + tense + ":0",
      src: "coniugatore",
      type: typed ? "cloze" : "choice",
      topic: "coniugazione",
      prompt: (typed ? "Escribí" : "Elegí") + " el " + tenseLabel(tense) + " de «" + verb + "»" + esOf(verb),
      stem: "___ (" + verb + ")",
      answer: nf.answer,
      accept: nf.accept,
      note: verb + " · " + tenseLabel(tense) + ": " + nf.accept.join(" / ")
    };
    if (!typed) item.options = shuffle(sample(nf.wrong, 3).concat([nf.answer]));
    return item;
  }
  var EXTRA_LABELS = CR.extraLabels || {};
  function tenseLabel(t) { return (Conj.TENSE_LABELS || {})[t] || EXTRA_LABELS[t] || t; }
  // The other right forms of the whole table (conj.alt: the forms with the
  // other auxiliary), or null.
  function altFor(verb, tense) {
    if (!CR.alt) return null;
    try { return CR.alt(Conj, verb, tense) || null; } catch (e) { return null; }
  }
  function acceptedFor(verb, tense, p, answer, alt) {
    var out = [answer];
    try {
      var acc = Conj.accepted ? Conj.accepted(verb, tense) : null;
      if (acc && acc[p]) [].concat(acc[p]).forEach(function (x) { if (x && out.indexOf(x) < 0) out.push(x); });
    } catch (e) { /* sin variantes */ }
    if (alt && alt[p] && out.indexOf(alt[p]) < 0) out.push(alt[p]);
    return out;
  }
  // The persons that can be asked: the week's (persons), the verb's
  // (info.persons) and the ones the tense has (a defective verb), never
  // the skipped ones (vós).
  function personsFor(verb, forms, persons) {
    var own = infoOf(verb).persons;
    return [0, 1, 2, 3, 4, 5].filter(function (p) {
      if (skipped(p)) return false;
      return forms[p] && (!persons || !persons.length || persons.indexOf(p) >= 0) && (!own || own.indexOf(p) >= 0);
    });
  }
  function labelFor(verb, p) {
    var own = infoOf(verb).persons;
    if (own && own.length === 1) return "";                    // chover: impersonal
    if (own && own.indexOf(0) < 0 && P.impersonal && P.impersonal[p]) return P.impersonal[p];   // custar, doer
    return personLabel(p);
  }

  /* known: the tenses already taught (week.known).  Distractors come only
     from those, so a week-6 learner never sees a subjuntivo as an option. */
  // Some persons seldom (WEIGHTED: tu), or all alike.
  function pickPerson(allowed) {
    var pool = WEIGHTED ? WEIGHTED.filter(function (p) { return allowed.indexOf(p) >= 0; }) : allowed;
    if (!pool.length) pool = allowed;
    if (!pool.length) throw new Error("sin personas para conjugar");
    return pool[Math.floor(Math.random() * pool.length)];
  }
  // The forms of the table as the note shows them (the skipped persons and
  // the missing ones aside), and the other right forms (conj.altNote).
  function formsNote(verb, tense, forms, alt) {
    var said = forms.filter(function (f, i) { return !skipped(i) && f; });
    return verb + " · " + tenseLabel(tense) + ": " + said.join(", ") +
      (alt && CR.altNote ? CR.altNote(alt) : "");
  }
  function esOf(verb) {
    var i = infoOf(verb);
    return i.es ? " (" + i.es + ")" : "";
  }
  function stemOf(verb, p, tail, tense) {
    if (tense === "imperativo" && P.imperative) return "(" + P.imperative[p] + ") ___!" + (tail || "");
    var l = labelFor(verb, p);
    return (l ? l + " " : "") + "___" + (tail || "");
  }

  function conjugationDrill(verb, tense, known, persons) {
    var nf = nonFinite(verb, tense);
    if (nf) return nonFiniteItem(verb, tense, nf, false);
    var forms = conjForms(verb, tense);
    var alt = altFor(verb, tense);
    var p = pickPerson(personsFor(verb, forms, persons));
    var answer = forms[p];
    var accept = acceptedFor(verb, tense, p, answer, alt);

    // Distractors: the same verb in other persons, then the same person in
    // other tenses — the mistakes a learner actually makes.  Several persons
    // often share a form (falava/falava/falava), so the pool must be deduped
    // or the same option shows up twice.  A skipped person (vós) is never
    // an option, nor a right form with the other auxiliary.
    var pool = [];
    function add(f) {
      if (f && f !== answer && pool.indexOf(f) < 0 && accept.indexOf(f) < 0 &&
          !(alt && alt.indexOf(f) >= 0)) pool.push(f);
    }
    forms.forEach(function (f, i) { if (!skipped(i)) add(f); });
    var tenses = known && known.length ? known : Conj.ALL_TENSES;
    shuffle(tenses).forEach(function (t) {
      if (t === tense || pool.length >= 8) return;
      try { add(conjForms(verb, t)[p]); } catch (e) { /* no se conjuga en ese tiempo */ }
    });
    // Last resort: other persons of other tenses, so we always reach 4 options.
    shuffle(tenses).forEach(function (t) {
      if (pool.length >= 3) return;
      try {
        conjForms(verb, t).forEach(function (f, i) { if (!skipped(i)) add(f); });
      } catch (e) { /* no se conjuga en ese tiempo */ }
    });
    // Still short (a verb with few distinct forms): the skipped forms after all.
    SKIP.forEach(function (i) { if (pool.length < 3) add(forms[i]); });
    if (pool.length < 3) shuffle(Conj.ALL_TENSES).forEach(function (t) {
      if (pool.length >= 3) return;
      try { conjForms(verb, t).forEach(add); } catch (e) { /* */ }
    });

    var options = shuffle(sample(pool, 3).concat([answer]));
    // «src: coniugatore» and «topic: coniugazione» are the tokens the other
    // modules and the review look for.
    return {
      id: "conj:" + verb + ":" + tense + ":" + p,
      src: "coniugatore",
      type: "choice",
      topic: "coniugazione",
      prompt: "Conjugá «" + verb + "»" + esOf(verb) + " — " +
              tenseLabel(tense),
      stem: stemOf(verb, p, "", tense),
      options: options,
      answer: answer,
      accept: accept,
      note: formsNote(verb, tense, forms, alt)
    };
  }

  function conjugationTyped(verb, tense, persons) {
    var nf = nonFinite(verb, tense);
    if (nf) return nonFiniteItem(verb, tense, nf, true);
    var forms = conjForms(verb, tense);
    var alt = altFor(verb, tense);
    var p = pickPerson(personsFor(verb, forms, persons));
    return {
      id: "conjw:" + verb + ":" + tense + ":" + p,
      src: "coniugatore",
      type: "cloze",
      topic: "coniugazione",
      prompt: "Escribí la forma de «" + verb + "»" + esOf(verb) + " — " +
              tenseLabel(tense),
      stem: stemOf(verb, p, " (" + verb + ")", tense),
      answer: forms[p],
      accept: acceptedFor(verb, tense, p, forms[p], alt),
      note: formsNote(verb, tense, forms, alt)
    };
  }

  /* ------------------------------------------ reconocer antes de producir */

  /* The first time an exercise shows up, you recognise the answer among
     options; from the second time on, you write it (recognition before
     production: Nation 2013, and the project guide).  The options are the
     errors a Spanish speaker makes (accent, double consonant, contraction,
     Spanish spelling, ending, article: Lezione.traps) or answers of the same
     week that look alike.
     The id stays the same, so the SRS card is the one of the exercise. */
  var TYPED = { cloze: 1, translate: 1, conjugate: 1, plural: 1, numbers: 1, qa: 1, typed: 1 };

  function norm(x) {
    return String(x).toLowerCase().replace(/[’]/g, "'").replace(/[.,!?¿¡;:«»"]/g, "").replace(/\s+/g, " ").trim();
  }

  /* Distractors that test the rule, not the eye (LANG.rules.distract):
     wrong forms of the same word, the other articles of the same number,
     the other forms of an articulated preposition or a contraction.  A
     word that merely looks alike («cani / temi / baci» next to «fantasmi»)
     gives itself away by resemblance. */
  var ART_SG = DR.artSg || [], ART_PL = DR.artPl || [];
  var PREP_ART = DR.prepArt || {};
  var WORD_CLASSES = DR.classes || [];
  // The dictionary of the language's words (Diagnosi.util), or null.
  function wordTest() { return R.isWord ? R.isWord() : null; }
  function wordVariants(it) {
    var ans = String(it.answer || "").trim().replace(/’/g, "'"), low = ans.toLowerCase(), out = [];
    if (!ans || /\s/.test(ans) || ans.length < (DR.minLen || 1)) return out;
    var push = function (v) { if (v && v.toLowerCase() !== low && out.indexOf(v) < 0) out.push(v); };
    if (ART_SG.indexOf(low) >= 0) shuffle(ART_SG).forEach(push);
    else if (ART_PL.indexOf(low) >= 0) shuffle(ART_PL).forEach(push);
    Object.keys(PREP_ART).forEach(function (p) { if (PREP_ART[p].indexOf(low) >= 0) shuffle(PREP_ART[p]).forEach(push); });
    // A word of a closed class: the other members of the class (dove →
    // quando, come; onde → quando, como; mas → porém), never another verb.
    WORD_CLASSES.forEach(function (cl) { if (cl.indexOf(low) >= 0) shuffle(cl).forEach(push); });
    // A verb with a pronoun glued on (Fagli, Lasciala; chama-se, diga-me):
    // the same verb with the other pronouns (distract.glued).
    if (DR.glued && out.length < 3) {
      DR.glued(low, it).forEach(function (v) {
        push(ans[0] !== low[0] ? v.charAt(0).toUpperCase() + v.slice(1) : v);
      });
    }
    if (out.length >= 3) return out;
    // Only for nouns, adjectives and articles: a verb form with another
    // vowel («siame» for «siamo») is not a form anybody writes, and the
    // diagnosis would then talk about agreement.  Verb items keep the pool
    // of other persons (step 3).
    var nominal = it.type === "plural" || /plural|singular|concordan|adjetiv|femenin|masculin|sustantiv|artículo/i.test(it.prompt || "");
    var BR = DR.baseRe || [/([a-zà-ÿ']+)\s*→/i, /\(([a-zà-ÿ']+)\)/i];
    var m = BR[0].exec(it.stem || "") || BR[1].exec(it.stem || "");
    var base = m ? m[1] : null;
    if (it.type === "conjugate" || (!nominal && !base)) return out;
    // The word in the stem («fantasma → ___», «(limão)»): the shapes a
    // learner gives it (distract.shapes).  A Spanish gloss («(mamá)») is
    // not the word to transform (distract.glossRe, and the dictionary).
    var W = wordTest();
    if (base && DR.glossRe && DR.glossRe.test(base)) base = null;
    if (base && W && !W(base.toLowerCase())) base = null;
    if (DR.shapes) DR.shapes(ans, low, base, push, shuffle);
    return out;
  }

  function recognitionOf(it, pool, week) {
    if (!it || !TYPED[it.type] || /\|/.test(it.answer || "") || !it.answer) return null;
    var answer = String(it.answer);
    if (answer.length > 90) return null;
    var accepted = {};
    (it.accept || [answer]).forEach(function (a) { accepted[norm(a)] = 1; });
    var opts = [];
    function add(o) {
      if (o && !accepted[norm(o)] && opts.every(function (x) { return norm(x) !== norm(o); })) opts.push(o);
    }
    // 0. the alternatives the prompt itself names («o» (conjunción) o «ho»
    //    (verbo)): that contrast is the whole point of the exercise
    //    (only for a one- or two-word answer: a sentence is not «o» or «ho»)
    var W0 = wordTest();
    var inLang = W0 || function () { return true; };
    if (answer.trim().split(/\s+/).length <= 2)
      (String(it.prompt || "").match(/«([^»]{1,20})»/g) || []).forEach(function (q) {
        q = q.replace(/[«»]/g, "");
        // «vos», «usted»: Spanish named in the prompt is not an option
        if (q.split(/\s+/).every(function (w) { return inLang(w.toLowerCase().replace(/’/g, "'")); })) add(q);
      });
    // 0b. a verb in parentheses («Tu ___ (frequentare)», «(levantar-se)»):
    //     the other persons of that same verb in the same tense, never
    //     another verb (conj.infRe: what an infinitive looks like).
    var infM = CR.infRe ? CR.infRe.exec(it.stem || "") : null;
    if (infM && Conj && opts.length < 3) {
      var inf = infM[1].toLowerCase(), forms = null;
      if (!Conj.VERBS[inf] && Conj.register) { try { Conj.register(inf, {}); } catch (e) { /* */ } }
      (Conj.ALL_TENSES || Conj.SIMPLE_TENSES).forEach(function (t) {
        if (forms) return;
        try {
          var f = conjForms(inf, t).map(function (x) { return x || ""; });
          if (f.some(function (x) { return norm(x) === norm(answer) || norm(x.split(" ").slice(1).join(" ")) === norm(answer) || norm(x.split(" ").pop()) === norm(answer); }))
            forms = f.filter(function (x, i) { return !skipped(i); });      // never a skipped person (vós)
        } catch (e) { /* */ }
      });
      var multi = answer.trim().split(/\s+/).length;
      addForms(forms, multi);
    }
    // 0c. a conjugated form without the infinitive in sight (___ brutto
    //     tempo → fa; ___ muito calor → faz): the other persons of the verb
    //     the answer belongs to.
    if (!infM && it.type === "conjugate" && Conj && root.Diagnosi && root.Diagnosi.verbForms && opts.length < 3) {
      var vf = root.Diagnosi.verbForms(norm(answer).split(" ").pop())[0];
      if (vf) { try { addForms(Conj.conjugate(vf.lemma, vf.tense).filter(function (x, i) { return !skipped(i); }), answer.trim().split(/\s+/).length); } catch (e) { /* */ } }
    }
    function addForms(forms, multi) {
      if (forms) shuffle(forms.filter(Boolean)).forEach(function (x) {
        var xs = x.split(" ");
        if (opts.length < 3) add(xs.length > multi ? xs.slice(xs.length - multi).join(" ") : x);
      });
    }
    // 1. conjugation: the same verb in other persons
    if (it.src === "coniugatore" && Conj) {
      var m = /^conjw?:([^:]+):([^:]+):(\d)$/.exec(it.id);
      if (m) {
        var nfm = nonFinite(m[1], m[2]);
        if (nfm) shuffle(nfm.wrong).forEach(add);
        else try { shuffle(conjForms(m[1], m[2]).filter(function (x, i) { return !skipped(i) && x; })).forEach(add); } catch (e) { /* no */ }
      }
    }
    // 2. the typical errors on the answer itself
    if (opts.length < 3 && Lez) {
      var tr = Lez.traps(answer, Math.random, week || 52, W0);
      tr.slice(0, 3).forEach(add);
      // Only one mistake possible: the next option carries two.
      if (opts.length < 2 && tr.length) Lez.traps(tr[0], Math.random, week || 52, W0).slice(0, 2).forEach(add);
    }
    // 2b. the same word in another shape (never another word that merely
    //     looks like a plural next to the only plural of the right word)
    if (opts.length < 3 && it.src !== "coniugatore") {
      wordVariants(it).forEach(function (v) { if (opts.length < 3) add(v); });
    }
    // 3. answers of the same kind from the same week: same shape (a letter
    //    group against letter groups, never «ho» against «sc»), same topic
    //    when there is one, and the sentences that share most words first
    //    («O Rafa está com calor» against «A Bia está com sede», not «A cidade é linda»).
    // What came before is the answer itself with a mistake (a trap, another
    // person of the verb, another ending): the feedback can say what is
    // wrong in it.  What comes next is another answer of the week, where
    // there is no rule to name (app.js, answer).
    var ownOpts = opts.length;
    if (opts.length < 2 && pool) {
      var len = answer.length, short = len <= 4 && answer.indexOf(" ") < 0;
      var words = function (x) { return norm(x).split(" "); };
      var aw = words(answer);
      var shared = function (x) { return words(x).filter(function (w) { return aw.indexOf(w) >= 0; }).length; };
      var nWords = answer.trim().split(/\s+/).length;
      var cands = pool.filter(function (x) {
        if (!x || x.id === it.id || x.type !== it.type || !x.answer || /\|/.test(x.answer)) return false;
        var xa = String(x.answer);
        if (it.topic && x.topic && x.topic !== it.topic) return false;
        if (short) return xa.indexOf(" ") < 0 && Math.abs(xa.length - len) <= 2;
        // One word in a gap tests a rule: only a near miss of the same word.
        if (nWords === 1 && /_{3,}/.test(it.stem || "") && xa.indexOf(" ") < 0 &&
            Engine && Engine.editDistance && Engine.editDistance(norm(xa), norm(answer)) > Math.max(2, answer.length / 2)) return false;
        // «a gente» against «as gentes» or «a casa», never against «apenas»
        if (nWords <= 3 && xa.trim().split(/\s+/).length !== nWords) return false;
        // Another sentence only if it shares half the words: otherwise its
        // meaning gives the right one away.
        if (nWords >= 2 && shared(xa) < Math.ceil(nWords / 2)) return false;
        return Math.abs(xa.length - len) <= Math.max(4, len / 2);
      });
      shuffle(cands).sort(function (a, b) { return shared(b.answer) - shared(a.answer); })
        .slice(0, 6).forEach(function (x) { add(String(x.answer)); });
    }
    if (opts.length < 2) return null;
    var copy = {};
    Object.keys(it).forEach(function (k) { copy[k] = it[k]; });
    copy.type = "choice";
    copy.recog = true;
    copy.orig = it.type;
    copy.options = shuffle(opts.slice(0, 3).concat([answer]));
    copy.otherAnswers = opts.slice(ownOpts, 3);
    copy.prompt = it.type === "translate" ? (TX.translateQ || it.prompt) : it.prompt;
    // Buttons, not a box: the prompt says choose («Escribí…» → «Elegí…»).
    if (root.Devolucion) copy.prompt = root.Devolucion.choicePrompt(copy.prompt);
    // Said once, and only after a right answer: after a miss it reads as a threat.
    copy.recogNote = "La próxima vez esta la vas a escribir.";
    return copy;
  }

  // First sighting (no SRS card yet, not recognised before): recognition;
  // otherwise as it is.
  function firstRecognize(list, state, week, pool) {
    var cards = (state && state.cards) || {}, recog = (state && state.recog) || {};
    return list.map(function (it) {
      // phrases have their own ladder (tiles → memory): left alone
      if (!it || cards[it.id] || recog[it.id] || it.src === "frasi" || it.src === "lab" || it.src === "lettura") return it;
      return recognitionOf(it, pool || list, week) || it;
    });
  }

  /* -------------------------------------------------------- armar rondas */

  function itemsById(course) {
    var map = {};
    course.items.forEach(function (it) { map[it.id] = it; });
    // The week whose lesson lists the item (it.wk is the first week whose
    // grammar covers it, which can be much earlier): the statistics of the
    // week (weekStats) are kept by this one, so the boss and the review
    // look them up by it.
    (course.weeks || []).forEach(function (w) {
      (w.items || []).forEach(function (id) { var it = map[id]; if (it && it.week == null) it.week = w.week; });
    });
    indexVocab(course);
    // the rule cards (reglas.js) look exercises up in this same map
    if (root.Reglas && root.Reglas.use) root.Reglas.use(course, map);
    return map;
  }

  /* ---------------------------------------------------- palabras de la semana */

  /* Each week lists its new words (build_course.py: week.vocab, [word,
     spanish, example, tip]).  First you recognise the meaning among options, then
     you produce the word from the Spanish; the SRS card «v:<word>» brings it
     back in the review like any other exercise. */
  var VOC = null;           // word → { v, week }

  function indexVocab(course) {
    VOC = {};
    (course.weeks || []).forEach(function (w) {
      (w.vocab || []).forEach(function (v) { VOC[v[0]] = { v: v, week: w.week }; });
    });
  }

  // What kind of word: verb, noun, adjective, adverb, expression.
  function wordKind(it, es) {
    var D = root.Diagnosi && root.Diagnosi.DATA;
    var first = String(es || "").split(/[,;/(]/)[0].trim().toLowerCase();
    if (CR.verbRe && CR.verbRe.test(it) && /(ar|er|ir|ír)(se|lo|la|le)?$/.test(first)) return "v";
    if (/^[¡¿]/.test(es || "")) return "x";
    if (/mente$/.test(it)) return "adv";
    if (D && D.nouns && (D.nouns[it] || (D.nounsByPlural && D.nounsByPlural[it]))) return "n";
    if ((D && D.adj && D.adj[it]) || ((R.vocab || {}).adj || []).some(function (re) { return re.test(it); })) return "a";
    return "o";
  }
  // Closed fields by the Spanish meaning: numbers, days, colours, family…
  var FIELDS = [
    ["num", /^(uno|dos|tres|cuatro|cinco|seis|siete|ocho|nueve|diez|once|doce|trece|catorce|quince|veinte|treinta|cuarenta|cincuenta|cien|mil|millón|docena|centenar)\b/],
    ["ord", /^(primer[oa]?|segund[oa]|tercer[oa]?|cuart[oa]|quint[oa]|sext[oa]|séptim[oa]|octav[oa]|noven[oa]|décim[oa]|undécim[oa]|vigésim[oa]|centésim[oa]|último)\b/],
    ["dia", /^(lunes|martes|miércoles|jueves|viernes|sábado|domingo)\b/],
    ["mes", /^(enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|octubre|noviembre|diciembre)\b/],
    ["hora", /^(mañana|tarde|noche|mediodía|medianoche|madrugada|hoy|ayer|anteayer|pasado mañana|esta noche)\b/],
    ["dir", /^(norte|sur|este|oeste|derecha|izquierda|derecho|arriba|abajo|adelante|atrás)\b/],
    ["color", /^(rojo|azul|verde|amarillo|blanco|negro|gris|marrón|rosa|violeta|celeste|naranja)\b/],
    ["fam", /^(madre|padre|hermano|hermana|hijo|hija|tío|tía|abuel[oa]|prim[oa]|espos[oa]|marido|mujer|novi[oa]|sobrin[oa]|niet[oa]|suegr[oa]|cuñad[oa]|mamá|papá|padres|parientes)\b/]];
  function fieldOf(es) {
    var e = String(es || "").toLowerCase().trim();
    for (var i = 0; i < FIELDS.length; i++) if (FIELDS[i][1].test(e)) return FIELDS[i][0];
    return null;
  }

  // The topic of a noun in the bank (casa, famiglia, comida…).
  var TOPIC = null;
  function wordTopic(it) {
    if (!TOPIC) {
      TOPIC = {};
      var b = root.Banca && root.Banca.loaded() ? root.Banca.bank() : null;
      ((b && b.nouns) || []).forEach(function (n) { if (n[4]) { TOPIC[n[0]] = n[4]; TOPIC[n[2]] = n[4]; } });
    }
    var art = (R.vocab || {}).article;
    return TOPIC[art ? String(it).replace(art, "") : String(it)] || null;
  }
  function topicGlosses(topic, v) {
    var b = root.Banca && root.Banca.loaded() ? root.Banca.bank() : null;
    return ((b && b.nouns) || []).filter(function (n) { return n[4] === topic && n[0] !== v[0] && n[3] !== v[1]; })
      .map(function (n) { return n[3]; });
  }

  /* What the answer shows: how the word is used (tools: the tip of each
     word of the week), then the example. */
  function wordNote(v) {
    return [v[3] || "", v[2] ? "Ejemplo: *" + v[2] + "*" : ""].filter(Boolean).join(" ");
  }

  function vocabItem(word, state, write) {
    var e = VOC && VOC[word];
    if (!e) return null;
    var v = e.v, id = "v:" + v[0], card = state && state.cards && state.cards[id];
    if (!card && !write) {
      // distractors: meanings of nearby weeks, never the same Spanish word
      // Same field first (hermano among hija, tío, abuelo), then the same
      // kind of word: a verb among nouns, or «ventana» next to «hermano»,
      // gives itself away.
      var kind = wordKind(v[0], v[1]), topic = wordTopic(v[0]), fld = fieldOf(v[1]);
      // the whole list when the week has too few of the same kind
      var all = Object.keys(VOC).map(function (k) { return VOC[k]; }).filter(function (x) { return x.v[0] !== v[0] && x.v[1] !== v[1]; });
      var ranked = shuffle(all).map(function (x) {
        return { x: x, s: (fld && fieldOf(x.v[1]) === fld ? 8 : 0) + (topic && wordTopic(x.v[0]) === topic ? 4 : 0) +
                          (wordKind(x.v[0], x.v[1]) === kind ? 3 : 0) + (Math.abs(x.week - e.week) <= 3 ? 1 : 0) +
                          (Math.abs(x.v[1].length - v[1].length) <= 6 ? 1 : 0) };
      }).sort(function (a, b) { return b.s - a.s; });
      var opts = [v[1]];
      var field = topic ? topicGlosses(topic, v) : [];
      ranked.filter(function (r) { return r.s >= 4; }).forEach(function (r) { if (opts.length < 4 && opts.indexOf(r.x.v[1]) < 0) opts.push(r.x.v[1]); });
      shuffle(field).forEach(function (g) { if (opts.length < 4 && opts.indexOf(g) < 0) opts.push(g); });
      ranked.forEach(function (r) { if (opts.length < 4 && opts.indexOf(r.x.v[1]) < 0) opts.push(r.x.v[1]); });
      return { id: id, src: "vocab", type: "choice", topic: "vocabolario",
               prompt: "¿Qué significa?", stem: v[0], options: shuffle(opts), answer: v[1],
               accept: [v[1]], note: wordNote(v), say: v[0] };
    }
    return { id: id, src: "vocab", type: "cloze", topic: "vocabolario",
             prompt: TX.howSay || "¿Cómo se dice?", stem: "«" + v[1] + "» → ___", answer: v[0],
             accept: [v[0]], note: wordNote(v), say: v[0] };
  }

  /* A word is met before it is asked (as the phrases are): a card with the
     word, its meaning, audio and the example, two or three items before the
     first question about it. */
  function wordIntro(v) {
    return { id: "vi:" + v[0], src: "vocab", type: "word", prompt: "Palabra nueva",
             stem: v[0], answer: v[0], word: v, say: v[0] };
  }
  function withWordIntros(list, state) {
    var cards = (state && state.cards) || {}, out = list.slice(), done = {};
    for (var i = 0; i < out.length; i++) {
      var it = out[i];
      if (!it || it.src !== "vocab" || it.type !== "choice" || cards[it.id] || done[it.id]) continue;
      var v = VOC && VOC[it.stem];
      if (!v) continue;
      done[it.id] = 1;
      var at = Math.max(0, i - 2);
      out.splice(at, 0, wordIntro(v.v));
      i++;
    }
    return out;
  }

  /* The week's words: each new one is recognised (the meaning among four)
     and, later in the same round, written; then the ones seen and never
     written, then the rest of the week, then a few of earlier weeks that
     are due.  Before 3.0.2 a first round was all recognition and the
     mission («written at least once») stayed at 0 after playing it.
     With a small size (two words inside a round, shuffled) there is no
     pair: the new ones are only recognised, as before. */
  var VOCAB_NEW = 7;
  function vocabSession(course, week, state, size) {
    if (!VOC) indexVocab(course);
    size = size || 14;
    var cards = (state && state.cards) || {}, now = Date.now();
    var own = (week.vocab || []).map(function (v) { return v[0]; }).filter(function (w) { return VOC[w]; });
    var pair = size >= 6;
    var fresh = own.filter(function (w) { return !cards["v:" + w]; }).slice(0, pair ? Math.min(VOCAB_NEW, Math.floor(size / 2)) : size);
    var unwritten = shuffle(own.filter(function (w) { return cards["v:" + w] && !cards["v:" + w].prod; }));
    var written = shuffle(own.filter(function (w) { return cards["v:" + w] && cards["v:" + w].prod; }));
    var due = shuffle(Object.keys(VOC).filter(function (w) {
      var c = cards["v:" + w];
      return VOC[w].week < week.week && c && c.due <= now;
    })).slice(0, 4);
    var recog = fresh.map(function (w) { return vocabItem(w, state); });
    // the new words written after all the recognitions, in another order
    var writeNew = pair ? shuffle(fresh).map(function (w) { return vocabItem(w, state, true); }) : [];
    var room = Math.max(0, size - recog.length - writeNew.length);
    var rest = unwritten.concat(written, due).slice(0, Math.max(room, fresh.length ? 0 : size))
      .map(function (w) { return vocabItem(w, state); });
    return recog.concat(writeNew, rest).filter(Boolean).slice(0, size);
  }

  /* Una ronda mezcla tres fuentes para que ninguna sesión sea igual: los
     ítems de autor de la semana, el banco y el gimnasio de conjugación. */
  function buildRound(course, week, opts) {
    opts = opts || {};
    var size = opts.size || 12;
    var map = opts.map || itemsById(course);
    var out = [];

    // The week's own items (book, authored and graded sfide), all of them
    // already within reach: build_course.py moves what needs later theory.
    // Listening needs sound: in silent mode (the office) it waits.
    var audible = function (it) { return it && !(opts.silent && it.type === "listen"); };
    var bookItems = (week.items || [])
      .map(function (id) { return map[id]; })
      .filter(audible)
      // a lesson in parts: only the exercises of the parts already read
      .filter(function (it) { return !opts.only || opts.only[it.id]; });
    // Review moved here from earlier weeks (a nouns exercise in a past
    // tense lands in the week of that tense): a few per round, interleaved.
    var extra = (week.extra || [])
      .map(function (id) { return map[id]; })
      .filter(audible);

    // The gym weighs more when the week brings a new tense (gymShare, from
    // build_course.py); in review weeks it would only repeat «voi siete».
    // focus: the training of one part of the lesson asks that part and
    // nothing else (no verb gym, no review, no words of the week).
    var focus = !!opts.focus;
    var mix = roundMix(week, opts.state);
    var wantConj = focus ? 0 : Math.min(
      week.verbs && week.verbs.length ? Math.ceil(size * Math.max(0.15, Math.min(0.6, (week.gymShare || 0.35) + mix.gym))) : 0,
      size
    );
    // push: the week is not passed yet («Superá la semana», 20 right with
    // its own exercises): the round is mostly them, so a round moves the
    // mission by about ten and not by six or seven (3.1).
    var push = !!opts.push && !focus;
    if (push) wantConj = Math.min(wantConj, 2);
    var wantBook = size - wantConj;
    var wantExtra = focus ? 0 : Math.min(extra.length, Math.round(wantBook / 4 * mix.extra));
    if (push) wantExtra = Math.min(wantExtra, 1);

    pickFresh(bookItems, wantBook - wantExtra, opts.state).forEach(function (it) { out.push(it); });
    // What the last four weeks left unseen comes along, a couple per round,
    // so that three quarters of the course do not stay in the drawer.
    var cards = (opts.state && opts.state.cards) || {};
    var carry = [];
    (course.weeks || []).forEach(function (pw) {
      if (pw.week >= week.week || pw.week < week.week - 4 || pw.boss) return;
      (pw.items || []).forEach(function (id) { if (map[id] && !cards[id] && !recogOf(opts.state)[id]) carry.push(map[id]); });
    });
    pickFresh(extra.concat(shuffle(carry).filter(audible)), wantExtra, opts.state).forEach(function (it) { out.push(it); });

    for (var i = 0; i < wantConj; i++) {
      var verb = week.verbs[Math.floor(Math.random() * week.verbs.length)];
      var tense = week.tenses[Math.floor(Math.random() * week.tenses.length)];
      try {
        // a weak spot in the verbs (the error profile): more of them written
        out.push(i % 2 === 0 && !mix.verbsWeak ? conjugationDrill(verb, tense, week.known, week.persons)
                             : conjugationTyped(verb, tense, week.persons));
      } catch (e) { /* un verbo que no se conjuga en ese tiempo: se salta */ }
    }

    // Short: top up with other items of the week, then from the big bank,
    // never with a repeat.
    if (out.length < size) {
      var inRound = {}; out.forEach(function (it) { inRound[it.id] = 1; });
      pickFresh(bookItems.concat(focus ? [] : extra).filter(function (it) { return !inRound[it.id]; }), size - out.length, opts.state)
        .forEach(function (it) { out.push(it); });
    }
    if (out.length < size && !focus) bankFill(opts.state, size - out.length).forEach(function (it) { out.push(it); });
    // two words of the week, interleaved with the grammar
    if (week.vocab && week.vocab.length && !focus && !push) {
      var vs = vocabSession(course, week, opts.state || {}, 2);
      out = out.slice(0, size - vs.length).concat(vs);
    }
    return withWordIntros(firstRecognize(shuffle(out).slice(0, size), opts.state, week.week, bookItems), opts.state);
  }

  function recogOf(state) { return (state && state.recog) || {}; }

  /* The mix of a round follows how the week is going (E8): the accuracy of
     the last answers of the week (weekStats.last) and the error profile.
     Doing well: more review of the weeks before (interleaving) and more
     verbs; struggling: the week's own exercises first.  A weak spot in the
     verbs (the diagnosis' category) brings more verbs, written. */
  var VERB_CATS = /coniug|ausil|aux|verb|tempo|tempi|persona|modo|congiunt|subjunt|particip|gerund|imperat|condiz|futur|passat|pret|imperf/i;
  function roundMix(week, state) {
    var out = { extra: 1, gym: 0, verbsWeak: false, acc: null };
    var ws = state && state.weekStats && week && state.weekStats[week.week];
    var l = (ws && ws.last) || [];
    if (l.length >= 10) {
      var acc = l.reduce(function (a, x) { return a + x; }, 0) / l.length;
      out.acc = acc;
      if (acc >= 0.9) { out.extra = 1.5; out.gym = 0.05; }
      else if (acc < 0.7) { out.extra = 0.5; out.gym = -0.1; }
    }
    if (Banca && Banca.weakest && state && state.errs) {
      var wk = Banca.weakest(state, 1)[0];
      if (wk && VERB_CATS.test(wk.cat)) { out.verbsWeak = true; out.gym += 0.1; }
    }
    return out;
  }

  /* How badly the learner knows an item: a card that went back to zero or
     lost ease is weak; one never seen is unknown; a retired one is known. */
  function weakness(state, id) {
    var c = state && state.cards && state.cards[id];
    if (!c) return 1;
    if (Engine && Engine.retired && Engine.retired(c)) return 0;
    if (c.reps === 0 && c.seen) return 3;
    if ((c.d != null ? c.d >= 7 : (c.ease || 2.5) < 2.3)) return 2;
    return 0.5;
  }

  /* The season a boss closes (or the one a week belongs to). */
  function seasonWeeks(course, week) {
    var s = (course.seasons || []).filter(function (x) { return week.week >= x.weeks[0] && week.week <= x.weeks[1]; })[0];
    return s ? s.weeks : [1, week.week];
  }

  /* Before the boss: the season's items the learner failed (first) or has
     not met yet, from the weeks where the accuracy was lowest. */
  function weakItems(course, week, state, map) {
    map = map || itemsById(course);
    var sw = seasonWeeks(course, week), out = [], seen = {};
    course.weeks.forEach(function (w) {
      if (w.week < sw[0] || w.week > week.week) return;
      (w.items || []).forEach(function (id) {
        var it = map[id];
        if (!it || seen[id] || it.type === "listen") return;
        seen[id] = 1;
        var k = weakness(state, id);
        if (k >= 2) out.push({ it: it, k: k });
      });
    });
    return out.sort(function (a, b) { return b.k - a.k; }).map(function (x) { return x.it; });
  }

  function buildWeak(course, week, state, opts) {
    opts = opts || {};
    var map = opts.map || itemsById(course), size = opts.size || 15;
    var out = shuffle(weakItems(course, week, state, map).slice(0, size * 2)).slice(0, size);
    if (out.length < size) {
      var sw = seasonWeeks(course, week), have = {};
      out.forEach(function (it) { have[it.id] = 1; });
      var rest = [];
      course.weeks.forEach(function (w) {
        if (w.week < sw[0] || w.week > week.week) return;
        (w.items || []).forEach(function (id) {
          // this week: only the parts of the lesson already read (opts.only)
          if (w.week === week.week && opts.only && !opts.only[id]) return;
          if (map[id] && !have[id] && map[id].type !== "listen") { have[id] = 1; rest.push(map[id]); }
        });
      });
      pickFresh(rest, size - out.length, state).forEach(function (it) { out.push(it); });
    }
    return firstRecognize(out, state, week.week);
  }

  /* El jefe pesca de todas las semanas ya abiertas, no solo de la última.
     Es un examen por destreza, como las certificaciones: una lectura con
     sus preguntas (del tramo desde la 27; de «La settimana» antes), una
     escucha con preguntas (la escucha larga del tramo, o un texto de la
     estación leído en voz alta), producción escrita (12-15 ítems) y
     estructuras (opción múltiple), cada una con su 55 % (it.skill).  Si se
     repite el mismo día, otras preguntas y otros textos. */
  var BOSS_WRITTEN = { cloze: 1, translate: 1, conjugate: 1, plural: 1, numbers: 1, qa: 1, typed: 1, write: 1, fixerr: 1, garden: 1 };
  function bossUsed(state, wk) {
    if (!state || !Engine) return { ids: {}, eps: [] };
    var today = Engine.dayKey(), b = state.bossUsed || (state.bossUsed = {});
    if (!b[wk] || b[wk].day !== today) b[wk] = { day: today, ids: {}, eps: [] };
    return b[wk];
  }
  function buildBoss(course, week, state, opts) {
    opts = opts || {};
    var size = opts.size || (week.week === 52 ? 40 : 25);
    var map = opts.map || itemsById(course);
    var used = bossUsed(state, week.week);
    // Half from the season it closes, a quarter from the one before, the
    // rest from anywhere earlier: the C1 exam examines C1, not «io sono».
    var season = (course.seasons || []).filter(function (s) { return week.week >= s.weeks[0] && week.week <= s.weeks[1]; })[0];
    var lo = season ? season.weeks[0] : 1;
    var prevLo = Math.max(1, lo - 13);
    var pools = { own: [], prev: [], old: [] }, all = 0;
    course.weeks.forEach(function (w) {
      if (w.week > week.week) return;
      (w.items || []).concat(w.extra || []).forEach(function (id) {
        var it = map[id];
        // listening has its own section, with a text
        if (!it || it.type === "listen") return;
        var wk = it.week || w.week;
        all++;
        (wk >= lo ? pools.own : wk >= prevLo ? pools.prev : pools.old).push(it);
      });
    });
    // Again the same day: what was asked stays out, if there is enough else.
    var nUsed = Object.keys(used.ids).length;
    if (nUsed && all - nUsed >= size * 2) {
      Object.keys(pools).forEach(function (k) { pools[k] = pools[k].filter(function (it) { return !used.ids[it.id]; }); });
    }
    // Inside a season, one week at a time in turn: the boss of week 13 asks
    // about every week of the season, not thirteen times about «to be».
    // A week the learner got wrong more often gets more turns (up to three
    // per round), and inside each week what was failed comes first.
    var accOf = function (wk) {
      var ws = (state && state.weekStats && state.weekStats[wk]) || {};
      return ws.attempts >= 10 ? ws.right / ws.attempts : 0.85;
    };
    var byWeek = function (pool, n) {
      var groups = {};
      pool.forEach(function (it) { var k = it.week || it.wk || 0; (groups[k] = groups[k] || []).push(it); });
      var keys = shuffle(Object.keys(groups)), picked = [], turns = [];
      keys.forEach(function (key) {
        groups[key] = shuffle(groups[key]).sort(function (a, b) { return weakness(state, a.id) - weakness(state, b.id); });
        var miss = 1 - accOf(+key);
        var t = miss > 0.3 ? 3 : miss > 0.2 ? 2 : 1;
        for (var x = 0; x < t; x++) turns.push(key);
      });
      var k = 0;
      while (picked.length < n && turns.length) {
        var key = turns[k % turns.length];
        if (groups[key].length) { picked.push(groups[key].pop()); k++; }
        else turns = turns.filter(function (t) { return t !== key; });
      }
      return picked;
    };
    var nBook = Math.ceil(size * 0.8);
    // Written and multiple choice apart, each in the proportions of the seasons.
    var isW = function (it) { return !!BOSS_WRITTEN[it.type] && !it.options; };
    var split = function (pool) { return { w: pool.filter(isW), c: pool.filter(function (it) { return !isW(it); }) }; };
    var P = { own: split(pools.own), prev: split(pools.prev), old: split(pools.old) };
    var nProd = week.week === 52 ? 15 : 12, nStr = Math.max(4, nBook - nProd);
    var pick = function (kind, n) {
      var got = byWeek(P.own[kind], Math.round(n * 0.5)).concat(byWeek(P.prev[kind], Math.round(n * 0.25)), byWeek(P.old[kind], n));
      var seen = {};
      got = got.filter(function (it) { if (seen[it.id]) return false; seen[it.id] = 1; return true; });
      // the first boss has no earlier season: its own season again
      shuffle(P.own[kind].concat(P.prev[kind], P.old[kind])).forEach(function (it) {
        if (got.length < n && !seen[it.id]) { seen[it.id] = 1; got.push(it); }
      });
      return got.slice(0, n);
    };
    var prod = pick("w", nProd), str = pick("c", nStr);
    // Short of written items: the verbs of the week, written.
    var verbs = week.verbs || [], tenses = week.tenses || ["presente"];
    for (var g = 0; prod.length < nProd && verbs.length && g < nProd * 2; g++) {
      var v = verbs[Math.floor(Math.random() * verbs.length)];
      var t = tenses[Math.floor(Math.random() * tenses.length)];
      try { prod.push(conjugationTyped(v, t)); } catch (e) { break; }
    }
    // Short of multiple choice: more written.
    if (str.length < nStr) {
      var have = {};
      prod.forEach(function (it) { have[it.id] = 1; });
      var missing = nStr - str.length;
      pick("w", nProd + missing).forEach(function (it) { if (missing > 0 && !have[it.id]) { have[it.id] = 1; prod.push(it); missing--; } });
    }
    var tag = function (list, skill) {
      return list.map(function (it) { var c = {}; Object.keys(it).forEach(function (k) { c[k] = it[k]; }); c.skill = skill; return c; });
    };
    var out = shuffle(tag(prod, "produzione").concat(tag(str, "strutture")));
    out.forEach(function (it) { if (map[it.id]) used.ids[it.id] = 1; });
    // The reading and the listening, each one as a block of questions.
    var texts = bossTexts(week, lo, used, opts.silent);
    var blocks = out.map(function (x) { return [x]; });
    if (texts.read.length) blocks.splice(Math.floor(blocks.length / 3), 0, texts.read);
    if (texts.listen.length) blocks.splice(Math.floor(blocks.length * 2 / 3), 0, texts.listen);
    // One in five more: sentences of the bank never seen, on grammar already
    // taught, to see whether the rule generalises (reported apart).
    novelItems(state, Math.round(size * 0.2), out).forEach(function (it, k) {
      blocks.splice(Math.floor((k + 1) * blocks.length / 6), 0, [it]);
    });
    return [].concat.apply([], blocks);
  }

  /* The texts of the boss: a reading of the season with its questions, and
     a listening (the long listening of the tramo from week 27; before, a
     text of the season read aloud, sentence by sentence).  Never the same
     text twice the same day. */
  function bossTexts(week, lo, used, silent) {
    var L = root.Letture, out = { read: [], listen: [] };
    if (!L || !L.ofSeries) return out;
    var inSeason = function (ep) { return ep.week >= lo && ep.week <= week.week && (ep.questions || []).length; };
    var fresh = function (list) {
      var f = list.filter(function (ep) { return used.eps.indexOf(ep.id) < 0; });
      return shuffle(f.length ? f : list);
    };
    var longs = week.week >= 27 ? L.ofSeries("lunga").filter(inSeason) : [];
    var rd = fresh(longs.length ? longs : L.ofSeries("settimana").filter(inSeason))[0];
    if (rd) {
      used.eps.push(rd.id);
      out.read = L.session(rd).filter(function (x) { return x.type === "choice"; }).slice(0, 6).map(function (x) {
        x.skill = "lettura"; x.nocard = true; x.bossText = rd.title;
        return x;
      });
    }
    if (silent) return out;
    var TR = root.TRAMO_DATA, asc = null;
    if (week.week >= 27 && TR && TR.SETTIMANE) {
      var cands = fresh(TR.SETTIMANE.filter(function (s) {
        return s.week >= lo && s.week <= week.week && s.ascolto && (s.ascolto.questions || []).length;
      }).map(function (s) { return { id: "asc-" + s.week, s: s }; }));
      if (cands[0]) {
        var a = cands[0].s.ascolto;
        asc = { id: cands[0].id, title: a.title, questions: a.questions, vf: a.vf,
                parts: a.turns.map(function (t) { return [t[0], t[1]]; }) };
      }
    }
    if (!asc) {
      var other = fresh(L.ofSeries("settimana").filter(function (ep) { return inSeason(ep) && ep !== rd; }))[0];
      if (other) {
        asc = { id: other.id, title: other.title, questions: other.questions, vf: other.vf,
                parts: String(other.text || "").replace(/([.!?…]["»”)]*)\s+/g, "$1\n").split(/\n+/)
                  .filter(function (x) { return x.trim(); }).map(function (x) { return ["A", x.trim()]; }) };
      }
    }
    if (asc && asc.parts.length) {
      used.eps.push(asc.id);
      var text = asc.parts.map(function (p) { return p[1]; }).join(" ");
      out.listen = L.session({ id: "asc:" + asc.id, questions: asc.questions || [], vf: asc.vf || [], hunt: { label: "", targets: [] }, grammar: "" })
        .filter(function (x) { return x.type === "choice"; }).slice(0, 6).map(function (x, k) {
          var vf = /:vf\d+$/.test(x.id);
          return { id: "boss:" + x.id, src: "lettura", type: "listen", skill: "ascolto", nocard: true, nopeek: true,
                   prompt: vf ? x.prompt + " «" + x.stem + "»" : x.stem, stem: text, parts: asc.parts,
                   options: x.options, answer: x.answer, accept: x.accept, note: x.note || "",
                   noauto: k > 0, bossText: asc.title };
        });
    }
    return out;
  }
  function novelItems(state, n, have) {
    if (!Banca || !Banca.loaded() || !n || !state) return [];
    var cards = state.cards || {}, seen = {};
    (have || []).forEach(function (it) { seen[sameKey(it)] = 1; });
    var pool = Banca.gapSession(state, 60).concat(Banca.translateSession(state, 60))
      .filter(function (it) { return it && !cards[it.id] && !seen[sameKey(it)]; });
    return shuffle(pool).slice(0, n).map(function (it) { return Object.assign({}, it, { novel: true }); });
  }

  /* Las frases de conversación viven fuera del curso: cada repaso vuelve a
     generar su ejercicio, así la misma frase vuelve con otra forma. */
  function reviewItem(map, id, opts) {
    if (map[id]) return map[id];
    if (id.indexOf("v:") === 0) return vocabItem(id.slice(2), opts && opts.state);
    if (Frasi && Frasi.BY_ID[id]) return Frasi.pickItem(Frasi.BY_ID[id], opts);
    if (Lab && Lab.BY_ID[id]) return Lab.item(id);
    if (Banca && id.indexOf("b:") === 0) return Banca.item(id);
    if (Duelli && id.indexOf("duel:") === 0) return Duelli.reviewItem(id);
    if (root.EscrituraPlus && id.indexOf("ep:") === 0) return root.EscrituraPlus.reviewItem(id, opts && opts.state);   // reformulación
    if (root.Biblioteca && id.indexOf("lib:") === 0) return root.Biblioteca.reviewItem(id, opts && opts.state);   // 📌 de la Biblioteca
    if (root.TresLenguas && id.indexOf("tres:") === 0) return root.TresLenguas.reviewItem(id);   // lo fallado en Tres lenguas
    if (root.Trabajo && id.indexOf("trab:") === 0) return root.Trabajo.reviewItem(id);   // los ejercicios de las escenas de trabajo
    // a rule: a new sentence with it; an item another module left (Engine.enqueue)
    if (root.Reglas && id.indexOf("r:") === 0) return root.Reglas.reviewItem(id, opts && opts.state);
    if (root.Reglas && id.indexOf("own:") === 0) return root.Reglas.ownItem(opts && opts.state, id);
    return null;
  }

  function knownId(map, id, state) {
    return !!(map[id] || (id.indexOf("v:") === 0 && VOC && VOC[id.slice(2)]) || (Frasi && Frasi.BY_ID[id]) || (Lab && Lab.BY_ID[id]) ||
              (root.Reglas && id.indexOf("r:") === 0 && root.Reglas.known(id)) ||
              (id.indexOf("own:") === 0 && state && state.own && state.own[id]) ||
              (Banca && Banca.loaded() && id.indexOf("b:") === 0 && Banca.item(id)) ||
              (root.EscrituraPlus && id.indexOf("ep:") === 0) ||
              (root.Biblioteca && id.indexOf("lib:") === 0) ||
              (root.TresLenguas && id.indexOf("tres:") === 0 && !!root.TresLenguas.reviewItem(id)) ||
              (root.Trabajo && id.indexOf("trab:") === 0 && !!root.Trabajo.reviewItem(id)) ||
              (Duelli && id.indexOf("duel:") === 0 && !!Duelli.reviewItem(id)));
  }

  /* La cola de repaso: primero los errores (reps 0), después la semana en
     curso, después el resto por vencimiento. */
  /* Order: what was learnt last night (sleep in between: Mazza 2016),
     then the errors, then the
     current week, then the rest by due date; the cards in maintenance
     (months apart) last, at most MAINT_A_DAY a day, so the queue never
     becomes a debt. */
  var MAINT_A_DAY = 6;
  function dueList(map, state) {
    var now = Date.now(), week = (state && state.unlocked) || 1, due = [], today = Engine ? Engine.dayKey() : "";
    var maint = 0;
    Object.keys(state.cards).forEach(function (id) {
      var card = state.cards[id];
      if (!card || !card.due || card.due > now || !knownId(map, id, state)) return;
      var isMaint = card.state === "maint" || (card.s == null && Engine && Engine.retired && Engine.retired(card));
      var rw = id.indexOf("r:") === 0 ? +id.split(":")[1] : map[id] ? (map[id].week || map[id].wk) : 0;
      var pri = card.night && card.night === today ? -1
              : card.reps === 0 ? 0 : rw === week ? 1 : isMaint ? 3 : 2;
      due.push({ id: id, due: card.due, pri: pri, maint: isMaint });
    });
    due.sort(function (a, b) { return a.pri - b.pri || a.due - b.due; });
    var rules = 0;
    return due.filter(function (d) {
      // the rules (a new sentence each) are a few a day too: they wait, they never pile up
      if (d.id.indexOf("r:") === 0 && d.pri > 0 && ++rules > RULES_A_DAY) return false;
      if (!d.maint) return true;
      return ++maint <= MAINT_A_DAY;
    });
  }
  var RULES_A_DAY = 4;

  function buildReview(course, state, size, opts) {
    var map = (opts && opts.map) || itemsById(course);
    var seen = {}, out = [], list = dueList(map, state);
    for (var k = 0; k < list.length && out.length < (size || 20); k++) {
      var it = reviewItem(map, list[k].id, Object.assign({ state: state }, opts));
      // a rule brings a sentence that may be due on its own too: once
      if (!it || seen[it.id]) continue;
      seen[it.id] = 1;
      out.push(it);
    }
    return out;
  }

  /* The cards with the lowest chance of recall now (retrievability), not
     the first of the queue: the five minutes after a pause. */
  function buildColdest(course, state, size, opts) {
    var map = (opts && opts.map) || itemsById(course);
    var ids = root.Reglas ? root.Reglas.coldest(state, (size || 10) * 2, function (id) { return knownId(map, id, state); })
                          : dueList(map, state).map(function (d) { return d.id; });
    var seen = {}, out = [];
    ids.forEach(function (id) {
      if (out.length >= (size || 10)) return;
      var it = reviewItem(map, id, Object.assign({ state: state }, opts));
      if (it && !seen[it.id] && !(opts && opts.silent && it.type === "listen")) { seen[it.id] = 1; out.push(it); }
    });
    return out;
  }

  function dueCount(course, state, map) {
    map = map || itemsById(course);
    return dueList(map, state).length;
  }

  /* Dominio: 85 % en las últimas 30 respuestas de la semana (ventana
     móvil, no el histórico), y al menos el 60 % de sus ejercicios vistos. */
  function mastered(ws) {
    var l = (ws && ws.last) || [];
    if (l.length < 30) return false;
    var sum = 0; l.slice(-30).forEach(function (x) { sum += x; });
    return sum >= 26;
  }
  /* Dominala: one long session over the whole week, no lives, the unseen
     exercises first (so one pass also covers the week).  Written items stay
     written: mastering is producing, not recognising. */
  var DOMINA_SIZE = 30;
  function buildDomina(course, week, state, opts) {
    opts = opts || {};
    var map = opts.map || itemsById(course);
    var pool = (week.items || []).map(function (id) { return map[id]; })
      .filter(function (it) { return it && !(opts.silent && it.type === "listen"); });
    var out = pickFresh(pool, DOMINA_SIZE, state);
    if (out.length < DOMINA_SIZE) {
      var have = {};
      out.forEach(function (it) { have[sameKey(it)] = 1; });
      bankFill(state, DOMINA_SIZE - out.length).forEach(function (it) {
        if (!have[sameKey(it)]) { have[sameKey(it)] = 1; out.push(it); }
      });
    }
    out = shuffle(out);
    // A few rules of a month ago or more, written, with new sentences
    // (it.old: reported apart, they do not count for the 85 %).
    if (root.Reglas && root.Reglas.oldItems && state) {
      root.Reglas.oldItems(state, week.week, DOMINA_OLD).forEach(function (it, k) {
        out.splice(Math.floor((k + 1) * out.length / (DOMINA_OLD + 1)), 0, it);
      });
    }
    return out;
  }
  var DOMINA_OLD = 4;
  // The week is mastered by passing that session, or (saves from before it
  // existed) by 85 % over the last 30 answers with the week covered.
  function dominated(ws, week, state) {
    return !!(ws && ws.dominated) || (mastered(ws) && coverage(week, state).ok);
  }

  function coverage(week, state) {
    var cards = (state && state.cards) || {}, ids = week.items || [], recog = recogOf(state);
    var seen = ids.filter(function (id) { return cards[id] || recog[id]; }).length;
    return { seen: seen, total: ids.length, ok: ids.length === 0 || seen >= Math.min(40, Math.ceil(ids.length * 0.6)) };
  }

  /* El recorrido es el eje del curso: cada escena de frases tiene su
     semana, así las frases llegan cuando la gramática que usan ya se vio
     (las opiniones con subjuntivo después de su semana, no el primer día).
     La semana la trae la escena misma (scene.week); si no la trae, la tabla
     del idioma (LANG.rules.sceneWeek) o la 52. */
  var SCENE_WEEK = R.sceneWeek || {};
  var sceneById = null;
  function sceneWeek(id) {
    if (Frasi && Frasi.SCENES && (!sceneById || sceneById.n !== Frasi.SCENES.length)) {
      sceneById = { n: Frasi.SCENES.length };
      Frasi.SCENES.forEach(function (s) { sceneById[s.id] = s; });
    }
    var sc = sceneById && sceneById[id];
    return (sc && +sc.week) || SCENE_WEEK[id] || 52;
  }
  function scenesOfWeek(week) {
    if (!Frasi) return [];
    return Frasi.SCENES.filter(function (s) { return sceneWeek(s.id) === week; });
  }

  /* La escena del momento: la primera incompleta entre las ya alcanzadas en
     el recorrido.  Si están todas completas, la última alcanzada (repaso),
     nunca una de una semana futura. */
  function nextScene(state) {
    if (!Frasi) return null;
    var unlocked = Math.min((state && state.unlocked) || 1, 52);
    var cards = (state && state.cards) || {};
    var ordered = Frasi.SCENES.slice().sort(function (a, b) { return sceneWeek(a.id) - sceneWeek(b.id); });
    var reached = ordered.filter(function (s) { return sceneWeek(s.id) <= unlocked; });
    if (!reached.length) reached = ordered.slice(0, 1);
    for (var i = 0; i < reached.length; i++) {
      var p = Frasi.progress(reached[i].id, cards);
      if (p.seen < p.total) return reached[i];
    }
    return reached[reached.length - 1];
  }

  /* La pausa del café: tres minutos.  Un poco de repaso, dos frases
     nuevas, algunas conocidas, una pregunta del laboratorio y una de la
     semana.  Cada frase nueva se presenta temprano y se pide después de
     algunas preguntas en el medio: enseguida se recuerda «a la vista», sin
     esfuerzo, y no sirve (espaciado dentro de la sesión: Cepeda et al. 2006). */
  function buildPausa(course, state, week, opts) {
    opts = opts || {};
    var map = opts.map || itemsById(course);
    var review = buildReview(course, state, 4, { map: map, silent: opts.silent });
    var seenIds = {};
    review.forEach(function (it) { seenIds[it.id] = true; });

    var intros = [], drills = [], filler = review.slice();
    // a package without phrase scenes yet (a language that is starting):
    // the words of the week take their place
    var noScenes = !Frasi || !Frasi.SCENES || !Frasi.SCENES.length;
    if (noScenes && week) vocabSession(course, week, state, 3).forEach(function (it) { if (!seenIds[it.id]) { filler.push(it); seenIds[it.id] = true; } });
    if (!noScenes) {
      var sc = nextScene(state);
      Frasi.ofScene(sc.id).filter(function (f) {
        return !state.cards[f.id] && !seenIds[f.id];
      }).slice(0, 2).forEach(function (f) {
        intros.push({ id: f.id, frase: f, src: "frasi", type: "intro",
                      prompt: "Frase nueva", stem: f.it, answer: f.it, note: f.note });
        drills.push(Frasi.pickItem(f, { silent: opts.silent, fresh: true }));
        seenIds[f.id] = true;
      });
      shuffle(Frasi.ALL.filter(function (f) {
        return state.cards[f.id] && !seenIds[f.id];
      })).slice(0, 2).forEach(function (f) { filler.push(Frasi.pickItem(f, opts)); });
    }

    // Interleaving (Rohrer & Taylor 2007): una pregunta del laboratorio.
    // week: the last week whose lesson the learner has read.  Before the
    // first lesson there is no grammar to practise: only phrases and words.
    var labIt = Lab && week ? Lab.randomItem(state.cards, week.week) : null;
    if (labIt) filler.push(labIt);

    // De la semana, solo preguntas de opción: en la pausa se va rápido.
    var bookChoice = ((week && week.items) || []).map(function (id) { return map[id]; })
      .filter(function (it) { return it && it.type === "choice" && !seenIds[it.id]; });
    var fresh = pickFresh(bookChoice, 2, state).filter(function (it) {
      var c = state.cards[it.id];
      return !c || !c.due || c.due <= Date.now();   // already known and not due: leave it
    });
    fresh.forEach(function (it) { filler.push(it); });
    if (week) bankFill(state, 2 - fresh.length).forEach(function (it) { filler.push(it); });
    if (week && week.verbs && week.verbs.length) {
      try {
        filler.push(conjugationDrill(
          week.verbs[Math.floor(Math.random() * week.verbs.length)],
          week.tenses[Math.floor(Math.random() * week.tenses.length)], week.known, week.persons));
      } catch (e) { /* se salta */ }
    }
    filler = shuffle(filler);

    // intro A, 2 filler, intro B, 2 filler, drill A, 2 filler, drill B, rest.
    var out = [];
    function take(n) { for (var i = 0; i < n && filler.length; i++) out.push(filler.shift()); }
    if (intros[0]) out.push(intros[0]);
    take(2);
    if (intros[1]) out.push(intros[1]);
    take(2);
    if (drills[0]) out.push(drills[0]);
    take(2);
    if (drills[1]) out.push(drills[1]);
    take(filler.length);
    return firstRecognize(out.slice(0, 11), state, week ? week.week : 1);
  }

  /* Lampo / Relâmpago: 60 segundos de opciones rápidas, del castellano al
     idioma.  (Las frases guardan el idioma en «it» y el castellano en «es».) */
  function lampoItem(state) {
    var pool = Frasi.ALL.filter(function (f) { return state.cards[f.id]; });
    if (pool.length < 8) pool = Frasi.ALL.slice(0, 40);
    var f = pool[Math.floor(Math.random() * pool.length)];
    var near = Frasi.similar(f, 3, "it"), far = [];
    return {
      id: f.id, frase: f, src: "frasi", type: "choice",
      prompt: "¿Cómo se dice?",
      stem: f.es,
      options: shuffle([f.it].concat(near.concat(far).map(function (g) { return g.it; }))),
      answer: f.it, accept: [f.it], note: f.note
    };
  }

  var api = {
    shuffle: shuffle,
    sample: sample,
    itemsById: itemsById,
    conjugationDrill: conjugationDrill,
    conjugationTyped: conjugationTyped,
    lacksForm: lacksForm,
    buildRound: buildRound,
    recognitionOf: recognitionOf,
    withWordIntros: withWordIntros,
    sceneWeek: sceneWeek,
    scenesOfWeek: scenesOfWeek,
    firstRecognize: firstRecognize,
    vocabSession: vocabSession,
    vocabItem: vocabItem,
    pickFresh: pickFresh,
    buildBoss: buildBoss,
    buildWeak: buildWeak,
    buildDomina: buildDomina,
    dominated: dominated,
    DOMINA_SIZE: DOMINA_SIZE,
    weakItems: weakItems,
    buildReview: buildReview,
    buildColdest: buildColdest,
    roundMix: roundMix,
    knownId: knownId,
    dueList: dueList,
    mastered: mastered,
    coverage: coverage,
    dueCount: dueCount,
    nextScene: nextScene,
    buildPausa: buildPausa,
    lampoItem: lampoItem
  };

  if (typeof module === "object" && module.exports) module.exports = api;
  else root.Drills = api;
})(typeof window !== "undefined" ? window : globalThis);
