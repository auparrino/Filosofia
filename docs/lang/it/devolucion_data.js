/*
 * Las devoluciones del italiano (docs/js/devolucion.js).
 *
 * keep:  categorías del diagnóstico que valen aunque la respuesta no se
 *        parezca a la correcta (todo escrito en español).
 * transfer: categorías del diagnóstico que son un calco del español: si
 *        se esquiva esa opción y se elige la correcta, la devolución dice
 *        «Esquivaste la trampa» con el porqué.
 * terms: [expresión, semana, en criollo]: el nombre de un tiempo o modo y
 *        la semana en que el curso lo enseña (course.json, weeks[].tenses).
 *        Antes de esa semana las devoluciones dicen lo de la derecha.  Los
 *        más largos primero.  También el metalenguaje de la escuela
 *        («objeto directo», «auxiliar», «relativo»…): hasta la semana que se
 *        indica va con su glosa, solo la primera vez que aparece en cada
 *        tramo de texto (el (?<!…) de la expresión).
 */
(function (root) {
  "use strict";
  var DATA = {
    transfer: ["parola_spagnola", "falso_amico", "a_personale", "piacere", "ausiliare", "soggetto"],
    keep: ["parola_spagnola"],
    terms: [
      ["\\bcongiuntivo trapassato\\b", 30, "subjuntivo pluscuamperfecto (como «hubiera hecho»)"],
      ["\\bcongiuntivo passato\\b", 29, "subjuntivo compuesto (como «haya hecho»)"],
      ["\\bcongiuntivo imperfetto\\b", 30, "subjuntivo pasado (como «hiciera»)"],
      ["\\bcongiuntivo presente\\b", 24, "subjuntivo (como «que haga»)"],
      ["\\bcongiuntivo\\b", 24, "subjuntivo"],
      ["\\bcondizionale (passato|composto)\\b", 31, "condicional compuesto (como «habría hecho»)"],
      ["\\bcondizionale (presente|semplice)\\b", 20, "condicional (como «haría»)"],
      ["\\bcondizionale\\b", 20, "condicional"],
      ["\\bfuturo anteriore\\b", 19, "futuro compuesto (como «habré hecho»)"],
      ["\\bfuturo semplice\\b", 19, "futuro (como «haré»)"],
      ["\\btrapassato prossimo\\b", 38, "pluscuamperfecto (como «había hecho»)"],
      ["\\btrapassato remoto\\b", 37, "pasado anterior (como «hube hecho»)"],
      ["\\bpassato remoto\\b", 37, "pasado de los relatos (como «hizo», en una narración)"],
      ["\\bpassato prossimo\\b", 11, "pasado compuesto (auxiliar + participio)"],
      ["\\bimperfetto\\b", 15, "pasado de las descripciones (como «hacía»)"],
      ["\\s*\\(indicativo\\)", 24, ""],
      ["\\bdel indicativo\\b", 24, "de la forma común del verbo"],
      ["\\bel indicativo\\b", 24, "la forma común del verbo"],
      ["\\bindicativo\\b", 24, "la forma común del verbo"],
      // metalenguaje: la palabra con su glosa, la primera vez
      ["(?<![\\s\\S]*objeto directo[\\s\\S]*)\\bobjeto directo\\b", 20, "objeto directo (la persona o cosa que recibe la acción: lo veo, la llamo)"],
      ["(?<![\\s\\S]*objeto indirecto[\\s\\S]*)\\bobjeto indirecto\\b", 20, "objeto indirecto (a quién va algo: le digo, le doy)"],
      ["(?<![\\s\\S]*[Pp]eríodo hipotético[\\s\\S]*)\\bperíodo hipotético\\b", 33, "frase con «si» (una condición y lo que pasaría)"],
      ["(?<![\\s\\S]*[Pp]eriodo hipotético[\\s\\S]*)\\bperiodo hipotético\\b", 33, "frase con «si» (una condición y lo que pasaría)"],
      ["(?<![\\s\\S]*relativo[\\s\\S]*)\\bpronombre relativo\\b", 34, "relativo (la palabra que une una frase con el sustantivo del que habla, como «que» en «el libro que leo»)"],
      ["(?<![\\s\\S]*relativo[\\s\\S]*)\\brelativo\\b", 34, "relativo (la palabra que une una frase con el sustantivo del que habla, como «que» en «el libro que leo»)"],
      ["(?<![\\s\\S]*auxiliar[\\s\\S]*)\\bauxiliar\\b", 11, "auxiliar (el verbo que arma el pasado, como «he» en «he comido»)"],
      ["(?<![\\s\\S]*participio[\\s\\S]*)\\bparticipio\\b", 11, "participio (la forma como «comido», «hecho»)"],
      ["(?<![\\s\\S]*reflexiv[\\s\\S]*)\\breflexivos\\b", 12, "reflexivos (los que van con me, te, se: «me levanto»)"],
      ["(?<![\\s\\S]*reflexiv[\\s\\S]*)\\breflexivo\\b", 12, "reflexivo (con me, te, se: «me levanto»)"],
      ["(?<![\\s\\S]*imperativo[\\s\\S]*)\\bimperativo\\b", 12, "imperativo (la forma de dar órdenes: «vení», «decime»)"],
      ["(?<![\\s\\S]*gerundio[\\s\\S]*)\\bgerundio\\b", 44, "gerundio (la forma en -ando / -endo, como «haciendo»)"]
    ]
  };
  if (typeof module === "object" && module.exports) module.exports = DATA;
  root.DEVOLUCION_DATA = DATA;
})(typeof window !== "undefined" ? window : globalThis);
