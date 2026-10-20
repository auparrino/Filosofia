# -*- coding: utf-8 -*-
"""Producción C1 para las semanas 43-46 (auditoría 2026-10, §4.1).

Los revisores marcaron que los ítems de la estación C1 eran casi todos de
reconocimiento o de transformación mecánica (A2-B1).  Acá van, por semana,
diez ítems de producción: traducciones de registro cuidado o periodístico
(10-20 palabras), reformulaciones (nominalización, pasiva, registro formal
frente al habla carioca) y errores típicos del hispanohablante (calcos,
régimen, crase, colocación pronominal brasileña, falsos amigos).

«part» es el índice de la parte de la lección (tools/pt/lessons/s4.py) que
el ítem ejercita.  Portugués de Brasil: *você*, próclise en el habla; las
formas de Portugal solo aparecen en el enunciado, nunca como respuesta.
"""
from itertools import product

TR = "Traducí al portugués."
TRF = "Traducí al portugués formal."
TRB = "Traducí al portugués de Brasil."
RF = "Reescribí la frase manteniendo el sentido: escribí solo lo que falta en el hueco."
FX = "Encontrá el error: tocá la palabra que está mal y corregila."
FXF = "Texto formal. Encontrá el error: tocá la palabra que está mal y corregila."

ITEMS = []
_N = {}


def _combo(*parts, sep=" "):
    """Todas las combinaciones de las piezas: las variantes igual de válidas."""
    return [sep.join(p for p in c if p) for c in product(*parts)]


def _add(w, part, typ, prompt, stem, answer, note, alt=None, **extra):
    _N[w] = _N.get(w, 0) + 1
    alt = [a for a in dict.fromkeys(alt or []) if a.rstrip(".?!") != answer.rstrip(".?!")]
    d = dict(id="pc1-%d-%02d" % (w, _N[w]), w=w, part=part, level="C1", type=typ,
             prompt=prompt, stem=stem, answer=answer, alt=alt, note=note)
    d.update(extra)
    ITEMS.append(d)


def tr(w, p, stem, answer, alt, note, prompt=TR):
    # «portugués formal»: el corrector marca como «casi» las formas del habla
    # (pra, tá, tem por há), como en «Encontrá el error» (app.js, itemRegister)
    extra = dict(registro="formal") if prompt == TRF else {}
    _add(w, p, "translate", prompt, stem, answer, note, alt, **extra)


def ty(w, p, stem, answer, note, alt=None, prompt=RF):
    _add(w, p, "typed", prompt, stem, answer, note, alt)


def fx(w, p, stem, bad, good, cat, note, goodAlt=None, prompt=FX):
    extra = dict(bad=bad, good=good, cat=cat)
    alt = []
    if goodAlt:
        extra["goodAlt"] = list(goodAlt)
        alt = [stem.replace(bad, g, 1) for g in goodAlt]
    _add(w, p, "fixerr", prompt, stem, stem.replace(bad, good, 1), note, alt, **extra)


# ===========================================================================
# Semana 43 — Correspondência formal
# parts: 0 abrir y cerrar · 1 tratamiento y fórmulas · 2 pedir, crase y
# tratamiento
# ===========================================================================
W = 43
tr(W, 1, "Según lo acordado en la reunión del martes, le envío el contrato firmado. (a una señora)",
   "Conforme combinado na reunião de terça-feira, envio à senhora o contrato assinado.",
   _combo(["Conforme combinado", "Conforme acordado", "Como combinado", "Conforme o combinado"],
          ["na reunião de terça-feira,", "na reunião de terça,"],
          ["envio à senhora o contrato assinado", "envio o contrato assinado à senhora",
           "envio-lhe o contrato assinado",
           "encaminho à senhora o contrato assinado", "encaminho-lhe o contrato assinado"]),
   "«Según lo acordado» es *conforme combinado* (o *conforme acordado*). *Enviar algo a alguém* "
   "con *a senhora* da *à senhora*, con crase; *envio-lhe* también vale.", prompt=TRF)
tr(W, 2, "Le agradecería que me informara si todavía hay vacantes en la maestría. (a un señor)",
   "Agradeceria se o senhor me informasse se ainda há vagas no mestrado.",
   _combo(["Agradeceria se o senhor", "Eu agradeceria se o senhor"],
          ["me informasse", "pudesse me informar", "pudesse informar-me"],
          ["se ainda há vagas", "se ainda existem vagas"],
          ["no mestrado", "para o mestrado"]),
   "«Le agradecería que» se arma con *agradeceria se* + imperfeito do subjuntivo: *se o senhor "
   "me informasse*. Y en lo escrito «hay» es *há*, no *tem*.", prompt=TRF)
