/* Validates the conjugation engine against forms checked by hand in the
 * reference grammars (Bechara, Cegalla; tables of Priberam / Conjuga-me,
 * Brazilian norm, 1990 spelling).  Run: node tools/pt/test_conjugator.js      */
var C = require("../lib/pack.js")("pt", { upTo: "conjugator.js", includeStop: true }).Conj;
var fails = 0, checks = 0;

function eq(got, want, what) {
  checks++;
  if (got !== want) {
    fails++;
    console.log("FAIL " + what + "\n  esperado: " + want + "\n  obtenido: " + got);
  }
}
function row(inf, tense, want, opts) {
  var got;
  try { got = C.conjugate(inf, tense, opts).join(", "); } catch (e) { got = "ERROR " + e.message; }
  eq(got, want, inf + " / " + tense);
}
/* A whole table: { tense: "f1, f2, f3, f4, f5, f6" } */
function table(inf, t) { Object.keys(t).forEach(function (k) { row(inf, k, t[k]); }); }
function ter(pp) {       // the seven compound tenses with ter + participle
  var aux = {
    perfeitoComposto: ["tenho", "tens", "tem", "temos", "tendes", "têm"],
    maisQuePerfeitoComposto: ["tinha", "tinhas", "tinha", "tínhamos", "tínheis", "tinham"],
    futuroComposto: ["terei", "terás", "terá", "teremos", "tereis", "terão"],
    condicionalComposto: ["teria", "terias", "teria", "teríamos", "teríeis", "teriam"],
    subjPerfeito: ["tenha", "tenhas", "tenha", "tenhamos", "tenhais", "tenham"],
    subjMaisQuePerfeito: ["tivesse", "tivesses", "tivesse", "tivéssemos", "tivésseis", "tivessem"],
    subjFuturoComposto: ["tiver", "tiveres", "tiver", "tivermos", "tiverdes", "tiverem"]
  }, out = {};
  Object.keys(aux).forEach(function (k) {
    out[k] = aux[k].map(function (a) { return a + " " + pp; }).join(", ");
  });
  return out;
}

/* ================================================= tablas completas ===== */

table("ser", {
  presente: "sou, és, é, somos, sois, são",
  perfeito: "fui, foste, foi, fomos, fostes, foram",
  imperfeito: "era, eras, era, éramos, éreis, eram",
  maisQuePerfeito: "fora, foras, fora, fôramos, fôreis, foram",
  futuro: "serei, serás, será, seremos, sereis, serão",
  condicional: "seria, serias, seria, seríamos, seríeis, seriam",
  subjPresente: "seja, sejas, seja, sejamos, sejais, sejam",
  subjImperfeito: "fosse, fosses, fosse, fôssemos, fôsseis, fossem",
  subjFuturo: "for, fores, for, formos, fordes, forem",
  infPessoal: "ser, seres, ser, sermos, serdes, serem"
});
table("ser", ter("sido"));

table("estar", {
  presente: "estou, estás, está, estamos, estais, estão",
  perfeito: "estive, estiveste, esteve, estivemos, estivestes, estiveram",
  imperfeito: "estava, estavas, estava, estávamos, estáveis, estavam",
  maisQuePerfeito: "estivera, estiveras, estivera, estivéramos, estivéreis, estiveram",
  futuro: "estarei, estarás, estará, estaremos, estareis, estarão",
  condicional: "estaria, estarias, estaria, estaríamos, estaríeis, estariam",
  subjPresente: "esteja, estejas, esteja, estejamos, estejais, estejam",
  subjImperfeito: "estivesse, estivesses, estivesse, estivéssemos, estivésseis, estivessem",
  subjFuturo: "estiver, estiveres, estiver, estivermos, estiverdes, estiverem",
  infPessoal: "estar, estares, estar, estarmos, estardes, estarem"
});
table("estar", ter("estado"));

table("ter", {
  presente: "tenho, tens, tem, temos, tendes, têm",
  perfeito: "tive, tiveste, teve, tivemos, tivestes, tiveram",
  imperfeito: "tinha, tinhas, tinha, tínhamos, tínheis, tinham",
  maisQuePerfeito: "tivera, tiveras, tivera, tivéramos, tivéreis, tiveram",
  futuro: "terei, terás, terá, teremos, tereis, terão",
  condicional: "teria, terias, teria, teríamos, teríeis, teriam",
  subjPresente: "tenha, tenhas, tenha, tenhamos, tenhais, tenham",
  subjImperfeito: "tivesse, tivesses, tivesse, tivéssemos, tivésseis, tivessem",
  subjFuturo: "tiver, tiveres, tiver, tivermos, tiverdes, tiverem",
  infPessoal: "ter, teres, ter, termos, terdes, terem"
});
table("ter", ter("tido"));

table("ir", {
  presente: "vou, vais, vai, vamos, ides, vão",
  perfeito: "fui, foste, foi, fomos, fostes, foram",
  imperfeito: "ia, ias, ia, íamos, íeis, iam",
  maisQuePerfeito: "fora, foras, fora, fôramos, fôreis, foram",
  futuro: "irei, irás, irá, iremos, ireis, irão",
  condicional: "iria, irias, iria, iríamos, iríeis, iriam",
  subjPresente: "vá, vás, vá, vamos, vades, vão",
  subjImperfeito: "fosse, fosses, fosse, fôssemos, fôsseis, fossem",
  subjFuturo: "for, fores, for, formos, fordes, forem",
  infPessoal: "ir, ires, ir, irmos, irdes, irem"
});
table("ir", ter("ido"));

table("fazer", {
  presente: "faço, fazes, faz, fazemos, fazeis, fazem",
  perfeito: "fiz, fizeste, fez, fizemos, fizestes, fizeram",
  imperfeito: "fazia, fazias, fazia, fazíamos, fazíeis, faziam",
  maisQuePerfeito: "fizera, fizeras, fizera, fizéramos, fizéreis, fizeram",
  futuro: "farei, farás, fará, faremos, fareis, farão",
  condicional: "faria, farias, faria, faríamos, faríeis, fariam",
  subjPresente: "faça, faças, faça, façamos, façais, façam",
  subjImperfeito: "fizesse, fizesses, fizesse, fizéssemos, fizésseis, fizessem",
  subjFuturo: "fizer, fizeres, fizer, fizermos, fizerdes, fizerem",
  infPessoal: "fazer, fazeres, fazer, fazermos, fazerdes, fazerem"
});
table("fazer", ter("feito"));

