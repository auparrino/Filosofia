# -*- coding: utf-8 -*-
"""Ejercicios de la estación 1 — Primeiros Passos (semanas 1-13, A1 → A2).

Cada semana no-jefe tiene al menos 45 ítems (choice, cloze, translate,
fixerr, garden, scopri, typed) y la semana 13 (CHEFÃO) 20 ítems mixtos de
toda la estación.  «part» es el índice de la parte de la lección de esa
semana (tools/lessons/s1.py).  Nada antes de su teoría: semanas 1-4 solo
ser / estar / ter en lo que el alumno escribe; presente regular desde la 5,
irregular desde la 6, gerúndio desde la 8, perfeito desde la 11 e
imperativo desde la 12.
"""

ITEMS = []
_count = {}

CH = "Elegí la forma correcta."
CZ = "Completá."
TR = "Traducí al portugués."
FX = "Encontrá el error: tocá la parte que está mal y corregila."
GP = "Mirá los tres ejemplos y completá el cuarto."
SP = "Leé las frases y descubrí la regla."
TY = "Escribí la respuesta."


def _id(w):
    _count[w] = _count.get(w, 0) + 1
    return "s1-%02d-%02d" % (w, _count[w])


def _add(w, part, typ, prompt, stem, answer, note, alt=None, **kw):
    d = dict(id=_id(w), w=w, part=part, level="A1" if w <= 8 else "A2",
             type=typ, prompt=prompt, stem=stem, answer=answer,
             alt=list(alt or []), note=note)
    d.update(kw)
    ITEMS.append(d)


def ch(w, p, stem, options, answer, note, prompt=CH):
    _add(w, p, "choice", prompt, stem, answer, note, options=options)


def cz(w, p, stem, answer, note, alt=None, prompt=CZ):
    _add(w, p, "cloze", prompt, stem, answer, note, alt)


def tr(w, p, stem, answer, alt, note):
    _add(w, p, "translate", TR, stem, answer, note, alt)


def ty(w, p, prompt, stem, answer, note, alt=None):
    _add(w, p, "typed", prompt, stem, answer, note, alt)


def fx(w, p, cat, stem, bad, good, note, good_alt=None):
    kw = dict(cat=cat, bad=bad, good=good)
    if good_alt:
        kw["goodAlt"] = good_alt
    _add(w, p, "fixerr", FX, stem, stem.replace(bad, good, 1), note, **kw)


def gd(w, p, lead, stem, answer, trap, note):
    _add(w, p, "garden", GP, stem, answer, note, lead=lead, trap=trap)


def sc(w, p, data, stem, options, answer, note):
    _add(w, p, "scopri", SP, stem, answer, note, data=data, options=options)


# ============================================================================
# Semana 1 — Sons, alfabeto, ser e estar
# partes: 0 saludos, tu/você, alfabeto · 1 sonidos · 2 ser, estar, ter
# ============================================================================
W = 1
ch(W, 0, "___ prazer!", ["Muito", "Muy", "Mucho"], "Muito",
   "«Muy» no existe en portugués: muito sirve para «muy» y para «mucho». Muito prazer = mucho gusto.",
   prompt="Te presentan a alguien. Elegí la forma correcta.")
ch(W, 0, "Oi, tudo bem? — ___", ["Tudo bem, e você?", "Todo bem, e você?", "Muy bem, e você?"], "Tudo bem, e você?",
   "A tudo bem? se responde con tudo bem (o tudo ótimo). «Todo» es otra palabra: tudo = todo, pronombre.",
   prompt="Elegí la respuesta natural.")
ch(W, 0, "Você ___ argentino?", ["é", "és", "está"], "é",
   "Con você el verbo va en tercera persona: você é, como ele é. «Você és» calca el «vos sos».")
ch(W, 0, "___ dia!", ["Bom", "Boa", "Bem"], "Bom",
   "Dia es masculino (o dia): bom dia. Tarde y noite son femeninos: boa tarde, boa noite.")
ch(W, 0, "___ noite!", ["Boa", "Bom", "Buena"], "Boa",
   "Noite es femenino: boa noite. «Buena» es español; en portugués boa (sin n).")
ch(W, 0, "J → ___", ["jota", "gê", "ji"], "jota",
   "La J se llama jota, como en español. La G se llama gê.",
   prompt="¿Cómo se llama la letra J en portugués?")
ch(W, 0, "E → ___", ["é", "ê", "i"], "é",
   "La letra E se dice é (abierta). Al deletrear: «é de escola».",
   prompt="¿Cómo se llama la letra E en portugués?")
ch(W, 1, "«abuela» → ___", ["avó", "avô", "avõ"], "avó",
   "El acento distingue: *avó* (o abierta, tilde aguda) es «abuela» y *avô* (o cerrada, circunflejo) es «abuelo». El español no marca la diferencia entre o abierta y cerrada.",
   prompt="¿Cuál significa «abuela»?")
ch(W, 1, "«montaña» → ___", ["montanha", "montaña", "montalha"], "montanha",
   "La ñ no existe en portugués: se escribe nh (montanha, Espanha, senhor).",
   prompt="¿Cómo se escribe en portugués?")
ch(W, 1, "«trabajo» → ___", ["trabalho", "trabajo", "trabalio"], "trabalho",
   "El sonido de la ll antigua se escribe lh: trabalho, mulher, filho.",
   prompt="¿Cómo se escribe en portugués?")
ch(W, 1, "___", ["noite", "nota", "nove"], "noite",
   "En Brasil ti y te final suenan «chi»: noite suena «nóichi». En nota y nove la t y la v no cambian.",
   prompt="¿En cuál de estas palabras se oye «ch» como en «chico»?")
ch(W, 1, "___", ["casa", "sala", "passo"], "casa",
   "La s entre vocales es sonora, como un zumbido: casa suena «caza». Al principio (sala) y la ss (passo) son sordas.",
   prompt="¿En cuál la s suena como una z zumbada?")
ch(W, 2, "Eu ___ com fome.", ["estou", "tenho", "sou"], "estou",
   "Hambre, sed, frío y sueño van con estar com: estou com fome.")
ch(W, 2, "Eles ___ dois filhos.", ["têm", "tem", "tenhem"], "têm",
   "ter: ele tem, eles têm. El circunflejo marca el plural; se pronuncian casi igual.")
ch(W, 2, "Nós ___ de Rosario.", ["somos", "estamos", "são"], "somos",
   "El origen va con ser: nós somos de Rosario. São es eles / vocês.")

cz(W, 0, "Eu me ___ Martín.", "chamo",
   "Para presentarte: eu me chamo… (me llamo). También meu nome é…")
cz(W, 0, "Muito ___! (mucho gusto)", "prazer",
   "*Muito prazer* es «mucho gusto»: *muito* sirve de «mucho» y de «muy». También alcanza con *prazer* solo.")
cz(W, 0, "Você ___ de onde? (ser)", "é",
   "Você lleva el verbo en tercera: você é. Pregunta típica: você é de onde?")
cz(W, 0, "Tudo ___? — Tudo ótimo!", "bem", "Tudo bem? es el saludo más común de Brasil; la respuesta repite: tudo bem.",
   alt=["bom", "beleza"])
cz(W, 1, "Espa___a (España)", "nh",
   "La ñ del español se escribe nh: Espanha.", prompt="Completá con nh, lh o ç.")
cz(W, 1, "mu___er (mujer)", "lh",
   "La j de «mujer» corresponde a lh en portugués: mulher (como filho, trabalho).", prompt="Completá con nh, lh o ç.")
cz(W, 1, "cabe___a (cabeza)", "ç",
   "La z del español ante a, o, u suele ser ç: cabeça, caça, açúcar.", prompt="Completá con nh, lh o ç.")
cz(W, 1, "na___ão (nación)", "ç",
   "-ción → -ção: nação, canção, estação.", prompt="Completá con nh, lh o ç.")
cz(W, 1, "vi___o (vino)", "nh",
   "Vinho se escribe con nh aunque el español «vino» no tenga ñ: aprendela como viene.", prompt="Completá con nh, lh o ç.")
cz(W, 2, "Ela ___ em Copacabana. (estar)", "está",
   "estar: eu estou, ela está. Lleva tilde en la última sílaba.")
cz(W, 2, "Eu ___ trinta anos. (ter)", "tenho",
   "La edad va con ter, como en español: tenho trinta anos.")
cz(W, 2, "Vocês ___ cariocas? (ser)", "são",
   "Vocês conjuga como eles: vocês são.")
cz(W, 2, "Nós ___ com frio. (estar)", "estamos",
   "Frío como sensación: estar com frio. Nós estamos.")

tr(W, 0, "¡Hola! ¿Todo bien?", "Oi! Tudo bem?",
   ["Oi, tudo bem?", "Olá! Tudo bem?", "Olá, tudo bem?", "Oi, tudo bom?", "Oi! Tudo bom?", "Oi, tudo beleza?"],
   "Oi es el hola de todos los días; olá es un poco más formal. Tudo bem = ¿todo bien?")
tr(W, 0, "Me llamo Sofía. Mucho gusto.", "Eu me chamo Sofía. Muito prazer.",
   ["Me chamo Sofía. Muito prazer.", "Meu nome é Sofía. Muito prazer.", "Eu me chamo Sofía. Prazer.",
    "Me chamo Sofía. Prazer.", "Meu nome é Sofía. Prazer.", "O meu nome é Sofía. Muito prazer.",
    "Chamo-me Sofía. Muito prazer.", "Eu me chamo Sofia. Muito prazer.", "Meu nome é Sofia. Muito prazer."],
   "Eu me chamo o meu nome é para presentarte; muito prazer, nunca «muy».")
tr(W, 0, "¿Vos sos argentino?", "Você é argentino?",
   ["Tu és argentino?", "Tu é argentino?"],
   "El «vos» del Río de la Plata se dice você, con el verbo en tercera: você é.")
tr(W, 2, "Soy de Buenos Aires.", "Sou de Buenos Aires.", ["Eu sou de Buenos Aires."],
   "El origen va con ser + de. Las ciudades sin artículo llevan de a secas.")
tr(W, 2, "Tengo treinta años.", "Tenho trinta anos.", ["Eu tenho trinta anos."],
   "La edad va con ter. Anos: la ñ de «años» se pierde (ano).")
tr(W, 2, "Tengo hambre.", "Estou com fome.", ["Eu estou com fome.", "Tô com fome.", "Eu tô com fome.", "Tenho fome.", "Eu tenho fome."],
   "Hambre, sed, frío y sueño: lo más común es estar com. Fome = hambre.")
tr(W, 2, "Estamos en Copacabana.", "Estamos em Copacabana.",
   ["Nós estamos em Copacabana.", "A gente está em Copacabana.", "A gente tá em Copacabana."],
   "estar + em. Copacabana se usa sin artículo: em Copacabana.")
tr(W, 2, "Ellos tienen sed.", "Eles estão com sede.", ["Elas estão com sede.", "Eles tão com sede.", "Elas têm sede.", "Eles têm sede.", "Eles tem sede."],
   "Lo más común es *estar com* + sustantivo; *ter sede* también se oye: *estar com sede* «tener sed», *estar com fome* «tener hambre». *Sede* también es «sede».")

fx(W, 0, "persona", "Você és brasileiro?", "és", "é",
   "Con você, siempre tercera persona: você é. «És» es la forma de tu.")
fx(W, 0, "muito", "Muy prazer, eu sou o Lucas.", "Muy", "Muito",
   "«Muy» no existe en portugués: muito prazer.")
fx(W, 2, "ortografia", "Eles tem dois filhos.", "tem", "têm",
   "Ele tem (singular), eles têm (plural, con circunflejo).")
fx(W, 1, "ortografia", "Bom dia, señor!", "señor", "senhor",
   "La ñ se escribe nh en portugués: senhor, Espanha, amanhã.")

gd(W, 1, [["España", "Espanha"], ["señor", "senhor"], ["montaña", "montanha"]], "año → ___", "ano", "anho",
   "La ñ suele pasar a nh, pero año es ano, con n simple (igual que dano, pano). "
   "No todas las ñ del español tienen nh en portugués.")
# Como mitad → metade: la excepción va en la semana 3, con Ponte (conserva su id, s1-01-41).
ITEMS[-1].update(w=3, part=2)
gd(W, 1, [["ciudad", "cidade"], ["verdad", "verdade"], ["universidad", "universidade"]], "mitad → ___", "metade", "mitade",
   "-dad → -dade, pero la raíz también cambia: mitad es metade, con e. Mirá la palabra entera, no solo el final.")
# La regla -dad → -dade la presenta Ponte en la semana 3: esta excepción va
# ahí (conserva su id, s1-01-42, para no mover el repaso de nadie).
ITEMS[-1].update(w=3, part=2)
gd(W, 1, [["nación", "nação"], ["canción", "canção"], ["estación", "estação"]], "corazón → ___", "coração", "corazão",
   "-ción → -ção (nação, canção); -zón → -ção o -zão: corazón → coração, pero razón → razão (la z se conserva). Mirá la palabra entera.")

sc(W, 0, ["Você é argentino?", "Você está cansada?", "Você tem irmãos?", "Ele é argentino.", "Ela está cansada.", "Ele tem irmãos."],
   "¿Con qué forma del verbo va «você»?",
   ["Con la misma forma que «ele / ela».", "Con una forma propia, como «vos sos».", "Con la misma forma que «eu»."],
   "Con la misma forma que «ele / ela».",
   "Você nació de una fórmula de respeto (vossa mercê) y por eso conjuga en tercera persona: você é, você está, você tem.")
sc(W, 2, ["Estou com fome.", "Ela está com sede.", "Estamos com frio.", "Eles estão com sono.", "Tenho trinta anos.", "Ela tem vinte anos."],
   "¿Cuándo va «estar com» y cuándo «ter»?",
   ["Con hambre, sed, frío y sueño se usa sobre todo «estar com» («ter» también se oye); la edad va siempre con «ter».",
    "La edad va con «estar com» (estou com trinta anos).",
    "«estar com» en plural y «ter» en singular."],
   "Con hambre, sed, frío y sueño se usa sobre todo «estar com» («ter» también se oye); la edad va siempre con «ter».",
   "En Brasil lo normal es estou com fome / com frio; tenho fome también existe. La edad, como en español, con ter.")

ty(W, 1, "Escribí «no» en portugués.", "«no» → ___", "não",
   "Não: ã nasal, como en mão y pão. La negación va antes del verbo: não sou.")
ty(W, 2, "Escribí la forma de «ser» para «eles».", "eles ___", "são",
   "ser: eu sou, ele é, nós somos, eles são. La ão final es nasal.")
ty(W, 0, "Escribí cómo se llama la letra H.", "H → ___", "agá",
   "La H se llama agá y no suena nunca al principio de palabra: hotel = «otéu».")

# ============================================================================
# Semana 2 — Substantivos: gênero e número
# partes: 0 plural · 1 género · 2 tem / há
# ============================================================================
W = 2
ch(W, 0, "o limão → os ___", ["limões", "limãos", "limães"], "limões",
   "La mayoría de las palabras en -ão hacen -ões. Pista: en español es -ones (limones).")
ch(W, 0, "o pão → os ___", ["pães", "pões", "pãos"], "pães",
   "Pão → pães, como pan → panes. Cuando el español dice -anes, el portugués dice -ães.")
ch(W, 0, "a mão → as ___", ["mãos", "mões", "mães"], "mãos",
   "Mão → mãos, como mano → manos. Mães es otra palabra: las madres.")
ch(W, 0, "o homem → os ___", ["homens", "homems", "hombres"], "homens",
   "-m → -ns en el plural: homem → homens, viagem → viagens.")
ch(W, 0, "o papel → os ___", ["papéis", "papeis", "papeles"], "papéis",
   "-el → -éis, con tilde: papel → papéis, hotel → hotéis.")
ch(W, 0, "o ônibus → os ___", ["ônibus", "ônibuses", "ônibis"], "ônibus",
   "Las palabras terminadas en -s átona no cambian: o ônibus, os ônibus; o lápis, os lápis.")
ch(W, 0, "o mês → os ___", ["meses", "mêses", "mês"], "meses",
   "-s tónica → -es: mês → meses, país → países. El circunflejo se pierde en meses.")
ch(W, 1, "___ leite está frio.", ["O", "A", "Os"], "O",
   "Leite es masculino en portugués: o leite. El español «la leche» engaña.")
ch(W, 1, "___ árvore é alta.", ["A", "O", "Um"], "A",
   "Árvore es femenino: a árvore (el árbol). Por eso: alta.")
ch(W, 1, "Tenho ___ mensagem.", ["uma", "um", "una"], "uma",
   "Todas las palabras en -agem son femeninas: uma mensagem, a viagem.")
