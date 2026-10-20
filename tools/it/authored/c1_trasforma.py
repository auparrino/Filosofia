# -*- coding: utf-8 -*-
"""Trasformazioni scritte e correzione di errori C1 (semane 29-51).

Hasta la v2.8 el alumno llegaba al examen (semana 52) sin haber hecho nunca
una transformación escrita del tipo «Sebbene fosse tardi → Pur ___ tardi»,
que ahí vale puntos (auditoría 2026-09, D4.1 y D5.3).  Acá van, semana por
semana y con la gramática de esa semana, en el mismo formato que los
`ex-tr-*` del examen (tipo `typed`: se escribe solo lo que falta):

  c1-tf-WW-NN  transformaciones: esplicita ↔ implicita (29-30, 43-44),
               futuro nel passato y condicional (31), concordanza (32),
               periodo ipotetico (33), relativas (34), attiva ↔ passiva
               (35-36), passato remoto (37), diretta ↔ indiretta (38),
               causativo (40), percepción (41), régimen (42),
               construcciones pronominales (45), alteración (46),
               cantidades (47), dislocaciones (48), nominalización (49),
               léxico de registro (50) y repaso (51).
  c1-rs-WW-NN  cambio de registro, dos por semana desde la 42: una frase
               coloquial reescrita para un informe, un reclamo o una carta.
  c1-er-NN     «Trova l'errore» con errores de aprendiz de nivel C1
               (tipo VALICO: concordanza, *gli* por *le*, condicional tras
               *se*, *dopo mangiare*, calcos de la subordinación), en 40-51.

Cada ítem lleva «w», la semana de su teoría: build_course.py lo pone en esa
semana y tools/it/sillabo.py controla que no pida nada que se enseñe después.
"""

P_TR = "Reescribí la frase manteniendo el sentido: escribí solo lo que falta en el hueco."
P_SOG = "La subordinada tiene ahora otro sujeto: pasala a la forma explícita y escribí solo lo que falta."
P_IMP = "Mismo sujeto: pasá la subordinada a la forma implícita y escribí solo lo que falta."
P_PASS = "Pasá de activa a pasiva (o al revés) sin cambiar el tiempo: escribí solo lo que falta."
P_REM = "Pasá al passato remoto, el tiempo de la narración escrita: escribí solo lo que falta."
P_IND = "Pasá del discurso directo al indirecto (o al revés): escribí solo lo que falta."
P_REG = "Cambio de registro: reescribí la frase coloquial para el texto indicado. Escribí solo lo que falta."
P_ERR = "Trova l'errore: tocá la palabra que está mal y corregila."

ITEMS = []


def tf(w, n, stem, answer, note, alt=None, prompt=P_TR):
    d = dict(id="c1-tf-%d-%02d" % (w, n), type="typed", topic="trasformazione", level="B2" if w < 40 else "C1",
             w=w, prompt=prompt, stem=stem, answer=answer, note=note)
    if alt:
        d["alt"] = alt
    ITEMS.append(d)


def rs(w, n, stem, answer, note, alt=None):
    d = dict(id="c1-rs-%d-%02d" % (w, n), type="typed", topic="registro", level="C1",
             w=w, prompt=P_REG, stem=stem, answer=answer, note=note)
    if alt:
        d["alt"] = alt
    ITEMS.append(d)


def er(n, w, cat, stem, bad, good, note, goodAlt=None):
    d = dict(id="c1-er-%02d" % n, type="fixerr", topic="valico", level="C1", w=w, prompt=P_ERR, cat=cat,
             stem=stem, bad=bad, good=good, answer=stem.replace(bad, good, 1), note=note)
    if goodAlt:
        d["goodAlt"] = goodAlt
    ITEMS.append(d)


# --------------------------------------------------------------------------
# 29 · congiuntivo passato: di + infinito passato ↔ che + congiuntivo passato
# --------------------------------------------------------------------------
tf(29, 1, "Credo di aver capito. → Credo che anche Luca ___ capito.", "abbia",
   "Con el mismo sujeto va *di* + infinitivo (*credo di aver capito*); con otro sujeto, *che* + congiuntivo passato: *credo che Luca abbia capito*.",
   prompt=P_SOG)
tf(29, 2, "Mi dispiace di non essere venuto. → Mi dispiace che tu non ___ venuto.", "sia",
   "*Mi dispiace che* + congiuntivo. *Venire* va con *essere*: *tu sia venuto* (o *venuta*).", prompt=P_SOG)
tf(29, 3, "Sono felice di aver superato l'esame. → Sono felice che Anna ___ l'esame.", "abbia superato",
   "Emoción + *che* + congiuntivo; el hecho es anterior → congiuntivo passato: *abbia superato*.", prompt=P_SOG)
tf(29, 4, "Spero di non aver dimenticato niente. → Spero che voi non ___ niente.", "abbiate dimenticato",
   "*Sperare che* + congiuntivo passato para un hecho ya ocurrido: *abbiate dimenticato* (2ª plural).", prompt=P_SOG)
tf(29, 5, "È arrivato ieri, credo. → Credo che ___ ieri.", "sia arrivato",
   "La opinión que en castellano va con indicativo («creo que llegó») en italiano pide congiuntivo: *credo che sia arrivato*.",
   alt=["sia arrivata"])
tf(29, 6, "Forse Giulia ha perso il treno. → È possibile che Giulia ___ il treno.", "abbia perso",
   "*È possibile che* + congiuntivo. Hecho pasado → congiuntivo passato: *abbia perso*.")
tf(29, 7, "Probabilmente hanno chiuso il negozio. → Può darsi che ___ il negozio.", "abbiano chiuso",
   "*Può darsi che* («puede ser que») rige congiuntivo: *abbiano chiuso*.")
tf(29, 8, "Non ho finito in tempo e mi dispiace. → Mi dispiace di non ___ in tempo.", "aver finito",
   "Mismo sujeto: *di* + infinitivo compuesto (*aver finito*), que marca que el hecho es anterior.",
   alt=["avere finito"], prompt=P_IMP)
tf(29, 9, "Nessuno ha capito la domanda: è strano. → È strano che nessuno ___ la domanda.", "abbia capito",
   "*È strano che* + congiuntivo; con *nessuno* el verbo va en singular: *nessuno abbia capito*.")
tf(29, 10, "Dopo che abbiamo mangiato, siamo usciti. → Dopo ___ mangiato, siamo usciti.", "aver",
   "Mismo sujeto: *dopo* + infinitivo compuesto (*dopo aver mangiato*). En castellano «después de comer» usa el simple; en italiano el compuesto es obligatorio.",
   alt=["avere"], prompt=P_IMP)

# --------------------------------------------------------------------------
# 30 · congiuntivo imperfetto e trapassato: esplicita ↔ implicita
# --------------------------------------------------------------------------
tf(30, 1, "Volevo partire subito. → Volevo che anche tu ___ subito.", "partissi",
   "Con otro sujeto, *volere che* + congiuntivo; principal en pasado → imperfetto: *partissi*.", prompt=P_SOG)
tf(30, 2, "Speravo di trovare lavoro. → Speravo che mio figlio ___ lavoro.", "trovasse",
   "*Sperare di* + infinitivo con el mismo sujeto; *sperare che* + congiuntivo imperfetto con otro: *trovasse*.", prompt=P_SOG)
tf(30, 3, "Pensavo di aver chiuso la porta. → Pensavo che Luca ___ la porta.", "avesse chiuso",
   "Hecho anterior a un pasado → congiuntivo trapassato: *avesse chiuso*.", prompt=P_SOG)
tf(30, 4, "Era convinto di avere ragione. → Era convinto che sua moglie ___ ragione.", "avesse",
   "*Essere convinto che* + congiuntivo; principal en pasado y hecho simultáneo → imperfetto: *avesse*.", prompt=P_SOG)
tf(30, 5, "Prima di uscire, abbiamo chiuso le finestre. → Prima che i ragazzi ___, abbiamo chiuso le finestre.", "uscissero",
   "*Prima di* + infinitivo con el mismo sujeto; *prima che* + congiuntivo con otro. En pasado: *uscissero*.", prompt=P_SOG)