tr(W, 0, "Estimados señores: les escribo para confirmar mi participación en el congreso de octubre.",
   "Prezados senhores, escrevo para confirmar minha participação no congresso de outubro.",
   _combo(["Prezados senhores,", "Prezados senhores:"],
          ["escrevo para confirmar", "escrevo-lhes para confirmar", "venho confirmar",
           "venho, por meio desta, confirmar", "escrevo a fim de confirmar"],
          ["minha participação", "a minha participação"],
          ["no congresso de outubro"]),
   "«Estimados señores» → *Prezados senhores*; en Brasil el saludo suele cerrarse con coma (los dos puntos también se ven). "
   "«Les escribo» puede ir sin pronombre: *escrevo para confirmar*.", prompt=TRF)
tr(W, 2, "Informamos a los candidatos que el plazo de inscripción vence el próximo viernes.",
   "Informamos aos candidatos que o prazo de inscrição termina na próxima sexta-feira.",
   _combo(["Informamos aos candidatos que", "Informamos os candidatos de que"],
          ["o prazo de inscrição", "o prazo das inscrições"],
          ["termina", "vence", "se encerra", "acaba"],
          ["na próxima sexta-feira", "na próxima sexta"]),
   "En la norma, *informar algo a alguém* (*informamos aos candidatos que…*) o *informar alguém "
   "de algo* (*informamos os candidatos de que…*). «El próximo viernes» lleva *na*: *na próxima sexta-feira*.",
   prompt=TRF)

ty(W, 2, "Manda o comprovante até amanhã, tá? (mensagem a um colega) → Solicito que V. Sa. ___ "
         "o comprovante até amanhã. (ofício)",
   "me envie",
   "*solicitar que* pide presente do subjuntivo, y *V. Sa.* va en 3.ª persona, como *você*: "
   "*envie*, nunca «envieis». El *manda* del chat sube a *envie* o *encaminhe*.",
   alt=["envie", "nos envie", "encaminhe", "me encaminhe", "nos encaminhe", "remeta", "me remeta"])
ty(W, 2, "Peço que a coordenação reconsidere a decisão. → Solicito à coordenação a ___ da decisão.",
   "reconsideração",
   "En el pedido formal el verbo pasa a sustantivo: *reconsiderar → a reconsideração* (-ção, "
   "femenino). Y fijate en *solicito à coordenação*: *solicitar algo a alguém* con *a coordenação* da *à*.")
ty(W, 1, "A gente vai analisar seu pedido em até dez dias. (fala) → Seu pedido ___ em até dez dias. "
         "(resposta formal)",
   "será analisado",
   "La pasiva saca al *a gente* y deja el pedido como sujeto: *será analisado* (futuro de *ser* + "
   "participio concordado). En una respuesta formal, *será* suena mejor que *vai ser*.",
   alt=["vai ser analisado", "será examinado"])

fx(W, 2, "Solicito à Vossa Senhoria o envio do certificado de conclusão.", "à", "a", "crase",
   "*Vossa Senhoria* no admite artículo, así que no hay *a + a*: *solicito a Vossa Senhoria*, sin "
   "crase. Con *a senhora*, sí: *solicito à senhora*.", prompt=FXF)
fx(W, 0, "Prezado senhor, lhe informo que sua matrícula foi aprovada.", "lhe informo", "informo-lhe",
   "colocacao",
   "La escritura formal no abre una oración con pronombre átono: *informo-lhe que…* (o *informo ao "
   "senhor que…*). Hablando, en Brasil *lhe informo* es normal; en un mail formal, no.",
   goodAlt=["informo ao senhor"], prompt=FXF)
fx(W, 1, "Venho, por meio desta, responder o seu e-mail do dia 3 de março.", "o seu", "ao seu",
   "regencia",
   "En la norma, *responder a* algo: *responder ao seu e-mail*. Hablando, en Brasil se oye "
   "*responder o e-mail*; en un texto formal, con *a*.", goodAlt=["a seu"], prompt=FXF)

# ===========================================================================
# Semana 44 — Formação de palavras
# parts: 0 sufijos que hacen sustantivos · 1 -eiro, -ada, prefijos ·
# 2 diminutivos y aumentativos · 3 formá la palabra (producir)
# ===========================================================================
W = 44
tr(W, 0, "La desigualdad y la violencia urbana son los grandes temas del debate electoral.",
   "A desigualdade e a violência urbana são os grandes temas do debate eleitoral.",
   ["A desigualdade e a violência urbana são os principais temas do debate eleitoral"],
   "«-dad» → *-dade* (*desigualdade*) y «-encia» → *-ência* (*violência*), los dos femeninos. "
   "«Electoral» es *eleitoral*, con *-ei-* como en *eleição*.")