ch(W, 1, "___ dor é forte.", ["A", "O", "El"], "A",
   "Dor es femenino en portugués: a dor (el dolor), uma dor forte.")
ch(W, 2, "___ um boteco aqui?", ["Tem", "Têm", "Hay"], "Tem",
   "En Brasil «hay» se dice tem (habla) o há (formal). Têm es «ellos tienen».")
ch(W, 2, "Aqui ___ duas praias.", ["tem", "têm", "hay"], "tem",
   "Con el sentido de «hay», tem no cambia en plural: tem duas praias.")
ch(W, 2, "___ dois hotéis aqui.", ["Há", "Hay", "Ha"], "Há",
   "En lo escrito formal, «hay» es há (de haver), con h y tilde.",
   prompt="Elegí la forma escrita formal.")

cz(W, 0, "a estação → as ___", "estações", "-ão → -ões, como estación → estaciones.",
   prompt="Escribí el plural.")
cz(W, 0, "o animal → os ___", "animais", "-al → -ais: animal → animais, jornal → jornais.",
   prompt="Escribí el plural.")
cz(W, 0, "a viagem → as ___", "viagens", "-m → -ns: viagem → viagens. Nunca «viagems».",
   prompt="Escribí el plural.")
cz(W, 0, "o irmão → os ___", "irmãos", "Irmão → irmãos, como hermano → hermanos.",
   prompt="Escribí el plural.")
cz(W, 0, "o alemão → os ___", "alemães", "Alemão → alemães, como alemán → alemanes.",
   prompt="Escribí el plural.")
cz(W, 0, "a flor → as ___", "flores", "-r → -es: flor → flores, mulher → mulheres.",
   prompt="Escribí el plural.")
cz(W, 0, "o lençol → os ___", "lençóis", "-ol → -óis, con tilde: lençol → lençóis, farol → faróis.",
   prompt="Escribí el plural.")
cz(W, 1, "___ sangue", "o", "Sangue es masculino: o sangue (la sangre).",
   prompt="Completá con el artículo (o / a).")
cz(W, 1, "___ ponte", "a", "Ponte es femenino: a ponte (el puente), como a ponte Rio-Niterói.",
   prompt="Completá con el artículo (o / a).")
cz(W, 1, "___ mensagem", "a", "-agem es siempre femenino: a mensagem (el mensaje).",
   prompt="Completá con el artículo (o / a).")
cz(W, 1, "___ nariz", "o", "Nariz es masculino: o nariz (la nariz).",
   prompt="Completá con el artículo (o / a).")
cz(W, 1, "___ cor", "a", "Cor es femenino: a cor (el color).",
   prompt="Completá con el artículo (o / a).")
cz(W, 1, "___ mel", "o", "Mel es masculino: o mel (la miel).",
   prompt="Completá con el artículo (o / a).")
cz(W, 2, "Não ___ problema. (hay)", "tem", "«No hay problema»: não tem problema (habla) o não há problema (formal).",
   alt=["há"])

tr(W, 0, "Los panes son grandes.", "Os pães são grandes.", [],
   "Pão → pães, como pan → panes.")
tr(W, 0, "Tengo dos hermanos.", "Tenho dois irmãos.", ["Eu tenho dois irmãos."],
   "Irmão → irmãos, como hermano → hermanos.")
tr(W, 0, "Los hombres están en casa.", "Os homens estão em casa.", ["Os homens tão em casa."],
   "Homem → homens (-m → -ns). Em casa = en casa (la propia), sin artículo.")
tr(W, 1, "La leche está fría.", "O leite está frio.", ["O leite está gelado."],
   "Leite es masculino: o leite, y el adjetivo concuerda: frio.")
tr(W, 1, "El viaje es caro.", "A viagem é cara.", [],
   "Viagem es femenino (todo -agem): a viagem é cara.")
tr(W, 1, "El puente es nuevo.", "A ponte é nova.", [],
   "Ponte es femenino: a ponte é nova.")
tr(W, 2, "Hay una farmacia aquí.", "Tem uma farmácia aqui.",
   ["Há uma farmácia aqui.", "Aqui tem uma farmácia.", "Aqui há uma farmácia."],
   "«Hay» se dice *tem* en el habla y *há* en la escritura formal; los dos van en singular. *Farmácia* lleva tilde porque termina en diptongo.")
tr(W, 2, "Hay mensajes nuevos.", "Tem mensagens novas.", ["Há mensagens novas.", "Tem novas mensagens.", "Há novas mensagens."],
   "Mensagem es femenino: mensagens novas. Plural -m → -ns.")

fx(W, 1, "genero", "A leite está quente.", "A leite", "O leite",
   "Leite es masculino en portugués: o leite.")
fx(W, 1, "genero", "O viagem é cara.", "O viagem", "A viagem",
   "Todas las palabras en -agem son femeninas: a viagem.")
fx(W, 0, "plural", "Tem três limãos.", "limãos", "limões",
   "Limão → limões, como limón → limones.")
fx(W, 2, "espanol", "Hay um boteco aqui.", "Hay", "Tem",
   "«Hay» no existe en portugués: tem (habla) o há (formal).", good_alt=["Há"])

gd(W, 0, [["limão", "limões"], ["estação", "estações"], ["avião", "aviões"]], "pão → ___", "pães", "pões",
   "La mayoría hace -ões, pero pão → pães. El español te da la pista: pan → panes.")
gd(W, 0, [["limão", "limões"], ["canção", "canções"], ["lição", "lições"]], "mão → ___", "mãos", "mões",
   "Mão → mãos, como mano → manos. Los que en español hacen -anos van a -ãos.")
gd(W, 0, [["animal", "animais"], ["jornal", "jornais"], ["hospital", "hospitais"]], "papel → ___", "papéis", "papais",
   "-al → -ais, pero -el → -éis, con tilde: papel → papéis. Papais son los papás.")

sc(W, 1, ["A viagem é cara.", "A mensagem é longa.", "A garagem é pequena.", "A paisagem é linda.", "A passagem é barata.", "A bagagem é pesada."],
   "¿Qué género tienen las palabras en -agem?",
   ["Son todas femeninas.", "Son masculinas, como en español (-aje).", "Depende de si son cosas concretas o abstractas."],
   "Son todas femeninas.",
   "-agem es siempre femenino, aunque en español -aje sea masculino: a viagem, a mensagem, a garagem.")
sc(W, 0, ["pão → pães (pan → panes)", "mão → mãos (mano → manos)", "limão → limões (limón → limones)",
          "alemão → alemães (alemán → alemanes)", "irmão → irmãos (hermano → hermanos)", "estação → estações (estación → estaciones)"],
   "¿Qué pista te da el español para el plural de -ão?",
   ["Si en español el plural es -anes, -ães; si es -anos, -ãos; si es -ones, -ões.",
    "Depende del género: los femeninos hacen -ãos y los masculinos, -ões o -ães (limões, pães).",
    "Las palabras cortas hacen -ães y las largas -ões."],
   "Si en español el plural es -anes, -ães; si es -anos, -ãos; si es -ones, -ões.",
   "El plural de -ão refleja la palabra latina, igual que el español: panes → pães, manos → mãos, limones → limões.")

ty(W, 0, "Escribí el plural de «homem».", "homem → ___", "homens",
   "-m → -ns: homem → homens. La m no puede ir antes de la s.")
ty(W, 0, "Escribí el plural de «mulher».", "mulher → ___", "mulheres",
   "-r → -es: mulher → mulheres.")

# ============================================================================
# Semana 3 — Artigos e contrações
# partes: 0 artículos · 1 contracciones · 2 nombres propios y ubicación
# ============================================================================
W = 3
ch(W, 0, "___ praias do Rio são lindas.", ["As", "Las", "Os"], "As",
   "Artículo femenino plural: as. «Las» no existe en portugués.")
ch(W, 0, "Tenho ___ amigos em Niterói.", ["uns", "unos", "umas"], "uns",
   "Indefinido masculino plural: uns (unos). Femenino: umas.")
ch(W, 0, "___ água de coco, por favor!", ["Uma", "Um", "Una"], "Uma",
   "Água es femenino: uma água. «Una» es español.")
ch(W, 0, "___ Cristo Redentor é lindo.", ["O", "El", "A"], "O",
   "Masculino singular: o. «El» no existe en portugués.")
ch(W, 1, "Estou ___ praia.", ["na", "em a", "no"], "na",
   "em + a = na, siempre contraído. Praia es femenino: na praia.")
ch(W, 1, "O hotel é perto ___ metrô.", ["do", "de o", "da"], "do",
   "de + o = do. Metrô es masculino: perto do metrô.")
ch(W, 1, "Vou ___ Maracanã.", ["ao", "a o", "à"], "ao",
   "a + o = ao. El Maracanã es masculino (o estádio): ao Maracanã.")
ch(W, 1, "Vou ___ praia.", ["à", "a", "á"], "à",
   "La preposición *a* + el artículo *a* se funden en *à*, con acento grave (la *crase*): *vou à praia*. Con acento agudo (*á*) no marca esta fusión: la crase siempre es grave (*à*).")
ch(W, 1, "Um passeio ___ calçadão.", ["pelo", "por o", "polo"], "pelo",
   "*Por* + artículo se contrae siempre: *pelo, pela, pelos, pelas*. ✗*por o* no existe, a diferencia del español «por el».")
ch(W, 1, "A casa ___ Bia é em Santa Teresa.", ["da", "de a", "do"], "da",
   "de + a = da: a casa da Bia. Bia lleva artículo femenino.")
ch(W, 1, "Estou ___ bar da Lapa.", ["num", "em o", "numa"], "num",
   "em + um = num (también em um). Bar es masculino: num bar.",
   prompt="«Estoy en un bar de Lapa.» Elegí la forma correcta.")
ch(W, 2, "A chave está em cima ___ mesa.", ["da", "de a", "de la"], "da",
   "Las locuciones con *de* contraen con el artículo: *em cima de* + *a mesa* da *em cima da mesa*. Es obligatorio, no como «de la» en español.")
ch(W, 2, "O gato está embaixo ___ cadeira.", ["da", "de", "na"], "da",
   "*Embaixo de* («debajo de») contrae su *de* con el artículo: *embaixo da cadeira*, *embaixo do sofá*. En portugués *de + a* nunca queda separado.")
ch(W, 2, "Estou ___ casa.", ["em", "na", "a"], "em",
   "«En casa» (la propia) va sin artículo: estou em casa. Na casa da Ana = en lo de Ana.",
   prompt="«Estoy en casa.» Elegí la forma correcta.")

cz(W, 0, "___ amiga da Bia é argentina.", "A", "Artículo femenino singular: a amiga.",
   prompt="Completá con el artículo.")
cz(W, 0, "Tem ___ padaria perto do hotel. (una)", "uma", "Indefinido femenino: uma padaria.")
cz(W, 1, "Estou ___ Rio. (em + o)", "no", "em + o = no. El Rio lleva artículo: no Rio.",
   prompt="Completá con la contracción correcta.")
cz(W, 1, "O Cristo ___ Corcovado. (de + o)", "do", "*De* + *o* se contrae siempre en *do* (y *da, dos, das*), incluso en nombres propios: *o Cristo do Corcovado*. El español solo contrae «del».",
   prompt="Completá con la contracción correcta.")
cz(W, 1, "Estamos ___ praias de Ipanema. (em + as)", "nas", "*Em* + artículo da *no, na, nos, nas*: *nas praias* «en las playas». La contracción es obligatoria; ✗*em as* no existe.",
   prompt="Completá con la contracción correcta.")
cz(W, 1, "A praia ___ Urca é pequena. (de + a)", "da", "de + a = da: a praia da Urca.",
   prompt="Completá con la contracción correcta.")
cz(W, 1, "Hoje tem um show. Você vai ___ show? (a + o)", "ao", "*A* + *o* se contrae en *ao* (plural *aos*), como nuestro «al»: *vou ao show*. En femenino es *à* (*vou à praia*).",
   prompt="Completá con la contracción correcta.")
cz(W, 1, "Às dez ela está ___ trabalho. (em + o)", "no", "em + o = no: no trabalho.",
   prompt="Completá con la contracción correcta.")
cz(W, 1, "Um passeio ___ praça. (por + a)", "pela", "*Por* + *a* da *pela* (y *pelo, pelos, pelas*): *um passeio pela praça*. En portugués se contrae siempre; en español «por la» queda separado.",
   prompt="Completá con la contracción correcta.")
cz(W, 1, "Tem um restaurante ___ prédio. (em + um)", "num", "*Em* se contrae también con el artículo indefinido: *num, numa, nuns, numas*. En la escritura se admite *em um*, pero en el habla se oye *num*.",
   alt=["em um"], prompt="Completá con la contracción correcta.")
cz(W, 2, "O hotel é perto ___ praia. (de + a)", "da", "*Perto de* («cerca de») contrae el *de* con el artículo: *perto da praia*, *perto do centro*. En español «cerca de la» queda separado.",
   prompt="Completá con la contracción correcta.")
cz(W, 2, "A padaria é ao lado ___ banco. (de + o)", "do", "*Ao lado de* («al lado de») contrae el *de* con el artículo: *ao lado do banco*, *ao lado da farmácia*. Fijate que *ao* ya es *a + o*.",
   prompt="Completá con la contracción correcta.")
cz(W, 2, "A chave está ___ mesa. (em + a)", "na", "em + a = na: na mesa.",
   prompt="Completá con la contracción correcta.")

tr(W, 0, "Es una playa linda.", "É uma praia linda.", ["É uma praia bonita.", "É uma linda praia."],
   "Indefinido femenino: uma. É lleva tilde (verbo ser).")
tr(W, 1, "Estoy en la playa.", "Estou na praia.", ["Eu estou na praia.", "Tô na praia.", "Eu tô na praia."],
   "*Em* + *a* se contrae en *na*: *estou na praia*. ✗*em a* no existe; con «estar en» el portugués usa siempre la contracción.")
tr(W, 1, "El hotel está en el centro.", "O hotel está no centro.",
   ["O hotel é no centro.", "O hotel fica no centro.", "O hotel está no Centro.", "O hotel é no Centro.", "O hotel fica no Centro."],
   "*Em* + *o* se contrae en *no*: *o hotel está no centro*. Para ubicar lugares fijos también se usa *ficar*: *o hotel fica no centro*.")
tr(W, 1, "Estamos en el bar de la esquina.", "Estamos no bar da esquina.",
   ["Nós estamos no bar da esquina.", "A gente está no bar da esquina.", "A gente tá no bar da esquina."],
   "Dos contracciones en la misma frase: *em + o* da *no* y *de + a* da *da*: *no bar da esquina*. El portugués contrae todos los artículos, no solo «al» y «del».")
tr(W, 1, "Es la playa de los cariocas.", "É a praia dos cariocas.", [],
   "*De* + *os* se contrae en *dos*: *a praia dos cariocas*. El español solo contrae «del»; el portugués contrae también plurales y femeninos.")
tr(W, 2, "João está en casa.", "O João está em casa.", ["João está em casa.", "O João tá em casa."],
   "En Río los nombres propios llevan artículo (o João). En casa = em casa, sin artículo.")
tr(W, 2, "La llave está arriba de la mesa.", "A chave está em cima da mesa.",
   ["A chave está sobre a mesa.", "A chave tá em cima da mesa."],
   "«Arriba de» se dice *em cima de*, y el *de* contrae: *em cima da mesa*. Lo contrario es *embaixo da mesa*.")
tr(W, 2, "El hotel está cerca de la playa.", "O hotel está perto da praia.",
   ["O hotel é perto da praia.", "O hotel fica perto da praia."],
   "*Perto de* contrae con el artículo que sigue: *perto da praia*, *perto do hotel*. En español «cerca de la» va separado; en portugués no.")

fx(W, 1, "contraccion", "Estou em a praia de Copacabana.", "em a", "na",
   "em + a se contrae siempre: na praia.")
fx(W, 1, "contraccion", "O Cristo de o Corcovado é lindo.", "de o", "do",
   "de + o se contrae siempre: do Corcovado.")
fx(W, 1, "contraccion", "Um passeio por o calçadão.", "por o", "pelo",
   "*Por* + *o* tiene que contraerse en *pelo*: *um passeio pelo calçadão*. ✗*por o* es error, aunque en español digamos «por el».")
fx(W, 0, "articulo", "La praia é linda.", "La", "A",
   "El artículo femenino es a: a praia. «La» no existe en portugués.")

gd(W, 1, [["de + o", "do"], ["de + a", "da"], ["em + o", "no"]], "por + o → ___", "pelo", "por o",
   "por también se contrae con el artículo, pero cambia de forma: pelo, pela, pelos, pelas.")
