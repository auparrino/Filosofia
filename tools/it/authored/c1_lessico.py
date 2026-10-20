# -*- coding: utf-8 -*-
"""Léxico C1 semana a semana (27-51): formación de palabras y colocaciones.

Los dos microbloques de cada semana están en tools/it/lessons/c1_extra.py;
acá, sus ejercicios, sobre familias y colocaciones de la lectura larga de
esa semana (tools/it/tramo/wNN.json):

  c1-fp-WW-NN  «Formá la palabra» (como los ex-fp-* del examen): tres sueltos
               («certo → ___ (sostantivo)») y tres en una frase de la lectura,
               con la base entre paréntesis.  Ninguno repite una palabra del
               examen final.
  c1-co-WW-NN  colocaciones: cinco «completá el verbo» (como el tipo CV de
               lessico2.py) y cuatro «elegí entre tres palabras parecidas»,
               verbo + sustantivo abstracto y adjetivo + sustantivo.

Cada ítem lleva «w»: build_course.py lo pone en esa semana, y en la última
parte de la lección si va en partes (la que trae los dos bloques).
"""

P_FP = "Formá la palabra pedida a partir de la que está en la base."
P_FPC = "Completá con la palabra derivada de la que está entre paréntesis (mirá la tabla de la semana)."
P_CV = "Completá con el verbo que forma la colocación, conjugado como corresponde."
P_CE = "Elegí la palabra que forma la colocación."

ITEMS = []

# La regla de formación de cada semana (la del microbloque): encabeza la nota
# cuando la nota del ítem es solo la equivalencia («*Dolcezza* = dulzura»).
RULE = {
    27: "Adjetivo + *-ezza* da el sustantivo de la cualidad, femenino",
    28: "Verbo + *-mento* da la acción o su resultado, masculino",
    29: "Verbo en *-are* → sustantivo en *-azione*, femenino",
    30: "Adjetivo + *-ità* (o *-tà*) da la cualidad, femenina, invariable y con tilde",
    31: "Verbo + *-tore* (masculino) o *-trice* (femenino) da quien hace la acción",
    32: "*-anza* (de verbos en *-are*) y *-enza* (de *-ere*, *-ire*) forman sustantivos femeninos",
    33: "Verbo + *-abile* / *-ibile* da un adjetivo «que se puede…»",
    34: "Sustantivo + *-oso* da un adjetivo «que tiene, lleno de»",
    35: "El vocabulario del ambiente usa *-mento* y *-zione*",
    36: "*s-* y *dis-* dan el contrario",
    37: "*-ismo* es la idea, *-ista* la persona (igual en los dos géneros)",
    38: "*ri-* delante del verbo significa «otra vez, de vuelta»",
    40: "*in-* niega (*im-* ante p, b, m; *il-* ante l; *ir-* ante r)",
    41: "Muchos nombres de acción salen del verbo sin sufijo o con *-zione*, *-mento*, *-aggio*",
    42: "El burocratese nombra con sustantivos lo que la lengua común dice con verbos",
    43: "Muchos sustantivos femeninos salen del participio o del verbo sin terminación",
    44: "*-ità* nombra propiedades (*-bile* → *-bilità*)",
    45: "*-evole* forma adjetivos «que produce, que merece»",
    46: "El alterado cambia el tamaño o el juicio, y a veces se vuelve una palabra propia",
    47: "La economía nombra procesos con *-mento* o con el verbo sin terminación",
    48: "Los adjetivos de relación y los gentilicios usan *-ale*, *-ano*, *-ese*, con minúscula",
    49: "El registro alto usa sustantivos abstractos en *-ezza*, *-ità*, *-anza*, *-enza*, *-ione*",
    50: "*-tore* / *-trice* nombra también los oficios del libro",
    51: "El trabajo se nombra con *-ità*, *-enza*, *-zione* / *-ione*",
}
_CO_RULE = "Colocación de la lectura de la semana, para aprender en bloque"


def _solo_equivalencia(n):
    """Same test as tools/lib/test_notas_it.js: every sentence a short «A = B»."""
    import re
    s = n.strip()
    if re.match(r"^[^=.;:]{1,80}=[^=;:]{1,80}\.?$", s):
        return True
    parts = [p.strip() for p in re.split(r"(?<=[.;?!])\s+|;\s*", s) if p.strip()]
    return bool(parts) and all(len(p.split("=")) == 2 and ":" not in p and len(p.split("=")[0].strip()) <= 60
                               and len(p.split("=")[1].strip()) <= 70 for p in parts)


def _note(rule, note):
    return rule + ": " + note if _solo_equivalencia(note) else note


def fp(w, n, stem, answer, note, alt=None):
    ctx = not ("→" in stem)
    d = dict(id="c1-fp-%d-%02d" % (w, n), type="cloze", topic="formazione", level="B2" if w < 40 else "C1", w=w,
             prompt=P_FPC if ctx else P_FP, stem=stem, answer=answer, note=_note(RULE[w], note))
    if alt:
        d["alt"] = alt
    ITEMS.append(d)


def cv(w, n, stem, answer, note, alt=None):
    d = dict(id="c1-co-%d-%02d" % (w, n), type="cloze", topic="collocazioni", level="B2" if w < 40 else "C1", w=w,
             prompt=P_CV, stem=stem, answer=answer, note=_note(_CO_RULE, note))
    if alt:
        d["alt"] = alt
    ITEMS.append(d)


def ce(w, n, stem, options, answer, note):
    ITEMS.append(dict(id="c1-co-%d-%02d" % (w, n), type="choice", topic="collocazioni", level="B2" if w < 40 else "C1",
                      w=w, prompt=P_CE, stem=stem, options=options, answer=answer, note=_note(_CO_RULE, note)))


# ------------------------------------------------------------------ 27
fp(27, 1, "certo → ___ (sostantivo)", "certezza", "*-ezza* forma la cualidad: *certo* → *certezza*.")
fp(27, 2, "lento → ___ (sostantivo)", "lentezza", "*Lentezza* es «lentitud»: *-ezza* no siempre es «-eza».")
fp(27, 3, "Il parroco parla dello struscio con una certa ___. (amaro)", "amarezza", "*Amaro* → *amarezza* (amargura).")
fp(27, 4, "Mi ha colpito la ___ di Rosaria: salutava tutti. (gentile)", "gentilezza", "*Gentilezza* = amabilidad, cortesía.")
fp(27, 5, "Il barista tratta i clienti anziani con grande ___. (dolce)", "dolcezza", "*Dolcezza* = dulzura.")
fp(27, 6, "Ognuno ha le sue ___: la mia è il gelato. (debole)", "debolezze", "*Debolezza* (debilidad), en plural *debolezze*.")
cv(27, 1, "Alle sette di sera la piazza ___ volto.", "cambia", "*Cambiare volto* = cambiar de cara, transformarse.")
cv(27, 2, "Alle sette i negozianti ___ di nuovo le serrande.", "alzano", "*Alzare la serranda* = abrir el negocio; *abbassarla*, cerrarlo.", alt=["tirano su"])
cv(27, 3, "Verso le dieci i bar ___ le luci e la piazza si svuota.", "abbassano", "*Abbassare le luci* = bajar las luces.")
cv(27, 4, "Proprio quelli che sono partiti ___ con passione questa tradizione.", "difendono", "*Difendere una tradizione*.")
cv(27, 5, "Al banco del bar la gente ___ due chiacchiere con il barista.", "scambia", "*Scambiare* (o *fare*) *due chiacchiere* = charlar un rato.", alt=["fa"])
ce(27, 6, "In città esci solo se ___ un appuntamento.", ["hai", "tieni", "porti"], "hai",
   "*Avere un appuntamento*. «Tener» un estado o una cita se dice con *avere*, no con *tenere*.")
ce(27, 7, "Rosaria ___ lo struscio ogni sera da quando era ragazzina.", ["fa", "prende", "dà"], "fa",
   "*Fare lo struscio*, como *fare una passeggiata*, *fare due passi*.")
ce(27, 8, "Il bar ___ una funzione sociale importante.", ["svolge", "esegue", "realizza"], "svolge",
   "*Svolgere una funzione* (o *un ruolo*) = cumplir una función. *Eseguire* es ejecutar una orden o una pieza musical.")
ce(27, 9, "Lo struscio non è solo un'abitudine: è un rito ___.", ["sociale", "socievole", "socio"], "sociale",
   "*Sociale* = de la sociedad; *socievole* = sociable (una persona).")