tf(30, 6, "Mi dispiaceva di essere arrivato tardi. → Mi dispiaceva che tu ___ tardi.", "fossi arrivato",
   "Anterioridad respecto de un pasado → congiuntivo trapassato: *fossi arrivato* (o *arrivata*).",
   alt=["fossi arrivata"], prompt=P_SOG)
tf(30, 7, "Sebbene lavorasse molto, guadagnava poco. → Anche se ___ molto, guadagnava poco.", "lavorava",
   "*Sebbene* y *benché* piden congiuntivo; *anche se* va con indicativo: *anche se lavorava*.")
tf(30, 8, "Anche se era tardi, siamo usciti. → Benché ___ tardi, siamo usciti.", "fosse",
   "Al revés: *benché* + congiuntivo imperfetto (*fosse*). Con *anche se*, indicativo (*era*).")
tf(30, 9, "Aveva paura di sbagliare. → Aveva paura che i figli ___.", "sbagliassero",
   "*Avere paura che* + congiuntivo; principal en pasado → imperfetto: *sbagliassero*.", prompt=P_SOG)
tf(30, 10, "Pensavo: «Forse ha già mangiato». → Pensavo che ___ già mangiato.", "avesse",
   "Lo que se pensaba en el pasado sobre algo anterior → congiuntivo trapassato: *pensavo che avesse già mangiato*.")

# --------------------------------------------------------------------------
# 31 · condizionale passato: futuro nel passato, rimpianto, dissociazione
# --------------------------------------------------------------------------
tf(31, 1, "Pensavo: «Finirò entro giugno». → Pensavo che ___ entro giugno.", "avrei finito",
   "El futuro visto desde el pasado es *condizionale passato* en italiano (*avrei finito*), no el simple como en castellano («terminaría»).")
tf(31, 2, "Sapevo: «Non verrà». → Sapevo che non ___.", "sarebbe venuto",
   "Futuro en el pasado: *sarebbe venuto*. «Sabía que no vendría» se dice con el compuesto.", alt=["sarebbe venuta"])
tf(31, 3, "Prometteva sempre: «Ti scriverò». → Prometteva sempre che mi ___.", "avrebbe scritto",
   "Futuro en el pasado: *avrebbe scritto*. El *ti* del directo pasa a *mi* porque ahora habla quien recibía la promesa.")
tf(31, 4, "Dovevi dirmelo prima! → ___ dirmelo prima!", "Avresti dovuto",
   "El reproche por algo que no se hizo: *avresti dovuto* + infinitivo («tendrías que haber…»).")
tf(31, 5, "Era possibile arrivare in tempo, ma non l'abbiamo fatto. → ___ arrivare in tempo.", "Avremmo potuto",
   "Posibilidad no aprovechada: *avremmo potuto* + infinitivo («podríamos haber llegado»).")
tf(31, 6, "Ho fatto male a non ascoltarti. → ___ ascoltarti.", "Avrei dovuto",
   "Arrepentimiento: *avrei dovuto* + infinitivo = «tendría que haberte escuchado».")
tf(31, 7, "Volevo venire, ma non ho potuto. → ___ venire, ma non ho potuto.", "Avrei voluto",
   "Deseo no cumplido: *avrei voluto* o *sarei voluto venire* (con un verbo de movimiento, el auxiliar puede ser *essere*).",
   alt=["Sarei voluto", "Sarei voluta"])
tf(31, 8, "Secondo la polizia, il ladro è fuggito in moto. → Il ladro ___ in moto, secondo la polizia.", "sarebbe fuggito",
   "En la prensa, el *condizionale passato* marca una noticia no confirmada: *sarebbe fuggito* = «habría huido».")
tf(31, 9, "Secondo alcune fonti, il ministro ha dato le dimissioni. → Il ministro ___ le dimissioni, secondo alcune fonti.", "avrebbe dato",
   "Condicional de la prensa («di dissociazione»): el periodista no garantiza el dato. *Avrebbe dato*, no «ha dato».")

# --------------------------------------------------------------------------
# 32 · concordanza dei tempi: la principal pasa al pasado
# --------------------------------------------------------------------------
_P32 = "Poné la principal en pasado y ajustá la subordinada: escribí solo lo que falta."
tf(32, 1, "Penso che sia giusto. → Pensavo che ___ giusto.", "fosse",
   "Principal en pasado + hecho simultáneo → congiuntivo imperfetto: *fosse*.", prompt=_P32)
tf(32, 2, "Credo che abbia già firmato. → Credevo che ___ già firmato.", "avesse",
   "Principal en pasado + hecho anterior → congiuntivo trapassato: *avesse firmato*.", prompt=_P32)
tf(32, 3, "Spero che arrivino presto. → Speravo che ___ presto.", "arrivassero",
   "*Speravo che* + congiuntivo imperfetto: *arrivassero*.", prompt=_P32)
tf(32, 4, "Mi pare che abbiano deciso. → Mi pareva che ___ deciso.", "avessero",
   "Anterioridad en el pasado → trapassato: *avessero deciso*.", prompt=_P32)
tf(32, 5, "È importante che tutti partecipino. → Era importante che tutti ___.", "partecipassero",
   "*Era importante che* + congiuntivo imperfetto: *partecipassero*.", prompt=_P32)
tf(32, 6, "Dice che verrà. → Diceva che ___.", "sarebbe venuto",
   "Posterioridad respecto de un pasado → condizionale passato: *diceva che sarebbe venuto*.",
   alt=["sarebbe venuta"], prompt=_P32)
tf(32, 7, "Non credo che sia così facile. → Non credevo che ___ così facile.", "fosse",
   "*Non credevo che* + congiuntivo imperfetto: *fosse*.", prompt=_P32)
tf(32, 8, "Temo che non abbiano capito. → Temevo che non ___ capito.", "avessero",
   "*Temevo che* + trapassato para lo anterior: *non avessero capito*.", prompt=_P32)
tf(32, 9, "Mi sembra che tu abbia ragione. → Mi sembrava che tu ___ ragione.", "avessi",
   "Simultáneo en el pasado → imperfetto: *avessi* (2ª persona: *che tu avessi*).", prompt=_P32)

# --------------------------------------------------------------------------
# 33 · periodo ipotetico
# --------------------------------------------------------------------------
tf(33, 1, "Non ho tempo, quindi non ti aiuto. → Se ___ tempo, ti aiuterei.", "avessi",
   "Hipótesis irreal en el presente: *se* + congiuntivo imperfetto (*avessi*) + condicional.")
tf(33, 2, "Non sei venuto e non l'hai conosciuta. → Se ___ venuto, l'avresti conosciuta.", "fossi",
   "Irreal en el pasado: *se* + congiuntivo trapassato (*fossi venuto*) + condizionale passato.")
tf(33, 3, "Piove: non usciamo. → Se non ___, usciremmo.", "piovesse",
   "Tipo II: *se non piovesse, usciremmo*. Nunca condicional después de *se*.")
tf(33, 4, "Non ha studiato; adesso non trova lavoro. → Se ___, adesso troverebbe lavoro.", "avesse studiato",
   "Período mixto: condición pasada (trapassato) y consecuencia presente (condizionale presente).")
tf(33, 5, "Con più soldi comprerei una casa. → Se ___ più soldi, comprerei una casa.", "avessi",
   "*Con più soldi* equivale a una condición: *se avessi più soldi*.")
tf(33, 6, "Senza il tuo aiuto non avrei finito. → Se tu non mi ___, non avrei finito.", "avessi aiutato",
   "*Senza* + sustantivo = condición irreal en el pasado: *se tu non mi avessi aiutato*.")
tf(33, 7, "Non sapevo che eri in città e non ti ho chiamato. → Se ___ che eri in città, ti avrei chiamato.", "avessi saputo",
   "Irreal en el pasado: *se avessi saputo* + *avrei chiamato*.")
tf(33, 8, "Se mi chiami, vengo. (ipotesi poco probabile) → Se mi ___, verrei.", "chiamassi",
   "Al volver la hipótesis poco probable, pasa al tipo II: *se mi chiamassi, verrei*.")

