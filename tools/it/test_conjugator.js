/* Validates the conjugation engine against forms checked in the two source
 * grammars. Run: node tools/it/test_conjugator.js  */
var C = require("../lib/pack.js")("it", { upTo: "conjugator.js", includeStop: true }).Conj;
var fails = 0, checks = 0;

function eq(got, want, what) {
  checks++;
  if (got !== want) {
    fails++;
    console.log("FAIL " + what + "\n  atteso: " + want + "\n  ottenuto: " + got);
  }
}
function row(inf, tense, want) {
  eq(C.conjugate(inf, tense).join(" "), want.join(" "), inf + " / " + tense);
}

/* --- indicativo presente --- */
row("parlare", "presente", ["parlo","parli","parla","parliamo","parlate","parlano"]);
row("vendere", "presente", ["vendo","vendi","vende","vendiamo","vendete","vendono"]);
row("dormire", "presente", ["dormo","dormi","dorme","dormiamo","dormite","dormono"]);
row("finire", "presente", ["finisco","finisci","finisce","finiamo","finite","finiscono"]);
row("studiare", "presente", ["studio","studi","studia","studiamo","studiate","studiano"]);
row("mangiare", "presente", ["mangio","mangi","mangia","mangiamo","mangiate","mangiano"]);
row("cercare", "presente", ["cerco","cerchi","cerca","cerchiamo","cercate","cercano"]);
row("pagare", "presente", ["pago","paghi","paga","paghiamo","pagate","pagano"]);

/* --- imperfetto --- */
row("parlare", "imperfetto", ["parlavo","parlavi","parlava","parlavamo","parlavate","parlavano"]);
row("dormire", "imperfetto", ["dormivo","dormivi","dormiva","dormivamo","dormivate","dormivano"]);
row("capire", "imperfetto", ["capivo","capivi","capiva","capivamo","capivate","capivano"]);
row("essere", "imperfetto", ["ero","eri","era","eravamo","eravate","erano"]);
row("fare", "imperfetto", ["facevo","facevi","faceva","facevamo","facevate","facevano"]);
row("bere", "imperfetto", ["bevevo","bevevi","beveva","bevevamo","bevevate","bevevano"]);
row("tradurre", "imperfetto",
  ["traducevo","traducevi","traduceva","traducevamo","traducevate","traducevano"]);

/* --- futuro --- */
row("parlare", "futuro", ["parlerò","parlerai","parlerà","parleremo","parlerete","parleranno"]);
row("dormire", "futuro", ["dormirò","dormirai","dormirà","dormiremo","dormirete","dormiranno"]);
row("cercare", "futuro",
  ["cercherò","cercherai","cercherà","cercheremo","cercherete","cercheranno"]);
row("mangiare", "futuro",
  ["mangerò","mangerai","mangerà","mangeremo","mangerete","mangeranno"]);
row("studiare", "futuro",
  ["studierò","studierai","studierà","studieremo","studierete","studieranno"]);
row("essere", "futuro", ["sarò","sarai","sarà","saremo","sarete","saranno"]);
row("avere", "futuro", ["avrò","avrai","avrà","avremo","avrete","avranno"]);
row("venire", "futuro", ["verrò","verrai","verrà","verremo","verrete","verranno"]);
row("rimanere", "futuro",
  ["rimarrò","rimarrai","rimarrà","rimarremo","rimarrete","rimarranno"]);

/* --- condizionale --- */
row("parlare", "condizionale",
  ["parlerei","parleresti","parlerebbe","parleremmo","parlereste","parlerebbero"]);
row("essere", "condizionale",
  ["sarei","saresti","sarebbe","saremmo","sareste","sarebbero"]);
row("volere", "condizionale",
  ["vorrei","vorresti","vorrebbe","vorremmo","vorreste","vorrebbero"]);

/* --- congiuntivo presente (tavole del Routledge, cap. 24) --- */
row("parlare", "congiuntivo", ["parli","parli","parli","parliamo","parliate","parlino"]);
row("vendere", "congiuntivo", ["venda","venda","venda","vendiamo","vendiate","vendano"]);
row("dormire", "congiuntivo", ["dorma","dorma","dorma","dormiamo","dormiate","dormano"]);
row("finire", "congiuntivo", ["finisca","finisca","finisca","finiamo","finiate","finiscano"]);
row("cercare", "congiuntivo",
  ["cerchi","cerchi","cerchi","cerchiamo","cerchiate","cerchino"]);
row("mangiare", "congiuntivo",
  ["mangi","mangi","mangi","mangiamo","mangiate","mangino"]);
row("essere", "congiuntivo", ["sia","sia","sia","siamo","siate","siano"]);
row("fare", "congiuntivo",
  ["faccia","faccia","faccia","facciamo","facciate","facciano"]);

/* --- congiuntivo imperfetto --- */
row("parlare", "congImperfetto",
  ["parlassi","parlassi","parlasse","parlassimo","parlaste","parlassero"]);
row("vendere", "congImperfetto",
  ["vendessi","vendessi","vendesse","vendessimo","vendeste","vendessero"]);
row("dormire", "congImperfetto",
  ["dormissi","dormissi","dormisse","dormissimo","dormiste","dormissero"]);
row("essere", "congImperfetto",
  ["fossi","fossi","fosse","fossimo","foste","fossero"]);
row("fare", "congImperfetto",
  ["facessi","facessi","facesse","facessimo","faceste","facessero"]);
row("dare", "congImperfetto",
  ["dessi","dessi","desse","dessimo","deste","dessero"]);
row("stare", "congImperfetto",
  ["stessi","stessi","stesse","stessimo","steste","stessero"]);

/* --- passato remoto --- */
row("parlare", "passatoRemoto",
  ["parlai","parlasti","parlò","parlammo","parlaste","parlarono"]);
