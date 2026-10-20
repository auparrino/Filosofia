#!/usr/bin/env node
/* Inventario de todo lo revisable (paso 0.1 de auditorias/PLAN.md).
 *
 * Lista cada unidad revisable de los dos idiomas con un id estable y un hash
 * de su contenido:
 *   - el curso (docs/lang/<código>/data/course.json): ítems, sfide, bloques de
 *     lección, ficha de cada semana y palabras de la semana;
 *   - el banco (data/bank.json): sustantivos, verbos, adjetivos, palabras,
 *     frases, errores, es→it, falsos amigos, ortografía (y regencia en pt);
 *   - las unidades de cada módulo de docs/lang/<código>/*_data.js (una lectura,
 *     un episodio, un par mínimo, un duelo…), más letture_settimana.js y las
 *     tareas de scrivi.js;
 *   - «comun»: docs/lang/tres_lenguas_data.js, que es de los dos idiomas.
 *
 * El registro vive en auditorias/registro/<código>.json:
 *   { "<id>": { "hash", "estado", "revisores", "fecha", "hallazgos" } }
 * con estado pendiente | revisada-1 | revisada-2 | disputa.  Las unidades
 * pendientes solo llevan hash y estado.  Si el contenido cambia (otro hash),
 * la unidad vuelve a `pendiente`: lo nuevo o editado nunca queda sin revisar.
 *
 *   node tools/audit/inventario.js              resumen del inventario
 *   node tools/audit/inventario.js --sync       pone al día el registro
 *   node tools/audit/inventario.js --marcar it lote.json
 *                                               anota una pasada de revisión
 *                                               (lote.json: [{id, estado, revisor, hallazgos}])
 *
 * No entran (no son contenido que se revise): la lógica de los módulos
 * (escritura_plus_data.js, rules.js, lang.js), las listas de configuración
 * (freq_data.js, STOP/glue/traps de frasi_data.js) y lo derivado
 * (formule_data.js lo genera tools/lib/formule.py; frequenza.json, la
 * Biblioteca y los textos de los libros son de terceros o generados).
 */
"use strict";
var fs = require("fs"), path = require("path"), vm = require("vm"), crypto = require("crypto");

var ROOT = path.join(__dirname, "..", "..");
var LANG_DIR = path.join(ROOT, "docs", "lang");
var REG_DIR = path.join(ROOT, "auditorias", "registro");
var LANGS = ["it", "pt", "comun"];
var ESTADOS = ["pendiente", "revisada-1", "revisada-2", "disputa"];

// ---------------------------------------------------------------- cargar

function readJson(p) { return JSON.parse(fs.readFileSync(p, "utf8")); }

// Corre un *_data.js en un contexto vacío y devuelve lo que dejó en window.
function load(file) {
  var w = {};
  w.window = w; w.self = w; w.LANG = {}; w.console = console;
  vm.runInContext(fs.readFileSync(file, "utf8"), vm.createContext(w), { filename: file });
  return w;
}

// ---------------------------------------------------------------- ids y hash

function canon(v) {
  if (Array.isArray(v)) return v.map(canon);
  if (v && typeof v === "object") {
    var o = {};
    Object.keys(v).sort().forEach(function (k) { o[k] = canon(v[k]); });
    return o;
  }
  return v;
}
function hash(v) {
  return crypto.createHash("sha1").update(JSON.stringify(canon(v))).digest("hex").slice(0, 10);
}
function slug(s) {
  return String(s).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 40);
}
function pad(n) { return (n < 10 ? "0" : "") + n; }

// Agrega unidades de un módulo. `rows` = [[clave, contenido]]; si dos claves
// coinciden, la segunda lleva «~2» (por orden de aparición).
function Collector(code) {
  var out = {}, seen = {};
  return {
    add: function (mod, rows) {
      rows.forEach(function (r) {
        var key = String(r[0]), id = code + ":" + mod + ":" + key;
        if (seen[id]) { seen[id]++; id += "~" + seen[id]; } else seen[id] = 1;
        out[id] = { mod: mod, hash: hash(r[1]) };
      });
    },
    result: function () { return out; }
  };
}
function idx(list, fn) { return (list || []).map(function (x, i) { return [fn ? fn(x, i) : pad(i + 1), x]; }); }
function byId(list) { return idx(list, function (x) { return x.id; }); }
function byWeek(list) { return idx(list, function (x) { return "w" + pad(x.week); }); }
function entries(o, fn) { return Object.keys(o || {}).map(function (k) { return [fn ? fn(k) : k, o[k]]; }); }

