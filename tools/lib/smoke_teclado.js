/* El teclado de la app (docs/js/teclado.js) en el navegador, en cada idioma:
   - en un celular (pantalla táctil), la caja de la respuesta lleva
     inputmode="none" y al tomar el foco aparece el teclado de la app, con
     las letras de la lengua (ä ö ü ß en alemán, à è ì ò ù en italiano…);
   - las teclas escriben donde está el cursor (con ⇧, ⌫ y la capa 123),
     también escribiendo rápido con dos dedos y tocando entre dos teclas, y
     ↵ manda la respuesta como el Enter de siempre;
   - ⌨️ pasa al teclado del teléfono (sin inputmode, sin panel) y el ⌨️ de
     la fila de acentos vuelve al de la app; la elección queda guardada;
   - con mouse y teclado físico (una computadora) no aparece nada.
     NODE_PATH=$(npm root -g) node tools/lib/smoke_teclado.js
     LANGS=it,pt,de   los idiomas (por defecto, todos los de boot.js)
     SHOTS=dir        capturas a 390×844 */
"use strict";
const { chromium } = require("playwright");
const { spawn } = require("child_process");
const fs = require("fs"), path = require("path");
const Boot = require("../../docs/js/boot.js");

function chromiumPath() {
  const base = "/opt/pw-browsers";
  try {
    const dir = fs.readdirSync(base).filter(d => /^chromium-\d+$/.test(d)).sort().pop();
    return dir && ["chrome-linux", "chrome-linux64"].map(d => path.join(base, dir, d, "chrome")).filter(f => fs.existsSync(f))[0];
  } catch (e) { return undefined; }
}

