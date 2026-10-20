# -*- coding: utf-8 -*-
"""Producción C1 para las semanas 47-50 (auditoría 2026-10, §4.1).

Los revisores marcaron que casi todo lo de estas semanas era reconocimiento
de nivel A2-B1 con etiqueta C1.  Acá van ítems de producción: traducción
del español al portugués de Brasil en registro cuidado, periodístico o
coloquial según la semana (10-20 palabras), reformulación con la estructura
de la semana (escribir solo el hueco) y «encontrá el error» con calcos del
español.  «part» es el índice de la parte de la lección (tools/pt/lessons/
s4.py) que el ítem ejercita.

Portugués de Brasil: próclise en el habla, *você*; las formas europeas
nunca son la única respuesta aceptada.  En las traducciones, `alt` lleva
todas las variantes que un nativo aceptaría (se arman con _x: cada lista
es un lugar con sus opciones).
"""
import itertools

TR = "Traducí al portugués."
TRF = "Traducí al portugués formal."
TRC = "Traducí al portugués coloquial de Brasil."
RF = "Reescribí la frase manteniendo el sentido: escribí solo lo que falta en el hueco."
FX = "Encontrá el error: tocá la palabra que está mal y corregila."
FXF = "Texto formal. Encontrá el error: tocá la palabra que está mal y corregila."
RFR = "Completá el refrán."

ITEMS = []
_N = {}


def _x(*parts):
    """Todas las combinaciones: cada parte es un texto fijo o una lista de
    opciones.  La primera combinación es la respuesta."""
    slots = [p if isinstance(p, list) else [p] for p in parts]
    out = []
    for combo in itertools.product(*slots):
        s = "".join(combo)
        if s not in out:
            out.append(s)
    return out


def _add(w, part, typ, prompt, stem, answer, note, alt=None, **extra):
    _N[w] = _N.get(w, 0) + 1
    d = dict(id="pc1-%d-%02d" % (w, _N[w]), w=w, part=part, level="C1", type=typ,
             prompt=prompt, stem=stem, answer=answer,
             alt=[a for a in (alt or []) if a != answer], note=note)
    d.update(extra)
    ITEMS.append(d)


def tr(w, p, stem, variants, note, prompt=TR):
    _add(w, p, "translate", prompt, stem, variants[0], note, variants[1:])


def ty(w, p, stem, answer, note, alt=None, prompt=RF):
    _add(w, p, "typed", prompt, stem, answer, note, alt)


def fx(w, p, stem, bad, good, cat, note, goodAlt=None, prompt=FX):
    assert stem.count(bad) == 1, (stem, bad)
    extra = dict(bad=bad, good=good, cat=cat)
    if goodAlt:
        extra["goodAlt"] = list(goodAlt)
    _add(w, p, "fixerr", prompt, stem, stem.replace(bad, good, 1), note,
         [stem.replace(bad, g, 1) for g in goodAlt or []], **extra)


# ===========================================================================
# Semana 47 — Argumentação e modalização
# parts: 0 afirmar con matices · 1 conceder y contraargumentar · 2 ordenar y
# concluir
# ===========================================================================
W = 47
tr(W, 0, "Todo indica que la reforma tributaria va a ser aprobada antes de las elecciones.",
   _x(["Tudo indica que", "Ao que tudo indica,"], " a reforma tributária ",
      ["vai ser aprovada", "será aprovada"], " antes das eleições."),
   "*Tudo indica que* presenta algo como probable y va con indicativo (*vai ser*, *será*), "
   "como en español. Ojo: *antes de + as eleições* se contrae en *antes das*.", prompt=TRF)
