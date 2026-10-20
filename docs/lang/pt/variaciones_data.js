/*
 * Variações: uma frase já aprendida, reescrita mudando uma peça só (outra
 * pessoa, a negativa, outra coisa, o passado, o plural).  Só dados: a
 * lógica está no núcleo, docs/js/variaciones.js, que conjuga com Conj e
 * corrige com o motor (Diagnosi).
 *
 * Cada moldura (frame):
 *   f    o id da frase (frasi_data.js)
 *   v    o infinitivo do verbo que se conjuga; p a pessoa (0-5); t o tempo
 *        (padrão: presente)
 *   tpl  a frase como molde: {v} o verbo conjugado (com o pronome
 *        reflexivo), {n} onde vai a negação, {s} o sujeito, {o} a coisa (o)
 *   vars as variações:
 *        per  outra pessoa (p; s o sujeito; sub [[de, para]] outras trocas
 *             que vão com a pessoa)
 *        neg  a negativa
 *        obj  outra coisa (o, cue: como se diz em castelhano)
 *        pas  o pretérito perfeito (sub: ontem no lugar de hoje…)
 *        plu  o plural (p e/ou o)
 *        w    a semana a partir da qual vale (senão: a do tipo, abaixo)
 * No Brasil o sujeito se diz quase sempre: quando a variação muda a
 * pessoa, a resposta o mostra (e aceita sem ele só quando a frase original
 * não o tinha e a pessoa não é ambígua).  O teste
 * (tools/lib/test_ejercicios.js) confere que o molde refaz a frase exata e
 * que cada variação passa pelo corretor.
 */
