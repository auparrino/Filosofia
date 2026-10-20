"""Legge parole (una per riga) da stdin e stampa quelle che nessun dizionario
Hunspell (it, es, en di LibreOffice) riconosce.  Usato da lint.js.
Requisiti: pip install spylls ; cd tools/it/audit && npm install"""
import os
import sys
from spylls.hunspell import Dictionary

HERE = os.path.dirname(os.path.abspath(__file__))
DICTS = [Dictionary.from_files(os.path.join(HERE, "node_modules", "dictionary-" + l, "index"))
         for l in ("it", "es", "en")]

ES = DICTS[1]
CLIT = ("melo", "mela", "telo", "tela", "selo", "sela", "nos", "los", "las", "les", "me", "te", "se", "lo", "la", "le")
PLAIN = str.maketrans("áéí", "aei")


def voseo(w):
    """Rioplatense voseo: tenés, acordás, cerrá, anotalos, decime."""
    base = w
    for c in CLIT:
        if base.endswith(c) and len(base) > len(c) + 2:
            base = base[: -len(c)]
            break
    stem = base.translate(PLAIN)
    for tail, infs in (("as", ("ar",)), ("es", ("er", "ir")), ("is", ("ir",)),
                       ("a", ("ar",)), ("e", ("er", "ir")), ("i", ("ir",))):
        if stem.endswith(tail):
            root = stem[: -len(tail)]
            for inf in infs:
                if len(root) > 1 and ES.lookup(root + inf):
                    return True
            # stem-changing verbs: acordás ← acordar is regular in vos
    return False


def ok(w):
    for d in DICTS:
        if d.lookup(w) or d.lookup(w.capitalize()):
            return True
    return voseo(w)

EN = DICTS[2]

# --english: words that only English knows (not Italian, not Spanish).
ENGLISH = "--english" in sys.argv
for line in sys.stdin:
    w = line.strip()
    if not w:
        continue
    if ENGLISH:
        if (EN.lookup(w) or EN.lookup(w.capitalize())) and not any(
                d.lookup(w) or d.lookup(w.capitalize()) for d in DICTS[:2]) and not voseo(w):
            print(w)
    elif not ok(w):
        print(w)
