/*
 * Revisión del diagnóstico del portugués a escala: toma las respuestas del
 * curso (las 52 semanas), del banco y de las frases, les inyecta los errores
 * que comete un hispanohablante en portugués de Brasil y junta lo que el
 * diagnóstico diría (pista, explicación, etiqueta, diff) tal como lo muestra
 * la app (Devolucion.tidy con la semana del ítem; far() descarta lo que no
 * se parece).  Después marca las familias de devolución mala que se pueden
 * detectar solas (texto roto, restos del italiano, pista que revela,
 * metalenguaje antes de su semana, tipeo para lo que es gramática, diff que
 * no marca la palabra cambiada, variante correcta rechazada…).
 *
 *   node tools/pt/diag_review.js            resumen: casos, familias, cruces
 *   node tools/pt/diag_review.js --sample   además, una muestra de cada cruce
 *                                           (error inyectado → categoría)
 *   node tools/pt/diag_review.js --flag X   los casos de la familia X
 *   node tools/pt/diag_review.js --kind K --cat C   los casos de un cruce
 *   node tools/pt/diag_review.js --json out.json    todo, para leer aparte
 *   node tools/pt/diag_review.js --diag vieja.js    con otra versión de diagnosi.js
 */
"use strict";
var fs = require("fs");
var pack = require("../lib/pack.js");
var ctx = pack("pt");
var args = process.argv.slice(2);
function arg(k) { var i = args.indexOf(k); return i >= 0 ? args[i + 1] : null; }
var D = ctx.Diagnosi, DV = ctx.Devolucion, Conj = ctx.Conj;
var bank = pack.data("pt", "bank.json");
if (ctx.Banca) ctx.Banca.load(bank); else D.init(bank);
// --diag otro/diagnosi.js: los mismos casos (armados con el diagnóstico de
// docs/) juzgados por otra versión, para comparar el antes y el después.
var DJ = D;
if (arg("--diag")) {
  var alt = { window: null, console: console };
  alt.window = alt; alt.Conj = Conj;
  var vm = require("vm");
  vm.createContext(alt);
  vm.runInContext(fs.readFileSync(arg("--diag"), "utf8"), alt, { filename: arg("--diag") });
  DJ = alt.Diagnosi;
  DJ.init(bank);
}
var course = pack.data("pt", "course.json");

/* ------------------------------------------------------ los errores */

// Palabra portuguesa → la española que se cuela (la misma idea, en castellano).
var ES = {
  "não": "no", muito: "muy", muita: "mucha", muitos: "muchos", muitas: "muchas", "também": "también", "então": "entonces",
  agora: "ahora", sempre: "siempre", "até": "hasta", mas: "pero", depois: "después", hoje: "hoy", ontem: "ayer", "amanhã": "mañana",
  "ninguém": "nadie", com: "con", sem: "sin", onde: "donde", quando: "cuando", tenho: "tengo", tem: "tiene", temos: "tenemos",
  quero: "quiero", quer: "quiere", "são": "son", sou: "soy", estou: "estoy", "está": "está", eu: "yo", ela: "ella", eles: "ellos",
  "você": "usted", "vocês": "ustedes", meu: "mi", minha: "mi", "há": "hay", faz: "hace", fazer: "hacer", fiz: "hice", "posso": "puedo",
  pode: "puede", "vou": "voy", vai: "va", "vão": "van", falar: "hablar", fala: "habla", falo: "hablo", trabalho: "trabajo",
  trabalhar: "trabajar", cidade: "ciudad", rua: "calle", praia: "playa", leite: "leche", "pão": "pan", "água": "agua",
  mulher: "mujer", homem: "hombre", filho: "hijo", filha: "hija", "irmão": "hermano", "mãe": "madre", ano: "año", anos: "años",
  noite: "noche", dia: "día", coisa: "cosa", nada: "nada", tudo: "todo", "bem": "bien", bom: "bueno", boa: "buena", novo: "nuevo",
  velho: "viejo", "pequeno": "pequeño", "obrigado": "gracias", depois_: "luego", ainda: "todavía", "já": "ya", assim: "así",
  talvez: "quizás", quase: "casi", enquanto: "mientras", embora: "aunque", porque: "porque", "também_": "también",
  "dinheiro": "dinero", cachorro: "perro", "janela": "ventana", cadeira: "silla", "livro": "libro", "gente": "gente",
  "escola": "escuela", "professor": "maestro", "chamo": "llamo", "chama": "llama", "chegar": "llegar", "chegou": "llegó",
  "levar": "llevar", "chuva": "lluvia", chove: "llueve", "olho": "ojo", "cabeça": "cabeza", "mão": "mano", "coração": "corazón",
  "canção": "canción", "verdade": "verdad", liberdade: "libertad", "sonho": "sueño", "senhor": "señor", "senhora": "señora",
  "de novo": null, "gosto": "gusto", "preciso": "necesito", precisa: "necesita", "conheço": "conozco", "saio": "salgo",
  "venho": "vengo", "vem": "viene", "digo": "digo", "disse": "dijo", "fui": "fui", "foi": "fue", "estava": "estaba",
  "tinha": "tenía", "era": "era", "morava": "vivía", "moro": "vivo", "falava": "hablaba", "trabalhava": "trabajaba"
};
// Heterosemánticos: la palabra portuguesa que el hispanohablante elige por el español.
var FALSE = {
  gostoso: "exquisito", gostosa: "exquisita", delicioso: "exquisito", deliciosa: "exquisita", "bêbado": "borracho", "bêbada": "borracha",
  "pó": "polvo", "escritório": "oficina", sobrenome: "apelido", comprido: "largo", comprida: "larga", longo: "largo", longa: "larga",
  jantar: "cena", azeite: "aceite", copo: "vaso", fila: "cola", gorjeta: "propina", assinatura: "firma", molho: "salsa",
  romance: "novela", vermelho: "roxo", vermelha: "roxa", pular: "brincar", "grávida": "embaraçada", tampa: "tapa",
  responder: "contestar", respondi: "contestei", consertar: "reparar", lembrar: "acordar", lembro: "acordo", depois: "logo",
  "presunto": null, careca: "pelado", "estranho": "raro", "namorado": "novio", "namorada": "novia", "pai": "padre", "ruim": "mala", "má": "mala"
};
// Artículo y su opuesto de género.
var ART_FLIP = { o: "a", a: "o", os: "as", as: "os", um: "uma", uma: "um", no: "na", na: "no", do: "da", da: "do", ao: "à", "à": "ao",
                 nos: "nas", nas: "nos", dos: "das", das: "dos", pelo: "pela", pela: "pelo", num: "numa", numa: "num" };
