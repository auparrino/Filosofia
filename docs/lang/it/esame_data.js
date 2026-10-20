/* Esame finale C1 (settimana 52): ascolto, lettura, ricostruzione e scrittura,
 * in TRE VERSIONI (A, B, C).  Solo dati: la logica sta in app.js.  La parte di
 * strutture e lessico (cloze, formazione di parole, trasformazioni, registro)
 * è in tools/it/authored/esame_c1.py: ogni item porta «ver» ("A" | "B" | "C").
 * Tutto in italiano: domande, opzioni e consegne del testo; le consegne della
 * scrittura restano in castellano, come le altre consegne dell'app.
 *
 * FORMA DEI DATI (per la schermata dell'esame in app.js)
 *
 *   EsameData.versioni: [{ id: "A", ascolto: "asc-1", monologo: "mon-1",
 *       lettura: "let-1", ricostruzione: "ric-1", scrittura: ["scr-1", "scr-2"] }, …]
 *     Una versione = una prova completa; gli id rimandano ai gruppi qui sotto.
 *   EsameData.versione("B") → la versione con gli oggetti al posto degli id:
 *       { id, ascolto: {…}, monologo: {…}, lettura: {…}, ricostruzione: {…},
 *         scrittura: [{…}, {…}] }.
 *     Strutture e lessico della versione: course.items con topic "esame",
 *     prova "strutture" | "lessico" e ver === id (A: 37 + 18, B: 35 + 18,
 *     C: 29 + 16 item; oggi l'app ne estrae 20 e 12 da tutto il gruppo).
 *
 *   ascolto[]  dialoghi a due voci (turns: "A" = primo speaker, "B" = secondo;
 *              l'app li legge con due altezze TTS diverse), 8 domande a scelta
 *              multipla [domanda, [4 opzioni], risposta] e 4 frasi da
 *              completare [frase con ___, parola dell'audio].  La risposta
 *              giusta non è quasi mai l'opzione più lunga.
 *   monologhi[] {id, title, genre, speaker, voice (0 | 1: quale voce TTS),
 *              text: [paragrafi, da leggere in fila con una sola voce: 4-5 min],
 *              tabella: [[dato, risposta, [altre forme accettate]], …] (9-12)}.
 *              Si corregge come la tabella dell'ascolto breve del tramo:
 *              Tramo.cellOk(scritto, riga) ignora articoli, accenti, maiuscole
 *              e il formato delle ore (alle 18 = 18:00 = 18).
 *   lettura[]  testi di 6 paragrafi; 8 titoli (6 giusti + 2 distrattori) da
 *              abbinare (match[i] = indice del titolo del paragrafo i);
 *              8 vero/falso [affermazione, true | false, frase che giustifica].
 *   ricostruzione[] {id, title, paragraphs: [6 paragrafi NELL'ORDINE GIUSTO]}:
 *              il primo si mostra fermo; gli altri cinque si mescolano e il
 *              candidato li rimette in ordine (un punto per ogni paragrafo al
 *              posto giusto, 5 in tutto).
 *   scritture[] {id, kind ("argomentativo" | "formale"), words (250 | 180),
 *              min, max, t (consegna), rubric: [[criterio, descrizione]]}.
 *
 *   Compatibilità con la schermata di oggi (una sola versione): ascolto e
 *   lettura restano liste (oggi se ne estrae uno a caso) e «scrittura» è la
 *   coppia della versione A.  I monologhi e la ricostruzione non si vedono
 *   finché app.js non li usa. */
