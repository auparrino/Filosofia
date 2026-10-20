# -*- coding: utf-8 -*-
"""Estação 3 — Mar Aberto (semanas 27-39): ejercicios propios (prefijo s3-).

Para cada semana: choice, cloze, translate (es → pt), fixerr, garden,
scopri, typed y combina; «part» es el índice de la parte de la lección
(tools/lessons/s3.py) a la que corresponde el ítem.  La semana 39 (chefão)
tiene 20 ítems mixtos de toda la estación.

Regla de oro: un ítem de la semana N solo usa tiempos con
TENSE_WEEK <= N (curriculo.py).
"""

ITEMS = []

CE = "Elegí la forma correcta."
CO = "Completá con la forma correcta del verbo entre paréntesis."
TR = "Traducí al portugués."
FX = "Encontrá el error: tocá la palabra que está mal y corregila."
GP = "Mirá los tres ejemplos y completá el cuarto."
SP = "Leé las frases y descubrí la regla."
CB = "Uní las frases en una sola usando el conector entre paréntesis."

_S = {"w": 0, "level": "B2", "n": 0, "topic": ""}


def V(*segs):
    """Todas las combinaciones de segmentos (str o lista de variantes)."""
    out = [""]
    for s in segs:
        opts = s if isinstance(s, list) else [s]
        out = [a + b for a in out for b in opts]
    return out


def trv(part, stem, note, *segs):
    """translate con alternativas generadas: la primera combinación es la respuesta."""
    allv = V(*segs)
    return tr(part, stem, allv[0], note, alt=allv[1:])


def wk(w, level, topic):
    _S.update(w=w, level=level, n=0, topic=topic)


def _add(part, typ, prompt, stem, answer, note, alt=None, **kw):
    _S["n"] += 1
    d = dict(id="s3-%d-%02d" % (_S["w"], _S["n"]), w=_S["w"], part=part,
             level=_S["level"], type=typ, topic=_S["topic"], prompt=prompt,
             stem=stem, answer=answer, note=note,
             alt=[a for i, a in enumerate(alt or []) if a != answer and a not in (alt or [])[:i]])
    d.update(kw)
    ITEMS.append(d)
    return d


def ch(part, stem, options, answer, note, prompt=CE):
    return _add(part, "choice", prompt, stem, answer, note, options=options)


def cl(part, stem, answer, note, alt=None, prompt=CO):
    return _add(part, "cloze", prompt, stem, answer, note, alt=alt)


def tr(part, stem, answer, note, alt=None):
    return _add(part, "translate", TR, stem, answer, note, alt=alt)


def fx(part, stem, bad, good, answer, cat, note, goodAlt=None, alt=None):
    d = _add(part, "fixerr", FX, stem, answer, note, alt=alt, bad=bad, good=good, cat=cat)
    if goodAlt:
        d["goodAlt"] = goodAlt
    return d


def gd(part, lead, stem, answer, trap, note, prompt=GP):
    return _add(part, "garden", prompt, stem, answer, note, lead=lead, trap=trap)


def sc(part, data, stem, options, answer, note):
    return _add(part, "scopri", SP, stem, answer, note, data=data, options=options)


def ty(part, prompt, stem, answer, note, alt=None):
    return _add(part, "typed", prompt, stem, answer, note, alt=alt)


def cb(part, stem, answer, note, alt=None):
    return _add(part, "combina", CB, stem, answer, note, alt=alt)


# ============================================================================
# Semana 27 — Futuro do subjuntivo
# partes: 0 forma (regulares, irregulares) · 1 ver/vir, momentos futuros ·
#         2 condiciones abiertas y la principal
# ============================================================================
wk(27, "B1", "futuro do subjuntivo")

ch(0, "Quando eu ___ em casa, te mando uma mensagem.", ["chegar", "chegue", "chego"], "chegar",
   "Con «quando» y un momento futuro va futuro do subjuntivo; en los regulares es igual al infinitivo: quando eu chegar. «Chegue» es el calco de «cuando llegue».")
ch(0, "Se vocês ___ tempo, venham ao ensaio da escola de samba.", ["tiverem", "têm", "tenham"], "tiverem",
   "ter → tiveram → tiver; con vocês se agrega -em: se vocês tiverem. Nunca «se» + presente de subjuntivo.")
ch(0, "Quando nós ___ o apartamento, a gente dá uma festa.", ["alugarmos", "aluguemos", "alugamos"], "alugarmos",
   "Regular: infinitivo + -mos para nós: quando nós alugarmos. «Aluguemos» es subjuntivo presente, que no va con «quando» futuro.")
ch(0, "Se ela ___ a verdade, tudo se resolve.", ["disser", "dizer", "diga"], "disser",
   "dizer → disseram → disser. Los irregulares salen del perfeito, no del infinitivo.")
ch(0, "Quando a Constituição de 1988 ___ cinquenta anos, será 2038.", ["completar", "complete", "completa"], "completar",
   "Momento futuro tras «quando»: futuro do subjuntivo, que en los regulares coincide con el infinitivo.")
ch(1, "Quando você ___ o Pão de Açúcar de perto, vai entender.", ["vir", "ver", "vier"], "vir",
   "ver → viram → vir. «Quando você ver» es el error clásico; «vier» es de vir (venir).")
ch(1, "Se vocês ___ ao Rio em fevereiro, peguem um bloco.", ["vierem", "virem", "vêm"], "vierem",
   "vir (venir) → vieram → vier, vierem. «Virem» es el futuro do subjuntivo de ver.")
ch(1, "Enquanto eu ___ em Lisboa, quero ouvir fado em Alfama.", ["estiver", "esteja", "estar"], "estiver",
   "estar → estiveram → estiver. «Enquanto» con valor futuro pide futuro do subjuntivo.")
ch(1, "Assim que o síndico ___ a chave, a gente entra.", ["trouxer", "trazer", "traga"], "trouxer",
   "trazer → trouxeram → trouxer. «Assim que» (apenas) con futuro: futuro do subjuntivo.")
ch(2, "Se Deus ___, a mudança termina sábado.", ["quiser", "queira", "quer"], "quiser",
   "Fórmula fija: se Deus quiser. querer → quiseram → quiser.")
ch(2, "Se ___ amanhã, a gente não vai à praia.", ["chover", "chova", "choverá"], "chover",
   "Condición futura con «se»: futuro do subjuntivo. Nunca futuro de indicativo ni subjuntivo presente tras «se».")
ch(2, "Se você quiser, a gente ___ de metrô até Ipanema.", ["vai", "for", "iria"], "vai",
   "En la otra mitad va presente, «vou + infinitivo», futuro o imperativo: a gente vai. «For» sería otra condición.")

cl(0, "Quando eu ___ (poder), vou a Salvador.", "puder",
   "poder → puderam → puder. Parece el español «pudiera», pero es futuro: cuando pueda.")
cl(0, "Se vocês ___ (fazer) a reserva hoje, o preço é menor.", "fizerem",
   "fazer → fizeram → fizer, fizerem. El tronco es el del perfeito.")
cl(0, "Assim que nós ___ (saber) o resultado, avisamos.", "soubermos",
   "saber → souberam → souber, soubermos. «Sabermos» es otro tiempo (infinitivo pessoal, semana 29).")
cl(0, "Se a imobiliária ___ (dar) desconto, a gente fecha o contrato.", "der",
   "dar → deram → der. «Se der» también es la fórmula «si se puede».")
cl(0, "Quando eles ___ (pôr) o apartamento para alugar, me avisa.", "puserem",
   "pôr → puseram → puser, puserem. Sin tilde: la tilde de «pôr» es solo del infinitivo.")
cl(1, "Quando você ___ (ir) a Portugal, visite Coimbra.", "for",
   "ir y ser comparten la forma: foram → for. Quando você for = cuando vayas.")
cl(1, "Se eu ___ (ser) aprovado no concurso, mudo para Brasília.", "for",
   "ser → foram → for. Se eu for aprovado = si me aprueban.")
cl(1, "Sempre que vocês ___ (vir) ao Rio, fiquem aqui em casa.", "vierem",
   "vir → vieram → vier, vierem. «Sempre que» con valor futuro pide futuro do subjuntivo.")
cl(1, "Se você ___ (ver) a Bia na praia, fala com ela.", "vir",
   "ver → viram → vir. Sí: el futuro do subjuntivo de ver se escribe igual que el infinitivo de vir.")
cl(2, "Onde você ___ (estar), eu te encontro.", "estiver",
   "«Onde» + lugar indefinido en el futuro: futuro do subjuntivo, como «donde estés».")
cl(2, "Quando você ___ (ler) «Dom Casmurro», vai querer discutir a Capitu.", "ler",
   "Regular en esta forma: quando você ler. Capitu es la protagonista de la novela de Machado de Assis.")
cl(2, "Se ___ (haver) algum problema com o aluguel, me liga.", "houver",
   "haver → houveram → houver. Se houver = si hay (en el futuro).")

tr(0, "Cuando tenga tiempo, voy a visitar el Cristo.", "Quando eu tiver tempo, vou visitar o Cristo",
   "Después de *quando* con valor futuro va el futuro do subjuntivo: *quando eu tiver tempo* «cuando tenga tiempo». ✗*quando eu tenha* es un calco del español.",
   alt=["Quando tiver tempo, vou visitar o Cristo", "Quando eu tiver tempo, visitarei o Cristo",
        "Quando tiver tempo, visitarei o Cristo", "Quando eu tiver tempo, vou visitar o Cristo Redentor",
        "Quando tiver tempo, vou visitar o Cristo Redentor"])
tr(0, "Si hacés la feijoada, yo llevo la caipiriña.", "Se você fizer a feijoada, eu levo a caipirinha",
   "Un *se* con valor futuro pide futuro do subjuntivo: *se você fizer a feijoada*; la otra mitad va en presente: *eu levo*. El español usa presente en las dos.",
   alt=["Se fizer a feijoada, eu levo a caipirinha", "Se você fizer feijoada, eu levo caipirinha",
        "Se você fizer a feijoada, levo a caipirinha", "Se você fizer a feijoada, eu vou levar a caipirinha",
        "Se tu fizeres a feijoada, eu levo a caipirinha"])
tr(1, "Cuando veas a Rafa, dale un abrazo.", "Quando você vir o Rafa, dá um abraço nele",
   "«Cuando veas» = quando você vir (de ver). Sin «a» personal: vir o Rafa.",
   alt=["Quando vir o Rafa, dá um abraço nele", "Quando você vir o Rafa, dê um abraço nele",
        "Quando vir o Rafa, dê um abraço nele", "Quando você vir o Rafa, abraça ele",
        "Quando você vir o Rafa, abrace-o", "Quando você vir Rafa, dá um abraço nele",
        "Quando você vir o Rafa, manda um abraço pra ele"])
tr(1, "Apenas lleguemos a Río, te llamamos.", "Assim que chegarmos ao Rio, te ligamos",
   "«Apenas» = assim que / logo que, con futuro do subjuntivo: chegarmos.",
   alt=["Assim que nós chegarmos ao Rio, te ligamos", "Logo que chegarmos ao Rio, te ligamos",
        "Assim que chegarmos no Rio, te ligamos", "Assim que a gente chegar ao Rio, a gente te liga",
        "Assim que a gente chegar no Rio, a gente te liga", "Assim que chegarmos ao Rio, ligamos para você",
        "Assim que chegarmos ao Rio, ligamos pra você", "Assim que chegarmos ao Rio, nós te ligamos"])
tr(1, "Mientras estés acá, la casa es tuya.", "Enquanto você estiver aqui, a casa é sua",
   "*Enquanto* referido al futuro pide futuro do subjuntivo: *enquanto você estiver aqui*. Con *você*, el posesivo es *seu / sua*: *a casa é sua*.",
   alt=["Enquanto estiver aqui, a casa é sua", "Enquanto você estiver aqui a casa é sua",
        "Enquanto tu estiveres aqui, a casa é tua"])
tr(2, "Si querés, vamos a la playa.", "Se você quiser, a gente vai à praia",
   "Condición futura: se você quiser. «Vamos» se dice a gente vai o vamos.",
   alt=["Se você quiser, vamos à praia", "Se quiser, a gente vai à praia", "Se quiser, vamos à praia",
        "Se você quiser, a gente vai pra praia", "Se você quiser, vamos pra praia",
        "Se você quiser, a gente vai para a praia", "Se você quiser, vamos para a praia",
        "Se você quiser, nós vamos à praia"])
tr(2, "Hacé como te parezca mejor.", "Faça como você achar melhor",
   "«Como te parezca» = como você achar: futuro do subjuntivo tras «como» indefinido.",
   alt=["Faz como você achar melhor", "Faça como achar melhor", "Faz como achar melhor",
        "Faça como você acha melhor"])
tr(2, "Si llueve mañana, nos quedamos en casa.", "Se chover amanhã, a gente fica em casa",
   "Condición futura: se chover. «Nos quedamos» = a gente fica / ficamos.",
   alt=["Se chover amanhã, ficamos em casa", "Se amanhã chover, a gente fica em casa",
        "Se amanhã chover, ficamos em casa", "Se chover amanhã, nós ficamos em casa",
        "Se chover amanhã, a gente vai ficar em casa", "Se chover amanhã, vamos ficar em casa"])

fx(0, "Quando eu chegue em casa, te mando uma mensagem.", "chegue", "chegar",
   "Quando eu chegar em casa, te mando uma mensagem.", "futuro_subj",
   "«Cuando llegue» se dice quando eu chegar: el portugués usa futuro do subjuntivo, no el presente de subjuntivo.")
fx(1, "Se você ver o Lucas, diz que eu liguei.", "ver", "vir",
   "Se você vir o Lucas, diz que eu liguei.", "futuro_subj",
   "El futuro do subjuntivo de ver es vir (viram → vir). «Se você ver» es un error muy extendido.")
fx(0, "Quando nós fazermos a mudança, vamos precisar de ajuda.", "fazermos", "fizermos",
   "Quando nós fizermos a mudança, vamos precisar de ajuda.", "futuro_subj",
   "Tras «quando» futuro: fizermos, del tronco de fizeram. «Fazermos» es infinitivo pessoal.")
fx(1, "Quando eu estar em Salvador, vou comer acarajé.", "estar", "estiver",
   "Quando eu estiver em Salvador, vou comer acarajé.", "verbo_irregular",
   "estar es irregular: estiveram → estiver. Solo los regulares coinciden con el infinitivo.")

_L27 = [["falar", "falar"], ["comer", "comer"], ["abrir", "abrir"]]
_GP27 = "Mirá los tres ejemplos (quando eu…, futuro do subjuntivo) y completá el cuarto."
gd(1, _L27, "ver → ___", "vir", "ver",
   "En los regulares el futuro do subjuntivo coincide con el infinitivo, y eso te lleva a «quando eu ver». Pero ver es irregular: viram → vir.",
   prompt=_GP27)
gd(0, _L27, "fazer → ___", "fizer", "fazer",
   "fazer toma el tronco del perfeito: fizeram → fizer. El patrón regular no sirve para los irregulares.",
   prompt=_GP27)
gd(0, _L27, "estar → ___", "estiver", "estar",
   "estar → estiveram → estiver: quando eu estiver no Rio. «Quando eu estar» es regularización.",
   prompt=_GP27)

sc(0, ["Quando eu falar com ela, te conto.", "Quando eu fizer o bolo, te chamo.", "Quando eu tiver tempo, vou.",
       "Quando eu for ao Rio, te ligo.", "Quando eu puder, ajudo.", "Quando eu souber, aviso."],
   "¿De dónde sale la forma del verbo después de «quando» (futuro)?",
   ["De la 3.ª persona plural del perfeito sin -ram (fizeram → fizer).",
    "Del presente de subjuntivo (faça → faça).",
    "Del infinitivo, siempre igual (fazer → fazer, ter → ter, poder → poder)."],
   "De la 3.ª persona plural del perfeito sin -ram (fizeram → fizer).",
   "Regla: tronco de eles en el perfeito: falaram → falar, fizeram → fizer, tiveram → tiver, foram → for. En los regulares coincide con el infinitivo.")
sc(2, ["Se você quiser, a gente vai.", "Se chover, fico em casa.", "Quando ele chegar, jantamos.",
       "Quando ele chega, sempre janta.", "Se você quer, pode ir agora.", "Quando cheguei, ele saiu."],
   "¿Cuándo va futuro do subjuntivo y cuándo indicativo?",
   ["Futuro do subjuntivo si la condición o el momento están en el futuro; indicativo si es un hábito, algo actual o pasado.",
    "Futuro do subjuntivo siempre después de «se» y «quando».",
    "Futuro do subjuntivo solo con verbos irregulares."],
   "Futuro do subjuntivo si la condición o el momento están en el futuro; indicativo si es un hábito, algo actual o pasado.",
   "Regla: lo que todavía no pasó va en futuro do subjuntivo (quando ele chegar); lo habitual (quando ele chega, janta) o pasado (quando cheguei), en indicativo.")

ty(0, "Escribí el futuro do subjuntivo (eu) de «querer».", "querer → quando eu ___", "quiser",
   "querer → quiseram → quiser: se você quiser, quando eu quiser.")
ty(1, "Escribí el futuro do subjuntivo (eles) de «vir» (venir).", "vir → quando eles ___", "vierem",
   "vir → vieram → vier, vierem. No lo confundas con virem (de ver).")

cb(1, "Vou chegar em casa. Te ligo. (quando)", "Quando eu chegar em casa, te ligo.",
   "Momento futuro con «quando»: futuro do subjuntivo (chegar). La principal queda en presente.",
   alt=["Quando chegar em casa, te ligo.", "Te ligo quando eu chegar em casa.", "Te ligo quando chegar em casa.",
        "Quando eu chegar em casa te ligo.", "Eu te ligo quando chegar em casa.", "Quando eu chegar em casa, eu te ligo."])
cb(1, "O bloco vai passar. A gente vai para a Lapa. (assim que)", "Assim que o bloco passar, a gente vai para a Lapa.",
   "«Assim que» = apenas; con futuro: futuro do subjuntivo (passar).",
   alt=["A gente vai para a Lapa assim que o bloco passar.", "Assim que o bloco passar a gente vai para a Lapa.",
        "Assim que o bloco passar, a gente vai pra Lapa.", "A gente vai pra Lapa assim que o bloco passar."])
cb(2, "Talvez você queira. A gente vai ao Pão de Açúcar amanhã. (se)", "Se você quiser, a gente vai ao Pão de Açúcar amanhã.",
   "Condición futura: se + futuro do subjuntivo (quiser).",
   alt=["A gente vai ao Pão de Açúcar amanhã, se você quiser.", "Se você quiser, amanhã a gente vai ao Pão de Açúcar.",
        "Se quiser, a gente vai ao Pão de Açúcar amanhã.", "Se você quiser a gente vai ao Pão de Açúcar amanhã."])


# ============================================================================
# Semana 28 — Imperfeito do subjuntivo e condicionais
# partes: 0 la forma en -sse · 1 se eu pudesse, viajaria ·
#         2 queria que, como se, la trampa del -ra
# ============================================================================
wk(28, "B2", "imperfeito do subjuntivo")

ch(0, "Se eu ___ carioca, iria à praia todo dia.", ["fosse", "for", "seria"], "fosse",
   "Hipótesis del presente: se + imperfeito do subjuntivo. «For» es para condiciones futuras reales; «seria» nunca va tras «se».")
ch(0, "Se nós ___ mais tempo, ficaríamos em Paraty.", ["tivéssemos", "tivemos", "tivermos"], "tivéssemos",
   "ter → tiveram → tivesse; nós: tivéssemos, con tilde. «Tivermos» es futuro do subjuntivo (condición real).")
ch(0, "Se você ___ o que eu sei…", ["soubesse", "sabesse", "souber"], "soubesse",
   "saber → souberam → soubesse. El tronco sale del perfeito, nunca del infinitivo: «sabesse» no existe.")
