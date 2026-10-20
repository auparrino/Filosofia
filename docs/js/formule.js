/*
 * Fórmulas fijas: frases que se aprenden enteras antes que su gramática.
 *
 * Aprender *ho capito* o *não sei* como un bloque antes de la lección del
 * pasado o del presente irregular está bien (Myles, Hooper & Mitchell 1998;
 * Boers & Lindstromberg 2012), siempre que la app lo diga y que, cuando
 * llega la lección, la regla se una con la fórmula que ya se venía usando
 * (Ellis 2002): así la fórmula pasa a ser un caso de la regla.
 *
 * El paquete trae, por frase, la forma que se adelanta y la semana en que
 * se enseña (docs/lang/<código>/formule_data.js → window.FORMULE_DATA, lo
 * genera tools/lib/formule.py con el sillabo del idioma):
 *
 *   { "frase:salva:0": [[11, "ho capito"]], … }
 *
 * Acá está lo que usa la interfaz, sin DOM:
 *   Formule.of(frase)             [[semana, formas], …] (vacío: nada adelantado)
 *   Formule.line(frase, unlocked) la línea «🧱 Fórmula fija…» de la tarjeta
 *                                 y del «Adiviná» ("" si no hace falta)
 *   Formule.bridge(week, cards)   las frases que usaban la gramática de esa
 *                                 semana, las ya vistas primero
 *   Formule.addStep(steps, week, cards)  agrega a una lección jugada el paso
 *                                 «Ya lo venías usando» después de la intro
 */
(function (root) {
  "use strict";

  var DATA = root.FORMULE_DATA || {};

  function frasi() { return root.Frasi || null; }

  function of(f) {
    if (!f) return [];
    var e = DATA[f.id] || [];
    return e.filter(function (x) { return x[0] > (f.week || 1); });
  }

  function forms(s) {
    return String(s).split(/,\s*/).map(function (x) { return "*" + x + "*"; }).join(", ");
  }

  /* The line under a phrase that uses later grammar.  unlocked: the week
     the learner has reached (the grammar may have been taught already). */
  function line(f, unlocked) {
    var e = of(f);
    if (!e.length) return "";
    unlocked = unlocked || 1;
    var ahead = e.filter(function (x) { return x[0] > unlocked; });
    if (!ahead.length) {
      return "🧱 Empezó como fórmula: " + e.map(function (x) {
        return forms(x[1]) + " es de la semana " + x[0];
      }).join("; ") + ", que ya viste.";
    }
    return "🧱 Fórmula fija: aprendela entera, como un bloque. " + ahead.map(function (x, k) {
      return (k ? "la de " : "La gramática de ") + forms(x[1]) + (k ? ", en la " + x[0] : " la vas a ver en la semana " + x[0]);
    }).join("; ") + ".";
  }

  /* The phrases whose grammar is taught in `week`: [{ f, forms, seen }],
     the ones the learner has already met first. */
  function bridge(week, cards, max) {
    var Fr = frasi();
    if (!Fr) return [];
    cards = cards || {};
    var out = [];
    Object.keys(DATA).forEach(function (id) {
      var f = Fr.BY_ID[id];
      if (!f || (f.week || 1) >= week) return;
      of(f).forEach(function (x) {
        if (x[0] === week) out.push({ f: f, forms: x[1], seen: !!cards[id] });
      });
    });
    out.sort(function (a, b) { return (b.seen - a.seen) || ((a.f.week || 1) - (b.f.week || 1)); });
    return out.slice(0, max || 6);
  }

  // After the intro of the lesson (only the first part has it).
  function addStep(steps, week, cards) {
    if (!steps || !steps.length || steps[0].kind !== "intro") return steps;
    var b = bridge(week, cards);
    if (b.length) steps.splice(1, 0, { kind: "formule", ids: b.map(function (x) { return x.f.id; }) });
    return steps;
  }

  var api = { DATA: DATA, of: of, line: line, bridge: bridge, addStep: addStep };
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.Formule = api;
})(typeof window !== "undefined" ? window : globalThis);