# ------------------------------------------------------------------ 28
fp(28, 1, "cambiare → ___ (sostantivo)", "cambiamento", "*Cambiare* → *cambiamento* (cambio). También existe *il cambio* (de dinero, de marcha).")
fp(28, 2, "collegare → ___ (sostantivo)", "collegamento", "*Collegamento* = conexión (de transporte, de internet).")
fp(28, 3, "Il vero ___ non è il cartello «vendesi». (investire)", "investimento", "*Investire* → *investimento* (inversión).")
fp(28, 4, "Chi parla di ___ dimentica le iniziative riuscite. (fallire)", "fallimento", "*Fallimento* = fracaso o quiebra.")
fp(28, 5, "Il ___ in un paese di trecento abitanti non è facile. (trasferire)", "trasferimento", "*Trasferimento* = traslado, mudanza.")
fp(28, 6, "Lo ___ delle aree interne dura da decenni. (spopolare)", "spopolamento", "*Spopolare* → *spopolamento* (despoblación). Lleva *lo*: empieza con *s* + consonante.")
cv(28, 1, "Un paesino ___ in vendita le sue case abbandonate a un euro.", "mette", "*Mettere in vendita* = poner en venta.")
cv(28, 2, "Innanzitutto bisogna ___ un equivoco: la casa a un euro non costa un euro.", "chiarire", "*Chiarire un equivoco* = aclarar un malentendido.")
cv(28, 3, "Il problema dei borghi non si ___ con le case, ma con i servizi.", "risolve", "*Risolvere un problema*.")
cv(28, 4, "Un borgo vive solo se qualcuno ci ___ l'inverno.", "passa", "*Passare l'inverno* = pasar el invierno.")
cv(28, 5, "Le case a un euro hanno ___ almeno un merito.", "avuto", "*Avere un merito*.")
ce(28, 6, "Vale la ___ chiedersi che cosa resta di tanto entusiasmo.", ["pena", "spesa", "fatica"], "pena",
   "*Valere la pena* = valer la pena. *Vale la spesa* se dice de algo que conviene comprar.")
ce(28, 7, "Il lavoro da remoto ha ___ credibile un'idea romantica.", ["reso", "fatto", "dato"], "reso",
   "*Rendere* + adjetivo = volver, hacer que algo sea: *rendere credibile*, *rendere possibile*.")
ce(28, 8, "Molti acquirenti hanno ___ dopo il primo sopralluogo.", ["rinunciato", "rifiutato", "ritirato"], "rinunciato",
   "*Rinunciare* (a algo) = desistir, renunciar; *rifiutare* necesita objeto (*ha rifiutato la casa*).")
ce(28, 9, "Il Paese ha scoperto le sue aree ___, lontane dai servizi.", ["interne", "interiori", "intime"], "interne",
   "*Le aree interne* es el nombre técnico de las zonas del interior, alejadas de los servicios.")

# ------------------------------------------------------------------ 29
fp(29, 1, "circolare → ___ (sostantivo)", "circolazione", "*-are* → *-azione*: *circolazione* (circulación, tránsito).")
fp(29, 2, "limitare → ___ (sostantivo)", "limitazione", "*Limitazione* = limitación.")
fp(29, 3, "Temo che l'___ comunale abbia avuto troppa fretta. (amministrare)", "amministrazione", "*Amministrazione* = administración, gobierno local.")
fp(29, 4, "L'___ delle navette è arrivata solo a marzo. (organizzare)", "organizzazione", "*Organizzazione* = organización.")
fp(29, 5, "I commercianti hanno fatto una ___ davanti al Comune. (manifestare)", "manifestazione", "*Manifestazione* = manifestación (y también evento).")
fp(29, 6, "La decisione era giusta, ma l'___ è stata frettolosa. (applicare)", "applicazione", "*Applicazione* = aplicación (de una norma, y también de un celular).")
cv(29, 1, "Un anno fa il Comune ha ___ al traffico tutto il centro storico.", "chiuso", "*Chiudere al traffico* = cerrar al tránsito.")
cv(29, 2, "In consiglio comunale qualcuno è arrivato a ___ le dimissioni dell'assessore.", "chiedere", "*Chiedere le dimissioni* = pedir la renuncia. *Dimissioni* va siempre en plural.")
cv(29, 3, "Oggi vale la pena ___ un bilancio onesto.", "fare", "*Fare un bilancio* = hacer un balance.")
cv(29, 4, "Alcune gelaterie hanno perfino ___ personale.", "assunto", "*Assumere personale* = contratar personal (*assumere*, participio *assunto*).")
cv(29, 5, "Il Comune non ha ___ i tempi del progetto.", "rispettato", "*Rispettare i tempi* = cumplir los plazos.")
ce(29, 6, "Chi passeggia in via Garibaldi ___ l'impressione che la città sia cambiata.", ["ha", "fa", "prende"], "ha",
   "*Avere l'impressione che* + congiuntivo. *Fare impressione* es otra cosa: impresionar, dar impresión.")
ce(29, 7, "Il Comune ha ___ una decisione giusta, ma troppo in fretta.", ["preso", "fatto", "tirato"], "preso",
   "*Prendere una decisione* = tomar una decisión. «Fare una decisione» es un calco del inglés.")
ce(29, 8, "Una città più vivibile non si ___ con un'ordinanza.", ["costruisce", "fabbrica", "edifica"], "costruisce",
   "En sentido figurado, una ciudad (o una relación, una carrera) *si costruisce*.")
ce(29, 9, "Per i commercianti la chiusura era un «suicidio ___».", ["economico", "economo", "economista"], "economico",
   "*Economico* = económico; *economo* es el ecónomo (administrador); *economista*, el especialista.")

# ------------------------------------------------------------------ 30
fp(30, 1, "serio → ___ (sostantivo)", "serietà", "*Serio* → *serietà* (seriedad), con tilde.")
fp(30, 2, "originale → ___ (sostantivo)", "originalità", "*Originale* → *originalità*.")
fp(30, 3, "La giornalista ammette, con una ___ rara, di non aver verificato. (sincero)", "sincerità", "*Sincero* → *sincerità*.")
fp(30, 4, "Dopo quel servizio il telegiornale ha perso ___. (credibile)", "credibilità", "*-bile* → *-bilità*: *credibilità*.")
fp(30, 5, "La serie racconta la ___ senza fare la predica. (vero)", "verità", "*Vero* → *verità* (verdad).")
fp(30, 6, "La bugia si è diffusa con una ___ incredibile. (rapido)", "rapidità", "*Rapidità* = rapidez.")
cv(30, 1, "La serie non mi ha fatto ___ in colpa.", "sentire", "*Sentirsi in colpa* = sentirse culpable.")
cv(30, 2, "Il ragazzo era convinto che nessuno ___ sul serio il post.", "prendesse", "*Prendere sul serio* = tomar en serio; acá en congiuntivo imperfetto.")
cv(30, 3, "Per settimane il sindaco ha ___ insulti da sconosciuti.", "ricevuto", "*Ricevere insulti*.")
cv(30, 4, "Una volta, prima che una notizia ___ in stampa, due persone la verificavano.", "andasse", "*Andare in stampa* = entrar en imprenta, publicarse.")
cv(30, 5, "La regista non ___ un colpevole unico.", "cerca", "*Cercare un colpevole* = buscar un culpable.")
ce(30, 6, "Prima di ___ un articolo, l'ho letto fino in fondo.", ["condividere", "compartire", "spartire"], "condividere",
   "«Compartir» (en redes) es *condividere*. *Compartire* no existe y *spartire* es repartir un botín o una herencia.")
ce(30, 7, "La giornalista ha ___ la notizia senza verificarla.", ["rilanciato", "rilevato", "ribattuto"], "rilanciato",
   "*Rilanciare una notizia* = difundirla, volver a publicarla. *Rilevare* = relevar, detectar.")
ce(30, 8, "Nessuno pensava che valesse la pena ___ la notizia.", ["controllare", "contrastare", "conservare"], "controllare",
   "*Controllare* (o *verificare*) *una notizia* = chequearla.")
ce(30, 9, "Il punto di partenza è una notizia ___.", ["falsa", "finta", "falsificata"], "falsa",
   "*Notizia falsa* (o *fake news*). *Finto* = de mentira, simulado (*un finto medico*).")

