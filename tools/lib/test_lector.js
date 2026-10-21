/* El lector sin pantalla (docs/js/nucleo.js) y los datos que lee.
 *
 * - La agenda del repaso: +1, +7, +30, +90 y después cada 180 días; el tope
 *   de 20 por día; primero las más viejas.
 * - El buscador del glosario: sin tildes ni mayúsculas.
 * - La copia del progreso: {app: "agora", …}, ida y vuelta, y lo que rechaza.
 * - Solo se tocan claves que empiezan con «agora» (en el mismo origen vive
 *   otra app): en el almacenamiento y en el código.
 * - Cada semana de docs/lang/<edición>/data/ tiene lo que la pantalla
 *   necesita.
 * Run: node tools/lib/test_lector.js */
"use strict";
var fs = require("fs"), path = require("path");
var ROOT = path.join(__dirname, "..", "..");
var T = require("./testkit.js")("lib"), ok = T.ok, eq = T.eq;
var N = require(path.join(ROOT, "docs", "js", "nucleo.js"));

function terms(k) { var out = []; for (var i = 0; i < k; i++) out.push("concepto " + i); return out; }

// ------------------------------------------------------------ la agenda
(function () {
  var D = 20000, s = N.nuevo();
  N.marcarLeida(s, 1, terms(12), D);
  eq(Object.keys(s.tarjetas).length, 13, "una semana leída agenda el resumen y una tarjeta por concepto");
  eq(s.leidas[1], D, "la semana queda leída el día en que se marcó");
  eq(N.paraHoy(s, D).length, 0, "el mismo día no hay nada para repasar");
  eq(N.paraHoy(s, D + 1).length, 13, "al día siguiente, todas");
  var id = N.idResumen(1), want = [D + 1, D + 8, D + 38, D + 128, D + 308, D + 488], day = D + 1;
  for (var k = 0; k < want.length; k++) {
    eq(s.tarjetas[id].vence, want[k], "el resumen vence a +" + (want[k] - (k ? want[k - 1] : D)) + " días (paso " + k + ")");
    N.releida(s, id, s.tarjetas[id].vence);
  }
  eq(N.PASOS.concat([N.DESPUES]), [1, 7, 30, 90, 180], "los intervalos: +1, +7, +30, +90 y después 180");
  // marking again does not reset what is scheduled
  var before = JSON.stringify(s.tarjetas);
  N.marcarLeida(s, 1, terms(12), day + 400);
  eq(JSON.stringify(s.tarjetas), before, "marcar de nuevo una semana leída no la reagenda");
  eq(s.leidas[1], D, "ni le cambia la fecha");
  // a review of a season: read, nothing scheduled
  N.marcarLeida(s, 13, [], D, true);
  ok(s.leidas[13] === D && !s.tarjetas[N.idResumen(13)], "el repaso de la estación se marca leído sin tarjetas");
  // a reread late: the next interval counts from the day it was reread
  var s2 = N.nuevo();
  N.marcarLeida(s2, 2, [], D);
  N.releida(s2, N.idResumen(2), D + 10);
  eq(s2.tarjetas[N.idResumen(2)].vence, D + 17, "releída tarde, el intervalo siguiente cuenta desde ese día");
})();

