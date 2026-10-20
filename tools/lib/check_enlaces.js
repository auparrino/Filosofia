/* Los enlaces de «Fuera de la app» (lang/<código>/fuera_data.js), pedidos
 * de verdad: cada ficha y cada fuente.  Corre en GitHub Actions
 * (.github/workflows/enlaces.yml, cada lunes y a pedido): desde el
 * contenedor de desarrollo la red no llega a esos sitios.
 *
 * - roto: 404 o 410, o el nombre del sitio no existe → falla (exit 1), con
 *   la lista para cambiar el enlace (o dejar que la ficha mande a `buscar`);
 * - dudoso: 403, 429, 5xx o sin respuesta en 20 s: muchos sitios frenan a
 *   los robots, se anota y no falla;
 * - bien: 2xx o 3xx al final de las redirecciones.
 * El resumen va a la consola y, en Actions, al resumen del trabajo.
 *   node tools/lib/check_enlaces.js          (LANGS=it,pt) */
"use strict";
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const ROOT = path.join(__dirname, "..", "..");
const langs = (process.env.LANGS || "it,pt").split(",");
const UA = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36";

function data(code) {
  const ctx = { window: {} };
  vm.runInNewContext(fs.readFileSync(path.join(ROOT, "docs", "lang", code, "fuera_data.js"), "utf8"), ctx);
  return ctx.window.FUERA_DATA;
}

async function probe(url) {
  const ac = new AbortController();
  const t = setTimeout(() => ac.abort(), 20000);
  try {
    let r = await fetch(url, { method: "HEAD", redirect: "follow", signal: ac.signal, headers: { "user-agent": UA, "accept-language": "it,pt;q=0.9,es;q=0.8" } });
    // some servers do not answer HEAD: ask again with GET
    if (r.status === 405 || r.status === 403 || r.status === 404 || r.status >= 500) {
      r = await fetch(url, { method: "GET", redirect: "follow", signal: ac.signal, headers: { "user-agent": UA, "accept-language": "it,pt;q=0.9,es;q=0.8" } });
    }
    return { status: r.status, final: r.url };
  } catch (e) {
    const code = (e.cause && e.cause.code) || e.name || String(e);
    return { status: 0, error: code };
  } finally { clearTimeout(t); }
}

function verdict(r) {
  if (r.status === 404 || r.status === 410) return "roto";
  if (r.status === 0 && /ENOTFOUND|EAI_AGAIN/.test(r.error || "")) return "roto";
  if (r.status >= 200 && r.status < 400) return "bien";
  return "dudoso";
}

(async () => {
  const rows = [];
  for (const code of langs) {
    const D = data(code);
    const urls = D.FICHAS.map((f) => ({ code, week: f.week, title: f.title, url: f.url, buscar: f.buscar }));
    // four at a time: polite with the sites
    for (let i = 0; i < urls.length; i += 4) {
      const part = urls.slice(i, i + 4);
      const res = await Promise.all(part.map((u) => probe(u.url)));
      part.forEach((u, k) => rows.push(Object.assign({}, u, res[k], { v: verdict(res[k]) })));
    }
  }
  const by = (v) => rows.filter((r) => r.v === v);
  const line = (r) => "- " + r.code + " · semana " + r.week + " · " + r.title + " — " + r.url +
    " (" + (r.status || r.error) + ")" + (r.v === "roto" ? " · buscar: «" + r.buscar + "»" : "");
  const out = ["## Enlaces de «Fuera de la app»", "",
    "Bien: " + by("bien").length + " · dudosos: " + by("dudoso").length + " · rotos: " + by("roto").length + " (de " + rows.length + ")", ""];
  if (by("roto").length) out.push("### Rotos (cambiar el enlace)", ...by("roto").map(line), "");
  if (by("dudoso").length) out.push("### Dudosos (el sitio frena robots o no respondió: probar a mano)", ...by("dudoso").map(line), "");
  const text = out.join("\n");
  console.log(text);
  if (process.env.GITHUB_STEP_SUMMARY) fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, text + "\n");
  process.exit(by("roto").length ? 1 : 0);
})();