gd(W, 1, [["a + o", "ao"], ["a + os", "aos"], ["de + o", "do"]], "a + a → ___", "à", "a",
   "a + a se funde en una sola a con acento grave: à (la crase). Sin acento sería solo el artículo.")
gd(W, 0, [["o livro", "um livro"], ["o amigo", "um amigo"], ["o bar", "um bar"]], "a praia → ___", "uma praia", "una praia",
   "El indefinido femenino es uma, con m: uma praia. «Una» es la forma del español.")

sc(W, 1, ["Estou no Rio.", "Ela está na praia.", "Eles estão nos bares da Lapa.", "Estamos nas lojas.", "Estou em Copacabana.", "Ela está em casa."],
   "¿Cuándo «em» se convierte en no / na / nos / nas?",
   ["Cuando va seguido del artículo o, a, os, as.", "Cuando el lugar es una ciudad.", "Siempre, delante de cualquier lugar (em Copacabana → no Copacabana)."],
   "Cuando va seguido del artículo o, a, os, as.",
   "em se funde con el artículo que sigue. Si el lugar no lleva artículo (Copacabana, em casa), em queda solo.")
sc(W, 2, ["O João é carioca.", "A Bia está em casa.", "O Rafa tem dois irmãos.", "A Ana é de Rosario.", "A minha casa é em Botafogo.", "O meu amigo é baiano."],
   "¿Qué tienen en común estas frases de Río?",
   ["Los nombres propios y los posesivos llevan artículo.", "Los nombres de ciudad llevan artículo; los de persona, no.", "Solo los nombres de mujer llevan artículo."],
   "Los nombres propios y los posesivos llevan artículo.",
   "En Río y buena parte de Brasil se dice o João, a Bia, a minha casa. Es opcional, pero muy común.")

ty(W, 1, "Escribí la contracción de «de + as».", "de + as → ___", "das",
   "de + as = das: as praias das ilhas.")
ty(W, 1, "Escribí la contracción de «por + a».", "por + a → ___", "pela",
   "por + a = pela: pela manhã, pela praia.")

# ============================================================================
# Semana 4 — Adjetivos, cores e nacionalidades
# partes: 0 concordancia y plurales · 1 nacionalidades y colores · 2 muito y describir
# ============================================================================
W = 4
ch(W, 0, "As praias são ___.", ["lindas", "lindos", "linda"], "lindas",
   "El adjetivo concuerda en género y número: praias (fem. pl.) → lindas.")
ch(W, 0, "Os exercícios são ___.", ["fáceis", "fáciles", "fácils"], "fáceis",
   "-il átona → -eis: fácil → fáceis. «Fáciles» es español.")
ch(W, 0, "Ela tem olhos ___.", ["azuis", "azules", "azul"], "azuis",
   "-ul → -uis: azul → azuis.")
ch(W, 0, "Eles são ___.", ["felizes", "felices", "feliz"], "felizes",
   "-z → -zes: feliz → felizes. La z se mantiene (el español cambia a c).")
ch(W, 1, "A Lena é ___.", ["alemã", "alemana", "alemão"], "alemã",
   "-ão → -ã en el femenino: alemão → alemã.", prompt="«Lena es alemana.» Elegí la forma correcta.")
ch(W, 1, "Ela é ___.", ["inglesa", "inglêsa", "ingleza"], "inglesa",
   "-ês → -esa, sin circunflejo y con s: inglês → inglesa.", prompt="«Ella es inglesa.» Elegí la forma correcta.")
ch(W, 1, "Eles são ___.", ["espanhóis", "espanholes", "espanhols"], "espanhóis",
   "-ol → -óis: espanhol → espanhóis.", prompt="«Son españoles.» Elegí la forma correcta.")
ch(W, 1, "A camisa do Flamengo é ___ e preta.", ["vermelha", "roxa", "roja"], "vermelha",
   "Rojo es vermelho. Roxo es violeta: el falso amigo más peligroso de los colores.",
   prompt="«La camiseta del Flamengo es roja y negra.»")
ch(W, 1, "O açaí é ___.", ["roxo", "vermelho", "rojo"], "roxo",
   "Falso amigo de colores: *roxo* es «violeta, morado» (el color del *açaí*). «Rojo» se dice *vermelho*.", prompt="«El asaí es violeta.»")
ch(W, 1, "O céu está ___.", ["cinza", "gris", "cinzo"], "cinza",
   "Gris = cinza (de «ceniza»), que no cambia en masculino: o céu está cinza.",
   prompt="«El cielo está gris.»")
ch(W, 2, "A praia é ___ bonita.", ["muito", "muy", "muita"], "muito",
   "Ante adjetivo, muito es invariable y significa «muy». «Muy» no existe.")
ch(W, 2, "Tenho ___ amigas no Rio.", ["muitas", "muito", "muy"], "muitas",
   "Ante sustantivo, muito concuerda: muitas amigas.")
ch(W, 2, "Tem ___ gente na praia.", ["muita", "muito", "muy"], "muita",
   "Gente es femenino: muita gente.")
ch(W, 2, "Ele é ___.", ["chato", "pesado", "esquisito"], "chato",
   "*Chato* es «pesado, aburrido» (una persona que cansa), no «de nariz chata». *Esquisito* sería «raro».",
   prompt="«Él es un pesado.»")
ch(W, 2, "Ela é ___.", ["esquisita", "estrangeira", "exquisita"], "esquisita",
   "*Esquisito/a* es «raro, extraño». *Raro* se usa más para «poco frecuente»; para decir que alguien es extraño, *esquisito*.",
   prompt="«Ella es rara (extraña).»")

cz(W, 0, "As casas são ___. (branco)", "brancas", "Adjetivo en -o: cuatro formas. Casas (fem. pl.) → brancas.",
   prompt="Completá con la forma correcta del adjetivo.")
cz(W, 0, "Os carros são ___. (preto)", "pretos", "Carros (masc. pl.) → pretos.",
   prompt="Completá con la forma correcta del adjetivo.")
cz(W, 0, "Tenho dois gatos ___. (amarelo)", "amarelos", "Gatos (masc. pl.) → amarelos.",
   prompt="Completá con la forma correcta del adjetivo.")
cz(W, 0, "Os exercícios são ___. (difícil)", "difíceis", "-il átona → -eis: difícil → difíceis.",
   prompt="Completá con la forma correcta del adjetivo.")
cz(W, 0, "Os turistas são ___. (legal)", "legais", "-al → -ais: legal → legais.",
   prompt="Completá con la forma correcta del adjetivo.")
cz(W, 1, "Ela é ___. (português)", "portuguesa", "-ês → -esa, sin circunflejo: portuguesa.",
   prompt="Completá con la forma correcta del adjetivo.")
cz(W, 1, "Elas são ___. (francês)", "francesas", "francês → francesa → francesas.",
   prompt="Completá con la forma correcta del adjetivo.")
cz(W, 1, "Ela é ___. (brasileiro)", "brasileira", "-o → -a: brasileira. Gentilicios con minúscula.",
   prompt="Completá con la forma correcta del adjetivo.")
cz(W, 1, "Eles são ___. (alemão)", "alemães", "alemão → alemães (como alemanes).",
   prompt="Completá con la forma correcta del adjetivo.")
cz(W, 2, "Ela é ___ simpática. (muy)", "muito", "Ante adjetivo, muito no cambia: muito simpática.")
cz(W, 2, "Tem ___ turistas em Ipanema. (muchos)", "muitos", "Ante sustantivo, muito concuerda: muitos turistas.")
cz(W, 2, "Ele ___ olhos verdes. (ter)", "tem", "El aspecto físico se describe con ter: tem olhos verdes.")
cz(W, 2, "Hoje ela ___ cansada. (estar)", "está", "Un estado pasajero va con estar: está cansada.")

tr(W, 0, "Las playas son lindas.", "As praias são lindas.", ["As praias são bonitas."],
   "Adjetivo en femenino plural: lindas.")
tr(W, 0, "Los ejercicios son fáciles.", "Os exercícios são fáceis.", [],
   "fácil → fáceis. Exercício con x y c.")
tr(W, 1, "Ella es argentina y él es brasileño.", "Ela é argentina e ele é brasileiro.", [],
   "La conjunción es e (nunca «y»); brasileño = brasileiro.")
tr(W, 1, "Somos uruguayas.", "Somos uruguaias.", ["Nós somos uruguaias.", "A gente é uruguaia."],
   "Uruguaio → uruguaia: la y del español pasa a i.")
tr(W, 1, "La camiseta es roja.", "A camisa é vermelha.", ["A camiseta é vermelha."],
   "«Rojo» se dice *vermelho*, y concuerda: *a camisa é vermelha*. *Roxo* sería violeta, un falso amigo clásico para el hispanohablante.")
tr(W, 2, "Es muy linda.", "É muito linda.", ["Ela é muito linda.", "É muito bonita.", "Ela é muito bonita."],
   "«Muy» se dice *muito* y ante adjetivo es invariable: *muito linda*, *muito lindos*. El portugués no tiene una forma aparte para «muy».")
tr(W, 2, "Tengo muchos amigos.", "Tenho muitos amigos.", ["Eu tenho muitos amigos."],
   "Ante sustantivo, muito concuerda: muitos amigos.")
tr(W, 2, "Tiene ojos azules.", "Tem olhos azuis.", ["Ele tem olhos azuis.", "Ela tem olhos azuis.", "Você tem olhos azuis."],
   "El aspecto va con ter; azul → azuis.")

fx(W, 2, "muito", "A praia é muy bonita.", "muy", "muito",
   "«Muy» no existe en portugués: muito bonita.")
fx(W, 2, "muito", "Elas são muitas bonitas.", "muitas", "muito",
   "Ante adjetivo, muito es adverbio y no concuerda: muito bonitas.")
fx(W, 0, "plural", "Os exercícios são fáciles.", "fáciles", "fáceis",
   "fácil → fáceis: la l cae y entra -eis.")
fx(W, 1, "concordancia", "A Lena é alemão.", "alemão", "alemã",
   "El femenino de alemão es alemã.")

gd(W, 1, [["vermelho", "vermelhos"], ["amarelo", "amarelos"], ["preto", "pretos"]], "azul → ___", "azuis", "azules",
   "Los terminados en -l no agregan -es: la l cae y entra -is. azul → azuis, legal → legais.")
gd(W, 1, [["português", "portuguesa"], ["francês", "francesa"], ["inglês", "inglesa"]], "alemão → ___", "alemã", "alemana",
   "Los gentilicios en -ão hacen el femenino en -ã: alemão → alemã, cristão → cristã.")
gd(W, 0, [["fácil", "fáceis"], ["difícil", "difíceis"], ["útil", "úteis"]], "gentil → ___", "gentis", "genteis",
   "-il átona → -eis (fácil), pero -il tónica → -is: gentil → gentis, barril → barris.")

sc(W, 2, ["Ela é muito bonita.", "Eles são muito altos.", "Tenho muitos amigos.", "Tem muita gente aqui.", "Está muito calor.", "Ela tem muitas amigas."],
   "¿Cuándo cambia «muito»?",
   ["Cambia ante sustantivos (muitos amigos); ante adjetivos queda igual (muito bonita).",
    "Cambia siempre según el género y el número de lo que sigue (muitas bonitas, muitos altos).", "No cambia nunca."],
   "Cambia ante sustantivos (muitos amigos); ante adjetivos queda igual (muito bonita).",
   "*Muito* concuerda cuando acompaña a un sustantivo (*muitos amigos, muitas praias* «muchos, muchas») y queda invariable ante adjetivo (*muito bonita* «muy linda»).")
sc(W, 0, ["O Pedro é alto; a Bia é alta.", "O carro é branco; a casa é branca.", "O dia é alegre; a noite é alegre.",
          "O menino é feliz; a menina é feliz.", "O exercício é fácil; a lição é fácil.", "O bairro é tranquilo; a rua é tranquila."],
   "¿Qué adjetivos cambian del masculino al femenino?",
   ["Los terminados en -o; los en -e o consonante tienen una sola forma.",
    "Todos los adjetivos cambian en el femenino: -o → -a, -e → -a, consonante + -a.", "Solo los de colores."],
   "Los terminados en -o; los en -e o consonante tienen una sola forma.",
   "Como en español: alto/alta, pero alegre, feliz, fácil sirven para los dos géneros.")

ty(W, 2, "Escribí «muy» en portugués.", "«muy» → ___", "muito",
   "Muito es «muy» y «mucho». Se pronuncia «múinto», con nasal.")
ty(W, 1, "Escribí el femenino de «português».", "português → ___", "portuguesa",
   "-ês → -esa, sin circunflejo: portuguesa.")

# ============================================================================
# Semana 5 — Presente: verbos regulares
# partes: 0 conjugaciones, você, a gente · 1 pronombre sujeto y grafía · 2 trabajo y rutina
# ============================================================================
W = 5
ch(W, 0, "Você ___ português?", ["fala", "falas", "falás"], "fala",
   "Você lleva el verbo en tercera persona: você fala. «Falás» calca el voseo.")
ch(W, 0, "A gente ___ perto da praia.", ["mora", "moramos", "moram"], "mora",
   "A gente = nosotros, pero con el verbo en tercera del singular: a gente mora.")
ch(W, 0, "Eles ___ muito.", ["trabalham", "trabalhan", "trabalha"], "trabalham",
   "Tercera del plural en -am (con m): eles trabalham.")
ch(W, 0, "Nós ___ açaí.", ["comemos", "comimos", "comamos"], "comemos",
   "comer: nós comemos, como en español.")
ch(W, 0, "Vocês ___ no Leblon?", ["moram", "moran", "mora"], "moram",
   "Vocês conjuga como eles: vocês moram.")
ch(W, 0, "Ela ___ a loja às nove.", ["abre", "abrem", "abro"], "abre",
   "abrir en presente: eu abro, ela abre, elas abrem.")
ch(W, 1, "Eu ___ o Rio muito bem.", ["conheço", "conhezco", "conheco"], "conheço",
   "conhecer → eu conheço: c → ç ante o para conservar el sonido s.")
ch(W, 1, "Eu ___ um táxi.", ["dirijo", "dirigo", "dirijio"], "dirijo",
   "dirigir → eu dirijo: g → j ante o. Dirigir = manejar.")
ch(W, 2, "Sou ___.", ["engenheira", "uma engenheira", "a engenheira"], "engenheira",
   "La profesión con ser va sin artículo: sou engenheira.", prompt="«Soy ingeniera.»")
ch(W, 2, "Trabalho num ___.", ["escritório", "oficina", "ofício"], "escritório",
   "Falso amigo: *escritório* es la «oficina» de trabajo; *oficina* es el «taller mecánico». Trabajás *num escritório*.", prompt="«Trabajo en una oficina.»")
ch(W, 2, "Eu ___ cedo.", ["acordo", "despierto", "acorda"], "acordo",
   "Acordar = despertarse, sin pronombre: eu acordo cedo. *Despierto* es español.", prompt="«Me despierto temprano.»")
ch(W, 2, "Eu ___ ao meio-dia.", ["almoço", "almorzo", "almoça"], "almoço",
   "almoçar → eu almoço, con ç.", prompt="«Almuerzo al mediodía.»")
ch(W, 2, "___ noite a gente janta em casa.", ["À", "A", "Na"], "À",
   "«A la noche» se dice *à noite*, con *crase* (*a + a*); igual *à tarde*. Pero «a la mañana» es *de manhã*, con *de*.")

cz(W, 0, "Eu ___ em Copacabana. (morar)", "moro", "morar = vivir (en un lugar): eu moro.",
   prompt="Completá con el presente.")
cz(W, 0, "Você ___ muito. (trabalhar)", "trabalha", "Você + tercera persona: trabalha.",
   prompt="Completá con el presente.")
cz(W, 0, "Nós ___ português. (estudar)", "estudamos", "nós → -amos: estudamos.",
   prompt="Completá con el presente.")
cz(W, 0, "Eles ___ cerveja no boteco. (beber)", "bebem", "eles → -em: bebem.",
   prompt="Completá con el presente.")
cz(W, 0, "A gente ___ no calçadão. (correr)", "corre", "a gente + tercera del singular: corre.",
   prompt="Completá con el presente.")
cz(W, 0, "Vocês ___ a porta? (abrir)", "abrem", "vocês → -em en los verbos en -ir: abrem.",
   prompt="Completá con el presente.")
cz(W, 0, "Ela ___ para Buenos Aires amanhã. (partir)", "parte", "partir: ela parte.",
   prompt="Completá con el presente.")
