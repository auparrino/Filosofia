/* La Biblioteca en portugués: lo que docs/js/biblioteca.js necesita saber
   de la lengua.  Los libros están en lang/pt/biblioteca/ (los arma
   tools/lib/build_biblioteca.js; la ortografía la moderniza
   tools/pt/ortografia.js). */
(function (root) {
  "use strict";
  root.BIBLIO_DATA = {
    ui: {
      name: "Biblioteca",
      blurb: "Machado de Assis, Eça de Queirós, Lima Barreto, Aluísio Azevedo: cuentos y novelas de verdad, " +
             "de dominio público, con la ortografía de hoy. Tocás una palabra y te dice qué significa.",
      lead: "Libros enteros para leer mucho, a tu ritmo, en el teléfono. Primero cuentos cortos; después, novelas. " +
            "La ortografía está actualizada al Acuerdo de 1990 (las ediciones originales escribían pharmacia, elle, sahir)."
    },
    /* Cognados que un hispanohablante lee solo, por el sufijo: -ção
       (nação: nación), -dade (cidade: ciudad), -ismo, -ista, -ência,
       -ância, -ável, -ível, -ário, -ório, -ico acentuado, -mente.  Solo
       palabras largas: las cortas engañan más. */
    cognates: ["^[a-zà-ÿ]{3,}ções?$", "^[a-zà-ÿ]{3,}dades?$", "^[a-zà-ÿ]{3,}ismos?$", "^[a-zà-ÿ]{3,}istas?$",
      "^[a-zà-ÿ]{3,}ências?$", "^[a-zà-ÿ]{3,}âncias?$", "^[a-zà-ÿ]{3,}(ável|ível|áveis|íveis)$",
      "^[a-zà-ÿ]{4,}ári[oa]s?$", "^[a-zà-ÿ]{4,}óri[oa]s?$", "^[a-zà-ÿ]*[áéíóúâêô][a-zç]*ic[oa]s?$",
      "^[a-zà-ÿ]{4,}mente$"],
    /* Para llegar al lema de una forma que la lista de frecuencias no trae
       (Model.lemmas): [regex, reemplazo], se prueban todas.  Plural
       (lugares → lugar, papéis → papel, nações → nação), femenino (bonita →
       bonito), diminutivos (casinha → casa, livrinho → livro, cafezinho →
       café) y superlativos (belíssimo → belo).  Los clíticos van con guion
       (chamou-me) y la capa de frecuencia ya los separa. */
    stems: [
      ["s$", ""], ["es$", ""], ["ões$", "ão"], ["ães$", "ão"], ["ais$", "al"], ["éis$", "el"], ["eis$", "el"],
      ["óis$", "ol"], ["uis$", "ul"], ["is$", "il"], ["ns$", "m"],
      ["a$", "o"], ["as$", "o"], ["ã$", "ão"], ["ãs$", "ão"], ["esa$", "ês"], ["esas$", "ês"], ["ora$", "or"], ["oras$", "or"],
      ["^(.{2,}?)z?inh([oa])s?$", "$1o"], ["^(.{2,}?)z?inh([oa])s?$", "$1a"], ["^(.{2,}?)z?inh([oa])s?$", "$1e"],
      ["^(.{2,}?)zinh([oa])s?$", "$1"], ["^(.{2,}?)(ã|ão)zinh([oa])s?$", "$1ão"],
      ["^(.{2,}?)íssim([oa])s?$", "$1o"],
      // la familia de la palabra (Bauer y Nation): tristeza → triste, lentamente → lento,
      // pensamento → pensar, trabalhador → trabalhar, carinhoso → carinho
      ["^(.{3,})ez[ae]s?$", "$1o"], ["^(.{3,})ez[ae]s?$", "$1e"], ["^(.{3,})amente$", "$1o"], ["^(.{3,})mente$", "$1"],
      ["^(.{3,})([aei])mentos?$", "$1$2r"], ["^(.{3,})([aei])dor(a|es|as)?$", "$1$2r"], ["^(.{3,})os([oa])s?$", "$1o"],
      ["^(.{3,})os([oa])s?$", "$1a"], ["^(.{3,})ada(s)?$", "$1o"], ["^(.{3,})ada(s)?$", "$1a"]
    ],
    /* Cómo se vería la palabra en castellano, para reconocer los cognados
       transparentes contra una lista de palabras del español (solo la usa
       tools/lib/build_biblioteca.js): [regex, reemplazo] en orden; la
       segunda tanda prueba el diptongo (porta → puerta, tempo → tiempo). */
    toSpanish: [
      [["ção$", "ción"], ["ções$", "ciones"], ["são$", "sión"], ["sões$", "siones"], ["dade$", "dad"], ["agem$", "aje"],
       ["nh", "ñ"], ["lh", "ll"], ["ss", "s"], ["ç", "z"], ["m$", "n"], ["vel$", "ble"], ["veis$", "bles"],
       ["ão$", "ón"], ["ei", "e"], ["ou", "o"], ["x", "j"]],
      [["o([^aeiou]+[aeo])$", "ue$1"], ["e([^aeiou]+[aeo])$", "ie$1"]]
    ]
  };
})(typeof window !== "undefined" ? window : globalThis);