ch(0, "Se eles ___ ao Brasil, adorariam.", ["viessem", "vissem", "venham"], "viessem",
   "vir → vieram → viessem. «Vissem» es de ver (viram → visse).")
ch(1, "Se eu pudesse, ___ em Santa Teresa.", ["moraria", "morasse", "moraría"], "moraria",
   "En la otra mitad va futuro do pretérito: moraria, sin tilde (el acento cae en -ri-, pero no se marca).")
ch(1, "Se ela ___ mais cedo, pegaria o BRT vazio.", ["saísse", "sairia", "saia"], "saísse",
   "sair → saíram → saísse, con tilde en la í. Nunca condicional tras «se».")
ch(1, "O que você faria se ___ na Mega-Sena?", ["ganhasse", "ganharia", "ganhar"], "ganhasse",
   "Pregunta hipotética: faria + se ganhasse. «Se ganhar» sería una posibilidad real y futura, con «vai fazer».")
ch(1, "Se D. Pedro II ___ hoje, o que pensaria do Brasil?", ["vivesse", "viveria", "vivera"], "vivesse",
   "Hipótesis irreal del presente: se vivesse. «Vivera» es el pluscuamperfecto literario (semana 41), no «viviera».")
ch(2, "Ela queria que você ___ ao Maracanã com ela.", ["fosse", "vá", "for"], "fosse",
   "Principal en pasado (queria) → imperfeito do subjuntivo: que você fosse. «Que vá» es el calco rioplatense.")
ch(2, "Era importante que eles ___ a verdade.", ["soubessem", "saibam", "sabessem"], "soubessem",
   "«Era importante que» está en pasado: imperfeito do subjuntivo, soubessem.")
ch(2, "Ele fala como se ___ o dono do bar.", ["fosse", "é", "seja"], "fosse",
   "«Como se» pide siempre imperfeito do subjuntivo, como «como si fuera».")
ch(2, "Seria ótimo que vocês ___ o violão.", ["trouxessem", "trazessem", "tragam"], "trouxessem",
   "Principal en condicional → imperfeito do subjuntivo. trazer → trouxeram → trouxessem.")

cl(0, "Se eu ___ (ter) grana, comprava um apê no Leblon.", "tivesse",
   "ter → tiveram → tivesse. En el habla, la otra mitad en imperfeito (comprava) es normal.")
cl(0, "Se nós ___ (poder), viajaríamos para Portugal.", "pudéssemos",
   "poder → puderam → pudéssemos, con tilde aguda en la é.")
cl(0, "Se você ___ (dizer) a verdade, ninguém ficaria bravo.", "dissesse",
   "dizer → disseram → dissesse, con doble s.")
cl(0, "Se eles ___ (fazer) o trabalho direito, não haveria problema.", "fizessem",
   "fazer → fizeram → fizessem.")
cl(0, "Se a gente ___ (ir) de barca para Niterói, chegaria antes.", "fosse",
   "«a gente» va con verbo en singular: se a gente fosse. ir y ser comparten fosse.")
cl(1, "Se eu fosse você, ___ (aceitar) a proposta.", "aceitaria",
   "Consejo con «se eu fosse você»: la otra mitad en futuro do pretérito (en el habla, aceitava).",
   alt=["aceitava"])
cl(1, "Se ela estudasse mais, ___ (passar) no vestibular.", "passaria",
   "Consecuencia hipotética: futuro do pretérito. En el habla también passava.",
   alt=["passava"])
cl(1, "Se Machado de Assis ___ (viver) hoje, escreveria crônicas sobre as redes.", "vivesse",
   "Hipótesis irreal: se + imperfeito do subjuntivo. Machado también fue cronista de la Río del siglo XIX.")
cl(2, "Queria que você ___ (vir) no meu aniversário.", "viesse",
   "Principal en pasado → imperfeito do subjuntivo: viesse (de vir).")
cl(2, "Pedi que eles ___ (pôr) a mesa.", "pusessem",
   "pôr → puseram → pusessem. Principal en perfeito (pedi) → imperfeito do subjuntivo.")
cl(2, "Os sebastianistas esperavam como se D. Sebastião ___ (ir) voltar a qualquer momento.", "fosse",
   "«Como se» + imperfeito do subjuntivo: como se fosse voltar. D. Sebastião desapareció en Alcácer-Quibir (1578) y nació el mito de su regreso.")
cl(2, "Seria melhor que nós ___ (estar) lá às oito.", "estivéssemos",
   "Principal en condicional → imperfeito do subjuntivo: estivéssemos, con tilde.")

trv(0, "Si tuviera plata, viajaría a Bahía.",
    "«Si tuviera» = se eu tivesse; la otra mitad en futuro do pretérito (o imperfeito en el habla).",
    ["Se eu tivesse", "Se tivesse"], " ", ["dinheiro", "grana"], ", ",
    ["viajaria", "eu viajaria", "viajava", "eu viajava", "iria", "ia"], " ", ["para a Bahia", "pra Bahia", "à Bahia"])
trv(0, "Si fuéramos ricos, viviríamos en Leblon.",
    "fôssemos lleva circunflejo; «vivir en un lugar» = morar: moraríamos no Leblon.",
    ["Se nós fôssemos", "Se fôssemos", "Se a gente fosse"], " ricos, ",
    ["moraríamos", "viveríamos", "a gente moraria", "morávamos", "a gente morava", "nós moraríamos"], " no Leblon")
trv(1, "Si pudiera, iría al Maracaná hoy.",
    "se + pudesse; la otra mitad, iria (o ia, en el habla).",
    ["Se eu pudesse", "Se pudesse"], ", ", ["iria", "ia", "eu iria", "eu ia"], " ao Maracanã hoje")
trv(1, "¿Qué harías si ganaras la lotería?",
    "Pregunta hipotética: faria… se ganhasse. Nunca «se ganharia».",
    ["O que você faria", "O que faria", "Que você faria", "O que tu farias"], " se ", ["ganhasse", "você ganhasse"],
    " na ", ["loteria", "Mega-Sena"])
trv(1, "Si supiera sambar, bailaría en el bloco.",
    "se eu soubesse (de souberam) + dançaria / dançava.",
    ["Se eu soubesse", "Se soubesse"], " sambar, ", ["dançaria", "eu dançaria", "dançava", "eu dançava"], " no bloco")
trv(2, "Quería que vinieras conmigo.",
    "Principal en pasado → imperfeito do subjuntivo: viesse (de vir).",
    ["Eu queria", "Queria"], " que ", ["você viesse", "viesse", "tu viesses"], " comigo")
trv(2, "Habla como si fuera carioca.",
    "«Como se» + imperfeito do subjuntivo: como se fosse.",
    ["Ele fala", "Fala", "Ela fala", "Você fala"], " como se fosse carioca")
trv(2, "Yo que vos, no iría.",
    "«Yo que vos» = se eu fosse você; la otra mitad, não iria / não ia.",
    ["Se eu fosse você", "Se fosse você", "Eu, se fosse você", "Se eu fosse tu"], ", ",
    ["não iria", "eu não iria", "não ia", "eu não ia"])

fx(1, "Se eu poderia, moraria em Ipanema.", "poderia", "pudesse",
   "Se eu pudesse, moraria em Ipanema.", "subjuntivo",
   "Tras «se» nunca va condicional: se eu pudesse. El condicional va en la otra mitad (moraria).")
fx(2, "Ontem ela me pediu que eu traga o biscoito Globo.", "traga", "trouxesse",
   "Ontem ela me pediu que eu trouxesse o biscoito Globo.", "tempo",
   "Con la principal en pasado (pediu), imperfeito do subjuntivo: que eu trouxesse. «Me pidió que traiga» no pasa al portugués.")
fx(2, "Se eu tivera mais tempo, estudaria mais.", "tivera", "tivesse",
   "Se eu tivesse mais tempo, estudaria mais.", "espanol",
   "El «si tuviera» español se dice se eu tivesse. «Tivera» es el pluscuamperfecto literario (= tinha tido).")
fx(0, "Se nós fossemos mais organizados, não perderíamos tanto tempo.", "fossemos", "fôssemos",
   "Se nós fôssemos mais organizados, não perderíamos tanto tempo.", "ortografia",
   "La 1.ª plural del imperfeito do subjuntivo es esdrújula y lleva tilde: fôssemos, tivéssemos, falássemos.")

_L28 = [["falar", "falássemos"], ["comer", "comêssemos"], ["partir", "partíssemos"]]
_GP28 = "Mirá los tres ejemplos (se nós…, imperfeito do subjuntivo) y completá el cuarto."
gd(0, _L28, "ir → ___", "fôssemos", "íssemos",
   "ir no arma el tronco sobre el infinitivo: foram → fôssemos (igual que ser). Con circunflejo en la ô.", prompt=_GP28)
gd(0, _L28, "vir → ___", "viéssemos", "víssemos",
   "vir → vieram → viéssemos. «Víssemos» es de ver (viram → víssemos).", prompt=_GP28)
gd(0, _L28, "dar → ___", "déssemos", "dássemos",
   "dar → deram → déssemos. El tronco es el del perfeito (deram), no el del infinitivo.", prompt=_GP28)

sc(0, ["fizeram → se eu fizesse", "tiveram → se eu tivesse", "puderam → se eu pudesse",
       "foram → se eu fosse", "disseram → se eu dissesse", "quiseram → se eu quisesse"],
   "¿Cómo se forma el imperfeito do subjuntivo?",
   ["3.ª plural del perfeito sin -ram + -sse.", "Infinitivo + -sse.", "Presente de subjuntivo + -sse."],
   "3.ª plural del perfeito sin -ram + -sse.",
   "Regla: mismo tronco que el futuro do subjuntivo: fizeram → fize- → fizesse. Vale para todos los verbos, regulares e irregulares.")
sc(1, ["Se eu tivesse tempo, viajaria.", "Se ele pudesse, ajudaria.", "Se chovesse, ficaríamos em casa.",
       "Se você viesse, seria ótimo.", "Se nós soubéssemos, contaríamos.", "Se fosse barato, eu compraria."],
   "¿Qué tiempo va en cada mitad de la hipótesis?",
   ["Imperfeito do subjuntivo tras «se»; futuro do pretérito en la otra mitad.",
    "Futuro do pretérito tras «se»; imperfeito do subjuntivo en la otra mitad.",
    "Imperfeito do subjuntivo en las dos mitades."],
   "Imperfeito do subjuntivo tras «se»; futuro do pretérito en la otra mitad.",
   "Regla: se + imperfeito do subjuntivo, y consecuencia en futuro do pretérito (en el habla, imperfeito de indicativo).")

ty(0, "Escribí el imperfeito do subjuntivo (eu) de «trazer».", "trazer → se eu ___", "trouxesse",
   "trazer → trouxeram → trouxesse.")
ty(2, "Escribí el imperfeito do subjuntivo (nós) de «ser».", "ser → se nós ___", "fôssemos",
   "ser → foram → fôssemos, con circunflejo.")

cb(1, "Não tenho dinheiro. Não viajo para Fernando de Noronha. (se)",
   "Se eu tivesse dinheiro, viajaria para Fernando de Noronha.",
   "Se invierte la realidad: no tengo → se eu tivesse; no viajo → viajaria.",
   alt=V(["Se eu tivesse", "Se tivesse"], " dinheiro, ", ["viajaria", "eu viajaria", "viajava", "eu viajava"],
         " para Fernando de Noronha.")[1:] + ["Viajaria para Fernando de Noronha se eu tivesse dinheiro."])
cb(2, "Ela fala. Parece que é portuguesa. (como se)", "Ela fala como se fosse portuguesa.",
   "«Como se» + imperfeito do subjuntivo: como se fosse.",
   alt=["Ela fala como se ela fosse portuguesa."])
cb(2, "Eu queria uma coisa. Você vem à festa. (queria que)", "Eu queria que você viesse à festa.",
   "Principal en pasado (queria) → imperfeito do subjuntivo: viesse.",
   alt=["Queria que você viesse à festa.", "Eu queria que você viesse na festa.", "Queria que você viesse na festa."])


# ============================================================================
# Semana 29 — Infinitivo pessoal
# partes: 0 la forma y su trampa · 1 sujeto propio y preposiciones ·
#         2 cuándo no flexionar; el habla
# ============================================================================
wk(29, "B2", "infinitivo pessoal")

ch(0, "Trouxe o mapa para vocês ___ o caminho.", ["acharem", "acharam", "acham"], "acharem",
   "Tras «para» con sujeto propio (vocês): infinitivo pessoal, infinitivo + -em.")
ch(0, "Está na hora de eles ___ o dever de casa.", ["fazerem", "fizerem", "façam"], "fazerem",
   "El infinitivo pessoal sale del infinitivo: fazer → fazerem. «Fizerem» es futuro do subjuntivo.")
ch(0, "Antes de vocês ___, passem protetor solar.", ["saírem", "sairem", "saiam"], "saírem",
   "sair → saírem, con tilde en la í para romper el diptongo (como saíram, saísse).")
ch(0, "Para nós ___ tempo, precisamos sair cedo.", ["termos", "tivermos", "tenhamos"], "termos",
   "ter → termos: tronco del infinitivo. «Tivermos» es futuro do subjuntivo.")
ch(1, "É bom vocês ___ cedo ao Maracanã.", ["chegarem", "chegaram", "cheguem"], "chegarem",
   "«É bom» + sujeto propio + infinitivo pessoal. Con «que» sería é bom que vocês cheguem.")
ch(1, "É importante os trabalhadores ___ os seus direitos.", ["conhecerem", "conheceram", "conheçam"], "conhecerem",
   "El infinitivo tiene su propio sujeto (os trabalhadores): se flexiona. Sin «que», nunca subjuntivo.")
ch(1, "Eles saíram sem nós ___.", ["sabermos", "soubermos", "saibamos"], "sabermos",
   "«Sin que supiéramos» = sem nós sabermos: preposición + sujeto + infinitivo pessoal.")
ch(1, "Paulo Freire alfabetizava adultos para eles ___ o mundo, não só a palavra.", ["lerem", "leram", "leiam"], "lerem",
   "para + sujeto + infinitivo pessoal: para eles lerem. Freire decía que la lectura del mundo precede a la de la palabra.")
ch(2, "Nós queremos ___ em Florianópolis.", ["morar", "morarmos", "moremos"], "morar",
   "Mismo sujeto y verbo como querer: infinitivo simple. «Queremos morarmos» es error.")
ch(2, "Eles podem ___ agora.", ["sair", "saírem", "saem"], "sair",
   "Tras poder, dever, querer, ir con el mismo sujeto: infinitivo sin flexión.")
ch(2, "Fala mais alto pra gente ___.", ["ouvir", "ouvirmos", "ouve"], "ouvir",
   "«A gente» concuerda en singular: pra gente ouvir. «Pra gente ouvirmos» es error.")
ch(2, "Liguei para vocês ___ da notícia.", ["saberem", "souberem", "saibam"], "saberem",
   "El infinitivo pessoal reemplaza a «para que» + subjuntivo: para vocês saberem = para que vocês soubessem.")

cl(0, "Comprei os ingressos para nós ___ (ir) ao show.", "irmos",
   "ir → irmos. El infinitivo pessoal es regular en todos los verbos.")
cl(0, "É melhor vocês ___ (ser) pontuais.", "serem",
   "ser → serem: infinitivo + -em, sin irregularidades.")
cl(0, "O professor pediu para os alunos ___ (ler) «Vidas Secas».", "lerem",
   "pedir para + sujeto + infinitivo pessoal: para os alunos lerem. «Vidas Secas» es la novela de Graciliano Ramos (1938).")
cl(0, "Esperei até eles ___ (vir).", "virem",
   "vir → virem (infinitivo pessoal). No lo confundas con vierem (futuro do subjuntivo de vir).")
cl(1, "Ao ___ (chegar) à rodoviária, nós ligamos.", "chegarmos",
   "*Ao* + infinitivo es «al + infinitivo», y el infinitivo puede conjugarse (infinitivo pessoal): *ao chegarmos* con sujeto *nós*. También se acepta *ao chegar*.",
   alt=["chegar"])
cl(1, "Está na hora de ___ (ir), galera!", "irmos",
   "El que habla se incluye: de irmos. Con a gente: de a gente ir.",
   alt=["ir"])
cl(1, "Depois de vocês ___ (terminar) a prova, podem sair.", "terminarem",
   "depois de + sujeto + infinitivo pessoal: depois de vocês terminarem.")
cl(1, "Os pais trabalham muito para os filhos ___ (ter) oportunidades.", "terem",
   "Sujeto distinto (os filhos): para os filhos terem.")
cl(2, "Nós precisamos ___ (estudar) para o concurso.", "estudar",
   "Mismo sujeto, precisar + infinitivo: sin flexión.")
cl(2, "Vocês devem ___ (trazer) o documento.", "trazer",
   "dever + infinitivo con el mismo sujeto: infinitivo simple.")
cl(2, "Explica de novo para a gente ___ (entender).", "entender",
   "«A gente» va con el verbo en singular: para a gente entender.")
cl(2, "Saímos cedo para ___ (pegar) a praia vazia.", "pegar",
   "Mismo sujeto tras preposición: la flexión es opcional (pegar o pegarmos).",
   alt=["pegarmos"])

trv(0, "Traje el mapa para que encuentren el Cristo.",
    "«Para que + subjuntivo» se puede decir con infinitivo pessoal: *para vocês acharem*. También vale *para que vocês achem*, más formal.",
    ["Trouxe", "Eu trouxe"], " o mapa ",
    ["para vocês acharem", "para vocês encontrarem", "pra vocês acharem", "pra vocês encontrarem",
     "para que vocês achem", "para que vocês encontrem", "para eles acharem", "para eles encontrarem"],
    " o Cristo")
trv(0, "Antes de que salgan, cierren la ventana.",
    "antes de + sujeto + infinitivo pessoal: antes de vocês saírem (con tilde).",
    ["Antes de vocês saírem", "Antes de saírem", "Antes que vocês saiam"], ", fechem a janela")
trv(1, "Es bueno que lleguen temprano.",
    "É bom + sujeto + infinitivo pessoal, o é bom que + subjuntivo.",
    ["É bom vocês chegarem cedo", "É bom que vocês cheguem cedo", "É bom eles chegarem cedo",
     "É bom que eles cheguem cedo"])
trv(1, "Es importante que sepamos nuestros derechos.",
    "É importante sabermos / nós sabermos, o é importante que saibamos.",
    ["É importante sabermos", "É importante nós sabermos", "É importante que saibamos",
     "É importante que nós saibamos", "É importante a gente saber", "É importante conhecermos",
     "É importante nós conhecermos"], " ", ["os nossos", "nossos"], " direitos")
trv(1, "Se fueron sin que supiéramos.",
    "sem + sujeto + infinitivo pessoal: sem nós sabermos.",
    ["Eles saíram", "Saíram", "Eles foram embora", "Foram embora"], " sem ",
    ["nós sabermos", "sabermos", "a gente saber", "que nós soubéssemos", "que soubéssemos"])
trv(1, "Al llegar a Río, llamamos a mamá.",
    "«al + infinitivo» = ao + infinitivo (ao chegarmos). Sin «a» personal: ligar para alguém.",
    ["Ao chegarmos", "Ao chegar", "Quando chegamos"], " ", ["ao Rio", "no Rio"], ", ligamos ",
    ["para a mamãe", "pra mamãe", "para a nossa mãe", "para nossa mãe", "para mamãe"])
trv(2, "Queremos vivir en Floripa.",
    "Mismo sujeto con querer: infinitivo simple (queremos morar).",
    ["Nós queremos", "Queremos", "A gente quer"], " ", ["morar", "viver"], " em ", ["Floripa", "Florianópolis"])