cz(W, 1, "Eu ___ a Lapa. (conhecer)", "conheço", "conhecer → conheço (c → ç).",
   prompt="Completá con el presente.")
cz(W, 1, "Eu ___ o exercício. (corrigir)", "corrijo", "corrigir → corrijo (g → j).",
   prompt="Completá con el presente.")
cz(W, 1, "Eu ___ em casa hoje. (ficar)", "fico", "ficar → fico: ante o la c ya suena k, no cambia.",
   prompt="Completá con el presente.")
cz(W, 2, "Eu ___ às sete todo dia. (acordar)", "acordo", "acordar = despertarse: eu acordo.",
   prompt="Completá con el presente.")
cz(W, 2, "A gente ___ às nove da noite. (jantar)", "janta", "«Cenar» es *jantar* (y «almorzar», *almoçar*); son verbos regulares en -ar. Con *a gente* el verbo va en 3.ª persona singular: *a gente janta*.",
   prompt="Completá con el presente.")
cz(W, 2, "Ela trabalha ___ garçonete. (de)", "como", "Trabajar «de» algo: trabalhar como (o de) garçonete.",
   alt=["de"])
cz(W, 2, "Ela ___ num banco. (trabalhar)", "trabalha", "trabalhar: ela trabalha.",
   prompt="Completá con el presente.")

tr(W, 0, "¿Hablás portugués?", "Você fala português?", ["Tu falas português?", "Tu fala português?"],
   "Você + tercera persona: você fala.")
tr(W, 0, "Vivimos en Botafogo.", "A gente mora em Botafogo.", ["Nós moramos em Botafogo.", "Moramos em Botafogo."],
   "«Vivir en un lugar» se dice *morar em*: *a gente mora em Botafogo*. *Viver* se usa para «vivir» en sentido general (*viver bem*).")
tr(W, 0, "Ellos trabajan mucho.", "Eles trabalham muito.", ["Elas trabalham muito."],
   "eles trabalham (-am); mucho = muito.")
tr(W, 0, "¿Ustedes comen carne?", "Vocês comem carne?", [],
   "vocês + tercera del plural: comem.")
tr(W, 1, "Conozco Río.", "Eu conheço o Rio.", ["Conheço o Rio.", "Eu conheço o Rio de Janeiro.", "Conheço o Rio de Janeiro."],
   "conhecer → conheço. El Rio lleva artículo y no hay «a» personal ni de lugar.")
tr(W, 2, "Soy profesor.", "Sou professor.", ["Eu sou professor."],
   "Profesión sin artículo: sou professor. Professor con ss.")
tr(W, 2, "Me despierto temprano.", "Eu acordo cedo.", ["Acordo cedo."],
   "«Despertarse» es *acordar*, sin pronombre reflexivo: *eu acordo cedo*. «Temprano» es *cedo*; y ojo, *acordar* no es «acordar» (eso es *combinar*).")
tr(W, 2, "A la noche cenamos en casa.", "À noite a gente janta em casa.",
   ["À noite nós jantamos em casa.", "À noite jantamos em casa.", "A gente janta em casa à noite.",
    "Nós jantamos em casa à noite.", "Jantamos em casa à noite."],
   "«A la noche» es *à noite*, con *crase*; «cenar» es *jantar*. Con *a gente* («nosotros» coloquial) el verbo va en 3.ª singular: *a gente janta*.")

fx(W, 0, "persona", "Você falas muito bem.", "falas", "fala",
   "Con você, tercera persona: você fala.")
fx(W, 0, "persona", "A gente moramos em Niterói.", "moramos", "mora",
   "A gente lleva el verbo en tercera del singular: a gente mora.")
fx(W, 1, "ortografia", "Eu conhezco a Lapa.", "conhezco", "conheço",
   "conhecer → conheço: solo c → ç, sin la z del español.")
fx(W, 2, "falso_amigo", "Ela trabalha numa oficina de advogados.", "numa oficina", "num escritório",
   "La oficina de trabajo es escritório; oficina es un taller mecánico.")

gd(W, 1, [["comer", "eu como"], ["beber", "eu bebo"], ["vender", "eu vendo"]], "conhecer → eu ___", "conheço", "conheco",
   "Para que la c siga sonando s ante o, se escribe ç: conheço, esqueço, ofereço.")
gd(W, 1, [["partir", "eu parto"], ["abrir", "eu abro"], ["decidir", "eu decido"]], "dirigir → eu ___", "dirijo", "dirigo",
   "Para que la g siga sonando como en gente ante o, se escribe j: dirijo, corrijo, exijo.")
gd(W, 0, [["ele", "fala"], ["ela", "fala"], ["você", "fala"]], "a gente → ___", "fala", "falamos",
   "A gente significa «nosotros», pero gramaticalmente es tercera del singular: a gente fala.")

sc(W, 0, ["Você mora no Rio?", "Ele mora no Rio.", "Vocês moram no Rio?", "Eles moram no Rio.", "Eu moro no Rio.", "Nós moramos no Rio."],
   "¿Con qué forma van «você» y «vocês»?",
   ["«você» como «ele» y «vocês» como «eles».", "«você» y «vocês» tienen formas propias, como «vos» y «ustedes».",
    "«você» como «eu» y «vocês» como «nós»."],
   "«você» como «ele» y «vocês» como «eles».",
   "você y vocês conjugan en tercera persona: você mora, vocês moram.")
sc(W, 0, ["A gente mora aqui.", "A gente come muito.", "A gente trabalha cedo.", "Nós moramos aqui.", "Nós comemos muito.", "Nós trabalhamos cedo."],
   "¿Qué cambia entre «a gente» y «nós»?",
   ["El significado es el mismo, pero «a gente» lleva el verbo en tercera del singular.",
    "«a gente» significa «la gente» y «nós», «nosotros».",
    "El significado es el mismo y los dos llevan el verbo en primera del plural (moramos)."],
   "El significado es el mismo, pero «a gente» lleva el verbo en tercera del singular.",
   "a gente es el «nosotros» del habla: a gente mora = nós moramos.")

ty(W, 0, "Escribí la forma de «falar» para «eles».", "eles ___", "falam",
   "Tercera del plural: falam, con m final nasal.")
ty(W, 1, "Escribí la forma de «conhecer» para «eu».", "eu ___", "conheço",
   "c → ç ante o: conheço.")

# ============================================================================
# Semana 6 — Presente: verbos irregulares
# partes: 0 ir, vir, fazer, dizer, trazer · 1 poder … pedir · 2 sin diptongos e invitaciones
# ============================================================================
W = 6
ch(W, 0, "Eles ___ à praia.", ["vão", "van", "vai"], "vão",
   "ir: eu vou, ele vai, nós vamos, eles vão.")
ch(W, 0, "Você ___ à festa?", ["vem", "viene", "vens"], "vem",
   "vir: você vem (tercera). Vens es la forma de tu.")
ch(W, 0, "Eu ___ ioga no Arpoador.", ["faço", "fago", "fazo"], "faço",
   "fazer → eu faço, con ç.")
ch(W, 0, "Eu ___ o violão.", ["trago", "traigo", "trazo"], "trago",
   "trazer → eu trago, sin la i del español.", prompt="«Yo traigo la guitarra.»")
ch(W, 0, "Ele ___ que sim.", ["diz", "dice", "dize"], "diz",
   "dizer → ele diz: pierde la -e y termina en z.")
ch(W, 1, "Você ___ vir hoje?", ["pode", "puede", "podes"], "pode",
   "poder no diptonga: pode, nunca «puede». Podes es de tu.")
ch(W, 1, "Ela ___ um mate.", ["quer", "quiere", "quere"], "quer",
   "querer → ela quer: sin diptongo y sin -e final.")
ch(W, 1, "Eu não ___.", ["sei", "sé", "sabo"], "sei",
   "saber → eu sei.", prompt="«No sé.»")
ch(W, 1, "Eu ___ o Cristo da janela.", ["vejo", "veo", "vio"], "vejo",
   "ver → eu vejo.", prompt="«Veo el Cristo desde la ventana.»")
ch(W, 1, "Eles ___ o jornal.", ["leem", "lêem", "leen"], "leem",
   "ler → eles leem. Desde el Acuerdo de 1990, leem y veem van sin circunflejo.")
ch(W, 1, "Eu ___ de casa às oito.", ["saio", "salgo", "sao"], "saio",
   "sair → eu saio (salgo).")
ch(W, 1, "Eu ___ um chope.", ["peço", "pido", "pedo"], "peço",
   "pedir → eu peço (pido).")
ch(W, 2, "Ela ___ pouco.", ["dorme", "duerme", "durme"], "dorme",
   "dormir no diptonga: ela dorme. Solo eu cambia: durmo.")
ch(W, 2, "Eu ___ praia.", ["prefiro", "prefero", "prefiero"], "prefiro",
   "preferir → eu prefiro (e → i solo en eu); ela prefere.")
ch(W, 2, "O bondinho ___ o morro.", ["sobe", "sube", "subi"], "sobe",
   "subir → eu subo, ele sobe, eles sobem.", prompt="«El teleférico sube el cerro.»")
ch(W, 2, "Não posso, ___ que trabalhar.", ["tenho", "tengo", "estou"], "tenho",
   "Tener que = ter que: tenho que trabalhar.")

cz(W, 0, "Nós ___ à Lapa hoje. (ir)", "vamos", "ir: nós vamos.", prompt="Completá con el presente.")
cz(W, 0, "Eles ___ de São Paulo. (vir)", "vêm", "vir: ele vem, eles vêm (con circunflejo).",
   prompt="Completá con el presente.")
cz(W, 0, "O que você ___ no sábado? (fazer)", "faz", "fazer: você faz.", prompt="Completá con el presente.")
cz(W, 0, "Eu sempre ___ a verdade. (dizer)", "digo", "dizer → eu digo.", prompt="Completá con el presente.")
cz(W, 1, "Eu não ___ ir. (poder)", "posso", "poder → eu posso, con ss.", prompt="Completá con el presente.")
cz(W, 1, "Eu ___ um açaí. (querer)", "quero", "querer → eu quero.", prompt="Completá con el presente.")
cz(W, 1, "Eu ___ aula de espanhol. (dar)", "dou", "dar → eu dou.", prompt="Completá con el presente.")
cz(W, 1, "Onde eu ___ a mala? (pôr)", "ponho", "pôr → eu ponho. En el habla también coloco o boto.",
   alt=["coloco", "boto"], prompt="Completá con el presente.")
cz(W, 1, "Eu ___ samba no carro. (ouvir)", "ouço", "ouvir → eu ouço.", prompt="Completá con el presente.")
cz(W, 1, "Vocês ___ cedo? (sair)", "saem", "sair: eles / vocês saem.", prompt="Completá con el presente.")
cz(W, 2, "Eu ___ cedo, mas ela dorme tarde. (dormir)", "durmo", "dormir → eu durmo, ela dorme.",
   prompt="Completá con el presente.")
cz(W, 2, "Ela ___ o Leblon. (preferir)", "prefere", "preferir → ela prefere (sin diptongo).",
   prompt="Completá con el presente.")

tr(W, 0, "Voy al Maracaná.", "Vou ao Maracanã.", ["Eu vou ao Maracanã.", "Vou no Maracanã.", "Eu vou no Maracanã."],
   "ir → vou; a + o = ao (en el habla, vou no).")
tr(W, 0, "¿Qué hacés el sábado?", "O que você faz no sábado?",
   ["O que tu fazes no sábado?", "O que você faz sábado?", "Você faz o que no sábado?"],
   "fazer → você faz. El sábado = no sábado.")
tr(W, 1, "No puedo salir hoy.", "Não posso sair hoje.", ["Eu não posso sair hoje.", "Hoje não posso sair.", "Hoje eu não posso sair."],
   "poder → posso.")
tr(W, 1, "¿Querés un mate?", "Você quer um mate?", ["Quer um mate?", "Tu queres um mate?"],
   "querer → você quer, sin diptongo.")
tr(W, 1, "No sé.", "Não sei.", ["Eu não sei."], "saber → eu sei.")
tr(W, 1, "Pido una cerveza.", "Peço uma cerveja.", ["Eu peço uma cerveja."],
   "pedir → peço; cerveza = cerveja.")
tr(W, 2, "Duermo mucho.", "Durmo muito.", ["Eu durmo muito."],
   "dormir → eu durmo; mucho = muito.")
tr(W, 2, "¿Vamos a la playa?", "Vamos à praia?", ["Bora pra praia?", "Vamos pra praia?", "Vamos para a praia?"],
   "a + a = à. En el habla: vamos pra praia?, bora?")

fx(W, 1, "verbo_irregular", "Você puede vir amanhã?", "puede", "pode",
   "poder no diptonga: você pode.")
fx(W, 2, "verbo_irregular", "Ela duerme muito.", "duerme", "dorme",
   "dormir no diptonga: ela dorme.")
fx(W, 0, "verbo_irregular", "Eu fago o jantar.", "fago", "faço",
   "fazer → eu faço.")
fx(W, 1, "verbo_irregular", "Eu salgo às oito.", "salgo", "saio",
   "sair → eu saio.")

gd(W, 1, [["falar", "eu falo"], ["morar", "eu moro"], ["trabalhar", "eu trabalho"]], "dar → eu ___", "dou", "do",
   "dar es irregular en eu: dou (como vou, de ir). «Do» es de + o.")
gd(W, 1, [["abrir", "eu abro"], ["partir", "eu parto"], ["decidir", "eu decido"]], "ouvir → eu ___", "ouço", "ouvo",
   "ouvir → eu ouço (ele ouve). Como el español «oigo», es irregular solo en eu.")
gd(W, 1, [["abrir", "eu abro"], ["partir", "eu parto"], ["decidir", "eu decido"]], "pedir → eu ___", "peço", "pedo",
   "pedir → eu peço (ele pede). Ni «pido» ni «pedo»: la d pasa a ç en eu.")

sc(W, 2, ["Eu durmo cedo.", "Ela dorme cedo.", "Eu prefiro praia.", "Ele prefere praia.", "Eu sinto frio.", "Você sente frio."],
   "¿Dónde cambia la vocal de la raíz?",
   ["Solo en «eu»: durmo, prefiro; en «ele» vuelve la vocal del infinitivo.",
    "En todas las personas, como en español: eu durmo, ele durme, você sinte.", "Solo en «ele»."],
   "Solo en «eu»: durmo, prefiro; en «ele» vuelve la vocal del infinitivo.",
   "El portugués no diptonga: ela dorme, ele prefere. La vocal cambia solo en eu.")
sc(W, 0, ["Eu faço.", "Ele faz.", "Eu digo.", "Ele diz.", "Eu trago.", "Ele traz."],
   "¿Qué tienen en común fazer, dizer y trazer?",
   ["El «eu» es irregular y el «ele» termina en -z.", "Son regulares, como comer.", "Diptongan en «ele», como en español."],
   "El «eu» es irregular y el «ele» termina en -z.",
   "faço / faz, digo / diz, trago / traz: eu irregular y ele sin -e final.")

ty(W, 0, "Escribí la forma de «ir» para «eles».", "eles ___", "vão", "ir: eles vão (ão nasal).")
ty(W, 1, "Escribí la forma de «pôr» para «eu».", "eu ___", "ponho", "pôr → eu ponho, ele põe.")

# ============================================================================
# Semana 7 — Números, horas e datas
# partes: 0 números · 1 días, meses, fechas · 2 hora, precios, teléfono
# ============================================================================
W = 7
ch(W, 0, "16 → ___", ["dezesseis", "dezeseis", "dieciseis"], "dezesseis",
   "Los números 16, 17 y 19 se escriben con *dez-* + *e* + unidad (*dezesseis*, *dezessete*, *dezenove*): *dezesseis* lleva doble *s* para que suene [s] entre vocales. El 18 es *dezoito*, sin *e*. Nada de *dieci-* como en español.", prompt="¿Cómo se escribe el número?")
ch(W, 0, "19 → ___", ["dezenove", "dezenueve", "diecinove"], "dezenove",
   "19 = dezenove: dez + e + nove.", prompt="¿Cómo se escribe el número?")
ch(W, 0, "500 → ___", ["quinhentos", "cincocentos", "quinientos"], "quinhentos",
   "Las centenas cambian respecto del español: 500 es *quinhentos*, con *nh* (que suena como nuestra ñ). ✗*cincocentos* no existe.", prompt="¿Cómo se escribe el número?")
ch(W, 0, "50 → ___", ["cinquenta", "cincuenta", "cinqüenta"], "cinquenta",
   "50 es *cinquenta*, con *qu* que suena [kw]; desde el Acuerdo Ortográfico de 1990 ya no lleva diéresis (✗*cinqüenta*).", prompt="¿Cómo se escribe el número?")
