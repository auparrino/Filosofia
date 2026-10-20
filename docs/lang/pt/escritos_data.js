/*
 * Exercícios escritos sobre os textos já lidos (C-test, cloze racional,
 * «Ordená el texto»): as listas da língua.  Só dados: a lógica está no
 * núcleo (docs/js/ctest.js, docs/js/ordenar.js, docs/js/escritos.js).
 *
 *   conn    conectores e conjunções que o cloze racional tira
 *   prep    preposições e contrações (no, na, do, pelo…); «a» e «o» ficam
 *           de fora: também são artigos
 *   equiv   grupos que valem o mesmo num buraco (mas / porém)
 *   clues   as pistas da coesão para pôr um texto em ordem: [forma, o que
 *           diz em castelhano]; as formas de várias palavras primeiro
 *   refer   palavras que remetem a algo já dito (pronomes, demonstrativos)
 */
(function (root) {
  "use strict";
  root.ESCRITOS_DATA = {
    conn: ["e", "mas", "porque", "quando", "depois", "então", "também", "porém", "ou", "se", "enquanto",
           "portanto", "embora", "contudo", "entretanto", "aliás", "pois", "assim", "afinal", "inclusive",
           "todavia", "nem", "antes", "logo"],
    prep: ["de", "em", "com", "por", "para", "sem", "até", "sobre", "entre", "desde",
           "do", "da", "dos", "das", "no", "na", "nos", "nas", "ao", "aos", "à", "às",
           "pelo", "pela", "pelos", "pelas", "num", "numa", "nuns", "numas", "dum", "duma"],
    equiv: [["mas", "porém", "contudo", "entretanto", "todavia"], ["então", "portanto", "logo"], ["porque", "pois"],
            ["num", "em um"], ["numa", "em uma"], ["pra", "para"]],
    clues: [
      ["no final", "al final: cierra el texto"], ["no dia seguinte", "al día siguiente"], ["por isso", "por eso: consecuencia de lo anterior"],
      ["além disso", "además: suma"], ["antes de tudo", "antes que nada: abre"], ["de manhã", "a la mañana"], ["à tarde", "a la tarde"],
      ["à noite", "a la noche"], ["depois", "después: sigue a otra acción"], ["primeiro", "primero: abre"], ["antes", "antes"],
      ["enfim", "en fin: cierra o resume"], ["afinal", "al final / después de todo"], ["mas", "pero: contrasta con lo anterior"],
      ["porém", "pero: contrasta con lo anterior"], ["então", "entonces"], ["também", "también: suma a algo ya dicho"],
      ["aliás", "por cierto / mejor dicho"], ["ainda", "todavía"], ["agora", "ahora"], ["hoje", "hoy"], ["amanhã", "mañana"],
      ["ontem", "ayer"], ["finalmente", "por fin"], ["logo", "enseguida / así que"], ["aí", "ahí, entonces (coloquial)"]
    ],
    refer: ["ele", "ela", "eles", "elas", "isso", "isto", "esse", "essa", "esses", "essas", "lá", "dele", "dela"]
  };
})(typeof window !== "undefined" ? window : globalThis);
