/* Ágora en el navegador (cada edición de docs/lang/: por ahora, la
   castellana).  Abre la app (con una sola edición no hay selector), pasa el
   primer arranque, recorre Hoy, la semana 1 con su lección, su ronda y su
   seminario, la pausa, Yo, el camino (el mapa de semanas) y las pantallas
   de «Todo el material» (Entrenar, Leer, Consultar, Tu progreso); mira que
   la época se pinte (data-era) y que nada quede de La Via C1 (título,
   claves del guardado, cachés): ningún error de la página ni de la
   consola, ningún archivo pedido que no exista, ningún texto roto
   («undefined», «NaN»).
     NODE_PATH=$(npm root -g) node tools/lib/smoke_curso.js
     SHOTS=dir   capturas a 390×844 (también una por época, con ?era=N) */
"use strict";
const { chromium } = require("playwright");
const { spawn } = require("child_process");
const fs = require("fs"), path = require("path");

function chromiumPath() {
  const base = "/opt/pw-browsers";
  try {
    const dir = fs.readdirSync(base).filter(d => /^chromium-\d+$/.test(d)).sort().pop();
    return dir && ["chrome-linux", "chrome-linux64"].map(d => path.join(base, dir, d, "chrome")).filter(f => fs.existsSync(f))[0];
  } catch (e) { return undefined; }
}

