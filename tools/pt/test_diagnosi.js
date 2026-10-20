/* El diagnóstico tiene que reconocer el error que un hispanohablante comete
   de verdad.  El test toma frases correctas, les inyecta errores típicos
   (como los haría el alumno) y controla que el diagnóstico diga *cuál*
   error es; además, casos escritos a mano, variantes que el portugués de
   Brasil acepta y entradas absurdas.
   Run: node tools/pt/test_diagnosi.js  */
var fs = require("fs");
var path = require("path");
var pack = require("../lib/pack.js");
var ctx = pack("pt");
var Conj = ctx.Conj;
var D = ctx.Diagnosi;
var Banca = ctx.Banca || null;

var bankPath = pack.dataPath("pt", "bank.json");
var bank = fs.existsSync(bankPath) ? JSON.parse(fs.readFileSync(bankPath, "utf8")) : null;
// The bank is used only once it is Portuguese (the port goes file by file).
if (bank && !/\b(você|não|está|também)\b/.test((bank.sentences || []).slice(0, 200).map(function (s) { return (s.pt || s.it || [])[0]; }).join(" "))) bank = null;
if (bank && Banca) Banca.load(bank); else if (bank) D.init(bank);
function variants(s) { return s.pt || s.it; }

var T = require("../lib/testkit.js")("pt"), ok = T.ok;

/* ------------------------------------------------ casos escritos a mano */

var CASES = [
  ["Estou em o Brasil", "Estou no Brasil.", "contraccion"],
  ["O carro de ele é azul", "O carro dele é azul.", "contraccion"],
  ["Moro em Brasil", "Moro no Brasil.", "contraccion"],
  ["Vou a a praia", "Vou à praia.", "crase"],
  ["Vou a praia", "Vou à praia.", "crase"],
  ["Eu vou à pé", "Eu vou a pé.", "crase"],
  ["Ele é muy simpático", "Ele é muito simpático.", "muito"],
  ["Muito pessoas", "Muitas pessoas.", "muito"],
  ["Ela é muita bonita", "Ela é muito bonita.", "muito"],
  ["Eu gosto café", "Eu gosto de café.", "gostar"],
  ["Eu gosto o filme", "Eu gosto do filme.", "gostar"],
  ["Me gusta o samba", "Eu gosto do samba.", "gostar"],
  ["Vi ao João na praia", "Vi o João na praia.", "a_personal"],
  ["Conheço a Pedro desde criança", "Conheço o Pedro desde criança.", "a_personal"],
  ["Ontem eu fazi o almoço", "Ontem eu fiz o almoço.", "regularizacion"],
  ["Eu sabo nadar", "Eu sei nadar.", "regularizacion"],
  ["Eu fazerei isso", "Eu farei isso.", "regularizacion"],
  ["Eles são mais grandes", "Eles são maiores.", "regularizacion"],
  ["Hoje eu tenho comido muito", "Hoje eu comi muito.", "perfeito_composto"],
  ["Eu he comido feijoada", "Eu comi feijoada.", "perfeito_composto"],
  ["Se eu ter tempo, vou à praia", "Se eu tiver tempo, vou à praia.", "futuro_subj"],
  ["Quando eu chego, te ligo", "Quando eu chegar, te ligo.", "futuro_subj"],
  ["É importante para eles saber", "É importante para eles saberem.", "inf_pessoal"],
  ["Espero que você vem", "Espero que você venha.", "subjuntivo"],
  ["Se eu teria dinheiro, viajaria", "Se eu tivesse dinheiro, viajaria.", "subjuntivo"],
  ["Acho que ele venha", "Acho que ele vem.", "subjuntivo"],
  ["A cancion é linda", "A canção é linda.", "espanol"],
  ["Eu tengo dois irmãos", "Eu tenho dois irmãos.", "espanol"],
  ["Pero eu não quero", "Mas eu não quero.", "espanol"],
  ["Eu vou a comer", "Eu vou comer.", "espanol"],
  ["Eu no sei", "Eu não sei.", "espanol"],
  ["Ela está embarazada", "Ela está grávida.", "espanol"],
  ["O polvo está na mesa", "O pó está na mesa.", "falso_amigo"],
  ["Trabalhava na oficina", "Trabalhava no escritório.", "falso_amigo"],
  ["A leite está quente", "O leite está quente.", "genero"],
  ["O viagem foi longa", "A viagem foi longa.", "genero"],
  ["Os animals", "Os animais.", "plural"],
  ["Os pãos", "Os pães.", "plural"],
  ["Você falas português", "Você fala português.", "persona"],
  ["A gente vamos à praia", "A gente vai à praia.", "persona"],
  ["Eles tem dois filhos", "Eles têm dois filhos.", "persona"],
  ["Houveram muitos problemas", "Houve muitos problemas.", "persona"],
  ["Isso é para mí", "Isso é para mim.", "pronome"],
  ["Vou comprar-o amanhã", "Vou comprá-lo amanhã.", "pronome"],
  ["Não disse-me nada", "Não me disse nada.", "colocacao"],
  ["Direi-lhe a verdade", "Dir-lhe-ei a verdade.", "colocacao"],
  ["O livro foi escrevido por ela", "O livro foi escrito por ela.", "participio"],
  ["A conta foi pagada", "A conta foi paga.", "participio"],
  ["Ela e carioca", "Ela é carioca.", "tilde"],
  ["Nao sei", "Não sei.", "nasal"],
  ["Ela namora com o Pedro", "Ela namora o Pedro.", "regencia"],
  ["Penso você", "Penso em você.", "regencia"],
  ["Eu penso de que é tarde", "Eu penso que é tarde.", "regencia"],
  ["Ontem eu comia uma pizza", "Ontem eu comi uma pizza.", "tempo"],
  ["Moro no Rio desde três anos", "Moro no Rio há três anos.", "preposicion"],
  ["Vou em pé para o trabalho", "Vou a pé para o trabalho.", "preposicion"],
  ["Ele seje feliz", "Ele seja feliz.", "verbo_irregular"],
  ["Fui para a casa", "Fui para casa.", "articulo"],
  ["", "Oi", "vuoto"]
];