(function (root) {
  "use strict";

  var FRAMES = [
    { f: "frase:oi:7", v: "chamar-se", p: 0, tpl: "{s} {n} {v} Sofía.", s: true,
      vars: [{ k: "per", p: 2, s: "ela", sub: [["Sofía", "Ana"]] }, { k: "neg" },
             { k: "plu", p: 5, s: "elas", sub: [["Sofía", "Ana e Bia"]] }] },
    { f: "frase:oi:10", v: "ser", p: 2, tpl: "De onde {s} {v}?", s: "você",
      vars: [{ k: "plu", p: 5, s: "vocês" }, { k: "per", p: 2, s: "ela" }] },
    { f: "frase:oi:11", v: "ser", p: 0, tpl: "{s} {v} argentino, de Buenos Aires.",
      vars: [{ k: "per", p: 2, s: "ela", sub: [["argentino", "argentina"]] },
             { k: "plu", p: 3, s: "nós", sub: [["argentino", "argentinos"]] }] },
    { f: "frase:oi:13", v: "falar", p: 2, tpl: "{s} {n} {v} {o}?", s: "você", o: "espanhol",
      vars: [{ k: "plu", p: 5, s: "vocês" }, { k: "neg" }, { k: "obj", o: "inglês", cue: "inglés (inglês)" }] },
    { f: "frase:oi:14", v: "falar", p: 0, tpl: "{s} {v} um pouco de {o}.", o: "português",
      vars: [{ k: "plu", p: 3, s: "nós" }, { k: "per", p: 2, s: "ela" },
             { k: "obj", o: "francês", cue: "francés (francês)" }] },
    { f: "frase:socorro:0", v: "entender", p: 0, t: "perfeito", tpl: "Desculpa, {s} não {v}.",
      vars: [{ k: "plu", p: 3, s: "nós" }, { k: "per", p: 2, s: "ela" }] },
    { f: "frase:socorro:1", v: "poder", p: 2, tpl: "{s} {v} repetir, por favor?",
      vars: [{ k: "plu", p: 5, s: "vocês" }] },
    { f: "frase:socorro:8", v: "estar", p: 0, tpl: "{s} {n} {v} aprendendo {o}.", o: "português",
      vars: [{ k: "plu", p: 3, s: "nós" }, { k: "neg" }, { k: "obj", o: "italiano", cue: "italiano (italiano)" },
             { k: "per", p: 2, s: "ela" }] },
    { f: "frase:socorro:13", v: "precisar", p: 0, tpl: "{s} {n} {v} de {o}.", o: "ajuda",
      vars: [{ k: "plu", p: 3, s: "nós" }, { k: "neg" }, { k: "obj", o: "um médico", cue: "un médico (médico, m.)" },
             { k: "obj", o: "uma farmácia", cue: "una farmacia (farmácia, f.)" }] },
    { f: "frase:boteco:9", v: "pagar", p: 0, tpl: "Hoje {s} {v}!", s: "eu",
      vars: [{ k: "per", p: 2, s: "ela" }, { k: "plu", p: 3, s: "nós" }, { k: "pas", sub: [["Hoje", "Ontem"]] }] },
    { f: "frase:boteco:15", v: "poder", p: 2, tpl: "{s} {v} trazer {o}?", o: "mais gelo",
      vars: [{ k: "plu", p: 5, s: "vocês" }, { k: "obj", o: "o cardápio", cue: "la carta (cardápio, m.)" },
             { k: "obj", o: "a conta", cue: "la cuenta (conta, f.)" }] },
    { f: "frase:padaria:4", v: "poder", p: 0, tpl: "{s} {v} pagar com cartão?",
      vars: [{ k: "plu", p: 3, s: "nós" }, { k: "per", p: 2, s: "ela" }] },
    { f: "frase:padaria:12", v: "poder", p: 2, tpl: "{s} {v} ficar com o troco.",
      vars: [{ k: "plu", p: 5, s: "vocês" }] },
    { f: "frase:trabalho:1", v: "trabalhar", p: 0, tpl: "{s} {n} {v} com {o}.", o: "marketing",
      vars: [{ k: "per", p: 2, s: "ela" }, { k: "plu", p: 3, s: "nós" }, { k: "neg" },
             { k: "obj", o: "turismo", cue: "turismo (turismo)" }] },
    { f: "frase:trabalho:6", v: "mandar", p: 0, tpl: "{s} {n} {v} {o} hoje.", o: "o e-mail",
      vars: [{ k: "plu", p: 3, s: "nós" }, { k: "neg" }, { k: "pas", sub: [["hoje", "ontem"]] },
             { k: "plu", o: "os e-mails", cue: "los mails (e-mails)", bad: ["Mando o e-mails hoje."] }] },
    { f: "frase:trabalho:10", v: "ter", p: 0, tpl: "{s} {n} {v} muito trabalho hoje.",
      vars: [{ k: "plu", p: 3, s: "nós" }, { k: "neg" }, { k: "per", p: 2, s: "ela" },
             { k: "pas", sub: [["hoje", "ontem"]] }] },
    { f: "frase:trabalho:15", v: "sair", p: 0, tpl: "{s} {n} {v} do escritório às seis.",
      vars: [{ k: "plu", p: 3, s: "nós" }, { k: "neg" }, { k: "per", p: 2, s: "ela" },
             { k: "obj", sub: [["às seis", "às sete"]], cue: "a las siete (sete)" }, { k: "pas" }] },
    { f: "frase:planos:3", v: "querer", p: 2, tpl: "{s} {n} {v} ir {o}?", s: "você", o: "ao cinema",
      vars: [{ k: "plu", p: 5, s: "vocês" }, { k: "neg" },
             { k: "obj", o: "à praia", cue: "a la playa (praia, f.)", bad: ["Você quer ir a praia?", "Você quer ir ao praia?"] },
             { k: "obj", o: "ao teatro", cue: "al teatro (teatro, m.)" }] },
    { f: "frase:feira:6", v: "poder", p: 0, tpl: "{s} {v} provar?",
      vars: [{ k: "plu", p: 3, s: "nós" }, { k: "per", p: 2, s: "ela" }] },
    { f: "frase:praia:8", v: "ir", p: 0, tpl: "{s} {n} {v} dar um mergulho.",
      vars: [{ k: "plu", p: 3, s: "nós" }, { k: "neg" }, { k: "per", p: 2, s: "ela" }] },
    { f: "frase:praia:10", v: "ir", p: 0, tpl: "{s} {n} {v} dar uma volta no calçadão.",
      vars: [{ k: "plu", p: 3, s: "nós" }, { k: "neg" }, { k: "per", p: 2, s: "ele" }] },
    { f: "frase:metro:5", v: "precisar", p: 0, tpl: "{s} {n} {v} descer na General Osório.",
      vars: [{ k: "plu", p: 3, s: "nós" }, { k: "neg" }, { k: "per", p: 2, s: "ela" }] },
    { f: "frase:metro:14", v: "comprar", p: 0, tpl: "Onde {s} {v} {o}?", s: "eu", o: "o cartão do metrô",
      vars: [{ k: "plu", p: 3, s: "nós" }, { k: "obj", o: "o bilhete", cue: "el boleto (bilhete, m.)" }] },
    { f: "frase:familia:2", v: "morar", p: 5, tpl: "{o} {n} {v} em Córdoba.", o: "Meus pais",
      vars: [{ k: "obj", p: 2, o: "Minha irmã", cue: "mi hermana (irmã, f.): una sola persona",
               bad: ["Meu irmã mora em Córdoba.", "Minha irmã moram em Córdoba."] },
             { k: "neg" }] },
    { f: "frase:familia:8", v: "morar", p: 0, tpl: "{s} {n} {v} {o}.", o: "num apartamento pequeno",
      vars: [{ k: "plu", p: 3, s: "nós" }, { k: "neg" },
             { k: "obj", o: "numa casa grande", cue: "una casa grande (casa, f.)", acc: ["Moro em uma casa grande."], bad: ["Moro num casa grande."] }] },
    { f: "frase:passado:8", v: "dormir", p: 0, t: "perfeito", tpl: "{s} {n} {v} até tarde.",
      vars: [{ k: "plu", p: 3, s: "nós" }, { k: "per", p: 2, s: "ela" }, { k: "neg" }] },
    { f: "frase:passado:14", v: "chegar", p: 0, t: "perfeito", tpl: "{s} {n} {v} tarde ontem à noite.",
      vars: [{ k: "plu", p: 3, s: "nós" }, { k: "per", p: 2, s: "ela" }, { k: "neg" }] },
    { f: "frase:saude:2", v: "estar", p: 0, tpl: "{s} {n} {v} com febre.",
      vars: [{ k: "per", p: 2, s: "ela" }, { k: "neg" }, { k: "plu", p: 5, s: "eles" }] }
  ];

  root.VARIACIONES_DATA = {
    frames: FRAMES,
    // Sujeitos: [pronome, como se diz em castelhano].  No Brasil o sujeito
    // se diz: a resposta o mostra quando a variação o pede.
    subj: [["eu", "yo"], ["tu", "vos"], ["ele", "él"], ["nós", "nosotros"], ["vós", "vosotros"], ["eles", "ellos"]],
    subjAlt: { "ela": "ella", "você": "vos", "vocês": "ustedes", "elas": "ellas", "ele": "él", "eles": "ellos", "eu": "yo", "nós": "nosotros" },
    proDrop: false,
    // «a gente» + 3.ª do singular também vale por «nós».
    weAlt: { s: "a gente", p: 2 },
    neg: "não",
    // O erro típico: o «no» castelhano no lugar de «não».
    negTrap: "no",
    negNote: "*Não* vai antes do verbo e antes do pronome que se prende a ele: *não me chamo*, *não te conheço*. «No» é *em + o* (no Rio), nunca a negação.",
    past: { tense: "perfeito", week: 11,
            note: "o pretérito perfeito conta o que já aconteceu e terminou: *falei, comi, saí*; *ir* e *ser* dividem as formas: *fui*." },
    weeks: { per: 1, neg: 1, obj: 3, plu: 2 }
  };
})(typeof window !== "undefined" ? window : globalThis);
