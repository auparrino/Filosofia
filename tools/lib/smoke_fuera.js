/* La prueba de humo de «Fuera de la app» (js/fuera.js), llamada desde
   smoke_browser.js para cada idioma: la misión opcional de la semana 6 abre
   la ficha (enlace afuera, preguntas en castellano), un toque de +10 min
   suma minutos e input, la pregunta se marca, el «contalo» pasa por el
   corrector, y la misión queda hecha; la ficha de la 20 se abre desde
   Leggi / Ler con las preguntas en la lengua meta.

   module.exports = async (page, { code, errors, note, snap }) */
"use strict";

module.exports = async function fuera(page, ctx) {
  const { code, errors, note, snap } = ctx;
  const fail = (m) => errors.push(code + " · fuera: " + m);
  // Allena / Leggi left the bar in 3.4: reached from Io → «Todo el material»
  const tab = async (t) => {
    if (await page.$("[data-tab='" + t + "']")) await page.click("[data-tab='" + t + "']");
    else { await page.click("[data-tab='io']"); await page.waitForTimeout(250); await page.click("[data-goto='" + t + "']"); }
    await page.waitForTimeout(350);
  };
  const prev = await page.evaluate(() => window.__test.state().unlocked);
  await page.evaluate(() => { const s = window.__test.state(); s.unlocked = Math.max(s.unlocked, 20); delete s.fuera; });

  await tab("percorso");
  await page.click("[data-week='6']");
  await page.waitForSelector(".missions");
  if (!(await page.$("[data-m='fuera']"))) { fail("la semana 6 no tiene la misión de afuera"); return; }
  await page.$eval("[data-m='fuera']", (b) => b.click());
  await page.waitForSelector("#fugo", { timeout: 5000 }).catch(() => fail("la misión no abre la ficha"));
  if (!(await page.$("#fugo"))) return;
  const f = await page.evaluate(() => window.Fuera.ficha(6));
  const link = await page.$eval("#fugo", (a) => [a.getAttribute("href"), a.getAttribute("target"), a.getAttribute("rel")]);
  if (link[0] !== f.url || link[1] !== "_blank" || !/noopener/.test(link[2])) fail("el enlace no se abre afuera: " + JSON.stringify(link));
  const qEs = await page.$$eval(".fu-q li > span", (els) => els.map((e) => e.getAttribute("lang")));
  if (qEs.length !== 3 || qEs.some(Boolean)) fail("semana 6: las preguntas no están en castellano (" + JSON.stringify(qEs) + ")");
  note(code + " · fuera: " + (await page.textContent("h1")).trim());
  await snap(page, code + "-fuera-6");

  await page.click("[data-fumin='10']");
  await page.waitForTimeout(400);
  const st = await page.evaluate(() => window.__test.state().fuera);
  if (!st || !st.w[6] || st.w[6].min !== 10) fail("+10 min no quedó anotado: " + JSON.stringify(st));
  if (!/10 min/.test(await page.textContent("#fumins").catch(() => ""))) fail("la línea de minutos no dice 10 min");
  if (!(await page.$("#fuundo"))) fail("no aparece «Deshacer el último»");
  await page.click("[data-fuq='0']");
  if (!(await page.evaluate(() => !!window.__test.state().fuera.w[6].q[0]))) fail("la pregunta no queda marcada");
  await page.fill("#futext", code === "it" ? "Ho visto un video. Le persone parlano del lavoro e della città. Mi è piaciuto molto." : "Eu vi um vídeo. As pessoas falam do trabalho e da cidade. Eu gostei muito.");
  await page.click("#fucheck");
  await page.waitForSelector("#fuout .card", { timeout: 4000 }).catch(() => fail("«Revisar» no muestra el corrector"));
  await snap(page, code + "-fuera-6-hecho", true);
  await page.click("#fuback");
  await page.waitForSelector(".missions", { timeout: 4000 }).catch(() => fail("volver no lleva a la semana"));
  if (!(await page.$(".mission.done[data-m='fuera']"))) fail("la misión de afuera no queda hecha");

  await tab("leggi");
  await page.waitForSelector("details.capa[data-capa='lg:fuera']", { timeout: 4000 }).catch(() => fail("Leggi no tiene las fichas de afuera"));
  if (await page.$("details.capa[data-capa='lg:fuera']")) {
    if (!/10 min/.test(await page.textContent(".capa-input").catch(() => ""))) fail("el input de 7 días no suma los minutos de afuera");
    await page.$eval("details.capa[data-capa='lg:fuera']", (d) => { d.open = true; d.querySelectorAll("details").forEach((x) => { x.open = true; }); });
    await page.$eval("details.capa[data-capa='lg:fuera'] [data-fuera='20']", (b) => b.click()).catch(() => fail("no está la ficha de la semana 20"));
    await page.waitForSelector("#fugo", { timeout: 4000 }).catch(() => fail("la ficha 20 no abre desde Leggi"));
    const q20 = await page.$$eval(".fu-q li > span", (els) => els.map((e) => e.getAttribute("lang")));
    if (q20.length !== 3 || !q20.every(Boolean)) fail("semana 20: las preguntas no están en la lengua meta");
    await page.click("#fuback");
    await page.waitForTimeout(300);
    if (!(await page.$("details.capa[data-capa='lg:fuera']"))) fail("volver no lleva a Leggi");
  }
  await page.evaluate((u) => { window.__test.state().unlocked = u; }, prev);
};