trv(2, "Hablá más fuerte para que escuchemos.",
    "Con a gente, verbo sin -mos: pra gente ouvir. También para ouvirmos.",
    ["Fala", "Fale"], " mais alto ",
    ["pra gente ouvir", "para a gente ouvir", "pra a gente ouvir", "para nós ouvirmos", "para ouvirmos",
     "para que a gente ouça", "para que nós ouçamos", "pra gente escutar", "para a gente escutar",
     "para escutarmos"])

fx(0, "O guia explicou tudo para eles fizerem a trilha sozinhos.", "fizerem", "fazerem",
   "O guia explicou tudo para eles fazerem a trilha sozinhos.", "inf_pessoal",
   "El infinitivo pessoal sale del infinitivo: fazerem. «Fizerem» es futuro do subjuntivo.")
fx(2, "Nós queremos viajarmos para o Nordeste.", "viajarmos", "viajar",
   "Nós queremos viajar para o Nordeste.", "inf_pessoal",
   "Mismo sujeto con querer: el infinitivo no se flexiona.")
fx(2, "Trouxe biscoito Globo pra a gente comermos na praia.", "comermos", "comer",
   "Trouxe biscoito Globo pra a gente comer na praia.", "persona",
   "«A gente» concuerda en singular: pra a gente comer. Con -mos, «para nós comermos».")
fx(1, "É importante que vocês chegarem cedo.", "chegarem", "cheguem",
   "É importante que vocês cheguem cedo.", "subjuntivo",
   "Con «que» va subjuntivo (que vocês cheguem); sin «que», infinitivo pessoal (é importante vocês chegarem). No se mezclan.",
   alt=["É importante vocês chegarem cedo."])

_L29 = [["falar", "para eles falarem"], ["comer", "para eles comerem"], ["abrir", "para eles abrirem"]]
gd(0, _L29, "sair → para eles ___", "saírem", "sairem",
   "La terminación es la misma, pero sair necesita tilde: saírem (la i es tónica y no forma diptongo).")
gd(0, _L29, "pôr → para eles ___", "porem", "pôrem",
   "La tilde de pôr solo distingue el infinitivo de la preposición «por»; en porem ya no hace falta.")
gd(0, _L29, "ter → para eles ___", "terem", "tiverem",
   "En los regulares el infinitivo pessoal coincide con el futuro do subjuntivo (falarem) y eso confunde; con ter se separan: terem (infinitivo pessoal) ≠ tiverem (futuro do subjuntivo).")

sc(0, ["falar → falarem", "ser → serem", "fazer → fazerem", "ter → terem", "ir → irem", "sair → saírem"],
   "¿Sobre qué se forma el infinitivo pessoal?",
   ["Sobre el infinitivo, en todos los verbos.",
    "Sobre la 3.ª plural del perfeito, como el futuro do subjuntivo.",
    "Sobre el presente de subjuntivo."],
   "Sobre el infinitivo, en todos los verbos.",
   "Regla: infinitivo + -es, -mos, -em. No tiene irregulares; solo la tilde de saírem, caírem.")
sc(2, ["É bom vocês chegarem cedo.", "É hora de irmos.", "Trouxe isso para eles verem.",
       "Queremos viajar.", "Eles podem sair.", "Vocês precisam estudar."],
   "¿Cuándo lleva terminación el infinitivo?",
   ["Cuando tiene un sujeto propio o va tras preposición; no tras querer, poder o precisar con el mismo sujeto.",
    "Siempre que el sujeto es plural.",
    "Solo después de la preposición «para»."],
   "Cuando tiene un sujeto propio o va tras preposición; no tras querer, poder o precisar con el mismo sujeto.",
   "Regla: si el infinitivo depende de un verbo con el mismo sujeto (queremos viajar), queda simple; si tiene sujeto propio o va tras preposición, se flexiona.")

ty(0, "Escribí el infinitivo pessoal (nós) de «ser».", "É hora de ___ sinceros.", "sermos",
   "ser → sermos: infinitivo + -mos.")
ty(0, "Escribí el infinitivo pessoal (eles) de «pôr».", "Deixei espaço para eles ___ as malas.", "porem",
   "pôr → porem, sin tilde. No lo confundas con puserem (futuro do subjuntivo).")

cb(1, "Falei devagar. Eles entenderam. (para)", "Falei devagar para eles entenderem.",
   "Finalidad con sujeto distinto: para + sujeto + infinitivo pessoal.",
   alt=["Falei devagar pra eles entenderem.", "Eu falei devagar para eles entenderem.",
        "Falei devagar para que eles entendessem."])
cb(1, "Vocês vão sair. Fechem a janela antes. (antes de)", "Antes de vocês saírem, fechem a janela.",
   "antes de + sujeto + infinitivo pessoal: antes de vocês saírem.",
   alt=["Fechem a janela antes de vocês saírem.", "Antes de saírem, fechem a janela.",
        "Fechem a janela antes de saírem.", "Antes de vocês saírem fechem a janela."])
cb(2, "Eles saíram. Nós não sabíamos. (sem)", "Eles saíram sem nós sabermos.",
   "*Sem* + sujeto + infinitivo pessoal reemplaza a «sin que + subjuntivo»: *sem nós sabermos* «sin que supiéramos».",
   alt=["Saíram sem nós sabermos.", "Eles saíram sem a gente saber.", "Eles saíram sem que nós soubéssemos.",
        "Saíram sem a gente saber.", "Eles saíram sem sabermos."])


# ============================================================================
# Semana 30 — Tempos compostos e hipótese no passado
# partes: 0 los compuestos y el pasado que no fue · 1 tenha / tiver feito, habla
# ============================================================================
wk(30, "B2", "tempos compostos")

ch(0, "Se eu tivesse sabido, ___ ido ao show.", ["teria", "tivesse", "terei"], "teria",
   "Hipótesis sobre el pasado: se tivesse + participio, y en la otra mitad teria + participio. El español «hubiera ido» no se calca.")
ch(0, "Se vocês ___ chegado cedo, teriam visto o Cristo sem nuvens.", ["tivessem", "teriam", "tiverem"], "tivessem",
   "Tras «se», imperfeito do subjuntivo de ter + participio: tivessem chegado.")
ch(0, "Se a corte portuguesa não ___ vindo em 1808, o Rio seria outra cidade.", ["tivesse", "teria", "tenha"], "tivesse",
   "se + tivesse + participio. La corte de D. João llegó a Río en 1808 huyendo de Napoleón.")
ch(0, "Se ela não tivesse perdido o voo, ___ vindo à festa.", ["teria", "tivesse", "terá"], "teria",
   "La consecuencia en el pasado va en futuro do pretérito composto: teria vindo.")
ch(0, "Se eu tivesse aceitado aquele emprego, hoje ___ em Recife.", ["moraria", "teria morado", "morasse"], "moraria",
   "Hipótesis mixta: condición pasada, consecuencia presente (hoje) → futuro do pretérito simple: moraria.")
ch(1, "Espero que vocês ___ gostado do passeio.", ["tenham", "tivessem", "têm"], "tenham",
   "Principal en presente (espero) y hecho ya pasado: subjuntivo perfeito, tenham gostado.")
ch(1, "Ela não atende o telefone: talvez já ___ saído.", ["tenha", "teria", "tem"], "tenha",
   "«Talvez» + subjuntivo; acción ya pasada vista desde hoy: tenha saído. «Tem saído» significaría «viene saliendo».")
ch(1, "Quando você ___ terminado, me avisa.", ["tiver", "tivesse", "tenha"], "tiver",
   "quando + futuro do subjuntivo composto: quando você tiver terminado. Nunca «quando tenha».")
ch(1, "Até dezembro eu ___ terminado o curso.", ["terei", "tiver", "teria"], "terei",
   "Futuro composto: lo que habrá pasado para cierto momento. terei terminado = habré terminado.")
ch(1, "Não acredito que ele ___ dito isso!", ["tenha", "tem", "tivesse"], "tenha",
   "«Não acredito que» pide subjuntivo; principal en presente y hecho pasado: tenha dito.")
ch(1, "Esperava que vocês ___ gostado.", ["tivessem", "tenham", "teriam"], "tivessem",
   "Principal en pasado (esperava) → subjuntivo mais-que-perfeito: tivessem gostado.")
ch(1, "Se eu soubesse, ___ ido com vocês.", ["tinha", "tivesse", "tenho"], "tinha",
   "En el habla, el imperfeito reemplaza al condicional: se eu soubesse, tinha ido. En la norma: teria ido.",
   prompt="Elegí la forma que se usa en el habla.")

cl(0, "Se tivesse chovido, nós ___ (ficar) em casa.", "teríamos ficado",
   "Consecuencia en el pasado: teria + participio (teríamos ficado). En el habla: tínhamos ficado.",
   alt=["tínhamos ficado"])
cl(0, "Se eu ___ (saber) antes, teria comprado o ingresso.", "tivesse sabido",
   "Condición sobre el pasado: se + tivesse + participio.")
cl(0, "Se Tiradentes não ___ (ser) delatado, a Inconfidência Mineira teria dado certo?", "tivesse sido",
   "se + tivesse + participio (sido). Tiradentes fue delatado por Joaquim Silvério dos Reis y ejecutado en 1792.")
cl(0, "Se vocês tivessem visto o jogo, ___ (entender) a minha raiva.", "teriam entendido",
   "Otra mitad: futuro do pretérito composto, teriam entendido.",
   alt=["tinham entendido"])
cl(0, "Se eu tivesse estudado música, hoje ___ (tocar) no Beco das Garrafas.", "tocaria",
   "Hipótesis mixta: pasado que afecta al presente (hoje) → tocaria. El Beco das Garrafas, en Copacabana, fue cuna de la bossa nova.",
   alt=["tocava"])
cl(0, "Se o Brasil não ___ (ter) escravidão por mais de três séculos, seria o mesmo país?", "tivesse tido",
   "se + tivesse + participio (tido). Brasil fue el último país de América en abolir la esclavitud (1888).")
cl(1, "Espero que ela ___ (chegar) bem a Salvador.", "tenha chegado",
   "Deseo de hoy sobre algo que ya pasó: subjuntivo perfeito (tenha chegado).")
cl(1, "Quando vocês ___ (ler) o livro, a gente discute.", "tiverem lido",
   "Acción futura ya terminada antes de otra: quando + tiver + participio.")
cl(1, "Às oito o bloco já ___ (passar).", "terá passado",
   "Futuro composto: habrá pasado. En el habla, já vai ter passado.",
   alt=["vai ter passado"])
cl(1, "É bom que você ___ (vir).", "tenha vindo",
   "Principal en presente, hecho pasado: tenha + participio. vir → vindo.")
cl(1, "Se até sexta você não ___ (receber) o boleto, me liga.", "tiver recebido",
   "Condición futura ya cumplida para un momento: se + tiver + participio.")
cl(1, "Se ela tivesse ligado, eu ___ (buscar) ela no aeroporto.", "tinha buscado",
   "En el habla, tinha + participio reemplaza a teria + participio. Las dos se aceptan.",
   alt=["teria buscado"], prompt="Completá como se dice en el habla (imperfeito en lugar del condicional).")

trv(0, "Si hubiera sabido, habría ido.",
    "se + tivesse sabido, y en la otra mitad teria ido (en el habla, tinha ido). Nunca «tivesse ido» en la consecuencia.",
    ["Se eu tivesse sabido", "Se tivesse sabido"], ", ", ["teria ido", "eu teria ido", "tinha ido", "eu tinha ido"])
trv(0, "Si hubieran llegado temprano, habrían visto el Cristo.",
    "Condición: tivessem chegado; consecuencia: teriam visto.",
    ["Se vocês tivessem chegado", "Se tivessem chegado", "Se eles tivessem chegado"], " cedo, ",
    ["teriam visto", "tinham visto", "vocês teriam visto"], " o Cristo")
trv(0, "Si hubiera aceptado ese trabajo, hoy viviría en Recife.",
    "Hipótesis mixta: tivesse aceitado (pasado) + moraria (presente).",
    ["Se eu tivesse aceitado", "Se tivesse aceitado"], " ", ["esse", "aquele"], " ", ["emprego", "trabalho"],
    ", hoje ", ["moraria", "eu moraria", "morava", "eu morava", "viveria", "eu viveria"], " em Recife")
trv(1, "Espero que les haya gustado el paseo.",
    "Espero que + subjuntivo perfeito: tenham gostado. gostar de + o = do.",
    "Espero que ", ["vocês tenham", "tenham", "eles tenham"], " gostado do passeio")
trv(1, "Quizás ya haya salido.",
    "talvez + tenha + participio.",
    "Talvez ", ["ela ", "ele ", ""], "já tenha saído")
trv(1, "Cuando haya terminado, aviso.",
    "quando + tiver + participio: acción futura ya terminada.",
    "Quando ", ["eu tiver", "tiver"], " terminado, ", ["aviso", "eu aviso", "te aviso", "eu te aviso", "vou avisar"])
trv(1, "Para diciembre habré terminado el curso.",
    "Futuro composto: terei terminado (en el habla, vou ter terminado).",
    ["Até dezembro", "Em dezembro"], " ",
    ["terei terminado", "eu terei terminado", "vou ter terminado", "eu vou ter terminado", "já terei terminado",
     "eu já terei terminado"], " o curso")
trv(1, "No puedo creer que haya dicho eso.",
    "Não acredito que + tenha dito (subjuntivo perfeito).",
    ["Não acredito", "Não posso acreditar", "Eu não acredito"], " que ", ["ele ", "ela ", ""], "tenha dito isso")

fx(0, "Se eu tivesse sabido, tivesse ido com vocês.", "tivesse ido", "teria ido",
   "Se eu tivesse sabido, teria ido com vocês.", "espanol",
   "El español dice «hubiera ido» en las dos mitades; en portugués la consecuencia va con teria (o tinha, en el habla).",
   goodAlt=["tinha ido"])
fx(0, "Se eu teria sabido, não teria vindo.", "teria sabido", "tivesse sabido",
   "Se eu tivesse sabido, não teria vindo.", "subjuntivo",
   "Tras «se», nunca condicional: se eu tivesse sabido.")
fx(1, "Espero que vocês tinham gostado da feijoada.", "tinham", "tenham",
   "Espero que vocês tenham gostado da feijoada.", "subjuntivo",
   "«Espero que» pide subjuntivo: tenham gostado (subjuntivo perfeito).")
fx(0, "Se ele tivesse fazido o dever, teria passado.", "fazido", "feito",
   "Se ele tivesse feito o dever, teria passado.", "participio",
   "fazer tiene participio irregular: feito. En los compuestos no se regulariza.")

_L30 = [["chegar", "chegado"], ["comer", "comido"], ["partir", "partido"]]
_GP30 = "Mirá los tres participios y completá el cuarto (para «teria…», «tivesse…»)."
gd(0, _L30, "vir → ___", "vindo", "vido",
   "vir tiene participio igual al gerundio: vindo (teria vindo). «Vido» no existe.", prompt=_GP30)
gd(0, _L30, "pôr → ___", "posto", "ponido",
   "pôr → posto (y compuestos: proposto, composto). Como el español «puesto», pero con o.", prompt=_GP30)
gd(0, _L30, "escrever → ___", "escrito", "escrevido",
   "escrever → escrito, como en español. El patrón -ido de los regulares te empuja a «escrevido».", prompt=_GP30)

sc(0, ["Se tivesse chovido, teríamos ficado.", "Se eu tivesse sabido, teria ido.", "Se ela tivesse estudado, teria passado.",
       "Se vocês tivessem vindo, teriam gostado.", "Se ele tivesse ligado, eu teria atendido.",
       "Se nós tivéssemos saído cedo, teríamos chegado."],
   "¿Cómo se arma la hipótesis sobre el pasado?",
   ["se + tivesse + participio; en la otra mitad, teria + participio.",
    "se + teria + participio; en la otra mitad, tivesse + participio.",
    "se + tivesse + participio en las dos mitades."],
   "se + tivesse + participio; en la otra mitad, teria + participio.",
   "Regla: la condición en subjuntivo mais-que-perfeito (tivesse feito) y la consecuencia en futuro do pretérito composto (teria feito).")
sc(1, ["Espero que tenham gostado.", "Talvez ele tenha saído.", "Esperava que tivessem gostado.",
       "Quando tiver terminado, aviso.", "Se até sexta não tiver chegado, reclamo.", "Duvido que ela tenha dito isso."],
   "¿Cuándo va tenha, tivesse o tiver + participio?",
   ["tenha con principal en presente; tivesse con principal en pasado; tiver tras quando / se con futuro.",
    "tenha siempre tras talvez; tiver siempre tras espero.",
    "Los tres son intercambiables."],
   "tenha con principal en presente; tivesse con principal en pasado; tiver tras quando / se con futuro.",
   "Regla: es la misma correlación de los tiempos simples (seja / fosse / for), con ter como auxiliar.")

ty(0, "Escribí el participio de «abrir».", "Se eu tivesse ___ a janela, o gato não teria fugido.", "aberto",
   "abrir → aberto, irregular como en español.")
ty(0, "Escribí el participio de «dizer».", "Ele nunca teria ___ isso.", "dito",
   "dizer → dito.")

cb(0, "Não choveu. Não ficamos em casa. (se)", "Se tivesse chovido, teríamos ficado em casa.",
   "Hipótesis contraria al pasado: se + tivesse + participio, teria + participio.",
   alt=["Se tivesse chovido, a gente teria ficado em casa.", "Se tivesse chovido, tínhamos ficado em casa.",
        "Se tivesse chovido, nós teríamos ficado em casa.", "Teríamos ficado em casa se tivesse chovido."])
cb(0, "Não estudei. Não passei no vestibular. (se)", "Se eu tivesse estudado, teria passado no vestibular.",
   "Se invierte: não estudei → se tivesse estudado; não passei → teria passado.",
   alt=["Se tivesse estudado, teria passado no vestibular.", "Se eu tivesse estudado, tinha passado no vestibular.",
        "Teria passado no vestibular se tivesse estudado.", "Eu teria passado no vestibular se tivesse estudado."])
cb(1, "Vou terminar o relatório. Depois te aviso. (quando)", "Quando tiver terminado o relatório, te aviso.",
   "Acción futura ya terminada: quando + tiver + participio (también vale quando terminar).",
   alt=["Quando eu tiver terminado o relatório, te aviso.", "Quando terminar o relatório, te aviso.",
        "Quando eu terminar o relatório, te aviso.", "Te aviso quando tiver terminado o relatório.",
        "Te aviso quando terminar o relatório."])


# ============================================================================
# Semana 31 — Discurso indireto e correlação de tempos
# partes: 0 los tiempos retroceden · 1 pedidos, pronombres y adverbios ·
#         2 preguntas y verbos de decir
# ============================================================================
wk(31, "B2", "discurso indireto")

_PR = "Pasá al discurso indirecto: elegí la forma correcta."
ch(0, "«Hoje estou cansada.» → Ela disse que naquele dia ___ cansada.", ["estava", "está", "estaria"], "estava",
   "Con «disse» en pasado, el presente pasa a imperfeito: estou → estava.", prompt=_PR)
ch(0, "«Vou à praia amanhã.» → Ele disse que ___ à praia no dia seguinte.", ["ia", "vai", "foi"], "ia",
   "«vou» (futuro próximo) pasa a «ia»: disse que ia. «Foi» sería un hecho ya pasado.", prompt=_PR)
ch(0, "«Comprei o ingresso.» → Ele contou que ___ o ingresso.", ["tinha comprado", "comprava", "compraria"], "tinha comprado",
   "El perfeito pasa a mais-que-perfeito composto: comprei → tinha comprado.", prompt=_PR)
ch(0, "«Farei isso.» → Ele prometeu que ___ isso.", ["faria", "fizesse", "faça"], "faria",
   "El futuro do presente pasa a futuro do pretérito: farei → faria.", prompt=_PR)
ch(0, "«Espero que chova.» → O agricultor disse que esperava que ___.", ["chovesse", "chova", "choveria"], "chovesse",
   "El subjuntivo presente pasa a imperfeito do subjuntivo: que chova → que chovesse.", prompt=_PR)
