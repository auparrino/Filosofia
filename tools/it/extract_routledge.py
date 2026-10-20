#!/usr/bin/env python3
"""Extract the syllabus and open challenges from `Soluzioni` (Routledge).

This book is the course's C1 spine.  Its ebook edition ships no answer key —
the answers live on the publisher's companion site — so its exercises become
self-scored "master challenges" rather than auto-graded items.  What we take
from it is the structure: numbered sections per chapter, and the Esercizi
laid out as <ol class="order1"> groups of <ol class="order2"> sub-items.

Usage:  python3 tools/it/extract_routledge.py <epub> tools/it/fuentes/bank_routledge.json
"""
import html
import json
import os
import re
import sys
import zipfile

CHAPTER_RE = re.compile(r"Ch(\d\d)\.xhtml$")


def strip(markup: str) -> str:
    text = re.sub(r"<[^>]+>", " ", markup)
    text = html.unescape(text)
    return re.sub(r"[\s ]+", " ", text).strip()


def chapter_title(page: str) -> str:
    m = re.search(r'<h1[^>]*>(.*?)</h1>', page, re.S)
    if m:
        return re.sub(r"^\d+\s*", "", strip(m.group(1)))
    return ""


def sections(page: str) -> list:
    """Sections of a chapter: the numbered '24.1 ...' headings and, nested
    under each, the lettered '(a) ...' sub-headings."""
    out = []
    for m in re.finditer(r"<h([1-6])[^>]*>(.*?)</h\1>", page, re.S):
        text = strip(m.group(2))
        m_num = re.match(r"^(\d+\.\d+)\s+(.*)$", text)
        if m_num:
            out.append({"n": m_num.group(1), "title": m_num.group(2), "parts": []})
            continue
        m_part = re.match(r"^\(([a-z])\)\s+(.*)$", text)
        if m_part and out:
            out[-1]["parts"].append(m_part.group(2))
    return out


def order1_blocks(page: str):
    """Yield the body of each <ol class="order1">, honouring nested <ol>s."""
    for m in re.finditer(r'<ol class="order1">', page):
        start = m.end()
        depth, pos = 1, start
        for tag in re.finditer(r"<(/?)ol\b", page[start:]):
            depth += -1 if tag.group(1) else 1
            if depth == 0:
                pos = start + tag.start()
                break
        else:
            continue
        yield page[start:pos]


def challenges(page: str, chapter: int) -> list:
    """Exercise groups: an instruction line plus its lettered sub-items."""
    out = []
    # Each top-level <li> is one exercise: a leading <b>N</b>, the instruction
    # text, then an optional nested <ol class="order2"> of sub-items.
    for block in order1_blocks(page):
        for m in re.finditer(
            r"<li><b>(\d+)</b>(.*?)(?=<li><b>\d+</b>|$)", block, re.S
        ):
            num, body = int(m.group(1)), m.group(2)
            nested = re.search(r'<ol class="order2">(.*?)</ol>', body, re.S)
            instruction = strip(re.sub(r'<ol class="order2">.*', "", body, flags=re.S))
            items = []
            if nested:
                for sub in re.findall(
                    r"<li>(?:<b>\(([a-z])\)</b>)?(.*?)</li>", nested.group(1), re.S
                ):
                    text = strip(sub[1])
                    if text:
                        items.append({"label": sub[0] or "", "text": text})
            if instruction and items:
                out.append(
                    {
                        "id": "r%02d-%02d" % (chapter, num),
                        "n": num,
                        "instruction": instruction,
                        "items": items,
                    }
                )
    return out


def main(epub_path: str, out_path: str) -> None:
    chapters = []
    with zipfile.ZipFile(epub_path) as zf:
        for name in sorted(n for n in zf.namelist() if CHAPTER_RE.search(n)):
            num = int(CHAPTER_RE.search(name).group(1))
            if num == 0:
                continue
            page = zf.read(name).decode("utf-8", "replace")
            chapters.append(
                {
                    "chapter": num,
                    "title": chapter_title(page),
                    "sections": sections(page),
                    "challenges": challenges(page, num),
                }
            )

    n_ch = sum(len(c["challenges"]) for c in chapters)
    n_it = sum(len(x["items"]) for c in chapters for x in c["challenges"])
    n_se = sum(len(c["sections"]) for c in chapters)
    os.makedirs(os.path.dirname(out_path), exist_ok=True)
    with open(out_path, "w", encoding="utf-8") as fh:
        json.dump(
            {
                "source": "Soluzioni: A Practical Grammar of Contemporary Italian",
                "graded": False,
                "chapters": chapters,
            },
            fh,
            ensure_ascii=False,
            indent=1,
        )
    print(
        "chapters: %d  sections: %d  challenges: %d  sub-items: %d -> %s"
        % (len(chapters), n_se, n_ch, n_it, out_path)
    )


if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2])
