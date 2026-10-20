/* La prueba de humo de la serie Radio / Rádio (js/radio.js con el reproductor
   de js/tramo.js), llamada desde smoke_browser.js para cada idioma: la
   misión de la semana 6 abre el episodio (preguntas en castellano, sin la
   transcripción a la vista), se entrega con todo bien, aparece la
   transcripción, queda en state.radio y la misión queda hecha; el episodio
   de la 14 se abre desde Leggi / Ler con las preguntas en la lengua meta.

   module.exports = async (page, { code, errors, note, snap }) */
"use strict";

module.exports = async function radio(page, ctx) {
  const { code, errors, note, snap } = ctx;
  const fail = (m) => errors.push(code + " · radio: " + m);
  // Allena / Leggi left the bar in 3.4: reached from Io → «Todo el material»
  const tab = async (t) => {
    if (await page.$("[data-tab='" + t + "']")) await page.click("[data-tab='" + t + "']");
    else { await page.click("[data-tab='io']"); await page.waitForTimeout(250); await page.click("[data-goto='" + t + "']"); }
    await page.waitForTimeout(350);
  };
  const prev = await page.evaluate(() => window.__test.state().unlocked);
  await page.evaluate(() => { const s = window.__test.state(); s.unlocked = Math.max(s.unlocked, 14); delete s.radio; });

  // the mission of week 6, from the percorso
  await tab("percorso");
  await page.click("[data-week='6']");
  await page.waitForSelector(".missions");
  if (!(await page.$("[data-m='radio']"))) { fail("la semana 6 no tiene la misión de la radio"); return; }
  const title = (await page.textContent("[data-m='radio'] b")).trim();
  await page.$eval("[data-m='radio']", (b) => b.click());
  await page.waitForSelector("#trdeliver", { timeout: 5000 }).catch(() => fail("la misión no abre el episodio"));
  if (!(await page.$("#trdeliver"))) return;
  const h1 = (await page.textContent("h1")).trim();
  if (!/📻/.test(h1)) fail("el episodio no se titula con 📻: " + h1);
  const ep = await page.evaluate(() => window.Radio.episode(6));
  const body = await page.textContent("#app");
  if (body.indexOf(ep.turns[1][1].slice(0, 25)) >= 0 && await page.evaluate(() => !!window.speechSynthesis)) fail("la transcripción se ve antes de entregar");
  const qEs = await page.$$eval(".equestions li > b", (els) => els.map((e) => e.getAttribute("lang")));
  if (!qEs.length || qEs.some(Boolean)) fail("semana 6: las preguntas no están en castellano (" + JSON.stringify(qEs) + ")");
  note(code + " · radio: " + title.replace(/\s+/g, " ") + " · " + (await page.$$(".equestions li")).length + " preguntas");
  await snap(page, code + "-radio-6");
  // everything right
  await page.evaluate((e) => {
    e.questions.forEach((q, i) => {
      const r = Array.from(document.querySelectorAll('input[name="tq' + i + '"]')).find((x) => x.value === q[2]);
      if (r) r.checked = true;
    });
    e.info.forEach((v, i) => { const r = document.querySelector('input[name="ti' + i + '"][value="' + (v[1] ? "y" : "n") + '"]'); if (r) r.checked = true; });
  }, ep);
  await page.click("#trdeliver");
  await page.waitForSelector(".scorebig", { timeout: 4000 }).catch(() => fail("entregar no muestra el resultado"));
  const score = await page.textContent(".scorebig b").catch(() => "");
  if (!/100/.test(score)) fail("con todo bien no da 100 %: " + score);
  const after = await page.textContent("#app");
  if (after.indexOf(ep.turns[ep.turns.length - 1][1].slice(0, 25)) < 0) fail("después de entregar no aparece la transcripción");
  const rec = await page.evaluate(() => (window.__test.state().radio || {})[6]);
  if (!rec || rec.pct !== 100) fail("no quedó en state.radio: " + JSON.stringify(rec));
  if (!/Misión hecha/.test(await page.textContent("#trverdict").catch(() => ""))) fail("el resultado no dice que la misión está hecha");
  await snap(page, code + "-radio-6-hecho", true);
  await page.click("#trdone");
  await page.waitForSelector(".missions", { timeout: 4000 }).catch(() => fail("«Listo» no vuelve a la semana"));
  if (!(await page.$(".mission.done[data-m='radio']"))) fail("la misión de la radio no queda hecha");

  // week 14, from Leggi / Ler: questions in the target language
  await tab("leggi");
  await page.waitForSelector("details.capa[data-capa='lg:radio']", { timeout: 4000 }).catch(() => fail("Leggi no tiene la serie de la radio"));
  if (await page.$("details.capa[data-capa='lg:radio']")) {
    await page.$eval("details.capa[data-capa='lg:radio']", (d) => { d.open = true; d.querySelectorAll("details").forEach((x) => { x.open = true; }); });
    await page.$eval("[data-radio='14']", (b) => b.click()).catch(() => fail("no está el episodio de la semana 14"));
    await page.waitForSelector("#trdeliver", { timeout: 4000 }).catch(() => fail("el episodio 14 no abre desde Leggi"));
    const q14 = await page.$$eval(".equestions li > b", (els) => els.map((e) => e.getAttribute("lang")));
    if (!q14.length || !q14.every(Boolean)) fail("semana 14: las preguntas no están en la lengua meta");
    note(code + " · radio 14 desde Leggi: " + (await page.textContent("h1")).trim());
    await page.click("#trback");
    await page.waitForTimeout(300);
  }
  await page.evaluate((u) => { window.__test.state().unlocked = u; }, prev);
};
