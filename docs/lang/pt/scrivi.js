/* Scrivi: la misión semanal de producción libre.
 *
 * Cada semana (menos las de jefe: 13, 26, 39 y 52) pide un texto corto con
 * la función comunicativa de la semana (SAI_FARE de tools/curriculo.py:
 * «contá lo que hiciste», «pedí con cortesía») y con sus estructuras («al
 * menos 5 verbos en pretérito perfeito», «4 contracciones con em»).  No hay
 * una respuesta única: el corrector cuenta las estructuras pedidas y busca
 * en el texto los errores que un hispanohablante comete de verdad (español
 * metido, «em o», «gosto café», «vi ao João», «tenho comido hoje», «se eu
 * ter», «vou a praia», «muy», heterogenéricos, falsos amigos…), con las
 * mismas categorías del diagnóstico (diagnosi.js).  Cada tarea trae un
 * texto modelo para comparar después de escribir.  Desde la semana 27 los
 * modelos tratan también historia, literatura, sociología y política de
 * Brasil y de Portugal; lo cotidiano pasa en Río.
 */
(function (root) {
  "use strict";
  var D = root.Diagnosi || (typeof require === "function" ? require("./diagnosi.js") : null);
  var Conj = root.Conj || (typeof require === "function" ? (function () { try { return require("./conjugator.js"); } catch (e) { return null; } })() : null);

  /* ------------------------------------------------------------ tareas
     t: la consigna; min: palabras; use: [estructura, cuántas, etiqueta];
     model: un texto que cumple todo (tools/test_scrivi.js lo verifica).
     Cada modelo usa solo la gramática vista hasta su semana. */
  var TASKS = {
    1: { t: "Presentate: cómo te llamás, de dónde sos, cuántos años tenés, qué hacés y cómo estás hoy.", min: 15,
         use: [["ser", 2, "2 formas de ser (sou, é, somos…)"], ["estar", 1, "1 forma de estar (estou, está…)"], ["ter", 1, "1 forma de ter (tenho, tem…)"]],
         model: "Oi! Eu me chamo Martín. Sou argentino, de Rosario, e sou professor de história. Tenho trinta anos. Hoje estou em Copacabana e estou feliz. E você, como está?" },
    2: { t: "Contá qué tenés y qué hay en tu casa: hermanos, animales, cosas. Usá sustantivos en plural.", min: 15,
         use: [["plurais", 4, "4 sustantivos en plural"], ["haTem", 2, "2 veces tem o há"]],
         model: "Tenho dois irmãos e três primos. Em casa tenho dois gatos, cinco plantas e dez livros. Há duas janelas grandes e três cadeiras. Também tem dois violões e duas mesas." },
    3: { t: "Describí tu barrio en Río: dónde están las cosas (la playa, el metro, la panadería) y dónde está la gente.", min: 20,
         use: [["contracoes", 4, "4 contracciones (no, na, do, da, ao, pelo…)"], ["estar", 2, "2 formas de estar"]],
         model: "O meu apartamento é em Botafogo, perto da praia. A estação do metrô está no fim da rua e a padaria está na esquina. O mercado é ao lado do banco. Os meus amigos estão na Lapa hoje." },
    4: { t: "Describí a una persona que conocés: de dónde es, cómo es por fuera y por dentro.", min: 20,
         use: [["adjetivos", 5, "5 adjetivos concordados"]],
         model: "A Bia é brasileira, de Niterói. É alta, magra e muito simpática. Tem os olhos verdes e o cabelo castanho e comprido. É uma pessoa alegre, mas um pouco tímida. O irmão da Bia é engraçado." },
    5: { t: "Contá tu rutina de un día de semana: dónde trabajás o estudiás, qué comés, qué hacés a la noche.", min: 25,
         use: [["presente", 5, "5 verbos en presente"]],
         model: "De manhã eu trabalho num escritório no Centro. Almoço com os colegas perto da Cinelândia. Depois do trabalho, corro no calçadão de Copacabana. De noite janto em casa, estudo português e escuto bossa nova." },
    6: { t: "Contá tus planes simples para el sábado: adónde vas, quién viene, qué querés y qué podés hacer.", min: 25,
         use: [["irregulares", 4, "4 verbos irregulares en presente (ir, vir, poder, querer, fazer, sair…)"]],
         model: "No sábado quero ir ao Arpoador com a Ana. Ela vem de Niterói de barca e eu saio de casa cedo. Vocês podem vir também? Depois vamos ao boteco e fazemos um churrasco no terraço." },
    7: { t: "Escribí tu agenda de la semana: qué día, a qué hora, cuánto cuesta. Los números, con letras.", min: 25,
         use: [["horas", 3, "3 horas (às oito, à uma, ao meio-dia…)"], ["numeros", 3, "3 números escritos con letras"]],
         model: "Na segunda-feira, às oito, tenho aula de português. Na quarta, às seis e meia, jogo futevôlei em Ipanema. O show de samba na Lapa é na sexta, dia doze, às dez da noite. O ingresso custa quarenta reais." },
    8: { t: "Le escribís un WhatsApp a Bia, tu vecina carioca, para invitarla a una roda de samba el sábado: contale qué estás haciendo ahora, qué van a hacer y hacele tres preguntas (la hora, el lugar, quién va).", min: 40,
         use: [["perguntas", 3, "3 preguntas"], ["irInf", 1, "1 ir + infinitivo (vou sair, vai chover…)"]],
         model: "Oi, Bia! Tudo bem? Estou estudando português agora, mas no sábado vou sair: tem uma roda de samba na Pedra do Sal. Você quer ir comigo? A que horas você pode sair de casa? Vou chamar o Rafa e a Ana também. Você conhece a Pedra do Sal? Depois a gente vai comer um pastel na feira. Beijos, Sofía" },
    9: { t: "Una amiga llega el domingo a Río y se va a quedar en tu casa, en Botafogo. Escribile un mensaje para explicarle cómo llegar desde el aeropuerto: en qué va, por dónde pasa y dónde baja.", min: 45,
         use: [["preposicoes", 5, "5 preposiciones (em, a, para, de, por y sus contracciones)"]],
         model: "Oi, Carla! Do aeroporto Santos Dumont até a minha casa é fácil. Você sai pela porta principal e vai a pé até a estação do VLT. Aí você pega o VLT para a Cinelândia e lá desce para o metrô. No metrô, vai até Botafogo: são poucas estações. Na saída, pergunta pela Rua Voluntários da Pátria. Eu moro no número 50, perto da padaria. Beijo!" },
    10: { t: "Tu profesora pidió que cada alumno presente a su familia al grupo con una foto. Escribí el texto que acompaña la foto: quién es quién y de quién es cada cosa.", min: 45,
          use: [["possessivos", 3, "3 posesivos (meu, minha, dele, dela…)"], ["demonstrativos", 1, "1 demostrativo (este, esse, aquele…)"]],
          model: "Oi, turma! Nesta foto está a minha família na casa dos meus avós, em Rosario. Este de camisa azul é o meu pai, e a mulher ao lado dele é a minha mãe. Aquela menina de chapéu é a minha irmã, Lucía; o cachorro é dela e se chama Tango. E essa bicicleta vermelha? É minha!" },
    11: { t: "Un amigo porteño te pregunta por WhatsApp qué hiciste en tu primer fin de semana en Río. Contale adónde fuiste, qué comiste y qué fue lo que más te gustó.", min: 45,
          use: [["perfeito", 4, "4 verbos en pretérito perfeito"]],
          model: "Oi, Nico! O fim de semana foi incrível. No sábado fui ao Pão de Açúcar de bondinho e vi a cidade inteira lá de cima. Depois comi uma moqueca num restaurante da Urca. No domingo acordei cedo, corri no calçadão de Copacabana e tomei água de coco. Do que eu mais gostei? Do pôr do sol no Arpoador: a gente aplaudiu! Abraço." },
    12: { t: "Tu compañero de departamento se levanta siempre tarde y con dolor de cabeza. Dejale una nota en la heladera: contale cómo es tu mañana y dale tres consejos.", min: 45,
          use: [["reflexivos", 2, "2 verbos reflexivos"], ["imperativo", 2, "2 imperativos"]],
          model: "Rafa, eu me levanto às sete, tomo banho e me visto sem pressa. Tomo um café na varanda antes de sair. Três conselhos para você: durma antes da meia-noite, beba muita água e não fique no celular na cama. Quando a cabeça dói, tome um remédio e descanse. Um abraço!" },
    14: { t: "Você vai dividir um apartamento no Rio com uma estudante que ainda não conhece. Escreva uma mensagem para ela: conte do que você gosta e do que não gosta (comida, música, esporte) e pergunte dos gostos dela.", min: 50,
          use: [["gostar", 3, "3 veces gostar de"]],
          model: "Oi, Mariana! Sou a Sofía, sua nova colega de apartamento. Eu gosto muito de cozinhar, principalmente feijoada, mas não gosto de jiló. Gosto de ouvir samba e bossa nova, e nos fins de semana gosto de correr no Aterro. Não gosto de barulho depois das onze. E você? Do que você gosta? Precisa de alguma coisa para o quarto? Beijo!" },
    15: { t: "Uma revista para imigrantes pediu relatos curtos sobre «a cidade onde eu cresci». Escreva o seu: como era a sua cidade, o que você fazia quando era criança e algo que aconteceu um dia.", min: 50,
          use: [["imperfeito", 3, "3 verbos en imperfeito"], ["perfeito", 1, "1 perfeito para lo que pasó"]],
          model: "Eu cresci em Córdoba, numa rua de terra perto do rio. Quando eu era criança, todo mundo se conhecia. Eu brincava na rua com os vizinhos até tarde, e a minha avó fazia empanadas aos domingos. No verão, a gente nadava no rio e pescava com o meu avô. Um dia, um temporal derrubou a árvore da esquina, e o bairro inteiro ajudou a limpar a rua." },
    16: { t: "A sua vizinha, dona Lúcia, viajou e deixou você cuidando da casa. Escreva um bilhete para ela contando o que você fez com as coisas e com as pessoas: as plantas, o gato, as cartas, o eletricista.", min: 50,
          use: [["pronomes", 3, "3 pronombres de objeto (o, a, os, as, lhe, -lo…)"]],
          model: "Dona Lúcia, está tudo bem por aqui. As plantas? Eu as reguei todos os dias. O gato comeu bem: eu o vi na janela hoje de manhã. As cartas estão na mesa da cozinha; eu não as abri. O eletricista veio na terça, e eu lhe mostrei o problema do chuveiro. Ele vai voltar para consertá-lo na segunda. Um beijo, Sofía" },
    17: { t: "Você vai fazer um intercâmbio no Rio no ano que vem. Escreva um e-mail para a coordenação do curso de português apresentando os seus planos: o que vai estudar, onde vai morar e o que vai fazer nos fins de semana.", min: 50,
          use: [["futuro", 3, "3 verbos en futuro do presente"]],
          model: "Prezada coordenação, meu nome é Martín Pérez e no ano que vem farei um intercâmbio de seis meses na UFRJ. Estudarei português de manhã e História do Brasil à tarde. Morarei numa casa de estudantes em Botafogo. Nos fins de semana, conhecerei Petrópolis e Paraty. Queria saber se o curso terá aulas aos sábados. Atenciosamente, Martín Pérez" },
    18: { t: "Você e três amigos vão comemorar um aniversário num restaurante de Santa Teresa. Escreva uma mensagem para o restaurante reservando a mesa e fazendo dois pedidos especiais, com cortesia.", min: 50,
          use: [["condicional", 2, "2 verbos en condicional (futuro do pretérito)"]],
          model: "Boa tarde! Eu gostaria de reservar uma mesa para quatro pessoas no sábado, às oito, para comemorar o aniversário de uma amiga. Seria possível uma mesa na varanda, com vista para a Baía de Guanabara? Vocês poderiam também preparar uma sobremesa sem glúten? Uma das minhas amigas é celíaca. Eu agradeceria muito. Obrigado, Martín" },
    19: { t: "Um amigo argentino não sabe se vai morar no Rio ou em São Paulo e pediu a sua opinião. Escreva uma mensagem comparando as duas cidades (preços, praias, trânsito, comida) e diga qual você escolheria.", min: 55,
          use: [["comparativos", 3, "3 comparaciones (mais… do que, tão… quanto, melhor, maior…)"]],
          model: "Oi, Nico! São Paulo é maior do que o Rio e tem mais empregos, mas o trânsito é pior. No Rio, os aluguéis são tão caros quanto em São Paulo, principalmente na Zona Sul. A comida paulistana é a melhor do Brasil, dizem, mas o Rio tem as praias mais bonitas. Eu escolheria o Rio: a qualidade de vida é melhor. Abraço!" },
    20: { t: "O seu amigo Rafa convidou você para uma festa, mas você está cansado e não quer sair. Responda à mensagem dele recusando tudo, com educação e bom humor.", min: 50,
          use: [["negacoes", 3, "3 negaciones (nada, ninguém, nenhum, nunca, nem…)"]],
          model: "Oi, Rafa! Valeu pelo convite, mas hoje não vou a lugar nenhum. Não conheço ninguém nessa festa e não tenho nenhuma roupa limpa. Também não posso beber nada: amanhã trabalho cedo. E você sabe que eu nunca saio no domingo à noite, nem para ver o Flamengo. Fica para a próxima, tá? Abraço." },
    21: { t: "Uma amiga que você não vê há meses mandou uma mensagem: «E aí, quais são as novidades?». Responda contando o que você tem feito ultimamente e algo que já tinha acontecido quando ela foi embora do Rio.", min: 55,
          use: [["perfeitoComposto", 2, "2 perfeitos compostos (tenho trabalhado…)"], ["maisQuePerfeitoComposto", 1, "1 mais-que-perfeito (tinha começado…)"]],
          model: "Oi, Ju! Quanto tempo! Ultimamente tenho trabalhado muito e tenho estudado português todas as noites. Também tenho corrido no Aterro nos fins de semana. Quando você foi embora do Rio, eu já tinha mudado de apartamento, lembra? Agora moro em Laranjeiras, perto do Largo do Machado. E você? O que tem feito em Salvador? Beijos!" },
    22: { t: "Você escreve para o jornal da escola de português. Escreva uma nota curta sobre um monumento do Rio: quando foi construído, por quem e o que aconteceu com ele depois.", min: 55,
          use: [["passiva", 3, "3 pasivas (foi construído, é visitado…)"]],
          model: "O Cristo Redentor foi construído entre 1922 e 1931 e foi inaugurado em outubro de 1931. O projeto foi feito pelo engenheiro Heitor da Silva Costa, e o rosto foi esculpido pelo romeno Gheorghe Leonida. Em 2007, o monumento foi escolhido como uma das sete maravilhas do mundo moderno. Hoje ele é visitado por milhões de turistas todos os anos." },
    23: { t: "A sua amiga Bia está doente e triste porque vai perder uma viagem. Escreva uma mensagem para animá-la: diga o que você espera, o que recomenda e o que deseja.", min: 55,
          use: [["subjuntivo", 3, "3 verbos en presente do subjuntivo"]],
          model: "Querida Bia, que pena que você não possa viajar! Espero que você esteja melhor hoje. É importante que você descanse e que beba muita água. Talvez seja uma boa ideia ficar em casa vendo séries no fim de semana. Quero que você me ligue amanhã, sem falta. Tomara que você fique boa logo e que a viagem seja só adiada! Um beijo, Sofía" },
    24: { t: "Você está organizando uma viagem para Paraty com três amigos. Escreva uma mensagem para o grupo explicando o plano: para que, em que condições e apesar de quê.", min: 55,
          use: [["conjuncoes", 3, "3 conjunciones con subjuntivo (para que, embora, caso, antes que…)"]],
          model: "Pessoal, a ideia é sair na sexta às seis para que a gente pegue pouco trânsito. Embora a pousada seja simples, fica perto do centro histórico. Caso chova no sábado, vamos à cachoeira no domingo. Vou reservar hoje, antes que os preços subam. Cada um leva uma toalha, um chapéu e protetor solar. Quem topa? Beijos!" },
    25: { t: "Um site de intercâmbio pediu que você descreva o seu bairro para os estudantes que vão chegar. Escreva o texto: a rua onde você mora, as pessoas com quem você convive e o lugar de que mais gosta.", min: 55,
          use: [["relativos", 3, "3 relativos (que, quem, onde, cujo, o que…)"]],
          model: "Moro num bairro de que eu gosto muito: Santa Teresa. A rua onde moro tem um bonde amarelo que passa o dia inteiro. A vizinha com quem divido o apartamento é uma artista cujos quadros estão num ateliê da Lapa. O que eu mais adoro é a vista da baía. Para quem vem estudar aqui, recomendo o café da esquina." },
    27: { t: "Você vai se mudar para o Rio. Escreva uma mensagem a um amigo contando o que vai fazer quando chegar, se conseguir trabalho e assim que puder. Inclua um lugar histórico da cidade.", min: 45,
          use: [["futSubj", 4, "4 verbos en futuro do subjuntivo (quando eu for, se você quiser…)"]],
          model: "Quando eu me mudar para o Rio, vou morar no Centro. Se eu conseguir o emprego, vou visitar o Paço Imperial, onde o príncipe regente dom João despachava depois que a corte portuguesa chegou, em 1808. Assim que eu puder, vou à Biblioteca Nacional. Se você quiser, vamos juntos." },
    28: { t: "Se você pudesse viajar para um momento da história do Brasil, qual seria? Escreva um texto curto para o blog da turma imaginando o que faria e quem conheceria.", min: 45,
          use: [["subjImperfeito", 3, "3 verbos en imperfeito do subjuntivo (se eu fosse…)"], ["condicional", 2, "2 condicionales"]],
          model: "Se eu pudesse viajar no tempo, iria ao Rio de maio de 1888, quando a princesa Isabel assinou a Lei Áurea, que aboliu a escravidão. Se eu vivesse naquela época, gostaria de conhecer André Rebouças e Joaquim Nabuco, dois grandes abolicionistas. Se eu tivesse coragem, perguntaria a eles o que esperavam do futuro do país." },
    29: { t: "O que é preciso para as pessoas aprenderem de verdade? Escreva um parágrafo para o debate da turma, com o infinitivo pessoal, citando um educador brasileiro.", min: 45,
          use: [["infPessoal", 4, "4 infinitivos personales (para eles saberem, é bom nós irmos…)"]],
          model: "Para os alunos aprenderem de verdade, é importante os professores partirem da realidade deles. Essa era a ideia de Paulo Freire, que escreveu que a leitura do mundo precede a leitura da palavra. Em 1963, em Angicos, trezentos trabalhadores aprenderam a ler sem precisarem de cartilhas com frases alheias à vida deles: bastou eles discutirem palavras do próprio cotidiano." },
    30: { t: "Pense num momento da história (a sua ou a do Brasil) que poderia ter sido diferente e escreva o que teria acontecido se…", min: 45,
          use: [["hipotesePassado", 4, "4 tiempos compuestos de hipótesis (tivesse feito, teria ido…)"]],
          model: "Se o príncipe Pedro não tivesse proclamado a Independência em 7 de setembro de 1822, talvez o Brasil tivesse continuado ligado a Portugal por mais tempo. Na minha vida também foi assim: se eu não tivesse estudado português, não teria lido Machado de Assis no original e não teria conhecido os meus melhores amigos." },
    31: { t: "Conte a um colega o que alguém disse numa palestra ou numa entrevista: o que contou, o que você perguntou, o que essa pessoa respondeu.", min: 50,
          use: [["indireto", 4, "4 verbos de decir con que, se o para (disse que…, perguntou se…)"]],
          model: "Na palestra, o historiador português disse que o 25 de Abril de 1974 tinha começado com canções no rádio: a senha final tinha sido Grândola, Vila Morena, de Zeca Afonso. Explicou que os militares derrubaram o Estado Novo quase sem violência. Perguntei se os cravos eram só um símbolo, e ele respondeu que uma mulher tinha distribuído cravos aos soldados. No fim, pediu que nós lêssemos Sophia de Mello Breyner." },
    32: { t: "Escreva os cartazes e avisos de uma rua do Rio: o que se aluga, o que se vende, o que se procura, o que não se permite.", min: 30,
          use: [["se", 4, "4 construcciones con se (aluga-se, vendem-se, precisa-se de…)"]],
          model: "Aluga-se apartamento de dois quartos em Botafogo. Vendem-se bicicletas usadas na loja da esquina. Precisa-se de garçons para o quiosque do calçadão. Aceitam-se cartões e Pix. Aqui não se permite fumar." },
    33: { reg: "formal", t: "Apresente um escritor brasileiro num texto formal para o boletim da biblioteca, com pronomes presos ao verbo (fez-se, conta-nos, dir-se-ia).", min: 50,
          use: [["encliticos", 4, "4 pronombres enclíticos o mesoclíticos"]],
          model: "Machado de Assis nasceu em 1839, no Morro do Livramento, no Rio de Janeiro. Filho de um pintor de paredes, fez-se escritor quase sozinho e tornou-se o maior romancista brasileiro. Em Dom Casmurro, de 1899, Bentinho conta-nos a sua versão da história e pede-nos que acreditemos nela. Dir-se-ia que o leitor é o verdadeiro juiz de Capitu." },
    34: { t: "Dê a sua opinião sobre uma questão social do Rio (a cidade partida, as favelas, as praias) num comentário para o site de um jornal: argumente e conecte as ideias.", min: 50,
          use: [["conectores", 5, "5 conectores distintos (porém, no entanto, aliás, portanto, já que…)"]],
          model: "Em 1994, o jornalista Zuenir Ventura chamou o Rio de cidade partida. De um lado há bairros ricos à beira-mar; do outro, favelas nos morros. No entanto, as duas cidades não vivem separadas: aliás, dependem uma da outra todos os dias. Portanto, a imagem é útil, porém incompleta, já que o samba, o funk e o futebol atravessam essas fronteiras." },
    35: { t: "Conte a um amigo um filme ou um livro brasileiro que marcou você, com os verbos e as suas preposições (assistir a, gostar de, pensar em, sonhar com…).", min: 50,
          use: [["regencia", 4, "4 verbos con su preposición (assistir a, pensar em…)"]],
          model: "Ontem assisti ao filme Central do Brasil, de Walter Salles, pela terceira vez. Gosto muito da história da Dora e do menino Josué. Sempre penso na viagem dos dois pelo sertão e sonho com uma viagem assim pelo Nordeste. Preciso de muito mais tempo para conhecer o Brasil de verdade." },
    36: { t: "Conte à sua família como foi o seu sábado no Rio, com horários e lugares: a feira, a praia, a noite na Lapa.", min: 45,
          use: [["crase", 4, "4 veces la crase (à, às, àquele…)"]],
          model: "Todos os sábados vou à feira da Glória às nove da manhã. Depois vou à praia e, à tarde, dou uma volta à beira da Lagoa. Às vezes vou à Lapa à noite com os meus amigos para ouvir samba, e volto para casa às duas." },
    37: { t: "Para a revista de divulgação da faculdade, explique como trabalha um instituto científico ou uma repartição pública, com verbos como manter, obter, propor, prever, intervir.", min: 50,
          use: [["irregDerivados", 4, "4 formas de verbos irregulares menos frecuentes (mantém, obtêm, propõe, preveem…)"]],
          model: "A Fiocruz, que nasceu em 1900 em Manguinhos, mantém até hoje a tradição de Oswaldo Cruz. Quando uma epidemia começa, os pesquisadores preveem os riscos, obtêm dados dos postos de saúde e propõem campanhas de vacinação. Às vezes o governo intervém, e nem sempre as ideias cabem no orçamento. Eu passeio pelo campus e admiro o castelo mourisco." },
    38: { t: "Escreva uma mensagem de WhatsApp para um amigo carioca, do jeito que se fala, convidando-o para o boteco.", min: 30,
          use: [["coloquial", 4, "4 marcas del habla (tá, pra, né, cadê, a gente, tô…)"]],
          model: "E aí, Rafa, beleza? Cadê você? A gente tá no boteco da esquina, perto do Arpoador. Vem pra cá, né? Tô com saudade! Se não der, a gente se vê amanhã no futevôlei." },
    40: { reg: "formal", t: "Escreva um parágrafo de relatório sobre a Constituição de 1988, com registro formal e substantivos no lugar de verbos.", min: 50,
          use: [["nominalizacoes", 5, "5 nominalizaciones (-ção, -mento, -dade, -ência…)"]],
          model: "A promulgação da Constituição de 1988 representou o encerramento formal da transição democrática no Brasil. O texto garantiu a ampliação dos direitos sociais e a universalização do acesso à saúde, com a criação do Sistema Único de Saúde. Houve, ainda, o reconhecimento dos direitos dos povos indígenas e das comunidades quilombolas." },
    41: { t: "Para o clube de leitura, resuma o começo de um romance brasileiro como um narrador literário, com o mais-que-perfeito simples (fizera, dissera).", min: 50,
          use: [["maisQuePerfeito", 3, "3 verbos en mais-que-perfeito simple (fizera, deixara…)"]],
          model: "Quando Rubião se mudou para o Rio, o filósofo Quincas Borba já morrera e lhe deixara toda a fortuna, com uma condição: cuidar do cachorro, que também se chamava Quincas Borba. O antigo professor de Barbacena, que nunca imaginara tanta riqueza, herdara também uma filosofia estranha, o Humanitismo, que Machado de Assis inventara para rir dos sistemas do século XIX." },
    42: { t: "Escreva uma crônica de um domingo em Copacabana para o jornal do bairro, condensando com gerúndio, particípio e ao + infinitivo.", min: 50,
          use: [["gerundio", 2, "2 gerundios"], ["partAbs", 1, "1 participio absoluto (Terminado o almoço, …)"], ["aoInf", 1, "1 ao + infinitivo"]],
          model: "Chegando a Copacabana num domingo de sol, entendi por que Rubem Braga escrevia tanto sobre o mar. Terminado o almoço, descemos para o calçadão. Ao ver as ondas de pedra portuguesa, lembrei de Lisboa. Andando devagar até o Leme, ouvimos um vendedor de mate que cantava o preço como se fosse um samba." },
    43: { reg: "formal", t: "Escreva um e-mail formal à Biblioteca Nacional pedindo acesso a documentos para uma pesquisa.", min: 60,
          use: [["formal", 4, "4 fórmulas formales (Prezado/a, venho por meio desta, solicito, Atenciosamente…)"]],
          model: "Prezada Senhora Diretora, venho por meio desta solicitar acesso ao acervo de jornais de 1897 sobre a Guerra de Canudos. Sou pesquisadora argentina e estudo a cobertura que Euclides da Cunha fez do conflito antes de escrever Os Sertões, publicado em 1902. Gostaria de saber se seria possível consultar os originais na Hemeroteca. Segue em anexo a carta da minha universidade. Fico no aguardo de sua resposta. Atenciosamente, Laura Gómez" },
    44: { t: "Descreva o seu bairro para um amigo estrangeiro com diminutivos, aumentativos e substantivos derivados (cafezinho, casarão, jornaleiro…).", min: 50,
          use: [["sufixos", 6, "6 palabras con sufijo (-inho, -zinho, -ão, -aço, -eiro…)"]],
          model: "Todo domingo tomo um cafezinho na padaria da esquina e compro um pãozinho quentinho. Na frente mora um senhor bonachão num casarão antigo de Santa Teresa. O jornaleiro sabe todas as notícias do bairro, e o sorveteiro passa pela praça às quatro. Ontem, no Maracanã, vi um golaço do Flamengo." },
    45: { t: "Conte a um amigo o seu primeiro mês no Rio, usando bem os falsos amigos (vaso, copo, esquisito, embaraçada, borracha, escritório…).", min: 50,
          use: [["falsos", 3, "3 falsos amigos bien usados"]],
          model: "No meu primeiro mês no Rio, uma vizinha me deu um vaso com uma orquídea, e eu servi suco de caju num copo de vidro. Achei a comida do bar da esquina meio esquisita, mas depois me acostumei. Na praia, fiquei embaraçada quando não entendi uma piada. No escritório, uma colega me emprestou uma borracha para apagar o rascunho." },
    46: { t: "Conte, num post de viagem, uma visita a Lisboa e a Maputo: que palavras mudam, o que chamou a sua atenção, que autor você leu.", min: 60,
          use: [["variantes", 3, "3 palabras del portugués europeo o africano (autocarro, comboio, pequeno-almoço…)"]],
          model: "Em Lisboa, em vez de ônibus, peguei o autocarro, e para ir a Sintra tomei o comboio. No pequeno-almoço, que é o nosso café da manhã, pedi uma bica, o cafezinho deles. Fernando Pessoa, pela voz de Bernardo Soares, escreveu que a sua pátria era a língua portuguesa. Em Maputo li contos de Mia Couto, que inventa palavras novas com o português de Moçambique." },
    47: { t: "O jeitinho brasileiro é uma virtude ou um problema? Defenda uma tese matizada num texto para o debate da turma.", min: 60,
          use: [["modalizadores", 4, "4 modalizadores y organizadores (é possível que, ainda que, além disso, em suma…)"]],
          model: "Em primeiro lugar, é possível que o jeitinho seja, como sugere Roberto DaMatta, uma forma de conciliar a lei impessoal com as relações pessoais. Além disso, ao que parece, ele nasce da desconfiança diante de instituições distantes. Por outro lado, ainda que pareça simpático, o jeitinho pode abrir caminho para a corrupção. Em suma, mais do que condená-lo, convém entender de onde ele vem." },
    48: { reg: "formal", t: "Resuma para a turma as ideias de um ensaio brasileiro clássico, atribuindo-as com precisão (segundo o autor, defende, ressalta…).", min: 60,
          use: [["dicendi", 4, "4 verbos o expresiones para atribuir (defende, segundo, ressalta, ou seja…)"]],
          model: "Em Raízes do Brasil, de 1936, Sérgio Buarque de Holanda defende que o homem cordial é um traço da formação brasileira. Segundo o autor, cordial não quer dizer bondoso: vem de cor, coração, ou seja, de agir pelas emoções e não por regras impessoais. O historiador ressalta que essa cordialidade dificulta a separação entre o público e o privado. Para ele, a herança colonial explica boa parte desse comportamento." },
    49: { reg: "formal", t: "Um colega escreveu um comentário coloquial sobre Carolina Maria de Jesus e o seu diário. Reescreva-o no registro culto, para a revista da faculdade.", min: 60,
          use: [["culto", 4, "4 marcas del registro culto (há, nós + verbo, pronombre enclítico, contudo…)"]],
          model: "Há, na obra de Carolina Maria de Jesus, uma força que poucos livros possuem. Em Quarto de Despejo, publicado em 1960, a autora descreve-nos a fome na favela do Canindé, em São Paulo. Nós, leitores, reconhecemo-nos na sua voz, embora vivamos longe daquela realidade. Contudo, convém lembrar que o diário foi editado pelo jornalista Audálio Dantas. Ainda hoje, o livro é lido e discutido nas escolas." },
    50: { t: "Conte num e-mail a uma amiga uma pequena confusão com um amigo no Rio, usando expressões idiomáticas (pisar na bola, dar um jeito, fazer questão…).", min: 50,
          use: [["expressoes", 4, "4 expresiones idiomáticas"]],
          model: "Ontem pisei na bola com a minha amiga Carla: esqueci o aniversário dela. Mas dei um jeito: fiz questão de levar um bolo de aipim à casa dela, em Botafogo. Ela levou tudo na brincadeira e ficou de boa. No fim, deu tudo certo e ainda matamos a saudade de tanto tempo." },
    51: { t: "Escreva uma carta para você mesmo de um ano atrás: o que aprendeu, o que teria acontecido se não tivesse começado, o que recomenda.", min: 60,
          use: [["futSubj", 1, "1 futuro do subjuntivo"], ["perfeitoComposto", 1, "1 perfeito composto"], ["infPessoal", 1, "1 infinitivo pessoal"], ["crase", 1, "1 crase"]],
          model: "Querido eu de um ano atrás: quando você ler esta carta, já vai falar português. Tenho estudado todos os dias e tenho aprendido com os erros. Para nós chegarmos até aqui, foi preciso paciência. Se você tivesse desistido, não teria descoberto Guimarães Rosa, que escreveu que o correr da vida embrulha tudo. Vá à praia, leia muito e não tenha medo de errar." }
  };

  /* ------------------------------------------------------------ tokens */

  function toks(text) {
    var out = [], re = /[A-Za-zÀ-ÖØ-öø-ÿ]+(?:[-'][A-Za-zÀ-ÖØ-öø-ÿ]+)*|\d+|[.!?,;:]/g, m, start = true, clause = true, sentAt = 0;
    var src = String(text || "").normalize("NFC").replace(/[’‘`´]/g, "'");
    while ((m = re.exec(src))) {
      var o = m[0];
      if (/^[.!?,;:]$/.test(o)) { out.push({ p: o, at: m.index }); clause = true; if (/[.!?]/.test(o)) { start = true; sentAt = m.index + 1; } continue; }
      out.push({ o: o, w: o.toLowerCase(), at: m.index, len: o.length, start: start, clause: clause || start,
                 cap: /^[A-ZÀ-Ý]/.test(o), dlg: /[–—«"“]/.test(src.slice(sentAt, m.index)) });
      start = false; clause = false;
    }
    return out;
  }

  /* Every Portuguese word the course shows (answers, phrases, readings, the
     bank, the glossary): a word the learner writes that is in here exists. */
  var LEXI = Object.create(null), lexiN = 0;
  function learn(list) {
    (list || []).forEach(function (txt) {
      String(txt || "").normalize("NFC").toLowerCase().replace(/[’‘`´]/g, "'").split(/[^a-zà-ÿ'-]+/).forEach(function (w) {
        w = w.replace(/^['-]+|['-]+$/g, "");
        if (w.length > 1 && !LEXI[w]) { LEXI[w] = 1; lexiN++; }
        if (w.indexOf("-") > 0) w.split("-").forEach(function (x) { if (x.length > 1 && !LEXI[x]) { LEXI[x] = 1; lexiN++; } });
      });
    });
  }
  function learnCourse(src) {
    if (lexiN > 5000) return;
    src = src || {};
    var list = [];
    (src.items || []).forEach(function (it) {
      // Only what the learner has to write: stems and choice options carry Spanish.
      if (it.type === "translate" || it.type === "cloze" || it.type === "conjugate" || it.type === "plural" || it.type === "typed") {
        list.push(String(it.answer || "").replace(/\|/g, " "));
        (it.accept || it.alt || []).forEach(function (a) { list.push(a); });
      }
    });
    (src.bank && src.bank.sentences || []).forEach(function (x) { (x.pt || x.it || []).forEach(function (a) { list.push(a); }); });
    (src.phrases || []).forEach(function (f) { list.push(f.pt || f.it); });
    (src.readings || []).forEach(function (e) { list.push(e.text); });
    (src.extra || []).forEach(function (t) { list.push(t); });   // the long listenings and the models (tramo.js)
    learn(list);
    learn(Object.keys(src.glossario || {}));
    learn(Object.keys(DATA.lex || {}));
    // the diagnosis of the closed answers checks the same glossary before saying «no existe»
    if (D && D.addWords) D.addWords(Object.keys(src.glossario || {}));
  }
  // The words of the models and the most frequent Portuguese: known even
  // before the course data arrives.
  var BASE_WORDS = "a o as os um uma uns umas de do da dos das em no na nos nas num numa ao aos à às por pelo pela pelos pelas para " +
    "com sem até entre sobre contra desde após sob e ou mas porém contudo todavia entretanto portanto pois que se como quando onde " +
    "porque quem qual quais quanto quanta quantos quantas não sim já ainda também só muito muita muitos muitas pouco pouca poucos poucas " +
    "mais menos bem mal melhor pior maior menor eu tu ele ela nós eles elas você vocês me te lhe lhes mim ti si comigo contigo conosco " +
    "meu minha meus minhas teu tua teus tuas seu sua seus suas nosso nossa nossos nossas dele dela deles delas este esta estes estas esse " +
    "essa esses essas aquele aquela aqueles aquelas isto isso aquilo aqui aí ali lá cá hoje ontem amanhã agora depois antes sempre nunca " +
    "talvez então logo tarde cedo noite dia dias manhã semana mês ano anos vez vezes hora horas todo toda todos todas tudo nada ninguém " +
    "alguém algum alguma alguns algumas nenhum nenhuma outro outra outros outras cada mesmo mesma próprio própria tão tanto tanta " +
    "casa rua cidade bairro praia mar sol areia calçadão boteco feira metrô ônibus carro barca bonde táxi trem avião bicicleta " +
    "pai mãe pais filho filha irmão irmã irmãos avô avó avós tio tia primo prima primos amigo amiga amigos amigas namorado namorada " +
    "homem mulher menino menina criança crianças gente pessoa pessoas senhor senhora professor professora aluno aluna colega " +
    "trabalho escritório escola aula faculdade universidade livro livros filme música samba história vida mundo país língua " +
    "obrigado obrigada oi olá tchau beleza saudade legal ótimo bom boa bons boas novo nova velho velha grande pequeno pequena " +
    "segunda terça quarta quinta sexta sábado domingo feira janeiro fevereiro março abril maio junho julho agosto setembro outubro " +
    "novembro dezembro zero dois duas três quatro cinco seis sete oito nove dez onze doze treze catorze quatorze quinze vinte trinta " +
    "quarenta cinquenta cem mil primeiro primeira último última meio meia meio-dia meia-noite reais real centavos " +
    "rio brasil brasileiro brasileira carioca cariocas português portuguesa argentino argentina copacabana ipanema leblon arpoador " +
    "lapa botafogo urca glória flamengo tijuca niterói centro corcovado cristo maracanã lagoa leme " +
    "é são sou somos era eram foi foram ser estar estou está estamos estão tenho tem temos têm ter há vou vai vamos vão ir";
  var BASE_MORE = "água café pão pães leite queijo ovo arroz feijão carne frango peixe fruta frutas bolo sorvete suco cerveja vinho " +
    "açúcar sal mesa cadeira janela porta quarto sala cozinha banheiro chave telefone celular computador lápis caneta papel " +
    "caderno bolsa mala roupa sapato camisa vestido chapéu óculos cabelo olho olhos cabeça mão mãos pé pés braço perna corpo " +
    "coração voz cara rosto nome sobrenome idade aniversário festa jantar almoço lanche viagem passeio praça parque morro " +
    "montanha ilha lago rio floresta jardim árvore flor animal animais cachorro gato pássaro bicho peixe cavalo " +
    "médico médica hospital farmácia escola aluno aula prova exame livro livros jornal revista notícia notícias carta mensagem " +
    "empresa emprego salário dinheiro preço preços conta loja mercado supermercado padaria restaurante bar hotel museu igreja " +
    "estação ponto bondinho barco avião trem estrada caminho esquina centro bairro vizinho vizinha vizinhos cidade país mundo " +
    "estado governo lei política história guerra paz povo povos gente sociedade cultura arte música canção cinema teatro " +
    "romance conto poema escritor escritora autor autora leitor leitores obra obras página texto palavra palavras língua " +
    "tempo hora vez manhã tarde noite madrugada dia semana mês ano século verão inverno outono primavera chuva sol calor frio " +
    "vento nuvem céu mar praia areia onda ondas fim começo meio lado frente trás cima baixo dentro fora perto longe " +
    "problema problemas coisa coisas ideia ideias verdade mentira pergunta resposta razão motivo exemplo parte forma tipo " +
    "grande pequeno pequena bonito bonita feio feia novo nova velho velha alto alta baixo baixa bom boa mau má melhor pior " +
    "fácil difícil possível impossível importante interessante simples rápido devagar cedo tarde sempre nunca já ainda " +
    "muito pouco bastante demais quase só apenas também talvez claro certo certa errado errada junto juntos sozinho sozinha " +
    "feliz triste cansado cansada contente alegre bravo calmo nervoso ocupado livre cheio vazio quente gelado caro barato " +
    "primeiro segundo terceiro quarto quinto último próximo passado passada seguinte anterior inteiro inteira todo toda " +
    "branco preto vermelho azul verde amarelo cinza rosa roxo marrom laranja moreno loiro castanho " +
    "sessenta setenta oitenta noventa cem duzentos trezentos quinhentos mil milhão milhões " +
    "ajuda amor amigo sonho saudade medo fome sede sono pressa sorte vontade paciência coragem " +
    "português brasileiro brasileira argentino argentina espanhol inglês francês italiano alemão alemã uruguaio chileno " +
    "portugueses brasileiros carioca cariocas paulista mineiro baiano nordestino gaúcho " +
    "violão violões limão limões mãe irmão irmãos cidadão cidadãos avião aviões estação estações lição lições lâmpada poltrona " +
    "muitíssimo muitíssima lindíssimo ótimo péssimo";
  function learnBase(txt) {
    var add = function (w) { if (w && !LEXI[w]) { LEXI[w] = 1; lexiN++; } };
    txt.split(/\s+/).forEach(function (w) {
      add(w);
      if (/[aeiouéêóô]$/.test(w) && !/ão$/.test(w)) add(w + "s");
      else if (/[rz]$/.test(w)) add(w + "es");
      else if (/al$/.test(w)) add(w.replace(/al$/, "ais"));
      else if (/m$/.test(w)) add(w.replace(/m$/, "ns"));
    });
  }
  learn([BASE_WORDS]);
  learnBase(BASE_MORE);
  var lexiBase = lexiN;

  function known(w) {
    if (!w) return false;
    if (LEXI[w] || (U.isPortuguese && U.isPortuguese(w)) || V(w).length || PP(w) || GER(w)) return true;
    if (regVerbKnown(w)) return true;
    if (w.indexOf("-") > 0) {
      var sp = U.splitEnclitic && U.splitEnclitic(w);
      if (sp && (known(sp.v) || V(sp.v).length)) return true;
      return w.split("-").every(function (x) { return !x || LEXI[x] || (U.isPortuguese && U.isPortuguese(x)) || V(x).length || /^(se|me|te|nos|lhe|lhes|o|a|os|as|lo|la|los|las|no|na|ei|á|ás|emos|ão|ia|iam|íamos)$/.test(x); });
    }
    return false;
  }
  // A regular form of a verb the course or the dictionary knows (emociona ← emocionar),
  // though the conjugator does not have that verb.
  var REG_END = [["ar", /(o|a|as|am|amos|ei|ou|aram|ava|avam|ando|ado|ada|ados|adas|e|em|asse|assem|ará|arão|aria|ariam)$/],
                 ["er", /(o|e|es|em|emos|i|eu|eram|ia|iam|endo|ido|ida|idos|idas|a|am|esse|essem|erá|erão|eria|eriam)$/],
                 ["ir", /(o|e|es|em|imos|i|iu|iram|ia|iam|indo|ido|ida|idos|idas|a|am|isse|issem|irá|irão|iria|iriam)$/]];
  function regVerbKnown(w) {
    if (!/^[a-zà-ÿ]{5,}$/.test(w)) return false;
    return REG_END.some(function (r) {
      var m = r[1].exec(w);
      if (!m) return false;
      var stem = w.slice(0, m.index);
      if (r[0] === "ar" && /^e/.test(m[0])) stem = stem.replace(/gu$/, "g").replace(/qu$/, "c").replace(/c$/, "ç");
      var inf = stem + r[0];
      // only verbs the conjugator lacks: for the ones it has, a form it does not list is wrong (sabo, fazi)
      if (inf.length <= 4 || (U.isInfinitive && U.isInfinitive(inf)) || V(inf).length) return false;
      return !!(LEXI[inf] || DATA.lex[inf] || (D && D.knownWord && D.knownWord(inf)));
    });
  }
  // An adverb in -mente whose adjective is known (rapidamente, facilmente).
  function menteOK(w) {
    if (!/mente$/.test(w)) return false;
    var b = w.replace(/mente$/, "");
    return [b, b.replace(/a$/, "o"), b + "e"].some(function (x) { return x !== w && (known(x) || ADJ[x]); });
  }

  function words(tk) { return tk.filter(function (t) { return t.w && /[a-zà-ÿ]/.test(t.w); }); }

  var U = D ? D.util : {};
  var DATA = D ? D.DATA : { lex: {}, nouns: {}, nounsByPlural: {}, adj: {}, falsi: {} };
  function V(w) { return D && w ? D.verbForms(w) : []; }
  function PP(w) { return D && w ? D.participleOf(w) : null; }
  function GER(w) { return U.gerundOf && w ? U.gerundOf(w) : null; }
  function lemmas(w) { return V(w).map(function (v) { return v.lemma.replace(/-se$/, ""); }); }
  function hasLem(w, re) { return lemmas(w).some(function (l) { return re.test(l); }) || (PP(w) && re.test(PP(w))); }
  function isInf(w) { return !!(w && U.isInfinitive && U.isInfinitive(w)) || /^(ser|ter|ir|ver|vir|dar|ler|pôr|rir)$/.test(w || ""); }
  function finite(w) { return V(w).some(function (v) { return v.tense !== "infPessoal"; }) && !isInf(w); }
  function isVerb(w) { return !!(w && (V(w).length || PP(w) || GER(w) || isInf(w))); }

  /* Adjetivos frecuentes con sus cuatro formas (ms, fs, mp, fp). */
  var ADJ = Object.create(null);    // forma → [ms, fs, mp, fp]
  function addAdj(ms, fs, mp, fp) { var f = [ms, fs, mp, fp]; f.forEach(function (x) { if (x && !ADJ[x]) ADJ[x] = f; }); }
  ("bonito lindo alto baixo magro gordo novo velho cansado ocupado simpático antipático tímido branco preto vermelho amarelo roxo " +
   "moreno loiro louro ruivo castanho famoso caro barato pequeno rico limpo sujo cheio vazio frio bravo calmo tranquilo nervoso curioso " +
   "preguiçoso engraçado divertido chato lento rápido moderno antigo histórico típico brasileiro argentino mineiro baiano italiano " +
   "americano uruguaio chileno colorido escuro claro comprido curto longo largo estreito gostoso delicioso perigoso seguro animado " +
   "cansativo lotado aberto fechado pronto sozinho próximo último primeiro único sério honesto generoso educado casado solteiro " +
   "apaixonado preocupado atrasado molhado gelado quieto lindo feio magro maravilhoso incrível famoso sujo escondido armado usado " +
   "estranho esquisito embaraçado envergonhado orgulhoso emocionado assustado ótimo péssimo caríssimo baratíssimo lindíssimo " +
   "democrático formal? quilombola").split(" ").forEach(function (a) {
    if (/\?$/.test(a) || !/o$/.test(a)) return;
    var s = a.slice(0, -1); addAdj(a, s + "a", s + "os", s + "as");
  });
  ("alegre triste grande forte doce quente verde contente inteligente importante interessante elegante pobre livre breve leve " +
   "enorme jovem? simples? feliz? fácil? difícil? útil? azul? cultural? social? natural? especial? legal? normal? tropical? federal? " +
   "nacional? popular? regular? melhor? pior? maior? menor? gentil? agradável? possível? incrível? horrível? terrível? confortável? " +
   "responsável? amável? paulistano? carioca? paulista? indígena? cinza?").split(" ").forEach(function (a) {
    var x = a.replace(/\?$/, "");
    if (/e$/.test(x)) return addAdj(x, x, x + "s", x + "s");
    if (/^(jovem)$/.test(x)) return addAdj(x, x, "jovens", "jovens");
    if (/^(simples|cinza)$/.test(x)) return addAdj(x, x, x, x);
    if (/z$/.test(x) || /r$/.test(x)) return addAdj(x, x, x + "es", x + "es");
    if (/(fácil|difícil|útil|agradável|possível|incrível|horrível|terrível|confortável|responsável|amável)$/.test(x)) return addAdj(x, x, x.replace(/il$/, "eis").replace(/el$/, "eis"), x.replace(/il$/, "eis").replace(/el$/, "eis"));
    if (/azul$/.test(x)) return addAdj(x, x, "azuis", "azuis");
    if (/gentil$/.test(x)) return addAdj(x, x, "gentis", "gentis");
    if (/al$/.test(x)) return addAdj(x, x, x.replace(/al$/, "ais"), x.replace(/al$/, "ais"));
    if (/o$/.test(x)) { var s = x.slice(0, -1); return addAdj(x, s + "a", s + "os", s + "as"); }
    if (/a$/.test(x)) return addAdj(x, x, x + "s", x + "s");
  });
  addAdj("bom", "boa", "bons", "boas"); addAdj("mau", "má", "maus", "más");
  addAdj("português", "portuguesa", "portugueses", "portuguesas"); addAdj("francês", "francesa", "franceses", "francesas");
  addAdj("inglês", "inglesa", "ingleses", "inglesas"); addAdj("japonês", "japonesa", "japoneses", "japonesas");
  addAdj("alemão", "alemã", "alemães", "alemãs"); addAdj("espanhol", "espanhola", "espanhóis", "espanholas");
  addAdj("trabalhador", "trabalhadora", "trabalhadores", "trabalhadoras");
  function adjForms(w) {
    if (ADJ[w]) return ADJ[w];
    var lem = DATA.adj && DATA.adj[w];
    if (lem && ADJ[lem]) return ADJ[lem];
    if (lem && /o$/.test(lem)) { var s = lem.slice(0, -1); return [lem, s + "a", s + "os", s + "as"]; }
    return null;
  }
  function isAdj(w) { return !!adjForms(w); }

  /* Género y número de un sustantivo: del banco, de los heterogenéricos o,
     con cuidado, de la terminación. */
  var NOT_F = /^(dia|dias|mapa|mapas|planeta|planetas|clima|sistema|sistemas|problema|problemas|tema|temas|programa|programas|idioma|idiomas|poeta|poetas|cometa|sofá|sofás|guarda|telefonema|diploma|drama|dramas|pijama|cinema|cinemas|lema|esquema|panorama|poema|poemas|samba|sambas|fantasma|artista|artistas|colega|colegas|turista|turistas|motorista|jornalista|dentista|atleta|atletas|policial|gente)$/;
  var NOT_M = /^(tribo|tribos|foto|fotos|moto|motos|libido|mão|mãos|virgem|ordem|origem|imagem|tv)$/;
  function nounGN(w) {
    if (!w) return null;
    var s = DATA.nouns[w], p = DATA.nounsByPlural[w];
    if (s && s.s === w) return { g: s.g, n: s.s === s.pl ? null : "s" };
    if (p && p.pl === w) return { g: p.g, n: "p" };
    var h = U.HETERO || {};
    if (h[w]) return { g: h[w], n: "s" };
    if (/s$/.test(w) && h[w.replace(/s$/, "")]) return { g: h[w.replace(/s$/, "")], n: "p" };
    if (/(ções|dades|agens)$/.test(w)) return { g: "f", n: "p" };
    if (/(ção|dade|agem)$/.test(w)) return { g: "f", n: "s" };
    return null;
  }
  // A likely gender and number from the ending, for words the lexicon lacks.
  function guessGN(w) {
    if (!w || w.length < 3 || NOT_F.test(w) || NOT_M.test(w)) return nounGN(w);
    if (/as$/.test(w)) return { g: "f", n: "p" };
    if (/os$/.test(w)) return { g: "m", n: "p" };
    if (/a$/.test(w)) return { g: "f", n: "s" };
    if (/o$/.test(w)) return { g: "m", n: "s" };
    return nounGN(w);
  }
  var COMMON_G = /^([a-zà-ú]+istas?|caixa|caixas|rádio|rádios|grama|capital|personagem|personagens|lente|cura|moral|artista|artistas|colega|colegas|turista|turistas|jornalista|jornalistas|estudante|estudantes|cliente|clientes|gerente|gerentes|presidente|presidentes|atendente|atendentes|dentista|dentistas|motorista|motoristas|pianista|paciente|pacientes|agente|agentes|intérprete|intérpretes|jovem|jovens|chefe|chefes|cantor|artista|atleta|atletas|policial|policiais|representante|representantes|adolescente|adolescentes|parente|parentes|imigrante|imigrantes|habitante|habitantes|docente|docentes|militante|militantes|especialista|especialistas|guia|guias|modelo|modelos|criança|crianças|pessoa|pessoas|vítima|vítimas|cônjuge|cônjuges|fã|fãs|carioca|cariocas|paulista|paulistas|capixaba|indígena|indígenas|estrangeiro)$/;
  function isNoun(w) { return !!(w && (DATA.nouns[w] || DATA.nounsByPlural[w] || (U.HETERO && U.HETERO[w]))); }

  var NUMS = /^(um|uma|dois|duas|três|quatro|cinco|seis|sete|oito|nove|dez|onze|doze|treze|catorze|quatorze|quinze|dezesseis|dezessete|dezoito|dezenove|vinte|trinta|quarenta|cinquenta|sessenta|setenta|oitenta|noventa|cem|cento|duzentos|duzentas|trezentos|trezentas|quatrocentos|quinhentos|seiscentos|setecentos|oitocentos|novecentos|mil|milhão|milhões|meia|meio-dia|meia-noite)$/;
  var HOURW = /^(uma|duas|três|quatro|cinco|seis|sete|oito|nove|dez|onze|doze|meio-dia|meia-noite|\d{1,2}h?)$/;
  var POSS = /^(meu|minha|meus|minhas|teu|tua|teus|tuas|seu|sua|seus|suas|nosso|nossa|nossos|nossas|dele|dela|deles|delas)$/;
  var DEM = /^(este|esta|estes|estas|esse|essa|esses|essas|aquele|aquela|aqueles|aquelas|isto|isso|aquilo|neste|nesta|nesse|nessa|naquele|naquela|deste|desta|desse|dessa|daquele|daquela|disso|disto|daquilo|nisso|nisto)$/;
  var ART = /^(o|a|os|as|um|uma|uns|umas)$/;
  var CLIT = /^(me|te|se|nos|vos|lhe|lhes)$/;
  // Words that are also verb forms but almost always something else.
  var AMBIG = /^(como|para|nada|casa|sede|cara|sobre|entre|vale|cedo|logo|fora|era|tarde|conta|forma|pena|volta|vista|olha|corre|segundo|meio|canto|jogo|gosto|passo|caso|fim|sol|mal|bem|só|até|então|onde|quando|mas|mesmo|agora|ainda|também|sempre|lá|aqui|muito|pouco|tudo|todo|nosso|seu|dela|dele|que|se|o|a|e|é|em|um|uma|no|na|de|do|da|pelo|pela|obrigado|obrigada|morro|livro|rio|samba|praia|dança|festa|feira|venda|compra|troca|ajuda|pergunta|resposta|conversa|volta|chegada|saída|espera|visita|viagem|parte|frente|lado|base|fala|falta|fica|ama|ano|anos|sal|sei)$/;
  var SUBJ_PRON = { eu: 0, tu: 1, "você": 2, ele: 2, ela: 2, "nós": 3, eles: 5, elas: 5, "vocês": 5 };
  var SKIPV = /^(não|já|também|sempre|nunca|ainda|só|me|te|se|nos|lhe|lhes|o|a|os|as|muito|bem|mal|jamais|quase|até|logo)$/;
  var PREPS = /^(a|de|em|por|para|pra|com|sem|até|entre|sobre|contra|desde|após|sob|perante|ao|à|do|da|no|na|pelo|pela)$/;
  var SAY = /^(disse|disseram|dizia|contou|contaram|explicou|explicaram|perguntou|perguntaram|pediu|pediram|respondeu|responderam|afirmou|afirmaram|comentou|garantiu|prometeu|avisou|lembrou|contava|explicava|perguntei|pedi|respondi|disse-me|contou-me)$/;
  var CONN = ["porém", "contudo", "entretanto", "no entanto", "todavia", "aliás", "inclusive", "portanto", "por isso", "pois", "já que",
              "uma vez que", "visto que", "ou seja", "além disso", "então", "mas", "logo", "assim", "por outro lado", "de um lado",
              "embora", "enquanto", "por exemplo", "em primeiro lugar", "afinal", "ainda assim", "mesmo assim", "dessa forma", "isto é"];
  var MODAL = ["é possível que", "tudo indica que", "ao que parece", "ainda que", "mesmo que", "por mais que", "em primeiro lugar",
               "em segundo lugar", "além disso", "por outro lado", "em suma", "diante do exposto", "dessa forma", "talvez", "provavelmente",
               "possivelmente", "convém", "parece que", "é provável que", "sem dúvida", "de fato", "em síntese", "por fim", "em resumo"];
  var DICENDI = ["afirma", "defende", "sustenta", "ressalta", "alega", "argumenta", "observa", "destaca", "segundo", "de acordo com",
                 "conforme", "ou seja", "isto é", "em outras palavras", "afirmou", "defendeu", "ressaltou", "sublinha", "aponta", "considera"];
  var FORMAL = ["prezado", "prezada", "prezados", "prezadas", "atenciosamente", "cordialmente", "venho por meio desta", "solicito",
                "solicitar", "gostaria de", "segue em anexo", "seguem em anexo", "fico no aguardo", "desde já agradeço", "vossa senhoria",
                "o senhor", "a senhora", "agradeceria", "respeitosamente", "venho solicitar"];
  var EXPR = /\b(pis\w+ na bola|d\w+ (um )?jeito|f\w+ questão|lev\w+ a sério|lev\w+ (tudo )?na brincadeira|tom\w+ uma decisão|ench\w+ o saco|fic\w+ de boa|d\w+ (tudo )?certo|quem não tem cão caça com gato|de grão em grão|mat\w+ a saudade|bat\w+ (um )?papo|caiu a ficha|cai a ficha|chov\w+ no molhado|custa os olhos da cara|dar uma volta|dei uma volta|fazer falta|faz falta|tirar de letra|tirou de letra|pagar o pato|pagou o pato|dar bola|deu bola|fic\w+ na mão|pôr a mão na massa|meter o bedelho|puxar o saco|segurar vela|chutar o balde|chutou o balde|enfiar o pé na jaca|abrir o jogo|abriu o jogo|ficar a ver navios|arregaçar as mangas|levar em conta|tomar providências)\b/g;
  var VARIANT = /^(autocarro|autocarros|comboio|comboios|telemóvel|telemóveis|pequeno-almoço|bica|bicas|casa-de-banho|frigorífico|ecrã|sumo|sumos|fixe|miúdo|miúdos|miúda|rapariga|raparigas|talho|montra|passadeira|paragem|portagem|apelido|propinas|machimbombo|machimbombos|chapa|kota|bué|candongueiro|matabicho|puto|putos)$/;
  var COLLOQ = /^(tá|tô|tava|tavam|tamo|tamos|pra|pro|pros|pras|né|cadê|cê|ocê|vamo|tipo|beleza|valeu|mó|ó|aí|bora|galera|cara|parada|tranquilo|firmeza)$/;
  // The register table is Diagnosi's: the same forms and the same note in the three checkers.
  var REG = D && D.REGISTRO ? D.REGISTRO : null;
  var REGSTD = Object.create(null);
  if (REG) Object.keys(REG.forms).forEach(function (k) { REGSTD[k] = REG.forms[k][0]; });
  function REGNOTE(said, std) {
    return REG ? REG.note(said, std) : "*" + said + "* es del habla" + (std ? "; en un texto formal: *" + std + "*" : "") + ".";
  }
  var CONJ_SUBJ = ["para que", "embora", "caso", "antes que", "sem que", "até que", "a fim de que", "desde que", "contanto que", "mesmo que",
                   "ainda que", "a não ser que", "por mais que", "a menos que", "logo que"];
  var IRR_DERIV = /^(manter|conter|obter|deter|reter|entreter|abster|intervir|convir|provir|propor|compor|supor|dispor|impor|repor|expor|opor|prever|rever|caber|valer|perder|medir|passear|odiar|ansiar|mediar|remediar|incendiar|requerer|prover|reaver|construir|destruir)$/;
  var IRR_PRES = /^(ir|vir|ser|estar|ter|fazer|dizer|trazer|poder|querer|saber|ver|dar|pôr|ler|sair|pedir|dormir|ouvir|perder|haver|caber|valer|crer|rir|medir|subir|preferir|sentir|seguir|vestir|servir|repetir)$/;

  /* ------------------------------------------------ estructuras (features) */

  function features(text) {
    var tk = toks(text), ws = words(tk);
    var f = {};
    var add = function (k, n) { f[k] = (f[k] || 0) + (n == null ? 1 : n); };
    var norm = " " + String(text || "").normalize("NFC").toLowerCase().replace(/[’‘`´]/g, "'").replace(/[.,;:!?«»"“”()—–]/g, " ").replace(/\s+/g, " ") + " ";
    var W = function (k) { return tk[k] && tk[k].w || ""; };
    var prevW = function (i) { for (var k = i - 1; k >= 0; k--) if (tk[k].w) return tk[k].w; return ""; };
    var nextVerb = function (i, max) {
      for (var k = i + 1; k < tk.length && k <= i + (max || 4); k++) {
        if (!tk[k].w) return -1;
        if (SUBJ_PRON[tk[k].w] != null || SKIPV.test(tk[k].w) || tk[k].w === "gente" || (tk[k].w === "a" && W(k + 1) === "gente")) continue;
        return k;
      }
      return -1;
    };
    tk.forEach(function (t, i) {
      if (t.p) { if (t.p === "?") add("perguntas"); return; }
      var w = t.w, n = W(i + 1), n2 = W(i + 2), p = prevW(i), fv = V(w);
      var sp = U.splitEnclitic ? U.splitEnclitic(w) : null;
      var core = sp ? sp.v : w, cv = sp ? V(core) : fv;
      var tense = function (x) { return cv.some(function (v) { return v.tense === x; }); };
      if (/^(sou|és|é|somos|são|era|eras|éramos|eram|fui|foi|fomos|foram)$/.test(w)) add("ser");
      if (/^(estou|estás|está|estamos|estão|estava|estavam|estive|esteve|estivemos|estiveram)$/.test(w)) add("estar");
      if (/^(tenho|tens|tem|temos|têm|tinha|tinham|tive|teve)$/.test(w)) add("ter");
      if (/^(há|tem|têm|havia|tinha)$/.test(w) && !(PP(n) && /^(tem|têm|tinha|havia)$/.test(w))) add("haTem");
      var npl = DATA.nounsByPlural[w] && DATA.nounsByPlural[w].s !== w;
      if (npl || (/s$/.test(w) && w.length > 3 && !finite(w) && !isAdj(w) && !POSS.test(w) && !DEM.test(w) && !ART.test(w) && !NUMS.test(w) &&
          (/^(os|as|uns|umas|dois|duas|três|quatro|cinco|seis|sete|oito|nove|dez|muitos|muitas|poucos|poucas|vários|várias|meus|minhas|seus|suas|nossos|nossas|dos|das|nos|nas|aos|às|pelos|pelas|alguns|algumas|estes|estas|esses|essas|aqueles|aquelas|todos|todas)$/.test(p) || NUMS.test(p) || /^\d+$/.test(p)))) add("plurais");
      var ci = U.CONTR && U.CONTR[w];
      if (ci && !(w === "nos" && (isVerb(n) || CLIT.test(n))) && !(w === "no" && false) && !(/^(daqui|dali|daí|aonde|donde)$/.test(w))) add("contracoes");
      if ((ci || (U.PREP_BASE && U.PREP_BASE[w])) && !(w === "nos" && isVerb(n)) && !(w === "a" && (isVerb(n) || ART.test(p) === false && !n))) add("preposicoes");
      if (isAdj(w) && !POSS.test(w) && !/^(melhor|pior|maior|menor|próximo|último|primeiro|único)$/.test(w) && !(finite(w) && !/^(é|são)$/.test(p) && CLIT.test(p))) add("adjetivos");
      if (tense("presente") && !/^(sou|és|é|somos|são|estou|está|estamos|estão|tenho|tem|temos|têm|há)$/.test(w) && !isInf(w)) add("presente");
      if (cv.some(function (v) { return v.tense === "presente" && IRR_PRES.test(v.lemma.replace(/-se$/, "")) && !/^(ser|estar|ter|haver)$/.test(v.lemma); })) add("irregulares");
      if ((w === "às" && HOURW.test(n)) || (w === "à" && n === "uma") || /^(meio-dia|meia-noite)$/.test(w) || (/^(as|das|até|entre)$/.test(w) && HOURW.test(n) && /^(horas|e|da|de)$/.test(n2))) add("horas");
      if (NUMS.test(w) && !/^(um|uma|meia|meio-dia|meia-noite)$/.test(w)) add("numeros");
      if (/^(vou|vais|vai|vamos|vão|ia|iam|íamos)$/.test(w) && isInf(n)) add("irInf");
      if (POSS.test(w)) add("possessivos");
      if (DEM.test(w)) add("demonstrativos");
      if (tense("perfeito") && !/^(foi|foram|fui|fomos)$/.test(w) || (/^(fui|foi|fomos|foram)$/.test(w) && !PP(n))) add("perfeito");
      if ((CLIT.test(w) && finite(n) && /^(me|te|se|nos)$/.test(w)) || (sp && /^(me|te|se|nos)$/.test(sp.c) && cv.length)) add("reflexivos");
      if (t.clause || /^(e|ou|mas)$/.test(p)) {
        var imp = cv.some(function (v) { return v.tense === "subjPresente" && v.p === 2; }) && !/^(que|talvez|tomara|embora|caso)$/.test(p) ||
          (w === "não" && V(n).some(function (v) { return v.tense === "subjPresente" && v.p === 2; }));
        if (imp) add("imperativo");
      }
      if (hasLem(w, /^gostar$/) && /^(de|do|da|dos|das|disso|disto|deste|desta|dele|dela)$/.test(n) || (hasLem(w, /^gostar$/) && /^(muito|mais|bastante|tanto)$/.test(n) && /^(de|do|da|dos|das)$/.test(n2))) add("gostar");
      if (tense("imperfeito") && !/^(era|eram|tinha|tinham|havia|estava|estavam)$/.test(w) || /^(era|eram|tinha|tinham|estava|estavam)$/.test(w) && !PP(n)) add("imperfeito");
      if ((/^(o|a|os|as)$/.test(w) && finite(n) && !isNoun(n) && !ART.test(p) && !(tk[i + 1] && tk[i + 1].cap)) || /^(lhe|lhes)$/.test(w) ||
          (sp && /^(o|a|os|as|lhe|lhes)$/.test(sp.c))) add("pronomes");
      var nounSlot = /^(o|a|os|as|um|uma|no|na|do|da|ao|pelo|pela|neste|nesse|este|esse|todo|cada|seu|meu|nosso|próximo|último)$/.test(p);
      if (tense("futuro") && !isInf(w) && !nounSlot) add("futuro");
      if (tense("condicional")) add("condicional");
      if (/^(mais|menos)$/.test(w)) {
        for (var k = i + 1; k <= i + 4 && k < tk.length && tk[k].w; k++) if (/^(que|do|da|dos|das)$/.test(tk[k].w) && (tk[k].w === "que" || W(k + 1) === "que")) { add("comparativos"); break; }
        if (/^(o|a|os|as)$/.test(p) && (isAdj(n) || known(n))) add("comparativos");
      }
      if (w === "tão" && /\b(quanto|como)\b/.test(tk.slice(i + 1, i + 5).map(function (x) { return x.w || ""; }).join(" "))) add("comparativos");
      if (/^(melhor|melhores|pior|piores|maior|maiores|menor|menores)$/.test(w) || /íssim[oa]s?$/.test(w)) add("comparativos");
      if (/^(nada|ninguém|nenhum|nenhuma|nunca|nem|jamais)$/.test(w)) add("negacoes");
      if (/^(tenho|tens|tem|temos|têm)$/.test(w) && PP(n) && !/^(que|de)$/.test(n)) add("perfeitoComposto");
      if (/^(tinha|tinhas|tínhamos|tinham|havia|haviam)$/.test(w) && (PP(n) || (/^(já|não|nunca|sempre)$/.test(n) && PP(n2)))) add("maisQuePerfeitoComposto");
      if (/^(é|são|foi|foram|era|eram|será|serão|seja|sejam|fosse|fossem|sido|ser)$/.test(w)) {
        var pk = /^(já|também|muito|sempre)$/.test(n) ? i + 2 : i + 1;
        if (PP(W(pk)) && !/^(nascido|nascida|morto|morta)$/.test(W(pk))) add("passiva");
      }
      if (/^que$/.test(w) || /^(talvez|tomara)$/.test(w)) {
        var vk = nextVerb(i, 5);
        if (vk > 0 && V(W(vk)).some(function (v) { return v.tense === "subjPresente"; }) && !V(W(vk)).some(function (v) { return v.tense === "presente"; })) add("subjuntivo");
      }
      if (/^(quando|se|assim|logo|enquanto|sempre|depois|conforme|como|onde|quem|caso)$/.test(w) && !(w === "se" && (isVerb(n) || CLIT.test(n)) && !SUBJ_PRON.hasOwnProperty(n))) {
        var start = /^(assim|logo|sempre|depois)$/.test(w) && n === "que" ? i + 1 : i;
        var fk = nextVerb(start, 4);
        var fw = W(fk);
        if (fk > 0 && V(fw).some(function (v) { return v.tense === "subjFuturo"; }) && (/(r|res|rmos|rem)$/.test(fw))) add("futSubj");
      }
      if (tense("subjImperfeito")) add("subjImperfeito");
      var infp = V(w).filter(function (v) { return v.tense === "infPessoal" && (v.p === 1 || v.p === 3 || v.p === 5); });
      if (infp.length && !V(w).some(function (v) { return v.tense !== "infPessoal" && v.tense !== "subjFuturo"; })) {
        var trigF = false;
        for (var q = i - 1; q >= Math.max(0, i - 3); q--) if (tk[q].w && /^(quando|se|assim|logo|enquanto|sempre|depois|conforme|caso)$/.test(tk[q].w)) trigF = true;
        if (!trigF) add("infPessoal");
      }
      if (/^(para|sem|de|até|ao|por)$/.test(w) && /^(eu|ele|ela|você|a)$/.test(n) && isInf(n === "a" && W(i + 2) === "gente" ? W(i + 3) : n2)) add("infPessoal");
      if (/^(tivesse|tivéssemos|tivessem|teria|teríamos|teriam|tiver|tivermos|tiverem|tenha|tenham|terei|terá|houvesse)$/.test(w) && PP(n)) add("hipotesePassado");
      if (SAY.test(w)) {
        for (var s2 = i + 1; s2 <= i + 3 && s2 < tk.length && tk[s2].w; s2++) if (/^(que|se|para|como|onde|quando|quem|o)$/.test(tk[s2].w)) { add("indireto"); break; }
      }
      if (sp && sp.c === "se" && cv.some(function (v) { return v.p === 2 || v.p === 5; })) add("se");
      if (w === "se" && /^(não|aqui|lá)$/.test(p) && V(n).some(function (v) { return v.p === 2 || v.p === 5; })) add("se");
      if (sp || (w.split("-").length === 3 && /^(ei|á|ás|emos|ão|ia|iam|íamos)$/.test(w.split("-")[2]))) add("encliticos");
      if (/^(à|às|àquele|àquela|àqueles|àquelas|àquilo)$/.test(w)) add("crase");
      if (cv.some(function (v) { return IRR_DERIV.test(v.lemma) && v.tense !== "infPessoal"; }) && !isInf(w)) add("irregDerivados");
      if (COLLOQ.test(w) || (w === "a" && n === "gente")) add("coloquial");
      if (/(ção|ções|mento|mentos|dade|dades|ência|ências|ância|âncias|ização)$/.test(w) && w.length > 6 && !finite(w)) add("nominalizacoes");
      if (tense("maisQuePerfeito") && !/^(fora|foram|tomara|quisera|pudera)$/.test(w) && !cv.some(function (v) { return v.tense !== "maisQuePerfeito"; })) add("maisQuePerfeito");
      if (/[aei]ndo$/.test(w) && w.length > 5 && (GER(w) || isInf(w.replace(/ndo$/, "r"))) && !/^(quando|mundo|segundo|fundo|redondo|lindo|vindo)$/.test(w)) add("gerundio");
      if ((t.start || t.clause) && PP(w) && (ART.test(n) || POSS.test(n) || DEM.test(n))) add("partAbs");
      if (w === "ao" && isInf(n)) add("aoInf");
      if (suffixed(w)) add("sufixos");
      if ((U.FALSOS && U.FALSOS[w] && U.FALSOS[w][0]) || (DATA.falsi && DATA.falsi[w]) || /^(copo|copos|escritório|escritórios|gorjeta|namorado|namorada)$/.test(w)) add("falsos");
      if (VARIANT.test(w)) add("variantes");
      if (w === "há" && !PP(n)) add("culto");
      if (sp || (w.split("-").length === 3)) add("culto");
      if (w === "nós" && (finite(n) || CLIT.test(n) || n === "," )) add("culto");
      if (/^(contudo|todavia|entretanto|outrossim|porquanto|destarte)$/.test(w)) add("culto");
      if (w === "cujo" || w === "cuja" || w === "cujos" || w === "cujas") add("relativos");
      if (w === "onde" && p && !t.start && !t.clause && tk[i - 1] && tk[i - 1].w && !/^(de|para|por|aonde)$/.test(p) && !(tk.slice(i).some(function (x) { return x.p === "?"; }) && tk.slice(i).filter(function (x) { return x.p; })[0] && tk.slice(i).filter(function (x) { return x.p; })[0].p === "?")) add("relativos");
      if (w === "quem" && PREPS.test(p)) add("relativos");
      var p2w = W(i - 2);
      var relPrep = /^(de|em|com|por|para|sobre|a)$/.test(p) && tk[i - 1] && tk[i - 1].w && p2w && !isVerb(p2w) && !ART.test(p2w) && !/^(que|mais|menos|antes|depois|até|desde|para|sem|a|fim|tão)$/.test(p2w) && !(p === "para" || p === "a");
      if (w === "que" && (isNoun(p) || relPrep || (p === "o" && !tk[i - 1].start && tk[i - 1].w && !/^(é|foi|era)$/.test(p2w)))) add("relativos");
      else if (w === "que" && tk[i - 1] && tk[i - 1].w && /[a-zà-ÿ]{3,}/.test(p) && !isVerb(p) && !ART.test(p) && !PREPS.test(p) && !/^(o|é|do|da|mais|menos|tão|já|ainda|porque|embora|antes|sem|até|para|desde|logo|assim|acho|disse|pensa|espero|quero|tomara|talvez|claro|bom|bem|pena|melhor|pior|possível|importante|provável|verdade|certeza|pouco)$/.test(p) && (known(p) || isAdj(p)) && !/mente$/.test(p) && !/^(isso|isto|aquilo|tudo|nada|algo|coisa|tanto|tal)$/.test(p) && p2w !== "tão" && p2w !== "tanto") add("relativos");
      if (/^(o|a|os|as)$/.test(w) && /^(qual|quais)$/.test(n)) add("relativos");
    });
    // multi-word counts on the text
    var count = function (list) {
      var used = {};
      list.forEach(function (c) { if (norm.indexOf(" " + c + " ") >= 0) used[c] = 1; });
      return Object.keys(used).length;
    };
    var countAll = function (list) {
      var n = 0;
      list.forEach(function (c) { var at = 0, s = " " + c + " "; while ((at = norm.indexOf(s, at)) >= 0) { n++; at += s.length - 1; } });
      return n;
    };
    f.conectores = count(CONN);
    f.modalizadores = count(MODAL);
    f.dicendi = count(DICENDI);
    f.formal = count(FORMAL);
    f.conjuncoes = countAll(CONJ_SUBJ.filter(function (c) { return c !== "logo que"; }));
    f.expressoes = (norm.match(EXPR) || []).length;
    f.regencia = regenciaCount(tk);
    f.words = ws.length;
    return f;
  }

  function regenciaCount(tk) {
    var R = U.REGENCIA || {}, n = 0;
    tk.forEach(function (t, i) {
      if (!t.w) return;
      var ls = lemmas(t.w).concat(PP(t.w) ? [PP(t.w).replace(/-se$/, "")] : []).concat(isInf(t.w) ? [t.w] : []);
      var nx = tk[i + 1] && tk[i + 1].w || "", nx2 = tk[i + 2] && tk[i + 2].w || "";
      if (/^(muito|mais|sempre|também|bastante|tanto)$/.test(nx)) { nx = nx2; }
      var pi = U.prepInfo ? U.prepInfo(nx) : null;
      if (!pi) return;
      if (ls.some(function (l) { return R[l] && R[l][0] && R[l][0] === pi.base && !/^(ir|chegar|voltar|começar|aprender|ensinar|ajudar|continuar|deixar|acabar|parar|tratar|morar|entrar)$/.test(l); })) n++;
    });
    return n;
  }

  // A word with a derivational suffix whose base is known.
  var SUFF_BASES = "café pão quente casa gol jornal sorvete bonachão livro carro cachorro gato bolo copo mesa rua praia pouco cedo agora " +
    "obrigado amigo filho neto beijo abraço jeito tempo sol flor papel mulher homem lugar peixe chá fruta pedra barco sapato cabeça " +
    "bola mão porta janela doce bom baixo lento devagar calmo quieto rápido feio pobre velho novo caro barato forte grande livro loja";
  var SUFF_BASE = Object.create(null);
  SUFF_BASES.split(" ").forEach(function (b) { SUFF_BASE[b] = 1; });
  var SUFF = /^(.{2,}?)(zinhos|zinhas|zinho|zinha|inhos|inhas|inho|inha|zão|zona|ão|ões|ona|onas|aço|aços|ada|eiro|eira|eiros|eiras|ista|istas|udo|uda)$/;
  var NOT_SUFF = /^(cozinha|vizinho|vizinha|vizinhos|caminho|carinho|sozinho|sozinha|marinho|padrinho|madrinha|linha|farinha|galinha|rainha|ninho|vinho|espinho|sobrinho|sobrinha|moinho|ainda|tinha|vinha|mão|são|não|irmão|pão|chão|avião|ação|nação|feijão|limão|coração|verão|cão|então|razão|estação|canção|visão|opinião|televisão|questão|lição|bastão|mamão|sabão|violão|botão|balcão|capitão|alemão|cidadão|cristão|leão|melão|questão|região|religião|salão|sertão|pessoa|madeira|cadeira|bandeira|carteira|primeiro|primeira|feira|brasileiro|brasileira|terceiro|dinheiro|janeiro|fevereiro|banheiro|companheiro|engenheiro|estrangeiro|verdadeiro|inteiro|inteira|cozinheiro|pedreiro|parceiro|carneiro|cheiro|mineiro|mineira|solteiro|solteira|chuveiro|travesseiro|bombeiro|parada|chegada|estrada|entrada|saída|morada|jornada|piada|salada|calçada|camada|fachada|tomada|pomada|madrugada|garagem|artista|motorista|turista|jornalista|dentista|lista|revista|pista|vista|conquista|entrevista)$/;
  function suffixed(w) {
    if (!w || NOT_SUFF.test(w) || V(w).length || PP(w)) return false;
    var m = SUFF.exec(w);
    if (!m) return false;
    var st = m[1], suf = m[2];
    if (/^zinh|^zão|^zona/.test(suf)) return true;
    var cands = [st, st + "o", st + "a", st + "e", st.replace(/qu$/, "c") + "o", st.replace(/gu$/, "g") + "o", st.replace(/c$/, "ç") + "o", st + "ão", st.replace(/r$/, "rão")];
    return cands.some(function (c) { return SUFF_BASE[c] || (DATA.lex[c] && !V(c).length) || (lexiN > lexiBase + 500 && LEXI[c] && !V(c).length && c.length > 2); });
  }

  /* ------------------------------------------------------------ errores */

  // Palabras frecuentes del castellano rioplatense que no están en las tablas del diagnóstico.
  var ES_EXTRA = Object.create(null);
  ("pibe:rapaz piba:moça laburo:trabalho laburar:trabalhar boludo:bobo che:ei re:muito posta:verdade quilombo:bagunça " +
   "chabón:cara mina:mina bondi:ônibus birra:cerveja joda:festa chamuyo:papo pileta:piscina medialunas:croissants facturas:doces " +
   "alfajor:alfajor mate:chimarrão asado:churrasco buenísimo:ótimo lindísimo:lindíssimo muchísimo:muitíssimo").split(" ").forEach(function (x) {
    var p = x.split(":"); if (p[0] !== p[1]) ES_EXTRA[p[0]] = p[1];
  });
  // Préstamos que el portugués usa tal cual o que son nombres de cosas del Río de la Plata.
  var LOANS = "empanada empanadas alfajor alfajores mate asado dulce leche chimichurri tango tangos milonga fernet malbec gaucho gauchos " +
              "choripán medialuna provoleta quincho yerba pampa pampas futevôlei pix wi-fi funk rap rock jazz show shows kit online";
  learn([LOANS]);
  var LOAN = Object.create(null); LOANS.split(" ").forEach(function (w) { LOAN[w] = 1; });

  /* The words and verb forms the checker knows, by their spelling without
     accents: an unknown «voce», «sería», «propoem» finds «você», «seria»,
     «propõem». */
  var DEACC = null, deaccN = -1;
  function deaccIndex() {
    if (DEACC && deaccN === lexiN) return DEACC;
    DEACC = Object.create(null); deaccN = lexiN;
    var add = function (w) { if (!w || w.indexOf(" ") >= 0) return; var k = U.deaccent(w); if (k === w) return; (DEACC[k] = DEACC[k] || []).indexOf(w) < 0 && DEACC[k].push(w); };
    Object.keys(LEXI).forEach(add);
    Object.keys(DATA.lex || {}).forEach(add);
    if (Conj && Conj.list) Conj.list().forEach(function (v) {
      (Conj.SIMPLE_TENSES || []).forEach(function (t) {
        var fs; try { fs = Conj.conjugate(v, t); } catch (e) { return; }
        (fs || []).forEach(function (f) { add(String(f).split(" ").pop()); });
      });
      try { add(Conj.participle(v)); add(Conj.gerund(v)); } catch (e) { /* */ }
    });
    return DEACC;
  }

  // An unknown word that is the regular form of an irregular verb (fazi → fiz).
  // Verbs too short or too rare to guess from, and regular forms that are real words.
  var REG_SKIP = /^(ser|estar|ter|haver|ir|ver|vir|dar|ler|crer|rir|pôr|reaver|prover|rever|reler|prever|deter|reter|conter|manter|obter|abster|abster-se|entreter|convir|provir|intervir|doer|construir|destruir|proibir|reunir|reunir-se|sorrir|cair|sair|requerer|despedir-se|opor|dispor|compor)$/;
  var REG_STOP = /^(cabo|cabos|medo|meda|perda|perdas|vala|valas|vale|pedo|poda|podas|saba|sabas|reta|reto|manta|tema|dita|pona|ponas|repona|poneu|medas)$/;
  var REGMAP = null;
  function regMap() {
    if (REGMAP) return REGMAP;
    REGMAP = Object.create(null);
    if (!Conj || !Conj.list) return REGMAP;
    Conj.list().forEach(function (v) {
      var info = null;
      try { info = Conj.info(v); } catch (e) { return; }
      if (!info || REG_SKIP.test(v)) return;
      ["presente", "perfeito", "futuro", "condicional", "subjPresente", "imperfeito"].forEach(function (t) {
        var real, reg;
        try { real = Conj.conjugate(v, t); reg = Conj.regular(v, t); } catch (e) { return; }
        (reg || []).forEach(function (r, p) {
          var rr = String(r).split(" ").pop(), re = String(real[p] || "").split(" ").pop();
          if (rr && re && rr.length >= 4 && rr !== re && !V(rr).length && !REGMAP[rr] && !REG_STOP.test(rr)) REGMAP[rr] = [re, v, t];
        });
      });
      try {
        var rp = Conj.regular(v, "participio"), pp = Conj.participle(v);
        if (rp && pp && rp !== pp && !PP(rp) && !REGMAP[rp]) {
          REGMAP[rp] = [pp, v, "participio"];
          [["a", "a"], ["os", "os"], ["as", "as"]].forEach(function (x) { REGMAP[rp.replace(/o$/, x[0])] = [pp.replace(/o$/, x[1]), v, "participio"]; });
        }
      } catch (e) { /* */ }
    });
    return REGMAP;
  }

  // Spanish spellings turned Portuguese, for an unknown word.
  var ES_TR = [[/ñ/g, "nh", 1], [/ll/g, "lh", 1], [/ción$/, "ção", 1], [/ciones$/, "ções", 1], [/cion$/, "ção", 1], [/sión$/, "são", 1],
               [/siones$/, "sões", 1], [/zón$/, "ção", 1], [/ón$/, "ão", 1], [/ones$/, "ões", 1], [/idad$/, "idade", 1], [/dad$/, "dade", 1],
               [/tad$/, "dade", 1], [/dades$/, "dades", 1], [/bles$/, "veis", 1], [/ble$/, "vel", 1], [/aje$/, "agem", 1], [/ajes$/, "agens", 1],
               [/miento$/, "mento", 1], [/mientos$/, "mentos", 1], [/aba$/, "ava", 1], [/abas$/, "avas", 1], [/aban$/, "avam", 1],
               [/ábamos$/, "ávamos", 1], [/ue/g, "o", 1], [/ie/g, "e", 1], [/^h/, "", 1], [/j/g, "lh", 1], [/y/g, "i", 1],
               [/n$/, "m", 0], [/ns$/, "ns", 0], [/an$/, "am", 0], [/([aeiou])s([aeiou])/g, "$1ss$2", 0],
               [/([aeiou])r([aeiou])/g, "$1rr$2", 0], [/c([ao])/g, "ç$1", 0], [/z/g, "ç", 0], [/z/g, "s", 0],
               [/qu(?=[ao])/g, "c", 0], [/ci/g, "ç", 0], [/b/g, "v", 0], [/v/g, "b", 0], [/n(?=[pb])/g, "m", 0], [/ls$/, "is", 0],
               [/aré$/, "arei", 1], [/eré$/, "erei", 1], [/iré$/, "irei", 1], [/imos$/, "emos", 1], [/é$/, "ei", 1], [/ó$/, "ou", 1],
               [/aron$/, "aram", 1], [/ieron$/, "eram", 1], [/^jug/, "jog", 1], [/aj/g, "aix", 1], [/^gust/, "gost", 1], [/cito$/, "zinho", 1],
               [/cita$/, "zinha", 1], [/citos$/, "zinhos", 1], [/ito$/, "inho", 1], [/ita$/, "inha", 1], [/itos$/, "inhos", 1],
               [/itas$/, "inhas", 1], [/azo$/, "aço", 1], [/ero$/, "eiro", 1], [/era$/, "eira", 1], [/eros$/, "eiros", 1],
               [/anz/g, "ãoz", 0], [/iz$/, "is", 1], [/ísim/, "íssim", 1], [/^conoc/, "conhec", 1], [/ersona/, "essoa", 1],
               [/ue(?=[^i])/g, "o", 1], [/ie/g, "e", 1], [/ía$/, "ia", 0]];
  function esTransform(w) {
    var tried = {};
    var one = function (x, k) { var r = ES_TR[k], y = x.replace(r[0], r[1]); return y !== x ? y : null; };
    for (var a = 0; a < ES_TR.length; a++) {
      var c1 = one(w, a);
      if (!c1) continue;
      if (known(c1) || (suffixed(c1) && c1 !== w) || (/íssim/.test(c1) && known(c1.replace(/íssim(o|a|os|as)$/, "o")))) return { pt: c1, es: !!ES_TR[a][2] };
      tried[c1] = a;
    }
    for (var x in tried) for (var b = 0; b < ES_TR.length; b++) {
      if (b === tried[x]) continue;
      var c2 = one(x, b);
      if (c2 && known(c2)) return { pt: c2, es: !!(ES_TR[tried[x]][2] || ES_TR[b][2]) };
    }
    return null;
  }
  // A Portuguese plural made the Spanish way (animals, papels, homems, pãos).
  function pluralFix(w) {
    var s, cands = [];
    if (/ls$/.test(w)) { s = w.slice(0, -1); cands.push(s.replace(/al$/, "ais").replace(/el$/, "éis").replace(/ol$/, "óis").replace(/ul$/, "uis").replace(/il$/, "is")); }
    if (/les$/.test(w)) { s = w.slice(0, -2); cands.push(s.replace(/al$/, "ais").replace(/el$/, "éis").replace(/ol$/, "óis").replace(/ul$/, "uis")); }
    if (/ms$/.test(w)) cands.push(w.replace(/ms$/, "ns"));
    if (/mes$/.test(w)) cands.push(w.replace(/mes$/, "ns"));
    if (/(ãos|ães|ões|ãoes|aos)$/.test(w)) {
      var st = w.replace(/(ãos|ães|ões|ãoes|aos)$/, "");
      [st + "ões", st + "ães", st + "ãos"].forEach(function (c) { if (c !== w && (LEXI[c] || DATA.nounsByPlural[c]) && !V(c).length) cands.push(c); });
      if (!cands.length && (LEXI[st + "ão"] || DATA.nouns[st + "ão"]) && !/ões$/.test(w)) cands.push(st + "ões");
    }
    if (/[rz]s$/.test(w)) cands.push(w.slice(0, -1) + "es");
    if (/ones$/.test(w)) cands.push(w.replace(/ones$/, "ões"));
    for (var i = 0; i < cands.length; i++) if (cands[i] !== w && (LEXI[cands[i]] || DATA.nounsByPlural[cands[i]]) && !V(cands[i]).length) return cands[i];
    // Portuguese never ends in -ls, -ms or -rs: the plural is surely wrong.
    if (/[aeiouéó](l|m|r|z)s$/.test(w) && cands.length) return cands[0];
    if (/(ãos|ães|ões|aos)$/.test(w) && cands.length && !LEXI[w]) return cands[0];
    return null;
  }

  var MOTION = /^(ir|chegar|voltar|levar|vir|dirigir|subir|descer|regressar)$/;
  var PLACES_F = /^(praia|feira|festa|escola|faculdade|universidade|igreja|padaria|farmácia|academia|lagoa|lapa|urca|tijuca|glória|biblioteca|livraria|loja|rua|estação|cidade|zona|serra|ilha|barra|rodoviária|pousada|cachoeira|missa|aula|reunião|piscina|quadra|favela|floresta|montanha|baía|europa|argentina|bahia|itália|frança|espanha|alemanha|inglaterra|amazônia|áfrica|ásia|américa|colômbia|venezuela|bolívia|china|índia)$/;
  var DO_VERB = /^(ver|conhecer|amar|ajudar|convidar|visitar|esperar|chamar|encontrar|abraçar|beijar|cumprimentar|buscar|procurar|escutar|ouvir|olhar|entender|acompanhar|admirar|respeitar|odiar|adorar|receber|levar)$/;
  var PERSON_N = /^(pai|mãe|pais|irmão|irmã|irmãos|irmãs|filho|filha|filhos|filhas|avô|avó|avós|tio|tia|tios|primo|prima|primos|amigo|amiga|amigos|amigas|namorado|namorada|marido|esposa|mulher|homem|menino|menina|meninos|crianças|professor|professora|professores|chefe|colega|colegas|vizinho|vizinha|vizinhos|médico|médica|senhor|senhora)$/;
  var TIME_DONE = /^(ontem|anteontem|passado|passada|atrás)$/;
  var SUBJ_TRIG = /^(espero|esperamos|espera|esperam|esperava|quero|queremos|quer|querem|queria|queríamos|queriam|tomara|talvez|importante|necessário|necessária|preciso|possível|impossível|provável|improvável|melhor|pena|duvido|duvida|peço|pede|pedem|pediu|pediram|pedi|prefiro|prefere|recomendo|recomenda|recomendam|recomendou|sugiro|sugere|sugeriu|aconselho|aconselha|desejo|deseja|lamento|bom|ótimo|estranho|fundamental|essencial|mandou|manda|exige|exigiu|proíbe|permite|deixa)$/;

  /* Words cited, not used: inside a short quote (up to six words: «pisar la
     pelota», “hacer una vaca”) or right after a word that names them («la
     parola *slogan*», «a palavra *propina*»).  The text talks about them, so
     they are not the learner's mistakes. */
  function citedOut(src, tk, out, NAMES) {
    var spans = [], re = /“([^”\n]*)”|«([^»\n]*)»|"([^"\n]*)"/g, m;
    while ((m = re.exec(src))) {
      var inner = m[1] != null ? m[1] : m[2] != null ? m[2] : m[3];
      if (inner.split(/\s+/).filter(Boolean).length <= 6) spans.push([m.index, m.index + m[0].length]);
    }
    return out.filter(function (f) {
      var t = tk[f.i];
      if (!t || t.at == null) return true;
      var inQ = function (x) {
        if (!x || x.at == null) return false;
        // an affix cited with its hyphen: «-ção», «re-», «des-»
        var b0 = src.charAt(x.at - 1), b1 = src.charAt(x.at - 2), a0 = src.charAt(x.at + x.len), a1 = src.charAt(x.at + x.len + 1);
        if ((b0 === "-" && !/[a-zà-ÿ]/i.test(b1)) || (a0 === "-" && !/[a-zà-ÿ]/i.test(a1))) return true;
        return spans.some(function (s) { return x.at >= s[0] && x.at < s[1]; });
      };
      for (var j = f.i; j < f.i + (f.n || 1); j++) if (inQ(tk[j])) return false;
      for (var k = f.i - 1; k >= 0 && k >= f.i - 1; k--) if (tk[k].w && NAMES.test(tk[k].w)) return false;
      // «palavra terminada em ção»: the ending is named, not used
      var w1 = f.i >= 1 && tk[f.i - 1] && tk[f.i - 1].w, w2 = f.i >= 2 && tk[f.i - 2] && tk[f.i - 2].w;
      if (w1 === "em" && /^(terminad|acabad)/.test(w2 || "")) return false;
      return true;
    });
  }

  /* lint(text, week, opts): opts.registro ("formal" | "informal") manda
     sobre el de la tarea (TASKS[week].reg); sin nada, el registro es libre y
     las formas del habla (pra, tô, cê, vi ele…) no se marcan, igual que en
     las respuestas cerradas (Diagnosi.REGISTRO).  En un texto formal son
     «casi» (level "close", cat "registro") con la forma escrita. */
  function formalOf(week, opts) {
    if (opts && opts.registro) return /^(formal|culto)$/i.test(opts.registro);
    return !!(TASKS[week] && TASKS[week].reg === "formal");
  }
  function lint(text, week, opts) {
    week = week || 52;
    var formal = formalOf(week, opts);
    var tk = toks(text), out = [];
    var srcT = String(text || "").normalize("NFC").replace(/[’‘`´]/g, "'");
    // x: { good, why, level } cuando la regla los sabe; si no, finding() los deduce del mensaje
    var push = function (i, n, cat, msg, soft, x) {
      var over = out.filter(function (f) { return i < f.i + f.n && f.i < i + (n || 1); });
      if (over.length && (soft || over.some(function (f) { return !f.soft; }))) return;
      if (over.length) out = out.filter(function (f) { return over.indexOf(f) < 0; });
      var f = { i: i, n: n || 1, cat: cat, msg: msg, soft: !!soft };
      if (x) Object.keys(x).forEach(function (k) { f[k] = x[k]; });
      out.push(f);
    };
    var it = function (s) { return "*" + s + "*"; };
    var wi = function (k, dir) { for (var x = k + dir; x >= 0 && x < tk.length; x += dir) { if (tk[x].w) return x; if (tk[x].p && /[.!?]/.test(tk[x].p)) return -1; } return -1; };
    var W = function (k) { return k >= 0 && tk[k] && tk[k].w || ""; };
    var lexKeys = null;
    var sentEnd = function (i) { for (var q = i; q < tk.length; q++) if (tk[q].p && /[.!?]/.test(tk[q].p)) return tk[q].p; return ""; };
    var sentence = function (i) {
      var a = i, b = i;
      while (a > 0 && !(tk[a - 1].p && /[.!?]/.test(tk[a - 1].p))) a--;
      while (b < tk.length - 1 && !(tk[b + 1].p && /[.!?]/.test(tk[b + 1].p))) b++;
      return tk.slice(a, b + 1).filter(function (x) { return x.w; }).map(function (x) { return x.w; });
    };

    // After a conjunction: skip the subject (pronoun, noun phrase, adverbs) up
    // to the first word that can be a verb; return its index and the
    // subject's person when it shows.
    var subjectAndVerb = function (st) {
      var k = wi(st, 1), pers = null, n0 = 0;
      while (k >= 0 && n0 < 6) {
        var x = W(k);
        if (SUBJ_PRON[x] != null) { pers = SUBJ_PRON[x]; }
        else if (x === "gente" && W(wi(k, -1)) === "a") pers = 2;
        else if (/^(não|me|te|se|nos|lhe|lhes|o|a|os|as|já|ainda|também|sempre|nunca|só|tudo|isso|isto|ninguém|alguém|todos|todas|todo|toda|muito|muitos|muitas|um|uma|uns|umas|meu|minha|meus|minhas|seu|sua|seus|suas|nosso|nossa|nossos|nossas|este|esta|esse|essa|estes|estas|esses|essas|aquele|aquela|o|a|de|do|da|dos|das)$/.test(x) && !(/^(o|a|os|as)$/.test(x) && finite(W(wi(k, 1))) && !isNoun(W(wi(k, 1))) && !guessGN(W(wi(k, 1))))) {
          if (/^(ninguém|alguém|tudo|isso|isto|todo|toda)$/.test(x)) pers = 2;
          if (/^(todos|todas)$/.test(x)) pers = 5;
        }
        else if (PREPS.test(x) && !/^(a|o|do|da)$/.test(x)) return { k: -1, p: pers };
        else if (!V(x).length && !isInf(x) && !PP(x) && !(/(ou|eu|iu|aram|eram|iram|avam|iam)$/.test(x) && !tk[k].cap && !isNoun(x))) { var g0 = nounGN(x) || guessGN(x); if (g0 && g0.n) pers = g0.n === "p" ? 5 : 2; else if (tk[k].cap) pers = 2; }
        else if (V(x).length && (/^(o|a|os|as|um|uma|uns|umas|meu|minha|seu|sua|nosso|nossa|este|esta|esse|essa|do|da|dos|das)$/.test(W(wi(k, -1))) && wi(k, -1) > st || (isNoun(x) || DATA.lex[x] && !finite(x) && !isInf(x)) && n0 < 3 && V(W(wi(k, 1))).length)) { var g1 = nounGN(x) || guessGN(x); if (g1 && g1.n) pers = g1.n === "p" ? 5 : 2; }
        else break;
        k = wi(k, 1); n0++;
      }
      return { k: n0 < 6 ? k : -1, p: pers };
    };
    tk.forEach(function (t, i) {
      if (!t.w) return;
      var w = t.w, ni = wi(i, 1), n = W(ni), n2 = W(wi(ni, 1)), pi = wi(i, -1), p = W(pi), p2 = W(wi(pi, -1));
      var nxt = ni >= 0 ? tk[ni] : null;
      var proper = t.cap && (!t.start || (nxt && nxt.cap && ni === i + 1));
      var sp = U.splitEnclitic ? U.splitEnclitic(w) : null;

      /* 1. Español metido */
      // words that are Portuguese too, in their Portuguese use: uma van, firmar parcerias, ó (the interjection)
      var ptToo = (/^(van|vans)$/.test(w) && /^(um|uma|a|as|de|da|na|e|ou|numa|das|duas)$/.test(p)) ||
        (/^firm(ar|ou|aram|a|am|e|ou)$/.test(w) && /^(parceria|parcerias|acordo|acordos|compromisso|compromissos|posição|pé|um|uma|o|a)$/.test(n)) || w === "ó" ||
        (/^(solo|solos)$/.test(w) && /^(o|os|do|dos|no|nos|ao|aos|um|pelo|de|em|este|esse|bom|fértil)$/.test(p));   // o solo: la tierra
      var esW = !proper && !LOAN[w] && !LEXI[w] && !ptToo && (ES_EXTRA[w] || (U.spanishWord && U.spanishWord(w)));
      if (esW && !(w === "como" || w === "a" || w === "o") && !(t.cap && t.start && /^(la|el)$/.test(w) && nxt && nxt.cap)) {
        var tr = String(esW).split(" / ")[0];
        if (/^(muy|mucho|mucha|muchos|muchas)$/.test(U.deaccent(w))) return push(i, 1, "muito", it(t.o) + " es español: «muy» y «mucho» son " + it(/^(muy|mucho)$/.test(U.deaccent(w)) ? "muito" : w.replace(/^much/, "muit")) + ".");
        if (/^gust/.test(U.deaccent(w))) return push(i, 1, "gostar", it(t.o) + " es español: en portugués " + it("gostar de") + ", con la persona como sujeto (eu gosto de…).");
        if (/^(el|la|los|las)$/.test(w) && /^(de|en|a)$/.test(p)) return push(pi, 2, "contraccion", it(p + " " + w) + " es español: " + it({ "de el": "do", "de la": "da", "de los": "dos", "de las": "das", "en el": "no", "en la": "na", "en los": "nos", "en las": "nas", "a el": "ao", "a la": "à", "a los": "aos", "a las": "às" }[p + " " + w] || "no / do / ao") + ".");
        if (/^(del|al)$/.test(w)) return push(i, 1, "contraccion", it(t.o) + " es español: " + it(w === "del" ? "do (da, dos, das)" : "ao (à, aos, às)") + ".");
        if (/^(le|les|lo)$/.test(w)) return push(i, 1, "pronome", it(t.o) + " es español: " + it(w === "lo" ? "o" : w === "le" ? "lhe" : "lhes") + ".");
        if (/^(he|ha|han|hemos|has)$/.test(w) && PP(n)) return push(i, 2, "perfeito_composto", it(t.o + " " + n) + " es español: «he comido» se dice con el perfeito simple, " + it(conjForm(PP(n), "perfeito", { he: 0, has: 2, ha: 2, hemos: 3, han: 5 }[w]) || "comi") + ".");
        return push(i, 1, "espanol", it(t.o) + " es español; en portugués: " + it(tr) + ".", false, { good: tr });
      }
      if (/^(y)$/.test(w)) return push(i, 1, "espanol", it("y") + " es español: la conjunción es " + it("e") + ".");

      if (/^(he|ha|han|hemos|has|habia|había|habían)$/.test(w) && PP(n)) {
        var pp0 = PP(n), pers0 = { he: 0, has: 2, ha: 2, hemos: 3, han: 5, habia: 0, "había": 0, "habían": 5 }[w];
        var sf0 = /^hab/.test(w) ? "tinha " + n : conjForm(pp0, "perfeito", pers0);
        return push(i, 2, "perfeito_composto", it(t.o + " " + n) + " es un calco del español: " + (/^hab/.test(w) ? "«había…» es " : "«he…» se dice con el perfeito simple, ") + it(sf0 || "comi") + ".");
      }

      /* 2. Palabra que no existe: tilde, nasal, cedilla, grafía española, tipeo */
      if (!proper && /^[a-zà-ÿ-]+$/.test(w) && /ñ|ll/.test(w) && !known(w)) {
        var trl = esTransform(w);
        return push(i, 1, "espanol", it(t.o) + " está escrita a la española" + (trl ? ": " + it(trl.pt) : ": ñ es *nh* y ll es *lh*") + ".");
      }
      if (!proper && !t.cap && /^[a-zà-ÿ]+$/.test(w) && /[áéíóú]zinh/.test(w)) return push(i, 1, "tilde", "Con *-zinho* la base pierde la tilde escrita: " + it(U.deaccent(w.replace(/zinh.*/, "")) + w.replace(/^.*?(zinh)/, "$1")) + ".");
      // the frequency list knows the word (fera, emociona) and no accented word of the course is written like it (nao ≠ não)
      var freqOK = function () { return D && D.knownWord && D.knownWord(w) && !(deaccIndex()[U.deaccent(w)] || []).some(function (x) { return x !== w; }); };
      if (!proper && !t.cap && !ptToo && /^[a-zà-ÿ-]+$/.test(w) && w.length > 1 && !known(w) && !LOAN[w] && !freqOK() && !menteOK(w) && !(suffixed(w) && !/(ito|ita|itos|itas|azo|ero)$/.test(w)) && !(/[aei]ndo$/.test(w) && isInf(w.replace(/ndo$/, "r")))) {
        var rm = /^(um|uma|a|o|as|os|essa|esta|que|numa|dessa)$/.test(p) ? null : regMap()[w];   // ficou uma fera: the noun
        if (rm) return push(i, 1, rm[2] === "participio" ? "participio" : "regularizacion", it(rm[1]) + " es irregular: " + it(rm[0]) + ", no " + it(t.o) + ".");
        if (/^(seje|sejem|esteje|estejem)$/.test(w)) return push(i, 1, "verbo_irregular", "El subjuntivo es " + it(w.replace(/je/, "ja")) + ".");
        if (!lexKeys) lexKeys = Object.keys(LEXI).concat(Object.keys(DATA.lex));
        var da = U.deaccent(w), cands0 = (deaccIndex()[da] || []).filter(function (x) { return x !== w; });
        if (!cands0.length && LEXI[da] && da !== w && /([áéíóú]|ía|ías|ían|ió)$/.test(w)) cands0 = [da];
        if (!cands0.length && V(da).length && da !== w && /([áéíóú]|ía|ías|ían|ió)$/.test(w)) cands0 = [da];
        if (!cands0.length && LEXI[da] && da !== w && !/([áéíóú]|ía|ías|ían|ió)$/.test(w)) cands0 = [];
        if (!cands0.length && /(êem|éia|éias|ôo|ôos|ü|óia|óias|éico|éica)/.test(w) && (V(da).length || LEXI[da] || DATA.lex[da])) return push(i, 1, "ortografia", "Desde el Acuerdo de 1990 se escribe " + it(da) + " (sin tilde ni diéresis).");
        var best = cands0[0] || null;
        if (best) {
          if (/[ãõ]/.test(best) && !/[ãõ]/.test(w)) return push(i, 1, "nasal", "Falta la til de la vocal nasal: " + it(best) + ".");
          if (/ç/.test(best) && !/ç/.test(w)) return push(i, 1, "ortografia", "Falta la cedilla: " + it(best) + ".");
          if (/(éia|éias|ôo|ôos|ü|êem|óia|óias|éico|éica|éi)/.test(w)) return push(i, 1, "ortografia", "Desde el Acuerdo de 1990: " + it(best) + ".");
          return push(i, 1, "tilde", (/[áéíóúâêôà]/.test(best) ? "Revisá la tilde" : "Sin tilde") + ": " + it(cands0.slice(0, 2).join(" o ")) + ".");
        }
        var pf = pluralFix(w);
        if (pf) return push(i, 1, "plural", "El plural es " + it(pf) + ".");
        var trx = esTransform(w);
        if (trx) {
          var nasalT = (/m$/.test(trx.pt) && /n$/.test(w)) || (/mp|mb/.test(trx.pt) && /np|nb/.test(w)) || (/ão/.test(trx.pt) && !/ão/.test(w));
          var cedT = /ç/.test(trx.pt) && !/ç/.test(w) && trx.pt.replace(/ç/g, "c") === w;
          return push(i, 1, trx.es ? "espanol" : nasalT ? "nasal" : "ortografia",
            trx.es ? it(t.o) + " está escrita a la española: " + it(trx.pt) + "." : cedT ? "Falta la cedilla: " + it(trx.pt) + "." : "Se escribe " + it(trx.pt) + ".",
            !trx.es && !nasalT && !cedT && lexiN < 5000);
        }
        if (/[^aeiouíú]é$/.test(w) && w.length > 3) return push(i, 1, "espanol", it(t.o) + " es la forma del español: en portugués el perfeito termina en *-ei* (" + it(w.replace(/é$/, "ei")) + ").");
        var dimSt = w.replace(/c?it(o|a|os|as)$/, ""), dimBase = [dimSt + "o", dimSt + "a", dimSt + "e", dimSt, dimSt + "é"].filter(function (x) { return known(x) || (deaccIndex()[x] || []).length; })[0];
        if (/(ito|ita|itos|itas)$/.test(w) && w.length > 5 && dimBase && !/(eit|uit|ait|oit)(o|a|os|as)$/.test(w)) return push(i, 1, "espanol", "El diminutivo *-ito* es del español: en portugués *-inho* / *-zinho* (" + it(w.replace(/c?it(o|a|os|as)$/, function (m0, x) { return (/^c/.test(m0) ? "z" : "") + "inh" + x; })) + ").");
        if (U.looksSpanish && U.looksSpanish(w)) return push(i, 1, "espanol", it(t.o) + " parece español: revisá cómo se dice en portugués.", lexiN < 5000);
        if (/[^aeiouãõn]s$/.test(w) && known(w.slice(0, -1))) return push(i, 1, "plural", "Revisá el plural de " + it(w.slice(0, -1)) + ".");
        var bd = 9, near = null, lim = w.length > 6 ? 2 : 1;
        // the guess is shown only while the lexicon is small (course data not loaded yet): skip the search otherwise
        for (var k2 = 0; lexiN < 5000 && k2 < lexKeys.length; k2++) {
          var c = lexKeys[k2];
          if (Math.abs(c.length - w.length) > lim || c.indexOf(" ") >= 0) continue;
          var d = U.editDistance(c, w);
          if (d < bd) { bd = d; near = c; }
        }
        if (near && bd <= lim && lexiN < 5000) push(i, 1, "tipeo", "¿Quisiste decir " + it(near) + "?", true);
        else if (lexiN < 5000) push(i, 1, "lexico", "No conozco " + it(t.o) + ": revisá cómo se escribe.", true);
      }

      if (t.start && t.cap && !(nxt && nxt.cap) && /^[a-zà-ÿ]+$/.test(w) && w.length > 2 && !known(w) && !LOAN[w]) {
        var cS = (deaccIndex()[U.deaccent(w)] || []).filter(function (x) { return x !== w; })[0];
        if (cS && known(cS) && !V(cS).length && !(nxt && tk[i + 1] && tk[i + 1].p === ",")) {   // not a name before a comma (Vera, …)
          var cSo = cS.charAt(0).toUpperCase() + cS.slice(1);
          return push(i, 1, /[ãõ]/.test(cS) && !/[ãõ]/.test(w) ? "nasal" : "tilde", (/[ãõ]/.test(cS) && !/[ãõ]/.test(w) ? "Falta la til de la vocal nasal: " : "Revisá la tilde: ") + it(cSo) + ".", false, { good: cSo });
        }
      }

      /* 2b. Artículos y pronombres del español sueltos; «no» por «não» */
      if (!proper && /^(el|la|los|las|lo)$/.test(w) && !(t.cap && nxt && nxt.cap)) {
        if (/^(de|en|a|em)$/.test(p) && pi === i - 1) return push(pi, 2, "contraccion", it(p + " " + w) + " es español: " + it({ "de el": "do", "de la": "da", "de los": "dos", "de las": "das", "en el": "no", "en la": "na", "en los": "nos", "en las": "nas", "a el": "ao", "a la": "à", "a los": "aos", "a las": "às", "em el": "no", "em la": "na" }[p + " " + w] || "no / do / ao") + ".");
        if (w === "lo" && n === "que") return push(i, 2, "espanol", "«Lo que» es " + it("o que") + ".");
        if (isInf(p) && pi === i - 1) return push(pi, 2, "pronome", "Después de un infinitivo, el pronombre se pega: " + it(p.replace(/ar$/, "á").replace(/er$/, "ê").replace(/ir$/, "i").replace(/or$/, "ô") + "-l" + { lo: "o", la: "a", los: "os", las: "as", el: "o" }[w]) + ".");
        if (finite(n) || CLIT.test(n)) return push(i, 1, "pronome", it(t.o) + " es el pronombre del español: " + it({ lo: "o", la: "a", los: "os", las: "as", el: "ele" }[w]) + " (eu o vi) o, en el habla, " + it({ lo: "ele", la: "ela", los: "eles", las: "elas", el: "ele" }[w]) + " después del verbo.");
        return push(i, 1, "espanol", it(t.o) + " es el artículo del español: " + it({ el: "o", la: "a", los: "os", las: "as", lo: "o" }[w]) + ".");
      }
      if (/^(una|un|unos|unas)$/.test(w) && ni === i + 1 && !finite(n) && !(w === "una" && /^(que|se|ele|ela)$/.test(p)) && (guessGN(n) || isNoun(n) || isAdj(n) || known(n)))
        return push(i, 1, "espanol", it(t.o) + " es el artículo del español: " + it({ una: "uma", un: "um", unos: "uns", unas: "umas" }[w]) + ".");
      if (hasLem(w, /^meter$/) && n === "a" && n2 === "pata") return push(i, 3, "espanol", "«Meter la pata» es " + it("pisar na bola") + " o " + it("dar um fora") + ".");
      if (/^(cujo|cuja|cujos|cujas)$/.test(w) && ART.test(n) && ni === i + 1) push(ni, 1, "articulo", "Después de " + it(w) + " no va artículo: " + it(w + " " + n2) + ".");
      if (w === "que" && t.start && tk[ni] && SUBJ_PRON[n] != null) {
        for (var q8 = i + 1; q8 < tk.length; q8++) if (tk[q8].p && /[.!?]/.test(tk[q8].p)) { if (tk[q8].p === "?") push(i, 1, "faltante", "Para preguntar «¿qué…?» va " + it("O que") + " (o que você está fazendo?)."); break; }
      }
      if (/^(me|te|se|nos)$/.test(w) && hasLem(n, /^acordar$/) && /^(cedo|tarde|às|todo|todos|de|com)$/.test(n2)) push(i, 1, "pronome", "*Acordar* (despertarse) va sin pronombre: " + it(n + " " + n2) + " (*me acordo de* sería «me acuerdo de»).");
      if (w === "no" && ni === i + 1 && (CLIT.test(n) || (finite(n) && !isNoun(n) && !AMBIG.test(n) && !LEXI[n] && !DATA.lex[n] && !guessGN(n)) || /^(sé|sei|es|é|tengo|tenho|tem|quiero|quero|puedo|posso|hay|há|está|estoy|estou|vou|gosto|entendo|falo|preciso|sabe|conheço|quer|pode)$/.test(n)))
        return push(i, 1, "espanol", "La negación es " + it("não") + " (*no* es *em + o*: no Rio).");
      if (w === "sino" && n === "que") return push(i, 2, "espanol", "«Sino que» es " + it("mas") + " o " + it("e sim") + " (*sino* en portugués es la campana).");
      if (w === "particular" && p === "outro" && p2 === "sem") return push(wi(pi, -1), 3, "espanol", "«Sin otro particular» es un calco: " + it("Desde já agradeço") + " o " + it("Fico no aguardo") + ".");
      if (w === "atentamente" && (t.start || t.clause) && (!nxt || tk[i + 1] && tk[i + 1].p === "," || (nxt && nxt.cap))) return push(i, 1, "espanol", "Para cerrar una carta formal: " + it("Atenciosamente") + " (" + it("atentamente") + " es «con atención»).");
      if (w === "acordo" && p === "de" && /^(a|ao|à)$/.test(n)) return push(ni, 1, "regencia", "Se dice " + it("de acordo com") + ".");

      /* 3. Contracciones sin hacer: em o → no, de ele → dele, a a → à */
      if (/^(em|de|a|por|en)$/.test(w) && ni === i + 1 && !tk[ni].cap) {
        var pw = w === "en" ? "em" : w;
        var cf = U.contract ? U.contract(pw, n) : null;
        var quoted = /["“”«»'()]/.test(srcT.slice(t.at + t.len, tk[ni].at));
        var infAhead = [n2, W(wi(wi(ni, 1), 1)), W(wi(wi(wi(ni, 1), 1), 1))].some(function (x) { return isInf(x) || V(x).some(function (v) { return v.tense === "infPessoal" && /(rem|rmos|res)$/.test(x); }); });
        if (cf && !quoted && !(/^(ele|ela|eles|elas|este|esta|esse|essa|aquele|aquela|o|a|os|as)$/.test(n) && infAhead && /^(de|em)$/.test(pw)) && !(pw === "a" && /^(o|os)$/.test(n) && isVerb(n2)) && !(pw === "a" && n === "a" && isVerb(n2)) &&
            !(pw === "em" && /^(um|uma|uns|umas)$/.test(n)) && !(pw === "de" && /^(um|uma|uns|umas)$/.test(n)) && !(pw === "de" && /^(o|a|os|as)$/.test(n) && isInf(n2))) {
          if (cf.charAt(0) === "à") return push(i, 2, "crase", it(w + " " + n) + " se funden con acento grave: " + it(cf) + " (crase).", false, { good: cf });
          return push(i, 2, "contraccion", it(w + " " + n) + " se contrae: " + it(cf) + (w === "en" ? " (y *en* es español)" : "") + ".", false, { good: cf });
        }
      }
      // em / de / a + país con artículo: em Brasil → no Brasil
      if (/^(em|de|para)$/.test(w) && nxt && nxt.cap && U.PLACE_ART && U.PLACE_ART[n] && !/^(recife|porto)$/.test(n) && !/^(nome|chamada|chamado|apelido|título|cidade|palavra|expressão)$/.test(p) && !(n === "rio" && W(wi(ni, 1)) === "de" && false)) {
        if (!(n === "rio" && /^(grande|negro|branco|madeira|são)$/.test(n2))) {
          var ga = U.PLACE_ART[n] === "f" ? "a" : "o";
          var cf2 = w === "para" ? "para " + ga : U.contract(w, ga);
          return push(i, 1, "contraccion", it(nxt.o) + " lleva artículo: " + it(cf2 + " " + nxt.o) + ".");
        }
      }

      /* 4. Artículo o contracción + sustantivo de otro género */
      var artW = ART.test(w) ? w : (U.CONTR && U.CONTR[w] && ART.test(U.CONTR[w][1]) ? U.CONTR[w][1] : null);
      if (artW && ni === i + 1 && !tk[ni].cap && !(/^(o|a|os|as)$/.test(w) && (finite(n) || isInf(n))) && !COMMON_G.test(n)) {
        var gn = nounGN(n);
        // «a pé», «vou a Copacabana»: the preposition, not the article
        if (gn && w === "a" && gn.g === "m" && (!(t.clause || (U.HETERO && U.HETERO[n])) || /^(pé|cavalo|lápis|gás|vapor|prazo|respeito|partir|seguir|caráter|tempo|dia|fim|serviço|caminho|favor|bordo|nível|ponto|título|cargo|longo|rigor)$/.test(n))) gn = null;
        var A = U.ARTICLES && U.ARTICLES[artW];
        if (gn && A && gn.g !== A[0] && !isAdj(n) && !V(n).length) {
          var want = { m: { o: "o", a: "o", os: "os", as: "os", um: "um", uma: "um", uns: "uns", umas: "uns" }, f: { o: "a", a: "a", os: "as", as: "as", um: "uma", uma: "uma", uns: "umas", umas: "umas" } }[gn.g][artW];
          var shown = w === artW ? want : U.contract(U.CONTR[w][0], want);
          var hes = U.HETERO_ES && (U.HETERO_ES[n] || U.HETERO_ES[n.replace(/s$/, "")]);
          push(i, 2, "genero", it(n) + " es " + (gn.g === "m" ? "masculino" : "femenino") + ": " + it(shown + " " + n) + (hes ? " (en español, " + hes + ")." : "."));
        }
      }

      // dois / duas, um / uma con el género del sustantivo (duas poltronas, dois cafés)
      if (/^(dois|duas)$/.test(w) && ni === i + 1 && !tk[ni].cap) {
        var gnD = nounGN(n);
        if (gnD && gnD.n === "p" && !COMMON_G.test(n) && (gnD.g === "f") !== (w === "duas")) push(i, 1, "genero", it(n) + " es " + (gnD.g === "f" ? "femenino" : "masculino") + ": " + it((gnD.g === "f" ? "duas " : "dois ") + n) + ".");
      }

      /* 5. muito */
      if (/^(muito|muita|muitos|muitas|pouco|pouca|poucos|poucas)$/.test(w) && ni === i + 1) {
        var base = w.replace(/(o|a|os|as)$/, "");
        var gnM = /^(todos|todas|tudo|os|as|o|a|mais|menos|bem|mal|pouco|tempo|das|dos|da|do|de|nas|nos|na|no|pelas|pelos|pela|pelo|às|aos|à|ao|com|em|para)$/.test(n) || PP(n) || /(ad|id)[oa]s?$/.test(n) ? null : nounGN(n) || (!isAdj(n) && !V(n).length ? guessGN(n) : null);
        if (isAdj(n) && !isNoun(n) && w !== base + "o" && !nounGN(n) && !(/^(muitos|muitas|poucos|poucas)$/.test(w) && (/s$/.test(n))) ) push(i, 1, "muito", "Delante de un adjetivo es invariable: " + it(base + "o " + n) + ".");
        else if (gnM && gnM.n && base + { ms: "o", fs: "a", mp: "os", fp: "as" }[gnM.g + gnM.n] !== w && !isAdj(n) && !COMMON_G.test(n) &&
                 !(w === "muito" && (/^(continua|continuam|fica|ficam|está|estão|é|são|parece|parecem|estava|estavam|era|eram|ser|estar|ficar)$/.test(p))))
          push(i, 1, "muito", "Delante de un sustantivo concuerda: " + it(base + { ms: "o", fs: "a", mp: "os", fp: "as" }[gnM.g + gnM.n] + " " + n) + ".");
      }
      if (/^(mais|más)$/.test(w) && /^(grande|grandes|bom|boa|bons|boas|mau|má|ruim)$/.test(n) && ni === i + 1) {
        var cmp = { grande: "maior", grandes: "maiores", bom: "melhor", boa: "melhor", bons: "melhores", boas: "melhores", mau: "pior", "má": "pior", ruim: "pior" }[n];
        push(i, 2, "regularizacion", "Comparativo irregular: " + it(cmp) + " (no " + it(w + " " + n) + ").");
      }

      /* 6. gostar sin de; me gusta / me gosta */
      var relBefore = [wi(i, -1), wi(wi(i, -1), -1), wi(wi(wi(i, -1), -1), -1)].some(function (k) { return k >= 0 && /^(que|quem|qual)$/.test(W(k)); });
      if ((hasLem(w, /^gostar$/) || /^(gostaria|gostaríamos|gostariam)$/.test(w)) && !relBefore) {
        var gk = ni;
        while (gk >= 0 && /^(muito|mais|bastante|tanto|também|demais|pouco|sempre|nada|menos|muy|mucho|tanto|bem)$/.test(W(gk))) gk = wi(gk, 1);
        var gw = W(gk);
        var objLike = gw && (ART.test(gw) || POSS.test(gw) || DEM.test(gw) || isInf(gw) || isNoun(gw) || (tk[gk] && tk[gk].cap && !tk[gk].start) || /^(ele|ela|eles|elas|você|vocês|isso|isto|tudo|nada|mim|ti)$/.test(gw) || (!V(gw).length && !PREPS.test(gw) && !isAdj(gw) && !/^(desde|quando|porque|muito|demais|bastante|nada|também|não|já|ainda|agora|hoje|ontem|sempre|nunca|mais|menos|bem|mal|então|assim|aqui|lá|daqui|dali|tanto|pouco)$/.test(gw) && known(gw)));
        if (gk >= 0 && objLike && !/^(de|do|da|dos|das|disso|disto|daquilo|deste|desta|desse|dessa|daquele|daquela|dele|dela|deles|delas|dum|duma|que|quando|se|e|mas|porque|ou)$/.test(gw) && !(tk[gk - 1] && tk[gk - 1].p && gk - 1 > i) && !/^(me|te|se|nos|lhe)$/.test(gw))
          push(i, 1, "gostar", it("Gostar") + " lleva siempre " + it("de") + ": " + it(w + " " + (ART.test(gw) && /^(o|a|os|as)$/.test(gw) ? { o: "do", a: "da", os: "dos", as: "das" }[gw] : "de " + gw)) + ".");
        if (/^(me|te|lhe|nos)$/.test(p) && /^(gosta|gostam)$/.test(w)) push(pi, 2, "gostar", it(p + " " + w) + " es un calco de «me gusta»: " + it("eu gosto de…") + " (la persona es el sujeto).");
      }

      /* 7. «a» personal */
      if (/^(a|ao|aos)$/.test(w) && pi >= 0 && (lemmas(p).some(function (l) { return DO_VERB.test(l); }) || DO_VERB.test(PP(p) || "")) && ni >= 0) {
        var isP = (w !== "a" && (tk[ni].cap || PERSON_N.test(n) || POSS.test(n))) || (w === "a" && /^(um|uma)$/.test(n) && !lemmas(p).some(function (l) { return /^(ajudar|levar)$/.test(l); })) || (w === "a" && (/^(meu|meus|teu|seu|seus|nosso|nossos|minhas|suas|nossas|ele|eles|ela|elas|você|vocês|todos|ninguém|alguém|o|os)$/.test(n)));
        if (isP && !/^(casa|pé)$/.test(n) && !isInf(n)) push(i, 1, "a_personal", "Sin «a»: la persona que recibe la acción (el objeto directo) va sin preposición (" + it(p + (w === "ao" ? " o" : w === "aos" ? " os" : "") + " " + tk[ni].o + (POSS.test(n) && W(wi(ni, 1)) ? " " + W(wi(ni, 1)) : "")) + ").");
      }

      /* 8. perfeito composto con un pasado cerrado; «he comido» */
      if (/^(tenho|tens|tem|temos|têm)$/.test(w) && PP(n) && !/^(que|de)$/.test(n)) {
        var sw = sentence(i);
        var closed = sw.some(function (x, k) { return (TIME_DONE.test(x) && !(/^passad[oa]$/.test(x) && !/^(semana|mês|ano|sábado|domingo|fim|verão|inverno|século|dia|vez|noite)$/.test(sw[k - 1] || ""))) || /^(1[89]\d\d|20\d\d)$/.test(x) || (x === "há" && /^(\d+|um|uma|dois|duas|três|muito|pouco|alguns|algumas|anos|meses)$/.test(sw[k + 1] || "")); }) ||
          /(^| )(esta manhã|hoje de manhã|uma vez)( |$)/.test(sw.join(" ")) || [p, p2, n2].indexOf("hoje") >= 0;
        if (closed) {
          var pf2 = conjForm(PP(n), "perfeito", { tenho: 0, tens: 1, tem: 2, temos: 3, "têm": 5 }[w]);
          push(i, 2, "perfeito_composto", it(w + " " + n) + " es «vengo " + "…»: para algo terminado va el perfeito simple" + (pf2 ? ", " + it(pf2) : "") + ".");
        }
      }

      /* 9. futuro do subjuntivo: se eu ter, quando eu chego (…vou) */
      var condSe = w === "se" && (t.clause || /^(e|mas|ou|que|porque|mesmo|só|nem|como|pois)$/.test(p)) && !(pi >= 0 && PREPS.test(p));
      if (condSe && ni === i + 1 && finite(n) && !SUBJ_PRON.hasOwnProperty(n)) {
        // «se veste e sai»: reflexive, unless a main clause follows after a comma
        var commaAfter = false;
        for (var qc = ni + 1; qc < tk.length && !(tk[qc].p && /[.!?]/.test(tk[qc].p)); qc++) if (tk[qc].p === ",") { commaAfter = true; break; }
        if (!commaAfter) condSe = false;
      }
      var qInterr = w === "quando" && (t.clause || p === "e") && sentEnd(i) === "?";
      if ((/^(quando|assim|logo|enquanto|sempre|depois|caso)$/.test(w) || condSe) && !qInterr && week >= 17 &&
          !(w === "se" && pi >= 0 && lemmas(p).some(function (l) { return /^(saber|perguntar|ver|descobrir|imaginar|entender)$/.test(l); }))) {
        var st = /^(assim|logo|sempre|depois)$/.test(w) ? (n === "que" ? ni : -1) : i;
        if (st >= 0) {
          var subj9 = subjectAndVerb(st), vk = subj9.k, subjP = subj9.p;
          var vw = W(vk), rd = V(vw);
          var sw2 = sentence(i).join(" ");
          var futureMain = /(^| )(vou|vamos)( |$)/.test(sw2) || /(^| )(vai|vão) [a-zà-ú]+(ar|er|ir|or)( |$)/.test(sw2) || /\b(amanhã|(semana|mês|ano|domingo|sábado|verão|inverno) que vem|(próximo|próxima|próximos|próximas) (semana|mês|ano|anos|verão|inverno|domingo|sábado|segunda|vez|dia|dias|feriado|fim))\b/.test(sw2) ||
            sentence(i).some(function (x) { return V(x).some(function (v) { return v.tense === "futuro"; }); });
          if (vk >= 0 && vw && !tk[vk].cap && !/^(nada|tudo|como|algo|nenhum|ninguém)$/.test(vw)) {
            var pers = subjP != null ? subjP : 2;
            var fs = conjForm(firstLemma(vw), "subjFuturo", pers);
            if (isInf(vw) && fs && fs !== vw && !rd.some(function (v) { return v.tense === "subjFuturo"; }) && week >= 27) push(vk, 1, "futuro_subj", "Con *" + (w === "se" ? "se" : w) + "* y el futuro va el futuro do subjuntivo: " + it(fs) + " (no el infinitivo).");
            else if (rd.length && rd.every(function (v) { return v.tense === "subjPresente"; }) && w !== "caso" && w !== "se" && fs && week >= 27) push(vk, 1, "futuro_subj", "Para el futuro, el portugués usa el futuro do subjuntivo: " + it(fs) + " (el «cuando llegue» del español).");
            else if (w !== "caso" && futureMain && rd.some(function (v) { return v.tense === "presente" && v.p === pers; }) && !rd.some(function (v) { return v.tense === "subjFuturo"; }) && fs && fs !== vw && week >= 27)
              push(vk, 1, "futuro_subj", "Hablando del futuro, después de " + it(w === "assim" || w === "logo" ? w + " que" : w) + " va el futuro do subjuntivo: " + it(fs) + ".",
                w === "se" && !/^(eu|você|vocês|nós|a gente|tu)$/.test(W(vk - 1)));   // «se o ator fala…» can state a fact: a hint; «se eu consigo…» is a plan
            else if (w === "se" && rd.some(function (v) { return v.tense === "condicional"; }) && week >= 18 && (t.clause || /^(e|mas|ou|que|porque|mesmo|só|nem|como|pois)$/.test(p))) {
              var si = conjForm(firstLemma(vw), "subjImperfeito", rd.filter(function (v) { return v.tense === "condicional"; })[0].p);
              push(vk, 1, "subjuntivo", "Después de *se* no va condicional: " + it(si || "se eu tivesse…") + " (el condicional va en la otra parte).");
            }
          }
        }
      }

      /* 10. subjuntivo después de espero que, é importante que, embora… */
      var trig10 = w === "que" && tk[i - 1] && tk[i - 1].w && (SUBJ_TRIG.test(p) || (/^(para|antes|sem|até|mesmo|ainda|desde|contanto|fim)$/.test(p) && !(p === "ainda" && pi >= 1 && (finite(p2) || isVerb(p2)))) || (p === "mais" && p2 === "por")) && n !== "ponto";
      if (w === "que" && p === "e" && !trig10) {
        // «É importante que você descanse e que beba…»: the same trigger
        for (var q10 = i - 2; q10 >= 0 && !(tk[q10].p && /[.!?]/.test(tk[q10].p)); q10--) if (tk[q10].w === "que" && SUBJ_TRIG.test(W(wi(q10, -1)))) { trig10 = true; break; }
      }
      var embora10 = w === "embora" && !(pi >= 0 && lemmas(p).indexOf("ir") >= 0) && !(pi >= 0 && /^(vou|vai|vamos|vão|foi|fui|foram|ir|irmos|irem)$/.test(p));
      var caso10 = w === "caso" && !(pi >= 0 && /^(nesse|neste|naquele|no|em|o|um|nenhum|qualquer|esse|este|cada|do|pelo|seu|meu|nosso|deste|desse|num)$/.test(p));
      if (week >= 23 && (trig10 || /^(talvez|tomara)$/.test(w) || caso10 || embora10)) {
        var trigW = w === "que" ? (p === "e" ? "que" : p) : w;
        var past10 = w === "que" && V(p).some(function (v) { return /^(perfeito|imperfeito|condicional)$/.test(v.tense); }) && !/^(quero|espero)$/.test(p);
        var sv10 = subjectAndVerb(w === "tomara" && n === "que" ? ni : i), sk = sv10.k, sp2 = sv10.p;
        var sv = V(W(sk));
        if (sk >= 0 && sv.length && !sv.some(function (v) { return /^subj/.test(v.tense) || v.tense === "infPessoal"; }) && !tk[sk].cap && !isInf(W(sk)) && !(/^(como|para|sobre|entre|segundo)$/.test(W(sk)) && SUBJ_PRON[W(wi(sk, -1))] == null)) {
          var pres = sv.filter(function (v) { return v.tense === "presente" || (past10 && /^(imperfeito|perfeito)$/.test(v.tense)); });
          var pick = pres.filter(function (v) { return v.p === sp2; })[0] || pres.filter(function (v) { return v.p === 2; })[0] || pres[0];
          var sf = pick && conjForm(pick.lemma, past10 ? "subjImperfeito" : "subjPresente", pick.p);
          if (sf && sf !== W(sk)) push(sk, 1, "subjuntivo", "Después de " + it(w === "que" ? (trigW === "que" ? "que" : trigW + " que") : w) + " va subjuntivo: " + it(sf) + ".",
            /^(sugere|sugerem|sugeriu|sugeriram)$/.test(trigW));
        }
      }
      if (w === "que" && /^(acho|achamos|acha|acham|acredito|creio|penso)$/.test(p) && week >= 23 && !/^(não|nunca)$/.test(p2)) {
        var ak = wi(i, 1);
        while (ak >= 0 && (SUBJ_PRON[W(ak)] != null || /^(não|me|te|se|nos|lhe|já)$/.test(W(ak)))) ak = wi(ak, 1);
        var av = V(W(ak));
        if (av.length && av.every(function (v) { return v.tense === "subjPresente"; })) {
          var ind = conjForm(av[0].lemma, "presente", av[0].p);
          if (ind) push(ak, 1, "subjuntivo", it(p + " que") + " afirma una opinión: va indicativo, " + it(ind) + ".");
        }
      }

      /* 11. infinitivo pessoal: para eles saber → saberem */
      if (week >= 29 && /^(para|sem|de|até|após|antes|depois)$/.test(w) && /^(nós|eles|elas|vocês|tu)$/.test(n) && isInf(n2) && !/^(ser)$/.test(p)) {
        var ip = conjForm(n2, "infPessoal", { "nós": 3, eles: 5, elas: 5, "vocês": 5, tu: 1 }[n]);
        if (ip && ip !== n2) push(wi(ni, 1), 1, "inf_pessoal", "Con sujeto propio el infinitivo lleva persona: " + it(w + " " + n + " " + ip) + ".");
      }
      if (week >= 29 && /^(os|as)$/.test(w) && ni === i + 1 && (/^(para|sem)$/.test(p) || /^(importante|fundamental|necessário|bom|melhor|essencial|preciso|normal|comum|possível)$/.test(p))) {
        var ik = wi(ni, 1);
        if (ik >= 0 && isAdj(W(ik)) && !isInf(W(ik))) ik = wi(ik, 1);
        var iw = W(ik);
        if (/s$/.test(n) && isInf(iw) && !V(n).length) {
          var ip2 = conjForm(iw, "infPessoal", 5);
          if (ip2 && ip2 !== iw) push(ik, 1, "inf_pessoal", "El infinitivo tiene sujeto propio en plural (" + it(w + " " + n) + "): " + it(ip2) + ".");
        }
      }

      /* 12. pronombres */
      if (/^(para|pra|por|sem|de|a|contra|entre)$/.test(w) && /^(mí|mi)$/.test(n)) push(ni, 1, "pronome", "Después de preposición: " + it(w + " mim") + ".");
      if (/^(para|pra)$/.test(w) && n === "eu" && !isInf(n2) && !finite(n2) && tk[ni + 1] && (tk[ni + 1].p || !isVerb(n2))) push(ni, 1, "pronome", "Sin verbo detrás va " + it("para mim") + " (para eu solo delante de un infinitivo: para eu fazer).");
      if (w === "com" && /^(eu|mim|mí)$/.test(n)) push(i, 2, "pronome", "Con *com* se funde: " + it("comigo") + ".");
      if (w === "com" && n === "nós" && !/^(todos|dois|três|mesmos|próprios)$/.test(n2)) push(i, 2, "pronome", "Con *com*: " + it("conosco") + ".", true);
      if (w === "conmigo") push(i, 1, "pronome", it("conmigo") + " es español: " + it("comigo") + ".");

      /* 13. colocação: enclisis después de un atractor */
      if (sp && /^(não|nunca|jamais|que|quem|já|também|sempre|ainda|só|talvez|se|quando|onde|como|porque|ninguém|nada|tudo)$/.test(p) && !isInf(sp.v) && !(p === "se" && false) && !GER(sp.v))
        push(pi, 2, "colocacao", it(p) + " atrae el pronombre delante del verbo: " + it(p + " " + sp.c + " " + sp.v) + ".");

      /* 14. crase */
      if (w === "a" && pi >= 0 && ni === i + 1 && PLACES_F.test(n) && (lemmas(p).some(function (l) { return MOTION.test(l); }) || isInf(p) && MOTION.test(p)) && !tk[ni].cap) push(i, 1, "crase", "Ir *a* + *a* praia = " + it("à " + n) + " (con crase; con masculino sería *ao*).");
      if (w === "a" && pi >= 0 && tk[ni] && tk[ni].cap && /^(lapa|urca|tijuca|glória|bahia|argentina|europa|itália|frança|espanha|alemanha|inglaterra|amazônia|áfrica|ásia)$/.test(n) && lemmas(p).some(function (l) { return MOTION.test(l); })) push(i, 1, "crase", "Con lugar femenino con artículo: " + it("à " + tk[ni].o) + ".");
      if (w === "as" && HOURW.test(n) && ni === i + 1 && !/^(são|todas|eram|entre|das|desde|até|após|para|pelas|antes|depois|a|e)$/.test(p) && !(pi >= 0 && /^(de|das)$/.test(W(wi(i, -2)) )) && !ART.test(p) && (/^(horas|e|da|de|em)$/.test(n2) || tk[wi(ni, 1) - 1] && tk[wi(ni, 1) - 1].p || !n2) &&
          !(n2 === "horas" && /^(diárias|semanais|mensais|seguidas|por|extras|de|a)$/.test(W(wi(wi(ni, 1), 1))))) push(i, 1, "crase", "Con la hora va crase: " + it("às " + n) + ".");
      if (/^(à|às)$/.test(w) && ni === i + 1 && (nounGN(n) && nounGN(n).g === "m" && !/^(moda|maneira)$/.test(n) || isInf(n) || /^(pé|cavalo|vista|prazo)$/.test(n)) && !/^(à-toa)$/.test(n))
        push(i, 1, "crase", "Delante de " + (isInf(n) ? "un verbo" : "un masculino") + " no hay crase: " + it(w.replace("à", "a") + " " + n) + ".");
      if (w === "à" && /^(uma|dois|duas|três|quatro|cinco|seis|sete|oito|nove|dez)$/.test(n) && /^(anos|meses|dias|semanas|horas|minutos|séculos)$/.test(n2)) push(i, 1, "ortografia", "Tiempo pasado: " + it("há " + n + " " + n2) + " (hace).");
      if (w === "a" && /^(uma|dois|duas|três|quatro|cinco|seis|sete|oito|nove|dez|muito|pouco|alguns|algumas|\d+)$/.test(n) && /^(anos|meses|dias|semanas|séculos|tempo)$/.test(n2 === "muito" ? "tempo" : n2) && !/^(daqui|de|até)$/.test(p) && !/^(daqui)$/.test(p2))
        push(i, 1, "ortografia", "«Hace» + tiempo es " + it("há") + ": " + it("há " + n + " " + (n2 || "")) + ".");

      /* 15. persona del verbo */
      if (SUBJ_PRON[w] != null && !(pi >= 0 && (PREPS.test(p) || finite(p) || /^(e|nem|ou)$/.test(p))) && !(tk[ni] && tk[ni].p) && !/^(e|nem|ou)$/.test(n)) {
        var target = SUBJ_PRON[w];
        var vk2 = ni;
        while (vk2 >= 0 && SKIPV.test(W(vk2))) vk2 = wi(vk2, 1);
        var vw2 = W(vk2), rd2 = V(vw2);
        var ok2 = rd2.some(function (v) { return v.p === target || (w === "tu" && v.p === 2) || v.tense === "infPessoal" && isInf(vw2); });
        if (vk2 >= 0 && rd2.length && !ok2 && !isNoun(vw2) && !isAdj(vw2) && !isInf(vw2) && !PP(vw2) && !tk[vk2].cap && !AMBIG.test(vw2) && !(tk[vk2 + 1] && tk[vk2 + 1].p === "?" && /^(como|onde)$/.test(vw2))) {
          var r0 = rd2[0], fm = conjForm(r0.lemma, r0.tense, target);
          if (fm && fm !== vw2) push(vk2, 1, "persona", (w === "você" || w === "vocês" ? it(w) + " va con el verbo en tercera persona: " : "Con " + it(w) + " el verbo es ") + it(fm) + ".");
        }
      }
      if (w === "gente" && p === "a") {
        var gk2 = ni;
        while (gk2 >= 0 && SKIPV.test(W(gk2))) gk2 = wi(gk2, 1);
        var gr = V(W(gk2));
        if (gr.length && gr.every(function (v) { return v.p === 3; })) { var gf = conjForm(gr[0].lemma, gr[0].tense, 2); if (gf) push(gk2, 1, "persona", it("A gente") + " va con el verbo en tercera del singular: " + it("a gente " + gf) + "."); }
      }
      if (/^(eles|elas|vocês)$/.test(w) && ni === i + 1 && /^(tem|vem)$/.test(n)) push(ni, 1, "persona", "En plural lleva circunflejo: " + it(n === "tem" ? "têm" : "vêm") + ".");
      if (/^(houveram|haviam|haverão|hajam|houvessem)$/.test(w) && !PP(n) && !(pi >= 0 && /^(se)$/.test(p))) push(i, 1, "persona", it("Haver") + " existencial va en singular: " + it({ houveram: "houve", haviam: "havia", "haverão": "haverá", hajam: "haja", houvessem: "houvesse" }[w]) + ".");

      /* 16. participios: foi pagado → pago; tinha abrido → aberto */
      if (PP(w) && pi >= 0) {
        var lemP = PP(w), parts = null;
        try { parts = Conj && Conj.participles ? Conj.participles(lemP) : null; } catch (e) { parts = null; }
        if (parts && parts.regular && parts.irregular && parts.regular !== parts.irregular) {
          var regF = parts.regular, irrF = parts.irregular;
          var isReg = w.replace(/(a|os|as)$/, "o") === regF;
          if (isReg && /^(é|são|foi|foram|era|eram|será|serão|seja|sejam|fosse|fossem|sido|ser|está|estão|estava|estavam|ficou|ficaram|fica|ficam)$/.test(p))
            push(i, 1, "participio", "Con *ser, estar* y *ficar* va el participio corto: " + it(irrF.replace(/o$/, w.slice(regF.length - 1))) + ".");
        }
      }
      if (/^(\w+)(ido|ida|idos|idas|ado|ada)$/.test(w) && known(w) === false) { /* handled by regMap */ }

      /* 17. número + singular: dois livro */
      if (/^(dois|duas|três|quatro|cinco|seis|sete|oito|nove|dez|vinte|trinta|cem|mil|muitos|muitas|vários|várias|\d+)$/.test(w) && !(/^\d+$/.test(w) && (+w < 2 || +w >= 1000)) && ni === i + 1 && !tk[ni].cap) {
        var ns = DATA.nouns[n];
        if (ns && ns.s === n && ns.pl && ns.pl !== n && !/^(de|anos)$/.test(n) && !/^(às|as|das)$/.test(p)) push(ni, 1, "plural", "Después de " + it(t.o) + " va el plural: " + it(ns.pl) + ".");
      }

      /* 18. «ir a» + infinitivo; «tener que» ya salió por español */
      if (w === "a" && lemmas(p).indexOf("ir") >= 0 && isInf(n) && ni === i + 1 && !/^(ser)$/.test(n)) push(i, 1, "espanol", "*Ir* + infinitivo va sin *a*: " + it(p + " " + n) + ".");

      /* 19. tildes de verbo: ele e alto → é */
      var capP = pi >= 0 && tk[pi].cap && !tk[pi].start;
      if (w === "e" && pi >= 0 && pi === i - 1 && (/^(ele|ela|você|isso|isto|aquilo|tudo|onde|quem|qual)$/.test(p) || capP) && ni >= 0 &&
          (isAdj(n) && !isNoun(n) || (!capP && /^(muito|um|uma|meu|minha|aqui|lá|verdade|possível|importante)$/.test(n))) && !(tk[ni].cap) && !(tk[wi(pi, -1)] && /^(e|,)$/.test(W(wi(pi, -1)))))
        push(i, 1, "tilde", "El verbo lleva tilde: " + it("é") + " (*e* sin tilde es «y»).");

      if (w === "e" && pi >= 0 && /^(porque|pois|quando|mas|se|hoje|ontem|amanhã|isso|isto|que)$/.test(p) && ni >= 0 &&
          (/^(segunda-feira|terça-feira|quarta-feira|quinta-feira|sexta-feira|sábado|domingo|feriado|verdade|possível|difícil|fácil|importante|tarde|cedo|melhor|pior|hora|dia|noite|necessário|preciso)$/.test(n) || (isAdj(n) && !isNoun(n) && !V(n).length)) && !(tk[ni].cap))
        push(i, 1, "tilde", "El verbo lleva tilde: " + it(p + " é " + n) + " (*e* sin tilde es «y»).");
      if (w === "que" && tk[i + 1] && tk[i + 1].p === "?" && /^(o|por)$/.test(p)) push(i, 1, "tilde", "Al final de la pregunta: " + it(p + " quê") + "?");

      /* 20. mas / mais; porque en preguntas */
      if (w === "mais" && (t.start || t.clause) && (SUBJ_PRON[n] != null || /^(não|também|ninguém|nada)$/.test(n)) && !/^(ou)$/.test(p)) push(i, 1, "lexico", it("Mais") + " es «más»; «pero» es " + it("mas") + ".");
      // «Porque…» after a question is the answer (Por que…? Porque…), and «…, né?» / «…, sabe?» only asks for agreement
      var afterQ = pi >= 0 && (function () { for (var q0 = i - 1; q0 >= 0; q0--) if (tk[q0].p && /[.!?]/.test(tk[q0].p)) return tk[q0].p === "?"; return false; })();
      if (w === "porque" && t.start && !afterQ) {
        for (var q2 = i + 1; q2 < tk.length; q2++) if (tk[q2].p && /[.!?]/.test(tk[q2].p)) {
          if (tk[q2].p === "?" && !/^(né|sabe|entende|viu|certo)$/.test(W(wi(q2, -1)))) push(i, 1, "ortografia", "En una pregunta, separado: " + it("Por que…?") + " (porque = porque, en la respuesta).");
          break;
        }
      }

      /* 21. falsos amigos en contexto */
      if (/^(vaso|vasos)$/.test(w) && /^(de|com)$/.test(n) && /^(água|suco|vinho|cerveja|leite|refrigerante)$/.test(n2)) push(i, 1, "falso_amigo", "El vaso para tomar es el " + it(w === "vaso" ? "copo" : "copos") + " (" + it("vaso") + " es una maceta o un florero).");
      if (/^(borracho|borracha|borrachos|borrachas)$/.test(w) && /^(estava|está|estou|ficou|fiquei|ficaram|estavam|muito|meio|completamente)$/.test(p)) push(i, 1, "falso_amigo", "«Borracho» es " + it(w.replace(/borrach/, "bêbad")) + " (" + it("borracha") + " es la goma).");
      if (/^(pelo|pelos)$/.test(w) && (ART.test(p) || POSS.test(p)) && /^(longo|curto|comprido|loiro|castanho|preto|liso|cacheado|ruivo|crespo|lindo|bonito)$/.test(n)) push(i, 1, "falso_amigo", "El pelo de la cabeza es el " + it("cabelo") + " (" + it("pelo") + " es el vello o el pelaje).");
      if (w === "acordo" && p === "me" && /^(de|do|da|dos|das|que)$/.test(n)) push(pi, 2, "falso_amigo", "«Me acuerdo de» es " + it("lembro de") + " o " + it("me lembro de") + " (acordar = despertarse).");
      if (/^(esquisito|esquisita|esquisitos|esquisitas)$/.test(w) && (
          (sentence(i).some(function (x) { return /^(comida|prato|bolo|feijoada|moqueca|jantar|almoço|sobremesa|churrasco)$/.test(x); }) && sentence(i).some(function (x) { return /^(gostos[oa]s?|delicios[oa]s?|maravilhos[oa]s?|saboros[oa]s?|ótim[oa]s?)$/.test(x); })))) push(i, 1, "falso_amigo", it(w) + " es «raro»; «exquisito» es " + it(w.replace(/esquisit/, "delicios")) + " o " + it(w.replace(/esquisit/, "gostos")) + ".");
      if (/^(propina|propinas)$/.test(w) && sentence(i).some(function (x) { return /^(garçom|garçonete|restaurante|bar|boteco|conta|deixei|deixamos|dei)$/.test(x); })) push(i, 1, "falso_amigo", "La propina del mozo es la " + it("gorjeta") + " (" + it("propina") + " es un soborno).");
      if (w === "rato" && /^(um|uns)$/.test(p) && (/^(depois|mais|atrás|antes)$/.test(n) || lemmas(p2).some(function (l) { return /^(esperar|ficar|descansar|conversar)$/.test(l); }))) push(i, 1, "falso_amigo", "«Un rato» es " + it("um tempinho") + " o " + it("um momento") + " (" + it("rato") + " es el ratón).");
      if (w === "largo" || w === "larga") { if (/^(cabelo|vestido|dia|viagem|filme|caminho|texto|livro)$/.test(p)) push(i, 1, "falso_amigo", "«Largo» es " + it(w === "largo" ? "comprido / longo" : "comprida / longa") + " (" + it("largo") + " es ancho).", true); }
      if (/^(presunto|presunta)$/.test(w) && /^(o|a)$/.test(p) && /^(culpado|culpada|assassino|ladrão|autor)$/.test(n)) push(i, 1, "falso_amigo", "«Presunto» es " + it("suposto") + " (" + it("presunto") + " es el jamón).");
      if (w === "polvo" && /^(muito|cheio|cheia|tanto)$/.test(p) && !/^(grelhado|frito|com|ao|à)$/.test(n)) push(i, 1, "falso_amigo", "El polvo es " + it("pó") + " o " + it("poeira") + " (" + it("polvo") + " es el pulpo).");
      if (w === "apelido" && /^(é)$/.test(n) && tk[wi(ni, 1)] && tk[wi(ni, 1)].cap && /(ez|es)$/.test(n2)) push(i, 1, "falso_amigo", "El apellido es el " + it("sobrenome") + " (" + it("apelido") + " es el apodo).");
      if (/^(oficina|oficinas)$/.test(w) && sentence(i).some(function (x) { return /^(chefe|reunião|reuniões|computador|computadores|colegas|expediente|empresa)$/.test(x); }) && !sentence(i).some(function (x) { return /^(carro|moto|mecânico|mecânica|conserto|bicicleta|costura)$/.test(x); })) push(i, 1, "falso_amigo", "La oficina es el " + it("escritório") + " (" + it("oficina") + " es un taller).");
      if (w === "logo" && /^(e)$/.test(p) && false) { /* */ }

      /* 22. regencia */
      if (hasLem(w, /^namorar$/) && n === "com") push(ni, 1, "regencia", it("Namorar") + " va sin preposición: " + it(w + " " + n2) + " (*namorar com* es del habla).");
      if (hasLem(w, /^(pensar|acreditar|confiar)$/) && ni === i + 1 && !/^(em|no|na|nos|nas|num|numa|nele|nela|nisso|nisto|naquilo|que|se|bem|muito|melhor|sobre|,)$/.test(n) && !finite(n) && !isInf(n) && (SUBJ_PRON[n] != null || /^(você|ele|ela|mim|ti)$/.test(n) || tk[ni].cap || isNoun(n) || ART.test(n))) {
        var lPen = lemmas(w).filter(function (l) { return /^(pensar|acreditar|confiar)$/.test(l); })[0];
        if (!(lPen === "pensar" && ART.test(n))) push(i, 2, "regencia", it(lPen) + " lleva " + it("em") + ": " + it(w + " em " + n) + ".");
      }
      if (hasLem(w, /^(sonhar)$/) && ni === i + 1 && !/^(com|que|acordado|,)$/.test(n) && (ART.test(n) || SUBJ_PRON[n] != null || tk[ni].cap)) push(i, 2, "regencia", it("Sonhar") + " lleva " + it("com") + ": " + it(w + " com " + n) + ".");
      if (hasLem(w, /^(precisar)$/) && ni === i + 1 && !(w === "preciso" && /^(é|foi|era|será|seria|seja|fosse|ser|está)$/.test(p)) && (ART.test(n) || isNoun(n) || POSS.test(n) || /^(ajuda|dinheiro|tempo|ele|ela|você)$/.test(n)) && !isInf(n)) push(i, 2, "regencia", it("Precisar") + " + sustantivo lleva " + it("de") + ": " + it(w + " " + (ART.test(n) ? ({ o: "do", a: "da", os: "dos", as: "das", um: "de um", uma: "de uma" }[n] || "de " + n) : "de " + n)) + ".");
      if (hasLem(w, /^(lembrar|esquecer)$/) && p === "me" && ni === i + 1 && (ART.test(n) || isNoun(n))) push(i, 2, "regencia", "Con pronombre, " + it(lemmas(w)[0] + "-se") + " lleva " + it("de") + ": " + it("me " + w + " " + ({ o: "do", a: "da", os: "dos", as: "das" }[n] || "de " + n)) + ".");
      if (w === "de" && n === "que" && /^(acho|achei|penso|pensei|acredito|disse|falou|sei)$/.test(p)) push(i, 1, "regencia", "Sin *de*: " + it(p + " que") + ".");
      if (hasLem(w, /^(assistir)$/) && ni === i + 1 && ART.test(n) && /^(filme|jogo|show|aula|novela|série|peça|espetáculo|desfile)$/.test(n2)) push(i, 2, "regencia", "En la norma culta, " + it("assistir a") + " (ver): " + it(w + " " + ({ o: "ao", a: "à", os: "aos", as: "às" }[n] || "a " + n) + " " + n2) + " (en el habla también: assisti o jogo).", week < 35);
      if (hasLem(w, /^(obedecer|desobedecer)$/) && ni === i + 1 && /^(o|os|as)$/.test(n) && !finite(n2)) push(i, 2, "regencia", it("Obedecer") + " lleva " + it("a") + ": " + it(w + " " + { o: "ao", a: "à", os: "aos", as: "às" }[n] + " " + n2) + ".");
      if (hasLem(w, /^preferir$/)) {
        var sw5 = tk.slice(i + 1, i + 8).map(function (x) { return x.w || "|"; }).join(" ");
        if ((n === "mais" && !isAdj(n2)) || / do que /.test(" " + sw5.split("|")[0] + " ")) push(i, 1, "regencia", "*Preferir* no lleva *mais… (do) que*: " + it("preferir X a Y") + " (prefiro o samba ao funk).");
      }
      if (w === "precisa-se" && n && n !== "de") push(i, 1, "regencia", "Con sustantivo, " + it("precisa-se de") + ": " + it("precisa-se de " + tk[ni].o) + ".");
      if (w === "que" && pi >= 0 && !isVerb(p) && !PREPS.test(p) && tk[i - 1] && tk[i - 1].w && p.indexOf("-") < 0 && (isNoun(p) || guessGN(p)) && !/^(o|a|é|mais|menos|tão|tanto|coisa|todos|todas|isso|nada|tudo|algo|pouco|muito|muitos|muitas|ainda|agora|assim|mesmo|mesma|claro|certo|certeza|pena|hora|vez|ideia|verdade|medo|pena|fato|possível|importante|provável|bom|ótimo|melhor|pior|preciso|necessário|pra|para)$/.test(p) && !isAdj(p)) {
        var rq = wi(i, 1);
        while (rq >= 0 && (SUBJ_PRON[W(rq)] != null || /^(mais|muito|sempre|não|também|te|me|lhe|a|gente)$/.test(W(rq)))) rq = wi(rq, 1);
        var rl = lemmas(W(rq));
        var rp = rl.map(function (l) { return { gostar: "de", precisar: "de", lembrar: "de", depender: "de", falar: "de", pensar: "em", acreditar: "em", confiar: "em", sonhar: "com", casar: "com" }[l]; }).filter(Boolean)[0];
        if (rq >= 0 && rp && !(rl[0] === "falar" && W(wi(rq, 1)) === "com") && !/^(que|se)$/.test(W(wi(rq, 1)))) push(i, 1, "regencia", "El verbo del relativo pide su preposición delante: " + it((rp === "de" ? "de" : rp === "em" ? "em" : "com") + " que") + " (o bairro de que gosto, a pessoa em quem penso).", true);
      }
      if (w === "de" && n === "que" && lemmas(p).some(function (l) { return /^(achar|pensar|acreditar|dizer|defender|afirmar|sustentar|crer|considerar|ressaltar|garantir|explicar)$/.test(l); }) && !ART.test(W(wi(pi, -1))) && !(isNoun(n2) || (guessGN(n2) && !V(n2).length))) push(i, 1, "regencia", "Sin *de*: " + it(p + " que") + ".");

      /* 23. más preposiciones */
      if (/^(os|as)$/.test(w) && (t.start || t.clause) && /^(domingos|sábados|segundas|terças|quartas|quintas|sextas|fins|feriados|finais)$/.test(n)) {
        var ahead = tk.slice(ni + 1, ni + 5).map(function (x) { return x.w || ""; });
        if (ahead.some(function (x) { return SUBJ_PRON[x] != null || finite(x); })) push(i, 1, "preposicion", "Para lo habitual: " + it((/^(fins|feriados|finais)$/.test(n) ? "nos " : "aos ") + n) + " (aos domingos, nos fins de semana).");
      }
      var motionNear = [1, 2, 3, 4].some(function (d) { var k = i - d; if (k < 0 || !tk[k].w) return false; return lemmas(tk[k].w).some(function (l) { return /^(ir|vir|voltar|chegar|viajar|andar|sair|passear)$/.test(l); }); });
      if (/^(em|en)$/.test(w) && /^(metrô|ônibus|bicicleta|bike|barca|barco|táxi|carro|avião|trem|moto|uber|bondinho|bonde)$/.test(n) && ni === i + 1 && motionNear)
        push(i, 1, "preposicion", "Los medios de transporte van con *de*: " + it("de " + n) + " (de metrô, de ônibus).");
      if (/^(de|em)$/.test(w) && n === "pé" && ni === i + 1 && !/^(de|em)$/.test(n2) && (lemmas(p).some(function (l) { return /^(ir|vir|voltar|chegar|andar)$/.test(l); }) || /^(vou|vai|vamos|volto|venho)$/.test(p2))) push(i, 1, "preposicion", "Caminando es " + it("a pé") + ".");
      if (w === "a" && nxt && nxt.cap && ni === i + 1 && lemmas(p).some(function (l) { return /^(morar|viver|trabalhar)$/.test(l); }) && !finite(n2) && !isNoun(p) && !(pi >= 1 && (ART.test(p2) || (U.prepInfo && U.prepInfo(p2)))) && !/^(onde|que|quem|como)$/.test(p2)) push(i, 1, "preposicion", "Para dónde vivís o estás: " + it("em " + nxt.o) + " (moro em Botafogo).");
      if (w === "a" && n === "casa" && ni === i + 1 && lemmas(p).some(function (l) { return /^(voltar|ir)$/.test(l); }) && !isInf(p) && (!tk[ni + 1] || tk[ni + 1].p || /^(de|cedo|tarde|agora)$/.test(n2))) push(i, 1, "preposicion", "En Brasil se dice " + it("para casa") + " (volto para casa).");

      /* 24. más crase */
      if (w === "a" && (t.clause || /^(e|de)$/.test(p) || (tk[i - 1] && tk[i - 1].p)) && /^(tarde|noite)$/.test(n) && ni === i + 1 && !/^(está|estava|foi|é|era|passou|caiu|chegou|ficou|inteira|toda)$/.test(n2)) push(i, 1, "crase", "Parte del día: " + it("à " + n) + ".");
      if (w === "a" && /^(tarde|noite)$/.test(n) && ni === i + 1 && (!tk[ni + 1] || tk[ni + 1].p) && pi >= 0 && !finite(p) && !isInf(p) && !PP(p) && !/^(toda|a|essa|esta|uma|boa|de)$/.test(p)) push(i, 1, "crase", "Parte del día: " + it("à " + n) + ".");
      if (w === "as" && n === "vezes" && !/^(todas|das|nas|pelas|muitas|poucas|várias|algumas|duas|três|quatro|cinco)$/.test(p)) push(i, 1, "crase", "«A veces» es " + it("às vezes") + ".");
      if (w === "a" && ni === i + 1 && !tk[ni].cap && !(pi >= 0 && (PREPS.test(p) || U.prepInfo && U.prepInfo(p))) && /^(diretora|professora|chefe|mãe|avó|tia|secretária|empresa|escola|universidade|prefeitura|polícia|vizinha|amiga|irmã|filha|namorada|coordenadora|gerente|atendente)$/.test(n)) {
        var dat = false;
        for (var q3 = i - 1; q3 >= 0 && q3 >= i - 5 && tk[q3].w; q3--) if (lemmas(tk[q3].w).some(function (l) { return /^(entregar|dar|enviar|mandar|mostrar|pedir|perguntar|explicar|escrever|agradecer|responder|contar|emprestar|devolver|oferecer)$/.test(l); })) { dat = q3 < i - 1; break; }
        if (dat) push(i, 1, "crase", "Objeto indirecto femenino con artículo: " + it("à " + n) + " (a + a).");
      }

      /* 25. pronombres */
      if (/^(lhe|lhes)$/.test(w) && ni === i + 1 && lemmas(n).some(function (l) { return /^(ver|conhecer|amar|ajudar|convidar|visitar|esperar|chamar|encontrar|abraçar|beijar|cumprimentar|buscar|procurar|entender|acompanhar|admirar|respeitar|odiar|adorar)$/.test(l); })) push(i, 1, "pronome", it(lemmas(n)[0]) + " lleva objeto directo: " + it((w === "lhe" ? "o / a" : "os / as") + " " + n) + " (en el habla: " + n + " ele).");
      var encR = /^(.+)r-(l?)(o|a|os|as)$/.exec(w);
      if (encR && !(encR[2] === "l" && /[áêíô]$/.test(encR[1]))) {
        var stA = encR[1].replace(/a$/, "á").replace(/e$/, "ê").replace(/o$/, "ô");
        push(i, 1, "pronome", "Tras un infinitivo la *r* cae y el pronombre es *-lo, -la*: " + it(stA + "-l" + encR[3]) + ".");
      }

      /* 26. subjuntivo e hipótesis */
      if (w === "se" && (t.clause || /^(e|mas|que)$/.test(p)) && !(p === "que" && ni === i + 1 && V(n).length)) {
        var hk = wi(i, 1);
        while (hk >= 0 && (SUBJ_PRON[W(hk)] != null || /^(não|me|te|nos|lhe|o|a|os|as)$/.test(W(hk)) || (!V(W(hk)).length && !isInf(W(hk)) && hk <= i + 4 && !tk[hk].p))) hk = wi(hk, 1);
        var hw = W(hk), hv = V(hw);
        if (hk >= 0 && hv.length && hv.every(function (v) { return v.tense === "maisQuePerfeito"; })) {
          var sf5 = conjForm(hv[0].lemma, "subjImperfeito", hv[0].p);
          push(hk, 1, "subjuntivo", "En la condición va el imperfeito do subjuntivo: " + it(sf5) + " (no el mais-que-perfeito en *-ra*).");
        }
        if (/^(havia|tinha|haviam|tinham)$/.test(hw) && PP(W(wi(hk, 1)))) push(hk, 1, "subjuntivo", "Hipótesis del pasado: " + it((/m$/.test(hw) ? "tivessem " : "tivesse ") + W(wi(hk, 1))) + ".");
      }

      /* 27. participios */
      if ((t.start || t.clause) && PP(w) && ni === i + 1 && /^(o|a|os|as)$/.test(n) && /(o|a|os|as)$/.test(w)) {
        var endP = /os$/.test(w) ? "os" : /as$/.test(w) ? "as" : /o$/.test(w) ? "o" : "a";
        if (endP !== n) push(i, 1, "participio", "El participio concuerda con lo que sigue: " + it(w.replace(/(os|as|o|a)$/, n) + " " + n + " " + n2) + ".");
      }
      if (/^(chego|pego)$/.test(w) && /^(teria|tinha|tenho|tem|terá|tiver|tivesse|havia|ter)$/.test(p) && w === "chego") push(i, 1, "participio", "El participio de *chegar* es " + it("chegado") + ".");
      if (/^(é|são|foi|foram|era|eram|será|serão|está|estão|estava|estavam)$/.test(w) && PP(n) && ni === i + 1 && pi === i - 1 && pi >= 1 && wi(pi, -1) === pi - 1 && /^(o|a|os|as)$/.test(W(wi(pi, -1))) && !V(p).length) {
        var gs6 = nounGN(p) || guessGN(p), art6 = W(wi(pi, -1));
        var want6 = gs6 && gs6.n ? { ms: "o", fs: "a", mp: "os", fp: "as" }[gs6.g + gs6.n] : { o: "o", a: "a", os: "os", as: "as" }[art6];
        var end6 = /os$/.test(n) ? "os" : /as$/.test(n) ? "as" : /o$/.test(n) ? "o" : /a$/.test(n) ? "a" : null;
        if (end6 && want6 && end6 !== want6 && want6 === art6) push(ni, 1, "participio", "El participio concuerda con " + it(art6 + " " + p) + ": " + it(n.replace(/(os|as|o|a)$/, want6)) + ".");
      }

      /* 28. colocação en la escritura formal */
      if (formal && t.start && CLIT.test(w) && ni === i + 1 && (finite(n) || /(ou|ei|aram|eram|iram|ava|avam|ia|iam|am|em)$/.test(n)))
        push(i, 2, "colocacao", "En la escritura formal no se empieza con un pronombre átono (me, te, se, lhe): " + it(tk[ni].o.charAt(0).toUpperCase() + n.slice(1) + "-" + w) + ". En el habla de Brasil, " + it(w + " " + n) + " es lo normal.",
          false, { level: "close", good: tk[ni].o.charAt(0).toUpperCase() + n.slice(1) + "-" + w });
      if (week >= 32 && t.start && w === "se" && ni === i + 1 && V(n).some(function (v) { return v.tense === "presente" && (v.p === 2 || v.p === 5); })) {
        var sent7 = [];
        for (var q7 = i; q7 < tk.length && !(tk[q7].p && /[.!?]/.test(tk[q7].p)); q7++) sent7.push(tk[q7]);
        if (!sent7.some(function (x) { return x.p === ","; }) && !sent7.some(function (x) { return SUBJ_PRON[x.w] != null; })) push(i, 2, "colocacao", "En carteles y avisos: " + it(tk[ni].o.charAt(0).toUpperCase() + n.slice(1) + "-se") + " (vende-se, aluga-se).", week !== 32);
      }

      /* 29. registro (la tabla de Diagnosi.REGISTRO) y léxico */
      if (formal && t.start && w === "tem" && ni >= 0 && !isInf(n) && !PP(n) && n !== "que" && sentEnd(i) !== "?")
        push(i, 1, "registro", REGNOTE("tem", "há") + " (*tem* por «hay» es del habla).", false, { level: "close", good: "há" });
      var stdR = REGSTD[w];
      if (formal && (stdR || COLLOQ.test(w)) && !/^(cara|tipo|parada|tranquilo|aí|beleza)$/.test(w)) {
        stdR = stdR || { "né": "não é", "cê": "você" }[w] || "";
        push(i, 1, "registro", REGNOTE(t.o, stdR), false, { level: "close", good: stdR });
      }
      // vi ele, amo você: el pronombre del habla después del verbo
      if (formal && finite(w) && !PREPS.test(w) && !/^(como|segundo|conforme|entre|sobre|contra|era|foi|são|é)$/.test(w) && !/^(ser|estar|ficar|parecer|ir|vir)$/.test(lemmas(w)[0] || "") && ni === i + 1 && /^(ele|ela|eles|elas|você)$/.test(n) && !finite(n2) && !isInf(n2) &&
          (!n2 || PREPS.test(n2) || /^(ontem|hoje|amanhã|agora|ali|lá|aqui|sempre|também|depois|antes|ainda|já|muito|bem|mal|todo|toda|cedo|tarde)$/.test(n2) || (tk[ni + 1] && tk[ni + 1].p)) && !(pi >= 0 && /^(que|quem|onde|como|quando)$/.test(p))) {
        var clR = { ele: "o", ela: "a", eles: "os", elas: "as", "você": "o" }[n];
        push(i, 2, "registro", REGNOTE(t.o + " " + n, clR + " " + w) + " En lo escrito el objeto va con el pronombre átono (" + it(clR) + ").", false, { level: "close", good: clR + " " + w });
      }
      if (w === "todo" && ni === i + 1 && finite(n) && !isNoun(n) && !guessGN(n)) push(i, 1, "lexico", "El pronombre invariable es " + it("tudo") + " (tudo está bem); *todo* acompaña a un sustantivo.");
      if (hasLem(w, /^pisar$/) && n === "a" && n2 === "bola") push(i, 3, "lexico", "La expresión es " + it("pisar na bola") + ".");
      if (w === "em" && n === "brincadeira") push(i, 2, "lexico", "La expresión es " + it("levar na brincadeira") + ".");
      if (w === "que" && n === "?" ) { /* */ }

      /* 29b. regencia, ser/estar, persona y la hipótesis (tanda 2026-09 del corpus) */
      // sonhar com (soñar con): nunca «sonhar de»
      if (w === "de" && pi === i - 1 && hasLem(p, /^sonhar$/)) push(i, 1, "regencia", "*Sonhar* va con *com*: " + it(p + " com") + ", como «soñar con» en español.", false, { good: "com" });
      // el estado de hoy va con estar: hoje a praia está cheia, hoje o tempo está quente
      if (/^(é|são|era|eram)$/.test(w) && sentence(i).some(function (x) { return /^(hoje|agora|ontem)$/.test(x); }) &&
          ((/^(cheio|cheia|cheios|cheias|lotado|lotada|lotados|lotadas|vazio|vazia|fechado|fechada|aberto|aberta)$/.test(n) && ni === i + 1) ||
           (/^(tempo|dia)$/.test(p) && (/^(quente|frio|fria|nublado|chuvoso|abafado|ensolarado)$/.test(n) || (n === "muito" && /^(quente|frio|nublado|chuvoso|abafado)$/.test(n2)))))) {
        var est = { "é": "está", "são": "estão", era: "estava", eram: "estavam" }[w];
        push(i, 1, "ser_estar", "Para cómo está algo hoy va *estar*: " + it(est + " " + n) + " (como en español «hoy la playa está llena»); *ser* es para cómo es siempre.", false, { good: est });
      }
      // Meus pais mora → moram: sujeto plural con el verbo en singular
      if (finite(w) && !PREPS.test(w) && !/^(como|sobre|entre|segundo|conforme|fora|cerca)$/.test(w) && pi === i - 1 && pi >= 1 && /^(os|as|meus|minhas|seus|suas|nossos|nossas|esses|essas|estes|estas|muitos|muitas|alguns|algumas|vários|várias|dois|duas|três)$/.test(W(pi - 1)) &&
          (isNoun(p) || (nounGN(p) && nounGN(p).n === "p")) && /s$/.test(p) && !/^(é|era|foi|tem|vem|há)$/.test(w) &&
          // the plural noun phrase opens the subject: at the start, or after e, mas, que, quando…
          (tk[pi - 1].start || tk[pi - 1].clause || /^(e|mas|que|quando|porque|se|onde)$/.test(W(wi(pi - 1, -1))))) {
        var rv = V(w).filter(function (v) { return v.p === 2 && /^(presente|perfeito|imperfeito)$/.test(v.tense); })[0];
        var pl3 = rv && !V(w).some(function (v) { return v.p === 5; }) ? conjForm(rv.lemma, rv.tense, 5) : null;
        if (pl3 && pl3 !== w) push(i, 1, "persona", "El sujeto es plural (" + it(W(pi - 1) + " " + p) + "): " + it(pl3) + ".", false, { good: pl3 });
      }
      // se + imperfeito do subjuntivo: la consecuencia va en condicional (se eu tivesse…, estudaria)
      if (V(w).length && V(w).every(function (v) { return v.tense === "futuro"; }) && sentence(i).some(function (x) { return V(x).some(function (v) { return v.tense === "subjImperfeito"; }); }) &&
          sentence(i).indexOf("se") >= 0) {
        var fv = V(w)[0], cf6 = conjForm(fv.lemma, "condicional", fv.p);
        if (cf6) push(i, 1, "tempo", "Con *se* + imperfeito do subjuntivo, la consecuencia va en condicional: " + it(cf6) + " (como «si tuviera…, estudiaría»).", false, { good: cf6 });
      }
      // se eu morava…, iria: la condición irreal va en imperfeito do subjuntivo
      if (w === "se" && (t.clause || /^(e|mas)$/.test(p) || t.start)) {
        var mk = wi(i, 1);
        while (mk >= 0 && (SUBJ_PRON[W(mk)] != null || /^(não|me|te|nos|lhe)$/.test(W(mk)))) mk = wi(mk, 1);
        var mv6 = V(W(mk));
        if (mk >= 0 && mv6.length && mv6.every(function (v) { return v.tense === "imperfeito"; }) &&
            sentence(i).some(function (x) { return V(x).some(function (v) { return v.tense === "condicional"; }); })) {
          var si6 = conjForm(mv6[0].lemma, "subjImperfeito", mv6[0].p);
          if (si6) push(mk, 1, "subjuntivo", "Condición irreal: *se* + imperfeito do subjuntivo, " + it(si6) + ", como «si viviera» en español (no «si vivía»).", false, { good: si6 });
        }
      }
      // en un texto formal, «que tem muitos…» también es el «hay» del habla
      if (formal && w === "tem" && p === "que" && /^(muito|muitos|muitas|pouco|poucos|poucas|um|uma|uns|umas|vários|várias|mais|menos|algum|alguma|alguns|algumas|nenhum|nenhuma)$/.test(n))
        push(i, 1, "registro", REGNOTE("tem", "há") + " (*tem* por «hay» es del habla).", false, { level: "close", good: "há" });

      /* 30. palabras de más */
      if (w === "mais" && /^(maior|maiores|menor|menores|melhor|melhores|pior|piores)$/.test(n) && ni === i + 1) push(i, 1, "sobrante", it(n) + " ya es comparativo: sin " + it("mais") + ".");
      if (w === "nunca" && n === "não") push(ni, 1, "sobrante", "Con *nunca* delante del verbo no va *não*: " + it("nunca " + n2) + ".");
      if (w === "que" && n === "se" && lemmas(p).some(function (l) { return /^(perguntar)$/.test(l); })) push(i, 1, "sobrante", "Pregunta indirecta: " + it(p + " se") + ", sin *que*.");

    });
    out = citedOut(String(text || "").normalize("NFC").replace(/[’‘`´]/g, "'"), tk, out, /^(palavra|palavras|termo|termos|verbo|verbos|expressão|expressões|adjetivo|substantivo|forma|vocábulo)$/);
    out.forEach(function (f) { finding(f, tk, srcT); });
    return out.sort(function (a, b) { return a.i - b.i; });
  }

  /* Cada marca, lista para el perfil de errores: bad (lo escrito), good (la
     corrección mínima, si se sabe; si no, ""), why (la explicación: el
     mensaje y, si es corto, la regla de la categoría con el contraste con el
     español) y level ("wrong": error; "close": casi, como el registro del
     habla en un texto formal o una sugerencia dudosa). */
  function deacc(x) { return String(x).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase(); }
  function guessGood(msg, bad) {
    var segs = [], re = /\*([^*]+)\*/g, m, b = deacc(bad);
    while ((m = re.exec(msg))) segs.push({ x: m[1], at: m.index });
    segs = segs.filter(function (q) {
      var d = deacc(q.x);
      if (q.x.toLowerCase() === String(bad).toLowerCase() || /^-|,\s*-|\+|…/.test(q.x)) return false;
      // a correction looks like what was written (same start, or near in spelling)
      return d.charAt(0) === b.charAt(0) || (U.editDistance && U.editDistance(d, b) <= Math.max(2, Math.floor(b.length / 2)));
    });
    if (!segs.length) return "";
    var colon = msg.indexOf(":");
    var after = segs.filter(function (q) { return q.at > colon; })[0];
    return (after || segs[0]).x;
  }
  function finding(f, tk, src) {
    var a = tk[f.i], z = tk[Math.min(tk.length - 1, f.i + f.n - 1)];
    if (f.bad == null) f.bad = a && z && a.at != null && z.at != null ? src.slice(a.at, z.at + z.len) : tk.slice(f.i, f.i + f.n).map(function (x) { return x.o || ""; }).join(" ");
    if (f.good == null) f.good = guessGood(f.msg || "", f.bad);
    if (f.why == null) {
      var why = String(f.msg || ""), c = D && D.capa ? D.capa(f.cat) : null;
      if (c && why.replace(/\*/g, "").length < 70) why += " " + c.regla + (/español|castellano|«/.test(why) ? "" : " " + c.es);
      f.why = why.trim();
    }
    if (!f.level) f.level = f.soft ? "close" : "wrong";
    return f;
  }

  function firstLemma(w) {
    var v = V(w)[0];
    if (v) return v.lemma;
    if (U.isInfinitive && U.isInfinitive(w)) return w;
    if (/^(ser|ter|ir|ver|vir|dar|ler|pôr|rir)$/.test(w)) return w;
    return null;
  }
  function conjForm(lemma, tense, p) {
    if (!lemma || !Conj || p == null) return null;
    try { var f = Conj.conjugate(lemma, tense)[p]; return f ? String(f).split(" ").pop() : null; } catch (e) { return null; }
  }

  /* ------------------------------------------------------------ revisión */

  function check(text, week, opts) {
    var task = TASKS[week] || { min: 20, use: [] };
    var f = features(text);
    var reqs = [{ label: task.min + " palabras", n: f.words || 0, need: task.min }].concat(task.use.map(function (u) {
      return { id: u[0], label: u[2], n: f[u[0]] || 0, need: u[1] };
    }));
    reqs.forEach(function (r) { r.ok = r.n >= r.need; });
    var findings = lint(text, week, opts);
    return { words: f.words || 0, features: f, reqs: reqs, findings: findings,
             hard: findings.filter(function (x) { return !x.soft; }).length,
             ok: reqs.every(function (r) { return r.ok; }) };
  }

  /* The text with the flagged words marked, for the result screen. */
  function markup(text, findings, esc) {
    esc = esc || function (s) { return s; };
    var tk = toks(text), marks = {};
    findings.forEach(function (f, k) { for (var j = 0; j < f.n; j++) if (tk[f.i + j] && tk[f.i + j].w) marks[f.i + j] = { k: k, soft: f.soft }; });
    var src = String(text || "").normalize("NFC").replace(/[’‘`´]/g, "'"), html = "", last = 0;
    tk.forEach(function (t, i) {
      if (!t.w || !marks[i]) return;
      html += esc(src.slice(last, t.at)) + '<mark class="' + (marks[i].soft ? "soft" : "bad") + '">' + esc(src.substr(t.at, t.len)) +
        "<sup>" + (marks[i].k + 1) + "</sup></mark>";
      last = t.at + t.len;
    });
    return html + esc(src.slice(last));
  }

  /* ------------------------------------------------------ LanguageTool
     A second opinion from the free public API of LanguageTool (no key; 20
     requests a minute, plenty for one learner), in Brazilian Portuguese.
     The local findings keep their Spanish explanation, and what
     LanguageTool adds goes after them. */
  var LT_URL = "https://api.languagetool.org/v2/check";
  var LT_KIND = {
    GRAMMAR: ["grammatica", "Gramática", false], TYPOS: ["tipeo", "Ortografía", false],
    CONFUSED_WORDS: ["lexico", "Palabra", false], PUNCTUATION: ["puntuacion", "Puntuación", true],
    CASING: ["mayusculas", "Mayúsculas", true], STYLE: ["estilo", "Estilo", true], REDUNDANCY: ["estilo", "Estilo", true],
    SEMANTICS: ["lexico", "Sentido", true], TYPOGRAPHY: ["estilo", "Tipografía", true], COLLOCATIONS: ["lexico", "Combinación", true]
  };
  function ltCheck(text, done) {
    if (typeof fetch !== "function") return done(new Error("sin fetch"));
    var ctl = typeof AbortController === "function" ? new AbortController() : null;
    var timer = setTimeout(function () { if (ctl) ctl.abort(); }, 12000);
    var body = "text=" + encodeURIComponent(String(text).slice(0, 18000)) + "&language=pt-BR&motherTongue=es";
    fetch(LT_URL, { method: "POST", body: body, signal: ctl ? ctl.signal : undefined,
                    headers: { "Content-Type": "application/x-www-form-urlencoded" } })
      .then(function (r) { if (!r.ok) throw new Error("HTTP " + r.status); return r.json(); })
      .then(function (j) { clearTimeout(timer); done(null, (j && j.matches) || []); })
      .catch(function (e) { clearTimeout(timer); done(e); });
  }
  // LanguageTool's matches as findings on the same tokens, minus what the
  // local checker already said and what is noise for a learner.
  function fromLT(text, matches, local) {
    var tk = toks(text), taken = {};
    (local || []).forEach(function (f) { for (var j = 0; j < f.n; j++) taken[f.i + j] = 1; });
    var out = [];
    (matches || []).forEach(function (m) {
      var cat = (m.rule && m.rule.category && m.rule.category.id) || "";
      if (/WHITESPACE|DOUBLE_PUNCT|UNPAIRED/.test((m.rule && m.rule.id) || "")) return;
      var kind = LT_KIND[cat] || ["lt", "Revisar", true];
      var first = -1, n = 0;
      tk.forEach(function (t, i) {
        if (!t.w) return;
        if (t.at < m.offset + m.length && t.at + t.len > m.offset) { if (first < 0) first = i; n = i - first + 1; }
      });
      if (first < 0) return;
      for (var j = 0; j < n; j++) if (taken[first + j] && tk[first + j].w) return;
      var w = tk[first];
      if (cat === "TYPOS" && (w.cap && !w.start || known(w.w))) return;   // names and words of the course
      for (var q = 0; q < n; q++) taken[first + q] = 1;
      var rep = (m.replacements || []).slice(0, 2).map(function (r) { return "*" + r.value + "*"; }).join(" o ");
      out.push({ i: first, n: n, cat: kind[0], soft: kind[2], lt: true,
                 msg: kind[1] + " (LanguageTool): " + String(m.message || m.shortMessage || "").replace(/\s+/g, " ").trim() +
                      (rep ? " → " + rep : "") });
    });
    return out;
  }

  /* ------------------------------------------------------------ IA
     Optional: the learner's own free keys.  The client (providers, model
     ranking, reasoning off, streaming, which provider goes first) lives in
     the core, js/ia.js, the same for both languages; the prompts are here. */
  var IA = root.IA;
  var PROVIDERS = IA ? IA.PROVIDERS : [];
  // The error types of the clinic: the AI files each mistake under one of them.
  var AI_TYPES = {
    contraccion: "contracción obligatoria no hecha (em o → no, de ele → dele)", articulo: "artículo (forma, falta o sobra)",
    genero: "género de un sustantivo (heterogenéricos: o leite, a viagem)", plural: "plural de un sustantivo (-ões, -ães, -ãos, -is, -ns)",
    concordancia: "concordancia de adjetivos y determinantes", preposicion: "preposición", regencia: "verbo con su preposición (pensar em, assistir a, namorar)",
    muito: "muito / muy / mucho", gostar: "gostar de (calco de gustar)", a_personal: "«a» personal del castellano",
    perfeito_composto: "perfeito composto mal usado (tenho comido ≠ he comido)", subjuntivo: "subjuntivo presente o imperfecto",
    futuro_subj: "futuro do subjuntivo (quando eu for, se eu tiver)", inf_pessoal: "infinitivo pessoal (para eles saberem)",
    pronome: "pronombre (mim/eu, lhe/o, comigo…)", colocacao: "lugar del pronombre átono", crase: "crase (à, às)",
    ortografia: "ortografía", tilde: "tildes", espanol: "palabra o construcción del castellano", falso_amigo: "falso amigo",
    tempo: "tiempo verbal elegido", persona: "persona o número del verbo", participio: "participio (irregular, doble, concordancia)",
    verbo_irregular: "forma de verbo irregular", regularizacion: "irregular hecho regular (fazi, sabo, mais grande)",
    nasal: "nasales (ã, õ, -m final)", lexico: "palabra equivocada", orden: "orden de las palabras",
    faltante: "falta una palabra", sobrante: "sobra una palabra",
    estilo: "correcto pero poco natural (sugerencia, no error)"
  };
  function levelOf(week) { return week <= 8 ? "A1" : week <= 18 ? "A2" : week <= 30 ? "B1" : week <= 42 ? "B2" : "C1"; }
  // La norma de los pedidos a la IA sale de la tabla de registro de Diagnosi (la misma de las respuestas cerradas y de lint).
  var PB_NORM = D && D.REGISTRO && D.REGISTRO.prompt ? D.REGISTRO.prompt : "La referencia es el portugués de Brasil, norma urbana culta: la próclise del habla brasileña (me chamo, te amo), " +
    "«você» con verbo en tercera, «a gente» con verbo en singular, el artículo opcional ante posesivo, *em um* o *num*, son correctos; " +
    "lo coloquial (pra, tá, vi ele, tem por há) no es error en un texto informal, pero marcalo como \"estilo\" en uno formal. " +
    "No corrijas hacia el portugués europeo. Ortografía del Acuerdo de 1990 (ideia, voo, linguiça).";
  function aiPrompt(text, week, task, ctx) {
    return "Sos profesor de portugués de Brasil, nativo, para un hispanohablante rioplatense que está en la semana " + week +
      " de 52 de un curso hasta C1 (nivel actual aproximado: " + levelOf(week) + ").\n" +
      "Consigna del ejercicio: «" + (task ? task.t : "texto libre") + "»." +
      (task && task.use && task.use.length ? " Estructuras que tenía que usar: " + task.use.map(function (u) { return u[2]; }).join("; ") + "." : "") + "\n\n" +
      "Corregí su texto con mucho cuidado, oración por oración. Marcá TODOS los errores, sin dejar pasar ninguno: contracciones, " +
      "artículos, género, concordancia, persona y tiempo del verbo, futuro do subjuntivo, infinitivo pessoal, participios, pronombres, " +
      "preposiciones y regencia, crase, léxico, falsos amigos, castellano metido, ortografía, tildes y nasales, orden. " + PB_NORM + " " +
      "Lo que es correcto pero un brasileño no diría así, marcalo como \"estilo\". " +
      "No marques como error algo correcto solo porque se podría decir mejor, y no cambies el contenido. Corrección MÍNIMA: " +
      "arreglá cada error con el menor cambio posible y no reescribas el estilo (los correctores automáticos tienden a sobrecorregir; no lo hagas).\n" +
      "Cada error lleva un \"tipo\" de esta lista: " + Object.keys(AI_TYPES).map(function (k) { return k + " (" + AI_TYPES[k] + ")"; }).join(", ") + ".\n" +
      "Respondé SOLO con JSON: {\"errores\":[{\"mal\":\"fragmento EXACTO copiado del texto, lo más corto posible\"," +
      "\"bien\":\"la corrección de ese fragmento\",\"tipo\":\"uno de la lista\"," +
      "\"explicacion\":\"una o dos oraciones en castellano rioplatense: qué regla es y por qué, con el dato que le sirve para no repetirlo\"}]," +
      "\"corregido\":\"el texto completo corregido\",\"consigna\":\"una oración: si cumplió la consigna y usó bien las estructuras pedidas\"," +
      "\"comentario\":\"dos o tres oraciones de devolución en castellano: qué hizo bien y qué tiene que practicar\"}\n" +
      "Los errores van en el orden en que aparecen en el texto. Cada error se marca una sola vez: no repitas un error ni marques uno " +
      "adentro de otro (si en «Eu tengo 32 anos» y «muy» hay dos errores, van separados). Las explicaciones, la consigna y el " +
      "comentario van en castellano, con portugués solo en los ejemplos. El comentario habla del texto del alumno, no del corregido. " +
      "Antes de responder, revisá que cada explicación sea cierta." + ctxBlock(ctx, true) + "\n\nTexto:\n" + text;
  }
  /* A second teacher checks the first one's correction: drops what is not
     an error or is repeated, fixes wrong explanations, adds what was missed. */
  function reviewPrompt(text, week, task, data, evidence, ctx) {
    var ev = "";
    if (evidence && ((evidence.local || []).length || (evidence.lt || []).length)) {
      // A model cannot check its own work without outside evidence (Kamoi
      // et al. 2024): the rule checker and LanguageTool are that evidence.
      // The rule checker has no false alarms measured: its marks are sure,
      // and the learner sees them anyway (the correction is the union).
      ev = ((evidence.local || []).length ? "\nMarcas SEGURAS del corrector de reglas de la app (reglas revisadas, 0 falsas alarmas medidas; el alumno ya las ve): " +
          "no hace falta repetirlas; si creés que alguna NO es un error, incluila con \"contradice\": true y explicá por qué.\n" +
          evidence.local.slice(0, 12).map(function (m) { return "- " + m; }).join("\n") + "\n" : "") +
        ((evidence.lt || []).length ? "\nLanguageTool (verificá cada punto: puede tener falsos positivos, no lo copies a ciegas):\n" +
          evidence.lt.slice(0, 12).map(function (m) { return "- " + m; }).join("\n") + "\n" : "");
    }
    return "Sos un segundo profesor de portugués de Brasil, nativo, que revisa la corrección que un colega hizo del texto de un alumno " +
      "hispanohablante rioplatense (semana " + week + " de 52 de un curso hasta C1; consigna: «" + (task ? task.t : "texto libre") + "»).\n\n" +
      "Texto del alumno:\n" + text + "\n\nCorrección del colega (JSON):\n" + JSON.stringify(data) + "\n" + ev + "\n" +
      "Revisala y devolvé la versión buena:\n" +
      "1. Cada error tiene que ser un error de verdad en el portugués culto de Brasil; sacá los que no lo sean. " + PB_NORM + "\n" +
      "2. \"mal\" tiene que estar copiado EXACTO del texto del alumno, lo más corto posible.\n" +
      "3. Ningún error repetido ni uno adentro de otro: si un fragmento tiene dos errores, separalos en dos fragmentos cortos.\n" +
      "4. Cada explicación tiene que ser cierta y precisa, en castellano rioplatense, con portugués solo en los ejemplos; corregí las que estén mal.\n" +
      "5. El \"tipo\" tiene que ser el que corresponde de esta lista: " + Object.keys(AI_TYPES).join(", ") + ".\n" +
      "6. Agregá los errores que el colega no vio (la evidencia externa puede señalarlos; confirmalos vos).\n" +
      "6b. Corrección mínima: cada \"bien\" cambia lo menos posible; sacá las correcciones de estilo disfrazadas de error.\n" +
      "7. \"corregido\" tiene que tener todos los arreglos y nada más; \"consigna\" y \"comentario\" tienen que ser ciertos y hablar del texto del alumno.\n" +
      "Respondé SOLO con el JSON revisado, con el mismo formato." + ctxBlock(ctx, true);
  }
  // done(err, data, meta): meta says which provider and model corrected and which reviewed.
  function aiCheck(text, week, keys, done, onStage, opts) {
    var task = TASKS[week];
    opts = opts || {};
    llm(aiPrompt(text, week, task, opts.ctx), keys, function (err, data, meta) {
      if (err) return done(err);
      if (onStage) onStage("review", meta);
      // the evidence may still be on its way (LanguageTool): wait for it a moment
      var go = function (evidence) {
        llm(reviewPrompt(text, week, task, data, evidence, opts.ctx), keys, function (err2, data2, meta2) {
          var good = !err2 && data2 && Array.isArray(data2.errores);
          done(null, good ? data2 : data, { first: meta, review: good ? meta2 : null, evidence: !!evidence });
        });
      };
      if (typeof opts.evidence === "function") opts.evidence(go); else go(opts.evidence || null);
    });
  }

  /* Any exercise: why is my answer wrong (or is it right after all)? */
  function explainPrompt(x) {
    return "Sos profesor de portugués de Brasil para un hispanohablante rioplatense. Un alumno respondió un ejercicio de una app.\n" +
      "Consigna: " + (x.prompt || "") + "\nEnunciado: " + (x.stem || "") +
      (x.options && x.options.length ? "\nOpciones: " + x.options.join(" | ") : "") +
      "\nRespuesta del alumno: " + (x.given || "(vacía)") + "\nRespuesta que la app da por correcta: " + (x.answer || "") +
      (x.accept && x.accept.length > 1 ? "\nOtras respuestas que la app acepta: " + x.accept.join(" | ") : "") +
      (x.feedback ? "\nCorrección que mostró la app: " + x.feedback : "") +
      (x.diff ? "\nDiferencia exacta (calculada por la app, es un hecho): " + x.diff : "") +
      (x.note ? "\nNota del ejercicio (revisada, es la regla que aplica): " + x.note : "") +
      (x.stage === "mas" ? "\nEl alumno ya vio la solución y la explicación de la app, y pide que se lo expliques mejor: no repitas lo mismo con otras palabras; " +
        "da la regla de fondo, un contraste con el español y un ejemplo distinto del ejercicio." : "") +
      ctxBlock(x.ctx) +
      "\nNo inventes errores ni reglas: hablá solo del error que muestra la diferencia, todo en castellano rioplatense, sin comillas dobles ni HTML (las formas, entre *asteriscos*)." +
      "\n\nExplicale al alumno, en 2 a 4 oraciones en castellano rioplatense, qué está mal en su respuesta y cuál es la regla, " +
      "con un ejemplo corto en portugués. Si su respuesta en realidad también es correcta en el portugués de Brasil, o si la corrección de la app está mal o confunde, decilo claro.\n" +
      "No le des la razón por cortesía ni porque insista: «tambien_correcta» solo si su respuesta es portugués brasileño correcto y cumple la consigna; " +
      "ante la duda, mantené la corrección de la app y explicá por qué. Verificá la regla antes de afirmarla; si no estás seguro, decilo.\n" +
      "Respondé SOLO con JSON: {\"tambien_correcta\": true o false, \"app_equivocada\": true o false, \"explicacion\": \"...\"}";
  }
  function explain(x, keys, done) { llm(explainPrompt(x), keys, done); }

  /* Graded hints (dynamic assessment, Aljaafreh & Lantolf 1994; LearnLM
     2024): first an implicit nudge, then the rule as a question, and only
     then the explanation.  One request, revealed step by step. */
  function hintsPrompt(x) {
    return "Sos profesor de portugués de Brasil para un hispanohablante rioplatense. Tu método: no dar la respuesta de entrada; " +
      "primero una pista, después la regla como pregunta, y al final la explicación.\n" +
      "Consigna: " + (x.prompt || "") + "\nEnunciado: " + (x.stem || "") +
      (x.options && x.options.length ? "\nOpciones: " + x.options.join(" | ") : "") +
      "\nRespuesta del alumno: " + (x.given || "(vacía)") + "\nRespuesta correcta según la app: " + (x.answer || "") +
      (x.accept && x.accept.length > 1 ? "\nOtras respuestas aceptadas: " + x.accept.join(" | ") : "") +
      (x.diff ? "\nDiferencia exacta (calculada por la app, es un hecho): " + x.diff : "") +
      (x.note ? "\nNota del ejercicio (revisada, es la regla que aplica): " + x.note : "") +
      (x.feedback ? "\nLo que ya le dijo la app (su pista; no la repitas, sumá algo distinto): " + x.feedback : "") +
      ctxBlock(x.ctx) +
      "\n\nReglas estrictas:\n" +
      "- Todo en castellano rioplatense (vos), sin frases en portugués de Brasil salvo los ejemplos entre *asteriscos*.\n" +
      "- Hablá SOLO del error real: el que muestra la diferencia exacta. No inventes errores ni reglas; si la nota del ejercicio dice la regla, usala tal cual.\n" +
      "- Si la diferencia es solo de puntuación, espacios o mayúsculas, decí que la respuesta está bien.\n" +
      "- No uses comillas dobles ni HTML; para las formas en portugués de Brasil usá *asteriscos*.\n" +
      "pista1: una frase corta que señale DÓNDE está el problema (el hueco o la palabra), sin dar la respuesta.\n" +
      "pista2: una pregunta que apunte a la regla, sin dar la respuesta.\n" +
      "explicacion: 2 o 3 oraciones con la regla exacta y la forma correcta, con un ejemplo corto.\n" +
      "tambien_correcta: true solo si la respuesta del alumno es portugués de Brasil culto o coloquial aceptado y cumple la consigna; no le des la razón por cortesía.\n" +
      "Respondé SOLO con JSON: {\"pista1\": \"...\", \"pista2\": \"...\", \"explicacion\": \"...\", \"tambien_correcta\": true o false, \"app_equivocada\": true o false}";
  }
  function hints(x, keys, done) { llm(hintsPrompt(x), keys, done); }

  /* The judge of an answer the item did not foresee (P4.1): the rules
     fired on the vocabulary or the order, and they are not sure; before
     the verdict, is it correct and does it say the same?  With what the app
     said as evidence.  What the AI accepts is kept as a local variant. */
  function judgePrompt(x) {
    return "Sos profesor de portugués de Brasil para un hispanohablante rioplatense. Un alumno respondió un ejercicio de una app y su respuesta " +
      "no está entre las previstas. Decidí dos cosas: si es portugués de Brasil culto o coloquial aceptado correcto y si dice lo mismo que la respuesta esperada (cumple la consigna).\n" +
      "Consigna: " + (x.prompt || "") + "\nEnunciado: " + (x.stem || "") +
      "\nRespuesta esperada: " + (x.answer || "") +
      (x.accept && x.accept.length > 1 ? "\nOtras respuestas que la app acepta: " + x.accept.join(" | ") : "") +
      "\nRespuesta del alumno: " + (x.given || "") +
      (x.feedback ? "\nLo que dijo el corrector de reglas de la app (se equivoca a veces con sinónimos, el orden o formas no previstas): " + x.feedback : "") +
      ctxBlock(x.ctx) + "\n" + PB_NORM + " " +
      "No le des la razón por cortesía: si hay un error de gramática, de ortografía o el sentido cambia, es false. Ante la duda, false.\n" +
      "Respondé SOLO con JSON: {\"correcta\": true o false, \"mismo_sentido\": true o false, " +
      "\"explicacion\": \"una o dos oraciones en castellano rioplatense: por qué vale o qué tiene de malo, con las formas entre *asteriscos*\"}";
  }
  function judge(x, keys, done) { llm(judgePrompt(x), keys, done, { max: 300 }); }

  // The course and the learner, for any request (js/errores.js builds it).
  function ctxBlock(ctx, withFocus) {
    if (!ctx) return "";
    var E = root.Errores, t = typeof ctx === "string" ? ctx : E && E.promptCtx ? E.promptCtx(ctx) : "";
    var focus = withFocus && typeof ctx === "object" && E && E.focusCats ? E.focusCats(ctx) : null;
    if (focus && focus.length) t += "\nCorrección FOCALIZADA (el alumno es principiante): marcá todos los errores, pero cada uno lleva \"foco\": true si es de estas " +
      "categorías (" + focus.join(", ") + ") o impide entender, y \"foco\": false si no (la app los muestra plegados).";
    return t ? "\n\n" + t : "";
  }

  /* ------------------------------------------------------------ fala
     Role-play with a goal (Wang et al. 2025; Dugan et al. 2026): hard,
     measurable rules instead of a persona; a vocabulary list the reply
     must stay inside (the app measures the miss rate and asks for a
     rewrite); one recast and at most one note per turn. */
  function parlaScenarioPrompt(ctx) {
    return "Diseñá un role-play breve en portugués de Brasil para un hispanohablante rioplatense de nivel " + ctx.level + " (semana " + ctx.week +
      " de 52). Función de la semana: «" + ctx.fare + "». Tema: «" + ctx.tema + "». La situación pasa preferentemente en Río de Janeiro " +
      "(una feira, un boteco, la playa, el metrô, una roda de samba, una oficina pública…).\n" +
      "Reglas: el alumno tiene que conseguir TRES objetivos comunicativos concretos y verificables hablando con vos. " +
      "Vos hacés un personaje con un rol claro (vendedor, vecina, amigo, funcionario…), no un profesor. Frases de máximo " + ctx.maxWords + " palabras. " +
      "Usá solo estos tiempos verbales: " + ctx.tenses + ". " + PORTUGUES_PRIMEIRO + " El alumno conoce, entre otras: " + (ctx.words || []).slice(0, 100).join(", ") + ".\n" +
      "Respondé SOLO con JSON: {\"titolo\": \"título corto en portugués\", \"ruolo_ia\": \"quién sos, en portugués\", " +
      "\"situazione_es\": \"la situación explicada al alumno en castellano, 2 oraciones\", " +
      "\"obiettivi\": [\"objetivo 1 en castellano\", \"objetivo 2\", \"objetivo 3\"], " +
      "\"apertura\": \"tu primera frase en portugués, en personaje\", \"parole_utili\": [\"6 palabras o expresiones portuguesas útiles\"]}";
  }
  // Portuguese first: the vocabulary list is a preference, never a reason to
  // write broken Portuguese.
  var PORTUGUES_PRIMEIRO = "Tu portugués tiene que ser SIEMPRE correcto y natural, como lo diría un carioca culto: contracciones, artículos y concordancias bien " +
    "(no Rio, da praia, um rapaz, uma moça), mayúscula al empezar cada oración, frases completas con verbo, próclise brasileña (me chama, te vejo). " +
    "Preferí palabras simples y frecuentes, pero nunca sacrifiques la gramática ni el sentido por usar palabras más simples.";
  function parlaTurnPrompt(scen, history, userText, ctx, done) {
    var pending = scen.obiettivi.map(function (o, i) { return (done || []).indexOf(i + 1) < 0 ? (i + 1) + ") " + o : null; }).filter(Boolean);
    return "Seguís un role-play en portugués de Brasil con un alumno hispanohablante de nivel " + ctx.level + ". Tu personaje: " + scen.ruolo_ia +
      ". Situación: " + String(scen.situazione_es || "").replace(/\.\s*$/, "") + ". Objetivos del alumno: " + scen.obiettivi.map(function (o, i) { return (i + 1) + ") " + o; }).join(" ") +
      (pending.length ? ". Todavía le faltan: " + pending.join(" ") : "") + "\n" +
      "Cómo conversar: respondé primero a lo que el alumno acaba de decir o preguntar (si te pregunta algo, contestalo en personaje, con un dato concreto); " +
      "no repitas lo que ya dijiste antes; mantené el hilo de la situación; terminá con UNA pregunta simple que lo acerque a un objetivo pendiente. " +
      "Si el alumno escribe algo raro o fuera de tema, reaccioná con naturalidad y volvé a la situación.\n" +
      "Reglas: en personaje, en portugués de Brasil, máximo " + ctx.maxWords + " palabras, solo estos tiempos: " + ctx.tenses + ". " + PORTUGUES_PRIMEIRO +
      " El alumno conoce, entre otras, estas palabras: " + (ctx.words || []).slice(0, 100).join(", ") + ".\n" +
      "No corrijas dentro del diálogo. En \"recast\" dá la frase del alumno corregida con el cambio mínimo (o \"\" si estaba bien); fijate también en las " +
      "palabras españolas y en los falsos amigos que cambian el sentido (polvo = pulpo / pó; esquisito = raro / gostoso; embaraçada = avergonzada / grávida). En \"nota_es\", UNA observación " +
      "breve en castellano sobre el error más importante (o vacío); no inventes reglas.\n" +
      "Objetivos: un objetivo está cumplido si el alumno lo logró de forma comprensible, aunque sea con errores.\n" +
      "Conversación hasta ahora:\n" + history.map(function (h) { return (h[0] === "ia" ? "Personaje: " : "Alumno: ") + h[1]; }).join("\n") +
      "\nAlumno: " + userText + "\n\n" +
      "Respondé SOLO con JSON: {\"risposta\": \"tu turno en portugués\", \"recast\": \"la frase del alumno corregida, o \\\"\\\" si estaba bien\", " +
      "\"nota_es\": \"una observación o vacío\", \"obiettivi_raggiunti\": [números de TODOS los objetivos cumplidos por el alumno hasta ahora], \"fine\": true si los tres objetivos están cumplidos}";
  }
  // Only the hard words, by simpler synonyms: the sentence stays Portuguese.
  function parlaRewritePrompt(reply, miss) {
    return "Reescreva esta fala em português do Brasil simples, trocando por sinônimos mais comuns só estas palavras difíceis: " + miss.join(", ") +
      ". Mesmo sentido, frase completa e gramaticalmente perfeita (contrações, artigos, concordância, maiúscula inicial), no máximo 25 palavras. " +
      "Fala: «" + reply + "». Responda SÓ com JSON: {\"risposta\": \"...\"}";
  }
  /* The learner's sentences reviewed at the end, all together, by a second
     request that does only that. */
  function parlaReviewPrompt(scen, history) {
    var mine = history.map(function (h, i) { return h[0] === "me" ? i : -1; }).filter(function (i) { return i >= 0; });
    return "Sos profesor de portugués de Brasil. Un alumno hispanohablante escribió estas frases en un role-play (situación: " + scen.situazione_es + ").\n" +
      "Conversación:\n" + history.map(function (h, i) { return (h[0] === "ia" ? "Personaje: " : "Alumno [" + i + "]: ") + h[1]; }).join("\n") + "\n\n" +
      "Revisá cada frase del alumno. Corrección mínima: cambiá solo lo que está mal, no reescribas lo que ya es correcto. Mirá contracciones, " +
      "artículos, concordancia, ortografía y tildes, el español metido (muy, tengo, pero, también) y sobre todo las palabras que cambian el sentido " +
      "(polvo = pulpo; esquisito = raro; largo = ancho; rato = ratón). " + PB_NORM + " Si la frase está bien, \"ok\": true. No inventes reglas.\n" +
      "Respondé SOLO con JSON: {\"frasi\": [{\"i\": número de la frase, \"ok\": true o false, \"corretta\": \"la frase corregida\", " +
      "\"nota\": \"una observación breve en castellano rioplatense, o vacío\", \"tipo\": \"el tipo del error principal, uno de: " + Object.keys(AI_TYPES).join(", ") + "\"}]} con una entrada para cada una de estas frases: " + mine.join(", ");
  }
  /* The turn as a chat: the rules, the character and the goals go in the
     system message (the same every turn, so the provider can reuse it), the
     conversation as real turns, and the format with the learner's message. */
  function parlaTurnChat(scen, history, userText, ctx, done) {
    var full = parlaTurnPrompt(scen, [], "", ctx, done);
    var cut = full.indexOf("Conversación hasta ahora:"), at = full.indexOf("Respondé SOLO con JSON");
    var rules = cut > 0 ? full.slice(0, cut).trim() : full, fmt = at > 0 ? full.slice(at) : "";
    var msgs = [{ role: "user", content: "(Empieza el role-play.)" }];
    history.forEach(function (h) {
      var text = String(h[1] || "");
      if (h[0] === "ia" && /^\(/.test(text)) return;                 // avisos de la app, no del personaje
      var role = h[0] === "ia" ? "assistant" : "user", last = msgs[msgs.length - 1];
      if (last.role === role) last.content += "\n" + text; else msgs.push({ role: role, content: text });
    });
    if (msgs[msgs.length - 1].role === "user") msgs[msgs.length - 1].content += "\n" + userText; else msgs.push({ role: "user", content: userText });
    // first what the learner just said (so the reply answers it), then the reply
    fmt = fmt.replace('{\"risposta\"', '{\"capito\": \"en castellano y en pocas palabras, qué dijo, pidió o preguntó el alumno en su ÚLTIMO mensaje\", \"risposta\"');
    return { system: rules + "\nCada mensaje del alumno llega como un turno. Tu \"risposta\" responde a ESE mensaje: si pregunta, contestá con un dato concreto; si pide algo, dáselo o negocialo en personaje; si cuenta algo, reaccioná a eso. Nunca sigas un guion propio ignorando lo que escribió.\n" + fmt, messages: msgs };
  }
  /* Which goals the learner has reached, judged apart from the reply (the
     role-play model, busy being the character, often forgot to mark them). */
  function parlaGoalsPrompt(scen, history) {
    return "Sos profesor de portugués. Un alumno hispanohablante hace un role-play escrito. Situación: " + String(scen.situazione_es || "") + "\n" +
      "Sus objetivos:\n" + scen.obiettivi.map(function (o, i) { return (i + 1) + ") " + o; }).join("\n") + "\n\n" +
      "Conversación:\n" + history.map(function (h) { return (h[0] === "ia" ? "Personaje: " : "Alumno: ") + h[1]; }).join("\n") + "\n\n" +
      "¿Qué objetivos ya cumplió el alumno con lo que ÉL escribió? Un objetivo está cumplido si lo intentó de forma comprensible, aunque tenga errores de " +
      "gramática o use palabras del español; no hace falta que use palabras exactas. No cuenta lo que dijo el personaje.\n" +
      "Respondé SOLO con JSON: {\"cumplidos\": [números], \"motivo\": \"una frase en castellano\"}";
  }
  function parlaGoals(scen, history, keys, done) { llm(parlaGoalsPrompt(scen, history), keys, done, { max: 200 }); }
  function parlaStart(ctx, keys, done) { llm(parlaScenarioPrompt(ctx), keys, done, { max: 900 }); }
  // opts.stream: the character's line as it is being written (the app shows it live).
  function parlaTurn(scen, history, userText, ctx, keys, done, reached, opts) {
    opts = opts || {};
    llm(parlaTurnChat(scen, history, userText, ctx, reached), keys, done, { stream: opts.stream, max: 600, hedge: opts.hedge || 8000, temperature: 0.5 });
  }
  function parlaRewrite(reply, miss, keys, done) { llm(parlaRewritePrompt(reply, miss), keys, done, { max: 300 }); }
  function parlaReview(scen, history, keys, done) { llm(parlaReviewPrompt(scen, history), keys, done, { think: "low" }); }

  /* ------------------------------------------------------- história
     A short story built on the words due for review plus what the learner
     already knows (SRS-Stories, Kamzela, Lango & Dušek 2025): the app
     measures the miss rate and asks for a rewrite when it is too high. */
  function storiaPrompt(ctx) {
    return "Escribí un cuento corto en portugués de Brasil para un hispanohablante de nivel " + ctx.level + " (semana " + ctx.week + " de 52; tema de la semana: «" +
      ctx.tema + "»). Tres párrafos, " + ctx.words + " palabras en total, frases cortas, gramática de estos tiempos solamente: " + ctx.tenses + ".\n" +
      "OBLIGATORIO: usá cada una de estas palabras al menos una vez (son las que el alumno tiene que repasar): " + (ctx.targets || []).join(", ") + ".\n" +
      "Una historia de verdad, que pase en Río de Janeiro o en otra región de Brasil: personajes con nombre, un problema y un final; que cada oración siga a la anterior. " + PORTUGUES_PRIMEIRO + "\n" +
      "Vocabulario: preferí palabras muy frecuentes y estas, que el alumno ya conoce: " + (ctx.known || []).join(", ") + ". " +
      "Como máximo " + ctx.maxNew + " palabras que no sean frecuentes, y ponelas en el glosario.\n" +
      "Respondé SOLO con JSON: {\"titolo\": \"...\", \"testo\": \"párrafo uno\\n\\npárrafo dos\\n\\npárrafo tres\", " +
      "\"glossario\": [[\"palabra portuguesa tal como aparece\", \"significado en castellano\"], ...], " +
      "\"domande\": [[\"pregunta de comprensión en castellano\", [\"opción correcta\", \"distractor\", \"distractor\", \"distractor\"], \"opción correcta\"], ...3 preguntas]}";
  }
  function storiaRewritePrompt(text, miss) {
    return "Reescreva este texto em português do Brasil trocando por sinônimos mais comuns estas palavras, difíceis demais para o aluno: " + miss.join(", ") +
      ". Todo o resto continua igual. O texto tem que continuar correto e natural: contrações, artigos e concordância certos, " +
      "maiúscula no começo de cada frase, a mesma história. Texto:\n" + text +
      "\nResponda SÓ com JSON: {\"testo\": \"...\"}";
  }
  // The errors the local checker found, fixed with the minimal change.
  function correggiPrompt(text, errs) {
    return "Corrija SÓ estes erros no texto em português do Brasil, com a mudança mínima, sem mexer no resto: " + errs.join(" | ") +
      ". Confira também as maiúsculas no começo das frases, as contrações e a concordância artigo-substantivo. Texto:\n" + text + "\nResponda SÓ com JSON: {\"testo\": \"...\"}";
  }
  function correggi(text, errs, keys, done) { llm(correggiPrompt(text, errs), keys, done); }
  function storia(ctx, keys, done) { llm(storiaPrompt(ctx), keys, done); }

  /* The written part of the final exam, graded like the Celpe-Bras
     (Avançado Superior): adequação ao contexto, adequação discursiva,
     adequação linguística (gramática) y léxico, 0-5 each.  The JSON keeps
     the keys app.js reads (punteggi, commento, errori). */
  function esamePrompt(task, text) {
    var rub = (task.rubric || []).map(function (r) { return "- " + r[0] + ": " + r[1]; }).join("\n");
    return "Sos examinador del Celpe-Bras (Certificado de Proficiência em Língua Portuguesa para Estrangeiros), nivel Avançado Superior, " +
      "equivalente a un C1. Un candidato hispanohablante escribió este texto.\n" +
      "Consigna: " + task.t + "\nExtensión pedida: unas " + task.words + " palabras.\n\nTexto:\n" + text + "\n\n" +
      "Evaluá con la grilla de la Produção Escrita del Celpe-Bras, de 0 a 5 cada criterio:\n" +
      "- contexto (adequação ao contexto): cumple el propósito comunicativo, el género textual, el enunciador y el interlocutor pedidos, con la información necesaria;\n" +
      "- discursiva (adequação discursiva): coherencia y cohesión, progresión de las ideas, párrafos, conectores;\n" +
      "- linguistica (adequação linguística): gramática del portugués de Brasil (contracciones, concordancia, tiempos y modos, regencia, crase, colocación pronominal); un Avançado Superior tolera muy pocos errores y ninguno que moleste la lectura;\n" +
      "- lexico: variedad, precisión y adecuación al registro; sin español ni falsos amigos.\n" +
      (rub ? "Descriptores de esta tarea:\n" + rub + "\n" : "") +
      "Sé exigente y justo: un texto de nivel intermedio no pasa de 2 en linguistica y lexico. " + PB_NORM + " " +
      "Listá los errores más importantes (máximo 8) con su corrección mínima.\n" +
      "Respondé SOLO con JSON: {\"punteggi\": {\"contexto\": 0-5, \"discursiva\": 0-5, \"linguistica\": 0-5, \"lexico\": 0-5}, " +
      "\"commento\": \"3 oraciones en castellano rioplatense: qué está bien, qué le falta para el Avançado Superior\", \"errori\": [[\"fragmento mal\", \"corrección\"], ...]}";
  }
  function esame(task, text, keys, done) { llm(esamePrompt(task, text), keys, done); }
  function storiaRewrite(text, miss, keys, done) { llm(storiaRewritePrompt(text, miss), keys, done); }

  // Every request goes through the core client (js/ia.js).
  function llm(prompt, keys, done, opts) {
    if (!IA) return done(new Error("sin cliente de IA"));
    return IA.llm(prompt, keys, done, opts);
  }

  /* The AI's errors as findings on the text's tokens, to add to the local
     ones (the union: C8).  Each one carries bad (the fragment as written),
     good (the AI's correction), why (its explanation) and level.  What the
     local checker already marked is not repeated, but when the AI proposes
     another correction for it, or says it is not an error («contradice»),
     both are shown (conflict).  A fragment not found word for word is looked
     for without accents and punctuation, and if it is not there, it is still
     listed (unplaced), never dropped.  foco: false (A1-A2) → minor, folded. */
  // Where a fragment starts as whole words (*em* is not the end of *Ontem*).
  function wordAt(hay, needle, from) {
    var L = /[a-zà-ÿ0-9]/i, at = hay.indexOf(needle, from);
    while (at >= 0) {
      var before = at > 0 ? hay.charAt(at - 1) : "", after = hay.charAt(at + needle.length);
      if ((!before || !L.test(before) || !L.test(needle.charAt(0))) && (!after || !L.test(after) || !L.test(needle.charAt(needle.length - 1)))) return at;
      at = hay.indexOf(needle, at + 1);
    }
    return -1;
  }
  function fromAI(text, data, local) {
    var src = String(text).normalize("NFC").replace(/[’‘`´]/g, "'"), tk = toks(text), taken = {}, low = src.toLowerCase(), from = 0, out = [];
    var loose = function (x) { return String(x).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase(); };
    var looseLow = loose(low);
    var locAt = {};
    (local || []).forEach(function (f) { if (!f.lt && !f.ai) for (var j = 0; j < f.n; j++) { taken[f.i + j] = 1; locAt[f.i + j] = f; } });
    ((data && data.errores) || []).forEach(function (e) {
      var bad = String(e.mal || "").normalize("NFC").replace(/[’‘`´]/g, "'").trim();
      var good = String(e.bien == null ? "" : e.bien).normalize("NFC").replace(/[’‘`´]/g, "'").trim();
      var contra = e.contradice === true;
      if (!bad || (!contra && good.toLowerCase() === bad.toLowerCase())) return;
      var at = wordAt(low, bad.toLowerCase(), from);
      if (at < 0) at = wordAt(low, bad.toLowerCase(), 0);
      if (at < 0) {   // the same without accents (same length: the offsets hold)
        var lb = loose(bad);
        if (lb.length === bad.length) at = wordAt(looseLow, lb, 0);
      }
      var tipo = String(e.tipo || "").trim().toLowerCase(), soft = tipo === "estilo";
      var why = String(e.explicacion || "").trim();
      var f = { cat: AI_TYPES[tipo] && !soft ? tipo : soft ? "estilo" : "ia", soft: soft, ai: true, bad: bad, good: e.bien == null ? null : good,
                why: why, level: soft ? "poco_natural" : "wrong", minor: e.foco === false,
                msg: (e.bien != null && !contra ? "*" + bad + "* → *" + (good || "(se borra)") + "*. " : "") + (soft ? "(Más natural) " : "") + why };
      var first = -1, n = 0;
      if (at >= 0) tk.forEach(function (t, i) { if (t.w && t.at < at + bad.length && t.at + t.len > at) { if (first < 0) first = i; n = i - first + 1; } });
      if (first < 0) { f.i = -1; f.n = 0; f.unplaced = true; out.push(f); return; }
      from = at + bad.length;
      f.i = first; f.n = n;
      var dup = true, j;
      for (j = 0; j < n; j++) if (!taken[first + j]) dup = false;
      if (dup) {
        // over a local mark: agreement is silence; another correction or a «no es error», both shown
        var lf = locAt[first], lg = lf && lf.good != null ? String(lf.good).toLowerCase() : null;
        if (!lf || (!contra && (lg == null || lg === good.toLowerCase()))) return;
        f.conflict = true; f.soft = true; f.minor = false;
        f.msg = (contra ? "🤖 La IA no lo ve como error: " : "🤖 La IA propone otra corrección: *" + (good || "(se borra)") + "*. ") + why;
        out.push(f);
        return;
      }
      for (j = 0; j < n; j++) taken[first + j] = 1;
      out.push(f);
    });
    out.sort(function (x, y) { return (x.i < 0 ? 1e9 : x.i) - (y.i < 0 ? 1e9 : y.i); });
    return out;
  }

  function weeks() { return Object.keys(TASKS).map(Number); }

  var api = { TASKS: TASKS, features: features, lint: lint, check: check, markup: markup, weeks: weeks, toks: toks,
              learn: learn, learnCourse: learnCourse, ltCheck: ltCheck, fromLT: fromLT,
              aiCheck: aiCheck, fromAI: fromAI, aiPrompt: aiPrompt, explain: explain, explainPrompt: explainPrompt, reviewPrompt: reviewPrompt,
              hints: hints, hintsPrompt: hintsPrompt, judge: judge, judgePrompt: judgePrompt, ctxBlock: ctxBlock, parlaStart: parlaStart, parlaTurn: parlaTurn, parlaRewrite: parlaRewrite, parlaReview: parlaReview, parlaReviewPrompt: parlaReviewPrompt, correggi: correggi,
              parlaScenarioPrompt: parlaScenarioPrompt, parlaTurnPrompt: parlaTurnPrompt, parlaTurnChat: parlaTurnChat, parlaGoals: parlaGoals, parlaGoalsPrompt: parlaGoalsPrompt, storia: storia, storiaRewrite: storiaRewrite, storiaPrompt: storiaPrompt, esame: esame, esamePrompt: esamePrompt, PROVIDERS: PROVIDERS, AI_TYPES: AI_TYPES };
  api.llm = llm;   // la reformulación de escritura_plus.js usa las mismas claves y proveedores
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.Scrivi = api;
})(typeof window !== "undefined" ? window : globalThis);
