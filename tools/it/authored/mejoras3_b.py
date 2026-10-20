# -*- coding: utf-8 -*-
"""Mejoras 3 (B), stagione 4: más producción C1 en las semanas 44
(gerundio e participio), 46 (suffissi e alterazione), 48 (ordine delle
parole e dislocazioni), 49 (registro alto e coesione) y 50 (lessico
avanzato e falsi amici).

Hasta acá esas semanas eran casi todo «cloze» y «choice»: el alumno
reconocía la estructura pero casi nunca la producía.  Por semana van
traducciones del castellano en registro cuidado («translate»),
reformulaciones con la estructura de la lección («typed», se escribe solo
lo que falta) y «Trova l'errore» con calcos del castellano y errores de
registro («fixerr»).

Las variantes igual de correctas se escriben con plantillas: «{a|b}»
se expande en todas las combinaciones (la primera es la respuesta).
"""
import itertools
import re

TR = "Traducí al italiano."
TRF = "Traducí al italiano en registro formal."
FX = "Trova l'errore: tocá la palabra que está mal y corregila."
P44 = "Reescribí con gerundio o participio, sin cambiar el sentido: escribí solo lo que falta."
P46 = "Reescribí con un alterado (diminutivo, aumentativo o despectivo): escribí solo lo que falta."
P48 = "Reescribí con el orden marcado (dislocación o frase escindida): escribí solo lo que falta."
P49 = "Subí el registro (nominalización, conector o cohesión): escribí solo lo que falta."
P50 = "Subí el registro con un verbo más preciso: escribí solo lo que falta."


def _expand(*templates):
    """«{a|b} c» → ["a c", "b c"]; varias plantillas, sin repetir."""
    out = []
    for t in templates:
        parts = re.split(r"(\{[^}]*\})", t)
        opts = [p[1:-1].split("|") if p.startswith("{") else [p] for p in parts]
        for combo in itertools.product(*opts):
            s = "".join(combo)
            if s not in out:
                out.append(s)
    return out


def _tr(id, w, topic, stem, templates, note, prompt=TR, typ="translate"):
    forms = _expand(*templates)
    d = dict(id=id, type=typ, topic=topic, level="C1", w=w, prompt=prompt,
             stem=stem, answer=forms[0], note=note)
    if len(forms) > 1:
        d["alt"] = forms[1:]
    return d


def _ty(id, w, topic, prompt, stem, answer, note, alt=None):
    d = dict(id=id, type="typed", topic=topic, level="C1", w=w, prompt=prompt,
             stem=stem, answer=answer, note=note)
    if alt:
        d["alt"] = alt
    return d


def _fx(id, w, topic, cat, stem, bad, good, note, goodAlt=None):
    d = dict(id=id, type="fixerr", topic=topic, level="C1", w=w, prompt=FX, cat=cat,
             stem=stem, bad=bad, good=good, note=note,
             answer=re.sub(r"(?<!\w)%s(?!\w)" % re.escape(bad), good, stem, count=1))
    if goodAlt:
        d["goodAlt"] = goodAlt
    return d


G44, S46, D48, R49, L50 = ("gerundio e participio", "suffissi", "dislocazioni",
                           "registro alto", "falsi amici")