var SPLIT = { no: "em o", na: "em a", nos: "em os", nas: "em as", do: "de o", da: "de a", dos: "de os", das: "de as", ao: "a o", aos: "a os",
              pelo: "por o", pela: "por a", pelos: "por os", pelas: "por as", dele: "de ele", dela: "de ela", deles: "de eles", delas: "de elas",
              neste: "em este", nesta: "em esta", nesse: "em esse", nessa: "em essa", nisso: "em isso", disso: "de isso",
              num: "em um", numa: "em uma", "à": "a a", "às": "a as", daqui: "de aqui" };
var ESCONTR = { no: "en el", na: "en la", do: "del", da: "de la", ao: "al", "à": "a la", pelo: "por el", pela: "por la", nos: "en los", nas: "en las" };
var SER_ESTAR = { "é": "está", "está": "é", sou: "estou", estou: "sou", "são": "estão", "estão": "são", era: "estava", estava: "era",
                  foi: "esteve", esteve: "foi", "fica": "está", ficou: "esteve", somos: "estamos", estamos: "somos" };

function cap(like, w) { return /^[A-ZÀ-Ý]/.test(like) ? w.charAt(0).toUpperCase() + w.slice(1) : w; }
function core(t) { return t.replace(/^[«»"“”¿¡(\[—–-]+|[.,;:!?«»"“”()\]…—–]+$/g, ""); }
function strip(s) { return s.normalize("NFD").replace(/[̀-ͯ]/g, "").normalize("NFC"); }

/* The mutations of one answer: [{bad, kind, from, to}] (from/to: the word
   changed, for the diff check). */
