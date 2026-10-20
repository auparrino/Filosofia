/* Prueba de humo en el navegador de la app entera, con sus dos idiomas
   (no corre en npm test; sí en el CI, job «smoke»).  Para cada idioma (italiano, portugués):
   el selector inicial, las tres pantallas del primer arranque, Oggi/Hoje con
   una sola tarjeta y después con el plan del día (5 / 15 / 30 minutos,
   la semana arriba de Oggi), una pausa, Suoni/Sons, una lectura con
   karaoke, el camino y la semana 1, una lección, el dictogloss, Io/Eu, el
   examen C1 (smokeEsame: cada prueba de la primera versión, el resultado,
   el intento siguiente y un simulacro), «Tu progreso», el modo mantenimiento después del examen,
   «Parola o no? / Palavra ou não?», la copia en un GitHub Gist con la API
   simulada (smoke_nube.js), los módulos de las capas
   (smoke_modulos.js: Leggi y Allena plegadas, lectura cronometrada,
   Consultar, Biblioteca, escritura guiada, duelos, Tres lenguas, Tres
   vueltas), el cambio de idioma desde el
   perfil y la vuelta; después, que quien ya estudiaba italiano entra directo
   sin selector, y que el service worker guarda el núcleo y el paquete
   elegido.  Falla si hay errores de JavaScript en la consola o si la app
   pide un archivo que no existe (las rutas viejas docs/data/…, audio/cv/…).

   Requiere Playwright:  npm run smoke  (NODE_PATH=$(npm root -g) node tools/lib/smoke_browser.js)
   Chromium: el que Playwright instaló para su versión (npx playwright
   install chromium, o PLAYWRIGHT_BROWSERS_PATH); si no está, el más nuevo
   de /opt/pw-browsers.
   Variables opcionales:
     SHOTS=ruta  guarda capturas a 390 px de ancho, en claro y en oscuro
     LANGS=it,pt los idiomas a probar (por defecto los dos)
     PORT=8765   puerto del servidor local */
const { chromium } = require("playwright");
const { spawn } = require("child_process");
const fs = require("fs");
const path = require("path");

function chromiumPath() {
  const base = "/opt/pw-browsers";
  try {
    const dir = fs.readdirSync(base).filter(d => /^chromium-\d+$/.test(d)).sort().pop();
    const exe = dir && ["chrome-linux", "chrome-linux64"].map(d => path.join(base, dir, d, "chrome")).filter(f => fs.existsSync(f))[0];
    return exe || undefined;
  } catch (e) { return undefined; }
}

// What each language calls things (the first tab, the profile), to check that
// the right package is on screen.
const NAMES = { it: { today: "Oggi", me: "Io", other: "pt" }, pt: { today: "Hoje", me: "Eu", other: "it" } };

/* The C1 exam, from its screen: the first version, every prova answered
   with the data (escucha con el monólogo y su tabla, lectura con la
   ricostruzione, las tarefas con su insumo), the result of the version, a
   new attempt with the next one and a mock exam with a given one. */