tr(W, 0, "No creo que el gobierno tenga recursos suficientes para cumplir todas sus promesas.",
   _x(["Não acredito", "Não creio", "Não acho", "Eu não acredito", "Eu não creio", "Eu não acho"],
      " que o governo tenha recursos suficientes para cumprir ",
      ["todas as suas promessas", "todas as promessas", "todas suas promessas"], "."),
   "Opinión negada (*não acredito que*, *não creio que*): subjuntivo, *tenha*. Afirmada iría "
   "con indicativo: *acredito que o governo tem*.", prompt=TRF)
tr(W, 1, "Aunque la economía haya crecido, la desigualdad sigue siendo uno de los mayores problemas del país.",
   _x(["Embora a economia tenha crescido", "Ainda que a economia tenha crescido",
       "Mesmo que a economia tenha crescido", "Apesar de a economia ter crescido"],
      ", a desigualdade ", ["continua sendo", "continua a ser", "segue sendo", "ainda é"],
      " um dos maiores problemas do país."),
   "Concesiva con subjuntivo compuesto: *embora tenha crescido*. Con *apesar de*, infinitivo: "
   "*apesar de a economia ter crescido* (sin contraer *de a*, porque *a economia* es sujeto).", prompt=TRF)
tr(W, 1, "No se puede negar que el metro mejoró; sin embargo, sigue siendo caro para los trabajadores.",
   _x(["Não se pode negar que", "É inegável que"], " o metrô melhorou; ",
      ["no entanto", "contudo", "entretanto", "porém", "todavia"], ", ",
      ["continua sendo", "continua", "ainda é", "segue sendo"], " caro para os trabalhadores."),
   "Contraargumentar: primero concedés (*não se pode negar que*) y después rebatís con *no entanto*, "
   "*contudo* o *porém*. «Sin embargo» no se calca: *sem embargo* es arcaico.", prompt=TRF)
ty(W, 0, "Parece que o prefeito desistiu da reeleição. → Pode ser que o prefeito ___ da reeleição.",
   "tenha desistido",
   "*Pode ser que* pide subjuntivo; como el hecho ya pasó, va el perfeito do subjuntivo: "
   "*tenha desistido* (que haya desistido).")
ty(W, 1, "Os moradores protestaram muito; mesmo assim, a obra continuou. → Por mais que os moradores ___, a obra continuou.",
   "protestassem",
   "*Por mais que* va siempre con subjuntivo; con la principal en pasado, imperfeito: "
   "*protestassem*. *Tenham protestado* también vale.",
   alt=["tenham protestado"])
ty(W, 2, "A orla ficou mais segura, mas o comércio local perdeu clientes. → A orla ficou mais segura; ___ perdeu clientes.",
   "em contrapartida, o comércio local",
   "Para contrastar dos efectos de una misma medida: *em contrapartida* (en cambio). "
   "También sirven *por outro lado*, *no entanto* o *contudo*.",
   alt=[c + ", o comércio local" for c in ("por outro lado", "no entanto", "contudo", "entretanto", "porém", "todavia")]
   + ["o comércio local, em contrapartida,", "o comércio local, por outro lado,", "o comércio local, no entanto,",
      "o comércio local, contudo,", "o comércio local, porém,"])
fx(W, 0, "Desde meu ponto de vista, o projeto ignora os moradores da Maré.", "Desde meu", "Do meu",
   "espanol",
   "«Desde mi punto de vista» es un calco: en portugués la perspectiva va con *de*: "
   "*do meu ponto de vista* (o *sob o meu ponto de vista*).",
   goodAlt=["Sob o meu", "Sob meu"])
fx(W, 1, "De todas formas, a decisão final cabe ao Congresso.", "De todas formas", "De qualquer forma",
   "espanol",
   "«De todas formas» se calca del español; en portugués: *de qualquer forma*, *de qualquer "
   "modo* o *de todo modo*.",
   goodAlt=["De qualquer modo", "De todo modo", "De qualquer maneira", "De toda forma"])
