/* La serie de escucha «Radio» / «Rádio» (js/radio.js, lang/<código>/radio_data.js,
   el reproductor de js/tramo.js), en los dos idiomas:
   - un episodio por semana de la 6 a la 25, sin los jefes (13 y 26), y
     radio_data.js al día con tools/<código>/radio/;
   - el largo sube de ~120 palabras en la 6 a ~300 en la 25 (±12 %);
   - dos voces (A y B, las dos hablan), personajes con nombre;
   - tres preguntas (castellano hasta la 13, la lengua meta desde la 14), sin
     que la correcta sea siempre la más larga, y dos o tres «¿lo dice?» con
     sí y no;
   - la gramática de la semana (grammatica.forme, en el guion) y sus palabras
     (parole: forma del guion → lema de las palabras de esa semana en
     course.json); las glosas están en el guion;
   - el reproductor: antes de entregar no se ve la transcripción, después sí y
     coincide con el guion turno por turno; lo que se entrega queda en
     state.radio y la misión se cumple con 60 % o con el segundo intento;
   - el plan del día la toma como bloque de input;
   - en portugués, rasgos del habla brasileña ya enseñados (a gente, tá, pra).
   La gramática y el vocabulario que no pasan de la semana los controla
   tools/<código>/check_radio.py (npm run test:content).
   Run: node tools/lib/test_radio.js */
"use strict";
var fs = require("fs"), path = require("path");
var pack = require("./pack.js");
var build = require("./build_radio.js");
var T = require("./testkit.js")("es"), ok = T.ok;

var WEEKS = [6, 7, 8, 9, 10, 11, 12, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25];
function target(w) { return 120 + (w - 6) * 180 / 19; }
var TOL = 0.12;

