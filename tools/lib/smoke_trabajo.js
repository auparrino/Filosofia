/* La prueba de humo de «Para el trabajo» (js/trabajo.js), llamada desde
   smoke_browser.js para cada idioma: la misión opcional de la semana de la
   primera escena abre la escena (diálogo con 🔊, la traducción a pedido,
   las frases), la ronda de producción arranca y al salir vuelve a la
   escena, la tarea pasa por el corrector y muestra el modelo, y con la
   producción aprobada la misión queda hecha; la escena se abre también desde
   Allena / Treino.  Un idioma sin escenas no muestra nada.

   module.exports = async (page, { code, errors, note, snap }) */
"use strict";

module.exports = async function trabajo(page, ctx) {
  const { code, errors, note, snap } = ctx;
  const fail = (m) => errors.push(code + " · trabajo: " + m);
  const tab = async (t) => {
    if (await page.$("[data-tab='" + t + "']")) await page.click("[data-tab='" + t + "']");
    else { await page.click("[data-tab='io']"); await page.waitForTimeout(250); await page.click("[data-goto='" + t + "']"); }
    await page.waitForTimeout(350);
  };
  const first = await page.evaluate(() => { const l = window.Trabajo ? window.Trabajo.scenes() : []; return l.length ? { id: l[0].id, week: l[0].week, model: l[0].compito.model } : null; });
  if (!first) {
    await tab("frasi");
    if (await page.$("details.capa[data-capa='al:trab']")) fail("sin escenas, Allena no debería tener la sección");
    note(code + " · trabajo: sin escenas todavía");
    return;
  }
  const prev = await page.evaluate(() => window.__test.state().unlocked);
  await page.evaluate((w) => { const s = window.__test.state(); s.unlocked = Math.max(s.unlocked, w); delete s.trabajo; }, first.week);

  await tab("percorso");
  await page.click("[data-week='" + first.week + "']");
  await page.waitForSelector(".missions");
  if (!(await page.$("[data-m='trabajo']"))) { fail("la semana " + first.week + " no tiene la misión de trabajo"); return; }
  await page.$eval("[data-m='trabajo']", (b) => b.click());
  await page.waitForSelector("#trback", { timeout: 5000 }).catch(() => fail("la misión no abre la escena"));
  if (!(await page.$("#trback"))) return;
  note(code + " · trabajo: " + (await page.textContent("h1")).trim());
  const turns = await page.$$eval("[data-trsay]", (els) => els.length);
  if (turns < 10) fail("el diálogo tiene " + turns + " turnos con 🔊");
  await page.click("[data-trsay='0']");
  if (await page.$(".tr-es")) fail("la traducción se ve antes de pedirla");
  await page.click("#tres");
  await page.waitForTimeout(200);
  if ((await page.$$eval(".tr-es", (els) => els.length)) !== turns) fail("«Ver la traducción» no muestra todos los turnos");
  await snap(page, code + "-trabajo-escena");

  // the production round, and back to the scene
  await page.click("#trprod");
  await page.waitForSelector("#quit", { timeout: 5000 }).catch(() => fail("«Escribir» no arranca la ronda"));
  if (await page.$("#quit")) {
    await page.click("#quit");
    await page.waitForSelector("#trback", { timeout: 5000 }).catch(() => fail("salir de la ronda no vuelve a la escena"));
  }
  if (!(await page.$("#trback"))) return;

  // the task: the checker and the model
  if (await page.$(".tr-model")) fail("el modelo se ve antes de escribir");
  await page.fill("#trtext", first.model);
  await page.click("#trcheck");
  await page.waitForSelector("#trout .card", { timeout: 4000 }).catch(() => fail("«Revisar» no muestra el corrector"));
  if (!(await page.$(".tr-model"))) fail("después de revisar no aparece el modelo");
  const st = await page.evaluate((id) => window.__test.state().trabajo[id], first.id);
  if (!st || !st.paid || !st.n) fail("la tarea no quedó guardada: " + JSON.stringify(st));
  await snap(page, code + "-trabajo-tarea", true);
  await page.evaluate((id) => { window.__test.state().trabajo[id].p = 80; }, first.id);
  await page.click("#trback");
  await page.waitForSelector(".missions", { timeout: 4000 }).catch(() => fail("volver no lleva a la semana"));
  if (!(await page.$(".mission.done[data-m='trabajo']"))) fail("con la producción y el mail, la misión no queda hecha");

  // from Allena / Treino
  await tab("frasi");
  await page.waitForSelector("details.capa[data-capa='al:trab']", { timeout: 4000 }).catch(() => fail("Allena no tiene la sección de trabajo"));
  if (await page.$("details.capa[data-capa='al:trab']")) {
    await page.$eval("details.capa[data-capa='al:trab']", (d) => { d.open = true; d.querySelectorAll("details").forEach((x) => { x.open = true; }); });
    await page.$eval("details.capa[data-capa='al:trab'] [data-trabajo='" + first.id + "']", (b) => b.click()).catch(() => fail("no está la escena en Allena"));
    await page.waitForSelector("#trback", { timeout: 4000 }).catch(() => fail("la escena no abre desde Allena"));
    if (await page.$("#trback")) {
      await page.click("#trback");
      await page.waitForTimeout(300);
      if (!(await page.$("details.capa[data-capa='al:trab']"))) fail("volver no lleva a Allena");
    }
  }
  await page.evaluate((u) => { window.__test.state().unlocked = u; }, prev);
};
