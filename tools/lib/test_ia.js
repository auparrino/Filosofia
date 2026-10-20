/* El cliente de IA del núcleo (docs/js/ia.js), con fetch simulado:
   - un pedido a Claude Haiku por la API de Mensajes, con la clave, la
     versión y el permiso para el navegador; sin temperatura;
   - «think: off» apaga el razonamiento; «low» lo deja, con más tokens;
   - saturado (429, 5xx, 529): espera y otra vuelta; clave mala o sin
     crédito: error claro sin reintentar; un rechazo se informa;
   - la respuesta de a poco (stream) se muestra mientras llega y se lee el
     JSON al final; el campo parcial se extrae bien con escapes;
   - el chat va con el system aparte y empieza con el alumno.
   Run: node tools/lib/test_ia.js */
"use strict";
var pack = require("./pack.js");
var ctx = pack("es", { upTo: "errores.js" });
ctx.TextDecoder = TextDecoder;
ctx.TextEncoder = TextEncoder;
ctx.AbortController = AbortController;
var IA = ctx.IA;
IA.retryWaits([5, 10]);

var fails = 0, checks = 0;
function ok(c, what) { checks++; if (!c) { fails++; console.log("FAIL " + what); } }

function memStore() {
  var mem = {};
  ctx.localStorage = { getItem: function (k) { return k in mem ? mem[k] : null; }, setItem: function (k, v) { mem[k] = String(v); } };
  return mem;
}
function jsonResp(status, body) {
  return Promise.resolve({ ok: status === 200, status: status, json: function () { return Promise.resolve(body); },
                           text: function () { return Promise.resolve(JSON.stringify(body || {})); } });
}
function reply(txt) { return { model: "claude-haiku-5-5", stop_reason: "end_turn", content: [{ type: "thinking", thinking: "" }, { type: "text", text: txt }] }; }
// Un cuerpo que llega de a pedazos, como el text/event-stream de la API de Mensajes.
function sseBody(chunks, delay) {
  var enc = new TextEncoder(), i = 0;
  return { getReader: function () {
    return { read: function () {
      return new Promise(function (res) {
        setTimeout(function () {
          if (i >= chunks.length) return res({ done: true });
          var c = chunks[i++];
          res({ done: false, value: enc.encode("event: content_block_delta\ndata: " +
            JSON.stringify({ type: "content_block_delta", index: 0, delta: { type: "text_delta", text: c } }) + "\n\n" +
            (i === chunks.length ? "event: message_stop\ndata: {\"type\": \"message_stop\"}\n\n" : "")) });
        }, delay || 1);
      });
    }, cancel: function () {} };
  } };
}

var CASES = [];
function test(name, fn) { CASES.push([name, fn]); }
function run() {
  var c = CASES.shift();
  if (!c) { console.log("\n" + (fails ? "FALLAN " + fails : "0 errores") + " · " + checks + " chequeos (cliente de IA)"); process.exit(fails ? 1 : 0); }
  c[1](function () { run(); });
}

test("un pedido a Claude Haiku, bien armado", function (next) {
  memStore();
  var seen = [];
  ctx.fetch = function (url, opt) { seen.push([url, opt]); return jsonResp(200, reply('{"ok": 1}')); };
  IA.llm("p", { claude: "sk-ant-x" }, function (e, d, meta) {
    var b = JSON.parse(seen[0][1].body), h = seen[0][1].headers;
    ok(!e && d.ok === 1 && meta.provider === "Claude" && meta.model === "claude-haiku-5-5", "respuesta y meta: " + (e && e.message));
    ok(seen[0][0] === "https://api.anthropic.com/v1/messages" && h["x-api-key"] === "sk-ant-x" && h["anthropic-version"] &&
       h["anthropic-dangerous-direct-browser-access"] === "true", "URL y cabeceras");
    ok(b.model === "claude-haiku-5-5" && b.temperature === undefined && b.thinking && b.thinking.type === "disabled" &&
       b.output_config.effort === "low" && b.messages[0].role === "user" && /JSON/.test(b.system), "cuerpo: " + seen[0][1].body.slice(0, 200));
    IA.llm("p", "sk-ant-y", function (e2) {
      ok(!e2 && seen[1][1].headers["x-api-key"] === "sk-ant-y", "la clave sola, como texto");
      IA.llm("p", { claude: "k" }, function () {
        var b3 = JSON.parse(seen[2][1].body);
        ok(!b3.thinking && b3.max_tokens >= 8000, "think: low deja razonar, con más tokens");
        next();
      }, { think: "low" });
    });
  });
});

test("saturado: espera y otra vuelta; si sigue, error claro", function (next) {
  memStore();
  var n = 0;
  ctx.fetch = function () { n++; return n < 3 ? jsonResp(529, {}) : jsonResp(200, reply('{"ok": 3}')); };
  IA.llm("p", { claude: "k" }, function (e, d) {
    ok(!e && d.ok === 3 && n === 3, "dos esperas y responde: " + n);
    n = 0;
    ctx.fetch = function () { n++; return jsonResp(503, {}); };
    IA.llm("p", { claude: "k" }, function (e2) {
      ok(e2 && /saturado/.test(e2.message) && n === 3, "tres intentos y el error: " + (e2 && e2.message) + " · " + n);
      n = 0;
      ctx.fetch = function () { n++; return jsonResp(429, {}); };
      IA.llm("p", { claude: "k" }, function (e3) { ok(e3 && /cupo/.test(e3.message), "429: sin cupo"); next(); });
    });
  });
});