async function smokeEsame(page, code, P, snap, note, errors) {
  const V = await page.evaluate(() => { const E = window.EsameData; return (E.versioni || E.versoes).map(v => v.id); });
  const label = (id) => "versión " + id.replace(/^v/, "");
  const onScreen = async () => (await page.textContent("#app")).replace(/\s+/g, " ");
  if (V.length < 3) errors.push(code + ": el examen tiene " + V.length + " versiones");
  if (!(await onScreen()).includes("Estás haciendo la " + label(V[0]))) errors.push(code + ": el examen no empieza por la " + label(V[0]));
  // what the version asks, from the data (the same shape as the app's)
  const data = (vid) => page.evaluate((vid) => {
    const E = window.EsameData, find = (l, id) => (l || []).find(x => x.id === id);
    if (E.versione && E.versioni) return JSON.parse(JSON.stringify(E.versione(vid)));
    const v = find(E.versoes, vid);
    return JSON.parse(JSON.stringify({ id: vid, ascolto: find(E.ascolto, v.ascolto), lettura: find(E.lettura, v.lettura), scrittura: v.scrittura }));
  }, vid);
  const v = await data(V[0]);
  const score = async () => { await page.waitForSelector(".scorebig", { timeout: 60000 }); return parseInt(await page.textContent(".scorebig b"), 10); };

  // Ascolto: the dialogue (and the monologue with its table), all right
  await page.click("[data-prova='ascolto']");
  await page.waitForSelector("#econsegna2");
  const cells = await page.$$eval("[data-cell]", els => els.length);
  if (v.monologo && cells !== v.monologo.tabella.length) errors.push(code + ": la tabla del monólogo tiene " + cells + " filas");
  if (!v.monologo && cells) errors.push(code + ": una tabla sin monólogo");
  if (await page.$("[data-eplay='d']")) {
    await page.click("[data-eplay='d']");
    const st = await page.textContent("[data-estate='d']");
    if (!/Escucha 1 de 2/.test(st)) errors.push(code + ": la escucha del examen no arrancó: " + st);
  }
  await page.evaluate((v) => {
    const a = v.ascolto;
    a.questions.forEach((q, i) => { const r = [...document.querySelectorAll('input[name="q' + i + '"]')].find(x => x.value === q[2]); if (r) r.checked = true; });
    a.completa.forEach((c, i) => { const inp = document.querySelector('[data-gap="' + i + '"]'); if (inp) inp.value = c[1]; });
    // the table with the other accepted forms («quindici», «2.100»): Tramo.cellOk
    if (v.monologo) v.monologo.tabella.forEach((c, i) => { const inp = document.querySelector('[data-cell="' + i + '"]'); if (inp) inp.value = (c[2] && c[2][0]) || c[1]; });
  }, v);
  if (v.monologo) { await page.$eval("[data-eplay='m']", el => el.scrollIntoView()); await snap(page, P("examen-monologo")); }
  await page.click("#econsegna2");
  const asc = await score();
  if (asc !== 100) errors.push(code + ": la escucha del examen, toda bien, da " + asc + " %");
  note(code + " · examen " + V[0] + ": escucha " + asc + " %" + (v.monologo ? " (con el monólogo, " + cells + " datos)" : ""));
  await page.click("#eback3");

  // Lettura: titles, true/false and, in Italian, the ricostruzione in order
  await page.click("[data-prova='lettura']");
  await page.waitForSelector("#econsegna3");
  await page.evaluate((l) => {
    l.match.forEach((want, i) => { const s = document.querySelector('[data-par="' + i + '"]'); if (s) s.value = String(want); });
    l.vf.forEach((x, i) => { const r = document.querySelector('input[name="vf' + i + '"][value="' + (x[1] ? "v" : "f") + '"]'); if (r) r.checked = true; });
  }, v.lettura);
  if (v.ricostruzione) {
    if (!(await page.$("#eric"))) errors.push(code + ": falta la ricostruzione");
    // one out of place, taken back, then the right order
    await page.click("[data-ericput='2']"); await page.click("[data-ericback='0']");
    for (let k = 1; k < v.ricostruzione.paragraphs.length; k++) await page.click("[data-ericput='" + k + "']");
    await page.$eval("#eric", el => el.scrollIntoView());
    await snap(page, P("examen-ricostruzione"));
  } else if (await page.$("#eric")) errors.push(code + ": una ricostruzione sin datos");
  await page.click("#econsegna3");
  const let_ = await score();
  if (let_ !== 100) errors.push(code + ": la lectura del examen, toda bien, da " + let_ + " %");
  note(code + " · examen " + V[0] + ": lectura " + let_ + " %" + (v.ricostruzione ? " (con la ricostruzione)" : ""));
  await page.click("#eback3");

  // Strutture: the items of the version (Italian: item.ver)
  await page.click("[data-prova='strutture']");
  await page.waitForTimeout(500);
  const it3 = await page.evaluate(() => { const r = window.__test.round(); return r && r.items.map(x => x.ver || ""); });
  if (code === "it" && (!it3 || !it3.length || it3.some(x => x !== V[0]))) errors.push(code + ": las strutture no son de la versión " + V[0] + ": " + it3);
  note(code + " · examen: estructuras, " + (it3 ? it3.length : 0) + " ítems");
  if (await page.$("#quit")) { await page.click("#quit"); await page.waitForTimeout(300); }

  // Scrittura: the texts (the tarefas with their insumo) and the review without a key
  await page.click("[data-prova='scrittura']");
  await page.waitForSelector("#econsegna4");
  const boxes = await page.$$eval(".edraft", els => els.map(e => e.dataset.id));
  if (boxes.length !== v.scrittura.length) errors.push(code + ": la escritura muestra " + boxes.length + " textos de " + v.scrittura.length);
  const ins = v.scrittura.filter(t => t.insumo);
  if (ins.length) {
    const audios = await page.$$eval("[data-eplay^='t']", els => els.length), reads = await page.$$eval(".call", els => els.length);
    if (audios !== ins.filter(t => t.insumo.tipo === "audio").length || reads !== ins.length) errors.push(code + ": insumos de las tarefas: " + audios + " audios, " + reads + " bloques");
    if (await page.$("[data-eplay='t2']")) { await page.click("[data-eplay='t2']"); await page.waitForTimeout(200); }
  }
  await snap(page, P("examen-escritura"));
  const src = v.lettura.paragraphs.join(" ").split(/\s+/);
  for (let i = 0; i < boxes.length; i++) {
    const t = v.scrittura[i], n = Math.round(t.words * 0.9);
    await page.fill("textarea[data-id='" + boxes[i] + "']", src.slice(i * 20, i * 20 + n).join(" "));
  }
  await page.click("#econsegna4");
  const scr = await score();
  const parts = await page.$$eval("#app h3", els => els.map(e => e.textContent.trim()));
  if (!(scr > 0 && scr <= 100) || parts.length < boxes.length) errors.push(code + ": la escritura del examen: " + scr + " % · " + parts.join(" | "));
  await snap(page, P("examen-escritura-nota"), true);
  note(code + " · examen " + V[0] + ": escritura sin clave " + scr + " % (" + parts.slice(0, boxes.length).join(" | ") + ")");
  await page.click("#eback3");

  // The result of the version, a new attempt with the next one, a mock exam
  await page.evaluate(() => {
    const E = window.__test.state().esame, r = E.v[E.ver];
    ["ascolto", "lettura", "strutture", "lessico", "scrittura"].forEach(p => { if (!r.p[p]) r.p[p] = { ok: 7, n: 10, pct: 70, at: Date.now() }; });
  });
  await page.click("[data-prova='ascolto']"); await page.waitForSelector("#eback2"); await page.click("#eback2");
  await page.waitForSelector("#enext");
  const nx = await page.getAttribute("#enext", "data-ver");
  if (nx !== V[1]) errors.push(code + ": el intento siguiente no es la " + label(V[1]) + " sino " + nx);
  if (!(await onScreen()).includes("Las versiones")) errors.push(code + ": el resultado no muestra las otras versiones");
  await snap(page, P("examen-resultado"), true);
  await page.click("#enext");
  await page.waitForTimeout(300);
  if (!(await onScreen()).includes("Estás haciendo la " + label(V[1]))) errors.push(code + ": «Nuevo intento» no pasó a la " + label(V[1]));
  await page.evaluate((id) => window.__test.esame(id), V[2]);
  await page.waitForTimeout(300);
  const sim = await onScreen();
  if (!sim.includes("Estás haciendo la " + label(V[2]))) errors.push(code + ": el simulacro con la " + label(V[2]) + " no abrió");
  const st = await page.evaluate(() => { const E = window.__test.state().esame; return { ver: E.ver, best: Object.keys(E.v).filter(k => E.v[k].best), last: !!E.last }; });
  if (st.best.join() !== V[0] || !st.last) errors.push(code + ": state.esame no guardó la versión hecha: " + JSON.stringify(st));
  note(code + " · examen: resultado de la " + label(V[0]) + ", nuevo intento con la " + label(V[1]) + ", simulacro con la " + label(V[2]));
  await page.evaluate(() => { delete window.__test.state().esame; });
}