# ------------------------------------------------------------------ 31
fp(31, 1, "lavorare → ___ (persona, femminile)", "lavoratrice", "*-tore* / *-trice*: *lavoratore*, *lavoratrice*.")
fp(31, 2, "consumare → ___ (persona, maschile)", "consumatore", "*Consumatore* = consumidor.")
fp(31, 3, "Laura oggi fa la ___ di formaggi di capra. (produrre)", "produttrice", "*-durre* → *-duttrice*: *produttrice*.")
fp(31, 4, "Il ___ dello studio le ha detto che avrebbe rovinato la carriera. (dirigere)", "direttore", "*Dirigere* → *direttore*, *direttrice*.")
fp(31, 5, "In Oltrepò molti ___ di capre fanno anche il formaggio. (allevare)", "allevatori", "*Allevatore* = criador (de animales); plural *allevatori*.")
fp(31, 6, "Al mercato di Voghera Laura fa la ___: vende i suoi formaggi. (vendere)", "venditrice", "*Venditore*, *venditrice* = vendedor, vendedora.")
cv(31, 1, "Per dodici anni Laura ha ___ l'avvocata d'affari.", "fatto", "*Fare* + profesión con artículo = ejercer: *fare l'avvocata*, *fare il medico*.")
cv(31, 2, "Sua madre avrebbe preferito che non ___ i ponti.", "bruciasse", "*Bruciare i ponti* = quemar las naves (cortar toda vuelta atrás).")
cv(31, 3, "I suoi genitori avevano ___ tanti sacrifici per farla studiare.", "fatto", "*Fare sacrifici*.")
cv(31, 4, "Nessuno racconta le notti passate a ___ i conti.", "fare", "*Fare i conti* = hacer las cuentas.")
cv(31, 5, "Avrei ___ un corso serio prima di partire.", "seguito", "*Seguire un corso* = hacer, cursar un curso.")
ce(31, 6, "Chi sogna di ___ vita dovrebbe diffidare dei giornali.", ["cambiare", "mutare", "scambiare"], "cambiare",
   "*Cambiare vita* = cambiar de vida. *Scambiare* es intercambiar o confundir.")
ce(31, 7, "Se me l'avessero detto dieci anni fa, gli avrei ___ in faccia.", ["riso", "sorriso", "deriso"], "riso",
   "*Ridere in faccia a qualcuno* = reírse en la cara de alguien.")
ce(31, 8, "Il capo le ha detto che avrebbe ___ una carriera brillante.", ["rovinato", "rotto", "guastato"], "rovinato",
   "*Rovinare una carriera* = arruinarla. *Rompere* es romper algo físico.")
ce(31, 9, "Sua madre avrebbe preferito un anno ___.", ["sabbatico", "sabbatino", "festivo"], "sabbatico",
   "*Un anno sabbatico* = un año sabático.")

# ------------------------------------------------------------------ 32
fp(32, 1, "somigliare → ___ (sostantivo)", "somiglianza", "*-are* → *-anza*: *somiglianza* (parecido).")
fp(32, 2, "appartenere → ___ (sostantivo)", "appartenenza", "*-ere* → *-enza*: *appartenenza* (pertenencia).")
fp(32, 3, "Quando ho ottenuto la ___ italiana, ho deciso di partire. (cittadino)", "cittadinanza", "*Cittadinanza* = ciudadanía.")
fp(32, 4, "Nel racconto si sente la ___ del nonno, anche se è morto. (presente)", "presenza", "*Presente* → *presenza* (presencia).")
fp(32, 5, "Il paese ignorava perfino l'___ dei parenti argentini. (esistere)", "esistenza", "*Esistere* → *esistenza*.")
fp(32, 6, "Molti emigranti hanno la ___ a idealizzare il paese d'origine. (tendere)", "tendenza", "*Tendere* → *tendenza* (tendencia).")
cv(32, 1, "Qualche anno dopo ho ___ la cittadinanza italiana.", "ottenuto", "*Ottenere la cittadinanza* = obtener la ciudadanía.")
cv(32, 2, "Nunziata mi ha ___ un caffè che non potevo rifiutare.", "offerto", "*Offrire un caffè* = invitar un café.")
cv(32, 3, "Nunziata ha ___ fuori una fotografia da un cassetto.", "tirato", "*Tirare fuori* = sacar.")
cv(32, 4, "Sull'autobus mi sono ___ conto che il nonno era rimasto un ragazzino.", "reso", "*Rendersi conto* = darse cuenta (participio *reso*).", alt=["resa"])
cv(32, 5, "Quando me l'ha detto, sono ___ in silenzio a lungo.", "rimasto", "*Rimanere* (o *restare*) *in silenzio*.", alt=["restato", "rimasta", "restata"])
ce(32, 6, "Le ho ___ una promessa: tornerò l'estate prossima.", ["fatto", "dato", "detto"], "fatto",
   "*Fare una promessa* = hacer una promesa.")
ce(32, 7, "La casa dei Mancuso era ___ dopo un terremoto.", ["crollata", "caduta", "rotta"], "crollata",
   "Un edificio *crolla* (se derrumba); *cadere* es caerse una persona o un objeto.")
ce(32, 8, "Io non ___ se fosse vero.", ["sapevo", "conoscevo", "capivo"], "sapevo",
   "*Sapere* + un dato o una frase (*se…*, *che…*); *conoscere* + una persona o un lugar.")
ce(32, 9, "Nelle giornate ___ si vedevano le luci della pianura.", ["limpide", "pulite", "trasparenti"], "limpide",
   "*Una giornata limpida* = un día despejado.")

# ------------------------------------------------------------------ 33
fp(33, 1, "prevedere → ___ (aggettivo)", "prevedibile", "*-ere* → *-ibile*: *prevedibile* (previsible).")
fp(33, 2, "raggiungere → ___ (aggettivo)", "raggiungibile", "*Raggiungibile* = alcanzable, accesible.")
fp(33, 3, "La proposta è ___ solo se il contratto è chiaro. (accettare)", "accettabile", "*-are* → *-abile*: *accettabile*.")
fp(33, 4, "Il silenzio del fidanzato è ___: ha paura di influenzarla. (comprendere)", "comprensibile", "*Comprendere* → *comprensibile*.")
fp(33, 5, "Un'azienda seria è un datore di lavoro ___. (affidare)", "affidabile", "*Affidabile* = confiable (no «afable»).")
fp(33, 6, "Due anni lontano da casa sono ___ se la coppia ne parla. (sostenere)", "sostenibili", "*Sostenibile* = sostenible, soportable; plural *sostenibili*.")
cv(33, 1, "Un'azienda di Milano le ha ___ un posto da responsabile acquisti.", "offerto", "*Offrire un posto* = ofrecer un puesto.")
cv(33, 2, "Pensavo che chi restava fermo ___ il treno.", "perdesse", "*Perdere il treno* = perder la oportunidad (literal y figurado).")
cv(33, 3, "Una parte del lavoro si può ___ a distanza.", "svolgere", "*Svolgere un lavoro* = realizar, desempeñar un trabajo.")
cv(33, 4, "Credo che la tua domanda ___ una risposta seria.", "meriti", "*Meritare una risposta*; acá en congiuntivo.")
cv(33, 5, "Prima di tutto, ti ___ una confessione.", "faccio", "*Fare una confessione*.")
ce(33, 6, "Chiedi che le condizioni siano ___ per iscritto.", ["messe", "poste", "fatte"], "messe",
   "*Mettere per iscritto* = poner por escrito.")
ce(33, 7, "Se non ne parlate adesso, ___ il rischio di ritrovarvi con un rancore.", ["correte", "prendete", "fate"], "correte",
   "*Correre il rischio* = correr el riesgo. «Prendere un rischio» es un calco del inglés que se oye, pero la forma italiana es *correre*.")
ce(33, 8, "Ho un contratto a tempo ___.", ["indeterminato", "indefinito", "illimitato"], "indeterminato",
   "*Contratto a tempo indeterminato* = contrato efectivo, sin fecha de fin; el otro es *a tempo determinato*.")
ce(33, 9, "Se decidi per paura, te ne ___.", ["pentirai", "pentirei", "penterai"], "pentirai",
   "*Pentirsene* = arrepentirse de algo: *te ne pentirai*, futuro de *pentirsi*.")

