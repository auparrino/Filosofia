# -*- coding: utf-8 -*-
"""Estação 2 — Pé na Estrada (semanas 14-26, A2 → B1)."""

LESSONS = {

14: {
"intro": "En portugués *gostar* funciona como «amar»: el que siente el gusto "
         "es el sujeto y lo que gusta va con *de*. Esta semana, eso y los "
         "verbos que piden su preposición.",
"parts": [
 {"h": "Gostar de: el gusto al revés", "blocks": [0, 1, 2]},
 {"h": "Cada verbo con su preposición", "blocks": [3, 4, 5]},
 {"h": "Achar: opinar y encontrar", "blocks": [6]},
],
"blocks": [
 {"h": "La persona es el sujeto",
  "r": "Con *gostar*, el que siente el gusto es el **sujeto** y el verbo "
       "concuerda con él: *eu gosto*, *ela gosta*, *eles gostam*.",
  "table": {"head": ["", "gostar (presente)", "gostar (perfeito)"],
            "rows": [["eu", "gosto", "gostei"],
                     ["você / ele / ela / a gente", "gosta", "gostou"],
                     ["nós", "gostamos", "gostamos"],
                     ["vocês / eles / elas", "gostam", "gostaram"]]},
  "ex": [["Eu *gosto* de açaí.", "Me gusta el açaí."],
         ["A Bia *gosta* de samba.", "A Bia le gusta el samba."],
         ["Nós *gostamos* de praia.", "Nos gusta la playa."],
         ["Os turistas *gostam* do Arpoador.", "A los turistas les gusta el Arpoador."]],
  "warn": "Nada de «me gosta»: no hay pronombre. «Me gustan las playas» es "
          "*eu gosto das praias*: el verbo sigue a la persona, no a las playas.",
  "q": [{"prompt": "«Nos gustan los bloques de carnaval.»", "stem": "Nós ___ dos blocos de carnaval.",
         "answer": "gostamos", "options": ["gostamos", "gostam", "gosta"]},
        {"prompt": "¿Cuál está bien? «Me gusta Río.»", "answer": "Eu gosto do Rio.",
         "options": ["Eu gosto do Rio.", "Me gosta o Rio.", "Eu gosto o Rio."]}]},

 {"h": "de + artículo: do, da, dos, das",
  "r": "Lo que gusta va siempre tras *de*, y *de* se funde con el artículo: "
       "*gosto do mar*, *da praia*, *dos blocos*, *das festas*.",
  "table": {"head": ["de + o = do (del)", "de + a = da (de la)", "de + os = dos (de los)", "de + as = das (de las)"],
            "rows": [["do mar", "da praia", "dos shows", "das festas"],
                     ["dele (de + ele: de él)", "dela (de + ela: de ella)", "deles (de ellos)", "delas (de ellas)"]]},
  "ex": [["Você gosta *do* Maracanã?", "¿Te gusta el Maracanã?"],
         ["Ela não gosta *da* chuva.", "No le gusta la lluvia."],
         ["Gosto muito *das* músicas do Tom Jobim.", "Me gustan mucho las canciones de Tom Jobim."],
         ["Eu gosto *dele*.", "Él me cae bien (o me gusta)."]],
  "warn": "Sin artículo no hay contracción: *gosto de feijoada* (en general) "
          "frente a *gosto da feijoada da minha avó* (esa, en particular).",
  "tip": "Con nombres de persona el artículo es lo normal en Río: *gosto do "
         "João*, *da Bia*.",
  "q": [{"prompt": "«¿Te gustó el show?»", "stem": "Você gostou ___ show?",
         "answer": "do", "options": ["do", "o", "de o"]}]},

 {"h": "Con infinitivo, en negativo y en pasado",
  "r": "*gostar de* + infinitivo, sin artículo: *gosto de dançar*. En "
       "pasado, *gostei* = «me gustó»; *Gostou?* = ¿te gustó?",
  "ex": [["A gente *gosta de* correr no calçadão.", "Nos gusta correr por la costanera."],
         ["Não *gosto de* acordar cedo.", "No me gusta despertarme temprano."],
         ["*Gostei* muito do show na Lapa.", "Me gustó mucho el show en Lapa."],
         ["— *Gostou* do pão de queijo? — *Gostei*!", "—¿Te gustó el pan de queso? —¡Sí!"]],
  "warn": "«Me gustó la película» no es «me gostou»: es *eu gostei do "
          "filme*. La persona sigue siendo el sujeto, también en pasado.",
  "more": ["Parientes de *gostar*: *adorar* y *amar* van sin *de* (*adoro "
           "praia*, *amo o Rio*); *curtir* (coloquial) es disfrutar: *curti "
           "muito a festa*. Para responder, en Brasil se repite el verbo: "
           "—*Gosta de funk?* —*Gosto.* / —*Não gosto.*"],
  "q": [{"prompt": "«No me gusta correr.»", "stem": "Não gosto ___ correr.",
         "answer": "de", "options": ["de", "do", "a"]}]},

 {"h": "precisar de: necesitar",
  "r": "*precisar de* + sustantivo; *precisar* + infinitivo, en el uso "
       "normal **sin** *de*: *preciso de ajuda*, *preciso sair*.",
  "ex": [["*Preciso de* protetor solar.", "Necesito protector solar."],
         ["Você *precisa do* meu número?", "¿Necesitás mi número?"],
         ["*Preciso* trabalhar amanhã.", "Mañana tengo que trabajar."],
         ["Não *precisa*!", "¡No hace falta!"]],
  "warn": "Con sustantivo el *de* no se cae: «preciso dinheiro» es error, "
          "*preciso de dinheiro*. Y *preciso ir* = tengo que ir.",
  "more": ["Ante infinitivo también se ve *preciso de sair*, pero lo corriente "
           "en Brasil es sin preposición. Impersonal: *Precisa de reserva?* = "
           "¿hace falta reservar?"],
  "q": [{"prompt": "«Necesito un taxi.»", "stem": "Preciso ___ um táxi.",
         "answer": "de", "options": ["de", "a", "em"]}]},

 {"h": "lembrar de y esquecer de",
  "r": "«Acordarse de» es *lembrar de* (o *lembrar-se de*, más cuidado); "
       "lo contrario, *esquecer (de)*: olvidarse.",
  "ex": [["Você *lembra do* Carnaval de 2020?", "¿Te acordás del Carnaval de 2020?"],
         ["Eu *me lembro da* minha primeira feijoada.", "Me acuerdo de mi primera feijoada."],
         ["*Esqueci do* nome dele.", "Me olvidé de su nombre."],
         ["*Esqueci* a chave em casa.", "Me olvidé la llave en casa."],
         ["*Lembra dele*?", "¿Te acordás de él?"]],
  "warn": "Ojo con *acordar*: en portugués es «despertarse». «Me acordé» es "
          "*lembrei* o *me lembrei*, nunca «me acordei».",
  "tip": "*de* + *ele / ela* = *dele / dela*: *lembro dela*, *gosto dele*, "
         "*preciso dela*.",
  "more": ["La norma culta prefiere *lembrar algo* o *lembrar-se de algo*; en "
           "el habla brasileña *lembrar de*, sin pronombre, es lo más común. "
           "*esquecer* admite las tres: *esqueci o nome*, *esqueci do nome*, "
           "*me esqueci do nome*."]},

 {"h": "Cada verbo con su preposición",
  "r": "Muchos verbos piden su preposición, que a veces no coincide con el "
       "español. Se aprenden juntos, y la preposición se contrae.",
  "table": {"head": ["Verbo", "Español", "Ejemplo"],
            "rows": [["pensar em", "pensar en", "Penso no verão."],
                     ["acreditar em", "creer en", "Acredito em você."],
                     ["confiar em", "confiar en", "Confio nela."],
                     ["sonhar com", "soñar con", "Sonhei com o Rio."],
                     ["casar com", "casarse con", "Ele casou com a Bia."],
                     ["depender de", "depender de", "Depende do tempo."],
                     ["namorar (sin prep.)", "ser novio de", "Ela namora o Rafa."],
                     ["interessar-se por", "interesarse por", "Me interesso por música."],
                     ["apaixonar-se por", "enamorarse de", "Ela se apaixonou por ele."]]},
  "ex": [["*Penso muito na* minha família.", "Pienso mucho en mi familia."],
         ["Tudo *depende do* tempo.", "Todo depende del clima."],
         ["*Sonhei com* você.", "Soñé con vos."],
         ["O Lucas *namora* a Sofía.", "Lucas es novio de Sofía."]],
  "warn": "*em* también se contrae: *em + o = no*, *em + ela = nela*. «Pienso "
          "en él» es *penso nele*, nunca «penso em ele».",
  "tip": "*casar com* no necesita «se» (*casei com ela*) y *namorar* va "
         "sin preposición: *ele namora a Ana*.",
  "q": [{"prompt": "«Creo en vos.»", "stem": "Acredito ___ você.",
         "answer": "em", "options": ["em", "de", "com"]},
        {"prompt": "«Pienso en ella todo el día.»", "stem": "Penso ___ o dia todo.",
         "answer": "nela", "options": ["nela", "em ela", "de ela"]}]},

 {"h": "achar: opinar y encontrar",
  "r": "*achar que* = creer, opinar: *acho que sim*. *achar* + objeto = "
       "encontrar: *achei a chave*. Es de los verbos más usados en Brasil.",
  "ex": [["*Acho que* vai chover.", "Creo que va a llover."],
         ["O que você *acha*?", "¿Qué te parece? / ¿Qué opinás?"],
         ["*Acho que* não.", "Creo que no."],
         ["*Achei* meu celular no táxi.", "Encontré mi celular en el taxi."],
         ["*Achei* o filme ótimo.", "La película me pareció genial."]],
  "warn": "Para opinar, *acho que* es lo natural; *creio que* existe, pero "
          "suena formal. «Creo que sí» = *acho que sim*.",
  "tip": "*achar* + objeto + adjetivo = «parecerle a uno»: *achei a praia "
         "linda*.",
  "q": [{"prompt": "«¿Qué te parece el bar?»", "stem": "O que você ___ do bar?",
         "answer": "acha", "options": ["acha", "crê", "parece"]}]},
]},

15: {
"intro": "El imperfeito es el pasado de los recuerdos. Se forma fácil y se "
         "usa casi como en español: la trampa no es la forma sino elegir "
         "entre *era* y *foi*.",
"parts": [
 {"h": "La forma y los cuatro irregulares", "blocks": [0, 1]},
 {"h": "Imperfeito o perfeito", "blocks": [2, 3]},
 {"h": "Acción interrumpida y verbos que cambian", "blocks": [4, 5]},
],
"blocks": [
 {"h": "La forma regular",
  "r": "*-ar → -ava*; *-er* e *-ir → -ia*. Solo *nós* lleva tilde: "
       "*falávamos*, *comíamos*, *abríamos*.",
  "table": {"head": ["", "falar", "comer", "abrir"],
            "rows": [["eu", "falava", "comia", "abria"],
                     ["tu", "falavas", "comias", "abrias"],
                     ["você / ele / ela", "falava", "comia", "abria"],
                     ["nós", "falávamos", "comíamos", "abríamos"],
                     ["vocês / eles / elas", "falavam", "comiam", "abriam"]]},
  "ex": [["Eu *morava* em Botafogo.", "Yo vivía en Botafogo."],
         ["A gente *brincava* na rua.", "Jugábamos en la calle."],
         ["Meu avô *vendia* mate na praia.", "Mi abuelo vendía mate en la playa."],
         ["Nós *saíamos* cedo.", "Salíamos temprano."]],
  "warn": "Nada de «falaba» con b: en portugués es *falava*, con v. Y *eu* y "
          "*ele* son iguales: *eu falava*, *ele falava*.",
  "tip": "Los verbos en *-air* y *-uir* llevan tilde en la i: *saía*, "
         "*caía*, *construía*.",
  "q": [{"prompt": "«Comíamos açaí todos los días.»", "stem": "A gente ___ açaí todo dia.",
         "answer": "comia", "options": ["comia", "comíamos", "comía"]}]},

 {"h": "Solo cuatro irregulares",
  "r": "*ser → era*, *ter → tinha*, *vir → vinha*, *pôr → punha*. Todo lo "
       "demás es regular: *fazia*, *dizia*, *ia*, *estava*.",
  "table": {"head": ["", "ser", "ter", "vir", "pôr"],
            "rows": [["eu", "era", "tinha", "vinha", "punha"],
                     ["você / ele / ela", "era", "tinha", "vinha", "punha"],
                     ["nós", "éramos", "tínhamos", "vínhamos", "púnhamos"],
                     ["vocês / eles / elas", "eram", "tinham", "vinham", "punham"]]},
  "ex": [["Quando eu *era* criança...", "Cuando era chico..."],
         ["Ela *tinha* dez anos.", "Ella tenía diez años."],
         ["Eles *vinham* de Niterói de barca.", "Venían de Niterói en barco."],
         ["Eu *ia* à praia todo sábado.", "Iba a la playa todos los sábados."]],
  "warn": "El español empuja a «tenía, venía, ponía»: en portugués es "
          "*tinha, vinha, punha*, con nh. *ir* es regular: *ia, íamos, iam*.",
  "more": ["«Había» (= existía) es *tinha* al hablar y *havia* al "
           "escribir, siempre en singular: *tinha muita gente*, *havia "
           "muitas pessoas*. Lo mismo en los otros tiempos: «hubo» = *teve* "
           "/ *houve*; «habrá» = *vai ter* / *haverá*. Nunca «haviam» ni "
           "«houveram» con este sentido."],
  "q": [{"prompt": "«Tenía un perro.»", "stem": "Eu ___ um cachorro.",
         "answer": "tinha", "options": ["tinha", "tenia", "tive"]},
        {"prompt": "«Éramos vecinos.»", "stem": "Nós ___ vizinhos.",
         "answer": "éramos", "options": ["éramos", "eramos", "fomos"]}]},

 {"h": "Para qué sirve el imperfeito",
  "r": "Para el **decorado** del pasado: costumbres, descripciones, edad, "
       "hora, clima y estados. Nada avanza: la escena está quieta.",
  "table": {"head": ["Uso", "Ejemplo"],
            "rows": [["costumbre", "Todo domingo a gente ia ao Maracanã."],
                     ["descripción", "A casa era velha e tinha um quintal."],
                     ["edad", "Eu tinha oito anos."],
                     ["hora", "Eram três da tarde."],
                     ["clima", "Fazia muito calor."]]},
  "ex": [["*Costumava* ir de bonde a Santa Teresa.", "Solía ir en tranvía a Santa Teresa."],
         ["O Rio *era* mais tranquilo.", "Río era más tranquilo."],
         ["*Eram* seis horas e *estava* escuro.", "Eran las seis y estaba oscuro."]],
  "tip": "*costumar* + infinitivo = soler: *costumava jogar bola* = solía "
         "jugar a la pelota. En presente también: *costumo dormir cedo*.",
  "q": [{"prompt": "«Hacía calor.» (el decorado)", "stem": "___ muito calor.",
         "answer": "Fazia", "options": ["Fazia", "Fez", "Hacia"]}]},

 {"h": "El perfeito hace avanzar el relato",
  "r": "Los **hechos** que empujan la historia van en perfeito; el decorado, "
       "en imperfeito. Igual que «vivía» y «un día nos mudamos».",
  "table": {"head": ["Imperfeito", "Perfeito"],
            "rows": [["costumbre", "hecho único"],
                     ["descripción, estado", "cambio de estado"],
                     ["escena de fondo", "lo que pasó en la escena"],
                     ["edad, hora", "acontecimiento fechado"]]},
  "ex": [["Quando eu *era* criança, *morava* no interior; um dia, *mudamos*.",
          "Cuando era chico vivía en el interior; un día nos mudamos."],
         ["*Chovia* muito, mas nós *fomos* à praia.", "Llovía mucho, pero fuimos a la playa."],
         ["*Morei* dez anos em Niterói.", "Viví diez años en Niterói."],
         ["Todo verão *íamos* a Búzios, mas em 2019 *fomos* a Salvador.",
          "Todos los veranos íbamos a Búzios, pero en 2019 fuimos a Salvador."]],
  "warn": "La duración no decide: *morei dez anos em Niterói* dura diez años "
          "y va en perfeito, porque es un período cerrado."},

 {"h": "La acción interrumpida",
  "r": "Lo que estaba en curso va en imperfeito, casi siempre *estava* + "
       "gerúndio; lo que interrumpe, en perfeito.",
  "ex": [["Eu *estava dormindo* quando o telefone *tocou*.", "Estaba durmiendo cuando sonó el teléfono."],
         ["*Estávamos jantando* e a luz *acabou*.", "Estábamos cenando y se cortó la luz."],
         ["Enquanto ela *tomava* banho, eu *fazia* o café.", "Mientras ella se bañaba, yo hacía el café."]],
  "tip": "En Brasil, *estava fazendo* suena más natural que *fazia* para la "
         "acción en curso: usalo sin miedo.",
  "more": ["*enquanto* (mientras) une dos acciones de fondo, las dos en "
           "imperfeito. Con *quando* suele haber un hecho que corta: *quando "
           "cheguei, eles estavam comendo*."],
  "q": [{"prompt": "«Estaba lloviendo cuando salí.»", "stem": "___ chovendo quando eu saí.",
         "answer": "Estava", "options": ["Estava", "Esteve", "Estaba"]}]},

 {"h": "Verbos que cambian de sentido",
  "r": "Con *saber*, *conhecer*, *querer* y *poder*, el imperfeito describe "
       "un estado; el perfeito cuenta lo que pasó, como en español.",
  "ex": [["Eu *sabia*. / Eu *soube* ontem.", "Yo lo sabía. / Me enteré ayer."],
         ["Eu *conhecia* o Rafa. / *Conheci* o Rafa na Lapa.", "Conocía a Rafa. / Conocí a Rafa en Lapa."],
         ["Eu *queria* ir. / Eu *quis* ir.", "Quería ir. / Quise ir (y fui, o lo intenté)."],
         ["*Podia* nadar ali. / *Pude* nadar ali.", "Se podía nadar ahí. / Pude nadar ahí."]],
  "warn": "Sin «a» personal: *conheci o Rafa*, no «conheci ao Rafa». El *o* "
          "es solo el artículo.",
  "q": [{"prompt": "«Me enteré de la noticia ayer.»", "stem": "Eu ___ da notícia ontem.",
         "answer": "soube", "options": ["soube", "sabia", "sabi"]}]},
]},

16: {
"intro": "Los pronombres objeto son el punto donde la gramática y el habla de "
         "Brasil más se separan. Vas a aprender las dos: la que se escribe y "
         "la que se oye en la calle.",
"parts": [
 {"h": "El cuadro y el lugar del pronombre", "blocks": [0, 1]},
 {"h": "-lo, -la; «vi ele» y lhe", "blocks": [2, 3, 4]},
 {"h": "Pronombres con preposición", "blocks": [5]},
 {"h": "Muletillas del relato, elogios y el tu del Sur", "blocks": [6, 7, 8]},
],
"blocks": [
 {"h": "Directo e indirecto",
  "r": "Directo: *me, te, o, a, nos, os, as*. Indirecto: *me, te, lhe, nos, "
       "lhes*. Casi como en español, con *o / a* en lugar de «lo / la».",
  "table": {"head": ["", "directo", "indirecto", "Significa", "Ejemplo"],
            "rows": [["eu", "me", "me", "me", "Ela *me* viu."],
                     ["tu / você (habla)", "te", "te", "te", "Eu *te* amo."],
                     ["ele / ela / você", "o / a", "lhe", "lo, la / le", "Eu *o* vi. Eu *lhe* disse."],
                     ["nós", "nos", "nos", "nos", "Ela *nos* convidou."],
                     ["eles / elas / vocês", "os / as", "lhes", "los, las / les", "Eu *os* conheço. Isso *lhes* interessa."]]},
  "ex": [["Ela *me* ligou ontem.", "Me llamó ayer."],
         ["Eu *te* amo.", "Te amo."],
         ["Comprei o livro e *o* li na praia.", "Compré el libro y lo leí en la playa."],
         ["Nós *lhe* demos um presente.", "Le dimos un regalo."]],
  "warn": "«lo» y «la» son *o* y *a*, iguales al artículo: *eu o vi* = lo "
          "vi. El contexto las distingue.",
  "q": [{"prompt": "«La vi en Ipanema.» (escrito)", "stem": "Eu ___ vi em Ipanema.",
         "answer": "a", "options": ["a", "la", "lhe"]}]},

 {"h": "El pronombre va delante",
  "r": "En Brasil el pronombre va **delante del verbo**, también al empezar "
       "la frase: *me dá*, *te ligo*. La norma escrita evita empezar con él.",
  "ex": [["*Me* empresta sua caneta?", "¿Me prestás tu birome? (habla)"],
         ["*Empreste-me* sua caneta.", "Présteme su birome. (escrito formal)"],
         ["Ele não *me* viu.", "No me vio."],
         ["Vou *te* ligar amanhã.", "Te voy a llamar mañana."]],
  "warn": "«Dame» no es «dá-me» en el habla carioca: es *me dá*. Pegar el "
          "pronombre detrás suena a Portugal o a texto formal.",
  "more": ["La regla escolar: con *não*, *nunca*, *que*, *quem*, *já* y "
           "similares, el pronombre va delante en toda variedad: *não me "
           "diga*, *quem te contou?* Al comienzo absoluto de frase, la "
           "norma pide ênclise (*Diga-me*); el habla brasileña usa próclise "
           "(*Me diz*). En el examen escrito, respetá la norma."]},

 {"h": "Tras -r, -s, -z: -lo, -la, -los, -las",
  "r": "En la norma escrita, tras infinitivo la *-r* cae y el pronombre "
       "pasa a *-lo, -la*: *comprá-lo*, *vendê-la*, *abri-la*.",
  "table": {"head": ["Forma", "+ o / a", "Resultado"],
            "rows": [["comprar", "o", "comprá-lo"],
                     ["vender", "a", "vendê-la"],
                     ["abrir", "a", "abri-la"],
                     ["fiz", "o", "fi-lo"],
                     ["fazemos", "o", "fazemo-lo"],
                     ["dão (nasal)", "o", "dão-no"]]},
  "ex": [["Vou *comprá-lo* amanhã.", "Voy a comprarlo mañana."],
         ["Quero *vê-la* hoje.", "Quiero verla hoy."],
         ["Não consigo *abri-la*.", "No puedo abrirla."]],
  "warn": "La tilde aparece en *-á-* y *-ê-* para marcar el acento, pero "
          "no en *-i-*: *abri-lo*, nunca «abrí-lo».",
  "tip": "Esto es de libro y de mail formal. En la charla nadie dice "
         "«comprá-lo»: lo resuelve como en el bloque siguiente.",
  "more": ["Tras una forma que termina en nasal (*-m, -ão, -õe*) el "
           "pronombre pasa a *-no, -na, -nos, -nas*: *dão-no* (lo dan), "
           "*põe-na* (la pone), *compraram-nos* (los compraron). También es "
           "solo de la escritura formal."],
  "q": [{"prompt": "«Quiero venderla.» (escrito)", "stem": "Quero ___.",
         "answer": "vendê-la", "options": ["vendê-la", "vender-la", "vendé-la"]}]},

 {"h": "Lo que de verdad se dice: «vi ele»",
  "r": "En el habla de Brasil el objeto de tercera persona es *ele / ela*: "
       "*vi ele*, *conheço ela*. O directamente desaparece: *comprei*.",
  "ex": [["Eu vi *ele* ontem. (habla)", "Lo vi ayer."],
         ["Eu *o* vi ontem. (escrito)", "Lo vi ayer."],
         ["— Você comprou o pão? — *Comprei*.", "—¿Compraste el pan? —Sí, lo compré."],
         ["Leva *ela* pra casa. (habla)", "Llevala a casa."]],
  "warn": "*vi ele* es normalísimo al hablar, pero en un texto formal o un "
          "examen escribí *eu o vi*. Conocé los dos registros.",
  "more": ["El objeto nulo (—*Viu o jogo?* —*Vi.*) es tan brasileño como la "
           "próclise: contestar con el verbo solo, sin «lo», es la respuesta "
           "más natural. «Lo vi» dicho como *o vi* en una charla entre "
           "amigos suena rígido."],
  "q": [{"prompt": "«—¿Conocés a Bia? —Sí, la conozco.» (lo más natural al hablar)",
         "stem": "— Você conhece a Bia? — ___.", "answer": "Conheço",
         "options": ["Conheço", "La conheço", "Conheço-la"]}]},

 {"h": "lhe y el indirecto",
  "r": "*lhe* es el indirecto formal: «le». En Brasil suele referirse a "
       "*você*. Para «a él / a ella» se dice *para ele / para ela*.",
  "ex": [["Posso *lhe* fazer uma pergunta?", "¿Le puedo hacer una pregunta? (a usted)"],
         ["Dei o presente *para ela*.", "Le di el regalo (a ella)."],
         ["Mandei uma mensagem *pro* João.", "Le mandé un mensaje a João. (habla)"],
         ["Eu *te* disse!", "¡Te lo dije!"]],
  "warn": "No existe «se lo»: «se lo di» es *dei para ele* o *dei a ele*; "
          "en el habla, *dei pra ele*. El portugués no duplica el objeto.",
  "tip": "*pro* = *para o*, *pra* = *para a* (y *para*): coloquial, "
         "muy frecuente."},

 {"h": "Con preposición: para mim, comigo, conosco",
  "r": "Tras preposición: *mim*, *você*, *ele*, *nós*, *eles*. Con *com* "
       "hay formas propias: *comigo*, *contigo*, *conosco*.",
  "table": {"head": ["", "para / de / sem...", "com"],
            "rows": [["eu", "para mim", "comigo"],
                     ["tu", "para ti", "contigo"],
                     ["você", "para você", "com você"],
                     ["ele / ela", "para ele / ela", "com ele / ela"],
                     ["nós", "para nós", "conosco"],
                     ["vocês / eles", "para vocês / eles", "com vocês / eles"]]},
  "ex": [["Isso é *para mim*?", "¿Esto es para mí?"],
         ["Vem *comigo* ao Maracanã!", "¡Vení conmigo al Maracanã!"],
         ["Eles jantaram *conosco*.", "Cenaron con nosotros."],
         ["Sem *você* não tem graça.", "Sin vos no tiene gracia."]],
  "warn": "«para mí» es *para mim* (con m), y «con nosotros», *conosco*. "
          "Ante infinitivo va *eu*: *para eu ver*, no «para mim ver».",
  "q": [{"prompt": "«¿Venís conmigo?»", "stem": "Você vem ___?",
         "answer": "comigo", "options": ["comigo", "com mim", "conmigo"]},
        {"prompt": "«Es para mí.»", "stem": "É para ___.",
         "answer": "mim", "options": ["mim", "mí", "eu"]}]},

 {"h": "Palavras que não estão no dicionário (3): aí, tipo, sabe?, entendeu?",
  "q": [{"prompt": "En «Cheguei na festa e aí vi o João», ¿qué es aí?", "answer": "y entonces", "options": ["y entonces", "allá", "ahí mismo, en ese lugar"]}],
  "r": "Para contar: *aí* encadena (= y entonces), *tipo* aproxima o ejemplifica, *sabe?* y *entendeu?* chequean que el otro te sigue.",
  "ex": [["Cheguei na festa e *aí* vi o João.", "Llegué a la fiesta y entonces lo vi a João."], ["Eram *tipo* umas dez pessoas.", "Eran como unas diez personas."], ["Ela é muito tímida, *sabe*?", "Ella es muy tímida, ¿sabés?"], ["Tem que virar à direita, *entendeu*?", "Tenés que doblar a la derecha, ¿entendiste?"]],
  "warn": "*aí* en un relato no es un lugar: es «y entonces». En un texto escrito, cambialo por *então* o *depois*.",
  "tip": "*entendeu?* repetido suena a reto; *sabe?* es más suave."},

 {"h": "Elogiar e responder a um elogio",
  "q": [{"prompt": "—Que blusa linda! Elegí la respuesta más natural.", "answer": "Ah, obrigada! Comprei na feira.", "options": ["Ah, obrigada! Comprei na feira.", "Sim, eu sei.", "De nada."]}],
  "r": "El elogio se recibe agradeciendo y quitándole peso: *ah, obrigada!*, *que bom que você gostou!*, *imagina!*. Aceptarlo sin más suena seco.",
  "ex": [["Que casa *linda*!", "¡Qué linda casa!"], ["*Ficou ótimo!*", "¡Quedó genial!"], ["Você cozinha *muito bem*!", "¡Cocinás muy bien!"], ["— Adorei o bolo! — *Que bom que você gostou!*", "—¡Me encantó la torta! —¡Qué bueno que te gustó!"], ["— Que lindo! — *Imagina*, é simples.", "—¡Qué lindo! —No es nada, es simple."]],
  "warn": "*De nada* responde a un «gracias», no a un elogio: a *Que blusa linda!* se contesta *obrigada!*."},

 {"h": "Sotaque da semana: Rio Grande do Sul, y el tu",
  "q": [{"prompt": "En Porto Alegre te preguntan «Tu vai no jogo?». ¿Qué quiere decir?", "answer": "¿Vas al partido?", "options": ["¿Vas al partido?", "¿Va usted al partido?", "¿Fuiste al partido?"]}],
  "r": "El gaúcho usa *tu*, casi siempre con el verbo de *você* (*tu vai*, *tu quer*), y sus palabras: *bah* (asombro), *tchê* (che), *guri* (chico).",
  "ex": [["*Bah*, que frio!", "¡Uh, qué frío!"], ["*Tu vai* no jogo do Grêmio?", "¿Vas al partido de Grêmio?"], ["Ô *tchê*, *tu quer* chimarrão?", "Che, ¿querés mate? (chimarrão = mate)"], ["O *guri* já chegou.", "El chico ya llegó."]],
  "tip": "El *chimarrão* es el mate gaúcho, como en el Río de la Plata. La voz de la app es la estándar: el acento no se oye, las palabras sí."},

]},

17: {
"intro": "El futuro simple se forma sin sorpresas y tiene solo tres "
         "irregulares. Lo raro es otra cosa: al hablar casi no se usa.",
"parts": [
 {"h": "La forma y los tres irregulares", "blocks": [0, 1]},
 {"h": "Hablado y escrito", "blocks": [2, 5]},
 {"h": "Previsiones, promesas y el clima", "blocks": [3, 4]},
],
"blocks": [
 {"h": "Infinitivo + -ei, -á, -emos, -ão",
  "r": "Al infinitivo entero se suman *-ei, -ás, -á, -emos, -ão*. Llevan "
       "tilde *-ás, -á, -ão*; *-ei* y *-emos* no: *falarei, falará, falaremos, falarão*.",
  "table": {"head": ["", "falar", "comer", "partir"],
            "rows": [["eu", "falarei", "comerei", "partirei"],
                     ["tu", "falarás", "comerás", "partirás"],
                     ["você / ele / ela", "falará", "comerá", "partirá"],
                     ["nós", "falaremos", "comeremos", "partiremos"],
                     ["vocês / eles / elas", "falarão", "comerão", "partirão"]]},
  "ex": [["Amanhã *choverá* no Rio.", "Mañana lloverá en Río."],
         ["O show *começará* às nove.", "El show empezará a las nueve."],
         ["Nós *estudaremos* juntos.", "Estudiaremos juntos."]],
  "warn": "«hablarán» es *falarão*, con *-ão*: no «falarán». Y *falaram* "
          "(sin tilde, sin ão) es el pasado: ojo al escribir.",
  "q": [{"prompt": "«Ellos viajarán en julio.»", "stem": "Eles ___ em julho.",
         "answer": "viajarão", "options": ["viajarão", "viajaram", "viajarán"]}]},

 {"h": "Tres irregulares, y nada más",
  "r": "Solo *fazer → farei*, *dizer → direi*, *trazer → trarei*. Los que "
       "en español son irregulares acá son regulares: *terei, poderei, virei*.",
  "table": {"head": ["Infinitivo", "Futuro", "Español"],
            "rows": [["fazer", "farei", "haré"],
                     ["dizer", "direi", "diré"],
                     ["trazer", "trarei", "traeré"],
                     ["ter", "terei", "tendré"],
                     ["poder", "poderei", "podré"],
                     ["vir", "virei", "vendré"],
                     ["sair", "sairei", "saldré"],
                     ["pôr", "porei", "pondré"]]},
  "ex": [["Eu *farei* o possível.", "Haré lo posible."],
         ["Ela *dirá* a verdade.", "Dirá la verdad."],
         ["Vocês *terão* tempo.", "Tendrán tiempo."],
         ["Eles *virão* de Recife.", "Vendrán de Recife."]],
  "warn": "El español te dicta «tendrei, podrei, vendrei»: en portugués son "
          "regulares, *terei, poderei, virei*. Solo fazer, dizer y trazer "
          "pierden sílaba.",
  "q": [{"prompt": "«Tendremos una reunión.»", "stem": "___ uma reunião.",
         "answer": "Teremos", "options": ["Teremos", "Tendremos", "Tenderemos"]},
        {"prompt": "«Lo haré mañana.»", "stem": "Eu ___ isso amanhã.",
         "answer": "farei", "options": ["farei", "fazerei", "harei"]}]},

 {"h": "Al hablar: vou + infinitivo",
  "r": "En la charla, el futuro es *vou* + infinitivo, o el presente con "
       "una marca de tiempo. El futuro simple suena a noticia o a discurso.",
  "ex": [["Amanhã *vou trabalhar* cedo.", "Mañana voy a trabajar temprano."],
         ["Sábado a gente *vai* pra Ilha Grande.", "El sábado nos vamos a Ilha Grande."],
         ["*Vou* à praia depois. / *Vou ir* à praia depois. (habla)", "Voy a ir a la playa después."],
         ["O presidente *viajará* amanhã. (noticia)", "El presidente viajará mañana."]],
  "tip": "Con *ir*, lo cuidado es *vou* solo: *vou à praia amanhã*. *Vou ir* "
         "se oye mucho, pero evitalo al escribir.",
  "q": [{"prompt": "Lo más natural al hablar: «Mañana voy a cocinar.»",
         "stem": "Amanhã eu ___ cozinhar.", "answer": "vou",
         "options": ["vou", "irei", "vai"]}]},

 {"h": "Previsiones y promesas",
  "r": "El futuro simple aparece en pronósticos, promesas solemnes, "
       "profecías y textos escritos. También en *Será que...?*, la duda.",
  "ex": [["*Será que* vai chover?", "¿Irá a llover? / ¿Lloverá?"],
         ["Prometo que *ligarei* todo dia.", "Prometo que voy a llamar todos los días."],
         ["Você *verá*: tudo *dará* certo.", "Vas a ver: todo va a salir bien."],
         ["*Será* que ela esqueceu?", "¿Se habrá olvidado?"]],
  "warn": "Para la conjetura en presente o pasado el español usa futuro "
          "(«¿dónde estará?»); en Brasil se dice *Onde será que ele está?*",
  "more": ["*Será que...?* es una de las marcas más brasileñas: introduce "
           "una pregunta dudosa o una sospecha, con el verbo siguiente en "
           "cualquier tiempo: *Será que ele vem?*, *Será que ela gostou?* "
           "Suaviza la pregunta directa."],
  "q": [{"prompt": "«¿Vendrá?» (con duda, a la brasileña)", "stem": "___ que ele vem?",
         "answer": "Será", "options": ["Será", "Serás", "Seria"]}]},

 {"h": "Hablar del tiempo",
  "r": "*tempo* es también el clima. *fazer* + calor / frio / sol; *estar* "
       "para el momento: *está chovendo*, *está nublado*.",
  "ex": [["*Faz* muito calor no Rio em fevereiro.", "En febrero hace mucho calor en Río."],
         ["Hoje *está* nublado.", "Hoy está nublado."],
         ["Amanhã *vai fazer* sol.", "Mañana va a hacer sol."],
         ["A previsão diz que *choverá* à tarde.", "El pronóstico dice que lloverá a la tarde."]],
  "warn": "«Hace calor» es *faz calor*, en singular: nunca «fazem». Con "
          "tiempo: *faz dois anos* = hace dos años."},

 {"h": "Pronombre dentro del verbo",
  "r": "En la norma muy formal, el pronombre se mete **dentro** del futuro: "
       "*dir-lhe-ei*, *far-se-á*. Solo hay que reconocerlo.",
  "ex": [["*Dir-lhe-ei* a verdade.", "Le diré la verdad. (muy formal)"],
         ["Eu *lhe direi* a verdade.", "Le diré la verdad. (formal, Brasil)"],
         ["Vou *te* dizer a verdade.", "Te voy a decir la verdad. (habla)"]],
  "tip": "Si escribís, esquivá la mesóclise con el pronombre delante: *eu "
         "lhe direi*. Es correcto y mucho más natural en Brasil.",
  "q": [{"prompt": "¿Cuál suena natural en una charla en Río?",
         "answer": "Vou te ligar amanhã.",
         "options": ["Vou te ligar amanhã.", "Ligar-te-ei amanhã.", "Te ligarei-te amanhã."]}]},
]},

18: {
"intro": "El futuro do pretérito es el condicional: *gostaria*, *poderia*. "
         "Sirve para pedir con cortesía, sugerir e imaginar, y en el habla "
         "el imperfeito le hace competencia.",
"parts": [
 {"h": "La forma", "blocks": [0, 1]},
 {"h": "Pedir con cortesía", "blocks": [2, 3]},
 {"h": "Sugerir, imaginar y el futuro del pasado", "blocks": [4, 5, 6]},
],
"blocks": [
 {"h": "Infinitivo + -ia",
  "r": "Al infinitivo se suman *-ia, -ias, -ia, -íamos, -iam*: *falaria, "
       "comeria, partiria*. Solo *nós* lleva tilde.",
  "table": {"head": ["", "falar", "comer", "partir"],
            "rows": [["eu", "falaria", "comeria", "partiria"],
                     ["tu", "falarias", "comerias", "partirias"],
                     ["você / ele / ela", "falaria", "comeria", "partiria"],
                     ["nós", "falaríamos", "comeríamos", "partiríamos"],
                     ["vocês / eles / elas", "falariam", "comeriam", "partiriam"]]},
  "ex": [["Eu *gostaria* de um suco.", "Me gustaría un jugo."],
         ["Você *poderia* repetir?", "¿Podría repetir?"],
         ["Nós *moraríamos* em Santa Teresa.", "Viviríamos en Santa Teresa."]],
  "warn": "Sin tilde en la *i*: *falaria*, no «falaría». Solo *falaríamos* "
          "lleva tilde.",
  "q": [{"prompt": "«Me gustaría ver el menú.»", "stem": "Eu ___ de ver o cardápio.",
         "answer": "gostaria", "options": ["gostaria", "gostaría", "gustaria"]}]},

 {"h": "Los mismos tres irregulares",
  "r": "Igual que en el futuro: *faria*, *diria*, *traria*. Lo demás es "
       "regular: *teria, poderia, sairia, viria, poria*.",
  "table": {"head": ["Infinitivo", "Condicional", "Español"],
            "rows": [["fazer", "faria", "haría"],
                     ["dizer", "diria", "diría"],
                     ["trazer", "traria", "traería"],
                     ["ter", "teria", "tendría"],
                     ["poder", "poderia", "podría"],
                     ["vir", "viria", "vendría"],
                     ["sair", "sairia", "saldría"]]},
  "ex": [["Eu nunca *faria* isso.", "Yo nunca haría eso."],
         ["O que você *diria* a ele?", "¿Qué le dirías?"],
         ["*Teria* um quarto livre?", "¿Tendría una habitación libre?"]],
  "warn": "«Tendría» es *teria* y «podría», *poderia*: nada de «tendria» ni "
          "«podria», que son español con disfraz.",
  "q": [{"prompt": "«¿Tendría una mesa para dos?»", "stem": "Vocês ___ uma mesa para dois?",
         "answer": "teriam", "options": ["teriam", "tendriam", "tiveriam"]}]},

 {"h": "Cortesía en el restaurante y el hotel",
  "r": "*Eu gostaria de...*, *Você poderia...?*, *Seria possível...?* "
       "suavizan cualquier pedido. Es el registro de hotel, restaurante y mail.",
  "ex": [["*Eu gostaria de* fazer uma reserva.", "Quisiera hacer una reserva."],
         ["*Você poderia* me trazer a conta?", "¿Me podría traer la cuenta?"],
         ["*Seria possível* trocar de quarto?", "¿Sería posible cambiar de habitación?"],
         ["*Você se importaria de* fechar a janela?", "¿Le molestaría cerrar la ventana?"]],
  "warn": "«Quisiera» no se traduce con subjuntivo: *eu gostaria*, *eu "
          "queria*. Y *gostar* sigue pidiendo *de*: *gostaria de um café*.",
  "q": [{"prompt": "«¿Me podría ayudar?»", "stem": "Você ___ me ajudar?",
         "answer": "poderia", "options": ["poderia", "podria", "pudera"]}]},

 {"h": "Al hablar: queria, podia",
  "r": "En la charla, el imperfeito reemplaza al condicional: *eu queria "
       "um café*, *você podia me ajudar?* Es igual de amable.",
  "ex": [["*Eu queria* um mate e um biscoito Globo.", "Quería un mate y un bizcocho Globo."],
         ["*Você podia* me passar o sal?", "¿Me pasabas la sal?"],
         ["Eu *ia* adorar!", "¡Me encantaría!"],
         ["No seu lugar, eu *ficava* em casa.", "En tu lugar, me quedaba en casa. (habla)"]],
  "tip": "*ia* + infinitivo = condicional hablado: *eu ia gostar* = me "
         "gustaría. Muy carioca."},

 {"h": "Sugerir e imaginar",
  "r": "*Você deveria...* (deberías), *Seria bom...*, *Eu, no seu "
       "lugar,...* Para imaginar: *Eu moraria em Paraty*.",
  "ex": [["Você *deveria* conhecer a Lapa.", "Deberías conocer Lapa."],
         ["*Seria bom* ir de metrô.", "Estaría bueno ir en subte."],
         ["No seu lugar, eu *pediria* a moqueca.", "En tu lugar, pediría la moqueca."],
         ["Que tal *ir* ao Pão de Açúcar?", "¿Qué tal si vamos al Pan de Azúcar?"]],
  "warn": "«Deberías» es *deveria*, no «deberias». *devia* (imperfeito) es "
          "la versión hablada: *você devia descansar*."},

 {"h": "El futuro visto desde el pasado",
  "r": "Como en español, el condicional cuenta lo que alguien anunció: "
       "*Ele disse que viria*. En el habla: *ele disse que ia vir*.",
  "ex": [["Ela disse que *chegaria* às oito.", "Dijo que llegaría a las ocho."],
         ["Eu sabia que você *gostaria*.", "Sabía que te gustaría."],
         ["Ele prometeu que *ia ligar*.", "Prometió que iba a llamar. (habla)"]],
  "q": [{"prompt": "«Dijo que vendría.»", "stem": "Ele disse que ___.",
         "answer": "viria", "options": ["viria", "vendria", "virá"]}]},

 {"h": "Recusar um convite sem ofender",
  "q": [{"prompt": "Te invitan a un asado el sábado y no podés. Elegí lo más natural.", "answer": "Poxa, adoraria, mas vou viajar. Fica pra próxima!", "options": ["Poxa, adoraria, mas vou viajar. Fica pra próxima!", "Não, obrigado.", "Não posso. Tchau."]}],
  "r": "Un «no» brasileño casi nunca es seco: agradecé, lamentá y dá una razón o una alternativa: *poxa, adoraria, mas…*, *fica pra próxima*.",
  "ex": [["*Adoraria*, mas já tenho compromisso.", "Me encantaría, pero ya tengo un compromiso."], ["*Que pena*, nesse dia não *vai dar*.", "Qué lástima, ese día no voy a poder."], ["*Fica pra próxima!*", "¡Queda para la próxima!"], ["*Obrigado pelo convite*, de verdade.", "Gracias por la invitación, de verdad."], ["*Vou ver* e te falo.", "Voy a ver y te aviso."]],
  "warn": "*Vou ver e te falo* muchas veces es un «no» educado. Y *não vai dar* es «no voy a poder»."},

]},

19: {
"intro": "Comparar en portugués es casi como en español, con tres trampas: "
         "*mais* (nunca «más»), el *do que* y los irregulares que no admiten "
         "*mais*.",
"parts": [
 {"h": "Más, menos, tan", "blocks": [0, 1, 2]},
 {"h": "El más... y -íssimo", "blocks": [3, 4, 5]},
],
"blocks": [
 {"h": "mais / menos ... (do) que",
  "r": "*mais* (con i) y *menos* + adjetivo + *do que* o *que*: *o Rio é "
       "mais quente do que Curitiba*.",
  "ex": [["Ipanema é *mais cara do que* Botafogo.", "Ipanema es más cara que Botafogo."],
         ["O metrô é *mais rápido que* o ônibus.", "El subte es más rápido que el colectivo."],
         ["Esse tênis é *menos confortável do que* o outro.", "Estas zapatillas son menos cómodas que las otras."],
         ["Ela tem *mais* paciência *do que* eu.", "Tiene más paciencia que yo."]],
  "warn": "«más» se escribe *mais*: nunca «mas» (que es «pero») ni «más». "
          "Y tras *que*, el pronombre es sujeto: *do que eu*, no «do que mim».",
  "tip": "*do que* y *que* son iguales; *do que* es lo más frecuente al "
         "hablar y al escribir.",
  "q": [{"prompt": "«Río es más grande que Niterói.» (¡ojo!)", "stem": "O Rio é ___ Niterói.",
         "answer": "maior do que", "options": ["maior do que", "mais grande do que", "mais maior que"]}]},

 {"h": "tão ... quanto: la igualdad",
  "r": "*tão* + adjetivo + *quanto* (o *como*); con sustantivo, *tanto / "
       "tanta* + *quanto*: *tanto dinheiro quanto você*.",
  "ex": [["Salvador é *tão* quente *quanto* o Rio.", "Salvador es tan caluroso como Río."],
         ["Ela fala *tão* bem *como* a professora.", "Habla tan bien como la profesora."],
         ["Não tenho *tanta* sorte *quanto* você.", "No tengo tanta suerte como vos."],
         ["Ele trabalha *tanto quanto* eu.", "Trabaja tanto como yo."]],
  "warn": "«tan... como» es *tão... quanto* o *tão... como*; «tan» a secas "
          "no existe. Y *tanto* concuerda: *tantas praias quanto*.",
  "q": [{"prompt": "«Es tan linda como Florianópolis.»", "stem": "É ___ bonita quanto Florianópolis.",
         "answer": "tão", "options": ["tão", "tan", "tanto"]}]},

 {"h": "maior, menor, melhor, pior",
  "r": "*grande → maior*, *pequeno → menor*, *bom → melhor*, *ruim / mau "
       "→ pior*. «mais grande» y «mais bom» son errores.",
  "table": {"head": ["Adjetivo", "Comparativo", "Español"],
            "rows": [["grande", "maior", "más grande, mayor"],
                     ["pequeno", "menor", "más chico, menor"],
                     ["bom", "melhor", "mejor"],
                     ["ruim / mau", "pior", "peor"],
                     ["velho / novo (edad)", "mais velho / mais novo", "mayor / menor (de edad)"]]},
  "ex": [["O Maracanã é *maior* que o Engenhão.", "El Maracanã es más grande que el Engenhão."],
         ["Esse açaí é *melhor* que o de ontem.", "Este açaí es mejor que el de ayer."],
         ["O trânsito hoje está *pior*.", "Hoy el tránsito está peor."],
         ["Meu apartamento é *menor* que o seu.", "Mi departamento es más chico que el tuyo."]],
  "warn": "En español «más grande» es normal; en portugués se dice *maior*. "
          "*mais pequeno* existe (en Portugal), pero en Brasil se usa *menor*.",
  "more": ["Delante de un participio se admite *mais bem* / *mais mal*: *o "
           "aluno mais bem preparado*. *melhor* y *pior* también son "
           "adverbios: *ela canta melhor que eu*."]},

 {"h": "El superlativo: o mais ... de",
  "r": "Artículo + *mais / menos* + adjetivo + *de* (contraído): *a praia "
       "mais bonita do Rio*, *o bairro menos caro da zona sul*.",
  "ex": [["É *a praia mais bonita do* Brasil.", "Es la playa más linda de Brasil."],
         ["O Cristo é *o lugar mais famoso da* cidade.", "El Cristo es el lugar más famoso de la ciudad."],
         ["Ele é *o melhor* jogador *do* time.", "Es el mejor jugador del equipo."],
         ["Foi *o pior* dia *da* minha vida.", "Fue el peor día de mi vida."]],
  "warn": "El segundo término va con *de* contraído: *do Rio*, *da cidade*. "
          "Nada de «el más ... que»: *o mais caro do bairro*.",
  "q": [{"prompt": "«El barrio más caro de Río.»", "stem": "O bairro mais caro ___ Rio.",
         "answer": "do", "options": ["do", "de o", "que o"]}]},

 {"h": "-íssimo y compañía",
  "r": "*-íssimo* intensifica: *caro → caríssimo*, *lindo → lindíssimo*. "
       "Algunos cultos: *fácil → facílimo*, *feliz → felicíssimo*.",
  "table": {"head": ["Adjetivo", "Superlativo", "Nota"],
            "rows": [["caro", "caríssimo", "cae la vocal final"],
                     ["rico", "riquíssimo", "c → qu"],
                     ["feliz", "felicíssimo", "z → c"],
                     ["fácil / difícil", "facílimo / dificílimo", "-il → -ílimo"],
                     ["amável", "amabilíssimo", "-vel → -bilíssimo"]]},
  "ex": [["A feijoada estava *ótima*!", "¡La feijoada estaba buenísima!"],
         ["Esse restaurante é *caríssimo*.", "Este restaurante es carísimo."],
         ["O show foi *superlegal*.", "El show estuvo buenísimo. (habla)"]],
  "tip": "*ótimo* y *péssimo* son los superlativos de *bom* y *ruim*: "
         "*ótimo* = buenísimo, *péssimo* = malísimo. Se usan a cada rato."},

 {"h": "bem = muy; mesmo = realmente, incluso",
  "r": "Delante de adjetivo, *bem* = «muy»: *bem caro*, *bem perto*. "
       "*mesmo* detrás = realmente; delante = incluso.",
  "ex": [["O hotel é *bem* perto da praia.", "El hotel está muy cerca de la playa."],
         ["Está *bem* frio hoje.", "Hoy hace bastante frío."],
         ["É caro *mesmo*.", "Es realmente caro."],
         ["*Mesmo* assim, eu fui.", "Aun así, fui."]],
  "warn": "*bem caro* no es «bien caro» con matiz: es simplemente «muy "
          "caro». Y nunca «muy»: en portugués, *muito* o *bem*.",
  "q": [{"prompt": "«¿En serio?» (sorpresa)", "stem": "É ___?",
         "answer": "mesmo", "options": ["mesmo", "bem", "muito"]}]},
]},

20: {
"intro": "*tudo* y *todo*, *nenhum*, *ninguém* y la negación que en Brasil "
         "aparece dos veces en la misma frase. Esta semana, cuantificar, "
         "negar y reaccionar.",
"parts": [
 {"h": "tudo, todo y los indefinidos", "blocks": [0, 1, 5]},
 {"h": "Negar en portugués de Brasil", "blocks": [2, 3, 4]},
 {"h": "Reaccionar y no coincidir sin pelear", "blocks": [6, 7, 8]},
],
"blocks": [
 {"h": "tudo ≠ todo",
  "r": "*tudo* es pronombre invariable: «todo» sin sustantivo. *todo / "
       "toda / todos / todas* acompañan a un sustantivo.",
  "ex": [["Comi *tudo*.", "Me comí todo."],
         ["*Tudo* bem?", "¿Todo bien?"],
         ["*Todos* os meus amigos foram.", "Fueron todos mis amigos."],
         ["*Toda* a cidade parou.", "Se paró toda la ciudad."]],
  "warn": "«Todo está bien» es *tudo está bem*; «entendí todo», *entendi "
          "tudo*. Si no hay sustantivo detrás, casi siempre es *tudo*.",
  "more": ["*todo dia* (sin artículo) = cada día, todos los días; *o dia "
           "todo* o *todo o dia* = el día entero. *todo mundo* = todo el mundo, "
           "todos: *todo mundo gosta de praia*."],
  "q": [{"prompt": "«¿Entendiste todo?»", "stem": "Você entendeu ___?",
         "answer": "tudo", "options": ["tudo", "todo", "todos"]},
        {"prompt": "«Voy a la playa todos los días.»", "stem": "Vou à praia ___ dia.",
         "answer": "todo", "options": ["todo", "tudo", "cada o"]}]},

 {"h": "algum / nenhum, alguém / ninguém, algo / nada",
  "r": "Personas: *alguém / ninguém*. Cosas: *algo / nada*. Con "
       "sustantivo: *algum, alguma / nenhum, nenhuma*.",
  "table": {"head": ["", "afirmativo", "negativo", "Ejemplo"],
            "rows": [["persona", "alguém (alguien)", "ninguém (nadie)", "*Alguém* ligou? — *Ninguém*."],
                     ["cosa", "algo, alguma coisa (algo)", "nada (nada)", "Quer *algo*? — *Nada*, obrigado."],
                     ["+ sustantivo", "algum / alguma (algún, alguna)", "nenhum / nenhuma (ningún, ninguna)", "*Algum* problema? — *Nenhum*."],
                     ["tiempo", "sempre, alguma vez (siempre, alguna vez)", "nunca (nunca)", "*Sempre* vou. / *Nunca* vou."],
                     ["lugar", "em algum lugar (en algún lado)", "em lugar nenhum (en ningún lado)", "Está *em algum lugar*. / Não está *em lugar nenhum*."]]},
  "ex": [["Tem *alguém* aí?", "¿Hay alguien ahí?"],
         ["*Nenhum* amigo veio.", "No vino ningún amigo."],
         ["Não tenho *nenhuma* ideia.", "No tengo ninguna idea."],
         ["Você quer *alguma coisa*?", "¿Querés algo?"]],
  "warn": "«ninguno» es *nenhum* (con nh y m): nunca «ninguno». Y va en "
          "singular: *nenhum amigo*, no «nenhuns amigos»."},

 {"h": "La doble negación",
  "r": "Si la palabra negativa va **detrás** del verbo, delante va *não*: "
       "*não vi ninguém*. Si va delante, sin *não*: *ninguém veio*.",
  "ex": [["*Não* vi *ninguém* na praia.", "No vi a nadie en la playa."],
         ["*Ninguém* sabe.", "Nadie sabe."],
         ["*Não* comi *nada*.", "No comí nada."],
         ["*Nunca* fui a Manaus. / *Não* fui *nunca*.", "Nunca fui a Manaos."]],
  "tip": "Es la misma lógica del español: *não... nada*, *não... ninguém*. "
         "Lo que cambia es la forma de cada palabra.",
  "q": [{"prompt": "«No vino nadie.»", "stem": "___ veio.",
         "answer": "Ninguém", "options": ["Ninguém", "Não ninguém", "Nenhum"]}]},

 {"h": "também não, nem",
  "r": "«tampoco» = *também não*: *eu também não*. «ni» = *nem*: *nem eu*, "
       "*nem... nem*. *tampouco* existe, pero es formal.",
  "ex": [["— Não gosto de chuva. — Eu *também não*.", "—No me gusta la lluvia. —A mí tampoco."],
         ["*Nem* eu!", "¡Ni yo!"],
         ["Não bebo *nem* café *nem* chá.", "No tomo ni café ni té."],
         ["*Nem* pensar!", "¡Ni loco! / ¡Ni lo pienses!"]],
  "warn": "«Yo tampoco» no es «eu tampouco» en una charla: suena a libro. "
          "Decí *eu também não* o *nem eu*.",
  "q": [{"prompt": "«—No fui. —Yo tampoco.»", "stem": "— Não fui. — Eu ___.",
         "answer": "também não", "options": ["também não", "tampoco", "também"]}]},

 {"h": "«Não sei não»: negar al final",
  "r": "En el habla brasileña la negación se repite al final (*não sei "
       "não*) o va solo al final (*sei não*). Se responde con el verbo.",
  "ex": [["*Não* gosto *não*.", "No, no me gusta. (habla)"],
         ["Sei *não*.", "No sé. (habla, nordeste y Río)"],
         ["— Você vai? — *Vou*. / — *Não vou*.", "—¿Vas? —Sí. / —No."],
         ["— Tá cansado? — *Tô não*.", "—¿Estás cansado? —No."]],
  "warn": "Contestar solo *sim* suena seco. Lo natural es repetir el verbo: "
          "*—Gostou? —Gostei!* Y *não* solo, con el verbo: *—Não fui.*",
  "more": ["*tá* y *tô* son *está* y *estou* recortados: muy frecuentes al "
           "hablar y en mensajes, nunca en un texto formal. Lo mismo *pra* "
           "por *para*."]},

 {"h": "Cantidad: muito, pouco, bastante, demais",
  "r": "*muito / pouco* concuerdan con el sustantivo (*muitas pessoas*) y "
       "no varían como adverbio (*muito caro*). *demais* = demasiado o muchísimo.",
  "ex": [["Tinha *muitas* pessoas no bloco.", "Había mucha gente en el bloque."],
         ["Ela é *muito* simpática.", "Es muy simpática."],
         ["Comi *demais*.", "Comí demasiado."],
         ["Esse show foi bom *demais*!", "¡Ese show estuvo buenísimo!"],
         ["Tenho *pouco* tempo.", "Tengo poco tiempo."]],
  "warn": "Nunca «muy»: *muito* sirve para «muy» y «mucho». Y *cada* no "
          "varía: *cada dia*, *cada semana*.",
  "tip": "*bastante* = mucho, bastante: *bastante gente*. *um pouco de* = "
         "un poco de: *um pouco de farofa*."},

 {"h": "Palavras que não estão no dicionário (4): ué, eita, nem pensar, pois é",
  "q": [{"prompt": "—O ônibus atrasou de novo. ¿Cómo le das la razón?", "answer": "Pois é…", "options": ["Pois é…", "Pues es…", "Nem pensar!"]}],
  "r": "Reacciones: *ué* (extrañeza), *eita* (sorpresa, susto), *nem pensar* y *de jeito nenhum* (negativa firme), *pois é* (dar la razón).",
  "ex": [["*Ué*, a loja está fechada?", "¿Eh? ¿La tienda está cerrada?"], ["*Eita*, que susto!", "¡Uy, qué susto!"], ["— Empresta o carro? — *Nem pensar!*", "—¿Me prestás el auto? —¡Ni loco!"], ["— O ônibus atrasou de novo. — *Pois é…*", "—El colectivo se atrasó otra vez. —Y sí…"], ["*De jeito nenhum* vou sair com essa chuva.", "De ninguna manera salgo con esta lluvia."]],
  "warn": "*pois é* no es «pues es»: es «y sí», «así es», para dar la razón o llenar una pausa.",
  "tip": "*Eita* nació en el Nordeste y hoy se oye en todo Brasil."},

 {"h": "Discordar sem brigar",
  "q": [{"prompt": "Un colega dice que Río es la ciudad más cara de Brasil. No estás de acuerdo. Elegí lo más adecuado.", "answer": "Acho que não é bem assim: São Paulo é mais cara.", "options": ["Acho que não é bem assim: São Paulo é mais cara.", "Não. Você está errado.", "Nem pensar, você não sabe nada."]}],
  "r": "Para no coincidir sin ofender: *acho que não é bem assim*, *entendo, mas…*, *em parte, você tem razão*. El *não* seco suena brusco.",
  "ex": [["*Acho que não é bem assim.*", "Me parece que no es tan así."], ["*Entendo, mas* eu vejo de outro jeito.", "Te entiendo, pero yo lo veo de otra manera."], ["*Em parte*, você tem razão.", "En parte, tenés razón."], ["*Não sei, não…*", "Mmm, no sé…"]],
  "warn": "«Estás equivocado» → *você está enganado* suena fuerte. Mejor *acho que não é bem assim*."},

 {"h": "Sotaque da semana: Bahia",
  "q": [{"prompt": "En Salvador, ¿quién es mainha?", "answer": "la mamá", "options": ["la mamá", "la abuela", "la madrina"]}],
  "r": "El baiano abre las vocales y alarga las frases; sus marcas: *oxe* (sorpresa, fastidio), *meu rei* (trato cariñoso), *painho* y *mainha* (papá y mamá).",
  "ex": [["*Oxe*, que foi isso?", "¡Epa! ¿Qué fue eso?"], ["Calma, *meu rei*!", "¡Tranquilo, querido!"], ["*Mainha* fez acarajé.", "Mamá hizo acarajé."]],
  "tip": "*Oxe* y *oxente* se oyen en todo el Nordeste. La voz de la app es la estándar: el acento no se oye, las palabras sí."},

]},

21: {
"intro": "*tenho feito* se parece a «he hecho», pero no lo es: habla de algo "
         "que se repite o sigue hasta hoy. Y además, el pasado del pasado: "
         "*tinha feito*.",
"parts": [
 {"h": "La forma y los participios", "blocks": [0, 1]},
 {"h": "tenho feito ≠ he hecho", "blocks": [2, 3, 4]},
 {"h": "tinha feito: el pasado del pasado", "blocks": [5]},
],
"blocks": [
 {"h": "ter + participio",
  "r": "*ter* en presente + participio, que **no varía**: *tenho falado*, "
       "*tem comido*, *temos saído*, *têm dormido*.",
  "table": {"head": ["", "trabalhar", "comer"],
            "rows": [["eu", "tenho trabalhado", "tenho comido"],
                     ["você / ele / ela", "tem trabalhado", "tem comido"],
                     ["nós", "temos trabalhado", "temos comido"],
                     ["vocês / eles / elas", "têm trabalhado", "têm comido"]]},
  "ex": [["*Tenho trabalhado* muito.", "Vengo trabajando mucho."],
         ["Ela *tem saído* com o Rafa.", "Viene saliendo con Rafa."],
         ["Nós *temos ido* à praia todo fim de semana.", "Venimos yendo a la playa todos los fines de semana."]],
  "warn": "El participio no concuerda: *ela tem saído*, nunca «saída». Y "
          "*eles têm* lleva circunflejo; *ele tem*, no.",
  "q": [{"prompt": "«Ellos vienen estudiando mucho.»", "stem": "Eles ___ estudado muito.",
         "answer": "têm", "options": ["têm", "tem", "han"]}]},

 {"h": "Participios irregulares",
  "r": "Regulares: *-ado* y *-ido*. Irregulares de uso diario: *feito, "
       "dito, visto, vindo, escrito, aberto, posto*.",
  "table": {"head": ["Infinitivo", "Participio", "Español"],
            "rows": [["fazer", "feito", "hecho"],
                     ["dizer", "dito", "dicho"],
                     ["ver", "visto", "visto"],
                     ["vir", "vindo", "venido"],
                     ["escrever", "escrito", "escrito"],
                     ["abrir", "aberto", "abierto"],
                     ["pôr", "posto", "puesto"]]},
  "ex": [["O que você *tem feito*?", "¿Qué andás haciendo?"],
         ["Não *tenho visto* a Bia.", "No vengo viendo a Bia. (hace tiempo que no la veo)"],
         ["Ele *tem escrito* muitas músicas.", "Viene escribiendo muchas canciones."]],
  "warn": "«hecho» es *feito* (no «fecho»); «venido» es *vindo*, igual al "
          "gerundio. Y *visto* sirve para *ver*, no para *vestir*.",
  "q": [{"prompt": "«¿Qué andás haciendo?»", "stem": "O que você tem ___?",
         "answer": "feito", "options": ["feito", "fazido", "hecho"]}]},

 {"h": "tenho feito = vengo haciendo",
  "r": "El composto indica algo **repetido o continuo** que empezó en el "
       "pasado y sigue hasta hoy. «He hecho» (una vez) no se dice así.",
  "ex": [["*Tenho dormido* mal.", "Vengo durmiendo mal."],
         ["*Tem chovido* muito no Rio.", "Viene lloviendo mucho en Río."],
         ["Ultimamente *temos comido* em casa.", "Últimamente venimos comiendo en casa."],
         ["Você *tem visto* o João?", "¿Lo venís viendo a João? (¿lo ves seguido?)"]],
  "warn": "«He visto esa película» no es «tenho visto esse filme», que "
          "significa verla una y otra vez. Una vez es *vi esse filme*.",
  "q": [{"prompt": "«Vengo trabajando mucho.»", "stem": "___ muito.",
         "answer": "Tenho trabalhado", "options": ["Tenho trabalhado", "Trabalhei", "Hei trabalhado"]}]},

 {"h": "Las pistas",
  "r": "*ultimamente*, *nos últimos tempos*, *desde...*, *cada vez mais* "
       "llaman al composto. *hoje*, *já*, *nunca*, *ainda não*, al perfeito.",
  "table": {"head": ["Pista", "Tiempo", "Ejemplo"],
            "rows": [["ultimamente", "composto", "Tenho saído pouco."],
                     ["nos últimos meses", "composto", "Tem feito calor."],
                     ["hoje, esta semana", "perfeito", "Hoje comi feijoada."],
                     ["já, nunca, ainda não", "perfeito", "Nunca fui a Manaus."]]},
  "ex": [["*Nos últimos meses* tenho corrido no Aterro.", "En los últimos meses vengo corriendo en el Aterro."],
         ["*Esta semana* fui duas vezes à academia.", "Esta semana fui dos veces al gimnasio."]]},

 {"h": "«He comido» se dice comi",
  "r": "Todo lo que el español dice con «he + participio» —hoy, ya, nunca, "
       "todavía no— en portugués va en perfeito simple.",
  "ex": [["Hoje eu *acordei* cedo.", "Hoy me he despertado temprano."],
         ["Você *já foi* a Salvador?", "¿Ya has ido a Salvador?"],
         ["*Nunca comi* acarajé.", "Nunca he comido acarajé."],
         ["*Ainda não almocei*.", "Todavía no he almorzado."],
         ["*Acabei de* chegar.", "Acabo de llegar (recién llegué)."]],
  "warn": "«¿Has estado en Brasil?» es *Você já esteve no Brasil?*; decir "
          "«tem estado» cambia el sentido: ¿venís estando?",
  "q": [{"prompt": "«Hoy he comido demasiado.»", "stem": "Hoje eu ___ demais.",
         "answer": "comi", "options": ["comi", "tenho comido", "hei comido"]}]},

 {"h": "tinha feito: había hecho",
  "r": "*ter* en imperfeito + participio: *tinha feito* = había hecho. Una "
       "acción anterior a otra pasada. En lo escrito, también *havia feito*.",
  "table": {"head": ["", "sair"],
            "rows": [["eu", "tinha saído"],
                     ["você / ele / ela", "tinha saído"],
                     ["nós", "tínhamos saído"],
                     ["vocês / eles / elas", "tinham saído"]]},
  "ex": [["Quando cheguei ao Maracanã, o jogo já *tinha começado*.", "Cuando llegué al Maracanã, el partido ya había empezado."],
         ["Ela *tinha saído* quando você ligou.", "Ella había salido cuando llamaste."],
         ["Eu nunca *tinha visto* o mar.", "Nunca había visto el mar."],
         ["O filme *havia terminado*. (escrito)", "La película había terminado."]],
  "tip": "Acá sí coincide con el español: «había» + participio = *tinha* + "
         "participio. Solo cambia el auxiliar: *ter*, no «haver» al hablar.",
  "q": [{"prompt": "«Ya habíamos cenado.»", "stem": "Nós já ___ jantado.",
         "answer": "tínhamos", "options": ["tínhamos", "tinhamos", "temos"]}]},
]},

22: {
"intro": "Participios con dos formas y una pasiva que concuerda con todo: es "
         "la gramática de las noticias y de los trámites.",
"parts": [
 {"h": "Participios irregulares y dobles", "blocks": [0, 1, 2]},
 {"h": "La voz pasiva con ser y estar", "blocks": [3, 4, 5]},
],
"blocks": [
 {"h": "Los irregulares de siempre",
  "r": "*feito, dito, visto, vindo, escrito, aberto, coberto, posto*. Sus "
       "compuestos siguen igual: *descoberto, desfeito, previsto*.",
  "table": {"head": ["Infinitivo", "Participio", "Español"],
            "rows": [["fazer", "feito", "hecho"],
                     ["dizer", "dito", "dicho"],
                     ["ver", "visto", "visto"],
                     ["vir", "vindo", "venido"],
                     ["escrever", "escrito", "escrito"],
                     ["abrir", "aberto", "abierto"],
                     ["cobrir", "coberto", "cubierto"],
                     ["pôr", "posto", "puesto"]]},
  "ex": [["A loja está *aberta*.", "El negocio está abierto."],
         ["O bolo foi *feito* pela minha avó.", "La torta la hizo mi abuela."],
         ["A carta foi *escrita* em 1950.", "La carta fue escrita en 1950."]],
  "warn": "«cubierto» es *coberto* y «descubierto», *descoberto*: la *u* "
          "del español se vuelve *o*.",
  "q": [{"prompt": "«El Cristo está cubierto de nubes.»", "stem": "O Cristo está ___ de nuvens.",
         "answer": "coberto", "options": ["coberto", "cubierto", "cobrido"]}]},

 {"h": "Participios dobles",
  "r": "Algunos verbos tienen dos: uno regular (*-ado, -ido*) y otro corto: "
       "*pagado / pago*, *aceitado / aceito*, *entregado / entregue*.",
  "table": {"head": ["Verbo", "Regular", "Corto"],
            "rows": [["pagar", "pagado", "pago"],
                     ["aceitar", "aceitado", "aceito"],
                     ["ganhar", "ganhado", "ganho"],
                     ["gastar", "gastado", "gasto"],
                     ["entregar", "entregado", "entregue"],
                     ["eleger", "elegido", "eleito"],
                     ["imprimir", "imprimido", "impresso"],
                     ["prender", "prendido", "preso"],
                     ["morrer / matar", "morrido / matado", "morto"],
                     ["acender", "acendido", "aceso"]]},
  "ex": [["O boleto está *pago*.", "La factura está paga."],
         ["A encomenda foi *entregue*.", "El paquete fue entregado."],
         ["O ladrão foi *preso*.", "El ladrón fue detenido."]],
  "warn": "*preso* es el participio de *prender* (detener, sujetar): «fue "
          "preso» = lo detuvieron. Y *entregue* termina en *-e*, sin *-ado*."},

 {"h": "Cuál va con cuál",
  "r": "Norma: *ter / haver* + el regular (*tinha aceitado*); *ser / estar* "
       "+ el corto (*foi aceito*, *está pago*).",
  "ex": [["Eu *tinha aceitado* o convite. / O convite *foi aceito*.", "Había aceptado la invitación. / La invitación fue aceptada."],
         ["O correio *tinha entregado* a carta. / A carta *foi entregue*.", "El correo había entregado la carta. / La carta fue entregada."],
         ["O prefeito *foi eleito* em outubro.", "El intendente fue elegido en octubre."],
         ["A luz *estava acesa*.", "La luz estaba encendida."]],
  "more": ["En Brasil, *pago*, *ganho* y *gasto* también van con *ter*: "
           "*tinha pago*, *tenho gasto*, *tinha ganho* son lo más común y "
           "la norma los acepta. *chegar* tiene un solo participio: "
           "*chegado*. «tinha chego» se oye mucho, pero es incorrecto."],
  "q": [{"prompt": "«El paquete fue entregado ayer.»", "stem": "A encomenda foi ___ ontem.",
         "answer": "entregue", "options": ["entregue", "entregada", "entrego"]}]},

 {"h": "La pasiva con ser",
  "r": "*ser* + participio, que concuerda con el sujeto: *a ponte foi "
       "construída*. El agente va con *por*, que se contrae: *pelo, pela*.",
  "ex": [["O Cristo Redentor *foi inaugurado* em 1931.", "El Cristo Redentor fue inaugurado en 1931."],
         ["A casa *foi construída* em 1920.", "La casa fue construida en 1920."],
         ["As provas *foram corrigidas pela* professora.", "Los exámenes fueron corregidos por la profesora."],
         ["O resultado *será divulgado* amanhã.", "El resultado será publicado mañana."]],
  "warn": "El participio concuerda: *a casa foi construída*, nunca "
          "«construído». Y «por el / por la» es *pelo / pela*.",
  "tip": "Los titulares la adoran, en presente: *Túnel é fechado para "
         "obras*, *Ladrão é preso em Copacabana*.",
  "q": [{"prompt": "«Las playas fueron limpiadas por la municipalidad.»",
         "stem": "As praias foram limpas ___ prefeitura.",
         "answer": "pela", "options": ["pela", "por la", "por a"]}]},

 {"h": "estar + participio: el resultado",
  "r": "*ser* + participio cuenta la **acción**; *estar* + participio, el "
       "**estado** que queda: *a loja foi fechada* / *a loja está fechada*.",
  "ex": [["O museu *foi fechado* em 2020.", "El museo fue cerrado en 2020. (acción)"],
         ["O museu *está fechado* hoje.", "El museo está cerrado hoy. (estado)"],
         ["O documento *está assinado*.", "El documento está firmado."],
         ["As passagens *já estão compradas*.", "Los pasajes ya están comprados."]],
  "warn": "Como en español: *ser* = pasó; *estar* = así quedó. Pero ojo con "
          "los dobles: con *estar* va el corto, *está pago*, *está aceso*.",
  "q": [{"prompt": "«La cuenta está paga.»", "stem": "A conta está ___.",
         "answer": "paga", "options": ["paga", "pagada", "pago"]}]},

 {"h": "Leer palabras largas: -ção, -mento, -dade",
  "q": [{"prompt": "¿Qué significa «a construção»?", "answer": "la construcción", "options": ["la construcción", "construir", "construido"]}],
  "r": "Muchas palabras largas son un verbo o un adjetivo con sufijo: *-ção* (-ción), *-mento* (-miento), *-dade* (-dad), *-eza* (-eza). Reconocelas y entendés el texto.",
  "table": {"head": ["Base", "Palabra"], "rows": [["construir", "a construção"], ["pagar", "o pagamento"], ["cidadão", "a cidadania"], ["feliz", "a felicidade"], ["belo", "a beleza"]]},
  "ex": [["A *construção* do Cristo durou nove anos.", "La construcción del Cristo duró nueve años."], ["O *pagamento* foi feito por Pix.", "El pago se hizo por Pix."], ["A *felicidade* não tem preço.", "La felicidad no tiene precio."], ["A *beleza* da baía é famosa.", "La belleza de la bahía es famosa."]],
  "warn": "*-ção* es femenino (*a construção*), *-mento* masculino (*o pagamento*), *-dade* femenino (*a cidade*).",
  "tip": "Esta semana, a leer; en la semana 44 vas a formarlas vos."},

]},

23: {
"intro": "El subjuntivo presente se usa casi como en español: deseo, duda, "
         "recomendación. Las formas se parecen, pero no son las mismas: "
         "*seja, esteja, vá, saiba, haja*.",
"parts": [
 {"h": "La forma", "blocks": [0, 1, 2]},
 {"h": "Deseo y recomendación", "blocks": [3, 4]},
 {"h": "Duda y opinión", "blocks": [5, 6]},
],
"blocks": [
 {"h": "Raíz del «eu» + vocal cambiada",
  "r": "1.ª persona del presente sin *-o*, y vocal cambiada: *-ar → -e*, "
       "*-er / -ir → -a*. *falo → fale*, *faço → faça*, *tenho → tenha*.",
  "table": {"head": ["", "falar", "comer", "fazer (faço)", "ter (tenho)"],
            "rows": [["eu / você / ele", "fale", "coma", "faça", "tenha"],
                     ["tu", "fales", "comas", "faças", "tenhas"],
                     ["nós", "falemos", "comamos", "façamos", "tenhamos"],
                     ["vocês / eles", "falem", "comam", "façam", "tenham"]]},
  "ex": [["digo → *diga*, posso → *possa*", "diga, pueda"],
         ["venho → *venha*, vejo → *veja*", "venga, vea"],
         ["ouço → *ouça*, peço → *peça*", "oiga, pida"],
         ["durmo → *durma*, trago → *traga*", "duerma, traiga"]],
  "warn": "El diptongo del español no pasa: «pueda» es *possa*, «duerma», "
          "*durma*. Siempre partí de la forma *eu* del portugués.",
  "q": [{"prompt": "Subjuntivo de «fazer» (eu):", "stem": "que eu ___",
         "answer": "faça", "options": ["faça", "faza", "haga"]}]},

 {"h": "Siete que van aparte",
  "r": "Su *eu* no termina en *-o* (*sou, estou, vou, dou, sei, quero*...), "
       "así que se aprenden de memoria.",
  "table": {"head": ["Verbo", "eu / você", "nós", "vocês / eles"],
            "rows": [["ser", "seja", "sejamos", "sejam"],
                     ["estar", "esteja", "estejamos", "estejam"],
                     ["ir", "vá", "vamos", "vão"],
                     ["dar", "dê", "demos", "deem"],
                     ["saber", "saiba", "saibamos", "saibam"],
                     ["querer", "queira", "queiramos", "queiram"],
                     ["haver", "haja", "—", "—"]]},
  "ex": [["Espero que você *esteja* bem.", "Espero que estés bien."],
         ["Tomara que *seja* verdade.", "Ojalá sea verdad."],
         ["É bom que eles *saibam*.", "Es bueno que lo sepan."]],
  "warn": "El español dicta «sea, vaya, sepa, haya»: en portugués son "
          "*seja, vá, saiba, haja*. Y *deem* va sin tilde desde 1990.",
  "q": [{"prompt": "«Ojalá sea un buen día.»", "stem": "Tomara que ___ um bom dia.",
         "answer": "seja", "options": ["seja", "sea", "é"]}]},

 {"h": "La grafía se acomoda",
  "r": "Para conservar el sonido cambia la letra: *ficar → fique*, "
       "*chegar → chegue*, *começar → comece*, *dirigir → dirija*.",
  "table": {"head": ["Terminación", "Cambio", "Ejemplo"],
            "rows": [["-car", "c → qu", "ficar → fique"],
                     ["-gar", "g → gu", "chegar → chegue"],
                     ["-çar", "ç → c", "começar → comece"],
                     ["-ger / -gir", "g → j", "proteger → proteja"]]},
  "ex": [["Espero que você *fique* mais uns dias.", "Espero que te quedes unos días más."],
         ["Tomara que o ônibus *chegue* logo.", "Ojalá que el colectivo llegue pronto."],
         ["Quero que o show *comece* na hora.", "Quiero que el show empiece a horario."]]},

 {"h": "Deseo y voluntad",
  "r": "*querer que*, *esperar que*, *tomara que* + subjuntivo. Con el "
       "mismo sujeto, infinitivo: *quero ir* / *quero que você vá*.",
  "ex": [["Espero que você *goste* do Rio.", "Espero que te guste Río."],
         ["Tomara que não *chova* no domingo.", "Ojalá no llueva el domingo."],
         ["Quero que vocês *conheçam* a Bahia.", "Quiero que conozcan Bahía."],
         ["Ela quer que eu *faça* o jantar.", "Quiere que yo haga la cena."]],
  "warn": "«Ojalá» es *tomara que* (o *oxalá*, más literario), siempre con "
          "subjuntivo. Con *espero que*, ojo a *goste*: el que gusta sigue "
          "siendo el sujeto.",
  "q": [{"prompt": "«Ojalá que no llueva.»", "stem": "Tomara que não ___.",
         "answer": "chova", "options": ["chova", "chove", "llova"]}]},

 {"h": "Recomendar y valorar",
  "r": "*é importante que*, *é melhor que*, *é bom que*, *recomendo que*, "
       "*sugiro que* + subjuntivo. Sin sujeto concreto, infinitivo.",
  "ex": [["É importante que você *beba* muita água.", "Es importante que tomes mucha agua."],
         ["O médico recomenda que eu *descanse*.", "El médico me recomienda que descanse."],
         ["É melhor que vocês *vão* de metrô.", "Es mejor que vayan en subte."],
         ["É bom *dormir* oito horas.", "Es bueno dormir ocho horas."]],
  "tip": "Para consejos amistosos, *é melhor você...* también se oye con "
         "infinitivo o presente al hablar; al escribir, *é melhor que você "
         "vá*."},

 {"h": "Duda: talvez, é possível que",
  "r": "*talvez* delante del verbo pide subjuntivo: *talvez ele venha*. "
       "También *é possível que*, *duvido que*, *pode ser que*.",
  "ex": [["*Talvez* eu *vá* ao bloco.", "Tal vez vaya al bloque."],
         ["*É possível que* chova à tarde.", "Es posible que llueva a la tarde."],
         ["*Duvido que* ele *saiba*.", "Dudo que sepa."],
         ["*Pode ser que* ela *esteja* no trabalho.", "Puede que esté en el trabajo."]],
  "warn": "En el español hablado «quizás viene» es común; en portugués, "
          "*talvez* antes del verbo va con subjuntivo: *talvez venha*."},

 {"h": "achar que: indicativo",
  "r": "Opinar afirmando va con **indicativo**: *acho que ele vem*. Negado, "
       "suele pasar al subjuntivo: *não acho que ele venha*.",
  "ex": [["*Acho que* ela *está* em casa.", "Creo que está en casa."],
         ["*Acredito que* vocês *vão* gostar.", "Creo que les va a gustar."],
         ["*Não acho que* seja uma boa ideia.", "No creo que sea una buena idea."]],
  "warn": "Igual que «creo que viene / no creo que venga». El error es "
          "subjuntivizar la afirmación: «acho que ele venha».",
  "q": [{"prompt": "«Creo que el bar está abierto.»", "stem": "Acho que o bar ___ aberto.",
         "answer": "está", "options": ["está", "esteja", "estê"]}]},
]},

24: {
"intro": "Algunos conectores exigen subjuntivo siempre: *para que*, *embora*, "
         "*caso*, *antes que*. Esta semana: finalidad, condición y "
         "concesión, y el imperativo formal.",
"parts": [
 {"h": "Finalidad y tiempo", "blocks": [0, 1]},
 {"h": "Concesión y condición", "blocks": [2, 3]},
 {"h": "Imperativo formal y los que no piden subjuntivo", "blocks": [4, 5]},
 {"h": "Dudar, desear e interrumpir", "blocks": [6, 7, 8]},
],
"blocks": [
 {"h": "para que: finalidad",
  "r": "*para que*, *a fim de que* + subjuntivo si cambia el sujeto; con el "
       "mismo sujeto, *para* + infinitivo: *vim para ver* / *para que você veja*.",
  "ex": [["Vou te explicar *para que* você *entenda*.", "Te lo voy a explicar para que entiendas."],
         ["Fala mais alto *para que* todos *ouçam*.", "Hablá más fuerte para que todos oigan."],
         ["Vim ao Rio *para* conhecer o Cristo.", "Vine a Río para conocer el Cristo."],
         ["Deixei a chave *para que* ela *possa* entrar.", "Dejé la llave para que ella pueda entrar."]],
  "warn": "Como en español, siempre subjuntivo: «para que vengas» es *para "
          "que você venha*, nunca «para que você vem».",
  "q": [{"prompt": "«Te lo digo para que lo sepas.»", "stem": "Te digo isso para que você ___.",
         "answer": "saiba", "options": ["saiba", "sabe", "sepa"]}]},

 {"h": "antes que, até que, sem que",
  "r": "*antes que*, *até que*, *sem que* + subjuntivo: *antes que chova*. "
       "Mismo sujeto: *antes de sair*, *sem dizer nada*.",
  "ex": [["Vamos embora *antes que* *chova*.", "Vámonos antes de que llueva."],
         ["Espera aqui *até que* eu *volte*.", "Esperá acá hasta que vuelva."],
         ["Ele sai *sem que* ninguém *perceba*.", "Sale sin que nadie se dé cuenta."],
         ["Saiu *sem* dizer nada.", "Se fue sin decir nada."]],
  "warn": "«antes de que» se dice *antes que*, sin *de*. Con infinitivo sí "
          "va *de*: *antes de sair*.",
  "more": ["*depois que* no pide subjuntivo presente: con pasado va en "
           "indicativo (*depois que cheguei*). Con futuro, *quando* y "
           "*depois que* usan el futuro do subjuntivo, que llega en la "
           "semana 27."]},

 {"h": "embora: siempre subjuntivo",
  "r": "*embora* (aunque) va **siempre** con subjuntivo, aunque el hecho "
       "sea real: *embora esteja cansado, vou à praia*.",
  "ex": [["*Embora* *esteja* chovendo, vamos ao jogo.", "Aunque está lloviendo, vamos al partido."],
         ["*Embora* ele *seja* paulista, torce pelo Flamengo.", "Aunque es paulista, es hincha de Flamengo."],
         ["*Mesmo que* *custe* caro, vale a pena.", "Aunque cueste caro, vale la pena."],
         ["*Apesar do* calor, foi ótimo.", "A pesar del calor, estuvo genial."]],
  "warn": "«Aunque está cansado» lleva indicativo en español; en portugués, "
          "con *embora*, no: *embora esteja*. Si querés indicativo, usá "
          "*apesar de que* o *mas*.",
  "more": ["*ir embora* es otra cosa: «irse». *Vou embora* = me voy. El "
           "*embora* de concesión es formal y escrito; al hablar se dice "
           "*mesmo que* o se da vuelta la frase con *mas*: *tá chovendo, "
           "mas a gente vai*."],
  "q": [{"prompt": "«Aunque es caro, lo compro.»", "stem": "Embora ___ caro, eu compro.",
         "answer": "seja", "options": ["seja", "é", "sea"]}]},

 {"h": "caso y desde que: condición",
  "r": "*caso* = «en caso de que, si»: *caso chova, fico em casa*. *desde "
       "que* + subjuntivo = «siempre que, con tal de que».",
  "ex": [["*Caso* você *precise*, me liga.", "Si necesitás algo, llamame."],
         ["*Caso* *chova*, o show será no Circo Voador.", "Si llueve, el show será en el Circo Voador."],
         ["Pode ir, *desde que* *volte* cedo.", "Podés ir, siempre que vuelvas temprano."],
         ["*Contanto que* você *pague*, tudo bem.", "Con tal de que pagues, todo bien."],
         ["Vamos à praia, *a menos que* *chova*.", "Vamos a la playa, a menos que llueva."]],
  "warn": "*desde que* + subjuntivo es condición; + indicativo, tiempo: "
          "*desde que cheguei, chove* = desde que llegué, llueve.",
  "more": ["Con *se* («si») el portugués usa otro tiempo que el español no "
           "tiene, el futuro do subjuntivo: *se chover*. Llega en la semana "
           "27; por ahora, para la hipótesis futura, *caso* + subjuntivo "
           "presente."],
  "q": [{"prompt": "«Si llueve (en caso de que llueva), me quedo.»", "stem": "Caso ___, eu fico.",
         "answer": "chova", "options": ["chova", "chove", "choverá"]}]},

 {"h": "Imperativo formal y negativo",
  "r": "El imperativo de *você* escrito y **todos** los negativos toman "
       "el subjuntivo: *fale*, *não fale*, *seja bem-vindo*.",
  "table": {"head": ["Verbo", "você", "você (no)", "vocês"],
            "rows": [["falar", "fale", "não fale", "falem"],
                     ["fazer", "faça", "não faça", "façam"],
                     ["ser", "seja", "não seja", "sejam"],
                     ["ir", "vá", "não vá", "vão"],
                     ["preocupar-se", "preocupe-se", "não se preocupe", "preocupem-se"]]},
  "ex": [["Não *faça* isso!", "¡No haga eso!"],
         ["*Seja* bem-vindo ao Rio!", "¡Bienvenido a Río!"],
         ["Não se *preocupe*.", "No se preocupe."],
         ["*Aperte* o cinto.", "Abróchese el cinturón. (cartel)"]],
  "tip": "Al hablar, con amigos: *fala*, *não fala*, *vem cá*. En "
         "carteles, avisos, mails y con desconocidos: *fale*, *não fale*.",
  "q": [{"prompt": "«No se olvide del pasaporte.» (formal)", "stem": "Não ___ do passaporte.",
         "answer": "esqueça", "options": ["esqueça", "esquece", "olvide"]}]},

 {"h": "Los que no piden subjuntivo",
  "r": "*porque*, *já que*, *como* (causal) y *depois que* con pasado van "
       "con **indicativo**: *já que você está aqui, fica pro jantar*.",
  "ex": [["Fui embora *porque* *estava* cansado.", "Me fui porque estaba cansado."],
         ["*Já que* você *vai* ao mercado, compra pão?", "Ya que vas al súper, ¿comprás pan?"],
         ["*Como* *chovia*, ficamos em casa.", "Como llovía, nos quedamos en casa."]],
  "warn": "No subjuntivices por analogía: la causa es un hecho y va en "
          "indicativo. «Porque esteja cansado» es error."},

 {"h": "Palavras que não estão no dicionário (5): será que, vai que, sei lá, tomara",
  "q": [{"prompt": "¿Cómo se dice «ojalá salga todo bien»?", "answer": "Tomara que dê tudo certo!", "options": ["Tomara que dê tudo certo!", "Tomara que dá tudo certo!", "Vai que dê tudo certo!"]}],
  "r": "Para dudar y desear: *será que…?* (me pregunto si…), *vai que…* (por si…), *sei lá* (qué sé yo), *tomara que* + subjuntivo (ojalá).",
  "ex": [["*Será que* vai chover?", "¿Irá a llover?"], ["Leva o guarda-chuva, *vai que* chove.", "Llevá el paraguas, por si llueve."], ["— Onde ele está? — *Sei lá!*", "—¿Dónde está? —¡Qué sé yo!"], ["*Tomara que* dê tudo certo!", "¡Ojalá salga todo bien!"]],
  "warn": "*vai que* va en el habla con presente de indicativo (*vai que chove*); *tomara que*, siempre con subjuntivo (*tomara que chova*)."},

 {"h": "Interromper e pedir um favor grande",
  "q": [{"prompt": "Necesitás que una vecina te cuide el gato un mes. Elegí el pedido más adecuado.", "answer": "Será que você poderia cuidar do meu gato em julho?", "options": ["Será que você poderia cuidar do meu gato em julho?", "Cuida do meu gato em julho.", "Você cuida do gato, né?"]}],
  "r": "Para interrumpir: *desculpa interromper*, *só um minutinho*. Un favor grande se prepara: *queria te pedir uma coisa*, *será que você poderia…?*.",
  "ex": [["*Desculpa interromper*, mas o táxi chegou.", "Perdón que interrumpa, pero llegó el taxi."], ["*Só um minutinho*: deixa eu terminar.", "Un minutito: dejame terminar."], ["*Queria te pedir uma coisa.*", "Te quería pedir algo."], ["*Será que você poderia* me emprestar o carro?", "¿Me podrías prestar el auto?"], ["*Você se importaria de* regar as plantas?", "¿Te molestaría regar las plantas?"]],
  "warn": "El imperativo solo (*Cuida do meu gato*) es para lo chico. Para lo grande, pregunta y condicional."},

 {"h": "Sotaque da semana: Pernambuco",
  "q": [{"prompt": "En Recife, «O show foi massa!» quiere decir…", "answer": "¡El recital estuvo bárbaro!", "options": ["¡El recital estuvo bárbaro!", "El recital fue masivo.", "El recital fue pesado."]}],
  "r": "En Recife se usa *tu* y se abren las vocales. Sus palabras: *oxente* (sorpresa), *massa* (bárbaro), *arretado* (bárbaro, o enojado).",
  "ex": [["*Oxente*, *tu* não sabia?", "¿Cómo? ¿No sabías?"], ["O show foi *massa*!", "¡El recital estuvo bárbaro!"], ["Esse frevo é *arretado*!", "¡Este frevo es bárbaro!"]],
  "tip": "El *frevo* es el ritmo del carnaval de Recife y Olinda. La voz de la app es la estándar: el acento no se oye, las palabras sí."},

]},

25: {
"intro": "*que* hace casi todo el trabajo. El resto —*quem*, *onde*, *o "
         "qual*, *cujo*— aparece con preposición o posesión, y ahí el "
         "español tienta con artículos de más.",
"parts": [
 {"h": "que, quem, onde", "blocks": [0, 1, 2]},
 {"h": "o que y la preposición delante", "blocks": [3, 4]},
 {"h": "o qual y cujo", "blocks": [5, 6]},
],
"blocks": [
 {"h": "que: el comodín",
  "r": "*que* sirve para personas y cosas, como sujeto u objeto: *o cara "
       "que mora no Leblon*, *o livro que comprei*.",
  "ex": [["A moça *que* trabalha no quiosque é baiana.", "La chica que trabaja en el quiosco es bahiana."],
         ["O açaí *que* comi ontem era ótimo.", "El açaí que comí ayer era buenísimo."],
         ["Conheci um cara *que* toca pandeiro.", "Conocí a un tipo que toca el pandeiro."],
         ["As fotos *que* você tirou ficaram lindas.", "Las fotos que sacaste quedaron hermosas."]],
  "warn": "Sin artículo: «la chica a la que conocí» es *a moça que conheci*. "
          "No hay «a» personal ni «la que» cuando hay antecedente.",
  "q": [{"prompt": "«El amigo que conocí en Lapa.»", "stem": "O amigo ___ conheci na Lapa.",
         "answer": "que", "options": ["que", "a quem", "o que"]}]},

 {"h": "quem, tras preposición",
  "r": "Para personas tras preposición: *de quem*, *com quem*, *para "
       "quem*. Sin antecedente, *quem* = «el que»: *quem avisa amigo é*.",
  "ex": [["A pessoa *de quem* te falei chegou.", "Llegó la persona de la que te hablé."],
         ["O amigo *com quem* viajei é gaúcho.", "El amigo con el que viajé es gaúcho."],
         ["*Quem* chega primeiro guarda o lugar.", "El que llega primero guarda el lugar."],
         ["*Quem* sabe, sabe.", "El que sabe, sabe."]],
  "warn": "No borres la preposición del verbo: «la persona que hablé» es "
          "*a pessoa com quem falei*. *falar com*, *com quem*.",
  "q": [{"prompt": "«La chica con la que salí.»", "stem": "A menina ___ saí.",
         "answer": "com quem", "options": ["com quem", "que", "com a que"]}]},

 {"h": "onde y aonde",
  "r": "*onde* = donde (lugar, igual a *em que*): *a cidade onde nasci*. "
       "Con verbos de movimiento hacia, *aonde*: *aonde você vai?*",
  "ex": [["O bairro *onde* moro é tranquilo.", "El barrio donde vivo es tranquilo."],
         ["A praia *onde* a gente se conheceu.", "La playa donde nos conocimos."],
         ["*Aonde* vocês vão depois?", "¿Adónde van después?"],
         ["A cidade *de onde* venho é pequena.", "La ciudad de donde vengo es chica."]],
  "tip": "Si podés decir *em que*, va *onde*; si podés decir *a que* "
         "(dirección), va *aonde*. Al hablar, *onde* se usa para todo."},

 {"h": "o que = lo que",
  "r": "«lo que» es *o que*: *não entendi o que ele disse*; «todo lo "
       "que», *tudo o que*. *O que* también pregunta: *o que é isso?*",
  "ex": [["Não entendi *o que* ele disse.", "No entendí lo que dijo."],
         ["*Do que* eu mais gosto no Rio é a praia.", "Lo que más me gusta de Río es la playa."],
         ["Fiz *tudo o que* você pediu.", "Hice todo lo que pediste."],
         ["Ele chegou tarde, *o que* é normal.", "Llegó tarde, lo que es normal."]],
  "warn": "Nunca «lo que»: es español puro. «Lo» no existe en portugués: "
          "*o que*, *o bom*, *o importante é...*",
  "q": [{"prompt": "«Eso es lo que quiero.»", "stem": "Isso é ___ eu quero.",
         "answer": "o que", "options": ["o que", "lo que", "que"]}]},

 {"h": "La preposición va delante",
  "r": "La preposición que pide el verbo sube delante del relativo: *a "
       "cidade em que moro*, *o filme de que gostei*, *a pessoa com quem saí*.",
  "ex": [["O filme *de que* mais gostei foi *Cidade de Deus*.", "La película que más me gustó fue Ciudad de Dios."],
         ["A casa *em que* moro tem varanda.", "La casa en la que vivo tiene balcón."],
         ["O assunto *de que* falamos é sério.", "El tema del que hablamos es serio."],
         ["O ônibus *em que* eu estava quebrou.", "Se rompió el colectivo en el que estaba."]],
  "more": ["Al hablar la preposición se cae muchísimo: *o filme que eu mais "
           "gostei*, *a casa que eu moro*. Es normal en la charla, pero al "
           "escribir (y en el examen) poné la preposición: *de que gostei*, "
           "*em que moro*."],
  "q": [{"prompt": "«La playa que me gusta.» (escrito)", "stem": "A praia ___ eu gosto.",
         "answer": "de que", "options": ["de que", "que", "da que"]}]},

 {"h": "o qual, a qual, os quais",
  "r": "Tras preposiciones largas o para evitar ambigüedad: *sobre o qual*, "
       "*pela qual*, *durante o qual*. Concuerda con el antecedente.",
  "ex": [["O projeto *sobre o qual* falei.", "El proyecto sobre el que hablé."],
         ["A rua *pela qual* passamos.", "La calle por la que pasamos."],
         ["Os amigos, *os quais* moram em Niterói, vieram.", "Vinieron los amigos, los cuales viven en Niterói."],
         ["As ruas *pelas quais* passamos são antigas.", "Las calles por las que pasamos son antiguas."]],
  "tip": "Suena formal: al hablar, *que* resuelve casi todo. Tras "
         "preposiciones de una sílaba, *que* o *quem* alcanzan."},

 {"h": "cujo, cuja",
  "r": "*cujo* = «cuyo»: concuerda con lo **poseído** y no lleva artículo "
       "detrás: *o autor cujo livro li*, *a cantora cujas músicas ouço*.",
  "ex": [["O escritor *cujo* livro li é carioca.", "El escritor cuyo libro leí es carioca."],
         ["A cantora *cujas* músicas ouço é da Bahia.", "La cantante cuyas canciones escucho es de Bahía."],
         ["O bairro *cuja* praia é a mais bonita.", "El barrio cuya playa es la más linda."],
         ["Os alunos *cujos* pais vieram ficaram felizes.", "Los alumnos cuyos padres vinieron quedaron contentos."]],
  "warn": "Nada de «cujo o»: el artículo sobra. Y concuerda con lo poseído: "
          "*o homem cuja casa*, no «cujo casa».",
  "q": [{"prompt": "«La chica cuyo padre es médico.»", "stem": "A menina ___ pai é médico.",
         "answer": "cujo", "options": ["cujo", "cuja", "cujo o"]}]},
]},

26: {
"intro": "CHEFÃO de la segunda estación: el relato en pasado, los "
         "pronombres, el futuro y la cortesía, el composto y el subjuntivo. "
         "Un repaso compacto antes del combate.",
"parts": [
 {"h": "Pasado, pronombres, futuro", "blocks": [0, 1, 2]},
 {"h": "Composto, subjuntivo y lo demás", "blocks": [3, 4, 5]},
],
"blocks": [
 {"h": "Imperfeito o perfeito",
  "r": "Decorado (costumbre, descripción, edad, hora, clima) en imperfeito; "
       "los hechos que hacen avanzar el relato, en perfeito.",
  "ex": [["*Era* domingo e *fazia* sol; de repente, *começou* a chover.", "Era domingo y hacía sol; de golpe empezó a llover."],
         ["Quando eu *tinha* dez anos, *morava* em Olinda.", "Cuando tenía diez años, vivía en Olinda."],
         ["*Estava* dormindo quando você *ligou*.", "Estaba durmiendo cuando llamaste."]],
  "q": [{"prompt": "«Cuando era chico, iba a la playa todos los días.»",
         "stem": "Quando eu era criança, ___ à praia todo dia.",
         "answer": "ia", "options": ["ia", "fui", "iba"]}]},

 {"h": "Pronombres y posesivos",
  "r": "Pronombre delante al hablar (*me dá*); *o / a* y *-lo / -la* al "
       "escribir; *dele / dela* para «de él / de ella»; *comigo*, *para mim*.",
  "ex": [["O carro *dele* é azul.", "El auto de él es azul."],
         ["Eu *o* vi ontem. / Eu vi *ele* ontem. (habla)", "Lo vi ayer."],
         ["Vou *comprá-la* amanhã.", "La voy a comprar mañana. (escrito)"],
         ["Isso é *para mim*?", "¿Esto es para mí?"]],
  "warn": "*seu* en Brasil es «tuyo» (de *você*). Para «su» de un tercero, "
          "*dele / dela*: *a casa dela*.",
  "q": [{"prompt": "«Vení con nosotros.»", "stem": "Vem ___!",
         "answer": "conosco", "options": ["conosco", "com nós", "connós"]}]},

 {"h": "Futuro, condicional y cortesía",
  "r": "*farei, direi, trarei* / *faria, diria, traria*; lo demás, regular. "
       "Para pedir: *gostaria*, *poderia*, o el hablado *queria*.",
  "ex": [["Eu *farei* tudo amanhã.", "Haré todo mañana."],
         ["*Teremos* sol no fim de semana.", "Tendremos sol el fin de semana."],
         ["*Poderia* me trazer a conta?", "¿Me podría traer la cuenta?"],
         ["Eu *queria* uma água de coco.", "Quería un agua de coco."]],
  "q": [{"prompt": "«Diría que sí.»", "stem": "Eu ___ que sim.",
         "answer": "diria", "options": ["diria", "dizeria", "diría"]}]},

 {"h": "Composto frente al pretérito",
  "r": "*tenho feito* = vengo haciendo (repetido hasta hoy); «he hecho» es "
       "*fiz*. El pasado del pasado: *tinha feito*.",
  "ex": [["*Tenho ido* muito à academia.", "Vengo yendo mucho al gimnasio."],
         ["Hoje *fui* à academia.", "Hoy he ido al gimnasio."],
         ["Quando cheguei, eles já *tinham saído*.", "Cuando llegué, ya se habían ido."]],
  "q": [{"prompt": "«¿Ya has estado en Bahía?»", "stem": "Você já ___ na Bahia?",
         "answer": "esteve", "options": ["esteve", "tem estado", "há estado"]}]},

 {"h": "Subjuntivo y conectores",
  "r": "*espero que*, *tomara que*, *talvez*, *embora*, *para que*, *caso* + "
       "subjuntivo; *acho que*, *porque*, *já que* + indicativo.",
  "ex": [["Tomara que *faça* sol amanhã.", "Ojalá haga sol mañana."],
         ["*Embora* *esteja* cansada, ela vai sair.", "Aunque está cansada, va a salir."],
         ["Acho que ele *vem*.", "Creo que viene."],
         ["Não *faça* barulho!", "¡No haga ruido!"]],
  "q": [{"prompt": "«Espero que te guste.»", "stem": "Espero que você ___.",
         "answer": "goste", "options": ["goste", "gosta", "guste"]}]},

 {"h": "Gostar, comparativos y relativos",
  "r": "*gosto do*, *penso nela*, *preciso de*; *maior, melhor, pior*; "
       "*tudo / todo*; *de que*, *com quem*, *cujo* sin artículo.",
  "ex": [["Gosto *do* samba e *da* bossa nova.", "Me gustan el samba y la bossa nova."],
         ["O Rio é *maior* do que Niterói.", "Río es más grande que Niterói."],
         ["O bar *de que* te falei fica na Lapa.", "El bar del que te hablé queda en Lapa."],
         ["Comi *tudo*.", "Me comí todo."]],
  "warn": "Los errores que más se repiten: «me gosta», «mais grande», "
          "«todo» por *tudo* y «lo que» por *o que*."},
]},

}
