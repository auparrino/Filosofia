# -*- coding: utf-8 -*-
"""Stagione 4 — La Vetta (settimane 40-52, B2 → C1)."""

LESSONS = {

40: {
"intro": "Vas a usar el causativo: *fare* + infinitivo para «hacer que "
         "alguien haga» o «mandar a hacer», donde el castellano arma una "
         "subordinada entera.",
"parts": [
 {"h": "fare + infinito: quién hace qué", "blocks": [0, 1, 2, 3, 6],
  "ids": ["mj-40-%02d" % n for n in (1, 2, 3, 4, 5, 6)],
  "match": r"^(?!.*(lasciare|Lascia|Consejos|Problemas de viaje|Dejo que)).*\S"},
 {"h": "lasciare y expresiones con fare", "blocks": [4, 5, 7],
  "ids": ["mj-40-%02d" % n for n in (7, 8, 9, 10, 11, 12, 13)],
  "match": r"lasciare|Lascia|Consejos|Problemas de viaje|Dejo que"},
],
"blocks": [
 {"h": "fare + infinito",
  "r": "*fare* conjugado + infinitivo = hacer que alguien haga o mandar a "
       "hacer. Van **pegados**, salvo un adverbio: *mi fa sempre ridere*.",
  "ex": [["*Ho fatto riparare* la macchina.", "Mandé a arreglar el auto."],
         ["Mi *fai ridere*.", "Me hacés reír."],
         ["Il professore ci *fa studiare* molto.", "El profesor nos hace estudiar mucho."],
         ["*Fammi sapere*.", "Avisame. (literalmente: hacé que yo sepa)"]],
  "warn": "El objeto va después del infinitivo, nunca entre los dos: *faccio "
          "riparare la macchina*, no «faccio la macchina riparare»."},

 {"h": "farsi + infinito: para uno mismo",
  "r": "*farsi* + infinitivo = hacerse hacer algo por otro. Así se dice «me "
       "corté el pelo» o «me operé».",
  "ex": [["*Si è fatto tagliare* i capelli.", "Se cortó el pelo (en la peluquería)."],
         ["*Mi sono fatto fare* un vestito.", "Me mandé a hacer un traje."],
         ["*Si è fatta operare* al ginocchio.", "Se operó la rodilla."]],
  "warn": "*Mi sono tagliato i capelli* puede ser con tu tijera o, en el "
          "habla, en la peluquería. Para dejarlo claro: *mi sono fatto "
          "tagliare i capelli*."},

 {"h": "Quién hace qué",
  "q": [{"prompt": "Reemplazá «il libro» y «a Marco».", "stem": "Faccio leggere il libro a Marco → ___ faccio leggere.", "answer": "Glielo", "options": ["Glielo", "Lo gli", "Gli"]}, {"prompt": "Reemplazá «Marco».", "stem": "Faccio lavorare Marco → ___ faccio lavorare.", "answer": "Lo", "options": ["Lo", "Gli", "Le"]}],
  "r": "Si el infinitivo no tiene objeto, quien ejecuta es **directo** "
       "(*lo*). Si ya tiene uno, quien ejecuta pasa a **indirecto** (*gli*).",
  "ex": [["Faccio lavorare Marco. → *Lo* faccio lavorare.", "Hago trabajar a Marco. → Lo hago trabajar."],
         ["Il film fa ridere i bambini. → *Li* fa ridere.", "La película hace reír a los chicos. → Los hace reír."],
         ["Faccio leggere il libro *a Marco*.", "Le hago leer el libro a Marco."],
         ["*Glielo* faccio leggere.", "Se lo hago leer."]],
  "warn": "Sin objeto no hay *a*: *faccio lavorare Marco*, no «faccio "
          "lavorare a Marco». La *a* aparece solo si el infinitivo ya lleva "
          "objeto.",
  "more": ["Quien ejecuta también puede ir con *da* (por): es lo normal con "
           "*farsi* y con un profesional que presta un servicio: *mi faccio "
           "tagliare i capelli da Dina*, *farò riparare la veranda "
           "dall'architetto*. Con *a*, es alguien a quien le pedís el favor: "
           "*faccio scegliere il vino a Marco*."]},

 {"h": "Los pronombres van delante de fare",
  "r": "Los pronombres van **delante de *fare***, no del infinitivo: *lo "
       "faccio venire*, jamás «faccio venirlo».",
  "ex": [["*Lo* faccio venire.", "Lo hago venir."],
         ["*Te lo* faccio vedere.", "Te lo muestro."],
         ["*Fallo* entrare.", "Hacelo entrar."],
         ["Devo *farlo* venire.", "Tengo que hacerlo venir."]],
  "warn": "Se pegan a *fare* solo cuando está en infinitivo, gerundio o "
          "imperativo informal: *devo farlo venire*, *facendolo entrare*, "
          "*fallo entrare*."},

 {"h": "lasciare: permitir en vez de obligar",
  "r": "*lasciare* + infinitivo = «dejar que», y se arma igual que *fare*. "
       "También existe *lasciare che* + congiuntivo.",
  "ex": [["*Lascia parlare* tuo fratello.", "Dejá hablar a tu hermano."],
         ["Non mi *lasciano uscire*.", "No me dejan salir."],
         ["*Lascialo stare*.", "Dejalo en paz."],
         ["*Lascia che* ti *spieghi*.", "Dejá que te explique."]],
  "warn": "Igual que con *fare*, sin *a* delante de la persona: *lascia "
          "parlare tuo fratello*, no «lascia parlare a tuo fratello»."},

 {"h": "Expresiones fijas con fare",
  "r": "Estas combinaciones se usan todo el tiempo: aprendelas enteras.",
  "ex": [["*Fammi vedere* la foto.", "Mostrame la foto."],
         ["Ti *faccio sapere* domani.", "Te aviso mañana."],
         ["Non *si fa* più *vivo*.", "Ya no da señales de vida."],
         ["*Fa finta di* niente.", "Se hace el distraído."]],
  "table": {"head": ["Expresión", "Sentido", "Ejemplo"],
            "rows": [["far vedere", "mostrar", "Fammi vedere la foto."],
                     ["far sapere", "avisar", "Ti faccio sapere domani."],
                     ["far notare", "señalar, hacer notar", "Gli ho fatto notare l'errore."],
                     ["far presente", "advertir, poner en conocimiento", "Le ho fatto presente il problema."],
                     ["farsi capire", "hacerse entender", "Non riesco a farmi capire."],
                     ["farsi vivo", "dar señales de vida", "Non si fa più vivo."],
                     ["far finta di", "hacer de cuenta que", "Fa finta di dormire."],
                     ["far cadere", "tirar sin querer (se me cayó)", "Ho fatto cadere il vaso."],
                     ["far entrare", "hacer pasar", "Fallo entrare."],
                     ["far conoscere", "presentar a alguien", "Te lo faccio conoscere."],
                     ["dare da fare", "dar trabajo", "Questo lavoro mi dà da fare."],
                     ["farcela", "lograrlo", "Ce l'ho fatta!"]]},
  "tip": "Para cosas concretas se dice *far vedere*: *fammi vedere*. "
         "*Mostrare* es normal, pero más formal o abstracto: *mostrare interesse*."},

 {"h": "El agente con da: mandar a alguien",
  "r": "Con *fare* y *farsi*, quien ejecuta puede ir con *da*: sobre todo un oficio, un profesional o una empresa.",
  "ex": [["Ho fatto riparare la macchina *dal meccanico*.", "Mandé a arreglar el auto al mecánico."],
         ["Si è fatto tagliare i capelli *da Gino*.", "Se cortó el pelo con Gino."],
         ["Mi sono fatta operare *dal dottor Rossi*.", "Me operó el doctor Rossi."],
         ["Faccio pulire l'ufficio *da una ditta* esterna.", "Hago limpiar la oficina a una empresa externa."]],
  "table": {"head": ["Construcción", "Quién ejecuta", "Ejemplo"],
            "rows": [["fare + inf. + a", "alguien cercano, un dato más", "Faccio leggere il libro a Marco."],
                     ["fare + inf. + da", "un servicio o un oficio", "Faccio riparare l'auto dal meccanico."],
                     ["farsi + inf. + da", "siempre con da", "Mi sono fatto visitare da un medico."]]},
  "warn": "Con *farsi* el agente va siempre con *da*, nunca con *a*: *mi sono fatto fare un vestito da una sarta*."},

 {"h": "Pronombres, participio y modales",
  "r": "El participio concuerda con el pronombre directo que va delante: *l'ho fatta riparare*, *li ho lasciati uscire*.",
  "ex": [["*L'ho fatta* riparare ieri.", "La mandé a arreglar ayer."],
         ["*Li ho lasciati* uscire.", "Los dejé salir."],
         ["*Gliel'ho fatta* leggere.", "Se la hice leer."],
         ["*Fammelo* sapere presto.", "Avisame pronto."],
         ["Non *lo posso far* entrare.", "No puedo hacerlo entrar."]],
  "warn": "Concuerda con el pronombre, no con el infinitivo: *l'ho fatta riparare* (la macchina), *l'ho fatto riparare* (il computer).",
  "tip": "Con un modal, el pronombre elige lugar: *lo devo far venire* o *devo farlo venire*, pero nunca «devo far venirlo»."},
]},

41: {
"intro": "Vas a elegir entre tres construcciones después de ver, oír y "
         "sentir, cada una con otro enfoque. El castellano casi siempre usa "
         "una sola.",
"blocks": [
 {"h": "Las tres opciones",
  "r": "Tras *vedere, sentire, guardare, ascoltare*: infinitivo, *che* + "
       "indicativo o relativa con *che*. En el habla gana el **infinitivo**.",
  "ex": [["Ho visto Maria *uscire*.", "Vi a María salir."],
         ["Ho visto *che* Maria *usciva*.", "Vi que María estaba saliendo."],
         ["Ho visto Maria *che usciva*.", "Vi a María que salía."]],
  "table": {"head": ["Construcción", "Enfoque", "Ejemplo"],
            "rows": [["+ infinitivo", "el hecho completo", "Ho visto Maria uscire."],
                     ["+ che + indicativo", "lo que constatás (me di cuenta de que)", "Ho visto che Maria usciva."],
                     ["+ che (relativa)", "la acción en curso, sorprendida", "Ho visto Maria che usciva."]]},
  "warn": "Sin *a* delante de la persona: *ho visto Maria uscire*, no «ho "
          "visto a Maria uscire».",
  "more": ["*udire* (oír) funciona igual, pero es de registro escrito."]},

 {"h": "Dónde va el objeto",
  "r": "El sustantivo puede ir antes o después del infinitivo. El pronombre "
       "va **delante del verbo de percepción**.",
  "ex": [["Ho sentito cantare *Maria*.", "Oí cantar a María."],
         ["Ho sentito *Maria* cantare.", "Oí a María cantar."],
         ["*L'ho sentita* cantare.", "La oí cantar."],
         ["*Li ho visti* entrare.", "Los vi entrar."]],
  "warn": "El participio concuerda con el pronombre directo, como siempre: "
          "*l'ho vista uscire*, *li ho sentiti parlare*. Los correctores lo "
          "buscan."},

 {"h": "La pasiva de percepción",
  "r": "Si la acción recae sobre el sujeto: verbo de percepción "
       "**reflexivo** + infinitivo.",
  "ex": [["*Si è sentito chiamare*.", "Oyó que lo llamaban."],
         ["*Mi sono sentito chiamare* per nome.", "Oí que me llamaban por mi nombre."],
         ["*Si è visto rifiutare* la richiesta.", "Vio cómo le rechazaban el pedido."]]},

 {"h": "sentire, un verbo que abarca mucho",
  "r": "*sentire* cubre oír, sentir, probar y enterarse. Con pronombres "
       "forma *sentirsi* y *sentirsela*.",
  "ex": [["Non ti *sento*.", "No te escucho."],
         ["*Senti* che buono!", "¡Probá qué rico!"],
         ["*Ho sentito* che parti.", "Me enteré de que te vas."],
         ["Come *ti senti*?", "¿Cómo te sentís?"]],
  "table": {"head": ["Uso", "Ejemplo", "Castellano"],
            "rows": [["oír", "Non ti sento.", "No te escucho."],
                     ["sentir físicamente", "Sento freddo.", "Tengo frío."],
                     ["probar / oler", "Senti che buono!", "¡Probá qué rico!"],
                     ["saber por alguien", "Ho sentito che parti.", "Me enteré de que te vas."],
                     ["sentirsi", "Come ti senti?", "¿Cómo te sentís?"],
                     ["sentirsela", "Non me la sento.", "No me animo."]]},
  "tip": "*Ci sentiamo!* = «hablamos» (despedida telefónica). *Senti...* "
         "abre un tema, como el «mirá» rioplatense."},

 {"h": "stare a guardare, eccolo che arriva",
  "r": "Quedarse haciendo algo es *stare* + ***a*** + infinitivo, no "
       "gerundio. Y «ahí viene» es *eccolo che* + presente.",
  "ex": [["Stava alla finestra *a guardare* la gente.", "Estaba en la ventana mirando a la gente."],
         ["Non stare lì *a guardarmi*: aiutami!", "No te quedes ahí mirándome: ¡ayudame!"],
         ["Ha passato la giornata *a leggere*.", "Se pasó el día leyendo."],
         ["*Eccola che* arriva.", "Ahí viene."],
         ["*Eccoli che* parlano con Nina.", "Ahí están, hablando con Nina."]],
  "table": {"head": ["Construcción", "Significa", "Ejemplo"],
            "rows": [["stare (lì) a + infinitivo", "quedarse haciendo algo", "Sto qui a guardare il mare."],
                     ["passare il tempo a + infinitivo", "pasarse el tiempo haciendo algo", "Passa la sera a studiare."],
                     ["essere seduto a + infinitivo", "estar sentado haciendo algo", "Erano seduti a giocare a carte."],
                     ["eccolo / eccola che + presente", "ahí está, haciendo algo", "Eccolo che arriva."]]},
  "warn": "El castellano pone gerundio («se pasó el día leyendo»); el "
          "italiano, *a* + infinitivo: *ha passato la giornata a leggere*, "
          "no «leggendo».",
  "qq": [{"prompt": "Traducí: «Se pasa el día mirando la tele.»", "answer": "Passa la giornata a guardare la tv.", "options": ["Passa la giornata a guardare la tv.", "Passa la giornata guardare la tv.", "Passa la giornata di guardare la tv."]},
         {"prompt": "¿Qué significa «Eccola che arriva»?", "answer": "Ahí viene.", "options": ["Ahí viene.", "Ya llegó.", "Va a llegar."]}]},
]},

42: {
"intro": "Vas a usar la preposición correcta entre verbo e infinitivo. No "
         "hay regla: se memoriza, pero por grupos bastante estables.",
"parts": [
 {"h": "Verbos con a y con di + infinitivo", "blocks": [0, 1],
  "ids": ["mj-42-%02d" % n for n in range(1, 6)],
  "match": r"di o a|a \+ infinitivo|pensare|di \+|con di|con a\b|credere y parlare"},
 {"h": "Sin preposición, los que cambian y cómo estudiarlos", "blocks": [2, 3, 4],
  "ids": ["mj-42-06"],
  "match": r"\S"},
 {"h": "El mail formal: régimen y fórmulas", "blocks": [5, 6],
  "ids": ["mj-42-%02d" % n for n in range(7, 15)],
  "match": r"Con la presente|La prego|allegato|Le chiedo|riscontro"},
],
"blocks": [
 {"h": "Verbos con a + infinitivo",
  "r": "Empezar, seguir, lograr, aprender, ayudar y empujar a otro llevan "
       "**a** (*ad* ante vocal, sobre todo ante otra *a*).",
  "ex": [["Ho *cominciato a* studiare italiano.", "Empecé a estudiar italiano."],
         ["Non *riesco a* capire.", "No logro entender."],
         ["Mi sono *messo a* ridere.", "Me puse a reír."],
         ["Mi ha *convinto a* restare.", "Me convenció de quedarme."]],
  "table": {"head": ["Idea", "Verbos", "Ejemplo"],
            "rows": [["empezar / seguir", "cominciare a (empezar a), continuare a (seguir + -ndo), mettersi a (ponerse a)", "Continuo a studiare."],
                     ["lograr / intentar", "riuscire a (lograr), provare a (probar, intentar)", "Provo a dormire."],
                     ["aprender / enseñar / ayudar", "imparare a, insegnare a, aiutare a", "Mi aiuti a cucinare?"],
                     ["empujar a otro", "invitare a (invitar), convincere a (convencer de), costringere a (obligar)", "L'ho invitato a cena."],
                     ["actitud", "abituarsi a (acostumbrarse), rinunciare a (renunciar), decidersi a (decidirse), sbrigarsi a (apurarse)", "Sbrigati a finire!"],
                     ["ir o venir para", "andare a, venire a, restare a (quedarse a)", "Vengo a trovarti."],
                     ["hacer mejor", "fare meglio a (mejor + verbo)", "Faresti meglio a partire."]]},
  "warn": "«Me convenció **de**» y «me obligó **a**»: en italiano los dos "
          "con *a*: *mi ha convinto a restare*."},

 {"h": "Verbos con di + infinitivo",
  "r": "Terminar, dejar, tratar, decidir, pensar, recordar, prometer y las "
       "expresiones con *avere* o *essere* llevan **di**.",
  "ex": [["Ho *smesso di* fumare.", "Dejé de fumar."],
         ["*Cerca di* capire.", "Tratá de entender."],
         ["Ho *deciso di* partire.", "Decidí irme."],
         ["Ho *voglia di* uscire.", "Tengo ganas de salir."],
         ["Alla fine *ha finito per* accettare.", "Al final terminó aceptando."]],
  "table": {"head": ["Idea", "Verbos", "Ejemplo"],
            "rows": [["terminar / dejar", "finire di (terminar de), smettere di (dejar de); finire per = acabar haciendo", "Ho smesso di fumare."],
                     ["intentar / decidir", "cercare di (tratar de), tentare di (intentar), decidere di (decidir)", "Cerca di dormire."],
                     ["pensar / creer / esperar", "pensare di (pensar + verbo), credere di, sperare di", "Spero di vederti."],
                     ["memoria", "dimenticare di (olvidarse de), ricordarsi di (acordarse de)", "Ricordati di chiamare."],
                     ["compromiso", "promettere di (prometer), accettare di (aceptar), rifiutare di (negarse a)", "Ha accettato di venire."],
                     ["pedir o decir a otro", "chiedere di (pedir), dire di (decir que), ordinare di, pregare di (rogar), proibire di (prohibir)", "Gli ho detto di venire."],
                     ["sentimientos", "vergognarsi di (darle vergüenza), stufarsi di (hartarse), sforzarsi di (esforzarse)", "Mi sono stufato di aspettare."],
                     ["expresiones", "avere bisogno di, avere voglia di, avere paura di, essere contento di", "Ho paura di sbagliare."]]},
  "warn": "Donde el castellano no pone nada, el italiano pone *di*: «decidí "
          "irme» → *ho deciso di partire*; «espero verte» → *spero di "
          "vederti*. Pero no con los modales: *voglio partire*.",
  "more": ["«Pedirle a alguien que haga» no lleva *che*: persona con *a* "
           "(indirecto) + *di* + infinitivo: *le ho chiesto di rimanere*, "
           "*gli ho detto di venire*. Con *convincere*, *costringere*, "
           "*invitare* la persona es directa y va *a*: *la costringo a "
           "rimanere*.",
           "Ojo con *decidere di* (decidir) y *decidersi a* (decidirse): *ho "
           "deciso di partire*, *mi sono decisa a lasciarlo*."]},

 {"h": "Verbos sin preposición",
  "r": "**Sin preposición**: los modales (*volere, potere, dovere, sapere*), "
       "*preferire, desiderare, osare* y *basta, bisogna, conviene, è "
       "meglio*.",
  "ex": [["*Preferisco restare* a casa.", "Prefiero quedarme en casa."],
         ["*So nuotare*.", "Sé nadar."],
         ["*Conviene partire* presto.", "Conviene salir temprano."],
         ["*Mi piace leggere*.", "Me gusta leer."]],
  "tip": "Tampoco llevan preposición *fare*, *lasciare*, los de percepción "
         "(*vedo uscire*), *piacere*, *odiare* ni *è necessario, è "
         "importante, sembra* + infinitivo."},

 {"h": "Los que cambian respecto del castellano",
  "r": "Estos verbos rigen **distinto** que en castellano: con otra "
       "preposición o sin ninguna.",
  "ex": [["*Ho sposato* Laura.", "Me casé con Laura."],
         ["*Aspetto* Marco.", "Espero a Marco."],
         ["*Le telefono* stasera.", "La llamo esta noche."],
         ["*Penso a* te.", "Pienso en vos."]],
  "table": {"head": ["Italiano", "Castellano"],
            "rows": [["pensare a qualcosa / pensare di fare", "pensar en algo / pensar hacer"],
                     ["sognare qualcuno", "soñar con alguien"],
                     ["entrare in casa", "entrar a / en casa"],
                     ["salire su un treno", "subir a un tren"],
                     ["innamorarsi di", "enamorarse de"],
                     ["sposare qualcuno", "casarse con alguien"],
                     ["telefonare a qualcuno", "llamar a alguien (gli telefono)"],
                     ["cercare qualcosa / aspettare qualcuno", "buscar algo / esperar a alguien"],
                     ["chiedere a qualcuno di fare", "pedirle a alguien que haga"],
                     ["dipendere da, fidarsi di, accorgersi di", "depender de, fiarse de, darse cuenta de"],
                     ["occuparsi di, servire a, credere in", "ocuparse de, servir para, creer en"],
                     ["credere a qualcuno", "creerle a alguien (gli credo)"],
                     ["pagare qualcosa a qualcuno", "pagarle algo a alguien"],
                     ["partecipare a", "participar en"],
                     ["contare su", "contar con"],
                     ["scusarsi con qualcuno", "pedirle disculpas a alguien"],
                     ["ringraziare qualcuno per / di", "agradecerle algo a alguien"]]},
  "warn": "*Sposare* y *aspettare* van sin *a*: *ho sposato Laura*, *aspetto "
          "Marco*. Y *telefonare* pide indirecto: *le telefono*, nunca «la "
          "telefono»."},

 {"h": "Cómo estudiar esto",
  "r": "No memorices listas: memorizá **la frase entera**, con la "
       "preposición pegada al verbo.",
  "ex": [["Non *riesco a* capire.", "No logro entender."],
         ["Mi sono *abituato ad* alzarmi presto.", "Me acostumbré a levantarme temprano."],
         ["Ho *bisogno di* dormire.", "Necesito dormir."]],
  "tip": "Así la preposición se recupera sola al hablar: sale con la frase."},

 {"h": "Verbos del mail formal",
  "r": "En el mail formal manda el régimen: *pregare* pide objeto directo, *chiedere* indirecto; *rivolgersi* y *provvedere* piden *a*.",
  "ex": [["*La prego di* inviarmi il documento.", "Le ruego que me envíe el documento."],
         ["*Le chiedo di* confermare la data.", "Le pido que confirme la fecha."],
         ["*Mi sono rivolto* all'ufficio competente.", "Me dirigí a la oficina competente."],
         ["*Provvederemo a* rispondere entro una settimana.", "Nos ocuparemos de responder en una semana."],
         ["*Sono tenuto a* informarLa che il termine è scaduto.", "Estoy obligado a informarle que el plazo venció."]],
  "table": {"head": ["Verbo", "Régimen", "Ejemplo"],
            "rows": [["pregare qn di + inf.", "directo", "La prego di attendere."],
                     ["chiedere a qn di + inf.", "indirecto", "Le chiedo di attendere."],
                     ["comunicare a qn che", "indirecto", "Le comunico che la pratica è chiusa."],
                     ["essere tenuto a + inf.", "a", "Siamo tenuti a rispettare il termine."],
                     ["riservarsi di + inf.", "di", "Mi riservo di ricorrere."],
                     ["restare in attesa di + nombre", "di", "Resto in attesa di una risposta."]]},
  "warn": "*La prego* lleva pronombre directo; *Le chiedo*, indirecto. No las mezcles: «la chiedo di» es un error, y «le prego di» no es la norma culta."},

 {"h": "Con la presente, in allegato, in attesa di",
  "r": "Apertura, adjunto y cierre del mail formal son fórmulas fijas: usalas enteras, sin traducir del castellano.",
  "ex": [["*Con la presente* chiedo di essere informato sull'esito.", "Por la presente solicito que se me informe sobre el resultado."],
         ["*In allegato* trova il modulo compilato.", "Adjunto encontrará el formulario completo."],
         ["*Resto a disposizione per* eventuali chiarimenti.", "Quedo a disposición para eventuales aclaraciones."],
         ["Non *sono in grado di* fornire altri dettagli.", "No estoy en condiciones de dar más detalles."],
         ["*In attesa di* Suo riscontro, porgo *distinti saluti*.", "En espera de su respuesta, saludo atentamente."]],
  "table": {"head": ["Fórmula", "Función", "En castellano"],
            "rows": [["con la presente", "abrir el motivo", "por la presente"],
                     ["in allegato", "señalar el adjunto", "adjunto"],
                     ["essere in grado di", "capacidad", "estar en condiciones de"],
                     ["avere la possibilità di", "posibilidad", "tener la posibilidad de"],
                     ["mostrarsi disposto a", "actitud", "mostrarse dispuesto a"],
                     ["resto in attesa di", "cierre", "quedo a la espera de"]]},
  "warn": "En un mail formal, *Lei* y sus formas van con mayúscula: *Le scrivo*, *Suo riscontro*, *informarLa*."},
]},

43: {
"intro": "Vas a aprovechar el infinitivo como sustantivo, como orden "
         "impersonal y en lugar de una subordinada. Acorta las frases y sube "
         "el registro.",
"blocks": [
 {"h": "El infinitivo sustantivado",
  "r": "Con artículo, el infinitivo funciona como **sustantivo masculino**: "
       "*il mangiare*, *il dolce far niente*.",
  "ex": [["*Il camminare* fa bene alla salute.", "Caminar hace bien a la salud."],
         ["Con *l'andare* del tempo.", "Con el paso del tiempo."],
         ["*Sul far* del giorno.", "Al despuntar el día."],
         ["C'era *un continuo andare e venire*.", "Había un ir y venir constante."]],
  "more": ["Es más frecuente que en castellano y suena literario pero "
           "natural."]},

 {"h": "El infinitivo compuesto",
  "r": "*avere* o *essere* + participio. **Obligatorio después de *dopo***, "
       "y frecuente para hablar de algo ya hecho.",
  "ex": [["*Dopo aver mangiato*, siamo usciti.", "Después de comer, salimos."],
         ["*Dopo essere arrivati*, ci siamo riposati.", "Después de llegar, descansamos."],
         ["Credo di *aver capito*.", "Creo haber entendido."],
         ["Mi dispiace di *essere arrivato* tardi.", "Lamento haber llegado tarde."]],
  "warn": "*Dopo* + infinitivo pide el compuesto: *dopo aver...*, *dopo "
          "essere...*. *Prima di* va con el simple (*prima di uscire*), salvo "
          "para subrayar lo terminado: *prima di aver finito*.",
  "tip": "Los pronombres se pegan al auxiliar: *dopo avergli parlato* "
         "(después de hablarle), *grazie di averci aiutato*, *sono contento "
         "di essermi divertito*."},

 {"h": "El infinitivo como orden impersonal",
  "r": "Instrucciones, recetas, carteles y prospectos dan la orden **en "
       "infinitivo**, a nadie en particular.",
  "ex": [["*Non fumare*.", "No fumar."],
         ["*Spingere* / *Tirare*.", "Empujar / Tirar."],
         ["*Cuocere* per dieci minuti.", "Cocinar diez minutos."],
         ["*Agitare* prima dell'uso.", "Agitar antes de usar."]],
  "tip": "Dicho a una persona, *non fumare!* es el imperativo negativo de "
         "*tu*; en un cartel, es impersonal. La forma es la misma."},

 {"h": "En lugar de una subordinada",
  "r": "Con **el mismo sujeto** en los dos verbos, usá infinitivo en vez de "
       "*che* + verbo conjugado.",
  "ex": [["Penso *di partire* domani.", "Pienso salir mañana."],
         ["Sono uscito *senza salutare*.", "Salí sin saludar."],
         ["È troppo tardi *per telefonare*.", "Es muy tarde para llamar."],
         ["*Invece di* lamentarti, aiutami.", "En vez de quejarte, ayudame."],
         ["Non so *come ringraziarti*.", "No sé cómo agradecerte."]],
  "warn": "«Pienso que parto mañana» no se calca: *penso di partire domani*. "
          "*Penso che* va cuando cambia el sujeto.",
  "more": ["Igual que en castellano, después de un interrogativo va el "
           "infinitivo solo: *non so cosa fare* (no sé qué hacer), *mi ha "
           "detto dove andare* (me dijo adónde ir)."],
  "tip": "Cuatro conectores + infinitivo: *per* (finalidad), *senza* "
         "(ausencia), *invece di* (sustitución), *oltre a* (adición)."},
]},

44: {
"intro": "Vas a comprimir dos frases en una con gerundio y participio, el "
         "recurso estrella de la prosa italiana donde el castellano pone "
         "«como», «cuando» o «después de que».",
"parts": [
 {"h": "El gerundio", "blocks": [0, 1, 2, 3],
  "match": r"^(?!.*(particip|concisa|terminación)).*(gerundio|mientras|Cómo lo hacés|\bstare\b|ando\b|endo\b|Continuo a)"},
 {"h": "Los participios", "blocks": [4, 5],
  "match": r"\S"},   # lo demás, como cuando era la última parte
 {"h": "Ironía y sobreentendidos", "blocks": [6],
  "ids": ["pr-44-%02d" % n for n in range(1, 13)],
  "match": r"^(?!)"},
],
"blocks": [
 {"h": "El gerundio simple",
  "r": "*-ando* para *-are*, *-endo* para *-ere* e *-ire*. Irregulares por "
       "la raíz latina: *facendo, dicendo, bevendo, traducendo, ponendo*.",
  "ex": [["*Sbagliando* s'impara.", "Equivocándose se aprende."],
         ["*Essendo* stanco, sono rimasto a casa.", "Como estaba cansado, me quedé en casa."],
         ["Ho capito il problema *facendo* un disegno.", "Entendí el problema haciendo un dibujo."],
         ["*Pur sapendolo*, non ha detto niente.", "Aun sabiéndolo, no dijo nada."]],
  "tip": "*pur* + gerundio = «aunque»: *pur sapendolo* = aunque lo sabía.",
  "table": {"head": ["Valor", "Castellano", "Ejemplo"],
            "rows": [["modo (cómo)", "gerundio, «-ndo»", "Sbagliando s'impara."],
                     ["causa (por qué)", "como, ya que", "Essendo stanco, resto a casa."],
                     ["tiempo (cuándo)", "al, mientras", "Tornando a casa, ho visto Luca."],
                     ["concesión (con pur)", "aunque", "Pur sapendolo, non ha detto niente."]]},
  "more": ["Los pronombres se pegan al final: *sapendolo*, *guardandoti*, "
           "*alzandosi*. Y para «seguir haciendo» no va gerundio sino "
           "*continuare a*: *continuo a studiare* (sigo estudiando)."]},

 {"h": "El gerundio y su sujeto",
  "r": "El gerundio toma **el sujeto** de la principal; en registro escrito "
       "puede llevar uno propio: *essendo Marco malato, restiamo a casa*.",
  "ex": [["*Uscendo* di casa, ho incontrato Marco.", "Al salir de casa, me encontré con Marco."],
         ["*Tornando* a casa, ho visto Luca.", "Volviendo a casa, vi a Luca."],
         ["*Mentre uscivo* di casa, ha cominciato a piovere.", "Cuando salía de casa, empezó a llover."]],
  "warn": "«Uscendo di casa, ha cominciato a piovere» está mal: la lluvia no "
          "salió de casa. Con sujetos distintos, usá *mentre* + verbo "
          "conjugado."},

 {"h": "El gerundio compuesto",
  "r": "*avendo* o *essendo* + participio: expresa **anterioridad**. "
       "Registro escrito y elegante.",
  "ex": [["*Avendo finito* il lavoro, sono uscito.", "Como había terminado el trabajo, salí."],
         ["*Essendo arrivati* tardi, abbiamo perso il treno.", "Como llegamos tarde, perdimos el tren."],
         ["Non *avendo capito*, ho chiesto di nuovo.", "Como no había entendido, pregunté de nuevo."]],
  "tip": "Con *essendo*, el participio concuerda con el sujeto: *essendo "
         "arrivata tardi, Maria...*"},

 {"h": "stare + gerundio: ya lo viste en la semana 6",
  "r": "Repaso de la semana 6: *stare* + gerundio = acción **en desarrollo**. "
       "Con *stavo* va al pasado: la acción interrumpida.",
  "ex": [["*Stavo dormendo* quando hai chiamato.", "Estaba durmiendo cuando llamaste."],
         ["*Stavamo uscendo* quando è arrivato Luca.", "Estábamos saliendo cuando llegó Luca."]],
  "warn": "Se usa mucho menos que el «estar + -ndo» castellano. «Estoy "
          "estudiando italiano este año» es *studio italiano quest'anno*.",
  "qq": [{"prompt": "Completá (dormire)", "stem": "Quando mi hai chiamato, ___.", "answer": "stavo dormendo", "options": ["stavo dormendo", "sto dormendo", "stavo dormito"]}]},

 {"h": "El participio pasado absoluto",
  "r": "Un participio solo, al principio, = «después de» o «como». "
       "Concuerda con su sustantivo: *letta la lettera*.",
  "ex": [["*Finito* il lavoro, siamo usciti.", "Terminado el trabajo, salimos."],
         ["*Arrivata* la primavera, tutto cambia.", "Llegada la primavera, todo cambia."],
         ["*Letta* la lettera, si è messa a piangere.", "Leída la carta, se puso a llorar."],
         ["Una volta *capito* il meccanismo, è facile.", "Una vez entendido el mecanismo, es fácil."]],
  "tip": "Es la construcción más culta de la semana: un solo participio "
         "reemplaza a «después de que...».",
  "more": ["Con verbos transitivos concuerda con el **objeto** (*letta la "
           "lettera*); con intransitivos, con el sujeto (*arrivata la "
           "primavera*)."]},

 {"h": "El participio presente",
  "r": "*-ante* / *-ente*. Casi siempre ya es **adjetivo o sustantivo**: "
       "*interessante, seguente, cantante, insegnante*.",
  "ex": [["Un libro *interessante*.", "Un libro interesante."],
         ["La settimana *seguente*.", "La semana siguiente."],
         ["I cittadini *residenti* all'estero.", "Los ciudadanos residentes en el exterior."],
         ["Le persone *aventi* diritto.", "Las personas que tienen derecho."]],
  "more": ["Como verbo activo sobrevive en el registro jurídico y "
           "administrativo: *i cittadini residenti all'estero*, *le persone "
           "aventi diritto*."]},

 {"h": "Ironía y sobreentendidos",
  "r": "La ironía dice **lo contrario** con tono de elogio: *complimenti!*, *bella "
       "roba!*. *Non male* elogia **quitándole peso**.",
  "ex": [["Due ore di ritardo? *Complimenti!*", "¿Dos horas tarde? ¡Felicitaciones! (es un reproche)"],
         ["Ha perso di nuovo le chiavi: *bella roba!*", "Perdió otra vez las llaves: ¡qué lindo! (es una queja)"],
         ["Il tuo risotto? *Non male*, davvero.", "¿Tu risotto? Nada mal, en serio (es un elogio)."],
         ["Pagare io? *Ma va'!*", "¿Pagar yo? ¡Ni loco! (rechazo en broma)"]],
  "warn": "La ironía depende del tono: por escrito, a un desconocido o a un "
          "superior se lee como agresión. Con ellos, decilo directo.",
  "tip": "*Figurati!* puede ser «¡no es nada!» (a un gracias) o «¡ni lo sueñes!»: "
         "*Lui, aiutarmi? Figurati!*",
  "more": ["*Understatement*: *non è proprio un genio* (no es muy vivo), *non è il "
           "massimo* (es bastante malo), *mica male* (bastante bueno). Decir menos "
           "para decir más es muy italiano y muy de la charla."]},
]},

45: {
"intro": "Vas a usar los verbos pronominales idiomáticos (*andarsene, "
         "farcela, prendersela*): no se deducen del verbo suelto y están en "
         "todas las conversaciones.",
"blocks": [
 {"h": "Los imprescindibles",
  "r": "Verbo + *ci*, *ne*, *la* o dos partículas: **significan otra cosa** "
       "que el verbo solo.",
  "ex": [["*Me ne vado*, ciao.", "Me voy, chau."],
         ["Non *ce la faccio* più.", "No puedo más."],
         ["Non *te la prendere*.", "No te ofendas."],
         ["*Ci vuole* pazienza.", "Hace falta paciencia."]],
  "table": {"head": ["Verbo", "Sentido", "Ejemplo"],
            "rows": [["andarsene", "irse", "Me ne vado, ciao."],
                     ["farcela", "lograrlo, poder con algo", "Non ce la faccio più."],
                     ["avercela con", "estar enojado con", "Ce l'hai con me?"],
                     ["prendersela", "ofenderse", "Non te la prendere."],
                     ["cavarsela", "arreglárselas", "Me la cavo con l'inglese."],
                     ["sentirsela", "animarse a", "Non me la sento di dirglielo."],
                     ["smetterla", "dejar de (algo molesto)", "Smettila!"],
                     ["piantarla", "cortarla", "Piantala!"],
                     ["metterci", "tardar", "Ci metto un'ora."],
                     ["volerci", "hacer falta", "Ci vuole pazienza."],
                     ["entrarci", "tener que ver", "Non c'entra niente."],
                     ["starci", "estar de acuerdo, caber", "Ci sto!"],
                     ["infischiarsene", "no importarle nada", "Me ne infischio."],
                     ["prendersela comoda", "tomárselo con calma", "Se la prende comoda."]]},
  "tip": "No los deduzcas: aprendelos como palabras nuevas, con su frase de "
         "ejemplo."},

 {"h": "Cómo se conjugan",
  "r": "El reflexivo cambia; *la*, *ne*, *ci* **quedan fijos**. Con "
       "reflexivo, *essere*; sin él, el auxiliar del verbo: *ce l'ho fatta*.",
  "ex": [["*Me ne sono andato* / *Ce ne siamo andati*.", "Me fui / Nos fuimos."],
         ["*Ce l'ho fatta*!", "¡Lo logré!"],
         ["*Se l'è presa*.", "Se ofendió."],
         ["Non *me la sono sentita*.", "No me animé."],
         ["*Ci ho messo* un'ora.", "Tardé una hora."]],
  "warn": "*volerci* concuerda con lo que hace falta: *ci vuole un'ora*, *ci "
          "vogliono due ore*. *metterci* se conjuga con quien tarda: *ci "
          "metto*, *ci metti*, *ci mettete*.",
  "tip": "En imperativo las partículas se pegan: *vattene!* (¡andate!), "
         "*andatevene!*, *smettila!*. Con negación, delante o pegadas: *non "
         "te la prendere* o *non prendertela*."},

 {"h": "volerci vs metterci: qué hace falta, cuánto tardás",
  "r": "*Volerci* es **impersonal**: lo que hace falta es el sujeto y "
       "concuerda. *Metterci* es **personal**: alguien tarda, y lo marca "
       "la persona.",
  "ex": [["*Ci vuole* un'ora per arrivare.", "Se necesita una hora para llegar."],
         ["*Ci vogliono* due ore di treno.", "Hacen falta dos horas de tren."],
         ["*Ci metto* un'ora ad arrivare.", "Tardo una hora en llegar."],
         ["*Ci abbiamo messo* tre ore.", "Tardamos tres horas."],
         ["*Ci sono volute* due ore.", "Hicieron falta dos horas."]],
  "table": {"head": ["Punto", "volerci", "metterci"],
            "rows": [["Sujeto", "la cosa necesaria", "quien tarda"],
                     ["Concuerda", "ci vuole / ci vogliono", "con la persona: ci metto, ci mette"],
                     ["Compuesto", "essere: ci sono volute", "avere: ci ho messo"],
                     ["Español", "hacer falta, llevar (tiempo)", "tardar"]]},
  "warn": "«Ci voglio un'ora» no existe: *volerci* nunca se conjuga con "
          "quien tarda. Para «tardo» decí *ci metto*; para «hace falta» "
          "decí *ci vuole*."},

 {"h": "El participio en -a",
  "r": "Con las formas en *la*, el participio **termina en -a**: concuerda "
       "con esa *la* que no se refiere a nada concreto.",
  "ex": [["Ce l'ho *fatta*.", "Lo logré."],
         ["Se l'è *cavata*.", "Se las arregló."],
         ["Se l'è *presa*.", "Se ofendió."]],
  "warn": "«Ce l'ho fatto» es la falta típica. Es un automatismo: fijalo "
          "repitiendo *ce l'ho fatta* hasta que salga solo."},

 {"h": "averci: el ci de apoyo",
  "r": "En el habla, *avere* delante de *lo, la, li, le, ne* suma un *ci* sin "
       "significado: *ce l'ho*.",
  "ex": [["Hai una penna? — Sì, *ce l'ho*.", "¿Tenés una lapicera? — Sí, tengo."],
         ["Le chiavi? Non *ce le ho*.", "¿Las llaves? No las tengo."],
         ["*Ce n'hai* ancora?", "¿Te queda?"]],
  "warn": "Sin el *ce*, «l'ho» suena antinatural. *Ci ho fame* también se "
          "oye, pero es regional: no lo escribas."},

 {"h": "Otras construcciones fijas de nivel",
  "r": "Perífrasis frecuentes: **aspecto** (a punto de, empezar, seguir) y "
       "**matiz** (terminar por, no hacer más que).",
  "ex": [["*Sto per* uscire.", "Estoy por salir."],
         ["*Ha finito per* accettare.", "Terminó por aceptar."],
         ["Non *fa che* lamentarsi.", "No hace más que quejarse."],
         ["*Hai un bel dire*, non ti crede nessuno.", "Por más que digas, nadie te cree."]],
  "table": {"head": ["Expresión", "Sentido", "Ejemplo"],
            "rows": [["stare per + infinito", "estar a punto de", "Sto per uscire."],
                     ["finire per + infinito", "terminar por", "Ha finito per accettare."],
                     ["essere sul punto di", "estar por", "Era sul punto di piangere."],
                     ["mettersi a", "ponerse a", "Si è messo a ridere."],
                     ["continuare a", "seguir + gerundio", "Continua a piovere."],
                     ["non fare che + infinito", "no hacer más que", "Non fa che lamentarsi."],
                     ["avere un bel + infinito", "por más que", "Hai un bel dire."],
                     ["fare a meno di", "prescindir de, arreglarse sin", "Non posso fare a meno del caffè."]]},
  "tip": "*Sto per uscire* = «estoy por salir»: así se dice el futuro "
         "inminente. *stare* + gerundio NO sirve para eso."},

 {"h": "stare a, finire con l', infischiarsene, prendersela comoda",
  "r": "Cuatro construcciones de conversación que no se deducen: *stare a* "
       "+ infinitivo, *finire con l'* + infinitivo, *infischiarsene di* y "
       "*prendersela comoda*.",
  "ex": [["*Sta a te* decidere.", "Te toca a vos decidir."],
         ["*Non sta a me* giudicare.", "No me corresponde a mí juzgar."],
         ["Ha finito *con l'accettare*.", "Terminó aceptando."],
         ["*Me ne infischio* delle critiche.", "Me importan un bledo las críticas."],
         ["*Se l'è presa comoda*, come sempre.", "Se lo tomó con calma, como siempre."]],
  "table": {"head": ["Construcción", "Sentido", "Ejemplo"],
            "rows": [["stare a + infinito", "corresponder, tocar", "Sta a te scegliere."],
                     ["finire con l' + infinito", "terminar + gerundio (= finire per)", "Finirai con l'ammetterlo."],
                     ["infischiarsene di", "importarle un bledo", "Se ne infischia del regolamento."],
                     ["prendersela comoda", "tomárselo con calma", "Se la prende comoda."],
                     ["prendersela con", "agarrársela con", "Se la prende con tutti."]]},
  "warn": "*Prendersela comoda* no es *prendersela* («ofenderse»): el "
          "adjetivo *comoda* cambia el sentido. *Infischiarsene* es "
          "coloquial; en registro más neutro, *non curarsi di*."},
]},

46: {
"intro": "Con un sufijo, el italiano agrega tamaño, cariño, desprecio o "
         "ironía sin sumar adjetivos. Quien no usa alterados suena "
         "traducido.",
"blocks": [
 {"h": "Los sufijos alterativos",
  "r": "*-ino, -etto, -ello* achican o dan cariño; *-one* agranda; *-accio* "
       "desprecia; *-uccio* es cariñoso.",
  "ex": [["Abbiamo un gatt*ino*.", "Tenemos un gatito."],
         ["Vivono in una cas*etta* al mare.", "Viven en una casita en la playa."],
         ["È un libr*one* di mille pagine.", "Es un librazo de mil páginas."],
         ["Che temp*accio*!", "¡Qué tiempo horrible!"]],
  "table": {"head": ["Sufijo", "Valor", "Ejemplos"],
            "rows": [["-ino / -ina", "pequeño, afectuoso", "gattino (gatito), sorellina (hermanita)"],
                     ["-etto / -etta", "pequeño, simpático", "casetta (casita), poveretto (pobrecito)"],
                     ["-ello / -ella", "pequeño, a veces despectivo", "alberello (arbolito), cattivello (pícaro)"],
                     ["-one / -ona", "grande, aumentativo", "librone (librazo), pigrone (vagoneta)"],
                     ["-accio / -accia", "feo, malo, despectivo", "tempaccio (tiempo horrible), parolaccia (mala palabra)"],
                     ["-uccio / -uccia", "cariñoso, un poco menor", "caruccio (lindito), Mariuccia (Mariíta)"],
                     ["-astro / -astra", "despectivo; con colores, «-uzco»", "poetastro (poeta malo), giallastro (amarillento)"],
                     ["-otto / -ottello", "algo grande o regordete, con cariño", "grassottello (gordito), ragazzotto (muchachote)"]]},
  "warn": "*-one* suele volver masculino un sustantivo femenino: *la porta → "
          "il portone*, *la donna → il donnone*.",
  "more": ["A veces se mete una consonante de apoyo: *cane → cagnolino* "
           "(perrito), *posto → posticino* (lugarcito lindo), *pezzo → "
           "pezzetto*. Y *simpatico → simpaticone*: alguien muy simpático."]},

 {"h": "Los falsos alterados",
  "r": "No todo *-ino* u *-one* es alterado: *il tacchino* (el pavo) no es "
       "un *tacco* chico.",
  "ex": [["Mi si è staccato un bott*one*.", "Se me salió un botón."],
         ["Il post*ino* è già passato.", "El cartero ya pasó."],
         ["Un muro di matt*oni*.", "Una pared de ladrillos."],
         ["Una fetta di focacc*ia*.", "Una porción de focaccia (un pan)."]],
  "more": ["Otros: *il burrone* (el barranco), *il montone* (el carnero), "
           "*il mattone* (el ladrillo, no un *matto* grande). Ante la duda, "
           "buscalos en el diccionario como palabra propia."]},

 {"h": "Se aplica a casi todo",
  "r": "Los sufijos van con sustantivos, con adjetivos (*carino, piccolino*) "
       "y hasta con adverbios (*benino, pianino, prestino*).",
  "ex": [["Prendiamo un *caffettino*?", "¿Tomamos un cafecito?"],
         ["Arrivo fra un *attimino*.", "Llego en un segundito."],
         ["Che *freddino*!", "¡Qué fresquito!"],
         ["Ha una *macchinona*.", "Tiene un autazo."],
         ["Che *giornataccia*!", "¡Qué día de porquería!"]]},

 {"h": "Prefijos que multiplican el vocabulario",
  "r": "*ri-* repite; *s-*, *in-* y *dis-* niegan; *stra-*, *super-* e "
       "*iper-* exageran; *mal-* = mal.",
  "ex": [["Te lo *ri*spiego.", "Te lo vuelvo a explicar."],
         ["Il treno era *stra*pieno.", "El tren estaba llenísimo."],
         ["Sono *s*contento del risultato.", "Estoy descontento con el resultado."],
         ["È un ragazzo *mal*educato.", "Es un chico maleducado."]],
  "table": {"head": ["Prefijo", "Sentido", "Ejemplo"],
            "rows": [["ri-", "de nuevo", "rifare (rehacer), rivedere (volver a ver)"],
                     ["s-", "negación o contrario", "scontento (descontento), sfortuna (mala suerte)"],
                     ["in- / im- / dis-", "negación", "incapace, impossibile, disonesto"],
                     ["pre-", "antes", "prevedere (prever), prenotare (reservar)"],
                     ["stra- / super- / iper-", "exceso", "strapieno (llenísimo), ipersensibile"],
                     ["mal-", "mal", "maleducato, malinteso (malentendido)"]]},
  "tip": "*ri-* va con casi cualquier verbo: *te lo rispiego* (te lo vuelvo "
         "a explicar), *ci risentiamo* (volvemos a hablar). Ahorra "
         "perífrasis."},

 {"h": "Interfijos y ortografía con h",
  "r": "Muchas bases piden un **interfijo** (*-c-, -ol-, -er-, -icci-*). "
       "Y *c/g* duras conservan su sonido con una **h**.",
  "ex": [["Un *bastoncino* di pane.", "Un palito de pan."],
         ["Ha un *cagnolino* nero.", "Tiene un perrito negro."],
         ["Una *pioggerellina* fastidiosa.", "Una llovizna molesta."],
         ["È un *amichetto* di mio figlio.", "Es un amiguito de mi hijo."],
         ["Ce n'è *pochino*.", "Queda muy poquito."]],
  "table": {"head": ["Base", "Alterado", "Qué pasa"],
            "rows": [["bastone", "bastoncino", "interfijo -c-"],
                     ["fiore", "fiorellino", "interfijo -ell-"],
                     ["cane", "cagnolino", "cambia la raíz y suma -ol-"],
                     ["pioggia", "pioggerellina", "interfijo -er- y -ell-"],
                     ["porto", "porticciolo", "interfijo -icci- + -olo"],
                     ["amico, poco", "amichetto, pochino", "c dura + i/e: entra la h"],
                     ["lago, lungo", "laghetto, lunghetto", "g dura + i/e: entra la h"],
                     ["camicia, bacio", "camicetta, bacino", "-cia / -cio pierde la i"]]},
  "warn": "No hay regla que prediga el interfijo: se aprende palabra por "
          "palabra. Y cuidado: *cane → cagnolino*, no *canino* (¡es el "
          "colmillo!)."},

 {"h": "Contraste con el español: no calques el diminutivo",
  "r": "El español achica casi todo con *-ito*; el italiano **elige** el sufijo "
       "según la palabra. Algunos alterados no son de tamaño.",
  "ex": [["Abitiamo in una *casetta*.", "Vivimos en una casita."],
         ["Che *libraccio*!", "¡Qué libro espantoso!"],
         ["Sei un *chiacchierone*.", "Sos un charlatán."],
         ["Non fare il *brontolone*.", "No seas gruñón."],
         ["È un *mangione*.", "Es un glotón."]],
  "table": {"head": ["Español", "Italiano", "Trampa"],
            "rows": [["casita", "casetta", "*casina* es regional; *casino* es un lío"],
                     ["poquito", "pochino, pochetto", "el español pone -qu-; el italiano, -ch-"],
                     ["librazo", "librone", "*libraccio* es un libro malo, no grande"]]},
  "warn": "*-one* sobre un **verbo** no agranda: nombra a quien hace algo "
          "seguido (*chiacchierare → chiacchierone*, *brontolare → "
          "brontolone*). Suele criticar, pero entre amigos es cariñoso."},

 {"h": "Prefissoidi: elementos griegos y latinos",
  "r": "Los *prefissoidi* (*auto-, tele-, micro-, multi-, eco-*) son "
       "raíces cultas que se pegan a otras palabras. Casi todos coinciden "
       "con el español.",
  "ex": [["Faccio *tele*lavoro due giorni.", "Trabajo dos días a distancia."],
         ["Ha poca *auto*stima.", "Tiene poca autoestima."],
         ["Scaldalo nel *micro*onde.", "Calentalo en el microondas."],
         ["Vive in un quartiere *multi*etnico.", "Vive en un barrio multiétnico."],
         ["Ho preso il *tele*comando.", "Agarré el control remoto."]],
  "table": {"head": ["Prefissoide", "Sentido", "Ejemplos"],
            "rows": [["auto-", "de uno mismo", "autostima, autocritica"],
                     ["tele-", "a distancia", "telelavoro, telecomando"],
                     ["micro- / macro-", "muy pequeño / muy grande", "microonde, macroeconomia"],
                     ["multi- / poli-", "muchos", "multietnico, polifunzionale"],
                     ["eco-", "ambiente", "ecosistema, ecoturismo"]]},
  "tip": "No alteran una palabra como *-ino*: **crean** una nueva. Ojo: *il "
         "telecomando* es el control remoto."},
]},

47: {
"intro": "Cantidades, medidas y números: frases cortas y muy frecuentes que "
         "conviene memorizar en bloque. Acá se nota si manejás el idioma o "
         "lo traducís.",
"blocks": [
 {"h": "Cantidades aproximadas",
  "r": "*una decina, una ventina, un centinaio, un migliaio, un paio* + "
       "**di** + sustantivo: *una ventina di persone*.",
  "ex": [["C'erano *una ventina di* persone.", "Había unas veinte personas."],
         ["Ho *un paio di* domande.", "Tengo un par de preguntas."],
         ["Ha *centinaia di* libri.", "Tiene cientos de libros."],
         ["Costa *circa* dieci euro.", "Cuesta unos diez euros."]],
  "table": {"head": ["Forma", "Sentido", "Ejemplo"],
            "rows": [["una decina, una ventina", "unos diez, unos veinte", "una ventina di persone"],
                     ["un centinaio / centinaia", "un centenar / centenares", "centinaia di libri"],
                     ["un migliaio / migliaia", "un millar / miles", "migliaia di euro"],
                     ["un paio / paia", "un par / pares", "un paio di scarpe"],
                     ["una dozzina", "una docena", "una dozzina di uova"],
                     ["circa / all'incirca", "aproximadamente", "circa dieci"],
                     ["più o meno", "más o menos", "più o meno alle tre"]]},
  "warn": "No te olvides el *di*: *una decina di amici*. Y el plural es "
          "femenino en *-a*: *le centinaia*, *le migliaia*, *due paia*."},

 {"h": "Fracciones",
  "r": "*la metà* (la mitad), *un terzo*, *un quarto*, *tre quarti*, *due "
       "terzi*. Y *il doppio*, *il triplo*.",
  "ex": [["Ho letto *metà* del libro.", "Leí la mitad del libro."],
         ["*Un quarto* d'ora.", "Un cuarto de hora."],
         ["*Due terzi* degli studenti sono d'accordo.", "Dos tercios de los estudiantes están de acuerdo."],
         ["Costa *il doppio*.", "Cuesta el doble."]],
  "warn": "*Metà* es sustantivo; *mezzo* es adjetivo y concuerda: *mezzo litro*, *un'ora e mezza*, *due chili e mezzo*."},

 {"h": "Porcentajes",
  "r": "Llevan **artículo masculino**: *il 20%*, *l'8%*. El verbo va en "
       "singular o concuerda con el sustantivo que sigue.",
  "ex": [["*Il 30%* degli studenti sono stranieri.", "El 30% de los estudiantes son extranjeros."],
         ["*Il 20%* degli italiani vive qui.", "El 20% de los italianos vive acá."],
         ["Ha preso *l'8%* dei voti.", "Sacó el 8% de los votos."]],
  "warn": "Casi siempre con artículo. Sin él se ve en titulares: «30% degli studenti a rischio». Tras preposición se contrae: *del 20%*, *al 5%*.",
  "tip": "Se lee *per cento*, en dos palabras: *il 25%* = *il venticinque "
         "per cento*."},

 {"h": "Pesos, medidas y compra",
  "r": "En el mostrador se pide por *etto* (100 g). El precio por unidad va "
       "con *a* + artículo: *al chilo*.",
  "ex": [["*Un chilo di* mele, per favore.", "Un kilo de manzanas, por favor."],
         ["*Due etti* di prosciutto.", "Doscientos gramos de jamón."],
         ["*Mezzo litro* di latte.", "Medio litro de leche."],
         ["*Quant'è*?", "¿Cuánto es?"],
         ["Costa dieci euro *al chilo*.", "Cuesta diez euros el kilo."]],
  "tip": "Se pide mucho por *etti*, aunque también se oye «duecento grammi». Igual *al giorno*, "
         "*all'ora*: *a* + artículo donde el castellano dice «por» o «el»."},

 {"h": "Operaciones y números escritos",
  "r": "*più* (+), *meno* (−), *per* (×), *diviso* (÷), *fa* o *uguale* (=). "
       "Decimales con **coma**, miles con **punto**.",
  "ex": [["Due *più* due *fa* quattro.", "Dos más dos son cuatro."],
         ["Dieci *diviso* due fa cinque.", "Diez dividido dos da cinco."],
         ["3,5 = tre *virgola* cinque", "tres coma cinco"],
         ["Costa *1.500* euro.", "Cuesta mil quinientos euros."]],
  "warn": "Ojo con *per*: en una cuenta es «por» (×), no «para»: *tre per "
          "tre fa nove*."},

 {"h": "Ordinales",
  "r": "Del 1 al 10, palabras propias; desde el 11, número + *-esimo* sin la vocal final (salvo *-tre* y *-sei*: *ventitreesimo*).",
  "ex": [["Abita al *terzo* piano.", "Vive en el tercer piso."],
         ["È la *quinta* volta che chiamo.", "Es la quinta vez que llamo."],
         ["Sono arrivato *undicesimo*.", "Llegué undécimo."],
         ["Siamo nel *ventunesimo* secolo.", "Estamos en el siglo veintiuno."],
         ["Il *primo* maggio è festa.", "El primero de mayo es feriado."]],
  "table": {"head": ["Número", "Ordinal", "Nota"],
            "rows": [["1 a 10", "primo, secondo, terzo, quarto, quinto, sesto, settimo, ottavo, nono, decimo", "concuerdan: la terza volta"],
                     ["11, 12, 16", "undicesimo, dodicesimo, sedicesimo", "se cae la -i final"],
                     ["20, 30", "ventesimo, trentesimo", "se cae la vocal final"],
                     ["21, 23", "ventunesimo, ventitreesimo", "-uno y -tre se conservan"],
                     ["100, 1000", "centesimo, millesimo", "se cae la vocal final"]]},
  "warn": "En las fechas solo el día uno es ordinal: *il primo maggio*, pero *il due maggio*."},

 {"h": "Siglos, décadas y años",
  "r": "Del XIII al XX el siglo se nombra por sus cientos: *il Cinquecento*, "
       "el XVI. Los años llevan artículo: *nel 1861*.",
  "ex": [["Michelangelo dipinse la Sistina *nel Cinquecento*.", "Miguel Ángel pintó la Sixtina en el siglo XVI."],
         ["*Il Novecento* è *il ventesimo secolo*.", "El Novecientos es el siglo XX."],
         ["È nato *nel* 1990.", "Nació en 1990."],
         ["Musica degli *anni Sessanta*.", "Música de los años sesenta."]],
  "table": {"head": ["Italiano", "Significa", "Ejemplo"],
            "rows": [["il Trecento", "el siglo XIV (los 1300)", "Dante scrisse nel Trecento."],
                     ["il Quattrocento", "el siglo XV (los 1400)", "Firenze nel Quattrocento."],
                     ["il Cinquecento", "el siglo XVI (los 1500)", "Pittori del Cinquecento."],
                     ["il Settecento", "el siglo XVIII (los 1700)", "Una chiesa del Settecento."],
                     ["il Novecento", "el siglo XX (los 1900)", "La letteratura del Novecento."],
                     ["il ventesimo secolo", "el siglo XX (con ordinal)", "Nel ventesimo secolo."],
                     ["gli anni Sessanta", "los años sesenta", "Negli anni Sessanta."]]},
  "warn": "*il Novecento* no es el siglo IX sino el XX: cuenta los cientos "
          "(1900). Para el ordinal, *il ventesimo secolo*.",
  "qq": [{"prompt": "¿Qué es «il Settecento»?", "answer": "el siglo XVIII", "options": ["el siglo XVIII", "el siglo VII", "el siglo XVII"]},
         {"prompt": "Completá", "stem": "È nato ___ 1985.", "answer": "nel", "options": ["nel", "in", "il"]}]},

 {"h": "Partitivo y cuantificadores",
  "r": "*del, della, dei, delle* + sustantivo = un poco o unos. Se suman *un po' di*, *qualche* y *alcuni*.",
  "ex": [["Compro *dell'*acqua e *delle* mele.", "Compro agua y unas manzanas."],
         ["Ho *un po' di* tempo.", "Tengo un poco de tiempo."],
         ["Ho invitato *alcuni* amici.", "Invité a algunos amigos."],
         ["*Qualche* amico è venuto.", "Vinieron algunos amigos."]],
  "table": {"head": ["Forma", "Va con", "Ejemplo"],
            "rows": [["del, dello, della, dell'", "incontable singular", "Bevo del vino."],
                     ["dei, degli, delle", "plural indefinido", "Ho comprato dei libri."],
                     ["un po' di", "incontable", "un po' di sale"],
                     ["qualche", "singular, sentido plural", "qualche libro"],
                     ["alcuni, alcune", "plural", "alcuni libri"]]},
  "warn": "*Qualche* lleva sustantivo y verbo en singular: *qualche amico è venuto*, no «qualche amici sono venuti».",
  "tip": "En negativas el partitivo suele omitirse: *non ho pane*, más natural que «non ho del pane»."},

 {"h": "Cifras en la prensa económica",
  "r": "El periodismo económico usa porcentajes, puntos y proporciones: *un aumento del 3%*, *di due punti percentuali*.",
  "ex": [["I prezzi sono aumentati *del 3,2%*.", "Los precios aumentaron un 3,2%."],
         ["Il tasso è passato *dal 4 al 6 per cento*.", "La tasa pasó del 4 al 6 por ciento."],
         ["Un calo *di due punti percentuali*.", "Una caída de dos puntos porcentuales."],
         ["*Oltre un terzo* delle imprese ha chiuso.", "Más de un tercio de las empresas cerró."],
         ["Il fatturato è *quasi raddoppiato*.", "La facturación casi se duplicó."]],
  "table": {"head": ["Expresión", "Sentido", "Ejemplo"],
            "rows": [["aumento / calo di + %", "subida / caída", "un calo del 2%"],
                     ["passare da... a...", "pasar de... a...", "dal 4 al 6%"],
                     ["oltre, più di / meno di, quasi, circa", "límites y aproximación", "oltre il 10%"],
                     ["dimezzare, raddoppiare, triplicare", "reducir a la mitad, duplicar, triplicar", "i costi sono triplicati"],
                     ["il doppio, il triplo", "múltiplos", "il doppio del 2010"]]},
  "warn": "*Del 3%* o *di due punti* dicen cuánto cambió; *al 4%* dice dónde se llegó: *è sceso al 4%*."},
]},

48: {
"intro": "Vas a mover el orden de las palabras para marcar el foco, como "
         "hace el italiano en el habla, la literatura y el periodismo.",
"blocks": [
 {"h": "Dislocación a la izquierda",
  "r": "El objeto va **al principio** y se retoma con un pronombre. Es la "
       "estructura más frecuente del italiano hablado.",
  "ex": [["*Il pane lo* compro io.", "El pan lo compro yo."],
         ["*A Marco* non *gli* ho detto niente.", "A Marco no le dije nada."],
         ["*Di soldi* non *ne* ho.", "Plata no tengo."],
         ["*Questo film l'*ho già visto.", "Esta película ya la vi."]],
  "tip": "El rioplatense hace lo mismo («el pan lo compro yo»): te sale "
         "gratis. Usala, sin ella el italiano suena a libro de texto.",
  "warn": "El objeto directo va sin *a*: *Marco lo conosco bene* («a Marco "
          "lo conozco»). Y el participio concuerda con el pronombre: *le "
          "chiavi, dove le hai messe?*"},

 {"h": "Dislocación a la derecha",
  "r": "El pronombre va primero y el elemento se agrega **al final**, como "
       "aclaración. Marca oralidad e intimidad.",
  "ex": [["Non *ci* credo, *a queste storie*.", "No me las creo, esas historias."],
         ["*L'*ho vista ieri, *Maria*.", "La vi ayer, a María."],
         ["Ce *l'*hai, *il biglietto*?", "¿Lo tenés, el boleto?"]]},

 {"h": "Frase escindida: è... che",
  "r": "*è* + elemento + *che* pone un elemento en **foco exclusivo**, como "
       "«es X el que...».",
  "ex": [["*È* Marco *che* ha telefonato.", "Fue Marco el que llamó."],
         ["*È* per questo *che* sono venuto.", "Es por esto que vine."],
         ["*Sono* io *che* ho sbagliato.", "Soy yo el que se equivocó."],
         ["*È stato* Marco *a* telefonare.", "Fue Marco el que llamó."]],
  "tip": "Variante muy común con sujeto: *è stato Marco a telefonare* "
         "(*a* + infinitivo). Evita el *che* y suena muy natural.",
  "more": ["Pariente cercano: *c'è* + persona + *che*, para contar una "
           "novedad: *c'è tuo fratello che ti cerca* (te está buscando tu "
           "hermano), *c'è un signore che vuole parlarti*."]},

 {"h": "Sujeto después del verbo",
  "r": "Con intransitivos y verbos de acontecimiento, el sujeto nuevo va "
       "**detrás del verbo**. Con *c'è / ci sono* es obligatorio.",
  "ex": [["È arrivato *Marco*.", "Llegó Marco."],
         ["Mi ha telefonato *tua sorella*.", "Me llamó tu hermana."],
         ["C'è *un problema*.", "Hay un problema."],
         ["Manca *il sale*.", "Falta la sal."]],
  "tip": "Igual que en castellano: «llegó Marco», no «Marco llegó», cuando "
         "Marco es la noticia."},

 {"h": "Anteponer para enfatizar",
  "r": "Un adjetivo o un complemento adelantado **enfatiza**: lo que va "
       "primero es lo que importa.",
  "ex": [["*Bello*, questo quadro!", "¡Lindo, este cuadro!"],
         ["*Stanco* sono, non malato.", "Cansado estoy, no enfermo."],
         ["*Di lavorare* non ha nessuna voglia.", "Ganas de trabajar no tiene ninguna."]],
  "warn": "Son órdenes marcados: usalos para enfatizar, no por defecto. Un "
          "texto entero invertido suena artificial."},

 {"h": "Tu, Lei, voi: cambiar de registro en la misma charla",
  "r": "Se empieza con *Lei* y se pasa al *tu* cuando **lo propone** el mayor o "
       "el de más rango: *diamoci del tu*.",
  "ex": [["Possiamo *darci del tu*?", "¿Podemos tutearnos?"],
         ["*Mi dia pure del tu*, signora.", "Tutéeme nomás, señora."],
         ["Buongiorno, *dottore*. Ha un minuto?", "Buen día, doctor. ¿Tiene un minuto?"],
         ["Ragazzi, *venite* anche *voi*?", "Chicos, ¿vienen ustedes también?"]],
  "warn": "Pasar al *tu* sin que te lo ofrezcan, con alguien mayor o en una "
          "oficina, se nota enseguida. Ante la duda, *Lei*.",
  "tip": "*Dottore* / *dottoressa* sirve para cualquier graduado universitario, "
         "no solo para médicos: en una oficina es la fórmula segura.",
  "more": ["El *voi* de cortesía para una sola persona (*come state?* a un señor) "
           "sobrevive en el sur y en el habla de los mayores; en el norte suena "
           "anticuado. Para ustedes, plural, *voi* es lo normal en todas partes."]},

 {"h": "El italiano neostandard: entendelo siempre, escribilo con cuidado",
  "r": "En la charla se oyen usos que el escrito formal no admite. **Reconocelos** "
       "al oír; en un texto formal, la forma estándar.",
  "table": {"head": ["Se oye", "Por", "Escrito formal"],
            "rows": [["gli dico (a ella)", "le dico", "Le dico la verità."],
                     ["gli dico (a ellos)", "dico loro", "Dico loro la verità."],
                     ["lui, lei, loro sujeto", "egli, ella, essi (textos formales o antiguos)", "Lui è partito: vale en los dos"],
                     ["penso che è vero", "penso che sia vero", "Penso che sia vero."],
                     ["a me mi piace", "a me piace / mi piace", "Mi piace."],
                     ["ci ho fame", "ho fame", "Ho fame."],
                     ["che polivalente: la casa che ci abito", "in cui abito", "La casa in cui abito."],
                     ["mo', tipo, cioè", "adesso, come, ossia", "Adesso."]]},
  "ex": [["A Maria *le* ho detto di venire.", "A María le dije que viniera. En la charla se oye «gli ho detto» también para ella."],
         ["*A me piace* il mare.", "A mí me gusta el mar. En la charla: «a me mi piace»."],
         ["Penso che *sia* vero.", "Creo que es cierto. En la charla: «penso che è vero»."]],
  "warn": "En el examen y en un mail formal estos usos restan puntos. En la charla, "
          "corregirlos al otro suena pedante.",
  "tip": "*Lui*, *lei* y *loro* como sujeto ya son estándar: *egli* y *ella* solo "
         "aparecen en textos viejos o muy formales."},
]},

49: {
"intro": "Vas a escribir un texto argumentativo de nivel C1: conectores de "
         "registro alto, fórmulas impersonales, cohesión sin repeticiones y "
         "la estructura que esperan los examinadores.",
"blocks": [
 {"h": "Conectores de registro alto",
  "q": [{"prompt": "¿Qué conector sirve para oponer?", "answer": "tuttavia", "options": ["tuttavia", "inoltre", "pertanto"]}, {"prompt": "¿Qué conector expresa una consecuencia?", "answer": "pertanto", "options": ["pertanto", "altresì", "ovvero"]}],
  "r": "Un conector por función, **variado**: escribir culto es elegir bien "
       "el conector, no escribir difícil.",
  "ex": [["*Inoltre*, i costi sono aumentati.", "Además, los costos aumentaron."],
         ["*Tuttavia*, il problema resta.", "Sin embargo, el problema sigue."],
         ["*Pertanto* la proposta va respinta.", "Por lo tanto, la propuesta debe rechazarse."],
         ["*In definitiva*, la riforma è necessaria.", "En definitiva, la reforma es necesaria."]],
  "table": {"head": ["Función", "Formas", "Ejemplo"],
            "rows": [["añadir", "inoltre (además), per di più (encima), altresì (asimismo), non solo... ma anche", "Inoltre, i costi sono aumentati."],
                     ["sumar dos", "sia... sia / sia... che (tanto... como), come pure (y también), né... né (ni... ni)", "Parla sia inglese sia francese."],
                     ["oponer", "tuttavia (sin embargo), ciononostante (pese a eso), per contro / d'altro canto (en cambio, por otro lado)", "Tuttavia, il problema resta."],
                     ["conceder", "certo... tuttavia (es cierto que... pero), se è vero che... è altrettanto vero che", "Certo, è caro; tuttavia conviene."],
                     ["excluir", "tranne, salvo (excepto), a parte (aparte de)", "Mangio tutto tranne il pesce."],
                     ["causa", "in quanto (ya que), poiché, dal momento che (dado que), a causa di (a causa de)", "Non è venuto in quanto era malato."],
                     ["consecuencia", "di conseguenza (en consecuencia), pertanto (por lo tanto), ne consegue che (se deduce que), sicché (así que)", "Pertanto la proposta va respinta."],
                     ["ejemplificar", "ad esempio (por ejemplo), in particolare, segnatamente (en especial), basti pensare a (basta pensar en)", "Basti pensare a Roma."],
                     ["reformular", "ovvero, vale a dire, in altri termini (o sea, es decir, en otras palabras)", "Il 2%, ovvero pochissimo."],
                     ["concluir", "in conclusione, in definitiva (en definitiva), tutto sommato (a fin de cuentas), in ultima analisi", "In definitiva, è necessaria."]]},
  "warn": "No repitas *ma... ma... ma*: alterná *tuttavia*, *per contro*, "
          "*d'altro canto*. La variedad es lo que se nota."},

 {"h": "Conectores con congiuntivo: ya los viste en la semana 28",
  "r": "Los de la semana 28 (*benché, affinché, purché, prima che*) más los "
       "del registro formal: *qualora, senza che, a condizione che*.",
  "ex": [["*Qualora ci fossero* problemi, avvisateci.", "En caso de que hubiera problemas, avísennos."],
         ["È uscito *senza che* nessuno lo *vedesse*.", "Salió sin que nadie lo viera."]],
  "table": {"head": ["Conector nuevo", "Significa", "Ejemplo"],
            "rows": [["qualora, nel caso in cui", "en caso de que", "Qualora piovesse, restiamo."],
                     ["a condizione che", "con la condición de que", "Vengo a condizione che tu venga."],
                     ["senza che", "sin que", "È uscito senza che lo vedessi."],
                     ["mettiamo che, supponiamo che", "supongamos que", "Mettiamo che tu vinca."]]},
  "warn": "El conector elegante con indicativo detrás anula el efecto: "
          "«benché è tardi» es un error."},

 {"h": "Las fórmulas impersonales",
  "r": "Distancian al autor y elevan el texto. **Una por párrafo** alcanza.",
  "table": {"head": ["Fórmula", "Significa", "Ejemplo"],
            "rows": [["va detto che", "hay que decir que", "Va detto che il tema è complesso."],
                     ["va rilevato che", "cabe señalar que", "Va rilevato che i dati mancano."],
                     ["si tratta di", "se trata de", "Si tratta di una scelta difficile."],
                     ["è opportuno", "es oportuno, conviene", "È opportuno intervenire."],
                     ["occorre notare", "cabe notar", "Occorre notare un aumento."],
                     ["risulta evidente", "resulta evidente", "Risulta evidente che serve tempo."],
                     ["è lecito supporre", "es lícito suponer", "È lecito supporre che cresca."],
                     ["non si può prescindere da", "no se puede prescindir de", "Non si può prescindere dai costi."],
                     ["giova ricordare", "conviene recordar", "Giova ricordare che è gratis."]]},
  "ex": [["*Va detto che* il problema è complesso.", "Hay que decir que el problema es complejo."],
         ["*Si tratta di* una questione delicata.", "Se trata de un asunto delicado."],
         ["*Occorre precisare* che non tutti concordano.", "Cabe precisar que no todos coinciden."]],
  "warn": "Evitá el «io penso» en cada frase: en un texto argumentativo, "
          "*va detto che* o *risulta evidente* sostienen la tesis sin "
          "primera persona."},

 {"h": "Cohesión: no repetir",
  "r": "No repitas el sustantivo: usá **pronombres**, sinónimos, una "
       "palabra más general (*la questione*, *il fenomeno*) o demostrativos "
       "(*ciò, tale*).",
  "ex": [["Il governo ha approvato la riforma; *tale provvedimento* entrerà in vigore a gennaio.", "El gobierno aprobó la reforma; dicha medida entrará en vigor en enero."],
         ["*Ciò* comporta un aumento dei costi.", "Ello implica un aumento de costos."],
         ["L'inquinamento cresce: *il fenomeno* preoccupa gli esperti.", "La contaminación crece: el fenómeno preocupa a los expertos."]],
  "more": ["Otros recursos: *il suddetto* (el mencionado), *quest'ultimo* "
           "(este último) y los pronombres *lo, ne, ci*: *se ne parla "
           "poco*, *ci torneremo*."]},

 {"h": "Estructura del testo argomentativo",
  "r": "Cinco partes, en este orden. **Cuatro párrafos bien conectados** "
       "valen más que ocho sueltos.",
  "ex": [["*A mio avviso*, la riforma è necessaria.", "En mi opinión, la reforma es necesaria."],
         ["*Certo*, i costi sono alti; *tuttavia* i vantaggi sono maggiori.", "Es cierto que los costos son altos; sin embargo, las ventajas son mayores."],
         ["*In conclusione*, conviene investire nella scuola.", "En conclusión, conviene invertir en la escuela."]],
  "table": {"head": ["Parte", "Qué hace"],
            "rows": [["introduzione", "plantea el tema"],
                     ["tesi", "tu posición, explícita"],
                     ["argomenti", "dos o tres, con ejemplos"],
                     ["controargomento", "lo reconocés y lo refutás: *certo..., tuttavia...*"],
                     ["conclusione", "retoma la tesis sin repetirla textualmente"]]}},

 {"h": "Nominalización: del verbo al sustantivo",
  "r": "En registro alto la acción se vuelve sustantivo: *i prezzi sono aumentati* → *l'aumento dei prezzi*.",
  "ex": [["*L'aumento dei prezzi* preoccupa le famiglie.", "El aumento de los precios preocupa a las familias."],
         ["*La chiusura della fabbrica* ha lasciato senza lavoro cento persone.", "El cierre de la fábrica dejó sin trabajo a cien personas."],
         ["*Con l'introduzione* di nuove regole, il sistema è cambiato.", "Con la introducción de nuevas reglas, el sistema cambió."],
         ["*La riduzione della spesa* è stata approvata.", "La reducción del gasto fue aprobada."]],
  "table": {"head": ["Verbo", "Sustantivo", "Cómo se forma"],
            "rows": [["ridurre, introdurre", "la riduzione, l'introduzione", "-zione"],
                     ["decidere", "la decisione", "-sione"],
                     ["migliorare", "il miglioramento", "-mento"],
                     ["chiudere", "la chiusura", "-ura"],
                     ["crescere, perdere", "la crescita, la perdita", "-ita (femenino)"]]},
  "warn": "El castellano conserva el verbo (*al llegar*); el italiano prefiere el sustantivo: *all'arrivo del treno*, no «all'arrivare»."},

 {"h": "Malgrado, laddove, ove",
  "r": "*Malgrado* concede como *nonostante*; *laddove* y *ove* condicionan o contrastan. Los tres son de registro escrito.",
  "ex": [["*Malgrado* le difficoltà, il progetto va avanti.", "A pesar de las dificultades, el proyecto sigue."],
         ["*Laddove* possibile, si preferisce il lavoro da remoto.", "Cuando es posible, se prefiere el trabajo remoto."],
         ["*Ove* necessario, il termine può essere prorogato.", "De ser necesario, el plazo puede prorrogarse."],
         ["*Laddove* il primo studio indicava un calo, il secondo rileva una crescita.", "Mientras el primer estudio indicaba una caída, el segundo registra un aumento."]],
  "table": {"head": ["Conector", "Valor", "Ejemplo"],
            "rows": [["malgrado + sustantivo", "concesión (= nonostante)", "malgrado la pioggia"],
                     ["laddove + adjetivo", "condición (= se, qualora)", "laddove possibile"],
                     ["laddove + indicativo", "contraste (= mentre)", "laddove il primo indicava..."],
                     ["ove + adjetivo o congiuntivo", "condición (= qualora)", "ove necessario"]]},
  "warn": "Son de escritura formal: dichos en voz alta suenan a decreto. Para el lugar, en el habla, *dove*."},

 {"h": "Calcos del español que bajan el registro",
  "r": "Cuatro conectores calcados del castellano bajan la nota. Cambian el modo o la forma entera.",
  "ex": [["*Benché sia* stanco, continua a lavorare.", "Aunque está cansado, sigue trabajando."],
         ["*Anche se* è stanco, continua a lavorare.", "Aunque está cansado, sigue trabajando."],
         ["*Grazie al fatto che* ha studiato, ha superato l'esame.", "Gracias a que estudió, aprobó el examen."],
         ["*Per quanto riguarda* i costi, il quadro è chiaro.", "En cuanto a los costos, el panorama es claro."]],
  "table": {"head": ["Castellano", "Calco (error)", "Italiano"],
            "rows": [["aunque esté cansado", "anche se sia stanco", "benché sia stanco / anche se è stanco"],
                     ["a fin de que entiendas", "per che tu capisca", "affinché tu capisca"],
                     ["antes de que llegue", "prima di che arrivi", "prima che arrivi"],
                     ["gracias a que", "grazie a che", "grazie al fatto che"]]},
  "warn": "*Benché* va con congiuntivo (o condicional: *benché preferirei restare*); *anche se*, con indicativo, salvo hipótesis: *anche se fosse vero*."},
]},

50: {
"intro": "Vas a esquivar la última trampa, la que parece más fácil: los "
         "falsos amigos, y a elegir el registro justo para cada situación.",
"parts": [
 {"h": "Falsos amigos y pares que el castellano no distingue", "blocks": [0, 1, 2],
  "match": r"significa|falso|Verdadero|burro|salire"},
 {"h": "Registro y preposiciones de nivel", "blocks": [3, 4],
  "match": r"preposici|\bdi\b|\bda\b|\bsu\b|\bfra\b"},
],
"blocks": [
 {"h": "Los clásicos que hay que saber",
  "r": "Se parecen a una palabra castellana y **significan otra cosa**. "
       "Aprendé también la palabra italiana para lo que creías.",
  "ex": [["Passami *il burro*.", "Pasame la manteca."],
         ["*Sono imbarazzata*.", "Estoy avergonzada."],
         ["*Salgo* sul treno.", "Me subo al tren."],
         ["Mi fa male la *gamba*.", "Me duele la pierna."]],
  "table": {"head": ["Italiano", "Significa", "No significa"],
            "rows": [["burro", "manteca", "burro (= asino)"],
                     ["salire", "subir", "salir (= uscire)"],
                     ["aceto", "vinagre", "aceite (= olio)"],
                     ["guardare", "mirar", "guardar (= tenere, conservare)"],
                     ["prima", "antes", "prima (= cugina)"],
                     ["pronto", "listo; ¿hola? (al teléfono)", "pronto, enseguida (= presto)"],
                     ["largo", "ancho", "largo (= lungo)"],
                     ["esito", "resultado", "éxito (= successo)"],
                     ["imbarazzata", "avergonzada", "embarazada (= incinta)"],
                     ["subire", "padecer", "subir (= salire)"],
                     ["topo", "ratón", "topo (= talpa)"],
                     ["gamba", "pierna", "gamba (= gambero)"],
                     ["caldo", "calor / caliente", "caldo (= brodo)"],
                     ["equipaggio", "tripulación", "equipaje (= bagaglio)"],
                     ["cartone", "cartón / dibujo animado", "cartón de bingo (= cartella)"],
                     ["negozio", "negocio (tienda)", "negocio como trato (= affare)"]]},
  "warn": "*Sono imbarazzata* = «estoy avergonzada», no «embarazada». Y *il "
          "burro* en el plato es manteca. Estos dos producen las anécdotas."},

 {"h": "Segunda tanda, más sutil",
  "r": "Verbos que parecen transparentes y **no lo son**. Mirá la columna de "
       "la derecha: ahí está el error.",
  "ex": [["*Attenda* un momento, per favore.", "Espere un momento, por favor."],
         ["*Ho assistito* all'incidente.", "Presencié el accidente."],
         ["*Pretendo* una risposta.", "Exijo una respuesta."],
         ["L'*hanno licenziato*.", "Lo despidieron."]],
  "table": {"head": ["Italiano", "Significa", "Ojo"],
            "rows": [["attendere", "esperar", "atender = servire, assistere"],
                     ["assistere a", "presenciar", "asistir a clase = frequentare"],
                     ["pretendere", "exigir", "pretender (aspirar) = aspirare a"],
                     ["sopportare", "aguantar (a alguien, el dolor)", "sostener un peso = reggere"],
                     ["ricordare", "recordar, recordarle algo a alguien", "recordame que llame = ricordami di chiamare"],
                     ["accostare", "acercar, arrimar", "acostar = mettere a letto"],
                     ["licenziare", "despedir", "licenciarse = laurearsi"],
                     ["fermare", "detener", "firmar = firmare"],
                     ["salire su", "subirse a", "salir = uscire"],
                     ["rimanere / restare", "quedarse", "restar = sottrarre"],
                     ["tornare", "volver", "tornarse = diventare"],
                     ["cercare", "buscar", "cerca (adverbio) = vicino"],
                     ["lasciare", "dejar algo o a alguien", "dejar de = smettere di"],
                     ["rubare", "robar", "robarle algo a alguien = rubare qualcosa a qualcuno"],
                     ["andare via", "irse", "también andarsene"]]}},

 {"h": "Palabras que el castellano no distingue",
  "q": [{"prompt": "¿Cuál está bien? «¿Venís a la fiesta? — Sí, voy.»", "answer": "Sì, vengo.", "options": ["Sì, vengo.", "Sì, vado.", "Sì, sto."]}, {"prompt": "¿Cuál está bien? «¿Conocés a Marco?»", "answer": "Conosci Marco?", "options": ["Conosci Marco?", "Sai Marco?", "Conosci a Marco?"]}],
  "r": "Donde el castellano usa una palabra, el italiano **elige entre dos**.",
  "ex": [["*Conosci* Marco?", "¿Conocés a Marco?"],
         ["*Sai* dov'è la stazione?", "¿Sabés dónde está la estación?"],
         ["Stasera *vengo* da te.", "Esta noche voy a tu casa."],
         ["*Portami* l'acqua, per favore.", "Traeme el agua, por favor."]],
  "table": {"head": ["Par", "Diferencia"],
            "rows": [["sapere / conoscere", "saber un dato / conocer a alguien o un lugar"],
                     ["portare / prendere", "llevar o traer / tomar, agarrar, ir a buscar"],
                     ["andare / venire", "ir / ir hacia donde está el que escucha"],
                     ["buono / bravo", "bueno de sabor o carácter / hábil (*un bravo cuoco*)"]]},
  "warn": "Hacia el interlocutor se usa *venire*, aunque en castellano "
          "digamos «voy»: *Vieni alla festa? — Sì, vengo.* «Sì, vado» ahí es "
          "un error."},

 {"h": "Registro: la misma idea, tres niveles",
  "r": "Para el C1 no hace falta hablar siempre formal: hace falta "
       "**elegir** el nivel según la situación.",
  "ex": [["Ho *un sacco di* lavoro.", "Tengo un montón de trabajo."],
         ["Non è *mica* facile.", "No es nada fácil."],
         ["In ufficio c'è *un casino*.", "En la oficina hay un lío bárbaro."],
         ["La situazione è *notevolmente* peggiorata.", "La situación empeoró notablemente."]],
  "table": {"head": ["Coloquial", "Neutro", "Formal", "Significa"],
            "rows": [["un sacco di", "molto", "notevolmente", "mucho, un montón"],
                     ["roba", "cose", "elementi, aspetti", "cosas"],
                     ["mica", "non... affatto", "in alcun modo", "para nada"],
                     ["beccare", "prendere", "cogliere", "agarrar, pescar"],
                     ["fregare", "ingannare", "raggirare", "engañar, embromar"],
                     ["un casino", "molto disordine", "notevole confusione", "un lío"],
                     ["dai!", "su!", "la prego", "¡dale!, ¡vamos!"]]},
  "tip": "Reconocer que *un casino* es coloquial y *notevole confusione* es "
         "de informe es exactamente lo que evalúa el examen oral."},

 {"h": "Preposiciones de nivel: da, di, a, fra",
  "r": "*da*: para qué sirve o un rasgo; *di*: material o contenido; *a*: el "
       "dibujo; *fra* + tiempo: dentro de.",
  "ex": [["una tazza *da* tè / una tazza *di* tè", "una taza para té / una taza de té (llena)"],
         ["la ragazza *dagli* occhi verdi", "la chica de ojos verdes"],
         ["una giacca *di* lana", "una campera de lana"],
         ["una gonna *a* quadri", "una pollera a cuadros"],
         ["Torno *fra* un'ora.", "Vuelvo dentro de una hora."]],
  "table": {"head": ["Preposición", "Significa", "Ejemplo"],
            "rows": [["da (origen, por dónde)", "de, desde; por", "Siamo entrati *dalla* finestra."],
                     ["da (para qué sirve)", "para, de", "occhiali *da* sole, qualcosa *da* bere"],
                     ["da (rasgo)", "de, con", "la ragazza *dagli* occhi verdi"],
                     ["da (etapa de la vida)", "de, cuando era", "*Da* studente viaggiavo."],
                     ["di (material, contenido)", "de", "un anello *d'*oro, una tazza *di* tè"],
                     ["a (dibujo, forma)", "a", "una camicia *a* quadri"],
                     ["su (tema)", "sobre", "un film *sulla* guerra"],
                     ["su (medio, vehículo)", "en", "*sul* giornale, *sull'*autobus"],
                     ["su (cantidad aproximada)", "alrededor de", "Costa *sui* cento euro."],
                     ["fra / tra (tiempo, distancia)", "dentro de; a", "*fra* un'ora, *fra* due chilometri"],
                     ["fra / tra (lugar, grupo)", "entre", "*fra* Genova e Livorno"],
                     ["per (lugar sin rumbo)", "por, en", "*per* strada, *per* terra"]]},
  "warn": "*fra* o *tra* + tiempo = dentro de (*torno fra un'ora*). *Vado da "
          "Marco* = voy a lo de Marco; *vado a Roma*, *vado in centro*.",
  "more": ["Delante de un pronombre tónico, *dopo, senza, dietro, dentro, "
           "verso, sopra, sotto* suelen sumar *di* (*senza te* también se oye): *senza di te* (sin vos), *dopo "
           "di me*, *dietro di te*. Con sustantivo, no: *senza musica*, "
           "*dopo cena*, *dietro la porta*.",
           "Muchos adjetivos tienen su preposición: *interessato a*, *deciso "
           "a*, *soddisfatto di*, *pieno di*, *innamorato di*, *sposato "
           "con*, *gentile con*, *portato per* (tener facilidad para)."]},
]},

51: {
"intro": "Sin teoría nueva: vas a repasar con listas de control todo lo que "
         "suele fallar y volver a las semanas donde algo no te cierre.",
"parts": [
 {"h": "Lista de control: congiuntivo", "blocks": [0],
  "match": r"congiuntivo|subjuntivo|subordinante|«se»"},
 {"h": "Lista de control: tiempos", "blocks": [1],
  "match": r"condicional|condizionale|futuro|imperfetto|passato|remoto|puedo / podría"},
 {"h": "Pronombres y las faltas más caras", "blocks": [2, 3, 4],
  "match": r"\S"},
 {"h": "Repaso C1: causativo, pasiva, dislocaciones, periodo mixto", "blocks": [5, 6, 7],
  "ids": ["mj-51-%02d" % n for n in range(1, 15)],
  "match": r"causativ|dislocaci|periodo misto"},
],
"blocks": [
 {"h": "Lista de control: congiuntivo",
  "r": "Opinión, duda, deseo, emoción o voluntad → **congiuntivo**. Recorré "
       "la tabla de arriba abajo antes de decidir el modo.",
  "ex": [["Credo che *sia* vero.", "Creo que es verdad."],
         ["Spero *di finire* presto.", "Espero terminar pronto."],
         ["Volevo che tu *venissi*.", "Quería que vinieras."],
         ["È l'unico che mi *capisca*.", "Es el único que me entiende."]],
  "table": {"head": ["Si...", "Entonces"],
            "rows": [["verbo de opinión, duda, deseo, emoción o voluntad", "congiuntivo"],
                     ["sujetos distintos", "che + congiuntivo"],
                     ["mismo sujeto", "di + infinito"],
                     ["principal en pasado + verbo que pide congiuntivo", "congiuntivo imperfetto o trapassato"],
                     ["benché, affinché, nonostante, prima che, senza che, a meno che non", "congiuntivo sí o sí"],
                     ["superlativo relativo o l'unico che", "congiuntivo"]]}},

 {"h": "Lista de control: tiempos",
  "r": "Las ocho frases en las que **más se falla**. Si dudás, buscá la tuya "
       "acá.",
  "ex": [["Ha detto che *sarebbe venuto*.", "Dijo que vendría."],
         ["Se *avessi* tempo, *andrei*.", "Si tuviera tiempo, iría."],
         ["*Studio* italiano *da* due anni.", "Hace dos años que estudio italiano."],
         ["*Dopo essere uscito*, ho chiamato Luca.", "Después de salir, llamé a Luca."]],
  "table": {"head": ["Si querés decir", "Usá"],
            "rows": [["dijo que vendría", "disse che sarebbe venuto"],
                     ["si tuviera, iría", "se avessi, andrei"],
                     ["si hubiera tenido, habría ido", "se avessi avuto, sarei andato"],
                     ["hace dos años que estudio", "studio da due anni"],
                     ["estaba comiendo cuando llamó", "stavo mangiando quando ha chiamato"],
                     ["antes de salir", "prima di uscire"],
                     ["después de salir", "dopo essere uscito"],
                     ["hay que hacerlo", "va fatto / bisogna farlo"]]}},

 {"h": "Lista de control: pronombres",
  "q": [{"prompt": "¿Cuál está bien? «Te lo digo.»", "answer": "Te lo dico.", "options": ["Te lo dico.", "Ti lo dico.", "Lo ti dico."]}, {"prompt": "¿Cuál está bien? «Tengo tres» (hermanos).", "answer": "Ne ho tre.", "options": ["Ne ho tre.", "Ho tre.", "Li ho tre."]}],
  "r": "Pronombres **delante** del verbo conjugado; **pegados** al "
       "infinitivo, gerundio e imperativo informal. Con modal, los dos: *lo devo fare*, *devo farlo*.",
  "ex": [["*Te lo* dico domani.", "Te lo digo mañana."],
         ["*Gliel'*ho già detto.", "Ya se lo dije."],
         ["Quanti fratelli hai? — *Ne* ho tre.", "¿Cuántos hermanos tenés? — Tengo tres."],
         ["Le ragazze? *Le* ho *viste* ieri.", "¿Las chicas? Las vi ayer."]],
  "table": {"head": ["Punto", "Regla"],
            "rows": [["combinados", "me lo, te la, ce ne, ve li, se ne: la i pasa a e"],
                     ["gli + lo", "se pega: glielo, gliela, gliene"],
                     ["ne", "obligatorio con una cantidad sin su sustantivo: ne ho tre"],
                     ["ci", "lugar y complementos con a / in / su"],
                     ["participio", "concuerda con lo, la, li, le y con essere"]]}},

 {"h": "Las quince faltas más caras",
  "r": "Quince errores que **suelen bajar la nota**. Leelos en voz alta "
       "hasta que la forma correcta te salga sola.",
  "ex": [["Credo che *sia* così.", "Creo que es así."],
         ["*Mi sono lavato* le mani.", "Me lavé las manos."],
         ["*Si vendono* libri usati.", "Se venden libros usados."],
         ["*Qual è* il problema?", "¿Cuál es el problema?"]],
  "table": {"head": ["Error", "Correcto"],
            "rows": [["credo che è", "credo che sia"],
                     ["mi ho lavato", "mi sono lavato"],
                     ["se avrei", "se avessi"],
                     ["ha detto che verrebbe (se oye en el habla)", "ha detto che sarebbe venuto (forma estándar)"],
                     ["si vende libri", "si vendono libri"],
                     ["dopo mangiare", "dopo aver mangiato"],
                     ["ho tre (de algo ya nombrado)", "ne ho tre"],
                     ["vedo a Marco", "vedo Marco"],
                     ["mi libro", "il mio libro"],
                     ["qualche amici", "qualche amico"],
                     ["facilemente", "facilmente"],
                     ["qual'è", "qual è (sin apóstrofo)"],
                     ["parleremo (por «hablaríamos»)", "parleremmo"],
                     ["sto studiando quest'anno (no es falta)", "studio quest'anno (más natural)"],
                     ["poso (por «puedo»)", "posso, con doble s"]]}},

 {"h": "Cómo llegar al jefe final",
  "r": "Antes del examen, **gimnasio de verbos**: congiuntivo imperfetto y "
       "trapassato, las formas que menos se automatizan.",
  "ex": [["Se *fossi* in te, ripasserei.", "Yo que vos, repasaría."],
         ["Pensavo che *fosse* già *partito*.", "Pensaba que ya se había ido."],
         ["Se *avessi studiato*, avrei passato l'esame.", "Si hubiera estudiado, habría aprobado el examen."]],
  "tip": "Después repasá esta hoja en voz alta: decir las trampas en voz alta "
         "las fija mejor que releerlas en silencio."},

 {"h": "Repaso: causativo y pasiva",
  "r": "Causativo: *fare* + infinitivo. Pasivas: *essere*, *venire* o *andare* + participio, o *si* + verbo.",
  "ex": [["*Ho fatto riparare* il tetto dal muratore.", "Mandé a arreglar el techo al albañil."],
         ["Il lavoro *è stato consegnato* ieri.", "El trabajo fue entregado ayer."],
         ["Il modulo *va compilato* entro venerdì.", "El formulario debe completarse antes del viernes."],
         ["*Si vendono* case in centro.", "Se venden casas en el centro."]],
  "table": {"head": ["Forma", "Valor", "Ejemplo"],
            "rows": [["fare + infinito", "hacer hacer, mandar a hacer", "Ho fatto riparare l'auto."],
                     ["essere + participio", "acción hecha o estado", "La porta è chiusa."],
                     ["venire + participio", "acción en curso", "Viene pubblicato oggi."],
                     ["andare + participio", "obligación o pérdida", "Va fatto subito."],
                     ["si passivante", "el verbo concuerda con el objeto", "Si vendono case."]]},
  "warn": "En el *si passivante* el verbo concuerda con lo que se vende: *si vende una casa*, *si vendono case*."},

 {"h": "Repaso: dislocaciones y foco",
  "r": "Dislocar es adelantar el elemento y retomarlo con un pronombre. La escindida pone el foco: *è... che*.",
  "ex": [["*Il pane lo* compro io.", "El pan lo compro yo."],
         ["*A Marco gliel'*ho già detto.", "A Marco ya se lo dije."],
         ["*L'*ho letto, *il libro*.", "Lo leí, el libro."],
         ["*È* Marco *che* ha telefonato.", "Fue Marco el que llamó."]],
  "warn": "Con el objeto adelantado como tema, el pronombre es obligatorio: *il pane lo compro*. Sin pronombre, solo como foco contrastivo: *IL PANE compro, non la pasta*."},

 {"h": "Repaso: periodo mixto y concesión",
  "r": "Periodo mixto: condición y efecto en tiempos distintos, como pasado y presente: *se avessi studiato, ora sarei laureato*. Concesión: *benché* + congiuntivo.",
  "ex": [["*Se avessi studiato*, ora *sarei* laureato.", "Si hubiera estudiado, ahora estaría recibido."],
         ["*Se fossi* più paziente, *avresti evitato* quell'errore.", "Si fueras más paciente, habrías evitado ese error."],
         ["*Sebbene fosse* stanco, ha finito il lavoro.", "Aunque estaba cansado, terminó el trabajo."],
         ["*Malgrado* la pioggia, siamo usciti.", "A pesar de la lluvia, salimos."],
         ["*Nonostante costi* molto, lo compro.", "Aunque cuesta mucho, lo compro."]],
  "table": {"head": ["Tipo", "Estructura", "Ejemplo"],
            "rows": [["real", "se + indicativo, indicativo", "Se piove, resto a casa."],
                     ["posible", "se + congiuntivo imperfetto, condizionale presente", "Se avessi tempo, verrei."],
                     ["irreal pasado", "se + trapassato, condizionale passato", "Se avessi saputo, sarei venuto."],
                     ["mixto", "se + trapassato, condizionale presente", "Se avessi studiato, ora sarei laureato."],
                     ["concesión", "sebbene, benché, nonostante + congiuntivo", "Benché sia tardi, resto."]]},
  "warn": "Después de *se* hipotético va congiuntivo, nunca condicional: «se avrei tempo» no existe."},
]},

52: {
"intro": "El examen del año: cuarenta preguntas, todo el programa, sin "
         "ayudas. Esta hoja es el mapa completo de lo que cubriste en 52 "
         "semanas.",
"parts": [
 {"h": "Repaso: el sistema verbal y las cinco reglas", "blocks": [0, 1],
  "match": r"presente|essere|avere|plural|artículo|masculino|adjetivo|passato prossimo|futuro|condicional simple|condizionale presente|imperfetto|pronombre|reflexiv|piace"},
 {"h": "Repaso: lo que separa un B2 de un C1", "blocks": [2, 3, 4],
  "match": r"\S"},
],
"blocks": [
 {"h": "El sistema verbal entero",
  "q": [{"prompt": "¿Qué forma es «che io parlassi»?", "answer": "congiuntivo imperfetto", "options": ["congiuntivo imperfetto", "condizionale presente", "indicativo imperfetto"]}, {"prompt": "¿Qué forma toma el imperativo de Lei?", "answer": "la del congiuntivo presente", "options": ["la del congiuntivo presente", "la del indicativo presente", "la del condizionale"]}],
  "r": "Cuatro modos finitos y tres formas no finitas. **Todos** entran en "
       "el examen.",
  "ex": [["Vorrei che tu *parlassi* più piano.", "Quisiera que hablaras más despacio."],
         ["Quando *ebbe finito*, uscì.", "Cuando hubo terminado, salió."],
         ["*Si accomodi*, prego.", "Pase, por favor."],
         ["*Avendo capito* tutto, ha firmato.", "Como había entendido todo, firmó."]],
  "table": {"head": ["Modo", "Tiempos", "Ejemplo (parlare)"],
            "rows": [["Indicativo", "presente, imperfetto, passato prossimo, trapassato prossimo, passato remoto, trapassato remoto, futuro semplice, futuro anteriore", "parlo, parlavo, ho parlato, avevo parlato, parlai, ebbi parlato, parlerò, avrò parlato"],
                     ["Congiuntivo", "presente, passato, imperfetto, trapassato", "che parli, che abbia parlato, che parlassi, che avessi parlato"],
                     ["Condizionale", "presente, passato", "parlerei, avrei parlato"],
                     ["Imperativo", "tu, noi, voi (informal); Lei (= congiuntivo)", "parla!, parliamo!, parlate!, parli!"],
                     ["Formas no finitas", "infinito, gerundio, participio (simples y compuestos)", "parlare, aver parlato, parlando, avendo parlato, parlato"]]},
  "more": ["«No finitas» quiere decir que no se conjugan por persona: *parlare* "
           "o *parlando* sirven igual para *io*, *tu* o *loro*. Los modos "
           "finitos, en cambio, cambian con cada persona."]},

 {"h": "Las cinco reglas que sostienen todo",
  "q": [{"prompt": "Futuro visto desde el pasado.", "stem": "Disse che ___.", "answer": "sarebbe venuto", "options": ["sarebbe venuto", "verrebbe", "verrà"]}, {"prompt": "Completá el período hipotético.", "stem": "Se ___ tempo, verrei.", "answer": "avessi", "options": ["avessi", "avrei", "ho avuto"]}],
  "r": "Si dudás, volvé a estas cinco: resuelven **la mayoría** de las "
       "preguntas.",
  "ex": [["Maria *è arrivata* tardi.", "María llegó tarde."],
         ["Penso che *abbia* ragione.", "Pienso que tiene razón."],
         ["Disse che *sarebbe venuto*.", "Dijo que vendría."],
         ["Se *avessi* tempo, verrei.", "Si tuviera tiempo, vendría."]],
  "table": {"head": ["Qué decide", "Regla"],
            "rows": [["el auxiliar → la concordancia", "con essere, el participio sigue al sujeto"],
                     ["la subjetividad → el modo", "opinión, deseo, duda y emoción piden congiuntivo"],
                     ["la principal → la subordinada", "el tiempo de la principal decide el de la subordinada"],
                     ["se hipotético", "indicativo (real) o congiuntivo (posible, irreal), nunca condizionale"],
                     ["futuro desde el pasado", "condizionale PASSATO: disse che sarebbe venuto"]]}},

 {"h": "Lo que separa un B2 de un C1",
  "r": "No es saber más reglas: es **usar los recursos que el B2 evita**.",
  "ex": [["*Ho fatto riparare* la macchina.", "Mandé a arreglar el auto."],
         ["*Finito* il lavoro, siamo usciti.", "Terminado el trabajo, salimos."],
         ["Il pane *lo* compro io.", "El pan lo compro yo."],
         ["Non *ce la faccio* più.", "No puedo más."]],
  "table": {"head": ["Recurso", "Ejemplo"],
            "rows": [["causativo", "ho fatto riparare la macchina"],
                     ["participio absoluto", "finito il lavoro"],
                     ["gerundio compuesto", "avendo capito"],
                     ["dislocaciones", "il pane lo compro io"],
                     ["pronominales idiomáticos", "non ce la faccio"],
                     ["ne y ci en todos sus valores", "ne ho tre, ci penso io"],
                     ["pasiva con andare y venire", "va fatto, viene pubblicato"],
                     ["conectores de registro alto", "benché sia, qualora fosse"]]}},

 {"h": "Antes de entrar",
  "r": "Leé una vez las **quince faltas** de la semana 51.",
  "ex": [["Credo che *sia* giusto.", "Creo que es justo."],
         ["Ha detto che *sarebbe partito*.", "Dijo que se iría."]],
  "tip": "¿Dudás entre indicativo y congiuntivo tras un verbo de opinión? "
         "Congiuntivo. ¿Entre condizionale presente y passato mirando al "
         "futuro desde el pasado? Compuesto."},

 {"h": "Después del examen",
  "r": "El C1 no es la meta: es donde el idioma empieza a devolverte cosas. "
       "**Cinco minutos por día** alcanzan.",
  "ex": [["*Ce l'hai fatta*!", "¡Lo lograste!"],
         ["*In bocca al lupo*! — *Crepi*!", "¡Suerte! — ¡Gracias!"]],
  "more": ["Podés leer a Calvino, a Ferrante y a Buzzati sin diccionario, "
           "seguir un debate en la radio y escribir un texto argumentativo "
           "defendible. El repaso espaciado sigue abierto para siempre. *In "
           "bocca al lupo!*"]},
]},

}