// the daily cap and the order
(function () {
  var D = 30000, s = N.nuevo();
  N.marcarLeida(s, 5, terms(12), D + 2);     // read later
  N.marcarLeida(s, 3, terms(12), D);         // read first
  N.marcarLeida(s, 4, terms(12), D + 1);
  var day = D + 10;
  eq(N.vencidas(s, day).length, 39, "vencidas: las 39 tarjetas");
  var hoy = N.paraHoy(s, day);
  eq(hoy.length, N.TOPE, "como mucho " + N.TOPE + " por día");
  eq(N.TOPE, 20, "el tope es 20");
  eq(hoy[0].id, N.idResumen(3), "primero el resumen de la semana leída antes");
  ok(hoy.slice(0, 13).every(function (c) { return c.w === 3; }), "primero todas las de la semana más vieja");
  eq(hoy.slice(1, 13).map(function (c) { return c.term; }), terms(12), "los conceptos en el orden de la semana");
  ok(hoy.slice(13).every(function (c) { return c.w === 4; }), "después, las de la siguiente");
  for (var i = 0; i < 5; i++) N.releida(s, hoy[i].id, day);
  eq(N.paraHoy(s, day).length, 15, "después de releer 5, quedan 15 para hoy (el tope cuenta las releídas)");
  ok(N.paraHoy(s, day).every(function (c) { return c.vence <= day; }), "las releídas ya no vencen hoy");
  for (i = 0; i < 15; i++) N.releida(s, N.paraHoy(s, day)[0].id, day);
  eq(N.paraHoy(s, day).length, 0, "con 20 releídas, nada más por hoy");
  eq(N.vencidas(s, day).length, 19, "aunque queden vencidas");
  eq(N.paraHoy(s, day + 1).length, 19, "al otro día siguen las 19 que quedaron (el tope vuelve a 20)");
  eq(N.paraHoy(s, day + 1)[0].w, 4, "empezando por las que quedaron (las más viejas)");
  eq(N.proxima(s, day), day + 7, "la próxima que vence después de hoy");
  // an older due date goes first, whatever the week
  var s3 = N.nuevo();
  N.marcarLeida(s3, 9, [], D);
  N.marcarLeida(s3, 1, [], D + 5);
  eq(N.paraHoy(s3, D + 20).map(function (c) { return c.w; }), [9, 1], "lo que vence antes va primero");
  // orphans go
  N.limpiar(s3, function (id) { return id !== N.idResumen(9); });
  eq(Object.keys(s3.tarjetas), [N.idResumen(1)], "limpiar saca las tarjetas que ya no están en el curso");
})();

// ------------------------------------------------------------ el buscador
(function () {
  eq(N.norm("  Lógos  ÉTICA "), "logos etica", "norm: sin tildes, sin mayúsculas, sin espacios de más");
  eq(N.norm("Über Ñandú"), "uber nandu", "norm: diéresis y eñe");
  var e = [{ term: "ética", def: "la rama que pregunta qué debemos hacer" },
           { term: "metaética", def: "lo que significa «bueno»" },
           { term: "virtud", def: "excelencia: areté, en la ética antigua" },
           { term: "Lógos", def: "palabra, razón" }];
  eq(N.buscar(e, "ETICA").map(function (x) { return x.term; }), ["ética", "metaética", "virtud"],
    "buscar: primero los que empiezan, después los que contienen, después la definición");
  eq(N.buscar(e, "logos").map(function (x) { return x.term; }), ["Lógos"], "buscar «logos» encuentra «Lógos»");
  eq(N.buscar(e, "lógos").map(function (x) { return x.term; }), ["Lógos"], "y con tilde también");
  eq(N.buscar(e, "").length, 4, "sin búsqueda, todos");
  eq(N.buscar(e, "zzz").length, 0, "sin resultados");
})();

// ------------------------------------------------------------ la copia
(function () {
  var s = N.nuevo();
  N.marcarLeida(s, 1, terms(3), 21000);
  s.pos[1] = { sec: "texto", y: 1234 };
  s.donde = { semana: 1, sec: "texto", y: 1234 };
  s.ajustes = { tema: "oscuro", letra: 3 };
  var copia = N.exportar(s, Date.UTC(2026, 9, 21));
  eq(copia.app, "agora", "la copia dice app: agora");
  eq(copia.exportado, "2026-10-21T00:00:00.000Z", "y cuándo se hizo");
  var back = N.importar(JSON.stringify(copia));
  eq(back, N.sano(s), "exportar e importar devuelve el mismo progreso");
  var errs = [["{", /JSON/], [JSON.stringify({ app: "c1", estado: {} }), /no es una copia de Ágora/i],
              [JSON.stringify({ app: "agora", version: 3 }), /otra versión/], ["[]", /no es una copia/i]];
  errs.forEach(function (x) {
    var msg = null;
    try { N.importar(x[0]); } catch (e) { msg = e.message; }
    ok(msg && x[1].test(msg), "importar rechaza " + x[0].slice(0, 30) + " con un mensaje claro: " + msg);
  });
  var raro = N.sano({ leidas: [], ajustes: { tema: "fucsia", letra: 9 }, era: 42 });
  eq([raro.leidas, raro.ajustes, raro.era], [{}, { tema: "auto", letra: 1 }, 1], "un estado raro se completa con lo de fábrica");
})();

