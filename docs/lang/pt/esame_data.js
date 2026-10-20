/* Exame final C1 (semana 52): compreensão oral, leitura y produção escrita.
 * Solo datos: la lógica está en app.js.  Estruturas y léxico (huecos,
 * transformaciones, formación de palabras, registro, colocaciones, falsos
 * amigos) están en tools/authored/esame_c1.py.
 *
 * Modelo: Celpe-Bras (nivel Avançado Superior) y exámenes C1.  Contenido
 * cultural de Brasil y Portugal (historia, sociología, literatura); los
 * datos son verificables y lo que la tradición cuenta sin prueba firme se
 * presenta como tal («conta-se»).  Todo en PB; la única cita en portugués
 * europeo (Sophia de Mello Breyner) tiene la misma grafía en ambas normas.
 *
 * Desde v3 todo está en portugués (como en el Celpe-Bras) y cada prueba
 * tiene tres versiones.  Forma exacta:
 *
 * ascolto[]:  3 entrevistas a dos voces, {id: "asc-1".."asc-3", title,
 *             speakers: [A, B], turns: [["A"|"B", texto]], questions:
 *             [[pregunta, [4 opciones], respuesta]] × 8 (en portugués, con
 *             opciones de largo parejo: tools/lib/test_fix_contenido_pt.js),
 *             completa: [[frase con ___, palabra]] × 4}.  asc-3 tiene rasgos
 *             de habla espontánea (tu con verbo de você, bah, hum, é…).
 * lettura[]:  3 textos, {id: "let-1".."let-3", title, paragraphs[6],
 *             titles[8] (6 buenos + 2 distractores), match[6] (índice del
 *             título de cada párrafo), vf: [[afirmación, true|false,
 *             la frase que lo prueba]] × 8}.
 * versoes[]:  3 versiones de la produção escrita, {id: "v1".."v3",
 *             ascolto: id de la escucha de esa versión, lettura: id de la
 *             lectura, scrittura: [tarefa × 4]}.  Cada tarefa:
 *               {id, kind, genero (el nombre del género, en portugués),
 *                words (solo para la revisión local y la IA: el enunciado
 *                no dice extensión ni registro, como la prova),
 *                insumo: {tipo: "audio" | "texto",
 *                         ref: id de ascolto[] o lettura[] de la versión,
 *                         o bien titulo + turns (audio corto, mismo formato
 *                         que ascolto.turns, con speakers) o titulo + texto},
 *                t: el enunciado en portugués, rubric: la grilla (abajo)}.
 *             La tarefa 1 parte de la escucha de la versión, la 2 de la
 *             lectura, la 3 de un audio corto y la 4 de un texto corto.
 * scrittura[]: = versoes[0].scrittura, para la pantalla actual de app.js
 *             (que muestra todas las tarefas de este arreglo).  `kind`: los
 *             valores de LANG.exam.kinds (lang.js).  rubric: [clave,
 *             descripción]; las claves (contexto, discursiva, linguistica,
 *             lexico) son las tres adequações del Celpe-Bras, con la
 *             lingüística partida en gramática y léxico.
 *
 * Para que la pantalla use las versiones, app.js tiene que: elegir una
 * versión v (al azar o la siguiente a la última hecha, en state.esame),
 * tomar la escucha y la lectura por id (v.ascolto, v.lettura) en vez de
 * es.k, mostrar v.scrittura con su insumo antes de cada enunciado (un
 * insumo con ref reabre la escucha o la lectura de la versión; uno con
 * turns se lee con speak() como ascolto.turns) y guardar los borradores
 * por t.id (ya son únicos entre versiones). */