function mutate(sentence, opts) {
  opts = opts || {};
  var toks = String(sentence).split(/\s+/).filter(Boolean), out = [];
  function put(i, repl, kind, span) {
    var copy = toks.slice(), w = core(toks[i]);
    copy[i] = toks[i].replace(w, cap(w, repl));
    if (span) copy.splice(i + 1, span);
    out.push({ bad: copy.join(" ").replace(/\s+/g, " ").trim(), kind: kind, from: w.toLowerCase(), to: repl.toLowerCase() });
  }
  toks.forEach(function (t, i) {
    var w = core(t), low = w.toLowerCase(), next = core(toks[i + 1] || "").toLowerCase(), prev = core(toks[i - 1] || "").toLowerCase();
    if (!w) return;
    if (ES[low] && ES[low] !== low) put(i, ES[low], low === "muito" || /^muit/.test(low) ? "muy" : "es_word");
    if (FALSE[low]) put(i, FALSE[low], "falso_amigo");
    if (/nh/.test(low)) put(i, low.replace(/nh/g, "ñ"), "nh_ll");
    if (/lh/.test(low)) put(i, low.replace(/lh/g, "ll"), "nh_ll");
    if (/ção$/.test(low)) put(i, low.replace(/ção$/, "ción"), "cion");
    if (/ções$/.test(low)) put(i, low.replace(/ções$/, "ciones"), "cion");
    if (/dade$/.test(low) && low.length > 5) put(i, low.replace(/dade$/, "dad"), "cion");
    if (/vel$/.test(low) && low.length > 5) put(i, low.replace(/vel$/, "ble"), "cion");
    if (/agem$/.test(low)) put(i, low.replace(/agem$/, "aje"), "cion");
    if (/[áéíóúâêô]/.test(low) && !/^(à|às)$/.test(low)) put(i, low.normalize("NFD").replace(/[́̂]/g, "").normalize("NFC"), "accent");
    if (/[ãõ]/.test(low)) put(i, low.normalize("NFD").replace(/̃/g, "").normalize("NFC"), "til");
    if (low === "avó") put(i, "avô", "accent");
    if (low === "avô") put(i, "avó", "accent");
    if (low === "e" && i > 0) put(i, "é", "accent");
    if (SPLIT[low] && next) put(i, SPLIT[low], /^à/.test(low) ? "crase" : "uncontr");
    if (ESCONTR[low] && next) put(i, ESCONTR[low], "es_contr");
    if (/^(à|às)$/.test(low) && next) put(i, low === "à" ? "a" : "as", "crase");
    if (ART_FLIP[low] && next && /^[a-zà-ÿ]/.test(next) && !/^(o|a|os|as)$/.test(prev)) {
      var nextIsNoun = D.DATA.nouns[next] || D.DATA.nounsByPlural[next];
      if (nextIsNoun) put(i, ART_FLIP[low], "gender");
    }
    if (SER_ESTAR[low]) put(i, SER_ESTAR[low], "ser_estar");
    // plurals
    if (/ões$/.test(low)) { put(i, low.replace(/ões$/, "ãos"), "plural"); put(i, low.replace(/ões$/, "ones"), "plural"); }
    if (/ães$/.test(low)) put(i, low.replace(/ães$/, "ões"), "plural");
    if (/[aeo]is$/.test(low) && D.DATA.nounsByPlural[low]) put(i, low.replace(/is$/, "les"), "plural");
    if (/ns$/.test(low) && D.DATA.nounsByPlural[low]) put(i, low.replace(/ns$/, "nes"), "plural");
    // verbs: person, tense, infinitive
    var forms = D.verbForms(low);
    // after an article or a determiner the word is a noun (o Rio, um passeio), not a verb
    var afterDet = /^(o|a|os|as|um|uma|uns|umas|do|da|dos|das|no|na|nos|nas|ao|à|pelo|pela|meu|minha|seu|sua|nosso|nossa|este|esta|esse|essa|aquele|aquela)$/.test(prev);
    if (forms.length && low.length > 1 && !opts.noVerb && !afterDet && !D.util.prepInfo(low)) {
      var f = forms[0];
      var conj = function (tense) {
        try { return Conj.conjugate(f.lemma, tense).map(function (x) { return String(x).split(/\s+/).pop().split("/")[0]; }); } catch (e) { return null; }
      };
      var same = conj(f.tense);
      if (same) {
        var op = f.p === 2 ? 1 : f.p === 5 ? 3 : f.p === 0 ? 2 : f.p === 3 ? 5 : null;
        if (op != null && same[op] && same[op] !== low && !/-/.test(same[op])) put(i, same[op], "person");
        if (f.p === 2 && /\b(a gente)$/i.test(toks.slice(0, i).join(" ").replace(/[.,]/g, "")) && same[3]) put(i, same[3], "person_agente");
      }
      var swapT = { perfeito: "imperfeito", imperfeito: "perfeito", subjFuturo: "presente", subjPresente: "presente", infPessoal: null,
                    subjImperfeito: "condicional", condicional: "futuro", futuro: "condicional" }[f.tense];
      var st = swapT && conj(swapT);
      if (st && st[f.p] && st[f.p] !== low && !/-/.test(st[f.p])) put(i, st[f.p], "tense_" + f.tense);
      if (f.tense === "subjFuturo" || f.tense === "infPessoal" || f.tense === "subjPresente" || (f.tense === "presente" && i > 0 && f.p !== 0)) {
        var inf = f.lemma.replace(/-se$/, "");
        if (inf !== low) put(i, inf, "infinitive");
      }
    }
    // ter / haver
    if (low === "há" && i === 0) put(i, "hay", "haver");
    if (low === "havia") put(i, "había", "haver");
    // clitics: Spanish lo/la
    if (/^(o|a|os|as)$/.test(low) && next && D.verbForms(next).length && !(D.DATA.nouns[next])) put(i, { o: "lo", a: "la", os: "los", as: "las" }[low], "clitic_es");
    // Brazilian proclisis → enclisis (me dá → dá-me)
    if (/^(me|te|se|nos|lhe)$/.test(low) && next && D.verbForms(next).length && i + 1 < toks.length) {
      var copy2 = toks.slice(), nx = core(toks[i + 1]);
      copy2[i + 1] = toks[i + 1].replace(nx, nx + "-" + low);
      copy2.splice(i, 1);
      out.push({ bad: copy2.join(" "), kind: "enclisis", from: low, to: nx.toLowerCase() + "-" + low });
    }
    // article before a possessive: add or drop (Brazilian free variant)
    if (/^(meu|minha|meus|minhas|nosso|nossa|seu|sua)$/.test(low) && !/^(o|a|os|as|do|da|no|na|ao|à|dos|das|nos|nas|um|uma)$/.test(prev)) {
      var art = { meu: "o", nosso: "o", seu: "o", minha: "a", nossa: "a", sua: "a", meus: "os", minhas: "as" }[low];
      var c3 = toks.slice(); c3[i] = cap(toks[i], art) + " " + toks[i].toLowerCase();
      if (/^[A-ZÀ-Ý]/.test(toks[i])) c3[i] = cap(toks[i], art) + " " + toks[i].charAt(0).toLowerCase() + toks[i].slice(1); else c3[i] = art + " " + toks[i];
      out.push({ bad: c3.join(" "), kind: "poss_art_add", ok: true });
    }
    if (/^(o|a|os|as)$/.test(low) && /^(meu|minha|meus|minhas|nosso|nossa)$/.test(next) && !/^(de|em|por|a)$/.test(prev)) {
      var c4 = toks.slice(); c4.splice(i, 1);
      if (i === 0 && c4[0]) c4[0] = c4[0].charAt(0).toUpperCase() + c4[0].slice(1);
      out.push({ bad: c4.join(" "), kind: "poss_art_drop", ok: true });
    }
    // a personal
    if (/^(o|a)$/.test(low) && i > 0 && /^[A-ZÀ-Ý]/.test(core(toks[i + 1] || "")) && D.verbForms(prev).length) put(i, low === "o" ? "ao" : "à", "a_personal");
    // gostar sin de
    if (/^gost/.test(low) && /^(de|do|da|dos|das)$/.test(next)) {
      var c5 = toks.slice(); c5[i + 1] = { de: "", do: "o", da: "a", dos: "os", das: "as" }[next];
      out.push({ bad: c5.join(" ").replace(/\s+/g, " "), kind: "gostar", from: next, to: c5[i + 1] });
    }
    // typos: a letter dropped, two swapped
    if (/^[a-zà-ÿ]{6,}$/i.test(w) && out.length % 3 === 0) {
      var k = Math.floor(w.length / 2);
      put(i, (w.slice(0, k) + w.slice(k + 1)).toLowerCase(), "typo");
      put(i, (w.slice(0, k) + w.charAt(k + 1) + w.charAt(k) + w.slice(k + 2)).toLowerCase(), "typo");
    }
  });
  // word order: two neighbours swapped
  if (toks.length >= 3 && toks.length <= 10) {
    var j = Math.floor(toks.length / 2) - 1, c6 = toks.map(core);
    var tmp = c6[j]; c6[j] = c6[j + 1]; c6[j + 1] = tmp;
    if (c6[j].toLowerCase() !== c6[j + 1].toLowerCase()) out.push({ bad: c6.join(" "), kind: "order" });
  }
  return out;
}

