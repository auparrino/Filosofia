/*
 * La copia en tu GitHub Gist (docs/js/nube.js), sin red: una API de gists
 * simulada en memoria (listar, leer, crear, actualizar, el raw de un
 * archivo cortado) y las fallas que importan (401, 403, 404, límite, red
 * caída).
 *
 *  1. Subir: la primera vez crea un gist secreto con el archivo del idioma
 *     y un LEEME.md; después lo actualiza (PATCH) sin crear otro.  El sobre
 *     es el de «Guardar copia» y no lleva el token.
 *  2. Otro teléfono: con el mismo token y sin id encuentra el gist por el
 *     nombre del archivo y trae el sobre; un archivo de más de 1 MB (cortado
 *     por la API) se lee de raw_url.
 *  3. Conflictos: el gist cambió desde la última sincronización (otro
 *     teléfono subió) y la comparación de fechas del sobre.
 *  4. Errores: 401 → token, 403 → permiso o límite, 404 de un gist borrado
 *     (sube a uno nuevo), crear sin permiso de gist, red caída, lo de la
 *     nube que no es una copia o es del otro idioma.
 *  5. La subida automática: activada, una vez por día, si cambió algo.
 *  6. Lo guardado en el teléfono: el token (uno para los dos idiomas) y el
 *     id del gist quedan fuera del guardado del idioma.
 *
 *   node tools/lib/test_nube.js
 */
"use strict";
var T = require("./testkit.js")("pt"), ok = T.ok, eq = T.eq;
var Nube = require("../../docs/js/nube.js");

var TOKEN = "ghp_simulado1234567890";

/* ------------------------------------------------ la API de gists simulada */
function fakeGitHub() {
  var gists = {}, n = 0, clock = Date.parse("2026-09-28T10:00:00Z");
  var S = { gists: gists, calls: [], down: false, status: null, rateLimited: false, noScope: false, bigRaw: {} };
  function iso() { clock += 60000; return new Date(clock).toISOString(); }
  function res(status, body, headers) {
    return {
      status: status, ok: status >= 200 && status < 300,
      headers: { get: function (k) { return (headers || {})[k.toLowerCase()] || null; } },
      json: function () { return Promise.resolve(JSON.parse(JSON.stringify(body))); },
      text: function () { return Promise.resolve(typeof body === "string" ? body : JSON.stringify(body)); }
    };
  }
  function view(g, withContent) {
    var files = {};
    Object.keys(g.files).forEach(function (name) {
      var c = g.files[name], big = c.length > 1000000 || S.bigRaw[name];
      files[name] = { filename: name, size: c.length, raw_url: "https://gist.githubusercontent.com/u/" + g.id + "/raw/" + name };
      if (withContent) { files[name].truncated = !!big; files[name].content = big ? c.slice(0, 1000) : c; }
    });
    return { id: g.id, description: g.description, public: g.public, updated_at: g.updated_at, files: files };
  }
  S.fetch = function (url, init) {
    init = init || {};
    var method = init.method || "GET";
    S.calls.push({ method: method, url: url, init: init });
    if (S.down) return Promise.reject(new TypeError("Failed to fetch"));
    var raw = url.match(/^https:\/\/gist\.githubusercontent\.com\/u\/(\w+)\/raw\/(.+)$/);
    if (raw) {
      var rg = gists[raw[1]];
      return Promise.resolve(rg && rg.files[raw[2]] != null ? res(200, rg.files[raw[2]]) : res(404, "Not Found"));
    }
    if ((init.headers || {}).Authorization !== "Bearer " + TOKEN) return Promise.resolve(res(401, { message: "Bad credentials" }));
    if (S.status) return Promise.resolve(res(S.status, { message: "error" }));
    if (S.rateLimited) return Promise.resolve(res(403, { message: "API rate limit exceeded" }, { "x-ratelimit-remaining": "0" }));
    var path = url.replace(Nube.API, ""), body = init.body ? JSON.parse(init.body) : null, m;
    if (method === "GET" && (m = path.match(/^\/gists\?per_page=(\d+)&page=(\d+)$/))) {
      var all = Object.keys(gists).map(function (id) { return gists[id]; })
        .sort(function (a, b) { return a.updated_at < b.updated_at ? 1 : -1; });
      var per = +m[1], page = +m[2];
      return Promise.resolve(res(200, all.slice((page - 1) * per, page * per).map(function (g) { return view(g, false); })));
    }
    if (method === "POST" && path === "/gists") {
      if (S.noScope) return Promise.resolve(res(404, { message: "Not Found" }));
      var id = "g" + (++n), files = {};
      Object.keys(body.files).forEach(function (k) { files[k] = body.files[k].content; });
      gists[id] = { id: id, description: body.description, public: body.public, updated_at: iso(), files: files };
      return Promise.resolve(res(201, view(gists[id], true)));
    }
    if ((m = path.match(/^\/gists\/(\w+)$/))) {
      var g = gists[m[1]];
      if (!g) return Promise.resolve(res(404, { message: "Not Found" }));
      if (method === "GET") return Promise.resolve(res(200, view(g, true)));
      if (method === "PATCH") {
        Object.keys(body.files).forEach(function (k) { g.files[k] = body.files[k].content; });
        if (body.description) g.description = body.description;
        g.updated_at = iso();
        return Promise.resolve(res(200, view(g, true)));
      }
    }
    return Promise.resolve(res(422, { message: "Validation Failed" }));
  };
  // another phone (or GitHub's web) changes the gist
  S.touch = function (id, name, content) { gists[id].files[name] = content; gists[id].updated_at = iso(); };
  return S;
}

