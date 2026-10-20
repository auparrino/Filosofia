/* «🔎 Palabra por palabra»: el desglose, en los dos idiomas.
 *
 * Casos puntuales (pronombres átonos y su función, pronombres pegados al
 * verbo, tiempos compuestos leídos juntos, elisiones, locuciones, palabras
 * gramaticales, nombres propios, homógrafos, rótulos según la semana) y
 * controles sobre todas las frases de conversación de cada idioma. */
"use strict";
var pack = require("./pack.js");
var n = 0, bad = 0;
function ok(c, m) { n++; if (!c) { bad++; console.log("FAIL " + m); } }

/* [frase, semana (o null), lo que tiene que aparecer, lo que no] */
var CASES = {
  pt: [
    ["Valeu, falou!", null, ["*valeu*: de *valer* (pretérito perfeito", "*falou*: de *falar* (pretérito perfeito", "en esta frase: «gracias"], []],
    ["Fui no mercado pelo caminho.", null, ["de *ser* o *ir*", "*no* = *em* + *o*", "*pelo* = *por* + *o*"], []],
    ["Tô morrendo de fome!", null, ["*tô morrendo*: *estar*", "gerundio de *morrer*", "*tô* = *estou*"], []],
    // pronombres átonos y su función
    ["Eu me chamo Sofía.", 1, ["*me*: pronombre átono", "reflexivo (*chamar-se*)", "en Brasil va antes del verbo"], ["*sofía*"]],
    ["Como se escreve?", 2, ["*se*: pronombre átono «se», impersonal"], ["*como*: de *comer*"]],
    ["A gente se vê lá.", 6, ["*a gente* — «nosotros", "*se*: pronombre átono «se», reflexivo"], []],
    ["Se você quiser, a gente vai.", 23, ["*se*: si (condicional)"], ["*se*: pronombre"]],
    ["Pode me corrigir, por favor?", 2, ["*me*: pronombre átono «me / a mí», objeto directo o indirecto, delante de *corrigir*"], []],
    ["Me dá dois pães franceses?", 4, ["*me*: pronombre átono «me / a mí», objeto indirecto"], []],
    ["Te amo.", 15, ["*te*: pronombre átono «te / a vos»"], []],
    ["Eu lhe agradeço muito.", 30, ["*lhe*: pronombre átono «le (a usted", "objeto indirecto"], []],
    ["Eu a vi ontem.", 30, ["*a*: pronombre átono «la"], []],
    ["A conta, por favor.", 3, ["*conta* — «cuenta»"], ["*a*: pronombre", "de *contar*"]],
    // pegados con guion
    ["Mudam-se os tempos, mudam-se as vontades.", 40, ["*mudam-se* = *mudam* + *se*", "de *mudar-se*"], []],
    ["Vou fazê-lo amanhã.", 30, ["*fazê-lo* = *fazer* + *lo*", "pierde la *-r*"], []],
    // tiempos compuestos y perífrasis
    ["Eu tenho feito muito exercício.", 25, ["*tenho feito*: de *fazer*, pretérito perfeito composto (*ter* + participio, eu)"], []],
    ["Eu tenho feito muito exercício.", 5, ["*tenho feito*: de *fazer*, pasado que llega hasta hoy"], ["pretérito perfeito composto"]],
    ["Quando cheguei, ele já tinha saído.", 25, ["*tinha saído*: de *sair*, pretérito mais-que-perfeito composto"], []],
    ["Vamos dividir a conta?", 3, ["*vamos dividir*: *ir* (presente, nós) + infinitivo de *dividir*"], ["subjuntivo"]],
    // palabras gramaticales y locuciones
    ["Oi, tudo bem?", 1, ["*tudo bem* — «¿todo bien?"], []],
    ["Quanto é tudo?", 7, ["*tudo*: «todo» como pronombre"], []],
    ["Ontem choveu o dia todo.", 11, ["*todo*: todo/toda con sustantivo"], []],
    ["Até amanhã!", 1, ["*até*: hasta"], []],
    ["A gente almoça ao meio-dia.", 5, ["*a gente* — «nosotros (con el verbo en 3.ª persona"], []],
    ["Que calor hoje, né?", 17, ["*né*: ¿no?"], []],
    ["Me passa um copo d'água?", 14, ["*d'água*: *d'* = *de*"], []],
    ["Preciso reconhecer firma deste documento.", 35, ["*deste* = *de* + *este*"], ["de *dar*"]],
    // homógrafos y lecturas equivocadas del desglose anterior
    ["Quer vir comigo?", 6, ["*vir* — «venir»"], ["de *ver*"]],
    ["Estou em casa.", 5, [], ["de *casar"]],
    ["Muito obrigado!", 1, [], ["de *obrigar*"]],
    ["Essa cadeira está livre?", 3, [], ["de *livrar*"]],
    ["Onde fica o posto nove?", 8, [], ["de *pôr*"]],
    ["Não tem nada a ver.", 15, ["*tem nada a ver*"], ["de *nadar*"]],
    ["Tem mesa para quatro?", 3, [], ["de *parar*"]],
    ["Marcos ___ (falar) muito.", 5, [], ["*marcos*"]],
    // rótulos según la semana
    ["Desculpa, não entendi.", 2, ["*entendi*: de *entender* (pasado, como «comí», eu)"], ["pretérito perfeito"]],
    ["Desculpa, não entendi.", 12, ["(pretérito perfeito, eu)"], []],
    ["Eu gostaria de fazer uma reserva.", 5, ["condicional, como «comería»"], ["futuro do pretérito"]],
    ["Espero que você goste.", 23, ["*goste*: de *gostar* (presente do subjuntivo"], []],
    // pronombre delante de una forma que también es sustantivo; pegados sin r, con -s perdida, verbo desconocido
    ["Me conta tudo.", 12, ["*me*: pronombre átono «me / a mí», objeto indirecto, delante de *conta*", "*conta*: de *contar*"], ["«cuenta»"]],
    ["Vou contar-lhe uma coisa.", 30, ["*contar-lhe* = *contar* + *lhe* «le» (infinitivo)"], []],
    ["Fi-lo sem ajuda.", 40, ["*fi-lo* = *fiz* + *lo*", "de *fazer*", "pierde la última consonante"], []],
    ["Estudamo-lo ontem.", 40, ["*estudamo-lo* = *estudamos* + *lo*"], []],
    ["Constatou-se um aumento.", 45, ["*constatou-se* = *constatou* + *se*"], []],
    ["Eu tenho cuidado.", 21, ["*tenho cuidado*", "«tener cuidado»"], ["de *cuidar*"]],
    // «en esta frase» solo en el uso idiomático: suelto en su cláusula
    ["Você sabe onde fica a estação?", 6, ["*sabe*: de *saber*"], ["en esta frase"]],
    ["Ele falou comigo.", 11, ["*falou*: de *falar*"], ["en esta frase"]],
    ["Um momento, deixa eu pensar.", 3, ["en esta frase: «dejá que"], []],
    ["Talvez ele esteja em casa.", 23, ["*esteja*: de *estar* (presente do subjuntivo"], ["imperativo"]],
    ["Convidei o Lucas para o churrasco.", 11, [], ["de *parar*"]],
    ["O Vinicius morava em Ipanema.", 15, ["*morava*: de *morar*"], []]
  ],
  it: [
    ["Sono andato al mercato.", null, ["*sono andato*: de *andare*, passato prossimo (*essere* + participio, io)", "*al* = *a* + *il*"], []],
    ["Mi passi il sale?", null, ["*passi*: de *passare*", "*mi*: pronombre átono «me / a mí», objeto indirecto"], ["de *salire*"]],
    // pronombres átonos y su función
    ["Mi chiamo Augusto.", 1, ["*mi*: pronombre átono «me / a mí», reflexivo (*chiamarsi*)", "va antes del verbo conjugado"], ["*augusto*"]],
    ["Ci vediamo dopo!", 1, ["*ci*: pronombre átono «nos», reflexivo"], []],
    ["Un attimo, ci penso.", 2, ["*ci*: pronombre átono «ahí, en eso», locativo"], []],
    ["Sono di fretta, ne parliamo dopo?", 7, ["*ne*: pronombre átono «de eso, de ellos», partitivo"], []],
    ["Non lo so.", 2, ["*lo*: pronombre átono «lo», objeto directo, delante de *so*"], []],
    ["Mi piace un sacco.", 14, ["*mi*: pronombre átono «me / a mí», objeto indirecto", "*un sacco* — «un montón"], []],
    ["Come si dice «ventana» in italiano?", 2, ["*si*: pronombre átono «se», impersonal"], ["*ventana*"]],
    ["Ho un cane che si chiama Toto.", 6, ["*si*: pronombre átono «se», reflexivo"], ["*toto*"]],
    ["Le scrivo in merito alla sua richiesta.", 42, ["*le*: pronombre átono «le (a ella, a usted) / las», objeto indirecto"], []],
    ["Non ti preoccupare.", 15, ["*ti*: pronombre átono «te / a vos», reflexivo (*preoccuparsi*)"], []],
    ["La porta è chiusa.", 5, [], ["*la*: pronombre"]],
    // pegados al verbo
    ["Piacere di conoscerti.", 1, ["*conoscerti* = *conoscere* + *ti* «te» (infinitivo)"], []],
    ["Salutami tua sorella.", 1, ["*salutami* = *saluta* + *mi* «me» (imperativo de *salutare*)"], []],
    ["Dimmi tutto!", 14, ["*dimmi* = *di'* + *mi* «me» (imperativo de *dire*)"], []],
    ["Stavo per chiamarti.", 19, ["*chiamarti* = *chiamare* + *ti*"], []],
    ["Sono pieno, non ce la faccio più.", 4, ["*ce la faccio* (de *fare*", "farcela"], []],
    ["Finalmente ce l'ho fatta!", 48, ["*ce l'ho fatta*", "farcela"], []],
    // tiempos compuestos leídos juntos
    ["Scusa, non ho capito.", 2, ["*ho capito*: de *capire*, pasado, como «comí / he comido» (*avere* + participio, io)"], ["passato prossimo", "*capito*: de *capire* (participio)"]],
    ["Scusa, non ho capito.", 14, ["*ho capito*: de *capire*, passato prossimo"], []],
    ["Ho sbagliato.", 11, ["*ho sbagliato*: de *sbagliare*, passato prossimo"], ["«equivocado"]],
    ["È andata benissimo.", 14, ["*è andata*: de *andare*, passato prossimo (*essere* + participio, lui/lei)"], []],
    ["Mi sono perso.", 11, ["*sono perso*: de *perdere*", "reflexivo (*perdersi*)"], []],
    ["Il negozio è chiuso.", 12, [], ["*è chiuso*"]],
    ["L'ho già visto.", 19, ["*l'* (*l'ho*): pronombre átono «lo / la", "*ho visto*: de *vedere*, passato prossimo"], []],
    ["Hai ragione, non ci avevo pensato.", 20, ["*avevo pensato*: de *pensare*, pasado anterior"], ["trapassato prossimo"]],
    ["Sto imparando l'italiano.", 2, ["*sto imparando*: *stare* (presente, io) + gerundio de *imparare*"], []],
    // elisiones
    ["Un bicchiere d'acqua, per favore.", 3, ["*d'acqua*: *d'* = *di*"], []],
    ["Dov'è il bagno?", 2, ["*dov'è*: *dov'* = *dove*", "*è*: de *essere*"], []],
    ["Mi è venuta un'idea.", 7, ["*un'idea*: *un'* = *una*"], []],
    ["Sto imparando l'italiano.", 2, ["*l'italiano*: *l'* = *lo / la*"], []],
    ["Salgo sull'autobus.", 12, ["*sull'autobus*: *sull'* = *su* + *l'*"], []],
    ["Sono d'accordo con te.", 7, ["*d'accordo* — «de acuerdo»"], []],
    ["C'è una farmacia qui vicino?", 5, ["*c'è* — «hay"], []],
    ["Ci sono stato l'anno scorso.", 19, ["*sono stato*"], ["*ci sono* — «hay"]],
    ["Parlo un po' di italiano.", 1, ["*un po'* — «un poco"], []],
    // homógrafos, nombres propios, «en esta frase»
    ["Di dove sei?", 1, ["*sei*: de *essere* (presente, tu)"], ["seis", "en esta frase"]],
    ["Stacco alle sei.", 7, ["*sei* — «seis»"], []],
    ["L'ho letto in traduzione.", 30, ["*ho letto*: de *leggere*"], ["cama"]],
    ["Oggi lavoro da casa.", 7, ["de *lavorare*"], []],
    ["Nel caso in cui non fosse possibile, mi faccia sapere.", 42, ["*faccia*: de *fare* (imperativo, Lei)"], ["cara", "reflexivo"]],
    ["Guido ___ (portare) il vino.", 3, [], ["*guido*"]],
    ["Ma dai, davvero?", 9, ["*dai*: ¡dale!"], ["*ma*: de", "*dai* = *da* + *i*"]],
    // rótulos según la semana
    ["Tenga il resto.", 3, ["*tenga*: de *tenere* (para pedir u ordenar, Lei)"], ["congiuntivo"]],
    ["Vorrei un cappuccino e un cornetto.", 3, ["*vorrei*: de *volere* (condicional, como «comería», io)"], ["condizionale"]],
    ["Vorrei un cappuccino e un cornetto.", 25, ["(condizionale presente, io)"], []],
    ["Parli spagnolo?", 1, ["*parli*: de *parlare* (presente, tu)"], ["congiuntivo", "indicativo"]],
    ["Penso che sia una buona idea.", 27, ["*sia*: de *essere* (congiuntivo presente"], []],
    // el verbo después del pronombre (lo es artículo solo delante de sustantivo)
    ["Lo voglio sapere.", 14, ["*lo*: pronombre átono «lo», objeto directo, delante de *voglio* (va con *sapere*)", "*voglio*: de *volere*"], []],
    ["Non lo so.", 2, ["*so*: de *sapere*"], []],
    ["Mi porta un caffè?", 5, ["*mi*: pronombre átono", "*porta*: de *portare*"], ["«puerta"]],
    // el pronombre va con el infinitivo del modal
    ["Ti devo raccontare una cosa.", 14, ["delante de *devo* (va con *raccontare*)", "objeto indirecto"], []],
    ["Mi devo alzare presto.", 14, ["reflexivo (*alzarsi*)"], ["*doversi*"]],
    ["Ci andrei volentieri.", 20, ["*ci*: pronombre átono «ahí, en eso», locativo"], []],
    ["Se l'Italia non si fosse unificata, oggi parleremmo.", 30, [], ["*essersi*"]],
    // compuestos con un verbo que el glosario tiene solo como reflexivo, o no tiene
    ["Ha lavato la macchina.", 14, ["*ha lavato*: de *lavare*", "«lavar»"], ["«lavarse»"]],
    ["Ho ricordato a Susi di telefonare.", 14, ["*ho ricordato*: de *ricordare*", "«recordar»"], []],
    ["Nessuno avrebbe immaginato niente.", 31, ["*avrebbe immaginato*: de *immaginare*"], []],
    ["Mi sono lavato.", 14, ["*sono lavato*: de *lavarsi*,"], ["o *lavare*"]],
    // elisiones y locuciones
    ["Gliel'ho detto ieri.", 30, ["*gliel'* (*gliel'ho*): pronombre átono «se lo / se la", "*ho detto*: de *dire*"], []],
    ["Mio nonno ha ottant'anni.", 10, ["*ottant'* = *ottanta*"], []],
    ["Mi scusi, lo sportello chiude alle dodici?", 3, ["*mi scusi* — «disculpe"], []],
    ["Mi piace la musica.", 12, ["*piace*: de *piacere*", "«gustar»"], ["mucho gusto"]],
    // sei: número o verbo según el contexto
    ["Visto che sei qui, mi puoi aiutare.", 20, ["*sei*: de *essere*", "*visto che* — «ya que"], ["«seis"]],
    ["Quando sei via, mi manchi tanto.", 14, ["*sei*: de *essere*"], ["«seis"]],
    ["Tutti e sei i giudici sono corrotti.", 30, ["*sei* — «seis»"], ["*sei*: de *essere*"]],
    ["Sei giorni fa.", 11, ["*sei* — «seis»"], []],
    ["Il pane è caro? Sì, costa sei euro.", 5, ["*sei* — «seis»"], []]
  ]
};