/* ------------------------------------------------ las fuentes */

var CASES = [];
function add(src, id, week, given, accept, dctx, kind, extra) {
  CASES.push({ src: src, id: id, week: week, given: given, accept: accept, ctx: dctx, kind: kind, x: extra || {} });
}

var WRITTEN = /^(cloze|typed|translate|garden|combina)$/;
course.items.forEach(function (it) {
  var week = it.w || it.wk || 52;
  var accept = (it.accept && it.accept.length ? it.accept : [it.answer]).map(function (x) { return String(x).replace(/\s*\|\s*/g, " "); });
  var dctx = { stem: it.stem, prompt: it.prompt, nominal: /plural/i.test(it.prompt || ""), week: week };
  if (WRITTEN.test(it.type)) {
    // cloze with several blanks: typed one after the other
    var base = String(it.answer).replace(/\s*\|\s*/g, " ");
    mutate(base).forEach(function (m) { add("curso", it.id, week, m.bad, accept, dctx, m.kind, m); });
    if (it.type === "translate") add("curso", it.id, week, it.stem, accept, dctx, "stem_copy");
    if (it.type === "garden" && it.trap) add("curso", it.id, week, it.trap, accept, dctx, "garden_trap");
    // every accepted answer must be accepted
    accept.forEach(function (a) { add("curso", it.id, week, a, accept, dctx, "accepted", { ok: true }); });
  }
  if (it.type === "fixerr" && it.good) {
    var goods = [it.good].concat(it.goodAlt || []);
    // «encontrá el error» pide la norma escrita: el habla es error ahí (registro formal)
    add("curso-fixerr", it.id, week, it.bad, goods, { registro: "formal" }, "fixerr_" + (it.cat || "?"));
    add("curso-fixerr", it.id, week, it.stem, it.accept || [it.answer], { registro: "formal" }, "fixerr_" + (it.cat || "?"));
  }
  if (it.type === "choice" && it.options) {
    it.options.forEach(function (o) {
      if (o === it.answer) return;
      add("curso-choice", it.id, week, o, [it.answer], { stem: it.stem, nominal: /plural/i.test(it.prompt || ""), week: week }, "choice", { choice: true });
    });
  }
});
bank.sentences.forEach(function (s, i) {
  var v = s.pt || s.it, week = s.w || 52;
  mutate(v[0]).forEach(function (m) { add("banco", "s" + i, week, m.bad, v, { stem: s.es, week: week }, m.kind, m); });
  add("banco", "s" + i, week, s.es, v, { stem: s.es, week: week }, "stem_copy");
});
bank.errors.forEach(function (e, i) {
  add("banco-err", "e" + i, e.w || 52, e.wrong, [e.right], { week: e.w || 52, registro: "formal" }, "bankerr_" + e.cat);
});
var Fr = ctx.Frasi;
Fr.ALL.forEach(function (f) {
  var week = f.week || 1;
  mutate(f.it).forEach(function (m) { add("frases", f.id, week, m.bad, [f.it], { stem: f.es, week: week }, m.kind, m); });
  var g = null;
  var seed = f.id.length * 7 + 3;
  var rnd = function () { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
  try { g = Fr.guessItem(f, rnd); } catch (e) { g = null; }
  if (g) g.options.forEach(function (o) {
    if (o === g.answer || (g.why && g.why[o])) return;
    add("frases-guess", f.id, week, o, [g.answer], { week: week }, "choice", { choice: true });
  });
});

/* ------------------------------------------------ el diagnóstico, como en la app */

var EXPECT = {
  es_word: /^(espanol|muito|gostar|nasal|ortografia|pronome|persona|contraccion|lexico|falso_amigo|tilde)$/,
  muy: /^(muito)$/, falso_amigo: /^(falso_amigo|espanol|lexico)$/, nh_ll: /^(espanol|ortografia)$/,
  cion: /^(espanol|ortografia)$/, accent: /^(tilde|ortografia|nasal|persona|tempo)$/, til: /^(nasal|tilde|persona|tempo)$/,
  uncontr: /^(contraccion)$/, es_contr: /^(contraccion|espanol|crase)$/, crase: /^(crase)$/, gender: /^(genero|concordancia|articulo)$/,
  ser_estar: /^(ser_estar)$/, plural: /^(plural|ortografia)$/, person: /^(persona|gostar|inf_pessoal|participio|concordancia)$/, person_agente: /^(persona)$/,
  infinitive: /^(persona|futuro_subj|inf_pessoal|subjuntivo|tempo)$/, haver: /^(espanol|tilde)$/, clitic_es: /^(pronome|espanol)$/,
  a_personal: /^(a_personal|crase|preposicion)$/, gostar: /^(gostar)$/, typo: /^(tipeo|ortografia|tilde)$/, order: /^(orden|colocacao)$/,
  stem_copy: /^(espanol)$/, tense_perfeito: /^(tempo)$/, tense_imperfeito: /^(tempo)$/, tense_subjFuturo: /^(futuro_subj|persona|inf_pessoal)$/,
  tense_subjPresente: /^(subjuntivo)$/, tense_subjImperfeito: /^(subjuntivo)$/, tense_condicional: /^(tempo|subjuntivo)$/, tense_futuro: /^(tempo)$/
};
var GRAMMAR_KIND = /^(uncontr|es_contr|crase|gender|ser_estar|plural|person|person_agente|infinitive|clitic_es|a_personal|gostar|tense_|muy|es_word|falso_amigo)/;
var G = D.GROUPS;

// The term → week the course teaches it (course.json weeks).
var META = [
  [/infinitivo pessoal/i, 29], [/\bimperfeito\b/i, 15], [/perfeito composto/i, 21], [/mais-que-perfeito/i, 21],
  [/(ênclise|próclise)/i, 16], [/mesóclise/i, 17], [/heterogen/i, 45], [/futuro do/i, 17], [/\bperfeito\b/i, 11],
  [/\bcrase\b/i, 3], [/subjuntivo futuro|futuro do subjuntivo/i, 27]
];
var ITAL = /\b(congiuntivo|passato|prossimo|articolo|preposizione|articolata|italiano|italiana|doppia|doppie|essere|avere|della|degli|nello|sono|perché|però|anche|questo|quello|lezione|parola|parole|sbagliat|giusto|quasi|tu hai|lui|lei|voi|loro|il\s|gli\s|è\s)\b/i;
var TUTEO = /(?<!\b(se|lo|la|le|que|no) )\b(tienes|puedes|sabes|debes|quieres|escribes|eres|estás seguro|mira|fíjate|revisa|escribe|piensa|recuerda|pon)(?![\p{L}])/iu;

/* Las plantillas vacías (C3): dicen qué va, no por qué.  Y la mención del
   español o de su glosa (C5), en las categorías que el español no tiene o
   tiene de otro modo. */
var EMPTY = /^(Acá va \*[^*]+\*( \(«[^»]*»\))?\.|Acá va la preposición \*[^*]+\*( \([^)]*\))?\.|Sobra \*[^*]+\*\.|El orden es: .*|Falta \*[^*]+\*( \(= [^)]*\))?( (antes|después) de \*[^*]+\*)?\.|Acá no va artículo: sobra \*[^*]+\*\.|\*[^*]+\* es el plural; acá va el singular \*[^*]+\*\.|\*[^*]+\* = \*[^*]+\*\.|Acá va \*[^*]+\* sin artículo\.|La tilde va así: \*[^*]+\*\.)$/;
var CONTRAST_CATS = /^(crase|colocacao|futuro_subj|inf_pessoal|contraccion|orden|ortografia)$/;
var ES_MENTION = /español|castellano|«[^»]+»|como en |a diferencia/i;

