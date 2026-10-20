/* Dictogloss: un texto por semana, con seis bloques léxicos a recuperar. Solo datos.
   Semanas 2-51 salvo las de jefe (13, 26, 39). El alumno escucha el texto dos veces
   (TTS pt-BR), anota palabras clave y lo reconstruye; la app puntúa la recuperación
   de los `chunks`, que tienen que estar tal cual en `text`.
   Ambientación: Río de Janeiro en lo cotidiano; desde la semana 27, sobre todo
   historia, sociología, filosofía y literatura de Brasil y de Portugal (datos y
   citas verificables; si una frase famosa es de atribución dudosa, se dice).
   Cada texto usa solo la gramática de su semana o anterior (tools/curriculo.py). */
(function (root) {
  "use strict";
  var TESTI = [
    // ------------------------------------------------ Estação 1: Primeiros Passos
    { week: 2, level: "A1", title: "Uma casa em Santa Teresa",
      es: "Una casa chica y linda en Santa Teresa: los cuartos, los muebles, los animales y la vista.",
      text: "A casa é pequena, mas é bonita. Tem dois quartos, uma cozinha e um banheiro. Tem também uma varanda com plantas. A cozinha é clara e tem uma mesa com quatro cadeiras. Bia tem um cachorro e dois gatos. Os gatos são pretos e o cachorro é branco. Tem muitos livros e uma janela grande. É uma casa antiga de Santa Teresa, e a vista é linda.",
      chunks: ["dois quartos", "uma varanda com plantas", "quatro cadeiras", "o cachorro é branco", "muitos livros", "a vista é linda"],
      keywords: ["casa", "quartos", "cozinha", "varanda", "cadeiras", "gatos", "livros", "Santa Teresa"],
      gloss: {
        "Tem dois quartos": "hay dos dormitorios (en Brasil, tem = hay)",
        "banheiro": "baño",
        "cachorro": "perro, de cualquier edad (no es «cachorro»: falso amigo)" } },

    { week: 3, level: "A1", title: "No boteco",
      es: "Una mañana en el boteco de la esquina: qué hay en la barra, quién está y cómo se pide un café.",
      text: "No boteco da esquina tem sempre muita gente. O chope está gelado e o pastel está quente. No balcão estão os jornais e um pote de azeitonas. Um senhor está na mesa do canto com um cafezinho. As coxinhas estão na vitrine. O garçom é simpático e é do Nordeste. — Bom dia! Um café e um pão na chapa, por favor. — Obrigado! — De nada.",
      chunks: ["no boteco da esquina", "muita gente", "o chope está gelado", "na vitrine", "pão na chapa", "por favor"],
      keywords: ["boteco", "chope", "pastel", "balcão", "cafezinho", "coxinhas", "garçom"],
      gloss: {
        "boteco": "bar de barrio, bodegón",
        "chope": "cerveza tirada",
        "pastel": "empanada frita rectangular (no es una torta)",
        "balcão": "la barra, el mostrador",
        "coxinhas": "croquetas de pollo con forma de gota",
        "garçom": "mozo",
        "pão na chapa": "pan con manteca tostado en la plancha" } },

    { week: 4, level: "A1", title: "Bia e Sofía",
      es: "Dos amigas muy distintas, una carioca y una rosarina: cómo son por fuera y por dentro.",
      text: "Bia é carioca, de Botafogo. É alta e magra, tem o cabelo comprido e os olhos verdes. É muito simpática e um pouco tímida. Sofía é uma amiga argentina da Bia, de Rosario. É baixa e tem o cabelo curto e cacheado. É inteligente, mas um pouco preguiçosa. São duas pessoas muito diferentes, mas são boas amigas. O Rio é uma cidade bonita e muito quente.",
      chunks: ["alta e magra", "o cabelo comprido", "os olhos verdes", "um pouco tímida", "boas amigas", "bonita e muito quente"],
      keywords: ["Bia", "Botafogo", "cabelo", "olhos", "tímida", "Sofía", "Rosario", "amigas"],
      gloss: {
        "magra": "flaca",
        "cabelo comprido": "pelo largo (comprido = largo; no es «comprimido»)",
        "cacheado": "enrulado",
        "preguiçosa": "vaga, perezosa" } },

    { week: 5, level: "A1", title: "O dia do Lucas",
      es: "La rutina de Lucas de lunes a viernes: el metro, el almuerzo, la cena. Y el sábado, el calçadão.",
      text: "Lucas mora em Botafogo e trabalha num escritório no Centro. De manhã cedo, pega o metrô na estação. Na hora do almoço, come um prato feito com os colegas e fala de futebol. À tarde, trabalha muito. À noite, volta para casa, cozinha arroz e feijão e janta com a namorada. Às vezes, escuta bossa nova na varanda. No sábado não trabalha: acorda tarde e caminha no calçadão de Copacabana.",
      chunks: ["pega o metrô", "um prato feito", "fala de futebol", "volta para casa", "arroz e feijão", "acorda tarde"],
      keywords: ["Botafogo", "escritório", "metrô", "almoço", "colegas", "feijão", "varanda", "calçadão"],
      gloss: {
        "escritório": "oficina (el lugar de trabajo; falso amigo)",
        "pega o metrô": "toma el subte (pegar = tomar un transporte)",
        "prato feito": "plato del día barato: arroz, feijão, carne y ensalada",
        "calçadão": "la costanera peatonal de la playa",
        "acorda tarde": "se despierta tarde" } },

    { week: 6, level: "A1", title: "O fim de semana",
      es: "El sábado con los amigos en la playa y el domingo con los abuelos, entre lo que alguien quiere y lo que puede hacer.",
      text: "No sábado, saio com os amigos. Vamos para a praia de Ipanema ou fazemos um passeio no Arpoador. Depois, bebemos um mate gelado com biscoito Globo. No domingo, os avós vêm almoçar e eu preciso cozinhar. Não sei cozinhar bem, mas faço um peixe com farofa. À tarde, quero descansar, mas não posso: os avós querem jogar cartas. Fico feliz com eles.",
      chunks: ["saio com os amigos", "fazemos um passeio", "mate gelado", "não sei cozinhar", "não posso", "jogar cartas"],
      keywords: ["sábado", "Ipanema", "Arpoador", "mate", "domingo", "avós", "farofa", "cartas"],
      gloss: {
        "mate gelado": "té de yerba mate frío, que se vende en la playa (no es el mate de calabaza)",
        "biscoito Globo": "rosquitas de almidón de mandioca, clásicas de la playa carioca",
        "farofa": "harina de mandioca tostada con manteca, para acompañar" } },

    { week: 7, level: "A1", title: "A agenda da semana",
      es: "La agenda de una semana: horarios, una reunión, un cumpleaños en la Lapa, el dentista y un viaje a Salvador.",
      text: "Na segunda-feira, às nove, tenho uma reunião no escritório. Na terça à tarde, às cinco e meia, vou à academia. Na quarta é o aniversário da Ana: ela faz vinte e sete anos e a festa começa às oito, num bar da Lapa. Na quinta de manhã, vou ao dentista às dez e quinze. Na sexta, almoço com o Rafa à uma. Sábado e domingo estou livre. No dia quinze de junho, viajo para Salvador.",
      chunks: ["às nove", "uma reunião", "cinco e meia", "o aniversário da Ana", "dez e quinze", "estou livre"],
      keywords: ["segunda-feira", "reunião", "academia", "aniversário", "Lapa", "dentista", "junho", "Salvador"],
      gloss: {
        "academia": "gimnasio (falso amigo)",
        "faz vinte e sete anos": "cumple veintisiete años (fazer anos = cumplir años)" } },

    { week: 8, level: "A1", title: "Um recado do calçadão",
      es: "Un mensaje desde Copacabana: qué está pasando ahora, qué planes hay para el fin de semana y unas preguntas al amigo que está lejos.",
      text: "Agora estou escrevendo do calçadão de Copacabana. Está fazendo um calor enorme e a praia está lotada. O que vou fazer no fim de semana? No sábado, vou ver o jogo do Flamengo no Maracanã com o meu primo. Depois, vamos comer num boteco perto do estádio. No domingo, vou descansar: por que não? E você, quando vai visitar o Rio? Onde você está morando agora? Estou esperando a sua resposta!",
      chunks: ["estou escrevendo", "está fazendo um calor", "a praia está lotada", "vou ver o jogo", "por que não", "estou esperando"],
      keywords: ["Copacabana", "calor", "praia", "Flamengo", "Maracanã", "primo", "boteco", "resposta"],
      gloss: {
        "calçadão": "la costanera peatonal de la playa",
        "lotada": "repleta, llena de gente",
        "o jogo do Flamengo": "el partido de Flamengo (jogo = partido)" } },

    { week: 9, level: "A2", title: "Como chegar a Santa Teresa",
      es: "Cómo moverse por Río: el metro, la escalera y el tranvía a Santa Teresa, el colectivo, el taxi y la bici en la costanera.",
      text: "Para ir de Botafogo a Santa Teresa, pego o metrô até a Carioca. Lá, subo a pé pela escadaria ou pego o bondinho, que passa pelos Arcos da Lapa. De ônibus é mais complicado: o trânsito é terrível e o ponto fica longe. Para ir ao aeroporto, prefiro ir de táxi ou de aplicativo. Aos domingos, a orla fica fechada para os carros e todo mundo anda de bicicleta.",
      chunks: ["pego o metrô", "subo a pé", "pelos Arcos da Lapa", "de ônibus", "o ponto fica longe", "anda de bicicleta"],
      keywords: ["metrô", "escadaria", "bondinho", "Arcos", "ônibus", "aeroporto", "orla", "bicicleta"],
      gloss: {
        "escadaria": "escalinata",
        "bondinho": "el tranvía de Santa Teresa",
        "o ponto": "la parada (del colectivo)",
        "de aplicativo": "en un auto de aplicación, tipo Uber",
        "a orla": "la costanera" } },

    { week: 10, level: "A2", title: "Esta é a minha família",
      es: "Una familia repartida entre Niterói, Buenos Aires y Petrópolis, con una foto vieja en la pared.",
      text: "Esta é a minha família. Os meus pais moram em Niterói, numa casa com quintal. O meu irmão mais velho é médico e a mulher dele é professora. Eles têm duas filhas: as minhas sobrinhas adoram a praia. A minha irmã mora em Buenos Aires com o namorado dela, que é argentino. A casa dos meus avós fica em Petrópolis, na serra. Aquela foto na parede é do casamento deles, em mil novecentos e setenta.",
      chunks: ["os meus pais", "a mulher dele", "as minhas sobrinhas", "o namorado dela", "na serra", "aquela foto"],
      keywords: ["família", "Niterói", "quintal", "irmão", "sobrinhas", "Buenos Aires", "Petrópolis", "casamento"],
      gloss: {
        "quintal": "patio, el fondo de la casa",
        "a mulher dele": "su esposa (mulher = mujer y también esposa)" } },

    { week: 11, level: "A2", title: "Um fim de semana em Paraty",
      es: "Un viaje de fin de semana a Paraty: el colectivo desde la Rodoviária, la moqueca, las calles de piedra y el barco.",
      text: "No sábado passado, fui a Paraty com a Sofía. Saímos do Rio cedo e pegamos um ônibus na Rodoviária. A viagem durou quatro horas. Chegamos na hora do almoço e comemos uma moqueca maravilhosa. À tarde, andamos pelas ruas de pedra do centro histórico e fizemos um passeio de barco. À noite, ouvimos música ao vivo num bar. Voltei no domingo muito cansado, mas feliz.",
      chunks: ["fui a Paraty", "pegamos um ônibus", "a viagem durou", "comemos uma moqueca", "fizemos um passeio de barco", "música ao vivo"],
      keywords: ["Paraty", "Rodoviária", "viagem", "moqueca", "ruas", "barco", "música", "domingo"],
      gloss: {
        "Rodoviária": "la terminal de ómnibus",
        "moqueca": "guiso de pescado con leche de coco y aceite de dendê" } },

    { week: 12, level: "A2", title: "Conselhos do médico",
      es: "Alguien que duerme mal consulta al médico, que le da consejos con el imperativo: dormir, tomar agua, caminar, apagar el celular.",
      text: "— Doutor, eu me deito tarde, me levanto cansado e tenho dor de cabeça todo dia. O que eu faço? — Olha, é simples. Durma pelo menos sete horas. Beba muita água, porque no Rio faz calor. Não tome tanto café depois das cinco. Caminhe um pouco no calçadão de manhã e passe protetor solar. E, por favor, desligue o celular antes de se deitar. — Obrigado, doutor. Vou tentar!",
      chunks: ["me levanto cansado", "dor de cabeça", "durma pelo menos", "beba muita água", "não tome tanto café", "desligue o celular"],
      keywords: ["doutor", "cansado", "cabeça", "horas", "água", "café", "protetor", "celular"],
      gloss: {
        "me deito": "me acuesto (deitar-se)",
        "Olha": "mirá (para empezar a explicar algo)",
        "desligue o celular": "apagá el celular (desligar = apagar un aparato)" } },

    // ------------------------------------------------ Estação 2: Pé na Estrada
    { week: 14, level: "A2", title: "Do que eu gosto",
      es: "Gustos y necesidades de un carioca: la feijoada del sábado, el açaí, la roda de samba y el sueño de la novia con el Nordeste.",
      text: "Eu gosto muito do Rio, mas não gosto do calor de fevereiro. Gosto de comer feijoada no sábado, com os amigos, e adoro açaí depois da praia. Preciso de pouco para ser feliz: uma roda de samba, um mate gelado e um bom papo. A minha namorada gosta mais de forró e sonha com uma viagem ao Nordeste. Eu acho que ela tem razão: o Brasil é enorme e a gente precisa conhecer mais.",
      chunks: ["não gosto do calor", "gosto de comer feijoada", "preciso de pouco", "uma roda de samba", "sonha com uma viagem", "acho que ela tem razão"],
      keywords: ["calor", "feijoada", "açaí", "samba", "papo", "forró", "Nordeste", "razão"],
      gloss: {
        "roda de samba": "ronda de samba: músicos alrededor de una mesa y la gente cantando",
        "mate gelado": "té de yerba mate frío (no es el mate de calabaza)",
        "um bom papo": "una buena charla",
        "forró": "música y baile del Nordeste" } },

    { week: 15, level: "A2", title: "As férias em Santa Teresa",
      es: "Recuerdos de infancia en la casa de la abuela en Santa Teresa: el jardín, el tranvía, el café con el abuelo y el día en que todo cambió.",
      text: "Quando eu era criança, passava as férias na casa da minha avó, em Santa Teresa. A casa era velha e tinha um jardim cheio de mangueiras. De manhã, eu descia de bonde até a Lapa com o meu avô, que comprava o jornal e tomava um cafezinho. À tarde, a gente brincava na rua até escurecer. Naquela época não havia celular, e ninguém tinha pressa. Um dia, o bonde parou de funcionar e tudo mudou.",
      chunks: ["quando eu era criança", "passava as férias", "cheio de mangueiras", "tomava um cafezinho", "a gente brincava", "até escurecer"],
      keywords: ["criança", "férias", "avó", "jardim", "bonde", "Lapa", "jornal", "rua"],
      gloss: {
        "mangueiras": "árboles de mango (no son mangueras)",
        "bonde": "tranvía",
        "brincava": "jugaba (brincar = jugar, de chicos; falso amigo)",
        "até escurecer": "hasta que oscurecía",
        "pressa": "apuro" } },

    { week: 16, level: "A2", title: "O presente da Bia",
      es: "Un regalo de cumpleaños en la Feira Hippie de Ipanema, con pronombres objeto: comprarla, conocerla, contarte.",
      text: "Amanhã é o aniversário da Bia e eu ainda não tenho o presente. Ontem vi uma bolsa linda na Feira Hippie de Ipanema, mas não a comprei: era cara. Hoje o vendedor me ligou e me ofereceu um desconto. Vou comprá-la e dar para ela no jantar. Você me ajuda a embrulhar? A Bia adora surpresas, e eu a conheço bem. Depois te conto o que ela achou.",
      chunks: ["não a comprei", "me ofereceu um desconto", "vou comprá-la", "você me ajuda", "eu a conheço bem", "te conto"],
      keywords: ["aniversário", "presente", "bolsa", "Feira Hippie", "vendedor", "desconto", "jantar", "surpresas"],
      gloss: {
        "bolsa": "cartera (de mujer)",
        "embrulhar": "envolver (un regalo)",
        "o que ela achou": "qué le pareció (achar = parecer, opinar)" } },

    { week: 17, level: "B1", title: "A previsão do tempo",
      es: "Un pronóstico del tiempo para Río con el futuro simple, y un plan: estudiar meteorología para entender por qué nadie acierta.",
      text: "Amanhã o tempo vai mudar no Rio. Segundo a previsão, choverá forte na Zona Sul e a temperatura cairá para vinte graus. No fim de semana, o sol voltará e a praia estará cheia outra vez. Eu, por precaução, levarei o guarda-chuva para o trabalho. No ano que vem, farei um curso de meteorologia: quero entender por que ninguém acerta a previsão. Direi isso ao meu chefe amanhã.",
      chunks: ["o tempo vai mudar", "choverá forte", "vinte graus", "estará cheia", "levarei o guarda-chuva", "farei um curso"],
      keywords: ["tempo", "previsão", "Zona Sul", "temperatura", "sol", "guarda-chuva", "meteorologia", "chefe"],
      gloss: {
        "guarda-chuva": "paraguas",
        "acerta a previsão": "acierta el pronóstico (previsão do tempo = pronóstico del tiempo)" } },

    { week: 18, level: "B1", title: "Uma mesa com vista para o mar",
      es: "Una reserva por teléfono en un restaurante, con las fórmulas de cortesía del condicional.",
      text: "— Boa noite! Eu gostaria de reservar uma mesa para quatro pessoas, para sábado. Seria possível uma mesa na varanda, com vista para o mar? — Claro. O senhor poderia chegar às oito? — Perfeito. Uma pergunta: vocês teriam opções vegetarianas? A minha irmã não come carne. — Temos, sim. Eu recomendaria a moqueca de banana-da-terra. — Ótimo. Eu queria também um bolo para o aniversário dela.",
      chunks: ["eu gostaria de reservar", "seria possível", "com vista para o mar", "poderia chegar", "teriam opções vegetarianas", "eu recomendaria"],
      keywords: ["mesa", "sábado", "varanda", "mar", "vegetarianas", "carne", "moqueca", "bolo"],
      gloss: {
        "Eu queria também": "también quería / quisiera (imperfecto de cortesía)",
        "banana-da-terra": "plátano macho, banana para cocinar",
        "Temos, sim": "sí, tenemos (en Brasil se responde repitiendo el verbo)" } },

    { week: 19, level: "B1", title: "Rio, São Paulo e Buenos Aires",
      es: "Comparaciones entre Río, San Pablo y Buenos Aires: tamaño, restaurantes, tránsito, café, carne y alquileres.",
      text: "O Rio é menor que São Paulo, mas é muito mais bonito, pelo menos para mim. São Paulo tem os melhores restaurantes do país, e o trânsito lá é ainda pior que aqui. Em Buenos Aires, o café é tão bom quanto no Rio, mas a carne é bem melhor. O aluguel em Ipanema é caríssimo: mais caro que em muitas cidades europeias. Mesmo assim, o pôr do sol no Arpoador é o mais bonito do mundo.",
      chunks: ["é menor que", "muito mais bonito", "os melhores restaurantes", "ainda pior que", "tão bom quanto", "é caríssimo"],
      keywords: ["São Paulo", "restaurantes", "trânsito", "Buenos Aires", "carne", "aluguel", "Ipanema", "Arpoador"],
      gloss: {
        "bem melhor": "mucho mejor (bem = muy, mucho)",
        "aluguel": "alquiler",
        "pôr do sol": "atardecer, puesta de sol" } },

    { week: 20, level: "B1", title: "A praia vazia",
      es: "Una mañana temprano en la playa de Leblon: nadie, ningún turista, todo lo necesario en la barraca y el agua helada.",
      text: "Ontem fui à praia bem cedo e não tinha ninguém no Leblon. Nenhum vendedor, nenhum turista: só eu e o mar. Comprei tudo o que precisava na barraca: água, mate e um sanduíche natural. Algumas pessoas chegaram mais tarde, mas ninguém entrou na água, que estava geladíssima. Eu também não entrei. Nem o salva-vidas parecia acordado. Não sei, não: acho que todo carioca tem medo de água fria.",
      chunks: ["não tinha ninguém", "nenhum turista", "comprei tudo", "algumas pessoas", "eu também não", "não sei, não"],
      keywords: ["praia", "Leblon", "vendedor", "turista", "barraca", "sanduíche", "salva-vidas", "carioca"],
      gloss: {
        "barraca": "puesto de playa (sombrillas, sillas, bebidas)",
        "sanduíche natural": "sándwich frío de pan integral con pollo o atún y verduras",
        "salva-vidas": "guardavidas",
        "Não sei, não": "qué sé yo, no sé (el «não» repetido al final es típico del habla)" } },

    { week: 21, level: "B1", title: "Umas semanas difíceis",
      es: "Semanas de mucho trabajo y poco sueño, con el perfeito composto (lo que viene pasando) y una vecina que ya había hecho una torta.",
      text: "Nas últimas semanas, tenho trabalhado muito e tenho dormido pouco. O meu chefe tem me pedido relatórios todo dia. Por isso, tenho ido menos à praia e tenho comido mal. Ontem, quando cheguei em casa, a minha vizinha já tinha preparado um bolo para mim: ela tinha percebido que eu andava cansado. Nunca tinha recebido um presente assim de alguém do prédio. Os cariocas têm fama de simpáticos, e com razão.",
      chunks: ["tenho trabalhado muito", "tenho dormido pouco", "tem me pedido", "tenho ido menos", "já tinha preparado", "nunca tinha recebido"],
      keywords: ["semanas", "chefe", "relatórios", "praia", "vizinha", "bolo", "prédio", "cariocas"],
      gloss: {
        "prédio": "edificio (de departamentos)",
        "andava cansado": "venía cansado, estaba cansado esos días" } },

    { week: 22, level: "B1", title: "O Cristo Redentor",
      es: "La historia del Cristo Redentor en voz pasiva: quién lo proyectó, quién esculpió el rostro, cuándo se inauguró.",
      text: "O Cristo Redentor foi inaugurado em mil novecentos e trinta e um, no alto do Corcovado. O monumento foi projetado pelo engenheiro Heitor da Silva Costa, e o rosto foi esculpido pelo romeno Gheorghe Leonida. Em dois mil e sete, a estátua foi eleita uma das sete novas maravilhas do mundo. Hoje ela é visitada por milhões de turistas. Os ingressos já estão pagos? Então vamos subir de trem!",
      chunks: ["foi inaugurado", "no alto do Corcovado", "foi projetado", "foi esculpido", "foi eleita", "já estão pagos"],
      keywords: ["Cristo", "Corcovado", "engenheiro", "rosto", "estátua", "maravilhas", "turistas", "trem"],
      gloss: {
        "foi eleita": "fue elegida (eleito: participio corto de eleger)",
        "Os ingressos": "las entradas" } },

    { week: 23, level: "B1", title: "Conselhos para a Sofía",
      es: "Una carta de bienvenida a una amiga que se muda a Río, con deseos y consejos en subjuntivo.",
      text: "Querida Sofía, espero que você esteja bem e que a mudança para o Rio seja tranquila. Aqui vão alguns conselhos: é importante que você use protetor solar todo dia e que beba muita água. Talvez você estranhe o calor no começo. Quero que você conheça os meus amigos da Tijuca; tomara que vocês se deem bem. E não deixe de ir a uma roda de samba na Pedra do Sal. Acho que você vai adorar a cidade. Beijos, Bia.",
      chunks: ["espero que você esteja bem", "é importante que", "talvez você estranhe", "quero que você conheça", "tomara que", "vai adorar a cidade"],
      keywords: ["Sofía", "mudança", "conselhos", "protetor", "calor", "Tijuca", "Pedra do Sal", "Bia"],
      gloss: {
        "Talvez você estranhe o calor": "capaz que te cueste acostumbrarte al calor (estranhar = notar raro, no «echar de menos»)",
        "tomara que": "ojalá que",
        "se deem bem": "se lleven bien",
        "não deixe de ir": "no dejes de ir" } },

    { week: 24, level: "B1", title: "A trilha da Pedra Bonita",
      es: "El plan para subir a la Pedra Bonita a ver el amanecer, con las conjunciones que piden subjuntivo.",
      text: "Vamos fazer a trilha da Pedra Bonita no sábado, a menos que chova. Caso o tempo esteja ruim, a gente vai ao Museu do Amanhã. Precisamos sair cedo para que possamos ver o nascer do sol lá de cima. Embora a trilha seja curta, é bem íngreme: levem água e tênis bons. Ninguém sai antes que todos estejam prontos. E não se esqueçam do protetor solar, mesmo que o dia esteja nublado.",
      chunks: ["a menos que chova", "caso o tempo esteja ruim", "para que possamos ver", "embora a trilha seja curta", "antes que todos estejam prontos", "não se esqueçam"],
      keywords: ["trilha", "Pedra Bonita", "Museu do Amanhã", "nascer do sol", "íngreme", "tênis", "protetor", "nublado"],
      gloss: {
        "trilha": "sendero, caminata por el monte",
        "lá de cima": "desde allá arriba",
        "íngreme": "empinada",
        "tênis": "zapatillas" } },

    { week: 25, level: "B1", title: "Zumbi dos Palmares",
      es: "Zumbi y el Quilombo dos Palmares, la comunidad de esclavizados fugitivos que resistió casi un siglo, contados con pronombres relativos.",
      text: "Zumbi foi o último grande líder do Quilombo dos Palmares, uma comunidade de pessoas escravizadas que fugiam dos engenhos de açúcar. Palmares, cuja população chegou a milhares de pessoas, ficava na Serra da Barriga, onde hoje é o estado de Alagoas. O quilombo resistiu durante quase um século aos ataques dos colonizadores. Zumbi, de quem os livros de história tanto falam, foi morto em vinte de novembro de mil seiscentos e noventa e cinco. Por isso esse dia, em que o Brasil celebra a Consciência Negra, é feriado nacional.",
      chunks: ["o último grande líder", "que fugiam", "cuja população", "onde hoje é", "de quem os livros", "em que o Brasil celebra"],
      keywords: ["Zumbi", "Palmares", "quilombo", "engenhos", "Serra da Barriga", "Alagoas", "novembro", "Consciência Negra"],
      gloss: {
        "engenhos de açúcar": "ingenios azucareros (las plantaciones de caña con su molino)",
        "fugiam": "huían",
        "quilombo": "comunidad de esclavizados fugitivos (no es «quilombo» = lío, como en el Río de la Plata)" } },

    // ------------------------------------------------ Estação 3: Mar Aberto
    { week: 27, level: "B1", title: "A corte no Rio",
      es: "Una visita guiada por el centro de Río tras las huellas de la corte portuguesa, que llegó en 1808 huyendo de Napoleón.",
      text: "Quando vocês chegarem à Praça Quinze, verão o Paço Imperial. Foi ali que Dom João se instalou em mil oitocentos e oito, quando a corte portuguesa fugiu das tropas de Napoleão e atravessou o Atlântico. Se vocês quiserem, depois podemos visitar o Jardim Botânico, que ele fundou naquele mesmo ano. Assim que terminarmos, vamos à Biblioteca Nacional, cujo acervo nasceu com os livros trazidos de Lisboa. Enquanto estiverem aqui, lembrem-se: o Rio foi a única cidade fora da Europa a ser capital de um império europeu.",
      chunks: ["quando vocês chegarem", "a corte portuguesa", "se vocês quiserem", "naquele mesmo ano", "assim que terminarmos", "enquanto estiverem aqui"],
      keywords: ["Praça Quinze", "Paço Imperial", "Dom João", "Napoleão", "Jardim Botânico", "Biblioteca Nacional", "Lisboa", "império"],
      gloss: {
        "Paço Imperial": "el Palacio Imperial (paço = palacio real)",
        "Assim que terminarmos": "en cuanto terminemos",
        "acervo": "la colección, el fondo de la biblioteca",
        "lembrem-se": "acuérdense (pronombre después del verbo: colocación pronominal, se ve en la semana 33)" } },

    { week: 28, level: "B2", title: "O rei que não voltou",
      es: "El sebastianismo: el rey Sebastián desaparece en Alcazarquivir (1578), Portugal pierde la independencia y nace la espera de su regreso, que llega hasta Pessoa y Canudos.",
      text: "Em mil quinhentos e setenta e oito, o jovem rei Dom Sebastião desapareceu na batalha de Alcácer-Quibir, no Marrocos. Como não tinha filhos, Portugal acabou sob o domínio da Espanha em mil quinhentos e oitenta. Muitos portugueses não aceitaram a sua morte: diziam que, se o rei voltasse numa manhã de nevoeiro, o país recuperaria a sua glória. Se esse mito não existisse, a literatura portuguesa seria mais pobre: Fernando Pessoa o transformou em poesia. No sertão brasileiro, a mesma espera reapareceu em Canudos. E você, se pudesse esperar alguém, quem seria?",
      chunks: ["desapareceu na batalha", "não tinha filhos", "se o rei voltasse", "numa manhã de nevoeiro", "se esse mito não existisse", "se pudesse esperar"],
      keywords: ["Dom Sebastião", "Alcácer-Quibir", "Marrocos", "Espanha", "nevoeiro", "mito", "Pessoa", "Canudos"],
      gloss: {
        "acabou sob o domínio da Espanha": "terminó bajo el dominio de España",
        "nevoeiro": "niebla",
        "sertão": "el interior seco y pobre del Nordeste" } },

    { week: 29, level: "B2", title: "Paulo Freire em Angicos",
      es: "La experiencia de alfabetización de Paulo Freire en Angicos (1963), el exilio tras el golpe de 1964 y su idea de «leer el mundo», con el infinitivo personal.",
      text: "Em mil novecentos e sessenta e três, na cidade de Angicos, no Rio Grande do Norte, Paulo Freire ajudou cerca de trezentos trabalhadores a lerem e escreverem em poucas semanas. O método partia de palavras da vida deles, como tijolo, para os alunos discutirem a própria realidade. Para Freire, não bastava os oprimidos aprenderem as letras: precisavam ler o mundo. Depois do golpe de sessenta e quatro, foi preso e partiu para o exílio. É importante nós lembrarmos a frase que ele escreveu: a leitura do mundo precede a leitura da palavra.",
      chunks: ["a lerem e escreverem", "para os alunos discutirem", "os oprimidos aprenderem", "partiu para o exílio", "é importante nós lembrarmos", "a leitura do mundo"],
      keywords: ["Angicos", "Paulo Freire", "trabalhadores", "tijolo", "oprimidos", "golpe", "exílio", "leitura"],
      gloss: {
        "tijolo": "ladrillo",
        "não bastava": "no alcanzaba, no era suficiente",
        "golpe de sessenta e quatro": "el golpe militar de 1964" } },

    { week: 30, level: "B2", title: "E se Dom Pedro tivesse voltado?",
      es: "La Independencia de Brasil (1822) contada con hipótesis sobre el pasado: el Día del Fico, el Ipiranga y lo que pudo haber sido.",
      text: "Em janeiro de mil oitocentos e vinte e dois, as Cortes de Lisboa exigiram que o príncipe Dom Pedro voltasse a Portugal. Ele ficou: foi o Dia do Fico. Se tivesse obedecido, talvez o Brasil tivesse se dividido em vários países, como aconteceu com a América espanhola. Em setembro, às margens do Ipiranga, ele declarou a independência. Muitos historiadores lembram que, se a elite não tivesse temido uma revolução, a ruptura teria sido mais radical. E a escravidão teria acabado antes? Não sabemos.",
      chunks: ["foi o Dia do Fico", "se tivesse obedecido", "tivesse se dividido", "às margens do Ipiranga", "não tivesse temido", "teria sido mais radical"],
      keywords: ["Cortes", "Lisboa", "Dom Pedro", "Fico", "América espanhola", "Ipiranga", "independência", "escravidão"],
      gloss: {
        "Dia do Fico": "el «Día del Me Quedo» (fico = me quedo)",
        "às margens do Ipiranga": "a orillas del arroyo Ipiranga, en São Paulo" } },

    { week: 31, level: "B2", title: "Quarto de Despejo",
      es: "Cómo el periodista Audálio Dantas conoció a Carolina Maria de Jesus en la favela del Canindé y sus diarios se volvieron un libro, en discurso indirecto.",
      text: "Em mil novecentos e cinquenta e oito, o jornalista Audálio Dantas foi à favela do Canindé, em São Paulo, e conheceu Carolina Maria de Jesus. Ela disse que escrevia tudo o que via em cadernos achados no lixo e perguntou se ele queria lê-los. Audálio contou depois que tinha ficado impressionado. Em mil novecentos e sessenta, os diários viraram o livro Quarto de Despejo. Carolina escreveu que a favela era o quarto de despejo da cidade. O livro foi traduzido para muitas línguas.",
      chunks: ["ela disse que escrevia", "cadernos achados no lixo", "perguntou se ele queria", "tinha ficado impressionado", "Quarto de Despejo", "a favela era"],
      keywords: ["Audálio Dantas", "Canindé", "Carolina Maria de Jesus", "cadernos", "lixo", "diários", "favela", "línguas"],
      gloss: {
        "achados no lixo": "encontrados en la basura",
        "viraram": "se convirtieron en (virar = convertirse)",
        "quarto de despejo": "cuarto de los trastos, el depósito donde se tira lo que no sirve" } },

    { week: 32, level: "B2", title: "Os ciclos da colônia",
      es: "La economía colonial de Brasil en pasiva con se: el palo brasil, el azúcar, la esclavitud y el oro de Minas.",
      text: "Durante o período colonial, a economia do Brasil passou por vários ciclos. Primeiro, extraía-se o pau-brasil, de que se fazia uma tinta vermelha muito valiosa na Europa. Depois, plantou-se cana-de-açúcar no Nordeste e, para isso, trouxeram-se milhões de africanos escravizados. No fim do século dezessete, descobriu-se ouro em Minas Gerais, e fundaram-se cidades como Vila Rica, hoje Ouro Preto. Diz-se que o Brasil se formou em torno desses ciclos; hoje, porém, fala-se cada vez mais de quem os sustentou.",
      chunks: ["extraía-se o pau-brasil", "uma tinta vermelha", "plantou-se cana-de-açúcar", "descobriu-se ouro", "fundaram-se cidades", "diz-se que"],
      keywords: ["colonial", "ciclos", "pau-brasil", "cana-de-açúcar", "africanos", "ouro", "Minas Gerais", "Ouro Preto"],
      gloss: {
        "pau-brasil": "palo brasil, el árbol de madera roja que le dio nombre al país",
        "tinta vermelha": "tintura roja (tinta = tintura, pintura)",
        "em torno desses ciclos": "alrededor de esos ciclos" } },

    { week: 33, level: "B2", title: "O Imperador da língua",
      es: "El padre Antônio Vieira, jesuita y predicador entre Lisboa, Bahía y Maranhão, contado en registro formal con pronombres enclíticos.",
      text: "O padre Antônio Vieira nasceu em Lisboa em mil seiscentos e oito e mudou-se ainda menino para a Bahia. Tornou-se jesuíta e, mais tarde, um dos maiores oradores da língua. No Sermão de Santo Antônio aos Peixes, pregado no Maranhão, dirigiu-se aos peixes para criticar os colonos. Defendeu os indígenas contra a escravização, o que lhe custou inimigos poderosos; não se opôs, contudo, à escravidão dos africanos. Fernando Pessoa chamou-lhe Imperador da língua portuguesa.",
      chunks: ["mudou-se ainda menino", "tornou-se jesuíta", "dirigiu-se aos peixes", "o que lhe custou", "não se opôs", "chamou-lhe"],
      keywords: ["Antônio Vieira", "Lisboa", "Bahia", "jesuíta", "sermão", "Maranhão", "indígenas", "Pessoa"],
      gloss: {
        "pregado": "predicado (pregar um sermão = predicar; no es «clavar»)",
        "o que lhe custou inimigos poderosos": "lo que le valió enemigos poderosos",
        "contudo": "sin embargo (conectores: se ven en la semana 34)",
        "chamou-lhe": "lo llamó (chamar-lhe: uso de Portugal)" } },

    { week: 34, level: "B2", title: "Casa-Grande & Senzala e os seus críticos",
      es: "El debate sobre la «democracia racial»: Gilberto Freyre, la crítica de Florestan Fernandes y la amefricanidad de Lélia Gonzalez, hilados con conectores.",
      text: "Em Casa-Grande & Senzala, de mil novecentos e trinta e três, Gilberto Freyre valorizou a contribuição africana e indígena na formação do Brasil. No entanto, a sua imagem de uma colonização relativamente harmoniosa foi muito criticada. Florestan Fernandes, por exemplo, mostrou que, depois da Abolição, os negros foram deixados à margem; a chamada democracia racial era, portanto, um mito. Aliás, Lélia Gonzalez foi além: criou o conceito de amefricanidade e falou em pretuguês. Ou seja, o debate continua vivo.",
      chunks: ["no entanto", "foi muito criticada", "por exemplo", "foram deixados à margem", "aliás", "ou seja"],
      keywords: ["Gilberto Freyre", "colonização", "Florestan Fernandes", "Abolição", "democracia racial", "mito", "Lélia Gonzalez", "amefricanidade"],
      gloss: {
        "Casa-Grande & Senzala": "la casa del amo y la senzala, el barracón de los esclavizados",
        "à margem": "al margen, afuera (à: crase, se ve en la semana 36)",
        "pretuguês": "juego con preto (negro) + português: el portugués hecho por la herencia africana" } },

    { week: 35, level: "B2", title: "O homem cordial",
      es: "Qué quiso decir Sérgio Buarque de Holanda con el «hombre cordial» de Raízes do Brasil (1936), con verbos y su preposición.",
      text: "Em Raízes do Brasil, de mil novecentos e trinta e seis, Sérgio Buarque de Holanda se refere ao brasileiro como homem cordial. Muita gente confunde a palavra com educado, mas o autor pensava em cor, coração em latim: o cordial age pela emoção e prefere a intimidade às regras impessoais. Quem assiste a uma reunião de trabalho no Brasil logo percebe: todos aspiram a ser amigos antes de ser colegas. Aliás, o historiador é o pai de Chico Buarque, de quem os cariocas tanto gostam.",
      chunks: ["se refere ao brasileiro", "confunde a palavra com", "prefere a intimidade às regras", "assiste a uma reunião", "aspiram a ser amigos", "de quem os cariocas"],
      keywords: ["Raízes do Brasil", "Sérgio Buarque", "cordial", "coração", "latim", "emoção", "intimidade", "Chico Buarque"],
      gloss: {
        "homem cordial": "hombre cordial: acá, el que actúa por el corazón, no el educado",
        "às regras impessoais": "a las reglas impersonales (às = a + as: crase, se ve en la semana 36)" } },

    { week: 36, level: "B2", title: "A Pequena África",
      es: "El nacimiento del samba en la Pequeña África carioca, la casa de Tia Ciata y «Pelo Telefone», con la crase en todos lados.",
      text: "No início do século vinte, a chamada Pequena África, perto da zona portuária, reunia muitos migrantes baianos. À noite, as rodas aconteciam na casa da Tia Ciata, na Praça Onze, às vezes até de manhã. Foi ali que nasceu Pelo Telefone, registrado por Donga em mil novecentos e dezesseis e considerado o primeiro samba gravado. Hoje, quem vai à Pedra do Sal às segundas-feiras ainda ouve samba à moda antiga. Devemos à Tia Ciata boa parte dessa história.",
      chunks: ["à noite", "na casa da Tia Ciata", "às vezes", "vai à Pedra do Sal", "à moda antiga", "devemos à Tia Ciata"],
      keywords: ["Pequena África", "zona portuária", "baianos", "Tia Ciata", "Praça Onze", "Donga", "samba", "Pedra do Sal"],
      gloss: {
        "zona portuária": "la zona del puerto",
        "Tia Ciata": "«tía» Ciata: tia es el trato de respeto a las mujeres mayores de la comunidad bahiana",
        "as rodas": "las rondas de samba" } },

    { week: 37, level: "B2", title: "Canudos",
      es: "La guerra de Canudos (1896-1897) y «Os Sertões» de Euclides da Cunha, con los derivados de ter, vir y pôr.",
      text: "Em mil oitocentos e noventa e seis, o governo republicano interveio no arraial de Canudos, no sertão da Bahia, onde Antônio Conselheiro mantinha milhares de seguidores. As três primeiras expedições militares não obtiveram sucesso. A quarta, em mil oitocentos e noventa e sete, destruiu o arraial. Euclides da Cunha, que a acompanhou como jornalista, compôs depois Os Sertões, onde escreveu que o sertanejo é, antes de tudo, um forte. Ninguém tinha previsto tamanha resistência. Vale a pena ler o livro, embora ele não caiba num fim de semana.",
      chunks: ["interveio no arraial", "mantinha milhares de seguidores", "não obtiveram sucesso", "compôs depois", "antes de tudo, um forte", "tinha previsto"],
      keywords: ["Canudos", "sertão", "Antônio Conselheiro", "expedições", "Euclides da Cunha", "Os Sertões", "sertanejo", "resistência"],
      gloss: {
        "arraial": "caserío, poblado",
        "sertanejo": "el habitante del sertão, el interior seco del Nordeste",
        "antes de tudo": "ante todo",
        "tamanha resistência": "una resistencia tan grande",
        "não caiba num fim de semana": "no entre en un fin de semana: no se lee en un fin de semana" } },

    { week: 38, level: "B2", title: "Cê sabe com quem tá falando?",
      es: "Dos amigos en el boteco comentan una escena del edificio que parece sacada de Roberto DaMatta, en portugués hablado.",
      text: "— Cê viu o que rolou ontem no prédio? — Não, o que que foi? — Um cara parou o carro na vaga do vizinho e, quando o porteiro reclamou, ele soltou: cê sabe com quem tá falando? — Nossa! Isso é bem aquilo que o DaMatta explicava, né? — Tipo, o cara acha que é mais que os outros. — Pois é. Sei lá, eu acho isso muito feio. — Tô contigo. Bora pedir mais um chope?",
      chunks: ["o que rolou", "o que que foi", "cê sabe com quem tá falando", "pois é", "sei lá", "tô contigo"],
      keywords: ["prédio", "carro", "vaga", "vizinho", "porteiro", "DaMatta", "chope"],
      gloss: {
        "o que rolou": "lo que pasó (rolar = pasar, suceder, en el habla)",
        "o que que foi": "¿qué pasó? (o que que: pregunta del habla)",
        "Um cara": "un tipo, un flaco",
        "soltou": "largó, dijo de golpe",
        "cê sabe com quem tá falando?": "¿vos sabés con quién estás hablando?: la frase del que se cree más que los demás",
        "Tô contigo": "estoy con vos, coincido" } },

    // ------------------------------------------------ Estação 4: O Cume
    { week: 40, level: "B2", title: "A Constituição Cidadã",
      es: "La Constitución de 1988 y las Diretas Já en estilo de informe: nominalizaciones y haber existencial.",
      text: "A promulgação da Constituição de mil novecentos e oitenta e oito representou o encerramento formal da transição democrática no Brasil. Chamada de Constituição Cidadã por Ulysses Guimarães, a nova carta assegurou a ampliação dos direitos sociais, a universalização do acesso à saúde, com a criação do SUS, e o restabelecimento das eleições diretas para presidente. Tal conquista foi precedida pela campanha das Diretas Já, cuja mobilização reuniu milhões de pessoas em mil novecentos e oitenta e quatro. Há, contudo, quem aponte a distância entre o texto e a sua efetiva aplicação.",
      chunks: ["a promulgação da Constituição", "o encerramento formal", "a ampliação dos direitos sociais", "a criação do SUS", "cuja mobilização reuniu", "a sua efetiva aplicação"],
      keywords: ["promulgação", "Constituição", "transição", "Ulysses Guimarães", "direitos", "SUS", "Diretas Já", "aplicação"],
      gloss: {
        "encerramento": "cierre, fin",
        "SUS": "Sistema Único de Saúde: la salud pública gratuita de Brasil",
        "Diretas Já": "«Directas ya»: la campaña por la elección directa del presidente",
        "Há, contudo, quem aponte": "hay, sin embargo, quien señale" } },

    { week: 41, level: "C1", title: "O defunto autor",
      es: "Machado de Assis: Brás Cubas, el «difunto autor», y la duda eterna de Dom Casmurro, con el pluscuamperfecto simple.",
      text: "Quando Brás Cubas começou a escrever as suas memórias, já morrera: é um defunto autor, e não um autor defunto, como ele mesmo explica. Machado de Assis publicara antes romances mais convencionais, mas em mil oitocentos e oitenta e um surpreendeu os leitores. Anos depois, em Dom Casmurro, Bento Santiago tenta provar que Capitu o traíra, e o leitor nunca sabe se ela de fato o fizera. José Dias dissera que ela tinha olhos de cigana oblíqua e dissimulada. Quem me dera escrever assim!",
      chunks: ["já morrera", "um defunto autor", "publicara antes", "Capitu o traíra", "de fato o fizera", "quem me dera"],
      keywords: ["Brás Cubas", "memórias", "Machado de Assis", "romances", "Dom Casmurro", "Capitu", "José Dias", "cigana"],
      gloss: {
        "é um defunto autor, e não um autor defunto": "es un muerto que escribe, no un escritor que ya murió",
        "o traíra": "lo había traicionado",
        "de fato": "de hecho, realmente",
        "olhos de cigana oblíqua e dissimulada": "ojos de gitana, de mirada esquiva y disimulada" } },

    { week: 42, level: "C1", title: "Clarice",
      es: "La vida de Clarice Lispector, de Ucrania a Río, condensada con gerundios, participios e infinitivos.",
      text: "Nascida na Ucrânia em mil novecentos e vinte, Clarice Lispector chegou ao Brasil ainda bebê. Tendo crescido em Maceió e no Recife, mudou-se com a família para o Rio na adolescência. Publicado em mil novecentos e quarenta e três, Perto do Coração Selvagem surpreendeu a crítica. Anos depois, escrevendo crônicas para o Jornal do Brasil, conquistou leitores fiéis. Ao terminar A Hora da Estrela, pouco antes de morrer, deu vida a Macabéa, uma nordestina perdida no Rio. Passando pelo Leme, procure a sua estátua no calçadão.",
      chunks: ["nascida na Ucrânia", "tendo crescido em Maceió", "publicado em", "escrevendo crônicas", "ao terminar", "passando pelo Leme"],
      keywords: ["Ucrânia", "Clarice Lispector", "Maceió", "Recife", "crônicas", "Jornal do Brasil", "Macabéa", "Leme"],
      gloss: {
        "nordestina": "del Nordeste de Brasil",
        "Passando pelo Leme": "si pasás por el Leme (el barrio en la punta de Copacabana)" } },

    { week: 43, level: "C1", title: "Pedido à Torre do Tombo",
      es: "Una investigadora de la UFRJ pide por carta formal consultar el original de la Carta de Pero Vaz de Caminha (1500) en el archivo de Lisboa.",
      text: "Prezados Senhores, venho por meio desta solicitar autorização para consultar, na sala de leitura do Arquivo Nacional da Torre do Tombo, a Carta de Pero Vaz de Caminha, de mil e quinhentos. Sou pesquisadora da Universidade Federal do Rio de Janeiro e estudo as primeiras descrições da terra e dos povos indígenas. Segue em anexo o meu projeto de pesquisa. Caso não seja possível o acesso ao original, agradeceria se me indicassem a versão digitalizada. Fico no aguardo de um retorno. Atenciosamente, Ana Beatriz Costa.",
      chunks: ["venho por meio desta", "solicitar autorização", "segue em anexo", "agradeceria se", "fico no aguardo", "atenciosamente"],
      keywords: ["Torre do Tombo", "Pero Vaz de Caminha", "pesquisadora", "Universidade Federal", "indígenas", "projeto", "original", "digitalizada"],
      gloss: {
        "Torre do Tombo": "el Archivo Nacional de Portugal, en Lisboa",
        "Carta de Pero Vaz de Caminha": "la carta del escribano de la flota de Cabral al rey, primer texto sobre Brasil" } },

    { week: 44, level: "C1", title: "Tupi or not tupi",
      es: "El modernismo de 1922, el Manifiesto Antropófago de Oswald de Andrade y el Abaporu de Tarsila, con palabras formadas por derivación.",
      text: "Na Semana de Arte Moderna de mil novecentos e vinte e dois, em São Paulo, os modernistas queriam uma arte nacional. Seis anos depois, Oswald de Andrade lançou o Manifesto Antropófago, com a frase tupi or not tupi, that is the question. A ideia era devorar a cultura estrangeira e transformá-la: uma deglutição criativa. O quadro Abaporu, de Tarsila do Amaral, cujo nome em tupi significa homem que come gente, virou o símbolo do movimento. Da antropofagia nasceram releituras e, décadas depois, o tropicalismo.",
      chunks: ["arte moderna", "manifesto antropófago", "devorar a cultura estrangeira", "uma deglutição criativa", "homem que come gente", "o tropicalismo"],
      keywords: ["Semana de Arte Moderna", "modernistas", "Oswald de Andrade", "antropofagia", "Abaporu", "Tarsila do Amaral", "tupi", "tropicalismo"],
      gloss: {
        "tupi or not tupi": "juego con el «to be or not to be» de Hamlet: tupi es el pueblo indígena de la costa",
        "deglutição": "deglución, el acto de tragar",
        "releituras": "relecturas, reinterpretaciones" } },

    { week: 45, level: "C1", title: "Vexames de recém-chegado",
      es: "Los papelones de un argentino recién llegado a Río por culpa de los falsos amigos: esquisito, borracha, apelido, oficina.",
      text: "Quando cheguei ao Rio, passei vários vexames por causa dos falsos amigos. Num restaurante de Botafogo, disse que a comida estava esquisita, querendo elogiá-la, e o garçom ficou ofendido. Numa festa, contei que a minha amiga estava borracha, e todo mundo riu: borracha é a de apagar. Um colega me perguntou o meu apelido, e eu respondi com o sobrenome. No primeiro dia de trabalho, procurei a oficina e me mandaram para uma garagem. Hoje dou risada: errando é que se aprende.",
      chunks: ["por causa dos falsos amigos", "a comida estava esquisita", "o garçom ficou ofendido", "a de apagar", "me perguntou o meu apelido", "errando é que se aprende"],
      keywords: ["vexames", "falsos amigos", "esquisita", "garçom", "borracha", "apelido", "sobrenome", "oficina"],
      gloss: {
        "vexames": "papelones, momentos de vergüenza",
        "dou risada": "me río (dar risada = reírse)",
        "errando é que se aprende": "equivocándose es como se aprende (é que: realza lo anterior)" } },

    { week: 46, level: "C1", title: "Uma língua, muitos sotaques",
      es: "El portugués de Brasil, Portugal, Angola, Mozambique y Cabo Verde: palabras distintas, acentos y el escritor Mia Couto.",
      text: "O português é falado por mais de duzentos e cinquenta milhões de pessoas, em países como Brasil, Portugal, Angola, Moçambique e Cabo Verde. Em Lisboa, apanha-se o comboio, e não o trem; toma-se o pequeno-almoço, e não o café da manhã. Em Luanda, ouvem-se palavras de origem quimbundo, e em Cabo Verde fala-se também o crioulo. O moçambicano Mia Couto, prêmio Camões em dois mil e treze, inventa palavras com uma liberdade que lembra Guimarães Rosa. Uma língua, muitos sotaques.",
      chunks: ["mais de duzentos e cinquenta milhões", "apanha-se o comboio", "toma-se o pequeno-almoço", "de origem quimbundo", "prêmio Camões", "muitos sotaques"],
      keywords: ["Portugal", "Angola", "Moçambique", "Cabo Verde", "comboio", "Luanda", "crioulo", "Mia Couto"],
      gloss: {
        "sotaques": "acentos, tonadas (sotaque = acento al hablar)",
        "quimbundo": "lengua bantú de Luanda y su región",
        "crioulo": "el criollo de Cabo Verde, lengua de base portuguesa" } },

    { week: 47, level: "C1", title: "A saudade é intraduzível?",
      es: "Un texto argumentativo sobre el mito de la saudade intraducible, del rey Duarte (siglo XV) a Eduardo Lourenço.",
      text: "Diz-se com frequência que saudade é uma palavra intraduzível. Em primeiro lugar, convém relativizar: é possível que outras línguas conheçam sentimentos parecidos, ainda que sem uma palavra única. Além disso, a saudade tem história: já no século quinze o rei Dom Duarte a discutia no Leal Conselheiro. Por outro lado, Eduardo Lourenço, em O Labirinto da Saudade, sugere que ela diz muito sobre a relação dos portugueses com o próprio passado. Em suma, por mais que a palavra seja nossa, o sentimento é de todos.",
      chunks: ["em primeiro lugar", "é possível que", "ainda que", "por outro lado", "em suma", "por mais que a palavra seja"],
      keywords: ["saudade", "intraduzível", "sentimentos", "Dom Duarte", "Leal Conselheiro", "Eduardo Lourenço", "Labirinto", "passado"],
      gloss: {
        "saudade": "nostalgia, añoranza de algo o alguien que no está",
        "Leal Conselheiro": "«El leal consejero», tratado moral escrito por el rey Dom Duarte" } },

    { week: 48, level: "C1", title: "Lisboa, 1755",
      es: "El resumen de un texto sobre el terremoto de Lisboa de 1755: la reconstrucción de Pombal, el debate de Voltaire y una frase de atribución dudosa.",
      text: "Segundo os historiadores, o terremoto de primeiro de novembro de mil setecentos e cinquenta e cinco destruiu grande parte de Lisboa e foi seguido de um maremoto e de incêndios. O autor do texto ressalta que a reconstrução, dirigida pelo futuro Marquês de Pombal, deu origem à Baixa pombalina, com ruas retas e prédios mais resistentes. Além disso, afirma que a tragédia abalou o otimismo europeu, como mostra o Cândido, de Voltaire. Ou seja, um desastre natural virou um debate filosófico. A frase enterrar os mortos e cuidar dos vivos, atribuída a Pombal, tem autoria duvidosa.",
      chunks: ["segundo os historiadores", "o autor do texto ressalta", "a Baixa pombalina", "além disso, afirma", "ou seja", "atribuída a Pombal"],
      keywords: ["terremoto", "Lisboa", "maremoto", "reconstrução", "Marquês de Pombal", "Baixa", "otimismo", "Voltaire"],
      gloss: {
        "ressalta": "destaca",
        "Baixa pombalina": "el centro bajo de Lisboa, reconstruido con el plan del Marqués de Pombal",
        "abalou": "sacudió, hizo tambalear" } },

    { week: 49, level: "C1", title: "O 25 de Abril em dois registros",
      es: "La Revolución de los Claveles (1974) contada en registro formal y después, en clase, en registro coloquial.",
      text: "Na madrugada de vinte e cinco de abril de mil novecentos e setenta e quatro, a transmissão da canção Grândola, Vila Morena, de Zeca Afonso, serviu de senha para o levante militar que pôs fim ao Estado Novo, regime instaurado por Salazar. A população saiu às ruas, e Celeste Caeiro, funcionária de um restaurante, distribuiu cravos aos soldados. Na aula, o meu professor resumiu de um jeito mais solto: aí tocou a música no rádio, o povo foi pra rua, botaram cravo nos fuzis e a ditadura caiu. É a mesma história, em outro registro.",
      chunks: ["na madrugada de", "serviu de senha", "pôs fim ao Estado Novo", "saiu às ruas", "o povo foi pra rua", "botaram cravo nos fuzis"],
      keywords: ["madrugada", "Grândola", "Zeca Afonso", "Estado Novo", "Salazar", "cravos", "soldados", "ditadura"],
      gloss: {
        "senha": "contraseña, señal convenida",
        "levante militar": "levantamiento militar",
        "cravos": "claveles",
        "de um jeito mais solto": "de una manera más suelta, informal",
        "botaram": "pusieron (botar = poner, coloquial)" } },

    { week: 50, level: "C1", title: "Pessoa e os outros",
      es: "Fernando Pessoa y sus heterónimos, contados con colocaciones y expresiones fijas; y una frase famosa que no es suya.",
      text: "Fernando Pessoa levava uma vida discreta: trabalhava como correspondente comercial em Lisboa e, nas horas vagas, dava voz a vários poetas dentro de si. Alberto Caeiro, Ricardo Reis e Álvaro de Campos não são pseudônimos, mas heterônimos, com biografia e estilo próprios. Pessoa fazia questão de dizer que o poeta é um fingidor. Já a famosa frase navegar é preciso, viver não é preciso não é dele: ele mesmo a atribuía aos navegadores antigos. Em vida, poucos o levaram a sério; só depois da sua morte, em mil novecentos e trinta e cinco, o mundo se deu conta do tamanho da obra.",
      chunks: ["nas horas vagas", "dava voz a", "fazia questão de dizer", "o poeta é um fingidor", "o levaram a sério", "se deu conta"],
      keywords: ["Pessoa", "Lisboa", "Alberto Caeiro", "Ricardo Reis", "Álvaro de Campos", "heterônimos", "fingidor", "navegadores"],
      gloss: {
        "correspondente comercial": "el que redacta y traduce las cartas comerciales de una empresa",
        "nas horas vagas": "en los ratos libres",
        "navegar é preciso, viver não é preciso": "navegar es necesario, vivir no es necesario (preciso = necesario; también juega con «exacto»)",
        "se deu conta": "se dio cuenta (dar-se conta)" } },

    { week: 51, level: "C1", title: "Os livros do ano",
      es: "Balance de un año de lecturas en portugués: Guimarães Rosa, Saramago y Camões, repasando las estructuras que el español no tiene.",
      text: "Se eu tivesse que escolher um livro deste ano, ficaria com Grande Sertão: Veredas, de Guimarães Rosa, em que Riobaldo repete que viver é muito perigoso. Tenho lido também Saramago, o primeiro autor de língua portuguesa a ganhar o Nobel, em mil novecentos e noventa e oito. Quando eu for a Lisboa, quero ver a estátua de Camões, que, segundo a tradição, salvou Os Lusíadas de um naufrágio nadando com o manuscrito. Para nós aprendermos uma língua, é preciso lermos os seus clássicos. Ainda que custe, vale a pena.",
      chunks: ["se eu tivesse que escolher", "viver é muito perigoso", "tenho lido também", "quando eu for a Lisboa", "para nós aprendermos", "vale a pena"],
      keywords: ["Grande Sertão", "Guimarães Rosa", "Riobaldo", "Saramago", "Nobel", "Camões", "Lusíadas", "naufrágio"],
      gloss: {
        "ficaria com": "me quedaría con (ficar com = elegir, quedarse con)",
        "Veredas": "senderos junto al agua en el sertão" } }
  ];
  var api = { TESTI: TESTI };
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.DictoglossData = api;
})(typeof window !== "undefined" ? window : globalThis);
