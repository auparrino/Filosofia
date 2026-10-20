/* La prueba de humo de «Sincronizar con tu GitHub Gist» (js/nube.js y la
   sección de la copia en Io / Eu), llamada desde smoke_browser.js para
   cada idioma, con la API de gists simulada (page.route: la red del CI no
   llega a GitHub): se pega un token, «Subir ahora» crea el gist secreto
   con el sobre del idioma y sin el token; otro teléfono sube una copia más
   nueva y «Traer de la nube» pregunta diciendo que es más nueva y la
   restaura; la subida automática al ocultar la app sube una vez y la
   segunda vez, el mismo día, no.  Al final deja el teléfono como estaba
   (sin token ni gist).

   module.exports = async (page, { code, errors, note, snap }) */
"use strict";

const TOKEN = "ghp_smoke0123456789";

module.exports = async function nube(page, ctx) {
  const { code, errors, note, snap } = ctx;
  const fail = (m) => errors.push(code + " · nube: " + m);
  const storage = { it: "laviac1", pt: "rumoc1" }[code], file = storage + ".json";
  const gists = {}, calls = [];
  let n = 0, clock = Date.parse("2026-09-28T10:00:00Z");
  const iso = () => new Date(clock += 60000).toISOString();
  const view = (g) => ({ id: g.id, description: g.description, public: g.public, updated_at: g.updated_at,
    files: Object.fromEntries(Object.keys(g.files).map((k) => [k, { filename: k, content: g.files[k], truncated: false, raw_url: "https://gist.githubusercontent.com/u/" + g.id + "/raw/" + k }])) });
  const json = (route, status, body) => route.fulfill({ status, contentType: "application/json",
    headers: { "access-control-allow-origin": "*" }, body: JSON.stringify(body) });

  await page.route("https://api.github.com/**", async (route) => {
    const req = route.request(), url = req.url(), method = req.method();
    if (method === "OPTIONS") return route.fulfill({ status: 204, headers: { "access-control-allow-origin": "*", "access-control-allow-headers": "*", "access-control-allow-methods": "GET, POST, PATCH" } });
    const body = req.postData() || "";
    calls.push({ method, url, auth: req.headers().authorization || "", body });
    if (req.headers().authorization !== "Bearer " + TOKEN) return json(route, 401, { message: "Bad credentials" });
    const path = url.replace("https://api.github.com", "");
    let m;
    if (method === "GET" && /^\/gists\?/.test(path)) return json(route, 200, Object.values(gists).map((g) => { const v = view(g); Object.values(v.files).forEach((f) => { delete f.content; }); return v; }));
    if (method === "POST" && path === "/gists") {
      const b = JSON.parse(body), id = "s" + (++n);
      gists[id] = { id, description: b.description, public: b.public, updated_at: iso(), files: Object.fromEntries(Object.keys(b.files).map((k) => [k, b.files[k].content])) };
      return json(route, 201, view(gists[id]));
    }
    if ((m = path.match(/^\/gists\/(\w+)$/)) && gists[m[1]]) {
      const g = gists[m[1]];
      if (method === "PATCH") { const b = JSON.parse(body); Object.keys(b.files).forEach((k) => { g.files[k] = b.files[k].content; }); g.updated_at = iso(); }
      return json(route, 200, view(g));
    }
    return json(route, 404, { message: "Not Found" });
  });

  await page.click("[data-tab='io']");
  await page.waitForSelector("details.nube");
  if (!(await page.$eval("details.nube", (d) => d.open))) await page.click("details.nube > summary");
  const help = await page.textContent("details.nube");
  if (!/gist/.test(help) || !(await page.$("details.nube a[href*='settings/tokens']"))) fail("la sección no explica cómo crear el token");
  await page.fill("#gisttoken", TOKEN);
  await page.$eval("#gisttoken", (el) => el.dispatchEvent(new Event("change")));

  // Subir ahora: creates the secret gist
  await page.click("#gistup");
  await page.waitForFunction((k) => { try { return !!JSON.parse(localStorage.getItem(k) || "{}").id; } catch (e) { return false; } }, storage + ".gist", { timeout: 8000 })
    .catch(() => fail("«Subir ahora» no guardó el id del gist"));
  const post = calls.find((c) => c.method === "POST");
  if (!post) { fail("no se creó el gist"); return; }
  const sent = JSON.parse(post.body);
  if (sent.public !== false) fail("el gist no es secreto");
  const env = JSON.parse(sent.files[file] ? sent.files[file].content : "{}");
  if (env.app !== "c1" || env.lang !== code || !env.save || typeof env.save.xp !== "number") fail("lo subido no es el sobre del idioma: " + Object.keys(env).join(","));
  if (post.body.indexOf(TOKEN) >= 0) fail("el token va dentro de la copia");
  const saved = await page.evaluate((k) => localStorage.getItem(k) || "", storage + ".save.v1");
  if (saved.indexOf(TOKEN) >= 0 || /gist/.test(Object.keys(JSON.parse(saved || "{}")).join(","))) fail("el token o el gist quedaron en el guardado");
  await page.waitForSelector("#giststate", { timeout: 5000 }).catch(() => fail("Io no dice cuándo fue la última subida"));
  note(code + " · nube: subida a un gist secreto (" + Math.round(post.body.length / 1024) + " KB)");
  await snap(page, code + "-nube");

  // another phone uploads a newer copy: «Traer de la nube» asks and restores it
  const id = Object.keys(gists)[0];
  const xp0 = await page.evaluate(() => window.__test.state().xp);
  const newer = JSON.parse(gists[id].files[file]);
  newer.save.xp = xp0 + 777;
  newer.save.savedAt = Date.now() + 3600000;
  gists[id].files[file] = JSON.stringify(newer);
  gists[id].updated_at = iso();
  let asked = "";
  page.once("dialog", (d) => { asked = d.message(); d.accept(); });
  await page.click("#gistdown");
  await page.waitForFunction((x) => window.__test.state().xp === x, xp0 + 777, { timeout: 8000 }).catch(() => fail("«Traer de la nube» no restauró la copia"));
  if (!/más nueva/.test(asked)) fail("al traer no preguntó diciendo que la de la nube es más nueva: " + asked);

  // the automatic upload when the app is hidden: once a day
  await page.waitForSelector("#gistauto");
  await page.check("#gistauto");
  const patches = () => calls.filter((c) => c.method === "PATCH").length;
  const hide = () => page.evaluate(() => {
    const s = window.__test.state(); s.savedAt = Date.now() + 1000;   // something changed
    Object.defineProperty(document, "hidden", { value: true, configurable: true });
    document.dispatchEvent(new Event("visibilitychange"));
    delete document.hidden;
  });
  const p0 = patches();
  await hide();
  await page.waitForFunction((k) => { try { return !!JSON.parse(localStorage.getItem(k) || "{}").day; } catch (e) { return false; } }, storage + ".gist", { timeout: 8000 })
    .catch(() => fail("la subida automática no subió al ocultar la app"));
  if (patches() !== p0 + 1) fail("la subida automática hizo " + (patches() - p0) + " subidas");
  await hide();
  await page.waitForTimeout(600);
  if (patches() !== p0 + 1) fail("la subida automática subió dos veces el mismo día");
  note(code + " · nube: traída y subida automática una vez por día");
  if (process.env.SHOTS) {
    await page.click("[data-tab='io']");
    await page.waitForSelector("details.nube");
    await page.$eval("details.nube", (d) => { d.open = true; d.scrollIntoView(); window.scrollBy(0, -60); });
    await page.waitForTimeout(2600);   // the toasts go
    await snap(page, code + "-nube-2");
  }

  // leave the phone as it was
  await page.evaluate((k) => { localStorage.removeItem("c1.gist.token"); localStorage.removeItem(k); }, storage + ".gist");
  await page.unroute("https://api.github.com/**");
};