table("pôr", {
  presente: "ponho, pões, põe, pomos, pondes, põem",
  perfeito: "pus, puseste, pôs, pusemos, pusestes, puseram",
  imperfeito: "punha, punhas, punha, púnhamos, púnheis, punham",
  maisQuePerfeito: "pusera, puseras, pusera, puséramos, puséreis, puseram",
  futuro: "porei, porás, porá, poremos, poreis, porão",
  condicional: "poria, porias, poria, poríamos, poríeis, poriam",
  subjPresente: "ponha, ponhas, ponha, ponhamos, ponhais, ponham",
  subjImperfeito: "pusesse, pusesses, pusesse, puséssemos, pusésseis, pusessem",
  subjFuturo: "puser, puseres, puser, pusermos, puserdes, puserem",
  infPessoal: "pôr, pores, pôr, pormos, pordes, porem"
});
table("pôr", ter("posto"));

table("vir", {
  presente: "venho, vens, vem, vimos, vindes, vêm",
  perfeito: "vim, vieste, veio, viemos, viestes, vieram",
  imperfeito: "vinha, vinhas, vinha, vínhamos, vínheis, vinham",
  maisQuePerfeito: "viera, vieras, viera, viéramos, viéreis, vieram",
  futuro: "virei, virás, virá, viremos, vireis, virão",
  condicional: "viria, virias, viria, viríamos, viríeis, viriam",
  subjPresente: "venha, venhas, venha, venhamos, venhais, venham",
  subjImperfeito: "viesse, viesses, viesse, viéssemos, viésseis, viessem",
  subjFuturo: "vier, vieres, vier, viermos, vierdes, vierem",
  infPessoal: "vir, vires, vir, virmos, virdes, virem"
});
table("vir", ter("vindo"));

table("ver", {
  presente: "vejo, vês, vê, vemos, vedes, veem",
  perfeito: "vi, viste, viu, vimos, vistes, viram",
  imperfeito: "via, vias, via, víamos, víeis, viam",
  maisQuePerfeito: "vira, viras, vira, víramos, víreis, viram",
  futuro: "verei, verás, verá, veremos, vereis, verão",
  condicional: "veria, verias, veria, veríamos, veríeis, veriam",
  subjPresente: "veja, vejas, veja, vejamos, vejais, vejam",
  subjImperfeito: "visse, visses, visse, víssemos, vísseis, vissem",
  subjFuturo: "vir, vires, vir, virmos, virdes, virem",
  infPessoal: "ver, veres, ver, vermos, verdes, verem"
});
table("ver", ter("visto"));

/* --- modelos regulares completos --- */
table("falar", {
  presente: "falo, falas, fala, falamos, falais, falam",
  perfeito: "falei, falaste, falou, falamos, falastes, falaram",
  imperfeito: "falava, falavas, falava, falávamos, faláveis, falavam",
  maisQuePerfeito: "falara, falaras, falara, faláramos, faláreis, falaram",
  futuro: "falarei, falarás, falará, falaremos, falareis, falarão",
  condicional: "falaria, falarias, falaria, falaríamos, falaríeis, falariam",
  subjPresente: "fale, fales, fale, falemos, faleis, falem",
  subjImperfeito: "falasse, falasses, falasse, falássemos, falásseis, falassem",
  subjFuturo: "falar, falares, falar, falarmos, falardes, falarem",
  infPessoal: "falar, falares, falar, falarmos, falardes, falarem"
});
table("falar", ter("falado"));
table("comer", {
  presente: "como, comes, come, comemos, comeis, comem",
  perfeito: "comi, comeste, comeu, comemos, comestes, comeram",
  imperfeito: "comia, comias, comia, comíamos, comíeis, comiam",
  maisQuePerfeito: "comera, comeras, comera, comêramos, comêreis, comeram",
  futuro: "comerei, comerás, comerá, comeremos, comereis, comerão",
  condicional: "comeria, comerias, comeria, comeríamos, comeríeis, comeriam",
  subjPresente: "coma, comas, coma, comamos, comais, comam",
  subjImperfeito: "comesse, comesses, comesse, comêssemos, comêsseis, comessem",
  subjFuturo: "comer, comeres, comer, comermos, comerdes, comerem",
  infPessoal: "comer, comeres, comer, comermos, comerdes, comerem"
});
table("partir", {
  presente: "parto, partes, parte, partimos, partis, partem",
  perfeito: "parti, partiste, partiu, partimos, partistes, partiram",
  imperfeito: "partia, partias, partia, partíamos, partíeis, partiam",
  maisQuePerfeito: "partira, partiras, partira, partíramos, partíreis, partiram",
  futuro: "partirei, partirás, partirá, partiremos, partireis, partirão",
  condicional: "partiria, partirias, partiria, partiríamos, partiríeis, partiriam",
  subjPresente: "parta, partas, parta, partamos, partais, partam",
  subjImperfeito: "partisse, partisses, partisse, partíssemos, partísseis, partissem",
  subjFuturo: "partir, partires, partir, partirmos, partirdes, partirem",
  infPessoal: "partir, partires, partir, partirmos, partirdes, partirem"
});

