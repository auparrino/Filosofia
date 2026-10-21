/*
 * Ágora — el núcleo del lector, sin pantalla: el estado guardado, la agenda
 * del repaso, el buscador del glosario y la copia del progreso.  Lo usa
 * js/lector.js en el navegador y tools/lib/test_lector.js en Node.
 *
 * Todo lo que se guarda va en una sola clave, «agora.lector.v1».  En el
 * mismo origen vive otra app con sus datos: acá no se lee ni se borra
 * ninguna clave que no empiece con «agora».
 *
 * El repaso es de relectura, sin preguntas: al terminar de leer una semana
 * se agenda una tarjeta de resumen (sus claves) y una por concepto.  Cada
 * una vuelve a +1, +7, +30 y +90 días (cada «Releído» la pasa al intervalo
 * siguiente) y después, cada 180.  Por día se muestran como mucho TOPE,
 * primero las más viejas.
 */
(function (root) {
  "use strict";

  var CLAVE = "agora.lector.v1";
  var PASOS = [1, 7, 30, 90];
  var DESPUES = 180;
  var TOPE = 20;
  var DIA = 86400000;

  /* The local day number of a moment (days since 1970-01-01, local time). */
  function dia(ms) {
    var d = new Date(ms == null ? Date.now() : ms);
    return Math.floor((d.getTime() - d.getTimezoneOffset() * 60000) / DIA);
  }
  /* The local date of a day number, as dd/mm/aaaa. */
  function fecha(n) {
    var d = new Date(n * DIA);
    function dd(x) { return (x < 10 ? "0" : "") + x; }
    return dd(d.getUTCDate()) + "/" + dd(d.getUTCMonth() + 1) + "/" + d.getUTCFullYear();
  }

  function nuevo() {
    return {
      v: 1,
      leidas: {},          // {semana: día en que se terminó de leer}
      pos: {},             // {semana: {sec, y}}: dónde quedó cada semana
      donde: null,         // {semana, sec, y}: la última semana abierta
      tarjetas: {},        // {id: {w, t: "s"|"c", term, o, paso, vence, desde}}
      hechas: { dia: 0, n: 0 },   // cuántas se releyeron hoy (el tope)
      ajustes: { tema: "auto", letra: 1 },
      era: 1               // la época pintada en Inicio (la de la última semana leída)
    };
  }

  function obj(x) { return x && typeof x === "object" && !Array.isArray(x) ? x : null; }

  /* Any object that looks like a state, completed to a full one. */
  function sano(x) {
    var s = nuevo();
    x = obj(x);
    if (!x) return s;
    ["leidas", "pos", "tarjetas"].forEach(function (k) { if (obj(x[k])) s[k] = x[k]; });
    if (obj(x.donde) && x.donde.semana) s.donde = x.donde;
    if (x.era >= 1 && x.era <= 8) s.era = Math.floor(x.era);
    if (obj(x.hechas)) s.hechas = { dia: +x.hechas.dia || 0, n: +x.hechas.n || 0 };
    if (obj(x.ajustes)) {
      if (["auto", "claro", "oscuro"].indexOf(x.ajustes.tema) >= 0) s.ajustes.tema = x.ajustes.tema;
      var l = +x.ajustes.letra;
      if (l >= 0 && l <= 3 && Math.floor(l) === l) s.ajustes.letra = l;
    }
    return s;
  }

  function cargar(storage) {
    try {
      var raw = storage.getItem(CLAVE);
      return raw ? sano(JSON.parse(raw)) : nuevo();
    } catch (e) { return nuevo(); }
  }
  function guardar(storage, s) {
    try { storage.setItem(CLAVE, JSON.stringify(s)); return true; } catch (e) { return false; }
  }
  /* Borrar el progreso: solo la clave del lector. */
  function borrar(storage) {
    try { storage.removeItem(CLAVE); } catch (e) { /* sin almacenamiento */ }
    return nuevo();
  }

  function idResumen(w) { return "s" + w; }
  function idConcepto(w, term) { return "c" + w + ":" + term; }

  /* The week was read: it is marked, and its cards are scheduled (the ones
     it already had keep their place).  terms: the concepts of the week;
     sinTarjetas: a review of a season, marked but with nothing to schedule. */
  function marcarLeida(s, w, terms, hoy, sinTarjetas) {
    if (s.leidas[w] == null) s.leidas[w] = hoy;
    if (sinTarjetas) return s;
    function agenda(id, card) {
      if (s.tarjetas[id]) return;
      card.paso = 0;
      card.vence = hoy + PASOS[0];
      card.desde = hoy;
      s.tarjetas[id] = card;
    }
    agenda(idResumen(w), { w: w, t: "s", o: -1 });
    (terms || []).forEach(function (term, i) { agenda(idConcepto(w, term), { w: w, t: "c", term: term, o: i }); });
    return s;
  }

  /* The interval after step paso (0: the first «Releído»). */
  function intervalo(paso) { return paso < PASOS.length ? PASOS[paso] : DESPUES; }

  /* «Releído»: the card goes to the next interval, from today. */
  function releida(s, id, hoy) {
    var c = s.tarjetas[id];
    if (!c) return s;
    c.paso = (c.paso || 0) + 1;
    c.vence = hoy + intervalo(c.paso);
    if (s.hechas.dia !== hoy) s.hechas = { dia: hoy, n: 0 };
    s.hechas.n++;
    return s;
  }

  function orden(a, b) {
    return a.vence - b.vence || a.desde - b.desde || a.w - b.w || a.o - b.o;
  }
  /* Every card that is due today, the oldest first. */
  function vencidas(s, hoy) {
    return Object.keys(s.tarjetas).map(function (id) {
      var c = s.tarjetas[id];
      return { id: id, w: c.w, t: c.t, term: c.term, o: c.o == null ? 0 : c.o, paso: c.paso || 0,
               vence: c.vence, desde: c.desde || 0 };
    }).filter(function (c) { return c.vence <= hoy; }).sort(orden);
  }
  /* What is shown today: the due ones, up to the daily cap (minus those
     already reread today). */
  function paraHoy(s, hoy) {
    var hechas = s.hechas.dia === hoy ? s.hechas.n : 0;
    return vencidas(s, hoy).slice(0, Math.max(0, TOPE - hechas));
  }
  /* The next day with something to reread (after today), or null. */
  function proxima(s, hoy) {
    var min = null;
    Object.keys(s.tarjetas).forEach(function (id) {
      var v = s.tarjetas[id].vence;
      if (v > hoy && (min == null || v < min)) min = v;
    });
    return min;
  }
  /* Cards whose concept is no longer in the course (existe(id) false) go. */
  function limpiar(s, existe) {
    Object.keys(s.tarjetas).forEach(function (id) { if (!existe(id, s.tarjetas[id])) delete s.tarjetas[id]; });
    return s;
  }

  /* The glossary search: without accents or case. */
  function norm(x) {
    return String(x == null ? "" : x).normalize("NFD").replace(/[̀-ͯ]/g, "")
      .toLowerCase().replace(/\s+/g, " ").trim();
  }
  /* entries: [{term, def, …}] with a precomputed key k = norm(term) and kd =
     norm(definition).  The terms that start with the query first, then the
     ones that contain it, then the ones whose definition contains it. */
  function buscar(entries, q) {
    q = norm(q);
    if (!q) return entries.slice();
    var a = [], b = [], c = [];
    entries.forEach(function (e) {
      var k = e.k || norm(e.term);
      if (k.indexOf(q) === 0) a.push(e);
      else if (k.indexOf(q) > 0) b.push(e);
      else if ((e.kd || norm(e.def)).indexOf(q) >= 0) c.push(e);
    });
    return a.concat(b, c);
  }

  /* The copy of the progress: {app: "agora", …}. */
  function exportar(s, ahora) {
    return { app: "agora", tipo: "lector", version: 1,
             exportado: new Date(ahora == null ? Date.now() : ahora).toISOString(), estado: sano(s) };
  }
  /* Reads a copy (an object or its JSON text); throws an Error that says
     what is wrong with it. */
  function importar(x) {
    if (typeof x === "string") {
      try { x = JSON.parse(x); } catch (e) { throw new Error("El archivo no es un JSON válido."); }
    }
    if (!obj(x) || x.app !== "agora") throw new Error("No es una copia de Ágora.");
    if (x.tipo !== "lector" || !obj(x.estado)) throw new Error("Es una copia de otra versión de Ágora, que el lector no sabe leer.");
    return sano(x.estado);
  }

  var api = { CLAVE: CLAVE, PASOS: PASOS, DESPUES: DESPUES, TOPE: TOPE, dia: dia, fecha: fecha,
              nuevo: nuevo, sano: sano, cargar: cargar, guardar: guardar, borrar: borrar,
              idResumen: idResumen, idConcepto: idConcepto, marcarLeida: marcarLeida, intervalo: intervalo,
              releida: releida, vencidas: vencidas, paraHoy: paraHoy, proxima: proxima, limpiar: limpiar,
              norm: norm, buscar: buscar, exportar: exportar, importar: importar };
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.Nucleo = api;
})(typeof window !== "undefined" ? window : globalThis);