# --------------------------------------------------------------------------
# 34 · pronomi relativi: unir dos frases
# --------------------------------------------------------------------------
_P34 = "Uní las dos frases con un relativo: escribí solo lo que falta."
tf(34, 1, "Ho letto un libro. L'autore del libro è argentino. → Ho letto un libro ___ autore è argentino.", "il cui",
   "Posesivo relativo: artículo + *cui* + sustantivo; el artículo concuerda con *autore*: *il cui autore*.", prompt=_P34)
tf(34, 2, "Questa è la città. Sono nato in questa città. → Questa è la città ___ sono nato.", "in cui",
   "Lugar: *in cui*, *dove* o *nella quale*.", alt=["dove", "nella quale"], prompt=_P34)
tf(34, 3, "Ti presento Marco. Lavoro con Marco. → Ti presento Marco, ___ lavoro.", "con cui",
   "Con preposición, *cui*: *con cui*. En registro alto, *con il quale*.", alt=["con il quale", "col quale"], prompt=_P34)
tf(34, 4, "È arrivato tardi, e questo mi ha fatto arrabbiare. → È arrivato tardi, ___ mi ha fatto arrabbiare.", "il che",
   "*Il che* retoma toda la frase anterior, como «lo cual»: sin preposición, y siempre con el artículo.", alt=["cosa che"], prompt=_P34)
tf(34, 5, "Non capisco la cosa che dici. → Non capisco ___ dici.", "quello che",
   "«Lo que» se dice *quello che* o *ciò che*: el calco «lo che» no existe.", alt=["ciò che", "quel che"])
tf(34, 6, "La ragazza a cui ho scritto non ha risposto. → La ragazza ___ ho scritto non ha risposto.", "alla quale",
   "*A cui* = *alla quale*: preposición + artículo que concuerda con *ragazza*.")
tf(34, 7, "Il motivo per il quale sono qui è semplice. → Il motivo ___ sono qui è semplice.", "per cui",
   "Con preposición, *il quale* y *cui* se alternan: *per il quale* o *per cui*. *Il motivo per cui* es la forma más frecuente.")
tf(34, 8, "Le persone che hanno partecipato riceveranno un attestato. → Chi ___ riceverà un attestato.", "ha partecipato",
   "*Chi* = «el que, quien»: va con el verbo en singular (*chi ha partecipato riceverà*).")
tf(34, 9, "Il professore del quale ti ho parlato arriva domani. → Il professore ___ ti ho parlato arriva domani.", "di cui",
   "*Parlare di* → *di cui* (o *del quale*).")

# --------------------------------------------------------------------------
# 35 · attiva ↔ passiva (essere, venire, andare)
# --------------------------------------------------------------------------
tf(35, 1, "Il comune ha chiuso la strada. → La strada ___ dal comune.", "è stata chiusa",
   "Pasiva en passato prossimo: *è stata chiusa* (el participio concuerda con *strada*). *Venire* no va en tiempos compuestos.",
   prompt=P_PASS)
tf(35, 2, "I tecnici riparano il ponte. → Il ponte ___ dai tecnici.", "viene riparato",
   "Presente: *viene riparato* subraya el proceso; *è riparato* también vale.", alt=["è riparato"], prompt=P_PASS)
tf(35, 3, "Bisogna pagare la tassa entro marzo. → La tassa ___ entro marzo.", "va pagata",
   "Obligación: *andare* + participio = «tiene que ser…». *Va pagata* = *deve essere pagata*.",
   alt=["deve essere pagata", "dev'essere pagata"], prompt=P_PASS)
tf(35, 4, "Molti turisti visitano il museo ogni anno. → Il museo ___ da molti turisti ogni anno.", "è visitato",
   "Presente pasivo: *è visitato* o *viene visitato*. El agente va con *da*.", alt=["viene visitato"], prompt=P_PASS)
tf(35, 5, "Il romanzo è stato tradotto da una giovane traduttrice. → Una giovane traduttrice ___ il romanzo.", "ha tradotto",
   "De pasiva a activa: el agente pasa a sujeto y el tiempo se mantiene (passato prossimo).", prompt=P_PASS)
tf(35, 6, "Le lettere vengono spedite dalla segreteria. → La segreteria ___ le lettere.", "spedisce",
   "*Vengono spedite* es presente pasivo → presente activo: *spedisce* (verbo en *-isc-*).", prompt=P_PASS)
tf(35, 7, "I cittadini eleggeranno il nuovo sindaco a giugno. → Il nuovo sindaco ___ a giugno.", "sarà eletto",
   "Futuro pasivo: *sarà eletto* o *verrà eletto*. Sin agente, porque es obvio.", alt=["verrà eletto"], prompt=P_PASS)
tf(35, 8, "Hanno arrestato il ladro ieri sera. → Il ladro ___ ieri sera.", "è stato arrestato",
   "La 3ª plural impersonal («arrestaron») se vuelve pasiva sin agente: *è stato arrestato*.", prompt=P_PASS)
tf(35, 9, "Bisogna rispettare le regole. → Le regole ___.", "vanno rispettate",
   "*Andare* + participio concordado: *vanno rispettate*.", alt=["devono essere rispettate"], prompt=P_PASS)
tf(35, 10, "La polizia fermava ogni macchina. → Ogni macchina ___ dalla polizia.", "veniva fermata",
   "Imperfetto pasivo: *veniva fermata* (proceso repetido) o *era fermata*.", alt=["era fermata"], prompt=P_PASS)

# --------------------------------------------------------------------------
# 36 · si passivante e si impersonale
# --------------------------------------------------------------------------
_P36 = "Reescribí con el «si» impersonal o pasivo: escribí solo lo que falta."
tf(36, 1, "In Italia la gente mangia la pasta ogni giorno. → In Italia ___ la pasta ogni giorno.", "si mangia",
   "*Si passivante*: el verbo concuerda con el objeto (*la pasta* → *si mangia*).", prompt=_P36)
tf(36, 2, "Qui vendono libri usati. → Qui ___ libri usati.", "si vendono",
   "Con objeto plural, verbo en plural: *si vendono libri*, no «si vende libri».", prompt=_P36)
tf(36, 3, "In questo ufficio tutti lavorano bene. → In questo ufficio ___ bene.", "si lavora",
   "*Si impersonale* con un verbo sin objeto: 3ª singular, *si lavora*.", prompt=_P36)
tf(36, 4, "La gente dice che chiuderanno la fabbrica. → ___ che chiuderanno la fabbrica.", "Si dice",
   "El sujeto genérico (*la gente*, *tutti*) se vuelve *si*: *si dice che…*.", prompt=_P36)
tf(36, 5, "Quando uno è stanco, non ragiona bene. → Quando ___ stanchi, non si ragiona bene.", "si è",
   "Con *si impersonale*, el adjetivo va en plural: *quando si è stanchi*.", prompt=_P36)
tf(36, 6, "Abbiamo mangiato benissimo in quella trattoria. → In quella trattoria ___ benissimo.", "si è mangiato",
   "En tiempos compuestos, el *si* va siempre con *essere*: *si è mangiato*.", prompt=_P36)
tf(36, 7, "Oggi le case vengono costruite in fretta. → Oggi ___ le case in fretta.", "si costruiscono",
   "Pasiva con *venire* → *si passivante*, en plural: *si costruiscono le case*.", prompt=_P36)
tf(36, 8, "In campagna la gente si alza presto. → In campagna ___ presto.", "ci si alza",
   "Un verbo reflexivo con *si impersonale* hace *ci si*: *ci si alza*, nunca «si si alza».", prompt=_P36)
tf(36, 9, "Tutti devono pagare il biglietto. → ___ pagare il biglietto.", "Si deve",
   "Obligación impersonal: *si deve* + infinitivo, como «hay que». Con objeto plural se oye *si devono pagare i biglietti*.", prompt=_P36)

# --------------------------------------------------------------------------
# 37 · passato remoto e trapassato remoto
# --------------------------------------------------------------------------
tf(37, 1, "Nel 1946 gli italiani hanno votato per la Repubblica. → Nel 1946 gli italiani ___ per la Repubblica.", "votarono",
   "Passato remoto regular en *-are*, 3ª plural: *-arono*.", prompt=P_REM)