/* --- otros irregulares --- */
table("haver", {
  presente: "hei, hás, há, havemos, haveis, hão",
  perfeito: "houve, houveste, houve, houvemos, houvestes, houveram",
  imperfeito: "havia, havias, havia, havíamos, havíeis, haviam",
  subjPresente: "haja, hajas, haja, hajamos, hajais, hajam",
  subjImperfeito: "houvesse, houvesses, houvesse, houvéssemos, houvésseis, houvessem",
  subjFuturo: "houver, houveres, houver, houvermos, houverdes, houverem"
});
table("dizer", {
  presente: "digo, dizes, diz, dizemos, dizeis, dizem",
  perfeito: "disse, disseste, disse, dissemos, dissestes, disseram",
  futuro: "direi, dirás, dirá, diremos, direis, dirão",
  condicional: "diria, dirias, diria, diríamos, diríeis, diriam",
  subjPresente: "diga, digas, diga, digamos, digais, digam",
  subjImperfeito: "dissesse, dissesses, dissesse, disséssemos, dissésseis, dissessem",
  subjFuturo: "disser, disseres, disser, dissermos, disserdes, disserem"
});
table("trazer", {
  presente: "trago, trazes, traz, trazemos, trazeis, trazem",
  perfeito: "trouxe, trouxeste, trouxe, trouxemos, trouxestes, trouxeram",
  futuro: "trarei, trarás, trará, traremos, trareis, trarão",
  condicional: "traria, trarias, traria, traríamos, traríeis, trariam",
  subjPresente: "traga, tragas, traga, tragamos, tragais, tragam",
  subjFuturo: "trouxer, trouxeres, trouxer, trouxermos, trouxerdes, trouxerem"
});
table("poder", {
  presente: "posso, podes, pode, podemos, podeis, podem",
  perfeito: "pude, pudeste, pôde, pudemos, pudestes, puderam",
  subjPresente: "possa, possas, possa, possamos, possais, possam",
  subjImperfeito: "pudesse, pudesses, pudesse, pudéssemos, pudésseis, pudessem",
  subjFuturo: "puder, puderes, puder, pudermos, puderdes, puderem"
});
table("querer", {
  presente: "quero, queres, quer, queremos, quereis, querem",
  perfeito: "quis, quiseste, quis, quisemos, quisestes, quiseram",
  subjPresente: "queira, queiras, queira, queiramos, queirais, queiram",
  subjImperfeito: "quisesse, quisesses, quisesse, quiséssemos, quisésseis, quisessem",
  subjFuturo: "quiser, quiseres, quiser, quisermos, quiserdes, quiserem"
});
table("saber", {
  presente: "sei, sabes, sabe, sabemos, sabeis, sabem",
  perfeito: "soube, soubeste, soube, soubemos, soubestes, souberam",
  subjPresente: "saiba, saibas, saiba, saibamos, saibais, saibam",
  subjFuturo: "souber, souberes, souber, soubermos, souberdes, souberem"
});
table("caber", {
  presente: "caibo, cabes, cabe, cabemos, cabeis, cabem",
  perfeito: "coube, coubeste, coube, coubemos, coubestes, couberam",
  subjPresente: "caiba, caibas, caiba, caibamos, caibais, caibam",
  subjImperfeito: "coubesse, coubesses, coubesse, coubéssemos, coubésseis, coubessem"
});
table("dar", {
  presente: "dou, dás, dá, damos, dais, dão",
  perfeito: "dei, deste, deu, demos, destes, deram",
  maisQuePerfeito: "dera, deras, dera, déramos, déreis, deram",
  subjPresente: "dê, dês, dê, demos, deis, deem",
  subjImperfeito: "desse, desses, desse, déssemos, désseis, dessem",
  subjFuturo: "der, deres, der, dermos, derdes, derem"
});
table("ler", {
  presente: "leio, lês, lê, lemos, ledes, leem",
  perfeito: "li, leste, leu, lemos, lestes, leram",
  imperfeito: "lia, lias, lia, líamos, líeis, liam",
  subjPresente: "leia, leias, leia, leiamos, leiais, leiam",
  subjImperfeito: "lesse, lesses, lesse, lêssemos, lêsseis, lessem"
});
table("crer", {
  presente: "creio, crês, crê, cremos, credes, creem",
  perfeito: "cri, creste, creu, cremos, crestes, creram",
  subjPresente: "creia, creias, creia, creiamos, creiais, creiam"
});
table("ouvir", {
  presente: "ouço, ouves, ouve, ouvimos, ouvis, ouvem",
  subjPresente: "ouça, ouças, ouça, ouçamos, ouçais, ouçam"
});
table("pedir", {
  presente: "peço, pedes, pede, pedimos, pedis, pedem",
  subjPresente: "peça, peças, peça, peçamos, peçais, peçam"
});
table("medir", { presente: "meço, medes, mede, medimos, medis, medem" });
table("perder", {
  presente: "perco, perdes, perde, perdemos, perdeis, perdem",
  subjPresente: "perca, percas, perca, percamos, percais, percam"
});
table("valer", {
  presente: "valho, vales, vale, valemos, valeis, valem",
  subjPresente: "valha, valhas, valha, valhamos, valhais, valham"
});
table("sair", {
  presente: "saio, sais, sai, saímos, saís, saem",
  perfeito: "saí, saíste, saiu, saímos, saístes, saíram",
  imperfeito: "saía, saías, saía, saíamos, saíeis, saíam",
  maisQuePerfeito: "saíra, saíras, saíra, saíramos, saíreis, saíram",
  futuro: "sairei, sairás, sairá, sairemos, saireis, sairão",
  subjPresente: "saia, saias, saia, saiamos, saiais, saiam",
  subjImperfeito: "saísse, saísses, saísse, saíssemos, saísseis, saíssem",
  subjFuturo: "sair, saíres, sair, sairmos, sairdes, saírem",
  infPessoal: "sair, saíres, sair, sairmos, sairdes, saírem"
});
table("cair", {
  presente: "caio, cais, cai, caímos, caís, caem",
  perfeito: "caí, caíste, caiu, caímos, caístes, caíram"
});
table("rir", {
  presente: "rio, ris, ri, rimos, rides, riem",
  perfeito: "ri, riste, riu, rimos, ristes, riram",
  subjPresente: "ria, rias, ria, riamos, riais, riam"
});
table("sorrir", { presente: "sorrio, sorris, sorri, sorrimos, sorrides, sorriem" });
table("requerer", {
  presente: "requeiro, requeres, requer, requeremos, requereis, requerem",
  perfeito: "requeri, requereste, requereu, requeremos, requerestes, requereram",
  subjPresente: "requeira, requeiras, requeira, requeiramos, requeirais, requeiram"
});
table("prover", {
  presente: "provejo, provês, provê, provemos, provedes, proveem",
  perfeito: "provi, proveste, proveu, provemos, provestes, proveram",
  subjPresente: "proveja, provejas, proveja, provejamos, provejais, provejam"
});
table("reaver", {
  perfeito: "reouve, reouveste, reouve, reouvemos, reouvestes, reouveram",
  imperfeito: "reavia, reavias, reavia, reavíamos, reavíeis, reaviam",
  subjImperfeito: "reouvesse, reouvesses, reouvesse, reouvéssemos, reouvésseis, reouvessem"
});
eq(C.conjugate("reaver", "presente", { partial: true }).slice(3, 5).join(","), "reavemos,reaveis", "reaver presente (defectivo)");
eq((function () { try { C.conjugate("reaver", "presente"); return "sin error"; } catch (e) { return "error"; } })(),
   "error", "reaver presente completo: defectivo");