fx(W, 2, "Por lo tanto, a proposta deve ser rejeitada pelo plenário.", "Por lo tanto", "Portanto",
   "espanol",
   "«Por lo tanto» es español (*lo* no existe en portugués): *portanto*, en una palabra. "
   "También sirven *por isso*, *logo* o *assim*.",
   goodAlt=["Por isso", "Logo", "Assim", "Dessa forma"])

# ===========================================================================
# Semana 48 — Resumo e reformulação
# parts: 0 verbos para citar · 1 atribuir y reformular · 2 el resumo y la
# prensa
# ===========================================================================
W = 48
tr(W, 0, "El informe señala que la contaminación de la bahía disminuyó, pero no lo suficiente.",
   _x("O relatório ", ["aponta", "assinala", "indica", "mostra"], " que a poluição da baía ",
      ["diminuiu", "caiu"], ", mas não ", ["o suficiente", "o bastante"], "."),
   "«Señalar» es *apontar* o *assinalar* (no «sinalar»). Y «no lo suficiente» lleva artículo "
   "masculino: *não o suficiente*.", prompt=TRF)
tr(W, 0, "El ministro discrepa de los economistas y llama la atención sobre el riesgo fiscal.",
   _x("O ministro ", ["discorda", "diverge"], " dos economistas e ",
      ["chama a atenção para", "alerta para", "chama atenção para"], " o risco fiscal."),
   "Dos regencias distintas del español: *discordar de* (no «com») y *chamar a atenção para* "
   "(no «sobre»).", prompt=TRF)
tr(W, 1, "Según los especialistas, el proyecto es inviable; en otras palabras, no va a salir del papel.",
   _x(["Segundo os especialistas", "De acordo com os especialistas", "Para os especialistas",
       "Conforme os especialistas"], ", o projeto é inviável; ",
      ["em outras palavras", "ou seja", "isto é", "quer dizer"], ", ",
      ["não vai sair do papel", "não sairá do papel"], "."),
   "Atribuís la fuente con *segundo* o *de acordo com* y reformulás con *em outras palavras* "
   "u *ou seja*. *Sair do papel* es concretarse, igual que en español.", prompt=TRF)
tr(W, 2, "Según la policía, el empresario habría escondido el dinero en una cuenta en el exterior.",
   _x(["Segundo a polícia", "De acordo com a polícia", "Conforme a polícia"],
      ", o empresário teria escondido o dinheiro ", ["numa conta", "em uma conta"], " ",
      ["no exterior", "fora do país"], "."),
   "Condicional del rumor: la prensa no confirma, así que usa *teria escondido* (habría "
   "escondido). Si la policía lo probara, pasaría a *escondeu*.", prompt=TRF)
ty(W, 0, "O diretor disse que a culpa era do governo, mas ninguém acreditou nele. → O diretor ___ a culpa era do governo.",
   "alegou que",
   "*Alegar* cita una justificación y deja ver que quien informa no la cree del todo; "
   "*afirmar* o *declarar* serían neutros y perderían ese matiz.")
ty(W, 2, "Neste texto, eu vou falar sobre o lixo nas praias. → (resumo) O texto ___ do lixo nas praias.",
   "aborda o problema",
   "El resumo va en presente y en tercera persona, con un verbo preciso: *aborda*, "
   "*discute*, *analisa*. Con *trata* hace falta *de*: *trata do problema*.",
   alt=["discute o problema", "analisa o problema", "examina o problema", "trata do problema", "trata",
        "aborda a questão", "discute a questão", "analisa a questão", "trata da questão",
        "discorre sobre o problema"])
ty(W, 2, "Testemunhas afirmam que o motorista avançou o sinal, mas a polícia não confirmou. → Segundo testemunhas, o motorista ___ o sinal.",
   "teria avançado",
   "Lo que nadie confirmó va en futuro do pretérito compuesto: *teria avançado* (habría "
   "pasado el semáforo en rojo). Con *avançou*, el diario lo daría por cierto.",
   alt=["teria furado"])
