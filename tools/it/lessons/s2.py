# -*- coding: utf-8 -*-
"""Stagione 2 — Il Ponte (settimane 14-26, A2 → B1)."""

LESSONS = {

14: {
"intro": "*piacere* funciona como «gustar»: lo que gusta es el sujeto. El "
         "mecanismo ya lo tenés; lo difícil llega con los nombres, los "
         "tónicos y los verbos parecidos.",
"blocks": [
 {"h": "El mecanismo",
  "r": "Lo que gusta es el **sujeto**; la persona va en indirecto. *piace* "
       "con singular o infinitivo, *piacciono* con plural.",
  "ex": [["Mi *piace* il caffè.", "Me gusta el café."],
         ["Mi *piacciono* i film italiani.", "Me gustan las películas italianas."],
         ["Mi *piace* leggere.", "Me gusta leer."],
         ["*A Marco* piace la musica.", "A Marco le gusta la música."]],
  "warn": "Con un nombre o un sustantivo, la persona lleva **a**: *a Marco "
          "piace*, *ai bambini piacciono*. Sin *a* cambia todo: *Marco "
          "piace* = Marco le gusta a la gente.",
  "tip": "Son los indirectos de la semana 10: *mi, ti, gli* (a él y a "
         "ellos), *le* (a ella), *Le* (a usted), *ci, vi*. *Gli piace* = le "
         "o les gusta."},

 {"h": "Negar y enfatizar",
  "r": "*non* va antes del pronombre: *non mi piace*. Para contrastar, "
       "pronombre **tónico** con *a*: *a me*, *a lui*.",
  "ex": [["*Non mi* piace per niente.", "No me gusta para nada."],
         ["*A me* piace, *a lui* no.", "A mí me gusta, a él no."],
         ["*A noi* piacciono le montagne.", "A nosotros nos gustan las montañas."],
         ["Mi piace *un sacco*.", "Me gusta muchísimo. (coloquial)"]],
  "warn": "Nada de «a me mi piace»: el castellano repite («a mí me gusta»), "
          "el italiano no. O *a me piace*, o *mi piace*.",
  "tip": "*Ti va di uscire?* (¿tenés ganas de salir?) funciona igual que "
         "*piacere*."},

 {"h": "En pasado va con essere",
  "r": "En passato prossimo, *piacere* va con **essere** y el participio "
       "concuerda con **lo que gustó**.",
  "ex": [["Mi *è piaciuto* il film.", "Me gustó la película."],
         ["Mi *è piaciuta* la cena.", "Me gustó la cena."],
         ["Mi *sono piaciuti* i quadri.", "Me gustaron los cuadros."],
         ["Mi *sono piaciute* le foto.", "Me gustaron las fotos."]],
  "warn": "Nunca «mi ha piaciuto». Y el participio mira a la cosa, no a quien "
          "habla: Anna dice *mi è piaciuto il film*, no «piaciuta»."},

 {"h": "La familia de piacere",
  "r": "Estos verbos funcionan **igual que *piacere***: la cosa es el sujeto "
       "y la persona va en indirecto.",
  "table": {"head": ["Verbo", "Sentido", "Ejemplo"],
            "rows": [["mancare", "faltar / extrañar", "Mi manchi. (Te extraño.)"],
                     ["servire", "hacer falta", "Mi serve una penna. (Necesito una lapicera.)"],
                     ["bastare", "alcanzar", "Mi bastano dieci euro. (Me alcanzan diez euros.)"],
                     ["sembrare / parere", "parecer", "Mi sembra giusto. (Me parece justo.)"],
                     ["interessare", "interesar", "Non mi interessa. (No me interesa.)"],
                     ["importare", "importar", "Non mi importa. (No me importa.)"],
                     ["dispiacere", "sentir (lo siento) / molestar", "Mi dispiace. (Lo siento.)"],
                     ["fare piacere", "alegrar", "Mi fa piacere vederti. (Me alegra verte.)"],
                     ["occorrere", "ser necesario", "Ci occorre tempo. (Necesitamos tiempo.)"],
                     ["succedere", "pasar, suceder", "Che ti succede? (¿Qué te pasa?)"],
                     ["restare / rimanere", "quedar", "Mi restano due giorni. (Me quedan dos días.)"]]},
  "ex": [["Mi *manchi*.", "Te extraño."],
         ["Mi *manca* l'Italia.", "Extraño Italia."],
         ["Mi *serve* una penna.", "Necesito una lapicera."],
         ["Non mi *interessa*.", "No me interesa."]],
  "warn": "*Mi manchi* = «te extraño», no «me extrañás». El sujeto es el que "
          "falta: *mi manca Roma* = extraño Roma.",
  "more": ["Si el que falta sos vos, el verbo va en primera: *gli manco* "
           "(ellos me extrañan: yo les falto), *ci mancate* (los extrañamos a "
           "ustedes). Primero preguntate quién falta: ese es el sujeto."]},

 {"h": "Invitar, aceptar y decir que no",
  "r": "Se invita con una **pregunta** (*ti va di…?*, *vuoi…?*) y se rechaza con "
       "**disculpa y motivo**: *mi dispiace, ma…*.",
  "ex": [["*Ti va di* venire al cinema stasera?", "¿Tenés ganas de venir al cine esta noche?"],
         ["Sì, *volentieri*!", "¡Sí, con gusto!"],
         ["*Mi dispiace, ma* stasera lavoro. *Magari un'altra volta*!", "Lo siento, pero esta noche trabajo. ¡Otra vez será!"],
         ["*Purtroppo* non posso: ho un esame.", "Lamentablemente no puedo: tengo un examen."]],
  "warn": "Un *no* solo, sin motivo, suena a desplante. El motivo puede ser vago "
          "(*ho già un impegno*, ya tengo un compromiso): lo que cuenta es darlo.",
  "tip": "*Magari un'altra volta* rechaza sin cerrar la puerta. Si no querés que "
         "te vuelvan a invitar, no lo digas.",
  "more": ["*Ti va di* + infinitivo es «¿tenés ganas de…?», con *andare* y el "
           "pronombre como *piacere*: *ti va*, *le va*. Otra invitación muy común, "
           "*che ne dici di…?* (¿qué te parece si…?), lleva el *ne* de la semana 21.",
           "Para aceptar con entusiasmo: *certo!*, *perché no?*, *ci sto!* (¡me "
           "prendo!). Para dudar: *non so, ti faccio sapere* (no sé, te aviso)."],
  "qq": [{"prompt": "Un amigo te invita a cenar y no podés", "answer": "Mi dispiace, ma stasera non posso.", "options": ["Mi dispiace, ma stasera non posso.", "No.", "Non mi va di venire da te."]}]},
]},

15: {
"intro": "LA semana difícil del B1: passato prossimo o imperfetto. No se "
         "decide por «puntual o duradero», sino por lo que mira quien habla: "
         "los hechos o el decorado.",
"parts": [
 {"h": "El imperfetto: forma e irregulares", "blocks": [0, 1],
  "match": r"Conjugá el verbo en imperfetto|usando el imperfetto|ya no son como antes|estabas preparado|robar|Completá con el imperfetto"},
 {"h": "Imperfetto o passato prossimo: el contraste", "blocks": [2, 3, 4, 5],
  "match": r"passato prossimo|tiempo|trapassato|auxiliar|cortes"},
],
"blocks": [
 {"h": "La forma del imperfetto",
  "r": "Infinitivo sin *-re* + *-vo, -vi, -va, -vamo, -vate, -vano*: "
       "*parlavo, vendevo, dormivo*.",
  "table": {"head": ["", "parlare", "vendere", "dormire", "essere"],
            "rows": [["io", "parlavo", "vendevo", "dormivo", "ero"],
                     ["tu", "parlavi", "vendevi", "dormivi", "eri"],
                     ["lui/lei", "parlava", "vendeva", "dormiva", "era"],
                     ["noi", "parlavamo", "vendevamo", "dormivamo", "eravamo"],
                     ["voi", "parlavate", "vendevate", "dormivate", "eravate"],
                     ["loro", "parlavano", "vendevano", "dormivano", "erano"]]},
  "ex": [["Da bambino *giocavo* a calcio.", "De chico jugaba al fútbol."],
         ["*Abitavamo* a Roma.", "Vivíamos en Roma."],
         ["Dove *eri*?", "¿Dónde estabas?"]],
  "tip": "*loro* lleva el acento en la misma sílaba que *io*: *parlàvo → "
         "parlàvano*, nunca «parlavàno»."},

 {"h": "Los pocos irregulares",
  "r": "Pocos, y con la raíz latina: *fare → facevo*, *dire → dicevo*, *bere "
       "→ bevevo*. *essere* va aparte: *ero, eri, era*.",
  "ex": [["Da bambino *facevo* sport.", "De chico hacía deporte."],
         ["Che cosa *dicevi*?", "¿Qué decías?"],
         ["*Bevevo* troppo caffè.", "Tomaba demasiado café."],
         ["*Era* tardi.", "Era tarde."]],
  "more": ["Siguen el mismo patrón *tradurre → traducevo*, *produrre → "
           "producevo* y *porre → ponevo*."]},

 {"h": "La pregunta correcta",
  "r": "¿Contás **qué pasó** o describís **cómo estaban las cosas**? Hechos: "
       "passato prossimo. Fondo, costumbre, estado: imperfetto.",
  "table": {"head": ["Caso", "Imperfetto", "Passato prossimo"],
            "rows": [["fondo / hecho que avanza", "Pioveva. (Llovía.)", "È arrivato Marco. (Llegó Marco.)"],
                     ["costumbre / número de veces", "Andavo al mare ogni estate. (Iba al mar cada verano.)", "Sono andato al mare tre volte. (Fui al mar tres veces.)"],
                     ["estado / cambio de estado", "Avevo paura. (Tenía miedo.)", "Ho avuto paura. (Me asusté.)"],
                     ["edad, hora, clima / hecho fechado", "Avevo dieci anni. (Tenía diez años.)", "Il 5 maggio è nata Anna. (El 5 de mayo nació Ana.)"],
                     ["en curso / la interrupción", "Mentre dormivo… (Mientras dormía…)", "…è suonato il telefono. (…sonó el teléfono.)"]]},
  "ex": [["Mentre *dormivo*, *è suonato* il telefono.", "Mientras dormía, sonó el teléfono."],
         ["Da bambino *andavo* al mare ogni estate.", "De chico iba al mar todos los veranos."],
         ["Ieri *sono andato* al mare.", "Ayer fui al mar."],
         ["*Faceva* freddo e non *c'era* nessuno.", "Hacía frío y no había nadie."]],
  "warn": "«¿Duró mucho?» no sirve: *ho abitato a Roma per dieci anni* dura "
          "diez años y va en passato prossimo, porque es un período cerrado.",
  "more": ["Dos piezas más del relato. Imperfetto + *da* = «hacía… que»: "
           "*aspettava da un'ora* (hacía una hora que esperaba). Y lo "
           "anterior a otro pasado va en trapassato prossimo, imperfetto de "
           "*avere / essere* + participio: *non mi aveva detto niente* (no me "
           "había dicho nada), *era già partito*. Lo repasás en la semana 26."]},

 {"h": "El mismo verbo, dos lecturas",
  "r": "Con *sapere*, *conoscere* y los modales, el imperfetto deja el "
       "resultado abierto; el passato prossimo lo cierra.",
  "ex": [["*Sapevo* la verità. / *Ho saputo* la verità.", "Sabía la verdad. / Me enteré de la verdad."],
         ["*Conoscevo* Marco. / *Ho conosciuto* Marco.", "Conocía a Marco. / Conocí a Marco."],
         ["*Potevo* farlo. / *Ho potuto* farlo.", "Podía hacerlo. / Pude (y lo hice)."],
         ["*Volevo* uscire. / *Ho voluto* uscire.", "Quería salir. / Quise salir (y salí)."],
         ["*Doveva* partire. / *È dovuto* partire.", "Tenía que irse. / Tuvo que irse (y se fue)."]],
  "tip": "Es la misma diferencia que entre «podía» y «pude»: el castellano ya "
         "te la da."},

 {"h": "Imperfetto de cortesía",
  "r": "Para pedir con suavidad, imperfetto: *Volevo un caffè* suena más "
       "amable que *voglio*.",
  "ex": [["*Volevo* un caffè, per favore.", "Quería un café, por favor."],
         ["*Cercavo* il signor Rossi.", "Buscaba al señor Rossi."],
         ["*Volevo* chiederti una cosa.", "Te quería preguntar algo."]]},

 {"h": "Adelanto: imperfetto en la hipótesis",
  "r": "Al hablar, el imperfetto reemplaza las formas cultas de la hipótesis "
       "irreal: *Se lo sapevo, non venivo*.",
  "ex": [["Se lo *sapevo*, non *venivo*.", "Si lo sabía, no venía (coloquial)."],
         ["Se l'*avessi saputo*, non *sarei venuto*.", "Si lo hubiera sabido, no habría venido (forma culta)."]],
  "tip": "Reconocelo al escuchar; en el examen, escribí la forma culta.",
  "more": ["La forma culta usa congiuntivo trapassato y condizionale "
           "passato: llegan en las semanas 30 y 31, y la hipótesis completa "
           "en la 33."]},
]},

16: {
"intro": "Los reflexivos en pasado tienen una sola regla, absoluta, y el "
         "castellano empuja justo al revés. Esta semana la automatizás.",
"blocks": [
 {"h": "Todos con essere. Todos.",
  "q": [{"prompt": "¿Cuál está bien? «Me lavé» (dice Anna).", "answer": "Mi sono lavata.", "options": ["Mi sono lavata.", "Mi ho lavata.", "Mi sono lavato."]}, {"prompt": "Completá: «Se divirtieron» (los chicos).", "stem": "I ragazzi si ___ divertiti.", "answer": "sono", "options": ["sono", "hanno", "è"]}],
  "r": "Reflexivos y pronominales van **siempre con *essere***, y el "
       "participio concuerda con el sujeto.",
  "table": {"head": ["", "lavarsi"],
            "rows": [["io", "mi sono lavato / lavata"],
                     ["tu", "ti sei lavato / lavata"],
                     ["lui / lei", "si è lavato / lavata"],
                     ["noi", "ci siamo lavati / lavate"],
                     ["voi", "vi siete lavati / lavate"],
                     ["loro", "si sono lavati / lavate"]]},
  "ex": [["Stamattina *mi sono svegliato* alle sette.", "Hoy a la mañana me desperté a las siete."],
         ["Anna *si è vestita* in fretta.", "Ana se vistió rápido."],
         ["I ragazzi *si sono divertiti*.", "Los chicos se divirtieron."]],
  "warn": "*lavare* solo va con *avere*, y el instinto lo arrastra: «mi ho "
          "lavato». Con pronombre, siempre *mi sono lavato*: es el error más "
          "penalizado del B1."},

 {"h": "El mismo verbo con y sin pronombre",
  "r": "Sin pronombre, cada verbo sigue su regla: *ho lavato la macchina*. "
       "Con pronombre reflexivo, *essere*: *mi sono lavato*.",
  "ex": [["*Ho lavato* la macchina. / *Mi sono lavato* le mani.", "Lavé el auto. / Me lavé las manos."],
         ["*Ho svegliato* i bambini. / *Mi sono svegliato* tardi.", "Desperté a los chicos. / Me desperté tarde."],
         ["*Ho fermato* il taxi. / *Mi sono fermato* al semaforo.", "Paré el taxi. / Me detuve en el semáforo."]],
  "more": ["Con objeto directo detrás (*le mani*), el italiano cuidado hace "
           "concordar el participio con el sujeto: *mi sono lavato le mani*. "
           "La concordancia con el objeto (*mi sono lavate le mani*) se "
           "admite, pero es minoritaria."]},

 {"h": "Recíprocos y pronominales",
  "r": "Los recíprocos (uno al otro) y pronominales como *accorgersi* o "
       "*dimenticarsi* también van con *essere*.",
  "ex": [["*Ci siamo conosciuti* a Milano.", "Nos conocimos en Milán."],
         ["*Si sono salutati* alla stazione.", "Se despidieron en la estación."],
         ["*Mi sono dimenticata* le chiavi.", "Me olvidé las llaves."],
         ["*Si è accorto* dell'errore.", "Se dio cuenta del error."]],
  "warn": "«Nos conocimos» no es «ci abbiamo conosciuto»: el recíproco va con "
          "*essere* y en plural, *ci siamo conosciuti*."},

 {"h": "Con modales, dos opciones",
  "r": "Pronombre delante → *essere*. Pronombre pegado al infinitivo → "
       "*avere*. Las dos son correctas y significan lo mismo.",
  "ex": [["*Mi sono dovuto* alzare presto.", "Tuve que levantarme temprano."],
         ["*Ho dovuto* alzar*mi* presto.", "Tuve que levantarme temprano."],
         ["Non *mi sono potuto* fermare.", "No me pude detener."],
         ["Non *ho potuto* fermar*mi*.", "No me pude detener."]],
  "warn": "Lo que no vale es mezclar: ni «mi ho dovuto alzare» ni «sono "
          "dovuto alzarmi»."},
]},

17: {
"intro": "Demostrativos, posesivos e indefinidos: las piezas chicas que "
         "arman cualquier frase larga. Casi todo calca el castellano; esta "
         "semana fijás los pocos puntos donde no.",
"parts": [
 {"h": "Demostrativos: questo y quello", "blocks": [0],
  "match": r"questo|quello|demostrativ"},
 {"h": "Posesivos: con artículo, salvo la familia", "blocks": [1, 2],
  "match": r"posesiv|suo o loro|invitados|devolviendo|\bmio\b|\btuo\b|\bsuo\b|\bloro\b|famil"},
 {"h": "Indefinidos y molto", "blocks": [3, 4],
  "match": r"indefinid|tutto|molto|alcun|qualche|nessun|ogn|poch|tropp"},
],
"blocks": [
 {"h": "Demostrativos: solo dos grados",
  "r": "Dos grados, no tres: *questo* (cerca) y *quello* (lejos). Ante "
       "sustantivo, *quello* cambia como el artículo: *quel*, *quello*, "
       "*quell'*.",
  "table": {"head": ["", "m.sg", "f.sg", "m.pl", "f.pl"],
            "rows": [["questo (este)", "questo", "questa", "questi", "queste"],
                     ["quello ante sust. (ese, aquel)", "quel / quello / quell'", "quella / quell'", "quei / quegli", "quelle"],
                     ["quello solo (ese, aquel)", "quello", "quella", "quelli", "quelle"]]},
  "ex": [["*Questo* caffè è buono.", "Este café está rico."],
         ["*Quel* ragazzo è Marco.", "Ese chico es Marco."],
         ["*Quello* studente è bravo.", "Ese estudiante es bueno."],
         ["Quali libri? *Quelli*.", "¿Qué libros? Esos."]],
  "warn": "El castellano tiene «ese» y «aquel»: en italiano los dos son "
          "*quello*.",
  "tip": "Como pronombre suelto, el masculino plural es *quelli*, nunca "
         "*quei*.",
  "more": ["*codesto* (ese, cerca de quien escucha) existe, pero es toscano "
           "o burocrático: no lo vas a necesitar.",
           "La forma de *quello* la decide la palabra que sigue, aunque sea "
           "un adjetivo: *quel programma*, pero *quello strano programma*; "
           "*quella gonna*, *quell'altra gonna*. Para señalar: *questo qui*, "
           "*quello lì* (este de acá, ese de allá). «Eso» abstracto: *questo* "
           "o *ciò* (más formal); *quello che* = lo que."]},

 {"h": "Posesivos: ya los viste en la semana 3",
  "r": "Repaso de la semana 3: el posesivo lleva **artículo** y concuerda con "
       "lo poseído, no con el dueño. *loro* no cambia.",
  "ex": [["Marco e *la sua* macchina.", "Marco y su auto (manda *macchina*)."],
         ["È *la loro* casa.", "Es la casa de ellos."]],
  "warn": "*suo* no mira al dueño: *la sua macchina* es el auto de él o de "
          "ella. Manda *macchina*, que es femenino.",
  "more": ["Lo nuevo: la misma forma sirve sola, sin sustantivo: *la tua "
           "macchina e la mia* (la tuya y la mía). Después de *essere* el "
           "artículo suele caer: *è mio* (es mío). Con número, indefinido o "
           "demostrativo, sin artículo: *tre suoi amici* (tres amigos suyos), "
           "*quei tuoi amici*. Para usted, con mayúscula: *il Suo cappotto*. "
           "«Propio» es *proprio*: *la propria opinione*.",
           "Con partes del cuerpo y ropa no va el posesivo sino el artículo: "
           "*mi fa male il piede* (me duele el pie), *prendi l'ombrello* "
           "(llevá tu paraguas)."],
  "qq": [{"prompt": "Traducí: «sus llaves» (de Anna)", "answer": "le sue chiavi", "options": ["le sue chiavi", "le loro chiavi", "i suoi chiavi"]},
         {"prompt": "Traducí: «es mío» (el libro)", "answer": "è mio", "options": ["è mio", "è il me", "è di me"]}]},

 {"h": "Familia: sin artículo",
  "q": [{"prompt": "¿Cuál está bien? «Mi padre es médico.»", "answer": "Mio padre è medico.", "options": ["Mio padre è medico.", "Il mio padre è medico.", "Lo mio padre è medico."]}, {"prompt": "¿Cuál está bien? «El padre de ellos es alto.»", "answer": "Il loro padre è alto.", "options": ["Il loro padre è alto.", "Loro padre è alto.", "Suo padre è alto."]}],
  "r": "Parentesco en **singular y sin adjetivo**: el posesivo va sin "
       "artículo. *mio padre*, *tua sorella*.",
  "ex": [["*Mio padre* è medico.", "Mi padre es médico."],
         ["*I miei fratelli* abitano a Roma.", "Mis hermanos viven en Roma. (plural: con artículo)"],
         ["*Il mio caro* nonno ha novant'anni.", "Mi querido abuelo tiene noventa años. (con adjetivo: con artículo)"],
         ["*La mia* mamma è simpatica.", "Mi mamá es simpática. (forma afectiva: con artículo)"],
         ["*Il loro* padre è alto.", "El padre de ellos es alto. (loro: siempre con artículo)"]],
  "warn": "«il mio padre» es error de principiante. Y con *loro* el artículo "
          "no se cae nunca."},

 {"h": "Indefinidos que hay que saber",
  "r": "Casi todos calcan el castellano. Fijá tres: *qualche* + "
       "**singular**, *ogni* invariable y *nessuno / niente* detrás del "
       "verbo con *non*.",
  "table": {"head": ["Forma", "Sentido", "Nota"],
            "rows": [["qualche + singular", "algunos", "¡siempre singular! qualche libro"],
                     ["alcuni / alcune + plural", "algunos", "alcuni libri"],
                     ["ogni + singular", "cada / todos los", "invariable: ogni giorno"],
                     ["tutto/a/i/e + artículo", "todo", "tutti i giorni, tutta la notte"],
                     ["qualcuno / qualcosa", "alguien / algo", "invariables: c'è qualcuno?"],
                     ["nessuno / niente", "nadie / nada", "detrás del verbo, con non: non c'è niente"],
                     ["ognuno / ciascuno", "cada uno", "ognuno di voi; tre euro ciascuno"],
                     ["qualsiasi / qualunque", "cualquier", "invariables: a qualsiasi ora"],
                     ["chiunque", "cualquiera (persona)", "lo sa fare chiunque"],
                     ["tutti e due, tutti e tre", "los dos, los tres", "tutte e tre le case"],
                     ["altro/a/i/e", "otro", "¡con un!: un altro libro"],
                     ["parecchio/a/i/e, vario/a/i/e", "bastante, varios", "parecchie case, vari politici"],
                     ["poco, molto, troppo, tanto", "poco, mucho, demasiado, tanto", "concuerdan: pochi studenti, troppi ragazzi"]]},
  "ex": [["Ho letto *qualche* libro.", "Leí algunos libros."],
         ["Vado al lavoro *ogni giorno*.", "Voy al trabajo todos los días."],
         ["*Non* c'è *nessuno*.", "No hay nadie."],
         ["Vuoi *un altro* caffè?", "¿Querés otro café?"]],
  "warn": "*qualche amico* = algunos amigos: «qualche amici» es error "
          "seguro. Y *ogni giorno*, nunca «ogni giorni».",
  "more": ["«En algún lado» es *da qualche parte*; «en ningún lado», *da "
           "nessuna parte*: *ho lasciato l'agenda da qualche parte*, *non vado "
           "da nessuna parte*. Solos, sin sustantivo, *alcuni* y *molti* "
           "son pronombres: *alcuni non lavorano*, *molti pensano di sì*."]},

 {"h": "molto, poco, tanto, troppo: ya lo viste en la semana 4",
  "r": "Como *molto* (semana 4): con sustantivo **concuerda**; con adjetivo, "
       "adverbio o verbo **no cambia**. Igual *poco, tanto, troppo*.",
  "ex": [["C'è *poca* gente.", "Hay poca gente."],
         ["Lavorano *troppo*.", "Trabajan demasiado."]],
  "warn": "*Sono molto stanchi*, nunca «molti stanchi»: delante de un "
          "adjetivo es adverbio y no cambia, como «muy».",
  "qq": [{"prompt": "Completá", "stem": "In città ci sono ___ turisti.", "answer": "troppi", "options": ["troppi", "troppo", "troppe"]},
         {"prompt": "Completá", "stem": "Le lezioni sono ___ lunghe.", "answer": "troppo", "options": ["troppo", "troppe", "troppi"]}]},
]},

18: {
"intro": "En italiano la doble negación es obligatoria, igual que en "
         "castellano. Esta semana ordenás el inventario completo, las "
         "trampas y las exclamaciones de todos los días.",
"parts": [
 {"h": "Negar: non … niente, mai, mica", "blocks": [0, 1, 2],
  "match": r"negaci|negativ|\bnon\b|affatto|mica|neanche"},
 {"h": "Exclamaciones", "blocks": [3, 4],
  "match": r"exclama|che!|quanto o come|interjecci|reaccion"},
],
"blocks": [
 {"h": "El esquema non ... X",
  "r": "Palabra negativa **después** del verbo → *non* delante. **Antes** "
       "del verbo → sin *non*. Igual que en castellano.",
  "ex": [["*Non* ho visto *nessuno*.", "No vi a nadie."],
         ["*Nessuno* mi ha visto.", "Nadie me vio."],
         ["*Non* vado *mai* al cinema.", "Nunca voy al cine."],
         ["*Non* lavoro *più* qui.", "Ya no trabajo acá."],
         ["Non ho *né* tempo *né* voglia.", "No tengo ni tiempo ni ganas."]],
  "tip": "En tiempos compuestos, *mai, più, ancora* van entre auxiliar y "
         "participio (*non ho mai visto*); *niente* y *nessuno*, al final "
         "(*non ho visto nessuno*)."},

 {"h": "El inventario",
  "r": "*non* + otra palabra, casi siempre como en castellano. La excepción: "
       "*non... che* significa «solo».",
  "table": {"head": ["Forma", "Sentido", "Ejemplo"],
            "rows": [["non... niente / nulla", "nada", "Non ho detto niente. (No dije nada.)"],
                     ["non... nessuno", "nadie / ningún", "Non c'è nessuno. (No hay nadie.)"],
                     ["non... mai", "nunca", "Non piove mai. (Nunca llueve.)"],
                     ["non... più", "ya no", "Non fumo più. (Ya no fumo.)"],
                     ["non... ancora", "todavía no", "Non è ancora qui. (Todavía no está.)"],
                     ["non... né... né", "ni... ni", "Non bevo né vino né birra. (No tomo ni vino ni cerveza.)"],
                     ["non... affatto / per niente", "en absoluto / para nada", "Non è affatto facile. (No es nada fácil.)"],
                     ["non... assolutamente", "de ninguna manera", "Non devi assolutamente partire. (De ninguna manera tenés que irte.)"],
                     ["non... neanche / nemmeno / neppure", "ni siquiera, tampoco", "Non ho neanche un euro. (No tengo ni un euro.)"],
                     ["non... che", "solo (¡no es negación!)", "Non ho che dieci euro. (Solo tengo diez euros.)"]]},
  "ex": [["Non c'è *niente* da fare.", "No hay nada que hacer."],
         ["Non è *ancora* arrivato.", "Todavía no llegó."],
         ["Non mi piace *neanche* un po'.", "No me gusta ni un poco."],
         ["*Non* ho *che* dieci euro.", "Solo tengo diez euros."]],
  "warn": "*Non ho che dieci euro* = «solo tengo diez euros», no «no tengo "
          "diez euros». Trampa clásica de comprensión lectora.",
  "more": ["Para responder corto: *niente* (nada), *mai!* (¡nunca!), *per "
           "niente!* / *nient'affatto!* (¡para nada!), *assolutamente no!* "
           "(¡de ninguna manera!). «Creo que no», «espero que no»: *credo di "
           "no*, *spero di no*, con *di*."]},

 {"h": "mica, la negación coloquial",
  "r": "*mica* refuerza la negación al hablar: *Non è mica facile!* Se dice "
       "mucho y se escribe poco.",
  "ex": [["Non è *mica* facile!", "¡No es nada fácil!"],
         ["Non hai *mica* una penna?", "¿No tenés una lapicera, por casualidad?"],
         ["*Mica* male!", "¡Nada mal!"]],
  "tip": "Al principio de la frase, *mica* va solo, sin *non*: *Mica male!*"},

 {"h": "Exclamaciones con che, come, quanto",
  "q": [{"prompt": "¿Cuál está bien? «¡Qué lindo día!»", "answer": "Che bella giornata!", "options": ["Che bella giornata!", "Che una bella giornata!", "Come bella giornata!"]}, {"prompt": "¿Cuál está bien? «¡Qué lástima!»", "answer": "Che peccato!", "options": ["Che peccato!", "Che un peccato!", "Come peccato!"]}],
  "r": "*Che* + sustantivo o adjetivo, **sin artículo**: *Che bello!* *Come* "
       "o *quanto* + verbo: *Come sei elegante!*",
  "ex": [["*Che* peccato!", "¡Qué lástima!"],
         ["*Che* bella giornata!", "¡Qué lindo día!"],
         ["*Come* sei elegante!", "¡Qué elegante estás!"],
         ["*Quanto* mi manchi!", "¡Cuánto te extraño!"]],
  "warn": "Nunca «che una bella giornata»: igual que «¡qué lindo día!», sin "
          "artículo.",
  "more": ["*Che* + sustantivo + adjetivo, como en castellano: *che ragazzi "
           "simpatici!*; y para elogiar, *che meraviglia di casa!* (¡qué "
           "maravilla de casa!). *bello* delante se acorta: *che bel "
           "giardino!*. *quanto* delante de sustantivo concuerda: *quanti "
           "soldi hai speso!*; con verbo, *come* o *quanto*: *com'è lento!*."]},

 {"h": "Cinco exclamaciones de todos los días",
  "r": "No se traducen palabra por palabra: aprendelas enteras, con su "
       "sentido.",
  "ex": [["*Magari!*", "¡Ojalá!"],
         ["*Figurati!*", "¡Por favor, no es nada!"],
         ["*Dai!*", "¡Dale!"],
         ["*Boh!*", "Ni idea."],
         ["*Beato te!*", "¡Qué suerte la tuya!"]],
  "more": ["Más de todos los días: *Macché!* (¡qué va!), *Ma va!* (¡no me "
           "digas!), *Neanche per sogno!* (¡ni loco!), *Per forza!* (¡y "
           "claro!), *Che peccato!* (¡qué lástima!), *Cavolo!* (¡uy!), *In "
           "bocca al lupo!* (¡suerte!), que se responde *Crepi!*."]},
]},

19: {
"intro": "El futuro italiano es muy regular. Además de hablar del porvenir, "
         "sirve para suponer sobre el presente: *sarà a casa* = estará en "
         "casa.",
"parts": [
 {"h": "Futuro simple y sus raíces", "blocks": [0, 1],
  "match": r"^(?!.*(anteriore|compuesto|probabilidad|quando|appena|parientes)).*(futuro|planes|Promesas|Decisiones)"},
 {"h": "Futuro anteriore, suposición y quando", "blocks": [2, 3, 4],
  "match": r"anteriore|probabilidad|quando|appena"},
],
"blocks": [
 {"h": "Futuro semplice",
  "r": "Infinitivo sin *-e* + *-ò, -ai, -à, -emo, -ete, -anno*. En *-are*, "
       "la *a* pasa a *e*: *parlerò*.",
  "table": {"head": ["", "parlare", "vendere", "dormire"],
            "rows": [["io", "parlerò", "venderò", "dormirò"],
                     ["tu", "parlerai", "venderai", "dormirai"],
                     ["lui/lei", "parlerà", "venderà", "dormirà"],
                     ["noi", "parleremo", "venderemo", "dormiremo"],
                     ["voi", "parlerete", "venderete", "dormirete"],
                     ["loro", "parleranno", "venderanno", "dormiranno"]]},
  "ex": [["Domani *parlerò* con Marco.", "Mañana voy a hablar con Marco."],
         ["*Partiremo* alle otto.", "Vamos a salir a las ocho."],
         ["*Dormirete* qui?", "¿Van a dormir acá?"]],
  "tip": "La ortografía de siempre: *cercare → cercherò*, *pagare → pagherò* "
         "(con h); *cominciare → comincerò*, *mangiare → mangerò* (sin i).",
  "more": ["Para planes cercanos y decisiones del momento alcanza el "
           "presente, como en castellano: *domani vado a Torino*, *allora le "
           "mando un biglietto* (entonces le mando una tarjeta). El futuro "
           "suena a pronóstico o promesa: *domani pioverà*, *te lo "
           "prometto, ti aiuterò*. Y «voy a + infinitivo» no se calca: *vado "
           "a* es moverse de lugar."]},

 {"h": "Raíces irregulares",
  "r": "Pocos verbos cambian la raíz; las terminaciones son las de siempre. "
       "Esa misma raíz vuelve en el condizionale.",
  "table": {"head": ["Verbo", "Raíz", "Verbo", "Raíz"],
            "rows": [["essere", "sar-", "avere", "avr-"],
                     ["andare", "andr-", "dovere", "dovr-"],
                     ["potere", "potr-", "sapere", "sapr-"],
                     ["vedere", "vedr-", "vivere", "vivr-"],
                     ["venire", "verr-", "volere", "vorr-"],
                     ["rimanere", "rimarr-", "tenere", "terr-"],
                     ["bere", "berr-", "fare", "far-"],
                     ["dare", "dar-", "stare", "star-"],
                     ["tradurre", "tradurr-", "cadere", "cadr-"]]},
  "ex": [["Domani *andrò* al mare.", "Mañana voy a ir al mar."],
         ["*Sarò* a casa alle otto.", "Voy a estar en casa a las ocho."],
         ["*Verrai* alla festa?", "¿Vas a venir a la fiesta?"]],
  "warn": "*andare* y *vedere* pierden la vocal: *andrò*, *vedrò*. «anderò» "
          "o «vederò» no existen."},

 {"h": "Futuro anteriore",
  "r": "*avrò / sarò* + participio: lo que ya estará terminado antes de otro "
       "momento futuro.",
  "ex": [["Quando *avrò finito*, ti chiamerò.", "Cuando termine, te llamo."],
         ["Tra un'ora *avremo finito*.", "En una hora ya vamos a haber terminado."],
         ["*Saranno* già *partiti*.", "Ya se habrán ido."]],
  "tip": "También sirve para suponer sobre el pasado: *saranno già partiti* "
         "= ya se habrán ido."},

 {"h": "Futuro para suponer",
  "q": [{"prompt": "¿Cuál está bien? «¿Dónde está Marco? — Estará en casa.»", "answer": "Dov'è Marco? — Sarà a casa.", "options": ["Dov'è Marco? — Sarà a casa.", "Dov'è Marco? — Starà a casa.", "Dov'è Marco? — Sarebbe a casa."]}, {"prompt": "«Avrà quarant'anni» quiere decir…", "answer": "Debe tener unos cuarenta años.", "options": ["Debe tener unos cuarenta años.", "Va a cumplir cuarenta años.", "Tuvo cuarenta años."]}],
  "r": "El futuro sirve para **suponer sobre el presente**: *Sarà a casa* = "
       "estará en casa.",
  "ex": [["Che ora è? — *Saranno* le tre.", "¿Qué hora es? — Serán las tres."],
         ["Quanti anni ha? — *Avrà* quarant'anni.", "¿Cuántos años tiene? — Tendrá unos cuarenta."],
         ["Dov'è Marco? — *Sarà* a casa.", "¿Dónde está Marco? — Estará en casa."],
         ["*Sarà* vero?", "¿Será verdad?"]],
  "tip": "El castellano también lo hace («serán las tres»), pero el italiano "
         "mucho más: usalo sin miedo."},

 {"h": "Después de quando, futuro",
  "r": "Si el sentido es futuro, detrás de *quando* y *appena* va "
       "**futuro**.",
  "ex": [["Quando *arriverai*, ti darò le chiavi.", "Cuando llegues, te doy las llaves."],
         ["Appena *potrò*, ti chiamerò.", "Apenas pueda, te llamo."],
         ["Ti scriverò quando *sarò* a Roma.", "Te escribo cuando esté en Roma."]],
  "warn": "El castellano pone subjuntivo («cuando llegues»): no lo calques. "
          "Al hablar se oye *quando arrivi*; en el examen, escribí el "
          "futuro.",
  "tip": "Con *se* pasa lo mismo: *se avrò tempo, verrò* = si tengo tiempo, "
         "voy a ir."},
]},

20: {
"intro": "El condizionale usa la raíz del futuro: si dominás la semana "
         "pasada, lo tenés casi hecho. Sirve para pedir con cortesía, "
         "aconsejar y dar noticias no confirmadas.",
"blocks": [
 {"h": "Las formas",
  "r": "Raíz de futuro + *-ei, -esti, -ebbe, -emmo, -este, -ebbero*: "
       "*parlerei, sarei, vorrei*.",
  "table": {"head": ["", "parlare", "essere", "avere", "volere"],
            "rows": [["io", "parlerei", "sarei", "avrei", "vorrei"],
                     ["tu", "parleresti", "saresti", "avresti", "vorresti"],
                     ["lui/lei", "parlerebbe", "sarebbe", "avrebbe", "vorrebbe"],
                     ["noi", "parleremmo", "saremmo", "avremmo", "vorremmo"],
                     ["voi", "parlereste", "sareste", "avreste", "vorreste"],
                     ["loro", "parlerebbero", "sarebbero", "avrebbero", "vorrebbero"]]},
  "ex": [["Io *prenderei* un caffè.", "Yo me tomaría un café."],
         ["*Sarebbe* bello.", "Sería lindo."],
         ["*Avremmo* bisogno di aiuto.", "Necesitaríamos ayuda."]],
  "warn": "*noi* lleva **dos emes**: *parleremmo* (hablaríamos). Con una "
          "sola, *parleremo*, es futuro (vamos a hablar)."},

 {"h": "Ortografía: cher-, gher-, mangi-",
  "r": "Los verbos en *-care* y *-gare* llevan una **h**: *cercherebbe*, "
       "*pagherei*. En *-ciare* y *-giare* cae la *i*.",
  "table": {"head": ["Infinitivo", "Condizionale", "Qué pasa"],
            "rows": [["cercare", "cercherei, cercheresti", "c + h ante e"],
                     ["pagare", "pagherebbe, pagherebbero", "g + h ante e"],
                     ["mangiare", "mangeresti, mangeremmo", "cae la i"],
                     ["cominciare", "comincerei", "cae la i"],
                     ["studiare", "studieremmo", "no es -ciare/-giare: la i se queda"]]},
  "ex": [["Io *pagherei* volentieri.", "Yo pagaría con gusto."],
         ["Loro *cercherebbero* un albergo.", "Ellos buscarían un hotel."],
         ["Tu *mangeresti* qualcosa?", "¿Comerías algo?"],
         ["Noi *studieremmo* di più.", "Estudiaríamos más."]],
  "warn": "Igual que en el futuro (*pagherò*, *cercherò*): si sabés uno, "
          "sabés el otro. Escribir *pagarebbe* (sin h) es un error frecuente."},

 {"h": "Raíces irregulares",
  "r": "Las raíces son las **mismas del futuro**, así que se aprenden una vez: "
       "*andr-*, *dovr-*, *potr-*, *sapr-*, *vedr-*, *vivr-*, *verr-*, *berr-*.",
  "table": {"head": ["Infinitivo", "Futuro (io)", "Condizionale (io)"],
            "rows": [["andare", "andrò", "andrei"],
                     ["dovere", "dovrò", "dovrei"],
                     ["potere", "potrò", "potrei"],
                     ["sapere", "saprò", "saprei"],
                     ["venire", "verrò", "verrei"],
                     ["bere", "berrò", "berrei"],
                     ["dare / fare / stare", "darò / farò / starò", "darei / farei / starei"]]},
  "ex": [["*Dovresti* riposare.", "Deberías descansar."],
         ["*Verrei* volentieri.", "Vendría con gusto."],
         ["*Potrebbe* aiutarmi?", "¿Podría ayudarme?"],
         ["*Andremmo* al mare.", "Iríamos al mar."]],
  "warn": "Con *venire*, *volere* y *bere* la *rr* es doble: *verrei*, "
          "*vorrei*, *berrei*. Y con *noi*, la *mm*: *verremmo*, *vorremmo*."},

 {"h": "Pedir con registro: tú, Lei, voi",
  "r": "El condizionale cambia según a quién le hablás: *Potresti* (tú), "
       "*Potrebbe* (Lei), *Potreste* (voi).",
  "ex": [["Marco, *potresti* aiutarmi con questo?", "Marco, ¿podrías ayudarme con esto?"],
         ["Scusi, *potrebbe* ripetere?", "Disculpe, ¿podría repetir?"],
         ["Ragazzi, *potreste* aspettare?", "Chicos, ¿podrían esperar?"],
         ["*Avrei bisogno di* un consiglio.", "Necesitaría un consejo."],
         ["Le *dispiacerebbe* chiudere la porta?", "¿Le molestaría cerrar la puerta?"]],
  "warn": "Con Lei el verbo va en tercera persona: *potrebbe*, no *potresti*. "
          "Y en un bar o una oficina, *vorrei* (no *voglio*) y *avrei "
          "bisogno di* suenan naturales y corteses.",
  "tip": "Para el español «quisiera / querría / me gustaría» el italiano usa "
         "una sola forma: *vorrei* (o *mi piacerebbe* + infinitivo)."},

 {"h": "Cortesía, deseo y consejo",
  "r": "Para pedir, desear o aconsejar sin imponer: *vorrei*, *potresti*, "
       "*mi piacerebbe*, *dovresti*.",
  "ex": [["*Vorrei* un caffè, per favore.", "Quisiera un café, por favor."],
         ["*Potresti* aiutarmi?", "¿Podrías ayudarme?"],
         ["Mi *piacerebbe* andare in Italia.", "Me gustaría ir a Italia."],
         ["*Dovresti* riposare.", "Deberías descansar."],
         ["*Saprebbe* dirmi dov'è la stazione?", "¿Sabría decirme dónde está la estación?"]],
  "tip": "*Vorrei* es la forma educada por defecto en un bar, un negocio o "
         "una oficina. *Voglio un caffè* suena a orden.",
  "more": ["*dovrei* y *potrebbe* también suponen: *dovrebbero già essere a "
           "casa* (ya deberían estar en casa), *potrebbe essere dalla zia* "
           "(puede que esté en lo de la tía). Y *avrei* suaviza: *avrei una "
           "domanda* (tendría una pregunta)."]},

 {"h": "La noticia no confirmada",
  "r": "Diarios y noticieros usan el condizionale para datos **no "
       "verificados**: leelo como «parece que».",
  "ex": [["Secondo fonti vicine al governo, il ministro si *dimetterebbe*.", "Según fuentes cercanas al gobierno, el ministro renunciaría."],
         ["Ci *sarebbero* venti feriti.", "Habría veinte heridos."],
         ["Il presidente *sarebbe* malato.", "El presidente estaría enfermo."]],
  "tip": "Aparece en toda comprensión lectora: es un dato que el periodista "
         "no garantiza."},

 {"h": "Adelanto: nunca condizionale tras se",
  "r": "Detrás de *se* hipotético **nunca** va condizionale: *Se avessi "
       "tempo, verrei*, jamás «se avrei tempo».",
  "ex": [["Se *avessi* tempo, *verrei*.", "Si tuviera tiempo, vendría."],
         ["Se *potessi*, ti *aiuterei*.", "Si pudiera, te ayudaría."]],
  "warn": "En el italiano hablado regional se oye «se avrei»: no lo imites. "
          "Es como decir «si tendría». *avessi* y *potessi* son otro "
          "tiempo (congiuntivo): por ahora, tomalos como fórmula.",
  "tip": "La estructura completa llega en la semana 33: por ahora, "
         "reconocela."},

 {"h": "Pedir en escala: de puoi a le dispiacerebbe",
  "r": "Cuanto más **grande** el favor o más **lejana** la persona, más suave el "
       "pedido: *puoi* → *potresti* → *le dispiacerebbe*.",
  "table": {"head": ["Pedido", "Cuándo"],
            "rows": [["Mi passi il sale?", "en la mesa, en confianza"],
                     ["Vorrei un biglietto per Roma.", "en un negocio o una ventanilla"],
                     ["Potrebbe chiudere la finestra?", "a un desconocido"],
                     ["Le dispiacerebbe spostare la macchina?", "un favor grande a un desconocido"],
                     ["Sarebbe possibile cambiare la data?", "en una oficina, en un mail"],
                     ["Non è che mi presteresti la bici?", "en confianza, un favor que da vergüenza"]]},
  "ex": [["*Potrebbe* aprire la finestra?", "¿Podría abrir la ventana?"],
         ["*Le dispiacerebbe* parlare più piano?", "¿Le molestaría hablar más despacio?"],
         ["*Sarebbe possibile* avere una camera più tranquilla?", "¿Sería posible tener una habitación más tranquila?"]],
  "warn": "*Le dispiacerebbe* para pedir la sal en la mesa suena a burla. La "
          "cortesía va en escala: se usa la que pide la situación.",
  "tip": "*Non è che…?* + condizionale es el pedido tímido entre amigos: *non è "
         "che mi daresti una mano?* (¿no me darías una mano?)."},
]},

21: {
"intro": "*ne* y *ci* no existen en castellano y el italiano los usa en casi "
         "cada frase. Sin ellos, tu italiano suena correcto pero extranjero.",
"parts": [
 {"h": "NE: cantidades y «de eso»", "blocks": [0, 1, 5],
  "match": r"^(?!.*(\bci\b|c'è|ci sono|volerci|metterci|lugar)).*(\bne\b|«ne»)"},
 {"h": "CI: lugar, «a algo» y expresiones", "blocks": [2, 3, 4, 6, 7],
  "match": r"\bci\b|c'è|lugar"},
],
"blocks": [
 {"h": "NE: una cantidad",
  "q": [{"prompt": "Elegí la que va", "stem": "Quanti fratelli hai? — ___ ho due.", "answer": "Ne", "options": ["Ne", "Li", "Ci"]}, {"prompt": "¿Cuál está bien? «¿Tenés cigarrillos? — No, no tengo.»", "answer": "No, non ne ho.", "options": ["No, non ne ho.", "No, non ho.", "No, non lo ho."]}, {"prompt": "¿Cuál está bien? «¿Querés pan? — Sí, agarro un poco.»", "answer": "Sì, ne prendo un po'.", "options": ["Sì, ne prendo un po'.", "Sì, prendo un po'.", "Sì, lo prendo un po'."]}],
  "r": "*ne* reemplaza **una cantidad** de algo ya nombrado. En castellano "
       "no se dice nada; en italiano, sin el sustantivo, es **obligatorio**.",
  "ex": [["Quanti libri hai? — *Ne* ho tre.", "¿Cuántos libros tenés? — Tengo tres."],
         ["Vuoi del pane? — Sì, *ne* prendo un po'.", "¿Querés pan? — Sí, agarro un poco."],
         ["Hai sigarette? — No, non *ne* ho.", "¿Tenés cigarrillos? — No, no tengo."]],
  "warn": "Si respondés con la cantidad **sin nombrar la cosa**, *ne* tiene "
          "que estar: *ne ho tre*, no *ho tre*. Si nombrás la cosa, no se usa: "
          "*ho tre libri*.",
  "tip": "En tiempos compuestos, el participio concuerda con lo contado: *ne "
         "ho comprati tre* (libros), *ne ho comprate due* (revistas).",
  "more": ["Con *c'è / ci sono*, *ci* pasa a *ce* delante de *ne*: *ce n'è "
           "uno* (hay uno), *non ce n'è* (no hay), *ce ne sono cinque* (hay "
           "cinco). Y con infinitivo se pega: *vorrei averne due* (quisiera "
           "tener dos)."]},

 {"h": "NE: di + algo",
  "q": [{"prompt": "Elegí la que va", "stem": "Che ___ pensi? (¿Qué pensás de eso?)", "answer": "ne", "options": ["ne", "ci", "lo"]}, {"prompt": "¿Cuál está bien? «Estoy contento con eso.»", "answer": "Ne sono contento.", "options": ["Ne sono contento.", "Ci sono contento.", "Lo sono contento."]}],
  "r": "*ne* también reemplaza **di + algo**: *parlare del viaggio → "
       "parlarne*; *sono contento del risultato → ne sono contento*.",
  "ex": [["*Ne* parliamo domani.", "Hablamos de eso mañana."],
         ["*Ne* sono contento.", "Estoy contento con eso."],
         ["Che *ne* pensi?", "¿Qué te parece? / ¿Qué pensás de eso?"],
         ["*Ne* ho sentito parlare.", "Oí hablar de eso."]],
  "more": ["Todos los verbos y adjetivos con *di* lo usan: *avere bisogno di → "
           "ne ho bisogno* (lo necesito), *essere sicuro di → ne sono sicuro*, "
           "*sapere di → non ne so niente* (no sé nada de eso), *fare a meno "
           "di → non ne posso fare a meno* (no puedo estar sin eso)."]},

 {"h": "CI: un lugar",
  "q": [{"prompt": "Elegí la que va", "stem": "Vai a Roma? — Sì, ___ vado domani.", "answer": "ci", "options": ["ci", "ne", "lo"]}, {"prompt": "¿Cuál está bien? «¿Estuviste en Grecia? — No, nunca.»", "answer": "No, non ci sono mai stato.", "options": ["No, non ci sono mai stato.", "No, non ne sono mai stato.", "No, non sono mai ci stato."]}],
  "r": "*ci* reemplaza **un lugar** ya nombrado: «ahí». En castellano muchas "
       "veces no se dice; en italiano es más habitual.",
  "ex": [["Vai a Roma? — Sì, *ci* vado domani.", "¿Vas a Roma? — Sí, voy mañana."],
         ["Sei mai stato in Grecia? — No, non *ci* sono mai stato.", "¿Estuviste alguna vez en Grecia? — No, nunca."],
         ["Abiti ancora a Roma? — Sì, *ci* abito da dieci anni.", "¿Seguís viviendo en Roma? — Sí, vivo ahí hace diez años."]],
  "warn": "Sin *ci* la frase también es correcta, pero en italiano es más "
          "habitual retomar el lugar ya nombrado: *sì, ci vado domani*."},

 {"h": "CI: a + algo",
  "q": [{"prompt": "Elegí la que va", "stem": "Credi ai fantasmi? — No, non ___ credo.", "answer": "ci", "options": ["ci", "ne", "li"]}, {"prompt": "Elegí la que va", "stem": "Pensi al lavoro? — Sì, ___ penso sempre.", "answer": "ci", "options": ["ci", "ne", "li"]}],
  "r": "*ci* también reemplaza **a / in / su + algo**: *pensare al lavoro → "
       "ci penso*; *credere ai fantasmi → ci credo*.",
  "ex": [["Pensi al lavoro? — Sì, *ci* penso sempre.", "¿Pensás en el trabajo? — Sí, pienso en eso siempre."],
         ["Credi ai fantasmi? — No, non *ci* credo.", "¿Creés en fantasmas? — No, no creo en eso."],
         ["*Ci* riesco!", "¡Me sale! / ¡Lo logro!"],
         ["Non *ci* capisco niente.", "No entiendo nada de esto."]],
  "tip": "Si el verbo pide *di*, va *ne*; si pide *a*, *in* o *su*, va *ci*: "
         "*parlare di → ne parlo*, *pensare a → ci penso*.",
  "warn": "*ci* reemplaza cosas, no personas. Con personas, el pronombre: "
          "*penso a Marco → penso a lui*; *ho risposto allo zio → gli ho "
          "risposto*.",
  "more": ["Más verbos y adjetivos con *a* que lo usan: *riuscire a → ci "
           "riesco* (lo logro), *essere abituato a → ci sono abituato* "
           "(estoy acostumbrado), *passare da → ci passo dopo* (paso "
           "después)."]},

 {"h": "Expresiones fijas",
  "r": "Algunos verbos llevan *ci* o *ne* **fijos** y cambian de sentido: "
       "aprendelos como palabras nuevas.",
  "table": {"head": ["Expresión", "Sentido"],
            "rows": [["ci vuole / ci vogliono", "hace falta / hacen falta"],
                     ["c'è / ci sono", "hay; estar alguien (c'è Marco? ¿está Marco?)"],
                     ["farcela", "arreglárselas, lograrlo (ce la faccio)"],
                     ["andarsene", "irse (me ne vado)"],
                     ["averne abbastanza", "estar harto (ne ho abbastanza)"],
                     ["non poterne più", "no aguantar más (non ne posso più)"],
                     ["metterci", "tardar (ci metto due ore)"],
                     ["volerci", "hacer falta (ci vogliono due ore)"]]},
  "ex": [["*Ci vogliono* due ore.", "Hacen falta dos horas."],
         ["*Ci metto* dieci minuti.", "Tardo diez minutos."],
         ["Non *ne posso più*!", "¡No doy más!"],
         ["*Ne ho abbastanza*.", "Estoy harto."]],
  "warn": "*ci metto due ore* = yo tardo dos horas (personal). *ci vogliono "
          "due ore* = se necesitan dos horas (impersonal). No los mezcles."},
 
 {"h": "NE: de + lugar",
  "q": [{"prompt": "Elegí la que va", "stem": "Torni da Roma? — Sì, ___ torno domani.", "answer": "ne", "options": ["ne", "ci", "lo"]},
        {"prompt": "¿Cuál está bien? «Salgo de ahí ahora.»", "answer": "Ne esco adesso.", "options": ["Ne esco adesso.", "Ci esco adesso.", "Lo esco adesso."]}],
  "r": "*ne* también reemplaza **de + lugar**: «de ahí». Va con verbos de "
       "movimiento como *uscire*, *tornare*, *venire*, *partire*.",
  "ex": [["Quando esci dall'ufficio? — *Ne* esco alle sei.", "¿Cuándo salís de la oficina? — Salgo a las seis."],
         ["Torni da Roma? — Sì, *ne* torno domani.", "¿Volvés de Roma? — Sí, vuelvo mañana."],
         ["*Ne* sto uscendo proprio adesso.", "Justo estoy saliendo de ahí."]],
  "warn": "En castellano lo dejás implícito o decís «de ahí». Con *da* + "
          "lugar, el clítico es *ne*, no *ci*: *ne esco*, no «ci esco»."},

 {"h": "CI: con + algo",
  "q": [{"prompt": "Elegí la que va", "stem": "Hai un coltello? — Sì, ___ taglio il pane.", "answer": "ci", "options": ["ci", "ne", "la"]},
        {"prompt": "Elegí la que va", "stem": "Con questa penna ___ scrivo tutto.", "answer": "ci", "options": ["ci", "ne", "la"]}],
  "r": "*ci* también puede reemplazar **con / en + cosa**: el objeto que "
       "usás o donde hacés algo.",
  "ex": [["Hai un coltello? — Sì, *ci* taglio il pane.", "¿Tenés un cuchillo? — Sí, corto el pan con eso."],
         ["Con questa penna *ci* scrivo tutto.", "Con esta lapicera escribo todo."]],
  "tip": "Con **personas**, *ci* y *ne* no son lo más seguro: usá los "
         "tónicos. *Penso a lui*, *parlo di lei*."},

 {"h": "¿NE o CI? La preposición decide",
  "q": [{"prompt": "Elegí la que va", "stem": "Parli del viaggio? — Sì, ___ parlo volentieri.", "answer": "ne", "options": ["ne", "ci", "si"]},
        {"prompt": "¿Cuál está bien? «Voy ahí mañana.»", "answer": "Ci vado domani.", "options": ["Ci vado domani.", "Ne vado domani.", "Lo vado domani."]}],
  "r": "Mirá la preposición que pide el verbo: **di** o **da** llevan *ne*; "
       "**a**, **in**, **su** o **con** llevan *ci*.",
  "table": {"head": ["Preposición", "Clítico", "Ejemplo"],
            "rows": [["di + cosa / cantidad", "ne", "ne parlo, ne ho due"],
                     ["da + lugar", "ne", "ne esco"],
                     ["a / in + lugar", "ci", "ci vado, ci abito"],
                     ["a / su + cosa", "ci", "ci penso, ci conto"],
                     ["con + cosa", "ci", "ci scrivo"]]},
  "ex": [["Voglio andar*ci* domani.", "Quiero ir ahí mañana."],
         ["Non voglio parlar*ne*.", "No quiero hablar de eso."],
         ["*Ne* voglio parlare domani.", "Quiero hablar de eso mañana."]],
  "warn": "Con un verbo modal + infinitivo, el clítico se pega al final "
          "(*andarci*, *parlarne*) o va antes del modal (*ci voglio andare*). "
          "El sentido es el mismo."},
]},

22: {
"intro": "Dos pronombres átonos juntos: el orden es el del castellano, pero "
         "la forma cambia. Es mecánico, así que se automatiza repitiendo.",
"blocks": [
 {"h": "La transformación",
  "r": "El indirecto va **primero** y su *-i* pasa a **-e**: *mi + lo → me "
       "lo*. *gli* y *le* dan **glielo**.",
  "table": {"head": ["", "+ lo", "+ la", "+ li", "+ le", "+ ne"],
            "rows": [["mi (a mí)", "me lo", "me la", "me li", "me le", "me ne"],
                     ["ti (a vos)", "te lo", "te la", "te li", "te le", "te ne"],
                     ["gli / le / Le (a él, a ella, a usted)", "glielo", "gliela", "glieli", "gliele", "gliene"],
                     ["ci (a nosotros)", "ce lo", "ce la", "ce li", "ce le", "ce ne"],
                     ["vi (a ustedes)", "ve lo", "ve la", "ve li", "ve le", "ve ne"],
                     ["si (a sí mismo)", "se lo", "se la", "se li", "se le", "se ne"]]},
  "ex": [["*Me lo* dici?", "¿Me lo decís?"],
         ["Il libro? *Te lo* do domani.", "¿El libro? Te lo doy mañana."],
         ["Le foto? *Ve le* mando stasera.", "¿Las fotos? Se las mando esta noche."]],
  "warn": "La sorpresa no es el orden sino la vocal: «mi lo» no existe, "
          "siempre *me lo*, *te la*, *ce ne*. La *i* pasa a *e* sin "
          "excepción."},

 {"h": "glielo: una palabra, muchos sentidos",
  "r": "*glielo* se escribe **junto** y es «se lo» a él, a ella y a usted; "
       "hoy también a ellos.",
  "ex": [["*Glielo* dico io.", "Se lo digo yo."],
         ["Signora, *glielo* porto subito.", "Señora, se lo traigo enseguida."],
         ["Anna vuole la ricetta: *gliela* mando.", "Ana quiere la receta: se la mando."],
         ["Ai ragazzi? *Glielo* spiego io.", "¿A los chicos? Se lo explico yo."]],
  "warn": "No calques «se lo»: para «a él / a ella» es *glielo*. En "
          "italiano *se lo* es reflexivo: *se lo mette* = se lo pone (él "
          "mismo).",
  "more": ["Para el plural, el italiano culto diría *lo do loro* (se lo doy "
           "a ellos), con *loro* después del verbo. Hoy suena rebuscado: "
           "*glielo do* cubre también ese caso."]},

 {"h": "En frases de todos los días",
  "r": "Los combinados van **delante del verbo conjugado**: indirecto + "
       "directo, o indirecto + *ne*.",
  "ex": [["*Me lo* dai?", "¿Me lo das?"],
         ["*Te la* spiego dopo.", "Te la explico después."],
         ["*Ce ne* ha parlato ieri.", "Nos habló de eso ayer."],
         ["*Se ne* sono andati.", "Se fueron."]],
  "tip": "*andarsene* (irse) se conjuga siempre con los dos: *me ne vado*, "
         "*te ne vai*, *se ne sono andati*.",
  "more": ["Otros verbos con dos pronombres fijos: *prendersela* (ofenderse: "
           "*perché te la prendi?*), *sentirsela* (animarse: *te la senti di "
           "venire?*), *fregarsene* (importarle un pepino: *me ne frego*), "
           "*farcela* (lograrlo: *ce l'abbiamo fatta*)."]},

 {"h": "En los tiempos compuestos",
  "r": "El participio **concuerda** con el pronombre directo: *me l'ha data* "
       "(la carta), *gliele ho date* (las llaves).",
  "ex": [["Il libro? *Me l'ha prestato* Marco.", "¿El libro? Me lo prestó Marco."],
         ["La lettera? *Me l'ha data* ieri.", "¿La carta? Me la dio ayer."],
         ["Le chiavi? *Gliele ho date* ieri.", "¿Las llaves? Se las di ayer."],
         ["*Ce li* hanno *portati*.", "Nos los trajeron."]],
  "warn": "*lo* y *la* se apostrofan ante *ha*: *me l'ha*. Solo el "
          "participio te dice si era «lo» o «la»: *me l'ha dato / data*."},

 {"h": "Con infinitivo e imperativo, pegados",
  "q": [{"prompt": "¿Cuál está bien? «¡Dámelo!»", "answer": "Dammelo!", "options": ["Dammelo!", "Damelo!", "Me lo da'!"]}, {"prompt": "¿Cuál está bien? «Quiero decírtelo.»", "answer": "Voglio dirtelo.", "options": ["Voglio dirtelo.", "Voglio dirtilo.", "Voglio dirlo ti."]}, {"prompt": "¿Cuál está bien? «¡Decíselo ya!»", "answer": "Diglielo subito!", "options": ["Diglielo subito!", "Digglielo subito!", "Digli lo subito!"]}],
  "r": "Con infinitivo e imperativo **afirmativo** (tú, noi, voi) van "
       "**pegados al final**, como en castellano: *dirtelo*, *dammelo*.",
  "ex": [["Voglio *dirtelo*.", "Quiero decírtelo."],
         ["Puoi *portarmelo*?", "¿Me lo podés traer?"],
         ["*Dammelo*!", "¡Dámelo!"],
         ["*Diglielo* subito!", "¡Decíselo ya!"],
         ["Non *dirmelo*!", "¡No me lo digas!"]],
  "warn": "Con *da', di', fa', va', sta'* la consonante se duplica: "
          "*dammelo*, *fammelo*. Con *gli*, no: *diglielo*.",
  "tip": "Con los modales valen las dos: *te lo voglio dire* = *voglio "
         "dirtelo*. Elegí una y usala siempre hasta que salga sola."},
 {"h": "«ne» en los combinados",
  "r": "*ne* (de eso, de ellos) va **último** y el indirecto cambia como "
       "siempre: *me ne*, *te ne*, *ce ne*, *gliene*.",
  "ex": [["Vuoi delle olive? *Te ne* do un po'.", "¿Querés aceitunas? Te doy unas pocas."],
         ["Ad Anna *gliene* parlo io.", "De eso le hablo yo a Ana."],
         ["Di mele, *ce ne* hanno date tre.", "De manzanas, nos dieron tres."],
         ["*Me ne* porti due?", "¿Me traés dos?"]],
  "warn": "Con *ne* que indica cantidad, el participio concuerda con lo "
          "contado: *ne ho comprati tre* (libri), *ne ho comprate tre* "
          "(mele). *gliene* no cambia nunca.",
  "tip": "*ce ne* también puede ser lugar + *ne*: *ce ne sono due* = hay dos."},

 {"h": "Imperativo formal y negativo",
  "r": "Con **Lei** los pronombres van **delante**: *me lo dica*. Con *non* "
       "+ infinitivo valen las dos posiciones.",
  "ex": [["Signora, *me la* mostri, per favore.", "Señora, muéstremela, por favor."],
         ["Signora, *me la* porti pure.", "Señora, tráigamela nomás."],
         ["Non *dirmelo*!", "¡No me lo digas!"],
         ["Non *me lo* dire!", "¡No me lo digas!"]],
  "warn": "Con **tú** afirmativo van pegados (*dammelo*); con **Lei**, no: "
          "*me lo dica*, nunca *dicamelo*."},

 {"h": "Tres tropiezos típicos",
  "r": "Los errores del hispanohablante son tres: *mi lo* (correcto *me lo*), "
       "*gli lo* (*glielo*) y *glie lo* separado (*glielo*).",
  "ex": [["Me lo dici? (no «*mi lo*»)", "¿Me lo decís?"],
         ["*Glielo* dico io. (no «*gli lo*»)", "Se lo digo yo."],
         ["*Gliele* ho date. (no «*glie le*»)", "Se las di."]],
  "warn": "Y no calques *se lo* de «se lo doy»: para él o ella es *glielo*. "
          "*se lo* en italiano es un reflexivo (*se lo mette*)."},
]},

23: {
"intro": "Comparar es fácil hasta que hay que elegir entre *di* y *che*: en "
         "castellano los dos son «que». Es pregunta fija de todos los "
         "exámenes.",
"parts": [
 {"h": "Comparativos: di o che, igualdad", "blocks": [0, 1],
  "match": r"^(?!.*(superlativ|issimo|más largo|mayor|malísima|máxima|mínima)).*(compar|tan alto|menos|di \+ artículo)"},
 {"h": "Superlativos e irregulares", "blocks": [2, 3, 4],
  "match": r"superlativ|issimo|mayor|más"},
],
"blocks": [
 {"h": "di o che",
  "r": "*di* ante sustantivo, pronombre o número. *che* entre dos adjetivos, "
       "dos verbos o dos sustantivos del mismo verbo, y ante preposición.",
  "table": {"head": ["Se usa", "Cuándo", "Ejemplo"],
            "rows": [["di", "ante sustantivo o pronombre", "Marco è più alto di Luca."],
                     ["di", "ante número", "Ho più di venti libri."],
                     ["che", "entre dos adjetivos", "È più simpatico che bello."],
                     ["che", "entre dos verbos", "È più facile dire che fare."],
                     ["che", "ante preposición", "Vado più a Roma che a Milano."],
                     ["che", "dos sustantivos, mismo verbo", "Bevo più caffè che tè."]]},
  "ex": [["Anna è più giovane *di* me.", "Ana es más joven que yo."],
         ["Ho più *di* venti libri.", "Tengo más de veinte libros."],
         ["Studiare è meno noioso *che* lavorare.", "Estudiar es menos aburrido que trabajar."],
         ["Mi piace più il mare *che* la montagna.", "Me gusta más el mar que la montaña."],
         ["Beatrice è più bella *della* sorella.", "Beatrice es más linda que la hermana."]],
  "more": ["La idea de fondo: *di* compara dos elementos distintos respecto "
           "de UNA misma cualidad (Marco y Luca, respecto de la altura). "
           "*che* compara dos cualidades, dos acciones o dos cantidades del "
           "mismo elemento.",
           "*di* se une al artículo: *più bella della sorella*, *più grande "
           "del Pantheon*. Ante una frase con verbo, *di quel che* o *di "
           "quanto*: *è più intelligente di quel che credevo* (de lo que yo "
           "creía); *più lungo del previsto* (de lo previsto)."]},

 {"h": "Igualdad",
  "r": "*come* o *quanto*: *Marco è alto come Luca*. El *così* o *tanto* de "
       "delante suele omitirse.",
  "ex": [["Marco è alto *come* Luca.", "Marco es tan alto como Luca."],
         ["Marco è *tanto* alto *quanto* Luca.", "Marco es tan alto como Luca."],
         ["Ho *tanti* libri *quanti* quaderni.", "Tengo tantos libros como cuadernos."],
         ["Marco è *così* buono *come* suo nonno.", "Marco es tan bueno como su abuelo."]],
  "tip": "Con sustantivos, *tanto* y *quanto* concuerdan como adjetivos: "
         "*tanti libri quanti quaderni*."},

 {"h": "Superlativo relativo",
  "r": "Artículo + *più / meno* + adjetivo + *di*: *il ragazzo più alto "
       "della classe*. El artículo **no se repite**.",
  "ex": [["È la città *più bella* d'Italia.", "Es la ciudad más linda de Italia."],
         ["È il ragazzo *più alto* della classe.", "Es el chico más alto de la clase."],
         ["È *il più* bravo di tutti.", "Es el más hábil de todos."]],
  "warn": "Nada de «la città la più bella»: un solo artículo, igual que en "
          "castellano.",
  "more": ["Detrás de un superlativo relativo, el italiano culto pide "
           "congiuntivo («la cosa más linda que haya visto»). Lo vas a ver "
           "más adelante, cuando llegue el congiuntivo."]},

 {"h": "Superlativo absoluto",
  "r": "*-issimo* o *molto* + adjetivo: *bellissimo* = *molto bello*. "
       "Concuerda como cualquier adjetivo.",
  "ex": [["Sono *stanchissimo*.", "Estoy cansadísimo."],
         ["È *bravissima*.", "Es buenísima (en lo que hace)."],
         ["Le case sono *molto belle*.", "Las casas son muy lindas."]],
  "tip": "Los terminados en *-co* / *-go* suman *h*: *ricco → ricchissimo*, "
         "*lungo → lunghissimo*."},

 {"h": "Las formas irregulares",
  "r": "*buono, cattivo, grande, piccolo* tienen comparativo propio: "
       "*migliore, peggiore, maggiore, minore*. Adverbios: *meglio, peggio*.",
  "table": {"head": ["Adjetivo", "Comparativo", "Superlativo rel.", "Superl. abs."],
            "rows": [["buono (bueno: mejor)", "migliore", "il migliore", "ottimo"],
                     ["cattivo (malo: peor)", "peggiore", "il peggiore", "pessimo"],
                     ["grande (grande: mayor)", "maggiore", "il maggiore", "massimo"],
                     ["piccolo (chico: menor)", "minore", "il minore", "minimo"],
                     ["bene, adv. (bien: mejor)", "meglio", "—", "benissimo"],
                     ["male, adv. (mal: peor)", "peggio", "—", "malissimo"]]},
  "ex": [["È il mio *migliore* amico.", "Es mi mejor amigo."],
         ["Canta *meglio* di me.", "Canta mejor que yo."],
         ["Oggi sto *peggio*.", "Hoy estoy peor."]],
  "warn": "*migliore* es adjetivo (*un libro migliore*); *meglio* es "
          "adverbio (*canta meglio*). Confundirlos es como decir «canta "
          "mejor libro».",
  "more": ["Con hermanos, *maggiore / minore* = mayor / menor: *mio fratello "
           "maggiore*. *è meglio* + infinitivo = es mejor: *è meglio non "
           "farlo*. «Lo más / lo menos posible»: *il più possibile*, *il meno "
           "possibile*. Y nunca «più meglio»: *meglio* ya es comparativo."]},
]},

24: {
"intro": "Llega el congiuntivo. Esta semana, solo la forma del presente: "
         "regulares, irregulares y la trampa de la vocal. El uso, la semana "
         "que viene.",
"parts": [
 {"h": "Cómo se arma el congiuntivo", "blocks": [0, 1, 2, 5],
  "match": r"^(?!.*(irregular|prefieren|registro cuidado)).*(congiuntivo|subjuntivo)"},
 {"h": "Irregulares y usos", "blocks": [3, 4, 6],
  "match": r"irregular|prefieren"},
],
"blocks": [
 {"h": "Cómo se arma",
  "r": "Tomá el *io* del presente, sacale la *-o* y sumá las terminaciones: "
       "*vengo → venga*, *faccio → faccia*.",
  "table": {"head": ["", "-are (parlare)", "-ere (prendere)", "-ire (dormire)", "-isc (finire)"],
            "rows": [["io", "parli", "prenda", "dorma", "finisca"],
                     ["tu", "parli", "prenda", "dorma", "finisca"],
                     ["lui/lei", "parli", "prenda", "dorma", "finisca"],
                     ["noi", "parliamo", "prendiamo", "dormiamo", "finiamo"],
                     ["voi", "parliate", "prendiate", "dormiate", "finiate"],
                     ["loro", "parlino", "prendano", "dormano", "finiscano"]]},
  "ex": [["Spero che *venga* anche Marco.", "Espero que venga también Marco."],
         ["Voglio che tu *faccia* i compiti.", "Quiero que hagas la tarea."],
         ["Spero che *finiscano* presto.", "Espero que terminen pronto."]],
  "more": ["El mismo mecanismo, con otros irregulares del presente: *esco → "
           "esca*, *dico → dica*, *bevo → beva*, *rimango → rimanga*, "
           "*scelgo → scelga*. Los verbos en *-isc* (*finire*) conservan el "
           "*-isc-* en el singular y en *loro*, igual que en el presente.",
           "La ortografía de siempre: *pagare → paghi*, *cercare → cerchi* "
           "(con h); *cominciare → cominci*, *mangiare → mangi* (una sola i). "
           "Y las familias siguen a su verbo: *tengo → tenga* (y *contenga*), "
           "*riesco → riesca*, *produco → produca*, *propongo → proponga*."]},

 {"h": "Singular idéntico: poné el pronombre",
  "r": "*io*, *tu* y *lui/lei* tienen **la misma forma**. Si no queda claro "
       "quién es el sujeto, poné el pronombre.",
  "ex": [["Credo che *tu abbia* ragione.", "Creo que tenés razón."],
         ["Penso che *lui venga*.", "Creo que viene él."],
         ["Vuole che *io parta*.", "Quiere que yo me vaya."]],
  "warn": "En castellano la terminación ya dice quién («que vengas»), así "
          "que el pronombre se te va a olvidar. *che venga* puede ser yo, "
          "vos o él."},

 {"h": "La vocal que confunde",
  "r": "*-are* hace **-i** (*che parli*), no *-e*. *-ere* e *-ire* hacen "
       "**-a**, como en castellano (*che prenda*, *che dorma*).",
  "ex": [["Credo che lui *parli* bene.", "Creo que él habla bien."],
         ["Credo che lui *prenda* il treno.", "Creo que toma el tren."],
         ["Spero che tu *dorma* bene.", "Espero que duermas bien."],
         ["Spero che *arrivino* presto.", "Espero que lleguen pronto."]],
  "warn": "Como el indicativo es *parla*, el instinto produce «che parla»: "
          "indicativo, error. Otro error típico es la *-e* castellana: «che parle».",
  "more": ["En castellano, *-ar* usa *e* (que hable) y *-er/-ir* usan *a* "
           "(que coma, que viva). El italiano coincide en *-ere/-ire*, pero "
           "en *-are* usa *i*, no *e*."]},

 {"h": "Los irregulares de memoria",
  "r": "Muchos salen del *io* del presente (*vado → vada*). Otros van de "
       "memoria: *sia*, *abbia*, *sappia*, *dia*, *stia*.",
  "table": {"head": ["Verbo", "io/tu/lui", "noi", "voi", "loro"],
            "rows": [["essere", "sia", "siamo", "siate", "siano"],
                     ["avere", "abbia", "abbiamo", "abbiate", "abbiano"],
                     ["andare", "vada", "andiamo", "andiate", "vadano"],
                     ["fare", "faccia", "facciamo", "facciate", "facciano"],
                     ["dare", "dia", "diamo", "diate", "diano"],
                     ["stare", "stia", "stiamo", "stiate", "stiano"],
                     ["potere", "possa", "possiamo", "possiate", "possano"],
                     ["volere", "voglia", "vogliamo", "vogliate", "vogliano"],
                     ["dovere", "debba", "dobbiamo", "dobbiate", "debbano"],
                     ["sapere", "sappia", "sappiamo", "sappiate", "sappiano"],
                     ["venire", "venga", "veniamo", "veniate", "vengano"],
                     ["uscire", "esca", "usciamo", "usciate", "escano"],
                     ["dire", "dica", "diciamo", "diciate", "dicano"],
                     ["bere", "beva", "beviamo", "beviate", "bevano"],
                     ["scegliere", "scelga", "scegliamo", "scegliate", "scelgano"],
                     ["rimanere", "rimanga", "rimaniamo", "rimaniate", "rimangano"]]},
  "ex": [["Spero che *sia* vero.", "Espero que sea verdad."],
         ["Spero che tu *stia* bene.", "Espero que estés bien."],
         ["Credo che *vada* a Roma.", "Creo que va a Roma."],
         ["Spero che *possano* venire.", "Espero que puedan venir."]],
  "tip": "*noi* es igual al indicativo (*parliamo*) y *voi* sale de *noi* "
         "(*-iamo → -iate*). Solo aprendés dos formas: la del singular y la "
         "de *loro*."},

 {"h": "Ya lo venías usando",
  "r": "El imperativo formal de la semana 12 **es congiuntivo**: *Scusi!*, "
       "*Senta!*, *Venga!*. Media forma ya la sabés.",
  "ex": [["*Scusi*, dov'è la stazione?", "Disculpe, ¿dónde está la estación?"],
         ["Mi *dica*!", "¡Dígame!"],
         ["*Prenda* pure!", "¡Tome nomás! (usted)"],
         ["Si *accomodi*!", "¡Póngase cómodo!"]]},

 {"h": "Ortografía: la h y la i que sobra",
  "r": "**-care / -gare** ponen *h* antes de *i*. **-ciare / -giare** "
       "y casi todos los **-iare** no repiten la *i*.",
  "table": {"head": ["Infinitivo", "io/tu/lui", "noi", "loro"],
            "rows": [["cercare", "cerchi", "cerchiamo", "cerchino"],
                     ["pagare", "paghi", "paghiamo", "paghino"],
                     ["cominciare", "cominci", "cominciamo", "comincino"],
                     ["mangiare", "mangi", "mangiamo", "mangino"],
                     ["studiare", "studi", "studiamo", "studino"]]},
  "ex": [["Spero che tu *paghi* con la carta.", "Espero que pagues con tarjeta."],
         ["Credo che *cerchino* un'altra casa.", "Creo que buscan otra casa."],
         ["Voglio che *mangi* qualcosa.", "Quiero que coma algo."]],
  "warn": "El castellano cambia la letra (*busque*, *pague*); el italiano "
          "agrega la *h*: *cerchi*, *paghi*. Y nunca «mangii»: una sola *i* "
          "(salvo *inviare* → *invii*, con *i* tónica)."},

 {"h": "Disparadores mínimos",
  "r": "Para practicar las formas alcanza con la señal: tras *spero che*, "
       "*voglio che*, *credo che* y *è meglio che* usamos congiuntivo.",
  "table": {"head": ["Señal", "Ejemplo"],
            "rows": [["spero che", "Spero che tu *stia* meglio."],
                     ["voglio che", "Voglio che *vengano* anche loro."],
                     ["credo che", "Credo che *abbia* ragione."],
                     ["è meglio che", "È meglio che *paghi* tu."]]},
  "ex": [["Spero che *finisca* presto.", "Espero que termine pronto."],
         ["È meglio che *tu esca* prima.", "Es mejor que salgas antes."]],
  "tip": "Por ahora la señal viene dada en cada ejercicio: tu trabajo es "
         "armar bien la forma. Cuándo usarlo y cuándo no, en la semana 25."},
]},

25: {
"intro": "Ahora, el uso. El gran choque con el castellano son los verbos de "
         "opinión: «creo que es tarde» va con indicativo en castellano y con "
         "congiuntivo en italiano.",
"blocks": [
 {"h": "La regla madre",
  "r": "Congiuntivo después de *che* cuando el principal expresa **algo no "
       "constatado** —opinión, duda, deseo, emoción— y los sujetos son "
       "**distintos**.",
  "table": {"head": ["Categoría", "Verbos", "Ejemplo"],
            "rows": [["opinión", "credere (creer), pensare, ritenere (considerar), immaginare, mi sembra (me parece), ho l'impressione", "Credo che sia tardi. (Creo que es tarde.)"],
                     ["duda", "dubitare (dudar), non sapere se, non è detto (no es seguro)", "Dubito che venga. (Dudo que venga.)"],
                     ["deseo/voluntad", "volere, desiderare, preferire, sperare (esperar), lasciare, permettere", "Voglio che tu venga. (Quiero que vengas.)"],
                     ["emoción", "essere contento, temere (temer), avere paura, mi dispiace, mi fa piacere, che peccato", "Sono contento che tu stia bene. (Me alegra que estés bien.)"],
                     ["espera", "aspettare che (esperar a que)", "Aspetto che finisca. (Espero a que termine.)"],
                     ["impersonales", "è necessario, è possibile, è difficile (es poco probable), bisogna (hace falta), può darsi (puede ser)", "È possibile che piova. (Puede que llueva.)"]]},
  "ex": [["Spero che tu *stia* bene.", "Espero que estés bien."],
         ["Voglio che tu *venga*.", "Quiero que vengas."],
         ["Ho paura che *sia* tardi.", "Tengo miedo de que sea tarde."],
         ["È possibile che *piova*.", "Puede que llueva."]]},

 {"h": "«Creo que es»: congiuntivo",
  "q": [{"prompt": "¿Cuál está bien? «Creo que tiene razón.»", "answer": "Credo che abbia ragione.", "options": ["Credo che abbia ragione.", "Credo che ha ragione.", "Credo che avrà ragione."]}, {"prompt": "Elegí la que va", "stem": "Penso che ___ una buona idea.", "answer": "sia", "options": ["sia", "è", "sarà"]}, {"prompt": "Elegí la que va", "stem": "Mi sembra che Marco ___ stanco.", "answer": "sia", "options": ["sia", "è", "sta"]}],
  "r": "*credere*, *pensare*, *sembrare* piden **congiuntivo**, aunque en "
       "castellano vayan con indicativo: *Credo che sia tardi*.",
  "ex": [["Credo che *abbia* ragione.", "Creo que tiene razón."],
         ["Penso che *sia* una buona idea.", "Pienso que es una buena idea."],
         ["Mi sembra che *sia* in ritardo.", "Me parece que está atrasado."],
         ["Immagino che tu *sia* stanco.", "Imagino que estás cansado."]],
  "warn": "En el italiano hablado se oye también *credo che è*; para "
          "escribir y en un examen, se espera el congiuntivo.",
  "tip": "*sperare* admite futuro: *spero che verrà* es correcto."},

 {"h": "Cuándo NO va congiuntivo",
  "q": [{"prompt": "¿Cuál está bien? «Es verdad que tiene razón.»", "answer": "È vero che ha ragione.", "options": ["È vero che ha ragione.", "È vero che abbia ragione.", "È vero che avesse ragione."]}, {"prompt": "Elegí la que va", "stem": "So che ___ tardi.", "answer": "è", "options": ["è", "sia", "fosse"]}, {"prompt": "Elegí la que va", "stem": "Secondo me, ___ una buona idea.", "answer": "è", "options": ["è", "sia", "che sia"]}],
  "r": "Si el principal presenta **un hecho** (*so che*, *è vero che*, *vedo "
       "che*) o hay *secondo me*: **indicativo**.",
  "ex": [["*So che è* tardi.", "Sé que es tarde."],
         ["*È vero che ha* ragione.", "Es verdad que tiene razón."],
         ["*Vedo che sei* stanco.", "Veo que estás cansado."],
         ["*Secondo me, è* una buona idea.", "Para mí, es una buena idea."]],
  "tip": "Si la información se da como dato, indicativo. Si pasa por la "
         "cabeza de alguien —creo, espero, temo, quiero, dudo—, congiuntivo.",
  "more": ["Otros que presentan hechos y van con indicativo: *è certo che*, "
           "*è chiaro che*, *dico che*, *sono sicuro che*."]},

 {"h": "Mismo sujeto: infinitivo",
  "q": [{"prompt": "¿Cuál está bien? «Creo que tengo razón.»", "answer": "Credo di avere ragione.", "options": ["Credo di avere ragione.", "Credo che io abbia ragione.", "Credo avere ragione."]}, {"prompt": "¿Cuál está bien? «Quiero irme mañana.»", "answer": "Voglio partire domani.", "options": ["Voglio partire domani.", "Voglio di partire domani.", "Voglio che parta domani."]}, {"prompt": "Elegí la que va", "stem": "Spero ___ in tempo.", "answer": "di arrivare", "options": ["di arrivare", "che arrivi", "arrivare"]}],
  "r": "Si el sujeto es **el mismo**, nada de *che*: *di* + infinitivo. "
       "Castellano: «creo que tengo»; italiano: *credo di avere*.",
  "ex": [["Credo *di avere* ragione.", "Creo que tengo razón. (mismo sujeto)"],
         ["Spero *di arrivare* in tempo.", "Espero llegar a tiempo."],
         ["Voglio *partire* domani.", "Quiero irme mañana. (sin di)"],
         ["Voglio che tu *parta* domani.", "Quiero que te vayas mañana."]],
  "warn": "*volere*, *potere*, *dovere*, *preferire*, *desiderare* van con "
          "infinitivo **sin** *di*: *voglio partire*. *sperare*, *credere*, "
          "*pensare* piden *di*: *spero di partire*."},
 {"h": "Conjunciones con congiuntivo",
  "r": "Algunas conjunciones piden **siempre** congiuntivo: *benché*, "
       "*sebbene*, *affinché*, *purché*, *prima che*, *senza che*, *a meno che*.",
  "table": {"head": ["Conjunción", "Significa", "Ejemplo"],
            "rows": [["benché / sebbene", "aunque", "Esco, benché piova."],
                     ["affinché", "para que", "Te lo dico affinché tu capisca."],
                     ["purché", "con tal de que", "Vengo purché ci sia posto."],
                     ["prima che", "antes de que", "Parto prima che sia buio."],
                     ["senza che", "sin que", "Esce senza che nessuno lo veda."],
                     ["a meno che (non)", "a menos que", "Vengo, a meno che non piova."]]},
  "ex": [["*Benché sia* stanco, lavora.", "Aunque está cansado, trabaja."],
         ["Te lo ripeto *affinché tu capisca*.", "Te lo repito para que entiendas."],
         ["Ti presto l'auto *purché tu la usi* con cura.", "Te presto el auto con tal de que lo uses con cuidado."],
         ["Chiamami *prima che sia* tardi.", "Llamame antes de que sea tarde."]],
  "warn": "*anche se* va con **indicativo**: *anche se è stanco, lavora*. "
          "Con el mismo sujeto y *prima*, *senza*: infinitivo (*prima di "
          "partire*, *senza dire nulla*).",
  "more": ["Tras *a meno che*, el *non* no niega: *a meno che non piova*."],
  "qq": [{"prompt": "Elegí la que va", "stem": "Ti chiamo prima che tu ___.", "answer": "parta", "options": ["parta", "parti", "partire"]},
         {"prompt": "Elegí la que va", "stem": "Anche se ___, esco.", "answer": "piove", "options": ["piove", "piova", "piovere"]},
         {"prompt": "Elegí la que va", "stem": "Cerco qualcuno che ___ il tedesco.", "answer": "sappia", "options": ["sappia", "sa", "sapere"]}]},


 {"h": "Negar un verbo declarativo",
  "r": "*dire*, *sapere*, *vedere* dan un hecho (indicativo); en **negativo** "
       "o con duda pasan a congiuntivo: *non dico che sia*.",
  "ex": [["Dico che *è* stanco.", "Digo que está cansado."],
         ["*Non dico che sia* stanco.", "No digo que esté cansado."],
         ["*Non penso che* tu *abbia* torto.", "No creo que te equivoques."],
         ["Non so se *viene*.", "No sé si viene."]],
  "warn": "*non so se* suele llevar indicativo: *se* no es "
          "*che*. Y *non sono sicuro che* va con congiuntivo."},

 {"h": "Relativas y superlativos",
  "r": "Con un antecedente **buscado o indefinido**, o tras un superlativo, la "
       "relativa lleva congiuntivo: *cerco un posto che sia tranquillo*.",
  "ex": [["Cerco un ristorante che *serva* cucina vegana.", "Busco un restaurante que sirva cocina vegana."],
         ["Conosco un ristorante che *serve* cucina vegana.", "Conozco un restaurante que sirve cocina vegana."],
         ["È la persona più simpatica che *io conosca*.", "Es la persona más simpática que conozco."],
         ["Chiunque *venga* è benvenuto.", "Quien venga es bienvenido."]],
  "tip": "Si el antecedente **existe y lo conocés**, indicativo. Si lo "
         "**buscás o no sabés si existe**, congiuntivo."},

 {"h": "Opinar y matizar sin imponer",
  "r": "La opinión se **presenta como tuya**: *secondo me* (+ indicativo), *mi "
       "sembra che* (+ congiuntivo). *Forse* y *non so se* matizan.",
  "ex": [["*Secondo me* è troppo caro.", "Para mí es demasiado caro."],
         ["*Mi sembra che* sia una buona idea.", "Me parece que es una buena idea."],
         ["*Mi sa che* ha ragione lei.", "Me da que tiene razón ella."],
         ["*Non so se* sia la soluzione giusta.", "No sé si es la solución correcta."]],
  "warn": "*Hai torto* o *è così e basta* cierran la charla. Para disentir, primero "
          "concedé algo: *capisco, però…*, *può darsi, ma secondo me…*.",
  "tip": "*Mi sa che* (me da que) es coloquial y va con indicativo; *direi che* "
         "(diría que) sirve en cualquier registro.",
  "more": ["Pasarse de matices también confunde: *forse, non so, magari, può "
           "darsi…* todo junto parece que no tenés opinión. Uno o dos alcanzan."]},
]},

26: {
"intro": "Cierre de la segunda estación: pasados y futuros ordenados, el "
         "trapassato prossimo, los pronombres combinados con *ne* y *ci*, y "
         "el congiuntivo presente.",
"parts": [
 {"h": "Repaso: los tiempos del pasado y del futuro", "blocks": [0, 1, 2, 3],
  "match": r"^(?!.*piac).*(futuro|condicional|condizionale|imperfetto|passato|trapassato|tiempo|auxiliar|reflexivo)"},
 {"h": "Repaso: pronombres combinados, ne, ci y congiuntivo", "blocks": [4, 5],
  "match": r"^(?!.*piac).*(pronombre|combinad|«ne»|\bne\b|\bci\b|congiuntivo|subjuntivo|posesiv|indefinid)"},
 {"h": "Repaso: trampas de los verbos y de la frase", "blocks": [6, 7],
  "match": r"\S"},
 {"h": "Las tres Italias", "blocks": [8],
  "match": r"^(?!)"},
],
"blocks": [
 {"h": "El mapa de los tiempos",
  "r": "Dos mecanismos: terminación sobre la raíz (presente, imperfetto, "
       "futuro, condizionale) o auxiliar + participio (tiempos compuestos).",
  "table": {"head": ["Tiempo", "Se forma", "Sirve para", "Ejemplo"],
            "rows": [["presente", "raíz + terminación", "ahora, habitual, futuro cercano", "lavoro (trabajo)"],
                     ["passato prossimo", "avere/essere + participio", "hecho pasado y terminado", "ho lavorato (trabajé)"],
                     ["imperfetto", "raíz + -avo/-evo/-ivo", "fondo, costumbre, descripción", "lavoravo (trabajaba)"],
                     ["trapassato prossimo", "avevo/ero + participio", "pasado anterior a otro pasado", "avevo lavorato (había trabajado)"],
                     ["futuro semplice", "raíz de futuro + -ò, -ai, -à", "porvenir y suposición", "lavorerò (voy a trabajar)"],
                     ["futuro anteriore", "avrò/sarò + participio", "terminado antes de un futuro", "avrò lavorato (habré trabajado)"],
                     ["condizionale", "raíz de futuro + -ei, -esti, -ebbe", "cortesía, deseo, noticia no confirmada", "lavorerei (trabajaría)"]]},
  "ex": [["Ieri *ho lavorato* tanto.", "Ayer trabajé mucho."],
         ["Da ragazzo *lavoravo* in un bar.", "De joven trabajaba en un bar."],
         ["Domani *lavorerò* da casa.", "Mañana voy a trabajar desde casa."],
         ["*Lavorerei* volentieri con te.", "Trabajaría con gusto con vos."]]},

 {"h": "El trapassato prossimo",
  "r": "Imperfetto de *avere* o *essere* + participio: lo que pasó **antes** "
       "de otro hecho pasado.",
  "ex": [["*Avevo* già *mangiato*.", "Ya había comido."],
         ["Non *avevo* mai *visto* Roma.", "Nunca había visto Roma."],
         ["Quando sono arrivato, il film *era* già *cominciato*.", "Cuando llegué, la película ya había empezado."]],
  "warn": "Al hablar decimos «cuando llegué, la película ya empezó». En "
          "italiano, el hecho anterior va en trapassato: *era già "
          "cominciato*.",
  "tip": "El auxiliar se elige como en el passato prossimo: *avevo "
         "mangiato*, *ero uscito*."},

 {"h": "Auxiliar: la decisión de cada frase",
  "r": "*essere*: desplazamiento (*andare, uscire*), cambio de estado, "
       "reflexivos y familia de *piacere*. *avere*: todo lo demás.",
  "ex": [["Anna *è uscita* presto.", "Ana salió temprano."],
         ["*Sono diventato* papà.", "Me convertí en papá."],
         ["*Ho camminato* tanto.", "Caminé mucho."],
         ["Mi *è piaciuta* la cena.", "Me gustó la cena."]],
  "warn": "Con *avere*, el participio concuerda con *lo, la, li, le, ne* "
          "delante (*le ho viste, ne ho comprate due*); con *mi, ti, ci, vi* "
          "es opcional.",
  "tip": "Moverse no alcanza: *camminare*, *viaggiare* y *nuotare* van con "
         "*avere*.",
  "more": ["Con *essere*, el participio concuerda con el sujeto: *Anna è "
           "uscita*, *i ragazzi sono arrivati*. También van con *essere* "
           "los pronominales (*mi sono accorto*) y los impersonales (*è "
           "successo*)."]},

 {"h": "Raíces de futuro y condizionale",
  "r": "La raíz irregular del futuro es la misma del condizionale: *sarò / "
       "sarei*, *vorrò / vorrei*.",
  "table": {"head": ["Verbo", "Raíz", "Verbo", "Raíz"],
            "rows": [["essere", "sar-", "avere", "avr-"],
                     ["andare", "andr-", "potere", "potr-"],
                     ["volere", "vorr-", "venire", "verr-"],
                     ["dovere", "dovr-", "sapere", "sapr-"],
                     ["vedere", "vedr-", "rimanere", "rimarr-"],
                     ["tenere", "terr-", "bere", "berr-"],
                     ["fare", "far-", "dare", "dar-"]]},
  "ex": [["*Verrò* alla festa.", "Voy a ir a la fiesta."],
         ["*Verrei*, ma non posso.", "Iría, pero no puedo."],
         ["Domani *dovrò* lavorare.", "Mañana voy a tener que trabajar."],
         ["*Dovresti* riposare.", "Deberías descansar."]]},

 {"h": "Pronombres combinados, ne y ci",
  "r": "Indirecto primero y *-i* → **-e**: *me lo*; *gli* + *lo* → "
       "**glielo**. *ne*: cantidad o «de eso». *ci*: lugar.",
  "ex": [["*Me lo* dai?", "¿Me lo das?"],
         ["*Glielo* dico io.", "Se lo digo yo."],
         ["Quanti libri hai? *Ne* ho tre.", "¿Cuántos libros tenés? Tengo tres."],
         ["Vai a Roma? Sì, *ci* vado domani.", "¿Vas a Roma? Sí, voy mañana."]]},

 {"h": "Congiuntivo presente",
  "r": "Después de *penso che, credo che, voglio che, spero che*: "
       "**congiuntivo**. Con *so che* y *è vero che*, indicativo.",
  "table": {"head": ["", "parlare", "prendere", "essere", "avere"],
            "rows": [["io/tu/lui", "parli", "prenda", "sia", "abbia"],
                     ["noi", "parliamo", "prendiamo", "siamo", "abbiamo"],
                     ["voi", "parliate", "prendiate", "siate", "abbiate"],
                     ["loro", "parlino", "prendano", "siano", "abbiano"]]},
  "ex": [["Penso che *sia* tardi.", "Creo que es tarde."],
         ["Voglio che tu *venga*.", "Quiero que vengas."],
         ["So che *è* tardi.", "Sé que es tarde. (dato: indicativo)"]],
  "warn": "*Credo che sia tardi*, nunca «credo che è tardi». Y con el mismo "
          "sujeto, *di* + infinitivo: *credo di avere ragione*."},

 {"h": "Repaso: trampas de los verbos",
  "r": "1. *mi sono lavato*, jamás «mi ho lavato». 2. *parleremo* ≠ "
       "*parleremmo*. 3. Futuro después de *quando*.",
  "ex": [["Stamattina *mi sono alzato* tardi.", "Hoy a la mañana me levanté tarde."],
         ["Domani *parleremo* con lui.", "Mañana vamos a hablar con él."],
         ["*Parleremmo* volentieri con lui.", "Hablaríamos con gusto con él."],
         ["Quando *arriverai*, ti chiamerò.", "Cuando llegues, te llamo."]],
  "tip": "Y detrás de *se* hipotético, nunca condizionale: «se avrei» no "
         "existe."},

 {"h": "Repaso: trampas de la frase",
  "r": "4. *migliore* adjetivo, *meglio* adverbio. 5. *più alto di Luca*, "
       "pero *più simpatico che bello*. 6. *qualche* + singular.",
  "ex": [["È il mio *migliore* amico.", "Es mi mejor amigo."],
         ["Canta *meglio* di me.", "Canta mejor que yo."],
         ["È più simpatico *che* bello.", "Es más simpático que lindo."],
         ["Ho *qualche* amico a Roma.", "Tengo algunos amigos en Roma."]],
  "tip": "7. *mio padre*, sin artículo; pero *il loro padre* y *i miei "
         "fratelli*, con artículo."},

 {"h": "Las tres Italias: cómo suena cada región",
  "r": "Italia tiene **tres grandes zonas** de habla: norte, centro y sur. El "
       "italiano es el mismo; cambian el acento y algunos usos.",
  "table": {"head": ["Zona", "Qué se oye", "Ejemplo"],
            "rows": [["Norte (Milano, Torino, Venezia)", "e y o cerradas; s sonora; passato prossimo siempre", "Ieri sono andato: nunca «andai»"],
                     ["Centro (Firenze, Roma)", "la c aspirada en Toscana; si por noi", "la hasa; noi si va"],
                     ["Sur (Napoli, Bari, Palermo)", "stare por essere; tenere por avere; passato remoto hablado", "sto stanco; tengo fame; ieri andai"]]},
  "ex": [["*Ho* fame.", "Tengo hambre. En el sur se oye «tengo fame»."],
         ["*Sono* stanco.", "Estoy cansado. En el sur se oye «sto stanco»."],
         ["Ieri *sono andato* al mare.", "Ayer fui al mar. En el sur también se oye «ieri andai»."]],
  "warn": "*Tengo fame* te va a sonar natural, pero en estándar es *ho fame*. "
          "Reconocelo al oírlo; no lo copies.",
  "tip": "El *dialetto* es otra lengua (el napolitano, el véneto); el *italiano "
         "regionale* es el italiano con acento y giros de la zona."},
]},

}