(async () => {
  const port = +(process.env.PORT || 8767), shots = process.env.SHOTS || "";
  if (shots) fs.mkdirSync(shots, { recursive: true });
  const srv = spawn("python3", ["-m", "http.server", String(port)], { cwd: path.join(__dirname, "..", "..", "docs"), stdio: "ignore" });
  await new Promise(r => setTimeout(r, 1200));
  const browser = await chromium.launch().catch(() => chromium.launch({ executablePath: chromiumPath() }));
  const errors = [], base = "http://localhost:" + port + "/";
  const note = (s) => console.log("· " + s);
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  const page = await ctx.newPage();
  page.on("pageerror", e => errors.push("pageerror: " + e.message + " @ " + String(e.stack || "").split("\n").slice(1, 3).join(" ")));
  page.on("console", m => { if (m.type() === "error" && !/Failed to load resource: net::ERR_/.test(m.text())) errors.push("console: " + m.text()); });
  page.on("response", r => { if (r.url().startsWith(base) && r.status() >= 400) errors.push("HTTP " + r.status() + " " + r.url().slice(base.length)); });
  const snap = async (name, full) => { if (!shots) return; await page.waitForTimeout(400); await page.screenshot({ path: path.join(shots, name + ".png"), fullPage: !!full }); };
  const text = async () => (await page.textContent("#app")).replace(/\s+/g, " ");
  // answer what is on screen, right, until the round ends
  async function play(max) {
    let n = 0;
    for (let i = 0; i < max; i++) {
      await page.waitForTimeout(350);
      if (await page.$("#next")) { await page.click("#next"); continue; }
      const it = await page.evaluate(() => window.__test.item());
      if (!it) break;
      if (await page.$("[data-opt]")) {
        const k = await page.$$eval("[data-opt]", (bs, a) => bs.findIndex(b => b.textContent.trim() === a), it.answer);
        await page.click("[data-opt] >> nth=" + Math.max(0, k)).catch(() => {});
      } else if (await page.$("#ans")) { await page.fill("#ans", it.answer); await page.click("#send"); }
      else if (await page.$("#wans")) { await page.fill("#wans", it.answer); await page.click("#wsend"); }
      else break;
      n++;
    }
    return n;
  }

  await page.goto(base + "?test", { waitUntil: "networkidle" });
  if (await page.$(".pick-lang")) errors.push("con una sola edición no tiene que aparecer el selector");
  // the first start, as a learner from zero
  await page.waitForSelector("#obnext", { timeout: 20000 });
  await page.click("[data-obwhy] >> nth=0");
  await page.click("[data-obmin='15']");
  await page.click("#obnext");
  await page.waitForSelector("#obzero, #obtest", { timeout: 5000 });
  if (await page.$("#obzero")) await page.click("#obzero"); else { await page.click("#obtest"); await page.waitForSelector("#ubskip"); await page.click("#ubskip"); }
  await page.waitForSelector("#obgo", { timeout: 5000 });
  await page.click("#obgo");
  await page.waitForTimeout(800);
  if ((await page.getAttribute("html", "data-lang")) !== "es") errors.push("html data-lang no es es");
  if ((await page.getAttribute("html", "data-era")) !== "1") errors.push("la semana 1 no pinta la época 1 (data-era)");
  const title = await page.title();
  if (!/^Ágora/.test(title) || /Via|C1|Rumo/.test(title)) errors.push("el título no es de Ágora: " + title);
  const h1 = (await page.textContent("h1")).trim();
  note("Hoy: " + h1 + " · pestañas: " + (await page.$$eval("#nav button", b => b.map(x => x.textContent.trim()).join(" "))) + " · título: " + title);
  if (/Via C1|Rumo|Weg C1|italiano/i.test(await text())) errors.push("Hoy todavía nombra La Via C1 o el italiano");
  await snap("hoy", true);

  // the week 1: its missions, a lesson, its round
  const plan = await page.evaluate(() => window.__test.plan(1));
  note("semana 1: " + plan.map(m => m.kind).join(", "));
  if (!plan.some(m => m.kind === "lez") || !plan.some(m => m.kind === "play")) errors.push("la semana 1 no tiene lección o ronda: " + JSON.stringify(plan.map(m => m.kind)));
  await page.evaluate(() => window.__test.mission("lez", "0", 1));
  await page.waitForTimeout(500);
  await snap("leccion");
  let steps = 0;
  for (let i = 0; i < 40; i++) {
    const q = await page.$("[data-lq]:not([disabled])");
    if (q) { await q.click(); await page.waitForTimeout(250); }
    const nx = await page.$("#lesnext, #lesnext2");
    if (!nx) break;
    await page.waitForTimeout(250);
    await nx.click(); steps++;
    await page.waitForTimeout(250);
  }
  note("lección 1: " + steps + " pasos" + (/Lección|lista|completa/i.test(await text()) ? ", terminada" : ""));
  await page.evaluate(() => window.__test.mission("play", null, 1));
  await page.waitForTimeout(500);
  await snap("ronda");
  const n = await play(30);
  note("ronda de la semana 1: " + n + " respuestas");
  if (n < 5) errors.push("la ronda de la semana 1 respondió solo " + n);
  // the seminar of week 1: the text in sections, the map, the writing (seminario.js)
  const plan1 = await page.evaluate(() => window.__test.plan(1));
  if (!plan1.some(m => m.kind === "sem")) errors.push("la semana 1 no tiene la misión del seminario");
  if (!plan1.some(m => m.kind === "dil")) errors.push("la semana 1 no tiene el dilema");
  await page.evaluate(() => window.__test.mission("sem", "1", 1));
  await page.waitForTimeout(500);
  if ((await page.evaluate(() => window.__test.screen())) !== "seminario") errors.push("la misión no abrió el seminario");
  await snap("seminario-texto", true);
  let tramos = 0;
  for (let i = 0; i < 8; i++) {
    const chk = await page.$("[data-semchk]:not([disabled])");
    if (chk) { await chk.click(); await page.waitForTimeout(250); }
    if (await page.$("#semnext")) { await page.click("#semnext"); tramos++; await page.waitForTimeout(250); continue; }
    if (await page.$("#semtomap")) { await page.click("#semtomap"); tramos++; await page.waitForTimeout(300); break; }
  }
  note("seminario: " + tramos + " tramos leídos");
  const prem = await page.$$("[data-semp]");
  for (let k = 0; k < prem.length; k++) { await page.click("[data-semp]:not(.on) >> nth=0"); await page.waitForTimeout(120); }
  await page.click("#semreveal").catch(() => errors.push("no se pudo ver el mapa del argumento"));
  await page.waitForTimeout(300);
  await snap("seminario-mapa", true);
  if (!(await page.$(".sem-map"))) errors.push("el mapa del argumento no aparece");
  await page.click("#semtowrite");
  await page.waitForTimeout(300);
  await page.fill("#semtext", ("Saber que no sé es mejor, porque me deja aprender y revisar lo que creo. " ).repeat(14));
  await page.dispatchEvent("#semtext", "blur");
  const nrub = (await page.$$("[data-semrub]")).length;
  for (let k = 0; k < nrub; k++) { await page.check('[data-semrub="' + k + '"]'); await page.waitForTimeout(150); }
  await page.waitForTimeout(400);
  if (await page.$("#semsoc")) await page.click("#semsoc");          // the tutor without AI: the questions of the course
  await page.waitForTimeout(300);
  await snap("seminario-escrito", true);
  const semOk = await page.evaluate(() => { const r = (window.__test.state().sem || {})[1]; return !!(r && r.done); });
  if (!semOk) errors.push("el seminario de la semana 1 no quedó hecho");
  note("seminario hecho: " + semOk);
  // the dilemma, and «Tus posiciones»
  await page.evaluate(() => window.__test.mission("dil", "1:0", 1));
  await page.waitForTimeout(400);
  await page.click("[data-dilc] >> nth=0").catch(() => errors.push("el dilema no ofrece posiciones"));
  await page.waitForTimeout(300);
  if (await page.$("[data-dilkeep]")) await page.click("[data-dilkeep] >> nth=0");
  await page.waitForTimeout(300);
  await snap("dilema", true);
  if (!(await page.$(".dil-mine"))) errors.push("el dilema no muestra la posición elegida");
  // the literature of the week, in the week screen
  await page.evaluate(() => window.__test.briefing(1));
  await page.waitForTimeout(300);
  await snap("semana-1", true);
  const lit = await page.$$eval(".lit li", (li) => li.length).catch(() => 0);
  note("literatura de la semana 1: " + lit + " obras");
  if (!lit) errors.push("la semana 1 no muestra su literatura");

  // the pause and the review
  await page.evaluate(() => window.__test.start("pausa"));
  await page.waitForTimeout(500);
  const ids = await page.evaluate(() => (window.__test.round() || { items: [] }).items.map(x => x.id || ""));
  note("pausa: " + ids.length + " ítems");
  if (ids.some(id => /^(frase|lab|lettura|b:|suoni)/.test(id))) errors.push("la pausa trae cosas que no son del curso: " + ids.join(","));
  await play(15);
  // Yo: the profile
  await page.evaluate(() => { location.hash = ""; });
  await page.click("#nav button >> nth=2").catch(() => {});
  await page.waitForTimeout(600);
  await snap("yo", true);
  // the map of weeks and the screens of «Todo el material»: they draw, with no broken text
  const broken = async (label) => {
    const t = await text();
    if (/undefined|NaN|\[object /.test(t)) errors.push(label + ": texto roto: " + (t.match(/.{0,40}(undefined|NaN|\[object ).{0,40}/) || [""])[0]);
    return t;
  };
  await broken("Yo");
  await page.click("#nav button >> nth=1");
  await page.waitForTimeout(600);
  await snap("camino", true);
  const nodes = (await page.$$(".node")).length, nweeks = await page.evaluate(() => document.querySelectorAll(".season").length);
  note("camino: " + nodes + " semanas en " + nweeks + " estaciones");
  if (!nodes) errors.push("el camino no muestra las semanas");
  await broken("el camino");
  const screens = [["frasi", "Entrenar"], ["leggi", "Leer"], ["consultar", "Consultar"]];
  for (const sc of screens) {
    await page.click("#nav button >> nth=2");
    await page.waitForTimeout(400);
    await page.click('[data-goto="' + sc[0] + '"]').catch(() => errors.push("Yo no tiene el botón de " + sc[1]));
    await page.waitForTimeout(500);
    const scr = await page.evaluate(() => window.__test.screen());
    if (scr !== sc[0]) errors.push(sc[1] + ": abrió «" + scr + "»");
    await broken(sc[1]);
    await snap("material-" + sc[0], true);
  }
  // Consultar: a concept of the course
  if (await page.$("#cq")) {
    await page.fill("#cq", "arj");
    await page.waitForTimeout(400);
    const sug = (await page.$$("[data-cword]")).length;
    note("consultar «arj»: " + sug + " conceptos");
    if (!sug) errors.push("Consultar no encuentra conceptos del curso");
    if (sug) { await page.click("[data-cword] >> nth=0"); await page.waitForTimeout(300); await broken("Consultar, un concepto"); }
  }
  await page.click("#nav button >> nth=2");
  await page.waitForTimeout(400);
  if (await page.$("#toprog")) {
    await page.click("#toprog");
    await page.waitForTimeout(500);
    await broken("Tu progreso");
    await snap("progreso", true);
  } else errors.push("Yo no tiene «Tu progreso»");
  // the copy in a GitHub Gist, with the API simulated (smoke_nube.js)
  await require("./smoke_nube.js")(page, { code: "es", errors, note, snap: (p, name) => snap(name) });
  await page.evaluate(() => { location.hash = ""; });
  await page.click("#nav button >> nth=2").catch(() => {});
  await page.waitForTimeout(600);
  const yo = await text();
  if (/Via C1|Rumo|italiano|portugués/i.test(yo)) errors.push("Yo todavía nombra La Via C1 u otro idioma");
  if (/Cambiar a/.test(yo)) errors.push("Yo ofrece cambiar de edición, y hay una sola");
  // nothing is stored with the keys of La Via C1 (same origin: they must not touch)
  const keys = await page.evaluate(() => Object.keys(localStorage));
  note("claves guardadas: " + keys.join(", "));
  const foreign = keys.filter(k => !/^agora[.-]/.test(k));
  if (foreign.length) errors.push("claves fuera de «agora»: " + foreign.join(", "));
  // the service worker: its caches are «agora-…»
  await page.waitForTimeout(1500);
  const cacheNames = await page.evaluate(() => (window.caches ? caches.keys() : Promise.resolve([])));
  note("cachés: " + cacheNames.join(", "));
  if (cacheNames.some(k => !/^agora-/.test(k))) errors.push("cachés fuera de «agora-»: " + cacheNames.join(", "));
  // every era paints its own colors
  const bgs = [];
  for (let e = 1; e <= 8; e++) {
    await page.goto(base + "?test&era=" + e, { waitUntil: "networkidle" });
    await page.waitForFunction(() => window.__test && window.__test.state, null, { timeout: 15000 });
    await page.waitForTimeout(300);
    const got = await page.getAttribute("html", "data-era");
    if (got !== String(e)) errors.push("?era=" + e + " pintó la época " + got);
    bgs.push(await page.evaluate(() => getComputedStyle(document.body).backgroundColor));
    await snap("epoca-" + e);
  }
  note("fondos por época: " + bgs.join(" · "));
  if (new Set(bgs).size !== 8) errors.push("las ocho épocas no tienen ocho fondos distintos: " + bgs.join(" · "));
  // the progress stays after a reload
  const xp = await page.evaluate(() => window.__test.state().xp);
  await page.goto(base + "?test", { waitUntil: "networkidle" });
  await page.waitForFunction(() => window.__test && window.__test.state, null, { timeout: 15000 });
  const xp2 = await page.evaluate(() => window.__test.state().xp);
  if (xp2 !== xp || !xp) errors.push("no conservó el progreso: " + xp + " → " + xp2);
  note("al volver: " + xp2 + " xp");

  console.log(errors.length ? "\nERRORES:\n" + errors.join("\n") : "\nsin errores · Ágora");
  await browser.close(); srv.kill();
  process.exit(errors.length ? 1 : 0);
})();
