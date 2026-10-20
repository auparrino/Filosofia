/* Devoluciones y diagnóstico, en los dos idiomas (docs/js/devolucion.js):
   - una respuesta que no se parece a la correcta («boh», «xx», otra frase)
     no recibe una regla inventada;
   - «Casi» solo cuando está cerca;
   - la nota de la segunda vez no trae la respuesta;
   - la consigna de un ítem con opciones no dice «Escribí»;
   - los nombres de tiempos y modos, recién desde su semana;
   - italiano: «Acá va congiuntivo» no sale en ejercicios de presente.
   Run: node tools/lib/test_fix_feedback.js */
"use strict";
var pack = require("./pack.js");
var n = 0, bad = 0;
function ok(c, m) { n++; if (!c) { bad++; console.log("FAIL " + m); } }

var TYPED = { cloze: 1, translate: 1, conjugate: 1, plural: 1, numbers: 1, qa: 1, typed: 1 };

pack.LANGS.forEach(function (code) {
  var c = pack(code), DV = c.Devolucion, D = c.Diagnosi;
  ok(DV && c.DEVOLUCION_DATA, code + ": Devolucion y DEVOLUCION_DATA cargados");
  if (!DV) return;
  var bank = pack.data(code, "bank.json");
  c.Banca.load(bank);
  var course = pack.data(code, "course.json");

  /* (a) «boh», «xx» against every phrase: far, so no rule and no Clínica. */
  var frasi = c.Frasi.ALL, farN = 0, tot = 0;
  frasi.forEach(function (f) {
    ["boh", "xx", "sei lá"].forEach(function (g) {
      var d = D.diagnose(g, [f.it], {});
      // all in Spanish («sei lá» for Italian) keeps its true diagnosis
      if (d.verdict === "giusto" || (c.DEVOLUCION_DATA.keep || []).indexOf(d.cat) >= 0) return;
      tot++;
      if (DV.far(g, [f.it], d)) farN++;
    });
  });
  ok(farN / tot >= 0.97, code + ": respuestas sin relación leídas como lejanas: " + farN + "/" + tot);
  // Another whole sentence of the scene as the answer.
  var other = 0, otherTot = 0;
  for (var i = 0; i + 1 < frasi.length; i++) {
    var a = frasi[i].it, b = frasi[i + 1].it;
    if (c.Frasi.words(a).length < 3 || c.Frasi.words(b).length < 3) continue;
    var sh = c.Frasi.words(a).filter(function (w) { return c.Frasi.words(b).indexOf(w) >= 0; }).length;
    if (sh > 0) continue;
    otherTot++;
    if (DV.far(b, [a], D.diagnose(b, [a], {}))) other++;
  }
  ok(other >= otherTot * 0.95, code + ": otra frase sin palabras en común es lejana: " + other + "/" + otherTot);

  /* Real errors stay close. */
  var NEAR = code === "it"
    ? [["Ieri ho andato al cinema", "Ieri sono andato al cinema."], ["il zaino", "lo zaino"],
       ["Vado a il cinema", "Vado al cinema."], ["parlero domani", "parlerò domani"],
       ["Aspetto a mia sorella", "Aspetto mia sorella."]]
    : [["Eu gosto muito de o Rio", "Eu gosto muito do Rio."], ["Eu tenho fome", "Eu estou com fome."],
       ["Ontem eu comi muito", "Ontem eu comi muito."], ["Ela é muito bonito", "Ela é muito bonita."],
       ["Vou em a praia", "Vou à praia."]];
  NEAR.forEach(function (p) {
    var d = D.diagnose(p[0], [p[1]], {});
    ok(!DV.far(p[0], [p[1]], d), code + ": «" + p[0] + "» no es lejana de «" + p[1] + "»");
    if (d.verdict !== "giusto") ok(DV.near(p[0], [p[1]], d), code + ": «" + p[0] + "» merece «Casi» (" + d.cat + ")");
  });
  // A single form tied to a rule is not far (sono / ho, sou / estou).
  var one = code === "it" ? ["sono", "ho", "Io ___ fame."] : ["sou", "estou", "Eu ___ cansado."];
  var d1 = D.diagnose(one[0], [one[1]], { stem: one[2] });
  ok(!DV.far(one[0], [one[1]], d1), code + ": «" + one[0] + "» por «" + one[1] + "» no es lejana (" + d1.cat + ")");

  /* (c) «Casi» only when close: «xx» for a sentence or for one word. */
  var ph = code === "it" ? "Ho già mangiato, grazie." : "Já comi, obrigado.";
  var dx = D.diagnose("xx", [ph], {});
  ok(!DV.near("xx", [ph], dx) && /Todavía no/.test(DV.promptVerdict("xx", [ph], dx)), code + ": «xx» no es «Casi»");
  var w1 = code === "it" ? "ciao" : "tudo";
  var dx1 = D.diagnose("xx", [w1], { stem: code === "it" ? "___, come stai?" : "Oi, ___ bem?" });
  ok(!DV.near("xx", [w1], dx1), code + ": «xx» por «" + w1 + "» no es «Casi»");
  ok(DV.far("xx", [w1], dx1), code + ": «xx» por «" + w1 + "» es lejana");
  var typo = code === "it" ? ["grazei", "grazie"] : ["obrigdo", "obrigado"];
  ok(DV.near(typo[0], [typo[1]], D.diagnose(typo[0], [typo[1]], {})), code + ": un tipeo es «Casi»");

  /* (b) The retry note never carries the answer. */
  var leaks = 0, checked = 0, example = "";
  course.items.forEach(function (it) {
    if (!it.note || !it.answer) return;
    var answers = [it.answer].concat(it.accept || []);
    var masked = DV.maskNote(it.note, answers, it.stem);
    checked++;
    var low = masked.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
    var leaked = answers.some(function (a) {
      return String(a).split(/\s*\|\s*/).some(function (x) {
        x = x.trim().toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[.!?¿¡]+$/g, "");
        if (!x) return false;
        var re = new RegExp("(^|[^a-z0-9'])" + x.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "(?=$|[^a-z0-9])");
        return re.test(low);
      });
    });
    if (leaked) { leaks++; if (!example) example = it.id + ": " + masked; }
  });
  ok(leaks === 0, code + ": notas de la segunda vez con la respuesta a la vista: " + leaks + "/" + checked + " " + example);
  if (code === "pt") {
    var m = DV.maskNote("Dia es masculino (o dia): bom dia.", ["Bom"], "___ dia!");
    ok(!/\bbom\b/i.test(m) && /dia/.test(m), "pt: «bom dia» tapado: " + m);
  }

  /* (e) Items shown as options: the prompt says choose. */
  var wrongPrompt = 0, shown = 0, ex = "";
  course.items.forEach(function (it) {
    if (!TYPED[it.type]) return;
    var r = c.Drills.recognitionOf(it, course.items, it.wk || 52);
    if (!r) return;
    shown++;
    if (/^Escrib|^Reescrib|\bescrib[íi]\b/i.test(r.prompt || "")) { wrongPrompt++; if (!ex) ex = r.prompt; }
  });
  ok(shown > 100 && wrongPrompt === 0, code + ": consignas «Escribí» sobre opciones: " + wrongPrompt + "/" + shown + " " + ex);
  ok(DV.choicePrompt("Escribilo bien: poné el verbo en presente.") === "Elegí la forma correcta: el verbo en presente.",
     code + ": «Escribilo bien» → " + DV.choicePrompt("Escribilo bien: poné el verbo en presente."));
  ok(/^Elegí la forma de «/.test(DV.choicePrompt("Escribí la forma de «avere» — presente")), code + ": gimnasio con opciones");

  /* (f) Tense names before their week. */
  var labels = Object.keys(c.Conj.TENSE_LABELS).map(function (t) { return c.Conj.TENSE_LABELS[t]; });
  var early = labels.map(function (l) { return DV.plain(l, 1); }).join(" | ");
  var TERMS = code === "it" ? /congiuntivo|condizionale|imperfetto|passato|trapassato|indicativo|anteriore/i
                            : /indicativo|perfeito|imperfeito|futuro do|do subjuntivo|pessoal/i;
  ok(!TERMS.test(early), code + ": semana 1 sin nombres de tiempos no enseñados: " + early);
  ok(labels.map(function (l) { return DV.plain(l, 52); }).join(" | ") === labels.join(" | "), code + ": semana 52: los nombres como están");
  ok(DV.plain("Acá va *congiuntivo*: *paghi*", 1) === "Acá va *congiuntivo*: *paghi*", code + ": lo que está entre asteriscos no se toca");
  var week1 = code === "it" ? DV.plain("presente (indicativo)", 1) : DV.plain("presente do indicativo", 1);
  ok(week1 === "presente", code + ": presente del gimnasio en la semana 1: «" + week1 + "»");
  var dTidy = DV.tidy({ hint: code === "it" ? "¿Qué modo pide? congiuntivo" : "Acá va presente do subjuntivo", explain: "", label: "" }, 3);
  ok(!TERMS.test(dTidy.hint) && !/do subjuntivo/.test(dTidy.hint), code + ": tidy en la semana 3: " + dTidy.hint);

  /* (d) Italian: no «congiuntivo» in present-tense items (weeks ≤ 23). */
  if (code === "it") {
    var cong = 0, errs = 0, cex = "";
    var Conj = c.Conj;
    course.items.forEach(function (it) {
      if (it.type !== "conjugate" && it.type !== "cloze") return;
      var wk = it.wk || 52;
      if (wk > 23 || !/presente/i.test(it.prompt || "") || /congiuntiv|subjuntiv/i.test(it.prompt || "")) return;
      var ans = String(it.answer || "");
      if (!ans || /\s|\|/.test(ans)) return;
      var vf = D.verbForms(ans.toLowerCase()).filter(function (x) { return x.tense === "presente"; })[0];
      if (!vf) return;
      var forms;
      try { forms = Conj.conjugate(vf.lemma, "presente"); } catch (e) { return; }
      forms.forEach(function (f, p) {
        f = String(f || "").split(" ").pop();
        if (!f || f === ans.toLowerCase()) return;
        var d = D.diagnose(f, [ans], { stem: it.stem, prompt: it.prompt, week: wk });
        errs++;
        if (d.cat === "congiuntivo") { cong++; if (!cex) cex = it.id + " " + f + " → " + d.explain; }
      });
    });
    ok(errs > 200 && cong === 0, "it: errores de persona en presente leídos como congiuntivo: " + cong + "/" + errs + " " + cex);
    var dp = D.diagnose("pago", ["paghi"], { stem: "Tu ___ troppo di affitto (pagare)", prompt: "Conjugá en presente.", week: 6 });
    ok(dp.cat === "persona_verbale", "it: pago/paghi en presente es persona: " + dp.cat);
    var dm = D.diagnose("mangia", ["mangi"], { stem: "Tu ___ (mangiare) la pasta.", week: 3 });
    ok(dm.cat === "persona_verbale", "it: mangia/mangi es persona: " + dm.cat);
    // …and the congiuntivo still where it goes.
    ok(D.diagnose("Penso che è tardi", ["Penso che sia tardi"], { week: 30 }).cat === "congiuntivo", "it: penso che + indicativo sigue siendo congiuntivo");
    ok(D.diagnose("Spero che vieni", ["Spero che venga"], {}).cat === "congiuntivo", "it: spero che vieni sigue siendo congiuntivo");
    var dcg = D.diagnose("mangi", ["mangia"], { stem: "Tu ___ (mangiare)", week: 3 });
    ok(dcg.cat !== "congiuntivo", "it: mangi por mangia no es congiuntivo: " + dcg.cat);
    var db = D.diagnose("bacio", ["baci"], { stem: "bacio → ___", prompt: "Escribí el plural del sustantivo.", nominal: true, week: 2 });
    ok(db.cat !== "congiuntivo", "it: plural de bacio no es congiuntivo: " + db.cat);
  }
});

console.log((bad ? bad + " fallas" : "ok") + " · " + n + " chequeos (devoluciones y diagnóstico)");
process.exit(bad ? 1 : 0);
