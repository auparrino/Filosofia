/*
 * El seminario, los dilemas y la literatura de la semana: lo semanal del
 * formato híbrido (FORMATO.md).  Lo diario (la lección, las rondas, el
 * repaso) es el motor de siempre; esto es lo que lo completa: leer despacio
 * un texto, reconstruir su argumento y escribir una posición propia con
 * devolución, más los casos sin respuesta correcta.
 *
 * El seminario (week.seminario, lo arma tools/curso/build_course.py):
 *   1. el texto en tramos: cada uno con sus glosas, un chequeo cerrado
 *      opcional y preguntas abiertas con un lugar para anotar;
 *   2. el mapa del argumento: las premisas desordenadas para ponerlas en
 *      orden (un toque por premisa), y después el mapa entero con la premisa
 *      implícita, la objeción y la réplica;
 *   3. la escritura: la consigna, la cuenta de palabras, la rúbrica para
 *      autoevaluarse y la devolución socrática —con la IA (la clave del
 *      alumno), que pregunta y señala tensiones pero no da la respuesta ni
 *      reescribe (Bastani et al. 2025: sin esos límites, la IA empeora lo que
 *      se aprende); sin IA, las preguntas socráticas del autor, una por
 *      vez—, y el texto modelo después de escribir.
 *   Es la misión «📜 Seminario» de la semana (no es opcional: es la sesión
 *   larga del formato); se cumple con el escrito a su largo mínimo y la
 *   rúbrica marcada.
 *
 * Los dilemas (week.dilemas): un caso, una pregunta, las posiciones.  Al
 * elegir, la app muestra quién más la sostiene, por qué y la objeción que
 * tiene que responder; después, la vuelta del caso («¿y si…?») y si
 * mantenés la posición.  Las elecciones quedan en «Tus posiciones», para
 * mirar la consistencia.  Misión opcional «🤔 Dilema».
 *
 * La literatura (week.literatura, de tools/curso/literatura.py): una
 * tarjeta en la semana con cada obra y su porqué.
 *
 * Guarda en state.sem = {semana: {t, notes: {i: texto}, chk: {i: bien},
 * order: [..], map, text, rub: [..], ai: [[rol, texto]…], soc, done, at}} y
 * state.dil = {"semana:i": {c, keep, at}}.
 *
 *   Seminario.missions(w, state)   las misiones de la semana (weekPlan)
 *   Seminario.litCard(w)           la tarjeta de la literatura
 *   Seminario.open(semana, parte) / owns / render / wire   las pantallas
 *   Seminario.simulate(state, w)   lo que hace la simulación (sim_carriera)
 * Test: tools/curso/test_curso.js; en el navegador, tools/lib/smoke_curso.js.
 */