tf(37, 2, "Dante è nato a Firenze nel 1265. → Dante ___ a Firenze nel 1265.", "nacque",
   "*Nascere* es irregular: *nacqui, nascesti, nacque*.", prompt=P_REM)
tf(37, 3, "Quando ha finito, è uscito. → Appena ___, uscì.", "ebbe finito",
   "Trapassato remoto: solo después de *appena, dopo che, quando* y con la principal en passato remoto.", prompt=P_REM)
tf(37, 4, "Colombo ha scoperto l'America nel 1492. → Colombo ___ l'America nel 1492.", "scoprì",
   "*Scoprire*: regular en el remoto, *scoprì*, con tilde.", prompt=P_REM)
tf(37, 5, "Garibaldi è partito da Quarto con mille volontari. → Garibaldi ___ da Quarto con mille volontari.", "partì",
   "*-ire* → *-ì* en la 3ª singular: *partì*.", prompt=P_REM)
tf(37, 6, "All'improvviso hanno visto una luce. → All'improvviso ___ una luce.", "videro",
   "*Vedere*: *vidi, vedesti, vide… videro* (patrón 1-3-6).", prompt=P_REM)
tf(37, 7, "Quella sera mi ha detto la verità. → Quella sera mi ___ la verità.", "disse",
   "*Dire*: *dissi, dicesti, disse*.", prompt=P_REM)
tf(37, 8, "Hanno fatto una lunga pausa e poi hanno ripreso il cammino. → ___ una lunga pausa e poi ripresero il cammino.", "Fecero",
   "*Fare*: *feci, facesti, fece… fecero*.", prompt=P_REM)
tf(37, 9, "La guerra è finita nel 1945. → La guerra ___ nel 1945.", "finì",
   "*Finire*, regular: *finì*. El remoto es el tiempo de los libros de historia.", prompt=P_REM)

# --------------------------------------------------------------------------
# 38 · discorso diretto ↔ indiretto
# --------------------------------------------------------------------------
tf(38, 1, "Luca: «Sono stanco». → Luca ha detto che ___ stanco.", "era",
   "Presente del directo → imperfetto en el indirecto con verbo introductor en pasado.", prompt=P_IND)
tf(38, 2, "Anna: «Ho perso il treno». → Anna ha detto che ___ il treno.", "aveva perso",
   "Passato prossimo → trapassato prossimo: *aveva perso*.", prompt=P_IND)
tf(38, 3, "Il capo: «Domani non verrò». → Il capo ha detto che ___ non sarebbe venuto.", "il giorno dopo",
   "Los deícticos cambian: *domani* → *il giorno dopo* (o *l'indomani*); el futuro → *sarebbe venuto*.",
   alt=["l'indomani", "il giorno seguente"], prompt=P_IND)
tf(38, 4, "Mia madre: «Chiudi la finestra!» → Mia madre mi ha detto ___ la finestra.", "di chiudere",
   "Imperativo del directo → *di* + infinitivo.", prompt=P_IND)
tf(38, 5, "Marta: «Che ore sono?» → Marta mi ha chiesto che ore ___.", "fossero",
   "Pregunta indirecta en el pasado: congiuntivo imperfetto (*fossero*); *erano* es coloquial.", alt=["erano"], prompt=P_IND)
tf(38, 6, "Il vigile: «Qui non si parcheggia». → Il vigile ha detto che ___ non si parcheggiava.", "lì",
   "*Qui* → *lì* (o *là*): el lugar ya no es el de quien cuenta.", alt=["là"], prompt=P_IND)
tf(38, 7, "Paolo: «Partirò la settimana prossima». → Paolo disse che ___ la settimana dopo.", "sarebbe partito",
   "Futuro → condizionale passato; *la settimana prossima* → *la settimana dopo* (o *seguente*).", prompt=P_IND)
tf(38, 8, "Sara mi ha chiesto se ero libero. → Sara: «___ libero?»", "Sei",
   "Del indirecto al directo: el imperfetto vuelve al presente y la persona a la 2ª: *Sei libero?*", prompt=P_IND)
tf(38, 9, "Il professore ci ha detto di studiare di più. → Il professore: «___ di più!»", "Studiate",
   "*Di* + infinitivo vuelve a ser un imperativo; *ci* → *voi*: *Studiate di più!*", prompt=P_IND)
tf(38, 10, "Giulia: «Questo libro è mio». → Giulia ha detto che ___ libro era suo.", "quel",
   "*Questo* → *quello* (acá *quel*, ante consonante); *mio* → *suo*.", prompt=P_IND)

# --------------------------------------------------------------------------
# 40 · il causativo: fare e lasciare + infinito
# --------------------------------------------------------------------------
tf(40, 1, "Il meccanico ha riparato la mia macchina (gliel'ho chiesto io). → ___ la macchina dal meccanico.", "Ho fatto riparare",
   "Causativo: *fare* + infinitivo, sin nada en el medio. Quien hace el trabajo va con *da*.")
tf(40, 2, "Il parrucchiere mi ha tagliato i capelli. → Mi ___ tagliare i capelli.", "sono fatto",
   "Para uno mismo, *farsi* + infinitivo, con *essere* en los tiempos compuestos: *mi sono fatto* (o *fatta*) *tagliare*.",
   alt=["sono fatta"])
tf(40, 3, "Ho permesso a mio figlio di uscire. → ___ uscire mio figlio.", "Ho lasciato",
   "*Lasciare* + infinitivo = permitir: *ho lasciato uscire mio figlio*.")
tf(40, 4, "Il professore ci obbliga a studiare tutti i giorni. → Il professore ci ___ tutti i giorni.", "fa studiare",
   "*Fare* + infinitivo también es obligar: *ci fa studiare*.")
tf(40, 5, "Ho fatto leggere la lettera a Luca. → (con dos pronombres) ___ fatta leggere.", "Gliel'ho",
   "Con dos complementos, la persona pasa a indirecto (*gli*) y se combina: *gliel'ho fatta leggere* (el participio concuerda con *la lettera*).",
   alt=["Gliela ho"])
tf(40, 6, "Non permettono ai clienti di entrare con il cane. → Non ___ entrare i clienti con il cane.", "lasciano",
   "Permiso (o prohibición) → *lasciare*, no *fare*.")
tf(40, 7, "L'impiegato mi ha costretto ad aspettare un'ora. → L'impiegato mi ___ un'ora.", "ha fatto aspettare",
   "*Fare aspettare qualcuno* = hacer esperar. El pronombre va delante de *fare*: *mi ha fatto aspettare*.")
tf(40, 8, "Un architetto costruirà la nostra casa (su nostro incarico). → ___ costruire la casa da un architetto.", "Faremo",
   "Encargar un trabajo: *faremo costruire la casa*. Quien la construye, con *da*.")
tf(40, 9, "Lascia che ti aiuti. → ___ aiutare.", "Lasciati",
   "*Lasciarsi* + infinitivo: *lasciati aiutare* = «dejate ayudar». En el imperativo, el pronombre va pegado.")
tf(40, 10, "Dimmi com'è andata. → ___ sapere com'è andata.", "Fammi",
   "*Fammi sapere* = «avisame, contame»: literalmente, «hacé que yo sepa».")

# --------------------------------------------------------------------------
# 41 · verbi di percezione
# --------------------------------------------------------------------------
_P41 = "Reescribí con el verbo de percepción + infinitivo (o al revés): escribí solo lo que falta."
tf(41, 1, "Ho visto che Maria usciva di casa. → Ho visto Maria ___ di casa.", "uscire",
   "*Vedere* + persona + infinitivo: la forma más natural, sin *che*.", prompt=_P41)
tf(41, 2, "Ho sentito i vicini che litigavano. → Ho sentito ___ i vicini.", "litigare",
   "Con infinitivo, el sujeto puede ir después: *ho sentito litigare i vicini*.", prompt=_P41)
tf(41, 3, "Ho visto Paola uscire. → L'ho ___ uscire.", "vista",
   "Con el pronombre delante, el participio concuerda: *l'ho vista* (a Paola).", prompt=_P41)
