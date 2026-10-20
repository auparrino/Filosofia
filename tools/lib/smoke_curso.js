/* Ágora en el navegador (cada edición de docs/lang/: por ahora, la
   castellana).  Abre la app (con una sola edición no hay selector), pasa el
   primer arranque, recorre Hoy, el camino, la semana 1 con su lección y su
   ronda, la pausa, el repaso y Yo; mira que la época se pinte (data-era) y
   que nada quede de La Via C1 (título, claves del guardado, cachés):
   ningún error de la página, ningún archivo pedido que no exista, y lo que
   la edición todavía no tiene (frases, lecturas, examen…) no aparece.
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
  for (let e = 1; e <= 6; e++) {
    await page.goto(base + "?test&era=" + e, { waitUntil: "networkidle" });
    await page.waitForFunction(() => window.__test && window.__test.state, null, { timeout: 15000 });
    await page.waitForTimeout(300);
    const got = await page.getAttribute("html", "data-era");
    if (got !== String(e)) errors.push("?era=" + e + " pintó la época " + got);
    bgs.push(await page.evaluate(() => getComputedStyle(document.body).backgroundColor));
    await snap("epoca-" + e);
  }
  note("fondos por época: " + bgs.join(" · "));
  if (new Set(bgs).size !== 6) errors.push("las seis épocas no tienen seis fondos distintos: " + bgs.join(" · "));
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