tr(W, 0, "La aprobación de la ley generó mucha incertidumbre entre los comerciantes del Centro.",
   "A aprovação da lei gerou muita incerteza entre os comerciantes do Centro.",
   _combo(["A aprovação da lei"], ["gerou", "causou", "provocou", "trouxe"],
          ["muita incerteza", "grande incerteza"], ["entre os comerciantes do Centro"]),
   "*aprovar → a aprovação* (-ção) y *certo → a incerteza* (-eza): «incertidumbre» no tiene calco. "
   "*Lei* es femenino: *da lei*.")
tr(W, 3, "Es imprescindible que el nuevo sistema de transporte sea confiable y accesible.",
   "É imprescindível que o novo sistema de transporte seja confiável e acessível.",
   ["É imprescindível que o novo sistema de transportes seja confiável e acessível",
    "É indispensável que o novo sistema de transporte seja confiável e acessível"],
   "«-ble» → *-vel*, con tilde en la vocal anterior: *imprescindível*, *confiável*, *acessível* "
   "(con *ss*). Y *é imprescindível que* pide subjuntivo: *seja*.")
tr(W, 1, "El ex intendente prometió reabrir el mercado de pescadores antes del verano.",
   "O ex-prefeito prometeu reabrir o mercado de pescadores antes do verão.",
   ["O ex-prefeito prometeu reabrir o mercado dos pescadores antes do verão"],
   "*ex-* va siempre con guion (*ex-prefeito*) y *re-* se pega al verbo (*reabrir*). "
   "El intendente, en Brasil, es *o prefeito*.")

ty(W, 0, "Os moradores reclamaram porque a coleta de lixo atrasou. → Os moradores reclamaram do ___ "
         "da coleta de lixo.",
   "atraso",
   "*atrasar → o atraso*, sin sufijo, como *aumentar → o aumento*. La frase nominal ahorra el "
   "*porque*: *reclamaram do atraso da coleta*.")
ty(W, 0, "Os ônibus quase nunca são pontuais, e isso irrita os passageiros. → A falta de ___ "
         "dos ônibus irrita os passageiros.",
   "pontualidade",
   "*pontual → a pontualidade*: el adjetivo en *-al* toma *-idade*, como *legal → legalidade*. "
   "El abstracto en *-dade* es siempre femenino.")
ty(W, 3, "Ninguém consegue prever o resultado da eleição. → O resultado da eleição é ___.",
   "imprevisível",
   "*prever → previsível* («que se puede prever») y, con *im-*, el contrario: *imprevisível*. "
   "Los verbos en *-er* e *-ir* dan *-ível*.",
   alt=["totalmente imprevisível", "completamente imprevisível"])
ty(W, 2, "Aguarde um momento, por favor. (atendimento formal) → Peraí, ___! (papo carioca)",
   "só um minutinho",
   "En la charla el diminutivo suaviza el pedido: *só um minutinho*. No achica el tiempo, es "
   "cortesía. *Peraí* es *espera aí* dicho rápido.",
   alt=["só um instantinho", "só um segundinho", "só um pouquinho", "só um momentinho",
        "um minutinho", "um instantinho", "um segundinho"])

fx(W, 0, "A paisaje da baía de Paraty impressiona os turistas.", "paisaje", "paisagem", "espanol",
   "«-aje» → *-agem*, y la palabra pasa a femenino: *a paisagem*, como *a viagem* o *a mensagem*.")
fx(W, 3, "Segundo o ministro, um acordo com os caminhoneiros ainda é posible.", "posible", "possível",
   "espanol",
   "«-ble» → *-vel*: *possível* (con *ss* y tilde), *provável*, *responsável*. El plural es "
   "*possíveis*.")

# ===========================================================================
# Semana 45 — Falsos amigos e heterossemânticos
# parts: 0 clásicos, adjetivos y verbos · 1 mesa y trabajo · 2 género y
# acento
# ===========================================================================
W = 45
tr(W, 0, "El abogado impugnó la multa, y el juez terminó dándole la razón.",
   "O advogado contestou a multa, e o juiz acabou lhe dando razão.",
   _combo(["O advogado contestou a multa,", "O advogado recorreu da multa,"],
          ["e o juiz"], ["acabou", "terminou"],
          ["lhe dando razão", "dando razão a ele", "dando-lhe razão", "lhe dando a razão",
           "dando a razão a ele", "por lhe dar razão"]),
   "*contestar* es «impugnar, cuestionar», no «responder». «Darle la razón» es *dar razão a "
   "alguém*: en Brasil, *acabou lhe dando razão* o *dando razão a ele*.")
