# -*- coding: utf-8 -*-
"""Escuta: distinguir los sonidos del portugués antes de escribirlos.

El texto no se ve (nopeek): se oye una palabra (TTS pt-BR) y se elige cómo
se escribe.  Pares mínimos de lo que el oído hispanohablante no separa:
vocales abiertas y cerradas, nasales, lh / nh, s sonora, ch / j, ti / di,
r / rr, v / b (semana 1); plurales nasales (semana 2); números que se
confunden (semana 7).  Todas las opciones son palabras (o grupos de dos
palabras) que existen.  Cuando una vocal sola se lee como el nombre de la
letra (e, só / sou), el par va en dos palabras: *é ela / e ela*.

Cada ítem va a la parte de la lección que enseña esos sonidos (PART):
semana 1 → «Los sonidos que el español no tiene», semana 2 → plurales,
semana 7 → los números.  Sin «part», build_course.py lo mandaría a la
última parte de la semana.
"""

P = "Escuchá: ¿qué palabra dice?"

# semana: [(dice, otras opciones, nota)]
PAIRS = {
    1: [
        ("avó", ["avô"], "avó, con ó abierta, es la abuela; avô, con ô cerrada, el abuelo."),
        ("avô", ["avó"], "avô: ô cerrada, como la o española pero más cerrada. Es el abuelo."),
        ("é ela", ["e ela"], "é ela (es ella): é abierta y tónica; e ela (y ella): la e átona suena casi «i»."),
        ("mão", ["mau", "mal"], "mão (mano) es nasal: sale también por la nariz. mau y mal suenan igual: «mau»."),
        ("pão", ["pau"], "pão (pan) es nasal; pau (palo), oral."),
        ("lã", ["lá"], "lã (lana) es nasal; lá (allá), oral."),
        ("sim", ["sem"], "sim (sí) con i nasal; sem (sin) con e nasal. En las dos la m final no se cierra: los labios quedan abiertos."),
        ("irmão", ["irmã"], "irmão termina en el diptongo nasal ão; irmã, en una ã sola."),
        ("filha", ["fila"], "lh es una consonante palatal, como la «ll» antigua: filha es hija; fila, fila."),
        ("sonho", ["sono"], "nh es la ñ: sonho («soño») es lo que soñás; sono, las ganas de dormir."),
        ("velha", ["vela"], "velha (vieja) con lh palatal; vela, con l."),
        ("casa", ["caça"], "casa suena «caza»: la s entre vocales es sonora. caça (caza), con s sorda."),
        ("chá", ["já"], "chá (té) suena como la «sh» de *show*, sorda; já (ya), como la «y» de *yo* en un rioplatense que la hace zumbar, sonora."),
        ("tia", ["dia"], "tia suena «chía»; dia, «yía»: ti y di se palatalizan en Brasil."),
        ("dia", ["tia"], "dia suena «yía», con un toque de d: la d delante de i."),
        ("carro", ["caro"], "carro con rr aspirada, como una j suave; caro, con r suave."),
        ("caro", ["carro"], "caro: la r entre vocales es un toque suave, como en español."),
        ("vem", ["bem"], "vem (viene) con v labiodental (dientes sobre el labio); bem (bien) con b."),
        ("bela", ["vela"], "bela (bella) con b bilabial; vela, con v labiodental."),
        ("só eu", ["sou eu"], "só eu (solo yo) con ó abierta; sou eu (soy yo) con ô cerrada."),
    ],
    2: [
        ("mãos", ["mães"], "mãos (manos) termina en «ãus»; mães (madres), en «ãis»."),
        ("mães", ["mãos"], "mães (madres): el diptongo nasal cierra hacia la i."),
        ("pães", ["pais", "pão"], "pão hace el plural pães (nasal); pais (padres) es oral."),
        ("limões", ["limão"], "limão → limões: la mayoría de los -ão hacen -ões."),
        ("papéis", ["papel"], "papel → papéis: la l final se vuelve -is, con é abierta."),
        ("homens", ["homem"], "homem → homens: la nasal final no suena como m ni como n."),
    ],
    7: [
        ("doze", ["doce", "dois"], "doze (12) con z sonora; doce es dulce."),
        ("sessenta", ["setenta"], "sessenta (60) con ss; setenta (70) con t."),
        ("setenta", ["sessenta"], "setenta (70): la t se oye clara, sin palatalizar (te)."),
        ("treze", ["três", "trezentos"], "treze (13): la z final suena «zi»; três (3) termina en s."),
        ("dezesseis", ["dezessete"], "dezesseis (16) termina en «seis»; dezessete (17), en «sete»."),
        ("duzentos", ["doze", "dois"], "duzentos (200): du-ZEN-tos."),
    ],
}

# semana: índice de la parte de su lección (tools/pt/lessons/s1.py)
PART = {1: 1, 2: 0, 7: 0}

ITEMS = []
for w, pairs in sorted(PAIRS.items()):
    for k, (said, other, note) in enumerate(pairs, 1):
        ITEMS.append(dict(id="asc-pt-%d-%02d" % (w, k), w=w, part=PART[w], type="listen", topic="ortografia",
                          level="A1", prompt=P, stem=said, options=[said] + other, answer=said,
                          nopeek=True, note=note))
