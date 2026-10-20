/*
 * Moderniza la ortografía de los textos portugueses de Project Gutenberg
 * (ediciones de 1880-1915, antes de la reforma de 1943) a la del Acuerdo
 * Ortográfico de 1990, en su variante brasileña.  Solo cambia la GRAFÍA:
 * nunca una palabra por otra ni la sintaxis (dous, cousa, fallecer…
 * quedan como están si hoy se escriben así o son otra palabra).
 *
 *   pharmacia → farmácia    Ayres → Aires       estylo → estilo
 *   elle, ella → ele, ela    sahir → sair        commigo → comigo
 *   theatro → teatro         escripto → escrito  acção → ação
 *   portuguez → português    idéa → ideia        pae, vae → pai, vai
 *   ouvil-o → ouvi-lo        fazel-o → fazê-lo   á → à, ha → há
 *   sahia → saía             bocca → boca        somno → sono
 *   póde → pode, fôra → fora (los acentos diferenciales que ya no van)
 *   ha-de → há de, lh'o → lho
 *
 * Cómo trabaja, palabra por palabra (conserva mayúsculas y puntuación):
 *
 *  1. Excepciones revisadas a mano (EXC): nombres propios y casos que las
 *     reglas no resuelven solas (Itaguahy → Itaguaí, Capitú → Capitu,
 *     sahio → saiu, máo → mau, hade → há de).  Muchas salieron de revisar
 *     el informe de tools/lib/build_biblioteca.js --report.
 *  2. Si la palabra ya es una forma moderna del léxico, queda igual.  El
 *     léxico sale del paquete pt (frecuencias, glosario, frases, lecturas y
 *     todas las formas del conjugador de cada verbo de la lista de
 *     frecuencias) y, con opts.wordlist, de la lista de palabras del
 *     corrector VERO (pt-BR, posterior a 1990) con sus plurales, femeninos
 *     y las formas de sus verbos; sin las entradas con grafía antigua que
 *     traen los corpus (ella, tambem, ha…).
 *  3. Reglas seguras, siempre: ph → f, th → t, rh → r, chr/chl → cr/cl,
 *     y → i, consonante doble → simple (salvo rr, ss), cc ante vocal y cç →
 *     c/ç, prehen → preen, fruct → frut, -ae(s) final → -ai(s), ü → u, el
 *     enclítico antiguo (-l-o, -l-a: ouvil-o → ouvi-lo, fazel-o → fazê-lo).
 *  4. Si todavía no es una forma moderna, se prueban las transformaciones
 *     históricas (hasta tres a la vez): z ↔ s (portuguez, analysar →
 *     analisar), s → ss (socego), ns → nç (dansar), x → s (extranho), g → j
 *     (magestade), ç → s, e ↔ i (quasi, egreja, deante), o ↔ u (logar),
 *     consonantes mudas (director, escripto, assumpto, signal), mn → n
 *     (somno), h mudo tras vocal, con el acento del hiato (sahia → saía,
 *     comprehender), m → n (emquanto), ch → qu/c (chimica, archivo), sc- →
 *     c- (scena), -io → -iu (abrio), -ão → -am (disserão), -oe → -oi, -ea →
 *     -eia, ei → e (passeiar); y la acentuación moderna (tambem → também,
 *     fôra → fora, póde → pode).  Gana la variante que es forma moderna con
 *     menos cambios (a igualdad, la más frecuente).
 *  5. Si nada da una forma conocida: un adverbio en -mente se arma con su
 *     adjetivo modernizado sin tilde (distinctamente → distintamente); si
 *     no, solo los sufijos de acento fijo (-encia → -ência, -avel → -ável…).
 *
 * Los nombres (palabras que el texto escribe con mayúscula dentro de la
 * oración y nunca en minúscula: Homero, Humanitas, Shelley) solo pasan por
 * las excepciones y las reglas seguras, y solo si el resultado es una
 * palabra conocida: learn(texto) los junta antes de text().  Los números
 * romanos no se tocan.  Las cursivas de Gutenberg (_entre guiones bajos_)
 * se modernizan si son portugués (el énfasis: _Elle se irá_) y se dejan
 * como están si son una cita en otra lengua (_Eppur si muove_).
 *
 * Uso:
 *   var Orto = require("./ortografia.js");
 *   var m = Orto.modernizer({ wordlist: [...] });   // arma el léxico con tools/lib/pack.js
 *   m.learn(libro); m.text("Ella sahiu da pharmacia.")  // → "Ela saiu da farmácia."
 *   m.changed()      // lo que cambió por transformación o acento (para revisar)
 *   m.unresolved()   // lo que no encontró en el léxico, por frecuencia
 *
 *   node tools/pt/ortografia.js "Ella sahiu da pharmacia."
 *
 * OLD: una lista de grafías antiguas que no pueden quedar en los textos
 * de la biblioteca (tools/lib/test_biblioteca.js la usa).
 */
"use strict";

var path = require("path");

var LOWER = "a-zà-öø-ÿ";
var WORD_RE = /[A-Za-zÀ-ÖØ-öø-ÿ]+(?:-[A-Za-zÀ-ÖØ-öø-ÿ]+)*/g;