Object.keys(CASES).forEach(function (code) {
  var c = pack(code), g = pack.data(code, "glossario.json"), bank = pack.data(code, "bank.json");
  var D = c.LANG.rules.desglose;
  ok(!!D, code + ": falta LANG.rules.desglose (docs/lang/" + code + "/desglose_data.js)");
  c.Desglose._reset();
  CASES[code].forEach(function (cs) {
    var o = { gloss: g, bank: bank };
    if (cs[1] != null) o.week = cs[1];
    var got = c.Desglose.lines(cs[0], o).join(" | ");
    cs[2].forEach(function (want) { ok(got.indexOf(want) >= 0, code + ": «" + cs[0] + "» (semana " + cs[1] + ") → " + got + "   (falta: " + want + ")"); });
    cs[3].forEach(function (not) { ok(got.indexOf(not) < 0, code + ": «" + cs[0] + "» (semana " + cs[1] + ") → " + got + "   (sobra: " + not + ")"); });
  });

  // «il sale» is salt, not salire; «água» is transparent
  var sale = c.Desglose.of(code === "it" ? "Mi passi il sale?" : "Um copo de água.", { gloss: g });
  ok(!sale.some(function (e) { return e.w === "sale" && e.kind === "verb"; }), code + ": sustantivo tras artículo leído como verbo");
  ok(!sale.some(function (e) { return e.w === "água"; }), code + ": palabra transparente desglosada");
  if (code === "pt") {
    var one = function (t) { return c.Desglose.of(t, { gloss: g, bank: bank }); };
    ok(!one("Quer um mate?").some(function (e) { return e.w === "mate" && e.kind === "verb"; }), "pt: um mate leído como matar");
    ok(!one("Estou em casa.").some(function (e) { return e.w === "casa" && e.kind === "verb"; }), "pt: em casa leído como casar");
    var fui = one("Fui à praia.").filter(function (e) { return e.w === "fui"; })[0];
    ok(fui && /ir/.test(fui.es), "pt: fui debe dar también el significado de ir: " + JSON.stringify(fui));
  }
  // opts.max drops plain words first
  var long = c.Desglose.lines(code === "it" ? "Mi passi il sale e un bicchiere d'acqua, per favore?" : "Me dá dois pães e um copo d'água, por favor?", { gloss: g, bank: bank, max: 2 });
  ok(long.length <= 2, code + ": max no respetado: " + long.length);

  /* Every phrase of the conversation scenes, at its own week. */
  var F = c.Frasi, cnt = 0, early = 0, idioms = 0, clit = 0, clitOk = 0, empty = 0;
  var labels = c.Conj.TENSE_LABELS, weeks = D.weeks || {}, nameWeek = D.nameWeek || {};
  var CL = code === "it" ? ["mi", "ti", "ci", "vi", "ne"] : ["me", "te", "lhe"];
  F.ALL.forEach(function (f) {
    var ls;
    try { ls = c.Desglose.lines(f.t, { gloss: g, bank: bank, week: f.week }); } catch (e) { ok(false, code + ": error en «" + f.t + "»: " + e.message); return; }
    cnt++;
    if (!ls.length) empty++;
    ls.forEach(function (l) {
      // a tense is named only from the week its theory is taught
      Object.keys(labels).forEach(function (t) {
        var nw = nameWeek[t] || weeks[t];
        if (!nw || nw <= f.week) return;
        var lab = labels[t];
        if (t === "presente" ? l.indexOf(lab) >= 0 : new RegExp("[(,] ?" + lab.replace(/[()]/g, "\\$&") + "( |,|\\)|$)").test(l)) {
          early++;
          ok(false, code + ": «" + t + "» nombrado en la semana " + f.week + ": " + f.t + " → " + l);
        }
      });
      // «en esta frase» only for the idiomatic uses listed in the package
      var m = /^\*([^*]+)\*.*en esta frase/.exec(l);
      if (m) { idioms++; ok(D.idioms && D.idioms[m[1]], code + ": «en esta frase» fuera de LANG.rules.desglose.idioms: " + l); }
      // a proper noun is never read as a verb
      if (/^\*[^*]+\*: de /.test(l)) {
        var w = l.slice(1, l.indexOf("*", 1));
        ok(!F.PROPER[w.charAt(0).toUpperCase() + w.slice(1)] || f.t.indexOf(w) >= 0, code + ": nombre propio leído como verbo: " + f.t + " → " + l);
      }
    });
    // a clitic right before a conjugated verb is explained
    var T = f.t.toLowerCase().match(/[a-zà-ÿ]+/g) || [];
    T.forEach(function (w, i) {
      if (CL.indexOf(w) < 0 || !T[i + 1]) return;
      clit++;
      if (ls.some(function (l) { var m = /^\*([^*]+)\*/.exec(l); return m && m[1].split(/[ ']/).indexOf(w) >= 0; })) clitOk++;
      else if (process.env.V) console.log("   sin explicar: " + w + " en «" + f.t + "»");
    });
  });
  /* The bank's sentences too (and the course's filled-in answers): no
     error, no tense named before its week, «en esta frase» only when idiomatic. */
  var more = 0;
  bank.sentences.forEach(function (x) {
    var t = (x.it || [])[0], wk = Math.max(1, Math.min(52, +x.w || 1)), ls;
    if (!t) return;
    try { ls = c.Desglose.lines(t, { gloss: g, bank: bank, week: wk, max: 7 }); } catch (e) { ok(false, code + ": error en «" + t + "»: " + e.message); return; }
    more++;
    ls.forEach(function (l) {
      Object.keys(labels).forEach(function (tn) {
        var nw = nameWeek[tn] || weeks[tn];
        if (!nw || nw <= wk || tn === "presente") return;
        // a longer name already allowed that contains this one (… composto)
        var rest = l; Object.keys(labels).forEach(function (u) { var uw = nameWeek[u] || weeks[u]; if (uw && uw <= wk && labels[u].length > labels[tn].length) rest = rest.split(labels[u]).join("#"); });
        if (new RegExp("[(,] ?" + labels[tn].replace(/[()]/g, "\\$&") + "( |,|\\)|$)").test(rest)) ok(false, code + ": «" + tn + "» nombrado en la semana " + wk + ": " + t + " → " + l);
      });
      var m = /^\*([^*]+)\*.*en esta frase/.exec(l);
      if (m) ok(D.idioms && D.idioms[m[1]], code + ": «en esta frase» fuera de LANG.rules.desglose.idioms: " + l);
    });
  });
  ok(more > 500, code + ": oraciones del banco desglosadas: " + more);
  ok(cnt > 300, code + ": frases desglosadas: " + cnt);
  ok(clitOk >= clit * 0.9, code + ": pronombres átonos explicados: " + clitOk + "/" + clit);
  ok(empty < cnt * 0.08, code + ": frases sin desglose: " + empty + "/" + cnt);
  console.log(code + ": " + cnt + " frases · pronombres átonos explicados " + clitOk + "/" + clit +
    " · sin desglose " + empty + " · «en esta frase» " + idioms + " · tiempos nombrados antes de tiempo " + early);
});
console.log("controles: " + n + "   errores: " + bad);
process.exit(bad ? 1 : 0);
