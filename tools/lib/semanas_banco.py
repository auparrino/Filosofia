# -*- coding: utf-8 -*-
"""La semana de cada oración y cada error del banco, en los dos idiomas.

Una oración del banco se pide en tres ejercicios: traducir del español
(«w»: el alumno escribe la oración entera), completar el hueco («wg»: lee la
oración y escribe una forma) y encontrar el error (el error trae su «w»: lee
la oración y escribe la corrección).  La semana es la primera en la que el
alumno ya vio todo lo que el ejercicio le pide:

- la gramática verbal (tiempos, auxiliar + participio, gerundio…), que lee
  el sillabo de cada idioma;
- la gramática no verbal (posesivos, contracciones, pronombres átonos,
  comparativos, números, interrogativos…), que lee `rasgos_banco.py` de cada
  idioma, más las etiquetas de la oración y la categoría del error;
- el vocabulario: cada palabra que el alumno tiene que ESCRIBIR tiene que
  haber aparecido antes, en una lección, en las palabras de la semana o en un
  ejercicio del curso (docs/lang/<código>/data/course.json), o en el banco
  de palabras de su nivel, o ser transparente (cognado) o estar en la
  consigna en castellano (un nombre propio, *hotel*).  En lo que solo LEE
  puede haber hasta dos palabras sin ver: las toca y ve qué significan.

El banco de palabras de un nivel no se aprende de golpe: «Parole» presenta
primero las más frecuentes (docs/js/banca.js).  Por eso una palabra que solo
está en el banco cuenta desde la semana que le toca en ese reparto: las del
nivel ordenadas por frecuencia y repartidas entre las semanas del nivel.

Cada idioma aporta un adaptador (tools/<código>/rasgos_banco.py) con su
léxico, su gramática y sus tablas; este módulo no nombra ningún idioma.

La semana nunca baja: vale el máximo entre la que ya traía la entrada (la
escrita a mano o la de la gramática) y lo que piden el vocabulario y los
rasgos.  El curso compilado es el de la compilación anterior: `npm run build`
dos veces deja las dos cosas estables (tools/lib/test_fix_banco.js lo
comprueba).
"""
import json
import os
import re
import unicodedata

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
LEVELS = ["A1", "A2", "B1", "B2", "C1"]


def plain(s):
    return "".join(c for c in unicodedata.normalize("NFD", str(s or "").lower())
                   if unicodedata.category(c) != "Mn")


# ------------------------------------------------------------ lo visto

def _strip_md(s):
    return str(s or "").replace("*", "")


def item_texts(item):
    """Lo que un ítem del curso le muestra al alumno en la lengua que
    aprende (las opciones no: algunas están mal a propósito)."""
    typ = item.get("type")
    if typ == "scopri":
        return " ".join(item.get("data") or [])
    answers = [a.strip() for a in re.split(r"\s*\|\s*", str(item.get("answer") or "")) if a.strip()]
    answers = [a for a in answers if not re.fullmatch(r"\(.*\)", a)]
    if typ == "translate":
        # del castellano: el enunciado es castellano; al castellano, al revés
        return item.get("stem") or "" if item.get("dir") and not str(item.get("dir")).startswith("es") \
            else " ".join(answers)
    if typ == "fixerr":
        return item.get("answer") or ""
    read = ""
    if typ == "garden":
        read = " ".join(w for pair in (item.get("lead") or []) for w in pair)
    stem = re.sub(r"\([^)]*\)", " ", str(item.get("stem") or ""))
    for a in answers:
        stem = stem.replace("___", a, 1)
    return (read + " " + stem + " " + " ".join(answers)).strip()


def lesson_texts(week):
    L = week.get("lesson") or {}
    txt = []
    for b in L.get("blocks", []):
        for pair in b.get("ex", []) or []:
            txt.append(_strip_md(pair[0]))
        t = b.get("table")
        if t:
            for r in t.get("rows", []) or []:
                txt += [_strip_md(x) for x in r]
        for k in ("p", "more"):
            for p in b.get(k, []) or []:
                txt += re.findall(r"\*([^*]+)\*", str(p))
        for k in ("r", "warn", "tip"):
            if b.get(k):
                txt += re.findall(r"\*([^*]+)\*", str(b[k]))
    return txt