fx(W, 0, "No artigo, a autora subraia a importância do saneamento básico.", "subraia", "sublinha",
   "espanol",
   "«Subrayar» no existe en portugués: *sublinhar*. Para destacar una idea también sirven "
   "*ressaltar*, *salientar* y *enfatizar*.",
   goodAlt=["ressalta", "destaca", "salienta", "enfatiza"])
fx(W, 0, "Na entrevista, o ministro remarcou que não haverá cortes na educação.", "remarcou", "frisou",
   "falso_amigo",
   "Falso amigo: en Brasil *remarcar* es volver a marcar: cambiar la fecha de una cita "
   "(*remarcar a consulta*) o el precio de algo. «Remarcar» una idea es *frisar*, *ressaltar* o *enfatizar*.",
   goodAlt=["ressaltou", "enfatizou", "reforçou", "destacou", "sublinhou", "salientou", "reiterou"])
fx(W, 2, "Respeito ao orçamento, a autora não apresenta dados concretos.", "Respeito ao", "Quanto ao",
   "espanol",
   "«Respecto a» se calca mal: en un resumo se dice *quanto ao*, *em relação ao* o *no que diz "
   "respeito ao* orçamento.",
   goodAlt=["Em relação ao", "Com relação ao", "No que diz respeito ao", "No que se refere ao",
            "A respeito do", "Sobre o"])

# ===========================================================================
# Semana 49 — Registro culto e coloquial
# parts: 0 la gramática que cambia · 1 reducciones y pronombres formales ·
# 2 vocabulario y el camino de vuelta
# ===========================================================================
W = 49
tr(W, 0, "Ayer hubo una reunión con los vecinos y los escuchamos durante dos horas.",
   _x(["Ontem houve uma reunião", "Houve ontem uma reunião"], " com os ",
      ["moradores", "vizinhos"], [", e ", " e "],
      ["nós os ouvimos", "os ouvimos", "nós os escutamos", "os escutamos"], " ",
      ["durante duas horas", "por duas horas"], "."),
   "En lo formal, el «hubo» es *houve* (no *teve*) y el objeto es *os* antes del verbo "
   "(*nós os ouvimos*), no *ouvimos eles* como en la charla.", prompt=TRF)
tr(W, 0, "Encontramos al director en el seminario y lo invitamos a dar una charla.",
   _x(["Encontramos o diretor", "Nós encontramos o diretor"], " no seminário e ",
      ["o convidamos", "convidamo-lo"], " ", ["para dar", "a dar", "para fazer"], " uma palestra."),
   "Dos trampas: sin «a» personal (*encontramos o diretor*) y el objeto formal *o*, no *ele*: "
   "*o convidamos*. Ojo: tras -s la forma enclítica es *convidamo-lo*.", prompt=TRF)
tr(W, 1, "Le agradezco su respuesta y le enviaré los documentos el lunes.",
   _x(["Agradeço a sua resposta", "Agradeço sua resposta", "Agradeço-lhe a resposta",
       "Agradeço pela sua resposta", "Agradeço pela resposta"], " e ",
      ["lhe enviarei", "enviarei", "enviar-lhe-ei"], " os documentos ",
      ["na segunda-feira", "na segunda"], "."),
   "En el mail formal, el «le» de cortesía es *lhe* (nunca «le»). Después de *e*, la próclise "
   "*lhe enviarei* es lo normal en Brasil; la mesóclise *enviar-lhe-ei* es más rebuscada.", prompt=TRF)
tr(W, 2, "¿Viste a Pedro? Me dijo que mañana hay asado en su casa.",
   _x(["Você viu o Pedro? ", "Viu o Pedro? "], ["Ele me disse", "Me disse", "Ele me falou", "Me falou"],
      " que ", ["amanhã tem churrasco na casa dele", "tem churrasco na casa dele amanhã",
                "amanhã vai ter churrasco na casa dele", "vai ter churrasco na casa dele amanhã"], "."),
   "En la charla: *me disse* con el pronombre adelante, *tem* (o *vai ter*) por «hay» y "
   "*na casa dele* (más claro que *na sua casa*, que sonaría a la casa de quien escucha).", prompt=TRC)
