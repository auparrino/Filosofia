/* La prueba de humo: la app entera en Chromium, en un celular.
 *
 * Sirve docs/ bajo /Filosofia/ (como GitHub Pages) y recorre todo: abre la
 * app, va al índice, lee la semana 1 pasando por todas sus secciones,
 * «Terminé de leer», adelanta el reloj y relee las tarjetas en Repaso,
 * busca en el glosario con y sin tilde, abre un repaso de estación, mira
 * las 8 épocas, cambia el tema y la letra, exporta, importa y borra el
 * progreso, y después recarga sin red (el service worker).  Al final,
 * una pasada corta con la app servida en la raíz.
 *
 * Falla con cualquier error de la página o de la consola, con una
 * respuesta 404 (o peor), con «undefined» o «NaN» en pantalla, con scroll
 * horizontal o si se toca una clave que no empieza con «agora».
 *
 * Necesita Playwright (no lo instala):  npm run smoke
 * (NODE_PATH=$(npm root -g) node tools/lib/smoke.js).  Con SMOKE_CAPTURAS=dir
 * guarda capturas de inicio, semana, repaso y glosario.
 */
"use strict";
var http = require("http"), fs = require("fs"), path = require("path");
var pw = require("playwright");
var DOCS = path.join(__dirname, "..", "..", "docs");
var SHOTS = process.env.SMOKE_CAPTURAS || "";

var TYPES = { ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".css": "text/css; charset=utf-8",
              ".json": "application/json; charset=utf-8", ".webmanifest": "application/manifest+json", ".svg": "image/svg+xml",
              ".png": "image/png", ".woff2": "font/woff2", ".txt": "text/plain; charset=utf-8" };
function serve(prefix) {
  return new Promise(function (resolve) {
    var srv = http.createServer(function (req, res) {
      var u = decodeURIComponent(req.url.split("?")[0]);
      if (u.indexOf(prefix) !== 0) { res.writeHead(404); return res.end("fuera de la app"); }
      var rel = u.slice(prefix.length) || "index.html";
      if (rel.endsWith("/")) rel += "index.html";
      var f = path.join(DOCS, rel);
      if (f.indexOf(DOCS) !== 0 || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); return res.end("no está"); }
      res.writeHead(200, { "Content-Type": TYPES[path.extname(f)] || "application/octet-stream", "Cache-Control": "no-cache" });
      fs.createReadStream(f).pipe(res);
    });
    srv.listen(0, "127.0.0.1", function () { resolve(srv); });
  });
}

var checks = 0, fails = 0;
function ok(cond, what) {
  checks++;
  if (!cond) { fails++; console.log("FAIL " + what); }
  return !!cond;
}
function step(what) { console.log("· " + what); }

var T0 = new Date("2026-10-21T12:00:00").getTime();
var DAY = 86400000;

function watch(page, label) {
  page.on("pageerror", function (e) { ok(false, label + ": error en la página: " + e.message); });
  page.on("console", function (m) { if (m.type() === "error" || m.type() === "warning") ok(false, label + ": consola (" + m.type() + "): " + m.text()); });
  page.on("response", function (r) { if (r.status() >= 400) ok(false, label + ": " + r.status() + " en " + r.url()); });
  page.on("requestfailed", function (r) {
    // offline, the page itself asks nothing from the network: the worker answers
    ok(false, label + ": falló el pedido " + r.url() + " (" + (r.failure() || {}).errorText + ")");
  });
}