# ------------------------------------------------------------------ 34
fp(34, 1, "noia → ___ (aggettivo)", "noioso", "*-oso*: *noioso* (aburrido).")
fp(34, 2, "spazio → ___ (aggettivo)", "spazioso", "*Spazioso* = espacioso.")
fp(34, 3, "Per chi ha figli ogni ora libera diventa ___. (prezzo)", "preziosa", "*Prezioso* = valioso; concuerda con *ora*: *preziosa*.")
fp(34, 4, "Marco è un amico ___: si ricorda sempre dei compleanni. (affetto)", "affettuoso", "*Affetto* → *affettuoso* (cariñoso).")
fp(34, 5, "Non essere ___ dei suoi nuovi amici. (gelosia)", "geloso", "*Gelosia* → *geloso* (celoso).", alt=["gelosa"])
fp(34, 6, "Parla dei suoi figli con un tono ___. (orgoglio)", "orgoglioso", "*Orgoglio* → *orgoglioso*.")
cv(34, 1, "Gli amici sono diventati impegni da ___ in agenda.", "fissare", "*Fissare un appuntamento* (o *un impegno*) = arreglar una cita.", alt=["segnare"])
cv(34, 2, "Nessuno ha più il tempo di ___ questi rapporti.", "coltivare", "*Coltivare un'amicizia, un rapporto* = cultivarla.")
cv(34, 3, "Da adulti ogni incontro richiede che qualcuno ___ l'iniziativa.", "prenda", "*Prendere l'iniziativa*; acá en congiuntivo.")
cv(34, 4, "Bisogna smettere di ___ il conto delle telefonate.", "tenere", "*Tenere il conto* = llevar la cuenta.")
cv(34, 5, "Basta un messaggio, quello che ___ da mesi.", "rimandiamo", "*Rimandare* = postergar.")
ce(34, 6, "Qualcuno ___ una data che poi salta.", ["propone", "prepone", "impone"], "propone",
   "*Proporre una data* = proponer una fecha.")
ce(34, 7, "Sono amici su cui si può ___.", ["contare", "contrarre", "calcolare"], "contare",
   "*Contare su qualcuno* = contar con alguien (con *su*, no con *con*).")
ce(34, 8, "L'amicizia non è un conto in ___.", ["banca", "banco", "borsa"], "banca",
   "*Un conto in banca* = una cuenta bancaria. *Il banco* es el mostrador o el pupitre.")
ce(34, 9, "Quando si inizia una relazione ___, si vedono meno gli amici.", ["stabile", "stabilita", "statica"], "stabile",
   "*Una relazione stabile* = una pareja estable.")

# ------------------------------------------------------------------ 35
fp(35, 1, "smaltire → ___ (sostantivo)", "smaltimento", "*Smaltimento dei rifiuti* = eliminación de residuos.")
fp(35, 2, "trattare → ___ (sostantivo)", "trattamento", "*Trattamento* = tratamiento.")
fp(35, 3, "Il lago era citato nei rapporti sull'___. (inquinare)", "inquinamento", "*Inquinare* → *inquinamento* (contaminación).")
fp(35, 4, "Il fondale è stato salvato grazie all'___. (ossigenare)", "ossigenazione", "*Ossigenare* → *ossigenazione*.")
fp(35, 5, "Un impianto di ___ pulisce l'acqua. (depurare)", "depurazione", "*Depurare* → *depurazione*.")
fp(35, 6, "Il ___ globale rende le alghe più frequenti. (riscaldare)", "riscaldamento", "*Riscaldamento globale* = calentamiento global; *il riscaldamento* es también la calefacción.")
cv(35, 1, "La soluzione è stata ___ il lago a un consorzio.", "affidare", "*Affidare qualcosa a qualcuno* = confiárselo, encargárselo.")
cv(35, 2, "Con gli agricoltori abbiamo ___ approccio.", "cambiato", "*Cambiare approccio* = cambiar de enfoque.")
cv(35, 3, "Le perdite di reddito vengono ___ con un fondo comune.", "compensate", "*Compensare le perdite*; en pasiva concuerda con *perdite*.")
cv(35, 4, "Alcuni pesci aiutano a ___ l'equilibrio del lago.", "mantenere", "*Mantenere l'equilibrio*.")
cv(35, 5, "I risultati vanno ___ con onestà.", "comunicati", "*Comunicare i risultati*; *vanno comunicati* = tienen que comunicarse.")
ce(35, 6, "Non tutto è ___ liscio.", ["andato", "stato", "passato"], "andato",
   "*Andare liscio* = salir bien, sin problemas.")
ce(35, 7, "Sono state ___ assemblee pubbliche.", ["organizzate", "ordinate", "disposte"], "organizzate",
   "*Organizzare un'assemblea*.")
ce(35, 8, "Il consorzio ha ___ i cittadini a partecipare ai prelievi.", ["invitato", "offerto", "proposto"], "invitato",
   "*Invitare qualcuno a fare qualcosa*. *Offrire* y *proporre* no llevan a la persona como objeto directo.")
ce(35, 9, "Le rive venivano usate come discarica ___.", ["abusiva", "abusata", "abusante"], "abusiva",
   "*Abusivo* = ilegal, sin permiso: *discarica abusiva*, *costruzione abusiva*.")

# ------------------------------------------------------------------ 36
fp(36, 1, "comodo → ___ (contrario)", "scomodo", "*s-* niega: *scomodo* (incómodo).")
fp(36, 2, "occupato → ___ (contrario)", "disoccupato", "*Disoccupato* = desocupado, sin trabajo.")
fp(36, 3, "Sulle scale si incontrano persone ___ che chiedono la password. (conosciute)", "sconosciute", "*Sconosciuto* = desconocido.")
fp(36, 4, "Molti palazzi del centro sono ormai ___ d'inverno. (abitati)", "disabitati", "*Disabitato* = deshabitado.")
fp(36, 5, "Tra i residenti cresce la ___ verso il Comune. (fiducia)", "sfiducia", "*Sfiducia* = desconfianza.")
fp(36, 6, "Nel condominio c'è un gran ___: sacchi della spazzatura ovunque. (ordine)", "disordine", "*Disordine* = desorden.")
cv(36, 1, "Si litiga per il rumore e si ___ pace sulle scale.", "fa", "*Fare pace* = hacer las paces.")
cv(36, 2, "Le chiavi si ___ in una cassetta metallica.", "ritirano", "*Ritirare le chiavi* = retirar las llaves.")
cv(36, 3, "Molti affittano una stanza per ___ un reddito modesto.", "integrare", "*Integrare un reddito* = complementarlo.")
cv(36, 4, "In ogni città si dovrà ___ un equilibrio diverso.", "trovare", "*Trovare un equilibrio*.")
cv(36, 5, "Non si può più ___ finta di niente.", "fare", "*Fare finta di niente* = hacer como si nada.")
ce(36, 6, "Le scuole del centro ___ iscritti.", ["perdono", "mancano", "lasciano"], "perdono",
   "*Perdere iscritti* = perder alumnos (o socios).")
ce(36, 7, "Gli affitti per chi lavora in città ___.", ["salgono", "montano", "alzano"], "salgono",
   "Los precios *salgono* o *aumentano*; *alzare* necesita objeto (*alzare i prezzi*).")
ce(36, 8, "Si ___ il campanello e non risponde nessuno.", ["suona", "tocca", "batte"], "suona",
   "*Suonare il campanello* = tocar el timbre. «Tocar» un instrumento también es *suonare*.")
ce(36, 9, "Un provvedimento così ___ colpirebbe anche le famiglie.", ["drastico", "drammatico", "dritto"], "drastico",
   "*Un provvedimento drastico* = una medida drástica.")

# ------------------------------------------------------------------ 37
fp(37, 1, "ottimismo → ___ (persona)", "ottimista", "*-ismo* → *-ista*: *ottimista*.")
fp(37, 2, "attivismo → ___ (persona)", "attivista", "*Attivista* = activista.")
fp(37, 3, "Nel 1946 molte donne votarono senza sentirsi ___. (femminismo)", "femministe", "*Femminista*, plural femenino *femministe*.")
fp(37, 4, "Rosa era una ___: pensava sempre di aver sbagliato. (pessimismo)", "pessimista", "*Pessimista*: la misma forma para los dos géneros.")
fp(37, 5, "Oggi in quel paese arrivano più ___ che elettori. (turismo)", "turisti", "*Turista*, plural masculino *turisti*.")
fp(37, 6, "Teresa guardava il futuro con ___. (ottimista)", "ottimismo", "Al revés: de la persona a la idea, *ottimismo*.")
cv(37, 1, "Teresa entrò nella cabina e ___ la tenda.", "tirò", "*Tirare la tenda* = correr la cortina (passato remoto: *tirò*).")
cv(37, 2, "Il parroco aveva ___ le istruzioni dal pulpito.", "dato", "*Dare istruzioni*.")
cv(37, 3, "Un uomo, passando, ___ una battuta sulle donne.", "fece", "*Fare una battuta* = hacer un chiste, un comentario (passato remoto: *fece*).")
cv(37, 4, "Davanti alla scuola le donne ___ la fila per ore.", "facevano", "*Fare la fila* = hacer la cola.")
cv(37, 5, "La donna le ___ la mano e la tenne stretta.", "prese", "*Prendere la mano* = tomar de la mano (passato remoto: *prese*).")
ce(37, 6, "Teresa ___ il suo segno e piegò la scheda.", ["fece", "disse", "diede"], "fece",
   "*Fare un segno* (en la boleta) = marcar.")
