# -*- coding: utf-8 -*-
"""Stagione 1 — Le Fondamenta (settimane 1-13, A1 → A2)."""

LESSONS = {

1: {
"intro": "El italiano se escribe casi como el castellano pero suena "
         "distinto. Antes de la gramática, a leer en voz alta.",
"parts": [
 {"h": "Alfabeto, c/g y dobles", "blocks": [0, 1, 2],
  "match": r"Escuchá|sonido duro|sonido suave|doble"},
 {"h": "Acento, detalles y vocales", "blocks": [3, 4, 5],
  "match": r"Cómo se escribe|«è»|«o»|tilde|acento|vocal"},
 {"h": "Saludar y tus dos primeros verbos: essere y avere", "blocks": [6, 7],
  "match": r"essere|avere"},
],
"blocks": [
 {"h": "Un alfabeto de 21 letras",
  "q": [{"prompt": "¿Cómo se escribe «señor» en italiano?", "answer": "signore", "options": ["signore", "señore", "sinnore"]}, {"prompt": "¿Qué letra no suena nunca en italiano?", "answer": "h", "options": ["h", "g", "s"]}],
  "r": "Sin *j, k, w, x, y* (salvo préstamos) ni *ñ*. La *h* no suena "
       "nunca. Las vocales, limpias como en castellano.",
  "ex": [["il *j*azz, il *w*eekend", "préstamos: se escriben como en el original"],
         ["*h*o / o", "tengo / o: la h no suena"],
         ["*h*otel", "se lee «otel»"],
         ["si*gn*ore", "señor: la ñ se escribe gn"]],
  "tip": "Ya tenés el 80% de la pronunciación: las vocales son las tuyas."},

 {"h": "c y g cambian según la vocal",
  "r": "*c* y *g*: duras ante *a, o, u*; blandas ante *e, i*. La *h* las "
       "endurece; una *i* muda las ablanda.",
  "table": {"head": ["Se escribe", "Suena", "Ejemplo"],
            "rows": [["ca, co, cu", "ka, ko, ku", "casa, cosa (cosa), cubo"],
                     ["ce, ci", "ch de chico (tʃe, tʃi)", "cena, cinema (cine)"],
                     ["che, chi", "k de queso (ke, ki)", "perché (porque), chiave (llave)"],
                     ["cia, cio, ciu", "cha, cho, chu", "ciao (chau), cioccolata"],
                     ["ga, go, gu", "ga, go, gu", "gatto (gato), gonna (pollera)"],
                     ["ge, gi", "dy, como la j de «jeans»", "gelato (helado), giro (vuelta)"],
                     ["ghe, ghi", "gue, gui", "spaghetti, ghiaccio (hielo)"],
                     ["gn", "ñ", "signore (señor), bagno (baño)"],
                     ["gli", "la «ll» tradicional (no la porteña): lengua en el paladar, no «li»", "figlio (hijo), aglio (ajo)"],
                     ["sce, sci", "sh inglesa", "pesce (pescado), sciare (esquiar)"],
                     ["z", "ts o dz", "grazie (gracias), zero (cero)"]]},
  "ex": [["*ce*na / *che*", "cena / que: «chena», «ke»"],
         ["*ge*lato / spa*ghe*tti", "helado / spaghetti: «dyelato», «spaguetti»"],
         ["*cia*o, *gio*rno", "chau, día: la i no suena"],
         ["pe*sce*", "pescado: «peshe»"]],
  "warn": "*gi, ge* no son la j castellana ni la ll porteña: *gelato* "
          "suena «dyelato». *che, chi* suenan «ke, ki»; *ce, ci* sí suenan «che, chi»."},

 {"h": "Las dobles consonantes",
  "r": "Una consonante doble **dura más** y cambia la palabra: *nono* "
       "(noveno) no es *nonno* (abuelo).",
  "ex": [["nono / no*nn*o", "noveno / abuelo"],
         ["casa / ca*ss*a", "casa / caja"],
         ["pena / pe*nn*a", "pena / lapicera"],
         ["sete / se*tt*e", "sed / siete"]],
  "warn": "Es la falta más frecuente del hispanohablante: *bello*, "
          "*sorella*, *mamma*, *appartamento* se escriben con doble.",
  "more": ["En castellano ninguna consonante larga distingue palabras (la "
           "*rr* y la *ll* son sonidos distintos, no alargados), así que el "
           "oído no está entrenado. Pronunciala larga, como si la "
           "sostuvieras: en *penna* la n dura el doble."]},

 {"h": "El acento: dónde cae y cuándo se escribe",
  "r": "La mayoría son llanas (*CA-sa*). La tilde solo se escribe si el "
       "acento cae en la última sílaba: *città*, *perché*, *caffè*.",
  "ex": [["citt*à*, caff*è*, per*ò*", "tilde: acento al final"],
         ["*a*bitano, te*le*fono", "esdrújulas sin tilde: Á-bitano, te-LÉ-fono"],
         ["*ca*mera", "habitación: CÁ-mera, sin tilde"],
         ["*è* / e", "es / y"]],
  "tip": "Si no ves tilde, no acentúes la última sílaba: *PAR-lo*, nunca "
         "«par-LÓ».",
  "more": ["La tilde también distingue monosílabos: *è* (es) / *e* (y), *dà* "
           "(da) / *da* (de, desde), *sì* (sí) / *si* (se). Muchas "
           "esdrújulas no coinciden con el castellano y no se marcan: hay "
           "que aprenderlas con el oído."]},

 {"h": "Detalles que se pegan rápido",
  "q": [{"prompt": "¿Cómo suena «questo»?", "answer": "«cuésto»", "options": ["«cuésto»", "«késto»", "«güésto»"]}, {"prompt": "¿Cuál se pronuncia con r vibrante, como «perro»?", "answer": "carro", "options": ["carro", "caro", "cara"]}],
  "r": "*qu* suena «cu». La *s* entre vocales suele ser sonora. La *r* "
       "simple es un toque; la *rr*, vibrante.",
  "ex": [["*qu*esto", "«cuésto», nunca «késto»"],
         ["ro*s*a", "rosa: s sonora, como una z inglesa"],
         ["ca*r*o / ca*rr*o", "querido (r simple) / carro (rr vibrante)"]]},

 {"h": "Siete vocales, no cinco",
  "r": "La *e* y la *o* acentuadas pueden ser **abiertas** (*è*, *ò*) o "
       "**cerradas** (*é*, *ó*). A veces cambian la palabra.",
  "ex": [["p*è*sca / p*é*sca", "durazno / pesca (de pescar)"],
         ["*è* / *e*", "es (abierta) / y (cerrada)"],
         ["p*ò*rta / s*ó*le", "puerta (o abierta) / sol (o cerrada)"]],
  "warn": "Ni *b* = *v* ni «e» delante de *s* + consonante: *vino* con v de "
          "labios y dientes, *scuola* y *studente*, nunca «escuola».",
  "tip": "Escuchá cada ejemplo con 🔊 y repetilo en voz alta: la diferencia "
         "se aprende con el oído, no con la regla.",
  "more": ["En el norte y en el sur la distribución de las vocales abiertas "
           "cambia; el modelo del curso es el italiano estándar. Lo que sí "
           "conviene cuidar siempre son las dobles, la *s* de *scuola* y la "
           "*v*."]},

 {"h": "Tus dos primeros verbos: essere y avere",
  "r": "*essere* = ser (y muchas veces «estar»); *avere* = tener. Son "
       "irregulares: de memoria. El pronombre se suele omitir.",
  "table": {"head": ["", "essere", "avere"],
            "rows": [["io (yo)", "sono", "ho"],
                     ["tu (vos)", "sei", "hai"],
                     ["lui / lei (él / ella)", "è", "ha"],
                     ["noi (nosotros)", "siamo", "abbiamo"],
                     ["voi (ustedes)", "siete", "avete"],
                     ["loro (ellos / ellas)", "sono", "hanno"]]},
  "ex": [["*Sono* di Buenos Aires.", "Soy de Buenos Aires."],
         ["Il caffè *è* caldo.", "El café está caliente."],
         ["*Ho* vent'anni.", "Tengo veinte años."],
         ["*Non ho* fame.", "No tengo hambre."],
         ["*C'è* un bar qui vicino? *Ci sono* bar qui vicino?", "¿Hay un bar cerca? ¿Hay bares cerca?"]],
  "warn": "*è* (es) lleva tilde; *e* (y), no. Y *ho, hai, ha, hanno* se leen "
          "«o, ai, a, anno». Para negar, *non* delante del verbo: *non sono*, "
          "*non ho*.",
  "tip": "Edad y sensaciones van con *avere*: *ho fame, ho sete, ho sonno, "
         "ho fretta* (estoy apurado). «Hay» = *c'è* + singular, *ci sono* + "
         "plural.",
  "more": ["Con *avere* también: *ho freddo / ho caldo* (frío / calor), *ho "
           "paura* (miedo), *ho vergogna* (vergüenza), *ho voglia di* (tengo "
           "ganas de), *ho bisogno di* (necesito), *ho ragione / ho torto* "
           "(tengo razón / estoy equivocado). Con *essere*: *sono d'accordo* "
           "(estoy de acuerdo), *sono in ritardo* (llego tarde).",
           "*sono* sirve para «yo soy» y para «ellos son»: el contexto decide. "
           "*voi* es «ustedes» en confianza; el trato de usted, *Lei*, viene en el "
           "bloque siguiente. Dos sujetos se suman: *tu e Paola* = *voi* (*siete*), "
           "*io e Marco* = *noi* (*siamo*)."]},

 {"h": "Saludar, tu / Lei y deletrear",
  "r": "*ciao* saluda y despide entre amigos; *buongiorno* y *arrivederci* "
       "son más neutros. Con desconocidos y en lo formal, **Lei**; con "
       "amigos, *tu*.",
  "table": {"head": ["Situación", "Informal (tu)", "Formal (Lei)"],
            "rows": [["Saludar", "ciao", "buongiorno / buonasera"],
                     ["Despedirte", "ciao / a presto", "arrivederci"],
                     ["Preguntar el nombre", "Come ti chiami?", "Come si chiama?"],
                     ["Presentarte", "Mi chiamo Ana.", "Mi chiamo Ana."]]},
  "ex": [["*Ciao*, mi chiamo Marco.", "Hola, me llamo Marco."],
         ["*Buongiorno*, come sta?", "Buen día, ¿cómo está usted?"],
         ["*Arrivederci*, signora!", "¡Hasta luego, señora!"],
         ["Come si scrive? *A - B - C*", "¿Cómo se escribe? A - B - C"]],
  "warn": "Al deletrear, las letras se dicen a la italiana: *a, bi, ci, "
          "di, e, effe, gi, acca, i, elle, emme, enne, o, pi, cu, erre, "
          "esse, ti, u, vu, zeta*.",
  "tip": "Para pedir que deletreen: *Come si scrive?* Para presentarte: "
         "*Mi chiamo…* o *Sono…*."},
]},

2: {
"intro": "El género y el número del sustantivo mandan sobre artículo y "
         "adjetivo. Esta semana: las terminaciones, los plurales con trampa "
         "y los géneros que no coinciden con el castellano.",
"parts": [
 {"h": "Género: el esquema, las sorpresas y «hay»", "blocks": [0, 4, 5, 6],
  "match": r"masculino o femenino|género|c'è|ci sono"},
 {"h": "Plural: regulares, con h, invariables e irregulares", "blocks": [1, 2, 3],
  "match": r"plural"},
],
"blocks": [
 {"h": "El esquema básico",
  "r": "*-o → -i* masculino; *-a → -e* femenino; *-e → -i*, **cualquiera "
       "de los dos**: ese género se aprende con la palabra.",
  "table": {"head": ["Singular", "Plural", "Género", "Ejemplo"],
            "rows": [["-o", "-i", "masculino", "libro → libri"],
                     ["-a", "-e", "femenino", "casa → case"],
                     ["-e", "-i", "masc. o fem.", "studente → studenti; chiave → chiavi"]]},
  "ex": [["il libr*o* → i libr*i*", "el libro → los libros"],
         ["la cas*a* → le cas*e*", "la casa → las casas"],
         ["il fior*e* → i fior*i*", "la flor → las flores"],
         ["la chiav*e* → le chiav*i*", "la llave → las llaves"]],
  "warn": "El plural nunca lleva *-s*: *le case*, no «le casas». Y los "
          "femeninos en *-a* van a *-e*, no a *-i*.",
  "tip": "Femeninas: *-zione, -sione, -tà, -tù*, casi siempre *-trice* (*la "
         "stazione, la città, l'attrice*). Masculinas: *-ore, -ale, -ame* "
         "(*il dottore, il giornale*)."},

 {"h": "Plurales con h: -chi, -ghi",
  "r": "Para no ablandar *c* y *g*, muchos plurales agregan **h**: *amica → "
       "amiche*. Es ortografía: el sonido no cambia.",
  "table": {"head": ["Terminación", "Plural", "Ejemplos"],
            "rows": [["-ca, -ga", "-che, -ghe (siempre)", "amica → amiche (amigas); riga → righe (renglones)"],
                     ["-co, -go (llanas)", "-chi, -ghi", "banco → banchi (bancos); lago → laghi (lagos)"],
                     ["-co, -go (esdrújulas)", "-ci, -gi (salvo dialoghi, carichi)", "medico → medici (médicos); biologo → biologi (biólogos)"],
                     ["-cia, -gia (vocal antes)", "-cie, -gie", "camicia → camicie (camisas); valigia → valigie (valijas)"],
                     ["-cia, -gia (consonante antes)", "-ce, -ge", "arancia → arance (naranjas); spiaggia → spiagge (playas)"],
                     ["-io (i átona)", "-i", "figlio → figli (hijos)"],
                     ["-io (i tónica)", "-ii", "zio → zii (tíos)"]]},
  "ex": [["ami*ca* → ami*che*", "amiga → amigas"],
         ["la*go* → la*ghi*", "lago → lagos"],
         ["ban*co* → ban*chi*", "banco → bancos"],
         ["medi*co* → medi*ci*", "médico → médicos (esdrújula: sin h)"]],
  "warn": "Excepciones llanas sin *h*: *amico → amici*, *greco → greci*, "
          "*nemico → nemici*."},

 {"h": "Los que no cambian",
  "q": [{"prompt": "Plural de «la città»", "answer": "le città", "options": ["le città", "le cittàs", "le citte"]}, {"prompt": "Plural de «il film»", "answer": "i film", "options": ["i film", "i filmi", "i films"]}, {"prompt": "Plural de «la crisi»", "answer": "le crisi", "options": ["le crisi", "le crise", "le crisis"]}],
  "r": "**Invariables**: terminados en consonante, en vocal con tilde, "
       "monosílabos y en *-i*. Solo cambia el artículo.",
  "ex": [["*il* film → *i* film", "la película → las películas"],
         ["*la* città → *le* città", "la ciudad → las ciudades"],
         ["*il* re → *i* re", "el rey → los reyes"],
         ["*la* crisi → *le* crisi", "la crisis → las crisis"]],
  "warn": "Las palabras acortadas tampoco cambian: *la foto → le foto*, *la "
          "moto → le moto*. Nada de «le fote»."},

 {"h": "Irregulares de todos los días",
  "r": "Pocos, pero frecuentes. Varias partes del cuerpo hacen el plural en "
       "**-a** y pasan a femenino: *il braccio → le braccia*.",
  "table": {"head": ["Singular", "Plural", "Nota"],
            "rows": [["l'uomo", "gli uomini", "el hombre"],
                     ["l'uovo (m.)", "le uova (f.)", "el huevo: cambia de género"],
                     ["il braccio", "le braccia", "el brazo: plural en -a"],
                     ["il dito", "le dita", "el dedo: plural en -a"],
                     ["il ginocchio", "le ginocchia", "la rodilla: plural en -a"],
                     ["la mano", "le mani", "la mano: femenino aunque termine en -o"],
                     ["il paio", "le paia", "el par"],
                     ["il dio", "gli dei", "el dios"]]},
  "ex": [["l'uomo → gli *uomini*", "el hombre → los hombres"],
         ["il bracci*o* → le bracci*a*", "el brazo → los brazos"],
         ["l'uov*o* → le uov*a*", "el huevo → los huevos"],
         ["la man*o* → le man*i*", "la mano → las manos"]],
  "warn": "*le uova* y *le braccia* son femeninos: *le uova sono fresche*, "
          "nunca «gli uova»."},

 {"h": "Géneros que no coinciden",
  "q": [{"prompt": "¿Cuál está bien? «la leche»", "answer": "il latte", "options": ["il latte", "la latte", "lo latte"]}, {"prompt": "¿Cuál está bien? «la sangre»", "answer": "il sangue", "options": ["il sangue", "la sangue", "lo sangue"]}, {"prompt": "¿Cuál está bien? «los problemas»", "answer": "i problemi", "options": ["i problemi", "le probleme", "i problema"]}],
  "r": "No confíes en el castellano: muchos géneros no coinciden. *il "
       "latte, il fiore* son masculinos; *la fine* es femenino.",
  "ex": [["*il* latte", "la leche"],
         ["*il* fiore", "la flor"],
         ["*il* sale", "la sal"],
         ["*la* fine", "el fin"]],
  "warn": "*il sangue* (la sangre), *il costume* (la costumbre), *il "
          "carcere* (la cárcel), *l'analisi* (f., el análisis). Son las que "
          "más puntos hacen perder.",
  "more": ["Más de la lista: *il miele* (la miel), *l'arte* (f., el arte), "
           "*l'origine* (f., el origen), *la domenica* (el domingo, único día "
           "femenino).",
           "Los helenismos en *-ma* y *-eta* son masculinos como en "
           "castellano y hacen el plural en *-i*: *il problema → i "
           "problemi*, *il programma, il sistema, il tema, il poeta*."]},

 {"h": "Los de -ista",
  "q": [{"prompt": "Plural de «la turista» (mujeres)", "answer": "le turiste", "options": ["le turiste", "le turisti", "le turista"]}, {"prompt": "Plural de «il giornalista»", "answer": "i giornalisti", "options": ["i giornalisti", "i giornaliste", "i giornalista"]}],
  "r": "En singular sirven para los dos géneros (*il / la giornalista*); en "
       "plural se separan: *i giornalisti* / *le giornaliste*.",
  "ex": [["*il* turista / *la* turista", "el turista / la turista"],
         ["i turist*i* / le turist*e*", "los turistas / las turistas"],
         ["*la* dentista", "la dentista"]]},

 {"h": "Decir qué hay: c'è / ci sono",
  "r": "«Hay» es invariable en castellano; en italiano **concuerda** con lo "
       "que hay: *c'è* + singular, *ci sono* + plural.",
  "table": {"head": ["Forma", "Se usa con", "Ejemplo"],
            "rows": [["c'è", "singular", "C'è una lavagna."],
                     ["ci sono", "plural", "Ci sono tre sedie."],
                     ["non c'è", "negación, singular", "Non c'è il professore."],
                     ["non ci sono", "negación, plural", "Non ci sono studenti."]]},
  "ex": [["*C'è* un libro sul tavolo.", "Hay un libro sobre la mesa."],
         ["*Ci sono* due finestre.", "Hay dos ventanas."],
         ["*Non c'è* nessuno.", "No hay nadie."],
         ["*Ci sono* molte persone.", "Hay mucha gente."]],
  "warn": "No digas «ci sono molta gente»: *gente* es singular, entonces "
          "*c'è molta gente*."},
]},

3: {
"intro": "El artículo depende del género y del **sonido** con que empieza "
         "la palabra. Seis partes cortas: género, *lo* y plurales, *un/una*, "
         "dónde va, preposiciones y partitivo.",
# Seis sesiones cortas, cada una con su teoría en pasos y su práctica.
# «ids» pone cada ejercicio en la parte que lo enseña; «match» queda para
# lo que se agregue después.
"parts": [
 {"h": "Género y el, la: il, la, l'", "blocks": [0, 1, 2],
  "ids": ["d03-031", "d03-032", "d03-055"] + ["ar-g-%02d" % n for n in range(1, 17)],
  "match": r"^(?!)"},
 {"h": "lo, gli y el plural", "blocks": [3, 4, 5],
  "ids": ["d03-033", "d03-034", "d03-035", "d03-036", "d03-037", "d03-039", "d03-040",
          "d03-051", "d03-052", "d03-053", "d03-054", "b2-prep-05", "b2-prep-06",
          "g2-gd-37", "g2-sc-05", "g2-sc-05-a", "g2-sc-05-b", "g2-sc-05-c",
          "g2-va-21", "g2-va-44", "g2-va-45", "s:r02-01:a", "s:r02-02:b", "s:r02-02:c"],
  "match": r"determinado \(il|artículo correcto|^(il|lo|la|l'|l’|i|gli|le)$"},
 {"h": "Indeterminados: un, uno, una, un'", "blocks": [6],
  "match": r"indeterminado|^(un|uno|una|un'|un’)$"},
 {"h": "Dónde va el artículo (y dónde no)", "blocks": [7, 8, 9],
  "ids": ["s:r02-02:a", "b2-prep-07"] + ["ar-u-%02d" % n for n in range(1, 15)],
  "match": r"posesiv|artículo donde"},
 {"h": "Preposiciones articuladas", "blocks": [10, 11],
  "match": r"preposición articulada|«in» y «di»|«di» con el|artículo o la preposición|«di» o «di» \+|donde corresponda"},
 {"h": "Partitivo y cantidades", "blocks": [12, 13],
  "match": r"partitivo|reformul|alcun|qualche|nessun"},
],
"blocks": [
 # ---------------------------------------------------------------- parte 1
 {"h": "Masculino o femenino: mirá cómo termina",
  "r": "Casi siempre: **-o** masculino, **-a** femenino. En **-e** puede ser "
       "cualquiera de los dos: cada palabra se aprende con su artículo.",
  "table": {"head": ["Termina en", "Género", "Ejemplo"],
            "rows": [["-o", "masc.", "il libro, il vino"],
                     ["-a", "fem.", "la casa, la pizza"],
                     ["-e", "los dos", "il pane, la chiave"],
                     ["-tà, -ione", "fem.", "la città, la stazione"],
                     ["consonante", "masc.", "il bar, il film"]]},
  "ex": [["il vin*o*", "el vino"],
         ["la pizz*a*", "la pizza"],
         ["*il* pane / *la* chiave", "el pan / la llave"]],
  "warn": "Distinto del castellano: *il latte* (la leche), *il fiore* (la "
          "flor), *il sale* (la sal). Y *la mano*, *la foto*, *la radio* son "
          "femeninos aunque terminen en -o.",
  "qq": [{"prompt": "¿Qué artículo lleva «latte» (la leche)?", "answer": "il", "options": ["il", "la", "le"]},
         {"prompt": "¿Masculino o femenino? «stazione»", "answer": "femenino", "options": ["femenino", "masculino", "los dos"]},
         {"prompt": "¿Qué artículo lleva «mano»?", "answer": "la", "options": ["la", "il", "le"]}]},

 {"h": "il y la: delante de consonante",
  "r": "Delante de consonante: *il* para el masculino, *la* para el "
       "femenino. Es el caso más común.",
  "ex": [["*il* libro", "el libro"],
         ["*il* ragazzo", "el chico"],
         ["*la* casa", "la casa"],
         ["*la* ragazza", "la chica"],
         ["*il* pane e *la* pasta", "el pan y la pasta"]],
  "tip": "Nunca aprendas un sustantivo solo: *il pane*, *la chiave*. El "
         "artículo es la única pista segura del género.",
  "qq": [{"prompt": "Elegí el artículo", "stem": "___ pane", "answer": "il", "options": ["il", "la", "l'"]},
         {"prompt": "Elegí el artículo", "stem": "___ chiave (la llave)", "answer": "la", "options": ["la", "il", "l'"]}]},

 {"h": "l': delante de vocal, para los dos géneros",
  "r": "Delante de vocal, *il* y *la* pierden la vocal y quedan en *l'*: "
       "*l'amico*, *l'amica*. La *h* no suena: *l'hotel*.",
  "ex": [["*l'*amico", "el amigo"],
         ["*l'*amica", "la amiga"],
         ["*l'*acqua", "el agua"],
         ["*l'*ora", "la hora"],
         ["*l'*hotel", "el hotel"]],
  "warn": "*l'* no dice el género: *l'amico*, *l'amica*. Y ojo: en castellano "
          "«el agua», pero *l'acqua* es femenino (*l'acqua fresca*).",
  "qq": [{"prompt": "Elegí el artículo", "stem": "___ amica", "answer": "l'", "options": ["l'", "la", "il"]},
         {"prompt": "Elegí el artículo", "stem": "___ ora (la hora)", "answer": "l'", "options": ["l'", "la", "il"]}]},

 # ---------------------------------------------------------------- parte 2
 {"h": "lo: para los comienzos difíciles",
  "r": "Masculino delante de **s + consonante** (*s impura*), **z**, **gn**, "
       "**ps**, **x** o **y**: *lo* en vez de *il*.",
  "ex": [["*lo* studente", "el estudiante"],
         ["*lo* sport", "el deporte"],
         ["*lo* zio", "el tío"],
         ["*lo* zaino", "la mochila"],
         ["*lo* psicologo", "el psicólogo"]],
  "warn": "*s* + vocal no es s impura: *il sale*, *il sole*. Solo cuenta la "
          "*s* seguida de consonante.",
  "tip": "El castellano dice «estudiante», con una *e* de apoyo. El italiano "
         "no la pone en la palabra: la pone en el artículo, *lo studente*.",
  "qq": [{"prompt": "Elegí el artículo", "stem": "___ zucchero", "answer": "lo", "options": ["lo", "il", "la"]},
         {"prompt": "Elegí el artículo", "stem": "___ sole (el sol)", "answer": "il", "options": ["il", "lo", "l'"]},
         {"prompt": "Elegí el artículo", "stem": "___ specchio (el espejo)", "answer": "lo", "options": ["lo", "il", "la"]}]},

 {"h": "El plural: i, gli, le",
  "r": "*il* → *i*. *lo* y *l'* masculino → *gli*. *la* y *l'* femenino → "
       "*le*. El sonido manda igual que en singular.",
  "table": {"head": ["Singular", "Plural", "Ejemplo"],
            "rows": [["il", "i", "il libro → i libri"],
                     ["lo", "gli", "lo zio → gli zii"],
                     ["l' (masc.)", "gli", "l'amico → gli amici"],
                     ["la", "le", "la casa → le case"],
                     ["l' (fem.)", "le", "l'amica → le amiche"]]},
  "ex": [["*i* ragazzi", "los chicos"],
         ["*gli* studenti", "los estudiantes"],
         ["*gli* amici", "los amigos"],
         ["*le* amiche", "las amigas"]],
  "warn": "*gli* y *le* no se apostrofan: *gli amici*, *le amiche*. Y *i "
          "amici* no existe: delante de vocal, siempre *gli*.",
  "qq": [{"prompt": "Plural de «lo zaino»", "answer": "gli zaini", "options": ["gli zaini", "i zaini", "le zaini"]},
         {"prompt": "Plural de «l'amica»", "answer": "le amiche", "options": ["le amiche", "gli amiche", "l'amiche"]},
         {"prompt": "Plural de «l'errore» (el error)", "answer": "gli errori", "options": ["gli errori", "i errori", "le errori"]}]},

 {"h": "Palabras que no cambian: el artículo dice el número",
  "r": "Vocal con tilde (*città*), palabras extranjeras (*film*) y "
       "acortadas (*foto*) no cambian en plural: cambia solo el artículo.",
  "table": {"head": ["Singular", "Plural", "Ejemplo"],
            "rows": [["la città", "le città", "las ciudades"],
                     ["il caffè", "i caffè", "los cafés"],
                     ["il film", "i film", "las películas"],
                     ["lo sport", "gli sport", "los deportes"],
                     ["la foto", "le foto", "las fotos"]]},
  "ex": [["*le* città", "las ciudades"],
         ["*i* film", "las películas"],
         ["*le* foto", "las fotos"]],
  "tip": "*la gente* es singular, como en castellano: *la gente è "
         "simpatica*.",
  "qq": [{"prompt": "Traducí: «las ciudades»", "answer": "le città", "options": ["le città", "le cittàs", "i città"]},
         {"prompt": "Traducí: «las películas»", "answer": "i film", "options": ["i film", "le film", "i films"]}]},

 # ---------------------------------------------------------------- parte 3
 {"h": "un, uno, una: la misma lógica",
  "r": "El indeterminado copia al determinado: *il* → *un*, *lo* → *uno*, "
       "*la* → *una*, *l'* femenino → *un'*.",
  "table": {"head": ["el / la", "un / una", "Ejemplo"],
            "rows": [["il", "un", "un libro"],
                     ["l' (masc.)", "un", "un amico"],
                     ["lo", "uno", "uno studente"],
                     ["la", "una", "una casa"],
                     ["l' (fem.)", "un'", "un'amica"]]},
  "ex": [["*un* libro", "un libro"],
         ["*uno* studente", "un estudiante"],
         ["*una* casa", "una casa"],
         ["*un'*amica", "una amiga"],
         ["*un* amico", "un amigo"]],
  "warn": "*un'* existe solo en femenino: *un'amica*, *un'idea*. El masculino "
          "nunca lleva apóstrofo: *un amico*, *un errore*. Pregunta clásica de examen.",
  "tip": "En plural no hay indeterminado: «unos amigos» es *degli amici* o "
         "simplemente *amici*. Lo ves en la última parte.",
  "qq": [{"prompt": "Elegí el artículo", "stem": "___ zaino", "answer": "uno", "options": ["uno", "un", "una"]},
         {"prompt": "Elegí el artículo", "stem": "___ entrata (la entrada)", "answer": "un'", "options": ["un'", "un", "uno"]},
         {"prompt": "Elegí el artículo", "stem": "___ errore (el error)", "answer": "un", "options": ["un", "un'", "uno"]}]},

 # ---------------------------------------------------------------- parte 4
 {"h": "Posesivos: con artículo",
  "r": "Lleva artículo y concuerda con lo poseído: *la sua casa*, *i suoi "
       "amici*. Sin artículo: parientes en singular, *mio padre*.",
  "table": {"head": ["", "m. sg.", "f. sg.", "m. pl.", "f. pl."],
            "rows": [["mi", "il mio", "la mia", "i miei", "le mie"],
                     ["tu (de vos)", "il tuo", "la tua", "i tuoi", "le tue"],
                     ["su (de él, de ella, de usted)", "il suo", "la sua", "i suoi", "le sue"],
                     ["nuestro", "il nostro", "la nostra", "i nostri", "le nostre"],
                     ["su (de ustedes)", "il vostro", "la vostra", "i vostri", "le vostre"],
                     ["su (de ellos, de ellas)", "il loro", "la loro", "i loro", "le loro"]]},
  "ex": [["*la sua* macchina", "su auto (de él o de ella: manda *macchina*)"],
         ["*i suoi* libri", "sus libros"],
         ["*le nostre* amiche", "nuestras amigas"],
         ["*mio* padre", "mi padre"],
         ["*i miei* fratelli", "mis hermanos"]],
  "warn": "Con parientes el artículo vuelve en plural (*i miei fratelli*), "
          "con adjetivo (*la mia cara madre*) y siempre con *loro* (*il loro "
          "padre*).",
  "tip": "Si se entiende de quién es, alcanza el artículo: *arriva con la "
         "moglie*, llega con su mujer.",
  "qq": [{"prompt": "Traducí: «mi libro»", "answer": "il mio libro", "options": ["il mio libro", "mio libro", "la mia libro"]},
         {"prompt": "Traducí: «mi madre»", "answer": "mia madre", "options": ["mia madre", "la mia madre", "mia la madre"]},
         {"prompt": "Traducí: «mis hermanos»", "answer": "i miei fratelli", "options": ["i miei fratelli", "miei fratelli", "il mio fratelli"]},
         {"prompt": "Traducí: «sus libros» (de ella)", "answer": "i suoi libri", "options": ["i suoi libri", "le sue libri", "i sui libri"]},
         {"prompt": "Traducí: «nuestra casa»", "answer": "la nostra casa", "options": ["la nostra casa", "il nostro casa", "nostra casa"]},
         {"prompt": "Traducí: «tus amigas»", "answer": "le tue amiche", "options": ["le tue amiche", "le tuoi amiche", "i tuoi amiche"]}]},

 {"h": "Países sí, ciudades no",
  "r": "Países, regiones y continentes llevan artículo: *l'Italia*, *la "
       "Toscana*, *l'Europa*, *gli Stati Uniti*. Las ciudades no: *Roma*, "
       "*Milano*.",
  "ex": [["*L'*Italia è bella.", "Italia es linda."],
         ["*La* Sicilia è un'isola.", "Sicilia es una isla."],
         ["*Roma* è bella.", "Roma es linda."],
         ["*Il* Canada è grande.", "Canadá es grande."],
         ["*Le* Filippine sono in Asia.", "Filipinas está en Asia."]],
  "warn": "Muchas islas van sin artículo: *Malta*, *Cuba*, *Capri*. Otras "
          "lo llevan: *la Sicilia*, *la Sardegna*. Se memorizan.",
  "qq": [{"prompt": "Completá", "stem": "___ Francia è grande.", "answer": "La", "options": ["La", "(nada)", "Il"]},
         {"prompt": "Completá", "stem": "___ Milano è in Lombardia.", "answer": "(nada)", "options": ["(nada)", "Il", "La"]}]},

 {"h": "Lo general, los idiomas, los días",
  "r": "Llevan artículo lo general (*la musica*), los idiomas "
       "(*l'italiano*), los días que se repiten (*il lunedì*) y los años.",
  "ex": [["Mi piace *la* musica classica.", "Me gusta la música clásica."],
         ["Studio *l'*italiano.", "Estudio italiano."],
         ["*Il* sabato lavoro.", "Los sábados trabajo."],
         ["*Il* vino italiano è buono.", "El vino italiano es bueno."]],
  "tip": "*il sabato* = todos los sábados; *sabato*, sin artículo = este "
         "sábado.",
  "qq": [{"prompt": "Traducí: «Me gusta el café»", "answer": "Mi piace il caffè", "options": ["Mi piace il caffè", "Mi piace caffè", "Mi piace lo caffè"]},
         {"prompt": "¿Qué significa «Il sabato lavoro»?", "answer": "Los sábados trabajo.", "options": ["Los sábados trabajo.", "Este sábado trabajo.", "El sábado pasado trabajé."]}]},

 # ---------------------------------------------------------------- parte 5
 {"h": "Preposición + artículo = una sola palabra",
  "r": "*di, a, da, in, su* + artículo **se funden**: *di + il = del*, *in "
       "+ la = nella*.",
  "table": {"head": ["", "il", "lo", "l'", "i", "gli", "la", "le"],
            "rows": [["di (de)", "del", "dello", "dell'", "dei", "degli", "della", "delle"],
                     ["a (a)", "al", "allo", "all'", "ai", "agli", "alla", "alle"],
                     ["da (desde, de, en lo de)", "dal", "dallo", "dall'", "dai", "dagli", "dalla", "dalle"],
                     ["in (en)", "nel", "nello", "nell'", "nei", "negli", "nella", "nelle"],
                     ["su (sobre, en)", "sul", "sullo", "sull'", "sui", "sugli", "sulla", "sulle"]]},
  "ex": [["il libro *del* professore", "el libro del profesor (di: de)"],
         ["una lettera *agli* amici", "una carta a los amigos (a: a)"],
         ["il treno *dalla* stazione", "el tren desde la estación (da: desde)"],
         ["*nella* borsa", "en la cartera (in: en)"],
         ["*sul* tavolo", "sobre la mesa (su: sobre)"]],
  "tip": "*con* y *per* no se funden en el italiano de hoy: *con il treno*, "
         "*per la mamma*.",
  "more": ["Para armarla sin mirar la tabla: elegí el artículo (*lo studio*); "
           "*di* pasa a *de-*, *in* a *ne-*; pegalos y doblá la *l*: *nello "
           "studio*, *della macchina*, *dei miei figli*, *all'amico*. *da* es "
           "«desde», «de» y también «en lo de»: *dal medico*, *dai nonni*."],
  "qq": [{"prompt": "in + lo studio", "answer": "nello studio", "options": ["nello studio", "nel studio", "in lo studio"]},
         {"prompt": "di + i miei figli", "answer": "dei miei figli", "options": ["dei miei figli", "di i miei figli", "degli miei figli"]},
         {"prompt": "a + l'amico", "answer": "all'amico", "options": ["all'amico", "al amico", "a l'amico"]}]},

 {"h": "Sin artículo, no hay fusión",
  "r": "Si la palabra va sin artículo, la preposición queda sola: *di "
       "Marco*, *a Roma*, *in Italia*, *la ragazza di mio figlio*.",
  "ex": [["Abito *in* Italia.", "Vivo en Italia."],
         ["*nell'*Italia del sud", "en el sur de Italia"],
         ["la capitale *dell'*Italia", "la capital de Italia"],
         ["la capitale *di* Malta", "la capital de Malta"],
         ["*negli* Stati Uniti", "en Estados Unidos"]],
  "warn": "Con *in*, países y regiones femeninos van sin artículo (*in "
          "Toscana*), salvo si llevan algo más (*nell'Italia del sud*). Los "
          "plurales lo conservan: *negli Stati Uniti*.",
  "more": ["Los masculinos dudan: se dice *in Piemonte* y también *nel "
           "Lazio*. Con *di*, en cambio, el artículo vuelve siempre: *il "
           "capoluogo del Piemonte*, *la capitale della Francia*. Los "
           "apellidos de familias nobles van sin artículo: *Carlo Alberto di "
           "Savoia*.",
           "*di* sola, delante de vocal, puede apostrofarse: *d'*. Es común en "
           "frases hechas: *l'isola d'Elba*, *un po' d'acqua*, *d'inverno* (en "
           "invierno), *un anello d'oro* (un anillo de oro)."],
  "qq": [{"prompt": "Completá", "stem": "Lavoro ___ Francia.", "answer": "in", "options": ["in", "nella", "alla"]},
         {"prompt": "Completá", "stem": "La capitale ___ Italia è Roma.", "answer": "dell'", "options": ["dell'", "di", "della"]},
         {"prompt": "Completá", "stem": "La capitale ___ Cuba è L'Avana.", "answer": "di", "options": ["di", "della", "del"]}]},

 # ---------------------------------------------------------------- parte 6
 {"h": "El partitivo: «algo de», «unos»",
  "r": "*di* + artículo (*del, della, dei*…) = una cantidad sin precisar. "
       "El castellano no pone nada, o «unos».",
  "ex": [["Compro *del* pane.", "Compro pan."],
         ["C'è *dell'*acqua in frigo.", "Hay agua en la heladera."],
         ["Ho *degli* amici a Roma.", "Tengo (unos) amigos en Roma."],
         ["Compro *delle* camicie.", "Compro (unas) camisas."],
         ["Mi serve *dello* sciroppo.", "Necesito jarabe."]],
  "warn": "El número lo pone el sustantivo: singular con lo que no se cuenta (*dell'olio*, *del pane*), plural con lo que se cuenta (*degli amici*). «degli olio» no existe.",
  "tip": "La forma sale del artículo de la palabra: *lo sciroppo* → *dello "
         "sciroppo*; *l'acqua* → *dell'acqua*.",
  "more": ["Si el verbo ya trae *di* (*ho bisogno di*, necesito), no se suma el "
           "partitivo: *ho bisogno di pane*, *ho bisogno di un'aspirina*. "
           "Nunca «di del pane».",
           "En negativo el partitivo desaparece: *non ho fratelli*, *non "
           "abbiamo burro*. Para insistir, *nessun* + singular, que copia al "
           "indeterminado: *non ho nessun problema*, *nessuno studente*, "
           "*nessuna idea*. *neanche* vuelve con las demás negaciones en la "
           "semana 18."],
  "qq": [{"prompt": "Completá", "stem": "Avete ___ pasta fresca?", "answer": "della", "options": ["della", "del", "delle"]},
         {"prompt": "Completá", "stem": "Compro ___ olio.", "answer": "dell'", "options": ["dell'", "del", "degli"]},
         {"prompt": "Completá", "stem": "Non ho ___ fratelli.", "answer": "(nada)", "options": ["(nada)", "dei", "nessuni"]},
         {"prompt": "Completá", "stem": "Non c'è ___ lenzuolo.", "answer": "nessun", "options": ["nessun", "nessuno", "nessuna"]}]},

 {"h": "Otras maneras: un po' di, qualche, alcuni",
  "r": "*un po' di* + lo que no se cuenta; *qualche* + **singular**; "
       "*alcuni / alcune* + plural.",
  "ex": [["*un po' di* zucchero", "un poco de azúcar"],
         ["*un po' d'*acqua", "un poco de agua"],
         ["*qualche* amico", "algunos amigos"],
         ["*alcune* lettere", "algunas cartas"],
         ["*alcuni* articoli", "algunos artículos"]],
  "warn": "*qualche* va siempre con singular aunque signifique «algunos»: "
          "*qualche giorno*, nunca *qualche giorni*.",
  "qq": [{"prompt": "«algunos días», con qualche", "answer": "qualche giorno", "options": ["qualche giorno", "qualche giorni", "qualcuni giorni"]},
         {"prompt": "Completá", "stem": "Ho ___ lettere da scrivere.", "answer": "alcune", "options": ["alcune", "alcuni", "qualche"]}]},
]},

4: {
"intro": "El adjetivo concuerda como en castellano. Lo nuevo: su posición, "
         "que puede cambiar el sentido, y algunos adjetivos que se deforman "
         "delante del sustantivo.",
"blocks": [
 {"h": "Dos clases y nada más",
  "r": "Los adjetivos en *-o* tienen **4 formas**; los en *-e*, **2**. Con "
       "géneros mezclados gana el masculino plural.",
  "table": {"head": ["Clase", "m.sg", "f.sg", "m.pl", "f.pl", "Ejemplo"],
            "rows": [["en -o (4 formas)", "-o", "-a", "-i", "-e", "alto, alta, alti, alte"],
                     ["en -e (2 formas)", "-e", "-e", "-i", "-i", "grande, grande, grandi, grandi"]]},
  "ex": [["Il libro è nuov*o*. La casa è nuov*a*.", "El libro es nuevo. La casa es nueva."],
         ["Le case sono nuov*e*.", "Las casas son nuevas."],
         ["Il treno è grand*e*. La casa è grand*e*.", "El tren es grande. La casa es grande."],
         ["Marco e Anna sono italian*i*.", "Marco y Ana son italianos."]],
  "warn": "En *-co / -go* valen las reglas de *h* de la semana 2: femenino "
          "plural siempre *-che, -ghe* (*simpatiche, lunghe*); masculino "
          "*simpatici* (esdrújula) pero *lunghi, antichi* (llanas).",
  "tip": "Colores que vienen de sustantivos no cambian: *blu, rosa, viola, "
         "beige* (*le borse blu*). *arancione* admite plural *arancioni*."},

 {"h": "Delante o detrás: cambia el sentido",
  "r": "El adjetivo va **detrás**. Algunos frecuentes (*bello, buono, "
       "grande, vecchio, nuovo, povero*) van delante, y a veces cambian de "
       "sentido.",
  "ex": [["un uomo *grande* / un *grand'*uomo", "un hombre corpulento / un gran hombre"],
         ["un amico *vecchio* / un *vecchio* amico", "un amigo viejo / un amigo de hace años"],
         ["una casa *nuova* / una *nuova* casa", "una casa recién hecha / otra casa, la nueva"],
         ["un uomo *povero* / un *povero* uomo", "un hombre pobre / un pobre hombre"]],
  "warn": "Colores, nacionalidades y formas van siempre detrás: *una "
          "macchina rossa*, *un vino italiano*, nunca «una rossa macchina»."},

 {"h": "bello y quello copian al artículo",
  "r": "Delante del sustantivo, *bello* y *quello* cambian como el "
       "artículo: *il* → *bel*, *quel*; *lo* → *bello*, *quello*.",
  "table": {"head": ["Artículo", "bello (lindo)", "quello (ese, aquel)", "Ejemplo"],
            "rows": [["il", "bel", "quel", "quel bel libro"],
                     ["lo", "bello", "quello", "quello studente"],
                     ["l'", "bell'", "quell'", "quell'albergo, un bell'albergo"],
                     ["i", "bei", "quei", "quei bei quadri"],
                     ["gli", "begli", "quegli", "quegli studenti, quei begli occhi"],
                     ["la / le", "bella / belle", "quella / quelle", "quella bella casa"]]},
  "ex": [["*quel* libro", "ese libro"],
         ["*quello* studente", "ese estudiante"],
         ["*quegli* amici", "esos amigos"],
         ["Che *bel* film!", "¡Qué linda película!"]],
  "warn": "Nada de «quello libro» ni «quelli amici»: delante del sustantivo "
          "vale la forma del artículo, *quel libro*, *quegli amici*.",
  "tip": "*Che bel film!* (delante) frente a *Questo film è bello* (detrás, "
         "forma plena)."},

 {"h": "questo: este, esta, estos, estas",
  "r": "*questo* es «este» y concuerda como un adjetivo en *-o*: *questa*, "
       "*questi*, *queste*. Ante vocal, *quest'anno*.",
  "table": {"head": ["", "singular", "plural"],
            "rows": [["masculino", "questo libro", "questi libri"],
                     ["femenino", "questa casa", "queste case"],
                     ["delante de vocal", "quest'anno, quest'amica", "questi anni, queste amiche"]]},
  "ex": [["*Questa* casa è bella.", "Esta casa es linda."],
         ["*Questi* ragazzi sono di Roma.", "Estos chicos son de Roma."],
         ["*Queste* scarpe sono nuove.", "Estos zapatos son nuevos."],
         ["*quest'*anno", "este año"]],
  "warn": "No existe «esto» aparte: *questo* sirve para las dos cosas (*Questo "
          "è il mio libro*). Y el plural masculino es *questi*, nunca «questos».",
  "qq": [{"prompt": "Traducí: «estas casas»", "answer": "queste case", "options": ["queste case", "questi case", "questas case"]},
         {"prompt": "Traducí: «estos libros»", "answer": "questi libri", "options": ["questi libri", "questos libri", "queste libri"]}]},

 {"h": "buono, grande, santo se acortan",
  "r": "*buono* delante copia a *un / uno / una / un'*. *grande* → *gran*, "
       "*grand'*. *santo* → *san*, *sant'*.",
  "ex": [["un *buon* amico, un *buono* studente", "un buen amigo, un buen estudiante"],
         ["una *buona* idea, una *buon'*amica", "una buena idea, una buena amiga"],
         ["un *gran* successo", "un gran éxito"],
         ["*San* Marco, *Sant'*Antonio", "San Marcos, San Antonio"]],
  "warn": "El castellano apocopa *buen* y *san* solo en masculino. El "
          "italiano también tiene *buon'amica* en femenino.",
  "tip": "Delante de *s* + consonante vuelve la forma plena: *un buono "
         "studente*, *Santo Stefano*.",
  "more": ["El recorte es solo en singular y delante del sustantivo. En "
           "plural son regulares: *buoni amici*, *grandi città*, *i Santi "
           "Apostoli*. Detrás del sustantivo o del verbo, siempre la forma "
           "plena: *è buono*, *un uomo grande*."]},

 {"h": "Plurales en -co, -ca, -go, -ga",
  "r": "*-ca, -ga* hacen *-che, -ghe*. *-co, -go* hacen *-chi, -ghi*; "
       "los esdrújulos en *-co* hacen *-ci*.",
  "table": {"head": ["Singular", "Plural", "Por qué"],
            "rows": [["bianco / bianca", "bianchi / bianche", "la h conserva el sonido duro"],
                     ["lungo / lunga", "lunghi / lunghe", "igual con la g"],
                     ["stanco / stanca", "stanchi / stanche", "palabra llana: h"],
                     ["simpatico", "simpatici", "esdrújula: -ci"],
                     ["simpatica", "simpatiche", "el femenino siempre lleva h"]]},
  "ex": [["Le strade sono *lunghe*.", "Las calles son largas."],
         ["Marco e Luca sono *stanchi*.", "Marco y Luca están cansados."],
         ["Sono *simpatici* e *ricchi*.", "Son simpáticos y ricos."],
         ["Le case *bianche* sono nuove.", "Las casas blancas son nuevas."]],
  "warn": "Sin h no hay sonido duro: «simpatichi» y «bianci» están mal. "
          "Sustantivos que rompen la regla: *amico → amici*, *nemico → nemici*, "
          "*greco → greci*."},

 {"h": "molto, y avere para edad y sensaciones",
  "r": "Ante un adjetivo, *molto* significa «muy» y **no cambia**. Ante un "
       "sustantivo es «mucho» y **concuerda**.",
  "table": {"head": ["Ante...", "Ejemplo", "¿Cambia?"],
            "rows": [["adjetivo", "Anna è molto stanca.", "no: molto"],
                     ["sustantivo", "Ho molti amici. Ho molta fame.", "sí: molto, molta, molti, molte"],
                     ["poco, igual", "Sono poco simpatici. Ho poche amiche.", "igual que molto"]]},
  "ex": [["Le case sono *molto* grandi.", "Las casas son muy grandes."],
         ["Ho *molte* amiche a Roma.", "Tengo muchas amigas en Roma."],
         ["Ho *molta* fame e *molto* sonno.", "Tengo mucha hambre y mucho sueño."],
         ["*Ho* trent'anni.", "Tengo treinta años."]],
  "warn": "Edad y sensaciones van con *avere*: *ho vent'anni*, *ho freddo*, "
          "*ha caldo*, *abbiamo fame*. «Sono freddo» dice que sos frío de carácter.",
  "tip": "El error típico es «sono molti stanchi»: ante adjetivo, *molto* "
         "queda igual.",
  "qq": [{"prompt": "Completá", "stem": "Le ragazze sono ___ simpatiche.", "answer": "molto", "options": ["molto", "molte", "molti"]},
         {"prompt": "Completá", "stem": "Ho ___ amiche a Roma.", "answer": "molte", "options": ["molte", "molto", "molti"]}]},


 {"h": "Nacionalidades y profesiones",
  "r": "Con *essere*, la nacionalidad y el oficio van en minúscula y **sin "
       "artículo**: *Sono argentina. Lucia è insegnante.*",
  "table": {"head": ["Terminación", "m.sg", "f.sg", "m.pl / f.pl"],
            "rows": [["-ano", "messicano", "messicana", "messicani / messicane"],
                     ["-ino", "argentino", "argentina", "argentini / argentine"],
                     ["-ese (una forma)", "francese", "francese", "francesi / francesi"],
                     ["otras en -o", "spagnolo, tedesco", "spagnola, tedesca", "spagnoli, tedeschi / spagnole, tedesche"]]},
  "ex": [["Sono *argentina*, di Rosario.", "Soy argentina, de Rosario."],
         ["Marco è *francese*, Anna è *inglese*.", "Marco es francés, Anna es inglesa."],
         ["Lui è *studente*, lei è *studentessa*.", "Él es estudiante, ella es estudiante."],
         ["Sara è *cuoca*. Luca è *dentista*.", "Sara es cocinera. Luca es dentista."]],
  "warn": "Los oficios cambian por grupos: *cuoco / cuoca*, *studente / "
          "studentessa*, y otros no cambian: *insegnante, dentista*. Si sumás "
          "un adjetivo, vuelve el artículo: *Luca è un bravo dentista*."},
]},

5: {
"intro": "El presente sostiene casi todo lo que vas a decir los primeros "
         "meses. Las tres conjugaciones se parecen al castellano, pero el "
         "acento y algunas grafías cambian.",
"parts": [
 {"h": "Las tres conjugaciones y los verbos en -isc-", "blocks": [0, 1],
  "match": r"en presente\. |-isc-|reflexivos"},
 {"h": "Ortografía de la raíz, sujeto omitido y Lei", "blocks": [2, 3],
  "match": r"ortografía|Escribilo bien|Lei|perché|Desde cuándo|Traducí"},
],
"blocks": [
 {"h": "Las tres conjugaciones",
  "r": "*tu* termina **siempre en -i** y *noi* **siempre en -iamo**, en las "
       "tres conjugaciones.",
  "table": {"head": ["", "-are (parlare)", "-ere (vendere)", "-ire (dormire)", "-ire -isc (finire)"],
            "rows": [["io", "parlo", "vendo", "dormo", "finisco"],
                     ["tu", "parli", "vendi", "dormi", "finisci"],
                     ["lui/lei", "parla", "vende", "dorme", "finisce"],
                     ["noi", "parliamo", "vendiamo", "dormiamo", "finiamo"],
                     ["voi", "parlate", "vendete", "dormite", "finite"],
                     ["loro", "parlano", "vendono", "dormono", "finiscono"]]},
  "ex": [["Parl*i* italiano?", "¿Hablás italiano?"],
         ["Legg*i* molto.", "Leés mucho."],
         ["Dorm*iamo* poco.", "Dormimos poco."],
         ["Parl*ano* inglese.", "Hablan inglés."]],
  "warn": "*loro* se acentúa en la raíz: *PAR-lano*, *VEN-dono*, *A-bitano*, "
          "*te-LE-fonano*. Decir «parLAno» te delata enseguida.",
  "more": ["Los reflexivos (*alzarsi*, levantarse) se conjugan igual, con *mi, "
           "ti, si, ci, vi, si* delante, como en castellano: *mi alzo*, *si "
           "perdono* (se pierden). Los ves a fondo en la semana 12.",
           "Verbos de todos los días con frases hechas: *prendere un caffè* "
           "(tomar), *prendere il sole* (tomar sol), *prendere appunti*, "
           "*prendere in giro* (cargar a alguien); *mettere in ordine* "
           "(ordenar), *mettere da parte* (ahorrar); *portare fortuna* (traer "
           "suerte), *portare pazienza* (tener paciencia)."]},

 {"h": "Los verbos en -isc-",
  "r": "Muchos verbos en *-ire* meten **-isc-** en todas las personas menos "
       "*noi* y *voi*. No hay regla: se aprenden con la palabra.",
  "ex": [["Non cap*isco*.", "No entiendo."],
         ["Cap*iamo* tutto.", "Entendemos todo."],
         ["Prefer*isco* il tè.", "Prefiero el té."],
         ["Fin*iscono* alle sei.", "Terminan a las seis."]],
  "tip": "Los más usados: *finire, capire, preferire, pulire, spedire, "
         "costruire, unire, guarire, colpire, restituire*."},

 {"h": "Grafías que cambian la raíz",
  "r": "La escritura sigue al **sonido**: *cercare → cerchi* (conserva la "
       "k); *mangiare → mangi* (la *i* sobra).",
  "table": {"head": ["Infinitivo", "Qué pasa", "tu", "noi"],
            "rows": [["cercare, pagare", "se agrega h: sonido duro", "cerchi, paghi", "cerchiamo, paghiamo"],
                     ["cominciare, mangiare", "cae la i de la raíz", "cominci, mangi", "cominciamo, mangiamo"],
                     ["studiare (i átona)", "se funden las dos i", "studi", "studiamo"],
                     ["sciare (i tónica)", "se conservan las dos", "scii", "sciamo"]]},
  "ex": [["Cosa cer*chi*?", "¿Qué buscás?"],
         ["Pa*ghi* tu?", "¿Pagás vos?"],
         ["Man*gi* la pizza?", "¿Comés pizza?"],
         ["Stud*i* molto.", "Estudiás mucho."]],
  "warn": "Sin la *h*, «cerci» se leería «cherchi». Y nunca «mangii» ni "
          "«studii»: una sola *i*."},

 {"h": "El sujeto se omite; Lei para usted",
  "r": "La terminación ya dice quién habla: *io, tu, lui* solo para "
       "enfatizar. El trato formal es **Lei** + tercera persona singular.",
  "ex": [["Parl*o* italiano.", "Hablo italiano."],
         ["*Io* lavoro, *tu* no.", "Yo trabajo, vos no."],
         ["*Lei* parla italiano?", "¿Usted habla italiano?"],
         ["Signora, *Lei è* di Roma?", "Señora, ¿usted es de Roma?"]],
  "warn": "Con *Lei* el verbo va en tercera: *Lei è*, nunca «Lei sei». Y "
          "sirve para hombres y mujeres: *Signor Rossi, Lei è di qui?*",
  "tip": "Algo que empezó y sigue: presente + *da*. *Abito qui da due anni* "
         "(vivo acá desde hace dos años). Lo ves a fondo en la semana 9.",
  "more": ["Para unir frases: *e* (y; *ed* delante de vocal, sobre todo de "
           "*e*: *io ed Emilio*), *ma* (pero), *o* (o) y *perché* (porque): "
           "*Cominciano ma non finiscono*, *Dormono perché sono stanchi*."]},
]},

6: {
"intro": "Unos quince irregulares cubren media conversación. Y una "
         "diferencia grande con el castellano: el italiano casi nunca "
         "diptonga.",
"parts": [
 {"h": "Los pilares, los modales y siete irregulares más", "blocks": [0, 1, 2, 6],
  "match": r"andare, d|de fare|modales|infinitivo|pregunta y la respuesta|de avere|tenere|salire",
  "ids": ["mj-06-14"]},
 {"h": "No diptonga, essere o stare, stare + gerundio", "blocks": [3, 4, 5],
  "match": r"stare|gerundio|essere|diptong",
  "ids": ["mj-06-%02d" % n for n in range(1, 14)]},
],
"blocks": [
 {"h": "Los cuatro pilares",
  "r": "*essere, avere, andare, stare*: de memoria. La *h* de *ho, hai, ha, "
       "hanno* **no suena**; solo distingue en la escritura.",
  "table": {"head": ["", "essere", "avere", "andare", "stare"],
            "rows": [["io", "sono", "ho", "vado", "sto"],
                     ["tu", "sei", "hai", "vai", "stai"],
                     ["lui/lei", "è", "ha", "va", "sta"],
                     ["noi", "siamo", "abbiamo", "andiamo", "stiamo"],
                     ["voi", "siete", "avete", "andate", "state"],
                     ["loro", "sono", "hanno", "vanno", "stanno"]]},
  "ex": [["*Vado* a casa.", "Voy a casa."],
         ["Come *stai*?", "¿Cómo estás?"],
         ["*Hanno* due figli.", "Tienen dos hijos."],
         ["*Andiamo* al cinema?", "¿Vamos al cine?"]],
  "more": ["Frases hechas: *andare d'accordo* (llevarse bien), *andare di "
           "moda* (estar de moda), *andare a trovare* (visitar a alguien: "
           "*domenica andiamo a trovare i nonni*); *stare di casa* (vivir: "
           "*dove stai di casa?*), *stare zitto* (callarse), *stare attento* "
           "(tener cuidado)."]},

 {"h": "Modales, sapere y fare",
  "r": "*potere, volere, dovere* van seguidos de **infinitivo**: *posso "
       "venire*. *sapere* = saber; *fare* = hacer.",
  "table": {"head": ["", "potere", "volere", "dovere", "sapere", "fare"],
            "rows": [["io", "posso", "voglio", "devo", "so", "faccio"],
                     ["tu", "puoi", "vuoi", "devi", "sai", "fai"],
                     ["lui/lei", "può", "vuole", "deve", "sa", "fa"],
                     ["noi", "possiamo", "vogliamo", "dobbiamo", "sappiamo", "facciamo"],
                     ["voi", "potete", "volete", "dovete", "sapete", "fate"],
                     ["loro", "possono", "vogliono", "devono", "sanno", "fanno"]]},
  "ex": [["*Devo* lavorare.", "Tengo que trabajar."],
         ["*Vuoi* un caffè?", "¿Querés un café?"],
         ["*Posso* entrare?", "¿Puedo pasar?"],
         ["Cosa *fai* stasera?", "¿Qué hacés esta noche?"]],
  "warn": "«Tener que» es *dovere*: *devo andare*, nunca «ho che andare». Y "
          "el infinitivo va pegado, sin *di*: *devo partire*, no «devo di "
          "partire».",
  "tip": "El «que» que une frases es *che*: *so che hai ragione* (sé que "
         "tenés razón), *dice che arriva domani*.",
  "more": ["*fare* arma muchas frases hechas: *fare colazione* (desayunar), "
           "*fare la doccia* (ducharse), *fare la spesa* (hacer las compras), "
           "*fare una passeggiata* (dar un paseo), *fare la fila* (hacer "
           "cola), *fare il pieno* (llenar el tanque), *fare attenzione* "
           "(prestar atención), *fa freddo / caldo* (hace frío / calor)."]},

 {"h": "Seis irregulares más",
  "r": "*venire, uscire, dire, bere, dare, rimanere*. *venire* y *rimanere* "
       "meten una **g** en *io* y *loro*: *rimango / rimangono*.",
  "table": {"head": ["", "venire", "uscire", "dire", "bere", "dare", "rimanere"],
            "rows": [["io", "vengo", "esco", "dico", "bevo", "do", "rimango"],
                     ["tu", "vieni", "esci", "dici", "bevi", "dai", "rimani"],
                     ["lui/lei", "viene", "esce", "dice", "beve", "dà", "rimane"],
                     ["noi", "veniamo", "usciamo", "diciamo", "beviamo", "diamo", "rimaniamo"],
                     ["voi", "venite", "uscite", "dite", "bevete", "date", "rimanete"],
                     ["loro", "vengono", "escono", "dicono", "bevono", "danno", "rimangono"]]},
  "ex": [["*Vieni* con noi?", "¿Venís con nosotros?"],
         ["Stasera *esco* con Anna.", "Esta noche salgo con Ana."],
         ["Cosa *dici*?", "¿Qué decís?"],
         ["*Rimango* a casa.", "Me quedo en casa."]],
  "tip": "Si sabés la forma de *io*, casi siempre deducís la de *loro*: "
         "*esco → escono*, *dico → dicono*.",
  "more": ["Dos familias más: *proporre* (y *porre, comporre*): *propongo, "
           "proponi, propone, proponiamo, proponete, propongono*; *tradurre* "
           "(y *produrre, condurre*): raíz *traduc-*, *traduco, traduci… "
           "traducono*.",
           "Con *dare*: *dare un esame* (rendir un examen), *dare fastidio* "
           "(molestar), *dare un passaggio* (alcanzar a alguien en auto), "
           "*dare retta* (hacer caso), *dare un'occhiata* (echar un vistazo), "
           "*dare del tu / del Lei* (tutear / tratar de usted)."]},

 {"h": "El italiano no diptonga",
  "r": "Donde el castellano rompe la vocal (*puedo, duermo, pienso*), el "
       "italiano **la deja entera**: *posso, dormo, penso*.",
  "ex": [["Non *posso* venire.", "No puedo venir."],
         ["*Dormo* poco.", "Duermo poco."],
         ["*Penso* di sì.", "Pienso que sí."],
         ["Quanto *costa*?", "¿Cuánto cuesta?"]],
  "warn": "Excepciones pocas: *vieni, vuole, può*. En *gioco* la *i* es solo "
          "gráfica. Si tu instinto quiere diptongar, frenalo."},

 {"h": "essere o stare",
  "r": "*stare* = «estar» **de salud** y «quedarse». Estados, cualidades y "
       "ubicación van con *essere*.",
  "ex": [["Come *stai*?", "¿Cómo estás?"],
         ["Stasera *sto* a casa.", "Esta noche me quedo en casa."],
         ["*Sono* stanco.", "Estoy cansado."],
         ["*Sono* a Roma.", "Estoy en Roma."],
         ["La porta *è* aperta.", "La puerta está abierta."]],
  "warn": "El error típico es «sto stanco». Cansado, contento, en Roma: "
          "*sono*. *stare* queda para *stare bene / male*, quedarse y frases "
          "hechas como *stare attento*.",
  "more": ["Frases hechas con *essere*: *essere al verde* (estar sin un "
           "peso), *essere in gamba* (ser un capo), *essere in vena* (estar "
           "de humor), *essere d'accordo* (estar de acuerdo)."]},

 {"h": "stare + gerundio",
  "r": "*stare* + gerundio = acción **en curso ahora mismo**. Gerundio: "
       "*-are → -ando*, *-ere / -ire → -endo*.",
  "ex": [["*Sto leggendo* un libro.", "Estoy leyendo un libro."],
         ["Cosa *stai facendo*?", "¿Qué estás haciendo?"],
         ["*Stiamo cenando*.", "Estamos cenando."]],
  "warn": "Se usa mucho menos que en castellano. Costumbres y planes van en "
          "presente: *lavoro a Milano* (estoy trabajando en Milán), *stasera "
          "esco*.",
  "more": ["Los irregulares salen de la raíz larga: *fare → facendo*, *dire "
           "→ dicendo*, *bere → bevendo*.",
           "*stare per* + infinitivo = «estar por», a punto de: *sto per "
           "uscire* (estoy por salir), *il treno sta per partire*."]},

 {"h": "tenere y salire",
  "r": "*tenere* (sostener, guardar) y *salire* (subir) también meten la **g** "
       "en *io* y *loro*: *tengo / tengono*, *salgo / salgono*.",
  "table": {"head": ["", "tenere", "salire"],
            "rows": [["io", "tengo", "salgo"],
                     ["tu", "tieni", "sali"],
                     ["lui/lei", "tiene", "sale"],
                     ["noi", "teniamo", "saliamo"],
                     ["voi", "tenete", "salite"],
                     ["loro", "tengono", "salgono"]]},
  "ex": [["*Tengo* il telefono in tasca.", "Llevo el teléfono en el bolsillo."],
         ["Lei *tiene* la porta aperta.", "Ella deja la puerta abierta."],
         ["*Salgo* al terzo piano.", "Subo al tercer piso."],
         ["I prezzi *salgono*.", "Los precios suben."]],
  "warn": "*tenere* no es «tener» de posesión: eso es *avere* (*ho fame*, *ho "
          "due figli*). *tenere* es sostener, mantener o guardar."},
]},

7: {
"intro": "Números, fechas y horas: tres o cuatro convenciones distintas del "
         "castellano que vas a usar todos los días.",
"parts": [
 {"h": "Cardinales y ordinales", "blocks": [0, 1],
  "match": r"^(?!.*(hora|agenda|fecha|siglo)).*(número|ordinal|cifra)"},
 {"h": "Fechas y la hora", "blocks": [2, 3],
  "match": r"hora|agenda|fecha|siglo"},
],
"blocks": [
 {"h": "Cardinales: una sola palabra",
  "r": "Se escriben **pegados**: *ventidue*. *-uno* y *-otto* comen la "
       "vocal de la decena: *ventuno, ventotto*. *-tré* final lleva tilde.",
  "table": {"head": ["", "", "", ""],
            "rows": [["1 uno", "11 undici", "21 ventuno", "100 cento"],
                     ["2 due", "12 dodici", "22 ventidue", "200 duecento"],
                     ["3 tre", "13 tredici", "23 ventitré", "1.000 mille"],
                     ["4 quattro", "14 quattordici", "30 trenta", "2.000 duemila"],
                     ["5 cinque", "15 quindici", "40 quaranta", "10.000 diecimila"],
                     ["6 sei", "16 sedici", "50 cinquanta", "1.000.000 un milione"],
                     ["7 sette", "17 diciassette", "60 sessanta", ""],
                     ["8 otto", "18 diciotto", "70 settanta", ""],
                     ["9 nove", "19 diciannove", "80 ottanta", ""],
                     ["10 dieci", "20 venti", "90 novanta", ""]]},
  "ex": [["Ho *ventidue* anni.", "Tengo veintidós años."],
         ["*ventuno*, *ventotto*", "21, 28: cae la vocal de venti"],
         ["*trentatré*", "33: tilde en la é"],
         ["*duemila* euro", "dos mil euros"]],
  "warn": "*cento* no cambia (*trecento*); *mille* → *mila* pegado "
          "(*duemila*). *milione* y *miliardo* son sustantivos: *due milioni "
          "di persone*.",
  "more": ["Delante de *anni*, las decenas pierden la vocal: *vent'anni, "
           "trent'anni*. *euro* no cambia: *dieci euro*. El porcentaje lleva "
           "artículo: *il dieci per cento*. «Por litro, por kilo» es *al "
           "litro, al chilo*: *venticinque euro al litro*. Los teléfonos se "
           "dicen de a una o dos cifras: *zero due, trentanove…*"]},

 {"h": "Ordinales",
  "r": "Del 1 al 10, forma propia. Desde el 11: cardinal sin vocal final + "
       "**-esimo**: *undicesimo*. Concuerdan como adjetivos en *-o*.",
  "ex": [["il *primo* giorno", "el primer día"],
         ["la *terza* volta", "la tercera vez"],
         ["il *decimo* piano", "el décimo piso"],
         ["il *ventesimo* anniversario", "el vigésimo aniversario"]],
  "tip": "Del 1 al 10: *primo, secondo, terzo, quarto, quinto, sesto, "
         "settimo, ottavo, nono, decimo*. Los terminados en *tre* conservan "
         "la *e*: *ventitreesimo*.",
  "more": ["Reyes y papas llevan ordinal, como en castellano: *Elisabetta II* "
           "se lee *seconda*. También los siglos: *il ventesimo secolo* (el "
           "siglo XX), *la Seconda Guerra Mondiale*, *il Terzo Mondo*."]},

 {"h": "Fechas",
  "r": "*il* + número + mes, **sin «de»**. Cardinal para todos los días "
       "salvo el 1, que es *primo*.",
  "ex": [["Oggi è *il 5 maggio*.", "Hoy es el 5 de mayo."],
         ["*Il primo* gennaio.", "El primero de enero."],
         ["*Nel* 2003.", "En 2003."]],
  "warn": "Nada de «il 5 di maggio»: la fecha va sin *di*. Y el año lleva "
          "artículo: *nel 2003*, *il 2003*.",
  "tip": "Meses y días van en minúscula: *lunedì, gennaio*. 5/8 es el 5 de "
         "agosto, como en castellano.",
  "more": ["Los siglos desde el XIII tienen otro nombre, muy usado en arte e "
           "historia: *il Duecento* (siglo XIII), *il Trecento* (XIV), *il "
           "Quattrocento* (XV)… *il Novecento* (XX). En una agenda alcanza el "
           "día: *giovedì quindici*, *il tre*."]},

 {"h": "La hora",
  "r": "Se pregunta *Che ore sono?* y se responde en **plural** con *le*: "
       "*Sono le tre*. Salvo *l'una*, *mezzogiorno*, *mezzanotte*.",
  "ex": [["*Sono le* tre. / *È l'*una.", "Son las tres. / Es la una."],
         ["Sono le due *e un quarto*.", "Son las dos y cuarto."],
         ["Sono le otto *e mezza*.", "Son las ocho y media."],
         ["Sono le cinque *meno un quarto*.", "Son las cinco menos cuarto."],
         ["Il treno parte *alle* 14:30.", "El tren sale a las 14:30."]],
  "warn": "«A las…» es *alle tre*, pero *all'una*, *a mezzogiorno*, *a "
          "mezzanotte*.",
  "tip": "La parte del día: *di mattina* (de la mañana), *del pomeriggio* "
         "(de la tarde), *di sera* (de la noche). «A eso de las seis»: *verso "
         "le sei*.",
  "more": ["También se pregunta *Che ora è?*: las dos valen. En trenes, "
           "cines y oficinas se usa el reloj de 24 horas mucho más que en el "
           "castellano rioplatense: *alle diciotto* (a las seis de la "
           "tarde). También se dice *le sette e quarantacinque*."]},
]},

8: {
"intro": "Preguntar en italiano es casi igual que en castellano: sin "
         "inversión ni auxiliar. Cambian sobre todo algunas formas fijas "
         "(*qual è*, *come mai*, *che cosa*).",
"parts": [
 {"h": "Sí o no, los interrogativos y la preposición", "blocks": [0, 1, 2],
  "match": r"^(?!.*(sujeto al final|\bquale\b|qual è|\bquali\b)).*\S"},
 {"h": "che o quale, y el sujeto al final", "blocks": [3, 4],
  "match": r"sujeto|quale|qual"},
 {"h": "Pedir con cortesía", "blocks": [5],
  "ids": ["pr-08-%02d" % n for n in range(1, 13)],
  "match": r"^(?!)"},
],
"blocks": [
 {"h": "Sí o no: solo entonación",
  "r": "La pregunta es la afirmación con **entonación** de pregunta. Solo "
       "se escribe el signo de cierre.",
  "ex": [["Parli italiano. → *Parli italiano?*", "Hablás italiano. → ¿Hablás italiano?"],
         ["*Vieni con noi?*", "¿Venís con nosotros?"],
         ["*Hai fame?*", "¿Tenés hambre?"],
         ["*Non sei d'accordo?*", "¿No estás de acuerdo?"]],
  "warn": "El signo «¿» de apertura no existe en italiano: escribí solo el "
          "*?* final. Y no inviertas nada: *Marco è a casa?*",
  "tip": "Para pedir confirmación, al final: *…, vero?* o *…, no?*: *Partono "
         "lunedì, vero?* (se van el lunes, ¿no?).",
  "more": ["Para responder, además de *sì* y *no*: *forse* (quizás), *boh!* "
           "(ni idea), *magari!* (¡ojalá!), *dai!* (¡dale!), *allora* "
           "(entonces), *mica* (para nada: *non è mica vero*). Vuelven en la "
           "semana 18."]},

 {"h": "Los interrogativos",
  "r": "Van al principio. *quanto* concuerda (*quanti anni*); *perché* sirve "
       "para «por qué» **y** «porque».",
  "table": {"head": ["Palabra", "Sentido", "Ejemplo"],
            "rows": [["chi", "quién", "Chi è?"],
                     ["che / che cosa / cosa", "qué", "Cosa fai?"],
                     ["quale / quali", "cuál(es)", "Quale preferisci?"],
                     ["quanto/a/i/e", "cuánto", "Quanti anni hai?"],
                     ["come", "cómo", "Come stai?"],
                     ["dove", "dónde", "Dove abiti?"],
                     ["quando", "cuándo", "Quando parti?"],
                     ["perché", "por qué / porque", "Perché non vieni?"],
                     ["come mai", "cómo es que", "Come mai sei qui?"]]},
  "ex": [["*Perché* non vieni? — *Perché* sono stanco.", "¿Por qué no venís? — Porque estoy cansado."],
         ["*Quanti* anni hai?", "¿Cuántos años tenés?"],
         ["*Dove* abiti?", "¿Dónde vivís?"],
         ["*Come mai* sei qui?", "¿Cómo es que estás acá?"]],
  "more": ["Delante de *è*, *dove* y *come* se apostrofan: *dov'è?*, *com'è?* "
           "(¿qué tal es?). Para precisar se agrega *è che*: *quand'è che "
           "parti?* (¿cuándo es que te vas?), *dov'è che lavori?*. *quanto* + "
           "adjetivo pregunta la medida: *quanto è grande?* (¿qué tan "
           "grande es?).",
           "Dentro de otra frase, el interrogativo no cambia: *non so dove "
           "abita* (no sé dónde vive), *mi sai dire quando torna?*. Para "
           "«si», *se*: *non so se viene*."]},

 {"h": "La preposición va adelante",
  "r": "La preposición **abre** la pregunta, nunca queda al final ni se "
       "omite.",
  "ex": [["*Di chi* è questa borsa?", "¿De quién es esta cartera?"],
         ["*Con chi* esci stasera?", "¿Con quién salís esta noche?"],
         ["*A che ora* comincia?", "¿A qué hora empieza?"],
         ["*Da dove* vieni?", "¿De dónde venís?"],
         ["*Di che cosa* parlate?", "¿De qué hablan?"]]},

 {"h": "che o quale; qual è",
  "r": "*che* pregunta qué tipo de cosa; *quale* pide **elegir** entre "
       "opciones conocidas.",
  "ex": [["*Che* libro leggi?", "¿Qué (tipo de) libro leés?"],
         ["*Quale* libro preferisci, questo o quello?", "¿Qué libro preferís, este o ese?"],
         ["*Qual è* il problema?", "¿Cuál es el problema?"]],
  "warn": "*Qual è* va **sin apóstrofo**: es un truncamiento, no una "
          "elisión. «Qual'è» es de las faltas más marcadas por los "
          "correctores.",
  "more": ["Sin pregunta, *che* es también el relativo «que»: *gli ospiti che "
           "vengono* (los invitados que vienen), *una penna che funziona*. "
           "*chi* y *quale* siguen preguntando: *voglio sapere chi viene*, "
           "*non so quale penna funziona*."]},

 {"h": "El sujeto va al final",
  "r": "Con un interrogativo, el sujeto explícito suele ir **después del "
       "verbo**, al final; ponerlo antes (*Perché Marco non viene?*) también "
       "es normal.",
  "ex": [["Dove abita *Marco*?", "¿Dónde vive Marco?"],
         ["Che cosa dice *il professore*?", "¿Qué dice el profesor?"],
         ["Quanto costano *queste scarpe*?", "¿Cuánto cuestan estos zapatos?"]]},

 {"h": "Pedir con cortesía: mi scusi, per caso, un attimo",
  "r": "**Abrí** con *mi scusi* (usted) o *scusa* (vos) y **suavizá** con *per "
       "favore*, *per caso* o una pregunta: *può…?*",
  "ex": [["*Mi scusi*, *sa* dov'è la stazione?", "Disculpe, ¿sabe dónde está la estación?"],
         ["*Scusa*, *per caso* hai una penna?", "Perdón, ¿no tendrás una lapicera?"],
         ["*Può* ripetere, *per favore*?", "¿Puede repetir, por favor?"],
         ["*Un attimo*, *per favore*.", "Un momento, por favor."]],
  "warn": "*Voglio un caffè* es gramatical, pero en el bar suena a orden. Alcanza "
          "con *un caffè, per favore*: es lo que dice todo el mundo.",
  "tip": "*Per caso* es el «¿no tendrás…?» del castellano: convierte la pregunta "
         "en un pedido que el otro puede rechazar sin quedar mal.",
  "more": ["Tres fórmulas que vas a oír desde el primer día y que se aprenden "
           "enteras: *senta!* (¡oiga!, para llamar la atención), *volevo chiedere* "
           "(quería preguntar) y *vorrei* (quisiera). Su gramática llega en las "
           "semanas 12, 15 y 20.",
           "Pasarse también es un error: tres disculpas seguidas y dos *per favore* "
           "suenan a súplica o a burla. Una fórmula al principio alcanza."],
  "qq": [{"prompt": "En la calle, a una señora que no conocés", "answer": "Mi scusi, sa dov'è la stazione?", "options": ["Mi scusi, sa dov'è la stazione?", "Dov'è la stazione?", "Scusa, dov'è la stazione?"]}]},
]},

9: {
"intro": "Las preposiciones son donde la traducción literal falla más "
         "rápido. Unos pocos patrones cubren la mayoría de los casos y "
         "evitan los errores más visibles.",
"parts": [
 {"h": "Las simples: a o in (y da para ir a lo de alguien)", "blocks": [0, 1, 5, 6],
  "match": r"Vado|Ci vediamo|a o in|a, in, da|\(a, in, da, di\)|a o di|in con el verbo",
  "ids": ["mj-09-%02d" % n for n in range(1, 11)]},
 {"h": "da: origen, agente, «desde hace»", "blocks": [2, 3, 7],
  "match": r"Completá con da|desde|Desde cuándo|presente \+ da|da \+|hace .* que|da quanto|\bda\b",
  "ids": ["mj-09-%02d" % n for n in range(11, 15)]},
 {"h": "Verbos con su preposición", "blocks": [4],
  "match": r"verbo|expresión|su, in, per"},
],
"blocks": [
 {"h": "Las ocho preposiciones simples",
  "r": "*di, a, da, in, con, su, per, tra / fra*. Cada una tiene varios "
       "usos: aprendelas **con su ejemplo**.",
  "table": {"head": ["Prep.", "Valores principales", "Ejemplo"],
            "rows": [["di", "de: posesión, materia, origen, contenido", "il libro di Marco; di lana; sono di Roma; un bicchiere di vino"],
                     ["a", "a, en: ciudad, hora, a quién", "vado a Roma; alle otto; scrivo a Luca"],
                     ["da", "desde, de; en lo de; por (agente); para (uso); desde hace", "vengo da Milano; vado da Anna; occhiali da sole"],
                     ["in", "en: lugares, países, transporte", "in Italia; in banca; in treno"],
                     ["con", "con: compañía, instrumento", "esco con Anna; scrivo con la penna"],
                     ["su", "sobre, en; acerca de", "sul tavolo; su Internet; un libro su Dante"],
                     ["per", "para, por: destino, finalidad, causa, duración", "parto per Roma; per te; per lavoro; per due ore"],
                     ["tra / fra", "entre; dentro de (tiempo o distancia)", "tra amici; torno tra un'ora; fra due chilometri"]]},
  "ex": [["il libro *di* Marco", "el libro de Marco"],
         ["Vado *a* Roma *in* treno.", "Voy a Roma en tren."],
         ["Esco *con* Anna.", "Salgo con Ana."],
         ["Torno *tra* un'ora.", "Vuelvo dentro de una hora."]],
  "more": ["Otras, sin artículo pegado: *senza* (sin), *verso* (hacia; a eso "
           "de: *verso le sei*), *dopo* (después de: *dopo cena*), *dentro* "
           "(dentro de), *dietro* (detrás de), *fuori* (fuera de: *fuori "
           "città*). Con un pronombre, algunas suman *di*: *senza di te*, "
           "*dietro di me*, *verso di lui*."]},

 {"h": "a o in",
  "r": "**a** con ciudades; **in** con países, regiones y continentes. Con "
       "los lugares de todos los días, aprendé el par de memoria.",
  "ex": [["Vivo *a* Bologna, *in* Italia.", "Vivo en Bolonia, en Italia."],
         ["Vado *in* Francia in macchina.", "Voy a Francia en auto."],
         ["Sono *in* ufficio fino alle sei.", "Estoy en la oficina hasta las seis."],
         ["Stasera vado *al* cinema.", "Esta noche voy al cine."]],
  "warn": "«Vivo en Roma» es *vivo a Roma*: con ciudades, *a* aunque el "
          "castellano diga «en».",
  "tip": "Con *in*: *banca, centro, ufficio, montagna, chiesa, piazza, "
         "farmacia*. Con *a*: *al cinema, al mare, al ristorante, a teatro, "
         "a scuola, a casa, a letto*.",
  "more": ["Más con *in*: *in biblioteca, in piscina, in campagna, in "
           "periferia*, y el transporte: *in treno, in aereo, in macchina* "
           "(pero *con la macchina*, con artículo). Más con *a*: *allo zoo, "
           "al supermercato, alla fermata, all'angolo, a destra*. Las islas "
           "chicas van con *a* (*a Capri*), las grandes con *in* (*in "
           "Sicilia*). Meses y fiestas: *a dicembre, a Natale*."]},

 {"h": "da, la que no tiene equivalente",
  "r": "*da* no tiene traducción única. Estos cinco usos aparecen **todo el "
       "tiempo**.",
  "table": {"head": ["Uso", "Ejemplo", "Castellano"],
            "rows": [["procedencia", "Vengo da Napoli.", "Vengo de Nápoles."],
                     ["casa / negocio de alguien", "Vado dal medico.", "Voy al médico."],
                     ["finalidad del objeto", "occhiali da sole", "anteojos de sol"],
                     ["agente de la pasiva", "scritto da Calvino", "escrito por Calvino"],
                     ["duración que sigue abierta", "Studio italiano da due anni.", "Estudio italiano desde hace dos años."]]},
  "ex": [["Vengo *da* Napoli.", "Vengo de Nápoles."],
         ["Vado *dal* medico.", "Voy al médico."],
         ["Stasera ceno *da* Anna.", "Esta noche ceno en lo de Ana."],
         ["gli occhiali *da* sole", "los anteojos de sol"]],
  "warn": "A lo de una persona se va con *da*, no con *a*: *vado da Marco*, "
          "*vado dal dentista*. «Vado al medico» se entiende, pero es calco del castellano.",
  "more": ["*da* + infinitivo = «para» o «que»: *qualcosa da bere* (algo para "
           "tomar), *compiti da fare* (tarea para hacer). También el paso: "
           "*non guardare dalla finestra* (por la ventana). Y ojo: *un "
           "bicchiere di vino* está lleno de vino; *un bicchiere da vino* es "
           "el vaso para vino."]},

 {"h": "Presente + da: lo que sigue pasando",
  "r": "Para algo que empezó antes y **sigue**: **presente + da** + tiempo. "
       "En presente, no en pasado.",
  "ex": [["*Abito* qui *da* cinque anni.", "Vivo acá desde hace cinco años."],
         ["Ti *aspetto da* un'ora!", "¡Hace una hora que te espero!"],
         ["*Studio* italiano *da* due anni.", "Estudio italiano desde hace dos años."]],
  "warn": "El castellano dice «hace… que». El italiano no usa *fa* ni pasado "
          "acá: *studio da due anni*, no «studio fa due anni»."},

 {"h": "Verbos con su preposición",
  "r": "Muchos verbos llevan una preposición fija, distinta del castellano. "
       "Aprendé **verbo + preposición** juntos.",
  "ex": [["*Penso a* te.", "Pienso en vos."],
         ["*Salgo sul* treno.", "Me subo al tren."],
         ["*Dipende da* te.", "Depende de vos."],
         ["*Finisco di* lavorare alle sei.", "Termino de trabajar a las seis."]],
  "warn": "*cerco un libro*, *ascolto la musica*, *aspetto Marco*: **sin** "
          "preposición. Con persona el castellano pone «a» (espero a Marco); "
          "el italiano no.",
  "more": ["Otros de todos los días: *credere a / in* (creer en), *entrare "
           "in* (entrar a), *cominciare a* (empezar a), *sognare di* + "
           "infinitivo (soñar con hacer algo), *innamorarsi di* (enamorarse "
           "de), *sposarsi con* (casarse con), *decidere di* (decidir), "
           "*riuscire a* (lograr), *contare su* (contar con).",
           "Los adjetivos también: *pieno di* (lleno de), *contento di*, "
           "*bravo a / in* (bueno en: *bravo a scuola*, *bravo in "
           "italiano*), *interessato a*, *deciso a* (decidido a), *gentile "
           "con* (amable con). Sin preposición: *preferire*, *volere*, "
           "*dovere* + infinitivo."]},

 {"h": "Medios de transporte: in, a piedi, con",
  "r": "El medio en general va con **in**, sin artículo: *in treno*. Andando: "
       "**a piedi**. Con un medio concreto, *con* + artículo.",
  "table": {"head": ["Medio", "Se dice", "Ejemplo"],
            "rows": [["tren", "in treno", "Vado a Roma in treno."],
                     ["colectivo", "in autobus", "Vengo in autobus."],
                     ["auto", "in macchina", "Andiamo in macchina."],
                     ["avión", "in aereo", "Parto in aereo."],
                     ["bici, moto", "in bici, in moto", "Vai in bici?"],
                     ["a pie", "a piedi", "Vado a scuola a piedi."],
                     ["uno en concreto", "con il treno delle otto", "Vengo con il treno delle otto."]]},
  "ex": [["Vado al lavoro *in* autobus.", "Voy al trabajo en colectivo."],
         ["Torniamo *a piedi*.", "Volvemos a pie."],
         ["Arrivo *con il* treno delle nove.", "Llego en el tren de las nueve."]],
  "warn": "Sin artículo y sin «en el»: *in treno*, nunca «nel treno» para el "
          "trayecto. Y «a pie» es *a piedi*; *in piedi* significa «de pie».",
  "tip": "*con l'autobus* o *con il treno* también se oyen para el medio en "
         "general: *in* es la forma neutra."},

 {"h": "Repaso: al, nel, dal, sul con lugares",
  "r": "En la semana 3 viste que **a, da, in, su** + artículo se funden. Con "
       "lugares las vas a usar siempre.",
  "table": {"head": ["", "il", "lo", "la", "l'", "i", "gli", "le"],
            "rows": [["a", "al", "allo", "alla", "all'", "ai", "agli", "alle"],
                     ["da", "dal", "dallo", "dalla", "dall'", "dai", "dagli", "dalle"],
                     ["in", "nel", "nello", "nella", "nell'", "nei", "negli", "nelle"],
                     ["su", "sul", "sullo", "sulla", "sull'", "sui", "sugli", "sulle"]]},
  "ex": [["Vado *al* mare.", "Voy a la playa."],
         ["Il treno parte *dalla* stazione.", "El tren sale de la estación."],
         ["Abito *nel* centro di Torino.", "Vivo en el centro de Turín."],
         ["Vengo *dall'*aeroporto.", "Vengo del aeropuerto."]],
  "warn": "*con, per, tra / fra* no se funden: *con il treno*, *per il centro*. "
          "Sin artículo la preposición queda sola: *in banca*, pero *nella "
          "banca di via Roma*."},

 {"h": "Tiempo: per, da, tra",
  "r": "Tres relojes distintos: **per** = duración con final; **da** = desde "
       "hace, y sigue; **tra / fra** = dentro de.",
  "table": {"head": ["Prep.", "Sentido", "Ejemplo"],
            "rows": [["per", "dura un tiempo", "Resto qui per tre giorni."],
                     ["da", "empezó y sigue", "Abito qui da tre anni."],
                     ["tra / fra", "a partir de ahora", "Parto tra tre giorni."]]},
  "ex": [["Resto a Roma *per* una settimana.", "Me quedo en Roma una semana."],
         ["*Da* quanto tempo studi italiano?", "¿Desde hace cuánto estudiás italiano?"],
         ["*Da* quando lavori qui?", "¿Desde cuándo trabajás acá?"],
         ["Il film comincia *tra* dieci minuti.", "La película empieza dentro de diez minutos."]],
  "warn": "*da quanto tempo* pide una duración (*da due anni*); *da quando*, un "
          "momento (*da marzo*). «Hace dos años» en pasado es *due anni fa*."},
]},

10: {
"intro": "Los pronombres son el corazón del italiano hablado. Esta semana, "
         "el mapa completo: directos, indirectos y tónicos, y dónde se "
         "ponen.",
"parts": [
 {"h": "El cuadro: directo o indirecto, sin leísmo", "blocks": [0, 1, 2],
  "match": r"^(?!.*(posición|ubicando|tónico|preposición|sé, lui, lei|Enfatizá)).*\S"},
 {"h": "Dónde va el pronombre y los tónicos", "blocks": [3],
  "match": r"posición|tónico"},
],
"blocks": [
 {"h": "El cuadro entero",
  "r": "Los **átonos** van delante del verbo: *ti vedo*. Los **tónicos**, "
       "después de preposición o para enfatizar: *con me*, *per te*.",
  "table": {"head": ["Sujeto", "Directo", "Indirecto", "Tónico (tras prep.)"],
            "rows": [["io (me, a mí)", "mi", "mi", "me"],
                     ["tu (te, a vos)", "ti", "ti", "te"],
                     ["lui (lo, le, a él)", "lo", "gli", "lui"],
                     ["lei (la, le, a ella)", "la", "le", "lei"],
                     ["Lei (lo / la, le, a usted)", "La", "Le", "Lei"],
                     ["noi (nos, a nosotros)", "ci", "ci", "noi"],
                     ["voi (los / les, a ustedes)", "vi", "vi", "voi"],
                     ["loro (los / las, les, a ellos)", "li / le", "gli (loro)", "loro"]]},
  "ex": [["*Ti* chiamo stasera.", "Te llamo esta noche."],
         ["Vieni *con me*?", "¿Venís conmigo?"],
         ["*Lo* dico *a te*, non a lui.", "Te lo digo a vos, no a él."]],
  "warn": "Después de preposición, nunca *mi* ni *ti*: *con me*, *per te*. "
          "«Conmigo» y «contigo» son *con me*, *con te*.",
  "more": ["Tónicos útiles: *da me* (a mi casa: *vieni da me?*), *secondo me* "
           "(para mí, en mi opinión). «Sí mismo» es *sé*: *parla sempre di "
           "sé*, *pensa solo a sé*. *stesso* refuerza, como «mismo»: *io "
           "stesso*, *lei stessa*, *conosci te stesso*."]},

 {"h": "Directo o indirecto",
  "q": [{"prompt": "Reemplazá con un pronombre.", "stem": "Telefono a Marco → ___ telefono.", "answer": "Gli", "options": ["Gli", "Lo", "Le"]}, {"prompt": "Reemplazá con un pronombre.", "stem": "Vedo Anna → ___ vedo.", "answer": "La", "options": ["La", "Le", "Gli"]}],
  "r": "Directo: sin preposición (*vedo Marco → lo vedo*). Indirecto: con "
       "*a* (*telefono a Marco → gli telefono*). Solo cambia en tercera "
       "persona.",
  "ex": [["Vedo Marco → *Lo* vedo.", "Veo a Marco → Lo veo."],
         ["Telefono a Marco → *Gli* telefono.", "Llamo a Marco → Lo llamo (en it., indirecto)."],
         ["Vedo Anna → *La* vedo.", "Veo a Ana → La veo."],
         ["Scrivo ad Anna → *Le* scrivo.", "Le escribo a Ana."],
         ["Conosco i tuoi amici → *Li* conosco.", "Conozco a tus amigos → Los conozco."]],
  "more": ["*gli* sirve también para «a ellos / a ellas»: *devi rispondere "
           "alle ragazze → devi rispondergli*; *loro* detrás del verbo es formal. *lo* "
           "puede reemplazar una frase entera: *lo so* (lo sé). Y «¿Tenés la "
           "llave? — Sí, la tengo» se dice *sì, ce l'ho*: con *avere*, *lo / "
           "la* van con *ce* delante."]},

 {"h": "Sin leísmo y sin «a» personal",
  "q": [{"prompt": "¿Cuál está bien? «Lo veo» (a Marco).", "answer": "Lo vedo.", "options": ["Lo vedo.", "Le vedo.", "Gli vedo."]}, {"prompt": "¿Cuál está bien? «Veo a Marco.»", "answer": "Vedo Marco.", "options": ["Vedo Marco.", "Vedo a Marco.", "Vedo di Marco."]}],
  "r": "*le* singular es **siempre indirecto** femenino. Y el objeto directo "
       "de persona va **sin *a***: *vedo Marco*.",
  "ex": [["*Lo* vedo.", "Lo veo (a él)."],
         ["*Le* scrivo.", "Le escribo (a ella)."],
         ["*Vedo Marco*.", "Veo a Marco."],
         ["*Aspetto Anna*.", "Espero a Ana."]],
  "warn": "«Le vedo» por «lo veo» es error grave: *le vedo* solo significa "
          "«las veo». Y nunca «vedo a Marco»."},

 {"h": "Dónde se coloca el pronombre",
  "q": [{"prompt": "¿Cuál está bien? «Quiero llamarte.»", "answer": "Voglio chiamarti.", "options": ["Voglio chiamarti.", "Voglio ti chiamare.", "Ti voglio chiamarti."]}, {"prompt": "¿Cuál está bien? «No lo conozco.»", "answer": "Non lo conosco.", "options": ["Non lo conosco.", "Lo non conosco.", "Non conoscolo."]}],
  "r": "Delante del verbo conjugado (*ti chiamo*); **pegado** al infinitivo "
       "(*chiamarti*). Con modales, las dos: *ti voglio vedere* = *voglio "
       "vederti*.",
  "ex": [["*Ti* chiamo domani.", "Te llamo mañana."],
         ["Voglio chiamar*ti*.", "Quiero llamarte."],
         ["*La* posso aiutare? / Posso aiutar*la*?", "¿La puedo ayudar? / ¿Puedo ayudarla?"],
         ["Non *lo* conosco.", "No lo conozco."]],
  "tip": "El infinitivo pierde la *-e* final: *vedere* + *ti* → *vederti*.",
  "more": ["También se pega al gerundio (*chiamandoti*) y al imperativo "
           "informal (*chiamami!*), que llega en la semana 12.",
           "Y a *ecco* (acá está): *eccolo!* (¡acá está!), *eccomi* (acá "
           "estoy). Con *Lei* también se pega al saludo: *arrivederLa*."]},
]},

11: {
"intro": "El passato prossimo cubre el «comí» y el «he comido» castellanos: "
         "*ieri ho mangiato* = ayer comí. La forma es fácil; lo que se "
         "entrena es elegir el auxiliar.",
"parts": [
 {"h": "La forma y los participios irregulares", "blocks": [0, 5],
  "match": r"^Escribí el participio|preguntas con el participio"},
 {"h": "Cuál auxiliar y cómo concuerda", "blocks": [1, 2, 3, 4],
  "match": r"auxiliar|passato prossimo|modal"},
 {"h": "già, mai, ancora y el pronombre directo", "blocks": [6, 7],
  "match": r"pronombre|objeto|già|mai|ancora|corchetes"},
],
"blocks": [
 {"h": "La forma",
  "r": "Presente de *avere* o *essere* + participio. Participios regulares: "
       "*-are → -ato*, *-ere → -uto*, *-ire → -ito*.",
  "table": {"head": ["con avere", "", "con essere", ""],
            "rows": [["ho parlato", "abbiamo parlato", "sono andato/a", "siamo andati/e"],
                     ["hai parlato", "avete parlato", "sei andato/a", "siete andati/e"],
                     ["ha parlato", "hanno parlato", "è andato/a", "sono andati/e"]]},
  "ex": [["Ieri *ho mangiato* la pizza.", "Ayer comí pizza."],
         ["*Ho venduto* la macchina.", "Vendí el auto."],
         ["*Abbiamo dormito* bene.", "Dormimos bien."]],
  "warn": "Es el pasado de todos los días: *ieri ho mangiato* = ayer comí. "
          "No lo guardes solo para el «he comido»."},

 {"h": "Cuál auxiliar",
  "r": "*avere* si el verbo puede llevar objeto directo. *essere* con "
       "movimiento, permanencia, cambio de estado y la familia de *piacere*.",
  "table": {"head": ["Grupo (con essere)", "Verbos", "Ejemplo"],
            "rows": [["movimiento", "andare (ir), venire, arrivare (llegar), partire (irse), uscire (salir), entrare, tornare (volver), salire (subir), scendere (bajar), cadere (caerse)", "Sono arrivato tardi. (Llegué tarde.)"],
                     ["permanencia", "restare, rimanere (quedarse), stare", "Sono rimasta a casa. (Me quedé en casa.)"],
                     ["cambio de estado", "nascere (nacer), morire (morir), diventare (volverse), crescere (crecer), guarire (curarse), dimagrire (adelgazar)", "È nata a Roma. (Nació en Roma.)"],
                     ["existencia", "essere, esserci (haber)", "C'è stato un problema. (Hubo un problema.)"],
                     ["gustar y afines", "piacere, mancare (faltar), sembrare (parecer), costare, servire (servir, hacer falta), bastare (alcanzar), succedere (pasar)", "È successo ieri. (Pasó ayer.)"],
                     ["todos los reflexivos", "alzarsi (levantarse), lavarsi, divertirsi...", "mi sono alzato (me levanté): semana 16"]]},
  "ex": [["*Ho letto* il libro.", "Leí el libro."],
         ["*Sono andato* a Roma.", "Fui a Roma."],
         ["Ti *è piaciuto* il film?", "¿Te gustó la película?"]],
  "warn": "No todo movimiento va con *essere*: *camminare, viaggiare, "
          "nuotare* van con *avere*. Y *essere* usa *essere* (*sono stato*); "
          "*avere* usa *avere* (*ho avuto*).",
  "more": ["El clima admite los dos: *è piovuto* o *ha piovuto* (llovió), *è "
           "nevicato* o *ha nevicato*."]},

 {"h": "Con essere, el participio concuerda",
  "r": "Con *essere*, el participio **concuerda con el sujeto** en género y "
       "número: *-o, -a, -i, -e*.",
  "ex": [["Marco è partit*o*. / Anna è partit*a*.", "Marco se fue. / Ana se fue."],
         ["Siamo arrivat*i* tardi.", "Llegamos tarde."],
         ["Le ragazze sono uscit*e*.", "Las chicas salieron."]],
  "warn": "En castellano el participio no cambia nunca. En italiano, con "
          "*essere*, sí: si sos mujer, *sono andata*, no «sono andato».",
  "tip": "Con *piacere, servire, bastare, succedere* el sujeto es la cosa: "
         "concuerda con ella. *Mi è servita la chiave*, *mi sono bastati i "
         "soldi*."},

 {"h": "Verbos con los dos auxiliares",
  "r": "Algunos aceptan los dos, con sentido distinto: **con objeto directo, "
       "*avere***; sin objeto, *essere*.",
  "ex": [["*Ho cambiato* idea. / *Sono cambiato* molto.", "Cambié de idea. / Cambié mucho (yo)."],
         ["*Ho finito* il lavoro. / Il film *è finito*.", "Terminé el trabajo. / La película terminó."],
         ["*Ho passato* tre giorni lì. / *Sono passato* da casa tua.", "Pasé tres días ahí. / Pasé por tu casa."],
         ["*Ho salito* le scale. / *Sono salito* sul treno.", "Subí las escaleras. / Me subí al tren."]]},

 {"h": "Modales: manda el infinitivo",
  "r": "Con *potere, volere, dovere*, el auxiliar lo elige el infinitivo que "
       "sigue: *ho dovuto studiare*, pero *sono dovuto andare*.",
  "ex": [["*Ho voluto* vedere il film.", "Quise ver la película."],
         ["*Sono dovuta* partire presto.", "Tuve que irme temprano."],
         ["Non *sono potuto* venire.", "No pude venir."]],
  "tip": "Al hablar, *avere* se impone cada vez más (*ho dovuto andare*). En "
         "el examen, usá la forma canónica."},

 {"h": "Participios irregulares imprescindibles",
  "r": "Muchos verbos frecuentes, sobre todo en *-ere*, tienen participio "
       "irregular. Aprendelos de memoria junto con el infinitivo.",
  "table": {"head": ["Verbo", "Participio", "Verbo", "Participio"],
            "rows": [["essere (ser, estar)", "stato", "fare (hacer)", "fatto"],
                     ["prendere (tomar)", "preso", "dire (decir)", "detto"],
                     ["mettere (poner)", "messo", "scrivere (escribir)", "scritto"],
                     ["leggere (leer)", "letto", "vedere (ver)", "visto"],
                     ["chiedere (pedir, preguntar)", "chiesto", "rispondere (responder)", "risposto"],
                     ["aprire (abrir)", "aperto", "offrire (ofrecer)", "offerto"],
                     ["venire (venir)", "venuto", "rimanere (quedarse)", "rimasto"],
                     ["scegliere (elegir)", "scelto", "vivere (vivir)", "vissuto"],
                     ["bere (tomar, beber)", "bevuto", "perdere (perder)", "perso"],
                     ["chiudere (cerrar)", "chiuso", "decidere (decidir)", "deciso"],
                     ["nascere (nacer)", "nato", "morire (morir)", "morto"],
                     ["succedere (pasar)", "successo", "correre (correr)", "corso"],
                     ["rompere (romper)", "rotto", "vincere (ganar)", "vinto"],
                     ["conoscere (conocer)", "conosciuto", "piacere (gustar)", "piaciuto"]]},
  "ex": [["Cosa hai *fatto* ieri?", "¿Qué hiciste ayer?"],
         ["Ho *visto* un bel film.", "Vi una linda película."],
         ["Ho *preso* il treno.", "Tomé el tren."],
         ["Chi ha *scritto* questo libro?", "¿Quién escribió este libro?"]],
  "warn": "Nada de «ho fatto» → «ho facciuto» ni «ho aperto» → «ho "
          "aprito»: el irregular no se regulariza, como «hecho» no es "
          "«hacido»."},

 {"h": "già, mai, ancora: en el medio",
  "r": "Los adverbios cortos (*già, mai, ancora, sempre, appena*) van "
       "**entre** el auxiliar y el participio.",
  "ex": [["Ho *già* mangiato.", "Ya comí."],
         ["Non ho *ancora* finito.", "Todavía no terminé."],
         ["Non ci sono *mai* stato.", "Nunca estuve ahí."],
         ["Ha *sempre* lavorato qui.", "Siempre trabajó acá."],
         ["Ho *appena* parlato con lui.", "Recién hablé con él."]],
  "tip": "Los largos en *-mente* van después: *ho parlato chiaramente*."},

 {"h": "Pronombre directo: el participio concuerda",
  "q": [{"prompt": "Completá: «Las leí» (las cartas).", "stem": "Le ho ___.", "answer": "lette", "options": ["lette", "letto", "letti"]}, {"prompt": "¿Cuál está bien? «La vi» (a Anna).", "answer": "L'ho vista.", "options": ["L'ho vista.", "L'ho visto.", "La ho visto."]}],
  "r": "Con *lo, la, li, le* delante, el participio **concuerda** aunque el "
       "auxiliar sea *avere*. Con *mi, ti, ci, vi*, es opcional.",
  "ex": [["Ho visto Anna → *L'*ho vist*a*.", "Vi a Ana → La vi."],
         ["Ho comprato i libri → *Li* ho comprat*i*.", "Compré los libros → Los compré."],
         ["Ho letto le lettere → *Le* ho lett*e*.", "Leí las cartas → Las leí."]],
  "warn": "*lo* y *la* se apostrofan ante *ho*: *l'ho visto*, *l'ho vista*. "
          "*li* y *le*, nunca: *li ho visti*.",
  "more": ["Solo el directo hace concordar. *le* indirecto (a ella) y *gli* "
           "no cambian nada: *le ho parlato* (le hablé), *gli ho scritto*. "
           "Tampoco el sustantivo detrás: *ho letto le lettere*."]},
]},

12: {
"intro": "Reflexivos e imperativo: la rutina diaria, el cuerpo y las órdenes. "
         "Comparten un rasgo clave: con el imperativo y el infinitivo, el "
         "pronombre se pega al final; con el verbo conjugado va delante.",
"parts": [
 {"h": "Reflexivos, recíprocos y el cuerpo", "blocks": [0, 1, 6],
  "match": r"reflexiv|recíproc|cuerpo",
  "ids": ["mj-12-%02d" % n for n in range(1, 5)]},
 {"h": "Imperativo de tu y voi, negativo, farmacia y formas cortas", "blocks": [2, 3, 7, 8, 5],
  "match": r"imperativo de tu y de voi|tu y después el de voi|sugerencias|hagamos|persona \(tu|de tu\b|negativ|corta",
  "ids": ["mj-12-%02d" % n for n in range(5, 13)]},
 {"h": "Imperativo formal: Lei", "blocks": [4],
  "match": r"Lei|formal",
  "ids": ["mj-12-13", "mj-12-14"]},
],
"blocks": [
 {"h": "Los reflexivos",
  "r": "Pronombre *mi, ti, si, ci, vi, si* delante del verbo. El infinitivo "
       "se cita con *-si* pegado: *alzarsi, lavarsi, chiamarsi*.",
  "table": {"head": ["", "alzarsi (sing.)", "", "alzarsi (pl.)"],
            "rows": [["io", "mi alzo", "noi", "ci alziamo"],
                     ["tu", "ti alzi", "voi", "vi alzate"],
                     ["lui/lei", "si alza", "loro", "si alzano"]]},
  "ex": [["*Mi chiamo* Luca.", "Me llamo Luca."],
         ["A che ora *ti svegli*?", "¿A qué hora te despertás?"],
         ["*Ci vediamo* domani.", "Nos vemos mañana."]],
  "warn": "Con verbo conjugado, el pronombre va delante, como en castellano: "
          "*mi alzo*. Con infinitivo, pegado: *devo alzarmi*.",
  "more": ["*ci vediamo*, *si conoscono*: con sujeto plural, el mismo "
           "pronombre sirve para lo recíproco, como «nos vemos» en "
           "castellano.",
           "Con partes del cuerpo y ropa va el artículo, no el posesivo, "
           "como en castellano: *mi lavo i denti*, *ti togli la giacca*. Y "
           "*si* + tercera persona también es el «se» impersonal: *qui non si "
           "fuma* (acá no se fuma)."]},

 {"h": "Reflexivos que no coinciden",
  "r": "Algunos verbos son reflexivos solo en una de las dos lenguas, o "
       "piden otra preposición. Aprendelos con su pronombre.",
  "ex": [["*Mi riposo* un po'.", "Descanso un poco."],
         ["Stasera *rimango* a casa.", "Esta noche me quedo en casa."],
         ["*Mi ricordo di* te.", "Me acuerdo de vos."],
         ["*Mi trovo* bene a Roma.", "Estoy a gusto en Roma."]],
  "warn": "*rimanere* y *restare* no son reflexivos: *rimango a casa*, "
          "nunca «mi rimango». Al revés, «descansar» es *riposarsi*.",
  "more": ["Con su preposición: *ricordarsi di* (acordarse de), "
           "*dimenticarsi di* (olvidarse de), *accorgersi di* (darse cuenta "
           "de), *innamorarsi di*, *sposarsi con*. Y dos útiles: *laurearsi* "
           "(recibirse), *trasferirsi* (mudarse)."]},

 {"h": "El imperativo informal",
  "r": "Igual que el presente, salvo *tu* de los verbos en **-are**, que "
       "termina en *-a*: *tu parli* → *Parla!*",
  "table": {"head": ["", "-are (parlare)", "-ere (prendere)", "-ire (dormire)", "-isc (finire)"],
            "rows": [["tu (vos: ¡hablá!)", "parla!", "prendi!", "dormi!", "finisci!"],
                     ["noi (¡hablemos!)", "parliamo!", "prendiamo!", "dormiamo!", "finiamo!"],
                     ["voi (ustedes: ¡hablen!)", "parlate!", "prendete!", "dormite!", "finite!"]]},
  "ex": [["*Parla* piano!", "¡Hablá despacio!"],
         ["*Prendi* il treno!", "¡Tomá el tren!"],
         ["*Chiamami*!", "¡Llamame!"],
         ["*Alzati*!", "¡Levantate!"],
         ["*Svegliatevi*!", "¡Despiértense!"]],
  "warn": "El voseo engaña: «hablá» lleva el acento al final, *parla* no: "
          "*PAR-la*, *MAN-gia*. Y el pronombre va pegado: *chiamami*.",
  "more": ["El pronombre se pega también en *noi* y *voi*: *mettiamolo qui* "
           "(pongámoslo acá: es una sugerencia; *lo mettiamo qui* es un "
           "hecho), *finitelo* (termínenlo), *sedetevi* (siéntense).",
           "Los irregulares del presente dan su *tu*: *vieni!, esci!, tieni!, "
           "scegli!, rimani!, siediti!* (sentate). *essere* y *avere* tienen "
           "forma propia: *sii gentile!* (sé amable), *abbi pazienza!* (tené "
           "paciencia)."]},

 {"h": "El negativo de tu",
  "r": "*tu* negativo = **non + infinitivo**. En *noi* y *voi* alcanza con "
       "anteponer *non*.",
  "ex": [["*Non parlare*!", "¡No hables!"],
         ["*Non andare*!", "¡No vayas!"],
         ["*Non ti preoccupare*!", "¡No te preocupes!"],
         ["*Non parlate*!", "¡No hablen!"]],
  "warn": "«Non parla!» no es una orden: significa «no habla». Con *tu*, el "
          "negativo pide infinitivo: *non parlare!*",
  "tip": "Con pronombre, dos lugares posibles: pegado al infinitivo o "
         "delante. *Non toccarlo!* = *Non lo toccare!* (¡no lo toques!)."},

 {"h": "Adelanto: el formal es un congiuntivo",
  "r": "*Lei* usa el congiuntivo: *-are* → **-i** (*parli!*); *-ere / "
       "-ire* → **-a** (*prenda!*). Irregulares, desde el *io*: *vengo → "
       "venga*.",
  "table": {"head": ["Verbo", "io (presente)", "Lei (usted)", "Ejemplo"],
            "rows": [["parlare (hablar)", "parlo", "parli", "Parli piano! (¡Hable despacio!)"],
                     ["prendere (tomar)", "prendo", "prenda", "Prenda pure! (¡Tome nomás!)"],
                     ["sentire (oír)", "sento", "senta", "Senta, scusi! (¡Oiga, disculpe!)"],
                     ["finire (terminar)", "finisco", "finisca", "Finisca pure! (¡Termine nomás!)"],
                     ["venire (venir)", "vengo", "venga", "Venga dentro! (¡Entre!)"],
                     ["fare (hacer)", "faccio", "faccia", "Lo faccia subito! (¡Hágalo ya!)"],
                     ["andare (ir)", "vado", "vada", "Vada dritto! (¡Siga derecho!)"],
                     ["dire (decir)", "dico", "dica", "Mi dica! (¡Dígame!)"],
                     ["scegliere (elegir)", "scelgo", "scelga", "Scelga lei! (¡Elija usted!)"],
                     ["tenere (tener)", "tengo", "tenga", "Tenga la destra! (¡Vaya por la derecha!)"],
                     ["dare (dar)", "do", "dia", "Mi dia un po' di pane! (¡Deme un poco de pan!)"],
                     ["stare (estar)", "sto", "stia", "Stia tranquillo! (¡Quédese tranquilo!)"]]},
  "ex": [["*Scusi*! / *Senta*!", "¡Disculpe! / ¡Oiga!"],
         ["*Venga*! / *Prenda*!", "¡Venga! / ¡Tome!"],
         ["Mi *dica*!", "¡Dígame!"],
         ["Si *accomodi*!", "¡Pase! / ¡Siéntese!"],
         ["*Faccia* pure!", "¡Adelante, hágalo nomás!"]],
  "warn": "El pronombre va **delante**, nunca pegado: *Mi dica*, *Si "
          "accomodi*, *Lo faccia*. En negativo, *non* delante: *Non si "
          "preoccupi!* (¡no se preocupe!).",
  "tip": "*rimanere → rimanga*, *sedersi → si sieda*, *uscire → esca*: si "
         "sabés el *io* del presente, tenés el formal.",
  "qq": [{"prompt": "Imperativo de Lei", "stem": "___ più piano, per favore! (parlare)", "answer": "Parli", "options": ["Parli", "Parla", "Parlate"]},
         {"prompt": "Imperativo de Lei", "stem": "___ subito! (partire)", "answer": "Parta", "options": ["Parta", "Parti", "Parte"]},
         {"prompt": "Imperativo de Lei", "stem": "___ dentro, signora! (venire)", "answer": "Venga", "options": ["Venga", "Vieni", "Viene"]}]},

 {"h": "Formas cortas: consonante doble",
  "r": "*va', da', fa', sta', di'* + pronombre **duplican** la consonante "
       "del pronombre: *da'* + *mi* → *dammi*.",
  "ex": [["*Dammi* la mano!", "¡Dame la mano!"],
         ["*Dimmi* tutto.", "Decime todo."],
         ["*Fallo* subito!", "¡Hacelo ya!"],
         ["*Vacci* tu!", "¡Andá vos!"]],
  "warn": "Única excepción: *gli* no se duplica. *Dagli il libro*, nunca "
          "«daggli»."},

 {"h": "El cuerpo: artículo, no posesivo",
  "r": "Con partes del cuerpo el italiano usa el **artículo**, no el posesivo: *mi lavo le mani*, no «le mie mani».",
  "ex": [["*Mi lavo le* mani.", "Me lavo las manos."],
         ["*Ti lavi i* denti?", "¿Te lavás los dientes?"],
         ["*Mi fa male la* testa.", "Me duele la cabeza."],
         ["*Mi fanno male i* piedi.", "Me duelen los pies."]],
  "warn": "*fa male* concuerda con lo que duele: *la gola* → *fa*, *i piedi* → "
          "*fanno*. Y con *mi* delante: *mi fa*, no «fa mi»."},

 {"h": "En la farmacia: síntomas y consejos",
  "r": "Para aconsejar, imperativo de *tu*. Para el síntoma, *ho mal di* + parte del cuerpo, sin artículo.",
  "table": {"head": ["Síntoma", "Consejo"],
            "rows": [["Ho mal di testa.", "Prendi una pastiglia."],
                     ["Ho la tosse.", "Bevi un tè caldo."],
                     ["Ho la febbre.", "Riposati e bevi molta acqua."],
                     ["Ho mal di gola.", "Non parlare troppo."]]},
  "ex": [["*Prendi* una pastiglia dopo cena.", "Tomá una pastilla después de la cena."],
         ["*Bevi* molta acqua e *riposati*.", "Tomá mucha agua y descansá."],
         ["*Non fumare*!", "¡No fumes!"],
         ["*Non preoccuparti*: è solo un raffreddore.", "No te preocupes: es solo un resfrío."]],
  "warn": "Con *tu* negativo el pronombre puede ir pegado al infinitivo o "
          "delante: *non preoccuparti* = *non ti preoccupare*.",
  "tip": "En la farmacia: *una pastiglia, una compressa, uno sciroppo, una "
         "pomata, la ricetta*."},

 {"h": "Imperativo de tu con forma propia",
  "r": "*essere, avere, sapere* tienen imperativo propio. *andare, fare, dire, dare, stare* usan formas cortas con apóstrofo.",
  "table": {"head": ["Verbo", "tu", "voi"],
            "rows": [["essere", "sii", "siate"],
                     ["avere", "abbi", "abbiate"],
                     ["sapere", "sappi", "sappiate"],
                     ["andare, fare, dare, stare", "va', fa', da', sta'", "andate, fate, date, state"],
                     ["dire", "di'", "dite"]]},
  "ex": [["*Sii* gentile con lui!", "¡Sé amable con él!"],
         ["*Abbi* pazienza!", "¡Tené paciencia!"],
         ["*Vieni* qui e *siediti*!", "¡Vení acá y sentate!"],
         ["*Di'* la verità!", "¡Decí la verdad!"]],
  "warn": "El español dice «sé» y «tené»; el italiano, *sii* y *abbi*. Las "
          "formas cortas llevan apóstrofo, nunca acento: *di'*, *fa'*, *va'* "
          "(también existen *vai, fai, dai, stai*)."},
]},

13: {
"intro": "Semana de jefe final: no hay teoría nueva. Es la hoja de repaso "
         "del examen A2. Leela antes de entrar y volvé cada vez que falles.",
"parts": [
 {"h": "Repaso: artículos, presente e irregulares", "blocks": [0, 1, 2, 3],
  "match": r"^(?!.*(pronombre|passato|particip|reflexiv|imperativ|auxiliar)).*(artículo|presente|essere|avere|plural|masculino|adjetivo|número|hora|pregunt)"},
 {"h": "Repaso: pronombres, passato prossimo, reflexivos", "blocks": [4, 5, 6],
  "match": r"pronombre|passato|particip|reflexiv|imperativ|auxiliar"},
 {"h": "Repaso: las cinco trampas y todo lo demás", "blocks": [7],
  "match": r"\S"},
],
"blocks": [
 {"h": "Artículos, de un vistazo",
  "r": "Mirá **género** y **primer sonido** de la palabra siguiente.",
  "table": {"head": ["", "consonante", "vocal", "s+cons., z, gn, ps"],
            "rows": [["masc. sing.", "il", "l'", "lo"],
                     ["masc. pl.", "i", "gli", "gli"],
                     ["fem. sing.", "la", "l'", "la"],
                     ["fem. pl.", "le", "le", "le"],
                     ["indet. masc.", "un", "un", "uno"],
                     ["indet. fem.", "una", "un'", "una"]]},
  "ex": [["*lo* studente → *gli* studenti", "el estudiante → los estudiantes"],
         ["*l'*amica → *le* amiche", "la amiga → las amigas"],
         ["*uno* zaino, *un'*idea", "una mochila, una idea"]]},

 {"h": "Presente: las terminaciones",
  "r": "*tu* en **-i** y *noi* en **-iamo** siempre. *-isc-* en todas menos "
       "*noi* y *voi*.",
  "table": {"head": ["", "-are", "-ere", "-ire", "-isc"],
            "rows": [["io", "-o", "-o", "-o", "-isco"],
                     ["tu", "-i", "-i", "-i", "-isci"],
                     ["lui", "-a", "-e", "-e", "-isce"],
                     ["noi", "-iamo", "-iamo", "-iamo", "-iamo"],
                     ["voi", "-ate", "-ete", "-ite", "-ite"],
                     ["loro", "-ano", "-ono", "-ono", "-iscono"]]},
  "ex": [["Tu parl*i*, noi parl*iamo*.", "Vos hablás, nosotros hablamos."],
         ["Io fin*isco*, voi fin*ite*.", "Yo termino, ustedes terminan."],
         ["Loro scriv*ono* molto.", "Ellos escriben mucho."]]},

 {"h": "Irregulares: essere a fare",
  "r": "Los que más aparecen en el examen. **Sin diptongo** y con el acento "
       "de *loro* en la raíz.",
  "table": {"head": ["", "essere", "avere", "andare", "fare", "venire"],
            "rows": [["io", "sono", "ho", "vado", "faccio", "vengo"],
                     ["tu", "sei", "hai", "vai", "fai", "vieni"],
                     ["lui/lei", "è", "ha", "va", "fa", "viene"],
                     ["noi", "siamo", "abbiamo", "andiamo", "facciamo", "veniamo"],
                     ["voi", "siete", "avete", "andate", "fate", "venite"],
                     ["loro", "sono", "hanno", "vanno", "fanno", "vengono"]]},
  "ex": [["Cosa *fai* stasera?", "¿Qué hacés esta noche?"],
         ["*Vanno* al mare.", "Van al mar."],
         ["*Vengo* anch'io!", "¡Voy yo también!"]],
  "warn": "Hacia donde está el que habla se usa *venire*: «¡ya voy!» es "
          "*vengo!*, no «vado!»."},

 {"h": "Irregulares: modales, dire, uscire",
  "r": "*potere, volere, dovere* + **infinitivo**. *dire* y *uscire* cambian "
       "la raíz: *dico*, *esco*.",
  "table": {"head": ["", "potere", "volere", "dovere", "dire", "uscire"],
            "rows": [["io", "posso", "voglio", "devo", "dico", "esco"],
                     ["tu", "puoi", "vuoi", "devi", "dici", "esci"],
                     ["lui/lei", "può", "vuole", "deve", "dice", "esce"],
                     ["noi", "possiamo", "vogliamo", "dobbiamo", "diciamo", "usciamo"],
                     ["voi", "potete", "volete", "dovete", "dite", "uscite"],
                     ["loro", "possono", "vogliono", "devono", "dicono", "escono"]]},
  "ex": [["Non *posso* uscire.", "No puedo salir."],
         ["Cosa *dici*?", "¿Qué decís?"],
         ["Stasera *esco* con Anna.", "Esta noche salgo con Ana."]]},

 {"h": "Pronombres",
  "q": [{"prompt": "¿Cuál está bien? «Vengo con vos.»", "answer": "Vengo con te.", "options": ["Vengo con te.", "Vengo con ti.", "Vengo con tu."]}, {"prompt": "¿Cuál está bien? «Le escribo» (a ella).", "answer": "Le scrivo.", "options": ["Le scrivo.", "Gli scrivo.", "La scrivo."]}],
  "r": "Átonos **delante** del verbo conjugado; tónicos **después** de "
       "preposición.",
  "table": {"head": ["Persona", "Directo", "Indirecto", "Reflexivo", "Tónico"],
            "rows": [["io (yo)", "mi", "mi", "mi", "me"],
                     ["tu (vos)", "ti", "ti", "ti", "te"],
                     ["lui (él)", "lo", "gli", "si", "lui"],
                     ["lei (ella)", "la", "le", "si", "lei"],
                     ["Lei (usted)", "La", "Le", "si", "Lei"],
                     ["noi (nosotros)", "ci", "ci", "ci", "noi"],
                     ["voi (ustedes)", "vi", "vi", "vi", "voi"],
                     ["loro (ellos, ellas)", "li / le", "gli", "si", "loro"]]},
  "ex": [["*Lo* conosco bene.", "Lo conozco bien."],
         ["*Gli* scrivo domani.", "Le escribo mañana (a él)."],
         ["Vengo *con te*.", "Voy con vos."]]},

 {"h": "Passato prossimo: auxiliar y participio",
  "r": "*avere* con objeto directo; *essere* con movimiento, cambio de "
       "estado y reflexivos, y entonces el participio **concuerda**.",
  "table": {"head": ["", "con avere", "con essere"],
            "rows": [["io", "ho mangiato", "sono andato/a"],
                     ["lei", "ha visto", "è partita"],
                     ["noi", "abbiamo fatto", "siamo arrivati/e"],
                     ["loro", "hanno detto", "sono usciti/e"]]},
  "ex": [["*Ho mangiato* bene.", "Comí bien."],
         ["Anna *è partita* ieri.", "Ana se fue ayer."],
         ["*Hanno detto* di sì.", "Dijeron que sí."]],
  "warn": "Irregulares de memoria: *fatto, detto, visto, preso, messo, scritto, "
          "letto, venuto, stato*."},

 {"h": "Reflexivos e imperativo",
  "r": "Pronombre reflexivo **delante** del verbo: *mi alzo*. En el "
       "imperativo de *tu*, **pegado**: *alzati!*; en negativo, *non* + "
       "infinitivo.",
  "ex": [["*Mi alzo* alle sette.", "Me levanto a las siete."],
         ["*Alzati*, è tardi!", "¡Levantate, es tarde!"],
         ["*Non parlare*!", "¡No hables!"],
         ["*Dimmi*!", "¡Decime!"]]},

 {"h": "Las cinco trampas del hispanohablante",
  "q": [{"prompt": "¿Cuál está bien? «Estudio italiano desde hace dos años.»", "answer": "Studio italiano da due anni.", "options": ["Studio italiano da due anni.", "Ho studiato italiano da due anni.", "Studio italiano fa due anni."]}, {"prompt": "¿Cuál está bien? «Mi libro es nuevo.»", "answer": "Il mio libro è nuovo.", "options": ["Il mio libro è nuovo.", "Mio libro è nuovo.", "Mi libro è nuovo."]}],
  "r": "Repasalas antes del examen: son las que más puntos cuestan.",
  "ex": [["*posso*, *dormo*, penso", "1. No diptongar."],
         ["*PAR*lano, *A*bitano", "2. loro: acento en la raíz."],
         ["*il mio* libro", "3. Artículo con el posesivo."],
         ["*Vedo Marco*.", "4. Sin «a» ante el objeto directo."],
         ["Studio *da* due anni.", "5. Presente + da para lo que sigue."]]},
]},

}
