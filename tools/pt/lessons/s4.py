# -*- coding: utf-8 -*-
"""Estação 4 — O Cume (semanas 40-52, B2 → C1)."""

LESSONS = {

40: {
"intro": "Vas a escribir como en un informe: sustantivos en vez de verbos, "
         "*há* en vez de *tem* y verbos formales. Es el registro de la "
         "facultad y de la oficina.",
"parts": [
 {"h": "De verbo a sustantivo", "blocks": [0, 1, 2]},
 {"h": "haver y los verbos del informe", "blocks": [3, 4]},
 {"h": "Sin repetir y sin «yo»", "blocks": [5, 6, 7]},
],
"blocks": [
 {"h": "-ção y -mento: el verbo hecho sustantivo",
  "r": "Muchos verbos dan un sustantivo en *-ção* (femenino) o en *-mento* "
       "(masculino): *decidir → a decisão*, *aumentar → o aumento*.",
  "table": {"head": ["Verbo", "Sustantivo", "Español"],
            "rows": [["decidir", "a decisão", "la decisión"],
                     ["reduzir", "a redução", "la reducción"],
                     ["informar", "a informação", "la información"],
                     ["investir", "o investimento", "la inversión"],
                     ["aumentar", "o aumento", "el aumento"],
                     ["pagar", "o pagamento", "el pago"],
                     ["crescer", "o crescimento", "el crecimiento"]]},
  "ex": [["A *decisão* da prefeitura saiu ontem.", "La decisión de la intendencia salió ayer."],
         ["O *aumento* da passagem do metrô preocupa.", "El aumento del boleto del metro preocupa."],
         ["O *pagamento* deve ser feito até sexta.", "El pago debe hacerse hasta el viernes."]],
  "warn": "*-ción* → *-ção*, plural *-ções* (*as decisões*); *-miento* → "
          "*-mento*, sin i: *o investimento*, nunca «investimiento»."},

 {"h": "Los que no siguen el molde",
  "q": [{"prompt": "Elegí el sustantivo de «analisar».", "stem": "___ dos resultados será publicada amanhã.", "answer": "A análise", "options": ["A análise", "O análise", "O analisamento"]}],
  "r": "Otros salen del verbo sin sufijo o con uno propio: *analisar → a "
       "análise*, *pesquisar → a pesquisa*, *vender → a venda*.",
  "table": {"head": ["Verbo", "Sustantivo", "Español"],
            "rows": [["analisar", "a análise", "el análisis"],
                     ["pesquisar", "a pesquisa", "la investigación, la encuesta"],
                     ["vender", "a venda", "la venta"],
                     ["perder", "a perda", "la pérdida"],
                     ["escolher", "a escolha", "la elección"],
                     ["debater", "o debate", "el debate"],
                     ["cortar", "o corte", "el corte"]]},
  "ex": [["A *análise* dos dados levou um mês.", "El análisis de los datos llevó un mes."],
         ["A *pesquisa* ouviu dois mil cariocas.", "La encuesta consultó a dos mil cariocas."],
         ["A *venda* de ingressos para o Maracanã começa hoje.", "La venta de entradas para el Maracanã empieza hoy."],
         ["A *perda* de turistas foi pequena.", "La pérdida de turistas fue pequeña."]],
  "warn": "*a análise* es **femenino** (el análisis): *a análise completa*. "
          "Y *pesquisa* es investigación o encuesta, no «pesquisa» policial."},

 {"h": "La frase nominal: el estilo del informe",
  "q": [{"prompt": "En estilo de informe: «Os preços aumentaram.»", "answer": "O aumento dos preços", "options": ["O aumento dos preços", "O aumento de os preços", "O aumentar dos preços"]}, {"prompt": "En estilo de informe: «O museu fechou.»", "answer": "O fechamento do museu", "options": ["O fechamento do museu", "O fechamento de o museu", "O fechar do museu"]}],
  "r": "El informe convierte la oración en un sustantivo con *de*: *os "
       "preços aumentaram → o aumento dos preços*.",
  "ex": [["Os preços aumentaram. → *O aumento dos preços*.", "Los precios subieron. → El aumento de los precios."],
         ["A orla foi reformada. → *A reforma da orla*.", "La costanera fue reformada. → La reforma de la costanera."],
         ["O museu fechou. → *O fechamento do museu*.", "El museo cerró. → El cierre del museo."],
         ["Decidiram ampliar o BRT. → *A decisão de ampliar o BRT*.", "Decidieron ampliar el BRT. → La decisión de ampliar el BRT."],
         ["A Constituição foi promulgada em 1988. → *A promulgação da Constituição*, em 1988...", "La Constitución se promulgó en 1988. → La promulgación de la Constitución, en 1988..."]],
  "warn": "*de + o = do*: *o aumento dos preços*, nunca «de os preços». "
          "Ante infinitivo con sujeto, la norma no contrae: *antes de o "
          "museu fechar*.",
  "tip": "*fechar → o fechamento* (el cierre), *abrir → a abertura*, "
         "*encerrar → o encerramento*: muy de noticia."},

 {"h": "haver existencial: há, havia, houve",
  "q": [{"prompt": "Elegí la forma de la norma culta.", "stem": "No último fim de semana ___ três shows na Lapa.", "answer": "houve", "options": ["houve", "houveram", "tiveram"]}],
  "r": "En lo escrito, «hay» es *há*, no *tem*. El *haver* existencial va "
       "siempre en **singular**: *há problemas*, *houve protestos*.",
  "table": {"head": ["Habla", "Escritura", "Español"],
            "rows": [["tem", "há", "hay"],
                     ["tinha", "havia", "había"],
                     ["teve", "houve", "hubo"],
                     ["vai ter", "haverá", "habrá"],
                     ["pode ter", "pode haver", "puede haber"]]},
  "ex": [["*Há* muitas reclamações sobre o VLT.", "Hay muchas quejas sobre el VLT."],
         ["*Haverá* shows na orla no Réveillon.", "Habrá shows en la costanera en Año Nuevo."],
         ["*Havia* poucas pessoas no calçadão.", "Había poca gente en la rambla."],
         ["*Pode haver* atrasos no metrô.", "Puede haber demoras en el metro."],
         ["*Houve* resistência à escravidão em todo o Brasil colonial.", "Hubo resistencia a la esclavitud en todo el Brasil colonial."]],
  "warn": "Como «habían muchas personas» en español, «*haviam* muitas "
          "pessoas» es error: *havia*. El auxiliar también queda en "
          "singular: *pode haver*, *deve haver*."},

 {"h": "Verbos del informe: realizar, efetuar, proceder a, constatar",
  "q": [{"prompt": "Completá.", "stem": "A equipe procedeu ___ vistoria do prédio.", "answer": "à", "options": ["à", "a", "na"]}],
  "r": "El informe cambia *fazer* por verbos precisos: *realizar* un "
       "evento, *efetuar* un pago, *proceder a* un trámite, *constatar* un "
       "hecho.",
  "table": {"head": ["Habla", "Informe", "Español"],
            "rows": [["fazer uma reunião", "realizar uma reunião", "realizar una reunión"],
                     ["pagar", "efetuar o pagamento", "efectuar el pago"],
                     ["começar a analisar", "proceder à análise", "proceder al análisis"],
                     ["ver, perceber", "constatar, verificar", "comprobar, verificar"],
                     ["dar", "conceder, fornecer", "otorgar, proporcionar"],
                     ["mostrar", "demonstrar, evidenciar", "demostrar, poner en evidencia"]]},
  "ex": [["A reunião *foi realizada* no Centro.", "La reunión se realizó en el Centro."],
         ["O pagamento *deve ser efetuado* até o dia 10.", "El pago debe efectuarse hasta el día 10."],
         ["A comissão *procedeu à* análise dos contratos.", "La comisión procedió al análisis de los contratos."],
         ["*Constatou-se* que a água estava poluída.", "Se comprobó que el agua estaba contaminada."],
         ["A prefeitura *forneceu* os dados, que *evidenciam* o atraso.", "La intendencia proporcionó los datos, que ponen en evidencia el atraso."]],
  "warn": "*proceder a* rige *a*: ante femenino, crase (*procedeu à "
          "análise*); ante masculino, *ao* (*procedeu ao pagamento*)."},

 {"h": "Sin repetir: sinónimos y pronombres",
  "q": [{"prompt": "Elegí cómo retomar «os dados» sin repetir.", "stem": "Recebemos os dados e ___ enviamos à diretoria.", "answer": "os", "options": ["os", "lhes", "eles"]}],
  "r": "El texto formal no repite el sustantivo: usa un **sinónimo**, un "
       "pronombre (*o, a, os*) o *este / aquele* para retomarlo.",
  "ex": [["Gilberto Freyre publicou *Casa-Grande & Senzala* em 1933. *O sociólogo pernambucano*...", "Gilberto Freyre publicó Casa-Grande & Senzala en 1933. El sociólogo de Pernambuco..."],
         ["Os técnicos analisaram os dados e *os* publicaram.", "Los técnicos analizaron los datos y los publicaron."],
         ["Ipanema e Leblon são vizinhos; *este* é mais caro que *aquele*.", "Ipanema y Leblon son vecinos; este es más caro que aquel."],
         ["A lei foi aprovada em 2020. *A referida* lei prevê multas.", "La ley se aprobó en 2020. La mencionada ley prevé multas."]],
  "warn": "Evitá *o mesmo* como pronombre: «verifique se *o mesmo* está "
          "parado» (el ascensor) suena burocrático y la norma lo critica. "
          "Mejor: *se ele está parado*.",
  "tip": "*este* retoma lo último nombrado; *aquele*, lo primero: igual que "
         "«este / aquel» en español."},

 {"h": "Impersonalidad: constata-se, observa-se",
  "q": [{"prompt": "¿Cuál va en un informe?", "answer": "Realizaram-se três reuniões.", "options": ["Realizaram-se três reuniões.", "Realizou-se três reuniões.", "Eu acho que teve três reuniões."]}, {"prompt": "¿Cuál va en un informe?", "answer": "Observa-se um aumento das chuvas.", "options": ["Observa-se um aumento das chuvas.", "Se observa um aumento das chuvas.", "Eu observo um aumento das chuvas."]}],
  "r": "El informe esconde al autor: pasiva con *se* (*observa-se*, "
       "*constatou-se*) o un *nós* de modestia (*analisamos*). Nada de *eu "
       "acho*.",
  "ex": [["*Observa-se* um aumento das chuvas.", "Se observa un aumento de las lluvias."],
         ["*Verificou-se* que o prazo era curto.", "Se verificó que el plazo era corto."],
         ["*Realizaram-se* três reuniões.", "Se realizaron tres reuniones."],
         ["Neste trabalho, *analisamos* o «homem cordial» de Sérgio Buarque.", "En este trabajo analizamos el «hombre cordial» de Sérgio Buarque."]],
  "warn": "Con plural, concordá: *observam-se mudanças*, *realizaram-se "
          "três reuniões*. «Realizou-se três reuniões» se oye, pero en el "
          "informe es error.",
  "more": ["Al principio de la oración, la norma pide ênclise (*Observa-se*), "
           "y así aparece en informes y tesis. Dentro de la oración, tras "
           "*que* o una negación, el pronombre sube: *nota-se que não se "
           "fez nada*."]},

 {"h": "Sotaque da semana: Maputo",
  "q": [{"prompt": "En Maputo, ¿qué es o machimbombo?", "answer": "el colectivo", "options": ["el colectivo", "el mercado", "el tambor"]}],
  "r": "En Mozambique el portugués convive con el changana y otras lenguas bantúes; la gramática sigue la norma europea: *estou a trabalhar*.",
  "ex": [["Apanhei o *machimbombo* às sete.", "Tomé el colectivo a las siete. (Brasil: ônibus)"], ["*Estou a trabalhar* na baixa.", "Estoy trabajando en el centro."], ["Vamos comer *matapa*?", "¿Comemos matapa? (hojas de mandioca con maní)"]],
  "tip": "Mia Couto, el escritor mozambiqueño que vas a leer en la 51, juega con este portugués."},

]},

41: {
"intro": "Vas a leer el pluscuamperfecto de los libros: *fizera*, *dissera*. "
         "Parece un subjuntivo español, pero es indicativo y significa "
         "«había hecho».",
"parts": [
 {"h": "fizera, dissera: forma y trampa", "blocks": [0, 1]},
 {"h": "Tres formas para un pasado anterior", "blocks": [2, 3]},
 {"h": "Expresiones fijas y narración", "blocks": [4, 5]},
],
"blocks": [
 {"h": "Cómo se forma",
  "r": "Tomá la 3.ª plural del perfeito, sacá *-ram* y agregá *-ra, -ras, "
       "-ra, -ramos, -reis, -ram*: *fizeram → fizera*.",
  "table": {"head": ["", "falar", "comer", "fazer", "ser / ir"],
            "rows": [["eu", "falara", "comera", "fizera", "fora"],
                     ["tu", "falaras", "comeras", "fizeras", "foras"],
                     ["ele / você", "falara", "comera", "fizera", "fora"],
                     ["nós", "faláramos", "comêramos", "fizéramos", "fôramos"],
                     ["eles / vocês", "falaram", "comeram", "fizeram", "foram"]]},
  "ex": [["Quando cheguei, ele já *saíra*.", "Cuando llegué, él ya había salido."],
         ["Ela nunca *vira* o mar antes.", "Ella nunca había visto el mar antes."],
         ["Nós já *fizéramos* tudo.", "Nosotros ya habíamos hecho todo."]],
  "warn": "La 1.ª plural lleva tilde: *faláramos*, *comêramos*, "
          "*fizéramos*, *fôramos*. Y la 3.ª plural es idéntica al perfeito: "
          "*falaram* es «hablaron» o «habían hablado».",
  "tip": "Se usa para lo anterior a otro pasado (= *tinha feito*), casi solo "
         "en literatura y prensa. Hablando, *tinha feito*: lo ves en esta "
         "semana."},

 {"h": "La trampa: -ra no es subjuntivo",
  "q": [{"prompt": "¿Qué significa «ele fizera»?", "answer": "él había hecho", "options": ["él había hecho", "él hiciera", "él haría"]},
        {"prompt": "«Si pudiera, viajaría.»", "stem": "Se eu ___, viajaria.", "answer": "pudesse", "options": ["pudesse", "pudera", "puder"]}],
  "r": "En español *hablara* es subjuntivo; en portugués *falara* es "
       "**indicativo** y vale «había hablado». El subjuntivo es *falasse*.",
  "ex": [["Ele *dissera* a verdade.", "Él había dicho la verdad (no «dijera»)."],
         ["Se eu *tivesse* tempo...", "Si tuviera tiempo... (nunca «se eu tivera»)."],
         ["Ela *chegara* tarde.", "Ella había llegado tarde."],
         ["Queria que você *viesse*.", "Quería que vinieras (nunca «viera»)."]],
  "warn": "«Si yo tuviera» → *se eu tivesse*. «Se eu tivera» es el calco "
          "más típico del hispanohablante: en Brasil suena a error o a "
          "texto muy antiguo."},

 {"h": "tinha feito, havia feito, fizera",
  "r": "*tinha feito* (habla), *havia feito* (escritura cuidada) y *fizera* "
       "(literatura) dicen lo mismo: algo anterior a otro pasado.",
  "table": {"head": ["Registro", "Forma", "Ejemplo"],
            "rows": [["habla", "tinha + participio", "Eu tinha saído."],
                     ["escrito cuidado", "havia + participio", "Eu havia saído."],
                     ["literario", "mais-que-perfeito simples", "Eu saíra."]]},
  "ex": [["Quando o bloco passou, eu já *tinha ido* embora.", "Cuando pasó la comparsa, yo ya me había ido."],
         ["O governo *havia prometido* obras.", "El gobierno había prometido obras."],
         ["A moça *partira* sem dizer nada.", "La muchacha había partido sin decir nada."]],
  "tip": "Para hablar y escribir vos, usá *tinha feito*. *fizera* es para "
         "**reconocerlo** cuando leés."},

 {"h": "Dónde lo vas a leer",
  "q": [{"prompt": "En una charla en el boteco, ¿qué suena natural?", "answer": "Eu já tinha visto esse filme.", "options": ["Eu já tinha visto esse filme.", "Eu já vira esse filme.", "Eu já tive visto esse filme."]}],
  "r": "En novelas y cuentos (Machado de Assis, Clarice Lispector), en "
       "crónicas y en la prensa escrita. En la charla casi no se oye.",
  "ex": [["O jornal informou que o incêndio *começara* de madrugada.", "El diario informó que el incendio había empezado de madrugada."],
         ["Quando Brás Cubas começa a narrar, já *morrera*.", "Cuando Brás Cubas empieza a narrar, ya había muerto."],
         ["A corte portuguesa *chegara* ao Rio em 1808.", "La corte portuguesa había llegado a Río en 1808."]],
  "warn": "*vira* puede ser «había visto» (de *ver*) o «da vuelta, se "
          "convierte» (de *virar*). El contexto decide.",
  "more": ["Machado de Assis (Río, 1839-1908) escribió *Memórias Póstumas de "
           "Brás Cubas* y *Dom Casmurro*; Clarice Lispector, nacida en "
           "Ucrania y criada en Recife, vivió en Río y escribió *A Hora da "
           "Estrela*. En los dos vas a cruzarte con *fizera*, *dissera*, "
           "*vira*."]},

 {"h": "Quem me dera! Tomara! Pudera!",
  "q": [{"prompt": "Completá.", "stem": "Tomara que o sol ___ amanhã no Arpoador.", "answer": "apareça", "options": ["apareça", "aparece", "aparecer"]}],
  "r": "Tres restos del mais-que-perfeito que sí se dicen en la calle: "
       "*quem me dera* (quién pudiera), *tomara que* (ojalá) y *pudera!* "
       "(¡con razón!).",
  "ex": [["*Quem me dera* morar em Ipanema!", "¡Quién pudiera vivir en Ipanema!"],
         ["*Tomara que* não chova no desfile.", "Ojalá no llueva en el desfile."],
         ["Ele está cansado. — *Pudera!* Trabalhou o dia todo.", "Está cansado. — ¡Con razón! Trabajó todo el día."],
         ["*Quem me dera* ter tempo!", "¡Ojalá tuviera tiempo!"]],
  "warn": "*tomara que* pide subjuntivo: *tomara que chova*, *tomara que "
          "você venha*. Nunca «tomara que vem»."},

 {"h": "Narrar con tres pasados",
  "r": "El *perfeito* hace avanzar la historia, el *imperfeito* pinta el "
       "fondo y el *mais-que-perfeito* salta hacia atrás.",
  "ex": [["*Era* uma noite quente em Santa Teresa.", "Era una noche calurosa en Santa Teresa (fondo)."],
         ["Joana *abriu* a janela.", "Joana abrió la ventana (avanza)."],
         ["Ninguém *dormira* naquela casa havia anos.", "Nadie había dormido en esa casa desde hacía años (antes)."],
         ["Pombal reconstruiu a Baixa que o terremoto de 1755 *destruíra*.", "Pombal reconstruyó la Baixa que el terremoto de 1755 había destruido."],
         ["Então ela lembrou que *deixara* a porta aberta.", "Entonces recordó que había dejado la puerta abierta."]],
  "warn": "El rioplatense usa poco el pluscuamperfecto («ya se fue» por «ya "
          "se había ido»). En el relato escrito en portugués, marcá la "
          "anterioridad.",
  "tip": "*havia anos* = hacía años: en un relato en pasado, *havia*, no "
         "*há*."},
]},

42: {
"intro": "Vas a condensar oraciones como en la crónica y la noticia: "
         "*chegando em casa*, *ao sair*, *terminada a reunião*. Menos "
         "*quando*, *porque* y *depois que*.",
"parts": [
 {"h": "Gerundio e infinitivo", "blocks": [0, 1, 2]},
 {"h": "El participio que abre la frase", "blocks": [3, 4, 5]},
 {"h": "Desarmar y armar", "blocks": [6, 7]},
],
"blocks": [
 {"h": "Reducida de gerundio",
  "r": "El gerundio reemplaza a *quando*, *como* (causa) o *se*: "
       "*chegando em casa, liguei* = cuando llegué a casa, llamé.",
  "ex": [["*Chegando* ao Leblon, pegue a primeira à direita.", "Al llegar a Leblon, tomá la primera a la derecha."],
         ["*Estando* cansada, ela foi embora cedo.", "Como estaba cansada, se fue temprano."],
         ["*Lendo* Os Sertões, a gente entende Canudos.", "Si uno lee Os Sertões, entiende Canudos."],
         ["*Terminando* o trabalho, vou à praia.", "Cuando termine el trabajo, voy a la playa."]],
  "warn": "Formas: *pondo* (pôr), *indo* (ir), *vindo* (vir), *lendo* "
          "(ler): nunca «poniendo», «yendo», «leyendo».",
  "more": ["Cuidado con el **gerundismo**: «vou estar enviando o relatório» "
           "(calco del inglés de call center) es muy criticado en Brasil. "
           "Decí *vou enviar* o *envio*."]},

 {"h": "ao + infinitivo = al + infinitivo",
  "q": [{"prompt": "«Al salir del Maracanã, llovía.»", "stem": "___ do Maracanã, chovia.", "answer": "Ao sair", "options": ["Ao sair", "Al sair", "No sair"]}],
  "r": "*ao* + infinitivo marca el momento, como «al llegar». También "
       "*antes de*, *depois de* y *após* (tras, después de) + infinitivo.",
  "ex": [["*Ao chegar* ao Galeão, troque dinheiro.", "Al llegar al Galeão, cambiá plata."],
         ["*Ao ver* o Cristo, ficou emocionado.", "Al ver el Cristo, se emocionó."],
         ["*Depois de almoçar*, fomos ao Pão de Açúcar.", "Después de almorzar, fuimos al Pan de Azúcar."],
         ["*Antes de sair*, feche a janela.", "Antes de salir, cerrá la ventana."],
         ["*Após votar*, o eleitor recebe o comprovante.", "Después de votar, el votante recibe el comprobante."]],
  "warn": "«al» → *ao*: *ao sair*, *ao entrar*. Es la misma contracción *a "
          "+ o* de *vou ao Rio*."},

 {"h": "Infinitivo pessoal en las reducidas",
  "r": "Si el sujeto de la reducida es otro o es plural, el infinitivo se "
       "conjuga: *ao chegarmos*, *depois de saírem*, *por serem*.",
  "ex": [["*Ao chegarmos* à Lapa, o samba já tinha começado.", "Cuando llegamos a Lapa, el samba ya había empezado."],
         ["*Depois de saírem* do show, eles foram ao boteco.", "Después de salir del show, fueron al bar."],
         ["*Por serem* baratas, as bicicletas fazem sucesso.", "Por ser baratas, las bicis tienen éxito."],
         ["*Apesar de estarmos* cansados, subimos o morro.", "A pesar de estar cansados, subimos el morro."]],
  "warn": "«Al llegar nosotros» → *ao chegarmos*: el español no conjuga el "
          "infinitivo, el portugués sí. Sin la *-mos*, el sujeto queda "
          "ambiguo."},

 {"h": "Reducida de participio",
  "q": [{"prompt": "Elegí la reducida equivalente.", "stem": "Depois que a festa acabou, fomos à praia. → ___, fomos à praia.", "answer": "Acabada a festa", "options": ["Acabada a festa", "Acabando a festa", "Acabado a festa"]}],
  "r": "Participio + sujeto al principio: *terminada a reunião, saímos* = "
       "cuando terminó la reunión. Cuenta algo ya cumplido.",
  "ex": [["*Terminada* a reunião, saímos.", "Terminada la reunión, salimos."],
         ["*Encerrado* o carnaval, a cidade volta à rotina.", "Terminado el carnaval, la ciudad vuelve a la rutina."],
         ["*Feito* o pagamento, você recebe o ingresso.", "Hecho el pago, recibís la entrada."],
         ["*Proclamada* a República, a família imperial partiu para o exílio.", "Proclamada la República, la familia imperial partió al exilio."]],
  "tip": "Leela como «una vez que»: *uma vez terminada a reunião*."},

 {"h": "El participio concuerda con su sujeto",
  "r": "El participio concuerda en género y número con el sustantivo que "
       "sigue: *feitas as contas*, *abertas as inscrições*.",
  "table": {"head": ["Masc. sing.", "Fem. sing.", "Masc. pl.", "Fem. pl."],
            "rows": [["feito o bolo", "feita a conta", "feitos os planos", "feitas as contas"],
                     ["aberto o bar", "aberta a porta", "abertos os portões", "abertas as inscrições"],
                     ["resolvido o caso", "resolvida a questão", "resolvidos os casos", "resolvidas as questões"]]},
  "ex": [["*Feitas* as contas, sobrou pouco.", "Hechas las cuentas, sobró poco."],
         ["*Abertas* as inscrições, a fila dobrou a esquina.", "Abiertas las inscripciones, la fila dobló la esquina."],
         ["*Resolvidos* os problemas, a obra continuou.", "Resueltos los problemas, la obra siguió."]],
  "warn": "Con participios dobles, la reducida usa el **corto**: *pago o "
          "boleto*, *aceito o convite*, *entregues as chaves* (no «pagado», "
          "«aceitado»)."},

 {"h": "tendo + participio: lo que pasó antes",
  "q": [{"prompt": "«Después de haber leído el informe, la jueza decidió.»", "stem": "___ o relatório, a juíza decidiu.", "answer": "Tendo lido", "options": ["Tendo lido", "Tendo lendo", "Tenho lido"]}],
  "r": "*tendo* + participio cuenta algo cumplido antes de la acción "
       "principal: *tendo lido o relatório, decidiu* = después de haber "
       "leído el informe, decidió.",
  "ex": [["*Tendo estudado* em Coimbra, ele conhecia bem Portugal.", "Como había estudiado en Coimbra, conocía bien Portugal."],
         ["*Tendo chegado* tarde, perdi o começo do show.", "Como llegué tarde, me perdí el comienzo del show."],
         ["*Não tendo recebido* resposta, ela ligou de novo.", "Como no había recibido respuesta, volvió a llamar."],
         ["*Tendo sido* eleito, o prefeito mudou de ideia.", "Una vez elegido, el intendente cambió de idea."]],
  "warn": "Con *tendo* solo, el participio no concuerda: *tendo feito as contas* "
          "(nunca «feitas»). Sin *tendo*, o con *tendo sido*, sí: *feitas as contas*, *tendo sido eleitas*.",
  "tip": "Hablando se prefiere *depois de* + infinitivo: *depois de ler o "
         "relatório, decidiu*. *Tendo lido* suena a texto escrito."},

 {"h": "Desarmar y armar",
  "r": "Cada reducida tiene su versión desarrollada. Pasar de una a otra es "
       "la clave para leer y para variar tu escritura.",
  "table": {"head": ["Desarrollada", "Reducida"],
            "rows": [["Quando cheguei, liguei.", "Ao chegar / Chegando, liguei."],
                     ["Como estava cansado, dormi.", "Estando cansado / Por estar cansado, dormi."],
                     ["Se sair cedo, você pega sol.", "Saindo cedo, você pega sol."],
                     ["Embora seja caro, vale a pena.", "Apesar de ser caro, vale a pena."],
                     ["Depois que terminou a aula, saímos.", "Terminada a aula, saímos."]]},
  "ex": [["*Apesar de ser* caro, o bondinho vale a pena.", "Aunque es caro, el teleférico vale la pena."],
         ["*Para chegarmos* cedo, saímos às seis.", "Para llegar temprano, salimos a las seis."],
         ["*Sem saber* o caminho, pedimos ajuda.", "Sin saber el camino, pedimos ayuda."]],
  "warn": "*embora* pide subjuntivo; su versión reducida es *apesar de* + "
          "infinitivo: *apesar de ser caro*, nunca «embora ser caro»."},

 {"h": "En la crónica y la noticia",
  "q": [{"prompt": "¿Qué significa «Pressionado, o prefeito recuou»?", "answer": "Como lo presionaron, el intendente retrocedió.", "options": ["Como lo presionaron, el intendente retrocedió.", "El intendente presionó y retrocedió.", "El intendente, presionando, retrocedió."]}],
  "r": "Las reducidas dan ritmo y ahorran palabras: por eso abundan en "
       "títulos, copetes y crónicas.",
  "ex": [["*Encerrada* a temporada, quiosques da orla fecham.", "Terminada la temporada, cierran los paradores de la costanera."],
         ["*Pressionado*, o prefeito recuou.", "Presionado, el intendente dio marcha atrás."],
         ["*Derrotado* em Alcácer-Quibir, D. Sebastião nunca voltou.", "Derrotado en Alcazarquivir, D. Sebastián nunca volvió."],
         ["*Ao completar* 18 anos, ela tirou a carteira de motorista.", "Al cumplir 18 años, sacó el registro de conducir."]],
  "tip": "La *crônica* es un género muy brasileño: texto corto sobre lo "
         "cotidiano (Rubem Braga, Fernando Sabino, Drummond). Leé una por "
         "semana."},
]},

43: {
"intro": "Vas a escribir un mail formal en portugués: cómo abrir, tratar, "
         "pedir y cerrar. Lo que en español es «Estimado» y «Saludos "
         "cordiales».",
"parts": [
 {"h": "Abrir y cerrar", "blocks": [0, 1]},
 {"h": "Tratamiento y fórmulas", "blocks": [2, 3]},
 {"h": "Pedir sin errores", "blocks": [4, 5]},
],
"blocks": [
 {"h": "Abrir: Prezado, Caro, Olá",
  "q": [{"prompt": "Un mail formal a una profesora que no conocés empieza…", "answer": "Prezada professora,", "options": ["Prezada professora,", "Querida professora,", "Oi, professora,"]}, {"prompt": "Un mail formal a una empresa, sin nombre, empieza…", "answer": "Prezados senhores,", "options": ["Prezados senhores,", "Queridos senhores,", "Olá, pessoal,"]}],
  "r": "El saludo formal es *Prezado(a)* + tratamiento o nombre. *Caro(a)* "
       "es más cercano; *Olá* u *Oi*, entre colegas.",
  "table": {"head": ["Registro", "Apertura"],
            "rows": [["muy formal", "Prezado Senhor, / Prezada Senhora,"],
                     ["formal con nombre", "Prezada Sra. Ana Souza,"],
                     ["a un grupo", "Prezados senhores, / Prezados(as),"],
                     ["cordial", "Caro Marcelo, / Cara professora,"],
                     ["entre colegas", "Olá, Bia! / Oi, pessoal,"]]},
  "ex": [["*Prezado* Sr. Oliveira,", "Estimado Sr. Oliveira:"],
         ["*Prezada* professora Lúcia,", "Estimada profesora Lucía:"],
         ["*A quem possa interessar*,", "A quien corresponda:"]],
  "warn": "*Querido(a)* es solo para gente cercana; *Estimado* existe pero "
          "en Brasil suena raro. Y el saludo suele cerrarse con **coma**: "
          "*Prezada Senhora,*."},

 {"h": "Cerrar: Atenciosamente, Cordialmente",
  "q": [{"prompt": "Cierre para un mail a la secretaría de la UFRJ.", "answer": "Atenciosamente,", "options": ["Atenciosamente,", "Saudos cordiais,", "Atentamente,"]}],
  "r": "El cierre estándar es *Atenciosamente,* y el nombre. *Cordialmente* "
       "es algo más cálido; *Respeitosamente*, para autoridades.",
  "table": {"head": ["Español", "Portugués"],
            "rows": [["Atentamente", "Atenciosamente"],
                     ["Saludos cordiales", "Cordialmente / Atenciosamente"],
                     ["Respetuosamente", "Respeitosamente"],
                     ["Saludos, un abrazo", "Abraços / Um abraço"],
                     ["Quedo a la espera", "Fico no aguardo"]]},
  "ex": [["*Atenciosamente*, Martín García", "Atentamente, Martín García"],
         ["*Desde já, agradeço* a atenção.", "Desde ya, agradezco su atención."],
         ["*Um abraço* e até segunda!", "Un abrazo y hasta el lunes."]],
  "warn": "«Saludos» no es «saudos»: el cierre cotidiano es *Abraços* o *Um "
          "abraço*, y el formal, *Atenciosamente*."},

 {"h": "o senhor, a senhora, Vossa Senhoria",
  "r": "«Usted» es *o senhor / a senhora*, con verbo en 3.ª persona. En "
       "cartas oficiales: *Vossa Senhoria* (V. Sa.), también en 3.ª.",
  "ex": [["*O senhor* poderia confirmar o horário?", "¿Usted podría confirmar el horario?"],
         ["Agradeço a *Vossa Senhoria* a atenção.", "Le agradezco a Usted su atención."],
         ["*V. Sa.* receberá *sua* resposta em breve.", "Usted recibirá su respuesta en breve."],
         ["*Vossa Excelência* está convidado.", "Su Excelencia está invitado."]],
  "warn": "Aunque diga *Vossa*, el verbo y el posesivo van en 3.ª: *V. Sa. "
          "deve enviar seus documentos*, nunca «vosso» ni «deveis».",
  "tip": "*você* en un mail a un desconocido suena demasiado directo: al "
         "cliente o al profesor, *o senhor / a senhora*."},

 {"h": "Fórmulas del cuerpo",
  "q": [{"prompt": "Completá.", "stem": "___ em anexo as duas faturas.", "answer": "Seguem", "options": ["Seguem", "Segue", "Sigue"]}],
  "r": "El mail formal brasileño tiene fórmulas fijas: *venho por meio "
       "desta*, *segue em anexo*, *conforme combinado*, *fico no aguardo*.",
  "table": {"head": ["Fórmula", "Sentido"],
            "rows": [["Venho, por meio desta, solicitar...", "Por la presente, solicito..."],
                     ["Segue em anexo o currículo.", "Adjunto el CV."],
                     ["Conforme combinado, envio...", "Según lo acordado, envío..."],
                     ["Fico no aguardo de sua resposta.", "Quedo a la espera de su respuesta."],
                     ["Fico à disposição para...", "Quedo a disposición para..."]]},
  "ex": [["*Segue em anexo* o comprovante.", "Adjunto el comprobante."],
         ["*Seguem em anexo* os documentos.", "Adjunto los documentos."],
         ["*Fico no aguardo* de um retorno.", "Quedo a la espera de una respuesta."]],
  "warn": "*seguir* concuerda con lo adjuntado: *seguem anexos os "
          "documentos*, *segue anexa a lista*. Con *em anexo*, *anexo* no "
          "cambia, pero el verbo sí: *seguem em anexo*."},

 {"h": "Pedir con cortesía",
  "q": [{"prompt": "Completá.", "stem": "Agradeceria se a senhora me ___ o boleto.", "answer": "enviasse", "options": ["enviasse", "envie", "enviar"]}],
  "r": "Para pedir: *solicito*, *gostaria de solicitar*, *poderia...?* o "
       "*agradeceria se* + imperfeito do subjuntivo.",
  "ex": [["*Gostaria de solicitar* uma declaração de matrícula.", "Quisiera solicitar un certificado de alumno regular."],
         ["*Agradeceria se* o senhor *pudesse* responder até sexta.", "Le agradecería si pudiera responder hasta el viernes."],
         ["*Solicito* a revisão da nota.", "Solicito la revisión de la nota."],
         ["*Poderia* me enviar o formulário?", "¿Podría enviarme el formulario?"]],
  "warn": "*agradeceria se* + imperfeito do subjuntivo (*se pudesse*, *se "
          "enviasse*): nunca con presente («se pode») ni con futuro do "
          "subjuntivo («se puder»)."},

 {"h": "Crase y tratamiento en el mail",
  "q": [{"prompt": "Completá.", "stem": "Solicito ___ Vossa Senhoria a análise do pedido.", "answer": "a", "options": ["a", "à", "ao"]}],
  "r": "*V. Sa.*, *V. Exa.* y *você* no llevan artículo: *solicito a V. Sa.*, "
       "sin crase. *A senhora* sí lo lleva: *informo à senhora*.",
  "ex": [["Informo *a V. Sa.* que o prazo terminou.", "Le informo a Usted que el plazo terminó."],
         ["Envio *à senhora* o relatório.", "Le envío a usted (señora) el informe."],
         ["Fico *à disposição*.", "Quedo a disposición."],
         ["*Em relação à* sua solicitação...", "En relación con su solicitud..."],
         ["Encaminho o pedido *ao* setor responsável.", "Derivo el pedido al sector responsable."]],
  "warn": "Con crase fija: *à disposição*. En *em relação a* y *devido a* depende "
          "de lo que sigue: *em relação à proposta*, *em relação ao prazo*, *devido a problemas*. "
          "Sin crase ante verbo y ante masculino: *a partir de hoje*, *a pedido "
          "do senhor*."},
]},

44: {
"intro": "Vas a fabricar palabras: sufijos para abstractos y oficios, "
         "diminutivos con cariño, aumentativos y prefijos. Con ellos "
         "entendés miles de palabras nuevas.",
"parts": [
 {"h": "Sufijos que hacen sustantivos", "blocks": [0, 1]},
 {"h": "Oficios, árboles, golpes y prefijos", "blocks": [2, 3, 4]},
 {"h": "Diminutivos y aumentativos", "blocks": [5, 6, 7]},
 {"h": "Formá la palabra", "blocks": [8]},
],
"blocks": [
 {"h": "-dade, -eza, -ice, -ura",
  "r": "De un adjetivo salen sustantivos abstractos: *feliz → felicidade*, "
       "*belo → beleza*, *velho → velhice*, *louco → loucura*.",
  "table": {"head": ["Sufijo", "Ejemplos", "Español"],
            "rows": [["-dade", "felicidade, bondade, maldade", "-dad: felicidad, bondad, maldad"],
                     ["-eza", "beleza, tristeza, certeza", "-eza: belleza, tristeza, certeza"],
                     ["-ice", "velhice, chatice, meiguice", "-ez, -ería: vejez, pesadez, dulzura"],
                     ["-ura", "loucura, altura, gostosura", "-ura: locura, altura, delicia"],
                     ["-ez", "timidez, rapidez", "-ez: timidez, rapidez"],
                     ["-ismo", "sebastianismo, modernismo, coronelismo", "-ismo: movimiento, doctrina, sistema"]]},
  "ex": [["Que *chatice* esse trânsito!", "¡Qué pesadez este tránsito!"],
         ["A *beleza* do Arpoador ao pôr do sol.", "La belleza del Arpoador al atardecer."],
         ["Na *velhice*, ele voltou para o Rio.", "En la vejez, volvió a Río."],
         ["A *timidez* dele passou com o tempo.", "Su timidez se le pasó con el tiempo."],
         ["Para Sérgio Buarque, a *cordialidade* vem do coração, não da boa educação.", "Para Sérgio Buarque, la cordialidad viene del corazón, no de los buenos modales."]],
  "warn": "«-dad» → *-dade*: *felicidade*, *cidade*, *verdade*. Y *-ice* es "
          "muy brasileño para lo molesto o lo tonto: *chatice*, *burrice*, "
          "*criancice*.",
  "more": ["Al revés, de un sustantivo sale un adjetivo: *-oso* (*saudade → "
           "saudoso*, *carinho → carinhoso*) y, para autores, *-iano*: "
           "*machadiano* (de Machado), *camoniano* (de Camões: la nasal "
           "*-ões* pasa a *-on-*)."]},

 {"h": "-ção, -mento, -agem, -ência",
  "q": [{"prompt": "Elegí la forma correcta.", "stem": "___ do carro custa 30 reais.", "answer": "A lavagem", "options": ["A lavagem", "O lavagem", "O lavaje"]}],
  "r": "Del verbo: *-ção* y *-agem* (femeninos), *-mento* (masculino). De "
       "adjetivos en *-ente / -ante*: *-ência / -ância*.",
  "table": {"head": ["Sufijo", "Ejemplos", "Género"],
            "rows": [["-ção", "eleição, criação, votação", "femenino"],
                     ["-mento", "casamento, tratamento, sofrimento", "masculino"],
                     ["-agem", "aprendizagem, lavagem, contagem", "femenino"],
                     ["-ência / -ância", "paciência, importância, ausência", "femenino"]]},
  "ex": [["A *votação* terminou tarde.", "La votación terminó tarde."],
         ["O *casamento* foi na igreja da Candelária.", "El casamiento fue en la iglesia de la Candelária."],
         ["A *aprendizagem* de línguas leva tempo.", "El aprendizaje de idiomas lleva tiempo."],
         ["Tenha *paciência*: o ônibus já vem.", "Tené paciencia: el colectivo ya viene."]],
  "warn": "*-aje* → *-agem*, y pasa a **femenino**: *a aprendizagem*, *a "
          "viagem*, *a mensagem*, *a lavagem*."},

 {"h": "-eiro / -eira: oficios, árboles y recipientes",
  "r": "*-eiro* nombra oficios (*padeiro*, *pedreiro*), árboles (*coqueiro*, "
       "*laranjeira*) y recipientes (*cinzeiro*, *açucareiro*).",
  "table": {"head": ["Base", "Derivado", "Español"],
            "rows": [["pão", "padeiro", "panadero"],
                     ["pedra", "pedreiro", "albañil"],
                     ["carta", "carteiro", "cartero"],
                     ["borracha", "borracheiro", "gomero"],
                     ["laranja", "laranjeira", "naranjo"],
                     ["coco", "coqueiro", "cocotero"],
                     ["manga", "mangueira", "árbol de mango"],
                     ["cinza", "cinzeiro", "cenicero"]]},
  "ex": [["O *borracheiro* consertou o pneu.", "El gomero arregló la goma."],
         ["Sentamos à sombra do *coqueiro*.", "Nos sentamos a la sombra del cocotero."],
         ["Chamei o *pedreiro* para a obra.", "Llamé al albañil para la obra."],
         ["A *Mangueira* é uma escola de samba famosa.", "Mangueira es una escuela de samba famosa."]],
  "warn": "«-ero» → *-eiro* y «-era» → *-eira*: *padeiro*, *cozinheira*, "
          "*geladeira*. Muchos frutales son femeninos (*a laranjeira*, *a "
          "bananeira*), pero *o coqueiro*, *o cajueiro*.",
  "tip": "*mangueira* es el árbol de mango y también la manguera; la escuela "
         "de samba toma el nombre de su morro."},

 {"h": "-ada: golpe, grupo y comida",
  "r": "*-ada* forma golpes o gestos (*olhada*, *bolada*), grupos "
       "(*garotada*) y platos (*feijoada*, *cocada*).",
  "ex": [["*Dá uma olhada* nessa foto!", "¡Echale un vistazo a esta foto!"],
         ["A *garotada* jogava bola no Aterro.", "Los chicos jugaban a la pelota en el Aterro."],
         ["Sábado tem *feijoada* no boteco.", "El sábado hay feijoada en el bar."],
         ["Ele levou uma *bolada* na cabeça.", "Recibió un pelotazo en la cabeza."]],
  "warn": "*dar uma olhada* (echar un vistazo), *dar uma cochilada* (echarse "
          "una siestita), *dar uma passada* (pasar un rato): el portugués "
          "arma verbos con *dar uma* + *-ada* todo el tiempo."},

 {"h": "Prefijos: des-, re-, pré-, pós-, ex-, super-",
  "q": [{"prompt": "Elegí la grafía correcta.", "answer": "pós-graduação", "options": ["pós-graduação", "posgraduação", "pos-graduação"]}],
  "r": "Los prefijos funcionan como en español. Ojo con la grafía: *pré-*, "
       "*pós-*, *pró-* y *ex-* van con guion.",
  "table": {"head": ["Prefijo", "Ejemplos", "Sentido"],
            "rows": [["des-", "desligar, desfazer, desconfiar", "negación, lo inverso"],
                     ["re-", "refazer, reler, reabrir", "de nuevo"],
                     ["pré- / pós-", "pré-carnaval, pós-graduação", "antes / después"],
                     ["ex-", "ex-namorado, ex-prefeito", "que ya no es"],
                     ["super-", "superlegal, supermercado", "muy, sobre"]]},
  "ex": [["*Desliga* a luz, por favor.", "Apagá la luz, por favor."],
         ["Estou fazendo *pós-graduação* na UFRJ.", "Estoy haciendo un posgrado en la UFRJ."],
         ["O *pré-carnaval* no Centro é lotado.", "La previa del carnaval en el Centro es un gentío."],
         ["Meu *ex-namorado* mora em Niterói.", "Mi ex novio vive en Niterói."],
         ["Vou *reler* esse livro: é *superlegal*.", "Voy a releer ese libro: es buenísimo."]],
  "warn": "«posgrado» → *pós-graduação*, con tilde y guion. Los átonos *pre-* "
          "y *pos-* se pegan: *prever*, *pospor*."},

 {"h": "Diminutivo -inho / -zinho",
  "r": "*-inho* con palabras en *-o / -a* átonas (*casa → casinha*); "
       "*-zinho* tras vocal tónica, nasal, diptongo o consonante (*café → "
       "cafezinho*, *pão → pãozinho*, *flor → florzinha*).",
  "table": {"head": ["Base", "Diminutivo", "Plural"],
            "rows": [["casa", "casinha", "casinhas"],
                     ["livro", "livrinho", "livrinhos"],
                     ["café", "cafezinho", "cafezinhos"],
                     ["pão", "pãozinho", "pãezinhos"],
                     ["flor", "florzinha", "florezinhas"],
                     ["mãe", "mãezinha", "mãezinhas"]]},
  "ex": [["Vamos tomar um *cafezinho*?", "¿Vamos a tomar un cafecito?"],
         ["Espera um *minutinho*.", "Esperá un minutito."],
         ["Volto *rapidinho*.", "Vuelvo enseguida."],
         ["Moro *pertinho* da praia.", "Vivo cerquita de la playa."]],
  "warn": "Nunca «-ito»: *cafezinho*, no «cafecito». En plural, se "
          "pluraliza la base: *pão → pães → pãezinhos*, *flor → flores → "
          "florezinhas*.",
  "more": ["El diminutivo en Brasil es sobre todo **afecto o cortesía**, no "
           "tamaño: *um minutinho*, *obrigadinho*, *um favorzinho*. También "
           "va con adverbios: *cedinho*, *agorinha*, *devagarinho*."]},

 {"h": "Aumentativo -ão / -ona y -aço",
  "q": [{"prompt": "Elegí el aumentativo.", "stem": "Eles compraram ___ antigo em Santa Teresa.", "answer": "um casarão", "options": ["um casarão", "uma casona", "uma casão"]}],
  "r": "*-ão* agranda (*carro → carrão*), *-aço* intensifica (*gol → "
       "golaço*) y muchos pasan a masculino: *a casa → o casarão*.",
  "table": {"head": ["Base", "Aumentativo", "Español"],
            "rows": [["o carro", "o carrão", "el autazo"],
                     ["a casa", "o casarão", "la casona"],
                     ["a mulher", "a mulherona / o mulherão", "la mujerona"],
                     ["o gol", "o golaço", "el golazo"],
                     ["a panela", "o panelaço", "el cacerolazo"],
                     ["o amigo", "o amigão", "el amigazo"]]},
  "ex": [["Que *golaço* do Flamengo!", "¡Qué golazo del Flamengo!"],
         ["Moram num *casarão* em Santa Teresa.", "Viven en una casona en Santa Teresa."],
         ["Houve *panelaço* em Botafogo ontem.", "Hubo cacerolazo en Botafogo ayer."],
         ["Ele é um *amigão*.", "Es un amigazo."]],
  "warn": "Algunos *-ão* ya son palabras propias: *portão* (portón), "
          "*cartão* (tarjeta), *calção* (short). No son «puerta grande» ni "
          "«carta grande»."},

 {"h": "Sotaque da semana: Curitiba",
  "q": [{"prompt": "En Curitiba, ¿qué es um piá?", "answer": "un chico", "options": ["un chico", "un pie", "un pájaro"]}],
  "r": "En Curitiba la *e* final se pronuncia *e* (*leite quente*, no «leiti quenti») y hay palabras propias: *piá* (chico), *vina* (salchicha).",
  "ex": [["O *piá* foi pra escola.", "El chico fue a la escuela."], ["Um cachorro-quente com duas *vinas*, por favor.", "Un pancho con dos salchichas, por favor."], ["*Leite quente* dá dor de dente.", "La leche caliente da dolor de muelas (el dicho con que se burlan del acento)."]],
  "tip": "Con el diminutivo y los sufijos de esta semana: *piazinho*, *vininha*. La voz de la app es la estándar: el acento no se oye, las palabras sí."},

 {"h": "Producir: -vel, -ista, in-, des-, re-",
  "q": [{"prompt": "Elegí la palabra formada.", "stem": "Uma roupa que se pode lavar é ___.", "answer": "lavável", "options": ["lavável", "lavada", "lavadora"]}],
  "r": "Para escribir, no solo para leer: *-vel* dice «que se puede» (*lavar → "
       "lavável*), *-ista* nombra oficios (*táxi → taxista*), *in- / des-* dan el "
       "contrario y *re-*, «de nuevo».",
  "table": {"head": ["Base", "Derivado", "Cómo"],
            "rows": [["lavar", "lavável", "-ar → -ável"],
                     ["preferir", "preferível", "-er / -ir → -ível"],
                     ["jornal", "jornalista", "-ista: oficio"],
                     ["táxi", "taxista", "-ista: oficio"],
                     ["útil", "inútil", "in-: el contrario"],
                     ["paciente", "impaciente", "im- ante p y b"],
                     ["conhecido", "desconhecido", "des-: el contrario"],
                     ["abrir", "reabrir", "re-: de nuevo"]]},
  "ex": [["Essa camisa é *lavável* à máquina.", "Esta camisa se puede lavar en el lavarropas."],
         ["O *taxista* conhecia um atalho.", "El taxista conocía un atajo."],
         ["Foi uma reunião *inútil*.", "Fue una reunión inútil."],
         ["Um número *desconhecido* me ligou.", "Me llamó un número desconocido."]],
  "warn": "«-ble» → *-vel*, con tilde en la vocal de antes: *possível*, "
          "*confiável*; plural *-veis*. Y *-ista* no cambia en femenino: *o / a "
          "taxista*.",
  "tip": "Para formar, pensá en la regla y no en el español: *-ção* y *-dade* "
         "(femeninos), *-mento* (masculino), *-eza* de adjetivos."},

]},

45: {
"intro": "Vas a desactivar las palabras que parecen españolas y no lo son: "
         "falsos amigos, sustantivos con otro género y palabras con el "
         "acento en otra sílaba.",
"parts": [
 {"h": "Los falsos amigos más peligrosos", "blocks": [0, 1, 2]},
 {"h": "En la mesa y en el trabajo", "blocks": [3, 4]},
 {"h": "Otro género, otro acento", "blocks": [5, 6]},
],
"blocks": [
 {"h": "Los clásicos",
  "q": [{"prompt": "«Mi apellido es Pereira.»", "stem": "Meu ___ é Pereira.", "answer": "sobrenome", "options": ["sobrenome", "apelido", "apelativo"]}],
  "r": "Se parecen a una palabra española y significan otra cosa. Aprendé "
       "las dos columnas juntas.",
  "table": {"head": ["Portugués", "Significa", "Para lo español, decí"],
            "rows": [["esquisito", "raro", "delicioso, gostoso (exquisito)"],
                     ["polvo", "pulpo", "pó, poeira (polvo)"],
                     ["borracha", "goma de borrar", "bêbada (borracha)"],
                     ["apelido", "apodo", "sobrenome (apellido)"],
                     ["pelado", "desnudo", "careca (pelado)"],
                     ["embaraçada", "avergonzada, en aprietos", "grávida (embarazada)"]]},
  "ex": [["Que comida *esquisita*!", "¡Qué comida más rara! (no rica)"],
         ["Comi *polvo* grelhado em Búzios.", "Comí pulpo a la parrilla en Búzios."],
         ["Me empresta a *borracha*?", "¿Me prestás la goma?"],
         ["Meu *apelido* é Tuca; meu *sobrenome*, Silva.", "Mi apodo es Tuca; mi apellido, Silva."]],
  "warn": "«Estaba exquisito» → *estava delicioso* o *uma delícia*. Si "
          "decís «estava esquisito», el cocinero entiende que era raro."},

 {"h": "Adjetivos que engañan",
  "r": "*largo* es ancho, *roxo* es violeta, *ruivo* es pelirrojo y "
       "*engraçado* es gracioso (que da risa).",
  "table": {"head": ["Portugués", "Significa", "Para lo español, decí"],
            "rows": [["largo", "ancho", "comprido (largo)"],
                     ["roxo", "violeta", "vermelho (rojo)"],
                     ["ruivo", "pelirrojo", "—"],
                     ["engraçado", "gracioso, divertido", "—"],
                     ["grato", "agradecido", "agradável (grato)"]]},
  "ex": [["A avenida é *larga* e *comprida*.", "La avenida es ancha y larga."],
         ["Ela pintou o cabelo de *roxo*.", "Se tiñó el pelo de violeta."],
         ["O Rafa é *ruivo*.", "Rafa es pelirrojo."],
         ["Esse filme é muito *engraçado*.", "Esa película es muy graciosa."]],
  "warn": "«Una calle larga» → *uma rua comprida*. *Uma rua larga* es una "
          "calle ancha."},

 {"h": "Verbos traicioneros",
  "q": [{"prompt": "¿Qué hacés si la puerta dice «PUXE»?", "answer": "Tirar hacia mí", "options": ["Tirar hacia mí", "Empujar", "Tocar el timbre"]}],
  "r": "*contestar* es cuestionar, *reparar em* es notar, *latir* es "
       "ladrar, *puxar* es tirar hacia vos y *tirar* es sacar.",
  "table": {"head": ["Portugués", "Significa", "Para lo español, decí"],
            "rows": [["contestar", "cuestionar, impugnar", "responder (contestar)"],
                     ["reparar (em)", "notar, fijarse", "consertar (reparar)"],
                     ["latir", "ladrar", "bater (latir)"],
                     ["puxar", "tirar hacia uno", "—"],
                     ["empurrar", "empujar", "—"],
                     ["tirar", "sacar, quitar", "jogar (tirar)"],
                     ["acordar", "despertar(se)", "lembrar (acordarse)"]]},
  "ex": [["*Reparou* no vestido dela?", "¿Te fijaste en el vestido de ella?"],
         ["O cachorro *latiu* a noite toda.", "El perro ladró toda la noche."],
         ["*Puxe* / *Empurre*", "Tire / Empuje (carteles de las puertas)"],
         ["O advogado *contestou* a multa.", "El abogado impugnó la multa."]],
  "warn": "En la puerta, *PUXE* significa «tire» (hacia vos). Si empujás, te "
          "chocás: empujar es *empurrar*."},

 {"h": "En la mesa: copo, taça, vaso, xícara",
  "r": "Un *copo* es un vaso; una *taça*, una copa; un *vaso*, una maceta o "
       "el inodoro; una *xícara*, una taza.",
  "table": {"head": ["Portugués", "Español"],
            "rows": [["o copo", "el vaso"],
                     ["a taça", "la copa"],
                     ["o vaso", "la maceta; el inodoro"],
                     ["a xícara", "la taza"],
                     ["o presunto", "el jamón"],
                     ["a salsa", "el perejil"],
                     ["a sobremesa", "el postre"]]},
  "ex": [["Me vê um *copo* d'água, por favor.", "¿Me das un vaso de agua, por favor?"],
         ["Brindamos com uma *taça* de espumante.", "Brindamos con una copa de espumante."],
         ["Coloquei a planta num *vaso* novo.", "Puse la planta en una maceta nueva."],
         ["Um sanduíche de *presunto* e queijo.", "Un sándwich de jamón y queso."]],
  "warn": "«Un vaso de agua» → *um copo d'água*. Si pedís «um vaso de "
          "água», suena a maceta... o a algo peor."},

 {"h": "Trabajo y ciudad: oficina, escritório, balcão",
  "q": [{"prompt": "«Mi viejo trabaja en una oficina en Botafogo.»", "stem": "Meu pai trabalha num ___ em Botafogo.", "answer": "escritório", "options": ["escritório", "oficina", "ofício"]}],
  "r": "*oficina* es el taller; la oficina es el *escritório*. *balcão* es "
       "el mostrador y *cena* es escena (la cena es el *jantar*).",
  "table": {"head": ["Portugués", "Español"],
            "rows": [["a oficina", "el taller (mecánico)"],
                     ["o escritório", "la oficina"],
                     ["o balcão", "el mostrador, la barra"],
                     ["a cena", "la escena"],
                     ["o jantar", "la cena"],
                     ["o cadastro", "el registro de datos"]]},
  "ex": [["Deixei o carro na *oficina*.", "Dejé el auto en el taller."],
         ["Trabalho num *escritório* no Centro.", "Trabajo en una oficina en el Centro."],
         ["Pede no *balcão*.", "Pedí en el mostrador."],
         ["Que *cena* linda nesse filme!", "¡Qué escena linda en esa película!"]],
  "warn": "«Voy a la oficina» → *vou ao escritório*. *Vou à oficina* = voy "
          "al taller mecánico."},

 {"h": "Heterogenéricos: otro género",
  "q": [{"prompt": "Completá.", "stem": "___ ponte estava ___.", "answer": "A / fechada", "options": ["A / fechada", "O / fechado", "A / fechado"]}],
  "r": "Estos sustantivos cambian de género respecto del español: con ellos "
       "cambian el artículo, el adjetivo y el pronombre.",
  "table": {"head": ["Masculinos en portugués", "Femeninos en portugués"],
            "rows": [["o leite (la leche)", "a dor (el dolor)"],
                     ["o sangue (la sangre)", "a ponte (el puente)"],
                     ["o mel (la miel)", "a árvore (el árbol)"],
                     ["o sal (la sal)", "a viagem (el viaje)"],
                     ["o nariz (la nariz)", "a origem (el origen)"],
                     ["o costume (la costumbre)", "a cor (el color)"],
                     ["o legume (la legumbre)", "a análise (el análisis)"]]},
  "ex": [["*O leite* está *quente*.", "La leche está caliente."],
         ["Estou com *uma dor* de cabeça *forte*.", "Tengo un dolor de cabeza fuerte."],
         ["*A ponte* Rio-Niterói é *comprida*.", "El puente Río-Niterói es largo."],
         ["*O mel* daqui é *ótimo*.", "La miel de acá es buenísima."],
         ["Fiz *uma* viagem *linda*.", "Hice un viaje lindo."]],
  "warn": "El error no está solo en el artículo: «a leite fria» tiene dos "
          "errores. Concordá todo: *o leite frio*, *a dor forte*."},

 {"h": "Heterotónicos: otro acento",
  "r": "Se escriben casi igual pero cargan el acento en otra sílaba. La "
       "tilde, o su falta, te avisa.",
  "table": {"head": ["Portugués", "Se dice", "Español"],
            "rows": [["academia", "a-ca-de-MI-a", "academia (a-ca-DE-mia)"],
                     ["alergia", "a-ler-GI-a", "alergia (a-LER-gia)"],
                     ["polícia", "po-LÍ-cia", "policía"],
                     ["nível", "NÍ-vel", "nivel"],
                     ["limite", "li-MI-te", "límite"],
                     ["oxigênio", "o-xi-GÊ-nio", "oxígeno"],
                     ["anemia", "a-ne-MI-a", "anemia (a-NE-mia)"]]},
  "ex": [["Vou à *academia* todo dia.", "Voy al gimnasio todos los días (a-ca-de-MI-a)."],
         ["Tenho *alergia* a camarão.", "Tengo alergia al camarón (a-ler-GI-a)."],
         ["A *polícia* chegou rápido.", "La policía llegó rápido (po-LÍ-cia)."],
         ["Qual é o seu *nível* de português?", "¿Cuál es tu nivel de portugués? (NÍ-vel)"]],
  "warn": "*academia* en Brasil es sobre todo el **gimnasio**. Y *polícia* "
          "lleva tilde en la í: po-LÍ-cia, no «po-li-CÍ-a»."},
]},

46: {
"intro": "Vas a reconocer el portugués de Portugal, de África y de las "
         "regiones de Brasil. No para imitarlo: para entenderlo sin "
         "confundirte.",
"parts": [
 {"h": "Brasil y Portugal", "blocks": [0, 1]},
 {"h": "Sonidos y regiones de Brasil", "blocks": [2, 3]},
 {"h": "África y ortografía", "blocks": [4, 5]},
],
"blocks": [
 {"h": "Gramática: tres diferencias",
  "q": [{"prompt": "¿Cuál es típicamente europea?", "answer": "Estou a ler um livro.", "options": ["Estou a ler um livro.", "Estou lendo um livro.", "Me empresta o livro."]}],
  "r": "Brasil: *você*, gerundio y pronombre antes del verbo. Portugal: "
       "*tu*, *a* + infinitivo y pronombre después del verbo.",
  "table": {"head": ["Brasil", "Portugal", "Español"],
            "rows": [["Você está bem?", "Estás bem? / Tu estás bem?", "¿Estás bien?"],
                     ["Estou comendo.", "Estou a comer.", "Estoy comiendo."],
                     ["Me diz uma coisa.", "Diz-me uma coisa.", "Decime una cosa."],
                     ["Eu te amo.", "Amo-te.", "Te amo."]]},
  "ex": [["(BR) Você *está fazendo* o quê?", "¿Qué estás haciendo?"],
         ["(PT) Tu *estás a fazer* o quê?", "¿Qué estás haciendo?"],
         ["(BR) *Me passa* o sal.", "Pasame la sal."],
         ["(PT) *Passa-me* o sal.", "Pasame la sal."]],
  "warn": "En Portugal *você* puede sonar distante o hasta descortés; se "
          "prefiere *tu*, el nombre u *o senhor*. En Brasil, *você* es lo "
          "neutro."},

 {"h": "Léxico: ônibus o autocarro",
  "r": "El vocabulario cotidiano cambia bastante: transporte, casa, comida. "
       "Si leés *comboio* o *telemóvel*, el texto es europeo.",
  "table": {"head": ["Brasil", "Portugal", "Español"],
            "rows": [["o ônibus", "o autocarro", "el colectivo"],
                     ["o trem", "o comboio", "el tren"],
                     ["o celular", "o telemóvel", "el celular"],
                     ["o café da manhã", "o pequeno-almoço", "el desayuno"],
                     ["o suco", "o sumo", "el jugo"],
                     ["o banheiro", "a casa de banho", "el baño"],
                     ["a geladeira", "o frigorífico", "la heladera"],
                     ["o sorvete", "o gelado", "el helado"]]},
  "ex": [["(BR) Peguei o *ônibus* na Rio Branco.", "Tomé el colectivo en la Rio Branco."],
         ["(PT) Apanhei o *autocarro* no Rossio.", "Tomé el colectivo en el Rossio."],
         ["(BR) Meu *celular* morreu.", "Se me murió el celular."],
         ["(PT) O meu *telemóvel* morreu.", "Se me murió el celular."]],
  "warn": "Ojo con *rapariga*: en Portugal es «chica», neutra; en buena "
          "parte de Brasil (sobre todo en el Nordeste) es un insulto. En "
          "Brasil decí *moça* o *garota*.",
  "more": ["También cambia el verbo de «tomar el colectivo»: *pegar* en "
           "Brasil, *apanhar* en Portugal. Y *fixe* (PT) = *legal* (BR); "
           "*giro* (PT) = *bonito* (BR)."]},

 {"h": "Sonidos: Portugal se come las vocales",
  "q": [{"prompt": "Un portugués dice algo como «tlfón». ¿Qué palabra es?", "answer": "telefone", "options": ["telefone", "talvez", "tufão"]}, {"prompt": "¿Dónde se pronuncian todas las vocales átonas?", "answer": "en Brasil", "options": ["en Brasil", "en Portugal", "en los dos"]}],
  "r": "En Portugal las vocales átonas casi desaparecen (*telefone* ≈ "
       "«tlfón»). En Brasil se pronuncian todas, y *ti / di* suenan «chi / "
       "yi».",
  "ex": [["*telefone*", "BR: te-le-FÔ-ni · PT: tlfón"],
         ["*leite*", "BR: LEI-chi · PT: LEIT"],
         ["*pequeno*", "BR: pe-KÊ-nu · PT: pkénu"],
         ["*cidade*", "BR: si-DA-yi · PT: si-DAD"]],
  "warn": "Si no entendés a un portugués, no es tu oído: es la reducción "
          "vocálica. Buscá las consonantes y reconstruí la palabra."},

 {"h": "Brasil por regiones",
  "q": [{"prompt": "En Recife te ofrecen «macaxeira frita». ¿Qué es?", "answer": "mandioca frita", "options": ["mandioca frita", "batata frita", "banana frita"]}],
  "r": "El *chiado* carioca (*s* final = «sh»), el *tu* del Sur y del "
       "Norte, y palabras regionales: *aipim*, *macaxeira*, *mandioca*.",
  "table": {"head": ["Región", "Rasgo", "Ejemplo"],
            "rows": [["Rio de Janeiro", "s final = «sh»; tu con verbo de você", "«meshmo»; tu vai?"],
                     ["Sul (Porto Alegre)", "tu; bah, tchê, guri", "Bah, tchê, tu viste?"],
                     ["Nordeste", "oxente, arretado, macaxeira", "Oxente, que calor!"],
                     ["Minas Gerais", "uai; trem (= cosa)", "Uai, que trem é esse?"],
                     ["São Paulo", "meu, mano; r «caipira» en el interior", "Meu, que trânsito!"]]},
  "ex": [["No Rio: *Tu vai* pra praia hoje?", "En Río: ¿Vas a la playa hoy?"],
         ["No Rio é *aipim*; no Nordeste, *macaxeira*.", "Mandioca: aipim en Río, macaxeira en el Nordeste."],
         ["Em Minas: *Uai*, cadê o *trem*?", "¿Y? ¿Dónde está la cosa?"]],
  "warn": "*tu vai* (tu con verbo de *você*) es muy común en el habla del "
          "Rio, pero la escritura cuidada pide *tu vais* o *você vai*.",
  "tip": "El *chiado* carioca («feshta», «maish») se parece al de Lisboa; "
         "una hipótesis muy difundida, y discutida, lo atribuye a la corte "
         "portuguesa de 1808."},

 {"h": "África y Asia: el portugués de allá",
  "q": [{"prompt": "En Luanda: «Gosto bué desta música.» ¿Qué quiere decir?", "answer": "Me gusta mucho esta música.", "options": ["Me gusta mucho esta música.", "Me gusta un poco esta música.", "No me gusta esta música."]}, {"prompt": "En Angola y Moçambique, la norma escrita sigue a…", "answer": "Portugal", "options": ["Portugal", "Brasil", "Cabo Verde"]}],
  "r": "Es oficial en Angola, Moçambique, Cabo Verde, Guiné-Bissau, São Tomé "
       "e Príncipe y Timor-Leste. Allá la norma escrita sigue a Portugal.",
  "ex": [["Em Luanda: Gosto *bué* desta música.", "En Luanda: me gusta mucho esta música."],
         ["Brasil: *cafuné*, *caçula*, *moleque*", "de origen bantú: caricia en el pelo, hijo menor, pibe"],
         ["Brasil: *quitanda*, *fubá*, *samba*", "también de lenguas africanas"],
         ["Mia Couto *escreve* em Maputo, em português de Moçambique.", "Mia Couto escribe en Maputo, en portugués de Mozambique."]],
  "more": ["Millones de africanos esclavizados llegaron a Brasil, y sus "
           "lenguas (sobre todo el quimbundo y otras bantúes; el yoruba en "
           "la religión) dejaron palabras de todos los días. La CPLP "
           "(Comunidade dos Países de Língua Portuguesa) reúne a estos "
           "países."],
  "tip": "«Minha pátria é a língua portuguesa», escribió Pessoa como "
         "Bernardo Soares en el *Livro do Desassossego*: la frase más citada "
         "sobre la lusofonía."},

 {"h": "Ortografía: el Acuerdo de 1990",
  "q": [{"prompt": "¿Cuál es la grafía brasileña actual?", "answer": "ideia", "options": ["ideia", "idéia", "idea"]}],
  "r": "Desde el Acuerdo Ortográfico casi todo se escribe igual. Quedan "
       "tildes distintas (*econômico / económico*) y algunas consonantes "
       "(*fato / facto*).",
  "table": {"head": ["Brasil", "Portugal", "Español"],
            "rows": [["econômico", "económico", "económico"],
                     ["gênero", "género", "género"],
                     ["Antônio", "António", "Antonio"],
                     ["fato", "facto", "hecho"],
                     ["contato", "contacto", "contacto"],
                     ["registro", "registo", "registro"],
                     ["ideia, voo", "ideia, voo", "idea, vuelo"]]},
  "ex": [["O *fato* é que ninguém sabia.", "El hecho es que nadie sabía (en PT: facto)."],
         ["Uma *ideia* ótima.", "Una idea excelente (sin tilde desde 1990)."],
         ["Meu *voo* sai às dez.", "Mi vuelo sale a las diez (sin tilde)."]],
  "warn": "En Portugal *fato* es «traje»; en Brasil, «hecho». Y desde 1990: "
          "*ideia*, *voo*, *linguiça*, sin tilde ni diéresis."},
]},

47: {
"intro": "Vas a sostener una tesis sin afirmarlo todo: modalizar, conceder, "
         "ordenar argumentos y concluir. Es el portugués del debate y de la "
         "redação del ENEM.",
"parts": [
 {"h": "Afirmar con matices", "blocks": [0, 1]},
 {"h": "Conceder y contraargumentar", "blocks": [2, 3]},
 {"h": "Ordenar y concluir", "blocks": [4, 5]},
],
"blocks": [
 {"h": "Modalizadores: sin afirmarlo todo",
  "q": [{"prompt": "Completá.", "stem": "É provável que o prefeito ___ o projeto.", "answer": "vete", "options": ["vete", "veta", "vetará"]}],
  "r": "*é possível que*, *é provável que*, *pode ser que* van con "
       "**subjuntivo**; *tudo indica que*, *ao que parece*, *parece que*, "
       "con indicativo.",
  "table": {"head": ["+ subjuntivo", "+ indicativo"],
            "rows": [["é possível que seja", "tudo indica que é"],
                     ["é provável que chova", "parece que vai chover"],
                     ["pode ser que venha", "ao que parece, vem"],
                     ["talvez faça", "provavelmente faz"]]},
  "ex": [["*É possível que* a tarifa *aumente*.", "Es posible que la tarifa aumente."],
         ["*Tudo indica que* o projeto *vai* ser aprovado.", "Todo indica que el proyecto va a ser aprobado."],
         ["*Ao que parece*, o VLT *funciona* bem.", "Al parecer, el VLT funciona bien."],
         ["*Pode ser que* a praia *esteja* cheia.", "Puede ser que la playa esté llena."]],
  "warn": "*tudo indica que* presenta algo como probable: va con "
          "**indicativo**, como «todo indica que» en español."},

 {"h": "Opinar con matices",
  "r": "*acho que / acredito que* + indicativo; negados (*não acho que*, "
       "*não creio que*), subjuntivo. *A meu ver* ordena la opinión.",
  "ex": [["*Acredito que* a ciclovia *é* necessária.", "Creo que la ciclovía es necesaria."],
         ["*Não acho que* a solução *seja* simples.", "No creo que la solución sea simple."],
         ["*A meu ver*, o problema é o esgoto.", "A mi ver, el problema son las cloacas."],
         ["*Do meu ponto de vista*, falta fiscalização.", "Desde mi punto de vista, falta control."]],
  "warn": "«En mi opinión» → *na minha opinião*, con contracción. «Desde mi "
          "punto de vista» → *do meu ponto de vista*.",
  "tip": "En la redação formal, evitá *eu acho*: usá *acredita-se que*, *é "
         "inegável que*, *nota-se que*."},

 {"h": "Conceder: ainda que, mesmo que, por mais que",
  "q": [{"prompt": "«Aunque el tránsito está horrible, voy en auto.»", "stem": "Embora o trânsito ___ horrível, vou de carro.", "answer": "esteja", "options": ["esteja", "está", "estava"]}],
  "r": "*embora*, *ainda que*, *mesmo que* (aunque) y *por mais que* (por "
       "más que) van **siempre con subjuntivo**, aunque el hecho sea real.",
  "ex": [["*Embora* a praia *esteja* suja, está cheia.", "Aunque la playa está sucia, está llena."],
         ["*Mesmo que chova*, o bloco sai.", "Aunque llueva, la comparsa sale."],
         ["*Por mais que* eu *estude*, sempre erro a crase.", "Por más que estudie, siempre le erro a la crase."],
         ["*Ainda que* Freyre *tenha* valorizado a mestiçagem, suavizou a violência da escravidão.", "Aunque Freyre valoró el mestizaje, suavizó la violencia de la esclavitud."]],
  "warn": "En español decís «aunque **está** sucia» si es un hecho. En "
          "portugués, no: *embora esteja*. Si querés indicativo, usá *mas*: "
          "*está suja, mas está cheia*."},

 {"h": "Contraargumentar",
  "r": "Reconocé la otra posición antes de rebatirla: *é verdade que... "
       "mas*, *não se pode negar que... no entanto*, *apesar de*.",
  "ex": [["*É verdade que* a Constituição de 1988 ampliou direitos, *mas* muitos não saíram do papel.", "Es cierto que la Constitución de 1988 amplió derechos, pero muchos no salieron del papel."],
         ["*Não se pode negar que* o turismo gera emprego. *No entanto*...", "No se puede negar que el turismo genera empleo. Sin embargo..."],
         ["*Apesar de* o projeto ser bom, falta verba.", "A pesar de que el proyecto es bueno, faltan fondos."],
         ["*Por um lado*..., *por outro*...", "Por un lado..., por el otro..."]],
  "warn": "«A pesar de que es bueno» → *apesar de ser bom* o *embora seja "
          "bom*. «Apesar de que é bom» suena a calco."},

 {"h": "Ordenar los argumentos",
  "q": [{"prompt": "Elegí el conector para sumar un argumento.", "stem": "O projeto é caro. ___, não resolve o problema.", "answer": "Além disso", "options": ["Além disso", "Demais", "Aliás de"]}],
  "r": "Los marcadores guían al lector: *em primeiro lugar*, *além disso*, "
       "*por outro lado*, *ademais*, *não só... como também*.",
  "table": {"head": ["Función", "Marcadores", "Español"],
            "rows": [["abrir", "em primeiro lugar, antes de tudo", "en primer lugar, ante todo"],
                     ["sumar", "além disso, ademais, também, inclusive", "además, también, incluso"],
                     ["contrastar", "por outro lado, em contrapartida, no entanto", "por otro lado, en cambio, sin embargo"],
                     ["ejemplificar", "por exemplo, é o caso de", "por ejemplo, es el caso de"],
                     ["reforzar", "não só... como também, sobretudo", "no solo... sino también, sobre todo"]]},
  "ex": [["*Em primeiro lugar*, a obra atrasou.", "En primer lugar, la obra se atrasó."],
         ["*Além disso*, o orçamento dobrou.", "Además, el presupuesto se duplicó."],
         ["*Não só* os moradores *como também* os turistas reclamam.", "No solo los vecinos sino también los turistas se quejan."],
         ["*Em contrapartida*, a orla ficou mais segura.", "En cambio, la costanera quedó más segura."],
         ["*É o caso da* Baía de Guanabara, que ainda recebe esgoto.", "Es el caso de la Bahía de Guanabara, que todavía recibe cloacas."]],
  "warn": "«además» → *além disso* (o *ademais*, formal). *demais* es "
          "«demasiado»: *é caro demais*."},

 {"h": "Concluir",
  "r": "Para cerrar: *em suma*, *em resumo*, *diante do exposto*, *dessa "
       "forma*, *portanto*. En la redação, la conclusión propone una "
       "solución.",
  "ex": [["*Em suma*, a cidade precisa de mais árvores.", "En suma, la ciudad necesita más árboles."],
         ["*Diante do exposto*, conclui-se que...", "Por lo expuesto, se concluye que..."],
         ["*Dessa forma*, seria possível reduzir o lixo.", "De esa forma, sería posible reducir la basura."],
         ["*Portanto*, é urgente limpar a Baía de Guanabara.", "Por lo tanto, es urgente limpiar la Bahía de Guanabara."]],
  "tip": "La redação del ENEM pide cerrar con una **propuesta de "
         "intervención**: quién hace qué, cómo y para qué."},
]},

48: {
"intro": "Vas a resumir y reformular textos ajenos: verbos para citar con "
         "precisión, cómo atribuir la fuente y cómo decir lo mismo con "
         "otras palabras.",
"parts": [
 {"h": "Verbos para citar", "blocks": [0, 1]},
 {"h": "Atribuir y reformular", "blocks": [2, 3]},
 {"h": "El resumo y la prensa", "blocks": [4, 5]},
],
"blocks": [
 {"h": "Verbos de decir: más precisos que dizer",
  "r": "Cada verbo matiza: *afirmar* (neutro), *defender* (una tesis), "
       "*alegar* (una justificación), *sustentar* (con firmeza), "
       "*ressaltar* (destacar).",
  "table": {"head": ["Verbo", "Matiz", "Ejemplo"],
            "rows": [["afirmar", "neutro", "O autor afirma que..."],
                     ["defender", "toma partido", "defende que... / defende a ideia de que..."],
                     ["alegar", "justificación, a veces dudosa", "O réu alegou que estava doente."],
                     ["sustentar", "argumenta con firmeza", "sustenta que..."],
                     ["ressaltar / salientar", "destaca", "ressalta que... / a importância de..."],
                     ["apontar", "señala", "aponta que... / aponta falhas"],
                     ["admitir / reconhecer", "concede", "admite que..."]]},
  "ex": [["Sérgio Buarque *sustenta* que o «homem cordial» age pelo coração.", "Sérgio Buarque sostiene que el «hombre cordial» actúa por el corazón."],
         ["Schwarz *aponta* que o liberalismo estava «fora do lugar» num país escravista.", "Schwarz señala que el liberalismo estaba «fuera de lugar» en un país esclavista."],
         ["A autora *defende* a criação de parques.", "La autora defiende la creación de parques."],
         ["O motorista *alegou* que não viu o sinal.", "El conductor alegó que no vio el semáforo."],
         ["DaMatta *ressalta* o peso do «você sabe com quem está falando?».", "DaMatta destaca el peso del «¿usted sabe con quién está hablando?»."]],
  "warn": "*alegar* insinúa que no le creés del todo. Para citar sin tomar "
          "partido: *afirmar*, *declarar*."},

 {"h": "Con qué preposición",
  "q": [{"prompt": "Completá.", "stem": "O artigo se refere ___ crise hídrica.", "answer": "à", "options": ["à", "a", "na"]}],
  "r": "Algunos verbos de decir piden su preposición: *concordar com*, "
       "*discordar de*, *referir-se a*, *chamar a atenção para*.",
  "ex": [["*Concordo com* o autor.", "Estoy de acuerdo con el autor."],
         ["Ele *discorda da* proposta.", "No está de acuerdo con la propuesta."],
         ["O texto *se refere à* crise hídrica.", "El texto se refiere a la crisis hídrica."],
         ["A autora *chama a atenção para* o lixo na praia.", "La autora llama la atención sobre la basura en la playa."]],
  "warn": "«llamar la atención **sobre**» → *chamar a atenção **para***. Y "
          "*referir-se a* + femenino lleva crase: *refere-se à pesquisa*."},

 {"h": "Atribuir la fuente",
  "r": "*segundo*, *de acordo com*, *conforme* y *para* + fuente: *segundo "
       "o IBGE*, *de acordo com a pesquisa*, *para a autora*.",
  "ex": [["*Segundo* o IBGE, o Rio tem mais de seis milhões de habitantes.", "Según el IBGE, Río tiene más de seis millones de habitantes."],
         ["*De acordo com* a matéria, o metrô vai ampliar o horário.", "De acuerdo con la nota, el metro va a extender el horario."],
         ["*Conforme* o relatório, a água está própria para banho.", "Según el informe, el agua está apta para bañarse."],
         ["*Segundo ele*, a obra termina em maio.", "Según él, la obra termina en mayo."],
         ["*Para* a autora, a cidade virou as costas para o mar.", "Para la autora, la ciudad le dio la espalda al mar."]],
  "warn": "«según» → *segundo*. Con pronombre: *segundo ele*, *segundo "
          "ela* (no «segundo dele»).",
  "tip": "*conforme* también es «a medida que»: *conforme o tempo passa* = "
         "a medida que pasa el tiempo."},

 {"h": "Reformular: ou seja, isto é, em outras palavras",
  "q": [{"prompt": "«O sea, nadie vino.»", "stem": "___, ninguém veio.", "answer": "Ou seja", "options": ["Ou seja", "O seja", "Ó sea"]}],
  "r": "Para aclarar: *ou seja*, *isto é*, *quer dizer*, *em outras "
       "palavras*. Para corregirte: *ou melhor*.",
  "ex": [["A taxa caiu 2%, *ou seja*, quase nada.", "La tasa cayó un 2%, o sea, casi nada."],
         ["O Arpoador, *isto é*, a pedra entre Ipanema e Copacabana...", "El Arpoador, es decir, la piedra entre Ipanema y Copacabana..."],
         ["*Em outras palavras*, o projeto parou.", "En otras palabras, el proyecto se frenó."],
         ["Chego às oito, *ou melhor*, às nove.", "Llego a las ocho, mejor dicho, a las nueve."],
         ["O museu fecha às segundas; *quer dizer*, amanhã está fechado.", "El museo cierra los lunes; o sea, mañana está cerrado."]],
  "warn": "«o sea» → *ou seja*: con *ou* y el subjuntivo *seja*. «O seja» "
          "es un castellanismo."},

 {"h": "Cómo se escribe un resumo",
  "r": "Un resumen va en **presente** y en **tercera persona**, sin tu "
       "opinión, con verbos como *trata de*, *aborda*, *discute*, "
       "*conclui*.",
  "table": {"head": ["Paso", "Fórmula"],
            "rows": [["tema", "O texto trata de... / O artigo aborda..."],
                     ["tesis", "O autor defende que..."],
                     ["argumentos", "Para isso, apresenta... / Além disso, aponta..."],
                     ["conclusión", "Por fim, conclui que..."]]},
  "ex": [["O texto *trata da* ocupação da orla.", "El texto trata sobre la ocupación de la costanera."],
         ["A autora *aborda* o problema do lixo.", "La autora aborda el problema de la basura."],
         ["Em seguida, *discute* soluções.", "A continuación, discute soluciones."],
         ["Por fim, *conclui* que falta verba.", "Por último, concluye que faltan fondos."]],
  "warn": "Nada de *eu acho* ni *na minha opinião* en un resumo: eso va en "
          "la *resenha* (reseña crítica)."},

 {"h": "El condicional del rumor",
  "q": [{"prompt": "¿Qué indica «o cantor teria cancelado o show»?", "answer": "Que la noticia no está confirmada.", "options": ["Que la noticia no está confirmada.", "Que el cantor cancelaría en el futuro.", "Que el cantor canceló seguro."]}],
  "r": "La prensa usa el futuro do pretérito para lo que **no confirma**: "
       "*o suspeito teria fugido* = habría huido (según dicen).",
  "ex": [["O jogador *teria pedido* aumento.", "El jugador habría pedido un aumento."],
         ["Segundo testemunhas, o motorista *estaria* bêbado.", "Según testigos, el conductor estaría borracho."],
         ["O prefeito *teria dito* que...", "El intendente habría dicho que..."]],
  "warn": "Como en el español periodístico: no es hipótesis, es distancia. "
          "Si se confirma, pasá al perfeito: *o suspeito fugiu*."},
]},

49: {
"intro": "Vas a pasar de la charla carioca al texto formal y de vuelta: "
         "sujetos, pronombres, *tem / há*, reducciones y vocabulario.",
"parts": [
 {"h": "La gramática que cambia", "blocks": [0, 1, 2, 3]},
 {"h": "Reducciones y pronombres formales", "blocks": [4, 5]},
 {"h": "Vocabulario y el camino de vuelta", "blocks": [6, 7]},
],
"blocks": [
 {"h": "a gente → nós",
  "q": [{"prompt": "Versión formal.", "stem": "A gente precisa de mais tempo. → ___ de mais tempo.", "answer": "Precisamos", "options": ["Precisamos", "Precisa", "Precisam"]}],
  "r": "En lo formal, *a gente vai* pasa a *nós vamos*, y el *você* "
       "genérico a una construcción impersonal.",
  "ex": [["*A gente vai* ao Maracanã. → *Nós vamos* ao Maracanã.", "Vamos al Maracanã."],
         ["*A gente acha* que... → *Acreditamos* que...", "Creemos que..."],
         ["*Você paga* na entrada. → *Paga-se* na entrada.", "Se paga en la entrada."]],
  "warn": "Nunca mezcles: «*a gente vamos*» está muy estigmatizado. O *a "
          "gente vai*, o *nós vamos*."},

 {"h": "vi ele → vi-o",
  "q": [{"prompt": "En lo formal: «Vou ajudar ele.»", "answer": "Vou ajudá-lo.", "options": ["Vou ajudá-lo.", "Vou ajudar-lo.", "Vou ajudar-o."]}, {"prompt": "En lo formal: «Conheço ela.»", "answer": "Conheço-a.", "options": ["Conheço-a.", "Conheço-la.", "Conheço-lhe."]}],
  "r": "En el habla, *ele / ela* sirven de objeto (*vi ele*). En lo formal: "
       "*o, a, os, as* (*vi-o*, *eu o vi*) y *lhe* para el indirecto.",
  "table": {"head": ["Habla", "Formal"],
            "rows": [["Vi ele ontem.", "Eu o vi ontem. / Vi-o ontem."],
                     ["Conheço ela.", "Conheço-a. / Eu a conheço."],
                     ["Vou chamar eles.", "Vou chamá-los."],
                     ["Dei pra ele.", "Dei-lhe. / Eu lhe dei."],
                     ["Me empresta?", "Poderia me emprestar?"]]},
  "ex": [["Encontrei *ela* no Leblon. → Encontrei-*a* no Leblon.", "La encontré en Leblon."],
         ["Vou ajudar *ele*. → Vou *ajudá-lo*.", "Voy a ayudarlo."],
         ["Mandei um recado *pra ele*. → Mandei-*lhe* um recado.", "Le mandé un mensaje."]],
  "warn": "Tras infinitivo, la *-r* cae y la vocal lleva tilde: *ajudar + o "
          "→ ajudá-lo*, *vender + a → vendê-la*, *partir + os → "
          "parti-los*."},

 {"h": "Repaso: fazê-lo, fi-lo, põe-no",
  "q": [{"prompt": "En lo formal: «Dão ele de presente.»", "answer": "Dão-no de presente.", "options": ["Dão-no de presente.", "Dão-lo de presente.", "Dão-o de presente."]}],
  "qq": [{"prompt": "En lo formal: «Fiz ele sem pensar.»", "answer": "Fi-lo sem pensar.", "options": ["Fi-lo sem pensar.", "Fiz-lo sem pensar.", "Fiz-o sem pensar."]}],
  "r": "Lo viste en la semana 33: tras *-r, -s, -z* la consonante cae y "
       "el pronombre pasa a *-lo, -la* (*fazê-lo*, *fi-lo*); tras nasal, a "
       "*-no, -na* (*põe-no*).",
  "table": {"head": ["Habla", "Formal"],
            "rows": [["Vou fazer ele.", "Vou fazê-lo."],
                     ["Fazemos ele.", "Fazemo-lo."],
                     ["Fiz ele.", "Fi-lo."],
                     ["Põem ele na mesa.", "Põem-no na mesa."],
                     ["Trazem elas.", "Trazem-nas."]]},
  "ex": [["Preciso *fazê-lo* hoje.", "Tengo que hacerlo hoy (-r)."],
         ["*Fazemo-lo* com prazer.", "Lo hacemos con gusto (-s)."],
         ["*Fi-lo* porque quis.", "Lo hice porque quise (-z)."],
         ["As chaves? O porteiro *põe-nas* na caixa.", "¿Las llaves? El portero las pone en la caja (nasal)."]],
  "warn": "Con *-mos* cae solo la *s*: *fazemos + o → fazemo-lo*. Tras "
          "nasal no cae nada: *põe-no*, *dão-no*, *trazem-nas*.",
  "tip": "En Brasil estas formas son de la escritura formal. Hablando, *vou "
         "fazer isso* o *fiz isso* suenan mucho más naturales."},

 {"h": "tem → há",
  "q": [{"prompt": "En lo escrito: «Teve show no Circo Voador.»", "answer": "Houve show no Circo Voador.", "options": ["Houve show no Circo Voador.", "Há show no Circo Voador.", "Haverá show no Circo Voador."]}, {"prompt": "Completá (escrito)", "stem": "___ protestos no centro ontem.", "answer": "Houve", "options": ["Houve", "Houveram", "Tiveram"]}],
  "r": "El *tem* del habla pasa a *há* en lo escrito: *tinha → havia*, "
       "*teve → houve*, *vai ter → haverá*.",
  "ex": [["*Tem* muita gente na praia. → *Há* muitas pessoas na praia.", "Hay mucha gente en la playa."],
         ["*Teve* show no Circo Voador. → *Houve* show no Circo Voador.", "Hubo show en el Circo Voador."],
         ["*Vai ter* reunião. → *Haverá* reunião.", "Va a haber reunión."],
         ["«No meio do caminho *tinha* uma pedra» (Drummond, 1928)", "El poeta usó a propósito el «tinha» del habla, y escandalizó a la crítica."]],
  "warn": "*houve*, *havia*, *haverá*: siempre singular, aunque siga un "
          "plural (*houve protestos*)."},

 {"h": "pra, tá, tô, cadê: las reducciones",
  "q": [{"prompt": "Versión formal.", "stem": "Cadê as chaves? → ___ as chaves?", "answer": "Onde estão", "options": ["Onde estão", "Onde está", "Cadê estão"]}],
  "r": "En el texto formal se escriben enteras: *pra → para*, *pro → para "
       "o*, *tá → está*, *tô → estou*, *cadê → onde está*, *né → não é*.",
  "table": {"head": ["Habla", "Formal"],
            "rows": [["pra", "para"],
                     ["pro / pra (+ artículo)", "para o / para a"],
                     ["tá / tô", "está / estou"],
                     ["cadê?", "onde está? / onde estão?"],
                     ["né?", "não é? (o se elimina)"],
                     ["cê", "você"]]},
  "ex": [["*Cadê* o relatório? → *Onde está* o relatório?", "¿Dónde está el informe?"],
         ["*Tô* chegando. → *Estou* chegando.", "Estoy llegando."],
         ["Vou *pro* Centro. → Vou *para o* Centro.", "Voy al Centro."]],
  "warn": "*pra* se escribe sin tilde y sin apóstrofo: no «prá» ni «p'ra». "
          "En el mail formal, siempre *para*."},

 {"h": "Pronombres en la escritura formal",
  "r": "Al inicio, ênclise (*Disseram-me*); tras *não*, *que* o adverbio, "
       "próclise; con futuro y condicional, mesóclise (*dir-lhe-ei*).",
  "ex": [["*Me disseram* que... → *Disseram-me* que...", "Me dijeron que..."],
         ["*Não me disseram* nada.", "No me dijeron nada (próclise, también formal)."],
         ["Vou te dizer. → *Dir-te-ei*.", "Te diré (muy formal)."],
         ["Isso se faria. → *Far-se-ia* isso.", "Se haría eso."]],
  "warn": "No empieces una oración formal con pronombre átono: «Me parece» → "
          "*Parece-me*. Y mesóclise solo si nada atrae al pronombre: *não "
          "lhe direi*."},

 {"h": "Vocabulario: legal → interessante",
  "r": "El vocabulario coloquial tiene su par formal. En un texto "
       "académico, *legal*, *grana*, *cara*, *rolar* o *curtir* "
       "desentonan.",
  "table": {"head": ["Coloquial", "Formal", "Español"],
            "rows": [["legal, maneiro", "interessante, agradável", "copado"],
                     ["grana", "dinheiro, recursos", "guita, plata"],
                     ["cara", "homem, rapaz, pessoa", "tipo, flaco"],
                     ["rolar", "acontecer, ocorrer", "pintar, pasar"],
                     ["curtir", "gostar de, aproveitar", "disfrutar"],
                     ["papo", "conversa", "charla"],
                     ["sacar", "entender, perceber", "cazar"],
                     ["zoar", "brincar, provocar", "cargar, bardear"]]},
  "ex": [["O show foi *maneiro*. → O show foi *excelente*.", "El show estuvo buenísimo."],
         ["Não tenho *grana*. → Não tenho *recursos*.", "No tengo plata."],
         ["*Rolou* um problema. → *Ocorreu* um problema.", "Surgió un problema."],
         ["*Curti* a palestra. → *Gostei* da palestra.", "Me gustó la charla."]],
  "tip": "*maneiro*, *irado* y *sinistro* (¡que puede ser elogio!) son muy "
         "cariocas; en São Paulo se oye más *da hora*."},

 {"h": "El camino de vuelta: de lo formal a la charla",
  "q": [{"prompt": "Versión coloquial carioca.", "stem": "Haverá muitas pessoas no bloco. → ___ muita gente no bloco.", "answer": "Vai ter", "options": ["Vai ter", "Vão ter", "Haverão"]}],
  "r": "Saber bajar el registro también es C1: un *haverá reunião* en "
       "WhatsApp suena a robot. Pasá a *vai ter reunião*.",
  "ex": [["*Haverá* reunião amanhã. → *Vai ter* reunião amanhã.", "Mañana hay reunión."],
         ["*Solicito* que me envie... → *Me manda*...?", "¿Me mandás...?"],
         ["*Não obstante* → *Mesmo assim*", "No obstante → igual"],
         ["*Encontrei-o* ontem. → *Encontrei ele* ontem.", "Lo encontré ayer."]],
  "warn": "*Encontrei-o* en una charla de boteco suena a libro o a Portugal. "
          "En la charla brasileña: *encontrei ele* o *eu o encontrei*."},
]},

50: {
"intro": "Vas a sonar natural: combinaciones fijas (*tomar banho*, *dar "
         "certo*), las expresiones que se dicen todos los días en Río y "
         "algunos refranes.",
"parts": [
 {"h": "Verbos que van juntos", "blocks": [0, 1]},
 {"h": "Expresiones del día a día", "blocks": [2, 3]},
 {"h": "Refranes y colocaciones formales", "blocks": [4, 5]},
],
"blocks": [
 {"h": "Verbos soporte: dar certo, fazer questão, tomar banho",
  "r": "Muchas ideas se dicen con verbo + sustantivo fijo: *tomar banho*, "
       "*fazer questão*, *dar certo*, *levar a sério*.",
  "table": {"head": ["Portugués", "Español"],
            "rows": [["tomar banho", "bañarse, ducharse"],
                     ["tomar café (da manhã)", "desayunar"],
                     ["fazer questão de", "insistir en, tener empeño en"],
                     ["dar certo / dar errado", "salir bien / salir mal"],
                     ["levar a sério", "tomar en serio"],
                     ["levar tempo", "llevar tiempo"],
                     ["dar uma olhada", "echar un vistazo"]]},
  "ex": [["*Faço questão de* pagar o chope.", "Insisto en pagar el chopp."],
         ["Tomara que *dê certo*!", "¡Ojalá salga bien!"],
         ["Ninguém *leva* o horário *a sério*.", "Nadie se toma en serio el horario."],
         ["Vou *tomar banho* e já desço.", "Me baño y ya bajo."]],
  "warn": "«Tomar en serio» → *levar a sério* (lo natural en Brasil). Y "
          "*fazer questão* no es «hacer una pregunta» (*fazer uma "
          "pergunta*): es insistir."},

 {"h": "Cuando el español usa otro verbo",
  "q": [{"prompt": "«Mañana cumplo 40 años.»", "stem": "Amanhã eu ___ 40 anos.", "answer": "faço", "options": ["faço", "cumpro", "tenho"]}],
  "r": "Ojo con los calcos: *fazer anos* (cumplir años), *tirar foto* "
       "(sacar foto), *fazer falta* (echar de menos) y *é preciso* (hace "
       "falta).",
  "table": {"head": ["Español", "Portugués", "Calco a evitar"],
            "rows": [["cumplir 30 años", "fazer 30 anos", "cumprir 30 anos"],
                     ["sacar una foto", "tirar uma foto", "sacar uma foto"],
                     ["hace falta (es necesario)", "é preciso", "faz falta"],
                     ["me hacés falta", "você me faz falta / sinto sua falta", "—"],
                     ["dar a luz", "dar à luz", "dar a luz"],
                     ["llevarse bien con alguien", "dar-se bem com alguém", "levar-se bem"],
                     ["desempeñar un papel", "desempenhar um papel", "jogar um papel"],
                     ["hacer de cuenta que", "fazer de conta que", "—"]]},
  "ex": [["Ela *fez* 30 anos no sábado.", "Cumplió 30 años el sábado."],
         ["*Tira uma foto* nossa no Pão de Açúcar?", "¿Nos sacás una foto en el Pan de Azúcar?"],
         ["*É preciso* reservar antes.", "Hace falta reservar antes."],
         ["O Rio me *faz falta*.", "Extraño Río."]],
  "warn": "*faz falta* = se echa de menos, o falta algo concreto (*faz "
          "falta um médico*). Para «hace falta + infinitivo», *é preciso*."},

 {"h": "Expresiones que vas a oír en Río",
  "r": "No se traducen palabra por palabra: *pisar na bola*, *dar um "
       "jeito*, *ficar de boa*, *pagar mico*, *encher o saco*.",
  "table": {"head": ["Expresión", "Español", "Registro"],
            "rows": [["pisar na bola", "meter la pata", "coloquial"],
                     ["dar um jeito", "arreglárselas, buscarle la vuelta", "neutro"],
                     ["ficar de boa", "quedarse tranqui", "coloquial"],
                     ["pagar mico", "hacer el ridículo", "coloquial"],
                     ["encher o saco", "hinchar, molestar", "vulgar leve"],
                     ["dar um bolo", "dejar plantado", "coloquial"],
                     ["quebrar um galho", "dar una mano, zafar", "coloquial"],
                     ["(tô) nem aí", "me importa un pepino", "coloquial"],
                     ["chover canivetes", "llover a cántaros", "coloquial"]]},
  "ex": [["Esqueci o aniversário dela. *Pisei na bola*.", "Me olvidé de su cumpleaños. Metí la pata."],
         ["Não tem ingresso, mas a gente *dá um jeito*.", "No hay entradas, pero nos las arreglamos."],
         ["Hoje vou *ficar de boa* em casa.", "Hoy me quedo tranqui en casa."],
         ["Para de *encher o saco*!", "¡Dejá de hinchar!"]],
  "warn": "*encher o saco* es vulgar leve: entre amigos, sí; en el trabajo, "
          "*incomodar* o *perturbar*.",
  "more": ["De *dar um jeito* sale el *jeitinho brasileiro*: la forma de "
           "sortear una regla con simpatía o contactos. Roberto DaMatta lo "
           "analizó en *O que faz o brasil, Brasil?* (1984) como mediación "
           "entre la ley impersonal y las relaciones personales."]},

 {"h": "Casi iguales al español",
  "q": [{"prompt": "Completá.", "stem": "Fiquei com a ___ atrás da orelha.", "answer": "pulga", "options": ["pulga", "mosca", "barata"]}],
  "r": "Algunas se parecen a las nuestras con un detalle distinto: "
       "aprendé el detalle.",
  "table": {"head": ["Portugués", "Español"],
            "rows": [["caiu a ficha", "cayó la ficha"],
                     ["custar os olhos da cara", "costar un ojo de la cara"],
                     ["estar com a pulga atrás da orelha", "tener la mosca detrás de la oreja"],
                     ["pagar o pato", "pagar el pato"],
                     ["tirar o cavalo da chuva", "olvidarse de algo, desistir"]]},
  "ex": [["Só depois *caiu a ficha*.", "Recién después me cayó la ficha."],
         ["O apartamento no Leblon *custa os olhos da cara*.", "El depto en Leblon cuesta un ojo de la cara."],
         ["Fiquei *com a pulga atrás da orelha*.", "Me quedé con la mosca detrás de la oreja."],
         ["Pode *tirar o cavalo da chuva*: ele não vem.", "Olvidate: él no viene."]],
  "warn": "En portugués es una **pulga**, no una mosca, y los *olhos* son "
          "dos: *os olhos da cara*. Falso amigo: *chover no molhado* es decir algo "
          "obvio o inútil, no «llover sobre mojado»."},

 {"h": "Refranes",
  "r": "Los refranes brasileños tienen su equivalente, con otras imágenes. "
       "Se usan con ironía o para cerrar una charla.",
  "table": {"head": ["Portugués", "Equivalente"],
            "rows": [["Quem não tem cão caça com gato.", "A falta de pan, buenas son tortas."],
                     ["De grão em grão, a galinha enche o papo.", "De a poco se llega lejos."],
                     ["Água mole em pedra dura, tanto bate até que fura.", "La gota horada la piedra."],
                     ["Deus ajuda quem cedo madruga.", "Al que madruga Dios lo ayuda."],
                     ["Quem vê cara não vê coração.", "Las apariencias engañan."],
                     ["A cavalo dado não se olham os dentes.", "A caballo regalado no se le miran los dientes."]]},
  "ex": [["Não tinha tênis, fui de chinelo: *quem não tem cão caça com gato*.", "No tenía zapatillas, fui en ojotas: a falta de pan..."],
         ["Guardo dez reais por dia: *de grão em grão*...", "Ahorro diez reales por día: de a poco..."],
         ["Parecia simpático... *quem vê cara não vê coração*.", "Parecía simpático... las apariencias engañan."]],
  "tip": "Muchas veces se dice solo la primera mitad: *de grão em grão...*, "
         "*quem não tem cão...*: el resto se sobreentiende."},

 {"h": "Colocaciones formales",
  "q": [{"prompt": "«Hay que tener en cuenta el clima.»", "stem": "É preciso ___ em conta o clima.", "answer": "levar", "options": ["levar", "tomar", "pôr"]}],
  "r": "En el informe y el mail: *tomar providências*, *levar em conta*, "
       "*dar início a*, *pôr em prática*, *chegar a um acordo*.",
  "table": {"head": ["Portugués", "Español"],
            "rows": [["tomar providências", "tomar medidas"],
                     ["levar em conta / em consideração", "tener en cuenta"],
                     ["dar início a", "dar inicio a"],
                     ["pôr em prática", "poner en práctica"],
                     ["chegar a um acordo", "llegar a un acuerdo"],
                     ["fazer jus a", "merecer, hacerse acreedor de"],
                     ["tirar proveito de", "sacar provecho de"]]},
  "ex": [["A prefeitura vai *tomar providências*.", "La intendencia va a tomar medidas."],
         ["É preciso *levar em conta* o custo.", "Hay que tener en cuenta el costo."],
         ["A empresa *deu início às* obras.", "La empresa dio inicio a las obras."],
         ["As partes *chegaram a um acordo*.", "Las partes llegaron a un acuerdo."]],
  "warn": "«Tener en cuenta» → *levar em conta* (*ter em conta* se usa más "
          "en Portugal). *dar início a* + femenino plural = *às*: *deu "
          "início às obras*."},
]},

51: {
"intro": "Repasás en una semana lo que más le cuesta a un hispanohablante "
         "en B2-C1: tiempos que el español no tiene, contracciones, "
         "regencia, léxico traicionero y registro.",
"parts": [
 {"h": "Los tiempos que el español no tiene", "blocks": [0, 1, 2]},
 {"h": "Contracciones, crase y regencia", "blocks": [3, 4]},
 {"h": "Léxico y registro", "blocks": [5, 6]},
],
"blocks": [
 {"h": "Futuro do subjuntivo",
  "q": [{"prompt": "Completá.", "stem": "Quando vocês ___ a Salvador, provem o acarajé.", "answer": "forem", "options": ["forem", "vão", "irem"]}],
  "r": "Tras *quando*, *se*, *assim que*, *enquanto* con idea de futuro: "
       "futuro do subjuntivo, desde la 3.ª plural del perfeito (*fizeram "
       "→ fizer*).",
  "ex": [["*Quando* você *chegar* ao Rio, me liga.", "Cuando llegues a Río, llamame."],
         ["*Se* eu *puder*, vou ao show.", "Si puedo, voy al show."],
         ["*Assim que souber*, te aviso.", "Apenas sepa, te aviso."],
         ["*Enquanto houver* sol, a gente fica na praia.", "Mientras haya sol, nos quedamos en la playa."]],
  "warn": "«Cuando llegue» → *quando chegar*, nunca «quando chegue»; «si "
          "puedo» → *se puder*, no «se posso»."},

 {"h": "Infinitivo pessoal",
  "r": "El infinitivo lleva persona cuando su sujeto es otro o hay que "
       "aclararlo: *para eles entenderem*, *é melhor vocês irem*.",
  "ex": [["Trouxe o mapa *para vocês não se perderem*.", "Traje el mapa para que no se pierdan."],
         ["*É bom sairmos* cedo.", "Es bueno que salgamos temprano."],
         ["*Antes de eles chegarem*, arrumamos tudo.", "Antes de que lleguen, ordenamos todo."],
         ["*Ao saírem*, fechem a porta.", "Al salir, cierren la puerta."]],
  "warn": "«Para que ellos entiendan» → *para eles entenderem* (o *para que "
          "entendam*). «Para eles entender», sin persona, es habla "
          "descuidada."},

 {"h": "Perfeito composto: tenho feito ≠ he hecho",
  "q": [{"prompt": "«Esta semana vengo durmiendo poco.»", "stem": "Esta semana eu ___ pouco.", "answer": "tenho dormido", "options": ["tenho dormido", "tenho durmido", "hei dormido"]}],
  "r": "*tenho feito* = vengo haciendo (repetición hasta hoy). «He hecho», "
       "una vez, es el perfeito simple: *fiz*.",
  "ex": [["*Tenho ido* muito à praia.", "Vengo yendo mucho a la playa."],
         ["Hoje *comi* feijoada.", "Hoy comí (he comido) feijoada."],
         ["Ultimamente *tem chovido* muito.", "Últimamente viene lloviendo mucho."],
         ["Você já *foi* a Búzios?", "¿Ya fuiste (has ido) a Búzios?"]],
  "warn": "«¿Has estado en Bahía?» → *Você já esteve na Bahia?*, nunca «tem "
          "estado», que significa «venís estando»."},

 {"h": "Contracciones y crase",
  "q": [{"prompt": "Completá.", "stem": "Chegamos ___ Rocinha ___ duas da tarde.", "answer": "à / às", "options": ["à / às", "a / as", "à / as"]}],
  "r": "Preposición + artículo se funden siempre: *no, na, do, pelo, num, "
       "dele*. *a + a = à*: *vou à praia*, *às três*.",
  "ex": [["Moro *na* Tijuca, perto *do* Maracanã.", "Vivo en Tijuca, cerca del Maracanã."],
         ["Passei *pela* orla.", "Pasé por la costanera."],
         ["Vou *à* feira *às* oito.", "Voy a la feria a las ocho."],
         ["Refiro-me *àquele* bar da Lapa.", "Me refiero a aquel bar de Lapa."]],
  "warn": "Sin crase ante masculino, verbo, *uma* y casi todos los "
          "pronombres: *a pé*, *a partir de*, *a uma festa*, *a ela*."},

 {"h": "Regencia: cada verbo con su preposición",
  "r": "*gostar de*, *pensar em*, *sonhar com*, *assistir a*; sin "
       "preposición: *namorar alguém*, *ajudar alguém*, *visitar*.",
  "table": {"head": ["Portugués", "Español"],
            "rows": [["gostar de", "gustar"],
                     ["pensar em", "pensar en"],
                     ["sonhar com", "soñar con"],
                     ["assistir a (um filme)", "ver (una película)"],
                     ["namorar alguém", "salir con alguien"],
                     ["conhecer alguém", "conocer a alguien"],
                     ["preferir X a Y", "preferir X antes que Y"]]},
  "ex": [["*Gosto de* samba.", "Me gusta el samba."],
         ["Ela *namora* o Rafa.", "Ella sale con Rafa."],
         ["*Assistimos ao* jogo no Maracanã.", "Vimos el partido en el Maracanã."],
         ["Conheci *o* João na feira.", "Conocí a João en la feria."]],
  "warn": "Sin *a* personal: *conheci o João*. Y *namorar com* es regional; "
          "la norma: *namorar alguém*."},

 {"h": "Léxico traicionero",
  "r": "Repasá los falsos amigos y los heterogenéricos que siguen "
       "apareciendo en redacciones de nivel C1.",
  "table": {"head": ["Portugués", "Español", "No es"],
            "rows": [["esquisito", "raro", "exquisito"],
                     ["escritório", "oficina", "—"],
                     ["oficina", "taller", "oficina"],
                     ["largo", "ancho", "largo"],
                     ["o leite, o sangue", "la leche, la sangre", "—"],
                     ["a dor, a ponte", "el dolor, el puente", "—"],
                     ["de repente", "de golpe; (habla) capaz que", "—"]]},
  "ex": [["O leite está *frio*.", "La leche está fría."],
         ["*A viagem* foi *longa*.", "El viaje fue largo."],
         ["*De repente*, começou a chover.", "De repente, empezó a llover."],
         ["*De repente* a gente vai amanhã.", "(habla) Capaz que vamos mañana."]],
  "warn": "*de repente* en el habla de Brasil también es «tal vez»: *de "
          "repente eu vou* = capaz que voy."},

 {"h": "Registro: dónde va cada cosa",
  "q": [{"prompt": "¿Cuál va en un mail a la universidad?", "answer": "Gostaria de saber se há vagas.", "options": ["Gostaria de saber se há vagas.", "Queria saber se tem vaga.", "Queria saber se tá tendo vaga."]}],
  "r": "*a gente / tem / pra / vi ele* para hablar; *nós / há / para / "
       "vi-o* para escribir. Elegí según el lector.",
  "ex": [["Chat: *A gente tá* chegando.", "Estamos llegando."],
         ["Mail formal: *Estamos* a caminho.", "Estamos en camino."],
         ["Chat: *Tem* vaga?", "¿Hay lugar?"],
         ["Mail formal: *Há* vagas disponíveis?", "¿Hay vacantes disponibles?"]]},
]},

52: {
"intro": "Llegaste al examen final. Acá tenés el mapa de las pruebas y un "
         "repaso exprés de lo que más se evalúa en un C1.",
"parts": [
 {"h": "Las pruebas", "blocks": [0, 1]},
 {"h": "Estructuras y léxico", "blocks": [2, 3]},
 {"h": "Escribir para el examen", "blocks": [4, 5, 6]},
],
"blocks": [
 {"h": "Cómo es el examen",
  "r": "Cinco pruebas: comprensión oral, comprensión escrita, estructuras, "
       "léxico y producción escrita (texto argumentativo y carta formal).",
  "ex": [["*Compreensão oral*: rádio, podcasts, entrevistas.", "Comprensión auditiva."],
         ["*Compreensão escrita*: crônicas, notícias, artigos.", "Comprensión lectora."],
         ["*Produção escrita*: argumentar e escrever uma carta.", "Producción escrita."]],
  "more": ["El Celpe-Bras, el examen oficial de Brasil, es distinto: no tiene "
           "preguntas de gramática. En la parte colectiva escribís textos a "
           "partir de un video, un audio y lecturas; en la individual "
           "conversás con un evaluador. El nivel más alto es *Avançado "
           "Superior*."]},

 {"h": "Comprensión: leer y escuchar",
  "q": [{"prompt": "«Ela dissera que viria.» ¿Qué significa?", "answer": "Ella había dicho que vendría.", "options": ["Ella había dicho que vendría.", "Ella dijera que vendría.", "Ella dirá que viene."]}],
  "r": "Primero la idea general, después los detalles. Fijate en los "
       "conectores: *porém*, *portanto*, *embora* cambian el sentido del "
       "párrafo.",
  "ex": [["O projeto é bom; *porém*, custa caro.", "contraste: lo importante viene después"],
         ["*Embora* seja caro, vale a pena.", "concesión: la idea fuerte es «vale la pena»"],
         ["O autor *teria* mentido.", "condicional de rumor: no está confirmado"],
         ["Ele *fizera* tudo antes.", "mais-que-perfeito: había hecho"]],
  "tip": "En el audio, acordate de las reducciones (*tá*, *pra*, *cê*, "
         "*né*) y del *chiado* carioca: «maish», «feshta»."},

 {"h": "Estructuras que más se evalúan",
  "r": "Futuro do subjuntivo, infinitivo pessoal, subjuntivo tras *embora*, "
       "*haver* impersonal, contracciones y crase.",
  "table": {"head": ["Estructura", "Ejemplo"],
            "rows": [["futuro do subjuntivo", "Se você quiser, a gente vai."],
                     ["infinitivo pessoal", "É importante eles saberem."],
                     ["embora + subjuntivo", "Embora esteja cansado, vou."],
                     ["haver impersonal", "Houve muitos problemas."],
                     ["crase", "Vou à praia às dez."],
                     ["condicional compuesto", "Se tivesse sabido, teria ido."]]},
  "ex": [["*Se* você *quiser*, a gente vai.", "Si querés, vamos."],
         ["*Houve* muitos problemas.", "Hubo muchos problemas."],
         ["*Se tivesse sabido*, *teria ido*.", "Si hubiera sabido, habría ido."]],
  "warn": "Las tres que el corrector busca primero: *quando chegar* (no "
          "«chegue»), *houve* (no «houveram») y *à* ante femenino."},

 {"h": "Léxico: falsos amigos y colocaciones",
  "q": [{"prompt": "«El viaje fue largo.»", "stem": "___ foi ___.", "answer": "A viagem / longa", "options": ["A viagem / longa", "O viagem / longo", "A viagem / larga"]}],
  "r": "En léxico caen falsos amigos, heterogenéricos y colocaciones: "
       "*levar em conta*, *fazer questão*, *dar certo*.",
  "ex": [["Deixei o carro na *oficina*.", "el taller, no la oficina"],
         ["*O leite* está *quente*.", "masculino"],
         ["Vamos *levar em conta* o prazo.", "tener en cuenta"],
         ["Tomara que *dê certo*.", "que salga bien"]]},

 {"h": "El texto argumentativo",
  "r": "Introducción con tesis, dos párrafos de argumentos con conectores y "
       "una conclusión que retoma la tesis y propone algo.",
  "table": {"head": ["Parte", "Fórmulas"],
            "rows": [["introducción", "Atualmente, discute-se... Defende-se aqui que..."],
                     ["argumento 1", "Em primeiro lugar,..."],
                     ["argumento 2", "Além disso,... / Por outro lado,..."],
                     ["concesión", "Embora..., ... / É verdade que..., mas..."],
                     ["conclusión", "Em suma,... / Diante do exposto,..."]]},
  "ex": [["*Atualmente, discute-se* o uso das praias.", "Actualmente se discute el uso de las playas."],
         ["*Em primeiro lugar*, ...", "En primer lugar, ..."],
         ["*Diante do exposto*, conclui-se que...", "Por lo expuesto, se concluye que..."]]},

 {"h": "La carta formal",
  "r": "*Prezado(a)*, el motivo (*venho por meio desta*), el pedido cortés, "
       "el cierre (*Atenciosamente*) y la firma.",
  "ex": [["*Prezada* Sra. Coordenadora,", "Estimada Sra. Coordinadora:"],
         ["*Venho, por meio desta,* solicitar...", "Por la presente, solicito..."],
         ["*Agradeceria se* pudesse...", "Le agradecería si pudiera..."],
         ["*Atenciosamente*,", "Atentamente,"]]},

 {"h": "Revisá antes de entregar",
  "q": [{"prompt": "¿Cuál está bien escrita?", "answer": "Houve muitas reclamações.", "options": ["Houve muitas reclamações.", "Houveram muitas reclamações.", "Tiveram muitas reclamações."]}],
  "r": "Última pasada con ojos de hispanohablante: buscá *muy*, *más*, *y*, "
       "*-ción*, la *a* personal y los pronombres al principio.",
  "table": {"head": ["Si escribiste", "Corregí a"],
            "rows": [["muy", "muito"],
                     ["más", "mais"],
                     ["y", "e"],
                     ["-ción / -dad", "-ção / -dade"],
                     ["vi a João", "vi o João"],
                     ["Me parece (formal)", "Parece-me"],
                     ["houveram / haviam", "houve / havia"]]},
  "ex": [["*muito* interessante", "nunca «muy»"],
         ["*mais* pessoas", "nunca «más»"],
         ["Conheci *o* diretor.", "sin «a» personal"]]},
]},
}
