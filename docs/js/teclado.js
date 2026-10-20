/*
 * El teclado de la app: las respuestas en la lengua del curso se escriben
 * con un teclado propio, en pantalla, con la distribución de esa lengua.
 *
 * Por qué: una página web no puede elegir el idioma del teclado del
 * teléfono.  Chrome en Android no le pasa al teclado el «lang» del campo
 * (EditorInfo.hintLocales: lo ponen las apps nativas como Duolingo, nunca
 * Chrome) y Safari en el iPhone tampoco; entonces Gboard sigue en
 * castellano y autocorrige «sono» en «sonó».  El teclado propio no depende
 * del teléfono: QWERTY con à è ì ò ù, con ã ç õ, o QWERTZ con ä ö ü ß
 * (LANG.ui.kbRows y LANG.ui.keys del paquete), sin autocorrector.
 *
 * Cómo: app.js marca con Teclado.mark() cada caja donde el alumno escribe
 * en la lengua del curso; con el teclado de la app, la caja lleva
 * inputmode="none" (el del teléfono no se abre) y al tomar el foco aparece
 * este.  Solo en pantallas táctiles: con mouse y teclado físico, nada.
 * El botón ⌨️ pasa al teclado del teléfono, y en la fila de acentos de
 * cada ejercicio hay uno para volver.  La elección queda en este teléfono
 * («c1.kb2»: app | phone), para todos los idiomas.  «c1.kb2» y no «c1.kb»:
 * hasta la v3.11 el botón ⌨️ parecía el «ocultar» de Gboard y dejaba
 * elegido el teclado del teléfono sin querer; esa elección no se hereda.
 */