tf(41, 4, "Sentivo che il cuore batteva forte. → Sentivo il cuore ___ forte.", "battere",
   "*Sentire* + sustantivo + infinitivo: *sentivo il cuore battere*.", prompt=_P41)
tf(41, 5, "Abbiamo guardato i bambini che giocavano. → Abbiamo guardato ___ i bambini.", "giocare",
   "*Guardare* + infinitivo: *abbiamo guardato giocare i bambini*.", prompt=_P41)
tf(41, 6, "Ho visto che qualcuno entrava in cortile. → Ho visto ___ qualcuno in cortile.", "entrare",
   "*Ho visto entrare qualcuno*: con percepción directa, el infinitivo reemplaza la completiva.", prompt=_P41)
tf(41, 7, "Li ho sentiti cantare. → Ho sentito che ___.", "cantavano",
   "Al revés: el infinitivo vuelve a ser un verbo conjugado, en imperfetto (acción en curso).", prompt=_P41)
tf(41, 8, "Ascoltavo la pioggia che cadeva sul tetto. → Ascoltavo la pioggia ___ sul tetto.", "cadere",
   "*Ascoltare* + infinitivo: *ascoltavo la pioggia cadere*.", prompt=_P41)

# --------------------------------------------------------------------------
# 42 · verbi e preposizioni (reggenze)
# --------------------------------------------------------------------------
tf(42, 1, "Ha smesso: non fuma più. → Ha smesso ___.", "di fumare",
   "*Smettere di* + infinitivo, como *finire di*, *cercare di*, *decidere di*.")
tf(42, 2, "Non voleva, ma alla fine ha accettato. → Non voleva, ma ha finito ___ accettare.", "per",
   "*Finire per* + infinitivo = «terminar por, acabar…»: cambia de sentido respecto de *finire di* («terminar de»).",
   alt=["con l'"])
tf(42, 3, "Ho intenzione di cambiare lavoro. → Penso ___ cambiare lavoro.", "di",
   "El régimen cambia el sentido: *pensare di* + infinitivo es tener intención; *pensare a* es pensar en algo o alguien.")
tf(42, 4, "Non si ricorda mai di chiudere a chiave. → Si dimentica sempre ___ chiudere a chiave.", "di",
   "*Dimenticarsi di* + infinitivo, como *ricordarsi di*.")
tf(42, 5, "Ha provato più volte a chiamarti. → Ha cercato più volte ___ chiamarti.", "di",
   "*Provare a* y *cercare di*: mismo sentido («tratar de»), distinta preposición.")
tf(42, 6, "Si è pentito perché ha detto quelle cose. → Si è pentito ___ detto quelle cose.", "di aver",
   "*Pentirsi di* + infinitivo compuesto: *si è pentito di aver detto*.", alt=["di avere"], prompt=P_IMP)
tf(42, 7, "Alla fine è riuscito: ha trovato casa. → Alla fine è riuscito ___ trovare casa.", "a",
   "*Riuscire a* + infinitivo («lograr»): el castellano no usa preposición y el calco más común es «riuscire di».")

# --------------------------------------------------------------------------
# 43 · l'infinito: esplicita ↔ implicita
# --------------------------------------------------------------------------
tf(43, 1, "Mi sembra che io abbia sbagliato. → Mi sembra ___ sbagliato.", "di aver",
   "Mismo sujeto: *di* + infinitivo compuesto. «Mi sembra che io abbia» es correcto pero pesado.", alt=["di avere"], prompt=P_IMP)
tf(43, 2, "Dopo che ha finito il lavoro, è andato a casa. → Dopo ___ il lavoro, è andato a casa.", "aver finito",
   "*Dopo* + infinitivo compuesto: *dopo aver finito*.", alt=["avere finito"], prompt=P_IMP)
tf(43, 3, "È importante che si mangi bene. → ___ bene è importante.", "Mangiare",
   "El infinitivo como sujeto: *mangiare bene è importante* (sin artículo, o con *il*, más literario).",
   alt=["Il mangiare"])
tf(43, 4, "Prima che tu esca, chiudi la finestra. → Prima ___, chiudi la finestra.", "di uscire",
   "Mismo sujeto (tú): *prima di* + infinitivo.", prompt=P_IMP)
tf(43, 5, "È uscito e non ha detto niente. → È uscito senza ___ niente.", "dire",
   "*Senza* + infinitivo, como «sin decir»: con *senza* ya no hace falta *non*.")
tf(43, 6, "L'hanno punito perché era arrivato tardi. → L'hanno punito per ___ arrivato tardi.", "essere",
   "Causal implícita: *per* + infinitivo compuesto (*per essere arrivato*).")
tf(43, 7, "Si prega di non toccare le opere. → Non ___ le opere.", "toccare",
   "En carteles e instrucciones, el infinitivo hace de imperativo: *non toccare*, *spingere*, *non fumare*.")
tf(43, 8, "Ricordo che ho visto quel film da bambino. → Ricordo ___ quel film da bambino.", "di aver visto",
   "*Ricordare di* + infinitivo compuesto, con el mismo sujeto.", alt=["di avere visto"], prompt=P_IMP)

# --------------------------------------------------------------------------
# 44 · gerundio e participio: esplicita ↔ implicita
# --------------------------------------------------------------------------
tf(44, 1, "Siccome era stanco, è andato a letto presto. → ___ stanco, è andato a letto presto.", "Essendo",
   "Causal implícita con gerundio: *essendo stanco*.", prompt=P_IMP)
tf(44, 2, "Dopo che ebbe finito i compiti, uscì. → ___ i compiti, uscì.", "Finiti",
   "Participio absoluto: concuerda con el objeto (*i compiti* → *finiti*). También *avendo finito*.",
   alt=["Avendo finito"], prompt=P_IMP)
tf(44, 3, "Mentre tornavo a casa, ho visto un incidente. → ___ a casa, ho visto un incidente.", "Tornando",
   "Simultaneidad con el mismo sujeto: gerundio simple.", prompt=P_IMP)
tf(44, 4, "Anche se sa la verità, non dice niente. → Pur ___ la verità, non dice niente.", "sapendo",
   "Concesiva implícita: *pur* + gerundio.", prompt=P_IMP)
tf(44, 5, "Quando la riunione è finita, tutti sono usciti. → ___ la riunione, tutti sono usciti.", "Finita",
   "Participio absoluto con su propio sujeto: *finita la riunione*.")
tf(44, 6, "Se studi un po' ogni giorno, impari presto. → ___ un po' ogni giorno, impari presto.", "Studiando",
   "Condición implícita con gerundio: *studiando un po' ogni giorno*.", prompt=P_IMP)
tf(44, 7, "Poiché aveva perso le chiavi, ha dormito da un'amica. → ___ le chiavi, ha dormito da un'amica.", "Avendo perso",
   "Anterioridad + causa: gerundio compuesto, *avendo perso*.", prompt=P_IMP)
tf(44, 8, "Uscito dall'ufficio, ha chiamato la moglie. → Dopo che ___ dall'ufficio, ha chiamato la moglie.", "era uscito",
   "Al revés: el participio absoluto vuelve a ser una temporal explícita en trapassato.")
tf(44, 9, "Pur essendo ricco, vive modestamente. → Benché ___ ricco, vive modestamente.", "sia",
   "*Pur* + gerundio = *benché* + congiuntivo: *benché sia ricco*.")

# --------------------------------------------------------------------------
# 45 · costruzioni verbali speciali
# --------------------------------------------------------------------------
tf(45, 1, "Sono riuscito a finire in tempo. → ___ a finire in tempo.", "Ce l'ho fatta",
   "*Farcela* = lograrlo. En pasado el participio va en femenino, por el *la*: *ce l'ho fatta*.")
tf(45, 2, "Sono uscito presto dalla festa. → ___ presto dalla festa.", "Me ne sono andato",
   "*Andarsene* = irse de un lugar: *me ne sono andato* (o *andata*).", alt=["Me ne sono andata"])
