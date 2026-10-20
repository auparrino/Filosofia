/*
 * A semana: un texto corto por cada semana del curso (las 52, jefes
 * incluidos), escrito a mano (Jeon & Day 2016: la lectura extensiva rinde,
 * d = 0,57).  Cada uno usa solo la gramática de las semanas 1..N y palabras
 * ya vistas o glosadas, para leer sin diccionario (Hu & Nation 2000: 98 % de
 * cobertura).  Largo: 80-110 palabras hasta la semana 26, 110-160 después.
 *
 * Ambientación: Sofía, una diseñadora porteña que se muda a Botafogo, en Río
 * de Janeiro; Bia, su compañera de departamento, profesora de historia en una
 * escuela pública; João, el hermano surfista de Bia; doña Lúcia, la vecina de
 * ochenta años que nació en Santa Teresa; y seu Manuel, el portugués de Oporto
 * dueño de la panadería de la esquina.  Desde la semana 27 los textos tratan
 * historia, sociología, filosofía y literatura de Brasil y de Portugal (datos
 * verificables; una frase de atribución dudosa se dice dudosa).  El portugués
 * es el de Brasil; lo coloquial va en diálogos y se marca en la consigna.
 *
 * Cada texto: id, week, n, level, emoji, title, grammar (en portugués), text,
 * gloss {forma exacta del texto en minúsculas: significado}, questions
 * (3 × [pregunta, opciones, respuesta]: en castellano hasta la semana 26, en
 * portugués desde la 27, como en el Celpe-Bras), vf (afirmaciones en
 * portugués: "verdadeiro" / "falso" / "não se diz", como en el Celpe-Bras) y
 * hunt {label, targets} (formas exactas, en minúsculas, a tocar en el texto;
 * la consigna, en portugués desde la 27).
 * Las glosas limpias (1-2 palabras, no cognados) se vuelven glosas de opción
 * múltiple (letture.js, mcTargets).  Los controla tools/check_letture.py.
 */