(async () => {
  const port = +(process.env.PORT || 8766), shots = process.env.SHOTS || "";
  const langs = (process.env.LANGS || Object.keys(Boot.LANGS).join(",")).split(",");
  if (shots) fs.mkdirSync(shots, { recursive: true });
  const srv = spawn("python3", ["-m", "http.server", String(port)], { cwd: path.join(__dirname, "..", "..", "docs"), stdio: "ignore" });
  await new Promise(r => setTimeout(r, 1200));
  const browser = await chromium.launch().catch(() => chromium.launch({ executablePath: chromiumPath() }));
  const errors = [], base = "http://localhost:" + port + "/";
  const note = (s) => console.log("· " + s);

  async function open(code, mobile) {
    const ctx = await browser.newContext(mobile ? { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true }
                                                : { viewport: { width: 1200, height: 800 } });
    const page = await ctx.newPage();
    // the choice saved before v3.11.3 (c1.kb), often by mistake, is not inherited
    if (mobile) await page.addInitScript(() => { try { if (!sessionStorage.getItem("kbseed")) { localStorage.setItem("c1.kb", "phone"); sessionStorage.setItem("kbseed", "1"); } } catch (e) { /* */ } });
    page.on("pageerror", e => errors.push(code + ": pageerror: " + e.message));
    await page.goto(base + "?test&lang=" + code, { waitUntil: "networkidle" });
    await page.waitForFunction(() => window.__test && window.__test.state && window.Teclado, null, { timeout: 20000 });
    return page;
  }
  // a question to write, and the box with the focus
  async function ask(page, answer, id) {
    await page.evaluate(([a, i]) => window.__test.play([{ id: i, type: "translate", prompt: "Traducí.", stem: "prueba", answer: a, accept: [a] }], 1), [answer, id]);
    await page.waitForSelector("#ans", { timeout: 5000 });
    await page.waitForTimeout(350);
    await page.focus("#ans");
    await page.waitForTimeout(250);
  }
  const panelOn = (page) => page.evaluate(() => { const p = document.getElementById("kbapp"); return !!p && !p.hidden; });
  const tap = async (page, k) => { await page.click('#kbapp [data-k="' + k + '"]'); await page.waitForTimeout(40); };

  for (const code of langs) {
    const page = await open(code, true);
    const special = await page.evaluate(() => (window.LANG.ui.keys || []).filter(c => c.length === 1 && /[^a-z'\-]/.test(c))[0]);
    const word = "ab" + (special || "");
    await ask(page, word, "kb-" + code + "-1");
    const im = await page.getAttribute("#ans", "inputmode");
    if (im !== "none") errors.push(code + ": la caja no lleva inputmode=none (" + im + ")");
    if (!(await panelOn(page))) errors.push(code + ": el teclado de la app no apareció");
    const keys = await page.$$eval("#kbapp [data-k]", bs => bs.map(b => b.getAttribute("data-k")));
    if (special && keys.indexOf(special) < 0) errors.push(code + ": falta la tecla «" + special + "» (" + keys.join("") + ")");
    if (shots) await page.screenshot({ path: path.join(shots, code + "-teclado.png") });
    // typing: a, ⇧ B → «aB», ⌫, b, the special letter, and ↵ sends it
    await tap(page, "a"); await tap(page, "shift"); await tap(page, "B");
    let v = await page.inputValue("#ans");
    if (v !== "aB") errors.push(code + ": ⇧ no puso la mayúscula: «" + v + "»");
    await tap(page, "back"); await tap(page, "b");
    if (special) await tap(page, special);
    v = await page.inputValue("#ans");
    if (v !== word) errors.push(code + ": las teclas escribieron «" + v + "», no «" + word + "»");
    if ((await page.evaluate(() => document.activeElement && document.activeElement.id)) !== "ans") errors.push(code + ": la caja perdió el foco al tocar teclas");
    // typing fast with two thumbs: the next finger lands before the last one lifts
    // (real touches, by CDP); and a touch in the gap between two keys
    const cdp = await page.context().newCDPSession(page);
    const at = (k) => page.$eval('#kbapp [data-k="' + k + '"]', b => { const r = b.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2, r: r.right, top: r.top }; });
    const touch = (type, pts) => cdp.send("Input.dispatchTouchEvent", { type, touchPoints: pts });
    const before = await page.inputValue("#ans");
    const ka = await at("e"), kb = await at("r"), kc = await at("t");
    // (touchStart lists every finger down; touchEnd, the ones that lift)
    const A = { x: ka.x, y: ka.y, id: 1 }, B = { x: kb.x, y: kb.y, id: 2 }, C = { x: kc.x, y: kc.y, id: 3 };
    await touch("touchStart", [A]);
    await touch("touchStart", [A, B]);
    await touch("touchEnd", [A]);
    await touch("touchStart", [B, C]);
    await touch("touchEnd", [B]);
    await touch("touchEnd", [C]);
    const G = { x: kc.r + 1, y: kc.y, id: 4 };   // between t and the next key
    await touch("touchStart", [G]);
    await touch("touchEnd", [G]);
    await page.waitForTimeout(150);
    const fast = (await page.inputValue("#ans")).slice(before.length);
    if (!/^ert.$/.test(fast)) errors.push(code + ": escribiendo rápido con dos dedos quedó «" + fast + "», no «ert» y una letra más");
    for (let i = 0; i < fast.length; i++) await tap(page, "back");
    await tap(page, "123"); await tap(page, "1"); await tap(page, "back"); await tap(page, "abc");
    await tap(page, "enter");
    await page.waitForTimeout(500);
    const fb = await page.$("#fb .feedback.giusto, .feedback.giusto");
    if (!fb) errors.push(code + ": ↵ no mandó la respuesta (o no se corrigió como buena)");
    note(code + " · teclado de la app: " + keys.filter(k => k.length === 1).join("") + " · escribió «" + v + "» y ↵ la mandó");
    // ⌨️: to the phone's keyboard, and back from the accents row
    await ask(page, "x", "kb-" + code + "-2");
    await tap(page, "phone");
    await page.waitForTimeout(300);
    const after = await page.evaluate(() => ({ im: document.querySelector("#ans").getAttribute("inputmode"), mode: window.Teclado.mode(),
      panel: !document.getElementById("kbapp").hidden, back: !!document.querySelector(".accents [data-kbapp]") }));
    if (after.im === "none" || after.mode !== "phone" || after.panel) errors.push(code + ": ⌨️ no pasó al teclado del teléfono: " + JSON.stringify(after));
    if (!after.back) errors.push(code + ": falta el ⌨️ para volver en la fila de acentos");
    await ask(page, "x", "kb-" + code + "-3");
    if ((await page.getAttribute("#ans", "inputmode")) === "none" || await panelOn(page)) errors.push(code + ": la elección del teclado del teléfono no quedó");
    await page.click(".accents [data-kbapp]");
    await page.waitForTimeout(400);
    const back = await page.evaluate(() => ({ im: document.querySelector("#ans").getAttribute("inputmode"), mode: window.Teclado.mode() }));
    if (back.im !== "none" || back.mode !== "app") errors.push(code + ": el ⌨️ de la fila no volvió al teclado de la app: " + JSON.stringify(back));
    if (!(await panelOn(page))) errors.push(code + ": al volver, el teclado de la app no se abrió");
    note(code + " · ⌨️ al teclado del teléfono y vuelta");
    // a box where Enter does not send (a long text): ↵ is a new line
    await page.evaluate(() => {
      const t = document.createElement("textarea");
      t.id = "kblong"; t.setAttribute("data-kb", "1"); t.setAttribute("inputmode", "none");
      document.getElementById("app").appendChild(t);
    });
    await page.focus("#kblong");
    await page.waitForTimeout(250);
    await tap(page, "a"); await tap(page, "enter"); await tap(page, "b");
    const long = await page.inputValue("#kblong");
    if (long !== "a\nb") errors.push(code + ": ↵ en un texto largo no hizo un renglón nuevo: " + JSON.stringify(long));
    // ▾ hides the keyboard and changes nothing: the next box opens it again
    await tap(page, "hide");
    await page.waitForTimeout(250);
    if (await panelOn(page)) errors.push(code + ": ▾ no ocultó el teclado");
    if ((await page.evaluate(() => window.Teclado.mode())) !== "app") errors.push(code + ": ▾ cambió de teclado");
    await page.focus("#kblong");
    await page.waitForTimeout(250);
    if (!(await panelOn(page))) errors.push(code + ": después de ▾ la caja no volvió a abrir el teclado de la app");
    // a box drawn and focused at once, before the app marks it (Scrivi):
    // marked on the focus, with the app's keyboard
    await page.evaluate(() => {
      const t = document.createElement("textarea");
      t.id = "kbnew"; t.className = "grow scrivi";
      document.getElementById("app").appendChild(t);
      t.focus();
    });
    await page.waitForTimeout(400);
    const nb = await page.evaluate(() => ({ im: document.querySelector("#kbnew").getAttribute("inputmode"), act: document.activeElement && document.activeElement.id }));
    if (nb.im !== "none" || nb.act !== "kbnew" || !(await panelOn(page))) errors.push(code + ": una caja enfocada antes de marcarla no abrió el teclado de la app: " + JSON.stringify(nb));
    // with the phone's keyboard, a box without a row of accents: the button on top brings the app's back
    await tap(page, "phone");
    await page.waitForTimeout(300);
    await page.focus("#kbnew");
    await page.waitForTimeout(250);
    const chip = await page.evaluate(() => { const c = document.getElementById("kbchip"); return !!c && !c.hidden; });
    if (!chip) errors.push(code + ": con el teclado del teléfono no aparece «⌨️ Teclado de la app»");
    else {
      await page.click("#kbchip");
      await page.waitForTimeout(400);
      if ((await page.evaluate(() => window.Teclado.mode())) !== "app" || !(await panelOn(page))) errors.push(code + ": «⌨️ Teclado de la app» no volvió al teclado de la app");
    }
    await page.context().close();

    // a computer: nothing changes
    const pc = await open(code, false);
    await ask(pc, "x", "kb-" + code + "-pc");
    if ((await pc.getAttribute("#ans", "inputmode")) === "none" || await panelOn(pc)) errors.push(code + ": en la computadora apareció el teclado de la app");
    await pc.context().close();
  }
  console.log(errors.length ? "\nERRORES:\n" + errors.join("\n") : "\nsin errores · teclado de la app en " + langs.join(", "));
  await browser.close(); srv.kill();
  process.exit(errors.length ? 1 : 0);
})();