ch(W, 0, "___ cervejas, por favor.", ["Duas", "Dois", "Dos"], "Duas",
   "Dois tiene femenino: duas cervejas.", prompt="«Dos cervezas, por favor.»")
ch(W, 0, "___ pessoas", ["duzentas", "duzentos", "doscentas"], "duzentas",
   "Las centenas concuerdan: duzentas pessoas.", prompt="«200 personas»")
ch(W, 0, "___ reais", ["cem", "cento", "cien"], "cem",
   "100 justo = cem; cento solo va seguido de algo: cento e dez.", prompt="«100 reales»")
ch(W, 1, "___ segunda eu trabalho.", ["Na", "No", "Em"], "Na",
   "Segunda(-feira) es femenino: na segunda.", prompt="«El lunes trabajo.»")
ch(W, 1, "___ sábado tem feira.", ["No", "Na", "Em o"], "No",
   "Sábado es masculino: no sábado.", prompt="«El sábado hay feria.»")
ch(W, 1, "«jueves» → ___", ["quinta-feira", "quarta-feira", "terça-feira"], "quinta-feira",
   "Se cuenta desde el domingo: segunda (lunes), terça, quarta, quinta (jueves), sexta.",
   prompt="¿Cómo se dice «jueves»?")
ch(W, 1, "___ de maio", ["primeiro", "um", "uno"], "primeiro",
   "El día 1 se dice con ordinal: primeiro de maio. Los demás, cardinales.", prompt="«1.º de mayo»")
ch(W, 2, "Que horas são? — ___ uma hora.", ["É", "São", "Está"], "É",
   "Con una hora, singular: é uma hora. Con las demás, são.")
ch(W, 2, "A festa começa ___ dez.", ["às", "as", "a las"], "às",
   "Para la hora, «a las» se dice *às* (*a + as*, con *crase*): *começa às dez*. Sin acento, *as* sería solo el artículo.")
ch(W, 2, "___ para as oito.", ["Quinze", "Quarto", "Um quarto"], "Quinze",
   "«Menos cuarto» = quinze para as…: quinze para as oito.", prompt="«Las ocho menos cuarto.»")
ch(W, 2, "Meu número é nove, ___, dois…", ["meia", "meio", "média"], "meia",
   "Al dictar números, 6 se dice meia (de meia dúzia).", prompt="«Mi número es 9-6-2…»")

cz(W, 0, "Tenho ___ anos. (18)", "dezoito", "18 es *dezoito*: el portugués junta *dez* + *oito* sin la *y* que tenemos en «dieciocho». La edad se dice con *ter*: *tenho dezoito anos*.", prompt="Escribí el número en letras.")
cz(W, 0, "São ___ reais. (22)", "vinte e dois", "22 = vinte e dois: decena + e + unidad.",
   prompt="Escribí el número en letras.")
cz(W, 0, "Tem ___ pessoas. (21)", "vinte e uma", "Pessoas es femenino: vinte e uma pessoas.",
   prompt="Escribí el número en letras.")
cz(W, 0, "O açaí custa ___ reais. (15)", "quinze", "15 es *quinze*, con *z* que suena [z] sonora. Los precios en reales: *custa quinze reais* (plural de *real*).", prompt="Escribí el número en letras.")
cz(W, 0, "Moro no número ___. (300)", "trezentos", "300 es *trezentos*, con *z* (suena [z]), no *trescientos*. Las centenas concuerdan en género: *trezentas pessoas*.", prompt="Escribí el número en letras.")
cz(W, 0, "Quero ___ águas de coco. (2)", "duas", "Água es femenino: duas águas.", prompt="Escribí el número en letras.")
cz(W, 1, "O carnaval é ___ fevereiro.", "em", "Los meses van con em, sin artículo: em fevereiro.")
cz(W, 1, "Hoje é ___ 15 de março. (el día)", "dia", "Fechas: hoje é dia 15 de março.")
cz(W, 1, "Sexta-___ tem samba.", "feira", "Los días de lunes a viernes llevan -feira: sexta-feira.")
cz(W, 2, "___ duas horas. (ser)", "São", "Con más de una hora: são duas horas.")
cz(W, 2, "O museu abre ___ uma. (a la)", "à", "«A la una» es *à uma*: la preposición *a* se funde con el artículo femenino *a* (*crase*). Las demás horas van en plural: *às duas*.")
cz(W, 2, "É meio-dia e ___. (12:30)", "meia", "Y media = e meia (meia hora): meio-dia e meia.")
cz(W, 2, "Quanto ___ o mate? (custar)", "custa", "Para preguntar el precio se usa *custar*: *quanto custa o mate?* «¿cuánto sale / cuesta?». No se usa *sair* en este sentido.")

tr(W, 0, "Tengo veintiún años.", "Tenho vinte e um anos.", ["Eu tenho vinte e um anos."],
   "21 = vinte e um; ano es masculino.")
tr(W, 0, "Dos cervezas, por favor.", "Duas cervejas, por favor.", ["Por favor, duas cervejas."],
   "Cerveja es femenino: duas.")
tr(W, 1, "Hoy es martes.", "Hoje é terça-feira.", ["Hoje é terça."],
   "Los días de semana se cuentan: *segunda-feira* (lunes), *terça-feira* (martes)... Solo *sábado* y *domingo* tienen nombre propio, como en español.")
tr(W, 1, "El sábado hay feria.", "No sábado tem feira.", ["No sábado há feira.", "Sábado tem feira.", "Sábado há feira."],
   "«El sábado» (cuándo) se dice *no sábado*, con *em + o*: el portugués pone preposición donde el español no. «Hay» es *tem* en el habla, *há* en la escritura.")
tr(W, 1, "El carnaval es en febrero.", "O carnaval é em fevereiro.", ["O Carnaval é em fevereiro."],
   "Meses con em y minúscula: em fevereiro.")
tr(W, 2, "Son las tres y media.", "São três e meia.", ["São três horas e meia.", "São três e trinta."],
   "La hora va con *ser* sin artículo: *são três e meia* «son las tres y media». Para la una, singular: *é uma hora*.")
tr(W, 2, "¿Cuánto sale?", "Quanto custa?", ["Quanto é?"], "Quanto custa? o quanto é?")
tr(W, 2, "La fiesta empieza a las diez.", "A festa começa às dez.", ["A festa começa às dez horas."],
   "«A las diez» es *às dez*: preposición *a* + artículo *as* con acento grave (*crase*). El artículo es obligatorio, como en español.")

fx(W, 0, "concordancia", "Dois cervejas, por favor.", "Dois", "Duas",
   "Cerveja es femenino: duas cervejas.")
fx(W, 2, "crase", "A aula começa as oito.", "as oito", "às oito",
   "«A las ocho» = às oito: a + as lleva acento grave.")
fx(W, 0, "concordancia", "Tem vinte e um pessoas na fila.", "vinte e um", "vinte e uma",
   "El um de vinte e um concuerda con el sustantivo: vinte e uma pessoas.")
fx(W, 1, "contraccion", "Em o sábado tem feira.", "Em o", "No",
   "em + o = no: no sábado.")

gd(W, 0, [["21 livros", "vinte e um livros"], ["31 dias", "trinta e um dias"], ["41 anos", "quarenta e um anos"]],
   "21 casas → ___ casas", "vinte e uma", "vinte e um",
   "Con sustantivo femenino, el um final pasa a uma: vinte e uma casas.")
gd(W, 0, [["200", "duzentos"], ["300", "trezentos"], ["400", "quatrocentos"]], "500 → ___", "quinhentos", "cincocentos",
   "500 no sigue el patrón: quinhentos (como el español «quinientos», irregular).")
gd(W, 1, [["lunes", "segunda-feira"], ["martes", "terça-feira"], ["miércoles", "quarta-feira"]], "sábado → ___", "sábado", "sábado-feira",
   "Solo de lunes a viernes se usa -feira. Sábado y domingo se dicen como en español.")

sc(W, 2, ["É uma hora.", "São duas horas.", "São três e meia.", "É meio-dia.", "São dez horas.", "É meia-noite."],
   "¿Cuándo va «é» y cuándo «são»?",
   ["«É» con una hora, mediodía y medianoche; «são» con las demás.",
    "«É» para las horas de la mañana y «são» para las de la tarde y la noche.", "«São» siempre, como «son las»."],
   "«É» con una hora, mediodía y medianoche; «são» con las demás.",
   "El verbo concuerda con el número: é uma hora, é meio-dia; são duas, são dez.")
sc(W, 0, ["uma cerveja", "duas cervejas", "um chope", "dois chopes", "duzentas pessoas", "duzentos reais"],
   "¿Qué números cambian según el género?",
   ["um/uma, dois/duas y las centenas (duzentos/duzentas).", "Todos los números.", "Solo um/uma; dois y las centenas quedan iguales (dois cervejas)."],
   "um/uma, dois/duas y las centenas (duzentos/duzentas).",
   "Como en español (un/una, doscientos/as), pero además dois/duas.")

ty(W, 0, "Escribí 17 en letras.", "17 → ___", "dezessete", "Del 16 al 19, *dez-* se une a la unidad: *dezessete* (17), con doble *s* para que suene [s]. En español decimos «diecisiete».")
ty(W, 0, "Escribí 700 en letras.", "700 → ___", "setecentos", "700 es *setecentos*: el portugués usa *sete* entero, donde el español dice «setecientos» con *-cientos*.")

# ============================================================================
# Semana 8 — Perguntas, ir + infinitivo e estar + gerúndio
# partes: 0 preguntas y porquê · 1 ir + infinitivo · 2 gerúndio
# ============================================================================
W = 8
ch(W, 0, "___ você faz?", ["O que", "Que", "Qué"], "O que",
   "«¿Qué…?» suele ser o que…?, sin tilde.", prompt="«¿Qué hacés?»")
ch(W, 0, "___ é o seu telefone?", ["Qual", "O que", "Cuál"], "Qual",
   "Para pedir un dato de una lista (nombre, teléfono): qual é…?")
ch(W, 0, "___ anos você tem?", ["Quantos", "Quanto", "Cuántos"], "Quantos",
   "Quanto concuerda con el sustantivo: quantos anos.")
ch(W, 0, "___ é ele? — É o meu irmão.", ["Quem", "Quê", "Que"], "Quem",
   "«¿Quién?» es *quem*, invariable (no tiene plural como «quiénes»); la *m* final solo nasaliza la vocal.")
ch(W, 0, "___ você é? — De Mendoza.", ["De onde", "Onde", "Aonde"], "De onde",
   "Origen: de onde você é?")
ch(W, 0, "___ você está aqui? — Porque tenho férias.", ["Por que", "Porque", "Por quê"], "Por que",
   "Pregunta al comienzo: por que, separado.")
ch(W, 0, "Você não vem? ___?", ["Por quê", "Por que", "Porque"], "Por quê",
   "Al final de la frase, antes del signo: por quê, con circunflejo.")
ch(W, 0, "Não vou ___ estou cansado.", ["porque", "por que", "por quê"], "porque",
   "Causa en la respuesta: porque, junto.")
ch(W, 1, "Amanhã eu ___ viajar.", ["vou", "vou a", "voy"], "vou",
   "ir + infinitivo sin «a»: vou viajar.")
ch(W, 1, "A gente ___ comer na feira.", ["vai", "vamos", "vai a"], "vai",
   "a gente + tercera singular: a gente vai comer.")
ch(W, 2, "Estou ___ uma tapioca.", ["comendo", "comiendo", "comindo"], "comendo",
   "-er → -endo: comendo.")
ch(W, 2, "O que vocês estão ___?", ["fazendo", "haciendo", "fazindo"], "fazendo",
   "fazer → fazendo (raíz del infinitivo + -endo).")
ch(W, 2, "Ela está ___.", ["dormindo", "durmindo", "durmiendo"], "dormindo",
   "El gerúndio no cambia la vocal: dormir → dormindo.")
ch(W, 2, "Onde você está ___?", ["indo", "yendo", "iendo"], "indo",
   "ir → indo.")

cz(W, 0, "___ você mora? (dónde)", "Onde", "«¿Dónde?» es *onde*, sin la *d* inicial del español. Con verbos de movimiento se usa *aonde*: *aonde você vai?*")
cz(W, 0, "___ custa? (cuánto)", "Quanto", "«¿Cuánto?» es *quanto*, que concuerda como en español (*quanta, quantos, quantas*): *quanto custa?* «¿cuánto cuesta?».")
cz(W, 0, "___ é a sua cidade? (cuál)", "Qual", "«¿Cuál es...?» se dice *qual é...?*; en plural, *quais são...?* Para «¿qué es?» se usa *o que é?*")
cz(W, 0, "Por que você não vem? — ___ tenho aula.", "Porque", "En la respuesta, porque va junto.")
cz(W, 1, "No sábado eu ___ ficar em casa. (ir)", "vou", "ir + infinitivo: vou ficar.")
cz(W, 1, "Eles ___ ver o jogo. (ir)", "vão", "eles vão + infinitivo.")
cz(W, 1, "O que você ___ fazer no fim de semana? (ir)", "vai", "você vai + infinitivo.")
cz(W, 1, "No domingo vai ___ churrasco. (haber)", "ter", "En el habla, «haber» existencial se dice con *ter*: *vai ter churrasco* «va a haber asado». En la escritura, *vai haver*.",
   alt=["haver"])
cz(W, 2, "Ela está ___ agora. (trabalhar)", "trabalhando", "-ar → -ando.",
   prompt="Completá con el gerúndio.")
cz(W, 2, "Estamos ___ o jogo. (ver)", "vendo", "ver → vendo.", prompt="Completá con el gerúndio.")
cz(W, 2, "Ele está ___ o jornal. (ler)", "lendo", "ler → lendo.", prompt="Completá con el gerúndio.")
cz(W, 2, "Está ___ em Botafogo. (chover)", "chovendo", "chover (llover) → chovendo.",
   prompt="Completá con el gerúndio.")
cz(W, 2, "O que você está ___? (dizer)", "dizendo", "dizer → dizendo (no «dicindo»).",
   prompt="Completá con el gerúndio.")

tr(W, 0, "¿Dónde vivís?", "Onde você mora?", ["Onde tu moras?", "Você mora onde?"],
   "«Vivir en un lugar» es *morar*: *onde você mora?* El voseo rioplatense no existe en Brasil; se usa *você* con el verbo en 3.ª persona.")
tr(W, 0, "¿Por qué estás en Río?", "Por que você está no Rio?",
   ["Você está no Rio por quê?", "Por que tu estás no Rio?", "Por que você tá no Rio?"],
   "Pregunta: por que, separado; al final, por quê.")
tr(W, 1, "Voy a viajar mañana.", "Vou viajar amanhã.", ["Eu vou viajar amanhã.", "Amanhã vou viajar.", "Amanhã eu vou viajar."],
   "ir + infinitivo sin «a».")
tr(W, 1, "¿Qué vas a hacer el sábado?", "O que você vai fazer no sábado?",
   ["O que tu vais fazer no sábado?", "O que você vai fazer sábado?", "Você vai fazer o que no sábado?"],
   "ir + infinitivo: vai fazer.")
tr(W, 1, "Vamos a comer en la feria.", "A gente vai comer na feira.", ["Nós vamos comer na feira.", "Vamos comer na feira."],
   "Sin «a» entre ir y el infinitivo.")
tr(W, 2, "Estoy trabajando.", "Estou trabalhando.", ["Eu estou trabalhando.", "Tô trabalhando.", "Eu tô trabalhando."],
   "estar + gerúndio, como en español.")
tr(W, 2, "¿Qué estás haciendo?", "O que você está fazendo?", ["O que você tá fazendo?", "O que tu estás fazendo?"],
   "fazer → fazendo.")
tr(W, 2, "Está lloviendo.", "Está chovendo.", ["Tá chovendo."], "chover → chovendo.")

fx(W, 1, "espanol", "Amanhã vou a viajar para Salvador.", "vou a viajar", "vou viajar",
   "Entre ir y el infinitivo no va nada: vou viajar.")
fx(W, 2, "espanol", "Ela está durmindo no sofá.", "durmindo", "dormindo",
   "El gerúndio conserva la vocal del infinitivo: dormindo.")
fx(W, 0, "ortografia", "Porque você não vem à festa?", "Porque", "Por que",
   "En la pregunta, por que va separado; porque (junto) es para responder.")
fx(W, 0, "espanol", "Cuántos anos você tem?", "Cuántos", "Quantos",
   "«¿Cuántos?» se escribe *quantos*: el portugués usa *qu* delante de *a* (suena [kw]) y los interrogativos no llevan tilde. Concuerda: *quantas pessoas?*")

