# -*- coding: utf-8 -*-
"""Las lecciones teóricas de las 52 semanas.

Cada módulo sN.py expone LESSONS = {numero_de_semana: leccion}.

Una lección es:
    {"intro": "párrafo de apertura",
     "blocks": [bloque, ...]}

Un bloque puede combinar, y se dibuja siempre en este orden:
    h     título del bloque
    p     lista de párrafos
    table {"head": [...], "rows": [[...], ...]}
    ex    lista de pares [italiano, castellano]
    warn  la trampa del hispanohablante
    tip   el atajo que conviene memorizar

Dentro de los textos, *así* marca una palabra o forma italiana.
"""
from . import s1, s2, s3, s4

LESSONS = {}
for _m in (s1, s2, s3, s4):
    LESSONS.update(_m.LESSONS)