// Revisadas a mano: lo que las reglas no pueden saber (nombres propios,
// palabras cuyo acento o grafía moderna no está en el léxico).
var EXC = {
  // nombres propios y lugares
  "ayres": "aires", "victoria": "vitória", "victorioso": "vitorioso", "victoriosa": "vitoriosa", "itaguahy": "itaguaí", "itaguahyense": "itaguaiense", "itaguahyenses": "itaguaienses",
  "capitú": "capitu", "braz": "brás", "luiz": "luís", "luiza": "luísa", "thereza": "teresa", "brazil": "brasil",
  "brazileiro": "brasileiro", "brazileira": "brasileira", "brazileiros": "brasileiros", "brazileiras": "brasileiras",
  "pariz": "paris", "cattete": "catete", "polycarpo": "policarpo", "polycrates": "polícrates", "sapucaia": "sapucaia",
  "bahia": "bahia", "ignez": "inês", "ignacio": "inácio", "ignacia": "inácia", "baptista": "batista",
  "sancha": "sancha", "escobar": "escobar", "gurgel": "gurgel", "benedicta": "benedita", "genesis": "gênesis",
  "sião": "sião", "moysés": "moisés", "moyses": "moisés", "jeremias": "jeremias", "christo": "cristo",
  "jesus-christo": "jesus-cristo", "christovão": "cristóvão", "raphael": "rafael", "philippe": "filipe",
  "theodoro": "teodoro", "thomaz": "tomás", "thomé": "tomé", "mathias": "matias", "matheus": "mateus",
  "athenas": "atenas", "egypto": "egito", "hespanha": "espanha", "allemanha": "alemanha", "inglaterra": "inglaterra",
  "europa": "europa", "tijuca": "tijuca", "botafogo": "botafogo", "andarahy": "andaraí", "icarahy": "icaraí",
  "catumby": "catumbi", "nictheroy": "niterói", "petropolis": "petrópolis", "guanabara": "guanabara",
  "sophia": "sofia", "fidelia": "fidélia", "tristão": "tristão", "aguiar": "aguiar", "osorio": "osório",
  "carmo": "carmo", "rubião": "rubião", "palha": "palha", "camacho": "camacho", "freitas": "freitas",
  "quaresma": "quaresma", "ricardo": "ricardo", "olga": "olga", "genelicio": "genelício", "albernaz": "albernaz",
  "ismenia": "ismênia", "adelaide": "adelaide", "joão": "joão", "romão": "romão", "bertoleza": "bertoleza",
  "jeronymo": "jerônimo", "piedade": "piedade", "pombinha": "pombinha", "rita": "rita", "firmo": "firmo",
  "miranda": "miranda", "estella": "estela", "zulmira": "zulmira", "henriquinho": "henriquinho",
  "botelho": "botelho", "leonie": "léonie", "theophilo": "teófilo", "fernão": "fernão", "alcibiades": "alcibíades",
  "fulgencio": "fulgêncio", "bacamarte": "bacamarte", "evarista": "evarista", "crispim": "crispim",
  "porfirio": "porfírio", "anastacio": "anastácio", "custodio": "custódio", "virgilia": "virgília",
  "gonçalo": "gonçalo", "flora": "flora", "natividade": "natividade", "pedro": "pedro", "paulo": "paulo",
  "cubas": "cubas", "casmurro": "casmurro", "ezequiel": "ezequiel", "glória": "glória", "justina": "justina",
  "cosme": "cosme", "pádua": "pádua", "fortunata": "fortunata", "theodorico": "teodorico", "raposo": "raposo",
  "genebro": "genebro", "jacintho": "jacinto", "matias": "matias", "tavares": "tavares", "cesar": "césar",
  "cezar": "césar", "julio": "júlio", "julia": "júlia", "emilio": "emílio", "emilia": "emília", "antonio": "antônio",
  "antonia": "antônia", "ambrosio": "ambrósio", "eugenia": "eugênia", "eulalia": "eulália", "cyrillo": "cirilo",
  "iracema": "iracema", "venancio": "venâncio", "valerio": "valério", "vicencia": "vicência",
  // palabras que el léxico no trae con su acento o su grafía moderna
  "sacristão": "sacristão", "sachristão": "sacristão", "chapéos": "chapéus", "chapéo": "chapéu",
  "céo": "céu", "céos": "céus", "véo": "véu", "véos": "véus", "réo": "réu", "réos": "réus", "ilhéo": "ilhéu",
  "européo": "europeu", "européos": "europeus", "européa": "europeia", "européas": "europeias",
  "hebréo": "hebreu", "hebréos": "hebreus", "judéo": "judeu", "judéos": "judeus", "troféo": "troféu",
  "idéa": "ideia", "idéas": "ideias", "idea": "ideia", "ideas": "ideias", "assembléa": "assembleia",
  "assembléas": "assembleias", "platéa": "plateia", "platéas": "plateias", "epopéa": "epopeia",
  "colméa": "colmeia", "cadéa": "cadeia", "cadéas": "cadeias", "aldéa": "aldeia", "aldéas": "aldeias",
  "baléa": "baleia", "estréa": "estreia", "estréas": "estreias", "areia": "areia", "européu": "europeu",
  "heroe": "herói", "heroes": "heróis", "heróe": "herói", "heróes": "heróis", "dóe": "dói", "dóem": "doem",
  "móe": "mói", "sóe": "sói", "constróe": "constrói", "destróe": "destrói", "possue": "possui",
  "influe": "influi", "conclue": "conclui", "inclue": "inclui", "attrahe": "atrai", "contrahe": "contrai",
  "distrahe": "distrai", "sahe": "sai", "cahe": "cai", "trahe": "trai", "vae": "vai", "vaes": "vais",
  "pae": "pai", "paes": "pais", "mãe": "mãe", "sae": "sai", "cae": "cai", "trae": "trai", "saes": "sais",
  "ha": "há", "hei": "hei", "ás": "às", "á": "à", "áquelle": "àquele", "áquella": "àquela",
  "áquelles": "àqueles", "áquellas": "àquelas", "áquillo": "àquilo", "aquelle": "aquele", "aquella": "aquela",
  "pôde": "pôde", "póde": "pode", "pódem": "podem", "pódes": "podes", "fôra": "fora", "fóra": "fora",
  "fôr": "for", "fôrem": "forem", "côr": "cor", "côres": "cores", "sêr": "ser", "sêde": "sede", "pêlo": "pelo",
  "pêlos": "pelos", "pólo": "polo", "pára": "para", "péla": "pela", "êste": "este", "êsse": "esse",
  "êle": "ele", "ella": "ela", "elle": "ele", "ellas": "elas", "elles": "eles", "vêem": "veem",
  "crêem": "creem", "lêem": "leem", "dêem": "deem", "vôo": "voo", "enjôo": "enjoo", "abençôo": "abençoo",
  "quasi": "quase", "emquanto": "enquanto", "emfim": "enfim", "comtudo": "contudo", "comnosco": "conosco",
  "commigo": "comigo", "comtigo": "contigo", "comsigo": "consigo", "comvosco": "convosco",
  "hontem": "ontem", "hespanhol": "espanhol", "hespanhola": "espanhola", "humido": "úmido", "humida": "úmida",
  "hombro": "ombro", "hombros": "ombros", "herva": "erva", "hervas": "ervas", "hervanario": "ervanário",
  "prompto": "pronto", "prompta": "pronta", "promptos": "prontos", "promptas": "prontas",
  "promptamente": "prontamente", "assumpto": "assunto", "assumptos": "assuntos", "presumpção": "presunção",
  "sumptuoso": "suntuoso", "sumptuosa": "suntuosa", "isempto": "isento", "isempta": "isenta",
  "prompteza": "presteza", "redempção": "redenção", "consumpção": "consunção",
  "egreja": "igreja", "egrejas": "igrejas", "deante": "diante", "adeante": "adiante", "creatura": "criatura",
  "creaturas": "criaturas", "crear": "criar", "creou": "criou", "creado": "criado", "creada": "criada",
  "creados": "criados", "creadas": "criadas", "creação": "criação", "creador": "criador",
  "logar": "lugar", "logares": "lugares", "bolir": "bulir", "cubiça": "cobiça", "somma": "soma",
  "mysterio": "mistério", "mysterios": "mistérios", "mysteriosa": "misteriosa", "mysterioso": "misterioso",
  "extrangeiro": "estrangeiro", "extrangeira": "estrangeira", "extrangeiros": "estrangeiros",
  "extranho": "estranho", "extranha": "estranha", "extranhos": "estranhos", "extranhas": "estranhas",
  "extranhar": "estranhar", "extranhou": "estranhou", "extranheza": "estranheza",
  "portuguez": "português", "portugueza": "portuguesa", "portuguezes": "portugueses", "portuguezas": "portuguesas",
  "inglez": "inglês", "ingleza": "inglesa", "inglezes": "ingleses", "francez": "francês", "franceza": "francesa",
  "francezes": "franceses", "mez": "mês", "mezes": "meses", "paiz": "país", "paizes": "países",
  "atraz": "atrás", "traz": "traz", "através": "através", "fiz": "fiz", "princeza": "princesa",
  "baroneza": "baronesa", "duqueza": "duquesa", "condessa": "condessa", "marqueza": "marquesa",
  "burguez": "burguês", "burgueza": "burguesa", "cortez": "cortês", "descortez": "descortês",
  "vez": "vez", "fez": "fez", "diz": "diz", "faz": "faz", "quiz": "quis", "puz": "pus", "poz": "pôs",
  "quizer": "quiser", "quizesse": "quisesse", "quizeram": "quiseram", "quizera": "quisera",
  "puzesse": "pusesse", "puzeram": "puseram", "puzera": "pusera", "pozesse": "pusesse",
  "ouvil-o": "ouvi-lo", "fal-o": "fá-lo", "dil-o": "di-lo", "fil-o": "fi-lo", "tel-o": "tê-lo",
  "vel-o": "vê-lo", "pol-o": "pô-lo", "dal-o": "dá-lo",
  "caracter": "caráter", "caracteres": "caracteres", "character": "caráter",
  "tambem": "também", "porém": "porém", "porem": "porém", "alem": "além", "ninguem": "ninguém",
  "alguem": "alguém", "armazem": "armazém", "vintem": "vintém", "vintens": "vinténs", "nuvem": "nuvem",
  "ate": "até", "sô": "só", "pé": "pé", "ahi": "aí", "ahí": "aí", "alli": "ali", "d'ahi": "daí",
  "d'alli": "dali", "d'aqui": "daqui", "d'elle": "dele", "d'ella": "dela", "d'elles": "deles",
  "d'ellas": "delas", "n'elle": "nele", "n'ella": "nela", "n'elles": "neles", "n'ellas": "nelas",
  "n'um": "num", "n'uma": "numa", "n'uns": "nuns", "n'umas": "numas", "d'um": "dum", "d'uma": "duma",
  "d'este": "deste", "d'esta": "desta", "d'estes": "destes", "d'estas": "destas", "d'esse": "desse",
  "d'essa": "dessa", "d'isso": "disso", "d'isto": "disto", "d'aquelle": "daquele", "d'aquella": "daquela",
  "d'aquillo": "daquilo", "n'este": "neste", "n'esta": "nesta", "n'esse": "nesse", "n'essa": "nessa",
  "n'isso": "nisso", "n'isto": "nisto", "n'aquelle": "naquele", "n'aquella": "naquela", "n'aquillo": "naquilo",
  "d'outro": "doutro", "d'outra": "doutra", "d'onde": "donde", "d'antes": "dantes",
  // revisadas en el informe de build_biblioteca.js --report
  "hade": "há de", "heide": "hei de", "hasde": "hás de", "hãode": "hão de",
  "dahi": "daí", "pateo": "pátio", "pateos": "pátios", "padua": "pádua", "vio": "viu", "sahio": "saiu", "cahio": "caiu",
  "servio": "serviu", "sahi": "saí", "cahi": "caí", "sahira": "saíra", "cahira": "caíra",
  "marquez": "marquês", "marqueza": "marquesa", "mãi": "mãe", "mãis": "mães", "mamãi": "mamãe", "chicara": "xícara", "chicaras": "xícaras",
  "propoz": "propôs", "compoz": "compôs", "dispoz": "dispôs", "suppoz": "supôs", "expoz": "expôs", "oppoz": "opôs", "impoz": "impôs",
  "trez": "três", "setim": "cetim", "teem": "têm", "veem": "veem", "ltaguahy": "Itaguaí", "aldêa": "aldeia", "aldêas": "aldeias",
  "ancia": "ânsia", "ancias": "ânsias", "ancioso": "ansioso", "anciosa": "ansiosa", "anciosos": "ansiosos", "anciosas": "ansiosas",
  "magua": "mágoa", "maguas": "mágoas", "retinir": "retinir", "descompostura": "descompostura",
  "scintillantes": "cintilantes", "scintillante": "cintilante", "scintillar": "cintilar", "ecclesiastica": "eclesiástica",
  "ecclesiastico": "eclesiástico", "ecclesiasticos": "eclesiásticos", "hymno": "hino", "hymnos": "hinos",
  "monosyllabos": "monossílabos", "monosyllabo": "monossílabo", "verosimil": "verossímil", "inverosimil": "inverossímil",
  "giráos": "jiraus", "giráo": "jirau", "máo": "mau", "máos": "maus", "páo": "pau", "páos": "paus", "cháo": "chão",
  "anecdota": "anedota", "anecdotas": "anedotas", "peior": "pior", "peiores": "piores", "poude": "pôde", "cincoenta": "cinquenta",
  "joven": "jovem", "dezesete": "dezessete", "dezeseis": "dezesseis", "dezenove": "dezenove", "extasis": "êxtase",
  "comensaes": "comensais", "qne": "que", "nalguma": "nalguma", "outrosim": "outrossim", "kerozene": "querosene",
  "assucar": "açúcar", "dansar": "dançar", "dansa": "dança", "dansas": "danças", "dansava": "dançava", "dansou": "dançou",
  "pretenção": "pretensão", "resurreição": "ressurreição", "sobresalto": "sobressalto", "sobresaltos": "sobressaltos",
  "socego": "sossego", "socegado": "sossegado", "socegada": "sossegada", "socegar": "sossegar", "socega": "sossega",
  "kiosque": "quiosque", "kiosques": "quiosques", "apolices": "apólices", "incognita": "incógnita", "incognito": "incógnito",
  "recondita": "recôndita", "invalidos": "inválidos", "invalido": "inválido", "incredulo": "incrédulo", "incredulos": "incrédulos",
  "desanimo": "desânimo", "exquisita": "esquisita", "exquisito": "esquisito", "carcassa": "carcaça", "machinalmente": "maquinalmente",
  "paletot": "paletó", "divan": "divã", "vagalumes": "vaga-lumes", "vagalume": "vaga-lume", "bemaventurança": "bem-aventurança",
  "internuncio": "internúncio", "protonotario": "protonotário", "galilea": "galileia", "ptolomeu": "ptolomeu",
  "solemnidade": "solenidade", "solemnidades": "solenidades", "ascenção": "ascensão", "rectidão": "retidão",
  "rectilineo": "retilíneo", "rectilinea": "retilínea", "indirecto": "indireto", "indirecta": "indireta",
  "prescriptas": "prescritas", "prescripto": "prescrito", "aecrescentou": "acrescentou", "vermouth": "vermute",
  "lady": "lady", "dollars": "dólares", "acccento": "acento", "subtil": "sutil", "subtis": "sutis", "subtileza": "sutileza",
  "subtilezas": "sutilezas", "subtilmente": "sutilmente", "logarsinho": "lugarzinho"
};