function view(c) {
  var d;
  try {
    d = c.x.choice ? DJ.explainChoice(c.given, c.accept[0], c.ctx) : DJ.diagnose(c.given, c.accept, c.ctx);
  } catch (e) { return { crash: String(e.stack).split("\n").slice(0, 3).join(" | ") }; }
  if (!d) return { verdict: "giusto" };
  if (DV) DV.tidy(d, c.ctx.week || 52);
  var far = d.verdict !== "giusto" && d.cat !== "vuoto" && DV && DV.far(c.given, c.accept, d);
  return { d: d, verdict: d.verdict, cat: d.cat, far: far };
}

function flags(c, v) {
  var out = [];
  if (v.crash) return ["crash"];
  var d = v.d;
  // a mutation that happens to be an accepted answer is not an error
  if (!c.x.choice && c.accept.some(function (a) { return D.tokens(a).join(" ") === D.tokens(c.given).join(" "); })) c = Object.assign({}, c, { x: Object.assign({}, c.x, { ok: true }) });
  var okKind = c.x.ok || c.kind === "accepted" || /^poss_art/.test(c.kind) || c.kind === "enclisis";
  if (okKind) { if (v.verdict !== "giusto" && !(c.kind === "enclisis" && v.verdict === "quasi")) out.push("rechaza_variante"); return out; }
  if (!d || v.verdict === "giusto") {
    if (!/^(order|typo|accent)$/.test(c.kind)) out.push("no_visto");
    return out;
  }
  if (v.far) { out.push("lejos"); return out; }
  var txt = (d.hint || "") + " ¶ " + (d.explain || "") + " ¶ " + (d.label || "");
  if (/\*\s*\*|undefined|NaN|\[object|\bnull\b/.test(txt)) out.push("roto");
  if (!d.hint || !d.explain) out.push("sin_texto");
  if (ITAL.test(txt.replace(/\*[^*]*\*/g, " "))) out.push("italiano");
  if (TUTEO.test(txt.replace(/\*[^*]*\*/g, " "))) out.push("tuteo");
  var dup = /(^|[^\p{L}])(\p{L}{2,}) \2(?=[^\p{L}]|$)/iu.exec(txt.replace(/\*/g, ""));
  if (dup && !/^(que|se|nos|a|o|es)$/i.test(dup[2]) && !new RegExp("\\*" + dup[2] + "\\* " + dup[2], "i").test(txt)) out.push("palabra_doble");
  // the hint gives the answer away
  var fixW = (d.fixed || []).filter(function (t) { return t.fix; }).map(function (t) { return t.w; });
  var gW = (d.given || []).map(function (t) { return t.w; });
  fixW.forEach(function (w) {
    if (w.length >= 2 && gW.indexOf(w) < 0 && (d.hint || "").toLowerCase().indexOf("*" + w + "*") >= 0) out.push("pista_revela");
  });
  // metalanguage before its week
  var wk = c.ctx.week || 52;
  META.forEach(function (m) {
    if (wk < m[1] && m[0].test(txt.replace(/\*[^*]*\*/g, " "))) out.push("meta_temprano");
  });
  // category that does not match the injected error
  var exp = EXPECT[c.kind];
  if (exp && !exp.test(d.cat)) out.push("cat_distinta");
  if (d.cat === "tipeo" && GRAMMAR_KIND.test(c.kind)) out.push("tipeo_por_gramatica");
  if (c.kind === "typo" && d.cat && !/^(tipeo|ortografia|tilde|nasal|lexico|faltante|sobrante)$/.test(d.cat)) out.push("gramatica_por_tipeo");
  // the diff marks the changed word
  if (c.x.from && c.x.to && d.given && c.x.to.indexOf(" ") < 0) {
    var marked = d.given.filter(function (t) { return t.bad; }).map(function (t) { return t.w; });
    if (marked.length && marked.indexOf(c.x.to) < 0 && !marked.some(function (m) { return m.indexOf(c.x.to) >= 0 || c.x.to.indexOf(m) >= 0; })) out.push("diff_otro");
    if (!marked.length && !G.generic[d.cat]) out.push("diff_vacio");
  }
  // explanation without the rule: only «Acá va *x*.»
  if (/^Acá va \*[^*]+\*\.?$/.test(String(d.explain).trim()) && !G.generic[d.cat]) out.push("sin_regla");
  // C3/C11: la explicación vacía (dice qué, no por qué), en todas las categorías menos el tipeo
  if (d.cat !== "tipeo" && EMPTY.test(String(d.explain || "").trim())) out.push("vacia");
  // C5: sin contraste con el español donde el español no lo tiene o lo tiene de otro modo
  if (CONTRAST_CATS.test(d.cat || "") && !ES_MENTION.test(String(d.explain || ""))) out.push("sin_contraste");
  if (/^Error de tipeo/.test(d.explain) && c.kind !== "typo" && GRAMMAR_KIND.test(c.kind)) out.push("tipeo_por_gramatica");
  return out.filter(function (x, i, a) { return a.indexOf(x) === i; });
}

/* Las familias de devolución mala que ya se encontraron (y se arreglaron):
   cada una, un detector sobre el caso y lo que dijo el diagnóstico.  Sirven
   para comparar versiones (--diag) y para que no vuelvan. */
var U = D.util;
function fixedW(d) { return (d.fixed || []).filter(function (t) { return t.fix; }).map(function (t) { return t.w; }); }
function givenW(d) { return (d.given || []).filter(function (t) { return t.bad; }).map(function (t) { return t.w; }); }
var FAMS = {
  // «vou viajo» → futuro do subjuntivo, cuando es el infinitivo después de un verbo o preposición
  infinitivo_como_fut_subj: function (c, d) {
    if (d.cat !== "futuro_subj") return false;
    var e = D.tokens(d.target || ""), f = fixedW(d)[0], i = e.indexOf(f);
    if (!f || !U.isInfinitive(f) || i < 1) return false;
    var p = e[i - 1];
    return !!(U.PREP_BASE[p] || U.CONTR[p] || (D.verbForms(p).length && !/^(quando|se)$/.test(p))) && !/(quando|se|assim que|enquanto|caso|onde|quem) \S+ ?$/.test(e.slice(Math.max(0, i - 3), i).join(" ") + " ");
  },
  // un tipeo en un verbo irregular (estve) explicado como verbo irregular
  tipeo_como_irregular: function (c, d) { return c.kind === "typo" && d.cat === "verbo_irregular"; },
  // «Falta la tilde: *x*.» / «La tilde va así» sin la regla
  tilde_sin_regla: function (c, d) { return d.cat === "tilde" && /^(Falta la tilde: \*[^*]+\*\.|La tilde va así: \*[^*]+\*\.)$/.test(d.explain || ""); },
  // «años» como si fuera una tilde
  ene_como_tilde: function (c, d) { return d.cat === "tilde" && givenW(d).some(function (w) { return /ñ/.test(w); }); },
  // «ao» / «do» por el artículo solo, como tipeo
  preposicion_como_tipeo: function (c, d) { return d.cat === "tipeo" && givenW(d).some(function (w) { return /^(ao|aos|à|às|do|da|dos|das|no|na|nos|nas|pelo|pela)$/.test(w); }); },
  // una sola palabra en español tratada como «Mezcla español y portugués»
  mezcla_por_una_palabra: function (c, d) { return /^Hay español mezclado: \*[^*]+\*\. /.test(d.hint || ""); },
  // la misma palabra con otra terminación (fechas / fecha, jornals / jornais) como falso amigo
  falso_amigo_misma_palabra: function (c, d) {
    if (d.cat !== "falso_amigo") return false;
    var g = givenW(d)[0] || "", f = fixedW(d)[0] || "";
    return g && f && U.deaccent(g).slice(0, 4) === U.deaccent(f).slice(0, 4) && U.editDistance(U.deaccent(g), U.deaccent(f)) <= 2;
  },
  // la consigna en español copiada y no reconocida como tal
  copia_no_reconocida: function (c, d) { return c.kind === "stem_copy" && d.cat !== "espanol" && d.verdict !== "giusto"; },
  // «Vou a praia» → «Falta *para*» (otra variante) en vez de la crase
  crase_como_otra_variante: function (c, d) { return /^Falta \*para\*/.test(d.explain || "") && /(^|\s)à(\s|$)/.test(c.accept.join(" ")); },
  // ser / estar / ficar como «Vocabulario»
  ser_estar_como_vocabulario: function (c, d) { return d.cat === "lexico" && /^(Acá va \*(ser|estar)\*|Para la ubicación de lo que no se mueve)/.test(d.explain || ""); },
  // una orden (imperativo) explicada como subjuntivo de deseo o duda
  imperativo_como_subjuntivo: function (c, d) { return d.cat === "subjuntivo" && /^Acá va subjuntivo: /.test(d.explain || "") || /\(subjuntivo \(como «que haga»\)\)|\(presente do subjuntivo\)\.$/.test(d.explain || ""); },
  // «lo vi»: el pronombre del español explicado como artículo
  pronombre_como_articulo: function (c, d) { return /\*(lo|la|los|las)\* es un artículo del español/.test(d.hint || "") && c.kind === "clitic_es"; },
  // la mesóclise escrita como ênclise en la explicación (*direi-lhe*)
  mesoclise_mal_escrita: function (c, d) { return /\*[a-zà-ÿ]+(rei|rá|rão|remos|ria|riam|ríamos)-(me|te|se|lhe|lhes|nos|o|a)\*/.test((d.explain || "").replace(/\*(dir|far|trar)-/g, "")); },
  // el mismo pronombre dos veces explicado como atracción (*se se chama*)
  pronombre_doble_como_atraccion: function (c, d) { return /atrae el pronombre delante del verbo: \*(me|te|se|lhe|nos) \1 /.test(d.explain || ""); },
  // «A gente vamos» como artículo que sobra
  a_gente_como_articulo: function (c, d) { return /\ba gente\b/i.test(c.given) && /^(articulo|sobrante)$/.test(d.cat || "") && !/a gente/.test(d.explain || ""); },
  // el futuro do subjuntivo mal formado en la explicación (saíram → saír)
  fut_subj_mal_formado: function (c, d) { return /→ [a-zà-ÿ]*[aeiou][íú]r\)/.test(d.explain || ""); },
  // «Dá-me» / «Me disseram» en una pregunta de registro, sin explicación
  registro_sin_explicacion: function (c, d, v) { return c.x.choice && v.verdict === "giusto" && D.tokens(c.given).join(" ") !== D.tokens(c.accept[0]).join(" ") && D.tokens(c.given).concat(D.tokens(c.accept[0])).some(function (w) { return /-/.test(w); }); },
  // opciones que son significados en español diagnosticadas como portugués
  glosa_como_portugues: function (c, d) { return c.x.choice && /=\s*$/.test(String(c.ctx.stem || "")) && d.cat && d.cat !== "falso_amigo"; },
  // el voseo o el imperativo rioplatense (abrí, querés) como tipeo
  voseo_como_tipeo: function (c, d) { return d.cat === "tipeo" && givenW(d).some(function (w) { return /[áéí]s?$/.test(w) && !U.isPortuguese(w); }); },
  // errores aceptados como correctos por una variante mal entendida
  error_aceptado: function (c, d, v) { return !c.x.ok && c.kind !== "accepted" && !/^(poss_art|enclisis|order|typo|accent)/.test(c.kind) && v.verdict === "giusto" && /^(gender|person|infinitive|uncontr|tense_|choice|ser_estar|garden_trap)/.test(c.kind) && !(c.kind === "uncontr" && /\bem (um|uma)\b/.test(c.given)); }
};
function famsOf(c, v) {
  var d = v.d || {}, out = [];
  if (!c.x.choice && c.accept.some(function (a) { return D.tokens(a).join(" ") === D.tokens(c.given).join(" "); })) return out;
  Object.keys(FAMS).forEach(function (k) { try { if (FAMS[k](c, d, v)) out.push(k); } catch (e) { /* */ } });
  return out;
}

