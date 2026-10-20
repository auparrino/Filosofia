/*
 * Mapas de preposiciones del portugués de Brasil (docs/js/mapas.js los
 * dibuja).
 *
 * *em* es dónde está algo, adentro o encima (el portugués no separa «en»
 * de «sobre»); con movimiento, la preposición dice qué parte del camino se
 * mira: la llegada (*a* si volvés enseguida, *para* si es el destino), la
 * salida (*de*) o el recorrido (*por*).  *de* también es de dónde sos (*sou
 * do Rio*).  Y todas se pegan al artículo: *no, na, do, da, pelo, pela, ao,
 * à*.  Los bloques se suman al final de la lección de la semana 9.
 *
 * Escena: lm (caja | zona | superficie | punto | casa), mov ("" | hacia |
 * idaVuelta | desde | por | rumbo | lazo), label (el lugar, en portugués),
 * prep, cap (el ejemplo) y es (la idea en castellano) para el epígrafe.
 */
(function (root) {
  "use strict";
  var PROMPT = "Elegí la preposición mirando el dibujo";
  root.MAPAS_DATA = {
    week: 9,
    scenes: {
      "em-caja":    { lm: "caja", label: "caixa", prep: "em", cap: "O gato está *na* caixa.", es: "Adentro." },
      "em-sup":     { lm: "superficie", label: "mesa", prep: "em", cap: "O celular está *na* mesa.", es: "Encima: también em." },
      "em-zona":    { lm: "zona", label: "Brasil", prep: "em", cap: "Moramos *no* Brasil.", es: "En un lugar del mapa." },
      "a-ida":      { lm: "caja", mov: "idaVuelta", label: "padaria", prep: "a", cap: "Vou *à* padaria.", es: "Ir y volver enseguida: una visita." },
      "para-hacia": { lm: "punto", mov: "hacia", label: "Salvador", prep: "para", cap: "Vou *para* Salvador.", es: "El destino, adonde vas a quedarte." },
      "de-desde":   { lm: "caja", mov: "desde", label: "trabalho", prep: "de", cap: "Venho *do* trabalho.", es: "El punto de partida." },
      "por-por":    { lm: "caja", mov: "por", label: "túnel", prep: "por", cap: "O ônibus passa *pelo* túnel.", es: "El recorrido: a través." },
      "de-lazo":    { lm: "punto", mov: "lazo", label: "Rio", prep: "de", cap: "Sou *do* Rio.", es: "No es un viaje: es de dónde sos." },
      // only for the exercises
      "q-recife":   { lm: "punto", mov: "hacia", label: "Recife" }
    },
    blocks: [
      {
        h: "O mapa: onde está (em)",
        r: "*em* marca **dónde está** algo: adentro (*na caixa*), encima (*na mesa*) o en un lugar del mapa (*no Brasil*, *em São Paulo*). No hace falta elegir entre «en» y «sobre»: *em* sirve para las dos.",
        fig: ["em-caja", "em-sup", "em-zona"],
        table: { head: ["Prep.", "+ o", "+ a"], rows: [["em", "no", "na"], ["de", "do", "da"], ["por", "pelo", "pela"]] },
        ex: [
          ["O gato está *na* caixa.", "El gato está en la caja."],
          ["O celular está *na* mesa.", "El celular está sobre la mesa."],
          ["Moramos *no* Brasil, *em* São Paulo.", "Vivimos en Brasil, en São Paulo."]
        ],
        warn: "«Sobre la mesa» también es *na mesa*. *Em cima da mesa* existe, para insistir en «arriba de».",
        tip: "*em* + artículo siempre se contrae: *no, na, nos, nas*. Con *um, uma*, en el habla: *num, numa*.",
        qq: [
          { fig: "em-caja", prompt: PROMPT, stem: "O gato está ___ caixa.", answer: "na", options: ["na", "da", "pela"] },
          { fig: "em-sup", prompt: PROMPT, stem: "Deixei o celular ___ mesa.", answer: "na", options: ["na", "da", "pela"] }
        ]
      },
      {
        h: "O mapa: o movimento (a, para, de, por)",
        r: "Cuando algo se mueve, la preposición dice **qué parte del camino** mirás: la llegada (*a* si volvés enseguida, *para* si es tu destino), la salida (*de*) o el recorrido (*por*). Y *de* también dice de dónde sos: *sou do Rio*.",
        fig: ["a-ida", "para-hacia", "de-desde", "por-por", "de-lazo"],
        ex: [
          ["Vou *à* padaria e já volto.", "Voy a la panadería y ya vuelvo."],
          ["Eles se mudaram *para* Recife.", "Se mudaron a Recife."],
          ["Ele chegou *do* trabalho às sete.", "Llegó del trabajo a las siete."],
          ["O ônibus passa *pelo* túnel.", "El colectivo pasa por el túnel."],
          ["Sou *do* Rio, mas moro *em* Niterói.", "Soy de Río, pero vivo en Niterói."]
        ],
        warn: "*de* y *por* se pegan al artículo: *do, da, pelo, pela*. «De o trabalho» y «por o túnel» no existen.",
        tip: "*a* + *a* = *à* (*vou à praia*); *a* + *o* = *ao*. En el habla, *para* + *o* = *pro* (*vou pro Rio*).",
        qq: [
          { fig: "a-ida", prompt: PROMPT, stem: "Vou ___ padaria e já volto.", answer: "à", options: ["à", "da", "pela"] },
          { fig: "q-recife", prompt: PROMPT, stem: "Eles se mudaram ___ Recife.", answer: "para", options: ["para", "de", "por"] },
          { fig: "de-desde", prompt: PROMPT, stem: "Ele chegou ___ trabalho cansado.", answer: "do", options: ["do", "no", "pelo"] },
          { fig: "por-por", prompt: PROMPT, stem: "O ônibus passa ___ túnel.", answer: "pelo", options: ["pelo", "do", "no"] },
          { fig: "de-lazo", prompt: PROMPT, stem: "Minha avó é ___ Rio.", answer: "do", options: ["do", "no", "pelo"] }
        ]
      }
    ]
  };
})(typeof window !== "undefined" ? window : this);