ITEMS = [
    # ================= Settimana 44: gerundio e participio =================
    _tr("m3-44-01", 44, G44,
        "Habiendo leído el informe, el director decidió postergar la reunión.",
        ["{Avendo letto la relazione|Letta la relazione|Avendo letto il rapporto|Letto il rapporto}, "
         "il direttore {ha deciso|decise} di {rimandare|rinviare|posticipare|spostare} la riunione."],
        "Gerundio compuesto (*avendo letto*) = «habiendo leído»: anterioridad con el mismo sujeto. "
        "También vale el participio absoluto, que concuerda con el objeto: *letta la relazione*."),
    _tr("m3-44-02", 44, G44,
        "Aun conociendo los riesgos, los científicos siguieron adelante con el proyecto.",
        ["{Pur conoscendo i rischi|Pur essendo consapevoli dei rischi|Anche conoscendo i rischi}, "
         "gli scienziati {sono andati avanti con il|sono andati avanti col|andarono avanti con il|"
         "hanno proseguito il|proseguirono il|hanno continuato il|continuarono il} progetto."],
        "La concesión con gerundio va con *pur*: *pur conoscendo i rischi* (aun conociendo). "
        "*Anche conoscendo* también se usa. «Seguir adelante con» = *andare avanti con* o *proseguire*."),
    _tr("m3-44-03", 44, G44,
        "Volviendo a casa, me di cuenta de que había perdido las llaves.",
        ["{Tornando|Rientrando|Mentre tornavo|Mentre rientravo} a casa, "
         "{mi sono accorto|mi sono accorta|mi accorsi|mi sono reso conto|mi sono resa conto|mi resi conto} "
         "{di aver perso|di avere perso|che avevo perso} le chiavi."],
        "Gerundio temporal: *tornando a casa* (mientras volvía), con el mismo sujeto que la principal. "
        "Después de *accorgersi*, con el mismo sujeto, va *di* + infinitivo compuesto (*di aver perso*) "
        "o *che* + trapassato (*che avevo perso*)."),
    _tr("m3-44-04", 44, G44,
        "Una vez firmado el contrato, ya no se puede cambiar nada.",
        ["{Una volta firmato|Firmato} il contratto, non si può più {cambiare|modificare} {niente|nulla}.",
         "{Una volta firmato|Firmato} il contratto, non si può {cambiare|modificare} più {niente|nulla}."],
        "Participio absoluto: *firmato il contratto* (una vez firmado). Concuerda con el sustantivo: "
        "*firmata la lettera*, *firmati i documenti*."),
    _tr("m3-44-05", 44, G44,
        "Siendo extranjero, tuvo que presentar muchos más documentos que los demás.",
        ["Essendo straniero, {ha dovuto|dovette} presentare molti più documenti {degli altri|rispetto agli altri}."],
        "Gerundio causal: *essendo straniero* = como era extranjero. En la comparación, «que los "
        "demás» se dice con *di* + artículo: *molti più documenti degli altri*."),
    _ty("m3-44-06", 44, G44, P44,
        "Le persone che hanno diritto allo sconto devono presentare un documento. → "
        "Le persone ___ allo sconto devono presentare un documento.",
        "aventi diritto",
        "Participio presente con valor de verbo, típico del lenguaje administrativo: *aventi diritto* "
        "(que tienen derecho). Fuera de ese registro, mejor la relativa."),
    _ty("m3-44-07", 44, G44, P44,
        "Siccome non aveva ricevuto risposta, ha scritto di nuovo al direttore. → "
        "___ risposta, ha scritto di nuovo al direttore.",
        "Non avendo ricevuto",
        "Causa anterior a la principal: gerundio compuesto. La negación va delante: *non avendo ricevuto*."),
    _ty("m3-44-08", 44, G44, P44,
        "Dopo che ebbe salutato gli ospiti, il presidente lasciò la sala. → "
        "___ gli ospiti, il presidente lasciò la sala.",
        "Salutati",
        "Participio absoluto de un verbo transitivo: concuerda con el objeto, *salutati gli ospiti*. "
        "El gerundio compuesto *avendo salutato* también vale.",
        alt=["Avendo salutato"]),
    _ty("m3-44-09", 44, G44, P44,
        "Benché avesse vissuto vent'anni a Londra, parlava male l'inglese. → "
        "___ vent'anni a Londra, parlava male l'inglese.",
        "Pur avendo vissuto",
        "*Pur* + gerundio compuesto: concesión con anterioridad (aunque había vivido) y el mismo sujeto."),
    _fx("m3-44-10", 44, G44, "tempo_verbale",
        "Porto due anni studiando il tedesco e ancora non lo parlo bene.",
        "Porto due anni studiando", "Studio da due anni",
        "Calco de «llevo dos años estudiando»: en italiano va presente + *da* (*studio il tedesco da due "
        "anni*) o *sono due anni che studio*. El gerundio no sirve.",
        goodAlt=["Sono due anni che studio"]),
    _fx("m3-44-11", 44, G44, "grammatica",
        "Ci hanno consegnato una cassa contenendo documenti riservati.",
        "contenendo", "che conteneva",
        "El gerundio no acompaña a un sustantivo (calco de «una caja conteniendo»): relativa, *che "
        "conteneva*, o participio presente, *contenente*, del registro escrito.",
        goodAlt=["contenente", "che contiene"]),
    _fx("m3-44-12", 44, G44, "participio_accordo",
        "Spento la luce, si è addormentata subito.",
        "Spento", "Spenta",
        "En el participio absoluto de un verbo transitivo, el participio concuerda con el objeto: "
        "*spenta la luce*, *spenti i computer*."),

    # ================= Settimana 46: suffissi e alterazione =================
    _tr("m3-46-01", 46, S46,
        "Te traje un regalito para tu cumpleaños, nada importante.",
        ["Ti ho portato un {pensierino|regalino} per il {tuo |}compleanno, {niente|nulla} di {importante|speciale}."],
        "*Pensierino* (de *pensiero*) es el regalo chico y simbólico; *regalino* también va. El "
        "diminutivo le quita importancia, como en castellano."),
    _tr("m3-46-02", 46, S46,
        "¡Lindo trabajito hiciste! Ahora hay que rehacer todo.",
        ["{Bel|Che bel} lavoretto{ hai fatto|}! {Adesso|Ora} {bisogna|c'è da|tocca|dobbiamo} rifare tutto."],
        "Ironía: *bel lavoretto* reprocha un trabajo mal hecho, igual que «lindo trabajito». Y *ri-* "
        "repite la acción: *rifare* (rehacer)."),
    _tr("m3-46-03", 46, S46,
        "Para Navidad hacemos una cena enorme con toda la familia.",
        ["{A|Per} Natale facciamo {il|un} cenone con tutta la famiglia.",
         "Facciamo {il|un} cenone di Natale con tutta la famiglia."],
        "*-one* agranda: *il cenone* es la gran cena de las fiestas, de Nochebuena o de fin de año. "
        "En Italia es casi una palabra fija."),
    _tr("m3-46-04", 46, S46,
        "Le dije dos palabritas a tu hermano: no te va a molestar más.",
        ["{Ho detto due paroline a tuo fratello|A tuo fratello ho detto due paroline}{:|,|;} non ti "
         "{darà più fastidio|dà più fastidio|disturberà più|disturba più|infastidirà più}."],
        "*Due paroline* no habla de tamaño: es un reto con tono de advertencia, como «dos palabritas» "
        "en castellano. El diminutivo cambia el sentido, no la medida."),
    _tr("m3-46-05", 46, S46,
        "Mi abuelo vive en un pueblito de montaña, lejos de todo.",
        ["Mio nonno {vive|abita} in un paesino {di|in} montagna, lontano da tutto."],
        "*Paesino*: *-ino* achica y da cariño. «Lejos de» se dice *lontano da*: *lontano da tutto*."),
    _ty("m3-46-06", 46, S46, P46,
        "Mi presti la macchina per un breve giro? → Mi presti la macchina per un ___?",
        "giretto",
        "*Giretto*: una vuelta corta, en auto o a pie. El diminutivo achica también el pedido, que "
        "suena a favor chico."),
    _ty("m3-46-07", 46, S46, P46,
        "Mio fratello combina sempre pasticci. → Mio fratello è un ___.",
        "pasticcione",
        "*-one* sobre una palabra de acción nombra a quien la repite: *pasticcio* (desastre) → "
        "*pasticcione* (desastroso, chambón). Critica, pero con cariño."),
    _ty("m3-46-08", 46, S46, P46,
        "Lavoro in una stanza piccola e senza finestre. → Lavoro in una ___ senza finestre.",
        "stanzetta",
        "*-etta* achica: *stanzetta*. Ojo con *lo stanzino*: cambia de género y es un cuartito de "
        "depósito, no una habitación chica.",
        alt=["stanzina"]),
    _ty("m3-46-09", 46, S46, P46,
        "Abbiamo bevuto un vino leggero e senza pretese, ma buono. → "
        "Abbiamo bevuto un ___ senza pretese, ma buono.",
        "vinello",
        "*Vinello*: vino liviano, de mesa, dicho con simpatía. Con *-accio* el juicio se da vuelta: "
        "*vinaccio* es un vino malo."),
    _fx("m3-46-10", 46, S46, "parola_spagnola",
        "Aspettami un momentito, finisco di scrivere e arrivo.",
        "momentito", "momentino",
        "*-ito* es el diminutivo del castellano, no del italiano: *momentino* o *attimino*. Cada "
        "palabra elige su sufijo.",
        goodAlt=["attimino", "attimo", "momento"]),
    _fx("m3-46-11", 46, S46, "genere",
        "Il palazzo ha una portona di legno scuro.",
        "una portona", "un portone",
        "*-one* suele volver masculino un sustantivo femenino de cosa: *la porta* → *il portone*. "
        "*Portona* no existe."),
    _fx("m3-46-12", 46, S46, "lessico",
        "Ho fatto una figurona all'esame: non sapevo rispondere a niente!",
        "figurona", "figuraccia",
        "*Fare una figurona* es quedar muy bien; quedar mal es *fare una figuraccia*. Con los "
        "alterados, el sufijo cambia el juicio: *-one* elogia, *-accia* desprecia."),

    # ============ Settimana 48: ordine delle parole e dislocazioni ============
    _tr("m3-48-01", 48, D48,
        "Las llaves se las di a tu hermano esta mañana.",
        ["Le chiavi{,|} le ho date a tuo fratello {stamattina|questa mattina|stamani}.",
         "Le chiavi{,|} le ho date {stamattina|questa mattina|stamani} a tuo fratello.",
         "Le chiavi{,|} gliele ho date {stamattina|questa mattina|stamani}, a tuo fratello."],
        "El objeto adelantado se retoma con *le* y el participio concuerda: *le ho date*. El «se» "
        "duplicado del castellano no se calca: con *a tuo fratello* alcanza."),
    _tr("m3-48-02", 48, D48,
        "Fue la directora la que propuso cambiar el horario de las clases.",
        ["È stata la direttrice {a proporre|che ha proposto} di {cambiare|modificare} l'orario delle lezioni."],
        "Frase escindida: *è stata* + sujeto + *a* + infinitivo (o *che ha proposto*). *Essere* "
        "concuerda con el sujeto: *è stata la direttrice*."),
    _tr("m3-48-03", 48, D48,
        "Anoche llamó tu jefe: quiere hablar con vos mañana temprano.",
        ["Ieri sera {ha chiamato|ha telefonato|ti ha chiamato|ti ha telefonato} il tuo capo{:|,} vuole "
         "{parlare con te|parlarti} {domani mattina presto|domattina presto|domani presto}."],
        "Sujeto nuevo detrás del verbo: *ha chiamato il tuo capo*, porque la noticia es quién llamó. "
        "Con el sujeto delante, la frase responde a otra pregunta."),
    _tr("m3-48-04", 48, D48,
        "¿Ya lo terminaste, el informe para el director?",
        ["{L'hai già finito|L'hai già terminato|Lo hai già finito|Lo hai già terminato}, il rapporto per il direttore?",
         "{L'hai già finita|L'hai già terminata|La hai già finita|La hai già terminata}, la relazione per il direttore?"],
        "Dislocación a la derecha: el pronombre anticipa lo que se aclara al final. Es muy oral, y el "
        "participio concuerda: *l'hai finita, la relazione?*"),
    _tr("m3-48-05", 48, D48,
        "De este asunto no quiero hablar más con nadie.",
        ["Di questa {storia|questione|cosa|faccenda}{,|} non {ne voglio più parlare|voglio più parlarne|"
         "ne voglio parlare più|voglio parlarne più} con nessuno."],
        "Complemento con *di* adelantado: se retoma con *ne*. Con un modal, *ne* va delante o pegado al "
        "infinitivo: *non ne voglio più parlare* o *non voglio più parlarne*."),
    _ty("m3-48-06", 48, D48, P48,
        "Ho dato il libro a Marco ieri. → Il libro, a Marco, ___ ieri.",
        "gliel'ho dato",
        "Con dos complementos adelantados se retoman los dos: *gli* + *lo* = *glielo*, que se apostrofa "
        "ante *ho*: *gliel'ho dato*."),
    _ty("m3-48-07", 48, D48, P48,
        "I vicini hanno chiamato la polizia. → Sono stati i vicini ___ la polizia.",
        "a chiamare",
        "Escindida con *essere* + *a* + infinitivo: *sono stati i vicini a chiamare*. *Essere* "
        "concuerda en número con el elemento en foco.",
        alt=["che hanno chiamato"]),
    _ty("m3-48-08", 48, D48, P48,
        "Ho già comprato i biglietti per il concerto. → I biglietti per il concerto ___ già comprati.",
        "li ho",
        "Objeto adelantado: se retoma con *li* y el participio concuerda con él, *li ho già comprati*."),
    _fx("m3-48-09", 48, D48, "a_personale",
        "A Giulia la conosco da quando eravamo bambine.",
        "A Giulia", "Giulia",
        "El objeto directo adelantado va sin *a* (calco de «a Giulia la conozco»): *Giulia la conosco*. "
        "La *a* va con el indirecto: *a Giulia le ho scritto*."),
    _fx("m3-48-10", 48, D48, "pronome",
        "È per questo motivo per cui ho deciso di lasciare il lavoro.",
        "per cui", "che",
        "En la frase escindida el nexo es *che* y la preposición no se repite: *è per questo motivo che…* "
        "«Per cui» calca el «por lo que» del castellano."),
    _fx("m3-48-11", 48, D48, "participio_accordo",
        "Le lettere della nonna le ho conservato tutte in una scatola.",
        "conservato", "conservate",
        "*Le* retoma *le lettere* y va delante de *avere*: el participio concuerda, *le ho conservate*."),
    _fx("m3-48-12", 48, D48, "ci_ne",
        "Di libri gialli, mio padre li ha letti centinaia.",
        "li ha", "ne ha",
        "Con una cantidad (*centinaia*) el complemento adelantado se retoma con *ne*, no con *li*: *ne "
        "ha letti centinaia*. El participio sigue concordando."),

    # ============ Settimana 49: registro alto e coesione testuale ============
    _tr("m3-49-01", 49, R49,
        "Cabe señalar que los datos disponibles todavía no están completos.",
        ["{Va rilevato|Va notato|Va sottolineato|Va detto|Occorre rilevare|Occorre notare|Bisogna rilevare} "
         "che i dati disponibili non {sono|risultano} ancora completi."],
        "Fórmula impersonal de registro alto: *va rilevato che* (cabe señalar que). También *occorre "
        "notare che* o *va sottolineato che*.", prompt=TRF),
    _tr("m3-49-02", 49, R49,
        "Tras el cierre de la fábrica, muchas familias abandonaron la ciudad.",
        ["{Dopo la|In seguito alla|A seguito della} chiusura della fabbrica, molte famiglie "
         "{hanno lasciato|lasciarono|hanno abbandonato|abbandonarono} la città."],
        "Nominalización: «tras el cierre» es *dopo la chiusura* o *in seguito alla chiusura*, más "
        "compacto que «dopo che la fabbrica ha chiuso».", prompt=TRF),
    _tr("m3-49-03", 49, R49,
        "El proyecto es ambicioso; sin embargo, los recursos disponibles son escasos.",
        ["Il progetto è ambizioso; {tuttavia|ciononostante|ciò nonostante|nondimeno}{,|} le risorse "
         "disponibili sono {insufficienti|limitate|scarse}.",
         "Il progetto è ambizioso. {Tuttavia|Ciononostante|Ciò nonostante|Nondimeno}{,|} le risorse "
         "disponibili sono {insufficienti|limitate|scarse}."],
        "*Tuttavia* (sin embargo) es el conector adversativo del texto escrito; un *ma* bajaría el tono.",
        prompt=TRF),
    _tr("m3-49-04", 49, R49,
        "En caso de que surgieran problemas, le rogamos que se comunique con nosotros.",
        ["{Qualora|Nel caso in cui|Nel caso che} {sorgessero|sorgano|ci fossero|ci siano} problemi, "
         "La preghiamo di {contattarci|mettersi in contatto con noi}."],
        "*Qualora* (en caso de que) pide congiuntivo. «Le rogamos que» es *La preghiamo di* + "
        "infinitivo: *pregare* lleva el *Lei* como objeto directo.", prompt=TRF),
    _tr("m3-49-05", 49, R49,
        "Esto implica un aumento considerable de los costos para las empresas.",
        ["{Ciò|Questo} {comporta|implica} un {notevole aumento|aumento notevole|considerevole aumento|"
         "aumento considerevole} dei costi per le {imprese|aziende}."],
        "*Ciò* retoma lo dicho y sube el registro (ello, esto). *Comportare* = implicar, traer como "
        "consecuencia: *ciò comporta un aumento*.", prompt=TRF),
    _tr("m3-49-06", 49, R49,
        "Conviene recordar que la inscripción es gratuita para todos los estudiantes.",
        ["{Giova ricordare|È opportuno ricordare|Conviene ricordare|Occorre ricordare|Va ricordato} che "
         "l'iscrizione è gratuita per tutti gli studenti."],
        "*Giova ricordare* es la fórmula culta de «conviene recordar»; *è opportuno ricordare* y *va "
        "ricordato* son un poco más neutras.", prompt=TRF),
    _ty("m3-49-07", 49, R49, P49,
        "L'economia è cresciuta poco e la disoccupazione è aumentata. → "
        "La ___ dell'economia ha fatto aumentare la disoccupazione.",
        "scarsa crescita",
        "*Crescere* → *la crescita*, y el adverbio pasa a adjetivo (*poco* → *scarsa*): el sustantivo "
        "concentra la acción y encadena causa y efecto en una sola oración.",
        alt=["debole crescita", "bassa crescita", "crescita limitata", "crescita insufficiente"]),
    _ty("m3-49-08", 49, R49, P49,
        "Hanno licenziato molti lavoratori e questo ha provocato uno sciopero. → "
        "Il ___ di molti lavoratori ha provocato uno sciopero.",
        "licenziamento",
        "*Licenziare* → *il licenziamento* (-mento). La nominalización elimina el «e questo» de la "
        "lengua hablada."),
    _tr("m3-49-09", 49, R49,
        "Ha studiato tanto, però non ha passato l'esame. → Ha studiato molto; ___ l'esame.",
        ["{tuttavia|ciononostante|ciò nonostante|nondimeno|eppure}{,|} non ha superato"],
        "*Però* y *passare* son del habla; en un texto formal van *tuttavia* o *ciononostante* (con "
        "punto y coma delante) y *superare l'esame*.", prompt=P49, typ="typed"),
    _ty("m3-49-10", 49, R49, P49,
        "Ho parlato con il direttore e con il suo segretario; il segretario mi ha dato i moduli. → "
        "Ho parlato con il direttore e con il suo segretario; ___ mi ha dato i moduli.",
        "quest'ultimo",
        "*Quest'ultimo* retoma al último nombrado sin repetirlo y evita la ambigüedad de un simple "
        "*lui*, que podría ser el director."),
    _fx("m3-49-11", 49, R49, "pronome",
        "Gentile dottoressa, ti scrivo per chiederLe un appuntamento.",
        "ti", "Le",
        "En una carta formal no se mezclan *tu* y *Lei*: *Le scrivo per chiederLe…*, con mayúscula "
        "de cortesía."),
    _fx("m3-49-12", 49, R49, "lessico",
        "Inoltre di essere costoso, il progetto è poco utile.",
        "Inoltre di", "Oltre a",
        "«Además de» no es «inoltre di»: *inoltre* es adverbio y va solo (*inoltre, costa troppo*); "
        "delante de un infinitivo o un sustantivo, *oltre a*: *oltre a essere costoso*.",
        goodAlt=["Oltre ad"]),

    # ============ Settimana 50: lessico avanzato e falsi amici ============
    _tr("m3-50-01", 50, L50,
        "Me da vergüenza decirlo, pero no me acuerdo de su nombre.",
        ["{Mi vergogno a dirlo|Mi vergogno di dirlo|Mi imbarazza dirlo|Mi fa vergogna dirlo}, ma non "
         "{ricordo il suo nome|mi ricordo il suo nome|ricordo come si chiama|mi ricordo come si chiama}."],
        "La vergüenza se dice con *vergognarsi* o *imbarazzare*; ojo, *imbarazzata* no es «embarazada». "
        "«Acordarse de algo» es *ricordare* o *ricordarsi*."),
    _tr("m3-50-02", 50, L50,
        "Presencié toda la escena desde la ventana de mi oficina.",
        ["{Ho assistito a tutta la scena|Ho assistito all'intera scena|Ho visto tutta la scena} "
         "dalla finestra del mio ufficio."],
        "*Assistere a* es presenciar, estar como espectador; ir a clases o a la universidad, de "
        "forma regular, es *frequentare*."),
    _tr("m3-50-03", 50, L50,
        "Exijo una explicación por escrito antes de fin de mes.",
        ["{Pretendo|Esigo} una spiegazione {per iscritto|scritta} "
         "{entro la fine del mese|entro fine mese|prima della fine del mese}."],
        "*Pretendere* es exigir, no «pretender» (que es *aspirare a*). Un plazo, «antes de fin de "
        "mes», se dice con *entro*: *entro la fine del mese*."),
    _tr("m3-50-04", 50, L50,
        "Lo despidieron porque llegaba tarde todos los días.",
        ["{L'hanno licenziato|Lo hanno licenziato} perché arrivava {tardi|in ritardo} {tutti i giorni|ogni giorno}."],
        "*Licenziare* es despedir del trabajo; «licenciarse», recibirse, es *laurearsi*. El "
        "imperfetto *arrivava* marca la costumbre."),
    _tr("m3-50-05", 50, L50,
        "Mi prima se recibió de abogada el año pasado.",
        ["Mia cugina si è laureata in {legge|giurisprudenza} l'anno scorso.",
         "L'anno scorso mia cugina si è laureata in {legge|giurisprudenza}."],
        "Dos trampas: la prima es *la cugina* (*prima* es «antes»), y recibirse en la universidad es "
        "*laurearsi*, con *essere* en el pasado."),
    _tr("m3-50-06", 50, L50,
        "Al salir de la oficina, me subí al colectivo equivocado.",
        ["{Uscendo|Mentre uscivo|All'uscita} dall'ufficio, "
         "{sono salito sull'|sono salita sull'|ho preso l'}autobus sbagliato.",
         "Uscito dall'ufficio, {sono salito sull'|ho preso l'}autobus sbagliato.",
         "Uscita dall'ufficio, {sono salita sull'|ho preso l'}autobus sbagliato."],
        "*Salire* es subir y «salir» es *uscire*: *uscendo dall'ufficio, sono salito sull'autobus*. "
        "El gerundio (al salir) tiene el mismo sujeto que la principal."),
    _ty("m3-50-07", 50, L50, P50,
        "Il sindaco ha detto che i lavori finiranno a giugno. → "
        "Il sindaco ha ___ che i lavori si concluderanno a giugno.",
        "dichiarato",
        "En un artículo, *dire* se cambia por un verbo que precisa el acto: *dichiarare*, *affermare*, "
        "*annunciare*.",
        alt=["affermato", "annunciato", "comunicato"]),
    _ty("m3-50-08", 50, L50, P50,
        "Il nuovo direttore ha dato una mano a risolvere il problema. → "
        "Il nuovo direttore ha ___ a risolvere il problema.",
        "contribuito",
        "*Dare una mano* es coloquial; en un informe, *contribuire a* + infinitivo: *ha contribuito a "
        "risolvere il problema*.",
        alt=["collaborato", "aiutato"]),
    _fx("m3-50-09", 50, L50, "falso_amico",
        "Quest'anno assisto all'università di Bologna.",
        "assisto all'università", "frequento l'università",
        "Ir a la universidad o a un curso es *frequentare*: *frequento l'università*. *Assistere a* es "
        "presenciar, como espectador: *assistere a una lezione*."),
    _fx("m3-50-10", 50, L50, "falso_amico",
        "Mi hanno licenziato in giurisprudenza nel 2019.",
        "hanno licenziato", "sono laureato",
        "*Licenziare* es despedir: «me recibí» es *mi sono laureato*, con *essere* porque es reflexivo.",
        goodAlt=["sono laureata"]),
    _fx("m3-50-11", 50, L50, "falso_amico",
        "Il concerto di ieri sera è stato un grande esito.",
        "esito", "successo",
        "*Esito* es el resultado, bueno o malo (*l'esito dell'esame*); «éxito» es *successo*."),
    _fx("m3-50-12", 50, L50, "falso_amico",
        "In questo ristorante un solo cameriere attende tutti i tavoli.",
        "attende", "serve",
        "*Attendere* es esperar; atender a los clientes o las mesas es *servire*: *un cameriere serve "
        "i tavoli*."),
]