(async () => {
  const port = +(process.env.PORT || 8765);
  const docs = path.join(__dirname, "..", "..", "docs");
  const shots = process.env.SHOTS || "";
  const langs = (process.env.LANGS || "it,pt").split(",");
  if (shots) fs.mkdirSync(shots, { recursive: true });
  const srv = spawn("python3", ["-m", "http.server", String(port)], { cwd: docs, stdio: "ignore" });
  await new Promise(r => setTimeout(r, 1200));
  // Playwright's own Chromium (the CI installs it); otherwise the one in
  // /opt/pw-browsers, whatever Playwright version is around.
  const browser = await chromium.launch().catch((e) => {
    const exe = chromiumPath();
    if (!exe) throw e;
    return chromium.launch({ executablePath: exe });
  });
  const errors = global.errors = [];
  const seen = global.seen = [];
  const note = (s) => { seen.push(s); };
  const base = "http://localhost:" + port + "/";

  async function newPage(scheme, init) {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, colorScheme: scheme });
    if (init) await ctx.addInitScript(init);
    const page = await ctx.newPage();
    page.on("pageerror", e => errors.push("pageerror: " + e.message));
    // a network failure towards an outside host (Commons, without internet) is
    // not a bug: the app falls back to the phone's voice
    page.on("console", m => { if (m.type() === "error" && !/Failed to load resource: net::ERR_/.test(m.text())) errors.push("console: " + m.text()); });
    page.on("response", r => { if (r.url().startsWith(base) && r.status() >= 400) errors.push("HTTP " + r.status() + " " + r.url().slice(base.length)); });
    return page;
  }
  const snap = async (page, name, full) => {
    if (!shots) return;
    await page.waitForTimeout(450);
    await page.screenshot({ path: path.join(shots, name + ".png"), fullPage: !!full });
  };
  const tabs = async (page) => (await page.$$eval("#nav button", els => els.map(e => e.textContent.trim()))).join(" ");

  for (const code of langs) {
    const N = NAMES[code], P = (n) => code + "-" + n;
    const page = await newPage("light"); global.lastPage = page;
    // the first visit: the language picker
    await page.goto(base + "?test", { waitUntil: "networkidle" });
    await page.waitForSelector(".pick-lang[data-lang='" + code + "']", { timeout: 10000 });
    await snap(page, "selector-claro");
    await page.click(".pick-lang[data-lang='" + code + "']");
    // The first start: three screens, once, without the tab bar.
    await page.waitForSelector("#obnext", { timeout: 20000 });
    if (!(await page.$eval("#nav", n => n.hidden))) errors.push(code + ": la barra de pestañas se ve durante el primer arranque");
    await snap(page, P("inicio-1"), true);
    await page.click("[data-obwhy] >> nth=0");
    await page.click("[data-obmin='15']");
    await page.click("#obnext");
    await page.waitForSelector("#obtest");
    await snap(page, P("inicio-2"));
    // italiano: por el test de ubicación (y «Empiezo de cero» adentro); portugués: de cero
    if (code === "it") { await page.click("#obtest"); await page.waitForSelector("#ubskip"); await snap(page, P("inicio-test")); await page.click("#ubskip"); }
    else await page.click("#obzero");
    await page.waitForSelector("#obgo");
    await snap(page, P("inicio-3"), true);
    const onbTabs = await page.$$eval(".onb-tabs li", els => els.length);
    if (onbTabs !== 3) errors.push(code + ": «Cómo funciona» no nombra las tres pestañas (" + onbTabs + ")");
    await page.click("#obgo");
    // Until the first lesson, a single card.
    await page.waitForSelector("#hoyfirst", { timeout: 5000 });
    const firstCards = await page.$$eval("#app .card", els => els.length);
    if (firstCards !== 1) errors.push(code + ": el primer día Oggi tiene " + firstCards + " tarjetas, no una");
    const r0 = await page.evaluate(() => { const s = window.__test.state(); return [s.ritmo && s.ritmo.min, s.onboard && !!s.onboard.at, s.ideal && s.ideal.why]; });
    if (r0[0] !== 15 || !r0[1] || !r0[2]) errors.push(code + ": el primer arranque no guardó la meta: " + JSON.stringify(r0));
    note(code + " · primer arranque: meta " + r0[0] + " min, para qué «" + r0[2] + "»");
    const h = await page.getAttribute("html", "data-lang");
    if (h !== code) errors.push(code + ": html data-lang = " + h);
    if (!(await tabs(page)).includes(N.today)) errors.push(code + ": las pestañas no son del idioma: " + (await tabs(page)));
    note(code + " · " + N.today + ": " + (await page.textContent("h1")).trim() + " · pestañas: " + (await tabs(page)));
    await snap(page, P("hoy-claro"), true);

    // the answer box lets the keyboard suggest (no autocomplete="off": with it
    // Gboard neither detects the language nor lets you pick it from its bar)
    // and never autocorrects; «Teclado sin sugerencias» puts it back
    const kb = await page.evaluate(async () => {
      const it = { id: "kb-1", type: "translate", prompt: "Traducí.", stem: "hola", answer: "x", accept: ["x"] };
      const box = () => { const a = document.querySelector("#ans"); return a && [a.getAttribute("autocomplete"), a.getAttribute("autocorrect"), a.getAttribute("lang")]; };
      window.__test.play([it], 1);
      await new Promise((r) => setTimeout(r, 300));
      const off = box();
      const s = window.__test.state(); s.kbQuiet = true;
      window.__test.play([Object.assign({}, it, { id: "kb-2" })], 1);
      await new Promise((r) => setTimeout(r, 300));
      const on = box();
      s.kbQuiet = false;
      return { off, on };
    });
    if (!kb.off || !kb.on) errors.push(code + ": teclado: no apareció el campo de respuesta");
    else if (kb.off[0] !== null || kb.off[1] !== "off" || kb.on[0] !== "off" || kb.on[1] !== "off" || !kb.off[2])
      errors.push(code + ": teclado: " + JSON.stringify(kb) + " (por defecto sin autocomplete, siempre autocorrect off)");
    if (await page.$("#quit")) { await page.click("#quit"); await page.waitForTimeout(300); }

    // a pausa: answer the items whatever they are (the first day it is not
    // on screen: it appears once a lesson was read)
    await page.evaluate(() => window.__test.start("pausa"));
    await page.waitForSelector(".card", { timeout: 5000 });
    for (let i = 0; i < 6; i++) {
      const it = await page.evaluate(() => window.__test && window.__test.item());
      if (!it) break;
      if (i === 1) await snap(page, P("ronda-claro"));
      if (await page.$("#next")) { await page.click("#next"); await page.waitForTimeout(350); continue; }
      if (it.options && await page.$("[data-opt]")) {
        try { await page.click("[data-opt] >> nth=0", { timeout: 2000 }); } catch (e) { /* re-rendered */ }
      } else if (await page.$("#ans")) { await page.fill("#ans", it.answer); await page.click("#send"); }
      else if (await page.$("#wans")) { await page.fill("#wans", it.answer); await page.click("#wsend"); }
      else if (await page.$("#tcheck")) { const n = (await page.$$("[data-tile]")).length; for (let k = 0; k < n; k++) { try { await page.click("#tbank [data-tile] >> nth=0", { timeout: 1500 }); } catch (e) { break; } } await page.click("#tcheck"); }
      else if (await page.$("#reveal")) { await page.click("#reveal"); await page.click("[data-fq='2']"); }
      else break;
      await page.waitForTimeout(400);
      if (i === 0) await snap(page, P("feedback-claro"));
      if (await page.$("#next")) { await page.click("#next"); await page.waitForTimeout(400); }
    }
    note(code + " · pausa jugada");
    if (await page.$("#quit")) { await page.click("#quit"); await page.waitForTimeout(300); }

    // The correction: a wrong option and a wrong typed answer (the bank's
    // translations, week 15).  A wrong option is never «Casi»; the sheet
    // says the right form before the why, is read aloud (aria-live) and
    // leaves the focus on «Siguiente»; a sentence in Spanish is not «Casi»;
    // «Tus errores» keeps the why of each error.
    await page.evaluate(() => { const s = window.__test.state(); s.unlocked = Math.max(s.unlocked || 1, 15); window.__test.fast = true; window.__test.start("b-tr", null, 15); });
    await page.waitForTimeout(400);
    let sawChoice = false, sawTyped = false;
    for (let i = 0; i < 12 && !(sawChoice && sawTyped); i++) {
      const it = await page.evaluate(() => { const x = window.__test.item(); return x && JSON.parse(JSON.stringify(x)); });
      if (!it) break;
      if (!sawChoice && await page.$("[data-opt]")) {
        const opts = await page.$$eval("[data-opt]", els => els.map(e => e.textContent));
        const k = opts.findIndex(o => o.trim().toLowerCase() !== String(it.answer).trim().toLowerCase());
        await page.click("[data-opt] >> nth=" + k);
        await page.waitForSelector("#fb .feedback");
        const fb = await page.evaluate(() => {
          const box = document.querySelector("#fb .feedback"), all = Array.from(box.querySelectorAll(".sol, .diag, .diff"));
          return { cls: box.className, live: document.querySelector("#fb").getAttribute("aria-live"),
                   focus: document.activeElement && document.activeElement.id,
                   solFirst: all.length > 0 && all[0].classList.contains("sol") };
        });
        if (/quasi/.test(fb.cls)) errors.push(code + ": una opción equivocada salió «Casi» (" + opts[k] + ")");
        if (fb.live !== "polite") errors.push(code + ": la devolución sin aria-live");
        if (fb.focus !== "next") errors.push(code + ": el foco después de responder está en «" + fb.focus + "», no en «Siguiente»");
        if (!fb.solFirst) errors.push(code + ": la devolución no empieza por la forma correcta");
        await snap(page, P("correccion-opcion"));
        note(code + " · corrección de una opción: " + fb.cls);
        sawChoice = true;
      } else if (!sawTyped && await page.$("#ans") && it.type === "translate") {
        await page.fill("#ans", it.stem); await page.click("#send");
        await page.waitForSelector("#fb .feedback");
        const v = await page.textContent("#fb .verdict");
        if (/Casi/.test(v)) errors.push(code + ": una respuesta en español salió «" + v.trim() + "»");
        await snap(page, P("correccion-prompt"));
        note(code + " · respuesta en español: " + v.trim());
        if (await page.$("#giveup")) await page.click("#giveup");
        sawTyped = true;
      } else if (await page.$("[data-opt]")) await page.click("[data-opt] >> nth=0");
      else if (await page.$("#ans")) { await page.fill("#ans", it.answer.replace(/\s*\|\s*/g, " ")); await page.click("#send"); }
      else if (await page.$("#wans")) { await page.fill("#wans", it.answer); await page.click("#wsend"); }
      await page.waitForTimeout(300);
      if (await page.$("#next")) { await page.click("#next"); await page.waitForTimeout(300); }
    }
    if (!sawChoice) note(code + " · (sin opción equivocada que probar en la ronda)");
    if (await page.$("#quit")) { await page.click("#quit"); await page.waitForTimeout(300); }

    // The right answers: brief by default, more when it helps.  A trap
    // dodged is named; another accepted form shows as the answer and brings
    // the main one; a quick right answer on a known item folds the rule in
    // one line and has no «Palabra por palabra»; never «También: …»; and
    // «Siguiente» stays in sight at 390 px.
    const RIGHT = { it: [["trampa", "g2-gd-01", null, false], ["variante", "d14-007", "quindi", false], ["conocida", "d11-013", null, true]],
                    pt: [["trampa", "s1-01-41", null, false], ["variante", "s1-02-28", "há", false], ["conocida", "s1-01-03", null, true]] }[code];
    for (const [kind, id, typed, seen] of RIGHT) {
      await page.evaluate(([id, seen]) => {
        const s = window.__test.state();
        if (seen) s.cards[id] = { ok: 3, s: 20, d: 4, due: Date.now() + 1e9, last: Date.now() - 20 * 86400000, reps: 3 }; else delete s.cards[id];
        window.__test.play([id]);
      }, [id, seen]);
      await page.waitForTimeout(300);
      const it = await page.evaluate(() => { const x = window.__test.item(); return x && JSON.parse(JSON.stringify(x)); });
      if (!it || it.id !== id) { errors.push(code + ": correcta «" + kind + "»: no está el ítem " + id); continue; }
      if (it.options) {
        const opts = await page.$$eval("[data-opt]", els => els.map(e => e.textContent.trim()));
        await page.click("[data-opt] >> nth=" + opts.indexOf(String(it.answer).trim()));
      } else { await page.fill("#ans", typed || it.answer); await page.click("#send"); }
      await page.waitForSelector("#fb .feedback.giusto", { timeout: 4000 }).catch(() => {});
      await page.waitForTimeout(600);   // the sheet slides in
      const fb = await page.evaluate(() => {
        const box = document.querySelector("#fb .feedback"), nx = document.querySelector("#next");
        const r = nx ? nx.getBoundingClientRect() : null;
        return { cls: box ? box.className : "", text: box ? box.innerText : "", sol: box && box.querySelector(".sol") ? box.querySelector(".sol").textContent.trim() : "",
                 trap: !!(box && box.querySelector(".diag.trap")), also: !!(box && box.querySelector(".note.also")),
                 whyOk: !!(box && box.querySelector("details.why-ok")), desglose: !!(box && box.querySelector(".desglose")),
                 nextIn: !!r && r.top >= 0 && r.bottom <= innerHeight };
      });
      if (!/giusto/.test(fb.cls)) errors.push(code + ": correcta «" + kind + "» no salió bien: " + fb.cls);
      if (/También:/.test(fb.text)) errors.push(code + ": correcta «" + kind + "» con «También: …»");
      if (!fb.nextIn) errors.push(code + ": correcta «" + kind + "»: «Siguiente» fuera de la pantalla");
      if (kind === "trampa" && !fb.trap) errors.push(code + ": el garden path acertado no dice «Esquivaste la trampa»");
      if (kind === "variante" && (!fb.also || fb.sol !== typed)) errors.push(code + ": otra forma aceptada: sin «También se dice» o la respuesta no es la suya (" + fb.sol + ")");
      if (kind === "conocida" && (!fb.whyOk || fb.desglose)) errors.push(code + ": una conocida rápida: el porqué no está plegado o hay desglose");
      await snap(page, P("correcta-" + kind));
      note(code + " · correcta «" + kind + "»: " + fb.text.replace(/\s+/g, " ").slice(0, 120));
      if (await page.$("#quit")) { await page.click("#quit"); await page.waitForTimeout(300); }
    }
    await page.click("[data-tab='io']");
    await page.waitForSelector("#retention");
    const elog = await page.$$eval("ul.errlog li", els => els.map(e => e.textContent.replace(/\s+/g, " ").trim()));
    if (!elog.length) errors.push(code + ": «Tus errores» sin la lista de los últimos");
    note(code + " · últimos errores: " + elog.slice(0, 2).join(" / "));

    // Allena / Treino → Suoni / Sons
    await page.click("[data-tab='io']"); await page.waitForTimeout(250); await page.click("[data-goto='frasi']");  // out of the bar since 3.4
    await page.waitForSelector(".capa-week");
    await snap(page, P("entrenar-claro"), true);
    if (await page.$("[data-lab='suoni']")) {
      await page.click("[data-lab='suoni']");
      await page.waitForSelector(".bigplay, .options", { timeout: 5000 });
      const it2 = await page.evaluate(() => window.__test.item());
      note(code + " · sonidos: " + it2.type + " / " + it2.say);
      if (await page.$("[data-opt]")) { await page.click("[data-opt] >> nth=0"); await page.waitForTimeout(400); }
      await snap(page, P("sonidos-claro"));
      note(code + " · sonidos respondido: " + (await page.$("#fb .feedback") ? "con devolución" : "sin devolución"));
      await page.click("#quit");
    } else errors.push(code + ": no hay Suoni/Sons en entrenar");

    // Leggi / Ler → the first open reading, with karaoke
    await page.click("[data-tab='io']"); await page.waitForTimeout(250); await page.click("[data-goto='leggi']");  // out of the bar since 3.4
    await page.waitForSelector(".eps");
    await snap(page, P("leer-claro"));
    const ep = await page.$("[data-ep]:not([disabled])");
    if (ep) {
      await ep.click();
      await page.waitForSelector("#karplay");
      await snap(page, P("lectura-claro"));
      await page.click("#karplay");
      await page.waitForTimeout(300);
      note(code + " · lectura: " + (await page.textContent("#karplay")).trim());
    } else errors.push(code + ": ninguna lectura abierta");

    // the path → week 1, its lesson
    await page.click("[data-tab='percorso']");
    await page.waitForSelector(".path");
    await snap(page, P("camino-claro"));
    await page.click("[data-week='1']");
    await page.waitForSelector(".missions");
    await snap(page, P("semana1-claro"), true);
    note(code + " · misiones de la semana 1: " + (await page.$$eval(".mission b", els => els.map(e => e.textContent))).join(" | "));
    if (await page.$("[data-m='lez']")) {
      // a toast or the gloss box can cover the button for a moment: click it directly
      await page.$eval("[data-m='lez']", b => b.click());
      await page.waitForSelector(".lescard");
      await page.click("#lesnext"); await page.waitForTimeout(300);
      await snap(page, P("leccion-claro"));
      note(code + " · lección abierta");
      await page.click("#lesquit");
    } else errors.push(code + ": la semana 1 no tiene lección");
    // the dictogloss of week 2
    await page.evaluate(() => { const s = window.__test.state(); s.unlocked = 2; });
    await page.click("[data-tab='percorso']"); await page.click("[data-week='2']");
    if (await page.$("[data-m='dictogloss']")) { await page.click("[data-m='dictogloss']"); await page.waitForSelector("#dgplay"); note(code + " · dictogloss ok"); }

    // Io / Eu, with the button to the other language
    await page.click("[data-tab='io']");
    await page.waitForSelector("#retention");
    const h1 = (await page.textContent("h1")).trim();
    if (h1 !== N.me) errors.push(code + ": el perfil se llama «" + h1 + "»");
    if (!(await page.$("#switchlang"))) errors.push(code + ": falta el botón para cambiar de idioma");
    note(code + " · " + h1 + ": " + (await page.$$eval("h2", els => els.map(e => e.textContent.trim()))).join(" | "));
    await snap(page, P("perfil-claro"));

    // the C1 exam of week 52
    await page.evaluate(() => { const s = window.__test.state(); s.unlocked = 52; });
    await page.click("[data-tab='percorso']");
    await page.waitForTimeout(500);
    await page.click("[data-week='52']");
    await page.waitForSelector("[data-m='play']", { state: "attached" });
    for (let k = 0; k < 4 && !(await page.$("[data-prova='ascolto']")); k++) { await page.click("[data-m='play']"); await page.waitForTimeout(600); }
    if (await page.$("[data-prova='lettura']")) {
      await snap(page, P("examen-claro"));
      await smokeEsame(page, code, P, snap, note, errors);
    } else errors.push(code + ": el examen C1 no abrió");

    // Oggi during the course (3.2): the week of the percorso and its next
    // mission on top, no plan by minutes; «Más» folded
    await page.evaluate(() => { const s = window.__test.state(); s.unlocked = 5; s.readSess = { 5: { 0: Date.now() } }; s.read = { 1: Date.now(), 2: Date.now(), 3: Date.now(), 4: Date.now() }; s.phase = null; });
    await page.click("[data-tab='oggi']");
    await page.waitForSelector("#weektop", { timeout: 5000 });
    if (await page.$("#hoyplan")) errors.push(code + ": durante el curso Oggi todavía muestra el plan «Hoy»");
    const wt = (await page.textContent("#weektop")).replace(/\s+/g, " ").trim();
    if (!/semana 5/.test(wt) || !/Siguiente:/.test(wt)) errors.push(code + ": la tarjeta de arriba no es la semana 5 con su próxima misión: " + wt);
    note(code + " · Oggi arriba: " + wt.slice(0, 110));
    await snap(page, P("oggi-semana"));
    if (await page.$eval("#masoggi", d => d.open)) errors.push(code + ": «Más» abierto de entrada");
    await page.click("#masoggi > summary");
    await page.waitForSelector("#pausa", { state: "visible" });
    await snap(page, P("oggi-mas"), true);
    // «Seguir» opens the next mission of the week
    await page.click("#heronext");
    await page.waitForTimeout(500);
    const started = await page.evaluate(() => [window.__test.screen(), (document.querySelector("#app").textContent || "").replace(/\s+/g, " ").slice(0, 60)]);
    note(code + " · «Seguir» abre: " + started[0] + " · " + started[1]);
    if (started[0] === "oggi") errors.push(code + ": «Seguir» no abrió la próxima misión");
    if (await page.$("#quit")) { await page.click("#quit"); await page.waitForTimeout(300); }
    else if (await page.$("#lesquit")) { await page.click("#lesquit"); await page.waitForTimeout(300); }
    else if (await page.$("#lback")) { await page.click("#lback"); await page.waitForTimeout(300); }
    // «Para practicar más» inside the week (3.3): what lived only in Allena
    // and Leggi, and a round started there comes back to the week
    await page.click("[data-tab='percorso']");
    await page.click("[data-week='5']");
    await page.waitForSelector(".missions");
    const extras = await page.$$eval(".wextras .lab", els => els.map(e => (e.querySelector("b") || e).textContent.trim()));
    if (!extras.length) errors.push(code + ": la semana 5 no tiene «Para practicar más»");
    note(code + " · para practicar más (semana 5): " + extras.join(" | "));
    if (await page.$(".wextras [data-bank='b-voc']")) {
      await page.$eval(".wextras [data-bank='b-voc']", b => b.click());
      await page.waitForTimeout(400);
      if (await page.$("#quit")) { await page.click("#quit"); await page.waitForTimeout(300); }
      if (!(await page.$(".wextras"))) errors.push(code + ": salir de una práctica de «Para practicar más» no vuelve a la semana");
    }
    // Tu progreso, from Io
    await page.click("[data-tab='io']");
    await page.waitForSelector("#toprog");
    await page.click("#toprog");
    await page.waitForSelector("#progback");
    const ph2 = await page.$$eval("#app h2", els => els.map(e => e.textContent.trim()));
    if (!ph2.some(t => /Nivel estimado/.test(t)) || !ph2.some(t => /Horas/.test(t))) errors.push(code + ": «Tu progreso» sin nivel u horas: " + ph2.join(" | "));
    await snap(page, P("progreso"), true);
    note(code + " · progreso: " + ph2.join(" | "));
    await page.click("#progback");
    // after the exam: maintenance and the close of the year
    await page.evaluate(() => { const s = window.__test.state(); s.unlocked = 52; s.weekStats[52] = { attempts: 1, right: 1, bossPassed: true }; });
    await page.click("[data-tab='oggi']");
    await page.waitForSelector("#yearshare", { timeout: 5000 });
    const mh = await page.textContent(".hoy-head h2");
    if (!/Mantenimiento/.test(mh)) errors.push(code + ": después del examen Oggi no está en mantenimiento: " + mh);
    if (await page.$(".goalweek")) errors.push(code + ": en mantenimiento sigue la cuota de palabras");
    await snap(page, P("mantenimiento"), true);
    note(code + " · después del examen: " + mh.trim() + " · " + (await page.$$eval(".hs-go", els => els.map(e => e.textContent.replace(/\s+/g, " ").trim()))).join(" | "));
    await page.evaluate(() => { const s = window.__test.state(); s.phase = null; s.weekStats[52] = { attempts: 0, right: 0, bossPassed: false }; s.unlocked = 52; });

    // «Parola o no? / Palavra ou não?»
    await page.evaluate(() => { const s = window.__test.state(); for (let i = 0; i < 40; i++) s.cards["v:w" + i] = { ok: 3, s: 5, d: 5, due: Date.now() + 1e9, last: Date.now() }; });
    await page.click("[data-tab='oggi']");
    if (await page.$("#masoggi") && !(await page.$eval("#masoggi", d => d.open))) await page.click("#masoggi > summary");
    if (await page.$("#lampoparole")) { await page.click("#lampoparole"); await page.waitForSelector("[data-lopt]"); note(code + " · ¿palabra o no?: " + (await page.textContent(".stem")).trim()); await page.click("#lquit"); }

    // the modules nobody opened with app.js: Leggi and Allena folded, the timed
    // reading, «Consultar», the Biblioteca, guided writing, a duel, Tres lenguas,
    // Tres vueltas (tools/lib/smoke_modulos.js)
    await require("./smoke_modulos.js")(page, { code, errors, note, snap });
    // the Radio series (weeks 6-25): the mission, the player, Leggi (tools/lib/smoke_radio.js)
    await require("./smoke_radio.js")(page, { code, errors, note, snap });
    // out of the app (weeks 6-52): the card, the minutes, Leggi (tools/lib/smoke_fuera.js)
    await require("./smoke_fuera.js")(page, { code, errors, note, snap });
    // the work route (from A2): the scene, the round, the task, Allena (tools/lib/smoke_trabajo.js)
    await require("./smoke_trabajo.js")(page, { code, errors, note, snap });
    // the copy in the learner's GitHub Gist, with the API simulated (tools/lib/smoke_nube.js)
    await require("./smoke_nube.js")(page, { code, errors, note, snap });

    // the service worker keeps the core and this package
    const sw = await page.evaluate(async (c) => {
      if (!navigator.serviceWorker) return "sin service worker";
      await navigator.serviceWorker.ready;
      for (let k = 0; k < 40; k++) {
        const keys = await caches.keys();
        const v = keys.filter(x => /^c1-v/.test(x))[0];
        if (v) {
          const cache = await caches.open(v);
          const core = await cache.match("js/app.js"), pk = await cache.match("lang/" + c + "/data/course.json");
          if (core && pk) return "ok: " + keys.join(", ");
        }
        await new Promise(r => setTimeout(r, 500));
      }
      return "incompleto: " + (await caches.keys()).join(", ");
    }, code);
    note(code + " · service worker: " + sw);
    if (!/^ok/.test(sw)) errors.push(code + ": service worker " + sw);

    // switch to the other language from the profile, and back (the switch
    // reloads without ?test: the progress is read from the save itself)
    const key = { it: "laviac1.save.v1", pt: "rumoc1.save.v1" }[code];
    const saved = () => page.evaluate((k) => { const s = JSON.parse(localStorage.getItem(k) || "{}"); return [s.xp, s.unlocked]; }, key);
    await page.click("[data-tab='io']");
    // what the app has in memory (the test changed it without saving): the
    // switch saves it before leaving, and it has to be there on the way back
    const before = await page.evaluate(() => { const s = window.__test.state(); return [s.xp, s.unlocked]; });
    await page.waitForSelector("#switchlang");
    await page.click("#switchlang");
    await page.waitForSelector("#obnext, #weektop, #hoyfirst", { timeout: 20000 });
    const other = NAMES[N.other];
    if (!(await tabs(page)).includes(other.today)) errors.push(code + " → " + N.other + ": el cambio de idioma no cambió las pestañas: " + (await tabs(page)));
    note(code + " → " + N.other + ": " + (await tabs(page)));
    await snap(page, P("cambiado-claro"));
    if (await page.$("#obskip")) { await page.click("#obskip"); await page.waitForSelector("#hoyfirst, #weektop"); }
    await page.click("[data-tab='io']");
    await page.waitForSelector("#switchlang");
    await page.click("#switchlang");
    await page.waitForSelector("#weektop, #hoyfirst", { timeout: 20000 });
    const back = await saved();
    if (!(await tabs(page)).includes(N.today) || JSON.stringify(back) !== JSON.stringify(before)) errors.push(code + ": al volver no está el progreso: " + before + " → " + back);
    note(code + " · vuelta con el progreso intacto (xp, semana: " + back + ")");
    await page.context().close();

    // the dark theme
    if (shots) {
      const dark = await newPage("dark", "localStorage.setItem('c1.lang', '" + code + "')");
      await dark.goto(base + "?test", { waitUntil: "networkidle" });
      await dark.waitForSelector("#obnext", { timeout: 20000 });
      await snap(dark, P("inicio-oscuro"));
      await dark.click("#obskip");
      await dark.waitForSelector("#hoyfirst");
      await dark.evaluate(() => { const s = window.__test.state(); s.unlocked = 3; s.readSess = { 3: { 0: Date.now() } }; });
      await dark.click("[data-tab='io']"); await dark.click("[data-tab='oggi']");
      await dark.waitForSelector("#weektop");
      await snap(dark, P("oggi-oscuro"), true);
      await dark.click("[data-tab='percorso']"); await dark.waitForSelector(".path");
      await snap(dark, P("camino-oscuro"));
      await dark.click("[data-week='1']"); await dark.waitForSelector(".missions");
      await snap(dark, P("semana1-oscuro"));
      await dark.click("[data-tab='oggi']"); await dark.waitForSelector("#weektop");
      await dark.evaluate(() => window.__test.start("pausa")); await dark.waitForSelector(".card");
      await snap(dark, P("ronda-oscuro"));
      await dark.context().close();
    }
  }

  // Who already studied Italian (La Via C1 before the two languages) goes
  // straight in, without the picker, and keeps the progress.
  const legacy = await newPage("light", "if (!localStorage.getItem('laviac1.save.v1')) localStorage.setItem('laviac1.save.v1', JSON.stringify({ xp: 1234, unlocked: 3, cards: {} }))");
  await legacy.goto(base + "?test", { waitUntil: "networkidle" });
  // (no three screens: it has progress)
  await legacy.waitForSelector("#weektop", { timeout: 20000 });
  const lx = await legacy.evaluate(() => [document.documentElement.getAttribute("data-lang"), window.__test.state().xp, localStorage.getItem("c1.lang")]);
  if (lx[0] !== "it" || lx[1] !== 1234) errors.push("quien ya estudiaba italiano: " + JSON.stringify(lx));
  note("quien ya estudiaba italiano entra directo: " + JSON.stringify(lx));
  if (shots) {
    const dp = await newPage("dark");
    await dp.goto(base + "?test", { waitUntil: "networkidle" });
    await dp.waitForSelector(".pick-lang");
    await snap(dp, "selector-oscuro");
  }

  console.log(seen.join("\n"));
  console.log(errors.length ? "ERRORS:\n" + errors.join("\n") : "sin errores de JavaScript");
  await browser.close();
  srv.kill();
  process.exit(errors.length ? 1 : 0);
})().catch(async e => {
  // Where it got stuck: the text on screen and, with SHOTS, a capture.
  try {
    if (global.lastPage) {
      console.log("pantalla:", (await global.lastPage.textContent("#app")).replace(/\s+/g, " ").slice(0, 300));
      if (process.env.SHOTS) await global.lastPage.screenshot({ path: require("path").join(process.env.SHOTS, "fallo.png") });
    }
  } catch (x) { /* la página ya no está */ }
  console.log("SMOKE FAIL", e.message.split("\n")[0]); console.log((global.seen || []).join("\n")); console.log((global.errors || []).join("\n")); process.exit(2); });