var RES = [];
var t0 = Date.now();
CASES.forEach(function (c) {
  var v = view(c);
  var f = flags(c, v).concat(famsOf(c, v));
  RES.push({ c: c, v: v, f: f });
});

/* ------------------------------------------------ el informe */

var fam = {}, cross = {};
RES.forEach(function (r) {
  r.f.forEach(function (x) { (fam[x] = fam[x] || []).push(r); });
  var k = r.c.kind.replace(/^(fixerr|bankerr)_.*/, "$1") + " → " + (r.v.cat || r.v.verdict || "crash");
  (cross[k] = cross[k] || []).push(r);
});
function line(r) {
  var d = r.v.d || {};
  return "[" + r.c.src + " " + r.c.id + " s" + r.c.week + "] «" + r.c.given + "» ⇒ «" + r.c.accept[0] + "»\n      " +
    (r.v.crash ? "CRASH " + r.v.crash : d.verdict + " · " + d.cat + " · " + (d.label || "") + "\n      pista: " + d.hint + "\n      expl.: " + d.explain +
      "\n      diff: " + (d.given || []).map(function (t) { return t.bad ? "[" + t.w + "]" : t.w; }).join(" ") + "  →  " +
      (d.fixed || []).map(function (t) { return t.fix ? "[" + t.w + "]" : t.w; }).join(" "));
}