// No inherited keys: «constructor» or «toString» are words of the texts too.
EXC = Object.assign(Object.create(null), EXC);

// Brazilian spellings that keep the c or p before t / ç (it is pronounced).
var KEEP_CT = Object.create(null);
("pacto pactos apto apta aptos aptas compacto compacta ficção ficções convicção convicções fricção facção facções " +
 "eucalipto egípcio egípcia egípcios núpcias opção opções adepto adeptos rapto raptou abrupto abrupta inepto inepta " +
 "erupção interrupção corrupção corrupto corrupta recepção recepções perspectiva perspectivas aspecto aspectos " +
 "característica características característico convicto invicto pictórico octogenário captar captou capturar " +
 "captura eclipse elíptico egipcíaco nupcial réptil réptiles helicóptero opcional adaptar adaptou adaptação " +
 "optar optou pacto infecção infeccioso sucção cocção dicção fictício fictícia bactéria impacto intacto intacta " +
 "tacto contactar símptoma").split(" ").forEach(function (w) { KEEP_CT[w] = 1; });

// Old spellings that must never remain in a modernized text (the test).
var OLD = ["pharmacia", "pharmacias", "ayres", "estylo", "estylos", "elle", "ella", "elles", "ellas", "sahir",
  "sahiu", "sahida", "theatro", "theatros", "anno", "annos", "commigo", "comtudo", "emquanto", "hontem",
  "escripto", "escriptos", "escripta", "prompto", "assumpto", "fructo", "fructos", "sciencia", "sciencias",
  "philosophia", "philosopho", "physionomia", "lyrio", "lyrios", "mysterio", "egreja", "portuguez", "inglez",
  "paiz", "idéa", "idéas", "effeito", "effeitos", "occasião", "accento", "acção", "acções", "director",
  "aquelle", "aquella", "aquelles", "aquellas", "delle", "della", "delles", "dellas", "nelle", "nella",
  "tambem", "alli", "ahi", "vae", "pae", "quasi", "mez", "mezes", "brazil", "cousas_", "fôra", "póde",
  "sômente", "sómente", "cahir", "cahiu", "comprehender", "comprehendeu", "prohibir", "rhetorica",
  "chimica", "christão", "christãos", "chronica", "orchestra", "baptismo", "victoria", "auctor",
  "exacto", "exacta", "exactamente", "acto", "actos", "signal", "signaes", "assignar", "augmentar",
  "subtil", "scena", "scenas", "extranho", "extrangeiro", "magestade", "thesouro", "thesoura",
  "hespanhol", "humido", "herva", "annel", "affirmar", "affirmou", "difficil", "difficuldade", "succeder",
  "succedeu", "fallar", "fallou", "fallava", "bello", "bella", "bellos", "bellas", "cavallo", "cavallos",
  "gallinha", "sello", "estrella", "estrellas", "villa", "mille", "commum", "immenso", "immensa",
  "communicar", "somma", "lettra", "lettras", "attenção", "attento", "atteno", "effectivamente",
  "exactidão", "sollicito", "aggravar", "addição", "offerecer", "offereceu", "officio", "offício", "graphia",
  "typo", "typos", "sympathia", "sympathico", "systema", "hymno", "martyr", "abysmo", "myope", "ouvil-o",
  "fazel-o", "dizel-o", "vel-o", "fal-o"];