tr(W, 0, "El cantante, pelirrojo y muy gracioso, fue la gran atracción del festival.",
   "O cantor, ruivo e muito engraçado, foi a grande atração do festival.",
   ["O cantor, ruivo e muito engraçado, foi a principal atração do festival"],
   "*ruivo* es pelirrojo (*roxo* sería violeta) y *engraçado*, gracioso, que hace reír. "
   "*Atração* lleva una sola *c*: «-cción» → *-ção*.")
tr(W, 1, "En la cena, el mozo trajo las copas pero se olvidó de las tazas para el café.",
   "No jantar, o garçom trouxe as taças, mas esqueceu as xícaras para o café.",
   _combo(["No jantar, o garçom trouxe as taças, mas"],
          ["esqueceu as xícaras", "se esqueceu das xícaras", "esqueceu-se das xícaras",
           "esqueceu das xícaras"],
          ["para o café", "de café", "para café"]),
   "*cena → jantar* (*a cena* es la escena), *copa → taça* y *taza → xícara*. *Esquecer* va "
   "directo (*esqueceu as xícaras*) o con *se* y *de* (*se esqueceu das xícaras*).")
tr(W, 2, "El origen del puente es un misterio, y el análisis de los documentos no ayudó.",
   "A origem da ponte é um mistério, e a análise dos documentos não ajudou.",
   [],
   "Tres cambios de género: *a origem*, *a ponte* y *a análise* son femeninos en portugués. "
   "Por eso *da ponte*, nunca «do ponte».")

ty(W, 0, "Despertei às seis com o barulho da obra. (literário) → ___ com o barulho da obra. "
         "(fala do dia a dia)",
   "Acordei às seis",
   "En Brasil, «despertarse» es *acordar*: *acordei às seis*. «Acordarse de algo» es *lembrar-se*. "
   "*Despertar* existe, pero suena a libro.",
   alt=["Eu acordei às seis"])
ty(W, 1, "O carro quebrou e eu tive que deixá-lo no mecânico. → O carro quebrou e eu tive que "
         "deixá-lo ___.",
   "na oficina",
   "*a oficina* es el taller mecánico; la oficina donde se trabaja es *o escritório*. Por eso "
   "*deixá-lo na oficina*.",
   alt=["na oficina mecânica"])
ty(W, 2, "Viajamos de Salvador a Recife sem nenhum problema. → ___ foi tranquila.",
   "A viagem de Salvador a Recife",
   "*viajar → a viagem*: «-aje» → *-agem*, y en femenino. Por eso concuerda el adjetivo: *a "
   "viagem foi tranquila*.",
   alt=["A nossa viagem de Salvador a Recife", "Nossa viagem de Salvador a Recife",
        "A viagem de Salvador para Recife", "A viagem de Salvador até Recife"])

fx(W, 0, "A minha prima está embaraçada de três meses.", "embaraçada", "grávida", "falso_amigo",
   "«Embarazada» es *grávida*; *embaraçada* es avergonzada o en aprietos. Se dice *está grávida "
   "de três meses*.")
fx(W, 0, "Liguei três vezes para o escritório, mas ninguém contestou.", "contestou", "atendeu",
   "falso_amigo",
   "El teléfono se *atende*: *ninguém atendeu*. *Contestar* es impugnar o cuestionar: *contestou a "
   "multa*.")
fx(W, 2, "O árvore centenário da praça caiu com o temporal.", "O árvore centenário",
   "A árvore centenária", "genero",
   "*árvore* es femenino en portugués: *a árvore centenária*. Con el sustantivo cambian el "
   "artículo y el adjetivo.")

# ===========================================================================
# Semana 46 — Variação: Brasil, Portugal e África
# parts: 0 Brasil y Portugal · 1 sonidos y regiones · 2 África y ortografía
# ===========================================================================
W = 46
tr(W, 0, "¿Me prestás tu celular? El mío se quedó sin batería en el colectivo.",
   "Você me empresta seu celular? O meu ficou sem bateria no ônibus.",
   _combo(["Você me empresta seu celular?", "Você me empresta o seu celular?",
           "Me empresta seu celular?", "Me empresta o seu celular?", "Me empresta teu celular?",
           "Me empresta o teu celular?", "Pode me emprestar seu celular?",
           "Pode me emprestar o seu celular?", "Você pode me emprestar seu celular?",
           "Você pode me emprestar o seu celular?"],
          ["O meu ficou sem bateria no ônibus", "O meu descarregou no ônibus"]),
   "En Brasil, pronombre delante (*me empresta*), *você* y *celular*, *ônibus*. En Portugal sería "
   "*emprestas-me o teu telemóvel?* y *autocarro*.", prompt=TRB)