tf(45, 3, "Si è offeso per quello che hai detto. → ___ per quello che hai detto.", "Se l'è presa",
   "*Prendersela* = ofenderse, tomárselo a mal. En pasado: *se l'è presa*.")
tf(45, 4, "Per arrivare impiego due ore. → ___ due ore ad arrivare.", "Ci metto",
   "*Metterci* tiene sujeto de persona (*ci metto due ore*); *volerci*, sujeto de tiempo (*ci vogliono due ore*).")
tf(45, 5, "Il treno parte fra un attimo. → Il treno ___ partire.", "sta per",
   "Acción inminente: *stare per* + infinitivo, como «estar por, estar a punto de».")
tf(45, 6, "È arrabbiato con me. → ___ con me.", "Ce l'ha",
   "*Avercela con qualcuno* (estar enojado con alguien): el *ci* y el *la* no se tocan, *ce l'ho con te*, *ce l'aveva con me*.")
tf(45, 7, "All'improvviso ha cominciato a piangere. → All'improvviso si è ___ a piangere.", "messo",
   "*Mettersi a* + infinitivo = ponerse a. Participio con *essere*: *si è messo* (o *messa*).", alt=["messa"])
tf(45, 8, "In cucina è abbastanza bravo. → In cucina ___ abbastanza bene.", "se la cava",
   "*Cavarsela* = arreglárselas, defenderse: *se la cava bene*.")

# --------------------------------------------------------------------------
# 46 · alterazione
# --------------------------------------------------------------------------
_P46 = "Decilo con una sola palabra alterada (diminutivo, aumentativo o despectivo)."
tf(46, 1, "una casa piccola e graziosa → una ___", "casetta", "*-etto/-etta*: pequeño y simpático.",
   alt=["casina"], prompt=_P46)
tf(46, 2, "una parola volgare → una ___", "parolaccia", "*-accio/-accia*: despectivo. *Parolaccia* = mala palabra.", prompt=_P46)
tf(46, 3, "un libro grande e pesante → un ___", "librone", "*-one*: aumentativo, casi siempre en masculino.", prompt=_P46)
tf(46, 4, "un tempo brutto → un ___", "tempaccio", "*-accio*: despectivo, *tempaccio* es un tiempo feo, de perros.", prompt=_P46)
tf(46, 5, "un ragazzo grande e grosso → un ___", "ragazzone", "*Ragazzone*: un muchacho grandote.", prompt=_P46)
tf(46, 6, "una piccola pausa → una ___", "pausetta", "Diminutivo coloquial: *una pausetta*, *un caffettino*.", prompt=_P46)

# --------------------------------------------------------------------------
# 47 · numerali, misure e quantità
# --------------------------------------------------------------------------
_P47 = "Reescribí la cantidad como se dice en la prensa: escribí solo lo que falta."
tf(47, 1, "circa dieci persone → una ___ di persone", "decina", "Colectivo aproximado: *una decina* (unos diez).", prompt=_P47)
tf(47, 2, "più o meno cento lettere → un ___ di lettere", "centinaio",
   "*Un centinaio*, plural irregular *centinaia* (femenino).", prompt=_P47)
tf(47, 3, "due persone su tre → i ___ delle persone", "due terzi", "Fracción: *due terzi*.", prompt=_P47)
tf(47, 4, "il cinquanta per cento degli studenti → la ___ degli studenti", "metà", "*Metà*, con tilde e invariable.", prompt=_P47)
tf(47, 5, "Oggi costa mille euro; cinque anni fa ne costava cinquecento. → Oggi costa il ___ di cinque anni fa.", "doppio",
   "*Il doppio* (el doble), *il triplo*.", prompt=_P47)
tf(47, 6, "Il prezzo è passato da cento a trecento euro. → Il prezzo è ___.", "triplicato",
   "*Raddoppiare, triplicare*: *è triplicato* (con *essere* cuando es intransitivo).", prompt=_P47)
tf(47, 7, "gli anni dal 1900 al 1999 → il ___", "Novecento",
   "Los siglos del 1200 en adelante se nombran por la centena: *il Novecento* = el siglo XX.", alt=["novecento"], prompt=_P47)

# --------------------------------------------------------------------------
# 48 · dislocazioni e frase scissa
# --------------------------------------------------------------------------
_P48 = "Reescribí con el orden marcado (dislocación o frase escindida): escribí solo lo que falta."
tf(48, 1, "Compro io il pane. → Il pane ___ compro io.", "lo",
   "Dislocación a la izquierda: el objeto adelante se retoma con el pronombre (*il pane lo compro io*).", prompt=_P48)
tf(48, 2, "Non ho mai visto quel film. → Quel film non ___ mai visto.", "l'ho",
   "El pronombre de retoma es obligatorio: *quel film non l'ho mai visto*.", prompt=_P48)
tf(48, 3, "Ho parlato con Marta di questo problema. → Di questo problema ___ ho parlato con Marta.", "ne",
   "Con *di*, el pronombre de retoma es *ne*.", prompt=_P48)
tf(48, 4, "Non capisco questo. → È questo ___ non capisco.", "che",
   "Frase escindida: *è… che*. En castellano, «es esto lo que no entiendo»; en italiano, solo *che*.", prompt=_P48)
tf(48, 5, "Marco ti aspetta. → C'è Marco ___ ti aspetta.", "che",
   "*C'è* + sustantivo + *che*: presenta una novedad (*c'è Marco che ti aspetta*).", prompt=_P48)
tf(48, 6, "Sono andata a Roma molte volte. → A Roma ___ sono andata molte volte.", "ci",
   "Lugar dislocado a la izquierda → *ci*.", prompt=_P48)
tf(48, 7, "Giulia ha rotto il vaso. → È stata Giulia ___ il vaso.", "a rompere",
   "Frase escindida con infinitivo: *è stata Giulia a rompere*. «Es Giulia la que…» no se calca con *la che*.",
   alt=["che ha rotto"], prompt=_P48)

# --------------------------------------------------------------------------
# 49 · nominalizzazione (registro alto)
# --------------------------------------------------------------------------
_P49 = "Nominalizá: reemplazá el verbo por un sustantivo y escribí solo lo que falta."
tf(49, 1, "I prezzi sono aumentati e le famiglie spendono meno. → ___ dei prezzi ha ridotto la spesa delle famiglie.", "L'aumento",
   "*Aumentare* → *l'aumento*. El estilo nominal es típico de la prensa y los informes.", prompt=_P49)
tf(49, 2, "Quando il presidente è arrivato, tutti si sono alzati. → All'___ del presidente, tutti si sono alzati.", "arrivo",
   "*Arrivare* → *l'arrivo*: *all'arrivo di* = cuando llegó.", prompt=_P49)
tf(49, 3, "Il comune ha deciso di chiudere la biblioteca e i cittadini protestano. → I cittadini protestano contro la ___ di chiudere la biblioteca.", "decisione",
   "*Decidere* → *la decisione* (*-sione*).", prompt=_P49)
tf(49, 4, "Dopo che il ponte è crollato, la strada è rimasta chiusa. → Dopo il ___ del ponte, la strada è rimasta chiusa.", "crollo",
   "*Crollare* → *il crollo*: sustantivo sin sufijo, como *arrivo*, *ritorno*, *aumento*.", prompt=_P49)
tf(49, 5, "Se si riducono le tasse, aumentano i consumi. → La ___ delle tasse fa aumentare i consumi.", "riduzione",
   "*Ridurre* → *la riduzione* (*-durre* → *-duzione*).", prompt=_P49)
tf(49, 6, "Il governo ha approvato la legge ieri. → ___ della legge è avvenuta ieri.", "L'approvazione",
   "*Approvare* → *l'approvazione* (*-are* → *-azione*).", prompt=_P49)
tf(49, 7, "È difficile trovare casa, e molti giovani restano con i genitori. → La ___ di trovare casa costringe molti giovani a restare con i genitori.", "difficoltà",
   "*Difficile* → *la difficoltà* (no «difficilità»).", prompt=_P49)
tf(49, 8, "I lavoratori partecipano poco: è un problema. → La scarsa ___ dei lavoratori è un problema.", "partecipazione",
   "*Partecipare* → *la partecipazione*; el adverbio (*poco*) se vuelve adjetivo (*scarsa*).", prompt=_P49)