gd(W, 2, [["falar", "falando"], ["comer", "comendo"], ["abrir", "abrindo"]], "pôr → ___", "pondo", "ponhendo",
   "pôr es el único verbo en -or: pondo (compuestos: compondo, propondo).")
gd(W, 2, [["falar", "falando"], ["comer", "comendo"], ["abrir", "abrindo"]], "ler → ___", "lendo", "leiendo",
   "ler → lendo. El español mete una y (leyendo); el portugués, no.")
gd(W, 2, [["falar", "falando"], ["comer", "comendo"], ["abrir", "abrindo"]], "ir → ___", "indo", "iendo",
   "ir → indo, regular. El español «yendo» es el que es raro.")

sc(W, 0, ["Por que você está aqui?", "Porque eu moro aqui.", "Você está aqui por quê?", "Por que ela não vem?",
          "Porque ela está cansada.", "Ela não vem por quê?"],
   "¿Cuándo va «por que», «porque» y «por quê»?",
   ["«por que» para preguntar, «porque» para responder y «por quê» al final de la frase.",
    "«porque» para preguntar, «por que» para responder y «por quê» cuando hay sorpresa.", "Son intercambiables; es solo ortografía."],
   "«por que» para preguntar, «porque» para responder y «por quê» al final de la frase.",
   "Igual que en español (¿por qué? / porque), pero sin tilde en la pregunta y con circunflejo al final: por quê?")
sc(W, 1, ["Vou viajar amanhã.", "Ela vai comer na feira.", "Vamos sair hoje.", "Eles vão ver o jogo.",
          "Você vai ficar em casa?", "A gente vai dançar na Lapa."],
   "¿Cómo se arma el futuro con «ir»?",
   ["«ir» en presente + infinitivo, sin preposición.", "«ir» en presente + «a» + infinitivo, como en español.",
    "«ir» en presente + gerundio."],
   "«ir» en presente + infinitivo, sin preposición.",
   "Vou viajar, vamos sair: sin la «a» del español.")

ty(W, 2, "Escribí el gerúndio de «pôr».", "pôr → ___", "pondo", "pôr → pondo.")
ty(W, 0, "Escribí «¿quién?» en portugués.", "«¿quién?» → ___", "quem", "«¿Quién?» es *quem*, invariable: sirve para una o varias personas (no hay «quiénes»). La *m* final solo nasaliza la *e*.",
   alt=["quem?"])

# ============================================================================
# Semana 9 — Preposições de lugar e movimento
# partes: 0 em, ir a / para, chegar · 1 transporte y por · 2 de, até, direcciones
# ============================================================================
W = 9
ch(W, 0, "Moro ___ Rio.", ["no", "em", "a"], "no",
   "O Rio lleva artículo: em + o = no Rio.")
ch(W, 0, "Ela mora ___ Buenos Aires.", ["em", "na", "no"], "em",
   "Buenos Aires no lleva artículo: em Buenos Aires.")
ch(W, 0, "Eles moram ___ Argentina.", ["na", "em", "a"], "na",
   "A Argentina lleva artículo: na Argentina.")
ch(W, 0, "Estou ___ Portugal.", ["em", "no", "na"], "em",
   "Portugal va sin artículo: em Portugal (pero no Brasil).")
ch(W, 0, "Vou ___ padaria.", ["à", "em", "á"], "à",
   "*Ir a* + *a padaria* se funde en *vou à padaria*, con acento grave (*crase*). En el habla se oye mucho *vou pra padaria*.")
ch(W, 0, "Vou ___ Salvador no verão, para morar lá.", ["para", "em", "de"], "para",
   "ir para: destino donde te quedás. ir a: visita corta.")
ch(W, 0, "Chegamos ___ Rio às oito.", ["ao", "no", "para o"], "ao",
   "La norma pide chegar a: chegamos ao Rio. En el habla se oye chegar no.",
   prompt="Elegí la forma de la norma escrita.")
ch(W, 1, "Vou ___ ônibus.", ["de", "em", "a"], "de",
   "Medio de transporte: de + medio sin artículo: de ônibus.")
ch(W, 1, "A gente vai ___ pé.", ["a", "de", "em"], "a",
   "«A pie» es *a pé*, con la misma preposición que en español y tilde en *pé*. Ojo: *de pé* significa «parado, de pie», no el medio de transporte.")
ch(W, 1, "O ônibus passa ___ praia.", ["pela", "por a", "pola"], "pela",
   "*Por* + *a* se contrae siempre en *pela*: *o ônibus passa pela praia*. ✗*por a* no existe, aunque en español digamos «por la».")
ch(W, 1, "Eu ___ o metrô em Botafogo.", ["pego", "pega", "pegamos"], "pego",
   "Tomar un transporte = pegar: eu pego o metrô.")
ch(W, 2, "Vou a pé ___ a praia.", ["até", "hasta", "desde"], "até",
   "«Hasta» se dice *até*, con tilde en la *e*: *vou a pé até a praia*. «Desde» es *desde* o *de*.")
ch(W, 2, "Saio ___ casa às sete.", ["de", "da", "desde"], "de",
   "Salir de casa (la propia): sair de casa, sin artículo.")
ch(W, 2, "Você vira ___ direita.", ["à", "a", "na"], "à",
   "«A la derecha» es *à direita*: la preposición *a* + el artículo *a* dan *à* (*crase*). Lo mismo con *à esquerda*.")
ch(W, 2, "Você segue em ___.", ["frente", "direito", "derecho"], "frente",
   "«Seguir derecho» se dice *seguir em frente* (o *seguir reto*). *Direito* es «derecho» como ley o como lado, pero no para indicar el camino.",
   prompt="«Seguís derecho.»")

cz(W, 0, "Estou ___ Copacabana. (en)", "em", "Copacabana se usa sin artículo: em Copacabana.")
cz(W, 0, "Ela trabalha ___ Lapa. (en la)", "na", "A Lapa lleva artículo: na Lapa.")
cz(W, 0, "Vocês moram ___ Brasil? (en el)", "no", "O Brasil lleva artículo: no Brasil.")
cz(W, 0, "Vamos ___ Maracanã? (a + o)", "ao", "*A* + *o* da *ao*, como nuestro «al»: *vamos ao Maracanã?* En el habla también *pro Maracanã* (*para + o*).")
cz(W, 0, "Eu vou ___ casa. (para, habla)", "pra", "En el habla para se reduce a pra: vou pra casa.",
   alt=["para"])
cz(W, 1, "Ela vai ___ metrô. (en subte)", "de", "de + medio de transporte: de metrô.")
cz(W, 1, "Passo ___ centro todo dia. (por + o)", "pelo", "*Por* + *o* se contrae en *pelo*: *passo pelo centro*. En portugués la contracción es obligatoria.")
cz(W, 1, "Um passeio ___ ruas de Santa Teresa. (por + as)", "pelas", "*Por* + *as* da *pelas*: *um passeio pelas ruas*. El portugués contrae *por* con todos los artículos (*pelo, pela, pelos, pelas*).")
cz(W, 2, "Do Leme ___ Leblon tem muita praia. (a + o)", "ao", "de… a…: do Leme ao Leblon (o até o Leblon).",
   alt=["até o"])
cz(W, 2, "Venho ___ trabalho. (de + o)", "do", "de + o = do: venho do trabalho.")
cz(W, 2, "A estação fica ___ esquerda.", "à", "«A la izquierda» es *à esquerda*, con *crase* (*a* + artículo *a*). Con *ficar* se ubica algo: *a estação fica à esquerda*.")
cz(W, 2, "Com ___, como eu chego ao Arpoador?", "licença",
   "Com licença sirve para pedir paso o abordar a alguien por la calle.")

tr(W, 0, "Vivo en Río.", "Moro no Rio.", ["Eu moro no Rio.", "Moro no Rio de Janeiro.", "Eu moro no Rio de Janeiro."],
   "«Vivir en» es *morar em*, y *Rio* lleva artículo: *em + o Rio* da *no Rio*. Algunas ciudades llevan artículo (*o Rio*, *o Recife*) y otras no (*São Paulo*).")
tr(W, 0, "Voy a la playa.", "Vou à praia.", ["Eu vou à praia.", "Vou pra praia.", "Eu vou pra praia.", "Vou para a praia.", "Eu vou para a praia."],
   "*A* + *a* da *à*: *vou à praia*. En el habla se usa más *para* (*pra*): *vou pra praia*.")
tr(W, 0, "Vivimos en Brasil.", "Moramos no Brasil.", ["Nós moramos no Brasil.", "A gente mora no Brasil."],
   "O Brasil lleva artículo: no Brasil.")
tr(W, 1, "Voy en colectivo.", "Vou de ônibus.", ["Eu vou de ônibus."],
   "de + medio de transporte; colectivo = ônibus.")
tr(W, 1, "Vamos a pie.", "Vamos a pé.", ["A gente vai a pé.", "Nós vamos a pé."],
   "«A pie» es *a pé*, con la misma preposición que el español y tilde en *pé*. *De pé* significa «parado».")
tr(W, 1, "El subte pasa por Copacabana.", "O metrô passa por Copacabana.", [],
   "Copacabana sin artículo: por Copacabana (con artículo sería pelo / pela).")
tr(W, 2, "Salgo de casa a las siete.", "Saio de casa às sete.", ["Eu saio de casa às sete.", "Saio de casa às sete horas."],
   "sair → saio; a las siete = às sete.")
tr(W, 2, "Doblás a la derecha.", "Você vira à direita.", ["Vira à direita.", "Tu viras à direita."],
   "«Doblar» (en la calle) es *virar*, y «a la derecha» *à direita*, con *crase*. Sin voseo: *você vira* con el verbo en 3.ª persona.")

fx(W, 1, "preposicion", "Vou em ônibus para o trabalho.", "em ônibus", "de ônibus",
   "Medio de transporte: de ônibus, de metrô, de carro.")
fx(W, 0, "contraccion", "Moro em o Rio, em Botafogo.", "em o Rio", "no Rio",
   "em + o = no: moro no Rio.")
fx(W, 1, "contraccion", "O ônibus passa por a praia.", "por a", "pela",
   "*Por* + *a* tiene que contraerse: *pela praia*. ✗*por a* es un error típico de hispanohablante.")
fx(W, 2, "crase", "A farmácia fica a esquerda.", "a esquerda", "à esquerda",
   "«A la izquierda» lleva *crase*: *à esquerda*. Sin el acento grave, *a esquerda* sería «la izquierda» (solo el artículo).")

gd(W, 0, [["em + a Lapa", "na Lapa"], ["em + o Leblon", "no Leblon"], ["em + a Tijuca", "na Tijuca"]],
   "em + Copacabana → ___", "em Copacabana", "na Copacabana",
   "Algunos barrios llevan artículo (a Lapa, o Leblon) y otros no: em Copacabana, em Ipanema, em Botafogo.")
gd(W, 1, [["carro", "de carro"], ["ônibus", "de ônibus"], ["metrô", "de metrô"]], "pé → ___", "a pé", "de pé",
   "Todos los medios van con de, menos a pé. De pé significa «parado».")
gd(W, 0, [["a Argentina", "na Argentina"], ["o Brasil", "no Brasil"], ["o Uruguai", "no Uruguai"]], "Portugal → ___", "em Portugal", "no Portugal",
   "La mayoría de los países lleva artículo, pero Portugal no: em Portugal, de Portugal.")

sc(W, 1, ["Vou de carro.", "Vou de ônibus.", "Vou de metrô.", "Vou de bicicleta.", "Vou de avião.", "Vou a pé."],
   "¿Cómo se dice el medio de transporte?",
   ["«de» + el medio, sin artículo; solo «a pé» es distinto.", "«em» + el medio, como en español.",
    "«de» + artículo + el medio (do carro, do ônibus); «a pé» también."],
   "«de» + el medio, sin artículo; solo «a pé» es distinto.",
   "El medio de transporte va con *de* sin artículo: *vou de ônibus* «voy en colectivo», *de carro*, *de metrô*. La única excepción es *a pé*.")
sc(W, 0, ["Chego ao aeroporto às dez. (norma)", "Chego no aeroporto às dez. (habla)", "Vou ao mercado. (norma)",
          "Vou no mercado. (habla)", "Chegamos à praia. (norma)", "Chegamos na praia. (habla)"],
   "¿Qué diferencia hay entre «a» y «em» con verbos de movimiento?",
   ["La norma pide «a»; en el habla de Brasil se usa «em».", "«em» es la norma y «a» es coloquial.",
    "Significan cosas distintas: «a» es ir y «em» es quedarse."],
   "La norma pide «a»; en el habla de Brasil se usa «em».",
   "chegar a / ir a son la norma; chegar em / ir em son del habla de todo Brasil. Escribí a; entendé los dos.")

ty(W, 1, "Escribí la contracción de «por + as».", "por + as → ___", "pelas", "*Por* + *as* se contrae en *pelas* (*pelas ruas*). La contracción con *por* es obligatoria, a diferencia del español.")
ty(W, 1, "¿Cómo se dice «a pie»?", "«a pie» → ___", "a pé", "«A pie» se dice *a pé*, con la preposición *a* y tilde aguda en *pé*. Es la excepción al *de* + transporte (*de ônibus*).")

# ============================================================================
# Semana 10 — Possessivos e demonstrativos
# partes: 0 posesivos, seu / dele · 1 demostrativos · 2 familia
# ============================================================================
W = 10
ch(W, 0, "___ casa é em Santa Teresa.", ["Minha", "Mia", "Mi"], "Minha",
   "El posesivo femenino es *minha* (masculino *meu*), igual para «mi» y «mía». En Brasil suele llevar artículo: *a minha casa*.", prompt="«Mi casa está en Santa Teresa.»")
ch(W, 0, "___ pais moram em Rosario.", ["Meus", "Mis", "Minhas"], "Meus",
   "Pais es masculino plural: meus pais.", prompt="«Mis padres viven en Rosario.»")
ch(W, 0, "Essa mala é ___.", ["minha", "mia", "meu"], "minha",
   "El posesivo concuerda con lo poseído (a mala): minha.", prompt="«Esa valija es mía.»")
ch(W, 0, "Estou ___ casa da minha avó.", ["na", "em a", "no"], "na",
   "*Em* + *a casa* se contrae: *na casa da minha avó*. ✗*em a* no existe.")
ch(W, 0, "o carro ___", ["dele", "de ele", "seu"], "dele",
   "«De él» sin ambigüedad: dele, siempre contraído y después del sustantivo. Seu se entiende «de você».",
   prompt="«el auto de él»")
ch(W, 0, "a mãe ___", ["dela", "de ela", "sua"], "dela",
   "«De ella» se contrae en *dela* y va detrás del sustantivo: *a mãe dela*. Se prefiere a *sua*, que con *você* se entiende «tuya».", prompt="«la madre de ella»")
ch(W, 0, "a ___ casa", ["nossa", "nosso", "nuestra"], "nossa",
   "Casa es femenino: a nossa casa.", prompt="«nuestra casa»")
ch(W, 1, "___ morro é o Dois Irmãos.", ["Aquele", "Aquel", "Esse aqui"], "Aquele",
   "Allá lejos: aquele (masc.), aquela (fem.).", prompt="«Aquel cerro es el Dos Hermanos.»")
ch(W, 1, "O que é ___?", ["isso", "esso", "iso"], "isso",
   "El neutro «eso» es *isso*, con *i* y doble *s*; «esto» es *isto* y «aquello» *aquilo*. En el habla, *isso* se usa también por «esto».", prompt="«¿Qué es eso?»")
ch(W, 1, "Moro ___ prédio.", ["neste", "em este", "nesto"], "neste",
   "*Em* + demostrativo se contrae siempre: *neste, nesse, naquele*. «En este edificio» es *neste prédio*; ✗*em este* no se usa.", prompt="«Vivo en este edificio.»")
ch(W, 1, "A dona ___ loja é baiana.", ["dessa", "de essa", "desa"], "dessa",
   "*De* + *essa* da *dessa*: *a dona dessa loja*. Los demostrativos se contraen con *de* y *em*, cosa que el español no hace.", prompt="«La dueña de esa tienda es bahiana.»")
ch(W, 1, "Não sei nada ___.", ["disso", "de isso", "deso"], "disso",
   "*De* + *isso* se contrae en *disso*: *não sei nada disso* «no sé nada de eso». Igual *disto*, *daquilo*.", prompt="«No sé nada de eso.»")
ch(W, 2, "Meus ___ moram em Mendoza.", ["pais", "parentes", "padres"], "pais",
   "«Los padres» (papá y mamá) son *os pais*. *Parentes* son «parientes» y *padre* es «cura».", prompt="«Mis padres viven en Mendoza.»")
