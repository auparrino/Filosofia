/* Las respuestas válidas que no son la del modelo (italiano).
 *
 * Toma las oraciones del banco y las traducciones del curso, arma
 * variantes que un italiano aceptaría (el sujeto explícito, «anche io», el
 * adverbio de tiempo al principio o al final, sinónimos comunes, cifras en
 * lugar de números escritos, elisiones optativas, «a me piace», el futuro
 * para un plan con fecha…) y las juzga como la app (Engine.grade +
 * Diagnosi.diagnose, igual que app.js:produce).  Tienen que aceptarse, con
 * una nota si son aceptables pero menos naturales.  Y arma también variantes
 * **incorrectas** de control (el sujeto de otra persona, «sto a mangiare»,
 * «ci è», la hora en cifras donde se piden letras, el adverbio entre el
 * auxiliar y el participio, el sustantivo del otro género…), que se tienen
 * que seguir rechazando.
 *
 *   node tools/it/test_variantes.js        resumen por familia
 *   node tools/it/test_variantes.js -v     con ejemplos de lo rechazado
 */
"use strict";
var pack = require("../lib/pack.js");
var ctx = pack("it");
var D = ctx.Diagnosi, Engine = ctx.Engine, Conj = ctx.Conj;
var bank = pack.data("it", "bank.json");
ctx.Banca.load(bank);
var course = pack.data("it", "course.json");
var verbose = process.argv.indexOf("-v") >= 0;

var fails = 0, checks = 0;
function ok(c, what) { checks++; if (!c) { fails++; console.log("FAIL " + what); } }

/* ------------------------------------------------------------ juzgar */

// Como app.js:produce: una respuesta vale si Engine.grade o el diagnóstico
// la dan por buena.
function judge(given, item) {
  var accept = (item.accept && item.accept.length ? item.accept : [item.answer]).map(function (x) {
    return String(x).replace(/\s*\|\s*/g, " ");
  });
  var d = D.diagnose(given, accept, { stem: item.stem, prompt: item.prompt, week: item.week,
                                      nominal: item.type === "plural" || /plural/i.test(item.prompt || "") });
  var v1 = Engine.grade(given, { answer: item.answer, accept: accept });
  var verdict = v1 === "giusto" || d.verdict === "giusto" ? "giusto" : d.verdict === "sbagliato" && d.cat ? "sbagliato" : v1 === "quasi" || d.verdict === "quasi" ? "quasi" : "sbagliato";
  return { verdict: verdict, d: d };
}

/* ------------------------------------------------------------ fuentes */

var WEEK = {};
course.weeks.forEach(function (w) { w.items.forEach(function (id) { if (WEEK[id] == null || WEEK[id] > w.week) WEEK[id] = w.week; }); });
var SRC = [];
bank.sentences.forEach(function (s, i) {
  SRC.push({ id: "s" + i, answer: s.it[0], accept: s.it, stem: s.es, week: s.w || 52, type: "translate" });
});
Object.keys(course.items).forEach(function (id) {
  var it = course.items[id];
  if (it.type !== "translate" || it.dir === "it-es" || !it.answer || /_{3}/.test(it.stem || "")) return;
  SRC.push({ id: id, answer: String(it.answer), accept: it.accept, stem: it.stem, prompt: it.prompt,
             week: WEEK[id] || it.w || it.wk || 52, type: it.type });
});

/* ------------------------------------------------------------ palabras */