# --------------------------------------------------------------------------
# 50 · lessico di registro: il verbo generico → il verbo preciso
# --------------------------------------------------------------------------
_P50 = "Cambiá el verbo genérico por el preciso del registro formal: escribí solo lo que falta."
tf(50, 1, "Ho fatto un errore nel modulo. → Ho ___ un errore nel modulo.", "commesso",
   "*Commettere un errore* es la colocación formal; *fare un errore* es la corriente.", prompt=_P50)
tf(50, 2, "Ha detto la sua opinione con chiarezza. → Ha ___ la sua opinione con chiarezza.", "espresso",
   "*Esprimere un'opinione* (participio *espresso*).", alt=["manifestato"], prompt=_P50)
tf(50, 3, "Serve più tempo per decidere. → ___ più tempo per decidere.", "Occorre",
   "*Occorre* («hace falta») es la versión formal de *serve* y *ci vuole*.", alt=["È necessario"], prompt=_P50)
tf(50, 4, "I dati fanno vedere che la situazione migliora. → I dati ___ che la situazione migliora.", "mostrano",
   "*Mostrare, indicare, dimostrare* en lugar de *fare vedere*.", alt=["dimostrano", "indicano", "evidenziano"], prompt=_P50)
tf(50, 5, "Il progetto va avanti senza problemi. → Il progetto ___ senza problemi.", "prosegue",
   "Registro formal: *proseguire* (seguir adelante) en lugar de *andare avanti*.", alt=["procede", "continua"], prompt=_P50)
tf(50, 6, "Il comune ha messo in pratica il piano. → Il comune ha ___ il piano.", "attuato",
   "*Attuare* = llevar a la práctica. «Actuar» en castellano es otra cosa: *agire*, *recitare*.",
   alt=["realizzato", "applicato"], prompt=_P50)
tf(50, 7, "Il sindaco ha tirato fuori una proposta nuova. → Il sindaco ha ___ una proposta nuova.", "avanzato",
   "Registro formal: *avanzare una proposta* (plantear una propuesta) en lugar de *tirare fuori*.", alt=["presentato", "formulato"], prompt=_P50)

# --------------------------------------------------------------------------
# 51 · ripasso: una trasformazione di ogni tipo
# --------------------------------------------------------------------------
tf(51, 1, "Sebbene fosse malato, è venuto al lavoro. → Pur ___ malato, è venuto al lavoro.", "essendo",
   "*Sebbene* + congiuntivo → *pur* + gerundio (mismo sujeto).", prompt=P_IMP)
tf(51, 2, "La commissione ha respinto la domanda. → La domanda ___ dalla commissione.", "è stata respinta",
   "Pasiva en passato prossimo; *respingere* → *respinto*.", prompt=P_PASS)
tf(51, 3, "La direttrice: «Firmerò il contratto domani». → La direttrice disse che ___ il contratto il giorno dopo.", "avrebbe firmato",
   "Futuro → condizionale passato en el indirecto.", prompt=P_IND)
tf(51, 4, "Non abbiamo prenotato e ora non c'è posto. → Se ___, ora ci sarebbe posto.", "avessimo prenotato",
   "Período mixto: trapassato en la condición, condicional presente en la consecuencia.")
tf(51, 5, "Il tecnico ha installato la caldaia su nostra richiesta. → ___ installare la caldaia dal tecnico.", "Abbiamo fatto",
   "Causativo en passato prossimo: *abbiamo fatto installare*.")
tf(51, 6, "Quando la lezione è finita, gli studenti sono usciti. → ___ la lezione, gli studenti sono usciti.", "Finita",
   "Participio absoluto concordado con *la lezione*.", alt=["Terminata"])
tf(51, 7, "Le vendite sono crollate e l'azienda chiude. → Il ___ delle vendite porta l'azienda alla chiusura.", "crollo",
   "Nominalización: *crollare* → *il crollo*.", prompt=_P49)
tf(51, 8, "Credo che abbiano già deciso. → Credevo che ___ già deciso.", "avessero",
   "Concordanza: principal en pasado + hecho anterior → congiuntivo trapassato.", prompt=_P32)
tf(51, 9, "Non ho mai letto quel libro. → Quel libro non ___ mai letto.", "l'ho",
   "Dislocación a la izquierda con pronombre de retoma.", prompt=_P48)

# --------------------------------------------------------------------------
# Registro: dos por semana desde la 42
# --------------------------------------------------------------------------
rs(42, 1, "C'è un casino di gente in centro. → (in una relazione) In centro è presente un ___ numero di persone.", "elevato",
   "*Un casino di* es muy coloquial (y algo vulgar). En un informe: *un elevato / notevole numero di*.",
   alt=["notevole", "gran", "grande", "considerevole", "alto"])
rs(42, 2, "Ti scrivo perché non mi hanno ancora restituito i soldi. → (lettera formale) ___ scrivo perché non sono ancora stato rimborsato.", "Le",
   "En la carta formal se usa el *Lei*: el indirecto es *Le* (con mayúscula de cortesía).")
rs(43, 1, "Questo traffico è una cosa da pazzi! → (lettera al Comune) Il traffico in centro è ormai ___.", "insostenibile",
   "*Una cosa da pazzi* es coloquial; en una carta: *insostenibile*, *intollerabile*.",
   alt=["intollerabile", "inaccettabile", "insopportabile"])
rs(43, 2, "Mi hanno fatto aspettare un sacco. → (reclamo) Sono stato costretto ad attendere ___.", "a lungo",
   "*Un sacco* es coloquial; en un reclamo: *a lungo*, *per molto tempo*.",
   alt=["molto a lungo", "per molto tempo", "lungamente"])
rs(44, 1, "Ho un sacco di cose da fare questa settimana. → (email al direttore) Questa settimana ho numerosi ___.", "impegni",
   "*Un sacco di cose* → *numerosi impegni*: el sustantivo preciso reemplaza a *cose*.")
rs(44, 2, "Non ci ho capito niente, di questo modulo. → (lettera all'ufficio) Il modulo risulta poco ___.", "chiaro",
   "*Risultare poco chiaro* es la manera cortés de decir que algo no se entiende.", alt=["comprensibile"])
rs(45, 1, "Boh, non lo so. → (risposta a un cliente) Al momento non sono in ___ di rispondere.", "grado",
   "Formal: *essere in grado di* («estar en condiciones de»). *Boh* es solo oral e informal.")
rs(45, 2, "Quel prof è bravissimo. → (relazione) Il docente si è dimostrato estremamente ___.", "competente",
   "*Bravissimo* es de la charla; en un informe se elige el adjetivo preciso.", alt=["preparato", "capace", "professionale"])
rs(46, 1, "I prezzi sono andati alle stelle. → (articolo) I prezzi sono ___ notevolmente.", "aumentati",
   "*Andare alle stelle* es expresivo y coloquial; en un artículo: *sono aumentati notevolmente*.", alt=["cresciuti", "saliti"])
rs(46, 2, "Il capo si è arrabbiato di brutto. → (verbale della riunione) Il direttore ha espresso un forte ___.", "disappunto",
   "*Esprimere disappunto* es la forma neutra y formal de decir que alguien se enojó.",
   alt=["malcontento", "dissenso", "fastidio", "disagio"])
rs(47, 1, "Hanno mandato a casa venti persone. → (comunicato) L'azienda ha ___ venti dipendenti.", "licenziato",
   "*Mandare a casa* es el eufemismo coloquial; el término preciso es *licenziare*.")
rs(47, 2, "Ne parliamo dopo. → (verbale) La questione sarà affrontata in un secondo ___.", "momento",
   "Fórmula de acta: *in un secondo momento* («más adelante, en otra ocasión»).", alt=["tempo"])
rs(48, 1, "Scusa se ti rispondo tardi. → (email formale) Mi ___ per il ritardo con cui rispondo.", "scuso",
   "Con el *Lei* no se dice «scusa»: *mi scuso per il ritardo*.")