function strip(s) { return String(s).normalize("NFD").replace(/[̀-ͯ]/g, "").normalize("NFC"); }
function marks(s) {
  // per letter: "" or the combining mark(s)
  return String(s).split("").map(function (ch) { var d = ch.normalize("NFD"); return d.length > 1 ? d.slice(1) : ""; });
}

// Letters that look like the old orthography (never in a modern lexicon entry).
var OLDPAT = /ph|th|rh|y|([bdfglmnpt])\1|cc[eiéí]|cç|ü|^h[aeiou]nt|sah|cah|ahi$|ae$|aes$|éa$|éas$|éo$|éos$/;

/* The regular plural and feminine of a word of the list (casa → casas,
   papel → papéis, nação → nações, inglês → inglesa, bonito → bonita). */
function inflect(w) {
  var out = [];
  if (/[aeiouáéíóúâêô]$/.test(w)) out.push(w + "s");
  if (/ão$/.test(w)) { var r = w.slice(0, -2); out.push(r + "ões", r + "ães", r + "ãos"); }
  if (/[rz]$/.test(w)) out.push(w + "es");
  if (/m$/.test(w)) out.push(w.slice(0, -1) + "ns");
  if (/al$/.test(w)) out.push(w.slice(0, -1) + "is");
  if (/el$/.test(w)) out.push(/[áéíóúâêô]/.test(w) ? w.slice(0, -1) + "is" : w.slice(0, -2) + "éis");
  if (/ol$/.test(w)) out.push(w.slice(0, -2) + "óis");
  if (/ul$/.test(w)) out.push(w.slice(0, -1) + "is");
  if (/il$/.test(w)) out.push(/[áéíóúâêô]/.test(w) ? w.slice(0, -2) + "eis" : w.slice(0, -1) + "s");
  if (/o$/.test(w)) out.push(w.slice(0, -1) + "a", w.slice(0, -1) + "as");
  if (/ês$/.test(w)) { var b = w.slice(0, -2) + "es"; out.push(b + "a", b + "as", b + "es"); }
  if (/or$/.test(w)) out.push(w + "a", w + "as");
  if (/ão$/.test(w)) out.push(w.slice(0, -2) + "ã", w.slice(0, -2) + "ãs");
  return out;
}

