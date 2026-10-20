# -*- coding: utf-8 -*-
"""Esame finale C1 (settimana 52), parte scritta: modellato su CILS TRE-C1,
CELI 4 e PLIDA C1, senza la prova orale.

Quattro prove, distinte dal campo `prova`:
  - "strutture": cloze su due testi coerenti (Testo 1: società, Testo 2:
    narrativo) e trasformazioni di frase (esplicita/implicita, passiva,
    discorso indiretto, si impersonale, causativo, nominalizzazione).
  - "lessico": formazione di parole (suffissi, prefissi) e registro
    (formale/informale).

Tutti gli item hanno w=52, level="C1", topic="esame".  I cloze portano un
campo `text` con l'etichetta del testo, così l'app può raggrupparli.
La parte di ascolto, lettura, ricostruzione e scrittura è in
docs/lang/it/esame_data.js.

Tre versioni dell'esame (A, B, C): ogni item porta `ver`.  A: Testo 1 +
trasformazioni 1-10, formazione 1-11, registro 1-7; B: Testo 2 + tr 11-19,
fp 12-22, rg 8-14; C: Testo 3 + tr 20-28, fp 23-32, rg 15-20.  Nessun item
entra nell'allenamento della settimana 52 (build_course.py li tiene fuori):
si vedono solo nell'esame.
"""

W = 52
LV = "C1"
T = "esame"

T1 = "Testo 1: Il lavoro da remoto"
T2 = "Testo 2: Il ritorno al paese"
T3 = "Testo 3: Una città in bicicletta"

P_CLOZE = "Completá con una sola palabra o con la forma pedida del verbo entre paréntesis."
P_FORM = "Formá la palabra pedida a partir de la que está en la base."
P_TRAS = "Reescribí la frase manteniendo el sentido: escribí solo lo que falta en el hueco."
P_REG = "Elegí el equivalente en el registro pedido."


def _ver(n, a, b):
    """Version of item n: 1..a → A, a+1..b → B, the rest → C."""
    return "A" if n <= a else "B" if n <= b else "C"


def cz(n, text, stem, answer, note, alt=None):
    d = dict(id="ex-cl-%02d" % n, type="cloze", topic=T, level=LV, w=W, prova="strutture",
             ver={T1: "A", T2: "B", T3: "C"}[text],
             text=text, prompt=P_CLOZE, stem=stem, answer=answer, note=note)
    if alt:
        d["alt"] = alt
    return d


def fp(n, stem, answer, note, alt=None):
    d = dict(id="ex-fp-%02d" % n, type="cloze", topic=T, level=LV, w=W, prova="lessico", ver=_ver(n, 11, 22),
             prompt=P_FORM, stem=stem, answer=answer, note=note)
    if alt:
        d["alt"] = alt
    return d


def tr(n, stem, answer, note, alt=None):
    d = dict(id="ex-tr-%02d" % n, type="typed", topic=T, level=LV, w=W, prova="strutture", ver=_ver(n, 10, 19),
             prompt=P_TRAS, stem=stem, answer=answer, note=note)
    if alt:
        d["alt"] = alt
    return d


def rg(n, stem, options, answer, note):
    return dict(id="ex-rg-%02d" % n, type="choice", topic=T, level=LV, w=W, prova="lessico", ver=_ver(n, 7, 14),
                prompt=P_REG, stem=stem, options=options, answer=answer, note=note)


