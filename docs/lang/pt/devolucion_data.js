/*
 * Las devoluciones del portugués (docs/js/devolucion.js).
 *
 * keep:  categorías del diagnóstico que valen aunque la respuesta no se
 *        parezca a la correcta (todo escrito en español).
 * transfer: categorías del diagnóstico que son un calco del español: si
 *        se esquiva esa opción y se elige la correcta, la devolución dice
 *        «Esquivaste la trampa» con el porqué.
 * terms: [expresión, semana, en criollo]: el nombre de un tiempo o modo y
 *        la semana en que el curso lo enseña (course.json, weeks[].tenses;
 *        «indicativo» aparece en la teoría en la semana 23).  Antes de esa
 *        semana las devoluciones dicen lo de la derecha.  Los más largos
 *        primero.
 *        Al final, el metalenguaje de la escuela que el curso nunca presenta
 *        (hiato, llanas, esdrújulas, átono, objeto directo…): semana 99, así
 *        que siempre se glosa; no se toca si ya viene glosado (entre
 *        paréntesis o seguido de uno).
 */
(function (root) {
  "use strict";
  var DATA = {
    transfer: ["espanol", "falso_amigo", "a_personal", "gostar", "muito", "perfeito_composto", "regularizacion"],
    keep: ["espanol"],
    terms: [
      ["\\b(pretérito )?mais-que-perfeito do subjuntivo\\b", 30, "subjuntivo pluscuamperfecto (como «hubiera hecho»)"],
      ["\\bpretérito perfeito do subjuntivo\\b", 30, "subjuntivo compuesto (como «haya hecho»)"],
      ["\\b(pretérito )?imperfeito do subjuntivo\\b", 28, "subjuntivo pasado (como «hiciera»)"],
      ["\\bfuturo composto do subjuntivo\\b", 30, "subjuntivo futuro compuesto (como «cuando haya hecho»)"],
      ["\\bfuturo do subjuntivo\\b", 27, "subjuntivo futuro (como «cuando haga», con quando o se)"],
      ["\\bpresente do subjuntivo\\b", 23, "subjuntivo (como «que haga»)"],
      ["\\binfinitivo pessoal\\b", 29, "infinitivo que se conjuga (con persona)"],
      ["\\b(pretérito )?mais-que-perfeito composto\\b", 21, "pluscuamperfecto (como «había hecho»)"],
      ["\\b(pretérito )?mais-que-perfeito( simples)?\\b", 41, "pluscuamperfecto simple, de la escritura (como «había hecho»)"],
      ["\\b(pretérito )?perfeito composto\\b", 21, "pasado compuesto (como «vengo haciendo»)"],
      ["\\bpretérito perfeito\\b", 11, "pasado (como «hice»)"],
      ["(?<=\\b(el|del|al|en|con) )perfeito\\b", 11, "pasado (como «hice»)"],
      ["\\b(pretérito )?imperfeito\\b", 15, "pasado de las descripciones (como «hacía»)"],
      ["\\bfuturo do pretérito composto\\b", 30, "condicional compuesto (como «habría hecho»)"],
      ["\\bfuturo do pretérito( \\(condicional\\))?", 18, "condicional (como «haría»)"],
      ["\\bfuturo do presente composto\\b", 30, "futuro compuesto (como «habré hecho»)"],
      ["\\bfuturo do presente\\b", 17, "futuro (como «haré»)"],
      ["\\bpresente do indicativo\\b", 23, "presente"],
      ["\\s*\\(?do indicativo\\)?", 23, ""],
      ["\\bdel indicativo\\b", 23, "de la forma común del verbo"],
      ["\\bel indicativo\\b", 23, "la forma común del verbo"],
      ["\\bindicativo\\b", 23, "la forma común del verbo"],
      ["(?<![(\\p{L}])esdrújulas?(?![\\p{L})]| \\()", 99, "esdrújulas (con el acento en la antepenúltima sílaba)"],
      ["(?<![(\\p{L}])llanas?(?![\\p{L})]| \\()", 99, "llanas (con el acento en la anteúltima sílaba)"],
      ["(?<![(\\p{L}])agudas?(?![\\p{L})]| \\()", 99, "agudas (con el acento en la última sílaba)"],
      ["(?<![(\\p{L}])(en )?hiato(?![\\p{L})]| \\()", 99, "separada de la vocal de al lado (hiato)"],
      ["(?<![(\\p{L}])diptongos?(?![\\p{L})]| \\()", 99, "dos vocales en una sílaba (diptongo)"],
      ["(?<![(\\p{L}])pronombre átono(?![\\p{L})]| \\()", 99, "pronombre átono (me, te, se, lhe, o, a)"],
      ["(?<![(\\p{L}])objeto directo(?![\\p{L})]| \\()", 99, "objeto directo (lo que recibe la acción, sin preposición)"],
      ["(?<![(\\p{L}])objeto indirecto(?![\\p{L})]| \\()", 99, "objeto indirecto (a quién, con «a» en español)"]
    ]
  };
  if (typeof module === "object" && module.exports) module.exports = DATA;
  root.DEVOLUCION_DATA = DATA;
})(typeof window !== "undefined" ? window : globalThis);