class Vocab:
    """Desde qué semana el alumno conoce cada palabra (ver arriba)."""

    def __init__(self, lang, bank, course, freq=None):
        self.lang = lang
        self.lex = lang.lessico
        self.seen = {}
        self.unknown = {}
        self._cache = {}
        items = {i["id"]: i for i in course.get("items", [])}
        for w in sorted(course.get("weeks", []), key=lambda x: x["week"]):
            texts = lesson_texts(w)
            for v in w.get("vocab") or []:
                texts.append(v[0])
                if len(v) > 2:
                    texts.append(v[2])
            for iid in (w.get("items") or []) + (w.get("extra") or []):
                if iid in items:
                    texts.append(item_texts(items[iid]))
            for tok in self.lex.words_of(" . ".join(texts)):
                lm = self.lex.lemma_of(tok)
                for key in {tok, lm[0] if lm else tok}:
                    self.seen.setdefault(key, w["week"])
        # the bank by level, the most frequent words first
        lemmi = (freq or {}).get("lemmi", {})
        starts = [1] + [x + 1 for x in lang.LEVEL_ENDS]
        ends = list(lang.LEVEL_ENDS) + [lang.LAST_WEEK]
        by_level = {lv: [] for lv in LEVELS}
        for n in bank.get("nouns", []):
            by_level.get(n[5], []).append(n[0])
        for v in bank.get("verbs", []):
            by_level.get(v[5], []).append(v[0])
        for a in bank.get("adjectives", []):
            by_level.get(a[5], []).append(a[0])
        for x in bank.get("words", []):
            by_level.get(x[3], []).append(x[0])
        self.spread = {}
        for k, lv in enumerate(LEVELS):
            words = []
            for wd in by_level[lv]:
                if wd not in words:
                    words.append(wd)
            words.sort(key=lambda wd: -((lemmi.get(wd) or [0])[0] or 0))
            span = ends[k] - starts[k] + 1
            for r, wd in enumerate(words):
                wk = starts[k] + (r * span) // max(len(words), 1)
                self.spread.setdefault(wd.lower(), wk)

        # Spanish words the bank knows (glosses, prompts, the Spanish side of
        # the transfer table): to recognise a transparent word that is not in
        # the bank (esilio, conferenza, repubblica).  False friends never are.
        es = set()
        for n in bank.get("nouns", []):
            es.update(re.findall(r"[a-zñ]+", plain(n[3])))
        for v in bank.get("verbs", []):
            es.update(re.findall(r"[a-zñ]+", plain(v[1])))
        for a in bank.get("adjectives", []):
            es.update(re.findall(r"[a-zñ]+", plain(a[4])))
        for x in bank.get("words", []):
            es.update(re.findall(r"[a-zñ]+", plain(x[1])))
        for sn in bank.get("sentences", []):
            es.update(re.findall(r"[a-zñ]+", plain(sn.get("es"))))
        for k in (bank.get("esIt") or {}):
            es.update(re.findall(r"[a-zñ]+", plain(k)))
        self.es = {w for w in es if len(w) >= 4}
        self.es_by = {}
        for w in self.es:
            self.es_by.setdefault(w[0], []).append(w)
        self.falsi = {plain(k) for k in (bank.get("falsi") or {})}

    def transparent(self, tok, strict=False):
        """¿Se entiende desde el castellano sin haberla visto?  strict: la
        palabra está en el banco pero su glosa no la delata (confortável =
        cómodo): solo si es larga y casi igual a una palabra castellana."""
        import difflib
        t = plain(tok)
        if len(t) < (6 if strict else 4) or t in self.falsi:
            return False
        lm = self.lex.lemma_of(tok)
        if lm and plain(lm[0]) in self.falsi:
            return False
        cands = {t} | {plain(c) for c in self.lang.candidates(tok)}
        if cands & self.es:
            return True
        if len(t) < (7 if strict else 5):
            return False
        for c in cands:
            pool = [w for w in self.es_by.get(c[:1], []) if abs(len(w) - len(c)) <= 2]
            if difflib.get_close_matches(c, pool, n=1, cutoff=0.85 if strict else 0.8):
                return True
        return False

    def week(self, tok, given=()):
        """Primera semana en que se conoce la forma `tok`, o None si no
        aparece en ninguna parte."""
        key = (tok, tuple(sorted(given)))
        if key in self._cache:
            return self._cache[key]
        res = self._week(tok, given)
        self._cache[key] = res
        return res

    def _week(self, tok, given):
        if plain(tok) in given:
            return 1                                   # está en la consigna
        if tok in getattr(self.lang, "NOT_VOCAB", ()):
            return 1
        lm = self.lex.lemma_of(tok)
        if self.transparent(tok, strict=bool(lm)):
            return 1
        cands = [self.seen.get(tok)]
        if lm:
            lemma, lw, gloss = lm
            if lw <= 0 or self.lang.is_name(tok, lm):
                return 1                               # nombre propio, castellano
            if self.lex.is_cognate(lemma, gloss) or self.lex.is_cognate(tok, gloss):
                return 1
            cands.append(self.seen.get(lemma))
            if lemma.lower() in self.spread:
                cands.append(self.spread[lemma.lower()])
            elif tok in self.spread:
                cands.append(self.spread[tok])
            else:
                cands.append(lw)                       # glosario: su nivel
        cands = [c for c in cands if c]
        if not lm:
            # ni en el banco ni en el glosario: la vio en el curso, o nunca
            return min(cands + [self.lang.UNSEEN_WEEK]) if cands else None
        return min(cands) if cands else None

    def need(self, text, produce, given=(), hints=()):
        """(semana, [(palabra, semana)]) que exige el texto: todo lo que se
        escribe; lo que se lee, salvo dos palabras."""
        weeks = []
        text = re.sub(r"«[^»]*»", " ", str(text or ""))     # otra lengua, citada
        for tok in self.lex.words_of(text):
            if plain(tok) in hints:
                continue
            wk = self.week(tok, given)
            if wk is None:
                self.unknown[tok] = self.unknown.get(tok, 0) + 1
                wk = self.lang.UNSEEN_WEEK
            weeks.append((wk, tok))
        weeks.sort(reverse=True)
        if produce:
            top = weeks[:1]
        else:
            top = weeks[2:3]
        return (top[0][0] if top else 1), [(t, w) for w, t in weeks if w > 1]