function split(s) { return String(s).trim().split(/\s+/); }
function core(t) { return t.replace(/^[«"¿¡(]+|[.,;:!?»")…]+$/g, ""); }
function low(t) { return core(t).toLowerCase(); }
function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
function put(toks, i, repl) {
  var c = core(toks[i]), r = /^[A-ZÀ-Ý]/.test(c) ? cap(repl) : repl;
  var copy = toks.slice(); copy[i] = toks[i].replace(c, r); return copy;
}
function join(toks) { return toks.filter(function (t) { return t !== ""; }).join(" "); }
function endPunct(s) { var m = /[.!?…]+["»]?$/.exec(s); return m ? m[0] : ""; }
function body(s) { return s.slice(0, s.length - endPunct(s).length); }
function vf(w) { return D.verbForms(w); }
function isVerb(w) { return vf(w).length > 0; }
var CLI = /^(mi|ti|si|ci|vi|lo|la|li|le|gli|ne|me|te|ce|ve|se|l'|glielo|gliela|glieli|gliele|gliene)$/;

/* --------------------------------------------------- variantes válidas */

var PRON = ["io", "tu", null, "noi", "voi", "loro"];
var FUTURE = /\b(domani|dopodomani|stasera|prossimo|prossima|prossimi|prossime|più tardi)\b/i;

function valid(src) {
  var out = [], s = src.answer, toks = split(s), L = toks.map(low);
  function add(fam, given, note) { if (given && given !== s) out.push({ fam: fam, given: given }); }

  // 1. El sujeto explícito, cuando el verbo dice una sola persona.
  if (!/!/.test(s) && !/\b(usted|ustedes)\b/i.test(src.stem || "")) {
    var k = 0;
    if (L[0] === "non") k = 1;
    while (CLI.test(L[k] || "")) k++;
    var fs = vf(L[k] || "");
    var ps = fs.map(function (x) { return x.p; }).filter(function (p, i, a) { return a.indexOf(p) === i; });
    if (fs.length && ps.length === 1 && PRON[ps[0]] && !D.DATA.nouns[L[k]] && !D.DATA.nounsByPlural[L[k]]) {
      add("sujeto", cap(PRON[ps[0]]) + " " + s.charAt(0).toLowerCase() + s.slice(1));
    }
  }
  // 2. anche io / anch'io
  if (/\banch'io\b/i.test(s)) add("anche_io", s.replace(/\b(A|a)nch'io\b/, function (m, a) { return a + "nche io"; }));
  if (/\banche io\b/i.test(s)) add("anche_io", s.replace(/\b(A|a)nche io\b/, function (m, a) { return a + "nch'io"; }));

  // 3. El adverbio o la expresión de tiempo, del principio al final y al revés.
  var TIME = /^(oggi|domani|ieri|stasera|stamattina|stanotte|adesso|dopodomani|ieri sera|ieri mattina|domani mattina|domani sera|questa sera|questa mattina|ogni giorno|tutti i giorni|di solito|l'anno scorso|l'anno prossimo|la settimana scorsa|la settimana prossima|il mese scorso|il mese prossimo|sabato sera|domenica mattina|la sera|la mattina|d'estate|d'inverno|in estate|in inverno)$/i;
  var b = body(s), e = endPunct(s), commas = (b.match(/,/g) || []).length;
  if (toks.length <= 10) {
    for (var n = 3; n >= 1; n--) {
      var head = split(b).slice(0, n).join(" ").replace(/,$/, "");
      var rest = split(b).slice(n).join(" ");
      if (TIME.test(head) && rest && (commas === 0 || (commas === 1 && /,$/.test(split(b)[n - 1])))) {
        add("tiempo_orden", cap(rest) + " " + head.toLowerCase() + e); break;
      }
      var tail = split(b).slice(-n).join(" "), front = split(b).slice(0, -n).join(" ");
      if (TIME.test(tail) && front && commas === 0 && !/^(ieri|oggi|domani)$/i.test(core(split(b)[0]))) {
        add("tiempo_orden", cap(tail.toLowerCase()) + " " + front.charAt(0).toLowerCase() + front.slice(1) + e); break;
      }
    }
  }

  // 4. Sinónimos comunes.
  L.forEach(function (w, i) {
    var prev = L[i - 1] || "", next = L[i + 1] || "";
    var afterVerb = L.slice(i + 1, i + 4).some(function (x) { return isVerb(x) || x === "non" || CLI.test(x); });
    if (w === "ma" && (i === 0 || /,$/.test(toks[i - 1])) && afterVerb) add("sinonimo", join(put(toks, i, "però")));
    if (w === "qui") add("sinonimo", join(put(toks, i, "qua")));
    if (w === "lì") add("sinonimo", join(put(toks, i, "là")));
    if (w === "tra" && next && !/^(i|gli|le|il|lo|la)$/.test(next)) add("sinonimo", join(put(toks, i, "fra")));
    if (w === "niente") add("sinonimo", join(put(toks, i, "nulla")));
    if (w === "adesso") add("sinonimo", join(put(toks, i, "ora")));
    if (w === "adesso" && (i === 0 || i === L.length - 1) && !/^che$/.test(next)) add("sinonimo", join(put(toks, i, "in questo momento")));
    if (/^(molto|molta|molti|molte)$/.test(w) && !/\b(quanto|quanta|quanti|quante|che)\b/.test(L.slice(i + 1).join(" "))) {
      add("sinonimo", join(put(toks, i, "tant" + w.slice(-1))));
    }
    if (/^(medico|medici)$/.test(w) && /^(il|un|dal|al|del|i|dai|ai|dei|mio|suo|tuo)$/.test(prev)) add("sinonimo", join(put(toks, i, w === "medico" ? "dottore" : "dottori")));
    vf(w).filter(function (x) { return x.lemma === "comprare"; }).slice(0, 1).forEach(function (x) {
      try { add("sinonimo", join(put(toks, i, Conj.conjugate("acquistare", x.tense)[x.p].split(" ").pop()))); } catch (err) { /* */ }
    });
    if (D.participleOf(w) === "comprare") add("sinonimo", join(put(toks, i, "acquistat" + w.slice(-1))));
    if (/^piccol[oaie]$/.test(w) && (D.DATA.nouns[prev] || D.DATA.nounsByPlural[prev] || /^(è|sono|era|sei|siamo)$/.test(prev))) {
      add("sinonimo", join(put(toks, i, "piccolin" + w.slice(-1))));
    }
  });

  // 5. Cifras en lugar de números escritos (delante de un sustantivo).
  L.forEach(function (w, i) {
    var num = NUM[w];
    var next = L[i + 1] || "";
    // («Escribí los números con letras»: there the digits are the mistake, a control)
    if (num && num >= 2 && !/letras/i.test(src.prompt || "") && (D.DATA.nounsByPlural[next] || D.DATA.nouns[next]) && !/^(tutti|tutte|e)$/.test(L[i - 1] || "")) {
      add("cifras", join(put(toks, i, String(num))));
    }
    // trent'anni → 30 anni
    var el = /^(vent|trent|quarant|cinquant|sessant|settant|ottant|novant)'([a-zà-ù]+)$/.exec(w);
    if (el && !/letras/i.test(src.prompt || "")) add("cifras", join(put(toks, i, NUM[el[1] + (el[1] === "vent" ? "i" : "a")] + " " + el[2])));
  });

  // 6. Elisiones optativas.
  if (/\b(C|c)om'è\b/.test(s)) add("elision", s.replace(/\b(C|c)om'è/, "$1ome è"));
  if (/\b(D|d)ov'è\b/.test(s)) add("elision", s.replace(/\b(D|d)ov'è/, "$1ove è"));
  if (/\b(C|c)ome è\b/.test(s)) add("elision", s.replace(/\b(C|c)ome è/, "$1om'è"));
  if (/\b(D|d)ove è\b/.test(s)) add("elision", s.replace(/\b(D|d)ove è/, "$1ov'è"));
  if (/\b(Q|q)uest'/.test(s)) {
    var m = /\b(Q|q)uest'([a-zàèéìòù]+)/.exec(s), n0 = m && (D.DATA.nouns[m[2]] || D.DATA.nounsByPlural[m[2]]);
    if (n0 && n0.g) add("elision", s.replace(/\b(Q|q)uest'/, "$1uest" + (n0.g === "f" ? "a" : "o") + " "));
  }

  // 7. «A me piace», «a lui manca»: la persona con a + pronombre.
  var AME = { mi: "a me", ti: "a te", gli: "a lui", ci: "a noi", vi: "a voi" };
  if (AME[L[0]] && vf(L[1] || "").concat(vf(L[2] || "")).some(function (x) { return /^(piacere|mancare|interessare|servire|bastare)$/.test(x.lemma); }) ||
      AME[L[0]] && /^(è|sono)$/.test(L[1] || "") && /^(piaciut|mancat)/.test(L[2] || "")) {
    add("a_me", cap(AME[L[0]]) + " " + split(s).slice(1).join(" "));
  }

  // 8. El futuro para un plan con fecha (y el presente para el futuro).
  if (FUTURE.test(s) && !/[,;]/.test(body(s))) {
    var finite = [];
    L.forEach(function (w, i) { if (isVerb(w) && !D.participleOf(w) && !D.DATA.nouns[w]) finite.push(i); });
    if (finite.length === 1 && !D.participleOf(L[finite[0] + 1] || "") && L[finite[0] + 1] !== "che") {
      var i8 = finite[0], f8 = vf(L[i8]);
      var pres = f8.filter(function (x) { return x.tense === "presente"; })[0], fut = f8.filter(function (x) { return x.tense === "futuro"; })[0];
      try {
        if (pres && pres.lemma !== "essere" && pres.lemma !== "avere") add("futuro", join(put(toks, i8, Conj.conjugate(pres.lemma, "futuro")[pres.p].split(" ").pop())));
        if (fut && fut.lemma !== "essere" && fut.lemma !== "avere") add("futuro", join(put(toks, i8, Conj.conjugate(fut.lemma, "presente")[fut.p].split(" ").pop())));
      } catch (err) { /* */ }
    }
  }

  // 9. El posesivo después del sustantivo en expresiones fijas.
  if (/\bal (mio|tuo|suo|nostro|vostro) posto\b/i.test(s)) add("posesivo", s.replace(/\bal (mio|tuo|suo|nostro|vostro) posto\b/i, "al posto $1"));
  return out;
}

/* --------------------------------------------------- variantes de control */

var ESS2AV = { sono: "ho", sei: "hai", "è": "ha", siamo: "abbiamo", siete: "avete" };
var PAIRS_G = {};
(bank.nouns || []).forEach(function (n) {
  if (/o$/.test(n[0]) && n[1] === "m") PAIRS_G[n[0]] = n[0].slice(0, -1) + "a";
});
function control(src) {
  var out = [], s = src.answer, toks = split(s), L = toks.map(low);
  function add(fam, given) { if (given && given !== s) out.push({ fam: fam, given: given }); }
  // los números en letras que pide la consigna
  if (/letras/i.test(src.prompt || "")) L.forEach(function (w, i) {
    if (NUM[w] && NUM[w] >= 2 && (D.DATA.nounsByPlural[L[i + 1] || ""] || D.DATA.nouns[L[i + 1] || ""])) add("c_cifras_en_letras", join(put(toks, i, String(NUM[w]))));
  });
  // el sujeto de otra persona
  var k = L[0] === "non" ? 1 : 0;
  var fs = vf(L[k] || ""), ps = fs.map(function (x) { return x.p; });
  if (fs.length && !/!/.test(s) && ps.every(function (p) { return p === ps[0]; }) && PRON[ps[0]]) {
    var wrong = PRON[(ps[0] + 1) % 6] || "noi";
    if (ps.indexOf(PRON.indexOf(wrong)) < 0) add("c_sujeto_mal", cap(wrong) + " " + s.charAt(0).toLowerCase() + s.slice(1));
  }
  // estar a + infinitivo
  L.forEach(function (w, i) {
    if (/^(sto|stai|sta|stiamo|state|stanno|stavo|stava)$/.test(w) && /(ando|endo)$/.test(L[i + 1] || "")) {
      var g = L[i + 1], inf = g.replace(/ando$/, "are").replace(/endo$/, "ere");
      add("c_estar_a", join(put(put(toks, i + 1, "a " + inf), i, w)));
    }
    if (w === "c'è" || (w === "c'" && L[i + 1] === "è")) add("c_ci_e", s.replace(/\b(C|c)'è/, "$1i è"));
    // (a modal takes either auxiliary: non sono potuto / non ho potuto venire)
    if (ESS2AV[w] && D.participleOf(L[i + 1] || "") && /[oa]$/.test(L[i + 1]) && !/^(potut|dovut|volut)/.test(L[i + 1])) add("c_ausiliar", join(put(toks, i, ESS2AV[w])));
    if (PAIRS_G[w] && /^(il|un|mio|tuo|suo)$/.test(L[i - 1] || "") && (D.DATA.nouns[PAIRS_G[w]])) add("c_otro_sustantivo", join(put(toks, i, PAIRS_G[w])));
    if (/^(già|ancora)$/.test(w)) add("c_sinonimo_falso", join(put(toks, i, w === "già" ? "ancora" : "già")));
    if (w === "molto" && isVerb(L[i - 1] || "")) add("c_sinonimo_falso", join(put(toks, i, "troppo")));
    // el adverbio de tiempo metido entre el auxiliar y el participio
    if ((D.util.AVERE.indexOf(w) >= 0 || D.util.ESSERE.indexOf(w) >= 0) && D.participleOf(L[i + 1] || "") &&
        /^(ieri|oggi|stamattina)$/i.test(L[0]) && i > 1) {
      var t2 = toks.slice(1); t2.splice(i, 0, L[0]); t2[0] = cap(t2[0]);
      add("c_orden_mal", t2.join(" "));
    }
  });
  return out;
}

/* ------------------------------------------------------------ números */

var UNI = ["zero", "uno", "due", "tre", "quattro", "cinque", "sei", "sette", "otto", "nove", "dieci", "undici", "dodici",
           "tredici", "quattordici", "quindici", "sedici", "diciassette", "diciotto", "diciannove"];
var DEC = ["", "", "venti", "trenta", "quaranta", "cinquanta", "sessanta", "settanta", "ottanta", "novanta"];
function numWord(n) {
  if (n < 20) return UNI[n];
  if (n < 100) { var t = DEC[Math.floor(n / 10)], u = n % 10; if (u === 1 || u === 8) t = t.slice(0, -1); return t + (u === 3 ? "tré" : u ? UNI[u] : ""); }
  if (n < 1000) { var h = Math.floor(n / 100), r = n % 100; return (h > 1 ? UNI[h] : "") + "cento" + (r ? numWord(r) : ""); }
  var m = Math.floor(n / 1000), r2 = n % 1000;
  return (m > 1 ? numWord(m) + "mila" : "mille") + (r2 ? numWord(r2) : "");
}
var NUM = {};
for (var q = 2; q <= 2100; q++) NUM[numWord(q)] = q;
delete NUM.sei;   // «sei» es también «sos»: solo delante de un sustantivo, y eso lo mira valid()
NUM.sei = 6;

function main() {
  /* ------------------------------------------------------------ correr */

  var FAM = {}, samples = {}, okSamples = {};
  function tally(fam, accepted, ex) {
    var f = FAM[fam] || (FAM[fam] = { n: 0, acc: 0, notes: 0 });
    f.n++;
    if (accepted) f.acc++;
    if (ex.note) f.notes++;
    var want = /^c_/.test(fam) ? accepted : !accepted;
    if (want) (samples[fam] = samples[fam] || []).push(ex);
    else if (accepted && ex.note && (okSamples[fam] = okSamples[fam] || []).length < 3) okSamples[fam].push(ex);
  }
  var seen = {};
  SRC.forEach(function (src) {
    valid(src).concat(control(src)).forEach(function (v) {
      var key = src.id + "|" + v.given;
      if (seen[key]) return;
      seen[key] = 1;
      // a variant that is already one of the accepted answers says nothing
      if ((src.accept || []).some(function (a) { return Engine.normalise(a) === Engine.normalise(v.given); })) return;
      var j = judge(v.given, src);
      tally(v.fam, j.verdict === "giusto", { id: src.id, given: v.given, answer: src.answer, cat: j.d.cat, explain: j.d.explain,
                                            level: j.d.level, note: j.d.note });
    });
  });

  // Los números en letras que pide un ejercicio no valen en cifras.
  Object.keys(course.items).forEach(function (id) {
    var it = course.items[id];
    var m = /^(\d+)\s*→/.exec(it.stem || "");
    if (it.type !== "numbers" || !m) return;
    var j = judge(m[1], { answer: it.answer, accept: it.accept, stem: it.stem, prompt: it.prompt, week: 52, type: it.type });
    tally("c_cifras_en_letras", j.verdict === "giusto", { id: id, given: m[1], answer: it.answer, cat: j.d.cat, explain: j.d.explain });
  });

  /* Casos puntuales: los de la auditoría (C1, D1) y otros que dan la regla
     de cada equivalencia. [dado, aceptadas, ctx, "ok" | "no"] */
  var PUNT = [
    ["Non lavoro oggi.", ["Oggi non lavoro."], {}, "ok"],
    ["Però non lo so.", ["Ma non lo so."], {}, "ok"],
    ["Ho 32 anni.", ["Ho trentadue anni."], {}, "ok"],
    ["Ho 30 anni.", ["Ho trent'anni."], {}, "ok"],
    ["Vorrei acquistare una casa.", ["Vorrei comprare una casa."], {}, "ok"],
    ["Anche io.", ["Anch'io."], {}, "ok"],
    ["Che cosa faresti al posto mio?", ["Che cosa faresti al mio posto?"], {}, "ok"],
    ["Domani andrò dal medico.", ["Domani vado dal medico."], { week: 10 }, "ok"],
    ["Vado dal dottore.", ["Vado dal medico."], {}, "ok"],
    ["Io ho trentadue anni.", ["Ho trentadue anni."], {}, "ok"],
    ["Sono appena arrivata.", ["Sono appena arrivato."], {}, "ok"],
    ["Sono andata al mare.", ["Sono andato al mare."], {}, "ok"],
    ["A loro piacciono i film.", ["Gli piacciono i film."], {}, "ok"],
    ["A me piace la pizza.", ["Mi piace la pizza."], {}, "ok"],
    ["Ha detto di essere stanca.", ["Ha detto che era stanca."], {}, "ok"],
    ["Ha detto che arrivava.", ["Ha detto che sarebbe arrivata."], {}, "ok"],
    ["È molto carina.", ["È molto bella."], { stem: "Es muy linda." }, "ok"],
    ["In questo momento non posso.", ["Adesso non posso."], {}, "ok"],
    ["La casa è piccolina.", ["La casa è piccola."], {}, "ok"],
    ["Vieni anche tu?", ["Vieni pure tu?", "Vieni anche tu?"], {}, "ok"],
    ["Oggi è lunedì.", ["È lunedì oggi."], {}, "ok"],
    // controles
    ["Tu ho trentadue anni.", ["Ho trentadue anni."], {}, "no"],
    ["Sto a mangiare.", ["Sto mangiando."], {}, "no"],
    ["Ci è un problema.", ["C'è un problema."], {}, "no"],
    ["Non è rosso però blu.", ["Non è rosso ma blu."], {}, "no"],
    ["Ho ieri mangiato la pizza.", ["Ieri ho mangiato la pizza."], {}, "no"],
    ["Lei è stanco.", ["Lui è stanco."], {}, "no"],
    ["La nonno è simpatica.", ["La nonna è simpatica."], {}, "no"],
    ["Mia nonno è simpatico.", ["Mio nonno è simpatico."], {}, "no"],
    ["Conosco a Giulia.", ["Conosco Giulia."], {}, "no"],
    ["32", ["trentadue"], { stem: "32 → ___", prompt: "Escribí el número en letras, en italiano." }, "no"],
    ["Sono le 8.", ["Sono le otto."], { prompt: "Escribí la hora en italiano, con los números en letras." }, "no"],
    ["È molto larga.", ["È molto lunga."], {}, "no"],
    ["Ho già fame.", ["Ho ancora fame."], {}, "no"]
  ];
  PUNT.forEach(function (c) {
    var j = judge(c[0], { answer: c[1][0], accept: c[1], stem: c[2].stem, prompt: c[2].prompt, week: c[2].week || 52 });
    var acc = j.verdict === "giusto";
    tally(c[3] === "ok" ? "puntual" : "c_puntual", acc, { id: "p", given: c[0], answer: c[1][0], cat: j.d.cat, explain: j.d.explain, level: j.d.level, note: j.d.note });
    ok(acc === (c[3] === "ok"), "puntual: «" + c[0] + "» " + (c[3] === "ok" ? "rechazada" : "aceptada") + " (" + (j.d.cat || j.d.level) + ": " + (j.d.explain || j.d.note || "") + ")");
    // lo aceptable llega con su nota y la versión más natural
    if (acc && c[3] === "ok" && j.d.level && j.d.level !== "correcto") ok(j.d.note && j.d.natural, "puntual: «" + c[0] + "» aceptada sin nota");
  });

  /* Coherencia entre correctores (P7): la misma forma recibe el mismo nivel
     en las respuestas cerradas y en Scrivi.  Lo correcto o aceptable en una
     respuesta cerrada no se marca como error en un texto libre, y lo
     incorrecto se marca en los dos. [texto, respuesta modelo, semana, nivel] */
  var S = ctx.Scrivi;
  S.learnCourse({ items: course.items, bank: bank, phrases: ctx.Frasi.ALL, readings: ctx.Letture.EPISODI,
                  glossario: pack.data("it", "glossario.json") });
  [["Però non lo so.", "Ma non lo so.", 20, "ok"],
   ["Io ho trentadue anni.", "Ho trentadue anni.", 7, "ok"],
   ["Vieni qua, per favore.", "Vieni qui, per favore.", 12, "ok"],
   ["Anche io vengo alla festa.", "Anch'io vengo alla festa.", 12, "ok"],
   ["Non lavoro oggi.", "Oggi non lavoro.", 10, "ok"],
   ["Ho 32 anni.", "Ho trentadue anni.", 7, "ok"],
   ["A me piace la pizza.", "Mi piace la pizza.", 14, "ok"],
   ["Sono stanca.", "Sono stanco.", 5, "ok"],
   ["Ieri ho andato al cinema.", "Ieri sono andato al cinema.", 11, "no"],
   ["Ho conosciuto a Giulia in vacanza.", "Ho conosciuto Giulia in vacanza.", 11, "no"],
   ["Penso che è troppo tardi.", "Penso che sia troppo tardi.", 30, "no"],
   ["C'è due gatti in giardino.", "Ci sono due gatti in giardino.", 9, "no"],
   ["Mai vado in piscina.", "Non vado mai in piscina.", 18, "no"],
   ["Il mio padre lavora in banca.", "Mio padre lavora in banca.", 17, "no"]
  ].forEach(function (c) {
    var j = judge(c[0], { answer: c[1], accept: [c[1]], week: c[2] });
    var hard = S.lint(c[0], c[2]).filter(function (x) { return !x.soft; });
    var closedOk = j.verdict === "giusto", scriviOk = !hard.length;
    ok(closedOk === scriviOk && closedOk === (c[3] === "ok"), "coherencia: «" + c[0] + "» cerrada " + (j.d.level || j.verdict) +
       ", Scrivi " + (hard.length ? "marca " + hard.map(function (x) { return x.cat; }).join(",") : "no marca") + " (esperado " + c[3] + ")");
  });

  /* ------------------------------------------------------------ informe */

  var totV = 0, rejV = 0, totC = 0, accC = 0;
  console.log("variantes válidas (rechazadas / total):");
  Object.keys(FAM).sort().forEach(function (k) {
    var f = FAM[k];
    var ctl = /^c_/.test(k);
    if (ctl) { totC += f.n; accC += f.acc; } else { totV += f.n; rejV += f.n - f.acc; }
    console.log("  " + (k + "                      ").slice(0, 22) + (ctl ? "aceptadas " + f.acc : "rechazadas " + (f.n - f.acc)) + "/" + f.n +
      (ctl ? "" : " (" + Math.round((f.n - f.acc) / f.n * 100) + " %, con nota " + f.notes + ")"));
    if (verbose && okSamples[k]) okSamples[k].forEach(function (x) { console.log("      ✓ «" + x.given + "» [" + x.level + "] " + x.note); });
    if (verbose && samples[k]) samples[k].slice(0, 8).forEach(function (x) {
      console.log("      «" + x.given + "» → «" + x.answer + "» " + (x.cat || x.level || "") + ": " + (x.explain || x.note || ""));
    });
    // each family on its own: at most one valid answer in ten rejected
    if (!ctl && f.n >= 10) ok((f.n - f.acc) / f.n < 0.1, "familia " + k + ": rechaza " + (f.n - f.acc) + "/" + f.n);
  });
  var rate = rejV / totV;
  console.log("total: " + rejV + "/" + totV + " válidas rechazadas (" + (rate * 100).toFixed(1) + " %); controles aceptados " + accC + "/" + totC);
  ok(rate < 0.05, "variantes válidas rechazadas: " + (rate * 100).toFixed(1) + " % (tope 5 %)");
  ok(accC / totC <= 0.02, "variantes incorrectas aceptadas: " + accC + "/" + totC + " (tope 2 %)");

  console.log("\ncontroles: " + checks + "   errores: " + fails);
  process.exit(fails ? 1 : 0);

}

// diag_review.js usa las mismas variantes (familias valida_rechazada y control_aceptado).
module.exports = { SRC: SRC, valid: valid, control: control };
if (require.main === module) main();
