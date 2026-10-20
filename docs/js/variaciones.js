/*
 * Variaciones de frase: una frase que ya aprendiste, reescrita cambiando
 * una sola pieza por vez (otra persona, la negativa, otra cosa, el pasado
 * cuando ya se vio, el plural).  Muestra cómo se arma la frase y que el
 * bloque no es de memoria sino un marco con huecos (Myles et al. 1998;
 * N. Ellis 2002).  Por escrito, nunca en voz alta.
 *
 * Los marcos son del paquete (docs/lang/<código>/variaciones_data.js →
 * window.VARIACIONES_DATA): la frase como molde con {v} (el verbo, que se
 * conjuga con Conj), {n} (la negación), {s} (el sujeto) y {o} (la cosa).
 * Acá solo la mecánica: llenar el molde, armar la consigna y el ítem que
 * corrige el motor (Diagnosi, por el camino de siempre de app.js).
 *
 * API (window.Variaciones y module.exports):
 *   fill(frame, opts)          la oración con esas piezas
 *   variants(frame, week)      las variaciones disponibles esa semana
 *   item(frame, v)             el ítem de ronda {type: "variante", …}
 *   session(state, opts)       una ronda con frases ya aprendidas
 *   one(state, week)           un ítem suelto (la pausa)
 *   pastWeek(course)           la semana en que se enseña el pasado
 *   eligible(state, week)      los marcos cuya frase ya aprendiste
 */