eq(C.imperative("reaver"), null, "reaver sin imperativo");
table("dormir", {
  presente: "durmo, dormes, dorme, dormimos, dormis, dormem",
  subjPresente: "durma, durmas, durma, durmamos, durmais, durmam"
});

/* --- derivados --- */
table("manter", {
  presente: "mantenho, manténs, mantém, mantemos, mantendes, mantêm",
  perfeito: "mantive, mantiveste, manteve, mantivemos, mantivestes, mantiveram",
  subjImperfeito: "mantivesse, mantivesses, mantivesse, mantivéssemos, mantivésseis, mantivessem"
});
table("conter", { presente: "contenho, conténs, contém, contemos, contendes, contêm" });
table("obter", {
  presente: "obtenho, obténs, obtém, obtemos, obtendes, obtêm",
  perfeito: "obtive, obtiveste, obteve, obtivemos, obtivestes, obtiveram",
  subjFuturo: "obtiver, obtiveres, obtiver, obtivermos, obtiverdes, obtiverem"
});
table("deter", { perfeito: "detive, detiveste, deteve, detivemos, detivestes, detiveram" });
table("reter", { presente: "retenho, reténs, retém, retemos, retendes, retêm" });
table("entreter", { presente: "entretenho, entreténs, entretém, entretemos, entretendes, entretêm" });
table("abster-se", { presente: "me abstenho, te absténs, se abstém, nos abstemos, vos abstendes, se abstêm" });
table("intervir", {
  presente: "intervenho, intervéns, intervém, intervimos, intervindes, intervêm",
  perfeito: "intervim, intervieste, interveio, interviemos, interviestes, intervieram",
  subjFuturo: "intervier, intervieres, intervier, interviermos, intervierdes, intervierem"
});
table("convir", { presente: "convenho, convéns, convém, convimos, convindes, convêm" });
table("provir", { perfeito: "provim, provieste, proveio, proviemos, proviestes, provieram" });
table("propor", {
  presente: "proponho, propões, propõe, propomos, propondes, propõem",
  perfeito: "propus, propuseste, propôs, propusemos, propusestes, propuseram",
  imperfeito: "propunha, propunhas, propunha, propúnhamos, propúnheis, propunham",
  futuro: "proporei, proporás, proporá, proporemos, proporeis, proporão",
  subjFuturo: "propuser, propuseres, propuser, propusermos, propuserdes, propuserem",
  infPessoal: "propor, propores, propor, propormos, propordes, proporem"
});
table("compor", { perfeito: "compus, compuseste, compôs, compusemos, compusestes, compuseram" });
table("supor", { subjImperfeito: "supusesse, supusesses, supusesse, supuséssemos, supusésseis, supusessem" });
table("dispor", { presente: "disponho, dispões, dispõe, dispomos, dispondes, dispõem" });
table("impor", { subjPresente: "imponha, imponhas, imponha, imponhamos, imponhais, imponham" });
table("repor", { perfeito: "repus, repuseste, repôs, repusemos, repusestes, repuseram" });
table("expor", { presente: "exponho, expões, expõe, expomos, expondes, expõem" });
table("prever", {
  presente: "prevejo, prevês, prevê, prevemos, prevedes, preveem",
  perfeito: "previ, previste, previu, previmos, previstes, previram",
  subjFuturo: "previr, previres, previr, previrmos, previrdes, previrem"
});
table("rever", { presente: "revejo, revês, revê, revemos, revedes, reveem" });
table("desfazer", { perfeito: "desfiz, desfizeste, desfez, desfizemos, desfizestes, desfizeram" });
table("refazer", { futuro: "refarei, refarás, refará, refaremos, refareis, refarão" });
table("satisfazer", {
  presente: "satisfaço, satisfazes, satisfaz, satisfazemos, satisfazeis, satisfazem",
  perfeito: "satisfiz, satisfizeste, satisfez, satisfizemos, satisfizestes, satisfizeram"
});
table("contradizer", { perfeito: "contradisse, contradisseste, contradisse, contradissemos, contradissestes, contradisseram" });
table("conseguir", {
  presente: "consigo, consegues, consegue, conseguimos, conseguis, conseguem",
  subjPresente: "consiga, consigas, consiga, consigamos, consigais, consigam"
});
table("perseguir", { presente: "persigo, persegues, persegue, perseguimos, perseguis, perseguem" });