CASES.forEach(function (c) {
  var d = D.diagnose(c[0], [c[1]]);
  if (c[2]) ok(d.cat === c[2], "«" + c[0] + "» → esperado " + c[2] + ", obtenido " + d.cat + " (" + d.explain + ")");
  ok(d.verdict !== "giusto", "error no visto: " + c[0]);
  ok(d.hint && d.explain, "falta pista o explicación: " + c[0]);
  ok(d.label || d.cat === null, "falta la etiqueta: " + c[0]);
  // The hint must not give the answer away.
  d.fixed.filter(function (t) { return t.fix; }).forEach(function (t) {
    if (t.w.length > 3) ok(d.hint.indexOf("*" + t.w + "*") < 0, "la pista revela la respuesta: " + c[0] + " / " + d.hint);
  });
});
ok(D.diagnose("Vi ao João na praia", ["Vi o João na praia."]).explain.indexOf("João") >= 0, "los nombres propios se escriben con mayúscula en la explicación");

// Correct answers stay correct: punctuation, case, and what Brazilian Portuguese lets you choose.
[["oi, tudo bem", "Oi, tudo bem?"], ["cadê o banheiro", "Cadê o banheiro?"], ["É tarde", "é tarde"],
 ["Eu a vi ontem", "Eu a vi ontem."], ["Vi a Maria na praia", "Vi a Maria na praia."], ["Conheço Maria", "Conheço a Maria."],
 ["Antes de ele chegar", "Antes de ele chegar."], ["Está na hora de as crianças dormirem", "Está na hora de as crianças dormirem."],
 ["Eu estou cansada", "Estou cansado."], ["Obrigada", "Obrigado."], ["Eu falo português", "Falo português."],
 ["Minha casa é grande", "A minha casa é grande."], ["Nós vamos à praia", "A gente vai à praia."], ["Vou te ligar amanhã", "Vou ligar-te amanhã."],
 ["Chamo-me Ana", "Me chamo Ana."], ["Moro num apartamento", "Moro em um apartamento."], ["Eu tinha feito", "Eu havia feito."],
 ["Levantamo-nos cedo", "Nós nos levantamos cedo."], ["Vende-se casa", "Se vende casa."], ["Dir-lhe-ei a verdade", "Lhe direi a verdade."],
 ["Eu gostaria de um café", "Gostaria de um café."], ["o João chegou", "João chegou."], ["Se você vir a Ana, dê um abraço nela", "Se você vir a Ana, dê um abraço nela."],
 ["L​'amigo", "L'amigo"], ["Moro em Copacabana 😀", "Moro em Copacabana."]
].forEach(function (c) {
  var d = D.diagnose(c[0], [c[1]]);
  ok(d.verdict === "giusto", "respuesta correcta rechazada: «" + c[0] + "» → " + d.verdict + " " + d.cat + " " + d.explain);
});
ok(D.diagnose("Voce é carioca?", ["Você é carioca?"]).verdict === "quasi", "la tilde que falta es un desliz");
ok(D.diagnose("Me chamo Ana", ["Chamo-me Ana."]).verdict === "quasi", "próclise al empezar, donde se pedía la forma escrita: casi");
ok(D.diagnose("Me chamo Ana", ["Chamo-me Ana.", "Me chamo Ana."]).verdict === "giusto", "si la próclise es una variante aceptada, vale");
ok(D.diagnose("", ["Comi"]).verdict === "sbagliato", "respuesta vacía");
ok(D.diagnose("eu comi", ["Eu comi uma pizza.", "eu comi"]).verdict === "giusto", "se compara con la variante más cercana");
ok(D.diagnose("Maria está cansado", ["Maria está cansada."]).verdict === "sbagliato", "con un nombre, el género no es libre");
ok(D.diagnose("Elas estão cansados", ["Elas estão cansadas."]).verdict === "sbagliato", "con *elas*, el género no es libre");