var BAD = ["crash", "roto", "sin_texto", "italiano", "tuteo", "palabra_doble", "pista_revela", "meta_temprano", "rechaza_variante",
           "cat_distinta", "tipeo_por_gramatica", "gramatica_por_tipeo", "diff_otro", "diff_vacio", "sin_regla", "no_visto", "lejos",
           "vacia", "sin_contraste", "meta_sin_glosa"];
console.log("casos: " + RES.length + " (" + Math.round((Date.now() - t0) / 1000) + " s)   fuentes: " +
  Object.entries(RES.reduce(function (a, r) { a[r.c.src] = (a[r.c.src] || 0) + 1; return a; }, {})).map(function (e) { return e[0] + " " + e[1]; }).join(", "));
BAD.forEach(function (k) { if (fam[k]) console.log("  " + (k + "                    ").slice(0, 22) + fam[k].length); });
(function () {
  // Métricas de utilidad (C3, C5, C11): sobre las devoluciones con error que llegan al alumno.
  var shown = RES.filter(function (r) { return r.v.d && r.v.verdict !== "giusto" && !r.v.far && r.v.cat !== "tipeo"; });
  var vac = shown.filter(function (r) { return r.f.indexOf("vacia") >= 0; }).length;
  var cc = shown.filter(function (r) { return CONTRAST_CATS.test(r.v.cat || ""); });
  var sc = cc.filter(function (r) { return r.f.indexOf("sin_contraste") >= 0; }).length;
  console.log("utilidad: explicaciones vacías " + vac + "/" + shown.length + " (" + (100 * vac / shown.length).toFixed(1) + " %) · " +
    "con contraste con el español en crase, colocación, futuro do subjuntivo, infinitivo pessoal, contracción, orden y ortografía " +
    (cc.length - sc) + "/" + cc.length + " (" + (100 * (cc.length - sc) / (cc.length || 1)).toFixed(1) + " %)");
})();
console.log("familias ya encontradas (tendrían que quedar en 0 o cerca):");
Object.keys(FAMS).forEach(function (k) { console.log("  " + (k + "                                ").slice(0, 32) + (fam[k] ? fam[k].length : 0)); });

