/* La prueba de humo de los módulos que nadie abría con app.js (auditoría
   F §2.5), llamada desde smoke_browser.js para cada idioma: Leggi y Allena
   plegadas (con un tope de alto), la lectura cronometrada, «Consultar» (el
   diccionario, Mi gramática sin tope de semana, Palabra por palabra, mapas y
   fórmulas), la Biblioteca (lector y misión del percorso), la escritura
   guiada (C-test sobre la lectura larga, Ordená sobre la escucha), un duelo,
   Tres lenguas (contrastes abiertos, duelo, fichas al repaso) y Tres vueltas.

   module.exports = async (page, { code, errors, note, snap }) */
"use strict";

const WORDS = { it: { word: "casa", gram: "congiuntivo", phrase: "Ce l'ho fatta, ma non gliel'ho detto." },
                pt: { word: "casa", gram: "subjuntivo", phrase: "Me dá uma mão, que a gente já vai embora." } };

module.exports = async function modulos(page, ctx) {
  const { code, errors, note, snap } = ctx;
  const P = (n) => code + "-" + n;
  const W = WORDS[code];
  const fail = (m) => errors.push(code + " · módulos: " + m);
  // Allena / Leggi left the bar in 3.4: reached from Io → «Todo el material»
  const tab = async (t) => {
    if (await page.$("[data-tab='" + t + "']")) await page.click("[data-tab='" + t + "']");
    else { await page.click("[data-tab='io']"); await page.waitForTimeout(250); await page.click("[data-goto='" + t + "']"); }
    await page.waitForTimeout(350);
  };
  const height = () => page.evaluate(() => document.documentElement.scrollHeight);
  const openFold = async (key) => {
    const sel = "details.capa[data-capa='" + key + "']";
    if (!(await page.$(sel))) { fail("no está la sección «" + key + "»"); return false; }
    await page.$eval(sel, (d) => { d.open = true; });
    await page.waitForTimeout(150);
    return true;
  };
  // A learner in week 30 who read the long text and heard the long listening of the week.
  await page.evaluate(() => {
    const s = window.__test.state();
    s.unlocked = 30;
    s.letture = s.letture || {}; s.letture["l-30"] = { pct: 80, at: Date.now() };
    s.tramo = s.tramo || {}; s.tramo.asc = s.tramo.asc || {}; s.tramo.asc[30] = { pct: 80, ok: 6, n: 7, at: Date.now() };
    window.__test.fast = true;
  });

  /* ------------------------------------------------ Leggi, plegada */
  await tab("leggi");
  await page.waitForSelector(".capa-week");
  const hL = await height();
  if (hL > 3000) fail("Leggi mide " + hL + " px (tope 3000)");
  note(code + " · Leggi: " + hL + " px, " + (await page.$$eval(".capa-week [data-ep], .capa-week [data-trasc], .capa-week [data-bxread]", (e) => e.length)) + " cosas de esta semana");
  await openFold("lg:sett");
  const cur = await page.$$eval("details.capa[data-capa^='lg:sett:'][open] [data-ep]", (e) => e.length);
  if (!cur) fail("La settimana: la estación actual no está abierta");
  await snap(page, P("leer-plegado"), true);

  /* ---------------------------------- la lectura cronometrada */
  const epId = await page.$eval(".capa-week [data-ep]:not([disabled])", (b) => b.dataset.ep).catch(() => null);
  if (!epId) fail("Leggi: no hay lectura de esta semana");
  else {
    await page.click(".capa-week [data-ep='" + epId + "']");
    await page.waitForSelector("#lquiz");
    if (!/Terminé/.test(await page.textContent("#lquiz"))) fail("la lectura no dice «Terminé»");
    await page.click("#lquiz");
    await page.waitForTimeout(300);
    // the clock ran a minute (the test does not wait for it)
    const pend = await page.evaluate((id) => { const s = window.__test.state(); const p = s.lectura && s.lectura.pend[id]; if (p) p.ms = 60000; return p; }, epId);
    if (!pend || !pend.words) fail("«Terminé» no guardó el tiempo de la lectura");
    for (let i = 0; i < 20; i++) {
      const it = await page.evaluate(() => { const x = window.__test.item(); return x && JSON.parse(JSON.stringify(x)); });
      if (!it) break;
      if (it.type === "hunt") {
        const ks = await page.evaluate((id) => window.Letture.huntTargets(window.Letture.byId(id)), it.ep);
        for (const k of ks) await page.$eval("[data-tok='" + k + "']", (b) => b.click());
        await page.click("#hcheck");
      } else if (await page.$("[data-opt]")) {
        const opts = await page.$$eval("[data-opt]", (els) => els.map((e) => e.textContent.trim()));
        const k = Math.max(0, opts.indexOf(String(it.answer).trim()));
        await page.$eval("[data-opt] >> nth=" + k, (b) => b.click()).catch(async () => { await page.click("[data-opt] >> nth=" + k); });
      } else break;
      await page.waitForTimeout(250);
      if (await page.$("#next")) { await page.click("#next"); await page.waitForTimeout(250); }
      if (await page.$(".speed-note")) break;
    }
    await page.waitForSelector(".speed-note", { timeout: 4000 }).catch(() => {});
    const sn = await page.$(".speed-note");
    if (!sn) fail("el resultado de la lectura no dice las palabras por minuto");
    else note(code + " · lectura cronometrada: " + (await sn.textContent()).trim().slice(0, 90));
    const runs = await page.evaluate(() => (window.__test.state().lectura || {}).runs || []);
    if (!runs.length) fail("la lectura con buena comprensión no quedó en la curva");
    await snap(page, P("lectura-velocidad"));
    if (await page.$("#quit")) await page.click("#quit");
    await page.waitForTimeout(300);
  }
  await tab("leggi");
  await openFold("lg:speed");
  if (!(await page.$("svg.speed-curve"))) fail("la curva de velocidad no se dibuja");

  /* ------------------------------------------------ la Biblioteca */
  await openFold("lg:bib");
  await page.click("#bx-open");
  await page.waitForSelector("[data-bxread]", { timeout: 15000 }).catch(() => fail("la Biblioteca no cargó"));
  if (await page.$("[data-bxread]")) {
    await page.click(".bx-rec [data-bxread], [data-bxread] >> nth=0");
    await page.waitForSelector(".bx-page .w", { timeout: 15000 }).catch(() => fail("el lector no abrió el capítulo"));
    if (await page.$(".bx-page .w")) {
      await page.click(".bx-page .w >> nth=3");
      await page.waitForSelector("#bxbox.on", { timeout: 3000 }).catch(() => fail("tocar una palabra no abre su ficha"));
      await snap(page, P("biblioteca-lector"));
      note(code + " · biblioteca: " + (await page.textContent(".bx-head b")).trim());
      if (await page.$("#bxclose")) await page.click("#bxclose");
    }
  }

  /* ------------------- el percorso: Biblioteca, Tres vueltas, escritura guiada */
  await tab("percorso");
  await page.click("[data-week='30']");
  await page.waitForSelector(".missions");
  const ms = await page.$$eval("[data-m]", (els) => els.map((e) => e.dataset.m));
  ["lib", "esc-ordenar", "b-ident", "b-err"].forEach((k) => { if (ms.indexOf(k) < 0) fail("la semana 30 no tiene la misión «" + k + "»"); });
  ["esc-huecos", "tre"].forEach((k) => { if (ms.indexOf(k) >= 0) fail("la semana 30 todavía tiene la misión «" + k + "»"); });
  const hasTre = ms.indexOf("tre") >= 0;
  note(code + " · semana 30: " + ms.filter((k) => /lib|esc-|tre/.test(k)).join(", "));
  if (ms.indexOf("esc-huecos") >= 0) {
    await page.$eval("[data-m='esc-huecos']", (b) => b.click());
    await page.waitForSelector(".esc-in", { timeout: 5000 }).catch(() => fail("el C-test de la semana no abrió"));
    const head = await page.textContent("h1");
    const n = (await page.$$(".esc-in")).length;
    note(code + " · C-test semana 30: " + head.replace(/\s+/g, " ").trim().slice(0, 80) + " · " + n + " huecos");
    if (n < 15) fail("C-test de la semana 30 con " + n + " huecos");
    await snap(page, P("ctest-larga"));
    await page.click("#escback");
    await page.waitForSelector(".missions");
  }
  if (ms.indexOf("esc-ordenar") >= 0) {
    await page.$eval("[data-m='esc-ordenar']", (b) => b.click());
    await page.waitForSelector(".esc-pool", { timeout: 5000 }).catch(() => fail("«Ordená» de la semana no abrió"));
    note(code + " · Ordená semana 30: " + (await page.$$(".esc-pool [data-escput]")).length + " piezas · " + (await page.textContent(".lead")).slice(0, 40));
    await snap(page, P("ordenar-escucha"));
    await page.click("#escback");
    await page.waitForSelector(".missions");
  }
  if (hasTre) {
    await page.$eval("[data-m='tre']", (b) => b.click());
    await page.waitForSelector("#epgo", { timeout: 5000 }).catch(() => fail("Tres vueltas no abrió"));
    note(code + " · Tres vueltas abre desde el percorso");
    await page.click("#epback").catch(() => {});
    await page.waitForTimeout(300);
  }

  /* ------------------------------------------------ Allena, plegada */
  await tab("frasi");
  await page.waitForSelector(".capa-week");
  const hA = await height();
  if (hA > 3000) fail("Allena mide " + hA + " px (tope 3000)");
  note(code + " · Allena: " + hA + " px");
  // escritura guiada desde Allena
  await openFold("al:esc");
  await page.click("[data-esc='huecos']");
  await page.waitForSelector("[data-escopen]", { timeout: 5000 }).catch(() => fail("la lista de textos del C-test no abrió"));
  const kinds = await page.$$eval(".esc-pick small", (els) => els.map((e) => e.textContent.split(" · ")[0]));
  if (!kinds.some((k) => /larga/i.test(k)) || !kinds.some((k) => /Escucha/i.test(k))) fail("el C-test no ofrece la lectura larga y la escucha: " + kinds.slice(0, 4).join(", "));
  await page.click("#escback");
  await page.waitForTimeout(300);
  // un duelo
  await openFold("al:duel");
  const duel = await page.$("details[data-capa='al:duel'] [data-duel]:not([disabled])");
  if (!duel) fail("no hay duelos abiertos en la semana 30");
  else {
    await duel.click();
    await page.waitForTimeout(400);
    const it = await page.evaluate(() => window.__test.item());
    if (!it || !/^duel:/.test(it.id)) fail("el duelo no arrancó");
    else note(code + " · duelo: " + it.id);
    if (await page.$("[data-opt]")) { await page.click("[data-opt] >> nth=0"); await page.waitForTimeout(300); }
    await snap(page, P("duelo"));
    await page.click("#quit");
    await page.waitForTimeout(300);
  }

  /* ------------------------------------------------ Tres lenguas */
  await tab("frasi");
  await openFold("al:tres");
  await page.click("details[data-capa='al:tres'] [data-tres='menu']");
  await page.waitForSelector("[data-tres='topic']");
  await page.click("[data-tres='topic'] >> nth=0");
  await page.waitForSelector("details.tl-c");
  note(code + " · Tres lenguas: " + (await page.$$("details.tl-c")).length + " contrastes en el primer tema");
  await page.click("[data-tres='menu']");
  await page.waitForSelector("[data-tres='topic']");
  if (await page.$("[data-tres='on']")) { await page.click("[data-tres='on']"); await page.waitForTimeout(300); }
  await page.click("[data-tres='duel']");
  for (let i = 0; i < 40; i++) {
    const kind = await page.evaluate(() => {
      const b = document.querySelector("[data-tres='lang'], [data-tres='clean'], [data-tres='fix'], [data-tres='next']");
      return b ? b.dataset.tres : null;
    });
    if (!kind) break;
    // always the first option: some wrong on purpose
    await page.click("[data-tres='" + kind + "'] >> nth=0");
    await page.waitForTimeout(80);
  }
  const tres = await page.evaluate(() => { const s = window.__test.state(); return { t: s.tres, cards: Object.keys(s.cards).filter((k) => /^tres:/.test(k)).length }; });
  if (!tres.t || !tres.t.rounds) fail("Tres lenguas no guardó en el estado del idioma");
  if (!tres.cards) fail("el duelo con errores no mandó fichas al repaso");
  note(code + " · Tres lenguas: mejor " + ((tres.t && tres.t.best) || {}).duel + " %, " + tres.cards + " fichas al repaso");
  await snap(page, P("tres-duelo"));

  /* ------------------------------------------------ Consultar */
  await tab("frasi");
  await page.click("[data-consultar]");
  await page.waitForSelector("#cq");
  await page.fill("#cq", W.word);
  await page.waitForSelector(".cq-pick", { timeout: 4000 }).catch(() => fail("el diccionario no sugiere nada para «" + W.word + "»"));
  if (await page.$(".cq-pick")) {
    await page.click(".cq-pick >> nth=0");
    await page.waitForSelector("#cqword");
    const hits = (await page.$$("#cqword .ref-hits li")).length;
    if (hits < 3) fail("la ficha de «" + W.word + "» trae " + hits + " usos reales");
    note(code + " · diccionario: «" + (await page.textContent("#cqword h2")).trim() + "» · " + hits + " usos");
    await snap(page, P("consultar-palabra"), true);
  }
  await page.click("[data-ref-gram='1']");
  await page.waitForSelector("#refq");
  await page.fill("#refq", W.gram);
  await page.waitForTimeout(300);
  const g = await page.evaluate(() => ({ seen: document.querySelectorAll("details.ref-item:not(.ahead)").length,
                                          ahead: document.querySelectorAll("details.ref-item.ahead").length }));
  if (!g.ahead) fail("Mi gramática no muestra lo que viene (sin tope de semana)");
  note(code + " · Mi gramática «" + W.gram + "»: " + g.seen + " vistas + " + g.ahead + " que vienen");
  const ah = await page.$("details.ref-item.ahead summary");
  if (ah) { await ah.click(); await page.waitForTimeout(200); if (!(await page.$("details.ref-item.ahead[open] .note"))) fail("un bloque que viene no avisa la semana"); }
  await snap(page, P("mi-gramatica"));
  await page.click("#refback");
  await page.waitForSelector("#cq");
  await page.click("[data-csub='desglose']");
  await page.fill("#cphrase", W.phrase);
  await page.click("#cdes");
  const dl = (await page.$$("#cdesout li")).length;
  if (!dl) fail("Palabra por palabra no desarmó «" + W.phrase + "»");
  await page.click("#chome");
  if (await page.$("[data-csub='mapas']")) {
    await page.click("[data-csub='mapas']");
    const nm = (await page.$$("figure.mapa")).length;
    if (!nm) fail("los mapas no se dibujan");
    await page.click("#chome");
    note(code + " · mapas: " + nm);
  }
  if (await page.$("[data-csub='formule']")) {
    await page.click("[data-csub='formule']");
    const nf = (await page.$$(".formule-list li")).length;
    if (!nf) fail("las fórmulas fijas no aparecen");
    note(code + " · fórmulas: " + nf);
    await page.click("#chome");
  }
  await page.click("#cback");
  await page.waitForSelector(".capa-week");
};