// ---------------------------------------------------------------- curso y banco

function curso(c, code, lang) {
  var course = readJson(path.join(LANG_DIR, code, "data", "course.json"));
  var weeks = course.weeks || [];
  c.add("items", byId(course.items));
  c.add("sfide", byId(course.challenges));
  weeks.forEach(function (w) {
    var n = "w" + pad(w.week), les = w.lesson || {};
    // la ficha de la semana: sin las listas de ids (items, extra, refs…) que
    // son índices; la lección sin los bloques, que van cada uno por su lado
    c.add("semana", [[n, {
      title: w.title, level: w.level, focus: w.focus, fare: w.fare, tema: w.tema, keys: w.keys,
      boss: w.boss, intro: les.intro, parts: les.parts
    }]]);
    c.add("leccion", idx(les.blocks, function (b, i) { return n + ".b" + pad(i + 1); }));
    c.add("vocab-semana", idx(w.vocab, function (v) { return n + "." + slug(v[0]); }));
  });
  var bank = readJson(path.join(LANG_DIR, code, "data", "bank.json"));
  c.add("banco-sustantivos", idx(bank.nouns, function (x) { return x[0]; }));
  c.add("banco-verbos", idx(bank.verbs, function (x) { return x[0]; }));
  c.add("banco-adjetivos", idx(bank.adjectives, function (x) { return x[0]; }));
  c.add("banco-palabras", idx(bank.words, function (x) { return x[0]; }));
  c.add("banco-frases", idx(bank.sentences, function (x) { return hash(x.es); }));
  c.add("banco-errores", idx(bank.errors, function (x) { return hash(x.wrong); }));
  c.add("banco-es-" + code, entries(bank.esIt));
  c.add("banco-falsos", entries(bank.falsi));
  c.add("banco-ortografia", idx(bank.spelling, function (x) { return x[0] + "-" + x[1]; }));
  if (bank.regencia) c.add("banco-regencia", entries(bank.regencia));
}

// ---------------------------------------------------------------- módulos

function modulos(c, code) {
  var dir = path.join(LANG_DIR, code);
  function mod(file) { return load(path.join(dir, file)); }

  var a = mod("ascolto_data.js").AscoltoData;
  c.add("ascolto-pares", byId(a.PAIRS));
  c.add("ascolto-conectado", byId(a.CONNESSO));
  c.add("ascolto-intonacion", byId(a.INTONAZIONE));
  c.add("ascolto-acento", byId(a.ACCENTO));

  var b = mod("biblioteca_data.js").BIBLIO_DATA;
  c.add("biblioteca-cognados", idx(b.cognates, function (x) { return slug(x); }));
  c.add("biblioteca-raices", idx(b.stems));

  c.add("desglose", entries(mod("desglose_data.js").LANG.rules.desglose));

  var d = mod("devolucion_data.js").DEVOLUCION_DATA;
  c.add("devolucion", [["transfer", d.transfer], ["keep", d.keep]]);
  c.add("devolucion-terminos", idx(d.terms, function (x) { return slug(x[0]); }));

  c.add("dictogloss", byWeek(mod("dictogloss_data.js").DictoglossData.TESTI));
  c.add("duelos", byId(mod("duelli_data.js").DUELLI_DATA.DUELLI));

  var e = mod("esame_data.js").EsameData;
  Object.keys(e).forEach(function (k) {
    if (Array.isArray(e[k]) && k !== "scrittura") c.add("examen-" + k, byId(e[k]));
  });
  // scrittura (it): alias de scritture en el archivo viejo; en pt es la lista de tareas
  if (e.scrittura && !e.scritture) c.add("examen-scrittura", byId(e.scrittura));

  var es = mod("escritos_data.js").ESCRITOS_DATA;
  c.add("escritos-conectores", idx(es.conn, function (x) { return slug(x); }));
  c.add("escritos-preposiciones", idx(es.prep, function (x) { return slug(x); }));
  c.add("escritos-equivalencias", idx(es.equiv, function (x) { return slug(x[0]); }));
  c.add("escritos-pistas", idx(es.clues, function (x) { return slug(x[0]); }));

  var f = mod("frasi_data.js").FRASI_DATA;
  (f.SCENES || []).forEach(function (s) {
    c.add("frases-escena", [[s.id, { id: s.id, week: s.week, name: s.name, blurb: s.blurb, emoji: s.emoji }]]);
    c.add("frases", idx(s.phrases, function (p, i) { return s.id + "." + pad(i + 1); }));
  });

  c.add("fuera", byWeek(mod("fuera_data.js").FUERA_DATA.FICHAS));

  // la ruta de trabajo (trabajo_data.js): la escena, sus frases y sus ítems
  ((mod("trabajo_data.js").TRABAJO_DATA || {}).SCENES || []).forEach(function (s) {
    c.add("trabajo-escena", [[s.id, { id: s.id, week: s.week, name: s.name, blurb: s.blurb, grammar: s.grammar,
      situazione: s.situazione, dialogo: s.dialogo, gloss: s.gloss, compito: s.compito }]]);
    c.add("trabajo-frases", idx(s.phrases, function (p, i) { return s.id + "." + pad(i + 1); }));
    c.add("trabajo-items", idx(s.items, function (x, i) { return s.id + "." + pad(i + 1); }));
  });

  var l = mod("lab_data.js").LAB_DATA;
  c.add("lab-reglas", byId(l.RULES));
  c.add("lab-falsos", idx(l.FALSI, function (x) { return slug(x[0]); }));
  c.add("lab-capire", byId(l.CAPIRE));

  c.add("lectura-serie", byId(mod("letture_data.js").LETTURE_DATA.EPISODI));
  c.add("lectura-semana", byId(mod("letture_settimana.js").LettureSettimana.TESTI));

  var m = mod("mapas_data.js").MAPAS_DATA;
  c.add("mapas-escenas", entries(m.scenes));
  c.add("mapas-bloques", idx(m.blocks));

  c.add("porque", entries(mod("porque_data.js").PORQUE_DATA.why));
  c.add("radio", byWeek(mod("radio_data.js").RADIO_DATA.EPISODI));

  var t = mod("tramo_data.js").TRAMO_DATA;
  c.add("tramo", byWeek(t.SETTIMANE));
  c.add("tramo-generos", entries(t.GENRES));

  c.add("scrivi", entries(mod("scrivi.js").Scrivi.TASKS, function (k) { return "w" + pad(+k); }));
  c.add("variaciones", idx(mod("variaciones_data.js").VARIACIONES_DATA.frames, function (x) { return slug(x.f); }));
  c.add("voces", idx(mod("voci_cv_data.js").VociCV.ALL, function (x) { return x.f; }));
}

