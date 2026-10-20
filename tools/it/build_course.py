#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Assemble the playable course from the extracted banks + the authored items.

Reads   tools/it/fuentes/bank_dummies.json, tools/it/fuentes/bank_routledge.json
        (extractos de libros comerciales: no se publican, por eso no van en docs/)
        tools/it/authored/*.py
Writes  docs/lang/it/data/course.json   (52 weekly missions + the graded item bank)

Run:  python3 tools/it/build_course.py
"""
import importlib.util
import json
import os
import re
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
DATA = os.path.join(ROOT, "docs", "lang", "it", "data")
FUENTES = os.path.join(ROOT, "tools", "it", "fuentes")

# --------------------------------------------------------------------------
# El programa del año.  d = capítulos de "Italian Grammar For Dummies"
#                       r = capítulos de "Soluzioni" (Routledge)
#                       t = temas del banco de ítems propios
#                       v = verbos y tiempos del gimnasio de conjugación
# --------------------------------------------------------------------------
# --------------------------------------------------------------------------
# Lo que se aprende a hacer cada semana y su campo léxico, siguiendo la
# estructura por unidades comunicativas de los cursos oficiales (Dante, IIC,
# Università per Stranieri; síntesis del Profilo della lingua italiana y de
# Nuovo Espresso / Nuovo Contatto): cada semana de gramática es también una
# unidad con una función y un tema, como en esos programas.
# --------------------------------------------------------------------------
SAI_FARE = {
    1: ("Saludar, despedirte y deletrear tu nombre", "Saludos, tu / Lei, alfabeto"),
    2: ("Nombrar cosas y decir qué hay (c'è / ci sono)", "Aula y objetos cotidianos"),
    3: ("Pedir algo en el bar y decir qué hay", "Café y bar italiano; partitivo"),
    4: ("Presentarte y describir personas: nacionalidad, edad, trabajo", "Países, profesiones, aspecto físico"),
    5: ("Pedir, pagar y contar tu rutina", "Bar y restaurante; la jornada"),
    6: ("Moverte por la ciudad: ir, hacer, venir, salir", "Lugares de la ciudad"),
    7: ("Decir la hora, las fechas y los horarios", "Días, meses, estaciones, precios"),
    8: ("Preguntar y dar direcciones", "Indicaciones, la ciudad"),
    9: ("Decir dónde estás, adónde vas y de dónde venís", "Lugares y medios de transporte"),
    10: ("Ofrecer, agradecer y pedir favores sin repetir nombres", "Regalos, favores"),
    11: ("Contar lo que hiciste el fin de semana", "ieri, la settimana scorsa"),
    12: ("Contar tu jornada; dar instrucciones y consejos", "Rutina, cuerpo, farmacia"),
    13: ("Manejarte en las situaciones cotidianas de A1 y A2", "Repaso de la primera estación"),
    14: ("Hablar de gustos, invitar, aceptar y rechazar", "Hobbies, deporte, salidas"),
    15: ("Describir cómo eran las cosas y contar una historia ordenada", "Infancia, escuela; regiones de Italia"),
    16: ("Contar lo que hiciste ayer, de la mañana a la noche", "Rutina y viajes"),
    17: ("Describir la familia y la casa; señalar y cuantificar", "Familia, ambientes y muebles"),
    18: ("Negar, exclamar y reaccionar", "Conversación cotidiana"),
    19: ("Hablar de planes y hacer suposiciones", "Vacaciones, trabajo"),
    20: ("Pedir con cortesía y expresar deseos", "Servicios, oficina"),
    21: ("Comprar, pedir cantidades y dar una receta", "Mercado, envases, cocina regional"),
    22: ("Contar experiencias y anécdotas", "Viajes, estudio"),
    23: ("Comparar y elegir", "Ropa, colores, talles"),
    24: ("Dar y pedir opiniones", "Temas de actualidad"),
    25: ("Expresar deseos, esperanzas y dudas", "Relaciones personales"),
    26: ("Contar, opinar y planificar con soltura", "Repaso de la segunda estación"),
    27: ("Matizar cómo, cuándo y cuánto", "Sociedad italiana"),
    28: ("Argumentar a favor y en contra", "Italia hoy"),
    29: ("Opinar sobre lo que ya pasó", "Actualidad"),
    30: ("Resumir una noticia y contar lo que otros querían", "Prensa, TV, redes"),
    31: ("Aconsejar y arrepentirte", "Vida laboral"),
    32: ("Discutir estereotipos con precisión temporal", "Italianos y extranjeros"),
    33: ("Poner condiciones e imaginar alternativas", "Mercado laboral; decisiones de vida"),
    34: ("Describir personas y cosas con precisión", "Amistad, pareja"),
    35: ("Hablar de problemas colectivos y describir normas", "Ecología, instituciones"),
    36: ("Describir usos y costumbres", "Ciudad y sociedad"),
    37: ("Leer relatos históricos y comentar un cuento", "Historia de Italia; narrativa"),
    38: ("Relatar lo que dijo otro", "Entrevistas, declaraciones"),
    39: ("Argumentar, relatar y matizar", "Repaso de la tercera estación"),
    40: ("Describir procesos: hacer hacer, dejar hacer", "Servicios y trámites"),
    41: ("Contar lo que viste y oíste", "Crónica"),
    42: ("Escribir un mail formal sin errores de régimen", "Lenguaje burocrático básico"),
    43: ("Condensar información con el infinitivo", "Ciencia y tecnología"),
    44: ("Condensar información con formas implícitas", "Ciencia y tecnología"),
    45: ("Usar lenguaje idiomático", "Modi di dire, humor e ironía"),
    46: ("Ampliar vocabulario por derivación", "Formación de palabras"),
    47: ("Leer y producir textos con datos", "Economía y política; periodismo"),
    48: ("Manejar el italiano neostandard hablado", "Variedades sociales y geográficas"),
    49: ("Sostener una tesis por escrito y oralmente; redactar informe y reseña", "Debate público; registro culto y coloquial"),
    50: ("Analizar textos y usar colocaciones sin caer en falsos amigos", "Autores del Novecento"),
    51: ("Matizar concesión, hipótesis y relación", "Sintaxis compleja"),
    52: ("Certificar tu C1", "PLIDA / CILS / CELI C1"),
}


WEEKS = [
    # ---------------- Stagione 1: Le Fondamenta (A1 -> A2) ----------------
    dict(w=1, title="Suoni e ortografia", level="A1", d=[], r=[],
         focus="El italiano se lee como se escribe, pero no como el español.",
         keys=["Dobles consonantes: cambian el significado (nono/nonno, casa/cassa).",
               "c/g suenan duras ante a, o, u y blandas ante e, i; ch/gh las endurecen.",
               "gli y sc(e/i): sonidos que el español no tiene; gn suena como ñ.",
               "El acento gráfico marca la sílaba final tónica (città, perché) y algunos monosílabos (è, più).",
               "Siete vocales: é/è y ó/ò abiertas o cerradas; v no es b; scuola sin e.",
               "essere y avere en presente: los dos primeros verbos, de memoria."],
         v=["essere", "avere"], t=["ortografia"]),
    dict(w=2, title="Nomi: genere e numero", level="A1", d=[3], r=[1],
         focus="Los sustantivos y sus plurales, incluidos los que no se mueven.",
         keys=["-o → -i, -a → -e, -e → -i.",
               "Invariables: crisi, città, film, sport.",
               "Plurales en -chi/-ghi para conservar el sonido duro.",
               "Irregulares frecuentes: uomo/uomini, uovo/uova, mano (f.)."],
         v=["essere", "avere"], t=[]),
    dict(w=3, title="Articoli determinativi e indeterminativi", level="A1", d=[3], r=[2],
         focus="El artículo italiano depende del sonido que sigue, no solo del género.",
         keys=["lo/gli ante z, s+consonante, gn, ps, x, y.",
               "il/i en el resto de los masculinos; l' ante vocal.",
               "Preposiciones articuladas: del, al, dal, nel, sul.",
               "El italiano usa artículo donde el español lo omite (il mio libro, l'Italia, studio l'italiano)."],
         v=["essere", "avere"], t=["articoli"]),
    dict(w=4, title="Aggettivi qualificativi", level="A1", d=[5], r=[3],
         focus="Concordancia y las tres formas irregulares que aparecen todo el tiempo.",
         keys=["Adjetivos en -o (4 formas) y en -e (2 formas).",
               "bello y quello siguen al artículo: bel, bello, begli, bei.",
               "buono en singular sigue a un/uno/una: buon giorno.",
               "santo → San, Sant', Santo, Santa.",
               "Posición: normalmente después, pero delante cambia el matiz."],
         v=["essere", "avere"], t=["aggettivi"]),
    dict(w=5, title="Presente indicativo: verbi regolari", level="A1", d=[6], r=[18],
         focus="Las tres conjugaciones y las reglas ortográficas que las deforman.",
         keys=["-are, -ere, -ire, más los -ire con infijo -isc- (finisco).",
               "-care/-gare añaden h ante i/e: cerchi, paghi.",
               "-ciare/-giare pierden la i: mangi, cominci.",
               "El sujeto pronominal se omite salvo para contrastar."],
         v=["parlare", "vendere", "dormire", "finire", "cercare", "mangiare"],
         tenses=["presente"], t=[]),
    dict(w=6, title="Presente indicativo: verbi irregolari", level="A1", d=[7], r=[18],
         focus="Los quince irregulares que cubren la mitad de lo que vas a decir.",
         keys=["essere, avere, andare, stare, dare, fare.",
               "Modales: potere, volere, dovere, sapere.",
               "venire, tenere, uscire, rimanere, salire.",
               "Muchos comparten patrón: -go en io/loro (vengo/vengono).",
               "stare + gerundio (sto leggendo) solo para lo que pasa ahora."],
         v=["essere",
 "avere",
 "andare",
 "stare",
 "dare",
 "fare",
 "potere",
 "volere",
 "dovere",
 "sapere",
 "venire",
 "uscire"],
         tenses=["presente"], t=[]),
    dict(w=7, title="Numeri, date e ora", level="A2", d=[4], r=[17],
         focus="Contar, fechar y decir la hora sin traducir del español.",
         keys=["Los números se escriben en una sola palabra: quattrocentosessantaquattro.",
               "Fechas con artículo y número cardinal: il 3 marzo; solo el 1 es ordinal.",
               "La hora va en femenino plural: sono le due; excepciones è l'una, è mezzogiorno.",
               "Reloj de 24 horas en contextos formales."],
         v=["essere", "avere"], t=[]),
    dict(w=8, title="Domande e interrogativi", level="A2", d=[11], r=[10],
         focus="Preguntar sin invertir el orden como en inglés.",
         keys=["chi, che/che cosa, quale/quali, quanto, come, dove, quando, perché.",
               "La pregunta sí/no se marca solo con la entonación.",
               "Con preposición, esta va delante: Di chi è? A che ora?",
               "quale ante è se apocopa: qual è (sin apóstrofo)."],
         v=["essere", "fare", "andare"],
         tenses=["presente"], t=["interrogativi"]),
    dict(w=9, title="Preposizioni di base", level="A2", d=[12], r=[15],
         focus="Las preposiciones que no se pueden traducir del español una a una.",
         keys=["in + países y regiones; a + ciudades.",
               "da + persona = a casa de; da + tiempo = desde hace.",
               "Preposiciones articuladas obligatorias: nel, sul, dal, del.",
               "in/a con medios y lugares: in treno, a piedi, al mare, in montagna."],
         v=["andare", "venire", "stare"],
         tenses=["presente"], t=["preposizioni"]),
    dict(w=10, title="Pronomi personali", level="A2", d=[8], r=[7],
         focus="Objeto directo, indirecto y las formas tónicas.",
         keys=["Directo: mi, ti, lo, la, ci, vi, li, le.",
               "Indirecto: mi, ti, gli, le, ci, vi, gli.",
               "Tónicos tras preposición: con me, per te, secondo lui.",
               "Enclíticos con infinitivo e imperativo: dirmi, dimmi."],
         v=["parlare", "dare", "dire"],
         tenses=["presente"], t=[]),
    dict(w=11, title="Passato prossimo", level="A2", d=[16], r=[20],
         focus="El pasado que más vas a usar, y la guerra de los auxiliares.",
         keys=["avere + participio para transitivos.",
               "essere + participio con concordancia para movimiento y cambio de estado.",
               "Participios irregulares: fatto, detto, visto, preso, scritto, letto.",
               "Con avere concuerda solo si el objeto va antes en pronombre: le ho viste.",
               "già, mai, ancora, appena van entre auxiliar y participio: ho già mangiato."],
         v=["parlare",
 "andare",
 "fare",
 "vedere",
 "prendere",
 "scrivere",
 "leggere",
 "venire"],
         tenses=["passatoProssimo"], t=["passato"]),
    dict(w=12, title="Riflessivi e imperativo", level="A2", d=[9], r=[22],
         focus="Rutina diaria y órdenes: dos bloques que se aprenden juntos.",
         keys=["Reflexivos: mi alzo, ti lavi, si veste.",
               "Imperativo tú de -are: parla (sin -i); el resto usa el presente.",
               "Usted usa el congiuntivo: parli, prenda, finisca.",
               "Negativo de tú: non + infinitivo (non parlare!).",
               "Con pronombre: dimmi, fallo, alzati; con Lei se antepone."],
         v=["alzarsi", "lavarsi", "vestirsi", "svegliarsi", "divertirsi"],
         tenses=["presente"], t=[]),
    dict(w=13, title="BOSS — Livello A2", level="A2", d=[3, 4, 5, 6, 7], r=[1, 2, 3], boss=True,
         focus="Examen de la primera estación: todo lo anterior, mezclado y cronometrado.",
         keys=["Sustantivos, artículos y adjetivos concordando sin pensarlo.",
               "Presente completo, regular e irregular.",
               "Passato prossimo con el auxiliar correcto.",
               "Pronombres objeto, reflexivos e imperativo.",
               "Preposiciones básicas."],
         v=["essere", "avere", "andare", "fare", "potere", "volere"],
         tenses=["presente", "passatoProssimo"], t=[]),

    # ---------------- Stagione 2: Il Ponte (A2 -> B1) ----------------
    dict(w=14, title="Piacere e verbi simili", level="A2", d=[10], r=[25],
         focus="La estructura invertida que también existe en español, pero con trampas.",
         keys=["mi piace + singular / mi piacciono + plural.",
               "El sujeto es la cosa que gusta, no la persona.",
               "En pasado va con essere: mi è piaciuta la mostra.",
               "Familia: mancare, servire, bastare, interessare, sembrare."],
         v=["piacere"],
         persons=[2, 5],
         tenses=["presente", "passatoProssimo"], t=["piacere"]),
    dict(w=15, title="Imperfetto e il contrasto con il passato prossimo", level="A2", d=[16], r=[20],
         focus="No es cuestión de duración: es cuestión de qué estás mirando.",
         keys=["Imperfetto: fondo, costumbre, descripción, edad, hora, estado.",
               "Passato prossimo: acción cerrada que hace avanzar el relato.",
               "Mentre + imperfetto / quando + passato prossimo.",
               "Irregulares: ero, facevo, dicevo, bevevo."],
         v=["essere", "fare", "dire", "bere", "avere", "parlare"],
         tenses=["imperfetto", "passatoProssimo"], t=["passato"]),
    dict(w=16, title="Riflessivi al passato", level="A2", d=[17], r=[20],
         focus="Todos los reflexivos van con essere (salvo con modal y el pronombre pegado al infinitivo: ho dovuto alzarmi).",
         keys=["mi sono alzato/a, ci siamo divertiti/e.",
               "El participio concuerda con el sujeto.",
               "Con objeto directo propio: si è lavata le mani.",
               "Recíprocos: si sono conosciuti a Roma."],
         v=["alzarsi", "divertirsi", "svegliarsi", "accorgersi", "fermarsi"],
         tenses=["passatoProssimo"], t=["riflessivi passato"]),
    dict(w=17, title="Dimostrativi, possessivi, indefiniti", level="A2", d=[13], r=[8, 9, 12],
         focus="Señalar, poseer y cuantificar.",
         keys=["questo/quello, con las formas de quello como bello.",
               "Posesivos con artículo: il mio libro.",
               "Parentesco singular sin artículo: mia sorella, tuo padre.",
               "Indefinidos: qualche + singular, alcuni + plural, ogni invariable."],
         v=["essere", "avere"],
         tenses=["presente", "passatoProssimo"], t=["possessivi"]),
    dict(w=18, title="Negazioni ed esclamazioni", level="A2", d=[], r=[11, 14],
         focus="La doble negación es obligatoria, no un error.",
         keys=["non ... niente/nessuno/mai/più/ancora.",
               "Si el negativo va delante, cae el non: nessuno è venuto.",
               "neanche/nemmeno/neppure = ni siquiera.",
               "Exclamaciones: Che bello! Quanto sei gentile! Come sei cambiato!"],
         v=["essere", "avere", "venire"],
         tenses=["presente", "passatoProssimo"], t=["negazioni"]),
    dict(w=19, title="Futuro semplice e anteriore", level="B1", d=[18], r=[19],
         focus="Futuro, y su uso más italiano: la suposición.",
         keys=["Raíz del infinitivo sin -e: parlerò, venderò, dormirò.",
               "Raíces contractas: sarò, avrò, andrò, verrò, vorrò, dovrò.",
               "Futuro de probabilidad: saranno le tre = serán las tres.",
               "Futuro anteriore para lo anterior a un futuro: quando avrò finito."],
         v=["essere",
 "avere",
 "andare",
 "venire",
 "volere",
 "dovere",
 "parlare"],
         tenses=["futuro", "futuroAnteriore"], t=[]),
    dict(w=20, title="Condizionale presente", level="B1", d=[18], r=[21],
         focus="Cortesía, deseo y noticia no confirmada.",
         keys=["Misma raíz que el futuro: vorrei, potrei, dovrei.",
               "vorrei y potrei son la base de toda cortesía.",
               "dovrei = debería; potrei = podría.",
               "Condicional de rumor en periodismo: il ministro sarebbe dimissionario."],
         v=["volere", "potere", "dovere", "essere", "avere", "piacere"],
         tenses=["condizionale"], t=[]),
    dict(w=21, title="Le particelle NE e CI", level="B1", d=[], r=[12, 25],
         focus="Dos palabritas que no existen en español y aparecen todo el tiempo.",
         keys=["ne = di + algo, y partitivo: ne ho due.",
               "ci = a + algo, y locativo: ci vado, ci credo.",
               "Con ne partitivo el participio concuerda: ne ho comprate tre.",
               "Verbos pronominales: andarsene, farcela, avercela, volerci, metterci."],
         v=["andare", "avere", "fare"],
         tenses=["presente", "passatoProssimo", "futuro"], t=["ne", "ci"]),
    dict(w=22, title="Pronomi combinati", level="B1", d=[], r=[7],
         focus="Dos pronombres en la misma frase, en el orden correcto.",
         keys=["Indirecto + directo: me lo, te la, ce ne, ve li.",
               "gli/le + lo → glielo, gliela, glieli, gliele, gliene.",
               "mi/ti/ci/vi pasan a me/te/ce/ve ante otro pronombre.",
               "Con infinitivo y modales hay dos posiciones válidas."],
         v=["dare", "dire", "mettere"],
         tenses=["presente", "passatoProssimo", "futuro"], t=["pronomi combinati"]),
    dict(w=23, title="Comparativi e superlativi", level="B1", d=[], r=[5],
         focus="di o che, y las formas irregulares que hay que saber de memoria.",
         keys=["più/meno ... di ante sustantivo o pronombre.",
               "più/meno ... che al comparar dos cualidades o dos infinitivos.",
               "Superlativo relativo: il più ... di.",
               "Absoluto en -issimo.",
               "migliore/peggiore/maggiore/minore; ottimo/pessimo/massimo/minimo."],
         v=["essere"],
         tenses=["presente", "passatoProssimo"], t=["comparativi"]),
    dict(w=24, title="Congiuntivo presente: forme", level="B1", d=[20], r=[24],
         focus="La forma es fácil; lo difícil viene después.",
         keys=["Se parte de la 1ª persona del presente: finisco → finisca.",
               "-are → i; -ere/-ire → a; noi = indicativo; voi siempre -iate.",
               "Las tres personas del singular son idénticas: hace falta el pronombre.",
               "Irregulares clave: sia, abbia, faccia, vada, possa, voglia, debba."],
         v=["parlare",
 "vendere",
 "dormire",
 "finire",
 "essere",
 "avere",
 "fare",
 "andare",
 "potere",
 "volere"],
         tenses=["congiuntivo"], t=["congiuntivo"]),
    dict(w=25, title="Congiuntivo: quando si usa", level="B1", d=[20], r=[24],
         focus="El punto donde el español te traiciona: credo che SIA, no «es».",
         keys=["Opinión, duda, deseo, emoción, voluntad → congiuntivo.",
               "Certeza y declaración → indicativo (so che, è chiaro che).",
               "Negar un verbo declarativo lo pasa a congiuntivo: non dico che sia.",
               "benché, sebbene, prima che, affinché, purché, a meno che.",
               "Superlativo y antecedente indefinido en relativas."],
         v=["essere", "avere", "sapere", "credere"],
         tenses=["congiuntivo"], t=["congiuntivo"]),
    dict(w=26, title="BOSS — Livello B1", level="B1", d=[16, 17, 18], r=[20, 21], boss=True,
         focus="Examen de la segunda estación: pasados, futuros, pronombres y congiuntivo presente.",
         keys=["Passato prossimo e imperfetto elegidos sin dudar.",
               "Futuro y condizionale con raíces irregulares.",
               "Pronombres combinados, ne y ci.",
               "Congiuntivo presente después de opinión, deseo y duda.",
               "Comparativos y negaciones en frases largas."],
         v=["essere", "avere", "fare", "andare", "venire", "volere"],
         tenses=["passatoProssimo", "imperfetto", "futuro", "condizionale"], t=[]),

    # ---------------- Stagione 3: La Corrente (B1 -> B2) ----------------
    dict(w=27, title="Avverbi", level="B1", d=[15], r=[4],
         focus="Formación en -mente y el orden de los adverbios.",
         keys=["Adjetivo femenino + -mente: lentamente.",
               "Adjetivos en vocal + -le/-re pierden la e: facilmente, particolarmente.",
               "Irregulares: bene, male, meglio, peggio.",
               "Posición: normalmente después del verbo (parla lentamente)."],
         v=["parlare", "andare"],
         tenses=["presente", "passatoProssimo", "imperfetto"], t=["avverbi"]),
    dict(w=28, title="Connettivi e transizioni", level="B1", d=[14], r=[16],
         focus="Hilar frases: el primer salto real de nivel.",
         keys=["e, ma, però, anzi, invece, mentre.",
               "perché no abre frase: usá siccome, poiché, dato che.",
               "quindi, dunque, perciò para consecuencia.",
               "inoltre, tuttavia, infatti para el registro escrito."],
         v=["essere", "avere"],
         tenses=["presente", "congiuntivo"], t=["connettivi"]),
    dict(w=29, title="Congiuntivo passato", level="B2", d=[22], r=[24],
         focus="Opinión presente sobre un hecho pasado.",
         keys=["abbia/sia + participio.",
               "Penso che sia partito ieri.",
               "Concordancia del participio con essere.",
               "Se usa cuando el verbo principal está en presente o futuro."],
         v=["parlare", "partire", "fare", "essere"],
         tenses=["congiuntivoPassato"], t=["congiuntivo", "concordanza"]),
    dict(w=30, title="Congiuntivo imperfetto e trapassato", level="B2", d=[], r=[24],
         focus="Las dos formas que hacen falta para hablar del pasado con matiz.",
         keys=["Imperfetto: parlassi, vendessi, dormissi; irregulares fossi, facessi, dessi, stessi.",
               "Trapassato: avessi/fossi + participio.",
               "Aparecen tras verbo principal en pasado y en el periodo hipotético.",
               "Son la marca del italiano culto: sin ellas te quedás en B1."],
         v=["parlare", "essere", "fare", "dare", "stare", "avere"],
         tenses=["congImperfetto",
 "congiuntivoTrapassato"], t=["congiuntivo"]),
    dict(w=31, title="Condizionale passato", level="B2", d=[21], r=[21],
         focus="«Habría» y el futuro visto desde el pasado.",
         keys=["avrei/sarei + participio.",
               "Arrepentimiento: avrei dovuto studiare.",
               "avrei potuto / avrei dovuto / avrei voluto.",
               "Futuro en el pasado: mi ha detto che sarebbe arrivato tardi."],
         v=["dovere", "potere", "volere", "venire", "fare"],
         tenses=["condizionalePassato"], t=["concordanza"]),
    dict(w=32, title="Concordanza dei tempi", level="B2", d=[], r=[24],
         focus="Qué tiempo pide qué tiempo: la regla que ordena todo el sistema.",
         keys=["Principal en presente + simultáneo → congiuntivo presente.",
               "Principal en presente + anterior → congiuntivo passato.",
               "Principal en pasado + simultáneo → congiuntivo imperfetto.",
               "Principal en pasado + anterior → congiuntivo trapassato.",
               "Futuro en el pasado = condizionale passato (disse che sarebbe venuto)."],
         v=["essere", "avere", "venire", "partire"],
         tenses=["congiuntivo",
 "congiuntivoPassato",
 "congImperfetto",
 "congiuntivoTrapassato"], t=["concordanza"]),
    dict(w=33, title="Periodo ipotetico", level="B2", d=[19], r=[21, 24],
         focus="Los tres tipos, y la prohibición absoluta del condicional tras «se».",
         keys=["Tipo I real: se ho tempo, ti chiamo.",
               "Tipo II irreal presente: se avessi tempo, ti chiamerei.",
               "Tipo III irreal pasado: se avessi avuto tempo, ti avrei chiamato.",
               "Mixtos: condición pasada, consecuencia presente.",
               "Nunca «se + condizionale»."],
         v=["avere", "essere", "potere", "venire"],
         tenses=["congImperfetto",
 "congiuntivoTrapassato",
 "condizionale",
 "condizionalePassato"], t=["periodo ipotetico"]),
    dict(w=34, title="Pronomi relativi", level="B2", d=[], r=[13],
         focus="che, cui, il quale: elegir bien alarga las frases sin romperlas.",
         keys=["che como sujeto u objeto, sin preposición.",
               "cui siempre con preposición: di cui, a cui, in cui, con cui.",
               "il cui / la cui para el posesivo.",
               "quello che / ciò che = lo que; il che retoma toda una frase."],
         v=["essere", "parlare"],
         tenses=["presente", "passatoProssimo"], t=["relativi"]),
    dict(w=35, title="La voce passiva", level="B2", d=[19], r=[26],
         focus="Tres auxiliares distintos, tres matices distintos.",
         keys=["essere + participio: pasiva neutra.",
               "venire + participio: subraya el proceso; solo tiempos simples.",
               "andare + participio: obligación (va fatto = debe hacerse).",
               "El agente va con da."],
         v=["fare", "scrivere", "vedere"],
         tenses=["passatoProssimo"], t=["passivo"]),
    dict(w=36, title="Si passivante e si impersonale", level="B2", d=[], r=[26],
         focus="La construcción con «si» que el español tiene pero usa distinto.",
         keys=["si passivante concuerda con el objeto: si vendono libri.",
               "si impersonale con verbo en 3ª singular: si dice, si va.",
               "Con si impersonal el adjetivo va en plural: quando si è stanchi.",
               "En pasado siempre con essere: si è mangiato bene."],
         v=["mangiare", "vendere", "dire"],
         tenses=["presente", "passatoProssimo"], t=["passivo", "si impersonale"]),
    dict(w=37, title="Passato remoto e trapassato remoto", level="B2", d=[], r=[20],
         focus="El pasado de la narrativa y del sur: hay que reconocerlo y saber usarlo.",
         keys=["Regular: parlai, vendei, dormii.",
               "Irregulares en el patrón 1-3-6: feci/facesti/fece/facemmo/faceste/fecero.",
               "Imprescindible para leer literatura y prensa histórica.",
               "Trapassato remoto solo tras conjunción temporal: appena ebbe finito."],
         v=["essere",
 "avere",
 "fare",
 "dire",
 "prendere",
 "vedere",
 "nascere",
 "conoscere",
 "scrivere"],
         tenses=["passatoRemoto", "trapassatoRemoto"], t=["passato remoto"]),
    dict(w=38, title="Discorso indiretto", level="B2", d=[], r=[24, 29],
         focus="Reportar lo que se dijo, con todos los desplazamientos.",
         keys=["Presente → imperfetto; passato prossimo → trapassato.",
               "Futuro → condizionale passato: disse che sarebbe venuto.",
               "Imperativo → di + infinitivo: mi disse di aspettare.",
               "Cambian también deícticos: oggi → quel giorno, qui → lì, domani → il giorno dopo."],
         v=["dire", "essere", "venire", "fare"],
         tenses=["imperfetto", "trapassatoProssimo", "condizionalePassato"], t=["discorso indiretto", "concordanza"]),
    dict(w=39, title="BOSS — Livello B2", level="B2", d=[19, 20, 21, 22], r=[24, 26], boss=True,
         focus="Examen de la tercera estación: subjuntivo, hipotéticos, pasiva y discurso indirecto.",
         keys=["Los cuatro tiempos del congiuntivo, elegidos por concordancia.",
               "Los tres periodos hipotéticos.",
               "Pasiva en sus tres formas y el si passivante.",
               "Passato remoto para leer y discurso indirecto para contar."],
         v=["essere", "avere", "fare", "potere", "venire"],
         tenses=["congiuntivo",
 "congImperfetto",
 "congiuntivoPassato",
 "condizionalePassato"], t=["congiuntivo", "periodo ipotetico", "passivo"]),

    # ---------------- Stagione 4: La Vetta (B2 -> C1) ----------------
    dict(w=40, title="Il causativo: fare e lasciare", level="C1", d=[], r=[27],
         focus="Hacer que alguien haga algo: una construcción sin equivalente directo.",
         keys=["fare + infinito: ho fatto riparare la macchina.",
               "farsi + infinito: mi sono fatto tagliare i capelli.",
               "lasciare + infinito = permitir.",
               "Con dos complementos, la persona pasa a indirecto: gliel'ho fatto leggere."],
         v=["fare", "vedere"],
         tenses=["passatoProssimo"], t=["causativo"]),
    dict(w=41, title="Verbi di percezione", level="C1", d=[], r=[27],
         focus="Ver, oír y sentir con infinitivo, relativa o completiva.",
         keys=["ho visto Maria uscire / Maria che usciva / che Maria usciva: tres matices.",
               "Con pronombre: l'ho vista uscire.",
               "sentire, vedere, guardare, ascoltare, osservare, notare.",
               "El infinitivo es la forma no marcada."],
         v=["vedere", "sentire", "ascoltare"],
         tenses=["passatoProssimo"], t=["percezione"]),
    dict(w=42, title="Verbi e preposizioni", level="C1", d=[], r=[28],
         focus="La lista que separa al que habla bien del que habla correcto.",
         keys=["Con a: cominciare, continuare, riuscire, provare, imparare, aiutare.",
               "Con di: decidere, cercare, finire, smettere, dimenticarsi, pentirsi.",
               "Sin preposición: modales, preferire, desiderare, amare, osare.",
               "Cambios de sentido: pensare a / pensare di, finire di / finire per."],
         v=["cominciare", "finire", "riuscire"],
         tenses=["passatoProssimo"], t=["preposizioni"]),
    dict(w=43, title="L'infinito", level="C1", d=[], r=[23],
         focus="El infinitivo como sujeto, como orden y como subordinada.",
         keys=["Infinitivo sustantivado: il mangiare, un continuo andare e venire.",
               "Infinitivo compuesto: dopo aver mangiato, per essere arrivato tardi.",
               "Instrucciones y avisos: non fumare, spingere, tirare.",
               "Si el sujeto es el mismo, se prefiere infinitivo al congiuntivo: spero di venire, no spero che io venga."],
         v=["fare", "essere", "avere"],
         tenses=["presente"], t=["infinito"]),
    dict(w=44, title="Gerundio e participio", level="C1", d=[], r=[23],
         focus="Las formas que comprimen dos frases en una.",
         keys=["Gerundio simple con sujeto compartido: studiando, ha imparato.",
               "Gerundio compuesto: avendo finito, è uscito.",
               "pur + gerundio = aunque.",
               "Participio absoluto: finita la riunione, siamo usciti.",
               "stare + gerundio solo para la acción en curso; «seguir + gerundio» = continuare A."],
         v=["fare", "dire", "bere", "porre"],
         tenses=["presente"], t=["gerundio", "participio"]),
    dict(w=45, title="Costruzioni verbali speciali", level="C1", d=[], r=[25],
         focus="Verbos pronominales idiomáticos y construcciones fijas.",
         keys=["andarsene, farcela, avercela con, prendersela, cavarsela.",
               "volerci vs metterci.",
               "stare per + infinitivo = estar a punto de.",
               "finire per, finire con l', mettersi a, stare a."],
         v=["andare", "fare", "avere", "stare"],
         tenses=["presente", "passatoProssimo"], t=["ne", "ci", "costruzioni"]),
    dict(w=46, title="Suffissi e alterazione", level="C1", d=[], r=[6],
         focus="Un recurso que el italiano usa muchísimo más que el español.",
         keys=["-ino/-etto/-ello: pequeño o afectivo.",
               "-one: aumentativo (un librone).",
               "-accio: despectivo (tempaccio, parolaccia).",
               "No todo se puede alterar: hay combinaciones fijas y lexicalizadas."],
         v=["essere"],
         tenses=["presente", "imperfetto", "futuro"], t=["suffissi"]),
    dict(w=47, title="Numerali, misure e quantità", level="C1", d=[], r=[17],
         focus="Cantidad precisa: donde se nota si sos turista o residente.",
         keys=["Ordinales: primo ... decimo, luego -esimo.",
               "Colectivos: un paio, una decina, un centinaio, migliaia.",
               "Fracciones y porcentajes: due terzi, il 20 per cento.",
               "Medidas y el partitivo: del pane, un po' di, qualche."],
         v=["essere", "avere"],
         tenses=["presente", "passatoProssimo"], t=["numerali"]),
    dict(w=48, title="Ordine delle parole e dislocazioni", level="C1", d=[], r=[29],
         focus="El orden marcado: lo que suena italiano de verdad.",
         keys=["Dislocación a la izquierda con pronombre de retoma: il pane lo compro io.",
               "Dislocación a la derecha: lo sapevo già, questo.",
               "Frase escindida: è questo che non capisco.",
               "c'è + relativa como presentativo: c'è Marco che ti aspetta.",
               "Inversión sujeto-verbo con inacusativos: è arrivato il treno."],
         v=["essere", "avere", "arrivare"],
         tenses=["presente", "passatoProssimo"], t=["ordine"]),
    dict(w=49, title="Registro alto e coesione testuale", level="C1", d=[], r=[16, 29],
         focus="Escribir y argumentar como un nativo culto.",
         keys=["Conectores de registro alto: nonostante, malgrado, qualora, laddove, in quanto, ove.",
               "Nominalización: l'aumento dei prezzi anziché i prezzi sono aumentati.",
               "Ordenar el argumento: in primo luogo, per di più, d'altra parte, in definitiva.",
               "Evitar el calco del español en la subordinación."],
         v=["essere", "porre", "trarre", "tradurre"],
         tenses=["congiuntivo", "condizionale"], t=["connettivi"]),
    dict(w=50, title="Lessico avanzato e falsi amici", level="C1", d=[], r=[6],
         focus="La última trampa del hispanohablante: el vocabulario que se parece.",
         keys=["burro, salire, aceto, guardare, prima, largo, esito, imbarazzata.",
               "Matices: sapere/conoscere, portare/prendere, andare/venire.",
               "Colocaciones fijas: prendere una decisione, fare una domanda.",
               "Sufijos y alteración como recurso expresivo."],
         v=["sapere", "conoscere", "prendere"],
         tenses=["presente", "passatoProssimo"], t=["falsi amici", "espressioni"]),
    dict(w=51, title="Ripasso generale C1", level="C1", d=[19, 20, 21, 22], r=[24, 26, 27, 28, 29],
         focus="Barrido final de todo lo que da problemas.",
         keys=["Congiuntivo y concordancia de tiempos automáticos.",
               "Periodo hipotético en los tres tipos y mixtos.",
               "Causativo, pasiva y si passivante.",
               "Dislocaciones y registro."],
         v=["essere",
 "avere",
 "fare",
 "porre",
 "tradurre",
 "venire",
 "rimanere"],
         tenses=["congiuntivo",
 "congImperfetto",
 "congiuntivoTrapassato",
 "condizionalePassato",
 "passatoRemoto"], t=["congiuntivo",
 "periodo ipotetico",
 "passivo",
 "causativo",
 "ordine",
 "concordanza"]),
    dict(w=52, title="ESAME FINALE — Livello C1", level="C1", d=[16, 18, 19, 20, 21, 22], r=[20, 21, 24, 26, 27, 28, 29], boss=True,
         focus="El examen del año: 40 preguntas, todo el programa, sin ayudas.",
         keys=["Se aprueba con 85%.",
               "Mezcla ítems de los dos manuales, del gimnasio de conjugación y del banco C1.",
               "Si lo pasás, terminaste el año."],
         v=["essere",
 "avere",
 "fare",
 "dire",
 "porre",
 "tradurre",
 "trarre",
 "rimanere",
 "venire",
 "scegliere"],
         tenses=["congiuntivo",
 "congImperfetto",
 "congiuntivoPassato",
 "congiuntivoTrapassato",
 "condizionalePassato",
 "passatoRemoto",
 "futuroAnteriore"], t=["congiuntivo",
 "concordanza",
 "periodo ipotetico",
 "passivo",
 "causativo",
 "percezione",
 "preposizioni",
 "gerundio",
 "ordine",
 "relativi",
 "ne",
 "ci",
 "pronomi combinati",
 "falsi amici"]),
]


# Each block of exercises of "For Dummies" goes to the week of its topic, not
# to the week of its chapter: chapter 3 mixes nouns, articles and suffixes,
# chapter 8 simple and combined pronouns.  (chapter, first, last, weeks)
DUMMIES_WEEKS = [
    (3, 1, 30, [2]), (3, 31, 55, [3]), (3, 56, 60, [46]),
    (4, 1, 40, [7]),
    (5, 1, 30, [4]),
    (6, 1, 70, [5]),
    # essere y avere se enseñan en la semana 1 y se repasan en la 6
    (7, 1, 35, [1, 6]), (7, 36, 70, [6]),
    (8, 1, 30, [10]), (8, 31, 40, [22]), (8, 41, 45, [21]),
    (9, 1, 30, [12]),
    (10, 1, 55, [14]),
    (11, 1, 40, [8]),
    (12, 1, 40, [9]),
    (13, 1, 50, [17]),
    (14, 1, 20, [28]), (14, 21, 30, [34]),
    (15, 1, 20, [27]), (15, 21, 30, [23]),
    (16, 1, 50, [11]), (16, 51, 70, [15]),
    (17, 1, 20, [16]),
    (18, 1, 35, [19]), (18, 36, 55, [20]), (18, 56, 60, [31]),
    (19, 1, 40, [33]),
    (20, 1, 10, [24]), (20, 11, 30, [25]), (20, 31, 40, [30]),
    (21, 1, 30, [31]),
    (22, 1, 10, [29]), (22, 11, 20, [30]), (22, 21, 30, [32]),
]


# The exercises of "Soluzioni", section by section (the book restarts the
# numbering in every section): chapter → one list of home weeks per section,
# or a dict {exercise id: weeks} for the sections that mix topics.  A group
# whose grammar comes later still waits for it (tools/sillabo.py).
SFIDE_HOMES = {
    1: [[2]], 2: [[3]], 4: [[27]], 5: [[23]], 6: [[46]], 8: [[17]], 9: [[17]],
    10: [[8]], 11: [[18]], 12: [[17]], 13: [[34]], 14: [[18]], 15: [[9]],
    16: [[28]], 19: [[19]], 22: [[12]], 28: [[42]],
    7: [[10], [12], [10], [21], [21], [10], [10], [22], [22], [11]],
    17: [{"r17-04": [47], "*": [7]}, [7], [47]],
    18: [[5], [6], [5], [6], [6]],
    20: [[11], [15], [15], [15], [26], [37], [37]],
    21: [[20], [20], [31]],
    23: [[43], [43], [44], [44]],
    24: [{"r24-01": [24], "r24-02": [24], "r24-03": [24], "*": [25]},
         [29, 30, 33], [25, 29, 30], {"r24-04": [38], "r24-05": [38], "*": [32]}],
    25: [{"r25-04": [14], "r25-09": [14], "*": [45]}, [45], [36]],
    26: [[35], [36]],
    27: [[40], [40], [41], [41]],
}


def sfide_homes(chapter: int, seg: int, cid: str) -> list:
    secs = SFIDE_HOMES.get(chapter)
    if not secs:
        return []
    h = secs[min(seg, len(secs) - 1)]
    if isinstance(h, dict):
        return h.get(cid, h["*"])
    return h


def dummies_weeks(item_id: str) -> list:
    ch, n = (int(x) for x in re.match(r"d(\d+)-(\d+)", item_id).groups())
    for c, a, b, weeks in DUMMIES_WEEKS:
        if c == ch and a <= n <= b:
            return weeks
    raise ValueError("ejercicio de Dummies sin semana: %s" % item_id)


SEASONS = [
    dict(n=1, name="Le Fondamenta", weeks=[1, 13], level="A1 → A2",
         blurb="Sonidos, género, artículos, el presente completo y el passato prossimo."),
    dict(n=2, name="Il Ponte", weeks=[14, 26], level="A2 → B1",
         blurb="Imperfetto, futuro, condicional, ne y ci, pronombres combinados y congiuntivo presente."),
    dict(n=3, name="La Corrente", weeks=[27, 39], level="B1 → B2",
         blurb="Congiuntivo pasado, periodo hipotético, pasiva, passato remoto y discurso indirecto."),
    dict(n=4, name="La Vetta", weeks=[40, 52], level="B2 → C1",
         blurb="Causativo, formas no finitas, orden de palabras, registro alto y léxico C1."),
]


# --------------------------------------------------------------------------
# Normalización de los ítems extraídos de "For Dummies"
# --------------------------------------------------------------------------

def classify(directions: str) -> tuple:
    """Guess the drill type and give it a Spanish prompt."""
    d = directions.lower()
    if "into italian" in d:
        return "translate", "Traducí al italiano."
    if "into english" in d:
        return "translate_en", "Traducí al inglés."
    if "plural" in d:
        return "plural", "Escribí el plural."
    if "masculine or feminine" in d or "“m”" in d or '"m"' in d:
        return "gender", "¿Masculino (M) o femenino (F)?"
    if "write out the numbers" in d or "spelling out" in d:
        return "numbers", "Escribí el número en palabras."
    if "conjugat" in d:
        return "conjugate", "Conjugá el verbo."
    if "question" in d and "answer" in d:
        return "qa", "Respondé en italiano."
    return "cloze", "Completá la frase."


def split_answers(answer: str) -> list:
    """Accepted spellings for one book answer.

    The book writes alternative answers with ';' and word-bank answers with
    ','.  The full string always stays first: it is the printed answer, so it
    must grade as correct even when it also splits into parts.
    """
    out = [answer.strip()]
    for part in re.split(r";|/(?=\s)", answer):
        part = part.strip()
        if part and part not in out:
            out.append(part)
    # Only word lists split on commas («soltanto, solamente»); a sentence
    # with commas is one answer, not several.
    if "," in answer and all(len(p.split()) <= 2 for p in answer.split(",")):
        for part in answer.split(","):
            part = part.strip()
            if part and part not in out:
                out.append(part)
    return [x for x in out if x]


def load_lessons() -> dict:
    """Import tools/lessons/*.py and merge their LESSONS dicts."""
    out = {}
    folder = os.path.join(ROOT, "tools", "it", "lessons")
    for fn in sorted(os.listdir(folder)):
        if not fn.endswith(".py") or fn == "__init__.py":
            continue
        spec = importlib.util.spec_from_file_location(fn[:-3],
                                                      os.path.join(folder, fn))
        mod = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(mod)
        for week, lesson in getattr(mod, "LESSONS", {}).items():
            if week in out:
                raise ValueError("lezione doppia per la settimana %s" % week)
            out[week] = lesson
    return merge_extra_blocks(out, folder)


def extra_blocks(folder=None) -> tuple:
    """({week: [blocks]}, pin prefixes) of the lesson modules that add blocks
    to other lessons (EXTRA_BLOCKS: tools/it/lessons/c1_extra.py)."""
    folder = folder or os.path.join(ROOT, "tools", "it", "lessons")
    extra, pins = {}, []
    for fn in sorted(os.listdir(folder)):
        if not fn.endswith(".py") or fn == "__init__.py":
            continue
        spec = importlib.util.spec_from_file_location(fn[:-3], os.path.join(folder, fn))
        mod = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(mod)
        for week, blocks in getattr(mod, "EXTRA_BLOCKS", {}).items():
            extra.setdefault(week, []).extend(blocks)
        pins += list(getattr(mod, "PIN_PREFIXES", ()))
    return extra, pins


def merge_extra_blocks(lessons: dict, folder=None) -> dict:
    """Append the extra blocks to their week's lesson (a copy): in a lesson in
    parts they go to the last part, and the exercises named by the pin
    prefixes (c1-fp-27-…) go there too, whatever the parts' patterns say."""
    extra, pins = extra_blocks(folder)
    for week, blocks in extra.items():
        if week not in lessons:
            continue
        lesson = dict(lessons[week])
        first = len(lesson["blocks"])
        lesson["blocks"] = list(lesson["blocks"]) + list(blocks)
        if lesson.get("parts"):
            parts = [dict(p) for p in lesson["parts"]]
            last = parts[-1]
            last["blocks"] = list(last["blocks"]) + list(range(first, first + len(blocks)))
            last["prefix"] = list(last.get("prefix") or []) + [p % week for p in pins]
            lesson["parts"] = parts
        lessons[week] = lesson
    return lessons


# The lesson is read on a phone: short rule, then the table or the examples.
# Longer explanations go in "more", folded under «Más detalle».
LIMITS = {"intro": 35, "r": 30, "warn": 30, "tip": 30, "more": 70}


def _words(s: str) -> int:
    return len(re.sub(r"[*]", "", s).split())


def check_lesson(week: int, lesson: dict) -> list:
    """Sanity check on one lesson; returns a list of problems."""
    bad = []
    if not lesson.get("intro"):
        bad.append("settimana %s: manca l'intro" % week)
    elif _words(lesson["intro"]) > LIMITS["intro"]:
        bad.append("settimana %s: intro di %d parole (max %d)"
                   % (week, _words(lesson["intro"]), LIMITS["intro"]))
    blocks = lesson.get("blocks") or []
    if len(blocks) < 3:
        bad.append("settimana %s: solo %d blocchi" % (week, len(blocks)))
    known = {"h", "r", "table", "ex", "warn", "tip", "more", "q", "qq"}
    for i, b in enumerate(blocks, 1):
        extra = set(b) - known
        # «q»: checks written by hand, 3 options with the answer among them
        # («qq»: the same, but every one of them is asked after the block)
        for q in (b.get("q") or []) + (b.get("qq") or []):
            if q.get("answer") not in (q.get("options") or []) or len(set(q.get("options") or [])) != 3:
                bad.append("settimana %s blocco %d: chequeo «q» mal armado: %s" % (week, i, q.get("prompt")))
        if extra:
            bad.append("settimana %s blocco %d: chiavi ignote %s"
                       % (week, i, sorted(extra)))
        if not b.get("r"):
            bad.append("settimana %s blocco %d: manca la regola corta (r)" % (week, i))
        for k in ("r", "warn", "tip"):
            if b.get(k) and _words(b[k]) > LIMITS[k]:
                bad.append("settimana %s blocco %d: %s di %d parole (max %d)"
                           % (week, i, k, _words(b[k]), LIMITS[k]))
        for par in b.get("more") or []:
            if _words(par) > LIMITS["more"]:
                bad.append("settimana %s blocco %d: paragrafo di «more» di %d parole (max %d)"
                           % (week, i, _words(par), LIMITS["more"]))
        if len(b.get("more") or []) > 2:
            bad.append("settimana %s blocco %d: più di 2 paragrafi in «more»" % (week, i))
        if len(b.get("ex") or []) > 5:
            bad.append("settimana %s blocco %d: più di 5 esempi" % (week, i))
        t = b.get("table")
        if t:
            width = len(t.get("head", []))
            for r in t.get("rows", []):
                if len(r) != width:
                    bad.append("settimana %s blocco %d: riga di %d celle su %d"
                               % (week, i, len(r), width))
        for pair in b.get("ex", []):
            if len(pair) != 2:
                bad.append("settimana %s blocco %d: esempio malformato" % (week, i))
    return bad


def load_authored() -> list:
    """Import every tools/authored/*.py module and collect its ITEMS."""
    out = []
    folder = os.path.join(ROOT, "tools", "it", "authored")
    for fn in sorted(os.listdir(folder)):
        if not fn.endswith(".py"):
            continue
        spec = importlib.util.spec_from_file_location(fn[:-3],
                                                      os.path.join(folder, fn))
        mod = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(mod)
        for it in getattr(mod, "ITEMS", []):
            item = dict(it)
            item["src"] = "autore"
            item.setdefault("level", "C1" if item["id"].startswith("c1") else "B2")
            out.append(item)
    return out


def place_by_syllabus(weeks: list, by_id: dict, challenges: list) -> None:
    """Nothing is asked before its theory.

    Each week inherits whole book chapters, and a chapter on nouns can bring
    sentences in imperfetto or passato prossimo.  tools/sillabo.py tells from
    which week on an exercise can be understood; what a week cannot use yet
    moves to that week as review ("extra"), where the rounds mix it in.
    Sfide groups move whole, to the week their hardest item needs.
    """
    import sillabo

    # What a week's own lesson teaches ahead of the general order: week 12
    # teaches the Lei imperative, which is a congiuntivo form (parli, venga).
    local = {12: {"congiuntivo"}}

    def weeks_ok(feats, week):
        return all(v <= week or k in local.get(week, ()) for k, v in feats.items())

    import lessico
    seen_words = lessico.lesson_words({"weeks": weeks})
    feats = {iid: sillabo.min_week(it)[1] for iid, it in by_id.items()}
    for iid, it in by_id.items():
        # vocabulary: what the learner writes must be known by then
        feats[iid].update(lessico.item_vocab(it, seen_words))
    need = {iid: max(f.values()) if f else 1 for iid, f in feats.items()}
    for iid, it in by_id.items():
        # first week that can ask it: test_game.js checks every week against it
        it["wk"] = next(w for w in range(1, 53) if weeks_ok(feats[iid], w))
    groups = {c["id"]: c for c in challenges}
    for c in challenges:
        c["week"] = max([need.get(i, 1) for i in c.get("play") or []] or [1])
        c["ok"] = lambda week, c=c: all(weeks_ok(feats.get(i, {}), week) for i in c.get("play") or [])
    by_week = {w["week"]: w for w in weeks}

    # Bosses and the C1 review weeks (49 registro, 50 lessico, 51 ripasso)
    # draw on whole chapters; the others keep each exercise only once.
    def review(w):
        return w["boss"] or w["week"] in (49, 50, 51)

    homes, group_homes = {}, {}
    for w in weeks:
        # the week's own sfide, item by item, next to the book items
        own = list(w["items"])
        for gid in w["challenges"]:
            own += groups[gid].get("play") or []
            if not review(w):
                group_homes.setdefault(gid, []).append(w["week"])
        w["items"] = own
        for iid in own:
            if not review(w):
                homes.setdefault(iid, []).append(w["week"])

    # One exercise, one week: the earliest of its homes where its grammar and
    # vocabulary are already taught.  Otherwise it waits, as review, for the
    # week that teaches what it needs.
    first = {iid: min([h for h in hs if weeks_ok(feats.get(iid, {}), h)] or [0])
             for iid, hs in homes.items()}
    gfirst = {gid: min([h for h in hs if groups[gid]["ok"](h)] or [0])
              for gid, hs in group_homes.items()}
    moved = {}
    for w in weeks:
        keep = []
        for iid in w["items"]:
            if iid in keep:
                continue
            if review(w):
                if weeks_ok(feats.get(iid, {}), w["week"]):
                    keep.append(iid)
            elif first.get(iid) == w["week"] or (
                    by_id[iid].get("src") == "autore" and weeks_ok(feats.get(iid, {}), w["week"])):
                keep.append(iid)       # own items are written per topic: they may repeat
            elif not first.get(iid):
                moved[iid] = need[iid]
        w["items"] = keep
        w["extra"] = []
        if review(w):
            w["challenges"] = [g for g in w["challenges"] if groups[g]["ok"](w["week"])]
        else:
            w["challenges"] = [g for g in w["challenges"] if gfirst.get(g) == w["week"]]

    for iid, wk in sorted(moved.items()):
        target = by_week.get(wk)
        if target and iid not in target["items"] and iid not in target["extra"]:
            target["extra"].append(iid)
    placed = {g for w in weeks for g in w["challenges"] if not review(w)}
    for gid in sorted(set(group_homes) - placed):
        target = by_week.get(groups[gid]["week"])
        if target and gid not in target["challenges"]:
            target["challenges"].append(gid)
    # Las semanas de repaso (los jefes, 49-51) recogían todas las sfide de su
    # tramo: 118 grupos en la semana 52, cuatro horas.  Se quedan con una
    # muestra pareja de a lo sumo SFIDE_CAP.
    SFIDE_CAP = 12
    for w in weeks:
        if review(w) and len(w["challenges"]) > SFIDE_CAP:
            lst = w["challenges"]
            step = len(lst) / SFIDE_CAP
            w["challenges"] = [lst[int(i * step)] for i in range(SFIDE_CAP)]
    # Una semana propia con más de SFIDE_CAP grupos (la 19 tenía 40) pasa el
    # sobrante a las semanas siguientes con lugar: la teoría ya está.
    carry = []
    for w in weeks:
        if review(w):
            continue
        lst = w["challenges"] + [g for g in carry if g not in w["challenges"]]
        carry = lst[SFIDE_CAP:]
        w["challenges"] = lst[:SFIDE_CAP]
    if carry:
        weeks[-1]["challenges"] += [g for g in carry if g not in weeks[-1]["challenges"]]
    for c in challenges:
        del c["ok"]
    # Which tenses the conjugation gym may use as distractors in each week.
    for w in weeks:
        w["known"] = ["presente"] + [t for t, k in sorted(sillabo.TENSE_WEEK.items(), key=lambda x: x[1])
                                     if t != "presente" and k <= w["week"]
                                     and t not in ("imperativo", "passivo", "gerundio")]
    # The conjugation gym weighs 35% of a round when the week (or its season
    # start) brings a new tense, 15% when it would only repeat old ones.
    for w in weeks:
        new = any(sillabo.TENSE_WEEK.get(t) == w["week"] for t in w["tenses"])
        # 6 irregular present, 16 reflexive past: new forms, same tense name
        w["gymShare"] = 0.35 if new or w["week"] in (1, 6, 16) else 0.15
    print("sillabo: %d ejercicios pasan a una semana posterior, a su teoría" % len(moved))


def clean_week_50(weeks: list, by_id: dict) -> None:
    """Week 50 (lessico C1) keeps C1 lexicon and word formation.

    As a review week it drew whole chapters, and 123 of its 179 items needed
    only the grammar of week 9 or earlier (a / in / da, falsos amigos A2:
    «Vado ___ supermercato»).  The prepositions chapter no longer comes in
    (WEEKS: r=[6]); what still asks week-9 grammar leaves the week: it stays
    where it already lives (week 9, 46, the extras of 10-31) or, if it lived
    only here, goes to the review of week 13 (the boss of the first season).
    """
    by_week = {w["week"]: w for w in weeks}
    w50, w13 = by_week[50], by_week[13]
    elsewhere = {i for w in weeks if w["week"] != 50 and not w["boss"] for i in w["items"] + w["extra"]}
    keep = []
    for iid in w50["items"]:
        if by_id[iid].get("wk", 1) > 9 or by_id[iid].get("w") == 50:
            keep.append(iid)       # the week's own C1 items (w=50) stay
        elif iid not in elsewhere:
            w13["extra"].append(iid)
    w50["items"] = keep


def main() -> None:
    with open(os.path.join(FUENTES, "bank_dummies.json"), encoding="utf-8") as fh:
        dummies = json.load(fh)
    with open(os.path.join(FUENTES, "bank_routledge.json"), encoding="utf-8") as fh:
        routledge = json.load(fh)
    # The book restarts exercise numbers in every subsection, so the same id
    # can name several exercises: make each one unique (r07-02, r07-02b…),
    # otherwise scoring one would score them all.
    seen_ids = {}
    for c in routledge["chapters"]:
        seg, prev = -1, 10 ** 9
        for x in c["challenges"]:
            # the book restarts numbering in every section: a restart = a new
            # section, which decides the week of the exercise (SFIDE_HOMES)
            num = int(re.match(r"r\d+-(\d+)", x["id"]).group(1))
            if num <= prev:
                seg += 1
            prev = num
            x["homes"] = sfide_homes(c["chapter"], seg, x["id"])
            n = seen_ids.get(x["id"], 0)
            seen_ids[x["id"]] = n + 1
            if n:
                x["id"] = x["id"] + "abcdefghijklmnopqrstuvwxyz"[n]

    # --- graded items from the Dummies bank -----------------------------
    # tools/it/fuentes/parches/dummies/*.json rewrites each exercise for a Spanish
    # speaker: specific instruction, blank where the answer goes, no English.
    patches = {}
    pdir = os.path.join(FUENTES, "parches", "dummies")
    for fn in sorted(os.listdir(pdir)):
        if fn.endswith(".json"):
            with open(os.path.join(pdir, fn), encoding="utf-8") as fh:
                patches.update(json.load(fh)["items"])
    items = []
    for ch in dummies["chapters"]:
        for it in ch["items"]:
            pt = patches.get(it["id"])
            if pt:
                if pt.get("drop"):
                    continue
                accept = [pt["answer"]] + [a for a in pt.get("alt", []) if a and a != pt["answer"]]
                item = {"id": it["id"], "src": "dummies", "chapter": ch["chapter"],
                        "type": pt["type"], "prompt": pt["consigna"], "stem": pt["stem"],
                        "answer": pt["answer"], "accept": accept}
                if pt.get("options"):
                    item["options"] = pt["options"]
                if pt.get("note"):
                    item["note"] = pt["note"]
                items.append(item)
                continue
            kind, prompt = classify(it["directions"] or "")
            items.append({
                "id": it["id"],
                "src": "dummies",
                "chapter": ch["chapter"],
                "type": kind,
                "prompt": prompt,
                "stem": it["stem"],
                "answer": it["answer"],
                "accept": split_answers(it["answer"]),
                "example": it["example"],
                "hint": it["directions"],
            })

    authored = load_authored()
    lessons = load_lessons()
    for it in authored:
        it.setdefault("accept", [it["answer"]] + list(it.get("alt", [])))

    # --- weekly missions -------------------------------------------------
    by_chapter = {}
    for it in items:
        by_chapter.setdefault(it["chapter"], []).append(it["id"])
    by_topic = {}
    by_week_authored = {}
    exam_ids = {it["id"] for it in authored if it.get("topic") == "esame"}
    for it in authored:
        if it.get("w"):
            by_week_authored.setdefault(int(it["w"]), []).append(it["id"])
        else:
            by_topic.setdefault(it["topic"], []).append(it["id"])

    challenges = {c["chapter"]: c for c in routledge["chapters"]}

    by_dweek = {}
    for it in items:
        for wk in dummies_weeks(it["id"]):
            by_dweek.setdefault(wk, []).append(it["id"])

    weeks, missing = [], []
    for spec in WEEKS:
        pool = []
        for c in spec.get("d", []):
            if c not in by_chapter:
                missing.append("dummies cap. %s (settimana %s)" % (c, spec["w"]))
        if spec.get("boss") or spec["w"] == 51:
            # a boss (and the final review) draws on everything its season
            # (or the year) has taught: build_course keeps these items too
            first = 1 if spec["w"] == 52 else next(
                s["weeks"][0] for s in SEASONS if s["weeks"][0] <= spec["w"] <= s["weeks"][1])
            if spec["w"] == 51:
                first = 27
            for wk in range(first, spec["w"] + 1):
                pool += [i for i in by_dweek.get(wk, []) if i not in pool]
        else:
            pool += by_dweek.get(spec["w"], [])
        for t in spec.get("t", []):
            if t not in by_topic:
                missing.append("tema '%s' (settimana %s)" % (t, spec["w"]))
            pool += by_topic.get(t, [])
        # authored items that name their own week («w»): garden path,
        # scopri la regola, output empujado, contrastes, colocaciones…
        # The final exam's items (topic «esame», w=52) are only asked in the
        # exam: they stay out of week 52's training and of the boss round.
        pool += [i for i in by_week_authored.get(spec["w"], []) if i not in pool and i not in exam_ids]

        chal = []
        review = spec.get("boss") or spec["w"] in (49, 50, 51)
        for c in spec.get("r", []):
            if c not in challenges:
                missing.append("routledge cap. %s (settimana %s)" % (c, spec["w"]))
                continue
            # bosses and the review draw on whole chapters; a normal week
            # only on the sections of its topic
            chal += [x["id"] for x in challenges[c]["challenges"]
                     if review or spec["w"] in x["homes"]]
        if not review:
            chal += [x["id"] for c in challenges.values() for x in c["challenges"]
                     if spec["w"] in x["homes"] and x["id"] not in chal]

        season = next(s["n"] for s in SEASONS
                      if s["weeks"][0] <= spec["w"] <= s["weeks"][1])
        weeks.append({
            "week": spec["w"],
            "season": season,
            "title": spec["title"],
            "level": spec["level"],
            "focus": spec["focus"],
            "fare": SAI_FARE[spec["w"]][0],
            "tema": SAI_FARE[spec["w"]][1],
            "keys": spec["keys"],
            "lesson": lessons.get(spec["w"]),
            "boss": bool(spec.get("boss")),
            "refs": {
                "dummies": spec.get("d", []),
                "routledge": spec.get("r", []),
                "sections": [s for c in spec.get("r", [])
                             for s in (challenges.get(c, {}).get("sections") or [])],
            },
            "items": pool,
            "challenges": chal,
            "verbs": spec.get("v", []),
            "persons": spec.get("persons"),
            "tenses": spec.get("tenses", ["presente"]),
        })

    senza_lezione = [w["week"] for w in weeks if not w["lesson"]]
    if senza_lezione:
        missing.append("lezioni mancanti: %s" % senza_lezione)
    for w in weeks:
        if w["lesson"]:
            missing += check_lesson(w["week"], w["lesson"])

    if missing:
        print("ATTENZIONE, riferimenti mancanti:")
        for m in missing:
            print("  -", m)

    # Routledge challenges.  tools/it/fuentes/parches/sfide/*.json holds the answer
    # key: with it a challenge becomes a graded round (items "s:<id>:<label>"),
    # without it it stays self-scored.
    keys = {}
    sdir = os.path.join(FUENTES, "parches", "sfide")
    for fn in sorted(os.listdir(sdir)):
        if fn.endswith(".json"):
            with open(os.path.join(sdir, fn), encoding="utf-8") as fh:
                keys.update(json.load(fh))
    flat = []
    sfida_items = []
    for c in routledge["chapters"]:
        for x in c["challenges"]:
            ch = {
                "id": x["id"],
                "chapter": c["chapter"],
                "chapterTitle": c["title"],
                "instruction": x["instruction"],
                "items": x["items"],
            }
            k = keys.get(x["id"])
            if k:
                ch["consigna"] = k.get("consigna") or x["instruction"]
                if k.get("interactive") and k.get("items"):
                    ch["play"] = []
                    for n, ki in enumerate(k["items"]):
                        iid = "s:%s:%s" % (x["id"], ki.get("label") or n)
                        typ = ki.get("type", "cloze")
                        if typ == "choice" and not ki.get("options"):
                            typ = "cloze"
                        item = {"id": iid, "src": "sfida", "type": typ, "prompt": ch["consigna"],
                                "stem": ki["stem"], "answer": ki["answer"],
                                "accept": [ki["answer"]] + [a for a in ki.get("alt", []) if a and a != ki["answer"]]}
                        if typ == "choice":
                            item["options"] = ki["options"]
                        if ki.get("note"):
                            item["note"] = ki["note"]
                        sfida_items.append(item)
                        ch["play"].append(iid)
            flat.append(ch)

    place_by_syllabus(weeks, {i["id"]: i for i in items + authored + sfida_items}, flat)
    clean_week_50(weeks, {i["id"]: i for i in items + authored + sfida_items})

    course = {
        "title": "La Via C1",
        "seasons": SEASONS,
        "weeks": weeks,
        "items": items + authored + sfida_items,
        "challenges": flat,
        "sources": [dummies["source"], routledge["source"]],
    }
    # Lesson parts (tools/lessons: "parts"): a week studied in several short
    # sessions, each with its own practice.  Each exercise of the week goes
    # to the first part whose pattern matches its prompt, stem or answer;
    # what matches nothing goes to the last part (the sillabo already placed
    # it in this week, so the whole lesson covers it).
    by_id_all = {i["id"]: i for i in course["items"]}
    for w in weeks:
        lesson = w.get("lesson") or {}
        parts = lesson.get("parts")
        if not parts:
            w["parts"] = None
            continue
        compiled = [{"h": p["h"], "blocks": list(p["blocks"]), "items": []} for p in parts]
        for iid in w["items"]:
            it = by_id_all[iid]
            text = " ".join([it.get("prompt") or "", it.get("stem") or "", str(it.get("answer") or "")])
            ans = str(it.get("answer") or "").strip()
            home = len(parts) - 1
            # «ids»: exercises placed by hand in a part win over the patterns.
            fixed = [k for k, p in enumerate(parts) if iid in (p.get("ids") or [])
                     or any(iid.startswith(x) for x in p.get("prefix") or [])]
            for k, p in enumerate([] if fixed else parts):
                # The answer alone may name the part («il», «uno»), except for
                # patterns that exclude by lookahead: those read the whole text.
                if re.search(p["match"], text, re.I) or (
                        not p["match"].startswith("^(?!") and re.search(p["match"], ans, re.I)):
                    home = k
                    break
            if fixed:
                home = fixed[0]
            compiled[home]["items"].append(iid)
        w["parts"] = compiled
        blocks_in_parts = sorted(b for p in parts for b in p["blocks"])
        if blocks_in_parts != list(range(len(lesson["blocks"]))):
            raise SystemExit("semana %d: las partes no cubren todos los bloques una vez" % w["week"])

    # Words of the week: the new, not transparent words its exercises use most,
    # with the meaning and a sentence of the course where they appear.  They
    # are presented and practised before (and inside) the week's rounds.
    import collections
    import lessico
    import sillabo
    from bank.esempi import ESEMPI, NON_PAROLE
    from bank.consigli import TIPS
    by_id_all = {i["id"]: i for i in course["items"]}
    # Bank sentences whose grammar («w») is already taught can illustrate a
    # word its own week does not show in a full sentence.
    with open(os.path.join(DATA, "bank.json"), encoding="utf-8") as fh:
        bank_sents = [(it, snt.get("w", 1)) for snt in json.load(fh)["sentences"] for it in snt["it"]]

    lex_forms = sillabo.lexicon()["lemmas"]     # forma → lemas del conjugador

    def word_forms(word):
        fs = {word}
        if re.search(r"(are|ere|ire|rsi|rre)$", word):
            # only forms the conjugator knows as this verb: «dove» is not a
            # form of «dovere», «fine» not one of «finire»
            lemma = re.sub(r"rsi$", "re", word)
            for form, lemmas in lex_forms.items():
                if lemma in lemmas:
                    fs.add(form)
        elif word.endswith("o"):
            fs.update({word[:-1] + "i", word[:-1] + "a", word[:-1] + "e"})
        elif word.endswith("a"):
            fs.add(word[:-1] + "e")
        elif word.endswith("e"):
            fs.add(word[:-1] + "i")
        return fs

    def bank_example(word, week):
        best = None
        for it, w in bank_sents:
            if w > week or not 3 <= len(it.split()) <= 14:
                continue
            low = it.lower()
            if any(re.search(r"(?<![a-zà-ù'])" + re.escape(f) + r"(?![a-zà-ù])", low) for f in word_forms(word)):
                if best is None or len(it) < len(best):
                    best = it
        return best
    freq = collections.Counter()
    for it in course["items"]:
        r, wtxt = lessico.item_texts(it)
        for tok in lessico.words_of(r + " " + wtxt):
            lm = lessico.lemma_of(tok)
            if lm:
                freq[lm[0]] += 1
    given = set()
    # Weeks 1-4: words of the week's field, chosen by hand, with examples that
    # use only the grammar already seen (tools/it/bank/parole_settimana.py).
    # Every example is checked with the detector of the bank weeks: what a
    # week shows must not need a later week's grammar.
    import rasgos_banco
    from bank.parole_settimana import PAROLE

    ex_weeks = {}

    def ex_week(ex):
        if ex not in ex_weeks:
            ex_weeks[ex] = rasgos_banco.grammar(ex, produce=True)
        return ex_weeks[ex]
    late_examples = []
    for w in weeks:
        if w["week"] in PAROLE:
            for entry in PAROLE[w["week"]]:
                if ex_week(entry[2]) > w["week"]:
                    raise SystemExit("semana %d: el ejemplo de «%s» usa gramática de la semana %d: %s"
                                     % (w["week"], entry[0], ex_week(entry[2]), entry[2]))
            w["vocab"] = [list(e) for e in PAROLE[w["week"]]]
            given.update(e[0] for e in PAROLE[w["week"]])
            continue
        cand = collections.OrderedDict()
        late_now = set()        # words whose only example is for a later week
        texts = []
        for iid in w["items"]:
            it = by_id_all[iid]
            r, wtxt = lessico.item_texts(it)
            texts.append((r if it.get("type") != "translate" else wtxt, r + " " + wtxt))
        for b in (w.get("lesson") or {}).get("blocks", []):
            texts += [(p[0].replace("*", ""), p[0].replace("*", "")) for p in b.get("ex", [])]
        for show, t in texts:
            for tok in lessico.words_of(t):
                lm = lessico.lemma_of(tok)
                if not lm or lm[1] <= 0 or not lm[2] or lm[0] in given or lm[0] in cand:
                    continue
                if lessico.is_cognate(lm[0], lm[2]) or lessico.is_cognate(tok, lm[2]):
                    continue
                # «sei» is «you are» before it is «six»; «faccia», «letto» are
                # verb forms before nouns: a word list must not guess wrong
                lex = sillabo.lexicon()
                verbish = tok in lex["simple"] or tok in lex["participles"]
                if verbish and not re.search(r"(are|ere|ire|rre|rsi)$", lm[0]):
                    continue
                if tok in ("soldi", "soldo") or lm[0] == "soldo" or "'" in lm[0] or "’" in lm[0]:
                    continue
                # names and conjugated forms are not words of the week
                if lm[0] in NON_PAROLE or lm[2].strip().lower() == "nombre":
                    continue
                if lm[1] > max(w["week"], 1) and lm[1] != 1:
                    continue           # not yet in play at this level
                if w["week"] < rasgos_banco.W["numeri"] and rasgos_banco._NUM.match(lm[0]):
                    continue           # the numbers are taught in week 7
                cand[lm[0]] = [lm[0], lm[2].split(" / ")[0].split(";")[0].strip(), ""]
        lex = sillabo.lexicon()
        # The example: the shortest complete sentence of the week that has the
        # word itself (not «voglia» for volere), else one of its forms.
        for key, entry in cand.items():
            best_ex = None
            for show, _ in texts:
                ex = re.sub(r"\s+", " ", show).strip()
                # a real sentence, not a table row («zio → zii», «zia: femminile»)
                if not ex or "_" in ex or len(ex) > 70 or re.search(r"[→:=]|\s[.,?!]|\s—\s[a-zà-ù]|\b(?:a|da|di|su) (?:(?:il|lo|la|i|gli|le)(?![a-zà-ù])|l')", ex):
                    continue
                toks = lessico.words_of(ex)
                if len(ex.split()) < 3:
                    continue
                if ex_week(ex) > w["week"]:
                    continue           # a tense or a construction not seen yet
                if key in toks:
                    rank = (0, len(ex))
                # a conjugated form of the verb, once the presente is known,
                # and only a form that is plainly the verb (not «voglia»)
                elif w["week"] >= 5 and any(
                        (lessico.lemma_of(t) or [None])[0] == key and
                        "presente" in lex["simple"].get(t, []) for t in toks):
                    rank = (1, len(ex))
                else:
                    continue
                if best_ex is None or rank < best_ex[0]:
                    best_ex = (rank, ex)
            # A reviewed sentence wins over one lifted from an exercise (which
            # may use the word in another sense, or be a false statement of a
            # true/false exercise).
            auto = best_ex[1] if best_ex else (bank_example(key, w["week"]) or "")
            if auto and ex_week(auto) > w["week"]:
                auto = ""
            entry[2] = ESEMPI.get(key) or auto
            if ESEMPI.get(key) and ex_week(ESEMPI[key]) > w["week"]:
                if auto:
                    entry[2] = auto
                else:
                    late_now.add(key)      # the word waits for its grammar
                    late_examples.append((w["week"], key, ESEMPI[key]))
            # how the word is used: gender, preposition, irregular forms,
            # the contrast with Spanish (tools/bank/consigli.py)
            entry.append(TIPS.get(key, ""))
        n = 12 if w["week"] <= 26 else 15
        best = sorted([v for v in cand.values() if v[0] not in late_now],
                      key=lambda v: -freq[v[0]])[:0 if w["boss"] else n]
        w["vocab"] = best
        given.update(v[0] for v in best)
    print("palabras de la semana: %d en total" % sum(len(w["vocab"]) for w in weeks))
    if late_examples:
        print("  palabras que esperan a una semana posterior (su ejemplo usa gramática que falta): %d"
              % len({k for _, k, _ in late_examples}))

    # Tap a word, see what it means: every Italian word of the exercises and
    # of the lessons, with its lemma, Spanish and the week it is in play.
    import lessico
    texts = [(i.get("stem") or "") + " " + (i.get("answer") or "") for i in course["items"]
             if i.get("type") != "translate"]
    for w in weeks:
        for b in (w.get("lesson") or {}).get("blocks", []):
            texts += [p[0].replace("*", "") for p in b.get("ex", [])]
    with open(os.path.join(DATA, "glossario.json"), "w", encoding="utf-8") as fh:
        json.dump(lessico.gloss_table(texts), fh, ensure_ascii=False, separators=(",", ":"))

    out = os.path.join(DATA, "course.json")
    with open(out, "w", encoding="utf-8") as fh:
        json.dump(course, fh, ensure_ascii=False, separators=(",", ":"))

    empty = [w["week"] for w in weeks if not w["items"]]
    print("settimane: %d  item giocabili: %d (dummies %d + autore %d)"
          % (len(weeks), len(items) + len(authored), len(items), len(authored)))
    print("lezioni: %d  blocchi di teoria: %d"
          % (len(lessons), sum(len(l["blocks"]) for l in lessons.values())))
    print("sfide Routledge: %d  gruppi con item: %d"
          % (sum(len(x["items"]) for x in flat), len(flat)))
    if empty:
        print("settimane senza item auto-correggibili:", empty)
    print("-> %s (%.0f KB)" % (out, os.path.getsize(out) / 1024))


if __name__ == "__main__":
    main()