function words(s) { return String(s).split(/\s+/).filter(function (x) { return /[A-Za-zÀ-ÿ]/.test(x); }).length; }
function toks(s) {
  return String(s).toLowerCase().replace(/[’]/g, "'").split(/[^a-zà-öø-ÿ'-]+/)
    .map(function (t) { return t.replace(/^['-]+|['-]+$/g, ""); }).filter(Boolean)
    .reduce(function (a, t) { a.push(t); if (t.indexOf("'") > 0) a.push(t.slice(t.lastIndexOf("'") + 1)); return a; }, []);
}
function lemmaKeys(v) {
  return String(v).toLowerCase().split("/").map(function (x) {
    return x.trim().replace(/^(il|lo|la|i|gli|le|l'|un|una|uno|o|a|os|as|um|uma)\s+/, "").replace(/^l'/, "").replace(/!$/, "").trim();
  });
}
function stripTags(h) { return h.replace(/<[^>]+>/g, " ").replace(/&#39;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&").replace(/\s+/g, " ").trim(); }

pack.LANGS.forEach(function (code) {
  var L = code + " · ";
  // generated data up to date with the sources
  var gen = fs.readFileSync(path.join(pack.DOCS, "lang", code, "radio_data.js"), "utf8");
  var fresh = build.compile(code);
  var m = /root\.RADIO_DATA = ([\s\S]*?);\n  if \(typeof module/.exec(gen);
  ok(m && JSON.stringify(JSON.parse(m[1])) === JSON.stringify(fresh), L + "radio_data.js al día con tools/" + code + "/radio/ (npm run build)");

  var ctx = pack(code);
  ok(ctx.Radio && ctx.RADIO_DATA && ctx.Tramo, L + "radio.js, radio_data.js y tramo.js cargados en el orden de boot.js");
  var R = ctx.Radio, D = ctx.RADIO_DATA, course = pack.data(code, "course.json");
  ok(JSON.stringify(R.weeks()) === JSON.stringify(WEEKS), L + "un episodio por semana 6-25 sin los jefes: " + R.weeks().join(","));
  var names = {}, total = 0;

  R.episodes().forEach(function (e) {
    var W = L + "semana " + e.week + " · ", cw = course.weeks[e.week - 1];
    ok(!cw.boss, W + "no es semana de jefe");
    ok(e.level === cw.level, W + "nivel " + e.level + " = " + cw.level + " del temario");
    ok(e.title && e.genre && e.es && e.es.length > 40, W + "título, género y presentación en castellano");
    var script = e.turns.map(function (t) { return t[1]; }).join("\n"), n = words(script), tg = target(e.week);
    total += n;
    ok(n >= tg * (1 - TOL) && n <= tg * (1 + TOL), W + n + " palabras (" + Math.round(tg * (1 - TOL)) + "-" + Math.round(tg * (1 + TOL)) + ")");
    ok(n === R.words(e), W + "Radio.words cuenta el guion");
    // two voices
    ok(Array.isArray(e.speakers) && e.speakers.length === 2 && e.speakers.every(Boolean), W + "dos personajes con nombre");
    e.speakers.forEach(function (s) { names[s] = (names[s] || 0) + 1; });
    var who = { A: 0, B: 0 };
    e.turns.forEach(function (t) { if (who[t[0]] != null) who[t[0]]++; else ok(false, W + "voz desconocida " + t[0]); });
    ok(who.A >= 3 && who.B >= 3, W + "las dos voces hablan (A " + who.A + ", B " + who.B + ")");
    ok(e.turns.every(function (t, i) { return i === 0 || t[0] !== e.turns[i - 1][0]; }), W + "los turnos se alternan");
    // questions
    var es = e.week < D.metaFrom;
    ok(e.qlang === (es ? "es" : code), W + "preguntas en " + (es ? "castellano" : code));
    ok(e.questions.length === 3, W + "tres preguntas");
    var longest = 0;
    e.questions.forEach(function (q, i) {
      ok(q[1].length >= 3 && q[1].length <= 4 && q[1].indexOf(q[2]) >= 0 && new Set(q[1]).size === q[1].length, W + "pregunta " + (i + 1) + ": la respuesta entre 3-4 opciones distintas");
      ok(es ? /^¿.*\?$/.test(q[0]) : /\?$/.test(q[0]) && !/[¿ñ]/.test(q[0] + q[1].join(" ")), W + "pregunta " + (i + 1) + " en " + (es ? "castellano" : "la lengua meta") + ": " + q[0]);
      var Ls = q[1].map(function (o) { return o.length; }), max = Math.max.apply(null, Ls);
      if (q[2].length === max && Ls.filter(function (x) { return x === max; }).length === 1) longest++;
    });
    ok(longest <= 1, W + "la correcta es la opción más larga en " + longest + " de 3");
    ok(e.info.length >= 2 && e.info.length <= 3, W + "dos o tres «¿lo dice?»");
    ok(e.info.some(function (v) { return v[1] === true; }) && e.info.some(function (v) { return v[1] === false; }), W + "«¿lo dice?» con sí y con no");
    ok(e.info.every(function (v) { return es || !/[ñ¿¡]/.test(v[0]); }), W + "«¿lo dice?» en la lengua meta desde la " + D.metaFrom);
    ok(e.infoYes && e.infoNo && e.infoPrompt, W + "etiquetas de «¿lo dice?»");
    // grammar and words of the week
    var tk = new Set(toks(script));
    var gf = (e.grammatica || {}).forme || [];
    ok(e.grammatica && e.grammatica.label && gf.length >= 4, W + "la gramática de la semana con cuatro formas o más");
    gf.forEach(function (f) { ok(toks(f).every(function (x) { return tk.has(x); }), W + "forma de la semana en el guion: " + f); });
    var voc = {};
    (cw.vocab || []).forEach(function (v) { lemmaKeys(v[0]).forEach(function (k) { voc[k] = 1; }); });
    var par = e.parole || [];
    ok(par.length >= 5, W + "cinco palabras de la semana o más (" + par.length + ")");
    par.forEach(function (p) {
      ok(toks(p[0]).every(function (x) { return tk.has(x); }), W + "palabra en el guion: " + p[0]);
      ok(voc[lemmaKeys(p[1])[0]], W + "«" + p[1] + "» es de las palabras de la semana " + e.week);
    });
    // Brazilian speech, each feature from the week it is taught (a gente 5, tá / tô / né 8, pra / pro 9)
    if (code === "pt") {
      var low = " " + script.toLowerCase().replace(/[^a-zà-ú]+/g, " ") + " ";
      var feat = [["a gente", 5], ["tá", 8], ["tô", 8], ["né", 8], ["pra", 9], ["pro", 9]].filter(function (f) { return low.indexOf(" " + f[0] + " ") >= 0; });
      ok(feat.length > 0, W + "rasgos del habla brasileña (a gente, pra, tá…)");
      feat.forEach(function (f) { ok(f[1] <= e.week, W + "«" + f[0] + "» antes de su semana (" + f[1] + ")"); });
    }
    Object.keys(e.gloss || {}).forEach(function (g) {
      ok(script.toLowerCase().replace(/’/g, "'").indexOf(g.toLowerCase()) >= 0, W + "glosa que está en el guion: " + g);
    });

    // the player: questions first, the transcript after delivering
    var state = { unlocked: e.week, cards: {} }, shown = [];
    ctx.speechSynthesis = { cancel: function () {}, speak: function () {} };   // a browser with voices
    ctx.scrollTo = function () {};
    ctx.Tramo.attach({ state: function () { return state; }, esc: function (s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;"); },
      show: function (s) { shown.push(s); }, ui: function () { return { read: "Leggi" }; }, shuffle: function (a) { return a.slice(); },
      persist: function () {}, render: function () {}, gain: function () {}, listened: function () {}, langName: function () { return code; } });
    ctx.Tramo.go("radio", String(e.week));
    ok(shown[0] === "tramo-asc", W + "la misión abre el reproductor (tramo-asc)");
    var pre = ctx.Tramo.render("tramo-asc");
    ok(/📻/.test(pre) && pre.indexOf('name="tq2"') > 0 && pre.indexOf('name="ti' + (e.info.length - 1) + '"') > 0, W + "antes de escuchar: las tres preguntas y los «¿lo dice?» a la vista");
    ok(stripTags(pre).indexOf(e.turns[1][1].slice(0, 30)) < 0, W + "la transcripción no se ve antes de entregar");
    var q0 = e.questions[0][0], at = pre.indexOf(q0.replace(/'/g, "&#39;").replace(/"/g, "&quot;"));
    ok(at > 0 && (es ? /<li><b>$/ : /<li><b lang="[^"]+">$/).test(pre.slice(at - 24, at)), W + "las preguntas llevan el lang de su lengua");
    // answer: all right but the first question (2 of 3 + the info)
    ctx.document = { querySelector: function (sel) {
      var mq = /name="tq(\d)"/.exec(sel), mi = /name="ti(\d)"/.exec(sel);
      if (mq) return +mq[1] === 0 ? null : { value: e.questions[+mq[1]][2] };
      if (mi) return { value: e.info[+mi[1]][1] ? "y" : "n" };
      return null;
    }, getElementById: function () { return null; } };
    var wire = /id="trdeliver"/.test(pre);
    ok(wire, W + "botón para entregar");
    // deliver (what the button does)
    ctx.Tramo._deliverAsc();
    var n0 = e.questions.length + e.info.length, pct = Math.round((n0 - 1) / n0 * 100);
    var rec = state.radio && state.radio[e.week];
    ok(rec && rec.pct === pct && rec.tries === 1, W + "entregado queda en state.radio: " + JSON.stringify(rec));
    var post = ctx.Tramo.render("tramo-asc");
    var shownT = stripTags(post.slice(post.indexOf("<h3>Transcripción</h3>")));
    var want = e.turns.map(function (t) { return e.speakers[t[0] === "A" ? 0 : 1] + ": " + t[1]; }).join(" ").replace(/\s+/g, " ");
    ok(shownT.indexOf(want) >= 0, W + "la transcripción que se ve es el guion, turno por turno");
    ok(R.transcript(e).replace(/\n/g, " ") === want, W + "Radio.transcript = el guion");
    ok(/trredo/.test(post) && !/trwrite/.test(post), W + "después: «Responder otra vez», sin tarea del tramo");
    var ms = R.missions(cw, state);
    ok(ms.length === 1 && ms[0].kind === "radio" && ms[0].done === pct >= 60 && ms[0].ico === "📻", W + "misión «" + (ms[0] || {}).title + "» hecha = " + (pct >= 60));
  });
  var recurring = Object.keys(names).filter(function (s) { return names[s] >= 3; });
  ok(recurring.length >= 3, L + "personajes que vuelven (tres o más en tres episodios o más): " + recurring.join(", "));
  console.log(L + R.episodes().length + " episodios, " + total + " palabras");

  // the mission: 60 %, or the second try
  var st = { cards: {} }, w6 = course.weeks[5];
  R.record(st, 6, { pct: 40, ok: 2, n: 5 });
  var m1 = R.missions(w6, st)[0];
  ok(!m1.done && m1.half && !m1.opt, L + "con 40 % la misión queda a medias (y es obligatoria)");
  R.record(st, 6, { pct: 20, ok: 1, n: 5 });
  ok(R.missions(w6, st)[0].done && st.radio[6].pct === 40 && st.radio[6].tries === 2, L + "el segundo intento la completa y guarda el mejor");
  // 3.1: two blank sheets do not complete it; the third try always does;
  // a record saved before 3.1 keeps its old rule
  var sb = { cards: {} };
  R.record(sb, 6, { pct: 0, ok: 0, n: 5 }); R.record(sb, 6, { pct: 20, ok: 1, n: 5 });
  var mb = R.missions(w6, sb)[0];
  ok(!mb.done && mb.half && /Te falta: 60 %/.test(mb.sub), L + "dos entregas con 20 % no la completan y dicen qué falta: " + mb.sub);
  R.record(sb, 6, { pct: 0, ok: 0, n: 5 });
  ok(R.missions(w6, sb)[0].done, L + "el tercer intento la completa igual (la semana nunca queda trabada)");
  ok(R.missions(w6, { cards: {}, radio: { 6: { pct: 0, tries: 2 } } })[0].done, L + "un registro de antes de la 3.1 sigue hecho");
  var st2 = { cards: {} };
  R.record(st2, 7, { pct: 60, ok: 3, n: 5 });
  ok((R.missions(course.weeks[6], st2)[0] || {}).done, L + "con 60 % queda hecha");
  ok(!R.missions(course.weeks[12], st2).length && !R.missions(course.weeks[26], st2).length && !R.missions(course.weeks[4], st2).length, L + "sin misión en los jefes ni fuera de 6-25");
  ok(ctx.Tramo.handles("radio"), L + "Tramo reproduce la misión «radio» (goMission)");

  // the plan of the day takes it as input
  var P = ctx.Plan;
  ok(P.INPUT.radio === 1, L + "la radio es input para el plan");
  var plan = P.today(course, { cards: {}, log: [] }, 15, { now: new Date(2026, 8, 23, 10), due: 0, week: w6,
    missions: [{ kind: "lez", arg: "0", title: "Lección", done: true }, { kind: "play", title: "Superá la semana", done: false },
               { kind: "radio", arg: "6", title: "Radio: …", done: false }] });
  var inb = plan.steps.filter(function (s) { return s.block === "input"; })[0];
  ok(inb && inb.kind === "radio" && inb.min === P.MISSION_MIN.radio, L + "el plan del día pone la radio como bloque de input: " + JSON.stringify(plan.steps.map(function (s) { return s.block + ":" + s.kind; })));
});

T.done();