(function (root) {
  "use strict";

  var H = null;                         // the host (app.js)
  var XP = { tramo: 5, mapa: 15, texto: 40, dilema: 10 };
  var SCREENS = { seminario: 1, dilema: 1, posiciones: 1 };

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function mk(s) { return H && H.mk ? H.mk(s) : esc(s); }
  function words(s) { return (String(s || "").match(/[A-Za-zÀ-ÿñÑ0-9]+/g) || []).length; }

  /* ------------------------------------------------------------ datos */

  function store(state) {
    if (!state.sem || typeof state.sem !== "object") state.sem = {};
    if (!state.dil || typeof state.dil !== "object") state.dil = {};
    return state;
  }
  function rec(state, n) { return (store(state).sem)[n] || null; }
  function recOf(state, n) {
    var s = store(state).sem;
    if (!s[n]) s[n] = { t: 0, notes: {}, chk: {}, order: [], map: false, text: "", rub: [], ai: [], soc: 0, done: 0, at: 0 };
    return s[n];
  }
  function minWords(sm) { return ((sm.escribir || {}).palabras || [150, 300])[0]; }
  function rubricOk(sm, r) {
    var n = ((sm.escribir || {}).rubrica || []).length;
    return !!r && (r.rub || []).filter(Boolean).length >= Math.min(n, 3);
  }
  function semDone(sm, r) { return !!r && words(r.text) >= minWords(sm) && rubricOk(sm, r); }
  function dilKey(n, i) { return n + ":" + i; }

  /* ---------------------------------------------------------- misiones */

  function missions(w, state) {
    if (!w || w.boss) return [];
    var out = [], sm = w.seminario;
    if (sm) {
      var r = rec(state, w.week), done = semDone(sm, r), nt = (sm.tramos || []).length;
      var step = !r ? "" : r.text ? words(r.text) + " palabras escritas" : r.map ? "falta escribir" : r.t >= nt ? "falta el mapa del argumento" : "tramo " + (r.t + 1) + " de " + nt;
      out.push({ kind: "sem", arg: String(w.week), done: done, half: !!r && !done && (r.t > 0 || r.map), ico: "📜",
        title: "Seminario: " + esc(sm.autor) + ", " + esc(sm.obra),
        sub: done ? "Hecho · " + words(r.text) + " palabras" :
          (step ? esc(step) + " · " : "") + nt + " tramos, el mapa del argumento y tu escrito (" + minWords(sm) + "+ palabras) · la sesión larga de la semana" });
    }
    (w.dilemas || []).forEach(function (d, i) {
      var c = store(state).dil[dilKey(w.week, i)];
      out.push({ kind: "dil", arg: w.week + ":" + i, done: !!c, opt: true, ico: "🤔",
        title: "Dilema: " + esc(shortCase(d.caso)),
        sub: c ? "Elegiste: " + esc(shortCase((d.opciones[c.c] || {}).texto || "")) : "Opcional · sin respuesta correcta: tomá posición y mirá la objeción" });
    });
    return out;
  }
  function shortCase(s) {
    s = String(s || "").replace(/\*/g, "");
    var cut = s.split(/(?<=[.?!:])\s/)[0];
    return cut.length > 80 ? cut.slice(0, 77) + "…" : cut;
  }
  function handles(kind) { return kind === "sem" || kind === "dil"; }
  function go(kind, arg) {
    if (kind === "sem") open(+arg, "texto");
    else if (kind === "dil") { var p = String(arg).split(":"); openDilema(+p[0], +p[1]); }
  }

  /* ---------------------------------------------------------- literatura */

  function litCard(w) {
    var L = (w && w.literatura) || [];
    if (!L.length) return "";
    return '<div class="card lit"><h2>📚 En la literatura</h2>' +
      '<p class="muted small">Ficción que cae dentro de lo que estudiás esta semana o lo muestra. 📖 = de dominio público.</p>' +
      '<ul class="lit-list">' + L.map(function (o) {
        var y = o["año"], when = y < 0 ? -y + " a. C." : String(y);
        return "<li><b>" + mk(o.obra) + "</b> · " + esc(o.autor) + " (" + esc(when) + ")" + (o.dp ? " 📖" : "") +
          ' <span class="muted small">' + esc(o.tipo) + "</span><br>" + mk(o.por_que) + "</li>";
      }).join("") + "</ul></div>";
  }

  /* ----------------------------------------------------------- pantallas */

  var cur = null;                 // {week, part: texto|mapa|escribir, from, chat}
  function week(n) { var c = H.course(); return c && c.weeks ? c.weeks[n - 1] : null; }
  function open(n, part, from) {
    var w = week(n);
    if (!w || !w.seminario) return;
    var r = recOf(H.state(), n);
    if (!part) part = r.map ? "escribir" : r.t >= w.seminario.tramos.length ? "mapa" : "texto";
    cur = { week: n, part: part, from: from || "briefing", pick: [], reveal: !!r.map, busy: false, err: "" };
    H.show("seminario");
  }
  function openDilema(n, i, from) {
    var w = week(n);
    if (!w || !(w.dilemas || [])[i]) return;
    cur = { week: n, dil: i, from: from || "briefing" };
    H.show("dilema");
  }
  function openPositions(from) { cur = { from: from || "io" }; H.show("posiciones"); }
  function back() {
    var from = cur ? cur.from : "briefing";
    cur = null;
    if (from === "io") H.go("io");
    else if (from === "hoy") H.go("oggi");
    else H.toWeek();
  }
  function owns(screen) { return !!SCREENS[screen]; }

  function header(w, sm, step) {
    var steps = [["texto", "1 · El texto"], ["mapa", "2 · El argumento"], ["escribir", "3 · Tu escrito"]];
    return '<button class="btn ghost" id="semback">← a la semana</button>' +
      "<h1>📜 " + esc(sm.autor) + ", <i>" + esc(sm.obra) + "</i></h1>" +
      '<p class="lead">Seminario · semana ' + w.week + " · " + esc(sm.pasaje) +
        (sm.derechos === "breve" ? " · en nuestras palabras, con citas breves" : " · traducción " + esc(sm.traduccion || "propia")) + "</p>" +
      '<div class="tabs sem-steps">' + steps.map(function (s) {
        return '<button class="tab' + (s[0] === step ? " on" : "") + '" data-semstep="' + s[0] + '">' + s[1] + "</button>";
      }).join("") + "</div>";
  }

  function renderTexto(w, sm, r) {
    var nt = sm.tramos.length, i = Math.min(r.t, nt - 1), t = sm.tramos[i], finished = r.t >= nt;
    var html = '<div class="card"><p class="muted small">' + mk(sm.contexto) + "</p></div>" +
      '<p class="muted small">Tramo ' + (i + 1) + " de " + nt + (finished ? " · ya los leíste todos" : "") + "</p>" +
      '<div class="card sem-text"><p>' + mk(t.texto) + "</p>" +
      ((t.glosas || []).length ? '<ul class="sem-glosas small">' + t.glosas.map(function (g) { return "<li><b>" + mk(g[0]) + "</b>: " + mk(g[1]) + "</li>"; }).join("") + "</ul>" : "") +
      "</div>";
    (t.chequeo || []).forEach(function (q, k) {
      var key = i + "." + k, got = r.chk[key];
      html += '<div class="card"><p><b>¿Entendiste?</b> ' + mk(q.prompt) + '</p><div class="options">' +
        q.options.map(function (o) {
          var cls = got == null ? "" : o === q.answer ? " ok" : got === o ? " bad" : "";
          return '<button class="opt' + cls + '" data-semchk="' + esc(key) + '" data-o="' + esc(o) + '"' + (got != null ? " disabled" : "") + ">" + mk(o) + "</button>";
        }).join("") + "</div></div>";
    });
    html += '<div class="card"><h3>Para pensar</h3><ol class="sem-q">' + t.preguntas.map(function (q) { return "<li>" + mk(q) + "</li>"; }).join("") + "</ol>" +
      '<textarea id="semnote" class="grow" rows="4" placeholder="Tus notas (opcional): lo que te contestás, lo que no entendés…">' + esc(r.notes[i] || "") + "</textarea></div>" +
      '<div class="row">' + (i > 0 ? '<button class="btn ghost" id="semprev">← Tramo anterior</button>' : "") +
      (i < nt - 1 ? '<button class="btn" id="semnext">Siguiente tramo →</button>' : '<button class="btn" id="semtomap">Al argumento →</button>') + "</div>";
    return html;
  }

  function premOrder(sm, wk) {
    // a fixed shuffle per week, so the order does not change between visits
    var p = sm.mapa.premisas.map(function (x, k) { return k; }), seed = wk * 7919;
    for (var k = p.length - 1; k > 0; k--) { seed = (seed * 16807) % 2147483647; var j = seed % (k + 1), tmp = p[k]; p[k] = p[j]; p[j] = tmp; }
    if (p.every(function (x, k) { return x === k; }) && p.length > 1) p.reverse();
    return p;
  }
  function renderMapa(w, sm, r) {
    var m = sm.mapa, order = premOrder(sm, w.week), picked = cur.pick || [];
    var html = '<div class="card"><h3>La conclusión</h3><p class="sem-concl">' + mk(m.conclusion) + "</p></div>";
    if (!cur.reveal) {
      html += '<div class="card"><h3>Ordená las premisas</h3><p class="muted small">Tocalas en el orden en que llevan a la conclusión. Después compará con el mapa.</p>' +
        '<div class="sem-prem">' + order.map(function (k) {
          var at = picked.indexOf(k);
          return '<button class="opt sem-p' + (at >= 0 ? " on" : "") + '" data-semp="' + k + '">' + (at >= 0 ? "<b>" + (at + 1) + ".</b> " : "") + mk(m.premisas[k]) + "</button>";
        }).join("") + "</div>" +
        '<div class="row"><button class="btn ghost" id="semclear">Empezar de nuevo</button>' +
        '<button class="btn" id="semreveal"' + (picked.length === m.premisas.length ? "" : " disabled") + ">Ver el mapa</button></div></div>";
    } else {
      var right = picked.length ? picked.filter(function (k, at) { return k === at; }).length : null;
      html += '<div class="card sem-map"><h3>El mapa</h3>' +
        (right != null ? '<p class="muted small">Pusiste ' + right + " de " + m.premisas.length + " en el lugar del mapa. Un orden distinto también puede funcionar: fijate si el tuyo lleva a la conclusión.</p>" : "") +
        "<ol>" + m.premisas.map(function (p) { return "<li>" + mk(p) + "</li>"; }).join("") + "</ol>" +
        (m.implicita ? '<p><b>La premisa implícita</b> (la que el texto da por sentada): ' + mk(m.implicita) + "</p>" : "") +
        '<p>∴ <b>' + mk(m.conclusion) + "</b></p>" +
        '<p class="sem-obj"><b>⚔️ La objeción:</b> ' + mk(m.objecion) + "</p>" +
        '<p class="sem-rep"><b>🛡️ La réplica:</b> ' + mk(m.replica) + "</p></div>" +
        '<div class="row"><button class="btn" id="semtowrite">A escribir →</button></div>';
    }
    return html;
  }

  function aiOn() { var k = H.aiKeys ? H.aiKeys() : null; return !!(k && k.claude && root.IA); }
  function renderEscribir(w, sm, r) {
    var es = sm.escribir, n = words(r.text), min = es.palabras[0], max = es.palabras[1];
    var html = '<div class="card"><h3>La consigna</h3><p>' + mk(es.consigna) + '</p><p class="muted small">Entre ' + min + " y " + max + " palabras.</p></div>" +
      '<textarea id="semtext" class="grow scrivi" rows="10" spellcheck="true" autocapitalize="sentences" placeholder="Tu respuesta…">' + esc(r.text || "") + "</textarea>" +
      '<p class="muted small" id="semcount">' + countLine(n, min, max) + "</p>" +
      '<div class="card"><h3>La rúbrica</h3><p class="muted small">Releé tu texto y marcá lo que cumple. Lo que no, todavía lo podés mejorar.</p>' +
      es.rubrica.map(function (c, k) {
        return '<label class="set sem-rub"><input type="checkbox" data-semrub="' + k + '"' + (r.rub[k] ? " checked" : "") + "> <span>" + mk(c) + "</span></label>";
      }).join("") + "</div>" +
      '<div class="card sem-tutor"><h3>🦉 El tutor socrático</h3>' +
      '<p class="muted small">' + (aiOn() ? "Te hace preguntas sobre tu texto y te señala tensiones. No te da la respuesta ni te lo reescribe: eso lo tenés que hacer vos."
        : "Sin una clave de IA (se carga en Yo), el tutor son las preguntas del curso, una por vez. Contestalas mirando tu texto.") + "</p>" +
      chatHtml(r) +
      (cur.err ? '<p class="small bad">' + esc(cur.err) + "</p>" : "") +
      (aiOn() ? (r.ai.length ? '<textarea id="semreply" class="grow" rows="3" placeholder="Contestale al tutor…"></textarea>' : "") +
        '<div class="row"><button class="btn" id="semai"' + (cur.busy || n < 20 ? " disabled" : "") + ">" + (cur.busy ? "Pensando…" : r.ai.length ? "Responder" : "Pedir una devolución") + "</button></div>"
        : '<p class="sem-soc">' + mk(sm.socraticas[r.soc % sm.socraticas.length]) + '</p><div class="row"><button class="btn ghost" id="semsoc">Otra pregunta</button></div>') +
      "</div>" +
      '<div class="card"><h3>El modelo</h3>' +
      (n >= min ? "<details><summary>Ver una respuesta posible</summary><p>" + mk(es.modelo) + '</p><p class="muted small">Es una de muchas: compará cómo arma la tesis, las razones y la objeción, no si dice lo mismo que vos.</p></details>'
        : '<p class="muted small">Se abre cuando tu texto llega a ' + min + " palabras: primero escribí el tuyo.</p>") + "</div>" +
      (semDone(sm, r) ? '<p class="ok">✓ Seminario hecho.</p>' : "");
    return html;
  }
  function countLine(n, min, max) {
    return n + " palabras · " + min + "–" + max + (n && n < min ? " · faltan " + (min - n) : n > max ? " · te pasaste: probá recortar" : n ? " ✓" : "");
  }
  function chatHtml(r) {
    if (!r.ai.length) return "";
    return '<div class="sem-chat">' + r.ai.map(function (m) {
      return '<p class="' + (m[0] === "assistant" ? "sem-t" : "sem-u") + '"><b>' + (m[0] === "assistant" ? "🦉 " : "Vos: ") + "</b>" + mk(m[1]) + "</p>";
    }).join("") + "</div>";
  }

  function renderDilema() {
    var w = week(cur.week), d = w.dilemas[cur.dil], st = H.state(), c = store(st).dil[dilKey(cur.week, cur.dil)];
    var html = '<button class="btn ghost" id="semback">← a la semana</button><h1>🤔 Un dilema</h1>' +
      '<p class="lead">Semana ' + w.week + " · " + esc(w.title) + " · no hay respuesta correcta</p>" +
      '<div class="card"><p>' + mk(d.caso) + "</p><p><b>" + mk(d.pregunta) + "</b></p></div>";
    if (!c) {
      html += '<div class="options">' + d.opciones.map(function (o, k) {
        return '<button class="opt" data-dilc="' + k + '">' + mk(o.texto) + "</button>";
      }).join("") + "</div>";
      return html;
    }
    d.opciones.forEach(function (o, k) {
      html += '<div class="card' + (k === c.c ? " dil-mine" : "") + '"><p><b>' + (k === c.c ? "Tu posición: " : "") + mk(o.texto) + "</b></p>" +
        '<p class="small">🏛️ La sostendría: ' + mk(o.escuela) + "</p>" +
        '<p class="small">Por qué: ' + mk(o.porque) + "</p>" +
        '<p class="small">⚔️ La objeción que tiene que responder: ' + mk(o.objecion) + "</p></div>";
    });
    if (d.despues) {
      html += '<div class="card"><h3>Y ahora…</h3><p>' + mk(d.despues) + "</p>" +
        (c.keep == null ? '<div class="row"><button class="btn" data-dilkeep="1">Mantengo mi posición</button><button class="btn ghost" data-dilkeep="0">Cambio de posición</button></div>'
          : '<p class="muted small">' + (c.keep ? "Mantuviste tu posición: ¿con qué razón responderías la objeción?" : "Cambiaste: ¿qué del caso nuevo pesó más que tu razón de antes?") + "</p>") + "</div>";
    }
    html += '<div class="row"><button class="btn ghost" id="dilredo">Elegir de nuevo</button><button class="btn ghost" id="dilall">Tus posiciones</button></div>';
    return html;
  }

  function renderPositions() {
    var st = H.state(), D = store(st).dil, c = H.course();
    var keys = Object.keys(D).sort(function (a, b) { return (+a.split(":")[0]) - (+b.split(":")[0]); });
    var html = '<button class="btn ghost" id="semback">← Volver</button><h1>🤔 Tus posiciones</h1>' +
      '<p class="lead">Lo que elegiste en cada dilema. Mirá si son consistentes entre sí: ¿razonás siempre desde la misma escuela?</p>';
    if (!keys.length) return html + '<p class="muted">Todavía no tomaste posición en ningún dilema.</p>';
    var by = {};
    keys.forEach(function (k) {
      var p = k.split(":"), w = c.weeks[+p[0] - 1], d = w && (w.dilemas || [])[+p[1]];
      if (!d) return;
      var o = d.opciones[D[k].c] || {};
      by[o.escuela] = (by[o.escuela] || 0) + 1;
      html += '<div class="card"><p class="muted small">Semana ' + w.week + " · " + esc(w.title) + "</p><p>" + mk(shortCase(d.caso)) + "</p>" +
        "<p><b>" + mk(o.texto || "") + "</b></p><p class=\"small\">🏛️ " + mk(o.escuela || "") + (D[k].keep === false ? " · cambiaste después" : "") + "</p></div>";
    });
    return html;
  }

  function render(screen) {
    if (!cur) return '<button class="btn ghost" id="semback">← Volver</button>';
    if (screen === "dilema") return renderDilema();
    if (screen === "posiciones") return renderPositions();
    var w = week(cur.week), sm = w.seminario, r = recOf(H.state(), cur.week);
    var body = cur.part === "mapa" ? renderMapa(w, sm, r) : cur.part === "escribir" ? renderEscribir(w, sm, r) : renderTexto(w, sm, r);
    return header(w, sm, cur.part) + body;
  }

  /* -------------------------------------------------------------- la IA */

  function tutorPrompt(w, sm, r) {
    var es = sm.escribir;
    var sys = "Sos un tutor socrático de filosofía para un alumno adulto que estudia solo, en castellano rioplatense (con voseo). " +
      "Reglas que no se rompen: nunca des la respuesta, nunca reescribas ni corrijas el texto del alumno, nunca digas qué posición es la correcta. " +
      "Hacé como máximo dos preguntas cortas por turno. Señalá UNA tensión, un supuesto sin justificar, una razón que falta o una objeción que no consideró, " +
      "citando entre comillas una frase de su texto. Si el texto ya es bueno, pedile la objeción más fuerte contra su propia tesis. " +
      "Si te pide la respuesta, explicale amablemente que la idea es que la construya él, y hacele una pregunta que lo acerque. " +
      "Respondé en 90 palabras como máximo. Contestá SOLO con un JSON: {\"respuesta\": \"...\"}.\n\n" +
      "Contexto (para vos; no lo recites): semana " + w.week + " del curso (" + w.title + "). El alumno leyó " + sm.autor + ", " + sm.obra + " (" + sm.pasaje + "). " +
      "La consigna fue: " + es.consigna + "\nLa rúbrica: " + es.rubrica.join(" / ") +
      "\nEl argumento del texto, según el curso: " + sm.mapa.premisas.join(" ") + " Por lo tanto: " + sm.mapa.conclusion +
      " Objeción clásica: " + sm.mapa.objecion + "\nPreguntas que el curso sugiere: " + sm.socraticas.join(" | ");
    var msgs = [{ role: "user", content: "Mi texto:\n\n" + r.text }];
    r.ai.forEach(function (m, k) { if (k === 0 && m[0] === "user") return; msgs.push({ role: m[0], content: m[1] }); });
    return { system: sys, messages: msgs };
  }
  function askTutor(reply) {
    var w = week(cur.week), sm = w.seminario, st = H.state(), r = recOf(st, cur.week);
    if (reply) r.ai.push(["user", reply]);
    else if (!r.ai.length) r.ai.push(["user", "(mi texto)"]);
    cur.busy = true; cur.err = "";
    H.persist(); H.render();
    root.IA.llm(tutorPrompt(w, sm, r), H.aiKeys(), function (err, data) {
      cur.busy = false;
      var text = data && (data.respuesta || data.texto || data.text);
      if (err || !text) { cur.err = "El tutor no contestó (" + (err ? err.message : "respuesta vacía") + "). Probá de nuevo en un rato."; if (!reply && r.ai.length === 1) r.ai = []; }
      else r.ai.push(["assistant", String(text)]);
      H.persist(); H.render();
    }, { max: 400 });
  }

  /* -------------------------------------------------------------- cables */

  var saveTimer = null;
  function wire(screen) {
    if (typeof document === "undefined") return;
    document.querySelectorAll("[data-sem]").forEach(function (b) { b.onclick = function () { open(+b.getAttribute("data-sem")); }; });
    if (!owns(screen) || !cur) return;
    var on = function (id, fn) { var b = document.getElementById(id); if (b) b.onclick = fn; };
    var st = H.state();
    on("semback", back);
    on("dilall", function () { openPositions(cur.from); });
    if (screen === "dilema") {
      var key = dilKey(cur.week, cur.dil);
      document.querySelectorAll("[data-dilc]").forEach(function (b) {
        b.onclick = function () {
          var first = !store(st).dil[key];
          st.dil[key] = { c: +b.getAttribute("data-dilc"), keep: null, at: Date.now() };
          if (first) H.gain(XP.dilema, "output");
          H.persist(); H.render(); window.scrollTo(0, 0);
        };
      });
      document.querySelectorAll("[data-dilkeep]").forEach(function (b) {
        b.onclick = function () { st.dil[key].keep = b.getAttribute("data-dilkeep") === "1"; H.persist(); H.render(); };
      });
      on("dilredo", function () { delete st.dil[key]; H.persist(); H.render(); });
      return;
    }
    if (screen !== "seminario") return;
    var w = week(cur.week), sm = w.seminario, r = recOf(st, cur.week);
    document.querySelectorAll("[data-semstep]").forEach(function (b) {
      b.onclick = function () { cur.part = b.getAttribute("data-semstep"); H.render(); window.scrollTo(0, 0); };
    });
    // 1. the text
    var note = document.getElementById("semnote"), i = Math.min(r.t, sm.tramos.length - 1);
    if (note) note.addEventListener("input", function () {
      clearTimeout(saveTimer);
      saveTimer = setTimeout(function () { r.notes[i] = note.value.slice(0, 3000); H.persist(); }, 400);
    });
    function leaveTramo() { if (note) r.notes[i] = note.value.slice(0, 3000); }
    document.querySelectorAll("[data-semchk]").forEach(function (b) {
      b.onclick = function () {
        var k = b.getAttribute("data-semchk"), p = k.split("."), q = sm.tramos[+p[0]].chequeo[+p[1]];
        r.chk[k] = b.getAttribute("data-o");
        if (r.chk[k] === q.answer) H.gain(2, "input");
        H.persist(); H.render();
      };
    });
    on("semprev", function () { leaveTramo(); r.t = Math.max(0, i - 1); H.persist(); H.render(); window.scrollTo(0, 0); });
    on("semnext", function () {
      leaveTramo();
      if (r.t <= i) { r.t = i + 1; H.gain(XP.tramo, "input"); }
      H.persist(); H.render(); window.scrollTo(0, 0);
    });
    on("semtomap", function () {
      leaveTramo();
      if (r.t < sm.tramos.length) { r.t = sm.tramos.length; H.gain(XP.tramo, "input"); }
      cur.part = "mapa"; H.persist(); H.render(); window.scrollTo(0, 0);
    });
    // 2. the map
    document.querySelectorAll("[data-semp]").forEach(function (b) {
      b.onclick = function () {
        var k = +b.getAttribute("data-semp"), at = cur.pick.indexOf(k);
        if (at >= 0) cur.pick = cur.pick.slice(0, at); else cur.pick.push(k);
        H.render();
      };
    });
    on("semclear", function () { cur.pick = []; H.render(); });
    on("semreveal", function () {
      cur.reveal = true;
      if (!r.map) { r.map = true; r.order = cur.pick.slice(); H.gain(XP.mapa, "forma"); }
      H.persist(); H.render();
    });
    on("semtowrite", function () { cur.part = "escribir"; H.render(); window.scrollTo(0, 0); });
    // 3. the writing
    var box = document.getElementById("semtext"), cnt = document.getElementById("semcount");
    var es = sm.escribir;
    function saveText() {
      var was = semDone(sm, r);
      r.text = box.value.slice(0, 6000); r.at = Date.now();
      if (!was && semDone(sm, r)) { r.done = Date.now(); H.gain(XP.texto, "output"); H.toast("📜 Seminario hecho · +" + XP.texto + " xp"); H.persist(); H.render(); return; }
      H.persist();
    }
    if (box) {
      box.addEventListener("input", function () {
        if (cnt) cnt.textContent = countLine(words(box.value), es.palabras[0], es.palabras[1]);
        clearTimeout(saveTimer);
        saveTimer = setTimeout(saveText, 500);
      });
      box.addEventListener("blur", function () { clearTimeout(saveTimer); saveText(); });
    }
    document.querySelectorAll("[data-semrub]").forEach(function (b) {
      b.onchange = function () {
        if (box) { clearTimeout(saveTimer); r.text = box.value.slice(0, 6000); }
        var was = semDone(sm, r);
        r.rub[+b.getAttribute("data-semrub")] = b.checked;
        if (!was && semDone(sm, r)) { r.done = Date.now(); H.gain(XP.texto, "output"); H.toast("📜 Seminario hecho · +" + XP.texto + " xp"); H.persist(); H.render(); return; }
        H.persist();
      };
    });
    on("semsoc", function () { r.soc = (r.soc || 0) + 1; H.persist(); H.render(); });
    on("semai", function () {
      if (box) { clearTimeout(saveTimer); saveText(); }
      var rep = document.getElementById("semreply");
      if (r.ai.length && !(rep && rep.value.trim())) { H.toast("Escribile algo al tutor."); return; }
      askTutor(rep ? rep.value.trim() : "");
    });
  }

  /* ---------------------------------------------------------- simulación */

  // What the simulated learner does (tools/lib/sim_carriera.js): reads the
  // tramos, orders the map, writes the minimum and marks the rubric.
  function simulate(state, w) {
    if (!w || !w.seminario) return 0;
    var sm = w.seminario, r = recOf(state, w.week);
    r.t = sm.tramos.length; r.map = true;
    r.text = new Array(minWords(sm) + 1).join("palabra ");
    r.rub = sm.escribir.rubrica.map(function () { return true; });
    r.done = Date.now();
    return XP.tramo * sm.tramos.length + XP.mapa + XP.texto;
  }

  function attach(host) { H = host; }

  var api = { XP: XP, store: store, rec: rec, semDone: semDone, minWords: minWords, missions: missions, handles: handles, go: go,
              litCard: litCard, open: open, openDilema: openDilema, openPositions: openPositions, owns: owns, render: render, wire: wire,
              tutorPrompt: tutorPrompt, premOrder: premOrder, simulate: simulate, attach: attach, words: words,
              current: function () { return cur; } };
  if (typeof module === "object" && module.exports) module.exports = api;
  root.Seminario = api;
})(typeof window !== "undefined" ? window : globalThis);
