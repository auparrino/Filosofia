/* El alemán en el navegador (docs/lang/de/: las seis semanas de A1, en
   construcción).  Elige Deutsch en el selector, pasa el primer arranque,
   recorre Heute, el Weg, la semana 1 con su lección y su ronda, la pausa,
   el repaso e Ich, y cambia de idioma y vuelve: ningún error de la página,
   ningún archivo pedido que no exista, y lo que el paquete todavía no tiene
   (frases, lecturas, examen…) no aparece.
     NODE_PATH=$(npm root -g) node tools/lib/smoke_aleman.js
     SHOTS=dir   capturas a 390×844 */
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
  const snap = async (name, full) => { if (!shots) return; await page.waitForTimeout(400); await page.screenshot({ path: path.join(shots, "de-" + name + ".png"), fullPage: !!full }); };
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
  await page.waitForSelector(".pick-lang[data-lang='de']", { timeout: 10000 });
  await snap("selector");
  await page.click(".pick-lang[data-lang='de']");
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
  if ((await page.getAttribute("html", "data-lang")) !== "de") errors.push("html data-lang no es de");
  const h1 = (await page.textContent("h1")).trim();
  note("Heute: " + h1 + " · pestañas: " + (await page.$$eval("#nav button", b => b.map(x => x.textContent.trim()).join(" "))));
  if (!/Guten|Hallo/.test(h1) && !/Woche|semana/i.test(await text())) errors.push("Heute no saluda en alemán: " + h1);
  await snap("heute", true);

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
  if (ids.some(id => /^(frase|lab|lettura|b:|suoni)/.test(id))) errors.push("la pausa trae cosas que no son del alemán: " + ids.join(","));
  await play(15);
  // Ich: the profile, the language switch
  await page.evaluate(() => { location.hash = ""; });
  await page.click("#nav button >> nth=2").catch(() => {});
  await page.waitForTimeout(600);
  await snap("ich", true);
  const ich = await text();
  if (!/Cambiar a/.test(ich)) errors.push("Ich no ofrece cambiar de idioma");
  note("Ich: " + (await page.$$eval("[data-switchlang]", b => b.map(x => x.textContent.trim()).join(" | "))));
  // to Italian and back: each keeps its progress
  const xp = await page.evaluate(() => window.__test.state().xp);
  await page.click("[data-switchlang='it']");
  await page.waitForTimeout(2500);
  if ((await page.getAttribute("html", "data-lang")) !== "it") errors.push("no cambió al italiano");
  await page.goto(base + "?test&lang=de", { waitUntil: "networkidle" });
  await page.waitForFunction(() => window.__test && window.__test.state, null, { timeout: 15000 });
  const xp2 = await page.evaluate(() => window.__test.state().xp);
  if (xp2 !== xp || !xp) errors.push("el alemán no conservó su progreso: " + xp + " → " + xp2);
  note("de vuelta al alemán: " + xp2 + " xp");

  console.log(errors.length ? "\nERRORES:\n" + errors.join("\n") : "\nsin errores · alemán");
  await browser.close(); srv.kill();
  process.exit(errors.length ? 1 : 0);
})();
