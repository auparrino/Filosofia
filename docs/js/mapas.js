/*
 * Mapas de preposiciones: dibujos del espacio y del movimiento.
 *
 * La lingüística cognitiva (Tyler & Evans 2003, «The Semantics of English
 * Prepositions»; Langacker) describe cada preposición como una escena: algo
 * que se ubica o se mueve (la figura, el punto de color) respecto de un
 * lugar de referencia (el fondo: una caja, una zona, una superficie, un
 * punto del mapa, la casa de alguien).  Ver la escena ayuda más que una
 * lista de traducciones, sobre todo donde el español corta distinto.
 *
 * El núcleo dibuja las escenas con unas pocas piezas (fondo × movimiento) y
 * no nombra ningún idioma: las escenas, los rótulos, los bloques de la
 * lección y los ejercicios «elegí la preposición mirando el dibujo» los
 * trae el paquete en window.MAPAS_DATA (docs/lang/<código>/mapas_data.js).
 *
 *   Mapas.svg(escena | id)          el dibujo, SVG en línea
 *   Mapas.figure(id | [ids], opts)  dibujos con su epígrafe (opts.bare: sin
 *                                   epígrafe, para los ejercicios)
 *   Mapas.install(course)           suma los bloques a la lección de la
 *                                   semana (MAPAS_DATA.week), una sola vez
 *
 * Los colores son tokens del tema (--mapa-tr, --mapa-lm…, en theme.css),
 * así el dibujo se ve igual de claro en modo claro y en oscuro.
 */
