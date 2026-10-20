#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""La capa de frecuencia del vocabulario italiano.

Compila tres listas abiertas en docs/data/frequenza.json:

- itWaC (franfranz/Word_Frequency_Lists_ITA, MIT): lema, forma, clase de
  palabra y Zipf del italiano escrito (Baroni et al. 2009).
- OpenSubtitles 2018 (hermitdave/FrequencyWords, CC BY-SA 4.0): frecuencia
  del italiano hablado (subtítulos), por forma.
- KELLY (Kilgarriff et al. 2014; JSON de kotoshu/frequency-list-kelly, MIT):
  ~6.900 palabras con nivel MCER A1-C2.

Con esto la app sabe, para cada palabra, cuán frecuente es (escrita y oral)
y a qué nivel pertenece, y puede medir la cobertura del vocabulario del
alumno (Nation 2006; De Mauro 2016), priorizar lo frecuente que falta,
armar distractores de la misma banda y verificar en el teléfono que un
texto generado use solo palabras conocidas.

Uso:  python3 tools/build_frequenza.py [carpeta_con_las_listas]
Sin carpeta, las descarga a tools/.cache/frequenza/ (hace falta red).
"""
import csv
import json
import math
import os
import re
import sys
import urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
OUT = os.path.join(ROOT, "docs", "lang", "it", "data", "frequenza.json")
CACHE = os.path.join(ROOT, "tools", "it", ".cache", "frequenza")

SOURCES = {
    "itwac_nouns_lemmas_notail_2_0_0.csv":
        "https://raw.githubusercontent.com/franfranz/Word_Frequency_Lists_ITA/main/itwac_nouns_lemmas_notail_2_0_0.csv",
    "itwac_verbs_lemmas_notail_2_1_0.csv":
        "https://raw.githubusercontent.com/franfranz/Word_Frequency_Lists_ITA/main/itwac_verbs_lemmas_notail_2_1_0.csv",
    "itwac_adj_lemmas_notail_2_1_0.csv":
        "https://raw.githubusercontent.com/franfranz/Word_Frequency_Lists_ITA/main/itwac_adj_lemmas_notail_2_1_0.csv",
    "it_50k.txt": "https://raw.githubusercontent.com/hermitdave/FrequencyWords/master/content/2018/it/it_50k.txt",
    "kelly_it.json": "https://raw.githubusercontent.com/kotoshu/frequency-list-kelly/master/data/it.json",
}

WORD = re.compile(r"^[a-zàèéìíòóùú']+$")
LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"]
POS_MAP = {"NOUN": "n", "VER": "v", "ADJ": "a"}
KELLY_POS = {"n": "n", "v": "v", "adj": "a", "adv": "r", "prep": "p", "pron": "pr", "conj": "c", "num": "num", "int": "i", "det": "d"}


def fetch(folder):
    os.makedirs(folder, exist_ok=True)
    for name, url in SOURCES.items():
        path = os.path.join(folder, name)
        if os.path.exists(path):
            continue
        print("descargando", name)
        urllib.request.urlretrieve(url, path)


def main():
    folder = sys.argv[1] if len(sys.argv) > 1 else CACHE
    fetch(folder)

    # KELLY first: its words are lemmas in their own right (so «magari» is
    # not filed as a form of something else by the tagger).
    with open(os.path.join(folder, "kelly_it.json"), encoding="utf-8") as fh:
        kelly = json.load(fh)
    cefr = {}
    for x in kelly.get("full_list", []):
        lvl = x.get("cefr")
        if lvl not in LEVELS:
            continue
        for w in str(x.get("word", "")).split(","):
            w = w.strip().lower()
            if not WORD.match(w):
                continue
            if w not in cefr or LEVELS.index(lvl) < LEVELS.index(cefr[w][0]):
                cefr[w] = (lvl, KELLY_POS.get(x.get("pos"), ""))

    lemmas = {}          # lemma -> {"z": zipf, "p": pos, "forms": {form: zipf}}
    for name, pos in (("itwac_nouns_lemmas_notail_2_0_0.csv", "n"),
                      ("itwac_verbs_lemmas_notail_2_1_0.csv", "v"),
                      ("itwac_adj_lemmas_notail_2_1_0.csv", "a")):
        with open(os.path.join(folder, name), encoding="utf-8", errors="replace") as fh:
            for row in csv.DictReader(fh):
                form = (row.get("Form") or "").strip().lower()
                lemma = (row.get("lemma") or "").strip().lower()
                try:
                    z = float(row.get("Zipf") or 0)
                except ValueError:
                    continue
                if not WORD.match(form) or not WORD.match(lemma) or "�" in form or "�" in lemma:
                    continue
                e = lemmas.setdefault(lemma, {"z": 0.0, "p": pos, "forms": {}})
                if z > e["forms"].get(form, 0):
                    e["forms"][form] = z
                # the lemma's own frequency: the sum of its forms (log scale)
                e["_sum"] = e.get("_sum", 0.0) + 10 ** z
    for lemma, e in lemmas.items():
        e["z"] = round(math.log10(e.pop("_sum")), 2)

    # spoken frequency (subtitles): per form, aggregated to the lemma when known
    total = 0
    subs = {}
    with open(os.path.join(folder, "it_50k.txt"), encoding="utf-8") as fh:
        for line in fh:
            parts = line.split()
            if len(parts) != 2:
                continue
            n = int(parts[1])
            total += n
            subs[parts[0].lower()] = n
    form_to_lemma = {}
    for lemma, e in lemmas.items():
        for f in e["forms"]:
            if f in cefr and f != lemma:
                continue            # a word of its own (magari, comunque, di)
            # a form shared by several lemmas goes to the most frequent one
            if f not in form_to_lemma or lemmas[form_to_lemma[f]]["z"] < e["z"]:
                form_to_lemma[f] = lemma
    oral = {}
    for f, n in subs.items():
        lemma = form_to_lemma.get(f, f)
        oral[lemma] = oral.get(lemma, 0) + n
    for lemma, n in oral.items():
        z = round(math.log10(n / total * 1e6) + 3, 2)
        if lemma in lemmas:
            lemmas[lemma]["o"] = z
        else:
            # function words, adverbs, names: only in the subtitle list
            lemmas[lemma] = {"z": 0.0, "p": "", "forms": {}, "o": z}

    # KELLY: CEFR level; its part of speech wins for a function word the
    # tagger read as a verb («di» is a preposition before it is «dire»).
    for w, (lvl, pos) in cefr.items():
        e = lemmas.setdefault(w, {"z": 0.0, "p": pos, "forms": {}})
        e["c"] = lvl
        if not e["p"] or (pos and e["z"] < 3.5):
            e["p"] = pos

    # Keep what a learner can meet: written Zipf >= 3.2 (about 13.000
    # lemmas), spoken Zipf >= 3.5, and every KELLY word.
    out_lemmas = {}
    for lemma, e in lemmas.items():
        if not (e["z"] >= 3.2 or e.get("o", 0) >= 3.5 or e.get("c")):
            continue
        rec = [e["z"], e.get("o", 0), e.get("c", ""), e["p"]]
        out_lemmas[lemma] = rec
    # Forms: only of the kept lemmas, only forms with Zipf >= 2.5 (the rest
    # is noise of the tagger) and different from the lemma.
    out_forms = {}
    for lemma, e in lemmas.items():
        if lemma not in out_lemmas:
            continue
        for f, z in e["forms"].items():
            if f != lemma and z >= 2.8 and form_to_lemma.get(f) == lemma:
                out_forms[f] = lemma

    data = {"fonti": ["itWaC (Baroni et al. 2009; lists by franfranz, MIT)",
                      "OpenSubtitles 2018 (hermitdave/FrequencyWords, CC BY-SA 4.0)",
                      "KELLY (Kilgarriff et al. 2014; kotoshu/frequency-list-kelly, MIT)"],
            "lemmi": out_lemmas, "forme": out_forms}
    with open(OUT, "w", encoding="utf-8") as fh:
        json.dump(data, fh, ensure_ascii=False, separators=(",", ":"))
    by_level = {}
    for rec in out_lemmas.values():
        if rec[2]:
            by_level[rec[2]] = by_level.get(rec[2], 0) + 1
    print("lemas: %d · formas: %d · con nivel: %s · %d KB" % (
        len(out_lemmas), len(out_forms), by_level, os.path.getsize(OUT) // 1024))


if __name__ == "__main__":
    main()
