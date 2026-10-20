/*
 * Las lecturas: «Martín no Rio», una historia por capítulos graduada de A1 a
 * B2; «Cultura», textos de historia, música, literatura, sociología y
 * política de Brasil, de Portugal y de la lusofonía (B1-C1); y «Enchentes»,
 * textos que repiten una estructura que el español no tiene o usa distinto.
 *
 * Input comprensible (Krashen 1985): textos apenas por encima del nivel, con
 * las palabras menos frecuentes glosadas para que la cobertura quede cerca
 * del 98 % que hace falta para entender sin esfuerzo (Hu & Nation 2000).
 * Cada capítulo usa la gramática de ese punto del curso (tools/pt/curriculo.py,
 * TENSE_WEEK: nada antes de su teoría) y termina con una «caza» de formas:
 * notar la forma dentro de un texto que ya entendiste (Schmidt 1990).  La
 * historia sigue: las ganas de saber cómo termina son motivación.
 *
 * Variedad: portugués de Brasil, norma urbana culta; lo coloquial (a gente,
 * vi ele, me liga) aparece en los diálogos, como en la vida.  En los textos
 * sobre Portugal y África el texto sigue en PB; las citas en portugués
 * europeo se marcan.  Datos y citas verificables: donde una frase famosa es
 * apócrifa, el texto lo dice.
 *
 * Cada texto: text, gloss {palabra: significado}, questions de comprensión
 * (sobre el sentido; en castellano hasta la semana 26 y en portugués desde la
 * 27, como en el Celpe-Bras; la consigna de la caza también), vf opcional
 * (verdadeiro / falso / não se diz) y hunt {label, targets}, donde targets
 * son las palabras exactas (en minúscula) que hay que encontrar en el texto.
 *
 * Solo los datos (los textos, las series, las opciones del verdadeiro /
 * falso y de la caza): la lógica está en el núcleo, docs/js/letture.js, que
 * lee window.LETTURE_DATA y suma los textos de «A semana»
 * (letture_settimana.js).  La capa de frecuencia está en freq_data.js.
 */
