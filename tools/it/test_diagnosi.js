/* La diagnosi deve riconoscere l'errore che uno studente ispanofono fa
   davvero.  Il test prende frasi corrette, ci inietta errori tipici (come
   farebbe lo studente) e controlla che la diagnosi dica *quale* errore è.
   Run: node tools/it/test_diagnosi.js  */
var fs = require("fs");
var path = require("path");
var pack = require("../lib/pack.js");
var ctx = pack("it");
var Conj = ctx.Conj;
var D = ctx.Diagnosi;
var Banca = ctx.Banca;

var bankPath = pack.dataPath("it", "bank.json");
var bank = fs.existsSync(bankPath) ? JSON.parse(fs.readFileSync(bankPath, "utf8")) : null;
if (bank) Banca.load(bank);
// The frequency lexicon, as in the app: a word it knows is never «no Italian word».
var freqPath = pack.dataPath("it", "frequenza.json");
if (ctx.Freq && fs.existsSync(freqPath)) ctx.Freq.load(JSON.parse(fs.readFileSync(freqPath, "utf8")));

var T = require("../lib/testkit.js")("it"), ok = T.ok;

/* ------------------------------------------------ casi scritti a mano */

var CASES = [
  ["Ieri ho andato al cinema", "Ieri sono andato al cinema.", "ausiliare"],
  ["Mi ho alzato presto", "Mi sono alzato presto.", "ausiliare"],
  ["Ho conosciuto a Giulia", "Ho conosciuto Giulia.", "a_personale"],
  ["Aspetto a mia sorella", "Aspetto mia sorella.", "a_personale"],
  ["Vado a il cinema", "Vado al cinema.", "preposizione_articolata"],
  ["Il libro de il professore", "Il libro del professore.", "preposizione_articolata"],
  ["il zaino", "lo zaino", "articolo"],
  ["il studente", "lo studente", "articolo"],
  ["lo amico", "l'amico", "articolo"],
  ["parlero domani", "parlerò domani", "accento"],
  ["Lei e italiana", "Lei è italiana", "accento"],
  ["Mio nono è simpatico", "Mio nonno è simpatico", "doppie"],
  ["Penso che è tardi", "Penso che sia tardi", "congiuntivo"],
  ["Spero che vieni", "Spero che venga", "congiuntivo"],
  ["Se avrei tempo verrei", "Se avessi tempo verrei", "periodo_ipotetico"],
  ["Noi va al mare", "Noi andiamo al mare", "persona_verbale"],
  ["Loro parla troppo", "Loro parlano troppo", "persona_verbale"],
  ["Io ando a Roma", "Io vado a Roma", "irregolare"],
  ["Ho prenduto il treno", "Ho preso il treno", "irregolare"],
  ["Ho metuto il libro sul tavolo", "Ho messo il libro sul tavolo", "irregolare"],
  ["La mia madre è italiana", "Mia madre è italiana", "articolo_possessivo"],
  ["Mia macchina è rossa", "La mia macchina è rossa", "articolo_possessivo"],
  ["Vado al medico", "Vado dal medico", "preposizione"],
  ["Vivo in Roma", "Vivo a Roma", "preposizione"],
  ["Vivo a Italia", "Vivo in Italia", "preposizione"],
  ["Studio qui per due anni", "Studio qui da due anni", "preposizione"],
  ["Io fino il lavoro", "Io finisco il lavoro", "irregolare"],
  ["Maria è andato a casa", "Maria è andata a casa", "participio_accordo"],
  ["Vedo lo", "Lo vedo", "posizione_pronome"],
  ["le case bianchi", "le case bianche", "accordo"],
  ["Cerci le chiavi?", "Cerchi le chiavi?", "ortografia"],
  ["Domani andrò se potrei", "Domani andrò se potrò", "tempo_verbale"],
  ["Andrò al cinema se ho tempo", "Andrei al cinema se avessi tempo", null],
  ["Mangiavo una pizza ieri sera", "Ho mangiato una pizza ieri sera", null]
];

CASES.forEach(function (c) {
  var d = D.diagnose(c[0], [c[1]]);
  if (c[2]) ok(d.cat === c[2], "«" + c[0] + "» → atteso " + c[2] + ", ottenuto " + d.cat);
  ok(d.verdict !== "giusto", "errore non visto: " + c[0]);
  ok(d.hint && d.explain, "manca indizio o spiegazione: " + c[0]);
  // The hint must not give the answer away.
  var fixedWords = d.fixed.filter(function (t) { return t.fix; }).map(function (t) { return t.w; });
  fixedWords.forEach(function (w) {
    if (w.length > 3) ok(d.hint.indexOf("*" + w + "*") < 0, "l'indizio rivela la risposta: " + c[0] + " / " + d.hint);
  });
});

// Correct answers stay correct: punctuation, case and apostrophes.
[["ciao, come stai", "Ciao, come stai?"], ["L'ho visto ieri", "L'ho visto ieri."],
 ["dov'è il bagno", "Dov'è il bagno?"], ["È tardi", "è tardi"]].forEach(function (c) {
  ok(D.diagnose(c[0], [c[1]]).verdict === "giusto", "risposta giusta rifiutata: " + c[0]);
});
ok(D.diagnose("parlero", ["parlerò"]).verdict === "quasi", "l'accento mancante è una svista");
// The explicit subject is Italian: right, with a note (it used to be a slip).
var dIo = D.diagnose("Io mangio", ["Mangio"]);
ok(dIo.verdict === "giusto" && dIo.level === "aceptable" && /io/.test(dIo.note) && dIo.natural === "Mangio", "il soggetto esplicito è accettabile, con nota");
ok(D.diagnose("Tu mangio", ["Mangio"]).verdict !== "giusto", "un soggetto di un'altra persona non è accettabile");
ok(D.diagnose("", ["Mangio"]).verdict === "sbagliato", "risposta vuota");
ok(D.diagnose("ho mangiato", ["Ho mangiato una pizza.", "ho mangiato"]).verdict === "giusto",
   "si confronta con la variante più vicina");