(function (root) {
  "use strict";

  var D = root.VARIACIONES_DATA || {};
  var FRAMES = D.frames || [];
  var WEEKS = D.weeks || {};

  function conj() { return root.Conj; }
  function frasi() { return root.Frasi; }

  function tidy(s) {
    s = String(s).replace(/\s+/g, " ").replace(/\s+([,.;:!?…»])/g, "$1").replace(/([«¿¡])\s+/g, "$1").trim();
    return s.charAt(0).toUpperCase() + s.slice(1);
  }
  function lowerFirst(s) { return s ? s.charAt(0).toLowerCase() + s.slice(1) : s; }

  function feminine(form) {
    return String(form).replace(/o$/, "a").replace(/i$/, "e");
  }

  // A regular verb the conjugator does not list yet is registered, like the
  // bank does (Conj.register: class and auxiliary are enough).
  function ensure(fr) {
    var C = conj();
    if (C && !C.VERBS[fr.v] && C.register) { try { C.register(fr.v, { aux: fr.aux }); } catch (e) { /* */ } }
  }
  function verbForm(fr, p, t, fem) {
    var C = conj();
    ensure(fr);
    var f = C.conjugate(fr.v, t || fr.t || "presente")[p];
    if (f == null) throw new Error("sin forma: " + fr.v + " " + p);
    // the participle agrees only with essere (it); ter never agrees (pt)
    if (fem && C.auxiliary && C.auxiliary(fr.v) === "essere" && (C.SIMPLE_TENSES || []).indexOf(t || fr.t || "presente") < 0)
      f = f.replace(/(\S+)$/, function (w) { return feminine(w); });
    return f;
  }
  // Every accepted form of that person (pt: ênclise, double participles).
  function verbForms(fr, p, t, fem) {
    var C = conj(), main = verbForm(fr, p, t, fem), out = [main];
    if (C.accepted) {
      try { (C.accepted(fr.v, t || fr.t || "presente")[p] || []).forEach(function (f) { if (!fem && out.indexOf(f) < 0) out.push(f); }); } catch (e) { /* */ }
    }
    return out;
  }

  function subjOf(fr, v) {
    if (v && v.s) return v.s;
    if (typeof fr.s === "string") return v && v.p != null && v.p !== fr.p ? ((D.subj || [])[v.p] || [""])[0] : fr.s;
    if (fr.s === true) return ((D.subj || [])[v && v.p != null ? v.p : fr.p] || [""])[0];
    return "";
  }

  function applySub(s, sub) {
    (sub || []).forEach(function (x) { s = s.split(x[0]).join(x[1]); });
    return s;
  }

  /* The sentence with the pieces of `o`: {p, t, neg, o, s, sub, fem, form}. */
  function fill(fr, o) {
    o = o || {};
    var p = o.p != null ? o.p : fr.p;
    var form = o.form || verbForm(fr, p, o.t, o.fem);
    var s = o.s != null ? o.s : subjOf(fr, null);
    var out = fr.tpl
      .replace("{n}", o.neg ? (o.negWord || D.neg || "") : "")
      .replace("{s}", s || "")
      .replace("{o}", o.o != null ? o.o : (fr.o || ""))
      .replace("{v}", form);
    return tidy(applySub(out, o.sub));
  }

  /* The piece each variation changes, as the options of fill(). */
  function piecesOf(fr, v) {
    var o = { sub: v.sub, fem: v.fem };
    if (v.p != null) o.p = v.p;
    if (v.o != null) o.o = v.o;
    if (v.k === "neg") o.neg = true;
    if (v.k === "pas") o.t = (D.past || {}).tense;
    // Show the subject when the frame says it, or (languages without
    // pro-drop) when the variation names it.
    var shows = fr.s != null || (/\{s\}/.test(fr.tpl) && !D.proDrop);
    o.s = shows ? subjOf(fr, v) : "";
    return o;
  }

  /* Past: the first week of the course that has the tense (or the fallback). */
  var pastW = null;
  function pastWeek(course) {
    var P = D.past || {};
    if (course && course.weeks) {
      for (var i = 0; i < course.weeks.length; i++) {
        if ((course.weeks[i].tenses || []).indexOf(P.tense) >= 0) { pastW = course.weeks[i].week; return pastW; }
      }
    }
    return pastW || P.week || 99;
  }

  function sceneWeekOf(fr) {
    var F = frasi(), f = F && F.BY_ID[fr.f];
    return f ? (f.week || 1) : 1;
  }
  function kindWeek(fr, v) {
    var base = sceneWeekOf(fr);
    var k = v.w || (v.k === "pas" ? pastWeek() : WEEKS[v.k] || 1);
    return Math.max(base, k);
  }
  function variants(fr, week) {
    return (fr.vars || []).filter(function (v) { return !week || kindWeek(fr, v) <= week; });
  }

  /* ------------------------------------------------------------ consignas */

  function q(x) { return "«" + x + "»"; }
  function personCue(fr, v) {
    var s = v.s || ((D.subj || [])[v.p] || [])[0] || "";
    var es = (D.subjAlt || {})[s] || ((D.subj || [])[v.p] || [])[1] || "";
    return q(s) + (es ? " (" + es + ")" : "");
  }
  function subCue(v) {
    return (v.sub || []).map(function (x) { return q(x[0]) + " pasa a " + q(x[1]); }).join(", ");
  }
  function cueOf(fr, v) {
    var extra = subCue(v);
    if (v.k === "per") return "Cambiá la persona: ahora es " + personCue(fr, v) + (extra ? ". Y " + extra : "") + ".";
    if (v.k === "neg") return "Pasala a negativa.";
    if (v.k === "obj") return "Cambiá la cosa" + (v.o != null ? ": en vez de " + q(fr.o) + ", " + (v.cue || q(v.o)) : ": " + (v.cue || extra)) +
      (v.p != null && v.p !== fr.p ? ". Ojo con el verbo" : "") + ".";
    if (v.k === "pas") return "Pasala al pasado (" + ((conj().TENSE_LABELS || {})[(D.past || {}).tense] || "pasado") + "): ya pasó" +
      (extra ? ". Y " + extra : "") + ".";
    // («Ahora son varios», not «plural»: the diagnosis reads «plural» in a
    // prompt as a noun-plural exercise)
    if (v.k === "plu") return "Ahora son varios: " + (v.o != null ? (v.cue || q(v.o)) + (v.p != null ? ", con el verbo que corresponde" : "") : personCue(fr, v)) +
      (extra ? ". Y " + extra : "") + ".";
    return "Cambiá una pieza.";
  }

  var NAMES = { per: "otra persona", neg: "negativa", obj: "otra cosa", pas: "pasado", plu: "varios" };

  function noteOf(fr, v, pieces) {
    var C = conj(), t0 = fr.t || "presente", t1 = pieces.t || t0;
    var p0 = fr.p, p1 = pieces.p != null ? pieces.p : p0;
    var a = verbForm(fr, p0, t0), b = verbForm(fr, p1, t1, v.fem);
    var lbl = (C.TENSE_LABELS || {})[t1] || t1;
    if (v.k === "neg") return D.negNote || "";
    var P = D.past || {};
    if (v.k === "pas") return "*" + fr.v + "*, " + lbl + ": *" + a + "* → *" + b + "*. " + (P.note || "") +
      (P.agree && C.auxiliary && C.auxiliary(fr.v) === "essere" ? " " + P.agree : "");
    if (a !== b) return "*" + fr.v + "*, " + lbl + ": *" + a + "* → *" + b + "*. El resto de la frase queda igual" +
      (v.sub && v.sub.length ? ", salvo lo que pide la consigna" : "") + ".";
    if (v.k === "per" || v.k === "plu" && v.o == null) return "*" + a + "* no cambia: la misma forma sirve para esa persona.";
    return "Solo cambia la cosa: el verbo queda igual" + (v.o && /^\S+'/.test(v.o) ? " y el artículo se apostrofa delante de vocal" : "") + ".";
  }

  /* Every answer that says the same: with or without the subject pronoun
     (when the person is clear), the other accepted forms of the verb, «a
     gente» for «nós», the feminine participle. */
  function acceptOf(fr, v, pieces, answer) {
    var out = [answer], add = function (x) { x = tidy(x); if (out.indexOf(x) < 0) out.push(x); };
    var p = pieces.p != null ? pieces.p : fr.p;
    // with the negation the clitic goes before the verb: no ênclise then
    (pieces.neg ? [verbForm(fr, p, pieces.t, v.fem)] : verbForms(fr, p, pieces.t, v.fem)).forEach(function (f) {
      add(fill(fr, Object.assign({}, pieces, { form: f })));
    });
    var hasS = /\{s\}/.test(fr.tpl), sNow = pieces.s;
    var clear = D.proDrop || p === 0 || p === 1 || p === 3 || p === 4;
    if (hasS && sNow && clear && fr.s == null) add(fill(fr, Object.assign({}, pieces, { s: "" })));
    var S = v.s || ((D.subj || [])[p] || [])[0];
    if (!sNow && S && clear && /^\{[nsv]\}/.test(fr.tpl.replace(/^\{n\}\s*/, "{n}"))) {
      // no subject in the answer: with it, it is right too
      if (hasS) add(fill(fr, Object.assign({}, pieces, { s: S })));
      else add(S + " " + lowerFirst(answer));
    }
    // «a gente» + 3rd singular, except where something agrees with the subject
    if (D.weAlt && p === 3 && hasS && !(v.sub && v.sub.length)) {
      try { add(fill(fr, Object.assign({}, pieces, { p: D.weAlt.p, s: D.weAlt.s, form: verbForm(fr, D.weAlt.p, pieces.t) }))); } catch (e) { /* */ }
    }
    var tt = pieces.t || fr.t;
    if (!v.fem && tt) {
      // a woman writing: the participle agrees (sono andata / mi sono alzata)
      try {
        var fem = verbForm(fr, p, tt, true);
        if (fem !== verbForm(fr, p, tt)) add(fill(fr, Object.assign({}, pieces, { form: fem })));
      } catch (e) { /* */ }
    }
    (v.acc || []).forEach(add);
    return out;
  }

  /* The easier second pass: choose the right rewrite among three. */
  function distractors(fr, v, pieces, answer) {
    var out = [], acc = acceptOf(fr, v, pieces, answer).map(function (x) { return x.toLowerCase(); });
    var add = function (x) { try { x = tidy(x); } catch (e) { return; } if (x && acc.indexOf(x.toLowerCase()) < 0 && out.indexOf(x) < 0) out.push(x); };
    (v.bad || []).forEach(add);
    var p = pieces.p != null ? pieces.p : fr.p;
    if (v.k === "neg") {
      add(fill(fr, Object.assign({}, pieces, { negWord: D.negTrap || "no" })));
      add(fill(fr, Object.assign({}, pieces, { neg: false })));
    } else if (v.k === "pas") {
      add(fill(fr, Object.assign({}, pieces, { t: fr.t })));
      [0, 2, 3].filter(function (x) { return x !== p; }).slice(0, 2).forEach(function (x) {
        try { add(fill(fr, Object.assign({}, pieces, { p: x, form: verbForm(fr, x, pieces.t) }))); } catch (e) { /* */ }
      });
    } else if (v.p != null) {
      // the verb left as it was (the agreement error), another person
      add(fill(fr, Object.assign({}, pieces, { form: verbForm(fr, fr.p, pieces.t) })));
      [0, 2, 3, 5].filter(function (x) { return x !== p && x !== fr.p; }).slice(0, 1).forEach(function (x) {
        try { add(fill(fr, Object.assign({}, pieces, { form: verbForm(fr, x, pieces.t) }))); } catch (e) { /* */ }
      });
    }
    if (out.length < 2) add(fill(fr, {}));
    return out.slice(0, 2);
  }

  function shuffle(a) {
    a = a.slice();
    for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; }
    return a;
  }

  function item(fr, v) {
    var pieces = piecesOf(fr, v);
    var answer = fill(fr, pieces), base = fill(fr, {});
    var idx = (fr.vars || []).indexOf(v);
    var F = frasi(), f = F && F.BY_ID[fr.f];
    var prompt = "Variación (" + (NAMES[v.k] || "una pieza") + "). Reescribila cambiando una sola pieza: " + cueOf(fr, v);
    var it = {
      id: "var:" + fr.f.replace(/^frase:/, "") + ":" + idx, src: "variaciones", type: "variante", nocard: true,
      prompt: prompt, stem: base, answer: answer, accept: acceptOf(fr, v, pieces, answer),
      note: noteOf(fr, v, pieces) + (f ? " · La frase de base: «" + f.es + "»." : ""),
      change: v.k, week: kindWeek(fr, v)
    };
    var wrong = distractors(fr, v, pieces, answer);
    if (wrong.length) {
      it.retryAs = { id: it.id, src: "variaciones", type: "choice", nocard: true,
        prompt: "Elegí la que tiene el cambio bien hecho: " + cueOf(fr, v),
        stem: base, options: shuffle([answer].concat(wrong)), answer: answer, accept: [answer], note: it.note };
    }
    return it;
  }

  /* ---------------------------------------------------------- selección */

  function learned(state, id) {
    var c = state && state.cards && state.cards[id];
    return !!c && ((c.ok || 0) >= 1 || (c.reps || 0) >= 1);
  }
  // The frames whose phrase you already know (seen and got right once),
  // that have something to change at this point of the course.
  function eligible(state, week, loose) {
    return FRAMES.filter(function (fr) {
      var F = frasi(), f = F && F.BY_ID[fr.f];
      if (!f) return false;
      if (loose ? !(state.cards || {})[fr.f] : !learned(state, fr.f)) return false;
      return variants(fr, week).length > 0;
    });
  }

  /* A round: one variation per phrase, the kinds mixed, preferably phrases
     of the scenes of `focus` (the week of the mission). */
  function session(state, opts) {
    opts = opts || {};
    var week = opts.week || (state && state.unlocked) || 1, n = opts.n || 8;
    var pool = eligible(state, week);
    if (pool.length < 3) pool = eligible(state, week, true);
    if (!pool.length) return [];
    pool = shuffle(pool);
    if (opts.focus) pool.sort(function (a, b) { return (sceneWeekOf(b) === opts.focus) - (sceneWeekOf(a) === opts.focus); });
    var used = {}, out = [];
    for (var round = 0; round < 3 && out.length < n; round++) {
      pool.forEach(function (fr) {
        if (out.length >= n) return;
        var vs = variants(fr, week).filter(function (v) { return !used[fr.f + ":" + fr.vars.indexOf(v)]; });
        if (!vs.length) return;
        // the least used kind first
        var cnt = {};
        out.forEach(function (x) { cnt[x.change] = (cnt[x.change] || 0) + 1; });
        vs = shuffle(vs).sort(function (a, b) { return (cnt[a.k] || 0) - (cnt[b.k] || 0); });
        var v = vs[0];
        used[fr.f + ":" + fr.vars.indexOf(v)] = 1;
        try { out.push(item(fr, v)); } catch (e) { /* un verbo que el conjugador no sabe: se salta */ }
      });
    }
    return shuffle(out);
  }

  function one(state, week) {
    var s = session(state, { week: week, n: 1 });
    return s[0] || null;
  }

  var api = { FRAMES: FRAMES, fill: fill, variants: variants, item: item, session: session, one: one,
              eligible: eligible, pastWeek: pastWeek, kindWeek: kindWeek, pieces: piecesOf, cue: cueOf, tidy: tidy };
  if (typeof module === "object" && module.exports) module.exports = api;
  root.Variaciones = api;
})(typeof window !== "undefined" ? window : globalThis);