function memStorage() {
  var m = {};
  return {
    getItem: function (k) { return Object.prototype.hasOwnProperty.call(m, k) ? m[k] : null; },
    setItem: function (k, v) { m[k] = String(v); },
    removeItem: function (k) { delete m[k]; },
    keys: function () { return Object.keys(m); }
  };
}

function save(xp, savedAt) {
  return { xp: xp, cards: { "s1-01-01": { due: 1 } }, unlocked: 3, savedAt: savedAt };
}
function opts(gh, extra) {
  return Object.assign({ token: TOKEN, fetch: gh.fetch, storage: "rumoc1", lang: "pt" }, extra || {});
}
function fails(p, code, what) {
  return p.then(function () { ok(false, what + ": se esperaba el error «" + code + "»"); },
    function (e) { eq(e && e.code, code, what); return e; });
}

var steps = [];
function step(name, fn) { steps.push([name, fn]); }

/* ----------------------------------------------------------- 1. subir */
step("subir: crea y después actualiza", function () {
  var gh = fakeGitHub(), env = Nube.envelope(save(120, 1000), { lang: "pt", brand: "Rumo C1", v: "v3.0" }, Date.parse("2026-09-28T09:00:00Z"));
  eq(Object.keys(env).sort(), ["app", "at", "brand", "lang", "save", "v"], "el sobre tiene la forma del de «Guardar copia»");
  return Nube.remote(opts(gh)).then(function (r) {
    ok(r === null, "sin gist todavía: remote da null");
    return Nube.push(opts(gh), env, r);
  }).then(function (g) {
    ok(g.created && g.id && g.updated, "la primera vez crea un gist");
    var post = gh.calls.filter(function (c) { return c.method === "POST"; })[0], body = JSON.parse(post.init.body);
    ok(body.public === false, "el gist es secreto");
    ok(body.files["rumoc1.json"] && body.files["LEEME.md"], "con el archivo del idioma y el LEEME.md");
    eq(JSON.parse(body.files["rumoc1.json"].content), env, "lo subido es el sobre");
    ok(post.init.body.indexOf(TOKEN) < 0, "el token no va en lo que se sube");
    eq(post.init.headers.Authorization, "Bearer " + TOKEN, "el token va solo en el encabezado");
    ok(post.url === "https://api.github.com/gists", "a la API de gists de GitHub");
    var env2 = Nube.envelope(save(150, 2000), { lang: "pt", brand: "Rumo C1", v: "v3.0" });
    return Nube.remote(opts(gh, { id: g.id })).then(function (r) {
      eq(r && r.id, g.id, "remote encuentra el gist guardado");
      ok(!Nube.conflict(r, { gistAt: g.updated }), "sin cambios desde la última subida: sin conflicto");
      return Nube.push(opts(gh, { id: g.id }), env2, r);
    }).then(function (g2) {
      ok(!g2.created && g2.id === g.id, "la segunda vez actualiza el mismo gist");
      ok(gh.calls.some(function (c) { return c.method === "PATCH"; }), "con PATCH");
      eq(Object.keys(gh.gists).length, 1, "un solo gist");
      eq(JSON.parse(gh.gists[g.id].files["rumoc1.json"]).save.xp, 150, "con la copia nueva");
      ok(g2.updated > g.updated, "y su fecha nueva");
    });
  });
});