ch(W, 2, "a minha ___", ["avó", "avô", "abuela"], "avó",
   "*Avó* (ó abierta, tilde aguda) es «abuela»; *avô* (ô cerrada, circunflejo) es «abuelo». El acento marca la diferencia de timbre que el español no tiene.", prompt="«mi abuela»")

cz(W, 0, "___ irmã mora em Niterói. (mi)", "Minha", "Posesivo femenino: minha irmã (o a minha irmã).",
   alt=["A minha"], prompt="Completá con el posesivo.")
cz(W, 0, "Os ___ amigos são cariocas. (mis)", "meus", "Amigos, masculino plural: os meus amigos.",
   prompt="Completá con el posesivo.")
cz(W, 0, "As ___ malas estão no carro. (nuestras)", "nossas", "Malas, femenino plural: as nossas malas.",
   prompt="Completá con el posesivo.")
cz(W, 0, "Qual é o ___ telefone? (tu, de você)", "seu", "Para você: seu / sua. Telefone es masculino: o seu telefone.",
   prompt="Completá con el posesivo.")
cz(W, 0, "O Rafa e a namorada ___. (de él)", "dele", "«De él» se contrae en *dele* y va detrás del sustantivo: *a namorada dele*. Así se evita la ambigüedad de *sua*.",
   prompt="Completá con el posesivo.")
cz(W, 0, "O apartamento ___ fica no Leblon. (de ellos)", "deles", "«De ellos» es *deles* (*de + eles*), detrás del sustantivo: *o apartamento deles*. En femenino, *delas*.",
   prompt="Completá con el posesivo.")
cz(W, 1, "___ camisa é sua? (esa)", "Essa", "*Essa* es «esa» (cerca de quien escucha); en el habla brasileña *esse/essa* reemplaza también a *este/esta*.",
   alt=["Esta"])
cz(W, 1, "___ ali é o Cristo? (aquello)", "Aquilo", "Neutro lejano: aquilo.")
cz(W, 1, "___ rua tem um boteco. (en aquella)", "Naquela", "*Em* + *aquela* se contrae en *naquela*: *naquela rua* «en aquella calle». Igual *naquele*, *naquilo*.")
cz(W, 1, "___ mesmo! (eso)", "Isso", "*Isso mesmo!* es «¡eso mismo!, ¡exacto!»: el neutro *isso* más *mesmo*, que refuerza. Muy frecuente para dar la razón.")
cz(W, 1, "O dono ___ restaurante é mineiro. (de este)", "deste", "*De* + *este* se contrae en *deste*: *o dono deste restaurante*. En español «de este» queda separado.",
   alt=["desse"])
cz(W, 2, "O pai do meu marido é o meu ___.", "sogro", "El padre del marido o de la esposa es o sogro.")
cz(W, 2, "Tenho dois ___ e uma irmã. (hermanos)", "irmãos", "irmão → irmãos.")

tr(W, 0, "Mi hermana vive en Niterói.", "Minha irmã mora em Niterói.", ["A minha irmã mora em Niterói."],
   "Minha, con o sin artículo; vivir = morar.")
tr(W, 0, "Esa valija es mía.", "Essa mala é minha.", ["Esta mala é minha.", "A mala é minha."],
   "«Valija» se dice *mala*, y el posesivo *minha* sirve para «mi» y para «mía». Con «esa» cerca de vos: *essa mala*.")
tr(W, 0, "El auto de él es negro.", "O carro dele é preto.", [],
   "«De él» es *dele*, detrás del sustantivo: *o carro dele*. Y el color «negro» se dice *preto* (*negro* se reserva para personas).")
tr(W, 0, "¿Cuál es tu teléfono?", "Qual é o seu telefone?",
   ["Qual é seu telefone?", "Qual é o teu telefone?", "Qual é teu telefone?", "Qual o seu telefone?"],
   "Para você, seu. En el Sur y el Nordeste también teu.")
tr(W, 1, "¿Qué es eso?", "O que é isso?", ["O que é isto?", "Que é isso?"],
   "La pregunta «¿qué es?» lleva *o que*: *o que é isso?*; el neutro «eso» es *isso*. Un *que* solo suena incompleto.")
tr(W, 1, "Vivo en este edificio.", "Moro neste prédio.", ["Eu moro neste prédio.", "Moro nesse prédio.", "Eu moro nesse prédio."],
   "*Em* + *este* se contrae en *neste*; «edificio» se dice *prédio* (*edifício* también existe, más formal). «Vivir» en un lugar es *morar*.")
tr(W, 2, "Mis padres viven en Rosario.", "Meus pais moram em Rosario.", ["Os meus pais moram em Rosario."],
   "«Padres» (papá y mamá) es *pais*; *parentes* son «parientes». Y «vivir en» se dice *morar em*.")
tr(W, 2, "Mi abuelo es de Minas.", "Meu avô é de Minas.",
   ["O meu avô é de Minas.", "Meu avô é mineiro.", "O meu avô é mineiro.", "Meu avô é de Minas Gerais.", "O meu avô é de Minas Gerais."],
   "«Abuelo» es *avô*, con circunflejo (o cerrada); con tilde aguda, *avó*, sería «abuela». Origen con *ser de*: *é de Minas*.")

fx(W, 0, "espanol", "Mia casa é em Botafogo.", "Mia", "Minha",
   "El posesivo femenino es minha: minha casa.")
fx(W, 0, "contraccion", "O carro de ele é branco.", "de ele", "dele",
   "de + ele se contrae siempre: dele.")
fx(W, 1, "contraccion", "Moro em este prédio com a minha família.", "em este", "neste",
   "*Em* + *este* se contrae obligatoriamente: *neste prédio*. Es un error típico dejar ✗*em este* separado como en español.")
fx(W, 2, "falso_amigo", "Meus padres moram em Córdoba.", "padres", "pais",
   "«Padres» (papá y mamá) es *pais*. *Padre* en portugués es un cura: *meus padres* sonaría a «mis curas».")

gd(W, 0, [["teu", "tua"], ["seu", "sua"], ["nosso", "nossa"]], "meu → ___", "minha", "meua",
   "El femenino de meu es irregular: minha, minhas.")
gd(W, 1, [["em + este", "neste"], ["em + esse", "nesse"], ["de + este", "deste"]], "de + aquele → ___", "daquele", "de aquele",
   "de + aquele también se contrae: daquele, daquela, daquilo.")
gd(W, 2, [["o irmão", "a irmã"], ["o tio", "a tia"], ["o filho", "a filha"]], "o avô → ___", "a avó", "a avôa",
   "Abuelo y abuela se distinguen solo por la vocal: avô (cerrada) / avó (abierta).")

sc(W, 0, ["O carro dele é preto.", "A casa dela é linda.", "Os filhos deles são cariocas.", "Qual é o seu nome, Bia?",
          "O Rafa e a mãe dele.", "A Ana e o irmão dela."],
   "¿Cómo se dice «su» de él / de ella en Brasil?",
   ["Con «dele / dela» después del sustantivo; «seu» queda para «de você».",
    "Siempre con «seu / sua», como en español.", "Con «dele / dela» antes del sustantivo (dele carro); «seu» es solo formal."],
   "Con «dele / dela» después del sustantivo; «seu» queda para «de você».",
   "En Brasil seu se entiende como «tuyo» (de você). Para terceros: o carro dele, a casa dela.")
sc(W, 1, ["Moro neste prédio.", "O dono desse bar é baiano.", "Naquela rua tem uma feira.", "Não sei nada disso.",
          "Nessa praia tem ondas.", "O Cristo fica naquele morro."],
   "¿Qué pasa con «em» y «de» ante los demostrativos?",
   ["Se funden con ellos: neste, desse, naquela, disso.", "Quedan separados: em este, de esse.",
    "Solo «em» se funde (neste, naquela); «de» queda separado: de esse."],
   "Se funden con ellos: neste, desse, naquela, disso.",
   "Es la misma regla que no / do: em y de se contraen con este, esse, aquele, isso.")

ty(W, 0, "Escribí el femenino plural de «meu».", "meu → ___", "minhas", "meu, minha, meus, minhas.")
ty(W, 0, "Escribí «de + ela» en una palabra.", "de + ela → ___", "dela", "*De* + *ela* se contrae en *dela* («de ella»): *a casa dela*. Lo mismo *dele, deles, delas*.")

# ============================================================================
# Semana 11 — Pretérito perfeito
# partes: 0 regulares y grafía · 1 irregulares · 2 usos y relato
# ============================================================================
W = 11
ch(W, 0, "Ontem ela ___ com o João.", ["falou", "faló", "falô"], "falou",
   "Tercera persona de -ar en perfeito: -ou (falou).")
ch(W, 0, "Eles ___ uma feijoada.", ["comeram", "comieram", "comeron"], "comeram",
   "Tercera del plural: -eram (comeram).")
ch(W, 0, "Eu ___ a janela.", ["abri", "abrí", "abrei"], "abri",
   "-ir en eu: -i, sin tilde (abri).")
ch(W, 0, "Eu ___ ao Rio no sábado.", ["cheguei", "chegei", "chegué"], "cheguei",
   "-gar → -guei en eu, para conservar el sonido g: cheguei.")
ch(W, 0, "Eu ___ com Pix.", ["paguei", "pagei", "pagué"], "paguei",
   "pagar → paguei (como pagué).")
ch(W, 0, "Eu ___ o curso ontem.", ["comecei", "começei", "comencei"], "comecei",
   "-çar → -cei: la ç no va ante e (comecei).")
ch(W, 1, "Ontem eu ___ à praia.", ["fui", "foi", "fue"], "fui",
   "ir en perfeito: eu fui, ele foi.")
ch(W, 1, "O show ___ incrível.", ["foi", "fui", "fue"], "foi",
   "ser en perfeito: ele foi (igual que ir).")
ch(W, 1, "Eu ___ um problema no hotel.", ["tive", "tuve", "teve"], "tive",
   "ter → eu tive, ele teve.")
ch(W, 1, "O que vocês ___ ontem?", ["fizeram", "fazeram", "hicieram"], "fizeram",
   "fazer → fiz, fez, fizemos, fizeram.")
ch(W, 1, "Ela ___ que sim.", ["disse", "dijo", "dizeu"], "disse",
   "dizer → eu disse, ela disse.")
ch(W, 1, "Ele ___ de Recife.", ["veio", "viu", "vino"], "veio",
   "vir → ele veio (vino). Viu es de ver.")
ch(W, 1, "Eu ___ o pôr do sol no Arpoador.", ["vi", "vim", "vio"], "vi",
   "ver → eu vi. Vim es de vir.")
ch(W, 1, "Não ___ ir ao jogo.", ["pude", "pôde", "podei"], "pude",
   "poder → eu pude, ele pôde.", prompt="«No pude ir al partido.»")
ch(W, 2, "Hoje eu ___ muito.", ["comi", "tenho comido", "hei comido"], "comi",
   "«He comido» = comi: el perfeito cubre los dos pasados del español.",
   prompt="«Hoy he comido mucho.»")
ch(W, 2, "Você já ___ a Paraty?", ["foi", "fui", "tem ido"], "foi",
   "Para experiencias («¿ya fuiste?, ¿alguna vez fuiste?») se usa el perfeito: *você já foi?* El *tem ido* no equivale a «has ido»: significa «venís yendo».")

cz(W, 0, "Ontem eu ___ muito. (trabalhar)", "trabalhei", "-ar en eu: -ei.", prompt="Completá con el perfeito.")
cz(W, 0, "A gente ___ na Lapa. (dançar)", "dançou", "a gente + tercera singular: dançou.",
   prompt="Completá con el perfeito.")
cz(W, 0, "Eles ___ a loja cedo. (abrir)", "abriram", "-ir, eles: -iram.", prompt="Completá con el perfeito.")
cz(W, 0, "Eu ___ numa pousada. (ficar)", "fiquei", "-car → -quei en eu.", prompt="Completá con el perfeito.")
cz(W, 1, "Ela ___ no Rio em 2020. (estar)", "esteve", "estar → ela esteve.", prompt="Completá con el perfeito.")
cz(W, 1, "Nós ___ ao Pão de Açúcar. (ir)", "fomos", "ir → nós fomos.", prompt="Completá con el perfeito.")
cz(W, 1, "Quem ___ o violão? (trazer)", "trouxe", "trazer → trouxe (se lee «tróusi»).",
   prompt="Completá con el perfeito.")
cz(W, 1, "Ele não ___ sair. (querer)", "quis", "querer → ele quis.", prompt="Completá con el perfeito.")
cz(W, 1, "Eu ___ de ônibus. (vir)", "vim", "vir → eu vim.", prompt="Completá con el perfeito.")
cz(W, 1, "Ela ___ um presente para a mãe. (dar)", "deu", "dar → ela deu.", prompt="Completá con el perfeito.")
cz(W, 1, "Onde você ___ a chave? (pôr)", "pôs", "pôr → você pôs, con circunflejo.",
   alt=["colocou", "botou"], prompt="Completá con el perfeito.")
cz(W, 2, "Ainda não ___. (almoçar, eu)", "almocei", "-çar → -cei: almocei.", prompt="Completá con el perfeito.")
cz(W, 2, "___ a gente foi a Niterói. (ayer)", "Ontem", "«Ayer» es *ontem*, con *m* final nasal; «anteayer», *anteontem*. Va con perfeito: *ontem a gente foi*.")

tr(W, 0, "Ayer trabajé mucho.", "Ontem eu trabalhei muito.",
   ["Ontem trabalhei muito.", "Eu trabalhei muito ontem.", "Trabalhei muito ontem."],
   "-ar en eu: -ei (trabalhei).")
tr(W, 0, "Llegué a las seis.", "Cheguei às seis.", ["Eu cheguei às seis.", "Cheguei às seis horas.", "Eu cheguei às seis horas."],
   "chegar → cheguei.")
tr(W, 1, "Fui a la playa.", "Fui à praia.",
   ["Eu fui à praia.", "Fui pra praia.", "Eu fui pra praia.", "Fui para a praia.", "Eu fui para a praia."],
   "ir → fui; a + a = à.")
tr(W, 1, "¿Qué hiciste ayer?", "O que você fez ontem?", ["O que tu fizeste ontem?", "O que tu fez ontem?", "Você fez o que ontem?"],
   "fazer → você fez.")
tr(W, 1, "Vino en colectivo.", "Veio de ônibus.", ["Ele veio de ônibus.", "Ela veio de ônibus."],
   "vir → veio (no viu).")
tr(W, 1, "Vi el Cristo.", "Vi o Cristo.", ["Eu vi o Cristo.", "Vi o Cristo Redentor.", "Eu vi o Cristo Redentor."],
   "ver → eu vi.")
tr(W, 2, "Hoy he comido mucho.", "Hoje eu comi muito.", ["Hoje comi muito.", "Comi muito hoje.", "Eu comi muito hoje."],
   "El portugués casi no usa el compuesto para el pasado cercano: «hoy he comido» es *hoje eu comi*, en perfeito simple, como en el Río de la Plata.")
tr(W, 2, "¿Ya fuiste a Salvador?", "Você já foi a Salvador?",
   ["Você já foi para Salvador?", "Tu já foste a Salvador?", "Você já esteve em Salvador?", "Já foi a Salvador?"],
   "*Já* + perfeito expresa «ya / alguna vez»: *você já foi a Salvador?* El compuesto *tem ido* no sirve para eso.")

fx(W, 2, "perfeito_composto", "Hoje eu tenho comido muito.", "tenho comido", "comi",
   "«He comido» es comi. Tenho comido significa «vengo comiendo».")
fx(W, 1, "verbo_irregular", "Ontem eu foi ao cinema.", "foi", "fui",
   "ir: eu fui, ele foi.")
fx(W, 1, "verbo_irregular", "Ela vino de Recife ontem.", "vino", "veio",
   "vir en perfeito: ela veio.")
fx(W, 0, "ortografia", "Eu chegei tarde ontem.", "chegei", "cheguei",
   "-gar → -guei: cheguei.")

gd(W, 1, [["falar", "ele falou"], ["comer", "ele comeu"], ["beber", "ele bebeu"]], "fazer → ele ___", "fez", "fazeu",
   "fazer es irregular: fiz, fez, fizemos, fizeram.")
gd(W, 1, [["comer", "ele comeu"], ["beber", "ele bebeu"], ["vender", "ele vendeu"]], "ter → ele ___", "teve", "teu",
   "ter es irregular en perfeito: tive, teve, tivemos, tiveram.")
gd(W, 0, [["falar", "eu falei"], ["morar", "eu morei"], ["trabalhar", "eu trabalhei"]], "ficar → eu ___", "fiquei", "ficei",
   "-car → -quei en eu, para que la c siga sonando k: fiquei, toquei.")