/* ------------------------------ errori iniettati nelle frasi della banca */

var ESS2AV = { sono: ["ho", "hanno"], sei: ["hai"], "è": ["ha"], siamo: ["abbiamo"], siete: ["avete"],
               ero: ["avevo"], era: ["aveva"], eravamo: ["avevamo"], erano: ["avevano"] };
var SPANISH = { molto: "muy", anche: "tambien", sempre: "siempre", quando: "cuando",
                dove: "donde", niente: "nada", adesso: "ahora", dopo: "despues", con: "con",
                oggi: "hoy", ieri: "ayer", domani: "mañana", tutto: "todo", mai: "nunca" };

function inject(sentence) {
  var toks = sentence.split(" "), out = [];
  var core = function (t) { return t.replace(/[.,;:!?«»"]/g, ""); };
  toks.forEach(function (t, i) {
    var w = core(t), low = w.toLowerCase(), next = core(toks[i + 1] || "").toLowerCase();
    var put = function (repl, cat) {
      var copy = toks.slice();
      copy[i] = t.replace(w, repl);
      out.push({ bad: copy.join(" "), cat: cat, what: w + "→" + repl });
    };
    // aux essere → avere before a participle
    if (ESS2AV[low] && D.participleOf(next)) {
      put(/[ie]$/.test(next) && low === "sono" ? "hanno" : ESS2AV[low][0], "ausiliare");
    }
    // accent dropped (a slip)
    if (/[àèìòù]$/.test(low) && low.length > 3) put(w.normalize("NFD").replace(/[\u0300-\u036f]/g, ""), "accento");
    // double consonant simplified
    if (/([bcdfglmnprstvz])\1/.test(low) && low.length > 4 && !/^(ss|zz)/.test(low)) {
      put(w.replace(/([bcdfglmnprstvz])\1/, "$1"), "doppie");
    }
    // article il/lo swapped
    if (low === "lo" && /^(s[bcdfgmnpqtv]|z|gn|ps)/.test(next)) put("il", "articolo");
    // articulated preposition split up
    var split = { al: "a il", del: "de il", nel: "in il", dal: "da il", sul: "su il",
                  alla: "a la", della: "di la", nella: "in la" }[low];
    if (split) put(split, "preposizione_articolata");
    // Spanish word
    if (SPANISH[low] && SPANISH[low] !== low) put(SPANISH[low], "parola_spagnola");
    // person of the verb
    var forms = D.verbForms(low).filter(function (f) { return f.tense === "presente"; });
    // a noun after an article or a determiner (la domanda, il conto) is not a verb to conjugate
    var prevLow = core(toks[i - 1] || "").toLowerCase();
    var nounHere = (D.DATA.nouns[low] || D.DATA.nounsByPlural[low]) &&
      (D.util.ARTICLES[prevLow] || D.util.prepInfo(prevLow) || D.util.POSSESSIVE.indexOf(prevLow) >= 0);
    if (forms.length && low.length > 2 && i > 0 && !nounHere) {
      var f = forms[0];
      try {
        var all = Conj.conjugate(f.lemma, "presente").map(function (x) { return x.split(" ").pop(); });
        var other = all[(f.p + 3) % 6];
        if (other && other !== low && D.verbForms(other).length) put(other, "persona_verbale");
      } catch (e) { /* */ }
    }
  });
  return out;
}

var ALT = {
  parola_spagnola: ["parola_spagnola", "ortografia", "accento", "lessico"],
  persona_verbale: ["persona_verbale", "tempo_verbale", "congiuntivo", "irregolare", "accordo", "piacere", "ci_ne"],
  doppie: ["doppie", "refuso"],
  accento: ["accento"],
  articolo: ["articolo", "genere"],
  ausiliare: ["ausiliare"],
  // A closer accepted variant may have another preposition (sopra il, il fine settimana).
  preposizione_articolata: ["preposizione_articolata", "preposizione", "parola_in_piu", "falso_amico"]
};

if (bank) {
  var tally = {};
  bank.sentences.forEach(function (s) {
    inject(s.it[0]).forEach(function (x) {
      var d = D.diagnose(x.bad, s.it);
      var t = tally[x.cat] || (tally[x.cat] = { n: 0, hit: 0, seen: 0, miss: [] });
      t.n++;
      if (d.verdict !== "giusto") t.seen++;
      if ((ALT[x.cat] || [x.cat]).indexOf(d.cat) >= 0) t.hit++;
      else if (t.miss.length < 4) t.miss.push(x.what + " in «" + s.it[0] + "» → " + d.cat);
    });
  });
  console.log("errori iniettati nelle frasi della banca:");
  Object.keys(tally).forEach(function (k) {
    var t = tally[k];
    console.log("  " + (k + "                         ").slice(0, 26) + t.hit + "/" + t.n +
      " diagnosticati bene (" + Math.round(t.hit / t.n * 100) + "%), visti come errore " + t.seen + "/" + t.n);
    ok(t.seen / t.n >= 0.97, k + ": errori non visti " + (t.n - t.seen));
    ok(t.hit / t.n >= 0.85, k + ": diagnosi giusta solo nel " + Math.round(t.hit / t.n * 100) + "%");
    if (t.hit / t.n < 0.95) t.miss.forEach(function (m) { console.log("      es.: " + m); });
  });

  // Every accepted translation is accepted, and every bank error sentence is
  // recognised as wrong.
  bank.sentences.forEach(function (s) {
    s.it.forEach(function (v) {
      ok(D.diagnose(v, s.it).verdict === "giusto", "variante rifiutata: " + v);
    });
  });
  var errSeen = 0, errCat = 0;
  bank.errors.forEach(function (e) {
    var d = D.diagnose(e.wrong, [e.right]);
    if (d.verdict !== "giusto") errSeen++;
    if (d.cat === e.cat || (e.cat === "genere" && d.cat === "articolo") ||
        (e.cat === "articolo" && d.cat === "genere")) errCat++;
  });
  console.log("frasi di «trova l'errore»: viste come errore " + errSeen + "/" + bank.errors.length +
              ", stessa categoria dell'autore " + errCat + "/" + bank.errors.length);
  ok(errSeen === bank.errors.length, "ogni frase sbagliata è vista come sbagliata");

  /* generatori della banca */
  var st = { unlocked: 52, cards: {} };
  ["vocabSession", "formsSession", "translateSession", "gapSession", "errorSession"].forEach(function (fn) {
    for (var r = 0; r < 20; r++) {
      Banca[fn](st, 12).forEach(function (it) {
        ok(it && it.id && it.answer !== undefined, fn + ": item malformato");
        if (it.type === "choice") ok(it.options.indexOf(it.answer) >= 0, fn + ": opzione giusta assente " + it.id);
        if (it.type === "typed" || it.type === "translate") {
          ok(D.diagnose(it.answer, it.accept).verdict === "giusto", fn + ": la risposta attesa è rifiutata: " + it.id + " " + it.answer);
        }
        ok(Banca.item(it.id) !== null, fn + ": l'item non si rigenera dal suo id: " + it.id);
      });
    }
  });
  // Articles computed from the bank agree with the rules.
  ok(Banca.defArt("zaino", "m") === "lo" && Banca.defArt("studenti", "m", true) === "gli" &&
     Banca.defArt("amica", "f") === "l'" && Banca.defArt("uova", "f", true) === "le", "articoli calcolati");
  ok(Banca.CONTR.in.lo === "nello" && Banca.CONTR.di.gli === "degli", "preposizioni articolate");

  st.errs = { ausiliare: { n: 5, fixed: 0, last: Date.now() }, preposizione: { n: 3, fixed: 0, last: Date.now() } };
  var cl = Banca.clinicaSession(st, 12);
  ok(cl.length >= 8, "la clinica prepara una sessione: " + cl.length);
  ok(cl.filter(function (x) { return x.clinic === "ausiliare"; }).length >=
     cl.filter(function (x) { return x.clinic === "preposizione"; }).length, "la clinica pesa di più l'errore più frequente");
} else {
  console.log("(docs/data/bank.json assente: test della banca saltati)");
}

/* ------------------- le famiglie di correzioni sbagliate (diag_review) */

// tools/it/diag_review.js inietta gli errori tipici in tutte le 52
// settimane e cerca devoluzioni sbagliate.  Ogni famiglia trovata e
// corretta ha qui il suo caso: [dato, attese, ctx, categoria attesa (o
// null), regex che la spiegazione/indizio deve avere, regex che non deve].
var DV = ctx.Devolucion;
function diagT(given, accept, c) {
  var d = D.diagnose(given, accept, c || {});
  if (d.verdict !== "giusto" && DV) DV.tidy(d, (c || {}).week);
  return d;
}
var FAMILIES = [
  // la palabra española: la categoría y por qué (no «tildes», «tipeo», «vocabulario»)
  ["dal médico", ["dal medico"], {}, "accento", /sin tilde.*español/, /La tilde va así/],
  ["Il profesor spiega la lezione.", ["Il professore spiega la lezione."], {}, "parola_spagnola", /español/, /tipeo/i],
  ["il casamiento", ["il matrimonio"], {}, "parola_spagnola", /español/, /no es una palabra italiana/],
  ["Quest'anno ho lavorato più que mai.", ["Quest'anno ho lavorato più che mai."], {}, "parola_spagnola", /\*che\*/, null],
  ["Vorrei un café", ["Vorrei un caffè"], {}, "parola_spagnola", /doble/, null],
  ["Ti piace il cafè?", ["Ti piace il caffè?"], {}, "doppie", null, /español/],
  ["Dov'è il cine?", ["Dov'è il cinema?"], {}, "parola_spagnola", null, /invariable/],
  // tildes: las que distinguen palabras, y la que sobra
  ["Questa musica mi da fastidio.", ["Questa musica mi dà fastidio."], {}, "accento", /dare/, null],
  ["setté", ["sette"], {}, "accento", /sin tilde/, /La tilde va así/],
  // dobles y tipeos: «tipeo» solo para lo que es tipeo, gramática solo para lo que es gramática
  ["Che pecacto dover partire.", ["Che peccato dover partire."], {}, "refuso", null, /española/],
  ["C'è un erorre nel documento.", ["C'è un errore nel documento."], {}, "doppie", /otro lugar/, /de más/],
  ["cuigni", ["cugini"], { stem: "cugino → ___", nominal: true }, "refuso", null, /plural/i],
  ["Ho un problema con il comptuer.", ["Ho un problema con il computer."], {}, "refuso", null, /plural/],
  ["festggerai", ["festeggerai"], { stem: "Quand'è che ___ il tuo successo? (tu – festeggiare)" }, "refuso", null, /raíz/],
  ["Non capsco la domanda.", ["Non capisco la domanda."], {}, "refuso", null, /-isc-/],
  ["Gli operai hanno sciperato per un mese.", ["Gli operai hanno scioperato per un mese."], {}, "refuso", null, /irregular/],
  ["Non toccrlo", ["Non toccarlo"], { stem: "Non lo toccare! → ___!" }, "refuso", null, /pegado/],
  // copiar la consigna; los nombres propios no son español
  ["(Ella) tenía hambre.", ["Aveva fame"], { stem: "(Ella) tenía hambre." }, "parola_spagnola", /Copiaste/, null],
  ["Haceme un favor.", ["Fammi un favore."], { stem: "Haceme un favor." }, "parola_spagnola", /Copiaste/, /nombres propios/],
  ["Tu prepari da mangiare.", ["Prepari da mangiare, tu?"], { stem: "Tu prepari da mangiare." }, "ordine", /al final/, /Copiaste|Está en español|Mezcla español|es español/],
  ["Mi mancare Buenos Aires.", ["Mi manca Buenos Aires."], {}, "persona_verbale", /infinitivo/, /español/],
  ["Debe costar muchísimo.", ["Costerà moltissimo.", "Costerà molto molto."], { stem: "Debe costar muchísimo." }, "parola_spagnola", /moltissimo/, /molto molto/],
  ["Mammo, dove sei?", ["Mamma, dove sei?"], {}, null, null, /nombres propios/],
  // pronombres
  ["Me piace la musica italiana.", ["Mi piace la musica italiana."], {}, "pronome", /\*mi piace\*.*español/, /^Acá va \*mi\*\.$/],
  ["Per mi è uguale.", ["Per me è uguale."], {}, "pronome", /para mí/, /tónico|átono/],
  ["Li piacciono i film giapponesi?", ["Gli piacciono i film giapponesi?"], {}, "pronome", /indirecto/, null],
  ["La aspetto da un'ora.", ["Lo aspetto da un'ora."], {}, "pronome", null, /masculino en italiano/],
  ["La invito a cena sabato.", ["Le invito a cena sabato."], {}, "pronome", /«las»/, /está en plural/],
  ["Ida pensa solo a lui.", ["Ida pensa solo a sé."], {}, "pronome", /sí mism/, null],
  ["Ivo, se vuoi venire, gli lo puoi dire?", ["Ivo, se vuoi venire, glielo puoi dire?"], {}, "pronome", /glielo/, /artículo/],
  ["no so", ["Non lo so"], {}, "pronome", /pronombre \*lo\*/, /artículo/],
  // concordancia: con qué concuerda y por qué
  ["Il fiore è bella.", ["Il fiore è bello."], {}, "accordo", /fiore/, /delante del sustantivo/],
  ["Gli argentino parlano spagnolo.", ["Gli argentini parlano spagnolo."], {}, "accordo", /\*gli\*/, /concuerda con \*spagnolo\*/],
  ["Gli argentini parlano spagnola.", ["Gli argentini parlano spagnolo."], {}, "accordo", /idiomas/, null],
  ["Le università sono pubblichi.", ["Le università sono pubbliche."], {}, "accordo", /femenino plural/, /Invariable/],
  ["Il museo è chiusi il lunedì.", ["Il museo è chiuso il lunedì."], { week: 3 }, "accordo", /museo/, /participio/],
  ["Le lettere vengono consegnati.", ["Le lettere vengono consegnate."], {}, "participio_accordo", /venire/, /lo, la, li, le/],
  ["Ho fatta una passeggiata.", ["Ho fatto una passeggiata."], {}, "participio_accordo", /avere/, /irregular/],
  ["Hai lette l'email?", ["Hai letto l'email?"], {}, "participio_accordo", /avere/, /concuerda con \*email\*/],
  ["hanno vista un film", ["hanno visto un film"], {}, "participio_accordo", /avere/, /visa/],
  ["il matrimonia", ["il matrimonio"], {}, "genere", /masculino/, null],
  ["Siamo arrivati tardi alla riuniona.", ["Siamo arrivati tardi alla riunione."], {}, "genere", /-ione/, null],
  ["Dovresti far scegliere i colori aglo altri.", ["Dovresti far scegliere i colori agli altri."], {}, "preposizione_articolata", /a \+ gli/, /ajo/],
  ["Il conta, per favore.", ["Il conto, per favore."], {}, "lessico", /sustantivo/, /persona|favore/],
  ["Il temo è interessante.", ["Il tema è interessante."], {}, "lessico", /sustantivo/, /subjuntivo|congiuntivo/],
  ["La domenica mangiamo la pasto.", ["La domenica mangiamo la pasta."], {}, null, null, /no significa lo que creés/],
  ["il prima", ["il primo"], {}, null, null, /no significa lo que creés/],
  // artículos
  ["La mio capo è molto esigente.", ["Il mio capo è molto esigente."], {}, "genere", /\*capo\* es masculino/, /\*mio\* es masculino/],
  ["Elena Ferrante, il cui opera più famosa", ["Elena Ferrante, la cui opera più famosa"], {}, "articolo", /cui/, /\*cui\* es femenino/],
  ["Li ho ringraziati per gli fiori.", ["Li ho ringraziati per i fiori."], {}, "articolo", /\*gli\* va solo/, null],
  ["Lo dieci per cento", ["Il dieci per cento"], {}, "articolo", null, /horas/],
  // verbos: persona, tiempo, modo, a su tiempo
  ["Vi piacerebbero venire con noi?", ["Vi piacereste venire con noi?"], {}, "persona_verbale", /voi/, /funciona como «gustar»/],
  ["Oggi mi senta male.", ["Oggi mi sento male."], { week: 6 }, "persona_verbale", /sento/, null],
  ["Oggi mi senta male.", ["Oggi mi sento male."], { week: 30 }, "persona_verbale", /nada lo pide/, null],
  ["Domani parta per Milano.", ["Domani parto per Milano."], { week: 6 }, "persona_verbale", /más adelante/, /hablante afirma/],
  ["Se arrivo prima, aspettami al bar.", ["Se arrivi prima, aspettami al bar."], { week: 40 }, "persona_verbale", null, /congiuntivo/],
  ["Volevo che tu mi dica la verità.", ["Volevo che tu mi dicessi la verità."], {}, "congiuntivo", /pasado/, null],
  ["Potessi aiutarmi?", ["Potresti aiutarmi?"], { week: 35 }, "condizionale", /cortesía/, /consecuencia/],
  ["Ti chiamerò quando arrivi.", ["Ti chiamerò quando arriverò."], {}, "tempo_verbale", /quando.*«cuando llegue»/, null],
  ["Ci ero due gatti.", ["Ci sono due gatti."], {}, "tempo_verbale", null, /singular/],
  ["Ogni estate ci piacerebbe visitare la nonna.", ["Ogni estate ci piaceva visitare la nonna."], {}, "tempo_verbale", null, /gustar/],
  ["Vive in Italia, a Milano.", ["Vivo in Italia, a Milano."], {}, "persona_verbale", null, /vocal final marca/],
  ["Ha continuato come se niente sarà.", ["Ha continuato come se niente fosse."], {}, "congiuntivo", /come se/i, /Condición irreal/],
  ["Fui le tre e mezza.", ["Sono le tre e mezza."], {}, null, null, /no significa lo que creés/],
  ["Era convinto che avrebbe telefonato.", ["Ero convinto che avrebbe telefonato."], {}, "persona_verbale", null, /viene del español/],
  ["Tornaranno domani.", ["Torneranno domani."], {}, "irregolare", /-are/, /contrae/],
  ["Mi alzarsi alle sette.", ["Mi alzo alle sette."], {}, "persona_verbale", /infinitivo/, /otra palabra|significa/],
  ["Essere malato, non è venuto.", ["Essendo malato, non è venuto."], {}, "tempo_verbale", /gerundio/, /conjugado/],
  ["Non avevo potuto.", ["Non ho potuto."], {}, "tempo_verbale", /potuto/, /es imperfetto/],
  // auxiliar: el porqué del verbo, reflexivos, modales, estados
  ["Lo specchio ha rotto.", ["Lo specchio è rotto."], {}, "ausiliare", /estado/, /movimiento/],
  ["Stamattina Anna si ha alzata.", ["Stamattina Anna si è alzata."], {}, "ausiliare", /reflexivo/, /\*alzare\*/],
  ["Mi ha costato un occhio della testa.", ["Mi è costato un occhio della testa."], {}, "ausiliare", /piacere/, /reflexivo/],
  ["Sabato sono dovuto lavorare.", ["Sabato ho dovuto lavorare."], {}, "ausiliare", /lavorare/, null],
  ["Il film ha finito.", ["Il film è finito."], {}, "ausiliare", /finire/, null],
  ["Ieri ho andato al cinema.", ["Ieri sono andato al cinema."], {}, "ausiliare", /movimiento.*haber/, null],
  // passato prossimo e imperfetto: el porqué
  ["Abbiamo mangiato bene e bevevamo un bicchiere di vino.", ["Abbiamo mangiato bene e abbiamo bevuto un bicchiere di vino."], {}, "tempo_verbale", /puntual/, null],
  ["È stato contento.", ["Era contento.", "Lui era contento."], {}, "tempo_verbale", /describir/, /\*lui\*/],
  ["Ieri sera mangio una pizza.", ["Ieri sera ho mangiato una pizza."], {}, "tempo_verbale", /ieri/, null],
  ["Paolo disse che verrebbe il giorno dopo.", ["Paolo disse che sarebbe venuto il giorno dopo."], {}, "tempo_verbale", /indirecto/, null],
  ["Sì, ci stavo l'anno scorso.", ["Sì, ci sono stato l'anno scorso."], {}, "tempo_verbale", null, /Falta el auxiliar/],
  // preposiciones
  ["Grazie da averci aiutato.", ["Grazie di averci aiutato."], {}, "preposizione", /infinitivo/, /Origen/],
  ["Perché non la inviti in venire?", ["Perché non la inviti a venire?"], {}, "preposizione", /infinitivo/, /ciudades/],
  ["Voglio andare nel cinema.", ["Voglio andare al cinema."], {}, "preposizione", /cinema/, /infinitivo/],
  ["Vedo mio marito scendere del letto.", ["Vedo mio marito scendere dal letto."], {}, "preposizione", /partida/, null],
  ["Andiamo di Marco.", ["Andiamo da Marco.", "Andiamo a casa di Marco."], {}, "preposizione", /«en lo de»/, /Falta/],
  ["In Argentina ci sono più mucche come abitanti.", ["In Argentina ci sono più mucche che abitanti."], {}, "comparativo", /come/, /no significa lo que creés/],
  // pronombres que faltan, orden
  ["Stamattina Anna è alzata.", ["Stamattina Anna si è alzata."], {}, "pronome", /reflexivo/, null],
  ["In campagna si alza presto.", ["In campagna ci si alza presto."], {}, "pronome", /ci si/, null],
  ["mia la casa", ["la mia casa"], {}, "ordine", /posesivo/, /pronombre/],
  ["Prendo tutti l'autobus i giorni.", ["Prendo l'autobus tutti i giorni."], {}, "ordine", null, /pronombre/],
  ["Non ho visto mai quel film.", ["Non ho mai visto quel film."], {}, "ordine", /entre el auxiliar/, null],
  ["Lui molto è in gamba.", ["Lui è molto in gamba.", "Lui è in gamba."], {}, "ordine", /después del verbo/, null],
  // varios huecos que no se pueden rearmar: cada palabra sola
  ["Il La", ["La La"], { stem: "Arriveder___, signore, ___ richiamerò più tardi. (usted)" }, null, null, /la la/i],
  // «boh»: no hay nada que corregir
  ["boh no so", ["Non lo so"], {}, "vuoto", null, null],
  // el orden del pronombre en los tiempos compuestos
  ["Ho lo visto ieri sera.", ["L'ho visto ieri sera."], {}, "posizione_pronome", /l'ho visto/, /artículo/],
  // con un disparador, primero la lectura de congiuntivo; «se lo» también es «si»
  ["È possibile che Anna arriva tardi.", ["È possibile che Anna arrivi tardi."], {}, "congiuntivo", null, /el sujeto acá es/],
  ["Se lo vedrei, glielo direi.", ["Se lo vedessi, glielo direi."], {}, "periodo_ipotetico", null, null],
  ["Mia madre? La telefono ogni giorno.", ["Mia madre? Le telefono ogni giorno."], {}, "pronome", /telefonare/, null],
  ["Le invito a cena sabato.", ["La invito a cena sabato."], {}, "pronome", null, /telefonare/],
  // participios: la regularización y el tipeo
  ["Mi ha dicito la verità.", ["Mi ha detto la verità."], {}, "irregolare", /detto/, null],
  ["Perché non sei veuto ieri?", ["Perché non sei venuto ieri?"], {}, "refuso", null, /irregular/],
  ["È stata piacuta la casa.", ["È stata piaciuta la casa."], {}, "irregolare", /piaciuta/, null],
  ["fratlli", ["fratelli"], { stem: "fratello → ___", nominal: true }, "refuso", null, /Plural/],
  ["Hai visto Luca? Sì, lo vidi stamattina.", ["Hai visto Luca? Sì, l'ho visto stamattina."], {}, "tempo_verbale", /\*ho visto\*/, /\*hai visto\*/],
  ["È probabili che venga.", ["È probabile che venga."], {}, null, null, null],
  ["Ha innamorata di Pino.", ["È innamorata di Pino."], {}, "ausiliare", /estado/, /\*\*/],
  ["Sono felice di averlo vista ieri.", ["Sono felice di averlo visto ieri."], {}, "participio_accordo", /averlo visto/, /visa/],
  ["Pochi sono veuti oggi.", ["Pochi sono venuti oggi."], {}, "refuso", null, /irregular/],
  ["Loro cerceranno biglietti.", ["Loro cercheranno biglietti."], {}, "ortografia", /-care/, /irregular/],
  // el mismo verbo en otra persona se empareja antes que «sobra»
  ["Abbiamo mangiato molto bene e ha bevuto un bicchiere di vino",
   ["Abbiamo mangiato molto bene e abbiamo bevuto un bicchiere di vino", "Abbiamo mangiato molto bene e bevuto un bicchiere di vino"], {}, "persona_verbale", null, /Sobra/],
  // la variante más cercana: el artículo o el auxiliar cambiado, no otra palabra
  ["Mi ho dimenticato le chiavi.", ["Mi sono dimenticato le chiavi.", "Ho dimenticato le chiavi."], {}, "ausiliare", /reflexivo/, /Sobra/],
  ["Ho scritto la rapporto ieri.", ["Ho scritto il rapporto ieri.", "Ho scritto la relazione ieri."], {}, "genere", /rapporto/, /relazione/],
  ["Sì, mi ne ricordo.", ["Sì, me ne ricordo."], {}, "pronome", /me ne/, /Sobra/],
  // reglas falsas de la auditoría 2026-09-v3 (C4) y de la general (D1)
  ["Non è rosso però blu.", ["Non è rosso ma blu."], {}, "lessico", /sino/, /viene del español/],
  ["A me piaccio la pizza.", ["Mi piace la pizza."], {}, "piacere", null, /objeto directo/],
  ["Ha detto di essere stanco.", ["Ha detto che era stanca."], {}, "accordo", null, /conjugado|infinitivo; conjugado/],
  ["Ha detto che arrivavo.", ["Ha detto che sarebbe arrivata."], {}, null, null, /passato prossimo/],
  ["Lo ho letto ieri.", ["L'ho letto ieri."], {}, "pronome", /apostrofa/, /\*gli\* en plural/],
  ["La nonno è simpatica.", ["La nonna è simpatica."], {}, "accordo", /abuela/, null],
  ["Se non stude, non passi l'esame.", ["Se non studi, non passi l'esame."], {}, "persona_verbale", null, /Plural/],
  ["Non lo me dimenticherò mai.", ["Non me lo dimenticherò mai."], {}, "pronome", /me lo/, /pegado/],
  ["La casa è bianchi.", ["La casa è bianca."], {}, "accordo", /casa/, /significa/],
  ["Ho acquistato una macchina.", ["Ho preso una macchina."], {}, null, null, /no es una palabra italiana/],
  ["Che cosa tu hai detto?", ["Che cosa hai detto?"], {}, "ordine", /interrogativa/, null],
  ["Tu ho trentadue anni.", ["Ho trentadue anni."], {}, "persona_verbale", /\*tu\* no va con/, null],
  // el porqué en las plantillas de más volumen (C3): la pista de la frase,
  // la regla, el contraste con el español
  ["Vedremo Piero e Gina che ci aspettavano.", ["Vedevamo Piero e Gina che ci aspettavano."], {}, "tempo_verbale", /aspettavano.*español/, null],
  ["Domani parlavo con lui.", ["Domani parlerò con lui."], {}, "tempo_verbale", /pista es \*domani\*/, null],
  ["Voglio di andare al cinema.", ["Voglio andare al cinema."], {}, "preposizione", /directo/, /^Sobra \*di\*\.$/],
  ["Vado a la casa.", ["Vado a casa."], {}, "articolo", /hogar/, null],
  ["Ho comprato tre libri.", ["Ho comprato qualche libro."], {}, null, null, null],
  ["Ho letto qualche libri.", ["Ho letto qualche libro."], {}, "plurale", /qualche.*singular.*español/, null],
  ["Il ragazzo alti è mio fratello.", ["Il ragazzo alto è mio fratello."], {}, "accordo", /español/, null]
];
FAMILIES.forEach(function (c) {
  var d = diagT(c[0], c[1], c[2]);
  var txt = (d.hint || "") + " || " + (d.explain || "");
  var tag = "«" + c[0] + "»";
  ok(d.verdict !== "giusto", "famiglia: errore non visto " + tag);
  if (c[3]) ok(d.cat === c[3], "famiglia: " + tag + " → atteso " + c[3] + ", ottenuto " + d.cat + " (" + d.explain + ")");
  if (c[4]) ok(c[4].test(txt), "famiglia: " + tag + " la spiegazione non dice " + c[4] + ": " + txt);
  if (c[5]) ok(!c[5].test(txt), "famiglia: " + tag + " la spiegazione dice " + c[5] + ": " + txt);
  ok(!/undefined|NaN|\*\*|\.\*\.|\s\.\*/.test(txt), "famiglia: testo rotto " + tag + ": " + txt);
});

// Another valid way of saying it: right, with its level, its note and the
// model's version (P2).
[["Io ho trentadue anni.", ["Ho trentadue anni."], "aceptable", /io/],
 ["Ha detto che arrivava.", ["Ha detto che sarebbe arrivata."], "poco_natural", /sarebbe arrivata/],
 ["Non lavoro oggi.", ["Oggi non lavoro."], "aceptable", /oggi/],
 ["Ho 32 anni.", ["Ho trentadue anni."], "aceptable", /cifras/],
 ["A loro piacciono i film.", ["Gli piacciono i film."], "aceptable", /a loro/],
 ["Sono stanca.", ["Sono stanco."], "correcto", /femenino/],
 ["Ho trentadue anni.", ["Ho trentadue anni."], "correcto", null]
].forEach(function (c) {
  var d = D.diagnose(c[0], c[1], {});
  ok(d.verdict === "giusto" && d.level === c[2], "livello: «" + c[0] + "» → " + d.verdict + " " + d.level + " (atteso " + c[2] + ")");
  if (c[3]) ok(c[3].test(d.note || ""), "livello: «" + c[0] + "» nota senza " + c[3] + ": " + d.note);
  if (c[2] === "aceptable" || c[2] === "poco_natural") ok(d.natural === c[1][0], "livello: «" + c[0] + "» senza la versione naturale");
});
ok(D.diagnose("Ieri ho andato", ["Ieri sono andato"]).level === "incorrecto" && D.diagnose("parlero", ["parlerò"]).level === "desliz", "livello: incorrecto e desliz");

// The translations into Spanish (dir «it-es», D2 of the 2026-09 audit): the
// Spanish is never diagnosed as Italian.
(function () {
  var items = pack.data("it", "course.json").items, es = Object.keys(items).filter(function (k) { return items[k].dir === "it-es"; });
  ok(es.length === 10, "traduzioni verso lo spagnolo: " + es.length);
  es.forEach(function (k) {
    var it = items[k], acc = it.accept || [it.answer];
    ok(acc.length >= 5, "traduzione verso lo spagnolo con poche varianti: " + k + " (" + acc.length + ")");
    var d = D.diagnose("Hice algo que no tiene nada que ver", acc, { dir: "it-es", stem: it.stem });
    ok(d.verdict === "sbagliato" && !d.cat && /Otras formas/.test(d.explain), "spagnolo diagnosticato come italiano: " + k + " " + d.cat + " " + d.explain);
    ok(D.diagnose(acc[acc.length - 1].toLowerCase().replace(/[¡!¿?.]/g, ""), acc, { dir: "it-es" }).verdict === "giusto", "variante spagnola rifiutata: " + k);
  });
  ok(D.diagnose("Hizo el ridiculo", ["Quedó mal", "Hizo el ridículo"], { dir: "it-es" }).verdict === "giusto", "spagnolo senza tilde: giusto");
})();

// Correct alternatives stay correct; wrong ones are not waved through.
[["sono stanca", ["Sono stanco."], {}, "giusto"],
 ["Non sono potuto venire.", ["Non ho potuto venire."], {}, "giusto"],
 ["Sono dovuta partire.", ["Sono dovuto partire."], {}, "giusto"],
 ["Parli italiana perfettamente.", ["Parli italiano perfettamente."], {}, "sbagliato"],
 ["Vieni quando hai finita.", ["Vieni quando hai finito."], {}, "sbagliato"],
 ["Sarebbe restata.", ["Sarebbe restato."], { stem: "(Él) se habría quedado." }, "sbagliato"],
 ["Ero tanto stanca che mi sono addormentato.", ["Ero tanto stanco che mi sono addormentato."], {}, "sbagliato"],
 ["essere uscita con te", ["essere uscito con te"], { stem: "Sono contento di ___. (uscire con te)" }, "sbagliato"],
 ["Sarebbe dovuti restare.", ["Sarebbe dovuto restare."], {}, "sbagliato"],
 ["Non avevo potuto venire.", ["Non ho potuto venire."], {}, "sbagliato"],
 ["Sabato sono dovuto lavorare.", ["Sabato ho dovuto lavorare."], {}, "sbagliato"],
 ["Lui guardava il tv.", ["Lui guardava la tv."], {}, "sbagliato"]
].forEach(function (c) {
  var d = diagT(c[0], c[1], c[2]);
  ok(d.verdict === c[3] || (c[3] === "sbagliato" && d.verdict === "quasi"), "famiglia: «" + c[0] + "» dovrebbe essere " + c[3] + ", è " + d.verdict + " " + d.cat);
});

// Multiple choice: Spanish (metalinguistic) options are not Italian to
// correct; «(nada)» is the missing word; an option is never «a typo» or
// «no existe».
function choiceT(o, a, c) { return D.explainChoice(o, a, c || {}); }
ok(choiceT("futuro de fare", "passato remoto de fare", { stem: "Gli operai fecero sciopero." }) === null, "scelta: opzione in spagnolo diagnosticata");
ok(choiceT("un libro viejo", "un libro grande y gordo", { stem: "un librone" }) === null, "scelta: opzione in spagnolo diagnosticata (2)");
var dn = choiceT("(nada)", "La", { stem: "___ Sicilia è un'isola." });
ok(dn && dn.cat === "articolo" && /Sicilia/.test(dn.explain), "scelta: «(nada)» = manca l'articolo: " + (dn && dn.explain));
var da = choiceT("anzi", "infatti", { stem: "Non è un bravo studente; ___ non studia mai." });
ok(da && !/no es una palabra italiana|no existe/.test(da.explain), "scelta: un'opzione non «non esiste»: " + (da && da.explain));
var db = choiceT("blue", "blu", { stem: "Ho due magliette ___." });
ok(db && db.cat !== "refuso", "scelta: un'opzione non è un refuso");
var dg = choiceT("lo gli", "gliel'", { stem: "Hai dato il libro a Marco? — Sì, ___ ho dato ieri." });
ok(dg && dg.cat === "pronome" && /gliel'/.test(dg.explain), "scelta: lo gli → gliel': " + (dg && dg.explain));

/* ------------------------------------------- tentativi di romperla */

// Words that are also JavaScript property names must not break anything.
// Real-world typing and the learner's own gender
[["sono stanca", "Sono stanco.", "giusto"], ["Ieri sono andata a casa", "Ieri sono andato a casa.", "giusto"],
 ["Sei pronta?", "Sei pronto?", "giusto"], ["siamo arrivate", "Siamo arrivati.", "giusto"],
 ["Maria è andato a casa", "Maria è andata a casa.", "sbagliato"], ["Lei è stanco", "Lei è stanca.", "sbagliato"],
 ["Ti è piaciuta il film?", "Ti è piaciuto il film?", "sbagliato"], ["La casa è bello", "La casa è bella.", "sbagliato"],
 ["Tutti le mattine bevo un caffè", "Tutte le mattine bevo un caffè.", "sbagliato"],
 ["L'amico di Marco \u00e8\u200b arrivato", "L'amico di Marco è arrivato.", "giusto"],
 ["L'amico di Marco è arrivato 😀", "L'amico di Marco è arrivato.", "giusto"],
 ["L' amico di Marco è arrivato", "L'amico di Marco è arrivato.", "giusto"]
].forEach(function (c) {
  var d = D.diagnose(c[0], [c[1]]);
  ok(d.verdict === c[2], "«" + c[0] + "» dovrebbe essere " + c[2] + ", è " + d.verdict + " " + d.cat);
});
ok(D.diagnose("L'amico e' arrivato", ["L'amico è arrivato."]).cat === "accento", "e' per è = accento");
ok(D.diagnose("Lei è stanco", ["Lei è stanca."]).cat === "accordo", "stanco/stanca è accordo, non persona");
ok(D.diagnose("Le ragazze sono partiti", ["Le ragazze sono partite."]).cat === "participio_accordo", "partiti/partite dopo essere");

["constructor", "__proto__", "toString", "hasOwnProperty", "valueOf", "prototype"].forEach(function (w) {
  ["Ieri sono andato al cinema.", w, "__proto__"].forEach(function (t) {
    var ok1 = true;
    try { D.diagnose(w, [t]); D.diagnose(t, [w]); } catch (e) { ok1 = false; }
    ok(ok1, "la diagnosi si rompe con «" + w + "» / «" + t + "»");
  });
});
// Garbage input never throws and never prints undefined/NaN.
["", "   ", "<script>alert(1)</script>", "😀😀", "a".repeat(3000), "\x27\x27\x27", ".,;:!?", "l\x27 l\x27 l\x27", "\u0000"].forEach(function (w) {
  var d = null;
  try { d = D.diagnose(w, ["Ho mangiato una pizza."]); } catch (e) { /* */ }
  ok(d && d.verdict, "input assurdo non gestito: " + JSON.stringify(w).slice(0, 20));
  if (d && d.hint) ok(!/undefined|NaN|\[object/.test(d.hint + d.explain), "testo rotto con input assurdo");
});

if (bank) {
  // Random typing slips on every sentence: never a crash, always a hint.
  var seed = 7;
  var rnd = function () { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
  var crashes = 0, noHint = 0;
  bank.sentences.forEach(function (s) {
    for (var r = 0; r < 3; r++) {
      var a = s.it[0].split("");
      var k = Math.floor(rnd() * a.length);
      a.splice(k, 1, rnd() < 0.5 ? "" : "x");
      try {
        var d = D.diagnose(a.join(""), s.it);
        if (d.verdict !== "giusto" && (!d.hint || !d.explain)) noHint++;
      } catch (e) { crashes++; }
    }
  });
  ok(crashes === 0, "la diagnosi si rompe su frasi mutate: " + crashes);
  ok(noHint === 0, "errori senza indizio: " + noHint);

  // A first-attempt hint never names the corrected word (binary choices like
  // «¿di o che?» aside).
  var leaks = 0;
  bank.errors.forEach(function (e) {
    var d = D.diagnose(e.wrong, [e.right]);
    if (d.cat === "comparativo") return;
    d.fixed.filter(function (t) { return t.fix && t.w.length > 2; }).forEach(function (t) {
      if (d.hint.toLowerCase().indexOf("*" + t.w + "*") >= 0) leaks++;
    });
  });
  ok(leaks === 0, "indizi che rivelano la risposta: " + leaks);

  // Every gap is cut where the word really is (not «è» inside «caffè»).
  bank.sentences.forEach(function (s, i) {
    if (!s.gap) return;
    var it = Banca.gapItem(i);
    ok(it && it.stem.replace(/___ \([^)]*\)/, it.answer) === s.it[0], "buco sbagliato in: " + s.it[0]);
  });
}

T.done();
