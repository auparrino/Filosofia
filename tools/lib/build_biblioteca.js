/*
 * Arma la Biblioteca de un idioma: baja los .txt de Project Gutenberg
 * (espejados en GitHub por GITenberg; la lista y cómo partir cada obra están
 * en tools/lib/biblioteca_fuentes.js), limpia el encabezado y la licencia,
 * parte cada obra en unidades de lectura (un cuento, un capítulo o unos
 * pocos capítulos cortos), moderniza la ortografía del portugués
 * (tools/pt/ortografia.js) y calcula la cobertura léxica de cada unidad
 * para cada semana del curso (docs/js/biblioteca.js, Model).
 *
 *   node tools/lib/build_biblioteca.js            los dos idiomas
 *   node tools/lib/build_biblioteca.js pt         uno
 *   node tools/lib/build_biblioteca.js pt --only dom-casmurro --show
 *   node tools/lib/build_biblioteca.js pt --report     las palabras que la
 *        ortografía cambió por transformación (para revisar) y las que no
 *        encontró en el léxico
 *
 * Escribe docs/lang/<código>/biblioteca/<id>.json ({ id, title, author,
 * chapters: [{ t, p: [párrafos] }] }; un párrafo que empieza con «## » es un
 * subtítulo, «⁂» una pausa) y docs/lang/<código>/biblioteca/index.json (las
 * fichas, con las palabras y la cobertura por semana —52 valores en
 * por mil— de cada unidad y del libro).
 *
 * Los .txt se guardan en BIBLIO_SRC (por defecto tools/.cache/biblioteca) y no
 * se versionan; para el portugués también la lista de palabras del
 * portugués moderno (pythonprobr/palavras, del corrector VERO de
 * LibreOffice) que la ortografía usa como léxico de formas actuales.
 */
"use strict";
var fs = require("fs"), path = require("path"), cp = require("child_process");
var pack = require("./pack.js");
var FUENTES = require("./biblioteca_fuentes.js");

var RAW = "https://raw." + "githubusercontent.com/";
var ORG = "GITenberg";
var SRC = process.env.BIBLIO_SRC || path.join(__dirname, "..", ".cache", "biblioteca");
var WORDLIST = { repo: "pythonprobr/palavras", file: "palavras.txt" };
// Spanish words (OpenSubtitles, hermitdave/FrequencyWords, CC BY-SA 4.0):
// to recognise the transparent cognates.
var SPANISH = { repo: "hermitdave/FrequencyWords", file: "content/2018/es/es_50k.txt" };
var LEARN_AFTER = 3;

var args = process.argv.slice(2);
var LANGS = args.filter(function (a) { return pack.LANGS.indexOf(a) >= 0; });
if (!LANGS.length) LANGS = pack.LANGS.slice();
var ONLY = args.indexOf("--only") >= 0 ? args[args.indexOf("--only") + 1] : null;
var SHOW = args.indexOf("--show") >= 0, REPORT = args.indexOf("--report") >= 0;

function fetchTo(url, out) {
  if (fs.existsSync(out) && fs.statSync(out).size > 1000) return out;
  fs.mkdirSync(path.dirname(out), { recursive: true });
  cp.execFileSync("curl", ["-sS", "-f", "-L", "-o", out, url]);
  return out;
}
function sourceOf(b) {
  return fetchTo(RAW + ORG + "/" + b.repo + "/master/" + b.file, path.join(SRC, b.file));
}
function wordlist() {
  var f = fetchTo(RAW + WORDLIST.repo + "/master/" + WORDLIST.file, path.join(SRC, WORDLIST.file));
  return fs.readFileSync(f, "utf8").split(/\r?\n/);
}

/* ------------------------------------------------------------ el texto */

function readLines(b) {
  var buf = fs.readFileSync(sourceOf(b));
  var s = b.enc === "latin1" ? buf.toString("latin1") : buf.toString("utf8");
  s = s.replace(/^﻿/, "").replace(/\r/g, "");
  return s.split("\n");
}

