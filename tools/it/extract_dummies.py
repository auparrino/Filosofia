#!/usr/bin/env python3
"""Extract the graded exercise bank from `Italian Grammar For Dummies`.

The EPUB marks practice items as <p class="Q-A"> lines that carry a leading
item number, and the per-chapter answer key as <p class="Answers-NL"> lines
numbered with the same sequence.  Pairing the two by number gives us items we
can grade automatically.

Usage:  python3 tools/it/extract_dummies.py <epub> tools/it/fuentes/bank_dummies.json
"""
import html
import json
import os
import re
import sys
import zipfile

CHAPTER_RE = re.compile(r"ch(\d+)\.html$")


def strip(markup: str) -> str:
    """Turn a fragment of the book's markup into plain text."""
    text = re.sub(r"<[^>]+>", "", markup)
    text = html.unescape(text)
    return re.sub(r"[\s ]+", " ", text).strip()


def blanks_to_gap(text: str) -> str:
    """Normalise the underscore runs the book uses for answer slots."""
    return re.sub(r"_{3,}", "___", text).strip()


def chapter_title(page: str) -> str:
    for cls in ("Chap-Title", "Chapter-Title"):
        m = re.search(r'<p class="%s"[^>]*>(.*?)</p>' % cls, page, re.S)
        if m:
            return strip(m.group(1))
    m = re.search(r"<title>(.*?)</title>", page, re.S)
    return strip(m.group(1)) if m else ""


def parse_answers(tail: str) -> dict:
    """Map item number -> answer text from the chapter's answer key."""
    answers = {}
    pattern = (
        r'<p class="Answers?-NL[^"]*">\s*'
        r'<span class="Answer-NL-Num-square">(\d+)</span>(.*?)</p>'
    )
    for num, body in re.findall(pattern, tail, re.S):
        answer = strip(body)
        if answer:
            answers[int(num)] = answer
    return answers


def parse_questions(head: str) -> list:
    """Read numbered practice items together with the directions above them."""
    items, directions, example = [], "", None

    # Walk the chapter in document order so each item keeps the directions and
    # worked example that introduce it.
    for m in re.finditer(
        r'<p class="(Normal-w-icon|Q-A)">(.*?)</p>', head, re.S
    ):
        cls, body = m.group(1), m.group(2)
        text = strip(body)
        if not text:
            continue

        if cls == "Normal-w-icon":
            # Only the "practice" icon introduces an exercise; other icons are
            # tips and warnings that would pollute the directions.
            if "practice" in body:
                directions = text
                example = None
            continue

        if re.match(r"^Q\.", text):
            example = {"q": blanks_to_gap(text[2:].strip())}
            continue
        if re.match(r"^A\.", text) and example is not None:
            example["a"] = text[2:].strip()
            continue

        m_item = re.match(r"^(\d+)\.\s*(.+)$", text)
        if not m_item:
            continue
        stem = blanks_to_gap(m_item.group(2))
        if not stem or set(stem) <= set("_ "):
            continue
        items.append(
            {
                "n": int(m_item.group(1)),
                "stem": stem,
                "directions": directions,
                "example": dict(example) if example and "a" in example else None,
            }
        )
    return items


def main(epub_path: str, out_path: str) -> None:
    chapters = []
    with zipfile.ZipFile(epub_path) as zf:
        names = sorted(n for n in zf.namelist() if CHAPTER_RE.search(n))
        for name in names:
            page = zf.read(name).decode("utf-8", "replace")
            num = int(CHAPTER_RE.search(name).group(1))
            split = page.find("Answer Key")
            head, tail = (page[:split], page[split:]) if split > 0 else (page, "")

            answers = parse_answers(tail)
            entries = []
            for item in parse_questions(head):
                answer = answers.get(item["n"])
                if not answer:
                    continue
                entries.append(
                    {
                        "id": "d%02d-%03d" % (num, item["n"]),
                        "stem": item["stem"],
                        "answer": answer,
                        "directions": item["directions"],
                        "example": item["example"],
                    }
                )
            if entries:
                chapters.append(
                    {
                        "chapter": num,
                        "title": chapter_title(page),
                        "items": entries,
                    }
                )

    total = sum(len(c["items"]) for c in chapters)
    os.makedirs(os.path.dirname(out_path), exist_ok=True)
    with open(out_path, "w", encoding="utf-8") as fh:
        json.dump(
            {"source": "Italian Grammar For Dummies", "chapters": chapters},
            fh,
            ensure_ascii=False,
            indent=1,
        )
    print("chapters: %d  graded items: %d -> %s" % (len(chapters), total, out_path))


if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2])