var only = arg("--flag"), kind = arg("--kind"), cat = arg("--cat"), n = +(arg("--n") || 6);
if (only) {
  (fam[only] || []).slice(0, +(arg("--n") || 40)).forEach(function (r) { console.log(line(r)); });
}
if (kind || cat) {
  RES.filter(function (r) { return (!kind || r.c.kind === kind || r.c.kind.indexOf(kind) === 0) && (!cat || r.v.cat === cat); })
    .slice(0, +(arg("--n") || 40)).forEach(function (r) { console.log(line(r)); });
}
if (args.indexOf("--sample") >= 0) {
  Object.keys(cross).sort().forEach(function (k) {
    var rs = cross[k];
    console.log("\n=== " + k + "  (" + rs.length + ")");
    var step = Math.max(1, Math.floor(rs.length / n));
    for (var i = 0; i < rs.length && i / step < n; i += step) console.log(line(rs[i]));
  });
}
if (args.indexOf("--cross") >= 0) {
  Object.keys(cross).sort().forEach(function (k) { console.log("  " + k + "  " + cross[k].length); });
}
var jo = arg("--json");
if (jo) fs.writeFileSync(jo, JSON.stringify(RES.map(function (r) {
  var d = r.v.d || {};
  return { src: r.c.src, id: r.c.id, week: r.c.week, kind: r.c.kind, given: r.c.given, target: r.c.accept[0], verdict: r.v.verdict, cat: r.v.cat,
           hint: d.hint, explain: d.explain, flags: r.f };
}), null, 1));
module.exports = { RES: RES, fam: fam };
