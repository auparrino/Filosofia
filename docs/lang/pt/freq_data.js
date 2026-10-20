/* La capa de frecuencia del idioma: lo que docs/js/frequenza.js necesita
   saber de la lengua (letras, palabras vacías, lemas, pseudopalabras). */
(function (root) {
  "use strict";

  /* ------------------------------------------------------------------
     La capa de frecuencia (docs/js/frequenza.js): lo que es del portugués.
     Datos: data/frequenza.json (subtítulos de OpenSubtitles 2018, pt_br; no
     hay lista KELLY para portugués: el nivel es el rango de frecuencia del
     lema, A1 los 800 primeros, A2 hasta 2.000, B1 hasta 4.000…; ver
     tools/pt/build_frequenza.py).  Nation 2006: los 2.000 lemas más
     frecuentes cubren cerca del 90 % de lo que se dice en una conversación. */

  // Infinitive before an enclitic: fazê-lo → fazer, comprá-la → comprar,
  // pô-lo → pôr, parti-lo → partir.
  function unclitic(v) {
    var m = /^(.*?)([áâêéíô])$/.exec(v);
    if (!m) return null;
    var r = { "á": "ar", "â": "ar", "ê": "er", "é": "er", "í": "ir", "ô": "or" }[m[2]];
    return m[2] === "ô" ? m[1] + "ôr" : m[1] + r;
  }
  function plainPT(w) { return w.normalize ? w.normalize("NFD").replace(/[\u0300-\u036f]/g, "") : w; }

  // Pseudo-words keep Portuguese phonotactics.
  function phonotactic(p) {
    if (/(.)\1/.test(p.replace(/rr|ss/g, ""))) return false;       // doubled letters (but rr, ss)
    if (/ç(?![aouãõáóú])/.test(p) || /q(?!u)/.test(p)) return false;
    // consonant pairs: an onset (br, cl, tr, pl…) or a coda + onset (s, r, l, m, n, x before a consonant)
    var q = p.replace(/lh|nh|ch|rr|ss|qu|gu/g, "C");
    var pairs = q.match(/[bcdfgjlmnprstvxz](?=[bcdfgjlmnprstvxz])/g) ? q.match(/[bcdfgjlmnprstvxz][bcdfgjlmnprstvxz]/g) : [];
    for (var i = 0; i < pairs.length; i++) {
      var pr = pairs[i], at = q.indexOf(pr);
      var onset = /^[bcdfgptv][rl]$/.test(pr) && pr !== "dl" && pr !== "vl";
      if (!onset && (at === 0 || !/^[srlmnx]/.test(pr))) return false;
    }
    if (/[^aeiouáàâãéêíóôõú]{3}/.test(p.replace(/lh|nh|ch|rr|ss|qu|gu/g, "C"))) return false;
    if (/^(rr|ss|lh|nh)/.test(p)) return false;
    if (/[bcdfgjkptvq]$/.test(p)) return false;                   // Portuguese words end in a vowel, r, s, l, z, m
    if (/[^aeiouáàâãéêíóôõú]{2}$/.test(p) && !/(ns|rs|ls)$/.test(p)) return false;
    return /[aeiouáàâãéêíóôõú]/.test(p);
  }

  root.FREQ_DATA = {
    letters: "a-záàâãéêíóôõúüç",
    elision: false,
    // the lemmas of the function words are known too (está → estar, tem → ter)
    stopLemmas: true,
    STOP: ("o a os as um uma uns umas de em por para pra pro com sem sobre até e ou mas nem que se " +
      "não sim é são ser sou somos está estão estou estamos tá tô tem têm tenho temos há " +
      "do da dos das no na nos nas num numa ao aos à às pelo pela pelos pelas dele dela deles delas " +
      "nele nela neste nesse deste desse disso isso isto aquilo este esta esse essa aquele aquela " +
      "eu tu você vocês ele ela eles elas nós gente me te lhe mim comigo conosco meu minha meus minhas " +
      "seu sua seus suas nosso nossa teu tua como onde quando quem qual quais quanto porque por que " +
      "aqui aí ali lá cá mais menos muito pouco tão tanto também já ainda sempre nunca agora depois " +
      "antes hoje ontem amanhã bem mal então só tudo nada coisa né").split(/\s+/),
    // Before the apostrophe rule: hyphenated clitics (chamo-me, fazê-lo) and
    // compounds (guarda-chuva, kept whole).
    lemmaPre: function (w, D, lemma) {
      var k = w.indexOf("-");
      if (k > 0 && /-(me|te|se|lhe|lhes|nos|vos|o|a|os|as|lo|la|los|las|no|na|nas)(-|$)/.test(w)) {
        // the verb of a verb + clitic: chamo-me, fazê-lo, parti-lo
        var head = w.slice(0, k), inf = unclitic(head);
        if (inf && D.lemmi[inf]) return inf;
        if (/-(lo|la|los|las)(-|$)/.test(w) && D.lemmi[head + "r"]) return head + "r";
        return lemma(head);
      }
      if (k > 0) return w;                                           // a compound: guarda-chuva
      return null;
    },
    // After it: rare superlatives and diminutives: lindíssimo → lindo, gatinhos → gato.
    lemmaPost: function (w, D) {
      var m = /^(.{3,}?)(?:íssim|zinh|inh)([oa])s?$/.exec(w);
      if (m) {
        var c = [m[1] + m[2], m[1] + "o", m[1] + "e", m[1]];
        for (var i = 0; i < c.length; i++) if (D.lemmi[c[i]] || D.forme[c[i]]) return D.forme[c[i]] || c[i];
      }
      return null;
    },
    /* Pseudo-words («Palavra ou não?»): a real word with one letter of its
       stem swapped for another of its kind, keeping Portuguese phonotactics:
       - the ending stays (-ção, -ções, -mente, -inho, -dade, -agem, -eiro,
         -oso, -ar, -er, -ir…), so it still looks like a noun, adverb or verb;
       - digraphs are never broken (lh, nh, ch, rr, ss, qu, gu), ç only
         before a, o, u, no doubled letters but rr and ss, no three
         consonants in a row, no syllable without a vowel;
       - c and g before e / i keep the word's sound class;
       - it is never a word: not a lemma or a form of the lists, and not a
         real word once the accents are taken away (voce ≠ você) or the
         plural -s is dropped. */
    pseudo: {
      vow: "aeiou", cons: "bcdfgjlmnprstvz", tries: 40,
      only: /^[a-záàâãéêíóôõúç]+$/,
      endings: /(ções|ção|mente|zinho|zinha|inho|inha|dades|dade|agens|agem|eiro|eira|oso|osa|ista|ável|ível|ar|er|ir|ão|ões|ns|s)$/,
      digraph: /^(lh|nh|ch|rr|ss|qu|gu)$/,
      keep: function (r, w, k) { return !(/[cg]/.test(r) && /[ei]/.test(w[k + 1] || "")); },
      plain: plainPT,
      ok: phonotactic
    }
  };
})(typeof window !== "undefined" ? window : globalThis);