ITEMS = [
    # ------------------------------------------------------------------
    # Cloze, Testo 1: Il lavoro da remoto (società)
    # ------------------------------------------------------------------
    cz(1, T1, "Negli ultimi anni il lavoro da remoto si è diffuso ___ Italia più rapidamente di quanto molti avessero previsto.",
       "in", "Con los nombres de país en singular se usa «in» sin artículo: in Italia, in Francia, in Argentina."),
    cz(2, T1, "Secondo alcune stime, quasi un lavoratore ___ cinque svolge oggi almeno parte delle proprie mansioni da casa.",
       "su", "Proporción: «uno su cinque» = uno de cada cinco. También «uno ogni cinque». Error típico: ✗uno di cinque.",
       alt=["ogni"]),
    cz(3, T1, "Si tratta di un cambiamento ___ conseguenze non sono ancora del tutto chiare.",
       "le cui", "«Cui» posesivo: artículo + cui + sustantivo. El artículo concuerda con lo poseído (le conseguenze), no con el poseedor.",
       alt=["Le cui"]),
    cz(4, T1, "Molte aziende, ___ inizialmente erano scettiche, hanno finito per adottare modelli ibridi.",
       "che", "Relativo sujeto: «che». «Le quali» es correcto en registro alto y evita ambigüedades.", alt=["le quali"]),
    cz(5, T1, "Benché il fenomeno ___ (riguardare) soprattutto i servizi, anche l'industria ne è stata toccata.",
       "riguardi", "«Benché / sebbene / nonostante / malgrado» + congiuntivo. En castellano «aunque» admite indicativo; en italiano no."),
    cz(6, T1, "I sindacati chiedono che il diritto alla disconnessione ___ (essere) garantito per legge.",
       "sia", "«Chiedere che» + congiuntivo. En pasiva de proceso también vale «venga garantito».", alt=["venga"]),
    cz(7, T1, "Se le norme fossero più chiare, i lavoratori ___ (sentirsi) più tutelati.",
       "si sentirebbero", "Período hipotético de la posibilidad: se + congiuntivo imperfetto, condizionale presente en la principal."),
    cz(8, T1, "Non tutti, ___, considerano questa trasformazione un progresso.",
       "tuttavia", "Conector adversativo entre comas: tuttavia / però / comunque. «Ma» no puede ir en posición interna.",
       alt=["però", "comunque"]),
    cz(9, T1, "Alcuni sociologi temono che l'ufficio ___ (perdere) la sua funzione di luogo di socialità.",
       "perda", "«Temere che» expresa un estado de ánimo: congiuntivo presente (perda). También sería posible «possa perdere»."),
    cz(10, T1, "___ lavorando da casa si risparmia tempo, si rischia di isolarsi.",
       "Pur", "Concesiva implícita: «pur» + gerundio. Ojo: «sebbene» y «benché» no se combinan con gerundio, sino con congiuntivo.",
       alt=["Pure"]),
    cz(11, T1, "Gli esperti raccomandano ___ stabilire orari precisi e di rispettarli.",
       "di", "«Raccomandare di» + infinito (como consigliare di, suggerire di). En castellano «recomiendan establecer» va sin preposición."),
    cz(12, T1, "Chi lavora da casa fatica ___ separare la vita privata da quella professionale.",
       "a", "*faticare* rige *a* + infinitivo: *fatica a separare* («le cuesta separar»). Es régimen fijo, como *riuscire a* y *continuare a*."),
    cz(13, T1, "Il confine tra i due ambiti, ___ quale un tempo era netto, si è fatto sempre più sottile.",
       "il", "«Il quale» como sujeto de la relativa concuerda con el antecedente (il confine → il quale). Registro formal."),
    cz(14, T1, "Nessuno si aspettava che la produttività ___ (restare) stabile.",
       "restasse", "Verbo principal en pasado (si aspettava) → congiuntivo imperfetto en la subordinada: concordanza dei tempi."),
    cz(15, T1, "I dipendenti ___ è stato chiesto un parere hanno risposto in modo contrastante.",
       "a cui", "Complemento indirecto en la relativa: «a cui» / «ai quali». El «cui» sin preposición (le persone cui ho scritto) es de registro literario.",
       alt=["ai quali", "cui"]),
    cz(16, T1, "I più giovani apprezzano la flessibilità; i più anziani, ___, lamentano la mancanza di contatto diretto.",
       "invece", "«Invece» entre comas marca el contraste entre dos sujetos. «Al contrario» y «viceversa» funcionan igual.",
       alt=["al contrario", "viceversa"]),
    cz(17, T1, "Sarebbe auspicabile che le imprese ___ (investire) nella formazione dei dirigenti.",
       "investissero", "Condizionale en la principal («sarebbe auspicabile che») → congiuntivo imperfetto, no presente."),
    cz(18, T1, "Molti dirigenti, infatti, non sanno ___ gestire una squadra che non vedono mai.",
       "come", "Interrogativa indirecta con infinito: «non sapere come/cosa/dove + infinito». Sin «di»."),
    cz(19, T1, "Le ricerche indicano che, ___ passare del tempo, i problemi iniziali tendono a ridursi.",
       "col", "Expresión fija: «col (con il) passare del tempo» = con el paso del tiempo. El infinito sustantivado lleva artículo.",
       alt=["con il"]),
    cz(20, T1, "Resta da capire ___ questo modello sia sostenibile sul lungo periodo.",
       "se", "Interrogativa indirecta total: «se» (= si). El congiuntivo (sia) es normal en registro formal."),
    cz(21, T1, "In ogni caso, sarebbe un errore tornare ___ modelli del passato senza una riflessione seria.",
       "ai", "«Tornare a» + artículo plural: a + i = ai. Error frecuente: *a i, *agli (agli va antes de vocal, s impura, z…)."),
    cz(22, T1, "Occorre, ___, un quadro normativo che tenga conto delle esigenze di tutti.",
       "dunque", "Conector conclusivo entre comas: dunque / quindi / pertanto / perciò. «Pertanto» es el más formal.",
       alt=["quindi", "pertanto", "perciò"]),
    cz(23, T1, "Chiunque ___ (avere) provato il lavoro da remoto sa che i vantaggi si pagano con nuove responsabilità.",
       "abbia", "Los indefinidos relativos (chiunque, qualunque cosa, dovunque) rigen congiuntivo: chiunque abbia provato."),
    cz(24, T1, "Alcune imprese hanno affrontato la questione ___ (introdurre) giornate obbligatorie in presenza.",
       "introducendo", "Gerundio modal: dice cómo se hizo algo. Los verbos en -durre forman el gerundio en -ducendo (introducendo, producendo)."),
    cz(25, T1, "___ isolamento, secondo molti psicologi, è il rischio più citato.",
       "L'", "Artículo determinado ante vocal, singular: l' (con apóstrofo). Sujeto genérico abstracto → artículo obligatorio."),
    cz(26, T1, "Dei benefici si parla molto; dei costi, invece, ___ parla poco.",
       "se ne", "«Ne» reemplaza «dei costi»; junto al «si» impersonal, el «si» se convierte en «se»: se ne parla."),
    cz(27, T1, "Il dibattito è aperto e ___ resterà ancora a lungo.",
       "lo", "«Lo» neutro retoma el predicado (aperto): «lo resterà» = seguirá siéndolo. En castellano se omite o se dice «lo seguirá siendo»."),

    # ------------------------------------------------------------------
    # Cloze, Testo 2: Il ritorno al paese (narrativo, passato remoto)
    # ------------------------------------------------------------------
    cz(28, T2, "Elena ___ (tornare) al paese della nonna dopo vent'anni di assenza.",
       "tornò", "Narración en passato remoto: tornare → tornò (3ª sing., acento gráfico obligatorio)."),
    cz(29, T2, "Il treno la lasciò in una stazione ___ non si fermava quasi più nessuno.",
       "in cui", "Relativo de lugar: «in cui» / «dove» / «nella quale». Con «cui» la preposición es obligatoria.",
       alt=["dove", "nella quale"]),
    cz(30, T2, "___ (scendere) dal treno, si accorse che il paese le sembrava più piccolo di come lo ricordava.",
       "Scesa", "Participio pasado absoluto: concuerda con el sujeto (Elena → scesa) y expresa anterioridad. El gerundio (scendendo) marca simultaneidad.",
       alt=["Scendendo", "Appena scesa"]),
    cz(31, T2, "Nessuno la ___ (riconoscere), e lei non riconobbe nessuno.",
       "riconobbe", "Passato remoto irregular: conoscere → conobbi, conoscesti, conobbe. Doble b."),
    cz(32, T2, "La casa della nonna, ___ quale aveva passato tutte le estati dell'infanzia, aveva le finestre chiuse.",
       "nella", "Preposición + «il quale» concordado: in + la quale = nella quale (= in cui)."),
    cz(33, T2, "___ (aprire) la porta, sentì l'odore di legna e di polvere che conosceva bene.",
       "Aperta", "Participio absoluto con objeto: concuerda con el objeto (la porta → aperta). Equivale a «dopo aver aperto».",
       alt=["Aprendo", "Avendo aperto", "Dopo aver aperto"]),
    cz(34, T2, "Se ___ (sapere) che la casa era in quelle condizioni, avrebbe portato con sé gli attrezzi.",
       "avesse saputo", "Período hipotético de la irrealidad en el pasado: se + congiuntivo trapassato, condizionale passato."),
    cz(35, T2, "Sul tavolo ___ una lettera che nessuno aveva mai aperto.",
       "c'era", "«Esserci» en imperfetto para el escenario de fondo: c'era (había). Con apóstrofo."),
    cz(36, T2, "La lettera era indirizzata ___ nonna e portava una data di trent'anni prima.",
       "alla", "«Indirizzato a» + artículo: a + la = alla."),
    cz(37, T2, "Elena esitò: non sapeva se ___ (dovere) aprirla o lasciarla dov'era.",
       "dovesse", "Interrogativa indirecta en pasado: congiuntivo imperfetto (dovesse). El indicativo (doveva) se acepta en el habla.",
       alt=["doveva"]),
    cz(38, T2, "Alla fine la aprì, ___ le mani le tremassero.",
       "benché", "Concesiva con congiuntivo: benché / sebbene / nonostante / malgrado / quantunque + tremassero.",
       alt=["sebbene", "nonostante", "malgrado", "quantunque"]),
    cz(39, T2, "Era di un uomo ___ nome non aveva mai sentito nominare.",
       "il cui", "«Cui» posesivo: il cui nome = cuyo nombre. El artículo concuerda con «nome»."),
    cz(40, T2, "L'uomo scriveva che di lì a poco ___ (partire) per l'Argentina e che non sarebbe più tornato.",
       "sarebbe partito", "Futuro en el pasado: condizionale passato («sarebbe partito»), no condizionale presente como en castellano («partiría»)."),
    cz(41, T2, "Chiedeva alla nonna di raggiungerlo, ___ lei non lo fece mai.",
       "ma", "Adversativa simple: ma / però. «Lo fece»: passato remoto de fare.", alt=["però"]),
    cz(42, T2, "Elena rimase a lungo seduta, ___ (pensare) a quella vita che non era stata vissuta.",
       "pensando", "Gerundio simple: acción simultánea a la principal. Sin preposición (no ✗a pensando)."),
    cz(43, T2, "Chissà che cosa ___ (succedere) se la nonna avesse risposto.",
       "sarebbe successo", "Apódosis irreal en el pasado: condizionale passato. «Succedere» va con essere: sarebbe successo."),
    cz(44, T2, "Uscì di casa che era già buio e ___ (dirigersi) verso l'unico bar del paese.",
       "si diresse", "Passato remoto irregular de dirigere: diressi, dirigesti, diresse. Reflexivo: si diresse."),
    cz(45, T2, "Il barista, un uomo anziano, la guardò ___ dire nulla.",
       "senza", "«Senza» + infinito = sin + infinitivo. «Nulla/niente» después del verbo no exige «non» si ya hay «senza»."),
    cz(46, T2, "Poi le chiese se ___ (essere) la nipote di Assunta.",
       "fosse", "Interrogativa indirecta dependiente de un pasado: congiuntivo imperfetto (fosse); «era» es coloquial.",
       alt=["era"]),
    cz(47, T2, "Elena annuì, sorpresa che qualcuno ___ (ricordarsi) ancora di lei.",
       "si ricordasse", "Adjetivo de sentimiento + che → congiuntivo; tiempo pasado en la principal → imperfetto."),
    cz(48, T2, "«Tua nonna», disse l'uomo, «è stata la donna più coraggiosa che io ___ (conoscere)».",
       "abbia conosciuto", "Superlativo relativo + relativa → congiuntivo (passato): la più coraggiosa che io abbia conosciuto.",
       alt=["abbia mai conosciuto"]),
    cz(49, T2, "Avrebbe voluto fargli molte domande, ma non ___ fece nessuna.",
       "gliene", "Pronombres combinados: gli + ne = gliene (una sola palabra). «Ne» retoma «domande»."),
    cz(50, T2, "Tornò a casa a piedi; ___ le strade erano buie, non ebbe paura.",
       "anche se", "«Anche se» rige indicativo (erano); «sebbene/benché» exigirían congiuntivo (fossero)."),
    cz(51, T2, "Quella notte, per la prima volta ___ vent'anni, dormì nel letto della nonna.",
       "dopo", "«Per la prima volta dopo vent'anni» (o «in vent'anni»). Lo más natural: «dopo vent'anni» o «in vent'anni»; «da vent'anni» también se usa.",
       alt=["in", "da"]),
    cz(52, T2, "Il mattino seguente decise che ___ (restare) almeno fino alla fine dell'estate.",
       "sarebbe restata", "Futuro en el pasado → condizionale passato; el participio concuerda con Elena (restata)."),
    cz(53, T2, "Aveva preso la decisione ___ sola, come avrebbe fatto la nonna.",
       "da", "«Por su cuenta, sin ayuda» se dice *da solo/da sola*: la preposición es *da*, no *per* ni *a*."),

    # ------------------------------------------------------------------
    # Cloze, Testo 3: Una città in bicicletta (versione C)
    # ------------------------------------------------------------------
    cz(54, T3, "Da qualche anno Bologna cerca di diventare una città ___ misura di ciclista.",
       "a", "Expresión fija: «a misura di» = pensado para, a la medida de (a misura d'uomo, di bambino)."),
    cz(55, T3, "Il Comune ha deciso ___ ridurre il limite di velocità a trenta all'ora in gran parte delle strade.",
       "di", "«Decidere di» + infinito. En castellano «decidió reducir» va sin preposición."),
    cz(56, T3, "All'inizio molti automobilisti temevano che il traffico ___ (peggiorare).",
       "peggiorasse", "«Temere che» + congiuntivo; la principal en pasado pide el imperfetto (peggiorasse)."),
    cz(57, T3, "I dati del primo anno, ___, raccontano un'altra storia.",
       "tuttavia", "Conector adversativo entre comas: tuttavia / però / invece / comunque.", alt=["però", "invece", "comunque"]),
    cz(58, T3, "Gli incidenti gravi sono diminuiti di un terzo, e non si è registrato ___ aumento dei tempi di percorrenza.",
       "alcun", "«Non… alcun» (o «nessun») + sustantivo masculino singular: non si è registrato alcun aumento.", alt=["nessun"]),
    cz(59, T3, "Le piste ciclabili, ___ lunghezza è raddoppiata in cinque anni, sono usate anche d'inverno.",
       "la cui", "«Cui» posesivo: artículo + cui + sustantivo; el artículo concuerda con «lunghezza»."),
    cz(60, T3, "Chi va al lavoro in bicicletta dice di sentirsi meno stressato ___ quando usava la macchina.",
       "di", "Comparación con una oración temporal: «meno… di quando». También se oye «che quando».", alt=["che"]),
    cz(61, T3, "Se le strade fossero più sicure, molti genitori ___ (lasciare) andare i figli a scuola da soli.",
       "lascerebbero", "Período hipotético de la posibilidad: se + congiuntivo imperfetto → condizionale presente (lascerebbero)."),
    cz(62, T3, "Non mancano le critiche: i commercianti lamentano ___ i clienti faticano a parcheggiare.",
       "che", "«Lamentare che» + indicativo (hecho) o congiuntivo: el nexo es «che», sin preposición."),
    cz(63, T3, "Alcuni negozi del centro, ___ (sostenere) i proprietari, hanno perso il dieci per cento degli incassi.",
       "sostengono", "Inciso con verbo de decir y sujeto pospuesto: «sostengono i proprietari» (según dicen los dueños)."),
    cz(64, T3, "Il Comune ha risposto ___ (costruire) nuovi parcheggi di scambio alle porte della città.",
       "costruendo", "Gerundio modal: dice cómo respondió. Sin preposición: «rispondere costruendo»."),
    cz(65, T3, "Da questi parcheggi partono navette elettriche ___ dieci minuti.",
       "ogni", "Frecuencia: «ogni dieci minuti» (cada diez minutos), con el sustantivo en plural después de un número."),
    cz(66, T3, "Resta il problema delle periferie, ___ le piste ciclabili sono ancora poche e mal collegate.",
       "dove", "Relativo de lugar: «dove» / «in cui» / «nelle quali».", alt=["in cui", "nelle quali"]),
    cz(67, T3, "È lì che si decide ___ il progetto avrà successo.",
       "se", "Interrogativa indirecta total: «se» (= si). Con el futuro, indicativo."),
    cz(68, T3, "Gli urbanisti raccomandano che i nuovi lavori ___ (concentrarsi) sui quartieri esterni.",
       "si concentrino", "«Raccomandare che» + congiuntivo presente (principal en presente): si concentrino."),
    cz(69, T3, "Una bicicletta costa molto ___ di un'automobile.",
       "meno", "Comparativo de inferioridad: «meno… di» + sustantivo."),
    cz(70, T3, "___ (considerare) tutti i costi, la bicicletta resta il mezzo più economico.",
       "Considerati", "Participio absoluto: concuerda con «i costi» (considerati) y equivale a «se si considerano».",
       alt=["Considerando"]),
    cz(71, T3, "Molti cittadini non si fidano ancora: ___ serve, dicono, è una rete continua.",
       "ciò che", "«Lo que» = «ciò che» / «quello che»; nunca «lo che».", alt=["quello che", "quel che"]),
    cz(72, T3, "Se il Comune ___ (ascoltare) prima i quartieri, le polemiche sarebbero state minori.",
       "avesse ascoltato", "Irrealidad en el pasado: se + congiuntivo trapassato → condizionale passato."),
    cz(73, T3, "In ogni caso, indietro non ___ torna: la città è cambiata.",
       "si", "«Si» impersonal: «non si torna indietro» (no hay vuelta atrás)."),

    # ------------------------------------------------------------------
    # Formazione di parole (lessico)
    # ------------------------------------------------------------------
    fp(1, "efficace → ___ (sostantivo)", "efficacia", "Adjetivos en -ace → sustantivo en -acia: efficace → efficacia, tenace → tenacia."),
    fp(2, "sicuro → ___ (sostantivo)", "sicurezza", "Sufijo -ezza para cualidades: sicurezza, bellezza, ricchezza. En castellano suele ser -idad o -eza."),
    fp(3, "libero → ___ (sostantivo)", "libertà", "Sufijo -tà (átono, con acento gráfico, invariable en plural): libertà, le libertà."),
    fp(4, "crescere → ___ (sostantivo)", "crescita", "Nombres de acción en -ita a partir del participio: crescere → crescita, perdere → perdita."),
    fp(5, "scegliere → ___ (sostantivo)", "scelta", "Sustantivo derivado del participio irregular: scelto → la scelta (elección)."),
    fp(6, "produrre → ___ (sostantivo dell'azione)", "produzione", "Verbos en -durre → -duzione: produzione, traduzione, riduzione. «Prodotto» es el resultado.",
       alt=["prodotto"]),
    fp(7, "giovane → ___ (sostantivo)", "gioventù", "Dos formas: «gioventù» (la juventud como etapa y como conjunto de jóvenes) y «giovinezza» (la cualidad de ser joven).",
       alt=["giovinezza"]),
    fp(8, "bello → ___ (sostantivo)", "bellezza", "Sufijo -ezza: bellezza. Ojo a la doble z."),
    fp(9, "povero → ___ (sostantivo)", "povertà", "Sufijo -tà: povertà (pobreza). Se pierde la -o final: pover-tà."),
    fp(10, "difficile → ___ (sostantivo)", "difficoltà", "Irregular: difficile → difficoltà (no ✗difficilità). En cambio, facile → facilità es regular."),
    fp(11, "partire → ___ (sostantivo)", "partenza", "Sufijo -enza para verbos de la 3ª conjugación: partenza, preferenza."),
    fp(12, "perdere → ___ (sostantivo)", "perdita", "Sustantivo en -ita: perdita (pérdida). Error típico: ✗perdida."),
    fp(13, "vincere → ___ (sostantivo)", "vittoria", "Vincere → vittoria (la victoria). «Vincita» es lo que se gana en un juego o lotería.",
       alt=["vincita"]),
    fp(14, "sperare → ___ (sostantivo)", "speranza", "Sufijo -anza para verbos en -are: speranza, fidanza, alleanza."),
    fp(15, "temere → ___ (sostantivo)", "timore", "Temere → timore (temor), con cambio de vocal. «Tema» es otra cosa (tema)."),
    fp(16, "fedele → ___ (sostantivo)", "fedeltà", "Sufijo -tà: fedeltà (fidelidad). Se pierde la -e final."),
    fp(17, "veloce → ___ (sostantivo)", "velocità", "Sufijo -ità: velocità. Invariable en plural: le velocità."),
    fp(18, "caldo → ___ (sostantivo)", "calore", "Sufijo -ore para cualidades: calore, dolore, sapore. «Il caldo» también existe como sustantivo (fa caldo)."),
    fp(19, "pericolo → ___ (aggettivo)", "pericoloso", "Sufijo -oso: pericoloso, famoso, coraggioso. Femenino -osa."),
    fp(20, "fama → ___ (aggettivo)", "famoso", "Sufijo -oso: famoso. Igual que en castellano."),
    fp(21, "notte → ___ (aggettivo)", "notturno", "Adjetivo relacional: notturno (nocturno). De la raíz latina, no de «notte» directamente."),
    fp(22, "mese → ___ (aggettivo)", "mensile", "Sufijo -ile en adjetivos de periodicidad: mensile, settimanale, annuale, giornaliero."),
    fp(23, "anno → ___ (aggettivo)", "annuale", "Sufijo -ale: annuale. «Annuo» existe en lenguaje contable (canone annuo).",
       alt=["annuo"]),
    fp(24, "regolare → ___ (avverbio)", "regolarmente", "Adjetivo en -re: se elimina la -e y se añade -mente: regolarmente, particolarmente."),
    fp(25, "felice → ___ (avverbio)", "felicemente", "Adjetivos en -e: se añade -mente sin cambios: felicemente, semplicemente."),
    fp(26, "possibile → ___ (contrario con prefisso)", "impossibile", "Prefijo negativo in- → im- delante de p, b, m: impossibile, imperfetto."),
    fp(27, "legale → ___ (contrario con prefisso)", "illegale", "Prefijo in- → il- delante de l: illegale, illogico, illeggibile."),
    fp(28, "regolare → ___ (contrario con prefisso)", "irregolare", "Prefijo in- → ir- delante de r: irregolare, irreale, irresponsabile."),
    fp(29, "contento → ___ (contrario con prefisso)", "scontento", "Prefijo s- con valor negativo: scontento, sfortunato, sconosciuto."),
    fp(30, "fare → ___ (contrario con prefisso)", "disfare", "Prefijo dis- para invertir la acción: disfare (deshacer), disdire, disabitato."),
    fp(31, "utile → ___ (contrario con prefisso)", "inutile", "Prefijo in- ante vocal: inutile, inatteso, inesperto."),
    fp(32, "responsabile → ___ (contrario con prefisso)", "irresponsabile", "in- → ir- delante de r: irresponsabile (doble r)."),

    # ------------------------------------------------------------------
    # Trasformazione (strutture)
    # ------------------------------------------------------------------
    tr(1, "Sebbene fosse tardi, è uscito. → Pur ___ tardi, è uscito.", "essendo",
       "Concesiva explícita (sebbene + congiuntivo) → implícita: pur + gerundio."),
    tr(2, "Il libro è stato scritto da Calvino. → Calvino ___ il libro.", "ha scritto",
       "Pasiva → activa: el complemento agente (da Calvino) pasa a sujeto; el tiempo se mantiene (passato prossimo).",
       alt=["scrisse"]),
    tr(3, "Marco: «Verrò domani». → Marco ha detto che ___ il giorno dopo.", "sarebbe venuto",
       "Discurso indirecto: futuro → condizionale passato (futuro en el pasado); domani → il giorno dopo."),
    tr(4, "Dopo che ebbe mangiato, uscì. → Dopo ___, uscì.", "aver mangiato",
       "Temporal explícita (trapassato remoto) → implícita: dopo + infinito passato (aver mangiato).",
       alt=["avere mangiato"]),
    tr(5, "La gente dice che la crisi è finita. → ___ che la crisi è finita.", "Si dice",
       "Sujeto genérico («la gente») → si impersonal + verbo en 3ª singular."),
    tr(6, "Il meccanico ripara la macchina. Io… → ___ la macchina dal meccanico.", "Faccio riparare",
       "Causativo: fare + infinito; quien ejecuta la acción va con «da» (dal meccanico)."),
    tr(7, "Quando è arrivato Luca, siamo partiti. → ___ di Luca, siamo partiti.", "All'arrivo",
       "Nominalización: subordinada temporal → sustantivo (arrivo) con preposición articulada: all'arrivo di Luca."),
    tr(8, "Le persone che sono state invitate → Le persone ___", "invitate",
       "Relativa pasiva → participio pasado con valor de adjetivo, concordado (persone → invitate)."),
    tr(9, "Marco è più alto di Luca. → Luca è ___ di Marco.", "meno alto",
       "Comparativo invertido: più alto → meno alto (o più basso). El segundo término sigue con «di».",
       alt=["più basso"]),
    tr(10, "Il governo approverà la legge. → La legge ___ dal governo.", "sarà approvata",
       "Activa → pasiva en futuro: essere/venire en futuro + participio concordado (legge → approvata).",
       alt=["verrà approvata"]),
    tr(11, "Bisogna compilare il modulo entro venerdì. → Il modulo ___ entro venerdì.", "va compilato",
       "Pasiva de obligación: andare + participio = deve essere + participio. Solo en tiempos simples.",
       alt=["deve essere compilato", "dev'essere compilato"]),
    tr(12, "Il medico: «Prenda le medicine». → Il medico mi ha detto ___ le medicine.", "di prendere",
       "Imperativo en discurso indirecto: dire di + infinito."),
    tr(13, "Lucia: «Dove abiti?» → Lucia mi ha chiesto dove ___.", "abitassi",
       "Pregunta en indirecto dependiente de pasado: presente → congiuntivo imperfetto (abitassi); «abitavo» es coloquial.",
       alt=["abitavo"]),
    tr(14, "Anna: «Ieri sono stata qui». → Anna disse che ___ era stata lì.", "il giorno prima",
       "Deícticos en el indirecto: ieri → il giorno prima / il giorno precedente; qui → lì.",
       alt=["il giorno precedente"]),
    tr(15, "Poiché era stanco, è andato a letto. → ___ stanco, è andato a letto.", "Essendo",
       "Causal explícita → implícita con gerundio: essendo stanco."),
    tr(16, "Ho comprato un dizionario perché voglio migliorare il lessico. → Ho comprato un dizionario ___ il lessico.", "per migliorare",
       "Final implícita: per + infinito (mismo sujeto). «Perché voglio» es causal; la final explícita sería «perché + congiuntivo»."),
    tr(17, "Mentre tornavo a casa, ho incontrato Paolo. → ___ a casa, ho incontrato Paolo.", "Tornando",
       "Temporal de simultaneidad → gerundio simple: tornando a casa."),
    tr(18, "In questo negozio vendono prodotti biologici. → In questo negozio ___ prodotti biologici.", "si vendono",
       "Si passivante: el verbo concuerda con el objeto plural (prodotti → si vendono), no ✗si vende."),
    tr(19, "Il parrucchiere mi taglia i capelli. → ___ tagliare i capelli dal parrucchiere.", "Mi faccio",
       "Causativo reflexivo: farsi + infinito (me hago cortar el pelo). El agente con «da»."),
    tr(20, "Permetto ai bambini di giocare in giardino. → ___ giocare i bambini in giardino.", "Lascio",
       "*lasciare* + infinitivo expresa permiso («dejar»), a diferencia de *fare* + infinitivo, que expresa causa: *lascio giocare i bambini*."),
    tr(21, "Quando la riunione è finita, siamo andati a pranzo. → ___ della riunione, siamo andati a pranzo.", "Alla fine",
       "Nominalización: alla fine / al termine della riunione. Estilo nominal típico del registro formal.",
       alt=["Al termine", "Dopo la fine"]),
    tr(22, "Prima che il treno parta, compra un biglietto. → Prima ___ del treno, compra un biglietto.", "della partenza",
       "Nominalización: prima che + congiuntivo → prima della + sustantivo (partenza)."),
    tr(23, "Le persone che partecipano al corso → I ___ al corso", "partecipanti",
       "Relativa → participio presente sustantivado: i partecipanti (los participantes)."),
    tr(24, "I documenti che sono stati firmati ieri → I documenti ___ ieri", "firmati",
       "Relativa pasiva → participio pasado concordado: i documenti firmati."),
    tr(25, "Non ho studiato, quindi non ho superato l'esame. → Se ___, avrei superato l'esame.", "avessi studiato",
       "Hipótesis irreal en el pasado: se + congiuntivo trapassato (avessi studiato) + condizionale passato."),
    tr(26, "Anche se è ricco, non è felice. → ___ ricco, non è felice.", "Pur essendo",
       "Anche se + indicativo → pur + gerundio, o benché/sebbene/per quanto/nonostante + congiuntivo (sia).",
       alt=["Benché sia", "Sebbene sia", "Per quanto sia", "Nonostante sia", "Malgrado sia"]),
    tr(27, "Marco e Luca sono ugualmente alti. → Marco è alto ___ Luca.", "quanto",
       "Comparativo de igualdad: (tanto) alto quanto / (così) alto come.", alt=["come"]),
    tr(28, "Nessun film è più bello di questo. → Questo è il film ___ bello.", "più",
       "Superlativo relativo: artículo + sustantivo + più + adjetivo (il film più bello)."),

    # ------------------------------------------------------------------
    # Registro (lessico)
    # ------------------------------------------------------------------
    rg(1, "(informale) Ci vediamo! → (formale) ___", ["Arrivederci", "A dopo", "Ciao"], "Arrivederci",
       "«Arrivederci» (o «ArrivederLa», muy formal) es el saludo de despedida neutro-formal; «ciao» y «a dopo» son informales."),
    rg(2, "(informale) Ti scrivo per chiedere… → (formale) ___ per chiedere…", ["Le scrivo", "Ti scrivo", "Gli scrivo"], "Le scrivo",
       "Forma de cortesía «Lei»: el pronombre indirecto es «Le» (mayúscula opcional pero frecuente en cartas). «Gli» sería «a él»."),
    rg(3, "(informale) riguardo a → (formale, nelle lettere) ___", ["in merito a", "sopra a", "di"], "in merito a",
       "«In merito a» / «relativamente a» / «in riferimento a» son fórmulas de la correspondencia formal."),
    rg(4, "(informale) se → (formale, nei contratti e nelle lettere) ___", ["qualora", "quando", "siccome"], "qualora",
       "En registro formal, la condición «si, en caso de que» se expresa con *qualora* + congiuntivo. *siccome* no sirve: es causal («como, ya que»)."),
    rg(5, "(informale) e anche → (formale) ___", ["nonché", "pure", "e pure"], "nonché",
       "«Nonché» = y también, además de; típico del registro burocrático y periodístico."),
    rg(6, "(informale) quindi → (formale) ___", ["pertanto", "allora", "così"], "pertanto",
       "*pertanto* («por lo tanto») es la consecuencia en textos formales y jurídicos; *quindi* es neutro y *allora* coloquial."),
    rg(7, "(informale) questa lettera / questa email → (formale) ___", ["la presente", "la corrente", "questa cosa"], "la presente",
       "«La presente» = la presente (carta): «Con la presente Le comunico che…»."),
    rg(8, "(informale) Te lo mando insieme alla mail → (formale) Lo trova ___", ["in allegato", "in aggiunta", "in accompagnamento"], "in allegato",
       "«In allegato» = adjunto. Verbo: allegare (Allego il curriculum)."),
    rg(9, "Chiusura formale di una lettera di reclamo: ___", ["Distinti saluti", "Baci", "Ci sentiamo"], "Distinti saluti",
       "«Distinti saluti» es la fórmula de cierre más formal y fría; «Cordiali saluti» es formal pero cordial."),
    rg(10, "Chiusura di un'email formale ma cordiale (a un collega di un'altra azienda): ___", ["Cordiali saluti", "Un bacione", "Ciao ciao"], "Cordiali saluti",
       "«Cordiali saluti» es el cierre estándar en emails de trabajo. «Un bacione» y «ciao ciao» son íntimos."),
    rg(11, "Intestazione a un direttore che non si conosce: ___ Direttore,", ["Egregio", "Caro", "Ciao"], "Egregio",
       "«Egregio» (muy formal, hoy sobre todo para hombres y cargos), «Gentile» (formal, neutro), «Caro» (informal o afectuoso)."),
    rg(12, "(informale) Ho un sacco di roba da fare. → (formale) Ho ___ da fare.", ["molte cose", "un mucchio di roba", "tanta roba"], "molte cose",
       "«Roba» y «un sacco di» son coloquiales; en registro formal: molte cose, numerosi impegni."),
    rg(13, "(informale) Me ne frego. → (formale) ___", ["Non mi interessa", "Chi se ne importa", "Non me ne può fregare di meno"], "Non mi interessa",
       "«Fregarsene» es vulgar-coloquial; en registro neutro: «non mi interessa», «non mi riguarda»."),
    rg(14, "(informale) Ho beccato l'ultimo treno. → (neutro) Ho ___ l'ultimo treno.", ["preso", "colto", "afferrato"], "preso",
       "«Beccare» (coloquial) = prendere, sorprendere. Con medios de transporte: prendere il treno."),
    rg(15, "(informale) L'hanno sgamato subito. → (neutro) L'hanno ___ subito.", ["scoperto", "conosciuto", "guardato"], "scoperto",
       "*sgamare* es jerga juvenil («pescar, descubrir»); en registro neutro se dice *scoprire*."),
    rg(16, "(formale) Le sarei grato se volesse rispondere. → (informale) ___", ["Mi faresti un favore se rispondessi", "Sarei lieto se Ella rispondesse", "La prego di voler rispondere"], "Mi faresti un favore se rispondessi",
       "«Le sarei grato se…» es una petición formal; el equivalente informal usa «tu» y léxico corriente."),
    rg(17, "(formale) Pertanto → (informale) ___", ["quindi", "nonché", "qualora"], "quindi",
       "«Quindi» es el conector conclusivo de uso general; «pertanto» es su versión formal."),
    rg(18, "(formale) La informo che → (informale) ___", ["Ti dico che", "Le comunico che", "Si rende noto che"], "Ti dico che",
       "«Informare / comunicare / rendere noto» son verbos del registro formal; en el informal basta «dire»."),
    rg(19, "(informale) Mi hanno fregato. → (formale) Mi hanno ___.", ["imbrogliato", "colpito", "rubato"], "imbrogliato",
       "«Fregare» (coloquial) = imbrogliare, truffare (estafar). «Rubare» necesita objeto (mi hanno rubato il telefono)."),
    rg(20, "(formale) Resto a disposizione per ulteriori chiarimenti. → (informale) ___", ["Se hai dubbi, chiedimi pure", "Rimango a Sua disposizione", "Attendo un Suo cortese riscontro"], "Se hai dubbi, chiedimi pure",
       "Fórmula de cierre formal → informal con «tu» e imperativo atenuado por «pure»."),
]