ch(1, "«Vá embora!» → Ela pediu que eu ___ embora.", ["fosse", "vá", "for"], "fosse",
   "El imperativo pasa a imperfeito do subjuntivo con «pediu que». «Que eu vá» es el calco de «me pidió que vaya».", prompt=_PR)
ch(1, "«Tragam bebida!» → Ela pediu que ___ bebida.", ["trouxéssemos", "tragamos", "trazíamos"], "trouxéssemos",
   "Pedido en pasado → imperfeito do subjuntivo: trouxéssemos (de trouxeram).", prompt=_PR)
ch(1, "«Este é o meu bairro.» → Ele disse que ___ era o bairro dele.", ["aquele", "este", "esse"], "aquele",
   "Al reportar, este → aquele y meu → dele.", prompt=_PR)
ch(1, "«Chego amanhã.» → Na semana passada, ele disse que chegava ___.", ["no dia seguinte", "amanhã", "ontem"], "no dia seguinte",
   "amanhã → no dia seguinte cuando el día ya no es el mismo.", prompt=_PR)
ch(2, "«Você vem?» → Ela perguntou ___ eu ia.", ["se", "que", "que se"], "se",
   "Pregunta de sí o no → perguntou se. «Que se» es un calco del español oral.", prompt=_PR)
ch(2, "«Onde fica o Museu do Amanhã?» → O turista perguntou onde ___ o museu.", ["ficava", "ficasse", "ficou"], "ficava",
   "La pregunta con interrogativo conserva «onde» y el presente pasa a imperfeito.", prompt=_PR)
ch(2, "O ministro ___ que não haveria aumento de impostos.", ["afirmou", "perguntou", "pediu"], "afirmou",
   "Para una declaración: afirmar, dizer, garantir. «Perguntar» es para preguntas y «pedir», para pedidos.")

cl(0, "«Saio da vida para entrar na história.» → Na carta-testamento, Vargas escreveu que ___ (sair) da vida para entrar na história.", "saía",
   "Presente → imperfeito: saio → saía. La frase es real: cierra la carta-testamento de Getúlio Vargas (1954).")
cl(0, "«Não vou ao ensaio.» → A Bia avisou que não ___ (ir) ao ensaio.", "ia",
   "vou → ia.")
cl(0, "«Já vi esse filme.» → O Lucas disse que já ___ (ver) aquele filme.", "tinha visto",
   "vi → tinha visto (y esse → aquele).",
   alt=["havia visto"])
cl(0, "«Aqui tudo dá.» → Caminha escreveu ao rei que naquela terra tudo ___ (dar).", "dava",
   "dá → dava. Ojo: «em se plantando, tudo dá» es una paráfrase popular; la carta de Pero Vaz de Caminha (1500) no lo dice así.")
cl(0, "«Se puder, venho.» → Ela disse que, se ___ (poder), viria.", "pudesse",
   "El futuro do subjuntivo pasa a imperfeito do subjuntivo: puder → pudesse; venho → viria.")
cl(1, "«Feche a porta!» → A professora mandou que eu ___ (fechar) a porta.", "fechasse",
   "Orden en pasado → imperfeito do subjuntivo: fechasse.")
cl(1, "«Não saia!» → Minha mãe pediu que eu não ___ (sair).", "saísse",
   "Imperativo negativo → imperfeito do subjuntivo: não saísse, con tilde.")
cl(1, "«Liguem amanhã.» → Ela pediu que nós ___ (ligar) no dia seguinte.", "ligássemos",
   "Pedido → que + imperfeito do subjuntivo: ligássemos. amanhã → no dia seguinte.")
cl(2, "«Quanto custa?» → Ela quis saber quanto ___ (custar).", "custava",
   "Pregunta indirecta con interrogativo: quanto custava.")
cl(2, "«Vocês já almoçaram?» → Ele perguntou se nós já ___ (almoçar).", "tínhamos almoçado",
   "Perfeito → mais-que-perfeito composto: tínhamos almoçado.",
   alt=["havíamos almoçado"])
cl(2, "«Quando começa o show?» → Perguntei quando ___ (começar) o show.", "começava",
   "Presente → imperfeito: começa → começava.")
cl(2, "«Chegarei a tempo.» → Ele garantiu que ___ (chegar) a tempo.", "chegaria",
   "Futuro → futuro do pretérito: chegarei → chegaria.")

trv(0, "Dijo que vivía en Niterói.",
    "Presente reportado → imperfeito: morava. «Vivir en» = morar em.",
    ["Ele disse", "Ela disse", "Disse"], " que ", ["morava", "vivia"], " em Niterói")
trv(0, "Dijo que había visto el partido.",
    "Mais-que-perfeito composto: tinha visto (formal: havia visto).",
    ["Ele disse", "Ela disse", "Disse"], " que ", ["tinha visto", "havia visto"], " o jogo")
trv(0, "Prometió que volvería.",
    "Futuro reportado → futuro do pretérito: voltaria (habla: ia voltar).",
    ["Ele prometeu", "Ela prometeu", "Prometeu"], " que ", ["voltaria", "ia voltar"])
trv(1, "Me pidió que fuera con ella.",
    "Con «pediu», imperfeito do subjuntivo (que eu fosse) o, en el habla, para eu ir.",
    ["Ela me pediu", "Ela pediu", "Me pediu", "Pediu"], " ", ["que eu fosse", "para eu ir", "pra eu ir", "que fosse"],
    " com ela")
trv(1, "Dijo que llegaba al día siguiente.",
    "amanhã → no dia seguinte; chego → chegava.",
    ["Ele disse", "Ela disse", "Disse"], " que ", ["chegava", "chegaria", "ia chegar"], " no dia seguinte")
trv(2, "Me preguntó si iba al bloco.",
    "Pregunta de sí o no → perguntou se.",
    ["Ela me perguntou", "Ele me perguntou", "Me perguntou", "Perguntou"], " se eu ia ", ["ao bloco", "para o bloco", "pro bloco"])
trv(2, "Quiso saber cuánto costaba.",
    "El interrogativo se conserva: quanto custava.",
    ["Ele quis", "Ela quis", "Quis"], " saber quanto custava")
trv(2, "La vecina comentó que el administrador se había ido.",
    "comentar + que; perfeito → tinha + participio. Administrador del edificio = síndico.",
    "A vizinha comentou que o síndico ",
    ["tinha ido embora", "tinha saído", "havia ido embora", "tinha se mudado", "tinha partido", "havia saído"])

fx(1, "Ontem ela me pediu que eu vá ao mercado.", "vá", "fosse",
   "Ontem ela me pediu que eu fosse ao mercado.", "tempo",
   "Con la principal en pasado (pediu), imperfeito do subjuntivo: que eu fosse. El rioplatense «que vaya» no pasa.")
fx(2, "Ele me perguntou que se eu queria sair.", "que se", "se",
   "Ele me perguntou se eu queria sair.", "espanol",
   "La pregunta indirecta de sí o no va solo con «se». «Preguntó que si» es un calco del español oral.")
fx(1, "A Ana me contou que adorava o meu bairro, a Tijuca, onde ela mora desde criança.", "o meu bairro", "o bairro dela",
   "A Ana me contou que adorava o bairro dela, a Tijuca, onde ela mora desde criança.", "pronome",
   "Al reportar, cambian los posesivos: «o meu bairro» dicho por Ana → o bairro dela.",
   goodAlt=["o seu bairro"])
fx(0, "O ministro afirmou que não haverá aumento no ano seguinte.", "haverá", "haveria",
   "O ministro afirmou que não haveria aumento no ano seguinte.", "tempo",
   "Futuro reportado desde el pasado → futuro do pretérito: haveria.")

_L31 = [["«Eu falo»", "disse que falava"], ["«Eu como»", "disse que comia"], ["«Eu parto»", "disse que partia"]]
_GP31 = "Mirá cómo se reportan los tres ejemplos y completá el cuarto."
gd(0, _L31, "«Eu vou» → disse que ___", "ia", "iba",
   "ir tiene imperfeito irregular: ia, nunca «iba» (es el español que se cuela).", prompt=_GP31)
gd(0, _L31, "«Eu tenho» → disse que ___", "tinha", "tenia",
   "ter → tinha: imperfeito irregular. «Tenia» es el español sin tilde.", prompt=_GP31)
gd(0, _L31, "«Eu ponho» → disse que ___", "punha", "ponha",
   "pôr → punha. «Ponha» es subjuntivo presente, no imperfeito.", prompt=_GP31)

sc(0, ["«Moro aqui.» → Disse que morava lá.", "«Vou sair.» → Disse que ia sair.", "«Comprei.» → Disse que tinha comprado.",
       "«Farei.» → Disse que faria.", "«Estou bem.» → Disse que estava bem.", "«Tenho fome.» → Disse que tinha fome."],
   "¿Qué pasa con los tiempos cuando «disse» está en pasado?",
   ["Retroceden un paso: presente → imperfeito, perfeito → tinha + participio, futuro → futuro do pretérito.",
    "Se mantienen igual que en el discurso directo.",
    "Todos pasan al perfeito."],
   "Retroceden un paso: presente → imperfeito, perfeito → tinha + participio, futuro → futuro do pretérito.",
   "Regla: correlación de tiempos. Si el verbo de decir está en presente (diz que), no cambia nada.")
sc(2, ["«Você vem?» → Perguntou se eu ia.", "«Onde você mora?» → Perguntou onde eu morava.",
       "«Quer café?» → Perguntou se eu queria café.", "«Quando você chega?» → Perguntou quando eu chegava.",
       "«Tá com fome?» → Perguntou se eu estava com fome.", "«Quem é?» → Perguntou quem era."],
   "¿Cuándo se usa «se» en la pregunta indirecta?",
   ["En las preguntas de sí o no; con interrogativo (onde, quando, quem) se conserva el interrogativo.",
    "Siempre, delante de cualquier pregunta.",
    "Solo cuando la pregunta tiene «você»."],
   "En las preguntas de sí o no; con interrogativo (onde, quando, quem) se conserva el interrogativo.",
   "Regla: sí/no → perguntou se; pregunta con interrogativo → perguntou onde / quando / quem, sin «que».")

ty(1, "Escribí cómo cambia «amanhã» en el discurso indirecto (en otro día).", "amanhã → ___", "no dia seguinte",
   "amanhã → no dia seguinte; ontem → no dia anterior o na véspera.",
   alt=["o dia seguinte", "no outro dia"])
ty(1, "Escribí cómo cambia «hoje» en el discurso indirecto (en otro día).", "hoje → ___", "naquele dia",
   "hoje → naquele dia; agora → naquele momento.",
   alt=["nesse dia", "aquele dia"])

cb(0, "A Bia disse: «Estou no Arpoador». (disse que)", "A Bia disse que estava no Arpoador.",
   "Presente → imperfeito: estou → estava.",
   alt=["Bia disse que estava no Arpoador.", "A Bia disse que ela estava no Arpoador."])
cb(1, "O guia pediu aos turistas: «Não toquem nas obras». (pediu que)", "O guia pediu aos turistas que não tocassem nas obras.",
   "Imperativo → que + imperfeito do subjuntivo: não tocassem.",
   alt=["O guia pediu que os turistas não tocassem nas obras.", "O guia pediu aos turistas para não tocarem nas obras."])
cb(2, "O turista perguntou: «O museu abre hoje?» (perguntou se)", "O turista perguntou se o museu abria naquele dia.",
   "Pregunta de sí o no → se; abre → abria; hoje → naquele dia.",
   alt=["O turista perguntou se o museu abria hoje.", "O turista perguntou se o museu ia abrir naquele dia."])


# ============================================================================
# Semana 32 — Voz passiva sintética e sujeito indeterminado
# partes: 0 la pasiva con se · 1 sujeto indeterminado y el habla
# ============================================================================
wk(32, "B2", "passiva sintética")

_CART = "Elegí la forma correcta para el cartel."
ch(0, "___ apartamentos em Botafogo.", ["Alugam-se", "Aluga-se", "Se aluga"], "Alugam-se",
   "Pasiva con se: el verbo concuerda con la cosa (apartamentos): alugam-se. En el cartel, se detrás y con guion.", prompt=_CART)
ch(0, "___ bicicleta usada.", ["Vende-se", "Vendem-se", "Venda-se"], "Vende-se",
   "Una bicicleta: singular, vende-se.", prompt=_CART)
ch(0, "___ de garçons com experiência.", ["Precisa-se", "Precisam-se", "Precisam"], "Precisa-se",
   "Con preposición (precisar de) no hay sujeto: el verbo queda en singular aunque garçons sea plural.", prompt=_CART)
ch(0, "___ sapatos e bolsas.", ["Consertam-se", "Conserta-se", "Se consertam"], "Consertam-se",
   "Sapatos e bolsas es plural: consertam-se. En la norma, la oración no empieza con el pronombre.", prompt=_CART)
ch(0, "Aqui não se ___ cartões.", ["aceitam", "aceita", "aceitem"], "aceitam",
   "Pasiva con se: concuerda con cartões. Tras «não», el se va delante.")
ch(0, "No século XVIII, ___ toneladas de ouro em Minas Gerais.", ["extraíram-se", "extraiu-se", "extraíram-nas"], "extraíram-se",
   "Toneladas es plural: extraíram-se. El ciclo del oro de Minas marcó el siglo XVIII brasileño.")
ch(0, "Nesse livro, ___ de temas polêmicos.", ["trata-se", "tratam-se", "tratam"], "trata-se",
   "tratar de lleva preposición: trata-se de, siempre en singular.")
ch(0, "Em 25 de abril de 1974, ___ cravos nos canos das armas.", ["colocaram-se", "colocou-se", "colocaram-nos"], "colocaram-se",
   "Cravos es plural: colocaram-se. Por eso se llama Revolução dos Cravos.")
ch(1, "___ meu celular no ônibus!", ["Roubaram", "Roubou-se", "Roubaram-se"], "Roubaram",
   "Sujeto indeterminado: 3.ª plural sin pronombre. «Roubaram-se» significaría que se robaron entre ellos.")
ch(1, "___ que vai chover no fim de semana.", ["Dizem", "Diz", "Dizemos"], "Dizem",
   "Sujeto indeterminado: dizem que (formal: diz-se que). «Diz» sin se necesita un sujeto.")
ch(1, "No bandejão da faculdade, ___ pega a bandeja e se serve.", ["você", "eles", "se"], "você",
   "En el habla, «você» genérico = uno, como el «vos» genérico rioplatense: acá agarrás la bandeja.")
ch(1, "Ontem ___ pra você: era do banco.", ["ligaram", "ligaram-se", "se ligaram"], "ligaram",
   "Sujeto indeterminado: ligaram (te llamaron). «Se ligaram» es otra cosa: «se dieron cuenta».")

cl(0, "___ (alugar) quarto em Santa Teresa.", "Aluga-se",
   "Un cuarto: aluga-se. En carteles, ênclise con guion.", prompt="Completá el cartel con la pasiva con se.")
cl(0, "___ (vender) pranchas de surfe.", "Vendem-se",
   "Pranchas es plural: vendem-se.", prompt="Completá el cartel con la pasiva con se.")
cl(0, "___ (precisar) de professores de português.", "Precisa-se",
   "Con preposición, singular: precisa-se de.", prompt="Completá el cartel con la pasiva con se.")
cl(0, "Não se ___ (aceitar) cheques.", "aceitam",
   "Concuerda con cheques: aceitam.")
cl(0, "___ (consertar) celulares.", "Consertam-se",
   "Celulares es plural: consertam-se.", prompt="Completá el cartel con la pasiva con se.")
cl(0, "Em 1888 ___ (assinar) a Lei Áurea.", "assinou-se",
   "Una ley: singular. Tras un complemento al inicio se admite también se assinou. La Lei Áurea abolió la esclavitud en Brasil.",
   alt=["se assinou"])
cl(0, "Nesta loja ___ (falar) três línguas.", "falam-se",
   "Três línguas: plural, falam-se. Tras «nesta loja» se acepta también se falam.",
   alt=["se falam"])
cl(1, "___ (dizer) que o açaí de Belém é o melhor do Brasil.", "Dizem",
   "Sujeto indeterminado: dizem que. Formal: diz-se que.",
   alt=["Diz-se", "Falam"])
cl(1, "___ (roubar) a minha bicicleta ontem.", "Roubaram",
   "Sujeto indeterminado: 3.ª plural sin eles.")
cl(1, "Aqui ___ (pagar) na entrada, tá?", "você paga",
   "En el habla, você genérico con el verbo en 3.ª singular.",
   alt=["a gente paga"], prompt="Completá como en el habla (você genérico).")
cl(1, "No Rio, ___ (ir) à praia até no inverno.", "a gente vai",
   "Impersonal del habla con «a gente» (verbo en singular).",
   alt=["você vai"], prompt="Completá como en el habla (a gente).")
cl(1, "___ (contar) que D. Pedro gritou «Independência ou morte!» às margens do Ipiranga.", "Contam",
   "Sujeto indeterminado para una tradición: contam que (formal: conta-se que). Es la versión consagrada del 7 de septiembre de 1822.",
   alt=["Conta-se", "Dizem", "Diz-se"])

tr(0, "Se alquilan departamentos.", "Alugam-se apartamentos",
   "Pasiva con se en plural: alugam-se.")
tr(0, "Se necesitan mozos.", "Precisa-se de garçons",
   "precisar de: singular aunque sean varios.")
trv(0, "Acá se habla español.",
    "Con «aqui» delante, el se va antes del verbo: aqui se fala.",
    ["Aqui se fala espanhol", "Fala-se espanhol aqui", "Aqui se fala castelhano"])
trv(0, "No se aceptan tarjetas.",
    "Pasiva con se concordada; tras «não», próclise: não se aceitam.",
    ["Não se aceitam cartões", "Não aceitamos cartões", "Não aceitamos cartão", "Não se aceita cartão"])
trv(1, "Dicen que va a llover.",
    "Sujeto indeterminado: dizem que (formal: diz-se que).",
    ["Dizem", "Falam", "Diz-se"], " que ", ["vai chover", "choverá"])
trv(1, "Me robaron el celular.",
    "Sujeto indeterminado: roubaram, sin pronombre.",
    ["Roubaram", "Me roubaram"], " ", ["o meu celular", "meu celular", "o celular"])
trv(1, "Te llamaron del banco.",
    "ligar para alguém: ligaram pra você (o te ligaram).",
    ["Ligaram pra você", "Ligaram para você", "Te ligaram", "Ligaram-te"], " do banco")
trv(1, "Se vive bien en Río.",
    "Impersonal: vive-se bem; en el habla, a gente vive / você vive.",
    ["Vive-se bem", "Se vive bem", "A gente vive bem", "Você vive bem"], " no Rio")

fx(0, "Precisam-se de vendedores para a loja de Ipanema.", "Precisam-se", "Precisa-se",
   "Precisa-se de vendedores para a loja de Ipanema.", "concordancia",
   "Con preposición (precisar de) no hay sujeto con el que concordar: precisa-se de, en singular.")
fx(0, "Vende-se casas no condomínio.", "Vende-se", "Vendem-se",
   "Vendem-se casas no condomínio.", "concordancia",
   "Sin preposición, casas es el sujeto: vendem-se casas. El cartel en singular es muy común, pero es error en la norma.")
fx(1, "Eles roubaram minha carteira no metrô, mas não vi quem foi.", "Eles roubaram", "Roubaram",
   "Roubaram minha carteira no metrô, mas não vi quem foi.", "persona",
   "Si no sabés quién fue, sujeto indeterminado sin pronombre: roubaram. «Eles» señala a alguien concreto.")
fx(0, "Se aluga quarto para estudantes.", "Se aluga", "Aluga-se",
   "Aluga-se quarto para estudantes.", "colocacao",
   "En la norma escrita, la oración no empieza con pronombre átono: aluga-se.")