// The body of the work: from the n-th line equal to from[0] (after the
// Gutenberg header) to the first line matching «to».
function body(b, lines) {
  var start0 = 0;
  for (var i = 0; i < lines.length; i++) if (/^\*\*\* ?START OF/.test(lines[i])) { start0 = i + 1; break; }
  var n = 0, start = -1;
  for (i = start0; i < lines.length; i++) {
    if (lines[i].trim() === b.from[0] && ++n === b.from[1]) { start = i; break; }
  }
  if (start < 0) throw new Error(b.id + ": no encuentro el comienzo «" + b.from[0] + "» (" + b.from[1] + ")");
  var end = lines.length;
  for (i = start + 1; i < lines.length; i++) {
    if (b.to.test(lines[i].trim()) || /^\*\*\* ?END OF|^End of (the )?Project Gutenberg/i.test(lines[i].trim())) { end = i; break; }
  }
  return lines.slice(start, end);
}

// Paragraphs: blocks of lines between blank lines, joined.
function paragraphs(lines) {
  var out = [], cur = [];
  lines.forEach(function (l) {
    if (!l.trim()) { if (cur.length) out.push(cur.join(" ")); cur = []; return; }
    cur.push(l.trim());
  });
  if (cur.length) out.push(cur.join(" "));
  return out.map(function (p) { return p.replace(/\s+/g, " ").trim(); }).filter(Boolean);
}