/* The lexicon of modern forms: the frequency lists, the glossary, the
   phrases and readings of the course, and every form of the conjugator for
   the verbs of the frequency list.  zipf: the frequency of the lemmas. */
function buildLexicon(opts) {
  opts = opts || {};
  var pack = require(path.join(__dirname, "..", "lib", "pack.js"));
  var ctx = pack("pt");
  var freq = pack.data("pt", "frequenza.json"), gloss = pack.data("pt", "glossario.json");
  var lex = Object.create(null), zipf = Object.create(null), sure = Object.create(null);
  var tok = function (s) { return (String(s || "").toLowerCase().match(/[a-zà-öø-ÿ]+/g) || []); };
  var conjForm = Object.create(null), wl2 = null;
  var add = function (w, z, trust) {
    w = String(w).toLowerCase();
    if (!w || /[^a-zà-öø-ÿ-]/.test(w)) return;
    lex[w] = 1;
    if (z != null && (zipf[w] == null || z > zipf[w])) zipf[w] = z;
    if (trust) sure[w] = 1;
    if (trust === "conj") conjForm[w] = 1;
  };
  Object.keys(freq.lemmi).forEach(function (l) { var r = freq.lemmi[l]; add(l, Math.max(r[0], r[1])); });
  Object.keys(freq.forme).forEach(function (f) {
    var r = freq.lemmi[freq.forme[f]];
    add(f, r ? Math.max(r[0], r[1]) - 0.5 : null);
  });
  Object.keys(gloss).forEach(function (k) { tok(k).forEach(function (w) { add(w, null, true); }); tok(gloss[k][0]).forEach(function (w) { add(w, null, true); }); });
  (ctx.Frasi && ctx.Frasi.ALL || []).forEach(function (f) { tok(f.it).forEach(function (w) { add(w, null, true); }); });
  (ctx.Letture && ctx.Letture.EPISODI || []).forEach(function (e) { tok(e.text).forEach(function (w) { add(w, null, true); }); });
  // every form of the verbs
  var C = ctx.Conj;
  var verbs = Object.keys(freq.lemmi).filter(function (l) { return freq.lemmi[l][3] === "v" && /(ar|er|ir|or)$/.test(l) && !OLDPAT.test(l); });
  C.list().forEach(function (v) { if (verbs.indexOf(v) < 0) verbs.push(v); });
  verbs.forEach(function (v) {
    try { if (C.list().indexOf(v) < 0) C.register(v, { es: "" }); } catch (e) { return; }
    var z = freq.lemmi[v] ? Math.max(freq.lemmi[v][0], freq.lemmi[v][1]) - 0.3 : null;
    (C.SIMPLE_TENSES || []).forEach(function (t) {
      var fs;
      try { fs = C.conjugate(v, t, { partial: true }); } catch (e) { return; }
      (fs || []).forEach(function (f) { if (f) tok(f).forEach(function (w) { add(w, z, "conj"); }); });
    });
    ["participle", "gerund"].forEach(function (fn) { try { var f = C[fn](v); if (f) add(f, z, true); } catch (e) { /* */ } });
    try { (C.participles && C.participles(v) || []).forEach(function (f) { add(f, z, true); }); } catch (e) { /* */ }
    try { var im = C.imperative && C.imperative(v); (im || []).forEach(function (f) { if (f) tok(f).forEach(function (w) { add(w, z, true); }); }); } catch (e) { /* */ }
    // participle agreement: feito, feita, feitos, feitas
    try {
      var p = C.participle(v);
      if (p && /o$/.test(p)) [p.slice(0, -1) + "a", p + "s", p.slice(0, -1) + "as"].forEach(function (f) { add(f, z, true); });
    } catch (e) { /* */ }
  });
  // The word list of a modern spell checker (opts.wordlist: VERO, the
  // pt-BR dictionary of LibreOffice, one word per line): its words, their
  // regular plural and feminine, and every form of its verbs.
  if (opts.wordlist) {
    var wverbs = [];
    wl2 = Object.create(null);   // forms of the list's verbs only (suplicio: supliciar)
    opts.wordlist.forEach(function (w) {
      if (!/^[a-zà-öø-ÿ]+(-[a-zà-öø-ÿ]+)*$/.test(w)) return;
      add(w, null, true);
      inflect(w).forEach(function (f) { add(f, null, false); });
      if (/^[a-zà-öø-ÿ]{2,}(ar|er|ir|or)$/.test(w) && verbs.indexOf(w) < 0) wverbs.push(w);
    });
    var known = Object.create(null);
    C.list().forEach(function (v) { known[v] = 1; });
    wverbs.forEach(function (v) {
      try { if (!known[v]) { C.register(v, { es: "" }); known[v] = 1; } } catch (e) { return; }
      (C.SIMPLE_TENSES || []).forEach(function (t) {
        var fs;
        try { fs = C.conjugate(v, t, { partial: true }); } catch (e) { return; }
        (fs || []).forEach(function (f) { if (f) tok(f).forEach(function (w) { add(w, null, false); wl2[w] = 1; }); });
      });
      try {
        var p = C.participle(v);
        if (p) { add(p, null, false); if (/o$/.test(p)) [p.slice(0, -1) + "a", p + "s", p.slice(0, -1) + "as"].forEach(function (f) { add(f, null, false); }); }
        var g = C.gerund(v); if (g) add(g, null, false);
      } catch (e) { /* */ }
    });
  }
  // Out: the old spellings the corpora bring (ella, tambem, anno…) and an
  // unaccented misspelling next to a much more frequent accented form.
  var byKey = Object.create(null);
  Object.keys(lex).forEach(function (w) { var k = strip(w); (byKey[k] = byKey[k] || []).push(w); });
  Object.keys(lex).forEach(function (w) {
    if (EXC[w] && EXC[w] !== w) { delete lex[w]; return; }
    if (OLDPAT.test(w) && !conjForm[w]) { delete lex[w]; return; }
    // European spellings of the corpora (director, victoria, baptismo): out
    // when the Brazilian one, without the mute c or p, is much more frequent.
    if (/[cp](?=[tç])/.test(w) && !KEEP_CT[w]) {
      var zw = zipf[w] || 0;
      var red = [w.replace(/c(?=[tç])/g, ""), w.replace(/p(?=[tç])/g, "")].filter(function (x) { return x !== w; });
      if (red.some(function (x) {
        return (byKey[strip(x)] || []).some(function (y) { return lex[y] && y !== w && (sure[y] || (zipf[y] || 0) > zw + 0.5); });
      })) { delete lex[w]; return; }
    }
    // a form only the list's rare verbs give (suplicio, obliquo) next to
    // a word of the list with accents (suplício, oblíquo): the word
    if (wl2 && wl2[w] && !sure[w] && !conjForm[w] &&
        (byKey[strip(w)] || []).some(function (x) { return x !== w && sure[x]; })) { delete lex[w]; return; }
    if (strip(w) === w && !sure[w]) {
      var z = zipf[w] == null ? 0 : zipf[w];
      var better = (byKey[w] || []).some(function (x) { return x !== w && (zipf[x] || 0) > z + 1; });
      if (better) delete lex[w];
    }
  });
  (opts.extra || []).forEach(function (w) { add(w, null, true); });
  return { has: function (w) { return !!lex[w]; }, zipf: function (w) { return zipf[w] || 0; }, words: lex };
}