_L32 = [["aluga-se casa", "alugam-se casas"], ["vende-se carro", "vendem-se carros"],
        ["conserta-se relógio", "consertam-se relógios"]]
_GP32 = "Mirá cómo pasan al plural los tres carteles y completá el cuarto."
gd(0, _L32, "precisa-se de vendedor → ___", "precisa-se de vendedores", "precisam-se de vendedores",
   "Con preposición el verbo no concuerda: precisa-se de vendedores. El español «se necesitan» empuja al plural.", prompt=_GP32)
gd(0, _L32, "trata-se de um caso raro → ___", "trata-se de casos raros", "tratam-se de casos raros",
   "tratar de lleva preposición: trata-se de, siempre singular.", prompt=_GP32)
gd(0, _L32, "assiste-se a um filme → ___", "assiste-se a filmes", "assistem-se a filmes",
   "assistir a (ver) lleva preposición: assiste-se a filmes, en singular.", prompt=_GP32)

sc(0, ["Vende-se casa.", "Vendem-se casas.", "Aluga-se quarto.", "Alugam-se quartos.",
       "Precisa-se de garçons.", "Trata-se de problemas sérios."],
   "¿Cuándo el verbo con «se» va en plural?",
   ["Cuando la cosa es plural y el verbo no lleva preposición.",
    "Siempre que la cosa es plural.",
    "Nunca: con «se» el verbo va siempre en singular, sea cual sea la cosa."],
   "Cuando la cosa es plural y el verbo no lleva preposición.",
   "Regla: sin preposición, la cosa es sujeto y concuerda (vendem-se casas); con preposición, singular (precisa-se de garçons).")
sc(1, ["Dizem que vai chover.", "Roubaram meu celular.", "Ligaram pra você.",
       "Falam que o bairro mudou.", "Abriram um bar novo.", "Bateram na porta."],
   "¿Cómo se expresa un sujeto que no se conoce o no importa?",
   ["Con el verbo en 3.ª plural, sin pronombre sujeto.",
    "Con «eles» delante del verbo.",
    "Con «se» delante de cualquier verbo, en 3.ª singular."],
   "Con el verbo en 3.ª plural, sin pronombre sujeto.",
   "Regla: sujeto indeterminado = 3.ª plural sin eles (roubaram, dizem). Con «eles», hablás de personas concretas.")

ty(0, "Escribí el cartel: «Se venden terrenos».", "___ lotes.", "Vendem-se",
   "Lotes es plural: vendem-se.")
ty(0, "Escribí el cartel: «Se necesita ayudante».", "___ de ajudante.", "Precisa-se",
   "precisar de: precisa-se de.")

cb(0, "O apartamento é pequeno. Aluga-se barato. (mas)", "O apartamento é pequeno, mas aluga-se barato.",
   "«mas» opone; tras mas se aceptan las dos posiciones del se.",
   alt=["O apartamento é pequeno, mas se aluga barato.", "O apartamento é pequeno mas aluga-se barato."])
cb(1, "Todos dizem isso. O bairro está mudando. (dizem que)", "Dizem que o bairro está mudando.",
   "Sujeto indeterminado + que: dizem que.",
   alt=["Falam que o bairro está mudando.", "Diz-se que o bairro está mudando."])
cb(1, "Roubaram meu celular. Eu estava no metrô. (quando)", "Roubaram meu celular quando eu estava no metrô.",
   "«quando» + imperfeito para el fondo; la acción, en perfeito indeterminado (roubaram).",
   alt=["Quando eu estava no metrô, roubaram meu celular.", "Roubaram o meu celular quando eu estava no metrô.",
        "Quando eu estava no metrô roubaram meu celular."])


# ============================================================================
# Semana 33 — Colocação pronominal na escrita
# partes: 0 próclise y ênclise · 1 formas enclíticas y mesóclise ·
#         2 tiempos compuestos y habla
# ============================================================================
wk(33, "B2", "colocação pronominal")

_FO = "Elegí la forma de la escritura formal."
ch(0, "___ a verdade.", ["Disse-me", "Me disse", "Disse-mi"], "Disse-me",
   "En la escritura formal, la oración no empieza con pronombre átono: disse-me.", prompt=_FO)
ch(0, "Ele ___ nada.", ["não me disse", "não disse-me", "me não disse"], "não me disse",
   "La negación atrae el pronombre: não me disse (próclise obligatoria).", prompt=_FO)
ch(0, "O livro que ___ é de Clarice Lispector.", ["me deram", "deram-me", "deram-mi"], "me deram",
   "El relativo «que» atrae el pronombre: que me deram.", prompt=_FO)
ch(0, "Quem ___ isso?", ["te contou", "contou-te", "contou te"], "te contou",
   "Los interrogativos atraen el pronombre: quem te contou?", prompt=_FO)
ch(0, "___ o prêmio no Theatro Municipal.", ["Entregaram-lhe", "Lhe entregaram", "Entregaram-le"], "Entregaram-lhe",
   "Verbo al inicio y sin atractor: ênclise. «Le» es español; en portugués, lhe.", prompt=_FO)
ch(0, "Já ___ a história de Canudos?", ["lhe contei", "contei-lhe", "contei-le"], "lhe contei",
   "Adverbios como já, sempre, aqui atraen el pronombre: já lhe contei. Canudos es la guerra que narró Euclides da Cunha en «Os Sertões».", prompt=_FO)
ch(1, "Preciso ___ antes de viajar.", ["vendê-lo", "vender-lo", "vendê-o"], "vendê-lo",
   "Tras -r, el pronombre o se vuelve lo y la r cae; en -er, circunflejo: vendê-lo.")
ch(1, "Os pescadores de Copacabana ___ do mar ainda de madrugada.", ["trazem-nos", "trazem-los", "trazem-os"], "trazem-nos",
   "Tras terminación nasal (-m), os se vuelve nos: trazem-nos.")
ch(1, "___ toda a verdade amanhã.", ["Dir-lhe-ei", "Direi-lhe", "Lhe direi"], "Dir-lhe-ei",
   "Futuro sin atractor en la norma culta: mesóclise, dir-lhe-ei. «Direi-lhe» no se admite.", prompt=_FO)
ch(1, "Não ___ nada.", ["lhe direi", "dir-lhe-ei", "direi-lhe"], "lhe direi",
   "Con atractor (não), próclise también en futuro: não lhe direi.", prompt=_FO)
ch(2, "«¿Me das un café?»", ["Me dá um café?", "Dá-me um café?", "Me dás um café?"], "Me dá um café?",
   "En el habla de Brasil, el pronombre va antes del verbo: me dá. «Dá-me» es escrito o europeo.",
   prompt="Elegí cómo se dice en el habla de Brasil.")
ch(2, "«Lo vi ayer en la playa.»", ["Vi ele ontem na praia.", "Vi-lo ontem na praia.", "Lhe vi ontem na praia."], "Vi ele ontem na praia.",
   "En el habla, «ele» como objeto directo: vi ele. En la escritura, vi-o. «Lhe» es objeto indirecto.",
   prompt="Elegí cómo se dice en el habla de Brasil.")

_CF = "Uní verbo y pronombre en registro formal."
cl(0, "___ (chamo + me) Martín e sou de Rosario.", "Chamo-me",
   "Verbo al inicio de la oración: ênclise, chamo-me.", prompt=_CF)
cl(0, "Nunca ___ (disse + me) isso.", "me disse",
   "«Nunca» atrae el pronombre: nunca me disse.", prompt=_CF)
cl(0, "Quando ___ (vi + o), entendi tudo.", "o vi",
   "Las conjunciones subordinantes (quando, se, embora) atraen el pronombre: quando o vi.", prompt=_CF)
cl(0, "___ (enviaram + nos) muitas cartas.", "Enviaram-nos",
   "Sin atractor y al inicio: ênclise.", prompt=_CF)
cl(1, "É preciso ___ (fazer + o) hoje.", "fazê-lo",
   "fazer + o → fazê-lo: cae la r, aparece l y el circunflejo.", prompt=_CF)
cl(1, "Vou ___ (comprar + a) amanhã.", "comprá-la",
   "comprar + a → comprá-la, con tilde aguda.", prompt=_CF)
cl(1, "___ (fiz + o) sem ajuda.", "Fi-lo",
   "Tras -z cae la consonante: fiz + o → fi-lo.", prompt=_CF)
cl(1, "Os alunos ___ (fazem + a) em casa.", "fazem-na",
   "Tras nasal, a → na: fazem-na. Con sujeto delante, en Brasil se acepta también a fazem.",
   alt=["a fazem"], prompt=_CF)
cl(1, "___ (encontraremos + nos) no cais do Valongo.", "Encontrar-nos-emos",
   "Futuro sin atractor: mesóclise, encontrar-nos-emos. El cais do Valongo, en Río, fue el mayor puerto de llegada de esclavizados de América.",
   prompt=_CF)
cl(1, "___ (faria + se) a obra em 2030.", "Far-se-ia",
   "Condicional al inicio: mesóclise, far-se-ia.", prompt=_CF)
cl(2, "Eu ___ (estou + te) esperando no calçadão.", "estou te",
   "En Brasil, en las perífrasis el pronombre va delante del verbo principal, sin guion: estou te esperando.",
   alt=["tô te", "te estou"], prompt="Completá como en el habla de Brasil.")
cl(2, "Não ___ (tinha + lhe) dito nada.", "lhe tinha",
   "Con atractor (não), el pronombre va antes del auxiliar: não lhe tinha dito. En Brasil también não tinha lhe dito.",
   alt=["tinha lhe"], prompt=_CF)

trv(0, "(Texto formal) Me dijo la verdad.",
    "Sin atractor y al inicio: disse-me. Con sujeto delante, en Brasil también ele me disse.",
    ["Disse-me a verdade", "Ele disse-me a verdade", "Ela disse-me a verdade", "Ele me disse a verdade",
     "Ela me disse a verdade"])
trv(0, "(Texto formal) No me dijo nada.",
    "La negación atrae: não me disse.",
    ["Não me disse nada", "Ele não me disse nada", "Ela não me disse nada"])
trv(0, "(Texto formal) ¿Quién te contó eso?",
    "El interrogativo atrae: quem te contou.",
    ["Quem te contou isso", "Quem te contou isto"])
trv(1, "(Texto formal) Tengo que venderlo.",
    "vender + o → vendê-lo.",
    ["Tenho de", "Tenho que", "Preciso"], " vendê-lo")
trv(1, "(Texto formal) Le diré la verdad.",
    "Futuro sin atractor: dir-lhe-ei. Con el pronombre sujeto delante se admite eu lhe direi.",
    ["Dir-lhe-ei", "Eu lhe direi", "Direi a ele", "Direi a ela"], " a verdade")
trv(2, "(Habla) Te voy a llamar mañana.",
    "En Brasil: vou te ligar (el pronombre antes del verbo principal).",
    ["Vou te ligar", "Eu vou te ligar", "Vou ligar pra você", "Vou ligar para você", "Eu vou ligar pra você"], " amanhã")
trv(2, "(Habla) Lo vi en la playa.",
    "En el habla: vi ele; en la escritura: vi-o.",
    ["Vi ele", "Eu vi ele", "Eu o vi", "Vi-o"], " na praia")
trv(2, "(Habla) Dame un minuto.",
    "En el habla de Brasil: me dá. Escrito: dê-me.",
    ["Me dá", "Me dê", "Dá-me", "Dê-me"], " um minuto")

fx(0, "Me disseram que o museu fecha às cinco.", "Me disseram", "Disseram-me",
   "Disseram-me que o museu fecha às cinco.", "colocacao",
   "En la escritura formal no se empieza la oración con pronombre átono: disseram-me.")["prompt"] = \
    "Texto formal. Encontrá el error: tocá la palabra que está mal y corregila."
fx(0, "Ele nunca disse-me a verdade.", "nunca disse-me", "nunca me disse",
   "Ele nunca me disse a verdade.", "colocacao",
   "«Nunca» atrae el pronombre: próclise obligatoria, nunca me disse.")
fx(1, "Preciso vender-lo antes de viajar.", "vender-lo", "vendê-lo",
   "Preciso vendê-lo antes de viajar.", "colocacao",
   "Tras -r, la r cae: vendê-lo, con circunflejo. «Vender-lo» mezcla el español.")
fx(1, "Direi-lhe amanhã o que decidi.", "Direi-lhe", "Dir-lhe-ei",
   "Dir-lhe-ei amanhã o que decidi.", "colocacao",
   "Con futuro sin atractor, la norma pide mesóclise: dir-lhe-ei. La ênclise al futuro no se admite.")

_L33 = [["comprar + o", "comprá-lo"], ["vender + o", "vendê-lo"], ["abrir + o", "abri-lo"]]
_GP33 = "Mirá las tres uniones y completá la cuarta."
gd(1, _L33, "fiz + o → ___", "fi-lo", "fiz-lo",
   "La z también cae: fiz + o → fi-lo. Es forma de la escritura; en el habla, eu fiz isso.", prompt=_GP33)
gd(1, _L33, "dão + o → ___", "dão-no", "dão-lo",
   "Tras nasal (-ão, -m) el pronombre toma n: dão-no, fazem-no.", prompt=_GP33)
gd(1, _L33, "pôr + a → ___", "pô-la", "pôr-la",
   "La r de pôr cae y queda el circunflejo: pô-la.", prompt=_GP33)

sc(0, ["Disse-me a verdade.", "Não me disse a verdade.", "Entregou-lhe a carta.",
       "Quem lhe entregou a carta?", "Chamo-me Ana.", "Já me chamaram."],
   "¿Cuándo el pronombre va antes del verbo en la escritura formal?",
   ["Cuando hay delante una palabra que lo atrae: negación, interrogativo o relativo, ciertos adverbios.",
    "Cuando el verbo está en pasado.",
    "Cuando el pronombre es «me»."],
   "Cuando hay delante una palabra que lo atrae: negación, interrogativo o relativo, ciertos adverbios.",
   "Regla: ênclise por defecto (disse-me); próclise con atractores (não, quem, que, já, nunca, quando…).")
sc(1, ["comprar + o → comprá-lo", "vender + a → vendê-la", "partir + os → parti-los",
       "fiz + o → fi-lo", "dão + o → dão-no", "fazem + as → fazem-nas"],
   "¿Qué pasa con o / a detrás del verbo?",
   ["Tras -r, -s, -z se vuelven lo / la y la consonante cae; tras nasal, no / na.",
    "Siempre se escriben o / a sin cambios.",
    "Se vuelven lhe delante de vocal."],
   "Tras -r, -s, -z se vuelven lo / la y la consonante cae; tras nasal, no / na.",
   "Regla: comprá-lo, vendê-la, fi-lo; dão-no, fazem-nas. Con otras terminaciones, sin cambios: comprou-o.")

ty(1, "Uní verbo y pronombre (formal).", "fazer + o → ___", "fazê-lo",
   "fazer + o → fazê-lo.")
ty(1, "Uní con mesóclise (formal).", "direi + lhe → ___", "dir-lhe-ei",
   "Futuro: el pronombre entra entre el infinitivo y la terminación: dir-lhe-ei.")

cb(0, "Deram-me um livro. O livro é de Clarice Lispector. (que)", "O livro que me deram é de Clarice Lispector.",
   "El relativo «que» atrae el pronombre: que me deram.",
   alt=["O livro que me deram é da Clarice Lispector."])
cb(0, "Encontrei-o no Largo do Machado. Contei-lhe a novidade. (quando)",
   "Quando o encontrei no Largo do Machado, contei-lhe a novidade.",
   "«Quando» atrae el pronombre (o encontrei); la principal sigue con ênclise (contei-lhe).",
   alt=["Contei-lhe a novidade quando o encontrei no Largo do Machado.",
        "Quando o encontrei no Largo do Machado, lhe contei a novidade."])
cb(1, "Machado de Assis escreveu «Dom Casmurro». Publicou-o em 1899. (e)",
   "Machado de Assis escreveu «Dom Casmurro» e publicou-o em 1899.",
   "Coordinación con «e»: la segunda oración conserva la ênclise (en Brasil también e o publicou).",
   alt=["Machado de Assis escreveu «Dom Casmurro» e o publicou em 1899.",
        "Machado de Assis escreveu Dom Casmurro e publicou-o em 1899.",
        "Machado de Assis escreveu Dom Casmurro e o publicou em 1899."])


# ============================================================================
# Semana 34 — Conectores e coesão
# partes: 0 adversativos y su posición · 1 conclusivos y explicativos ·
#         2 aliás, inclusive, ou seja; concesión
# ============================================================================
wk(34, "B2", "conectores")

_CC = "Elegí el conector correcto."
ch(0, "O Rio é lindo, ___ a violência preocupa.", ["mas", "mais", "más"], "mas",
   "«Pero» es *mas*, sin *i*; *mais* es «más». Y *más* no existe en portugués (*má* es «mala»).", prompt=_CC)
ch(0, "En portugués, «todavia» significa…", ["sin embargo", "todavía", "mientras tanto"], "sin embargo",
   "Falso amigo: todavia = sin embargo, como porém y contudo. «Todavía» se dice ainda.",
   prompt="Elegí el significado.")
ch(0, "A Constituição de 1988 garante o direito à moradia; ___, milhões ainda vivem em áreas precárias.",
   ["no entanto", "portanto", "inclusive"], "no entanto",
   "Contraste entre la ley y la realidad: adversativo, no entanto (= sin embargo).", prompt=_CC)
ch(0, "O projeto era bom. O plano, ___, falhou.", ["porém", "mas", "nem"], "porém",
   "«porém» puede ir entre comas en medio de la oración; «mas» va siempre al principio.", prompt=_CC)
ch(0, "«Todavía no llegó.» → ___ não chegou.", ["Ainda", "Todavia", "Entretanto"], "Ainda",
   "«Todavía» (aún) se dice *ainda*. *Todavia* y *entretanto* son falsos amigos: significan «sin embargo».")
ch(1, "Choveu muito; ___, houve enchentes na Zona Norte.", ["por isso", "porque", "embora"], "por isso",
   "Consecuencia: por isso (= por eso). «Porque» daría la causa.", prompt=_CC)
ch(1, "Penso, ___ existo.", ["logo", "luego", "depois"], "logo",
   "*Logo* conclusivo es «luego, por lo tanto»: *penso, logo existo*. En portugués no existe *luego*.", prompt=_CC)
ch(1, "___ você está aqui, me ajuda com a mudança.", ["Já que", "Embora", "Portanto"], "Já que",
   "Causa conocida al inicio: já que (= ya que).", prompt=_CC)
ch(1, "Leve guarda-chuva, ___ vai chover.", ["pois", "portanto", "contudo"], "pois",
   "«pois» al principio de la explicación = porque, que: leve guarda-chuva, pois vai chover.", prompt=_CC)
ch(2, "Todos reciclam, ___ o prédio vizinho.", ["inclusive", "incluso", "aliás"], "inclusive",
   "«incluso» en portugués = incluido. Para el «incluso» español: inclusive o até.", prompt=_CC)
ch(2, "O show foi ótimo. ___, você viu o Gilberto Gil no final?", ["Aliás", "Portanto", "Contudo"], "Aliás",
   "«aliás» = por cierto, a propósito; también «es más».", prompt=_CC)
ch(2, "___ esteja cansado, vou ao debate.", ["Embora", "Apesar de", "Mesmo"], "Embora",
   "*Embora* («aunque») pide subjuntivo: *embora esteja cansado*. *Apesar de* va con sustantivo o infinitivo.", prompt=_CC)

_CO34 = "Completá con el conector adecuado (en paréntesis, el sentido)."
cl(0, "O bairro é caro; ___ (sin embargo), vale a pena.", "no entanto",
   "Adversativo formal: no entanto, porém, contudo, todavia o entretanto.",
   alt=["porém", "contudo", "todavia", "entretanto"], prompt=_CO34)
