#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Valida y compila el banco de palabras, oraciones y errores (portugués de Brasil).

Lee      tools/pt/bank/*.py  (parole_nomi, parole_verbi_agg, frasi_banca,
                            errori_banca, trasferimento)
Escribe  docs/lang/pt/data/bank.json

Cada entrada se controla; las que fallan se descartan y se informan, para que
un error de tipeo del banco nunca llegue al alumno como respuesta «correcta».

Controles:
- formato de cada tabla (mismo esquema que el banco italiano), niveles MCER,
  duplicados;
- oraciones: semana mínima `w` (1-52) coherente con las etiquetas
  gramaticales (tools/curriculo.py, TENSE_WEEK), el hueco (`gap`) presente en
  la respuesta modelo, y ninguna palabra o grafía española ni anterior al
  Acuerdo de 1990 (muy, pero, hay, ñ, idéia, lingüiça…) en las respuestas;
- errores: la corrección aplicada a `wrong` da exactamente `right`, la
  categoría existe y `right` pasa el mismo control de español;
- verbos: los que un conjugador regular generaría mal (durmo, passeio,
  constrói, faço, mantenho…) se marcan como irregulares.  Si node está
  disponible y docs/lang/pt/conjugator.js es el conjugador portugués, además se
  le pregunta a él: un verbo que conoce y cuyas formas difieren de las
  regulares queda irregular, y cada hueco de verbo se compara con las formas
  que el conjugador genera para su lema (aviso, no descarte).

Semanas: a diferencia del banco italiano (que las deducía con
tools/sillabo.py), cada oración y cada error trae su `w` escrito a mano;
`wg` (semana del ejercicio de completar) es igual a `w`.

Uso:  python3 tools/build_bank.py
"""
import importlib
import json
import os
import re
import shutil
import subprocess
import sys
import unicodedata

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
sys.path.insert(0, os.path.join(ROOT, "tools", "pt"))

LEVELS = {"A1", "A2", "B1", "B2", "C1"}
ERROR_CATS = {
    "contraccion", "articulo", "genero", "plural", "concordancia", "preposicion",
    "regencia", "muito", "gostar", "a_personal", "perfeito_composto", "subjuntivo",
    "futuro_subj", "inf_pessoal", "pronome", "colocacao", "crase", "ortografia",
    "espanol", "falso_amigo", "tempo", "persona", "participio", "verbo_irregular",
}

problems = []

# ------------------------------------------------------------ semanas

try:
    import curriculo
    _TW = dict(curriculo.TENSE_WEEK)
except Exception:                                    # pragma: no cover
    _TW = {}

# Etiqueta de oración → primera semana en la que puede aparecer.
TAG_WEEK = {
    "gerundio": _TW.get("gerundio", 8),
    "ir_inf": 8,
    "perfeito": _TW.get("perfeito", 11),
    "imperativo": _TW.get("imperativo", 12),
    "reflexivos": 12,
    "gostar": 5,                 # «gosto de» como forma fija desde el principio
    "imperfeito": _TW.get("imperfeito", 15),
    "perf_imperf": _TW.get("imperfeito", 15),
    "pronombres": 16,
    "futuro": _TW.get("futuro", 17),
    "condicional": _TW.get("condicional", 18),
    "comparativos": 19,
    "indefinidos": 20,
    "mais_que_perfeito": _TW.get("maisQuePerfeitoComposto", 21),
    "participio": _TW.get("participio", 22),
    "pasiva": _TW.get("participio", 22),
    "subjuntivo": _TW.get("subjPresente", 23),
    "conjunciones": 24,
    "relativos": 25,
    "futuro_subj": _TW.get("subjFuturo", 27),
    "subj_imperfeito": _TW.get("subjImperfeito", 28),
    "condicionales": _TW.get("subjImperfeito", 28),
    "inf_pessoal": _TW.get("infPessoal", 29),
    "compuestos": _TW.get("subjMaisQuePerfeito", 30),
    "discurso_indirecto": 31,
    "se_pasiva": 32,
    "conectores": 34,
    "reducidas": 42,
}

# Categoría de error → primera semana en la que se puede pedir corregirlo.
ERR_CAT_WEEK = {
    "crase": 7, "pronome": 10, "perfeito_composto": 11, "colocacao": 12, "gostar": 14,
    "regencia": 14, "participio": _TW.get("participio", 22), "subjuntivo": _TW.get("subjPresente", 23),
    "futuro_subj": _TW.get("subjFuturo", 27), "inf_pessoal": _TW.get("infPessoal", 29),
}

# ------------------------------------------------ español y grafía vieja

# Palabras españolas que no existen en portugués (o que acá delatan un
# calco): no pueden estar en una respuesta.
_SPANISH = re.compile(
    r"(?<![\w-])(muy|pero|también|tambien|hasta|entonces|año|años|hay|y|el|los|las|del|al|"
    r"yo|usted|ustedes|nosotros|ellos|ellas|ahora|hoy|ayer|mañana|siempre|donde|cuando|"
    r"quiero|puedo|tengo|soy|estoy|voy|con|en|una|unos|unas|mucho|mucha|muchos|muchas)(?![\w-])",
    re.I)
# Grafías que el Acuerdo de 1990 eliminó, tildes que faltan y letras españolas.
_OLD = re.compile(
    r"ü|ñ|¿|¡|(?<!\w)(idéia|idéias|vôo|vôos|enjôo|lêem|vêem|crêem|dêem|pára|assembléia|"
    r"européia|européias|heróico|heróica|jóia|jóias|platéia|estréia|colméia|geléia|"
    r"voce|voces|nao|tambem|entao|portugues|ingles|ja|ate|tres|mes|agua|onibus)(?!\w)",
    re.I)


_NAMES = re.compile(r"Mar del Plata|Río de la Plata|El Salvador|Los Angeles")


def spanish_leak(text):
    t = re.sub(r"«[^»]*»", "", text)       # las citas pueden llevar otra lengua
    t = _NAMES.sub("", t)                    # nombres propios en castellano
    m = _SPANISH.search(t) or _OLD.search(t)
    return m.group(0) if m else None


# ------------------------------------------------------------- verbos

# Verbos que un conjugador regular (con las reglas ortográficas c/qu, g/gu,
# ç, g/j) generaría mal: cambios de raíz, -ear, -uir, -air, -oer, -zer,
# -uzir, derivados de ter / vir / pôr / ver, participio irregular.
FORCE_IRREGULAR = {
    "ser", "estar", "ter", "haver", "ir", "vir", "ver", "ler", "crer", "dar", "pôr",
    "poder", "querer", "saber", "caber", "valer", "perder", "fazer", "dizer", "trazer",
    "ouvir", "pedir", "medir", "rir", "sorrir", "requerer", "prover", "reaver",
    "dormir", "cobrir", "descobrir", "encobrir", "recobrir", "tossir", "engolir",
    "servir", "seguir", "conseguir", "perseguir", "prosseguir", "sentir", "consentir",
    "pressentir", "ressentir", "vestir", "investir", "revestir", "repetir", "competir",
    "preferir", "referir", "transferir", "conferir", "inferir", "interferir", "ferir",
    "sugerir", "digerir", "ingerir", "mentir", "desmentir", "divertir", "converter",
    "advertir", "subir", "sacudir", "acudir", "fugir", "consumir", "cuspir", "polir",
    "progredir", "agredir", "transgredir", "prevenir", "despedir", "impedir", "expedir",
    "abrir", "escrever", "descrever", "inscrever", "prescrever", "ganhar", "gastar",
    "pagar", "aceitar", "entregar", "acender", "eleger", "expulsar", "imprimir",
    "matar", "morrer", "prender", "salvar", "soltar", "suspender", "extinguir",
    "mediar", "ansiar", "remediar", "incendiar", "odiar", "intermediar",
}
_IRR_RE = re.compile(
    r"(ear|oer|uir|air|zer|uzir|^manter|^obter|^conter|^deter|^reter|^entreter|^abster|"
    r"^suster|^ater|vir|p[oô]r|^prever|^rever|^antever|^entrever|^crer|^descrer|^ler|^reler)"
    r"(-se)?$")


def looks_irregular(inf):
    b = re.sub(r"-se$", "", inf)
    return b in FORCE_IRREGULAR or bool(_IRR_RE.search(b))


# --------------------------------------------------------------- utils

def warn(msg):
    problems.append(msg)


def load(name, *attrs):
    try:
        mod = importlib.import_module("bank." + name)
    except ModuleNotFoundError:
        warn("falta tools/bank/%s.py" % name)
        return [None] * len(attrs)
    except Exception as e:                           # archivo a medio escribir
        warn("tools/bank/%s.py no se puede importar: %s" % (name, e))
        return [None] * len(attrs)
    return [getattr(mod, a, None) for a in attrs]


def clean(s):
    return re.sub(r"\s+", " ", str(s or "")).strip()


def deaccent(s):
    return unicodedata.normalize("NFD", s).encode("ascii", "ignore").decode()


# ------------------------------------------------------------- palabras

def build_nouns(raw):
    out, seen = [], set()
    for n in raw or []:
        if len(n) != 7:
            warn("sustantivo mal formado: %r" % (n,))
            continue
        s, g, pl, es, theme, lvl, note = [clean(x) for x in n]
        if not s or not pl or not es or g not in ("m", "f") or lvl not in LEVELS:
            warn("sustantivo descartado: %r" % (n,))
            continue
        if s in seen:
            continue
        seen.add(s)
        out.append([s, g, pl, es, theme, lvl, note])
    return out


def build_verbs(raw):
    out, seen = [], set()
    for v in raw or []:
        if len(v) != 7:
            warn("verbo mal formado: %r" % (v,))
            continue
        inf, es, aux, isc, irr, lvl, note = v
        inf, es, note, aux = clean(inf), clean(es), clean(note), clean(aux) or "ter"
        if (not re.search(r"^[a-zçãõáéíóúâêô]*(ar|er|ir|or|ôr)(-se)?$", inf) or not es
                or lvl not in LEVELS or inf in seen):
            if inf not in seen:
                warn("verbo descartado: %r" % (v,))
            continue
        if aux not in ("ter", "haver"):
            aux = "ter"          # en portugués todos los compuestos van con ter
        if not irr and looks_irregular(inf):
            irr = True
        seen.add(inf)
        out.append([inf, es, aux, False, bool(irr), lvl, note])
    return out


def build_adjectives(raw):
    out, seen = [], set()
    for a in raw or []:
        if len(a) != 7:
            warn("adjetivo mal formado: %r" % (a,))
            continue
        forms = [clean(x) for x in a[:4]]
        es, lvl, note = clean(a[4]), clean(a[5]), clean(a[6])
        if not all(forms) or lvl not in LEVELS or forms[0] in seen:
            if forms[0] not in seen:
                warn("adjetivo descartado: %r" % (a,))
            continue
        seen.add(forms[0])
        out.append(forms + [es, lvl, note])
    return out


def build_words(raw):
    out, seen = [], set()
    for w in raw or []:
        if len(w) != 5:
            warn("palabra mal formada: %r" % (w,))
            continue
        ptw, es, cat, lvl, note = [clean(x) for x in w]
        if not ptw or not es or lvl not in LEVELS or ptw in seen:
            continue
        seen.add(ptw)
        out.append([ptw, es, cat, lvl, note])
    return out


# ------------------------------------------------------------ oraciones

_WB = r"(?<![\wÀ-ÿ])"
_WA = r"(?![\wÀ-ÿ])"


def build_sentences(raw):
    out, seen = [], set()
    for s in raw or []:
        es = clean(s.get("es"))
        pts = []
        for x in (s.get("it") or []):
            x = clean(x)
            # variants that differ only in case or final dot are one answer
            if x and x.lower().rstrip(".!?") not in [y.lower().rstrip(".!?") for y in pts]:
                pts.append(x)
        lvl, w = s.get("lvl"), s.get("w")
        if not es or not pts or lvl not in LEVELS or not isinstance(w, int) or not 1 <= w <= 52 or es in seen:
            if es not in seen:
                warn("oración descartada: %r" % (s,))
            continue
        tags = [clean(t) for t in (s.get("tags") or []) if clean(t)]
        need = max([TAG_WEEK.get(t, 1) for t in tags] or [1])
        if w < need:
            warn("oración antes de su teoría (w%d < %d): %s" % (w, need, es))
            w = need
        leak = [(p, spanish_leak(p)) for p in pts]
        bad = [p for p, lk in leak if lk]
        if bad:
            for p, lk in leak:
                if lk:
                    warn("español o grafía vieja (%s) en: %s" % (lk, p))
            pts = [p for p in pts if p not in bad]
            if not pts:
                continue
        gap = s.get("gap")
        if gap:
            form = clean(gap[0])
            if not form or not re.search(_WB + re.escape(form) + _WA, pts[0]):
                warn("hueco ausente de la oración: %r en %r" % (form, pts[0]))
                gap = None
            else:
                gap = [form, clean(gap[1])]
        seen.add(es)
        out.append({"es": es, "it": pts, "lvl": lvl, "tags": tags, "gap": gap,
                    "note": clean(s.get("note")), "w": w, "wg": w})
    return out


# --------------------------------------------------------------- errores

def apply_fix(e):
    w, b = e["wrong"], e["bad"]
    m = re.search(r"(?<![\w'])" + re.escape(b) + r"(?![\w])", w)
    if not m:
        return None
    out = w[:m.start()] + e["good"] + w[m.end():]
    return re.sub(r"\s+", " ", out).replace(" ,", ",").replace(" .", ".").strip()


def build_errors(raw):
    out, seen = [], set()
    for e in raw or []:
        e = {k: (clean(v) if isinstance(v, str) else v) for k, v in e.items()}
        if (not e.get("wrong") or not e.get("right") or not e.get("bad") or "good" not in e
                or e.get("cat") not in ERROR_CATS or e.get("lvl") not in LEVELS
                or not isinstance(e.get("w"), int) or not 1 <= e["w"] <= 52):
            warn("error descartado: %r" % (e,))
            continue
        if e["wrong"] in seen:
            continue
        if e["wrong"] == e["right"] or apply_fix(e) != e["right"]:
            warn("error incoherente: %s | %s -> %s | %s" % (e["wrong"], e["bad"], e["good"], e["right"]))
            continue
        lk = spanish_leak(e["right"])
        if lk:
            warn("español o grafía vieja (%s) en la corrección: %s" % (lk, e["right"]))
            continue
        need = ERR_CAT_WEEK.get(e["cat"], 1)
        if e["w"] < need:
            warn("error antes de su teoría (w%d < %d): %s" % (e["w"], need, e["wrong"]))
            e["w"] = need
        seen.add(e["wrong"])
        row = {k: e[k] for k in ("wrong", "right", "bad", "good", "cat", "why", "lvl", "w")}
        if e.get("alt"):
            row["alt"] = [clean(a) for a in e["alt"] if clean(a)]
        out.append(row)
    return out


# ------------------------------------------------------- transferencia

def build_transfer(es_pt, falsi, spelling):
    out_es = {}
    for k, v in (es_pt or {}).items():
        key = clean(k).lower()
        key = "".join(deaccent(c) if c != "ñ" else c for c in key)
        if not key or not v or not clean(v[0]):
            continue
        pt, note = clean(v[0]), clean(v[1]) if len(v) > 1 else ""
        # Una entrada idéntica y sin nota no enseña nada y haría sospechar
        # de una palabra portuguesa correcta.
        if not note and key in [deaccent(x.strip().lower()) for x in pt.split("/")]:
            continue
        out_es[key] = [pt, note]
    out_f = {}
    for k, v in (falsi or {}).items():
        if len(v) >= 2:
            out_f[clean(k).lower()] = [clean(v[0]), clean(v[1]), clean(v[2]) if len(v) > 2 else ""]
    out_s = [[clean(a), clean(b), clean(c)] for a, b, c in (spelling or []) if a and b]
    return out_es, out_f, out_s


# ------------------------------------------------- conjugador (node)

_NODE_CHECK = r"""
const Conj = require(process.argv[1]);
const data = JSON.parse(require('fs').readFileSync(0, 'utf8'));
const out = { portuguese: false, irregular: [], unknown: [], gaps: [] };
if (!Conj || !Conj.PERSONS || Conj.PERSONS[0] !== 'eu') { console.log(JSON.stringify(out)); process.exit(0); }
out.portuguese = true;
const TENSES = ['presente', 'perfeito', 'subjPresente', 'imperfeito', 'futuro'];
function same(a, b) { return JSON.stringify(a) === JSON.stringify(b); }
data.verbs.forEach(function (inf) {
  if (!Conj.VERBS[inf]) { out.unknown.push(inf); return; }
  try {
    const differs = TENSES.some(function (t) {
      return !same(Conj.conjugate(inf, t, { partial: true }), Conj.regular(inf, t));
    }) || Conj.participle(inf) !== Conj.regular(inf, 'participio');
    if (differs) out.irregular.push(inf);
  } catch (e) { out.irregular.push(inf); }
});
function formsOf(inf) {
  const set = new Set([inf]);
  const add = function (f) {
    if (!f) return;
    if (typeof f === 'object') { Object.keys(f).forEach(function (k) { add(f[k]); }); return; }
    String(f).toLowerCase().split(/\s+/).forEach(function (w) {
      set.add(w); w.split('-').forEach(function (p) { set.add(p); });
    });
  };
  (Conj.ALL_TENSES || []).forEach(function (t) {
    try { Conj.conjugate(inf, t, { partial: true }).forEach(add); } catch (e) {}
    try { Conj.accepted(inf, t).forEach(add); } catch (e) {}
  });
  try {
    const pp = Conj.participles(inf);
    Object.keys(pp).forEach(function (k) {
      const p = pp[k];
      if (!p) return;
      add(p);
      if (/o$/.test(p)) ['a', 'os', 'as'].forEach(function (e) { add(p.slice(0, -1) + e); });
      else add(p + 's');
    });
  } catch (e) {}
  try { add(Conj.gerund(inf)); } catch (e) {}
  try { add(Conj.imperative(inf)); } catch (e) {}
  return set;
}
data.gaps.forEach(function (g) {
  let inf = g[1];
  if (!Conj.VERBS[inf] && !Conj.register(inf, {})) return;
  const toks = g[0].toLowerCase().split(/\s+/);
  let last = toks[toks.length - 1];
  const forms = formsOf(inf);
  if (forms.has(last)) return;
  if (last.split('-').some(function (p) { return forms.has(p); })) return;
  const head = last.split('-')[0];
  if (/-(o|a|os|as|lo|la|los|las|no|na|nos|nas|me|te|se|lhe|lhes)$/.test(last) &&
      (forms.has(head) || forms.has(head.replace(/[áâê]$/, function (c) { return {'á': 'ar', 'â': 'ar', 'ê': 'er'}[c]; })) ||
       forms.has(head + 'r') || forms.has(head + 's') || forms.has(head + 'z'))) return;
  out.gaps.push(g);
});
console.log(JSON.stringify(out));
"""


def conjugator_check(verbs, gaps):
    """Pregunta al conjugador portugués (si hay node).  None si no se pudo."""
    node = shutil.which("node")
    path = os.path.join(ROOT, "docs", "lang", "pt", "conjugator.js")
    if not node or not os.path.exists(path):
        return None
    try:
        res = subprocess.run([node, "-e", _NODE_CHECK, path],
                             input=json.dumps({"verbs": verbs, "gaps": gaps}),
                             capture_output=True, text=True, timeout=120)
        if res.returncode != 0:
            warn("conjugador: no se pudo ejecutar (%s)" % res.stderr.strip().splitlines()[-1:])
            return None
        return json.loads(res.stdout.strip().splitlines()[-1])
    except Exception as e:                                # pragma: no cover
        warn("conjugador: %s" % e)
        return None


# ------------------------------------------------------------------ main

def main():
    nouns, = load("parole_nomi", "NOUNS")
    verbs, adjs, words, regencia = load("parole_verbi_agg", "VERBS", "ADJECTIVES", "WORDS", "REGENCIA")
    sents, = load("frasi_banca", "SENTENCES")
    errs, = load("errori_banca", "ERRORS")
    es_pt, falsi, spelling = load("trasferimento", "ES_IT", "FALSI", "SPELLING")

    es, f, sp = build_transfer(es_pt, falsi, spelling)
    bank = {
        "nouns": build_nouns(nouns),
        "verbs": build_verbs(verbs),
        "adjectives": build_adjectives(adjs),
        "words": build_words(words),
        "sentences": build_sentences(sents),
        "errors": build_errors(errs),
        "esIt": es,
        "falsi": f,
        "spelling": sp,
    }
    if isinstance(regencia, dict) and regencia:
        bank["regencia"] = {clean(k): clean(v) for k, v in regencia.items() if clean(k)}

    # El conjugador, si está: verbos que conoce como irregulares y huecos
    # que no reconoce como formas de su lema.
    gaps = [s["gap"] for s in bank["sentences"] if s.get("gap")]
    chk = conjugator_check([v[0] for v in bank["verbs"] if not v[4]], gaps)
    if chk and chk.get("portuguese"):
        irr = set(chk.get("irregular") or [])
        for v in bank["verbs"]:
            if v[0] in irr and not v[4]:
                v[4] = True
                warn("verbo marcado irregular (el conjugador lo conjuga distinto de un regular): %s" % v[0])
        for g in chk.get("gaps") or []:
            warn("hueco que el conjugador no reconoce como forma de %s: %s" % (g[1], g[0]))
    elif chk is not None:
        warn("docs/lang/pt/conjugator.js todavía no es el conjugador portugués: se omite su control")

    path = os.path.join(ROOT, "docs", "lang", "pt", "data", "bank.json")
    with open(path, "w", encoding="utf-8") as fh:
        json.dump(bank, fh, ensure_ascii=False, separators=(",", ":"))

    # La semana escrita a mano es un piso: además, las palabras que el alumno
    # tiene que escribir (vistas en el curso, en el banco de su nivel o
    # transparentes) y la gramática que no es un tiempo (contracciones,
    # posesivos, clíticos, gerúndio, números…): tools/lib/semanas_banco.py
    # con tools/pt/rasgos_banco.py.  Necesita el banco ya escrito (el léxico
    # lo lee del disco).
    rep = None
    try:
        sys.path.insert(0, os.path.join(ROOT, "tools", "lib"))
        import rasgos_banco
        import semanas_banco
        rep = semanas_banco.run(bank, rasgos_banco, "pt")
    except subprocess.CalledProcessError as e:        # sin node: sin léxico de formas
        warn("semanas: no se pudo leer el léxico de formas (%s)" % e)
    if rep:
        with open(path, "w", encoding="utf-8") as fh:
            json.dump(bank, fh, ensure_ascii=False, separators=(",", ":"))
        print("semanas: %d oraciones (traducir) y %d huecos esperan a su vocabulario o su gramática; "
              "%d errores" % (rep["sentences"], rep["sentences_wg"], rep["errors"]))
        if rep["unknown"]:
            print("  palabras del banco que no aparecen en ningún lado: %s" % ", ".join(
                "%s %d" % x for x in rep["unknown"][:25]))

    for p in problems[:80]:
        print("  ! " + p)
    if len(problems) > 80:
        print("  ! … y otros %d" % (len(problems) - 80))
    print("banco: %d sustantivos, %d verbos, %d adjetivos, %d palabras, %d oraciones, %d errores, "
          "%d voces españolas, %d falsos amigos, %d grafías  (%d KB)" % (
              len(bank["nouns"]), len(bank["verbs"]), len(bank["adjectives"]),
              len(bank["words"]), len(bank["sentences"]), len(bank["errors"]),
              len(es), len(f), len(sp), os.path.getsize(path) // 1024))


if __name__ == "__main__":
    main()