row("dormire", "passatoRemoto",
  ["dormii","dormisti","dormì","dormimmo","dormiste","dormirono"]);
row("essere", "passatoRemoto", ["fui","fosti","fu","fummo","foste","furono"]);
row("avere", "passatoRemoto", ["ebbi","avesti","ebbe","avemmo","aveste","ebbero"]);
row("fare", "passatoRemoto", ["feci","facesti","fece","facemmo","faceste","fecero"]);
row("dire", "passatoRemoto", ["dissi","dicesti","disse","dicemmo","diceste","dissero"]);
row("bere", "passatoRemoto", ["bevvi","bevesti","bevve","bevemmo","beveste","bevvero"]);
row("stare", "passatoRemoto", ["stetti","stesti","stette","stemmo","steste","stettero"]);
row("dare", "passatoRemoto", ["diedi","desti","diede","demmo","deste","diedero"]);
row("porre", "passatoRemoto", ["posi","ponesti","pose","ponemmo","poneste","posero"]);
row("tradurre", "passatoRemoto",
  ["tradussi","traducesti","tradusse","traducemmo","traduceste","tradussero"]);
row("trarre", "passatoRemoto", ["trassi","traesti","trasse","traemmo","traeste","trassero"]);
row("prendere", "passatoRemoto",
  ["presi","prendesti","prese","prendemmo","prendeste","presero"]);
row("conoscere", "passatoRemoto",
  ["conobbi","conoscesti","conobbe","conoscemmo","conosceste","conobbero"]);
row("nascere", "passatoRemoto",
  ["nacqui","nascesti","nacque","nascemmo","nasceste","nacquero"]);

/* --- tempi composti --- */
row("parlare", "passatoProssimo",
  ["ho parlato","hai parlato","ha parlato","abbiamo parlato","avete parlato","hanno parlato"]);
row("andare", "passatoProssimo",
  ["sono andato","sei andato","è andato","siamo andati","siete andati","sono andati"]);
row("alzarsi", "passatoProssimo",
  ["mi sono alzato","ti sei alzato","si è alzato",
   "ci siamo alzati","vi siete alzati","si sono alzati"]);
row("parlare", "congiuntivoPassato",
  ["abbia parlato","abbia parlato","abbia parlato",
   "abbiamo parlato","abbiate parlato","abbiano parlato"]);
row("partire", "congiuntivoPassato",
  ["sia partito","sia partito","sia partito",
   "siamo partiti","siate partiti","siano partiti"]);
row("parlare", "trapassatoProssimo",
  ["avevo parlato","avevi parlato","aveva parlato",
   "avevamo parlato","avevate parlato","avevano parlato"]);
row("parlare", "congiuntivoTrapassato",
  ["avessi parlato","avessi parlato","avesse parlato",
   "avessimo parlato","aveste parlato","avessero parlato"]);
row("parlare", "condizionalePassato",
  ["avrei parlato","avresti parlato","avrebbe parlato",
   "avremmo parlato","avreste parlato","avrebbero parlato"]);
row("parlare", "futuroAnteriore",
  ["avrò parlato","avrai parlato","avrà parlato",
   "avremo parlato","avrete parlato","avranno parlato"]);

/* --- participi e gerundi irregolari --- */
[["fare","fatto"],["dire","detto"],["scrivere","scritto"],["leggere","letto"],
 ["prendere","preso"],["mettere","messo"],["chiedere","chiesto"],["vedere","visto"],
 ["aprire","aperto"],["scegliere","scelto"],["rimanere","rimasto"],["vivere","vissuto"],
 ["essere","stato"],["nascere","nato"],["rompere","rotto"],["tradurre","tradotto"],
 ["parlare","parlato"],["vendere","venduto"],["dormire","dormito"]
].forEach(function (p) { eq(C.participle(p[0]), p[1], "participio " + p[0]); });

[["fare","facendo"],["dire","dicendo"],["bere","bevendo"],["porre","ponendo"],
 ["parlare","parlando"],["vendere","vendendo"],["dormire","dormendo"]
].forEach(function (p) { eq(C.gerund(p[0]), p[1], "gerundio " + p[0]); });

/* --- imperativo --- */
var i1 = C.imperative("parlare");
eq(i1.tu + "|" + i1.Lei + "|" + i1.noi + "|" + i1.voi,
   "parla|parli|parliamo|parlate", "imperativo parlare");
var i2 = C.imperative("prendere");
eq(i2.tu + "|" + i2.Lei, "prendi|prenda", "imperativo prendere");
var i3 = C.imperative("finire");
eq(i3.tu + "|" + i3.Lei, "finisci|finisca", "imperativo finire");
var i4 = C.imperative("essere");
eq(i4.tu + "|" + i4.Lei + "|" + i4.voi, "sii|sia|siate", "imperativo essere");
var i5 = C.imperative("alzarsi");
eq(i5.tu + "|" + i5.voi + "|" + i5.noi + "|" + i5.tuNeg,
   "alzati|alzatevi|alziamoci|non alzarti", "imperativo alzarsi");
var i6 = C.imperative("andare");
eq(i6.tu, "va'", "imperativo andare");

/* --- ogni verbo produce forme in ogni tempo, senza eccezioni --- */
C.list().forEach(function (v) {
  C.ALL_TENSES.forEach(function (t) {
    checks++;
    var f = C.conjugate(v, t);
    if (f.length !== 6 || f.some(function (x) { return !x || /undefined|NaN/.test(x); })) {
      fails++;
      console.log("FAIL forma vuota: " + v + " / " + t + " -> " + JSON.stringify(f));
    }
  });
});

console.log("\ncontrolli: " + checks + "   errori: " + fails);
process.exit(fails ? 1 : 0);