(function (root) { "use strict";
  var ESAME = {
    ascolto: [
      { id: "asc-1", title: "Entrevista: o «homem cordial» e o jeitinho", speakers: ["Jornalista", "Historiadora"],
        turns: [
          ["A", "Boa noite. Você está ouvindo o Conversa de Botequim, gravado hoje num bar da Lapa, aqui no Rio. Minha convidada é a historiadora Regina Aguiar, que acaba de lançar um livro sobre as chamadas interpretações do Brasil. Regina, em 1936 Sérgio Buarque de Holanda publicou Raízes do Brasil e popularizou uma expressão que todo mundo cita: o «homem cordial». O que ele queria dizer com isso?"],
          ["B", "Obrigada pelo convite. Antes de mais nada, uma correção: a expressão não foi inventada por ele. O próprio Sérgio Buarque explica que a tomou emprestada do escritor Ribeiro Couto. E quase todo mundo a entende mal. «Cordial», aqui, não quer dizer gentil nem bem-educado. A palavra vem do latim cor, cordis, que significa coração. O homem cordial é aquele que age movido pelo coração, pelas emoções, tanto na amizade quanto na inimizade."],
          ["A", "Ou seja, não é exatamente um elogio."],
          ["B", "Não é. Para Sérgio Buarque, o brasileiro tem dificuldade em separar o público do privado. Trata o Estado como se fosse uma extensão da família, prefere as relações pessoais às regras impessoais e desconfia de tudo o que é formal. Ele dá exemplos do cotidiano: o gosto pelos diminutivos e a mania de chamar as pessoas pelo primeiro nome, deixando de lado o sobrenome."],
          ["A", "E como isso se liga ao famoso jeitinho brasileiro?"],
          ["B", "Um dos que mais escreveram sobre isso foi o antropólogo Roberto DaMatta, a partir do fim dos anos setenta. O jeitinho é uma forma de contornar a regra sem confrontá-la: você conversa, é simpático, conta a sua história e consegue o que queria. Tem um lado criativo e solidário, mas tem também um lado perverso, que aparece quando alguém, em vez de pedir, ameaça: «Você sabe com quem está falando?» Aí a simpatia vira hierarquia."],
          ["A", "Sérgio Buarque também comparou a colonização portuguesa com a espanhola, não é?"],
          ["B", "Sim, no capítulo «O semeador e o ladrilhador». As cidades da América espanhola, como Lima ou Buenos Aires, foram traçadas com régua, em quadras regulares a partir de uma praça central: o espanhol seria o ladrilhador. O português, ao contrário, teria semeado as cidades ao longo do litoral, adaptando-se ao terreno, com certo desleixo. Basta subir até Santa Teresa e olhar as ruas tortas lá embaixo para entender a metáfora."],
          ["A", "Essas interpretações ainda valem hoje?"],
          ["B", "Como hipóteses, sim; como retratos fiéis, não. O próprio Sérgio Buarque via na urbanização o fim lento das nossas raízes rurais e ibéricas. Críticos posteriores mostraram que esses traços não são uma essência nacional, mas o resultado de uma história concreta: o latifúndio, a escravidão, o uso privado do Estado. Eu diria que o livro continua sendo lido não porque tenha acertado em tudo, mas porque nos obriga a fazer as perguntas certas."],
          ["A", "Regina Aguiar, muito obrigado pela conversa."],
          ["B", "Eu que agradeço."]
        ],
        questions: [
          ["O que a historiadora corrige logo no começo?",
           ["Que a expressão não é dele: ele a tomou de Ribeiro Couto", "Que Raízes do Brasil foi publicado em 1946, e não em 1936", "Que Sérgio Buarque era antropólogo, e não um historiador", "Que a expressão «homem cordial» vem do português medieval"],
           "Que a expressão não é dele: ele a tomou de Ribeiro Couto"],
          ["O que significa «cordial» no sentido de Sérgio Buarque?",
           ["Que age movido pelo coração", "Que é gentil e bem-educado", "Que respeita sempre as regras", "Que recebe bem os estrangeiros"],
           "Que age movido pelo coração"],
          ["Segundo Sérgio Buarque, o que é difícil para o brasileiro?",
           ["Separar o público do privado", "Conversar com desconhecidos", "Aceitar a hierarquia da família", "Demonstrar as próprias emoções"],
           "Separar o público do privado"],
          ["Que exemplos do cotidiano o livro dá?",
           ["Os diminutivos e o hábito de usar o primeiro nome", "A falta de pontualidade e as filas intermináveis dos bancos", "O uso de «o senhor» entre amigos de infância", "O gosto pelo futebol e pelo carnaval de rua"],
           "Os diminutivos e o hábito de usar o primeiro nome"],
          ["Quando aparece o lado perverso do jeitinho?",
           ["Quando alguém ameaça em vez de pedir", "Quando alguém conta a sua história", "Quando a regra é cumprida sem exceção", "Quando as pessoas ajudam desconhecidos"],
           "Quando alguém ameaça em vez de pedir"],
          ["Em «O semeador e o ladrilhador», quem é o ladrilhador?",
           ["O espanhol, que traçava cidades em quadras", "O português, que se adaptava ao terreno do litoral", "O bandeirante, que abria os caminhos", "O urbanista que projetou Brasília"],
           "O espanhol, que traçava cidades em quadras"],
          ["Que imagem do Rio a historiadora usa para explicar a metáfora?",
           ["As ruas tortas vistas de Santa Teresa", "As quadras retas de Copacabana", "Os túneis entre a Zona Sul e o Centro", "A praia de Ipanema vista do Arpoador"],
           "As ruas tortas vistas de Santa Teresa"],
          ["Por que Raízes do Brasil ainda é lido, segundo ela?",
           ["Porque obriga a fazer as perguntas certas", "Porque acertou em tudo o que previu", "Porque retrata fielmente o Brasil atual", "Porque ainda é leitura obrigatória nas escolas"],
           "Porque obriga a fazer as perguntas certas"]
        ],
        completa: [
          ["A palavra «cordial» vem do latim cor, cordis, que significa ___.", "coração"],
          ["O jeitinho é uma forma de contornar a ___ sem confrontá-la.", "regra"],
          ["O espanhol seria o ___; o português, o semeador.", "ladrilhador"],
          ["O brasileiro trata o Estado como se fosse uma extensão da ___.", "família"]
        ] },

      { id: "asc-2", title: "Conversa: 1808, a corte chega ao Rio", speakers: ["Apresentadora", "Historiador"],
        turns: [
          ["A", "Estamos na Praça Quinze, no Centro do Rio, em frente ao Paço Imperial. Meu convidado é o historiador Paulo Menezes. Paulo, foi aqui que tudo começou em 1808?"],
          ["B", "Foi aqui perto, sim. Em março de 1808 desembarcou no Rio o príncipe regente Dom João, com a mãe, a rainha Dona Maria I, e boa parte da corte portuguesa. Eles tinham saído de Lisboa no fim de novembro de 1807, praticamente na véspera de as tropas de Napoleão, comandadas pelo general Junot, entrarem na cidade. Antes de chegar ao Rio, tinham passado por Salvador."],
          ["A", "Por que a corte foi embora de Portugal?"],
          ["B", "Porque Portugal estava entre a cruz e a espada. Napoleão exigia que o país fechasse os portos aos navios ingleses; a Inglaterra, velha aliada, podia tomar as colônias se isso acontecesse. A transferência da corte, escoltada pela marinha inglesa, foi a saída encontrada. Há quem fale em fuga covarde, há quem fale em manobra genial. Provavelmente foi as duas coisas."],
          ["A", "E como a cidade recebeu tanta gente de uma vez?"],
          ["B", "Com dificuldade. Não se sabe ao certo quantas pessoas vieram: as estimativas variam muito, de alguns milhares a mais de dez mil, numa cidade que tinha uns sessenta mil habitantes. Para alojar os recém-chegados, muitas casas foram requisitadas, e nas portas se pintavam as letras P.R., de Príncipe Regente. Conta-se que o povo, com o humor carioca de sempre, lia «Ponha-se na Rua»."],
          ["A", "Mas a presença da corte também trouxe mudanças importantes."],
          ["B", "Enormes. Ainda em Salvador, Dom João decretou a abertura dos portos às nações amigas, o que acabou, na prática, com o monopólio comercial de Portugal. No Rio foram criados a Imprensa Régia, o Banco do Brasil, o Jardim Botânico e a Biblioteca Real, cujo acervo deu origem à atual Biblioteca Nacional. Em 1815, o Brasil foi elevado a Reino Unido de Portugal, Brasil e Algarves: a antiga colônia passava a ser sede da monarquia."],
          ["A", "E a volta para Portugal?"],
          ["B", "Em 1820 estourou no Porto uma revolução liberal que exigia o retorno do rei. Dom João, já Dom João VI, voltou para Lisboa em 1821 e deixou aqui o filho, Pedro. As Cortes de Lisboa queriam reduzir a autonomia do Brasil e exigiam também a volta do príncipe. Pedro decidiu ficar: é o famoso Dia do Fico, em janeiro de 1822. Em setembro daquele ano, veio a independência."],
          ["A", "Uma independência bem peculiar, feita por um príncipe português."],
          ["B", "Exatamente. Muitos historiadores observam que o Brasil é o único caso nas Américas em que a antiga colônia se tornou uma monarquia governada por um membro da família real da própria metrópole. Isso ajudou a manter o território unido, ao contrário do que aconteceu na América espanhola, mas também ajudou a conservar a escravidão por mais sessenta e seis anos."],
          ["A", "Paulo Menezes, obrigada. E você, que está nos ouvindo, aproveite para visitar o Paço Imperial."]
        ],
        questions: [
          ["Quando a corte chegou ao Rio de Janeiro?",
           ["Em março de 1808, depois de passar por Salvador", "Em novembro de 1807, direto de Lisboa, sem escalas", "Em 1815, quando o Brasil virou reino", "Em janeiro de 1822, no Dia do Fico"],
           "Em março de 1808, depois de passar por Salvador"],
          ["Por que a corte deixou Lisboa?",
           ["Estava entre as exigências de Napoleão e as da Inglaterra", "Tinha acabado de estourar uma revolução liberal no Porto", "A rainha queria conhecer as terras do Brasil", "A Inglaterra tinha acabado de invadir Portugal"],
           "Estava entre as exigências de Napoleão e as da Inglaterra"],
          ["Como o historiador avalia a partida da corte?",
           ["Provavelmente foi fuga e manobra ao mesmo tempo", "Foi uma fuga covarde, e nada mais do que isso", "Foi uma manobra genial de Dom João, sem dúvida", "Foi um erro que fez Portugal perder as colônias"],
           "Provavelmente foi fuga e manobra ao mesmo tempo"],
          ["Quantas pessoas vieram com a corte?",
           ["Não se sabe: de alguns milhares a mais de dez mil", "Umas sessenta mil, tantas quanto os moradores", "Pouco mais de quinhentas pessoas, entre nobres e criados", "Cem mil, mais do que os habitantes da cidade"],
           "Não se sabe: de alguns milhares a mais de dez mil"],
          ["Segundo se conta, como o povo lia as letras P.R.?",
           ["«Ponha-se na Rua»", "«Príncipe Real»", "«Porto do Rio»", "«Prédio da Realeza»"],
           "«Ponha-se na Rua»"],
          ["O que Dom João decretou ainda em Salvador?",
           ["A abertura dos portos às nações amigas", "A criação do Banco do Brasil no Rio de Janeiro", "A elevação do Brasil a Reino Unido", "O fim do tráfico de escravizados"],
           "A abertura dos portos às nações amigas"],
          ["O que foi o Dia do Fico?",
           ["O dia em que Pedro decidiu ficar", "O dia em que Dom João voltou", "O dia da proclamação da independência", "O dia em que a corte desembarcou"],
           "O dia em que Pedro decidiu ficar"],
          ["Que consequência teve uma independência feita por um príncipe português?",
           ["Manteve o território unido e conservou a escravidão", "Dividiu o território em várias repúblicas independentes", "Acelerou a abolição da escravidão no Brasil", "Fez o Brasil voltar a ser colônia de Portugal"],
           "Manteve o território unido e conservou a escravidão"]
        ],
        completa: [
          ["Em março de 1808 desembarcou no Rio o príncipe ___ Dom João.", "regente"],
          ["Para alojar os recém-chegados, muitas casas foram ___.", "requisitadas"],
          ["O acervo da Biblioteca Real deu origem à atual Biblioteca ___.", "Nacional"],
          ["Em 1820 estourou no Porto uma revolução ___ que exigia o retorno do rei.", "liberal"]
        ] },

      { id: "asc-3", title: "Rádio: viver numa fronteira que é uma rua", speakers: ["Apresentadora", "Morador"],
        turns: [
          ["A", "Boa tarde, você está ouvindo o Brasil de Ponta a Ponta. Hoje a gente vai até o extremo sul, a Santana do Livramento, no Rio Grande do Sul, que faz fronteira com Rivera, no Uruguai. Tá comigo o Tiago Pereira, professor de geografia e morador da cidade. Tiago, tudo bem?"],
          ["B", "Bah, tudo ótimo. Obrigado pelo convite. É… é sempre bom falar da minha cidade."],
          ["A", "Tiago, pra quem nunca foi: como é essa fronteira?"],
          ["B", "Olha, a fronteira aqui é uma rua. Literalmente. Tu atravessa a rua e já tá no Uruguai. Não tem rio, não tem ponte, não tem… não tem nada. No meio das duas cidades tem a Praça Internacional, que é metade brasileira e metade uruguaia. Tem gente que almoça de um lado e toma o cafezinho do outro."],
          ["A", "E ninguém pede passaporte?"],
          ["B", "Não, não, pra circular entre as duas cidades, não. Quem mora aqui pode tirar um documento especial de fronteiriço, que facilita, por exemplo, trabalhar ou estudar do outro lado. Agora, se tu quer seguir viagem pra Montevidéu, aí sim, aí tem que fazer os trâmites normais de entrada."],
          ["A", "E a língua? Que língua se fala na rua?"],
          ["B", "Hum, essa é a parte mais bonita, eu acho. Se fala português, se fala espanhol e se fala o que o pessoal chama de portunhol, ou de fronteiriço. Não é uma mistura aleatória, né? Os linguistas estudam isso há décadas. Do lado uruguaio tem família que fala português em casa há gerações, desde antes de a fronteira ser traçada. Então não é que o português chegou agora: ele sempre esteve ali."],
          ["A", "E na escola, como fica?"],
          ["B", "Durante muito tempo, do lado uruguaio, a escola tratou esse português como… como um erro, uma coisa a corrigir. Hoje tem escolas bilíngues dos dois lados, e isso mudou bastante a autoestima das crianças. Eu tenho aluno que pensa em português e faz conta em espanhol. E tá tudo certo."],
          ["A", "E no dia a dia, o que mais chama a atenção de quem chega?"],
          ["B", "O chimarrão, com certeza. Aqui todo mundo toma, dos dois lados, só que o uruguaio chama de mate. E o comércio: o pessoal atravessa pra comprar nos free shops de Rivera, e os uruguaios vêm comprar do lado brasileiro quando o câmbio ajuda. A cidade vive muito disso, do sobe e desce do câmbio."],
          ["A", "Pra terminar, Tiago: tem alguma coisa que te incomoda na fronteira?"],
          ["B", "Tem, sim. A gente fica longe de tudo: das capitais, das universidades, dos hospitais grandes. Muito jovem vai embora pra estudar e não volta. Mas eu costumo dizer que aqui a gente aprende cedo uma coisa que muita gente nunca aprende: que o vizinho que fala diferente não é estrangeiro. É vizinho."],
          ["A", "Tiago Pereira, muito obrigada. E você, que tá nos ouvindo, até a semana que vem."]
        ],
        questions: [
          ["O que diferencia essa fronteira, segundo o Tiago?",
           ["As duas cidades são separadas só por uma rua", "As cidades são separadas por um rio e uma ponte", "A fronteira fica no meio de uma área rural", "Há um muro com um posto de controle no centro"],
           "As duas cidades são separadas só por uma rua"],
          ["O que é a Praça Internacional?",
           ["Uma praça metade brasileira e metade uruguaia", "Uma praça onde se faz o controle de passaportes", "A praça principal do lado uruguaio, em Rivera", "Uma feira de produtos dos dois países"],
           "Uma praça metade brasileira e metade uruguaia"],
          ["Para que serve o documento de fronteiriço?",
           ["Para facilitar trabalhar ou estudar do outro lado", "Para viajar até Montevidéu sem outros trâmites", "Para comprar nos free shops de Rivera sem pagar impostos", "Para votar nas eleições das duas cidades"],
           "Para facilitar trabalhar ou estudar do outro lado"],
          ["O que o Tiago diz sobre o portunhol da fronteira?",
           ["Não é uma mistura aleatória: é estudado há décadas", "É uma mistura aleatória, inventada pelos turistas", "Só é falado pelos comerciantes do lado brasileiro", "Está desaparecendo por causa das escolas bilíngues"],
           "Não é uma mistura aleatória: é estudado há décadas"],
          ["Segundo ele, há quanto tempo se fala português do lado uruguaio?",
           ["Há gerações, desde antes da fronteira ser traçada", "Desde que abriram os free shops em Rivera", "Desde que as escolas bilíngues começaram", "Só desde a chegada da televisão brasileira à região"],
           "Há gerações, desde antes da fronteira ser traçada"],
          ["O que mudou com as escolas bilíngues?",
           ["A autoestima das crianças melhorou bastante", "O português deixou de ser falado em casa", "As crianças passaram a fazer contas em inglês", "O espanhol virou a única língua do ensino"],
           "A autoestima das crianças melhorou bastante"],
          ["De que depende muito o comércio da cidade?",
           ["Do sobe e desce do câmbio", "Do turismo de Montevidéu", "Da venda de chimarrão", "Das universidades próximas"],
           "Do sobe e desce do câmbio"],
          ["O que incomoda o Tiago na vida na fronteira?",
           ["A distância das capitais, das universidades e dos hospitais", "A confusão entre as duas línguas nas escolas da cidade", "O trânsito pesado de caminhões nas ruas do centro histórico", "A falta de comércio aberto nos fins de semana"],
           "A distância das capitais, das universidades e dos hospitais"]
        ],
        completa: [
          ["Tu atravessa a ___ e já tá no Uruguai.", "rua"],
          ["Quem mora aqui pode tirar um documento especial de ___.", "fronteiriço"],
          ["Aqui todo mundo toma ___, dos dois lados.", "chimarrão"],
          ["O vizinho que fala diferente não é ___.", "estrangeiro"]
        ] }
    ],

    lettura: [
      { id: "let-1", title: "Do cortiço à favela: o Rio que se reinventou",
        paragraphs: [
          "No fim do século XIX, o centro do Rio de Janeiro era uma das áreas mais densamente povoadas do país. Capital da recém-proclamada República, a cidade recebia libertos da escravidão, abolida em 1888, migrantes do interior e imigrantes europeus, que se amontoavam em cortiços: casarões antigos divididos em dezenas de cômodos, ou fileiras de pequenas casas em torno de um pátio, com banheiro e tanque coletivos. Aluísio Azevedo fez de uma dessas habitações o cenário de O Cortiço, romance publicado em 1890. Para as elites, os cortiços eram focos de doença e de desordem; para quem morava neles, eram a única maneira de viver perto do trabalho, no porto e no comércio do Centro.",
          "O mais famoso deles, o Cabeça de Porco, ficava perto da atual estação Central do Brasil e chegou a abrigar, segundo algumas estimativas da época, milhares de pessoas. Em janeiro de 1893, o prefeito Barata Ribeiro mandou demoli-lo numa operação que durou pouco mais de um dia e foi acompanhada por soldados e bombeiros. Os moradores foram expulsos sem ter para onde ir. Conta-se que alguns deles, aproveitando a madeira dos escombros, subiram o morro que ficava logo atrás e começaram a construir ali seus barracos.",
          "O morro, conhecido como Providência, ganharia pouco depois outro nome. Em 1897, terminada a Guerra de Canudos, no sertão da Bahia, soldados que haviam lutado contra os seguidores de Antônio Conselheiro chegaram ao Rio à espera de moradias prometidas pelo governo ou, segundo outras versões, do pagamento dos soldos atrasados. Instalaram-se no morro e o chamaram de Morro da Favela, em lembrança de um morro de Canudos coberto por uma planta resistente chamada favela. Com o tempo, o nome próprio virou substantivo comum, e «favela» passou a designar qualquer aglomeração de moradias precárias. A guerra, que terminou com a destruição do arraial, foi narrada por Euclides da Cunha em Os Sertões, de 1902.",
          "No início do século XX, o presidente Rodrigues Alves e o prefeito Pereira Passos decidiram transformar a capital numa vitrine da modernidade, inspirada na Paris redesenhada pelo barão Haussmann. Entre 1903 e 1906, centenas de prédios foram derrubados para abrir largas avenidas, entre elas a Avenida Central, atual Rio Branco, e para modernizar o porto. O povo, que via suas casas desaparecerem, apelidou a reforma de «bota-abaixo». Ao mesmo tempo, o médico sanitarista Oswaldo Cruz comandava campanhas contra a febre amarela, a peste bubônica e a varíola, com brigadas que entravam nas casas para desinfetá-las.",
          "Em novembro de 1904, a lei que tornava obrigatória a vacinação contra a varíola foi a gota d'água. Durante cerca de uma semana, a cidade viveu uma revolta popular: bondes foram virados, lampiões quebrados e barricadas erguidas em bairros como a Saúde. A chamada Revolta da Vacina não se explica apenas pelo medo da injeção, então pouco compreendida, mas pelo acúmulo de ressentimentos de uma população que via suas casas demolidas e sua vida regulada por decisões tomadas sem ela. O governo decretou estado de sítio, reprimiu duramente os revoltosos e, por fim, suspendeu a obrigatoriedade da vacina.",
          "Mais de um século depois, a cidade continua marcada por essa história. As favelas, que o poder público tentou durante décadas remover ou ignorar, abrigam hoje uma parte considerável da população carioca e produziram boa parte da cultura que o mundo associa ao Rio, do samba ao funk. O geógrafo Milton Santos insistia em que o espaço urbano não é um cenário neutro, mas o produto de relações sociais e decisões políticas. Quem caminha hoje pela Pedra do Sal, na região que ficou conhecida como Pequena África e onde o samba ganhou forma no início do século XX, anda sobre camadas de uma disputa que ainda não terminou: quem tem direito ao centro da cidade?"
        ],
        titles: [
          "Uma planta do sertão dá nome ao morro",
          "A vacina e a revolta",
          "O Rio que vive dos turistas",
          "Morar perto do trabalho",
          "Paris nos trópicos",
          "Uma demolição em pouco mais de um dia",
          "A chegada do metrô à Zona Sul",
          "Uma disputa que continua"
        ],
        match: [3, 5, 0, 4, 1, 7],
        vf: [
          ["Os cortiços permitiam que os mais pobres morassem perto do trabalho.", true, "«eram a única maneira de viver perto do trabalho, no porto e no comércio do Centro»"],
          ["A demolição do Cabeça de Porco levou vários meses.", false, "«numa operação que durou pouco mais de um dia»"],
          ["Os soldados de Canudos foram ao Rio à espera de moradias ou do pagamento dos soldos.", true, "«à espera de moradias prometidas pelo governo ou, segundo outras versões, do pagamento dos soldos atrasados»"],
          ["«Favela» era originalmente o nome de uma planta.", true, "«coberto por uma planta resistente chamada favela»"],
          ["A reforma de Pereira Passos se inspirou em Londres.", false, "«inspirada na Paris redesenhada pelo barão Haussmann»"],
          ["Segundo o texto, a Revolta da Vacina se explica apenas pelo medo da injeção.", false, "«não se explica apenas pelo medo da injeção […] mas pelo acúmulo de ressentimentos»"],
          ["Depois da revolta, a vacinação obrigatória foi mantida.", false, "«por fim, suspendeu a obrigatoriedade da vacina»"],
          ["O texto apresenta o direito ao centro da cidade como uma questão ainda em aberto.", true, "«uma disputa que ainda não terminou: quem tem direito ao centro da cidade?»"]
        ] },

      { id: "let-2", title: "Abril em Lisboa: o fim da ditadura e do império",
        paragraphs: [
          "Durante quase meio século, Portugal viveu sob uma ditadura. Depois do golpe militar de 1926, António de Oliveira Salazar, professor de economia da Universidade de Coimbra, tornou-se ministro das Finanças em 1928 e, em 1932, chefe do governo. No ano seguinte, uma nova Constituição instituiu o Estado Novo, um regime autoritário, católico e corporativista, resumido no lema «Deus, Pátria, Família». Havia censura prévia à imprensa, um único partido legal e uma polícia política, conhecida a partir de 1945 como PIDE, que vigiava, prendia e torturava os opositores.",
          "Enquanto outras potências europeias abriam mão de suas colônias, o regime insistia em que Portugal era uma só nação, «do Minho a Timor», espalhada por vários continentes. A partir de 1961, eclodiram movimentos armados de libertação em Angola e, pouco depois, na Guiné-Bissau e em Moçambique. A guerra colonial durou treze anos, mobilizou centenas de milhares de jovens e consumiu uma parte enorme do orçamento. Muitos rapazes emigraram clandestinamente, sobretudo para a França, para escapar do serviço militar. Em 1968, Salazar foi afastado do poder por motivos de saúde e substituído por Marcello Caetano, que prometeu uma abertura que nunca chegou a se concretizar.",
          "Na madrugada de 25 de abril de 1974, um grupo de oficiais de patente intermediária, os capitães do Movimento das Forças Armadas, pôs em marcha um golpe cuidadosamente planejado. Os sinais foram dados pelo rádio: pouco antes das onze da noite do dia 24, tocou a canção «E Depois do Adeus»; passada a meia-noite, «Grândola, Vila Morena», de Zeca Afonso, um cantor perseguido pelo regime. Era a confirmação de que as operações tinham começado. Ao longo do dia, as tropas do capitão Salgueiro Maia cercaram o quartel do Carmo, em Lisboa, onde Marcello Caetano se refugiara. No fim da tarde, Caetano entregou o poder ao general António de Spínola.",
          "O povo não ficou em casa, como pediam os comunicados dos revoltosos: saiu às ruas e se misturou aos soldados. Conta-se que Celeste Caeiro, funcionária de um restaurante de Lisboa, levava para casa os cravos que seriam oferecidos aos clientes numa comemoração que acabou cancelada. Quando um soldado lhe pediu um cigarro, ela lhe ofereceu um cravo, e ele o colocou no cano do fuzil. O gesto se espalhou. Houve poucas vítimas, quase todas baleadas por agentes da polícia política diante da sede dela, e os cravos vermelhos deram nome à revolução.",
          "A revolução abriu caminho para a independência das colônias: a da Guiné-Bissau foi reconhecida em 1974; as de Moçambique, Cabo Verde, São Tomé e Príncipe e Angola vieram em 1975. O fim do império trouxe para Portugal centenas de milhares de pessoas, os chamados «retornados», muitas das quais nunca tinham pisado na metrópole. Marcello Caetano, por sua vez, partiu para o exílio no Brasil e morreu no Rio de Janeiro em 1980. Em 25 de abril de 1975, os portugueses votaram nas primeiras eleições livres em quase cinquenta anos, e em 1976 foi aprovada uma nova Constituição.",
          "A poeta Sophia de Mello Breyner Andresen resumiu o sentimento daquela manhã em versos que muitos portugueses sabem de cor: «Esta é a madrugada que eu esperava / O dia inicial inteiro e limpo». Anos depois, o ensaísta Eduardo Lourenço, em O Labirinto da Saudade (1978), propôs uma leitura menos eufórica: para ele, os portugueses tinham vivido séculos com uma imagem irreal e engrandecida de si mesmos, e o fim do império os obrigava a se verem, enfim, como um pequeno país europeu. Em 1986, Portugal entrou na Comunidade Econômica Europeia. A saudade, porém, não desapareceu: talvez só tenha mudado de objeto."
        ],
        titles: [
          "Uma flor no cano do fuzil",
          "O terremoto de 1755",
          "Da euforia à reflexão",
          "Censura, partido único e polícia política",
          "Canções no rádio, tropas nas ruas",
          "A corte parte para o Brasil",
          "Uma guerra longe de casa",
          "O fim do império"
        ],
        match: [3, 6, 4, 0, 7, 2],
        vf: [
          ["Salazar chegou ao poder como líder do golpe militar de 1926.", false, "«Depois do golpe militar de 1926, […] tornou-se ministro das Finanças em 1928»"],
          ["A guerra colonial levou muitos jovens a emigrar clandestinamente.", true, "«Muitos rapazes emigraram clandestinamente, sobretudo para a França, para escapar do serviço militar»"],
          ["O primeiro sinal do golpe foi transmitido pelo rádio na noite de 24 de abril.", true, "«pouco antes das onze da noite do dia 24, tocou a canção «E Depois do Adeus»»"],
          ["Os revoltosos pediram à população que saísse às ruas.", false, "«O povo não ficou em casa, como pediam os comunicados dos revoltosos»"],
          ["Celeste Caeiro tinha comprado os cravos para oferecê-los aos soldados.", false, "«levava para casa os cravos que seriam oferecidos aos clientes numa comemoração que acabou cancelada»"],
          ["Marcello Caetano morreu no exílio, no Rio de Janeiro.", true, "«partiu para o exílio no Brasil e morreu no Rio de Janeiro em 1980»"],
          ["Eduardo Lourenço fez uma leitura tão eufórica quanto a de Sophia.", false, "«propôs uma leitura menos eufórica»"],
          ["Portugal entrou na Comunidade Econômica Europeia em 1986.", true, "«Em 1986, Portugal entrou na Comunidade Econômica Europeia»"]
        ] },

      { id: "let-3", title: "O ouro branco da Amazônia",
        paragraphs: [
          "Entre o fim do século XIX e o começo do século XX, a Amazônia viveu uma riqueza tão rápida quanto passageira. A borracha, extraída do látex da seringueira, tornara-se indispensável para a indústria: pneus de bicicleta e, depois, de automóvel, correias de máquinas, isolamento de fios elétricos. Como as seringueiras cresciam espalhadas pela floresta, e não em plantações, era preciso gente para percorrer, todos os dias, as trilhas que ligavam uma árvore à outra. O Brasil dominava o mercado mundial, e o látex ganhou o apelido de «ouro branco».",
          "Essa gente veio, em grande parte, do Nordeste. A grande seca de 1877, no Ceará, empurrou dezenas de milhares de famílias para o Norte. Os seringueiros chegavam endividados: a viagem, as ferramentas e a comida eram adiantadas pelo seringalista, dono do seringal, e descontadas da produção a preços que ele mesmo fixava. Muitos passavam a vida sem conseguir pagar a dívida, presos a um sistema conhecido como aviamento. Isolados na mata, expostos à malária e a outras doenças, poucos voltavam para casa.",
          "Nas cidades, o dinheiro corria. Manaus e Belém ganharam bondes elétricos, avenidas largas, palacetes e iluminação pública antes de muitas capitais do Sul. O Teatro Amazonas, inaugurado em Manaus em 1896, com materiais trazidos da Europa, tornou-se o símbolo desse luxo. Conta-se que a elite mandava lavar a roupa em Portugal; a história talvez seja exagerada, mas diz muito sobre a distância entre os palacetes e os seringais.",
          "A disputa pela borracha também redesenhou o mapa. No Acre, então território boliviano, a maioria dos habitantes era de seringueiros brasileiros, e os conflitos se multiplicaram. Depois de uma revolta armada, o Brasil negociou com a Bolívia o Tratado de Petrópolis, assinado em 1903: o Acre passou a ser brasileiro em troca de uma indenização e do compromisso de construir uma ferrovia, a Madeira-Mamoré, que custou milhares de vidas e ficou pronta quando o ciclo já acabava.",
          "O fim veio de fora. Em 1876, o inglês Henry Wickham levou sementes de seringueira para Londres; as mudas foram parar nas colônias britânicas da Ásia, onde se formaram plantações organizadas, com árvores enfileiradas e mão de obra barata. Na década de 1910, a borracha asiática já era mais barata e mais abundante que a amazônica, e os preços desabaram. Nem a tentativa de Henry Ford, que no fim dos anos 1920 fundou no Pará uma cidade-empresa, a Fordlândia, conseguiu fazer a seringueira render em plantações na própria Amazônia.",
          "A história dos seringueiros, porém, não terminou com o ciclo. Nos anos 1970 e 1980, no Acre, eles se organizaram contra o desmatamento feito para abrir pastos. O líder sindical Chico Mendes, de Xapuri, defendia que a floresta em pé valia mais do que derrubada e propunha áreas onde as comunidades pudessem viver da coleta sem destruir a mata. Ele foi assassinado em dezembro de 1988. Pouco depois, o governo criou as primeiras reservas extrativistas, e a ideia de que proteger a floresta é também proteger quem vive dela passou a fazer parte do debate ambiental no mundo inteiro."
        ],
        titles: [
          "A floresta em pé",
          "Um mercado mundial",
          "O Acre muda de país",
          "A migração do Nordeste",
          "O luxo das capitais",
          "As sementes que foram para a Ásia",
          "A descoberta do petróleo",
          "O fim da escravidão"
        ],
        match: [1, 3, 4, 2, 5, 0],
        vf: [
          ["As seringueiras eram cultivadas em grandes plantações na Amazônia.", false, "«cresciam espalhadas pela floresta, e não em plantações»"],
          ["Os seringueiros começavam o trabalho já devendo dinheiro ao seringalista.", true, "«Os seringueiros chegavam endividados»"],
          ["Manaus teve iluminação pública antes de muitas capitais do Sul.", true, "«iluminação pública antes de muitas capitais do Sul»"],
          ["O texto garante que a elite mandava lavar a roupa em Portugal.", false, "«a história talvez seja exagerada»"],
          ["O Acre passou a ser brasileiro por um tratado assinado em 1903.", true, "«o Tratado de Petrópolis, assinado em 1903: o Acre passou a ser brasileiro»"],
          ["A ferrovia Madeira-Mamoré ficou pronta no auge do ciclo da borracha.", false, "«ficou pronta quando o ciclo já acabava»"],
          ["A Fordlândia conseguiu tornar lucrativas as plantações de seringueira.", false, "«Nem a tentativa de Henry Ford […] conseguiu fazer a seringueira render»"],
          ["Chico Mendes defendia que as comunidades vivessem da coleta sem destruir a floresta.", true, "«áreas onde as comunidades pudessem viver da coleta sem destruir a mata»"]
        ] }
    ],

    /* Produção escrita como na prova do Celpe-Bras: cuatro tarefas
       integradas, todas en portugués, cada una con su insumo (lo que se lee
       o se escucha), enunciador, interlocutor, propósito y género, sin
       extensión ni registro explícitos (words queda solo para la revisión
       local y la IA).  Tres versiones (versoes); `scrittura` es la versión 1,
       para la pantalla actual.  Forma exacta en la cabecera del archivo. */
    versoes: [
      { id: "v1", ascolto: "asc-1", lettura: "let-1", scrittura: [
        { id: "v1-t1", kind: "argomentativo", genero: "texto de opinião", words: 200,
          insumo: { tipo: "audio", ref: "asc-1" },
          t: "Você ouviu a entrevista do programa Conversa de Botequim com a historiadora Regina Aguiar sobre o «homem cordial» e o jeitinho. O jornal O Carioca abriu um debate na seção de opinião com a tese «O jeitinho brasileiro é mais uma virtude criativa do que um problema para o país». Como leitor(a), escreva um texto para essa seção posicionando-se sobre a tese e usando pelo menos duas ideias da entrevista." },
        { id: "v1-t2", kind: "roteiro", genero: "roteiro de visita", words: 180,
          insumo: { tipo: "texto", ref: "let-1" },
          t: "Você trabalha numa agência de turismo cultural e leu o texto «Do cortiço à favela: o Rio que se reinventou». A agência vai oferecer um passeio a pé pela região portuária para estudantes estrangeiros. Escreva o roteiro que será publicado no site da agência, com três ou quatro paradas e, para cada uma, o que aconteceu ali segundo o texto." },
        { id: "v1-t3", kind: "reclamacao", genero: "e-mail de reclamação", words: 150,
          insumo: { tipo: "audio", titulo: "Recado da síndica no grupo do prédio", speakers: ["Síndica", "Morador"], turns: [
            ["A", "Oi, pessoal, aqui é a Márcia, a síndica. Olha, é sobre a água de novo. A companhia cortou ontem às oito da manhã, sem aviso nenhum, e só voltou às onze da noite."],
            ["A", "Eu liguei três vezes pro atendimento. Na primeira me disseram que era manutenção programada. Na segunda, que era um vazamento na rua. Na terceira, ninguém atendeu."],
            ["B", "Márcia, e a conta? Porque a minha veio mais alta este mês, e eu nem tava em casa na semana passada."],
            ["A", "Pois é, veio mais alta pra muita gente. Eu sugiro que cada um mande a sua reclamação por escrito, com o número do protocolo. Quanto mais gente reclamar, melhor."]
          ] },
          t: "Você mora no prédio da síndica Márcia e ouviu o recado dela no grupo de mensagens. Escreva um e-mail para a Ouvidoria da companhia de água relatando o que aconteceu, apontando as informações contraditórias que os moradores receberam e fazendo pedidos concretos." },
        { id: "v1-t4", kind: "formale", genero: "e-mail formal", words: 130,
          insumo: { tipo: "texto", titulo: "Aviso do Real Gabinete Português de Leitura", texto: "Obras raras: consulta mediante agendamento. O acervo de obras raras do Real Gabinete Português de Leitura, que inclui edições dos séculos XVI a XVIII, está disponível para pesquisadores. A consulta deve ser solicitada por e-mail à Direção, com pelo menos quinze dias de antecedência, informando o nome completo, a instituição de origem, o tema da pesquisa e as obras de interesse. Os pesquisadores estrangeiros devem apresentar, no dia da consulta, o passaporte e uma carta da sua instituição. Não é permitido fotografar com flash. A sala de consulta funciona de segunda a sexta, das 10h às 16h." },
          t: "Você está escrevendo um trabalho sobre a recepção de Camões no Brasil e leu o aviso do Real Gabinete Português de Leitura. Escreva à Direção da biblioteca pedindo para consultar uma edição antiga de Os Lusíadas, de acordo com o que o aviso exige." }
      ] },
      { id: "v2", ascolto: "asc-2", lettura: "let-2", scrittura: [
        { id: "v2-t1", kind: "resumo", genero: "resumo", words: 180,
          insumo: { tipo: "audio", ref: "asc-2" },
          t: "Você é professor(a) de história num curso de português para estrangeiros e ouviu a conversa com o historiador Paulo Menezes sobre a chegada da corte ao Rio em 1808. Escreva um resumo da conversa para o blog do curso, para os alunos que não puderam ouvi-la, atribuindo as ideias ao historiador." },
        { id: "v2-t2", kind: "argomentativo", genero: "post de blog", words: 180,
          insumo: { tipo: "texto", ref: "let-2" },
          t: "Você mantém um blog sobre viagens e história e leu o texto «Abril em Lisboa: o fim da ditadura e do império». Vai visitar Lisboa em abril. Escreva um post para os seus leitores explicando por que o 25 de Abril é tão importante para os portugueses e sugerindo lugares da cidade ligados a essa história." },
        { id: "v2-t3", kind: "email", genero: "e-mail a um amigo", words: 150,
          insumo: { tipo: "audio", titulo: "Trecho do podcast Vida Remota", speakers: ["Apresentador", "Psicóloga"], turns: [
            ["A", "Então, doutora, trabalhar de casa é bom ou não é?"],
            ["B", "É bom pra muita gente, mas tem um risco que pouca gente vê: o trabalho não tem mais hora pra acabar. A pessoa responde e-mail no jantar, no fim de semana, na cama…"],
            ["A", "E o que a senhora recomenda?"],
            ["B", "Três coisas simples. Ter um lugar só pra trabalhar, mesmo que seja um canto da sala. Combinar um horário e desligar as notificações depois dele. E sair de casa todo dia, nem que seja pra dar uma volta no quarteirão. O corpo precisa saber que o expediente terminou."]
          ] },
          t: "O seu amigo Caio começou a trabalhar de casa e mandou uma mensagem dizendo que está exausto e trabalhando até meia-noite. Depois de ouvir o trecho do podcast Vida Remota, escreva um e-mail para ele com conselhos baseados no que a psicóloga diz." },
        { id: "v2-t4", kind: "carta_aberta", genero: "carta aberta", words: 180,
          insumo: { tipo: "texto", titulo: "Nota do jornal do bairro", texto: "Prefeitura estuda fechar a Biblioteca Lima Barreto. A Secretaria Municipal de Cultura confirmou ontem que estuda o fechamento da Biblioteca Lima Barreto, no Méier, por causa do custo de manutenção do prédio, que precisa de reformas no telhado e na parte elétrica. Segundo a secretaria, o acervo de cerca de doze mil livros seria transferido para a Biblioteca do Centro. A biblioteca atende, em média, trezentas pessoas por semana, a maior parte estudantes das escolas públicas da região e idosos que frequentam o clube de leitura das quintas-feiras. A decisão final deve sair em trinta dias." },
          t: "Você mora no Méier e leu a nota do jornal do bairro. Em nome da associação de moradores, escreva uma carta aberta ao secretário municipal de Cultura, que será publicada no jornal e nas redes, argumentando contra o fechamento e propondo alternativas." }
      ] },
      { id: "v3", ascolto: "asc-3", lettura: "let-3", scrittura: [
        { id: "v3-t1", kind: "guia", genero: "texto de apresentação (guia)", words: 180,
          insumo: { tipo: "audio", ref: "asc-3" },
          t: "Uma universidade de Santana do Livramento vai receber estudantes de intercâmbio de outros países da América Latina. Depois de ouvir a entrevista com o professor Tiago Pereira no programa Brasil de Ponta a Ponta, escreva o texto de apresentação da cidade que será publicado na página de boas-vindas aos estudantes, com dicas práticas para a vida na fronteira." },
        { id: "v3-t2", kind: "artigo", genero: "artigo de divulgação", words: 200,
          insumo: { tipo: "texto", ref: "let-3" },
          t: "Uma revista de divulgação científica para jovens prepara um número sobre a Amazônia. Você leu o texto «O ouro branco da Amazônia». Escreva um artigo para a revista mostrando como a história da borracha ajuda a entender os debates atuais sobre a floresta e quem vive dela." },
        { id: "v3-t3", kind: "panfleto", genero: "texto de campanha", words: 140,
          insumo: { tipo: "audio", titulo: "Recado do posto de saúde no rádio comunitário", speakers: ["Locutor", "Enfermeira"], turns: [
            ["A", "E agora um recado importante do posto de saúde da Vila Esperança. Tá aqui com a gente a enfermeira Rosângela."],
            ["B", "Boa tarde. A gente tá em plena campanha de vacinação contra a gripe, e a procura tá muito baixa. Só vinte por cento das pessoas com mais de sessenta anos vieram até agora."],
            ["A", "E por que a senhora acha que o pessoal não tá vindo?"],
            ["B", "Tem muita notícia falsa circulando, dizendo que a vacina dá gripe. Não dá. E tem gente que não consegue vir no horário. Por isso, no sábado, dia doze, o posto vai abrir das oito às cinco, e quem não puder sair de casa pode ligar pra gente, que a equipe vai até lá."]
          ] },
          t: "Você é voluntário(a) da associação de moradores da Vila Esperança e ouviu o recado do posto de saúde no rádio comunitário. Escreva o texto de um folheto que será distribuído nas casas do bairro para convencer os moradores a se vacinarem." },
        { id: "v3-t4", kind: "reclamacao", genero: "e-mail de reclamação", words: 150,
          insumo: { tipo: "texto", titulo: "Resposta da loja Casa & Cia", texto: "Prezado cliente, agradecemos o seu contato. Informamos que, conforme a nossa política de trocas, produtos com defeito podem ser trocados em até sete dias após a entrega, mediante apresentação da nota fiscal. Como a sua solicitação foi registrada doze dias após a entrega, infelizmente não será possível realizar a troca. Sugerimos que o senhor entre em contato diretamente com o fabricante. Atenciosamente, Equipe de Atendimento Casa & Cia." },
          t: "Você comprou uma geladeira na loja Casa & Cia. Ela chegou com a porta amassada, você reclamou por telefone no dia da entrega, mas o atendimento só registrou o pedido por escrito doze dias depois. Depois de ler a resposta da loja, escreva um novo e-mail ao atendimento contestando a recusa e pedindo uma solução. Lembre que, pelo Código de Defesa do Consumidor, o prazo para reclamar de defeitos em produtos duráveis é de noventa dias." }
      ] }
    ]
  };
  // La grilla de las tres adequações, igual para todas las tarefas.
  var RUBRICA = [["contexto", "Adequação ao contexto: cumple el propósito con el interlocutor y el género pedidos, y usa la información del insumo (el audio o el texto) sin copiarlo"],
                 ["discursiva", "Adequação discursiva: coherencia, progresión de las ideas, párrafos y conectores propios del género"],
                 ["linguistica", "Adequação linguística (gramática): tratamiento coherente con el interlocutor, tiempos y modos, regencias, crase, colocação pronominal"],
                 ["lexico", "Adequação linguística (léxico): precisión, registro adecuado al interlocutor, sin calcos del español ni falsos amigos"]];
  ESAME.versoes.forEach(function (v) { v.scrittura.forEach(function (t) { t.rubric = RUBRICA; }); });
  // la pantalla de hoy (app.js) muestra `scrittura`: la versión 1
  ESAME.scrittura = ESAME.versoes[0].scrittura;
  if (typeof module === "object" && module.exports) module.exports = ESAME; else root.EsameData = ESAME;
})(typeof window !== "undefined" ? window : globalThis);
