/* La corrección en el navegador (auditoría 3.0, eje 5), con la IA simulada:
   «✓ Vale» con nota (pt: *pra*), «🤖 Explicame» antes de la solución,
   «Explicame más» y «🙋 Mi respuesta es válida» en la hoja final, el juez de
   respuestas no previstas, Scrivi por unión, «Tus errores» y la tarea del
   tramo con las estructuras de la semana.  Las llamadas a Claude se
   contestan acá (page.route): la red del contenedor no llega.
     node tools/lib/smoke_correccion.js          (necesita Playwright)
     PORT=8742   puerto del servidor local
     SHOTS=dir   capturas a 390×844 */
"use strict";
const { chromium } = require("playwright");
const { spawn } = require("child_process");
const fs = require("fs");
const path = require("path");

function chromiumPath() {
  const base = "/opt/pw-browsers";
  try {
    const dir = fs.readdirSync(base).filter(d => /^chromium-\d+$/.test(d)).sort().pop();
    const exe = dir && path.join(base, dir, "chrome-linux", "chrome");
    return exe && fs.existsSync(exe) ? exe : null;
  } catch (e) { return null; }
}

// What the simulated AI answers, by what the request asks.
function aiAnswer(body) {
  const txt = [body.system || ""].concat((body.messages || []).map(m => m.content)).join("\n");
  if (/no está entre las previstas/.test(txt)) {
    const yes = /Respuesta del alumno: Eu estou com muita fome/.test(txt);
    return { correcta: yes, mismo_sentido: yes, explicacion: yes ? "*Estar com fome* es tan natural como *ter fome*: dice lo mismo." : "El verbo no concuerda con el sujeto: *eu vou*." };
  }
  if (/Tu método: no dar la respuesta de entrada/.test(txt)) return { pista1: "Mirá el verbo: ¿concuerda con *eu*?", pista2: "¿Cómo se conjuga *ir* con *eu* en presente?", explicacion: "Con *eu* va *vou*.", tambien_correcta: false, app_equivocada: false };
  if (/Un alumno respondió un ejercicio de una app/.test(txt)) return { tambien_correcta: false, app_equivocada: false, explicacion: "*Ir* es irregular: *eu vou*, *ele vai*. En español pasa lo mismo con «voy / va»: la primera persona no sigue el modelo. Otro ejemplo: *Eu vou ao cinema amanhã*." };
  if (/segundo profesor/.test(txt) || /Corregí su texto/.test(txt)) {
    return { errores: [
      { mal: "muy", bien: "muito", tipo: "muito", explicacion: "Delante de un adjetivo también va *muito*: *muito bonita*. En español se distingue «muy» de «mucho»; en portugués no.", foco: true },
      { mal: "praia", bien: "praia", tipo: "estilo", explicacion: "ok", foco: false },
      { mal: "comemos", bien: "almoçamos", tipo: "lexico", explicacion: "Para la comida del mediodía es más natural *almoçar*.", foco: false }
    ], corregido: "", consigna: "Cumple la consigna: cuenta qué hizo el fin de semana.", comentario: "Buen texto: se entiende todo. Practicá *muito*." };
  }
  return { ok: true };
}