test("un 400 por las opciones de razonamiento: otra vez sin ellas; otro 400: el motivo a la vista", function (next) {
  memStore();
  var bodies = [];
  ctx.fetch = function (url, opt) {
    var b = JSON.parse(opt.body); bodies.push(b);
    return b.thinking || b.output_config ? jsonResp(400, { type: "error", error: { type: "invalid_request_error", message: "thinking: not supported" } })
                                          : jsonResp(200, reply('{"ok": 2}'));
  };
  IA.llm("p", { claude: "k" }, function (e, d) {
    ok(!e && d.ok === 2 && bodies.length === 2 && !bodies[1].thinking && !bodies[1].output_config, "sin razonamiento la segunda vez: " + (e && e.message));
    ctx.fetch = function () { return jsonResp(400, { type: "error", error: { type: "invalid_request_error", message: "messages: text content blocks must be non-empty" } }); };
    IA.llm("p", { claude: "k" }, function (e2) {
      ok(e2 && /HTTP 400: messages: text content blocks must be non-empty/.test(e2.message), "el motivo del 400 llega al mensaje: " + (e2 && e2.message));
      next();
    });
  });
});

test("clave mala, sin crédito o rechazo: sin reintentar", function (next) {
  memStore();
  var n = 0;
  ctx.fetch = function () { n++; return jsonResp(401, { error: { message: "invalid x-api-key" } }); };
  IA.llm("p", { claude: "k" }, function (e) {
    ok(e && /clave/.test(e.message) && n === 1, "401: la clave");
    ctx.fetch = function () { return jsonResp(400, { error: { message: "Your credit balance is too low" } }); };
    IA.llm("p", { claude: "k" }, function (e2) {
      ok(e2 && /crédito/.test(e2.message), "400 sin crédito");
      ctx.fetch = function () { return jsonResp(200, { stop_reason: "refusal", content: [] }); };
      IA.llm("p", { claude: "k" }, function (e3) {
        ok(e3 && /no quiso/.test(e3.message), "rechazo");
        ctx.fetch = function () { return jsonResp(200, reply("no es json")); };
        IA.llm("p", { claude: "k" }, function (e4) { ok(e4 && /ilegible/.test(e4.message), "respuesta ilegible"); next(); });
      });
    });
  });
});

test("de a poco: el turno se muestra mientras llega", function (next) {
  memStore();
  var seen = [];
  ctx.fetch = function (url, opt) {
    ok(JSON.parse(opt.body).stream === true, "pide la respuesta de a poco");
    return Promise.resolve({ ok: true, status: 200, body: sseBody(['{"risposta": "Buon', "giorno", '!", "fine": true}']) });
  };
  IA.llm("p", { claude: "k" }, function (e, d, meta) {
    ok(!e && d.risposta === "Buongiorno!" && d.fine === true, "el JSON entero al final: " + (e && e.message));
    ok(seen.length >= 2 && seen[0] === "Buon" && seen[seen.length - 1] === "Buongiorno!", "se ve mientras llega: " + JSON.stringify(seen));
    ok(meta && meta.first <= meta.ms, "tiempo hasta el primer pedazo");
    next();
  }, { stream: function (raw) { var f = IA.partialField(raw, "risposta"); if (f && (!seen.length || seen[seen.length - 1] !== f.text)) seen.push(f.text); } });
});

test("campo parcial con escapes", function (next) {
  var f = IA.partialField('{"risposta": "Ciao \\"Marco\\",\\nbenvenuto \\u00e8', "risposta");
  ok(f && f.text === 'Ciao "Marco",\nbenvenuto è' && !f.closed, "escapes: " + JSON.stringify(f));
  ok(IA.partialField('{"a": "x"', "risposta") === null, "campo ausente");
  next();
});

test("el chat: system aparte y empieza con el alumno", function (next) {
  var m = IA.messagesOf({ system: "Sos Marco.", messages: [{ role: "assistant", content: "Ciao!" }, { role: "user", content: "Ciao" }] });
  ok(/^Sos Marco\./.test(m.system) && /JSON/.test(m.system), "system: " + m.system);
  ok(m.messages[0].role === "user" && m.messages[1].role === "assistant" && m.messages[2].content === "Ciao", "empieza con el alumno: " + JSON.stringify(m.messages));
  next();
});

test("una clave sin workspace: el ID va en el encabezado", function (next) {
  memStore();
  var hs = [];
  ctx.fetch = function (url, opt) {
    hs.push(opt.headers);
    return opt.headers["anthropic-workspace-id"] ? jsonResp(200, reply('{"ok": 3}'))
      : jsonResp(400, { error: { message: "This API key is not scoped to a workspace, so this request must include the anthropic-workspace-id header" } });
  };
  IA.llm("p", { claude: "k" }, function (e) {
    ok(e && /ID del workspace/.test(e.message) && hs.length === 1, "sin ID: dice qué falta: " + (e && e.message));
    IA.llm("p", { claude: "k", ws: " wrkspc_01 " }, function (e2, d2) {
      ok(!e2 && d2.ok === 3 && hs[1]["anthropic-workspace-id"] === "wrkspc_01", "con ID: va en el encabezado");
      next();
    });
  });
});

test("sin clave", function (next) {
  IA.llm("p", {}, function (e) { ok(e && /sin clave/.test(e.message), "error claro"); next(); });
});

run();