/* ================================================ ortografía y alternancias */
table("ficar", {
  perfeito: "fiquei, ficaste, ficou, ficamos, ficastes, ficaram",
  subjPresente: "fique, fiques, fique, fiquemos, fiqueis, fiquem"
});
table("chegar", {
  perfeito: "cheguei, chegaste, chegou, chegamos, chegastes, chegaram",
  subjPresente: "chegue, chegues, chegue, cheguemos, chegueis, cheguem"
});
table("começar", {
  perfeito: "comecei, começaste, começou, começamos, começastes, começaram",
  subjPresente: "comece, comeces, comece, comecemos, comeceis, comecem"
});
table("conhecer", {
  presente: "conheço, conheces, conhece, conhecemos, conheceis, conhecem",
  subjPresente: "conheça, conheças, conheça, conheçamos, conheçais, conheçam"
});
table("proteger", {
  presente: "protejo, proteges, protege, protegemos, protegeis, protegem",
  subjPresente: "proteja, protejas, proteja, protejamos, protejais, protejam"
});
table("dirigir", { presente: "dirijo, diriges, dirige, dirigimos, dirigis, dirigem" });
table("seguir", {
  presente: "sigo, segues, segue, seguimos, seguis, seguem",
  imperfeito: "seguia, seguias, seguia, seguíamos, seguíeis, seguiam",
  subjPresente: "siga, sigas, siga, sigamos, sigais, sigam"
});
table("erguer", { presente: "ergo, ergues, ergue, erguemos, ergueis, erguem" });
table("distinguir", { presente: "distingo, distingues, distingue, distinguimos, distinguis, distinguem" });
table("passear", {
  presente: "passeio, passeias, passeia, passeamos, passeais, passeiam",
  perfeito: "passeei, passeaste, passeou, passeamos, passeastes, passearam",
  subjPresente: "passeie, passeies, passeie, passeemos, passeeis, passeiem"
});
table("odiar", {
  presente: "odeio, odeias, odeia, odiamos, odiais, odeiam",
  subjPresente: "odeie, odeies, odeie, odiemos, odieis, odeiem"
});
table("ansiar", { presente: "anseio, anseias, anseia, ansiamos, ansiais, anseiam" });
table("remediar", { presente: "remedeio, remedeias, remedeia, remediamos, remediais, remedeiam" });
table("incendiar", { presente: "incendeio, incendeias, incendeia, incendiamos, incendiais, incendeiam" });
table("mediar", { presente: "medeio, medeias, medeia, mediamos, mediais, medeiam" });
table("enviar", {
  presente: "envio, envias, envia, enviamos, enviais, enviam",
  subjPresente: "envie, envies, envie, enviemos, envieis, enviem"
});
table("voar", {
  presente: "voo, voas, voa, voamos, voais, voam",
  perfeito: "voei, voaste, voou, voamos, voastes, voaram"
});
table("incluir", {
  presente: "incluo, incluis, inclui, incluímos, incluís, incluem",
  perfeito: "incluí, incluíste, incluiu, incluímos, incluístes, incluíram",
  imperfeito: "incluía, incluías, incluía, incluíamos, incluíeis, incluíam",
  subjFuturo: "incluir, incluíres, incluir, incluirmos, incluirdes, incluírem"
});
table("possuir", { presente: "possuo, possuis, possui, possuímos, possuís, possuem" });
table("influir", { presente: "influo, influis, influi, influímos, influís, influem" });
table("construir", {
  presente: "construo, constróis, constrói, construímos, construís, constroem",
  perfeito: "construí, construíste, construiu, construímos, construístes, construíram"
});
table("destruir", { presente: "destruo, destróis, destrói, destruímos, destruís, destroem" });
table("traduzir", { presente: "traduzo, traduzes, traduz, traduzimos, traduzis, traduzem" });
table("produzir", { presente: "produzo, produzes, produz, produzimos, produzis, produzem" });
table("preferir", {
  presente: "prefiro, preferes, prefere, preferimos, preferis, preferem",
  subjPresente: "prefira, prefiras, prefira, prefiramos, prefirais, prefiram"
});
table("sentir", { presente: "sinto, sentes, sente, sentimos, sentis, sentem" });
table("vestir", { presente: "visto, vestes, veste, vestimos, vestis, vestem" });
table("servir", { presente: "sirvo, serves, serve, servimos, servis, servem" });
table("repetir", { presente: "repito, repetes, repete, repetimos, repetis, repetem" });
table("mentir", { subjPresente: "minta, mintas, minta, mintamos, mintais, mintam" });
table("sugerir", { presente: "sugiro, sugeres, sugere, sugerimos, sugeris, sugerem" });
table("divertir-se", { presente: "me divirto, te divertes, se diverte, nos divertimos, vos divertis, se divertem" });
table("tossir", { presente: "tusso, tosses, tosse, tossimos, tossis, tossem" });
table("cobrir", { presente: "cubro, cobres, cobre, cobrimos, cobris, cobrem" });
table("descobrir", { subjPresente: "descubra, descubras, descubra, descubramos, descubrais, descubram" });
table("engolir", { presente: "engulo, engoles, engole, engolimos, engolis, engolem" });
table("subir", {
  presente: "subo, sobes, sobe, subimos, subis, sobem",
  subjPresente: "suba, subas, suba, subamos, subais, subam"
});
table("fugir", {
  presente: "fujo, foges, foge, fugimos, fugis, fogem",
  subjPresente: "fuja, fujas, fuja, fujamos, fujais, fujam"
});
table("consumir", { presente: "consumo, consomes, consome, consumimos, consumis, consomem" });
table("polir", { presente: "pulo, pules, pule, polimos, polis, pulem" });
table("agredir", { presente: "agrido, agrides, agride, agredimos, agredis, agridem" });
table("prevenir", { presente: "previno, prevines, previne, prevenimos, prevenis, previnem" });
table("proibir", { presente: "proíbo, proíbes, proíbe, proibimos, proibis, proíbem" });
table("reunir", { presente: "reúno, reúnes, reúne, reunimos, reunis, reúnem" });
table("doer", { presente: "doo, dóis, dói, doemos, doeis, doem" });

/* --- tildes que el hispanohablante olvida --- */
[["poder", "perfeito", 2, "pôde"], ["poder", "presente", 2, "pode"],
 ["ter", "presente", 5, "têm"], ["ter", "presente", 2, "tem"],
 ["vir", "presente", 5, "vêm"], ["vir", "presente", 2, "vem"],
 ["conter", "presente", 5, "contêm"], ["intervir", "presente", 5, "intervêm"],
 ["ler", "presente", 2, "lê"], ["ler", "presente", 5, "leem"],
 ["ver", "presente", 5, "veem"], ["crer", "presente", 5, "creem"], ["crer", "presente", 2, "crê"],
 ["dar", "subjPresente", 0, "dê"], ["dar", "subjPresente", 5, "deem"],
 ["pôr", "perfeito", 2, "pôs"], ["ser", "subjImperfeito", 3, "fôssemos"],
 ["falar", "imperfeito", 3, "falávamos"], ["falar", "subjImperfeito", 3, "falássemos"],
 ["comer", "subjImperfeito", 4, "comêsseis"], ["ter", "imperfeito", 3, "tínhamos"],
 ["estar", "presente", 1, "estás"], ["ir", "subjPresente", 0, "vá"]
].forEach(function (c) { eq(C.conjugate(c[0], c[1])[c[2]], c[3], c[0] + " " + c[1] + "[" + c[2] + "]"); });