function comun(c) {
  var t = load(path.join(LANG_DIR, "tres_lenguas_data.js")).TRES_LENGUAS_DATA;
  c.add("tres-lenguas-contrastes", entries(t.CONTRASTS));
  c.add("tres-lenguas-pares", idx(t.PAIRS, function (x) { return slug(x[0]); }));
  c.add("tres-lenguas-duelo", idx(t.DUEL, function (x) { return slug(x[0]); }));
}

// ---------------------------------------------------------------- API

// { id: { mod, hash } } de un idioma («it», «pt» o «comun»).
function inventory(code) {
  var c = Collector(code);
  if (code === "comun") comun(c);
  else { curso(c, code); modulos(c, code); }
  return c.result();
}

function regPath(code) { return path.join(REG_DIR, code + ".json"); }
function readRegistry(code) {
  return fs.existsSync(regPath(code)) ? readJson(regPath(code)) : {};
}

// Línea por unidad, con las claves en orden fijo: diffs chicos y legibles.
function writeRegistry(code, reg) {
  fs.mkdirSync(REG_DIR, { recursive: true });
  var ids = Object.keys(reg).sort();
  var body = ids.map(function (id) {
    var e = reg[id], o = { hash: e.hash, estado: e.estado };
    ["revisores", "fecha", "hallazgos"].forEach(function (k) { if (e[k] != null) o[k] = e[k]; });
    return "  " + JSON.stringify(id) + ": " + JSON.stringify(o);
  }).join(",\n");
  fs.writeFileSync(regPath(code), "{\n" + body + "\n}\n");
}

// Pone el registro al día con el inventario. Devuelve lo que cambió.
function sync(code) {
  var inv = inventory(code), old = readRegistry(code), reg = {};
  var stats = { nuevas: 0, cambiadas: 0, huerfanas: 0, iguales: 0 };
  Object.keys(inv).forEach(function (id) {
    var prev = old[id];
    if (!prev) { reg[id] = { hash: inv[id].hash, estado: "pendiente" }; stats.nuevas++; }
    else if (prev.hash !== inv[id].hash) {
      // cambió el contenido: vuelve a pendiente; lo hallado antes queda de pista
      reg[id] = { hash: inv[id].hash, estado: "pendiente" };
      if (prev.estado !== "pendiente") reg[id].hallazgos = prev.hallazgos;
      stats.cambiadas++;
    } else { reg[id] = prev; stats.iguales++; }
  });
  Object.keys(old).forEach(function (id) { if (!inv[id]) stats.huerfanas++; });
  writeRegistry(code, reg);
  return stats;
}