(function (root) {
  "use strict";

  var EPISODI = [
    { id: "ep1", week: 1, n: 1, level: "A1", emoji: "🧳", title: "Chegada ao Rio",
      grammar: "ser, estar e ter",
      // Semana 1: solo ser, estar, ter y palabras que se adivinan
      // (argentino, grande, pequeno).  Oraciones cortas, una idea cada una.
      text:
        "Oi! Eu sou o Martín. Sou argentino, de Buenos Aires, e tenho 32 anos. " +
        "Hoje estou no Rio de Janeiro!\n\n" +
        "O Rio é lindo. Tenho uma mala grande e uma mochila pequena. O apartamento é em " +
        "Santa Teresa, um bairro antigo, no alto de um morro. É pequeno, mas é bonito. Da " +
        "janela, a vista é incrível: o mar, as montanhas e o Pão de Açúcar.\n\n" +
        "A Bia é a minha colega de apartamento. Ela é carioca e tem 28 anos. É muito " +
        "simpática. A Bia tem um gato. O gato é preto e gordo e está sempre na janela.\n\n" +
        "Eu estou cansado, mas estou muito feliz. E amanhã é domingo: dia de feira!",
      gloss: { oi: "hola", hoje: "hoy", mala: "valija", mochila: "mochila", bairro: "barrio",
               morro: "cerro", bonito: "lindo", janela: "ventana",
               "açúcar": "azúcar (Pão de Açúcar: el morro más famoso de Río)",
               minha: "mi (a minha = mi)", colega: "(colega de apartamento) compañera de departamento",
               carioca: "de la ciudad de Río", muito: "muy", preto: "negro", sempre: "siempre",
               amanhã: "mañana", feira: "feria (mercado callejero)",
               // Semana 1: las contracciones llegan en la 3; acá se glosan.
               no: "en el (em + o; no es la negación, que es não)", na: "en la (em + a)",
               da: "desde la (de + a)", em: "en (é em Santa Teresa = queda en Santa Teresa)" },
      questions: [
        ["¿De dónde es Bia?", ["de Río de Janeiro", "de Buenos Aires", "de São Paulo", "de Salvador"], "de Río de Janeiro"],
        ["¿Cómo es el departamento?", ["chico pero lindo", "grande pero muy oscuro", "nuevo y caro", "lejos del mar"], "chico pero lindo"],
        ["¿Qué se ve desde la ventana?", ["el mar, las montañas y el Pan de Azúcar", "el mar y los edificios altos de Copacabana", "un estadio", "un parque"], "el mar, las montañas y el Pan de Azúcar"]
      ],
      hunt: { label: "Tocá todas las formas de ser y estar (sou, é, estou, está)", targets: ["sou", "é", "estou", "está"] } },

    { id: "ep2", week: 6, n: 2, level: "A1", emoji: "🍍", title: "Na feira",
      grammar: "presente e contrações",
      text:
        "No domingo de manhã, a Bia e o Martín vão à feira da Glória. A feira fica numa rua " +
        "perto de Santa Teresa e tem de tudo: frutas, verduras, peixe, flores e, claro, pastel.\n\n" +
        "A Bia compra sempre as frutas na mesma barraca, a do seu Zé. O Martín olha tudo com " +
        "curiosidade: manga, abacaxi, maracujá, caju... Muitas frutas ele não conhece.\n\n" +
        "— O que é isso? — pergunta ele.\n" +
        "— É caju. Quer provar? — pergunta o seu Zé, e corta um pedaço.\n\n" +
        "O Martín come e faz uma cara estranha. A Bia ri:\n" +
        "— É assim mesmo: o caju amarra a boca. Mas o suco é uma delícia!\n\n" +
        "No fim da feira, os dois comem um pastel de queijo e tomam um caldo de cana numa " +
        "barraca da esquina. O Martín está feliz:\n" +
        "— No domingo que vem, eu volto. E o pastel é por minha conta!\n" +
        "— Combinado. Mas antes, no sábado, tem passeio: o Pão de Açúcar!",
      gloss: { mesmo: "(é assim mesmo) así es nomás", manhã: "mañana (de manhã = a la mañana)", feira: "feria (mercado callejero)", fica: "queda",
               rua: "calle", perto: "cerca", peixe: "pescado", pastel: "pastel (empanada frita)",
               barraca: "puesto", seu: "don (seu Zé = don Zé; viene de senhor)", olha: "mira",
               abacaxi: "ananá", maracujá: "maracuyá", caju: "cajú (la fruta)", conhece: "conoce",
               provar: "probar", pedaço: "pedazo", estranha: "rara", ri: "se ríe",
               amarra: "(amarrar a boca) dejar la boca áspera", suco: "jugo", queijo: "queso",
               caldo: "(caldo de cana) jugo de caña de azúcar", vem: "(que vem) que viene",
               conta: "(por minha conta) invito yo", combinado: "trato hecho", passeio: "paseo" },
      questions: [
        ["¿Dónde compra Bia siempre la fruta?", ["en el puesto de don Zé", "en el supermercado", "en un puesto de la esquina", "en Santa Teresa"], "en el puesto de don Zé"],
        ["¿Qué le pasa a Martín con el cajú?", ["le deja la boca áspera", "le encanta", "le da alergia en la boca", "no lo quiere probar"], "le deja la boca áspera"],
        ["¿Qué hay el sábado?", ["un paseo al Pan de Azúcar", "otra feria", "una fiesta", "trabajo"], "un paseo al Pan de Azúcar"]
      ],
      hunt: { label: "Tocá las contracciones (no, na, da, do, numa, à)", targets:
        ["no", "na", "da", "do", "numa", "à"] } },

    { id: "ep3", week: 11, n: 3, level: "A2", emoji: "⛰️", title: "Um sábado no Pão de Açúcar",
      grammar: "pretérito perfeito",
      text:
        "No sábado, a Bia e o Martín pegaram o metrô até Botafogo e depois um ônibus até a " +
        "Praia Vermelha, na Urca. Não compraram logo o bilhete do bondinho: primeiro subiram a " +
        "pé o Morro da Urca, por uma trilha no meio da mata. No caminho, viram uns macaquinhos " +
        "nas árvores.\n" +
        "— São micos — explicou a Bia. — Aqui tem muitos.\n\n" +
        "Lá em cima, pegaram o bondinho até o Pão de Açúcar. O Martín tirou mais de cem fotos: " +
        "Copacabana, o Cristo, a baía de Guanabara, os barcos.\n" +
        "— Eu nunca vi uma cidade assim — disse ele.\n\n" +
        "À noite, foram para a Lapa. Comeram num boteco perto dos Arcos, ouviram samba ao vivo " +
        "e dançaram até tarde. O Martín tentou sambar, mas pisou no pé de todo mundo. A Bia riu " +
        "tanto que chorou.\n\n" +
        "Perderam o último metrô e voltaram para casa de táxi, às duas da manhã, cansados e " +
        "felizes. No domingo, a Bia mostrou ao Martín uma foto antiga: uma menina com um " +
        "cachorro molhado.\n" +
        "— Sou eu — disse ela. — Mas essa é outra história.",
      gloss: { pegaram: "tomaron (pegar un transporte)", metrô: "subte", ônibus: "colectivo",
               logo: "enseguida", bilhete: "boleto, pasaje", bondinho: "teleférico (el del Pan de Azúcar)",
               trilha: "sendero", mata: "monte, selva", macaquinhos: "monitos", micos: "titíes (monos chiquitos)",
               "lá": "(lá em cima) allá arriba", tirou: "sacó (fotos)", baía: "bahía",
               boteco: "bar popular, bodegón", arcos: "(los Arcos da Lapa) un acueducto antiguo",
               vivo: "(ao vivo) en vivo", sambar: "bailar samba", pisou: "pisó", chorou: "lloró",
               menina: "nena", cachorro: "perro", molhado: "mojado" },
      questions: [
        ["¿Cómo subieron al Morro da Urca?", ["a pie, por un sendero", "en el teleférico, desde la Urca", "en colectivo", "en taxi"], "a pie, por un sendero"],
        ["¿Qué pasó cuando Martín intentó bailar samba?", ["pisó a todo el mundo", "bailó muy bien", "se cayó", "se fue temprano"], "pisó a todo el mundo"],
        ["¿Cómo volvieron a casa?", ["en taxi, porque perdieron el último subte", "en subte, antes de que cerrara la estación", "caminando", "en colectivo"], "en taxi, porque perdieron el último subte"]
      ],
      hunt: { label: "Tocá los verbos en pretérito perfeito", targets:
        ["pegaram", "compraram", "subiram", "viram", "explicou", "tirou", "vi", "disse", "foram",
         "comeram", "ouviram", "dançaram", "tentou", "pisou", "riu", "chorou", "perderam",
         "voltaram", "mostrou"] } },

    { id: "ep4", week: 15, n: 4, level: "A2", emoji: "🐕", title: "Quando eu era pequena",
      grammar: "imperfeito e perfeito",
      text:
        "Naquela noite, a Bia contou a história da foto.\n\n" +
        "— Quando eu era pequena, a gente morava em Jurujuba, em Niterói, numa casa perto do " +
        "mar. Meu pai era pescador e saía todas as noites com o barco. Minha mãe cozinhava para " +
        "a rua inteira: no almoço de domingo, éramos sempre uns vinte em casa! Eu ia para a " +
        "escola a pé e, de tarde, jogava bola na areia com o meu irmão.\n\n" +
        "Um dia, aconteceu uma coisa estranha: meu pai voltou sem peixe, mas com um cachorro " +
        "molhado no barco. Ninguém sabia de onde ele vinha. A gente deu a ele o nome de " +
        "Garrincha, porque ele tinha as pernas tortas, como o jogador. E ele ficou com a gente " +
        "quinze anos.\n\n" +
        "O Martín sorriu:\n" +
        "— Por isso você gosta tanto de cachorro! E Niterói é longe daqui?\n" +
        "— Não, é do outro lado da baía. Por quê?\n" +
        "— Por nada — respondeu o Martín.\n\n" +
        "Mas na segunda-feira ele tinha uma entrevista de emprego justamente em Niterói.",
      gloss: { naquela: "aquella (em + aquela)", contou: "contó", morava: "vivía", saía: "salía",
               cozinhava: "cocinaba", inteira: "entera", almoço: "almuerzo", jogava: "jugaba",
               bola: "pelota", areia: "arena", irmão: "hermano", aconteceu: "pasó",
               peixe: "pescado", cachorro: "perro", molhado: "mojado", ninguém: "nadie",
               vinha: "venía", pernas: "piernas", tortas: "torcidas, chuecas",
               jogador: "jugador (Garrincha, crack del fútbol brasileño)", ficou: "se quedó",
               sorriu: "sonrió", longe: "lejos", emprego: "empleo, trabajo", justamente: "justo" },
      questions: [
        ["¿De qué trabajaba el padre de Bia?", ["era pescador", "era cocinero", "era maestro", "era taxista"], "era pescador"],
        ["¿Qué trajo el padre un día?", ["un perro mojado", "un pescado enorme", "un gato", "nada"], "un perro mojado"],
        ["¿Por qué el perro se llamaba Garrincha?", ["tenía las piernas torcidas, como el jugador", "jugaba al fútbol en la playa", "era muy rápido", "era del Botafogo"], "tenía las piernas torcidas, como el jugador"]
      ],
      hunt: { label: "Tocá los verbos en imperfeito (lo que pasaba siempre)", targets:
        ["era", "morava", "saía", "cozinhava", "éramos", "ia", "jogava", "sabia", "vinha", "tinha"] } },

    { id: "ep5", week: 17, n: 5, level: "B1", emoji: "💼", title: "A entrevista",
      grammar: "futuro do presente e ir + infinitivo",
      text:
        "No domingo, a Bia ajuda o Martín a se preparar para a entrevista. A empresa fica em " +
        "Niterói e fabrica painéis solares. O Martín tem medo de não entender as perguntas.\n\n" +
        "— Eles perguntarão por que você quer trabalhar lá — diz a Bia. — Você responderá que a " +
        "tecnologia deles te fascina há anos.\n" +
        "— Por que você está falando como um livro?\n" +
        "— Porque numa entrevista tudo é mais formal. Você falará devagar e usará as palavras " +
        "que conhece.\n" +
        "— E se eu não entendo uma pergunta?\n" +
        "— Pedirá para repetir. Não tem vergonha nenhuma nisso.\n\n" +
        "O Martín estuda o dia inteiro. À noite, está nervoso:\n" +
        "— Amanhã, a esta hora, saberei se o meu português é suficiente.\n" +
        "— Vai dar tudo certo, você vai ver — diz a Bia, e faz um chá de camomila para ele. — " +
        "E amanhã você vai conhecer a melhor parte do Rio: a barca para Niterói. Vinte minutos " +
        "atravessando a baía, com o Pão de Açúcar de um lado e o Cristo do outro.\n\n" +
        "Na segunda de manhã, o Martín sai de casa às sete, de terno e gravata. No cais da " +
        "Praça XV, ele respira fundo e pensa: “Será um bom dia.”",
      gloss: { nenhuma: "ninguna (não tem vergonha nenhuma = no tiene nada de vergonzoso)", entrevista: "entrevista (de trabajo)", fica: "queda", painéis: "paneles", medo: "miedo",
               "há": "(há anos) hace años", devagar: "despacio", vergonha: "vergüenza", nisso: "en eso",
               certo: "(dar certo) salir bien", "chá": "té", camomila: "manzanilla",
               barca: "ferry", atravessando: "cruzando", terno: "traje", gravata: "corbata",
               cais: "muelle", fundo: "(respirar fundo) respirar hondo" },
      questions: [
        ["¿Qué fabrica la empresa?", ["paneles solares", "barcos", "autos eléctricos", "software"], "paneles solares"],
        ["¿Por qué Bia habla «como un libro»?", ["porque en una entrevista todo es más formal", "porque está nerviosa", "porque es profesora", "porque está leyendo"], "porque en una entrevista todo es más formal"],
        ["¿Cómo va a ir Martín a Niterói?", ["en ferry, cruzando la bahía", "en subte", "en colectivo, por el puente", "en bicicleta"], "en ferry, cruzando la bahía"]
      ],
      hunt: { label: "Tocá los verbos en futuro simple (perguntarão, saberei…)", targets:
        ["perguntarão", "responderá", "falará", "usará", "pedirá", "saberei", "será"] } },

    { id: "ep6", week: 17, n: 6, level: "B1", emoji: "📞", title: "E aí, como foi?",
      grammar: "pronomes objeto",
      text:
        "O Martín sai da entrevista e liga na hora para a Bia.\n\n" +
        "— E aí? Como foi?\n" +
        "— Ainda não sei. Me fizeram um monte de perguntas. O diretor me pediu o currículo, mas " +
        "eu já mandei ele por e-mail na semana passada.\n" +
        "— E você?\n" +
        "— Entreguei de novo, claro. Depois expliquei o meu projeto da Argentina. Acho que ele " +
        "gostou.\n" +
        "— E quando eles vão responder?\n" +
        "— A moça do RH disse assim: “Agradecemos a sua visita, senhor Martín. Vamos contatá-lo " +
        "até sexta-feira.”\n" +
        "— Contatá-lo? Ela falou assim mesmo?\n" +
        "— Falou. Eu quase respondi: “Pode me ligar, moça, pode me ligar!”\n\n" +
        "A Bia ri.\n" +
        "— Então hoje a gente comemora do mesmo jeito. Eu compro uma pizza e te espero em casa.\n" +
        "— Compra duas! Estou morrendo de fome.\n\n" +
        "Na barca de volta, uma senhora da empresa se senta ao lado dele.\n" +
        "— Eu o vi na recepção hoje de manhã, não vi?\n" +
        "Que formal!, pensa o Martín. No Rio, todo mundo diz “eu vi você” ou até “eu vi ele”. " +
        "Mas ele sorri e responde:\n" +
        "— Viu, sim. Foi um prazer conhecê-la.",
      gloss: { novo: "(de novo) otra vez", liga: "llama", hora: "(na hora) enseguida", ainda: "todavía", monte: "(um monte de) un montón de",
               ele: "él (mandei ele, vi ele: coloquial por «o mandei», «o vi»)",
               entreguei: "entregué", rh: "Recursos Humanos", moça: "chica",
               "contatá-lo": "contactarlo (formal)", comemora: "festeja", jeito: "(do mesmo jeito) igual, de todos modos", hoje: "hoy", fome: "hambre",
               morrendo: "(morrendo de fome) muerto de hambre", senta: "(se senta) se sienta",
               "conhecê-la": "conocerla", prazer: "placer, gusto" },
      questions: [
        ["¿Qué le pidió el director?", ["el currículum, otra vez", "una carta de recomendación", "que hablara en inglés", "el pasaporte"], "el currículum, otra vez"],
        ["¿Hasta cuándo le van a contestar?", ["hasta el viernes", "hasta mañana", "en un mes", "no le dijeron"], "hasta el viernes"],
        ["¿Qué le llama la atención de la señora del ferry?", ["que hable tan formal", "que hable español", "que lo conozca de Buenos Aires", "que no lo salude"], "que hable tan formal"]
      ],
      hunt: { label: "Tocá los pronombres átonos (me, te, se, -lo, -la)", targets:
        ["me", "te", "se", "contatá-lo", "conhecê-la"] } },

    { id: "ep7", week: 18, n: 7, level: "B1", emoji: "✉️", title: "A proposta",
      grammar: "futuro do pretérito (condicional)",
      text:
        "Na sexta de manhã chega o e-mail: a empresa de Niterói oferece o cargo ao Martín. Ele " +
        "deveria estar felicíssimo, mas está confuso. O trabalho é ótimo, só que significa " +
        "passar o dia longe de Santa Teresa, da Bia e dos novos amigos. Talvez até se mudar.\n\n" +
        "— O que você faria no meu lugar? — pergunta ele à Bia.\n" +
        "— Eu aceitaria na hora. Niterói é aqui do lado: você poderia pegar a barca todo dia, " +
        "como muita gente faz.\n" +
        "— Pode ser. Mas eu sentiria falta da vida daqui, do boteco do seu Almir, das ladeiras...\n" +
        "— Então você não precisa se mudar! Seria só meia hora de barca. Eu, no seu lugar, nem " +
        "pensaria duas vezes.\n\n" +
        "O Martín pensa nisso a noite toda. Às três da manhã, escreve uma mensagem para a mãe, " +
        "em Buenos Aires: “Mãe, você acha que eu seria capaz de começar do zero mais uma vez?”",
      gloss: { felicíssimo: "felicísimo, contentísimo", até: "hasta, incluso", oferece: "ofrece", cargo: "puesto", ótimo: "excelente", "só": "(só que) solo que",
               longe: "lejos", talvez: "quizás", mudar: "(se mudar) mudarse", hora: "(na hora) enseguida",
               lado: "(aqui do lado) acá al lado", barca: "ferry", falta: "(sentir falta de) extrañar",
               boteco: "bar de barrio", ladeiras: "calles en pendiente", meia: "media", nem: "ni",
               vezes: "veces", zero: "(do zero) desde cero" },
      questions: [
        ["¿Qué le ofrece la empresa?", ["el puesto", "una beca", "un aumento", "un viaje"], "el puesto"],
        ["¿Qué haría Bia?", ["aceptaría enseguida", "lo pensaría un mes", "rechazaría la oferta", "se mudaría a Niterói"], "aceptaría enseguida"],
        ["¿Qué extrañaría Martín?", ["la vida del barrio: el bar, las calles en pendiente", "Buenos Aires", "su trabajo anterior", "el ferry"], "la vida del barrio: el bar, las calles en pendiente"]
      ],
      hunt: { label: "Tocá los verbos en condicional (faria, poderia…)", targets:
        ["deveria", "faria", "aceitaria", "poderia", "sentiria", "seria", "pensaria"] } },

    { id: "ep8", week: 23, n: 8, level: "B1", emoji: "💌", title: "O conselho da mãe",
      grammar: "presente do subjuntivo",
      text:
        "A resposta da mãe chega na manhã seguinte: quando ele escreveu, ela estava dormindo.\n\n" +
        "“Querido Martín: acho que você já é capaz de tudo, mesmo que não perceba. Não acho que " +
        "a cidade importe tanto; o importante é que você faça um trabalho que te apaixone. " +
        "Parece que a Bia é uma boa amiga, e os amigos de verdade ficam, mesmo do outro lado de " +
        "uma baía.\n\n" +
        "Quero que você não tenha medo de errar: é normal que uma decisão importante dê um pouco " +
        "de medo. Qualquer que seja a sua escolha, tenho orgulho de você. E espero que você " +
        "venha me visitar logo, que eu estou com saudade. Um beijo grande, mamãe.\n\n" +
        "P.S.: Tomara que você já saiba cozinhar, porque em Niterói a Bia não vai fazer o seu " +
        "jantar.”\n\n" +
        "O Martín lê a mensagem duas vezes. Depois abre o computador e escreve para a empresa " +
        "uma palavra só: “Aceito.”",
      gloss: { qualquer: "(qualquer que seja) sea cual sea", seguinte: "siguiente", dormindo: "durmiendo", mesmo: "(mesmo que) aunque; (mesmo do outro lado) incluso",
               perceba: "te des cuenta", apaixone: "apasione", ficam: "quedan, se quedan", medo: "miedo",
               errar: "equivocarse", escolha: "elección", orgulho: "orgullo", logo: "pronto",
               saudade: "(estar com saudade) extrañar", beijo: "beso", tomara: "ojalá",
               cozinhar: "cocinar", jantar: "cena" },
      questions: [
        ["¿Por qué la respuesta llega a la mañana?", ["porque la madre estaba durmiendo", "por la diferencia horaria con Buenos Aires", "porque se cortó internet", "porque estaba ocupada"], "porque la madre estaba durmiendo"],
        ["Según la madre, ¿qué es lo importante?", ["hacer un trabajo que lo apasione", "la ciudad", "ganar mucha plata y ahorrar para el futuro", "estar cerca de ella"], "hacer un trabajo que lo apasione"],
        ["¿Qué hace Martín al final?", ["le escribe a la empresa que acepta", "llama a su madre", "rechaza el puesto", "le pregunta a Bia"], "le escribe a la empresa que acepta"]
      ],
      hunt: { label: "Tocá los verbos en subjuntivo (importe, faça, seja…)", targets:
        ["perceba", "importe", "faça", "apaixone", "tenha", "dê", "seja", "venha", "saiba"] } },

    { id: "ep9", week: 27, n: 9, level: "B1", emoji: "🥁", title: "Se Deus quiser",
      grammar: "futuro do subjuntivo",
      text:
        "Faz quatro meses que o Martín trabalha em Niterói e pega a barca todos os dias. Agora " +
        "falta pouco para o Carnaval, e a Bia tem um plano: desfilar com ele numa escola de samba.\n\n" +
        "— Quando você chegar do trabalho, a gente vai ao ensaio na quadra. Se você quiser, pode " +
        "desfilar na ala da minha tia.\n" +
        "— E se eu não souber sambar?\n" +
        "— Ninguém sabe no começo. Enquanto você estiver aprendendo, fica no meio da ala e faz o " +
        "que os outros fizerem.\n" +
        "— E a fantasia? Deve ser caríssima.\n" +
        "— Você paga assim que tiver o dinheiro. E quem vier aos ensaios ganha uma camiseta da escola.\n\n" +
        "Durante seis semanas, eles vão aos ensaios toda quinta e todo domingo. O Martín erra o " +
        "passo, ri, erra de novo. Na noite do desfile, na Sapucaí, ele está com uma fantasia azul " +
        "e prata e um chapéu enorme.\n" +
        "— Se Deus quiser, a gente não esquece a letra do samba — diz a Bia.\n" +
        "— Se eu esquecer, mexo a boca e sorrio — responde ele.\n\n" +
        "Na volta, às seis da manhã, sentado no metrô, o Martín faz as contas: daqui a dois " +
        "meses, vai fazer um ano que ele chegou ao Rio.",
      gloss: { barca: "ferry", falta: "(falta pouco) falta poco", daqui: "(daqui a dois meses) dentro de dos meses",
               escola: "(escola de samba) agrupación que desfila en Carnaval", ensaio: "ensayo",
               quadra: "galpón de la escuela de samba", ala: "sector del desfile",
               souber: "supiera (futuro do subjuntivo de saber)", sambar: "bailar samba", começo: "comienzo",
               fantasia: "disfraz", camiseta: "remera", erra: "se equivoca", passo: "paso",
               "sapucaí": "(la Sapucaí) la pasarela del Carnaval de Río", prata: "plata", chapéu: "sombrero",
               esquece: "olvida", mexo: "muevo", sorrio: "sonrío", contas: "(fazer as contas) sacar la cuenta" },
      questions: [
        ["Qual é o plano da Bia?", ["desfilar com ele numa escola de samba", "ir para Buenos Aires", "se mudar para Niterói", "ver o desfile pela televisão, em casa"], "desfilar com ele numa escola de samba"],
        ["O que o Martín tem que fazer enquanto aprende?", ["ficar no meio da ala e fazer o que os outros fazem", "não desfilar", "ter aulas particulares com um mestre da escola todas as noites", "desfilar na frente de todo mundo"], "ficar no meio da ala e fazer o que os outros fazem"],
        ["O que o Martín percebe no metrô?", ["que daqui a dois meses faz um ano no Rio", "que perdeu o chapéu", "que está atrasado para o trabalho", "que esqueceu a letra"], "que daqui a dois meses faz um ano no Rio"]
      ],
      hunt: { label: "Toque nos verbos no futuro do subjuntivo (quiser, tiver…)", targets:
        ["chegar", "quiser", "souber", "estiver", "fizerem", "tiver", "vier", "esquecer"] } },

    { id: "ep10", week: 30, n: 10, level: "B2", emoji: "🥂", title: "Um ano depois",
      grammar: "infinitivo pessoal e hipóteses",
      text:
        "Faz um ano que o Martín chegou ao Rio. Hoje ele comemora com a Bia no boteco do seu " +
        "Almir, em Santa Teresa, onde os dois tomaram o primeiro chope juntos.\n\n" +
        "O seu Almir traz dois chopes e uma porção de bolinhos de bacalhau:\n" +
        "— É por conta da casa, para vocês comemorarem direito.\n\n" +
        "— Se eu não tivesse encontrado você como colega de apartamento, nunca teria aprendido " +
        "português tão rápido — diz o Martín.\n" +
        "— E se você não tivesse vindo, eu nunca teria provado alfajor — responde ela.\n\n" +
        "Os dois riem. O Martín lembra do primeiro dia, quando entendia uma palavra em cada dez. " +
        "Agora sonha em português, discute em português e, principalmente, faz piada em português.\n\n" +
        "— Sabe o que é mais estranho? — diz ele. — Se eu tivesse que voltar amanhã para Buenos " +
        "Aires, sentiria falta até das ladeiras de Santa Teresa.\n" +
        "— Então é melhor a gente pedir mais dois chopes, para não pensarmos nisso — diz a Bia. — " +
        "E, antes de irmos embora, quero fazer um brinde: a nós dois e ao próximo ano!",
      gloss: { comemora: "festeja", boteco: "bar de barrio", chope: "chopp, cerveza tirada",
               traz: "trae", "porção": "porción", bolinhos: "(bolinhos de bacalhau) buñuelos de bacalao",
               conta: "(por conta da casa) invita la casa", direito: "bien", vindo: "venido",
               provado: "probado", riem: "se ríen", lembra: "(lembrar de) acordarse de", sonha: "sueña",
               piada: "(fazer piada) hacer chistes", estranho: "raro", falta: "(sentir falta) extrañar",
               ladeiras: "calles en pendiente", embora: "(ir embora) irse", brinde: "brindis" },
      questions: [
        ["Onde eles comemoram?", ["no bar do seu Almir, onde tomaram o primeiro chope", "em Niterói", "na escola de samba, na festa depois do último ensaio", "em Copacabana"], "no bar do seu Almir, onde tomaram o primeiro chope"],
        ["O que não teria acontecido se o Martín não tivesse vindo?", ["a Bia não teria provado alfajor", "a Bia não teria aprendido espanhol", "não teria havido Carnaval", "o seu Almir não teria o bar"], "a Bia não teria provado alfajor"],
        ["Do que o Martín sentiria falta se voltasse para Buenos Aires?", ["até das ladeiras de Santa Teresa", "só da comida, do mar e dos amigos da escola", "do trabalho", "de nada"], "até das ladeiras de Santa Teresa"]
      ],
      hunt: { label: "Toque nos infinitivos pessoais (comemorarem…) e nos verbos das hipóteses (tivesse, teria, sentiria)", targets:
        ["comemorarem", "pensarmos", "irmos", "tivesse", "teria", "sentiria"] } },

    /* ---------------------------------------------- Cultura: historia, ideas, libros.
       Contenido que interesa (Hidi & Renninger 2006): el interés por el tema
       mejora comprensión y memoria.  Se eligen libremente entre los abiertos.
       Brasil (música, literatura, arte, historia), el pensamiento social
       brasileño y Portugal con la lusofonía; de B1 a C1, con más peso en las
       semanas 40-52.  Todo verificable; las frases apócrifas se señalan. */

    { id: "c-bossa", week: 22, series: "cultura", area: "Música", n: 1, level: "B1", emoji: "🎸",
      title: "A bossa nova", grammar: "perfeito e imperfeito",
      text:
        "No fim dos anos 1950, um grupo de jovens da Zona Sul do Rio começou a tocar samba de um " +
        "jeito novo: mais baixo, mais lento, quase sussurrado. Chamaram aquilo de bossa nova — " +
        "“bossa” era gíria para talento, um jeito especial de fazer as coisas.\n\n" +
        "Em 1958, a cantora Elizeth Cardoso gravou “Chega de Saudade”, de Tom Jobim e Vinicius de " +
        "Moraes, num disco em que um violonista baiano acompanhava duas faixas com uma batida " +
        "diferente. Era João Gilberto. No mesmo ano, ele lançou a sua própria gravação da música, " +
        "e muitos consideram esse disco o nascimento da bossa nova.\n\n" +
        "Jobim compunha as melodias; Vinicius, poeta e diplomata, escrevia as letras. Em 1962, os " +
        "dois fizeram “Garota de Ipanema”, inspirada numa moça que passava a caminho da praia, em " +
        "frente ao bar onde eles se encontravam. A canção ganhou o mundo com o disco Getz/Gilberto, " +
        "que recebeu o Grammy de álbum do ano em 1965. Hoje, a rua do bar se chama Vinicius de " +
        "Moraes, e o bar se chama Garota de Ipanema.",
      gloss: { chamaram: "(chamar algo de…) le pusieron el nombre de…", jovens: "jóvenes", jeito: "manera, estilo", baixo: "bajo (de volumen)", lento: "lento",
               sussurrado: "susurrado", gíria: "jerga", gravou: "grabó", violonista: "guitarrista",
               baiano: "de Bahía", faixas: "temas", batida: "rasguido", lançou: "lanzó",
               gravação: "grabación", nascimento: "nacimiento", compunha: "componía",
               letras: "letras (de canciones)", garota: "chica", moça: "muchacha",
               caminho: "(a caminho de) camino a", frente: "(em frente a) enfrente de" },
      questions: [
        ["¿Cómo era la nueva forma de tocar samba?", ["más baja, más lenta, casi susurrada", "más rápida, más fuerte, casi gritada", "con muchos tambores", "solo con piano"], "más baja, más lenta, casi susurrada"],
        ["¿Quién tocaba la guitarra en el disco de Elizeth Cardoso?", ["João Gilberto", "Tom Jobim", "Vinicius de Moraes", "Stan Getz"], "João Gilberto"],
        ["¿Qué inspiró «Garota de Ipanema»?", ["una chica que pasaba camino a la playa", "una novia de Vinicius", "una película", "un viaje a Estados Unidos"], "una chica que pasaba camino a la playa"]
      ],
      hunt: { label: "Tocá los verbos en imperfeito", targets:
        ["era", "acompanhava", "compunha", "escrevia", "passava", "encontravam"] } },

    { id: "c-samba", week: 22, series: "cultura", area: "Música", n: 2, level: "B1", emoji: "🥁",
      title: "O samba e as escolas de samba", grammar: "perfeito, imperfeito e passiva",
      text:
        "No começo do século XX, muitos negros vindos da Bahia se mudaram para o Rio, que era " +
        "então a capital do país. Muitos foram morar perto do porto e da Praça Onze, uma região " +
        "que o compositor Heitor dos Prazeres chamou de “Pequena África”. Na casa de uma dessas " +
        "baianas, a Tia Ciata, havia festas com comida, religião e música que duravam dias.\n\n" +
        "Foi nesse ambiente que nasceu “Pelo Telefone”, registrado por Donga em 1916 e gravado em " +
        "1917. É considerado o primeiro samba gravado. Outros músicos da roda, porém, diziam que a " +
        "música era de todos.\n\n" +
        "Nos anos 1920, a polícia ainda perseguia os sambistas. Em 1928, no bairro do Estácio, " +
        "Ismael Silva e seus amigos fundaram a Deixa Falar, que muitos chamam de primeira escola " +
        "de samba. Segundo Ismael, o nome “escola” vinha de uma escola de professores que ficava " +
        "ali perto: eles também eram professores — de samba. Logo surgiram outras, como a " +
        "Mangueira e a Portela.\n\n" +
        "Hoje as escolas desfilam no Sambódromo, projetado por Oscar Niemeyer e inaugurado em " +
        "1984. Cada uma prepara o desfile durante o ano inteiro, e os ensaios na quadra começam " +
        "meses antes do Carnaval.",
      gloss: { chamam: "(chamar algo de…) llaman… a algo", vindos: "venidos", porto: "puerto", baianas: "mujeres de Bahía", duravam: "duraban",
               registrado: "registrado", gravado: "grabado", roda: "(roda de samba) ronda de músicos",
               porém: "sin embargo", perseguia: "perseguía", sambistas: "músicos de samba",
               fundaram: "fundaron", ficava: "quedaba", logo: "pronto", "começam": "empiezan",
               morar: "vivir", chamou: "llamó (chamar algo de… = llamar… a algo)", surgiram: "surgieron", desfilam: "desfilan",
               projetado: "proyectado", inaugurado: "inaugurado", ensaios: "ensayos",
               quadra: "galpón (de la escuela de samba)" },
      questions: [
        ["¿Qué era la «Pequeña África»?", ["la zona del puerto y la Praça Onze, donde vivían muchos negros bahianos", "un barrio de Salvador, en Bahía, donde nacieron los primeros sambistas", "una escuela de samba", "un país africano"], "la zona del puerto y la Praça Onze, donde vivían muchos negros bahianos"],
        ["¿Por qué se discute «Pelo Telefone»?", ["otros músicos decían que la canción era de todos", "no es un samba", "nunca se grabó en disco, solo se cantaba en fiestas", "la prohibió la policía"], "otros músicos decían que la canción era de todos"],
        ["Según Ismael Silva, ¿de dónde viene el nombre «escola»?", ["de una escuela de maestros que quedaba cerca", "de una escuela de baile", "de la policía", "de la iglesia"], "de una escuela de maestros que quedaba cerca"]
      ],
      hunt: { label: "Tocá los lugares de Río (Praça, Onze, Estácio, Mangueira…)", targets:
        ["praça", "onze", "estácio", "mangueira", "portela", "sambódromo"] } },

    { id: "c-carmen", week: 24, series: "cultura", area: "Música", n: 3, level: "B1", emoji: "🍌",
      title: "Carmen Miranda", grammar: "perfeito, imperfeito e pronomes",
      text:
        "Maria do Carmo Miranda da Cunha nasceu em 1909 no norte de Portugal, mas chegou ao Rio " +
        "com menos de um ano. Cresceu na Lapa, trabalhou numa loja de chapéus e cantava enquanto " +
        "trabalhava. Em 1930, a marchinha “Taí” a transformou numa estrela do rádio.\n\n" +
        "Em 1939, no filme Banana da Terra, cantou “O que é que a baiana tem?”, de Dorival " +
        "Caymmi, vestida de baiana: saia colorida, colares e um turbante com frutas. Era uma versão " +
        "estilizada da roupa das mulheres negras que vendiam quitutes nas ruas de Salvador. No " +
        "mesmo ano, foi para os Estados Unidos, fez sucesso na Broadway e depois em Hollywood.\n\n" +
        "Quando voltou ao Rio, em 1940, parte do público a recebeu com frieza: diziam que ela " +
        "tinha ficado americanizada. Carmen respondeu com um samba: “Disseram que voltei " +
        "americanizada”. Morreu em 1955, em Beverly Hills, e foi enterrada no Rio; milhares de " +
        "pessoas acompanharam o enterro. Hoje há um museu com o nome dela no Aterro do Flamengo.\n\n" +
        "Para uns, ela foi um estereótipo do Brasil para estrangeiros; para outros, a primeira " +
        "artista brasileira a conquistar o mundo.",
      gloss: { cresceu: "creció", loja: "negocio, tienda", chapéus: "sombreros", enquanto: "mientras",
               marchinha: "marcha de Carnaval", estrela: "estrella", vestida: "vestida",
               saia: "pollera", colares: "collares", roupa: "ropa", quitutes: "bocados, comidas caseras",
               sucesso: "éxito", frieza: "frialdad", enterrada: "enterrada", enterro: "entierro",
               aterro: "(Aterro do Flamengo) parque junto a la bahía", estrangeiros: "extranjeros" },
      questions: [
        ["¿Dónde nació Carmen Miranda?", ["en el norte de Portugal", "en la Lapa, en el centro de Río", "en Salvador", "en Hollywood"], "en el norte de Portugal"],
        ["¿Qué imitaba su ropa de «baiana»?", ["la ropa de las mujeres negras que vendían comida en Salvador", "la ropa de Hollywood", "un traje portugués", "la ropa de las bailarinas de los casinos de Río en los años treinta"], "la ropa de las mujeres negras que vendían comida en Salvador"],
        ["¿Qué le criticaron al volver en 1940?", ["que se había americanizado", "que cantaba mal", "que había engordado", "que ya no bailaba"], "que se había americanizado"]
      ],
      hunt: { label: "Tocá los lugares (Portugal, Lapa, Salvador, Hollywood…)", targets:
        ["portugal", "rio", "lapa", "salvador", "hollywood", "flamengo"] } },

    { id: "c-machado", week: 25, series: "cultura", area: "Literatura", n: 4, level: "B1", emoji: "🪶",
      title: "Machado de Assis", grammar: "perfeito, imperfeito e passiva",
      text:
        "Joaquim Maria Machado de Assis nasceu em 1839, no morro do Livramento, no Rio. Era neto " +
        "de escravizados libertos, mestiço, pobre, gago e epiléptico. Quase não frequentou a " +
        "escola: aprendeu sozinho, trabalhou como tipógrafo e revisor e, aos poucos, virou " +
        "jornalista, cronista e funcionário público.\n\n" +
        "Em 1881 publicou Memórias Póstumas de Brás Cubas, um romance narrado por um defunto. A " +
        "dedicatória já mostra o tom: “Ao verme que primeiro roeu as frias carnes do meu cadáver " +
        "dedico como saudosa lembrança estas Memórias Póstumas”. Ironia, conversa com o leitor, " +
        "capítulos curtíssimos: nada disso era comum na época.\n\n" +
        "Em Dom Casmurro (1899), Bentinho conta como se apaixonou por Capitu, a menina dos " +
        "“olhos de ressaca”, e como passou a desconfiar que ela o traiu com o melhor amigo. Mas " +
        "quem conta é ele, e o leitor nunca sabe se a traição aconteceu. Há mais de cem anos os " +
        "brasileiros discutem: Capitu traiu ou não traiu?\n\n" +
        "Machado foi o primeiro presidente da Academia Brasileira de Letras, fundada em 1897. " +
        "Morreu em 1908, na sua casa do Cosme Velho.",
      gloss: { passou: "(passou a + infinitivo) empezó a", poucos: "(aos poucos) de a poco", neto: "nieto", escravizados: "esclavizados", libertos: "liberados, libertos", gago: "tartamudo",
               frequentou: "frecuentó", sozinho: "solo", tipógrafo: "tipógrafo",
               revisor: "corrector (de textos)", virou: "se convirtió en", romance: "novela",
               defunto: "difunto", verme: "gusano", roeu: "royó", saudosa: "nostálgica",
               lembrança: "recuerdo", leitor: "lector", apaixonou: "(se apaixonou) se enamoró",
               ressaca: "resaca (del mar)", desconfiar: "sospechar", traiu: "traicionó" },
      questions: [
        ["¿Cómo aprendió Machado?", ["solo, casi sin ir a la escuela", "en la universidad", "en Portugal", "con un profesor privado en casa"], "solo, casi sin ir a la escuela"],
        ["¿Quién narra Memórias Póstumas de Brás Cubas?", ["un muerto", "un gusano", "Capitu", "el propio Machado"], "un muerto"],
        ["¿Qué no sabe nunca el lector de Dom Casmurro?", ["si Capitu lo traicionó de verdad", "quién es Bentinho", "dónde pasa la historia", "cómo termina el matrimonio"], "si Capitu lo traicionó de verdad"]
      ],
      hunt: { label: "Tocá las palabras del mundo del libro (romance, leitor, capítulos…)", targets:
        ["romance", "narrado", "dedicatória", "leitor", "capítulos", "cronista", "revisor"] } },

    { id: "c-burle", week: 26, series: "cultura", area: "Arte", n: 5, level: "B1", emoji: "🌊",
      title: "Burle Marx e o calçadão de Copacabana", grammar: "perfeito, imperfeito e passiva",
      text:
        "Quem caminha pela orla de Copacabana pisa numa obra de arte. As ondas pretas e brancas do " +
        "calçadão são feitas de pedra portuguesa, uma técnica trazida de Lisboa: o desenho vem do " +
        "Rossio, uma praça lisboeta em que a forma lembra o mar.\n\n" +
        "As ondas já existiam no começo do século XX, mas eram perpendiculares à praia. Em 1970, " +
        "depois de um aterro que alargou a faixa de areia e a avenida Atlântica, o paisagista " +
        "Roberto Burle Marx refez o projeto. Ele manteve as ondas, mas as colocou paralelas ao mar. " +
        "Nos outros dois calçadões — o do meio da avenida e o dos prédios — criou grandes desenhos " +
        "abstratos, que parecem pinturas quando são vistos do alto.\n\n" +
        "Burle Marx, nascido em São Paulo em 1909, pintava, desenhava joias e tecidos, mas ficou " +
        "famoso pelos jardins. Foi um dos primeiros paisagistas a usar plantas nativas do Brasil, " +
        "que muita gente então considerava mato. No Rio, também desenhou os jardins do Aterro do " +
        "Flamengo. O sítio onde ele morava e colecionava plantas, em Barra de Guaratiba, é hoje " +
        "Patrimônio Mundial da Unesco.",
      gloss: { orla: "costanera", pisa: "pisa", calçadão: "rambla, paseo costero", pedra: "piedra",
               trazida: "traída", desenho: "dibujo, diseño", lisboeta: "de Lisboa", lembra: "recuerda",
               aterro: "relleno (de tierra ganada al mar)", alargou: "ensanchó", faixa: "franja",
               areia: "arena", paisagista: "paisajista", refez: "rehízo", manteve: "mantuvo",
               prédios: "edificios", pinturas: "cuadros", joias: "joyas", tecidos: "telas",
               mato: "yuyos", sítio: "quinta, finca" },
      questions: [
        ["¿De dónde viene el dibujo de las ondas?", ["de una plaza de Lisboa, el Rossio", "de un cuadro de Burle Marx", "de las olas del mar de Copacabana", "de una bandera"], "de una plaza de Lisboa, el Rossio"],
        ["¿Qué cambió Burle Marx en 1970?", ["puso las ondas paralelas al mar", "borró las ondas", "cambió los colores", "hizo las ondas más chicas y más juntas"], "puso las ondas paralelas al mar"],
        ["¿Qué tenían de nuevo sus jardines?", ["usaban plantas nativas de Brasil", "eran muy chicos", "solo tenían flores europeas", "no tenían árboles"], "usaban plantas nativas de Brasil"]
      ],
      hunt: { label: "Tocá las palabras del diseño (ondas, desenho, paralelas…)", targets:
        ["ondas", "desenho", "desenhos", "perpendiculares", "paralelas", "abstratos", "pinturas"] } },

    { id: "c-niemeyer", week: 28, series: "cultura", area: "Arquitetura", n: 6, level: "B2", emoji: "🏛️",
      title: "Niemeyer e Brasília", grammar: "perfeito, passiva e subjuntivo",
      text:
        "Em 1956, o presidente Juscelino Kubitschek prometeu fazer “cinquenta anos em cinco”. A " +
        "obra mais ousada do plano era uma capital nova, no meio do cerrado, no centro do país. A " +
        "ideia era antiga — já estava na Constituição de 1891 —, mas foi JK quem a tirou do papel.\n\n" +
        "O plano urbanístico foi de Lúcio Costa: dois eixos que se cruzam, que muitos comparam a " +
        "um avião ou a um pássaro. Os edifícios principais foram de Oscar Niemeyer, carioca, " +
        "nascido em 1907, que já tinha trabalhado com JK na Pampulha, em Belo Horizonte. O " +
        "Congresso Nacional, com suas duas cúpulas, uma virada para cima e outra para baixo; a " +
        "Catedral, que parece um par de mãos abertas para o céu; o Palácio da Alvorada: tudo foi " +
        "construído em pouco mais de três anos, por milhares de operários vindos sobretudo do " +
        "Nordeste, os candangos. Muitos acharam impossível que uma cidade inteira ficasse pronta " +
        "tão depressa, mas Brasília foi inaugurada em 21 de abril de 1960.\n\n" +
        "Niemeyer escreveu que não era o ângulo reto que o atraía, e sim a curva livre e sensual: " +
        "a das montanhas, dos rios, das ondas do mar. Se você estiver no Rio, não precisa ir tão " +
        "longe para ver essas curvas: do outro lado da baía, em Niterói, o Museu de Arte " +
        "Contemporânea, de 1996, parece um disco voador pousado sobre o mar. Niemeyer morreu em " +
        "2012, aos 104 anos, trabalhando até o fim.",
      gloss: { prometeu: "prometió", ousada: "audaz", sim: "(e sim) sino: no… e sim… = no… sino…", cerrado: "sabana del centro de Brasil",
               papel: "(tirar do papel) llevar a la práctica", eixos: "ejes", cruzam: "cruzan",
               avião: "avión", pássaro: "pájaro", cúpulas: "cúpulas", virada: "dada vuelta",
               céu: "cielo", operários: "obreros", vindos: "venidos",
               candangos: "obreros que construyeron Brasilia", acharam: "creyeron",
               pronta: "lista", depressa: "rápido", reto: "recto", atraía: "atraía",
               voador: "(disco voador) plato volador", pousado: "posado" },
      questions: [
        ["Quem fez o plano urbanístico de Brasília?", ["Lúcio Costa", "Oscar Niemeyer", "Burle Marx", "Juscelino Kubitschek"], "Lúcio Costa"],
        ["Quem eram os candangos?", ["os operários que construíram a cidade, vindos sobretudo do Nordeste", "os políticos da nova capital", "os arquitetos", "os indígenas que viviam no cerrado antes da construção da capital"], "os operários que construíram a cidade, vindos sobretudo do Nordeste"],
        ["O que atraía Niemeyer, segundo ele mesmo?", ["a curva livre e sensual", "o ângulo reto", "o concreto cinza", "as torres altas"], "a curva livre e sensual"]
      ],
      hunt: { label: "Toque nos edifícios (Congresso, Catedral, Palácio, Museu)", targets:
        ["congresso", "catedral", "palácio", "museu"] } },

    { id: "c-abolicao", week: 31, series: "cultura", area: "História", n: 7, level: "B2", emoji: "⛓️",
      title: "1888: a abolição e a herança africana", grammar: "passiva e hipótese no passado",
      text:
        "Nenhum país recebeu tantos africanos escravizados quanto o Brasil: cerca de 4,8 milhões " +
        "de pessoas desembarcaram vivas nos portos brasileiros entre os séculos XVI e XIX, quase " +
        "metade de todo o tráfico para as Américas. O principal porto de chegada foi o Rio de " +
        "Janeiro. No Cais do Valongo, na zona portuária, desembarcaram centenas de milhares de " +
        "pessoas. As ruínas do cais, redescobertas em 2011 durante as obras para as Olimpíadas, " +
        "são desde 2017 Patrimônio Mundial da Unesco.\n\n" +
        "A abolição foi lenta. Em 1850, a Lei Eusébio de Queirós proibiu o tráfico; em 1871, a Lei " +
        "do Ventre Livre declarou livres os filhos de escravizadas nascidos a partir de então; em " +
        "1885, a Lei dos Sexagenários libertou os maiores de sessenta anos. Só em 13 de maio de " +
        "1888 a princesa Isabel assinou a Lei Áurea, e o Brasil se tornou o último país das " +
        "Américas a abolir a escravidão. Se não tivesse havido a pressão dos abolicionistas — como " +
        "Luiz Gama, André Rebouças e Joaquim Nabuco — e as fugas em massa, talvez tivesse " +
        "demorado ainda mais.\n\n" +
        "A lei, porém, não deu terra, escola nem indenização aos libertos. Muitos historiadores " +
        "veem aí uma das raízes da desigualdade racial do país.\n\n" +
        "A herança africana está em toda parte: no samba, na capoeira, no candomblé, na língua " +
        "(caçula, cafuné e moleque vêm de línguas bantas). Já a ideia de que a feijoada nasceu " +
        "nas senzalas, com as sobras da casa-grande, é provavelmente um mito: pratos de feijão " +
        "com carnes já existiam na Europa, e os historiadores da alimentação não encontraram " +
        "provas dessa origem. Desde 2024, o 20 de novembro, dia da morte de Zumbi dos Palmares, " +
        "é feriado nacional: o Dia da Consciência Negra.",
      gloss: { escravizados: "esclavizados", desembarcaram: "desembarcaron", já: "ya; al comienzo de la frase («já a ideia…») marca contraste: «en cambio»", tráfico: "trata (de esclavos)",
               cais: "muelle", redescobertas: "redescubiertas", obras: "obras (de construcción)",
               ventre: "vientre", sexagenários: "sexagenarios", assinou: "firmó",
               tornou: "(se tornou) se convirtió en", fugas: "fugas", demorado: "tardado",
               porém: "sin embargo", indenização: "indemnización", raízes: "raíces",
               desigualdade: "desigualdad", "caçula": "hijo menor", cafuné: "caricia en el pelo",
               moleque: "pibe", senzalas: "barracas de los esclavos", sobras: "sobras",
               feijão: "poroto", provas: "pruebas", feriado: "feriado" },
      questions: [
        ["O que é o Cais do Valongo?", ["o cais do Rio onde desembarcaram centenas de milhares de africanos", "um museu do Centro do Rio sobre a história do samba e do porto", "uma praia de Salvador", "uma lei de 1888"], "o cais do Rio onde desembarcaram centenas de milhares de africanos"],
        ["O que a Lei Áurea não deu aos libertos?", ["terra, escola nem indenização", "a liberdade", "o direito de ir embora", "um nome"], "terra, escola nem indenização"],
        ["O que o texto diz sobre a origem da feijoada?", ["que a ideia de que nasceu nas senzalas é provavelmente um mito", "que foi inventada pela cozinheira da princesa Isabel em 1888", "que vem de Angola", "que foi criada em 1888"], "que a ideia de que nasceu nas senzalas é provavelmente um mito"]
      ],
      hunt: { label: "Toque nos nomes das leis (Eusébio, Ventre, Sexagenários, Áurea)", targets:
        ["eusébio", "ventre", "sexagenários", "áurea"] } },

    { id: "c-1922", week: 32, series: "cultura", area: "Arte", n: 8, level: "B2", emoji: "🎭",
      title: "1922: a Semana de Arte Moderna e a antropofagia", grammar: "perfeito, imperfeito e condicional",
      text:
        "Em fevereiro de 1922, no ano do centenário da Independência, um grupo de artistas ocupou " +
        "o Theatro Municipal de São Paulo durante três noites: a Semana de Arte Moderna. Havia " +
        "poemas de Mário de Andrade e Oswald de Andrade, quadros de Anita Malfatti e Di " +
        "Cavalcanti, música de Villa-Lobos. Parte da plateia vaiou, gritou, latiu e miou. Os " +
        "modernistas queriam acabar com a arte acadêmica, que copiava modelos europeus, e " +
        "procurar uma expressão brasileira.\n\n" +
        "Seis anos depois, Oswald publicou o Manifesto Antropófago. A ideia era provocadora: " +
        "assim como os tupinambás devoravam o inimigo para absorver a sua força, o Brasil deveria " +
        "“devorar” a cultura europeia e transformá-la em algo próprio. O manifesto brinca com " +
        "Shakespeare — “Tupi, or not tupi, that is the question” — e é datado do “ano 374 da " +
        "deglutição do Bispo Sardinha”, um bispo português que, segundo a tradição, foi comido " +
        "pelos indígenas caetés em 1556.\n\n" +
        "O manifesto nasceu de um quadro: o Abaporu, que Tarsila do Amaral deu de presente a " +
        "Oswald, então seu marido, no aniversário dele. Abaporu, em tupi, quer dizer “homem que " +
        "come gente”. Hoje o quadro não está no Brasil: desde 1995 pertence a um colecionador " +
        "argentino e é uma das estrelas do MALBA, em Buenos Aires. A antropofagia voltaria nos " +
        "anos 1960 com o tropicalismo de Caetano Veloso e Gilberto Gil.",
      gloss: { centenário: "centenario", ocupou: "ocupó", quadros: "cuadros", plateia: "público, platea",
               vaiou: "abucheó", latiu: "ladró", miou: "maulló", acadêmica: "académica",
               procurar: "buscar", devoravam: "devoraban", inimigo: "enemigo", absorver: "absorber",
               "transformá-la": "transformarla", brinca: "juega", datado: "fechado",
               deglutição: "deglución", bispo: "obispo", presente: "(dar de presente) regalar",
               marido: "marido", aniversário: "cumpleaños", pertence: "pertenece",
               colecionador: "coleccionista" },
      questions: [
        ["Como parte do público reagiu em 1922?", ["vaiou, gritou, latiu e miou", "aplaudiu de pé e pediu outra leitura", "dormiu", "comprou todos os quadros"], "vaiou, gritou, latiu e miou"],
        ["O que o Manifesto Antropófago propunha?", ["«devorar» a cultura europeia e transformá-la em algo próprio", "copiar os modelos europeus", "voltar à cultura indígena e rejeitar tudo o que vinha da Europa", "proibir a arte estrangeira"], "«devorar» a cultura europeia e transformá-la em algo próprio"],
        ["Onde está hoje o Abaporu?", ["no MALBA, em Buenos Aires", "no Theatro Municipal", "em Lisboa", "na casa de Tarsila"], "no MALBA, em Buenos Aires"]
      ],
      hunt: { label: "Toque nos nomes dos artistas (Mário, Oswald, Anita, Tarsila…)", targets:
        ["mário", "oswald", "anita", "cavalcanti", "villa-lobos", "tarsila"] } },

    { id: "c-clarice", week: 33, series: "cultura", area: "Literatura", n: 9, level: "B2", emoji: "⭐",
      title: "Clarice Lispector", grammar: "perfeito, imperfeito e futuro do subjuntivo",
      text:
        "Clarice Lispector nasceu em 1920 numa aldeia da Ucrânia, numa família judia que fugia da " +
        "violência e da guerra civil. Chegou ao Brasil com pouco mais de um ano e cresceu em " +
        "Maceió e no Recife. Aos catorze anos, mudou-se para o Rio, onde estudou Direito e " +
        "trabalhou como jornalista.\n\n" +
        "Em 1943, com 23 anos, publicou Perto do Coração Selvagem, e a crítica se espantou: " +
        "ninguém escrevia assim no Brasil. Nos seus livros, quase nada acontece por fora; tudo " +
        "acontece por dentro. Em A Paixão segundo G.H. (1964), uma mulher vê uma barata no quarto " +
        "da empregada, e esse encontro banal vira uma crise sobre o que é existir.\n\n" +
        "Seu último romance, A Hora da Estrela (1977), começa com a frase “Tudo no mundo começou " +
        "com um sim” e conta a vida de Macabéa, uma moça alagoana, pobre e quase invisível, que " +
        "vive no Rio. O narrador, Rodrigo S.M., é um escritor que não sabe bem como contar uma " +
        "vida tão pequena. Clarice morreu em dezembro daquele mesmo ano, um dia antes de fazer " +
        "57 anos.\n\n" +
        "Hoje ela é uma das escritoras mais citadas da internet — muitas vezes por frases que " +
        "nunca escreveu. Se você encontrar uma citação “de Clarice” numa rede social, desconfie: " +
        "boa parte é falsa, e os estudiosos da obra dela vivem desmentindo as mais populares.",
      gloss: { aldeia: "aldea", judia: "judía", fugia: "huía", cresceu: "creció",
               "mudou-se": "se mudó", espantou: "(se espantou) se asombró", perto: "cerca",
               selvagem: "salvaje", barata: "cucaracha", quarto: "cuarto", empregada: "mucama",
               vira: "se vuelve", romance: "novela", estrela: "estrella", moça: "muchacha",
               alagoana: "del estado de Alagoas", desconfie: "desconfiá", estudiosos: "especialistas",
               desmentindo: "desmintiendo" },
      questions: [
        ["Onde Clarice Lispector nasceu?", ["numa aldeia da Ucrânia", "no Recife", "no Rio", "em Lisboa"], "numa aldeia da Ucrânia"],
        ["O que acontece em A Paixão segundo G.H.?", ["uma mulher vê uma barata e entra numa crise sobre o que é existir", "uma empregada vai embora da casa", "uma família foge da guerra", "um escritor conta a vida de Macabéa, uma moça nordestina que vive no Rio"], "uma mulher vê uma barata e entra numa crise sobre o que é existir"],
        ["O que o texto recomenda sobre as citações de Clarice na internet?", ["desconfiar: muitas são falsas", "compartilhá-las", "compartilhá-las: quase todas são dela", "traduzi-las"], "desconfiar: muitas são falsas"]
      ],
      hunt: { label: "Toque nos verbos no pretérito perfeito da vida de Clarice", targets:
        ["nasceu", "chegou", "cresceu", "mudou-se", "estudou", "trabalhou", "publicou", "espantou", "morreu", "escreveu"] } },

    { id: "c-chico", week: 35, series: "cultura", area: "Política", n: 10, level: "B2", emoji: "🍷",
      title: "Chico Buarque e a censura", grammar: "imperfeito do subjuntivo",
      text:
        "Depois do golpe militar de 1964, a censura foi ficando cada vez mais dura. Com o AI-5, em " +
        "dezembro de 1968, o regime fechou o Congresso, suspendeu o habeas corpus para crimes " +
        "políticos e endureceu a censura: nenhuma letra de música podia ser gravada sem que um " +
        "censor a aprovasse.\n\n" +
        "Chico Buarque, filho do historiador Sérgio Buarque de Holanda, era então um jovem " +
        "compositor de sucesso. Em 1969 foi para a Itália e ficou lá mais de um ano. Na volta, " +
        "lançou “Apesar de Você” (1970), um samba que parecia falar de uma briga de casal. Os " +
        "censores o deixaram passar; quando perceberam quem era o “você”, o disco foi recolhido " +
        "das lojas.\n\n" +
        "Em 1973, Chico e Gilberto Gil compuseram “Cálice”. O título soa igual a “cale-se”, e a " +
        "canção, que retoma a oração de Jesus no Getsêmani, quando ele pede ao Pai que afaste " +
        "dele o cálice, é uma denúncia do silêncio imposto. Proibida, só foi lançada em 1978. Quando os censores " +
        "passaram a vetar qualquer canção que tivesse o nome dele, Chico inventou um compositor, " +
        "Julinho da Adelaide, e conseguiu gravar três músicas antes que a farsa fosse descoberta.\n\n" +
        "A censura acabou de vez com a Constituição de 1988. As canções ficaram, e uma geração " +
        "inteira aprendeu a ler nas entrelinhas.",
      gloss: { golpe: "golpe de Estado", dura: "dura", vez: "(de vez) definitivamente", fechou: "cerró", suspendeu: "suspendió",
               endureceu: "endureció", letra: "letra (de canción)", gravada: "grabada", sucesso: "éxito",
               lançou: "sacó (un disco)", apesar: "(apesar de) a pesar de", briga: "pelea",
               casal: "pareja", censores: "censores", perceberam: "se dieron cuenta",
               recolhido: "retirado", lojas: "negocios", soa: "suena", "cale-se": "callate (cállese)",
               oração: "oración", afaste: "aparte", censor: "censor", vetar: "vetar", farsa: "farsa",
               entrelinhas: "entrelíneas" },
      questions: [
        ["O que aconteceu com «Apesar de Você»?", ["passou pela censura, mas depois o disco foi recolhido", "foi proibida antes da gravação e nunca saiu em disco", "nunca foi lançada", "foi cantada por Gilberto Gil"], "passou pela censura, mas depois o disco foi recolhido"],
        ["Que jogo de palavras há em «Cálice»?", ["soa igual a «cale-se»", "é o nome de uma mulher", "significa «vinho» em latim", "é uma palavra inventada"], "soa igual a «cale-se»"],
        ["Para que Chico inventou Julinho da Adelaide?", ["para os censores não reconhecerem as canções dele", "para vender mais discos com um nome novo e mais jovem", "para cantar na Itália", "para escrever romances"], "para os censores não reconhecerem as canções dele"]
      ],
      hunt: { label: "Toque nas palavras da censura (censura, censores, proibida, vetar…)", targets:
        ["censura", "censores", "proibida", "vetar", "recolhido", "silêncio"] } },

    { id: "c-freire", week: 38, series: "cultura", area: "Educação", n: 11, level: "B2", emoji: "📖",
      title: "Paulo Freire", grammar: "passiva, subjuntivo e citações",
      text:
        "Em 1963, na cidade de Angicos, no sertão do Rio Grande do Norte, cerca de trezentos " +
        "trabalhadores aprenderam a ler e a escrever em pouco mais de um mês. O método era de um " +
        "professor pernambucano, Paulo Freire, nascido no Recife em 1921. Em vez de cartilhas com " +
        "frases como “Eva viu a uva”, Freire partia das “palavras geradoras” da vida dos alunos, " +
        "como tijolo. Aprender a ler a palavra era também aprender a ler o mundo.\n\n" +
        "Depois do golpe de 1964, Freire foi preso e partiu para o exílio, que durou quase " +
        "dezesseis anos. No Chile, escreveu Pedagogia do Oprimido, publicado primeiro no " +
        "exterior e só em 1974 no Brasil. Ali ele critica a “educação bancária”, em que o " +
        "professor “deposita” conteúdos no aluno como se ele fosse um cofre, e defende uma " +
        "educação baseada no diálogo: “ninguém educa ninguém, ninguém educa a si mesmo, os " +
        "homens se educam entre si, mediatizados pelo mundo”.\n\n" +
        "Uma frase muito compartilhada — “Quando a educação não é libertadora, o sonho do " +
        "oprimido é ser o opressor” — não aparece assim no livro: é um resumo, com outras " +
        "palavras, de uma ideia que ele desenvolve.\n\n" +
        "Freire está entre os autores mais citados das ciências humanas no mundo. Em 2012, uma lei " +
        "o declarou Patrono da Educação Brasileira; mesmo assim, poucos nomes provocam tantas " +
        "brigas políticas no país.",
      gloss: { sertão: "interior semiárido", trabalhadores: "trabajadores", cartilhas: "cartillas",
               uva: "uva", geradoras: "generadoras", tijolo: "ladrillo", preso: "preso",
               exílio: "exilio", oprimido: "oprimido", bancária: "bancaria", deposita: "deposita",
               cofre: "caja fuerte", diálogo: "diálogo", mediatizados: "mediados",
               compartilhada: "compartida", libertadora: "liberadora", resumo: "resumen",
               patrono: "patrono", brigas: "peleas" },
      questions: [
        ["De onde partia o método de Freire?", ["de palavras da vida dos alunos", "de frases de cartilha como «Eva viu a uva»", "de textos clássicos", "da gramática latina"], "de palavras da vida dos alunos"],
        ["O que é a «educação bancária»?", ["o professor «deposita» conteúdos no aluno", "ensinar economia", "o aluno pagar ao professor por cada aula", "estudar num banco"], "o professor «deposita» conteúdos no aluno"],
        ["O que acontece com a frase sobre o oprimido e o opressor?", ["não está assim no livro: é um resumo", "é a primeira frase do livro", "foi dita em Angicos", "é de outro autor, chileno"], "não está assim no livro: é um resumo"]
      ],
      hunt: { label: "Toque nas formas de «educar» e «educação»", targets:
        ["educação", "educa", "educam"] } },

    { id: "c-freyre", week: 40, series: "cultura", area: "Sociologia", n: 12, level: "C1", emoji: "🏚️",
      title: "Gilberto Freyre: Casa-Grande & Senzala", grammar: "argumentação e subjuntivo",
      text:
        "Em 1933, um pernambucano de 33 anos, formado nos Estados Unidos, publicou um livro que " +
        "mudou a maneira como o Brasil se via: Casa-Grande & Senzala. Gilberto Freyre, que tinha " +
        "estudado com o antropólogo Franz Boas na Universidade Columbia, recusava as teorias " +
        "racistas então dominantes, segundo as quais a mistura de raças condenaria o país ao " +
        "atraso. Para ele, a mestiçagem não era um defeito, mas a grande originalidade da " +
        "formação brasileira.\n\n" +
        "O livro reconstrói a vida no engenho de açúcar do Nordeste colonial, organizada em torno " +
        "de dois espaços: a casa-grande, onde vivia a família do senhor, e a senzala, onde viviam " +
        "os escravizados. Freyre fala de comida, de sexo, de religião, de doenças, de brincadeiras " +
        "de criança, de palavras. Usa cartas, anúncios de jornal, receitas, diários de viajantes. " +
        "A escrita, cheia de enumerações e de sensualidade, era tão nova quanto as ideias.\n\n" +
        "O problema é o que o livro deixa na sombra. Ao insistir na intimidade entre senhores e " +
        "escravizados, Freyre suaviza a violência da escravidão: a proximidade física, muitas " +
        "vezes, era a do estupro e do castigo. A partir dos anos 1950, pesquisadores como " +
        "Florestan Fernandes mostraram que o preconceito racial no Brasil era real e estruturava " +
        "a sociedade. A chamada “democracia racial” — expressão que não aparece no livro de 1933, " +
        "mas ficou colada a ele — passou a ser vista como um mito, e intelectuais negros como " +
        "Abdias Nascimento e Lélia Gonzalez aprofundaram essa crítica.\n\n" +
        "Por que, então, ainda se lê Freyre? Porque poucos livros descreveram com tanta riqueza o " +
        "cotidiano da colônia e porque, gostemos ou não, ele inventou boa parte das imagens com " +
        "que o Brasil pensa a si mesmo. Discuti-lo continua sendo uma forma de discutir o país.",
      gloss: { recusava: "rechazaba", atraso: "atraso", mestiçagem: "mestizaje", engenho: "ingenio (azucarero)",
               senhor: "amo, señor", escravizados: "esclavizados", doenças: "enfermedades",
               brincadeiras: "juegos", anúncios: "avisos", jornal: "diario", receitas: "recetas",
               viajantes: "viajeros", cheia: "llena", sombra: "sombra", suaviza: "suaviza",
               estupro: "violación", castigo: "castigo", pesquisadores: "investigadores",
               preconceito: "prejuicio", colada: "pegada", aprofundaram: "profundizaron",
               riqueza: "riqueza", cotidiano: "vida cotidiana", gostemos: "(gostemos ou não) nos guste o no",
               "discuti-lo": "discutirlo" },
      questions: [
        ["O que Freyre pensava da mestiçagem?", ["que era a grande originalidade do Brasil", "que condenava o país ao atraso e à pobreza", "que devia ser evitada", "que era uma invenção europeia"], "que era a grande originalidade do Brasil"],
        ["O que o texto critica no livro?", ["que suaviza a violência da escravidão", "que é mal escrito", "que fala de comida", "que é curto demais"], "que suaviza a violência da escravidão"],
        ["O que acontece com a expressão «democracia racial»?", ["não aparece no livro de 1933, mas ficou associada a ele", "é o título do livro", "foi criada por Florestan Fernandes nos anos sessenta para elogiá-lo", "é de Franz Boas"], "não aparece no livro de 1933, mas ficou associada a ele"],
        ["Por que Freyre continua sendo lido, segundo o texto?", ["pela riqueza com que descreve a colônia e pelas imagens com que o Brasil se pensa", "porque tem razão em tudo", "porque é leitura obrigatória na escola", "porque é curto"], "pela riqueza com que descreve a colônia e pelas imagens com que o Brasil se pensa"]
      ],
      hunt: { label: "Toque nos dois espaços do livro (casa-grande, senzala)", targets:
        ["casa-grande", "senzala"] } },

    { id: "c-camoes", week: 41, series: "cultura", area: "Literatura", n: 13, level: "C1", emoji: "⛵",
      title: "As Navegações e Os Lusíadas", grammar: "narrativa histórica",
      text:
        "No século XV, um pequeno reino na ponta ocidental da Europa, com pouco mais de um milhão " +
        "de habitantes, lançou-se ao Atlântico. Depois da conquista de Ceuta, em 1415, os " +
        "navegadores portugueses desceram a costa da África, passaram o cabo da Boa Esperança com " +
        "Bartolomeu Dias, em 1488, e, em 1498, Vasco da Gama chegou a Calecute, na Índia. Dois " +
        "anos depois, a frota de Pedro Álvares Cabral, a caminho do Oriente, tocou a costa de um " +
        "território que viria a se chamar Brasil.\n\n" +
        "Essa epopeia teve o seu poeta: Luís Vaz de Camões. Soldado, perdeu um olho em combate no " +
        "norte da África e passou dezessete anos no Oriente. Segundo a tradição, salvou o " +
        "manuscrito do poema nadando, depois de um naufrágio na foz do rio Mekong; o próprio " +
        "poema menciona o naufrágio, mas a imagem do poeta com o manuscrito erguido sobre as ondas " +
        "é lenda. Publicou Os Lusíadas em 1572, e morreu pobre, em Lisboa, em 1580.\n\n" +
        "O poema tem dez cantos e narra a viagem de Vasco da Gama. Começa assim (em português do " +
        "século XVI):\n\n" +
        "“As armas e os barões assinalados / Que da ocidental praia Lusitana / Por mares nunca de " +
        "antes navegados / Passaram ainda além da Taprobana”\n\n" +
        "O herói não é um homem, mas um povo, os lusos. No canto IV, um velho no cais do Restelo " +
        "condena a ambição das viagens; no canto V, o gigante Adamastor, que personifica o cabo " +
        "das Tormentas, ameaça os navegantes. Essa voz crítica dentro da epopeia é uma das razões " +
        "da sua modernidade.\n\n" +
        "Camões é para o português o que Cervantes é para o espanhol: a língua é chamada, com " +
        "frequência, de “língua de Camões”. O Dia de Portugal, 10 de junho, é a data tradicional " +
        "da sua morte, e o maior prêmio literário da língua, criado por Portugal e pelo Brasil " +
        "em 1988, leva o seu nome.",
      gloss: { reino: "reino", ponta: "punta", "lançou-se": "se lanzó", desceram: "bajaron",
               esperança: "esperanza", frota: "flota", epopeia: "epopeya", olho: "ojo",
               nadando: "nadando", naufrágio: "naufragio", foz: "desembocadura", erguido: "levantado",
               lenda: "leyenda", barões: "varones (barones)", assinalados: "señalados, ilustres",
               lusitana: "portuguesa", taprobana: "(Taprobana) antiguo nombre de Ceilán",
               cais: "muelle", ameaça: "amenaza", tormentas: "tormentas", prêmio: "premio",
               leva: "lleva" },
      questions: [
        ["O que aconteceu em 1498?", ["Vasco da Gama chegou à Índia", "Cabral chegou ao Brasil com sua frota", "Ceuta foi conquistada", "Os Lusíadas foram publicados"], "Vasco da Gama chegou à Índia"],
        ["O que há de lenda na vida de Camões?", ["que salvou o manuscrito nadando com ele erguido", "que perdeu um olho lutando no norte da África", "que viveu no Oriente", "que morreu em Lisboa"], "que salvou o manuscrito nadando com ele erguido"],
        ["Quem é o herói do poema?", ["um povo, os portugueses", "Vasco da Gama sozinho", "Adamastor", "o próprio Camões"], "um povo, os portugueses"],
        ["O que faz o Velho do Restelo?", ["condena a ambição das viagens", "ameaça os navegantes com uma tempestade", "guia a frota", "escreve o poema"], "condena a ambição das viagens"]
      ],
      hunt: { label: "Toque nos lugares da viagem (Ceuta, Calecute, Índia, Mekong…)", targets:
        ["ceuta", "calecute", "índia", "brasil", "oriente", "mekong", "taprobana", "restelo"] } },

    { id: "c-sergio", week: 42, series: "cultura", area: "Sociologia", n: 14, level: "C1", emoji: "❤️",
      title: "Sérgio Buarque e o homem cordial", grammar: "mais-que-perfeito e argumentação",
      text:
        "Em 1936, três anos depois de Casa-Grande & Senzala, outro livro curto e denso propôs uma " +
        "interpretação do Brasil: Raízes do Brasil, de Sérgio Buarque de Holanda, historiador " +
        "paulista que vivera em Berlim no fim dos anos 1920. Das suas ideias, a mais famosa — e a " +
        "mais mal-entendida — é a do “homem cordial”.\n\n" +
        "A expressão não é dele: Sérgio a tomou do escritor Ribeiro Couto e escreveu que “a " +
        "contribuição brasileira para a civilização será de cordialidade — daremos ao mundo o " +
        "‘homem cordial’”. Mas cordial, aqui, não quer dizer gentil nem educado. Vem do latim cor, " +
        "cordis, coração: o homem cordial é aquele que age movido pelo coração, pelas emoções e " +
        "pela intimidade, e não por regras impessoais. Pode ser afetuoso, mas também pode ser " +
        "violento: tanto a amizade quanto a inimizade, diz o autor, nascem do coração.\n\n" +
        "Para Sérgio Buarque, esse traço vem da herança ibérica e da família patriarcal da " +
        "colônia, em que o público e o privado se confundiam. Daí a dificuldade de construir um " +
        "Estado moderno, em que todos sejam tratados da mesma forma pela lei. O funcionário que " +
        "favorece o amigo, o uso do diminutivo para criar intimidade, a vontade de chamar até as " +
        "autoridades pelo primeiro nome: tudo isso seria expressão da cordialidade.\n\n" +
        "O livro provocou polêmica. O poeta Cassiano Ricardo entendeu a cordialidade como bondade " +
        "e discutiu com o autor, que respondeu esclarecendo o sentido do termo. Nas edições " +
        "seguintes, Sérgio reescreveu partes do texto, e os estudiosos até hoje comparam as " +
        "versões.\n\n" +
        "Quase um século depois, a ideia continua viva no debate brasileiro — e continua sendo " +
        "lida ao contrário. Quem diz que “o brasileiro é cordial” para elogiar a simpatia nacional " +
        "repete, sem saber, o equívoco que o próprio autor tentou desfazer. Uma curiosidade: " +
        "Sérgio Buarque é o pai de Chico Buarque.",
      gloss: { denso: "denso", propôs: "propuso", raízes: "raíces", vivera: "había vivido (mais-que-perfeito)",
               "mal-entendida": "malentendida", tomou: "tomó", daremos: "daremos", age: "actúa",
               movido: "movido", regras: "reglas", afetuoso: "afectuoso", inimizade: "enemistad",
               traço: "rasgo", herança: "herencia", privado: "privado", "daí": "de ahí",
               favorece: "favorece", vontade: "ganas", bondade: "bondad",
               esclarecendo: "aclarando", reescreveu: "reescribió", elogiar: "elogiar",
               equívoco: "malentendido", desfazer: "deshacer" },
      questions: [
        ["De onde vem a palavra «cordial» no sentido de Sérgio Buarque?", ["do latim cor, coração", "da cortesia francesa", "de uma palavra tupi", "de Ribeiro Couto, que a inventou com outro sentido"], "do latim cor, coração"],
        ["Como age o «homem cordial»?", ["movido pelas emoções e pela intimidade, não por regras impessoais", "sempre com gentileza", "de acordo com a lei", "com frieza e distância, sempre segundo regras impessoais e escritas"], "movido pelas emoções e pela intimidade, não por regras impessoais"],
        ["Que erro Cassiano Ricardo cometeu?", ["entendeu a cordialidade como bondade", "disse que o livro era dele", "disse que o livro negava a herança ibérica", "reescreveu o livro"], "entendeu a cordialidade como bondade"],
        ["Qual é a relação entre Sérgio Buarque e Chico Buarque?", ["é o pai dele", "é o irmão dele", "é o avô dele", "nenhuma"], "é o pai dele"]
      ],
      hunt: { label: "Toque nas palavras da família de «coração» (cordial, cordialidade…)", targets:
        ["cordial", "cordialidade", "coração", "cor", "cordis"] } },

    { id: "c-vieira", week: 43, series: "cultura", area: "História", n: 15, level: "C1", emoji: "🐟",
      title: "Padre Antônio Vieira", grammar: "narrativa e argumentação",
      text:
        "Nascido em Lisboa em 1608, Antônio Vieira (em Portugal, António) chegou à Bahia com seis " +
        "anos e passou a maior parte da vida no Brasil, onde morreu, em Salvador, em 1697. Jesuíta, " +
        "diplomata, conselheiro do rei D. João IV, missionário na Amazônia, réu da Inquisição: " +
        "poucas vidas do século XVII foram tão movimentadas. Mas Vieira é lembrado sobretudo pelos " +
        "sermões, cerca de duzentos, que fazem dele um dos maiores prosadores da língua. Fernando " +
        "Pessoa o chamou de “Imperador da língua portuguesa”.\n\n" +
        "O mais célebre é talvez o Sermão de Santo Antônio aos Peixes, pregado em São Luís do " +
        "Maranhão em 1654. Como os colonos não queriam ouvi-lo, Vieira imita Santo Antônio, que, " +
        "segundo a lenda, pregou aos peixes, e se dirige a eles. Por trás da alegoria — nos peixes, " +
        "diz ele, os grandes comem os pequenos —, estão os colonos que escravizavam os indígenas. " +
        "Pouco depois, Vieira embarcou para Lisboa para defender junto ao rei leis de proteção " +
        "aos indígenas.\n\n" +
        "A sua posição, porém, tem limites que hoje incomodam. O mesmo pregador que combatia a " +
        "escravização dos indígenas aceitava a escravidão africana, que considerava necessária " +
        "para a colônia; em sermões aos escravizados da Bahia, pedia-lhes paciência e comparava " +
        "o seu sofrimento à Paixão de Cristo. Ler Vieira é também perceber como as ideias de uma " +
        "época convivem com as suas cegueiras.\n\n" +
        "Nos anos 1660, a Inquisição o processou por causa das profecias do Quinto Império, um " +
        "reino universal que Portugal estaria destinado a fundar, ideia ligada às trovas do " +
        "sapateiro Bandarra e à esperança da volta do rei D. Sebastião, desaparecido em combate " +
        "no Marrocos em 1578. Condenado, ficou proibido de pregar, até que a pena foi anulada.\n\n" +
        "Num dos seus sermões mais famosos, o da Sexagésima, pregado em Lisboa em 1655, Vieira " +
        "prega sobre a própria arte de pregar: por que, pergunta, tantas palavras produzem tão " +
        "pouco fruto? É uma pergunta que qualquer professor de línguas conhece bem.",
      gloss: { jesuíta: "jesuita", conselheiro: "consejero", réu: "reo, acusado",
               movimentadas: "agitadas", sermões: "sermones", prosadores: "prosistas",
               pregado: "predicado", colonos: "colonos", "ouvi-lo": "oírlo", lenda: "leyenda",
               pregou: "predicó", alegoria: "alegoría", escravizavam: "esclavizaban",
               embarcou: "se embarcó", incomodam: "molestan", "pedia-lhes": "les pedía",
               sofrimento: "sufrimiento", cegueiras: "cegueras", ligada: "ligada, vinculada",
               trovas: "coplas", sapateiro: "zapatero", desaparecido: "desaparecido",
               anulada: "anulada", fruto: "fruto" },
      questions: [
        ["Por que Vieira prega aos peixes?", ["porque os colonos não queriam ouvi-lo", "porque era uma tradição do Maranhão", "porque o rei pediu", "porque estava num navio"], "porque os colonos não queriam ouvi-lo"],
        ["Quem são os «peixes grandes que comem os pequenos»?", ["os colonos que escravizavam os indígenas", "os jesuítas", "os holandeses", "os reis de Portugal e seus governadores no Brasil"], "os colonos que escravizavam os indígenas"],
        ["Que limite do pensamento dele o texto aponta?", ["aceitava a escravidão africana", "não acreditava em Deus", "odiava os indígenas", "defendia a Inquisição e seus castigos"], "aceitava a escravidão africana"],
        ["Por que a Inquisição o processou?", ["pelas profecias do Quinto Império", "por defender os indígenas contra os colonos", "por roubo", "por escrever em português"], "pelas profecias do Quinto Império"]
      ],
      hunt: { label: "Toque nas formas de «pregar» e «sermão» (pregado, pregou, sermões…)", targets:
        ["sermões", "sermão", "pregado", "pregou", "pregador", "pregar", "prega"] } },

    { id: "c-1755", week: 44, series: "cultura", area: "História", n: 16, level: "C1", emoji: "🌋",
      title: "Lisboa, 1755: o terremoto e Pombal", grammar: "narrativa e subjuntivo",
      text:
        "Na manhã de 1º de novembro de 1755, dia de Todos os Santos, com as igrejas cheias, Lisboa " +
        "tremeu. Foram três abalos em poucos minutos. Quem correu para a beira do Tejo, fugindo " +
        "dos desabamentos, foi atingido pelas ondas de um tsunami; o que sobrou foi consumido por " +
        "incêndios que duraram dias. Morreram dezenas de milhares de pessoas, e uma das cidades " +
        "mais ricas da Europa, porta de entrada do ouro do Brasil, ficou em ruínas.\n\n" +
        "O abalo foi também filosófico. Se Deus é bom e este é o melhor dos mundos possíveis, " +
        "como explicar uma catástrofe que atingiu os fiéis em plena missa? Voltaire escreveu o " +
        "Poema sobre o Desastre de Lisboa e, poucos anos depois, Cândido, em que ridiculariza o " +
        "otimismo de Leibniz. Rousseau respondeu que a culpa era também dos homens, que " +
        "construíam cidades densas demais. Há quem considere 1755 o primeiro desastre “moderno”: " +
        "discutido em toda a Europa e estudado com questionários enviados às paróquias.\n\n" +
        "Quem assumiu a reconstrução foi o ministro Sebastião José de Carvalho e Melo, futuro " +
        "Marquês de Pombal. Atribui-se a ele a frase “Enterrar os mortos e cuidar dos vivos”, mas " +
        "não há prova de que a tenha dito, e há versões que a põem na boca de outros nobres da " +
        "corte. Certo é o que ele fez: a Baixa foi reconstruída com ruas retas, quarteirões " +
        "regulares e prédios com uma estrutura interna de madeira, a “gaiola pombalina”, pensada " +
        "para resistir a novos tremores.\n\n" +
        "Pombal governou com mão de ferro por mais de vinte anos. Expulsou os jesuítas de " +
        "Portugal e do Brasil em 1759, perseguiu a alta nobreza e reformou a Universidade de " +
        "Coimbra. Foi também no seu governo, em 1763, que a capital do Brasil passou de Salvador " +
        "para o Rio de Janeiro, mais perto das minas de ouro. Para os cariocas, o terremoto de " +
        "Lisboa não é uma história tão distante.",
      gloss: { igrejas: "iglesias", cheias: "llenas", tremeu: "tembló", abalos: "sacudidas, temblores",
               beira: "orilla", desabamentos: "derrumbes", atingido: "alcanzado", sobrou: "quedó en pie",
               consumido: "consumido", ouro: "oro", ruínas: "ruinas", fiéis: "fieles",
               missa: "misa", ridiculariza: "ridiculiza", densas: "densas", questionários: "cuestionarios",
               paróquias: "parroquias", "atribui-se": "se atribuye", enterrar: "enterrar",
               cuidar: "cuidar", prova: "prueba", retas: "rectas", quarteirões: "manzanas",
               prédios: "edificios", madeira: "madera", gaiola: "jaula", ferro: "hierro",
               expulsou: "expulsó", minas: "minas" },
      questions: [
        ["O que aconteceu com quem fugiu para a beira do Tejo?", ["foi atingido por um tsunami", "se salvou em barcos", "foi preso pela polícia", "viu o incêndio de longe"], "foi atingido por um tsunami"],
        ["O que Voltaire ridiculariza em Cândido?", ["o otimismo de Leibniz", "os jesuítas", "o rei de Portugal", "a ciência moderna"], "o otimismo de Leibniz"],
        ["O que se sabe da frase «enterrar os mortos e cuidar dos vivos»?", ["não há provas de que Pombal a tenha dito", "Pombal a disse num discurso", "é de Voltaire", "está escrita na lei da reconstrução"], "não há provas de que Pombal a tenha dito"],
        ["Qual é a relação de Pombal com o Rio de Janeiro?", ["no governo dele, o Rio passou a ser a capital do Brasil", "nasceu no Rio", "reconstruiu o Rio depois de um terremoto que o destruiu", "expulsou os cariocas"], "no governo dele, o Rio passou a ser a capital do Brasil"]
      ],
      hunt: { label: "Toque nas palavras da catástrofe (abalos, tsunami, incêndios…)", targets:
        ["abalos", "desabamentos", "tsunami", "incêndios", "ruínas", "catástrofe", "tremores", "terremoto"] } },

    { id: "c-darcy", week: 45, series: "cultura", area: "Antropologia", n: 17, level: "C1", emoji: "🌎",
      title: "Darcy Ribeiro e o povo brasileiro", grammar: "argumentação e condicional",
      text:
        "Antropólogo, educador, romancista, político: Darcy Ribeiro (1922-1997) fez tanta coisa " +
        "que é difícil resumi-lo. Nos anos 1940 e 1950, viveu longos períodos entre povos " +
        "indígenas, como os kadiwéu e os urubu-kaapor, e participou da criação do Parque " +
        "Indígena do Xingu. Nos anos 1960, foi o primeiro reitor da Universidade de Brasília, que " +
        "planejou com Anísio Teixeira, e chefe da Casa Civil do presidente João Goulart. Com o " +
        "golpe de 1964, partiu para o exílio. De volta, como vice-governador do Rio de Janeiro, " +
        "criou com Leonel Brizola os CIEPs, escolas de tempo integral projetadas por Niemeyer, e " +
        "idealizou o Sambódromo, que hoje leva o seu nome.\n\n" +
        "O livro que resume a sua visão do país saiu em 1995, dois anos antes de sua morte: O " +
        "Povo Brasileiro. Nele, Darcy descreve o Brasil como um “povo novo”, nascido do encontro " +
        "— violento — de três matrizes: a indígena, a portuguesa e a africana. Os filhos desse " +
        "encontro já não se reconheciam como indígenas, nem como portugueses, nem como africanos: " +
        "eram, por assim dizer, ninguém. Dessa “ninguendade”, segundo Darcy, nasceu a " +
        "necessidade de inventar uma identidade nova, a brasileira.\n\n" +
        "O livro percorre também os “Brasis” regionais — o crioulo, o caboclo, o sertanejo, o " +
        "caipira, o sulino — e não esconde o preço dessa formação: o extermínio indígena, a " +
        "escravidão, uma elite que, na visão do autor, sempre tratou o povo como mão de obra " +
        "descartável. Mas o tom final é de esperança: o Brasil seria uma nova Roma, uma " +
        "civilização mestiça e tropical ainda por se realizar.\n\n" +
        "Hoje, muitos criticam o livro por ser generalizante e por falar em nome de povos que o " +
        "autor, afinal, observava de fora. Outros o leem como um grande manifesto. Em qualquer " +
        "caso, poucos escreveram sobre o Brasil com tanta paixão — e com tanto humor.",
      gloss: { romancista: "novelista", "resumi-lo": "resumirlo", reitor: "rector", planejou: "planificó",
               chefe: "jefe", "exílio": "exilio", integral: "(tempo integral) jornada completa",
               idealizou: "ideó", matrizes: "matrices, raíces", reconheciam: "reconocían",
               ninguendade: "«ningunidad» (palabra de Darcy)", percorre: "recorre",
               caboclo: "mestizo de blanco e indígena", sertanejo: "del sertón",
               caipira: "campesino del interior paulista", sulino: "del Sur", preço: "precio",
               extermínio: "exterminio", "obra": "(mão de obra) mano de obra", descartável: "descartable",
               esperança: "esperanza", generalizante: "generalizador", afinal: "al fin y al cabo",
               leem: "leen" },
      questions: [
        ["O que Darcy Ribeiro fez nos anos 1960?", ["foi o primeiro reitor da Universidade de Brasília", "construiu o Sambódromo", "escreveu O Povo Brasileiro", "foi presidente"], "foi o primeiro reitor da Universidade de Brasília"],
        ["Quais são as três matrizes do povo brasileiro, segundo Darcy?", ["a indígena, a portuguesa e a africana", "a europeia, a asiática e a norte-americana", "a do Norte, a do Sul e a do Centro", "a católica, a judaica e a africana"], "a indígena, a portuguesa e a africana"],
        ["O que é a «ninguendade»?", ["não se reconhecer nem como indígena, nem como português, nem como africano", "a falta de escolas", "o exílio de Darcy", "um povo indígena"], "não se reconhecer nem como indígena, nem como português, nem como africano"],
        ["O que alguns criticam hoje no livro?", ["que generaliza e fala por povos que observava de fora", "que é curto demais e deixa de fora os povos indígenas do Sul", "que não fala do Brasil", "que não tem humor"], "que generaliza e fala por povos que observava de fora"]
      ],
      hunt: { label: "Toque nos «Brasis» regionais e nas três matrizes", targets:
        ["indígena", "portuguesa", "africana", "crioulo", "caboclo", "sertanejo", "caipira", "sulino"] } },

    { id: "c-pessoa", week: 46, series: "cultura", area: "Literatura", n: 18, level: "C1", emoji: "🎩",
      title: "Fernando Pessoa, um e muitos", grammar: "narrativa e citações em português europeu",
      text:
        "Quando morreu, em Lisboa, em 1935, Fernando Pessoa tinha publicado em português um único " +
        "livro, Mensagem. Deixou, porém, uma arca com mais de 25 mil papéis, que os pesquisadores " +
        "até hoje organizam. Ali estava um dos maiores poetas do século XX — ou melhor, vários.\n\n" +
        "Pessoa criou os heterônimos: não simples pseudônimos, mas autores completos, com " +
        "biografia, estilo e visão de mundo próprios. Alberto Caeiro, o mestre, é um poeta do campo " +
        "que quer ver as coisas sem pensar nelas. Ricardo Reis, médico e monarquista, escreve odes " +
        "clássicas à maneira de Horácio. Álvaro de Campos, engenheiro naval, passa da euforia " +
        "futurista ao cansaço e à angústia. E há Bernardo Soares, um “semi-heterônimo”, a quem " +
        "Pessoa atribuiu o Livro do Desassossego. Numa carta de 1935, Pessoa conta que, num " +
        "“dia triunfal” de março de 1914, escreveu de uma vez mais de trinta poemas de Caeiro; os " +
        "estudiosos, examinando os manuscritos, mostraram que a história foi, no mínimo, embelezada.\n\n" +
        "Em “Autopsicografia”, Pessoa definiu a sua arte (os versos são de um poeta português, " +
        "mas aqui a grafia coincide com a brasileira):\n\n" +
        "“O poeta é um fingidor. / Finge tão completamente / Que chega a fingir que é dor / A dor " +
        "que deveras sente.”\n\n" +
        "Duas frases “de Pessoa” merecem cuidado. “Minha pátria é a língua portuguesa” é mesmo " +
        "dele — de Bernardo Soares — e é muito citada no Brasil. Já “Navegar é preciso, viver não " +
        "é preciso” não é invenção sua: Pessoa a apresenta como uma frase gloriosa de navegadores " +
        "antigos, e ela remonta ao general romano Pompeu, segundo Plutarco. Caetano Veloso a levou " +
        "para a canção “Os Argonautas”.\n\n" +
        "Fica uma pergunta: se os heterônimos discordam entre si, qual deles é o verdadeiro " +
        "Pessoa? Talvez nenhum; talvez o verdadeiro Pessoa seja justamente o drama de ser muitos.",
      gloss: { arca: "baúl", papéis: "papeles", pesquisadores: "investigadores", heterônimos: "heterónimos",
               mestre: "maestro", monarquista: "monárquico", odes: "odas", engenheiro: "ingeniero",
               cansaço: "cansancio", desassossego: "desasosiego", triunfal: "triunfal",
               estudiosos: "especialistas", embelezada: "embellecida", grafia: "ortografía",
               fingidor: "fingidor", deveras: "de veras", pátria: "patria",
               preciso: "necesario", remonta: "se remonta", discordam: "discrepan",
               justamente: "justamente" },
      questions: [
        ["O que é um heterônimo, segundo o texto?", ["um autor completo, com biografia e estilo próprios", "um pseudônimo qualquer, sem biografia nem estilo próprio", "um personagem de romance", "um poema longo"], "um autor completo, com biografia e estilo próprios"],
        ["O que os especialistas descobriram sobre o «dia triunfal»?", ["que a história foi, no mínimo, embelezada", "que foi em 1935", "que os poemas desse dia eram de Ricardo Reis", "que Caeiro nunca existiu"], "que a história foi, no mínimo, embelezada"],
        ["De quem vem «Navegar é preciso»?", ["do general romano Pompeu, segundo Plutarco", "de Pessoa", "de Camões, no canto primeiro de Os Lusíadas", "de Caetano Veloso"], "do general romano Pompeu, segundo Plutarco"],
        ["O que quer dizer «preciso» nessa frase?", ["necessário", "exato", "caro", "rápido"], "necessário"]
      ],
      hunt: { label: "Toque nos sobrenomes dos heterônimos (Caeiro, Reis, Campos, Soares)", targets:
        ["caeiro", "reis", "campos", "soares"] } },

    { id: "c-cravos", week: 47, series: "cultura", area: "Política", n: 19, level: "C1", emoji: "🌹",
      title: "O Estado Novo e o 25 de Abril", grammar: "narrativa histórica",
      text:
        "Durante quase meio século, Portugal viveu sob uma ditadura. António de Oliveira Salazar, " +
        "professor de economia em Coimbra, entrou no governo como ministro das Finanças em 1928 e, " +
        "em 1932, tornou-se chefe do governo. No ano seguinte, uma nova Constituição criou o " +
        "Estado Novo: partido único, censura prévia, uma polícia política — mais tarde chamada " +
        "PIDE — que prendia e torturava opositores, e o lema “Deus, Pátria, Família”.\n\n" +
        "A partir de 1961, o regime enfrentou guerras de independência em Angola, na " +
        "Guiné-Bissau e em Moçambique. Enquanto outras potências europeias se retiravam da " +
        "África, Salazar insistia em manter as colônias; num discurso de 1965, falou em lutar " +
        "“orgulhosamente sós”. A guerra durou treze anos, mobilizou uma geração inteira de jovens " +
        "e empurrou centenas de milhares de portugueses para a emigração, sobretudo para a França.\n\n" +
        "Salazar se afastou em 1968, depois de um acidente, e Marcelo Caetano o substituiu sem " +
        "mudar o essencial. Foram os próprios militares, cansados da guerra, que puseram fim ao " +
        "regime. Na noite de 24 de abril de 1974, uma rádio de Lisboa tocou “E Depois do Adeus”; " +
        "pouco depois da meia-noite, a Rádio Renascença transmitiu “Grândola, Vila Morena”, de " +
        "Zeca Afonso. Era o sinal: as tropas do Movimento das Forças Armadas saíram dos quartéis. " +
        "Em Lisboa, uma mulher, Celeste Caeiro, que levava cravos de um restaurante, deu uma flor " +
        "a um soldado, que a colocou no cano do fuzil. Outros fizeram o mesmo, e a revolução " +
        "ganhou nome: a Revolução dos Cravos.\n\n" +
        "Caetano se rendeu no mesmo dia e partiu para o exílio — no Rio de Janeiro, onde morreu " +
        "em 1980. Nos dois anos seguintes, Guiné-Bissau, Moçambique, Cabo Verde, São Tomé e " +
        "Príncipe e Angola tornaram-se independentes, e centenas de milhares de “retornados” " +
        "chegaram a Portugal. No Brasil, ainda sob ditadura, Chico Buarque saudou a revolução em " +
        "“Tanto Mar”; a letra foi censurada, e a primeira gravação saiu apenas com a melodia.",
      gloss: { ditadura: "dictadura", "tornou-se": "se convirtió en", chefe: "jefe", prévia: "previa",
               prendia: "encarcelaba", torturava: "torturaba", opositores: "opositores", lema: "lema",
               enfrentou: "enfrentó", potências: "potencias", retiravam: "(se retiravam) se retiraban",
               "orgulhosamente": "orgullosamente", "sós": "solos", empurrou: "empujó",
               afastou: "(se afastou) se apartó", substituiu: "reemplazó", puseram: "pusieron",
               sinal: "señal", quartéis: "cuarteles", tocou: "pasó", chegaram: "llegaron", apenas: "solo", cravos: "claveles", cano: "caño",
               fuzil: "fusil", rendeu: "(se rendeu) se rindió", retornados: "repatriados",
               saudou: "saludó", censurada: "censurada", gravação: "grabación" },
      questions: [
        ["O que foi o Estado Novo?", ["a ditadura de Salazar em Portugal", "a ditadura militar do Brasil nos anos sessenta", "um partido de oposição", "uma revolução de 1974"], "a ditadura de Salazar em Portugal"],
        ["Que sinal fez as tropas saírem?", ["a canção «Grândola, Vila Morena» no rádio", "um tiro de canhão", "um discurso de Marcelo Caetano na televisão", "os sinos de Lisboa"], "a canção «Grândola, Vila Morena» no rádio"],
        ["Por que se chama Revolução dos Cravos?", ["porque os soldados puseram cravos nos fuzis", "porque foi feita na primavera", "porque Salazar tinha proibido a venda de flores em Lisboa", "por causa de uma canção de Chico Buarque"], "porque os soldados puseram cravos nos fuzis"],
        ["Onde Marcelo Caetano morreu?", ["no Rio de Janeiro", "em Lisboa", "em Paris", "em Luanda"], "no Rio de Janeiro"]
      ],
      hunt: { label: "Toque nos países que se tornaram independentes (Angola, Moçambique…)", targets:
        ["angola", "guiné-bissau", "moçambique", "cabo", "verde", "são", "tomé", "príncipe"] } },

    { id: "c-damatta", week: 48, series: "cultura", area: "Sociologia", n: 20, level: "C1", emoji: "🎟️",
      title: "DaMatta e Schwarz: o jeitinho e as ideias fora do lugar", grammar: "argumentação e voz passiva",
      text:
        "Nos anos 1970, dois intelectuais olharam para o Brasil por ângulos diferentes e deixaram " +
        "expressões que entraram na linguagem comum.\n\n" +
        "O antropólogo Roberto DaMatta, em Carnavais, Malandros e Heróis (1979), estudou os " +
        "rituais brasileiros — o Carnaval, as paradas militares, as procissões — e também um " +
        "ritual do dia a dia: a pergunta “Você sabe com quem está falando?”. Quando uma regra " +
        "impessoal ameaça alguém (uma fila, uma multa, uma porta fechada), essa pessoa abandona a " +
        "igualdade e invoca a hierarquia: o cargo, o sobrenome, as relações. Para DaMatta, o Brasil " +
        "oscila entre o indivíduo, sujeito às leis, e a pessoa, protegida pelas relações. Daí a " +
        "distinção, desenvolvida em A Casa e a Rua (1985), entre dois espaços com morais diferentes.\n\n" +
        "O jeitinho é a versão amável do mesmo dilema: em vez de enfrentar a lei ou impor a " +
        "hierarquia, negocia-se, conversa-se, apela-se à simpatia, e dá-se um jeito. DaMatta não o " +
        "via apenas como corrupção, mas como uma forma de navegar entre a lei e as relações " +
        "pessoais — o que não significa que o considerasse inofensivo.\n\n" +
        "Já o crítico literário Roberto Schwarz, no ensaio “As ideias fora do lugar” (1973), partiu " +
        "de um paradoxo do século XIX: o Brasil independente adotou o liberalismo europeu — " +
        "liberdade, trabalho livre, igualdade perante a lei — numa sociedade escravista. As ideias " +
        "liberais estavam fora do lugar, mas nem por isso deixavam de funcionar: serviam de " +
        "ornamento e de prestígio. Entre os proprietários e os homens livres pobres, a relação " +
        "dominante não era o contrato, e sim o favor. Schwarz mostrou como Machado de Assis " +
        "transformou esse desajuste em forma literária. O ensaio provocou décadas de debate: " +
        "outros estudiosos responderam que as ideias nunca estão exatamente no lugar em país " +
        "nenhum.\n\n" +
        "Lidos juntos, DaMatta e Schwarz ajudam a entender por que, no Brasil, a lei e o favor, a " +
        "regra e a exceção convivem tanto — e por que um estrangeiro como o Martín demora a " +
        "perceber que um “vamos marcar!” muitas vezes quer dizer “nunca”.",
      gloss: { malandros: "pícaros, vivos", paradas: "desfiles", procissões: "procesiones",
               regra: "regla", ameaça: "amenaza", fila: "cola, fila", multa: "multa",
               sobrenome: "apellido", "daí": "de ahí", amável: "amable",
               "negocia-se": "se negocia", "apela-se": "se apela", "dá-se": "se da",
               jeito: "(dar um jeito) arreglárselas", inofensivo: "inofensivo", ensaio: "ensayo",
               perante: "ante", escravista: "esclavista", serviam: "servían", desajuste: "desajuste",
               estrangeiro: "extranjero", demora: "tarda", marcar: "(vamos marcar) arreglemos un día" },
      questions: [
        ["Quando aparece o «Você sabe com quem está falando?», segundo DaMatta?", ["quando uma regra impessoal ameaça alguém", "no Carnaval", "quando alguém se apresenta numa festa formal", "nas procissões"], "quando uma regra impessoal ameaça alguém"],
        ["Como DaMatta via o «jeitinho»?", ["como um modo de navegar entre a lei e as relações, não só como corrupção", "como pura corrupção, um vício a eliminar com leis mais duras e castigos", "como algo inofensivo", "como uma invenção portuguesa"], "como um modo de navegar entre a lei e as relações, não só como corrupção"],
        ["Por que as ideias liberais estavam «fora do lugar»?", ["porque foram adotadas numa sociedade escravista", "porque vinham da Ásia", "porque ninguém as conhecia", "porque o Império as proibiu"], "porque foram adotadas numa sociedade escravista"],
        ["Que relação dominava entre proprietários e homens livres pobres, segundo Schwarz?", ["o favor", "o contrato", "a lei", "a amizade"], "o favor"]
      ],
      hunt: { label: "Toque nos conceitos-chave (jeitinho, favor, hierarquia, indivíduo, pessoa…)", targets:
        ["jeitinho", "favor", "hierarquia", "indivíduo", "pessoa", "lei", "regra"] } },

    { id: "c-saramago", week: 49, series: "cultura", area: "Literatura", n: 21, level: "C1", emoji: "🌳",
      title: "José Saramago", grammar: "narrativa e variação",
      text:
        "“O homem mais sábio que conheci em toda a minha vida não sabia ler nem escrever.” Assim " +
        "começa o discurso que José Saramago leu em Estocolmo em dezembro de 1998, ao receber o " +
        "único Prêmio Nobel de Literatura dado até hoje a um autor de língua portuguesa. O homem " +
        "era o seu avô, Jerônimo, criador de porcos em Azinhaga, no Ribatejo, que nas noites " +
        "quentes de verão dormia debaixo de uma figueira e contava histórias ao neto.\n\n" +
        "Filho de camponeses pobres, Saramago não chegou à universidade: formou-se numa escola " +
        "técnica e trabalhou como serralheiro mecânico, funcionário público, tradutor e " +
        "jornalista. Só se tornou um romancista conhecido depois dos cinquenta anos, com " +
        "Levantado do Chão (1980) e, sobretudo, Memorial do Convento (1982), sobre a construção " +
        "do convento de Mafra no século XVIII — obra de um rei, mas também de milhares de " +
        "trabalhadores anônimos, que o romance faz questão de lembrar.\n\n" +
        "Quem abre um livro de Saramago estranha a pontuação: frases de uma página inteira, " +
        "diálogos sem travessão nem aspas, separados apenas por vírgulas e letras maiúsculas. É " +
        "um estilo que imita o ritmo da fala e obriga o leitor a ler com atenção — de preferência " +
        "em voz alta.\n\n" +
        "Em 1991, O Evangelho segundo Jesus Cristo provocou escândalo. No ano seguinte, um " +
        "subsecretário de Estado do governo português vetou a candidatura do livro a um prêmio " +
        "literário europeu, alegando que ofendia os católicos. Saramago, indignado, mudou-se para " +
        "Lanzarote, nas Canárias, onde viveu até morrer, em 2010. Os romances desse período são " +
        "fábulas sobre o presente: em Ensaio sobre a Cegueira (1995), uma epidemia de “cegueira " +
        "branca” revela o pior e o melhor de uma sociedade. Em O Ano da Morte de Ricardo Reis " +
        "(1984), ele já tinha dado vida própria a um heterônimo de Pessoa.\n\n" +
        "Nota de língua: no Brasil, os livros de Saramago são publicados com a ortografia e a " +
        "gramática do original, em português europeu. O leitor brasileiro encontra neles “estava " +
        "a fazer” (e não “estava fazendo”), “o comboio” (o trem) e “a rapariga” (a moça) — palavra " +
        "que, no Brasil, é ofensiva.",
      gloss: { sábio: "sabio", avô: "abuelo", criador: "criador", quentes: "calurosas",
               figueira: "higuera", neto: "nieto", camponeses: "campesinos",
               "formou-se": "se recibió", serralheiro: "cerrajero", tradutor: "traductor",
               romancista: "novelista", "chão": "suelo", anônimos: "anónimos",
               questão: "(fazer questão de) empeñarse en", estranha: "extraña", pontuação: "puntuación",
               travessão: "raya (de diálogo)", aspas: "comillas", vírgulas: "comas",
               vetou: "vetó", alegando: "alegando", ofendia: "ofendía", cegueira: "ceguera",
               comboio: "tren (en Portugal)", rapariga: "chica (en Portugal); ofensivo en Brasil" },
      questions: [
        ["Quem era o homem mais sábio que Saramago conheceu?", ["o avô, que não sabia ler nem escrever", "o professor da escola técnica", "Fernando Pessoa", "um rei português"], "o avô, que não sabia ler nem escrever"],
        ["O que a pontuação de Saramago tem de estranho?", ["diálogos sem travessões nem aspas, separados por vírgulas e maiúsculas", "não usa pontos", "escreve tudo em maiúsculas", "usa pontos de interrogação e exclamação no começo, como em espanhol"], "diálogos sem travessões nem aspas, separados por vírgulas e maiúsculas"],
        ["Por que ele foi morar em Lanzarote?", ["porque o governo vetou a candidatura de um livro dele a um prêmio", "porque ganhou o Nobel e queria viver em paz, longe dos jornalistas", "porque se aposentou", "por causa do clima"], "porque o governo vetou a candidatura de um livro dele a um prêmio"],
        ["O que o leitor brasileiro encontra nos livros dele?", ["o português europeu: «estava a fazer», «o comboio»", "o português do Brasil de sempre: «estava fazendo», «o trem»", "traduções para o espanhol", "notas em inglês"], "o português europeu: «estava a fazer», «o comboio»"]
      ],
      hunt: { label: "Toque nas palavras da pontuação (pontuação, travessão, aspas…)", targets:
        ["pontuação", "travessão", "aspas", "vírgulas", "maiúsculas"] } },

    { id: "c-saudade", week: 50, series: "cultura", area: "Filosofia", n: 22, level: "C1", emoji: "🎶",
      title: "Eduardo Lourenço e a saudade", grammar: "ensaio e argumentação",
      text:
        "Diz-se muitas vezes que “saudade” é uma palavra que só existe em português e que não se " +
        "pode traduzir. A primeira parte é exagerada: o galego também tem saudade, e muitas " +
        "línguas têm palavras para a falta de quem se ama e está longe. A segunda é meia verdade: " +
        "não há um equivalente exato em espanhol, e “extrañar”, “añoranza” e “nostalgia” dividem " +
        "entre si o que a saudade diz de uma vez só. O que é certo é que os portugueses pensam a " +
        "saudade há muito tempo: já no século XV, o rei D. Duarte dedicou-lhe um capítulo do Leal " +
        "Conselheiro, distinguindo-a da simples tristeza.\n\n" +
        "No século XX, o ensaísta Eduardo Lourenço (1923-2020) fez da saudade uma chave para " +
        "entender Portugal. Em O Labirinto da Saudade (1978), escrito logo depois da Revolução dos " +
        "Cravos e do fim do império, ele propõe uma “psicanálise mítica do destino português”. A " +
        "sua tese: Portugal viveu séculos com uma imagem irreal de si mesmo, oscilando entre a " +
        "grandeza das Navegações e o sentimento de ser um país pequeno e periférico. O Estado Novo " +
        "cultivou essa imagem; o 25 de Abril e a perda das colônias obrigaram o país a encarar o " +
        "próprio tamanho. A saudade, nesse quadro, é a forma portuguesa de se relacionar com o " +
        "tempo: um passado que não passa e um futuro imaginado como regresso. Lourenço viveu mais " +
        "de meio século fora de Portugal, na França, e pensou o país sempre à distância — talvez " +
        "não por acaso.\n\n" +
        "O fado é a música dessa emoção. Nascido nos bairros populares de Lisboa no século XIX, " +
        "com possíveis raízes no lundu e na modinha, gêneros que vieram do Brasil, ficou conhecido " +
        "no mundo pela voz de Amália Rodrigues e é, desde 2011, Patrimônio Cultural Imaterial da " +
        "Humanidade.\n\n" +
        "No Brasil, a saudade é mais leve e mais cotidiana: “estou com saudade de você”, “que " +
        "saudade!”, “vim matar a saudade”. Em Portugal, é comum o plural e outra construção: " +
        "“tenho saudades tuas” (português europeu). Depois de um ano no Rio, o Martín descobriu " +
        "que tem saudade de Buenos Aires — e já sabe que, se um dia voltar, vai ter saudade do Rio.",
      gloss: { traduzir: "traducir", exagerada: "exagerada", galego: "gallego", falta: "falta, ausencia",
               meia: "media", equivalente: "equivalente", "dedicou-lhe": "le dedicó",
               leal: "leal", conselheiro: "consejero", "distinguindo-a": "distinguiéndola",
               ensaísta: "ensayista", chave: "llave, clave", labirinto: "laberinto",
               psicanálise: "psicoanálisis", irreal: "irreal", grandeza: "grandeza",
               periférico: "periférico", perda: "pérdida", encarar: "enfrentar", tamanho: "tamaño",
               regresso: "regreso", acaso: "(por acaso) casualidad", lundu: "danza afrobrasileña",
               modinha: "canción sentimental brasileña", imaterial: "inmaterial", leve: "liviana",
               matar: "(matar a saudade) volver a ver lo que se extrañaba", tuas: "tuyas" },
      questions: [
        ["É verdade que «saudade» só existe em português?", ["não: o galego também tem, e outras línguas têm palavras parecidas", "sim, é única no mundo", "sim: nenhuma outra língua do mundo tem palavra para isso, nem o galego", "não: vem do espanhol"], "não: o galego também tem, e outras línguas têm palavras parecidas"],
        ["Quem já escreveu sobre a saudade no século XV?", ["o rei D. Duarte", "Camões", "Eduardo Lourenço", "Amália Rodrigues"], "o rei D. Duarte"],
        ["Segundo Lourenço, o que obrigou Portugal a encarar o próprio tamanho?", ["o 25 de Abril e a perda das colônias", "o terremoto de 1755", "a entrada de Portugal na Comunidade Europeia", "o fado"], "o 25 de Abril e a perda das colônias"],
        ["Como se diz «sinto sua falta» em Portugal, segundo o texto?", ["tenho saudades tuas", "estou com saudade de você", "vim matar a saudade", "que saudade"], "tenho saudades tuas"]
      ],
      hunt: { label: "Toque em todas as saudades", targets: ["saudade", "saudades"] } },

    { id: "c-mia", week: 51, series: "cultura", area: "Literatura", n: 23, level: "C1", emoji: "🌍",
      title: "Mia Couto e a lusofonia africana", grammar: "variação e argumentação",
      text:
        "O português é língua oficial em nove países de quatro continentes, e a maior parte dos " +
        "seus falantes está no Brasil. Mas o futuro da língua talvez se decida na África: segundo " +
        "as projeções demográficas, Angola e Moçambique terão, ao longo deste século, cada vez " +
        "mais falantes.\n\n" +
        "Em Moçambique, o português convive com dezenas de línguas bantas, como o macua, o changana " +
        "e o sena. É língua materna de uma minoria, embora seja falado por cerca de metade da " +
        "população. É nessa fronteira entre línguas que escreve Mia Couto, nascido na Beira em " +
        "1955, filho de portugueses e biólogo de profissão. O seu primeiro romance, Terra " +
        "Sonâmbula (1992), se passa durante a guerra civil que devastou o país depois da " +
        "independência: um velho e um menino caminham por uma estrada cheia de mortos e encontram " +
        "cadernos que contam outra história, feita de sonhos. Um júri reunido no Zimbábue o " +
        "escolheu entre os doze melhores livros africanos do século XX.\n\n" +
        "A marca mais conhecida de Mia Couto são as palavras que ele inventa, fundindo duas numa " +
        "só: o título Estórias Abensonhadas junta “abençoadas” e “sonhadas”. Para ele, o português " +
        "de Moçambique não é um desvio do português de Lisboa, mas uma língua que também se " +
        "tornou africana.\n\n" +
        "Angola tem a sua própria constelação de escritores: Pepetela, Ondjaki, José Eduardo " +
        "Agualusa, que viveu no Rio de Janeiro. Cabo Verde deu ao mundo a morna de Cesária " +
        "Évora, cantada em crioulo cabo-verdiano, uma língua nascida do português; desde 2019, a " +
        "morna é Patrimônio Imaterial da Humanidade. Em 1996, os países de língua portuguesa " +
        "criaram a CPLP, a Comunidade dos Países de Língua Portuguesa.\n\n" +
        "Quando um brasileiro e um moçambicano conversam, às vezes estranham palavras, sotaques e " +
        "construções: em Maputo, como em Lisboa, se diz “estou a ler”; no Rio, “estou lendo”. Mia " +
        "Couto recebeu o Prêmio Camões em 2013. Ler os africanos é descobrir que a língua do " +
        "Martín — e a sua — é muito maior que o Brasil.",
      gloss: { falantes: "hablantes", projeções: "proyecciones", convive: "convive",
               dezenas: "decenas", bantas: "bantúes", materna: "materna", embora: "aunque",
               fronteira: "frontera", biólogo: "biólogo", romance: "novela",
               sonâmbula: "sonámbula", devastou: "devastó", velho: "viejo", menino: "chico",
               estrada: "ruta", cheia: "llena", cadernos: "cuadernos", sonhos: "sueños",
               júri: "jurado", fundindo: "fundiendo", estórias: "historias, cuentos",
               abençoadas: "benditas", desvio: "desvío", tornou: "(se tornou) se volvió",
               morna: "género musical de Cabo Verde", estranham: "les resultan raras",
               sotaques: "tonadas, acentos" },
      questions: [
        ["Onde o futuro do português pode ser decidido, segundo o texto?", ["na África", "em Portugal", "no Brasil", "na Ásia"], "na África"],
        ["O que o velho e o menino encontram em Terra Sonâmbula?", ["cadernos que contam outra história", "um tesouro escondido debaixo de um baobá", "um caminhão", "os pais"], "cadernos que contam outra história"],
        ["O que o título «Estórias Abensonhadas» junta?", ["«abençoadas» e «sonhadas»", "«histórias» e «estrelas»", "duas línguas bantas", "português e inglês"], "«abençoadas» e «sonhadas»"],
        ["Como se diz «estou lendo» em Maputo?", ["estou a ler", "estou lendo", "estou ler", "leio agora"], "estou a ler"]
      ],
      hunt: { label: "Toque nos países e cidades da lusofonia", targets:
        ["brasil", "angola", "moçambique", "beira", "lisboa", "zimbábue", "cabo", "verde", "maputo", "rio"] } },

    /* ---------------------------------------------- Enchentes.
       Input flood + realce textual (Trahey & White 1993; Lee & Huang 2008):
       una estructura que el español no tiene o usa distinto, repetida muchas
       veces en un texto natural; primero se lee sin marcas, después con la
       estructura resaltada.  `flood.forms` son los tokens exactos (en
       minúscula) que se resaltan en la segunda lectura; la caza usa los
       mismos. */

    { id: "fl-contracoes", week: 6, series: "flood", n: 1, level: "A1", emoji: "🏖️",
      title: "Um domingo no Arpoador", grammar: "contrações com de e em",
      flood: { target: "contrações (no, na, do, da, num…)", forms: ["no", "na", "nas", "do", "da", "dos", "num", "numa", "neste", "dela"], n: 35,
               es: "Fijate en las contracciones: em + o = no, de + a = da, em + um = num, de + ela = dela. En español solo tenemos «al» y «del»; en portugués son obligatorias y están en casi todas las oraciones." },
      text:
        "O domingo do Martín começa cedo. Às sete, ele toma café na padaria da esquina, no térreo " +
        "do prédio. Depois pega o ônibus na praça e desce no Arpoador, entre Ipanema e Copacabana.\n\n" +
        "Na praia, o Martín caminha na areia e olha os surfistas no mar. Num quiosque do calçadão, " +
        "compra uma água de coco. O vendedor é da Bahia e mora no Rio há dez anos.\n" +
        "— Eu gosto do Rio, mas sinto falta da comida da minha terra — diz ele.\n\n" +
        "Às onze, a Bia chega com duas amigas dela, a Lu e a Carol. As três moram nas ladeiras de " +
        "Santa Teresa e trabalham no centro da cidade. Elas estendem as cangas na areia, perto dos " +
        "pescadores, e ficam ali, no sol, até a hora do almoço.\n\n" +
        "Eles almoçam num restaurante pequeno numa rua de Ipanema. Neste restaurante, o prato do " +
        "dia é peixe com arroz e feijão. Depois, voltam para a praia: no fim da tarde, todo mundo " +
        "aplaude o pôr do sol nas pedras do Arpoador. O Martín não entende:\n" +
        "— Vocês aplaudem o sol?\n" +
        "— Aqui a gente aplaude — responde a Bia. — É a melhor parte do domingo.",
      gloss: { gosto: "(gosto do Rio) me gusta Río", neste: "en este (em + este)", dela: "de ella (de + ela)", cedo: "temprano", padaria: "panadería", esquina: "esquina", térreo: "planta baja",
               prédio: "edificio", pega: "toma", ônibus: "colectivo", desce: "baja", areia: "arena",
               quiosque: "quiosco", calçadão: "rambla, paseo costero", "água": "(água de coco) agua de coco",
               mora: "vive", "há": "(há dez anos) hace diez años", falta: "(sentir falta de) extrañar",
               terra: "tierra (de origen)", ladeiras: "calles en pendiente", estendem: "extienden",
               cangas: "pareos (para tirarse en la arena)", pescadores: "pescadores", "almoço": "almuerzo",
               peixe: "pescado", feijão: "porotos", aplaude: "aplaude", "pôr": "(pôr do sol) atardecer",
               pedras: "piedras" },
      questions: [
        ["¿Dónde desayuna Martín?", ["en la panadería de la esquina", "en la playa", "en la casa de Bia, en la cocina", "en un quiosco"], "en la panadería de la esquina"],
        ["¿Qué extraña el vendedor de coco?", ["la comida de su tierra", "a su familia", "el frío", "el mar de Bahía"], "la comida de su tierra"],
        ["¿Qué hace la gente al final de la tarde en el Arpoador?", ["aplaude la puesta del sol", "se va a su casa antes de que oscurezca", "baila samba", "surfea"], "aplaude la puesta del sol"]
      ],
      hunt: { label: "Tocá todas las contracciones (no, na, do, da, num, dela…)", targets:
        ["no", "na", "nas", "do", "da", "dos", "num", "numa", "neste", "dela"] } },

    { id: "fl-agente", week: 6, series: "flood", n: 2, level: "A1", emoji: "🏠",
      title: "A gente, lá em casa", grammar: "a gente + verbo no singular",
      flood: { target: "a gente = nós", forms: ["gente"], n: 14,
               es: "Mirá «a gente»: en Brasil es la forma normal de decir «nosotros» cuando se habla, y el verbo va en singular, como con «ele»: «a gente mora», «a gente vai». «Nós moramos» es lo mismo, más formal." },
      text:
        "Na nossa casa, em Santa Teresa, a gente divide tudo. A gente divide a geladeira, o " +
        "banheiro, a conta de luz e, às vezes, a última fatia de pizza. A gente não tem " +
        "lava-louças, então a gente lava tudo à mão depois do jantar.\n\n" +
        "De manhã, a gente acorda cedo por causa do bonde. O bonde passa na nossa rua às sete e " +
        "faz um barulho enorme. A gente nem ouve mais. O gato, sim: ele odeia o bonde.\n\n" +
        "No sábado, a gente faz faxina. Eu limpo a cozinha, o Martín limpa a sala e o gato dorme " +
        "no sofá. Depois a gente vai à feira e compra fruta para a semana.\n\n" +
        "Em casa, a gente fala português, sempre. Quando o Martín não sabe uma palavra, a gente " +
        "procura no dicionário, ou ele faz mímica. A gente ri muito.\n\n" +
        "À noite, a gente janta na varanda e olha as luzes da cidade lá embaixo. A gente não tem " +
        "muito dinheiro, e a casa é pequena. Mas a gente é feliz assim.",
      gloss: { causa: "(por causa de) por, a causa de", divide: "comparte", geladeira: "heladera", banheiro: "baño", conta: "cuenta, factura",
               fatia: "porción, tajada", "lava-louças": "lavavajillas", acorda: "se despierta",
               cedo: "temprano", bonde: "tranvía", barulho: "ruido", nem: "ni", ouve: "oye",
               odeia: "odia", faxina: "limpieza general", limpo: "limpio", procura: "busca",
               mímica: "mímica", ri: "se ríe", janta: "cena", varanda: "balcón",
               embaixo: "(lá embaixo) allá abajo", dinheiro: "plata" },
      questions: [
        ["¿Por qué se despiertan temprano?", ["por el tranvía, que pasa a las siete", "por el gato", "por el trabajo, que empieza a las ocho", "por la feria"], "por el tranvía, que pasa a las siete"],
        ["¿Qué hacen el sábado?", ["limpieza general y después van a la feria", "van a la playa", "duermen hasta tarde y después van a la playa", "cocinan pizza"], "limpieza general y después van a la feria"],
        ["¿Qué hacen cuando Martín no sabe una palabra?", ["la buscan en el diccionario o él hace mímica", "hablan en español", "llaman a la mamá de Bia para que les traduzca", "no hablan más"], "la buscan en el diccionario o él hace mímica"]
      ],
      hunt: { label: "Tocá todos los «gente» de «a gente»", targets: ["gente"] } },

    { id: "fl-gerundio", week: 8, series: "flood", n: 3, level: "A1", emoji: "🚲",
      title: "Domingo na orla", grammar: "estar + gerúndio",
      flood: { target: "estar + gerúndio", forms: ["olhando", "fazendo", "correndo", "andando", "jogando", "passeando", "passando", "gritando", "vendendo", "comendo", "chegando", "saindo"], n: 17,
               es: "Fijate en «estar + gerúndio» (está correndo, estão jogando): en Brasil es la forma de decir lo que pasa ahora mismo. En Portugal se dice «estar a + infinitivo» («está a correr»). En español existe, pero en Brasil se usa todavía más." },
      text:
        "É domingo de manhã em Copacabana, e a avenida Atlântica está fechada para os carros. O " +
        "Martín está sentado num banco do calçadão, olhando o movimento. Todo mundo está fazendo " +
        "alguma coisa.\n\n" +
        "Um senhor de oitenta anos está correndo de sunga. Duas meninas estão andando de " +
        "bicicleta, e um cachorro está correndo atrás delas. Na areia, um grupo de amigos está " +
        "jogando futevôlei, e outro está fazendo aula de ioga. Na ciclovia, um casal está passeando com " +
        "um carrinho de bebê.\n\n" +
        "Um vendedor está passando com um isopor enorme e gritando: “Olha o mate! Olha o biscoito " +
        "Globo!” Perto do posto 5, uma senhora está vendendo milho verde, e uma família inteira " +
        "está comendo na sombra.\n\n" +
        "O telefone toca. É a Bia.\n" +
        "— Onde você está? O que você está fazendo?\n" +
        "— Estou sentado no calçadão, olhando as pessoas. E você?\n" +
        "— Estou chegando! Estou saindo do metrô agora.\n\n" +
        "O Martín sorri. No Rio, até quem está parado está fazendo alguma coisa.",
      gloss: { delas: "de ellas (atrás delas = detrás de ellas)", até: "hasta, incluso", fechada: "cerrada", sentado: "sentado", banco: "banco (para sentarse)", calçadão: "rambla, paseo costero",
               olhando: "mirando", movimento: "movimiento", correndo: "corriendo", sunga: "malla (de hombre)",
               meninas: "chicas", andando: "(andar de bicicleta) andar en bicicleta", cachorro: "perro",
               atrás: "atrás", areia: "arena", jogando: "jugando", "futevôlei": "fútbol-vóley",
               isopor: "conservadora", gritando: "gritando", mate: "mate helado (bebida de playa)",
               biscoito: "galletita", posto: "(posto 5) puesto de guardavidas, referencia en la playa",
               milho: "(milho verde) choclo", ciclovia: "bicisenda", carrinho: "(carrinho de bebê) cochecito", sombra: "sombra", toca: "suena",
               chegando: "llegando", saindo: "saliendo", parado: "quieto" },
      questions: [
        ["¿Qué hace el señor de ochenta años?", ["corre en malla", "vende choclo", "juega al fútbol-vóley", "hace yoga"], "corre en malla"],
        ["¿Qué vende el vendedor del isopor?", ["mate y galletitas", "choclo", "agua de coco y cerveza", "helados"], "mate y galletitas"],
        ["¿Dónde está Bia cuando llama?", ["saliendo del subte", "en la playa", "en casa", "en el colectivo"], "saliendo del subte"]
      ],
      hunt: { label: "Tocá todos los gerundios (olhando, correndo…)", targets:
        ["olhando", "fazendo", "correndo", "andando", "jogando", "passeando", "passando", "gritando", "vendendo", "comendo", "chegando", "saindo"] } },

    { id: "fl-dele", week: 10, series: "flood", n: 4, level: "A2", emoji: "🧊",
      title: "De quem é?", grammar: "dele, dela, deles, delas",
      flood: { target: "dele / dela", forms: ["dele", "dela", "deles", "delas"], n: 15,
               es: "Mirá «dele / dela» (de él, de ella): van después de la cosa («o irmão dela») y sacan la duda de «seu», que puede ser de você, de él o de ella. En español «su» también es ambiguo y también se puede aclarar con «de él / de ella», pero en portugués esa solución es la normal." },
      text:
        "A geladeira da casa de Santa Teresa é pequena, e a Bia e o Martín têm uma regra: cada um " +
        "tem a sua prateleira. A de cima é dela, a de baixo é dele. Mas hoje a Carol e o irmão " +
        "dela, o Rafa, estão lá também, e ninguém sabe mais de quem é cada coisa.\n\n" +
        "— Este iogurte é seu? — pergunta o Rafa ao Martín.\n" +
        "— Não, é da Bia. É dela. O meu é o de coco.\n" +
        "— E a cerveja?\n" +
        "— A cerveja é dele — diz a Bia, olhando para o Martín. — Mas o queijo é meu.\n" +
        "— Seu? — pergunta a Carol.\n" +
        "— Meu, não: do Martín. É dele. Perdão, Martín!\n\n" +
        "O problema do “seu” é esse: “seu” pode ser de você, dele ou dela. Por isso, quando falam " +
        "de outra pessoa, os brasileiros preferem “dele” e “dela”. E para duas pessoas, “deles” " +
        "e “delas”: a casa é deles, as bicicletas são delas.\n\n" +
        "No fim, o Rafa encontra uma caixa de chocolate no fundo da geladeira.\n" +
        "— E isto? É de quem?\n" +
        "A Bia e o Martín olham para a Carol.\n" +
        "— É dela! — dizem os dois.\n" +
        "A Carol fica vermelha:\n" +
        "— Tá bom, é meu. Mas hoje é de todo mundo.",
      gloss: { geladeira: "heladera", regra: "regla", prateleira: "estante", cima: "(de cima) de arriba",
               baixo: "(de baixo) de abajo", irmão: "hermano", ninguém: "nadie", iogurte: "yogur",
               cerveja: "cerveza", queijo: "queso", caixa: "caja", fundo: "fondo",
               vermelha: "colorada", "tá": "(tá bom) bueno, está bien (coloquial)" },
      questions: [
        ["¿De quién es el estante de arriba?", ["de Bia", "de Martín", "de Carol", "de Rafa"], "de Bia"],
        ["¿Por qué los brasileños prefieren «dele» y «dela»?", ["porque «seu» puede ser de você, de él o de ella", "porque «seu» es grosero", "porque es más corto", "porque «seu» se usa solo en Portugal, no en Brasil"], "porque «seu» puede ser de você, de él o de ella"],
        ["¿De quién es el chocolate?", ["de Carol", "de Bia", "de Martín", "de Rafa"], "de Carol"]
      ],
      hunt: { label: "Tocá todos los dele, dela, deles, delas", targets: ["dele", "dela", "deles", "delas"] } },

    { id: "fl-gostar", week: 14, series: "flood", n: 5, level: "A2", emoji: "🍮",
      title: "Do que você gosta?", grammar: "gostar de",
      flood: { target: "gostar de", forms: ["gosta", "gosto", "gostam", "gostamos", "gostei", "gostou"], n: 17,
               es: "Fijate en «gostar de»: al revés que «gustar», el que gusta es el sujeto y la cosa va con «de» («eu gosto de samba» = me gusta el samba). Con artículo, se contrae: «gosto do Rio», «gosta da praia»." },
      text:
        "No domingo, a Bia leva o Martín para almoçar com a família dela em Niterói. A mãe da " +
        "Bia, dona Cida, quer saber tudo.\n\n" +
        "— Martín, você gosta de feijoada?\n" +
        "— Gosto muito! Gostei desde a primeira vez que comi.\n" +
        "— E de caipirinha, você gosta?\n" +
        "— Gosto, mas só de uma. Duas já é demais.\n\n" +
        "O pai da Bia, seu Tonico, quer saber de que time o Martín gosta.\n" +
        "— No Rio, eu gosto do Flamengo — diz o Martín, para agradar.\n" +
        "— Flamengo? Nesta casa, a gente gosta do Botafogo! — responde ele, sério. Todo mundo ri.\n\n" +
        "O irmão da Bia pergunta:\n" +
        "— E de música, do que você gosta?\n" +
        "— Gosto de samba, de bossa nova e de tango, claro.\n" +
        "— Nós gostamos de pagode. E a Bia, gosta de tango?\n" +
        "— Ela gosta de dançar, mas não gosta de acordar cedo — diz o Martín.\n" +
        "— Meus filhos gostam de tudo, menos de acordar cedo — ri a dona Cida.\n\n" +
        "No fim do almoço, ela serve um pudim de leite.\n" +
        "— Gostou?\n" +
        "— Adorei. Gostei tanto que quero a receita.",
      gloss: { leva: "lleva", almoçar: "almorzar", dona: "doña, señora", caipirinha: "trago de cachaça con lima",
               demais: "demasiado", time: "equipo (de fútbol)", agradar: "quedar bien",
               "sério": "serio", irmão: "hermano", pagode: "pagode (un tipo de samba)",
               acordar: "despertarse", cedo: "temprano", menos: "menos", serve: "sirve",
               pudim: "flan", leite: "leche", adorei: "me encantó", receita: "receta" },
      questions: [
        ["¿Qué pasa con la caipirinha?", ["a Martín le gusta, pero solo una", "no le gusta", "toma muchas", "no le gusta: prefiere la cerveza"], "a Martín le gusta, pero solo una"],
        ["¿De qué equipo es la familia de Bia?", ["del Botafogo", "del Flamengo", "de Boca", "del Vasco"], "del Botafogo"],
        ["¿Qué pide Martín al final?", ["la receta del flan", "otra caipirinha", "más feijoada", "un café"], "la receta del flan"]
      ],
      hunt: { label: "Tocá todas las formas de gostar", targets:
        ["gosta", "gosto", "gostam", "gostamos", "gostei", "gostou"] } },

    { id: "fl-proclise", week: 16, series: "flood", n: 6, level: "A2", emoji: "📱",
      title: "Me liga!", grammar: "pronome antes do verbo (próclise)",
      flood: { target: "me / te / se antes del verbo", forms: ["me", "te", "se", "liga-me", "espero-te"], n: 18,
               es: "Mirá dónde va el pronombre: en el Brasil que habla va antes del verbo, incluso al principio de la frase («Me liga!», «Te espero»), cosa imposible en español («¡Llamame!»). En Portugal va después: «Liga-me», «Espero-te»." },
      text:
        "Quando falam, os brasileiros colocam o pronome antes do verbo, até no começo da frase. " +
        "Veja as mensagens do Martín e da Bia numa quinta-feira qualquer.\n\n" +
        "Bia: Bom dia! Me manda uma mensagem na hora do almoço?\n" +
        "Martín: Claro. Te mando uma foto do metrô lotado.\n" +
        "Bia: Me liga depois? Preciso te contar uma coisa.\n" +
        "Martín: Te ligo em cinco minutos. Estou numa reunião.\n" +
        "Bia: Sabe a Carol? Ela se mudou! Agora mora em Botafogo e me chamou para a festa de sábado.\n" +
        "Martín: Que legal! Ela te convidou e me convidou também?\n" +
        "Bia: Convidou a gente. Ela disse: “Me traz o argentino!”\n" +
        "Martín: Então me espera às oito na porta do metrô.\n" +
        "Bia: Te espero. Mas não se atrasa, hein!\n" +
        "Martín: Eu? Me atrasar? Nunca!\n\n" +
        "Em Portugal, na fala e na escrita, é normal o pronome depois do verbo: “Liga-me”, " +
        "“Espero-te”. No Brasil, isso soa formal demais numa mensagem. Mas atenção: na escrita " +
        "formal brasileira, a gramática ainda pede para não começar a frase com “me” ou “te”.",
      gloss: { colocam: "ponen", "começo": "comienzo", veja: "mirá (fijate)", manda: "mandá",
               lotado: "lleno de gente", liga: "llamá (por teléfono)", preciso: "necesito",
               contar: "contar", "reunião": "reunión", mudou: "(se mudou) se mudó", chamou: "invitó, llamó",
               legal: "bárbaro (coloquial)", convidou: "invitó", traz: "traé", espera: "esperá",
               atrasa: "(não se atrasa) no llegues tarde (coloquial)", hein: "eh", "soa": "suena",
               pede: "pide", escrita: "escritura" },
      questions: [
        ["¿Adónde se mudó Carol?", ["a Botafogo", "a Santa Teresa", "a Niterói", "a Copacabana"], "a Botafogo"],
        ["¿Dónde se encuentran el sábado?", ["en la puerta del subte, a las ocho", "en la casa de Carol", "en la playa", "en la puerta del trabajo de Martín, a las siete"], "en la puerta del subte, a las ocho"],
        ["¿Qué dice el texto de la escritura formal en Brasil?", ["la gramática pide no empezar la frase con «me» o «te»", "que se usa siempre «me liga»", "que se escribe exactamente igual que en los mensajes de WhatsApp", "que no se usan pronombres"], "la gramática pide no empezar la frase con «me» o «te»"]
      ],
      hunt: { label: "Tocá todos los pronombres me, te, se (y los de Portugal)", targets:
        ["me", "te", "se", "liga-me", "espero-te"] } },

    { id: "fl-tenhofeito", week: 21, series: "flood", n: 7, level: "B1", emoji: "🌧️",
      title: "Tem chovido muito", grammar: "pretérito perfeito composto",
      flood: { target: "tenho feito (perfeito composto)", forms: ["tem", "têm", "tenho", "sido", "chegado", "passado", "trabalhado", "dormido", "reclamado", "colocado", "vendido", "feito", "visto", "cozinhado", "estudado", "falado", "sonhado", "chovido"], n: 34,
               es: "Fijate en «ter + participio» (tenho estudado, tem chovido): no es el «he estudiado» del español, sino algo que se viene repitiendo hasta hoy («vengo estudiando»). «He estudiado» en portugués es casi siempre «estudei»." },
      text:
        "Faz três semanas que chove no Rio quase todo dia, e a vida na casa de Santa Teresa tem " +
        "sido complicada.\n\n" +
        "O Martín tem chegado atrasado ao trabalho, porque o bonde não tem passado e as ladeiras " +
        "parecem rios. A Bia tem trabalhado de casa, na mesa da cozinha, com o gato no colo.\n" +
        "— Esse gato tem dormido mais do que nunca — diz ela.\n\n" +
        "Os vizinhos também têm reclamado. A dona Lurdes, do térreo, tem colocado baldes na sala " +
        "por causa das goteiras. O seu Almir, do boteco, tem vendido mais caldo verde do que chope.\n\n" +
        "— E você, o que tem feito à noite? — pergunta a Carol, por mensagem.\n" +
        "— Tenho visto muitas séries e tenho cozinhado. Nunca cozinhei tanto na vida.\n" +
        "— E o português?\n" +
        "— Tenho estudado todo dia. E tenho falado muito com o seu Almir.\n\n" +
        "Atenção: “tenho estudado” não é “estudei”. Quando o Martín diz “estudei”, fala de uma " +
        "vez só, de uma coisa que acabou. “Tenho estudado” é uma coisa que se repete e continua " +
        "até hoje. E em espanhol, “he estudiado” quase sempre se traduz por “estudei”.\n\n" +
        "No domingo, finalmente, o sol aparece. O Martín abre a janela e diz:\n" +
        "— Tem chovido tanto que eu tenho sonhado com este dia.",
      gloss: { causa: "(por causa de) por, a causa de", chove: "llueve", atrasado: "tarde", bonde: "tranvía", ladeiras: "calles en pendiente",
               colo: "regazo", vizinhos: "vecinos", reclamado: "quejado", térreo: "planta baja",
               baldes: "baldes", goteiras: "goteras", boteco: "bar de barrio",
               caldo: "(caldo verde) sopa de papa y col, de origen portugués", chope: "chopp",
               séries: "series", cozinhado: "cocinado", acabou: "terminó", sonhado: "soñado",
               chovido: "llovido", janela: "ventana" },
      questions: [
        ["¿Por qué Martín viene llegando tarde al trabajo?", ["porque el tranvía no pasa y las calles parecen ríos", "porque se queda dormido todas las mañanas desde que se mudó", "porque se mudó", "porque trabaja de noche"], "porque el tranvía no pasa y las calles parecen ríos"],
        ["¿Qué viene vendiendo seu Almir?", ["más caldo verde que chopp", "más chopp que caldo verde", "paraguas", "nada"], "más caldo verde que chopp"],
        ["¿Cómo se traduce casi siempre «he estudiado»?", ["estudei", "tenho estudado", "estudava", "tinha estudado"], "estudei"]
      ],
      hunt: { label: "Tocá los auxiliares (tenho, tem, têm) y sus participios", targets:
        ["tem", "têm", "tenho", "sido", "chegado", "passado", "trabalhado", "dormido", "reclamado", "colocado", "vendido", "feito", "visto", "cozinhado", "estudado", "falado", "sonhado", "chovido"] } },

    { id: "fl-futsubj", week: 27, series: "flood", n: 8, level: "B1", emoji: "🎆",
      title: "Réveillon em Copacabana", grammar: "futuro do subjuntivo",
      flood: { target: "futuro do subjuntivo", forms: ["passar", "sair", "quiser", "puder", "deixar", "vier", "der", "tiver", "chover", "houver", "acabar"], n: 11,
               es: "Mirá el futuro do subjuntivo después de «se», «quando» y «quem» hablando del futuro: «se você quiser» (si querés), «quando der meia-noite» (cuando sean las doce). El español lo perdió y usa el presente; en portugués es obligatorio." },
      text:
        "Se você passar o Réveillon no Rio, vai ver a maior festa de Ano-Novo do Brasil: mais de " +
        "dois milhões de pessoas na praia de Copacabana. Aqui vão as dicas da Bia para o Martín.\n\n" +
        "Quando você sair de casa, vá de branco: a tradição diz que traz paz. Se quiser seguir as " +
        "superstições, use também uma peça da cor do seu desejo para o ano novo: amarelo para " +
        "dinheiro, vermelho para amor.\n\n" +
        "Se puder, vá de metrô, mas compre o bilhete antes: se deixar para a última hora, vai " +
        "ficar horas na fila. Os carros não entram no bairro, e quem vier de ônibus vai ter que " +
        "andar bastante.\n\n" +
        "Quando der meia-noite, começam os fogos, que duram mais de dez minutos. Depois, se tiver " +
        "coragem, entre no mar e pule sete ondas, fazendo um pedido em cada uma. Muita gente também " +
        "leva flores brancas para Iemanjá, a rainha do mar.\n\n" +
        "E se chover? Ninguém liga. Enquanto houver fogos, ninguém vai embora. E, quando tudo " +
        "acabar, faça como os cariocas: fique na areia até o sol nascer.",
      gloss: { "réveillon": "fiesta de Año Nuevo", dicas: "consejos", traz: "trae", peça: "prenda",
               desejo: "deseo", amarelo: "amarillo", dinheiro: "plata", vermelho: "rojo",
               bilhete: "boleto", fila: "fila, cola", bairro: "barrio", fogos: "fuegos artificiales",
               coragem: "coraje", pule: "saltá", ondas: "olas", pedido: "deseo, pedido",
               rainha: "reina", liga: "(ninguém liga) a nadie le importa", houver: "haya",
               embora: "(ir embora) irse", areia: "arena", nascer: "salir (el sol)" },
      questions: [
        ["De que cor a tradição manda se vestir?", ["de branco", "de vermelho", "de amarelo", "de preto"], "de branco"],
        ["O que acontece se você deixar o bilhete do metrô para a última hora?", ["vai pegar horas de fila", "não vai poder entrar na praia", "fica mais barato", "nada"], "vai pegar horas de fila"],
        ["O que se faz no mar depois dos fogos?", ["pular sete ondas fazendo um pedido em cada uma", "nadar até uma boia e voltar antes do amanhecer", "jogar garrafas", "tomar banho de roupa vermelha"], "pular sete ondas fazendo um pedido em cada uma"]
      ],
      hunt: { label: "Toque nos verbos no futuro do subjuntivo (quiser, puder, der…)", targets:
        ["passar", "sair", "quiser", "puder", "deixar", "vier", "der", "tiver", "chover", "houver", "acabar"] } },

    { id: "fl-infpessoal", week: 29, series: "flood", n: 9, level: "B2", emoji: "🥾",
      title: "Trilha no Dois Irmãos", grammar: "infinitivo pessoal",
      flood: { target: "infinitivo pessoal", forms: ["sairmos", "pegarmos", "chegarmos", "beberem", "começarmos", "pegarem", "estarem", "pararmos", "tirarmos", "voltarmos"], n: 12,
               es: "Fijate en el infinitivo con persona: «para chegarmos» (para que lleguemos), «é importante vocês beberem» (es importante que ustedes tomen). El español necesita «que» + subjuntivo; el portugués le pone la persona al infinitivo." },
      text:
        "No sábado, a Bia, o Martín, a Carol e o Rafa vão subir o Morro Dois Irmãos: a trilha " +
        "começa no Vidigal e termina com uma vista de Ipanema e do Leblon de tirar o fôlego. O " +
        "Rafa, que é guia, manda um áudio no grupo com as instruções:\n\n" +
        "“Pessoal, é melhor sairmos cedo, antes das sete, para não pegarmos o sol forte na " +
        "subida. Para chegarmos lá em cima a tempo, vocês precisam estar no metrô às seis e meia. " +
        "Levem água: é importante vocês beberem bastante. E, antes de começarmos, a gente toma um " +
        "açaí na entrada da comunidade.\n\n" +
        "No Vidigal, é mais fácil vocês pegarem um mototáxi até o começo da trilha. A subida é " +
        "curta, mas é íngreme: sem estarem acostumados, vocês vão sentir as pernas. Não tem " +
        "problema nenhum pararmos para descansar.\n\n" +
        "Lá em cima, depois de tirarmos as fotos, a gente desce devagar. E, por favor: ao " +
        "voltarmos, ninguém deixa lixo na trilha.”\n\n" +
        "O Martín escuta o áudio duas vezes.\n" +
        "— Por que ele fala “sairmos”, “chegarmos”?\n" +
        "— Porque o infinitivo, em português, pode ter pessoa — explica a Bia. — Assim ninguém " +
        "tem dúvida de quem vai fazer o quê.",
      gloss: { trilha: "sendero", "fôlego": "(de tirar o fôlego) que te deja sin aliento", guia: "guía",
               pessoal: "gente, chicos", cedo: "temprano", subida: "subida", levem: "lleven",
               açaí: "açaí (pulpa helada de una fruta amazónica)", comunidade: "favela, barrio popular",
               mototáxi: "moto que funciona como taxi", íngreme: "empinada", acostumados: "acostumbrados",
               pernas: "piernas", descansar: "descansar", desce: "baja", devagar: "despacio",
               lixo: "basura", escuta: "escucha" },
      questions: [
        ["Por que é melhor sair cedo?", ["para não pegar sol forte na subida", "porque a favela fecha", "porque o metrô para de funcionar no meio da manhã", "para ver o nascer do sol"], "para não pegar sol forte na subida"],
        ["Como eles chegam ao começo da trilha?", ["de mototáxi", "a pé, de Ipanema", "de ônibus", "de teleférico"], "de mototáxi"],
        ["Segundo a Bia, para que serve o infinitivo pessoal?", ["para não haver dúvida sobre quem faz o quê", "para falar de modo mais formal", "para falar do passado", "para dar ordens"], "para não haver dúvida sobre quem faz o quê"]
      ],
      hunt: { label: "Toque em todos os infinitivos pessoais (sairmos, beberem…)", targets:
        ["sairmos", "pegarmos", "chegarmos", "beberem", "começarmos", "pegarem", "estarem", "pararmos", "tirarmos", "voltarmos"] } },

    { id: "fl-passivase", week: 32, series: "flood", n: 10, level: "B2", emoji: "🪧",
      title: "Placas do Rio", grammar: "voz passiva com se",
      flood: { target: "voz passiva com se", forms: ["aluga-se", "vendem-se", "consertam-se", "fazem-se", "aceitam-se", "se", "vende-se", "procura-se", "precisa-se"], n: 15,
               es: "Mirá el «se» de los carteles: «vendem-se pranchas» es «se venden tablas», y el verbo concuerda con la cosa, como en español. En la escritura va pegado con guion después del verbo; con «não» va antes («não se aceitam»)." },
      text:
        "Andando pelo Rio, o Martín começou a colecionar placas. Tira fotos e manda para a mãe, " +
        "em Buenos Aires, com uma explicação.\n\n" +
        "Num prédio de Santa Teresa: “Aluga-se apartamento de dois quartos com vista para o " +
        "Centro”. Numa loja de Copacabana: “Vendem-se pranchas usadas” e “Consertam-se " +
        "bicicletas”. Num chaveiro da Lapa: “Fazem-se cópias de chaves na hora”. Numa padaria do " +
        "Catete: “Aceitam-se cartões” e, logo embaixo, “Não se aceitam cheques”. Num boteco de " +
        "Botafogo, escrito à mão: “Vende-se gelo”.\n\n" +
        "A mãe pergunta por que o verbo às vezes está no plural. O Martín explica: “Aqui o se é " +
        "passivo: pranchas são vendidas, então vendem-se pranchas. O verbo concorda com a coisa, " +
        "como no espanhol: se venden tablas.”\n\n" +
        "Mas na rua ele também vê “Aluga-se quartos” e “Vende-se salgados”. A Bia ri:\n" +
        "— A gramática diz que está errado, mas muita gente sente esse se como sujeito " +
        "indeterminado, como em “precisa-se de ajudante”. Nesse caso, o verbo fica no singular.\n\n" +
        "Na última foto, numa porta do Jardim Botânico: “Procura-se cachorro perdido. Atende " +
        "pelo nome de Pipoca.” O Martín escreve embaixo: “Mãe, aqui é singular: um cachorro só. " +
        "Tomara que ele apareça.”",
      gloss: { colecionar: "coleccionar", placas: "carteles", "aluga-se": "se alquila", quartos: "dormitorios",
               loja: "negocio", pranchas: "tablas (de surf)", usadas: "usadas",
               "consertam-se": "se arreglan", chaveiro: "cerrajería", chaves: "llaves",
               padaria: "panadería", "cartões": "tarjetas", embaixo: "abajo", boteco: "bar de barrio",
               gelo: "hielo", concorda: "concuerda", salgados: "salados, bocaditos",
               ajudante: "ayudante", perdido: "perdido", atende: "(atende pelo nome de) responde al nombre de",
               pipoca: "pochoclo", tomara: "ojalá" },
      questions: [
        ["O que se faz no chaveiro da Lapa?", ["cópias de chaves na hora", "bicicletas", "consertos de pranchas de surfe e de bicicletas", "gelo"], "cópias de chaves na hora"],
        ["Por que às vezes o verbo vai para o plural?", ["porque concorda com a coisa: pranchas são vendidas", "porque há muitos vendedores: os que vendem pranchas", "porque é mais educado", "porque é um erro"], "porque concorda com a coisa: pranchas são vendidas"],
        ["Como se chama o cachorro perdido?", ["Pipoca", "Pranchas", "Botafogo", "Catete"], "Pipoca"]
      ],
      hunt: { label: "Toque em todos os verbos com se (aluga-se, vendem-se…)", targets:
        ["aluga-se", "vendem-se", "consertam-se", "fazem-se", "aceitam-se", "se", "vende-se", "procura-se", "precisa-se"] } },

    { id: "fl-crase", week: 36, series: "flood", n: 11, level: "B2", emoji: "🗺️",
      title: "O roteiro da mãe", grammar: "crase",
      flood: { target: "crase (à, às, àquela)", forms: ["à", "às", "àquela", "àquele"], n: 19,
               es: "Fijate en el acento grave: «à» = a (preposición) + a (artículo), como si en español dijéramos «a la». Por eso: «vou à praia», «às 9h» (a las nueve), «à noite». Delante de masculino no hay crase: «ao Cristo»." },
      text:
        "A mãe do Martín chega ao Rio na sexta, e ele preparou um roteiro. Antes de mandar para " +
        "ela, pediu à Bia que revisasse: “Tem crase sobrando ou faltando?”\n\n" +
        "Sexta: chegada às 14h ao Galeão. À noite, jantar no boteco do seu Almir, àquela mesa da " +
        "janela.\n" +
        "Sábado: às 8h, trem do Corcovado até o Cristo. À tarde, praia em Ipanema, do Posto 9 ao " +
        "Arpoador. Às 18h, aplaudir o pôr do sol.\n" +
        "Domingo: feira da Glória às 9h; depois, almoço à moda baiana, com moqueca. À tarde, " +
        "visita à Escadaria Selarón e ao Museu do Amanhã.\n" +
        "Segunda: ida a Niterói de barca, para ela conhecer o MAC. Volta à noite.\n\n" +
        "A Bia devolve com um comentário:\n" +
        "— Está tudo certo! E repara: “ida a Niterói” não tem crase, porque a gente diz “venho de " +
        "Niterói”, sem artigo. Mas “à Bahia” tem, porque a gente diz “venho da Bahia”. Às 14h " +
        "tem, porque são “as duas da tarde”. E antes de palavra masculina, nunca: ao Galeão, ao " +
        "Arpoador, ao Museu.\n\n" +
        "Na sexta à noite, no boteco, a mãe dele lê o roteiro e ri:\n" +
        "— Vou à praia, vou à feira, vou àquele museu de nome bonito... Só não vou à academia!",
      gloss: { roteiro: "itinerario", sobrando: "de más", faltando: "de menos",
               chegada: "llegada", jantar: "cena", boteco: "bar de barrio", janela: "ventana",
               trem: "tren", posto: "(Posto 9) puesto de guardavidas, referencia en la playa",
               aplaudir: "aplaudir", "pôr": "(pôr do sol) atardecer", moda: "(à moda de) al estilo de",
               moqueca: "guiso de pescado bahiano", escadaria: "escalinata", ida: "ida",
               barca: "ferry", volta: "vuelta", devolve: "devuelve", repara: "fijate",
               academia: "gimnasio" },
      questions: [
        ["Onde eles jantam na sexta à noite?", ["no bar do seu Almir, na mesa da janela", "em Niterói", "num restaurante de Ipanema, na mesa de fora", "em casa"], "no bar do seu Almir, na mesa da janela"],
        ["Por que «ida a Niterói» não tem crase?", ["porque se diz «venho de Niterói», sem artigo", "porque Niterói é masculino: se diz «o Niterói»", "porque é uma cidade pequena", "porque é um erro"], "porque se diz «venho de Niterói», sem artigo"],
        ["Aonde a mãe não quer ir?", ["à academia", "à praia", "à feira", "ao museu"], "à academia"]
      ],
      hunt: { label: "Toque em todas as crases (à, às, àquela, àquele)", targets: ["à", "às", "àquela", "àquele"] } },

    { id: "fl-maisque", week: 41, series: "flood", n: 12, level: "C1", emoji: "⚓",
      title: "O rio que não era rio", grammar: "mais-que-perfeito simples",
      flood: { target: "mais-que-perfeito simples", forms: ["entrara", "achara", "dera", "fizera", "demorara", "esquecera", "destruíra", "fora", "mandara", "lutara", "chegara", "dissera"], n: 13,
               es: "Mirá el mais-que-perfeito simple (entrara, fizera, dera): es el «había entrado, había hecho» de los libros y la historia. En la conversación se dice «tinha entrado»; esta forma se lee, casi no se habla. Ojo: «fizera» no es el «hiciera» del español." },
      text:
        "Quando Estácio de Sá desembarcou entre o Pão de Açúcar e o morro Cara de Cão, em 1º de " +
        "março de 1565, a baía já tinha uma longa história. Sessenta e três anos antes, em janeiro " +
        "de 1502, uma expedição portuguesa entrara naquelas águas e, segundo a tradição, julgando " +
        "que achara a foz de um grande rio, dera ao lugar o nome de Rio de Janeiro. Alguns " +
        "historiadores lembram que, na época, “rio” podia designar também uma enseada. Os " +
        "tupinambás, que ali viviam havia séculos, chamavam-na Guanabara.\n\n" +
        "Depois disso, Portugal pouco fizera pela região. Em 1555, os franceses de Villegagnon " +
        "ocuparam uma ilha da baía e fundaram a França Antártica, aliados aos tamoios. A Coroa " +
        "demorara, mas não esquecera: em 1560, Mem de Sá destruíra o forte francês, " +
        "sem conseguir expulsar de vez os invasores. Fora para terminar essa tarefa que ele " +
        "mandara o sobrinho, Estácio, com uma pequena armada.\n\n" +
        "A cidade fundada naquele dia era pouco mais que uma paliçada. Ele não viveu " +
        "para vê-la crescer: em 1567, na batalha que finalmente expulsou os franceses, uma flecha " +
        "o atingiu no rosto, e ele morreu semanas depois. O tio, que tanto lutara pela conquista, " +
        "transferiu a cidade para o morro do Castelo, mais fácil de defender.\n\n" +
        "Nos cronistas da época, o mais-que-perfeito aparece a cada página: “chegara”, " +
        "“dissera”, “fizera”. Hoje, na fala, o carioca diz “tinha chegado”; a forma simples ficou " +
        "para os livros.",
      gloss: { desembarcou: "desembarcó", "baía": "bahía", julgando: "creyendo", foz: "desembocadura",
               designar: "designar", enseada: "ensenada", "chamavam-na": "la llamaban",
               ilha: "isla", aliados: "aliados", coroa: "corona", forte: "fuerte", expulsar: "expulsar",
               "vez": "(de vez) definitivamente", tarefa: "tarea", sobrinho: "sobrino", armada: "flota",
               "paliçada": "empalizada", "vê-la": "verla", flecha: "flecha", atingiu: "alcanzó",
               rosto: "cara", tio: "tío", cronistas: "cronistas" },
      questions: [
        ["Por que, segundo a tradição, a cidade se chama «Rio de Janeiro»?", ["os navegantes acharam que a baía era a foz de um rio", "em janeiro havia um rio enorme que desaguava na baía de Guanabara", "era o nome do navio", "por causa de um santo de janeiro"], "os navegantes acharam que a baía era a foz de um rio"],
        ["O que os franceses fundaram em 1555?", ["a França Antártica, numa ilha da baía", "a cidade do Rio", "um forte no Pão de Açúcar", "uma aldeia tupinambá"], "a França Antártica, numa ilha da baía"],
        ["Como Estácio de Sá morreu?", ["de uma flechada no rosto, na batalha de 1567", "de velhice, em Lisboa", "num naufrágio", "no ataque ao forte francês da ilha, em 1560"], "de uma flechada no rosto, na batalha de 1567"]
      ],
      hunt: { label: "Toque em todos os verbos no mais-que-perfeito simples (entrara, fizera…)", targets:
        ["entrara", "achara", "dera", "fizera", "demorara", "esquecera", "destruíra", "fora", "mandara", "lutara", "chegara", "dissera"] } }
  ];

  var SERIES = [
    { id: "martin", name: "Martín no Rio", emoji: "📖",
      blurb: "Un porteño se muda a Río de Janeiro: una historia por capítulos, de A1 a B2. Cada episodio usa la gramática que estás viendo y abre el siguiente." },
    { id: "cultura", name: "Cultura", emoji: "🏛️",
      blurb: "Música, literatura, arte, historia y pensamiento de Brasil, Portugal y el África lusófona, de B1 a C1. Cada texto se abre con la gramática que usa; entre los abiertos, elegí el que te interese." },
    { id: "settimana", name: "A semana", emoji: "🗞️",
      blurb: "Un texto corto por semana con la gramática que estás viendo y palabras que ya conocés: para leer sin diccionario." },
    { id: "flood", name: "Enchentes", emoji: "🌊",
      blurb: "Textos que repiten muchas veces una estructura que el español no tiene o usa distinto: primero la leés sin marcas, después con la estructura resaltada. Así el oído y el ojo la fijan." }
  ];

  root.LETTURE_DATA = {
    EPISODI: EPISODI,
    SERIES: SERIES,
    // Multiple-choice glosses: grammar words are never asked.
    MC_SKIP: /^(muito|muita|também|ainda|sempre|depois|porém|porque|quando|onde|como|este|esta|esse|essa|isso|aquele|aquela|meu|minha|teu|tua|seu|sua|dele|dela|nosso|nossa|mesmo|mesma)$/,
    // Comprehension in Portuguese (Celpe-Bras): true, false or not said.
    // alias: accepted spellings of the answers (also the ones of the Italian data).
    vf: { prompt: "Verdadeiro, falso ou não se diz?", options: ["verdadeiro", "falso", "não se diz"],
          alias: { verdadeiro: "verdadeiro", v: "verdadeiro", vero: "verdadeiro", falso: "falso", f: "falso",
                   "não se diz": "não se diz", "nao se diz": "não se diz", "não diz": "não se diz",
                   "non si dice": "não se diz" } },
    hunt: "Caça às formas · "
  };
})(typeof window !== "undefined" ? window : globalThis);
