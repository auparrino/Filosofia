# -*- coding: utf-8 -*-
"""Pragmática: las palabras que no están en el diccionario y los actos de habla
(auditoría v3, P4).

Los marcadores del habla (*né, então, olha, tá bom, imagina, pode deixar,
poxa, aí, tipo, sabe?, ué, eita, nem pensar, pois é, será que, vai que,
tomara*) desde la semana 8, cada cuatro semanas (8, 12, 16, 20, 24), y los
actos de habla con su bloque: pedir perdón y reclamar (12), elogiar (16),
rechazar una invitación (18), no coincidir sin pelear (20), interrumpir y
pedir un favor grande (24).  La semana 38 queda como síntesis.

Cada ítem va a la parte de la lección que tiene su bloque (la última de la
semana).  Las opciones son todas portuguesas y gramaticales: lo que cambia
es si son adecuadas a la situación (brusco, fuera de lugar, otro marcador).
"""

A = "Elegí la respuesta adecuada."
S = "Elegí la opción más adecuada a la situación."
M = "¿Qué significa la palabra marcada en esta frase?"

try:
    import importlib.util as _u, os as _os
    _p = _os.path.join(_os.path.dirname(_os.path.dirname(_os.path.abspath(__file__))), "lessons", "__init__.py")
    _spec = _u.spec_from_file_location("lessons", _p, submodule_search_locations=[_os.path.dirname(_p)])
    _m = _u.module_from_spec(_spec)
    _spec.loader.exec_module(_m)
    _LAST = {w: len(l.get("parts") or [1]) - 1 for w, l in _m.LESSONS.items()}
except Exception:            # sin lecciones: a la última parte por defecto
    _LAST = {}

