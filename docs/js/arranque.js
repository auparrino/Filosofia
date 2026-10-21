/*
 * Ágora — antes de pintar nada: el tema (claro, oscuro o el del teléfono),
 * el tamaño de la letra y la época, desde lo guardado («agora.lector.v1»),
 * así la página no parpadea.  ?era=N en la URL fija la época (para verlas).
 * Lo demás lo hace js/lector.js.
 */
(function () {
  "use strict";
  var html = document.documentElement, s = null;
  try { s = JSON.parse(localStorage.getItem("agora.lector.v1") || "null"); } catch (e) { s = null; }
  var aj = (s && s.ajustes) || {};
  if (aj.tema === "claro") html.setAttribute("data-theme", "light");
  else if (aj.tema === "oscuro") html.setAttribute("data-theme", "dark");
  var l = +aj.letra;
  html.setAttribute("data-letra", l >= 0 && l <= 3 ? String(l) : "1");
  var m = /[?&]era=([1-8])\b/.exec(location.search);
  html.setAttribute("data-era", m ? m[1] : String((s && s.era) || 1));
})();