/* ---------------------------------------------------------- las reglas */

// 3. Always.
function rules(w) {
  var x = w;
  x = x.replace(/ü/g, "u");
  x = x.replace(/ph/g, "f").replace(/th/g, "t").replace(/rh/g, "r").replace(/ch(?=[rl])/g, "c");
  x = x.replace(/y/g, "i");
  x = x.replace(/([bdfglmnpt])\1/g, "$1");
  x = x.replace(/cc(?=[eiéíê])/g, "c").replace(/cç/g, "ç").replace(/cc(?=[aouáóúâôãõrl])/g, "c");
  // always: comprehender, apprehensão, reprehensível; acquiescer; fructo
  x = x.replace(/prehen/g, "preen").replace(/^acqu/, "aqu").replace(/fruct/g, "frut");
  // -ae(s), -aes → -ai(s): pae, vae, animaes, geraes
  x = x.replace(/([^ã])ae(s?)$/, "$1ai$2");
  return x;
}

// 4. The historical transformations: each returns the variants of w.
var TRANSFORMS = [
  function (w) { return subAll(w, /z/g, "s"); },
  function (w) { return subAll(w, /s(?=[aeiouáéíóúâêô])/g, "z"); },
  function (w) { return subAll(w, /x(?=[ctpq])/g, "s"); },
  function (w) { return subAll(w, /([aeiouáéíóúâêô])s(?=[aeiouáéíóúâêô])/g, "$1ss"); },
  function (w) { return subAll(w, /mn/g, "n"); },
  function (w) { return subAll(w, /ns(?=[aouáóú])/g, "nç"); },
  function (w) { return subAll(w, /ei(?=[aeo])/g, "e"); },
  function (w) { return /[^aeiou]io$/.test(w) ? [w.replace(/io$/, "iu")] : []; },
  function (w) { return /[aeiou]n$/.test(w) ? [w.replace(/n$/, "m")] : []; },
  function (w) { return subAll(w, /g(?=[eiéí])/g, "j"); },
  function (w) { return subAll(w, /ç(?=[aouáóú])/g, "s"); },
  function (w) { return subAll(w, /e/g, "i"); },
  function (w) { return subAll(w, /i/g, "e"); },
  function (w) { return subAll(w, /o/g, "u"); },
  function (w) { return subAll(w, /u/g, "o"); },
  function (w) { return subAll(w, /c(?=[tç])/g, ""); },
  function (w) { return subAll(w, /p(?=[tç])/g, ""); },
  function (w) { return subAll(w, /b(?=[t])/g, ""); },
  function (w) { return subAll(w, /g(?=[mn])/g, ""); },
  function (w) { return subAll(w, /m(?=[^pbaeiouáéíóúâêôãõ])/g, "n"); },
  // the mute h after a vowel (sahir, comprehender, Bahia), never the digraphs
  // ch, lh, nh; an i or u after it keeps its hiatus accent (sahia → saía)
  function (w) {
    var out = [], re = /([aeiouáéíóúâêô])h([aeiouáéíóúâêô])/g, m;
    while ((m = re.exec(w))) {
      var v = m[2], rest = w.slice(m.index + 3);
      // saía, saída, saí, caíram; not sair, caiu, raiz, caindo, rainha
      if ((v === "i" || v === "u") && !(v === "i" && /^u/.test(rest)) && !/^(nh|[rlzmn](?![aeiouáéíóúâêô]))/.test(rest)) {
        v = v === "i" ? "í" : "ú";
      }
      out.push(w.slice(0, m.index) + m[1] + v + rest);
      re.lastIndex = m.index + 1;
    }
    if (out.length > 1) out.push(w.replace(/([aeiouáéíóúâêô])h(?=[aeiouáéíóúâêô])/g, "$1"));   // all at once
    return out;
  },
  function (w) { return /^h/.test(w) ? [w.slice(1)] : []; },
  function (w) { return subAll(w, /ch(?=[eiéí])/g, "qu").concat(subAll(w, /ch(?=[aouáóúrl])/g, "c")); },
  function (w) { return /^sc[eiéí]/.test(w) ? [w.slice(1)] : []; },
  function (w) { return /ão$/.test(w) ? [w.replace(/ão$/, "am")] : []; },
  function (w) { return /oe(s?)$/.test(w) ? [w.replace(/oe(s?)$/, "oi$1")] : []; },
  function (w) { return /[eé]a(s?)$/.test(w) ? [w.replace(/[eé]a(s?)$/, "eia$1")] : []; },
  function (w) { return /[eé]o(s?)$/.test(w) ? [w.replace(/[eé]o(s?)$/, "eu$1")] : []; }
];
function subAll(w, re, rep) {
  // one replacement at a time (each occurrence separately) and all at once
  var out = [], m, r2 = new RegExp(re.source, "g");
  while ((m = r2.exec(w))) {
    out.push(w.slice(0, m.index) + rep + w.slice(m.index + m[0].length));
    if (m[0].length === 0) r2.lastIndex++;
  }
  var all = w.replace(new RegExp(re.source, "g"), rep);
  if (all !== w && out.indexOf(all) < 0) out.push(all);
  return out;
}

