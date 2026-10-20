#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Common Voice: elegir oraciones para escuchar gramática (tools/it/VOCES.md, caso 2).

Lee el índice de oraciones validadas de Common Voice Italian
(`validated.tsv`, sin bajar el audio) y elige unas pocas por semana:

- de 5 a 12 palabras, con al menos dos votos a favor y ninguno en contra;
- la semana es la primera en la que ya se enseñó su gramática
  (sillabo.analyze) y se conoce su vocabulario (lessico.word_week), con a lo
  sumo una palabra no vista;
- hablantes distintos dentro de cada semana.

Escribe `docs/lang/it/audio/cv/elegidas.json` (semana → oraciones con su archivo mp3)
y `docs/lang/it/audio/cv/elegidas.txt`, la lista de audios.  Si se le da el paquete
descargado de Mozilla (.tar.gz), lo recorre sin descomprimirlo entero y copia
solo esos mp3 a `docs/lang/it/audio/cv/`; con `--clips DIR`, los copia de una carpeta.
Anda en Windows, Mac o Linux con Python 3 y Node (sillabo usa el conjugador).

    python3 tools/voci_cv.py cv-corpus-...-it.tar.gz [--por-semana 10]
    python3 tools/voci_cv.py validated.tsv [--clips DIR]
"""
import argparse
import collections
import csv
import json
import os
import shutil
import sys
import tarfile
import tempfile

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import lessico  # noqa: E402
import sillabo  # noqa: E402

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
OUT = os.path.join(ROOT, "docs", "lang", "it", "audio", "cv")


def candidates(tsv):
    csv.field_size_limit(10 ** 7)
    with open(tsv, encoding="utf-8", newline="") as fh:
        for row in csv.DictReader(fh, delimiter="\t", quoting=csv.QUOTE_NONE):
            try:
                up, down = int(row.get("up_votes") or 0), int(row.get("down_votes") or 0)
            except ValueError:
                continue
            text = (row.get("sentence") or "").strip()
            if up < 2 or down > 0 or not 5 <= len(text.split()) <= 12:
                continue
            yield row["client_id"], row["path"], text


def week_of(text, seen):
    """First week at which the sentence can be heard, or None."""
    gram = max(sillabo.analyze(text).values() or [1])
    vocab = sorted((lessico.word_week(t, seen)[0] for t in lessico.words_of(text)),
                   reverse=True)
    if not vocab or vocab[0] == 99 and (len(vocab) < 2 or vocab[1] == 99):
        return None                              # dos palabras fuera del curso
    lex = vocab[1] if len(vocab) > 1 and vocab[0] == 99 else vocab[0]
    wk = max(gram, lex)
    return wk if wk <= 52 else None


def tsv_from_tar(archive):
    """Extract validated.tsv from the Mozilla package into a temp file."""
    with tarfile.open(archive, "r|*") as tar:
        for m in tar:
            if m.isfile() and m.name.endswith("/validated.tsv"):
                tmp = tempfile.NamedTemporaryFile(suffix=".tsv", delete=False)
                shutil.copyfileobj(tar.extractfile(m), tmp)
                tmp.close()
                return tmp.name
    sys.exit("no encontré validated.tsv en %s" % archive)


def clips_from_tar(archive, wanted):
    """Copy the chosen mp3s out of the package in one pass."""
    left = set(wanted)
    with tarfile.open(archive, "r|*") as tar:
        for m in tar:
            name = m.name.rsplit("/", 1)[-1]
            if m.isfile() and "/clips/" in m.name and name in left:
                with open(os.path.join(OUT, name), "wb") as fh:
                    shutil.copyfileobj(tar.extractfile(m), fh)
                left.discard(name)
                if not left:
                    break
    return left


def main():
    try:
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    except AttributeError:
        pass
    ap = argparse.ArgumentParser()
    ap.add_argument("fuente", help="validated.tsv o el paquete .tar.gz de Mozilla")
    ap.add_argument("--por-semana", type=int, default=10)
    ap.add_argument("--clips", help="carpeta con los mp3 de Common Voice")
    args = ap.parse_args()

    is_tar = not args.fuente.endswith(".tsv")
    if is_tar:
        print("buscando validated.tsv en el paquete (puede tardar unos minutos)…")
    tsv = tsv_from_tar(args.fuente) if is_tar else args.fuente

    with open(os.path.join(ROOT, "docs", "lang", "it", "data", "course.json"), encoding="utf-8") as fh:
        seen = lessico.lesson_words(json.load(fh))

    by_week = collections.defaultdict(list)
    speakers = collections.defaultdict(set)
    texts = set()
    for client, path, text in candidates(tsv):
        key = text.lower().rstrip(".!?")
        if key in texts:
            continue
        wk = week_of(text, seen)
        if not wk or len(by_week[wk]) >= args.por_semana or client in speakers[wk]:
            continue
        texts.add(key)
        speakers[wk].add(client)
        by_week[wk].append({"it": text, "file": path})
    if is_tar:
        os.unlink(tsv)

    os.makedirs(OUT, exist_ok=True)
    chosen = {str(w): by_week[w] for w in sorted(by_week)}
    with open(os.path.join(OUT, "elegidas.json"), "w", encoding="utf-8") as fh:
        json.dump(chosen, fh, ensure_ascii=False, indent=1)
    files = [s["file"] for w in chosen.values() for s in w]
    with open(os.path.join(OUT, "elegidas.txt"), "w", encoding="utf-8") as fh:
        fh.writelines(f + "\n" for f in files)
    print("oraciones elegidas: %d en %d semanas" % (len(files), len(chosen)))
    for w, v in chosen.items():
        print("  semana %s: %d · %s" % (w, len(v), v[0]["it"]))

    if is_tar:
        print("copiando los audios elegidos…")
        missing = clips_from_tar(args.fuente, files)
    elif args.clips:
        missing = set()
        for f in files:
            src = os.path.join(args.clips, f)
            if os.path.exists(src):
                shutil.copy(src, os.path.join(OUT, f))
            else:
                missing.add(f)
    else:
        return
    size = sum(os.path.getsize(os.path.join(OUT, f)) for f in files if f not in missing)
    print("audios copiados: %d (%.1f MB) en docs/lang/it/audio/cv/ · faltan: %d"
          % (len(files) - len(missing), size / 1e6, len(missing)))


if __name__ == "__main__":
    main()
