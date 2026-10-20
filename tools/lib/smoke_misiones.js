/* Todas las misiones que son rondas, jugadas de verdad en Chromium: para
   cada semana de una muestra, en los dos idiomas, abre cada misión como su
   botón, la juega entera respondiendo bien (window.__test.solve: por
   settle, la misma contabilidad que una respuesta real) y mira el
   percorso.  Falla si una misión jugada entera no se mueve (el caso de
   «Palabras de la semana» en 0 / 20 antes de la 3.0.2), o si no queda hecha
   después de jugarla las veces que su criterio pide.  Las lecciones, la
   lectura con sus preguntas, el dictogloss, las escuchas del tramo, Tres
   vueltas y el capítulo de la Biblioteca se terminan como lo haría el
   alumno; el texto de la semana, la tarea, la radio y «Fuera de la app»
   tienen su propia prueba de humo (solo se anota qué pantalla abren).
     node tools/lib/smoke_misiones.js          (necesita Playwright)
     PORT=8745   WEEKS=1,6,20   LANGS=it */
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

// How many full plays a mission may need, by its own criterion (and why).
const PLAYS = {
  vocab: 4,        // up to 7 new words a round: 20 words, three rounds
  play: 3,         // 20 right answers with the week's own exercises: rounds of mostly them (3.1)
  lez: 1,          // a lesson read to the end
  play2: 1,        // Dominala: one session, 85 %
  scene: 1,        // 60 % of the phrases firm: back three days apart; one play only has to move it
  // a sheet delivered blank: two tries do not complete it, the third does (Engine.passed, 3.1)
  "tr-asc": 3, "tr-brv": 3, radio: 3, "esc-ordenar": 3, "b-forme": 2, "b-err": 2, "b-ident": 2,
  default: 2
};
// Missions whose «done» needs days to pass: one play must move them, not finish them.
const NEEDS_DAYS = { scene: 1 };