rs(48, 2, "Chiamaci quando vuoi. → (lettera a un cliente) La invitiamo a ___ i nostri uffici quando preferisce.", "contattare",
   "*Contattare* es el verbo neutro de la correspondencia comercial.")
rs(49, 1, "Non c'è un euro per rifare la palestra. → (relazione) Mancano le ___ per ristrutturare la palestra.", "risorse",
   "*Le risorse* (económicas) es el término de los informes; *non c'è un euro* es coloquial.",
   alt=["risorse economiche", "risorse finanziarie", "risorse necessarie"])
rs(49, 2, "La riunione è saltata. → (comunicazione ai dipendenti) La riunione è stata ___.", "annullata",
   "*Saltare* («no hacerse») es coloquial; formal: *annullata* o *rinviata* (postergada).", alt=["rinviata", "cancellata"])
rs(50, 1, "Ci vediamo lì alle cinque. → (invito ufficiale) L'incontro è ___ per le ore 17.", "fissato",
   "Invitación formal: *fissare un appuntamento* («acordar una cita»). Las horas se escriben en formato de 24 h.", alt=["previsto", "programmato"])
rs(50, 2, "Scusi se La disturbo. → (lettera) Mi scuso per il ___ arrecato.", "disturbo",
   "*Arrecare disturbo* es la colocación formal: *scusi il disturbo*, *mi scuso per il disturbo arrecato*.")
rs(51, 1, "Dobbiamo darci una mossa. → (relazione) È necessario ___ i tempi.", "accelerare",
   "*Darsi una mossa* («apurarse») es coloquial; en un informe: *accelerare i tempi*.", alt=["ridurre", "abbreviare"])
rs(51, 2, "Questa cosa non mi va proprio giù. → (lettera formale) Trovo questa decisione del tutto ___.", "inaccettabile",
   "*Non andare giù* («no poder tragar algo») es de la charla; formal: *inaccettabile*.",
   alt=["inammissibile", "ingiustificata"])

# --------------------------------------------------------------------------
# Trova l'errore: errores de aprendiz de nivel C1 (40-51)
# --------------------------------------------------------------------------
er(1, 40, "congiuntivo", "Pensavo che tu hai ragione su tutto.", "hai", "avessi",
   "Después de *pensare che* va congiuntivo; con la principal en pasado, imperfetto: *pensavo che tu avessi ragione*.")
er(2, 40, "pronome", "Ho incontrato Laura e gli ho raccontato tutto.", "gli", "le",
   "A una mujer, el indirecto es *le*: *le ho raccontato*. *Gli* es «a él» (o «a ellos»).")
er(3, 40, "accordo", "In quel negozio si vende libri usati.", "vende", "vendono",
   "*Si passivante*: el verbo concuerda con el objeto plural (*si vendono libri*).")
er(4, 40, "condizionale", "Mi ha detto che verrebbe il giorno dopo.", "verrebbe", "sarebbe venuto",
   "El futuro visto desde el pasado es *condizionale passato*: *mi ha detto che sarebbe venuto*. El simple es calco del castellano «vendría».")
er(5, 41, "periodo_ipotetico", "Se avrei più tempo, leggerei di più.", "avrei", "avessi",
   "Después de *se* nunca va condicional: *se avessi più tempo*. Es el error más típico del hispanohablante… y de muchos italianos.")
er(6, 41, "participio_accordo", "Maria? L'ho visto uscire alle otto.", "visto", "vista",
   "*L'* es *la* (Maria): con el pronombre directo delante, el participio concuerda: *l'ho vista*.")
er(7, 41, "a_personale", "Ho sentito a Marco cantare sotto la doccia.", "a Marco", "Marco",
   "Con *sentire* y *vedere* + infinitivo no hay «a» personal: *ho sentito Marco cantare*.")
er(8, 42, "preposizione", "Finalmente sono riuscito di finire la tesi.", "di", "a",
   "*Riuscire a* + infinitivo. Con *di* van *cercare*, *decidere*, *finire*, no *riuscire*.")
er(9, 42, "preposizione", "Mio padre ha smesso a fumare dieci anni fa.", "a", "di",
   "*Smettere di* + infinitivo (dejar de).")
er(10, 42, "preposizione", "La riunione la quale ho partecipato è durata tre ore.", "la quale", "alla quale",
   "*Partecipare a* → *alla quale* (o *a cui*). El relativo conserva la preposición del verbo.")
er(11, 43, "tempo_verbale", "Dopo mangiare siamo andati a fare una passeggiata.", "Dopo mangiare", "Dopo aver mangiato",
   "*Dopo* + infinitivo compuesto: *dopo aver mangiato*. «Después de comer» no se calca.",
   goodAlt=["Dopo avere mangiato", "Dopo pranzo"])
er(12, 43, "congiuntivo", "Aspetto che mi rispondi entro domani.", "rispondi", "risponda",
   "*Aspettare che* + congiuntivo: *aspetto che tu mi risponda*.")
er(13, 44, "parola_spagnola", "Nonostante la pioggia, la gente segue camminando in centro.", "segue camminando", "continua a camminare",
   "«Seguir + gerundio» no se calca: *continuare a* + infinitivo.")
er(14, 44, "congiuntivo", "Nonostante è tardi, lavora ancora in ufficio.", "è", "sia",
   "*Nonostante*, *benché* y *sebbene* piden congiuntivo: *nonostante sia tardi*.")
er(15, 45, "participio_accordo", "Alla fine, dopo tre tentativi, ce l'ho fatto!", "fatto", "fatta",
   "En *farcela* el *la* hace concordar el participio en femenino: *ce l'ho fatta*.")
er(16, 45, "accordo", "Per arrivare a Napoli ci vuole tre ore.", "vuole", "vogliono",
   "*Volerci* concuerda con lo que se necesita: *ci vogliono tre ore*, *ci vuole un'ora*.")
er(17, 45, "pronome", "Non prendertelo così, era solo una battuta!", "prendertelo", "prendertela",
   "*Prendersela* lleva siempre *la*: *non prendertela* («no te lo tomes a mal»).")
er(18, 47, "ortografia", "Quest'anno il museo ha venduto venti mila biglietti.", "venti mila", "ventimila",
   "Los números se escriben en una sola palabra: *ventimila*, *duemila*, *centomila*.")
er(19, 48, "pronome", "È qui dove abito da dieci anni.", "dove", "che",
   "La frase escindida lleva siempre *che*: *è qui che abito*. «Es aquí donde vivo» no se calca.")
er(20, 48, "persona_verbale", "Sono stata io che ha rotto il vaso.", "ha", "ho",
   "En la escindida con *che*, el verbo concuerda con el foco: *sono stata io che ho rotto* (o *io a rompere*).")
er(21, 49, "congiuntivo", "Ti lascio le chiavi affinché puoi entrare quando vuoi.", "puoi", "possa",
   "*Affinché* (= *perché* final) rige congiuntivo: *affinché tu possa entrare*.")
er(22, 49, "congiuntivo", "Qualora avete bisogno di aiuto, chiamate questo numero.", "avete", "abbiate",
   "*Qualora* («en caso de que») rige congiuntivo: *qualora abbiate bisogno* (o *aveste*).", goodAlt=["aveste"])
er(23, 50, "falso_amico", "Sono un po' imbarazzata: aspetto un bambino!", "imbarazzata", "incinta",
   "Falso amigo: *imbarazzata* es «avergonzada, incómoda»; «embarazada» se dice *incinta*.")
er(24, 50, "falso_amico", "Il suo discorso è stato troppo largo e noioso.", "largo", "lungo",
   "Falso amigo: *largo* es «ancho»; el «largo» castellano se dice *lungo*.")
er(25, 51, "lessico", "Dai dati dell'indagine possiamo tirare alcune conclusioni.", "tirare", "trarre",
   "La colocación es *trarre conclusioni* (sacar conclusiones). *Tirare* es tirar o estirar.")
er(26, 51, "lessico", "In questo progetto la scuola ha fatto un ruolo fondamentale.", "fatto", "svolto",
   "Colocación: *svolgere* (o *avere*) *un ruolo*, «desempeñar un papel». *Fare la parte* es solo del teatro.",
   goodAlt=["avuto", "giocato"])