/* ------------------------------------------------- 2. otro teléfono */
step("otro teléfono: encuentra el gist y trae el sobre", function () {
  var gh = fakeGitHub(), env = Nube.envelope(save(300, 5000), { lang: "pt", brand: "Rumo C1", v: "v3.0" });
  var envIt = Nube.envelope(save(50, 4000), { lang: "it", brand: "La Via C1", v: "v3.0" });
  return Nube.push(opts(gh), env, null).then(function () {
    return Nube.push(opts(gh, { storage: "laviac1", lang: "it" }), envIt, null);
  }).then(function () {
    eq(Object.keys(gh.gists).length, 2, "un gist por idioma");
    return Nube.pull(opts(gh));   // no id: a new phone
  }).then(function (r) {
    eq(r.env, env, "sin id, trae la copia del idioma por el nombre del archivo");
    return Nube.pull(opts(gh, { storage: "laviac1", lang: "it" }));
  }).then(function (r) {
    eq(r.env.save.xp, 50, "y la del otro idioma, de su gist");
    // a copy of more than 1 MB: the API cuts it and the whole is at raw_url
    var big = save(900, 6000);
    big.log = []; for (var i = 0; i < 40000; i++) big.log.push([i, "s4-50-" + i, 1, 1, 1, 1, 9]);
    var envBig = Nube.envelope(big, { lang: "pt", brand: "Rumo C1", v: "v3.0" });
    ok(JSON.stringify(envBig).length > 1000000, "la copia grande pasa de 1 MB");
    return Nube.push(opts(gh), envBig, null).then(function () { return Nube.pull(opts(gh)); }).then(function (r2) {
      eq(r2.env.save.log.length, 40000, "una copia de más de 1 MB se lee entera desde raw_url");
      var rawCall = gh.calls.filter(function (c) { return /gist\.githubusercontent/.test(c.url); }).pop();
      ok(rawCall && !(rawCall.init && rawCall.init.headers), "el raw se pide sin el token");
    });
  });
});

/* ---------------------------------------------------- 3. conflictos */
step("conflictos", function () {
  var gh = fakeGitHub(), env = Nube.envelope(save(100, 1000), { lang: "pt" });
  return Nube.push(opts(gh), env, null).then(function (g) {
    var sync = { id: g.id, gistAt: g.updated };
    gh.touch(g.id, "rumoc1.json", JSON.stringify(Nube.envelope(save(180, 3000), { lang: "pt" })));
    return Nube.remote(opts(gh, { id: g.id })).then(function (r) {
      ok(Nube.conflict(r, sync), "otro teléfono subió después: conflicto");
      ok(Nube.conflict(r, {}), "un teléfono que nunca sincronizó y encuentra una copia: conflicto (pregunta)");
      ok(!Nube.conflict(null, {}), "sin copia en la nube: sin conflicto");
    });
  }).then(function () {
    var cloud = Nube.envelope(save(180, 3000), { lang: "pt" });
    eq(Nube.compare(cloud, save(100, 1000)), "newer", "la nube más nueva que el teléfono");
    eq(Nube.compare(cloud, save(200, 5000)), "older", "la nube más vieja que el teléfono");
    eq(Nube.compare(cloud, save(180, 3000)), "same", "la misma");
    eq(Nube.compare(cloud, { xp: 0, cards: {} }), "newer", "un teléfono sin fecha de guardado: la nube es más nueva");
    var noStamp = { app: "c1", lang: "pt", at: "2026-09-28T10:00:00.000Z", save: { xp: 1, cards: {} } };
    eq(Nube.stamp(noStamp), Date.parse("2026-09-28T10:00:00.000Z"), "un sobre sin savedAt usa su «at»");
  });
});