var NOTE_BODY = /^\[(\d+|[a-z*])\]|^\[(Illustra|Ilustra|Nota|Note)/i;
function clean(p) {
  return p
    .replace(/\[(\d+|[a-z*])\]/gi, "")               // footnote marks
    .replace(/\^\{([^}]*)\}/g, "$1").replace(/\^([a-zA-Z]{1,3})\b/g, "$1")   // superscripts: Exc.^{mo}, V. Exc.^a
    .replace(/\s*--\s*/g, function (m) { return /^\s/.test(m) || /\s$/.test(m) ? " — " : "—"; })
    .replace(/^—\s*/, "— ")
    .replace(/\s+([,.;:!?])/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
}
function isBreakLine(p) { return /^(\*\s*){3,}$|^(\.\s*){3,}$|^[-—_=]{3,}$/.test(p); }

/* ------------------------------------------------------ las unidades */

var ROMAN_V = { I: 1, V: 5, X: 10, L: 50, C: 100 };
function roman(s) {
  var n = 0;
  for (var i = 0; i < s.length; i++) {
    var v = ROMAN_V[s[i]], w = ROMAN_V[s[i + 1]] || 0;
    n += v < w ? -v : v;
  }
  return n;
}
function chapterLabel(h) {
  var m = /\b([IVXLC]+)\.?$/.exec(h);
  if (/PRIMEIRO$/.test(h)) return "I";
  return m ? m[1] : h.replace(/\.$/, "");
}
function words(p) {
  var n = 0;
  String(p).split(/\s+/).forEach(function (t) { if (/[A-Za-zÀ-ÿ]/.test(t)) n++; });
  return n;
}
function unitWords(ps) { return ps.reduce(function (a, p) { return a + (/^## /.test(p) ? 0 : words(p)); }, 0); }
function cap(s) { s = String(s).toLowerCase(); return s.charAt(0).toUpperCase() + s.slice(1); }

/* The parts of the body, with the structure the source marks:
   [{ kind: "story"|"part"|"chapter"|"text", title, sub, p }] in order. */
function structure(b, paras) {
  var out = [], k = 0, cur = null, expectSub = false;
  var push = function (x) { out.push(x); cur = x; };
  paras.forEach(function (raw) {
    var p = raw.trim();
    if ((b.drop || []).some(function (re) { return re.test(p); })) return;
    if (b.stories && k < b.stories.length && p === b.stories[k][1]) {
      push({ kind: "story", title: b.stories[k][0], p: [] }); k++; expectSub = false; return;
    }
    if (b.parts && b.parts.test(p)) { push({ kind: "part", title: cap(p), p: [] }); expectSub = false; return; }
    if (b.chapter.test(p)) {
      push({ kind: "chapter", title: b.dated ? p.replace(/\.$/, "") : chapterLabel(p), p: [] });
      expectSub = b.subtitle > 0; return;
    }
    if (!cur) push({ kind: "text", title: b.prologue || "", p: [] });
    if (NOTE_BODY.test(p)) return;
    if (expectSub) {
      expectSub = false;
      if (p.length <= b.subtitle && !/^(—|--)/.test(p)) {
        var sub = clean(p).replace(/_/g, "");
        cur.sub = /[a-zà-ÿ]/.test(sub) ? sub : cap(sub);   // DE UMA IDEIA → De uma ideia
        return;
      }
    }
    if (isBreakLine(p)) { if (cur.p.length) cur.p.push("⁂"); return; }
    var c = clean(p);
    if (c) cur.p.push(c);
  });
  if (b.stories && k < b.stories.length) throw new Error(b.id + ": faltan cuentos desde «" + b.stories[k][1] + "»");
  return out.filter(function (x) { return x.kind === "part" || x.p.length || x.kind === "story"; });
}

function heading(ch) { return "## " + ch.title + (ch.sub ? ". " + ch.sub : ""); }
function span(list) {
  var a = list[0].title, z = list[list.length - 1].title;
  return a === z ? a : a + "–" + z;
}

/* Units of reading. */
function units(b, parts) {
  var out = [];
  if (b.stories) {
    // A story, with its numbered sections as subtitles; a long one is cut
    // at its sections, into pieces of about split/2 words.
    var story = null;
    var flush = function () {
      if (!story) return;
      var all = [].concat.apply([], story.secs.map(function (s) { return (s.title ? [heading(s)] : []).concat(s.p); }));
      var total = unitWords(all), numbered = story.secs.filter(function (s) { return s.title; }).length;
      if (b.split && total > b.split && numbered > 1) {
        var target = Math.max(2500, Math.round(total / Math.ceil(total / (b.split / 2)))), grp = [], n = 0, pieces = [];
        story.secs.forEach(function (s) {
          var w = unitWords(s.p);
          if (grp.length && n + w > target * 1.25 && s.title) { pieces.push(grp); grp = []; n = 0; }
          grp.push(s); n += w;
        });
        if (grp.length) pieces.push(grp);
        pieces.forEach(function (g, i) {
          var named = g.filter(function (s) { return s.title; });
          out.push({ t: story.title + " (" + (i + 1) + "/" + pieces.length + (named.length ? ": " + span(named) : "") + ")",
                     p: [].concat.apply([], g.map(function (s) { return (s.title ? [heading(s)] : []).concat(s.p); })) });
        });
      } else out.push({ t: story.title, p: all });
      story = null;
    };
    parts.forEach(function (x) {
      if (x.kind === "story") { flush(); story = { title: x.title, secs: [{ title: "", p: x.p.slice() }] }; return; }
      if (!story) return;
      story.secs.push(x.kind === "chapter" ? x : { title: "", p: x.p });
    });
    flush();
  } else {
    // A novel: chapters, the short ones grouped up to «group» words; parts
    // start a new unit with their title.
    var grp = [], n = 0, partTitle = "";
    var flushN = function () {
      if (!grp.length) return;
      var chs = grp.filter(function (c) { return c.kind === "chapter"; });
      var title;
      if (grp.length === 1 && grp[0].kind === "text") title = grp[0].title || "Comienzo";
      else if (chs.length === 1 && grp.length === 1) title = b.dated ? chs[0].title : chs[0].title + (chs[0].sub ? ". " + chs[0].sub : "");
      else title = b.dated ? span(chs) : (grp[0].kind === "text" && grp[0].title ? grp[0].title + " y " : "") + (chs.length > 1 ? "Capítulos " : "Capítulo ") + span(chs);
      if (partTitle) title = partTitle + " · " + title;
      var p = [];
      grp.forEach(function (c) {
        if (c.kind === "chapter" && (grp.length > 1 || b.dated || c.sub)) p.push(heading(c));
        p = p.concat(c.p);
      });
      out.push({ t: title, p: p });
      grp = []; n = 0; partTitle = "";
    };
    parts.forEach(function (x) {
      if (x.kind === "part") { flushN(); partTitle = x.title; return; }
      var w = unitWords(x.p);
      if (grp.length && (!b.group || n + w > b.group * 1.3 || n >= b.group)) flushN();
      grp.push(x); n += w;
    });
    flushN();
  }
  return out.filter(function (u) { return unitWords(u.p) > 30; });
}

/* ------------------------------------------------------------ el armado */

function strip(s) { return String(s).normalize("NFD").replace(/[\u0300-\u036f]/g, "").normalize("NFC"); }
function dels(w) { var out = []; for (var i = 0; i < w.length; i++) out.push(w.slice(0, i) + w.slice(i + 1)); return out; }

/* A transparent cognate: the word, spelled the Spanish way
   (BIBLIO_DATA.toSpanish), is a Spanish word or one letter away from one
   (compassione → compasión, pescatore → pescador, cidade → ciudad).  Not
   the false friends of the Laboratorio (burro, polvo). */
function spanishCognate(BD, ctx) {
  var f = fetchTo(RAW + SPANISH.repo + "/master/" + SPANISH.file, path.join(SRC, "es_50k.txt"));
  var S = Object.create(null), D = Object.create(null);
  fs.readFileSync(f, "utf8").split(/\r?\n/).slice(0, 30000).forEach(function (l) {
    var w = strip(l.split(" ")[0].toLowerCase());
    if (!/^[a-zñ]{4,}$/.test(w)) return;
    S[w] = 1;
    dels(w).forEach(function (d) { D[d] = 1; });
  });
  var falsi = Object.create(null);
  ((ctx.LAB_DATA || {}).FALSI || []).forEach(function (x) { falsi[strip(String(x[0]).toLowerCase())] = 1; });
  var rules = (BD.toSpanish || []).map(function (set) { return set.map(function (r) { return [new RegExp(r[0], "g"), r[1]]; }); });
  var memo = Object.create(null);
  function near(c) {
    if (c.length < 4) return false;
    if (S[c]) return true;
    // one letter more or less (compasione → compasión), in longer words
    if (c.length < 7) return false;
    return !!D[c] || dels(c).some(function (d) { return S[d]; });
  }
  return function (w) {
    if (memo[w] != null) return memo[w];
    var c = strip(w.toLowerCase()), ok = false;
    if (!falsi[c] && c.length >= 4) {
      var v = c;
      ok = near(v);
      for (var i = 0; i < rules.length && !ok; i++) {
        rules[i].forEach(function (r) { v = v.replace(r[0], r[1]); });
        ok = near(strip(v));
      }
    }
    return (memo[w] = ok);
  };
}

/* The conjugator backwards: form → the infinitives it can come from, for
   every verb of the frequency list (and the conjugator's own). */
function verbIndex(ctx, freq) {
  var C = ctx.Conj, idx = Object.create(null), known = Object.create(null);
  var put = function (f, v) {
    f = String(f || "").split(" ").pop().toLowerCase();
    if (!f || f === v) return;
    var l = idx[f] || (idx[f] = []);
    if (l.indexOf(v) < 0) l.push(v);
  };
  C.list().forEach(function (v) { known[v] = 1; });
  var verbs = Object.keys(freq.lemmi).filter(function (l) {
    var pos = freq.lemmi[l][3];
    return (pos === "v" || (pos === "" && /^[a-zà-ÿ]{2,}(ar|er|ir)$/.test(l))) && /^[a-zà-ÿ]+(are|ere|ire|rre|ar|er|ir|or)$/.test(l);
  });
  Object.keys(known).forEach(function (v) { if (verbs.indexOf(v) < 0) verbs.push(v); });
  verbs.forEach(function (v) {
    try { if (!known[v]) { C.register(v, { es: "" }); known[v] = 1; } } catch (e) { return; }
    (C.SIMPLE_TENSES || []).forEach(function (t) {
      var fs2;
      try { fs2 = C.conjugate(v, t, { partial: true }); } catch (e) { return; }
      (fs2 || []).forEach(function (f) { if (f) put(f, v); });
    });
    try {
      var pp = C.participle(v);
      if (pp) {
        put(pp, v);
        var st = pp.toLowerCase().replace(/[oa]$/, "");
        ["a", "i", "e", "os", "as"].forEach(function (e) { put(st + e, v); });
      }
    } catch (e) { /* sin participio */ }
    try { if (C.gerund) put(C.gerund(v), v); } catch (e) { /* sin gerundio */ }
    try { ((C.imperative && C.imperative(v)) || []).forEach(function (f) { if (f) put(f, v); }); } catch (e) { /* sin imperativo */ }
  });
  return idx;
}

function build(code) {
  var ctx = pack(code);
  var B = ctx.Biblioteca;
  if (!B) throw new Error("falta docs/js/biblioteca.js en boot.js ORDER");
  var freq = pack.data(code, "frequenza.json"), gloss = pack.data(code, "glossario.json");
  ctx.Freq.load(freq);
  var BD = ctx.BIBLIO_DATA || {};
  var model = new B.Model({
    lemmi: freq.lemmi, gloss: gloss, stop: ctx.FREQ_DATA.STOP || [], lemma: ctx.Freq.lemma, tokens: ctx.Freq.tokens,
    transparent: ctx.Desglose && ctx.Desglose.transparent, cognates: BD.cognates || [], stems: BD.stems || [],
    verbs: verbIndex(ctx, freq), cognate: spanishCognate(BD, ctx), learnAfter: LEARN_AFTER
  });
  var modern = null;
  if (code === "pt") {
    var Orto = require(path.join(pack.ROOT, "tools", "pt", "ortografia.js"));
    modern = Orto.modernizer({ wordlist: wordlist(), track: REPORT });
  }
  var outDir = path.join(pack.langDir(code), "biblioteca");
  fs.mkdirSync(outDir, { recursive: true });
  var indexPath = path.join(outDir, "index.json");
  var old = fs.existsSync(indexPath) ? JSON.parse(fs.readFileSync(indexPath, "utf8")) : { books: [] };
  var entries = [];
  FUENTES[code].forEach(function (b) {
    if (ONLY && b.id !== ONLY) {
      var prev = old.books.filter(function (x) { return x.id === b.id; })[0];
      if (prev) entries.push(prev);
      return;
    }
    var paras = paragraphs(body(b, readLines(b)));
    var us = units(b, structure(b, paras));
    if (modern) {
      us.forEach(function (u) { modern.learn(u.t + "\n" + u.p.join("\n")); });
      us.forEach(function (u) {
        u.t = modern.text(u.t);
        u.p = u.p.map(function (p) { return modern.text(p); });
      });
    }
    us.forEach(function (u) { u.p = u.p.map(function (p) { return p.replace(/_/g, "").replace(/\s+/g, " ").trim(); }).filter(Boolean); });
    var names = B.namesOf([].concat.apply([], us.map(function (u) { return u.p; })), ctx.Freq.tokens);
    // the subtitles that were in capitals keep the capital of their names
    // (De como itaguaí ganhou… → De como Itaguaí ganhou…)
    var capNames = function (s) {
      return s.replace(/[a-zà-öø-ÿ]+/g, function (w, at) { return names[w] && at > 0 ? w.charAt(0).toUpperCase() + w.slice(1) : w; });
    };
    us.forEach(function (u) {
      u.t = capNames(u.t);
      u.p = u.p.map(function (p) { return B.isHeading(p) ? capNames(p) : p; });
    });
    var hBook = null, chapters = us.map(function (u) {
      var h = model.histogram(u.p, names);
      hBook = hBook ? B.addHist(hBook, h) : h;
      return { t: u.t, w: B.chapterWords(u), cov: B.coverageOf(h) };
    });
    var total = chapters.reduce(function (a, c) { return a + c.w; }, 0);
    var cov = B.coverageOf(hBook);
    var wk = B.weekFor(cov, B.TARGET);
    var entry = {
      id: b.id, title: b.title, author: b.author, year: b.year, died: b.died, kind: b.kind,
      // the level of its vocabulary: where the whole book reaches 95 %;
      // past the course, C1 if it reaches 93 % and C1+ if not even that
      level: wk <= B.WEEKS ? B.levelOfWeek(wk) : B.weekFor(cov, 93) <= B.WEEKS ? "C1" : "C1+", week: wk <= B.WEEKS ? wk : null,
      words: total, file: b.id + ".json",
      credit: "Texto de Project Gutenberg (eBook n.º " + b.gutenberg + "), de dominio público: " + b.author +
        " murió en " + b.died + "." + (code === "pt" ? " Ortografía actualizada al Acuerdo de 1990 (sin cambiar palabras ni sintaxis)." : ""),
      cov: cov, chapters: chapters
    };
    if (b.variant === "pt-PT") {
      entry.variant = "pt-PT";
      entry.note = "portugués de Portugal";
      entry.noteLong = "Eça de Queirós era portugués: vas a ver palabras y construcciones de Portugal (rapariga = chica, comboio = tren, " +
        "casa de banho = baño, «estava a fazer» en vez de «estava fazendo»). Se entiende igual; en Brasil se diría distinto.";
    }
    if (b.note) entry.note = b.note;
    entries.push(entry);
    // The week each word of the book becomes known (only those after the
    // first): the reader underlines with it, like the coverage says.
    var wk = {};
    us.forEach(function (u) { u.p.forEach(function (p) {
      if (B.isHeading(p)) return;
      model.words(p, names).forEach(function (x) { if (x.week > 1 && !x.name) wk[x.w] = x.week > B.WEEKS ? 99 : x.week; });
    }); });
    var bookJson = { id: b.id, title: b.title, author: b.author, year: b.year,
                     chapters: us.map(function (u) { return { t: u.t, p: u.p }; }), wk: wk };
    fs.writeFileSync(path.join(outDir, b.id + ".json"), JSON.stringify(bookJson));
    console.log(code, b.id, us.length + " unidades", total + " palabras", "cobertura sem. 26: " + B.covAt(entry, 26) + " %",
      "sem. 52: " + B.covAt(entry, 52) + " %", "nivel " + entry.level);
    if (SHOW) chapters.forEach(function (c, i) { console.log("   ", i + 1, c.t, c.w, B.covAt(c, 52) + " %"); });
  });
  // Short stories first, novels after; within each, easier to harder (the
  // coverage at the end of B2, week 39).
  var KIND = { cuentos: 0, "novela corta": 1, novela: 2 };
  entries.sort(function (a, b) { return (KIND[a.kind] - KIND[b.kind]) || (b.cov[38] - a.cov[38]); });
  var index = { lang: code, weeks: B.WEEKS, target: B.TARGET, source: "Project Gutenberg (espejo GITenberg en GitHub)",
                books: entries };
  fs.writeFileSync(indexPath, JSON.stringify(index));
  var size = fs.readdirSync(outDir).reduce(function (a, f) { return a + fs.statSync(path.join(outDir, f)).size; }, 0);
  console.log(code, "biblioteca:", entries.length, "obras,", entries.reduce(function (a, e) { return a + e.words; }, 0), "palabras,",
    (size / 1048576).toFixed(1) + " MB");
  if (modern && REPORT) {
    var rep = path.join(SRC, "ortografia_" + code + ".txt");
    fs.writeFileSync(rep, "# transformadas (revisar)\n" + modern.changed().map(function (x) { return x.join("\t"); }).join("\n") +
      "\n\n# sin forma moderna conocida\n" + modern.unresolved().map(function (x) { return x.join("\t"); }).join("\n") + "\n");
    console.log("informe de ortografía:", rep);
  }
}

LANGS.forEach(build);