async function clean(page, where) {
  var info = await page.evaluate(function () {
    return { text: document.body.innerText, sw: document.documentElement.scrollWidth, w: window.innerWidth };
  });
  ok(!/\bundefined\b|\bNaN\b|\[object /.test(info.text), where + ": no dice undefined, NaN ni [object …]");
  ok(info.sw <= info.w, where + ": sin scroll horizontal (" + info.sw + " > " + info.w + ")");
}
async function h1(page) { return (await page.locator("h1").first().textContent()).trim(); }
// the text as written (innerText would follow text-transform: uppercase)
async function txt(page, sel) { return (await page.locator(sel).first().textContent()).replace(/\s+/g, " "); }
async function go(page, hash) {
  await page.evaluate(function (h) { location.hash = h; }, hash);
  await page.waitForTimeout(150);
}
async function waitH1(page, re, where) {
  try { await page.waitForFunction(function (src) {
    var h = document.querySelector("h1"); return h && new RegExp(src).test(h.textContent);
  }, re.source, { timeout: 8000 }); } catch (e) { /* the check below says it */ }
  var t = await h1(page);
  ok(re.test(t), where + ": el título es «" + t + "»");
}
async function shot(page, name) {
  if (!SHOTS) return;
  fs.mkdirSync(SHOTS, { recursive: true });
  await page.waitForTimeout(500);       // the entrance animation
  await page.screenshot({ path: path.join(SHOTS, name + ".png") });
}
async function onlyAgora(page, where) {
  var keys = await page.evaluate(function () { return Object.keys(localStorage); });
  var foreign = keys.filter(function (k) { return !/^agora/.test(k) && k !== "c1.save.v1"; });
  ok(!foreign.length, where + ": solo claves agora en el almacenamiento: " + foreign);
  ok(await page.evaluate(function () { return localStorage.getItem("c1.save.v1"); }) === "{\"de\":\"otra app\"}",
    where + ": la clave de la otra app sigue intacta");
  var cs = await page.evaluate(function () { return caches.keys(); });
  ok(cs.indexOf("c1-v9") >= 0, where + ": la caché de la otra app sigue ahí");
  ok(cs.every(function (k) { return /^agora-/.test(k) || k === "c1-v9"; }), where + ": las cachés de la app empiezan con agora-: " + cs);
}

async function full(browser, base) {
  var ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true,
                                       acceptDownloads: true, locale: "es-AR", colorScheme: "light", serviceWorkers: "allow" });
  var page = await ctx.newPage();
  watch(page, "celular");
  await page.clock.install({ time: T0 });
  // another app lives on the same origin: its data must survive
  await page.goto(base + "manifest.webmanifest");
  await page.evaluate(function () {
    localStorage.setItem("c1.save.v1", "{\"de\":\"otra app\"}");
    return caches.open("c1-v9").then(function (c) { return c.put("/It/x", new Response("x")); });
  });

  step("inicio");
  await page.goto(base);
  await waitH1(page, /Ágora/, "inicio");
  ok(/Para empezar/.test(await txt(page, "main")), "inicio: «Para empezar» sin nada leído");
  ok(/0 de 117/.test(await txt(page, "main")), "inicio: 0 de 117 semanas");
  await clean(page, "inicio");

  step("índice");
  await page.getByRole("link", { name: /Índice/ }).first().click();
  await waitH1(page, /Índice/, "índice");
  ok(await page.locator(".estacion").count() === 9, "índice: 9 estaciones");
  ok(await page.locator("a.fila").count() === 117, "índice: 117 semanas");
  await clean(page, "índice");

  step("semana 1, de corrido");
  await page.locator('a.fila[href="#semana/1"]').click();
  await waitH1(page, /Qué es la filosofía/, "semana 1");
  var secs = await page.locator(".toc button").evaluateAll(function (bs) { return bs.map(function (b) { return b.getAttribute("data-ir"); }); });
  ok(JSON.stringify(secs) === JSON.stringify(["esencial", "leccion", "texto", "argumento", "lectura", "caso", "conceptos", "literatura", "final"]),
    "semana 1: el índice interno tiene todas las secciones: " + secs);
  for (var i = 0; i < secs.length; i++) {
    await page.locator('.toc button[data-ir="' + secs[i] + '"]').click();
    await page.waitForTimeout(350);
    var top = await page.evaluate(function (id) { return document.getElementById("sec-" + id).getBoundingClientRect().top; }, secs[i]);
    ok(top >= 0 && top < (secs[i] === "final" ? 844 : 300), "semana 1: el botón «" + secs[i] + "» lleva a su sección (top " + Math.round(top) + ")");
    var cur = await page.locator('.toc button[aria-current="true"]').getAttribute("data-ir");
    ok(cur === secs[i] || secs[i] === "final" || secs[i] === "literatura", "semana 1: la sección actual se marca (" + cur + ")");
  }
  var text = await txt(page, "article.semana");
  ok(/Ojo\./.test(text) && /Querefonte/.test(text) && /Por lo tanto/.test(text) && /La premisa que no se dice/.test(text) &&
     /Una vuelta más/.test(text) && /No confundir/.test(text) && /El mundo de Sofía/.test(text), "semana 1: están la lección, el texto, el argumento, el caso, los conceptos y la literatura");
  ok(await page.locator("article.semana table").count() >= 1, "semana 1: las tablas");
  ok(await page.locator("article.semana input, article.semana textarea, article.semana [type=radio]").count() === 0,
    "semana 1: nada para contestar (sin preguntas ni opciones)");
  ok(!/Elegí|¿Cuál es la conclusión\?|Escribí tu/.test(text), "semana 1: sin consignas de ejercicios");
  await clean(page, "semana 1");
  await page.locator('.toc button[data-ir="leccion"]').click();
  await page.waitForTimeout(300);
  await shot(page, "semana");

  step("recuerda dónde quedó");
  await page.locator('.toc button[data-ir="texto"]').click();
  await page.waitForTimeout(600);
  var y = await page.evaluate(function () { return window.scrollY; });
  await page.reload();
  await waitH1(page, /Qué es la filosofía/, "semana 1 recargada");
  await page.waitForTimeout(300);
  var y2 = await page.evaluate(function () { return window.scrollY; });
  ok(Math.abs(y2 - y) < 40, "semana 1: al volver, el mismo scroll (" + y + " → " + y2 + ")");
  await page.getByRole("link", { name: /Inicio/ }).first().click();
  await waitH1(page, /Ágora/, "inicio");
  var main = await txt(page, "main");
  ok(/Seguir leyendo/.test(main) && /Ibas por: El texto/.test(main), "inicio: «Seguir leyendo», ibas por El texto: " + main.slice(0, 300));
  await page.locator("main a", { hasText: "Seguir leyendo" }).click();
  await waitH1(page, /Qué es la filosofía/, "seguir leyendo");
  await page.waitForTimeout(300);
  ok(Math.abs(await page.evaluate(function () { return window.scrollY; }) - y) < 40, "seguir leyendo: vuelve al texto");

  step("terminé de leer");
  await page.locator("#termine").click();
  await page.waitForTimeout(200);
  ok(/La terminaste de leer el 21\/10\/2026/.test(await txt(page, "#sec-final")), "semana 1: queda leída");
  await go(page, "#indice");
  await waitH1(page, /Índice/, "índice");
  ok(await page.locator('a.fila[href="#semana/1"] .ok[aria-label="leída"]').count() === 1, "índice: ✓ en la semana 1");
  await go(page, "#inicio");
  await waitH1(page, /Ágora/, "inicio");
  main = await txt(page, "main");
  ok(/1 de 117/.test(main), "inicio: 1 de 117");
  ok(/Para leer ahora/.test(main) && /Semana 2/.test(main), "inicio: sugiere la semana 2: " + main.slice(0, 300));
  ok(/Nada para releer hoy/.test(main) && /22\/10\/2026/.test(main), "inicio: nada para hoy, lo próximo mañana");
  await shot(page, "inicio");

  step("repaso, al día siguiente");
  await page.clock.setSystemTime(T0 + DAY + 3600000);
  await page.reload();
  await waitH1(page, /Ágora/, "inicio, un día después");
  main = await txt(page, "main");
  ok(/14 tarjetas/.test(main), "inicio: 14 tarjetas para hoy (lo esencial y 13 conceptos)");
  ok((await page.locator(".nav .badge").innerText()).trim() === "14", "la barra de abajo avisa 14");
  await page.getByRole("link", { name: /Repaso/ }).first().click();
  await waitH1(page, /Repaso/, "repaso");
  ok(await page.locator(".tarjeta").count() === 14, "repaso: 14 tarjetas");
  ok(/Lo esencial/.test(await txt(page, ".tarjeta")), "repaso: primero el resumen de la semana");
  ok(await page.locator('.tarjeta a', { hasText: "Releer la semana" }).count() === 14, "repaso: cada una con «Releer la semana»");
  await clean(page, "repaso");
  await shot(page, "repaso");
  var n = await page.locator("[data-releido]").count();
  for (i = 0; i < n; i++) await page.locator("[data-releido]").first().click();
  ok(await page.locator(".tarjeta.releida").count() === 14, "repaso: las 14, releídas");
  ok(/Nada más para hoy/.test(await txt(page, "main")), "repaso: nada más para hoy");
  ok(/29\/10\/2026/.test(await txt(page, "main")), "repaso: lo próximo, a los 7 días");
  ok(await page.locator(".nav .badge").count() === 0, "la barra ya no avisa");
  await page.clock.setSystemTime(T0 + 8 * DAY + 3600000);
  await page.reload();
  await waitH1(page, /Repaso/, "repaso, una semana después");
  ok(await page.locator(".tarjeta").count() === 14, "repaso: a los 7 días vuelven las 14");
  await page.locator(".tarjeta a", { hasText: "Releer la semana" }).nth(1).click();
  await waitH1(page, /Qué es la filosofía/, "releer la semana");
  ok(await page.locator(".concepto.destino").count() === 1, "releer un concepto abre la semana en ese concepto");

  step("glosario");
  await page.getByRole("link", { name: /Glosario/ }).first().click();
  await waitH1(page, /Glosario/, "glosario");
  var total = await page.locator("ul.glosario > li").count();
  ok(total > 1500, "glosario: todos los conceptos (" + total + ")");
  async function search(q) {
    await page.locator("#buscar").fill(q);
    await page.waitForTimeout(400);
    return page.locator("ul.glosario > li .t").allInnerTexts();
  }
  var sin = await search("etica"), con = await search("ética"), may = await search("ÉTICA");
  ok(sin.length > 0 && sin[0] === "ética", "glosario: «etica» encuentra «ética» primero (" + sin.slice(0, 3) + ")");
  ok(JSON.stringify(sin) === JSON.stringify(con) && JSON.stringify(con) === JSON.stringify(may), "glosario: con tilde, sin tilde y en mayúsculas da lo mismo");
  var logos = await search("logos");
  ok(logos.indexOf("logos") >= 0, "glosario: «logos»");
  await search("asombro");
  await clean(page, "glosario");
  await page.locator("ul.glosario summary").first().click();
  await shot(page, "glosario");
  await page.locator("ul.glosario details[open] a").first().click();
  await waitH1(page, /Qué es la filosofía/, "del glosario a la semana");
  ok(await page.locator(".concepto.destino").count() === 1, "glosario: el enlace lleva al concepto en su semana");

  step("repaso de la estación");
  await go(page, "#semana/13");
  await waitH1(page, /Repaso de la estación/, "semana 13");
  ok(await page.locator("article a.btn", { hasText: /Abrir la semana/ }).count() === 12, "semana 13: lo esencial de las 12 semanas, con enlace");
  await clean(page, "semana 13");
  await page.locator("article a.btn", { hasText: "Abrir la semana 4" }).click();
  await waitH1(page, /Lógica I/, "de la 13 a la 4");

  step("las 8 épocas");
  var looks = {};
  for (var e = 1; e <= 8; e++) {
    await page.goto(base + "?era=" + e + "#inicio");
    await waitH1(page, /Ágora/, "época " + e);
    var era = await page.evaluate(function () {
      var cs = getComputedStyle(document.documentElement);
      return { attr: document.documentElement.getAttribute("data-era"), coral: cs.getPropertyValue("--coral").trim(),
               serif: cs.getPropertyValue("--serif").trim(), bg: getComputedStyle(document.body).backgroundColor };
    });
    ok(era.attr === String(e), "?era=" + e + ": data-era=" + era.attr);
    looks[era.coral + era.serif] = 1;
    await clean(page, "época " + e);
  }
  ok(Object.keys(looks).length === 8, "las 8 épocas se ven distintas (" + Object.keys(looks).length + ")");
  await page.goto(base + "#semana/30");
  await waitH1(page, /./, "semana 30");
  ok(await page.evaluate(function () { return document.documentElement.getAttribute("data-era"); }) === "3", "la semana 30 se pinta con su época (3)");
  await go(page, "#inicio");
  await waitH1(page, /Ágora/, "inicio");
  ok(await page.evaluate(function () { return document.documentElement.getAttribute("data-era"); }) === "1", "inicio: la época de la última semana leída (1)");

  step("ajustes");
  await page.getByRole("link", { name: /Ajustes/ }).first().click();
  await waitH1(page, /Ajustes/, "ajustes");
  var bg0 = await page.evaluate(function () { return getComputedStyle(document.body).backgroundColor; });
  await page.getByLabel("Oscuro").check();
  var dark = await page.evaluate(function () { return [document.documentElement.getAttribute("data-theme"), getComputedStyle(document.body).backgroundColor]; });
  ok(dark[0] === "dark" && dark[1] !== bg0, "ajustes: el tema oscuro cambia el fondo (" + bg0 + " → " + dark[1] + ")");
  await page.getByLabel("Muy grande").check();
  ok(await page.evaluate(function () { return getComputedStyle(document.documentElement).fontSize; }) === "22px", "ajustes: la letra muy grande es de 22px");
  await page.reload();
  await waitH1(page, /Ajustes/, "ajustes recargados");
  ok(await page.evaluate(function () { return document.documentElement.getAttribute("data-theme") + " " + getComputedStyle(document.documentElement).fontSize; }) === "dark 22px",
    "ajustes: el tema y la letra quedan después de recargar");
  await clean(page, "ajustes (oscuro, letra grande)");
  await page.getByLabel("Claro").check();
  ok(await page.evaluate(function () { return document.documentElement.getAttribute("data-theme"); }) === "light", "ajustes: tema claro");
  await page.getByLabel("Automático").check();
  ok(await page.evaluate(function () { return document.documentElement.hasAttribute("data-theme"); }) === false, "ajustes: automático sigue al teléfono");
  await page.getByLabel("Normal").check();
  ok(await page.evaluate(function () { return getComputedStyle(document.documentElement).fontSize; }) === "18px", "ajustes: la letra normal es de 18px");

  var dl = page.waitForEvent("download");
  await page.locator("#exportar").click();
  var file = await (await dl).path();
  var copy = JSON.parse(fs.readFileSync(file, "utf8"));
  ok(copy.app === "agora" && copy.estado && copy.estado.leidas[1] != null, "exportar: un JSON {app: agora} con la semana 1 leída");
  await page.locator("#borrar").click();
  ok(await page.locator("#confirmar").isVisible(), "borrar: pide confirmación");
  await page.locator("#borrar-no").click();
  ok(await page.locator("#confirmar").isHidden(), "borrar: se puede cancelar");
  await page.locator("#borrar").click();
  await page.locator("#borrar-si").click();
  await page.waitForTimeout(200);
  ok(/0 semanas leídas/.test(await txt(page, "main")), "borrar: el progreso queda en cero");
  await onlyAgora(page, "después de borrar");
  await page.locator("#archivo").setInputFiles(file);
  await page.waitForTimeout(400);
  ok(/se cargó la copia \(1 semana leída\)/.test(await txt(page, "main")), "importar: vuelve la semana leída");
  var bad = path.join(path.dirname(file), "otra.json");
  fs.writeFileSync(bad, JSON.stringify({ app: "c1", xp: 3 }));
  await page.locator("#archivo").setInputFiles(bad);
  await page.waitForTimeout(400);
  ok(/No se pudo importar: No es una copia de Ágora/.test(await txt(page, "main")), "importar: rechaza la copia de otra app");
  await clean(page, "ajustes");

  step("sin red");
  await page.evaluate(function () { return navigator.serviceWorker.ready; });
  await page.waitForFunction(function () {
    return caches.open("agora-v0.3.0").then(function (c) { return c.keys(); }).then(function (k) {
      window.__n = k.length; return k.length >= 27;
    });
  }, null, { timeout: 30000 }).catch(function () { /* the check below says it */ });
  var cached = await page.evaluate(function () {
    return caches.open("agora-v0.3.0").then(function (c) { return c.keys(); }).then(function (k) { return k.map(function (r) { return r.url; }); });
  });
  ok(cached.filter(function (u) { return /estacion-\d\.json$/.test(u); }).length === 9, "el service worker guardó las 9 estaciones (" + cached.length + " archivos)");
  await onlyAgora(page, "con el service worker");
  await ctx.setOffline(true);
  await page.goto(base + "#inicio");
  await waitH1(page, /Ágora/, "sin red: inicio");
  await go(page, "#semana/100");
  await waitH1(page, /./, "sin red: semana 100");
  ok(await page.locator(".toc button").count() >= 8, "sin red: la semana 100 se lee entera");
  await go(page, "#glosario");
  await waitH1(page, /Glosario/, "sin red: glosario");
  await go(page, "#repaso");
  await waitH1(page, /Repaso/, "sin red: repaso");
  await clean(page, "sin red");
  await ctx.setOffline(false);
  await ctx.close();
}