/* ============================================ infinitivo pessoal / fut subj */
row("estudar", "infPessoal", "estudar, estudares, estudar, estudarmos, estudardes, estudarem");
row("saber", "infPessoal", "saber, saberes, saber, sabermos, saberdes, saberem");
row("chegar", "subjFuturo", "chegar, chegares, chegar, chegarmos, chegardes, chegarem");
row("querer", "subjFuturo", "quiser, quiseres, quiser, quisermos, quiserdes, quiserem");
row("sair", "subjFuturo", "sair, saíres, sair, sairmos, sairdes, saírem");

/* ================================================ compuestos (con ter) ===== */
row("fazer", "perfeitoComposto", "tenho feito, tens feito, tem feito, temos feito, tendes feito, têm feito");
row("dizer", "maisQuePerfeitoComposto", "tinha dito, tinhas dito, tinha dito, tínhamos dito, tínheis dito, tinham dito");
row("escrever", "futuroComposto", "terei escrito, terás escrito, terá escrito, teremos escrito, tereis escrito, terão escrito");
row("abrir", "condicionalComposto", "teria aberto, terias aberto, teria aberto, teríamos aberto, teríeis aberto, teriam aberto");
row("chegar", "subjPerfeito", "tenha chegado, tenhas chegado, tenha chegado, tenhamos chegado, tenhais chegado, tenham chegado");
row("saber", "subjMaisQuePerfeito", "tivesse sabido, tivesses sabido, tivesse sabido, tivéssemos sabido, tivésseis sabido, tivessem sabido");
row("ver", "subjFuturoComposto", "tiver visto, tiveres visto, tiver visto, tivermos visto, tiverdes visto, tiverem visto");
row("fazer", "maisQuePerfeitoComposto", "havia feito, havias feito, havia feito, havíamos feito, havíeis feito, haviam feito", { aux: "haver" });
// double participles: regular with ter, except pagar/ganhar/gastar
eq(C.conjugate("pagar", "perfeitoComposto")[0], "tenho pago", "tenho pago");
eq(C.conjugate("ganhar", "maisQuePerfeitoComposto")[2], "tinha ganho", "tinha ganho");
eq(C.conjugate("gastar", "maisQuePerfeitoComposto")[5], "tinham gasto", "tinham gasto");
eq(C.conjugate("aceitar", "maisQuePerfeitoComposto")[0], "tinha aceitado", "tinha aceitado");
eq(C.conjugate("entregar", "perfeitoComposto")[2], "tem entregado", "tem entregado");
eq(C.conjugate("morrer", "maisQuePerfeitoComposto")[2], "tinha morrido", "tinha morrido");
eq(C.conjugate("imprimir", "maisQuePerfeitoComposto")[0], "tinha imprimido", "tinha imprimido");
eq(C.conjugate("pôr", "subjPerfeito")[0], "tenha posto", "tenha posto");
eq(C.conjugate("vir", "perfeitoComposto")[5], "têm vindo", "têm vindo");

/* ================================================ participios y gerundios */
[["fazer", "feito"], ["dizer", "dito"], ["escrever", "escrito"], ["descrever", "descrito"],
 ["abrir", "aberto"], ["cobrir", "coberto"], ["descobrir", "descoberto"], ["pôr", "posto"],
 ["propor", "proposto"], ["ver", "visto"], ["prever", "previsto"], ["vir", "vindo"],
 ["intervir", "intervindo"], ["satisfazer", "satisfeito"], ["desfazer", "desfeito"],
 ["ser", "sido"], ["estar", "estado"], ["ter", "tido"], ["manter", "mantido"], ["ir", "ido"],
 ["trazer", "trazido"], ["ler", "lido"], ["sair", "saído"], ["cair", "caído"],
 ["incluir", "incluído"], ["construir", "construído"], ["falar", "falado"],
 ["comer", "comido"], ["partir", "partido"], ["levantar-se", "levantado"],
 ["pagar", "pago"], ["ganhar", "ganho"], ["gastar", "gasto"], ["aceitar", "aceito"],
 ["entregar", "entregue"], ["eleger", "eleito"], ["morrer", "morto"], ["prender", "preso"],
 ["salvar", "salvo"], ["acender", "aceso"], ["imprimir", "impresso"], ["limpar", "limpo"],
 ["soltar", "solto"], ["suspender", "suspenso"]
].forEach(function (p) { eq(C.participle(p[0]), p[1], "particípio " + p[0]); });

function pps(inf) { var p = C.participles(inf); return [p.regular, p.irregular, p.ter, p.ser].join("|"); }
eq(pps("pagar"), "pagado|pago|pago|pago", "particípios pagar");
eq(pps("ganhar"), "ganhado|ganho|ganho|ganho", "particípios ganhar");
eq(pps("gastar"), "gastado|gasto|gasto|gasto", "particípios gastar");
eq(pps("aceitar"), "aceitado|aceito|aceitado|aceito", "particípios aceitar");
eq(pps("entregar"), "entregado|entregue|entregado|entregue", "particípios entregar");
eq(pps("eleger"), "elegido|eleito|elegido|eleito", "particípios eleger");
eq(pps("morrer"), "morrido|morto|morrido|morto", "particípios morrer");
eq(pps("prender"), "prendido|preso|prendido|preso", "particípios prender");
eq(pps("salvar"), "salvado|salvo|salvado|salvo", "particípios salvar");
eq(pps("acender"), "acendido|aceso|acendido|aceso", "particípios acender");
eq(pps("imprimir"), "imprimido|impresso|imprimido|impresso", "particípios imprimir");
eq(pps("limpar"), "limpado|limpo|limpado|limpo", "particípios limpar");
eq(pps("soltar"), "soltado|solto|soltado|solto", "particípios soltar");
eq(pps("suspender"), "suspendido|suspenso|suspendido|suspenso", "particípios suspender");
eq(pps("fazer"), "|feito|feito|feito", "particípios fazer");
eq(pps("falar"), "falado||falado|falado", "particípios falar");