// 5. Fixed-accent suffixes.
var SUFFIX = [[/afic([oa]s?)$/, "áfic$1"], [/ogic([oa]s?)$/, "ógic$1"], [/etic([oa]s?)$/, "étic$1"],
  [/astic([oa]s?)$/, "ástic$1"], [/istic([oa]s?)$/, "ístic$1"], [/ific([oa]s?)$/, "ífic$1"], [/onic([oa]s?)$/, "ônic$1"],
  [/omic([oa]s?)$/, "ômic$1"], [/atic([oa]s?)$/, "átic$1"], [/olic([oa]s?)$/, "ólic$1"],[/encia(s?)$/, "ência$1"], [/ancia(s?)$/, "ância$1"], [/avel$/, "ável"], [/aveis$/, "áveis"],
  [/ivel$/, "ível"], [/iveis$/, "íveis"], [/issim([oa]s?)$/, "íssim$1"], [/erio(s?)$/, "ério$1"],
  [/orio(s?)$/, "ório$1"], [/ologo(s?)$/, "ólogo$1"], [/ographo(s?)$/, "ógrafo$1"], [/ografo(s?)$/, "ógrafo$1"]];

function modernizer(opts) {
  opts = opts || {};
  var LEX = opts.lexicon || buildLexicon(opts);
  var byKey = Object.create(null);
  Object.keys(LEX.words).forEach(function (w) { var k = strip(w); (byKey[k] = byKey[k] || []).push(w); });
  var cache = Object.create(null), missing = Object.create(null), how = Object.create(null), seen = Object.create(null);

  function accentCost(o, c) {
    var a = marks(o), b = marks(c), s = 0;
    for (var i = 0; i < a.length; i++) {
      if (a[i] === b[i]) continue;
      s += a[i] && b[i] ? 1.5 : 1;
    }
    return s;
  }
  // The modern forms with the same letters as v, accents aside, and their cost.
  function accented(v) {
    var list = byKey[strip(v)] || [];
    return list.map(function (c) { return { w: c, cost: accentCost(v, c) }; });
  }

  function resolve(w) {
    if (LEX.has(w)) return w;
    var best = null;
    var consider = function (cands, steps) {
      cands.forEach(function (c) {
        var cost = steps + c.cost * 0.9;
        if (!best || cost < best.cost - 1e-9 || (Math.abs(cost - best.cost) < 1e-9 && LEX.zipf(c.w) > LEX.zipf(best.w))) best = { w: c.w, cost: cost };
      });
    };
    consider(accented(w), 0);
    if (best && best.cost < 1) return best.w;
    var frontier = [w], seen = {}; seen[w] = 1;
    for (var depth = 1; depth <= 3; depth++) {
      var next = [];
      frontier.forEach(function (f) {
        TRANSFORMS.forEach(function (T) {
          T(f).forEach(function (v) {
            if (seen[v] || !v) return;
            seen[v] = 1;
            next.push(v);
            consider(accented(v), depth);
          });
        });
      });
      if (best && best.cost <= depth + 0.5) return best.w;
      frontier = next.slice(0, 4000);
    }
    return best ? best.w : null;
  }

  /* Names: the words a text writes with a capital inside a sentence and
     never in lower case (Homero, Humanitas, Shelley, Sanchinha).  They get
     only the exceptions and the safe rules, and only when the result is a
     known word; otherwise they stay as they are.  learn(text) collects
     them before text(). */
  var lowSeen = Object.create(null), capMid = Object.create(null);
  function learn(t) {
    String(t).split(/(_)/).forEach(function (chunk, i, all) {
      var it = all.slice(0, i).filter(function (x) { return x === "_"; }).length % 2 === 1;
      if (it || chunk === "_") return;
      var re = new RegExp(WORD_RE.source, "g"), m;
      while ((m = re.exec(chunk))) {
        var w = m[0], low = w.toLowerCase();
        if (w === low) { lowSeen[low] = 1; continue; }
        var before = chunk.slice(0, m.index).replace(/\s+$/, "");
        if (before && !/[.!?…:—«"“(\[]$/.test(before)) capMid[low] = 1;
      }
    });
  }
  function isName(raw, low) {
    return raw !== low && raw !== raw.toUpperCase() && capMid[low] && !lowSeen[low];
  }

  function word(raw) {
    if (!raw) return raw;
    var low = raw.toLowerCase();
    // chapter numbers
    if (/^[IVXLCDM]+$/.test(raw)) return raw;
    if (isName(raw, low) && !EXC[low]) {
      var rn = rules(low);
      return recase(raw, LEX.has(rn) ? rn : low);
    }
    if (cache[low] == null) cache[low] = lower(low);
    seen[low] = (seen[low] || 0) + 1;
    return recase(raw, cache[low]);
  }

  function lower(w) {
    if (EXC[w]) return EXC[w];
    if (KEEP_CT[w]) return w;
    if (w.indexOf("-") > 0) {
      var parts = w.split("-");
      // the old enclitic: ouvil-o, fazel-a, dizel-os → ouvi-lo, fazê-la, dizê-los
      if (parts.length === 2 && /^(o|a|os|as)$/.test(parts[1]) && /[aeiou]l$/.test(parts[0]) && parts[0].length > 2) {
        var stem = lower(parts[0].slice(0, -1) + "r");            // fazer → fazer (modern), then drop the r
        stem = stem.replace(/r$/, "");
        stem = stem.replace(/a$/, "á").replace(/e$/, "ê").replace(/o$/, "ô");
        return stem + "-l" + parts[1];
      }
      return parts.map(function (p) { return p ? lower(p) : p; }).join("-");
    }
    if (LEX.has(w)) return w;
    var r = rules(w);
    if (EXC[r]) return EXC[r];
    if (LEX.has(r)) return r;
    var hit = resolve(r);
    if (hit) { how[w] = hit; return hit; }
    // an adverb: its adjective, modernized, without its written accent
    // (distinctamente → distintamente, magníficamente → magnificamente)
    if (/.{4,}mente$/.test(w)) {
      var adj = lower(w.slice(0, -5));
      var adv = adj.normalize("NFD").replace(/[́̂̀]/g, "").normalize("NFC") + "mente";
      if (adv !== w) how[w] = adv;
      return adv;
    }
    var s = r;
    for (var i = 0; i < SUFFIX.length; i++) if (SUFFIX[i][0].test(s)) { s = s.replace(SUFFIX[i][0], SUFFIX[i][1]); break; }
    missing[w] = (missing[w] || 0) + 1;
    if (s !== w) how[w] = s;
    return s;
  }

  function recase(orig, mod) {
    if (orig === orig.toLowerCase()) return mod;
    if (orig === orig.toUpperCase() && orig.length > 1) return mod.toUpperCase();
    // Title case, part by part (Jesus-Christo → Jesus-Cristo)
    var op = orig.split("-"), mp = mod.split("-");
    if (op.length === mp.length) {
      return mp.map(function (p, i) {
        var o = op[i];
        if (o && o[0] !== o[0].toLowerCase()) return p.charAt(0).toUpperCase() + p.slice(1);
        return p;
      }).join("-");
    }
    return mod.charAt(0).toUpperCase() + mod.slice(1);
  }

  // A text: every word outside _italics_ (foreign quotations).
  /* An italic passage (Gutenberg marks every italic with _) is a foreign
     quotation when most of its words are not Portuguese, old or new:
     _Elle se irá, mas ficará ella_ is emphasis and gets modernized;
     _Eppur si muove_ or _c'est la vie_ stays as it is. */
  function foreign(chunk) {
    var ws = (chunk.toLowerCase().match(WORD_RE) || []).filter(function (w) { return w.length > 3; }), pt = 0;
    ws.forEach(function (w) {
      if (EXC[w] || /nh|lh|ã|õ/.test(w) || LEX.has(w) || LEX.has(rules(w)) || LEX.has(word(w))) pt++;
    });
    return ws.length > 0 && pt / ws.length < 0.75;
  }

  function text(s) {
    var out = "", italic = false;
    String(s).split(/(_)/).forEach(function (chunk) {
      if (chunk === "_") { italic = !italic; out += chunk; return; }
      if (italic && foreign(chunk)) { out += chunk; return; }
      // lh'o, m'a, t'os → lho, ma, tos; há-de, hei-de → há de, hei de
      chunk = chunk.replace(/\b([lL]h|[mMtT])['’]([oa]s?)\b/g, "$1$2")
        .replace(/\b(hei|hás|has|há|ha|hão|havemos|haveis)-de\b/gi, function (m0, a) { return a + " de"; });
      // the old contracted forms with an apostrophe: d'elle, n'um
      chunk = chunk.replace(/\b([dnDN])['’]([A-Za-zÀ-ÿ]+)/g, function (m0, a, b) {
        var k = (a + "'" + b).toLowerCase();
        if (EXC[k]) return recase(a + b, EXC[k]);
        return m0;
      });
      out += chunk.replace(WORD_RE, function (m0) { return word(m0); });
    });
    return out;
  }

  function unresolved(min) {
    var n = function (w) { return seen[w] || missing[w]; };
    return Object.keys(missing).filter(function (w) { return n(w) >= (min || 1); })
      .sort(function (a, b) { return n(b) - n(a); }).map(function (w) { return [w, how[w] || w, n(w)]; });
  }

  // What was changed by the historical transformations or the accents (not
  // by the exceptions or the safe rules): [old, new, times], to review.
  function changed() {
    return Object.keys(how).filter(function (w) { return how[w] !== w; })
      .sort(function (a, b) { return (seen[b] || 0) - (seen[a] || 0); }).map(function (w) { return [w, how[w], seen[w] || 0]; });
  }

  return { word: word, text: text, learn: learn, unresolved: unresolved, changed: changed, lexicon: LEX };
}

module.exports = { modernizer: modernizer, buildLexicon: buildLexicon, rules: rules, EXC: EXC, OLD: OLD, strip: strip };

if (require.main === module) {
  var m = modernizer();
  var arg = process.argv.slice(2).join(" ");
  console.log(m.text(arg || "Ella sahiu da pharmacia hontem; quasi não ha idéa de que o paiz o ouvil-o, fazel-o."));
}