/* -------------------------------------------------------- 4. errores */
step("errores", function () {
  var gh = fakeGitHub(), env = Nube.envelope(save(10, 10), { lang: "pt" });
  return fails(Nube.push(opts(gh, { token: "ghp_otro" }), env, null), "token", "401: el token no sirve")
    .then(function (e) { ok(/token/.test(Nube.message(e)), "el mensaje del 401 habla del token"); })
    .then(function () { return fails(Nube.remote(opts(gh, { token: "" })), "notoken", "sin token no se llama a la red"); })
    .then(function () {
      var before = gh.calls.length;
      return fails(Nube.pull(opts(gh, { token: "" })), "notoken", "traer sin token").then(function () { eq(gh.calls.length, before, "sin llamadas sin token"); });
    })
    .then(function () { return fails(Nube.pull(opts(gh)), "falta", "404: todavía no hay copia en la nube"); })
    .then(function (e) { ok(/subila/.test(Nube.message(e)), "el mensaje dice que hay que subirla primero"); })
    .then(function () {
      gh.noScope = true;
      return fails(Nube.push(opts(gh), env, null), "permiso", "crear con un token sin permiso de gist (GitHub da 404)");
    })
    .then(function (e) { ok(/gist/.test(Nube.message(e)), "el mensaje pide el permiso gist"); gh.noScope = false; })
    .then(function () { return Nube.push(opts(gh), env, null); })
    .then(function (g) {
      // the gist was deleted on GitHub: the upload goes to a new one
      delete gh.gists[g.id];
      return Nube.remote(opts(gh, { id: g.id })).then(function (r) {
        ok(r === null, "gist borrado: remote da null");
        return Nube.push(opts(gh, { id: g.id }), env, r);
      }).then(function (g2) {
        ok(g2.created && g2.id !== g.id, "gist borrado: sube a uno nuevo");
        return Nube.push(opts(gh, { id: "gBorrado" }), env, { id: "gBorrado" });
      }).then(function (g3) {
        ok(g3.created, "PATCH a un gist que ya no está (404): crea otro");
      });
    })
    .then(function () {
      gh.status = 403;
      return fails(Nube.remote(opts(gh)), "permiso", "403 sin límite: sin permiso");
    })
    .then(function () {
      gh.status = null; gh.rateLimited = true;
      return fails(Nube.remote(opts(gh)), "limite", "403 con x-ratelimit-remaining 0: límite");
    })
    .then(function (e) { ok(/más tarde/.test(Nube.message(e)), "el límite pide probar más tarde"); gh.rateLimited = false; gh.status = 500; })
    .then(function () { return fails(Nube.remote(opts(gh)), "api", "500: otro error de GitHub"); })
    .then(function (e) { ok(/500/.test(Nube.message(e)), "el mensaje dice el código"); gh.status = null; gh.down = true; })
    .then(function () { return fails(Nube.push(opts(gh), env, null), "red", "red caída al subir"); })
    .then(function (e) { ok(/internet/.test(Nube.message(e)), "el mensaje de la red caída"); })
    .then(function () { return fails(Nube.pull(opts(gh)), "red", "red caída al traer"); })
    .then(function () { return fails(Nube.remote(opts(gh, { fetch: function () { throw new Error("CSP"); } })), "red", "un fetch que tira: red"); })
    .then(function () {
      gh.down = false;
      var id = Object.keys(gh.gists)[0];
      gh.touch(id, "rumoc1.json", "{esto no es json");
      return fails(Nube.pull(opts(gh, { id: id })), "formato", "lo de la nube no es JSON");
    })
    .then(function () {
      var id = Object.keys(gh.gists)[0];
      gh.touch(id, "rumoc1.json", JSON.stringify({ app: "otra", save: { xp: 1 } }));
      return fails(Nube.pull(opts(gh, { id: id })), "formato", "un JSON que no es una copia");
    })
    .then(function () {
      var id = Object.keys(gh.gists)[0];
      gh.touch(id, "rumoc1.json", JSON.stringify(Nube.envelope(save(5, 5), { lang: "it", brand: "La Via C1" })));
      return fails(Nube.pull(opts(gh, { id: id })), "idioma", "una copia del otro idioma no se trae");
    })
    .then(function (e) { eq(e.env && e.env.brand, "La Via C1", "el error del idioma trae el sobre (la app dice de cuál es)"); });
});