cl(0, "Freyre valorizou a mistura cultural; ___ (sin embargo), seus críticos dizem que suavizou a violência da escravidão.", "contudo",
   "Adversativo formal. «Casa-Grande & Senzala» (1933), de Gilberto Freyre, sigue siendo tan leído como discutido.",
   alt=["no entanto", "porém", "todavia", "entretanto"], prompt=_CO34)
cl(0, "Queria ir ao show, ___ (pero) não consegui ingresso.", "mas",
   "«Pero» es *mas*, sin *i* (se opone a lo anterior); *mais* es «más». Ojo: en el habla suenan parecido.", alt=["porém"], prompt=_CO34)
cl(0, "Ela ___ (todavía) mora em Niterói.", "ainda",
   "«Todavía» (aún) es *ainda*: *ainda mora*. *Todavia* es un falso amigo que significa «sin embargo».", prompt=_CO34)
cl(1, "Desmataram a encosta; ___ (por lo tanto), houve deslizamento.", "portanto",
   "Conclusivo formal, en una sola palabra: portanto.", alt=["por isso", "logo", "então"], prompt=_CO34)
cl(1, "Não trouxe dinheiro; ___ (por eso), não comprei nada.", "por isso",
   "Consecuencia: por isso.", alt=["portanto", "então", "logo"], prompt=_CO34)
cl(1, "___ (dado que) o esgoto não é tratado, a baía sofre.", "Uma vez que",
   "Causa al inicio: uma vez que, visto que, já que, como.", alt=["Visto que", "Já que", "Como"], prompt=_CO34)
cl(1, "Fica mais um pouco, ___ (que, pues) ainda é cedo.", "pois",
   "Explicativo: pois (al inicio de la explicación) = porque.", alt=["porque", "já que"], prompt=_CO34)
cl(2, "Ela é carioca, ___ (o sea), ama praia.", "ou seja",
   "Reformulación: ou seja, isto é, quer dizer.", alt=["isto é", "quer dizer"], prompt=_CO34)
cl(2, "É barato e, ___ (además), fica perto do metrô.", "além disso",
   "Adición: além disso.", alt=["ainda por cima", "também"], prompt=_CO34)
cl(2, "___ (a pesar de la) crise, o bairro cresceu.", "Apesar da",
   "apesar de + a = apesar da: la contracción es obligatoria ante sustantivo.", prompt=_CO34)
cl(2, "___ (aunque) chova muito no litoral, falta água no sertão.", "Embora",
   "Concesión con subjuntivo: embora, mesmo que, ainda que.", alt=["Mesmo que", "Ainda que"], prompt=_CO34)

trv(0, "Río es hermoso, pero es caro.",
    "«Pero» se dice *mas* (sin *i*) o *porém*, más formal. *Mais* sería «más».",
    ["O Rio é lindo", "O Rio é bonito"], ", ", ["mas", "porém"], " é caro")
trv(0, "Todavía no llegó.",
    "«Todavía no» es *ainda não*. Nunca uses *todavia*, que en portugués significa «sin embargo».",
    ["Ainda não chegou", "Ele ainda não chegou", "Ela ainda não chegou"])
trv(0, "La ley existe; sin embargo, nadie la cumple.",
    "«Sin embargo» tiene varias formas: *no entanto*, *porém*, *contudo*, *todavia*, *entretanto*. Ojo: *todavia* no es «todavía».",
    "A lei existe; ", ["no entanto", "porém", "contudo", "todavia", "entretanto"], ", ninguém ",
    ["a cumpre", "cumpre", "cumpre ela"])
trv(1, "Estaba lloviendo, por eso nos quedamos.",
    "Consecuencia: por isso / então / portanto.",
    ["Estava chovendo", "Chovia"], ", ", ["por isso", "então", "portanto"], " ",
    ["ficamos", "a gente ficou", "nós ficamos"])
trv(1, "Ya que estás acá, ayudame.",
    "«Ya que» se dice *já que*, como en español: *já que você está aqui*. En el habla, el imperativo con *você* va con pronombre delante: *me ajuda*.",
    "Já que ", ["você está", "está", "você tá", "tá"], " aqui, ", ["me ajuda", "me ajude", "ajude-me"])
trv(2, "Vinieron todos, incluso el administrador.",
    "«Incluso» es *inclusive* o *até*: *vieram todos, inclusive o síndico*. El administrador de un edificio es el *síndico*.",
    ["Vieram todos", "Todos vieram"], ", ", ["inclusive", "até", "até mesmo"], " o síndico")
trv(2, "Es carioca, o sea, ama la playa.",
    "«O sea» se dice *ou seja* o *isto é*, para reformular. Ojo: *amar praia* va sin artículo cuando es genérico.",
    ["Ela é carioca", "Ele é carioca", "É carioca"], ", ", ["ou seja", "isto é", "quer dizer"], ", ",
    ["ama", "adora"], " ", ["praia", "a praia"])
trv(2, "Aunque llueve mucho, falta agua.",
    "embora / mesmo que / ainda que + subjuntivo; apesar de + infinitivo.",
    ["Embora chova", "Mesmo que chova", "Ainda que chova", "Apesar de chover"], " muito, falta água")

fx(0, "O filme era longo, mais valeu a pena.", "mais", "mas",
   "O filme era longo, mas valeu a pena.", "ortografia",
   "«mas» (pero) sin i; «mais» es «más». Suenan casi igual en Río, por eso se confunden al escribir.")
fx(0, "Todavia não terminei o livro de Saramago.", "Todavia", "Ainda",
   "Ainda não terminei o livro de Saramago.", "falso_amigo",
   "*Todavia* significa «sin embargo»; «todavía no» se dice *ainda não*. Saramago, Nobel de Literatura 1998.")
fx(2, "Todos vieram à reunião, incluso o prefeito.", "incluso", "inclusive",
   "Todos vieram à reunião, inclusive o prefeito.", "falso_amigo",
   "«incluso» en portugués es «incluido» (o café está incluso). Para «incluso»: inclusive o até.",
   goodAlt=["até"])
fx(1, "Choveu muito, por tanto o jogo foi cancelado.", "por tanto", "portanto",
   "Choveu muito, portanto o jogo foi cancelado.", "espanol",
   "«por lo tanto» se dice portanto, en una sola palabra.")

_L34 = [["pero", "mas"], ["sin embargo", "no entanto"], ["por lo tanto", "portanto"]]
_GP34 = "Mirá los tres pares español → portugués y completá el cuarto."
gd(0, _L34, "todavía (= aún) → ___", "ainda", "todavia",
   "«todavia» existe, pero significa «sin embargo». «Todavía» (aún) es ainda.", prompt=_GP34)
gd(2, _L34, "incluso → ___", "inclusive", "incluso",
   "«incluso» en portugués es el participio de incluir (incluido). El «incluso» español es inclusive o até.", prompt=_GP34)
gd(0, _L34, "mientras tanto → ___", "enquanto isso", "entretanto",
   "En Brasil, «entretanto» se usa como «sin embargo». «Mientras tanto» es enquanto isso o nesse meio-tempo.",
   prompt=_GP34)

sc(0, ["Queria ir, mas choveu.", "Queria ir; choveu, porém.", "Queria ir; a chuva, contudo, não deixou.",
       "Queria ir; no entanto, choveu.", "O plano, porém, falhou.", "O prazo, contudo, é curto."],
   "¿Qué diferencia a «mas» de «porém / contudo / no entanto»?",
   ["«mas» va siempre al principio de su oración; los otros pueden ir en el medio o al final.",
    "«mas» es formal y los otros coloquiales.",
    "No hay diferencia: se usan igual."],
   "«mas» va siempre al principio de su oración; los otros pueden ir en el medio o al final.",
   "Regla: mas encabeza; porém, contudo, no entanto, todavia y entretanto pueden desplazarse entre comas.")
sc(1, ["Choveu; portanto, ficamos.", "Está tarde, logo vamos embora.", "Não estudou, por isso reprovou.",
       "Fica, pois está chovendo.", "Já que você veio, fica.", "Visto que ninguém veio, cancelamos."],
   "¿Qué conectores introducen una causa y cuáles una consecuencia?",
   ["Consecuencia: portanto, logo, por isso. Causa: pois (al inicio), já que, visto que.",
    "Todos introducen una causa.",
    "Consecuencia: pois, já que. Causa: portanto, logo."],
   "Consecuencia: portanto, logo, por isso. Causa: pois (al inicio), já que, visto que.",
   "Regla: conclusivos (portanto, logo, por isso, então) presentan el resultado; explicativos (pois, já que, uma vez que, visto que), la razón.")

ty(0, "Escribí en portugués «sin embargo» en dos palabras.", "sin embargo → ___", "no entanto",
   "no entanto = sin embargo. Sinónimos de una palabra: porém, contudo, todavia, entretanto.")
ty(2, "Escribí en portugués «por cierto / es más» en una palabra.", "por cierto → ___", "aliás",
   "aliás, con tilde en la a: por cierto, a propósito, es más.")

cb(0, "O projeto é bom. Custa muito. (no entanto)", "O projeto é bom; no entanto, custa muito.",
   "Adversativo formal entre dos oraciones: punto y coma o coma antes, coma después.",
   alt=["O projeto é bom, no entanto custa muito.", "O projeto é bom, no entanto, custa muito.",
        "O projeto é bom; custa, no entanto, muito."])
cb(1, "Choveu três dias. Houve enchente. (por isso)", "Choveu três dias, por isso houve enchente.",
   "Consecuencia con por isso.",
   alt=["Choveu três dias; por isso, houve enchente.", "Choveu três dias e por isso houve enchente.",
        "Choveu três dias, por isso, houve enchente."])
cb(2, "Chove muito. Falta água. (embora)", "Embora chova muito, falta água.",
   "embora + subjuntivo: chove → chova.",
   alt=["Falta água, embora chova muito.", "Embora chova muito falta água."])


# ============================================================================
# Semana 35 — Regência verbal
# partes: 0 assistir a, obedecer a, preferir, namorar · 1 sin preposición;
#         chegar e ir · 2 lembrar, esquecer y el relativo
# ============================================================================
wk(35, "B2", "regência verbal")

ch(0, "Assistimos ___ jogo no Maracanã.", ["ao", "o", "no"], "ao",
   "En la norma culta, assistir (ver) pide «a»: assistir ao jogo. En el habla se oye assistir o jogo.",
   prompt="Elegí la forma de la norma culta.")
ch(0, "Os motoristas devem obedecer ___ sinais de trânsito.", ["aos", "os", "nos"], "aos",
   "obedecer a: obedecer aos sinais.")
ch(0, "Prefiro samba ___ funk.", ["a", "do que", "que"], "a",
   "preferir X a Y: prefiro samba a funk. «Do que» es calco de «más que».")
ch(0, "A Bia namora ___ Rafa há dois anos.", ["o", "com o", "ao"], "o",
   "namorar alguém, sin preposición: namora o Rafa (o = artículo).")
ch(0, "Ela casou ___ um mineiro.", ["com", "a", "de"], "com",
   "casar com (o casar-se com), como en español.")
ch(0, "Sonho ___ uma casa em Ipanema.", ["com", "em", "de"], "com",
   "sonhar com + sustantivo: sonho com uma casa. Con infinitivo se usa sonhar em o sonhar com (sonho em/com morar).")
ch(1, "Ajudei ___ vizinho com a mudança.", ["o", "ao", "para o"], "o",
   "ajudar lleva objeto directo: ajudei o vizinho. No hay «a» personal.")
ch(1, "Vou visitar ___ avós em Recife.", ["os meus", "aos meus", "para os meus"], "os meus",
   "visitar alguém, sin preposición. «Aos meus» es la «a» personal del español.")
ch(1, "Chegamos ___ Rio de madrugada.", ["ao", "no", "em o"], "ao",
   "Norma culta: chegar a (ao Rio). En el habla, chegar no Rio. «Em o» siempre se contrae.",
   prompt="Elegí la forma de la norma culta.")
ch(1, "Moro ___ Botafogo, perto do metrô.", ["em", "a", "no"], "em",
   "morar em. Botafogo, Copacabana e Ipanema van sin artículo: em Botafogo.")
ch(2, "«Ainda Estou Aqui», o filme ___ assisti ontem, ganhou o Oscar.", ["a que", "que", "ao que"], "a que",
   "La preposición del verbo (assistir a) va delante del relativo: o filme a que assisti. La película de Walter Salles, sobre la dictadura, ganó el Oscar a mejor película internacional en 2025.")
ch(2, "Eu ___ o novo síndico.", ["simpatizei com", "me simpatizei com", "simpatizei a"], "simpatizei com",
   "simpatizar com, sin pronombre reflexivo: simpatizei com ele.")

_CP = "Completá con la preposición (contraída con el artículo si hace falta)."
cl(0, "Assisti ___ uma palestra sobre Paulo Freire.", "a",
   "assistir a (presenciar). Ante «uma» no hay contracción obligatoria.", prompt=_CP)
cl(0, "Assistimos ___ desfile das escolas de samba na Sapucaí.", "ao",
   "*Assistir* con el sentido de «ver un espectáculo» pide *a*: *assistir ao desfile*. Sin preposición (*assistir o paciente*) es «asistir, atender».", prompt=_CP)
cl(0, "Os filhos devem obedecer ___ pais?", "aos",
   "*Obedecer* pide *a* (objeto indirecto), que se contrae con el artículo: *obedecer aos pais*. En español también «obedecer a los padres».", prompt=_CP)
cl(0, "Prefiro cinema ___ teatro.", "ao",
   "preferir X a Y: a + o teatro = ao teatro.", prompt=_CP)
cl(0, "Clarice Lispector casou ___ um diplomata e morou anos fora do Brasil.", "com",
   "casar com. Clarice vivió en Italia, Suiza, Inglaterra y Estados Unidos por el trabajo de su marido.", prompt=_CP)
cl(1, "Espero ___ ônibus há meia hora.", "o",
   "esperar lleva objeto directo: espero o ônibus. Lo que falta es el artículo.",
   prompt="Completá con la palabra que falta (preposición o artículo).")
cl(1, "Convidei ___ Lucas para o churrasco.", "o",
   "convidar alguém: sin «a» personal. Delante del nombre, artículo: o Lucas.",
   prompt="Completá con la palabra que falta (preposición o artículo).")
cl(1, "Os turistas chegaram ___ aeroporto do Galeão.", "ao",
   "Norma: chegar a + o = ao. En el habla, no aeroporto.", alt=["no"], prompt=_CP)
cl(1, "Moro ___ Rua do Catete desde criança.", "na",
   "*Morar* lleva *em*, que se contrae con el artículo: *moro na Rua do Catete*. En el habla nunca *moro a*.", prompt=_CP)
cl(2, "Não me lembro ___ nome dele.", "do",
   "lembrar-se de: me lembro do nome. Sin pronombre: não lembro o nome.", prompt=_CP)
cl(2, "Esqueci-me ___ senha do banco.", "da",
   "esquecer-se de + a senha = da senha. Sin pronombre: esqueci a senha.", prompt=_CP)
cl(2, "A cidade ___ que moro é pequena.", "em",
   "morar em → a cidade em que moro. La preposición va delante del relativo.", prompt=_CP)

trv(0, "Prefiero la playa a la montaña.",
    "preferir X a Y, sin «más» ni «que».",
    "Prefiro ", ["praia a montanha", "a praia à montanha", "a praia a montanha"])
trv(0, "Bia está de novia con Rafa.",
    "namorar alguém: sin «com».",
    ["A Bia namora o Rafa", "Bia namora Rafa", "A Bia namora Rafa", "Bia namora o Rafa"])
trv(0, "Vimos el partido en el Maracaná.",
    "Norma: assistir ao jogo; habla: assistir o jogo o ver o jogo.",
    ["Assistimos ao jogo", "Nós assistimos ao jogo", "A gente assistiu ao jogo", "Assistimos o jogo",
     "Vimos o jogo", "A gente viu o jogo", "A gente assistiu o jogo"], " no Maracanã")
trv(0, "Soñé con vos.",
    "sonhar com alguém.",
    ["Sonhei com você", "Eu sonhei com você", "Sonhei contigo", "Eu sonhei contigo"])
trv(1, "Ayudé a mi vecino con la mudanza.",
    "ajudar alguém: sin «a» personal.",
    ["Ajudei", "Eu ajudei"], " ", ["o meu vizinho", "meu vizinho"], " com a mudança")
trv(1, "Te espero en la estación.",
    "esperar alguém: sin preposición.",
    ["Te espero", "Eu te espero", "Espero você", "Eu espero você", "Espero-te", "Espero por você"], " na estação")
trv(2, "Me olvidé de la contraseña.",
    "esquecer algo o esquecer-se de algo (habla: esquecer de).",
    ["Esqueci a senha", "Esqueci-me da senha", "Me esqueci da senha", "Esqueci da senha", "Eu esqueci a senha",
     "Eu me esqueci da senha"])
trv(2, "La persona de la que te hablé es carioca.",
    "falar de → a pessoa de quem (o da qual) te falei.",
    "A pessoa ", ["de quem", "da qual", "de que"], " ", ["te falei", "eu te falei", "falei"], " é carioca")

fx(0, "A Bia namora com o Rafa desde o carnaval.", "namora com", "namora",
   "A Bia namora o Rafa desde o carnaval.", "regencia",
   "namorar es transitivo directo: namorar alguém. «Namorar com» es regional y la norma lo rechaza.")
fx(0, "Prefiro mais praia do que montanha.", "mais praia do que", "praia a",
   "Prefiro praia a montanha.", "regencia",
   "preferir ya compara: preferir X a Y, sin «mais» ni «do que».")
fx(1, "Ajudei ao meu vizinho a carregar as caixas.", "ao meu vizinho", "o meu vizinho",
   "Ajudei o meu vizinho a carregar as caixas.", "a_personal",
   "En portugués no hay «a» personal: ajudei o meu vizinho.",
   goodAlt=["meu vizinho"])
fx(2, "Esqueci-me a senha do cartão.", "Esqueci-me a", "Esqueci-me da",
   "Esqueci-me da senha do cartão.", "regencia",
   "Con pronombre, preposición: esqueci-me da senha. Sin pronombre, directo: esqueci a senha.",
   goodAlt=["Esqueci a"])

_GP35 = "Mirá los tres pares español → portugués y completá el cuarto."
gd(0, [["hablar con Rafa", "falar com o Rafa"], ["soñar con el mar", "sonhar com o mar"], ["casarse con Bia", "casar com a Bia"]],
   "estar de novio con Bia → ___", "namorar a Bia", "namorar com a Bia",
   "Los tres primeros llevan «com» como en español, pero namorar va sin preposición: namorar a Bia (a = artículo).",
   prompt=_GP35)
gd(1, [["ir a Río", "ir ao Rio"], ["llegar a Salvador", "chegar a Salvador"], ["volver a Recife", "voltar a Recife"]],
   "ayudar a Rafa → ___", "ajudar o Rafa", "ajudar ao Rafa",
   "Con lugares la «a» se conserva, pero ante persona objeto directo no: ajudar o Rafa.",
   prompt=_GP35)
gd(1, [["ir a Río", "ir ao Rio"], ["llegar a Salvador", "chegar a Salvador"], ["volver a Recife", "voltar a Recife"]],
   "visitar a los abuelos → ___", "visitar os avós", "visitar aos avós",
   "visitar es transitivo directo: visitar os avós. La «a» personal del español no existe en portugués.",
   prompt=_GP35)

sc(0, ["Assisti ao jogo.", "Assistimos a um show.", "O médico assiste o paciente.",
       "A enfermeira assiste os doentes.", "Assisti à peça.", "Vamos assistir ao filme."],
   "¿Cuándo «assistir» lleva «a»?",
   ["Cuando significa «ver, presenciar»; sin «a» significa «atender, ayudar».",
    "Siempre lleva «a».",
    "Solo cuando el objeto es una persona; con cosas (o jogo, o filme), sin «a»."],
   "Cuando significa «ver, presenciar»; sin «a» significa «atender, ayudar».",
   "Regla: assistir a (espectáculo) = ver; assistir alguém = atender. En el habla se dice assistir o jogo, pero en un texto, assistir ao jogo.")