ce(37, 7, "Il seggio era stato ___ nella scuola elementare.", ["allestito", "montato", "vestito"], "allestito",
   "*Allestire* = armar, preparar (una mesa electoral, una muestra, un escenario).")
ce(37, 8, "Quando toccò a lei, le ___ le mani.", ["tremavano", "tremolavano", "scuotevano"], "tremavano",
   "*Tremare* = temblar. *Tremolare* es titilar (una luz, una llama).")
ce(37, 9, "Nel cassetto trovammo il certificato ___ di quel giorno.", ["elettorale", "elettivo", "elettrico"], "elettorale",
   "*Certificato elettorale*, *campagna elettorale*, *legge elettorale*.")

# ------------------------------------------------------------------ 38
fp(38, 1, "fare → ___ (di nuovo)", "rifare", "*ri-* = otra vez: *rifare* (rehacer, volver a hacer).")
fp(38, 2, "partire → ___ (di nuovo)", "ripartire", "*Ripartire* = volver a salir, volver a arrancar.")
fp(38, 3, "Dopo cinque anni il bar ha ___ tutti i giorni. (aprire)", "riaperto", "*Riaprire*, participio *riaperto*.")
fp(38, 4, "Un paese non si ___ soltanto con gli incentivi. (popolare)", "ripopola", "*Ripopolare* = repoblar.")
fp(38, 5, "La sindaca ha ___ la gente in montagna. (portare)", "riportato", "*Riportare* = traer de vuelta.")
fp(38, 6, "Dopo il terremoto la scuola è stata ___ in un anno. (costruire)", "ricostruita", "*Ricostruire* = reconstruir; en pasiva concuerda con *scuola*.")
cv(38, 1, "Dopo l'elezione aveva ___ un giro per le case vuote.", "fatto", "*Fare un giro* = dar una vuelta.")
cv(38, 2, "Si era ___ conto che le case vuote erano più di cento.", "resa", "*Rendersi conto*; la sindaca → *resa*.")
cv(38, 3, "I nuovi abitanti si erano ___ a ristrutturare le case.", "impegnati", "*Impegnarsi a* + infinitivo = comprometerse a.")
cv(38, 4, "Aveva già scritto alla Regione per ___ un sostegno.", "chiedere", "*Chiedere un sostegno* = pedir apoyo.")
cv(38, 5, "La finestra dell'ufficio ___ sulla valle.", "dà", "*Dare su* = dar a (una ventana, un balcón).")
ce(38, 6, "La scuola elementare stava per ___.", ["chiudere", "finire", "smettere"], "chiudere",
   "Una escuela o un negocio *chiude* (cierra); *finire* y *smettere* son terminar y dejar de hacer algo.")
ce(38, 7, "Qualcuno aveva scritto una lettera ___ alla prefettura.", ["anonima", "sconosciuta", "ignota"], "anonima",
   "*Una lettera anonima* = una carta anónima (sin firma).")
ce(38, 8, "In cinque anni tre famiglie se n'erano ___.", ["andate", "uscite", "partite"], "andate",
   "*Andarsene* = irse: *se n'erano andate*.")
ce(38, 9, "L'ufficio aveva una stufa a ___.", ["legna", "legno", "legname"], "legna",
   "*La legna* es la leña para quemar; *il legno*, la madera como material.")

# ------------------------------------------------------------------ 40
fp(40, 1, "capace → ___ (contrario)", "incapace", "*in-*: *incapace*.")
fp(40, 2, "leggibile → ___ (contrario)", "illeggibile", "Ante *l*, *in-* se vuelve *il-*: *illeggibile*, con doble *l*.")
fp(40, 3, "Dopo tre visite all'ufficio ero ancora ___ del risultato. (soddisfatto)", "insoddisfatto", "*Insoddisfatto* = insatisfecho.", alt=["insoddisfatta"])
fp(40, 4, "La prima risposta sembrava ___, ma non era definitiva. (giusta)", "ingiusta", "*Ingiusto* = injusto.")
fp(40, 5, "Le traduzioni fatte a Buenos Aires erano ___. (sufficienti)", "insufficienti", "*Insufficiente* = insuficiente.")
fp(40, 6, "Non essere ___: la residenza arriverà. (paziente)", "impaziente", "Ante *p*, *im-*: *impaziente*.")
cv(40, 1, "Si va all'ufficio e si ___ un modulo.", "compila", "*Compilare un modulo* = llenar un formulario.")
cv(40, 2, "Per ___ un conto mi hanno fatto firmare diciassette fogli.", "aprire", "*Aprire un conto*.")
cv(40, 3, "Fatevi ___ sempre una ricevuta.", "rilasciare", "*Rilasciare una ricevuta* (un documento, un permiso) = extenderlo, emitirlo.")
cv(40, 4, "Il servizio online per ___ gli appuntamenti è rapido.", "prenotare", "*Prenotare un appuntamento* = sacar turno.")
cv(40, 5, "Alcuni impiegati ti fanno ___ la pazienza.", "perdere", "*Perdere la pazienza*.")
ce(40, 6, "La seconda volta non ho dovuto ___ la fila.", ["rifare", "ripetere", "ritornare"], "rifare",
   "*Rifare la fila* = volver a hacer la cola.")
ce(40, 7, "Ho dovuto ___ tradurre i documenti da un traduttore giurato.", ["far", "lasciar", "mettere"], "far",
   "Encargar un trabajo: *far tradurre* (causativo). *Lasciar tradurre* sería permitir que alguien traduzca.")
ce(40, 8, "L'impiegata mi ha ___ notare che il cognome era diverso.", ["fatto", "dato", "messo"], "fatto",
   "*Fare notare* = hacer notar, señalar.")
ce(40, 9, "Le traduzioni vanno fatte da un traduttore ___.", ["giurato", "giuridico", "giurista"], "giurato",
   "*Traduttore giurato* = traductor público (que presta juramento en el tribunal).")

# ------------------------------------------------------------------ 41
fp(41, 1, "respirare → ___ (sostantivo)", "respiro", "Sustantivo sin sufijo: *il respiro*.")
fp(41, 2, "ricoverare → ___ (sostantivo)", "ricovero", "*Ricovero* = internación.")
fp(41, 3, "I vigili del fuoco hanno ordinato l'___ del palazzo. (evacuare)", "evacuazione", "*Evacuare* → *evacuazione*.")
fp(41, 4, "L'___ dei vigili del fuoco è durato un'ora. (intervenire)", "intervento", "*Intervenire* → *l'intervento*.")
fp(41, 5, "Secondo i primi ___, l'incendio è partito da una stufetta. (accertare)", "accertamenti", "*Accertamento* = verificación, pericia; plural *accertamenti*.")
fp(41, 6, "Il ___ dell'anziano è stato merito di un ragazzo. (salvare)", "salvataggio", "*Salvare* → *salvataggio* (rescate), con *-aggio*.")
cv(41, 1, "Samuele ha ___ il numero di emergenza.", "chiamato", "*Chiamare il numero di emergenza* (el 112).")
cv(41, 2, "L'incendio è stato ___ in circa un'ora.", "domato", "*Domare un incendio* = controlarlo, extinguirlo.", alt=["spento"])
cv(41, 3, "Gli altri appartamenti hanno ___ solo danni da fumo.", "riportato", "*Riportare danni* = sufrir daños.")
cv(41, 4, "I vicini fanno una raccolta per ___ in sesto la casa.", "rimettere", "*Rimettere in sesto* = poner en condiciones, arreglar.")
cv(41, 5, "Anche Loredana vuole ___ la sua.", "dire", "*Dire la sua* = dar su opinión.")
ce(41, 6, "L'anziano è stato ___ ieri pomeriggio dall'ospedale.", ["dimesso", "dismesso", "licenziato"], "dimesso",
   "*Dimettere* (dall'ospedale) = dar de alta. *Dismesso* = abandonado, fuera de uso; *licenziato* = despedido.")
ce(41, 7, "Le stufette non vanno mai lasciate ___ di notte.", ["accese", "illuminate", "incendiate"], "accese",
   "*Lasciare acceso* = dejar prendido.")