tr(W, 0, "Los usuarios del tren se quejan de los atrasos y del precio del boleto.",
   "Os usuários do trem reclamam dos atrasos e do preço da passagem.",
   _combo(["Os usuários do trem", "Os passageiros do trem"],
          ["reclamam", "se queixam", "queixam-se"],
          ["dos atrasos e do preço da passagem"]),
   "En Brasil, *trem* (no *comboio*), *usuário* (no *utente*) y *passagem* para el boleto. "
   "«Quejarse de» es *reclamar de* o *queixar-se de*.", prompt=TRB)
tr(W, 1, "En Portugal las vocales átonas casi desaparecen; por eso cuesta entender a los lisboetas.",
   "Em Portugal as vogais átonas quase desaparecem; por isso é difícil entender os lisboetas.",
   _combo(["Em Portugal as vogais átonas quase desaparecem; por isso",
           "Em Portugal as vogais átonas quase desaparecem, e por isso",
           "Em Portugal as vogais átonas quase somem; por isso"],
          ["é difícil entender", "fica difícil entender", "custa entender", "é difícil compreender"],
          ["os lisboetas"]),
   "«Cuesta» → *é difícil* o *custa*; *entender* lleva objeto directo, sin «a» personal: *entender "
   "os lisboetas*. En Brasil, en cambio, las átonas se debilitan pero se oyen.")
tr(W, 2, "Angola y Mozambique siguen la norma de Portugal, aunque firmaron el Acuerdo de 1990.",
   "Angola e Moçambique seguem a norma de Portugal, embora tenham assinado o Acordo de 1990.",
   _combo(["Angola e Moçambique seguem"],
          ["a norma de Portugal,", "a norma portuguesa,", "a norma europeia,"],
          ["embora tenham assinado", "apesar de terem assinado", "mesmo tendo assinado"],
          ["o Acordo de 1990", "o Acordo Ortográfico de 1990"]),
   "«Aunque» con un hecho cumplido: *embora* + subjuntivo (*tenham assinado*) o *apesar de* + "
   "infinitivo (*terem assinado*). *Moçambique*, con ç.")

ty(W, 0, "Diz-me o que achaste do filme. (Portugal) → ___ o que você achou do filme. (Brasil, fala)",
   "Me diz",
   "En el habla de Brasil el pronombre va delante, aun al empezar la frase: *me diz*; y con "
   "*você*, *achou*. *Diz-me* y *achaste* son de Portugal.",
   alt=["Me fala", "Me conta", "Fala pra mim", "Diz pra mim", "Fala para mim", "Diz para mim"])
ty(W, 0, "Ligaram-te do banco? (Portugal) → ___ do banco? (Brasil, fala)",
   "Te ligaram",
   "Brasil pone el pronombre delante también al empezar la frase: *te ligaram*. Sin pronombre "
   "átono, *ligaram para você*.",
   alt=["Ligaram para você", "Ligaram pra você"])
ty(W, 2, "O facto é que o registo do contacto se perdeu. (grafia de Portugal) → ___ se perdeu. "
         "(grafia do Brasil)",
   "O fato é que o registro do contato",
   "Tres diferencias de grafía: *facto → fato*, *registo → registro*, *contacto → contato*. En "
   "Portugal la *c* de *facto* se pronuncia; en Brasil no se pronuncia ni se escribe.")

fx(W, 0, "Em Botafogo, esperei o autocarro por meia hora debaixo de chuva.", "autocarro", "ônibus",
   "lexico",
   "En Brasil es *ônibus*; *autocarro* es la palabra de Portugal. También cambia el verbo de "
   "tomarlo: *pegar* en Brasil, *apanhar* en Portugal.")
fx(W, 2, "É freqüente ouvir sotaques do Nordeste nas ruas do Rio.", "freqüente", "frequente",
   "ortografia",
   "Desde el Acuerdo de 1990 el trema desapareció: *frequente*, *linguiça*, *tranquilo*. La *u* "
   "se sigue pronunciando.")
fx(W, 1, "Se diz que o chiado carioca veio com a corte portuguesa em 1808.", "Se diz", "Diz-se",
   "colocacao",
   "La escritura formal no empieza con pronombre átono: *diz-se que*. Hablando, en Brasil *se "
   "diz* al principio es normal. Y ojo: es una hipótesis discutida, no un hecho.",
   goodAlt=["Dizem"], prompt=FXF)