sc(1, ["Espero o ônibus.", "Ajudei a Ana.", "Visitei meus avós.", "Convidei o Rafa.", "Conheço a Bia.", "Vi o João."],
   "¿Hay «a» personal en portugués?",
   ["No: con estos verbos la persona va sin preposición; la «a» que aparece es artículo.",
    "Sí, igual que en español.",
    "Solo con nombres propios."],
   "No: con estos verbos la persona va sin preposición; la «a» que aparece es artículo.",
   "Regla: esperar, ajudar, visitar, convidar, conhecer, ver + persona sin preposición. En «ajudei a Ana», a es el artículo femenino.")

ty(0, "Escribí la preposición que pide «casar».", "casar ___ alguém", "com",
   "casar com (o casar-se com).")
ty(2, "Escribí la preposición que pide «pensar».", "Penso ___ você todo dia.", "em",
   "pensar em: penso em você.")

cb(2, "Assisti a um filme ontem. O filme era de Glauber Rocha. (a que)", "O filme a que assisti ontem era de Glauber Rocha.",
   "assistir a → o filme a que assisti. Glauber Rocha fue la figura central del Cinema Novo.",
   alt=["O filme a que eu assisti ontem era de Glauber Rocha.", "O filme ao qual assisti ontem era de Glauber Rocha."])
cb(2, "A Bia casou com um rapaz. O rapaz é de Recife. (com quem)", "O rapaz com quem a Bia casou é de Recife.",
   "casar com → o rapaz com quem casou.",
   alt=["O rapaz com quem Bia casou é de Recife.", "O rapaz com quem a Bia se casou é de Recife."])
cb(2, "Moro numa cidade. A cidade é pequena. (em que)", "A cidade em que moro é pequena.",
   "morar em → a cidade em que moro.",
   alt=["A cidade em que eu moro é pequena.", "A cidade onde moro é pequena."])


# ============================================================================
# Semana 36 — Crase
# partes: 0 qué es, truco del masculino, horas · 1 cuándo nunca; lugares ·
#         2 àquele y locuciones
# ============================================================================
wk(36, "B2", "crase")

_CR = "Elegí: ¿con crase o sin crase?"
ch(0, "Vou ___ praia de Ipanema.", ["à", "a", "á"], "à",
   "*Ir a* + *a praia* se funde en *à*, con acento grave (*crase*); el acento agudo ✗*á* no existe sobre una *a* sola.", prompt=_CR)
ch(0, "Entreguei o livro ___ professora.", ["à", "a", "na"], "à",
   "entregar algo a alguém + a professora = à professora (truco: ao professor).", prompt=_CR)
ch(0, "Fomos ___ lojas do Saara.", ["às", "as", "à"], "às",
   "*A* + *as lojas* da *às lojas*, con *crase* en plural. El Saara es el mercado popular del centro de Río.", prompt=_CR)
ch(0, "O show começa ___ nove.", ["às", "as", "à"], "às",
   "Hora determinada: siempre crase, às nove.", prompt=_CR)
ch(0, "Estou aqui desde ___ sete.", ["as", "às", "das"], "as",
   "Con «desde» la preposición ya está: desde as sete, sin crase.", prompt=_CR)
ch(1, "Fui ___ pé até o Arpoador.", ["a", "à", "ao"], "a",
   "«pé» es masculino: a pé, nunca à pé.", prompt=_CR)
ch(1, "Começou ___ chover.", ["a", "à", "há"], "a",
   "Delante de verbo nunca hay crase: começou a chover.", prompt=_CR)
ch(1, "Vou ___ Copacabana amanhã.", ["a", "à", "na"], "a",
   "Copacabana va sin artículo (volto de Copacabana): vou a Copacabana.", prompt=_CR)
ch(1, "Amanhã vou ___ Lapa.", ["à", "a", "á"], "à",
   "A Lapa lleva artículo (volto da Lapa): vou à Lapa.", prompt=_CR)
ch(1, "Em 1808, a família real chegou ___ Bahia antes de ir para o Rio.", ["à", "a", "ao"], "à",
   "A Bahia lleva artículo (volto da Bahia): chegou à Bahia. La corte desembarcó en Salvador en enero de 1808.", prompt=_CR)
ch(2, "Refiro-me ___ reunião de ontem.", ["àquela", "a aquela", "à aquela"], "àquela",
   "La preposición *a* se funde con *aquela*: *àquela*, en una sola palabra con acento grave. Igual *àquele*, *àquilo*.", prompt=_CR)
ch(2, "Um filé ___ parmegiana, por favor.", ["à", "a", "ao"], "à",
   "«à parmegiana» = à moda parmegiana: la crase marca «a la manera de».", prompt=_CR)

_CRC = "Completá con a, à, às o ao."
cl(0, "Obedeça ___ placas.", "às",
   "*Obedecer* pide *a*, y con un sustantivo femenino plural hay *crase*: *obedeça às placas*.", prompt=_CRC)
cl(0, "A padaria abre ___ seis da manhã.", "às",
   "Hora determinada: às seis.", prompt=_CRC)
cl(0, "Chegou ___ uma da manhã.", "à",
   "Ante «uma» solo hay crase cuando es hora: à uma.", prompt=_CRC)
cl(0, "Vamos ___ feira de São Cristóvão no sábado.", "à",
   "La prueba de la *crase*: si con un masculino dirías *ao* (*vamos ao mercado*), con el femenino va *à*: *vamos à feira*.", prompt=_CRC)
cl(0, "Voltamos ___ meio-dia.", "ao",
   "meio-dia es masculino: ao meio-dia (pero à meia-noite).", prompt=_CRC)
cl(1, "Disse isso ___ ela.", "a",
   "Ante pronombre personal nunca hay crase: a ela.", prompt=_CRC)
cl(1, "Falou ___ pessoas importantes.", "a",
   "Plural sin artículo: a pessoas (si hubiera artículo, sería às pessoas).", prompt=_CRC)
cl(1, "Nunca fui ___ Salvador.", "a",
   "Salvador va sin artículo (volto de Salvador): a Salvador.", prompt=_CRC)
cl(1, "Em abril de 1974, os capitães levaram a revolução ___ ruas de Lisboa.", "às",
   "*Levar algo a* + *as ruas* da *às ruas* (*crase* en plural). Los capitanes del MFA derribaron el Estado Novo el 25 de Abril.", prompt=_CRC)
cl(2, "Fique ___ vontade!", "à",
   "Locución femenina: à vontade (ponete cómodo).", prompt=_CRC)
cl(2, "Saímos ___ pressas.", "às",
   "Locución: às pressas (a las apuradas).", prompt=_CRC)
cl(2, "Moramos ___ beira-mar.", "à",
   "Locución: à beira-mar (frente al mar).", prompt=_CRC)

trv(0, "Voy a la feria.",
    "*Ir a* + *a feira* se contrae en *à feira*: la *crase* une preposición y artículo. En el habla, *vou pra feira*.",
    ["Vou à feira", "Eu vou à feira"])
trv(0, "El museo abre de diez a cinco.",
    "de ... a con horas: das dez às cinco.",
    "O museu ", ["abre", "funciona", "fica aberto"], " das dez às cinco")
trv(1, "Le di el libro a ella.",
    "Ante pronombre personal, sin crase: a ela.",
    ["Dei o livro a ela", "Eu dei o livro a ela", "Dei o livro para ela", "Dei-lhe o livro",
     "Eu dei o livro para ela", "Eu lhe dei o livro"])
trv(1, "Mañana voy a Lapa y después a Copacabana.",
    "à Lapa (volto da Lapa), a Copacabana (volto de Copacabana).",
    "Amanhã ", ["vou", "eu vou"], " à Lapa e depois ", ["", "vou "], "a Copacabana")
trv(2, "Ponete cómodo.",
    "Locución: à vontade.",
    ["Fique", "Fica"], " à vontade")
trv(2, "Pagué al contado.",
    "Locución: à vista.",
    ["Paguei", "Eu paguei"], " à vista")
trv(2, "Me refiero a aquella ley.",
    "*Referir-se a* + *aquela* se funde en *àquela*, con acento grave. En español «a aquella» queda separado.",
    ["Refiro-me", "Me refiro", "Eu me refiro"], " àquela lei")
trv(0, "Llegamos a las tres.",
    "Hora determinada: às três.",
    ["Chegamos", "Nós chegamos", "A gente chegou"], " às três", ["", " horas"])

fx(1, "Fomos à pé até o Leblon.", "à pé", "a pé",
   "Fomos a pé até o Leblon.", "crase",
   "«pé» es masculino: no hay artículo «a», no hay crase.")
fx(1, "Começou à chover no meio do bloco.", "à chover", "a chover",
   "Começou a chover no meio do bloco.", "crase",
   "Delante de verbo nunca hay crase: los verbos no llevan artículo.")
fx(0, "O show começa as nove da noite.", "as nove", "às nove",
   "O show começa às nove da noite.", "crase",
   "Con horas determinadas, crase obligatoria: às nove.")
fx(1, "Vou à Copacabana no domingo.", "à Copacabana", "a Copacabana",
   "Vou a Copacabana no domingo.", "crase",
   "Volto de Copacabana (sin artículo) → vou a Copacabana, sin crase.")

_L36 = [["vou ao mercado", "vou à feira"], ["vou ao cinema", "vou à praia"], ["vou ao Leblon", "vou à Lapa"]]
_GP36 = "Mirá los tres pares masculino → femenino y completá el cuarto."
gd(1, _L36, "vou ao Maracanã → vou ___ Copacabana", "a", "à",
   "Copacabana no lleva artículo (volto de Copacabana): vou a Copacabana, sin crase.", prompt=_GP36)
gd(1, [["falei ao gerente", "falei à gerente"], ["escrevi ao diretor", "escrevi à diretora"], ["dei ao menino", "dei à menina"]],
   "falei ao gerente → falei ___ ela", "a", "à",
   "Ante pronombre personal no hay artículo, y sin artículo no hay crase: a ela.", prompt=_GP36)
gd(2, [["a + aquele", "àquele"], ["a + aquela", "àquela"], ["a + aquilo", "àquilo"]],
   "a + esta → ___", "a esta", "à esta",
   "Solo aquele, aquela y aquilo se funden con la a. Ante esta / essa no hay crase.",
   prompt="Mirá las tres uniones y completá la cuarta.")

sc(0, ["Vou ao mercado. / Vou à feira.", "Fui ao cinema. / Fui à praia.", "Refiro-me ao aluno. / Refiro-me à aluna.",
       "Conheço o Rafa. / Conheço a Bia.", "Vi o filme. / Vi a novela.", "Cheguei ao bar. / Cheguei à festa."],
   "¿Cuándo va crase?",
   ["Cuando con una palabra masculina aparecería «ao»: preposición a + artículo a.",
    "Siempre delante de palabras femeninas.",
    "Cuando el verbo está en pasado."],
   "Cuando con una palabra masculina aparecería «ao»: preposición a + artículo a.",
   "Regla: si el verbo pide «a» y la palabra lleva artículo «a», se funden en à. Conhecer y ver no piden «a»: conheço a Bia, sin crase.")
sc(1, ["Vou à Lapa. / Volto da Lapa.", "Vou à Bahia. / Volto da Bahia.", "Vou a Copacabana. / Volto de Copacabana.",
       "Vou a Ipanema. / Volto de Ipanema.", "Vou à Tijuca. / Volto da Tijuca.", "Vou a Salvador. / Volto de Salvador."],
   "¿Cómo sabés si un lugar lleva crase?",
   ["Si al volver decís «da», va crase; si decís «de», no.",
    "Todos los barrios de Río llevan crase; las ciudades, nunca.",
    "Solo las ciudades llevan crase."],
   "Si al volver decís «da», va crase; si decís «de», no.",
   "Regla: vou a, volto da, crase há; vou a, volto de, crase pra quê?")

ty(0, "Escribí la forma correcta: a, à, as o às.", "O ônibus para Petrópolis sai ___ quatro.", "às",
   "Hora determinada: às quatro.")
ty(2, "Uní: a + aquilo.", "a + aquilo → ___", "àquilo",
   "La preposición *a* también se funde con el neutro *aquilo*: *àquilo*, con acento grave. Igual con *aquele* y *aquela*.")

cb(0, "Fui à praia. Depois fui à feira. (e)", "Fui à praia e à feira.",
   "Coordinadas con el mismo verbo: se repite la crase ante cada femenino.",
   alt=["Fui à praia e depois à feira.", "Fui à praia e depois fui à feira.", "Fui à praia e fui à feira."])
cb(1, "Primeiro vou a Copacabana. Depois vou à Urca. (e depois)", "Primeiro vou a Copacabana e depois à Urca.",
   "Copacabana sin artículo (a); a Urca con artículo (à).",
   alt=["Primeiro vou a Copacabana e depois vou à Urca.", "Vou a Copacabana e depois à Urca.",
        "Vou a Copacabana e depois vou à Urca."])
cb(0, "A loja abre às nove. Fecha às seis. (e)", "A loja abre às nove e fecha às seis.",
   "Las horas determinadas llevan crase.",
   alt=["A loja abre às nove e fecha às seis horas.", "A loja funciona das nove às seis."])


# ============================================================================
# Semana 37 — Verbos irregulares e derivados
# partes: 0 familias de ter y vir · 1 familias de pôr y ver ·
#         2 -ear, -iar y los sueltos
# ============================================================================
wk(37, "B2", "verbos irregulares")

ch(0, "Eles ___ a tradição do samba de roda.", ["mantêm", "mantém", "mantienem"], "mantêm",
   "manter se conjuga como ter: eles têm → eles mantêm (circunflejo en plural, agudo en singular).")
ch(0, "A equipe da Fiocruz ___ ótimos resultados com a vacina.", ["obteve", "obteu", "obtiu"], "obteve",
   "obter como ter: teve → obteve. «Obteu» regulariza el verbo.")
ch(0, "Palmares ___ a resistência por quase um século.", ["manteve", "manteu", "mantiu"], "manteve",
   "manter → manteve, como teve. El quilombo de Palmares resistió en la sierra da Barriga durante buena parte del siglo XVII.")
ch(0, "O governo ___ no porto.", ["interveio", "interviu", "interveu"], "interveio",
   "intervir como vir: veio → interveio. «Interviu» es el error más común (lo confundís con ver).")
ch(0, "___ chegar cedo ao cartório.", ["Convém", "Convêm", "Conviene"], "Convém",
   "convir como vir: vem → convém (singular, con tilde aguda).")
ch(1, "Depois do terremoto de 1755, Pombal ___ uma Lisboa nova.", ["propôs", "propuso", "propós"], "propôs",
   "propor como pôr: pôs → propôs, con circunflejo. «Propuso» es español.")
ch(1, "Tom Jobim ___ «Garota de Ipanema» com Vinicius de Moraes.", ["compôs", "compuso", "compós"], "compôs",
   "compor como pôr: compôs.")
ch(1, "Os cientistas ___ mais calor para o próximo verão.", ["preveem", "prevêem", "prevém"], "preveem",
   "prever como ver: veem → preveem, sin circunflejo desde el Acuerdo de 1990.")
ch(1, "Ninguém ___ a tempestade.", ["previu", "preveu", "previo"], "previu",
   "prever como ver: viu → previu.")
ch(2, "Eu ___ no calçadão todo domingo.", ["passeio", "passeo", "paseio"], "passeio",
   "-ear: la e se vuelve ei en las formas acentuadas en la raíz: passeio.")
ch(2, "Eu ___ acordar cedo.", ["odeio", "odio", "odeo"], "odeio",
   "odiar es uno de los cinco -iar que van como -ear (MARIO): odeio.")
ch(2, "Eu não ___ nessa roupa.", ["caibo", "cabo", "quepo"], "caibo",
   "caber: eu caibo (y que eu caiba). «Quepo» es español.")

cl(0, "Espero que ele ___ (manter) a promessa.", "mantenha",
   "Subjuntivo presente como ter: tenha → mantenha.")
cl(0, "Nós ___ (obter) o visto ontem.", "obtivemos",
   "Perfeito como ter: tivemos → obtivemos.")
cl(0, "Quando a polícia ___ (intervir), a briga acabou.", "interveio",
   "Perfeito como vir: veio → interveio.")
cl(0, "Espero que ninguém ___ (intervir).", "intervenha",
   "Subjuntivo presente como vir: venha → intervenha.")
cl(1, "Agora eu ___ (propor) um brinde aos noivos!", "proponho",
   "Presente como pôr: ponho → proponho.")
cl(1, "Se você ___ (supor) que é fácil, vai se enganar.", "supuser",
   "Futuro do subjuntivo como pôr: puser → supuser.")
cl(1, "Chico Buarque ___ (compor) canções contra a censura durante a ditadura.", "compôs",
   "Perfeito como pôr: pôs → compôs. «Cálice» y «Apesar de você» son de esa época.")
cl(1, "Espero que o aplicativo ___ (prever) o trânsito.", "preveja",
   "Subjuntivo presente como ver: veja → preveja.")
cl(2, "Eles ___ (passear) pelo Aterro do Flamengo.", "passeiam",
   "-ear: passeiam (eles), pero passeamos (nós).")
cl(2, "Quem ___ (mediar) o debate hoje?", "medeia",
   "mediar es de los MARIO: medeia.")
cl(2, "Não ___ (caber) tudo na mala ontem.", "coube",
   "caber tiene perfeito irregular: coube.")
cl(2, "Sempre ___ (perder) o metrô por um minuto.", "perco",
   "perder: eu perco (y que eu perca).")

trv(0, "Ellos mantienen la casa.",
    "manter como ter: eles mantêm.",
    ["Eles mantêm", "Mantêm", "Elas mantêm"], " a casa")
trv(0, "El gobierno intervino.",
    "intervir como vir: interveio.",
    ["O governo interveio"])
trv(1, "Ella propuso una solución.",
    "propor como pôr: propôs.",
    ["Ela propôs", "Propôs"], " uma solução")
trv(1, "Los científicos prevén lluvia.",
    "prever como ver: preveem.",
    "Os cientistas preveem ", ["chuva", "chuvas"])
trv(2, "Paseamos por la costanera.",
    "-ear: nós passeamos (sin ei). Costanera = orla.",
    ["Passeamos", "Nós passeamos", "A gente passeou", "A gente passeia", "Passeamos"], " pela orla")
trv(2, "Odio el tránsito.",
    "odiar → odeio.",
    ["Odeio", "Eu odeio"], " o trânsito")
trv(2, "No entró todo en la valija.",
    "«entrar en» (caber) = caber; perfeito coube.",
    ["Não coube tudo na mala"])
trv(2, "Siempre pierdo las llaves.",
    "perder → perco.",
    ["Sempre perco", "Eu sempre perco", "Perco sempre"], " as chaves")

fx(0, "A polícia interviu na briga.", "interviu", "interveio",
   "A polícia interveio na briga.", "verbo_irregular",
   "intervir se conjuga como vir (veio → interveio), no como ver (viu).")
fx(1, "O deputado propuso uma nova lei.", "propuso", "propôs",
   "O deputado propôs uma nova lei.", "espanol",
   "propor como pôr: propôs. «Propuso» es la forma española.")
fx(2, "Eu passeo com o cachorro na orla.", "passeo", "passeio",
   "Eu passeio com o cachorro na orla.", "verbo_irregular",
   "-ear: passeio, passeias, passeia, passeiam.")
fx(0, "Eles mantém a tradição.", "mantém", "mantêm",
   "Eles mantêm a tradição.", "concordancia",
   "Singular mantém (agudo), plural mantêm (circunflejo), como tem / têm.")

gd(0, [["comer", "comeu"], ["vender", "vendeu"], ["bater", "bateu"]], "manter → ele ___", "manteve", "manteu",
   "manter no es regular: se conjuga como ter (teve → manteve).",
   prompt="Mirá los tres perfeitos (ele) y completá el cuarto.")