(function (root) { "use strict";
  var ESAME = {
    ascolto: [
      { id: "asc-1", title: "Intervista: il lavoro da remoto", speakers: ["Giornalista", "Esperta"],
        turns: [
          ["A", "Buongiorno e benvenuti. Oggi parliamo di lavoro da remoto con la professoressa Livia Sartori, sociologa del lavoro. Professoressa, a distanza di qualche anno dall'emergenza sanitaria, che cosa è rimasto del cosiddetto smart working?"],
          ["B", "Meno di quanto si pensasse nei momenti di entusiasmo, ma più di quanto temessero gli scettici. La maggior parte delle aziende che lo avevano introdotto in fretta è tornata a chiedere presenza, però quasi nessuna è tornata al modello precedente: prevale la formula ibrida, due o tre giorni a casa e gli altri in ufficio."],
          ["A", "Chi ne ha tratto maggior vantaggio?"],
          ["B", "Le persone con figli piccoli e chi vive lontano dai grandi centri. Per loro il risparmio di tempo negli spostamenti si è tradotto in una qualità della vita nettamente migliore. Il rovescio della medaglia è che i benefici si concentrano sui lavori d'ufficio: un operaio, un'infermiera o un commesso non hanno avuto alcuna scelta."],
          ["A", "E i rischi?"],
          ["B", "Il principale, a mio avviso, è l'isolamento. Non tanto la solitudine in sé, quanto la perdita di quelle conversazioni informali in cui si imparano le cose che nessuno mette per iscritto. I più giovani, che devono ancora costruirsi una rete di relazioni, sono i più penalizzati."],
          ["A", "Le aziende se ne sono rese conto?"],
          ["B", "Alcune sì. Le più attente hanno introdotto giornate comuni obbligatorie, in cui tutta la squadra è presente, e hanno formato i dirigenti a gestire persone che non vedono. Altre si sono limitate a contare le ore di connessione, che è il modo più sicuro per distruggere la fiducia."],
          ["A", "Un'ultima domanda: il diritto alla disconnessione è davvero garantito?"],
          ["B", "Sulla carta sì; nella pratica dipende dalla cultura di ogni ufficio. Finché rispondere a un'email alle dieci di sera sarà considerato un segno di dedizione, nessuna legge basterà. Sarebbe necessario che fossero i capi, per primi, a dare l'esempio."],
          ["A", "Professoressa Sartori, grazie."],
          ["B", "Grazie a voi."]
        ],
        questions: [
          ["Che cosa è rimasto del lavoro da remoto, secondo l'esperta?", ["Meno di quanto si sperava, ma più del temuto", "Quasi niente: si è tornati al modello precedente", "Tutto: le aziende lavorano soltanto da remoto", "Soltanto il lavoro da casa nel settore pubblico"], "Meno di quanto si sperava, ma più del temuto"],
          ["Quale modello prevale oggi nelle aziende?", ["Quello ibrido: due o tre giorni a casa", "Il lavoro da remoto per cinque giorni", "La presenza obbligatoria tutti i giorni", "Un giorno a casa ogni mese, non di più"], "Quello ibrido: due o tre giorni a casa"],
          ["Chi ne ha tratto maggior vantaggio?", ["Chi ha figli piccoli o vive lontano dalle città", "Gli operai, le infermiere e i commessi di negozio", "I giovani appena assunti nelle grandi aziende", "I dirigenti delle grandi imprese"], "Chi ha figli piccoli o vive lontano dalle città"],
          ["Qual è «il rovescio della medaglia» di cui parla?", ["Ne beneficiano solo i lavori d'ufficio", "Si spende di più per la casa e per la luce", "Le aziende hanno abbassato gli stipendi medi", "I figli rendono peggio a scuola e a casa"], "Ne beneficiano solo i lavori d'ufficio"],
          ["Perché l'isolamento è il rischio principale?", ["Si perdono le conversazioni in cui si impara", "Le persone sole si deprimono più facilmente", "La connessione a internet si interrompe spesso", "Si perdono le riunioni formali con i capi"], "Si perdono le conversazioni in cui si impara"],
          ["Che cosa hanno fatto le aziende «più attente»?", ["Giornate comuni in presenza e formazione dei capi", "Hanno contato le ore di connessione di ciascuno", "Hanno chiuso gli uffici per risparmiare sull'affitto", "Hanno ridotto gli stipendi dei dipendenti"], "Giornate comuni in presenza e formazione dei capi"],
          ["Che cosa pensa l'esperta del contare le ore di connessione?", ["Che distrugge la fiducia", "Che è una misura necessaria", "Che funziona solo con i giovani", "Che lo impone la legge"], "Che distrugge la fiducia"],
          ["Da che cosa dipende, in pratica, il diritto alla disconnessione?", ["Dalla cultura dell'ufficio e dai capi", "Da una legge più severa e dalle multe", "Dalla forza dei sindacati nelle aziende", "Dal numero di email che si ricevono"], "Dalla cultura dell'ufficio e dai capi"]
        ],
        completa: [
          ["Secondo l'esperta, il rischio principale è l'___.", "isolamento"],
          ["Oggi prevale la formula ___: due o tre giorni a casa e gli altri in ufficio.", "ibrida"],
          ["I più ___ sono i più penalizzati, perché devono ancora costruirsi una rete di relazioni.", "giovani"],
          ["Il diritto alla disconnessione è garantito sulla ___, ma nella pratica dipende dalla cultura di ogni ufficio.", "carta"]
        ] },

      { id: "asc-2", title: "Conferenza: quando gli italiani impararono l'italiano", speakers: ["Moderatrice", "Storico"],
        turns: [
          ["A", "Buonasera a tutti. Prosegue il nostro ciclo di incontri sulla storia della lingua. Stasera abbiamo con noi il professor Andrea Colombo, storico della lingua italiana. Professore, cominciamo da una domanda provocatoria: nel 1861, quando l'Italia fu unificata, quanti italiani parlavano italiano?"],
          ["B", "Pochissimi. Le stime variano molto, e gli studiosi discutono ancora sui criteri, ma si va da poco più del due per cento a circa il dieci. In ogni caso, la stragrande maggioranza della popolazione parlava esclusivamente il dialetto della propria zona, e l'italiano era una lingua quasi soltanto scritta, patrimonio di una ristretta minoranza colta."],
          ["A", "Eppure la lingua letteraria esisteva da secoli."],
          ["B", "Certo: dal Trecento, con Dante, Petrarca e Boccaccio, il fiorentino colto era diventato il modello. Ma era un modello per chi scriveva, non per chi parlava. Lo stesso Manzoni, nell'Ottocento, sentì il bisogno di andare a Firenze per, come disse lui, «risciacquare i panni in Arno», cioè per rendere più viva e naturale la lingua dei Promessi sposi."],
          ["A", "Che cosa cambiò, allora, dopo l'Unità?"],
          ["B", "Diversi fattori, lentamente. La scuola dell'obbligo, per quanto frequentata in modo irregolare; il servizio militare, che metteva insieme giovani di regioni diverse costretti a capirsi; le migrazioni interne verso le città industriali; la burocrazia dello Stato. Ma il vero salto avvenne nel secondo dopoguerra."],
          ["A", "Si riferisce alla televisione?"],
          ["B", "Esattamente. A partire dagli anni Cinquanta la televisione entrò nelle case, nei bar, nei circoli, e per la prima volta milioni di persone ascoltarono ogni giorno la stessa lingua parlata. Ci fu persino una trasmissione, «Non è mai troppo tardi», con il maestro Alberto Manzi, che insegnava a leggere e a scrivere agli adulti analfabeti."],
          ["A", "Quindi i dialetti sono destinati a scomparire?"],
          ["B", "Non necessariamente. Oggi quasi tutti gli italiani sanno parlare italiano, ma molti continuano ad alternarlo con il dialetto a seconda della situazione. Il dialetto, da lingua della necessità, è diventato lingua dell'affetto e dell'identità."],
          ["A", "Grazie, professore. Apriamo ora le domande del pubblico."]
        ],
        questions: [
          ["Quanti italiani parlavano italiano nel 1861, secondo lo storico?", ["Fra il 2 e il 10 per cento circa", "Circa la metà della popolazione", "Quasi tutti, tranne che al Sud", "Meno dell'uno per cento"], "Fra il 2 e il 10 per cento circa"],
          ["Che cosa parlava la grande maggioranza della popolazione?", ["Soltanto il dialetto della propria zona", "L'italiano e il dialetto in egual misura", "Il latino in chiesa e l'italiano a casa", "Il francese nelle città più ricche"], "Soltanto il dialetto della propria zona"],
          ["Che cos'era l'italiano prima dell'Unità?", ["Una lingua scritta, di una minoranza", "La lingua parlata nelle scuole", "La lingua dell'esercito piemontese", "Un dialetto come tutti gli altri"], "Una lingua scritta, di una minoranza"],
          ["Perché Manzoni andò a Firenze?", ["Per rendere più naturale il suo romanzo", "Per studiare da vicino le opere di Dante", "Per lavare davvero i vestiti nell'Arno", "Per fondare una scuola di lingua"], "Per rendere più naturale il suo romanzo"],
          ["Quale fattore NON viene citato fra quelli che diffusero l'italiano dopo l'Unità?", ["La radio", "La scuola dell'obbligo", "Il servizio militare", "Le migrazioni interne"], "La radio"],
          ["Quando avvenne «il vero salto»?", ["Dopo la guerra, con la tv", "Con l'Unità, nel 1861", "Nel Trecento, con Dante", "Con la Prima guerra mondiale"], "Dopo la guerra, con la tv"],
          ["Che cos'era «Non è mai troppo tardi»?", ["Una trasmissione per gli analfabeti", "Un romanzo storico di Alessandro Manzoni", "Un giornale per gli emigranti", "Un corso alla radio per i soldati"], "Una trasmissione per gli analfabeti"],
          ["Che cosa è successo al dialetto, secondo lo storico?", ["È diventato la lingua dell'affetto", "È scomparso del tutto", "È stato vietato dallo Stato", "È diventato la lingua della scuola"], "È diventato la lingua dell'affetto"]
        ],
        completa: [
          ["Nel 1861 l'italiano era una lingua quasi soltanto ___.", "scritta"],
          ["Manzoni andò a Firenze per «risciacquare i panni in ___».", "Arno"],
          ["Il servizio ___ metteva insieme giovani di regioni diverse costretti a capirsi.", "militare"],
          ["Il maestro Alberto Manzi insegnava a leggere e a scrivere agli adulti ___.", "analfabeti"]
        ] },

      {
        id: "asc-3",
        title: "Intervista: il ritorno dei treni notturni",
        speakers: ["Conduttrice", "Esperto di trasporti"],
        turns: [
          ["A", "Buonasera. Parliamo di un ritorno che pochi si aspettavano: quello dei treni notturni. Con noi c'è l'ingegner Paolo Ferrante, esperto di trasporti. Ingegnere, perché se ne parla tanto?"],
          ["B", "Perché, dopo vent'anni di chiusure, in tutta Europa si è tornati a investire nei treni con le cuccette. Le ragioni sono soprattutto due: l'ambiente e il tempo. Un viaggio di notte da Roma a Vienna produce una frazione delle emissioni di un volo, e si arriva in centro città, riposati, senza perdere una giornata."],
          ["A", "Eppure negli anni Duemila molte linee erano state soppresse."],
          ["B", "Sì, perché non erano redditizie. I vagoni erano vecchi, i prezzi alti, e i voli a basso costo costavano meno di una cuccetta. Le ferrovie hanno preferito concentrarsi sull'alta velocità, che di giorno collegava le grandi città in poche ore."],
          ["A", "Che cosa è cambiato, allora?"],
          ["B", "È cambiata la domanda. Molti viaggiatori, soprattutto giovani, oggi scelgono il treno per ragioni ecologiche, anche se costa un po' di più. E alcuni governi hanno cominciato a finanziare le linee internazionali, considerandole un servizio pubblico e non soltanto un affare."],
          ["A", "Ci sono dei problemi?"],
          ["B", "Parecchi. Il primo è la mancanza di vagoni: quelli nuovi costano molto e i tempi di produzione sono lunghi. Poi ci sono le regole diverse da un paese all'altro: cambiano le tensioni elettriche, i sistemi di sicurezza, perfino le tariffe per usare i binari. Un treno che attraversa quattro paesi deve pagare quattro pedaggi."],
          ["A", "E il comfort? Molti ricordano le vecchie cuccette con un certo orrore."],
          ["B", "Qui le novità sono buone. I treni più recenti offrono piccole cabine singole, con la porta che si chiude a chiave, e perfino la doccia nelle carrozze migliori. Resta vero che non si dorme come a casa, ma la differenza con il passato è enorme."],
          ["A", "Un consiglio per chi vuole provare?"],
          ["B", "Prenotare con largo anticipo, perché i posti sono pochi e finiscono presto, soprattutto d'estate. E partire con lo spirito giusto: il treno notturno non è solo un mezzo di trasporto, fa già parte del viaggio."],
          ["A", "Ingegner Ferrante, grazie e buon viaggio."]
        ],
        questions: [
          ["Quali sono, secondo l'esperto, le due ragioni del ritorno dei treni notturni?", ["L'ambiente e il tempo risparmiato", "Il prezzo e la velocità del viaggio", "Il turismo e il lavoro all'estero", "La sicurezza e la pulizia dei treni"], "L'ambiente e il tempo risparmiato"],
          ["Perché negli anni Duemila molte linee erano state soppresse?", ["Non erano redditizie", "C'erano troppi incidenti", "I passeggeri erano troppi", "Mancavano i macchinisti"], "Non erano redditizie"],
          ["Su che cosa si erano concentrate le ferrovie?", ["Sull'alta velocità di giorno", "Sui treni regionali per i pendolari", "Sul trasporto delle merci", "Sui collegamenti con gli aeroporti"], "Sull'alta velocità di giorno"],
          ["Chi sceglie oggi il treno per ragioni ecologiche, soprattutto?", ["Molti viaggiatori giovani", "Le famiglie con bambini piccoli", "Gli uomini d'affari", "I pensionati"], "Molti viaggiatori giovani"],
          ["Come considerano queste linee alcuni governi?", ["Un servizio pubblico, non solo un affare", "Un lusso per pochi viaggiatori ricchi", "Un pericolo per le compagnie aeree", "Un progetto troppo costoso da finanziare"], "Un servizio pubblico, non solo un affare"],
          ["Perché un treno che attraversa quattro paesi costa di più?", ["Deve pagare quattro pedaggi", "Deve cambiare quattro equipaggi", "Consuma più elettricità di notte", "Ha bisogno di vagoni più pesanti"], "Deve pagare quattro pedaggi"],
          ["Che cosa offrono i treni più recenti?", ["Cabine singole chiuse a chiave", "Cuccette da sei persone più economiche", "Un ristorante aperto tutta la notte", "Il wifi gratuito in tutte le carrozze"], "Cabine singole chiuse a chiave"],
          ["Che cosa consiglia l'esperto a chi vuole provare?", ["Prenotare con largo anticipo", "Partire solo d'inverno", "Portare cibo da casa", "Scegliere le cuccette da sei"], "Prenotare con largo anticipo"]
        ],
        completa: [
          ["Un viaggio di notte produce una frazione delle ___ di un volo.", "emissioni"],
          ["I voli a basso costo costavano meno di una ___.", "cuccetta"],
          ["Un treno che attraversa quattro paesi deve pagare quattro ___.", "pedaggi"],
          ["Il treno notturno non è solo un mezzo di trasporto: fa già parte del ___.", "viaggio"]
        ]
      }
    ],

    lettura: [
      { id: "let-1", title: "I paesi che si svuotano",
        paragraphs: [
          "Chi percorra le strade secondarie dell'Appennino, dalla Liguria alla Calabria, si imbatte con frequenza crescente in un paesaggio che sembra fermo nel tempo: borghi arroccati, case di pietra dalle persiane chiuse, piazze in cui l'unico bar ha rinunciato da anni a tenere aperto la sera. Non si tratta di un'impressione: gran parte dei comuni italiani conta meno di cinquemila abitanti e molti di essi, soprattutto nelle aree montane e interne, perdono popolazione da decenni, al punto che in alcune vallate il numero degli abitanti si è ridotto a un terzo rispetto all'inizio del Novecento. Lo spopolamento non è un evento improvviso, bensì un lento processo che comincia con la partenza dei giovani e si conclude, spesso, con la chiusura della scuola.",
          "Le ragioni sono note e si intrecciano. L'industrializzazione del secondo dopoguerra attirò verso le città del Nord milioni di persone in cerca di lavoro; l'agricoltura di montagna, faticosa e poco redditizia, fu abbandonata; i servizi, dalla sanità ai trasporti, furono progressivamente concentrati nei centri maggiori, con la conseguenza che vivere in paese divenne sempre più scomodo. A ciò si aggiunge un fattore culturale: per generazioni, andarsene è stato considerato l'unico modo di riuscire nella vita, mentre restare equivaleva a una rinuncia. Chi rimaneva lo faceva, il più delle volte, perché non aveva alternative.",
          "Gli effetti non riguardano soltanto chi resta. Un territorio abbandonato è un territorio che nessuno cura: i terrazzamenti crollano, i boschi avanzano sui campi, i sentieri scompaiono e il rischio di frane e incendi aumenta. Il patrimonio architettonico, privo di manutenzione, si deteriora. Si perdono inoltre saperi che non sono scritti da nessuna parte: come si costruisce un muro a secco, quando si semina una certa varietà di grano, come si chiama in dialetto un certo vento. Quando l'ultimo anziano se ne va, con lui se ne va un'intera biblioteca.",
          "Da alcuni anni lo Stato ha cominciato a occuparsi della questione con una strategia dedicata alle cosiddette aree interne, ossia ai territori lontani dai centri che offrono i servizi essenziali. L'idea di fondo è semplice: nessuno resta in un luogo in cui non ci sono una scuola, un medico e un mezzo per raggiungere il resto del mondo. Alcuni comuni, dal canto loro, hanno tentato la strada delle case vendute a prezzi simbolici, purché l'acquirente si impegni a ristrutturarle: iniziative che hanno avuto grande eco sui giornali, ma i cui risultati, a detta di molti osservatori, restano modesti: una casa comprata per pochi euro non serve a nulla se poi manca il lavoro per chi dovrebbe abitarla.",
          "Accanto agli interventi pubblici si osserva un fenomeno nuovo, ancora limitato ma significativo: persone che hanno lasciato la città per scelta, giovani che tornano al paese dei nonni per aprire un'azienda agricola o un laboratorio, lavoratori da remoto in cerca di affitti bassi e aria pulita. Non sono molti, e non tutti resistono al primo inverno, ma la loro presenza basta talvolta a riaprire un negozio o a far sì che la scuola raggiunga il numero minimo di alunni. Alcuni sindaci hanno capito che accogliere questi nuovi abitanti, anche stranieri, è l'unica alternativa all'estinzione, e hanno cominciato a offrire incentivi a chi apre un'attività o iscrive i figli alla scuola del paese.",
          "Sarebbe ingenuo pensare che i borghi possano tornare a essere ciò che erano: l'economia che li faceva vivere non esiste più. La domanda, semmai, è se sapranno diventare qualcos'altro senza trasformarsi in scenografie per turisti, belle da fotografare e vuote per undici mesi all'anno. La risposta dipenderà da quanto la società italiana nel suo insieme sarà disposta a considerare quei luoghi non come un residuo del passato, bensì come una parte del proprio futuro."
        ],
        titles: [
          "Chi arriva controcorrente",
          "Il turismo di massa nelle città d'arte",
          "Perché la gente se n'è andata",
          "Un lento svuotamento",
          "Né museo né scenografia: quale futuro",
          "Le nuove tecnologie in agricoltura",
          "Ciò che si perde con gli ultimi abitanti",
          "Le politiche pubbliche e le case a prezzo simbolico"
        ],
        match: [3, 2, 6, 7, 0, 4],
        vf: [
          ["Lo spopolamento dei borghi è un processo lento che comincia con la partenza dei giovani.", true, "«un lento processo che comincia con la partenza dei giovani e si conclude, spesso, con la chiusura della scuola»"],
          ["L'industrializzazione del dopoguerra spinse milioni di persone verso le città del Sud.", false, "«attirò verso le città del Nord milioni di persone in cerca di lavoro»"],
          ["Secondo il testo, restare in paese è stato a lungo considerato una rinuncia.", true, "«andarsene è stato considerato l'unico modo di riuscire nella vita, mentre restare equivaleva a una rinuncia»"],
          ["L'abbandono del territorio riduce il rischio di frane e incendi.", false, "«i sentieri scompaiono e il rischio di frane e incendi aumenta»"],
          ["La strategia dello Stato parte dall'idea che senza servizi essenziali nessuno resta.", true, "«nessuno resta in un luogo in cui non ci sono una scuola, un medico e un mezzo per raggiungere il resto del mondo»"],
          ["Secondo molti osservatori, le case vendute a prezzi simbolici hanno dato risultati eccellenti.", false, "«i cui risultati, a detta di molti osservatori, restano modesti»"],
          ["Tutti i nuovi abitanti resistono al primo inverno.", false, "«Non sono molti, e non tutti resistono al primo inverno»"],
          ["L'autore ritiene che i borghi non possano tornare a essere ciò che erano.", true, "«Sarebbe ingenuo pensare che i borghi possano tornare a essere ciò che erano»"]
        ] },

      { id: "let-2", title: "Il Grand Tour: quando l'Italia divenne una meta",
        paragraphs: [
          "Tra il Seicento e i primi decenni dell'Ottocento, per un giovane aristocratico inglese, tedesco o francese il viaggio in Italia costituì una tappa quasi obbligata dell'educazione. Lo si chiamava Grand Tour e poteva durare mesi o anni: si partiva accompagnati da un precettore, si attraversavano le Alpi e si scendeva lungo la penisola toccando Torino o Milano, Venezia, Firenze, Roma e, per i più intraprendenti, Napoli e la Sicilia. Lo scopo dichiarato era completare la formazione classica sui luoghi stessi in cui l'antichità aveva lasciato le sue tracce; quello reale, spesso, era anche divertirsi lontano dagli occhi della famiglia. Al ritorno, il giovane avrebbe dovuto saper conversare di arte antica e di musica, e portare con sé il gusto raffinato che ci si aspettava da un gentiluomo.",
          "Roma era il cuore dell'itinerario. Vi si arrivava con in mano guide e lettere di presentazione, e vi si trascorrevano settimane fra rovine, chiese e collezioni private, alle quali si accedeva grazie a una rete di ciceroni, antiquari e artisti disposti a fare da intermediari. Molti viaggiatori si facevano ritrarre da pittori del posto con sullo sfondo il Colosseo o il Foro, e acquistavano statue, monete e vedute da riportare a casa: le grandi dimore inglesi si riempirono così di frammenti d'Italia, veri o, non di rado, abilmente contraffatti.",
          "Dalla metà del Settecento un evento contribuì a spostare il baricentro del viaggio più a sud: gli scavi di Ercolano e di Pompei, le città sepolte dal Vesuvio nel 79 dopo Cristo, riportavano alla luce per la prima volta non soltanto templi e statue, ma la vita quotidiana degli antichi, con le sue case, le botteghe, le pitture e gli oggetti. Napoli, con il vulcano ancora attivo e il golfo, divenne una meta irrinunciabile, e la Sicilia, con i templi greci di Agrigento e di Segesta, cominciò ad attirare i più audaci, disposti ad affrontare strade pessime e alloggi di fortuna pur di vedere ciò che pochi avevano visto.",
          "Il viaggiatore più celebre fu forse Goethe, che tra il 1786 e il 1788 percorse l'Italia da Verona alla Sicilia e ne ricavò il Viaggio in Italia, pubblicato molti anni dopo. La sua affermazione di considerare il giorno in cui mise piede a Roma come una seconda nascita riassume un atteggiamento diffuso: l'Italia non era soltanto un luogo da vedere, ma un'esperienza che trasformava chi la faceva. Stendhal, alcuni decenni più tardi, descrisse lo sconvolgimento fisico che provò a Firenze davanti a tante opere d'arte, e a questo episodio si è ispirata, nel Novecento, la definizione di una vera e propria sindrome.",
          "Non mancavano, tuttavia, le voci critiche. Molti viaggiatori annotavano con fastidio le locande sporche, le strade insicure, i doganieri avidi, e guardavano gli abitanti con la condiscendenza di chi ammira le rovine ma disprezza chi ci vive intorno. Ne nacque un'immagine ambivalente, destinata a durare a lungo: un paese meraviglioso e al tempo stesso arretrato, in cui il passato glorioso serviva da contrasto per giudicare un presente considerato indolente.",
          "Con l'arrivo della ferrovia e, più tardi, del turismo organizzato, il Grand Tour nella sua forma aristocratica scomparve. Ne rimane però un'eredità profonda: l'idea dell'Italia come museo a cielo aperto, gli itinerari che ancora oggi i turisti seguono quasi senza variazioni, e una certa immagine del paese, fatta di luce, rovine e sensualità, che gli italiani stessi hanno finito per adottare. Molto di ciò che il mondo crede di sapere sull'Italia fu scritto, in fondo, da stranieri di passaggio, che vi cercavano ciò che avevano già deciso di trovare."
        ],
        titles: [
          "L'altra faccia dell'ammirazione",
          "Roma, centro dell'itinerario",
          "Le ferrovie italiane nell'Ottocento",
          "Ciò che resta oggi",
          "Un viaggio di formazione (e di svago)",
          "La scoperta del Sud",
          "Le origini dell'archeologia moderna",
          "Un'esperienza che trasforma"
        ],
        match: [4, 1, 5, 7, 0, 3],
        vf: [
          ["Il Grand Tour poteva durare anche anni.", true, "«poteva durare mesi o anni»"],
          ["Lo scopo reale del viaggio coincideva sempre con quello dichiarato.", false, "«quello reale, spesso, era anche divertirsi lontano dagli occhi della famiglia»"],
          ["A Roma i viaggiatori accedevano alle collezioni private grazie a intermediari.", true, "«alle quali si accedeva grazie a una rete di ciceroni, antiquari e artisti disposti a fare da intermediari»"],
          ["Gli scavi di Ercolano e Pompei riportarono alla luce soltanto templi e statue.", false, "«non soltanto templi e statue, ma la vita quotidiana degli antichi»"],
          ["Goethe pubblicò il suo Viaggio in Italia subito dopo il ritorno.", false, "«pubblicato molti anni dopo»"],
          ["Stendhal provò un malessere fisico a Firenze davanti alle opere d'arte.", true, "«descrisse lo sconvolgimento fisico che provò a Firenze davanti a tante opere d'arte»"],
          ["Molti viaggiatori guardavano gli abitanti con ammirazione e rispetto.", false, "«con la condiscendenza di chi ammira le rovine ma disprezza chi ci vive intorno»"],
          ["Secondo l'autore, gli itinerari turistici attuali ricalcano quelli del Grand Tour.", true, "«gli itinerari che ancora oggi i turisti seguono quasi senza variazioni»"]
        ] },

      {
        id: "let-3",
        title: "Le biblioteche che non sono più silenziose",
        paragraphs: [
          "Fino a pochi decenni fa, entrare in una biblioteca pubblica italiana significava accettare alcune regole non scritte: parlare sottovoce, non mangiare, non restare troppo a lungo senza un motivo preciso. Chi non doveva studiare o consultare un libro raro difficilmente ci metteva piede. Oggi, in molte città, la scena è diversa: nelle sale si incontrano pensionati che leggono il giornale, ragazzi che fanno i compiti in gruppo, stranieri che frequentano un corso di italiano, bambini che ascoltano una lettura ad alta voce. La biblioteca, insomma, si è trasformata da deposito di libri in luogo di incontro.",
          "Il cambiamento nasce anche da un dato preoccupante. Secondo le indagini più recenti, meno della metà degli italiani adulti legge almeno un libro all'anno, e le differenze tra Nord e Sud, tra città e piccoli centri, restano forti. In molti quartieri periferici la biblioteca è rimasta l'unico spazio pubblico al chiuso, gratuito e aperto a tutti, in cui si possa passare un pomeriggio senza dover consumare qualcosa. È da qui che molti bibliotecari sono partiti per ripensare il proprio lavoro. Non sorprende, quindi, che i ragazzi di questi quartieri trovino in biblioteca non solo i libri, ma anche una connessione a internet e un tavolo tranquillo che a casa spesso non hanno.",
          "I servizi offerti si sono moltiplicati. Oltre al prestito dei libri, molte biblioteche prestano oggi strumenti musicali, attrezzi per il bricolage, giochi da tavolo e perfino biciclette. Organizzano corsi di informatica per anziani, sportelli di aiuto per compilare moduli online, gruppi di lettura e di conversazione in lingua straniera. In alcune è possibile stampare documenti, usare una stanza per il lavoro da remoto o chiedere consiglio a un avvocato volontario una volta al mese.",
          "Non tutti vedono di buon occhio questa trasformazione. Alcuni lettori tradizionali lamentano il rumore e la difficoltà di trovare un posto tranquillo; qualche studioso teme che, a forza di diventare centri sociali, le biblioteche finiscano per trascurare la loro funzione originaria, cioè conservare e mettere a disposizione il sapere. Le risposte più riuscite sono quelle che separano gli spazi: sale del silenzio per chi studia, ambienti aperti e rumorosi per le attività di gruppo. C'è anche chi osserva, con una punta di ironia, che una biblioteca piena di rumore è comunque meglio di una biblioteca vuota e silenziosa, come molte erano fino a pochi anni fa.",
          "Resta poi il nodo delle risorse. Molte biblioteche comunali funzionano con personale ridotto all'osso e orari limitati, spesso chiuse proprio la sera e nel fine settimana, quando lavoratori e studenti sarebbero liberi. In diversi comuni le aperture serali sono possibili soltanto grazie ai volontari, con tutti i limiti che questo comporta. Senza investimenti stabili, avvertono i bibliotecari, le iniziative più innovative rischiano di restare esperimenti brevi, legati all'entusiasmo di poche persone. A questo si aggiunge l'età media del personale, molto alta: nei prossimi dieci anni migliaia di bibliotecari andranno in pensione, e non è affatto certo che verranno sostituiti.",
          "Eppure le esperienze migliori dimostrano che la strada è quella giusta. Dove le biblioteche sono diventate luoghi vivi, i prestiti di libri non sono diminuiti, anzi: in molti casi sono cresciuti, perché chi entra per un corso o per un caffè finisce spesso per uscire con un romanzo sotto il braccio. La biblioteca del futuro, forse, non sarà più silenziosa, ma potrà essere ciò che la piazza è stata per secoli: il posto in cui una comunità si incontra."
        ],
        titles: ["Molto più del prestito", "La nascita della stampa in Italia", "Il problema dei soldi e degli orari", "Da deposito a luogo di incontro", "Come la piazza di una volta", "Le biblioteche digitali sostituiscono la carta", "Un dato che preoccupa", "Chi non è d'accordo"],
        match: [3, 6, 0, 7, 2, 4],
        vf: [
          ["Un tempo in biblioteca si doveva parlare a bassa voce.", true, "«parlare sottovoce, non mangiare»"],
          ["Più della metà degli italiani adulti legge almeno un libro all'anno.", false, "«meno della metà degli italiani adulti legge almeno un libro all'anno»"],
          ["In alcuni quartieri la biblioteca è l'unico spazio pubblico gratuito al chiuso.", true, "«l'unico spazio pubblico al chiuso, gratuito e aperto a tutti»"],
          ["Alcune biblioteche prestano anche biciclette.", true, "«giochi da tavolo e perfino biciclette»"],
          ["Tutti gli studiosi apprezzano la trasformazione delle biblioteche.", false, "«Non tutti vedono di buon occhio questa trasformazione»"],
          ["Le soluzioni migliori separano gli spazi silenziosi da quelli per le attività di gruppo.", true, "«Le risposte più riuscite sono quelle che separano gli spazi»"],
          ["Le biblioteche comunali sono aperte soprattutto la sera e nel fine settimana.", false, "«spesso chiuse proprio la sera e nel fine settimana»"],
          ["Dove le biblioteche sono diventate luoghi vivi, i prestiti di libri sono diminuiti.", false, "«i prestiti di libri non sono diminuiti, anzi»"]
        ]
      }
    ],

    scritture: [
      {
        id: "scr-1",
        kind: "argomentativo",
        words: 250,
        min: 230,
        max: 280,
        t: "Un diario italiano abrió un debate con esta afirmación: «Il lavoro da remoto fa bene alle persone, ma fa male alle città e ai rapporti tra colleghi». Escribí un texto argumentativo en italiano (230-280 palabras) para la sección de opinión: tomá posición a favor o en contra de la tesis, sostenela con al menos dos argumentos y un ejemplo concreto, refutá un argumento contrario y cerrá con una conclusión. Registro formal, conectores variados (tuttavia, inoltre, pertanto, sebbene…), párrafos bien organizados y al menos una frase con congiuntivo.",
        rubric: [
          ["adeguatezza", "Cumple la consigna: toma posición, dos argumentos y un ejemplo; registro formal"],
          ["coesione", "Conectores variados y párrafos con una idea cada uno"],
          ["correttezza", "Gramática: concordancias, tiempos, congiuntivo, preposiciones"],
          ["lessico", "Riqueza y precisión: léxico C1, sin calcos del castellano"]
        ]
      },
      {
        id: "scr-2",
        kind: "formale",
        words: 180,
        min: 160,
        max: 200,
        t: "Compraste por internet un curso de italiano en línea de una escuela de Milán. Pasaron dos semanas, la plataforma sigue sin funcionar y nadie responde a tus mails. Escribí una carta formal de reclamo en italiano (160-200 palabras) a la dirección de la escuela: presentate e indicá qué compraste y cuándo, explicá el problema y lo que ya intentaste, pedí una solución concreta (reembolso o activación inmediata) y fijá un plazo. Usá el «Lei», una apertura y un cierre adecuados (Gentile / Egregio…, Distinti saluti) y fórmulas del registro formal (con la presente, in merito a, pertanto, in attesa di un Suo riscontro).",
        rubric: [
          ["adeguatezza", "Estructura de carta formal: apertura, presentación, motivo, pedido con plazo, cierre"],
          ["coesione", "Orden lógico y conectores formales"],
          ["correttezza", "Gramática: «Lei» coherente, tiempos, pronombres"],
          ["lessico", "Fórmulas del registro formal-burocrático, sin expresiones coloquiales"]
        ]
      },
      {
        id: "scr-3",
        kind: "argomentativo",
        words: 250,
        min: 230,
        max: 280,
        t: "La revista de una escuela secundaria italiana pide opiniones sobre esta propuesta: «I telefoni cellulari dovrebbero essere vietati a scuola per tutta la giornata, anche durante l'intervallo». Escribí un texto argumentativo en italiano (230-280 palabras): tomá posición, sostenela con al menos dos argumentos y un ejemplo, discutí un argumento de quien piensa lo contrario y proponé una solución intermedia o una conclusión clara. Registro formal, conectores de registro alto (in primo luogo, d'altra parte, ciononostante, in definitiva) y al menos un período hipotético.",
        rubric: [
          ["adeguatezza", "Cumple la consigna: toma posición, dos argumentos y un ejemplo; registro formal"],
          ["coesione", "Conectores variados y párrafos con una idea cada uno"],
          ["correttezza", "Gramática: concordancias, tiempos, congiuntivo, preposiciones"],
          ["lessico", "Riqueza y precisión: léxico C1, sin calcos del castellano"]
        ]
      },
      {
        id: "scr-4",
        kind: "formale",
        words: 180,
        min: 160,
        max: 200,
        t: "Desde hace tres semanas, en tu calle hay una obra que trabaja de noche, de las 22 a las 3, y no te deja dormir. Escribí una carta formal en italiano (160-200 palabras) a la oficina de medio ambiente de la municipalidad: presentate, describí el problema con datos precisos (fechas, horarios, consecuencias), preguntá si la obra tiene permiso para trabajar de noche y pedí una intervención concreta dentro de un plazo. Usá el «Lei» o el tratamiento a la oficina (Spettabile Ufficio…), fórmulas formales (con la presente, si chiede cortesemente, distinti saluti) y ningún tono agresivo.",
        rubric: [
          ["adeguatezza", "Estructura de carta formal: apertura, presentación, motivo, pedido con plazo, cierre"],
          ["coesione", "Orden lógico y conectores formales"],
          ["correttezza", "Gramática: «Lei» coherente, tiempos, pronombres"],
          ["lessico", "Fórmulas del registro formal-burocrático, sin expresiones coloquiales"]
        ]
      },
      {
        id: "scr-5",
        kind: "argomentativo",
        words: 250,
        min: 230,
        max: 280,
        t: "Para un concurso de ensayos de una fundación cultural, escribí un texto argumentativo en italiano (230-280 palabras) con este título: «Il turismo di massa nelle città d'arte: una risorsa o una minaccia?». Presentá el problema, tomá posición con al menos dos argumentos y un ejemplo concreto (una ciudad que conozcas o sobre la que leíste), tené en cuenta la posición contraria y terminá con una propuesta. Registro formal, nominalizaciones (l'aumento, la riduzione…), conectores variados y al menos una frase con congiuntivo.",
        rubric: [
          ["adeguatezza", "Cumple la consigna: toma posición, dos argumentos y un ejemplo; registro formal"],
          ["coesione", "Conectores variados y párrafos con una idea cada uno"],
          ["correttezza", "Gramática: concordancias, tiempos, congiuntivo, preposiciones"],
          ["lessico", "Riqueza y precisión: léxico C1, sin calcos del castellano"]
        ]
      },
      {
        id: "scr-6",
        kind: "formale",
        words: 180,
        min: 160,
        max: 200,
        t: "Querés inscribirte en un posgrado de una universidad italiana, pero en la página web faltan datos. Escribí un mail formal en italiano (160-200 palabras) a la secretaría del posgrado: presentate (estudios, trabajo, nivel de italiano), explicá por qué te interesa el curso y pedí información precisa sobre tres puntos (requisitos de admisión, costos y becas, posibilidad de cursar parte a distancia). Usá el «Lei», una apertura y un cierre adecuados y fórmulas como «Le scrivo per chiedere…», «Le sarei grato/a se potesse…», «in attesa di un cortese riscontro».",
        rubric: [
          ["adeguatezza", "Estructura de carta formal: apertura, presentación, motivo, pedido con plazo, cierre"],
          ["coesione", "Orden lógico y conectores formales"],
          ["correttezza", "Gramática: «Lei» coherente, tiempos, pronombres"],
          ["lessico", "Fórmulas del registro formal-burocrático, sin expresiones coloquiales"]
        ]
      }
    ],

    monologhi: [
      {
        id: "mon-1",
        title: "Lezione pubblica: l'acqua che perdiamo",
        genre: "conferenza",
        speaker: "Relatrice, ingegnera idraulica",
        voice: 1,
        text: [
          "Buonasera a tutti, e grazie di essere venuti così numerosi. Stasera vorrei parlarvi di un tema che sembra tecnico, ma che riguarda ognuno di noi ogni volta che apre il rubinetto: l'acqua che si perde prima di arrivare nelle nostre case. Cercherò di essere breve, e alla fine lascerò spazio alle vostre domande.",
          "Partiamo da un dato. Nella provincia di Valmarina, secondo l'ultimo rapporto del consorzio idrico, su cento litri d'acqua immessi nella rete ne arrivano ai rubinetti poco più di sessanta. Gli altri, più o meno trentotto, si perdono lungo il percorso: per tubature rotte, giunti consumati, allacciamenti abusivi o semplici errori di misura. Detto in altro modo: quasi quattro litri su dieci vanno sprecati prima ancora che qualcuno li usi.",
          "Perché succede? La ragione principale è l'età della rete. Una parte consistente delle nostre tubature è stata posata negli anni Sessanta e Settanta, durante il grande sviluppo edilizio, e da allora è stata rinnovata soltanto in piccola parte. Oggi l'età media dei tubi supera i quarantacinque anni. Per darvi un'idea: per mantenere la rete in buono stato bisognerebbe sostituirne almeno il due per cento all'anno; negli ultimi dieci anni ne abbiamo sostituito, in media, lo zero virgola sei.",
          "C'è poi un problema meno visibile, che è quello delle informazioni. Molti piccoli comuni non hanno ancora una mappa digitale delle proprie condutture: quando un tubo si rompe, si scava dove si pensa che passi, e a volte si sbaglia. È una delle ragioni per cui una riparazione, che dovrebbe richiedere poche ore, in certi casi dura tre o quattro giorni.",
          "Che cosa si sta facendo? Le buone notizie ci sono. Da due anni il consorzio sta installando sensori acustici che «ascoltano» le tubature di notte, quando il consumo è minimo, e segnalano i rumori tipici di una perdita. Nei quartieri in cui sono stati installati, le perdite si sono ridotte di un terzo in diciotto mesi. Il piano prevede di coprire tutta la provincia entro il 2030, con una spesa di circa ventidue milioni di euro, in parte finanziati dall'Unione europea.",
          "E noi cittadini? Qualcuno potrebbe pensare che il problema non ci riguardi, visto che le perdite avvengono prima dei nostri contatori. Non è così, per almeno due motivi. Il primo è economico: l'acqua persa si paga comunque, attraverso la bolletta. Il secondo è ambientale: negli ultimi tre anni la provincia ha vissuto due estati di siccità, e in alcuni comuni l'acqua è stata razionata di notte. Ogni litro che non si perde è un litro che resta nelle falde.",
          "Anche in casa, del resto, qualcosa si può fare. Un rubinetto che gocciola spreca fino a cinquemila litri all'anno; uno sciacquone che perde, anche di più. Controllare i propri impianti, installare riduttori di flusso e segnalare subito le perdite che si vedono per strada sono gesti piccoli, ma sommati fanno una differenza enorme.",
          "Concludo con un invito. Il consorzio ha appena attivato un numero verde e un'applicazione per segnalare le perdite: si fotografa la pozzanghera sospetta, si invia la posizione e, in media, una squadra interviene entro quarantotto ore. Usateli. L'acqua è l'unica risorsa di cui non possiamo fare a meno, e forse è anche quella che abbiamo imparato a dare più per scontata. Grazie, e ora sono pronta per le vostre domande."
        ],
        tabella: [
          ["Litri che arrivano ai rubinetti, su cento immessi nella rete", "poco più di sessanta", ["60", "sessanta", "piu di 60", "poco più di 60", "più di sessanta"]],
          ["Età media delle tubature (anni)", "45", ["quarantacinque", "più di 45", "oltre 45"]],
          ["Percentuale della rete da sostituire ogni anno", "2", ["due", "2%", "due per cento", "almeno il 2"]],
          ["Percentuale sostituita in media negli ultimi dieci anni", "0,6", ["0.6", "zero virgola sei", "0,6%"]],
          ["Riduzione delle perdite dove ci sono i sensori", "un terzo", ["1/3", "di un terzo", "33%"]],
          ["Anno entro cui i sensori copriranno la provincia", "2030", ["entro il 2030"]],
          ["Costo del piano (milioni di euro)", "22", ["ventidue", "22 milioni", "circa 22"]],
          ["Litri sprecati in un anno da un rubinetto che gocciola", "5000", ["5.000", "cinquemila", "fino a 5000"]],
          ["Tempo medio di intervento dopo una segnalazione (ore)", "48", ["quarantotto", "48 ore", "entro 48 ore"]]
        ]
      },
      {
        id: "mon-2",
        title: "Giornale radio regionale della sera",
        genre: "notiziario",
        speaker: "Speaker",
        voice: 0,
        text: [
          "Giornale radio regionale, edizione delle diciannove e trenta. Buonasera. Questi i titoli: domani sciopero di otto ore nel trasporto pubblico; apre a Pontedera la nuova casa della comunità; al via le iscrizioni ai nidi comunali; e, in chiusura, il tempo per il fine settimana.",
          "Cominciamo dai trasporti. Domani, venerdì, autobus e treni regionali si fermeranno per otto ore, dalle nove alle diciassette, per lo sciopero proclamato dai sindacati contro i tagli al servizio annunciati dalla Regione. Saranno garantite le fasce del mattino e del tardo pomeriggio, fino alle nove e dopo le diciassette. Secondo le aziende di trasporto potrebbero saltare fino a sette corse su dieci. L'assessore ai trasporti si è detto disponibile a un nuovo incontro già la settimana prossima, ma i sindacati chiedono che prima i tagli vengano ritirati.",
          "Sanità. È stata inaugurata stamattina a Pontedera la prima casa della comunità della provincia: una struttura in cui lavoreranno insieme medici di famiglia, infermieri, pediatri e assistenti sociali, aperta sette giorni su sette, dalle otto alle venti. L'obiettivo, ha spiegato la direttrice dell'azienda sanitaria, è ridurre gli accessi impropri al pronto soccorso, che l'anno scorso sono stati circa il quaranta per cento del totale. Entro la fine dell'anno prossimo le case della comunità della provincia dovrebbero diventare sei.",
          "Scuola. Si aprono lunedì 12 le iscrizioni ai nidi comunali per il prossimo anno educativo. Le domande si presentano soltanto online, fino al 15 marzo. Quest'anno i posti disponibili sono trecentoventi, quaranta in più rispetto all'anno scorso, grazie all'apertura di due nuove strutture nei quartieri di Porta a Lucca e San Martino. Il Comune ricorda che le famiglie con un reddito basso possono chiedere una riduzione della retta fino al settanta per cento.",
          "Lavoro. Buone notizie per i centoventi dipendenti della cartiera di Lucca: dopo tre mesi di cassa integrazione, l'azienda è stata acquistata da un gruppo tedesco, che si è impegnato a mantenere tutti i posti di lavoro per almeno cinque anni e a investire quindici milioni di euro in nuovi macchinari. I sindacati parlano di una soluzione «migliore di quanto sperassimo», ma chiedono che gli impegni vengano messi per iscritto. La produzione dovrebbe ripartire a pieno ritmo entro l'estate.",
          "Cronaca. A Viareggio i vigili del fuoco sono intervenuti nel pomeriggio per un incendio in un capannone del porto. Le fiamme, partite probabilmente da un corto circuito, sono state spente in circa due ore; non ci sono feriti, ma per precauzione sono state fatte uscire le famiglie delle case vicine. La strada del porto resterà chiusa al traffico fino a domani mattina.",
          "Cultura. Resterà aperta fino al 30 giugno, al Palazzo Blu, la mostra dedicata ai fotografi italiani del dopoguerra: oltre centocinquanta immagini, molte delle quali mai esposte prima. Nel primo fine settimana i visitatori sono stati più di quattromila. Il biglietto intero costa dodici euro; l'ingresso è gratuito per i minori di diciotto anni e, la prima domenica del mese, per tutti.",
          "Sport. Vittoria in trasferta per la squadra di basket cittadina, che ha battuto il Livorno ottantasei a settantanove e sale al terzo posto in classifica. Domenica la sfida decisiva, in casa, contro la capolista.",
          "Il tempo. Domani nuvole in aumento, con piogge dal pomeriggio sulla costa e sulle colline; sabato peggioramento generale, con possibili temporali e un calo delle temperature di cinque o sei gradi. Domenica dovrebbe tornare il sole, ma con venti forti di tramontana. È tutto: il prossimo notiziario è alle ventuno. Buona serata."
        ],
        tabella: [
          ["Durata dello sciopero (ore)", "8", ["otto", "otto ore"]],
          ["Corse che potrebbero saltare", "7 su 10", ["sette su dieci", "70%", "sette corse su dieci"]],
          ["Città della nuova casa della comunità", "Pontedera", []],
          ["Orario di apertura della casa della comunità", "8-20", ["dalle 8 alle 20", "dalle otto alle venti", "8 20"]],
          ["Accessi impropri al pronto soccorso l'anno scorso (%)", "40", ["quaranta", "40%", "circa il 40"]],
          ["Ultimo giorno per iscriversi ai nidi", "15 marzo", ["il 15 marzo", "quindici marzo"]],
          ["Posti disponibili nei nidi", "320", ["trecentoventi"]],
          ["Dipendenti della cartiera di Lucca", "120", ["centoventi"]],
          ["Investimento del gruppo tedesco (milioni di euro)", "15", ["quindici", "15 milioni"]],
          ["Riduzione massima della retta (%)", "70", ["settanta", "70%", "fino al 70"]],
          ["Prezzo del biglietto intero della mostra (euro)", "12", ["dodici"]],
          ["Risultato della partita di basket", "86-79", ["86 a 79", "ottantasei a settantanove", "86 79"]]
        ]
      },
      {
        id: "mon-3",
        title: "Giornata di orientamento: un corso di laurea",
        genre: "presentazione",
        speaker: "Coordinatrice del corso",
        voice: 1,
        text: [
          "Buongiorno, e benvenuti alla giornata di orientamento dell'Università di Monteverde. Sono Francesca Galli, coordinatrice del corso di laurea triennale in Lingue e culture per il turismo. Nei prossimi minuti vi spiegherò come è organizzato il corso, come ci si iscrive e che cosa fanno i nostri laureati. Alla fine ci sarà tempo per le domande, e poi potrete visitare le aule con i nostri tutor.",
          "Il corso dura tre anni e prevede centottanta crediti formativi, cioè sessanta all'anno. Le lingue sono il cuore del percorso: ogni studente ne sceglie due, tra inglese, spagnolo, francese, tedesco e cinese, e le studia per tutti e tre gli anni. Accanto alle lingue ci sono materie come geografia del turismo, economia, diritto e storia dell'arte. Le lezioni si tengono in presenza, ma molte vengono anche registrate, cosa che aiuta chi lavora.",
          "Una caratteristica del nostro corso è il tirocinio obbligatorio. Al terzo anno ogni studente passa almeno trecento ore in un'azienda, in un museo, in un'agenzia di viaggi o in un ente pubblico, in Italia o all'estero. Abbiamo convenzioni con più di centoventi strutture, e molti studenti ricevono proprio lì la prima offerta di lavoro.",
          "Un'altra opportunità che i nostri studenti apprezzano molto è la mobilità internazionale. Grazie al programma Erasmus e agli accordi con alcune università extraeuropee, ogni anno circa novanta studenti passano un semestre all'estero, spesso in un paese di cui studiano la lingua. Gli esami sostenuti fuori vengono riconosciuti, e la borsa di studio copre una parte delle spese. Il mio consiglio è di non perdere questa occasione: sei mesi all'estero valgono, per la lingua, quanto due anni di lezioni.",
          "Veniamo all'accesso. Il corso è a numero programmato: quest'anno i posti sono duecentocinquanta. Per iscriversi bisogna sostenere un test di ingresso, che si svolge online, con domande di comprensione del testo, di logica e di inglese. Il test si può sostenere in tre date, a febbraio, ad aprile e a luglio, e conta il punteggio migliore. Le iscrizioni al test si chiudono dieci giorni prima di ciascuna data. Per prepararvi, sul sito trovate una simulazione gratuita, con le domande degli anni passati.",
          "Un capitolo che interessa molte famiglie è quello dei costi. Le tasse universitarie dipendono dal reddito: si va da zero, per chi ha un reddito familiare basso, fino a un massimo di duemilacento euro all'anno. Chi ha una media alta e ha dato tutti gli esami in tempo può ottenere un'ulteriore riduzione del venti per cento. Esistono poi borse di studio regionali e alloggi nello studentato, che vanno richiesti a parte, di solito entro la fine di agosto.",
          "E dopo la laurea? Secondo la nostra ultima indagine, a un anno dal titolo lavora il settantotto per cento dei laureati. Molti trovano posto nel turismo e nell'accoglienza, ma anche nelle aziende che lavorano con l'estero, nelle istituzioni culturali e nell'organizzazione di eventi. Circa un terzo, invece, decide di continuare con una laurea magistrale, spesso in un'altra università o all'estero.",
          "Un'ultima informazione pratica. Per gli studenti internazionali, che quest'anno sono circa il quindici per cento degli iscritti, è previsto un corso gratuito di italiano prima dell'inizio delle lezioni, a settembre. Le lezioni del primo anno cominciano il primo ottobre. Trovate tutte le date, il bando e i contatti sul sito del corso. Chi non può venire alla prossima giornata di orientamento, il 14 marzo, può seguirla in diretta sul canale dell'università. E ora, se ci sono domande, sono a vostra disposizione."
        ],
        tabella: [
          ["Crediti formativi in tutto", "180", ["centottanta"]],
          ["Lingue che ogni studente sceglie (numero)", "2", ["due"]],
          ["Ore minime di tirocinio", "300", ["trecento"]],
          ["Strutture convenzionate (più di…)", "120", ["centoventi", "più di 120"]],
          ["Studenti che ogni anno passano un semestre all'estero", "90", ["novanta", "circa 90", "circa novanta"]],
          ["Posti disponibili quest'anno", "250", ["duecentocinquanta"]],
          ["Tassa massima all'anno (euro)", "2100", ["2.100", "duemilacento"]],
          ["Laureati che lavorano dopo un anno (%)", "78", ["settantotto", "78%"]],
          ["Studenti internazionali (%)", "15", ["quindici", "15%", "circa il 15"]],
          ["Giorno di inizio delle lezioni", "1 ottobre", ["primo ottobre", "il primo ottobre", "1° ottobre"]]
        ]
      }
    ],

    ricostruzione: [
      {
        id: "ric-1",
        title: "La leggenda della pizza margherita",
        paragraphs: [
          "Poche cose sono italiane quanto la pizza margherita. Eppure la sua storia, come quella di molti simboli nazionali, è fatta di documenti, ma anche di leggende.",
          "Secondo il racconto più diffuso, tutto cominciò nel giugno del 1889, quando la regina Margherita di Savoia si trovava in visita a Napoli e volle assaggiare la specialità più famosa della città.",
          "Per l'occasione, il pizzaiolo Raffaele Esposito preparò tre pizze diverse. La regina apprezzò soprattutto quella con pomodoro, mozzarella e basilico, che ricordava i colori della bandiera italiana.",
          "Da quel giorno, si dice, quella pizza prese il nome della sovrana. Esposito, orgoglioso, conservò una lettera di ringraziamento della casa reale, che ancora oggi viene mostrata ai visitatori.",
          "Negli ultimi anni, però, alcuni storici hanno messo in dubbio questa versione. Hanno fatto notare che pizze con gli stessi ingredienti esistevano già da decenni e che l'autenticità della lettera non è del tutto certa.",
          "Vera o no, la leggenda ha avuto un successo straordinario. Ha trasformato un piatto povero dei vicoli napoletani in un simbolo dell'Italia unita, e oggi la margherita si mangia, con piccole varianti, in tutto il mondo."
        ]
      },
      {
        id: "ric-2",
        title: "Come si scrive un reclamo efficace",
        paragraphs: [
          "Scrivere un reclamo è un'arte che si impara. Un testo chiaro e cortese ottiene quasi sempre risultati migliori di uno sfogo pieno di rabbia.",
          "Innanzitutto, bisogna individuare il destinatario giusto: l'ufficio clienti, un responsabile preciso o, nei casi più gravi, un'associazione dei consumatori. Scrivere a un indirizzo generico significa, molto spesso, non ricevere risposta.",
          "In secondo luogo, occorre presentarsi e descrivere i fatti in modo ordinato: che cosa si è acquistato, quando, a quale prezzo e che cosa non ha funzionato. Le date e i numeri di pratica vanno indicati con precisione.",
          "A questo punto si può esprimere il proprio disagio, ma senza esagerare. Gli insulti e le minacce non aiutano; una frase ferma, come «trovo inaccettabile questo ritardo», è molto più efficace.",
          "Poi viene la parte più importante: la richiesta. Bisogna dire chiaramente che cosa si desidera, un rimborso, una sostituzione o una riparazione, e indicare un termine ragionevole entro cui si attende una risposta.",
          "Infine, è utile allegare copia dei documenti, come la ricevuta o il contratto, e chiudere con una formula di cortesia. Conservare una copia del reclamo, con la data di invio, può rivelarsi decisivo se la questione dovesse finire davanti a un giudice."
        ]
      },
      {
        id: "ric-3",
        title: "Il portafoglio",
        paragraphs: [
          "Quella mattina Andrea uscì di casa più tardi del solito e corse verso la fermata dell'autobus, con il caffè ancora in gola.",
          "Proprio mentre attraversava la piazza, notò per terra, accanto a una panchina, un portafoglio di pelle marrone, gonfio di carte.",
          "Lo raccolse e lo aprì con una certa esitazione. Dentro c'erano duecento euro, una carta d'identità e la fotografia di due bambini sorridenti.",
          "Per un attimo pensò di lasciarlo al bar lì vicino; poi, guardando l'indirizzo sul documento, si accorse che il proprietario abitava a due strade di distanza.",
          "Decise così di rinunciare all'autobus. Suonò al citofono e gli aprì un uomo anziano, pallido, che da un'ora cercava il portafoglio dappertutto.",
          "Quando lo vide, l'uomo gli strinse le mani senza riuscire a parlare. Andrea arrivò in ufficio con quaranta minuti di ritardo, ma quel giorno, per la prima volta da mesi, non gliene importò niente."
        ]
      }
    ],

    versioni: [
      {"id": "A", "ascolto": "asc-1", "monologo": "mon-1", "lettura": "let-1", "ricostruzione": "ric-1", "scrittura": ["scr-1", "scr-2"]},
      {"id": "B", "ascolto": "asc-2", "monologo": "mon-2", "lettura": "let-2", "ricostruzione": "ric-2", "scrittura": ["scr-3", "scr-4"]},
      {"id": "C", "ascolto": "asc-3", "monologo": "mon-3", "lettura": "let-3", "ricostruzione": "ric-3", "scrittura": ["scr-5", "scr-6"]}
    ]
  };
  // Una versione con gli oggetti al posto degli id (vedi la forma dei dati in cima).
  function find(list, id) { for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i]; return null; }
  ESAME.versione = function (id) {
    var v = find(ESAME.versioni, id);
    if (!v) return null;
    return { id: v.id, ascolto: find(ESAME.ascolto, v.ascolto), monologo: find(ESAME.monologhi, v.monologo),
             lettura: find(ESAME.lettura, v.lettura), ricostruzione: find(ESAME.ricostruzione, v.ricostruzione),
             scrittura: v.scrittura.map(function (x) { return find(ESAME.scritture, x); }) };
  };
  // La schermata di oggi mostra «scrittura»: la coppia della versione A.
  ESAME.scrittura = ESAME.versione("A").scrittura;
  if (typeof module === "object" && module.exports) module.exports = ESAME; else root.EsameData = ESAME;
})(typeof window !== "undefined" ? window : globalThis);
