/*
 * IA: el cliente de la clave propia del alumno (Anthropic, Claude Haiku).
 *
 * Un solo proveedor y un solo modelo: Claude Haiku (claude-haiku-5-5), por
 * la API de Mensajes, directo desde el navegador.  La clave no sale del
 * teléfono salvo hacia Anthropic.  Vale para todos los idiomas: los
 * prompts están en cada paquete (lang/<código>/scrivi.js), el cliente acá.
 *
 *   IA.llm(prompt, keys, done, opts)
 *     prompt  un texto, o {system, messages: [{role, content}…]} para un chat
 *     keys    {claude, ws}, o la clave sola (ws: el ID del workspace de
 *             Anthropic, para las claves que no son de un workspace)
 *     done    function (err, data, meta)  data = el JSON de la respuesta;
 *             meta = {provider, id, model, ms, first}
 *     opts    stream: function (raw) — la respuesta a medida que llega
 *                    (para mostrar el turno del personaje mientras se escribe)
 *             think: "off" (por defecto: sin razonamiento, rápido) o "low"
 *             max: tope de tokens de la respuesta (por defecto 4096)
 *             (temperature y hedge, de cuando había dos proveedores, se
 *             ignoran: Haiku no acepta otra temperatura y no hay un segundo
 *             proveedor con quien competir)
 *
 * Cada pedido espera como mucho 20 s (o 15 s hasta el primer fragmento, si
 * llega de a poco); si Anthropic está saturado (429, 5xx, 529), dos vueltas
 * más tras 2 y 5 s, dentro de los 40 s.
 */
