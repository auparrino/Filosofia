/*
 * La copia en la nube del alumno: un gist secreto de su GitHub.
 *
 * Sin servidor de la app (auditoría 3.0, B 4.5, escalón 3): el alumno pega
 * un token personal de GitHub con permiso solo de gist, y la app sube el
 * mismo sobre que exporta «💾 Guardar copia» ({app, lang, brand, v, at,
 * save}) a un gist secreto suyo, un gist por idioma (el archivo
 * «laviac1.json» o «rumoc1.json», con un LEEME.md que dice qué es).  En
 * otro teléfono, con el mismo token, «Traer de la nube» encuentra el gist
 * por el nombre del archivo y restaura el sobre por el mismo camino que un
 * archivo (app.js: restoreEnvelope → Engine.fromRaw, con el control de
 * idioma).
 *
 * Lo que queda en este teléfono y nunca entra en la copia (localStorage,
 * fuera del guardado, como las claves de IA):
 *   c1.gist.token        el token, uno para los dos idiomas
 *   <prefijo>.gist       {id, auto, gistAt, up, down, day, conflict}: el
 *                        gist de este idioma, la subida automática, la
 *                        fecha del gist en la última subida o bajada
 *                        (gistAt, la del servidor) y el día de la última
 *                        subida automática
 *
 * Conflictos: antes de subir, remote() mira la fecha del gist (una lista
 * sin contenido); si cambió desde la última vez que este teléfono subió o
 * trajo (otro teléfono subió después), la app pregunta antes de pisarla, y
 * la subida automática no sube y avisa en Io.  Al traer, stamp() compara
 * el momento del guardado de la nube con el de este teléfono y la app
 * pregunta siempre, diciendo cuál es más nuevo.
 *
 * Sin DOM: la red entra por o.fetch (en node, una simulada:
 * tools/lib/test_nube.js).  Todo devuelve promesas; los errores llevan
 * e.code: "token" (401), "permiso" (sin permiso de gist), "limite" (GitHub
 * frenó los pedidos), "falta" (no hay copia en la nube), "red" (sin
 * conexión), "formato" (lo de la nube no es una copia), "idioma" (es del
 * otro idioma) o "api" (otro error de GitHub); message() los dice en
 * castellano.
 */