// The API app.js and the other modules use.
ok(typeof D.util.isPortuguese === "function" && D.util.isItalian === D.util.isPortuguese, "util.isPortuguese (y el alias isItalian de drills.js)");
ok(D.util.isPortuguese("não") && D.util.isPortuguese("você") && !D.util.isPortuguese("tengo"), "isPortuguese reconoce el portugués");
ok(D.util.spanishWord("tengo") === "tenho" && D.util.spanishWord("muy") === "muito" && !D.util.spanishWord("casa"), "spanishWord: el español y su equivalente");
Object.keys(D.SEVERITY).forEach(function (k) { ok(D.LABEL[k], "falta la etiqueta de " + k); });
ok(Array.isArray(D.PORTUNOL) && D.PORTUNOL.length >= 10 && D.PORTUNOL.every(function (x) { return D.LABEL[x[0]] && x[1]; }), "el cuaderno del portuñol usa categorías del diagnóstico");
["contraccion", "articulo", "genero", "plural", "concordancia", "preposicion", "regencia", "muito", "gostar", "a_personal", "perfeito_composto",
 "subjuntivo", "futuro_subj", "inf_pessoal", "pronome", "colocacao", "crase", "ortografia", "tilde", "espanol", "falso_amigo", "tempo", "persona",
 "participio", "verbo_irregular", "regularizacion", "nasal", "faltante", "sobrante", "tipeo", "orden"].forEach(function (k) {
  ok(D.LABEL[k] && D.SEVERITY[k], "categoría " + k + " con etiqueta y gravedad");
});
ok(D.explainChoice("à", "a", { stem: "Vou ___ pé." }) && D.explainChoice("à", "a", { stem: "Vou ___ pé." }).cat === "crase", "explainChoice: la opción equivocada con su categoría");
ok(D.explainChoice("a", "a", {}) === null, "explainChoice: la correcta no tiene error");

/* ------------------------- familias de devolución mala (tools/pt/diag_review.js)
   Cada caso: [dada, esperadas, ctx, qué tiene que pasar].  choice: la opción
   de opción múltiple (explainChoice).  El harness diag_review.js recorre las
   52 semanas, el banco, las frases y las opciones con los errores típicos del
   hispanohablante; estos son sus representantes. */