async function root(browser, base) {
  var ctx = await browser.newContext({ viewport: { width: 360, height: 740 }, isMobile: true, colorScheme: "dark" });
  var page = await ctx.newPage();
  watch(page, "raíz");
  await page.goto(base);
  await waitH1(page, /Ágora/, "raíz: inicio");
  await go(page, "#semana/60");
  await waitH1(page, /./, "raíz: semana 60");
  ok(await page.evaluate(function () { return document.documentElement.getAttribute("data-era"); }) === "5", "raíz: la semana 60 es de la época 5");
  await clean(page, "raíz: semana 60 (oscuro, 360px)");
  await page.evaluate(function () { return navigator.serviceWorker.ready; });
  await page.waitForTimeout(1500);
  await ctx.setOffline(true);
  await page.reload();
  await waitH1(page, /./, "raíz: sin red");
  await ctx.close();
}

(async function () {
  var t0 = Date.now();
  var sub = await serve("/Filosofia/"), top = await serve("/");
  var browser = await pw.chromium.launch();
  try {
    await full(browser, "http://127.0.0.1:" + sub.address().port + "/Filosofia/");
    await root(browser, "http://127.0.0.1:" + top.address().port + "/");
  } catch (e) {
    ok(false, "se cortó: " + (e.stack || e));
  }
  await browser.close();
  sub.close();
  top.close();
  console.log("smoke: controles: " + checks + "   errores: " + fails + "   (" + ((Date.now() - t0) / 1000).toFixed(1).replace(".", ",") + " s)");
  process.exit(fails ? 1 : 0);
})();