(async () => {
  const port = +(process.env.PORT || 8742), shots = process.env.SHOTS || "";
  if (shots) fs.mkdirSync(shots, { recursive: true });
  const docs = path.join(__dirname, "..", "..", "docs");
  const srv = spawn("python3", ["-m", "http.server", String(port)], { cwd: docs, stdio: "ignore" });
  await new Promise(r => setTimeout(r, 1200));
  const browser = await chromium.launch().catch(() => chromium.launch({ executablePath: chromiumPath() }));
  const errors = [], seen = [];
  const base = "http://localhost:" + port + "/";
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, colorScheme: "light" });
  // a key of Anthropic, and Claude Haiku answered here
  await ctx.addInitScript(() => { try { localStorage.setItem("rumoc1.claude.key", "sk-ant-FAKE"); } catch (e) { /* */ } });
  await ctx.route(/api\.anthropic\.com/, async (route) => {
    const body = JSON.parse(route.request().postData() || "{}");
    return route.fulfill({ json: { model: "claude-haiku-5-5", stop_reason: "end_turn", content: [{ type: "text", text: JSON.stringify(aiAnswer(body)) }] } });
  });
  await ctx.route(/languagetool\.org/, (route) => route.fulfill({ json: { matches: [] } }));
  const page = await ctx.newPage();
  page.on("pageerror", e => errors.push("pageerror: " + e.message));
  page.on("console", m => { if (m.type() === "error" && !/Failed to load resource/.test(m.text())) errors.push("console: " + m.text()); });
  const snap = async (name, full) => { if (!shots) return; await page.waitForTimeout(400); await page.screenshot({ path: path.join(shots, name + ".png"), fullPage: !!full }); };
  const fail = (m) => errors.push(m);

  await page.goto(base + "?test", { waitUntil: "networkidle" });
  await page.waitForSelector(".pick-lang[data-lang='pt']", { timeout: 10000 });
  await page.click(".pick-lang[data-lang='pt']");
  await page.waitForSelector("#obnext", { timeout: 20000 });
  await page.click("[data-obwhy] >> nth=0");
  await page.click("[data-obmin='15']");
  await page.click("#obnext");
  await page.waitForSelector("#obzero");
  await page.click("#obzero");
  await page.waitForSelector("#obgo");
  await page.click("#obgo");
  await page.waitForTimeout(500);
  await page.evaluate(() => { const s = window.__test.state(); s.unlocked = 12; window.__test.fast = true; });

  const item = (id, stem, answer) => ({ id: id, src: "banca", bank: "tr", type: "translate", prompt: "Traducí al portugués", stem: stem, answer: answer, accept: [answer] });
  await page.evaluate((its) => window.__test.play(its, 12), [
    item("t:1", "Voy a la playa", "Eu vou para a praia"),
    item("t:2", "Mañana voy al cine", "Amanhã eu vou ao cinema"),
    item("t:3", "Tengo mucha hambre", "Eu tenho muita fome")
  ]);
  const send = async (txt) => { await page.fill("#ans", txt); await page.click("#send"); await page.waitForTimeout(500); };

  // 1. «pra» without a formal register: ✓ Vale with the note
  await page.waitForSelector("#ans");
  await send("Eu vou pra praia");
  const v1 = await page.textContent("#fb");
  if (!/Vale/.test(v1) || !/habla/.test(v1)) fail("pra: sin «✓ Vale» con la nota: " + v1.slice(0, 200));
  const xp1 = await page.evaluate(() => window.__test.round().xp);
  if (!(xp1 > 0)) fail("pra: sin xp");
  seen.push("✓ Vale: " + v1.replace(/\s+/g, " ").slice(0, 140));
  await snap("pt-vale-nota");
  await page.click("#next"); await page.waitForTimeout(400);

  // 2. a wrong verb: the prompt with «🤖 Explicame» (graded hints before the solution)
  await send("Amanhã eu vai ao cinema");
  if (!(await page.$("#aihint"))) fail("el primer intento fallado no ofrece «🤖 Explicame»");
  else {
    await page.click("#aihint");
    await page.waitForSelector("#aihintout .aiout", { timeout: 8000 }).catch(() => fail("las pistas de la IA no llegan"));
    await page.click("#aihint2").catch(() => fail("sin «Otra pista»"));
    await page.waitForTimeout(300);
    const h = await page.textContent("#aihintout");
    if (!/Otra pista/.test(h) || /Con \*eu\* va/.test(h)) fail("pistas: " + h);
    seen.push("pistas antes de la solución: " + h.replace(/\s+/g, " ").slice(0, 120));
    await snap("pt-explicame-pistas");
  }
  await page.click("#giveup"); await page.waitForTimeout(400);
  if (!(await page.$("#aiexp"))) fail("la hoja final no tiene «Explicame más»");
  if (!(await page.$("#claim"))) fail("la hoja de error no tiene «🙋 Mi respuesta es válida»");
  await page.click("#aiexp");
  await page.waitForSelector("#aiexpout .aiout", { timeout: 8000 }).catch(() => fail("«Explicame más» no llega"));
  const errsBefore = await page.evaluate(() => (window.__test.state().errLog || []).length);
  await page.click("#claim"); await page.waitForTimeout(800);
  const after = await page.evaluate(() => { const s = window.__test.state(); return { log: (s.errLog || []).length, notes: (s.aiNotes || []).map(n => n.kind) }; });
  if (after.log >= errsBefore || after.notes.indexOf("alumno") < 0) fail("«🙋» no deshizo el error o no lo anotó: " + JSON.stringify([errsBefore, after]));
  seen.push("🙋: errores " + errsBefore + " → " + after.log + ", notas " + after.notes.join(","));
  await snap("pt-hoja-final-valida", true);
  await page.click("#next"); await page.waitForTimeout(400);

  // 3. an answer not foreseen (the adverb at the end): the AI judges it before the verdict
  let it3 = await page.evaluate(() => window.__test.item());
  while (it3 && it3.retry) { await send(it3.answer); await page.click("#next"); await page.waitForTimeout(300); it3 = await page.evaluate(() => window.__test.item()); }
  if (it3 && it3.id === "t:3") {
    await send("Eu estou com muita fome");
    await page.waitForTimeout(1200);
    const v3 = await page.textContent("#fb");
    const vars = await page.evaluate(() => window.__test.state().variants || {});
    if (/Vale/.test(v3) && vars["t:3"]) seen.push("juez: " + v3.replace(/\s+/g, " ").slice(0, 120));
    else fail("juez: " + v3.slice(0, 200));
    await snap("pt-juez");
  }
  if (await page.$("#quit")) { await page.click("#quit"); await page.waitForTimeout(300); }

  // 4. Scrivi by union (week 3): the local marks and the AI's added
  await page.click("[data-tab='percorso']"); await page.waitForTimeout(300);
  await page.click("[data-week='3']"); await page.waitForSelector(".missions");
  if (await page.$("[data-m='scrivi']")) {
    await page.$eval("[data-m='scrivi']", b => b.click());
    await page.waitForSelector("#stext");
    await page.fill("#stext", "No sábado eu estava na praia com a minha família. A água estava muy fria, mas o dia foi bonito. Depois comemos peixe no restaurante do porto e voltamos pelo centro.");
    await page.click("#scheck");
    await page.waitForSelector("#sout .aiout", { timeout: 15000 }).catch(() => fail("Scrivi: la IA simulada no llegó"));
    const sc = await page.textContent("#sout");
    const nIA = (await page.$$("#sout .src")).length;
    if (!/muito/.test(sc)) fail("Scrivi: falta lo de la IA: " + sc.slice(0, 300));
    seen.push("Scrivi por unión: " + (await page.$$("#sout ol.findings li")).length + " marcas, " + nIA + " con fuente");
    await snap("pt-scrivi-union", true);
    // the same text again: the cache answers
    await page.click("#scheck");
    await page.waitForSelector("#sout .aiout", { timeout: 5000 });
    if (!/guardado en el teléfono/.test(await page.textContent("#sout"))) fail("Scrivi: el mismo texto volvió a preguntar (sin caché)");
    if (await page.$("#sdone")) { await page.click("#sdone"); await page.waitForTimeout(400); }
    else fail("Scrivi: el texto no se puede entregar");
  } else fail("la semana 3 no tiene Scrivi");

  // 5. «Tus errores» in Eu
  await page.click("[data-tab='io']"); await page.waitForTimeout(400);
  const el = await page.$("ul.errlog");
  if (!el) fail("sin «Tus errores»");
  else {
    await page.$eval("ul.errlog", e => e.scrollIntoView());
    const t = await page.textContent("ul.errlog");
    if (!/muito/.test(t)) fail("«Tus errores» no muestra la corrección de Scrivi: " + t.slice(0, 200));
    seen.push("Tus errores: " + t.replace(/\s+/g, " ").slice(0, 140));
    await page.$eval("ul.errlog", e => { const d = e.querySelector("details"); if (d) d.open = true; const c = e.closest(".card") || e; c.scrollIntoView(); window.scrollBy(0, -70); });
    await snap("pt-tus-errores");
  }
  const aic = await page.$("#aicard");
  if (aic) { await aic.scrollIntoViewIfNeeded(); await snap("pt-correcciones-para-revisar"); }

  // 6. the tramo task: the structures of the week, and Scrivi optional
  await page.evaluate(() => { const s = window.__test.state(); s.unlocked = 30; });
  await page.click("[data-tab='percorso']"); await page.waitForTimeout(300);
  await page.click("[data-week='30']"); await page.waitForSelector(".missions");
  const msc = await page.$$eval("[data-m='scrivi']", els => els.map(e => e.textContent));
  if (!msc.length || !/opcional/.test(msc[0])) fail("semana 30: el Scrivi corto no dice «opcional»: " + msc.join("|"));
  await page.$eval("[data-m='tr-scr']", b => b.click());
  await page.waitForTimeout(500);
  if (await page.$("#trfskip")) { await page.click("#trfskip"); await page.waitForTimeout(300); }
  await page.waitForSelector("#trtext");
  const model = await page.evaluate(() => window.TRAMO_DATA.SETTIMANE.filter(s => s.week === 30)[0].compito.model);
  await page.fill("#trtext", model);
  await page.click("#trcheck"); await page.waitForTimeout(600);
  const tr = await page.textContent("#trout");
  if (!/Estructuras de la semana/.test(tr)) fail("la tarea no muestra las estructuras de la semana");
  seen.push("tramo: " + (tr.match(/Estructuras de la semana[^✓✗○]*/) || [""])[0].slice(0, 120));
  await page.$eval("#trout", e => e.scrollIntoView());
  await snap("pt-tramo-estructuras");

  await browser.close();
  srv.kill();
  seen.forEach(s => console.log(s));
  if (errors.length) { console.log("\nFALLAS:\n" + errors.join("\n")); process.exit(1); }
  console.log("\nsin errores de JavaScript · la corrección en el navegador, ok");
})().catch((e) => { console.error(e); process.exit(1); });