ce(41, 8, "Una signora con il gatto non voleva ___ di allontanarsi.", ["saperne", "sentirne", "capirne"], "saperne",
   "*Non volerne sapere* = no querer saber nada (de algo).")
ce(41, 9, "L'anziano ha avuto un'intossicazione ___.", ["lieve", "leggiadra", "lenta"], "lieve",
   "*Lieve* = leve (una herida, una intoxicación). *Leggiadro* es grácil, elegante.")

# ------------------------------------------------------------------ 42
fp(42, 1, "versare → ___ (sostantivo)", "versamento", "*Versamento* = depósito, pago (en una cuenta).")
fp(42, 2, "richiedere → ___ (sostantivo)", "richiesta", "*Richiesta* = solicitud, pedido.")
fp(42, 3, "Si procederà all'___ del servizio pomeridiano. (interrompere)", "interruzione", "*Interrompere* → *interruzione*.")
fp(42, 4, "Il Comune ha preso un ___ contro i rumori notturni. (provvedere)", "provvedimento", "*Provvedimento* = medida, disposición.")
fp(42, 5, "Dopo un mese è arrivato un ___ di pagamento. (sollecitare)", "sollecito", "*Sollecito* = recordatorio de algo vencido.")
fp(42, 6, "L'orario di ___ del pubblico è cambiato. (ricevere)", "ricevimento", "*Orario di ricevimento* = horario de atención.")
cv(42, 1, "Si invita a ___ al pagamento entro il termine indicato.", "provvedere", "*Provvedere a* = encargarse de, efectuar (burocrático).")
cv(42, 2, "Il funzionario ___ conto soprattutto delle conseguenze legali.", "tiene", "*Tenere conto di* = tener en cuenta.")
cv(42, 3, "Nessuno ha mai osato ___ in discussione quelle formule.", "mettere", "*Mettere in discussione* = cuestionar.")
cv(42, 4, "Molti si ___ a intermediari a pagamento.", "rivolgono", "*Rivolgersi a* = dirigirse a, recurrir a.")
cv(42, 5, "Scrivere semplice richiede di ___ la responsabilità di ciò che si dice.", "assumersi", "*Assumersi la responsabilità* = hacerse responsable.", alt=["prendersi"])
ce(42, 6, "Si ___ noto all'utenza che l'ufficio è chiuso il pomeriggio.", ["rende", "fa", "mette"], "rende",
   "*Rendere noto* = dar a conocer (fórmula burocrática).")
ce(42, 7, "Molti uffici si sono ___ alle nuove indicazioni per qualche mese.", ["attenuti", "tenuti", "mantenuti"], "attenuti",
   "*Attenersi a* = atenerse a (instrucciones, reglas).")
ce(42, 8, "Forse l'antilingua ha cominciato a perdere ___.", ["terreno", "campo", "suolo"], "terreno",
   "*Perdere terreno* = perder terreno, retroceder.")
ce(42, 9, "Il burocratese abusa dei verbi ___: effettuare, procedere, provvedere.", ["generici", "generali", "generosi"], "generici",
   "*Generico* = vago, poco preciso; *generale* = general.")

# ------------------------------------------------------------------ 43
fp(43, 1, "proporre → ___ (sostantivo)", "proposta", "Del participio *proposto* → *la proposta*.")
fp(43, 2, "modificare → ___ (sostantivo)", "modifica", "Verbo sin terminación: *la modifica*.")
fp(43, 3, "Bisogna distinguere una ___ seria da una notizia gonfiata. (scoprire)", "scoperta", "*Scoprire* → *scoperto* → *la scoperta*.")
fp(43, 4, "La scienza procede per ___. (confermare)", "conferme", "*La conferma*, plural *le conferme*.")
fp(43, 5, "Il titolo prometteva una ___ semplice a una domanda difficile. (rispondere)", "risposta", "*Rispondere* → *risposto* → *la risposta*.")
fp(43, 6, "Prima di condividere, una ___ richiede pochi minuti. (verificare)", "verifica", "*Verificare* → *la verifica*.")
cv(43, 1, "Mangiare cioccolato aiuta davvero a ___ peso?", "perdere", "*Perdere peso* = bajar de peso; *prendere peso* = subir.")
cv(43, 2, "Basta prendere l'abitudine di ___ qualche domanda.", "porsi", "*Porsi una domanda* = hacerse una pregunta.", alt=["farsi"])
cv(43, 3, "Per non ___ nella trappola non serve essere scienziati.", "cadere", "*Cadere nella trappola* = caer en la trampa.")
cv(43, 4, "Uno studio ___ su venti volontari vale poco.", "condotto", "*Condurre uno studio* = hacer, llevar a cabo un estudio.", alt=["fatto"])
cv(43, 5, "A ___ il prezzo della confusione sono i lettori.", "pagare", "*Pagare il prezzo* (de algo).")
ce(43, 6, "Da venti volontari non si possono ___ conclusioni.", ["trarre", "tirare", "togliere"], "trarre",
   "*Trarre conclusioni* = sacar conclusiones. *Tirare* es tirar o estirar.")
ce(43, 7, "Chi ha imparato a dubitare sa ___ il valore di un consenso solido.", ["riconoscere", "conoscere", "sapere"], "riconoscere",
   "*Riconoscere il valore* = reconocer el valor.")
ce(43, 8, "Molti ricercatori ___ le braccia, rassegnati.", ["allargano", "aprono", "stendono"], "allargano",
   "*Allargare le braccia* es el gesto de resignación («¿qué le vamos a hacer?»); *aprire le braccia* es recibir a alguien.")
ce(43, 9, "Il titolo era una notizia ___.", ["gonfiata", "gonfia", "inflazionata"], "gonfiata",
   "*Una notizia gonfiata* = exagerada. *Inflazionato* = muy trillado, devaluado.")

# ------------------------------------------------------------------ 44
fp(44, 1, "stabile → ___ (sostantivo)", "stabilità", "*-bile* → *-bilità*: *stabilità*.")
fp(44, 2, "umido → ___ (sostantivo)", "umidità", "*Umidità* = humedad.")
fp(44, 3, "I laboratori si trovano a millequattrocento metri di ___. (profondo)", "profondità", "*Profondo* → *profondità*.")
fp(44, 4, "Servono strumenti di grande ___ per registrare un neutrino. (sensibile)", "sensibilità", "*Sensibile* → *sensibilità*.")
fp(44, 5, "Anche la debolissima ___ di un bullone disturba le misure. (radioattivo)", "radioattività", "*Radioattivo* → *radioattività*.")
fp(44, 6, "La ___ degli esperimenti richiede decine di università. (complesso)", "complessità", "*Complesso* → *complessità*.")
cv(44, 1, "La roccia ___ da scudo contro i raggi cosmici.", "fa", "*Fare da* + sustantivo = hacer de, servir como.")
cv(44, 2, "Altri gruppi ___ la caccia alla materia oscura.", "danno", "*Dare la caccia a* = perseguir, salir a buscar.")
cv(44, 3, "Molti ricercatori raccontano di ___ la cognizione del tempo.", "perdere", "*Perdere la cognizione del tempo* = perder la noción del tiempo.")
cv(44, 4, "Le università si ___ compiti e spese.", "dividono", "*Dividersi i compiti* = repartirse las tareas.")
cv(44, 5, "Gli abitanti hanno ___ garanzie sulla sicurezza delle falde.", "chiesto", "*Chiedere garanzie*.")
ce(44, 6, "Le tecnologie finiscono per ___ applicazioni in medicina.", ["trovare", "incontrare", "scoprire"], "trovare",
   "*Trovare applicazione* = tener aplicación, usarse.")
ce(44, 7, "Esperimenti progettati quindici anni fa stanno ___ i primi risultati.", ["dando", "facendo", "portando"], "dando",
   "*Dare risultati* = dar resultados.")
ce(44, 8, "Chiara non si ___ alla domanda.", ["sottrae", "toglie", "ritira"], "sottrae",
   "*Sottrarsi a una domanda* = esquivarla, no contestarla.")
ce(44, 9, "Il Gran Sasso ospita una ricerca di ___.", ["punta", "vertice", "cima"], "punta",
   "*Di punta* = de vanguardia, de primer nivel.")