(function (root) {
  "use strict";

  var KEY = "c1.kb2";
  var doc = root.document;

  function mode() { try { return root.localStorage.getItem(KEY) || "app"; } catch (e) { return "app"; } }
  function setMode(m) { try { root.localStorage.setItem(KEY, m === "phone" ? "phone" : "app"); } catch (e) { /* sin almacenamiento */ } }
  // a phone or a tablet: a finger is the main pointer, or there is a touch
  // screen and no mouse (some phones report the pen or a cover as «fine»)
  function touch() {
    var mm = function (q) { return !!(root.matchMedia && root.matchMedia(q).matches); };
    if (mm("(pointer: coarse)")) return true;
    var nav = root.navigator || {};
    return (nav.maxTouchPoints > 0 || mm("(any-pointer: coarse)")) && mm("(hover: none)");
  }
  // ¿Se usa el teclado de la app en este momento?
  function active() { return touch() && mode() === "app"; }

  function ui() { return (root.LANG && root.LANG.ui) || {}; }
  // Las filas de letras y lo que falta de las teclas especiales (las que no están en las filas).
  function layout() {
    var rows = ui().kbRows || ["qwertyuiop", "asdfghjkl", "zxcvbnm"];
    var inRows = rows.join("");
    var extra = (ui().keys || []).filter(function (c) { return c.length === 1 && inRows.indexOf(c) < 0 && c !== "'" && c !== "-"; });
    return { rows: rows, extra: extra };
  }
  var SYMBOLS = ["1234567890", "-/:;()€&@\"", ".,?!'¿¡"];

  /* La caja de una respuesta en la lengua del curso. */
  function mark(el) {
    el.setAttribute("data-kb", "1");
    if (active()) el.setAttribute("inputmode", "none");
    else if (el.getAttribute("inputmode") === "none") el.removeAttribute("inputmode");
  }
  function marked(el) { return !!(el && el.getAttribute && el.getAttribute("data-kb") === "1"); }
  function remark() { Array.prototype.forEach.call(doc.querySelectorAll("[data-kb='1']"), mark); }

  var panel = null, target = null, shift = false, layer = "abc", hideTimer = null, lastBox = null, chip = null;

  /* With the phone's keyboard: a button to bring the app's one back, on top
     of the screen (the phone's keyboard covers the bottom), while an answer
     box has the focus.  Every screen has it, not only the ones with a row of
     accents. */
  function showChip() {
    if (!chip) {
      chip = doc.createElement("button");
      chip.type = "button";
      chip.id = "kbchip";
      chip.className = "kbchip";
      chip.setAttribute("data-kbapp", "1");
      chip.textContent = "⌨️ Teclado de la app";
      doc.body.appendChild(chip);
    }
    chip.hidden = false;
  }
  function hideChip() { if (chip) chip.hidden = true; }

  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function key(ch, cls, label, title) {
    return '<button type="button" class="kbk' + (cls ? " " + cls : "") + '" data-k="' + esc(ch) + '"' +
      (title ? ' aria-label="' + esc(title) + '"' : "") + ">" + esc(label || ch) + "</button>";
  }
  function draw() {
    var L = layout(), rows = layer === "abc" ? L.rows : SYMBOLS;
    // the way to the phone's keyboard says what it does (the ⌨️ of before
    // looked like Gboard's «hide the keyboard» and was pressed for that)
    var html = '<div class="kbtop"><button type="button" class="kblink" data-k="phone">Usar el teclado del teléfono</button></div>';
    if (layer === "abc" && L.extra.length) {
      html += '<div class="kbrow kbextra">' + L.extra.map(function (c) { return key(shift ? c.toUpperCase() : c); }).join("") + "</div>";
    }
    rows.forEach(function (r, i) {
      var keys = r.split("").map(function (c) { return key(shift && layer === "abc" ? c.toUpperCase() : c); }).join("");
      if (i === rows.length - 1) {
        keys = (layer === "abc" ? key("shift", "kbmod" + (shift ? " on" : ""), "⇧", "mayúscula") : key("abc", "kbmod", "abc", "letras")) +
               keys + key("back", "kbmod", "⌫", "borrar");
      }
      html += '<div class="kbrow">' + keys + "</div>";
    });
    html += '<div class="kbrow">' +
      key("hide", "kbmod", "▾", "ocultar el teclado") +
      (layer === "abc" ? key("123", "kbmod", "123", "números y signos") : key("abc", "kbmod", "abc", "letras")) +
      key(" ", "kbspace", (root.LANG && root.LANG.name) || "espacio", "espacio") +
      key("enter", "kbmod kbenter", "↵", "enviar") + "</div>";
    panel.innerHTML = html;
  }
  function ensure() {
    if (panel) return;
    panel = doc.createElement("div");
    panel.id = "kbapp";
    panel.className = "kbapp";
    panel.setAttribute("role", "group");
    panel.setAttribute("aria-label", "teclado");
    panel.hidden = true;
    doc.body.appendChild(panel);
    // The keys never take the focus: the caret stays in the answer box.
    // A key writes when the finger touches it (pointerdown), not on «click»:
    // typing fast with two thumbs, the next finger lands before the last one
    // lifts, and the browser drops those clicks (half the letters were lost).
    // A touch between two keys goes to the nearest one.
    panel.addEventListener("pointerdown", function (e) {
      e.preventDefault();
      var b = keyAt(e);
      if (!b || !target) return;
      lastDown = Date.now();
      flash(b);
      var k = b.getAttribute("data-k");
      press(k);
      if (k === "back") repeatBack();
    });
    ["pointerup", "pointercancel", "pointerleave"].forEach(function (t) { panel.addEventListener(t, stopRepeat); });
    panel.addEventListener("mousedown", function (e) { e.preventDefault(); });
    // a click without a pointerdown before it (a screen reader, a test): the key too
    panel.addEventListener("click", function (e) {
      if (Date.now() - lastDown < 800) return;
      var b = e.target.closest ? e.target.closest("[data-k]") : null;
      if (!b || !target) return;
      press(b.getAttribute("data-k"));
    });
  }
  var lastDown = 0, repeatTimer = null;
  function keyAt(e) {
    var b = e.target && e.target.closest ? e.target.closest("[data-k]") : null;
    if (b && panel.contains(b)) return b;
    var best = null, bd = 18 * 18;
    Array.prototype.forEach.call(panel.querySelectorAll("[data-k]"), function (k) {
      var r = k.getBoundingClientRect();
      var dx = Math.max(r.left - e.clientX, 0, e.clientX - r.right), dy = Math.max(r.top - e.clientY, 0, e.clientY - r.bottom);
      if (dx * dx + dy * dy < bd) { bd = dx * dx + dy * dy; best = k; }
    });
    return best;
  }
  // the pressed look, also when the press was not on the key itself
  function flash(b) { b.classList.add("down"); setTimeout(function () { b.classList.remove("down"); }, 110); }
  // ⌫ held down keeps erasing, as on the phone's keyboard
  function repeatBack() {
    stopRepeat();
    repeatTimer = setTimeout(function step() {
      if (!target) return;
      press("back");
      repeatTimer = setTimeout(step, 70);
    }, 450);
  }
  function stopRepeat() { clearTimeout(repeatTimer); repeatTimer = null; }

  function fire(el, type) {
    var ev;
    try { ev = new root.Event(type, { bubbles: true }); } catch (e) { ev = doc.createEvent("Event"); ev.initEvent(type, true, true); }
    el.dispatchEvent(ev);
  }
  function insert(el, txt) {
    var st = el.selectionStart == null ? el.value.length : el.selectionStart;
    var en = el.selectionEnd == null ? st : el.selectionEnd;
    el.value = el.value.slice(0, st) + txt + el.value.slice(en);
    try { el.setSelectionRange(st + txt.length, st + txt.length); } catch (e) { /* */ }
    fire(el, "input");
  }
  function back(el) {
    var st = el.selectionStart == null ? el.value.length : el.selectionStart;
    var en = el.selectionEnd == null ? st : el.selectionEnd;
    if (en > st) el.value = el.value.slice(0, st) + el.value.slice(en);
    else if (st > 0) { el.value = el.value.slice(0, st - 1) + el.value.slice(st); st--; }
    try { el.setSelectionRange(st, st); } catch (e) { /* */ }
    fire(el, "input");
  }
  function press(k) {
    var el = target;
    if (k === "shift") { shift = !shift; draw(); return; }
    if (k === "123" || k === "abc") { layer = k === "123" ? "sym" : "abc"; draw(); return; }
    if (k === "back") { back(el); return; }
    if (k === "phone") { usePhone(); return; }
    if (k === "hide") { var h = target; hide(); if (h) h.blur(); return; }
    if (k === "enter") {
      var ev;
      try { ev = new root.KeyboardEvent("keydown", { key: "Enter", code: "Enter", bubbles: true, cancelable: true }); }
      catch (e) { ev = doc.createEvent("Event"); ev.initEvent("keydown", true, true); ev.key = "Enter"; }
      el.dispatchEvent(ev);
      // the screen did not take the Enter (a long text): a new line, as the phone's keyboard does
      if (!ev.defaultPrevented && el.tagName === "TEXTAREA" && doc.body.contains(el)) insert(el, "\n");
      return;
    }
    insert(el, k);
    if (shift) { shift = false; draw(); }
  }

  function show(el) {
    ensure();
    clearTimeout(hideTimer);
    target = el;
    if (panel.hidden) { shift = false; layer = "abc"; draw(); panel.hidden = false; }
    doc.body.classList.add("kb-open");
    // the box and its button above the keyboard
    root.requestAnimationFrame(function () {
      try { el.scrollIntoView({ block: "center", behavior: "smooth" }); } catch (e) { /* */ }
    });
  }
  function hide() {
    if (!panel) return;
    panel.hidden = true;
    target = null;
    stopRepeat();
    doc.body.classList.remove("kb-open");
  }
  // A new question re-renders the screen: the box leaves and another one
  // takes the focus right away; the keyboard does not blink in between.
  function hideSoon() { clearTimeout(hideTimer); hideTimer = setTimeout(hide, 120); }

  // Al teclado del teléfono, desde la caja que se estaba escribiendo.
  function usePhone() {
    var el = target;
    setMode("phone");
    hide();
    remark();
    if (el) { el.blur(); setTimeout(function () { el.focus(); }, 60); }
  }
  // Al teclado de la app: la caja que se estaba escribiendo (o la última)
  // vuelve a tomar el foco, ahora sin el teclado del teléfono.
  function useApp() {
    setMode("app");
    remark();
    var el = marked(doc.activeElement) ? doc.activeElement : lastBox && doc.body.contains(lastBox) ? lastBox : null;
    if (el && active()) { el.blur(); setTimeout(function () { el.focus(); }, 60); }
  }

  if (doc && doc.addEventListener) {
    doc.addEventListener("focusin", function (e) {
      var el = e.target;
      // a box the app drew and focused before marking it (a screen that
      // draws itself and takes the focus in one go): marked now, and given
      // the focus again so that the phone's keyboard that started to open closes
      if (!marked(el) && api.qualify && el && el.tagName && api.qualify(el)) {
        mark(el);
        if (active()) { el.blur(); setTimeout(function () { el.focus(); }, 30); return; }
      }
      if (marked(el)) lastBox = el;
      if (marked(el) && active()) { hideChip(); show(el); }
      else {
        if (panel && !panel.contains(el)) hideSoon();
        if (marked(el) && touch()) showChip(); else if (!(chip && chip.contains(el))) hideChip();
      }
    });
    doc.addEventListener("focusout", function (e) {
      if (target && e.target === target) hideSoon();
      if (chip && marked(e.target)) setTimeout(function () { if (!marked(doc.activeElement)) hideChip(); }, 150);
    });
    // the button that brings the app's keyboard back (in the accents row):
    // tapping it does not take the focus away from the box
    doc.addEventListener("mousedown", function (e) {
      if (e.target && e.target.closest && e.target.closest("[data-kbapp]")) e.preventDefault();
    });
    doc.addEventListener("pointerdown", function (e) {
      if (e.target && e.target.closest && e.target.closest("[data-kbapp]")) e.preventDefault();
    });
    doc.addEventListener("click", function (e) {
      var b = e.target && e.target.closest ? e.target.closest("[data-kbapp]") : null;
      if (b) { e.preventDefault(); hideChip(); useApp(); }
    });
  }

  // api.qualify(el): app.js says which boxes are answers in the language of the course
  var api = { qualify: null, mark: mark, active: active, mode: mode, setMode: function (m) { setMode(m); remark(); if (!active()) hide(); },
              touch: touch, layout: layout, useApp: useApp, usePhone: usePhone, press: press, show: show, hide: hide };
  if (typeof module === "object" && module.exports) module.exports = api;
  root.Teclado = api;
})(typeof window !== "undefined" ? window : globalThis);
