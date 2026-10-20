/*
 * Duelos de Rumo C1: dos formas que compiten.  Solo los datos: la lógica
 * (sesión, pista, lados) está en el núcleo, docs/js/duelli.js, que lee
 * window.DUELLI_DATA.
 *
 * Dos formas que compiten, mezcladas en la misma sesión.
 *
 * Intercalar funciona cuando las categorías se parecen entre sí (Brunmair &
 * Richter 2019, g = 0,42, y más cuanto más parecidas); pedir que expliques
 * por qué suma (Bisra et al. 2018, g = 0,55).  Cada oración trae la pista
 * que decide («cue», un pedazo de la oración): después de elegir la forma,
 * «¿qué te lo dijo?».  Cada duelo se abre cuando las dos formas ya se
 * enseñaron («week», según tools/pt/curriculo.py).
 *
 * Los ocho duelos del portugués para hispanohablantes: ser/estar, por/para,
 * perfeito/imperfeito, perfeito simples/composto, seu/dele, indicativo/
 * subjuntivo, futuro do subjuntivo/infinitivo pessoal y la crase (à/a).
 */
(function (root) {
  "use strict";

  // s: la oración con ___; a: la forma correcta; b: la que compite;
  // cue: lo que decide (un pedazo de la oración); why: la regla en una línea;
  // k: el lado del duelo (0 = la primera forma del título, 1 = la segunda).
  function A(s, a, b, cue, why) { return { s: s, a: a, b: b, cue: cue, why: why, k: 0 }; }
  function B(s, a, b, cue, why) { return { s: s, a: a, b: b, cue: cue, why: why, k: 1 }; }

  var DUELLI = [
    // Semana 1: solo ser, estar y ter, sin contracciones ni presente regular
    // (llegan en las semanas 3 y 5).  El contraste que de verdad hace
    // tropezar: dónde queda algo fijo va con ser (o ficar), dónde está una
    // persona, con estar.  Los ítems nuevos van al final: el repaso guarda
    // las tarjetas por índice.
    { id: "serestar", week: 1, title: "ser o estar", sub: "lo que algo es, dónde queda, o cómo y dónde está", items: [
      A("Eu ___ argentino, de Buenos Aires.", "sou", "estou", "argentino", "Nacionalidad y origen: ser."),
      A("A Bia ___ médica e muito simpática.", "é", "está", "médica", "Profesión: ser."),
      A("O Rio ___ uma cidade muito bonita.", "é", "está", "cidade", "Definir, clasificar: ser."),
      A("O João e eu ___ irmãos e temos um gato.", "somos", "estamos", "irmãos", "Parentesco: ser."),
      A("A aula de português ___ hoje ou amanhã?", "é", "está", "aula", "Cuándo es un evento: ser."),
      A("Hoje ___ sábado, dia de feira.", "é", "está", "sábado", "Días y fechas: ser (*hoje é sábado*)."),
      A("Vocês ___ de Salvador ou de Recife?", "são", "estão", "de Salvador", "Origen: ser de."),
      A("O João ___ alto e muito simpático.", "é", "está", "simpático", "Rasgos de carácter y de aspecto: ser."),
      A("A casa grande ___ de uma amiga carioca.", "é", "está", "de uma amiga", "Posesión: ser de."),
      A("A festa ___ sábado, em Botafogo.", "é", "está", "festa", "Cuándo y dónde es un evento (una fiesta, un show): ser."),
      B("Eu ___ muito cansado hoje.", "estou", "sou", "hoje", "Un estado de ahora: estar."),
      B("Onde você ___ agora? Em Copacabana?", "está", "é", "agora", "Dónde está una persona: estar."),
      B("A sopa ___ fria, não quente.", "está", "é", "fria", "Un estado que cambió (se enfrió): estar."),
      B("A Bia e o João ___ em Ipanema agora.", "estão", "são", "agora", "Ubicación de personas: estar."),
      B("Cuidado, o café ___ muito quente!", "está", "é", "Cuidado", "Cómo está algo en este momento: estar."),
      B("Hoje o mar ___ calmo e azul.", "está", "é", "Hoje", "El mar de hoy, no el de siempre: estar."),
      B("Nós ___ com fome e com sede.", "estamos", "somos", "com fome", "*Estar com* fome, sede, frio, sono."),
      B("A Bia ___ doente e muito cansada hoje.", "está", "é", "doente", "Salud: estar."),
      B("Hoje o banco ___ fechado, e o metrô também.", "está", "é", "fechado", "Resultado, estado: estar + participio."),
      B("Hoje o céu ___ nublado em Copacabana.", "está", "é", "nublado", "El tiempo de hoy: estar."),
      A("A festa ___ em Botafogo, um bairro tranquilo.", "é", "está", "festa",
        "Un evento se ubica con ser (o ficar): *a festa é / fica em Botafogo*."),
      A("O show ___ em Copacabana, com a Bia.", "é", "está", "show",
        "Un evento se ubica con ser (o ficar): *o show é / fica em Copacabana*."),
      A("Onde ___ a reunião? Em Botafogo.", "é", "está", "reunião",
        "Un evento se ubica con ser (o ficar): *onde é a reunião?*"),
      A("O casamento ___ perto ou longe daqui?", "é", "está", "casamento",
        "Un evento, cerca o lejos: *é perto*, *é longe* (o *fica perto*)."),
      B("O Martín ___ em Copacabana agora, com a Bia.", "está", "é", "agora",
        "Una persona se mueve: dónde está hoy va con estar. El barrio, que no se mueve, iría con ser."),
      B("A Bia ___ em casa hoje, com o gato.", "está", "é", "em casa",
        "Dónde está una persona: estar (*estou em casa*). La casa misma *é* en Botafogo.")
    ] },

    { id: "porpara", week: 9, title: "por o para", sub: "por dónde y por qué, o hacia dónde y para qué", items: [
      A("Vamos passear ___ Santa Teresa?", "por", "para", "passear", "Recorrer un lugar: por."),
      A("Obrigado ___ tudo, de verdade!", "por", "para", "Obrigado", "Agradecer: *obrigado por*."),
      A("Compro esse quadro ___ cem reais.", "por", "para", "cem reais", "Precio, intercambio: por."),
      A("Eu passo ___ Copacabana todos os dias.", "por", "para", "passo", "Pasar por un lugar: por."),
      A("Trabalho oito horas ___ dia.", "por", "para", "dia", "Distribución (por día, por persona): por."),
      A("Esse ônibus passa ___ Botafogo?", "por", "para", "passa", "El recorrido: por."),
      A("Troco o meu livro ___ um café.", "por", "para", "Troco", "Cambiar una cosa por otra: por."),
      A("Viajamos ___ todo o Nordeste de carro.", "por", "para", "todo o Nordeste", "Recorrer una región: por."),
      A("Desculpa ___ não ligar ontem.", "por", "para", "Desculpa", "La causa: *desculpa por*."),
      A("Estou aqui ___ acaso, sem querer.", "por", "para", "acaso", "*Por acaso* = por casualidad."),
      B("Esse presente é ___ você, feliz aniversário!", "para", "por", "presente", "El destinatario: para."),
      B("Amanhã eu vou ___ São Paulo de ônibus.", "para", "por", "vou", "El destino: *ir para*."),
      B("Estudo português ___ morar no Brasil.", "para", "por", "morar", "Finalidad + infinitivo: para."),
      B("___ mim, o melhor bairro é Botafogo.", "Para", "Por", "mim", "Opinión: *para mim*."),
      B("Preciso do relatório ___ sexta-feira sem falta.", "para", "por", "sexta-feira", "El plazo: para."),
      B("Esse ônibus vai ___ o Centro?", "para", "por", "vai", "La dirección: *ir para*."),
      B("As flores são ___ a sua mãe.", "para", "por", "flores", "El destinatario: para."),
      B("Ele trabalha ___ uma empresa alemã.", "para", "por", "trabalha", "Para quién trabajás: para."),
      B("Esse remédio é ___ dor de cabeça.", "para", "por", "remédio", "Para qué sirve algo: para."),
      B("Falta pouco ___ o Carnaval do Rio de Janeiro.", "para", "por", "Falta pouco", "*Falta pouco para* = falta poco para.")
    ] },

    { id: "passado", week: 15, title: "perfeito o imperfeito", sub: "el hecho o el fondo", items: [
      A("Ontem eu ___ à praia com a Bia.", "fui", "ia", "Ontem", "Un hecho puntual y terminado: perfeito."),
      A("De repente, ___ a luz no prédio todo.", "acabou", "acabava", "De repente", "Lo que pasa de golpe: perfeito."),
      A("Em 2014, a Copa do Mundo ___ no Brasil.", "foi", "era", "Em 2014", "Un hecho fechado en el pasado: perfeito."),
      A("Semana passada nós ___ uma feijoada.", "comemos", "comíamos", "Semana passada", "Un hecho terminado: perfeito."),
      A("Enquanto eu cozinhava, o telefone de casa ___.", "tocou", "tocava", "Enquanto eu cozinhava", "Lo que interrumpe la acción en curso: perfeito."),
      A("Ele ___ três anos em Lisboa.", "morou", "morava", "três anos", "Un período cerrado, con su duración: perfeito."),
      A("Ontem à noite a gente ___ até tarde.", "dançou", "dançava", "Ontem à noite", "Un hecho terminado: perfeito."),
      A("Naquele dia, ___ tudo errado.", "deu", "dava", "Naquele dia", "Lo que pasó una vez: perfeito."),
      A("Ano passado eu ___ Machado de Assis pela primeira vez.", "li", "lia", "pela primeira vez", "Una vez, terminado: perfeito."),
      A("O Brasil ___ independente em 1822.", "ficou", "ficava", "em 1822", "Un cambio en una fecha: perfeito."),
      B("Quando eu era criança, ___ à praia todo domingo.", "ia", "fui", "todo domingo", "Hábito en el pasado: imperfeito."),
      B("Antigamente, a gente ___ em Niterói.", "morava", "morou", "Antigamente", "Cómo era antes: imperfeito."),
      B("Enquanto eu ___, o telefone tocou.", "cozinhava", "cozinhei", "Enquanto", "La acción en curso que otra interrumpe: imperfeito."),
      B("A casa dos meus avós ___ enorme e cheia de plantas.", "era", "foi", "enorme", "Una descripción: imperfeito."),
      B("Todo verão, nós ___ para Búzios.", "íamos", "fomos", "Todo verão", "Lo que se repetía: imperfeito."),
      B("Naquela época, ela sempre ___ cedo.", "acordava", "acordou", "sempre", "Hábito: imperfeito."),
      B("Eram oito horas e ___ muito no Centro.", "chovia", "choveu", "Eram oito horas", "El fondo de la escena: imperfeito."),
      B("Quando eu ___ pequeno, tinha medo do mar.", "era", "fui", "pequeno", "Edad y descripción en el pasado: imperfeito."),
      B("Naquela época, ele ___ na padaria da esquina.", "trabalhava", "trabalhou", "Naquela época", "Cómo eran las cosas: imperfeito."),
      B("O dia ___ lindo e o mar estava calmo.", "estava", "esteve", "o mar estava calmo", "Descripción del escenario: imperfeito.")
    ] },

    { id: "composto", week: 21, title: "perfeito simples o composto", sub: "comi o tenho comido", items: [
      A("Ontem eu ___ até as dez da noite.", "trabalhei", "tenho trabalhado", "Ontem", "Un hecho fechado: perfeito simples."),
      A("Você já ___ feijoada alguma vez?", "comeu", "tem comido", "já", "«¿Alguna vez…?», «ya…»: perfeito simples (*já comeu*), no «ha comido»."),
      A("Este ano eu ___ três vezes ao Rio.", "fui", "tenho ido", "três vezes", "Veces contadas: perfeito simples (*fui três vezes*)."),
      A("Hoje de manhã eu ___ um e-mail do chefe.", "recebi", "tenho recebido", "Hoje de manhã", "Una vez, hoy: perfeito simples («he recibido» = *recebi*)."),
      A("Ainda não ___ o filme novo do Walter Salles.", "vi", "tenho visto", "Ainda não", "*Ainda não* + perfeito simples: *ainda não vi*."),
      A("Nunca ___ tão bem como aqui!", "comi", "tenho comido", "Nunca", "*Nunca* + perfeito simples: «nunca he comido» = *nunca comi*."),
      A("Em 2019 eu ___ seis meses em Lisboa.", "morei", "tenho morado", "Em 2019", "Un período cerrado: perfeito simples."),
      A("Semana passada ___ com a Bia no telefone.", "falei", "tenho falado", "Semana passada", "Un hecho terminado: perfeito simples."),
      A("Quando você ___ ao Brasil pela primeira vez?", "veio", "tem vindo", "pela primeira vez", "Una vez: perfeito simples."),
      A("Já ___ ao Nordeste três vezes com a família.", "fui", "tenho ido", "três vezes", "Veces contadas: perfeito simples."),
      B("Ultimamente ___ muito, estou exausto.", "tenho trabalhado", "trabalhei", "Ultimamente", "Algo que se repite hasta hoy: perfeito composto."),
      B("Nos últimos meses, a gente ___ muito ao cinema.", "tem ido", "foi", "Nos últimos meses", "Una repetición que llega hasta hoy: perfeito composto."),
      B("Ele ___ muito cansado esses dias.", "tem estado", "esteve", "esses dias", "Un estado que dura hasta hoy: perfeito composto."),
      B("Você ___ o jornal ultimamente?", "tem lido", "leu", "ultimamente", "Hábito reciente: perfeito composto."),
      B("Desde janeiro, ___ português todos os dias.", "tenho estudado", "estudei", "Desde janeiro", "*Desde* + algo que sigue pasando: perfeito composto."),
      B("A inflação ___ bastante nos últimos anos.", "tem subido", "subiu", "nos últimos anos", "Un proceso que sigue: perfeito composto."),
      B("O que você ___ de bom ultimamente?", "tem feito", "fez", "ultimamente", "«¿Qué andás haciendo?»: perfeito composto."),
      B("Desde que cheguei ao Rio, ___ todo fim de semana.", "tem chovido", "choveu", "Desde que cheguei", "*Desde que* + repetición hasta hoy: perfeito composto."),
      B("Ultimamente a gente ___ pouco, né?", "tem se falado", "se falou", "Ultimamente", "Algo que viene pasando: perfeito composto."),
      B("Desde o Carnaval, ela ___ muito na academia.", "tem malhado", "malhou", "Desde o Carnaval", "*Desde* + hábito que sigue: perfeito composto.")
    ] },

    { id: "seudele", week: 10, title: "seu o dele", sub: "de você o de otro", items: [
      A("Martín, essa mochila é ___?", "sua", "dela", "Martín", "Le hablás a Martín (você): *sua*."),
      A("Senhor, esse guarda-chuva é ___?", "seu", "dele", "Senhor", "Con *o senhor* también va *seu*: le hablás a él."),
      A("Bia, esses óculos são ___?", "seus", "dela", "Bia", "Le hablás a Bia: *seus* (de você)."),
      A("Dona Ana, essa bolsa é ___?", "sua", "dela", "Dona Ana", "Le hablás a la señora: *sua*."),
      A("Você tem caneta? Essa caneta azul é ___?", "sua", "dele", "Você tem", "Hablás con você: *sua*."),
      A("Moço, esse celular no chão é ___?", "seu", "dele", "Moço", "Le hablás al muchacho: *seu*."),
      A("Rafa, essas chaves na mesa são ___?", "suas", "dele", "Rafa", "Le hablás a Rafa: *suas*."),
      A("Oi, Lucas! Esse cachorro lindo é ___?", "seu", "dele", "Lucas", "Le hablás a Lucas: *seu*."),
      A("Senhora, essa mala grande é ___?", "sua", "dela", "Senhora", "Le hablás a la señora: *sua*."),
      A("Você está com frio? Esse casaco é ___?", "seu", "dele", "Você está com frio", "Hablás con você: *seu*."),
      B("A Bia está procurando a mochila. Essa mochila é ___?", "dela", "sua", "A Bia está procurando", "Hablás de Bia, no con ella: *dela* (evita la ambigüedad de *sua*)."),
      B("O João mora aqui. Esse carro é ___.", "dele", "seu", "O João mora aqui", "Hablás de João: *dele*."),
      B("Os meninos jogam bola na praia. A bola é ___.", "deles", "sua", "Os meninos", "De ellos: *deles*."),
      B("A Ana e a Clara estão no quiosque. As cadeiras são ___.", "delas", "suas", "A Ana e a Clara", "De ellas: *delas*."),
      B("Meu vizinho tem um cachorro enorme. O cachorro é ___.", "dele", "seu", "Meu vizinho", "De él: *dele*."),
      B("A professora está na sala. Esse livro é ___.", "dela", "seu", "A professora", "De ella: *dela*."),
      B("Meus pais têm uma casa em Búzios. A casa é ___.", "deles", "sua", "Meus pais", "De ellos: *deles*."),
      B("Aquele moço ali procura o celular. O celular é ___.", "dele", "seu", "Aquele moço", "De él: *dele*."),
      B("A Sofía toca violão. Esse violão é ___.", "dela", "seu", "A Sofía", "De ella: *dela*."),
      B("Os turistas procuram as malas. As malas são ___.", "deles", "suas", "Os turistas", "De ellos: *deles*.")
    ] },

    { id: "subjuntivo", week: 23, title: "indicativo o subjuntivo", sub: "lo que se afirma o lo que se desea", items: [
      A("Acho que ele ___ razão.", "tem", "tenha", "Acho que", "*Achar que* afirmativo: indicativo (a diferencia de *não acho que*)."),
      A("Sei que você ___ ocupado hoje.", "está", "esteja", "Sei que", "Un hecho que sabés: indicativo."),
      A("Tenho certeza de que ela ___ amanhã.", "vem", "venha", "Tenho certeza", "Certeza: indicativo."),
      A("É verdade que o Rio ___ lindo no inverno.", "é", "seja", "É verdade", "Un hecho: indicativo."),
      A("Parece que ___ chover mais tarde.", "vai", "vá", "Parece que", "*Parece que* + indicativo."),
      A("Vejo que vocês ___ cansados hoje.", "estão", "estejam", "Vejo que", "Lo que ves: indicativo."),
      A("Com certeza ele ___ amanhã cedo.", "vem", "venha", "Com certeza", "Certeza: indicativo."),
      A("Acredito que o show ___ às nove.", "começa", "comece", "Acredito que", "*Acreditar que* afirmativo: indicativo."),
      A("É claro que a gente ___ ir junto.", "pode", "possa", "É claro", "Evidencia: indicativo."),
      A("Ele diz que ___ muito cansado.", "está", "esteja", "diz que", "Lo que alguien afirma: indicativo."),
      B("Espero que você ___ bem.", "esteja", "está", "Espero que", "Deseo: subjuntivo."),
      B("Quero que vocês ___ cedo amanhã.", "cheguem", "chegam", "Quero que", "Querer que otro haga algo: subjuntivo."),
      B("Talvez ela ___ hoje à noite.", "venha", "vem", "Talvez", "*Talvez* antes del verbo: subjuntivo."),
      B("Duvido que ele ___ a verdade.", "saiba", "sabe", "Duvido que", "Duda: subjuntivo."),
      B("É importante que a gente ___ junto.", "fique", "fica", "É importante que", "Juicio de valor: subjuntivo."),
      B("Não acho que ___ uma boa ideia.", "seja", "é", "Não acho", "*Achar* negado: subjuntivo."),
      B("Tomara que não ___ no fim de semana!", "chova", "chove", "Tomara", "*Tomara que* + subjuntivo."),
      B("É possível que o voo ___ atrasado.", "esteja", "está", "É possível", "Posibilidad: subjuntivo."),
      B("Peço que você ___ a porta, por favor.", "feche", "fecha", "Peço que", "Pedido: subjuntivo."),
      B("Sinto muito que você ___ doente.", "esteja", "está", "Sinto muito", "Sentimiento sobre algo: subjuntivo.")
    ] },

    { id: "futinf", week: 29, title: "futuro do subjuntivo o infinitivo pessoal", sub: "quando vocês fizerem o para vocês fazerem", items: [
      A("Quando você ___ ao Rio, me avisa.", "for", "ir", "Quando", "*Quando* + futuro: futuro do subjuntivo (*for*)."),
      A("Se vocês ___ tempo, passem lá em casa.", "tiverem", "terem", "Se", "*Se* + futuro: futuro do subjuntivo (*tiverem*)."),
      A("Assim que eu ___ o resultado, te ligo.", "souber", "saber", "Assim que", "*Assim que* + futuro: futuro do subjuntivo."),
      A("Faça como você ___, tanto faz.", "quiser", "querer", "como", "*Como* + futuro: futuro do subjuntivo (*como quiser*)."),
      A("Se a gente ___, a gente vai.", "puder", "poder", "Se", "*Se* + futuro: futuro do subjuntivo (*puder*)."),
      A("Quem ___ a resposta levanta a mão.", "souber", "saber", "Quem", "*Quem* + futuro: futuro do subjuntivo."),
      A("Sempre que você ___ ao Brasil, fique aqui em casa.", "vier", "vir", "Sempre que", "*Sempre que* + futuro: futuro do subjuntivo de *vir* (*vier*)."),
      A("Enquanto eu ___ aqui, pode contar comigo.", "estiver", "estar", "Enquanto", "*Enquanto* + futuro: futuro do subjuntivo."),
      A("Se ele ___ isso de novo, vou embora.", "disser", "dizer", "Se", "*Se* + futuro: futuro do subjuntivo (*disser*)."),
      A("Quando vocês ___ o trabalho, me mandem.", "fizerem", "fazerem", "Quando", "*Quando* + futuro: futuro do subjuntivo (*fizerem*)."),
      B("Liguei para vocês ___ as notícias por mim.", "saberem", "souberem", "para", "Después de preposición: infinitivo pessoal."),
      B("Antes de nós ___ embora, vamos jantar.", "irmos", "formos", "Antes de", "*Antes de* + infinitivo pessoal."),
      B("É melhor vocês ___ o que aconteceu.", "saberem", "souberem", "É melhor", "*É melhor* + infinitivo pessoal."),
      B("Comprei ingressos para nós ___ o show.", "vermos", "virmos", "para", "*Para* + infinitivo pessoal de *ver* (*vermos*); *virmos* es el futuro do subjuntivo."),
      B("Depois de vocês ___ o trabalho, podem sair.", "fazerem", "fizerem", "Depois de", "*Depois de* + infinitivo pessoal."),
      B("Sem eles ___ nada, a gente não decide.", "dizerem", "disserem", "Sem", "*Sem* + infinitivo pessoal."),
      B("É importante os alunos ___ presentes.", "estarem", "estiverem", "É importante", "*É importante* + infinitivo pessoal."),
      B("Até vocês ___ a resposta, esperem aqui.", "terem", "tiverem", "Até", "*Até* + infinitivo pessoal (o *até que* + subjuntivo presente)."),
      B("O professor pediu para os alunos ___ cedo.", "virem", "vierem", "pediu para", "*Pedir para* + infinitivo pessoal de *vir* (*virem*)."),
      B("Ao ___ a notícia, eles ficaram felizes.", "saberem", "souberem", "Ao", "*Ao* + infinitivo pessoal = al + infinitivo.")
    ] },

    { id: "crase", week: 36, title: "à o a", sub: "la crase: a + a", items: [
      A("Vou ___ praia de Ipanema no domingo.", "à", "a", "praia", "*Ir a* + *a praia*: à."),
      A("Cheguei ___ reunião meia hora atrasado.", "à", "a", "reunião", "*Chegar a* + *a reunião*: à."),
      A("A loja abre ___ nove horas.", "às", "as", "nove horas", "La hora exacta: às."),
      A("Entreguei o documento ___ secretária.", "à", "a", "secretária", "*Entregar a* + *a secretária*: à."),
      A("Fomos ___ festa da Bia no sábado.", "à", "a", "festa", "*Ir a* + *a festa*: à."),
      A("Assisti ___ peça no teatro municipal.", "à", "a", "Assisti", "*Assistir a* + *a peça*: à."),
      A("Refiro-me ___ situação atual do país.", "à", "a", "Refiro-me", "*Referir-se a* + *a situação*: à."),
      A("Todos devem obedecer ___ lei.", "à", "a", "obedecer", "*Obedecer a* + *a lei*: à."),
      A("Fui ___ Bahia no Carnaval.", "à", "a", "Bahia", "*A Bahia* lleva artículo: *vou à Bahia*."),
      A("Pedi um bife ___ milanesa com arroz.", "à", "a", "milanesa", "*À moda de*: à milanesa, à baiana."),
      B("Vou ___ Lisboa em julho.", "a", "à", "Lisboa", "*Lisboa* no lleva artículo (*venho de Lisboa*): sin crase."),
      B("De repente, começou ___ chover.", "a", "à", "chover", "Ante verbo nunca hay crase."),
      B("Fiquei cara ___ cara com ele.", "a", "à", "cara", "Entre palabras repetidas, sin crase."),
      B("Ela chegou ___ pé na praia.", "a", "à", "pé", "Ante masculino no hay crase."),
      B("Entreguei o livro ___ ela ontem.", "a", "à", "ela", "Ante pronombre personal, sin crase."),
      B("Estou disposto ___ ajudar vocês.", "a", "à", "ajudar", "Ante infinitivo, sin crase."),
      B("Vendem roupas ___ preços baixos.", "a", "à", "preços", "Ante masculino plural, sin crase."),
      B("Daqui ___ duas semanas começa o curso.", "a", "à", "Daqui", "*Daqui a* + tiempo: sin artículo, sin crase."),
      B("Ele foi ___ uma festa ontem.", "a", "à", "uma", "Ante *uma* (artículo indefinido), sin crase."),
      B("Escrevi ___ você ontem à noite.", "a", "à", "você", "Ante *você*, sin crase.")
    ] }
  ];

  root.DUELLI_DATA = { DUELLI: DUELLI };
})(typeof window !== "undefined" ? window : globalThis);