# ------------------------------------------------------------------ 45
fp(45, 1, "amico → ___ (aggettivo)", "amichevole", "*-evole*: *amichevole* (amistoso); también *una partita amichevole*.")
fp(45, 2, "ragione → ___ (aggettivo)", "ragionevole", "*Ragionevole* = razonable.")
fp(45, 3, "Quando dice «non prendertela», sta per dirti qualcosa di ___. (spiacere)", "spiacevole", "*Spiacevole* = desagradable.")
fp(45, 4, "Chi se la prende soffre con tutti tranne che con il ___. (colpa)", "colpevole", "*Colpevole* = culpable.")
fp(45, 5, "Una cena in famiglia può essere molto ___. (piacere)", "piacevole", "*Piacevole* = agradable.")
fp(45, 6, "Il capo si è detto ___ alla proposta. (favore)", "favorevole", "*Essere favorevole a* = estar a favor de.")
cv(45, 1, "Ti ho ___ una risposta seria, o quasi.", "dato", "*Dare una risposta*.")
cv(45, 2, "Se ne va ___ la porta.", "sbattendo", "*Sbattere la porta* = dar un portazo; acá en gerundio.")
cv(45, 3, "Rispondendo così, difficilmente ___ carriera.", "farai", "*Fare carriera*.")
cv(45, 4, "Quando la padroneggerai, ti ___ finalmente a casa.", "sentirai", "*Sentirsi a casa* = sentirse en casa.")
cv(45, 5, "Nessuno ti ___ spiegazioni.", "chiederà", "*Chiedere spiegazioni* = pedir explicaciones.")
ce(45, 6, "Tutti fanno ___ che le regole non ci siano.", ["finta", "finzione", "falso"], "finta",
   "*Fare finta che* + congiuntivo = hacer como si.")
ce(45, 7, "Da noi ci si offende con ___ creatività.", ["discreta", "discorde", "distinta"], "discreta",
   "*Discreto* = bastante, considerable (*una discreta somma*); también «discreto».")
ce(45, 8, "Questa coppia di verbi ti farà ___.", ["impazzire", "impazzare", "pazziare"], "impazzire",
   "*Far impazzire* = volver loco. *Impazzare* es desatarse (una moda, una fiesta).")
ce(45, 9, "Se chiedi a un chirurgo di ___ come va col bisturi…", ["fama", "fame", "famoso"], "fama",
   "*Di fama* = famoso, de renombre. *Fame* es hambre.")

# ------------------------------------------------------------------ 46
fp(46, 1, "gatto → ___ (diminutivo)", "gattino", "*-ino*: *gattino* (y no «gattetto»).")
fp(46, 2, "porta → ___ (la porta grande di un palazzo)", "portone", "*-one* vuelve masculino al femenino: *il portone*.")
fp(46, 3, "palla → ___ (la palla del calcio)", "pallone", "*Il pallone*: alterado lexicalizado.")
fp(46, 4, "giallo → ___ (un colore sporco, poco gradevole)", "giallastro", "*-astro* con colores = aproximado y poco agradable.")
fp(46, 5, "dolce → ___ (un sapore dolce e sgradevole)", "dolciastro", "*Dolciastro* = empalagoso, dulzón.")
fp(46, 6, "poeta → ___ (un cattivo poeta)", "poetastro", "*-astro* con personas = despectivo.")
cv(46, 1, "Le sfumature ___ in difficoltà chi impara.", "mettono", "*Mettere in difficoltà* = poner en aprietos.")
cv(46, 2, "Il diminutivo serve ad ___ una richiesta.", "attenuare", "*Attenuare* = suavizar, atenuar.")
cv(46, 3, "Una «domandina» promette di ___ poco tempo.", "rubare", "*Rubare tempo* = robar tiempo.")
cv(46, 4, "I peggiorativi ___ disprezzo o un giudizio negativo.", "esprimono", "*Esprimere disprezzo*.")
cv(46, 5, "Il consiglio che ___ ai miei studenti è di non inventare alterati.", "do", "*Dare un consiglio*.")
ce(46, 6, "Usarli bene è un traguardo che va ben ___ la grammatica.", ["oltre", "sopra", "fuori"], "oltre",
   "*Andare oltre* = ir más allá.")
ce(46, 7, "Il diminutivo può diventare ironico o perfino ___.", ["sprezzante", "disprezzato", "prezzante"], "sprezzante",
   "*Sprezzante* = despectivo, desdeñoso.")
ce(46, 8, "Se un collega chiama il progetto «un lavoretto», forse lo sta ___.", ["sminuendo", "diminuendo", "rimpicciolendo"], "sminuendo",
   "*Sminuire* = restar valor, menospreciar; *diminuire* es disminuir una cantidad.")
ce(46, 9, "«Ragazzone» ha spesso una sfumatura ___.", ["bonaria", "buona", "benigna"], "bonaria",
   "*Bonario* = afable, bonachón.")

# ------------------------------------------------------------------ 47
fp(47, 1, "finanziare → ___ (sostantivo)", "finanziamento", "*-mento*: *finanziamento*.")
fp(47, 2, "rallentare → ___ (sostantivo)", "rallentamento", "*Rallentamento* = desaceleración, demora.")
fp(47, 3, "Il fondo copre dodici mensilità in caso di mancato ___. (pagare)", "pagamento", "*Mancato pagamento* = falta de pago.")
fp(47, 4, "Per uno ___ servono in media diciotto mesi. (sfrattare)", "sfratto", "Sin sufijo: *lo sfratto* (desalojo).")
fp(47, 5, "Chi vive in periferia perde un'ora al giorno negli ___. (spostare)", "spostamenti", "*Spostamento* = traslado, viaje; plural *spostamenti*.")
fp(47, 6, "I canoni sono quasi raddoppiati: un ___ del novanta per cento. (aumentare)", "aumento", "Sin sufijo: *l'aumento*.")
cv(47, 1, "Federica ___ con altre due ragazze un trilocale in periferia.", "divide", "*Dividere un appartamento* = compartirlo.", alt=["condivide"])
cv(47, 2, "Il rapporto è stato ___ ieri dall'Osservatorio.", "presentato", "*Presentare un rapporto*.")
cv(47, 3, "Per la prima volta ___ sul tavolo risorse vere.", "mettiamo", "*Mettere sul tavolo* = poner sobre la mesa.")
cv(47, 4, "Le associazioni dei proprietari ___ l'idea.", "respingono", "*Respingere un'idea* = rechazarla.")
cv(47, 5, "Federica, intanto, ___ i conti.", "fa", "*Fare i conti* = hacer cuentas.")
ce(47, 6, "Un quarto dei nuovi assunti ha ___ al posto.", ["rinunciato", "rifiutato", "lasciato"], "rinunciato",
   "*Rinunciare a* + algo; *rifiutare* y *lasciare* van sin *a* (*ha rifiutato il posto*).")
ce(47, 7, "Il canone è di 780 euro al mese, spese ___.", ["escluse", "eccetto", "tolte"], "escluse",
   "*Spese escluse* = expensas aparte; *spese incluse* = con expensas.")
ce(47, 8, "Il sindaco, al secondo ___, ha annunciato un piano.", ["mandato", "mandamento", "comando"], "mandato",
   "*Mandato* = mandato, período de gobierno.")
ce(47, 9, "Un fondo aiuta chi affitta a canone ___.", ["concordato", "accordato", "concordante"], "concordato",
   "*Canone concordato* = alquiler con un tope acordado entre propietarios e inquilinos.")

# ------------------------------------------------------------------ 48
fp(48, 1, "dialetto → ___ (aggettivo)", "dialettale", "*-ale*: *dialettale*.")
fp(48, 2, "Napoli → ___ (aggettivo)", "napoletano", "*Napoletano*, con minúscula.")
fp(48, 3, "Un ___ e un palermitano usano la stessa grammatica. (Milano)", "milanese", "*-ese*: *milanese*.")
fp(48, 4, "Sono italiani ___, perfettamente legittimi. (regione)", "regionali", "*Regionale*, plural *regionali*.")
fp(48, 5, "Il mio accento ___ l'ho perso in sei mesi. (Calabria)", "calabrese", "*Calabrese*.")
fp(48, 6, "La televisione ha diffuso una lingua ___. (nazione)", "nazionale", "*Nazionale*.")
cv(48, 1, "La maestra puniva chi si ___ scappare una parola in dialetto.", "lasciava", "*Lasciarsi scappare* = dejar escapar, soltar.")
cv(48, 2, "Giorgia usa il dialetto per ___ ridere gli amici.", "far", "*Far ridere* = hacer reír.", alt=["fare"])
cv(48, 3, "Mia madre mi ___ in giro: dice che parlo come un telegiornale.", "prende", "*Prendere in giro* = cargar, burlarse.")
cv(48, 4, "La dislocazione serve a ___ in primo piano il tema.", "mettere", "*Mettere in primo piano*.")
cv(48, 5, "Alcune parole nuove ___ nei dizionari.", "entrano", "*Entrare nei dizionari*.")
ce(48, 6, "Ci sono rapper che il dialetto l'hanno ___ in classifica.", ["portato", "messo", "fatto"], "portato",
   "*Portare in classifica* = llevar a los rankings.")