/* ------------------------------------------------- 5. subida automática */
step("subida automática", function () {
  var now = new Date(2026, 8, 28, 20, 0).getTime(), today = Nube.dayKey(now), yesterday = Nube.dayKey(now - 86400000);
  ok(!Nube.autoDue({ auto: false }, TOKEN, 5, now), "apagada: no sube");
  ok(!Nube.autoDue({ auto: true }, "", 5, now), "sin token: no sube");
  ok(Nube.autoDue({ auto: true }, TOKEN, 5, now), "activada y nunca subida: sube");
  ok(!Nube.autoDue({ auto: true, day: today, mark: 1 }, TOKEN, 5, now), "ya subió hoy: no sube");
  ok(Nube.autoDue({ auto: true, day: yesterday, mark: 1 }, TOKEN, 5, now), "subió ayer y cambió algo: sube");
  ok(!Nube.autoDue({ auto: true, day: yesterday, mark: 5 }, TOKEN, 5, now), "subió ayer y no cambió nada: no sube");
  ok(!Nube.autoDue(null, TOKEN, 5, now), "sin registro: no sube");
  return Promise.resolve();
});

/* ------------------------------------------ 6. lo guardado en el teléfono */
step("lo guardado en el teléfono", function () {
  var ls = memStorage(), S = Nube.store(ls);
  S.setToken("  " + TOKEN + "  ");
  eq(S.token(), TOKEN, "el token se guarda sin espacios");
  S.setSync("rumoc1", { id: "g1", auto: true, gistAt: "x" });
  eq(S.sync("rumoc1").id, "g1", "el id del gist, por idioma");
  eq(S.sync("laviac1"), {}, "el otro idioma, sin gist propio todavía");
  eq(Nube.store(ls).token(), TOKEN, "un token para los dos idiomas");
  eq(ls.keys().sort(), ["c1.gist.token", "rumoc1.gist"], "fuera de las claves del guardado (<prefijo>.save.v1)");
  var st = save(10, 10), env = Nube.envelope(st, { lang: "pt" });
  ok(JSON.stringify(env).indexOf(TOKEN) < 0 && JSON.stringify(env).indexOf("gist") < 0, "la copia no lleva el token ni el gist");
  S.setToken("");
  eq(S.token(), "", "olvidar el token lo borra");
  ok(ls.keys().indexOf("c1.gist.token") < 0, "y no queda la clave");
  var broken = memStorage(); broken.setItem("rumoc1.gist", "{roto");
  eq(Nube.store(broken).sync("rumoc1"), {}, "un registro roto no rompe nada");
  var throwing = { getItem: function () { throw new Error("bloqueado"); }, setItem: function () { throw new Error("bloqueado"); }, removeItem: function () {} };
  eq(Nube.store(throwing).token(), "", "con el almacenamiento bloqueado, sin token y sin romper");
  Nube.store(throwing).setToken("x");
  return Promise.resolve();
});

/* ------------------------------------------ la app lo carga (boot.js) */
step("en el orden de carga y en la app", function () {
  var Boot = require("../../docs/js/boot.js"), fs = require("fs"), path = require("path");
  var k = Boot.ORDER.map(function (e) { return e.core; });
  ok(k.indexOf("nube.js") >= 0 && k.indexOf("nube.js") < k.indexOf("app.js"), "nube.js está en ORDER, antes de app.js");
  var app = fs.readFileSync(path.join(__dirname, "../../docs/js/app.js"), "utf8");
  ok(/function exportSave[\s\S]{0,400}saveEnvelope\(\)/.test(app), "«Guardar copia» usa el mismo sobre (saveEnvelope)");
  ok(/function nubeDown[\s\S]*?restoreEnvelope\(env, ask\)/.test(app), "«Traer de la nube» restaura por restoreEnvelope");
  ok(/function restoreEnvelope[\s\S]{0,700}Engine\.fromRaw\(s\)/.test(app), "restoreEnvelope pasa por Engine.fromRaw");
  ok(/function restoreEnvelope[\s\S]{0,500}j\.lang !== LG\.code/.test(app), "y controla el idioma");
  ok(/document\.hidden && course\)[^\n]*nubeAuto\(\)/.test(app), "la subida automática corre al ocultar la app");
  return Promise.resolve();
});

(function run(i) {
  if (i >= steps.length) return T.done();
  Promise.resolve().then(steps[i][1]).catch(function (e) {
    ok(false, steps[i][0] + ": " + (e && e.stack || e));
  }).then(function () { run(i + 1); });
})(0);