var FAMILIES = [
  // un verbo conjugado donde va el infinitivo no es futuro do subjuntivo
  ["Vou viajo amanhã.", ["Vou viajar amanhã."], {}, { cat: "persona", explain: /infinitivo/, notExplain: /subjuntivo/ }],
  ["Gosto de danço samba.", ["Gosto de dançar samba."], {}, { cat: "persona", explain: /preposición/ }],
  ["Quando você vai volto?", ["Quando você vai voltar?"], {}, { cat: "persona" }],
  ["Quando eu chego, te ligo", ["Quando eu chegar, te ligo."], {}, { cat: "futuro_subj" }],
  // infinitivo pessoal y a gente
  ["É melhor vocês chegar cedo.", ["É melhor vocês chegarem cedo."], {}, { cat: "inf_pessoal" }],
  ["Trouxe cadeiras para a gente irmos para a praia.", ["Trouxe cadeiras para a gente ir para a praia."], {}, { cat: "inf_pessoal", explain: /a gente/ }],
  ["Para nós irem juntos.", ["Para nós irmos juntos."], {}, { cat: "inf_pessoal", explain: /\*irem\* es la forma de/ }],
  // el futuro do subjuntivo bien formado en la explicación
  ["Quando eu saio, te ligo.", ["Quando eu sair, te ligo."], {}, { cat: "futuro_subj", explain: /saíram → sair\b/ }],
  // un tipeo en un irregular es un tipeo
  ["Ontem ele estve aqui.", ["Ontem ele esteve aqui."], {}, { cat: "tipeo" }],
  ["Eles mantienem a casa.", ["Eles mantêm a casa."], {}, { explain: /diptongo/ }],
  // las tildes con su regla, y la ñ no es una tilde
  ["Falta agua.", ["Falta água."], {}, { cat: "tilde", explain: /diptongo/ }],
  ["Todo día vou à praia.", ["Todo dia vou à praia."], {}, { cat: "tilde", hint: /Sobra una tilde/, explain: /español/ }],
  ["Tenho trinta años.", ["Tenho trinta anos."], {}, { cat: "espanol" }],
  ["Ela está grávida de gemeos.", ["Ela está grávida de gêmeos."], {}, { cat: "tilde", explain: /esdrújulas/ }],
  ["Vou compra-lo amanhã.", ["Vou comprá-lo amanhã."], {}, { cat: "tilde", explain: /-lo/ }],
  ["vendé-la", ["vendê-la"], {}, { cat: "tilde", explain: /cerrada/ }],
  ["mêses", ["meses"], {}, { cat: "tilde", explain: /llanas/ }],
  // una preposición con artículo donde va el artículo solo
  ["Saramago ganhou ao Nobel em 1998.", ["Saramago ganhou o Nobel em 1998."], {}, { cat: "preposicion", notCat: "tipeo" }],
  ["A Bia namora ao Rafa.", ["A Bia namora o Rafa."], {}, { cat: "a_personal" }],
  ["Eu conheço a Rio.", ["Eu conheço o Rio."], {}, { notCat: "a_personal" }],
  // una sola palabra en español no es «mezcla»
  ["Durmo muy.", ["Durmo muito."], {}, { cat: "muito" }],
  // la misma palabra con otra terminación no es un falso amigo
  ["O museu fechas às cinco.", ["O museu fecha às cinco."], {}, { cat: "persona" }],
  ["Comprei dois jornals.", ["Comprei dois jornais."], {}, { cat: "plural" }],
  ["Os exercícios são fácils.", ["Os exercícios são fáceis."], {}, { cat: "plural" }],
  // la consigna copiada
  ["Dos cervezas, por favor.", ["Duas cervejas, por favor."], { stem: "Dos cervezas, por favor." }, { cat: "espanol", explain: /Copiaste/ }],
  ["(Brasil) ¿Qué estás haciendo?", ["O que você está fazendo?"], { stem: "(Brasil) ¿Qué estás haciendo?" }, { cat: "espanol", explain: /Copiaste/ }],
  ["Me pidió que la esperara.", ["Ela me pediu que eu a esperasse."], { stem: "Me pidió que la esperara." }, { cat: "espanol" }],
  // la variante que difiere solo en la tilde es la que se quiso escribir
  ["Vou a praia", ["Vou para a praia.", "Vou à praia."], {}, { cat: "crase" }],
  // ser, estar, ficar
  ["Você está argentino?", ["Você é argentino?"], {}, { cat: "ser_estar", label: /ser, estar/ }],
  ["A carta esteve escrita por ela.", ["A carta foi escrita por ela."], {}, { cat: "ser_estar", explain: /pasiva/ }],
  ["O Cristo está no Corcovado.", ["O Cristo fica no Corcovado."], {}, { cat: "ser_estar", explain: /ficar/ }],
  // una orden no es un deseo
  ["Fala mais devagar, por favor.", ["Fale mais devagar, por favor."], {}, { cat: "subjuntivo", explain: /orden/ }],
  ["Se você visitar Salvador, vou ao Pelourinho.", ["Se você visitar Salvador, vá ao Pelourinho."], {}, { explain: /orden/ }],
  ["Não acho que é verdade.", ["Não acho que seja verdade."], {}, { cat: "subjuntivo", explain: /não acho que/ }],
  ["Ou sou, ninguém veio.", ["Ou seja, ninguém veio."], {}, { explain: /fórmula fija/ }],
  ["Fechar a porta!", ["Feche a porta!"], {}, { cat: "subjuntivo", explain: /orden/ }],
  // el lo del español es un pronombre, no un artículo
  ["Eu lo vi ontem.", ["Eu o vi ontem."], {}, { cat: "pronome", notHint: /artículo/ }],
  ["se lo", ["para ela"], { stem: "Comprei um presente e dei ___." }, { choice: true, cat: "pronome", explain: /para ela/ }],
  // la mesóclise bien escrita
  ["Lhe direi a verdade.", ["Dir-lhe-ei a verdade."], { registro: "formal" }, { cat: "colocacao", explain: /dir-lhe-ei/, notExplain: /direi-lhe/ }],
  ["Eles mudarão se em março.", ["Eles se mudarão em março."], {}, { cat: "colocacao", explain: /mesóclise/ }],
  // el pronombre repetido
  ["Ela se chama-se Beatriz.", ["Ela se chama Beatriz."], {}, { cat: "pronome", explain: /una sola vez/ }],
  // a gente + 1.ª plural
  ["A gente vamos", ["Nós vamos"], { stem: "(culto) ___ ao show." }, { choice: true, cat: "persona", explain: /a gente/i }],
  // el pronombre después de una coma no está atraído
  ["Já que você está aqui, ajuda-me", ["Já que você está aqui, me ajuda"], {}, { verdict: "giusto" }],
  // las preguntas de registro tienen su explicación
  ["Dá-me um café?", ["Me dá um café?"], { stem: "«¿Me das un café?»" }, { choice: true, cat: "colocacao", explain: /habla de Brasil/ }],
  ["Te direi", ["Dir-te-ei"], { stem: "(formal) ___ tudo amanhã." }, { choice: true, cat: "colocacao", explain: /mesóclise/ }],
  // las opciones que son significados en español no se diagnostican como portugués
  ["aburrido", ["raro"], { stem: "O filme é meio esquisito. «esquisito» =" }, { choice: true, notCat: "espanol" }],
  // el voseo y las terminaciones del español
  ["Você querés um café?", ["Você quer um café?"], {}, { cat: "espanol", explain: /voseo/ }],
  ["Abrí a janela, por favor.", ["Abra a janela, por favor."], {}, { cat: "espanol", explain: /voseo/ }],
  ["Ontem eu chegué tarde.", ["Ontem eu cheguei tarde."], {}, { cat: "espanol", explain: /-ei/ }],
  ["Eles hicieram tudo.", ["Eles fizeram tudo."], {}, { cat: "espanol" }],
  ["Poniendo", ["Pondo"], { stem: "___ a mesa, ela chamou todos." }, { choice: true, notExplain: /nombres propios/ }],
  // errores que una variante mal entendida aceptaba
  ["A menino brinca na calçada.", ["O menino brinca na calçada.", "A criança brinca na calçada."], {}, { cat: "genero" }],
  ["Eu já tinha lida o livro.", ["Eu já tinha lido o livro."], {}, { cat: "participio" }],
  ["tem chovida", ["tem chovido"], { stem: "Ultimamente ___ muito." }, { cat: "participio" }],
  ["Paguei à visto.", ["Paguei à vista."], {}, { notCat: "subjuntivo", verdict: "sbagliato" }],
  ["na Copacabana", ["em Copacabana"], { stem: "Moro ___." }, { verdict: "sbagliato" }],
  ["para", ["para o"], { stem: "Vou pro Centro. → Vou ___ Centro." }, { choice: true, verdict: "sbagliato" }],
  ["hei corrido", ["tenho corrido"], { stem: "Nos últimos meses, eu ___ no Aterro." }, { choice: true, cat: "perfeito_composto" }],
  ["contou te", ["te contou"], { stem: "Quem ___ isso?" }, { choice: true, cat: "colocacao", explain: /guion/ }],
  ["Assinado", ["Assinada"], { stem: "___ a Lei Áurea, milhares de libertos ficaram sem terra." }, { choice: true, cat: "concordancia" }],
  ["mas", ["porém"], { stem: "O projeto era bom. O plano, ___, falhou." }, { choice: true, verdict: "sbagliato" }],
  ["posta", ["posto"], { stem: "pôr → ___" }, { cat: "participio" }],
  // las mismas dos palabras en la respuesta no son una contracción que falta
  ["«Todo no mundo começou com um sim» é a primeira frase de A Hora da Estrela.",
   ["«Tudo no mundo começou com um sim» é a primeira frase de A Hora da Estrela."], {}, { cat: "lexico" }],
  // lo que está antes de la flecha es la consigna, no la frase
  ["daqele", ["daquele"], { stem: "de + aquele → ___" }, { notCat: "contraccion" }],
  ["floes", ["flores"], { stem: "a flor → as ___", nominal: true }, { cat: "tipeo" }],
  ["falamos", ["fala"], { stem: "a gente → ___" }, { cat: "persona", explain: /a gente/i }],
  // demostrativos, dele / dela, regencia con un adverbio en el medio
  ["dessa", ["desta"], { stem: "(formal) Venho, por meio ___, solicitar informações." }, { choice: true, cat: "pronome", explain: /Este/ }],
  ["Eu penso muito da minha avó.", ["Eu penso muito na minha avó."], {}, { cat: "regencia" }],
  ["Argentina é um país enorme.", ["A Argentina é um país enorme."], {}, { cat: "articulo" }],
  ["Sou a Rosario.", ["Sou de Rosario."], {}, { cat: "preposicion", notHint: /no un artículo/ }],
  // el participio: concuerda con el sujeto, y después de ser va el participio
  ["O boleto já está paga.", ["O boleto já está pago."], {}, { cat: "participio", explain: /boleto/ }],
  ["As cartas foram entregas.", ["As cartas foram entregues."], {}, { cat: "participio" }],
  // ter existencial, impersonal como haver; la forma con todos sus tiempos
  ["Tinham muita gente no bloco.", ["Tinha muita gente no bloco."], {}, { cat: "persona", explain: /impersonal/ }],
  ["Embora houvesse muita gente, conseguir entrar.", ["Embora houvesse muita gente, conseguimos entrar."], {}, { cat: "persona", explain: /presente o pretérito perfeito/ }],
  // el se pasivo y el se indeterminado
  ["Observa-se mudanças.", ["Observam-se mudanças."], {}, { cat: "persona", explain: /se\* pasivo/ }],
  ["assistem-se a filmes", ["assiste-se a filmes"], {}, { cat: "persona", explain: /singular/ }]
];
FAMILIES.forEach(function (c) {
  var x = c[3], d = x.choice ? D.explainChoice(c[0], c[1][0], c[2]) : D.diagnose(c[0], c[1], c[2]);
  var v = d ? d.verdict : "giusto", what = "familia «" + c[0] + "»: ";
  if (x.verdict) ok(v === x.verdict, what + "veredicto " + v);
  if (x.cat) ok(d && d.cat === x.cat, what + "esperado " + x.cat + ", obtenido " + (d && d.cat) + " (" + (d && d.explain) + ")");
  if (x.notCat) ok(!d || d.cat !== x.notCat, what + "no tiene que ser " + x.notCat);
  if (x.explain) ok(d && x.explain.test(d.explain), what + "explicación sin " + x.explain + ": " + (d && d.explain));
  if (x.notExplain) ok(!d || !x.notExplain.test(d.explain), what + "explicación con " + x.notExplain + ": " + (d && d.explain));
  if (x.hint) ok(d && x.hint.test(d.hint), what + "pista sin " + x.hint + ": " + (d && d.hint));
  if (x.notHint) ok(!d || !x.notHint.test(d.hint), what + "pista con " + x.notHint + ": " + (d && d.hint));
  if (x.label) ok(d && x.label.test(d.label), what + "etiqueta " + (d && d.label));
  if (d && d.verdict !== "giusto") {
    ok(!/undefined|NaN|\*\s*\*/.test(d.hint + " " + d.explain), what + "texto roto: " + d.hint + " / " + d.explain);
    d.fixed.filter(function (t) { return t.fix && t.w.length > 2; }).forEach(function (t) {
      ok(d.hint.toLowerCase().indexOf("*" + t.w + "*") < 0, what + "la pista revela la respuesta: " + d.hint);
    });
  }
});
ok(D.LABEL.ser_estar && D.SEVERITY.ser_estar, "ser_estar tiene etiqueta y gravedad");

