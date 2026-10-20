# -*- coding: utf-8 -*-
"""Estação 1 — Primeiros Passos (semanas 1-13, A1 → A2)."""

LESSONS = {

1: {
"intro": "El portugués se escribe casi como el castellano, pero suena "
         "distinto. Esta semana: saludar, presentarte, deletrear tu nombre, "
         "los sonidos nuevos y tus tres primeros verbos.",
"parts": [
 {"h": "Oi, tudo bem? Saludar y deletrear", "blocks": [0, 1, 2]},
 {"h": "Los sonidos que el español no tiene", "blocks": [3, 4, 5, 6]},
 {"h": "Tus primeros verbos: ser, estar y ter", "blocks": [7]},
],
"blocks": [
 {"h": "Oi, tudo bem?",
  "q": [{"prompt": "Te presentan a alguien en un boteco de Botafogo. ¿Qué decís?", "answer": "Muito prazer!", "options": ["Muito prazer!", "Muy prazer!", "Mucho prazer!"]}],
  "r": "Saludo informal: *oi*. Respuesta obligada a *tudo bem?*: *tudo bem* "
       "o *tudo ótimo*. Para presentarte: *eu me chamo…* o *meu nome é…*.",
  "ex": [["*Oi*, tudo bem? — Tudo, e você?", "Hola, ¿todo bien? — Todo bien, ¿y vos?"],
         ["*Bom dia! Boa tarde! Boa noite!*", "¡Buen día! ¡Buenas tardes! ¡Buenas noches!"],
         ["*Eu me chamo* Martín. *Muito prazer!*", "Me llamo Martín. ¡Mucho gusto!"],
         ["Sou de Rosario. E *você*?", "Soy de Rosario. ¿Y vos?"],
         ["*Tchau*, até logo!", "¡Chau, hasta luego!"]],
  "warn": "*bom dia* es masculino (*o dia*) y *boa tarde, boa noite* "
          "femeninos: no digas «boa dia». Y es *muito prazer*, nunca «muy».",
  "tip": "En Río vas a escuchar *e aí?* (¿qué onda?) y *beleza?* (¿todo "
         "joya?). Se contesta *beleza!* o *tranquilo!*."},

 {"h": "Tu y você: cómo tratar a alguien",
  "r": "En casi todo Brasil el «vos» de todos los días es *você*, con el "
       "verbo **en tercera persona**: *você é*, *você tem*.",
  "table": {"head": ["Pronombre", "Se usa", "ser"],
            "rows": [["você", "trato normal (todo Brasil)", "você é"],
                     ["tu", "Sur, Norte y Nordeste; en Río, coloquial", "tu és (en el habla: tu é)"],
                     ["o senhor / a senhora", "respeto, gente mayor, trabajo", "o senhor é"],
                     ["vocês", "ustedes, siempre", "vocês são"]]},
  "ex": [["*Você* é argentino?", "¿Vos sos argentino?"],
         ["*O senhor* é o professor?", "¿Usted es el profesor?"],
         ["*Vocês* são de onde?", "¿Ustedes de dónde son?"],
         ["*Tu* é carioca? (habla de Río)", "¿Vos sos carioca?"]],
  "warn": "Con *você* el verbo va en tercera: *você é*, *você está*. "
          "«Você és» es un error típico del hispanohablante.",
  "more": ["El *tu* conjugado (*tu és, tu tens*) se oye sobre todo en el Sur "
           "y en partes del Norte y del Nordeste. En Río aparece mucho el "
           "*tu* con el verbo de *você* (*tu vai?*): es coloquial. En este "
           "curso practicás con *você*, que sirve en todas partes."]},

 {"h": "El alfabeto: deletrear tu nombre",
  "q": [{"prompt": "¿Cómo se llama la letra H en portugués?", "answer": "agá", "options": ["agá", "hache", "achê"]}],
  "r": "Son 26 letras, con *k, w, y*. Sin *ñ* ni *ll*: se escriben *nh* y "
       "*lh*. La *e* se dice *é* y la *g*, *gê*.",
  "table": {"head": ["Letra", "Nombre", "Letra", "Nombre"],
            "rows": [["A", "a", "N", "ene"],
                     ["B", "bê", "O", "ó"],
                     ["C", "cê", "P", "pê"],
                     ["D", "dê", "Q", "quê"],
                     ["E", "é", "R", "erre"],
                     ["F", "efe", "S", "esse"],
                     ["G", "gê", "T", "tê"],
                     ["H", "agá", "U", "u"],
                     ["I", "i", "V", "vê"],
                     ["J", "jota", "W", "dáblio"],
                     ["K", "cá", "X", "xis"],
                     ["L", "ele", "Y", "ípsilon"],
                     ["M", "eme", "Z", "zê"]]},
  "ex": [["Como se escreve? — *Erre, a, efe, a*.", "¿Cómo se escribe? — R, A, F, A."],
         ["*Sofía*: i com *acento agudo*", "Sofía: i con tilde (acento agudo)"],
         ["*Ç*: cê-cedilha", "la c con cedilla (*cabeça*)"]],
  "tip": "Para deletrear en el teléfono: *é* de «escola», *gê* de "
         "«gente», *jota* de «João». Pedí *Pode soletrar?* (¿Me lo deletreás?)."},

 {"h": "Vocales abiertas y cerradas",
  "r": "La *e* y la *o* tónicas pueden ser **abiertas** (*é*, *ó*) o "
       "**cerradas** (*ê*, *ô*). A veces cambian la palabra.",
  "table": {"head": ["Abierta", "Cerrada", "Diferencia"],
            "rows": [["avó (abuela)", "avô (abuelo)", "ó / ô"],
                     ["é (es)", "e (y)", "é / e"],
                     ["pé, café", "você, português", "é / ê"],
                     ["nó, pó", "ovo, bolo", "ó / ô"]]},
  "ex": [["a *avó* / o *avô*", "la abuela / el abuelo"],
         ["Ela *é* de Recife *e* ele *é* de Belém.", "Ella es de Recife y él es de Belém."],
         ["*café*, *pé*", "é abierta, como en «perro»"],
         ["*você*, *três*", "ê cerrada, casi una «e» corta"]],
  "warn": "*é* (es) lleva tilde; *e* (y) no. Y la conjunción es *e*, nunca "
          "«y»: *Rio e São Paulo*.",
  "more": ["El acento agudo (´) marca vocal abierta; el circunflejo (^), "
           "cerrada: *avó / avô*, *pé / você*. Las *e* y *o* finales sin "
           "acento se reducen en Brasil: *leite* suena casi «léiti», *carro* "
           "casi «cáhu»."]},

 {"h": "Vocales nasales",
  "q": [{"prompt": "¿Cómo se escribe «pan» en portugués?", "answer": "pão", "options": ["pão", "pan", "pao"]}, {"prompt": "¿Cómo se escribe «madre» en portugués?", "answer": "mãe", "options": ["mãe", "mae", "mâe"]}, {"prompt": "¿Cuál tiene una vocal nasal?", "answer": "bom", "options": ["bom", "bola", "boa"]}],
  "r": "Con tilde (*ã, õ*) o ante *m, n* en la sílaba, la vocal suena "
       "**por la nariz**. La *-m* final no se cierra: nasaliza.",
  "ex": [["*mão*, *pão*, *não*", "mano, pan, no: «ão» por la nariz"],
         ["*bom*, *sim*, *um*", "bueno, sí, un: la m final no suena como m"],
         ["*mãe*", "madre: «ãe» nasal"],
         ["*lições*, *põe*", "«õe» nasal"],
         ["*tem*, *também*", "suena «téin», «tambéin»"]],
  "warn": "No pronuncies *sim* como «sim» con los labios cerrados: la "
          "vocal se nasaliza y los labios quedan abiertos.",
  "tip": "Decí «pan» tapándote la nariz y soltala sin pronunciar la n: ese "
         "es el aire de *pão*."},

 {"h": "lh, nh, ç: las letras que te faltan",
  "q": [{"prompt": "¿Cómo se escribe «España» en portugués?", "answer": "Espanha", "options": ["Espanha", "España", "Espania"]}],
  "r": "*nh* = ñ (*vinho*). *lh* = una ll «a la española», con la lengua "
       "en el paladar (*trabalho*). *ç* = s ante *a, o, u* (*cabeça*).",
  "ex": [["*vinho*, *amanhã*", "vino, mañana: nh = ñ"],
         ["*trabalho*, *mulher*", "trabajo, mujer: lh"],
         ["*cabeça*, *açaí*", "cabeza, asaí: ç = s"],
         ["*nação*, *canção*", "nación, canción: -ción → -ção"]],
  "warn": "La *lh* no es la ll ni la y porteña: *filho* no suena «fisho». "
          "Y la ñ no existe en portugués: *Espanha*, *senhor*."},

 {"h": "ti, di, -l, r y rr: el acento carioca",
  "r": "En Brasil *ti* y *di* suenan «chi» y «yi»; la *-l* final, «u». La "
       "*r* inicial y la *rr*, como una j suave.",
  "table": {"head": ["Se escribe", "Suena", "Ejemplo"],
            "rows": [["ti, te final", "chi", "tia, leite"],
                     ["di, de final", "yi (dj)", "dia, cidade"],
                     ["-l final", "u", "Brasil («brasiu»), sal"],
                     ["r inicial, rr", "j suave aspirada", "Rio, carro"],
                     ["s entre vocales", "z", "casa, mesa"],
                     ["v", "v (labio y dientes)", "você, vinho"]]},
  "ex": [["*tia*, *noite*", "«chia», «nóichi»"],
         ["*dia*, *tarde*", "«yía», «tárdji»"],
         ["*Brasil*, *legal*", "«brasiu», «legau»"],
         ["*Rio*, *carro*", "«jío», «cáju»"]],
  "warn": "*casa* se dice con s sonora, como un zumbido: «caza». Y *v* no "
          "es *b*: *vinho* con el labio de abajo contra los dientes.",
  "more": ["El carioca, además, dice la *s* final como «sh»: *mais* suena "
           "«maish», *os meninos* «ush menínush». Es el famoso chiado de "
           "Río. En São Paulo la *s* final es como la tuya; las dos formas "
           "son correctas."]},

 {"h": "ser, estar y ter",
  "q": [{"prompt": "«Tengo hambre.»", "answer": "Estou com fome.", "options": ["Estou com fome.", "Sou fome.", "Sou com fome."]},
        {"prompt": "«¿Vos sos de Córdoba?»", "answer": "Você é de Córdoba?", "options": ["Você é de Córdoba?", "Você és de Córdoba?", "Você está de Córdoba?"]}],
  "r": "*ser* y *estar* se reparten casi como en español; *ter* = tener. "
       "Una diferencia: dónde **queda** algo fijo va con *ficar* (o *estar*): "
       "*o apartamento fica em Botafogo*; con eventos, *ser*: *a festa é em Botafogo*.",
  "table": {"head": ["Persona", "ser", "estar", "ter"],
            "rows": [["eu (yo)", "sou", "estou", "tenho"],
                     ["tu (vos, tú)", "és", "estás", "tens"],
                     ["ele / ela / você (él / ella / vos)", "é", "está", "tem"],
                     ["nós (nosotros)", "somos", "estamos", "temos"],
                     ["eles / elas / vocês (ellos / ellas / ustedes)", "são", "estão", "têm"]]},
  "ex": [["*Sou* argentina, de Mendoza.", "Soy argentina, de Mendoza."],
         ["*Tenho* um irmão. Eles *têm* filhos.", "Tengo un hermano. Ellos tienen hijos."],
         ["*Estou com* fome e *com* sede.", "Tengo hambre y sed."],
         ["O apartamento *fica* em Botafogo; eu *estou* em Copacabana.", "El departamento queda en Botafogo; yo estoy en Copacabana."],
         ["*Não* sou carioca: sou argentino.", "No soy carioca: soy argentino (la negación, não, va antes del verbo)."]],
  "warn": "En Brasil es muy común *estar com* + sensación: *estou com "
          "frio*, *está com sono*. *Tenho fome* también se dice y es correcto.",
  "tip": "*tem* (él tiene) y *têm* (ellos tienen) suenan casi igual: el "
         "circunflejo solo se escribe en el plural.",
  "more": ["La lista de *estar com*: *fome* (hambre), *sede* (sed), *frio* "
           "(frío), *calor*, *sono* (sueño), *pressa* (apuro), *medo* "
           "(miedo), *saudade* (nostalgia). La edad, en cambio, va con "
           "*ter*, como en español: *tenho vinte anos*.",
           "¿Dónde queda? Lo que no se mueve (un edificio, un barrio) va "
           "con *ser* o *ficar*: *a escola é em Copacabana*, *onde fica o "
           "hotel?*. Lo que se mueve, con *estar*: *a Bia está em Ipanema*. "
           "Y la negación es *não*, antes del verbo: *não sou*, *não estou*."]},
]},

2: {
"intro": "Artículo y adjetivo dependen del género y el número del "
         "sustantivo. Esta semana: los plurales raros, los géneros que no "
         "coinciden con el español y cómo decir qué hay.",
"parts": [
 {"h": "Plurales: -s, -ns, -ões, -is", "blocks": [0, 1, 2]},
 {"h": "Género: las trampas", "blocks": [3, 4, 5]},
 {"h": "Decir qué hay: tem y há", "blocks": [6]},
],
"blocks": [
 {"h": "El plural básico: -s y -ns",
  "q": [{"prompt": "Plural de «o homem»", "answer": "os homens", "options": ["os homens", "os homems", "os homes"]}, {"prompt": "Plural de «a viagem»", "answer": "as viagens", "options": ["as viagens", "as viagems", "as viages"]}, {"prompt": "Plural de «o livro»", "answer": "os livros", "options": ["os livros", "os livroes", "os livro"]}],
  "r": "Vocal + *-s*: *casa → casas*. Las palabras en *-m* cambian a "
       "*-ns*: *homem → homens*, *som → sons*.",
  "ex": [["o livr*o* → os livr*os*", "el libro → los libros"],
         ["a praia → as praia*s*", "la playa → las playas"],
         ["o home*m* → os home*ns*", "el hombre → los hombres"],
         ["a viage*m* → as viage*ns*", "el viaje → los viajes"],
         ["o bo*m* → os bo*ns*", "el bueno → los buenos"]],
  "warn": "Nunca «homems»: la *m* se vuelve *n* antes de la *s*. Es "
          "ortografía, el sonido nasal no cambia.",
  "more": ["Al contar, *um* y *dois* tienen femenino: *um quarto, uma "
           "sala*; *dois irmãos, duas irmãs*; *dois quartos, duas "
           "cadeiras*. Del tres en adelante no cambian: *três janelas*, "
           "*quatro livros*. Los números completos llegan en la semana 7."]},

 {"h": "Los plurales de -ão",
  "q": [{"prompt": "Plural de «o limão»:", "answer": "os limões", "options": ["os limões", "os limãos", "os limones"]},
        {"prompt": "Plural de «o pão»:", "answer": "os pães", "options": ["os pães", "os pões", "os panes"]}],
  "r": "Casi siempre *-ão → -ões*. Algunas hacen *-ães* o *-ãos*: "
       "**mirá el español**: pan → *pães*, mano → *mãos*.",
  "table": {"head": ["Plural", "Ejemplos", "Pista del español"],
            "rows": [["-ões (la mayoría)", "limão → limões, estação → estações", "-ones: limones, estaciones"],
                     ["-ães", "pão → pães, alemão → alemães, cão → cães", "-anes: panes, alemanes, canes"],
                     ["-ãos", "mão → mãos, irmão → irmãos, cidadão → cidadãos", "-anos: manos, hermanos, ciudadanos"]]},
  "ex": [["a estaç*ão* → as estaç*ões*", "la estación → las estaciones"],
         ["o p*ão* → os p*ães*", "el pan → los panes"],
         ["a m*ão* → as m*ãos*", "la mano → las manos"],
         ["o irm*ão* → os irm*ãos*", "el hermano → los hermanos"]],
  "tip": "Si en español termina en *-ón/-ones*, en portugués va *-ões*. "
         "Si dudás, *-ões* acierta nueve de cada diez veces."},

 {"h": "-l → -is; -r, -z, -s → -es",
  "r": "La *-l* final cae y entra *-is*: *animal → animais*. Tras *-r, -z* "
       "y *-s* tónica se agrega *-es*: *mar → mares*.",
  "table": {"head": ["Termina en", "Plural", "Ejemplo"],
            "rows": [["-al, -ul", "-ais, -uis", "jornal → jornais, azul → azuis"],
                     ["-el, -ol", "-éis, -óis", "papel → papéis, lençol → lençóis"],
                     ["-il (tónica)", "-is", "barril → barris"],
                     ["-r, -z", "-es", "mulher → mulheres, luz → luzes"],
                     ["-s (tónica)", "-es", "mês → meses, país → países"],
                     ["-s (átona)", "no cambia", "o lápis → os lápis, o ônibus → os ônibus"]]},
  "ex": [["o anima*l* → os anima*is*", "el animal → los animales"],
         ["o pape*l* → os pap*éis*", "el papel → los papeles"],
         ["a flo*r* → as flo*res*", "la flor → las flores"],
         ["o ônibu*s* → os ônibu*s*", "el colectivo → los colectivos"]],
  "warn": "«Animales», «papeles» son del español: en portugués *animais*, "
          "*papéis*. Fijate en la tilde de *papéis* y *lençóis*."},

 {"h": "Masculino y femenino: lo general",
  "q": [{"prompt": "¿Cuál está bien? «la ciudad»", "answer": "a cidade", "options": ["a cidade", "o cidade", "a cidada"]}, {"prompt": "¿Cuál está bien? «el problema»", "answer": "o problema", "options": ["o problema", "a problema", "o problemo"]}, {"prompt": "¿Cuál está bien? «la foto»", "answer": "a foto", "options": ["a foto", "o foto", "a fota"]}],
  "r": "Como en español: *-o* suele ser masculino y *-a* femenino. *-dade* "
       "es femenino; *-agem*, casi siempre.",
  "ex": [["*o* amigo / *a* amiga", "el amigo / la amiga"],
         ["*a* cidade, *a* verdade", "la ciudad, la verdad"],
         ["*o* dia, *o* mapa, *o* problema", "masculinos en -a, como en español"],
         ["*a* tribo, *a* foto", "femeninos en -o"]],
  "tip": "El artículo es parte de la palabra: aprendé *o leite*, *a "
         "viagem*, nunca «leite» a secas."},

 {"h": "Géneros que no coinciden",
  "q": [{"prompt": "¿Cuál está bien? «la leche»", "answer": "o leite", "options": ["o leite", "a leite", "a leche"]},
        {"prompt": "¿Cuál está bien? «el árbol»", "answer": "a árvore", "options": ["a árvore", "o árvore", "o árbore"]}],
  "r": "Varias palabras de todos los días tienen **el género al revés** "
       "que en español. Son las que más puntos hacen perder.",
  "table": {"head": ["Portugués", "Español"],
            "rows": [["o leite, o sangue, o sal, o mel", "la leche, la sangre, la sal, la miel"],
                     ["o nariz, o paradoxo", "la nariz, la paradoja"],
                     ["o costume, o legume, o cume", "la costumbre, la legumbre, la cumbre"],
                     ["a árvore, a ponte, a dor, a cor", "el árbol, el puente, el dolor, el color"],
                     ["a origem, a viagem, a garagem", "el origen, el viaje, el garaje"]]},
  "ex": [["*o* leite gelado", "la leche fría"],
         ["*o* sangue", "la sangre"],
         ["*a* ponte Rio-Niterói", "el puente Río-Niterói"],
         ["*uma* dor forte", "un dolor fuerte"],
         ["*a* cor verde", "el color verde"]],
  "warn": "El adjetivo acompaña al género portugués: *o leite* está "
          "*frio*, *a dor* es *forte*, *a árvore* es *alta*."},

 {"h": "-agem: casi siempre femenino",
  "r": "Las palabras en *-agem* (español *-aje*) son casi siempre **femeninas**: *a "
       "viagem, a mensagem, a garagem, a paisagem* (excepciones: *o personagem, o pajem*).",
  "ex": [["*a* viag*em*", "el viaje"],
         ["*a* mensag*em*", "el mensaje"],
         ["*uma* paisag*em* linda", "un paisaje lindo"],
         ["*as* viag*ens*", "los viajes: plural en -ns"]],
  "warn": "«O viagem» es el error más oído de los argentinos en Brasil. "
          "Pensá en la *-m*: *-agem* = femenino."},

 {"h": "Decir qué hay: tem y há",
  "q": [{"prompt": "«Hay un boteco ahí» (como se dice en Brasil):", "answer": "Tem um boteco ali.", "options": ["Tem um boteco ali.", "Hay um boteco ali.", "Têm um boteco ali."]}],
  "r": "«Hay» se dice *tem* (habla, todo Brasil) o *há* (escrito, "
       "formal). Los dos son invariables: *tem hotéis*, *há hotéis*.",
  "ex": [["*Tem* um boteco ali.", "Hay un bar ahí."],
         ["*Tem* açaí?", "¿Hay asaí?"],
         ["*Há* hotéis bons aqui.", "Hay hoteles buenos acá (escrito)."],
         ["Não *tem* problema.", "No hay problema."]],
  "warn": "Nunca «hay» ni «têm» para decir que hay: *tem quartos*, "
          "no «têm quartos». *têm* es «ellos tienen».",
  "tip": "En la calle, en el bar y en la playa: *tem*. En un cartel o un "
         "mail formal: *há*."},
]},

3: {
"intro": "Esta semana: artículos y cómo se funden con *em, de, a* y *por*. "
         "En portugués esas contracciones son obligatorias, y te sirven para "
         "decir dónde está cada cosa.",
"parts": [
 {"h": "Artículos: o, a, um, uma", "blocks": [0, 1]},
 {"h": "Contracciones: no, do, ao, pelo", "blocks": [2, 3, 4]},
 {"h": "Artículo con nombres y dónde está cada cosa", "blocks": [5, 6]},
],
"blocks": [
 {"h": "El artículo definido: o, a, os, as",
  "q": [{"prompt": "«las playas de Río»", "answer": "as praias do Rio", "options": ["as praias do Rio", "las praias do Rio", "os praias do Rio"]}],
  "r": "*o* = el, *a* = la, *os* = los, *as* = las. Una sola vocal: *o "
       "Rio*, *a praia*.",
  "ex": [["*o* calçadão", "la rambla de la playa"],
         ["*a* praia de Ipanema", "la playa de Ipanema"],
         ["*os* cariocas", "los cariocas"],
         ["*as* ruas da Lapa", "las calles de Lapa"]],
  "warn": "*a* es «la», no la preposición: *a casa* = la casa. «La» no "
          "existe en portugués, y «lo» tampoco: *o importante* = lo importante.",
  "more": ["Por eso *Conheço a Bia* no lleva «a» personal: esa *a* es el "
           "artículo de *Bia*. Con un masculino se ve claro: *conheço o "
           "João*, nunca «conheço ao João». El portugués no marca el "
           "objeto directo de persona con preposición.",
           "Casi todos los países llevan artículo: *o Brasil*, *a "
           "Argentina*, *os Estados Unidos* (*do Brasil*, *na Argentina*). "
           "Sin artículo: *Portugal*, *Angola*, *Cuba*. También algunos "
           "estados (*a Bahia*, *o Ceará*) y ciudades (*o Rio*, *o "
           "Porto*); la mayoría de las ciudades, no: *São Paulo*, *Lisboa*."]},

 {"h": "El indefinido: um, uma, uns, umas",
  "r": "*um* = un, *uma* = una, *uns / umas* = unos, unas. El femenino "
       "lleva la *a*: *uma praia*.",
  "ex": [["*um* mate de galão", "un mate de bidón (el de la playa)"],
         ["*uma* água de coco", "un agua de coco"],
         ["*uns* amigos de Niterói", "unos amigos de Niterói"],
         ["*umas* fotos do Cristo", "unas fotos del Cristo"]],
  "warn": "No es «uno»: *um* ante sustantivo y también solo (*só um*). Y "
          "*um* suena nasal, sin cerrar los labios."},

 {"h": "em + artículo: no, na, nos, nas",
  "q": [{"prompt": "«Estoy en la playa.»", "answer": "Estou na praia.", "options": ["Estou na praia.", "Estou em a praia.", "Estou en la praia."]}],
  "r": "*em* (en) se funde con el artículo: *em + o = no*, *em + a = na*. "
       "Con *um, uma*: *num, numa*, sobre todo al hablar.",
  "table": {"head": ["", "Forma", "Significa", "Ejemplo"],
            "rows": [["em + o", "no", "en el", "Estou *no* hotel."],
                     ["em + a", "na", "en la", "Ela está *na* praia."],
                     ["em + os", "nos", "en los", "*nos* bares da Lapa"],
                     ["em + as", "nas", "en las", "*nas* ruas do Centro"],
                     ["em + um", "num", "en un", "*num* prédio antigo"],
                     ["em + uma", "numa", "en una", "*numa* praia linda"],
                     ["em + uns / umas", "nuns, numas", "en unos, en unas", "*nuns* dias; *numas* fotos"]]},
  "ex": [["Estou *no* Rio.", "Estoy en Río."],
         ["Ela está *na* praia.", "Ella está en la playa."],
         ["*Nos* fins de semana tem feira.", "Los fines de semana hay feria."],
         ["Tem um bar *num* prédio antigo.", "Hay un bar en un edificio viejo."]],
  "warn": "«Em o» y «em a» **no existen**: siempre *no, na*. Y *no* es "
          "*em + o* (en el), **no** la negación: esa es *não*.",
  "tip": "*em um* también se escribe (*em um bar*); *num* es más hablado. "
         "Pero con *o, a, os, as* la contracción es obligatoria."},

 {"h": "de + artículo: do, da, dos, das",
  "q": [{"prompt": "Elegí la que va", "stem": "a praia ___ Leblon", "answer": "do", "options": ["do", "de o", "da"]}, {"prompt": "Elegí la que va", "stem": "a casa ___ Bia", "answer": "da", "options": ["da", "de a", "do"]}, {"prompt": "Elegí la que va", "stem": "Sou ___ Salvador.", "answer": "de", "options": ["de", "do", "da"]}],
  "r": "*de + o = do*, *de + a = da*: *a praia do Leblon*, *a casa da "
       "Bia*. Sin artículo, *de* queda solo: *de Buenos Aires*.",
  "table": {"head": ["", "Forma", "Significa", "Ejemplo"],
            "rows": [["de + o", "do", "del", "o Cristo *do* Corcovado"],
                     ["de + a", "da", "de la", "a casa *da* Bia"],
                     ["de + os", "dos", "de los", "a praia *dos* cariocas"],
                     ["de + as", "das", "de las", "a rua *das* flores"]]},
  "ex": [["o Cristo *do* Corcovado", "el Cristo del Corcovado"],
         ["a praia *da* Urca", "la playa de la Urca"],
         ["o bondinho *do* Pão de Açúcar", "el teleférico del Pan de Azúcar"],
         ["Sou *de* Salvador.", "Soy de Salvador (ciudad sin artículo)."]],
  "warn": "«de la», «del» no existen: *da*, *do*. Y ojo con *da*, que "
          "parece «da» de *dar*: acá es preposición + artículo.",
  "tip": "Con *um, uma*, en Brasil se escribe separado: *de um amigo*, *de "
         "uma amiga*. *dum, duma* se oyen, pero son más de Portugal."},

 {"h": "a + artículo y por + artículo",
  "r": "*a + o = ao*, *a + a = à* (con acento grave: la crase). *por + o = "
       "pelo*, *por + a = pela*.",
  "table": {"head": ["", "Forma", "Significa", "Ejemplo"],
            "rows": [["a + o", "ao", "al", "uma visita *ao* Cristo"],
                     ["a + a", "à", "a la", "um passeio *à* praia"],
                     ["a + os", "aos", "a los", "fotos *aos* amigos"],
                     ["a + as", "às", "a las", "uma viagem *às* praias do Sul"],
                     ["por + o", "pelo", "por el", "*pelo* calçadão"],
                     ["por + a", "pela", "por la", "*pela* manhã"],
                     ["por + os", "pelos", "por los", "*pelos* bairros"],
                     ["por + as", "pelas", "por las", "*pelas* ruas da Lapa"]]},
  "ex": [["uma visita *ao* Maracanã", "una visita al Maracaná"],
         ["um passeio *à* praia", "un paseo a la playa (a + a = à)"],
         ["um passeio *pelo* calçadão", "un paseo por la rambla"],
         ["*pela* manhã", "por la mañana"]],
  "warn": "Nunca «por o» ni «por a»: *pelo, pela*. Y *à* lleva acento "
          "grave (`), no agudo: *á* es otra cosa (*já*, *lá*, *está*), no la fusión a + a.",
  "more": ["El acento grave de *à* se llama *crase* y marca la fusión de la "
           "preposición *a* con el artículo *a*. Vas a verla a fondo en la "
           "semana 36; por ahora alcanza con *vou à praia*, *às duas* y "
           "*à noite*."]},

 {"h": "Artículo ante nombres y posesivos",
  "q": [{"prompt": "«Juan está en casa.» (como se dice en Río)", "answer": "O João está em casa.", "options": ["O João está em casa.", "João está na casa.", "El João está em casa."]}],
  "r": "En Río y buena parte de Brasil los nombres de persona llevan "
       "artículo: *o João*, *a Bia*. También el posesivo: *a minha casa*.",
  "table": {"head": ["Significa", "m. sg.", "f. sg.", "m. pl.", "f. pl.", "Ejemplo"],
            "rows": [["mi", "(o) meu", "(a) minha", "(os) meus", "(as) minhas", "*a minha* amiga"],
                     ["tu (de você); su (de o senhor)", "(o) seu", "(a) sua", "(os) seus", "(as) suas", "*o seu* nome"],
                     ["nuestro", "(o) nosso", "(a) nossa", "(os) nossos", "(as) nossas", "*a nossa* casa"],
                     ["de él (va detrás, no cambia)", "o carro dele", "a casa dele", "os livros dele", "as chaves dele", "O carro *dele* está aqui."],
                     ["de ella (va detrás, no cambia)", "o carro dela", "a casa dela", "os livros dela", "as chaves dela", "A casa *dela* é em Botafogo."]]},
  "ex": [["*O* Rafa está em casa.", "Rafa está en casa."],
         ["*A* Bia é de Niterói.", "Bia es de Niterói."],
         ["É *a minha* amiga.", "Es mi amiga."],
         ["Estou *na* casa *da* Ana.", "Estoy en la casa de Ana."]],
  "warn": "*seu* en Brasil es «tu» (de *você*), casi nunca «su» de él: "
          "para eso va *dele, dela* detrás: *o carro dele*.",
  "tip": "*em casa* = en casa (la propia), sin artículo: *estou em casa*. "
         "*na casa da Ana* = en lo de Ana.",
  "more": ["El artículo ante nombres propios es opcional y varía por "
           "región: en Río, São Paulo y el Sur es lo normal (*o Pedro*); en "
           "partes del Nordeste y en textos formales se omite. Con "
           "posesivos (semana 10) también es opcional en Brasil: *minha "
           "casa* y *a minha casa* valen los dos."]},

 {"h": "¿Dónde está? Estar + em",
  "r": "Para ubicar: *estar* + lugar con contracción. Las locuciones "
       "llevan *de* y se contraen: *perto da praia*, *em frente ao bar*.",
  "table": {"head": ["Portugués", "Español", "Ejemplo"],
            "rows": [["perto de / longe de", "cerca de / lejos de", "*perto da* praia, *longe do* Centro"],
                     ["ao lado de", "al lado de", "*ao lado do* banco"],
                     ["em frente a / de", "enfrente de", "*em frente ao* metrô"],
                     ["em cima de / embaixo de", "arriba de / abajo de", "*em cima da* mesa, *embaixo da* cama"],
                     ["atrás de / dentro de", "detrás de / dentro de", "*atrás do* hotel, *dentro da* bolsa"]]},
  "ex": [["O hotel está *perto da* praia.", "El hotel está cerca de la playa."],
         ["A padaria é *ao lado do* banco.", "La panadería está al lado del banco."],
         ["O bar está *em frente ao* metrô.", "El bar está enfrente del subte."],
         ["A chave está *em cima da* mesa.", "La llave está arriba de la mesa."],
         ["A escola é *atrás do* hotel.", "La escuela queda detrás del hotel."]],
  "warn": "Para lugares fijos (edificios, barrios) se usa *ser* o *ficar*, "
          "además de *estar*: *a padaria é ao lado*, *onde fica o metrô?*."},
]},

4: {
"intro": "Describir personas: de dónde son, cómo son, cómo están. "
         "Concordancia, colores, gentilicios y *muito*, la palabra que "
         "todo argentino dice mal el primer día.",
"parts": [
 {"h": "Concordancia y plurales del adjetivo", "blocks": [0, 1]},
 {"h": "Nacionalidades y colores", "blocks": [2, 3]},
 {"h": "muito y cómo describir a alguien", "blocks": [4, 5, 6]},
],
"blocks": [
 {"h": "Adjetivos: cuatro formas o dos",
  "r": "En *-o*: cuatro formas (*alto, alta, altos, altas*). En *-e* o "
       "consonante: dos (*forte, fortes*; *feliz, felizes*).",
  "table": {"head": ["", "masc. sing.", "fem. sing.", "masc. pl.", "fem. pl."],
            "rows": [["-o", "alto", "alta", "altos", "altas"],
                     ["-e", "alegre", "alegre", "alegres", "alegres"],
                     ["consonante", "feliz", "feliz", "felizes", "felizes"]]},
  "ex": [["O Pedro é *alto*; a Bia é *alta*.", "Pedro es alto; Bia es alta."],
         ["As praias são *lindas*.", "Las playas son lindas."],
         ["uma cidade *alegre*", "una ciudad alegre"],
         ["Eles são *felizes*.", "Ellos son felices."]],
  "tip": "El adjetivo va casi siempre **después** del sustantivo, como en "
         "español: *um bairro tranquilo*."},

 {"h": "Plurales del adjetivo en -l y -ão",
  "q": [{"prompt": "Plural de «azul»:", "answer": "azuis", "options": ["azuis", "azules", "azus"]}],
  "r": "Igual que los sustantivos: *-l → -is* (*fácil → fáceis*, *azul → "
       "azuis*), *-ão → -ães / -ões / -ãos*.",
  "table": {"head": ["Singular", "Plural", "Regla"],
            "rows": [["fácil, difícil", "fáceis, difíceis", "-il átona → -eis"],
                     ["gentil", "gentis", "-il tónica → -is"],
                     ["azul, legal", "azuis, legais", "-ul, -al → -uis, -ais"],
                     ["espanhol", "espanhóis", "-ol → -óis"],
                     ["alemão", "alemães", "-ão → -ães"]]},
  "ex": [["olhos *azuis*", "ojos azules"],
         ["exercícios *fáceis*", "ejercicios fáciles"],
         ["uns caras *legais*", "unos chabones copados"],
         ["turistas *espanhóis*", "turistas españoles"]],
  "warn": "«fáciles», «azules», «españoles» son del español. Acá la *l* "
          "cae: *fáceis*, *azuis*, *espanhóis*."},

 {"h": "Nacionalidades",
  "q": [{"prompt": "«Ella es portuguesa.»", "answer": "Ela é portuguesa.", "options": ["Ela é portuguesa.", "Ela é portuguêsa.", "Ela é portugueza."]}],
  "r": "*-ês → -esa* (*francês, francesa*); *-ão → -ã* (*alemão, alemã*); "
       "*-o → -a*. En *-a* o *-ense*, una forma. Siempre con minúscula.",
  "table": {"head": ["Masculino", "Femenino", "Plural masc."],
            "rows": [["argentino", "argentina", "argentinos"],
                     ["brasileiro", "brasileira", "brasileiros"],
                     ["português", "portuguesa", "portugueses"],
                     ["inglês", "inglesa", "ingleses"],
                     ["alemão", "alemã", "alemães"],
                     ["espanhol", "espanhola", "espanhóis"],
                     ["canadense", "canadense", "canadenses"],
                     ["carioca", "carioca", "cariocas"]]},
  "ex": [["Ele é *brasileiro*, ela é *argentina*.", "Él es brasileño, ella es argentina."],
         ["Sou *uruguaia*.", "Soy uruguaya."],
         ["A Lena é *alemã*.", "Lena es alemana."],
         ["Eles são *cariocas*, do Rio.", "Ellos son cariocas, de Río."]],
  "warn": "*portuguesa*, *francesa*, *inglesa* sin tilde y con *s*: el "
          "circunflejo de *português* se va en el femenino.",
  "tip": "Gentilicios de Brasil: *carioca* (ciudad de Río), *fluminense* "
         "(estado de Río), *paulistano* (ciudad de São Paulo), *paulista* "
         "(estado), *gaúcho* (Rio Grande do Sul), *baiano*, *mineiro*."},

 {"h": "Los colores",
  "r": "Concuerdan como cualquier adjetivo. Ojo: *roxo* es violeta, no "
       "rojo; rojo es *vermelho*. *cinza, rosa, laranja* no cambian.",
  "table": {"head": ["Portugués", "Español"],
            "rows": [["vermelho / vermelha", "rojo / roja"],
                     ["amarelo, branco, preto", "amarillo, blanco, negro"],
                     ["azul, verde", "azul, verde (dos formas)"],
                     ["roxo", "violeta, morado"],
                     ["cinza, rosa, laranja", "gris, rosa, naranja (invariables)"],
                     ["marrom", "marrón"]]},
  "ex": [["a camisa *vermelha* do Flamengo", "la camiseta roja del Flamengo"],
         ["um biquíni *roxo*", "una bikini violeta"],
         ["os carros *pretos*", "los autos negros"],
         ["uns tênis *cinza*", "unas zapatillas grises"]],
  "warn": "*roxo* = violeta. Si pedís una remera «roxa» esperando roja, "
          "vas a salir con una violeta."},

 {"h": "muito: nunca «muy»",
  "q": [{"prompt": "«La playa es muy linda.»", "answer": "A praia é muito linda.", "options": ["A praia é muito linda.", "A praia é muy linda.", "A praia é muita linda."]},
        {"prompt": "«Tengo muchos amigos en Río.»", "answer": "Tenho muitos amigos no Rio.", "options": ["Tenho muitos amigos no Rio.", "Tenho muito amigos no Rio.", "Tenho muy amigos no Rio."]}],
  "r": "*muito* sirve para «muy» y para «mucho». Ante adjetivo **no "
       "cambia**; ante sustantivo **concuerda**: *muitos amigos*.",
  "ex": [["Ela é *muito* simpática.", "Ella es muy simpática."],
         ["Está *muito* calor.", "Hace mucho calor."],
         ["Tenho *muitas* amigas.", "Tengo muchas amigas."],
         ["Tem *muita* gente na praia.", "Hay mucha gente en la playa."],
         ["Obrigado! — *Muito* obrigado!", "¡Gracias! — ¡Muchas gracias!"]],
  "warn": "«Muy» no existe en portugués. Y ante adjetivo *muito* es "
          "invariable: *muito bonitas*, nunca «muitas bonitas»."},

 {"h": "Describir a alguien: ser, estar, ter",
  "r": "Carácter con *ser*, estado con *estar*, aspecto con *ter* "
       "(*tem olhos verdes*, *tem cabelo cacheado*).",
  "ex": [["Ela *é* alta e *tem* cabelo castanho.", "Es alta y tiene el pelo castaño."],
         ["O Lucas *tem* olhos azuis.", "Lucas tiene ojos azules."],
         ["O Rafa *é* muito engraçado.", "Rafa es muy gracioso."],
         ["Hoje ela *está* cansada.", "Hoy ella está cansada."],
         ["Ele é *chato*.", "Es un pesado (no «chato»)."]],
  "warn": "Falsos amigos del carácter: *esquisito* = raro; *chato* = "
          "pesado, aburrido; *bravo* = enojado. Ninguno significa lo que "
          "parece.",
  "more": ["Para el pelo: *cabelo liso* (lacio), *cacheado* o *crespo* "
           "(rulos), *loiro* (rubio), *ruivo* (pelirrojo), *careca* "
           "(pelado). *pelado* en portugués significa «desnudo»: no lo "
           "uses para un calvo."]},

 {"h": "Sotaque da semana: Rio de Janeiro",
  "q": [{"prompt": "En Río, «Que maneiro!» quiere decir…", "answer": "¡Qué copado!", "options": ["¡Qué copado!", "¡Qué manera!", "¡Qué maniático!"]}],
  "r": "El carioca *chia*: la *s* final suena como «sh» (*mais* ≈ «maish») y la *r* es aspirada. Tres palabras de la calle: *maneiro*, *mermão*, *partiu*.",
  "ex": [["Que *maneiro*!", "¡Qué copado!"], ["Ô, *mermão*, tudo bem?", "Eh, hermano, ¿todo bien?"], ["*Partiu* praia!", "¡A la playa!"], ["Vamos à *Lapa* mais tarde?", "¿Vamos a Lapa más tarde? (la s de «mais» suena «sh»)"]],
  "tip": "Cada cuatro semanas, un acento: Brasil tiene muchos y todos son portugués. La voz de la app es la estándar: el acento no se oye, las palabras sí."},

]},

5: {
"intro": "Llegan los verbos regulares. Con tres terminaciones ya podés "
         "contar tu rutina y tu trabajo. La gran novedad: *você* y *a "
         "gente* van con el verbo en tercera persona.",
"parts": [
 {"h": "Las tres conjugaciones", "blocks": [0, 1, 2]},
 {"h": "Pronombres y grafía", "blocks": [3, 4]},
 {"h": "Tu rutina y tu trabajo", "blocks": [5, 6, 7]},
],
"blocks": [
 {"h": "-ar, -er, -ir en presente",
  "q": [{"prompt": "«Nosotros vivimos en Botafogo.»", "answer": "Nós moramos em Botafogo.", "options": ["Nós moramos em Botafogo.", "Nós moremos em Botafogo.", "Nós moramos no Botafogo."]}],
  "r": "Sacá *-ar, -er, -ir* y agregá las terminaciones. Las del plural son "
       "casi las del español: *-amos, -emos, -imos*; *-am, -em*.",
  "table": {"head": ["", "falar", "comer", "abrir"],
            "rows": [["eu", "falo", "como", "abro"],
                     ["tu", "falas", "comes", "abres"],
                     ["ele / ela / você", "fala", "come", "abre"],
                     ["nós", "falamos", "comemos", "abrimos"],
                     ["eles / elas / vocês", "falam", "comem", "abrem"]]},
  "ex": [["Eu *moro* em Copacabana.", "Vivo en Copacabana."],
         ["Ela *trabalha* num banco.", "Ella trabaja en un banco."],
         ["Nós *bebemos* mate na praia.", "Tomamos mate en la playa."],
         ["Eles *abrem* a loja cedo.", "Abren el negocio temprano."]],
  "warn": "Tercera plural en *-am / -em*, nunca «-an / -en»: *eles falam*, "
          "*eles comem*. La *m* final nasaliza la vocal.",
  "more": ["Un regular que vas a oír a cada rato: *gostar de* = gustar, "
           "pero dado vuelta. El que siente el gusto es el sujeto y lo que "
           "gusta va con *de*: *eu gosto de samba* (me gusta el samba), "
           "*ela gosta do Rio* (de + o). Lo ves a fondo en la semana 14."]},

 {"h": "Você y vocês: tercera persona",
  "r": "*você* conjuga como *ele*; *vocês*, como *eles*. En la práctica, "
       "en Brasil usás tres formas: *falo, fala, falamos*… y *falam*.",
  "ex": [["*Você fala* português?", "¿Hablás portugués?"],
         ["*Vocês moram* no Rio?", "¿Ustedes viven en Río?"],
         ["*Você trabalha* aqui?", "¿Trabajás acá?"],
         ["*Tu falas* espanhol? (Sur)", "¿Hablás español?"]],
  "warn": "«Você falas» es el calco de «vos hablás». Con *você*, siempre "
          "tercera: *você fala*, *você come*, *você abre*."},

 {"h": "A gente = nosotros",
  "q": [{"prompt": "«Nosotros comemos en el boteco.» (habla)", "answer": "A gente come no boteco.", "options": ["A gente come no boteco.", "A gente comemos no boteco.", "A gente comem no boteco."]}],
  "r": "En el habla, *a gente* reemplaza a *nós* y lleva el verbo **en "
       "tercera del singular**: *a gente fala*, *a gente mora*.",
  "ex": [["*A gente mora* perto da praia.", "Vivimos cerca de la playa."],
         ["*A gente come* muito açaí.", "Comemos mucho asaí."],
         ["*Nós moramos* em Niterói. (más formal)", "Vivimos en Niterói."],
         ["*A gente trabalha* no Centro.", "Trabajamos en el Centro."]],
  "warn": "«A gente vamos» o «a gente falamos» es un error estigmatizado: "
          "*a gente vai*, *a gente fala*.",
  "tip": "*a gente* no es «la gente» (eso es *as pessoas*). *Tem muita "
         "gente* = hay mucha gente; *a gente vai* = vamos."},

 {"h": "El pronombre sujeto se dice",
  "r": "En Brasil se dice el sujeto mucho más que en español: *eu acho*, "
       "*você sabe*, *ele trabalha*. Sin él, *fala* no dice quién habla.",
  "ex": [["*Eu* trabalho e *eu* estudo.", "Trabajo y estudio."],
         ["*Você* mora aqui?", "¿Vivís acá?"],
         ["*Ele* chega tarde.", "Llega tarde (él)."],
         ["Trabalho de manhã.", "También es correcto sin *eu*."]],
  "tip": "*fala* puede ser *ele, ela, você* o *a gente*: por eso el "
         "brasileño pone el pronombre. Imitalo y vas a sonar natural."},

 {"h": "Cambios de letra para conservar el sonido",
  "q": [{"prompt": "«Conozco Ipanema.»", "answer": "Eu conheço Ipanema.", "options": ["Eu conheço Ipanema.", "Eu conhezco Ipanema.", "Eu conheco Ipanema."]}],
  "r": "Ante *o* y *a*, algunas raíces cambian de letra para no cambiar "
       "de sonido: *conhecer → conheço*, *dirigir → dirijo*.",
  "table": {"head": ["Infinitivo", "eu", "ele", "Cambio"],
            "rows": [["conhecer", "conheço", "conhece", "c → ç"],
                     ["esquecer", "esqueço", "esquece", "c → ç"],
                     ["dirigir", "dirijo", "dirige", "g → j"],
                     ["corrigir", "corrijo", "corrige", "g → j"],
                     ["ficar, pegar", "fico, pego", "fica, pega", "sin cambio"]]},
  "ex": [["Eu *conheço* o Rio.", "Conozco Río."],
         ["Eu *dirijo* um táxi.", "Manejo un taxi."],
         ["Eu *fico* em casa.", "Me quedo en casa."]],
  "warn": "*conheço*, no «conozco» ni «conheco». El español agrega una "
          "*z*; el portugués solo cambia *c* por *ç*."},

 {"h": "Tu trabajo",
  "q": [{"prompt": "«Soy médica.»", "answer": "Sou médica.", "options": ["Sou médica.", "Sou uma médica.", "Estou médica."]}],
  "r": "Profesión con *ser* y sin artículo: *sou professor*. *trabalhar "
       "em* (lugar), *trabalhar como / de* (función).",
  "ex": [["*Sou* engenheira.", "Soy ingeniera."],
         ["Trabalho *num* escritório no Centro.", "Trabajo en una oficina en el Centro."],
         ["Ele trabalha *como* garçom na Lapa.", "Trabaja de mozo en Lapa."],
         ["A Bia é *advogada*.", "Bia es abogada."]],
  "warn": "*escritório* = oficina (de trabajo); *oficina* = taller "
          "mecánico. «Trabalho numa oficina» es trabajar en un taller."},

 {"h": "Tu rutina: el día y la semana",
  "r": "Partes del día: *de manhã*, *à tarde*, *à noite*. Frecuencia: "
       "*todo dia*, *sempre*, *às vezes*, *nunca*.",
  "ex": [["*Acordo* cedo *todo dia*.", "Me despierto temprano todos los días."],
         ["*De manhã* eu corro no calçadão.", "A la mañana corro por la rambla."],
         ["*Almoço* ao meio-dia.", "Almuerzo al mediodía."],
         ["*À noite* a gente *janta* em casa.", "A la noche cenamos en casa."],
         ["*Às vezes* eu trabalho no sábado.", "A veces trabajo el sábado."]],
  "warn": "*acordar* = despertarse (sin *se*). «Acordar» del español es "
          "*combinar*. Y *todo dia* = todos los días (*todos os dias* "
          "también vale).",
  "more": ["En Brasil se *almoça* entre las 12 y las 14 y se *janta* entre "
           "las 19 y las 21: más temprano que en Argentina. El *café da "
           "manhã* es el desayuno; *lanche* es la merienda o un tentempié.",
           "Para lo que se repite un día fijo: *aos domingos* (a + os), "
           "*às sextas* (a + as) = los domingos, los viernes. Para decir "
           "cuánto hace: *moro aqui há um ano* o *faz um ano* (hace un "
           "año); nunca «desde um ano»: *desde* va con una fecha, "
           "*desde 2020*."]},

 {"h": "Tu con su verbo: tu falas, tu és",
  "q": [{"prompt": "En Porto Alegre o en Belém, ¿cómo se dice «¿vos hablás portugués?» con tu y su verbo?", "answer": "Tu falas português?", "options": ["Tu falas português?", "Tu falar português?", "Tu fala portugueses?"]}],
  "r": "En el Sur, el Norte y parte del Nordeste se usa *tu*: con su verbo en la norma (*tu falas*); en el habla, con el de *você* (*tu fala*).",
  "table": {"head": ["você", "tu (norma)", "tu (habla)"], "rows": [["você fala", "tu falas", "tu fala"], ["você come", "tu comes", "tu come"], ["você é", "tu és", "tu é"], ["você tem", "tu tens", "tu tem"]]},
  "ex": [["*Tu és* de Belém?", "¿Sos de Belém? (Pará: tu con su verbo)"], ["*Tu falas* muito bem!", "¡Hablás muy bien!"], ["*Tu vai* hoje? — Vou.", "¿Vas hoy? —Voy. (Sur, habla: tu + verbo de você)"]],
  "warn": "Para producir, quedate con *você* + 3.ª persona: vale en todo Brasil. El *tu* lo tenés que entender, porque la mitad del país lo usa."},

]},

6: {
"intro": "Los irregulares más usados: *ir, fazer, poder, querer*… Con ellos "
         "armás planes e invitaciones. La buena noticia: el portugués no "
         "diptonga como el español.",
"parts": [
 {"h": "ir, vir, fazer, dizer, trazer", "blocks": [0, 1]},
 {"h": "poder, querer, saber, ver, dar, pôr, sair…", "blocks": [2, 3, 4]},
 {"h": "Sin diptongos, e invitaciones", "blocks": [5, 6]},
],
"blocks": [
 {"h": "ir y vir",
  "q": [{"prompt": "«Ellos van a la playa.»", "answer": "Eles vão à praia.", "options": ["Eles vão à praia.", "Eles van à praia.", "Eles vai à praia."]}],
  "r": "*ir* va hacia allá; *vir*, hacia donde está el que habla. Son muy "
       "irregulares: aprendelos juntos.",
  "table": {"head": ["", "ir", "vir"],
            "rows": [["eu", "vou", "venho"],
                     ["tu", "vais", "vens"],
                     ["ele / você", "vai", "vem"],
                     ["nós", "vamos", "vimos"],
                     ["eles / vocês", "vão", "vêm"]]},
  "ex": [["*Vou* ao Maracanã.", "Voy al Maracaná."],
         ["Você *vem* à festa?", "¿Venís a la fiesta?"],
         ["*Vamos* à praia!", "¡Vamos a la playa!"],
         ["Eles *vêm* de São Paulo.", "Vienen de San Pablo."]],
  "warn": "*vem* (él viene) / *vêm* (ellos vienen): el circunflejo marca el "
          "plural. Y *nós vimos* (venimos) es igual a «vimos» de *ver*."},

 {"h": "fazer, dizer, trazer",
  "r": "Los tres cambian en *eu* (*faço, digo, trago*) y pierden la *-e* "
       "en *ele* (*faz, diz, traz*).",
  "table": {"head": ["", "fazer", "dizer", "trazer"],
            "rows": [["eu", "faço", "digo", "trago"],
                     ["tu", "fazes", "dizes", "trazes"],
                     ["ele / você", "faz", "diz", "traz"],
                     ["nós", "fazemos", "dizemos", "trazemos"],
                     ["eles / vocês", "fazem", "dizem", "trazem"]]},
  "ex": [["O que você *faz* no sábado?", "¿Qué hacés el sábado?"],
         ["Eu *faço* ioga no Arpoador.", "Hago yoga en el Arpoador."],
         ["Ele *diz* que sim.", "Dice que sí."],
         ["Eu *trago* o violão.", "Yo traigo la guitarra."]],
  "warn": "*faço* con *ç*, nunca «fago» ni «hago»; *trago*, no «traigo». "
          "*faz* y *diz* terminan en *z*."},

 {"h": "poder, querer, saber",
  "q": [{"prompt": "«¿Podés venir hoy?»", "answer": "Você pode vir hoje?", "options": ["Você pode vir hoje?", "Você puede vir hoje?", "Você podes vir hoje?"]}],
  "r": "Irregulares en *eu*: *posso, quero, sei*. El resto es regular y "
       "**sin diptongo**: *pode*, *quer*, *sabe*.",
  "table": {"head": ["", "poder", "querer", "saber"],
            "rows": [["eu", "posso", "quero", "sei"],
                     ["tu", "podes", "queres", "sabes"],
                     ["ele / você", "pode", "quer", "sabe"],
                     ["nós", "podemos", "queremos", "sabemos"],
                     ["eles / vocês", "podem", "querem", "sabem"]]},
  "ex": [["*Posso* entrar?", "¿Puedo pasar?"],
         ["Você *quer* um mate?", "¿Querés un mate?"],
         ["Não *sei*.", "No sé."],
         ["Ela *pode* vir amanhã.", "Ella puede venir mañana."]],
  "warn": "Nada de «puede» ni «quiere»: *pode*, *quer* (sin *-e* final). "
          "*saber* = saber (un dato); para lugares y personas, *conhecer*."},

 {"h": "ver, ler, dar, pôr",
  "r": "Verbos cortos con formas raras: *vejo, leio, dou, ponho*. En "
       "plural, *veem* y *leem* se escriben sin circunflejo.",
  "table": {"head": ["", "ver", "ler", "dar", "pôr"],
            "rows": [["eu", "vejo", "leio", "dou", "ponho"],
                     ["tu", "vês", "lês", "dás", "pões"],
                     ["ele / você", "vê", "lê", "dá", "põe"],
                     ["nós", "vemos", "lemos", "damos", "pomos"],
                     ["eles / vocês", "veem", "leem", "dão", "põem"]]},
  "ex": [["*Vejo* o Cristo da janela.", "Veo el Cristo desde la ventana."],
         ["Ela *lê* o jornal no café.", "Lee el diario en el café."],
         ["Eu *dou* aula de espanhol.", "Doy clases de español."],
         ["Onde eu *ponho* a mala?", "¿Dónde pongo la valija?"]],
  "tip": "*pôr* lleva circunflejo para no confundirse con *por*. En el "
         "habla se prefiere *colocar* o *botar*: *boto a mala aqui*."},

 {"h": "sair, ouvir, pedir",
  "r": "*saio*, *ouço*, *peço*: irregulares solo en *eu*. Ojo con *sair*: "
       "*ele sai*, *nós saímos*, *eles saem*.",
  "table": {"head": ["", "sair", "ouvir", "pedir"],
            "rows": [["eu", "saio", "ouço", "peço"],
                     ["tu", "sais", "ouves", "pedes"],
                     ["ele / você", "sai", "ouve", "pede"],
                     ["nós", "saímos", "ouvimos", "pedimos"],
                     ["eles / vocês", "saem", "ouvem", "pedem"]]},
  "ex": [["*Saio* de casa cedo.", "Salgo de casa temprano."],
         ["*Ouço* samba no carro.", "Escucho samba en el auto."],
         ["Ela *pede* um chope.", "Pide un chopp."],
         ["A gente *sai* hoje?", "¿Salimos hoy?"]],
  "warn": "Ni «salgo» ni «oigo» ni «pido»: *saio*, *ouço*, *peço*. Y *pede* "
          "con *e*: *ela pede*, no «pide»."},

 {"h": "Sin diptongos: dormir, preferir, subir",
  "q": [{"prompt": "«Ella duerme poco.»", "answer": "Ela dorme pouco.", "options": ["Ela dorme pouco.", "Ela duerme pouco.", "Ela durme pouco."]}],
  "r": "Donde el español diptonga (*duermo, prefiero*), el portugués no. "
       "Algunos cambian la vocal **solo en eu**: *durmo*, *prefiro*.",
  "table": {"head": ["Infinitivo", "eu", "ele", "eles"],
            "rows": [["dormir", "durmo", "dorme", "dormem"],
                     ["preferir", "prefiro", "prefere", "preferem"],
                     ["sentir", "sinto", "sente", "sentem"],
                     ["vestir", "visto", "veste", "vestem"],
                     ["subir", "subo", "sobe", "sobem"]]},
  "ex": [["Eu *durmo* cedo, mas ele *dorme* tarde.", "Yo duermo temprano, pero él tarde."],
         ["*Prefiro* praia.", "Prefiero playa."],
         ["Ela *prefere* o Leblon.", "Ella prefiere Leblon."],
         ["O bondinho *sobe* o morro.", "El teleférico sube el cerro."]],
  "warn": "*subir* es al revés: *subo* pero *sobe, sobem*. Lo mismo "
          "*fugir* (*fujo, foge*)."},

 {"h": "Invitar, aceptar, decir que no",
  "r": "Para invitar: *vamos…?*, *quer…?*, *bora?* (habla). Para no poder: "
       "*não posso, tenho que…* (*ter que* = tener que).",
  "ex": [["*Vamos* ao show na Lapa?", "¿Vamos al show en Lapa?"],
         ["Você *quer* ir à praia?", "¿Querés ir a la playa?"],
         ["*Bora!* / *Topo!*", "¡Dale! / ¡Me prendo!"],
         ["Não *posso*, *tenho que* trabalhar.", "No puedo, tengo que trabajar."],
         ["Fica para a próxima!", "¡Queda para la próxima!"]],
  "tip": "*bora* (de *vamos embora*) y *partiu!* son del habla joven: "
         "«¡vamos!». *topar* = aceptar un plan: *topa?* (¿te prendés?)."},
]},

7: {
"intro": "Números, días, meses, horas y precios. En portugués los números "
         "tienen género y los días de semana se cuentan: *segunda-feira* "
         "es lunes.",
"parts": [
 {"h": "Los números", "blocks": [0, 1, 2]},
 {"h": "Días, meses y fechas", "blocks": [3]},
 {"h": "La hora, los precios y el teléfono", "blocks": [4, 5]},
],
"blocks": [
 {"h": "Del 0 al 20",
  "r": "Casi como en español. Las trampas: *dezesseis, dezessete, "
       "dezenove* (con *e*: dez + e + unidad), *dezoito* (sin *e*), *catorze* y *quinze*.",
  "table": {"head": ["", "", "", ""],
            "rows": [["0 zero", "6 seis", "11 onze", "16 dezesseis"],
                     ["1 um / uma", "7 sete", "12 doze", "17 dezessete"],
                     ["2 dois / duas", "8 oito", "13 treze", "18 dezoito"],
                     ["3 três", "9 nove", "14 catorze (quatorze)", "19 dezenove"],
                     ["4 quatro, 5 cinco", "10 dez", "15 quinze", "20 vinte"]]},
  "ex": [["*dezesseis* anos", "dieciséis años"],
         ["*dezoito* reais", "dieciocho reales"],
         ["*três* biscoitos Globo", "tres bizcochitos Globo"]],
  "warn": "*dezesseis*, no «dieciséis» ni «dezeseis»: doble *s*. Y *três* "
          "lleva circunflejo."},

 {"h": "Decenas, centenas y miles",
  "q": [{"prompt": "¿Cómo se dice 500?", "answer": "quinhentos", "options": ["quinhentos", "cincocentos", "quinientos"]}],
  "r": "Entre decenas y unidades, *e*, como en español; pero también entre "
       "centenas y decenas: *cento e vinte*, *mil e quinhentos*.",
  "table": {"head": ["Decenas", "Centenas", "Centenas"],
            "rows": [["30 trinta", "100 cem / cento", "600 seiscentos"],
                     ["40 quarenta", "200 duzentos", "700 setecentos"],
                     ["50 cinquenta", "300 trezentos", "800 oitocentos"],
                     ["60 sessenta, 70 setenta", "400 quatrocentos", "900 novecentos"],
                     ["80 oitenta, 90 noventa", "500 quinhentos", "1000 mil"]]},
  "ex": [["*cem* reais", "cien reales (100 justo)"],
         ["*cento e* cinquenta", "ciento cincuenta"],
         ["trezentos *e* quarenta *e* cinco", "trescientos cuarenta y cinco"],
         ["dois *mil e* vinte e seis", "dos mil veintiséis"]],
  "warn": "*cinquenta* sin diéresis. *cem* es 100 justo; *cento* va "
          "seguido de algo: *cento e dez*. Y *quinhentos*, no «quinientos»."},

 {"h": "Números con género",
  "r": "*um / uma*, *dois / duas* y las centenas (*duzentos / duzentas*) "
       "concuerdan con el sustantivo, también dentro de números grandes.",
  "ex": [["*uma* cerveja, *duas* cervejas", "una cerveza, dos cervezas"],
         ["*dois* chopes", "dos chopps"],
         ["vinte e *uma* pessoas", "veintiuna personas"],
         ["*duzentas* pessoas", "doscientas personas"],
         ["*trezentos* reais", "trescientos reales"]],
  "warn": "«Dois cervejas» y «vinte e um pessoas» son errores muy "
          "frecuentes: *duas cervejas*, *vinte e uma pessoas*."},

 {"h": "Días, meses y fechas",
  "q": [{"prompt": "¿Qué día es «quarta-feira»?", "answer": "miércoles", "options": ["miércoles", "cuarto día del mes", "jueves"]},
        {"prompt": "«El lunes voy al centro.»", "answer": "Na segunda vou ao Centro.", "options": ["Na segunda vou ao Centro.", "No lunes vou ao Centro.", "Em segunda vou ao Centro."]}],
  "r": "De lunes a viernes se cuenta: *segunda-feira* (lunes) a "
       "*sexta-feira*. *sábado* y *domingo*, como en español.",
  "table": {"head": ["Portugués", "Español"],
            "rows": [["segunda-feira", "lunes"],
                     ["terça-feira", "martes"],
                     ["quarta-feira", "miércoles"],
                     ["quinta-feira", "jueves"],
                     ["sexta-feira", "viernes"],
                     ["sábado, domingo", "sábado, domingo"]]},
  "ex": [["*Na segunda* eu trabalho.", "El lunes trabajo."],
         ["*No sábado* tem feira.", "El sábado hay feria."],
         ["Hoje é *dia 15 de março*.", "Hoy es 15 de marzo."],
         ["*primeiro* de janeiro", "1.º de enero (el 1 es ordinal)"],
         ["O carnaval é *em fevereiro*.", "El carnaval es en febrero."]],
  "warn": "«En el lunes» → *na segunda*; «el sábado» → *no sábado*: con "
          "contracción, porque *segunda* es femenino y *sábado* masculino.",
  "more": ["Los meses van con minúscula: *janeiro, fevereiro, março, abril, "
           "maio, junho, julho, agosto, setembro, outubro, novembro, "
           "dezembro*. El día 1 se dice *primeiro* (*1º de maio*); los "
           "demás, cardinales: *dois de maio*. En la charla se abrevia: "
           "*na segunda, na terça, na sexta*.",
           "Cumplir años se dice *fazer anos*: *a Bia faz trinta anos na "
           "quarta* (Bia cumple treinta el miércoles). El cumpleaños es *o "
           "aniversário*; para saludar, *parabéns!* o *feliz aniversário!*"]},

 {"h": "¿Qué hora es?",
  "q": [{"prompt": "«A las tres.»", "answer": "Às três.", "options": ["Às três.", "As três.", "A las três."]}],
  "r": "*Que horas são?* — *É uma hora*, *são duas horas*. Para «a las», "
       "*às* con acento grave: *às três*; *à uma*.",
  "ex": [["*É* uma hora. *São* três e meia.", "Es la una. Son las tres y media."],
         ["*É* meio-dia. *É* meia-noite.", "Es mediodía. Es medianoche."],
         ["A festa começa *às* dez.", "La fiesta empieza a las diez."],
         ["*Quinze para as* oito.", "Las ocho menos cuarto."],
         ["O museu abre *ao* meio-dia.", "El museo abre al mediodía."]],
  "warn": "*meio-dia e meia* (12:30): *meia* porque es «media hora». Y "
          "*às* lleva acento grave: *a + as = às*.",
  "more": ["Para aclarar la parte del día, *da manhã*, *da tarde*, *da "
           "noite* (de + a): *às sete da manhã*, *às duas da tarde*, *às "
           "onze da noite*. Y «menos» se dice con *para*: *dez para as dez* "
           "(las diez menos diez), *quinze para as oito*."]},

 {"h": "Precios y teléfonos",
  "r": "*Quanto custa?* / *Quanto é?* La moneda: *real*, plural *reais*; "
       "los centavos van con *e*. En teléfonos, 6 se dice *meia*.",
  "ex": [["*Quanto custa* o açaí?", "¿Cuánto sale el asaí?"],
         ["R$ 12,50: *doze reais e cinquenta*", "doce reales con cincuenta"],
         ["Um mate *é* oito *reais*.", "Un mate es ocho reales."],
         ["Meu número é nove, *meia*, dois…", "Mi número es 9-6-2…"],
         ["Aceita cartão ou *Pix*?", "¿Aceptás tarjeta o Pix?"]],
  "warn": "*meia* (de *meia dúzia*) reemplaza a *seis* al dictar números, "
          "para no confundirlo con *três*. Si oís «meia», anotá 6.",
  "tip": "El *Pix* es la transferencia instantánea que usa todo Brasil, "
         "del vendedor de mate en la playa a la farmacia."},
]},

8: {
"intro": "Preguntar bien, decir lo que estás haciendo (*estou comendo*) y "
         "lo que vas a hacer (*vou viajar*): con esto armás el plan del "
         "fin de semana.",
"parts": [
 {"h": "Preguntas y el porquê", "blocks": [0, 1]},
 {"h": "ir + infinitivo: los planes", "blocks": [2, 3]},
 {"h": "estar + gerúndio", "blocks": [4, 5]},
 {"h": "Palavras que não estão no dicionário", "blocks": [6, 7]},
],
"blocks": [
 {"h": "Las palabras para preguntar",
  "q": [{"prompt": "«¿Qué hacés?»", "answer": "O que você faz?", "options": ["O que você faz?", "Que você faz?", "Qué você faz?"]},
        {"prompt": "«¿Cuál es tu nombre?»", "answer": "Qual é o seu nome?", "options": ["Qual é o seu nome?", "O que é o seu nome?", "Cuál é o seu nome?"]}],
  "r": "Casi como en español, pero **sin tilde** (salvo *quê* al final). "
       "«¿Qué…?» suele ser *o que…?*.",
  "table": {"head": ["Portugués", "Español", "Ejemplo"],
            "rows": [["o que?", "¿qué?", "*O que* você quer?"],
                     ["quem?", "¿quién? ¿quiénes?", "*Quem* são eles?"],
                     ["qual? / quais?", "¿cuál? / ¿cuáles?", "*Quais* são os seus planos?"],
                     ["quanto? quanta? quantos? quantas?", "¿cuánto/a/os/as?", "*Quanto* custa? *Quantas* pessoas?"],
                     ["como? onde? quando?", "¿cómo? ¿dónde? ¿cuándo?", "*Como* vai? *Onde* você mora? *Quando* você chega?"],
                     ["aonde? / de onde?", "¿adónde? / ¿de dónde?", "*Aonde* você vai? *De onde* você é?"]]},
  "ex": [["*O que* você faz?", "¿Qué hacés? / ¿De qué trabajás?"],
         ["*Quem* é ele?", "¿Quién es él?"],
         ["*Qual* é o seu telefone?", "¿Cuál es tu teléfono?"],
         ["*Quantos* anos você tem?", "¿Cuántos años tenés?"],
         ["*De onde* você é?", "¿De dónde sos?"]],
  "warn": "*quem* no tiene plural: *quem são eles?*. Y «¿cuál es tu "
          "nombre?» usa *qual*, no «o que»."},

 {"h": "por que, porque, por quê, o porquê",
  "r": "Pregunta: *por que* (separado). Respuesta: *porque* (junto). Al "
       "final de la frase: *por quê*. Sustantivo: *o porquê*.",
  "table": {"head": ["Forma", "Uso", "Ejemplo"],
            "rows": [["por que", "pregunta (¿por qué?)", "Por que você está aqui?"],
                     ["porque", "respuesta (porque)", "Porque eu moro aqui."],
                     ["por quê", "al final, antes del signo", "Você está aqui por quê?"],
                     ["o porquê", "sustantivo (el motivo)", "Não sei o porquê."]]},
  "ex": [["*Por que* você está no Rio?", "¿Por qué estás en Río?"],
         ["*Porque* tenho férias.", "Porque tengo vacaciones."],
         ["Você não vem? *Por quê*?", "¿No venís? ¿Por qué?"],
         ["Não sei *o porquê* da demora.", "No sé el porqué de la demora."]],
  "warn": "En portugués la pregunta va **separada** (*por que*) y la "
          "respuesta **junta** (*porque*): igual que en español, sin tilde "
          "en la pregunta."},

 {"h": "ir + infinitivo: el futuro del habla",
  "q": [{"prompt": "«Voy a viajar mañana.»", "answer": "Vou viajar amanhã.", "options": ["Vou viajar amanhã.", "Vou a viajar amanhã.", "Vou viajo amanhã."]}],
  "r": "*vou* + infinitivo, **sin «a»**: *vou viajar*. Es el futuro normal "
       "de la conversación en Brasil.",
  "ex": [["*Vou viajar* amanhã.", "Voy a viajar mañana."],
         ["A gente *vai comer* na feira.", "Vamos a comer en la feria."],
         ["Você *vai sair* hoje?", "¿Vas a salir hoy?"],
         ["Eles *vão ver* o jogo no Maracanã.", "Van a ver el partido en el Maracaná."]],
  "warn": "«Vou a viajar» es el calco más típico. Entre *ir* y el "
          "infinitivo no va nada: *vou viajar*, *vamos sair*.",
  "tip": "«Voy a ir» en el habla es *vou* a secas (*vou amanhã*) o *vou "
         "ir*, que es coloquial. En lo escrito, *vou* solo."},

 {"h": "Planes del fin de semana",
  "r": "Para preguntar y contar planes: *o que você vai fazer…?*, *vou "
       "ficar em casa*, *vou dar uma volta*. Con fecha: *no sábado*, *no "
       "fim de semana*.",
  "ex": [["*O que você vai fazer* no fim de semana?", "¿Qué vas a hacer el fin de semana?"],
         ["*Vou ficar* em casa e descansar.", "Me voy a quedar en casa a descansar."],
         ["No sábado *vou dar uma volta* em Santa Teresa.", "El sábado voy a dar una vuelta por Santa Teresa."],
         ["No domingo *vai ter* churrasco.", "El domingo va a haber asado."]],
  "warn": "«Va a haber» = *vai ter* (habla) o *vai haver*. Nunca «vai "
          "hay»: *tem* y *ter* hacen de «hay» y «haber».",
  "tip": "*ficar* = quedarse: *vou ficar em casa*. Es uno de los verbos "
         "más usados de Brasil."},

 {"h": "El gerúndio: -ando, -endo, -indo",
  "q": [{"prompt": "Gerundio de «ler»:", "answer": "lendo", "options": ["lendo", "leiendo", "leyendo"]}],
  "r": "Cambiá *-ar, -er, -ir* por *-ando, -endo, -indo*. Casi sin "
       "irregulares: *pôr → pondo*, *ir → indo*, *ler → lendo*.",
  "table": {"head": ["Infinitivo", "Gerúndio", "Español"],
            "rows": [["falar", "falando", "hablando"],
                     ["comer", "comendo", "comiendo"],
                     ["abrir", "abrindo", "abriendo"],
                     ["ir", "indo", "yendo"],
                     ["pôr, ler, dizer", "pondo, lendo, dizendo", "poniendo, leyendo, diciendo"]]},
  "ex": [["*comendo*", "comiendo: -endo, sin «i»"],
         ["*dizendo*, *fazendo*", "diciendo, haciendo: raíz del infinitivo"],
         ["*dormindo*, *pedindo*", "durmiendo, pidiendo: sin cambio de vocal"]],
  "warn": "El portugués no cambia la vocal: *dormindo* (no «durmindo»), "
          "*pedindo* (no «pidindo»), *dizendo* (no «dicindo»)."},

 {"h": "estar + gerúndio: lo que está pasando",
  "r": "*estou* + gerúndio, como en español. Es lo de Brasil; en Portugal "
       "se dice *estou a comer*.",
  "ex": [["*Estou comendo* uma tapioca.", "Estoy comiendo una tapioca."],
         ["Ela *está trabalhando* agora.", "Está trabajando ahora."],
         ["O que vocês *estão fazendo*?", "¿Qué están haciendo?"],
         ["*Tá chovendo* em Botafogo.", "Está lloviendo en Botafogo (habla)."]],
  "tip": "En el habla *está* se acorta: *tô* (estoy), *tá* (está), *tamo* "
         "(estamos), *tão* (están). *Tô chegando!* = ¡ya llego!",
  "more": ["*estou comendo* y *estou a comer* son el mismo tiempo: el "
           "primero es la forma brasileña y el segundo, la europea. En "
           "Brasil el gerundio también aparece en frases como *vou "
           "levando* (voy tirando), muy de la charla."]},

 {"h": "Palavras que não estão no dicionário (1): né, então, olha, tá bom",
  "q": [{"prompt": "—Te ligo amanhã. ¿Cómo aceptás, bien brasileño?", "answer": "Tá bom!", "options": ["Tá bom!", "Está bueno!", "Né!"]}],
  "r": "Las muletillas ordenan la charla: *né?* pide acuerdo, *então* arranca o concluye, *olha* llama la atención y *tá bom* acepta.",
  "table": {"head": ["Português", "Español"], "rows": [["né?", "¿no?, ¿viste?"], ["então", "entonces, bueno"], ["olha", "mirá"], ["tá bom", "dale, bueno"]]},
  "ex": [["Está calor hoje, *né*?", "Hace calor hoy, ¿no?"], ["*Então*, vamos?", "Bueno, ¿vamos?"], ["*Olha*, eu acho que vai chover.", "Mirá, me parece que va a llover."], ["— Te ligo amanhã. — *Tá bom*!", "—Te llamo mañana. —¡Dale!"]],
  "warn": "*né* es *não é* achicado y *tá* es *está*: son del habla, no de un texto formal. *Tá bom* es «dale», no «está bueno».",
  "tip": "Son de las palabras más frecuentes del portugués hablado: prestales atención en las escuchas. La síntesis, en la semana 38."},

 {"h": "Sotaque da semana: São Paulo",
  "q": [{"prompt": "En São Paulo, ¿qué es o farol?", "answer": "el semáforo", "options": ["el semáforo", "el faro", "la farola"]}],
  "r": "El paulistano no chia: la *s* final es *s*, y la *e* final suena más cerrada. En el interior, la *r* «caipira» se enrosca: *porta* ≈ «porrrta».",
  "ex": [["*Meu*, que trânsito!", "¡Che, qué tránsito! (meu = che, en São Paulo)"], ["Vamos tomar um *café* na padaria?", "¿Vamos a tomar un café a la panadería?"], ["Pega o *farol* e vira à direita.", "En el semáforo, doblá a la derecha (farol = semáforo, en SP)"]],
  "tip": "En Río el semáforo es *sinal*; en São Paulo, *farol*. La voz de la app es la estándar: el acento no se oye, las palabras sí."},

]},

9: {
"intro": "*em, a, para, de, por*: las preposiciones de lugar y movimiento "
         "no se traducen una a una. Esta semana, a moverte por Río en "
         "metrô, ônibus y a pé.",
"parts": [
 {"h": "Estar en, ir a, llegar a", "blocks": [0, 1, 2]},
 {"h": "Medios de transporte y el camino", "blocks": [3, 4]},
 {"h": "Desde, hasta y cómo llegar", "blocks": [5, 6]},
],
"blocks": [
 {"h": "em: donde estás y donde vivís",
  "q": [{"prompt": "«Vivo en Río.»", "answer": "Moro no Rio.", "options": ["Moro no Rio.", "Moro em Rio.", "Moro a Rio."]}],
  "r": "*estar, morar, ficar, trabalhar* + *em*, contraído con el "
       "artículo del lugar: *no Rio*, *na Bahia*, *no Brasil*.",
  "table": {"head": ["Con artículo", "Sin artículo"],
            "rows": [["no Brasil, na Argentina", "em Portugal, em Cuba"],
                     ["no Rio, na Bahia", "em São Paulo, em Salvador"],
                     ["no Leblon, na Lapa, na Tijuca", "em Copacabana, em Ipanema, em Botafogo"]]},
  "ex": [["Moro *no* Rio, *em* Botafogo.", "Vivo en Río, en Botafogo."],
         ["Ela trabalha *na* Tijuca.", "Trabaja en Tijuca."],
         ["Estou *em* Buenos Aires.", "Estoy en Buenos Aires."],
         ["Eles moram *no* Brasil.", "Viven en Brasil."]],
  "warn": "Países y barrios pueden llevar artículo o no: *no Brasil, na "
          "Argentina*, pero *em Portugal*. Aprendelos con su *em* ya puesto.",
  "tip": "El *Rio* lleva artículo (*o Rio de Janeiro*): *no Rio, do Rio*. "
         "*São Paulo* y *Buenos Aires*, no."},

 {"h": "ir a / ir para",
  "r": "*ir a*: visita corta. *ir para*: destino, o para quedarse. En el "
       "habla se oye *ir no*: *vou no mercado*.",
  "ex": [["*Vou à* praia.", "Voy a la playa (un rato)."],
         ["*Vou ao* Maracanã.", "Voy al Maracaná."],
         ["*Vou para* Salvador no verão.", "Me voy a Salvador en verano."],
         ["*Vou pra* casa.", "Me voy a casa (pra = para, habla)."],
         ["*Vou no* mercado. (habla)", "Voy al súper."]],
  "warn": "*ir a* + *a* = *à*: *vou à praia*, *à Lapa*. «Vou a praia» sin "
          "acento es error de escritura.",
  "tip": "*pra* es la forma hablada de *para*: *pra casa*, *pro Rio* (*para "
         "o*), *pra praia* (*para a*). Escribila solo en chats."},

 {"h": "chegar em / chegar a",
  "q": [{"prompt": "«Llegamos a Río a las ocho.» (norma escrita)", "answer": "Chegamos ao Rio às oito.", "options": ["Chegamos ao Rio às oito.", "Chegamos no Rio às oito.", "Chegamos para Rio às oito."]}],
  "r": "La norma pide *chegar a* (*chego ao Rio*); el habla de todo Brasil "
       "dice *chegar em* (*chego no Rio*).",
  "ex": [["*Chego ao* aeroporto às dez.", "Llego al aeropuerto a las diez (norma)."],
         ["*Chego no* aeroporto às dez.", "Íd. (habla)"],
         ["Quando você *chega em* casa?", "¿Cuándo llegás a casa?"],
         ["O ônibus *chega à* rodoviária.", "El micro llega a la terminal."]],
  "tip": "En un examen o un mail formal: *chegar a*. En la charla, *chegar "
         "em* suena natural y nadie lo corrige."},

 {"h": "Medios de transporte",
  "r": "*de* + medio sin artículo: *de ônibus, de metrô, de carro, de "
       "bicicleta*. Pero **a pé**. «Tomar» el colectivo es *pegar*.",
  "ex": [["Vou *de metrô* até Botafogo.", "Voy en subte hasta Botafogo."],
         ["Ela vai *de ônibus* para o trabalho.", "Va al trabajo en colectivo."],
         ["A gente vai *a pé*.", "Vamos a pie / caminando."],
         ["Eu *pego* o BRT na Barra.", "Tomo el BRT en Barra."],
         ["Vou *de Uber*.", "Voy en Uber."]],
  "warn": "«En colectivo» no es «em ônibus»: *de ônibus*. Y *de pé* "
          "significa «parado»: a pie es *a pé*.",
  "tip": "*ônibus* es igual en singular y plural, y lleva circunflejo: "
         "*o ônibus, os ônibus*."},

 {"h": "por: pelo, pela",
  "q": [{"prompt": "«Paso por la plaza.»", "answer": "Passo pela praça.", "options": ["Passo pela praça.", "Passo por a praça.", "Passo pola praça."]}],
  "r": "*por* marca el recorrido: *passar pela praça*. Con artículo "
       "siempre se contrae: *pelo, pela, pelos, pelas*.",
  "ex": [["O ônibus passa *pela* praia.", "El colectivo pasa por la playa."],
         ["Um passeio *pelo* centro histórico.", "Un paseo por el centro histórico."],
         ["Você mora *por aqui*?", "¿Vivís por acá?"],
         ["O metrô passa *por* Copacabana.", "El subte pasa por Copacabana."]],
  "warn": "«Por el», «por la» → *pelo, pela*. «Por o» no existe, como "
          "tampoco «em o»."},

 {"h": "De dónde, hasta dónde: de, até",
  "q": [{"prompt": "«Voy caminando hasta la playa.»", "answer": "Vou a pé até a praia.", "options": ["Vou a pé até a praia.", "Vou de pé até a praia.", "Vou a pé hasta a praia."]}],
  "r": "*de* = desde (origen); *até* = hasta. *de… a…* o *de… até…*: *de "
       "segunda a sexta*, *do Leme até o Leblon*.",
  "ex": [["*Venho do* trabalho.", "Vengo del trabajo."],
         ["*Saio de* casa às sete.", "Salgo de casa a las siete."],
         ["Vou a pé *até a* praia.", "Voy caminando hasta la playa."],
         ["*Do* Leme *ao* Leblon tem muita praia.", "Del Leme al Leblon hay mucha playa."],
         ["*Até* amanhã!", "¡Hasta mañana!"]],
  "warn": "«Desde» se dice *de* o *desde*, pero para el origen de un "
          "trayecto lo normal es *de*: *do Rio a São Paulo*.",
  "tip": "*até* + artículo: *até a praia* (en Brasil) o *até à praia* "
         "(Portugal). Las dos formas se escriben."},

 {"h": "Cómo llegar",
  "r": "Para pedir y dar direcciones: *Como eu chego a…?*, *vira à "
       "direita*, *segue em frente*. *à direita / à esquerda* con acento "
       "grave.",
  "ex": [["Com licença, *como eu chego* ao Arpoador?", "Disculpá, ¿cómo llego al Arpoador?"],
         ["Você *segue em frente* e *vira à esquerda*.", "Seguís derecho y doblás a la izquierda."],
         ["É a *segunda* rua *à direita*.", "Es la segunda calle a la derecha."],
         ["Fica *perto* da estação.", "Queda cerca de la estación."],
         ["É *longe*? — Não, é *pertinho*.", "¿Es lejos? — No, es acá nomás."]],
  "warn": "*direito* = derecho, pero «seguí derecho» es *segue em frente* "
          "(o *reto*). *à direita* es solo «a la derecha».",
  "tip": "*Com licença* sirve para pedir paso y para abordar a alguien por "
         "la calle. «Disculpe» se dice *desculpa* o *com licença*."},
]},

10: {
"intro": "*meu, seu, nosso*, *este, esse, aquele*… y cómo decir «de él» sin "
         "confundir a nadie. Con eso hablás de tu familia, tu casa y tus "
         "cosas.",
"parts": [
 {"h": "Posesivos y el problema de seu", "blocks": [0, 1, 2]},
 {"h": "Demostrativos y sus contracciones", "blocks": [3, 4, 5]},
 {"h": "La familia", "blocks": [6]},
],
"blocks": [
 {"h": "Los posesivos",
  "q": [{"prompt": "«mis amigas»", "answer": "minhas amigas", "options": ["minhas amigas", "mias amigas", "meus amigas"]}],
  "r": "Concuerdan con **lo poseído**, no con el dueño: *minha casa*, "
       "*meus pais*. Y son las mismas formas para «mi» y «mío».",
  "table": {"head": ["Significa", "masc. sing.", "fem. sing.", "masc. pl.", "fem. pl.", "Ejemplo"],
            "rows": [["mi, mío (eu)", "meu", "minha", "meus", "minhas", "*meu* pai, *minhas* amigas"],
                     ["tu, tuyo (tu: Sur, Nordeste)", "teu", "tua", "teus", "tuas", "*teu* irmão, *tuas* coisas"],
                     ["tu, tuyo (você); su, suyo (o senhor)", "seu", "sua", "seus", "suas", "*sua* casa, *seus* amigos"],
                     ["nuestro (nós, a gente)", "nosso", "nossa", "nossos", "nossas", "*nosso* bairro, *nossas* férias"],
                     ["de ustedes (vocês)", "o … de vocês", "a … de vocês", "os … de vocês", "as … de vocês", "a casa *de vocês*"]]},
  "ex": [["*minha* mãe e *meu* pai", "mi madre y mi padre"],
         ["*meus* amigos cariocas", "mis amigos cariocas"],
         ["a *nossa* casa em Santa Teresa", "nuestra casa en Santa Teresa"],
         ["Essa mala é *minha*.", "Esa valija es mía."]],
  "warn": "*minha*, no «mía» ni «mi». El femenino de *meu* es irregular: "
          "*minha, minhas*.",
  "more": ["¿Y «su» de él o de ellos? La norma escrita admite *seu* (*o "
           "autor e seu livro*), pero al hablar *seu* se entiende «de *você*». "
           "Para terceros se usa *dele, dela, deles, delas*: lo ves en el "
           "bloque de *seu, dele, dela*."]},

 {"h": "El artículo con posesivo",
  "r": "En Brasil es opcional: *minha casa* o *a minha casa*. Tras "
       "preposición se contrae: *na minha casa*, *do meu pai*.",
  "ex": [["*A minha* irmã mora em Niterói.", "Mi hermana vive en Niterói."],
         ["*Minha* irmã mora em Niterói.", "Íd., sin artículo"],
         ["Estou *na minha* casa.", "Estoy en mi casa."],
         ["O carro *do meu* pai é branco.", "El auto de mi papá es blanco."]],
  "warn": "Tras *em, de, a, por* el artículo se contrae: *na minha casa*. "
          "«Em a minha casa» no existe."},

 {"h": "seu, dele, dela",
  "q": [{"prompt": "«El auto de él es negro.» (sin ambigüedad)", "answer": "O carro dele é preto.", "options": ["O carro dele é preto.", "O seu carro é preto.", "O carro de ele é preto."]}],
  "r": "En Brasil *seu* se entiende como «de *você*». Para «de él / de "
       "ella / de ellos», **detrás** del sustantivo: *dele, dela, deles, "
       "delas*.",
  "table": {"head": ["Quiero decir", "Portugués"],
            "rows": [["tu casa (de você)", "a sua casa"],
                     ["la casa de él", "a casa dele"],
                     ["la casa de ella", "a casa dela"],
                     ["la casa de ellos / de ellas", "a casa deles / delas"],
                     ["la casa de ustedes", "a casa de vocês"]]},
  "ex": [["Qual é o *seu* telefone?", "¿Cuál es tu teléfono?"],
         ["O Rafa e a namorada *dele*.", "Rafa y su novia."],
         ["A mãe *dela* é baiana.", "La madre de ella es bahiana."],
         ["O apartamento *deles* fica no Leblon.", "El departamento de ellos queda en Leblon."]],
  "warn": "*dele* = *de + ele*, siempre contraído y **después** del "
          "sustantivo: *o carro dele*, nunca «o dele carro» ni «de ele».",
  "tip": "*o senhor* y *a senhora* sí usan *seu / sua*: *a sua mala, "
         "senhora?*."},

 {"h": "este, esse, aquele",
  "r": "*este* (acá), *esse* (ahí), *aquele* (allá). En el habla de Brasil "
       "*esse* se usa también por *este*.",
  "table": {"head": ["Significa", "masc.", "fem.", "masc. pl.", "fem. pl."],
            "rows": [["este (acá, cerca de mí)", "este", "esta", "estes", "estas"],
                     ["ese (ahí, cerca de vos)", "esse", "essa", "esses", "essas"],
                     ["aquel (allá, lejos de los dos)", "aquele", "aquela", "aqueles", "aquelas"]]},
  "ex": [["*Esta* praia é linda.", "Esta playa es linda."],
         ["*Essa* camisa é sua?", "¿Esa camisa es tuya?"],
         ["*Aquele* morro é o Dois Irmãos.", "Aquel cerro es el Dos Hermanos."],
         ["*Esse* aqui é meu irmão.", "Este de acá es mi hermano (habla)."]],
  "warn": "*aquele* con *qu*, y *esse* con doble *s*: «ese» es la letra S "
          "(*esse*) o el demostrativo, no «ese»."},

 {"h": "isto, isso, aquilo",
  "q": [{"prompt": "«¿Qué es eso?»", "answer": "O que é isso?", "options": ["O que é isso?", "O que é esso?", "O que é iso?"]}],
  "r": "Los neutros no cambian y sustituyen una cosa o una idea: *isto* "
       "(esto), *isso* (eso), *aquilo* (aquello).",
  "ex": [["O que é *isso*?", "¿Qué es eso?"],
         ["*Isso* mesmo!", "¡Eso mismo! / ¡Exacto!"],
         ["*Isto* é um biscoito Globo.", "Esto es un bizcocho Globo."],
         ["*Aquilo* ali é o Cristo?", "¿Aquello de allá es el Cristo?"]],
  "warn": "Con *i*: *isto, isso*, nunca «esto, eso». Y *isso* se usa "
          "muchísimo para decir «¡eso!, ¡así!».",
  "tip": "Con sustantivo va *este, esse, aquele*: *esse livro*. Solo, sin "
         "sustantivo, el neutro: *quero isso*, nunca «isso livro»."},

 {"h": "Contracciones: neste, desse, naquele",
  "r": "*em* y *de* se funden con los demostrativos: *neste, nesse, "
       "naquele*; *deste, desse, daquele*; *nisso, disso*. *a* solo con "
       "*aquele*: *àquele*.",
  "table": {"head": ["", "Significa", "Formas", "Ejemplo"],
            "rows": [["em + este / isto", "en este, en esto", "neste, nesta, nestes, nestas, nisto", "*neste* prédio"],
                     ["em + esse / isso", "en ese, en eso", "nesse, nessa, nesses, nessas, nisso", "*nessa* praia"],
                     ["em + aquele / aquilo", "en aquel, en aquello", "naquele, naquela, naqueles, naquelas, naquilo", "*naquele* dia"],
                     ["de + este / isto", "de este, de esto", "deste, desta, destes, destas, disto", "o dono *deste* bar"],
                     ["de + esse / isso", "de ese, de eso", "desse, dessa, desses, dessas, disso", "nada *disso*"],
                     ["de + aquele / aquilo", "de aquel, de aquello", "daquele, daquela, daqueles, daquelas, daquilo", "a casa *daquela* senhora"],
                     ["a + aquele / aquilo", "a aquel, a aquello", "àquele, àquela, àqueles, àquelas, àquilo", "Vou *àquele* bar."]]},
  "ex": [["Moro *neste* prédio.", "Vivo en este edificio."],
         ["A praia *desse* bairro é linda.", "La playa de ese barrio es linda."],
         ["*Naquela* rua tem um boteco.", "En aquella calle hay un bar."],
         ["Não sei nada *disso*.", "No sé nada de eso."],
         ["Vamos *àquele* restaurante?", "¿Vamos a aquel restaurante?"]],
  "warn": "«Em este», «de ese» no existen: *neste*, *desse*. Con *a*, "
          "*este* y *esse* van separados (*a este*); solo *aquele* se funde: "
          "*àquele*, con acento grave."},

 {"h": "La familia",
  "q": [{"prompt": "«Mis padres viven en Rosario.»", "answer": "Meus pais moram em Rosario.", "options": ["Meus pais moram em Rosario.", "Meus parentes moram em Rosario.", "Meus padres moram em Rosario."]}],
  "r": "*os pais* = los padres (papá y mamá); *os parentes* = los "
       "parientes. *avô* (abuelo) y *avó* (abuela) cambian por la vocal.",
  "table": {"head": ["Portugués", "Español"],
            "rows": [["o pai / a mãe", "el padre / la madre"],
                     ["os pais", "los padres"],
                     ["o irmão / a irmã", "el hermano / la hermana"],
                     ["o avô / a avó", "el abuelo / la abuela"],
                     ["o filho / a filha", "el hijo / la hija"],
                     ["o sogro / a sogra", "el suegro / la suegra"],
                     ["o marido / a mulher (a esposa)", "el marido / la mujer"],
                     ["os parentes", "los parientes"]]},
  "ex": [["Meus *pais* moram em Rosario.", "Mis padres viven en Rosario."],
         ["Tenho dois *irmãos* e uma *irmã*.", "Tengo dos hermanos y una hermana."],
         ["A minha *avó* é mineira.", "Mi abuela es de Minas."],
         ["Ele é o *namorado* da minha prima.", "Es el novio de mi prima."]],
  "warn": "*parentes* = parientes, no «padres». Y *pais* (padres) no es "
          "*países* (países). *namorado* = novio, *noivo* = prometido.",
  "tip": "Los brasileños usan mucho *mãe* y *pai* en la charla, y *vó* / "
         "*vô* para los abuelos.",
  "more": ["Mayor y menor, dicho de hermanos o de edad: *mais velho* y "
           "*mais novo*: *meu irmão mais velho* (mi hermano mayor), *a irmã "
           "mais nova* (la hermana menor). El más chico de todos es *o "
           "caçula* o *a caçula*."]},
]},

11: {
"intro": "El pretérito perfeito es el pasado que más vas a usar: equivale "
         "a «hablé» y también a «he hablado». Esta semana: formas, "
         "irregulares y cómo contar un viaje.",
"parts": [
 {"h": "Los regulares y su grafía", "blocks": [0, 1]},
 {"h": "Los irregulares", "blocks": [2, 3, 4]},
 {"h": "Comi = comí y he comido; contar un viaje", "blocks": [5, 6]},
],
"blocks": [
 {"h": "Perfeito regular",
  "q": [{"prompt": "«Ella habló con Juan.»", "answer": "Ela falou com o João.", "options": ["Ela falou com o João.", "Ela faló com o João.", "Ela falô com o João."]}],
  "r": "*-ei, -ou* para *-ar*; *-i, -eu* para *-er*; *-i, -iu* para *-ir*. "
       "El *nós* es igual al presente: *falamos*.",
  "table": {"head": ["", "falar", "comer", "abrir"],
            "rows": [["eu", "falei", "comi", "abri"],
                     ["tu", "falaste", "comeste", "abriste"],
                     ["ele / você", "falou", "comeu", "abriu"],
                     ["nós", "falamos", "comemos", "abrimos"],
                     ["eles / vocês", "falaram", "comeram", "abriram"]]},
  "ex": [["Ontem eu *trabalhei* muito.", "Ayer trabajé mucho."],
         ["Ela *comeu* uma feijoada.", "Comió una feijoada."],
         ["Eles *abriram* a loja cedo.", "Abrieron el negocio temprano."],
         ["A gente *dançou* na Lapa.", "Bailamos en Lapa."]],
  "warn": "Tercera en *-ou*, *-eu*, *-iu*: *falou*, no «faló». Y "
          "*falaram*, no «hablaron» calcado a «falaron».",
  "tip": "*nós falamos* sirve para «hablamos» de hoy y de ayer: el "
         "contexto (*ontem*) decide."},

 {"h": "Grafía de la primera persona",
  "r": "En *eu*, para conservar el sonido: *-car → -quei*, *-gar → "
       "-guei*, *-çar → -cei*. El resto de las personas, normal.",
  "table": {"head": ["Infinitivo", "eu", "ele"],
            "rows": [["ficar", "fiquei", "ficou"],
                     ["tocar", "toquei", "tocou"],
                     ["chegar", "cheguei", "chegou"],
                     ["pagar", "paguei", "pagou"],
                     ["começar", "comecei", "começou"],
                     ["almoçar", "almocei", "almoçou"]]},
  "ex": [["*Cheguei* ao Rio no sábado.", "Llegué a Río el sábado."],
         ["*Fiquei* numa pousada em Paraty.", "Me quedé en una posada en Paraty."],
         ["*Paguei* com Pix.", "Pagué con Pix."],
         ["*Comecei* o curso ontem.", "Empecé el curso ayer."]],
  "warn": "Igual que en español: *pagué, toqué*. Pero ojo con *-çar*: "
          "*comecei*, sin *ç* ante *e*."},

 {"h": "Irregulares: ser, ir, ter, estar, fazer",
  "q": [{"prompt": "«Ayer fui a la playa.»", "answer": "Ontem fui à praia.", "options": ["Ontem fui à praia.", "Ontem foi à praia.", "Ontem ía à praia."]},
        {"prompt": "«Tuvimos suerte.»", "answer": "Tivemos sorte.", "options": ["Tivemos sorte.", "Tuvemos sorte.", "Temos tido sorte."]}],
  "r": "*ser* e *ir* comparten formas: *fui, foi, fomos, foram*. *ter* → "
       "*tive, teve*; *estar* → *estive, esteve*; *fazer* → *fiz, fez*.",
  "table": {"head": ["", "ser / ir", "ter", "estar", "fazer"],
            "rows": [["eu", "fui", "tive", "estive", "fiz"],
                     ["tu", "foste", "tiveste", "estiveste", "fizeste"],
                     ["ele / você", "foi", "teve", "esteve", "fez"],
                     ["nós", "fomos", "tivemos", "estivemos", "fizemos"],
                     ["eles / vocês", "foram", "tiveram", "estiveram", "fizeram"]]},
  "ex": [["*Fui* ao Pão de Açúcar.", "Fui al Pan de Azúcar."],
         ["O show *foi* incrível.", "El show fue increíble."],
         ["*Tive* um problema no hotel.", "Tuve un problema en el hotel."],
         ["Você já *esteve* em Salvador?", "¿Ya estuviste en Salvador?"],
         ["O que vocês *fizeram* ontem?", "¿Qué hicieron ayer?"]],
  "warn": "*fui* (yo) / *foi* (él): una letra cambia la persona. Y *tive*, "
          "*estive* con *i*: nunca «tuve», «estuve»."},

 {"h": "Irregulares: poder, querer, dizer, saber, trazer, pôr",
  "r": "Raíz nueva y terminaciones *-e* (eu, ele), *-emos*, *-eram*. Las "
       "formas de *eu* y *ele* son casi siempre iguales.",
  "table": {"head": ["", "eu", "ele / você", "eles"],
            "rows": [["poder", "pude", "pôde", "puderam"],
                     ["querer", "quis", "quis", "quiseram"],
                     ["dizer", "disse", "disse", "disseram"],
                     ["saber", "soube", "soube", "souberam"],
                     ["trazer", "trouxe", "trouxe", "trouxeram"],
                     ["pôr", "pus", "pôs", "puseram"]]},
  "ex": [["Não *pude* ir ao jogo.", "No pude ir al partido."],
         ["Ela *disse* que sim.", "Dijo que sí."],
         ["Ele não *quis* sair.", "No quiso salir."],
         ["*Soube* da festa ontem.", "Me enteré de la fiesta ayer."],
         ["Quem *trouxe* o violão?", "¿Quién trajo la guitarra?"]],
  "warn": "*pôde* (pasado) lleva circunflejo; *pode* (presente), no. "
          "*trouxe* se pronuncia «tróusi»: la *x* suena *s*.",
  "tip": "*saber* en perfeito = enterarse: *soube que…* = me enteré de "
         "que…"},

 {"h": "Irregulares: ver, vir, dar",
  "q": [{"prompt": "«Él vino a la fiesta.»", "answer": "Ele veio à festa.", "options": ["Ele veio à festa.", "Ele viu à festa.", "Ele vino à festa."]}],
  "r": "*ver*: *vi, viu*. *vir*: *vim, veio*. Se parecen mucho: separalos "
       "bien. *dar*: *dei, deu, demos, deram*.",
  "table": {"head": ["", "ver", "vir", "dar"],
            "rows": [["eu", "vi", "vim", "dei"],
                     ["tu", "viste", "vieste", "deste"],
                     ["ele / você", "viu", "veio", "deu"],
                     ["nós", "vimos", "viemos", "demos"],
                     ["eles / vocês", "viram", "vieram", "deram"]]},
  "ex": [["*Vi* o pôr do sol no Arpoador.", "Vi la puesta de sol en el Arpoador."],
         ["Ela *veio* de Recife.", "Vino de Recife."],
         ["*Vim* de ônibus.", "Vine en micro."],
         ["Ele *deu* um presente para a Bia.", "Le dio un regalo a Bia."]],
  "warn": "*vi* (vi) / *vim* (vine); *viu* (vio) / *veio* (vino). Si "
          "confundís *m*, decís otra cosa."},

 {"h": "comi = comí y he comido",
  "q": [{"prompt": "«Hoy he comido mucho.»", "answer": "Hoje eu comi muito.", "options": ["Hoje eu comi muito.", "Hoje eu tenho comido muito.", "Hoje eu hei comido muito."]}],
  "r": "El perfeito cubre **los dos** pasados del español. «He comido» "
       "se dice *comi*; *tenho comido* significa otra cosa (semana 21).",
  "ex": [["Hoje eu *acordei* cedo.", "Hoy me desperté / me he despertado temprano."],
         ["Você já *foi* a Paraty?", "¿Ya fuiste / has ido a Paraty?"],
         ["Ainda não *almocei*.", "Todavía no almorcé."],
         ["Nunca *comi* acarajé.", "Nunca comí acarajé."]],
  "warn": "«Tenho comido» no es «he comido»: significa «vengo comiendo». "
          "Para «hoy he ido», *hoje eu fui*.",
  "tip": "*já* + perfeito = «ya» o «alguna vez»: *você já foi à Bahia?*. "
         "Respuesta: *já* (sí) / *ainda não* (todavía no)."},

 {"h": "Contar un viaje",
  "r": "Para ordenar el relato: *primeiro*, *depois*, *então* (entonces), *aí* "
       "(habla), *no fim*. Para ubicarlo: *ontem*, *semana passada*, *no "
       "sábado*.",
  "ex": [["*Ontem* a gente foi a Niterói.", "Ayer fuimos a Niterói."],
         ["*Primeiro* pegamos a barca.", "Primero tomamos el barco."],
         ["*Depois* almoçamos no MAC.", "Después almorzamos en el MAC."],
         ["*Aí* começou a chover.", "Ahí empezó a llover."],
         ["*No fim*, voltamos de Uber.", "Al final, volvimos en Uber."]],
  "tip": "*semana passada*, *mês passado*, *ano passado*: sin artículo y "
         "sin «el». *anteontem* = anteayer."},
]},

12: {
"intro": "Dar instrucciones, aconsejar en la farmacia y contar tu rutina "
         "con los reflexivos. El imperativo de Brasil tiene dos caras: la "
         "escrita (*fale*) y la hablada (*fala*).",
"parts": [
 {"h": "El imperativo: escrito y hablado", "blocks": [0, 1, 2]},
 {"h": "Reflexivos y la rutina", "blocks": [3, 4, 5]},
 {"h": "En la farmacia y en la cocina", "blocks": [6]},
 {"h": "Pedir perdón, reclamar y las respuestas cortas", "blocks": [7, 8, 9]},
],
"blocks": [
 {"h": "Imperativo de você",
  "q": [{"prompt": "«Hable más despacio, por favor.» (a você)", "answer": "Fale mais devagar, por favor.", "options": ["Fale mais devagar, por favor.", "Hable mais devagar, por favor.", "Falo mais devagar, por favor."]}],
  "r": "Tomá el *eu* del presente, sacá la *-o* y poné la vocal "
       "**contraria**: *-ar → -e*, *-er / -ir → -a*. *vocês*: *-em / -am*.",
  "table": {"head": ["Infinitivo", "eu (presente)", "você", "vocês"],
            "rows": [["falar", "falo", "fale", "falem"],
                     ["comer", "como", "coma", "comam"],
                     ["abrir", "abro", "abra", "abram"],
                     ["fazer", "faço", "faça", "façam"],
                     ["dizer", "digo", "diga", "digam"],
                     ["vir", "venho", "venha", "venham"]]},
  "ex": [["*Fale* devagar, por favor.", "Hable despacio, por favor."],
         ["*Abra* a janela.", "Abra la ventana."],
         ["*Faça* o favor de esperar.", "Haga el favor de esperar."],
         ["*Tomem* cuidado!", "¡Tengan cuidado!"],
         ["*Seja* paciente e *vá* devagar.", "Sea paciente y vaya despacio."]],
  "warn": "Seis irregulares que no siguen la regla: *seja* (ser), *esteja* "
          "(estar), *vá* (ir), *dê* (dar), *saiba* (saber), *queira* "
          "(querer).",
  "tip": "Esta forma es la de carteles, recetas, prospectos y trato "
         "formal: *Aperte o botão*, *Mantenha a porta fechada*.",
  "more": ["Los seis irregulares, en uso: *seja bem-vindo* (sea "
           "bienvenido), *esteja aqui cedo* (esté acá temprano), *vá pela "
           "praia* (vaya por la playa), *dê uma olhada* (eche un vistazo), "
           "*saiba mais* (sepa más, en anuncios), *queira sentar* (tome "
           "asiento, muy formal)."]},

 {"h": "El imperativo hablado: fala!, vem cá!",
  "r": "En la charla de Brasil se usa la forma de *tu*, que es igual a la "
       "tercera del presente: *fala!*, *olha!*, *vem cá!*, *come!*.",
  "table": {"head": ["Infinitivo", "Habla", "Escrito / formal"],
            "rows": [["olhar", "olha!", "olhe!"],
                     ["vir", "vem!", "venha!"],
                     ["ir", "vai!", "vá!"],
                     ["fazer", "faz!", "faça!"],
                     ["dizer", "diz! / fala!", "diga!"]]},
  "ex": [["*Olha* o Cristo ali!", "¡Mirá el Cristo ahí!"],
         ["*Vem* cá!", "¡Vení para acá!"],
         ["*Fala* sério!", "¡No te puedo creer! / ¡Hablá en serio!"],
         ["*Senta* aí.", "Sentate ahí."]],
  "tip": "Con amigos, *fala*; con un cliente o un desconocido mayor, "
         "*fale*. Mezclar en la misma frase es normal en Brasil."},

 {"h": "El imperativo negativo",
  "q": [{"prompt": "«¡No hagas eso!» (formal, escrito)", "answer": "Não faça isso!", "options": ["Não faça isso!", "Não hagas isso!", "Não fazes isso!"]}],
  "r": "Norma: *não* + la forma de *você*: *não fale*, *não faça*. En el "
       "habla se oye *não fala*, *não faz*.",
  "ex": [["*Não fale* alto.", "No hable fuerte."],
         ["*Não esqueça* o protetor solar.", "No te olvides del protector."],
         ["*Não faz* isso! (habla)", "¡No hagas eso!"],
         ["*Não se preocupe*.", "No se preocupe."]],
  "warn": "No existe «no hables» con *-s*: nada de «não fales» en Brasil. "
          "*Não fale* (escrito) o *não fala* (habla)."},

 {"h": "Reflexivos: el pronombre adelante",
  "q": [{"prompt": "«Me levanto a las siete.» (como se dice en Brasil)", "answer": "Eu me levanto às sete.", "options": ["Eu me levanto às sete.", "Eu levanto-me às sete.", "Eu se levanto às sete."]}],
  "r": "*me, te, se, nos, se*. En Brasil van **delante** del verbo: *eu "
       "me levanto*. En Portugal, detrás: *levanto-me*.",
  "table": {"head": ["", "levantar-se", "chamar-se"],
            "rows": [["eu", "me levanto", "me chamo"],
                     ["tu", "te levantas", "te chamas"],
                     ["ele / você", "se levanta", "se chama"],
                     ["nós", "nos levantamos", "nos chamamos"],
                     ["eles / vocês", "se levantam", "se chamam"]]},
  "ex": [["Eu *me levanto* às seis.", "Me levanto a las seis."],
         ["Como você *se chama*?", "¿Cómo te llamás?"],
         ["A gente *se vê* amanhã.", "Nos vemos mañana."],
         ["Ela *se veste* rápido.", "Se viste rápido."]],
  "warn": "Con *você* y con *a gente* el reflexivo es *se*: *você se "
          "chama*, *a gente se vê*. «Você te chama» es error.",
  "more": ["La norma escrita tradicional no empieza la frase con pronombre "
           "(*Chamo-me Ana*), pero en Brasil hasta los diarios escriben *Me "
           "chamo Ana*. Con imperativo formal va detrás: *sente-se*, "
           "*levante-se*. Lo verás completo en la semana 16."]},

 {"h": "Menos reflexivos que en español",
  "r": "Varios verbos que en español llevan *se* en Brasil se usan sin "
       "él: *acordar* (despertarse), *lembrar* (acordarse), *casar*, "
       "*sentar*.",
  "ex": [["Eu *acordo* às sete.", "Me despierto a las siete."],
         ["Você *lembra* do João?", "¿Te acordás de João?"],
         ["Eles *casaram* em Búzios.", "Se casaron en Búzios."],
         ["*Senta* aqui!", "¡Sentate acá!"],
         ["*Esqueci* a chave.", "Me olvidé la llave."]],
  "warn": "*acordar* = despertarse; *lembrar* = acordarse. «Acordo do "
          "João» no es «me acuerdo de João»: es un disparate.",
  "tip": "*lembrar de* y *esquecer de* llevan *de* ante objeto: *lembro "
         "do show*, *esqueci da reunião*. También *me lembro*, más "
         "formal."},

 {"h": "La rutina: tomar banho, escovar os dentes",
  "r": "La rutina en Brasil: *acordar, tomar banho* (ducharse), "
       "*escovar os dentes*, *se vestir*, *tomar café*, *sair*, *voltar*, "
       "*deitar*.",
  "ex": [["*Tomo banho* de manhã.", "Me ducho a la mañana."],
         ["Ela *escova os dentes*.", "Se cepilla los dientes."],
         ["A gente *toma café* às oito.", "Desayunamos a las ocho."],
         ["*Me deito* à meia-noite.", "Me acuesto a medianoche."]],
  "warn": "*banho* es ducha o baño (el acto); el cuarto es *banheiro*. Y "
          "*tomar banho de mar* = meterse al mar.",
  "tip": "Los brasileños se duchan dos o tres veces por día en verano: "
         "*tomar um banho* es la cortesía que te ofrecen al llegar de la "
         "playa."},

 {"h": "Farmacia, cuerpo y recetas",
  "q": [{"prompt": "«Me duele la espalda.»", "answer": "Estou com dor nas costas.", "options": ["Estou com dor nas costas.", "Estou com dor na costa.", "Estou com dor na espalda."]}],
  "r": "Para el cuerpo: *estar com dor de…* o *doer* (*dói a cabeça*). "
       "Consejos y recetas, con imperativo de *você*: *tome*, *coloque*, "
       "*misture*.",
  "table": {"head": ["Parte", "Português"],
            "rows": [["cabeza / garganta", "a cabeça / a garganta"],
                     ["espalda", "as costas"],
                     ["panza / estómago", "a barriga / o estômago"],
                     ["rodilla / hombro", "o joelho / o ombro"],
                     ["cuello", "o pescoço"]]},
  "ex": [["*Estou com dor de* cabeça.", "Me duele la cabeza."],
         ["*Dói* o joelho.", "Me duele la rodilla."],
         ["*Tome* este remédio de oito em oito horas.", "Tome este remedio cada ocho horas."],
         ["*Beba* muita água e *descanse*.", "Tome mucha agua y descanse."],
         ["*Corte* a cebola e *misture* tudo.", "Corte la cebolla y mezcle todo."]],
  "warn": "*as costas* = la espalda (plural y femenino). «A costa» es la "
          "costa del mar. Y *a dor* es femenino: *uma dor forte*."},

 {"h": "Palavras que não estão no dicionário (2): imagina, pode deixar, poxa, nossa",
  "q": [{"prompt": "—Obrigada pela ajuda! ¿Qué respondés?", "answer": "Imagina!", "options": ["Imagina!", "Imagine!", "Nossa!"]}],
  "r": "Respuestas cortas bien brasileñas: *imagina!* (de nada), *pode deixar!* (yo me ocupo), *poxa* (lástima, fastidio), *nossa!* (sorpresa).",
  "ex": [["— Obrigada pela ajuda! — *Imagina!*", "—¡Gracias por la ayuda! —¡De nada!"], ["— Leva o lixo? — *Pode deixar!*", "—¿Sacás la basura? —¡Dejá, yo me ocupo!"], ["*Poxa*, que pena!", "¡Uh, qué lástima!"], ["*Nossa*, que calor!", "¡Uy, qué calor!"]],
  "warn": "*imagina* después de un «gracias» no es «imaginá»: es «de nada, no es nada».",
  "tip": "*Nossa* viene de *Nossa Senhora*; *poxa* es la versión suave de una mala palabra."},

 {"h": "Pedir desculpas e reclamar",
  "q": [{"prompt": "Llegaste tarde a encontrarte con un amigo. Elegí lo más natural.", "answer": "Foi mal, me atrasei!", "options": ["Foi mal, me atrasei!", "Com licença, me atrasei!", "De nada, me atrasei!"]}],
  "r": "Para disculparte: *desculpa* (lo común), *foi mal* (informal), *sinto muito* (algo grave). Para reclamar sin pelear: *olha, acho que teve um engano*.",
  "ex": [["*Desculpa* o atraso!", "¡Perdón por la demora!"], ["*Foi mal*, esqueci!", "¡Uh, perdón, me olvidé!"], ["*Sinto muito* pela sua avó.", "Lo siento mucho por tu abuela."], ["*Olha, acho que teve um engano*: pedi sem cebola.", "Mire, creo que hubo un error: pedí sin cebolla."], ["*Com licença*, posso passar?", "Permiso, ¿puedo pasar?"]],
  "warn": "*Com licença* es «permiso» (para pasar o interrumpir), no «perdón por el error»: para eso, *desculpa*."},

 {"h": "Sotaque da semana: Minas Gerais",
  "q": [{"prompt": "En Minas, «Me passa esse trem» quiere decir…", "answer": "Pasame esa cosa.", "options": ["Pasame esa cosa.", "Pasame ese tren.", "Pasame ese trago."]}],
  "r": "El mineiro «se come» sílabas (*pó pô* = *pode pôr*) y tiene su muletilla: *uai*, sorpresa o evidencia. *Trem* es «cosa», cualquier cosa.",
  "ex": [["*Uai*, cê não vem?", "¿Eh? ¿No venís? (uai: sorpresa)"], ["Me passa esse *trem* aí.", "Pasame esa cosa (trem = cosa, en Minas)"], ["Ô, *sô*, vem cá!", "¡Eh, señor, vení! (sô = senhor)"]],
  "tip": "La voz de la app es la estándar: el acento no se oye, las palabras sí."},

]},

13: {
"intro": "Semana de CHEFÃO: no hay teoría nueva. Es la hoja de repaso de "
         "la primera estación: leela antes de entrar y volvé cada vez que "
         "falles.",
"parts": [
 {"h": "Repaso: palabras, artículos y contracciones", "blocks": [0, 1, 2]},
 {"h": "Repaso: el presente y el perfeito", "blocks": [3, 4, 5]},
 {"h": "Repaso: posesivos, lugares y las trampas", "blocks": [6, 7]},
],
"blocks": [
 {"h": "Plurales y géneros",
  "q": [{"prompt": "Plural de «a estação»:", "answer": "as estações", "options": ["as estações", "as estaçãos", "as estaciones"]}],
  "r": "*-ão → -ões* (casi siempre), *-l → -is*, *-m → -ns*. Géneros al "
       "revés: *o leite, a árvore*, y casi todo *-agem* femenino (excepciones: *o personagem, o pajem*).",
  "ex": [["limão → *limões*, pão → *pães*, mão → *mãos*", "los tres plurales de -ão"],
         ["animal → *animais*, papel → *papéis*", "-l → -is"],
         ["homem → *homens*", "-m → -ns"],
         ["*o* leite, *o* sangue, *a* ponte, *a* viagem", "géneros al revés"]]},

 {"h": "Contracciones",
  "r": "Obligatorias con *em, de, a, por* + artículo o demostrativo: "
       "*no, da, ao, à, pelo, neste, dele*.",
  "table": {"head": ["", "o", "a", "este", "aquele", "ele"],
            "rows": [["em (en)", "no", "na", "neste", "naquele", "nele (semana 14)"],
                     ["de (de)", "do", "da", "deste", "daquele", "dele"],
                     ["a (a)", "ao", "à", "a este (separado)", "àquele", "a ele (separado)"],
                     ["por (por)", "pelo", "pela", "por este (separado)", "por aquele (separado)", "por ele (separado)"]]},
  "ex": [["Estou *na* praia *do* Leblon.", "Estoy en la playa de Leblon."],
         ["Vou *ao* Maracanã e depois *à* Lapa.", "Voy al Maracaná y después a Lapa."],
         ["Passo *pelo* calçadão.", "Paso por la rambla."],
         ["Moro *neste* prédio; o carro *dele* está na rua.", "Vivo en este edificio; el auto de él está en la calle."],
         ["Vamos *àquele* bar *da* esquina?", "¿Vamos a aquel bar de la esquina?"]]},

 {"h": "Adjetivos, números y muito",
  "r": "*muito* = muy (invariable) y mucho (concuerda). *um / uma*, *dois / "
       "duas*, *duzentos / duzentas* concuerdan.",
  "ex": [["*muito* bonitas / *muitas* amigas", "muy lindas / muchas amigas"],
         ["*duas* cervejas, vinte e *uma* pessoas", "números con género"],
         ["olhos *azuis*, exercícios *fáceis*", "plurales en -l"],
         ["Ela é *portuguesa*; ele é *alemão*.", "nacionalidades"]]},

 {"h": "Presente regular e irregular",
  "r": "*você* y *a gente* con verbo en tercera. Irregulares en *eu*: "
       "*faço, digo, posso, sei, vejo, dou, saio, ouço, peço, durmo*.",
  "table": {"head": ["", "falar", "ir", "fazer", "poder"],
            "rows": [["eu", "falo", "vou", "faço", "posso"],
                     ["ele / você / a gente", "fala", "vai", "faz", "pode"],
                     ["nós", "falamos", "vamos", "fazemos", "podemos"],
                     ["eles / vocês", "falam", "vão", "fazem", "podem"]]},
  "ex": [["*A gente vai* à praia?", "¿Vamos a la playa?"],
         ["*Você quer* um mate?", "¿Querés un mate?"],
         ["Ela *dorme* pouco.", "Duerme poco: sin diptongo."]]},

 {"h": "ir + infinitivo y estar + gerúndio",
  "r": "*vou* + infinitivo sin «a»; *estou* + *-ando, -endo, -indo*.",
  "ex": [["*Vou viajar* amanhã.", "Voy a viajar mañana."],
         ["*Estou comendo* um pastel.", "Estoy comiendo una empanada."],
         ["O que você *está fazendo*?", "¿Qué estás haciendo?"]]},

 {"h": "Pretérito perfeito",
  "q": [{"prompt": "«Anoche vinieron a casa.»", "answer": "Ontem à noite eles vieram aqui em casa.", "options": ["Ontem à noite eles vieram aqui em casa.", "Ontem à noite eles viram aqui em casa.", "Ontem à noite eles vinheram aqui em casa."]}],
  "r": "*-ei / -ou*, *-i / -eu*, *-i / -iu*. Irregulares clave: *fui, "
       "tive, estive, fiz, pude, quis, disse, vi, vim, dei, soube, "
       "trouxe, pus*.",
  "ex": [["*Fui* ao Rio e *vi* o Cristo.", "Fui a Río y vi el Cristo."],
         ["Ela *veio* e *trouxe* um bolo.", "Vino y trajo una torta."],
         ["Hoje eu *comi* muito.", "Hoy comí / he comido mucho."]],
  "warn": "*foi* ≠ *fui*; *vi* ≠ *vim*; *viu* ≠ *veio*. Y «he comido» es "
          "*comi*, nunca «tenho comido»."},

 {"h": "Posesivos, lugares y imperativo",
  "r": "*seu* = de *você*; *dele / dela* para terceros. *em* para estar, "
       "*a / para* para ir, *de* + transporte. Imperativo: *fale / fala*.",
  "ex": [["O carro *dele* é vermelho.", "El auto de él es rojo."],
         ["Moro *no* Rio e vou *de* metrô.", "Vivo en Río y voy en subte."],
         ["*Vire* à direita. / *Vira* à direita!", "Doble a la derecha (escrito / habla)."]]},

 {"h": "Las seis trampas del hispanohablante",
  "q": [{"prompt": "¿Cuál está bien?", "answer": "Conheci o Pedro na praia.", "options": ["Conheci o Pedro na praia.", "Conheci ao Pedro na praia.", "Conheci a Pedro em a praia."]}],
  "r": "Repasalas antes del examen: son las que más puntos cuestan.",
  "ex": [["*Estou na* praia.", "1. Contracción obligatoria."],
         ["*muito* bonita", "2. Nunca «muy»."],
         ["*a gente fala*", "3. a gente + tercera singular."],
         ["*Vou viajar.*", "4. ir + infinitivo sin «a»."],
         ["Vi *o* João.", "5. Sin «a» personal."]],
  "warn": "6. *acordar* = despertarse, *esquisito* = raro, *roxo* = "
          "violeta, *escritório* = oficina: los falsos amigos no avisan."},
]},

}