(async () => {
  const port = +(process.env.PORT || 8745);
  const langs = (process.env.LANGS || "it,pt").split(",");
  const weeks = (process.env.WEEKS || "1,3,5,6,9,11,13,14,17,20,22,24,26,27,30,33,36,39,40,44,48").split(",").map(Number);
  const docs = path.join(__dirname, "..", "..", "docs");
  const srv = spawn("python3", ["-m", "http.server", String(port)], { cwd: docs, stdio: "ignore" });
  await new Promise(r => setTimeout(r, 1200));
  const browser = await chromium.launch().catch(() => chromium.launch({ executablePath: chromiumPath() }));
  const errors = [], notes = [], jsErrors = [];

  for (const code of langs) {
    const prefix = code === "it" ? "laviac1" : "rumoc1";
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
    await ctx.addInitScript(([c, p]) => {
      localStorage.setItem("c1.lang", c);
      if (!localStorage.getItem(p + ".save.v1")) localStorage.setItem(p + ".save.v1", JSON.stringify({ xp: 100, unlocked: 1, cards: {}, onboard: { at: 1, done: 1 } }));
    }, [code, prefix]);
    const page = await ctx.newPage();
    page.on("pageerror", e => jsErrors.push(code + ": " + e.message));
    page.on("dialog", d => d.accept());
    await page.goto("http://localhost:" + port + "/?test", { waitUntil: "networkidle" });
    await page.waitForFunction(() => window.__test && window.__test.plan, null, { timeout: 15000 });
    await page.evaluate(() => { window.__test.fast = true; if (window.speechSynthesis) speechSynthesis.speak = function () {}; });

    // Play whatever the mission opened, to its end.
    async function playOut() {
      let steps = 0;
      while (steps++ < 400) {
        const r = await page.evaluate(() => window.__test.solve());
        if (r === "none") break;
        if (/^stuck/.test(r)) { errors.push(code + ": una pregunta sin lugar para responder (" + r + ", " + await page.evaluate(() => window.__test.screen()) + ")"); break; }
        if (r === "answered") await page.waitForTimeout(15);
      }
      return steps;
    }

    const click = (sel) => page.evaluate((q) => { const b = document.querySelector(q); if (!b) return false; b.disabled = false; b.click(); return true; }, sel);
    const fill = (sel, v) => page.evaluate(([q, x]) => { const b = document.querySelector(q); if (!b) return false; b.value = x; b.dispatchEvent(new Event("input", { bubbles: true })); return true; }, [sel, v]);
    const LONG = code === "it"
      ? "Questa settimana ho letto un testo e ho ascoltato una storia. Mi è piaciuta molto perché parla della vita di tutti i giorni. La protagonista lavora in una città grande e ogni mattina prende il treno. Racconta i suoi amici, la sua famiglia e il suo lavoro. Alla fine decide di cambiare casa e di vivere vicino al mare. "
      : "Esta semana eu li um texto e ouvi uma história. Gostei muito porque fala da vida de todos os dias. A protagonista trabalha numa cidade grande e toda manhã pega o trem. Ela conta dos amigos, da família e do trabalho. No final ela decide mudar de casa e morar perto do mar. ";
    /* The missions with a screen of their own, finished as a learner
       would: the reading and its questions, the dictogloss, the long and
       short listening, the three rounds, a chapter of the Library. */
    async function finishScreen(screen, W) {
      if (screen === "lettura") { if (await click("#lquiz")) { await page.waitForTimeout(60); await playOut(); return true; } return false; }
      if (screen === "dictogloss") {
        await click("#dgwrite"); await page.waitForTimeout(60);
        const t = await page.evaluate((w) => (window.Suoni && Suoni.dgFor(w) || {}).text || "", W);
        await fill("#dgtext", t); return click("#dgcheck");
      }
      if (screen === "tramo-asc" || screen === "tramo-brv") return click("#trdeliver");
      if (screen === "eplus") {
        if (!(await click("#epgo"))) return false;
        for (let k = 0; k < 3; k++) {
          await page.waitForTimeout(60); await fill("#eptext", LONG); await click("#epstop"); await page.waitForTimeout(60);
          if (!(await click("#epnext"))) break;
        }
        return click("#epcmp");
      }
      if (screen === "escritos") {   // the C-test or «Ordená»: delivered twice, as the second pass asks
        for (let pass = 0; pass < 2; pass++) {
          if (await page.$(".esc-in")) { await click("#esccheck"); }
          else {
            for (let k = 0; k < 40 && (await page.$("[data-escput]")); k++) await click("[data-escput]");
            await click("#escord");
          }
          await page.waitForTimeout(60);
          if (await page.$("#escdone")) return true;
        }
        return !!(await page.$("#escdone"));
      }
      if (screen === "lector") {
        await page.waitForSelector("#bx-next, #bx-end", { timeout: 8000 }).catch(() => {});
        for (let k = 0; k < 200 && !(await page.$("#bx-end")); k++) { if (!(await click("#bx-next"))) break; await page.waitForTimeout(30); }
        if (!(await click("#bx-end"))) return false;
        await page.waitForTimeout(60);
        return click("[data-bxself='3']");
      }
      return false;
    }

    for (const W of weeks) {
      await page.evaluate((w) => { const s = window.__test.state(); s.unlocked = Math.max(s.unlocked, w); }, W);
      const plan = await page.evaluate((w) => window.__test.plan(w), W);
      for (const m0 of plan) {
        if (m0.done) continue;
        const key = code + " · semana " + W + " · " + m0.kind + (m0.arg ? ":" + m0.arg : "");
        let m = m0, plays = 0, moved = false, screen = "";
        const max = PLAYS[m0.kind] || PLAYS.default;
        while (!m.done && plays < max) {
          await page.evaluate(([k, a, w]) => window.__test.mission(k, a, w), [m.kind, m.arg, W]);
          await page.waitForTimeout(60);
          screen = await page.evaluate(() => window.__test.screen());
          if (screen === "gioco" || screen === "lezione") {
            await playOut();
            // the result says what the round moved (3.1)
            if (m.kind === "play" && (await page.evaluate(() => window.__test.screen())) === "risultato") {
              const moved = await page.evaluate(() => { const n = document.querySelector(".planmoved"); return n ? n.textContent : ""; });
              if (!/\+\d+ en esta ronda|hecha/.test(moved)) errors.push(key + ": el resultado no dice cuánto sumó la ronda («" + moved.slice(0, 80) + "»)");
            }
          }
          else if (!(await finishScreen(screen, W))) break;
          plays++;
          await page.waitForTimeout(80);
          const plan2 = await page.evaluate((w) => window.__test.plan(w), W);
          // the Library recommends the next chapter once one is read: same kind, another arg
          const after = plan2.find(x => x.kind === m.kind && x.arg === m.arg) ||
            (plan2.filter(x => x.kind === m.kind).length === 1 ? plan2.find(x => x.kind === m.kind) : null);
          if (!after) { m = Object.assign({}, m, { done: true }); break; }
          if (after.done !== m.done || after.half !== m.half || after.sub !== m.sub) moved = true;
          m = after;
        }
        if (screen && !plays) { notes.push(key + " → pantalla «" + screen + "» (prueba propia)"); continue; }
        if (!moved && !m.done) errors.push(key + ": jugada " + plays + " vez/veces entera y no se movió · «" + m.sub + "»");
        else if (!m.done && !NEEDS_DAYS[m.kind]) errors.push(key + ": no queda hecha después de " + plays + " jugadas · «" + m.sub + "»");
        else notes.push(key + ": " + (m.done ? "hecha" : "se mueve") + " en " + plays + " · " + m.sub.slice(0, 70));
      }
      // back to the week, clean
      await page.evaluate(() => { const b = document.querySelector("[data-tab='percorso']"); if (b) b.click(); });
      await page.waitForTimeout(100);
    }
    await ctx.close();
  }
  await browser.close();
  srv.kill();
  notes.forEach(n => console.log(n));
  jsErrors.forEach(e => errors.push("JavaScript: " + e));
  console.log(errors.length ? "\nFALLAN " + errors.length + ":\n" + errors.join("\n") : "\ntodas las misiones que son rondas se mueven y se completan");
  process.exit(errors.length ? 1 : 0);
})();