(function (root) {
  "use strict";

  var MODEL = "claude-haiku-5-5";
  var URL = "https://api.anthropic.com/v1/messages";
  var PROVIDERS = [{ id: "claude", name: "Claude", url: URL, model: MODEL }];
  var P = PROVIDERS[0];

  function prefix() { return (root.LANG && root.LANG.storage) || "c1"; }
  function readJSON(k, d) { try { var v = JSON.parse(root.localStorage.getItem(k) || "null"); return v == null ? d : v; } catch (e) { return d; } }
  function writeJSON(k, v) { try { root.localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* lleno o sin permiso */ } }

  // Un solo proveedor: el orden ya no se elige (queda por compatibilidad).
  function order() { return ["claude"]; }
  function setOrder() { /* nada que elegir */ }

  // Cuánto tardó la última respuesta (Io lo muestra).
  function noteLatency(first, total) {
    writeJSON(prefix() + ".claude.lat", { model: MODEL, first: first, total: total, at: Date.now() });
  }
  function stats() {
    var lat = readJSON(prefix() + ".claude.lat", null);
    return { claude: { model: MODEL, lat: lat } };
  }

  // El JSON dentro de una respuesta (hay modelos que piensan en voz alta en
  // <think>…</think> o lo envuelven en ```).
  function jsonOf(txt) {
    txt = String(txt || "").replace(/<think>[\s\S]*?<\/think>/g, "").replace(/```(json)?/g, "").trim();
    var a = txt.indexOf("{"), b = txt.lastIndexOf("}");
    return JSON.parse(a >= 0 && b > a ? txt.slice(a, b + 1) : txt);
  }
  // El valor de un campo de texto de un JSON que todavía está llegando:
  // {text, closed}.  Sirve para mostrar el turno mientras se escribe.
  function partialField(raw, name) {
    raw = String(raw || "");
    var m = new RegExp('"' + name + '"\\s*:\\s*"').exec(raw);
    if (!m) return null;
    var i = m.index + m[0].length, out = "";
    while (i < raw.length) {
      var ch = raw[i];
      if (ch === '"') return { text: out, closed: true };
      if (ch === "\\") {
        var nx = raw[i + 1];
        if (nx == null) break;
        if (nx === "n") out += "\n";
        else if (nx === "t") out += " ";
        else if (nx === "u") {
          var hex = raw.substr(i + 2, 4);
          if (hex.length < 4) break;
          out += String.fromCharCode(parseInt(hex, 16));
          i += 6;
          continue;
        } else out += nx;
        i += 2;
        continue;
      }
      out += ch;
      i++;
    }
    return { text: out, closed: false };
  }

  // El sistema y los mensajes de la API de Mensajes: el system va aparte y
  // la conversación tiene que empezar con el alumno.
  function messagesOf(prompt) {
    var sys = "Respondés solo con JSON válido.", msgs;
    if (prompt && typeof prompt === "object" && prompt.messages) {
      if (prompt.system) sys = prompt.system + "\n\n" + sys;
      // (an empty message is a 400 for the API: left out)
      msgs = prompt.messages.filter(function (m) { return m && m.content != null && String(m.content).trim() && m.role !== "system"; })
        .map(function (m) { return { role: m.role === "assistant" ? "assistant" : "user", content: String(m.content) }; });
    } else msgs = [{ role: "user", content: String(prompt) }];
    if (!msgs.length || msgs[0].role !== "user") msgs.unshift({ role: "user", content: "(Empezá.)" });
    return { system: sys, messages: msgs };
  }

  // Las esperas antes de volver a preguntar si Anthropic está saturado.
  var RETRY_WAITS = [2000, 5000];

  function llm(prompt, keys, done, opts) {
    opts = opts || {};
    if (typeof root.fetch !== "function") return done(new Error("sin fetch"));
    var key = typeof keys === "string" ? keys : (keys || {}).claude;
    if (!key) return done(new Error("sin clave"));
    var ws = typeof keys === "string" ? "" : String((keys || {}).ws || "").trim();
    var deadline = Date.now() + (opts.stream ? 45000 : 40000), round = 0, over = false, plain = false;
    var pm = messagesOf(prompt);
    function finish(err, data, meta) { if (over) return; over = true; done(err, data, meta); }
    function retry(err) {
      if (round < RETRY_WAITS.length && Date.now() + RETRY_WAITS[round] + 3000 < deadline) {
        setTimeout(attempt, RETRY_WAITS[round++]);
      } else finish(err);
    }
    function attempt() {
      var ctl = typeof AbortController === "function" ? new AbortController() : null;
      var t0 = Date.now(), firstAt = 0;
      var timer = setTimeout(function () { if (ctl) ctl.abort(); }, Math.min(opts.stream ? 15000 : 20000, Math.max(3000, deadline - Date.now())));
      // «off»: sin razonamiento (rápido); «low»: razona poco antes de responder
      // plain: the API rejected the reasoning options once: the bare request
      var body = { model: MODEL, max_tokens: opts.max || 4096, system: pm.system, messages: pm.messages };
      if (!plain) {
        body.output_config = { effort: "low" };
        if (opts.think === "low") body.max_tokens = Math.max(body.max_tokens, 8000);
        else body.thinking = { type: "disabled" };
      }
      if (opts.stream) body.stream = true;
      var headers = { "Content-Type": "application/json", "x-api-key": key, "anthropic-version": "2023-06-01",
                      "anthropic-dangerous-direct-browser-access": "true" };
      if (ws) headers["anthropic-workspace-id"] = ws;
      root.fetch(URL, {
        method: "POST", signal: ctl ? ctl.signal : undefined, headers: headers,
        body: JSON.stringify(body)
      }).then(function (r) {
        if (over) return null;
        if (r.ok) {
          if (opts.stream && r.body && typeof r.body.getReader === "function") return readStream(r);
          return r.json().then(function (j) {
            if (j && j.stop_reason === "refusal") throw new Error("Claude no quiso responder");
            return ((j && j.content) || []).filter(function (c) { return c && c.type === "text"; }).map(function (c) { return c.text; }).join("");
          });
        }
        return r.text().then(function (b) {
          clearTimeout(timer);
          // what Anthropic says (shown to the learner: it names the problem)
          var why = "";
          try { why = String((JSON.parse(b).error || {}).message || ""); } catch (e) { why = ""; }
          why = why.replace(/\s+/g, " ").slice(0, 160);
          if (r.status === 401 || r.status === 403) finish(new Error("HTTP " + r.status + ", clave" + (why ? ": " + why : "")));
          else if (r.status === 400 && /workspace/i.test(b)) finish(new Error(ws ? "el ID del workspace no sirve con esta clave (400)" : "esta clave no es de un workspace: en el perfil (abajo a la derecha) poné el ID del workspace (wrkspc_…)"));
          else if (r.status === 400 && /credit|billing/i.test(b)) finish(new Error("la cuenta de Anthropic no tiene crédito (400)"));
          else if (r.status === 400 && !plain && /thinking|effort|output_config|budget/i.test(b)) { plain = true; attempt(); }
          else if (r.status === 429 || r.status === 529 || r.status >= 500) retry(new Error(r.status === 429 ? "se terminó el cupo por ahora (429)" : "Claude está saturado ahora (" + r.status + ")"));
          else finish(new Error("HTTP " + r.status + (why ? ": " + why : "")));
          return null;
        });
      }).then(function (txt) {
        if (txt == null || over) return;
        clearTimeout(timer);
        var data;
        try { data = jsonOf(txt); } catch (e) { return finish(new Error("respuesta ilegible")); }
        var total = Date.now() - t0;
        noteLatency(firstAt ? firstAt - t0 : total, total);
        finish(null, data, { provider: P.name, id: P.id, model: MODEL, ms: total, first: firstAt ? firstAt - t0 : total });
      }).catch(function (e) {
        clearTimeout(timer);
        if (over) return;
        if (/abort/i.test(String(e && (e.name || e.message) || e))) return finish(new Error("la IA no respondió a tiempo"));
        if (/no quiso/.test(String(e && e.message))) return finish(e);
        retry(e);
      });

      // La respuesta de a poco (text/event-stream): los «content_block_delta» traen el texto.
      function readStream(r) {
        var reader = r.body.getReader(), dec = new TextDecoder(), buf = "", raw = "";
        return new Promise(function (resolve, reject) {
          (function pump() {
            reader.read().then(function (res) {
              if (over) { try { reader.cancel(); } catch (e) { /* */ } return resolve(null); }
              if (res.done) return resolve(raw);
              buf += dec.decode(res.value, { stream: true });
              var lines = buf.split("\n");
              buf = lines.pop();
              lines.forEach(function (ln) {
                ln = ln.trim();
                if (ln.indexOf("data:") !== 0) return;
                try {
                  var j = JSON.parse(ln.slice(5).trim());
                  if (j.type === "message_delta" && j.delta && j.delta.stop_reason === "refusal") return reject(new Error("Claude no quiso responder"));
                  var c = j.type === "content_block_delta" && j.delta && j.delta.type === "text_delta" ? j.delta.text : "";
                  if (c) {
                    if (!firstAt) {
                      firstAt = Date.now();
                      // ya empezó: el reloj del primer fragmento no corre más, el del total sí
                      clearTimeout(timer);
                      timer = setTimeout(function () { if (ctl) ctl.abort(); }, Math.max(5000, deadline - Date.now()));
                    }
                    raw += c;
                    try { opts.stream(raw, P); } catch (e) { /* la pantalla no frena el pedido */ }
                  }
                } catch (e) { /* un renglón partido: llega completo en el próximo */ }
              });
              pump();
            }, reject);
          })();
        });
      }
    }
    attempt();
  }

  var api = { PROVIDERS: PROVIDERS, MODEL: MODEL, llm: llm, retryWaits: function (w) { RETRY_WAITS = w; }, jsonOf: jsonOf, partialField: partialField,
              messagesOf: messagesOf, order: order, setOrder: setOrder, stats: stats };
  if (typeof module === "object" && module.exports) module.exports = api;
  root.IA = api;
})(typeof window !== "undefined" ? window : globalThis);