(function (root) {
  "use strict";

  var DATA = root.MAPAS_DATA || null;

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function mk(s) {
    return esc(s).replace(/\*\*([^*]+)\*\*/g, "<b>$1</b>").replace(/\*([^*]+)\*/g, '<i class="it">$1</i>');
  }
  function n(x) { return Math.round(x * 10) / 10; }

  /* ------------------------------------------------------------- piezas */

  var CY = 50;          // la línea del suelo del dibujo
  var TR_R = 7;         // el punto que se mueve o se ubica

  // The ground: where the figure sits.  Returns the svg and the spot where a
  // figure is «at» that ground, and the edges an arrow meets.
  function ground(kind, cx, label) {
    var s = "", at = { x: cx, y: CY }, left = cx - 34, right = cx + 34, ly = CY + 42;
    if (kind === "caja") {
      s = '<rect class="lm" x="' + (cx - 34) + '" y="' + (CY - 24) + '" width="68" height="50" rx="9"/>';
      at = { x: cx, y: CY + 2 };
    } else if (kind === "zona") {
      s = '<path class="lm zona" d="M' + (cx - 40) + " " + (CY + 4) + " C" + (cx - 44) + " " + (CY - 22) + " " + (cx - 12) + " " + (CY - 30) + " " +
        (cx + 8) + " " + (CY - 24) + " C" + (cx + 30) + " " + (CY - 30) + " " + (cx + 46) + " " + (CY - 12) + " " + (cx + 38) + " " + (CY + 8) +
        " C" + (cx + 32) + " " + (CY + 30) + " " + (cx - 2) + " " + (CY + 30) + " " + (cx - 16) + " " + (CY + 24) +
        " C" + (cx - 30) + " " + (CY + 22) + " " + (cx - 38) + " " + (CY + 16) + " " + (cx - 40) + " " + (CY + 4) + 'Z"/>';
      left = cx - 40; right = cx + 40; at = { x: cx, y: CY };
    } else if (kind === "superficie") {
      s = '<rect class="lm" x="' + (cx - 38) + '" y="' + (CY + 1) + '" width="76" height="8" rx="3"/>' +
        '<path class="leg" d="M' + (cx - 28) + " " + (CY + 9) + " V" + (CY + 30) + " M" + (cx + 28) + " " + (CY + 9) + " V" + (CY + 30) + '"/>';
      at = { x: cx, y: CY + 1 - TR_R - 1.5 }; left = cx - 38; right = cx + 38;
    } else if (kind === "punto") {
      s = '<circle class="lm" cx="' + cx + '" cy="' + CY + '" r="15"/><circle class="pin" cx="' + cx + '" cy="' + CY + '" r="3.5"/>';
      at = { x: cx, y: CY }; left = cx - 15; right = cx + 15; ly = CY + 34;
    } else if (kind === "casa") {
      s = '<path class="lm" d="M' + (cx - 30) + " " + (CY - 6) + " L" + cx + " " + (CY - 32) + " L" + (cx + 30) + " " + (CY - 6) +
        " V" + (CY + 26) + " H" + (cx - 30) + ' Z"/>' +
        // the person whose place it is
        '<circle class="pin" cx="' + (cx + 12) + '" cy="' + (CY + 1) + '" r="5"/>' +
        '<path class="pin" d="M' + (cx + 3) + " " + (CY + 24) + " Q" + (cx + 3) + " " + (CY + 8) + " " + (cx + 12) + " " + (CY + 8) +
        " Q" + (cx + 21) + " " + (CY + 8) + " " + (cx + 21) + " " + (CY + 24) + ' Z"/>';
      at = { x: cx - 11, y: CY + 12 }; left = cx - 30; right = cx + 30;
    }
    if (label) s += '<text class="lbl" x="' + cx + '" y="' + ly + '">' + esc(label) + "</text>";
    return { svg: s, at: at, left: left, right: right };
  }

  function dot(p, ghost) {
    return '<circle class="' + (ghost ? "ghost" : "tr") + '" cx="' + n(p.x) + '" cy="' + n(p.y) + '" r="' + TR_R + '"/>';
  }
  // An arrowhead at (x, y) pointing along angle a (radians).
  function head(x, y, a) {
    var L = 9, W = 5.5;
    var bx = x - Math.cos(a) * L, by = y - Math.sin(a) * L;
    var px = -Math.sin(a) * W, py = Math.cos(a) * W;
    return '<path class="head" d="M' + n(x) + " " + n(y) + " L" + n(bx + px) + " " + n(by + py) + " L" + n(bx - px) + " " + n(by - py) + ' Z"/>';
  }
  function line(x1, y1, x2, y2, cls) {
    return '<path class="mv' + (cls ? " " + cls : "") + '" d="M' + n(x1) + " " + n(y1) + " L" + n(x2) + " " + n(y2) + '"/>' +
      head(x2, y2, Math.atan2(y2 - y1, x2 - x1));
  }
  function curve(x1, y1, qx, qy, x2, y2, cls) {
    return '<path class="mv' + (cls ? " " + cls : "") + '" d="M' + n(x1) + " " + n(y1) + " Q" + n(qx) + " " + n(qy) + " " + n(x2) + " " + n(y2) + '"/>' +
      head(x2, y2, Math.atan2(y2 - qy, x2 - qx));
  }

  /* -------------------------------------------------------------- escenas */

  /* A scene: { lm: caja | zona | superficie | punto | casa,
                mov: "" (está) | hacia | idaVuelta | desde | por | rumbo | lazo,
                label: the ground's name, in the language (la casa, Roma…),
                alt: what the picture shows, in Spanish, for screen readers } */
  function draw(sc) {
    var mov = sc.mov || "", body = "", g;
    if (!mov) {
      g = ground(sc.lm, 100, sc.label);
      body = g.svg + dot(g.at);
    } else if (mov === "hacia" || mov === "idaVuelta") {
      g = ground(sc.lm, 146, sc.label);
      var start = { x: 26, y: CY };
      if (mov === "hacia") {
        body = g.svg + dot(start, true) + line(start.x + 11, CY, g.left - 5, CY) + dot(g.at);
      } else {
        // there and back: the figure ends where it started
        var mid = (start.x + g.left) / 2;
        body = g.svg + dot({ x: g.at.x, y: g.at.y }, true) +
          curve(start.x + 8, CY - 10, mid, CY - 38, g.left - 4, CY - 10) +
          curve(g.left - 4, CY + 10, mid, CY + 38, start.x + 8, CY + 10, "back") + dot(start);
      }
    } else if (mov === "desde") {
      g = ground(sc.lm, 54, sc.label);
      var end = { x: 176, y: CY };
      body = g.svg + dot(g.at, true) + line(g.right + 5, CY, end.x - 12, CY) + dot(end);
    } else if (mov === "por") {
      g = ground(sc.lm, 100, sc.label);
      body = g.svg + dot({ x: 18, y: CY }, true) + line(28, CY, 170, CY) + dot({ x: 182, y: CY });
    } else if (mov === "rumbo") {
      g = ground(sc.lm, 164, sc.label);
      // on the way: the figure left and heads there; the rest of the road is ahead
      body = g.svg + dot({ x: 18, y: CY }, true) + '<path class="mv" d="M28 ' + CY + ' L60 ' + CY + '"/>' + dot({ x: 70, y: CY }) +
        '<path class="mv ahead" d="M80 ' + CY + " L" + (g.left - 5) + " " + CY + '"/>' + head(g.left - 5, CY, 0);
    } else if (mov === "lazo") {
      // not a movement: where one belongs (sono di Roma, sou do Rio)
      g = ground(sc.lm, 58, sc.label);
      var me = { x: 160, y: CY };
      body = g.svg + '<path class="tie" d="M' + (g.right + 3) + " " + CY + " C" + (g.right + 30) + " " + (CY - 26) + " " + (me.x - 36) + " " + (CY - 26) + " " + (me.x - 9) + " " + CY + '"/>' +
        dot(me) + '<path class="heart" d="M' + me.x + " " + (CY - 12) + " c-2 -3 -7 -3 -7 1 c0 3 4 5 7 8 c3 -3 7 -5 7 -8 c0 -4 -5 -4 -7 -1 Z\" transform=\"translate(0 -8)\"/>";
    } else {
      g = ground(sc.lm, 100, sc.label);
      body = g.svg + dot(g.at);
    }
    return body;
  }

  function scene(id) {
    if (id && typeof id === "object") return id;
    return (DATA && DATA.scenes && DATA.scenes[id]) || null;
  }

  // What the picture shows, for screen readers (the scene may bring its own).
  var GROUND = { caja: "un lugar cerrado", zona: "una zona del mapa", superficie: "una superficie",
                 punto: "un punto del mapa", casa: "la casa de alguien" };
  function describe(sc) {
    var g = (GROUND[sc.lm] || "un lugar") + (sc.label ? " (" + sc.label + ")" : "");
    return ({ "": "Algo está en " + g, hacia: "Algo va hacia " + g + " y se queda",
              idaVuelta: "Algo va hasta " + g + " y vuelve", desde: "Algo sale de " + g,
              por: "Algo pasa a través de " + g, rumbo: "Algo salió con rumbo a " + g + ", todavía en camino",
              lazo: "Algo lejos de " + g + ", unido a ese lugar por un lazo: es de ahí" })[sc.mov || ""] || g;
  }

  function svg(id) {
    var sc = scene(id);
    if (!sc) return "";
    return '<svg class="mapa-svg" viewBox="0 0 200 104" role="img" aria-label="' + esc(sc.alt || describe(sc)) + '">' + draw(sc) + "</svg>";
  }

  // One or more scenes, each with its caption (the preposition, the example,
  // the Spanish); bare: only the picture (an exercise must not say the answer).
  function figure(ids, opts) {
    opts = opts || {};
    var list = Array.isArray(ids) ? ids : [ids];
    var figs = list.map(function (id) {
      var sc = scene(id);
      if (!sc) return "";
      var cap = opts.bare ? "" : '<figcaption>' + (sc.prep ? '<b class="mp-prep">' + esc(sc.prep) + "</b>" : "") +
        (sc.cap ? '<span class="mp-ex">' + mk(sc.cap) + "</span>" : "") +
        (sc.es ? '<small class="mp-es">' + esc(sc.es) + "</small>" : "") + "</figcaption>";
      return '<figure class="mapa">' + svg(sc) + cap + "</figure>";
    }).join("");
    return figs ? '<div class="mapas' + (list.length === 1 ? " one" : "") + (opts.bare ? " bare" : "") + '">' + figs + "</div>" : "";
  }

  /* ------------------------------------------------------ en la lección */

  // The blocks of MAPAS_DATA go at the end of the week's lesson, and into
  // its last part: the sessions already read keep their numbers.
  function install(course, data) {
    data = data || DATA;
    if (!course || !course.weeks || !data || !data.blocks || !data.blocks.length) return false;
    var w = course.weeks[(data.week || 0) - 1];
    if (!w || !w.lesson || !w.lesson.blocks) return false;
    if (w.lesson.blocks.some(function (b) { return b && b.mapa; })) return false;      // ya están
    var first = w.lesson.blocks.length;
    data.blocks.forEach(function (b) {
      var c = JSON.parse(JSON.stringify(b));
      c.mapa = true;
      w.lesson.blocks.push(c);
    });
    var idx = data.blocks.map(function (_, k) { return first + k; });
    [w.parts, w.lesson.parts].forEach(function (ps) {
      if (ps && ps.length) ps[ps.length - 1].blocks = ps[ps.length - 1].blocks.concat(idx);
    });
    return true;
  }

  // Every scene used by the blocks and their exercises (for the tests).
  function used(data) {
    data = data || DATA;
    var out = [];
    ((data && data.blocks) || []).forEach(function (b) {
      [].concat(b.fig || []).forEach(function (id) { out.push(id); });
      (b.qq || []).concat(b.q || []).forEach(function (q) { if (q.fig) out.push(q.fig); });
    });
    return out;
  }

  var api = { svg: svg, describe: describe, figure: figure, install: install, scene: scene, used: used, draw: draw,
              data: function () { return DATA; } };
  if (typeof module === "object" && module.exports) module.exports = api;
  root.Mapas = api;
})(typeof window !== "undefined" ? window : this);