ty(W, 0, "A gente vai ajudar eles no que for preciso. → (formal) ___ no que for preciso.",
   "Nós vamos ajudá-los",
   "Dos cambios de registro: *a gente vai* pasa a *nós vamos* y *ajudar eles* a *ajudá-los* "
   "(la -r cae y la vocal lleva tilde). También vale *nós os ajudaremos*.",
   alt=["Vamos ajudá-los", "Nós os ajudaremos", "Nós iremos ajudá-los",
        "Iremos ajudá-los", "Nós os vamos ajudar", "Ajudá-los-emos"])
ty(W, 1, "Cadê os documentos que eu te pedi? → (formal) Onde estão os documentos que ___?",
   "lhe pedi",
   "*Cadê* pasa a *onde estão* y el *te* de la charla, al tratar de *o senhor*, a *lhe*: "
   "*que lhe pedi* (el *que* atrae el pronombre). También: *lhe solicitei*.",
   alt=["eu lhe pedi", "lhe solicitei", "eu lhe solicitei", "pedi ao senhor", "solicitei ao senhor",
        "eu pedi ao senhor", "eu solicitei ao senhor"])
ty(W, 2, "Rolou uma grana extra e a gente curtiu muito a viagem. → (formal) Surgiram recursos extras, e nós ___ muito a viagem.",
   "aproveitamos",
   "*Curtir* es del habla; en un texto formal, *aproveitar* o *apreciar*. Con *gostar* "
   "haría falta *de*: *gostamos muito da viagem*.",
   alt=["apreciamos", "desfrutamos"])
fx(W, 0, "Vi a ele na reunião, mas ele não quis falar com a imprensa.", "Vi a ele", "Eu o vi",
   "pronome",
   "Calco de «lo vi a él»: el objeto de persona no lleva preposición. En lo formal, *eu o vi* "
   "(o *vi-o*); en la charla, *vi ele*, que en un texto formal desentona.",
   goodAlt=["Vi-o"], prompt=FXF)
fx(W, 1, "O senhor pediu o relatório, e eu já se o enviei por e-mail.", "se o", "o",
   "pronome",
   "«Se lo envié» no se calca: el *se* del español no existe acá. Queda *eu já o enviei* "
   "o, si nombrás a quien lo recibe, *eu já lhe enviei* o *já o enviei ao senhor*.",
   goodAlt=["lhe"], prompt=FXF)
fx(W, 1, "Senhor diretor, le informo que a reunião foi adiada para sexta-feira.", "le informo", "informo-lhe",
   "pronome",
   "*Le* es español; el pronombre formal es *lhe*. Y en un texto formal la oración no empieza "
   "con él: *informo-lhe que* (o *informo ao senhor que*).",
   goodAlt=["eu lhe informo", "informo ao senhor"], prompt=FXF)

# ===========================================================================
# Semana 50 — Colocações e expressões idiomáticas
# parts: 0 verbos que van juntos · 1 expresiones del día a día · 2 refranes y
# colocaciones formales
# ===========================================================================
W = 50
tr(W, 0, "Mi abuela insiste en cocinar para toda la familia cuando cumple años.",
   _x(["Minha avó", "A minha avó"], [" faz questão de", " insiste em"], " cozinhar para ",
      ["a família toda", "toda a família", "a família inteira"], " quando ", ["faz aniversário", "faz anos"], "."),
   "*Insiste em cozinhar* es correcto, pero para quien se empeña en hacer algo por gusto lo más "
   "idiomático es *faz questão de*. Y «cumplir años» es *fazer aniversário* o *fazer anos* (nunca «cumprir»).")