# ----------------------------------------------------------- las semanas

def _given(es):
    """Las palabras de la consigna en castellano: un nombre propio o una
    palabra igual (hotel, Rosario) ya está dada."""
    return {plain(t) for t in re.findall(r"[A-Za-zÀ-ÿ]+", es or "")}


def date_bank(bank, lang, course, freq=None, log=None):
    """Recalcula w / wg de las oraciones y w de los errores.  Devuelve un
    informe: cuántas cambiaron y por qué."""
    voc = Vocab(lang, bank, course, freq)
    report = {"sentences": 0, "sentences_wg": 0, "errors": 0, "why": {}, "moves": []}

    def bump(why):
        report["why"][why] = report["why"].get(why, 0) + 1

    def best(parts):
        # parts: [(week, why)] → (week, why of the maximum)
        parts = [p for p in parts if p[0]]
        return max(parts) if parts else (1, "")

    for sn in bank["sentences"]:
        tags = sn.get("tags") or []
        tag_w = max([lang.TAG_WEEK.get(t, 1) for t in tags] or [1])
        given = _given(sn.get("es"))
        old_w, old_wg = sn.get("w", 1), sn.get("wg", sn.get("w", 1))
        # traducir: basta con una de las respuestas aceptadas
        variants = []
        for v in sn["it"]:
            g_w = lang.grammar(v, produce=True)
            v_w, words = voc.need(v, produce=True, given=given)
            variants.append(max((g_w, "gramática"), (v_w, "vocabulario")))
        var = min(variants) if variants else (1, "")
        w, why = best([(old_w, "antes"), (tag_w, "etiqueta"), var])
        if w > old_w:
            report["sentences"] += 1
            bump("w:" + why)
            report["moves"].append(("w", old_w, w, why, sn["it"][0]))
        sn["w"] = w
        if sn.get("gap"):
            # completar: se lee la oración, se escribe una forma del lema dado
            main = sn["it"][0]
            ctx = lang.grammar(main, produce=False)
            ans = lang.grammar(sn["gap"][0], produce=True)
            hints = {plain(sn["gap"][1])} | {plain(t) for t in re.findall(r"[A-Za-zÀ-ÿ]+", sn["gap"][0])}
            r_w, _ = voc.need(main, produce=False, given=given, hints=hints)
            wg, why = best([(old_wg, "antes"), (tag_w, "etiqueta"), (ctx, "gramática"),
                            (ans, "gramática"), (r_w, "vocabulario")])
            if wg > old_wg:
                report["sentences_wg"] += 1
                bump("wg:" + why)
            sn["wg"] = wg
    for er in bank["errors"]:
        old = er.get("w", 1)
        cat_w = lang.ERR_CAT_WEEK.get(er.get("cat"), 1)
        ctx = lang.grammar(er["right"], produce=False)
        ans = lang.grammar(er["good"], produce=True) if er.get("good") else 1
        r_w, _ = voc.need(er["right"], produce=False)
        p_w, _ = voc.need(er.get("good") or "", produce=True)
        w, why = best([(old, "antes"), (cat_w, "categoría"), (ctx, "gramática"), (ans, "gramática"),
                       (r_w, "vocabulario"), (p_w, "vocabulario")])
        if w > old:
            report["errors"] += 1
            bump("err:" + why)
            report["moves"].append(("err", old, w, why, er["right"]))
        er["w"] = w
    report["unknown"] = sorted(voc.unknown.items(), key=lambda x: -x[1])
    report["vocab"] = voc
    return report


def load_json(path, default=None):
    try:
        with open(path, encoding="utf-8") as fh:
            return json.load(fh)
    except (OSError, ValueError):
        return default


def run(bank, lang, code):
    """Lo que llama build_bank.py: el curso y la frecuencia ya compilados."""
    data = os.path.join(ROOT, "docs", "lang", code, "data")
    course = load_json(os.path.join(data, "course.json"), {"weeks": [], "items": []})
    freq = load_json(os.path.join(data, "frequenza.json"), {})
    return date_bank(bank, lang, course, freq)