sc(W, 2, ["Hoje eu acordei cedo.", "Ontem eu acordei cedo.", "Você já foi ao Rio?", "Nunca comi acarajé.", "Ainda não almocei.",
          "Ano passado fui a Salvador."],
   "¿Cómo traduce el perfeito los dos pasados del español?",
   ["Una sola forma (acordei) sirve para «me desperté» y «me he despertado».",
    "Para «he comido» se usa «tenho comido».", "El perfeito solo sirve para el pasado lejano (ontem, ano passado); para hoy, tenho acordado."],
   "Una sola forma (acordei) sirve para «me desperté» y «me he despertado».",
   "El perfeito cubre hablé y he hablado. Tenho falado es otro tiempo (semana 21).")
sc(W, 1, ["Eu vi o mar.", "Eu vim de ônibus.", "Ele viu o jogo.", "Ele veio de carro.", "Eles viram o Cristo.", "Eles vieram ontem."],
   "¿Cómo distinguís «ver» de «vir» en el perfeito?",
   ["ver: vi, viu, viram; vir: vim, veio, vieram.", "Son iguales: el contexto decide.", "ver: vim, veio, vieram; vir: vi, viu, viram."],
   "ver: vi, viu, viram; vir: vim, veio, vieram.",
   "Una m o una e cambian el verbo: vi (vi) / vim (vine); viu (vio) / veio (vino).")

ty(W, 1, "Escribí «hice» en portugués.", "eu ___ (fazer)", "fiz", "fazer → eu fiz.")
ty(W, 1, "Escribí la forma de «pôr» para «ele» en perfeito.", "ele ___ (pôr)", "pôs",
   "pôr → eu pus, ele pôs (con circunflejo).")

# ============================================================================
# Semana 12 — Imperativo, reflexivos e rotina
# partes: 0 imperativo · 1 reflexivos y rutina · 2 farmacia, cuerpo, recetas
# ============================================================================
W = 12
ch(W, 0, "___ devagar, por favor.", ["Fale", "Falo", "Hable"], "Fale",
   "Imperativo de você: eu falo → fale (-ar → -e).", prompt="Elegí el imperativo formal de «falar».")
ch(W, 0, "___ a janela, por favor.", ["Abra", "Abro", "Abrí"], "Abra",
   "-ir → -a: eu abro → abra.", prompt="Elegí el imperativo formal de «abrir».")
ch(W, 0, "___ o favor de esperar.", ["Faça", "Faço", "Haga"], "Faça",
   "Del eu del presente: faço → faça.", prompt="Elegí el imperativo formal de «fazer».")
ch(W, 0, "___ paciente!", ["Seja", "Sea", "Se"], "Seja",
   "ser → seja, irregular.", prompt="«¡Sea paciente!»")
ch(W, 0, "___ embora!", ["Vá", "Va", "Vaya"], "Vá",
   "ir → vá (formal, con tilde). En el habla: vai!", prompt="Elegí el imperativo formal de «ir».")
ch(W, 0, "___ cá!", ["Vem", "Venha", "Ven"], "Vem",
   "Entre amigos se usa la forma de tu, igual a la tercera del presente: vem cá! Venha es la formal.",
   prompt="Elegí la forma del habla (entre amigos).")
ch(W, 0, "Não ___ isso!", ["faça", "hagas", "fazes"], "faça",
   "Negativo formal: não + forma de você: não faça.", prompt="«¡No haga eso!»")
ch(W, 0, "Não ___ o protetor solar.", ["esqueça", "esqueças", "olvide"], "esqueça",
   "esquecer → eu esqueço → esqueça.", prompt="«No se olvide del protector solar.»")
ch(W, 1, "Eu ___ às seis.", ["me levanto", "se levanto", "te levanto"], "me levanto",
   "eu → me: eu me levanto (pronombre delante, como en Brasil).")
ch(W, 1, "Como você ___?", ["se chama", "te chama", "te chamas"], "se chama",
   "Con você, el reflexivo es se: você se chama.")
ch(W, 1, "A gente ___ amanhã.", ["se vê", "nos vê", "se vemos"], "se vê",
   "a gente es tercera del singular: a gente se vê.", prompt="«Nos vemos mañana.»")
ch(W, 1, "Você ___ do João?", ["lembra", "acorda", "se acorda"], "lembra",
   "«Acordarse de» es *lembrar (de)*, y en el habla sin pronombre: *você lembra do João?* *Acordar* es «despertarse».", prompt="«¿Te acordás de João?»")
ch(W, 1, "Eu ___ de manhã.", ["tomo banho", "me ducho", "tomo banheiro"], "tomo banho",
   "«Ducharse / bañarse» es *tomar banho*, sin reflexivo. *Banheiro* es el cuarto de baño; ✗*me ducho* no existe.", prompt="«Me ducho a la mañana.»")
ch(W, 2, "Estou com ___ de cabeça.", ["dor", "dolor", "doença"], "dor",
   "«Dolor» es *dor*, femenino (*a dor*), y se dice con *estar com*: *estou com dor de cabeça*. *Doença* es «enfermedad».", prompt="«Me duele la cabeza.»")
ch(W, 2, "Estou com dor nas ___.", ["costas", "costa", "espaldas"], "costas",
   "«Espalda» se dice *as costas*, siempre en plural y femenino: *dor nas costas*. *Costa* en singular es la costa del mar.", prompt="«Me duele la espalda.»")
ch(W, 2, "___ este remédio de oito em oito horas.", ["Tome", "Tomo", "Tomes"], "Tome",
   "Imperativo formal: tomar → tome.", prompt="Elegí el imperativo formal de «tomar».")

cz(W, 0, "___ a porta, por favor. (fechar)", "Feche", "fechar (cerrar) → eu fecho → feche.",
   prompt="Completá con el imperativo de você (formal).")
cz(W, 0, "___ bem-vindo! (ser)", "Seja", "ser → seja: seja bem-vindo = bienvenido.",
   prompt="Completá con el imperativo de você (formal).")
cz(W, 0, "___ aqui amanhã. (vir)", "Venha", "vir → eu venho → venha.",
   prompt="Completá con el imperativo de você (formal).")
cz(W, 0, "___ a verdade. (dizer)", "Diga", "dizer → eu digo → diga.",
   prompt="Completá con el imperativo de você (formal).")
cz(W, 0, "Não ___ alto. (falar)", "fale", "Negativo formal: não fale.",
   prompt="Completá con el imperativo de você (formal).")
cz(W, 0, "___ só que lindo! (olhar)", "Olha", "En el habla, la forma de tu: olha!",
   prompt="Completá con el imperativo del habla.")
cz(W, 1, "Ela ___ às sete. (levantar-se)", "se levanta", "Pronombre delante del verbo: ela se levanta.",
   prompt="Completá con el presente.")
cz(W, 1, "Eu ___ Martín. (chamar-se)", "me chamo", "eu me chamo.", prompt="Completá con el presente.")
cz(W, 1, "Nós ___ cedo. (deitar-se)", "nos deitamos", "nós nos deitamos (acostarse).",
   prompt="Completá con el presente.")
cz(W, 1, "Você ___ do nome dela? (lembrar)", "lembra", "lembrar de = acordarse de; también se lembra.",
   alt=["se lembra"], prompt="Completá con el presente.")
cz(W, 1, "Ela ___ os dentes. (escovar)", "escova", "«Cepillarse los dientes» es *escovar os dentes*, sin reflexivo: *escovar* se usa sin *se* (*Ela escova os dentes*). Es particularidad del verbo; *se vestir* y *se levantar* sí llevan *se*.",
   prompt="Completá con el presente.")
cz(W, 2, "___ o joelho. (doer)", "Dói", "doer: dói (con tilde) cuando duele una parte: dói o joelho.",
   prompt="Completá con el presente.")
cz(W, 2, "___ muita água e descanse. (beber)", "Beba", "beber → eu bebo → beba.",
   prompt="Completá con el imperativo de você (formal).")

tr(W, 0, "Hable despacio, por favor.", "Fale devagar, por favor.",
   ["Fale mais devagar, por favor.", "Por favor, fale devagar.", "Fala devagar, por favor."],
   "Imperativo de você: fale; despacio = devagar.")
tr(W, 0, "Abra la ventana.", "Abra a janela.", ["Abre a janela."],
   "abrir → abra; ventana = janela.")
tr(W, 0, "¡No haga eso!", "Não faça isso!", ["Não faz isso!"],
   "Negativo: não faça (formal), não faz (habla).")
tr(W, 1, "Me levanto a las siete.", "Eu me levanto às sete.",
   ["Me levanto às sete.", "Levanto-me às sete.", "Eu levanto às sete.", "Eu me levanto às sete horas."],
   "Pronombre delante: eu me levanto.")
tr(W, 1, "¿Cómo te llamás?", "Como você se chama?", ["Qual é o seu nome?", "Como tu te chamas?", "Como é o seu nome?", "Qual o seu nome?"],
   "Con você: se chama.")
tr(W, 1, "Me olvidé la llave.", "Esqueci a chave.",
   ["Eu esqueci a chave.", "Esqueci da chave.", "Eu esqueci da chave.", "Me esqueci da chave.", "Eu me esqueci da chave."],
   "«Olvidarse» es *esquecer*, en el habla sin pronombre: *esqueci a chave*. La forma *esquecer-se de* es escrita y formal.")
tr(W, 2, "Me duele la cabeza.", "Estou com dor de cabeça.",
   ["Eu estou com dor de cabeça.", "Tô com dor de cabeça.", "Dói a cabeça.", "Minha cabeça dói.", "A minha cabeça dói.",
    "Minha cabeça está doendo.", "Está doendo a cabeça."],
   "estar com dor de… o doer.")
tr(W, 2, "Tome este remedio.", "Tome este remédio.", ["Toma este remédio.", "Tome esse remédio.", "Toma esse remédio."],
   "Imperativo formal: tome. Remédio con tilde.")

fx(W, 1, "pronome", "Você te chama Ana?", "te chama", "se chama",
   "Con você, el reflexivo es se: você se chama.")
fx(W, 1, "espanol", "Eu me acordo às sete.", "me acordo", "acordo",
   "*Acordar* es «despertarse» y no lleva pronombre: *eu acordo às sete*. *Me acordo* es error de calco del reflexivo español.")
fx(W, 0, "espanol", "Não fales alto, por favor.", "fales", "fale",
   "Negativo con você: não fale. «Fales» no se usa en Brasil.")
fx(W, 2, "genero", "Estou com um dor forte nas costas.", "um dor forte", "uma dor forte",
   "Dor es femenino: uma dor forte.")

gd(W, 0, [["comer", "coma"], ["beber", "beba"], ["abrir", "abra"]], "fazer → ___", "faça", "faza",
   "El imperativo sale del eu del presente: faço → faça. Por eso lleva ç.")
gd(W, 0, [["falar", "fale"], ["tomar", "tome"], ["comprar", "compre"]], "ficar → ___", "fique", "fice",
   "-car → -que ante e, para conservar el sonido k: fique, toque.")
gd(W, 0, [["escrever", "escreva"], ["correr", "corra"], ["vender", "venda"]], "dizer → ___", "diga", "diza",
   "Del eu del presente: digo → diga (como en español diga).")

sc(W, 0, ["Eu falo → Fale!", "Eu como → Coma!", "Eu abro → Abra!", "Eu faço → Faça!", "Eu digo → Diga!", "Eu venho → Venha!"],
   "¿De dónde sale el imperativo de você?",
   ["Del «eu» del presente, cambiando la -o por -e (-ar) o por -a (-er, -ir).",
    "Del infinitivo, sacando la -r.", "De la forma de «ele» del presente, sin cambios: fala, come, abre, faz, diz."],
   "Del «eu» del presente, cambiando la -o por -e (-ar) o por -a (-er, -ir).",
   "Por eso los irregulares de eu pasan al imperativo: faço → faça, digo → diga, venho → venha.")
sc(W, 0, ["Olha!", "Vem cá!", "Fala sério!", "Senta aí.", "Come mais!", "Faz isso pra mim?"],
   "¿Qué forma usan los brasileños al hablar entre amigos?",
   ["La forma de «ele» del presente (olha, vem, fala).", "La forma de «você» de los carteles (olhe, venha, fale).",
    "El infinitivo (olhar, vir, falar)."],
   "La forma de «ele» del presente (olha, vem, fala).",
   "Es el imperativo de tu, que coincide con la tercera del presente. Es lo normal en la charla; en lo escrito, fale.")

ty(W, 0, "Escribí el imperativo formal de «ser».", "ser → ___", "seja", "ser → seja, irregular.")
ty(W, 0, "Escribí el imperativo formal de «dar».", "dar → ___", "dê", "dar → dê, con circunflejo.")

# ============================================================================
# Semana 13 — CHEFÃO: repaso de la estación (20 ítems mixtos)
# partes: 0 palabras, artículos, contracciones · 1 presente y perfeito · 2 posesivos, lugares, trampas
# ============================================================================
W = 13
ch(W, 0, "a estação → as ___", ["estações", "estaçãos", "estaciones"], "estações",
   "-ão → -ões (como -ones en español).")
ch(W, 0, "___ viagem foi ótima.", ["A", "O", "Um"], "A",
   "Todas las palabras en -agem son femeninas: a viagem.")
ch(W, 0, "Estou ___ praia do Leblon.", ["na", "em a", "no"], "na",
   "*Em* + *a* se contrae en *na*: *estou na praia*. El artículo de *praia* es femenino, así que no puede ser *no*.")
ch(W, 1, "A gente ___ no Rio.", ["mora", "moramos", "moram"], "mora",
   "a gente + tercera del singular.")
ch(W, 1, "Ontem eles ___ aqui em casa.", ["vieram", "viram", "vinieram"], "vieram",
   "vir → vieram (vinieron); viram es de ver.", prompt="«Ayer vinieron a casa.»")
ch(W, 1, "Na sexta nós ___ jantar fora.", ["vamos", "vamos a", "imos"], "vamos",
   "ir + infinitivo sin «a»: vamos jantar.")
ch(W, 2, "A casa ___ é linda.", ["dela", "de ela", "sua"], "dela",
   "«De ella» es *dela*, detrás del sustantivo: *a casa dela*. *Sua* se entendería «tu» (de *você*).", prompt="«La casa de ella es linda.»")
ch(W, 2, "___ lindas", ["muito", "muitas", "muy"], "muito",
   "Ante adjetivo, muito es invariable: muito lindas.", prompt="«muy lindas»")

cz(W, 0, "Passo ___ calçadão. (por + o)", "pelo", "*Por* + *o* da *pelo*: *passo pelo calçadão*. La contracción con *por* es obligatoria.")
cz(W, 1, "Eu ___ o jantar. (fazer, presente)", "faço", "fazer → eu faço.")
cz(W, 1, "Ontem eu ___ à praia. (ir)", "fui", "ir en perfeito: eu fui.")
cz(W, 1, "Estou ___ uma tapioca. (comer)", "comendo", "estar + gerúndio: comendo.")
cz(W, 2, "Vou ___ ônibus. (en)", "de", "Medio de transporte: de ônibus.")

tr(W, 1, "Ayer vi el Pan de Azúcar.", "Ontem vi o Pão de Açúcar.",
   ["Ontem eu vi o Pão de Açúcar.", "Vi o Pão de Açúcar ontem.", "Eu vi o Pão de Açúcar ontem."],
   "ver → eu vi. Pão de Açúcar con ã y ç.")
tr(W, 2, "El hermano de ella vive en Niterói.", "O irmão dela mora em Niterói.", [],
   "«De ella» va detrás del sustantivo como *dela*: *o irmão dela*. «Vivir en» es *morar em*.")
tr(W, 0, "Hay mucha gente en la playa.", "Tem muita gente na praia.", ["Há muita gente na praia."],
   "Hay = tem / há; muita concuerda con gente; em + a = na.")

fx(W, 2, "a_personal", "Conheci ao Pedro na praia.", "ao Pedro", "o Pedro",
   "No hay «a» personal en portugués: conheci o Pedro (o es el artículo).")
fx(W, 0, "muito", "Elas são muitas simpáticas.", "muitas", "muito",
   "Ante adjetivo, muito no concuerda: muito simpáticas.")

ty(W, 1, "Escribí la forma de «poder» para «eu» en presente.", "eu ___ (poder)", "posso",
   "poder → eu posso, con ss.")
ty(W, 2, "Escribí «de + aquele» en una palabra.", "de + aquele → ___", "daquele",
   "*De* + *aquele* se contrae en *daquele* (igual *daquela, daquilo*). En español «de aquel» queda separado.")