// ------------------------------------------------------------ solo claves agora
(function () {
  function fake(init) {
    var m = Object.assign({}, init), writes = [];
    return { m: m, writes: writes,
             getItem: function (k) { return k in m ? m[k] : null; },
             setItem: function (k, v) { writes.push(k); m[k] = String(v); },
             removeItem: function (k) { writes.push(k); delete m[k]; } };
  }
  var otros = { "c1.save.v1": "{\"xp\":10}", "c1-it.save.v1": "{}", "laVia.lang": "it", "agora-es.save.v1": "{\"viejo\":1}" };
  var st = fake(otros);
  var s = N.cargar(st);
  N.marcarLeida(s, 1, terms(2), 1);
  N.guardar(st, s);
  N.cargar(st);
  N.borrar(st);
  ok(st.writes.length >= 2 && st.writes.every(function (k) { return k === N.CLAVE; }), "solo se escribe y se borra " + N.CLAVE + ": " + st.writes);
  ok(/^agora/.test(N.CLAVE), "la clave empieza con agora");
  Object.keys(otros).forEach(function (k) { eq(st.m[k], otros[k], "la clave ajena «" + k + "» queda intacta"); });
  eq(N.cargar(fake({ "agora.lector.v1": "{roto" })), N.nuevo(), "un guardado roto se lee como nuevo");
  var bloqueado = { getItem: function () { throw new Error("bloqueado"); }, setItem: function () { throw new Error("bloqueado"); },
                    removeItem: function () { throw new Error("bloqueado"); } };
  ok(N.guardar(bloqueado, N.nuevo()) === false && N.cargar(bloqueado).v === 1, "sin almacenamiento, no se rompe");

  // in the code: every key literal starts with agora, nothing clears the storage, the caches are agora-
  ["arranque.js", "nucleo.js", "lector.js", "../sw.js"].forEach(function (f) {
    var src = fs.readFileSync(path.join(ROOT, "docs", "js", f), "utf8");
    var re = /(?:getItem|setItem|removeItem)\(\s*["']([^"']+)["']/g, m;
    while ((m = re.exec(src))) ok(/^agora/.test(m[1]), f + ": la clave «" + m[1] + "» empieza con agora");
    ok(!/\b(?:localStorage|sessionStorage|storage)\.clear\(|\bkey\(\s*\d/.test(src), f + ": no vacía el almacenamiento ni recorre claves ajenas");
    ok(!/sessionStorage|indexedDB/.test(src), f + ": no usa otros almacenamientos");
  });
  var sw = fs.readFileSync(path.join(ROOT, "docs", "sw.js"), "utf8");
  ok(/var PREFIX = "agora-";/.test(sw) && /VERSION = "agora-v/.test(sw), "sw.js: las cachés se llaman agora-…");
  ok(/k\.indexOf\(PREFIX\) === 0 && k !== VERSION/.test(sw), "sw.js: borra solo las cachés viejas que empiezan con agora-");
  ok(!/register\(\s*["']\//.test(fs.readFileSync(path.join(ROOT, "docs", "js", "lector.js"), "utf8")), "el service worker se registra con ruta relativa");
})();

// ------------------------------------------------------------ los datos
(function () {
  var langs = fs.readdirSync(path.join(ROOT, "docs", "lang"));
  langs.forEach(function (ed) {
    var dir = path.join(ROOT, "docs", "lang", ed, "data");
    var ix = JSON.parse(fs.readFileSync(path.join(dir, "course.json"), "utf8"));
    var tag = ed + ": ";
    eq(ix.app, "agora", tag + "el índice es de agora");
    eq(ix.weeks.length, ix.nweeks, tag + "el índice trae las " + ix.nweeks + " semanas");
    eq(ix.eras.length, 8, tag + "ocho épocas");
    ok(fs.statSync(path.join(dir, "course.json")).size < 80 * 1024, tag + "el índice es liviano (menos de 80 KB)");
    var byN = {}, nvocab = 0, terms0 = {};
    ix.seasons.forEach(function (s) {
      var st = JSON.parse(fs.readFileSync(path.join(dir, s.file), "utf8"));
      eq(st.season, s.n, tag + s.file + " es la estación " + s.n);
      st.weeks.forEach(function (w) { byN[w.week] = w; });
    });
    var bad = function (w, what) { ok(false, tag + "semana " + w.week + ": " + what); };
    ix.weeks.forEach(function (iw, k) {
      eq(iw.week, k + 1, tag + "el índice va en orden");
      var w = byN[iw.week];
      if (!w) return bad(iw, "no está en su estación");
      if (w.season !== iw.season || w.era !== iw.era || w.title !== iw.title) bad(w, "no coincide con el índice");
      if (!(w.era >= 1 && w.era <= 8)) bad(w, "época " + w.era);
      if (!w.title) bad(w, "sin título");
      if (w.repaso) {
        if (!w.intro || !w.semanas || w.semanas.length !== 12) bad(w, "el repaso de la estación necesita intro y sus 12 semanas");
        (w.semanas || []).forEach(function (n) {
          if (!byN[n] || byN[n].season !== w.season || byN[n].repaso) bad(w, "repasa la semana " + n + ", que no es de su estación");
        });
        return;
      }
      if (!w.focus || !(w.keys && w.keys.length >= 4)) bad(w, "lo esencial: foco y claves");
      var parts = (w.lesson && w.lesson.parts) || [];
      var blocks = [].concat.apply([], parts.map(function (p) { return p.blocks; }));
      if (parts.length !== 3 || blocks.length < 9) bad(w, "la lección: 3 partes y 9 bloques");
      if (!w.lesson.intro) bad(w, "la lección sin intro");
      blocks.forEach(function (b) { if (!b.h || !b.r) bad(w, "un bloque sin h o r"); if (b.q) bad(w, "un bloque con chequeo"); });
      var sm = w.seminario || {};
      if (!(sm.autor && sm.obra && sm.pasaje && sm.contexto && sm.derechos)) bad(w, "el texto: autor, obra, pasaje, contexto, derechos");
      if (!(sm.tramos && sm.tramos.length >= 3 && sm.tramos.every(function (t) { return t.texto && Array.isArray(t.glosas); }))) bad(w, "los tramos");
      if (sm.tramos && sm.tramos.some(function (t) { return t.preguntas || t.chequeo; })) bad(w, "tramos con preguntas");
      var mp = sm.mapa || {};
      if (!(mp.conclusion && mp.premisas && mp.premisas.length >= 2 && mp.objecion && mp.replica)) bad(w, "el argumento");
      if (!sm.modelo) bad(w, "sin lectura posible");
      if (sm.escribir || sm.socraticas) bad(w, "el seminario trae consigna o socráticas");
      if (!(w.dilemas && w.dilemas.length && w.dilemas.every(function (d) {
        return d.caso && d.opciones.length >= 2 && d.opciones.every(function (o) { return o.texto && o.escuela && o.porque && o.objecion; });
      }))) bad(w, "los casos");
      if (!(w.vocab && w.vocab.length >= 12 && w.vocab.every(function (v) { return v.length === 4 && v.every(Boolean); }))) bad(w, "los conceptos");
      (w.vocab || []).forEach(function (v) { nvocab++; terms0[v[0]] = 1; });
      if (!(w.literatura && w.literatura.length && w.literatura.every(function (o) {
        return o.autor && o.obra && typeof o.año === "number" && o.tipo && o.por_que;
      }))) bad(w, "la literatura");
      if (w.items) bad(w, "trae ejercicios");
      if (/\bundefined\b|\bNaN\b/.test(JSON.stringify(w))) bad(w, "dice undefined o NaN");
    });
    ok(nvocab > 1500, tag + "el glosario: " + nvocab + " conceptos");
    eq(Object.keys(terms0).length, nvocab, tag + "ningún concepto se repite entre semanas");
  });
})();

T.done("lector: agenda, buscador, copia, claves agora y datos   ");