// Compara registro e inventario sin escribir nada: lo que el test controla.
function diff(code) {
  var inv = inventory(code), reg = readRegistry(code), r = { faltan: [], huerfanas: [], viejas: [], estadoRaro: [] };
  Object.keys(inv).forEach(function (id) {
    if (!reg[id]) r.faltan.push(id);
    else if (reg[id].estado !== "pendiente" && reg[id].hash !== inv[id].hash) r.viejas.push(id);
  });
  Object.keys(reg).forEach(function (id) {
    if (!inv[id]) r.huerfanas.push(id);
    else if (ESTADOS.indexOf(reg[id].estado) < 0) r.estadoRaro.push(id);
  });
  return r;
}

// Anota una pasada de revisión. `marcas` = [{ id, estado, revisor, fecha?, hallazgos? }].
// Exige que el id exista y toma el hash actual: se firma lo que se leyó ahora.
// `hallazgos` = [{ texto, abierto }]; los revisores se acumulan sin repetirse.
function marcar(code, marcas) {
  var inv = inventory(code), reg = readRegistry(code);
  marcas.forEach(function (m) {
    if (!inv[m.id]) throw new Error("no existe en el inventario: " + m.id);
    if (ESTADOS.indexOf(m.estado) < 0) throw new Error("estado desconocido: " + m.estado + " (" + m.id + ")");
    var prev = reg[m.id] && reg[m.id].hash === inv[m.id].hash ? reg[m.id] : {};
    var e = { hash: inv[m.id].hash, estado: m.estado };
    var revs = (prev.revisores || []).slice();
    if (m.revisor && revs.indexOf(m.revisor) < 0) revs.push(m.revisor);
    if (revs.length) e.revisores = revs;
    if (m.estado !== "pendiente") e.fecha = m.fecha || new Date().toISOString().slice(0, 10);
    var h = m.hallazgos != null ? m.hallazgos : prev.hallazgos;
    if (h && h.length) e.hallazgos = h;
    reg[m.id] = e;
  });
  // las que no se tocaron y quedaron sin entrada se completan como pendientes
  Object.keys(inv).forEach(function (id) { if (!reg[id]) reg[id] = { hash: inv[id].hash, estado: "pendiente" }; });
  writeRegistry(code, reg);
  return marcas.length;
}

module.exports = {
  LANGS: LANGS, ESTADOS: ESTADOS, REG_DIR: REG_DIR,
  inventory: inventory, readRegistry: readRegistry, writeRegistry: writeRegistry, sync: sync, diff: diff, marcar: marcar
};

// ---------------------------------------------------------------- CLI

if (require.main === module) {
  var args = process.argv.slice(2);
  var doSync = args.indexOf("--sync") >= 0;
  var langs = args.filter(function (a) { return LANGS.indexOf(a) >= 0; });
  if (!langs.length) langs = LANGS;
  if (args.indexOf("--marcar") >= 0) {
    var fileArg = args.filter(function (a) { return /\.json$/.test(a); })[0];
    if (langs.length !== 1 || !fileArg) { console.error("uso: --marcar <it|pt|comun> lote.json"); process.exit(2); }
    console.log(langs[0] + ": " + marcar(langs[0], readJson(fileArg)) + " unidades anotadas");
    process.exit(0);
  }
  langs.forEach(function (code) {
    if (doSync) {
      var s = sync(code);
      console.log(code + ": " + s.iguales + " iguales, " + s.nuevas + " nuevas, " +
        s.cambiadas + " cambiadas (vuelven a pendiente), " + s.huerfanas + " huérfanas (se sacan)");
    } else {
      var inv = inventory(code), porMod = {};
      Object.keys(inv).forEach(function (id) { porMod[inv[id].mod] = (porMod[inv[id].mod] || 0) + 1; });
      console.log(code + ": " + Object.keys(inv).length + " unidades en " + Object.keys(porMod).length + " módulos");
      Object.keys(porMod).sort().forEach(function (m) { console.log("  " + m + ": " + porMod[m]); });
    }
  });
}