[["falar", "falando"], ["comer", "comendo"], ["partir", "partindo"], ["pôr", "pondo"],
 ["propor", "propondo"], ["ir", "indo"], ["vir", "vindo"], ["ver", "vendo"], ["ser", "sendo"],
 ["sair", "saindo"], ["construir", "construindo"], ["levantar-se", "levantando"], ["ler", "lendo"]
].forEach(function (p) { eq(C.gerund(p[0]), p[1], "gerúndio " + p[0]); });

/* ================================================ imperativo ============== */
function imp(inf) {
  var i = C.imperative(inf);
  return [i.tu, i["você"], i["nós"], i["vós"], i["vocês"]].join("|") + " / " +
         [i.neg.tu, i.neg["você"], i.neg["nós"], i.neg["vós"], i.neg["vocês"]].join("|");
}
eq(imp("falar"), "fala|fale|falemos|falai|falem / não fales|não fale|não falemos|não faleis|não falem", "imperativo falar");
eq(imp("comer"), "come|coma|comamos|comei|comam / não comas|não coma|não comamos|não comais|não comam", "imperativo comer");
eq(imp("partir"), "parte|parta|partamos|parti|partam / não partas|não parta|não partamos|não partais|não partam", "imperativo partir");
eq(imp("ser"), "sê|seja|sejamos|sede|sejam / não sejas|não seja|não sejamos|não sejais|não sejam", "imperativo ser");
eq(imp("estar"), "está|esteja|estejamos|estai|estejam / não estejas|não esteja|não estejamos|não estejais|não estejam", "imperativo estar");
eq(imp("ir"), "vai|vá|vamos|ide|vão / não vás|não vá|não vamos|não vades|não vão", "imperativo ir");
eq(imp("ter"), "tem|tenha|tenhamos|tende|tenham / não tenhas|não tenha|não tenhamos|não tenhais|não tenham", "imperativo ter");
eq(imp("vir"), "vem|venha|venhamos|vinde|venham / não venhas|não venha|não venhamos|não venhais|não venham", "imperativo vir");
eq(imp("fazer"), "faz|faça|façamos|fazei|façam / não faças|não faça|não façamos|não façais|não façam", "imperativo fazer");
eq(imp("dizer"), "diz|diga|digamos|dizei|digam / não digas|não diga|não digamos|não digais|não digam", "imperativo dizer");
eq(imp("pôr"), "põe|ponha|ponhamos|ponde|ponham / não ponhas|não ponha|não ponhamos|não ponhais|não ponham", "imperativo pôr");
eq(imp("ver"), "vê|veja|vejamos|vede|vejam / não vejas|não veja|não vejamos|não vejais|não vejam", "imperativo ver");
eq(imp("dar"), "dá|dê|demos|dai|deem / não dês|não dê|não demos|não deis|não deem", "imperativo dar");
eq(imp("ler"), "lê|leia|leiamos|lede|leiam / não leias|não leia|não leiamos|não leiais|não leiam", "imperativo ler");
eq(imp("sair"), "sai|saia|saiamos|saí|saiam / não saias|não saia|não saiamos|não saiais|não saiam", "imperativo sair");
eq(imp("manter"), "mantém|mantenha|mantenhamos|mantende|mantenham / não mantenhas|não mantenha|não mantenhamos|não mantenhais|não mantenham", "imperativo manter");
eq(imp("dormir"), "dorme|durma|durmamos|dormi|durmam / não durmas|não durma|não durmamos|não durmais|não durmam", "imperativo dormir");
eq(imp("passear"), "passeia|passeie|passeemos|passeai|passeiem / não passeies|não passeie|não passeemos|não passeeis|não passeiem", "imperativo passear");
eq(imp("levantar-se"),
   "levanta-te|levante-se|levantemo-nos|levantai-vos|levantem-se / não te levantes|não se levante|não nos levantemos|não vos levanteis|não se levantem",
   "imperativo levantar-se");
eq(imp("sentar-se").split(" / ")[0], "senta-te|sente-se|sentemo-nos|sentai-vos|sentem-se", "imperativo sentar-se");
eq(imp("vestir-se").split(" / ")[0], "veste-te|vista-se|vistamo-nos|vesti-vos|vistam-se", "imperativo vestir-se");
eq(C.imperative("poder"), null, "poder sin imperativo");

/* ================================================ reflexivos =============== */
row("levantar-se", "presente", "me levanto, te levantas, se levanta, nos levantamos, vos levantais, se levantam");
row("chamar-se", "presente", "me chamo, te chamas, se chama, nos chamamos, vos chamais, se chamam");
row("sentar-se", "perfeito", "me sentei, te sentaste, se sentou, nos sentamos, vos sentastes, se sentaram");
row("deitar-se", "futuro", "me deitarei, te deitarás, se deitará, nos deitaremos, vos deitareis, se deitarão");
row("vestir-se", "presente", "me visto, te vestes, se veste, nos vestimos, vos vestis, se vestem");
row("lavar-se", "subjPresente", "me lave, te laves, se lave, nos lavemos, vos laveis, se lavem");
row("referir-se", "presente", "me refiro, te referes, se refere, nos referimos, vos referis, se referem");
row("levantar-se", "perfeitoComposto",
  "tenho me levantado, tens te levantado, tem se levantado, temos nos levantado, tendes vos levantado, têm se levantado");
row("levantar-se", "infPessoal",
  "me levantar, te levantares, se levantar, nos levantarmos, vos levantardes, se levantarem");
eq(C.accepted("levantar-se", "presente")[0].join("|"), "me levanto|levanto-me", "aceptadas me levanto");
eq(C.accepted("levantar-se", "perfeito")[3].join("|"), "nos levantamos|levantamo-nos", "aceptadas levantamo-nos");
eq(C.accepted("sentar-se", "maisQuePerfeitoComposto")[2].slice(0, 3).join("|"),
   "tinha se sentado|se tinha sentado|tinha-se sentado", "aceptadas tinha se sentado");