# (semana, consigna, frase, respuesta, [opciones], nota)
_P = [
 (8, A, "— Te ligo amanhã, tá? — ___", "Tá bom!", ["Tá bom!", "Né?", "Olha!"],
  "*Tá bom* (= está bom) acepta: «dale». *Né?* pide acuerdo y *olha* llama la atención: no sirven para contestar."),
 (8, A, "Faz calor hoje, ___?", "né", ["né", "então", "olha"],
  "*né?* (= não é?) al final de la frase pide que el otro asienta: «¿no?», «¿viste?»."),
 (8, A, "___, eu acho que vai chover: leva o guarda-chuva.", "Olha", ["Olha", "Né", "Tá bom"],
  "*Olha* («mirá») llama la atención antes de un aviso o una opinión."),
 (8, A, "— Terminei o trabalho. — ___, vamos para a praia?", "Então", ["Então", "Né", "Tá"],
  "*Então* arranca o saca una conclusión: «bueno», «entonces»."),
 (12, A, "— Obrigada pela carona! — ___", "Imagina!", ["Imagina!", "Pode deixar!", "Poxa!"],
  "Después de un «gracias», *imagina!* es «¡de nada!, ¡no es nada!». *Pode deixar* es «yo me ocupo»."),
 (12, A, "— Você leva o lixo para baixo? — ___", "Pode deixar!", ["Pode deixar!", "Imagina!", "Nossa!"],
  "*Pode deixar!* acepta un pedido: «dejá, yo me ocupo»."),
 (12, A, "— Não vou poder ir à festa. — ___, que pena!", "Poxa", ["Poxa", "Imagina", "Pode deixar"],
  "*Poxa* marca lástima o fastidio: «uh», «qué macana»."),
 (12, S, "En el metro, le pisaste el pie a alguien: ___", "Desculpa!", ["Desculpa!", "Com licença!", "Imagina!"],
  "Por un error, *desculpa*. *Com licença* es «permiso», para pasar o interrumpir."),
 (12, S, "Querés pasar entre dos personas que charlan: ___", "Com licença.", ["Com licença.", "Sinto muito.", "Foi mal."],
  "Para pasar o interrumpir, *com licença*. *Sinto muito* es para algo grave (una pérdida)."),
 (12, S, "En el restaurante te traen el plato equivocado: ___", "Olha, acho que teve um engano: pedi o peixe.",
  ["Olha, acho que teve um engano: pedi o peixe.", "Você errou tudo!", "Foi mal, pedi o peixe."],
  "Para reclamar sin pelear: *olha, acho que teve um engano*. *Foi mal* es disculparte vos, no reclamar."),
 (16, A, "— Que blusa linda! — ___", "Ah, obrigada! Comprei na feira.", ["Ah, obrigada! Comprei na feira.", "De nada!", "Sim, eu sei."],
  "A un elogio se contesta agradeciendo y quitándole peso. *De nada* responde a un «gracias»."),
 (16, A, "— Você cozinha muito bem! — ___", "Que bom que você gostou!", ["Que bom que você gostou!", "Eu sei.", "De nada."],
  "*Que bom que você gostou!* recibe el elogio con naturalidad; *Eu sei* suena soberbio."),
 (16, M, "Cheguei na festa e «aí» vi o João.", "y entonces", ["y entonces", "allá", "ahí mismo, en ese lugar"],
  "En un relato, *aí* no es un lugar: encadena los hechos, «y entonces». En un texto escrito, *então* o *depois*."),
 (16, M, "Eram «tipo» umas dez pessoas na fila.", "como, más o menos", ["como, más o menos", "de ese tipo", "por ejemplo"],
  "*tipo* en el habla aproxima una cantidad («como unas diez») o introduce un ejemplo."),
 (18, S, "Te invitan a una fiesta y no podés ir: ___", "Poxa, adoraria, mas não vai dar. Fica pra próxima!",
  ["Poxa, adoraria, mas não vai dar. Fica pra próxima!", "Não quero.", "Não, obrigado. Tchau."],
  "Un «no» brasileño agradece, lamenta y deja la puerta abierta: *fica pra próxima*."),
 (18, S, "—Vamos ao cinema amanhã? Querés decir que no, con educación: ___", "Vou ver e te falo.",
  ["Vou ver e te falo.", "Com certeza!", "Bora!"],
  "*Vou ver e te falo* muchas veces es un «no» educado."),
 (18, S, "Al recepcionista de un hotel: ___", "Eu gostaria de um quarto com vista para o mar.",
  ["Eu gostaria de um quarto com vista para o mar.", "Quero um quarto com vista para o mar.", "Me dá um quarto com vista para o mar."],
  "Con un desconocido que te atiende, el pedido va en futuro do pretérito: *eu gostaria*, *eu queria*."),
 (20, A, "— O ônibus atrasou de novo. — ___", "Pois é…", ["Pois é…", "Ué!", "Nem pensar!"],
  "*Pois é* da la razón: «y sí», «así es». *Ué* marca extrañeza."),
 (20, A, "— Me empresta o carro no sábado? — ___ (no querés prestarlo)", "Nem pensar!", ["Nem pensar!", "Pois é!", "Eita!"],
  "*Nem pensar!* (o *de jeito nenhum!*) es una negativa firme: «¡ni loco!»."),
 (20, S, "Llegás a la tienda en horario de atención y está cerrada: ___", "Ué, está fechada?",
  ["Ué, está fechada?", "Pois é, está fechada.", "Nem pensar, está fechada."],
  "*Ué* expresa extrañeza ante algo que no esperabas."),
 (20, S, "Un colega dice algo con lo que no estás de acuerdo: ___", "Acho que não é bem assim.",
  ["Acho que não é bem assim.", "Não. Você está errado.", "Nem pensar!"],
  "Para no coincidir sin ofender: *acho que não é bem assim*. El *não* seco suena brusco."),
 (20, S, "— O Rio é a cidade mais bonita do Brasil. — Coincidís solo en parte: ___", "Em parte, você tem razão.",
  ["Em parte, você tem razão.", "Você está enganado.", "Pois é, é a mais bonita."],
  "*Em parte, você tem razão* concede antes de discrepar."),
 (24, A, "Leva o guarda-chuva, ___ chove.", "vai que", ["vai que", "tomara que", "será que"],
  "*vai que* = «por si»: *vai que chove*. *Tomara que* es «ojalá» y pide subjuntivo."),
 (24, A, "___ dê tudo certo na prova!", "Tomara que", ["Tomara que", "Vai que", "Sei lá"],
  "*Tomara que* + subjuntivo = «ojalá»: *tomara que dê certo*."),
 (24, A, "___ vai chover amanhã?", "Será que", ["Será que", "Tomara que", "Vai que"],
  "*Será que…?* es preguntarse en voz alta: «¿irá a llover?»."),
 (24, S, "Necesitás un favor grande de un colega: ___", "Queria te pedir uma coisa: será que você poderia me cobrir na sexta?",
  ["Queria te pedir uma coisa: será que você poderia me cobrir na sexta?", "Me cobre na sexta.", "Você me cobre na sexta, né?"],
  "Un favor grande se prepara (*queria te pedir uma coisa*) y se pide con *será que você poderia…?*."),
 (24, S, "Tenés que interrumpir una reunión: ___", "Desculpa interromper, mas o cliente chegou.",
  ["Desculpa interromper, mas o cliente chegou.", "Parem de falar: o cliente chegou.", "Foi mal, o cliente chegou."],
  "Para interrumpir: *desculpa interromper* o *só um minutinho*."),
]

ITEMS = []
_n = {}
for c in _P:
    w = c[0]
    _n[w] = _n.get(w, 0) + 1
    it = dict(id="prag-%02d-%d" % (w, _n[w]), w=w, type="choice", topic="pragmatica",
              level="A2" if w < 14 else "B1", prompt=c[1], stem=c[2], answer=c[3], options=c[4], note=c[5])
    if w in _LAST:
        it["part"] = _LAST[w]
    ITEMS.append(it)