(function (root) {
  "use strict";

  var TESTI = [
    // ------------------------------------------------ Estação 1 (A1 → A2)
    { id: "w-01", week: 1, n: 1, level: "A1", emoji: "👋", title: "Olá, Rio!",
      grammar: "ser, estar e ter",
      text:
        "Olá! Eu sou a Sofía. Sou argentina, de Buenos Aires, e tenho vinte e nove anos. " +
        "Agora estou no Rio e estou muito feliz!\n\n" +
        "O apartamento é pequeno, mas é bonito. É em Botafogo, um bairro tranquilo. " +
        "A Bia é carioca e é professora. Ela é muito simpática. " +
        "A Bia tem um gato, o Tom. O Tom é preto e é muito preguiçoso.\n\n" +
        "Hoje é sábado e o dia está lindo. O céu está azul e o mar está calmo. " +
        "A Bia e eu estamos na praia, em Copacabana. Eu tenho um livro; " +
        "a Bia tem uma água de coco. Tudo é novo para mim, mas eu estou em casa.",
      gloss: { agora: "ahora", bairro: "barrio", carioca: "de Río de Janeiro", preguiçoso: "perezoso",
               hoje: "hoy", céu: "cielo", praia: "playa", preto: "negro",
               coco: "coco (água de coco = agua de coco)", mim: "mí (para mim = para mí)",
               // las contracciones llegan en la semana 3: acá se glosan
               no: "en el (em + o; no es la negación, que es não)", na: "en la (em + a)",
               em: "en (é em Botafogo = queda en Botafogo)" },
      questions: [
        ["¿De dónde es Sofía?", ["de Buenos Aires", "de Río de Janeiro", "de Rosario", "de Córdoba"], "de Buenos Aires"],
        ["¿Quién es Tom?", ["el gato de Bia", "el hermano de Bia", "un vecino", "el perro de Sofía"], "el gato de Bia"],
        ["¿Dónde están Sofía y Bia el sábado?", ["en la playa de Copacabana", "en casa", "en la casa de Bia, en Botafogo", "en Buenos Aires"], "en la playa de Copacabana"]
      ],
      vf: [["A Sofía é brasileira.", "falso"], ["O Tom é um gato preto.", "verdadeiro"], ["A Sofía tem um irmão no Rio.", "não se diz"]],
      hunt: { label: "Tocá las formas de ser, estar y ter", targets: ["sou", "tenho", "estou", "é", "tem", "está", "estamos"] } },

    { id: "w-02", week: 2, n: 2, level: "A1", emoji: "🏠", title: "O apartamento de Botafogo",
      grammar: "substantivos: gênero e número",
      text:
        "O apartamento é antigo, mas é bom. Tem dois quartos, uma sala, uma cozinha e um banheiro. " +
        "A sala tem um sofá, duas cadeiras, três janelas e dois violões. " +
        "Há também muitos livros e muitas plantas.\n\n" +
        "A cozinha é pequena. Há pães, limões, feijão, arroz, o sal e o leite. " +
        "O leite é para o café, e o café é sagrado!\n\n" +
        "Na janela da sala há uma árvore grande e, atrás da árvore, o Pão de Açúcar. " +
        "De noite, as luzes da cidade são lindas. E os animais? Há só um: o Tom, o gato. " +
        "Ele é o rei da casa.",
      gloss: { quartos: "dormitorios", banheiro: "baño", cadeiras: "sillas", janelas: "ventanas", janela: "ventana",
               violões: "guitarras", pães: "panes", limões: "limones", feijão: "porotos", leite: "leche (en portugués es masculino)",
               árvore: "árbol (en portugués es femenino)", atrás: "detrás", luzes: "luces", rei: "rey",
               sagrado: "sagrado", noite: "noche", só: "solo",
               // las contracciones llegan en la semana 3: acá se glosan
               na: "en la (em + a)", da: "de la (de + a)" },
      questions: [
        ["¿Cuántos dormitorios tiene el departamento?", ["dos", "uno", "tres", "cuatro"], "dos"],
        ["¿Para qué es la leche?", ["para el café", "para el gato", "para una torta", "para Bia"], "para el café"],
        ["¿Qué se ve por la ventana?", ["un árbol y el Pan de Azúcar", "el mar y los barcos de la bahía", "la playa", "una plaza"], "un árbol y el Pan de Azúcar"]
      ],
      vf: [["A cozinha é grande.", "falso"], ["O apartamento tem um gato.", "verdadeiro"], ["Os violões são novos.", "não se diz"]],
      hunt: { label: "Tocá los sustantivos en plural", targets: ["quartos", "cadeiras", "janelas", "violões", "livros", "plantas", "pães", "limões", "luzes", "animais"] } },

    { id: "w-03", week: 3, n: 3, level: "A1", emoji: "🥐", title: "A minha rua",
      grammar: "artigos e contrações",
      text:
        "Eu moro numa rua de Botafogo, perto do metrô. Na esquina tem uma padaria: " +
        "o dono é o seu Manuel, um português do Porto. O pão de queijo da padaria é ótimo.\n\n" +
        "Ao lado da padaria há uma farmácia e, depois, um boteco. No boteco estão sempre os vizinhos, " +
        "com uma cerveja e o jornal do dia.\n\n" +
        "Pela janela do meu quarto vejo o Cristo Redentor, no alto do Corcovado. " +
        "Aos domingos, a rua é das crianças e dos cachorros. De noite, há música nos bares da rua " +
        "e o seu Manuel conversa com todo mundo pela janela da padaria.",
      gloss: { aos: "a los (aos domingos = los domingos)", perto: "cerca", padaria: "panadería", dono: "dueño", seu: "don (seu Manuel = don Manuel)",
               queijo: "queso", ótimo: "buenísimo", lado: "lado (ao lado = al lado)", boteco: "bar de barrio",
               vizinhos: "vecinos", jornal: "diario", vejo: "veo", crianças: "chicos, niños",
               cachorros: "perros", conversa: "charla", mundo: "mundo (todo mundo = todo el mundo)",
               // el presente regular llega en la semana 5; los posesivos, en la 10
               moro: "vivo (morar = vivir)", meu: "mi (o meu quarto = mi pieza)" },
      questions: [
        ["¿Quién es el dueño de la panadería?", ["un portugués de Oporto", "un vecino carioca de Botafogo", "Bia", "un argentino"], "un portugués de Oporto"],
        ["¿Qué ve el narrador desde la ventana de su cuarto?", ["el Cristo Redentor", "el mar", "la playa", "el subte"], "el Cristo Redentor"],
        ["¿De quién es la calle los domingos?", ["de los chicos y los perros", "de los autos", "de los turistas y los autos", "de nadie"], "de los chicos y los perros"]
      ],
      vf: [["O seu Manuel é do Porto.", "verdadeiro"], ["O pão de queijo da padaria é ruim.", "falso"], ["O seu Manuel tem dois filhos.", "não se diz"]],
      hunt: { label: "Tocá las contracciones (numa, do, na, da, ao, pela…)", targets: ["numa", "do", "na", "da", "ao", "no", "pela", "aos", "das", "dos", "nos"] } },

    { id: "w-04", week: 4, n: 4, level: "A1", emoji: "🏖️", title: "Gente de Copacabana",
      grammar: "adjetivos, cores e nacionalidades",
      text:
        "No domingo, a praia de Copacabana está cheia. Há turistas franceses, ingleses, alemães " +
        "e muitos argentinos. A Sofía é argentina, mas não é turista: agora é um pouco carioca também!\n\n" +
        "O João, o irmão da Bia, é alto e magro, tem o cabelo comprido e os olhos verdes. " +
        "É surfista e é muito calmo. A Bia é baixa, tem o cabelo curto e crespo e é muito alegre.\n\n" +
        "Ao lado, há uma família portuguesa: o pai é baixo e simpático, a mãe é loira " +
        "e tem um chapéu amarelo enorme. O mar está azul-escuro e a areia está branca e quente. " +
        "Um dia perfeito!",
      gloss: { cheia: "llena", alemães: "alemanes", chapéu: "sombrero", irmão: "hermano", magro: "flaco", cabelo: "pelo",
               comprido: "largo", olhos: "ojos", crespo: "enrulado", loira: "rubia", mãe: "madre",
               amarelo: "amarillo", areia: "arena", quente: "caliente", pouco: "poco" },
      questions: [
        ["¿Cómo es João?", ["alto y flaco, de pelo largo", "bajo y alegre", "rubio y de pelo corto", "gordo y serio"], "alto y flaco, de pelo largo"],
        ["¿Quiénes están al lado?", ["una familia portuguesa", "unos turistas franceses", "unos argentinos", "los vecinos"], "una familia portuguesa"],
        ["¿Cómo está la arena?", ["blanca y caliente", "mojada y fría", "sucia", "negra"], "blanca y caliente"]
      ],
      vf: [["O João tem os olhos verdes.", "verdadeiro"], ["A Bia é alta.", "falso"], ["A família portuguesa é de Lisboa.", "não se diz"]],
      hunt: { label: "Tocá las nacionalidades y gentilicios", targets: ["franceses", "ingleses", "alemães", "argentinos", "argentina", "carioca", "portuguesa"] } },

    { id: "w-05", week: 5, n: 5, level: "A1", emoji: "💻", title: "Um dia de trabalho",
      grammar: "presente dos verbos regulares",
      text:
        "A Sofía trabalha em casa. É designer e desenha logotipos para empresas argentinas. " +
        "Ela acorda cedo, abre a janela e olha o morro. Depois, bebe um café forte e começa a trabalhar.\n\n" +
        "A Bia não trabalha em casa: ensina história numa escola pública do Catete. " +
        "Ela almoça com os alunos e volta de tarde.\n\n" +
        "De tarde, elas estudam juntas: a Sofía estuda português e a Bia estuda espanhol. " +
        "A Sofía fala muito rápido e a Bia escreve tudo num caderno. De noite, elas cozinham, " +
        "comem na varanda e conversam sobre o dia. E vocês? Vocês moram com um amigo?",
      gloss: { desenha: "diseña", acorda: "se despierta", cedo: "temprano", morro: "cerro", ensina: "enseña",
               almoça: "almuerza", alunos: "alumnos", volta: "vuelve", juntas: "juntas", caderno: "cuaderno", cozinham: "cocinan", varanda: "balcón", moram: "viven" },
      questions: [
        ["¿Qué hace Sofía?", ["es diseñadora", "es profesora", "es cocinera", "es periodista"], "es diseñadora"],
        ["¿Dónde enseña Bia?", ["en una escuela pública de Catete", "en su casa", "en una universidad privada de Botafogo", "en Buenos Aires"], "en una escuela pública de Catete"],
        ["¿Qué hacen de tarde?", ["estudian juntas", "van a la playa", "duermen", "trabajan en la escuela"], "estudian juntas"]
      ],
      vf: [["A Bia trabalha em casa.", "falso"], ["A Sofía estuda português.", "verdadeiro"], ["A escola da Bia é grande.", "não se diz"]],
      hunt: { label: "Tocá los verbos regulares en presente", targets: ["trabalha", "desenha", "acorda", "abre", "olha", "bebe", "começa", "ensina", "almoça", "volta", "estuda", "fala", "escreve", "cozinham", "comem", "conversam", "moram"] } },

    { id: "w-06", week: 6, n: 6, level: "A1", emoji: "🏄", title: "Sábado no Arpoador",
      grammar: "presente dos verbos irregulares",
      text:
        "No sábado, o João sai de casa antes do sol. Ele vai de bicicleta até o Arpoador, " +
        "põe a prancha na areia e entra no mar. Diz que de manhã o mar é perfeito.\n\n" +
        "A Sofía não sabe surfar, mas quer aprender. Hoje ela vem com a Bia e traz um sanduíche " +
        "para o João. Eles fazem um piquenique nas pedras e veem os surfistas. " +
        "A Sofía pede uma aula: \"Você pode ensinar?\" \"Posso, sim!\", diz o João.\n\n" +
        "No fim do dia, muita gente vem ao Arpoador para ver o pôr do sol. Quando o sol " +
        "desaparece atrás do morro Dois Irmãos, todo mundo aplaude. É uma tradição carioca.",
      gloss: { prancha: "tabla (de surf)", manhã: "mañana", traz: "trae", pedras: "piedras",
               veem: "ven", pede: "pide", aula: "clase", fim: "fin", pôr: "poner (pôr do sol = atardecer)",
               aplaude: "aplaude", irmãos: "hermanos", surfar: "surfear", piquenique: "pícnic" },
      questions: [
        ["¿Cómo va João al Arpoador?", ["en bicicleta", "en colectivo", "a pie", "en auto"], "en bicicleta"],
        ["¿Qué le pide Sofía a João?", ["una clase de surf", "un sándwich", "una tabla", "plata"], "una clase de surf"],
        ["¿Qué hace la gente cuando se pone el sol?", ["aplaude", "canta", "se va a casa", "se mete al mar"], "aplaude"]
      ],
      vf: [["A Sofía sabe surfar.", "falso"], ["O João vai ao Arpoador de bicicleta.", "verdadeiro"], ["A Bia surfa também.", "não se diz"]],
      hunt: { label: "Tocá los verbos irregulares (sai, vai, põe, diz…)", targets: ["sai", "vai", "põe", "diz", "sabe", "quer", "vem", "traz", "fazem", "veem", "pede", "pode", "posso"] } },

    { id: "w-07", week: 7, n: 7, level: "A1", emoji: "📅", title: "A agenda de janeiro",
      grammar: "números, horas e datas",
      text:
        "Hoje é segunda-feira, quinze de janeiro, e a semana da Sofía está cheia. " +
        "Às nove e meia, ela tem uma reunião com uma empresa de Rosário.\n\n" +
        "Na terça, às duas da tarde, tem aula de português: custa oitenta reais. " +
        "Na quarta, a Bia faz trinta e um anos. A Sofía liga para a padaria " +
        "e pede um bolo: \"Dois, meia, quatro, sete...\"\n\n" +
        "O sábado, vinte de janeiro, é feriado: é o dia de São Sebastião, o padroeiro do Rio. " +
        "Na sexta à noite, as duas vão a um show na Lapa: o ingresso custa cento e vinte reais.\n\n" +
        "Que horas são? Dez para as dez. A Sofía está atrasada!",
      gloss: { faz: "(faz trinta e um anos) cumple treinta y un años", reunião: "reunión", liga: "llama (por teléfono)",
               meia: "seis (al decir un número)", bolo: "torta", feriado: "feriado", padroeiro: "santo patrono",
               ingresso: "entrada", atrasada: "atrasada, llegando tarde", "segunda-feira": "lunes",
               terça: "martes (terça-feira)", quarta: "miércoles (quarta-feira)", sexta: "viernes (sexta-feira)" },
      questions: [
        ["¿Cuánto cuesta la clase de portugués?", ["ochenta reales", "ciento veinte reales", "treinta reales", "veinte reales"], "ochenta reales"],
        ["¿Cuántos años cumple Bia?", ["treinta y uno", "veintinueve", "treinta", "cuarenta y uno"], "treinta y uno"],
        ["¿Por qué el 20 de enero es feriado en Río?", ["es el día del santo patrono", "es el cumpleaños de la ciudad", "es carnaval", "es fin de año"], "es el día del santo patrono"]
      ],
      vf: [["A reunião é às nove e meia.", "verdadeiro"], ["O aniversário da Bia é na sexta-feira.", "falso"], ["O show na Lapa é de samba.", "não se diz"]],
      hunt: { label: "Tocá los números escritos en letras", targets: ["quinze", "nove", "duas", "oitenta", "trinta", "um", "dois", "meia", "quatro", "sete", "vinte", "cento", "dez"] } },

    { id: "w-08", week: 8, n: 8, level: "A1", emoji: "💬", title: "Mensagens de sexta-feira",
      grammar: "perguntas, ir + infinitivo e estar + gerúndio",
      text:
        "— Oi, Sofía! O que você está fazendo?\n" +
        "— Estou trabalhando ainda. E você?\n" +
        "— Estou saindo da escola agora. Vamos à Lapa hoje à noite?\n" +
        "— Quem vai?\n" +
        "— Eu, o João e uns amigos. Tem uma roda de samba perto dos Arcos.\n" +
        "— A que horas? Quanto custa?\n" +
        "— Às dez. E é de graça!\n" +
        "— Como a gente vai?\n" +
        "— De metrô até a Cinelândia e depois a pé.\n" +
        "— Por que não de táxi?\n" +
        "— Porque o metrô é rápido e barato.\n" +
        "— Tá bom. Vou tomar um banho e vou comer alguma coisa. Onde é o encontro?\n" +
        "— Na saída do metrô. Estou esperando vocês lá!",
      gloss: { ainda: "todavía", depois: "después", hoje: "hoy", saindo: "saliendo", roda: "ronda (roda de samba)", graça: "gracia (de graça = gratis)",
               pé: "pie (a pé = a pie)", tá: "está (tá bom = está bien, coloquial)", banho: "baño (tomar banho = bañarse)",
               coisa: "cosa", encontro: "encuentro", saída: "salida", esperando: "esperando", oi: "hola" },
      questions: [
        ["¿Qué está haciendo Sofía?", ["está trabajando", "está saliendo de la escuela", "está en la Lapa", "está comiendo"], "está trabajando"],
        ["¿Cuánto cuesta la roda de samba?", ["es gratis", "diez reales", "veinte reales", "no lo dicen"], "es gratis"],
        ["¿Cómo van a ir?", ["en subte y después a pie", "en taxi", "en colectivo y después en taxi", "en bicicleta"], "en subte y después a pie"]
      ],
      vf: [["A roda de samba é de graça.", "verdadeiro"], ["Eles vão de táxi.", "falso"], ["A roda de samba termina às duas.", "não se diz"]],
      hunt: { label: "Tocá los gerundios (estar + gerúndio)", targets: ["fazendo", "trabalhando", "saindo", "esperando"] } },

    { id: "w-09", week: 9, n: 9, level: "A2", emoji: "⛴️", title: "De barca para Niterói",
      grammar: "preposições de lugar e movimento",
      text:
        "No domingo, a Sofía e a Bia vão a Niterói, do outro lado da baía de Guanabara. " +
        "Pegam o metrô em Botafogo, descem na estação Carioca e vão a pé até a Praça XV. " +
        "Lá pegam a barca: a viagem dura uns vinte minutos.\n\n" +
        "Em Niterói, passam pela orla e sobem até o Museu de Arte Contemporânea, de Oscar Niemeyer. " +
        "O museu parece um disco voador em cima de uma pedra!\n\n" +
        "Do museu, a vista do Rio é incrível: o Pão de Açúcar, o Cristo e a ponte Rio-Niterói. " +
        "Voltam de ônibus pela ponte, mas o trânsito é terrível. " +
        "\"Da próxima vez, a gente volta de barca\", diz a Bia.",
      gloss: { baía: "bahía", pegam: "toman", descem: "bajan", barca: "lancha (ferry)", orla: "costanera",
               sobem: "suben", voador: "volador (disco voador = plato volador)", cima: "cima (em cima de = arriba de)",
               ponte: "puente (en portugués es femenino)", ônibus: "colectivo", vez: "vez", outro: "otro" },
      questions: [
        ["¿Cómo cruzan a Niterói?", ["en barca", "en colectivo", "en subte", "a pie"], "en barca"],
        ["¿A qué se parece el museo?", ["a un plato volador", "a una piedra", "a un barco", "a un puente"], "a un plato volador"],
        ["¿Cómo vuelven?", ["en colectivo por el puente", "en barca, cruzando la bahía", "en taxi", "a pie"], "en colectivo por el puente"]
      ],
      vf: [["A viagem de barca dura uns vinte minutos.", "verdadeiro"], ["As duas voltam de barca.", "falso"], ["O museu é muito caro.", "não se diz"]],
      hunt: { label: "Tocá los medios de transporte", targets: ["metrô", "pé", "barca", "ônibus"] } },

    { id: "w-10", week: 10, n: 10, level: "A2", emoji: "📷", title: "O álbum da Dona Lúcia",
      grammar: "possessivos e demonstrativos",
      text:
        "A Dona Lúcia é a vizinha do terceiro andar. Tem oitenta anos e muitas histórias. " +
        "Hoje ela mostra um álbum à Sofía.\n\n" +
        "— Esta aqui sou eu, em Santa Teresa. Este senhor é o meu pai, e aquela senhora " +
        "de chapéu é a mãe dele. Esse cachorro é o Bolinha, o nosso primeiro cachorro.\n" +
        "— E este rapaz?\n" +
        "— Esse é o Carlos, o meu marido. O violão dele está naquele armário. " +
        "E as suas fotos, Sofía?\n" +
        "— As minhas estão no celular! Nesta estão os meus pais, em Buenos Aires. " +
        "Este é o meu irmão, e esta é a namorada dele.\n" +
        "— Que bonitos! E aquilo, o que é?\n" +
        "— Aquilo é o Obelisco!",
      gloss: { vizinha: "vecina", andar: "piso", rapaz: "muchacho", marido: "marido", armário: "ropero",
               namorada: "novia", celular: "celular", senhor: "señor", senhora: "señora", pais: "padres" },
      questions: [
        ["¿Quién es Carlos?", ["el marido de doña Lúcia", "su padre", "su hermano", "un vecino"], "el marido de doña Lúcia"],
        ["¿Dónde está la guitarra de Carlos?", ["en aquel ropero", "en Santa Teresa", "en el celular", "en la casa de Sofía"], "en aquel ropero"],
        ["¿Qué muestra Sofía?", ["fotos de su familia en el celular", "un álbum viejo con fotos de Buenos Aires", "una guitarra", "un mapa"], "fotos de su familia en el celular"]
      ],
      vf: [["A Dona Lúcia mora no terceiro andar.", "verdadeiro"], ["O Bolinha é um gato.", "falso"], ["O irmão da Sofía mora no Rio.", "não se diz"]],
      hunt: { label: "Tocá los posesivos y los demostrativos", targets: ["esta", "este", "aquela", "dele", "esse", "nosso", "meu", "naquele", "suas", "minhas", "nesta", "meus", "aquilo"] } },

    { id: "w-11", week: 11, n: 11, level: "A2", emoji: "⛵", title: "Um fim de semana em Paraty",
      grammar: "pretérito perfeito",
      text:
        "No fim de semana passado, a Sofía e a Bia foram a Paraty, uma cidade colonial entre o Rio " +
        "e São Paulo. Saíram na sexta às seis da tarde e chegaram de ônibus quase à meia-noite.\n\n" +
        "No sábado, andaram pelas ruas de pedra do centro histórico. Na maré alta, o mar entra " +
        "em algumas ruas! Na hora do almoço, comeram peixe com banana e beberam suco de caju. " +
        "De tarde, fizeram um passeio de barco pelas ilhas, e a Sofía tirou cem fotos.\n\n" +
        "No domingo choveu o dia todo, mas elas não ficaram tristes: visitaram uma cachaçaria " +
        "e compraram duas garrafas para o seu Manuel.",
      gloss: { quase: "casi", maré: "marea", almoço: "almuerzo", peixe: "pescado", suco: "jugo",
               caju: "cajú (una fruta)", passeio: "paseo", ilhas: "islas", tirou: "sacó",
               choveu: "llovió", cachaçaria: "destilería de cachaça", garrafas: "botellas", ficaram: "quedaron, se pusieron" },
      questions: [
        ["¿Cómo llegaron a Paraty?", ["en colectivo", "en barco", "en avión", "en auto"], "en colectivo"],
        ["¿Qué comieron?", ["pescado con banana", "feijoada", "pizza", "pan de queso"], "pescado con banana"],
        ["¿Qué compraron para seu Manuel?", ["dos botellas de cachaça", "fotos", "un barco", "dos botellas de jugo de cajú"], "dos botellas de cachaça"]
      ],
      vf: [["Choveu no domingo.", "verdadeiro"], ["Elas chegaram a Paraty de manhã.", "falso"], ["O seu Manuel gosta de cachaça.", "não se diz"]],
      hunt: { label: "Tocá los verbos en pretérito perfeito", targets: ["foram", "saíram", "chegaram", "andaram", "comeram", "beberam", "fizeram", "tirou", "choveu", "ficaram", "visitaram", "compraram"] } },

    { id: "w-12", week: 12, n: 12, level: "A2", emoji: "🍫", title: "Brigadeiro para a festa",
      grammar: "imperativo e verbos reflexivos",
      text:
        "No sábado tem festa, e a Bia ensina a Sofía a fazer brigadeiro, o doce das festas " +
        "de aniversário no Brasil. A Sofía se levanta cedo, se veste e vai ao mercado.\n\n" +
        "Anote a receita: ponha numa panela uma lata de leite condensado, uma colher de manteiga " +
        "e três colheres de chocolate em pó. Cozinhe em fogo baixo e mexa sempre, sem parar, " +
        "uns dez minutos. Quando a massa desgruda do fundo da panela, está pronta. Espere esfriar.\n\n" +
        "Depois, passe manteiga nas mãos, faça bolinhas e passe no chocolate granulado. " +
        "A Sofía se diverte e se suja toda. \"Não coma tudo antes da festa!\", diz a Bia.",
      gloss: { brigadeiro: "bombón de chocolate", doce: "dulce", panela: "olla", colher: "cuchara", colheres: "cucharas", manteiga: "manteca",
               pó: "polvo (em pó = en polvo)", fogo: "fuego", mexa: "revolvé", massa: "masa",
               desgruda: "se despega", fundo: "fondo", pronta: "lista", esfriar: "enfriarse",
               bolinhas: "bolitas", granulado: "granas", suja: "ensucia", lata: "lata" },
      questions: [
        ["¿Qué es el brigadeiro?", ["un dulce de los cumpleaños", "una bebida", "una comida salada de las fiestas", "un pan"], "un dulce de los cumpleaños"],
        ["¿Cuánto tiempo se cocina la mezcla?", ["unos diez minutos", "una hora", "dos minutos", "toda la noche"], "unos diez minutos"],
        ["¿Cuándo está lista la masa?", ["cuando se despega del fondo de la olla", "cuando hierve", "cuando se enfría y se pone dura en la olla", "cuando es negra"], "cuando se despega del fondo de la olla"]
      ],
      vf: [["O brigadeiro leva leite condensado.", "verdadeiro"], ["A Sofía cozinha o brigadeiro em fogo alto.", "falso"], ["A festa é para o João.", "não se diz"]],
      hunt: { label: "Tocá los imperativos (anote, ponha, cozinhe…)", targets: ["anote", "ponha", "cozinhe", "mexa", "espere", "passe", "faça", "coma"] } },

    { id: "w-13", week: 13, n: 13, level: "A2", emoji: "🎭", title: "O primeiro Carnaval",
      grammar: "revisão A2: presente e perfeito",
      text:
        "Em fevereiro, a Sofía viveu o seu primeiro Carnaval carioca. Ela não foi ao Sambódromo: " +
        "preferiu os blocos de rua, que são de graça e estão por toda a cidade.\n\n" +
        "No sábado, acordou às sete e foi com a Bia ao Cordão da Bola Preta, no Centro, " +
        "um bloco de 1918. Na rua, milhares de pessoas cantaram marchinhas antigas e dançaram " +
        "sob o sol forte. A Sofía usou uma fantasia de abacaxi, e o João, uma de sereia.\n\n" +
        "Na segunda, todos estão cansados, mas a Bia já está fazendo planos: \"Amanhã a gente vai " +
        "às Carmelitas, em Santa Teresa!\" E a Quarta-Feira de Cinzas? A Sofía dormiu o dia inteiro.",
      gloss: { blocos: "comparsas", milhares: "miles", marchinhas: "marchas de carnaval", sob: "bajo",
               fantasia: "disfraz", abacaxi: "ananá", sereia: "sirena", cinzas: "cenizas",
               inteiro: "entero", amanhã: "mañana", cansados: "cansados", preferiu: "prefirió" },
      questions: [
        ["¿Por qué prefirió Sofía los blocos?", ["son gratis y están en toda la ciudad", "son más cortos", "le gusta más el desfile del Sambódromo", "son de noche"], "son gratis y están en toda la ciudad"],
        ["¿De qué se disfrazó Sofía?", ["de ananá", "de sirena", "de sol", "de marinero"], "de ananá"],
        ["¿Qué hizo el Miércoles de Ceniza?", ["durmió todo el día", "fue a otro bloco", "trabajó", "fue a la playa"], "durmió todo el día"]
      ],
      vf: [["A Sofía foi ao Sambódromo.", "falso"], ["O Cordão da Bola Preta é de 1918.", "verdadeiro"], ["O João dançou com a Bia.", "não se diz"]],
      hunt: { label: "Tocá los verbos en pretérito perfeito", targets: ["viveu", "foi", "preferiu", "acordou", "cantaram", "dançaram", "usou", "dormiu"] } },

    // ------------------------------------------------ Estação 2 (A2 → B1)
    { id: "w-14", week: 14, n: 14, level: "A2", emoji: "🍲", title: "Feijoada de sábado",
      grammar: "gostar de e verbos com preposição",
      text:
        "No Rio, a feijoada é um ritual de quarta-feira e de sábado. O seu Manuel faz uma no boteco " +
        "todo sábado, e a Sofía adora. Ela gosta do feijão preto, gosta da couve e da farofa, " +
        "mas não gosta muito do torresmo. A Bia gosta de tudo e sempre pede uma caipirinha.\n\n" +
        "O seu Manuel lembra de Portugal: \"Lá a gente come cozido à portuguesa, que também leva " +
        "carne de porco.\" A Sofía pensa na mãe dela e no churrasco de domingo em Buenos Aires. " +
        "\"Eu sonho com um bom assado\", diz ela. \"Acredito em você\", responde o seu Manuel, " +
        "\"mas aqui você precisa de feijoada!\"",
      gloss: { portuguesa: "(à portuguesa) a la portuguesa", couve: "col", farofa: "harina de mandioca tostada", torresmo: "chicharrón",
               lembra: "se acuerda", cozido: "puchero", leva: "lleva", porco: "cerdo",
               churrasco: "asado", sonho: "sueño", acredito: "creo", precisa: "necesita", adora: "adora" },
      questions: [
        ["¿Qué no le gusta tanto a Sofía?", ["el chicharrón", "los porotos", "la farofa", "la col"], "el chicharrón"],
        ["¿Con qué sueña Sofía?", ["con un buen asado", "con un cocido portugués", "con una caipirinha", "con Portugal"], "con un buen asado"],
        ["¿Qué pide siempre Bia?", ["una caipirinha", "una cerveza", "un café", "un jugo"], "una caipirinha"]
      ],
      vf: [["A Bia gosta de tudo na feijoada.", "verdadeiro"], ["O seu Manuel faz feijoada toda sexta-feira.", "falso"], ["O seu Manuel tem um restaurante em Portugal.", "não se diz"]],
      hunt: { label: "Tocá los verbos que piden preposición (gostar de, lembrar de…)", targets: ["gosta", "lembra", "pensa", "sonho", "acredito", "precisa"] } },

    { id: "w-15", week: 15, n: 15, level: "A2", emoji: "🚋", title: "Quando a Dona Lúcia era menina",
      grammar: "pretérito imperfeito",
      text:
        "Quando a Dona Lúcia era menina, morava em Santa Teresa, numa casa amarela com um jardim " +
        "enorme. Todos os dias pegava o bonde para ir à escola, no Centro. O bonde passava sobre " +
        "os Arcos da Lapa, e as crianças faziam barulho e cantavam.\n\n" +
        "Naquela época, Copacabana tinha poucos prédios altos, e as famílias iam à praia de manhã " +
        "cedo. O pai dela era músico e tocava violão nos bares da Lapa. A mãe costurava para fora.\n\n" +
        "Um dia, o pai chegou em casa com um rádio novo. Foi uma festa: a família inteira ouviu " +
        "os programas da Rádio Nacional. \"Ah, que saudade!\", diz ela.",
      gloss: { menina: "nena", pegava: "tomaba", bonde: "tranvía", barulho: "ruido", época: "época",
               prédios: "edificios", tocava: "tocaba", costurava: "cosía", fora: "afuera (costurar para fora = coser por encargo)",
               ouviu: "escuchó", saudade: "nostalgia, añoranza", jardim: "jardín" },
      questions: [
        ["¿Cómo iba Lúcia a la escuela?", ["en tranvía", "a pie", "en colectivo", "en auto"], "en tranvía"],
        ["¿Qué hacía el padre?", ["era músico y tocaba la guitarra", "era profesor de historia en una escuela", "era costurero", "trabajaba en la radio"], "era músico y tocaba la guitarra"],
        ["¿Qué trajo el padre un día?", ["una radio nueva", "una guitarra", "un tranvía de juguete", "un perro"], "una radio nueva"]
      ],
      vf: [["A casa da Dona Lúcia era amarela.", "verdadeiro"], ["O pai dela era professor.", "falso"], ["A Dona Lúcia tinha cinco irmãos.", "não se diz"]],
      hunt: { label: "Tocá los verbos en imperfeito", targets: ["era", "morava", "pegava", "passava", "faziam", "cantavam", "tinha", "iam", "tocava", "costurava"] } },

    { id: "w-16", week: 16, n: 16, level: "A2", emoji: "🎁", title: "O presente da Bia",
      grammar: "pronomes objeto",
      text:
        "No domingo, a Sofía foi à Feira Hippie de Ipanema, na Praça General Osório, para comprar " +
        "um presente para a Bia. Viu uma bolsa de couro linda e comprou-a na hora.\n\n" +
        "Depois, encontrou o João e mostrou-lhe a bolsa. \"Ela vai adorar!\", ele disse. " +
        "\"Me dá o cartão, que eu escrevo também.\"\n\n" +
        "Em casa, a Bia abriu o pacote e ficou emocionada. \"Você me conhece bem! Obrigada!\" " +
        "Depois, olhou para a mesa: \"E o bolo? Você esqueceu?\" A Sofía riu: \"Não esqueci, não. " +
        "Está na geladeira. Vou buscá-lo agora.\"\n\n" +
        "Na conversa, a Bia diz \"eu vi ele\"; no livro de português, está escrito \"eu o vi\".",
      gloss: { feira: "feria", presente: "regalo", bolsa: "cartera", couro: "cuero", hora: "hora (na hora = en el acto)",
               cartão: "tarjeta", pacote: "paquete", esqueceu: "olvidaste", riu: "se rió",
               geladeira: "heladera", "buscá-lo": "buscarlo (ir a buscarlo)", conversa: "charla", escrito: "escrito" },
      questions: [
        ["¿Qué compró Sofía?", ["una cartera de cuero", "una torta", "un libro", "una tarjeta"], "una cartera de cuero"],
        ["¿Qué quiere hacer João?", ["escribir en la tarjeta", "comprar otra cartera más cara", "hacer la torta", "ir a la feria"], "escribir en la tarjeta"],
        ["¿Dónde está la torta?", ["en la heladera", "en la feria", "en la casa de João", "no hay torta"], "en la heladera"]
      ],
      vf: [["A Sofía comprou uma bolsa de couro.", "verdadeiro"], ["A Sofía esqueceu o bolo na feira.", "falso"], ["A bolsa custou cem reais.", "não se diz"]],
      hunt: { label: "Tocá los pronombres objeto (y el verbo al que van pegados)", targets: ["comprou-a", "mostrou-lhe", "me", "buscá-lo"] } },

    { id: "w-17", week: 17, n: 17, level: "B1", emoji: "🎆", title: "Réveillon em Copacabana",
      grammar: "futuro do presente",
      text:
        "No dia 31 de dezembro, mais de dois milhões de pessoas estarão na praia de Copacabana " +
        "para o Réveillon. A Sofía já tem o plano: vestirá branco, como manda a tradição, " +
        "e à meia-noite pulará sete ondas e fará sete pedidos.\n\n" +
        "A Bia levará flores brancas para Iemanjá, a rainha do mar, e as jogará na água. " +
        "Os fogos durarão mais de dez minutos e iluminarão toda a orla.\n\n" +
        "E as promessas? A Sofía as escreveu num papel: \"No ano novo, falarei português sem medo, " +
        "farei a trilha da Pedra da Gávea e aprenderei a surfar.\" O João riu: \"Surfar? Veremos!\"",
      gloss: { milhões: "millones", manda: "manda", pulará: "saltará", ondas: "olas", pedidos: "deseos",
               rainha: "reina", jogará: "tirará", fogos: "fuegos artificiales", durarão: "durarán",
               promessas: "promesas", medo: "miedo", trilha: "caminata, sendero", branco: "blanco" },
      questions: [
        ["¿De qué color se vestirá Sofía?", ["de blanco", "de rojo", "de azul", "de amarillo"], "de blanco"],
        ["¿Qué hará a medianoche?", ["saltar siete olas", "tirar flores", "cantar", "surfear"], "saltar siete olas"],
        ["¿Qué llevará Bia?", ["flores blancas para Iemanjá", "fuegos artificiales para la playa", "un papel", "una tabla"], "flores blancas para Iemanjá"]
      ],
      vf: [["A Sofía vestirá branco.", "verdadeiro"], ["A Bia levará flores vermelhas.", "falso"], ["O João passará o Réveillon em Niterói.", "não se diz"]],
      hunt: { label: "Tocá los verbos en futuro", targets: ["estarão", "vestirá", "pulará", "fará", "levará", "jogará", "durarão", "iluminarão", "falarei", "farei", "aprenderei", "veremos"] } },

    { id: "w-18", week: 18, n: 18, level: "B1", emoji: "🛎️", title: "Um quarto com vista para o mar",
      grammar: "futuro do pretérito e cortesia",
      text:
        "O Lucas, um amigo de Rosário, chega ao Rio na sexta. A Sofía liga para um hotel em Ipanema.\n\n" +
        "— Bom dia. Eu gostaria de reservar um quarto para um amigo, de sexta a domingo.\n" +
        "— Pois não. Seria um quarto de solteiro?\n" +
        "— Sim. Vocês teriam um quarto com vista para o mar?\n" +
        "— Teríamos, mas custaria seiscentos reais por noite.\n" +
        "— Nossa! Seria possível um desconto? Ele ficaria duas noites.\n" +
        "— Eu poderia fazer quinhentos, com o café da manhã.\n" +
        "— Perfeito. E você poderia indicar um bom restaurante perto?\n" +
        "— Eu iria ao boteco da esquina: a comida é simples, mas é muito boa.\n" +
        "— Muito obrigada. Eu queria também o endereço do hotel, por favor.",
      gloss: { pois: "pues (pois não = cómo no)", solteiro: "individual (quarto de solteiro = habitación individual)", desconto: "descuento",
               nossa: "¡uy! (sorpresa)", quinhentos: "quinientos", seiscentos: "seiscientos",
               endereço: "dirección", obrigada: "gracias (dicho por una mujer)", indicar: "recomendar", perto: "cerca" },
      questions: [
        ["¿Para quién es la habitación?", ["para Lucas", "para Sofía", "para Bia", "para João"], "para Lucas"],
        ["¿Cuánto cuesta al final por noche?", ["quinientos reales, con desayuno", "seiscientos reales, sin desayuno", "trescientos reales", "es gratis"], "quinientos reales, con desayuno"],
        ["¿Qué restaurante recomienda el recepcionista?", ["el bar de la esquina", "el restaurante del hotel", "uno en Copacabana", "ninguno"], "el bar de la esquina"]
      ],
      vf: [["O Lucas ficaria duas noites.", "verdadeiro"], ["No final, o quarto custa seiscentos reais.", "falso"], ["O Lucas já conhece o Rio.", "não se diz"]],
      hunt: { label: "Tocá los verbos en futuro do pretérito (condicional)", targets: ["gostaria", "seria", "teriam", "teríamos", "custaria", "ficaria", "poderia", "iria"] } },

    { id: "w-19", week: 19, n: 19, level: "B1", emoji: "🏙️", title: "Rio ou São Paulo?",
      grammar: "comparativos e superlativos",
      text:
        "O Lucas passou três dias em São Paulo. São Paulo " +
        "é maior do que o Rio: é a maior cidade do Brasil, com mais de onze milhões de habitantes. " +
        "Tem mais museus e teatros, mas o trânsito é pior e o céu é menos azul.\n\n" +
        "O Rio é menor, mas é lindíssimo: tem praia, calçadão e floresta no meio da cidade. " +
        "A Floresta da Tijuca é uma das maiores florestas urbanas do mundo.\n\n" +
        "\"Os paulistanos trabalham tanto quanto os cariocas\", diz a Bia. O Lucas acha que " +
        "em São Paulo a pizza é melhor. \"Mas o pôr do sol do Arpoador é o mais bonito " +
        "do mundo\", responde a Sofía.",
      gloss: { floresta: "selva", calçadão: "rambla", acha: "cree", meio: "medio (no meio = en el medio)",
               paulistanos: "los de la ciudad de São Paulo", lindíssimo: "lindísimo", milhões: "millones" },
      questions: [
        ["¿Cuál es la ciudad más grande de Brasil?", ["São Paulo", "Río de Janeiro", "Brasilia", "Salvador"], "São Paulo"],
        ["¿Qué tiene Río en medio de la ciudad?", ["un bosque, la Floresta da Tijuca", "un lago", "un desierto", "un río enorme que cruza el centro"], "un bosque, la Floresta da Tijuca"],
        ["¿Qué dice Lucas de la pizza?", ["que en São Paulo es mejor", "que en Río es mejor", "que son iguales", "que no le gusta"], "que en São Paulo es mejor"]
      ],
      vf: [["São Paulo é maior do que o Rio.", "verdadeiro"], ["O Lucas acha a pizza do Rio melhor.", "falso"], ["O Lucas vai morar em São Paulo.", "não se diz"]],
      hunt: { label: "Tocá los comparativos y superlativos", targets: ["maior", "pior", "menos", "menor", "lindíssimo", "maiores", "tanto", "melhor", "mais"] } },

    { id: "w-20", week: 20, n: 20, level: "B1", emoji: "☔", title: "Uma segunda-feira sem sorte",
      grammar: "indefinidos, negação e quantidade",
      text:
        "Ontem nada deu certo para a Sofía. De manhã, não tinha café em casa, nem pão. " +
        "Foi trabalhar num café, mas nenhuma mesa estava livre, e o wi-fi também " +
        "não funcionava. Ligou para a Bia: ninguém atendeu.\n\n" +
        "De tarde, foi ao banco e esperou uma hora. Quando chegou a vez dela, o sistema caiu. " +
        "\"Hoje não é o meu dia, não\", pensou.\n\n" +
        "Voltou para casa a pé, debaixo de chuva, sem nenhum guarda-chuva. Mas, na porta do prédio, " +
        "alguém estava esperando: a Bia, com uma pizza e um vinho. \"Todo mundo tem um dia assim\", disse. " +
        "A Sofía comeu tudo, riu de tudo e esqueceu tudo.",
      gloss: { ontem: "ayer", certo: "bien (dar certo = salir bien)", atendeu: "atendió",
               vez: "turno", caiu: "se cayó", debaixo: "debajo", chuva: "lluvia", "guarda-chuva": "paraguas",
               assim: "así", esqueceu: "olvidó" },
      questions: [
        ["¿Qué faltaba en casa a la mañana?", ["café y pan", "leche", "agua", "nada"], "café y pan"],
        ["¿Qué pasó en el banco?", ["se cayó el sistema", "estaba cerrado por feriado", "le robaron", "atendieron rápido"], "se cayó el sistema"],
        ["¿Quién la esperaba en la puerta?", ["Bia, con una pizza y un vino", "João", "doña Lúcia, con un bizcochuelo", "nadie"], "Bia, con una pizza y un vino"]
      ],
      vf: [["Havia uma mesa livre no café.", "falso"], ["A Bia levou uma pizza.", "verdadeiro"], ["O João estava no trabalho.", "não se diz"]],
      hunt: { label: "Tocá los indefinidos y las palabras negativas", targets: ["nada", "nem", "ninguém", "nenhuma", "nenhum", "alguém", "tudo", "todo"] } },

    { id: "w-21", week: 21, n: 21, level: "B1", emoji: "✉️", title: "Carta para a mãe",
      grammar: "pretérito perfeito composto e mais-que-perfeito composto",
      text:
        "Querida mãe,\n\n" +
        "Aqui está tudo bem. Tenho trabalhado muito, porque tenho recebido projetos de Buenos Aires " +
        "e também de clientes brasileiros. Tenho estudado português todos os dias e, nas últimas " +
        "semanas, tenho sonhado em português!\n\n" +
        "Você lembra da viagem a Paraty? Quando chegamos à pousada, a dona já tinha preparado um bolo " +
        "de banana para nós. E ontem, quando voltei do trabalho, a Bia já tinha feito o jantar.\n\n" +
        "O tempo tem estado estranho: tem chovido muito, e o calor não diminui. A Dona Lúcia diz que " +
        "nunca tinha visto um março assim.\n\n" +
        "Beijos, e manda um abraço para o papai.\n" +
        "Sofía",
      gloss: { querida: "querida", ontem: "ayer", pousada: "posada, hotelito", jantar: "cena", chovido: "llovido",
               beijos: "besos", abraço: "abrazo", últimas: "últimas", estranho: "raro" },
      questions: [
        ["¿Qué viene haciendo Sofía?", ["trabaja y estudia mucho", "viaja mucho por el Nordeste", "no hace nada", "busca trabajo"], "trabaja y estudia mucho"],
        ["¿Qué había hecho Bia cuando Sofía volvió?", ["la cena", "una torta", "las compras", "la limpieza"], "la cena"],
        ["¿Cómo viene el tiempo?", ["llueve mucho y hace calor", "hace frío", "no llueve nunca y hace fresco", "nieva"], "llueve mucho y hace calor"]
      ],
      vf: [["A Sofía tem sonhado em português.", "verdadeiro"], ["A dona da pousada preparou um bolo de chocolate.", "falso"], ["O pai da Sofía está doente.", "não se diz"]],
      hunt: { label: "Tocá los participios de los tiempos compuestos", targets: ["trabalhado", "recebido", "estudado", "sonhado", "preparado", "feito", "estado", "chovido", "visto"] } },

    { id: "w-22", week: 22, n: 22, level: "B1", emoji: "⛰️", title: "O Cristo Redentor",
      grammar: "particípios e voz passiva",
      text:
        "O Cristo Redentor foi inaugurado em 12 de outubro de 1931, no alto do Corcovado, a uns 700 metros " +
        "de altura. O projeto foi desenvolvido pelo engenheiro brasileiro Heitor da Silva Costa, " +
        "e o rosto foi esculpido em Paris pelo escultor romeno Gheorghe Leonida, no ateliê do francês " +
        "Paul Landowski.\n\n" +
        "A estátua foi construída em concreto armado e coberta por milhares de triângulos de pedra-sabão. " +
        "Tem 30 metros de altura, sem contar o pedestal. Em 2007, foi eleita uma das Sete Maravilhas " +
        "do Mundo Moderno.\n\n" +
        "A Sofía subiu de trem pela floresta, mas, quando chegou lá em cima, o Cristo estava coberto " +
        "de nuvens. \"Vou voltar num dia de sol\", prometeu.",
      gloss: { rosto: "cara, rostro", esculpido: "esculpido", romeno: "rumano", ateliê: "taller",
               concreto: "hormigón", coberta: "cubierta", coberto: "cubierto", "pedra-sabão": "esteatita (piedra jabón)",
               eleita: "elegida", trem: "tren", nuvens: "nubes", prometeu: "prometió", desenvolvido: "desarrollado" },
      questions: [
        ["¿Cuándo se inauguró el Cristo?", ["en 1931", "en 1922", "en 2007", "en 1960"], "en 1931"],
        ["¿Dónde se esculpió el rostro?", ["en París", "en Río", "en Rumania", "en São Paulo"], "en París"],
        ["¿Por qué Sofía quiere volver?", ["el Cristo estaba cubierto de nubes", "el tren no funcionaba", "estaba cerrado", "no le gustó"], "el Cristo estaba cubierto de nubes"]
      ],
      vf: [["O Cristo foi inaugurado em 1931.", "verdadeiro"], ["O rosto foi esculpido no Rio.", "falso"], ["A Sofía subiu com a Bia.", "não se diz"]],
      hunt: { label: "Tocá los participios de la voz pasiva", targets: ["inaugurado", "desenvolvido", "esculpido", "construída", "coberta", "eleita"] } },

    { id: "w-23", week: 23, n: 23, level: "B1", emoji: "🥁", title: "Conselhos para a Pedra do Sal",
      grammar: "presente do subjuntivo",
      text:
        "A Sofía quer conhecer a roda de samba da Pedra do Sal, no bairro da Saúde, numa região " +
        "que os cariocas chamam de Pequena África. Ali perto do porto chegaram à cidade muitos " +
        "africanos escravizados, e ali nasceu uma parte da história do samba.\n\n" +
        "A Dona Lúcia tem conselhos: \"Espero que você vá de metrô e volte de táxi. É importante " +
        "que chegue cedo, porque a roda enche rápido. Não quero que leve muito dinheiro, e sugiro " +
        "que peça uma cerveja bem gelada.\"\n\n" +
        "A Bia ri: \"Tomara que não chova!\" E o João acrescenta: \"Talvez eu vá também. " +
        "Mas duvido que o samba termine antes das duas!\"",
      gloss: { chamam: "(chamar algo de…) llaman… a algo", escravizados: "esclavizados", nasceu: "nació", conselhos: "consejos", enche: "se llena",
               dinheiro: "plata, dinero", sugiro: "sugiero", gelada: "helada", tomara: "ojalá",
               acrescenta: "agrega", duvido: "dudo", porto: "puerto", talvez: "tal vez" },
      questions: [
        ["¿Qué quiere conocer Sofía?", ["la roda de samba de la Pedra do Sal", "el puerto", "el ensayo de una escuela de samba en la Zona Norte", "el Sambódromo"], "la roda de samba de la Pedra do Sal"],
        ["¿Por qué tiene que llegar temprano?", ["porque la ronda se llena rápido", "porque la ronda termina a las nueve", "porque llueve", "porque es gratis"], "porque la ronda se llena rápido"],
        ["¿Qué duda João?", ["que el samba termine antes de las dos", "que llueva", "que Sofía vaya", "que haya cerveza"], "que el samba termine antes de las dos"]
      ],
      vf: [["A Pedra do Sal fica no bairro da Saúde.", "verdadeiro"], ["A Dona Lúcia quer que a Sofía leve muito dinheiro.", "falso"], ["A Sofía vai com o seu Manuel.", "não se diz"]],
      hunt: { label: "Tocá los verbos en presente do subjuntivo", targets: ["vá", "volte", "chegue", "leve", "peça", "chova", "termine"] } },

    { id: "w-24", week: 24, n: 24, level: "B1", emoji: "🥾", title: "A trilha dos Dois Irmãos",
      grammar: "subjuntivo com conjunções",
      text:
        "A Sofía quer fazer a trilha do Morro Dois Irmãos, no Vidigal. O João vai com ela, " +
        "desde que saiam cedo, antes que o sol fique forte demais.\n\n" +
        "\"Leve muita água, para que não passe mal\", ele diz. \"E caso chova, a gente deixa para outro " +
        "dia, porque a pedra fica escorregadia.\"\n\n" +
        "Embora a trilha seja curta, a subida é íngreme. Um guia do Vidigal vai acompanhá-los, " +
        "sem que precisem pagar muito, e o dinheiro fica na comunidade. Lá de cima, a gente vê " +
        "toda a Zona Sul. \"Daqui eu não saio " +
        "antes que o sol se ponha!\", diz a Sofía.",
      gloss: { desde: "desde (desde que = siempre que)", demais: "demasiado", mal: "mal (passar mal = sentirse mal)",
               caso: "en caso de que", deixa: "deja", escorregadia: "resbaladiza", embora: "aunque",
               subida: "subida", íngreme: "empinada", guia: "guía", "acompanhá-los": "acompañarlos", daqui: "de acá" },
      questions: [
        ["¿Con qué condición va João?", ["que salgan temprano", "que llueva", "que vaya Bia", "que paguen mucho"], "que salgan temprano"],
        ["¿Qué pasa si llueve?", ["lo dejan para otro día", "van igual", "van en auto", "llaman a un guía"], "lo dejan para otro día"],
        ["¿Adónde va el dinero del guía?", ["queda en la comunidad", "a la ciudad", "a João", "a una empresa de turismo"], "queda en la comunidad"]
      ],
      vf: [["A trilha começa no Vidigal.", "verdadeiro"], ["A subida é fácil e plana.", "falso"], ["O guia se chama Marcos.", "não se diz"]],
      hunt: { label: "Tocá las conjunciones que piden subjuntivo (desde que, antes que, caso…)", targets: ["desde", "antes", "caso", "embora", "sem"] } },

    { id: "w-25", week: 25, n: 25, level: "B1", emoji: "🎶", title: "A garota de Ipanema",
      grammar: "pronomes relativos",
      text:
        "A rua onde fica o bar Garota de Ipanema se chama hoje Vinicius de Moraes, o poeta que escreveu " +
        "a letra da canção. A música, cuja melodia é de Tom Jobim, é de 1962.\n\n" +
        "Os dois amigos frequentavam o antigo bar Veloso e viam passar uma jovem a quem ninguém " +
        "resistia, e que ia à praia todos os dias. A moça, a qual mais tarde ficou famosa, " +
        "era a Helô Pinheiro, como ficou conhecida.\n\n" +
        "A Sofía, para quem a Bia contou tudo isso, quis ver o lugar em que tudo começou. " +
        "No bar, pediu um chope e cantou baixinho: \"Olha que coisa mais linda...\"",
      gloss: { letra: "letra (de una canción)", canção: "canción", cuja: "cuya", frequentavam: "frecuentaban",
               moça: "chica", "ninguém": "nadie", conhecida: "conocida", chope: "chopp (cerveza tirada)", baixinho: "bajito",
               quis: "quiso", resistia: "resistía" },
      questions: [
        ["¿Quién escribió la letra?", ["Vinicius de Moraes", "Tom Jobim", "Helô Pinheiro", "Sofía"], "Vinicius de Moraes"],
        ["¿De qué año es la canción?", ["de 1962", "de 1931", "de 1918", "de 1988"], "de 1962"],
        ["¿Qué pidió Sofía en el bar?", ["un chopp", "una caipirinha", "un café", "agua de coco"], "un chopp"]
      ],
      vf: [["A melodia é de Tom Jobim.", "verdadeiro"], ["A canção é de 1972.", "falso"], ["A Sofía foi ao bar com o João.", "não se diz"]],
      hunt: { label: "Tocá los pronombres relativos", targets: ["onde", "cuja", "quem", "qual"] } },

    { id: "w-26", week: 26, n: 26, level: "B1", emoji: "🌅", title: "Seis meses de Rio",
      grammar: "revisão B1",
      text:
        "Faz seis meses que a Sofía chegou ao Rio. Quando desembarcou, não entendia quase " +
        "nada e tinha vergonha de falar. Hoje pede café na padaria, discute futebol no boteco e até " +
        "conta piadas.\n\n" +
        "Muita coisa tem mudado: ela tem ido à praia antes do trabalho. " +
        "Não sente falta do inverno portenho, mas sente falta da família.\n\n" +
        "A empresa de Buenos Aires quer que ela volte em dezembro. A Sofía ainda não decidiu. " +
        "\"Eu gostaria de ficar mais um ano\", diz. \"Talvez eu consiga um trabalho aqui.\" " +
        "A Bia espera que ela fique. Hoje à noite, as duas irão " +
        "ao Arpoador. Quem sabe o pôr do sol ajude a decidir.",
      gloss: { até: "hasta, incluso", quem: "(quem sabe) quizás, a lo mejor", desembarcou: "desembarcó", quase: "casi", ainda: "todavía", vergonha: "vergüenza", piadas: "chistes", falta: "falta (sentir falta = extrañar)",
               inverno: "invierno", portenho: "porteño", consiga: "consiga", mudado: "cambiado", ajude: "ayude" },
      questions: [
        ["¿Qué le pasaba cuando llegó?", ["no entendía casi nada y le daba vergüenza hablar", "hablaba perfecto", "no quería salir de casa porque extrañaba Buenos Aires", "estaba enferma"], "no entendía casi nada y le daba vergüenza hablar"],
        ["¿Qué extraña Sofía?", ["a la familia", "el invierno porteño", "el trabajo", "el subte"], "a la familia"],
        ["¿Qué quiere la empresa?", ["que vuelva en diciembre", "que se quede en Río", "que trabaje más", "que viaje a São Paulo"], "que vuelva en diciembre"]
      ],
      vf: [["A Sofía já decidiu voltar.", "falso"], ["A Bia quer que a Sofía fique.", "verdadeiro"], ["A Sofía tem uma entrevista de emprego amanhã.", "não se diz"]],
      hunt: { label: "Tocá los verbos en subjuntivo", targets: ["volte", "consiga", "fique", "ajude"] } },

    // ------------------------------------------------ Estação 3 (B1 → B2)
    { id: "w-27", week: 27, n: 27, level: "B1", emoji: "👑", title: "A corte no Rio",
      grammar: "futuro do subjuntivo",
      text:
        "A Bia vai levar a Sofía a um passeio histórico pelo Centro. \"Quando você chegar à Praça XV, " +
        "vai ver o Paço Imperial\", explica. \"Ali funcionou o governo depois que a família real " +
        "portuguesa fugiu das tropas de Napoleão e desembarcou no Rio, em março de 1808.\"\n\n" +
        "Em poucos anos, a cidade mudou: ganhou o Jardim Botânico, a Imprensa Régia, o Banco do Brasil " +
        "e a Biblioteca Real. Em 1815, o Brasil foi elevado a Reino Unido com Portugal e Algarves, " +
        "e o Rio virou, na prática, a capital de um império.\n\n" +
        "\"Se você quiser, depois a gente vai ao Jardim Botânico, que Dom João criou em 1808. E se " +
        "sobrar tempo, passamos na Quinta da Boa Vista, onde a família real viveu.\" " +
        "\"Enquanto eu estiver no Rio, vou tropeçar na história a cada esquina\", diz a Sofía. " +
        "\"Assim que puder, volto sozinha, com um caderno.\"",
      gloss: { paço: "palacio", fugiu: "huyó", tropas: "tropas", imprensa: "imprenta", régia: "real",
               elevado: "elevado", reino: "reino", virou: "se volvió", império: "imperio", sobrar: "sobra",
               tropeçar: "tropezar", sozinha: "sola", quiser: "querés", estiver: "esté", puder: "pueda" },
      questions: [
        ["Por que a família real portuguesa veio para o Rio?", ["fugiu das tropas de Napoleão", "procurava ouro", "queria ver o carnaval", "foi convidada pelo imperador"], "fugiu das tropas de Napoleão"],
        ["O que aconteceu em 1815?", ["o Brasil passou a ser Reino Unido com Portugal", "o Brasil ficou independente", "o Rio foi fundado", "a escravidão foi abolida no Brasil e em Portugal"], "o Brasil passou a ser Reino Unido com Portugal"],
        ["O que dom João criou em 1808?", ["o Jardim Botânico", "a Quinta da Boa Vista", "o Paço Imperial", "o Cristo Redentor"], "o Jardim Botânico"]
      ],
      vf: [["A família real chegou ao Rio em 1808.", "verdadeiro"], ["O Jardim Botânico foi criado por Napoleão.", "falso"], ["A Bia já levou outros amigos à Praça XV.", "não se diz"]],
      hunt: { label: "Toque nos verbos no futuro do subjuntivo", targets: ["chegar", "quiser", "sobrar", "estiver", "puder"] } },

    { id: "w-28", week: 28, n: 28, level: "B2", emoji: "⛓️", title: "Se vocês pudessem voltar a 1888",
      grammar: "imperfeito do subjuntivo e orações condicionais",
      text:
        "Na aula da Bia, os alunos estudam a Abolição. O Brasil foi o último país das Américas a abolir " +
        "a escravidão: a Lei Áurea foi assinada pela Princesa Isabel em 13 de maio de 1888. Durante mais " +
        "de três séculos, entre quatro e cinco milhões de africanos foram trazidos à força para o Brasil.\n\n" +
        "A Bia pergunta: \"Se vocês pudessem viajar no tempo, o que fariam?\" Um aluno responde que iria " +
        "à Rua do Ouvidor para ver a festa. Outra diz que, se fosse jornalista, entrevistaria André " +
        "Rebouças ou José do Patrocínio, dois abolicionistas negros.\n\n" +
        "A Bia lembra que a festa não resolveu tudo: a lei não deu aos libertos nem terra, nem escola, " +
        "nem trabalho. \"E se hoje o país quisesse reparar essa dívida, por onde começaria?\", pergunta. " +
        "A turma fica em silêncio. Depois, todo mundo quer falar ao mesmo tempo.",
      gloss: { escravidão: "esclavitud", assinada: "firmada", séculos: "siglos", força: "fuerza (à força = por la fuerza)",
               pudessem: "pudieran", fariam: "harían", entrevistaria: "entrevistaría", libertos: "libertos (esclavos liberados)",
               terra: "tierra", quisesse: "quisiera", dívida: "deuda", turma: "clase, grupo de alumnos", abolir: "abolir" },
      questions: [
        ["Quem assinou a Lei Áurea?", ["a princesa Isabel", "dom Pedro I", "José do Patrocínio", "André Rebouças"], "a princesa Isabel"],
        ["O que um aluno faria se viajasse no tempo?", ["iria à Rua do Ouvidor ver a festa", "entrevistaria a princesa Isabel no palácio", "ficaria em casa", "viajaria para a África"], "iria à Rua do Ouvidor ver a festa"],
        ["Segundo a Bia, o que a lei não deu aos libertos?", ["terra, escola nem trabalho", "a liberdade", "um nome", "a cidadania portuguesa"], "terra, escola nem trabalho"]
      ],
      vf: [["A Lei Áurea é de 1888.", "verdadeiro"], ["O Brasil foi o primeiro país das Américas a abolir a escravidão.", "falso"], ["A turma da Bia tem trinta alunos.", "não se diz"]],
      hunt: { label: "Toque nos verbos das hipóteses (imperfeito do subjuntivo e futuro do pretérito)", targets: ["pudessem", "fariam", "iria", "fosse", "entrevistaria", "quisesse", "começaria"] } },

    { id: "w-29", week: 29, n: 29, level: "B2", emoji: "📚", title: "Paulo Freire e a leitura do mundo",
      grammar: "infinitivo pessoal",
      text:
        "Em 1963, na cidade de Angicos, no Rio Grande do Norte, o educador pernambucano Paulo Freire " +
        "coordenou uma experiência que ficou famosa: cerca de trezentos trabalhadores aprenderam a ler " +
        "e a escrever em umas quarenta horas de aula. O método partia de palavras da vida dos alunos, " +
        "como tijolo e salário, para eles discutirem a própria realidade antes de decorarem sílabas.\n\n" +
        "Para Freire, não bastava os adultos saberem juntar letras: era preciso lerem o mundo. " +
        "Numa frase conhecida, escreveu que a leitura do mundo precede a leitura da palavra.\n\n" +
        "Depois do golpe militar de 1964, foi preso e partiu para o exílio. No Chile, escreveu a " +
        "Pedagogia do Oprimido, hoje lida no mundo inteiro. A Bia usa as ideias dele na escola: pede " +
        "aos alunos para trazerem notícias do bairro e, antes de começarem a aula, conversarem sobre elas.",
      gloss: { pernambucano: "de Pernambuco", coordenou: "coordinó", tijolo: "ladrillo", discutirem: "discutan",
               decorarem: "memoricen", bastava: "alcanzaba", juntar: "juntar", preciso: "necesario (era preciso = hacía falta)",
               lerem: "lean", leitura: "lectura", golpe: "golpe", preso: "preso", exílio: "exilio",
               oprimido: "oprimido", trazerem: "traigan", começarem: "empiecen", conversarem: "charlen" },
      questions: [
        ["O que aconteceu em Angicos em 1963?", ["uns trezentos trabalhadores aprenderam a ler", "Freire nasceu lá", "foi fundada uma universidade para trabalhadores do campo", "houve um golpe militar"], "uns trezentos trabalhadores aprenderam a ler"],
        ["De onde partia o método?", ["de palavras da vida dos alunos", "das sílabas", "de livros europeus traduzidos para o português", "de canções"], "de palavras da vida dos alunos"],
        ["Onde ele escreveu Pedagogia do Oprimido?", ["no Chile", "em Angicos", "no Rio", "em Portugal"], "no Chile"]
      ],
      vf: [["Paulo Freire foi preso depois do golpe de 1964.", "verdadeiro"], ["O método começava pelas sílabas.", "falso"], ["A Bia conheceu Paulo Freire.", "não se diz"]],
      hunt: { label: "Toque nos infinitivos pessoais (com -em, -mos…)", targets: ["discutirem", "decorarem", "saberem", "lerem", "trazerem", "começarem", "conversarem"] } },

    { id: "w-30", week: 30, n: 30, level: "B2", emoji: "🗡️", title: "Independência ou morte?",
      grammar: "tempos compostos e hipótese no passado",
      text:
        "Em 7 de setembro de 1822, às margens do riacho Ipiranga, em São Paulo, Dom Pedro teria gritado " +
        "\"Independência ou morte!\". A cena ficou famosa no quadro de Pedro Américo, pintado em 1888, " +
        "décadas depois, e é bem mais heroica do que deve ter sido a realidade.\n\n" +
        "Os historiadores discutem o que teria acontecido se a corte não tivesse vindo para o Rio em 1808. " +
        "Talvez o Brasil tivesse se dividido em vários países, como a América espanhola. E se Dom João VI " +
        "não tivesse voltado a Portugal em 1821, deixando o filho aqui, a independência talvez tivesse " +
        "demorado mais.\n\n" +
        "A Sofía pensa na própria vida: \"Se eu não tivesse aceitado aquele trabalho remoto, nunca teria " +
        "vindo ao Rio.\" \"Espero que você não tenha se arrependido\", diz a Bia. \"Quando você tiver " +
        "terminado o curso, vai discutir tudo isso comigo em português.\"",
      gloss: { cena: "escena", margens: "orillas", riacho: "arroyo", gritado: "gritado", teria: "habría; «Dom Pedro teria gritado» = dicen que gritó: el condicional marca lo no comprobado (semana 48)", quadro: "cuadro", heroica: "heroica",
               acontecido: "pasado, sucedido", vindo: "venido", dividido: "dividido", filho: "hijo",
               demorado: "tardado", aceitado: "aceptado", arrependido: "arrepentido", comigo: "conmigo" },
      questions: [
        ["O que dom Pedro teria gritado?", ["«Independência ou morte!»", "«Viva Portugal!»", "«Fico!»", "«Abaixo o rei!»"], "«Independência ou morte!»"],
        ["Segundo alguns historiadores, o que teria acontecido sem a corte no Rio?", ["o Brasil talvez tivesse se dividido em vários países", "o Brasil seria maior", "não haveria carnaval", "o Rio ainda seria hoje a capital de todo o Portugal"], "o Brasil talvez tivesse se dividido em vários países"],
        ["O que teria acontecido se a Sofía não tivesse aceitado o trabalho remoto?", ["nunca teria vindo para o Rio", "moraria em São Paulo", "teria estudado história", "nada"], "nunca teria vindo para o Rio"]
      ],
      vf: [["O quadro de Pedro Américo foi pintado em 1888.", "verdadeiro"], ["Dom João VI ficou no Brasil até morrer.", "falso"], ["A Sofía se arrependeu de ter vindo ao Rio.", "não se diz"]],
      hunt: { label: "Toque nos auxiliares dos tempos compostos (teria, tivesse, tenha, tiver)", targets: ["teria", "tivesse", "tenha", "tiver"] } },

    { id: "w-31", week: 31, n: 31, level: "B2", emoji: "📓", title: "Quarto de despejo",
      grammar: "discurso indireto",
      text:
        "Em 1960 saiu Quarto de Despejo, o diário que Carolina Maria de Jesus, catadora de papel na " +
        "favela do Canindé, em São Paulo, escrevia em cadernos achados no lixo. O livro vendeu dezenas " +
        "de milhares de exemplares e foi traduzido para mais de dez línguas.\n\n" +
        "Na aula, a Bia pediu que os alunos lessem alguns trechos e contassem o que tinham entendido. " +
        "A Júlia disse que Carolina anotava o preço de tudo e que a fome aparecia em quase todas as " +
        "páginas. O Rafael comentou que ela chamava a favela de quarto de despejo da cidade, o lugar " +
        "onde se jogava o que ninguém queria ver.\n\n" +
        "Outro aluno perguntou se ela tinha ficado rica. A Bia respondeu que não, que o sucesso tinha " +
        "durado pouco e que Carolina tinha morrido pobre, em 1977. Contou também que, hoje, ela era " +
        "lida em escolas do país inteiro.",
      gloss: { despejo: "trastos (quarto de despejo = cuarto de los trastos)", catadora: "recolectora", favela: "villa miseria", achados: "encontrados",
               lixo: "basura", dezenas: "decenas", exemplares: "ejemplares", línguas: "idiomas", lessem: "leyeran",
               trechos: "fragmentos", contassem: "contaran", preço: "precio", fome: "hambre", jogava: "tiraba",
               sucesso: "éxito", rica: "rica" },
      questions: [
        ["Onde Carolina escrevia o diário?", ["em cadernos achados no lixo", "num computador", "no jornal da cidade, numa coluna", "em cartas"], "em cadernos achados no lixo"],
        ["Segundo o Rafael, como Carolina chamava a favela?", ["o quarto de despejo da cidade", "a casa dela", "o coração mais alegre da cidade de São Paulo", "um jardim"], "o quarto de despejo da cidade"],
        ["O que a Bia respondeu sobre o sucesso de Carolina?", ["que durou pouco e que ela morreu pobre", "que ela ficou rica", "que ela nunca publicou", "que ela foi para a Europa"], "que durou pouco e que ela morreu pobre"]
      ],
      vf: [["O livro foi traduzido para mais de dez línguas.", "verdadeiro"], ["Carolina morreu rica.", "falso"], ["A Júlia quer ser escritora.", "não se diz"]],
      hunt: { label: "Toque nos verbos que introduzem o que outra pessoa disse", targets: ["pediu", "disse", "comentou", "perguntou", "respondeu", "contou"] } },

    { id: "w-32", week: 32, n: 32, level: "B2", emoji: "🏛️", title: "A Era Vargas",
      grammar: "voz passiva sintética e sujeito indeterminado",
      text:
        "Em 1930, Getúlio Vargas chegou ao poder, e o Rio, então capital, viu mudanças enormes. " +
        "Criou-se o Ministério do Trabalho, instituiu-se o salário mínimo em 1940 e, em 1943, " +
        "reuniram-se as leis trabalhistas na CLT, que até hoje se discute no Congresso. Criaram-se também " +
        "a Companhia Siderúrgica Nacional e, em 1953, a Petrobras, depois da campanha \"O petróleo é nosso\".\n\n" +
        "Mas não se pode esquecer o outro lado: no Estado Novo, entre 1937 e 1945, fechou-se o Congresso, " +
        "censurava-se a imprensa e prendiam-se os opositores.\n\n" +
        "Dizem que Vargas ainda divide os brasileiros. Em 1954, no meio de uma grave crise política, ele " +
        "se matou no Palácio do Catete, hoje Museu da República. Na carta-testamento, escreveu: \"Saio da " +
        "vida para entrar na História.\" A Sofía passa pela porta do museu todos os dias, a caminho do metrô.",
      gloss: { mudanças: "cambios", mínimo: "mínimo", trabalhistas: "laborales", siderúrgica: "siderúrgica",
               esquecer: "olvidar", "fechou-se": "se cerró", "censurava-se": "se censuraba", imprensa: "prensa",
               "prendiam-se": "se encarcelaba a", opositores: "opositores", matou: "mató (se matou = se suicidó)",
               saio: "salgo", caminho: "camino" },
      questions: [
        ["O que foi criado em 1953?", ["a Petrobras", "o salário mínimo", "a CLT", "o Ministério do Trabalho"], "a Petrobras"],
        ["O que aconteceu durante o Estado Novo?", ["o Congresso foi fechado e a imprensa, censurada", "votou-se livremente", "Brasília foi fundada", "Vargas viveu no exílio e governou do Uruguai"], "o Congresso foi fechado e a imprensa, censurada"],
        ["O que é hoje o Palácio do Catete?", ["o Museu da República", "uma escola", "a casa da Sofía", "um ministério"], "o Museu da República"]
      ],
      vf: [["A CLT reuniu as leis trabalhistas em 1943.", "verdadeiro"], ["Vargas morreu no exílio.", "falso"], ["A Sofía já visitou o Museu da República.", "não se diz"]],
      hunt: { label: "Toque nos verbos da passiva com se (criou-se, fechou-se…)", targets: ["criou-se", "instituiu-se", "reuniram-se", "criaram-se", "fechou-se", "censurava-se", "prendiam-se"] } },

    { id: "w-33", week: 33, n: 33, level: "B2", emoji: "🪶", title: "O bruxo do Cosme Velho",
      grammar: "colocação pronominal na escrita",
      text:
        "Joaquim Maria Machado de Assis nasceu em 1839, no Morro do Livramento, no Rio de Janeiro, filho de um pintor de " +
        "paredes e de uma lavadeira dos Açores. Sem ter feito universidade, tornou-se o escritor mais " +
        "admirado do país e, em 1897, ajudou a fundar a Academia Brasileira de Letras, que o elegeu seu " +
        "primeiro presidente. Chamam-no de Bruxo do Cosme Velho, o bairro onde morou, por causa de um " +
        "poema de Carlos Drummond de Andrade.\n\n" +
        "Em Memórias Póstumas de Brás Cubas (1881), o narrador é um defunto que conta a própria vida. " +
        "Dedicou-a \"ao verme que primeiro roeu as frias carnes do meu cadáver\". Em Dom Casmurro (1899), " +
        "Bentinho nunca nos diz com certeza se Capitu o traiu: deixa-nos a dúvida.\n\n" +
        "A Sofía comprou os dois romances num sebo da Rua do Carmo e prometeu à Bia, rindo: " +
        "\"Lê-los-ei em português, sem tradução!\"",
      gloss: { pintor: "pintor", paredes: "paredes", lavadeira: "lavandera", "tornou-se": "se volvió",
               elegeu: "eligió", bruxo: "brujo", defunto: "difunto", verme: "gusano", roeu: "royó",
               frias: "frías", traiu: "traicionó", romances: "novelas", sebo: "librería de usados",
               "lê-los-ei": "los leeré", certeza: "certeza" },
      questions: [
        ["O que Machado de Assis fundou em 1897?", ["a Academia Brasileira de Letras", "a Universidade Federal do Rio de Janeiro", "um jornal", "um teatro"], "a Academia Brasileira de Letras"],
        ["Quem narra Memórias Póstumas de Brás Cubas?", ["um defunto", "Capitu", "um verme", "Machado quando criança"], "um defunto"],
        ["O que Bentinho deixa sem resposta?", ["se Capitu o traiu", "onde nasceu", "quem escreveu o livro", "quando morreu"], "se Capitu o traiu"]
      ],
      vf: [["Machado de Assis nasceu no Rio de Janeiro.", "verdadeiro"], ["Machado estudou numa universidade europeia.", "falso"], ["A Sofía pagou pouco pelos livros.", "não se diz"]],
      hunt: { label: "Toque nos pronomes presos ao verbo (ênclise e mesóclise)", targets: ["tornou-se", "chamam-no", "dedicou-a", "deixa-nos", "lê-los-ei"] } },

    { id: "w-34", week: 34, n: 34, level: "B2", emoji: "🏚️", title: "Casa-grande e senzala",
      grammar: "conectores e coesão",
      text:
        "Em 1933, o pernambucano Gilberto Freyre publicou Casa-Grande & Senzala, um dos livros mais " +
        "influentes sobre o Brasil. A casa-grande era a moradia do senhor de engenho; a senzala, o lugar " +
        "onde viviam os escravizados. Freyre valorizou a contribuição africana e indígena, o que, aliás, " +
        "era raro na época. Por isso, o livro foi recebido como uma revolução.\n\n" +
        "No entanto, a obra também idealizava a convivência entre senhores e escravizados, como se a " +
        "mistura tivesse suavizado a violência. A ideia de uma democracia racial, associada ao livro, foi " +
        "então duramente criticada. Nos anos 1950 e 1960, o sociólogo Florestan Fernandes, entre outros, " +
        "mostrou que o racismo continuava a organizar a sociedade, ou seja, que a abolição não tinha " +
        "trazido igualdade.\n\n" +
        "Contudo, poucos negam que Freyre mudou o modo como o Brasil se olha. Portanto, vale a pena " +
        "lê-lo, desde que se leiam também os seus críticos.",
      gloss: { moradia: "vivienda", engenho: "ingenio (azucarero)", senzala: "barracón de los esclavos",
               aliás: "por cierto", entanto: "sin embargo (no entanto)", convivência: "convivencia",
               suavizado: "suavizado", duramente: "duramente", igualdade: "igualdad", contudo: "sin embargo",
               negam: "niegan", pena: "pena (vale a pena = vale la pena)", "lê-lo": "leerlo", leiam: "lean" },
      questions: [
        ["O que era a senzala?", ["o lugar onde viviam os escravizados", "a casa-grande, onde morava o senhor de engenho", "o engenho", "uma igreja"], "o lugar onde viviam os escravizados"],
        ["O que se critica em Freyre?", ["que idealizava a convivência entre senhores e escravizados", "que ignorava os africanos e só falava dos portugueses", "que escrevia mal", "que não era brasileiro"], "que idealizava a convivência entre senhores e escravizados"],
        ["O que Florestan Fernandes mostrou?", ["que o racismo continuava organizando a sociedade", "que a abolição trouxe igualdade entre negros e brancos", "que Freyre tinha razão em tudo", "que não houve escravidão"], "que o racismo continuava organizando a sociedade"]
      ],
      vf: [["Casa-Grande & Senzala foi publicado em 1933.", "verdadeiro"], ["Florestan Fernandes defendeu a ideia de democracia racial.", "falso"], ["Freyre e Florestan eram amigos.", "não se diz"]],
      hunt: { label: "Toque nos conectores (aliás, no entanto, contudo, portanto…)", targets: ["aliás", "isso", "entanto", "então", "seja", "contudo", "portanto"] } },

    { id: "w-35", week: 35, n: 35, level: "B2", emoji: "❤️", title: "O homem cordial",
      grammar: "regência verbal",
      text:
        "Em Raízes do Brasil, de 1936, Sérgio Buarque de Holanda, pai do compositor Chico Buarque, " +
        "referiu-se ao brasileiro como \"homem cordial\". Muita gente confunde a expressão com gentileza, " +
        "mas o autor aludia à palavra latina cor, cordis, coração: o homem cordial age pelo coração, " +
        "não pela regra. A expressão, aliás, ele a tomou emprestada do escritor Ribeiro Couto.\n\n" +
        "Segundo Sérgio Buarque, o homem cordial prefere a intimidade à distância e resiste a obedecer " +
        "a normas impessoais. Na política, isso significa confundir o público com o privado: o chefe que " +
        "ajuda os amigos e esquece a lei.\n\n" +
        "Na semana passada, a Sofía assistiu a uma palestra sobre o livro no Instituto Moreira Salles, " +
        "na Gávea. Na volta, namorou a ideia de escrever sobre a Argentina: \"Será que nós também somos " +
        "cordiais?\" A Bia lembrou-se de um detalhe: o próprio autor avisou que cordialidade não quer " +
        "dizer bondade.",
      gloss: { raízes: "raíces", "referiu-se": "se refirió", gentileza: "amabilidad", aludia: "aludía",
               coração: "corazón", age: "actúa", regra: "regla", emprestada: "prestada (tomar emprestado = tomar prestado)",
               obedecer: "obedecer", chefe: "jefe", assistiu: "asistió (assistir a = ver, presenciar)",
               palestra: "charla, conferencia", namorou: "acarició (la idea)", avisou: "advirtió", bondade: "bondad" },
      questions: [
        ["De onde vem «cordial», segundo o autor?", ["do latim cor, cordis: coração", "do latim curtis: a corte, a cortesia", "de um sobrenome", "do português antigo"], "do latim cor, cordis: coração"],
        ["O que o homem cordial faz na política?", ["confunde o público com o privado", "obedece às normas", "respeita a distância entre o público e o privado", "não ajuda ninguém"], "confunde o público com o privado"],
        ["O que a Sofía fez na semana passada?", ["assistiu a uma palestra sobre o livro", "leu o livro inteiro numa tradução para o espanhol", "conheceu Chico Buarque", "escreveu sobre a Argentina"], "assistiu a uma palestra sobre o livro"]
      ],
      vf: [["Sérgio Buarque é o pai de Chico Buarque.", "verdadeiro"], ["Para o autor, cordial quer dizer bondoso.", "falso"], ["A palestra foi muito longa.", "não se diz"]],
      hunt: { label: "Toque nos verbos cuja regência é diferente do espanhol (assistir a, namorar…)", targets: ["referiu-se", "aludia", "prefere", "obedecer", "assistiu", "namorou", "lembrou-se"] } },

    { id: "w-36", week: 36, n: 36, level: "B2", emoji: "🎨", title: "Uma noite na Lapa",
      grammar: "crase",
      text:
        "Às sextas-feiras, a Lapa se transforma. A Sofía e o João chegaram à Rua Joaquim Silva às dez e, " +
        "antes de irem à roda de choro, subiram a Escadaria Selarón, que liga a Lapa a Santa Teresa. " +
        "O artista chileno Jorge Selarón começou a cobrir os degraus com azulejos em 1990 e, até sua morte, " +
        "em 2013, recebeu peças enviadas por visitantes de dezenas de países.\n\n" +
        "Logo abaixo ficam os Arcos da Lapa, o antigo aqueduto da Carioca, concluído no século XVIII. " +
        "Graças àquela obra, a água chegava às fontes do Centro. Hoje, sobre os arcos, passa o bonde " +
        "que vai a Santa Teresa.\n\n" +
        "No bar, pediram bolinhos de bacalhau à moda portuguesa e ouviram choro até as duas da manhã. " +
        "A Sofía, que antes errava a crase, agora a vê em toda parte: à esquerda, à direita, às vezes.",
      gloss: { crase: "acento grave (a + a = à)", fontes: "fuentes", choro: "choro (género musical)", escadaria: "escalinata", liga: "une", cobrir: "cubrir",
               degraus: "escalones", azulejos: "azulejos", peças: "piezas", abaixo: "abajo",
               aqueduto: "acueducto", concluído: "terminado", graças: "gracias (graças a = gracias a)",
               bolinhos: "croquetas", bacalhau: "bacalao", errava: "le erraba a", esquerda: "izquierda", direita: "derecha" },
      questions: [
        ["O que a Escadaria Selarón liga?", ["a Lapa a Santa Teresa", "o Centro a Botafogo", "duas praias", "duas igrejas"], "a Lapa a Santa Teresa"],
        ["O que eram os Arcos da Lapa?", ["um antigo aqueduto", "uma ponte para carros", "uma igreja", "um teatro"], "um antigo aqueduto"],
        ["O que eles comeram no bar?", ["bolinhos de bacalhau", "feijoada", "pizza", "pastel de carne e de queijo"], "bolinhos de bacalhau"]
      ],
      vf: [["Selarón era chileno.", "verdadeiro"], ["Os Arcos da Lapa são do século XX.", "falso"], ["O João toca na roda de choro.", "não se diz"]],
      hunt: { label: "Toque nas crases (à, às, àquela)", targets: ["às", "à", "àquela"] } },

    { id: "w-37", week: 37, n: 37, level: "B2", emoji: "✈️", title: "Brasília, a capital inventada",
      grammar: "verbos irregulares e derivados",
      text:
        "Em 1956, o presidente Juscelino Kubitschek propôs uma meta ousada: construir uma nova capital " +
        "no Planalto Central em menos de cinco anos. A ideia não era nova, pois a Constituição de 1891 " +
        "já previa a mudança, mas foi JK quem a manteve contra todas as críticas.\n\n" +
        "O urbanista Lúcio Costa venceu o concurso com o Plano Piloto, em forma de cruz, ou de avião, " +
        "e Oscar Niemeyer desenhou os palácios, a catedral e o Congresso. Milhares de trabalhadores, os " +
        "candangos, vieram de todo o país, sobretudo do Nordeste, e intervieram em cada etapa da obra.\n\n" +
        "Brasília foi inaugurada em 21 de abril de 1960, e o Rio perdeu o título de capital. Os cariocas, " +
        "meio de brincadeira, dizem que a cidade nunca deixou de ser a capital cultural do país. Quem " +
        "visita Brasília hoje obtém uma aula de arquitetura moderna ao ar livre: desde 1987, a cidade é " +
        "Patrimônio Mundial da Unesco.",
      gloss: { propôs: "propuso", meta: "meta", ousada: "audaz", planalto: "meseta", previa: "preveía",
               manteve: "mantuvo", venceu: "ganó", concurso: "concurso", candangos: "obreros que construyeron Brasilia",
               sobretudo: "sobre todo", intervieram: "intervinieron", etapa: "etapa", perdeu: "perdió",
               brincadeira: "broma", obtém: "obtiene", livre: "libre" },
      questions: [
        ["Quem propôs construir Brasília?", ["Juscelino Kubitschek", "Oscar Niemeyer", "Lúcio Costa", "Getúlio Vargas"], "Juscelino Kubitschek"],
        ["Que forma tem o Plano Piloto?", ["de cruz ou de avião", "de círculo", "de estrela de cinco pontas", "de quadrado"], "de cruz ou de avião"],
        ["O que os cariocas dizem, de brincadeira?", ["que o Rio continua sendo a capital cultural", "que Brasília é mais bonita", "que o Rio nunca foi de verdade a capital do Brasil", "que querem se mudar"], "que o Rio continua sendo a capital cultural"]
      ],
      vf: [["Brasília foi inaugurada em 1960.", "verdadeiro"], ["A ideia de mudar a capital nasceu com JK.", "falso"], ["A Sofía já visitou Brasília.", "não se diz"]],
      hunt: { label: "Toque nos derivados de pôr, ver, ter e vir (propôs, previa…)", targets: ["propôs", "previa", "manteve", "intervieram", "obtém"] } },

    { id: "w-38", week: 38, n: 38, level: "B2", emoji: "🍺", title: "Papo de boteco",
      grammar: "português falado do Brasil",
      text:
        "— Cê vai mesmo pra Ouro Preto no feriado?\n" +
        "— Vou, né. Tô doida pra conhecer. A Bia disse que é tipo voltar pro século XVIII.\n" +
        "— É mesmo. Na época do ouro, Vila Rica, que hoje é Ouro Preto, era uma das cidades mais ricas " +
        "da colônia. Tem igreja com ouro até no teto!\n" +
        "— E o Aleijadinho?\n" +
        "— Tá em tudo que é canto. Ele esculpiu doze profetas em pedra-sabão lá em Congonhas, pertinho.\n" +
        "— E o feriado é de quê mesmo?\n" +
        "— De Tiradentes, pô! Vinte e um de abril. O cara participou da Inconfidência Mineira, contra os " +
        "impostos de Portugal, e foi enforcado aqui no Rio, em 1792. Por isso o JK escolheu esse dia pra " +
        "inaugurar Brasília.\n" +
        "— Nossa, cadê meu caderno? Vou anotar tudo.\n" +
        "— Relaxa, tá tudo na internet. Pede mais um chope aí pra gente?",
      gloss: { "cê": "vos, usted (você, coloquial)", pra: "para (coloquial)", "né": "¿no?", "tô": "estoy (coloquial)",
               doida: "loca (tô doida pra = me muero por)", tipo: "como (muletilla: tipo)", pro: "para el (coloquial)",
               ouro: "oro", teto: "techo", canto: "rincón (em tudo que é canto = por todos lados)",
               profetas: "profetas", pertinho: "cerquita", escolheu: "eligió", "pô": "¡che! (muletilla)", impostos: "impuestos",
               enforcado: "ahorcado", "cadê": "¿dónde está?", relaxa: "tranqui" },
      questions: [
        ["Como Ouro Preto se chamava antes?", ["Vila Rica", "Congonhas", "Tiradentes", "Minas Gerais"], "Vila Rica"],
        ["O que o Aleijadinho esculpiu em Congonhas?", ["doze profetas em pedra-sabão", "uma igreja de ouro", "uma grande estátua de Tiradentes", "um Cristo"], "doze profetas em pedra-sabão"],
        ["O que aconteceu com Tiradentes?", ["foi enforcado no Rio em 1792", "foi presidente", "foi degredado para Angola em 1792", "fundou Brasília"], "foi enforcado no Rio em 1792"]
      ],
      vf: [["Tiradentes foi enforcado no Rio.", "verdadeiro"], ["O feriado de Tiradentes é em novembro.", "falso"], ["A Bia vai junto para Ouro Preto.", "não se diz"]],
      hunt: { label: "Toque nas formas do português falado (cê, pra, né, tô, tá…)", targets: ["cê", "pra", "né", "tô", "tipo", "pro", "tá", "pô", "cadê"] } },

    { id: "w-39", week: 39, n: 39, level: "B2", emoji: "🗳️", title: "Diretas Já",
      grammar: "revisão B2",
      text:
        "Em 10 de abril de 1984, cerca de um milhão de pessoas se reuniram diante da Igreja da Candelária, " +
        "no Centro do Rio, para pedir eleições diretas para presidente. O país vivia sob uma ditadura militar " +
        "desde o golpe de 1964, e havia duas décadas que os brasileiros não escolhiam o presidente pelo voto.\n\n" +
        "No palanque estavam políticos como Ulysses Guimarães e Leonel Brizola, então governador do Rio, " +
        "e artistas de todo o país. Mesmo assim, em 25 de abril, a emenda Dante de Oliveira não obteve os " +
        "votos necessários no Congresso. Se tivesse sido aprovada, o povo teria votado já em 1985. Em vez " +
        "disso, Tancredo Neves foi eleito de forma indireta, mas adoeceu na véspera da posse e morreu sem " +
        "assumir; quem governou foi José Sarney.\n\n" +
        "A Dona Lúcia estava lá. \"Quando vocês forem votar, lembrem-se daquela praça cheia\", diz aos jovens " +
        "do prédio. \"Para vocês votarem, muita gente arriscou tudo.\"",
      gloss: { diante: "delante (diante de = frente a)", eleições: "elecciones", ditadura: "dictadura",
               palanque: "tarima (de un acto político)", emenda: "enmienda", obteve: "obtuvo", aprovada: "aprobada",
               povo: "pueblo", adoeceu: "se enfermó", véspera: "víspera", posse: "asunción (del cargo)",
               arriscou: "arriesgó", "lembrem-se": "acuérdense" },
      questions: [
        ["O que se pedia na Candelária?", ["eleições diretas para presidente", "o fim do carnaval", "a volta do rei", "um estádio novo"], "eleições diretas para presidente"],
        ["O que aconteceu com a emenda Dante de Oliveira?", ["não obteve os votos necessários", "foi aprovada pelo Congresso em 1984", "foi assinada por Tancredo", "nunca foi votada"], "não obteve os votos necessários"],
        ["Quem acabou governando?", ["José Sarney", "Tancredo Neves", "Leonel Brizola", "Ulysses Guimarães"], "José Sarney"]
      ],
      vf: [["Tancredo Neves morreu antes de assumir.", "verdadeiro"], ["A emenda foi aprovada em 1984.", "falso"], ["A Dona Lúcia foi à Candelária com o marido.", "não se diz"]],
      hunt: { label: "Toque nas formas do B2: futuro do subjuntivo, infinitivo pessoal e tempos compostos", targets: ["tivesse", "teria", "forem", "votarem"] } },

    // ------------------------------------------------ Estação 4 (B2 → C1)
    { id: "w-40", week: 40, n: 40, level: "B2", emoji: "📜", title: "A Constituição Cidadã",
      grammar: "registro formal e nominalização",
      text:
        "Promulgada em 5 de outubro de 1988, a atual Constituição brasileira marcou o encerramento formal " +
        "do período autoritário. Na ocasião, o presidente da Assembleia Constituinte, Ulysses Guimarães, " +
        "chamou-a de \"Constituição Cidadã\".\n\n" +
        "Entre as inovações do texto, destacam-se a ampliação dos direitos sociais, a criação do Sistema " +
        "Único de Saúde (SUS), a definição do racismo como crime inafiançável e imprescritível, o " +
        "reconhecimento dos direitos dos povos indígenas às terras que tradicionalmente ocupam e a extensão " +
        "do voto facultativo aos jovens de 16 e 17 anos.\n\n" +
        "Há, contudo, quem aponte a extensão do próprio texto, com mais de duzentos artigos, como fonte de " +
        "dificuldades para a sua aplicação. A frequente aprovação de emendas constitucionais, que já passam " +
        "de cem, é outro dado relevante.\n\n" +
        "Na biblioteca da escola, a Bia afixou um trecho do artigo 5º: \"Todos são iguais perante a lei, " +
        "sem distinção de qualquer natureza.\"",
      gloss: { promulgada: "promulgada", encerramento: "cierre, fin", cidadã: "ciudadana", "destacam-se": "se destacan",
               ampliação: "ampliación", direitos: "derechos", inafiançável: "sin derecho a fianza",
               imprescritível: "imprescriptible", reconhecimento: "reconocimiento", povos: "pueblos",
               aponte: "señale", fonte: "fuente", afixou: "colgó, fijó", perante: "ante", qualquer: "cualquier" },
      questions: [
        ["Como Ulysses Guimarães chamou a Constituição?", ["«Constituição Cidadã»", "«Constituição do Povo»", "«Lei Áurea»", "«Carta Magna Indígena»"], "«Constituição Cidadã»"],
        ["Que sistema a Constituição criou?", ["o Sistema Único de Saúde", "o salário mínimo", "a CLT", "a Petrobras"], "o Sistema Único de Saúde"],
        ["O que se critica no texto?", ["a extensão", "que é muito curto", "que não tem direitos sociais", "que é de 1964"], "a extensão"]
      ],
      vf: [["O voto é facultativo aos 16 e 17 anos.", "verdadeiro"], ["A Constituição tem menos de cem artigos.", "falso"], ["Os alunos da Bia leram a Constituição inteira.", "não se diz"]],
      hunt: { label: "Toque nas nominalizações (substantivos em -ção, -mento, -são…)", targets: ["encerramento", "ocasião", "inovações", "ampliação", "criação", "definição", "reconhecimento", "extensão", "aplicação", "aprovação", "distinção"] } },

    { id: "w-41", week: 41, n: 41, level: "C1", emoji: "⭐", title: "Clarice no Leme",
      grammar: "pretérito mais-que-perfeito simples e narrativa",
      text:
        "Quando Clarice Lispector publicou A Hora da Estrela, em 1977, já se tornara uma lenda. Nascera em " +
        "1920 na Ucrânia, numa família judia que fugira da guerra e da perseguição, e chegara ao Brasil ainda " +
        "bebê. Crescera em Maceió e no Recife antes de se mudar para o Rio, onde passou os últimos anos, " +
        "no Leme.\n\n" +
        "No romance, o narrador, Rodrigo S. M., conta a história de Macabéa, uma moça alagoana que viera " +
        "para o Rio e que quase não percebia a própria existência. Datilógrafa, Macabéa comia cachorro-quente, " +
        "ouvia a Rádio Relógio e recortava anúncios de jornal.\n\n" +
        "Clarice morreu em dezembro de 1977, pouco depois de o livro sair, na véspera de completar 57 anos. " +
        "Hoje, no calçadão do Leme, uma estátua a mostra sentada com o seu cachorro, Ulisses. A Sofía " +
        "sentou-se ao lado dela e leu o primeiro capítulo, que já lera duas vezes em espanhol.",
      gloss: { tornara: "había vuelto (se tornara = se había vuelto)", lenda: "leyenda", nascera: "había nacido",
               judia: "judía", fugira: "había huido", perseguição: "persecución", chegara: "había llegado",
               crescera: "había crecido", mudar: "mudarse", romance: "novela", alagoana: "de Alagoas",
               viera: "había venido", percebia: "notaba", datilógrafa: "dactilógrafa", "cachorro-quente": "pancho",
               recortava: "recortaba", anúncios: "avisos", calçadão: "rambla, paseo costero", lera: "había leído" },
      questions: [
        ["Onde Clarice Lispector nasceu?", ["na Ucrânia", "no Recife", "no Rio", "em Alagoas"], "na Ucrânia"],
        ["Quem é Macabéa?", ["uma moça de Alagoas que veio para o Rio", "a mãe de Clarice", "uma jornalista", "a narradora do livro, uma jornalista"], "uma moça de Alagoas que veio para o Rio"],
        ["O que há hoje no calçadão do Leme?", ["uma estátua de Clarice com o cachorro dela", "uma biblioteca com os livros de Clarice", "um museu", "uma rádio"], "uma estátua de Clarice com o cachorro dela"]
      ],
      vf: [["Clarice morreu no mesmo ano em que publicou A Hora da Estrela.", "verdadeiro"], ["Macabéa era uma moça rica de Ipanema.", "falso"], ["A Sofía chorou ao ler o livro.", "não se diz"]],
      hunt: { label: "Toque nos verbos no pretérito mais-que-perfeito simples", targets: ["tornara", "nascera", "fugira", "chegara", "crescera", "viera", "lera"] } },

    { id: "w-42", week: 42, n: 42, level: "C1", emoji: "🎸", title: "Chega de Saudade",
      grammar: "orações reduzidas",
      text:
        "Lançada em 1958, a gravação de \"Chega de Saudade\" por João Gilberto é considerada o marco inicial " +
        "da bossa nova. Composta por Tom Jobim e Vinicius de Moraes, a canção já tinha sido gravada naquele " +
        "ano por Elizeth Cardoso, com o próprio João ao violão. Ouvindo aquela batida diferente, muitos jovens " +
        "de Copacabana e Ipanema decidiram aprender a tocar.\n\n" +
        "Cantando baixinho, quase falando, João mudou a maneira de cantar no Brasil. Passados poucos anos, " +
        "a bossa nova conquistou o mundo: o disco Getz/Gilberto, gravado nos Estados Unidos, ganhou o " +
        "Grammy de álbum do ano.\n\n" +
        "Ao passar pelo Beco das Garrafas, em Copacabana, a Sofía lembrou-se das histórias da Dona Lúcia " +
        "sobre as noites de música daquele lugar. Chegando em casa, pôs o disco para tocar e, fechados " +
        "os olhos, imaginou o Rio de 1958.",
      gloss: { lançada: "lanzada", gravação: "grabación", marco: "hito", composta: "compuesta", gravada: "grabada",
               batida: "rasgueo, ritmo", maneira: "manera", passados: "pasados", conquistou: "conquistó",
               beco: "callejón", garrafas: "botellas", fechados: "cerrados", saudade: "nostalgia" },
      questions: [
        ["O que é considerado o ponto de partida da bossa nova?", ["a gravação de «Chega de Saudade» por João Gilberto", "um disco de Elizeth Cardoso gravado em 1970 em São Paulo", "um show em Brasília", "um prêmio Grammy"], "a gravação de «Chega de Saudade» por João Gilberto"],
        ["Como João Gilberto cantava?", ["baixinho, quase falando", "aos gritos", "só em inglês", "sem violão"], "baixinho, quase falando"],
        ["O que a Sofía fez ao chegar em casa?", ["pôs o disco e fechou os olhos", "ligou para a dona Lúcia", "foi ao Beco das Garrafas ouvir música", "tocou violão"], "pôs o disco e fechou os olhos"]
      ],
      vf: [["Elizeth Cardoso gravou a canção com João Gilberto ao violão.", "verdadeiro"], ["O disco Getz/Gilberto foi gravado no Rio.", "falso"], ["A Dona Lúcia conheceu João Gilberto.", "não se diz"]],
      hunt: { label: "Toque nas formas das orações reduzidas (gerúndio, particípio, ao + infinitivo)", targets: ["lançada", "composta", "ouvindo", "cantando", "falando", "passados", "passar", "chegando", "fechados"] } },

    { id: "w-43", week: 43, n: 43, level: "C1", emoji: "🏛️", title: "Carta à Biblioteca Nacional",
      grammar: "correspondência formal",
      text:
        "Rio de Janeiro, 12 de maio.\n\n" +
        "Prezados Senhores,\n\n" +
        "Venho por meio desta solicitar autorização para consultar a primeira edição de Os Sertões, de " +
        "Euclides da Cunha, publicada em 1902, que integra o acervo de obras raras desta instituição.\n\n" +
        "Sou designer gráfica e desenvolvo, no âmbito de um curso de extensão universitária, uma pesquisa " +
        "sobre as capas das primeiras edições brasileiras. Interessa-me, em particular, o modo como foi " +
        "apresentada aos leitores uma obra que narra a destruição do arraial de Canudos, no sertão da Bahia, " +
        "pelo Exército, em 1897, e cuja frase \"O sertanejo é, antes de tudo, um forte\" se tornou célebre.\n\n" +
        "Informo que disponho de carta de apresentação da coordenação do curso, que segue em anexo. " +
        "Agradeceria se V. Sas. pudessem indicar-me os procedimentos necessários e as datas disponíveis.\n\n" +
        "Desde já, agradeço a atenção e fico no aguardo de uma resposta.\n\n" +
        "Atenciosamente,\n" +
        "Sofía Martínez",
      gloss: { prezados: "estimados", desta: "de esta (por meio desta = por la presente)", acervo: "fondo, colección",
               âmbito: "marco", pesquisa: "investigación", capas: "tapas", arraial: "caserío",
               sertão: "interior semiárido", sertanejo: "hombre del sertão", disponho: "dispongo",
               anexo: "adjunto", agradeceria: "agradecería", procedimentos: "trámites",
               aguardo: "espera (fico no aguardo = quedo a la espera)", atenciosamente: "atentamente", leitores: "lectores" },
      questions: [
        ["O que a Sofía pede na carta?", ["consultar a primeira edição de Os Sertões", "trabalhar na biblioteca durante o verão", "comprar um livro", "doar um livro"], "consultar a primeira edição de Os Sertões"],
        ["Sobre o que é a pesquisa dela?", ["as capas das primeiras edições brasileiras", "a guerra de Canudos", "Euclides da Cunha", "a história da biblioteca e dos seus leitores"], "as capas das primeiras edições brasileiras"],
        ["O que ela anexa?", ["uma carta de apresentação do curso", "o passaporte", "um livro", "nada"], "uma carta de apresentação do curso"]
      ],
      vf: [["Os Sertões foi publicado em 1902.", "verdadeiro"], ["Canudos fica no litoral do Rio.", "falso"], ["A biblioteca respondeu no dia seguinte.", "não se diz"]],
      hunt: { label: "Toque nas fórmulas da carta formal", targets: ["prezados", "venho", "solicitar", "informo", "segue", "agradeceria", "agradeço", "aguardo", "atenciosamente"] } },

    { id: "w-44", week: 44, n: 44, level: "C1", emoji: "🧬", title: "Darcy Ribeiro e o povo novo",
      grammar: "formação de palavras",
      text:
        "O antropólogo mineiro Darcy Ribeiro dedicou a vida a entender a formação do povo brasileiro. Em " +
        "O Povo Brasileiro (1995), descreve o encontro, e o desencontro, das matrizes indígena, europeia e " +
        "africana, que teria dado origem a um \"povo novo\". Para ele, a mestiçagem não foi uma convivência " +
        "pacífica, e sim um processo marcado pela violência, pela desigualdade e pelo desenraizamento.\n\n" +
        "Inquieto e inventivo, Darcy foi também político: ajudou a fundar a Universidade de Brasília e, " +
        "como vice-governador do Rio, idealizou com Niemeyer o Sambódromo, inaugurado em 1984, e os CIEPs, " +
        "escolas de horário integral apelidadas de \"Brizolões\", por causa do governador Leonel Brizola.\n\n" +
        "A Sofía anotou as palavras derivadas que encontrou no livro: brasilidade, mestiçagem, ninguendade. " +
        "\"Seu português tá ficando chiquérrimo\", brincou o João.",
      gloss: { antropólogo: "antropólogo", mineiro: "de Minas Gerais", desencontro: "desencuentro", matrizes: "matrices",
               mestiçagem: "mestizaje", desigualdade: "desigualdad", desenraizamento: "desarraigo",
               inquieto: "inquieto", inventivo: "ingenioso", idealizou: "ideó", apelidadas: "apodadas",
               "brizolões": "brizolones (aumentativo de Brizola)", brasilidade: "brasileñidad",
               ninguendade: "condición de no ser nadie (neologismo de Darcy)", "chiquérrimo": "elegantísimo (coloquial)",
               brincou: "bromeó", horário: "horario" },
      questions: [
        ["Que três matrizes Darcy Ribeiro descreve?", ["indígena, europeia e africana", "portuguesa, espanhola e italiana", "urbana, rural e indígena", "branca, negra e asiática"], "indígena, europeia e africana"],
        ["Como foi a mestiçagem para Darcy?", ["um processo marcado pela violência", "uma convivência pacífica entre os povos", "algo sem importância", "uma invenção de Freyre"], "um processo marcado pela violência"],
        ["O que ele idealizou com Niemeyer?", ["o Sambódromo e os CIEPs", "Brasília", "a Universidade de São Paulo", "o Cristo"], "o Sambódromo e os CIEPs"]
      ],
      vf: [["Darcy Ribeiro ajudou a fundar a Universidade de Brasília.", "verdadeiro"], ["Para Darcy, a mestiçagem foi pacífica.", "falso"], ["A Bia estudou num CIEP.", "não se diz"]],
      hunt: { label: "Toque nas palavras derivadas (prefixos, sufixos, aumentativos, superlativos)", targets: ["desencontro", "mestiçagem", "desigualdade", "desenraizamento", "inventivo", "sambódromo", "brizolões", "brasilidade", "ninguendade", "chiquérrimo"] } },

    { id: "w-45", week: 45, n: 45, level: "C1", emoji: "🌵", title: "Tupi or not tupi",
      grammar: "falsos amigos e heterossemânticos",
      text:
        "Em 1928, Oswald de Andrade publicou o Manifesto Antropófago, com uma frase que parece brincadeira: " +
        "\"Tupi, or not tupi, that is the question.\" A proposta pareceu esquisita a muitos leitores: assim " +
        "como alguns povos tupis comiam o inimigo num ritual para absorver a sua força, a cultura brasileira " +
        "deveria devorar a cultura estrangeira e transformá-la em algo próprio.\n\n" +
        "O manifesto nasceu de um presente: o quadro Abaporu, que Tarsila do Amaral, então mulher de Oswald, " +
        "lhe deu de aniversário. O nome vem do tupi e quer dizer, mais ou menos, \"homem que come gente\". " +
        "Hoje o quadro está no MALBA, em Buenos Aires, o que a Sofía adora contar aos amigos cariocas.\n\n" +
        "No escritório de casa, ela colou um cartaz com a frase de Oswald e uma lista de palavras " +
        "traiçoeiras: esquisito não é exquisito, apelido não é apellido, e polvo se come com arroz, " +
        "enquanto o pó se limpa da estante.",
      gloss: { antropófago: "antropófago", esquisito: "raro, extraño", inimigo: "enemigo", absorver: "absorber",
               estrangeira: "extranjera", "transformá-la": "transformarla", escritório: "oficina, estudio",
               colou: "pegó", cartaz: "cartel", traiçoeiras: "traicioneras", exquisito: "exquisito (en español; en portugués: delicioso)",
               apelido: "apodo", apellido: "apellido (en español; en portugués: sobrenome)", polvo: "pulpo",
               "pó": "polvo, tierra", estante: "estante", brincadeira: "broma" },
      questions: [
        ["O que o Manifesto Antropófago propunha?", ["devorar a cultura estrangeira e transformá-la", "rejeitar tudo o que é estrangeiro e voltar ao indígena", "voltar para Portugal", "falar só tupi"], "devorar a cultura estrangeira e transformá-la"],
        ["O que significa Abaporu?", ["homem que come gente", "sol do sertão", "mulher de Oswald", "cacto gigante"], "homem que come gente"],
        ["Onde está hoje o quadro?", ["no MALBA, em Buenos Aires", "no MASP, na cidade de São Paulo", "no Rio", "em Paris"], "no MALBA, em Buenos Aires"]
      ],
      vf: [["O Abaporu foi um presente de aniversário.", "verdadeiro"], ["Em português, apelido quer dizer sobrenome.", "falso"], ["Oswald e Tarsila se conheceram em Paris.", "não se diz"]],
      hunt: { label: "Toque nos falsos amigos (palavras que em espanhol significam outra coisa)", targets: ["brincadeira", "esquisito", "escritório", "apelido", "polvo"] } },

    { id: "w-46", week: 46, n: 46, level: "C1", emoji: "🎩", title: "O poeta é um fingidor",
      grammar: "variação: Brasil, Portugal e África",
      text:
        "O seu Manuel emprestou à Sofía um livro de Fernando Pessoa numa edição de Lisboa. Pessoa " +
        "(1888-1935) inventou dezenas de heterónimos, assim, com acento agudo, na grafia de Portugal: " +
        "poetas com biografia, estilo e filosofia próprios. Alberto Caeiro é o mestre que só acredita no " +
        "que vê; Ricardo Reis, o clássico; Álvaro de Campos, o engenheiro moderno e angustiado.\n\n" +
        "A Sofía estranhou algumas coisas no prefácio: \"estou a ler\" em vez de \"estou lendo\", \"o " +
        "autocarro\" em vez de \"o ônibus\", e os pronomes depois do verbo: \"disse-lhe\", \"conheci-o\". " +
        "\"Em Portugal fala-se assim\", explicou o seu Manuel, \"e em Angola e em Moçambique há ainda " +
        "outras palavras.\" O moçambicano Mia Couto, por exemplo, é famoso por inventar palavras novas.\n\n" +
        "No boteco, ela leu em voz alta o começo de \"Autopsicografia\": \"O poeta é um fingidor. / Finge " +
        "tão completamente / Que chega a fingir que é dor / A dor que deveras sente.\"",
      gloss: { emprestou: "prestó", "heterónimos": "heterónimos (en Brasil: heterônimos)", agudo: "agudo",
               grafia: "ortografía", mestre: "maestro", angustiado: "angustiado", estranhou: "le extrañó",
               prefácio: "prólogo", autocarro: "colectivo (en Portugal)", "disse-lhe": "le dijo", "conheci-o": "lo conocí",
               moçambicano: "mozambiqueño", fingidor: "fingidor", finge: "finge", dor: "dolor", deveras: "de verdad",
               começo: "comienzo", sente: "siente" },
      questions: [
        ["O que são os heterônimos de Pessoa?", ["poetas inventados, com vida e estilo próprios", "pseudônimos que ele usava para assinar nos jornais", "os irmãos dele", "os livros dele"], "poetas inventados, com vida e estilo próprios"],
        ["O que chamou a atenção da Sofía no prefácio?", ["formas do português de Portugal", "erros de impressão", "palavras em espanhol", "que não tinha pronomes"], "formas do português de Portugal"],
        ["Por que Mia Couto é famoso?", ["por inventar palavras novas", "por ser português", "por traduzir Pessoa para o inglês", "por morar no Rio"], "por inventar palavras novas"]
      ],
      vf: [["Em Portugal se diz \"autocarro\" para ônibus.", "verdadeiro"], ["Álvaro de Campos é o poeta clássico.", "falso"], ["O seu Manuel conheceu Mia Couto.", "não se diz"]],
      hunt: { label: "Toque nas formas típicas de Portugal", targets: ["heterónimos", "autocarro", "disse-lhe", "conheci-o"] } },

    { id: "w-47", week: 47, n: 47, level: "C1", emoji: "⚖️", title: "O jeitinho: virtude ou vício?",
      grammar: "argumentação e modalização",
      text:
        "Poucos temas geram tanto debate no Brasil quanto o jeitinho, a arte de encontrar uma saída para " +
        "contornar uma regra. Em primeiro lugar, convém lembrar que a expressão é ambígua: tudo indica que, " +
        "para muitos, o jeitinho é criatividade diante de uma burocracia absurda; para outros, é o primeiro " +
        "passo para a corrupção.\n\n" +
        "O antropólogo Roberto DaMatta, em Carnavais, Malandros e Heróis (1979), analisou o ritual do " +
        "\"Você sabe com quem está falando?\", uma pergunta que transforma uma pessoa comum em alguém " +
        "acima da regra. Segundo ele, o país oscila entre a igualdade da lei e a hierarquia das relações " +
        "pessoais.\n\n" +
        "Ainda que o jeitinho resolva pequenos problemas do dia a dia, é possível que reforce desigualdades " +
        "maiores. Por mais que se admire a flexibilidade carioca, seria ingênuo ignorar quem nunca consegue " +
        "dar um jeito. Em suma, talvez a pergunta não seja se o jeitinho é bom ou ruim, mas para quem ele " +
        "funciona.",
      gloss: { geram: "generan", jeitinho: "viveza para sortear reglas", contornar: "sortear, eludir", convém: "conviene",
               passo: "paso", malandros: "pícaros", diante: "frente a", ruim: "malo", consegue: "logra", acima: "por encima", oscila: "oscila", resolva: "resuelva",
               reforce: "refuerce", ingênuo: "ingenuo", jeito: "manera (dar um jeito = arreglárselas)",
               suma: "suma (em suma = en resumen)" },
      questions: [
        ["O que é o jeitinho, segundo o texto?", ["a arte de encontrar uma saída para contornar uma regra", "uma dança carioca", "uma lei", "um tipo de burocracia que obriga a cumprir cada regra ao pé da letra"], "a arte de encontrar uma saída para contornar uma regra"],
        ["O que DaMatta analisou?", ["o ritual do «Você sabe com quem está falando?»", "o carnaval de Salvador", "a Constituição de 1988 e os direitos que ela garante", "o futebol"], "o ritual do «Você sabe com quem está falando?»"],
        ["Que pergunta o final propõe?", ["para quem o jeitinho funciona", "se o jeitinho existe também fora do Brasil", "quando ele nasceu", "quem o inventou"], "para quem o jeitinho funciona"]
      ],
      vf: [["Segundo DaMatta, o país oscila entre a lei e as relações pessoais.", "verdadeiro"], ["O texto afirma que o jeitinho é sempre corrupção.", "falso"], ["DaMatta é carioca.", "não se diz"]],
      hunt: { label: "Toque nas palavras que atenuam (convém, tudo indica, ainda que, é possível, talvez)", targets: ["convém", "indica", "ainda", "possível", "talvez"] } },

    { id: "w-48", week: 48, n: 48, level: "C1", emoji: "🧐", title: "As ideias fora do lugar",
      grammar: "resumo e reformulação",
      text:
        "No ensaio \"As ideias fora do lugar\", publicado em 1973 e depois incluído em Ao Vencedor as Batatas " +
        "(1977), o crítico Roberto Schwarz parte de uma contradição do Brasil do século XIX: o país importava " +
        "o liberalismo europeu, que defendia a liberdade e o trabalho livre, mas a sua economia se apoiava " +
        "na escravidão.\n\n" +
        "Segundo o autor, entre o senhor e o escravizado havia um terceiro grupo, o dos homens livres e " +
        "pobres, que dependiam do favor dos poderosos para sobreviver. Em outras palavras, era o favor, e não " +
        "o direito, que organizava a vida social. Schwarz sustenta que as ideias liberais funcionavam como " +
        "ornamento: eram repetidas nos discursos, mas desmentidas na prática. O crítico ressalta ainda que " +
        "essa tensão aparece com precisão nos romances de Machado de Assis.\n\n" +
        "Na aula, a Bia pediu um resumo de cinco linhas, sem opinião. A Sofía começou assim: \"De acordo com " +
        "Schwarz, no Brasil do século XIX...\"",
      gloss: { ensaio: "ensayo", vencedor: "vencedor", batatas: "papas", apoiava: "apoyaba", terceiro: "tercer",
               favor: "favor", poderosos: "poderosos", sobreviver: "sobrevivir", sustenta: "sostiene",
               ornamento: "adorno", desmentidas: "desmentidas", ressalta: "destaca", linhas: "líneas",
               acordo: "acuerdo (de acordo com = según)" },
      questions: [
        ["Qual é a contradição que Schwarz aponta?", ["liberalismo importado numa economia escravista", "uma monarquia europeia num país que já era republicano", "catolicismo e ateísmo", "campo e cidade"], "liberalismo importado numa economia escravista"],
        ["De que dependiam os homens livres e pobres?", ["do favor dos poderosos", "do salário", "da lei", "do Estado"], "do favor dos poderosos"],
        ["Como deve ser o resumo que a Bia pede?", ["de cinco linhas, sem opinião", "longo, de uma página, com opinião", "em espanhol", "sobre Machado"], "de cinco linhas, sem opinião"]
      ],
      vf: [["Para Schwarz, as ideias liberais funcionavam como ornamento.", "verdadeiro"], ["O ensaio foi publicado em 1990.", "falso"], ["A Sofía tirou nota dez no resumo.", "não se diz"]],
      hunt: { label: "Toque no que atribui e reformula (segundo, sustenta, ressalta, em outras palavras…)", targets: ["segundo", "outras", "sustenta", "ressalta", "acordo"] } },

    { id: "w-49", week: 49, n: 49, level: "C1", emoji: "🌹", title: "Grândola, Vila Morena",
      grammar: "registro culto e coloquial",
      text:
        "Pouco depois da meia-noite de 25 de abril de 1974, a Rádio Renascença tocou \"Grândola, Vila Morena\", " +
        "de Zeca Afonso. Era o sinal combinado para que os capitães do Movimento das Forças Armadas saíssem " +
        "dos quartéis. No fim do dia, caía o regime do Estado Novo, criado por Salazar e mantido desde 1968 " +
        "por Marcelo Caetano. Uma mulher, Celeste Caeiro, distribuiu cravos aos soldados, que os puseram nos " +
        "canos das espingardas: daí o nome Revolução dos Cravos. Pouco depois, começou a independência de " +
        "Angola, Moçambique, Guiné-Bissau, Cabo Verde e São Tomé e Príncipe.\n\n" +
        "À noite, o João mandou um áudio: \"Cara, cê viu o vídeo do seu Manuel cantando Grândola? O homem " +
        "chorou, mano. Ele tava lá em Lisboa em 74!\"\n\n" +
        "A Sofía respondeu, caprichando: \"Vi, sim. Emocionou-me profundamente. O seu Manuel estava em Lisboa " +
        "em 1974 e presenciou os acontecimentos.\"",
      gloss: { sinal: "señal", combinado: "acordado", capitães: "capitanes", saíssem: "salieran", quartéis: "cuarteles",
               caía: "caía", cravos: "claveles", puseram: "pusieron", canos: "caños", espingardas: "fusiles",
               "daí": "de ahí", cara: "che (vocativo coloquial)", mano: "hermano (vocativo coloquial)",
               tava: "estaba (coloquial)", caprichando: "esmerándose", "emocionou-me": "me emocionó",
               presenciou: "presenció", acontecimentos: "sucesos", chorou: "lloró" },
      questions: [
        ["O que era «Grândola, Vila Morena» naquela noite?", ["o sinal para os capitães saírem", "o hino de Portugal", "uma canção proibida pelo MFA no rádio", "a música do carnaval"], "o sinal para os capitães saírem"],
        ["Por que se chama Revolução dos Cravos?", ["os soldados puseram cravos nos fuzis", "era primavera", "Salazar adorava cravos", "a rádio deu flores a quem saiu à rua"], "os soldados puseram cravos nos fuzis"],
        ["Como a Sofía responde ao áudio do João?", ["em registro formal", "com um áudio", "em espanhol", "não responde"], "em registro formal"]
      ],
      vf: [["O seu Manuel estava em Lisboa em 1974.", "verdadeiro"], ["Salazar ainda governava em 1974.", "falso"], ["O seu Manuel era soldado.", "não se diz"]],
      hunt: { label: "Toque nas marcas do registro coloquial no áudio do João", targets: ["cara", "cê", "mano", "tava"] } },

    { id: "w-50", week: 50, n: 50, level: "C1", emoji: "🌊", title: "Lisboa, 1755",
      grammar: "colocações e expressões idiomáticas",
      text:
        "Na manhã de 1º de novembro de 1755, Dia de Todos os Santos, um terremoto seguido de um maremoto e de " +
        "incêndios destruiu boa parte de Lisboa. Morreram dezenas de milhares de pessoas.\n\n" +
        "O futuro Marquês de Pombal, ministro de D. José I, assumiu as rédeas da situação e tomou providências " +
        "rápidas. Atribui-se a ele a frase \"Enterrar os mortos e cuidar dos vivos\", mas a autoria é duvidosa: " +
        "há quem a atribua a outro nobre. Seja como for, Pombal levou a sério a reconstrução: a Baixa foi " +
        "redesenhada com ruas retas e prédios com uma estrutura de madeira, a gaiola pombalina, pensada " +
        "para resistir aos tremores.\n\n" +
        "Na Europa, a tragédia deu o que falar: Voltaire escreveu um poema sobre o desastre e zombou do " +
        "otimismo filosófico em Cândido.\n\n" +
        "O seu Manuel resume: \"Lisboa deu a volta por cima. Como diz o ditado, depois da tempestade vem " +
        "a bonança.\"",
      gloss: { rédeas: "riendas", providências: "medidas", volta: "(deu a volta por cima) se recuperó, salió adelante", "atribui-se": "se atribuye", enterrar: "enterrar",
               autoria: "autoría", duvidosa: "dudosa", nobre: "noble", sério: "serio (levar a sério = tomar en serio)",
               retas: "rectas", madeira: "madera", gaiola: "jaula", pombalina: "de Pombal", tremores: "temblores", zombou: "se burló",
               otimismo: "optimismo", ditado: "refrán", bonança: "calma" },
      questions: [
        ["O que destruiu Lisboa em 1755?", ["um terremoto, um maremoto e incêndios", "uma guerra", "uma cheia do Tejo e uma epidemia", "uma epidemia"], "um terremoto, um maremoto e incêndios"],
        ["O que se sabe da frase atribuída a Pombal?", ["que a autoria é duvidosa", "que foi o rei que a disse", "que é de Voltaire", "que está na Constituição"], "que a autoria é duvidosa"],
        ["O que era a gaiola pombalina?", ["uma estrutura de madeira contra os tremores", "uma prisão", "uma praça aberta para fugir dos tremores", "um navio"], "uma estrutura de madeira contra os tremores"]
      ],
      vf: [["O terremoto aconteceu no Dia de Todos os Santos.", "verdadeiro"], ["Está provado que Pombal disse a frase.", "falso"], ["O seu Manuel já visitou a Baixa de Lisboa.", "não se diz"]],
      hunt: { label: "Toque nas palavras das colocações e expressões (assumir as rédeas, tomar providências…)", targets: ["rédeas", "providências", "sério", "falar", "volta", "bonança"] } },

    { id: "w-51", week: 51, n: 51, level: "C1", emoji: "✊🏿", title: "Palmares e a Consciência Negra",
      grammar: "revisão B2-C1",
      text:
        "Na Serra da Barriga, em Alagoas, formou-se no século XVII o Quilombo dos Palmares, a maior comunidade " +
        "de pessoas fugidas da escravidão na América portuguesa. Chegou a reunir milhares de habitantes e " +
        "resistiu durante quase um século a sucessivas expedições. Seu último líder, Zumbi, foi morto em 20 de " +
        "novembro de 1695.\n\n" +
        "Desde 2024, essa data, o Dia Nacional de Zumbi e da Consciência Negra, é feriado em todo o país. " +
        "A intelectual Lélia Gonzalez, que tem sido cada vez mais lida nas universidades, propôs o conceito " +
        "de amefricanidade para pensar as culturas negras das Américas.\n\n" +
        "Na escola, a Bia lançou um projeto: \"Quando vocês forem à Serra da Barriga, quero que tragam fotos " +
        "para a gente montar uma exposição. Se eu pudesse, iria com vocês.\" Os alunos pediram para fazerem " +
        "a viagem em novembro, a tempo de estarem lá no dia 20. \"Se tivéssemos começado antes, teríamos " +
        "conseguido verba\", lamentou a Bia.",
      gloss: { serra: "sierra", quilombo: "comunidad de esclavos fugados", fugidas: "fugadas", sucessivas: "sucesivas",
               morto: "muerto", consciência: "conciencia", intelectual: "intelectual",
               amefricanidade: "amefricanidad (concepto de Lélia Gonzalez)", lançou: "lanzó", tragam: "traigan",
               montar: "armar", verba: "fondos", lamentou: "lamentó", chegou: "llegó" },
      questions: [
        ["O que era Palmares?", ["a maior comunidade de fugidos da escravidão", "um engenho de açúcar", "uma cidade portuguesa", "um porto"], "a maior comunidade de fugidos da escravidão"],
        ["Por que o 20 de novembro é feriado?", ["é o dia de Zumbi e da Consciência Negra", "é o dia da Abolição, a Lei Áurea de 1888", "é o dia de Tiradentes", "é a Independência"], "é o dia de Zumbi e da Consciência Negra"],
        ["Do que a Bia se arrepende?", ["de não ter começado antes a buscar recursos", "de não ir à viagem", "de os alunos não quererem ir à viagem a Alagoas", "de chover em novembro"], "de não ter começado antes a buscar recursos"]
      ],
      vf: [["Zumbi foi morto em 1695.", "verdadeiro"], ["Palmares resistiu apenas dez anos.", "falso"], ["Lélia Gonzalez nasceu em Minas Gerais.", "não se diz"]],
      hunt: { label: "Toque nas formas que mais custam: futuro do subjuntivo, infinitivo pessoal, tempos compostos…", targets: ["forem", "tragam", "pudesse", "iria", "fazerem", "estarem", "tivéssemos", "teríamos", "sido"] } },

    { id: "w-52", week: 52, n: 52, level: "C1", emoji: "🎓", title: "O mar da nossa língua",
      grammar: "exame final: todo o ano",
      text:
        "No dia do exame, a Sofía chegou cedo ao campus da universidade, na Ilha do Fundão, com o documento " +
        "na mão e o coração acelerado. Na prova escrita, pediram-lhe um texto sobre o mar na cultura de " +
        "língua portuguesa. Ela respirou fundo e escreveu:\n\n" +
        "\"Poucas línguas devem tanto ao mar quanto a nossa. Em 1572, Camões publicou Os Lusíadas, epopeia " +
        "da viagem de Vasco da Gama à Índia, em que o gigante Adamastor encarna os perigos do cabo das " +
        "Tormentas. Em 1654, em São Luís do Maranhão, o Padre Antônio Vieira pregou o Sermão de Santo " +
        "Antônio aos Peixes, criticando os colonos por meio dos peixes. E Fernando Pessoa escreveu, em " +
        "Mensagem: 'Ó mar salgado, quanto do teu sal / São lágrimas de Portugal!'\"\n\n" +
        "Semanas depois, chegou o resultado do Celpe-Bras: Avançado Superior. A Sofía foi ao Arpoador e, " +
        "quando o sol se pôs atrás do Dois Irmãos, aplaudiu mais alto do que todo mundo.",
      gloss: { campus: "campus", ilha: "isla", mão: "mano", coração: "corazón", acelerado: "acelerado",
               prova: "prueba", "pediram-lhe": "le pidieron", respirou: "respiró", devem: "deben",
               epopeia: "epopeya", encarna: "encarna", perigos: "peligros", tormentas: "tormentas",
               pregou: "predicó", sermão: "sermón", colonos: "colonos", salgado: "salado", "lágrimas": "lágrimas",
               aplaudiu: "aplaudió" },
      questions: [
        ["Sobre que tema a Sofía escreveu?", ["o mar na cultura de língua portuguesa", "a bossa nova", "a história do Rio", "o ano dela no Brasil e tudo o que aprendeu lá"], "o mar na cultura de língua portuguesa"],
        ["Quem Vieira critica por meio dos peixes?", ["os colonos", "os portugueses de Lisboa", "os pescadores", "os poetas"], "os colonos"],
        ["O que a Sofía fez ao saber o resultado?", ["foi ao Arpoador e aplaudiu o pôr do sol", "voltou para Buenos Aires", "deu uma festa na Lapa com os amigos", "ligou para a mãe"], "foi ao Arpoador e aplaudiu o pôr do sol"]
      ],
      vf: [["Os Lusíadas foram publicados em 1572.", "verdadeiro"], ["Vieira pregou o sermão em Lisboa.", "falso"], ["A Bia foi ao Arpoador com a Sofía.", "não se diz"]],
      hunt: { label: "Toque nos verbos no pretérito perfeito", targets: ["chegou", "pediram-lhe", "respirou", "escreveu", "publicou", "pregou", "foi", "pôs", "aplaudiu"] } }
  ];

  // «Verdadeiro, falso ou não se diz?»: comprensión en portugués, como en el
  // Celpe-Bras.  Las respuestas de vf son "verdadeiro", "falso" o "não se diz".
  var VF_OPTIONS = ["verdadeiro", "falso", "não se diz"];
  var api = { TESTI: TESTI, VF_OPTIONS: VF_OPTIONS };
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.LettureSettimana = api;
})(typeof window !== "undefined" ? window : globalThis);
