#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Il lessico del sillabo: da quale settimana si conosce ogni parola.

El sillabo de gramática (sillabo.py) mira los tiempos; este módulo mira las
palabras.  Una palabra italiana se da por conocida en la semana w si:

- es transparente para un hispanohablante (cognado: *ospedale*, *nazione*,
  *ippopotamo*); se comprueba contra el diccionario de castellano con las
  reglas de correspondencia del laboratorio Ponte;
- es del banco y su nivel ya está en juego (A1 desde la semana 1, A2 desde
  la 9, B1 desde la 19, B2 desde la 31, C1 desde la 43: el mismo reparto que
  usa Parole para practicar vocabulario);
- aparece en la teoría de una semana ≤ w.

Lo demás es vocabulario desconocido.  Un ejercicio puede tener alguna
palabra desconocida en lo que se lee si el alumno puede tocarla y ver qué
significa (el glosario, docs/data/glossario.json), pero no en lo que tiene
que escribir.

    python3 tools/lessico.py      informe: palabras desconocidas más frecuentes
"""
import json
import os
import re
import unicodedata

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
LEVEL_WEEK = {"A1": 1, "A2": 9, "B1": 19, "B2": 31, "C1": 43}

_IDX = None
_ES = None
_COG = {}


def _plain(w):
    return "".join(c for c in unicodedata.normalize("NFD", w) if unicodedata.category(c) != "Mn")


def spanish():
    global _ES
    if _ES is None:
        try:
            from spylls.hunspell import Dictionary
            _ES = Dictionary.from_files(os.path.join(
                ROOT, "tools", "audit", "node_modules", "dictionary-es", "index"))
        except Exception:          # sin diccionario: sin cognados automáticos
            _ES = False
    return _ES


# Reglas del Ponte, al revés: de la forma italiana a candidatas castellanas.
_RULES = [("zione", "cion"), ("zioni", "ciones"), ("tà", "dad"), ("bile", "ble"),
          ("bili", "bles"), ("aggio", "aje"), ("aggi", "ajes"), ("logia", "logia"),
          ("zia", "cia"), ("mente", "mente"), ("ista", "ista"), ("isti", "istas"),
          ("oso", "oso"), ("osa", "osa"), ("ale", "al"), ("ali", "ales"),
          ("ore", "or"), ("ori", "ores"), ("are", "ar"), ("ere", "er"), ("ire", "ir"),
          ("ico", "ico"), ("ica", "ica"), ("ici", "icos"), ("iche", "icas"),
          ("ente", "ente"), ("enti", "entes"), ("ante", "ante"), ("anti", "antes"),
          ("i", "os"), ("i", "as"), ("e", "es"), ("e", "as"), ("i", "es"), ("o", "o"), ("a", "a"),
          ("e", "e"), ("e", ""), ("o", ""), ("i", "")]


def _candidates(w):
    w = _plain(w.lower())
    bases = {w, re.sub(r"(.)\1", r"\1", w)}             # doppie → semplici
    more = set()
    for b in bases:
        more.add(b.replace("tt", "ct"))
        more.add(re.sub(r"tt", "pt", b))
        more.add(b.replace("ss", "x"))
        more.add(b.replace("gl", "j").replace("gn", "ñ"))
        more.add(re.sub(r"^pi", "pl", b)); more.add(re.sub(r"^fi", "fl", b))
        more.add(re.sub(r"^chi", "cl", b)); more.add(re.sub(r"^bi", "bl", b))
        more.add(re.sub(r"^f", "h", b)); more.add("h" + b)
        more.add(re.sub(r"^s([bcdfglmnpqrstvz])", r"es\1", b))
        more.add(b.replace("e", "ie", 1)); more.add(b.replace("o", "ue", 1))
    bases |= more
    out = set()
    for b in bases:
        for it, es in _RULES:
            if b.endswith(it) and len(b) - len(it) >= 3:
                out.add(b[: -len(it)] + es)
        out.add(b)
    return out


def is_cognate(word, es_gloss=None):
    """Transparent for a Spanish speaker?"""
    key = (word, es_gloss)
    if key in _COG:
        return _COG[key]
    w = word.lower()
    ok = False
    if len(w) >= 4:
        if es_gloss:
            import difflib
            for g in re.split(r"[/,;()]", es_gloss):
                g = _plain(g.strip().lower())
                g = re.sub(r"^(el|la|los|las|un|una)\s+", "", g)
                if not g or " " in g:
                    continue
                cands = _candidates(w)
                if g in cands or max(difflib.SequenceMatcher(None, c, g).ratio() for c in cands) >= 0.8:
                    ok = True
                    break
        else:
            es = spanish()
            if es:
                for c in _candidates(w):
                    if len(c) >= 4 and (es.lookup(c) or _accented_lookup(es, c)):
                        ok = True
                        break
    _COG[key] = ok
    return ok


def _accented_lookup(es, c):
    # the candidates have no accents: try one accented vowel at a time
    for i, ch in enumerate(c):
        rep = {"a": "á", "e": "é", "i": "í", "o": "ó", "u": "ú"}.get(ch)
        if rep and es.lookup(c[:i] + rep + c[i + 1:]):
            return True
    return False


# Palabras de función: se aprenden con la gramática de las primeras semanas.
FUNCTION = set("""
il lo la i gli le l un uno una un' l' di a da in con su per tra fra del dello della dei degli delle
dell' al allo alla ai agli alle all' dal dallo dalla dai dagli dalle dall' nel nello nella nei negli
nelle nell' sul sullo sulla sui sugli sulle sull' e ed o od ma che chi non né se anche come dove quando
perché mi ti si ci vi ne lo gli le me te ce ve se io tu lui lei noi voi loro mio mia miei mie tuo tua
tuoi tue suo sua suoi sue nostro nostra nostri nostre vostro vostra vostri vostre questo questa questi
queste quello quella quelli quelle quel quei quegli molto poco tanto tutto tutti tutte più meno già
ancora sempre mai sì no qui qua lì là c' c'è cosa quale quali quanto quanta quanti quante bene male
oggi domani ieri ora adesso poi dopo prima così allora anzi però quindi
molti molte molta tanti tante tanta pochi poche poca troppo troppa troppi troppe
nessuno nessuna nessun ciascuno ciascuna ognuno ognuna qualcuno qualcuna qualcosa
niente nulla qualsiasi qualunque chiunque stesso stessa stessi stesse altro altra
altri altre ogni alcuni alcune alcuno alcuna qualche po' po tutta
maschile femminile singolare plurale signor
verso tranne ciò piuttosto proprio fuori dentro sopra sotto davanti dietro vicino
lontano circa insieme presto tardi subito spesso anche pure neanche nemmeno mica
senza dopo durante mentre finché oppure invece però eppure dunque perciò
""".split())
NUMBERS = re.compile(r"^(?:(?:un|due|tre|quattro|cinque|sei|sette|otto|nove|dieci|undici|"
                     r"dodici|tredici|quattordici|quindici|sedici|diciassette|diciotto|"
                     r"diciannove|venti?|trent|quarant|cinquant|sessant|settant|ottant|"
                     r"novant|cento|mille|mila|milion[ei]|miliard[oi]|uno|a|e|i|o)+)$")
_ARTIC = re.compile(r"^(?:dell|all|dall|nell|sull|un|l|d|c|n|s|m|t|v|quest|quell|com|dov|qual)'")


def index():
    global _IDX
    if _IDX is not None:
        return _IDX
    import sillabo
    with open(os.path.join(ROOT, "docs", "lang", "it", "data", "bank.json"), encoding="utf-8") as fh:
        bank = json.load(fh)
    idx = {}          # forma → (lemma, week, gloss)

    def put(form, lemma, level, gloss):
        form = form.lower()
        wk = LEVEL_WEEK.get(level, 19)
        if form not in idx or idx[form][1] > wk:
            idx[form] = (lemma, wk, gloss)

    for n in bank["nouns"]:
        put(n[0], n[0], n[5], n[3]); put(n[2], n[0], n[5], n[3])
    for a in bank["adjectives"]:
        for f in a[:4]:
            put(f, a[0], a[5], a[4])
    for w in bank["words"]:
        put(w[0], w[0], w[3], w[1])
    lemmas = sillabo.lexicon()["lemmas"]
    verbs = {v[0]: v for v in bank["verbs"]}
    for form, infs in lemmas.items():
        for inf in infs:
            v = verbs.get(inf)
            put(form, inf, v[5] if v else "A2", v[1] if v else "")
    for v in bank["verbs"]:
        put(v[0], v[0], v[5], v[1])
    for form, (gloss, level) in glossary().items():
        if level in ("N", "ES"):
            idx[form] = (form, 0 if level == "ES" else 1, gloss)   # 0: se ignora
        elif form not in idx:
            put(form, form, level, gloss)
    _IDX = idx
    return idx


_GLOSS = None


def glossary():
    global _GLOSS
    if _GLOSS is None:
        import importlib.util
        spec = importlib.util.spec_from_file_location(
            "glossario", os.path.join(ROOT, "tools", "it", "bank", "glossario.py"))
        mod = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(mod)
        _GLOSS = dict(mod.GLOSS)
        # the words of the C1 exercises (transformations, register, word
        # formation, collocations): tools/it/bank/glossario_c1.py
        extra = os.path.join(ROOT, "tools", "it", "bank", "glossario_c1.py")
        if os.path.exists(extra):
            spec = importlib.util.spec_from_file_location("glossario_c1", extra)
            mod = importlib.util.module_from_spec(spec)
            spec.loader.exec_module(mod)
            for k, v in mod.GLOSS.items():
                _GLOSS.setdefault(k, v)
    return _GLOSS


def lemma_of(tok):
    """(lemma, week the bank puts it in play, Spanish gloss) or None."""
    idx = index()
    t = tok.lower().strip("'")
    if t in idx:
        return idx[t]
    # clitics: dimmi, farlo, alzarsi, portarglielo
    for cl in ("glielo", "gliela", "glieli", "gliele", "gliene", "melo", "mela", "telo",
               "cela", "celo", "mene", "tene", "sene", "cene",
               "mi", "ti", "si", "ci", "vi", "lo", "la", "li", "le", "ne", "gli"):
        if t.endswith(cl) and len(t) > len(cl) + 2:
            base = t[: -len(cl)]
            for cand in (base, base + "e", base[:-1] if base.endswith(base[-1] * 2) else None):
                if cand and cand in idx:
                    return idx[cand]
    # alterati e -mente: gattino, librone, lentamente
    for suf, rep in (("amente", "o"), ("mente", "e"), ("lmente", "le"), ("rmente", "re"),
                     ("issimo", "o"), ("issima", "a"), ("issimi", "i"), ("issime", "e"),
                     ("ino", "o"), ("ina", "a"), ("ini", "i"), ("ine", "e"),
                     ("etto", "o"), ("etta", "a"), ("etti", "i"), ("ette", "e"),
                     ("ello", "o"), ("ella", "a"), ("uccio", "o"), ("uccia", "a"),
                     ("accio", "o"), ("accia", "a"), ("acci", "i"), ("acce", "e"),
                     ("one", "o"), ("one", "a"), ("oni", "i"), ("otto", "o"), ("otta", "a")):
        if t.endswith(suf) and len(t) > len(suf) + 2:
            c = t[: -len(suf)] + rep
            if c in idx:
                return idx[c]
    return None


def words_of(text):
    """Content words of an Italian text, with the ones to skip removed:
    proper names (capitalised not at sentence start), numbers, function words."""
    out = []
    text = text.replace("’", "'")
    for m in re.finditer(r"[A-Za-zÀ-ÿ]+'?[A-Za-zÀ-ÿ]*", text):
        raw = m.group(0)
        start = m.start()
        before = text[:start].rstrip()
        sentence_start = not before or before[-1] in ".!?:–—-«\"(" or before.endswith("→")
        if raw[0].isupper() and not sentence_start:
            continue                                   # Marco, Roma, Leopardi
        t = raw.lower()
        t = _ARTIC.sub("", t) if "'" in t and not t.endswith("'") else t
        if not t or t in FUNCTION or t.rstrip("'") in FUNCTION or len(t) <= 2:
            continue
        if len(t) > 3 and NUMBERS.match(t):
            continue                                   # quattrocentosessantaquattro
        if t in names():
            continue
        out.append(t)
    return out


_NAMES = None


def names():
    """Words that appear capitalised in the middle of a sentence somewhere in
    the course and are not in the bank: first names, places."""
    global _NAMES
    if _NAMES is None:
        _NAMES = set()
        path = os.path.join(ROOT, "docs", "lang", "it", "data", "course.json")
        with open(path, encoding="utf-8") as fh:
            course = json.load(fh)
        texts = [(i.get("stem") or "") + " " + (i.get("answer") or "") for i in course["items"]]
        for t in texts:
            for m in re.finditer(r"(?<=[a-zà-ù,;] )([A-Z][a-zà-ù]+)", t):
                w = m.group(1).lower()
                if w not in index():
                    _NAMES.add(w)
    return _NAMES


def lesson_words(course):
    """lemma → first week whose lesson shows it."""
    seen = {}
    for w in course["weeks"]:
        L = w.get("lesson") or {}
        txt = []
        for b in L.get("blocks", []):
            for pair in b.get("ex", []):
                txt.append(pair[0].replace("*", ""))    # *…* marks the form taught
            t = b.get("table")
            if t:
                for r in t.get("rows", []):
                    txt += r
            for k in ("p", "more"):
                for p in b.get(k, []) or []:
                    txt += re.findall(r"\*([^*]+)\*", p)
            for k in ("r", "warn", "tip"):
                if b.get(k):
                    txt += re.findall(r"\*([^*]+)\*", b[k])
        for tok in words_of(" . ".join(txt)):
            lm = lemma_of(tok)
            key = lm[0] if lm else tok
            seen.setdefault(key, w["week"])
    return seen


def word_week(tok, lesson_seen):
    """Week from which a word counts as known (1 for cognates)."""
    lm = lemma_of(tok)
    if lm:
        lemma, wk, gloss = lm
        if wk <= 1:
            return 1, lemma                      # nombre propio o castellano
        if is_cognate(lemma, gloss) or is_cognate(tok, gloss):
            return 1, lemma
        return min(wk, lesson_seen.get(lemma, 99)), lemma
    if is_cognate(tok):
        return 1, tok
    return lesson_seen.get(tok, 99), tok


def item_texts(item):
    """(what the learner reads, what the learner writes) of a course item."""
    typ = item.get("type")
    # the rule to discover is chosen in Spanish: only the Italian data counts
    if typ == "scopri":
        return " ".join(item.get("data") or []), ""
    # italiano → castellano: the learner reads Italian and writes Spanish
    if typ == "translate" and item.get("dir") == "it-es":
        return item.get("stem") or "", ""
    # trova l'errore: the corrected sentence is read, one word is written
    if typ == "fixerr":
        return item.get("answer") or "", item.get("good") or ""
    # «(sin partitivo)» is a Spanish label for «nothing goes here», not Italian
    answers = [a.strip() for a in re.split(r"\s*\|\s*", item.get("answer") or "")
               if a.strip() and not re.fullmatch(r"\(.*\)", a.strip())]
    read = ""
    if typ == "garden":
        read = " ".join(w for pair in (item.get("lead") or []) for w in pair)
    # translate: the stem is Spanish; «stemEs»: a situation in Spanish
    if item.get("type") != "translate" and not item.get("stemEs"):
        stem = re.sub(r"\([^)]*\)", " ", item.get("stem") or "")
        for a in answers:
            stem = stem.replace("___", a, 1)
        read = (read + " " + stem).strip()   # options stay out: some are misspelt on purpose
    return read, " ".join(answers)


def unknown_words(item, week, lesson_seen):
    """(unknown words it reads, unknown words it must write) at a week."""
    read, write = item_texts(item)
    hints = set(words_of(" ".join(re.findall(r"\(([^)]*)\)", item.get("stem") or ""))))
    out = ([], [])
    for k, text in enumerate((read, write)):
        for tok in words_of(text):
            if tok in hints:
                continue                    # the word is given: «(parco)»
            wk, lemma = word_week(tok, lesson_seen)
            if wk > week and lemma not in out[k]:
                out[k].append(lemma)
    return out


def item_vocab(item, lesson_seen):
    """{"lessico": week} for place_by_syllabus.

    What the learner writes: every word known (bank level, lesson, cognate).
    What the learner reads: at most two words not seen yet, which the
    learner can tap to see what they mean.
    """
    read, write = item_texts(item)
    hints = set(words_of(" ".join(re.findall(r"\(([^)]*)\)", item.get("stem") or ""))))
    # a word whose lemma the stem already shows is given (fantasma → fantasmi)
    given = {word_week(t, lesson_seen)[1] for t in words_of(item.get("stem") or "")}
    if item.get("type") == "choice":
        read, write = read + " " + write, ""        # elegir es reconocer, no producir
    w_write = [word_week(t, lesson_seen)[0] for t in words_of(write)
               if t not in hints and word_week(t, lesson_seen)[1] not in given]
    w_read = sorted((word_week(t, lesson_seen)[0] for t in words_of(read) if t not in hints),
                    reverse=True)
    need = max(w_write or [1])
    if len(w_read) > 2:
        need = max(need, w_read[2])
    need = 1 if need == 99 and not w_write else need
    return {"lessico": min(need, 52)} if need > 1 else {}


_SENSES = None


def senses_index():
    """forma → todas sus lecturas [(lema, semana, glosa, es_verbo)], no solo
    la primera: *entro* es «dentro de» y también «(yo) entro»; *sale* es «sal»
    y también «sube»; *letto* es «cama» y también «leído».  Salen del banco
    (sustantivos, adjetivos, palabras, formas del conjugador), del glosario
    (bank/glossario.py, bank/glossario.py SENSI) y de las palabras de la semana."""
    global _SENSES
    if _SENSES is not None:
        return _SENSES
    import sillabo
    with open(os.path.join(ROOT, "docs", "lang", "it", "data", "bank.json"), encoding="utf-8") as fh:
        bank = json.load(fh)
    out = {}

    def put(form, lemma, level, gloss, verb):
        form = form.lower()
        if not gloss:
            return
        wk = LEVEL_WEEK.get(level, 19) if not isinstance(level, int) else level
        lst = out.setdefault(form, [])
        for i, (l2, w2, g2, v2) in enumerate(lst):
            if l2 == lemma:
                if wk < w2:
                    lst[i] = (lemma, wk, g2, v2)
                return
        lst.append((lemma, wk, gloss, verb))

    for n in bank["nouns"]:
        put(n[0], n[0], n[5], n[3], False); put(n[2], n[0], n[5], n[3], False)
    for a in bank["adjectives"]:
        for f in a[:4]:
            put(f, a[0], a[5], a[4], False)
    for w in bank["words"]:
        put(w[0], w[0], w[3], w[1], False)
    verbs = {v[0]: v for v in bank["verbs"]}
    for form, infs in sillabo.lexicon()["lemmas"].items():
        for inf in infs:
            v = verbs.get(inf)
            if v:
                put(form, inf, v[5], v[1], True)
    for form, (gloss, level) in glossary().items():
        if level not in ("N", "ES"):
            put(form, form, level, gloss, False)
    # the words of the week: the meaning the course teaches for that form
    try:
        sys_path = os.path.join(ROOT, "tools", "it")
        import sys as _sys
        if sys_path not in _sys.path:
            _sys.path.insert(0, sys_path)
        from bank.parole_settimana import PAROLE
        for wk, lst in PAROLE.items():
            for e in lst:
                if " " not in e[0] and not re.search(r"(are|ere|ire|rre|rsi)$", e[0]):
                    put(e[0], e[0], wk, e[1], False)
    except Exception:
        pass
    _SENSES = out
    return out


def _gloss_words(g):
    return {w for w in re.split(r"[^a-zñáéíóúü]+", _plain(g.lower())) if len(w) > 2}


def _base(lemma):
    return re.sub(r"(?:ar|er|ir)si$", lambda m: m.group(0)[:2] + "e", lemma)


def _same_family(l1, g1, l2, g2):
    """*cena* y *cenare*, *chiamare* y *chiamarsi*, *studio* y *studiare*:
    la misma idea, no un segundo significado."""
    b1, b2 = _base(l1), _base(l2)
    if b1 == b2:
        return True
    if b1[:4] != b2[:4]:
        return False
    # la misma raíz en italiano y en castellano: juego / jugar, almuerzo / almorzar
    w1 = {w[:2] for w in _gloss_words(g1)}
    w2 = {w[:2] for w in _gloss_words(g2)}
    return bool(w1 & w2)


# Verbs whose form coincides with a common word only in rare or literary
# uses (*paio* de parere, *posto* de porre, *punto* de pungere): no second
# reading for them.
_RARE_VERB_READING = {"parere", "porre", "pungere", "piangere", "trarre", "commettere", "collegare",
                      "esitare", "bagnare", "liberare", "colorare", "negoziare", "specificare",
                      "governare", "meritare", "causare", "contattare", "pubblicare", "criticare"}


def other_senses(tok, lemma, gloss):
    """The other readings of a form, with a meaning that is not the same idea
    as the one shown (*entro*: «dentro de» and «entrar»; *sale*: «sal» and
    «sube»; not *cena* and *cenare*)."""
    seen = _gloss_words(gloss)
    out = []
    for l2, w2, g2, v2 in senses_index().get(tok, []):
        if l2 == lemma or not g2 or (v2 and l2 in _RARE_VERB_READING):
            continue
        gw = _gloss_words(g2)
        if not gw or gw & seen or _same_family(lemma, gloss, l2, g2):
            continue
        if any(_same_family(o[0], o[2], l2, g2) for o in out):
            continue
        out.append((l2, w2, g2, v2))
        seen |= gw
    return out


def _curated():
    import importlib.util
    spec = importlib.util.spec_from_file_location(
        "glossario_sensi", os.path.join(ROOT, "tools", "it", "bank", "glossario.py"))
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return getattr(mod, "SENSI", {})


def _fmt(extra):
    out = []
    for l2, w2, g2, v2 in extra:
        # only Spanish in the gloss: app.js reads the glosses to tell a
        # Spanish sentence from an Italian one
        out.append(("también, del verbo: %s" % g2) if v2 else ("también: %s" % g2))
    return " · ".join(out)


def gloss_table(texts):
    """form → [lemma, Spanish, week] for every Italian word of the texts, for
    the tap-to-see-the-meaning glossary of the app.  A form with several
    readings shows them all, in one line: *entro* «dentro de, antes de (un
    plazo) · también, del verbo: entrar (yo entro)»; *sale* «sal · también,
    del verbo: subir (sube)».
    The curated ones (bank/glossario.py SENSI) put the usual reading first."""
    sensi = _curated()
    out = {}
    for text in texts:
        for tok in words_of(text):
            if tok in out:
                continue
            lm = lemma_of(tok)
            if tok in sensi:
                first = sensi[tok][0]
                rest = [tuple(x) for x in sensi[tok][1:]]
                wk = first[2] if isinstance(first[2], int) else LEVEL_WEEK.get(first[2], 19)
                cognate = is_cognate(first[0], first[1]) or is_cognate(tok, first[1])
                extra = [(l2, 0, g2, v2) for l2, g2, lv, v2 in rest]
                out[tok] = [first[0], first[1] + (" · " + _fmt(extra) if extra else ""), 1 if cognate else wk]
                continue
            if lm and lm[2] and lm[1] > 0:
                cognate = is_cognate(lm[0], lm[2]) or is_cognate(tok, lm[2])
                entry = [lm[0], lm[2], 1 if cognate else lm[1]]
                alts = other_senses(tok, lm[0], lm[2])[:2]
                if alts:
                    entry[1] = entry[1] + " · " + _fmt(alts)
                out[tok] = entry
    return out


def main():
    import collections
    with open(os.path.join(ROOT, "docs", "lang", "it", "data", "course.json"), encoding="utf-8") as fh:
        course = json.load(fh)
    seen = lesson_words(course)
    items = {i["id"]: i for i in course["items"]}
    read_c, write_c = collections.Counter(), collections.Counter()
    n_read = n_write = total = 0
    for w in course["weeks"]:
        if w.get("boss"):
            continue
        for iid in w["items"]:
            r, wr = unknown_words(items[iid], w["week"], seen)
            total += 1
            n_read += bool(r)
            n_write += bool(wr)
            read_c.update(r)
            write_c.update(wr)
    print("ítems: %d · con palabras no vistas para leer: %d · para escribir: %d"
          % (total, n_read, n_write))
    print("para escribir:", ", ".join("%s %d" % x for x in write_c.most_common(40)))
    print("para leer:", ", ".join("%s %d" % x for x in read_c.most_common(40)))


if __name__ == "__main__":
    main()