/* ------------------------------ errores inyectados en las frases del banco */

var SPLIT = { no: "em o", na: "em a", nos: "em os", nas: "em as", do: "de o", da: "de a", dos: "de os", das: "de as", ao: "a o", aos: "a os",
              pelo: "por o", pela: "por a", dele: "de ele", dela: "de ela", neste: "em este", nesta: "em esta", nesse: "em esse", nessa: "em essa", "à": "a a", "às": "a as" };
var SPANISH = { muito: "muy", "também": "también", "então": "entonces", agora: "ahora", sempre: "siempre", "até": "hasta", mas: "pero", depois: "después",
                hoje: "hoy", ontem: "ayer", "amanhã": "mañana", "ninguém": "nadie", com: "con", tenho: "tengo", quero: "quiero", "são": "son", estou: "estoy",
                "não": "no", sem: "sin", onde: "donde", quando: "cuando" };

function inject(sentence) {
  var toks = sentence.split(" "), out = [];
  var core = function (t) { return t.replace(/[.,;:!?«»"“”()]/g, ""); };
  toks.forEach(function (t, i) {
    var w = core(t), low = w.toLowerCase(), next = core(toks[i + 1] || "").toLowerCase();
    var put = function (repl, cat) {
      var copy = toks.slice();
      copy[i] = t.replace(w, repl);
      out.push({ bad: copy.join(" "), cat: cat, what: w + "→" + repl });
    };
    // contraction split up (em o, de ele, a a)
    if (SPLIT[low]) put(w.charAt(0) !== low.charAt(0) ? SPLIT[low].charAt(0).toUpperCase() + SPLIT[low].slice(1) : SPLIT[low], low.charAt(0) === "à" ? "crase" : "contraccion");
    // Spanish word
    if (SPANISH[low]) put(SPANISH[low], low === "muito" ? "muito" : "espanol");
    // accent dropped (a slip) and the nasal til dropped
    if (/[áéíóúâêô]/.test(low) && low.length > 3 && !/^(à|às)$/.test(low)) put(w.normalize("NFD").replace(/[́̂]/g, "").normalize("NFC"), "tilde");
    if (/[ãõ]/.test(low) && low.length > 2) put(w.normalize("NFD").replace(/̃/g, "").normalize("NFC"), "nasal");
    // gostar without de
    if (/^gost/.test(low) && /^(de|do|da|dos|das)$/.test(next)) {
      var copy = toks.slice();
      copy[i + 1] = { de: "", do: "o", da: "a", dos: "os", das: "as" }[next];
      out.push({ bad: copy.join(" ").replace(/\s+/g, " "), cat: "gostar", what: "gostar sin de" });
    }
    // person of the verb
    var forms = D.verbForms(low).filter(function (f) { return f.tense === "presente" && f.p !== 1 && f.p !== 4; });
    // after an article or a determiner the word is a noun (um livro, do Rio), not a verb
    var prevW = core(toks[i - 1] || "").toLowerCase();
    var afterDet = /^(o|a|os|as|um|uma|uns|umas|do|da|dos|das|no|na|nos|nas|ao|à|pelo|pela|meu|minha|seu|sua|nosso|nossa|este|esta|esse|essa|aquele|aquela)$/.test(prevW);
    if (forms.length && low.length > 2 && i > 0 && !afterDet && !D.util.prepInfo(low) && !/^(é|são|está|tem|vai|vão|há)$/.test(low)) {
      var f = forms[0];
      try {
        var all = Conj.conjugate(f.lemma, "presente").map(function (x) { return x.split(" ").pop(); });
        var other = all[f.p === 0 ? 3 : f.p === 3 ? 0 : f.p === 2 ? 5 : 2];
        if (other && other !== low && D.verbForms(other).length) put(other, "persona");
      } catch (e) { /* */ }
    }
  });
  return out;
}

var ALT = {
  espanol: ["espanol", "ortografia", "tilde", "lexico", "muito", "pronome", "preposicion", "contraccion", "nasal"],
  muito: ["muito", "espanol"],
  persona: ["persona", "tempo", "subjuntivo", "regularizacion", "verbo_irregular", "concordancia", "gostar", "futuro_subj", "inf_pessoal"],
  tilde: ["tilde", "ortografia", "persona", "nasal", "tempo"],
  nasal: ["nasal", "tilde", "ortografia", "espanol", "persona", "tempo"],
  // A closer accepted variant may be built otherwise (subimos o Pão de Açúcar).
  contraccion: ["contraccion", "crase", "preposicion", "regencia", "gostar", "articulo"],
  crase: ["crase", "contraccion"],
  gostar: ["gostar", "regencia"]
};

if (bank) {
  var tally = {};
  bank.sentences.forEach(function (s) {
    inject(variants(s)[0]).forEach(function (x) {
      var d = D.diagnose(x.bad, variants(s));
      var t = tally[x.cat] || (tally[x.cat] = { n: 0, hit: 0, seen: 0, miss: [] });
      t.n++;
      if (d.verdict !== "giusto") t.seen++;
      if ((ALT[x.cat] || [x.cat]).indexOf(d.cat) >= 0) t.hit++;
      else if (t.miss.length < 4) t.miss.push(x.what + " en «" + variants(s)[0] + "» → " + d.cat);
    });
  });
  console.log("errores inyectados en las frases del banco:");
  Object.keys(tally).forEach(function (k) {
    var t = tally[k];
    console.log("  " + (k + "                         ").slice(0, 20) + t.hit + "/" + t.n +
      " bien diagnosticados (" + Math.round(t.hit / t.n * 100) + "%), vistos como error " + t.seen + "/" + t.n);
    ok(t.seen / t.n >= 0.97, k + ": errores no vistos " + (t.n - t.seen));
    ok(t.hit / t.n >= 0.9, k + ": diagnóstico correcto solo en el " + Math.round(t.hit / t.n * 100) + "%");
    if (t.hit / t.n < 0.97) t.miss.forEach(function (m) { console.log("      ej.: " + m); });
  });

  // Every accepted translation is accepted, and every bank error sentence is
  // recognised as wrong.
  bank.sentences.forEach(function (s) {
    variants(s).forEach(function (v) {
      ok(D.diagnose(v, variants(s)).verdict === "giusto", "variante rechazada: " + v);
    });
  });
  var errSeen = 0, errCat = 0;
  bank.errors.forEach(function (e) {
    var d = D.diagnose(e.wrong, [e.right]);
    if (d.verdict !== "giusto") errSeen++;
    else console.log("  no visto: " + e.wrong + " / " + e.right);
    if (d.cat === e.cat || (e.cat === "verbo_irregular" && d.cat === "regularizacion") || (e.cat === "ortografia" && /^(tilde|nasal)$/.test(d.cat)) ||
        (e.cat === "genero" && d.cat === "articulo") || (e.cat === "articulo" && d.cat === "genero")) errCat++;
  });
  console.log("frases de «encontrá el error»: vistas como error " + errSeen + "/" + bank.errors.length +
              ", misma familia que el autor " + errCat + "/" + bank.errors.length);
  ok(errSeen === bank.errors.length, "cada frase equivocada se ve como equivocada");
  ok(errCat / bank.errors.length >= 0.75, "la categoría coincide con la del autor en al menos el 75%");

  /* generadores del banco */
  if (Banca) {
    var st = { unlocked: 52, cards: {} };
    ["vocabSession", "formsSession", "translateSession", "gapSession", "errorSession"].forEach(function (fn) {
      if (typeof Banca[fn] !== "function") return ok(false, "Banca." + fn + " no existe");
      for (var r = 0; r < 20; r++) {
        Banca[fn](st, 12).forEach(function (it) {
          ok(it && it.id && it.answer !== undefined, fn + ": ítem mal formado");
          if (it.type === "choice") ok(it.options.indexOf(it.answer) >= 0, fn + ": falta la opción correcta " + it.id);
          if (it.type === "typed" || it.type === "translate") {
            ok(D.diagnose(it.answer, it.accept || [it.answer]).verdict === "giusto", fn + ": la respuesta esperada se rechaza: " + it.id + " " + it.answer);
          }
          ok(Banca.item(it.id) !== null, fn + ": el ítem no se regenera desde su id: " + it.id);
        });
      }
    });
    // Articles and contractions computed by the bank agree with the rules.
    ok(Banca.defArt("praia", "f") === "a" && Banca.defArt("livros", "m", true) === "os" && Banca.defArt("mãos", "f", true) === "as", "artículos calculados");
    ok(!Banca.indefArt || (Banca.indefArt("mão", "f") === "uma" && Banca.indefArt("livros", "m", true) === "uns"), "artículos indeterminados calculados");
    ok(Banca.CONTR.em.o === "no" && Banca.CONTR.de.as === "das" && Banca.CONTR.a.a === "à" && Banca.CONTR.por.o === "pelo" && Banca.CONTR.em.um === "num", "contracciones");
    Object.keys(Banca.CONTR).forEach(function (p) {
      Object.keys(Banca.CONTR[p]).forEach(function (a) {
        ok(D.util.contract(p, a) === Banca.CONTR[p][a], "la contracción " + p + " + " + a + " del banco es la del diagnóstico");
      });
    });

    if (typeof Banca.clinicaSession === "function") {
      st.errs = { contraccion: { n: 5, fixed: 0, last: Date.now() }, gostar: { n: 3, fixed: 0, last: Date.now() } };
      var cl = Banca.clinicaSession(st, 12);
      ok(cl.length >= 8, "la clínica prepara una sesión: " + cl.length);
      ok(cl.filter(function (x) { return x.clinic === "contraccion"; }).length >=
         cl.filter(function (x) { return x.clinic === "gostar"; }).length, "la clínica pesa más el error más frecuente");
    }
  }
} else {
  console.log("(docs/data/bank.json todavía no está en portugués: tests del banco salteados)");
}

/* ------------------------------ los ítems del curso (docs/data/course.json) */
(function () {
  var cp = pack.dataPath("pt", "course.json");
  var course = fs.existsSync(cp) ? JSON.parse(fs.readFileSync(cp, "utf8")) : null;
  var items = course && course.items || [];
  if (!/\b(você|não|está)\b/.test(items.slice(0, 600).map(function (i) { return String(i.answer || ""); }).join(" "))) {
    console.log("(course.json todavía no está en portugués: tests de los ítems salteados)");
    return;
  }
  var rejected = 0, seen = 0, fx = 0;
  items.forEach(function (it) {
    var acc = [it.answer].concat(it.accept || it.alt || []).filter(Boolean).map(String);
    if (/^(cloze|typed|translate)$/.test(it.type)) acc.forEach(function (a) {
      var d = D.diagnose(a, acc, { stem: it.stem });
      if (d.verdict !== "giusto") { rejected++; if (rejected < 5) console.log("  rechazada: " + it.id + " «" + a + "» " + d.cat); }
    });
    if (it.type === "fixerr") {
      fx++;
      var d2 = D.diagnose(it.stem, acc);
      if (d2.verdict !== "giusto") seen++; else console.log("  error no visto: " + it.id + " «" + it.stem + "»");
    }
  });
  ok(rejected === 0, "respuestas del curso rechazadas: " + rejected);
  ok(!fx || seen / fx >= 0.97, "frases de «corregí el error» vistas como error: " + seen + "/" + fx);
})();

/* ------------------------------------------- intentos de romperlo */

// Words that are also JavaScript property names must not break anything.
["constructor", "__proto__", "toString", "hasOwnProperty", "valueOf", "prototype"].forEach(function (w) {
  ["Ontem fui ao cinema.", w, "__proto__"].forEach(function (t) {
    var ok1 = true;
    try { D.diagnose(w, [t]); D.diagnose(t, [w]); } catch (e) { ok1 = false; }
    ok(ok1, "el diagnóstico se rompe con «" + w + "» / «" + t + "»");
  });
});
// Garbage input never throws and never prints undefined/NaN.
["", "   ", "<script>alert(1)</script>", "😀😀", "a".repeat(3000), "'''", ".,;:!?", "- - -", "\u0000", "levanto-me-me-me", "a-a-a", "dir-lhe-ei-ei"].forEach(function (w) {
  var d = null;
  try { d = D.diagnose(w, ["Comi uma pizza."]); } catch (e) { /* */ }
  ok(d && d.verdict, "entrada absurda no manejada: " + JSON.stringify(w).slice(0, 20));
  if (d && d.hint) ok(!/undefined|NaN|\[object/.test(d.hint + d.explain), "texto roto con entrada absurda");
});
ok(D.diagnose("x", [null, undefined, ""]).verdict, "esperadas vacías no rompen");

if (bank) {
  // Random typing slips on every sentence: never a crash, always a hint.
  var seed = 7;
  var rnd = function () { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
  var crashes = 0, noHint = 0;
  bank.sentences.forEach(function (s) {
    for (var r = 0; r < 3; r++) {
      var a = variants(s)[0].split("");
      var k = Math.floor(rnd() * a.length);
      a.splice(k, 1, rnd() < 0.5 ? "" : "x");
      try {
        var d = D.diagnose(a.join(""), variants(s));
        if (d.verdict !== "giusto" && (!d.hint || !d.explain)) noHint++;
      } catch (e) { crashes++; if (crashes < 3) console.log(e.stack); }
    }
  });
  ok(crashes === 0, "el diagnóstico se rompe con frases mutadas: " + crashes);
  ok(noHint === 0, "errores sin pista: " + noHint);

  // A first-attempt hint never names the corrected word.
  var leaks = 0;
  bank.errors.forEach(function (e) {
    var d = D.diagnose(e.wrong, [e.right]);
    d.fixed.filter(function (t) { return t.fix && t.w.length > 2; }).forEach(function (t) {
      if (d.hint.toLowerCase().indexOf("*" + t.w + "*") >= 0) { leaks++; if (leaks < 4) console.log("  pista reveladora: " + e.wrong + " → " + d.hint); }
    });
  });
  ok(leaks === 0, "pistas que revelan la respuesta: " + leaks);

  // Every gap is cut where the word really is (not «é» inside «café»).
  if (Banca && typeof Banca.gapItem === "function") {
    bank.sentences.forEach(function (s, i) {
      if (!s.gap) return;
      var it = Banca.gapItem(i);
      ok(it && it.stem.replace(/___ \([^)]*\)/, it.answer) === variants(s)[0], "hueco mal cortado en: " + variants(s)[0]);
    });
  }
}

T.done();
