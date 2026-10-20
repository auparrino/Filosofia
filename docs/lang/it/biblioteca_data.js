/* La Biblioteca en italiano: lo que docs/js/biblioteca.js necesita saber
   de la lengua.  Los libros están en lang/it/biblioteca/ (los arma
   tools/lib/build_biblioteca.js). */
(function (root) {
  "use strict";
  root.BIBLIO_DATA = {
    ui: {
      name: "Biblioteca",
      blurb: "Collodi, Pirandello, De Amicis, Capuana, Salgari, Deledda: cuentos y novelas de verdad, " +
             "de dominio público. Tocás una palabra y te dice qué significa.",
      lead: "Libros enteros para leer mucho, a tu ritmo, en el teléfono. Primero cuentos cortos; después, novelas. " +
            "Son textos de hace más de cien años: vas a ver algunas formas antiguas (egli, codesto, dimandare)."
    },
    /* Cognados que un hispanohablante lee solo, por el sufijo: -zione
       (nazione: nación), -ità (città, università: -idad), -ismo, -ista,
       -enza, -anza, -abile, -ibile, -mente, -ario, -orio.  Solo palabras
       largas. */
    cognates: ["^[a-zà-ÿ]{3,}zion[ei]$", "^[a-zà-ÿ]{3,}ità$", "^[a-zà-ÿ]{3,}ism[oi]$", "^[a-zà-ÿ]{3,}ist[aie]$",
      "^[a-zà-ÿ]{3,}enz[ae]$", "^[a-zà-ÿ]{3,}anz[ae]$", "^[a-zà-ÿ]{3,}(abile|ibile|abili|ibili)$",
      "^[a-zà-ÿ]{4,}mente$", "^[a-zà-ÿ]{4,}ari[oa]$", "^[a-zà-ÿ]{4,}ori[oa]$"],
    /* Para llegar al lema de una forma que la lista de frecuencias no trae
       (Model.lemmas): [regex, reemplazo], se prueban todas.  Plural y
       femenino (tutti → tutto, amiche → amica), diminutivos y aumentativos
       (vocina → voce, barchetta → barca: solo los regulares), clíticos pegados al verbo (voltandosi → voltando,
       mangiarlo → mangiare, figuratevi → figurate) y los acentos graves
       de las ediciones viejas (potè → poté, sè → sé). */
    stems: [
      ["([^aeiou])i$", "$1o"], ["([^aeiou])i$", "$1e"], ["([^aeiou])e$", "$1a"], ["([^aeiou])a$", "$1o"],
      ["chi$", "co"], ["ghi$", "go"], ["che$", "ca"], ["ghe$", "ga"], ["ci$", "cio"], ["gi$", "gio"], ["ii$", "io"],
      ["^(.{2,}?)(in|ett|ell|icci|ucc|acci|ott|ucci)([oaie])$", "$1o"],
      ["^(.{2,}?)(in|ett|ell|icci|ucc|acci|ott|ucci)([oaie])$", "$1a"],
      ["^(.{2,}?)(in|ett|ell|icci|ucc|acci|ott|ucci)([oaie])$", "$1e"],
      ["^(.{2,}?)on([ei])$", "$1o"], ["^(.{2,}?)on([ei])$", "$1a"], ["^(.{2,}?)issim([oaie])$", "$1o"],
      ["^(.{3,}?)(glielo|gliela|glieli|gliele|gliene|mel[oaie]|tel[oaie]|cel[oaie]|sel[oaie]|vel[oaie]|mene|tene|cene|sene|vene)$", "$1"],
      ["^(.{3,}[aeiou]r)(glielo|gliela|glieli|gliene|mel[oaie]|tel[oaie]|cel[oaie]|sel[oaie]|mi|ti|si|ci|vi|l[oaie]|gli|ne)$", "$1e"],
      ["^(.{3,}?)(mi|ti|si|ci|vi|l[oaie]|gli|ne)$", "$1"],
      ["è$", "é"], ["ò$", "o"], ["^(.+)à$", "$1a"], ["oi$", "o"], ["iei$", "io"], ["^quei$", "quello"], ["^que'$", "quello"],
      // las formas apocopadas y elididas de las ediciones viejas: ch', v', pel, coll', de', avevan, cader
      ["^(.+)'$", "$1e"], ["^(.+)'$", "$1i"], ["^(.+)'$", "$1o"], ["^(.+)'$", "$1a"], ["^pe[il']$", "per"], ["^co(ll)?'$", "con"],
      ["^(.{3,}[aeiou][nlr])$", "$1e"], ["^(.{3,}[aeiou][nlr])$", "$1o"], ["^(.{3,}[aeiou]r)$", "$1e"],
      // la familia de la palabra (Bauer y Nation): contentezza → contento, lentamente → lento,
      // ragionamento → ragionare, cacciatore → cacciare, pensieroso → pensiero
      ["^(.{3,})ezz[ae]$", "$1o"], ["^(.{3,})ezz[ae]$", "$1e"], ["^(.{3,})amente$", "$1o"], ["^(.{3,})emente$", "$1e"],
      ["^(.{3,})lmente$", "$1le"], ["^(.{3,})rmente$", "$1re"], ["^(.{3,})([aei])ment[oi]$", "$1$2re"],
      ["^(.{3,})([aei])tor[ei]$", "$1$2re"], ["^(.{3,})([aei])tric[ei]$", "$1$2re"], ["^(.{3,})os[oaie]$", "$1o"],
      ["^(.{3,})os[oaie]$", "$1a"], ["^(.{3,})evole$", "$1are"], ["^(.{3,})ata$", "$1o"], ["^(.{3,})ata$", "$1a"]
    ],
    /* Cómo se vería la palabra en castellano, para reconocer los cognados
       transparentes contra una lista de palabras del español (solo la usa
       tools/lib/build_biblioteca.js): [regex, reemplazo] en orden; la
       segunda tanda agrega la sonorización (pescatore → pescador). */
    toSpanish: [
      [["zion[ei]$", "cion"], ["zioni$", "ciones"], ["tà$", "dad"], ["tù$", "tud"], ["([bcdfglmnprstvz])\\1", "$1"],
       ["gn", "ñ"], ["gli", "ll"], ["ch(?=[ei])", "qu"], ["gh(?=[ei])", "gu"], ["z", "c"], ["uo", "ue"],
       ["are$", "ar"], ["ere$", "er"], ["ire$", "ir"], ["ore$", "or"], ["ori$", "ores"], ["^s([bcdfgmnpqtv])", "es$1"]],
      [["([aeiou])t([aeiour])", "$1d$2"], ["([aeiou])p([aeiour])", "$1b$2"], ["([aeiou])c([aou])", "$1g$2"]]
    ]
  };
})(typeof window !== "undefined" ? window : globalThis);
