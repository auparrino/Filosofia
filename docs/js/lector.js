/*
 * Ágora — el lector: la app entera, de lectura y relectura.
 *
 * Pantallas (por el hash de la URL, así todo anda bajo cualquier carpeta):
 *   #inicio            seguir leyendo, lo que hay para repasar hoy, el avance
 *   #indice            las 9 estaciones con sus semanas
 *   #semana/N[/sec]    la semana N, para leer de corrido (sec: una sección)
 *   #repaso            las tarjetas que vencen hoy, para releer
 *   #glosario          todos los conceptos, con buscador
 *   #ajustes           tema, letra, copia del progreso
 *
 * Los datos salen de lang/es/data/ (los arma tools/curso/build_course.py):
 * course.json es el índice y estacion-N.json, las semanas de cada estación.
 * La lógica sin pantalla (el estado, la agenda, el buscador, la copia) está
 * en js/nucleo.js.  Todo se guarda en «agora.lector.v1».
 */
(function () {
  "use strict";
  var N = window.Nucleo;
  var APP_VERSION = "v0.3.0";
  var DATA = "lang/es/data/";
  var html = document.documentElement;
  var $app = document.getElementById("app");
  var $nav = document.getElementById("nav");
  var $donde = document.getElementById("donde");

  /* The storage: localStorage, or a stand-in in memory when it is blocked. */
  var store = (function () {
    try {
      var k = "agora.prueba";
      localStorage.setItem(k, "1");
      localStorage.removeItem(k);
      return localStorage;
    } catch (e) {
      var mem = {};
      return { getItem: function (k) { return k in mem ? mem[k] : null; },
               setItem: function (k, v) { mem[k] = String(v); }, removeItem: function (k) { delete mem[k]; } };
    }
  })();
  var S = N.cargar(store);
  function save() { N.guardar(store, S); }
  function hoy() { return N.dia(Date.now()); }

  var SECCIONES = [
    ["esencial", "Lo esencial"], ["leccion", "La lección"], ["texto", "El texto"], ["argumento", "El argumento"],
    ["lectura", "Una lectura posible"], ["caso", "Un caso"], ["conceptos", "Conceptos"], ["literatura", "Literatura"],
    ["final", "Terminé de leer"]
  ];
  var LETRAS = ["Chica", "Normal", "Grande", "Muy grande"];

  // ------------------------------------------------------------------ texto
  function esc(s) {
    return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }
  /* The content's marks: ***x***, **x** (bold) and *x* (italics). */
  function md(s) {
    return esc(s)
      .replace(/\*\*\*([^*]+?)\*\*\*/g, "<strong><em>$1</em></strong>")
      .replace(/\*\*((?:[^*]|\*[^*]+\*)+?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*([^*\n]+?)\*/g, "<em>$1</em>");
  }
  function parrafos(s, cls) {
    return String(s || "").split(/\n+/).filter(function (p) { return p.trim(); }).map(function (p) {
      return "<p" + (cls ? ' class="' + cls + '"' : "") + ">" + md(p) + "</p>";
    }).join("");
  }
  function anio(a) { return a < 0 ? -a + " a. C." : String(a); }
  function plural(n, uno, varios) { return n + " " + (n === 1 ? uno : varios); }

  // ------------------------------------------------------------------ datos
  var indice = null, estaciones = {};
  function getJSON(f) {
    return fetch(DATA + f).then(function (r) {
      if (!r.ok) throw new Error("No se pudo cargar " + f + " (" + r.status + ")");
      return r.json();
    });
  }
  function cargarIndice() {
    if (!indice) indice = getJSON("course.json");
    return indice;
  }
  function estacion(n) {
    if (!estaciones[n]) {
      estaciones[n] = cargarIndice().then(function (ix) {
        var s = ix.seasons.filter(function (x) { return x.n === n; })[0];
        if (!s) throw new Error("No hay estación " + n);
        return getJSON(s.file);
      }).catch(function (e) { delete estaciones[n]; throw e; });
    }
    return estaciones[n];
  }
  function infoSemana(ix, n) { return ix.weeks.filter(function (w) { return w.week === n; })[0] || null; }
  function semana(n) {
    return cargarIndice().then(function (ix) {
      var w = infoSemana(ix, n);
      if (!w) return null;
      return estacion(w.season).then(function (st) {
        return st.weeks.filter(function (x) { return x.week === n; })[0] || null;
      });
    });
  }
  function todas() {
    return cargarIndice().then(function (ix) {
      return Promise.all(ix.seasons.map(function (s) { return estacion(s.n); }));
    });
  }
  function eraDe(ix, n) { return ix.eras.filter(function (e) { return e.n === n; })[0]; }
  function estacionDe(ix, n) { return ix.seasons.filter(function (s) { return s.n === n; })[0]; }

  // ------------------------------------------------------------------ época y ajustes
  var eraURL = (/[?&]era=([1-8])\b/.exec(location.search) || [])[1];
  function pintarEra(n) { html.setAttribute("data-era", eraURL || String(n || 1)); }
  function aplicarAjustes() {
    var t = S.ajustes.tema;
    if (t === "claro") html.setAttribute("data-theme", "light");
    else if (t === "oscuro") html.setAttribute("data-theme", "dark");
    else html.removeAttribute("data-theme");
    html.setAttribute("data-letra", String(S.ajustes.letra));
  }
  /* The last week marked as read (the latest day; on a tie, the highest). */
  function ultimaLeida() {
    var best = null;
    Object.keys(S.leidas).forEach(function (k) {
      var w = +k, d = S.leidas[k];
      if (best == null || d > S.leidas[best] || (d === S.leidas[best] && w > best)) best = w;
    });
    return best;
  }
  function cuantasLeidas() { return Object.keys(S.leidas).length; }

  // ------------------------------------------------------------------ navegación
  var NAV = [
    ["inicio", "Inicio", '<path d="M3 11 12 4l9 7v9h-6v-6H9v6H3z"/>'],
    ["indice", "Índice", '<path d="M4 6h16M4 12h16M4 18h10"/>'],
    ["repaso", "Repaso", '<path d="M4 12a8 8 0 1 0 2.4-5.7M4 4v4h4"/>'],
    ["glosario", "Glosario", '<path d="M5 4h11a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3zM5 17a3 3 0 0 1 3-3h11"/>'],
    ["ajustes", "Ajustes", '<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1 7 17M17 7l2.1-2.1"/>']
  ];
  function pintarNav(actual) {
    var n = N.paraHoy(S, hoy()).length;
    $nav.innerHTML = "<ul>" + NAV.map(function (x) {
      var badge = x[0] === "repaso" && n ? '<span class="badge" aria-label="' + plural(n, "tarjeta", "tarjetas") + ' para hoy">' + n + "</span>" : "";
      return '<li><a href="#' + x[0] + '"' + (x[0] === actual ? ' aria-current="page"' : "") + ">" +
        '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">' + x[2] + "</svg>" +
        "<span>" + x[1] + "</span>" + badge + "</a></li>";
    }).join("") + "</ul>";
  }

  function ruta() {
    var h = decodeURIComponent((location.hash || "").replace(/^#\/?/, ""));
    var p = h.split("/");
    return { pantalla: p[0] || "inicio", n: parseInt(p[1], 10), sec: p[2] || "" };
  }

  var salir = null;          // what the current screen does when it is left
  var turno = 0;             // so a slow screen does not draw over a newer one
  function render() {
    if (salir) { salir(); salir = null; }
    var r = ruta(), t = ++turno;
    var pant = { inicio: inicio, indice: verIndice, semana: verSemana, repaso: verRepaso, glosario: verGlosario,
                 ajustes: verAjustes }[r.pantalla] || inicio;
    pintarNav(r.pantalla === "semana" ? "indice" : (pant === inicio ? "inicio" : r.pantalla));
    $donde.textContent = "";
    Promise.resolve().then(function () { return pant(r, t); }).catch(function (e) {
      if (t !== turno) return;
      $app.innerHTML = '<section class="card"><h1 tabindex="-1">No se pudo abrir</h1><p>' + esc(e.message) +
        '</p><p>Revisá la conexión y probá de nuevo. Lo que ya abriste una vez se puede leer sin internet.</p>' +
        '<p><a class="btn" href="#inicio">Volver al inicio</a></p></section>';
      enfocar();
    });
  }
  function enfocar() {
    var h = $app.querySelector("h1");
    if (h) h.focus({ preventScroll: true });
  }
  function mostrar(t, htmlStr, era) {
    if (t !== turno) return false;
    pintarEra(era);
    $app.innerHTML = htmlStr;
    window.scrollTo(0, 0);
    return true;
  }

  // ------------------------------------------------------------------ inicio
  function inicio(r, t) {
    return cargarIndice().then(function (ix) {
      var d = S.donde, objetivo = null, modo;
      if (d && infoSemana(ix, d.semana) && S.leidas[d.semana] == null) { objetivo = d.semana; modo = "seguir"; }
      else {
        var desde = d ? d.semana : 0;
        var sig = ix.weeks.filter(function (w) { return w.week > desde && S.leidas[w.week] == null; })[0] ||
                  ix.weeks.filter(function (w) { return S.leidas[w.week] == null; })[0];
        if (sig) { objetivo = sig.week; modo = cuantasLeidas() || d ? "siguiente" : "empezar"; }
      }
      var ult = ultimaLeida();
      var base = infoSemana(ix, ult || objetivo || 1) || ix.weeks[0];
      var est = estacionDe(ix, base.season), era = eraDe(ix, base.era);
      S.era = base.era;
      save();
      var nHoy = N.paraHoy(S, hoy()).length, prox = N.proxima(S, hoy());
      var leidas = cuantasLeidas(), total = ix.nweeks;
      var out = '<h1 tabindex="-1" class="portada">Ágora</h1>' +
        '<p class="lead">La historia de la filosofía para leer con calma: ' + total + " semanas, de los presocráticos a hoy.</p>";
      if (objetivo) {
        var w = infoSemana(ix, objetivo);
        var secLabel = modo === "seguir" && d.sec ? (SECCIONES.filter(function (s) { return s[0] === d.sec; })[0] || [])[1] : null;
        out += '<section class="card destacada" aria-labelledby="h-seguir"><h2 id="h-seguir">' +
          (modo === "seguir" ? "Seguir leyendo" : modo === "empezar" ? "Para empezar" : "Para leer ahora") + "</h2>" +
          '<p class="sobre">Semana ' + w.week + "</p>" +
          '<p class="titulo-semana">' + md(w.title) + "</p>" +
          (secLabel ? '<p class="muted">Ibas por: <strong>' + esc(secLabel) + "</strong></p>" : "") +
          '<p><a class="btn principal" href="#semana/' + w.week + '">' +
          (modo === "seguir" ? "Seguir leyendo" : modo === "empezar" ? "Empezar a leer" : "Leer la semana " + w.week) +
          "</a></p></section>";
      } else {
        out += '<section class="card destacada"><h2>Leíste todo el curso</h2><p>Las ' + total +
          " semanas están leídas. Lo que queda es el repaso y volver a las que quieras desde el índice.</p></section>";
      }
      out += '<section class="card" aria-labelledby="h-repaso"><h2 id="h-repaso">Para repasar hoy</h2>' +
        (nHoy ? "<p>Tenés <strong>" + plural(nHoy, "tarjeta", "tarjetas") + "</strong> para releer.</p>" +
                '<p><a class="btn" href="#repaso">Repasar</a></p>'
              : "<p>Nada para releer hoy." + (prox != null ? " Lo próximo vuelve el " + N.fecha(prox) + "." :
                 " Cuando termines de leer una semana, su resumen y sus conceptos vuelven a los pocos días para releerlos.") + "</p>") +
        "</section>";
      out += '<section class="card" aria-labelledby="h-vas"><h2 id="h-vas">Dónde vas</h2>' +
        '<p><span class="etq">Estación ' + est.n + "</span> " + md(est.name) + "</p>" +
        '<p><span class="etq">Época</span> ' + esc(era.name) + " (semanas " + era.weeks[0] + " a " + era.weeks[1] + ")</p>" +
        "</section>";
      var pct = Math.round(100 * leidas / total);
      out += '<section class="card" aria-labelledby="h-avance"><h2 id="h-avance">Tu avance</h2>' +
        '<div class="progreso" role="progressbar" aria-label="Semanas leídas" aria-valuemin="0" aria-valuemax="' + total +
        '" aria-valuenow="' + leidas + '"><i style="width:' + pct + '%"></i></div>' +
        "<p>Leíste <strong>" + leidas + " de " + total + "</strong> semanas.</p>" +
        '<p><a href="#indice">Ver el índice</a></p></section>';
      if (mostrar(t, out, base.era)) enfocar();
    });
  }

  // ------------------------------------------------------------------ índice
  function verIndice(r, t) {
    return cargarIndice().then(function (ix) {
      var out = '<h1 tabindex="-1">Índice</h1><p class="lead">' + ix.nweeks + " semanas en " + ix.seasons.length +
        " estaciones. Conviene leerlas en orden, pero podés abrir cualquiera.</p>" +
        '<nav class="saltos" aria-label="Ir a una estación"><ul>' + ix.seasons.map(function (s) {
          return '<li><button type="button" class="chip" data-ir="est-' + s.n + '">' + s.n + "</button></li>";
        }).join("") + "</ul></nav>";
      out += ix.seasons.map(function (s) {
        var ws = ix.weeks.filter(function (w) { return w.season === s.n; });
        var leidas = ws.filter(function (w) { return S.leidas[w.week] != null; }).length;
        return '<section class="estacion" id="est-' + s.n + '" aria-labelledby="h-est-' + s.n + '">' +
          '<h2 id="h-est-' + s.n + '"><span class="sobre">Estación ' + s.n + "</span> " + md(s.name) + "</h2>" +
          '<p class="muted">Semanas ' + s.weeks[0] + " a " + s.weeks[1] + " · leídas " + leidas + " de " + ws.length + "</p>" +
          '<ol class="semanas">' + ws.map(function (w) {
            var ok = S.leidas[w.week] != null;
            return "<li><a class=\"fila" + (w.repaso ? " es-repaso" : "") + "\" href=\"#semana/" + w.week + "\">" +
              '<span class="num">' + w.week + "</span>" +
              '<span class="tit">' + md(w.title) +
              (w.rama.length ? "<small>" + esc(w.rama.join(" · ")) + "</small>" : "<small>" + esc(w.tema) + "</small>") + "</span>" +
              (ok ? '<span class="ok" role="img" aria-label="leída">✓</span>' : '<span class="ok" aria-hidden="true"></span>') +
              "</a></li>";
          }).join("") + "</ol></section>";
      }).join("");
      if (!mostrar(t, out, S.era)) return;
      $app.querySelectorAll("[data-ir]").forEach(function (b) {
        b.addEventListener("click", function () {
          var el = document.getElementById(b.getAttribute("data-ir"));
          if (el) { el.scrollIntoView(); var h = el.querySelector("h2"); if (h) { h.tabIndex = -1; h.focus({ preventScroll: true }); } }
        });
      });
      enfocar();
    });
  }

  // ------------------------------------------------------------------ una semana
  function bloque(b) {
    var out = '<div class="bloque"><h4>' + md(b.h) + "</h4>" + parrafos(b.r);
    if (b.table) {
      out += '<div class="tabla" role="region" tabindex="0" aria-label="Tabla: ' + esc(b.h.replace(/\*/g, "")) + '"><table>' +
        (b.table.head ? "<thead><tr>" + b.table.head.map(function (c) { return '<th scope="col">' + md(c) + "</th>"; }).join("") + "</tr></thead>" : "") +
        "<tbody>" + b.table.rows.map(function (row) {
          return "<tr>" + row.map(function (c) { return "<td>" + md(c) + "</td>"; }).join("") + "</tr>";
        }).join("") + "</tbody></table></div>";
    }
    (b.ex || []).forEach(function (e) {
      var cita = /^\s*«/.test(e[0]);
      out += '<figure class="' + (cita ? "cita" : "ejemplo") + '">' +
        (cita ? "<blockquote><p>" + md(e[0]) + "</p></blockquote>" : '<p class="ej-t">' + md(e[0]) + "</p>") +
        (e[1] ? "<figcaption>" + md(e[1]) + "</figcaption>" : "") + "</figure>";
    });
    if (b.warn) out += '<aside class="ojo"><p><strong>Ojo.</strong> ' + md(b.warn) + "</p></aside>";
    if (b.tip) out += '<aside class="dato"><p><strong>Fijate.</strong> ' + md(b.tip) + "</p></aside>";
    if (b.more && b.more.length) out += '<aside class="mas">' + b.more.map(function (m) { return "<p>" + md(m) + "</p>"; }).join("") + "</aside>";
    return out + "</div>";
  }

  function seccion(id, titulo, cuerpo) {
    return '<section class="sec" id="sec-' + id + '" aria-labelledby="h-' + id + '"><h2 id="h-' + id + '">' + titulo + "</h2>" + cuerpo + "</section>";
  }

  function cuerpoSemana(w) {
    var secs = [];
    secs.push(["esencial", '<p class="lead">' + md(w.focus) + '</p><ul class="claves">' +
      w.keys.map(function (k) { return "<li>" + md(k) + "</li>"; }).join("") + "</ul>"]);
    secs.push(["leccion", parrafos(w.lesson.intro, "intro") + w.lesson.parts.map(function (p, i) {
      return '<div class="parte"><h3><span class="sobre">Parte ' + (i + 1) + "</span> " + md(p.h) + "</h3>" +
        p.blocks.map(bloque).join("") + "</div>";
    }).join("")]);
    var sm = w.seminario;
    if (sm) {
      var derechos = sm.derechos === "dp"
        ? "Texto de dominio público, " + (sm.traduccion === "resumen" ? "contado en nuestras palabras." : "en traducción propia, abreviada donde hace falta.")
        : "El texto no es de dominio público: va contado en nuestras palabras, con citas textuales breves entre comillas.";
      secs.push(["texto",
        '<p class="fuente"><strong>' + md(sm.autor) + "</strong>, <cite>" + md(sm.obra) + "</cite>, " + md(sm.pasaje) + "</p>" +
        parrafos(sm.contexto, "contexto") + '<p class="aviso">' + esc(derechos) + "</p>" +
        sm.tramos.map(function (tr, i) {
          return '<div class="tramo"><h3><span class="sobre">Tramo ' + (i + 1) + " de " + sm.tramos.length + "</span></h3>" +
            '<div class="texto-fuente">' + parrafos(tr.texto) + "</div>" +
            (tr.glosas && tr.glosas.length ? '<aside class="glosas" aria-label="Notas del tramo ' + (i + 1) + '"><h4>Notas</h4><dl>' +
              tr.glosas.map(function (g) { return "<div><dt>" + md(g[0]) + "</dt><dd>" + md(g[1]) + "</dd></div>"; }).join("") +
              "</dl></aside>" : "") + "</div>";
        }).join("")]);
      var mp = sm.mapa;
      secs.push(["argumento",
        '<p class="muted">El argumento central del texto, paso a paso: las premisas, en orden, llevan a la conclusión.</p>' +
        '<ol class="premisas">' + mp.premisas.map(function (p) { return "<li>" + md(p) + "</li>"; }).join("") + "</ol>" +
        (mp.implicita ? '<p class="implicita"><span class="etq">La premisa que no se dice</span> ' + md(mp.implicita) + "</p>" : "") +
        '<p class="conclusion"><span class="etq">Por lo tanto</span> ' + md(mp.conclusion) + "</p>" +
        '<div class="debate"><div class="objecion"><h3>La objeción</h3>' + parrafos(mp.objecion) + "</div>" +
        '<div class="replica"><h3>La réplica</h3>' + parrafos(mp.replica) + "</div></div>"]);
      if (sm.modelo) {
        secs.push(["lectura", '<p class="muted">Una manera de tomar posición frente al texto, con sus razones. No es la única.</p>' +
          '<div class="modelo">' + parrafos(sm.modelo) + "</div>"]);
      }
    }
    if (w.dilemas && w.dilemas.length) {
      secs.push(["caso", w.dilemas.map(function (d, i) {
        return '<div class="caso">' + (w.dilemas.length > 1 ? '<h3><span class="sobre">Caso ' + (i + 1) + "</span></h3>" : "") +
          parrafos(d.caso) +
          '<p class="muted">Las posiciones posibles, quién las sostendría y qué tienen que responder:</p>' +
          '<div class="posiciones">' + d.opciones.map(function (o) {
            return '<article class="posicion"><h4>' + md(o.texto) + "</h4>" +
              '<p><span class="etq">Quién</span> ' + md(o.escuela) + "</p>" +
              '<p><span class="etq">Por qué</span> ' + md(o.porque) + "</p>" +
              '<p><span class="etq">La objeción</span> ' + md(o.objecion) + "</p></article>";
          }).join("") + "</div>" +
          (d.despues ? '<p class="despues"><strong>Una vuelta más.</strong> ' + md(d.despues) + "</p>" : "") + "</div>";
      }).join("")]);
    }
    if (w.vocab && w.vocab.length) {
      secs.push(["conceptos", '<dl class="conceptos">' + w.vocab.map(function (v, i) {
        return '<div class="concepto" id="c-' + w.week + "-" + i + '"><dt>' + md(v[0]) + "</dt><dd>" +
          "<p>" + md(v[1]) + "</p>" + '<p class="ej">' + md(v[2]) + "</p>" +
          '<p class="nc"><span class="etq">No confundir</span> ' + md(v[3]) + "</p></dd></div>";
      }).join("") + "</dl>"]);
    }
    if (w.literatura && w.literatura.length) {
      secs.push(["literatura", '<p class="muted">Ficción, poesía y teatro donde aparecen las ideas de la semana.</p><ul class="obras">' +
        w.literatura.map(function (o) {
          return "<li><p><strong>" + md(o.autor) + "</strong>, <cite>" + md(o.obra) + "</cite> <span class=\"muted\">(" +
            esc(anio(o.año)) + ", " + esc(o.tipo) + ")</span>" + (o.dp ? ' <span class="sello">dominio público</span>' : "") +
            "</p><p>" + md(o.por_que) + "</p></li>";
        }).join("") + "</ul>"]);
    }
    return secs;
  }

  function cuerpoRepaso(w, st) {
    var secs = [["esencial", parrafos(w.intro, "lead")]];
    w.semanas.forEach(function (n) {
      var x = st.weeks.filter(function (y) { return y.week === n; })[0];
      if (!x) return;
      secs.push(["r" + n, '<p class="lead">' + md(x.focus) + '</p><ul class="claves">' +
        x.keys.map(function (k) { return "<li>" + md(k) + "</li>"; }).join("") + "</ul>" +
        '<p><a class="btn sec" href="#semana/' + n + '">Abrir la semana ' + n + "</a></p>", "Semana " + n + " · " + x.title]);
    });
    return secs;
  }

  function finalHTML(w) {
    var d = S.leidas[w.week];
    if (d != null) {
      return '<p class="hecho" role="status">✓ La terminaste de leer el ' + N.fecha(d) + "." +
        (w.repaso ? "" : " Lo esencial y los conceptos vuelven a aparecer en Repaso para releerlos.") + "</p>";
    }
    return '<p><button type="button" class="btn principal" id="termine">Terminé de leer</button></p>' +
      '<p class="muted">' + (w.repaso ? "La marca como leída."
        : "La marca como leída y agenda su repaso: lo esencial y cada concepto vuelven a +1, +7, +30 y +90 días para releerlos.") + "</p>";
  }

  function verSemana(r, t) {
    var n = r.n;
    return cargarIndice().then(function (ix) {
      return semana(n).then(function (w) {
        if (!w) {
          mostrar(t, '<section class="card"><h1 tabindex="-1">Esa semana no está</h1><p>El curso tiene ' + ix.nweeks +
            ' semanas.</p><p><a class="btn" href="#indice">Ir al índice</a></p></section>', S.era);
          enfocar();
          return;
        }
        return (w.repaso ? estacion(w.season) : Promise.resolve(null)).then(function (st) {
          dibujarSemana(ix, w, st, r, t);
        });
      });
    });
  }

  function dibujarSemana(ix, w, st, r, t) {
    var est = estacionDe(ix, w.season), era = eraDe(ix, w.era);
    var secs = w.repaso ? cuerpoRepaso(w, st) : cuerpoSemana(w);
    var nombres = {};
    SECCIONES.forEach(function (s) { nombres[s[0]] = s[1]; });
    secs.push(["final", finalHTML(w)]);
    var titulo = function (s) { return s[2] ? md(s[2]) : (s[0] === "esencial" && w.repaso ? "Lo que repasa" : nombres[s[0]]); };
    var corto = function (s) {
      if (/^r\d+$/.test(s[0])) return "Semana " + s[0].slice(1);
      return s[0] === "esencial" && w.repaso ? "Lo que repasa" : nombres[s[0]];
    };
    var prev = infoSemana(ix, w.week - 1), next = infoSemana(ix, w.week + 1);
    var out = '<article class="semana' + (w.repaso ? " repaso-estacion" : "") + '">' +
      '<header class="sem-cab"><p class="sobre">Semana ' + w.week + " de " + ix.nweeks + " · Estación " + est.n + "</p>" +
      '<h1 tabindex="-1">' + md(w.title) + "</h1>" +
      (w.rama.length ? '<p class="ramas">' + esc(w.rama.join(" · ")) + "</p>" : "") +
      '<p class="muted">' + md(est.name) + " · " + esc(era.name) + "</p></header>" +
      '<nav class="toc" aria-label="Secciones de la semana"><ul>' + secs.map(function (s) {
        return '<li><button type="button" data-ir="' + s[0] + '">' + esc(corto(s)) + "</button></li>";
      }).join("") + "</ul></nav>" +
      secs.map(function (s) { return seccion(s[0], titulo(s), s[1]); }).join("") +
      '<nav class="vecinas" aria-label="Otras semanas">' +
      (prev ? '<a href="#semana/' + prev.week + '" rel="prev">← Semana ' + prev.week + "</a>" : "<span></span>") +
      (next ? '<a href="#semana/' + next.week + '" rel="next">Semana ' + next.week + " →</a>" : "<span></span>") +
      "</nav></article>";
    if (!mostrar(t, out, w.era)) return;
    $donde.textContent = "Semana " + w.week;

    var ids = secs.map(function (s) { return s[0]; });
    var botones = $app.querySelectorAll(".toc button");
    function ir(id) {
      var el = document.getElementById("sec-" + id) || document.getElementById(id);
      if (!el) return;
      el.scrollIntoView();
      if (el.classList.contains("concepto")) el.classList.add("destino");
      var h = el.querySelector("h2") || el;
      if (h.tabIndex < 0 && !h.hasAttribute("tabindex")) h.tabIndex = -1;
      h.focus({ preventScroll: true });
    }
    botones.forEach(function (b) { b.addEventListener("click", function () { ir(b.getAttribute("data-ir")); }); });

    // where it was left: the section and the scroll
    function actual() {
      var cur = ids[0];
      ids.forEach(function (id) {
        var el = document.getElementById("sec-" + id);
        if (el && el.getBoundingClientRect().top < 160) cur = id;
      });
      return cur;
    }
    function marcarToc(cur) {
      botones.forEach(function (b) {
        if (b.getAttribute("data-ir") === cur) b.setAttribute("aria-current", "true"); else b.removeAttribute("aria-current");
      });
    }
    var timer = null;
    // the place is kept as the section and how far into it (dy), so it
    // survives a change of font or of letter size; y, as a fallback
    function recordar() {
      var cur = actual(), y = Math.round(window.scrollY);
      var el = document.getElementById("sec-" + cur);
      var dy = el ? Math.round(-el.getBoundingClientRect().top) : 0;
      marcarToc(cur);
      S.pos[w.week] = { sec: cur, dy: dy, y: y };
      S.donde = { semana: w.week, sec: cur, y: y };
      save();
    }
    function volver(p) {
      var el = p.sec && document.getElementById("sec-" + p.sec);
      if (el && p.dy != null) window.scrollTo(0, Math.max(0, el.getBoundingClientRect().top + window.scrollY + p.dy));
      else window.scrollTo(0, p.y || 0);
    }
    var tocado = false;
    function toca() { tocado = true; }
    ["touchstart", "wheel", "keydown", "mousedown"].forEach(function (ev) { window.addEventListener(ev, toca, { passive: true }); });
    function onScroll() {
      if (timer) return;
      timer = setTimeout(function () { timer = null; recordar(); }, 200);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    salir = function () {
      window.removeEventListener("scroll", onScroll);
      ["touchstart", "wheel", "keydown", "mousedown"].forEach(function (ev) { window.removeEventListener(ev, toca); });
      if (timer) { clearTimeout(timer); timer = null; recordar(); }
    };

    var termine = document.getElementById("termine");
    if (termine) termine.addEventListener("click", function () { terminar(w); });

    // open where it was left (or at the section of the address)
    var pos = S.pos[w.week];
    if (r.sec) ir(r.sec);
    else if (pos && (pos.y || pos.dy)) {
      volver(pos);
      // the fonts may arrive later and move the text: once more, if the reader did not move
      if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(function () { if (t === turno && !tocado) volver(pos); });
      }
    } else window.scrollTo(0, 0);
    if (!r.sec) enfocar();
    S.donde = { semana: w.week, sec: (pos && !r.sec && pos.sec) || r.sec || "esencial", y: Math.round(window.scrollY) };
    save();
    marcarToc(actual());
  }

  function terminar(w) {
    N.marcarLeida(S, w.week, (w.vocab || []).map(function (v) { return v[0]; }), hoy(), !!w.repaso);
    S.era = w.era;
    save();
    var box = document.getElementById("sec-final");
    if (box) {
      box.innerHTML = '<h2 id="h-final" tabindex="-1">Terminé de leer</h2>' + finalHTML(w) + siguienteHTML(w.week);
      document.getElementById("h-final").focus({ preventScroll: true });
    }
    pintarNav("indice");
  }
  function siguienteHTML(n) {
    return '<p><a class="btn sec" href="#semana/' + (n + 1) + '" data-sig>Leer la semana ' + (n + 1) + "</a> " +
      '<a class="btn sec" href="#inicio">Ir al inicio</a></p>';
  }

  // ------------------------------------------------------------------ repaso
  function verRepaso(r, t) {
    var lista = N.paraHoy(S, hoy());
    var semanas = {};
    lista.forEach(function (c) { semanas[c.w] = 1; });
    return cargarIndice().then(function (ix) {
      return Promise.all(Object.keys(semanas).map(function (n) { return semana(+n); })).then(function (ws) {
        var porN = {};
        ws.forEach(function (w) { if (w) porN[w.week] = w; });
        // cards whose week or concept is no longer in the course go
        var antes = Object.keys(S.tarjetas).length;
        N.limpiar(S, function (id, c) {
          if (!semanas[c.w]) return true;
          var w = porN[c.w];
          if (!w || w.repaso) return false;
          return c.t === "s" || w.vocab.some(function (v) { return v[0] === c.term; });
        });
        if (Object.keys(S.tarjetas).length !== antes) { save(); lista = N.paraHoy(S, hoy()); }
        var out = '<h1 tabindex="-1">Repaso</h1>' +
          '<p class="lead">Lo que leíste vuelve para releerlo: primero lo más viejo. «Releído» lo manda más adelante (a los 7 días, después a los 30, a los 90 y cada 180).</p>' +
          '<p class="muted" id="quedan" role="status">' + quedan(lista.length) + "</p>" +
          '<div class="tarjetas">' + lista.map(function (c) { return tarjetaHTML(c, porN[c.w], ix); }).join("") + "</div>" +
          '<div id="vacio">' + (lista.length ? "" : vacioHTML()) + "</div>";
        if (!mostrar(t, out, S.era)) return;
        $app.querySelectorAll("[data-releido]").forEach(function (b) {
          b.addEventListener("click", function () { releer(b); });
        });
        enfocar();
      });
    });
  }
  function quedan(n) {
    return n ? "Para hoy: " + plural(n, "tarjeta", "tarjetas") + "." : "";
  }
  function vacioHTML() {
    var prox = N.proxima(S, hoy());
    var hechas = S.hechas.dia === hoy() ? S.hechas.n : 0;
    var tope = hechas >= N.TOPE && N.vencidas(S, hoy()).length;
    return '<section class="card vacio"><h2>Nada más para hoy</h2><p>' +
      (tope ? "Ya releíste " + hechas + " tarjetas hoy, el máximo por día. Las que faltan siguen mañana."
        : !Object.keys(S.tarjetas).length ? "Todavía no hay tarjetas. Cuando termines de leer una semana, su resumen y sus conceptos vuelven acá para releerlos."
        : "Releíste todo lo que vencía." + (prox != null ? " Lo próximo vuelve el " + N.fecha(prox) + "." : "")) +
      '</p><p><a class="btn sec" href="#inicio">Ir al inicio</a></p></section>';
  }
  function tarjetaHTML(c, w, ix) {
    if (!w) return "";
    var cuerpo;
    if (c.t === "s") {
      cuerpo = '<p class="sobre">Semana ' + w.week + " · Lo esencial</p><h2>" + md(w.title) + "</h2>" +
        '<ul class="claves">' + w.keys.map(function (k) { return "<li>" + md(k) + "</li>"; }).join("") + "</ul>";
    } else {
      var v = w.vocab.filter(function (x) { return x[0] === c.term; })[0];
      if (!v) return "";
      cuerpo = '<p class="sobre">Semana ' + w.week + " · Concepto</p><h2>" + md(v[0]) + "</h2>" +
        "<p>" + md(v[1]) + "</p>" + '<p class="ej">' + md(v[2]) + "</p>" +
        '<p class="nc"><span class="etq">No confundir</span> ' + md(v[3]) + "</p>";
    }
    return '<article class="card tarjeta" data-id="' + esc(c.id) + '">' + cuerpo +
      '<div class="acciones"><button type="button" class="btn principal" data-releido="' + esc(c.id) + '">Releído</button>' +
      '<a class="btn sec" href="#semana/' + w.week + (c.t === "c" ? "/c-" + w.week + "-" + c.o : "") + '">Releer la semana</a></div></article>';
  }
  function releer(b) {
    var id = b.getAttribute("data-releido");
    N.releida(S, id, hoy());
    save();
    var card = b.closest(".tarjeta"), c = S.tarjetas[id];
    if (card && c) {
      card.classList.add("releida");
      card.innerHTML = '<p class="hecho">✓ Releída. Vuelve el ' + N.fecha(c.vence) + ".</p>";
    }
    var pend = $app.querySelectorAll(".tarjeta:not(.releida)").length;
    document.getElementById("quedan").textContent = quedan(pend);
    if (!pend) document.getElementById("vacio").innerHTML = vacioHTML();
    pintarNav("repaso");
  }

  // ------------------------------------------------------------------ glosario
  var glosario = null;
  function entradas() {
    if (!glosario) {
      glosario = todas().then(function (sts) {
        var out = [];
        sts.forEach(function (st) {
          st.weeks.forEach(function (w) {
            (w.vocab || []).forEach(function (v, i) {
              out.push({ term: v[0], def: v[1], ex: v[2], nc: v[3], w: w.week, title: w.title, i: i,
                         k: N.norm(v[0].replace(/\*/g, "")), kd: N.norm(v[1]) });
            });
          });
        });
        out.sort(function (a, b) { return a.k < b.k ? -1 : a.k > b.k ? 1 : a.w - b.w; });
        return out;
      }).catch(function (e) { glosario = null; throw e; });
    }
    return glosario;
  }
  function verGlosario(r, t) {
    return entradas().then(function (all) {
      var out = '<h1 tabindex="-1">Glosario</h1>' +
        '<p class="lead">Los ' + all.length + " conceptos del curso, cada uno con su semana.</p>" +
        '<div class="buscador"><label for="buscar">Buscar un concepto</label>' +
        '<input type="search" id="buscar" autocomplete="off" spellcheck="false" placeholder="Por ejemplo: logos, virtud, a priori"></div>' +
        '<p class="muted" id="cuantos" role="status" aria-live="polite"></p><ul class="glosario" id="lista"></ul>';
      if (!mostrar(t, out, S.era)) return;
      var input = document.getElementById("buscar"), lista = document.getElementById("lista"), cuantos = document.getElementById("cuantos");
      function pintar() {
        var q = input.value, res = N.buscar(all, q);
        cuantos.textContent = q.trim() ? (res.length ? plural(res.length, "concepto", "conceptos") + " para «" + q.trim() + "»."
          : "Ningún concepto para «" + q.trim() + "».") : plural(all.length, "concepto", "conceptos") + ", de la A a la Z.";
        lista.innerHTML = res.map(function (e) {
          return "<li><details><summary><span class=\"t\">" + md(e.term) + '</span> <span class="w">semana ' + e.w + "</span></summary>" +
            "<p>" + md(e.def) + "</p>" + '<p class="ej">' + md(e.ex) + "</p>" +
            '<p class="nc"><span class="etq">No confundir</span> ' + md(e.nc) + "</p>" +
            '<p><a href="#semana/' + e.w + "/c-" + e.w + "-" + e.i + '">Ir a la semana ' + e.w + ": " + md(e.title) + "</a></p></details></li>";
        }).join("");
      }
      var tm = null;
      input.addEventListener("input", function () { clearTimeout(tm); tm = setTimeout(pintar, 120); });
      pintar();
      enfocar();
    });
  }

  // ------------------------------------------------------------------ ajustes
  var aviso = null;          // [id, text]: what the settings say after redrawing
  function verAjustes(r, t) {
    var tema = S.ajustes.tema, letra = S.ajustes.letra;
    var radio = function (name, val, label, on) {
      return '<label class="opcion"><input type="radio" name="' + name + '" value="' + val + '"' + (on ? " checked" : "") + "> " + label + "</label>";
    };
    var leidas = cuantasLeidas(), tarjetas = Object.keys(S.tarjetas).length;
    var out = '<h1 tabindex="-1">Ajustes</h1>' +
      '<section class="card"><fieldset><legend><h2>Tema</h2></legend>' +
      radio("tema", "auto", "Automático (el del teléfono)", tema === "auto") + radio("tema", "claro", "Claro", tema === "claro") +
      radio("tema", "oscuro", "Oscuro", tema === "oscuro") + "</fieldset></section>" +
      '<section class="card"><fieldset><legend><h2>Tamaño de la letra</h2></legend>' +
      LETRAS.map(function (l, i) { return radio("letra", i, l, letra === i); }).join("") +
      '<p class="muestra">«Una vida sin examen no merece ser vivida.» (Platón, <cite>Apología</cite> 38a)</p></fieldset></section>' +
      '<section class="card" aria-labelledby="h-prog"><h2 id="h-prog">Tu progreso</h2>' +
      "<p>" + plural(leidas, "semana leída", "semanas leídas") + " y " + plural(tarjetas, "tarjeta", "tarjetas") + " de repaso. Queda guardado en este teléfono.</p>" +
      '<p class="acciones"><button type="button" class="btn" id="exportar">Exportar el progreso</button>' +
      '<button type="button" class="btn sec" id="importar">Importar una copia</button></p>' +
      '<input type="file" id="archivo" accept="application/json,.json" hidden>' +
      '<p id="msg-prog" role="status"></p></section>' +
      '<section class="card peligro" aria-labelledby="h-borrar"><h2 id="h-borrar">Borrar el progreso</h2>' +
      "<p>Borra las semanas leídas, dónde quedaste y el repaso. No toca nada más.</p>" +
      '<p><button type="button" class="btn alerta" id="borrar">Borrar el progreso</button></p>' +
      '<div id="confirmar" hidden><p><strong>¿Seguro?</strong> No se puede deshacer (salvo que tengas una copia exportada).</p>' +
      '<p class="acciones"><button type="button" class="btn alerta" id="borrar-si">Sí, borrar todo</button>' +
      '<button type="button" class="btn sec" id="borrar-no">Cancelar</button></p></div>' +
      '<p id="msg-borrar" role="status"></p></section>' +
      '<p class="muted pie">Ágora ' + APP_VERSION + ". Funciona sin internet: lo que se abre una vez queda en el teléfono.</p>";
    if (!mostrar(t, out, S.era)) return;
    if (aviso) { document.getElementById(aviso[0]).textContent = aviso[1]; aviso = null; }
    $app.querySelectorAll('input[name="tema"]').forEach(function (i) {
      i.addEventListener("change", function () { S.ajustes.tema = i.value; save(); aplicarAjustes(); });
    });
    $app.querySelectorAll('input[name="letra"]').forEach(function (i) {
      i.addEventListener("change", function () { S.ajustes.letra = +i.value; save(); aplicarAjustes(); });
    });
    var msg = document.getElementById("msg-prog");
    document.getElementById("exportar").addEventListener("click", function () {
      var data = JSON.stringify(N.exportar(S), null, 1);
      var a = document.createElement("a");
      a.href = URL.createObjectURL(new Blob([data], { type: "application/json" }));
      var d = new Date();
      a.download = "agora-progreso-" + d.getFullYear() + "-" + ("0" + (d.getMonth() + 1)).slice(-2) + "-" + ("0" + d.getDate()).slice(-2) + ".json";
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(function () { URL.revokeObjectURL(a.href); }, 1000);
      msg.textContent = "Listo: se descargó la copia. Guardala donde quieras; con «Importar una copia» la recuperás acá o en otro teléfono.";
    });
    var archivo = document.getElementById("archivo");
    document.getElementById("importar").addEventListener("click", function () { archivo.click(); });
    archivo.addEventListener("change", function () {
      var f = archivo.files && archivo.files[0];
      if (!f) return;
      var fr = new FileReader();
      fr.onload = function () {
        try {
          S = N.importar(String(fr.result));
          save();
          aplicarAjustes();
          aviso = ["msg-prog", "Listo: se cargó la copia (" + plural(cuantasLeidas(), "semana leída", "semanas leídas") + ")."];
          render();
        } catch (e) {
          msg.textContent = "No se pudo importar: " + e.message;
        }
        archivo.value = "";
      };
      fr.readAsText(f);
    });
    var conf = document.getElementById("confirmar");
    document.getElementById("borrar").addEventListener("click", function () {
      conf.hidden = false;
      document.getElementById("borrar-no").focus();
    });
    document.getElementById("borrar-no").addEventListener("click", function () {
      conf.hidden = true;
      document.getElementById("borrar").focus();
    });
    document.getElementById("borrar-si").addEventListener("click", function () {
      var aj = S.ajustes;
      S = N.borrar(store);
      S.ajustes = aj;            // the look of the app stays
      save();
      aviso = ["msg-borrar", "Listo: el progreso está borrado."];
      render();
    });
    enfocar();
  }

  // ------------------------------------------------------------------ arranque
  if ("scrollRestoration" in history) history.scrollRestoration = "manual";
  aplicarAjustes();
  window.addEventListener("hashchange", render);
  render();
  if ("serviceWorker" in navigator && location.protocol !== "file:") {
    window.addEventListener("load", function () {
      navigator.serviceWorker.register("sw.js").catch(function () { /* sin service worker: anda igual, con red */ });
    });
  }
  window.Lector = { version: APP_VERSION };
})();