eq(C.accepted("pagar", "perfeitoComposto")[0].join("|"), "tenho pago|tenho pagado", "aceptadas tenho pago");
eq(C.accepted("aceitar", "maisQuePerfeitoComposto")[0].join("|"),
   "tinha aceitado|tinha aceito|havia aceitado|havia aceito", "aceptadas tinha aceitado");
eq(C.accepted("construir", "presente")[2].join("|"), "constrói|construi", "aceptadas constrói");
eq(C.accepted("falar", "presente")[0].join("|"), "falo", "aceptadas falo");

/* ================================================ register / regular ===== */
eq(C.register("xeretar", { es: "fisgonear" }), true, "register xeretar");
row("xeretar", "presente", "xereto, xeretas, xereta, xeretamos, xeretais, xeretam");
eq(C.register("falar", {}), false, "register no pisa un verbo existente");
eq(C.register("parlare", {}), false, "register rechaza un infinitivo no portugués");
eq(C.register("tricotar-se", {}), true, "register reflexivo");
eq(C.conjugate("tricotar-se", "presente")[0], "me tricoto", "reflexivo registrado");
eq(C.register("rastrear", {}), true, "register -ear");
eq(C.conjugate("rastrear", "presente")[0], "rastreio", "-ear automático");
eq(C.register("fisgar", {}), true, "register -gar");
eq(C.conjugate("fisgar", "perfeito")[0], "fisguei", "-gar automático");
eq(C.register("repelir", { alt: "e-i" }), true, "register con alternancia");
eq(C.conjugate("repelir", "presente")[0], "repilo", "alternancia registrada");

eq(C.regular("fazer", "presente").join(","), "fazo,fazes,faze,fazemos,fazeis,fazem", "regular fazer presente");
eq(C.regular("fazer", "perfeito")[0], "fazi", "regular fazer perfeito");
eq(C.regular("fazer", "participio"), "fazido", "regular fazer particípio");
eq(C.regular("fazer", "futuro")[0], "fazerei", "regular fazer futuro");
eq(C.regular("dizer", "futuro")[0], "dizerei", "regular dizer futuro");
eq(C.regular("dormir", "presente")[0], "dormo", "regular dormir");
eq(C.regular("pedir", "presente")[0], "pedo", "regular pedir");
eq(C.regular("passear", "presente")[0], "passeo", "regular passear");
eq(C.regular("odiar", "presente")[0], "odio", "regular odiar");
eq(C.regular("ter", "perfeito")[0], "ti", "regular ter");
eq(C.regular("poder", "perfeito")[2], "podeu", "regular poder pôde");
eq(C.regular("escrever", "participio"), "escrevido", "regular escrever");
eq(C.regular("abrir", "participio"), "abrido", "regular abrir");
eq(C.regular("pôr", "presente")[0], "pono", "regular pôr");
eq(C.regular("levantar-se", "presente")[0], "me levanto", "regular reflexivo");
eq(C.regular("ficar", "perfeito")[0], "fiquei", "regular conserva la ortografía");
eq(C.conjugate("fazer", "presente")[0], "faço", "regular() no altera el verbo");

/* ================================================ API ====================== */
eq(C.PERSONS.join(","), "eu,tu,ele/ela/você,nós,vós,eles/elas/vocês", "PERSONS");
eq(C.ALL_TENSES.length, 17, "17 tiempos");
eq(C.SIMPLE_TENSES.length, 10, "10 tiempos simples");
eq(C.auxiliary("ir"), "ter", "auxiliar ter");
eq(C.info("falar").es, "hablar", "info.es");
eq(C.info("levantar-se").refl, true, "info.refl");
eq(C.TENSE_LABELS.perfeito, "pretérito perfeito", "etiqueta perfeito");
eq(C.TENSE_LABELS.subjFuturo, "futuro do subjuntivo", "etiqueta subjFuturo");
C.ALL_TENSES.concat(C.NONFINITE).forEach(function (t) {
  checks++;
  if (!C.TENSE_LABELS[t]) { fails++; console.log("FAIL sin etiqueta: " + t); }
});

/* Every verb of the curriculum exists (tools/curriculo.py, v=[...]). */
(function () {
  var fs = require("fs"), path = require("path");
  var src = fs.readFileSync(path.join(__dirname, "curriculo.py"), "utf8");
  var re = /\bv=\[([^\]]*)\]/g, m, seen = {};
  while ((m = re.exec(src))) {
    m[1].replace(/"([^"]+)"/g, function (_, v) { seen[v] = 1; });
  }
  Object.keys(seen).forEach(function (v) {
    checks++;
    if (!C.VERBS[v]) { fails++; console.log("FAIL verbo del temario ausente: " + v); }
  });
})();

/* --- every verb yields forms in every tense, without exceptions --- */
C.list().forEach(function (v) {
  if (C.info(v).defective) return;
  C.ALL_TENSES.forEach(function (t) {
    checks++;
    var f;
    try { f = C.conjugate(v, t); } catch (e) { f = [String(e)]; }
    if (f.length !== 6 || f.some(function (x) { return !x || /undefined|NaN|null|Error/.test(x); })) {
      fails++;
      console.log("FAIL forma vacía: " + v + " / " + t + " -> " + JSON.stringify(f));
    }
  });
  checks++;
  var i = C.imperative(v);
  if (i && !(i.tu && i["você"] && i["nós"] && i["vocês"] && i.neg && i.neg.tu)) {
    fails++; console.log("FAIL imperativo incompleto: " + v);
  }
  // no stray Spanish spellings: ñ, ll, -ción
  C.SIMPLE_TENSES.forEach(function (t) {
    C.conjugate(v, t).forEach(function (f) {
      if (/ñ|ll|ción|[àèìòù]/.test(f)) { fails++; console.log("FAIL grafía: " + v + " " + f); }
    });
  });
});

console.log("\ncontroles: " + checks + "   errores: " + fails + "   verbos: " + C.list().length);
process.exit(fails ? 1 : 0);
