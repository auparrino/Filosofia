/* Tramo C1: generado por tools/lib/build_tramo.js a partir de tools/it/tramo/.
   No editar a mano: editá los JSON de cada semana y corré npm run build. */
(function (root) {
  "use strict";
  root.TRAMO_DATA = {
 "series": {
  "id": "lunga",
  "name": "Letture lunghe",
  "emoji": "📰",
  "blurb": "De la semana 27 en adelante, un texto largo por semana (de 350 a 900 palabras) de un género real, con preguntas en italiano como en el CILS y el CELI."
 },
 "names": {
  "ascolto": "Ascolti lunghi",
  "breve": "Ascolti brevi"
 },
 "GENRES": {
  "lettera_formale": {
   "name": "Lettera formale",
   "paragraphs": 3,
   "open": [
    "\\b(gentile|gentili|egregio|egregia|spettabile|spett\\.le|alla cortese attenzione|all'attenzione)\\b"
   ],
   "close": [
    "\\b(distinti saluti|cordiali saluti|in attesa di un suo|in attesa di un vostro|la ringrazio|vi ringrazio|porgo|con osservanza)"
   ],
   "openHint": "Gentile…, Egregio…, Spettabile…",
   "closeHint": "Distinti saluti, In attesa di un Suo riscontro…",
   "hint": "Registro formale con il Lei: apertura, motivo della lettera, sviluppo, richiesta concreta, chiusura e firma."
  },
  "email_informale": {
   "name": "E-mail informale",
   "paragraphs": 3,
   "open": [
    "\\b(cara|caro|care|cari|ciao|carissim[aoie])\\b"
   ],
   "close": [
    "\\b(un abbraccio|a presto|baci|un bacio|ciao|fammi sapere|ti abbraccio|a prestissimo|un saluto)\\b"
   ],
   "openHint": "Caro…, Ciao…",
   "closeHint": "Un abbraccio, A presto…",
   "hint": "Registro informale con il tu, ma con paragrafi ordinati: saluto, motivo, sviluppo, saluto finale."
  },
  "lettera_lettore": {
   "name": "Lettera al giornale",
   "paragraphs": 3,
   "open": [
    "\\b(gentile|egregio|egregia|cara redazione|spettabile|caro direttore|cara direttrice|gentile direttore|gentile redazione)\\b"
   ],
   "close": [
    "\\b(distinti saluti|cordiali saluti|cordialmente|un lettore|una lettrice|grazie per l'attenzione|ringrazio)"
   ],
   "openHint": "Gentile direttore, Cara redazione…",
   "closeHint": "Cordiali saluti + firma",
   "hint": "Si risponde a un articolo: citarlo, prendere posizione, argomentare, chiudere con una proposta."
  },
  "articolo": {
   "name": "Articolo",
   "paragraphs": 3,
   "title": true,
   "hint": "Titolo nella prima riga; attacco che catturi il lettore, sviluppo con dati del testo o dell'ascolto, chiusura."
  },
  "recensione": {
   "name": "Recensione",
   "paragraphs": 3,
   "title": true,
   "hint": "Titolo; di che cosa si tratta, punti forti e deboli con esempi, giudizio finale e a chi la consiglieresti."
  },
  "saggio": {
   "name": "Testo argomentativo",
   "paragraphs": 4,
   "hint": "Introduzione con la tesi, almeno due argomenti con esempi, un'obiezione con la sua risposta, conclusione."
  },
  "sintesi": {
   "name": "Sintesi",
   "paragraphs": 3,
   "hint": "Le idee principali con parole tue, nell'ordine logico, senza opinioni personali e senza copiare frasi intere."
  },
  "relazione": {
   "name": "Relazione",
   "paragraphs": 3,
   "title": true,
   "hint": "Titolo; premessa (di che cosa si parla e perché), esposizione ordinata dei fatti, conclusioni o proposte. Registro impersonale."
  }
 },
 "CONNETTIVI": [
  "tuttavia",
  "pertanto",
  "sebbene",
  "benché",
  "nonostante",
  "in primo luogo",
  "in secondo luogo",
  "d'altra parte",
  "d'altronde",
  "in conclusione",
  "per concludere",
  "in altre parole",
  "ad esempio",
  "per esempio",
  "inoltre",
  "invece",
  "infatti",
  "quindi",
  "dunque",
  "anzitutto",
  "innanzitutto",
  "infine",
  "insomma",
  "purché",
  "affinché",
  "poiché",
  "dato che",
  "visto che",
  "mentre",
  "eppure",
  "comunque",
  "in effetti",
  "in sintesi",
  "di conseguenza",
  "a patto che",
  "oltre a",
  "rispetto a",
  "al contrario"
 ],
 "SETTIMANE": [
  {
   "week": 27,
   "level": "B2",
   "lettura": {
    "title": "Lo struscio: la passeggiata che resiste",
    "emoji": "🚶",
    "genre": "reportage",
    "grammar": "avverbi in -mente e posizione degli avverbi",
    "text": "Alle sette di sera, puntualmente, la piazza di Casalbianco, un paese di novemila abitanti nel Salento, cambia volto. Le serrande dei negozi si alzano di nuovo, i bar sistemano lentamente i tavolini e, quasi improvvisamente, la gente comincia a camminare. Non va da nessuna parte, o meglio: va avanti e indietro lungo il corso, sempre sullo stesso chilometro. Qui lo chiamano «struscio», e chi arriva da una grande città lo guarda generalmente con un misto di curiosità e di ironia.\n\nEppure lo struscio non è semplicemente un'abitudine da paese. È, in fondo, un rito sociale molto preciso. «Si esce per vedere e per farsi vedere», spiega sorridendo Rosaria, sessantadue anni, che lo fa regolarmente da quando era ragazzina. «Una volta le ragazze camminavano rigorosamente in gruppo e le madri controllavano attentamente da lontano. Oggi è tutto più libero, ma il senso è rimasto lo stesso: sapere chi c'è, chi è tornato, chi si è fidanzato.»\n\nNegli ultimi anni, infatti, la passeggiata serale è cambiata profondamente. I giovani, che d'inverno vivono quasi tutti a Bologna, a Milano o all'estero, tornano d'estate e la riscoprono con un piacere quasi nostalgico. Luca, ventisei anni, ingegnere a Torino, ammette francamente che in città gli manca proprio questo: «Lì esci solo se hai un appuntamento. Qui esci e basta, e sicuramente incontri qualcuno.» Paradossalmente, sono proprio quelli che sono partiti a difendere più appassionatamente una tradizione che da ragazzi trovavano noiosa.\n\nNon tutti, naturalmente, sono così entusiasti. Il parroco, don Franco, osserva con una certa amarezza che lo struscio è diventato anche una vetrina: «Una volta ci si vestiva semplicemente in modo decente. Ora molti passeggiano soprattutto per fotografarsi.» E in effetti basta guardarsi intorno: tra un gelato e un saluto, i telefoni sono costantemente accesi. Il rito, però, si adatta velocemente: una storia su Instagram non sostituisce l'incontro, ma lo prolunga.\n\nVerso le dieci la piazza si svuota gradualmente. Gli anziani si siedono sulle panchine e commentano tranquillamente la serata, i ragazzi si spostano verso il lungomare, i bar abbassano le luci. Domani, probabilmente, sarà tutto uguale. Ed è forse questo il segreto dello struscio: in un Paese che cambia rapidamente, e spesso in modo disordinato, offre ogni sera la certezza di un posto in cui tutti, almeno per un'ora, si riconoscono.",
    "gloss": {
     "basta": "(basta guardarsi intorno) alcanza con mirar alrededor; (esci e basta) salís y listo",
     "meglio": "(o meglio) mejor dicho",
     "vestiva": "(ci si vestiva) uno se vestía, la gente se vestía: *ci si* es el *si* impersonal con un verbo reflexivo (semana 36)",
     "cui": "(in cui, con cui…) en el que, con el que: *cui* es el relativo después de preposición (semana 34)",
     "serrande": "persianas metálicas (de los negocios)",
     "tavolini": "mesitas",
     "struscio": "paseo lento por la calle principal",
     "corso": "calle principal del pueblo",
     "ragazzina": "piba, nena",
     "rigorosamente": "estrictamente",
     "fidanzato": "(se) puso de novio",
     "riscoprono": "redescubren",
     "ammette": "admite",
     "manca": "(le) falta, (él) extraña",
     "appuntamento": "cita, encuentro arreglado",
     "noiosa": "aburrida",
     "parroco": "cura párroco",
     "amarezza": "amargura",
     "vetrina": "vidriera",
     "accesi": "prendidos",
     "prolunga": "prolonga, estira",
     "svuota": "vacía",
     "panchine": "bancos de plaza",
     "lungomare": "costanera",
     "abbassano": "bajan",
     "disordinato": "desordenado",
     "riconoscono": "(se) reconocen"
    },
    "questions": [
     [
      "Qual è lo scopo principale del reportage?",
      [
       "Criticare i giovani che lasciano il Sud",
       "Descrivere un rito sociale e come cambia",
       "Promuovere il turismo estivo nel Salento",
       "Raccontare la storia della parrocchia"
      ],
      "Descrivere un rito sociale e come cambia"
     ],
     [
      "Secondo Rosaria, che cosa è rimasto uguale rispetto al passato?",
      [
       "L'obbligo per le ragazze di uscire in gruppo",
       "Il controllo delle madri sulle figlie",
       "La voglia di sapere cosa succede agli altri",
       "L'abitudine di vestirsi in modo elegante"
      ],
      "La voglia di sapere cosa succede agli altri"
     ],
     [
      "Che cosa trova paradossale l'autore riguardo ai giovani partiti?",
      [
       "Non partecipano più allo struscio d'estate",
       "Vorrebbero portare lo struscio in città",
       "Difendono un rito che prima trovavano noioso",
       "Preferiscono il lungomare alla piazza"
      ],
      "Difendono un rito che prima trovavano noioso"
     ],
     [
      "Che cosa intende l'autore con «una storia su Instagram non sostituisce l'incontro, ma lo prolunga»?",
      [
       "I social stanno distruggendo la tradizione del paese",
       "I social continuano l'incontro, non lo cancellano",
       "Le foto servono a chi non c'era",
       "I giovani preferiscono vedersi online"
      ],
      "I social continuano l'incontro, non lo cancellano"
     ],
     [
      "Secondo la conclusione, qual è il valore dello struscio?",
      [
       "Attira turisti nella stagione estiva",
       "Aiuta i commercianti a vendere di sera",
       "Conserva le regole morali e religiose di una volta",
       "Dà stabilità e comunità in tempi incerti"
      ],
      "Dà stabilità e comunità in tempi incerti"
     ]
    ],
    "vf": [
     [
      "Lo struscio si svolge sempre sullo stesso tratto di strada.",
      "vero"
     ],
     [
      "Rosaria ha cominciato a fare lo struscio da adulta.",
      "falso"
     ],
     [
      "Luca pensa di tornare a vivere a Casalbianco.",
      "non si dice"
     ],
     [
      "Don Franco approva il modo in cui si passeggia oggi.",
      "falso"
     ],
     [
      "Il bar principale della piazza resta aperto fino a mezzanotte.",
      "non si dice"
     ]
    ],
    "hunt": {
     "label": "Tocá los adverbios en -mente",
     "targets": [
      "puntualmente",
      "lentamente",
      "improvvisamente",
      "generalmente",
      "semplicemente",
      "regolarmente",
      "rigorosamente",
      "attentamente",
      "profondamente",
      "francamente",
      "paradossalmente",
      "appassionatamente",
      "naturalmente",
      "costantemente",
      "velocemente",
      "gradualmente",
      "tranquillamente",
      "probabilmente",
      "rapidamente",
      "sicuramente"
     ]
    }
   },
   "ascolto": {
    "title": "Il bar, salotto degli italiani",
    "genre": "intervista radiofonica",
    "es": "Un conductor de radio entrevista a una socióloga que escribió un libro sobre el bar italiano y lo que representa en la vida social.",
    "speakers": [
     "Conduttore",
     "Marta Ferri, sociologa"
    ],
    "turns": [
     [
      "A",
      "Buongiorno a tutti e bentornati. Oggi parliamo di un luogo che frequentiamo quasi quotidianamente, spesso senza pensarci: il bar. Con noi c'è Marta Ferri, sociologa, che ha appena pubblicato un libro proprio su questo. Buongiorno, professoressa."
     ],
     [
      "B",
      "Buongiorno, e grazie dell'invito."
     ],
     [
      "A",
      "Allora, partiamo dall'inizio: perché studiare il bar? Sembra un argomento, diciamo, leggero."
     ],
     [
      "B",
      "Sembra, appunto. In realtà il bar italiano è un posto socialmente importantissimo. Pensi al caffè al banco: si beve velocemente, in piedi, in due minuti. Eppure in quei due minuti si scambiano notizie, battute, lamentele sul governo, sul tempo, sulla squadra di calcio."
     ],
     [
      "A",
      "Cioè, è una specie di piazza al chiuso?"
     ],
     [
      "B",
      "Esatto, una piazza al chiuso. E, cosa interessante, è uno dei pochi posti dove persone molto diverse stanno fisicamente vicine: l'avvocato accanto al muratore, lo studente accanto al pensionato."
     ],
     [
      "A",
      "Però i bar tradizionali stanno chiudendo, no? Almeno così si sente dire."
     ],
     [
      "B",
      "Guardi, bisogna parlarne onestamente. Molti bar di quartiere hanno chiuso, è vero, soprattutto nei piccoli centri. Al loro posto arrivano catene, caffetterie moderne dove la gente sta seduta per ore davanti al computer. Non è necessariamente un male, ma è un'altra cosa."
     ],
     [
      "A",
      "In che senso un'altra cosa?"
     ],
     [
      "B",
      "Nel senso che lì si sta insieme, ma separatamente. Ognuno con le sue cuffie, il suo schermo. Il barista tradizionale, invece, ti conosce personalmente, sa come prendi il caffè, ti chiede di tua madre."
     ],
     [
      "A",
      "Quindi lei è pessimista."
     ],
     [
      "B",
      "No, no, assolutamente. Sono realista. Ho visto ragazzi che aprono bar nuovi con un'idea vecchia: il bancone, due chiacchiere, i prezzi onesti. E funzionano benissimo. La gente, insomma, ha ancora bisogno di un posto dove qualcuno la saluti per nome."
     ],
     [
      "A",
      "Bellissima chiusura. Grazie, professoressa Ferri."
     ]
    ],
    "gloss": {
     "chiede": "(ti chiede di tua madre) te pregunta por tu mamá: *chiedere di* alguien = preguntar por",
     "chiuso": "(al chiuso) bajo techo, puertas adentro",
     "banco": "barra (del bar)",
     "battute": "chistes, comentarios",
     "lamentele": "quejas",
     "muratore": "albañil",
     "pensionato": "jubilado",
     "quartiere": "barrio",
     "catene": "cadenas (de negocios)",
     "cuffie": "auriculares",
     "bancone": "mostrador",
     "chiacchiere": "charla"
    },
    "questions": [
     [
      "Perché la sociologa risponde «Sembra, appunto»?",
      [
       "Per ammettere che il suo libro è poco scientifico",
       "Per dire che il tema è più serio di come appare",
       "Per correggere il titolo del suo libro",
       "Per dire che il bar è un tema di moda"
      ],
      "Per dire che il tema è più serio di come appare"
     ],
     [
      "Che cosa rende speciale il bar secondo Ferri?",
      [
       "Offre il caffè più economico d'Europa",
       "È il luogo dove si lavora meglio",
       "Mette vicine persone di ceti diversi",
       "È frequentato soprattutto da anziani"
      ],
      "Mette vicine persone di ceti diversi"
     ],
     [
      "Che cosa pensa Ferri delle nuove caffetterie?",
      [
       "Sono la causa della crisi dei bar",
       "Non sono negative, ma sono diverse",
       "Sono più accoglienti e piacevoli dei bar",
       "Spariranno molto presto"
      ],
      "Non sono negative, ma sono diverse"
     ],
     [
      "Che cosa significa «si sta insieme, ma separatamente»?",
      [
       "Si arriva insieme ma si paga separati",
       "Si parla, ma di argomenti diversi",
       "Si condivide lo spazio senza interagire",
       "Ci si siede a tavoli lontani"
      ],
      "Si condivide lo spazio senza interagire"
     ],
     [
      "Qual è l'atteggiamento finale della sociologa?",
      [
       "Realista, con motivi di speranza",
       "Profondamente pessimista",
       "Nostalgica e contraria alle novità",
       "Indifferente al destino dei bar"
      ],
      "Realista, con motivi di speranza"
     ]
    ],
    "vf": [
     [
      "Marta Ferri ha scritto un libro sul bar.",
      "vero"
     ],
     [
      "Secondo Ferri, i bar di quartiere non stanno chiudendo.",
      "falso"
     ],
     [
      "Il libro di Ferri è stato tradotto in altre lingue.",
      "non si dice"
     ],
     [
      "Secondo Ferri, alcuni bar nuovi di stile tradizionale funzionano bene.",
      "vero"
     ]
    ]
   },
   "compito": {
    "genre": "lettera_lettore",
    "title": "Lettera al giornale sullo struscio",
    "fonte": "lettura",
    "t": "Hai letto sul giornale il reportage «Lo struscio: la passeggiata che resiste». Scrivi una lettera alla redazione (120-180 parole, registro formale ma personale) in cui commenti il reportage, racconti un rito simile della tua città o del tuo Paese e dici se sei d'accordo con la conclusione dell'autore. Usa alcuni avverbi in -mente.",
    "es": "Carta de lector al diario: comentá el reportaje, contá una costumbre parecida de tu lugar y opiná sobre la conclusión. Cuidá el saludo formal y la firma.",
    "min": 120,
    "max": 180,
    "punti": [
     [
      "comentar el reportaje",
      [
       "reportage",
       "articolo",
       "struscio"
      ]
     ],
     [
      "contar un ritual parecido de tu ciudad o país",
      [
       "mia città",
       "mio paese",
       "da noi",
       "argentina"
      ]
     ],
     [
      "opinar sobre la conclusión del autor",
      [
       "d'accordo",
       "conclusione",
       "secondo me",
       "credo"
      ]
     ],
     [
      "saludo formal y despedida",
      [
       "gentile",
       "cara redazione",
       "spettabile",
       "cordiali saluti",
       "distinti saluti"
      ]
     ]
    ],
    "model": "Gentile Redazione,\n\nho letto con grande piacere il reportage sullo struscio di Casalbianco e, sinceramente, mi sono commosso. Sono argentino, vivo a Bologna da due anni, e leggendo l'articolo ho pensato immediatamente alla mia città, Rosario.\n\nDa noi non si chiama struscio, ma il rito è molto simile: la domenica pomeriggio le famiglie camminano lentamente lungo il fiume, bevono il mate, si fermano a salutare i vicini. Nessuno ha fretta e nessuno va veramente da qualche parte.\n\nSono completamente d'accordo con la conclusione dell'autore: in un mondo che cambia così rapidamente, abbiamo bisogno di luoghi dove riconoscerci. Aggiungerei solo una cosa: non credo che i telefoni siano il vero pericolo. Il pericolo è la fretta, che ci impedisce di perdere tempo insieme.\n\nGrazie per questo bel pezzo, che mi ha fatto sentire un po' meno lontano da casa.\n\nCordiali saluti,\nMartín Paredes, Bologna",
    "gloss": {
     "Da noi": "en mi país, entre nosotros (da + pronombre = en lo de, en casa de)",
     "riconoscerci": "reconocernos",
     "bel pezzo": "lindo artículo, linda nota (pezzo = texto periodístico)",
     "mi ha fatto sentire": "me hizo sentir (fare + infinitivo, el causativo: se ve en la semana 40)"
    }
   },
   "breve": {
    "title": "Radio Salento, il notiziario della sera",
    "genre": "notiziario radiofonico",
    "es": "El boletín de noticias de una radio local del Salento: tránsito, cultura, trenes y el tiempo.",
    "speaker": "Speaker",
    "voice": 0,
    "text": [
     "Radio Salento, sono le diciannove. Ecco le notizie della sera, in breve.",
     "Casalbianco. Da domani e fino al 31 agosto il corso Vittorio Emanuele sarà chiuso al traffico dalle 18 a mezzanotte. Il sindaco spiega che il Comune ha deciso così soprattutto per la sicurezza di chi passeggia la sera. I negozi del corso potranno restare aperti fino alle 23.",
     "Lecce. Riapre finalmente il teatro Apollo, chiuso da due anni per lavori. Il primo spettacolo è in programma sabato alle 21; i biglietti costano dodici euro, sei per gli studenti.",
     "Trasporti. Da lunedì il treno delle sette e dieci per Bari partirà regolarmente alle sette e cinque, cioè cinque minuti prima. Le Ferrovie invitano i viaggiatori a controllare attentamente gli orari sul sito.",
     "Il tempo. Domani cielo sereno su tutta la provincia, con temperature fino a trentaquattro gradi. Il vento, debole, girerà lentamente verso sud nel pomeriggio.",
     "Il prossimo notiziario è alle ventuno. Buona serata."
    ],
    "tabella": [
     [
      "Il corso è chiuso al traffico dalle ore…",
      "18",
      [
       "diciotto",
       "18:00",
       "18.00"
      ]
     ],
     [
      "Prezzo del biglietto per gli studenti (euro)",
      "6",
      [
       "sei",
       "6 euro",
       "sei euro"
      ]
     ],
     [
      "Nuovo orario del treno per Bari",
      "7.05",
      [
       "7:05",
       "7,05",
       "sette e cinque",
       "7 e 5",
       "7 e cinque"
      ]
     ],
     [
      "Temperatura massima di domani (gradi)",
      "34",
      [
       "trentaquattro"
      ]
     ]
    ],
    "info": [
     [
      "Il corso resterà chiuso al traffico anche di giorno.",
      false
     ],
     [
      "I negozi del corso potranno restare aperti più a lungo.",
      true
     ],
     [
      "Il teatro Apollo era chiuso per lavori.",
      true
     ],
     [
      "Lo spettacolo di sabato è gratuito per gli studenti.",
      false
     ],
     [
      "Il treno per Bari partirà cinque minuti prima.",
      true
     ],
     [
      "Domani è prevista pioggia nel pomeriggio.",
      false
     ]
    ],
    "gloss": {
     "corso": "calle principal",
     "spettacolo": "función, espectáculo",
     "debole": "débil, suave"
    }
   }
  },
  {
   "week": 28,
   "level": "B2",
   "lettura": {
    "title": "Borghi, la seconda vita è possibile?",
    "emoji": "🏘️",
    "genre": "articolo d'opinione",
    "grammar": "connettivi e transizioni",
    "text": "Da qualche anno i giornali di mezzo mondo raccontano la stessa storia: un paesino italiano, arroccato su una collina, mette in vendita le sue case abbandonate a un euro. Le immagini sono irresistibili: vicoli di pietra, panorami sul mare o sulle montagne, anziani seduti davanti alla chiesa. Di conseguenza, migliaia di stranieri scrivono ai municipi, sognando una nuova vita tra ulivi e campanili. Eppure, a distanza di tempo, vale la pena chiedersi che cosa sia rimasto di tanto entusiasmo.\n\nInnanzitutto, bisogna chiarire un equivoco. La casa a un euro non costa un euro. Anzi, chi la compra si impegna di solito a ristrutturarla entro pochi anni, e i lavori possono costare decine di migliaia di euro. Inoltre, molti edifici sono in condizioni tali che converrebbe quasi demolirli. Non a caso, una parte degli acquirenti ha rinunciato dopo il primo sopralluogo.\n\nD'altra parte, sarebbe ingiusto parlare di un fallimento. In alcuni borghi le iniziative hanno davvero riportato un po' di vita: una coppia olandese ha aperto un piccolo albergo, un'artista americana organizza corsi estivi, qualche famiglia italiana è tornata dalla città. Allo stesso modo, la diffusione del lavoro da remoto dopo la pandemia ha reso credibile un'idea che prima sembrava romantica: vivere in un paese di trecento abitanti senza rinunciare a uno stipendio da città.\n\nTuttavia, il problema dei borghi non si risolve con le case. Si risolve, piuttosto, con i servizi. Una famiglia con figli non si trasferisce dove la scuola ha chiuso, dove il medico passa una volta alla settimana e dove l'autobus per il capoluogo parte due volte al giorno. Per questo motivo, molti sindaci ormai dicono chiaramente che il vero investimento non è il cartello «vendesi», bensì la banda larga, l'ambulatorio, il trasporto pubblico.\n\nC'è infine una questione più delicata, cioè che cosa vogliamo che diventino questi paesi. Se si riempiono soltanto di case per le vacanze, abitate due mesi all'anno, rischiano di trasformarsi in cartoline: bellissime, ma vuote. In altre parole, un borgo vive solo se qualcuno ci passa l'inverno.\n\nInsomma, le case a un euro hanno avuto almeno un merito: hanno costretto il Paese a guardare le sue aree interne, che per decenni erano rimaste invisibili. Adesso, però, serve una politica meno spettacolare e più paziente. Altrimenti, finito il clamore, resteranno soltanto le foto.",
    "gloss": {
     "finito": "(finito il clamore) una vez terminado el revuelo: participio solo, sin verbo conjugado (semana 44)",
     "reso": "(ha reso credibile) volvió creíble: *rendere* + adjetivo = volver, hacer; participio *reso*",
     "caso": "(non a caso) no por casualidad",
     "arroccato": "encaramado",
     "vicoli": "callejones",
     "municipi": "municipalidades",
     "ulivi": "olivos",
     "campanili": "campanarios",
     "equivoco": "malentendido",
     "ristrutturarla": "refaccionarla",
     "converrebbe": "convendría",
     "demolirli": "demolerlos",
     "acquirenti": "compradores",
     "sopralluogo": "visita de inspección",
     "fallimento": "fracaso",
     "stipendio": "sueldo",
     "capoluogo": "capital de provincia",
     "sindaci": "intendentes",
     "vendesi": "se vende",
     "bensì": "sino",
     "ambulatorio": "salita, consultorio",
     "cartoline": "postales",
     "costretto": "obligado",
     "clamore": "revuelo"
    },
    "questions": [
     [
      "Qual è la tesi principale dell'autore?",
      [
       "Le case a un euro sono state una truffa per stranieri",
       "Per salvare i borghi servono servizi, non case",
       "I borghi devono puntare sul turismo estivo",
       "Il lavoro da remoto ha già ripopolato i paesi"
      ],
      "Per salvare i borghi servono servizi, non case"
     ],
     [
      "Perché l'autore dice che «la casa a un euro non costa un euro»?",
      [
       "Perché i comuni aggiungono tasse nascoste",
       "Perché obbliga a spendere molto nei lavori",
       "Perché il prezzo reale è stato aumentato dopo",
       "Perché bisogna pagare un intermediario"
      ],
      "Perché obbliga a spendere molto nei lavori"
     ],
     [
      "Qual è la funzione del terzo paragrafo?",
      [
       "Presentare i dati ufficiali dell'iniziativa",
       "Spiegare le cause del fallimento del progetto",
       "Bilanciare la critica con esempi positivi",
       "Raccontare un'esperienza personale dell'autore"
      ],
      "Bilanciare la critica con esempi positivi"
     ],
     [
      "Che cosa intende l'autore con «cartoline: bellissime, ma vuote»?",
      [
       "Paesi famosi solo sui social network",
       "Paesi curati ma senza abitanti tutto l'anno",
       "Paesi restaurati male e senza alcun gusto",
       "Paesi che vivono vendendo souvenir ai turisti"
      ],
      "Paesi curati ma senza abitanti tutto l'anno"
     ],
     [
      "Quale merito riconosce l'autore alle case a un euro?",
      [
       "Aver attirato l'attenzione sulle aree interne",
       "Aver risolto lo spopolamento dei paesi",
       "Aver riportato i giovani nei borghi",
       "Aver fatto guadagnare molto i comuni"
      ],
      "Aver attirato l'attenzione sulle aree interne"
     ]
    ],
    "vf": [
     [
      "Alcuni acquirenti hanno rinunciato dopo aver visto le case.",
      "vero"
     ],
     [
      "Secondo l'autore, l'iniziativa è stata un fallimento completo.",
      "falso"
     ],
     [
      "L'autore ha visitato di persona alcuni borghi.",
      "non si dice"
     ],
     [
      "Molti sindaci ritengono i servizi più importanti delle case in vendita.",
      "vero"
     ],
     [
      "Chi compra una casa a un euro non ha alcun obbligo.",
      "falso"
     ]
    ],
    "hunt": {
     "label": "Tocá los conectores",
     "targets": [
      "eppure",
      "innanzitutto",
      "anzi",
      "inoltre",
      "tuttavia",
      "piuttosto",
      "bensì",
      "cioè",
      "insomma",
      "altrimenti",
      "però",
      "infine"
     ]
    }
   },
   "ascolto": {
    "title": "Partire o restare",
    "genre": "podcast",
    "es": "En un podcast sobre italianos que emigran, la conductora conversa con un biólogo que vive en Berlín desde hace años sobre por qué se fue y si piensa volver.",
    "speakers": [
     "Giulia, conduttrice",
     "Davide, biologo"
    ],
    "turns": [
     [
      "A",
      "Bentornati a «Valigie», il podcast sugli italiani che partono e, qualche volta, tornano. Oggi con me c'è Davide, trentaquattro anni, biologo, che vive a Berlino da sette anni. Ciao Davide."
     ],
     [
      "B",
      "Ciao Giulia, grazie per avermi invitato."
     ],
     [
      "A",
      "Allora, la domanda classica: perché sei partito?"
     ],
     [
      "B",
      "Guarda, la risposta non è romantica. Avevo finito il dottorato a Padova e mi offrivano solo contratti di sei mesi, pagati poco e male. A Berlino, invece, mi hanno proposto un posto di tre anni, con uno stipendio normale. Quindi non è stata una scelta difficile, almeno all'inizio."
     ],
     [
      "A",
      "All'inizio. Vuol dire che poi è diventata difficile?"
     ],
     [
      "B",
      "Sì, cioè, non difficile: complicata. Il lavoro va bene, anzi benissimo. Però a un certo punto ti accorgi che i tuoi genitori invecchiano, che i tuoi amici fanno figli e tu li vedi su WhatsApp. Insomma, paghi un prezzo che non avevi calcolato."
     ],
     [
      "A",
      "C'è chi dice che quelli come te sono una perdita per il Paese. Tu come la vedi?"
     ],
     [
      "B",
      "Mah, in parte è vero: l'Italia spende per formarci e poi il frutto lo raccoglie un altro Paese. D'altra parte, però, non mi sento un disertore. Collaboro con due università italiane, porto studenti a Berlino, faccio da ponte, diciamo."
     ],
     [
      "A",
      "E tornare? Ci pensi?"
     ],
     [
      "B",
      "Ci penso ogni inverno, quando fa buio alle quattro. Scherzi a parte, tornerei se trovassi un posto stabile e un ambiente dove il merito conta davvero. Finora non l'ho trovato. Comunque non escludo niente."
     ],
     [
      "A",
      "Un'ultima cosa: che consiglio daresti a chi sta per partire?"
     ],
     [
      "B",
      "Di partire senza sensi di colpa, ma anche senza tagliare i ponti. Perché, prima o poi, la voglia di casa arriva a tutti."
     ],
     [
      "A",
      "Grazie, Davide. E voi, scriveteci le vostre storie."
     ]
    ],
    "gloss": {
     "vedi": "(tu come la vedi?) ¿vos cómo lo ves?: el *la* no se refiere a nada concreto, es «la cosa»",
     "dottorato": "doctorado",
     "accorgi": "(te) das cuenta",
     "invecchiano": "envejecen",
     "perdita": "pérdida",
     "formarci": "formarnos",
     "raccoglie": "cosecha",
     "disertore": "desertor",
     "ponte": "puente (faccio da ponte: hago de puente; *fare da* = hacer de)",
     "buio": "oscuro, de noche",
     "scherzi": "bromas (scherzi a parte: hablando en serio)",
     "colpa": "culpa (sensi di colpa: culpa)",
     "tagliare": "cortar"
    },
    "questions": [
     [
      "Perché Davide è partito?",
      [
       "Per seguire la compagna in Germania",
       "Per avere un contratto più lungo e pagato meglio",
       "Perché voleva imparare bene il tedesco",
       "Perché a Padova non c'era il suo corso di dottorato"
      ],
      "Per avere un contratto più lungo e pagato meglio"
     ],
     [
      "Che cosa intende con «paghi un prezzo che non avevi calcolato»?",
      [
       "La vita a Berlino è molto più cara di quanto pensasse",
       "Le tasse tedesche sono molto più alte",
       "La lontananza dagli affetti pesa più del previsto",
       "Ha dovuto pagare da solo il trasloco"
      ],
      "La lontananza dagli affetti pesa più del previsto"
     ],
     [
      "Come reagisce Davide all'idea di essere «una perdita per il Paese»?",
      [
       "La rifiuta del tutto e con rabbia",
       "La accetta in parte, ma si sente un ponte",
       "Dice che è colpa delle università italiane",
       "Dice che l'argomento non gli interessa"
      ],
      "La accetta in parte, ma si sente un ponte"
     ],
     [
      "A quali condizioni tornerebbe in Italia?",
      [
       "Uno stipendio più alto di quello tedesco",
       "Un posto vicino alla famiglia a Padova",
       "Un lavoro stabile e un ambiente meritocratico",
       "La direzione di un laboratorio tutto suo"
      ],
      "Un lavoro stabile e un ambiente meritocratico"
     ],
     [
      "Qual è il consiglio finale di Davide?",
      [
       "Non partire se si hanno genitori anziani",
       "Partire solo con un contratto già firmato",
       "Tornare in Italia entro pochi anni",
       "Partire senza colpa, mantenendo i legami"
      ],
      "Partire senza colpa, mantenendo i legami"
     ]
    ],
    "vf": [
     [
      "Davide vive a Berlino da sette anni.",
      "vero"
     ],
     [
      "Davide ha interrotto ogni rapporto con le università italiane.",
      "falso"
     ],
     [
      "Davide parla bene il tedesco.",
      "non si dice"
     ],
     [
      "Davide esclude di tornare in Italia.",
      "falso"
     ]
    ]
   },
   "compito": {
    "genre": "sintesi",
    "title": "Sintesi: i borghi e le case a un euro",
    "fonte": "lettura",
    "t": "Il notiziario di un'associazione culturale italo-argentina ti chiede di riassumere per i soci l'articolo «Borghi, la seconda vita è possibile?». Scrivi una sintesi (126-186 parole, registro neutro) in cui riporti la tesi dell'autore, gli argomenti a favore e contro le case a un euro e la conclusione. Non aggiungere opinioni personali e collega le idee con connettivi adeguati.",
    "es": "Resumen objetivo del artículo: tesis, argumentos a favor y en contra, conclusión. Nada de opinión propia; usá conectores (innanzitutto, tuttavia, inoltre, in conclusione).",
    "min": 126,
    "max": 186,
    "punti": [
     [
      "la tesis del autor (servicios, no casas)",
      [
       "servizi",
       "tesi",
       "secondo l'autore"
      ]
     ],
     [
      "el costo real de las casas",
      [
       "ristruttur",
       "lavori",
       "spes"
      ]
     ],
     [
      "los ejemplos positivos",
      [
       "remoto",
       "positiv",
       "albergo",
       "esempi"
      ]
     ],
     [
      "la conclusión",
      [
       "conclusione",
       "infine",
       "insomma",
       "aree interne"
      ]
     ]
    ],
    "model": "L'articolo analizza il fenomeno delle case vendute a un euro nei piccoli borghi italiani e si chiede se queste iniziative abbiano davvero salvato i paesi dallo spopolamento.\n\nInnanzitutto, l'autore chiarisce che il prezzo simbolico è ingannevole: chi compra deve ristrutturare entro pochi anni, spesso con spese molto alte, e infatti diversi acquirenti hanno rinunciato. Tuttavia, riconosce che in alcuni borghi l'iniziativa ha prodotto risultati positivi, anche grazie alla diffusione del lavoro da remoto, che permette di vivere lontano dalle città.\n\nSecondo l'autore, però, il nodo centrale non sono le case ma i servizi: senza scuole, medici e trasporti nessuna famiglia si trasferisce. Inoltre, se i paesi si riempiono solo di seconde case, rischiano di diventare scenografie vuote.\n\nIn conclusione, l'articolo riconosce alle case a un euro il merito di aver attirato l'attenzione sulle aree interne, ma sostiene che ora servano politiche pazienti e concrete.",
    "gloss": {
     "borghi": "pueblos antiguos, pueblitos históricos",
     "abbiano davvero salvato": "hayan salvado realmente (congiuntivo passato: se ve en la semana 29)",
     "ingannevole": "engañoso",
     "acquirenti": "compradores",
     "il nodo centrale": "el punto clave, el meollo",
     "scenografie vuote": "decorados vacíos, escenografías",
     "aree interne": "las zonas del interior, lejos de la costa y de las ciudades"
    }
   },
   "breve": {
    "title": "Porte aperte a Rocca San Felice",
    "genre": "annuncio radiofonico",
    "es": "Un aviso de radio invita a un pueblo del interior que abre sus casas en venta durante un día.",
    "speaker": "Voce dell'annuncio",
    "voice": 1,
    "text": [
     "Siete stanchi del traffico? Sognate una casa con vista sulle colline? Allora non perdete «Porte aperte a Rocca San Felice», domenica 12 maggio.",
     "Per un giorno intero, dalle dieci alle diciotto, il paese apre al pubblico venti case in vendita nel centro storico. Inoltre, i tecnici del Comune spiegheranno gratuitamente quanto costa ristrutturarle e quali contributi si possono chiedere.",
     "Non solo case, però: a mezzogiorno pranzo in piazza con i prodotti del territorio, a quindici euro; nel pomeriggio, visita guidata al castello e laboratorio del pane per i bambini.",
     "Come arrivare? Dalla stazione di Avellino parte una navetta gratuita ogni ora, a partire dalle nove. Tuttavia i posti sono limitati: è necessario prenotare sul sito del Comune entro venerdì.",
     "Rocca San Felice: trecento abitanti, e c'è posto anche per voi."
    ],
    "tabella": [
     [
      "Case aperte al pubblico (numero)",
      "20",
      [
       "venti"
      ]
     ],
     [
      "Prezzo del pranzo in piazza (euro)",
      "15",
      [
       "quindici"
      ]
     ],
     [
      "Stazione da cui parte la navetta",
      "Avellino",
      [
       "stazione di Avellino"
      ]
     ],
     [
      "Ultimo giorno per prenotare",
      "venerdì",
      [
       "entro venerdì"
      ]
     ]
    ],
    "info": [
     [
      "Le case si possono visitare per un giorno intero.",
      true
     ],
     [
      "I tecnici del Comune si fanno pagare le spiegazioni.",
      false
     ],
     [
      "Nel pomeriggio c'è un'attività per i bambini.",
      true
     ],
     [
      "La navetta dalla stazione costa due euro.",
      false
     ],
     [
      "Il castello si visita con una guida.",
      true
     ],
     [
      "Il paese ha tremila abitanti.",
      false
     ]
    ],
    "gloss": {
     "ristrutturarle": "refaccionarlas",
     "contributi": "subsidios, ayudas",
     "navetta": "combi, lanzadera"
    }
   }
  },
  {
   "week": 29,
   "level": "B2",
   "lettura": {
    "title": "Un anno senza auto in centro: com'è andata?",
    "emoji": "🚲",
    "genre": "editoriale",
    "grammar": "congiuntivo passato",
    "text": "Esattamente un anno fa, il Comune di Valmarina chiudeva al traffico tutto il centro storico, dalle mura fino al porto. Ricordo bene le polemiche di quei giorni: i commercianti parlavano di «suicidio economico», i residenti anziani temevano di restare isolati, e in consiglio comunale qualcuno arrivò a chiedere le dimissioni dell'assessore. Oggi, a dodici mesi di distanza, credo che valga la pena fare un bilancio onesto, senza tifoserie.\n\nCominciamo dai fatti che nessuno contesta. L'aria è migliorata, il rumore è diminuito, e le piazze che prima erano parcheggi sono tornate a essere piazze. Chi passeggia la domenica pomeriggio in via Garibaldi ha l'impressione che la città abbia ritrovato una parte di sé. Mi sembra che anche i più scettici abbiano dovuto ammetterlo, magari a denti stretti.\n\nSul commercio il quadro è più complicato. È vero che alcuni negozi storici hanno chiuso, e non c'è dubbio che i proprietari abbiano vissuto mesi molto difficili. Tuttavia, non sono sicuro che la colpa sia stata soltanto della pedonalizzazione: il commercio al dettaglio è in crisi ovunque, anche nelle città dove le auto circolano liberamente. Al contrario, bar, gelaterie e librerie sembrano aver approfittato della nuova situazione; pare che alcuni abbiano perfino assunto personale.\n\nIl punto debole, a mio parere, è stato un altro. Temo che l'amministrazione abbia sottovalutato le persone che il centro lo abitano, e non solo lo attraversano. Gli anziani che non guidano più, e che avevano bisogno del figlio in macchina per andare dal medico, si sono trovati all'improvviso in difficoltà. È un peccato che nessuno abbia pensato prima a un servizio di navette elettriche, che è arrivato solo a marzo, dopo mesi di proteste.\n\nResta poi la questione dei parcheggi di cintura. Il progetto prometteva tre grandi aree di sosta collegate al centro da autobus frequenti; finora ne è stata aperta una sola. Non capisco come mai il Comune non abbia rispettato i tempi, e mi dispiace che i cittadini abbiano dovuto scoprirlo da soli, girando per mezz'ora in cerca di un posto.\n\nInsomma, penso che alcune critiche siano state esagerate e altre fondate, e che la decisione sia stata giusta, ma applicata con troppa fretta. Una città più vivibile non si costruisce con un'ordinanza, bensì ascoltando chi ci vive. Speriamo che, nel secondo anno, qualcuno a Palazzo lo abbia capito.",
    "gloss": {
     "abitano": "(le persone che il centro lo abitano) la gente que vive en el centro: el *lo* repite *il centro*, adelantado para destacarlo (semana 48)",
     "arrivò": "(arrivò a chiedere) llegó a pedir: *passato remoto*, el pretérito de los textos escritos (semana 37)",
     "mura": "murallas",
     "polemiche": "polémicas",
     "commercianti": "comerciantes",
     "dimissioni": "renuncia (a un cargo)",
     "assessore": "funcionario municipal a cargo de un área",
     "bilancio": "balance",
     "tifoserie": "hinchadas, fanatismos",
     "scettici": "escépticos",
     "denti": "dientes (a denti stretti: a regañadientes)",
     "dettaglio": "(al dettaglio) minorista",
     "approfittato": "aprovechado",
     "assunto": "contratado",
     "sottovalutato": "subestimado",
     "guidano": "manejan",
     "peccato": "lástima",
     "navette": "combis de traslado",
     "cintura": "cinturón (parcheggi di cintura: estacionamientos en las afueras)",
     "sosta": "estacionamiento",
     "fondate": "fundadas",
     "ordinanza": "ordenanza",
     "palazzo": "(a Palazzo) en la municipalidad"
    },
    "questions": [
     [
      "Qual è l'intenzione principale dell'autore?",
      [
       "Chiedere che il centro venga riaperto alle auto",
       "Fare un bilancio equilibrato del primo anno",
       "Difendere l'assessore dalle critiche",
       "Raccontare la storia del centro di Valmarina"
      ],
      "Fare un bilancio equilibrato del primo anno"
     ],
     [
      "Secondo l'autore, la chiusura di alcuni negozi storici…",
      [
       "è stata causata dalle navette elettriche",
       "è una notizia falsa diffusa dai commercianti",
       "non dipende solo dalla pedonalizzazione",
       "è compensata da molti negozi nuovi in via Garibaldi"
      ],
      "non dipende solo dalla pedonalizzazione"
     ],
     [
      "Qual è stato, per l'autore, l'errore principale del Comune?",
      [
       "Non aver ascoltato le associazioni dei commercianti",
       "Aver chiuso il centro durante l'inverno",
       "Non aver pensato ai residenti che non guidano",
       "Aver speso troppo denaro per le navette"
      ],
      "Non aver pensato ai residenti che non guidano"
     ],
     [
      "Nel testo, «a denti stretti» significa…",
      [
       "con entusiasmo",
       "controvoglia",
       "in silenzio",
       "pubblicamente"
      ],
      "controvoglia"
     ],
     [
      "Che cosa rimprovera l'autore al Comune sui parcheggi?",
      [
       "Di averli costruiti troppo lontani dal porto",
       "Di aver aumentato le tariffe della sosta",
       "Di averli riservati soltanto ai residenti",
       "Di non aver rispettato i tempi promessi"
      ],
      "Di non aver rispettato i tempi promessi"
     ]
    ],
    "vf": [
     [
      "Oggi l'aria del centro è più pulita di un anno fa.",
      "vero"
     ],
     [
      "Il servizio di navette è partito insieme alla chiusura del centro.",
      "falso"
     ],
     [
      "L'assessore ha dato le dimissioni.",
      "non si dice"
     ],
     [
      "Delle tre aree di sosta promesse ne è stata aperta una.",
      "vero"
     ],
     [
      "L'autore è contrario alla pedonalizzazione.",
      "falso"
     ]
    ],
    "hunt": {
     "label": "Tocá los auxiliares del congiuntivo passato",
     "targets": [
      "abbia",
      "abbiano",
      "sia",
      "siano"
     ]
    }
   },
   "ascolto": {
    "title": "Botta e risposta sulla zona pedonale",
    "genre": "dibattito radiofonico",
    "es": "En un programa de radio de Valmarina, un comerciante del centro y una urbanista discuten sobre el primer año del centro peatonal.",
    "speakers": [
     "Ernesto Galli, commerciante",
     "Paola Rinaldi, urbanista"
    ],
    "turns": [
     [
      "A",
      "Comincio io, se la professoressa Rinaldi è d'accordo. Ho un negozio di scarpe in via Garibaldi da trent'anni. E le dico francamente: quest'anno ho perso quasi un terzo dei clienti."
     ],
     [
      "B",
      "Mi dispiace davvero, signor Galli. Ma lei è sicuro che li abbia persi per colpa della zona pedonale? Voglio dire, anche le vendite online sono cresciute moltissimo."
     ],
     [
      "A",
      "Guardi, non sono ingenuo, lo so che c'è internet. Però i miei clienti erano soprattutto persone dei paesi vicini, che venivano in macchina il sabato. Adesso non vengono più. Me l'hanno detto loro, non me lo invento."
     ],
     [
      "B",
      "Questo è un dato importante, e credo che il Comune abbia sbagliato a non considerarlo. Però mi permetta: nelle città europee che hanno chiuso il centro, dopo un periodo difficile, il commercio si è ripreso. Ci vogliono due, tre anni."
     ],
     [
      "A",
      "Due, tre anni! E nel frattempo io come pago l'affitto? Con le statistiche europee?"
     ],
     [
      "B",
      "No, ha ragione, ed è per questo che servivano aiuti per la transizione. Sgravi sulle tasse locali, per esempio, o un servizio di consegna a domicilio organizzato dal Comune."
     ],
     [
      "A",
      "Ecco, questo lo chiediamo da mesi. Mi pare strano che nessuno ci abbia mai risposto."
     ],
     [
      "B",
      "Anche a me. Ma, se posso, vorrei dire una cosa ai suoi colleghi: il centro non tornerà com'era. Chi si adatta, chi punta sulla qualità, sul rapporto personale, secondo me ce la fa."
     ],
     [
      "A",
      "Sì, però adattarsi a sessant'anni non è facile. Comunque su una cosa sono d'accordo con lei: i parcheggi fuori dalle mura andavano fatti prima, non dopo."
     ],
     [
      "B",
      "Su questo, guardi, siamo d'accordo al cento per cento. E spero che al Comune qualcuno ci stia ascoltando."
     ]
    ],
    "gloss": {
     "andavano": "(andavano fatti prima) tenían que hacerse antes: *andare* + participio = tener que ser hecho (semana 35)",
     "ripreso": "recuperado",
     "frattempo": "(nel frattempo) mientras tanto",
     "affitto": "alquiler",
     "sgravi": "rebajas (de impuestos)",
     "consegna": "entrega, envío",
     "domicilio": "(a domicilio) a domicilio",
     "punta": "apuesta (por)",
     "fa": "(ce la fa) lo logra",
     "mura": "murallas"
    },
    "questions": [
     [
      "Secondo Ernesto, perché ha perso clienti?",
      [
       "Per la concorrenza dei centri commerciali",
       "Perché l'affitto del negozio è aumentato",
       "Perché chi veniva in auto dai paesi non viene più",
       "Per il calo del turismo in città"
      ],
      "Perché chi veniva in auto dai paesi non viene più"
     ],
     [
      "Come reagisce Paola al primo intervento di Ernesto?",
      [
       "Gli dà ragione senza alcuna riserva",
       "Dubita che la colpa sia solo della zona pedonale",
       "Lo accusa di non sapersi adattare ai tempi",
       "Propone di riaprire il centro il sabato"
      ],
      "Dubita che la colpa sia solo della zona pedonale"
     ],
     [
      "Che cosa propone Paola per aiutare i negozi?",
      [
       "Sgravi fiscali e consegne a domicilio",
       "Parcheggi gratuiti in via Garibaldi",
       "Contributi per aprire un negozio online",
       "La chiusura della zona pedonale nei festivi"
      ],
      "Sgravi fiscali e consegne a domicilio"
     ],
     [
      "Che tono ha Ernesto quando dice «Con le statistiche europee?»",
      [
       "Entusiasta",
       "Ironico",
       "Rassegnato",
       "Indifferente"
      ],
      "Ironico"
     ],
     [
      "Su che cosa sono d'accordo alla fine?",
      [
       "Il centro deve tornare com'era prima",
       "Il Comune ha fatto tutto nel modo giusto",
       "I parcheggi esterni andavano fatti prima",
       "Chi ha sessant'anni dovrebbe chiudere"
      ],
      "I parcheggi esterni andavano fatti prima"
     ]
    ],
    "vf": [
     [
      "Ernesto ha un negozio di scarpe da trent'anni.",
      "vero"
     ],
     [
      "Paola sostiene che il commercio non si riprenderà mai.",
      "falso"
     ],
     [
      "Il Comune ha già risposto alle richieste dei commercianti.",
      "falso"
     ],
     [
      "Ernesto pensa di chiudere il negozio entro l'anno.",
      "non si dice"
     ]
    ]
   },
   "compito": {
    "genre": "saggio",
    "title": "Chiudere i centri storici alle auto: una scelta giusta?",
    "fonte": "entrambi",
    "t": "Hai letto l'editoriale sul primo anno del centro pedonale di Valmarina e hai ascoltato il confronto radiofonico tra un commerciante e un'urbanista. Scrivi un breve saggio (131-191 parole, registro formale) dal titolo «Chiudere i centri storici alle auto: una scelta giusta?», in cui presenti i principali argomenti delle due fonti, esprimi la tua posizione e proponi almeno una soluzione concreta. Usa il congiuntivo passato per valutare le decisioni già prese.",
    "es": "Ensayo breve con título: argumentos de las dos fuentes, tu postura y una propuesta. Usá congiuntivo passato para juzgar lo que ya pasó (credo che il Comune abbia sbagliato…).",
    "min": 131,
    "max": 191,
    "punti": [
     [
      "las ventajas (aire, ruido, plazas)",
      [
       "aria",
       "rumore",
       "piazze",
       "vivibil"
      ]
     ],
     [
      "los problemas de comerciantes y residentes",
      [
       "commerci",
       "negoz",
       "anzian",
       "residenti"
      ]
     ],
     [
      "tu postura",
      [
       "a mio parere",
       "secondo me",
       "credo",
       "ritengo",
       "penso"
      ]
     ],
     [
      "una propuesta concreta",
      [
       "propongo",
       "bisognerebbe",
       "navett",
       "sgrav",
       "parchegg"
      ]
     ]
    ],
    "model": "Chiudere i centri storici alle auto: una scelta giusta?\n\nL'esperienza di Valmarina, raccontata da un editoriale e da un confronto radiofonico, mostra bene i due volti della pedonalizzazione. Da un lato, i vantaggi sono evidenti: l'aria è più pulita, il rumore è diminuito e le piazze sono tornate ai cittadini. Dall'altro, i costi sono ricaduti su chi era più fragile: i commercianti che dipendevano dai clienti in auto e gli anziani che non potevano più raggiungere il medico.\n\nA mio parere, la scelta di chiudere il centro è giusta, ma credo che il Comune abbia commesso un errore di metodo. Sembra che abbia pensato prima al progetto e solo dopo alle persone: le navette e i parcheggi esterni sono arrivati in ritardo, e i negozi non hanno ricevuto alcun aiuto.\n\nPer questo propongo che le città che vogliono seguire questa strada preparino prima i servizi e prevedano sgravi fiscali per i commercianti durante la transizione. Solo così una buona idea può diventare una buona politica.",
    "gloss": {
     "Da un lato": "por un lado (…dall'altro = por el otro)",
     "sono ricaduti su": "recayeron sobre",
     "navette": "combis, servicios de traslado",
     "sgravi fiscali": "rebajas de impuestos"
    }
   },
   "breve": {
    "title": "Le previsioni del tempo per domani",
    "genre": "previsioni del tempo",
    "es": "El pronóstico del tiempo de un canal nacional para el viernes y el fin de semana.",
    "speaker": "Meteorologa",
    "voice": 1,
    "text": [
     "Buonasera, ecco le previsioni del tempo per domani, venerdì. Sembra che la perturbazione atlantica sia arrivata con qualche ora di anticipo: al Nord, fin dal mattino, cielo coperto e piogge diffuse, soprattutto in Liguria e in Piemonte, dove non si escludono temporali anche forti.",
     "Al Centro la giornata comincerà con qualche nuvola, ma le piogge arriveranno solo in serata sulla Toscana e sull'Umbria. Sulle coste tirreniche vento forte di libeccio, con raffiche fino a sessanta chilometri orari: mare molto mosso.",
     "Al Sud e sulle isole, invece, tempo ancora soleggiato e caldo, con massime fino a trentadue gradi in Sicilia. Temperature in calo al Nord, di cinque o sei gradi rispetto a oggi.",
     "Per il fine settimana il tempo migliora da sabato pomeriggio, a partire dal Nord-ovest; domenica sole quasi ovunque. Vi consigliamo di controllare gli avvisi della protezione civile prima di mettervi in viaggio. Buona serata."
    ],
    "tabella": [
     [
      "Nome del vento sulle coste tirreniche",
      "libeccio",
      []
     ],
     [
      "Velocità delle raffiche (km/h)",
      "60",
      [
       "sessanta"
      ]
     ],
     [
      "Temperatura massima in Sicilia (gradi)",
      "32",
      [
       "trentadue"
      ]
     ],
     [
      "Giorno in cui il tempo comincia a migliorare",
      "sabato",
      [
       "sabato pomeriggio",
       "da sabato",
       "da sabato pomeriggio"
      ]
     ]
    ],
    "info": [
     [
      "La perturbazione è arrivata prima del previsto.",
      true
     ],
     [
      "Al Centro piove già dal mattino.",
      false
     ],
     [
      "Il mare sulle coste tirreniche sarà molto mosso.",
      true
     ],
     [
      "Al Sud le temperature scendono di cinque o sei gradi.",
      false
     ],
     [
      "Domenica ci sarà il sole quasi ovunque.",
      true
     ],
     [
      "La protezione civile ha chiuso le autostrade.",
      false
     ]
    ],
    "gloss": {
     "perturbazione": "frente de mal tiempo",
     "raffiche": "ráfagas",
     "mosso": "picado (el mar)",
     "soleggiato": "soleado"
    }
   }
  },
  {
   "week": 30,
   "level": "B2",
   "lettura": {
    "title": "«Condiviso»: la serie che ci guarda mentre scorriamo",
    "emoji": "📺",
    "genre": "recensione",
    "grammar": "congiuntivo imperfetto e trapassato",
    "text": "Confesso che, quando la piattaforma ha annunciato «Condiviso», la nuova docuserie in sei puntate sulla disinformazione, temevo che fosse l'ennesimo prodotto moralista, uno di quei documentari in cui qualcuno ci spiega con aria grave che i social sono il male. Mi aspettavo, insomma, che la serie mi facesse sentire in colpa per il tempo che passo sul telefono. Mi sbagliavo, e sono contenta di essermi sbagliata.\n\nIl punto di partenza è una notizia falsa, apparentemente innocua: qualche anno fa un post sosteneva che in un paesino dell'Appennino il sindaco avesse vietato i matrimoni di venerdì. Nessuno sapeva chi l'avesse scritto, ma in quarantotto ore il post era stato condiviso centinaia di migliaia di volte, e alcuni telegiornali locali lo avevano ripreso come se fosse un fatto accertato. La regista, Chiara Ventura, ricostruisce il percorso di quella bugia, passaggio dopo passaggio, con la pazienza di un'investigatrice.\n\nLa forza della serie sta nelle persone. C'è il ragazzo di Caserta che aveva inventato il post per scherzo, convinto che nessuno lo prendesse sul serio; c'è la giornalista che lo aveva rilanciato senza verificare, e che oggi ammette, con una sincerità rara, che avrebbe voluto che qualcuno la fermasse; c'è soprattutto il sindaco vero, un uomo mite che per settimane ha ricevuto insulti da sconosciuti. Quando racconta che sua madre gli aveva chiesto se fosse impazzito, è difficile non commuoversi.\n\nVentura non cerca un colpevole unico. Anzi, la tesi della serie è che la bugia abbia viaggiato così veloce proprio perché era piccola e divertente: nessuno pensava che valesse la pena controllarla. È un'osservazione che dovrebbe far riflettere chi lavora nell'informazione. Nella quarta puntata, la più riuscita, un ex caporedattore spiega che una volta, prima che una notizia andasse in stampa, almeno due persone dovevano averla verificata; oggi, dice con amarezza, basta che «funzioni».\n\nNon tutto convince. La quinta puntata, dedicata agli algoritmi, è troppo lunga e un po' didascalica, come se la regista non si fidasse dell'intelligenza del pubblico. E la colonna sonora, insistente, sottolinea anche ciò che non ha alcun bisogno di essere sottolineato.\n\nEppure, alla fine dell'ultima puntata, mi sono sorpresa a fare una cosa che non facevo da tempo: prima di condividere un articolo, l'ho letto fino in fondo. Non so se fosse proprio questo l'obiettivo di Ventura, ma se una serie televisiva riesce a cambiare, anche di poco, un'abitudine, merita di essere vista. Voto: otto su dieci.",
    "gloss": {
     "sorpresa": "(mi sono sorpresa a fare) me descubrí haciendo: *sorprendersi a* + infinitivo",
     "alcun": "(non ha alcun bisogno) no tiene ninguna necesidad: *non... alcun* = ningún",
     "ciò": "(ciò che) lo que: *ciò* = eso, esto (semana 34)",
     "basta": "(basta che «funzioni») alcanza con que «funcione»: *basta che* + congiuntivo",
     "cui": "(in cui, con cui…) en el que, con el que: *cui* es el relativo después de preposición (semana 34)",
     "puntate": "episodios",
     "ennesimo": "enésimo",
     "innocua": "inofensiva",
     "vietato": "prohibido",
     "telegiornali": "noticieros",
     "ripreso": "levantado, reproducido",
     "accertato": "comprobado",
     "regista": "directora",
     "bugia": "mentira",
     "scherzo": "broma",
     "rilanciato": "vuelto a difundir",
     "fermasse": "frenara, detuviera",
     "mite": "manso, tranquilo",
     "sconosciuti": "desconocidos",
     "impazzito": "enloquecido",
     "commuoversi": "emocionarse",
     "riuscita": "lograda",
     "caporedattore": "jefe de redacción",
     "stampa": "imprenta (andare in stampa: imprimirse)",
     "didascalica": "demasiado didáctica",
     "fidasse": "confiara",
     "colonna": "columna (colonna sonora: banda de sonido)",
     "fondo": "(fino in fondo) hasta el final",
     "voto": "nota, puntaje"
    },
    "questions": [
     [
      "Che cosa si aspettava l'autrice prima di vedere la serie?",
      [
       "Una serie comica sul mondo dei social network",
       "Un documentario moralista che la colpevolizzasse",
       "Un'inchiesta tecnica sugli algoritmi",
       "Un racconto di finzione ambientato in Appennino"
      ],
      "Un documentario moralista che la colpevolizzasse"
     ],
     [
      "Perché, secondo la serie, la notizia falsa si è diffusa così in fretta?",
      [
       "Perché l'aveva diffusa un politico molto noto",
       "Perché i telegiornali nazionali l'avevano confermata",
       "Perché sembrava banale e nessuno la controllava",
       "Perché il sindaco non l'aveva mai smentita"
      ],
      "Perché sembrava banale e nessuno la controllava"
     ],
     [
      "Quale personaggio sembra commuovere di più l'autrice?",
      [
       "Il ragazzo che ha inventato il post",
       "Il sindaco preso di mira dagli insulti",
       "L'ex caporedattore della quarta puntata",
       "La giornalista che ha rilanciato il post"
      ],
      "Il sindaco preso di mira dagli insulti"
     ],
     [
      "Quali difetti trova l'autrice nella serie?",
      [
       "Una puntata didattica e la musica invadente",
       "La mancanza di interviste ai protagonisti",
       "Un tono troppo leggero e superficiale",
       "Puntate troppo brevi e troppo numerose"
      ],
      "Una puntata didattica e la musica invadente"
     ],
     [
      "Quale effetto ha avuto la serie sull'autrice?",
      [
       "Ha deciso di cancellarsi da tutti i social",
       "Ha scritto alla regista per ringraziarla",
       "È più attenta prima di condividere",
       "Ha smesso di guardare i telegiornali"
      ],
      "È più attenta prima di condividere"
     ]
    ],
    "vf": [
     [
      "La serie è composta da sei puntate.",
      "vero"
     ],
     [
      "Secondo la regista, la bugia ha un solo colpevole.",
      "falso"
     ],
     [
      "Il ragazzo di Caserta è stato denunciato.",
      "non si dice"
     ],
     [
      "Il giudizio complessivo dell'autrice è positivo.",
      "vero"
     ],
     [
      "Per l'autrice la quarta puntata è la meno riuscita.",
      "falso"
     ]
    ],
    "hunt": {
     "label": "Tocá los verbos en congiuntivo imperfetto y trapassato",
     "targets": [
      "fosse",
      "facesse",
      "avesse",
      "prendesse",
      "fermasse",
      "valesse",
      "andasse",
      "fidasse"
     ]
    }
   },
   "ascolto": {
    "title": "Il video dell'incendio",
    "genre": "conversazione in redazione",
    "es": "En la redacción de un diario online, un redactor joven y su jefa discuten si publicar un video viral que circula desde la mañana.",
    "speakers": [
     "Marco, redattore",
     "Elena, caporedattrice"
    ],
    "turns": [
     [
      "A",
      "Elena, hai un minuto? Hai visto il video che gira da stamattina, quello dell'incendio al mercato coperto?"
     ],
     [
      "B",
      "L'ho visto, sì. Tre milioni di visualizzazioni in due ore. Perché?"
     ],
     [
      "A",
      "Perché io lo metterei subito in apertura sul sito. Lo stanno pubblicando tutti, se aspettiamo arriviamo ultimi."
     ],
     [
      "B",
      "Aspetta un attimo. Tu sai chi l'ha girato?"
     ],
     [
      "A",
      "Allora, no, cioè, l'ha postato un account che si chiama «Notizie dal quartiere». Pensavo che l'avessi già controllato tu, veramente."
     ],
     [
      "B",
      "No, e ti dico di più: stamattina ho chiamato i vigili del fuoco e non risultava nessun incendio al mercato. Mi sembrava strano che nessuno ci avesse avvisato."
     ],
     [
      "A",
      "Però il video sembra verissimo. Si vede il fumo, la gente che scappa, si sentono perfino le sirene. Non so, a me sembrava autentico al cento per cento."
     ],
     [
      "B",
      "Sì, ma guarda le insegne dei negozi. Non ti sembra che siano scritte in un'altra lingua? Io ho ingrandito l'immagine: è un mercato di Salonicco, e il video è di tre anni fa."
     ],
     [
      "A",
      "Ah. Beh, allora meno male che non l'ho pubblicato."
     ],
     [
      "B",
      "Esatto. Senti, non voglio farti la predica. Anch'io, alla tua età, volevo che le mie notizie uscissero prima di quelle degli altri. Ma se l'avessimo messo in apertura, domani tutti avrebbero parlato del nostro errore, non dell'incendio."
     ],
     [
      "A",
      "E adesso? Ignoriamo la cosa?"
     ],
     [
      "B",
      "No, anzi. Facciamo un pezzo proprio sul video falso: come è nato, chi l'ha diffuso, come abbiamo capito che non era vero. Vorrei che lo scrivessi tu, visto che l'hai trovato."
     ],
     [
      "A",
      "Va bene. Magari aggiungo anche due consigli per i lettori, su come riconoscere un video riciclato."
     ],
     [
      "B",
      "Ottima idea. E la prossima volta, prima di chiedermi di pubblicare, fai una telefonata in più. Una telefonata costa due minuti; una smentita, a volte, costa anni di credibilità."
     ]
    ],
    "gloss": {
     "risultava": "(non risultava nessun incendio) no figuraba ningún incendio, no había registro",
     "gira": "circula (*girare*: dar vueltas; *girare un video*: filmarlo)",
     "visualizzazioni": "reproducciones",
     "apertura": "(in apertura) como nota principal",
     "girato": "filmado",
     "vigili": "(vigili del fuoco) bomberos",
     "fumo": "humo",
     "scappa": "huye, se escapa",
     "insegne": "carteles de los negocios",
     "ingrandito": "ampliado, agrandado",
     "predica": "sermón",
     "pezzo": "nota, artículo",
     "riciclato": "reciclado",
     "smentita": "desmentida"
    },
    "questions": [
     [
      "Che cosa vuole fare Marco all'inizio?",
      [
       "Pubblicare subito il video in evidenza",
       "Telefonare all'autore del video",
       "Andare al mercato a verificare",
       "Chiedere un parere ai pompieri"
      ],
      "Pubblicare subito il video in evidenza"
     ],
     [
      "Come ha capito Elena che il video era falso?",
      [
       "Dal numero sospetto di visualizzazioni",
       "Da una telefonata e dalle insegne",
       "Da un messaggio di un collega greco",
       "Dal nome dell'account che l'aveva postato"
      ],
      "Da una telefonata e dalle insegne"
     ],
     [
      "Qual è l'atteggiamento di Elena verso Marco?",
      [
       "Duro e sprezzante",
       "Indifferente e distratto",
       "Critico ma comprensivo",
       "Pieno di ammirazione"
      ],
      "Critico ma comprensivo"
     ],
     [
      "Secondo Elena, che cosa sarebbe successo se avessero pubblicato il video?",
      [
       "Il giornale avrebbe perso molti abbonati",
       "Si sarebbe parlato del loro errore",
       "Il mercato avrebbe fatto causa al giornale",
       "I vigili avrebbero smesso di collaborare"
      ],
      "Si sarebbe parlato del loro errore"
     ],
     [
      "Che cosa decidono alla fine?",
      [
       "Ignorare completamente la notizia",
       "Segnalare l'account alla polizia postale",
       "Scrivere un articolo sul video falso",
       "Pubblicare il video con un avvertimento"
      ],
      "Scrivere un articolo sul video falso"
     ]
    ],
    "vf": [
     [
      "Il video aveva milioni di visualizzazioni.",
      "vero"
     ],
     [
      "Il video era stato girato in Italia.",
      "falso"
     ],
     [
      "Marco lavora in redazione da pochi mesi.",
      "non si dice"
     ],
     [
      "Elena chiede a Marco di scrivere il pezzo.",
      "vero"
     ]
    ]
   },
   "compito": {
    "genre": "articolo",
    "title": "Perché le notizie false corrono così veloci",
    "fonte": "entrambi",
    "t": "Il giornale della tua università prepara un numero speciale sulla disinformazione. Partendo dalla recensione della serie «Condiviso» e dalla conversazione in redazione che hai ascoltato, scrivi un articolo con un titolo (137-197 parole, registro standard) in cui spieghi perché le notizie false si diffondono così facilmente e dai ai lettori almeno due consigli pratici per riconoscerle.",
    "es": "Artículo con título para la revista de la facultad: explicá por qué se difunden las noticias falsas usando los ejemplos de la serie y del audio, y da dos consejos concretos.",
    "min": 137,
    "max": 197,
    "punti": [
     [
      "por qué se difunden las noticias falsas",
      [
       "condivi",
       "diffond",
       "fretta",
       "divertent"
      ]
     ],
     [
      "el ejemplo de la serie",
      [
       "serie",
       "sindaco",
       "condiviso"
      ]
     ],
     [
      "el ejemplo del video del audio",
      [
       "video",
       "incendio",
       "redazion"
      ]
     ],
     [
      "al menos dos consejos prácticos",
      [
       "consigl",
       "verific",
       "controll",
       "fonti"
      ]
     ]
    ],
    "model": "Prima di condividere, fermati un attimo\n\nChi di noi non ha mai inoltrato una notizia senza leggerla fino in fondo? La docuserie «Condiviso» mostra quanto possa costare questo gesto: una bugia su un sindaco che avrebbe vietato i matrimoni di venerdì ha fatto il giro del Paese, e un uomo innocente ha ricevuto insulti per settimane. Nessuno pensava che valesse la pena controllarla, perché sembrava piccola e divertente.\n\nIl problema non riguarda solo i lettori. Anche le redazioni, spinte dalla fretta, rischiano di pubblicare contenuti falsi. In una conversazione tra giornalisti che ho ascoltato, un video di un incendio sembrava verissimo, ma era stato girato in Grecia tre anni prima.\n\nChe cosa possiamo fare, allora? Ecco due consigli semplici. Primo: prima di condividere, chiediamoci chi ha pubblicato la notizia e se altre fonti affidabili la confermano. Secondo: guardiamo i dettagli, come le insegne, le date, la lingua. Spesso bastano due minuti per scoprire un falso.\n\nSe tutti lo facessimo, la rete sarebbe un posto molto più pulito.",
    "gloss": {
     "fermati un attimo": "pará un momento",
     "inoltrato": "reenviado",
     "fino in fondo": "hasta el final",
     "avrebbe vietato": "habría prohibido, supuestamente prohibió (condizionale passato para una noticia no confirmada: se ve en la semana 31)",
     "ha fatto il giro del Paese": "recorrió todo el país, se hizo viral",
     "era stato girato": "había sido filmado (voz pasiva: se ve en la semana 35)",
     "insegne": "carteles de los negocios"
    }
   },
   "breve": {
    "title": "Giornale radio delle tredici",
    "genre": "notiziario radiofonico",
    "es": "El noticiero del mediodía de una radio de la ciudad: un desmentido, una serie en el cine y el fútbol.",
    "speaker": "Speaker",
    "voice": 0,
    "text": [
     "Giornale radio delle tredici. In apertura, una smentita. Da ieri circola sui social un messaggio secondo cui lunedì tutte le scuole della città resterebbero chiuse per un'allerta meteo. Non è vero: il sindaco ha precisato che nessuna ordinanza è stata firmata e che le lezioni si svolgeranno regolarmente.",
     "Il messaggio, spiega la polizia postale, sembrava ufficiale perché riportava il logo del Comune, ma conteneva diversi errori. Chi lo ha ricevuto è invitato a non condividerlo e a consultare soltanto il sito del Comune.",
     "Cultura. Stasera alle 21, al cinema Odeon, la regista Chiara Ventura presenta la serie «Condiviso». Dopo la proiezione del primo episodio, incontro con il pubblico. Ingresso libero fino a esaurimento dei posti.",
     "Sport. Pareggio, uno a uno, nel derby di ieri sera; la squadra di casa ha giocato gli ultimi venti minuti con un uomo in meno. Prossimo aggiornamento alle quindici."
    ],
    "tabella": [
     [
      "Giorno in cui, secondo il messaggio falso, le scuole restavano chiuse",
      "lunedì",
      []
     ],
     [
      "Nome del cinema",
      "Odeon",
      [
       "cinema Odeon"
      ]
     ],
     [
      "Ora della presentazione della serie",
      "21",
      [
       "ventuno",
       "alle 21",
       "21:00",
       "21.00"
      ]
     ],
     [
      "Risultato del derby",
      "1-1",
      [
       "uno a uno",
       "1 a 1",
       "1 1",
       "1:1"
      ]
     ]
    ],
    "info": [
     [
      "Il sindaco ha firmato un'ordinanza per chiudere le scuole.",
      false
     ],
     [
      "Il messaggio falso aveva il logo del Comune.",
      true
     ],
     [
      "La polizia postale chiede di non condividere il messaggio.",
      true
     ],
     [
      "Per vedere la serie al cinema bisogna pagare il biglietto.",
      false
     ],
     [
      "Dopo la proiezione la regista incontra il pubblico.",
      true
     ],
     [
      "La squadra di casa ha vinto il derby.",
      false
     ]
    ],
    "gloss": {
     "smentita": "desmentida",
     "allerta": "alerta",
     "proiezione": "proyección",
     "pareggio": "empate"
    }
   }
  },
  {
   "week": 31,
   "level": "B2",
   "lettura": {
    "title": "«Pensavo che sarei diventata socia. Poi ho scelto le capre»",
    "emoji": "🐐",
    "genre": "intervista",
    "grammar": "condizionale passato e futuro nel passato",
    "text": "Laura Benedetti, quarantun anni, per dodici anni ha fatto l'avvocata d'affari in uno studio del centro di Milano. Tre anni fa ha lasciato tutto e ha aperto un piccolo caseificio sulle colline dell'Oltrepò pavese, dove produce formaggi di capra. L'abbiamo incontrata tra una mungitura e una consegna.\n\nQuando ha cominciato a lavorare, come immaginava il suo futuro? «In modo molto preciso. Pensavo che sarei diventata socia dello studio prima dei quarant'anni, che avrei comprato casa in città e che, un giorno, avrei rallentato. Tutti mi dicevano che i primi anni sarebbero stati durissimi e che poi le cose sarebbero migliorate. In realtà non miglioravano mai: cambiavano solo i clienti.»\n\nC'è stato un momento preciso in cui ha deciso di andarsene? «Sì, e me lo ricordo benissimo. Era un venerdì sera, ero in ufficio alle undici e ho ricevuto un messaggio di mia sorella: mio nipote aveva appena fatto il suo primo saggio di pianoforte. Io avrei dovuto esserci, gliel'avevo promesso. Quella sera ho capito che avrei continuato a perdere cose così, una dopo l'altra, senza nemmeno accorgermene.»\n\nQualcuno ha cercato di fermarla? «Moltissimi. Il mio capo mi ha detto che avrei rovinato una carriera brillante e che me ne sarei pentita entro sei mesi. Anche i miei genitori, che avevano fatto tanti sacrifici per farmi studiare, all'inizio erano preoccupati. Mia madre, per esempio, avrebbe preferito che mi prendessi un anno sabbatico, senza bruciare i ponti.»\n\nSe ne è pentita? «No, ma non voglio raccontare una favola. Il primo inverno è stato terribile: due capre si sono ammalate, i permessi sanitari sono arrivati con mesi di ritardo e avevo finito quasi tutti i risparmi. Con il senno di poi, avrei fatto le cose in modo diverso: avrei seguito un corso serio prima di partire e avrei cercato dei soci. Cominciare da sola è stato un errore.»\n\nCom'è oggi una sua giornata tipo? «Mi alzo alle cinque e mezza per la mungitura, poi passo la mattina in laboratorio a fare i formaggi. Il pomeriggio faccio le consegne ai ristoranti della zona e, due volte alla settimana, vado al mercato di Voghera. Se qualcuno, dieci anni fa, mi avesse detto che avrei passato le giornate così, gli avrei riso in faccia.»\n\nChe cosa le manca del vecchio lavoro? «Mi mancano i colleghi, le discussioni intelligenti, perfino un po' l'adrenalina. E lo stipendio, ovviamente. Ma non tornerei indietro. Oggi lavoro forse più di prima, però sono io a decidere quando fermarmi.»\n\nChe cosa direbbe a chi sogna di cambiare vita? «Di non fidarsi delle storie che si leggono sui giornali, compresa la mia. Nessuno racconta le notti passate a fare i conti. Però direi anche un'altra cosa: se fossi rimasta, oggi guadagnerei di più, ma non conoscerei la persona che sono diventata. E questa persona, sinceramente, mi piace di più.»",
    "gloss": {
     "compresa": "incluida",
     "decidere": "(sono io a decidere) soy yo la que decide: *essere* + persona + *a* + infinitivo destaca quién (semana 48)",
     "farmi": "(per farmi studiare) para que yo pudiera estudiar: *fare* + infinitivo = hacer que alguien haga (semana 40)",
     "andarsene": "irse (de un lugar): *andare* + *se ne* (semana 45)",
     "cui": "(in cui, con cui…) en el que, con el que: *cui* es el relativo después de preposición (semana 34)",
     "socia": "socia (de un estudio)",
     "caseificio": "quesería",
     "capra": "cabra",
     "mungitura": "ordeñe",
     "consegna": "entrega",
     "rallentato": "bajado el ritmo",
     "nipote": "sobrino",
     "saggio": "muestra (de fin de curso)",
     "accorgermene": "darme cuenta",
     "rovinato": "arruinado",
     "pentita": "arrepentida (*pentirsene*: arrepentirse de algo; *se ne è pentita?* ¿se arrepintió?)",
     "bruciare": "quemar",
     "favola": "cuento de hadas",
     "ammalate": "(se) enfermaron",
     "permessi": "habilitaciones, permisos",
     "risparmi": "ahorros",
     "senno": "(con il senno di poi) con el diario del lunes",
     "soci": "socios",
     "stipendio": "sueldo",
     "fermarmi": "parar",
     "conti": "cuentas"
    },
    "questions": [
     [
      "Come immaginava Laura il suo futuro all'inizio della carriera?",
      [
       "Pensava che avrebbe lasciato Milano dopo pochi anni",
       "Come una carriera lineare fino a diventare socia",
       "Sognava già di aprire un'attività tutta sua",
       "Voleva lavorare poco e guadagnare molto"
      ],
      "Come una carriera lineare fino a diventare socia"
     ],
     [
      "Che cosa ha fatto scattare la decisione di Laura?",
      [
       "Un litigio violento con il suo capo",
       "Aver perso un momento importante in famiglia",
       "Un esaurimento dovuto allo stress",
       "La proposta di un'amica di aprire un'azienda agricola"
      ],
      "Aver perso un momento importante in famiglia"
     ],
     [
      "Come hanno reagito all'inizio i genitori di Laura?",
      [
       "Con entusiasmo immediato",
       "Con indifferenza",
       "Con preoccupazione",
       "Con rabbia e minacce"
      ],
      "Con preoccupazione"
     ],
     [
      "Che cosa farebbe diversamente Laura, col senno di poi?",
      [
       "Non lascerebbe mai lo studio legale",
       "Aprirebbe il caseificio più vicino a Milano",
       "Chiederebbe alla banca un prestito più alto",
       "Si preparerebbe meglio e non partirebbe da sola"
      ],
      "Si preparerebbe meglio e non partirebbe da sola"
     ],
     [
      "Che cosa intende Laura quando dice di non fidarsi delle storie «compresa la mia»?",
      [
       "Che in passato ha mentito ai giornalisti per farsi pubblicità",
       "Che i racconti di svolta tacciono le difficoltà",
       "Che il suo caseificio in realtà va male",
       "Che sconsiglia a tutti di cambiare vita"
      ],
      "Che i racconti di svolta tacciono le difficoltà"
     ]
    ],
    "vf": [
     [
      "Laura ha lavorato dodici anni come avvocata.",
      "vero"
     ],
     [
      "Il capo di Laura approvava la sua scelta.",
      "falso"
     ],
     [
      "Oggi il caseificio ha alcuni dipendenti.",
      "non si dice"
     ],
     [
      "Laura ha aperto il caseificio insieme a dei soci.",
      "falso"
     ],
     [
      "A Laura manca lo stipendio di una volta.",
      "vero"
     ]
    ],
    "hunt": {
     "label": "Tocá los auxiliares del condizionale passato (avrei, sarei…)",
     "targets": [
      "sarei",
      "avrei",
      "sarebbero",
      "avrebbe"
     ]
    }
   },
   "ascolto": {
    "title": "Che cosa è andato storto",
    "genre": "conversazione tra colleghi",
    "es": "Dos colegas de una empresa de software comentan por qué un cliente importante no renovó el contrato y cómo escribir el informe que les pide el director.",
    "speakers": [
     "Sonia, responsabile di progetto",
     "Paolo, collega"
    ],
    "turns": [
     [
      "A",
      "Paolo, hai saputo? Il cliente di Verona non ha rinnovato il contratto."
     ],
     [
      "B",
      "Sì, me l'ha detto Rossi stamattina. Sinceramente, non ci speravo più."
     ],
     [
      "A",
      "Come non ci speravi? A settembre il direttore ci aveva assicurato che l'avrebbero firmato senza problemi."
     ],
     [
      "B",
      "Appunto, a settembre. Ma poi abbiamo consegnato il software con due mesi di ritardo, e con metà delle funzioni che avevamo promesso."
     ],
     [
      "A",
      "Lo so, lo so. Però non è stata solo colpa nostra. Il team di sviluppo avrebbe dovuto avvisarci molto prima che non ce l'avrebbe fatta."
     ],
     [
      "B",
      "Guarda, secondo me noi avremmo dovuto chiederlo. Cioè, io ricordo benissimo una riunione a luglio in cui Marco ha detto: forse ci serve più tempo. Nessuno l'ha preso sul serio. Io stesso ho pensato che stesse esagerando, come al solito."
     ],
     [
      "A",
      "È vero. Io avrei voluto rimandare la consegna, ma il direttore non voleva nemmeno sentirne parlare."
     ],
     [
      "B",
      "E lì forse avremmo dovuto insistere. Anche per iscritto, magari. Una mail, due righe."
     ],
     [
      "A",
      "Mah, non so se sarebbe cambiato qualcosa. Comunque adesso il direttore vuole una relazione su che cosa è andato storto. Entro venerdì."
     ],
     [
      "B",
      "Allora facciamola onesta, per favore. Non una lista di colpe degli altri."
     ],
     [
      "A",
      "Ci mancherebbe. Anche perché il direttore la leggerà insieme all'amministratore delegato, e non voglio che sembri che ci stiamo solo difendendo. Io proporrei tre punti: la stima dei tempi sbagliata, la comunicazione tra i team, e il fatto che abbiamo promesso troppo al cliente."
     ],
     [
      "B",
      "Io aggiungerei una cosa: le riunioni di controllo. Le facevamo ogni due settimane; avremmo dovuto farle ogni settimana, almeno nell'ultima fase."
     ],
     [
      "A",
      "Giusto. E poi qualche proposta concreta, sennò sembra solo un funerale."
     ],
     [
      "B",
      "Esatto, hai ragione. Ti preparo io la prima bozza?"
     ],
     [
      "A",
      "Sì, grazie. Poi la rivediamo insieme giovedì mattina, così venerdì la mandiamo al direttore con calma e senza sorprese."
     ]
    ],
    "gloss": {
     "cui": "(in cui, con cui…) en el que, con el que: *cui* es el relativo después de preposición (semana 34)",
     "rinnovato": "renovado",
     "consegnato": "entregado",
     "sviluppo": "desarrollo",
     "rimandare": "postergar",
     "iscritto": "(per iscritto) por escrito",
     "righe": "renglones",
     "storto": "(andare storto) salir mal",
     "relazione": "informe",
     "stima": "estimación",
     "sennò": "si no",
     "bozza": "borrador",
     "mancherebbe": "(ci mancherebbe) ¡faltaba más!"
    },
    "questions": [
     [
      "Che cosa è successo con il cliente di Verona?",
      [
       "Ha chiesto nuove funzioni al software",
       "Non ha rinnovato il contratto",
       "Ha pagato con due mesi di ritardo",
       "Ha cambiato il suo referente"
      ],
      "Non ha rinnovato il contratto"
     ],
     [
      "Che cosa aveva assicurato il direttore a settembre?",
      [
       "Che avrebbe assunto nuovi sviluppatori",
       "Che la consegna sarebbe stata rimandata",
       "Che avrebbe incontrato lui il cliente",
       "Che il cliente avrebbe firmato"
      ],
      "Che il cliente avrebbe firmato"
     ],
     [
      "Qual è la posizione di Paolo sulle responsabilità?",
      [
       "La colpa è solo del team di sviluppo",
       "Anche loro avrebbero dovuto insistere",
       "La colpa è tutta del direttore generale",
       "Nessuno avrebbe potuto prevedere il problema"
      ],
      "Anche loro avrebbero dovuto insistere"
     ],
     [
      "Come deve essere la relazione, secondo Paolo?",
      [
       "Onesta, senza scaricare le colpe",
       "Breve e senza alcuna proposta",
       "Firmata dal direttore in persona",
       "Inviata direttamente al cliente"
      ],
      "Onesta, senza scaricare le colpe"
     ],
     [
      "Quale punto aggiunge Paolo alla relazione?",
      [
       "Un nuovo contratto con il cliente",
       "Un corso sulla stima dei tempi",
       "Il cambio del responsabile di progetto",
       "Riunioni di controllo più frequenti"
      ],
      "Riunioni di controllo più frequenti"
     ]
    ],
    "vf": [
     [
      "A luglio un collega aveva segnalato un possibile ritardo.",
      "vero"
     ],
     [
      "La relazione va consegnata entro lunedì.",
      "falso"
     ],
     [
      "Il direttore ha già deciso di licenziare qualcuno.",
      "non si dice"
     ],
     [
      "Il software è stato consegnato con tutte le funzioni promesse.",
      "falso"
     ]
    ]
   },
   "compito": {
    "genre": "relazione",
    "title": "Relazione sul mancato rinnovo del contratto",
    "fonte": "ascolto",
    "t": "Hai ascoltato la conversazione tra Sonia e Paolo sul cliente di Verona. Immagina di essere Sonia e scrivi la relazione per il direttore (143-203 parole, registro formale), organizzata in sezioni: descrivi che cosa è successo, analizza le cause usando le informazioni della conversazione e proponi almeno due misure per evitare che accada di nuovo. Usa il condizionale passato per indicare che cosa si sarebbe dovuto fare.",
    "es": "Informe formal al director en secciones (hechos, causas, propuestas), con los datos del audio. Usá condizionale passato para lo que se debería haber hecho (avremmo dovuto…).",
    "min": 143,
    "max": 203,
    "punti": [
     [
      "los hechos: el cliente no renovó",
      [
       "cliente",
       "verona",
       "rinnov"
      ]
     ],
     [
      "las causas (demora, estimación, comunicación)",
      [
       "ritardo",
       "stima",
       "comunicazione",
       "cause"
      ]
     ],
     [
      "al menos dos propuestas",
      [
       "propon",
       "propost",
       "settiman",
       "per iscritto"
      ]
     ],
     [
      "registro formal y cierre",
      [
       "gentile direttore",
       "egregio",
       "cordiali saluti",
       "distinti saluti",
       "oggetto"
      ]
     ]
    ],
    "model": "Oggetto: mancato rinnovo del contratto con il cliente di Verona\n\nGentile Direttore,\n\ncome richiesto, le invio una breve analisi di quanto accaduto con il cliente di Verona, che ha deciso di non rinnovare il contratto.\n\n1. I fatti. Il software è stato consegnato con due mesi di ritardo e con circa metà delle funzioni previste. A settembre eravamo convinti che il cliente avrebbe firmato il rinnovo; questa previsione si è rivelata troppo ottimistica.\n\n2. Le cause. In primo luogo, la stima dei tempi era sbagliata. In secondo luogo, la comunicazione tra i team non ha funzionato: già a luglio era stato segnalato un possibile ritardo, ma nessuno ha approfondito. Con il senno di poi, avremmo dovuto rimandare la consegna e avvisare il cliente per tempo. Infine, abbiamo promesso più di quanto potessimo realizzare.\n\n3. Proposte. Proponiamo riunioni di controllo settimanali nelle fasi finali dei progetti e la registrazione per iscritto di ogni segnalazione di rischio.\n\nRestiamo a disposizione per discuterne.\n\nCordiali saluti,\nSonia Ferri",
    "gloss": {
     "mancato rinnovo": "falta de renovación, no renovación",
     "si è rivelata": "resultó ser",
     "era stato segnalato": "se había advertido, había sido señalado (voz pasiva: se ve en la semana 35)",
     "nessuno ha approfondito": "nadie lo investigó a fondo",
     "Con il senno di poi": "visto ahora, con lo que sabemos después",
     "avremmo dovuto rimandare": "tendríamos que haber postergado",
     "per iscritto": "por escrito",
     "Restiamo a disposizione": "quedamos a disposición"
    }
   },
   "breve": {
    "title": "Un messaggio per il magazzino",
    "genre": "messaggio in segreteria",
    "es": "Una empresa de software deja un mensaje en el contestador de un cliente para postergar una instalación.",
    "speaker": "Sonia Ricci",
    "voice": 1,
    "text": [
     "Buongiorno, sono Sonia Ricci, della Ricci & Neri Software. Chiamo per il programma di gestione del vostro magazzino. Avremmo dovuto consegnarvi la nuova versione venerdì, ma purtroppo abbiamo trovato un problema nel collegamento con la contabilità, e non vorremmo installare un programma che poi non funziona.",
     "Le propongo quindi di spostare l'installazione a martedì prossimo, il 14, alle nove del mattino. Il nostro tecnico, Paolo Gatti, avrebbe bisogno di circa tre ore e di un accesso al server; durante l'installazione il magazzino dovrebbe restare chiuso.",
     "Mi rendo conto che è un disagio: per questo non vi faremo pagare la prima assistenza annuale, che sarebbe costata quattrocento euro.",
     "Se martedì non vi va bene, mi può richiamare entro domani sera, oppure scrivermi una mail. Mi scuso ancora per il ritardo. Arrivederci."
    ],
    "tabella": [
     [
      "Giorno proposto per l'installazione",
      "martedì",
      [
       "martedì 14",
       "martedì prossimo",
       "14",
       "il 14"
      ]
     ],
     [
      "Ora dell'installazione",
      "9",
      [
       "nove",
       "alle nove",
       "9:00",
       "9.00"
      ]
     ],
     [
      "Nome del tecnico",
      "Paolo Gatti",
      [
       "Gatti",
       "Paolo"
      ]
     ],
     [
      "Ore di lavoro necessarie",
      "3",
      [
       "tre",
       "tre ore"
      ]
     ],
     [
      "Costo che il cliente non pagherà (euro)",
      "400",
      [
       "quattrocento"
      ]
     ]
    ],
    "info": [
     [
      "La consegna era prevista per venerdì.",
      true
     ],
     [
      "Il problema riguarda il collegamento con la contabilità.",
      true
     ],
     [
      "Durante l'installazione il magazzino può lavorare normalmente.",
      false
     ],
     [
      "La prima assistenza annuale sarà gratuita.",
      true
     ],
     [
      "Bisogna richiamare entro martedì.",
      false
     ],
     [
      "Sonia chiede di pagare una penale.",
      false
     ]
    ],
    "gloss": {
     "magazzino": "depósito",
     "contabilità": "contabilidad",
     "disagio": "molestia, inconveniente"
    }
   }
  },
  {
   "week": 32,
   "level": "B2",
   "lettura": {
    "title": "La casa di via Roma",
    "emoji": "🧳",
    "genre": "racconto",
    "grammar": "concordanza dei tempi",
    "text": "Mio nonno Salvatore partì da Pietrafonda nel 1951, con una valigia di cartone e l'indirizzo di un cugino a Buenos Aires. Quando ero bambino, mi raccontava che la sua casa era l'ultima di via Roma, quella con la porta verde, e che dalla finestra della cucina si vedeva il mare. Io non sapevo se fosse vero: in paese, diceva mia madre, il mare non si vede da nessuna parte.\n\nIl nonno morì senza tornare. Qualche anno dopo, quando ottenni la cittadinanza italiana, decisi che sarei andato a vedere quella porta verde. Ai miei amici di Rosario dissi che volevo conoscere le mie radici; in realtà, ora lo so, volevo soprattutto capire perché lui non fosse mai tornato.\n\nArrivai a Pietrafonda un pomeriggio di ottobre, con un autobus che si fermò due volte per far passare le capre. Il paese era più piccolo di come l'avevo immaginato, e più silenzioso. Via Roma c'era, ma di porte verdi nessuna traccia. Chiesi a un uomo seduto davanti al bar se conoscesse la famiglia Mancuso. Mi guardò a lungo, poi mi domandò da dove venissi. Quando dissi «dall'Argentina», sorrise come se avesse già capito tutto.\n\nMi accompagnò da una signora anziana, Nunziata, che abitava in fondo alla strada. Lei mi fece entrare, mi offrì un caffè che non potevo rifiutare e mi raccontò che sua madre e mio nonno erano stati compagni di scuola. Mi disse che la casa dei Mancuso era crollata dopo un terremoto e che il Comune, anni dopo, l'aveva fatta demolire. Io le chiesi se si ricordasse del mare. Rise. «Il mare no», disse, «ma nelle giornate limpide dalla cucina si vedevano le luci della pianura, laggiù in fondo. Tuo nonno diceva sempre che un giorno ci sarebbe andato.»\n\nRimasi in silenzio. Pensai a quante sere lui avesse passato a guardare quelle luci, e a come, dall'altra parte dell'oceano, le avesse trasformate in mare. Forse, pensai, non era tornato perché sapeva che il paese non sarebbe stato come lo ricordava; o forse perché temeva che nessuno lo riconoscesse più.\n\nPrima che me ne andassi, Nunziata aprì un cassetto e tirò fuori una fotografia: una classe di bambini magri, in grembiule nero. «Questo è lui», disse, indicando un ragazzino con le orecchie grandi. Me la regalò. Le promisi che sarei tornato l'estate successiva, e lei mi rispose che mi avrebbe aspettato con i fichi.\n\nSull'autobus del ritorno guardai a lungo la foto. Mi resi conto che, per tutta la vita, avevo pensato che il nonno fosse un emigrante argentino. Solo quel giorno capii che era stato, fino alla fine, un ragazzino di Pietrafonda che guardava le luci e sognava il mare.",
    "gloss": {
     "tirò": "(tirò fuori) sacó: *tirare fuori* = sacar",
     "andassi": "(prima che me ne andassi) antes de que me fuera: *andarsene* = irse",
     "demolire": "(l'aveva fatta demolire) la había hecho demoler (semana 40)",
     "far": "(per far passare le capre) para dejar pasar a las cabras: *fare* + infinitivo (semana 40)",
     "rispose": "respondió (passato remoto de *rispondere*)",
     "promisi": "prometí (passato remoto de *promettere*)",
     "rimasi": "me quedé (passato remoto de *rimanere*)",
     "fece": "hizo (passato remoto de *fare*; *mi fece entrare*: me hizo pasar)",
     "chiesi": "pregunté, pedí (passato remoto de *chiedere*)",
     "disse": "dijo (passato remoto de *dire*)",
     "dissi": "dije (passato remoto de *dire*)",
     "decisi": "decidí (passato remoto de *decidere*)",
     "partì": "se fue: *passato remoto*, el pretérito de los relatos escritos; terminaciones *-ai/-ò*, *-ei/-é*, *-ii/-ì* (lo ves en la semana 37)",
     "valigia": "valija",
     "cartone": "cartón",
     "morì": "murió",
     "ottenni": "obtuve",
     "radici": "raíces",
     "traccia": "rastro",
     "sorrise": "sonrió",
     "rifiutare": "rechazar",
     "crollata": "derrumbada",
     "rise": "se rió",
     "limpide": "despejadas",
     "pianura": "llanura",
     "laggiù": "allá abajo, allá lejos",
     "cassetto": "cajón",
     "magri": "flacos",
     "grembiule": "guardapolvo",
     "orecchie": "orejas",
     "regalò": "regaló",
     "fichi": "higos",
     "resi": "(mi resi conto) me di cuenta"
    },
    "questions": [
     [
      "Qual è il vero motivo del viaggio del narratore?",
      [
       "Ottenere la cittadinanza italiana",
       "Capire perché il nonno non fosse mai tornato",
       "Vendere quel che restava della casa di famiglia",
       "Ritrovare dei parenti ancora vivi in paese"
      ],
      "Capire perché il nonno non fosse mai tornato"
     ],
     [
      "Come reagisce l'uomo del bar quando sente «dall'Argentina»?",
      [
       "Si rifiuta di rispondere alle sue domande",
       "Sembra intuire subito il motivo della visita",
       "Dice di non aver mai sentito il nome Mancuso",
       "Lo accompagna subito alla casa dalla porta verde"
      ],
      "Sembra intuire subito il motivo della visita"
     ],
     [
      "Che cosa scopre il narratore sul «mare» del nonno?",
      [
       "Era un lago vicino al paese",
       "Era un'invenzione della madre",
       "Erano luci lontane nella pianura",
       "Si vedeva davvero dalla cucina"
      ],
      "Erano luci lontane nella pianura"
     ],
     [
      "Quale ipotesi fa il narratore sul mancato ritorno del nonno?",
      [
       "Non aveva mai i soldi per il viaggio",
       "Temeva un paese diverso dal ricordo",
       "Era in lite con la famiglia rimasta in Italia",
       "Col tempo si era dimenticato del paese"
      ],
      "Temeva un paese diverso dal ricordo"
     ],
     [
      "Che cosa capisce il narratore nell'ultimo paragrafo?",
      [
       "Che il nonno aveva mentito sulla sua infanzia",
       "Che non tornerà più a Pietrafonda",
       "Che il nonno restò sempre legato al suo paese",
       "Che la sua famiglia è più argentina che italiana"
      ],
      "Che il nonno restò sempre legato al suo paese"
     ]
    ],
    "vf": [
     [
      "Il nonno partì con l'indirizzo di un cugino.",
      "vero"
     ],
     [
      "La casa dei Mancuso esiste ancora.",
      "falso"
     ],
     [
      "Il narratore è tornato a Pietrafonda l'estate successiva.",
      "non si dice"
     ],
     [
      "Nunziata regala al narratore una fotografia.",
      "vero"
     ],
     [
      "Il narratore arriva in paese in primavera.",
      "falso"
     ]
    ],
    "hunt": {
     "label": "Tocá los verbos que dependen de un verbo en pasado (congiuntivo imperfetto/trapassato y condizionale passato)",
     "targets": [
      "fosse",
      "conoscesse",
      "venissi",
      "avesse",
      "ricordasse",
      "riconoscesse",
      "andassi",
      "sarei",
      "sarebbe",
      "avrebbe"
     ]
    }
   },
   "ascolto": {
    "title": "Italiani con il trattino",
    "genre": "conferenza con domande",
    "es": "Al final de una conferencia, la moderadora le hace preguntas (propias y del público) a un sociolingüista que investigó a los hijos de inmigrantes nacidos en Italia.",
    "speakers": [
     "Moderatrice",
     "Prof. Karim Benali, sociolinguista"
    ],
    "turns": [
     [
      "A",
      "Grazie, professor Benali, per questa relazione così ricca. Abbiamo qualche minuto per le domande. Comincio io, se permette: nel suo intervento ha parlato di «italiani con il trattino». Che cosa intendeva?"
     ],
     [
      "B",
      "Intendevo ragazzi e ragazze che si definiscono italo-marocchini, italo-cinesi, italo-peruviani. Durante la ricerca ho intervistato una studentessa di Bergamo che mi ha detto che si sentiva italiana a Casablanca e marocchina a Bergamo. Cioè, sempre un po' straniera, in tutti e due i posti."
     ],
     [
      "A",
      "È un'esperienza che, in fondo, conoscevano anche gli italiani emigrati in Argentina o in Germania."
     ],
     [
      "B",
      "Esattamente, ed è un punto che mi sta molto a cuore. Molti anziani con cui ho parlato mi hanno raccontato che i loro figli, nati a Buenos Aires o a Stoccarda, vivevano la stessa divisione. La differenza è che oggi l'Italia si trova dall'altra parte dello specchio."
     ],
     [
      "A",
      "Una domanda dal pubblico: è vero che questi ragazzi parlano peggio l'italiano?"
     ],
     [
      "B",
      "No, ed è uno dei pregiudizi più diffusi. Una professoressa mi ha raccontato che all'inizio dell'anno pensava che un suo alunno non capisse bene l'italiano, perché era timido e parlava poco. Poi ha scoperto che parlava perfettamente anche il bergamasco, meglio di lei. Diciamo che spesso il problema non è la lingua, ma lo sguardo di chi ascolta."
     ],
     [
      "A",
      "E le famiglie? Che rapporto hanno con la lingua d'origine?"
     ],
     [
      "B",
      "Qui c'è molta varietà. Alcuni genitori mi hanno detto che volevano che i figli parlassero solo italiano, per paura che fossero discriminati. Altri, al contrario, temevano che dimenticassero l'arabo o il cinese. Oggi, però, vedo una tendenza nuova: i ragazzi stessi, verso i vent'anni, decidono di recuperare la lingua dei genitori."
     ],
     [
      "A",
      "Perché proprio verso i vent'anni?"
     ],
     [
      "B",
      "Perché è l'età in cui ci si chiede chi si è. E si scopre, spesso con sorpresa, che si può essere due cose insieme senza doversi scusare."
     ],
     [
      "A",
      "Mi sembra una bella conclusione. Grazie ancora, professore, e grazie a tutti voi."
     ]
    ],
    "gloss": {
     "chiede": "(ci si chiede chi si è) uno se pregunta quién es: *si* impersonal; con un verbo reflexivo, *ci si* (semana 36)",
     "cui": "(in cui, con cui…) en el que, con el que: *cui* es el relativo después de preposición (semana 34)",
     "intervento": "exposición, ponencia",
     "trattino": "guioncito",
     "cuore": "(stare a cuore) importar mucho",
     "specchio": "espejo",
     "pregiudizi": "prejuicios",
     "bergamasco": "dialecto de Bérgamo",
     "sguardo": "mirada",
     "discriminati": "discriminados",
     "dimenticassero": "olvidaran",
     "scusare": "(scusarsi) disculparse"
    },
    "questions": [
     [
      "Che cosa significa «italiani con il trattino»?",
      [
       "Stranieri che non parlano bene l'italiano",
       "Giovani che uniscono due identità",
       "Italiani che vivono all'estero da anni",
       "Cittadini con due passaporti diversi"
      ],
      "Giovani che uniscono due identità"
     ],
     [
      "Quale parallelo propone il professore?",
      [
       "Con gli studenti italiani in Erasmus",
       "Con i lavoratori stagionali stranieri",
       "Con i figli degli emigrati italiani",
       "Con le minoranze linguistiche delle Alpi"
      ],
      "Con i figli degli emigrati italiani"
     ],
     [
      "Che cosa dimostra l'episodio dell'alunno timido?",
      [
       "Che il dialetto è più facile dell'italiano",
       "Che la scuola non aiuta gli alunni stranieri",
       "Che i ragazzi timidi imparano più lentamente",
       "Che il pregiudizio inganna chi osserva"
      ],
      "Che il pregiudizio inganna chi osserva"
     ],
     [
      "Che cosa temevano alcuni genitori?",
      [
       "Che i figli fossero discriminati",
       "Che i figli non trovassero un lavoro",
       "Che la scuola vietasse l'arabo",
       "Che i figli tornassero nel Paese d'origine"
      ],
      "Che i figli fossero discriminati"
     ],
     [
      "Quale tendenza nuova osserva il professore?",
      [
       "I giovani rifiutano l'italiano standard",
       "I giovani riscoprono la lingua dei genitori",
       "Le famiglie tornano nei Paesi d'origine",
       "I giovani parlano soltanto il dialetto"
      ],
      "I giovani riscoprono la lingua dei genitori"
     ]
    ],
    "vf": [
     [
      "La studentessa di Bergamo si sentiva straniera in entrambi i Paesi.",
      "vero"
     ],
     [
      "Secondo il professore, questi ragazzi parlano male l'italiano.",
      "falso"
     ],
     [
      "Il libro del professore uscirà il prossimo anno.",
      "non si dice"
     ],
     [
      "Tutti i genitori intervistati volevano che i figli parlassero solo italiano.",
      "falso"
     ]
    ]
   },
   "compito": {
    "genre": "recensione",
    "title": "Recensione del racconto «La casa di via Roma»",
    "fonte": "lettura",
    "t": "La rivista online di un'associazione di italiani all'estero ti chiede una recensione del racconto «La casa di via Roma». Scrivi la recensione con un titolo (148-208 parole, registro standard) in cui presenti la trama senza svelare il finale, commenti i personaggi e lo stile, e dici se consiglieresti il racconto e a quali lettori.",
    "es": "Reseña con título: trama sin spoilers, personajes, estilo y recomendación. Cuidá la concordancia de tiempos al contar la trama en pasado (decise che sarebbe andato…).",
    "min": 148,
    "max": 208,
    "punti": [
     [
      "presentar la trama sin revelar el final",
      [
       "trama",
       "nonno",
       "narra",
       "racconta"
      ]
     ],
     [
      "comentar los personajes",
      [
       "personagg",
       "nunziata",
       "protagonista"
      ]
     ],
     [
      "comentar el estilo",
      [
       "stile",
       "scrittura",
       "linguaggio"
      ]
     ],
     [
      "recomendar el cuento y a quién",
      [
       "consigli",
       "lettori",
       "raccomand"
      ]
     ]
    ],
    "model": "«La casa di via Roma»: un viaggio all'indietro\n\nIl racconto narra la storia di un giovane argentino che, dopo aver ottenuto la cittadinanza italiana, decide di visitare Pietrafonda, il paesino italiano che suo nonno aveva lasciato nel 1951. Il ragazzo cerca una casa con la porta verde e un mare che, a quanto pare, dal paese non si vede. Non svelo che cosa trova: dico solo che la risposta è più sorprendente, e più tenera, di quanto il lettore si aspetti.\n\nI personaggi sono pochi ma ben costruiti. Nunziata, l'anziana che accoglie il protagonista, è indimenticabile: ironica, generosa, custode della memoria del paese. Il nonno, anche se è assente, è la presenza più forte del testo.\n\nLo stile è semplice e preciso, senza sentimentalismi. L'autore usa pochi dettagli, come una valigia di cartone o un piatto di fichi promesso, per evocare un mondo intero.\n\nConsiglio questo racconto a chiunque abbia radici lontane, e in particolare ai discendenti degli emigranti in America Latina: molti ci ritroveranno la storia della propria famiglia. Per me è stata una lettura davvero commovente.",
    "gloss": {
     "Non svelo": "no revelo, no cuento",
     "a quanto pare": "por lo visto, según parece",
     "tenera": "tierna",
     "custode": "guardiana",
     "fichi": "higos",
     "ci ritroveranno": "van a encontrar ahí (ci = en el cuento)"
    }
   },
   "breve": {
    "title": "Museo dell'Emigrazione, sala tre",
    "genre": "audioguida",
    "es": "La audioguía de un museo de la emigración italiana presenta la sala de las valijas y las cartas.",
    "speaker": "Audioguida",
    "voice": 0,
    "text": [
     "Benvenuti nella sala tre del Museo dell'Emigrazione italiana. Le valigie che vedete nella vetrina centrale sono state donate dalle famiglie degli emigranti. La più piccola, di cartone, apparteneva a una ragazza di sedici anni che nel 1951 è partita da Genova per Buenos Aires.",
     "Molti emigranti credevano che sarebbero tornati dopo pochi anni, e per questo portavano con sé pochissimo: qualche vestito, una fotografia, a volte un pugno di terra del paese. Pochi immaginavano che il viaggio sarebbe durato più di tre settimane e che non avrebbero più rivisto i genitori.",
     "Sulla parete a destra trovate le lettere che gli emigranti scrivevano a casa. Spesso le scriveva qualcun altro, perché molti non sapevano scrivere: in quel caso pagavano un compaesano o chiedevano aiuto al parroco.",
     "Premete il numero quattro per ascoltare alcune di queste lettere lette da attori. Se volete continuare la visita, la sala quattro, dedicata al ritorno, si trova al piano superiore."
    ],
    "tabella": [
     [
      "Anno in cui è partita la ragazza",
      "1951",
      [
       "millenovecentocinquantuno"
      ]
     ],
     [
      "Porto di partenza",
      "Genova",
      []
     ],
     [
      "Durata del viaggio",
      "più di tre settimane",
      [
       "tre settimane",
       "oltre tre settimane",
       "piu di 3 settimane",
       "3 settimane"
      ]
     ],
     [
      "Numero da premere per ascoltare le lettere",
      "4",
      [
       "quattro"
      ]
     ]
    ],
    "info": [
     [
      "Il museo ha comprato le valigie.",
      false
     ],
     [
      "La valigia più piccola era di cartone.",
      true
     ],
     [
      "Molti pensavano di tornare dopo pochi anni.",
      true
     ],
     [
      "Gli emigranti portavano con sé molti mobili.",
      false
     ],
     [
      "Alcuni pagavano qualcuno per scrivere le lettere.",
      true
     ],
     [
      "La sala quattro è al piano terra.",
      false
     ]
    ],
    "gloss": {
     "donate": "donadas",
     "pugno": "puñado",
     "compaesano": "paisano, del mismo pueblo"
    }
   }
  },
  {
   "week": 33,
   "level": "B2",
   "lettura": {
    "title": "Parto o resto? La rubrica di Anna Lodi",
    "emoji": "💼",
    "genre": "rubrica di consigli",
    "grammar": "periodo ipotetico (tre tipi)",
    "text": "Cara Anna, ho ventinove anni, vivo a Bari e da tre anni lavoro con un contratto a tempo indeterminato in un'azienda di logistica. Lo stipendio non è alto, ma è sicuro, e la sera torno a casa in dieci minuti. Un mese fa un'azienda farmaceutica di Milano mi ha offerto un posto da responsabile acquisti: più soldi, più responsabilità, una carriera vera. Il problema è che il contratto è di due anni, e a Milano non conosco nessuno.\n\nSe accetto, dovrò lasciare il mio fidanzato, che qui ha appena aperto uno studio, e i miei genitori, che cominciano ad avere bisogno di me. Se rifiuto, temo di passare la vita a chiedermi che cosa mi sono persa. Mia madre dice che se avesse avuto un'occasione così alla mia età, sarebbe partita subito. Il mio ragazzo non dice niente, e forse è peggio. Che cosa faresti al mio posto? Giorgia\n\nCara Giorgia, prima di tutto una confessione: se mi avessi scritto vent'anni fa, ti avrei risposto senza esitare «parti». Ero convinta che la carriera fosse una scala da salire in fretta, e che chi restava fermo perdesse il treno. Oggi sono meno sicura, e credo che la tua domanda meriti una risposta meno istintiva.\n\nPartiamo dai fatti. Un contratto di due anni non è una condanna, ma nemmeno una garanzia. Se fossi in te, prima di decidere, chiederei all'azienda milanese alcune cose concrete: se esiste una reale possibilità di stabilizzazione, se prevedono un contributo per il trasferimento, e se una parte del lavoro si può svolgere a distanza. Se le risposte saranno vaghe, avrai già un'informazione importante. Se invece saranno precise e messe per iscritto, la proposta diventerà molto più seria.\n\nPoi ci sono le persone. Scrivi che il tuo ragazzo non dice niente. Forse tace perché teme che, se parlasse, influenzerebbe la tua scelta. Oppure perché non vuole ammettere che ha paura. In ogni caso, se non ne parlate apertamente adesso, rischiate di ritrovarvi fra due anni con un rancore che nessuno dei due ha scelto. Quanto ai tuoi genitori: se avessero davvero bisogno di assistenza quotidiana, la situazione sarebbe diversa. Da quello che racconti, però, non mi sembra ancora il caso, e Milano non è Sydney.\n\nInfine, una cosa su tua madre. Quando dice che se avesse avuto la tua occasione sarebbe partita, sta parlando di sé, non di te. È un rimpianto legittimo, ma non è una bussola. La domanda giusta non è «che cosa avrebbe fatto lei», ma «che cosa ti farebbe sentire viva fra cinque anni».\n\nIo non so quale sia la risposta. So però che se decidi per paura, in un senso o nell'altro, te ne pentirai. Se decidi dopo aver fatto tutte le domande, qualunque cosa succeda, sarà una scelta tua. Anna",
    "gloss": {
     "caso": "(non mi sembra il caso) no me parece que haga falta: *non è il caso* = no corresponde",
     "quanto": "(quanto a) en cuanto a",
     "indeterminato": "(a tempo indeterminato) efectivo, sin fecha de fin",
     "acquisti": "compras",
     "fidanzato": "novio",
     "esitare": "dudar",
     "scala": "escalera",
     "istintiva": "instintiva, impulsiva",
     "condanna": "condena",
     "stabilizzazione": "pase a planta permanente",
     "trasferimento": "mudanza, traslado",
     "svolgere": "realizar",
     "vaghe": "vagas",
     "iscritto": "(per iscritto) por escrito",
     "tace": "se calla",
     "ritrovarvi": "encontrarse (ustedes)",
     "rancore": "rencor",
     "quotidiana": "diaria",
     "rimpianto": "pena por lo que no se hizo",
     "bussola": "brújula",
     "pentirai": "(te ne pentirai) te vas a arrepentir",
     "qualunque": "cualquier"
    },
    "questions": [
     [
      "Qual è il dilemma di Giorgia?",
      [
       "Scegliere tra due aziende di logistica della sua città",
       "Scegliere tra sicurezza a casa e carriera altrove",
       "Decidere se sposarsi o riprendere gli studi",
       "Convincere il fidanzato a trasferirsi a Milano"
      ],
      "Scegliere tra sicurezza a casa e carriera altrove"
     ],
     [
      "Come è cambiato nel tempo il punto di vista di Anna?",
      [
       "Oggi è più favorevole alla carriera",
       "Oggi è più prudente di un tempo",
       "Non ha mai cambiato idea sul tema",
       "Oggi pensa che partire sia sempre un errore"
      ],
      "Oggi è più prudente di un tempo"
     ],
     [
      "Perché Anna consiglia di fare domande all'azienda?",
      [
       "Perché così si può ottenere uno stipendio molto più alto",
       "Perché le risposte mostrano se l'offerta è seria",
       "Perché l'azienda si aspetta una trattativa",
       "Perché il contratto potrebbe essere irregolare"
      ],
      "Perché le risposte mostrano se l'offerta è seria"
     ],
     [
      "Che cosa pensa Anna della frase della madre di Giorgia?",
      [
       "È l'argomento più importante da considerare",
       "Dimostra che la madre è egoista",
       "Esprime un rimpianto suo, non un criterio",
       "È falsa, perché la madre non ebbe mai offerte"
      ],
      "Esprime un rimpianto suo, non un criterio"
     ],
     [
      "Qual è il messaggio finale della rubrica?",
      [
       "Conta decidere con consapevolezza, non per paura",
       "È sempre meglio partire da giovani",
       "È sempre meglio restare vicino alla propria famiglia",
       "Bisogna seguire il parere dei genitori"
      ],
      "Conta decidere con consapevolezza, non per paura"
     ]
    ],
    "vf": [
     [
      "Giorgia ha un contratto a tempo indeterminato.",
      "vero"
     ],
     [
      "L'offerta di Milano è a tempo indeterminato.",
      "falso"
     ],
     [
      "Il fidanzato di Giorgia ha ricevuto un'offerta a Milano.",
      "non si dice"
     ],
     [
      "Anna ha cambiato lavoro più volte nella sua vita.",
      "non si dice"
     ],
     [
      "Secondo Anna, i genitori di Giorgia hanno già bisogno di assistenza quotidiana.",
      "falso"
     ]
    ],
    "hunt": {
     "label": "Tocá los verbos de los periodi ipotetici (en la condición y en la consecuencia)",
     "targets": [
      "accetto",
      "dovrò",
      "rifiuto",
      "temo",
      "avesse",
      "sarebbe",
      "avessi",
      "avrei",
      "fossi",
      "chiederei",
      "saranno",
      "avrai",
      "diventerà",
      "parlasse",
      "influenzerebbe",
      "parlate",
      "rischiate",
      "avessero",
      "decidi",
      "pentirai",
      "sarà"
     ]
    }
   },
   "ascolto": {
    "title": "Tre strade dopo la fabbrica",
    "genre": "trasmissione radiofonica di consulenza",
    "es": "En un programa de radio sobre trabajo, una orientadora laboral atiende la llamada de un oyente de Brescia que perdió el empleo y duda entre tres caminos.",
    "speakers": [
     "Silvia Moro, orientatrice",
     "Andrea, ascoltatore"
    ],
    "turns": [
     [
      "A",
      "Buonasera, sei in onda con «Lavori in corso». Chi c'è al telefono?"
     ],
     [
      "B",
      "Buonasera, sono Andrea, ho quarantacinque anni e chiamo da Brescia."
     ],
     [
      "A",
      "Ciao Andrea. Raccontaci."
     ],
     [
      "B",
      "Allora, lavoravo in una fabbrica di componenti per auto, e a gennaio l'azienda ha chiuso lo stabilimento. Ho vent'anni di esperienza come tecnico di manutenzione, ma adesso, sinceramente, non so da che parte cominciare."
     ],
     [
      "A",
      "Mi dispiace. Immagino che non sia facile. Hai già delle idee?"
     ],
     [
      "B",
      "Ne ho tre, ed è proprio questo il problema. La prima: un mio ex collega lavora in Baviera e dice che, se andassi lì, troverei lavoro in un mese. La seconda: seguire un corso per diventare installatore di impianti solari. La terza, quella che mi piace di più ma mi fa più paura: aprire un'officina tutta mia."
     ],
     [
      "A",
      "Tre strade molto diverse. Posso farti qualche domanda?"
     ],
     [
      "B",
      "Certo."
     ],
     [
      "A",
      "Parli tedesco?"
     ],
     [
      "B",
      "No, per niente. Ecco, questo è il punto debole."
     ],
     [
      "A",
      "E la tua famiglia che cosa ne pensa?"
     ],
     [
      "B",
      "Mia moglie lavora qui, i ragazzi vanno al liceo. Se partissi, partirei da solo, almeno all'inizio."
     ],
     [
      "A",
      "Allora ti dico come la vedo. Se tu avessi trent'anni e nessun legame, ti direi: vai in Germania e impara la lingua lì. Ma nella tua situazione il costo sarebbe altissimo. Il corso sugli impianti solari, invece, è una scelta intelligente: è un settore che cerca tecnici, e la tua esperienza conta. Se ti iscrivi adesso, in pochi mesi puoi essere operativo."
     ],
     [
      "B",
      "E l'officina?"
     ],
     [
      "A",
      "L'officina non la escluderei, anzi. Ma io la vedrei come un secondo passo. Se avessi aperto un'attività a gennaio, subito dopo la chiusura, avresti rischiato la liquidazione e i risparmi di famiglia. Tra un paio d'anni, con un lavoro stabile e qualche cliente, sarà un'altra storia."
     ],
     [
      "B",
      "Cioè, prima il corso, poi eventualmente l'officina."
     ],
     [
      "A",
      "Esatto. E un'ultima cosa: non restare solo con queste decisioni. Parlane con tua moglie, e anche con i ragazzi."
     ],
     [
      "B",
      "Grazie, davvero. Mi ha già chiarito le idee."
     ]
    ],
    "gloss": {
     "onda": "(in onda) al aire",
     "stabilimento": "planta (fábrica)",
     "manutenzione": "mantenimiento",
     "impianti": "instalaciones",
     "officina": "taller",
     "legame": "vínculo, atadura",
     "iscrivi": "anotás",
     "operativo": "trabajando, en actividad",
     "liquidazione": "indemnización",
     "risparmi": "ahorros"
    },
    "questions": [
     [
      "Perché Andrea chiama la trasmissione?",
      [
       "Vuole protestare per la chiusura improvvisa della fabbrica",
       "Ha perso il lavoro e non sa che strada scegliere",
       "Cerca un socio per aprire un'officina",
       "Vuole informazioni su un corso di tedesco"
      ],
      "Ha perso il lavoro e non sa che strada scegliere"
     ],
     [
      "Quale ostacolo vede la consulente nell'opzione tedesca?",
      [
       "Il costo altissimo degli affitti in Baviera",
       "La mancanza di lavoro per i tecnici",
       "La lingua e la lontananza dalla famiglia",
       "L'età ormai troppo avanzata di Andrea"
      ],
      "La lingua e la lontananza dalla famiglia"
     ],
     [
      "Che cosa consiglia di fare per prima cosa?",
      [
       "Seguire il corso sugli impianti solari",
       "Aprire subito l'officina",
       "Trasferirsi in Germania con tutta la famiglia",
       "Aspettare che riapra la fabbrica"
      ],
      "Seguire il corso sugli impianti solari"
     ],
     [
      "Che cosa pensa la consulente dell'officina?",
      [
       "È un'idea da scartare del tutto",
       "È un buon progetto, ma per più avanti",
       "È la scelta migliore da fare subito",
       "È troppo costosa per chi ha una famiglia"
      ],
      "È un buon progetto, ma per più avanti"
     ],
     [
      "Come si sente Andrea alla fine della telefonata?",
      [
       "Ancora più confuso di prima",
       "Deluso dai consigli ricevuti",
       "Con le idee più chiare",
       "Arrabbiato con la consulente"
      ],
      "Con le idee più chiare"
     ]
    ],
    "vf": [
     [
      "Andrea ha lavorato vent'anni come tecnico.",
      "vero"
     ],
     [
      "Andrea parla un po' di tedesco.",
      "falso"
     ],
     [
      "La moglie di Andrea è contraria all'officina.",
      "non si dice"
     ],
     [
      "La consulente esclude del tutto l'idea dell'officina.",
      "falso"
     ]
    ]
   },
   "compito": {
    "genre": "lettera_formale",
    "title": "Lettera all'ufficio del personale",
    "fonte": "lettura",
    "t": "Immagina di essere Giorgia: hai deciso di seguire i consigli della rubrica di Anna Lodi prima di rispondere all'offerta dell'azienda milanese. Scrivi una lettera formale all'ufficio del personale (154-214 parole, registro formale) in cui ringrazi per l'offerta, esprimi interesse e fai le domande concrete suggerite nella rubrica: possibilità di stabilizzazione, contributo per il trasferimento, lavoro a distanza. Usa almeno due periodi ipotetici.",
    "es": "Sos Giorgia. Carta formal a Recursos Humanos: agradecer, mostrar interés y hacer las tres preguntas que sugiere la columna. Meté al menos dos periodi ipotetici (se così fosse…, se le condizioni lo permetteranno…).",
    "min": 154,
    "max": 214,
    "punti": [
     [
      "agradecer la oferta",
      [
       "ringrazi",
       "grazie"
      ]
     ],
     [
      "preguntar por el pase a planta",
      [
       "stabilizz",
       "indeterminato",
       "rinnov"
      ]
     ],
     [
      "preguntar por la ayuda para la mudanza",
      [
       "trasferiment",
       "trasloco",
       "alloggio"
      ]
     ],
     [
      "preguntar por el trabajo a distancia",
      [
       "distanza",
       "remoto",
       "smart"
      ]
     ],
     [
      "fórmula de cierre formal",
      [
       "distinti saluti",
       "cordiali saluti",
       "in attesa"
      ]
     ]
    ],
    "model": "Spettabile Ufficio del Personale,\n\nvi ringrazio per la proposta di lavoro come responsabile acquisti che mi avete inviato la settimana scorsa. Sono molto interessata alla posizione e all'idea di contribuire alla crescita della vostra azienda.\n\nPrima di prendere una decisione definitiva, tuttavia, vorrei chiarire alcuni aspetti, dal momento che accettare significherebbe trasferirmi da Bari a Milano.\n\nIn primo luogo, il contratto proposto ha una durata di due anni. Vi sarei grata se poteste indicarmi quali sono, in concreto, le possibilità di stabilizzazione alla scadenza e secondo quali criteri verrebbero valutate.\n\nIn secondo luogo, vorrei sapere se l'azienda prevede un contributo per le spese di trasferimento o un aiuto nella ricerca di un alloggio. Se così fosse, la mia decisione sarebbe senz'altro più semplice.\n\nInfine, vi chiedo se sia possibile svolgere una parte dell'attività a distanza, per esempio uno o due giorni alla settimana.\n\nSe le condizioni lo permetteranno, sarò felice di iniziare già dal mese prossimo. Resto in attesa di un vostro gentile riscontro.\n\nDistinti saluti,\nGiorgia Lamanna",
    "gloss": {
     "Spettabile": "fórmula de saludo a una empresa u oficina: «De mi consideración»",
     "dal momento che": "dado que, ya que (se ve en la semana 49)",
     "stabilizzazione": "pase a planta permanente, contrato por tiempo indeterminado",
     "alla scadenza": "al vencimiento (del contrato)",
     "Vi sarei grata se poteste": "les agradecería que pudieran (se + congiuntivo imperfetto)",
     "alloggio": "vivienda, alojamiento",
     "senz'altro": "sin duda",
     "riscontro": "respuesta"
    }
   },
   "breve": {
    "title": "Annunci al binario",
    "genre": "annuncio in stazione",
    "es": "Los avisos por altoparlante en una estación: un tren demorado, un cambio de andén y una prohibición.",
    "speaker": "Voce della stazione",
    "voice": 1,
    "text": [
     "Attenzione! Il treno Frecciarossa 9542 per Milano Centrale, previsto in partenza alle 14 e 20 dal binario 7, partirà con un ritardo stimato di 35 minuti per un guasto a un treno che lo precede. Ci scusiamo per il disagio.",
     "I viaggiatori del Frecciarossa 9542 che hanno una coincidenza a Bologna possono rivolgersi al personale di bordo. Se il ritardo dovesse superare i sessanta minuti, i viaggiatori avrebbero diritto a un rimborso del venticinque per cento del prezzo del biglietto.",
     "Attenzione! Il treno regionale 3310 per Lecce, in partenza alle 14 e 35, oggi partirà dal binario 2 anziché dal binario 4. Si prega di non attraversare i binari e di utilizzare il sottopassaggio.",
     "Si ricorda che è vietato fumare in tutta la stazione, anche sulle banchine. Grazie."
    ],
    "tabella": [
     [
      "Binario del Frecciarossa per Milano",
      "7",
      [
       "sette",
       "binario 7"
      ]
     ],
     [
      "Ritardo stimato (minuti)",
      "35",
      [
       "trentacinque"
      ]
     ],
     [
      "Rimborso se il ritardo supera un'ora (%)",
      "25",
      [
       "venticinque",
       "25%",
       "25 per cento",
       "venticinque per cento"
      ]
     ],
     [
      "Binario di oggi del treno per Lecce",
      "2",
      [
       "due",
       "binario 2"
      ]
     ]
    ],
    "info": [
     [
      "Il Frecciarossa è in ritardo per un guasto a un altro treno.",
      true
     ],
     [
      "Chi ha una coincidenza a Bologna può parlare con il personale di bordo.",
      true
     ],
     [
      "Con più di un'ora di ritardo si ha diritto a un rimborso.",
      true
     ],
     [
      "Il treno per Lecce è stato cancellato.",
      false
     ],
     [
      "Per cambiare binario si possono attraversare i binari.",
      false
     ],
     [
      "Si può fumare solo sulle banchine.",
      false
     ]
    ],
    "gloss": {
     "binario": "andén, vía",
     "guasto": "avería, desperfecto",
     "coincidenza": "combinación, conexión",
     "sottopassaggio": "paso bajo nivel",
     "banchine": "andenes"
    }
   }
  },
  {
   "week": 34,
   "level": "B2",
   "lettura": {
    "title": "L'amicizia dopo i trent'anni",
    "emoji": "🤝",
    "genre": "articolo di costume",
    "grammar": "pronomi relativi (che, cui, il quale)",
    "text": "C'è un momento, di solito tra i trenta e i quarant'anni, in cui molte persone si accorgono di una cosa che nessuno aveva previsto: gli amici, quelli con cui si passavano le serate senza bisogno di organizzarsi, sono diventati impegni da fissare in agenda. Ci si scrive «dobbiamo vederci», si propone una data che poi salta, e intanto passano i mesi. Non è un dramma, ma è una piccola perdita di cui si parla poco.\n\nLe ragioni sono note. Il lavoro, che occupa sempre più spazio; i figli, per i quali ogni ora libera diventa preziosa; i traslochi, che separano persone che avevano condiviso tutto per anni. Lo psicologo Emanuele Verdi, il cui ultimo libro è dedicato proprio a questo tema, parla di «amicizie in pausa»: rapporti che nessuno ha deciso di chiudere, ma che nessuno ha più il tempo di coltivare.\n\nSecondo Verdi, il problema non è la mancanza di affetto, ma la scomparsa dei contesti in cui l'amicizia nasceva spontaneamente. A scuola, all'università, nella squadra di calcio, ci si incontrava senza cercarsi. Da adulti, invece, ogni incontro richiede un'iniziativa, e la persona che la prende rischia di sentirsi sempre quella che insiste. Chi aspetta di essere chiamato, spesso, aspetta invano.\n\nC'è poi un fenomeno più sottile, che riguarda la coppia. Molte persone, quando iniziano una relazione stabile, finiscono per concentrare nel partner tutti i bisogni che prima distribuivano tra varie amicizie: la confidenza, il divertimento, il consiglio. È una scelta comprensibile, ma pesante, sia per chi la fa sia per il partner, al quale si chiede di essere tutto. Non a caso, alcuni terapeuti di coppia consigliano di «restituire» agli amici una parte di quelle funzioni.\n\nCi sono però anche buone notizie. Le amicizie adulte, quando sopravvivono, sono spesso più profonde. Si sceglie con più cura la gente con cui passare il poco tempo libero, e si impara a distinguere le persone su cui si può contare da quelle con le quali si condividevano soltanto le abitudini. Molti raccontano di aver ritrovato, dopo anni di silenzio, un vecchio amico con il quale la conversazione è ripartita come se non si fosse mai interrotta.\n\nChe cosa si può fare, allora? Le proposte di Verdi sono sorprendentemente pratiche: fissare un appuntamento ricorrente, per esempio una cena al mese nello stesso posto, in modo che non si debba ricominciare ogni volta da capo; accettare che un'amicizia possa vivere anche di messaggi vocali e di telefonate brevi; e soprattutto smettere di tenere il conto delle telefonate. L'amicizia, conclude, non è un conto in banca in cui bisogna tenere il saldo in pari.\n\nForse la cosa più importante è ricordare che quelle amicizie in pausa non sono finite. Spesso basta un messaggio, quello che rimandiamo da mesi, per scoprire che dall'altra parte c'è qualcuno che aspettava esattamente la stessa cosa.",
    "gloss": {
     "caso": "(non a caso) no por casualidad",
     "sia": "(sia per chi... sia per...) tanto para quien... como para...: *sia... sia* = tanto... como",
     "incontrava": "(ci si incontrava) uno se encontraba: *ci si* impersonal con reflexivo (semana 36)",
     "scrive": "(ci si scrive) nos escribimos, uno se escribe: *ci si* es el *si* impersonal con un verbo reflexivo (semana 36)",
     "accorgono": "se dan cuenta",
     "impegni": "compromisos",
     "fissare": "agendar, fijar",
     "salta": "se cae, se suspende",
     "preziosa": "valiosa",
     "traslochi": "mudanzas",
     "coltivare": "cultivar, mantener",
     "scomparsa": "desaparición",
     "invano": "en vano",
     "sottile": "sutil",
     "confidenza": "intimidad, confianza",
     "pesante": "pesada",
     "restituire": "devolver",
     "sopravvivono": "sobreviven",
     "ricorrente": "fija, periódica",
     "capo": "(da capo) desde cero",
     "vocali": "(messaggi vocali) audios",
     "smettere": "dejar de",
     "saldo": "saldo",
     "pari": "(in pari) equilibrado",
     "rimandiamo": "postergamos"
    },
    "questions": [
     [
      "Qual è l'idea centrale del testo?",
      [
       "Dopo i trent'anni non si hanno più veri amici",
       "Da adulti l'amicizia si complica, ma resiste",
       "La coppia conta più di qualsiasi amicizia",
       "Solo gli amici d'infanzia sono amici veri"
      ],
      "Da adulti l'amicizia si complica, ma resiste"
     ],
     [
      "Che cosa intende Verdi con «amicizie in pausa»?",
      [
       "Amicizie finite dopo un brutto litigio",
       "Rapporti mai chiusi ma trascurati",
       "Rapporti tra ex compagni di scuola",
       "Amicizie che vivono solo sui social"
      ],
      "Rapporti mai chiusi ma trascurati"
     ],
     [
      "Perché da giovani era più facile stringere amicizie?",
      [
       "Perché si era meno esigenti e più ingenui",
       "Perché si avevano più soldi da spendere",
       "Perché la vita offriva incontri spontanei",
       "Perché non esistevano ancora i telefoni"
      ],
      "Perché la vita offriva incontri spontanei"
     ],
     [
      "Quale rischio per la coppia descrive il quarto paragrafo?",
      [
       "Caricare il partner di troppe aspettative",
       "Isolarsi dalla propria famiglia d'origine",
       "Litigare continuamente a causa degli amici",
       "Annoiarsi dopo pochi anni di convivenza"
      ],
      "Caricare il partner di troppe aspettative"
     ],
     [
      "Che cosa significa la metafora del «conto in banca»?",
      [
       "L'amicizia costa molto denaro",
       "Non bisogna calcolare chi dà di più",
       "Bisogna risparmiare tempo per gli amici",
       "Gli amici vanno scelti con prudenza"
      ],
      "Non bisogna calcolare chi dà di più"
     ]
    ],
    "vf": [
     [
      "Verdi ha scritto un libro sulle amicizie adulte.",
      "vero"
     ],
     [
      "Secondo il testo, le amicizie adulte sono sempre più superficiali.",
      "falso"
     ],
     [
      "Verdi ha perso molti amici dopo essersi sposato.",
      "non si dice"
     ],
     [
      "Verdi consiglia, per esempio, una cena fissa al mese.",
      "vero"
     ],
     [
      "Il testo sostiene che i messaggi vocali distruggono l'amicizia.",
      "falso"
     ]
    ],
    "hunt": {
     "label": "Tocá los pronombres relativos cui, il quale / la quale y chi",
     "targets": [
      "cui",
      "quale",
      "quali",
      "chi"
     ]
    }
   },
   "ascolto": {
    "title": "Lui vive a Lisbona",
    "genre": "chiacchierata tra amiche",
    "es": "Dos amigas se ponen al día por teléfono: una acaba de pasar unos días con un chico que vive en otro país, y la otra tiene algo que decirle.",
    "speakers": [
     "Chiara",
     "Valentina"
    ],
    "turns": [
     [
      "A",
      "Vale! Finalmente. Ti ho scritto tre volte, eh. Ero quasi preoccupata."
     ],
     [
      "B",
      "Lo so, lo so, scusami. Hai ragione. È stata una settimana… boh, pazzesca."
     ],
     [
      "A",
      "Pazzesca in che senso? Bella o brutta?"
     ],
     [
      "B",
      "Tutte e due. Cioè… ti ricordi Matteo? Il ragazzo di cui ti avevo parlato a Capodanno?"
     ],
     [
      "A",
      "Aspetta. Quello che hai conosciuto al matrimonio di tua cugina? Quello che lavora a Lisbona?"
     ],
     [
      "B",
      "Esatto, lui. Niente, è venuto a trovarmi. Cinque giorni."
     ],
     [
      "A",
      "Cinque giorni! E me lo dici così? Allora, com'è andata?"
     ],
     [
      "B",
      "Benissimo. Cioè, quasi troppo bene. È questo il problema."
     ],
     [
      "A",
      "In che senso il problema?"
     ],
     [
      "B",
      "Nel senso che adesso lui è tornato a Lisbona e io sto qui, in un appartamento in cui tutto mi ricorda lui. Sembro una ragazzina, lo so."
     ],
     [
      "A",
      "Ma no, dai, è normale. E avete… cioè, avete parlato di come andare avanti?"
     ],
     [
      "B",
      "Un po'. Lui dice che la distanza non è un problema, tipo che ci sono i voli economici, le videochiamate…"
     ],
     [
      "A",
      "Mh."
     ],
     [
      "B",
      "Io però… vabbè, lo sai. Una relazione a distanza l'ho già vissuta, quella con Luca, e sai com'è finita."
     ],
     [
      "A",
      "Sì, ma scusa… Luca era una persona con la quale non riuscivi a parlare nemmeno nella stessa stanza. Non è che il problema fosse la distanza."
     ],
     [
      "B",
      "Mh. Forse hai ragione. Non ci avevo mai pensato in questi termini."
     ],
     [
      "A",
      "Te lo giuro."
     ],
     [
      "B",
      "È vero, eh. Anche quando cenavamo insieme io parlavo e lui guardava il telefono. Matteo invece mi ascolta, mi fa domande, si ricorda le cose che gli racconto."
     ],
     [
      "A",
      "E poi, scusa se te lo dico…"
     ],
     [
      "B",
      "Dimmi."
     ],
     [
      "A",
      "Tu hai sempre messo i fidanzati al centro di tutto. Quando stavi con Luca sparivi. Per mesi. Io ci ero rimasta male, sai?"
     ],
     [
      "B",
      "Davvero? Ma… non me l'avevi mai detto."
     ],
     [
      "A",
      "Te lo dico adesso. Con affetto, eh. È che questa volta non voglio che tu rinunci alle cose e alle persone a cui tieni. Tipo il corso di teatro, che avevi mollato proprio in quel periodo."
     ],
     [
      "B",
      "Il teatro, sì… Hai ragione. Senti, facciamo così: sabato cena da me, solo noi due, e ti racconto tutto con calma. Senza telefono."
     ],
     [
      "A",
      "Senza telefono? Tu? Boh, questo lo voglio proprio vedere."
     ],
     [
      "B",
      "Promesso! Anzi, se lui chiama, rispondo il giorno dopo."
     ],
     [
      "A",
      "Ecco, questa è l'amica che conosco. Allora a sabato. Il dolce lo porto io."
     ]
    ],
    "gloss": {
     "pazzesca": "de locos",
     "capodanno": "Año Nuevo",
     "cugina": "prima",
     "videochiamate": "videollamadas",
     "stanza": "cuarto, habitación",
     "sparivi": "desaparecías",
     "rimasta": "(ci ero rimasta male) me había dolido",
     "rinunci": "renuncies",
     "tieni": "(a cui tieni) que te importan",
     "mollato": "largado, abandonado",
     "promesso": "prometido",
     "boh": "qué sé yo, ni idea (muletilla)",
     "vabbè": "bueno, en fin (muletilla)",
     "tipo": "(muletilla) como, onda",
     "giuro": "(te lo giuro) te lo juro"
    },
    "questions": [
     [
      "Perché Chiara era preoccupata?",
      [
       "Valentina aveva perso il lavoro",
       "Valentina non rispondeva ai messaggi",
       "Valentina si era trasferita a Lisbona",
       "Valentina aveva litigato con Matteo"
      ],
      "Valentina non rispondeva ai messaggi"
     ],
     [
      "Dove si sono conosciuti Valentina e Matteo?",
      [
       "A una festa di Capodanno",
       "Durante un viaggio a Lisbona",
       "Al matrimonio di una cugina",
       "Su un'applicazione di incontri"
      ],
      "Al matrimonio di una cugina"
     ],
     [
      "Che cosa preoccupa Valentina?",
      [
       "Che Matteo abbia un'altra ragazza",
       "Che la distanza rovini la storia",
       "Che Chiara sia gelosa di Matteo",
       "Che i genitori non approvino Matteo"
      ],
      "Che la distanza rovini la storia"
     ],
     [
      "Secondo Chiara, perché era finita la storia con Luca?",
      [
       "Per la distanza tra le due città",
       "Per colpa del lavoro di Luca",
       "Perché i due non comunicavano",
       "Per le pressioni delle famiglie"
      ],
      "Perché i due non comunicavano"
     ],
     [
      "Che cosa rimprovera Chiara all'amica?",
      [
       "Di trascurare gli amici quando è innamorata",
       "Di cambiare fidanzato troppo spesso",
       "Di non averle mai presentato Matteo",
       "Di passare troppo tempo al telefono con lei"
      ],
      "Di trascurare gli amici quando è innamorata"
     ],
     [
      "Che cosa vuol dire Chiara con «questo lo voglio proprio vedere»?",
      [
       "Che dubita che l'amica ci riesca davvero",
       "Che vuole conoscere presto Matteo",
       "Che ha voglia di vedere un film",
       "Che vuole vedere il nuovo telefono"
      ],
      "Che dubita che l'amica ci riesca davvero"
     ]
    ],
    "vf": [
     [
      "Matteo è rimasto da Valentina cinque giorni.",
      "vero"
     ],
     [
      "Valentina non ha mai avuto relazioni a distanza.",
      "falso"
     ],
     [
      "Matteo ha intenzione di trasferirsi in Italia.",
      "non si dice"
     ],
     [
      "Le due amiche decidono di cenare insieme sabato.",
      "vero"
     ]
    ]
   },
   "compito": {
    "genre": "email_informale",
    "title": "Un'email a un amico perso di vista",
    "fonte": "lettura",
    "t": "Hai letto l'articolo «L'amicizia dopo i trent'anni» e ti sei ricordato/a di un amico o di un'amica che non senti da molto tempo. Scrivigli/le un'email (160-220 parole, registro informale) in cui racconti dell'articolo e delle «amicizie in pausa», spieghi perché vi siete persi di vista, ricordi un momento vissuto insieme e proponi un modo concreto per rivedervi o sentirvi più spesso. Usa diversi pronomi relativi (che, cui, il quale…).",
    "es": "Mail informal a un amigo con quien perdiste contacto: mencioná el artículo, explicá por qué se distanciaron, recordá algo compartido y proponé algo concreto. Usá relativos variados (di cui, con il quale…).",
    "min": 160,
    "max": 220,
    "punti": [
     [
      "mencionar el artículo y las «amicizie in pausa»",
      [
       "articolo",
       "pausa",
       "ho letto"
      ]
     ],
     [
      "explicar por qué se perdieron de vista",
      [
       "trasferit",
       "lavoro",
       "tempo",
       "persi di vista"
      ]
     ],
     [
      "recordar un momento compartido",
      [
       "ricord",
       "quella volta",
       "estate"
      ]
     ],
     [
      "proponer algo concreto",
      [
       "propongo",
       "vediamoci",
       "videochiamata",
       "cena"
      ]
     ],
     [
      "saludo y despedida informales",
      [
       "ciao",
       "un abbraccio",
       "a presto",
       "baci"
      ]
     ]
    ],
    "model": "Ciao Fede,\n\nquanto tempo! Ti scrivo perché ieri sera ho letto un articolo che mi ha fatto pensare subito a te. Parlava delle «amicizie in pausa», cioè di quei rapporti che nessuno ha deciso di chiudere ma che, un po' alla volta, si spengono per mancanza di tempo. E mi sono reso conto che la nostra è proprio una di quelle.\n\nNon c'è stato nessun litigio, lo so. Semplicemente io mi sono trasferito a Torino per lavoro, tu hai avuto la bambina, e i messaggi sono diventati sempre più rari. Ogni tanto pensavo di chiamarti, poi rimandavo, e intanto passavano i mesi.\n\nTi ricordi l'estate in cui abbiamo attraversato la Sicilia con quella Panda a cui non funzionava l'aria condizionata? Ancora oggi è il viaggio di cui parlo di più, e tu sei l'amico con il quale ho riso di più in vita mia.\n\nAllora ti propongo una cosa semplice: una videochiamata la prima domenica di ogni mese, anche solo mezz'ora. E a dicembre, quando torno a Bari, una cena vera, solo noi due.\n\nChe ne dici? Rispondimi quando puoi, senza fretta.\n\nUn abbraccio forte,\nPaolo",
    "gloss": {
     "quanto tempo!": "¡tanto tiempo!",
     "si spengono": "se apagan",
     "Ogni tanto": "de vez en cuando",
     "rimandavo": "lo postergaba, lo iba dejando",
     "Che ne dici?": "¿qué te parece?"
    }
   },
   "breve": {
    "title": "Ciao Chiara, sono Valentina",
    "genre": "messaggio in segreteria",
    "es": "Una amiga le deja un mensaje de voz a otra para organizar una cena con las compañeras de departamento de la facultad.",
    "speaker": "Valentina",
    "voice": 1,
    "text": [
     "Ciao Chiara, sono Valentina. Ti ho chiamata due volte ma hai il telefono spento, quindi ti lascio un messaggio. Ti ricordi di Marta, quella con cui dividevamo l'appartamento a Bologna? Mi ha scritto ieri: torna in Italia per due settimane e vorrebbe rivederci tutte.",
     "Ho pensato a una cena sabato 21, nel ristorante di cui ti parlavo, quello in via Saragozza dove fanno dei tortellini buonissimi. Ho già sentito Giulia, che viene sicuramente, e Silvia, la quale però deve ancora chiedere al marito se può tenere i bambini.",
     "Ho prenotato per le otto e mezza, per cinque persone. Se non puoi, dimmelo entro giovedì, così cambio la prenotazione, che è gratuita fino a due giorni prima.",
     "Dai, non facciamo passare altri dieci anni! Chiamami quando senti questo messaggio. Un bacio."
    ],
    "tabella": [
     [
      "Città in cui vivevano insieme",
      "Bologna",
      []
     ],
     [
      "Giorno della cena",
      "sabato 21",
      [
       "21",
       "sabato",
       "il 21",
       "sabato ventuno"
      ]
     ],
     [
      "Ora della prenotazione",
      "20.30",
      [
       "20:30",
       "otto e mezza",
       "8 e mezza",
       "8.30",
       "le otto e mezza"
      ]
     ],
     [
      "Numero di persone",
      "5",
      [
       "cinque"
      ]
     ],
     [
      "Ultimo giorno per rispondere",
      "giovedì",
      [
       "entro giovedì"
      ]
     ]
    ],
    "info": [
     [
      "Chiara aveva il telefono spento.",
      true
     ],
     [
      "Marta torna a vivere in Italia.",
      false
     ],
     [
      "Silvia deve organizzarsi per i bambini.",
      true
     ],
     [
      "Giulia non può venire.",
      false
     ],
     [
      "Cambiare la prenotazione costa dieci euro.",
      false
     ],
     [
      "Valentina vuole rivedere presto le amiche.",
      true
     ]
    ],
    "gloss": {
     "spento": "apagado",
     "dividevamo": "compartíamos",
     "prenotazione": "reserva"
    }
   }
  },
  {
   "week": 35,
   "level": "B2",
   "lettura": {
    "title": "Il lago che nessuno voleva più",
    "emoji": "🏞️",
    "genre": "reportage",
    "grammar": "la forma passiva (essere, venire, andare)",
    "text": "Fino a dieci anni fa il lago di Vallombra, in una valle laterale del Trentino, veniva citato soltanto nei rapporti sull'inquinamento. Le sue acque erano state invase dalle alghe, le rive venivano usate come discarica abusiva e la spiaggetta del paese era stata chiusa ai bagnanti. «Qui non passava più nessuno», racconta Elena Dalpiaz, che gestisce il piccolo bar sul molo. «Anche i pescatori erano spariti.»\n\nOggi, in una mattina di settembre, la scena è completamente diversa. Sul pontile vengono accolte le classi delle scuole della valle, un gruppo di volontari controlla le reti di protezione dei canneti e dall'acqua, finalmente trasparente, spuntano le teste di due nuotatori. Com'è stato possibile? La risposta va cercata soprattutto in una decisione presa quasi per disperazione: affidare il lago non a un solo ente, ma a un consorzio in cui sono rappresentati il Comune, gli agricoltori, i pescatori e le associazioni ambientaliste.\n\nIl primo problema da risolvere erano i fertilizzanti. Per decenni i campi intorno al lago erano stati concimati in modo eccessivo, e ogni pioggia trascinava nell'acqua azoto e fosforo, il cibo preferito delle alghe. «All'inizio gli agricoltori venivano trattati come i colpevoli, e naturalmente si chiudevano a riccio», spiega Paolo Endrizzi, agronomo e presidente del consorzio. «Poi abbiamo cambiato approccio: le fasce di terreno lungo le rive sono state piantate a siepi e alberi, e le perdite di reddito vengono compensate con un fondo comune.» Le siepi, che nel frattempo sono cresciute, trattengono buona parte delle sostanze prima che raggiungano il lago.\n\nIl secondo intervento è stato più spettacolare. Il fondale, soffocato da uno strato di fango ricco di nutrienti, è stato ossigenato con un sistema di diffusori alimentati da pannelli solari. Nello stesso periodo sono state reintrodotte alcune specie di pesci che si nutrono di larve e aiutano a mantenere l'equilibrio. Ogni intervento viene monitorato da un laboratorio universitario, e i dati vengono pubblicati ogni tre mesi sul sito del consorzio, in un linguaggio comprensibile anche a chi non è un biologo.\n\nNon tutto, però, è andato liscio. Nel terzo anno una fioritura improvvisa di alghe ha fatto temere il fallimento dell'intero progetto, e in paese le critiche non sono mancate. «Ci dicevano che i soldi andavano spesi per le strade, non per le alghe», ricorda Dalpiaz. Il consorzio ha scelto di non nascondere nulla: sono state organizzate assemblee pubbliche e i cittadini sono stati invitati a partecipare ai prelievi. Molti, che fino a quel momento erano rimasti scettici, si sono trasformati in sostenitori.\n\nResta la domanda più scomoda: il modello di Vallombra può essere esportato? Gli esperti sono prudenti. Un lago piccolo, con pochi comuni affacciati sulle rive, non va confuso con un grande bacino attraversato da interessi economici enormi. Eppure qualche lezione va imparata anche altrove. Le regole, dice Endrizzi, vanno scritte insieme a chi dovrà rispettarle; i risultati vanno comunicati con onestà, anche quando sono deludenti; e i tempi della natura vanno accettati, perché un ecosistema rovinato in cinquant'anni non viene risanato in una stagione.\n\nQuest'estate, per la prima volta dopo quindici anni, la spiaggetta è stata riaperta ai bagnanti. Il cartello del divieto non è stato buttato via: è stato appeso nel bar di Elena, accanto alle foto delle alghe. «Serve a ricordare», dice lei, «che quello che è stato distrutto può essere ricostruito, ma non da soli.»",
    "gloss": {
     "alghe": "algas",
     "rive": "orillas",
     "discarica": "basural",
     "abusiva": "ilegal, clandestina",
     "bagnanti": "bañistas",
     "molo": "muelle",
     "pontile": "embarcadero",
     "canneti": "juncales, cañaverales",
     "spuntano": "asoman",
     "consorzio": "consorcio",
     "concimati": "abonados, fertilizados",
     "trascinava": "arrastraba",
     "azoto": "nitrógeno",
     "riccio": "erizo (chiudersi a riccio: cerrarse, ponerse a la defensiva)",
     "siepi": "cercos vivos",
     "reddito": "ingreso",
     "trattengono": "retienen",
     "fondale": "fondo (del lago)",
     "soffocato": "asfixiado",
     "fango": "barro",
     "liscio": "liso (andare liscio: salir sin problemas)",
     "fioritura": "floración",
     "prelievi": "tomas de muestras",
     "scettici": "escépticos",
     "scomoda": "incómoda",
     "affacciati": "asomados, que dan a",
     "bacino": "cuenca, lago grande",
     "deludenti": "decepcionantes",
     "risanato": "saneado",
     "cartello": "cartel",
     "appeso": "colgado"
    },
    "questions": [
     [
      "Qual è l'idea principale del reportage?",
      [
       "Un lago inquinato è rinato grazie a una gestione condivisa",
       "Gli agricoltori sono stati puniti per l'inquinamento del lago",
       "Il lago è stato salvato soprattutto da un laboratorio universitario",
       "Il Comune ha affidato il lago a un'azienda privata"
      ],
      "Un lago inquinato è rinato grazie a una gestione condivisa"
     ],
     [
      "Perché, secondo Endrizzi, all'inizio gli agricoltori «si chiudevano a riccio»?",
      [
       "Perché non volevano piantare alberi sui loro campi",
       "Perché il fondo comune non era ancora stato creato",
       "Perché non si fidavano dei dati dell'università",
       "Perché si sentivano accusati invece che coinvolti"
      ],
      "Perché si sentivano accusati invece che coinvolti"
     ],
     [
      "A che cosa servono le siepi piantate lungo le rive?",
      [
       "A proteggere i canneti dai visitatori",
       "A ossigenare il fango del fondale",
       "A trattenere i fertilizzanti prima che arrivino al lago",
       "A compensare gli agricoltori per le perdite di reddito"
      ],
      "A trattenere i fertilizzanti prima che arrivino al lago"
     ],
     [
      "Come ha reagito il consorzio alle critiche del terzo anno?",
      [
       "Ha sospeso gli interventi per un anno intero",
       "Ha scelto la trasparenza e ha coinvolto i cittadini",
       "Ha spostato i fondi sulla manutenzione delle strade",
       "Ha smesso di pubblicare i dati per evitare polemiche"
      ],
      "Ha scelto la trasparenza e ha coinvolto i cittadini"
     ],
     [
      "Che cosa vuole ricordare Elena con il cartello appeso nel bar?",
      [
       "Che il divieto di balneazione potrebbe tornare",
       "Che i turisti devono rispettare le regole del lago",
       "Che lei era contraria alla riapertura della spiaggia",
       "Che il risanamento è stato un lavoro collettivo"
      ],
      "Che il risanamento è stato un lavoro collettivo"
     ]
    ],
    "vf": [
     [
      "Prima del risanamento, la spiaggetta del paese era chiusa ai bagnanti.",
      "vero"
     ],
     [
      "I dati del monitoraggio vengono pubblicati una volta all'anno.",
      "falso"
     ],
     [
      "Il progetto è stato finanziato in gran parte dall'Unione europea.",
      "non si dice"
     ],
     [
      "Secondo gli esperti, il modello di Vallombra va applicato così com'è a qualsiasi lago.",
      "falso"
     ],
     [
      "Oggi è di nuovo permesso fare il bagno nel lago.",
      "vero"
     ]
    ],
    "hunt": {
     "label": "Tocá los auxiliares venire y andare usados en voz pasiva",
     "targets": [
      "veniva",
      "venivano",
      "vengono",
      "viene",
      "va",
      "vanno",
      "andavano"
     ]
    }
   },
   "ascolto": {
    "title": "Rifiuti, che cosa cambia da lunedì",
    "genre": "intervista radiofonica",
    "es": "En una radio local, una conductora entrevista al concejal de ambiente de un pueblo sobre el nuevo sistema de recolección de residuos y le traslada las dudas de los oyentes.",
    "speakers": [
     "Giulia, conduttrice",
     "Marco Ferri, assessore all'ambiente"
    ],
    "turns": [
     [
      "A",
      "Buongiorno a tutti e bentornati a Città in onda. Da lunedì a Castelnuovo cambia il modo in cui vengono raccolti i rifiuti, e le telefonate in redazione non si contano. Ne parliamo con Marco Ferri, assessore all'ambiente. Buongiorno, assessore."
     ],
     [
      "B",
      "Buongiorno a lei e agli ascoltatori. E grazie dell'invito, perché di chiarezza c'è proprio bisogno."
     ],
     [
      "A",
      "Allora, partiamo dalla domanda più semplice: che cosa cambia, in concreto?"
     ],
     [
      "B",
      "Allora, la novità principale è la tariffa puntuale. Cioè, finora la tassa sui rifiuti veniva calcolata soprattutto in base ai metri quadrati della casa. D'ora in poi una parte verrà calcolata in base a quanto indifferenziato produce ogni famiglia. In parole povere: chi separa bene, paga meno."
     ],
     [
      "A",
      "E come fate a sapere quanto produce ogni famiglia?"
     ],
     [
      "B",
      "Ogni famiglia riceve dei sacchetti grigi con un codice. Quando il sacchetto viene ritirato, il codice viene letto dall'operatore e registrato. Diciamo che è un po' come un contatore, come per l'acqua o la luce."
     ],
     [
      "A",
      "Molti ascoltatori però ci scrivono che hanno paura di essere controllati. Una signora dice: adesso il Comune saprà che cosa butto via."
     ],
     [
      "B",
      "Capisco la preoccupazione, davvero. Ma i sacchetti non vengono aperti, vengono solo pesati e contati. I dati sono trattati secondo le norme sulla privacy e non vengono ceduti a nessuno."
     ],
     [
      "A",
      "Un'altra domanda frequente riguarda i pannolini. Le famiglie con bambini piccoli rischiano di pagare di più?"
     ],
     [
      "B",
      "No, e questo è importante. Per le famiglie con bambini sotto i tre anni, e anche per chi assiste una persona anziana, è previsto un servizio a parte: i pannolini vanno messi in un contenitore apposito, che viene svuotato due volte a settimana e non viene conteggiato nella tariffa. Basta fare domanda all'ufficio ambiente."
     ],
     [
      "A",
      "E per chi non ha capito bene come separare? Perché, diciamocelo, il vetro va bene, la carta va bene, ma poi ci sono i casi strani."
     ],
     [
      "B",
      "Eh, i casi strani sono tanti. Lo scontrino, per esempio: sembra carta, ma va buttato nell'indifferenziato, perché è carta termica. Oppure i cartoni della pizza: se sono molto unti, vanno messi nell'organico. Per questo abbiamo preparato una guida, che è stata distribuita in tutte le case, e c'è anche un'app."
     ],
     [
      "A",
      "Ultima domanda, assessore, e scusi la franchezza: non è un modo per aumentare le tasse di nascosto?"
     ],
     [
      "B",
      "No, anzi. Nei comuni dove il sistema è stato introdotto, e parlo di comuni simili al nostro, la quantità di indifferenziato è stata ridotta in modo significativo. E meno rifiuti da smaltire vuol dire costi più bassi per tutti. Certo, i primi mesi saranno un periodo di prova: eventuali errori verranno corretti, e le bollette dei primi sei mesi non saranno penalizzanti."
     ],
     [
      "A",
      "Grazie, assessore. Chi ha altre domande può scriverci: le giriamo direttamente all'ufficio ambiente."
     ]
    ],
    "gloss": {
     "fate": "(come fate a sapere?) ¿cómo hacen para saber?: *fare a* + infinitivo",
     "povere": "(in parole povere) dicho en criollo, en pocas palabras",
     "giriamo": "(le giriamo) se las pasamos, se las reenviamos",
     "contano": "(non si contano) son incontables",
     "puntuale": "(tarifa) según lo que cada uno realmente produce",
     "indifferenziato": "residuos no reciclables",
     "sacchetti": "bolsas",
     "contatore": "medidor",
     "ceduti": "cedidos, pasados a terceros",
     "pannolini": "pañales",
     "apposito": "especial, destinado a eso",
     "svuotato": "vaciado",
     "scontrino": "ticket (de compra)",
     "unti": "grasosos, engrasados",
     "franchezza": "franqueza",
     "smaltire": "eliminar, tratar (residuos)",
     "bollette": "facturas, boletas"
    },
    "questions": [
     [
      "Qual è lo scopo principale dell'intervista?",
      [
       "Chiarire i dubbi dei cittadini sul nuovo sistema",
       "Annunciare un aumento della tassa sui rifiuti",
       "Presentare la nuova app del Comune",
       "Dare voce alle proteste contro l'assessore"
      ],
      "Chiarire i dubbi dei cittadini sul nuovo sistema"
     ],
     [
      "Come veniva calcolata finora la tassa sui rifiuti?",
      [
       "In base al numero di sacchetti ritirati",
       "Soprattutto in base alla superficie della casa",
       "In base al numero di persone in famiglia",
       "In base al peso dei rifiuti differenziati"
      ],
      "Soprattutto in base alla superficie della casa"
     ],
     [
      "Come risponde l'assessore alla signora preoccupata per la privacy?",
      [
       "I codici non contengono il nome della famiglia",
       "I controlli dureranno solo i primi sei mesi",
       "I sacchetti vengono pesati e contati, non aperti",
       "I dati vengono letti soltanto dall'ufficio ambiente"
      ],
      "I sacchetti vengono pesati e contati, non aperti"
     ],
     [
      "Dove va buttato lo scontrino?",
      [
       "Nella raccolta della carta",
       "Nell'organico, se è sporco",
       "Nell'indifferenziato",
       "Nel contenitore dei pannolini"
      ],
      "Nell'indifferenziato"
     ],
     [
      "Che cosa lascia capire l'assessore alla fine?",
      [
       "Che all'inizio ci potranno essere degli errori",
       "Che il sistema è già stato sperimentato a Castelnuovo",
       "Che le bollette aumenteranno nei primi mesi",
       "Che non conosce i risultati degli altri comuni"
      ],
      "Che all'inizio ci potranno essere degli errori"
     ]
    ],
    "vf": [
     [
      "Il codice sul sacchetto grigio viene letto al momento del ritiro.",
      "vero"
     ],
     [
      "Il contenitore per i pannolini viene svuotato una volta al mese.",
      "falso"
     ],
     [
      "L'app del Comune è disponibile anche in inglese.",
      "non si dice"
     ],
     [
      "Con il nuovo sistema, chi separa bene i rifiuti pagherà meno.",
      "vero"
     ]
    ]
   },
   "compito": {
    "genre": "lettera_formale",
    "title": "Una proposta per il nostro fiume",
    "fonte": "lettura",
    "t": "Hai letto il reportage sul lago di Vallombra. Nella tua città c'è un corso d'acqua, un parco o un'area verde in cattive condizioni. Scrivi una lettera all'assessore all'ambiente del tuo Comune in cui descrivi la situazione, riassumi brevemente il caso di Vallombra e proponi almeno due misure ispirate a quell'esperienza, spiegando perché potrebbero funzionare. Usa un registro formale (da 165 a 225 parole).",
    "es": "Carta formal a un funcionario: problema local, el ejemplo del lago leído y dos propuestas concretas. Cuidá el Lei con mayúscula, las fórmulas de saludo y usá la voz pasiva donde quede natural.",
    "min": 165,
    "max": 225,
    "punti": [
     [
      "describir el problema local",
      [
       "torrente",
       "fiume",
       "parco",
       "inquin",
       "degrad",
       "rifiuti",
       "discarica"
      ]
     ],
     [
      "resumir el caso de Vallombra",
      [
       "vallombra",
       "lago"
      ]
     ],
     [
      "proponer al menos dos medidas y justificarlas",
      [
       "propo",
       "suggeri",
       "in primo luogo",
       "potrebbe"
      ]
     ],
     [
      "apertura y cierre formales",
      [
       "gentile",
       "egregio",
       "distinti saluti",
       "cordiali saluti"
      ]
     ]
    ],
    "model": "Gentile Assessore,\n\nmi chiamo Lucía Romero e abito da tre anni nel quartiere di San Rocco, attraversato dal torrente Brembiolo. Le scrivo perché le condizioni del torrente sono ormai preoccupanti: le rive vengono usate come discarica, l'acqua è torbida e d'estate l'odore è insopportabile. Il sentiero che lo costeggia, un tempo frequentato da famiglie e sportivi, è stato di fatto abbandonato.\n\nDi recente ho letto un reportage sul lago di Vallombra, in Trentino, che in dieci anni è stato risanato grazie a un consorzio in cui erano rappresentati il Comune, gli agricoltori, i pescatori e le associazioni. Credo che quell'esperienza contenga alcune idee utili anche per noi.\n\nVorrei quindi proporLe due misure. In primo luogo, potrebbe essere creato un tavolo permanente con i residenti, le aziende della zona e i volontari, perché le regole vanno decise insieme a chi dovrà rispettarle. In secondo luogo, i dati sulla qualità dell'acqua dovrebbero essere pubblicati regolarmente, in un linguaggio comprensibile a tutti: solo così la fiducia dei cittadini può essere riconquistata.\n\nSono disponibile, insieme ad altri vicini, a collaborare all'organizzazione di una prima giornata di pulizia delle rive.\n\nIn attesa di un Suo cortese riscontro, Le porgo distinti saluti.\n\nLucía Romero",
    "gloss": {
     "Assessore": "funcionario municipal a cargo de un área (secretario, concejal)",
     "torrente": "arroyo",
     "discarica": "basural",
     "torbida": "turbia",
     "costeggia": "bordea, corre al lado de",
     "di fatto": "en la práctica",
     "risanato": "saneado",
     "tavolo permanente": "mesa de trabajo permanente"
    }
   },
   "breve": {
    "title": "Riapre la spiaggia del lago",
    "genre": "avviso pubblico",
    "es": "Un comunicado de la municipalidad anuncia que la playa del lago vuelve a abrir y explica las reglas.",
    "speaker": "Voce del Comune",
    "voice": 0,
    "text": [
     "Comunicato del Comune di Vallombra. Si informano i cittadini che, a partire da sabato 3 giugno, la spiaggia del lago è di nuovo aperta alla balneazione. Le analisi dell'acqua, eseguite dall'Agenzia per l'ambiente nelle ultime quattro settimane, hanno dato risultati positivi.",
     "La spiaggia sarà sorvegliata da un bagnino tutti i giorni dalle dieci alle diciannove. Il parcheggio del molo, invece, viene riservato ai residenti e alle persone con disabilità: tutti gli altri sono invitati a lasciare l'auto nel parcheggio della stazione, da cui parte una navetta gratuita ogni venti minuti.",
     "È vietato portare cani sulla spiaggia e accendere fuochi sulle rive. I rifiuti vanno portati via o gettati negli appositi contenitori della raccolta differenziata. Chi non rispetta le regole può essere multato fino a duecento euro.",
     "Per informazioni, rivolgersi all'Ufficio ambiente del Comune."
    ],
    "tabella": [
     [
      "Giorno di riapertura della spiaggia",
      "3 giugno",
      [
       "sabato 3 giugno",
       "il 3 giugno",
       "tre giugno",
       "sabato"
      ]
     ],
     [
      "Ora in cui finisce la sorveglianza del bagnino",
      "19",
      [
       "diciannove",
       "alle 19",
       "19:00",
       "19.00"
      ]
     ],
     [
      "Ogni quanti minuti passa la navetta",
      "20",
      [
       "venti",
       "ogni 20 minuti",
       "ogni venti minuti"
      ]
     ],
     [
      "Multa massima (euro)",
      "200",
      [
       "duecento"
      ]
     ]
    ],
    "info": [
     [
      "Le analisi dell'acqua sono durate quattro settimane.",
      true
     ],
     [
      "Il parcheggio del molo è aperto a tutti.",
      false
     ],
     [
      "La navetta dalla stazione è gratuita.",
      true
     ],
     [
      "I cani possono stare sulla spiaggia al guinzaglio.",
      false
     ],
     [
      "È vietato accendere fuochi sulle rive.",
      true
     ],
     [
      "Il bagnino c'è solo nel fine settimana.",
      false
     ]
    ],
    "gloss": {
     "balneazione": "baño (en el mar, en el lago)",
     "bagnino": "guardavidas",
     "molo": "muelle",
     "rive": "orillas"
    }
   }
  },
  {
   "week": 36,
   "level": "B2",
   "lettura": {
    "title": "Il quartiere dove non si abita più",
    "emoji": "🏘️",
    "genre": "editoriale",
    "grammar": "si passivante e si impersonale",
    "text": "C'è un gioco che si può fare in qualsiasi centro storico italiano, da Firenze a Napoli, da Bologna a Lecce. Si guardano i citofoni. Dove un tempo si leggevano cognomi, oggi si trovano numeri, sigle, piccole tastiere per il codice d'accesso. Si suona, e non risponde nessuno: le chiavi si ritirano in una cassetta metallica fissata al muro, e il padrone di casa, se esiste, abita altrove.\n\nNon si tratta di nostalgia. Che le città cambino è normale, e sarebbe ipocrita rimpiangere i centri storici degli anni Settanta, spesso degradati e insicuri. Il problema è un altro: in molti quartieri si sta passando, nel giro di pochi anni, da un luogo in cui si vive a un luogo in cui si soggiorna. E le due cose non sono affatto la stessa.\n\nQuando si vive in un posto, si conoscono i vicini, si accompagnano i figli alla scuola sotto casa, si litiga per il rumore e si fa pace sulle scale. Il pane si compra sempre nello stesso forno, e il fornaio sa che la signora del terzo piano è a letto con l'influenza. Quando si soggiorna, invece, si arriva con la valigia, si cercano i ristoranti sull'app, si riparte dopo tre notti. Non c'è niente di male: tutti siamo turisti, prima o poi. Ma un quartiere fatto solo di soggiorni brevi smette di essere un quartiere e diventa un'attrazione.\n\nLe conseguenze si vedono a occhio nudo. Le botteghe di quartiere chiudono e al loro posto si aprono negozi di souvenir e locali per l'aperitivo. Gli affitti per chi lavora in città salgono, perché rende di più affittare una stanza a notte che un appartamento a un anno. Gli studenti e le giovani coppie si spostano in periferia, e con loro se ne vanno le famiglie con bambini. Le scuole del centro perdono iscritti; in alcune si parla già di accorpamenti.\n\nChi rimane, poi, si ritrova a vivere in un condominio che assomiglia sempre di più a un albergo senza reception. Si sentono trolley sulle scale a tutte le ore, si trovano sacchi della spazzatura lasciati nel posto sbagliato, si incontrano sconosciuti che chiedono la password del wifi. Sono fastidi piccoli, presi uno per uno. Messi insieme, però, danno la sensazione di essere ospiti in casa propria, e spingono anche i più affezionati a pensare di andarsene.\n\nChe cosa si può fare? Qualcuno propone di vietare gli affitti brevi, ma un provvedimento così drastico colpirebbe anche chi integra un reddito modesto affittando una stanza. Altre soluzioni si discutono da anni: limitare il numero di giorni in cui è possibile affittare un appartamento ai turisti, tassare di più chi possiede molti alloggi, offrire vantaggi fiscali a chi affitta ai residenti. Nessuna è perfetta, e in ogni città si dovrà trovare un equilibrio diverso.\n\nQuello che non si può più fare è far finta di niente. Si dice spesso che il turismo porta ricchezza, ed è vero. Ma una città non si misura solo in presenze alberghiere e scontrini: si misura anche nel numero di finestre illuminate la sera di un martedì di novembre, quando i turisti sono partiti e restano quelli che ci abitano.\n\nForse si dovrebbe ripartire proprio da lì, dai citofoni. Una città in cui sui campanelli tornano i cognomi è una città in cui qualcuno ha deciso di restare. E una città in cui si resta è una città che ha ancora qualcosa da raccontare.",
    "gloss": {
     "vanno": "(se ne vanno) se van: *andarsene* = irse (semana 45)",
     "rende": "(rende di più) conviene más, deja más plata",
     "giro": "(nel giro di pochi anni) en cuestión de pocos años",
     "citofoni": "porteros eléctricos",
     "sigle": "siglas",
     "tastiere": "teclados",
     "cassetta": "cajita",
     "rimpiangere": "añorar, extrañar",
     "degradati": "deteriorados, venidos a menos",
     "soggiorna": "se aloja (por poco tiempo)",
     "litiga": "se pelea",
     "forno": "panadería",
     "fornaio": "panadero",
     "valigia": "valija",
     "nudo": "desnudo (a occhio nudo: a simple vista)",
     "botteghe": "negocios de barrio",
     "locali": "bares, locales",
     "affitti": "alquileres",
     "periferia": "afueras",
     "iscritti": "inscriptos, alumnos",
     "accorpamenti": "fusiones (de escuelas)",
     "integra": "complementa",
     "reddito": "ingreso",
     "alloggi": "viviendas",
     "fiscali": "impositivos",
     "finta": "(far finta di niente) hacerse el distraído",
     "alberghiere": "hoteleras",
     "scontrini": "tickets de compra",
     "campanelli": "timbres",
     "fastidi": "molestias",
     "affezionati": "apegados, encariñados"
    },
    "questions": [
     [
      "Qual è la tesi principale dell'editoriale?",
      [
       "I centri storici andrebbero chiusi al turismo di massa",
       "Gli affitti brevi vanno vietati in tutte le città",
       "Le città di oggi sono meno sicure di un tempo",
       "I quartieri si svuotano di residenti e di vita comune"
      ],
      "I quartieri si svuotano di residenti e di vita comune"
     ],
     [
      "Perché l'autore parte proprio dai citofoni?",
      [
       "Perché i nuovi citofoni sono brutti e poco sicuri",
       "Perché mostrano in modo concreto chi abita davvero nei palazzi",
       "Perché i turisti non riescono a usarli",
       "Perché i proprietari non rispondono quasi mai alle chiamate dei vicini"
      ],
      "Perché mostrano in modo concreto chi abita davvero nei palazzi"
     ],
     [
      "Che differenza fa l'autore tra «vivere» e «soggiornare»?",
      [
       "Chi soggiorna spende più soldi di chi vive in un posto",
       "Chi vive in un posto crea legami, chi soggiorna è di passaggio",
       "Chi vive in centro paga affitti molto più bassi",
       "Chi soggiorna rispetta di più le regole del quartiere"
      ],
      "Chi vive in un posto crea legami, chi soggiorna è di passaggio"
     ],
     [
      "Perché, secondo l'articolo, salgono gli affitti per chi lavora in città?",
      [
       "Perché in centro gli stipendi sono più alti",
       "Perché molte case sono state ristrutturate",
       "Perché le scuole del centro attirano famiglie",
       "Perché affittare ai turisti rende di più"
      ],
      "Perché affittare ai turisti rende di più"
     ],
     [
      "Che cosa pensa l'autore di un divieto totale degli affitti brevi?",
      [
       "Che danneggerebbe anche chi affitta per necessità",
       "Che sia l'unica soluzione davvero efficace",
       "Che sia già in vigore in quasi tutte le città italiane",
       "Che andrebbe applicato soltanto in periferia"
      ],
      "Che danneggerebbe anche chi affitta per necessità"
     ]
    ],
    "vf": [
     [
      "L'autore rimpiange i centri storici degli anni Settanta.",
      "falso"
     ],
     [
      "In alcune scuole del centro si parla già di accorpamenti.",
      "vero"
     ],
     [
      "L'autore abita in un quartiere del centro storico.",
      "non si dice"
     ],
     [
      "Secondo l'autore, ogni città dovrà trovare una soluzione propria.",
      "vero"
     ],
     [
      "Per l'autore il turismo non porta alcun beneficio economico.",
      "falso"
     ]
    ],
    "hunt": {
     "label": "Tocá los verbos que van con el si impersonal o pasivante",
     "targets": [
      "guardano",
      "leggevano",
      "trovano",
      "suona",
      "ritirano",
      "tratta",
      "sta",
      "vive",
      "soggiorna",
      "conoscono",
      "accompagnano",
      "litiga",
      "fa",
      "compra",
      "arriva",
      "cercano",
      "riparte",
      "vedono",
      "aprono",
      "parla",
      "sentono",
      "incontrano",
      "discutono",
      "dovrà",
      "può",
      "dice",
      "misura",
      "dovrebbe",
      "resta"
     ]
    }
   },
   "ascolto": {
    "title": "Le panchine che non ci sono più",
    "genre": "podcast di quartiere",
    "es": "Dos conductores de un podcast de barrio discuten la decisión de la municipalidad de sacar los bancos de una plaza; en la mitad se suma, por teléfono, la dueña del kiosco de diarios. Hablan como se habla: cortado, con muletillas.",
    "speakers": [
     "Chiara",
     "Davide",
     "Pina, edicolante"
    ],
    "turns": [
     [
      "A",
      "Bentornati a Due passi, il podcast che si ascolta a piedi. O almeno così speriamo. Oggi, Davide, si parla di panchine."
     ],
     [
      "B",
      "Anzi, di panchine che non ci sono più."
     ],
     [
      "A",
      "Ecco. Spiega, per chi non lo sapesse."
     ],
     [
      "B",
      "Allora, niente: la settimana scorsa in piazza del Mercato sono state tolte le quattro panchine davanti alla fontana."
     ],
     [
      "A",
      "Tutte e quattro."
     ],
     [
      "B",
      "Tutte e quattro. Il Comune dice che lì si creavano assembramenti, rumore la notte, bottiglie abbandonate…"
     ],
     [
      "A",
      "E tu che ne pensi?"
     ],
     [
      "B",
      "Guarda, io… cioè, io i residenti li capisco. Se abiti sopra la piazza e alle due di notte non si riesce a dormire, hai ragione a lamentarti."
     ],
     [
      "A",
      "Però?"
     ],
     [
      "B",
      "Però togliere le panchine mi sembra come togliere le sedie da un ristorante perché qualcuno parla forte."
     ],
     [
      "A",
      "Sì, ma aspetta, faccio l'avvocato del diavolo. Qualcosa bisognava pur fare, no? Si erano già provate altre soluzioni…"
     ],
     [
      "B",
      "…più vigili, il divieto di vendere alcolici in vetro, lo so."
     ],
     [
      "A",
      "Appunto."
     ],
     [
      "B",
      "E non hanno funzionato, d'accordo. Ma il punto è: chi le usava di giorno, quelle panchine? Io ci passo ogni mattina. Gli anziani che aspettavano il mercato, le mamme con i passeggini, i ragazzi che escono da scuola… Adesso dove vanno?"
     ],
     [
      "A",
      "Su questo abbiamo una testimone. In collegamento c'è la signora Pina, quella dell'edicola. Pina, ci sente?"
     ],
     [
      "C",
      "Sì, sì, vi sento! Buongiorno."
     ],
     [
      "A",
      "Buongiorno. Lei la piazza la vede tutto il giorno. Che cosa è cambiato?"
     ],
     [
      "C",
      "Eh, guardi… da quando non ci si può più sedere, in piazza non si ferma più nessuno. Si passa, si guarda la fontana e si tira dritto."
     ],
     [
      "B",
      "Ecco."
     ],
     [
      "C",
      "Prima uno si sedeva, due chiacchiere, comprava il giornale… Adesso, boh, sembra una stazione."
     ],
     [
      "A",
      "Grazie, Pina, gentilissima."
     ],
     [
      "B",
      "Vedi? È quella che gli urbanisti chiamano architettura ostile. Si progettano gli spazi in modo che non ci si possa fermare, sdraiare, stare. E il problema non sparisce: si sposta nella via accanto."
     ],
     [
      "A",
      "Quindi la tua proposta qual è? Rimetterle e basta?"
     ],
     [
      "B",
      "No, no, non così. Si potrebbero rimettere, ma con regole chiare. E con qualcuno che si prende cura della piazza: più illuminazione, un bar aperto fino a tardi, magari eventi del quartiere. Una piazza vissuta si controlla da sola, diciamo."
     ],
     [
      "A",
      "Mah. Questo si dice sempre, però. Io qualche dubbio ce l'ho."
     ],
     [
      "B",
      "Vabbè, lo so che non sei convinta."
     ],
     [
      "A",
      "Su una cosa, però, sono d'accordo con te: decisioni del genere non si prendono senza chiedere a chi la piazza la usa davvero."
     ],
     [
      "B",
      "Esatto. E allora lanciamo l'idea: giovedì sera, alle nove, c'è l'assemblea del comitato di quartiere, nella sala della parrocchia. Chi ha un'opinione, venga a dirla."
     ],
     [
      "A",
      "Anche chi non è d'accordo con Davide, mi raccomando. Alla prossima puntata!"
     ]
    ],
    "gloss": {
     "raccomando": "(mi raccomando) ¡no se olviden!, ¡eh!",
     "ho": "(qualche dubbio ce l'ho) alguna duda tengo: *ce l'ho* = lo tengo, con el *ci* de apoyo de *avere* (semana 45)",
     "pur": "(qualcosa bisognava pur fare) algo había que hacer, al fin y al cabo",
     "panchine": "bancos (de plaza)",
     "assembramenti": "aglomeraciones",
     "vigili": "agentes de tránsito, policía municipal",
     "passeggini": "cochecitos de bebé",
     "edicola": "kiosco de diarios",
     "dritto": "derecho (tirare dritto: seguir de largo)",
     "ostile": "hostil",
     "sdraiare": "acostarse, tirarse",
     "sparisce": "desaparece",
     "vissuta": "vivida, con vida",
     "parrocchia": "parroquia",
     "puntata": "episodio",
     "collegamento": "(in collegamento) en línea, conectada",
     "boh": "qué sé yo (muletilla)",
     "vabbè": "bueno, en fin (muletilla)",
     "chiacchiere": "(due chiacchiere) una charla"
    },
    "questions": [
     [
      "Perché il Comune ha tolto le panchine?",
      [
       "Per rifare la pavimentazione della piazza",
       "Perché erano vecchie e pericolose",
       "Per i problemi di rumore e disordine notturno",
       "Per fare spazio ai banchi del mercato"
      ],
      "Per i problemi di rumore e disordine notturno"
     ],
     [
      "Che cosa vuole dire Davide con il paragone del ristorante?",
      [
       "Che la misura punisce tutti per colpa di pochi",
       "Che i ristoranti della piazza fanno troppo rumore",
       "Che le panchine andrebbero sostituite da sedie",
       "Che i residenti esagerano con le loro proteste"
      ],
      "Che la misura punisce tutti per colpa di pochi"
     ],
     [
      "Secondo la signora dell'edicola, che cosa è cambiato?",
      [
       "Per terra ci sono meno bottiglie",
       "I clienti dell'edicola sono aumentati",
       "Gli anziani vanno a un altro mercato",
       "In piazza non si ferma più nessuno"
      ],
      "In piazza non si ferma più nessuno"
     ],
     [
      "Che cos'è l'«architettura ostile» di cui parla Davide?",
      [
       "Chiudere le piazze al traffico senza consultare nessuno",
       "Costruire edifici troppo alti intorno alle piazze",
       "Progettare gli spazi per impedire alle persone di sostare",
       "Usare materiali freddi e poco accoglienti"
      ],
      "Progettare gli spazi per impedire alle persone di sostare"
     ],
     [
      "Qual è l'atteggiamento di Chiara verso la proposta di Davide?",
      [
       "Entusiasta: vuole organizzare subito gli eventi",
       "Dubbiosa, ma d'accordo sul coinvolgere il quartiere",
       "Critica: crede che le panchine vadano tolte anche altrove",
       "Indifferente: la questione non la riguarda"
      ],
      "Dubbiosa, ma d'accordo sul coinvolgere il quartiere"
     ]
    ],
    "vf": [
     [
      "Le panchine tolte dalla piazza erano quattro.",
      "vero"
     ],
     [
      "Prima di togliere le panchine non si era tentata nessun'altra soluzione.",
      "falso"
     ],
     [
      "La signora Pina abita sopra la piazza.",
      "non si dice"
     ],
     [
      "L'assemblea del comitato di quartiere si terrà giovedì sera.",
      "vero"
     ]
    ]
   },
   "compito": {
    "genre": "articolo",
    "title": "Si vive ancora in centro?",
    "fonte": "entrambi",
    "t": "Il giornale online della scuola di italiano che frequenti pubblica una serie di articoli dal titolo «Le città degli studenti». Scrivi un articolo sulla tua città in cui descrivi un quartiere che sta cambiando, riprendi almeno un'idea dell'editoriale «Il quartiere dove non si abita più» o del podcast sulle panchine, esprimi la tua opinione e concludi con una proposta. Dai un titolo all'articolo. Registro medio, da 171 a 231 parole.",
    "es": "Artículo con título: un barrio de tu ciudad, una idea tomada del editorial o del podcast, tu opinión y una propuesta. Aprovechá el si impersonal y el pasivante (si vive, si affittano…).",
    "min": 171,
    "max": 231,
    "punti": [
     [
      "describir un barrio de tu ciudad que cambia",
      [
       "quartiere",
       "mia città",
       "nel mio"
      ]
     ],
     [
      "retomar una idea del editorial o del podcast",
      [
       "citofon",
       "affitti brevi",
       "panchin",
       "editoriale",
       "podcast",
       "soggiorn"
      ]
     ],
     [
      "dar tu opinión con argumentos",
      [
       "secondo me",
       "credo",
       "penso",
       "a mio parere"
      ]
     ],
     [
      "cerrar con una propuesta",
      [
       "propo",
       "bisognerebbe",
       "si dovrebbe",
       "si dovrebbero"
      ]
     ]
    ],
    "model": "Buenos Aires: si vive ancora a San Telmo?\n\nQualche giorno fa ho letto un editoriale italiano che invitava a guardare i citofoni dei centri storici: dove prima si leggevano cognomi, oggi si trovano codici e cassette per le chiavi. Ho fatto la prova nel mio quartiere, San Telmo, e il risultato mi ha fatto pensare.\n\nSan Telmo è uno dei quartieri più antichi di Buenos Aires. La domenica si riempie di turisti per la fiera dell'antiquariato, e negli ultimi anni molti appartamenti si affittano a notte. Come in Italia, gli affitti per chi ci lavora sono aumentati e alcune botteghe storiche hanno chiuso. Nel mio palazzo, su dodici campanelli, quattro non hanno più un nome.\n\nSecondo me, però, il problema non si risolve soltanto con i divieti. Mi ha convinto di più un podcast in cui si discuteva delle panchine tolte da una piazza: gli spazi si difendono vivendoli, non svuotandoli. Una piazza piena di vicini, di bambini e di anziani seduti al sole si controlla quasi da sola.\n\nPer questo credo che si dovrebbero sostenere i residenti, per esempio con affitti agevolati per chi ci abita tutto l'anno, e che le decisioni sul quartiere si dovrebbero prendere insieme a chi lo vive ogni giorno. Un quartiere non è una cartolina: è una casa.",
    "gloss": {
     "citofoni": "porteros eléctricos",
     "cassette per le chiavi": "cajitas con candado para dejar las llaves (de los alquileres temporarios)",
     "Ho fatto la prova": "hice la prueba",
     "si affittano a notte": "se alquilan por noche",
     "botteghe storiche": "negocios tradicionales, de toda la vida",
     "affitti agevolati": "alquileres con precio subsidiado"
    }
   },
   "breve": {
    "title": "Assemblea di condominio",
    "genre": "messaggio vocale dell'amministratore",
    "es": "El administrador del edificio manda un audio al grupo de vecinos para convocar a una asamblea.",
    "speaker": "Roberto Salvi, amministratore",
    "voice": 0,
    "text": [
     "Buongiorno a tutti, sono Roberto Salvi, l'amministratore del condominio di via dei Serragli 12. Vi lascio questo messaggio sul gruppo per ricordarvi l'assemblea straordinaria di giovedì 9 novembre, alle 21, nella sala della parrocchia di San Frediano.",
     "Si discuterà di tre punti. Primo: le regole per gli appartamenti affittati ai turisti. Si è notato che le chiavi vengono lasciate in una cassetta sul portone e che le scale si sporcano più del solito: si propone di vietare le cassette e di fare le pulizie due volte alla settimana.",
     "Secondo: la sostituzione del citofono, che non funziona da mesi. Si sono chiesti tre preventivi; il più economico è di tremilacinquecento euro, da dividere tra tutti i condomini.",
     "Terzo: varie ed eventuali. Chi non può partecipare può delegare un altro condomino, ma si ricorda che ognuno può avere al massimo due deleghe. Grazie, e a giovedì."
    ],
    "tabella": [
     [
      "Giorno dell'assemblea",
      "giovedì 9 novembre",
      [
       "giovedì",
       "9 novembre",
       "il 9 novembre",
       "giovedì nove novembre"
      ]
     ],
     [
      "Pulizie proposte alla settimana",
      "2",
      [
       "due",
       "due volte"
      ]
     ],
     [
      "Costo del preventivo più economico (euro)",
      "3500",
      [
       "3.500",
       "tremilacinquecento"
      ]
     ],
     [
      "Deleghe al massimo per persona",
      "2",
      [
       "due"
      ]
     ]
    ],
    "info": [
     [
      "È un'assemblea ordinaria.",
      false
     ],
     [
      "Le chiavi dei turisti vengono lasciate in una cassetta sul portone.",
      true
     ],
     [
      "Si propone di vietare le cassette per le chiavi.",
      true
     ],
     [
      "Il citofono è stato riparato il mese scorso.",
      false
     ],
     [
      "Il costo del citofono sarà diviso tra tutti.",
      true
     ],
     [
      "Chi non viene all'assemblea non può votare in nessun modo.",
      false
     ]
    ],
    "gloss": {
     "citofono": "portero eléctrico",
     "preventivi": "presupuestos",
     "deleghe": "poderes, delegaciones",
     "varie ed eventuali": "otros asuntos"
    }
   }
  },
  {
   "week": 37,
   "level": "B2",
   "lettura": {
    "title": "Il primo voto",
    "emoji": "🗳️",
    "genre": "racconto",
    "grammar": "passato remoto e trapassato remoto",
    "text": "Mia nonna Teresa raccontava questa storia soltanto a Natale, e sempre nello stesso modo, come se la leggesse da un libro. Io la sentii per la prima volta a nove anni e non la capii; la capii davvero molto più tardi, quando lei non c'era più.\n\nLa mattina del 2 giugno 1946 Teresa si alzò prima dell'alba. Aveva ventitré anni, un marito tornato dalla prigionia l'estate prima e una bambina di poche settimane che dormiva nella cesta accanto al letto. Si lavò il viso con l'acqua gelata del catino, si pettinò con cura e indossò l'unico vestito buono che possedeva, quello blu che le aveva cucito la madre per il matrimonio. Quando ebbe finito di prepararsi, si guardò a lungo nello specchio incrinato della cucina. Non le sembrò di essere una persona importante. Eppure quel giorno lo Stato le chiedeva un'opinione sul futuro del Paese.\n\nIl seggio era stato allestito nella scuola elementare, in fondo al paese. Teresa ci andò a piedi insieme alla cognata, Rosa, che era più anziana di lei e aveva paura di sbagliare. Per tutta la strada Rosa ripeté le istruzioni che il parroco aveva dato dal pulpito la domenica precedente, e che lei aveva imparato a memoria senza capirle del tutto. Teresa non disse niente. Aveva già deciso, ma non lo aveva detto a nessuno, nemmeno al marito.\n\nDavanti alla scuola c'era una fila lunghissima. Le donne erano tante, più di quante Teresa si aspettasse: contadine con le scarpe della festa, maestre, vedove vestite di nero, ragazze che ridevano per nascondere l'emozione. Qualcuna aveva portato i figli, qualcun'altra teneva in mano un santino. Teresa riconobbe la moglie del fornaio, che durante la guerra aveva perso un figlio, e la salutò con un cenno. La donna le prese la mano e la tenne stretta per qualche secondo, senza dire una parola. Un uomo, passando, fece una battuta sulle donne che adesso volevano comandare; nessuna gli rispose, e dopo un po' se ne andò.\n\nQuando finalmente toccò a lei, Teresa entrò nella cabina e tirò la tenda. Rimase lì dentro più del necessario. Più tardi raccontò che le tremavano le mani, e che per un attimo aveva temuto di non ricordare più come si scriveva. Poi prese la matita, fece il suo segno e piegò la scheda con attenzione, come si piega una lettera d'amore. Appena fu uscita dalla cabina, la consegnò al presidente del seggio, un vecchio maestro che le sorrise e le disse soltanto: «Brava».\n\nTornarono a casa nel primo pomeriggio. Rosa era stanca e di cattivo umore, perché era convinta di aver sbagliato qualcosa. Teresa, invece, si sentiva leggera. Allattò la bambina, preparò la cena e non parlò del voto per tutta la sera. Soltanto quando il marito le chiese, un po' per scherzo, per chi avesse votato, lei rispose che era una cosa sua.\n\nQualche giorno dopo, quando furono annunciati i risultati, in paese ci fu chi festeggiò e chi pianse. L'Italia era diventata una repubblica. Teresa non seppe mai con certezza quanto avesse contato il suo voto, e non le importava. «Non era per il risultato», mi disse l'ultimo Natale che passammo insieme. «Era che per la prima volta qualcuno aveva aspettato anche me.»\n\nDopo che se ne fu andata, trovammo nel suo cassetto il certificato elettorale di quel giorno, piegato in quattro dentro un libro di preghiere. Lo conservo ancora. Non so per chi votò mia nonna nel 1946. So soltanto che quella mattina si mise il vestito più bello che aveva.",
    "gloss": {
     "chi": "(ci fu chi festeggiò e chi pianse) hubo quienes festejaron y quienes lloraron",
     "tenne": "sostuvo (passato remoto de *tenere*: tenni, tenne)",
     "toccò": "(toccò a lei) le tocó (el turno) a ella",
     "andata": "(dopo che se ne fu andata) después de que se fue, de que murió: *andarsene* en trapassato remoto",
     "alba": "amanecer",
     "prigionia": "cautiverio (como prisionero de guerra)",
     "cesta": "canasta",
     "gelata": "helada",
     "catino": "palangana",
     "cucito": "cosido",
     "incrinato": "rajado",
     "seggio": "mesa electoral, lugar de votación",
     "allestito": "montado, preparado",
     "cognata": "cuñada",
     "ripeté": "repitió",
     "parroco": "cura párroco",
     "pulpito": "púlpito",
     "contadine": "campesinas",
     "vedove": "viudas",
     "santino": "estampita",
     "battuta": "chiste, comentario burlón",
     "cabina": "cuarto oscuro",
     "tenda": "cortina",
     "tremavano": "temblaban",
     "scheda": "boleta",
     "piegò": "dobló",
     "allattò": "amamantó",
     "pianse": "lloró",
     "seppe": "supo",
     "cassetto": "cajón",
     "preghiere": "oraciones",
     "cenno": "seña, gesto"
    },
    "questions": [
     [
      "Chi racconta la storia?",
      [
       "Teresa stessa, il giorno del voto",
       "La cognata Rosa, in una lettera",
       "Il presidente del seggio, nelle sue memorie",
       "Un nipote di Teresa, molti anni dopo"
      ],
      "Un nipote di Teresa, molti anni dopo"
     ],
     [
      "Che cosa prova Teresa davanti allo specchio?",
      [
       "Una certa sorpresa all'idea di contare qualcosa",
       "Vergogna per il suo unico vestito, vecchio e rovinato",
       "Paura che il marito scopra la sua scelta",
       "Tristezza perché la madre non può vederla"
      ],
      "Una certa sorpresa all'idea di contare qualcosa"
     ],
     [
      "Come si comporta Rosa durante il tragitto?",
      [
       "Cerca di convincere Teresa a votare come lei",
       "Ripete ansiosa le istruzioni del parroco",
       "Si lamenta della fila davanti alla scuola",
       "Racconta che cosa voterà suo marito"
      ],
      "Ripete ansiosa le istruzioni del parroco"
     ],
     [
      "Che cosa suggerisce il paragone con «una lettera d'amore»?",
      [
       "Che Teresa ha scritto un messaggio segreto sulla scheda",
       "Che Teresa pensa al marito mentre vota",
       "Che Teresa vive il voto come un gesto intimo e prezioso",
       "Che la scheda era più grande di un normale foglio"
      ],
      "Che Teresa vive il voto come un gesto intimo e prezioso"
     ],
     [
      "Che cosa voleva dire Teresa con «qualcuno aveva aspettato anche me»?",
      [
       "Che il presidente del seggio l'aveva aspettata per ore",
       "Che la fila davanti alla scuola era stata molto lenta",
       "Che finalmente le donne erano considerate cittadine",
       "Che il suo voto era stato decisivo per la repubblica"
      ],
      "Che finalmente le donne erano considerate cittadine"
     ]
    ],
    "vf": [
     [
      "Teresa aveva già deciso per chi votare prima di arrivare al seggio.",
      "vero"
     ],
     [
      "Il marito di Teresa sapeva per chi aveva votato la moglie.",
      "falso"
     ],
     [
      "Rosa votò per la monarchia.",
      "non si dice"
     ],
     [
      "Il seggio si trovava nella chiesa del paese.",
      "falso"
     ],
     [
      "Il narratore conserva ancora il certificato elettorale della nonna.",
      "vero"
     ]
    ],
    "hunt": {
     "label": "Tocá los verbos en passato remoto (también el auxiliar del trapassato remoto)",
     "targets": [
      "sentii",
      "capii",
      "alzò",
      "lavò",
      "pettinò",
      "indossò",
      "ebbe",
      "guardò",
      "sembrò",
      "andò",
      "ripeté",
      "disse",
      "riconobbe",
      "salutò",
      "prese",
      "tenne",
      "fece",
      "rispose",
      "toccò",
      "entrò",
      "tirò",
      "rimase",
      "raccontò",
      "piegò",
      "fu",
      "consegnò",
      "sorrise",
      "tornarono",
      "allattò",
      "preparò",
      "parlò",
      "chiese",
      "furono",
      "festeggiò",
      "pianse",
      "seppe",
      "passammo",
      "trovammo",
      "votò",
      "mise"
     ]
    }
   },
   "ascolto": {
    "title": "Firenze, 4 novembre 1966",
    "genre": "podcast di storia",
    "es": "En un podcast de historia, una conductora y un historiador reconstruyen la inundación de Florencia de 1966 y el papel de los voluntarios.",
    "speakers": [
     "Sara, conduttrice",
     "Andrea Bellini, storico"
    ],
    "turns": [
     [
      "A",
      "Benvenuti a Tracce, il podcast che racconta l'Italia attraverso i suoi giorni difficili. Oggi siamo a Firenze, nel novembre del 1966. Con me c'è il professor Andrea Bellini, storico. Professore, partiamo dall'inizio: che cosa successe quella notte?"
     ],
     [
      "B",
      "Allora, bisogna fare un passo indietro. In quelle settimane piovve moltissimo su tutta la Toscana. La notte tra il tre e il quattro novembre l'Arno, che era già gonfio, cominciò a superare gli argini. E la mattina del quattro la città si svegliò con l'acqua nelle strade."
     ],
     [
      "A",
      "Ma la gente se ne accorse subito?"
     ],
     [
      "B",
      "Mah, sì e no. Pensi che il quattro novembre era un giorno di festa, quindi molti negozi erano chiusi e tanti fiorentini dormivano ancora. Chi abitava vicino al fiume capì in fretta, ma altri se ne resero conto solo quando l'acqua era già entrata nei pianterreni. In alcune strade arrivò fino al primo piano."
     ],
     [
      "A",
      "E i danni non furono soltanto alle case."
     ],
     [
      "B",
      "No, appunto. Questo è il punto che colpì il mondo intero. Firenze non è una città qualsiasi: l'acqua e il fango entrarono nelle chiese, nei musei, negli archivi. Il caso più famoso è il crocifisso di Cimabue, a Santa Croce, che fu gravemente danneggiato. E poi la Biblioteca Nazionale, dove finirono sott'acqua centinaia di migliaia di volumi."
     ],
     [
      "A",
      "Ed è qui che entrano in scena gli angeli del fango."
     ],
     [
      "B",
      "Esatto. Nei giorni successivi arrivarono migliaia di giovani, da tutta Italia e anche dall'estero. Studenti, soprattutto. Nessuno li aveva chiamati ufficialmente, diciamo. Vennero perché avevano visto le immagini in televisione, o sentito la radio. E si misero a lavorare: spalare il fango, portare fuori i libri, passarseli di mano in mano in lunghe catene umane."
     ],
     [
      "A",
      "Mi colpisce proprio questo: nessuno li aveva chiamati."
     ],
     [
      "B",
      "Sì, ed è per questo che l'episodio è rimasto nella memoria collettiva. Fu una delle prime volte in cui una generazione intera si sentì responsabile di un patrimonio comune. Alcuni storici vedono lì, in qualche modo, un'anticipazione dei movimenti giovanili degli anni successivi. Io sono un po' più prudente, però è una lettura interessante."
     ],
     [
      "A",
      "E dal punto di vista del restauro? Immagino che quei mesi abbiano cambiato anche il mestiere."
     ],
     [
      "B",
      "Assolutamente. Il restauro dei libri e delle opere danneggiate durò decenni, e in parte non è ancora concluso. Ma proprio da quell'emergenza nacquero tecniche e laboratori che poi diventarono un punto di riferimento internazionale. Insomma, da una tragedia venne fuori anche una scuola."
     ],
     [
      "A",
      "Professore, grazie. Nella prossima puntata restiamo in quegli anni, ma ci spostiamo a Venezia, che lo stesso giorno visse un'acqua alta eccezionale."
     ]
    ],
    "gloss": {
     "pensi": "(pensi che...) fíjese que...: imperativo de *Lei*",
     "venne": "(venne fuori) salió, surgió: *venire fuori*",
     "misero": "(si misero a lavorare) se pusieron a trabajar: *mettersi a* + infinitivo",
     "accorse": "(se ne accorse) se dio cuenta (passato remoto de *accorgersi*)",
     "successe": "pasó, sucedió (passato remoto de *succedere*)",
     "piovve": "llovió",
     "gonfio": "crecido, hinchado",
     "argini": "terraplenes, márgenes del río",
     "resero": "(se ne resero conto) se dieron cuenta",
     "pianterreni": "plantas bajas",
     "fango": "barro",
     "crocifisso": "crucifijo",
     "spalare": "palear, sacar con pala",
     "catene": "cadenas",
     "patrimonio": "patrimonio",
     "restauro": "restauración",
     "mestiere": "oficio",
     "nacquero": "nacieron",
     "visse": "vivió"
    },
    "questions": [
     [
      "Perché molti fiorentini non si accorsero subito dell'alluvione?",
      [
       "Perché era festa e tanti dormivano ancora",
       "Perché la radio non diede la notizia",
       "Perché la pioggia era cessata da giorni",
       "Perché l'acqua arrivò prima nei quartieri alti"
      ],
      "Perché era festa e tanti dormivano ancora"
     ],
     [
      "Perché, secondo lo storico, l'alluvione colpì il mondo intero?",
      [
       "Perché ci furono migliaia di vittime",
       "Perché fu la prima alluvione trasmessa in diretta",
       "Perché colpì anche altre città europee",
       "Perché danneggiò un patrimonio artistico unico"
      ],
      "Perché danneggiò un patrimonio artistico unico"
     ],
     [
      "Chi erano gli «angeli del fango»?",
      [
       "Soldati inviati dal governo a spalare il fango",
       "Giovani volontari arrivati spontaneamente",
       "Restauratori stranieri chiamati dai musei",
       "Abitanti rimasti senza casa dopo l'alluvione"
      ],
      "Giovani volontari arrivati spontaneamente"
     ],
     [
      "Che cosa pensa lo storico dell'idea che l'episodio anticipi i movimenti giovanili?",
      [
       "La considera del tutto sbagliata",
       "La trova interessante, ma la accoglie con cautela",
       "La ritiene l'unica spiegazione davvero convincente",
       "Dice di essere stato lui a proporla per primo"
      ],
      "La trova interessante, ma la accoglie con cautela"
     ],
     [
      "Che cosa intende lo storico con «da una tragedia venne fuori anche una scuola»?",
      [
       "Che dopo l'alluvione fu costruita una nuova scuola",
       "Che molti volontari diventarono poi insegnanti",
       "Che gli studenti persero un anno di lezioni",
       "Che l'emergenza fece nascere competenze di restauro"
      ],
      "Che l'emergenza fece nascere competenze di restauro"
     ]
    ],
    "vf": [
     [
      "Prima dell'alluvione aveva piovuto per settimane.",
      "vero"
     ],
     [
      "Il crocifisso di Cimabue si trovava nella Biblioteca Nazionale.",
      "falso"
     ],
     [
      "Gli angeli del fango ricevettero un compenso dal Comune.",
      "non si dice"
     ],
     [
      "Il restauro dei volumi danneggiati si concluse in pochi mesi.",
      "falso"
     ]
    ]
   },
   "compito": {
    "genre": "recensione",
    "title": "Una recensione per il gruppo di lettura",
    "fonte": "lettura",
    "t": "Fai parte di un gruppo di lettura che ogni mese pubblica sul suo blog le recensioni dei testi letti. Questo mese avete letto il racconto «Il primo voto». Scrivi una recensione in cui presenti il racconto (ambientazione, narratore, personaggi), ne riassumi la trama, commenti lo stile o una scena che ti ha colpito e dici a chi lo consiglieresti. Dai un titolo alla recensione. Registro medio, da 177 a 237 parole.",
    "es": "Reseña con título: presentación, resumen breve de la trama, valoración de estilo o de una escena y recomendación. Al resumir podés usar el presente; al contextualizar la historia, el passato remoto.",
    "min": 177,
    "max": 237,
    "punti": [
     [
      "presentar el cuento: época, narrador, personajes",
      [
       "1946",
       "narrat",
       "nipote",
       "teresa"
      ]
     ],
     [
      "resumir la trama",
      [
       "trama",
       "storia",
       "seggio",
       "vot"
      ]
     ],
     [
      "valorar el estilo o una escena concreta",
      [
       "stile",
       "scena",
       "finale",
       "passaggio"
      ]
     ],
     [
      "recomendar el texto a un tipo de lector",
      [
       "consiglio",
       "consiglierei",
       "raccomand"
      ]
     ]
    ],
    "model": "Una storia piccola per un giorno grande\n\nQuesto mese il nostro gruppo ha letto «Il primo voto», un racconto breve ambientato il 2 giugno 1946, il giorno del referendum tra monarchia e repubblica. A raccontare è un nipote che ricorda la storia della nonna Teresa, una giovane madre di paese che quel giorno votò per la prima volta a un'elezione nazionale.\n\nLa trama è semplice: Teresa si prepara con cura, va al seggio con la cognata Rosa, aspetta in una lunga fila di donne e vota. Non succede niente di straordinario, eppure ogni gesto pesa. La scena che mi è piaciuta di più è quella della cabina: quando Teresa piega la scheda «come si piega una lettera d'amore», il lettore capisce quanto fosse importante per lei quel momento.\n\nLo stile è sobrio, quasi da cronaca familiare, e il passato remoto dà al racconto il tono di una storia tramandata. Il finale, con il certificato elettorale nascosto in un libro di preghiere, commuove senza essere retorico. L'unico limite, secondo me, è che gli altri personaggi, come il marito, restano un po' sullo sfondo.\n\nConsiglio questo racconto a chi pensa che la storia sia fatta solo di grandi nomi e di grandi battaglie: qui si scopre che è fatta anche di mani che tremano davanti a una matita.",
    "gloss": {
     "cognata": "cuñada",
     "seggio": "lugar de votación, mesa electoral",
     "scheda": "boleta (de votación)",
     "pesa": "tiene peso, importa",
     "tramandata": "transmitida de generación en generación",
     "restano un po' sullo sfondo": "quedan medio en segundo plano"
    }
   },
   "breve": {
    "title": "Il 2 giugno 1946",
    "genre": "audioguida di una mostra",
    "es": "La audioguía de una muestra sobre el referéndum que convirtió a Italia en república.",
    "speaker": "Audioguida",
    "voice": 1,
    "text": [
     "Siete davanti a una delle schede elettorali del referendum del 2 giugno 1946. Quel giorno gli italiani scelsero tra monarchia e repubblica, e per la prima volta in un voto nazionale votarono anche le donne.",
     "Il simbolo della repubblica era una testa di donna con una corona di torri; quello della monarchia, lo stemma dei Savoia. L'affluenza fu altissima: votò quasi il novanta per cento degli aventi diritto.",
     "I risultati arrivarono lentamente, perché le schede furono contate a mano. La repubblica vinse con circa il cinquantaquattro per cento dei voti, ma il Paese si divise: il Nord votò in maggioranza per la repubblica, il Sud per la monarchia.",
     "Il re Umberto secondo lasciò l'Italia il 13 giugno e partì per il Portogallo. Nella vetrina successiva trovate i giornali di quei giorni: il più famoso titolava in prima pagina «È nata la Repubblica italiana»."
    ],
    "tabella": [
     [
      "Percentuale di chi andò a votare",
      "90",
      [
       "novanta",
       "90%",
       "quasi il 90",
       "quasi il novanta per cento",
       "novanta per cento"
      ]
     ],
     [
      "Percentuale della repubblica",
      "54",
      [
       "cinquantaquattro",
       "54%",
       "circa il 54",
       "cinquantaquattro per cento"
      ]
     ],
     [
      "Paese in cui andò il re",
      "Portogallo",
      [
       "in Portogallo"
      ]
     ],
     [
      "Data in cui il re lasciò l'Italia",
      "13 giugno",
      [
       "il 13 giugno",
       "tredici giugno"
      ]
     ]
    ],
    "info": [
     [
      "Nel 1946 le donne votarono per la prima volta in un voto nazionale.",
      true
     ],
     [
      "Il simbolo della repubblica era lo stemma dei Savoia.",
      false
     ],
     [
      "Le schede furono contate a mano.",
      true
     ],
     [
      "Il Sud votò in maggioranza per la repubblica.",
      false
     ],
     [
      "Il re lasciò l'Italia dopo il referendum.",
      true
     ],
     [
      "I risultati arrivarono la sera stessa del voto.",
      false
     ]
    ],
    "gloss": {
     "schede": "boletas",
     "stemma": "escudo",
     "affluenza": "participación (electoral)",
     "aventi diritto": "quienes tenían derecho (a votar)"
    }
   }
  },
  {
   "week": 38,
   "level": "B2",
   "lettura": {
    "title": "«Venite a gennaio»: la sindaca che riporta la gente in montagna",
    "emoji": "🎙️",
    "genre": "resoconto di un'intervista",
    "grammar": "il discorso indiretto",
    "text": "Quando Marta Colasanti è stata eletta sindaca di Roccavecchia, un paese di trecento abitanti sull'Appennino molisano, la scuola elementare stava per chiudere e l'ultimo bar apriva solo nei fine settimana. Cinque anni dopo, i residenti sono quasi quattrocento, la scuola ha una pluriclasse di undici bambini e il bar ha riaperto tutti i giorni. L'abbiamo incontrata nel suo ufficio, una stanza con la stufa a legna e una finestra che dà sulla valle.\n\nLe abbiamo chiesto, prima di tutto, come fosse cominciato tutto. Colasanti ha raccontato che all'inizio non aveva un piano preciso. Ha spiegato che, subito dopo l'elezione, aveva fatto un giro per le case vuote del centro e si era resa conto che erano più di cento. «Mi sono chiesta» ha detto «perché dovessero restare chiuse mentre in città i giovani non trovavano un appartamento.» Da quella domanda, ha aggiunto, era nata l'idea di un censimento delle abitazioni abbandonate e di un accordo con i proprietari, molti dei quali vivevano all'estero da decenni.\n\nLa sindaca ha precisato che il Comune non aveva regalato niente. Ha voluto chiarire che le case erano state affittate a prezzi bassi, ma che i nuovi abitanti si erano impegnati a ristrutturarle e a restare almeno tre anni. Ha ammesso che i primi mesi erano stati difficili: alcuni anziani del paese temevano che i nuovi arrivati avrebbero cambiato le abitudini di tutti, e qualcuno aveva perfino scritto una lettera anonima alla prefettura. «Non li biasimo» ha commentato. «Avevano visto partire i figli e i nipoti, e avevano paura di perdere anche il paese.»\n\nChi sono i nuovi residenti? Colasanti ha detto che si trattava soprattutto di famiglie giovani e di persone che lavorano a distanza: una traduttrice, due programmatori, un'illustratrice, un falegname che aveva lasciato Roma. Ha raccontato che la connessione internet era stata la prima battaglia e che, finché non era arrivata la fibra, alcuni lavoravano dalla biblioteca comunale, l'unico edificio con una rete decente. Ha aggiunto, ridendo, che in quel periodo la biblioteca non era mai stata così frequentata. Ha precisato, però, che non tutti erano rimasti: in cinque anni tre famiglie se n'erano andate, e lei non lo considerava un fallimento. Secondo lei era giusto che qualcuno provasse e capisse da solo che quella vita non faceva per lui.\n\nLe abbiamo domandato se il modello fosse replicabile altrove. La sindaca ha risposto che non esistevano ricette valide per tutti e che diffidava di chi le presentava come tali. Ha sostenuto che un paese non si ripopola soltanto con gli incentivi, ma con i servizi: un medico che venga almeno due volte alla settimana, un autobus per la scuola media, un negozio dove comprare il necessario. Ha detto che la sua battaglia per l'anno successivo sarebbe stata proprio la farmacia, chiusa da tempo, e che aveva già scritto alla Regione per chiedere un sostegno.\n\nPrima di salutarci, le abbiamo chiesto che cosa direbbe a un giovane che pensa di trasferirsi in un paese come il suo. Colasanti ci ha pensato un momento. Ha risposto che gli direbbe di venire prima in inverno, non in agosto, e di restare almeno una settimana. Ha spiegato che d'estate tutti i paesi sono belli, ma che è a gennaio che si capisce se si è pronti a viverci. Poi ha aggiunto che, se dopo quella settimana avesse ancora voglia di restare, lo avrebbe aspettato volentieri in municipio.\n\nUscendo, abbiamo incrociato l'illustratrice arrivata da Bologna, che stava accompagnando la figlia a scuola. Le abbiamo chiesto se rifarebbe la stessa scelta. Ci ha detto di sì, senza esitazioni, ma ci ha pregato di non scrivere che è tutto facile. «Scrivete che è bello» ha detto «ma che ci vuole pazienza.»",
    "gloss": {
     "dà": "(una finestra che dà sulla valle) una ventana que da al valle",
     "gennaio": "(è a gennaio che si capisce) es en enero cuando uno se da cuenta: *è... che* destaca un elemento (semana 48)",
     "faceva": "(quella vita non faceva per lui) esa vida no era para él: *fare per qualcuno*",
     "andate": "(se n'erano andate) se habían ido: *andarsene* = irse (semana 45)",
     "pluriclasse": "grado que junta alumnos de distintos años",
     "stufa": "estufa",
     "legna": "leña",
     "censimento": "relevamiento, censo",
     "abbandonate": "abandonadas",
     "regalato": "regalado",
     "impegnati": "comprometidos",
     "ristrutturarle": "refaccionarlas",
     "prefettura": "prefectura (oficina del gobierno nacional en la provincia)",
     "biasimo": "culpo, reprocho",
     "falegname": "carpintero",
     "fibra": "fibra óptica",
     "decente": "aceptable",
     "replicabile": "replicable",
     "diffidava": "desconfiaba",
     "ripopola": "repuebla",
     "incentivi": "incentivos",
     "sostegno": "apoyo",
     "municipio": "municipalidad",
     "incrociato": "cruzado (nos cruzamos con)",
     "rifarebbe": "volvería a hacer",
     "esitazioni": "vacilaciones",
     "pregato": "rogado, pedido"
    },
    "questions": [
     [
      "Qual era la situazione di Roccavecchia quando Colasanti è stata eletta?",
      [
       "Il paese si svuotava e rischiava di perdere i servizi",
       "Il paese era pieno di turisti in ogni stagione",
       "Le case del centro erano state tutte vendute a stranieri",
       "Il paese aveva appena perso la sua biblioteca"
      ],
      "Il paese si svuotava e rischiava di perdere i servizi"
     ],
     [
      "Da quale osservazione è nata l'idea della sindaca?",
      [
       "I proprietari all'estero volevano vendere subito",
       "Gli anziani del paese chiedevano più compagnia",
       "Molte case erano vuote mentre i giovani cercavano casa",
       "La Regione offriva fondi per ristrutturare"
      ],
      "Molte case erano vuote mentre i giovani cercavano casa"
     ],
     [
      "Che cosa pensa la sindaca degli anziani che si opponevano?",
      [
       "Che la loro paura era comprensibile",
       "Che avevano scritto alla Regione per protestare",
       "Che col tempo se ne erano andati dal paese",
       "Che andavano denunciati per la lettera anonima"
      ],
      "Che la loro paura era comprensibile"
     ],
     [
      "Secondo Colasanti, che cosa serve soprattutto per ripopolare un paese?",
      [
       "Incentivi economici più generosi",
       "Una buona promozione turistica estiva",
       "Una ricetta valida per tutti i comuni",
       "Servizi essenziali per chi ci abita"
      ],
      "Servizi essenziali per chi ci abita"
     ],
     [
      "Perché la sindaca consiglia di venire in inverno?",
      [
       "Perché in inverno gli affitti costano meno",
       "Perché d'estate il paese è troppo affollato",
       "Perché è in inverno che si vede la vita vera del paese",
       "Perché in inverno il municipio ha più tempo"
      ],
      "Perché è in inverno che si vede la vita vera del paese"
     ]
    ],
    "vf": [
     [
      "Oggi a Roccavecchia vivono quasi quattrocento persone.",
      "vero"
     ],
     [
      "Il Comune ha regalato le case ai nuovi residenti.",
      "falso"
     ],
     [
      "La traduttrice è arrivata a Roccavecchia da Milano.",
      "non si dice"
     ],
     [
      "Prima dell'arrivo della fibra, alcuni lavoravano dalla biblioteca comunale.",
      "vero"
     ],
     [
      "L'illustratrice sostiene che vivere a Roccavecchia sia facile.",
      "falso"
     ]
    ],
    "hunt": {
     "label": "Tocá los verbos que cambian de tiempo o de modo en el discurso indirecto (en los tiempos compuestos, el auxiliar)",
     "targets": [
      "fosse",
      "aveva",
      "era",
      "erano",
      "trattava",
      "lavoravano",
      "considerava",
      "provasse",
      "capisse",
      "faceva",
      "esistevano",
      "diffidava",
      "presentava",
      "sarebbe",
      "avesse",
      "avrebbe",
      "avrebbero"
     ]
    }
   },
   "ascolto": {
    "title": "Chiudere il pezzo",
    "genre": "conversazione in redazione",
    "es": "En la redacción de un diario, la jefa de sección le pide a un cronista joven que le cuente qué se dijo en una conferencia de prensa sobre el futuro de una fábrica.",
    "speakers": [
     "Federica, caporedattrice",
     "Luca, cronista"
    ],
    "turns": [
     [
      "A",
      "Luca, eccoti finalmente. Allora, com'è andata la conferenza stampa? Tra un'ora dobbiamo chiudere il pezzo."
     ],
     [
      "B",
      "Allora, è stata lunga, ma interessante. L'amministratore delegato, Ferretti, ha detto che lo stabilimento di Borgo San Vito non chiuderà quest'anno."
     ],
     [
      "A",
      "Aspetta, aspetta. Ha detto proprio che non chiuderà, o ha detto un'altra cosa? Perché cambiano due parole e cambia la notizia."
     ],
     [
      "B",
      "Eh, hai ragione. Guarda, ho la registrazione. Le parole esatte sono: per il momento non abbiamo intenzione di chiudere lo stabilimento. Quindi ha detto che per il momento non avevano intenzione di chiuderlo."
     ],
     [
      "A",
      "Ecco. Per il momento, nel titolo, non può mancare. E sui posti di lavoro?"
     ],
     [
      "B",
      "Ha spiegato che l'azienda avrebbe ridotto la produzione del trenta per cento e che una parte dei dipendenti sarebbe passata in cassa integrazione. Però ha anche detto che nessuno sarebbe stato licenziato."
     ],
     [
      "A",
      "Nessuno? E i sindacati che cosa hanno detto?"
     ],
     [
      "B",
      "C'era la segretaria provinciale, la Martelli. Ha detto che non si fidava delle promesse e che voleva vedere un piano scritto entro la fine del mese. Ha aggiunto che, se il piano non fosse arrivato, i lavoratori avrebbero scioperato."
     ],
     [
      "A",
      "Benissimo, questo va in apertura. Qualcuno ha fatto domande sul trasferimento all'estero? Girava questa voce da settimane."
     ],
     [
      "B",
      "Sì, gliel'ho chiesto io, in realtà. Gli ho chiesto se fosse vero che volevano spostare la produzione in Romania."
     ],
     [
      "A",
      "E lui?"
     ],
     [
      "B",
      "Ha risposto che non commentava le voci, ma che l'azienda stava valutando tutte le opzioni. Poi ha cambiato argomento, ha cominciato a parlare dei nuovi prodotti."
     ],
     [
      "A",
      "Classico. Allora scrivi esattamente così: che ha detto di non commentare le voci e che stavano valutando tutte le opzioni. Niente interpretazioni, quelle il lettore le fa da solo."
     ],
     [
      "B",
      "D'accordo. Sui numeri, invece, è stato vaghissimo: ha detto che l'anno prima le vendite erano calate, ma non ha voluto dire di quanto, e ha precisato che i dati sarebbero stati pubblicati insieme al bilancio, a maggio. Ah, e un'altra cosa: alla fine un operaio ha preso la parola, anche se non era previsto. Ha detto che lavorava lì da ventidue anni e che suo padre ci aveva lavorato prima di lui. Ha chiesto a Ferretti di venire in fabbrica a spiegarlo di persona, durante il turno di notte."
     ],
     [
      "A",
      "Questo è bello. Mettilo in chiusura, magari con una citazione diretta. E il nome ce l'hai?"
     ],
     [
      "B",
      "Sì, ma mi ha chiesto di non scriverlo. Ha detto che aveva paura di avere problemi."
     ],
     [
      "A",
      "Allora rispettiamo la richiesta: scrivi un operaio con ventidue anni di anzianità. Dai, hai cinquanta minuti."
     ]
    ],
    "gloss": {
     "dai": "(Dai!) ¡Dale!, ¡vamos!",
     "hai": "(il nome ce l'hai?) ¿tenés el nombre?: *ce l'hai* = lo tenés (semana 45)",
     "pezzo": "nota, artículo",
     "stabilimento": "planta, fábrica",
     "integrazione": "(cassa integrazione) seguro por suspensión, con parte del sueldo",
     "licenziato": "despedido",
     "sindacati": "sindicatos",
     "scioperato": "hecho paro, ido a la huelga",
     "apertura": "comienzo de la nota, lo destacado",
     "voce": "rumor",
     "voci": "rumores",
     "operaio": "obrero",
     "turno": "turno",
     "anzianità": "antigüedad",
     "bilancio": "balance (contable)",
     "calate": "bajado, caído"
    },
    "questions": [
     [
      "Perché Federica interrompe Luca all'inizio?",
      [
       "Pensa che Luca sia arrivato troppo tardi",
       "Vuole sapere le parole esatte dell'amministratore",
       "Non crede che la conferenza sia stata interessante",
       "Vuole cambiare il titolo che aveva già deciso"
      ],
      "Vuole sapere le parole esatte dell'amministratore"
     ],
     [
      "Che cosa ha annunciato l'azienda sui dipendenti?",
      [
       "Che alcuni saranno licenziati entro fine mese",
       "Che tutti saranno trasferiti in Romania",
       "Che la produzione aumenterà del trenta per cento",
       "Che una parte andrà in cassa integrazione"
      ],
      "Che una parte andrà in cassa integrazione"
     ],
     [
      "Qual è la posizione della sindacalista?",
      [
       "Chiede un piano scritto e minaccia uno sciopero",
       "È soddisfatta delle promesse fatte dall'amministratore",
       "Propone di trasferire la produzione",
       "Vuole incontrare i lavoratori di notte"
      ],
      "Chiede un piano scritto e minaccia uno sciopero"
     ],
     [
      "Come risponde Ferretti alla domanda sulla Romania?",
      [
       "Conferma il trasferimento entro l'anno",
       "Evita di rispondere in modo chiaro",
       "Nega con decisione ogni ipotesi",
       "Dice che ne parlerà prima ai sindacati"
      ],
      "Evita di rispondere in modo chiaro"
     ],
     [
      "Quale principio del mestiere difende Federica?",
      [
       "Mettere sempre il nome di tutte le persone citate",
       "Scrivere titoli che attirino più lettori possibile",
       "Riportare fedelmente le parole, senza interpretarle",
       "Dare più spazio all'azienda che ai sindacati"
      ],
      "Riportare fedelmente le parole, senza interpretarle"
     ]
    ],
    "vf": [
     [
      "L'amministratore delegato ha escluso per sempre la chiusura dello stabilimento.",
      "falso"
     ],
     [
      "La domanda sulla Romania l'ha fatta Luca.",
      "vero"
     ],
     [
      "L'intervento dell'operaio era previsto nel programma della conferenza.",
      "falso"
     ],
     [
      "Il pezzo uscirà in prima pagina.",
      "non si dice"
     ]
    ]
   },
   "compito": {
    "genre": "sintesi",
    "title": "Idee da altrove: Roccavecchia",
    "fonte": "lettura",
    "t": "Il giornale del tuo quartiere ha una rubrica, «Idee da altrove», che presenta esperienze di altri paesi. Ti chiedono di scrivere una sintesi dell'intervista alla sindaca di Roccavecchia. Riporta in terza persona e in discorso indiretto, senza citazioni dirette: come è nato il progetto, le difficoltà iniziali, che cosa pensa la sindaca dei servizi e quale consiglio dà ai giovani. Non aggiungere opinioni personali. Registro neutro, da 182 a 242 parole.",
    "es": "Resumen objetivo, en tercera persona y todo en discurso indirecto: ojo con la concordancia de tiempos (ha detto che era / sarebbe stata / avesse) y con no agregar tu opinión.",
    "min": 182,
    "max": 242,
    "punti": [
     [
      "cómo nació el proyecto",
      [
       "case vuote",
       "censimento",
       "abitazioni"
      ]
     ],
     [
      "las dificultades del comienzo",
      [
       "anzian",
       "difficolt",
       "diffiden"
      ]
     ],
     [
      "los servicios como clave",
      [
       "servizi",
       "medico",
       "farmacia"
      ]
     ],
     [
      "el consejo a los jóvenes",
      [
       "inverno",
       "gennaio"
      ]
     ],
     [
      "usar el discurso indirecto",
      [
       "ha spiegato che",
       "ha detto che",
       "ha raccontato che",
       "ha aggiunto che",
       "ha sostenuto"
      ]
     ]
    ],
    "model": "Roccavecchia: come si riporta la vita in un paese di montagna\n\nIn una recente intervista Marta Colasanti, sindaca di Roccavecchia, piccolo comune dell'Appennino molisano, ha raccontato come in cinque anni il paese sia passato da circa trecento a quasi quattrocento abitanti.\n\nLa sindaca ha spiegato che tutto era cominciato da un giro per il centro storico, dove aveva contato più di cento case vuote. Si era chiesta perché dovessero restare chiuse mentre in città i giovani non trovavano casa, e da lì erano nati un censimento delle abitazioni e un accordo con i proprietari. Ha precisato che le case non erano state regalate: erano state affittate a prezzi bassi a chi si impegnava a ristrutturarle e a restare almeno tre anni.\n\nColasanti ha ammesso che all'inizio non erano mancate le difficoltà, soprattutto la diffidenza di alcuni anziani, che secondo lei avevano paura di perdere il paese. Ha sostenuto inoltre che non esistevano ricette valide ovunque e che un paese si ripopola soprattutto con i servizi, come il medico, i trasporti e la farmacia, che sarebbe stata la sua prossima battaglia.\n\nInfine ha detto che a un giovane interessato consiglierebbe di visitare il paese in inverno e di restarci almeno una settimana, perché è a gennaio che si capisce se si è davvero pronti a viverci.",
    "gloss": {
     "sindaca": "intendenta",
     "censimento": "censo, relevamiento",
     "si impegnava a": "se comprometía a",
     "non erano mancate le difficoltà": "no habían faltado las dificultades",
     "diffidenza": "desconfianza",
     "ricette": "recetas, fórmulas"
    }
   },
   "breve": {
    "title": "Un bando per vivere a Roccavecchia",
    "genre": "notizia radiofonica",
    "es": "Una radio regional cuenta, en discurso indirecto, lo que dijo la intendenta de un pueblo sobre un nuevo llamado para vecinos.",
    "speaker": "Giornalista",
    "voice": 0,
    "text": [
     "Radio Molise, notizie dal territorio. Il Comune di Roccavecchia ha pubblicato un nuovo bando per chi vuole trasferirsi in paese. La sindaca, Marta Colasanti, ha spiegato ai nostri microfoni che quest'anno le case disponibili sono quindici e che l'affitto sarà di cento euro al mese per i primi tre anni.",
     "Ha precisato che chi partecipa dovrà impegnarsi a ristrutturare l'abitazione e a prendere la residenza entro sei mesi. Ha aggiunto che avranno la precedenza le famiglie con figli in età scolare, perché la priorità è tenere aperta la scuola.",
     "Alla domanda se fosse preoccupata per l'arrivo di tanti forestieri, la sindaca ha risposto che il paese era pronto e che, anzi, ne aveva bisogno. Ha detto anche che dal mese successivo sarebbe arrivato un medico due volte alla settimana.",
     "Le domande vanno presentate entro il 30 aprile, online o all'ufficio anagrafe. Il bando completo è sul sito del Comune."
    ],
    "tabella": [
     [
      "Case disponibili",
      "15",
      [
       "quindici"
      ]
     ],
     [
      "Affitto al mese (euro)",
      "100",
      [
       "cento"
      ]
     ],
     [
      "Tempo per prendere la residenza",
      "6 mesi",
      [
       "sei mesi",
       "6",
       "sei",
       "entro sei mesi"
      ]
     ],
     [
      "Scadenza delle domande",
      "30 aprile",
      [
       "il 30 aprile",
       "trenta aprile",
       "entro il 30 aprile"
      ]
     ]
    ],
    "info": [
     [
      "L'affitto basso vale per sempre.",
      false
     ],
     [
      "Chi arriva deve ristrutturare la casa.",
      true
     ],
     [
      "Le famiglie con figli hanno la precedenza.",
      true
     ],
     [
      "La sindaca ha detto che il paese non era pronto.",
      false
     ],
     [
      "Arriverà un medico due volte alla settimana.",
      true
     ],
     [
      "Le domande si presentano solo in municipio.",
      false
     ]
    ],
    "gloss": {
     "bando": "llamado, convocatoria",
     "precedenza": "prioridad",
     "forestieri": "forasteros",
     "anagrafe": "registro civil"
    }
   }
  },
  {
   "week": 40,
   "level": "B2+",
   "lettura": {
    "title": "Il caffè della signora Gilda",
    "emoji": "🗂️",
    "genre": "rubrica (articolo di costume)",
    "grammar": "il causativo: fare e lasciare + infinito",
    "text": "Quando ho deciso di trasferirmi a Torino, un amico italiano mi ha dato un solo consiglio: «Fatti dare tutto per iscritto e non lasciarti mai mandare via senza un numero di protocollo». Lì per lì ho riso. Sei mesi dopo, posso dire che è stato il consiglio più prezioso che abbia mai ricevuto.\n\nLa prima tappa è stata il codice fiscale. In teoria è semplice: si va all'ufficio, si compila un modulo, si esce con un foglio. In pratica, l'impiegata mi ha fatto notare che sul passaporto il mio secondo cognome era scritto in modo diverso rispetto al contratto d'affitto, e mi ha fatto tornare il giorno dopo con una dichiarazione firmata dal padrone di casa. Non era cattiveria, anzi: la seconda volta mi ha perfino lasciato passare davanti a tutti, per non farmi rifare la fila.\n\nPoi è arrivata la residenza. Qui ho imparato che in Italia non basta dichiarare dove si abita: bisogna lasciarselo verificare. Qualche settimana dopo la domanda, un vigile è passato a controllare che vivessi davvero all'indirizzo indicato. Nessuno mi aveva detto quando sarebbe venuto, e naturalmente è venuto mentre ero al lavoro. La mia vicina, la signora Gilda, che abita qui da quarant'anni, l'ha fatto entrare nel portone, gli ha fatto vedere il mio nome sulla cassetta delle lettere e, a quanto pare, gli ha anche offerto un caffè. La residenza è arrivata dieci giorni dopo. Non so se sia merito del caffè, ma da allora porto alla signora Gilda le paste ogni domenica.\n\nPoi c'è stata la banca. Per aprire un conto mi hanno fatto firmare diciassette fogli, li ho contati, e me ne hanno lasciati portare a casa soltanto due. Quando ho chiesto di poter leggere il contratto con calma, l'impiegato mi ha guardato come se gli avessi chiesto di farmi vedere la cassaforte. Alla fine me l'ha mandato via mail, con un sorriso un po' offeso, e ho scoperto che conteneva tre commissioni di cui nessuno mi aveva parlato.\n\nIl capitolo più lungo è stato il riconoscimento della laurea. In Argentina ho studiato architettura, e per esercitare in Italia avrei dovuto far tradurre tutti i documenti da un traduttore giurato, farli legalizzare e farli valutare da una commissione. Ho fatto fare le traduzioni a Buenos Aires, dove costavano meno, ma mi hanno fatto sapere che non bastavano: dovevano essere asseverate qui, davanti a un funzionario del tribunale. Ho pagato due volte, e ho imparato la parola asseverazione, che non dimenticherò mai.\n\nNon voglio però raccontare solo una storia di file e di timbri. In questi mesi ho incontrato anche un'Italia che funziona meglio di quanto dicano gli italiani stessi. All'anagrafe un impiegato giovane mi ha lasciato fotografare tutti i moduli, per farmeli controllare a casa con calma. All'azienda sanitaria, dove sono andato a farmi assegnare un medico di base, una signora allo sportello mi ha fatto scegliere tra tre dottori, spiegandomi con pazienza le differenze di orario. E il servizio online per prenotare gli appuntamenti, quando non si blocca, è più rapido di quanto mi aspettassi.\n\nChe cosa ho imparato, allora? Tre cose, che lascio qui per chi arriva dopo di me. Primo: non lasciatevi scoraggiare dalla prima risposta negativa; spesso è la risposta di quel giorno, non quella definitiva. Secondo: fatevi dire sempre il nome della persona con cui parlate e fatevi rilasciare una ricevuta, anche quando vi dicono che non serve. Terzo: fate amicizia con i vicini. In un paese in cui molte pratiche dipendono dalla possibilità che qualcuno vi trovi in casa, una signora Gilda vale più di qualsiasi app.\n\nL'altro giorno è finalmente arrivata la lettera della commissione: la laurea è riconosciuta. L'ho fatta incorniciare e l'ho appesa in soggiorno, accanto alla prima ricevuta del codice fiscale, quella con il cognome sbagliato. Mi ricorda che dietro la burocrazia, in fondo, ci sono sempre delle persone. Alcune ti fanno perdere la pazienza; altre ti lasciano entrare dal portone e ti offrono un caffè.",
    "gloss": {
     "pare": "(a quanto pare) por lo visto",
     "verificare": "(lasciarselo verificare) dejar que te lo verifiquen: *lasciarsi* + infinitivo",
     "lì": "(lì per lì) en el momento",
     "protocollo": "número de expediente, de registro",
     "tappa": "etapa",
     "modulo": "formulario",
     "impiegata": "empleada",
     "affitto": "alquiler",
     "cattiveria": "maldad",
     "vigile": "agente municipal",
     "portone": "puerta de calle del edificio",
     "cassetta": "buzón",
     "paste": "masas, facturas",
     "laurea": "título universitario",
     "esercitare": "ejercer (la profesión)",
     "giurato": "(traduttore giurato) traductor público",
     "asseverate": "juradas (ante un funcionario)",
     "file": "filas",
     "timbri": "sellos",
     "anagrafe": "registro civil",
     "sportello": "ventanilla",
     "prenotare": "sacar turno",
     "scoraggiare": "desanimar",
     "rilasciare": "expedir, entregar",
     "ricevuta": "comprobante",
     "pratiche": "trámites",
     "incorniciare": "enmarcar",
     "soggiorno": "living",
     "cassaforte": "caja fuerte",
     "commissioni": "comisiones, cargos"
    },
    "questions": [
     [
      "Che cosa voleva dire, in sostanza, il consiglio dell'amico?",
      [
       "Non fidarsi mai degli impiegati pubblici",
       "Farsi accompagnare sempre da un avvocato di fiducia",
       "Conservare una prova scritta di ogni passaggio",
       "Evitare gli uffici nelle ore di punta"
      ],
      "Conservare una prova scritta di ogni passaggio"
     ],
     [
      "Perché l'autore è dovuto tornare all'ufficio del codice fiscale?",
      [
       "Per una differenza nel cognome tra due documenti",
       "Perché aveva lasciato il passaporto a casa",
       "Perché l'impiegata si era rifiutata di aiutarlo",
       "Perché quel giorno la fila era troppo lunga"
      ],
      "Per una differenza nel cognome tra due documenti"
     ],
     [
      "Che ruolo ha avuto la signora Gilda nella pratica della residenza?",
      [
       "Ha firmato la dichiarazione per il codice fiscale",
       "Ha accompagnato l'autore all'ufficio anagrafe",
       "Ha presentato la domanda al posto dell'autore",
       "Ha mostrato al vigile che l'autore abitava lì"
      ],
      "Ha mostrato al vigile che l'autore abitava lì"
     ],
     [
      "Qual è stato il problema delle traduzioni fatte a Buenos Aires?",
      [
       "Erano piene di errori di ortografia",
       "Da sole non bastavano, serviva un passaggio in Italia",
       "Erano costate più di quelle italiane",
       "La commissione le aveva smarrite"
      ],
      "Da sole non bastavano, serviva un passaggio in Italia"
     ],
     [
      "Qual è il tono generale dell'articolo?",
      [
       "Arrabbiato e pieno di rancore",
       "Ironico ma, in fondo, riconoscente",
       "Neutro e puramente informativo",
       "Nostalgico nei confronti dell'Argentina"
      ],
      "Ironico ma, in fondo, riconoscente"
     ]
    ],
    "vf": [
     [
      "L'autore ha studiato architettura in Argentina.",
      "vero"
     ],
     [
      "Il vigile aveva avvisato l'autore del giorno del controllo.",
      "falso"
     ],
     [
      "L'autore lavora già in uno studio di architettura torinese.",
      "non si dice"
     ],
     [
      "Secondo l'autore, la prima risposta negativa è quasi sempre definitiva.",
      "falso"
     ],
     [
      "Alla fine la laurea dell'autore è stata riconosciuta.",
      "vero"
     ]
    ],
    "hunt": {
     "label": "Tocá las formas de fare y lasciare que llevan un infinitivo (causativo)",
     "targets": [
      "fatti",
      "lasciarti",
      "fatto",
      "lasciato",
      "farmi",
      "lasciarselo",
      "lasciati",
      "far",
      "farli",
      "farmeli",
      "lasciatevi",
      "fatevi",
      "fatta",
      "fanno",
      "lasciano"
     ]
    }
   },
   "ascolto": {
    "title": "La lavatrice di Giorgio",
    "genre": "programma radiofonico di consulenza",
    "es": "En un programa de radio sobre derechos del consumidor, una abogada atiende la llamada de un oyente que tiene un problema con un electrodoméstico.",
    "speakers": [
     "Paola Donati, avvocata e conduttrice",
     "Giorgio, ascoltatore"
    ],
    "turns": [
     [
      "A",
      "Buonasera e benvenuti a Diritti in tasca. Come ogni giovedì rispondiamo alle vostre domande su consumi, contratti e servizi. Abbiamo il primo ascoltatore in linea: Giorgio, da Pescara. Buonasera, Giorgio."
     ],
     [
      "B",
      "Buonasera, avvocata. Allora, le spiego. A giugno dell'anno scorso ho comprato una lavatrice in un grande negozio di elettrodomestici. Tutto bene fino a un mese fa, quando ha smesso di centrifugare. Ha cominciato a fare un rumore strano e poi più niente."
     ],
     [
      "A",
      "Quindi dopo circa quattordici mesi. E lei che cosa ha fatto?"
     ],
     [
      "B",
      "Sono tornato al negozio, con lo scontrino. Mi hanno detto che la garanzia del produttore era di un anno e che, se volevo, potevo farla riparare dal loro centro assistenza. Però a pagamento. Mi hanno fatto un preventivo di centottanta euro."
     ],
     [
      "A",
      "Ecco, mi fermo subito qui, perché questo è un equivoco che sentiamo spesso. Lei ha diritto alla garanzia legale di conformità, che dura due anni dalla consegna. Ed è il venditore che ne risponde, non solo il produttore. Quindi non si lasci convincere che, dopo un anno, è tutto a suo carico."
     ],
     [
      "B",
      "Ah. Ma loro dicevano che la garanzia di un anno era scritta sul libretto."
     ],
     [
      "A",
      "Quella è un'altra cosa, diciamo un servizio in più del produttore. Si aggiunge alla garanzia legale, non la sostituisce. Mi dica una cosa: la lavatrice l'ha già fatta vedere a qualcuno?"
     ],
     [
      "B",
      "Sì, cioè, no... Ho fatto venire un tecnico, un amico di mio cognato, che mi ha detto che è un difetto della scheda elettronica. Ma non mi ha lasciato nessun documento."
     ],
     [
      "A",
      "Va bene, non è grave. Allora, il consiglio pratico è questo: scriva al negozio una lettera formale, meglio con una PEC o con una raccomandata. Descriva il difetto, indichi la data di acquisto, alleghi la copia dello scontrino e chieda che il prodotto venga riparato o sostituito senza spese. E si faccia sempre rilasciare una ricevuta di tutto quello che consegna."
     ],
     [
      "B",
      "E se mi dicono di no un'altra volta?"
     ],
     [
      "A",
      "Allora può rivolgersi a un'associazione di consumatori, che la può aiutare a far valere i suoi diritti, anche con una procedura di conciliazione. Nella maggior parte dei casi non serve andare davanti a un giudice."
     ],
     [
      "B",
      "Un'ultima cosa. Nel frattempo, posso farla riparare da un altro tecnico? Perché con due bambini, senza lavatrice, è un disastro."
     ],
     [
      "A",
      "La capisco benissimo. Però le consiglio di aspettare la risposta del negozio. Se la fa riparare altrove prima, rischia che le dicano che il guasto è stato causato proprio da quell'intervento. Intanto, per qualche settimana, lasci che siano le lavanderie a gettoni a fare il lavoro."
     ],
     [
      "B",
      "D'accordo. Grazie mille, avvocata, mi è stata utilissima."
     ],
     [
      "A",
      "Si figuri, Giorgio. E ci faccia sapere come va a finire!"
     ]
    ],
    "gloss": {
     "figuri": "(si figuri) no hay de qué, faltaba más",
     "risponde": "(è il venditore che ne risponde) el que responde por eso es el vendedor: *rispondere di* = responder por",
     "lavatrice": "lavarropas",
     "elettrodomestici": "electrodomésticos",
     "centrifugare": "centrifugar",
     "scontrino": "ticket de compra",
     "preventivo": "presupuesto",
     "equivoco": "malentendido",
     "carico": "(a suo carico) a su cargo",
     "libretto": "manual, folleto",
     "cognato": "cuñado",
     "raccomandata": "carta certificada",
     "alleghi": "adjunte",
     "conciliazione": "conciliación, mediación",
     "guasto": "desperfecto, falla",
     "gettoni": "fichas (lavanderia a gettoni: lavadero automático)"
    },
    "questions": [
     [
      "Qual è il problema di Giorgio?",
      [
       "Il negozio non vuole ridargli lo scontrino",
       "Il tecnico gli ha chiesto troppi soldi",
       "Gli hanno consegnato un modello diverso",
       "La lavatrice si è rotta dopo circa quattordici mesi"
      ],
      "La lavatrice si è rotta dopo circa quattordici mesi"
     ],
     [
      "Che cosa gli ha proposto il negozio?",
      [
       "Una riparazione a pagamento",
       "Una lavatrice nuova a metà prezzo",
       "Il rimborso completo della spesa",
       "Una visita gratuita del tecnico"
      ],
      "Una riparazione a pagamento"
     ],
     [
      "Secondo l'avvocata, chi deve rispondere del difetto?",
      [
       "Solo il produttore della lavatrice",
       "Il tecnico che l'ha controllata",
       "Il venditore, per due anni",
       "Nessuno, perché è passato un anno"
      ],
      "Il venditore, per due anni"
     ],
     [
      "Perché l'avvocata sconsiglia di far riparare subito la lavatrice altrove?",
      [
       "Perché il negozio potrebbe dare la colpa a quell'intervento",
       "Perché costerebbe più di una lavatrice nuova",
       "Perché solo il centro assistenza ha i pezzi di ricambio",
       "Perché la legge lo vieta nei primi due anni"
      ],
      "Perché il negozio potrebbe dare la colpa a quell'intervento"
     ],
     [
      "Che cosa suggerisce l'avvocata con la frase sulle lavanderie a gettoni?",
      [
       "Che le lavanderie costano meno di una riparazione",
       "Che Giorgio dovrebbe chiedere il rimborso delle spese",
       "Che è meglio non comprare più una lavatrice",
       "Che per qualche settimana conviene arrangiarsi"
      ],
      "Che per qualche settimana conviene arrangiarsi"
     ]
    ],
    "vf": [
     [
      "Giorgio ha conservato lo scontrino.",
      "vero"
     ],
     [
      "Il tecnico amico del cognato gli ha lasciato un documento scritto.",
      "falso"
     ],
     [
      "Giorgio ha comprato la lavatrice a rate.",
      "non si dice"
     ],
     [
      "Secondo l'avvocata, di solito non è necessario andare da un giudice.",
      "vero"
     ]
    ]
   },
   "compito": {
    "genre": "lettera_formale",
    "title": "Reclamo per una lavatrice difettosa",
    "fonte": "ascolto",
    "t": "Sei Giorgio, l'ascoltatore che ha chiamato la trasmissione «Diritti in tasca». Seguendo i consigli dell'avvocata, scrivi una lettera di reclamo al negozio in cui hai comprato la lavatrice: indica i dati dell'acquisto, descrivi il difetto e la risposta che ti hanno dato in negozio, ricorda i tuoi diritti, fai una richiesta precisa e spiega che cosa farai se non riceverai risposta. Registro formale, da 188 a 248 parole.",
    "es": "Carta formal de reclamo con asunto (oggetto), hechos, derecho que invocás, pedido concreto y plazo. Usá el causativo donde sea natural (farla riparare, farmi avere…).",
    "min": 188,
    "max": 248,
    "punti": [
     [
      "datos de la compra y descripción del defecto",
      [
       "lavatrice",
       "acquist",
       "scontrino"
      ]
     ],
     [
      "invocar la garantía legal de dos años",
      [
       "garanzia",
       "due anni",
       "conformità"
      ]
     ],
     [
      "pedir reparación o sustitución sin costo",
      [
       "ripar",
       "sostitu"
      ]
     ],
     [
      "plazo y próximos pasos",
      [
       "entro",
       "associazione",
       "consumatori"
      ]
     ],
     [
      "asunto y fórmulas formales",
      [
       "oggetto",
       "spettabile",
       "distinti saluti"
      ]
     ]
    ],
    "model": "Spettabile Elettrocasa S.r.l.\nServizio clienti\n\nOggetto: reclamo per difetto di conformità – lavatrice AquaPlus 8\n\nCon la presente desidero segnalare un difetto della lavatrice che ho acquistato presso il Vostro punto vendita di Pescara il 12 giugno dello scorso anno, come risulta dallo scontrino che allego in copia.\n\nDa circa un mese l'apparecchio non centrifuga più e, dopo un forte rumore, ha smesso completamente di funzionare. Un tecnico che l'ha esaminata mi ha fatto sapere che si tratterebbe di un guasto della scheda elettronica, quindi di un difetto non causato da un uso scorretto.\n\nQuando mi sono rivolto al Vostro negozio, il personale mi ha proposto di farla riparare dal Vostro centro assistenza al costo di 180 euro, sostenendo che la garanzia del produttore era scaduta. Vorrei ricordarVi, tuttavia, che il venditore è tenuto a rispondere dei difetti di conformità per due anni dalla consegna, in base alla garanzia legale, che si aggiunge a quella commerciale del produttore.\n\nVi chiedo pertanto di far riparare o sostituire la lavatrice senza alcuna spesa a mio carico. In mancanza di una risposta entro trenta giorni dal ricevimento della presente, mi vedrò costretto a rivolgermi a un'associazione di consumatori per tutelare i miei diritti.\n\nVi prego infine di farmi avere una conferma scritta del ricevimento di questa lettera.\n\nDistinti saluti\n\nGiorgio Marchetti\n\nAllegato: copia dello scontrino",
    "gloss": {
     "Con la presente": "por la presente (fórmula de carta formal)",
     "scontrino": "el ticket de compra",
     "guasto": "falla, avería",
     "si tratterebbe di": "se trataría de (condicional de lo no confirmado)",
     "è tenuto a": "está obligado a",
     "a mio carico": "a mi cargo",
     "In mancanza di": "a falta de",
     "tutelare": "proteger, defender"
    }
   },
   "breve": {
    "title": "Il centro assistenza richiama",
    "genre": "messaggio in segreteria",
    "es": "El service técnico deja un mensaje sobre el lavarropas en garantía: qué se rompió, qué se paga y cuándo llega el repuesto.",
    "speaker": "Operatrice del centro assistenza",
    "voice": 1,
    "text": [
     "Buongiorno signor Ferri, la chiamiamo dal centro assistenza Tecnoservice per la sua richiesta di riparazione numero 4127. Il tecnico che ha visto la lavatrice ci ha fatto sapere che il guasto riguarda la scheda elettronica e che il pezzo va ordinato direttamente alla casa madre.",
     "Poiché l'apparecchio è ancora in garanzia, la riparazione e il pezzo sono gratuiti: le faremo pagare soltanto il diritto di chiamata, trentacinque euro, come previsto dalle condizioni della garanzia.",
     "Il pezzo dovrebbe arrivare entro dieci giorni lavorativi. Appena arriva, la faremo richiamare dal tecnico per fissare l'appuntamento. Se preferisce, può anche farsi sostituire l'apparecchio: in questo caso, però, dovrebbe portarci lo scontrino originale.",
     "Per qualsiasi domanda ci chiami dal lunedì al venerdì, dalle nove alle diciassette, citando il numero della pratica. Buona giornata."
    ],
    "tabella": [
     [
      "Numero della pratica",
      "4127",
      [
       "4 1 2 7"
      ]
     ],
     [
      "Parte guasta",
      "scheda elettronica",
      [
       "la scheda elettronica",
       "scheda"
      ]
     ],
     [
      "Costo da pagare (euro)",
      "35",
      [
       "trentacinque"
      ]
     ],
     [
      "Tempo per l'arrivo del pezzo",
      "10 giorni",
      [
       "dieci giorni",
       "10 giorni lavorativi",
       "dieci giorni lavorativi",
       "entro dieci giorni"
      ]
     ],
     [
      "Documento necessario per la sostituzione",
      "scontrino",
      [
       "lo scontrino",
       "scontrino originale",
       "lo scontrino originale"
      ]
     ]
    ],
    "info": [
     [
      "La lavatrice non è più in garanzia.",
      false
     ],
     [
      "Il pezzo si ordina alla casa madre.",
      true
     ],
     [
      "Il tecnico chiamerà per fissare l'appuntamento.",
      true
     ],
     [
      "La riparazione costa trentacinque euro più il pezzo.",
      false
     ],
     [
      "Si può chiedere di sostituire la lavatrice.",
      true
     ],
     [
      "Il centro assistenza risponde anche il sabato.",
      false
     ]
    ],
    "gloss": {
     "scheda elettronica": "placa electrónica",
     "diritto di chiamata": "costo de la visita (del técnico)",
     "scontrino": "ticket de compra",
     "pratica": "trámite, expediente"
    }
   }
  },
  {
   "week": 41,
   "level": "B2+",
   "lettura": {
    "title": "Incendio in via dei Mille, un diciassettenne salva un anziano",
    "emoji": "🚒",
    "genre": "articolo di cronaca",
    "grammar": "verbi di percezione + infinito o relativa",
    "text": "Poteva finire in tragedia l'incendio scoppiato nella notte tra sabato e domenica al secondo piano di un palazzo di via dei Mille. Se non è andata così, lo si deve soprattutto alla prontezza di un ragazzo di diciassette anni, Samuele R., che stava tornando a casa in motorino dopo una serata con gli amici.\n\nErano circa le due e mezza. «Ho visto uscire del fumo nero da una finestra socchiusa», ha raccontato ieri il ragazzo, ancora un po' frastornato. «All'inizio ho pensato che qualcuno stesse cucinando, anche se era un'ora strana. Poi ho sentito un vetro scoppiare e ho visto delle fiamme che salivano lungo la tenda.» Samuele ha fermato il motorino, ha chiamato il numero di emergenza e, senza aspettare, ha cominciato a suonare tutti i campanelli del palazzo.\n\nAl secondo piano abita da solo un uomo di ottantaquattro anni, vedovo, che ha qualche difficoltà a camminare. I vicini del piano di sopra, svegliati dal campanello, lo hanno sentito chiamare aiuto dall'interno dell'appartamento. «Lo sentivamo tossire e battere contro la porta, ma non riusciva ad aprirla», ha spiegato una vicina, Loredana B. «La chiave si era incastrata nella serratura.» È stato allora che Samuele, insieme a un altro inquilino, ha sfondato la porta con una spallata. I due hanno trovato l'anziano seduto per terra nel corridoio, dove l'aria era ancora respirabile, e l'hanno portato fuori sulle scale e poi in strada.\n\nL'altro inquilino, un infermiere di quarant'anni che preferisce restare anonimo, ricorda soprattutto il buio. «Nel corridoio non si vedeva quasi niente. Sentivo Samuele che mi chiamava da dietro e il signore che respirava male, ma non riuscivo a capire dove fosse. Poi ho visto la luce del telefono di Samuele illuminargli il viso.» Una volta in strada, è stato lui a controllare il respiro dell'anziano e a metterlo in posizione di sicurezza in attesa dell'ambulanza. «Il ragazzo è stato bravissimo», dice. «Io faccio questo mestiere da vent'anni, ma di notte, in pigiama, a casa propria, è tutta un'altra cosa.»\n\nPochi minuti dopo, i residenti hanno visto arrivare due squadre dei vigili del fuoco e un'ambulanza. Dalla strada, in pigiama e con le coperte sulle spalle, decine di persone guardavano i pompieri salire con le manichette e le maschere. «Si sentiva la gente piangere e pregare», racconta un commerciante che abita nel palazzo di fronte. «Ho visto una signora che teneva in braccio un gatto e non voleva saperne di allontanarsi.» L'incendio è stato domato in circa un'ora. L'appartamento del secondo piano è stato gravemente danneggiato, mentre gli altri hanno riportato soprattutto danni da fumo.\n\nL'anziano, trasportato in ospedale per un'intossicazione lieve, è stato dimesso ieri pomeriggio. Secondo i primi accertamenti, l'incendio sarebbe partito da una stufetta elettrica lasciata accesa vicino al divano. I vigili del fuoco hanno ricordato che, soprattutto nei mesi freddi, questi apparecchi vanno tenuti lontani da tende e tessuti e non vanno mai lasciati in funzione durante la notte.\n\nSamuele, intanto, è diventato suo malgrado il personaggio del giorno. Sui gruppi social del quartiere lo chiamano eroe, e il sindaco ha annunciato che lo riceverà in municipio la settimana prossima. Lui, però, ridimensiona. «Non ho fatto niente di speciale. Chiunque avrebbe fatto lo stesso», ripete. Poi aggiunge, quasi sottovoce, un dettaglio che lascia intuire che cosa abbia vissuto davvero: «Quando l'ho visto per terra che non si muoveva, ho sentito le gambe tremare. Ho pensato a mio nonno.»\n\nAnche Loredana, che conosce l'anziano da trent'anni, vuole dire la sua. «In questo palazzo ci salutiamo appena, ognuno ha la sua vita. Stanotte ho visto persone che non si erano mai parlate aiutarsi a vicenda, portare acqua, prestarsi le giacche. Mi dispiace solo che ci sia voluto un incendio.»\n\nL'anziano, per il momento, è ospite della figlia, che abita in un altro quartiere. Il condominio ha organizzato una raccolta per aiutarlo a rimettere in sesto la casa, e nell'androne del palazzo, da ieri, c'è un cartello scritto a mano: «Grazie, Samuele».",
    "gloss": {
     "sua": "(dire la sua) dar su opinión",
     "saperne": "(non voleva saperne di) no quería saber nada de",
     "controllare": "(è stato lui a controllare) fue él quien controló: *essere* + persona + *a* + infinitivo (semana 48)",
     "deve": "(lo si deve a) se le debe a",
     "prontezza": "rapidez de reflejos",
     "motorino": "ciclomotor, motito",
     "socchiusa": "entornada",
     "frastornato": "aturdido",
     "scoppiare": "estallar",
     "tenda": "cortina",
     "campanelli": "timbres",
     "vedovo": "viudo",
     "tossire": "toser",
     "incastrata": "trabada",
     "serratura": "cerradura",
     "sfondato": "derribado, forzado",
     "spallata": "golpe con el hombro",
     "coperte": "frazadas",
     "pompieri": "bomberos",
     "manichette": "mangueras",
     "domato": "controlado, sofocado",
     "dimesso": "dado de alta",
     "accertamenti": "verificaciones, peritajes",
     "stufetta": "estufita",
     "malgrado": "(suo malgrado) a su pesar",
     "ridimensiona": "le quita importancia",
     "sottovoce": "en voz baja",
     "vicenda": "(a vicenda) mutuamente, unos a otros",
     "raccolta": "colecta",
     "sesto": "(rimettere in sesto) poner otra vez en condiciones",
     "androne": "hall de entrada",
     "infermiere": "enfermero",
     "buio": "oscuridad"
    },
    "questions": [
     [
      "Come si è accorto Samuele dell'incendio?",
      [
       "L'ha chiamato un amico che abita nel palazzo",
       "Ha sentito l'allarme antincendio del condominio",
       "Ha visto il fumo mentre passava in motorino",
       "Ha sentito l'anziano gridare dalla finestra"
      ],
      "Ha visto il fumo mentre passava in motorino"
     ],
     [
      "Perché l'anziano non riusciva a uscire di casa?",
      [
       "Il fumo gli impediva di trovare la porta",
       "La chiave si era bloccata nella serratura",
       "Le fiamme avevano già raggiunto l'ingresso",
       "Era svenuto nel corridoio"
      ],
      "La chiave si era bloccata nella serratura"
     ],
     [
      "Che cosa rivela la frase di Samuele «Ho pensato a mio nonno»?",
      [
       "Che l'anziano era un amico di suo nonno",
       "Che il nonno di Samuele era un vigile del fuoco",
       "Che Samuele non voleva assolutamente essere intervistato",
       "Che dietro la modestia c'è stata una forte emozione"
      ],
      "Che dietro la modestia c'è stata una forte emozione"
     ],
     [
      "Secondo i primi accertamenti, qual è la causa dell'incendio?",
      [
       "Una stufetta elettrica lasciata accesa",
       "Un corto circuito nell'impianto del palazzo",
       "Una candela dimenticata vicino alla tenda",
       "Una pentola lasciata sul fuoco"
      ],
      "Una stufetta elettrica lasciata accesa"
     ],
     [
      "Che cosa vuole sottolineare Loredana?",
      [
       "Che i soccorsi sono arrivati troppo tardi",
       "Che l'emergenza ha fatto nascere una solidarietà insolita",
       "Che l'anziano non dovrebbe vivere da solo",
       "Che nel palazzo tutti si conoscono bene da anni"
      ],
      "Che l'emergenza ha fatto nascere una solidarietà insolita"
     ]
    ],
    "vf": [
     [
      "Samuele ha chiamato i soccorsi prima di suonare i campanelli.",
      "vero"
     ],
     [
      "I due soccorritori hanno trovato l'anziano svenuto in camera da letto.",
      "falso"
     ],
     [
      "Samuele conosceva già l'anziano prima dell'incendio.",
      "non si dice"
     ],
     [
      "L'anziano è ancora ricoverato in ospedale.",
      "falso"
     ],
     [
      "Il sindaco incontrerà Samuele la settimana prossima.",
      "vero"
     ]
    ],
    "hunt": {
     "label": "Tocá los infinitivos que dependen de un verbo de percepción (vedere, sentire, guardare)",
     "targets": [
      "uscire",
      "scoppiare",
      "chiamare",
      "tossire",
      "battere",
      "illuminargli",
      "arrivare",
      "salire",
      "piangere",
      "pregare",
      "tremare",
      "aiutarsi",
      "portare",
      "prestarsi"
     ]
    }
   },
   "ascolto": {
    "title": "Cinghiali sotto casa",
    "genre": "trasmissione radiofonica con gli ascoltatori",
    "es": "Un programa de radio en el que los oyentes cuentan la noticia del día: una mujer llama para relatar su encuentro con una familia de jabalíes en plena ciudad. Habla como se habla por teléfono: se corta, vuelve atrás, el conductor la acompaña.",
    "speakers": [
     "Marco, conduttore",
     "Silvia, ascoltatrice"
    ],
    "turns": [
     [
      "A",
      "Eccoci di nuovo a Filo diretto, la trasmissione in cui la cronaca la fate voi. Abbiamo in linea Silvia, che stamattina ha visto una scena, diciamo, insolita. Silvia, buongiorno!"
     ],
     [
      "B",
      "Buongiorno! Sì, guardi, ancora… ancora non ci credo."
     ],
     [
      "A",
      "Ci racconta?"
     ],
     [
      "B",
      "Allora. Stamattina, verso le sette, stavo portando fuori il cane, in via Garibaldi, proprio vicino alla scuola elementare."
     ],
     [
      "A",
      "Sì."
     ],
     [
      "B",
      "A un certo punto il cane si blocca e comincia a ringhiare. Io non capivo, mi guardavo intorno, e poi li ho visti uscire da dietro i cassonetti."
     ],
     [
      "A",
      "Li ha visti… chi?"
     ],
     [
      "B",
      "I cinghiali! Una mamma e quattro piccoli."
     ],
     [
      "A",
      "Addirittura."
     ],
     [
      "B",
      "Giuro. Li ho visti attraversare la strada con una calma… tipo come se fossero a casa loro. La mamma avrà pesato, boh, ottanta chili?"
     ],
     [
      "A",
      "E lei che cosa ha fatto? Immagino che si sia spaventata."
     ],
     [
      "B",
      "Guardi, mi tremavano le gambe. Il cane tirava fortissimo il guinzaglio e io avevo paura che si liberasse. Allora, niente, sono rimasta ferma, immobile, e l'ho tenuto stretto."
     ],
     [
      "A",
      "Brava."
     ],
     [
      "B",
      "Mi ricordavo di aver letto da qualche parte che non bisogna correre né avvicinarsi, soprattutto se ci sono i piccoli."
     ],
     [
      "A",
      "Ha fatto benissimo, è proprio quello che raccomandano gli esperti. E gli altri passanti?"
     ],
     [
      "B",
      "Eh, qui viene il bello. C'era un signore sul balcone di fronte che urlava e agitava le braccia…"
     ],
     [
      "A",
      "Aiuto."
     ],
     [
      "B",
      "…e un ragazzo che invece si era messo a filmarli col telefono. A due metri, eh! L'ho sentito dire agli amici che voleva fare il video del secolo."
     ],
     [
      "A",
      "Classico."
     ],
     [
      "B",
      "Gli ho detto di allontanarsi, ma niente, non mi ascoltava."
     ],
     [
      "A",
      "E poi? Come è finita?"
     ],
     [
      "B",
      "Dopo qualche minuto abbiamo sentito arrivare una macchina della polizia locale, con la sirena. Forse qualcuno l'aveva chiamata. I cinghiali si sono spaventati e li ho visti scappare verso il parco, quello lungo il torrente. Però prima… prima hanno rovesciato due cassonetti, e la strada era piena di spazzatura."
     ],
     [
      "A",
      "Quindi il problema, alla fine, sono proprio i cassonetti."
     ],
     [
      "B",
      "Ma certo! Io abito qui da vent'anni e una volta non si vedevano mai. Adesso, da un paio d'anni, li sentiamo grufolare quasi ogni notte sotto le finestre."
     ],
     [
      "A",
      "Ogni notte?"
     ],
     [
      "B",
      "Quasi. Il cibo lo trovano facilmente, e allora tornano. Io non ce l'ho con gli animali, eh, poveretti. Ce l'ho con chi lascia la spazzatura fuori dai contenitori."
     ],
     [
      "A",
      "Anche perché lì c'è una scuola a pochi metri."
     ],
     [
      "B",
      "Appunto! Fra mezz'ora arrivavano i bambini. Ho visto la maestra aprire il cancello e le ho raccontato tutto. È diventata bianca come un lenzuolo."
     ],
     [
      "A",
      "Ci credo. Silvia, grazie. Giriamo la sua segnalazione al Comune. E ricordiamo a tutti: se vedete dei cinghiali in città, non avvicinatevi, non date loro da mangiare e chiamate la polizia locale."
     ]
    ],
    "gloss": {
     "messo": "(si era messo a filmarli) se había puesto a filmarlos: *mettersi a* + infinitivo",
     "ho": "(ce l'ho con...) estoy enojada con...: *avercela con qualcuno* (semana 45)",
     "bello": "(qui viene il bello) ahora viene lo mejor",
     "ringhiare": "gruñir",
     "cassonetti": "contenedores de basura",
     "cinghiali": "jabalíes",
     "guinzaglio": "correa",
     "passanti": "transeúntes",
     "agitava": "agitaba, sacudía",
     "rovesciato": "volcado",
     "spazzatura": "basura",
     "grufolare": "hozar, hurgar con el hocico",
     "cancello": "portón, reja",
     "lenzuolo": "sábana",
     "segnalazione": "aviso, denuncia",
     "addirittura": "¡nada menos!, ¿en serio?",
     "boh": "qué sé yo (muletilla)",
     "tipo": "(muletilla) como, onda"
    },
    "questions": [
     [
      "Che cosa stava facendo Silvia quando ha visto i cinghiali?",
      [
       "Accompagnava i figli a scuola",
       "Buttava la spazzatura nei cassonetti",
       "Portava fuori il cane",
       "Era sul balcone di casa"
      ],
      "Portava fuori il cane"
     ],
     [
      "Come si è comportata Silvia davanti agli animali?",
      [
       "È scappata verso il parco con il cane",
       "Ha cercato di allontanarli agitando le braccia",
       "È rimasta ferma tenendo stretto il cane",
       "Ha chiamato subito la polizia locale"
      ],
      "È rimasta ferma tenendo stretto il cane"
     ],
     [
      "Che cosa critica Silvia nel comportamento del ragazzo?",
      [
       "Che filmava gli animali troppo da vicino",
       "Che aveva lasciato la spazzatura per terra",
       "Che aveva chiamato la polizia senza motivo",
       "Che rideva della paura degli altri"
      ],
      "Che filmava gli animali troppo da vicino"
     ],
     [
      "Secondo Silvia, perché i cinghiali tornano in città?",
      [
       "Perché il parco è stato chiuso",
       "Perché qualcuno dà loro da mangiare",
       "Perché ci sono sempre più cani",
       "Perché trovano cibo facilmente"
      ],
      "Perché trovano cibo facilmente"
     ],
     [
      "Qual è l'atteggiamento di Silvia verso i cinghiali?",
      [
       "Li considera pericolosi e vuole che siano abbattuti",
       "Non ce l'ha con loro, ma con chi lascia i rifiuti fuori",
       "Pensa che siano innocui e che il problema non esista",
       "È affascinata e spera di rivederli presto"
      ],
      "Non ce l'ha con loro, ma con chi lascia i rifiuti fuori"
     ],
     [
      "Che cosa vuol dire Silvia con «qui viene il bello»?",
      [
       "Che adesso arriva la parte più curiosa",
       "Che il quartiere è molto bello",
       "Che finalmente arrivano i vigili",
       "Che i cinghiali erano bellissimi"
      ],
      "Che adesso arriva la parte più curiosa"
     ]
    ],
    "vf": [
     [
      "In tutto i cinghiali erano cinque.",
      "vero"
     ],
     [
      "Il ragazzo ha seguito il consiglio di Silvia e si è allontanato.",
      "falso"
     ],
     [
      "Il video del ragazzo è stato pubblicato sui social.",
      "non si dice"
     ],
     [
      "La polizia locale è arrivata dopo qualche minuto.",
      "vero"
     ]
    ]
   },
   "compito": {
    "genre": "email_informale",
    "title": "Quella notte in via dei Mille",
    "fonte": "lettura",
    "t": "Abiti nel palazzo di fronte a quello dell'incendio di via dei Mille e quella notte hai assistito a tutta la scena. Scrivi un'email a un amico o a un'amica italiana che vive all'estero in cui racconti che cosa hai visto e sentito, come ti sei sentito/a, che cosa pensi di Samuele e che cosa ti ha fatto riflettere sui rapporti tra vicini. Registro informale, da 193 a 253 parole.",
    "es": "Mail a un amigo contando la noche del incendio desde tu balcón: hechos del artículo, emociones y una reflexión. Usá verbos de percepción con infinitivo o relativa (ho visto uscire, ho sentito qualcuno che gridava).",
    "min": 193,
    "max": 253,
    "punti": [
     [
      "contar lo que viste y oíste",
      [
       "ho visto",
       "ho sentito",
       "abbiamo visto",
       "abbiamo sentito"
      ]
     ],
     [
      "mencionar a Samuele y el rescate",
      [
       "samuele",
       "ragazzo"
      ]
     ],
     [
      "expresar lo que sentiste",
      [
       "paura",
       "spavent",
       "emozion",
       "piangere",
       "tremav"
      ]
     ],
     [
      "reflexionar sobre los vecinos",
      [
       "vicin",
       "solidariet"
      ]
     ],
     [
      "saludo y despedida informales",
      [
       "ciao",
       "caro",
       "cara",
       "un abbraccio",
       "baci"
      ]
     ]
    ],
    "model": "Ciao Giulia,\n\ncome stai? Ti scrivo perché sabato notte qui in via dei Mille è successo un finimondo, e ho ancora bisogno di raccontarlo a qualcuno.\n\nErano quasi le tre e io dormivo. A un certo punto ho sentito qualcuno suonare tutti i campanelli come un matto e, affacciandomi, ho visto uscire del fumo nero da una finestra del secondo piano del palazzo di fronte, quello del signor Ernesto, hai presente? Il vecchietto con il bastone. Sono scesa in pigiama e in strada c'era già mezzo quartiere.\n\nIl ragazzo che ha dato l'allarme si chiama Samuele e ha diciassette anni. Con un altro inquilino ha sfondato la porta e insieme hanno portato fuori il signor Ernesto, che era rimasto chiuso dentro. Quando li ho visti uscire dal portone, con lui sorretto da tutti e due, mi sono messa a piangere. Poi abbiamo sentito arrivare i pompieri e siamo rimasti lì un'ora a guardarli lavorare. Che paura, davvero.\n\nPer fortuna il signor Ernesto sta bene: l'hanno già dimesso. La cosa più bella, però, è stata un'altra. Come ha detto una vicina al giornale, quella notte ho visto gente che non si era mai salutata offrirsi coperte e acqua. È triste che ci sia voluto un incendio, ma forse qualcosa è cambiato.\n\nE tu? Quando torni a trovarmi? Il resto te lo racconto a voce.\n\nUn abbraccio forte,\nChiara",
    "gloss": {
     "finimondo": "un desastre, un caos total (literalmente «fin del mundo»)",
     "come un matto": "como un loco",
     "affacciandomi": "asomándome (a la ventana)",
     "hai presente?": "¿viste?, ¿lo ubicás?",
     "vecchietto": "viejito (sufijo -etto: se ve en la semana 46)",
     "ha sfondato la porta": "tiró abajo la puerta",
     "l'hanno già dimesso": "ya le dieron el alta",
     "a voce": "en persona, de palabra"
    }
   },
   "breve": {
    "title": "Giornale radio regionale delle otto",
    "genre": "notiziario radiofonico",
    "es": "El noticiero regional de la mañana: un incendio, un choque en la autopista, una biblioteca que reabre y el tiempo.",
    "speaker": "Speaker",
    "voice": 0,
    "text": [
     "Giornale radio regionale, edizione delle otto. Nella notte un incendio ha distrutto un capannone agricolo alle porte di Mantova. Alcuni residenti hanno raccontato di aver sentito un forte scoppio verso le tre e di aver visto le fiamme alzarsi sopra i tetti. Non ci sono feriti; i vigili del fuoco hanno lavorato fino all'alba.",
     "Traffico: code sulla tangenziale est per un incidente tra due auto all'altezza dell'uscita 6. Un testimone ha detto di aver visto una delle vetture sbandare sull'asfalto bagnato. La polizia stradale consiglia percorsi alternativi.",
     "Ha riaperto questa mattina la biblioteca comunale di via Roma, chiusa da febbraio per lavori. Il nuovo orario è dalle nove alle diciannove, anche il sabato.",
     "Infine, il tempo: nebbia in pianura fino a metà mattina, poi sole. Minime intorno allo zero."
    ],
    "tabella": [
     [
      "Ora dello scoppio",
      "3",
      [
       "tre",
       "le tre",
       "verso le tre",
       "alle tre"
      ]
     ],
     [
      "Uscita della tangenziale dell'incidente",
      "6",
      [
       "sei",
       "uscita 6"
      ]
     ],
     [
      "Mese in cui ha chiuso la biblioteca",
      "febbraio",
      []
     ],
     [
      "Ora di chiusura della biblioteca",
      "19",
      [
       "diciannove",
       "alle 19",
       "le 19",
       "19:00"
      ]
     ]
    ],
    "info": [
     [
      "Nell'incendio sono rimaste ferite due persone.",
      false
     ],
     [
      "Alcuni residenti hanno visto le fiamme sopra i tetti.",
      true
     ],
     [
      "L'incidente sulla tangenziale ha coinvolto un camion.",
      false
     ],
     [
      "Un testimone ha visto un'auto sbandare.",
      true
     ],
     [
      "La biblioteca è aperta anche il sabato.",
      true
     ],
     [
      "La nebbia durerà tutto il giorno.",
      false
     ]
    ],
    "gloss": {
     "capannone": "galpón",
     "scoppio": "estallido",
     "code": "embotellamientos, colas",
     "sbandare": "derrapar, perder el control",
     "nebbia": "niebla"
    }
   }
  },
  {
   "week": 42,
   "level": "B2+",
   "lettura": {
    "title": "Si prega di voler cortesemente provvedere",
    "emoji": "📑",
    "genre": "saggio breve",
    "grammar": "verbi e preposizioni (reggenze)",
    "text": "«Si invita la S.V. a voler provvedere al pagamento entro e non oltre il termine sopra indicato.» Chi vive in Italia ha letto frasi del genere decine di volte, e quasi sempre ha avuto bisogno di rileggerle. Il linguaggio della burocrazia, che gli italiani chiamano con una punta di ironia burocratese, è una lingua a parte: si riconosce subito, ma si capisce a fatica.\n\nIl fenomeno non è nuovo. Già nel 1965 Italo Calvino, in un celebre articolo, lo definì «antilingua» e ne diede un esempio rimasto famoso: un brigadiere che, mettendo a verbale la testimonianza di un uomo sceso in cantina ad accendere la stufa, trasforma il suo racconto semplice in una frase interminabile, dove il vino diventa «prodotti vinicoli» e l'uomo diventa «il sottoscritto». Secondo Calvino, chi parla l'antilingua ha paura delle parole concrete e si rifugia in quelle astratte, perché gli sembrano più serie e più sicure.\n\nDa dove nasce questa paura? In parte dipende dalla storia. Per secoli la scrittura amministrativa è stata un privilegio di pochi, e scrivere difficile serviva a marcare una distanza tra chi comandava e chi doveva obbedire. In parte, però, dipende da ragioni più quotidiane. Il funzionario che redige una comunicazione tiene conto soprattutto delle possibili conseguenze legali: teme che una frase troppo semplice possa essere contestata, e preferisce rifarsi a formule già usate, che nessuno ha mai osato mettere in discussione. Così molti testi si limitano a copiare modelli vecchi di decenni, e nessuno si accorge di quanto siano diventati incomprensibili.\n\nLe caratteristiche del burocratese sono facili da elencare. Si abusa dei verbi generici, come effettuare, procedere a, provvedere a: non si paga, ma si procede al pagamento; non si chiude un ufficio, ma si provvede alla chiusura dei locali. Si preferiscono i nomi ai verbi, le forme passive e impersonali a quelle attive, le parole lunghe a quelle brevi. Si ricorre a espressioni come «in ottemperanza a», «ai sensi di», «nelle more di», che chi non ha studiato diritto fatica a interpretare. E soprattutto si rinuncia a indicare chi fa che cosa: il soggetto sparisce, e con lui la responsabilità.\n\nUn esempio aiuta a capire. Un avviso appeso nell'atrio di un ufficio pubblico recitava: «Si rende noto all'utenza che, a decorrere dal giorno 1 del mese corrente, si procederà all'interruzione del servizio di ricevimento del pubblico nella fascia pomeridiana». Tradotto: da questo mese l'ufficio è chiuso il pomeriggio. Otto parole contro venticinque, e nessuna informazione persa. La versione breve, anzi, ne aggiunge una: fa capire subito al cittadino che cosa cambia per lui.\n\nIl prezzo di questa lingua lo pagano i cittadini. Un modulo poco chiaro fa perdere tempo, spinge le persone a rivolgersi a intermediari a pagamento, moltiplica gli errori e quindi le pratiche da correggere. A soffrirne di più sono proprio i più deboli: gli anziani, chi ha studiato poco, gli stranieri che stanno imparando l'italiano e che, davanti a una lettera dell'ufficio tributi, non sanno se si tratti di un avviso o di una multa.\n\nNegli ultimi decenni sono stati fatti diversi tentativi per cambiare le cose. Sono stati pubblicati manuali di stile e guide alla scrittura chiara, e alcune amministrazioni hanno cominciato ad avvalersi della consulenza di linguisti. Le regole proposte sono semplici: usare frasi brevi, preferire le parole comuni, rivolgersi direttamente al lettore, mettere all'inizio l'informazione più importante. Eppure i risultati sono stati disomogenei. Molti uffici si sono attenuti alle nuove indicazioni per qualche mese, per poi tornare alle vecchie abitudini.\n\nIl motivo, forse, è che scrivere in modo semplice è più difficile che scrivere in modo complicato. Richiede di sapere esattamente che cosa si vuole dire, di assumersi la responsabilità di dirlo e di fidarsi del lettore. Non basta sostituire qualche parola: bisogna ripensare il rapporto tra l'amministrazione e i cittadini che la finanziano con le loro tasse.\n\nNon si tratta, insomma, di una questione di stile. Una pubblica amministrazione che si fa capire è un'amministrazione che rispetta i cittadini e che accetta di essere controllata da loro. E se un giorno riceveremo una lettera che dice semplicemente «Deve pagare entro il 30 giugno», potremo dire che l'antilingua, finalmente, ha cominciato a perdere terreno.",
    "gloss": {
     "soffrirne": "(a soffrirne di più sono...) los que más lo sufren son...: *essere* + *a* + infinitivo destaca quién (semana 48)",
     "noto": "(si rende noto) se hace saber",
     "rifarsi": "(rifarsi a) remitirse a, basarse en",
     "conto": "(tiene conto di) tiene en cuenta",
     "burocratese": "lenguaje burocrático",
     "fatica": "(a fatica) con dificultad",
     "brigadiere": "suboficial (de policía o de carabineros)",
     "verbale": "(mettere a verbale) asentar en un acta",
     "cantina": "sótano",
     "stufa": "estufa",
     "rifugia": "se refugia",
     "obbedire": "obedecer",
     "redige": "redacta",
     "contestata": "impugnada, cuestionada",
     "osato": "(nessuno ha mai osato) nadie se animó nunca",
     "elencare": "enumerar",
     "effettuare": "efectuar",
     "ottemperanza": "(in ottemperanza a) en cumplimiento de",
     "sensi": "(ai sensi di) conforme a, según",
     "more": "(nelle more di) mientras se espera, en el ínterin",
     "intermediari": "gestores, intermediarios",
     "pratiche": "trámites, expedientes",
     "tributi": "(ufficio tributi) oficina de rentas",
     "multa": "multa",
     "avvalersi": "valerse, servirse",
     "consulenza": "asesoramiento",
     "disomogenei": "desparejos",
     "attenuti": "(si sono attenuti) se atuvieron",
     "finanziano": "financian",
     "terreno": "(perdere terreno) retroceder",
     "atrio": "hall, vestíbulo",
     "utenza": "público, usuarios",
     "decorrere": "(a decorrere da) a partir de"
    },
    "questions": [
     [
      "Qual è lo scopo principale del testo?",
      [
       "Ridicolizzare i funzionari pubblici italiani",
       "Analizzare il burocratese: cause, costi, rimedi",
       "Presentare la biografia e le opere di Italo Calvino",
       "Insegnare a compilare correttamente i moduli"
      ],
      "Analizzare il burocratese: cause, costi, rimedi"
     ],
     [
      "Perché, secondo Calvino, si usa l'antilingua?",
      [
       "Perché la legge obbliga a usare certe formule",
       "Per farsi capire meglio dai cittadini stranieri",
       "Perché i brigadieri non conoscono l'italiano",
       "Per paura delle parole concrete, che sembrano meno serie"
      ],
      "Per paura delle parole concrete, che sembrano meno serie"
     ],
     [
      "Che cosa intende l'autore quando dice che con il soggetto sparisce «la responsabilità»?",
      [
       "Che non si capisce più chi deve fare che cosa",
       "Che i funzionari non firmano mai le proprie lettere",
       "Che i cittadini non rispettano le regole",
       "Che le leggi non indicano le sanzioni"
      ],
      "Che non si capisce più chi deve fare che cosa"
     ],
     [
      "Chi soffre di più, secondo il testo, a causa del burocratese?",
      [
       "I funzionari che devono scrivere i testi",
       "I linguisti chiamati come consulenti",
       "Le persone più fragili, come anziani e stranieri",
       "Gli avvocati e gli intermediari"
      ],
      "Le persone più fragili, come anziani e stranieri"
     ],
     [
      "Perché, secondo l'autore, i tentativi di riforma hanno dato risultati disomogenei?",
      [
       "Perché scrivere semplice richiede chiarezza e coraggio",
       "Perché i manuali di stile erano scritti male",
       "Perché i cittadini preferiscono di gran lunga lo stile tradizionale",
       "Perché le consulenze dei linguisti costavano troppo"
      ],
      "Perché scrivere semplice richiede chiarezza e coraggio"
     ]
    ],
    "vf": [
     [
      "Calvino scrisse il suo articolo sull'antilingua nel 1965.",
      "vero"
     ],
     [
      "Secondo l'autore, il burocratese è un fenomeno nato negli ultimi anni.",
      "falso"
     ],
     [
      "Tutte le amministrazioni italiane ormai si attengono alle guide alla scrittura chiara.",
      "falso"
     ],
     [
      "L'autore lavora come consulente linguistico per un Comune.",
      "non si dice"
     ],
     [
      "Per l'autore, scrivere in modo chiaro è anche una forma di rispetto verso i cittadini.",
      "vero"
     ]
    ],
    "hunt": {
     "label": "Tocá los verbos que rigen una preposición fija (provvedere a, dipendere da, accorgersi di…)",
     "targets": [
      "provvedere",
      "procedere",
      "procede",
      "procederà",
      "provvede",
      "dipende",
      "rifugia",
      "rifarsi",
      "limitano",
      "accorge",
      "abusa",
      "ricorre",
      "rinuncia",
      "tratti",
      "tratta",
      "rivolgersi",
      "avvalersi",
      "attenuti",
      "fidarsi"
     ]
    }
   },
   "ascolto": {
    "title": "Riscrivere il sollecito",
    "genre": "conversazione tra colleghi",
    "es": "En una oficina municipal, una funcionaria con años de experiencia y un colega más joven discuten cómo redactar una carta que se manda a los vecinos.",
    "speakers": [
     "Valeria, funzionaria",
     "Tommaso, collega"
    ],
    "turns": [
     [
      "A",
      "Tommaso, hai finito con la lettera di sollecito per la tassa sui rifiuti? Il dirigente la vuole entro stasera."
     ],
     [
      "B",
      "Quasi. Però, senti, volevo parlarti di una cosa. Ho riletto il modello che usiamo da anni e, sinceramente, ho fatto fatica a capirlo io, che ci lavoro."
     ],
     [
      "A",
      "In che senso? È sempre andato bene."
     ],
     [
      "B",
      "Ti leggo l'inizio: si comunica che, a seguito delle verifiche effettuate, risulta a carico della signoria vostra un importo non corrisposto relativo all'annualità in oggetto, per il quale si invita a provvedere entro sessanta giorni dal ricevimento della presente. Ecco. Tu, se fossi mia nonna, capiresti che cosa devi fare?"
     ],
     [
      "A",
      "Tua nonna forse no, ma il contenuto è corretto. E poi queste formule servono a tutelarci: se un giorno qualcuno fa ricorso, dobbiamo poter dimostrare di aver scritto tutto."
     ],
     [
      "B",
      "Sì, su questo sono d'accordo con te: deve essere corretto. Ma corretto non vuol dire incomprensibile. Guarda come l'ho riscritta io: gentile signora, gentile signore, dai nostri controlli risulta che non ha ancora pagato la tassa sui rifiuti dell'anno scorso. Deve pagare centottantasei euro entro sessanta giorni da quando riceve questa lettera."
     ],
     [
      "A",
      "Mh. Troppo diretta, non ti pare? Sembra quasi una minaccia."
     ],
     [
      "B",
      "Ma no, dopo c'è il resto. Ho aggiunto un paragrafo che spiega come si paga e, soprattutto, uno che dice che cosa fare se si pensa che ci sia un errore. Nel vecchio modello quella parte non c'era proprio, o meglio, c'era un rinvio al regolamento comunale, articolo tal dei tali."
     ],
     [
      "A",
      "Beh, questo è vero, ci telefonano in tanti proprio per questo. L'altra settimana ho passato un'ora con un signore che era convinto di dover pagare una multa. Non riusciva a capire di che cosa si trattasse."
     ],
     [
      "B",
      "Appunto! Se la lettera fosse chiara, risparmieremmo tempo anche noi. Meno telefonate, meno gente allo sportello, meno ricorsi inutili."
     ],
     [
      "A",
      "Va bene, mi hai quasi convinta. Ma il riferimento alla norma lo dobbiamo lasciare, eh. Su questo non transigo."
     ],
     [
      "B",
      "Certo, certo. L'ho messo alla fine, in piccolo, in una nota. Chi vuole controllare lo trova, chi non ne ha bisogno non si spaventa."
     ],
     [
      "A",
      "E il Lei? Hai scritto non ha pagato, deve pagare. Non era meglio lasciare l'impersonale?"
     ],
     [
      "B",
      "Secondo me no. Rivolgersi direttamente alla persona la fa sentire presa in considerazione. E poi le linee guida sulla scrittura chiara che ci hanno mandato l'anno scorso dicono proprio questo. Le hai lette?"
     ],
     [
      "A",
      "Le ho sfogliate, diciamo. Va bene, facciamo così: mandami tutte e due le versioni. Le porto io al dirigente e cerco di convincerlo a provare la tua. Se va male, però, delle telefonate ti occupi tu."
     ],
     [
      "B",
      "Affare fatto. Tanto sono sicuro che il telefono squillerà molto meno."
     ]
    ],
    "gloss": {
     "tanto": "(tanto sono sicuro) total, igual estoy seguro",
     "tali": "(articolo tal dei tali) artículo tal y cual",
     "sollecito": "recordatorio de pago, intimación",
     "dirigente": "jefe, director",
     "corrisposto": "pagado, abonado",
     "annualità": "año fiscal, anualidad",
     "tutelarci": "protegernos",
     "ricorso": "recurso, reclamo formal",
     "rinvio": "remisión (a otro texto)",
     "sportello": "ventanilla",
     "transigo": "transijo, cedo",
     "sfogliate": "hojeadas",
     "affare": "(affare fatto) trato hecho",
     "squillerà": "sonará (el teléfono)"
    },
    "questions": [
     [
      "Di che cosa si tratta nella lettera su cui lavora Tommaso?",
      [
       "Di un avviso di multa per divieto di sosta",
       "Di un invito a un'assemblea di quartiere",
       "Della risposta al ricorso di un cittadino",
       "Di un sollecito per la tassa sui rifiuti"
      ],
      "Di un sollecito per la tassa sui rifiuti"
     ],
     [
      "Perché all'inizio Valeria difende il vecchio modello?",
      [
       "Perché è più breve e veloce da scrivere",
       "Perché piace molto ai cittadini",
       "Perché protegge l'ufficio in caso di ricorso",
       "Perché l'ha scritto il dirigente"
      ],
      "Perché protegge l'ufficio in caso di ricorso"
     ],
     [
      "Quale aspetto della nuova versione convince di più Valeria?",
      [
       "L'eliminazione di ogni riferimento alla legge",
       "La spiegazione di cosa fare in caso di errore",
       "L'uso dell'impersonale al posto del Lei",
       "La riduzione dell'importo da pagare"
      ],
      "La spiegazione di cosa fare in caso di errore"
     ],
     [
      "Dove ha messo Tommaso il riferimento alla norma?",
      [
       "All'inizio della lettera, in grassetto",
       "In un allegato separato",
       "Non l'ha messo da nessuna parte",
       "In una nota alla fine"
      ],
      "In una nota alla fine"
     ],
     [
      "Con quale atteggiamento Valeria accetta di presentare la nuova versione?",
      [
       "Con una certa prudenza e un po' di ironia",
       "Con entusiasmo, senza nessun dubbio",
       "Con rabbia, perché si sente criticata",
       "Con indifferenza, perché non le interessa"
      ],
      "Con una certa prudenza e un po' di ironia"
     ]
    ],
    "vf": [
     [
      "Secondo Tommaso, il vecchio modello è difficile anche per chi lavora in ufficio.",
      "vero"
     ],
     [
      "Valeria ha letto con attenzione le linee guida sulla scrittura chiara.",
      "falso"
     ],
     [
      "Tommaso lavora in quell'ufficio da meno di un anno.",
      "non si dice"
     ],
     [
      "Nella versione di Tommaso l'importo da pagare è indicato in modo chiaro.",
      "vero"
     ]
    ]
   },
   "compito": {
    "genre": "lettera_lettore",
    "title": "Scrivere chiaro si può",
    "fonte": "entrambi",
    "t": "Un quotidiano ha pubblicato il saggio «Si prega di voler cortesemente provvedere». Scrivi una lettera alla redazione in cui racconti una tua esperienza con un testo burocratico difficile (in Italia o nel tuo Paese), commenti almeno una tesi dell'articolo e proponi alcune regole per una scrittura amministrativa più chiara, prendendo spunto anche dalla conversazione tra Valeria e Tommaso. Registro formale, da 199 a 259 parole.",
    "es": "Carta de lector: experiencia personal, comentario de una tesis del ensayo y propuestas concretas (podés retomar lo que hizo Tommaso). Cuidá las preposiciones que rigen los verbos: rivolgersi a, rinunciare a, trattarsi di, dipendere da.",
    "min": 199,
    "max": 259,
    "punti": [
     [
      "contar una experiencia personal",
      [
       "ho ricevuto",
       "mi è capitato",
       "qualche mese fa",
       "esperienza"
      ]
     ],
     [
      "comentar una tesis del ensayo",
      [
       "articolo",
       "autore",
       "calvino",
       "antilingua",
       "burocratese"
      ]
     ],
     [
      "proponer reglas de escritura clara",
      [
       "propongo",
       "regole",
       "frasi brevi",
       "parole comuni"
      ]
     ],
     [
      "fórmulas de apertura y cierre",
      [
       "gentile redazione",
       "cara redazione",
       "egregio direttore",
       "cordiali saluti",
       "distinti saluti"
      ]
     ]
    ],
    "model": "Gentile Redazione,\n\nho letto con grande interesse il saggio «Si prega di voler cortesemente provvedere» e vorrei aggiungere la mia esperienza di straniera che vive in Italia da due anni.\n\nQualche mese fa ho ricevuto una lettera dell'ufficio tributi del mio Comune. L'ho letta tre volte e non riuscivo a capire se si trattasse di una multa, di un rimborso o di un semplice avviso. Alla fine mi sono rivolta a un'amica italiana, che però ha avuto le mie stesse difficoltà. Solo allo sportello ho scoperto che dovevo pagare trenta euro di tassa sui rifiuti: sarebbero bastate due righe.\n\nSono d'accordo con l'autore quando scrive che il burocratese colpisce soprattutto i più deboli. Chi sta imparando una lingua ha già abbastanza ostacoli e non ha bisogno di essere messo alla prova anche da un modulo. Non credo, tuttavia, che la colpa sia solo dei funzionari: spesso sono costretti a rifarsi a modelli che nessuno ha il coraggio di cambiare.\n\nPer questo propongo alcune regole semplici: dire subito che cosa deve fare il cittadino ed entro quando; usare frasi brevi e parole comuni; rivolgersi al lettore con il Lei; spiegare che cosa fare in caso di errore; lasciare i riferimenti alle norme in una nota finale, per chi vuole controllarli. Scrivere chiaro non significa rinunciare alla precisione, ma rispettare chi legge.\n\nCordiali saluti,\nAna Ferreyra, Bologna",
    "gloss": {
     "ufficio tributi": "oficina de impuestos (municipales)",
     "sportello": "ventanilla",
     "rifiuti": "residuos (tassa sui rifiuti = tasa de recolección de basura)",
     "burocratese": "la jerga burocrática",
     "messo alla prova": "puesto a prueba",
     "rifarsi a": "basarse en, remitirse a",
     "entro quando": "hasta cuándo, en qué plazo"
    }
   },
   "breve": {
    "title": "Ufficio tributi, resti in linea",
    "genre": "messaggio automatico di un centralino",
    "es": "El mensaje grabado de la oficina de impuestos municipales: opciones, vencimientos y horarios.",
    "speaker": "Voce registrata",
    "voice": 1,
    "text": [
     "Benvenuto nel servizio clienti dell'Ufficio tributi del Comune. La informiamo che la telefonata potrebbe essere registrata. Per richiedere informazioni sulla tassa sui rifiuti, prema uno. Per segnalare un errore in un avviso di pagamento, prema due. Per fissare un appuntamento allo sportello, prema tre. Per tutte le altre richieste, resti in linea.",
     "Si ricorda che il termine per il pagamento della prima rata è fissato al 16 giugno. Chi non riceve l'avviso entro il 31 maggio è invitato a rivolgersi allo sportello, oppure a scaricarlo dal sito del Comune, nella sezione «Tributi».",
     "Gli uffici sono aperti al pubblico dal lunedì al venerdì dalle nove alle dodici e trenta, e il martedì anche dalle quindici alle diciassette.",
     "In questo momento tutti gli operatori sono occupati. La preghiamo di attendere: il tempo di attesa stimato è di circa otto minuti."
    ],
    "tabella": [
     [
      "Tasto per segnalare un errore",
      "2",
      [
       "due"
      ]
     ],
     [
      "Scadenza della prima rata",
      "16 giugno",
      [
       "il 16 giugno",
       "sedici giugno"
      ]
     ],
     [
      "Giorno con apertura anche di pomeriggio",
      "martedì",
      [
       "il martedì"
      ]
     ],
     [
      "Attesa stimata (minuti)",
      "8",
      [
       "otto",
       "circa otto",
       "otto minuti"
      ]
     ]
    ],
    "info": [
     [
      "La telefonata potrebbe essere registrata.",
      true
     ],
     [
      "Con il tasto tre si prende un appuntamento allo sportello.",
      true
     ],
     [
      "L'avviso di pagamento si può scaricare dal sito.",
      true
     ],
     [
      "Gli uffici sono aperti anche il sabato mattina.",
      false
     ],
     [
      "Il termine per la prima rata è il 31 maggio.",
      false
     ],
     [
      "In questo momento c'è un operatore libero.",
      false
     ]
    ],
    "gloss": {
     "tributi": "impuestos, tasas",
     "rata": "cuota",
     "sportello": "ventanilla",
     "resti in linea": "no corte"
    }
   }
  },
  {
   "week": 43,
   "level": "B2+",
   "lettura": {
    "title": "Il cioccolato fa dimagrire? Istruzioni per leggere una notizia scientifica",
    "emoji": "🔬",
    "genre": "articolo divulgativo",
    "grammar": "l'infinito (soggetto, istruzioni, subordinate)",
    "text": "«Mangiare cioccolato ogni giorno aiuta a perdere peso.» Un titolo così, quando compare sul telefono, è difficile da ignorare. Condividerlo richiede un secondo; verificarlo, molto di più. Eppure saper distinguere una scoperta seria da una notizia gonfiata è diventata, in pochi anni, una competenza quasi indispensabile, come saper leggere un'etichetta al supermercato o un contratto d'affitto. La lettura frettolosa, mentre si aspetta l'autobus o si scorre una bacheca, rende tutto ancora più difficile: si tende a fidarsi di ciò che conferma quello che si pensava già, e a scartare il resto.\n\nIl problema non riguarda soltanto le bufale costruite ad arte. Molto più spesso si parte da uno studio vero, magari pubblicato su una rivista rispettabile, e lo si semplifica passaggio dopo passaggio: il comunicato stampa dell'università esagera un po', il primo sito che lo riprende esagera ancora, e alla fine il titolo dice una cosa che i ricercatori non si sono mai sognati di affermare. Chiedere agli autori che cosa pensino dei titoli sui loro lavori è un esercizio istruttivo: molti allargano le braccia, rassegnati.\n\nPer non cadere nella trappola non serve essere scienziati. Basta prendere l'abitudine di porsi qualche domanda prima di credere a ciò che si legge. Ecco una piccola guida, da tenere a portata di mano.\n\nPrimo: non fermarsi al titolo. Leggere l'articolo fino in fondo, cercando il nome della rivista e degli autori. Se non vengono citati, è già un segnale d'allarme.\n\nSecondo: controllare su chi è stato fatto lo studio. Molte ricerche iniziali si fanno su topi o su cellule in laboratorio. Scoprire che una sostanza ha un effetto su un topo è un risultato interessante, ma pensare che valga automaticamente per le persone è un salto enorme.\n\nTerzo: guardare i numeri. Uno studio condotto su venti volontari per due settimane non ha lo stesso peso di uno condotto su migliaia di persone per dieci anni. Non occorre saper calcolare le statistiche: basta domandarsi se il campione è abbastanza grande e se il periodo è abbastanza lungo per giustificare le conclusioni.\n\nQuarto: non confondere la correlazione con la causa. Osservare che chi mangia più cioccolato pesa meno non significa aver dimostrato che il cioccolato fa dimagrire. Potrebbe valere il contrario, oppure potrebbe esserci un terzo fattore: per esempio, chi fa più sport può concedersi qualche dolce in più senza ingrassare.\n\nQuinto: chiedersi chi ha pagato. Essere finanziati da un'azienda non rende automaticamente falsa una ricerca, ma è un'informazione che il lettore ha il diritto di conoscere. Una ricerca sui benefici del cioccolato finanziata da un produttore di dolciumi merita un supplemento di prudenza.\n\nSesto: aspettare. La scienza procede per conferme. Un singolo studio, per quanto brillante, è un indizio, non una prova. Prima di cambiare dieta, abitudini o convinzioni, conviene vedere se altri gruppi di ricerca, lavorando in modo indipendente, arrivano agli stessi risultati.\n\nSettimo: diffidare delle parole magiche. Termini come «svolta», «miracoloso», «definitivo» o «gli scienziati confermano» dovrebbero far suonare un campanello. Nella ricerca vera le conclusioni sono quasi sempre prudenti, piene di «potrebbe», «sembra», «nel campione analizzato». Trovare nel titolo una certezza che nello studio non c'è significa aver già individuato il punto in cui la notizia è stata gonfiata.\n\nSeguire queste regole non vuol dire diventare diffidenti verso la scienza. Anzi: significa prenderla sul serio, rispettandone i tempi e i limiti. Chi ha imparato a dubitare di un titolo sensazionale è anche chi, davanti a un consenso scientifico solido, per esempio sull'efficacia dei vaccini o sul cambiamento climatico, sa riconoscerne il valore invece di considerarlo un'opinione fra tante.\n\nResta una responsabilità che non si può scaricare interamente sui lettori. Scrivere di scienza con correttezza significa, per i giornalisti, rinunciare a volte al titolo più cliccato; per i ricercatori, accettare di spiegare il proprio lavoro con parole semplici senza gonfiarlo; per le università, evitare comunicati stampa che promettono miracoli. Informare bene costa fatica a tutti. Informare male, però, costa molto di più, perché a pagare il prezzo della confusione sono proprio le persone che cercavano una risposta.\n\nE il cioccolato? Mangiarne un quadratino dopo pranzo resta uno dei piccoli piaceri della vita. Aspettarsi che ci faccia dimagrire, per ora, no.",
    "gloss": {
     "pagare": "(a pagare il prezzo... sono...) los que pagan el precio son...: *essere* + *a* + infinitivo (semana 48)",
     "dimagrire": "adelgazar",
     "gonfiata": "inflada, exagerada",
     "etichetta": "etiqueta",
     "bufale": "noticias falsas",
     "arte": "(ad arte) a propósito, deliberadamente",
     "rivista": "revista",
     "comunicato": "comunicado",
     "sognati": "(non si sono mai sognati) ni se les ocurrió",
     "allargano": "abren (allargare le braccia: encogerse de hombros)",
     "rassegnati": "resignados",
     "trappola": "trampa",
     "portata": "(a portata di mano) a mano",
     "topi": "ratones",
     "salto": "salto",
     "campione": "muestra",
     "correlazione": "correlación",
     "ingrassare": "engordar",
     "finanziati": "financiados",
     "dolciumi": "golosinas",
     "supplemento": "extra, dosis adicional",
     "indizio": "indicio",
     "diffidenti": "desconfiados",
     "consenso": "consenso",
     "scaricare": "descargar, echar (la responsabilidad)",
     "cliccato": "con más clics",
     "quadratino": "cuadradito",
     "bacheca": "muro, feed (de una red social)",
     "svolta": "giro, avance decisivo",
     "campanello": "timbre (far suonare un campanello: encender una alarma)"
    },
    "questions": [
     [
      "Qual è lo scopo principale dell'articolo?",
      [
       "Dimostrare che il cioccolato fa bene alla salute",
       "Insegnare a valutare le notizie scientifiche",
       "Denunciare le università che pubblicano studi falsi",
       "Spiegare come si scrive un articolo scientifico"
      ],
      "Insegnare a valutare le notizie scientifiche"
     ],
     [
      "Secondo l'autore, come nasce spesso una notizia scientifica esagerata?",
      [
       "Da ricercatori che inventano i dati",
       "Da siti che copiano notizie straniere",
       "Da una serie di semplificazioni di uno studio vero",
       "Da lettori che non leggono gli articoli"
      ],
      "Da una serie di semplificazioni di uno studio vero"
     ],
     [
      "Perché uno studio sui topi non basta, secondo il testo?",
      [
       "Perché i topi mangiano troppo cioccolato",
       "Perché gli studi sugli animali sono ormai vietati",
       "Perché l'effetto può non valere per gli umani",
       "Perché i topi vivono troppo poco"
      ],
      "Perché l'effetto può non valere per gli umani"
     ],
     [
      "Nell'esempio del cioccolato, quale potrebbe essere il «terzo fattore»?",
      [
       "Lo sport praticato da chi mangia dolci",
       "La qualità del cioccolato consumato ogni giorno",
       "L'età dei volontari dello studio",
       "Il finanziamento di un'azienda"
      ],
      "Lo sport praticato da chi mangia dolci"
     ],
     [
      "Qual è la posizione dell'autore nei confronti della scienza?",
      [
       "È scettico e invita a non fidarsi degli scienziati",
       "Pensa che debba occuparsene solo chi l'ha studiata",
       "Crede che ogni studio vada preso come una verità",
       "Ne ha fiducia, ma chiede di rispettarne tempi e limiti"
      ],
      "Ne ha fiducia, ma chiede di rispettarne tempi e limiti"
     ]
    ],
    "vf": [
     [
      "Secondo l'autore, uno studio finanziato da un'azienda è sempre falso.",
      "falso"
     ],
     [
      "Per l'autore, un singolo studio è un indizio e non una prova.",
      "vero"
     ],
     [
      "L'autore ha partecipato come volontario a uno studio sul cioccolato.",
      "non si dice"
     ],
     [
      "Secondo l'articolo, per giudicare uno studio bisogna essere esperti di statistica.",
      "falso"
     ],
     [
      "L'autore attribuisce una parte di responsabilità anche ai giornalisti e alle università.",
      "vero"
     ]
    ],
    "hunt": {
     "label": "Tocá los infinitivos que funcionan como sujeto de la oración (también después de basta, serve, occorre, conviene)",
     "targets": [
      "mangiare",
      "condividerlo",
      "verificarlo",
      "saper",
      "chiedere",
      "essere",
      "prendere",
      "scoprire",
      "pensare",
      "domandarsi",
      "osservare",
      "vedere",
      "trovare",
      "seguire",
      "scrivere",
      "informare",
      "mangiarne",
      "aspettarsi"
     ]
    }
   },
   "ascolto": {
    "title": "Un sensore sul balcone",
    "genre": "conferenza con domande del pubblico",
    "es": "Al final de una charla pública, una investigadora responde las preguntas de un vecino sobre un proyecto en el que los ciudadanos miden la calidad del aire.",
    "speakers": [
     "Irene Monti, ricercatrice",
     "Stefano, dal pubblico"
    ],
    "turns": [
     [
      "A",
      "E con questo arrivo all'ultima parte della presentazione. Riassumendo: misurare l'aria che respiriamo non è più un compito riservato alle stazioni ufficiali. Con un sensore da pochi euro, installato su un balcone, anche un cittadino può raccogliere dati utili. Ecco, ora lascio spazio alle domande. Sì, prego, il signore in terza fila."
     ],
     [
      "B",
      "Buonasera, grazie. Io sono uno di quelli che hanno letto il volantino e si sono chiesti: ma serve davvero? Voglio dire, un sensore che costa come una pizza può essere preciso quanto una centralina da migliaia di euro?"
     ],
     [
      "A",
      "Domanda giustissima, e la risposta è no. Cioè, un singolo sensore economico è meno preciso, questo va detto chiaramente. Però il punto non è sostituire le centraline ufficiali, è completarle. In città le centraline sono poche, e misurano l'aria in pochi punti. Avere trecento sensori sparsi nei quartieri ci permette di vedere differenze che altrimenti resterebbero invisibili: la via stretta con il traffico, il cortile della scuola, il parco."
     ],
     [
      "B",
      "E come fate a fidarvi dei dati, se i sensori sono imprecisi?"
     ],
     [
      "A",
      "Allora, prima di distribuirli, li mettiamo tutti per qualche settimana accanto a una centralina ufficiale, per calibrarli. In pratica confrontiamo le loro misure con quelle della centralina e correggiamo gli errori sistematici. Poi, una volta installati, usiamo degli algoritmi per scartare i valori anomali. Sbagliare un singolo dato è normale; sbagliare trecento dati nello stesso modo è molto più difficile."
     ],
     [
      "B",
      "Capito. E per partecipare che cosa bisogna fare, concretamente? Io non sono molto tecnologico, lo confesso."
     ],
     [
      "A",
      "Nessun problema, il progetto è pensato proprio per chi non lo è. Partecipare è semplice: basta iscriversi sul sito, ritirare il sensore in biblioteca e seguire le istruzioni del foglietto. Le regole principali sono tre. Primo, installarlo all'aperto, ad almeno un metro e mezzo da terra. Secondo, non metterlo vicino alla caldaia, al barbecue o alla finestra della cucina, altrimenti misura la sua cena invece dell'aria del quartiere. Terzo, lasciarlo sempre acceso e collegato al wifi."
     ],
     [
      "B",
      "E i dati poi chi li vede? Non vorrei ritrovarmi con informazioni su casa mia in giro per internet."
     ],
     [
      "A",
      "I dati sono pubblici, ma la posizione viene resa approssimativa: sulla mappa appare il quartiere, non il suo indirizzo. E naturalmente può ritirarsi dal progetto quando vuole, senza dover dare spiegazioni."
     ],
     [
      "B",
      "Un'ultima cosa. Supponiamo che il mio sensore trovi valori alti. Che cosa succede? Serve a qualcosa saperlo?"
     ],
     [
      "A",
      "Serve, eccome. Intanto, conoscere il problema è il primo passo per affrontarlo. In progetti simili, i dati raccolti dai cittadini sono stati usati per chiedere più alberi, zone a traffico limitato davanti alle scuole, nuove piste ciclabili. Non sempre ci si riesce, ovviamente. Però presentarsi a un'assemblea con dei numeri, invece che solo con delle impressioni, cambia parecchio la discussione."
     ],
     [
      "B",
      "Mi ha convinto. Dove si ritirano, in biblioteca?"
     ],
     [
      "A",
      "Esatto, alla biblioteca centrale, dal lunedì al venerdì. E grazie a lei per le domande: erano proprio quelle che speravo di ricevere."
     ]
    ],
    "gloss": {
     "fate": "(come fate a fidarvi?) ¿cómo hacen para confiar?: *fare a* + infinitivo",
     "volantino": "volante, folleto",
     "centralina": "estación de monitoreo",
     "sparsi": "distribuidos, esparcidos",
     "cortile": "patio",
     "calibrarli": "calibrarlos",
     "scartare": "descartar",
     "anomali": "anómalos",
     "foglietto": "papelito, instructivo",
     "caldaia": "caldera",
     "approssimativa": "aproximada",
     "ritirarsi": "retirarse, darse de baja",
     "eccome": "¡y cómo!, claro que sí",
     "ciclabili": "(piste ciclabili) bicisendas"
    },
    "questions": [
     [
      "Che cosa preoccupa all'inizio il partecipante?",
      [
       "Il costo elevato dei sensori",
       "La precisione di sensori così economici",
       "La difficoltà di trovare la biblioteca giusta",
       "Il rumore prodotto dal dispositivo"
      ],
      "La precisione di sensori così economici"
     ],
     [
      "Secondo la ricercatrice, qual è il vero vantaggio dei sensori dei cittadini?",
      [
       "Sostituire del tutto le centraline ufficiali",
       "Mostrare differenze tra zone vicine della città",
       "Ridurre i costi della ricerca universitaria",
       "Controllare le emissioni di ogni singola abitazione"
      ],
      "Mostrare differenze tra zone vicine della città"
     ],
     [
      "A che cosa serve lasciare i sensori accanto a una centralina ufficiale?",
      [
       "A proteggerli dalla pioggia e dal vento",
       "A verificare che il wifi funzioni bene",
       "A mostrare ai cittadini come si usano",
       "A calibrarli correggendo gli errori sistematici"
      ],
      "A calibrarli correggendo gli errori sistematici"
     ],
     [
      "Perché la ricercatrice dice che il sensore potrebbe misurare «la sua cena»?",
      [
       "Per spiegare, con una battuta, dove non installarlo",
       "Per dire che il sensore rileva anche gli odori di casa",
       "Perché il sensore va messo in cucina",
       "Perché i dati includono le abitudini alimentari"
      ],
      "Per spiegare, con una battuta, dove non installarlo"
     ],
     [
      "Come viene protetta la privacy dei partecipanti?",
      [
       "I dati non vengono mai pubblicati",
       "Ogni sensore ha una password personale",
       "Sulla mappa compare solo il quartiere",
       "I dati vengono cancellati ogni mese"
      ],
      "Sulla mappa compare solo il quartiere"
     ]
    ],
    "vf": [
     [
      "I sensori si ritirano alla biblioteca centrale.",
      "vero"
     ],
     [
      "Il partecipante si definisce un esperto di tecnologia.",
      "falso"
     ],
     [
      "Il progetto è finanziato dal Comune.",
      "non si dice"
     ],
     [
      "Chi partecipa può lasciare il progetto quando vuole.",
      "vero"
     ]
    ]
   },
   "compito": {
    "genre": "saggio",
    "title": "Cittadini e scienza",
    "fonte": "entrambi",
    "t": "Hai letto l'articolo «Il cioccolato fa dimagrire? Istruzioni per leggere una notizia scientifica» e hai ascoltato la conferenza sui sensori per misurare la qualità dell'aria. Scrivi un breve saggio per la rivista della tua università sul tema: «I cittadini comuni possono partecipare alla scienza?». Presenta una tesi, sostienila con argomenti tratti dal testo e dall'audio, considera almeno un limite o un'obiezione e scrivi una conclusione. Dai un titolo al saggio. Registro formale, da 205 a 265 parole.",
    "es": "Ensayo argumentativo con título, tesis, argumentos de las dos fuentes, una objeción y conclusión. Aprovechá el infinitivo como sujeto (Imparare a…, Raccogliere dati…) y en subordinadas (prima di, senza, per).",
    "min": 205,
    "max": 265,
    "punti": [
     [
      "plantear una tesis clara",
      [
       "a mio avviso",
       "ritengo",
       "credo",
       "sostengo",
       "secondo me"
      ]
     ],
     [
      "argumentar con la lectura",
      [
       "titolo",
       "studio",
       "articolo",
       "notizi"
      ]
     ],
     [
      "argumentar con la conferencia",
      [
       "sensor",
       "aria",
       "centralin"
      ]
     ],
     [
      "reconocer un límite u objeción",
      [
       "tuttavia",
       "limiti",
       "rischi",
       "obiezione"
      ]
     ],
     [
      "cerrar con una conclusión",
      [
       "in conclusione",
       "per concludere",
       "insomma",
       "concludendo"
      ]
     ]
    ],
    "model": "Cittadini e scienza: spettatori o protagonisti?\n\nPer molto tempo la scienza è stata considerata un territorio riservato agli esperti, mentre al pubblico spettava soltanto il compito di ricevere, più o meno passivamente, i risultati. Oggi questa divisione non regge più. A mio avviso, partecipare alla scienza è diventato per i cittadini non solo possibile, ma necessario, e in due modi diversi.\n\nIl primo è la lettura critica. Come ricorda un recente articolo divulgativo, un titolo sensazionale su uno studio condotto su pochi volontari o su qualche topo può fare il giro del web in poche ore. Imparare a controllare la fonte, a guardare i numeri e a non confondere la correlazione con la causa è già una forma di partecipazione: significa difendere la scienza dalle sue caricature.\n\nIl secondo modo è più concreto. In una conferenza sulla qualità dell'aria, una ricercatrice ha spiegato come centinaia di sensori economici, installati sui balconi, possano mostrare differenze tra quartieri che le centraline ufficiali non vedono. Raccogliere dati, in questo caso, vuol dire anche avere argomenti per chiedere cambiamenti alla propria amministrazione.\n\nBisogna tuttavia riconoscere i limiti di questa partecipazione. Un sensore economico è meno preciso, e un lettore attento non diventa per questo uno scienziato: senza la calibrazione e il controllo degli esperti, i dati dei cittadini rischierebbero di creare più confusione che conoscenza.\n\nIn conclusione, credo che la scienza abbia bisogno di cittadini attivi, purché la loro partecipazione resti una collaborazione e non una sostituzione.",
    "gloss": {
     "spettava": "le correspondía, le tocaba",
     "non regge più": "ya no se sostiene",
     "A mio avviso": "en mi opinión",
     "fare il giro del web": "dar la vuelta a internet, hacerse viral",
     "topo": "ratón",
     "centraline": "estaciones de medición",
     "purché": "siempre que, con tal de que (+ congiuntivo)"
    }
   },
   "breve": {
    "title": "Istruzioni: il sensore sul balcone",
    "genre": "istruzioni",
    "es": "Las instrucciones grabadas para instalar el sensor de un proyecto de ciencia ciudadana que mide el aire.",
    "speaker": "Voce delle istruzioni",
    "voice": 0,
    "text": [
     "Istruzioni per installare il sensore dell'aria del progetto «Respira». Prima di tutto, scegliere un balcone o una finestra ad almeno un metro e mezzo da terra, lontano da camini, condizionatori e griglie della cucina.",
     "Fissare il sensore con le due fascette incluse nella confezione, con i fori rivolti verso il basso, per evitare che entri la pioggia. Non coprirlo e non metterlo al sole diretto: il calore falsa le misure.",
     "Collegare il cavo a una presa elettrica interna e aspettare che la luce verde lampeggi. A questo punto, aprire l'applicazione, inserire il codice di sei cifre scritto sotto il sensore e indicare l'indirizzo.",
     "I dati vengono inviati ogni dieci minuti. Se la luce diventa rossa, staccare il cavo, aspettare trenta secondi e ricollegarlo. Per qualsiasi problema, scrivere all'indirizzo di assistenza del progetto."
    ],
    "tabella": [
     [
      "Altezza minima da terra",
      "un metro e mezzo",
      [
       "1,5 metri",
       "1,5",
       "1.5",
       "1,5 m",
       "un metro e mezzo da terra"
      ]
     ],
     [
      "Fascette nella confezione (numero)",
      "2",
      [
       "due"
      ]
     ],
     [
      "Cifre del codice",
      "6",
      [
       "sei"
      ]
     ],
     [
      "Ogni quanti minuti partono i dati",
      "10",
      [
       "dieci",
       "ogni 10 minuti",
       "ogni dieci minuti"
      ]
     ],
     [
      "Secondi di attesa se la luce è rossa",
      "30",
      [
       "trenta"
      ]
     ]
    ],
    "info": [
     [
      "Il sensore va messo vicino alla griglia della cucina.",
      false
     ],
     [
      "I fori del sensore devono essere rivolti verso il basso.",
      true
     ],
     [
      "È meglio mettere il sensore al sole diretto.",
      false
     ],
     [
      "Il codice è scritto sotto il sensore.",
      true
     ],
     [
      "Prima di aprire l'applicazione bisogna aspettare la luce verde.",
      true
     ],
     [
      "Se la luce è rossa bisogna chiamare un tecnico.",
      false
     ]
    ],
    "gloss": {
     "fascette": "precintos",
     "fori": "agujeros",
     "presa": "enchufe",
     "lampeggi": "titile",
     "staccare": "desenchufar"
    }
   }
  },
  {
   "week": 44,
   "level": "B2+",
   "lettura": {
    "title": "Sotto la montagna, in ascolto dell'universo",
    "emoji": "🔭",
    "genre": "reportage",
    "grammar": "gerundio e participio (anche assoluto)",
    "text": "Arrivando da L'Aquila in macchina, nessuno immaginerebbe che sotto la montagna che si ha davanti lavorino ogni giorno ricercatori venuti da mezzo mondo. Il Gran Sasso, con le sue cime ancora imbiancate a maggio, sembra fatto apposta per gli escursionisti. Eppure, imboccando il traforo autostradale e percorrendone qualche chilometro, si arriva a una deviazione che nessun automobilista prende per caso: è l'ingresso dei laboratori sotterranei dell'Istituto Nazionale di Fisica Nucleare, uno dei luoghi più silenziosi d'Europa.\n\nSuperati i controlli e indossato il casco, seguiamo Chiara Montanari, fisica trentaseienne di Ancona, lungo una galleria illuminata da lampade al neon. «Qui sopra ci sono circa millequattrocento metri di roccia», spiega camminando a passo svelto. «La roccia fa da scudo: blocca quasi tutti i raggi cosmici che colpiscono continuamente la superficie terrestre. Lavorando in superficie, i nostri rivelatori sarebbero accecati da un rumore di fondo enorme. Quaggiù, invece, possiamo sperare di sentire i segnali più deboli.»\n\nChiara studia i neutrini, particelle quasi prive di massa che attraversano la materia senza quasi mai interagire. «Mentre parliamo, miliardi di neutrini provenienti dal Sole ci stanno passando attraverso», dice sorridendo davanti alla mia espressione perplessa. «Non ce ne accorgiamo perché non lasciano quasi traccia. Il nostro lavoro consiste nel costruire strumenti così sensibili da registrarne uno ogni tanto.» Altri gruppi, lavorando nelle sale accanto, danno la caccia alla materia oscura, quella componente dell'universo di cui si deduce l'esistenza osservando il moto delle galassie, ma che nessuno è ancora riuscito a vedere direttamente.\n\nEntrati nella sala principale, si resta senza parole. Sembra la navata di una cattedrale scavata nella roccia: cilindri d'acciaio alti come palazzi, tubi, cavi, scale metalliche. Tutto è costruito con materiali selezionati uno per uno, essendo perfino la debolissima radioattività naturale di un bullone sufficiente a disturbare le misure. «Una volta abbiamo scartato un intero lotto di rame», racconta Chiara ridendo. «Era perfetto per qualunque altro uso, ma per noi era troppo rumoroso.»\n\nLa vita quaggiù ha i suoi ritmi. Non vedendo mai la luce del sole durante il turno, molti ricercatori raccontano di perdere la cognizione del tempo. «Entri alle otto, esci che è buio e ti chiedi se abbia piovuto», scherza Davide, un dottorando pugliese che incontriamo davanti alla macchinetta del caffè. Eppure nessuno di loro sembra pentito. Parlando con loro, notiamo soprattutto la pazienza: esperimenti progettati quindici anni fa stanno dando solo ora i primi risultati, e alcuni dei rivelatori oggi in costruzione produrranno dati quando i loro ideatori saranno già in pensione.\n\nIl laboratorio, del resto, è un piccolo mondo internazionale. Nella mensa e nei corridoi si sentono l'inglese, il tedesco, il cinese, lo spagnolo, spesso mescolati nella stessa frase. Essendo gli esperimenti troppo costosi per un solo paese, ogni progetto riunisce decine di università, che si dividono compiti e spese. «Qui impari presto a lavorare con persone che la pensano in modo diverso da te», osserva Chiara. «Discutendo per ore su un dettaglio tecnico, si finisce per diventare amici. O, qualche volta, nemici giurati per una settimana.»\n\nÈ inevitabile, a questo punto, porsi la domanda che molti contribuenti si fanno: a che cosa serve tutto questo? Chiara non si sottrae. «Capisco chi, vedendo le cifre, pensa che i soldi andrebbero spesi altrove. Ma la storia della scienza è piena di scoperte nate senza uno scopo pratico. Chi studiava l'elettrone alla fine dell'Ottocento non pensava certo ai telefoni.» Poi aggiunge un argomento meno scontato: le tecnologie sviluppate per costruire i rivelatori, dai sensori ultrasensibili ai sistemi di purificazione dei materiali, finiscono spesso per trovare applicazioni in medicina e nell'industria.\n\nNon sono mancate, negli anni, le polemiche. Trovandosi i laboratori sotto un massiccio che alimenta gli acquedotti della zona, gli abitanti hanno chiesto più volte garanzie sulla sicurezza delle falde, soprattutto dopo un incidente avvenuto all'inizio degli anni Duemila che aveva fatto molto discutere. I responsabili assicurano che i controlli sono stati rafforzati e che il dialogo con i comuni è costante. Resta, comunque, una convivenza delicata tra la ricerca di punta e un territorio che chiede di essere ascoltato.\n\nFinita la visita, riprendiamo la galleria verso l'uscita. Riemergendo alla luce, troviamo un paesaggio quasi irreale: pecore, prati, qualche escursionista con lo zaino. Nessuno di loro, probabilmente, sa che a pochi chilometri, sepolti sotto la roccia, strumenti costati anni di lavoro stanno aspettando pazientemente un segnale dall'universo. Chiara, salutandoci, lo dice con una semplicità disarmante: «Il nostro mestiere è aspettare. Ma aspettare nel posto giusto.»",
    "gloss": {
     "sensibili": "(così sensibili da registrarne uno) tan sensibles como para registrar uno",
     "caccia": "(danno la caccia a) persiguen, andan a la caza de",
     "pensano": "(la pensano in modo diverso) piensan distinto: *pensarla* (semana 45)",
     "buio": "(esci che è buio) salís cuando ya es de noche: *che* = cuando",
     "imbiancate": "nevadas, cubiertas de blanco",
     "imboccando": "tomando, entrando en",
     "traforo": "túnel (bajo una montaña)",
     "deviazione": "desvío",
     "indossato": "puesto (ropa, casco)",
     "galleria": "túnel, galería",
     "scudo": "escudo",
     "rivelatori": "detectores",
     "accecati": "encandilados, cegados",
     "quaggiù": "acá abajo",
     "particelle": "partículas",
     "navata": "nave (de una iglesia)",
     "scavata": "excavada",
     "bullone": "bulón",
     "scartato": "descartado",
     "lotto": "lote",
     "rame": "cobre",
     "dottorando": "estudiante de doctorado",
     "pentito": "arrepentido",
     "contribuenti": "contribuyentes",
     "sottrae": "non si sottrae: no esquiva (la pregunta)",
     "scontato": "obvio, previsible",
     "massiccio": "macizo (montañoso)",
     "acquedotti": "acueductos, red de agua",
     "falde": "napas (de agua)",
     "riemergendo": "volviendo a salir a la superficie",
     "sepolti": "enterrados",
     "disarmante": "desarmante",
     "giurati": "jurados (enemigos jurados)"
    },
    "questions": [
     [
      "Qual è lo scopo principale del reportage?",
      [
       "Denunciare i rischi ambientali dei laboratori sotterranei",
       "Raccontare dall'interno il lavoro e il senso del laboratorio",
       "Spiegare nel dettaglio come si costruiscono i rivelatori di neutrini",
       "Convincere i giovani abruzzesi a studiare fisica"
      ],
      "Raccontare dall'interno il lavoro e il senso del laboratorio"
     ],
     [
      "Perché i laboratori si trovano sotto la montagna?",
      [
       "Per proteggere gli strumenti dai terremoti",
       "Perché lo spazio in superficie era troppo costoso",
       "Perché la roccia ferma quasi tutti i raggi cosmici",
       "Per non disturbare il traffico dell'autostrada"
      ],
      "Perché la roccia ferma quasi tutti i raggi cosmici"
     ],
     [
      "L'episodio del rame scartato serve a mostrare…",
      [
       "che il laboratorio spreca molte risorse pubbliche",
       "quanto siano esigenti i requisiti dei materiali",
       "che i fornitori sbagliano spesso le consegne",
       "che il rame è un metallo pericoloso per la salute"
      ],
      "quanto siano esigenti i requisiti dei materiali"
     ],
     [
      "Che cosa intende Davide con «esci che è buio e ti chiedi se abbia piovuto»?",
      [
       "Che il clima del Gran Sasso è molto piovoso",
       "Che i turni di lavoro finiscono sempre a notte fonda",
       "Che nella galleria entra spesso l'acqua",
       "Che sottoterra si perde il contatto con il mondo esterno"
      ],
      "Che sottoterra si perde il contatto con il mondo esterno"
     ],
     [
      "Come risponde Chiara a chi critica i costi della ricerca?",
      [
       "Ricorda che molte scoperte utili sono nate senza scopi pratici",
       "Ammette che quei fondi andrebbero spesi meglio in altri settori",
       "Spiega che i costi sono coperti da aziende private",
       "Dice che la questione non riguarda i ricercatori"
      ],
      "Ricorda che molte scoperte utili sono nate senza scopi pratici"
     ]
    ],
    "vf": [
     [
      "Per raggiungere i laboratori si passa dal traforo autostradale.",
      "vero"
     ],
     [
      "Chiara lavora alla ricerca della materia oscura.",
      "falso"
     ],
     [
      "Davide vorrebbe lasciare il laboratorio dopo il dottorato.",
      "non si dice"
     ],
     [
      "Gli abitanti della zona hanno espresso preoccupazioni per l'acqua.",
      "vero"
     ],
     [
      "Chiara ha progettato uno degli esperimenti di quindici anni fa.",
      "non si dice"
     ]
    ],
    "hunt": {
     "label": "Tocá los gerundios y los participios absolutos (Superati i controlli…)",
     "targets": [
      "arrivando",
      "imboccando",
      "percorrendone",
      "superati",
      "indossato",
      "camminando",
      "lavorando",
      "passando",
      "sorridendo",
      "osservando",
      "entrati",
      "essendo",
      "ridendo",
      "vedendo",
      "parlando",
      "dando",
      "discutendo",
      "trovandosi",
      "finita",
      "riemergendo",
      "aspettando",
      "salutandoci"
     ]
    }
   },
   "ascolto": {
    "title": "Le praterie nascoste del Mediterraneo",
    "genre": "podcast di divulgazione",
    "es": "En un podcast de divulgación científica, una conductora entrevista a un biólogo marino sobre la posidonia, una planta del Mediterráneo.",
    "speakers": [
     "Conduttrice",
     "Biologo marino"
    ],
    "turns": [
     [
      "A",
      "Bentornati a «Onde lunghe». Oggi parliamo di una pianta che quasi tutti abbiamo visto, magari senza saperlo. Con me c'è Marco Ferri, biologo marino. Marco, partiamo dalle basi: che cos'è la posidonia?"
     ],
     [
      "B",
      "Allora, la prima cosa da dire è che non è un'alga, anche se tutti la chiamano così. È una pianta vera e propria, con radici, foglie e perfino fiori, e vive solo nel Mediterraneo. Forma delle praterie sottomarine, diciamo dei grandi prati, tra pochi metri e una quarantina di metri di profondità."
     ],
     [
      "A",
      "E quelle palline marroni che si trovano sulla spiaggia? Le chiamano palle di mare, no?"
     ],
     [
      "B",
      "Esatto. Sono fibre delle foglie, arrotolate dal movimento delle onde. E anche i mucchi di foglie secche che d'inverno si accumulano sulla riva vengono dalla posidonia. Molti turisti, vedendoli, pensano che la spiaggia sia sporca."
     ],
     [
      "A",
      "E invece?"
     ],
     [
      "B",
      "E invece quei cumuli proteggono la costa. Frenando la forza delle onde, riducono l'erosione. Toglierli con le ruspe all'inizio della stagione, come si fa in tanti comuni, significa in pratica regalare la sabbia al mare."
     ],
     [
      "A",
      "Quindi il problema non è la posidonia, ma la nostra idea di spiaggia pulita."
     ],
     [
      "B",
      "Diciamo di sì. Ci siamo abituati a una spiaggia da cartolina, liscia, senza niente. Ma una spiaggia viva è un po' disordinata, ecco."
     ],
     [
      "A",
      "Mi fai venire in mente mia nonna, che la chiamava alga e la odiava perché le si attaccava ai piedi."
     ],
     [
      "B",
      "Ecco, è un classico! Anche i miei nonni, in Puglia, la consideravano una seccatura. Però, pensandoci bene, era una convivenza più saggia della nostra: le foglie restavano lì tutto l'inverno, e nessuno si sognava di portarle via con le ruspe. Siamo stati noi, negli ultimi decenni, a trasformare la spiaggia in un salotto."
     ],
     [
      "A",
      "Torniamo in acqua, però. Perché queste praterie sono così importanti?"
     ],
     [
      "B",
      "Per tanti motivi. Sono un nido per moltissime specie di pesci, che lì depongono le uova e crescono protetti. Poi producono ossigeno. E, cosa di cui si parla sempre di più, immagazzinano carbonio nel fondale, accumulandolo per secoli. In questo senso sono un alleato contro il cambiamento climatico."
     ],
     [
      "A",
      "E stanno bene, queste praterie?"
     ],
     [
      "B",
      "Mah, dipende dalle zone. Il nemico numero uno, per quanto possa sembrare strano, sono le ancore. Una barca che si ferma sopra una prateria, tirando su l'ancora, strappa piante che hanno impiegato decenni a crescere. Poi ci sono gli scarichi, l'intorbidimento dell'acqua, il riscaldamento."
     ],
     [
      "A",
      "Si può rimediare? Cioè, si possono ripiantare?"
     ],
     [
      "B",
      "Si fanno esperimenti di trapianto, sì, e alcuni danno risultati incoraggianti. Però, detto sinceramente, costa moltissimo e la pianta cresce lentissima. È molto più sensato proteggere quello che c'è: boe di ormeggio fisse, per esempio, così le barche non devono gettare l'ancora."
     ],
     [
      "A",
      "Un ultimo consiglio per chi ci ascolta e quest'estate andrà al mare?"
     ],
     [
      "B",
      "Due cose semplici. Se avete una barca, informatevi prima di ancorare. E se trovate le foglie secche sulla spiaggia, non lamentatevi: stendeteci sopra l'asciugamano e pensate che state proteggendo la costa."
     ],
     [
      "A",
      "Messaggio ricevuto. Grazie, Marco, e grazie a tutti voi per l'ascolto."
     ]
    ],
    "gloss": {
     "mente": "(mi fai venire in mente) me hacés acordar de",
     "trasformare": "(siamo stati noi a trasformare) fuimos nosotros los que convertimos (semana 48)",
     "sognava": "(nessuno si sognava di) a nadie se le ocurría",
     "praterie": "praderas",
     "arrotolate": "enrolladas",
     "mucchi": "montones",
     "cumuli": "pilas, montículos",
     "ruspe": "topadoras",
     "depongono": "ponen (huevos)",
     "immagazzinano": "almacenan",
     "fondale": "fondo marino",
     "ancore": "anclas",
     "strappa": "arranca",
     "scarichi": "desechos vertidos, desagües",
     "intorbidimento": "enturbiamiento",
     "boe": "boyas",
     "ormeggio": "amarre",
     "asciugamano": "toallón",
     "seccatura": "molestia, fastidio"
    },
    "questions": [
     [
      "Che cosa sottolinea Marco all'inizio dell'intervista?",
      [
       "Che la posidonia vive in tutti i mari del mondo",
       "Che la posidonia è una pianta e non un'alga",
       "Che la posidonia cresce solo vicino alla riva",
       "Che la posidonia è una specie ormai estinta"
      ],
      "Che la posidonia è una pianta e non un'alga"
     ],
     [
      "Qual è la funzione dei cumuli di foglie sulla spiaggia?",
      [
       "Attirano i pesci verso la riva",
       "Rendono l'acqua più limpida",
       "Riducono l'erosione della costa",
       "Servono da cibo per gli uccelli"
      ],
      "Riducono l'erosione della costa"
     ],
     [
      "Qual è, secondo Marco, la minaccia principale per le praterie?",
      [
       "Le ancore delle barche",
       "Il riscaldamento del mare",
       "La pesca con le reti",
       "I turisti sulla spiaggia"
      ],
      "Le ancore delle barche"
     ],
     [
      "Che cosa pensa Marco dei trapianti di posidonia?",
      [
       "Sono inutili e andrebbero abbandonati",
       "Sono la soluzione migliore per il futuro",
       "Sono proibiti in quasi tutti i comuni",
       "A volte funzionano, ma proteggere è più sensato"
      ],
      "A volte funzionano, ma proteggere è più sensato"
     ],
     [
      "Con quale tono chiude Marco l'intervista?",
      [
       "Pratico e un po' scherzoso",
       "Allarmato e pessimista",
       "Tecnico e distaccato",
       "Polemico verso i comuni"
      ],
      "Pratico e un po' scherzoso"
     ]
    ],
    "vf": [
     [
      "La posidonia produce fiori.",
      "vero"
     ],
     [
      "Secondo Marco, trapiantare la posidonia costa poco.",
      "falso"
     ],
     [
      "Marco partecipa personalmente a progetti di trapianto.",
      "non si dice"
     ],
     [
      "Le praterie accumulano carbonio nel fondale per secoli.",
      "vero"
     ]
    ]
   },
   "compito": {
    "genre": "lettera_lettore",
    "title": "La ricerca di base è un lusso?",
    "fonte": "lettura",
    "t": "Hai letto sulla rivista «Orizzonti» il reportage «Sotto la montagna, in ascolto dell'universo». Nel numero successivo, un lettore ha scritto che «spendere milioni per inseguire particelle invisibili è un lusso che un Paese in difficoltà non può permettersi». Scrivi una lettera alla rubrica dei lettori della rivista (210-270 parole, registro formale ma personale) in cui prendi posizione sul finanziamento della ricerca di base, riprendi almeno due argomenti presentati nel reportage e proponi un modo concreto per avvicinare i laboratori ai cittadini e al territorio.",
    "es": "Carta de lector: tomá posición sobre si financiar la ciencia básica, retomando argumentos concretos del reportaje, y proponé algo para acercar el laboratorio a los vecinos. Probá usar algún gerundio o participio absoluto.",
    "min": 210,
    "max": 270,
    "punti": [
     [
      "tomar posición sobre financiar la ciencia básica",
      [
       "ricerca",
       "finanz",
       "fondi"
      ]
     ],
     [
      "retomar al menos dos argumentos del reportaje",
      [
       "reportage",
       "articolo",
       "montanari",
       "chiara"
      ]
     ],
     [
      "mencionar la relación con los vecinos o el territorio",
      [
       "territorio",
       "abitanti",
       "cittadini"
      ]
     ],
     [
      "proponer algo concreto",
      [
       "propong",
       "propos",
       "suggeri"
      ]
     ]
    ],
    "model": "Gentile redazione,\n\nho letto con grande interesse il reportage sui laboratori del Gran Sasso e, nel numero successivo, la lettera del signor Rinaldi, secondo il quale finanziare la ricerca di base sarebbe «un lusso». Pur comprendendo la sua preoccupazione, vorrei esprimere un parere diverso.\n\nInnanzitutto, come ricorda nell'articolo la fisica Chiara Montanari, molte delle tecnologie che oggi usiamo ogni giorno sono nate da ricerche che, al momento, non avevano alcuno scopo pratico. Giudicando la scienza soltanto in base alla sua utilità immediata, avremmo rinunciato a buona parte della medicina moderna. In secondo luogo, il reportage mostra che gli strumenti costruiti per studiare i neutrini producono ricadute concrete: sensori, materiali purissimi, tecniche che finiscono negli ospedali e nelle fabbriche.\n\nDetto questo, il signor Rinaldi solleva un problema reale: i cittadini spesso non sanno che cosa succeda dentro questi laboratori, e ciò alimenta la diffidenza. L'articolo stesso ricorda i timori degli abitanti per l'acqua delle falde. Credo che la risposta non sia tagliare i fondi, ma aprire le porte.\n\nPropongo quindi che i laboratori organizzino, almeno una volta al mese, visite guidate gratuite per le scuole e per gli abitanti dei comuni vicini, e che pubblichino in modo trasparente i risultati dei controlli ambientali. Conosciuto da vicino il lavoro dei ricercatori, sono convinta che molti cambierebbero idea.\n\nDistinti saluti,\nLaura Bianchi, Teramo",
    "gloss": {
     "Pur comprendendo": "aun entendiendo, aunque entiendo (pur + gerundio)",
     "ricerca di base": "investigación básica, sin fin práctico inmediato",
     "ricadute": "repercusiones, efectos derivados",
     "Detto questo": "dicho esto",
     "solleva": "plantea",
     "falde": "napas (de agua)",
     "tagliare i fondi": "recortar el financiamiento"
    }
   },
   "breve": {
    "title": "Prima di entrare in galleria",
    "genre": "istruzioni di sicurezza",
    "es": "Las instrucciones de seguridad antes de la visita a los laboratorios subterráneos del Gran Sasso.",
    "speaker": "Guida",
    "voice": 1,
    "text": [
     "Benvenuti ai Laboratori del Gran Sasso. Prima di entrare in galleria, ascoltate con attenzione queste istruzioni di sicurezza. Durante la visita indosserete il casco, che vi verrà consegnato all'ingresso, e porterete con voi un piccolo apparecchio di emergenza, tenendolo sempre agganciato alla cintura.",
     "Camminando in galleria, restate dietro alla guida e non superate mai la linea gialla. Le sale sperimentali si visitano in gruppi di dieci persone al massimo; aspettando il vostro turno, potrete guardare il video nella sala d'accoglienza.",
     "In caso di allarme, sentendo la sirena, lasciate ogni cosa e seguite le luci verdi fino al rifugio più vicino. Non usate i telefoni: sotto la montagna non c'è campo, e le comunicazioni passano solo attraverso la rete interna.",
     "La visita dura circa due ore. È vietato fotografare le sale sperimentali senza il permesso della guida. Grazie, e buona visita."
    ],
    "tabella": [
     [
      "Oggetto da tenere agganciato alla cintura",
      "apparecchio di emergenza",
      [
       "l'apparecchio di emergenza",
       "apparecchio"
      ]
     ],
     [
      "Colore della linea da non superare",
      "gialla",
      [
       "giallo"
      ]
     ],
     [
      "Persone al massimo per gruppo",
      "10",
      [
       "dieci"
      ]
     ],
     [
      "Colore delle luci da seguire in caso di allarme",
      "verdi",
      [
       "verde"
      ]
     ],
     [
      "Durata della visita",
      "2 ore",
      [
       "due ore",
       "circa due ore",
       "2"
      ]
     ]
    ],
    "info": [
     [
      "Il casco si riceve all'ingresso.",
      true
     ],
     [
      "Si può camminare davanti alla guida.",
      false
     ],
     [
      "Mentre si aspetta il turno si può guardare un video.",
      true
     ],
     [
      "In caso di allarme bisogna telefonare subito ai soccorsi.",
      false
     ],
     [
      "Sotto la montagna i cellulari non hanno campo.",
      true
     ],
     [
      "Nelle sale sperimentali si possono fare foto liberamente.",
      false
     ]
    ],
    "gloss": {
     "galleria": "túnel",
     "agganciato": "enganchado",
     "rifugio": "refugio",
     "campo": "señal (del celular)"
    }
   }
  },
  {
   "week": 45,
   "level": "C1",
   "lettura": {
    "title": "Caro Julián, ti spiego l'Italia in dieci verbi (piccoli)",
    "emoji": "😏",
    "genre": "rubrica umoristica",
    "grammar": "costruzioni verbali pronominali (farcela, andarsene, prendersela…)",
    "text": "Caro Julián, la settimana scorsa, alla fine della riunione, mi hai chiesto con aria disperata: «Ma com'è possibile che dopo sei mesi di corso io capisca il telegiornale e non capisca i miei colleghi alla macchinetta del caffè?». Ti ho risposto con una battuta, perché eravamo tutti di fretta. Ora, avendo finalmente mezz'ora libera e un caffè decente davanti, provo a darti una risposta seria. O quasi.\n\nIl problema, amico mio, non è il congiuntivo, e nemmeno i tempi del passato. Il problema sono certi verbi minuscoli, apparentemente innocui, che si portano dietro una scorta di pronomi: un «ci», un «la», un «ne», a volte tutti insieme. Sui libri occupano mezza pagina; nella vita di un italiano occupano mezza giornata. Prendi farcela. Tu lo traduci con «riuscire», e sul dizionario va benissimo. Ma quando la mia vicina, alle otto del mattino, sale le scale con le borse della spesa e sospira «non ce la faccio più», non ti sta informando di un fallimento tecnico: ti sta raccontando la sua vita, i figli, il mutuo e il governo. Tutto in cinque parole.\n\nPoi c'è cavarsela, che secondo me è il vero verbo nazionale. In Italia nessuno è davvero bravo in qualcosa: tutti, al massimo, «se la cavano». Se chiedi a un chirurgo di fama come va col bisturi, ti risponderà modesto: «Me la cavo». E tu devi capire che si tratta di un'eccellenza mondiale. Se invece chiedi a mio cugino come va con l'inglese, ti dirà la stessa cosa, e lì devi capire che sa dire «hello» e poco altro. La differenza sta tutta nel tono, e il tono, purtroppo, non si studia sui libri. Cavarsela, del resto, è quasi una filosofia: non vincere, ma uscirne vivi.\n\nIl capitolo più delicato è quello di prendersela. Da noi ci si offende con grande frequenza e con discreta creatività. Te ne sarai accorto: basta un parcheggio rubato o un commento sulla carbonara con la panna perché qualcuno se la prenda per giorni. E attenzione: prendersela non è la stessa cosa che avercela con qualcuno. Chi se la prende soffre in silenzio, anzi, soffre a voce alta con tutti tranne che con il colpevole. Chi ce l'ha con te, invece, prima o poi te lo farà sapere, possibilmente in pubblico. Il mio consiglio? Quando un collega ti dice «Non prendertela, eh», preoccupati: vuol dire che sta per dirti qualcosa di spiacevole.\n\nVeniamo ad andarsene, il verbo delle uscite drammatiche. Un italiano non esce da una stanza: se ne va. E se ne va sbattendo la porta, o almeno annunciandolo: «Io me ne vado, eh!». Nove volte su dieci resta dov'è, ma l'importante è averlo detto. A una cena di famiglia ho contato una volta sette «me ne vado» in due ore, pronunciati da quattro persone diverse; alla fine non se n'era andato nessuno e si era arrivati al dolce in perfetta armonia. È un rito, capisci? Minacciare di andarsene serve a restare con più dignità.\n\nAggiungo, per completezza, la coppia metterci e volerci, che ti farà impazzire nelle conversazioni sul tempo. «Quanto ci vuole per arrivare in centro?», chiede il turista. «Ci vogliono dieci minuti», risponde il passante, intendendo naturalmente mezz'ora. Se invece è lui a guidare, dirà: «Io ci metto dieci minuti», e questa volta è vero, perché guida come un pilota di Formula 1. Volerci descrive il mondo; metterci descrive te. È una distinzione sottile, ma quando la padroneggerai ti sentirai finalmente a casa.\n\nCi sono poi i verbi che non ti consiglio di usare in ufficio, almeno per i primi due anni. Fregarsene, per esempio, è molto espressivo ma poco diplomatico: se il capo ti chiede un parere sul nuovo logo e tu rispondi che te ne freghi, sarai sincero, ma difficilmente farai carriera. Più innocente è smetterla, che però va dosato: «Smettila!» detto a un bambino è normale, detto a un dirigente è un addio. E se una sera non te la senti di uscire con noi dopo il lavoro, basta dirlo: «Stasera non me la sento». Nessuno ti chiederà spiegazioni, perché sentirsela, in Italia, è una questione dell'anima.\n\nSo già cosa pensi: che questi verbi sono un labirinto. Hai ragione, ma è un labirinto divertente, e ti accorgerai presto che ti servono più del passato remoto. Il trucco è non tradurli, ma osservare quando li usano gli altri, con che faccia e con che tono. La lingua, in fondo, è un po' come il traffico di Roma: le regole ci sono, ma la vera abilità sta nel capire quando tutti fanno finta che non ci siano.\n\nTi lascio con un'ultima perla. Quando ti chiederanno come te la passi qui da noi, non rispondere «bene, grazie», come insegnano i manuali: sembreresti un robot. Di' piuttosto: «Eh, non c'è male, me la cavo». Vedrai che ti guarderanno con rispetto. E se proprio non ce la fai più, scrivimi: ne parliamo davanti a un altro caffè. Tanto, lo sai, qui un caffè non si nega a nessuno.\n\nTuo, Beppe",
    "gloss": {
     "passi": "(come te la passi?) ¿cómo andás?: *passarsela*",
     "battuta": "chiste, broma",
     "minuscoli": "diminutos",
     "innocui": "inofensivos",
     "scorta": "escolta, séquito",
     "borse": "bolsas",
     "sospira": "suspira",
     "mutuo": "crédito hipotecario",
     "chirurgo": "cirujano",
     "discreta": "considerable, bastante",
     "colpevole": "culpable",
     "spiacevole": "desagradable",
     "sbattendo": "golpeando (la puerta), dando un portazo",
     "minacciare": "amenazar",
     "passante": "transeúnte",
     "padroneggerai": "vas a dominar, vas a manejar bien",
     "freghi": "(te ne freghi) te importa un pepino",
     "dosato": "dosificado, usado con medida",
     "dirigente": "gerente, directivo",
     "trucco": "truco",
     "finta": "fanno finta: hacen de cuenta",
     "cugino": "primo",
     "possibilmente": "si es posible, en lo posible",
     "nega": "niega"
    },
    "questions": [
     [
      "Qual è l'intento principale di Beppe?",
      [
       "Lamentarsi del pessimo italiano parlato dal collega Julián",
       "Spiegare con ironia l'uso reale di alcuni verbi",
       "Proporre un corso di grammatica per gli stranieri in ufficio",
       "Criticare il carattere permaloso degli italiani"
      ],
      "Spiegare con ironia l'uso reale di alcuni verbi"
     ],
     [
      "Secondo Beppe, un chirurgo che dice «Me la cavo»…",
      [
       "ha seri dubbi sulle proprie capacità professionali",
       "non ama parlare del suo lavoro",
       "è in realtà un professionista eccellente",
       "sta per andare in pensione"
      ],
      "è in realtà un professionista eccellente"
     ],
     [
      "Che differenza c'è tra prendersela e avercela con qualcuno?",
      [
       "Nessuna: nell'uso quotidiano sono perfetti sinonimi",
       "Il primo si usa al lavoro, il secondo solo in famiglia",
       "Il primo è volgare, il secondo è formale e cortese",
       "Chi se la prende soffre; chi ce l'ha con te lo dimostra"
      ],
      "Chi se la prende soffre; chi ce l'ha con te lo dimostra"
     ],
     [
      "Perché, secondo Beppe, gli italiani dicono «me ne vado» senza andarsene?",
      [
       "Per ottenere attenzione e restare con dignità",
       "Perché è una formula di cortesia a tavola",
       "Per chiudere educatamente una conversazione",
       "Perché in realtà non sanno dove andare"
      ],
      "Per ottenere attenzione e restare con dignità"
     ],
     [
      "Che cosa suggerisce il paragone con il traffico di Roma?",
      [
       "Che la lingua italiana, in pratica, non ha nessuna regola",
       "Che conta capire come le regole vivono nella pratica",
       "Che bisogna evitare di parlare troppo in fretta",
       "Che gli italiani, in generale, guidano molto male"
      ],
      "Che conta capire come le regole vivono nella pratica"
     ]
    ],
    "vf": [
     [
      "Julián capisce il telegiornale ma non le chiacchiere dei colleghi.",
      "vero"
     ],
     [
      "Beppe consiglia di usare «fregarsene» con il capo per sembrare sinceri.",
      "falso"
     ],
     [
      "La vicina di Beppe ha appena perso il lavoro.",
      "non si dice"
     ],
     [
      "Secondo Beppe, a Julián servirà di più il passato remoto di questi verbi.",
      "falso"
     ],
     [
      "Julián ha già usato «me la cavo» con i suoi colleghi.",
      "non si dice"
     ]
    ],
    "hunt": {
     "label": "Tocá los verbos pronominales en infinitivo o imperativo (farcela, prendertela…)",
     "targets": [
      "farcela",
      "cavarsela",
      "uscirne",
      "prendersela",
      "avercela",
      "prendertela",
      "andarsene",
      "metterci",
      "volerci",
      "fregarsene",
      "smetterla",
      "smettila",
      "sentirsela"
     ]
    }
   },
   "ascolto": {
    "title": "Ridere in italiano",
    "genre": "intervista radiofonica",
    "es": "En un programa de radio sobre la lengua, un conductor entrevista a una comediante sobre la ironía italiana y cómo hacer reír a un público extranjero.",
    "speakers": [
     "Conduttore",
     "Comica"
    ],
    "turns": [
     [
      "A",
      "Siamo di nuovo in onda con «Parole in libertà». La mia ospite di oggi fa ridere l'Italia da dieci anni, nei teatri e sui social: Serena Galli. Serena, benvenuta."
     ],
     [
      "B",
      "Grazie, Luca. Dieci anni… detto così mi fai sentire vecchissima."
     ],
     [
      "A",
      "Scusa, non volevo. Allora, oggi parliamo di ironia. Tu dici spesso che l'ironia italiana è intraducibile. Che cosa intendi?"
     ],
     [
      "B",
      "Mah, intraducibile forse è esagerato. Diciamo che è molto legata al tono e al contesto. Ti faccio un esempio. Se piove da una settimana e il mio vicino mi dice «Che bella giornata, eh?», io capisco benissimo. Ma se lo scrivo in un copione per un pubblico straniero, devo spiegarlo, e una battuta spiegata è una battuta morta."
     ],
     [
      "A",
      "E sul palco come te la cavi, quando hai davanti un pubblico misto?"
     ],
     [
      "B",
      "Guarda, all'inizio me la prendevo. Facevo una battuta e metà sala rideva, l'altra metà mi guardava come se avessi parlato in cinese. Poi ho capito che dovevo smetterla di dare la colpa al pubblico. Ho cominciato a lavorare di più sulle situazioni, su quello che si vede, e meno sui giochi di parole."
     ],
     [
      "A",
      "Quindi l'ironia verbale funziona peggio?"
     ],
     [
      "B",
      "Funziona benissimo, ma solo con chi condivide i tuoi codici. Pensa ai modi di dire. «Non vedo l'ora», «ce l'ha con me», «me ne frego»: per noi sono automatici, per uno straniero sono indovinelli. Io ci gioco molto, prendo un'espressione e la interpreto alla lettera. Per esempio racconto di quella volta che un tizio, in macchina, mi ha mandato a quel paese, e io gli ho chiesto: scusi, quale paese, di preciso? Mi serve l'indirizzo, sa, per il navigatore."
     ],
     [
      "A",
      "E il pubblico ride, con questa?"
     ],
     [
      "B",
      "Il pubblico italiano sì, molto. Quello straniero di solito ride dopo, quando qualcuno gli spiega. Ride in differita, insomma."
     ],
     [
      "A",
      "C'è un tipo di ironia che secondo te è tipicamente italiana?"
     ],
     [
      "B",
      "Forse l'autoironia un po' amara. Quella di chi dice «Tanto ce la caviamo sempre, all'italiana». È un po' un vanto e un po' una condanna. Ridiamo dei nostri difetti, ma a volte, ridendo, ci assolviamo, e così non cambiamo niente."
     ],
     [
      "A",
      "Questa è una lettura quasi politica, però."
     ],
     [
      "B",
      "Un po' sì. La comicità serve anche a questo, no? A mettere il dito nella piaga, ma con il sorriso. Se lo fai urlando, la gente se ne va. Se lo fai ridendo, resta, e magari ci pensa."
     ],
     [
      "A",
      "E con le critiche come te la cavi? Sui social, immagino, c'è sempre qualcuno che se la prende."
     ],
     [
      "B",
      "Sempre! C'è chi ce l'ha con me perché scherzo sul Nord, chi perché scherzo sul Sud. Quando mi attaccano da tutte e due le parti, penso di aver fatto un buon lavoro."
     ],
     [
      "A",
      "Ultima domanda, quella che faccio a tutti. Una battuta che non riusciresti mai a tradurre."
     ],
     [
      "B",
      "Facile: quando mia nonna, davanti a qualunque disastro, diceva «Poteva andare peggio». E lo diceva anche quando, onestamente, peggio di così non poteva andare. Prova a tradurre quella faccia!"
     ],
     [
      "A",
      "Ci rinuncio. Grazie, Serena, e grazie a voi che ci avete ascoltato."
     ]
    ],
    "gloss": {
     "paese": "(mandare a quel paese) mandar al diablo",
     "copione": "guion",
     "battuta": "chiste, remate",
     "palco": "escenario",
     "indovinelli": "adivinanzas",
     "tizio": "tipo, fulano",
     "navigatore": "GPS",
     "differita": "en differita: en diferido",
     "vanto": "motivo de orgullo",
     "condanna": "condena",
     "assolviamo": "absolvemos, perdonamos",
     "piaga": "llaga",
     "urlando": "gritando",
     "rinuncio": "ci rinuncio: me rindo"
    },
    "questions": [
     [
      "Perché, secondo Serena, spiegare una battuta è un problema?",
      [
       "Perché fa perdere troppo tempo sul palco",
       "Perché il pubblico straniero si offende",
       "Perché la battuta perde il suo effetto",
       "Perché i traduttori la cambiano sempre"
      ],
      "Perché la battuta perde il suo effetto"
     ],
     [
      "Come ha cambiato il suo lavoro davanti a un pubblico misto?",
      [
       "Ha puntato di più sulle situazioni visibili",
       "Ha smesso di esibirsi fuori dall'Italia",
       "Ha eliminato del tutto i modi di dire",
       "Ha cominciato a usare i sottotitoli"
      ],
      "Ha puntato di più sulle situazioni visibili"
     ],
     [
      "Che tecnica usa Serena con i modi di dire?",
      [
       "Li traduce prima in inglese",
       "Li spiega prima dello spettacolo",
       "Li prende alla lettera",
       "Li inventa di sana pianta"
      ],
      "Li prende alla lettera"
     ],
     [
      "Che cosa pensa Serena dell'autoironia italiana?",
      [
       "È sempre un segno di grande intelligenza",
       "È sparita nelle nuove generazioni",
       "Funziona solo davanti a un pubblico del Sud",
       "Può diventare un modo per non cambiare"
      ],
      "Può diventare un modo per non cambiare"
     ],
     [
      "Come interpreta Serena le critiche che arrivano sia dal Nord sia dal Sud?",
      [
       "Come il segno che la sua comicità è equilibrata",
       "Come una ragione per smettere di usare i social",
       "Come la prova che ha sbagliato bersaglio",
       "Come un problema da risolvere con il suo agente"
      ],
      "Come il segno che la sua comicità è equilibrata"
     ]
    ],
    "vf": [
     [
      "Serena fa la comica da una decina d'anni.",
      "vero"
     ],
     [
      "All'inizio della carriera Serena non si offendeva mai per le reazioni del pubblico.",
      "falso"
     ],
     [
      "Serena ha fatto spettacoli in Argentina.",
      "non si dice"
     ],
     [
      "La nonna di Serena usava un'espressione consolatoria anche davanti ai disastri.",
      "vero"
     ]
    ]
   },
   "compito": {
    "genre": "email_informale",
    "title": "Come sopravvivere all'ironia italiana",
    "fonte": "entrambi",
    "t": "Hai letto la rubrica «Caro Julián, ti spiego l'Italia in dieci verbi (piccoli)» e hai ascoltato l'intervista alla comica Serena Galli. Un'amica argentina, Sofía, che studia italiano e sta per trasferirsi a Bologna per lavoro, ti scrive: «Al corso capisco tutto, ma quando gli italiani scherzano mi sento persa!». Scrivile un'email informale (216-276 parole) in cui le spieghi, con esempi presi dalla rubrica e dall'intervista, almeno tre verbi o espressioni tipiche (per esempio farcela, cavarsela, prendersela), le dai un consiglio per capire l'ironia e la rassicuri.",
    "es": "Mail informal a una amiga: explicá al menos tres verbos pronominales con ejemplos de la columna y de la entrevista, dale un consejo sobre la ironía y tranquilizala. Cuidá el saludo y la despedida informales.",
    "min": 216,
    "max": 276,
    "punti": [
     [
      "saludo y despedida informales",
      [
       "cara",
       "ciao",
       "abbraccio",
       "baci"
      ]
     ],
     [
      "explicar al menos tres expresiones con ejemplos",
      [
       "cavarsela",
       "farcela",
       "prendersela",
       "me la cavo",
       "ce la fa"
      ]
     ],
     [
      "referirse a la columna o a la entrevista",
      [
       "rubrica",
       "intervista",
       "comica",
       "serena",
       "beppe"
      ]
     ],
     [
      "dar un consejo sobre la ironía",
      [
       "ironi",
       "tono",
       "consigli"
      ]
     ]
    ],
    "model": "Cara Sofía,\n\nche bello ricevere la tua email! Tranquilla, sentirsi persi è normalissimo: capita a tutti, anche a chi parla italiano da anni.\n\nProprio questa settimana ho letto una rubrica divertentissima, la lettera di un certo Beppe a un collega argentino, e ti assicuro che sembra scritta per te. Beppe spiega che il problema non è la grammatica, ma certi verbi piccolissimi pieni di pronomi. Prendi «farcela»: quando la vicina di casa sospira «non ce la faccio più», non vuol dire che ha fallito in qualcosa, ma che è stanca di tutto. Poi c'è «cavarsela»: gli italiani non dicono mai di essere bravi, dicono «me la cavo», anche quando sono dei geni. E attenta a «prendersela», cioè offendersi: se qualcuno ti dice «non prendertela», preparati a una critica!\n\nHo anche ascoltato un'intervista alla comica Serena Galli, secondo cui l'ironia italiana dipende quasi tutta dal tono. Se piove da giorni e il vicino ti dice «che bella giornata», ovviamente scherza. Lei, per far ridere gli stranieri, prende i modi di dire alla lettera, e secondo me è un ottimo esercizio anche per chi impara.\n\nIl mio consiglio? Non cercare di tradurre tutto. Guarda le facce, ascolta il tono e, quando non capisci, chiedi senza vergogna: gli italiani adorano spiegare le proprie battute, anche se poi non fanno più ridere nessuno.\n\nVedrai che in un paio di mesi te la caverai benissimo. E se proprio non ce la fai, chiamami!\n\nUn abbraccio forte,\nMartina",
    "gloss": {
     "rubrica": "columna (de una revista o diario)",
     "sospira": "suspira",
     "prende i modi di dire alla lettera": "toma las frases hechas al pie de la letra",
     "battute": "chistes, remates",
     "geni": "genios"
    }
   },
   "breve": {
    "title": "«Me la cavo», stasera a teatro",
    "genre": "pubblicità radiofonica",
    "es": "La publicidad radial de un espectáculo de humor sobre la vida en la oficina.",
    "speaker": "Voce della pubblicità",
    "voice": 1,
    "text": [
     "Non ce la fate più? Il lavoro vi stressa e ve la prendete per ogni cosa? Allora concedetevi una serata di risate: arriva «Me la cavo», il nuovo spettacolo di Lucia Pace, la comica che ha conquistato il web con i suoi video sulla vita in ufficio.",
     "Novanta minuti di monologhi sui piccoli drammi quotidiani: il capo che ce l'ha con tutti, il collega che se ne va sbattendo la porta e poi torna a prendersi il caffè, la riunione che doveva durare dieci minuti.",
     "Appuntamento al Teatro Verdi di Padova venerdì 18 e sabato 19 marzo, alle ventuno. Biglietti da venticinque euro, ridotti a diciotto per studenti e over sessantacinque. Affrettatevi: la prima serata è quasi esaurita.",
     "«Me la cavo», di e con Lucia Pace. Se non venite, ve ne pentirete!"
    ],
    "tabella": [
     [
      "Titolo dello spettacolo",
      "Me la cavo",
      []
     ],
     [
      "Durata (minuti)",
      "90",
      [
       "novanta"
      ]
     ],
     [
      "Città del teatro",
      "Padova",
      []
     ],
     [
      "Prezzo ridotto (euro)",
      "18",
      [
       "diciotto"
      ]
     ]
    ],
    "info": [
     [
      "Lucia Pace è diventata famosa grazie ai suoi video.",
      true
     ],
     [
      "Lo spettacolo parla della vita in famiglia.",
      false
     ],
     [
      "Lo spettacolo va in scena due sere.",
      true
     ],
     [
      "Il biglietto intero costa diciotto euro.",
      false
     ],
     [
      "La seconda serata è quasi esaurita.",
      false
     ],
     [
      "Gli studenti pagano meno.",
      true
     ]
    ],
    "gloss": {
     "risate": "risas",
     "sbattendo": "golpeando (dando un portazo)",
     "affrettatevi": "apúrense",
     "esaurita": "agotada"
    }
   }
  },
  {
   "week": 46,
   "level": "C1",
   "lettura": {
    "title": "Casette, libroni e tempacci: il mondo con la lente",
    "emoji": "🔍",
    "genre": "rubrica di lingua (risposta a una lettrice)",
    "grammar": "suffissi e alterazione (diminutivi, accrescitivi, peggiorativi)",
    "text": "«Gentile professoressa, insegno italiano in Germania e i miei studenti mi fanno sempre la stessa domanda: perché gli italiani dicono “un attimino”, “un caffettino”, “una domandina”? È solo gentilezza o c'è qualcos'altro? E come si fa a sapere quale suffisso usare? La ringrazio. Ingrid K., Monaco di Baviera»\n\nCara Ingrid, la sua domanda tocca uno dei tesori più preziosi, e più insidiosi, della nostra lingua: l'alterazione. Con un semplice suffisso l'italiano riesce a cambiare le dimensioni di una cosa, ma anche il modo in cui la guardiamo. Una casa diventa una casetta o una casina se è piccola e graziosa, un casone se è grande, una casaccia se è brutta o malridotta, una casupola se è modesta e un po' misera. Non si tratta di parole nuove da cercare nel vocabolario, ma di sfumature, e sono proprio le sfumature a mettere in difficoltà chi impara.\n\nPartiamo dai diminutivi, i più amati: -ino, -etto, -ello, -uccio. In teoria indicano piccolezza, ma nella pratica esprimono soprattutto affetto, confidenza, delicatezza. Il fratellino non è necessariamente basso di statura: è il fratello più giovane, quello che si protegge. Un vestitino può essere semplicemente un vestito carino, leggero, estivo. E quando al bar qualcuno chiede «un caffettino», non vuole meno caffè degli altri: sta chiedendo con garbo, quasi scusandosi del disturbo. Lo stesso vale per il celebre «attimino», che fa inorridire i puristi ma che nella lingua parlata serve ad attenuare una richiesta: «Aspetti un attimino» suona molto meno brusco di «Aspetti».\n\nEcco quindi la risposta alla sua prima domanda: sì, spesso è gentilezza, ma una gentilezza con una funzione precisa. Il diminutivo rimpicciolisce la richiesta, la rende meno ingombrante. Una «domandina» promette di rubare poco tempo, anche quando poi si rivela una domanda lunghissima. C'è però anche un risvolto meno innocente: il diminutivo può diventare ironico o perfino sprezzante. Se un collega definisce il proprio progetto «un lavoretto», forse è modesto; se a definirlo così è un altro, forse lo sta sminuendo. E «il signorino», detto a un ragazzo di vent'anni che non si alza dal divano, non è certo un complimento.\n\nGli accrescitivi, con il suffisso -one, ingrandiscono: un librone è un libro grosso e pesante, un nasone un naso importante, un ragazzone un ragazzo grande e grosso, spesso con una sfumatura bonaria. Curiosamente, -one tende a rendere maschili anche i nomi femminili: la porta diventa il portone, la palla il pallone. I peggiorativi, invece, come -accio e -astro, esprimono disprezzo o un giudizio negativo: un tempaccio è un tempo pessimo, una parolaccia è una parola volgare, un poetastro è un cattivo poeta. Con i colori e i sapori, -astro indica piuttosto un'approssimazione, spesso poco gradevole: giallastro, verdastro, dolciastro.\n\nE adesso la cattiva notizia. Non tutto ciò che finisce in -ino o in -one è un alterato. Il tacchino non è un piccolo tacco, il mattone non è un grande matto, il burrone non ha niente a che fare con il burro e il lampone non è un lampo gigante. Inoltre, molti alterati nel tempo si sono lessicalizzati, cioè sono diventati parole autonome: il fumetto non è un piccolo fumo, anche se il nome viene dalle nuvolette che contengono le battute dei personaggi; il cavalletto del pittore non è un cavallino; il portone e il pallone, che citavo prima, hanno ormai una vita propria. In questi casi il dizionario è l'unico amico fidato.\n\nCome scegliere, allora, il suffisso giusto? Qui devo essere sincera: non esiste una regola che valga sempre. Si dice gattino e non gattetto, ma casetta e casina convivono tranquillamente; libretto, poi, oltre a un piccolo libro è il testo di un'opera lirica. Contano l'abitudine, il suono e a volte la zona d'Italia, perché certe forme sono più frequenti in una regione che in un'altra. Anche la combinazione dei suffissi ha i suoi misteri: da casa si arriva a casettina, ma nessuno direbbe mai «casinetta». Il consiglio che do ai miei studenti è di non inventare alterati, almeno all'inizio, ma di raccoglierli come si raccolgono le conchiglie: uno alla volta, notando in quale contesto e con quale tono li usano i parlanti.\n\nPer concludere, cara Ingrid, dica ai suoi studenti che gli alterati sono una lente: permettono di guardare le cose da vicino o da lontano, con tenerezza o con fastidio. Usarli bene significa aver capito non solo che cosa diciamo, ma come ci sentiamo quando lo diciamo. E questo, glielo assicuro, è un traguardo che va ben oltre la grammatica. Un caro saluto (e non un salutino, visto che la domanda meritava una risposta lunga).",
    "gloss": {
     "insidiosi": "traicioneros",
     "graziosa": "linda, coqueta",
     "malridotta": "venida abajo, en mal estado",
     "misera": "pobre, mísera",
     "sfumature": "matices",
     "garbo": "delicadeza, buenos modales",
     "inorridire": "horrorizar",
     "attenuare": "suavizar",
     "rimpicciolisce": "achica",
     "ingombrante": "que ocupa mucho, molesta",
     "risvolto": "costado, implicancia",
     "sprezzante": "despectivo",
     "sminuendo": "menospreciando",
     "bonaria": "bonachona",
     "disprezzo": "desprecio",
     "tacchino": "pavo",
     "tacco": "taco (del zapato)",
     "mattone": "ladrillo",
     "burrone": "barranco",
     "burro": "manteca",
     "lampone": "frambuesa",
     "lampo": "relámpago",
     "fumetto": "historieta",
     "cavalletto": "caballete",
     "conchiglie": "caracoles de mar",
     "traguardo": "meta, logro"
    },
    "questions": [
     [
      "Che cosa chiede Ingrid nella sua lettera?",
      [
       "Perché si usano tanti diminutivi e come scegliere il suffisso",
       "Come correggere gli errori di pronuncia dei suoi studenti tedeschi",
       "Quali parolacce italiane è meglio non insegnare in classe",
       "Se «attimino» si può usare nei testi scritti ufficiali"
      ],
      "Perché si usano tanti diminutivi e come scegliere il suffisso"
     ],
     [
      "Secondo la professoressa, chi al bar chiede «un caffettino»…",
      [
       "vuole una tazza più piccola del solito",
       "sta chiedendo con cortesia",
       "preferisce un caffè più leggero",
       "sta scherzando con il barista"
      ],
      "sta chiedendo con cortesia"
     ],
     [
      "In quale caso il diminutivo può risultare offensivo?",
      [
       "Quando lo si usa con persone più anziane",
       "Quando lo si usa in un testo scritto",
       "Quando serve a sminuire il lavoro o la persona",
       "Quando lo si aggiunge a nomi di colori"
      ],
      "Quando serve a sminuire il lavoro o la persona"
     ],
     [
      "Perché la professoressa cita tacchino, mattone e burrone?",
      [
       "Come esempi di accrescitivi rari e antichi",
       "Per mostrare che non tutto ciò che finisce in -ino o -one è alterato",
       "Per spiegare l'origine regionale e dialettale di alcuni suffissi italiani",
       "Come parole che gli stranieri pronunciano spesso male"
      ],
      "Per mostrare che non tutto ciò che finisce in -ino o -one è alterato"
     ],
     [
      "Quale consiglio dà per imparare gli alterati?",
      [
       "Inventarne di nuovi per fare esercizio",
       "Raccoglierli osservando contesto e tono",
       "Imparare a memoria le regole dei suffissi",
       "Evitarli del tutto nella lingua parlata"
      ],
      "Raccoglierli osservando contesto e tono"
     ]
    ],
    "vf": [
     [
      "Ingrid insegna italiano in Germania.",
      "vero"
     ],
     [
      "Secondo la professoressa, «attimino» è accettato anche dai puristi.",
      "falso"
     ],
     [
      "Il suffisso -one può rendere maschile un nome femminile.",
      "vero"
     ],
     [
      "La professoressa ha scritto un dizionario degli alterati.",
      "non si dice"
     ],
     [
      "Il fumetto si chiama così perché è un libro di piccole dimensioni.",
      "falso"
     ]
    ],
    "hunt": {
     "label": "Tocá los sustantivos y adjetivos alterados (diminutivos, aumentativos, despectivos)",
     "targets": [
      "attimino",
      "caffettino",
      "domandina",
      "casetta",
      "casina",
      "casone",
      "casaccia",
      "casupola",
      "fratellino",
      "vestitino",
      "lavoretto",
      "signorino",
      "librone",
      "nasone",
      "ragazzone",
      "tempaccio",
      "parolaccia",
      "poetastro",
      "giallastro",
      "verdastro",
      "dolciastro",
      "nuvolette",
      "cavallino",
      "gattino",
      "gattetto",
      "libretto",
      "casettina",
      "casinetta",
      "salutino"
     ]
    }
   },
   "ascolto": {
    "title": "Un nome per un gelato",
    "genre": "riunione di lavoro",
    "es": "Dos colegas de una agencia de publicidad discuten qué nombre ponerle a una nueva línea de helados artesanales.",
    "speakers": [
     "Giulia, copywriter",
     "Andrea, responsabile marketing"
    ],
    "turns": [
     [
      "A",
      "Allora, Andrea, ti ho preparato la lista dei nomi per la gelateria dei signori Rossetti. Te la leggo o preferisci vederla?"
     ],
     [
      "B",
      "Leggimela, dai, così sento anche come suonano. Il nome di un gelato deve suonare bene, prima ancora di significare qualcosa."
     ],
     [
      "A",
      "Giusto. Il primo è «Nuvoletta». Pensavo alla leggerezza, alla panna, a qualcosa di morbido."
     ],
     [
      "B",
      "Carino. Forse un po' troppo carino, però. Mi fa pensare a una linea per bambini, e il cliente vuole anche un pubblico adulto, gente che passa la sera dopo cena."
     ],
     [
      "A",
      "Ci avevo pensato anch'io. E un nome in inglese? Ormai lo fanno tutti."
     ],
     [
      "B",
      "Ecco, proprio perché lo fanno tutti, io lo eviterei. I Rossetti fanno gelato artigianale con il latte delle colline qui intorno: un nome inglese li farebbe sembrare una catena da aeroporto. E poi l'italiano, con i suoi suffissi, ci dà una tavolozza che l'inglese non ha. Con una sola parola puoi dire piccolo, affettuoso, un po' goloso, un po' ironico."
     ],
     [
      "A",
      "Hai ragione, è la nostra arma segreta. Allora vado avanti, e «Nuvoletta» per ora la tengo come riserva. Il secondo è «Golosone». Qui l'idea è opposta: abbondanza, voglia di esagerare, il piacere senza sensi di colpa."
     ],
     [
      "B",
      "Questo mi piace di più, ha un tono simpatico, un po' ironico. Il suffisso fa subito pensare a una persona grande e bonaria, uno che si concede una coppetta in più. Però c'è un rischio."
     ],
     [
      "A",
      "Quale?"
     ],
     [
      "B",
      "Che qualcuno lo senta come una presa in giro. Sai, con tutta l'attenzione che c'è oggi sul peso, sulla linea… Se la cliente tipo si sente dare della golosona, magari se la prende."
     ],
     [
      "A",
      "Mah, secondo me è più affettuoso che offensivo. Comunque ti capisco. Il terzo è «Cremino», che però in alcune zone è già il nome di un cioccolatino, quindi forse no. E poi c'è la mia proposta preferita: «Freddino»."
     ],
     [
      "B",
      "Freddino? Non so. Suona un po' negativo, come quando dici «oggi fa freddino» e ti stringi nel cappotto."
     ],
     [
      "A",
      "Appunto! Il gioco è proprio quello: è il freddo piacevole, quello piccolo, che consola. Pensa a uno slogan tipo «Un freddino che scalda il cuore»."
     ],
     [
      "B",
      "Ecco, detta così comincia a funzionare. Il problema è che lo slogan lo devi spiegare, e un nome che ha bisogno delle istruzioni parte svantaggiato."
     ],
     [
      "A",
      "Allora facciamo così: nella lista finale lasciamo «Golosone» e «Freddino» e scartiamo «Nuvoletta» e «Cremino». D'accordo?"
     ],
     [
      "B",
      "D'accordo, ma aggiungerei un controllo. Prima di presentarli, verifichiamo che non esistano già marchi registrati con questi nomi, altrimenti ci facciamo una figuraccia."
     ],
     [
      "A",
      "Giustissimo, me ne occupo io domani mattina. E per le coppe? I Rossetti vogliono anche un nome per ogni formato."
     ],
     [
      "B",
      "Lì possiamo divertirci di più con gli alterati. Una coppa piccola può essere «la coccola», quella gigante «il coppone»… anzi no, coppone suona malissimo."
     ],
     [
      "A",
      "Suona quasi come un insulto, in effetti. E «coppetta» è troppo banale, la usano tutti. Ci penso stanotte e domani ti mando una proposta scritta."
     ],
     [
      "B",
      "Perfetto. Mandala anche alla direttrice, così venerdì la presentiamo ai clienti. E porta qualche campione di gelato, che aiuta sempre."
     ]
    ],
    "gloss": {
     "dare": "(si sente dare della golosona) le dicen golosa: *dare del / della* + adjetivo = tratar de",
     "morbido": "suave, esponjoso",
     "golosone": "golosazo",
     "bonaria": "bonachona",
     "coppetta": "vasito (de helado)",
     "presa": "presa in giro: burla, cargada",
     "stringi": "te acurrucás, te envolvés",
     "scalda": "calienta",
     "svantaggiato": "en desventaja",
     "scartiamo": "descartamos",
     "marchi": "marcas",
     "figuraccia": "papelón",
     "coccola": "mimo",
     "campione": "muestra",
     "tavolozza": "paleta (de colores)"
    },
    "questions": [
     [
      "Perché Andrea vuole sentire i nomi letti ad alta voce?",
      [
       "Perché non ha con sé gli occhiali",
       "Perché per lui il suono di un nome è fondamentale",
       "Perché vuole registrare la riunione",
       "Perché la lista non è ancora stata stampata per tutti"
      ],
      "Perché per lui il suono di un nome è fondamentale"
     ],
     [
      "Qual è il rischio di «Golosone», secondo Andrea?",
      [
       "Che sia difficile da pronunciare per i turisti",
       "Che faccia pensare solo a una linea per bambini",
       "Che qualche cliente lo senta come una presa in giro",
       "Che esista già come nome di un cioccolatino"
      ],
      "Che qualche cliente lo senta come una presa in giro"
     ],
     [
      "Perché viene scartato «Cremino»?",
      [
       "Perché in alcune zone indica già un dolce",
       "Perché al cliente non piace la crema",
       "Perché suona troppo simile a «Freddino»",
       "Perché Andrea lo trova troppo infantile"
      ],
      "Perché in alcune zone indica già un dolce"
     ],
     [
      "Che cosa pensa Andrea di «Freddino» alla fine della discussione?",
      [
       "Che è perfetto così com'è e non va toccato",
       "Che è troppo simile a «Nuvoletta»",
       "Che è offensivo per una parte dei clienti",
       "Che funziona con lo slogan, ma va spiegato"
      ],
      "Che funziona con lo slogan, ma va spiegato"
     ],
     [
      "Che cosa faranno prima di presentare i nomi ai clienti?",
      [
       "Un sondaggio tra i clienti della gelateria",
       "Una prova di assaggio con i gusti nuovi",
       "Un controllo sui marchi già registrati",
       "Una riunione con i signori Rossetti"
      ],
      "Un controllo sui marchi già registrati"
     ]
    ],
    "vf": [
     [
      "Il cliente vuole attirare anche un pubblico adulto.",
      "vero"
     ],
     [
      "Giulia considera «Golosone» un nome offensivo.",
      "falso"
     ],
     [
      "I Rossetti hanno già deciso i gusti della nuova linea.",
      "non si dice"
     ],
     [
      "La proposta sarà presentata ai clienti venerdì.",
      "vero"
     ]
    ]
   },
   "compito": {
    "genre": "relazione",
    "title": "Relazione sulla riunione per il nome della linea di gelati",
    "fonte": "ascolto",
    "t": "Lavori nell'agenzia pubblicitaria di Giulia e Andrea e hai assistito alla riunione sul nome della nuova linea di gelati dei signori Rossetti. La direttrice, che non era presente, ti chiede una breve relazione scritta (222-282 parole, registro formale) in cui riassumi le proposte discusse con i loro vantaggi e svantaggi, spieghi quali nomi sono stati scartati e perché, indichi quale nome raccomandi tu motivando la scelta e ricordi i prossimi passi decisi.",
    "es": "Informe interno formal para la directora: resumí las propuestas con pros y contras (fijate en qué aporta cada sufijo), decí qué se descartó y por qué, recomendá un nombre y cerrá con los próximos pasos.",
    "min": 222,
    "max": 282,
    "punti": [
     [
      "resumir las propuestas",
      [
       "golosone",
       "freddino",
       "nuvoletta"
      ]
     ],
     [
      "explicar lo descartado y por qué",
      [
       "scartat",
       "esclus"
      ]
     ],
     [
      "recomendar un nombre con argumentos",
      [
       "raccomand",
       "consigli",
       "propong"
      ]
     ],
     [
      "próximos pasos",
      [
       "marchi",
       "registrat",
       "venerdì",
       "prossim"
      ]
     ]
    ],
    "model": "Oggetto: nome della nuova linea di gelati Rossetti\n\nGentile direttrice,\n\ndi seguito riassumo la riunione di ieri tra Giulia, copywriter, e Andrea, responsabile marketing, dedicata alla scelta del nome per la nuova linea di gelati dei signori Rossetti.\n\nGiulia ha presentato quattro proposte. «Nuvoletta», che evoca leggerezza e morbidezza, è stata giudicata graziosa ma troppo infantile per un cliente che vuole attirare anche un pubblico adulto. «Cremino» è stato scartato perché in alcune zone è già il nome di un cioccolatino. Restano quindi due candidati. «Golosone» ha un tono simpatico e ironico, e l'accrescitivo trasmette abbondanza e piacere; secondo Andrea, però, alcuni clienti potrebbero sentirlo come una presa in giro legata al peso. «Freddino», che Giulia interpreta come un «freddo piccolo e piacevole», è originale, ma rischia di sembrare negativo e funziona soprattutto accompagnato da uno slogan, come «Un freddino che scalda il cuore».\n\nPersonalmente raccomando «Freddino»: il diminutivo è affettuoso, non offende nessuno e si presta bene a una campagna costruita sul contrasto tra freddo e calore. Il fatto che richieda una spiegazione mi sembra un rischio accettabile, dato che il nome comparirebbe sempre insieme allo slogan.\n\nQuanto ai prossimi passi, Giulia verificherà che i due nomi non siano già marchi registrati e preparerà una proposta scritta per i nomi dei diversi formati di coppa. Il materiale Le sarà inviato in tempo per la presentazione ai clienti di venerdì.\n\nCordiali saluti,\nPaolo Neri",
    "gloss": {
     "graziosa": "linda, simpática",
     "scartato": "descartado",
     "una presa in giro": "una cargada, una burla",
     "si presta bene a": "se presta bien para",
     "marchi registrati": "marcas registradas",
     "Quanto ai": "en cuanto a los",
     "coppa": "vasito, copa (de helado)"
    }
   },
   "breve": {
    "title": "Piccolissimi, la nuova linea",
    "genre": "pubblicità radiofonica",
    "es": "La publicidad radial de una heladería que lanza helados en tamaño mini.",
    "speaker": "Voce della pubblicità",
    "voice": 1,
    "text": [
     "Una pausetta? Un momentino tutto per te? Da Gelateria Bianchi arriva «Piccolissimi»: la nuova linea di gelati in coppetta mini, quattro gusti in una sola vaschetta, per chi vuole assaggiare tutto senza esagerare.",
     "Pistacchio di Bronte, nocciola del Piemonte, fragolina di bosco e il nostro famoso cioccolatone fondente, fatto con cacao al settanta per cento. Solo ingredienti naturali, senza coloranti.",
     "E per i più golosi c'è il «Gelatone della domenica»: una coppa da mezzo chilo con panna e biscottini, da dividere in famiglia, a dodici euro.",
     "Solo per il mese di giugno, presentando questo annuncio alla cassa, la seconda coppetta costa la metà. Gelateria Bianchi, in piazza Garibaldi, aperta tutti i giorni fino a mezzanotte. Piccoli gelati, grandi sorrisi."
    ],
    "tabella": [
     [
      "Nome della nuova linea",
      "Piccolissimi",
      []
     ],
     [
      "Percentuale di cacao del cioccolato",
      "70",
      [
       "settanta",
       "70%",
       "settanta per cento"
      ]
     ],
     [
      "Peso della coppa della domenica",
      "mezzo chilo",
      [
       "500 grammi",
       "mezzo kg",
       "0,5 kg",
       "500 g"
      ]
     ],
     [
      "Prezzo della coppa della domenica (euro)",
      "12",
      [
       "dodici"
      ]
     ],
     [
      "Ora di chiusura della gelateria",
      "mezzanotte",
      [
       "a mezzanotte",
       "24",
       "le 24",
       "fino a mezzanotte"
      ]
     ]
    ],
    "info": [
     [
      "Nella coppetta mini ci sono quattro gusti.",
      true
     ],
     [
      "I gelati contengono coloranti.",
      false
     ],
     [
      "La coppa grande è pensata per una famiglia.",
      true
     ],
     [
      "L'offerta vale per tutta l'estate.",
      false
     ],
     [
      "Con l'annuncio la seconda coppetta costa la metà.",
      true
     ],
     [
      "La gelateria è chiusa la domenica.",
      false
     ]
    ],
    "gloss": {
     "vaschetta": "potecito",
     "assaggiare": "probar",
     "golosi": "golosos",
     "cassa": "caja"
    }
   }
  },
  {
   "week": 47,
   "level": "C1",
   "lettura": {
    "title": "Affitti, a Monteverde un monolocale costa il doppio di cinque anni fa",
    "emoji": "📊",
    "genre": "articolo di cronaca economica",
    "grammar": "numerali, misure e quantità",
    "text": "Trentacinque metri quadri, un angolo cottura, un bagno senza finestra e un canone di 780 euro al mese, spese escluse. È l'annuncio che Federica, ventitré anni, studentessa fuorisede di Ingegneria, ha trovato dopo quasi tre mesi di ricerche. «Ne avrò visti una cinquantina», racconta. «La metà erano già affittati quando chiamavo, e un quarto dei proprietari chiedeva sei mensilità di anticipo.» Alla fine ha rinunciato e oggi divide con altre due ragazze un trilocale in periferia, a quaranta minuti di autobus dalla facoltà.\n\nIl caso di Federica non è un'eccezione. Secondo il rapporto presentato ieri dall'Osservatorio sulla casa dell'Università di Monteverde, negli ultimi cinque anni il canone medio di un monolocale in centro è quasi raddoppiato, passando da circa 410 a 790 euro. Nello stesso periodo i redditi delle famiglie sono cresciuti, in termini reali, di appena il 3 per cento. Tradotto: se nel 2021 per affittare un piccolo appartamento bastava un terzo di uno stipendio medio, oggi ne servono quasi due terzi.\n\nLe cause, spiega il rapporto, sono molteplici. La prima è la crescita degli affitti brevi: gli alloggi offerti sulle piattaforme turistiche sono passati in cinque anni da poco più di seicento a oltre duemilacento, cioè più che triplicati. Nel centro storico, ormai, quasi un appartamento su cinque è destinato ai turisti. La seconda è il numero degli studenti, aumentato di circa il 15 per cento grazie ai nuovi corsi in lingua inglese: una buona notizia per l'ateneo, meno per chi cerca casa. La terza, meno visibile, riguarda gli immobili vuoti: secondo le stime dell'Osservatorio, in città ci sarebbero tra i tremila e i quattromila appartamenti sfitti, spesso perché i proprietari temono inquilini morosi o non hanno i soldi per ristrutturarli.\n\nNon sono soltanto gli studenti a pagarne le conseguenze. Infermieri, insegnanti precari, giovani coppie: il rapporto segnala che, tra i nuovi assunti dell'ospedale cittadino, circa un quarto ha rinunciato al posto o ha chiesto il trasferimento entro un anno, citando proprio il costo della casa. E chi resta si sposta sempre più lontano: negli ultimi tre anni i comuni della cintura, nel raggio di una ventina di chilometri, hanno visto crescere i residenti di quasi il 6 per cento, mentre il centro storico ne ha persi circa un migliaio.\n\nLa questione è ormai diventata politica. Il sindaco, al secondo mandato, ha annunciato un piano da 12 milioni di euro in tre anni: un milione e mezzo per incentivare i proprietari ad affittare a canone concordato, sei milioni per recuperare centoventi alloggi pubblici inutilizzati e il resto per costruire uno studentato da duecentocinquanta posti letto nell'ex caserma di via Garibaldi. «Per la prima volta mettiamo sul tavolo risorse vere», ha dichiarato in consiglio comunale.\n\nL'opposizione, però, parla di numeri gonfiati. «Dodici milioni sembrano tanti, ma divisi per tre anni fanno quattro milioni all'anno, meno del 2 per cento del bilancio comunale», ha replicato la capogruppo della lista civica Monteverde Domani. «E lo studentato, se tutto va bene, aprirà tra quattro anni: nel frattempo migliaia di ragazzi continueranno a pagare cifre folli.» L'opposizione chiede invece un tetto agli affitti brevi, sul modello di altre città europee, limitando a novanta il numero di notti all'anno in cui un appartamento può essere affittato ai turisti.\n\nDall'altra parte, le associazioni dei proprietari respingono l'idea. «Chi affitta ai turisti non è uno speculatore, ma spesso una famiglia che integra la pensione», sostiene il presidente della sezione locale. Secondo i loro calcoli, un appartamento di sessanta metri quadri affittato ai turisti rende in media il doppio di uno affittato a lungo termine, e con meno rischi: «Se un inquilino smette di pagare, per sfrattarlo servono in media diciotto mesi. Chi se lo può permettere?»\n\nTra le due posizioni, il rapporto dell'Osservatorio suggerisce una strada intermedia. Gli autori propongono di combinare un limite moderato agli affitti brevi, concentrato nelle zone più richieste, con una garanzia pubblica per i proprietari che affittano a studenti e giovani lavoratori: un fondo che copra fino a dodici mensilità in caso di mancato pagamento. Secondo le loro simulazioni, se anche solo un decimo degli appartamenti sfitti tornasse sul mercato, i canoni potrebbero scendere tra il 5 e l'8 per cento in due anni. Non una rivoluzione, ammettono, ma un primo passo.\n\nFederica, intanto, fa i conti. Tra affitto, bollette e abbonamento all'autobus, spende circa seicento euro al mese, più della metà di quello che guadagna lavorando nei fine settimana in un bar. «I miei genitori mi aiutano, ma non so per quanto ancora», dice. Il consiglio comunale discuterà il piano del sindaco il prossimo 14 ottobre. Per migliaia di studenti come lei, quella seduta vale più di qualunque esame.",
    "gloss": {
     "pagarne": "(non sono soltanto gli studenti a pagarne) no son solo los estudiantes los que lo pagan (semana 48)",
     "canone": "alquiler (el monto mensual)",
     "fuorisede": "que estudia lejos de su ciudad",
     "mensilità": "meses (de alquiler), mensualidades",
     "trilocale": "departamento de tres ambientes",
     "redditi": "ingresos",
     "stipendio": "sueldo",
     "alloggi": "viviendas",
     "ateneo": "universidad",
     "immobili": "inmuebles",
     "sfitti": "desocupados, sin alquilar",
     "morosi": "que no pagan, morosos",
     "ristrutturarli": "refaccionarlos",
     "assunti": "contratados",
     "cintura": "conurbano, alrededores",
     "sindaco": "intendente",
     "studentato": "residencia estudiantil",
     "caserma": "cuartel",
     "gonfiati": "inflados",
     "capogruppo": "jefa de bloque",
     "tetto": "tope, límite",
     "respingono": "rechazan",
     "rende": "rinde, deja ganancia",
     "sfrattarlo": "desalojarlo",
     "bollette": "facturas (de luz, gas)",
     "abbonamento": "abono",
     "seduta": "sesión"
    },
    "questions": [
     [
      "Che cosa significa che oggi, per affittare un piccolo appartamento, «ne servono quasi due terzi»?",
      [
       "Che due studenti su tre non riescono a trovare casa",
       "Che l'affitto assorbe quasi due terzi di uno stipendio medio",
       "Che gli affitti sono aumentati di due terzi in un anno",
       "Che due terzi degli alloggi si trovano in centro"
      ],
      "Che l'affitto assorbe quasi due terzi di uno stipendio medio"
     ],
     [
      "Qual è l'idea principale dell'articolo?",
      [
       "Gli studenti fuorisede preferiscono vivere in periferia",
       "Il sindaco ha risolto la crisi con un piano ambizioso",
       "Gli affitti crescono molto più dei redditi e la politica si divide",
       "Gli affitti brevi sono l'unica causa del caro casa"
      ],
      "Gli affitti crescono molto più dei redditi e la politica si divide"
     ],
     [
      "Perché l'opposizione giudica insufficiente il piano del sindaco?",
      [
       "Perché la somma annuale è modesta e lo studentato arriverà tardi",
       "Perché i fondi finiscono tutti nelle tasche dei proprietari privati",
       "Perché lo studentato sorgerà lontano dal centro della città",
       "Perché il piano prevede di vendere gli alloggi pubblici"
      ],
      "Perché la somma annuale è modesta e lo studentato arriverà tardi"
     ],
     [
      "Come giustificano i proprietari la loro preferenza per gli affitti brevi?",
      [
       "Con l'obbligo di pagare meno tasse",
       "Con la richiesta dei turisti stranieri",
       "Con il divieto di affittare agli studenti",
       "Con una rendita maggiore e meno rischi"
      ],
      "Con una rendita maggiore e meno rischi"
     ],
     [
      "Qual è l'atteggiamento dell'Osservatorio?",
      [
       "Sostiene senza riserve la posizione del sindaco",
       "Chiede di vietare del tutto gli affitti ai turisti",
       "Propone una soluzione intermedia e prudente",
       "Ritiene che il mercato si correggerà da solo"
      ],
      "Propone una soluzione intermedia e prudente"
     ]
    ],
    "vf": [
     [
      "Federica vive attualmente da sola in un monolocale.",
      "falso"
     ],
     [
      "Il numero di alloggi turistici è più che triplicato in cinque anni.",
      "vero"
     ],
     [
      "Federica pensa di lasciare l'università se gli affitti non scendono.",
      "non si dice"
     ],
     [
      "Secondo l'Osservatorio, il ritorno sul mercato di un decimo degli sfitti potrebbe far scendere i canoni.",
      "vero"
     ],
     [
      "Per sfrattare un inquilino moroso servono in media dodici mesi.",
      "falso"
     ]
    ],
    "hunt": {
     "label": "Tocá los numerales escritos con letras (cardinales, fraccionarios, multiplicativos, colectivos)",
     "targets": [
      "trentacinque",
      "ventitré",
      "tre",
      "cinquantina",
      "metà",
      "quarto",
      "sei",
      "due",
      "quaranta",
      "cinque",
      "raddoppiato",
      "terzo",
      "terzi",
      "seicento",
      "duemilacento",
      "triplicati",
      "tremila",
      "quattromila",
      "ventina",
      "migliaio",
      "milione",
      "mezzo",
      "milioni",
      "centoventi",
      "duecentocinquanta",
      "dodici",
      "quattro",
      "migliaia",
      "novanta",
      "sessanta",
      "doppio",
      "diciotto",
      "decimo"
     ]
    }
   },
   "ascolto": {
    "title": "Difendersi dai numeri",
    "genre": "rubrica radiofonica",
    "es": "En un programa de radio sobre economía cotidiana, el conductor conversa con una periodista económica sobre cómo leer los números que aparecen en las noticias.",
    "speakers": [
     "Conduttore",
     "Giornalista economica"
    ],
    "turns": [
     [
      "A",
      "Buongiorno e bentrovati a «Conti in tasca». Come ogni giovedì, c'è con noi Anna Russo, giornalista economica, che oggi ci aiuta a difenderci dai numeri. Anna, detta così sembra quasi una battuta."
     ],
     [
      "B",
      "Un po' lo è, ma solo un po'. I numeri nei giornali sono utilissimi, però vanno letti con attenzione. Spesso non mentono, ma raccontano solo una parte della storia."
     ],
     [
      "A",
      "Partiamo da un esempio concreto."
     ],
     [
      "B",
      "Allora, prendiamo un titolo che si vede spesso: «La disoccupazione giovanile scende dal 20 al 18 per cento: calo del 2 per cento». Ecco, questo è sbagliato."
     ],
     [
      "A",
      "Perché? Da venti a diciotto sono due."
     ],
     [
      "B",
      "Sono due punti percentuali, non due per cento. Se vuoi calcolare di quanto è diminuita in proporzione, due su venti fa il dieci per cento. Quindi il calo è del dieci per cento, oppure di due punti. Sembra un dettaglio da pignoli, ma cambia completamente la percezione."
     ],
     [
      "A",
      "E i giornalisti lo sanno?"
     ],
     [
      "B",
      "Molti sì, qualcuno meno. E poi c'è chi lo sa benissimo e sceglie la formula che fa più effetto. Se vuoi un titolo drammatico, dici «aumento del cinquanta per cento». Se vuoi tranquillizzare, dici «più due punti». E magari è lo stesso identico dato."
     ],
     [
      "A",
      "Cioè?"
     ],
     [
      "B",
      "Cioè: se un rischio passa dal quattro al sei per cento, è aumentato di due punti, ma in termini relativi è cresciuto della metà. Tutte e due le frasi sono vere. Il lettore, però, reagisce in modo molto diverso."
     ],
     [
      "A",
      "Mi viene in mente anche il problema delle cifre enormi. Quando sento «tre miliardi», onestamente, non ho la minima idea se siano tanti o pochi."
     ],
     [
      "B",
      "Ed è normalissimo, il nostro cervello non è fatto per immaginare un miliardo. Il trucco è rapportare la cifra a qualcosa di concreto, per esempio dividerla per il numero degli abitanti. Tre miliardi, in un paese di sessanta milioni di persone, fanno cinquanta euro a testa. Detto così, uno capisce subito di che cosa stiamo parlando."
     ],
     [
      "A",
      "Passiamo a un'altra parola che si sente ovunque: la media."
     ],
     [
      "B",
      "Ah, la media è la mia preferita. Facciamo un esperimento mentale: in un bar ci sono dieci persone che guadagnano millecinquecento euro al mese. Entra un calciatore famoso. Il reddito medio del bar schizza a decine di migliaia di euro, ma nessuno dei dieci è diventato più ricco."
     ],
     [
      "A",
      "Quindi la media inganna."
     ],
     [
      "B",
      "Può ingannare, soprattutto quando i valori sono molto squilibrati, come i redditi o i prezzi delle case. Per questo gli economisti usano spesso la mediana, cioè il valore che sta esattamente a metà: metà delle persone guadagna di più, metà di meno. È meno spettacolare, ma più onesta."
     ],
     [
      "A",
      "Un consiglio pratico per chi ci ascolta e domani apre il giornale?"
     ],
     [
      "B",
      "Tre domande, sempre. Primo: rispetto a che cosa? Un aumento del trenta per cento non dice niente se non so da dove si parte. Secondo: chi ha prodotto il dato, e perché? Terzo: su quante persone? Un sondaggio fatto su duecento persone non vale quanto uno fatto su diecimila."
     ],
     [
      "A",
      "Rispetto a che cosa, chi e su quanti. Me lo scrivo."
     ],
     [
      "B",
      "Scriviamocelo tutti, anche noi giornalisti. Io per prima."
     ],
     [
      "A",
      "Grazie, Anna. Ci sentiamo giovedì prossimo, sempre qui."
     ]
    ],
    "gloss": {
     "bentrovati": "bienvenidos de nuevo",
     "disoccupazione": "desempleo",
     "calo": "baja, descenso",
     "pignoli": "quisquillosos",
     "rapportare": "relacionar, comparar",
     "calciatore": "futbolista",
     "schizza": "se dispara",
     "inganna": "engaña",
     "squilibrati": "muy dispares",
     "sondaggio": "encuesta"
    },
    "questions": [
     [
      "Qual è il messaggio principale di Anna?",
      [
       "I numeri sui giornali sono quasi sempre falsi",
       "Solo gli economisti riescono a capire i dati",
       "I numeri vanno interpretati perché raccontano solo una parte",
       "I giornalisti dovrebbero evitare del tutto di usare le percentuali"
      ],
      "I numeri vanno interpretati perché raccontano solo una parte"
     ],
     [
      "Qual è l'errore nel titolo sulla disoccupazione giovanile?",
      [
       "Confonde punti percentuali e variazione percentuale",
       "Usa i dati di un anno diverso da quello indicato nel titolo",
       "Parla di giovani invece che di adulti",
       "Arrotonda troppo le cifre reali"
      ],
      "Confonde punti percentuali e variazione percentuale"
     ],
     [
      "Se un rischio passa dal 4 al 6 per cento, secondo Anna…",
      [
       "è aumentato del 2 per cento rispetto al valore iniziale",
       "è raddoppiato",
       "è aumentato di due punti, cioè della metà",
       "è aumentato di sei punti"
      ],
      "è aumentato di due punti, cioè della metà"
     ],
     [
      "A che cosa serve l'esempio del calciatore nel bar?",
      [
       "A criticare gli stipendi del calcio",
       "A mostrare che la media può deformare la realtà",
       "A spiegare come si calcola il reddito",
       "A dimostrare che i bar guadagnano molto"
      ],
      "A mostrare che la media può deformare la realtà"
     ],
     [
      "Quale delle domande consigliate da Anna riguarda l'affidabilità della fonte?",
      [
       "Rispetto a che cosa?",
       "Su quante persone?",
       "Quando è uscito il dato?",
       "Chi ha prodotto il dato, e perché?"
      ],
      "Chi ha prodotto il dato, e perché?"
     ]
    ],
    "vf": [
     [
      "Anna partecipa al programma ogni settimana.",
      "vero"
     ],
     [
      "Secondo Anna, tutti i giornalisti conoscono la differenza tra punti e percentuali.",
      "falso"
     ],
     [
      "Anna ha scritto un libro sull'uso dei numeri nei media.",
      "non si dice"
     ],
     [
      "La mediana è il valore che divide a metà un insieme di dati.",
      "vero"
     ]
    ]
   },
   "compito": {
    "genre": "sintesi",
    "title": "La crisi degli affitti a Monteverde in sintesi",
    "fonte": "lettura",
    "t": "Il consiglio comunale di Monteverde discuterà il piano per la casa il 14 ottobre. L'associazione studentesca di cui fai parte ti chiede di scrivere per il suo sito una sintesi dell'articolo «Affitti, a Monteverde un monolocale costa il doppio di cinque anni fa» (227-287 parole, registro neutro e informativo). La sintesi deve presentare in modo chiaro i dati principali, le cause individuate dal rapporto, le posizioni del sindaco, dell'opposizione e dei proprietari e la proposta dell'Osservatorio. Riporta le cifre con precisione e non aggiungere opinioni personali.",
    "es": "Resumen informativo, sin opinión: reorganizá con tus palabras los datos, las causas, las posiciones y la propuesta. Cuidá que las cifras sean exactas y variá la forma de decirlas (el doble, un tercio, una decina…).",
    "min": 227,
    "max": 287,
    "punti": [
     [
      "datos principales de los alquileres",
      [
       "raddopp",
       "790",
       "doppio",
       "due terzi"
      ]
     ],
     [
      "causas",
      [
       "affitti brevi",
       "caus",
       "sfitti"
      ]
     ],
     [
      "posiciones políticas",
      [
       "sindaco",
       "opposizione",
       "proprietari"
      ]
     ],
     [
      "propuesta del Observatorio",
      [
       "osservatorio",
       "fondo",
       "garanzia"
      ]
     ]
    ],
    "model": "Affitti a Monteverde: i numeri della crisi e le proposte in discussione\n\nSecondo il rapporto dell'Osservatorio sulla casa dell'Università di Monteverde, in cinque anni il canone medio di un monolocale in centro è quasi raddoppiato, passando da circa 410 a 790 euro, mentre i redditi reali sono cresciuti solo del 3 per cento. Se nel 2021 bastava un terzo di uno stipendio medio, oggi ne servono quasi due terzi.\n\nIl rapporto individua tre cause: gli affitti brevi, più che triplicati fino a oltre duemilacento alloggi; la crescita di circa il 15 per cento degli studenti; la presenza di tre-quattromila appartamenti sfitti. Le conseguenze non riguardano solo gli studenti: un quarto dei nuovi assunti dell'ospedale ha rinunciato al posto o chiesto il trasferimento.\n\nIl sindaco ha presentato un piano da 12 milioni in tre anni, con incentivi per il canone concordato, il recupero di centoventi alloggi pubblici e uno studentato da duecentocinquanta posti. L'opposizione lo giudica insufficiente, perché equivale a meno del 2 per cento del bilancio annuale e lo studentato non sarà pronto prima di quattro anni; chiede quindi di limitare gli affitti turistici a novanta notti all'anno. Le associazioni dei proprietari respingono la proposta: gli affitti brevi renderebbero il doppio e comporterebbero meno rischi, dato che uno sfratto richiede in media diciotto mesi.\n\nL'Osservatorio suggerisce una via di mezzo: un limite moderato agli affitti brevi nelle zone più richieste e un fondo pubblico di garanzia fino a dodici mensilità. Se tornasse sul mercato anche solo un decimo degli sfitti, i canoni potrebbero calare del 5-8 per cento in due anni.\n\nIl piano sarà discusso in consiglio il 14 ottobre.",
    "gloss": {
     "canone": "el monto del alquiler",
     "monolocale": "monoambiente",
     "sfitti": "vacíos, sin alquilar",
     "nuovi assunti": "empleados recién contratados",
     "canone concordato": "alquiler a precio acordado por convenio (más bajo, con beneficios fiscales)",
     "studentato": "residencia estudiantil",
     "sfratto": "desalojo",
     "mensilità": "meses de alquiler, mensualidades"
    }
   },
   "breve": {
    "title": "Notiziario economico delle sette",
    "genre": "notiziario radiofonico",
    "es": "El boletín económico de la mañana: inflación, hipotecas, una residencia estudiantil y la Bolsa.",
    "speaker": "Giornalista economica",
    "voice": 1,
    "text": [
     "Notiziario economico delle sette. Secondo i dati diffusi ieri dall'Istat, a settembre l'inflazione è scesa all'uno virgola otto per cento, contro il due virgola tre del mese precedente. Calano soprattutto i prezzi dell'energia, mentre gli alimentari restano cari: più tre per cento in un anno.",
     "Mutui: il tasso medio per l'acquisto della prima casa è sceso sotto il tre per cento per la prima volta da due anni. Secondo le associazioni dei consumatori, su un mutuo di centocinquantamila euro in venticinque anni si risparmiano circa quaranta euro al mese.",
     "A Monteverde il nuovo studentato nell'ex caserma di via Garibaldi offrirà duecentocinquanta posti letto; i lavori, finanziati con sei milioni di euro, dovrebbero partire a gennaio.",
     "In Borsa, apertura in lieve rialzo: Milano guadagna lo zero virgola quattro per cento."
    ],
    "tabella": [
     [
      "Inflazione di settembre (%)",
      "1,8",
      [
       "1.8",
       "uno virgola otto",
       "1,8%"
      ]
     ],
     [
      "Aumento degli alimentari in un anno (%)",
      "3",
      [
       "tre",
       "+3",
       "3%",
       "piu tre"
      ]
     ],
     [
      "Risparmio al mese sul mutuo (euro)",
      "40",
      [
       "quaranta",
       "circa 40",
       "circa quaranta"
      ]
     ],
     [
      "Posti letto dello studentato",
      "250",
      [
       "duecentocinquanta"
      ]
     ],
     [
      "Mese di inizio dei lavori",
      "gennaio",
      [
       "a gennaio"
      ]
     ]
    ],
    "info": [
     [
      "L'inflazione è salita rispetto al mese precedente.",
      false
     ],
     [
      "I prezzi dell'energia sono in calo.",
      true
     ],
     [
      "Il tasso dei mutui è sotto il tre per cento.",
      true
     ],
     [
      "Lo studentato costerà dodici milioni.",
      false
     ],
     [
      "La Borsa di Milano apre in calo.",
      false
     ],
     [
      "I prezzi degli alimentari restano alti.",
      true
     ]
    ],
    "gloss": {
     "mutui": "créditos hipotecarios",
     "tasso": "tasa",
     "studentato": "residencia estudiantil",
     "rialzo": "suba"
    }
   }
  },
  {
   "week": 48,
   "level": "C1",
   "lettura": {
    "title": "Il dialetto, i ragazzi lo parlano ancora (ma a modo loro)",
    "emoji": "🗣️",
    "genre": "inchiesta",
    "grammar": "ordine delle parole: dislocazioni e frase scissa",
    "text": "A Teresa, il dialetto, a scuola glielo avevano proibito. Era il 1950, in un paese dell'entroterra veneto, e la maestra puniva chi si lasciava scappare una parola «da contadini». Settant'anni dopo, sua nipote Giorgia, diciannove anni, il dialetto lo usa nelle storie su Instagram, per far ridere gli amici. «Non lo parlo bene», ammette, «però certe cose in italiano non rendono. Un'espressione come quella che usava la nonna per dire che sei stanco morto, in italiano non l'ho mai trovata.» È da storie come la sua che è partita questa inchiesta: che fine ha fatto la varietà linguistica dell'Italia, a più di centocinquant'anni dall'Unità?\n\nLa risposta breve è che la varietà non è sparita: si è trasformata. Quando l'Italia fu unificata, l'italiano lo parlava soltanto una piccola minoranza della popolazione; per tutti gli altri, la lingua di casa era il dialetto. Sono stati la scuola, il servizio militare, le migrazioni interne e soprattutto la televisione a portare l'italiano in ogni casa. Oggi l'italiano lo parlano praticamente tutti, e il dialetto, chi lo usa, lo usa accanto all'italiano, non al suo posto. Ma l'italiano che parliamo non è uguale dappertutto.\n\n«Di italiani, in realtà, ce ne sono tanti», spiega la sociolinguista Marta Colonna, che da anni registra conversazioni in diverse città. «C'è l'italiano regionale, prima di tutto. Un milanese e un palermitano usano la stessa grammatica, ma la pronuncia, l'intonazione e una parte del lessico li tradiscono subito.» Il panino, a Roma, lo chiamano rosetta, a Milano michetta; e la gruccia per i vestiti, a seconda della regione, la si sente chiamare stampella, ometto o appendino. Non sono errori: sono italiani regionali, perfettamente legittimi.\n\nPoi ci sono le differenze sociali, che spesso contano quanto quelle geografiche. È nel modo di parlare dei giovani, per esempio, che nascono molte parole nuove, alcune destinate a sparire nel giro di un'estate, altre a entrare nei dizionari. E sono le persone più istruite, paradossalmente, quelle che si concedono più libertà nel parlato informale, perché sanno bene quando possono farlo. «Il registro non lo sceglie solo chi parla», osserva Colonna, «lo sceglie la situazione. Un avvocato con i clienti parla in un modo, con gli amici allo stadio in un altro. Chi sa fare questo passaggio ha una competenza linguistica ricchissima.»\n\nAnche la grammatica si muove. Frasi come «Il caffè lo prendo amaro» o «Di questa storia non ne voglio più sentir parlare», le maestre di una volta le avrebbero sottolineate in rosso. Oggi, invece, si sentono in televisione e si leggono sui giornali, e molti linguisti le considerano parte di un italiano «neostandard», più vicino al parlato. La dislocazione serve a mettere in primo piano ciò di cui si sta parlando: quando dico «Il caffè lo prendo amaro», il tema è il caffè, e il resto è l'informazione nuova. Qualcosa di simile fa la frase scissa: dicendo «È Giorgia che ha scritto il messaggio», sottolineo che è stata lei, e non un'altra persona.\n\nUn ruolo ambiguo, in tutto questo, l'hanno avuto i media. Se la televisione degli anni Cinquanta e Sessanta ha insegnato l'italiano a milioni di persone, quella di oggi, insieme ai social, sembra aver fatto il percorso inverso: gli accenti regionali, un tempo banditi dagli annunciatori, adesso si sentono ovunque, dai comici ai conduttori, dai cuochi ai calciatori. «Non è un impoverimento», sostiene Colonna. «È il segno che l'italiano, ormai, è sicuro di sé. E una lingua sicura di sé può permettersi di avere molte voci.»\n\nE il dialetto? Secondo le ricerche di Colonna, i giovani lo parlano meno dei loro nonni, ma lo usano in modo nuovo: nelle canzoni, nei meme, nei soprannomi, nelle chat di gruppo. «Non è più la lingua della vergogna, ma quella dell'identità e del gioco», dice. Ci sono rapper che il dialetto l'hanno portato in classifica, e scuole che, in certe regioni, organizzano laboratori per impararlo. Non tutti sono entusiasti: c'è chi teme che diventi una specie di folklore da cartolina, svuotato della ricchezza che aveva quando era la lingua di tutti i giorni.\n\nResta un lato meno luminoso. L'accento, soprattutto se meridionale, pesa ancora in certi contesti. Nella nostra inchiesta abbiamo raccolto decine di testimonianze di ragazzi che hanno cercato di nasconderlo per un colloquio di lavoro o che si sono sentiti correggere da un professore. «A Torino, il mio accento calabrese l'ho perso in sei mesi», racconta Salvatore, ventisei anni, ingegnere. «Nessuno me lo ha chiesto, ma sentivo che era meglio così. Adesso, quando torno a casa, mia madre mi prende in giro: dice che parlo come un telegiornale.»\n\nForse è questa la vera fotografia dell'Italia linguistica di oggi: un paese in cui l'italiano, finalmente, l'abbiamo imparato tutti, ma in cui ognuno lo parla con la voce del posto da cui viene. Il dialetto, Teresa non l'ha mai dimenticato. Giorgia lo sta riscoprendo a modo suo. Salvatore, in fondo, vorrebbe riprenderselo. Tre generazioni, tre rapporti diversi con la lingua di casa: nessuno sbagliato, tutti profondamente italiani.",
    "gloss": {
     "seconda": "(a seconda di) según",
     "fine": "(che fine ha fatto?) ¿qué fue de...?",
     "scappare": "(lasciarsi scappare) dejarse escapar, soltar sin querer",
     "entroterra": "interior (zona lejos de la costa)",
     "puniva": "castigaba",
     "contadini": "campesinos",
     "rendono": "non rendono: no quedan igual, pierden fuerza",
     "tradiscono": "delatan",
     "gruccia": "percha",
     "stampella": "percha (regional; también muleta)",
     "ometto": "percha (regional)",
     "appendino": "percha (regional)",
     "istruite": "instruidas, con estudios",
     "sottolineate": "subrayadas",
     "banditi": "prohibidos, desterrados",
     "annunciatori": "locutores",
     "impoverimento": "empobrecimiento",
     "soprannomi": "apodos",
     "vergogna": "vergüenza",
     "classifica": "ranking (de ventas)",
     "svuotato": "vaciado",
     "meridionale": "del sur de Italia",
     "testimonianze": "testimonios",
     "colloquio": "entrevista (de trabajo)",
     "riscoprendo": "redescubriendo",
     "riprenderselo": "recuperarlo"
    },
    "questions": [
     [
      "Qual è la tesi principale dell'inchiesta?",
      [
       "Il dialetto è ormai scomparso tra i giovani italiani",
       "La varietà linguistica si è trasformata, non è sparita",
       "L'italiano regionale è un errore da correggere a scuola",
       "La televisione ha cancellato ogni differenza linguistica"
      ],
      "La varietà linguistica si è trasformata, non è sparita"
     ],
     [
      "Perché l'autore cita rosetta e michetta?",
      [
       "Per mostrare che esiste un lessico regionale legittimo",
       "Per criticare il modo di parlare dei romani",
       "Per spiegare l'origine dialettale del pane",
       "Per dimostrare che i milanesi parlano meglio"
      ],
      "Per mostrare che esiste un lessico regionale legittimo"
     ],
     [
      "Secondo Colonna, chi ha una competenza linguistica molto ricca?",
      [
       "Chi parla sempre in modo formale, in ogni contesto",
       "Chi conosce e parla bene più di un dialetto",
       "Chi evita le parole nuove inventate dai giovani",
       "Chi sa adattare il registro alla situazione"
      ],
      "Chi sa adattare il registro alla situazione"
     ],
     [
      "A che cosa serve, secondo il testo, una frase come «Il caffè lo prendo amaro»?",
      [
       "A esprimere un dubbio",
       "A mettere in evidenza il tema",
       "A dare un ordine gentile",
       "A correggere chi ascolta"
      ],
      "A mettere in evidenza il tema"
     ],
     [
      "Perché Salvatore ha perso il suo accento?",
      [
       "Glielo aveva imposto il suo datore di lavoro",
       "Sentiva una pressione sociale non dichiarata",
       "Voleva lavorare come giornalista in televisione",
       "Glielo aveva consigliato sua madre"
      ],
      "Sentiva una pressione sociale non dichiarata"
     ]
    ],
    "vf": [
     [
      "Teresa a scuola poteva parlare liberamente in dialetto.",
      "falso"
     ],
     [
      "Giorgia parla il dialetto in modo fluente.",
      "falso"
     ],
     [
      "Marta Colonna insegna in un'università del Nord.",
      "non si dice"
     ],
     [
      "In alcune regioni ci sono scuole che organizzano laboratori di dialetto.",
      "vero"
     ],
     [
      "La madre di Salvatore scherza sul suo nuovo modo di parlare.",
      "vero"
     ]
    ],
    "hunt": {
     "label": "Tocá los pronombres combinados o apostrofados que retoman un elemento dislocado (A Teresa, il dialetto, glielo…; il dialetto l'hanno…)",
     "targets": [
      "glielo",
      "l'ho",
      "l'hanno",
      "l'abbiamo",
      "l'ha"
     ]
    }
   },
   "ascolto": {
    "title": "Stare o essere? Pausa caffè tra Nord e Sud",
    "genre": "conversazione tra colleghi",
    "es": "En la pausa del café, una colega de Milán y un colega de Nápoles comparan cómo hablan; a mitad de la charla se suma otro colega, romano. Conversación real: turnos cortos, interrupciones y muletillas.",
    "speakers": [
     "Chiara",
     "Gennaro",
     "Paolo"
    ],
    "turns": [
     [
      "A",
      "Gennaro, scusa, ma il caffè l'hai finito tu? La moka è vuota."
     ],
     [
      "B",
      "Sì, sono stato io… perdonami, te lo rifaccio subito. Però aspetta: hai detto «la moka»."
     ],
     [
      "A",
      "E come la chiamo?"
     ],
     [
      "B",
      "Noi a Napoli, a casa, diciamo «la macchinetta»."
     ],
     [
      "A",
      "Anche noi, a volte. Ma sai che cosa mi ha fatto ridere la prima settimana che sei arrivato?"
     ],
     [
      "B",
      "No, cosa?"
     ],
     [
      "A",
      "Quando mi hai chiesto se potevi «stare» un attimo nel mio ufficio."
     ],
     [
      "B",
      "E che c'è di strano? Stare, restare…"
     ],
     [
      "A",
      "Niente, ma io pensavo che volessi trasferirti da me! Noi diciamo «essere»: sono in ufficio, sono a casa. Voi dite «sto a casa»."
     ],
     [
      "C",
      "Buongiorno! Di che parlate?"
     ],
     [
      "A",
      "Paolo! Di Nord e Sud. Tu da che parte stai?"
     ],
     [
      "C",
      "Io? Io sono romano, sto in mezzo. Anche noi diciamo «sto a casa», eh."
     ],
     [
      "B",
      "Visto? E voi al Nord dite «la Giulia», «il Marco», con l'articolo davanti ai nomi. Per me la prima volta è stato uno shock. Mi sembrava che parlaste di oggetti."
     ],
     [
      "A",
      "Guarda che al Nord lo diciamo tutti, è normalissimo. Anzi, un nome senza articolo a me sembra freddo."
     ],
     [
      "B",
      "Vedi? È proprio questo il bello. Tu pensi che sia freddo, io penso che sia strano. E parliamo la stessa lingua…"
     ],
     [
      "C",
      "…teoricamente."
     ],
     [
      "A",
      "Teoricamente, sì. E poi ci sono le parole. Il primo giorno ti ho chiesto un appendino per il cappotto e tu mi hai guardata come se avessi parlato arabo."
     ],
     [
      "B",
      "Perché da noi si dice stampella! Solo che la stampella, per me, era anche quella per camminare, e mi sono pure preoccupato. Ho pensato: poverina, si è fatta male a una gamba e non lo vuole dire."
     ],
     [
      "C",
      "No, vabbè, bellissima."
     ],
     [
      "A",
      "Infatti avevi una faccia… Questi equivoci sono divertenti."
     ],
     [
      "B",
      "Divertentissimi, finché non capitano davanti al capo."
     ],
     [
      "A",
      "E poi, quando ti arrabbi al telefono con tua madre, io non capisco proprio niente."
     ],
     [
      "B",
      "Eh, quella è un'altra storia. Lì passo al napoletano. Con mia madre l'italiano non l'ho mai parlato, mi sembrerebbe di recitare. Tipo… come se mi mettessi la cravatta per andare a cena a casa sua."
     ],
     [
      "A",
      "Che bella questa immagine. A me invece il dialetto non l'hanno mai insegnato. I miei nonni lo parlavano tra di loro, ma con i nipoti no. Era considerato roba da vecchi, o da gente poco istruita."
     ],
     [
      "C",
      "Uguale a casa mia."
     ],
     [
      "B",
      "E ti dispiace?"
     ],
     [
      "A",
      "Un po' sì. Adesso che è tornato di moda mi sento esclusa. Mio fratello ha trovato un corso di milanese online e se l'è fatto tutto, ma io… boh, onestamente faccio fatica. Sembra un'altra lingua."
     ],
     [
      "B",
      "Perché è un'altra lingua! I dialetti non sono italiano storpiato, sono lingue sorelle, nate dal latino come l'italiano. Il napoletano ha una letteratura, un teatro, le canzoni che conosce tutto il mondo…"
     ],
     [
      "A",
      "Sì, sì, questo lo so. È che mi fa strano studiarlo a scuola come si studia l'inglese, con i verbi e gli esercizi."
     ],
     [
      "B",
      "Mah, secondo me è meglio di niente. È chi non fa niente che lo lascia morire."
     ],
     [
      "C",
      "Su questo ha ragione lui."
     ],
     [
      "A",
      "E l'accento? Ti hanno mai detto qualcosa, qui in ufficio?"
     ],
     [
      "B",
      "Qui no. Però a un colloquio, anni fa, in un'altra azienda, uno mi ha detto: «Simpatico il suo accento, ma con i clienti meglio neutralizzarlo»."
     ],
     [
      "C",
      "Ma dai!"
     ],
     [
      "B",
      "Giuro. L'ho presa male, lo confesso."
     ],
     [
      "A",
      "Ci credo. E tu l'hai neutralizzato?"
     ],
     [
      "B",
      "Macché. I clienti alla fine li ho conquistati proprio così, con la mia voce. Uno mi ha detto che al telefono gli mettevo allegria. Era la mia voce che vendeva, mica il prodotto."
     ],
     [
      "A",
      "Vedi che avevi ragione tu? Dai, la moka stavolta la faccio io, che tu il caffè lo carichi troppo."
     ],
     [
      "B",
      "Troppo? Da noi quello si chiama semplicemente caffè!"
     ]
    ],
    "gloss": {
     "presa": "(l'ho presa male) me lo tomé mal",
     "strano": "(mi fa strano) me resulta raro",
     "moka": "cafetera italiana",
     "macchinetta": "cafetera",
     "arrabbi": "te enojás",
     "recitare": "actuar (en teatro)",
     "roba": "cosa, asunto",
     "fatica": "faccio fatica: me cuesta",
     "storpiato": "deformado",
     "neutralizzarlo": "neutralizarlo, borrarlo",
     "macché": "¡qué va!",
     "allegria": "alegría",
     "carichi": "cargás",
     "equivoci": "malentendidos",
     "appendino": "percha (regional)",
     "vabbè": "(no, vabbè) ¡no, bueno!, ¡qué bueno! (muletilla)",
     "boh": "qué sé yo (muletilla)",
     "mica": "(mica il prodotto) no el producto, para nada",
     "tipo": "(muletilla) como, onda"
    },
    "questions": [
     [
      "Che cosa aveva sorpreso Chiara la prima settimana?",
      [
       "Che Gennaro portasse il caffè da Napoli",
       "Che Gennaro usasse «stare» al posto di «essere»",
       "Che Gennaro non conoscesse la parola «moka»",
       "Che Gennaro chiamasse sempre i colleghi per cognome"
      ],
      "Che Gennaro usasse «stare» al posto di «essere»"
     ],
     [
      "Che effetto fa a Chiara un nome proprio senza articolo?",
      [
       "Le sembra freddo",
       "Le sembra elegante",
       "Le sembra scorretto",
       "Le sembra antiquato"
      ],
      "Le sembra freddo"
     ],
     [
      "Perché Gennaro con sua madre parla in dialetto?",
      [
       "Perché sua madre non capisce bene l'italiano",
       "Perché parlarle in italiano gli sembrerebbe artificiale",
       "Perché al telefono il dialetto è più rapido",
       "Perché non vuole che i colleghi in ufficio capiscano cosa dice"
      ],
      "Perché parlarle in italiano gli sembrerebbe artificiale"
     ],
     [
      "Qual è l'atteggiamento di Chiara verso il dialetto milanese?",
      [
       "Totale indifferenza, non le interessa",
       "Grande entusiasmo, lo parla ogni giorno",
       "Un certo rimpianto, ma anche difficoltà",
       "Rifiuto, lo considera roba da vecchi"
      ],
      "Un certo rimpianto, ma anche difficoltà"
     ],
     [
      "Come ha reagito Gennaro al consiglio di neutralizzare l'accento?",
      [
       "L'ha seguito subito per ottenere il posto",
       "Ha lasciato l'azienda il giorno dopo",
       "Ci è rimasto male, ma ha tenuto il suo accento",
       "Ha chiesto aiuto a un insegnante di dizione"
      ],
      "Ci è rimasto male, ma ha tenuto il suo accento"
     ],
     [
      "Che cosa intende Paolo con «sto in mezzo»?",
      [
       "Che Roma è a metà tra le due parlate",
       "Che non vuole litigare con i colleghi",
       "Che la sua scrivania è al centro",
       "Che non ha ancora deciso dove vivere"
      ],
      "Che Roma è a metà tra le due parlate"
     ]
    ],
    "vf": [
     [
      "Gennaro ha finito il caffè della moka.",
      "vero"
     ],
     [
      "I nonni di Chiara parlavano il dialetto con i nipoti.",
      "falso"
     ],
     [
      "Il fratello di Chiara ha seguito un corso di milanese online.",
      "vero"
     ],
     [
      "Gennaro vorrebbe tornare a vivere a Napoli.",
      "non si dice"
     ]
    ]
   },
   "compito": {
    "genre": "articolo",
    "title": "Le lingue d'Italia spiegate a chi arriva",
    "fonte": "entrambi",
    "t": "La rivista online della tua scuola di lingue prepara un numero speciale sulle lingue d'Italia. Dopo aver letto l'inchiesta «Il dialetto, i ragazzi lo parlano ancora (ma a modo loro)» e ascoltato la conversazione tra Chiara e Gennaro, scrivi un articolo con un titolo (233-293 parole, registro medio) in cui spieghi ai lettori stranieri che cosa sono l'italiano regionale e i dialetti, riportando alcuni esempi presi dal testo e dall'audio, e rifletti sulla questione dell'accento nel mondo del lavoro. Puoi fare un confronto con le varietà dello spagnolo che conosci.",
    "es": "Artículo con título para una revista de estudiantes: explicá italiano regional y dialecto con ejemplos del texto y del audio, y opiná sobre el acento en el trabajo. Aprovechá alguna dislocación (il dialetto, lo…) o frase escindida (è lui che…).",
    "min": 233,
    "max": 293,
    "punti": [
     [
      "explicar italiano regional y dialectos",
      [
       "regional",
       "dialett"
      ]
     ],
     [
      "dar ejemplos del texto o del audio",
      [
       "michetta",
       "rosetta",
       "stare",
       "moka",
       "gennaro",
       "giorgia"
      ]
     ],
     [
      "reflexionar sobre el acento en el trabajo",
      [
       "accento"
      ]
     ],
     [
      "comparación con el español o conclusión",
      [
       "spagnolo",
       "argentin",
       "in conclusione",
       "insomma",
       "forse"
      ]
     ]
    ],
    "model": "L'italiano? Lo parliamo tutti, ma ognuno a modo suo\n\nChi arriva in Italia dopo aver studiato sui libri scopre presto una cosa: la lingua dei manuali, per strada, la si sente poco. Quello che si sente è l'italiano regionale, cioè un italiano con la stessa grammatica ovunque, ma con pronuncia, intonazione e parole che cambiano da una città all'altra.\n\nGli esempi sono tantissimi. Il panino, a Roma lo chiamano rosetta, a Milano michetta. Al Sud si dice «sto a casa», al Nord «sono a casa». E a Milano i nomi propri li usano con l'articolo, «la Giulia», cosa che a un napoletano sembra stranissima, come racconta Gennaro in una conversazione con la collega Chiara.\n\nPoi ci sono i dialetti, che non sono italiano «sbagliato», ma lingue sorelle nate dal latino. Per secoli sono stati la lingua di casa della maggior parte degli italiani. Oggi i giovani li parlano meno, ma li usano in modo nuovo: nelle canzoni, nei meme, nelle chat.\n\nC'è però un aspetto che mi ha colpito: l'accento. Secondo l'inchiesta, molti ragazzi del Sud cercano di nasconderlo per paura di essere giudicati, soprattutto nei colloqui di lavoro. Anche a Gennaro hanno consigliato di «neutralizzarlo». Eppure è proprio lui che dimostra il contrario: i clienti li ha conquistati con la sua voce.\n\nPer noi argentini la situazione è familiare. Un cordobés e un porteño si riconoscono subito, e anche da noi certi accenti fanno sorridere. Forse la lezione è proprio questa: una lingua viva non è mai uniforme. E l'accento, invece di nasconderlo, dovremmo imparare a rispettarlo.",
    "gloss": {
     "a modo suo": "a su manera",
     "la si sente poco": "se la escucha poco (la = la lengua, retomada con si impersonal)",
     "lingue sorelle": "lenguas hermanas",
     "colloqui di lavoro": "entrevistas de trabajo",
     "fanno sorridere": "causan gracia"
    }
   },
   "breve": {
    "title": "Il napoletano, parlalo con noi",
    "genre": "annuncio radiofonico",
    "es": "Un aviso de radio presenta un curso gratuito de napolitano para chicos en la biblioteca del barrio.",
    "speaker": "Voce dell'annuncio",
    "voice": 0,
    "text": [
     "Il napoletano lo capisci ma non lo parli? Le canzoni di tua nonna le sai a memoria, ma non sai che cosa vogliono dire? Allora il corso «Parla comme magne» fa per te.",
     "È la biblioteca di quartiere che lo organizza, insieme all'associazione Voci del Sud: otto incontri, il giovedì dalle diciotto alle diciannove e trenta, a partire dal 5 ottobre. A tenerlo sarà Gennaro Esposito, attore e autore di teatro.",
     "Non è una lezione di grammatica: si leggono poesie, si ascoltano canzoni, si guardano scene di film e, soprattutto, si parla. Il corso è gratuito ed è rivolto ai ragazzi dai quattordici ai venticinque anni; i posti, però, sono solo venti.",
     "Le iscrizioni si fanno in biblioteca o sul sito, entro il 30 settembre. E ricordate: il dialetto non si studia, si vive!"
    ],
    "tabella": [
     [
      "Giorno della settimana degli incontri",
      "giovedì",
      [
       "il giovedì"
      ]
     ],
     [
      "Numero di incontri",
      "8",
      [
       "otto"
      ]
     ],
     [
      "Nome dell'insegnante",
      "Gennaro Esposito",
      [
       "Gennaro",
       "Esposito"
      ]
     ],
     [
      "Età massima dei partecipanti",
      "25",
      [
       "venticinque",
       "25 anni"
      ]
     ],
     [
      "Posti disponibili",
      "20",
      [
       "venti"
      ]
     ]
    ],
    "info": [
     [
      "Il corso lo organizza la biblioteca con un'associazione.",
      true
     ],
     [
      "Nel corso si studia soprattutto la grammatica.",
      false
     ],
     [
      "Il corso costa cinquanta euro.",
      false
     ],
     [
      "Nel corso si ascoltano canzoni.",
      true
     ],
     [
      "Il corso è aperto agli adulti di tutte le età.",
      false
     ],
     [
      "Ci si può iscrivere anche sul sito.",
      true
     ]
    ],
    "gloss": {
     "parla comme magne": "«hablá como comés»: hablá simple, sin vueltas (en napolitano)",
     "iscrizioni": "inscripciones"
    }
   }
  },
  {
   "week": 49,
   "level": "C1",
   "lettura": {
    "title": "Votare a sedici anni: una proposta da prendere sul serio",
    "emoji": "🗳️",
    "genre": "editoriale",
    "grammar": "registro alto e connettivi testuali",
    "text": "Da qualche mese è tornata al centro del dibattito pubblico una proposta che, periodicamente, riaffiora per poi essere accantonata: estendere il diritto di voto ai sedicenni. Se ne discute nei talk show, nelle assemblee studentesche e, più sommessamente, nei corridoi del Parlamento. Le reazioni, com'era prevedibile, oscillano tra l'entusiasmo e lo scetticismo più radicale. Vale dunque la pena di esaminare con ordine gli argomenti in campo, senza cedere né alla retorica del «largo ai giovani» né a quella, altrettanto sterile, secondo cui «i ragazzi di oggi non sanno nulla».\n\nIl primo argomento a favore è di natura demografica. L'Italia è uno dei paesi più anziani d'Europa e, di conseguenza, il peso elettorale delle generazioni più giovani si è progressivamente ridotto. Ne consegue che le scelte politiche di lungo periodo, dal sistema pensionistico alla transizione ecologica, vengono prese in larga misura da chi ne subirà gli effetti per un tempo relativamente breve. Estendere il voto ai sedicenni, pertanto, non ribalterebbe gli equilibri, ma contribuirebbe quantomeno a correggere una rappresentanza oggi sbilanciata.\n\nIl secondo argomento riguarda la coerenza dell'ordinamento. A sedici anni, infatti, si può lavorare, si pagano in alcuni casi le tasse, si possono assumere responsabilità di rilievo. Appare pertanto contraddittorio che chi contribuisce alla vita economica del paese non abbia voce nelle decisioni che la regolano. D'altronde, alcuni paesi europei hanno già adottato questa soluzione, almeno per determinate elezioni, senza che si siano verificati gli scenari catastrofici paventati dagli oppositori.\n\nNon sarebbe, del resto, la prima volta che l'età del voto viene abbassata. Fino alla metà degli anni Settanta, in Italia, si diventava maggiorenni ed elettori a ventun anni; la riforma che portò la maggiore età a diciotto fu accolta, allora, con obiezioni sorprendentemente simili a quelle che si ascoltano oggi. Si diceva che i diciottenni fossero troppo influenzabili, troppo idealisti, troppo esposti alle mode del momento. A distanza di mezzo secolo, nessuno proporrebbe seriamente di tornare indietro. Il precedente, beninteso, non dimostra nulla di per sé; suggerisce tuttavia una certa prudenza nel considerare immutabili i confini della cittadinanza.\n\nCiononostante, le obiezioni meritano di essere considerate con serietà. La più diffusa sostiene che a sedici anni non si possieda ancora la maturità necessaria per compiere scelte consapevoli. Si tratta, tuttavia, di un argomento più fragile di quanto sembri: nessuno misura la maturità politica degli elettori adulti, e sarebbe difficile sostenere che l'età garantisca di per sé la competenza. Più solida appare, invece, la preoccupazione per il condizionamento: un adolescente che vive in famiglia, si osserva, rischierebbe di votare come i genitori, o di essere più esposto alla propaganda che circola sui social network.\n\nNeppure questa obiezione, peraltro, è priva di risposte. Alcuni studi condotti nei paesi che hanno abbassato l'età del voto suggeriscono, anzi, che chi vota per la prima volta mentre è ancora a scuola tende a mantenere l'abitudine al voto negli anni successivi, laddove chi comincia a votare in una fase di transizione, magari dopo essersi trasferito per studio o per lavoro, è più facilmente portato all'astensione. In altri termini, la scuola potrebbe diventare il luogo in cui si forma non soltanto il cittadino informato, ma anche l'elettore abituale. Quanto al rischio del condizionamento familiare, va osservato che esso non è affatto un'esclusiva dei giovanissimi: anche tra gli adulti, le appartenenze politiche si trasmettono spesso di generazione in generazione.\n\nNe deriva, tuttavia, una condizione imprescindibile. Qualora si decidesse di abbassare l'età del voto, sarebbe irresponsabile farlo senza un serio investimento nell'educazione civica. Non basta un'ora settimanale dedicata alla memorizzazione degli articoli della Costituzione: occorre insegnare a leggere un programma elettorale, a distinguere una fonte attendibile da una propaganda travestita da notizia, a confrontarsi con opinioni diverse senza trasformare ogni divergenza in uno scontro. Si tratta, in fondo, di competenze di cui avrebbero bisogno anche molti adulti.\n\nOccorre inoltre sgombrare il campo da un equivoco diffuso, secondo il quale i giovani sarebbero indifferenti alla cosa pubblica. Chiunque abbia assistito, negli ultimi anni, alle mobilitazioni studentesche sul clima o sul diritto allo studio sa che l'interesse non manca; manca, semmai, la fiducia nei canali tradizionali della partecipazione. Offrire il voto a chi oggi si esprime soprattutto nelle piazze e in rete potrebbe, dunque, rappresentare un modo per ricondurre quell'energia all'interno delle istituzioni, anziché lasciarla disperdere nella frustrazione.\n\nResta infine una questione di metodo. Una riforma che tocca il cuore della rappresentanza democratica non può essere approvata in fretta, né diventare una bandiera di parte da sventolare in campagna elettorale. Sarebbe auspicabile, al contrario, un percorso graduale: si potrebbe cominciare, per esempio, dalle elezioni amministrative, valutarne gli effetti nell'arco di alcuni anni e, soltanto in seguito, decidere se estendere la misura anche alle elezioni politiche. Nondimeno, rinviare indefinitamente la discussione equivarrebbe a una scelta, e non certo neutrale: significherebbe mantenere, per inerzia, lo squilibrio attuale.\n\nIn conclusione, la proposta di votare a sedici anni non è né una panacea né una minaccia. È piuttosto uno specchio: ci costringe a chiederci che cosa intendiamo per cittadinanza e quanta fiducia siamo disposti ad accordare alle nuove generazioni. Sarebbe paradossale continuare a rimproverare ai giovani il loro scarso interesse per la politica, per poi negare loro l'unico strumento che la politica, in una democrazia, riconosce davvero: il voto.",
    "gloss": {
     "sé": "(di per sé) en sí, por sí solo",
     "largo": "(largo ai giovani!) ¡paso a los jóvenes!",
     "riaffiora": "resurge, vuelve a aparecer",
     "accantonata": "dejada de lado, archivada",
     "sommessamente": "en voz baja, con discreción",
     "subirà": "sufrirá, padecerá",
     "ribalterebbe": "daría vuelta",
     "quantomeno": "por lo menos",
     "sbilanciata": "desequilibrada",
     "ordinamento": "ordenamiento jurídico",
     "rilievo": "di rilievo: de importancia",
     "paventati": "temidos",
     "consapevoli": "conscientes",
     "laddove": "mientras que",
     "astensione": "abstención",
     "imprescindibile": "indispensable",
     "qualora": "en caso de que",
     "attendibile": "confiable",
     "travestita": "disfrazada",
     "scontro": "choque, enfrentamiento",
     "sventolare": "agitar, flamear",
     "auspicabile": "deseable",
     "amministrative": "municipales (elecciones)",
     "nondimeno": "sin embargo, no obstante",
     "rinviare": "postergar",
     "inerzia": "inercia",
     "accordare": "conceder",
     "rimproverare": "reprochar",
     "beninteso": "por supuesto, se entiende",
     "sgombrare": "despejar"
    },
    "questions": [
     [
      "Qual è la posizione dell'autore sulla proposta?",
      [
       "È contrario, perché i sedicenni non sono abbastanza maturi",
       "È favorevole, a patto di investire nella formazione e procedere per gradi",
       "Non prende posizione e si limita a riportare le opinioni altrui",
       "Vuole estendere subito il voto ai sedicenni per tutte le elezioni"
      ],
      "È favorevole, a patto di investire nella formazione e procedere per gradi"
     ],
     [
      "Che cosa intende l'autore con «una rappresentanza oggi sbilanciata»?",
      [
       "Che in Parlamento ci sono troppi partiti piccoli",
       "Che le donne sono ancora poco rappresentate in politica",
       "Che i giovani pesano poco rispetto agli anziani",
       "Che le regioni del Sud votano meno di quelle del Nord"
      ],
      "Che i giovani pesano poco rispetto agli anziani"
     ],
     [
      "Come giudica l'autore l'obiezione sulla maturità dei sedicenni?",
      [
       "Più debole di quanto possa sembrare",
       "Solida e, di fatto, decisiva",
       "Offensiva nei confronti dei giovani",
       "Irrilevante ai fini del dibattito"
      ],
      "Più debole di quanto possa sembrare"
     ],
     [
      "Secondo alcuni studi citati, votare per la prima volta mentre si va ancora a scuola…",
      [
       "aumenta l'astensione negli anni successivi",
       "rende i giovani elettori più conservatori",
       "non produce effetti misurabili nel tempo",
       "favorisce l'abitudine al voto negli anni"
      ],
      "favorisce l'abitudine al voto negli anni"
     ],
     [
      "Perché, secondo l'autore, rinviare la discussione non sarebbe una scelta neutrale?",
      [
       "Perché i partiti ne approfitterebbero in campagna elettorale",
       "Perché l'Unione europea impone una scadenza precisa",
       "Perché lascerebbe invariato lo squilibrio attuale",
       "Perché gli studenti scenderebbero in piazza a protestare"
      ],
      "Perché lascerebbe invariato lo squilibrio attuale"
     ]
    ],
    "vf": [
     [
      "Secondo l'autore, la proposta è del tutto nuova nel dibattito italiano.",
      "falso"
     ],
     [
      "L'autore suggerisce di cominciare dalle elezioni amministrative.",
      "vero"
     ],
     [
      "L'autore dell'editoriale insegna educazione civica in un liceo.",
      "non si dice"
     ],
     [
      "Secondo l'autore, anche molti adulti avrebbero bisogno di educazione civica.",
      "vero"
     ],
     [
      "Il Parlamento ha già fissato la data del voto sulla riforma.",
      "non si dice"
     ]
    ],
    "hunt": {
     "label": "Tocá los conectores textuales (dunque, pertanto, tuttavia…)",
     "targets": [
      "dunque",
      "pertanto",
      "infatti",
      "d'altronde",
      "beninteso",
      "tuttavia",
      "ciononostante",
      "invece",
      "peraltro",
      "anzi",
      "laddove",
      "qualora",
      "inoltre",
      "semmai",
      "anziché",
      "nondimeno",
      "infine",
      "piuttosto"
     ]
    }
   },
   "ascolto": {
    "title": "Trenta all'ora: la città cambia passo?",
    "genre": "intervista radiofonica con contraddittorio",
    "es": "En un programa de radio sobre temas que dividen a la ciudad, el conductor hace de abogado del diablo frente a una urbanista que defiende el límite de 30 km/h en las calles urbanas.",
    "speakers": [
     "Conduttore",
     "Urbanista"
    ],
    "turns": [
     [
      "A",
      "Buonasera e benvenuti a «Piazza pubblica», il programma in cui i temi che dividono la città li affrontiamo senza urlare. Stasera parliamo del limite dei trenta all'ora, che il comune vorrebbe estendere a quasi tutte le strade urbane. In studio c'è Elisa Moretti, urbanista, favorevole alla misura. Io, per una sera, farò l'avvocato del diavolo."
     ],
     [
      "B",
      "Buonasera. Mi sembra giusto, anzi, spero che sia un avvocato severo."
     ],
     [
      "A",
      "Lo sarò. Prima obiezione, quella che sento di più: a trenta all'ora ci metteremo il doppio del tempo per attraversare la città."
     ],
     [
      "B",
      "È un'obiezione comprensibile, ma i fatti la smentiscono. In città la velocità media reale, considerando semafori, incroci e traffico, è già molto bassa, spesso intorno ai venti chilometri orari. Il limite dei cinquanta, in pratica, lo si raggiunge solo per pochi secondi tra un semaforo e l'altro. Pertanto il tempo di percorrenza cambia pochissimo."
     ],
     [
      "A",
      "Sì, però intanto chi lavora con l'auto, i tassisti, i corrieri, si sente penalizzato."
     ],
     [
      "B",
      "Lo capisco, e infatti credo che la misura vada accompagnata da interventi concreti: corsie riservate, zone di carico e scarico, semafori coordinati. Tuttavia, non possiamo perdere di vista il punto centrale, cioè la sicurezza. Un pedone investito a trenta all'ora ha probabilità di sopravvivere molto più alte che a cinquanta. Questo lo dice la fisica, prima ancora della statistica."
     ],
     [
      "A",
      "Seconda obiezione. Molti dicono: è una misura ideologica, contro l'automobile."
     ],
     [
      "B",
      "Ecco, qui vorrei essere chiara. Non si tratta di essere contro qualcuno. Si tratta di decidere a chi appartiene lo spazio pubblico. Per decenni abbiamo progettato le città intorno all'automobile; oggi ci chiediamo se le strade debbano essere anche luoghi in cui i bambini possono andare a scuola a piedi e gli anziani attraversare senza paura."
     ],
     [
      "A",
      "Bello, ma un po' astratto. Il commerciante che vede calare i clienti che cosa se ne fa di questa filosofia?"
     ],
     [
      "B",
      "Guardi, l'esperienza di diverse città europee indica che nelle strade più tranquille il commercio di vicinato tende, semmai, a migliorare. Chi passeggia si ferma, guarda le vetrine, entra. Chi sfreccia a cinquanta all'ora, no."
     ],
     [
      "A",
      "Mi permetta però di insistere. Non c'è il rischio che la regola resti sulla carta? Se nessuno controlla, la gente continuerà ad andare veloce."
     ],
     [
      "B",
      "Il rischio c'è, e sarebbe ingenuo negarlo. Per questo il cartello da solo non basta. Servono dossi, restringimenti di carreggiata, attraversamenti rialzati: interventi che rendono la velocità bassa naturale, non imposta. E, naturalmente, controlli, almeno nella fase iniziale."
     ],
     [
      "A",
      "E i costi? Rifare le strade, i dossi, la segnaletica… In un momento di bilanci stretti, non è un lusso?"
     ],
     [
      "B",
      "Sono costi reali, non lo nego. Però vanno confrontati con quelli, molto più alti, degli incidenti: ricoveri, riabilitazioni, giornate di lavoro perse, per non parlare del dolore delle famiglie, che non ha prezzo. E poi molti interventi si possono fare gradualmente, approfittando dei lavori di manutenzione già previsti."
     ],
     [
      "A",
      "Ultima domanda, e le chiedo una risposta breve. Se tra due anni i dati dicessero che la misura non ha funzionato?"
     ],
     [
      "B",
      "Allora bisognerebbe avere il coraggio di cambiarla. Una politica pubblica seria si valuta sui risultati, non sugli slogan. Questo vale per chi la propone e per chi la contesta."
     ],
     [
      "A",
      "Una risposta che, devo dire, disarma perfino l'avvocato del diavolo. Grazie a Elisa Moretti. Nella seconda parte daremo la parola agli ascoltatori."
     ]
    ],
    "gloss": {
     "fa": "(che cosa se ne fa di...?) ¿de qué le sirve...?: *farsene di qualcosa*",
     "smentiscono": "desmienten",
     "incroci": "cruces, esquinas",
     "percorrenza": "tiempo de recorrido",
     "corrieri": "repartidores",
     "corsie": "carriles",
     "investito": "atropellado",
     "vicinato": "commercio di vicinato: comercio de barrio",
     "vetrine": "vidrieras",
     "sfreccia": "pasa a toda velocidad",
     "dossi": "lomos de burro",
     "carreggiata": "calzada",
     "rialzati": "elevados",
     "ricoveri": "internaciones",
     "manutenzione": "mantenimiento"
    },
    "questions": [
     [
      "Che ruolo sceglie di avere il conduttore nel programma?",
      [
       "Difende apertamente il limite dei trenta all'ora",
       "Presenta le obiezioni più comuni per mettere alla prova l'ospite",
       "Rappresenta ufficialmente l'associazione dei commercianti della città",
       "Resta neutrale e si limita a dare la parola"
      ],
      "Presenta le obiezioni più comuni per mettere alla prova l'ospite"
     ],
     [
      "Perché, secondo Moretti, i tempi di viaggio cambierebbero poco?",
      [
       "Perché la velocità media reale in città è già bassa",
       "Perché i semafori verrebbero tutti eliminati",
       "Perché la maggior parte della gente si sposta già in bicicletta",
       "Perché il limite varrebbe solo di notte"
      ],
      "Perché la velocità media reale in città è già bassa"
     ],
     [
      "Come risponde Moretti all'accusa di misura «ideologica»?",
      [
       "Dice che l'automobile va abolita nei centri storici",
       "Ammette che la misura è pensata contro chi guida",
       "Sostiene che il tema è a chi appartiene lo spazio pubblico",
       "Afferma che la decisione è stata imposta dall'Unione europea ai comuni"
      ],
      "Sostiene che il tema è a chi appartiene lo spazio pubblico"
     ],
     [
      "Che cosa pensa Moretti del rischio che la regola resti sulla carta?",
      [
       "Lo ritiene del tutto inesistente",
       "Lo riconosce e propone interventi sulle strade",
       "Pensa che basti mettere dei cartelli",
       "Lo considera un problema della polizia"
      ],
      "Lo riconosce e propone interventi sulle strade"
     ],
     [
      "Quale principio esprime Moretti nell'ultima risposta?",
      [
       "Le politiche pubbliche vanno giudicate sui risultati",
       "Le decisioni prese non si devono mai cambiare",
       "Gli esperti devono decidere al posto dei cittadini",
       "Gli slogan sono indispensabili in politica"
      ],
      "Le politiche pubbliche vanno giudicate sui risultati"
     ]
    ],
    "vf": [
     [
      "Il limite dei trenta riguarderebbe quasi tutte le strade urbane.",
      "vero"
     ],
     [
      "Moretti nega che i tassisti possano avere dei problemi.",
      "falso"
     ],
     [
      "Moretti ha partecipato alla stesura del piano del comune.",
      "non si dice"
     ],
     [
      "Nella seconda parte del programma interverranno gli ascoltatori.",
      "vero"
     ]
    ]
   },
   "compito": {
    "genre": "saggio",
    "title": "Chi deve decidere il futuro?",
    "fonte": "lettura",
    "t": "Hai letto l'editoriale «Votare a sedici anni: una proposta da prendere sul serio». La tua scuola organizza un concorso di scrittura argomentativa sul tema della partecipazione politica dei giovani. Scrivi un saggio breve (239-299 parole, registro formale) dal titolo «Chi deve decidere il futuro?», in cui esponi chiaramente la tua tesi sul voto ai sedicenni, discuti almeno un argomento a favore e un'obiezione presentati nell'editoriale e arrivi a una conclusione motivata. Cura la coesione del testo usando connettivi adeguati.",
    "es": "Ensayo argumentativo formal: tesis en la introducción, un argumento a favor y una objeción del editorial (con tu respuesta), conclusión. Lo que se evalúa acá es el registro alto y los conectores (pertanto, tuttavia, ciononostante…).",
    "min": 239,
    "max": 299,
    "punti": [
     [
      "tesis clara en la introducción",
      [
       "ritengo",
       "a mio avviso",
       "a mio parere",
       "sostengo"
      ]
     ],
     [
      "argumento a favor retomado del editorial",
      [
       "demograf",
       "anzian",
       "lavor",
       "abitudine"
      ]
     ],
     [
      "objeción y respuesta",
      [
       "maturità",
       "condizion",
       "obiezion"
      ]
     ],
     [
      "conclusión",
      [
       "in conclusione",
       "concludendo",
       "in definitiva"
      ]
     ]
    ],
    "model": "Chi deve decidere il futuro?\n\nLa proposta di estendere il diritto di voto ai sedicenni, discussa nell'editoriale «Votare a sedici anni: una proposta da prendere sul serio», solleva una questione che va ben oltre l'età anagrafica: quanto siamo disposti a fidarci delle nuove generazioni? A mio avviso, la riforma è auspicabile, purché venga introdotta con gradualità.\n\nIl primo argomento a sostegno è di natura demografica. In un paese in cui gli anziani costituiscono una parte crescente dell'elettorato, le decisioni di lungo periodo, come quelle sulle pensioni o sul clima, vengono prese soprattutto da chi ne subirà le conseguenze per meno tempo. Coinvolgere i più giovani contribuirebbe, pertanto, a riequilibrare la rappresentanza. Inoltre, come osserva l'autore, chi a sedici anni può già lavorare dovrebbe potersi esprimere sulle regole che disciplinano il suo lavoro.\n\nNon si possono tuttavia ignorare le obiezioni. La più frequente riguarda la maturità dei sedicenni; eppure nessuno verifica la preparazione politica degli elettori adulti. Più fondato mi sembra il timore del condizionamento familiare o della propaganda online. Ciononostante, questo rischio non riguarda soltanto gli adolescenti, e la risposta più efficace non è l'esclusione, bensì la formazione.\n\nProprio per questo ritengo che il voto ai sedicenni debba essere accompagnato da un'educazione civica rinnovata, capace di insegnare a valutare le fonti e a confrontarsi con opinioni diverse. Cominciare dalle elezioni amministrative permetterebbe, inoltre, di verificarne gli effetti prima di estendere la misura.\n\nIn conclusione, abbassare l'età del voto non risolverebbe da solo la crisi della partecipazione, ma rappresenterebbe un segnale di fiducia. E la fiducia, in democrazia, è il presupposto di ogni responsabilità.",
    "gloss": {
     "va ben oltre": "va mucho más allá de",
     "età anagrafica": "edad según el documento, edad cronológica",
     "auspicabile": "deseable",
     "subirà": "va a sufrir, va a padecer",
     "disciplinano": "regulan",
     "Ciononostante": "no obstante, a pesar de eso",
     "bensì": "sino (después de una negación)",
     "presupposto": "condición previa, base"
    }
   },
   "breve": {
    "title": "Elezioni comunali: le informazioni per votare",
    "genre": "avviso pubblico",
    "es": "Un comunicado oficial de la municipalidad explica cuándo y cómo votar en las elecciones locales.",
    "speaker": "Voce del Comune",
    "voice": 0,
    "text": [
     "Comunicazione del Comune di Bologna. Si informano i cittadini che domenica 14 e lunedì 15 giugno si terranno le elezioni per il rinnovo del consiglio comunale. I seggi saranno aperti domenica dalle sette alle ventitré e lunedì dalle sette alle quindici.",
     "Per votare è necessario presentarsi con un documento di identità valido e con la tessera elettorale. Qualora la tessera fosse stata smarrita o fosse esaurita, l'ufficio elettorale resterà aperto in via straordinaria, anche sabato e domenica, per il rilascio di un duplicato.",
     "Gli elettori con disabilità possono richiedere il trasporto gratuito al seggio, prenotandolo entro giovedì al numero verde del Comune. Si ricorda inoltre che è vietato fotografare la scheda all'interno della cabina.",
     "Per ulteriori informazioni si rimanda al sito istituzionale del Comune."
    ],
    "tabella": [
     [
      "Ora di chiusura dei seggi la domenica",
      "23",
      [
       "ventitré",
       "le 23",
       "alle 23",
       "23:00"
      ]
     ],
     [
      "Documento necessario oltre a quello di identità",
      "tessera elettorale",
      [
       "la tessera elettorale",
       "tessera"
      ]
     ],
     [
      "Ultimo giorno per prenotare il trasporto",
      "giovedì",
      [
       "entro giovedì"
      ]
     ],
     [
      "Cosa è vietato fare in cabina",
      "fotografare la scheda",
      [
       "fotografare",
       "fare foto alla scheda",
       "fotografie",
       "fare fotografie"
      ]
     ]
    ],
    "info": [
     [
      "Si vota in due giorni.",
      true
     ],
     [
      "Lunedì i seggi restano aperti fino alle ventitré.",
      false
     ],
     [
      "Chi ha perso la tessera può chiederne un duplicato.",
      true
     ],
     [
      "L'ufficio elettorale è chiuso nel fine settimana.",
      false
     ],
     [
      "Il trasporto al seggio per le persone con disabilità è gratuito.",
      true
     ],
     [
      "Si può fotografare la scheda se non la si mostra a nessuno.",
      false
     ]
    ],
    "gloss": {
     "seggi": "mesas de votación",
     "tessera elettorale": "credencial electoral",
     "smarrita": "extraviada",
     "numero verde": "línea gratuita"
    }
   }
  },
  {
   "week": 50,
   "level": "C1",
   "lettura": {
    "title": "Parole che sembrano uguali: tradurre il Novecento italiano",
    "emoji": "📚",
    "genre": "saggio breve (rivista culturale)",
    "grammar": "lessico avanzato e falsi amici",
    "text": "Quando ho cominciato a tradurre dall'italiano allo spagnolo, un vecchio professore di Buenos Aires mi mise in guardia con una frase che non ho più dimenticato: «Diffida delle parole che conosci già». Allora mi sembrò un paradosso da lezione universitaria; oggi, dopo vent'anni di mestiere, la considero la regola aurea di chiunque lavori tra due lingue sorelle. L'italiano e lo spagnolo si somigliano tanto da ingannarci di continuo: la parola che sembra un'amica, nel momento decisivo, ci tradisce.\n\nGli esempi da manuale li conoscono tutti. Il burro italiano non è un asino ma la nostra manteca; salire significa subir, mentre subire vuol dire sufrir; una ragazza imbarazzata non aspetta un bambino, ma è semplicemente a disagio. Questi tranelli, però, sono i più innocui: si imparano presto, magari dopo una figuraccia, e non si dimenticano più. I veri pericoli si nascondono altrove, nelle parole che condividono una parte del significato e ne tradiscono un'altra, e soprattutto nel tono, in quella zona grigia in cui una traduzione corretta può essere, nondimeno, sbagliata.\n\nOgni traduttore, del resto, custodisce il suo piccolo museo degli orrori. Nel mio c'è una collega che, alle prime armi, lesse «fermare il pagamento» come se si trattasse di firmarlo, mentre il testo chiedeva esattamente il contrario, cioè di bloccarlo; c'è uno studente che vide in una «camera» una macchina fotografica, e non una stanza da letto; e ci sono io, che per mesi ho creduto che guardare volesse dire conservare, chiedendomi perché mai i personaggi dei romanzi passassero tanto tempo a guardare il mare, come se potessero chiuderlo in un cassetto.\n\nNessun libro mi ha insegnato la complessità di questo mestiere meglio di Lessico famigliare di Natalia Ginzburg, uscito nel 1963. È la storia di una famiglia torinese raccontata attraverso le sue parole: le espressioni ricorrenti, i rimproveri del padre, le frasi che bastavano a far ridere i fratelli anche a distanza di anni. Nel libro, la stessa Ginzburg suggerisce che quelle frasi funzionano come un segno di riconoscimento: basterebbe pronunciarne una per ritrovarsi, anche dopo molto tempo e lontano da casa. Tradurre un libro così significa scegliere, a ogni pagina, tra la fedeltà alla lettera e la fedeltà all'effetto. Se traduco un rimprovero del padre parola per parola, il lettore argentino non ride; se lo sostituisco con un'espressione nostra, la famiglia smette di essere torinese.\n\nCon Primo Levi il problema è quasi opposto. Chimico di professione, Levi ha fatto della precisione una sorta di dovere morale prima ancora che stilistico; nel Sistema periodico, non a caso, ogni capitolo porta il nome di un elemento chimico. Qui il traduttore non può permettersi approssimazioni. Un solo esempio: in italiano esito significa risultato, qualunque esso sia, mentre in spagnolo éxito indica soltanto un risultato positivo. Tradurre «l'esito dell'esperimento» con «el éxito del experimento» significa attribuire all'autore un ottimismo che il testo non contiene. È un errore piccolo, ma in un autore come Levi le parole piccole pesano.\n\nCalvino, dal canto suo, ha dedicato all'esattezza una delle sue Lezioni americane, uscite postume, e basta leggere Il barone rampante per capire che cosa intendesse. La storia di Cosimo, il ragazzo che un giorno sale su un albero e decide di non scendere più, è raccontata con una leggerezza che sembra spontanea ed è invece il frutto di un lavoro minuzioso sulle parole. Tradurlo è come camminare su un filo: una parola troppo pesante e l'incanto svanisce. E anche qui i falsi amici sono in agguato, a cominciare da quel «sale» che un lettore ispanofono potrebbe leggere come un'uscita invece che come una salita. Un viale largo, in italiano, è ancho, non lungo; e un rumore non è mai una voce che corre, ma soltanto un suono.\n\nCon Elsa Morante, infine, la sfida è la vastità. La Storia, pubblicato nel 1974, attraversa la Roma della Seconda guerra mondiale seguendo una maestra, Ida, e il suo bambino, Useppe. Morante mescola il registro del romanzo popolare con quello della tragedia, la cronaca con la fiaba, e il traduttore deve rendere tutte queste voci senza appiattirle. Ricordo, lavorando a un romanzo di quegli anni, di aver passato un pomeriggio intero su una sola parola, camino: in italiano è il focolare della casa, in spagnolo una strada. Il rischio non era di sbagliare il senso, che il contesto chiariva, ma di perdere per un attimo l'immagine di calore domestico che quella parola evocava.\n\nChe cosa accomuna, allora, questi quattro autori? Forse la consapevolezza che la lingua non è mai un semplice strumento, ma una materia viva, con una storia e una memoria. Per chi li traduce, ciò comporta una responsabilità che va ben oltre la correttezza grammaticale. Una parola può comparire nel dizionario, avere la stessa radice latina, suonare quasi identica, e tuttavia tradire l'originale. Il traduttore, in questo senso, somiglia a chi guida di notte su una strada conosciuta: la confidenza è la sua forza, ma anche il suo pericolo principale.\n\nOggi, quando qualche giovane collega mi chiede un consiglio, gli ripeto la frase del mio professore, aggiungendo una postilla: diffida delle parole che conosci, ma non smettere di amarle. È proprio da quella somiglianza ingannevole, infatti, che nasce il piacere di passare da una lingua all'altra: ogni falso amico smascherato è una piccola scoperta, e ogni scoperta ci ricorda che anche le lingue più vicine custodiscono, gelosamente, i loro segreti.",
    "gloss": {
     "diffida": "desconfiá",
     "aurea": "de oro",
     "somigliano": "se parecen",
     "burro": "manteca",
     "asino": "burro (el animal)",
     "salire": "subir",
     "subire": "sufrir, padecer",
     "imbarazzata": "incómoda, avergonzada",
     "disagio": "incomodidad",
     "tranelli": "trampas",
     "fermare": "detener, frenar",
     "camera": "habitación",
     "guardare": "mirar",
     "cassetto": "cajón",
     "rimproveri": "retos, reproches",
     "esito": "resultado",
     "postume": "póstumas",
     "incanto": "encanto, hechizo",
     "svanisce": "se desvanece",
     "agguato": "in agguato: al acecho",
     "largo": "ancho",
     "rumore": "ruido",
     "appiattirle": "aplanarlas",
     "camino": "chimenea, hogar",
     "confidenza": "familiaridad, trato de confianza",
     "focolare": "fuego del hogar",
     "accomuna": "tienen en común",
     "postilla": "acotación",
     "smascherato": "desenmascarado"
    },
    "questions": [
     [
      "Che cosa intendeva il professore con «Diffida delle parole che conosci già»?",
      [
       "Che bisogna studiare soprattutto le parole nuove",
       "Che le somiglianze tra lingue vicine possono ingannare",
       "Che il dizionario non serve a chi traduce davvero",
       "Che gli studenti credono di sapere più di quanto sanno"
      ],
      "Che le somiglianze tra lingue vicine possono ingannare"
     ],
     [
      "Secondo l'autrice, quali sono i falsi amici più pericolosi?",
      [
       "Quelli più famosi, come burro e salire",
       "Quelli che si trovano soltanto nei testi letterari antichi",
       "Quelli che condividono solo in parte il significato",
       "Quelli legati al linguaggio della chimica"
      ],
      "Quelli che condividono solo in parte il significato"
     ],
     [
      "Qual è il dilemma principale nel tradurre Lessico famigliare?",
      [
       "Scegliere tra fedeltà alla lettera e fedeltà all'effetto",
       "Trovare un editore argentino interessato al libro",
       "Capire il dialetto torinese usato dalla famiglia",
       "Decidere se tagliare i passaggi troppo lunghi"
      ],
      "Scegliere tra fedeltà alla lettera e fedeltà all'effetto"
     ],
     [
      "Perché tradurre «esito» con «éxito» sarebbe grave nel caso di Levi?",
      [
       "Perché Levi odiava le parole di origine spagnola",
       "Perché l'editore italiano non accetterebbe mai quella scelta",
       "Perché attribuirebbe al testo un ottimismo che non ha",
       "Perché «éxito» in spagnolo è una parola rara"
      ],
      "Perché attribuirebbe al testo un ottimismo che non ha"
     ],
     [
      "Nell'ultimo paragrafo, qual è l'atteggiamento dell'autrice verso i falsi amici?",
      [
       "Una diffidenza totale e un po' amara",
       "Una prudenza unita a un vero piacere",
       "Un'indifferenza da professionista esperta",
       "Un'irritazione verso i colleghi che sbagliano"
      ],
      "Una prudenza unita a un vero piacere"
     ]
    ],
    "vf": [
     [
      "Lessico famigliare racconta la storia di una famiglia torinese.",
      "vero"
     ],
     [
      "Nel Sistema periodico ogni capitolo porta il nome di una città.",
      "falso"
     ],
     [
      "L'autrice ha tradotto in spagnolo tutti e quattro gli autori citati.",
      "non si dice"
     ],
     [
      "Secondo l'autrice, in spagnolo «éxito» può indicare anche un risultato negativo.",
      "falso"
     ],
     [
      "Anche il professore di Buenos Aires era un traduttore.",
      "non si dice"
     ]
    ],
    "hunt": {
     "label": "Tocá los falsos amigos del castellano (parecen palabras nuestras, pero significan otra cosa)",
     "targets": [
      "burro",
      "salire",
      "subire",
      "imbarazzata",
      "fermare",
      "camera",
      "guardare",
      "esito",
      "sale",
      "largo",
      "rumore",
      "camino",
      "confidenza"
     ]
    }
   },
   "ascolto": {
    "title": "Scaffale Novecento: le città di Calvino",
    "genre": "podcast letterario",
    "es": "En un podcast sobre literatura italiana del siglo XX, una conductora y un crítico conversan sobre «Le città invisibili» de Italo Calvino.",
    "speakers": [
     "Livia, conduttrice",
     "Tommaso, critico letterario"
    ],
    "turns": [
     [
      "A",
      "Ciao a tutte e a tutti e benvenuti a «Scaffale Novecento». Oggi, con Tommaso, parliamo di un libro che molti hanno in casa e che pochi, forse, hanno letto fino in fondo: Le città invisibili di Italo Calvino."
     ],
     [
      "B",
      "Ciao Livia. Confesso subito una cosa: io la prima volta l'ho abbandonato a metà. Avevo diciotto anni e pensavo che un libro dovesse avere una trama. Qui la trama, nel senso classico, non c'è."
     ],
     [
      "A",
      "Spieghiamo allora com'è fatto, per chi non lo conosce."
     ],
     [
      "B",
      "Allora, la cornice è semplice. Marco Polo racconta all'imperatore Kublai Kan le città che ha visitato nel suo impero. Ogni città ha un nome di donna ed è descritta in poche pagine. Tra un gruppo di città e l'altro ci sono dei dialoghi tra i due, in cui discutono, diciamo, del senso di tutto quel raccontare."
     ],
     [
      "A",
      "E le città non esistono."
     ],
     [
      "B",
      "No, sono città impossibili. C'è una città sospesa su una rete sopra un precipizio, un'altra fatta solo di tubature, senza muri né pavimenti. Però, ed è questo il punto, ognuna ci parla di qualcosa che conosciamo benissimo: la memoria, il desiderio, i rifiuti, il rapporto con i morti."
     ],
     [
      "A",
      "Cioè sono metafore delle nostre città."
     ],
     [
      "B",
      "Sì, ma non in modo meccanico. Calvino non ti dice mai: questa città rappresenta il consumismo. Te la fa vedere, e sei tu che fai il collegamento. È un libro che chiede un lettore attivo, e questo spiega anche perché a diciotto anni mi aveva spiazzato."
     ],
     [
      "A",
      "Hai parlato di memoria. C'è un passaggio che ti è rimasto in mente?"
     ],
     [
      "B",
      "Più che un passaggio, un'idea. A un certo punto Marco Polo fa capire che, in fondo, tutte le città che descrive sono una sola: la sua città d'origine, Venezia. Parlando delle altre, parla sempre di quella. Mi sembra un'intuizione bellissima su come funziona il ricordo: ogni luogo nuovo lo misuriamo con il primo."
     ],
     [
      "A",
      "Io invece, lo dico con franchezza, a tratti lo trovo un po' freddo. Ammiro la costruzione, l'esattezza delle parole, però raramente mi commuove."
     ],
     [
      "B",
      "È una critica che si fa spesso a Calvino, e non la trovo infondata. È uno scrittore che preferisce la geometria all'emozione, almeno in superficie. Ma se lo rileggi da adulto, secondo me, sotto quella geometria senti una malinconia fortissima."
     ],
     [
      "A",
      "Ecco, questo mi incuriosisce. Da dove viene, secondo te?"
     ],
     [
      "B",
      "Dalla consapevolezza che le città, e forse il mondo intero, si stanno trasformando in qualcosa di invivibile. Il libro è del 1972, e certi temi, come l'accumulo dei rifiuti o le città tutte uguali, oggi sembrano scritti ieri."
     ],
     [
      "A",
      "C'è chi dice che sia un libro per pochi, per intellettuali. Tu che cosa rispondi?"
     ],
     [
      "B",
      "Rispondo che è un pregiudizio. Le frasi sono chiarissime, le città si leggono in cinque minuti. È difficile solo se pretendi di capire tutto subito. Se invece ti lasci portare, come quando visiti un posto nuovo senza la guida in mano, diventa un'esperienza quasi fisica."
     ],
     [
      "A",
      "Allora, un consiglio pratico per chi vuole leggerlo."
     ],
     [
      "B",
      "Non leggerlo tutto d'un fiato, come un romanzo. Leggi due o tre città la sera e lasciale sedimentare. E poi, quando hai finito, prova a descrivere la tua città come farebbe Marco Polo. È un esercizio che ti cambia lo sguardo."
     ],
     [
      "A",
      "E per chi l'ha già letto?"
     ],
     [
      "B",
      "Rileggerlo. Davvero. È un libro che cresce con te."
     ],
     [
      "A",
      "Grazie, Tommaso. La prossima settimana parleremo di Elsa Morante e dell'Isola di Arturo."
     ]
    ],
    "gloss": {
     "scaffale": "estante",
     "cornice": "marco (del relato)",
     "sospesa": "suspendida",
     "tubature": "cañerías",
     "rifiuti": "residuos, basura",
     "spiazzato": "descolocado",
     "franchezza": "franqueza",
     "commuove": "conmueve",
     "infondata": "infundada",
     "invivibile": "invivible",
     "accumulo": "acumulación",
     "pregiudizio": "prejuicio",
     "fiato": "tutto d'un fiato: de un tirón",
     "sedimentare": "decantar, asentar",
     "sguardo": "mirada"
    },
    "questions": [
     [
      "Perché Tommaso aveva abbandonato il libro da ragazzo?",
      [
       "Perché lo trovava troppo lungo e ripetitivo",
       "Perché si aspettava una trama tradizionale",
       "Perché non capiva l'italiano di Calvino",
       "Perché doveva leggerlo per un esame"
      ],
      "Perché si aspettava una trama tradizionale"
     ],
     [
      "Com'è strutturato Le città invisibili?",
      [
       "Un romanzo di viaggio in ordine cronologico",
       "Una raccolta di lettere scritte da Venezia",
       "Descrizioni di città alternate a dialoghi",
       "Racconti indipendenti di autori diversi"
      ],
      "Descrizioni di città alternate a dialoghi"
     ],
     [
      "Che cosa significa che il libro «chiede un lettore attivo»?",
      [
       "Che il lettore deve fare da sé i collegamenti",
       "Che va letto ad alta voce, in gruppo",
       "Che contiene esercizi alla fine di ogni capitolo",
       "Che bisogna conoscere bene la storia di Venezia"
      ],
      "Che il lettore deve fare da sé i collegamenti"
     ],
     [
      "Qual è la riserva di Livia sul libro?",
      [
       "Lo trova confuso e disordinato",
       "Lo trova superato e poco attuale",
       "Lo trova a tratti poco emozionante",
       "Lo trova troppo politico"
      ],
      "Lo trova a tratti poco emozionante"
     ],
     [
      "Come risponde Tommaso a chi dice che è un libro per pochi?",
      [
       "Dà ragione a chi lo considera difficile",
       "Sostiene che è un pregiudizio, perché la lingua è chiara",
       "Consiglia di leggerlo solo dopo altri libri di Calvino",
       "Dice che bisogna prima studiare la biografia di Marco Polo"
      ],
      "Sostiene che è un pregiudizio, perché la lingua è chiara"
     ]
    ],
    "vf": [
     [
      "Tutte le città del libro hanno nomi di donna.",
      "vero"
     ],
     [
      "Tommaso ritiene del tutto infondata la critica della freddezza di Calvino.",
      "falso"
     ],
     [
      "Livia ha letto il libro per la prima volta a scuola.",
      "non si dice"
     ],
     [
      "Nella prossima puntata si parlerà di un romanzo di Elsa Morante.",
      "vero"
     ]
    ]
   },
   "compito": {
    "genre": "recensione",
    "title": "Recensione di una puntata di «Scaffale Novecento»",
    "fonte": "ascolto",
    "t": "Hai ascoltato la puntata del podcast «Scaffale Novecento» dedicata a Le città invisibili di Italo Calvino. Il sito culturale «Cuffie e pagine» invita gli ascoltatori a recensire le puntate dei podcast letterari. Scrivi una recensione della puntata (244-304 parole, registro medio-alto) in cui presenti il libro di cui si parla, riassumi i momenti più interessanti della conversazione, valuti la qualità della puntata (chiarezza, equilibrio tra i due conduttori, utilità per chi non ha letto il libro) e dici se ne consiglieresti l'ascolto e a chi.",
    "es": "Reseña del episodio (no del libro): presentá el libro, resumí lo mejor de la charla, evaluá el episodio con criterios concretos y cerrá con una recomendación. Usá léxico preciso y evitá calcos del castellano.",
    "min": 244,
    "max": 304,
    "punti": [
     [
      "presentar el libro",
      [
       "calvino",
       "città invisibili"
      ]
     ],
     [
      "resumir la conversación",
      [
       "marco polo",
       "tommaso",
       "livia",
       "venezia"
      ]
     ],
     [
      "evaluar el episodio",
      [
       "puntata",
       "chiar",
       "equilibr"
      ]
     ],
     [
      "recomendación final",
      [
       "consigli",
       "raccomand"
      ]
     ]
    ],
    "model": "«Scaffale Novecento»: Calvino raccontato a due voci\n\nNell'ultima puntata di «Scaffale Novecento», la conduttrice Livia e il critico Tommaso affrontano Le città invisibili di Italo Calvino, un libro del 1972 spesso citato e, come ammettono gli stessi conduttori, non sempre letto fino in fondo.\n\nLa puntata si apre con una confessione che conquista subito l'ascoltatore: Tommaso racconta di aver abbandonato il libro a diciotto anni perché si aspettava una trama. Da qui prende avvio una spiegazione chiara della struttura dell'opera: Marco Polo descrive all'imperatore Kublai Kan una serie di città impossibili, ciascuna con un nome di donna, e i due personaggi dialogano sul senso di questi racconti. Particolarmente riuscito mi è sembrato il momento in cui Tommaso ricorda che, parlando di tutte le città, Marco Polo parla in fondo sempre di Venezia: un'osservazione che illumina il tema della memoria.\n\nIl pregio maggiore della puntata è l'equilibrio tra i due conduttori. Livia non si limita a fare domande, ma esprime con franchezza una riserva condivisibile: Calvino le sembra a tratti freddo. Tommaso non liquida l'obiezione, anzi la riconosce come fondata, e propone una lettura diversa, attenta alla malinconia che si nasconde sotto la geometria del libro. Ne nasce un confronto vero, lontano dal tono celebrativo di tanti programmi culturali.\n\nQualche limite, tuttavia, c'è: avrei gradito la lettura ad alta voce di almeno un breve passaggio, che avrebbe reso più concreta la discussione per chi il libro non l'ha mai aperto.\n\nNel complesso, si tratta di una puntata intelligente e accessibile. La consiglierei sia a chi vuole avvicinarsi a Calvino per la prima volta, sia a chi, come Tommaso, lo aveva abbandonato e cerca un buon motivo per riprenderlo in mano.",
    "gloss": {
     "puntata": "episodio, emisión (de un programa)",
     "prende avvio": "arranca, empieza",
     "Particolarmente riuscito": "especialmente logrado",
     "a tratti": "por momentos",
     "non liquida l'obiezione": "no descarta la objeción a la ligera",
     "avrei gradito": "me hubiera gustado",
     "riprenderlo in mano": "volver a agarrarlo"
    }
   },
   "breve": {
    "title": "Tradurre il Novecento, il festival",
    "genre": "annuncio radiofonico",
    "es": "Un aviso de radio presenta un festival de traducción literaria en Turín.",
    "speaker": "Voce dell'annuncio",
    "voice": 1,
    "text": [
     "Ci sono parole che sembrano uguali e non lo sono mai. Per chi ama le lingue torna a Torino «Tradurre il Novecento», il festival dedicato ai traduttori e alle traduttrici, dal 24 al 26 novembre, alla Biblioteca civica centrale.",
     "Tre giorni di incontri, letture e laboratori: si parlerà di Natalia Ginzburg, Primo Levi, Italo Calvino ed Elsa Morante con chi li ha tradotti in spagnolo, in inglese e in tedesco. Sabato mattina, laboratorio per studenti: «Falsi amici, veri nemici», dieci euro a persona, iscrizione obbligatoria.",
     "Domenica alle diciotto, incontro di chiusura con la scrittrice Eleonora Masi, che presenterà il suo nuovo romanzo, già tradotto in dodici lingue prima ancora di uscire in Italia.",
     "Tutti gli incontri sono gratuiti, tranne i laboratori. Programma completo sul sito del festival."
    ],
    "tabella": [
     [
      "Città del festival",
      "Torino",
      []
     ],
     [
      "Primo giorno del festival",
      "24 novembre",
      [
       "il 24 novembre",
       "24",
       "ventiquattro novembre"
      ]
     ],
     [
      "Costo del laboratorio (euro)",
      "10",
      [
       "dieci"
      ]
     ],
     [
      "Lingue in cui è già tradotto il romanzo (numero)",
      "12",
      [
       "dodici"
      ]
     ]
    ],
    "info": [
     [
      "Il festival si svolge in una biblioteca.",
      true
     ],
     [
      "Si parla solo di traduzioni in spagnolo.",
      false
     ],
     [
      "Il laboratorio di sabato è per studenti.",
      true
     ],
     [
      "Il romanzo di Eleonora Masi è già uscito in Italia.",
      false
     ],
     [
      "Anche i laboratori sono gratuiti.",
      false
     ],
     [
      "L'incontro di chiusura è domenica.",
      true
     ]
    ],
    "gloss": {
     "laboratori": "talleres",
     "iscrizione": "inscripción",
     "tranne": "excepto"
    }
   }
  },
  {
   "week": 51,
   "level": "C1",
   "lettura": {
    "title": "Quattro giorni bastano? Un anno di settimana corta alla Ferretti",
    "emoji": "🗓️",
    "genre": "articolo di approfondimento",
    "grammar": "ripasso C1: periodo complesso e congiuntivo",
    "text": "Se qualcuno, soltanto dieci anni fa, avesse proposto ai dirigenti di un'azienda metalmeccanica emiliana di far lavorare i dipendenti quattro giorni alla settimana senza ridurre loro lo stipendio, sarebbe stato probabilmente accompagnato alla porta con un sorriso di compatimento. Eppure è proprio ciò che è accaduto alla Ferretti Meccanica, centottanta dipendenti alle porte di Reggio Emilia, dove si è appena concluso il primo anno di sperimentazione della cosiddetta settimana corta: trentadue ore distribuite su quattro giorni, a parità di salario. I risultati, presentati la settimana scorsa ai lavoratori, hanno sorpreso persino chi l'aveva fortemente voluta.\n\nChe l'iniziativa non nascesse da uno slancio filantropico, i vertici dell'azienda non lo hanno mai nascosto. «Il problema era molto concreto», spiega Elena Guidi, direttrice del personale. «Non riuscivamo più a trovare tecnici qualificati, e quelli che formavamo, dopo due o tre anni, se ne andavano verso aziende più grandi, in grado di offrire stipendi che noi non potevamo permetterci. Dovevamo proporre qualcosa che gli altri non offrissero, e il tempo ci è sembrato la risorsa più preziosa.»\n\nLa sperimentazione, concordata con i sindacati, prevedeva regole precise. Ogni reparto avrebbe potuto organizzare i turni come riteneva più opportuno, purché la produzione complessiva non scendesse al di sotto dei livelli dell'anno precedente; qualora ciò fosse avvenuto per tre mesi consecutivi, l'accordo sarebbe stato sospeso. Per ridurre le ore senza perdere efficienza, l'azienda ha dovuto ripensare molte abitudini consolidate: le riunioni sono state dimezzate e limitate a mezz'ora, le email interne ridotte al minimo indispensabile, alcune fasi della produzione riorganizzate in modo che i macchinari non restassero mai fermi durante i cambi di turno.\n\nIl bilancio, dopo dodici mesi, è andato oltre le aspettative. La produzione non solo non è diminuita, ma è cresciuta di circa il 4 per cento; le assenze per malattia si sono ridotte di un terzo e, per la prima volta da anni, nessun tecnico ha lasciato l'azienda. Anche le candidature spontanee sono aumentate in modo significativo, tanto che oggi, racconta Guidi, «sono i giovani a cercare noi, e non viceversa». Non tutti gli indicatori, tuttavia, sono positivi: in un reparto, quello della manutenzione, la gestione delle urgenze si è rivelata più complicata del previsto, e si è dovuto ricorrere a un sistema di reperibilità che non piace a tutti.\n\nMa come si spiega che, lavorando meno, si produca di più? Guidi indica due fattori. Il primo è la concentrazione: sapendo di avere un giorno in meno a disposizione, le squadre hanno eliminato molti tempi morti che, in passato, nessuno si era mai preso la briga di misurare. Il secondo è la motivazione: «Quando una persona sente che l'azienda le ha restituito qualcosa, tende a restituire a sua volta», sostiene. Anche i clienti, che inizialmente temevano ritardi nelle consegne, si sono dovuti ricredere: durante l'anno nessun ordine è stato consegnato in ritardo a causa della nuova organizzazione.\n\nTra gli operai l'entusiasmo prevale, ma non mancano le sfumature. Luca, trentotto anni, tornitore da quindici, ammette che il venerdì libero gli ha cambiato la vita: «Porto i bambini a scuola, sbrigo le commissioni che prima rimandavo al sabato, e il fine settimana, finalmente, è un fine settimana». Più cauta è Sara, che lavora in amministrazione: «Le giornate sono più lunghe e più intense. Si lavora con meno pause, meno chiacchiere, meno tempo per imparare dai colleghi. Temo che, alla lunga, si perda qualcosa di cui oggi non ci accorgiamo.»\n\nÈ proprio su questo punto che insistono gli economisti più scettici. Secondo Andrea Villa, che da anni studia l'organizzazione del lavoro, i risultati della Ferretti vanno presi sul serio, ma non generalizzati. «Molte di queste sperimentazioni avvengono in aziende che hanno già un buon clima interno e che scelgono di partecipare proprio perché si sentono pronte», osserva. «È naturale che funzionino. Il difficile sarà capire che cosa succederebbe se la settimana corta venisse estesa a settori in cui il servizio dipende dalla presenza continua delle persone, come la sanità, la scuola o il commercio.» Senza contare, aggiunge, che l'effetto novità potrebbe esaurirsi: non è detto che ciò che motiva i lavoratori il primo anno continui a motivarli il quinto.\n\nIl dibattito, del resto, non riguarda soltanto l'economia. Dietro la questione delle ore si nasconde una domanda più profonda, che il Novecento sembrava aver risolto e che invece torna a porsi: quale posto debba occupare il lavoro nella vita delle persone. Per generazioni la riduzione dell'orario è stata considerata una conquista naturale del progresso; negli ultimi decenni, invece, la tendenza sembrava essersi invertita, tra reperibilità continua, email serali e confini sempre più labili tra ufficio e casa. Che sia proprio una fabbrica di provincia a rimettere in discussione questa tendenza non è privo di significato.\n\nAlla Ferretti, intanto, la decisione è stata presa: la sperimentazione proseguirà per altri due anni, con alcune correzioni, soprattutto nella manutenzione. Guidi non nasconde che i rischi restano. «Non abbiamo trovato la formula magica», dice. «Abbiamo solo scoperto che molte delle ore che passavamo qui non servivano a nessuno. Se tra due anni i numeri dovessero dirci il contrario, torneremo indietro senza vergogna.» Poi, quasi a voler sdrammatizzare, aggiunge sorridendo: «Certo, se qualcuno ci avesse detto che la cosa più difficile sarebbe stata convincere i dirigenti a rinunciare alle riunioni del lunedì, non ci avremmo mai creduto.»",
    "gloss": {
     "metalmeccanica": "metalúrgica",
     "compatimento": "lástima condescendiente",
     "sperimentazione": "prueba piloto",
     "parità": "a parità di: con el mismo",
     "slancio": "impulso",
     "filantropico": "filantrópico, altruista",
     "vertici": "cúpula (directiva)",
     "concordata": "acordada",
     "reparto": "sector, sección",
     "dimezzate": "reducidas a la mitad",
     "macchinari": "maquinaria",
     "candidature": "postulaciones",
     "manutenzione": "mantenimiento",
     "reperibilità": "guardia (estar disponible fuera de horario)",
     "tornitore": "tornero",
     "sbrigo": "despacho, resuelvo",
     "commissioni": "trámites, mandados",
     "rimandavo": "postergaba",
     "sfumature": "matices",
     "esaurirsi": "agotarse",
     "labili": "difusos, frágiles",
     "sdrammatizzare": "quitarle dramatismo",
     "vergogna": "vergüenza",
     "briga": "prendersi la briga: tomarse la molestia",
     "ricredere": "ricredersi: cambiar de opinión"
    },
    "questions": [
     [
      "Qual è stata la motivazione principale dell'azienda?",
      [
       "Un impegno etico verso il benessere dei dipendenti",
       "La difficoltà di trovare e trattenere tecnici qualificati",
       "Una richiesta esplicita dei sindacati nazionali del settore",
       "La necessità di ridurre i costi dell'energia in fabbrica"
      ],
      "La difficoltà di trovare e trattenere tecnici qualificati"
     ],
     [
      "Che cosa sarebbe successo se la produzione fosse calata per tre mesi di fila?",
      [
       "Gli stipendi sarebbero stati ridotti",
       "L'accordo sarebbe stato sospeso",
       "Il reparto sarebbe stato chiuso",
       "L'azienda avrebbe assunto altro personale"
      ],
      "L'accordo sarebbe stato sospeso"
     ],
     [
      "Qual è la preoccupazione di Sara?",
      [
       "Che il venerdì libero venga abolito dopo il primo anno",
       "Che il suo stipendio diminuisca a causa delle ore ridotte",
       "Che l'intensità del lavoro riduca scambi e apprendimento",
       "Che i colleghi della produzione non rispettino i turni"
      ],
      "Che l'intensità del lavoro riduca scambi e apprendimento"
     ],
     [
      "Perché Villa invita a non generalizzare i risultati?",
      [
       "Perché i dati della Ferretti sono stati gonfiati",
       "Perché le aziende che sperimentano sono spesso già predisposte",
       "Perché la legge vieta la settimana corta nella sanità",
       "Perché i lavoratori non sono stati consultati"
      ],
      "Perché le aziende che sperimentano sono spesso già predisposte"
     ],
     [
      "Che cosa lascia intendere l'ultima battuta di Guidi?",
      [
       "Che la resistenza più forte è venuta dalle abitudini dei dirigenti",
       "Che le riunioni del lunedì si sono rivelate indispensabili",
       "Che alcuni dirigenti hanno lasciato l'azienda per protesta",
       "Che la sperimentazione sarà interrotta tra due anni"
      ],
      "Che la resistenza più forte è venuta dalle abitudini dei dirigenti"
     ]
    ],
    "vf": [
     [
      "La settimana corta della Ferretti prevede trentadue ore a parità di stipendio.",
      "vero"
     ],
     [
      "Durante la sperimentazione la produzione è leggermente diminuita.",
      "falso"
     ],
     [
      "Luca usa il venerdì libero anche per seguire un corso serale.",
      "non si dice"
     ],
     [
      "Tutti i reparti hanno applicato la settimana corta senza difficoltà.",
      "falso"
     ],
     [
      "Sara ha chiesto di tornare all'orario di cinque giorni.",
      "non si dice"
     ]
    ],
    "hunt": {
     "label": "Tocá los verbos en congiuntivo",
     "targets": [
      "avesse",
      "nascesse",
      "offrissero",
      "scendesse",
      "fosse",
      "restassero",
      "produca",
      "perda",
      "funzionino",
      "venisse",
      "continui",
      "debba",
      "sia",
      "dovessero"
     ]
    }
   },
   "ascolto": {
    "title": "Moda veloce, conti lenti",
    "genre": "conferenza con domande del pubblico",
    "es": "Al final de una conferencia sobre moda y medio ambiente, la moderadora le lee a la especialista las preguntas del público.",
    "speakers": [
     "Moderatrice",
     "Relatrice"
    ],
    "turns": [
     [
      "A",
      "Ringraziamo la professoressa Carla Benedetti per la sua relazione. Abbiamo una ventina di minuti per le domande del pubblico, e io comincerei con una che mi è arrivata per iscritto. Un ascoltatore chiede: se la moda veloce inquina così tanto, perché continua a crescere?"
     ],
     [
      "B",
      "Grazie, è la domanda fondamentale, e la risposta, temo, è meno lusinghiera per noi consumatori di quanto vorremmo. Continua a crescere perché risponde a un desiderio reale: quello di cambiare spesso, di sentirsi aggiornati, spendendo poco. Finché il prezzo che paghiamo alla cassa non includerà i costi ambientali e sociali, cioè l'acqua consumata, le emissioni, le condizioni di chi cuce i vestiti, quel prezzo continuerà a sembrarci conveniente. Ma è un'illusione contabile, per così dire: il conto lo paga qualcun altro, altrove, o lo pagheranno le generazioni future."
     ],
     [
      "A",
      "Quindi lei sostiene che la responsabilità sia soprattutto dei consumatori?"
     ],
     [
      "B",
      "No, no, non vorrei essere fraintesa. Sarebbe troppo comodo, per le aziende, scaricare tutto sulle scelte individuali. Il singolo consumatore ha un potere limitato, anche perché spesso non dispone delle informazioni necessarie. Chi di noi sa davvero da dove viene la maglietta che indossa? Ecco perché insisto tanto sulla trasparenza della filiera e su regole comuni, almeno a livello europeo."
     ],
     [
      "A",
      "Mi arrivano altre domande. Una studentessa chiede se il riciclo dei vestiti non risolva, almeno in parte, il problema."
     ],
     [
      "B",
      "È una domanda che mi fanno spessissimo, e capisco perché: il riciclo ci tranquillizza, ci fa sentire a posto. Purtroppo, però, soltanto una piccola parte dei tessuti viene effettivamente trasformata in nuove fibre. Molti capi sono fatti di miscele di materiali difficilissime da separare. Quindi sì, il riciclo è utile, ma viene dopo. Prima vengono la riduzione e il riuso: comprare meno, far durare di più, riparare, scambiare."
     ],
     [
      "A",
      "E sull'usato? Qualcuno in sala obietta che anche l'usato online è diventato una specie di moda veloce: si compra, si rivende, si ricompra."
     ],
     [
      "B",
      "Osservazione acutissima. È quello che gli economisti chiamano effetto rimbalzo: una pratica virtuosa, se diventa troppo comoda, può finire per alimentare proprio il consumo che voleva ridurre. Se compro un vestito usato ma ne compro dieci al mese, il vantaggio ambientale si riduce parecchio, tra spedizioni, imballaggi e resi. Quindi, di nuovo, la domanda chiave non è che cosa compro, ma quanto."
     ],
     [
      "A",
      "A proposito di riparare: c'è chi dice che è un discorso da nostalgici, che le sarte e i calzolai stanno sparendo."
     ],
     [
      "B",
      "È vero che stanno sparendo, ma non è detto che sia inevitabile. In diverse città stanno nascendo laboratori di riparazione, a volte gestiti da cooperative, che uniscono un servizio utile e posti di lavoro qualificati. Non si tratta di tornare al passato, ma di recuperare competenze che avevamo abbandonato troppo in fretta, convinti che buttare fosse più moderno che aggiustare."
     ],
     [
      "A",
      "Un'ultima domanda, forse la più provocatoria. Qualcuno scrive, semplicemente: lei come si veste?"
     ],
     [
      "B",
      "Bella domanda, e rispondo volentieri. Compro poco, quasi sempre di seconda mano, e tengo i vestiti a lungo. Ma non vorrei trasformarmi in un esempio morale: non credo che la soluzione passi per la perfezione individuale. Se ciascuno di noi facesse un piccolo passo, e se nel frattempo le istituzioni facessero la loro parte, il cambiamento sarebbe molto più rapido di quanto immaginiamo."
     ],
     [
      "A",
      "Direi che è una conclusione perfetta. Grazie ancora alla professoressa Benedetti e a tutti voi per la partecipazione."
     ]
    ],
    "gloss": {
     "lusinghiera": "halagüeña",
     "aggiornati": "actualizados, a la moda",
     "cassa": "caja (del negocio)",
     "cuce": "cose",
     "contabile": "contable",
     "fraintesa": "malinterpretada",
     "filiera": "cadena de producción",
     "capi": "prendas",
     "miscele": "mezclas",
     "rimbalzo": "rebote",
     "imballaggi": "embalajes",
     "resi": "devoluciones",
     "sarte": "costureras",
     "calzolai": "zapateros",
     "aggiustare": "arreglar"
    },
    "questions": [
     [
      "Perché, secondo Benedetti, la moda veloce continua a crescere?",
      [
       "Perché i vestiti oggi sono di qualità migliore",
       "Perché le leggi europee la incoraggiano",
       "Perché risponde al desiderio di cambiare spesso spendendo poco",
       "Perché i negozi tradizionali hanno chiuso quasi tutti nelle città italiane"
      ],
      "Perché risponde al desiderio di cambiare spesso spendendo poco"
     ],
     [
      "Che cosa intende con «illusione contabile»?",
      [
       "Che le aziende falsificano i loro bilanci",
       "Che il prezzo basso nasconde costi pagati da altri",
       "Che i consumatori non sanno fare bene i conti quando fanno acquisti",
       "Che i dati sull'inquinamento sono esagerati"
      ],
      "Che il prezzo basso nasconde costi pagati da altri"
     ],
     [
      "Come si posiziona Benedetti sulla responsabilità dei consumatori?",
      [
       "Pensa che il peso maggiore spetti alle aziende e alle regole",
       "La considera l'unica vera responsabilità in gioco",
       "Ritiene che i consumatori siano del tutto innocenti e male informati",
       "Preferisce non esprimersi su questo punto"
      ],
      "Pensa che il peso maggiore spetti alle aziende e alle regole"
     ],
     [
      "Che cosa intende Benedetti con «effetto rimbalzo»?",
      [
       "Che i vestiti usati tornano spesso al venditore",
       "Che il riciclo rende i tessuti più resistenti",
       "Che una buona pratica, se abusata, può far crescere i consumi",
       "Che i prezzi dell'usato salgono dopo ogni rivendita"
      ],
      "Che una buona pratica, se abusata, può far crescere i consumi"
     ],
     [
      "Perché risponde con cautela alla domanda su come si veste?",
      [
       "Perché si vergogna delle sue abitudini",
       "Perché non vuole presentarsi come modello morale",
       "Perché trova la domanda offensiva",
       "Perché non compra mai vestiti nuovi"
      ],
      "Perché non vuole presentarsi come modello morale"
     ]
    ],
    "vf": [
     [
      "Alcune domande del pubblico arrivano per iscritto.",
      "vero"
     ],
     [
      "Secondo Benedetti, quasi tutti i tessuti vengono riciclati.",
      "falso"
     ],
     [
      "Benedetti ha fondato una cooperativa di riparazione.",
      "non si dice"
     ],
     [
      "Benedetti compra soprattutto vestiti di seconda mano.",
      "vero"
     ]
    ]
   },
   "compito": {
    "genre": "lettera_formale",
    "title": "Proposta di sperimentare la settimana corta",
    "fonte": "lettura",
    "t": "Lavori come impiegato/a in un'azienda di medie dimensioni che, come la Ferretti Meccanica, fatica a trattenere il personale qualificato. Hai letto l'articolo «Quattro giorni bastano? Un anno di settimana corta alla Ferretti». Scrivi una lettera formale al direttore del personale della tua azienda (250-310 parole) in cui proponi di avviare una sperimentazione simile, facendo riferimento ai risultati e ai limiti descritti nell'articolo, anticipi le possibili obiezioni e suggerisci in che modo organizzarla. Usa un registro formale e periodi ben articolati.",
    "es": "Carta formal a un superior: proponé la prueba piloto apoyándote en datos del artículo, reconocé los riesgos y proponé cómo organizarla. Es texto de examen C1: subordinadas, subjuntivo, período hipotético y concordancia de tiempos bien usados.",
    "min": 250,
    "max": 310,
    "punti": [
     [
      "presentar la propuesta",
      [
       "propo",
       "sperimenta"
      ]
     ],
     [
      "usar datos del artículo",
      [
       "ferretti",
       "4 per cento",
       "assenze",
       "produzione"
      ]
     ],
     [
      "reconocer riesgos u objeciones",
      [
       "obiezion",
       "rischi",
       "limit",
       "timor",
       "manutenzione"
      ]
     ],
     [
      "fórmulas formales de apertura y cierre",
      [
       "gentile",
       "egregio",
       "distinti saluti",
       "cordiali saluti"
      ]
     ]
    ],
    "model": "Egregio dottor Martini,\n\nLe scrivo, anche a nome di alcuni colleghi dell'ufficio acquisti, per sottoporLe una proposta che riteniamo possa interessare la nostra azienda: avviare, in via sperimentale, una settimana lavorativa di quattro giorni.\n\nLo spunto ci è venuto da un articolo dedicato alla Ferretti Meccanica di Reggio Emilia, un'azienda di dimensioni simili alla nostra che ha appena concluso un anno di sperimentazione con trentadue ore settimanali a parità di stipendio. I risultati sono stati sorprendenti: la produzione è cresciuta di circa il 4 per cento, le assenze per malattia si sono ridotte di un terzo e nessun tecnico ha lasciato l'azienda. Considerando quanto sia difficile, anche per noi, trattenere il personale qualificato, credo che l'esperienza meriti di essere presa in considerazione.\n\nSono consapevole che l'iniziativa comporti dei rischi. L'articolo stesso segnala che nella manutenzione la gestione delle urgenze si è rivelata complessa e che alcuni dipendenti lamentano giornate più intense e meno occasioni di confronto. Proprio per questo proporrei di procedere con gradualità: si potrebbe cominciare da uno o due uffici, per un periodo di sei mesi, fissando obiettivi misurabili e prevedendo la sospensione qualora i risultati non fossero soddisfacenti.\n\nSarebbe inoltre opportuno che la sperimentazione fosse accompagnata da una revisione delle nostre abitudini, a partire dalla durata delle riunioni, che, come è emerso alla Ferretti, assorbono spesso più tempo di quanto sia necessario.\n\nResto a Sua disposizione per illustrarLe la proposta più nel dettaglio e, se lo ritiene utile, per organizzare un breve incontro con i colleghi interessati.\n\nLa ringrazio per l'attenzione e Le porgo distinti saluti.\n\nGiulia Ferraro\nUfficio acquisti",
    "gloss": {
     "Egregio": "Estimado (fórmula formal de saludo, a quien tiene un título o cargo)",
     "sottoporLe": "presentarle, someter a su consideración (Le = usted)",
     "in via sperimentale": "a modo de prueba",
     "Lo spunto": "la idea disparadora",
     "a parità di stipendio": "con el mismo sueldo",
     "trattenere": "retener",
     "lamentano": "se quejan de",
     "Resto a Sua disposizione": "quedo a su disposición"
    }
   },
   "breve": {
    "title": "Le novità sulla settimana corta",
    "genre": "messaggio vocale della direzione",
    "es": "La directora de personal manda un audio a los empleados para resumir lo acordado con el gremio sobre la semana de cuatro días.",
    "speaker": "Elena Guidi, direttrice del personale",
    "voice": 1,
    "text": [
     "Buongiorno a tutte e a tutti, sono Elena Guidi, della direzione del personale. Vi lascio questo breve messaggio per riassumere le novità decise ieri con i sindacati sulla settimana corta.",
     "Prima di tutto, la sperimentazione continuerà per altri due anni, alle stesse condizioni. Chi preferisse tornare all'orario su cinque giorni potrà chiederlo entro il 31 gennaio, compilando il modulo che trovate in bacheca.",
     "Seconda novità: in manutenzione cambia il sistema di reperibilità. Invece di un solo tecnico a settimana ce ne saranno due, a turno, e la reperibilità verrà pagata di più: quaranta euro al giorno invece di trenta.",
     "Infine, le riunioni del lunedì mattina, che sarebbero dovute tornare, restano abolite. Se avete domande, sarò in mensa giovedì dalle dodici alle quattordici. Grazie a tutti per il lavoro di quest'anno."
    ],
    "tabella": [
     [
      "Durata della nuova sperimentazione",
      "2 anni",
      [
       "due anni",
       "altri due anni",
       "2"
      ]
     ],
     [
      "Scadenza per tornare ai cinque giorni",
      "31 gennaio",
      [
       "il 31 gennaio",
       "trentuno gennaio"
      ]
     ],
     [
      "Nuova paga di reperibilità (euro al giorno)",
      "40",
      [
       "quaranta"
      ]
     ],
     [
      "Dove si trova il modulo",
      "bacheca",
      [
       "in bacheca",
       "la bacheca"
      ]
     ],
     [
      "Giorno in cui Elena Guidi è in mensa",
      "giovedì",
      []
     ]
    ],
    "info": [
     [
      "La settimana corta continua per altri due anni.",
      true
     ],
     [
      "Tutti i dipendenti devono tornare ai cinque giorni.",
      false
     ],
     [
      "In manutenzione ci saranno due tecnici reperibili a turno.",
      true
     ],
     [
      "La reperibilità sarà pagata trenta euro al giorno.",
      false
     ],
     [
      "Le riunioni del lunedì tornano da febbraio.",
      false
     ],
     [
      "Elena Guidi risponderà alle domande in mensa.",
      true
     ]
    ],
    "gloss": {
     "sperimentazione": "prueba, experiencia piloto",
     "bacheca": "cartelera",
     "reperibilità": "guardia pasiva",
     "mensa": "comedor"
    }
   }
  }
 ]
};
  if (typeof module === "object" && module.exports) module.exports = root.TRAMO_DATA;
})(typeof window !== "undefined" ? window : globalThis);