tr(W, 0, "La prensa desempeñó un papel decisivo en la caída del presidente.",
   _x("A imprensa ", ["desempenhou", "teve", "exerceu", "cumpriu"], " um papel decisivo na queda do presidente."),
   "Colocación: *desempenhar um papel* (no «jogar um papel», calco de «jugar un papel»). "
   "Y «caída» es *queda* (*cair*, *queda*).", prompt=TRF)
tr(W, 1, "Olvidate: la intendencia no va a arreglar esa calle este año.",
   _x(["Pode tirar o cavalo da chuva", "Tira o cavalo da chuva", "Pode esquecer", "Esquece"],
      ": a prefeitura não vai ", ["consertar", "arrumar"], " essa rua ",
      ["este ano", "esse ano", "neste ano"], "."),
   "*Tirar o cavalo da chuva* es desistir de esperar algo: el «olvidate» del español. "
   "«Intendencia» es *prefeitura*.", prompt=TRC)
tr(W, 2, "Es hora de poner en práctica lo que se aprendió y de sacar provecho de la experiencia.",
   _x(["É hora de", "Está na hora de"], " ",
      ["pôr em prática o que se aprendeu", "colocar em prática o que se aprendeu",
       "pôr em prática o que foi aprendido", "colocar em prática o que foi aprendido"],
      " e ", ["de tirar", "tirar"], " proveito da experiência."),
   "Colocaciones formales: *pôr em prática* y *tirar proveito de* (no «sacar proveito»: en "
   "Brasil *sacar* es entender o retirar dinero).", prompt=TRF)
ty(W, 0, "Achei que o projeto ia fracassar, mas funcionou. → Achei que o projeto ia dar errado, mas ___.",
   "deu certo",
   "*Dar certo* y *dar errado* son «salir bien» y «salir mal»: el verbo es *dar*, no *sair*.")
ty(W, 1, "O vizinho reclama de tudo e vive enchendo o saco. → (formal) O vizinho reclama de tudo e vive ___ os moradores.",
   "incomodando",
   "*Encher o saco* es vulgar leve: entre amigos pasa, en una queja formal no. Ahí va "
   "*incomodar*, *perturbar* o *importunar*.",
   alt=["perturbando", "importunando", "aborrecendo", "irritando"])
ty(W, 2, "Não adianta reclamar do presente que você ganhou: ___.",
   "a cavalo dado não se olham os dentes",
   "Igual que el refrán español, con otra sintaxis: *a cavalo dado não se olham os dentes*. "
   "En la charla se oye sin *a* y con *olha* en singular.",
   alt=["cavalo dado não se olham os dentes", "a cavalo dado não se olha os dentes",
        "cavalo dado não se olha os dentes", "a cavalo dado não se olha o dente",
        "cavalo dado não se olha o dente"],
   prompt=RFR)
fx(W, 0, "No casamento, o fotógrafo sacou mais de mil fotos dos convidados.", "sacou", "tirou",
   "espanol",
   "Las fotos se *tiram* (o se *batem*): *tirou mil fotos*. En Brasil *sacar* es entender "
   "algo o retirar plata del banco.",
   goodAlt=["bateu", "fez"])
fx(W, 0, "Ela se leva muito bem com os colegas de trabalho.", "se leva", "se dá",
   "espanol",
   "«Llevarse bien con alguien» es *dar-se bem com*: *ela se dá bem com os colegas*. "
   "*Levar-se* no tiene ese sentido.")
fx(W, 2, "O relatório faz hincapié na falta de verbas para a saúde.", "faz hincapié na", "enfatiza a",
   "espanol",
   "«Hacer hincapié» no existe en portugués: *enfatizar*, *ressaltar* o *dar ênfase a*. "
   "Ojo con la crase: *dá ênfase à falta*.",
   goodAlt=["ressalta a", "destaca a", "dá ênfase à", "sublinha a"])