ce(48, 7, "Certe cose, in italiano, non ___.", ["rendono", "danno", "fanno"], "rendono",
   "*Rendere* = transmitir el mismo efecto (una traducción, una expresión).")
ce(48, 8, "Il dialetto non è più la lingua della ___.", ["vergogna", "imbarazzo", "pudore"], "vergogna",
   "*Della* pide un femenino: *la vergogna*. *Imbarazzo* y *pudore* son masculinos.")
ce(48, 9, "Qualcuno teme che il dialetto diventi un folklore da ___.", ["cartolina", "cartella", "carta"], "cartolina",
   "*Da cartolina* = de postal: lindo pero artificial.")

# ------------------------------------------------------------------ 49
fp(49, 1, "consapevole → ___ (sostantivo)", "consapevolezza", "*-ezza*: *consapevolezza* (conciencia, conocimiento).")
fp(49, 2, "astenersi → ___ (sostantivo)", "astensione", "*Astensione* = abstención.")
fp(49, 3, "Il secondo argomento riguarda la ___ dell'ordinamento. (coerente)", "coerenza", "*Coerente* → *coerenza*.")
fp(49, 4, "Si dice che a sedici anni manchi la ___ necessaria. (maturo)", "maturità", "*Maturo* → *maturità* (también el examen final de la secundaria).")
fp(49, 5, "Oggi la ___ dei giovani è sbilanciata. (rappresentare)", "rappresentanza", "*Rappresentanza* = representación política.")
fp(49, 6, "Ogni ___ di opinione non deve diventare uno scontro. (divergere)", "divergenza", "*Divergere* → *divergenza*.")
cv(49, 1, "Da mesi si discute se ___ il diritto di voto ai sedicenni.", "estendere", "*Estendere un diritto* = extenderlo.")
cv(49, 2, "Occorre ___ il campo da un equivoco diffuso.", "sgombrare", "*Sgombrare il campo* = despejar el terreno.")
cv(49, 3, "A sedici anni si possono ___ responsabilità di rilievo.", "assumere", "*Assumere responsabilità* = asumir responsabilidades.")
cv(49, 4, "Alcuni paesi hanno già ___ questa soluzione.", "adottato", "*Adottare una soluzione*.")
cv(49, 5, "Quanta fiducia siamo disposti ad ___ alle nuove generazioni?", "accordare", "*Accordare fiducia* = otorgar confianza.", alt=["concedere", "dare"])
ce(49, 6, "L'opposizione ha ___ molte obiezioni alla riforma.", ["sollevato", "alzato", "levato"], "sollevato",
   "*Sollevare obiezioni* (o *dubbi*) = plantearlos.")
ce(49, 7, "Il governo ha ___ una proposta di legge.", ["avanzato", "anticipato", "avviato"], "avanzato",
   "*Avanzare una proposta* = presentar, plantear una propuesta.")
ce(49, 8, "A sedici anni si è in grado di ___ scelte consapevoli?", ["compiere", "compire", "finire"], "compiere",
   "*Compiere una scelta* (registro alto) = tomar una decisión; también *fare una scelta*.")
ce(49, 9, "È un argomento più ___ di quanto sembri.", ["fragile", "frangibile", "fracassato"], "fragile",
   "*Un argomento fragile* = un argumento débil.")

# ------------------------------------------------------------------ 50
fp(50, 1, "scrivere → ___ (persona, femminile)", "scrittrice", "*Scrittore*, *scrittrice*.")
fp(50, 2, "narrare → ___ (persona, maschile)", "narratore", "*Narratore* = narrador.")
fp(50, 3, "Una giovane ___ ha tradotto il romanzo. (tradurre)", "traduttrice", "*-durre* → *-duttrice*.")
fp(50, 4, "Se traduco parola per parola, il ___ argentino non ride. (leggere)", "lettore", "*Leggere* → *lettore* (lector).")
fp(50, 5, "L'___ ha deciso di ripubblicare Lessico famigliare. (edizione)", "editore", "*Editore* = quien publica, la editorial.")
fp(50, 6, "Un'___ ha disegnato la copertina. (illustrare)", "illustratrice", "*Illustratore*, *illustratrice*.")
cv(50, 1, "Un vecchio professore mi ___ in guardia.", "mise", "*Mettere in guardia* = poner sobre aviso (passato remoto: *mise*).", alt=["ha messo"])
cv(50, 2, "Questi tranelli si imparano dopo aver ___ una figuraccia.", "fatto", "*Fare una figuraccia* = quedar mal.")
cv(50, 3, "Le lingue più vicine ___ gelosamente i loro segreti.", "custodiscono", "*Custodire un segreto* = guardarlo.")
cv(50, 4, "Il traduttore deve ___ tutte queste voci senza appiattirle.", "rendere", "*Rendere* = reproducir en la traducción.")
cv(50, 5, "Quando un giovane collega mi ___ un consiglio, ripeto la frase del professore.", "chiede", "*Chiedere un consiglio*.")
ce(50, 6, "Tradurre Calvino è come camminare su un ___.", ["filo", "cavo", "fino"], "filo",
   "*Camminare su un filo* = caminar por la cornisa.")
ce(50, 7, "Così si rischia di ___ all'autore un ottimismo che non ha.", ["attribuire", "distribuire", "contribuire"], "attribuire",
   "*Attribuire qualcosa a qualcuno* = atribuírselo.")
ce(50, 8, "Ogni falso amico ___ è una piccola scoperta.", ["smascherato", "mascherato", "scoperchiato"], "smascherato",
   "*Smascherare* = desenmascarar.")
ce(50, 9, "La confidenza è il suo pericolo ___.", ["principale", "principesco", "principiante"], "principale",
   "*Principale* = principal.")

# ------------------------------------------------------------------ 51
fp(51, 1, "flessibile → ___ (sostantivo)", "flessibilità", "*-bile* → *-bilità*.")
fp(51, 2, "assumere → ___ (sostantivo)", "assunzione", "*Assunzione* = contratación.")
fp(51, 3, "Per ridurre le ore senza perdere ___, l'azienda ha cambiato abitudini. (efficiente)", "efficienza", "*Efficiente* → *efficienza*.")
fp(51, 4, "La ___ è cresciuta del quattro per cento. (produttivo)", "produttività", "*Produttivo* → *produttività*.")
fp(51, 5, "In manutenzione la ___ delle urgenze è complicata. (gestire)", "gestione", "*Gestire* → *gestione*.")
fp(51, 6, "Il primo fattore è la ___: le squadre hanno eliminato i tempi morti. (concentrarsi)", "concentrazione", "*Concentrarsi* → *concentrazione*.")
cv(51, 1, "La sperimentazione è stata ___ con i sindacati.", "concordata", "*Concordare con* = acordar con.")
cv(51, 2, "Si è dovuto ___ a un sistema di reperibilità.", "ricorrere", "*Ricorrere a* = recurrir a.")
cv(51, 3, "Il venerdì Luca ___ le commissioni che prima rimandava.", "sbriga", "*Sbrigare le commissioni* = hacer los trámites, los mandados.")
cv(51, 4, "Anche i clienti si sono dovuti ___.", "ricredere", "*Ricredersi* = cambiar de opinión.")
cv(51, 5, "Una fabbrica di provincia ___ in discussione questa tendenza.", "rimette", "*Rimettere in discussione* = volver a cuestionar.")
ce(51, 6, "Nessuno si era mai preso la ___ di misurare i tempi morti.", ["briga", "brigata", "noia"], "briga",
   "*Prendersi la briga di* = tomarse la molestia de.")
ce(51, 7, "Dieci anni fa l'avrebbero ___ alla porta.", ["accompagnato", "portato", "guidato"], "accompagnato",
   "*Accompagnare alla porta* = acompañar a la salida, echar con buenos modales.")
ce(51, 8, "La decisione è stata ___: la sperimentazione continua.", ["presa", "fatta", "tirata"], "presa",
   "*Prendere una decisione*.")
ce(51, 9, "Trentadue ore su quattro giorni, a ___ di salario.", ["parità", "parte", "pari"], "parità",
   "*A parità di* = con el mismo (salario, condiciones).")