(function (root) {
  "use strict";

  var API = "https://api.github.com";
  var DESC = "La Via C1 · Rumo C1: copia del progreso (la sube la app; no la edites a mano)";
  var TOKEN_KEY = "c1.gist.token";
  var README = "# Copia de La Via C1 / Rumo C1\n\n" +
    "La sube la app desde «Io / Eu → Tu copia → Sincronizar con tu GitHub Gist». " +
    "Es el mismo archivo que «💾 Guardar copia»: tu progreso, sin claves ni tokens. " +
    "No lo edites a mano; para dejar de usarla, borrá el gist y el token.\n";
  // Up to 300 gists are looked at to find the copy on a new phone.
  var PAGES = 3;
  // The token GitHub makes for this: a classic one with only «gist».
  var TOKEN_URL = "https://github.com/settings/tokens/new?scopes=gist&description=La%20Via%20C1%20%C2%B7%20Rumo%20C1";

  function fileName(storage) { return (storage || "c1") + ".json"; }

  function fail(code, status) {
    var e = new Error(code);
    e.code = code;
    e.status = status || 0;
    return e;
  }

  var MSG = {
    token: "GitHub no aceptó el token: revisá que esté bien copiado y que no haya vencido.",
    permiso: "El token no tiene permiso de gist: creá uno nuevo marcando solo «gist».",
    limite: "GitHub frenó los pedidos por un rato: probá de nuevo más tarde.",
    falta: "Todavía no hay una copia de este idioma en tu gist: subila desde el teléfono que tiene tu progreso.",
    red: "No llego a GitHub: probá de nuevo cuando tengas internet.",
    formato: "Lo que hay en la nube no es una copia válida.",
    idioma: "La copia de la nube es del otro idioma.",
    notoken: "Pegá primero tu token de GitHub."
  };
  function message(e) {
    var c = e && e.code;
    return MSG[c] || "GitHub respondió con un error" + (e && e.status ? " (" + e.status + ")" : "") + ": probá de nuevo más tarde.";
  }

  function header(r, name) {
    var h = r && r.headers;
    if (!h) return null;
    return typeof h.get === "function" ? h.get(name) : h[name] || h[name.toLowerCase()] || null;
  }

  /* One call to the API.  o: {token, fetch}.  Resolves the JSON (null for
     a 204); rejects with e.code. */
  function call(o, method, path, body) {
    var f = o.fetch || root.fetch;
    if (!o.token) return Promise.reject(fail("notoken"));
    if (typeof f !== "function") return Promise.reject(fail("red"));
    var init = {
      method: method,
      headers: { Accept: "application/vnd.github+json", Authorization: "Bearer " + o.token, "X-GitHub-Api-Version": "2022-11-28" }
    };
    if (body !== undefined) {
      init.headers["Content-Type"] = "application/json";
      init.body = JSON.stringify(body);
    }
    return Promise.resolve().then(function () { return f(API + path, init); }).then(function (r) {
      if (!r) throw fail("red");
      if (r.status === 401) throw fail("token", 401);
      if (r.status === 403 || r.status === 429) throw fail(header(r, "x-ratelimit-remaining") === "0" || r.status === 429 ? "limite" : "permiso", r.status);
      if (r.status === 404) throw fail("falta", 404);
      if (r.status < 200 || r.status >= 300) throw fail("api", r.status);
      return r.status === 204 ? null : r.json();
    }, function (e) {
      throw e && e.code ? e : fail("red");
    });
  }

  function hasFile(g, name) { return !!(g && g.files && Object.prototype.hasOwnProperty.call(g.files, name)); }

  /* The gist of this language on GitHub: {id, updated} or null.  o:
     {token, fetch, storage, id}.  The list of the learner's gists comes
     without their content (a light call, also before each upload): the one
     kept on this phone (o.id) if it still has the file, else the newest
     with the file (a new phone).  With more than 300 gists, o.id is asked
     for directly. */
  function remote(o) {
    var name = fileName(o.storage);
    function byList(page, mine, best) {
      return call(o, "GET", "/gists?per_page=100&page=" + page).then(function (list) {
        (list || []).forEach(function (g) {
          if (!hasFile(g, name)) return;
          if (o.id && g.id === o.id) mine = g;
          if (!best || String(g.updated_at) > String(best.updated_at)) best = g;
        });
        var more = !!list && list.length === 100;
        if (!mine && more && page < PAGES) return byList(page + 1, mine, best);
        var g = mine || best;
        if (g) return { id: g.id, updated: g.updated_at };
        if (!o.id || !more) return null;   // all seen, or nothing kept here
        return call(o, "GET", "/gists/" + o.id).then(function (x) {
          return hasFile(x, name) ? { id: x.id, updated: x.updated_at, gist: x } : null;
        }, function (e) {
          if (e.code === "falta") return null;
          throw e;
        });
      });
    }
    return byList(1, null, null);
  }

  /* An envelope is a copy: {app: "c1", save} with a save that has xp and
     cards (the same test as importing a file).  Returns the save or null. */
  function saveOf(env) {
    var s = env && env.app === "c1" && env.save ? env.save : null;
    return s && typeof s.xp === "number" && s.cards && typeof s.cards === "object" ? s : null;
  }

  /* The copy of this language: {id, updated, env}.  o: {token, fetch,
     storage, lang, id}. */
  function pull(o) {
    var name = fileName(o.storage);
    return remote(o).then(function (r) {
      if (!r) throw fail("falta", 404);
      return (r.gist ? Promise.resolve(r.gist) : call(o, "GET", "/gists/" + r.id)).then(function (g) {
        var f = g && g.files && g.files[name];
        if (!f) throw fail("falta", 404);
        // Past 1 MB, the API cuts the content: the whole file is at raw_url
        // (a secret address, no token needed).
        var text = !f.truncated && typeof f.content === "string" ? Promise.resolve(f.content)
          : Promise.resolve().then(function () { return (o.fetch || root.fetch)(f.raw_url); }).then(function (res) {
            if (!res || res.status < 200 || res.status >= 300) throw fail(res && res.status === 404 ? "falta" : "api", res && res.status);
            return res.text();
          }, function (e) { throw e && e.code ? e : fail("red"); });
        return text.then(function (t) {
          var env;
          try { env = JSON.parse(t); } catch (e) { throw fail("formato"); }
          if (!saveOf(env)) throw fail("formato");
          if (o.lang && env.lang && env.lang !== o.lang) {
            var e = fail("idioma");
            e.env = env;
            throw e;
          }
          return { id: g.id, updated: g.updated_at, env: env };
        });
      });
    });
  }

  /* Uploads the envelope: into the gist r.id (from remote), or a new
     secret gist.  Resolves {id, updated, created}. */
  function push(o, env, r) {
    var name = fileName(o.storage), files = {};
    files[name] = { content: JSON.stringify(env) };
    function create() {
      var all = { "LEEME.md": { content: README } };
      all[name] = files[name];
      return call(o, "POST", "/gists", { description: DESC, public: false, files: all }).then(function (g) {
        return { id: g.id, updated: g.updated_at, created: true };
      }, function (e) {
        // GitHub answers 404 to a token without the gist scope
        if (e.code === "falta") throw fail("permiso", 404);
        throw e;
      });
    }
    var id = r ? r.id : o.id;
    if (!id) return create();
    return call(o, "PATCH", "/gists/" + id, { files: files }).then(function (g) {
      return { id: g.id, updated: g.updated_at, created: false };
    }, function (e) {
      if (e.code === "falta") return create();   // deleted in the meantime
      throw e;
    });
  }

  /* The envelope of a copy, the same for the file and the gist.  meta:
     {lang, brand, v}; now: ms (tests). */
  function envelope(state, meta, now) {
    meta = meta || {};
    return { app: "c1", lang: meta.lang, brand: meta.brand, v: meta.v, at: new Date(now || Date.now()).toISOString(), save: state };
  }

  // When the save of an envelope was last changed (ms): its savedAt, else
  // when it was made.
  function stamp(env) {
    var s = env && env.save, t = s && +s.savedAt;
    return t > 0 ? t : Date.parse(env && env.at) || 0;
  }
  // "newer", "older" or "same": the cloud's envelope against the save here.
  function compare(env, local) {
    var a = stamp(env), b = local && +local.savedAt || 0;
    return a > b ? "newer" : a < b ? "older" : "same";
  }

  /* The gist changed since this phone last uploaded or brought it: another
     phone uploaded.  r from remote(), sync from readSync(). */
  function conflict(r, sync) {
    if (!r) return false;
    return !sync || !sync.gistAt || String(r.updated) !== String(sync.gistAt);
  }

  function dayKey(now) {
    var d = new Date(now || Date.now());
    return d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
  }
  /* The automatic upload when the app closes: turned on, with a token,
     not done today, and the progress changed since this phone last was in
     step with the cloud (sync.mark: the save's savedAt when it uploaded or
     brought the copy). */
  function autoDue(sync, token, savedAt, now) {
    if (!token || !sync || !sync.auto) return false;
    if (sync.day === dayKey(now)) return false;
    return !sync.mark || (+savedAt || 0) > sync.mark;
  }

  /* This phone's storage (localStorage, or another with getItem/setItem
     in the tests).  Nothing of this goes into the save. */
  function store(ls) {
    ls = ls || (typeof root.localStorage !== "undefined" ? root.localStorage : null);
    function get(k) { try { return ls ? ls.getItem(k) : null; } catch (e) { return null; } }
    function set(k, v) { try { if (!ls) return; if (v == null || v === "") ls.removeItem(k); else ls.setItem(k, v); } catch (e) { /* */ } }
    return {
      token: function () { return get(TOKEN_KEY) || ""; },
      setToken: function (t) { set(TOKEN_KEY, String(t || "").trim()); },
      sync: function (prefix) {
        try { var j = JSON.parse(get(prefix + ".gist") || "null"); return j && typeof j === "object" ? j : {}; } catch (e) { return {}; }
      },
      setSync: function (prefix, obj) { set(prefix + ".gist", obj ? JSON.stringify(obj) : null); }
    };
  }

  var api = {
    API: API, DESC: DESC, TOKEN_KEY: TOKEN_KEY, TOKEN_URL: TOKEN_URL, fileName: fileName,
    call: call, remote: remote, pull: pull, push: push, envelope: envelope, saveOf: saveOf,
    stamp: stamp, compare: compare, conflict: conflict, autoDue: autoDue, dayKey: dayKey,
    store: store, message: message
  };
  if (typeof module === "object" && module.exports) module.exports = api;
  root.Nube = api;
})(typeof window !== "undefined" ? window : typeof globalThis !== "undefined" ? globalThis : this);