gd(2, [["copiar", "copio"], ["anunciar", "anuncio"], ["estudar", "estudo"]], "odiar → eu ___", "odeio", "odio",
   "La mayoría de los -iar son regulares, pero odiar está entre los MARIO: odeio.",
   prompt="Mirá los tres presentes (eu) y completá el cuarto.")
gd(2, [["passar", "passo"], ["falar", "falo"], ["andar", "ando"]], "passear → eu ___", "passeio", "passeo",
   "Los verbos en -ear agregan i: passeio. «Passeo» es la forma que te da el patrón y el español.",
   prompt="Mirá los tres presentes (eu) y completá el cuarto.")

sc(0, ["ter → tenho / manter → mantenho", "ter → teve / obter → obteve", "vir → veio / intervir → interveio",
       "pôr → pôs / propor → propôs", "ver → vejo / prever → prevejo", "pôr → ponha / compor → componha"],
   "¿Cómo se conjugan los derivados de ter, vir, pôr y ver?",
   ["Exactamente como el verbo base, con el prefijo delante.",
    "Como verbos regulares en -er / -ir.",
    "Como el verbo base solo en presente; en el pasado, regulares."],
   "Exactamente como el verbo base, con el prefijo delante.",
   "Regla: manter, obter, conter (ter); intervir, convir (vir); propor, compor, supor (pôr); prever, rever (ver).")
sc(2, ["passear → passeio", "frear → freio", "odiar → odeio", "mediar → medeio", "copiar → copio", "anunciar → anuncio"],
   "¿Qué verbos toman -ei- en las formas acentuadas en la raíz?",
   ["Todos los -ear y cinco -iar (mediar, ansiar, remediar, incendiar, odiar).",
    "Todos los verbos en -iar.",
    "Solo los verbos en -ear, y solo en la 1.ª persona."],
   "Todos los -ear y cinco -iar (mediar, ansiar, remediar, incendiar, odiar).",
   "Regla: -ear siempre (passeio); -iar regular (copio), salvo MARIO (odeio, medeio).")

ty(1, "Escribí el perfeito (ele) de «supor».", "Ele ___ que era verdade.", "supôs",
   "supor como pôr: supôs.")
ty(2, "Escribí el presente (eu) de «medir».", "Eu ___ um metro e oitenta.", "meço",
   "medir: eu meço, ele mede.")

cb(0, "O pesquisador obteve os dados. Publicou o artigo. (assim que)",
   "Assim que obteve os dados, o pesquisador publicou o artigo.",
   "«assim que» con hechos pasados va con indicativo (obteve).",
   alt=["O pesquisador publicou o artigo assim que obteve os dados.",
        "Assim que o pesquisador obteve os dados, publicou o artigo."])
cb(1, "Os meteorologistas preveem chuva. Leve guarda-chuva. (já que)",
   "Já que os meteorologistas preveem chuva, leve guarda-chuva.",
   "Causa conocida al inicio con já que; preveem sin circunflejo.",
   alt=["Leve guarda-chuva, já que os meteorologistas preveem chuva.",
        "Já que os meteorologistas preveem chuva, leva guarda-chuva."])
cb(2, "A mala é pequena. Não cabe tudo. (por isso)", "A mala é pequena, por isso não cabe tudo.",
   "Consecuencia con por isso; caber → cabe.",
   alt=["A mala é pequena; por isso, não cabe tudo.", "A mala é pequena e por isso não cabe tudo."])


# ============================================================================
# Semana 38 — Português falado do Brasil
# partes: 0 reducciones, marcadores y reacciones · 1 cadê y ter por haver ·
#         2 pronombres del habla y registro
# ============================================================================
wk(38, "B2", "português falado")

_HB = "Elegí cómo se dice en el habla de Brasil."
ch(0, "«Vou para o Arpoador», dicho rápido:", ["Vou pro Arpoador.", "Vou pra o Arpoador.", "Vou po Arpoador."], "Vou pro Arpoador.",
   "para o → pro; para a → pra. «Pra o» no se dice.", prompt=_HB)
ch(0, "«Estoy llegando» en un chat:", ["Tô chegando.", "Tá chegando.", "Estô chegando."], "Tô chegando.",
   "estou → tô; está → tá. «Tá chegando» = está llegando (él, ella, vos).", prompt=_HB)
ch(0, "«Es para vos.»", ["É pra você.", "É pra cê.", "É pa cê."], "É pra você.",
   "«cê» no va después de preposición ni al final: é pra você, com você.", prompt=_HB)
ch(0, "Tá quente hoje, ___?", ["né", "no", "não é que"], "né",
   "«né» (de não é) pide acuerdo, como «¿no?». «No» en portugués es «en el».", prompt=_HB)
ch(0, "— O aluguel tá caro, né? — ___. Tá tudo caro.", ["Pois é", "Pois não", "Então é"], "Pois é",
   "«pois é» = y sí, así es. Ojo: «pois não» significa «¿en qué lo ayudo?» o «¡cómo no!».", prompt=_HB)
ch(0, "«Qué sé yo.»", ["Sei lá.", "Que sei eu.", "O que sei."], "Sei lá.",
   "*Sei lá* es «qué sé yo, ni idea»: *lá* («allá») refuerza sin sentido de lugar. ✗*Que sei eu* es calco.", prompt=_HB)
ch(1, "«¿Dónde está mi celular?»", ["Cadê meu celular?", "Cadê está meu celular?", "Onde cadê meu celular?"], "Cadê meu celular?",
   "«cadê» ya incluye el verbo: cadê meu celular?", prompt=_HB)
ch(1, "«Había mucha gente en el bloco.»", ["Tinha muita gente no bloco.", "Tinham muita gente no bloco.", "Estava muita gente no bloco."],
   "Tinha muita gente no bloco.",
   "En el habla, ter por haver, siempre en singular: tinha muita gente.", prompt=_HB)
ch(1, "«Hay muchas personas acá.»", ["Tem muitas pessoas aqui.", "Têm muitas pessoas aqui.", "Estão muitas pessoas aqui."],
   "Tem muitas pessoas aqui.",
   "«tem» existencial no concuerda: tem muitas pessoas (como «hay»).", prompt=_HB)
ch(2, "Você sabe que eu ___ amo.", ["te", "lhe", "ti"], "te",
   "En el habla de Brasil se mezcla você con te: eu te amo. En la norma, você → o / a.", prompt=_HB)
ch(2, "¿Cuál va en un mail formal?", ["Estou a caminho.", "Tô chegando, pera aí.", "Tô indo, beleza?"], "Estou a caminho.",
   "Las reducciones (tô, pera aí) y los marcadores (beleza) son del habla y los chats; en un mail formal, forma plena.",
   prompt="Elegí la opción adecuada para el registro formal.")
ch(2, "«¡Qué show copado!» (carioca)", ["Que show maneiro!", "Que show copado!", "Que show manero!"], "Que show maneiro!",
   "En el habla carioca, «copado» se dice *maneiro* (*que show maneiro!*). *Copado* no existe en portugués.", prompt=_HB)

_RD = "Escribí la forma reducida del habla."
cl(0, "Eu ___ (estou) cansado.", "tô", "estou → tô.", prompt=_RD)
cl(0, "Ela ___ (está) na praia.", "tá", "está → tá.", prompt=_RD)
cl(0, "Vou ___ (para o) Leblon.", "pro", "para o → pro.", prompt=_RD)
cl(0, "Vamos ___ (para a) Lapa?", "pra", "para a → pra.", prompt=_RD)
cl(0, "___ (você) vem hoje?", "Cê", "você → cê, solo delante del verbo.", prompt=_RD)
cl(0, "___ (espera aí), já volto!", "Pera aí", "espera aí → pera aí (también se escribe peraí).",
   alt=["Peraí"], prompt=_RD)
cl(1, "___ (onde está) a Bia?", "Cadê", "onde está → cadê, sin verbo.", prompt=_RD)
cl(1, "Não ___ (há) problema.", "tem", "En el habla, ter reemplaza a haver: não tem problema.", prompt=_RD)
cl(1, "Ontem ___ (havia) muita gente no Aterro.", "tinha", "havia → tinha (ter por haver).", prompt=_RD)
cl(2, "Eu ___ (estava) no metrô quando cê ligou.", "tava", "estava → tava.", prompt=_RD)
cl(2, "Tô ___ (em um) bar em Botafogo.", "num", "em um → num, muy frecuente también en la escritura informal.", prompt=_RD)
cl(2, "«Tô chegando» → ___ chegando.", "Estou",
   "En registro formal, forma plena: estou chegando (o estou a caminho).",
   prompt="Escribí la forma plena del registro formal.")

trv(0, "(Habla) Estoy cansado, ¿viste?",
    "estou → tô; «¿viste?, ¿no?» = né.",
    ["Tô cansado", "Estou cansado", "Tô cansada", "Estou cansada"], ", né")
trv(0, "(Habla) Voy a la playa, ¿venís?",
    "para a → pra; você → cê delante del verbo.",
    ["Vou pra praia", "Tô indo pra praia", "Vou à praia", "Vou para a praia"], ", ", ["cê vem", "você vem", "vem"])
trv(0, "(Habla) Qué sé yo, creo que viene.",
    "«Qué sé yo» es *sei lá*, y «creo que» se dice *acho que* (*achar* «opinar»), no *creio que*, que es formal.",
    "Sei lá, ", ["acho que ele vem", "acho que ela vem", "acho que vem"])
trv(1, "(Habla) ¿Dónde están las llaves?",
    "*Cadê?* es «¿dónde está / están?» en el habla brasileña: invariable, sin verbo: *cadê as chaves?* En la escritura: *onde estão*.",
    ["Cadê as chaves", "Onde estão as chaves", "Onde tão as chaves"])
trv(1, "(Habla) Hay un bar buenísimo en la esquina.",
    "En el habla, «hay» se dice *tem*: *tem um boteco ótimo*. *Há* queda para la escritura, y *boteco* es el bar de barrio.",
    "Tem um ", ["boteco", "bar"], " ", ["ótimo", "muito bom", "maneiro", "excelente", "incrível"], " na esquina")
trv(1, "(Habla) No hay problema.",
    "não tem problema (habla) / não há problema (escrito).",
    ["Não tem problema", "Sem problema", "Não há problema", "Tem problema não"])
trv(2, "(Habla) Lo vi en la playa ayer.",
    "En el habla: vi ele. En la escritura: vi-o.",
    ["Vi ele na praia ontem", "Eu vi ele na praia ontem", "Vi ele ontem na praia", "Eu vi ele ontem na praia",
     "Eu o vi na praia ontem", "Vi-o na praia ontem"])
trv(2, "(Formal) Estoy en camino.",
    "Registro formal: forma plena.",
    ["Estou a caminho", "Já estou a caminho", "Estou chegando"])

fx(1, "Cadê está o meu carregador?", "Cadê está", "Cadê",
   "Cadê o meu carregador?", "espanol",
   "«cadê» ya significa «¿dónde está?»: no lleva verbo. El calco de «¿dónde está?» mete el está.")
fx(1, "Têm muitas pessoas na fila do Cristo.", "Têm", "Tem",
   "Tem muitas pessoas na fila do Cristo.", "concordancia",
   "«tem» existencial (= hay) no concuerda: tem muitas pessoas.")
fx(0, "Esse presente é pra cê.", "pra cê", "pra você",
   "Esse presente é pra você.", "pronome",
   "«cê» solo va antes del verbo (cê vem?); después de preposición, você: pra você.")
fx(2, "Vi ele na reunião de ontem.", "Vi ele", "Vi-o",
   "Vi-o na reunião de ontem.", "pronome",
   "En el habla se dice vi ele, pero en una carta formal el objeto directo es o: vi-o.")["prompt"] = \
    "Carta formal. Encontrá el error de registro: tocá la palabra que está mal y corregila."

_L38 = [["estou", "tô"], ["está", "tá"], ["você", "cê"]]
_GP38 = "Mirá las tres reducciones del habla y completá la cuarta."
gd(0, _L38, "para o → ___", "pro", "pra o",
   "para o se funde en pro (y para a en pra). «Pra o» no se dice.", prompt=_GP38)
gd(0, _L38, "para os → ___", "pros", "pra os",
   "para os → pros; para as → pras.", prompt=_GP38)
gd(2, _L38, "estava → ___", "tava", "taba",
   "estava → tava, con v: el imperfeito de estar es estava, no «estaba».", prompt=_GP38)

sc(0, ["Tá quente hoje, né?", "Você vem, né?", "Ele é carioca, né?", "Tá caro, né?", "A gente vai amanhã, né?",
       "Isso é seu, né?"],
   "¿Para qué sirve «né» al final de la frase?",
   ["Para pedir acuerdo al que escucha, como «¿no?» o «¿viste?».",
    "Para negar lo que se acaba de decir.",
    "Para hacer una pregunta formal de sí o no, como «¿es cierto que…?»."],
   "Para pedir acuerdo al que escucha, como «¿no?» o «¿viste?».",
   "Regla: né (de não é) es una muletilla de acuerdo. No niega nada.")
sc(1, ["Cadê o Rafa?", "Cadê meu celular?", "Cadê vocês?", "Cadê as chaves?", "Cadê a Bia?", "Cadê o biscoito?"],
   "¿Qué significa «cadê» y cómo se usa?",
   ["«¿Dónde está / están?», sin verbo, en singular o plural.",
    "«¿Cuándo?», con verbo conjugado.",
    "«¿Qué es?», solo con cosas."],
   "«¿Dónde está / están?», sin verbo, en singular o plural.",
   "Regla: cadê + sustantivo o pronombre, sin verbo. Es del habla; por escrito formal, onde está.")

ty(0, "Escribí la reducción de «para o».", "para o → ___", "pro",
   "para o → pro.")
ty(1, "Escribí en una palabra «¿dónde está?» (habla).", "___ o Rafa?", "Cadê",
   "*Cadê* es «¿dónde está?», propio del habla brasileña; no lleva verbo: *cadê o Rafa?*")

cb(0, "Fui no bar. Encontrei o Rafa. (aí)", "Fui no bar, aí encontrei o Rafa.",
   "«aí» hace avanzar el relato en el habla: y entonces.",
   alt=["Fui no bar e aí encontrei o Rafa.", "Fui no bar aí encontrei o Rafa.", "Fui ao bar, aí encontrei o Rafa."])
cb(0, "Tava chovendo. A gente ficou em casa. (então)", "Tava chovendo, então a gente ficou em casa.",
   "«então» introduce la consecuencia, muy frecuente en el habla.",
   alt=["Estava chovendo, então a gente ficou em casa.", "Tava chovendo então a gente ficou em casa."])
cb(2, "Não fui no bloco. Tava cansado. (porque)", "Não fui no bloco porque tava cansado.",
   "Causa con porque; en el habla, tava y ir no.",
   alt=["Não fui no bloco porque estava cansado.", "Não fui ao bloco porque estava cansado.",
        "Não fui ao bloco porque tava cansado."])


# ============================================================================
# Semana 39 — CHEFÃO B2: 20 ítems mixtos de toda la estación
# partes: 0 subjuntivos, condicionales, discurso indirecto ·
#         1 regencia, crase, conectores, pasiva y pronombres
# ============================================================================
wk(39, "B2", "chefão B2")

ch(0, "Quando você ___ a Bia, avisa que eu cheguei.", ["vir", "ver", "vier"], "vir",
   "Futuro do subjuntivo de ver: vir (viram → vir). «Vier» es de vir (venir).")
ch(0, "Se eu ___ tempo, iria ao Museu Nacional.", ["tivesse", "tiver", "teria"], "tivesse",
   "Hipótesis del presente: se + imperfeito do subjuntivo, consecuencia en futuro do pretérito.")
ch(0, "Se a ditadura não ___ censurado a imprensa, muitas histórias teriam sido contadas antes.",
   ["tivesse", "teria", "tiver"], "tivesse",
   "Hipótesis sobre el pasado: se + tivesse + participio; consecuencia con teria + participio.")
cl(0, "É bom vocês ___ (fazer) a reserva com antecedência.", "fazerem",
   "Infinitivo pessoal: sale del infinitivo, fazerem (no fizerem).")
cl(0, "«Não gritem!» → O professor pediu que nós não ___ (gritar).", "gritássemos",
   "Imperativo reportado en pasado → imperfeito do subjuntivo: gritássemos.")
cl(0, "«Eu quero votar para presidente!» → Nas Diretas Já (1984), o povo dizia que ___ (querer) votar para presidente.", "queria",
   "Presente reportado desde el pasado → imperfeito: queria. «Diretas Já» fue la campaña por elecciones presidenciales directas.")
trv(0, "Si hubiera estudiado, habría aprobado.",
    "se + tivesse estudado; consecuencia teria passado (habla: tinha passado). «Aprobar» un examen es *passar*.",
    ["Se eu tivesse estudado", "Se tivesse estudado"], ", ", ["teria passado", "eu teria passado", "tinha passado", "eu tinha passado"])
trv(0, "Cuando llegue a Lisboa, te llamo.",
    "*Quando* con valor futuro pide futuro do subjuntivo: *quando eu chegar*. El español usa presente de subjuntivo («cuando llegue»).",
    ["Quando eu chegar", "Quando chegar"], " ", ["a Lisboa", "em Lisboa"], ", ",
    ["te ligo", "eu te ligo", "ligo pra você", "ligo para você", "vou te ligar"])
fx(0, "Se eu poderia, viajaria para Angola e Moçambique.", "poderia", "pudesse",
   "Se eu pudesse, viajaria para Angola e Moçambique.", "subjuntivo",
   "Tras «se», nunca condicional: se eu pudesse.")
ty(0, "Escribí el infinitivo pessoal (nós) de «ir».", "É hora de ___, galera!", "irmos",
   "ir → irmos.")

ch(1, "Assisti ___ show do Caetano no Circo Voador.", ["ao", "o", "no"], "ao",
   "Norma culta: assistir a (ver): assisti ao show.", prompt="Elegí la forma de la norma culta.")
ch(1, "Vou ___ Urca ver o Pão de Açúcar.", ["à", "a", "na"], "à",
   "A Urca lleva artículo (volto da Urca): vou à Urca.")
ch(1, "Choveu a tarde inteira; ___, o bloco saiu.", ["no entanto", "portanto", "inclusive"], "no entanto",
   "Contraste: no entanto (= sin embargo).")
cl(1, "___ (precisar) de guias bilíngues.", "Precisa-se",
   "Con preposición, singular: precisa-se de.", prompt="Completá el cartel con la pasiva con se.")
cl(1, "___ (disse + me) que não viria.", "Disse-me",
   "Escritura formal, verbo al inicio: ênclise.", prompt="Uní verbo y pronombre en registro formal.")
trv(1, "Prefiero el samba al funk.",
    "preferir X a Y.",
    "Prefiro ", ["samba a funk", "o samba ao funk"])
trv(1, "Todavía no leí Os Lusíadas.",
    "«Todavía» es *ainda*: *ainda não li*. *Os Lusíadas* (1572) es la epopeya de Camões.",
    ["Ainda não li", "Eu ainda não li"], " Os Lusíadas")
fx(1, "A Bia namora com um português de Coimbra.", "namora com", "namora",
   "A Bia namora um português de Coimbra.", "regencia",
   "namorar alguém, sin «com».")
fx(1, "Vou à Ipanema depois do trabalho.", "à Ipanema", "a Ipanema",
   "Vou a Ipanema depois do trabalho.", "crase",
   "Volto de Ipanema (sin artículo) → vou a Ipanema, sin crase.")
ty(1, "Escribí el conector formal de una palabra que empieza con «c» y significa «sin embargo».", "sin embargo → ___", "contudo",
   "«Sin embargo» tiene varias formas: *contudo*, *porém*, *todavia*, *no entanto*. *Contudo* es de registro escrito.")
