/* Datos de escucha y fonética del portugués de Brasil para hispanohablantes:
   pares mínimos (HVPT), habla conectada, entonación y acento tónico.  Solo
   datos; la lógica está en suoni.js.  El audio lo produce el TTS pt-BR del
   teléfono (y, para las palabras sueltas, grabaciones reales de Lingua Libre:
   voci.js).  `say` es texto plano que el TTS lee bien.

   Todos los pares se escriben distinto (avó / avô, pôde / pode, sonho /
   sono): así la opción que ve el alumno es la palabra misma y la grabación
   real se puede buscar por su nombre.  Los pares de homófonos que el español
   haría esperar distintos (mal / mau, alto / auto, calda / cauda: en Brasil
   suenan igual) no sirven para elegir de oído; se explican en las notas.

   Categorías (clave → CAT_ES en suoni.js): vogais (é/ê, ó/ô), nasais,
   palatais (lh, nh), sibilantes (s sonora / sorda), chiadas (ch, x, j),
   tidi (ti, di, te, de que suenan «chi», «yi»), erres (r suave, rr y r
   inicial aspiradas), labiais (v / b), atonas (e, o finales y el acento
   del verbo: falo / falou), lfinal (-l que suena u) y tonica (sábia /
   sabia / sabiá). */
(function (root) {
  "use strict";

  function P(id, cat, week, a, b, esA, esB, note, written) {
    var o = { id: id, cat: cat, week: week, a: a, b: b, es: [esA, esB], note: note };
    if (written) o.written = written;
    return o;
  }
  var VOG = "é y ó son abiertas (boca más abierta, como en «perro», «sol» pero más); ê y ô, cerradas. El español tiene una sola e y una sola o: acá cambian la palabra.";
  var NAS = "La vocal nasal suena también por la nariz y no termina en una n ni una m que se oiga: «mão» no es «man».";
  var LH = "lh es una sola consonante palatal, como la «ll» de «calle» pronunciada a la antigua (la lengua pegada al paladar), nunca «l» ni «li».";
  var NH = "nh es la ñ: sonho = «soño».";
  var SZ = "Entre vocales, una s sola suena z (zumbido, como una abeja); ss, ç y c suenan s. El español no tiene esa z sonora.";
  var CHJ = "ch y x suenan «sh» (sin la t de la ch española); j y g ante e, i suenan como la «y» de «yo» en un rioplatense que la hace zumbar: sonora, no la «sh» sorda que muchos porteños hacen en «calle».";
  var TIDI = "En casi todo Brasil ti y di suenan «chi» y «yi» (con un toque de d); también la te y la de finales: leite = «leichi», tarde = «tárdji».";
  var RR = "r entre vocales es un toque suave, como en español (caro); rr y r inicial suenan como una j suave, aspirada: carro = «caju», Rio = «Jío».";
  var VB = "La v portuguesa es labiodental (los dientes de arriba tocan el labio de abajo) y la b, bilabial. El español las confunde; el portugués no.";
  var ATO = "Al final de la palabra, la e átona suena casi «i» y la o átona casi «u»: lo que las distingue es dónde cae el acento. come = «cómi», comi = «comí».";
  var PERF = "El presente (eu falo) carga el acento en la raíz y la -o final suena «u»; el perfeito (ele falou) lo carga al final, en una ô cerrada.";
  var LFIN = "La l al final de sílaba suena u en Brasil: mal = «mau», Brasil = «Brasiu». Por eso mal y mau, alto y auto suenan igual.";
  var TON = "Mismas letras, otra sílaba fuerte, otra palabra. La tilde escrita marca la sílaba tónica.";
  var PAIRS = [
    // ------------------------------------------------------------ vogais
    P("p-001", "vogais", 1, "avó", "avô", "abuela", "abuelo", "avó con ó abierta es la abuela; avô con ô cerrada, el abuelo."),
    P("p-002", "vogais", 1, "vovó", "vovô", "abuela (familiar)", "abuelo (familiar)", VOG),
    P("p-003", "vogais", 1, "é", "e", "es (ser)", "y", "é (es) es una e abierta y tónica; e (y) es átona y suena casi «i»."),
    P("p-004", "vogais", 1, "só", "sou", "solo", "soy", "só con ó abierta; sou con ô cerrada (la u casi no se oye)."),
    P("p-005", "vogais", 2, "céu", "seu", "cielo", "tu, su (de você)", "céu con é abierta; seu con ê cerrada."),
    P("p-006", "vogais", 2, "nós", "nos", "nosotros", "nos (pronombre)", "nós es tónico, con ó abierta; nos es átono y suena «nus»."),
    P("p-007", "vogais", 2, "pé", "pê", "pie", "la letra p", VOG),
    P("p-008", "vogais", 3, "nó", "no", "nudo", "en el (em + o)", "nó con ó abierta; no (em + o) es átono y suena «nu»."),
    P("p-009", "vogais", 4, "mel", "meu", "miel", "mi, mío", "mel: é abierta y l que suena u («méu»); meu: ê cerrada."),
    P("p-010", "vogais", 5, "bebê", "bebe", "bebé", "bebe", "bebê es aguda, con ê cerrada; bebe es llana, con é abierta y la e final como «i»."),
    P("p-011", "vogais", 5, "sol", "sou", "sol", "soy", "sol: ó abierta y la l suena u; sou: ô cerrada."),
    P("p-012", "vogais", 6, "dó", "dou", "lástima; do (nota)", "doy", VOG),
    P("p-013", "vogais", 6, "vó", "vou", "abuela (coloquial)", "voy", VOG),
    P("p-014", "vogais", 6, "pôr", "por", "poner", "por", "pôr lleva ô cerrada y tónica; por es átona y suena «pur»."),
    P("p-015", "vogais", 8, "sé", "se", "sede, catedral (a Sé)", "se; si", "sé con é abierta y tónica; se es átona y suena «si»."),
    P("p-016", "vogais", 10, "bisavó", "bisavô", "bisabuela", "bisabuelo", VOG),
    P("p-017", "vogais", 10, "avós", "avôs", "abuelas; los abuelos", "abuelos (varones)", "os avós (ó abierta) son los abuelos en general o las abuelas; os avôs, solo los abuelos varones."),
    P("p-018", "vogais", 11, "pôde", "pode", "pudo", "puede", "pôde (pasado) con ô cerrada; pode (presente) con ó abierta. El circunflejo está justo para distinguirlas."),
    P("p-019", "vogais", 11, "pôs", "pós", "puso", "posgrado; pos-", VOG),
    // ------------------------------------------------------------ nasais
    P("p-020", "nasais", 1, "mão", "mau", "mano", "malo", NAS),
    P("p-021", "nasais", 1, "pão", "pau", "pan", "palo", NAS),
    P("p-022", "nasais", 1, "lã", "lá", "lana", "allá", NAS),
    P("p-023", "nasais", 1, "sim", "sem", "sí", "sin", "sim, con i nasal; sem, con e nasal («sẽi»). En las dos la m final no cierra los labios."),
    P("p-024", "nasais", 1, "som", "sou", "sonido", "soy", NAS),
    P("p-025", "nasais", 1, "irmã", "irmão", "hermana", "hermano", "ã sola contra ão: el diptongo nasal termina cerrándose hacia la u."),
    P("p-026", "nasais", 2, "são", "sal", "son; sano", "sal", "são es nasal; sal es oral y suena «sau»."),
    P("p-027", "nasais", 3, "mundo", "mudo", "mundo", "mudo", NAS),
    P("p-028", "nasais", 4, "grão", "grau", "grano", "grado", NAS),
    P("p-029", "nasais", 4, "cão", "cal", "perro", "cal", "cão es nasal; cal suena «cau», oral."),
    P("p-030", "nasais", 4, "manto", "mato", "manto", "monte, yuyos", NAS),
    P("p-031", "nasais", 5, "tanto", "tato", "tanto", "tacto", NAS),
    P("p-032", "nasais", 6, "tão", "tal", "tan", "tal", NAS),
    P("p-033", "nasais", 6, "sem", "sei", "sin", "sé (saber)", "sem es un diptongo nasal («sẽi»); sei, oral."),
    P("p-034", "nasais", 6, "minto", "mito", "miento", "mito", NAS),
    P("p-035", "nasais", 6, "cinto", "cito", "cinturón", "cito", NAS),
    P("p-036", "nasais", 6, "dom", "dou", "don, talento", "doy", NAS),
    P("p-037", "nasais", 7, "cem", "céu", "cien", "cielo", "cem, nasal («sẽi»); céu, oral y con é abierta."),
    P("p-038", "nasais", 8, "canta", "cata", "canta", "junta, recoge (catar)", NAS),
    P("p-039", "nasais", 9, "ponte", "pote", "puente", "pote, frasco", "ponte es nasal y la te suena «chi»; pote, oral con ó abierta."),
    P("p-040", "nasais", 11, "vim", "vi", "vine", "vi", "vim (de vir) con i nasal; vi (de ver), oral."),
    P("p-041", "nasais", 12, "rim", "ri", "riñón", "se ríe", NAS),
    P("p-042", "nasais", 12, "mente", "mete", "mente; miente", "mete", NAS),
    P("p-043", "nasais", 12, "vã", "vá", "vana", "vaya (imperativo de ir)", NAS),
    P("p-044", "nasais", 14, "fã", "fá", "fan", "fa (nota musical)", NAS),
    P("p-045", "nasais", 16, "mim", "mi", "mí (para mim)", "mi (nota musical)", "para mim: la i es nasal y los labios no llegan a cerrar una m."),
    P("p-046", "nasais", 17, "vento", "veto", "viento", "veto", NAS),
    P("p-047", "nasais", 20, "tumba", "tuba", "tumba", "tuba", NAS),
    P("p-048", "nasais", 22, "lindo", "lido", "lindo", "leído", NAS),
    // ----------------------------------------------------------- palatais
    P("p-049", "palatais", 1, "filha", "fila", "hija", "fila", LH),
    P("p-050", "palatais", 1, "minha", "mina", "mía, mi (fem.)", "mina; chica (coloquial)", NH),
    P("p-051", "palatais", 2, "galho", "galo", "rama", "gallo", "Ojo: el gallo es galo, con una l; galho es la rama."),
    P("p-052", "palatais", 2, "telha", "tela", "teja", "pantalla, tela", LH),
    P("p-053", "palatais", 3, "sonho", "sono", "sueño (lo que soñás)", "sueño (ganas de dormir)", "sonho es lo que soñás; sono, las ganas de dormir: estou com sono."),
    P("p-054", "palatais", 3, "bolha", "bola", "burbuja, ampolla", "pelota", LH),
    P("p-055", "palatais", 4, "velha", "vela", "vieja", "vela", LH),
    P("p-056", "palatais", 5, "palha", "pala", "paja", "visera", LH),
    P("p-057", "palatais", 5, "falha", "fala", "falla", "habla", LH),
    P("p-058", "palatais", 7, "julho", "Júlio", "julio (el mes)", "Julio (el nombre)", "lh no es «li»: julho (el mes) tiene una sola sílaba final; Júlio, dos (-li-o)."),
    P("p-059", "palatais", 8, "calha", "cala", "canaleta", "calla", LH),
    P("p-060", "palatais", 8, "sonha", "Sônia", "sueña", "Sonia", "nh (una sola consonante, «soña») contra ni (dos sonidos, «Sô-nia»). En ambas la o es cerrada y nasalizada: la diferencia está en nh contra ni."),
    P("p-061", "palatais", 9, "malha", "mala", "malla, tejido", "valija", LH),
    P("p-062", "palatais", 10, "filho", "filo", "hijo", "filo (biología)", LH),
    P("p-063", "palatais", 10, "manha", "mana", "berrinche", "hermana (coloquial)", NH),
    P("p-064", "palatais", 12, "olho", "óleo", "ojo", "aceite", "lh no es «li»: olho (ojo) tiene dos sílabas; óleo (aceite), tres."),
    P("p-065", "palatais", 16, "senha", "sena", "contraseña", "sena (la Mega-Sena)", NH),
    P("p-066", "palatais", 18, "pinho", "pino", "pino (el árbol, la madera)", "perno, clavija", "Ojo: el pino es pinho, con nh; pino es un perno."),
    // --------------------------------------------------------- sibilantes
    P("p-067", "sibilantes", 1, "casa", "caça", "casa", "caza", "casa suena «caza» (s sonora, zumbido); caça, con s sorda. Justo al revés de lo que espera el oído rioplatense."),
    P("p-068", "sibilantes", 4, "rosa", "roça", "rosa", "chacra, campo", SZ),
    P("p-069", "sibilantes", 5, "asa", "assa", "ala", "asa (de assar)", SZ),
    P("p-070", "sibilantes", 6, "presa", "pressa", "presa", "prisa", "presa con s sonora; pressa con ss sorda (y é abierta)."),
    P("p-071", "sibilantes", 6, "ouso", "ouço", "me atrevo", "oigo", SZ),
    P("p-072", "sibilantes", 7, "doze", "doce", "doce (12)", "dulce", "¡Al revés que en español! doze (12) con z sonora; doce (dulce) con s sorda."),
    P("p-073", "sibilantes", 7, "zinco", "cinco", "cinc", "cinco", SZ),
    P("p-074", "sibilantes", 9, "zelo", "selo", "celo, cuidado", "sello, estampilla", SZ),
    P("p-075", "sibilantes", 14, "casar", "caçar", "casarse", "cazar", SZ),
    P("p-076", "sibilantes", 18, "azar", "assar", "mala suerte", "asar", "azar (mala suerte, no «casualidad») con z sonora; assar con ss sorda."),
    P("p-077", "sibilantes", 19, "preso", "preço", "preso", "precio", SZ),
    P("p-078", "sibilantes", 19, "rasa", "raça", "rasa, poco profunda", "raza", SZ),
    // ------------------------------------------------------------ chiadas
    P("p-079", "chiadas", 1, "chá", "já", "té", "ya", "chá suena como la «sh» de «show», sorda; já, como la «y» de «yo» en un rioplatense que la hace zumbar, sonora."),
    P("p-080", "chiadas", 2, "queixo", "queijo", "mentón", "queso", CHJ),
    P("p-081", "chiadas", 3, "chão", "são", "piso, suelo", "son; sano", "ch es «sh», no s: chão ≠ são."),
    P("p-082", "chiadas", 8, "chato", "jato", "aburrido, pesado", "chorro; jet", CHJ),
    P("p-083", "chiadas", 14, "acho", "ajo", "creo; encuentro", "actúo (agir)", CHJ),
    P("p-084", "chiadas", 14, "acha", "assa", "cree; encuentra", "asa (de assar)", "ch es «sh»: acha ≠ assa."),
    P("p-085", "chiadas", 14, "cheio", "seio", "lleno", "seno", "ch es «sh»: cheio ≠ seio."),
    P("p-086", "chiadas", 17, "gelo", "zelo", "hielo", "celo, cuidado", "g ante e suena como la «y» zumbada de «yo», sonora; z, como un zumbido. gelo ≠ zelo."),
    // --------------------------------------------------------------- tidi
    P("p-087", "tidi", 1, "tia", "chia", "tía", "chía (semilla); chirría", "tia suena «chía», con un golpecito de t; chia, «shía», sin t."),
    P("p-088", "tidi", 1, "dia", "tia", "día", "tía", "dia suena «yía» (sonora); tia, «chía» (sorda)."),
    P("p-089", "tidi", 4, "tina", "China", "tina", "China", TIDI),
    P("p-090", "tidi", 6, "diz", "giz", "dice", "tiza", "diz suena «yis» con un toque de d; giz, «shis» sonora, sin d."),
    P("p-091", "tidi", 9, "tiro", "giro", "tiro, disparo", "giro, vuelta", TIDI),
    P("p-092", "tidi", 9, "ponte", "ponche", "puente", "ponche", "ponte termina en «chi» con t; ponche, en «shi»."),
    P("p-093", "tidi", 10, "tio", "chio", "tío", "chirrido", TIDI),
    P("p-094", "tidi", 12, "de", "dê", "de", "dé (imperativo de dar)", "de, átona, suena «yi»; dê, tónica, con ê cerrada y d dura."),
    P("p-095", "tidi", 16, "te", "tê", "te (pronombre)", "la letra t", "te, átono, suena «chi»; tê, tónico, con t dura y ê cerrada."),
    P("p-096", "tidi", 18, "tinto", "cinto", "tinto (vino)", "cinturón", TIDI),
    P("p-097", "tidi", 19, "tique", "chique", "tic", "chic, elegante", TIDI),
    // -------------------------------------------------------------- erres
    P("p-098", "erres", 1, "caro", "carro", "caro", "auto", RR),
    P("p-099", "erres", 2, "muro", "murro", "muro", "trompada", RR),
    P("p-100", "erres", 3, "rato", "ato", "ratón", "acto", "La r inicial es una j suave: rato = «jato». Sin r, ato."),
    P("p-101", "erres", 5, "coro", "corro", "coro", "corro", RR),
    P("p-102", "erres", 5, "era", "erra", "era, época", "se equivoca", RR),
    P("p-103", "erres", 5, "moro", "morro", "vivo (morar)", "morro, cerro", "El morro carioca (Morro da Urca, dos Irmãos) lleva rr aspirada: «mojo»."),
    P("p-104", "erres", 9, "para", "parra", "para", "parra, vid", RR),
    P("p-105", "erres", 9, "rato", "jato", "ratón", "chorro; jet", "r inicial (una j suave, sin voz) contra j (la «y» zumbada de «yo», sonora)."),
    P("p-106", "erres", 10, "carinho", "carrinho", "cariño", "carrito", RR),
    P("p-107", "erres", 12, "vara", "varra", "vara", "barra (imperativo de varrer)", RR),
    P("p-108", "erres", 14, "ramo", "amo", "ramo", "amo (amar)", "La r inicial se oye como una j suave; la h no suena: ramo ≠ amo."),
    P("p-109", "erres", 14, "jogo", "rogo", "juego", "ruego", "j sonora (la «y» zumbada de «yo») contra r inicial aspirada."),
    P("p-110", "erres", 16, "rir", "ir", "reír", "ir", "rir empieza con una j suave («jir»); ir, con vocal."),
    P("p-111", "erres", 17, "gente", "rente", "gente", "al ras", "g sonora (la «y» zumbada de «yo») contra r aspirada, sin voz."),
    P("p-112", "erres", 19, "careta", "carreta", "mueca", "carreta", RR),
    P("p-113", "erres", 20, "ralo", "halo", "rejilla; ralo", "halo", "La h no suena: halo = «alo». La r inicial, sí: ralo = «jalo»."),
    P("p-114", "erres", 23, "mora", "morra", "vive (morar)", "muera (morrer)", RR),
    // ------------------------------------------------------------ labiais
    P("p-115", "labiais", 1, "vela", "bela", "vela", "bella", VB),
    P("p-116", "labiais", 1, "vem", "bem", "viene", "bien", VB),
    P("p-117", "labiais", 8, "vala", "bala", "zanja", "bala; caramelo", VB),
    P("p-118", "labiais", 12, "cavo", "cabo", "cavo", "cabo", VB),
    P("p-119", "labiais", 16, "votar", "botar", "votar", "poner, echar (coloquial)", VB),
    P("p-120", "labiais", 17, "vento", "bento", "viento", "bendito (y el nombre Bento)", VB),
    P("p-121", "labiais", 18, "vaga", "baga", "vacante; lugar para estacionar", "baya", VB),
    P("p-122", "labiais", 20, "voto", "boto", "voto", "boto, delfín del Amazonas", VB),
    P("p-123", "labiais", 25, "visão", "bisão", "visión", "bisonte", VB),
    // ------------------------------------------------------------- atonas
    P("p-124", "atonas", 11, "come", "comi", "come", "comí", ATO),
    P("p-125", "atonas", 11, "bebe", "bebi", "bebe", "bebí", ATO),
    P("p-126", "atonas", 11, "parte", "parti", "parte; sale", "salí", ATO),
    P("p-127", "atonas", 11, "vende", "vendi", "vende", "vendí", ATO),
    P("p-128", "atonas", 11, "falo", "falou", "hablo", "habló", PERF),
    P("p-129", "atonas", 11, "moro", "morou", "vivo", "vivió", PERF),
    P("p-130", "atonas", 11, "chego", "chegou", "llego", "llegó", PERF),
    P("p-131", "atonas", 12, "abre", "abri", "abre", "abrí", ATO),
    P("p-132", "atonas", 12, "sobe", "subi", "sube", "subí", "sobe (ó abierta, e final «i») contra subi (acento en la i final)."),
    P("p-133", "atonas", 12, "vive", "vivi", "vive", "viví", ATO),
    P("p-134", "atonas", 12, "fico", "ficou", "me quedo", "se quedó", PERF),
    P("p-135", "atonas", 13, "corre", "corri", "corre", "corrí", ATO),
    P("p-136", "atonas", 14, "sente", "senti", "siente", "sentí", ATO),
    P("p-137", "atonas", 14, "gosto", "gostou", "me gusta", "le gustó", PERF),
    P("p-138", "atonas", 14, "estudo", "estudou", "estudio", "estudió", PERF),
    P("p-139", "atonas", 15, "trabalho", "trabalhou", "trabajo", "trabajó", PERF),
    P("p-140", "atonas", 16, "canto", "cantou", "canto", "cantó", PERF),
    // ------------------------------------------------------------- lfinal
    P("p-141", "lfinal", 3, "mal", "má", "mal", "mala (fem. de mau)", LFIN),
    P("p-142", "lfinal", 4, "mal", "mar", "mal", "mar", "mal termina en u («mau»); mar, en una r aspirada, casi una j suave."),
    P("p-143", "lfinal", 4, "alto", "ato", "alto", "acto", LFIN),
    P("p-144", "lfinal", 5, "sol", "só", "sol", "solo", LFIN),
    P("p-145", "lfinal", 7, "mil", "mi", "mil", "mi (nota musical)", LFIN),
    P("p-146", "lfinal", 8, "pau", "pá", "palo", "pala", "pau (con u) contra pá: la misma u que tienen mal y sol."),
    P("p-147", "lfinal", 11, "vil", "vi", "vil", "vi", LFIN),
    P("p-148", "lfinal", 12, "cal", "cá", "cal", "acá", LFIN),
    P("p-149", "lfinal", 14, "amor", "amou", "amor", "amó", "amor termina en r (a veces casi muda en el habla); amou, en ô cerrada."),
    P("p-150", "lfinal", 18, "calda", "cada", "almíbar", "cada", LFIN),
    // ------------------------------------------------------------- tonica
    P("p-151", "tonica", 1, "está", "esta", "está", "esta", "está es aguda (es-TÁ); esta es llana (ÉS-ta), con é abierta."),
    P("p-152", "tonica", 4, "país", "pais", "país", "padres", "país tiene dos sílabas (pa-ÍS); pais (padres, plural de pai), una sola."),
    P("p-153", "tonica", 5, "secretária", "secretaria", "secretaria (la persona)", "secretaría, oficina", TON),
    P("p-154", "tonica", 5, "fábrica", "fabrica", "fábrica", "fabrica", TON),
    P("p-155", "tonica", 7, "número", "numero", "número", "numero (verbo)", TON),
    P("p-156", "tonica", 9, "Pará", "para", "Pará (el estado)", "para", TON),
    P("p-157", "tonica", 10, "babá", "baba", "niñera", "baba", TON),
    P("p-158", "tonica", 11, "sai", "saí", "sale", "salí", "sai es un diptongo (una sílaba); saí, dos, con la i fuerte."),
    P("p-159", "tonica", 11, "cai", "caí", "cae", "caí", "cai, una sílaba; caí, dos (ca-Í)."),
    P("p-160", "tonica", 12, "prática", "pratica", "práctica", "practica", TON),
    P("p-161", "tonica", 14, "música", "musica", "música", "musicaliza (musicar)", TON),
    P("p-162", "tonica", 15, "sábia", "sabia", "sabia (mujer sabia)", "sabía", TON),
    P("p-163", "tonica", 15, "sabia", "sabiá", "sabía", "sabiá (el zorzal, pájaro)", TON),
    P("p-164", "tonica", 15, "sábia", "sabiá", "sabia (mujer sabia)", "sabiá (el pájaro)", TON),
    P("p-165", "tonica", 15, "hábito", "habito", "hábito", "habito, vivo en", TON),
    P("p-166", "tonica", 19, "cálculo", "calculo", "cálculo", "calculo", TON),
    P("p-167", "tonica", 19, "caqui", "cáqui", "caqui (la fruta)", "caqui (el color)", "La fruta es aguda (ca-QUI); el color, llana (CÁ-qui)."),
    P("p-168", "tonica", 21, "início", "inicio", "inicio", "inicio (verbo)", "início (el sustantivo) acentúa la i del medio; inicio (el verbo), la última: i-ni-CI-o."),
    P("p-169", "tonica", 22, "pública", "publica", "pública", "publica", TON),
    P("p-170", "tonica", 22, "cópia", "copia", "copia", "copia (verbo)", "cópia (sustantivo): CÓ-pia; copia (verbo): co-PI-a."),
    P("p-171", "tonica", 23, "dúvida", "duvida", "duda", "duda (verbo)", TON),
    P("p-172", "tonica", 24, "negócio", "negocio", "negocio", "negocio (verbo)", "negócio: ne-GÓ-cio; negocio (verbo): ne-go-CI-o."),
    P("p-173", "tonica", 28, "prêmio", "premio", "premio", "premio (verbo)", "prêmio: PRÊ-mio; premio (verbo): pre-MI-o."),
    P("p-174", "tonica", 31, "anúncio", "anuncio", "anuncio", "anuncio (verbo)", "En español se dicen igual; en portugués no: a-NÚN-cio (sustantivo) y a-nun-CI-o (verbo)."),
    P("p-175", "tonica", 31, "diálogo", "dialogo", "diálogo", "dialogo (verbo)", TON),
    P("p-176", "tonica", 34, "crítica", "critica", "crítica", "critica", TON),
    P("p-177", "tonica", 35, "estímulo", "estimulo", "estímulo", "estimulo", TON),
    P("p-178", "tonica", 37, "fórmula", "formula", "fórmula", "formula", TON),
    P("p-179", "tonica", 38, "íntimo", "intimo", "íntimo", "intimo, intimo a (intimar)", TON),
    P("p-180", "tonica", 40, "análise", "analise", "análisis", "analice (subjuntivo)", TON),
    P("p-181", "tonica", 40, "média", "media", "promedio, media", "medía (medir)", "média: MÉ-dia; media (imperfeito de medir): me-DI-a.")
  ];

  /* Habla conectada.  «conta»: cuántas palabras escritas hay (las
     contracciones no, na, do, pelo, num, à son una sola).  «scegli»: elegí
     lo que escuchaste; cuando `say` es la forma reducida del habla (cê tá,
     pra, tô, num) y `answer` la forma completa, se pregunta qué quiere
     decir. */
  var CONNESSO = [
    { id: "c-001", kind: "conta", week: 3, say: "Estou no Rio.", answer: "3", options: ["3", "4", "5"], es: "Estoy en Río.", note: "no = em + o: una sola palabra, obligatoria (nunca «em o»)." },
    { id: "c-002", kind: "conta", week: 3, say: "A casa da Ana é grande.", answer: "6", options: ["5", "6", "7"], es: "La casa de Ana es grande.", note: "da = de + a. Y el artículo delante del nombre: a Ana." },
    { id: "c-003", kind: "conta", week: 3, say: "Tem um bar na esquina.", answer: "5", options: ["4", "5", "6"], es: "Hay un bar en la esquina.", note: "na = em + a." },
    { id: "c-004", kind: "scegli", week: 3, say: "Estou na praia.", answer: "Estou na praia.", options: ["Estou na praia.", "Estou em a praia.", "Estou em praia."], es: "Estoy en la playa.", note: "em + a = na, siempre." },
    { id: "c-005", kind: "scegli", week: 5, say: "Vocês falam português?", answer: "Vocês falam português?", options: ["Vocês falam português?", "Você fala português?", "Vocês falamos português?"], es: "¿Hablan portugués?", note: "vocês con verbo en tercera plural: falam, que termina en nasal («fálãu»)." },
    { id: "c-006", kind: "conta", week: 6, say: "A gente vai amanhã.", answer: "4", options: ["3", "4", "5"], es: "Vamos mañana.", note: "a gente = nosotros, dos palabras, con verbo en singular." },
    { id: "c-007", kind: "scegli", week: 6, say: "Eu faço isso.", answer: "Eu faço isso.", options: ["Eu faço isso.", "Eu fazo isso.", "Eu faço isto."], es: "Yo hago eso.", note: "faço con ç (s sorda); isso ≠ isto." },
    { id: "c-008", kind: "scegli", week: 7, say: "É meio-dia e meia.", answer: "É meio-dia e meia.", options: ["É meio-dia e meia.", "É meio-dia e meio.", "São meio-dia e meia."], es: "Son las doce y media.", note: "meia (hora) es femenino; y meio-dia va con é, en singular." },
    { id: "c-009", kind: "scegli", week: 7, say: "São duas horas.", answer: "São duas horas.", options: ["São duas horas.", "São dois horas.", "É duas horas."], es: "Son las dos.", note: "duas: el número concuerda con hora (femenino)." },
    { id: "c-010", kind: "scegli", week: 8, say: "Tô cansado.", answer: "Estou cansado.", options: ["Estou cansado.", "Todo cansado.", "Tão cansado."], es: "Estoy cansado.", note: "tô = estou en el habla: se come la es- inicial." },
    { id: "c-011", kind: "scegli", week: 8, say: "Cê tá bem?", answer: "Você está bem?", options: ["Você está bem?", "Se está bem?", "Você é bem?"], es: "¿Estás bien?", note: "cê = você y tá = está: dos reducciones del habla de todos los días." },
    { id: "c-012", kind: "conta", week: 8, say: "Tô indo pra casa.", answer: "4", options: ["3", "4", "5"], es: "Me voy a casa.", note: "tô (estou) y pra (para) son palabras reducidas, pero siguen siendo una palabra cada una." },
    { id: "c-013", kind: "scegli", week: 8, say: "Tô com fome.", answer: "Estou com fome.", options: ["Estou com fome.", "Tão com fome.", "Tudo com fome."], es: "Tengo hambre.", note: "tô = estou; estar com fome = tener hambre." },
    { id: "c-014", kind: "conta", week: 9, say: "Passo pela praia.", answer: "3", options: ["3", "4", "5"], es: "Paso por la playa.", note: "pela = por + a." },
    { id: "c-015", kind: "conta", week: 9, say: "Ele mora num apartamento.", answer: "4", options: ["4", "5", "6"], es: "Él vive en un departamento.", note: "num = em + um." },
    { id: "c-016", kind: "scegli", week: 9, say: "Vou pela orla.", answer: "Vou pela orla.", options: ["Vou pela orla.", "Vou pelo orla.", "Vou por a orla."], es: "Voy por la costanera.", note: "por + a = pela; orla es femenino." },
    { id: "c-017", kind: "scegli", week: 9, say: "Vou pra praia.", answer: "Vou para a praia.", options: ["Vou para a praia.", "Vou pela praia.", "Vou na praia."], es: "Voy a la playa.", note: "pra = para + a en el habla: «pra praia» suena casi como una sola palabra." },
    { id: "c-018", kind: "scegli", week: 9, say: "Vou pro centro.", answer: "Vou para o centro.", options: ["Vou para o centro.", "Vou pelo centro.", "Vou por o centro."], es: "Voy al centro.", note: "pro = para + o, en el habla." },
    { id: "c-019", kind: "conta", week: 10, say: "O carro dele é novo.", answer: "5", options: ["4", "5", "6"], es: "Su auto (de él) es nuevo.", note: "dele = de + ele." },
    { id: "c-020", kind: "conta", week: 10, say: "Moro nesta rua.", answer: "3", options: ["3", "4", "5"], es: "Vivo en esta calle.", note: "nesta = em + esta." },
    { id: "c-021", kind: "scegli", week: 10, say: "A casa dela é linda.", answer: "A casa dela é linda.", options: ["A casa dela é linda.", "A casa de ela é linda.", "A casa dele é linda."], es: "Su casa (de ella) es linda.", note: "dela (é abierta) ≠ dele (ê cerrada, e final «i»)." },
    { id: "c-022", kind: "conta", week: 11, say: "Ontem eu fui à praia.", answer: "5", options: ["4", "5", "6"], es: "Ayer fui a la playa.", note: "à = a + a: una palabra." },
    { id: "c-023", kind: "scegli", week: 12, say: "Num sei, não.", answer: "Não sei, não.", options: ["Não sei, não.", "Um sei, não.", "No sei, não."], es: "No sé.", note: "En el habla rápida, não delante del verbo se reduce a «num». Ojo: num también es em + um." },
    { id: "c-024", kind: "scegli", week: 12, say: "Me dá um café?", answer: "Me dá um café?", options: ["Me dá um café?", "Me dá o café?", "Me dás um café?"], es: "¿Me das un café?", note: "En Brasil el pronombre va delante, aun al empezar la frase: me dá." },
    { id: "c-025", kind: "conta", week: 14, say: "Gosto do samba.", answer: "3", options: ["3", "4", "5"], es: "Me gusta el samba.", note: "gostar de + o = do." },
    { id: "c-026", kind: "scegli", week: 16, say: "Vi ele ontem.", answer: "Vi ele ontem.", options: ["Vi ele ontem.", "Vi-o ontem.", "Vi eles ontem."], es: "Lo vi ayer.", note: "En el habla de Brasil, «ele» como objeto: vi ele (coloquial); en lo escrito, vi-o." },
    { id: "c-027", kind: "scegli", week: 18, say: "Eu queria um café.", answer: "Eu queria um café.", options: ["Eu queria um café.", "Eu quero um café.", "Eu queira um café."], es: "Quería un café.", note: "El imperfeito de cortesía: queria." },
    { id: "c-028", kind: "scegli", week: 19, say: "É o melhor do Rio.", answer: "É o melhor do Rio.", options: ["É o melhor do Rio.", "É o mais bom do Rio.", "É o melhor no Rio."], es: "Es el mejor de Río.", note: "melhor, nunca «mais bom»." },
    { id: "c-029", kind: "conta", week: 20, say: "Não tem ninguém aqui.", answer: "4", options: ["3", "4", "5"], es: "No hay nadie acá.", note: "Doble negación, como en español: não… ninguém." },
    { id: "c-030", kind: "scegli", week: 21, say: "Tenho trabalhado muito.", answer: "Tenho trabalhado muito.", options: ["Tenho trabalhado muito.", "Tinha trabalhado muito.", "Tenho trabalho muito."], es: "Vengo trabajando mucho.", note: "tenho + participio: algo que se repite hasta hoy." },
    { id: "c-031", kind: "scegli", week: 22, say: "A casa foi vendida.", answer: "A casa foi vendida.", options: ["A casa foi vendida.", "A casa foi vendido.", "A casa é vendida."], es: "La casa fue vendida.", note: "El participio de la pasiva concuerda: vendida." },
    { id: "c-032", kind: "scegli", week: 23, say: "Tomara que dê certo.", answer: "Tomara que dê certo.", options: ["Tomara que dê certo.", "Tomara que de certo.", "Tomara que deu certo."], es: "Ojalá salga bien.", note: "dê (subjuntivo) con ê cerrada y d dura; de suena «yi»." },
    { id: "c-033", kind: "scegli", week: 27, say: "Quando eu for, te aviso.", answer: "Quando eu for, te aviso.", options: ["Quando eu for, te aviso.", "Quando eu fosse, te aviso.", "Quando eu for, te avisei."], es: "Cuando vaya, te aviso.", note: "Futuro do subjuntivo: quando eu for." },
    { id: "c-034", kind: "scegli", week: 28, say: "Se eu pudesse, eu ia.", answer: "Se eu pudesse, eu ia.", options: ["Se eu pudesse, eu ia.", "Se eu pude, eu ia.", "Se eu pudesse, eu iria."], es: "Si pudiera, iría.", note: "En el habla, el imperfeito (ia) reemplaza al futuro do pretérito (iria)." },
    { id: "c-035", kind: "scegli", week: 29, say: "É bom vocês chegarem cedo.", answer: "É bom vocês chegarem cedo.", options: ["É bom vocês chegarem cedo.", "É bom vocês chegaram cedo.", "É bom vocês chegar cedo."], es: "Conviene que lleguen temprano.", note: "Infinitivo pessoal: chegarem (-rem, «réi») ≠ chegaram (-ram, «rãu»)." },
    { id: "c-036", kind: "scegli", week: 31, say: "Ele disse que ia.", answer: "Ele disse que ia.", options: ["Ele disse que ia.", "Ele disse que vai.", "Ele disse que iria."], es: "Dijo que iba.", note: "Discurso indirecto: vou → ia." },
    { id: "c-037", kind: "scegli", week: 32, say: "Vendem-se casas.", answer: "Vendem-se casas.", options: ["Vendem-se casas.", "Vende-se casas.", "Vendem casas."], es: "Se venden casas.", note: "Pasiva con se: el verbo concuerda con casas (vendem, nasal)." },
    { id: "c-038", kind: "scegli", week: 33, say: "Disse-lhe a verdade.", answer: "Disse-lhe a verdade.", options: ["Disse-lhe a verdade.", "Disse-le a verdade.", "Disse ele a verdade."], es: "Le dijo la verdad.", note: "lhe con lh palatal; en lo escrito formal, pegado al verbo." },
    { id: "c-039", kind: "scegli", week: 35, say: "Assisti ao jogo.", answer: "Assisti ao jogo.", options: ["Assisti ao jogo.", "Assisti o jogo.", "Assisto ao jogo."], es: "Vi el partido.", note: "assistir a (= ver): ao suena «au»; o, «u»." },
    { id: "c-040", kind: "conta", week: 36, say: "Fui à feira.", answer: "3", options: ["3", "4", "5"], es: "Fui a la feria.", note: "à = a + a, con crase: una sola palabra." },
    { id: "c-041", kind: "scegli", week: 37, say: "Ele interveio na hora.", answer: "Ele interveio na hora.", options: ["Ele interveio na hora.", "Ele interviu na hora.", "Ele intervém na hora."], es: "Intervino en el momento.", note: "intervir se conjuga como vir: interveio (no «interviu»)." },
    { id: "c-042", kind: "scegli", week: 38, say: "Cadê a chave?", answer: "Onde está a chave?", options: ["Onde está a chave?", "Quem é a chave?", "Qual é a chave?"], es: "¿Dónde está la llave?", note: "cadê = ¿dónde está? (coloquial)." },
    { id: "c-043", kind: "scegli", week: 38, say: "Vamo lá!", answer: "Vamos lá!", options: ["Vamos lá!", "Vamos já!", "Vão lá!"], es: "¡Vamos!", note: "En el habla la -s final de vamos cae: «vamo»." },
    { id: "c-044", kind: "scegli", week: 38, say: "Cê num vai?", answer: "Você não vai?", options: ["Você não vai?", "Você nunca vai?", "Você um vai?"], es: "¿No vas?", note: "cê = você, num = não delante del verbo." },
    { id: "c-045", kind: "scegli", week: 38, say: "Tá bom.", answer: "Está bom.", options: ["Está bom.", "Tão bom.", "Tal bom."], es: "Está bien.", note: "tá = está: la reducción más frecuente del portugués hablado." },
    { id: "c-046", kind: "scegli", week: 38, say: "Peraí!", answer: "Espera aí!", options: ["Espera aí!", "Para aí!", "Pera aqui!"], es: "¡Esperá!", note: "peraí = espera aí, todo pegado." },
    { id: "c-047", kind: "scegli", week: 38, say: "Ocê vai?", answer: "Você vai?", options: ["Você vai?", "O que vai?", "Você viu?"], es: "¿Vas?", note: "ocê, entre você y cê, es típico de Minas Gerais." },
    { id: "c-048", kind: "scegli", week: 38, say: "Pra mim, tanto faz.", answer: "Pra mim, tanto faz.", options: ["Pra mim, tanto faz.", "Pra mi, tanto faz.", "Pra mim, tanto fez."], es: "A mí me da lo mismo.", note: "para mim, con i nasal; tanto faz = da igual." }
  ];

  /* Entonación: las mismas palabras como pregunta y como afirmación.  El
     signo de interrogación cambia la curva del TTS. */
  var INTONAZIONE = [];
  var Q = [
    [1, "Você é argentino", "Sos argentino"], [1, "Ela está em casa", "Ella está en casa"], [1, "Você tem irmãos", "Tenés hermanos"],
    [2, "Tem água na geladeira", "Hay agua en la heladera"], [2, "É a sua mochila", "Es tu mochila"],
    [3, "O mercado está aberto", "El mercado está abierto"], [3, "Tem uma farmácia perto daqui", "Hay una farmacia cerca de acá"],
    [4, "Ele é carioca", "Él es carioca"], [4, "A praia está cheia", "La playa está llena"],
    [5, "Você mora em Copacabana", "Vivís en Copacabana"], [5, "Vocês trabalham amanhã", "Trabajan mañana"],
    [6, "Você vem com a gente", "Venís con nosotros"], [6, "Ela sabe nadar", "Ella sabe nadar"],
    [7, "O show começa às nove", "El show empieza a las nueve"], [7, "Custa vinte reais", "Cuesta veinte reales"],
    [8, "Você vai ao Maracanã no domingo", "Vas al Maracaná el domingo"], [8, "Está chovendo em Botafogo", "Está lloviendo en Botafogo"],
    [9, "O metrô passa em Ipanema", "El subte pasa por Ipanema"], [9, "A gente desce na próxima", "Nos bajamos en la próxima"],
    [10, "Esse chapéu é seu", "Ese sombrero es tuyo"], [11, "Você já comeu", "Ya comiste"], [11, "Eles chegaram ontem", "Llegaron ayer"],
    [12, "Você se levanta cedo", "Te levantás temprano"], [14, "Você gosta de samba", "Te gusta el samba"],
    [15, "A loja era pequena", "El negocio era chico"], [16, "Você conhece ela", "La conocés"],
    [17, "Vai chover amanhã", "Va a llover mañana"], [18, "Você poderia me ajudar", "Podrías ayudarme"],
    [19, "O Rio é maior que Niterói", "Río es más grande que Niterói"], [20, "Não tem ninguém na praia", "No hay nadie en la playa"],
    [21, "Você tem estudado muito", "Venís estudiando mucho"], [22, "A conta já foi paga", "La cuenta ya fue pagada"],
    [23, "É melhor que ele venha", "Es mejor que venga"], [24, "Você vai mesmo que chova", "Vas aunque llueva"],
    [25, "É o bar onde vocês se conheceram", "Es el bar donde se conocieron"], [27, "Você me liga quando chegar", "Me llamás cuando llegues"],
    [28, "Você viajaria se pudesse", "Viajarías si pudieras"], [29, "É para a gente esperar aqui", "Es para que esperemos acá"],
    [31, "Ela disse que vinha", "Ella dijo que venía"], [38, "Cê tá cansado", "Estás cansado"]
  ];
  Q.forEach(function (q, i) {
    INTONAZIONE.push({ id: "i-" + (2 * i + 1), week: q[0], say: q[1] + "?", answer: "pregunta", es: "¿" + q[2] + "?" });
    INTONAZIONE.push({ id: "i-" + (2 * i + 2), week: q[0], say: q[1] + ".", answer: "afirmación", es: q[2] + "." });
  });

  /* Acento tónico.  Las opciones van en sílabas, con la tónica en
     mayúsculas.  fake: true = solo una de las opciones es una palabra (los
     heterotónicos, que el español hace acentuar en otra sílaba); sin fake,
     todas existen (sábia / sabia / sabiá). */
  function A(id, week, word, good, bad, es, note) {
    return { id: id, week: week, say: word, answer: good, options: [good, bad], es: es, note: note, fake: true };
  }
  var SAB = ["SÁ·bi·a", "sa·BI·a", "sa·bi·Á"];
  var ACCENTO = [
    A("a-001", 3, "polícia", "po·LÍ·cia", "po·li·CI·a", "policía", "polícia: el acento cae en LÍ, no en «ci» como en español."),
    A("a-002", 4, "academia", "a·ca·de·MI·a", "a·ca·DE·mia", "academia; gimnasio", "academia: a-ca-de-MI-a (y en Brasil también es el gimnasio)."),
    A("a-003", 5, "nível", "NÍ·vel", "ni·VEL", "nivel", "nível es llana (y la -l suena u: «NÍ-veu»); en español, aguda."),
    A("a-004", 6, "cérebro", "CÉ·re·bro", "ce·RE·bro", "cerebro", "cérebro es esdrújula, con é abierta."),
    A("a-005", 7, "oxigênio", "o·xi·GÊ·nio", "o·XI·ge·nio", "oxígeno", "oxigênio: o-xi-GÊ-nio; en español, «oxígeno» es esdrújula."),
    A("a-006", 8, "gaúcho", "ga·Ú·cho", "GAU·cho", "gaucho (del Sur de Brasil)", "ga-Ú-cho: tres sílabas, con hiato."),
    A("a-007", 9, "rubrica", "ru·BRI·ca", "RU·bri·ca", "rúbrica, firma", "La norma dice rubrica, llana; «rúbrica» se oye mucho en Brasil, pero los diccionarios la dan como error."),
    A("a-008", 10, "alergia", "a·ler·GI·a", "a·LER·gia", "alergia", "alergia: a-ler-GI-a, con hiato."),
    A("a-009", 12, "anemia", "a·ne·MI·a", "a·NE·mia", "anemia", "anemia: a-ne-MI-a."),
    A("a-010", 12, "epidemia", "e·pi·de·MI·a", "e·pi·DE·mia", "epidemia", "epidemia: e-pi-de-MI-a."),
    A("a-011", 14, "nostalgia", "nos·tal·GI·a", "nos·TAL·gia", "nostalgia", "nostalgia: nos-tal-GI-a."),
    A("a-012", 15, "magia", "ma·GI·a", "MA·gia", "magia", "magia: ma-GI-a."),
    { id: "a-013", week: 15, say: "sábia", answer: SAB[0], options: SAB.slice(), es: "sabia (mujer sabia) / sabía / sabiá (el zorzal)", note: "Tres palabras según la sílaba fuerte: sábia, sabia, sabiá." },
    { id: "a-014", week: 15, say: "sabia", answer: SAB[1], options: SAB.slice(), es: "sabía (imperfeito de saber)", note: "sabia, llana: sa-BI-a." },
    { id: "a-015", week: 15, say: "sabiá", answer: SAB[2], options: SAB.slice(), es: "sabiá, el zorzal (el pájaro de la «Canção do Exílio»)", note: "sabiá, aguda: sa-bi-Á." },
    A("a-016", 16, "terapia", "te·ra·PI·a", "te·RA·pia", "terapia", "terapia: te-ra-PI-a."),
    A("a-017", 17, "oceano", "o·ce·A·no", "o·CE·a·no", "océano", "oceano es llana: o-ce-A-no."),
    A("a-018", 19, "míssil", "MÍS·sil", "mis·SIL", "misil", "míssil es llana, con ss."),
    A("a-019", 20, "atmosfera", "at·mos·FE·ra", "at·MOS·fe·ra", "atmósfera", "atmosfera es llana: at-mos-FE-ra."),
    A("a-020", 21, "imbecil", "im·be·CIL", "im·BE·cil", "imbécil", "imbecil es aguda: im-be-CIL (la l suena u)."),
    A("a-021", 22, "ímã", "Í·mã", "i·MÃ", "imán", "ímã es llana: la tilde de la ã marca la nasal, no el acento."),
    A("a-022", 23, "sintoma", "sin·TO·ma", "SIN·to·ma", "síntoma", "sintoma es llana: sin-TO-ma."),
    A("a-023", 24, "álcool", "ÁL·co·ol", "al·co·OL", "alcohol", "álcool es esdrújula: ÁL-co-ol."),
    A("a-024", 25, "futebol", "fu·te·BOL", "FU·te·bol", "fútbol", "futebol es aguda: fu-te-BOL."),
    A("a-025", 27, "periferia", "pe·ri·fe·RI·a", "pe·ri·FE·ria", "periferia", "periferia: pe-ri-fe-RI-a."),
    A("a-026", 28, "democracia", "de·mo·cra·CI·a", "de·mo·CRA·cia", "democracia", "democracia: de-mo-cra-CI-a, como todas las -cracia."),
    A("a-027", 29, "burocracia", "bu·ro·cra·CI·a", "bu·ro·CRA·cia", "burocracia", "burocracia: bu-ro-cra-CI-a."),
    A("a-028", 30, "regime", "re·GI·me", "RE·gi·me", "régimen", "regime es llana y sin n final: re-GI-me."),
    A("a-029", 31, "recorde", "re·COR·de", "RE·cor·de", "récord", "recorde es llana: re-COR-de."),
    A("a-030", 32, "condor", "con·DOR", "CON·dor", "cóndor", "condor es aguda: con-DOR."),
    A("a-031", 33, "leucemia", "leu·ce·MI·a", "leu·CE·mia", "leucemia", "leucemia: leu-ce-MI-a."),
    A("a-032", 34, "hemorragia", "he·mor·ra·GI·a", "he·mor·RA·gia", "hemorragia", "hemorragia: he-mor-ra-GI-a."),
    A("a-033", 35, "diplomacia", "di·plo·ma·CI·a", "di·plo·MA·cia", "diplomacia", "diplomacia: di-plo-ma-CI-a."),
    A("a-034", 36, "têxtil", "TÊX·til", "tex·TIL", "textil", "têxtil es llana: TÊX-til."),
    A("a-035", 37, "fobia", "fo·BI·a", "FO·bia", "fobia", "fobia: fo-BI-a.")
  ];

  // Lo que suoni.js dice de este idioma: el nombre de cada categoría de
  // pares, las consignas y las notas.
  var UI = {
    cats: { vogais: "vocales abiertas y cerradas", nasais: "vocales nasales", palatais: "lh y nh",
            sibilantes: "s sonora y s sorda", chiadas: "ch, x y j", tidi: "ti, di: «chi», «yi»",
            erres: "r suave, rr y r inicial", labiais: "v y b", atonas: "e, o finales y acento del verbo",
            lfinal: "l final = u", tonica: "sílaba tónica" },
    conta: "¿Cuántas palabras escuchaste? (no, na, do, pelo, à cuentan como una)",
    intoNote: "En portugués, como en español, la pregunta sí/no no cambia el orden: la marca solo la melodía. En Brasil sube en la última sílaba tónica (y suele caer después); la afirmación baja.",
    accPrompt: "¿Dónde cae el acento? Elegí la sílaba fuerte",
    dictPrompt: "Dictado: escuchá y escribí exactamente lo que oís (tildes y ç incluidas)",
    dictNote: "Una sola letra cambia la palabra: avó / avô, casa / caça, sonho / sono. Y las contracciones van pegadas: no, na, do, pelo."
  };

  var api = { PAIRS: PAIRS, CONNESSO: CONNESSO, INTONAZIONE: INTONAZIONE, ACCENTO: ACCENTO, UI: UI };
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.AscoltoData = api;
})(typeof window !== "undefined" ? window : globalThis);
