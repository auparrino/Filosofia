# -*- coding: utf-8 -*-
"""Ejercicios de la Estação 4 — O Cume (semanas 40-51, B2 → C1).

Al menos 45 ítems por semana (la 52 es el examen final, que va aparte).
Mezcla por semana: 12 choice, 12 cloze, 8 translate, 4 fixerr, 3 garden,
2 scopri, 2 typed y 3 combina.  «part» es el índice de la parte de la
lección (tools/lessons/s4.py) que el ítem ejercita.  Nada antes de su
teoría: cada ítem usa solo tiempos con TENSE_WEEK <= su semana.

Contenido: el Rio cotidiano (Copacabana, Lapa, o boteco, o bloco) mezclado
con historia, literatura, sociología y política de Brasil y Portugal
(1808, Abolição, República, ditadura, Constituição de 1988; Machado,
Pessoa, Saramago, Freyre, Sérgio Buarque, DaMatta, Paulo Freire...).
"""

CE = "Elegí la forma correcta."
CL = "Completá."
TR = "Traducí al portugués."
GP = "Mirá los tres ejemplos y completá el cuarto."
SP = "Leé las frases y descubrí la regla."
CB = "Uní las frases en una sola usando el conector entre paréntesis."
FX = "Encontrá el error: tocá la palabra que está mal y corregila."

ITEMS = []
_N = {}


def _add(w, part, typ, prompt, stem, answer, note, alt=None, **extra):
    _N[w] = _N.get(w, 0) + 1
    d = dict(id="s4-%d-%02d" % (w, _N[w]), w=w, part=part,
             level="B2" if w == 40 else "C1", type=typ, prompt=prompt,
             stem=stem, answer=answer, alt=list(alt or []), note=note)
    d.update(extra)
    ITEMS.append(d)


def ch(w, p, stem, options, answer, note, prompt=CE):
    _add(w, p, "choice", prompt, stem, answer, note, options=list(options))


def cl(w, p, stem, answer, note, alt=None, prompt=CL):
    _add(w, p, "cloze", prompt, stem, answer, note, alt)


def tr(w, p, stem, answer, alt, note, prompt=TR):
    _add(w, p, "translate", prompt, stem, answer, note, alt)


def fx(w, p, stem, bad, good, cat, note, goodAlt=None, alt=None):
    extra = dict(bad=bad, good=good, cat=cat)
    if goodAlt:
        extra["goodAlt"] = goodAlt
    _add(w, p, "fixerr", FX, stem, stem.replace(bad, good, 1), note, alt, **extra)


def gd(w, p, lead, stem, answer, trap, note, alt=None):
    _add(w, p, "garden", GP, stem, answer, note, alt, lead=lead, trap=trap)


def sc(w, p, data, stem, options, answer, note):
    _add(w, p, "scopri", SP, stem, answer, note, data=list(data),
         options=list(options))


def ty(w, p, prompt, stem, answer, note, alt=None):
    _add(w, p, "typed", prompt, stem, answer, note, alt)


def cb(w, p, stem, answer, alt, note):
    _add(w, p, "combina", CB, stem, answer, note, alt)


# ===========================================================================
# Semana 40 — Registro formal e nominalização (B2)
# parts: 0 nominalización · 1 haver y verbos del informe · 2 cohesión e
# impersonalidad
# ===========================================================================
W = 40
ch(W, 0, "A ___ dos dados do censo levou meses.",
   ["análise", "analisação", "analisamento"], "análise",
   "analisar → a análise, sin sufijo -ção ni -mento, y femenino: a análise.")
ch(W, 0, "O ___ da passagem de ônibus provocou os protestos de 2013.",
   ["aumento", "aumentamento", "aumentação"], "aumento",
   "aumentar → o aumento. Las Jornadas de Junho de 2013 empezaron contra una suba del boleto.")
ch(W, 0, "A ___ da Lei Áurea, em 13 de maio de 1888, aboliu a escravidão.",
   ["assinatura", "assinação", "assinamento"], "assinatura",
   "assinar → a assinatura (la firma). La Lei Áurea la firmó la princesa Isabel.")
ch(W, 0, "A ___ da capital do Rio para Brasília aconteceu em 1960.",
   ["transferência", "transferimento", "transferição"], "transferência",
   "transferir → a transferência (-ência, femenino). Brasília se inauguró el 21 de abril de 1960.")
ch(W, 0, "Houve ___ nas vendas do comércio carioca em janeiro.",
   ["uma queda", "uma caída", "um caimento"], "uma queda",
   "cair → a queda (la caída, la baja). «Caída» no existe en portugués.")
ch(W, 1, "No Brasil colonial, ___ centenas de quilombos além de Palmares.",
   ["havia", "haviam", "tinham"], "havia",
   "haver existencial no tiene plural: havia centenas de quilombos. «Haviam» es el mismo error que «habían muchos» en español.",
   prompt="Elegí la forma de la norma escrita.")
ch(W, 1, "Durante a ditadura, ___ censura prévia aos jornais.",
   ["houve", "houveram", "tiveram"], "houve",
   "«Hubo» = houve, siempre en singular. En el habla se oye «teve censura», pero no «tiveram».",
   prompt="Elegí la forma de la norma escrita.")
ch(W, 1, "A comissão procedeu ___ exame dos documentos.",
   ["ao", "o", "no"], "ao",
   "proceder a (dar comienzo a) rige «a»: a + o = ao exame; ante femenino, à análise.")
ch(W, 1, "A audiência pública foi ___ no Palácio Tiradentes.",
   ["realizada", "realizado", "feito"], "realizada",
   "En la pasiva el participio concuerda con el sujeto: a audiência foi realizada. «Realizar» es el verbo del informe para eventos.")
ch(W, 1, "Pode ___ atrasos na entrega do relatório.",
   ["haver", "haverem", "havendo"], "haver",
   "Con haver existencial, el auxiliar queda en singular y haver en infinitivo: pode haver atrasos.")
ch(W, 2, "Freyre publicou Casa-Grande & Senzala em 1933; Sérgio Buarque, Raízes do Brasil em 1936. ___ era pernambucano; este, paulista.",
   ["Aquele", "Este", "Esse"], "Aquele",
   "aquele retoma lo nombrado primero (Freyre, de Recife); este, lo último (Sérgio Buarque, de São Paulo).")
ch(W, 2, "___ mudanças importantes na zona portuária depois de 2016.",
   ["Observam-se", "Observa-se", "Se observam"], "Observam-se",
   "Pasiva con se: el verbo concuerda con mudanças (plural). Al principio de la oración, la norma pide ênclise: Observam-se.")

cl(W, 0, "A ___ (reduzir) da maioridade penal divide o Congresso.", "redução",
   "reduzir → a redução: -zir da -ção, y el sustantivo es femenino.")
cl(W, 0, "O ___ (crescer) das favelas acelerou no século XX.", "crescimento",
   "crescer → o crescimento (-mento, masculino). Ojo: sin la i del español «crecimiento».")
cl(W, 0, "A ___ (perder) do acervo do Museu Nacional, em 2018, foi irreparável.", "perda",
   "perder → a perda (la pérdida), sin sufijo. El Museu Nacional, en la Quinta da Boa Vista, se incendió en 2018.")
cl(W, 0, "O ___ (fechar) do Canecão entristeceu os cariocas.", "fechamento",
   "fechar → o fechamento (el cierre). Muy usado en noticias: o fechamento da praia, do museu.")
cl(W, 0, "A ___ (vender) de ingressos para o Rock in Rio esgotou em horas.", "venda",
   "vender → a venda (la venta), sin sufijo y femenino.")
cl(W, 1, "Em 1808, com a chegada da corte, ___ (haver, perfeito) uma mudança radical no Rio.", "houve",
   "Perfeito de haver existencial: houve. La corte portuguesa llegó a Río en 1808 huyendo de Napoleón.")
cl(W, 1, "Segundo o relatório, ___ (haver, presente) muitas falhas na obra.", "há",
   "haver existencial en presente: há, con tilde, y en singular aunque siga un plural.")
cl(W, 1, "A prefeitura procedeu ___ vistoria dos prédios do Centro.", "à",
   "*Proceder* («realizar») pide *a*; con sustantivo femenino hay *crase*: *procedeu à vistoria*.")
cl(W, 1, "Os técnicos ___ (constatar, perfeito) que a água estava imprópria para banho.", "constataram",
   "constatar = comprobar un hecho. Perfeito, 3.ª plural: constataram.")
cl(W, 2, "Os dados foram coletados e, depois, nós ___ analisamos.", "os",
   "Para no repetir «os dados», el pronombre directo os. En la escritura cuidada de Brasil, «nós os analisamos».")
cl(W, 2, "___ (realizar-se, perfeito) duas audiências públicas sobre o VLT.", "Realizaram-se",
   "Pasiva con se: concuerda con audiências (plural) y, al inicio, el pronombre va después: Realizaram-se.")
cl(W, 2, "Neste artigo, ___ (discutir, nós) o conceito de «homem cordial».", "discutimos",
   "El nós de modestia es típico del texto académico: discutimos, analisamos, propomos.")

tr(W, 0, "El aumento de los precios preocupa al gobierno.",
   "O aumento dos preços preocupa o governo.",
   ["O aumento de preços preocupa o governo"],
   "aumentar → o aumento; de + os = dos. preocupar lleva objeto directo: preocupa o governo, sin «a».")
tr(W, 0, "La decisión del intendente fue polémica.",
   "A decisão do prefeito foi polêmica.",
   ["A decisão do prefeito foi controversa", "A decisão do prefeito foi controvertida"],
   "decidir → a decisão; el intendente es o prefeito. polêmica, con circunflejo.")
tr(W, 0, "El análisis de los datos llevó dos meses.",
   "A análise dos dados levou dois meses.",
   ["A análise dos dados demorou dois meses", "A análise dos dados durou dois meses"],
   "a análise es femenino; de + os = dos.")
tr(W, 1, "Hubo muchas protestas en 2013.",
   "Houve muitos protestos em 2013.",
   ["Em 2013 houve muitos protestos", "Houve muitas manifestações em 2013",
    "Em 2013 houve muitas manifestações"],
   "houve en singular; y protesto es masculino: muitos protestos.")
tr(W, 1, "Había pocos libros sobre Palmares.",
   "Havia poucos livros sobre Palmares.",
   ["Existiam poucos livros sobre Palmares"],
   "havia, nunca «haviam». Palmares fue el mayor quilombo del Brasil colonial.")
tr(W, 1, "La reunión se realizó en el Palácio Tiradentes.",
   "A reunião foi realizada no Palácio Tiradentes.",
   ["A reunião realizou-se no Palácio Tiradentes", "A reunião se realizou no Palácio Tiradentes"],
   "realizar es el verbo formal para eventos; em + o = no.")
tr(W, 2, "Se observa una caída de la violencia.",
   "Observa-se uma queda da violência.",
   ["Observa-se uma queda na violência", "Nota-se uma queda da violência",
    "Nota-se uma queda na violência", "Constata-se uma queda da violência",
    "Constata-se uma queda na violência", "Verifica-se uma queda da violência",
    "Verifica-se uma queda na violência"],
   "Al inicio, ênclise: Observa-se. «Caída» se dice queda.")
tr(W, 2, "En este trabajo analizamos la obra de Darcy Ribeiro.",
   "Neste trabalho, analisamos a obra de Darcy Ribeiro.",
   ["Nesse trabalho, analisamos a obra de Darcy Ribeiro"],
   "em + este = neste; el nós de modestia académico. Darcy Ribeiro escribió O Povo Brasileiro (1995).")

fx(W, 1, "Haviam mais de um milhão de pessoas na Candelária em abril de 1984.",
   "Haviam", "Havia", "concordancia",
   "haver existencial no concuerda: havia um milhão de pessoas. El acto de las Diretas Já en la Candelária reunió a cerca de un millón.")
fx(W, 0, "O análise dos documentos durou um ano.", "O análise", "A análise", "genero",
   "análise es femenino en portugués (el análisis): a análise.")
fx(W, 0, "O investimiento em saneamento ainda é baixo.", "investimiento", "investimento", "espanol",
   "-miento → -mento: o investimento, o crescimento, o casamento.")
fx(W, 2, "Realizou-se três reuniões com os moradores da Maré.", "Realizou-se", "Realizaram-se", "concordancia",
   "En la pasiva con se, el verbo concuerda con el sujeto plural: realizaram-se três reuniões.")

gd(W, 0, [["aumentar", "o aumento"], ["pagar", "o pagamento"], ["investir", "o investimento"]],
   "analisar → ___", "a análise", "o analisamento",
   "Muchos verbos dan -mento, pero analisar da a análise, sin sufijo y femenina (el análisis).",
   alt=["análise"])
gd(W, 0, [["informar", "a informação"], ["reduzir", "a redução"], ["decidir", "a decisão"]],
   "pesquisar → ___", "a pesquisa", "a pesquisação",
   "El patrón -ção es fuerte, pero pesquisar da a pesquisa: la investigación o la encuesta.",
   alt=["pesquisa"])
gd(W, 1, [["Chegou um aluno.", "Chegaram dois alunos."], ["Caiu uma árvore.", "Caíram duas árvores."],
          ["Saiu uma notícia.", "Saíram duas notícias."]],
   "Houve um protesto. → ___ dois protestos.", "Houve", "Houveram",
   "Los verbos normales concuerdan con el sujeto, pero haver existencial no tiene sujeto: houve dois protestos.")

sc(W, 0, ["decidir → a decisão", "informar → a informação", "reduzir → a redução",
          "pagar → o pagamento", "investir → o investimento", "crescer → o crescimento"],
   "¿Qué género tienen los sustantivos en -ção y en -mento?",
   ["-ção es femenino y -mento, masculino.",
    "Los dos son masculinos, como el español «el».",
    "Depende del género del verbo."],
   "-ção es femenino y -mento, masculino.",
   "Regla: a decisão, as informações (femeninos); o pagamento, o crescimento (masculinos).")
sc(W, 1, ["Há muitos turistas no Rio.", "Havia dois bondes em Santa Teresa.", "Houve protestos em 2013.",
          "Haverá eleições em outubro.", "Pode haver atrasos.", "Deve haver outra saída."],
   "¿Cómo se conjuga «haver» cuando significa «existir»?",
   ["Queda siempre en singular, también el auxiliar.",
    "Concuerda con el sustantivo que sigue, como «hubieron» en el habla.",
    "Va en plural solo en el pasado."],
   "Queda siempre en singular, también el auxiliar.",
   "haver existencial es impersonal: há, havia, houve, haverá; y pode haver, deve haver.")

ty(W, 0, "Escribí el sustantivo, con artículo, que corresponde al verbo.", "vender → ___", "a venda",
   "vender → a venda (la venta).", alt=["venda"])
ty(W, 1, "Escribí la forma de «haver» de la norma culta.", "Ontem ___ (haver) um apagão em Botafogo.", "houve",
   "«Hubo» es *houve*, perfeito de *haver*, impersonal y siempre en singular: *houve um apagão*. En el habla, *teve*.")

cb(W, 0, "Os preços aumentaram. Isso preocupa os comerciantes. (o aumento de)",
   "O aumento dos preços preocupa os comerciantes.",
   ["O aumento de preços preocupa os comerciantes"],
   "La nominalización condensa: os preços aumentaram → o aumento dos preços.")
cb(W, 2, "O governo publicou os dados. O governo analisou os dados. (e + pronombre)",
   "O governo publicou os dados e os analisou.",
   ["O governo publicou os dados e analisou-os"],
   "Para no repetir, el pronombre directo: e os analisou (o analisou-os).")
cb(W, 2, "A Constituição foi promulgada em 1988. A Constituição é chamada de «Constituição Cidadã». (que)",
   "A Constituição, que foi promulgada em 1988, é chamada de «Constituição Cidadã».",
   ["A Constituição que foi promulgada em 1988 é chamada de Constituição Cidadã",
    "A Constituição, promulgada em 1988, é chamada de «Constituição Cidadã»",
    "A Constituição promulgada em 1988 é chamada de Constituição Cidadã"],
   "El relativo que evita repetir el sujeto. Ulysses Guimarães la llamó «Constituição Cidadã» al promulgarla, el 5 de octubre de 1988.")


# ===========================================================================
# Semana 41 — Mais-que-perfeito simples e narrativa
# parts: 0 forma y trampa · 1 tres formas / dónde se lee · 2 expresiones
# fijas y narración
# ===========================================================================
W = 41
ch(W, 0, "Quando a polícia chegou, o ladrão já ___.",
   ["fugira", "fugisse", "fugiria"], "fugira",
   "fugira = tinha fugido (había huido): mais-que-perfeito, indicativo. fugisse es subjuntivo.")
ch(W, 0, "Nós já ___ a reserva quando o voo foi cancelado.",
   ["fizéramos", "fizeramos", "fizéssemos"], "fizéramos",
   "La 1.ª plural del mais-que-perfeito lleva tilde: fizéramos, fôramos, estivéramos.")
ch(W, 0, "Ela contou que o avô ___ em Trás-os-Montes.",
   ["nascera", "nascesse", "nacera"], "nascera",
   "nasceram → nascera (había nacido). Ojo con la grafía: nascer, con sc.")
ch(W, 0, "Quando lançou Dom Casmurro, em 1899, Machado já ___ Memórias Póstumas de Brás Cubas.",
   ["publicara", "publicasse", "publicaria"], "publicara",
   "El mais-que-perfeito simple (*publicara*) equivale a *tinha publicado*: marca lo anterior a otro pasado. Brás Cubas es de 1881, anterior a Dom Casmurro.")
ch(W, 0, "Se eu ___ dinheiro, iria a Lisboa no verão.",
   ["tivesse", "tivera", "tiver"], "tivesse",
   "La hipótesis va con imperfeito do subjuntivo: se eu tivesse. «Se eu tivera» es calco del español «tuviera».")
ch(W, 1, "Quando cheguei, o show já ___.",
   ["tinha acabado", "tem acabado", "tive acabado"], "tinha acabado",
   "En la charla, el pasado anterior es tinha + participio. tem acabado sería «viene terminando».",
   prompt="Elegí la forma natural en una charla.")
ch(W, 1, "Quando D. João VI voltou a Lisboa, em 1821, já ___ treze anos no Brasil.",
   ["passara", "passasse", "passava"], "passara",
   "passara = tinha passado: los trece años son anteriores a la vuelta. La corte vivió en Río de 1808 a 1821.")
ch(W, 1, "Em «ninguém sabia o que ele fizera», «fizera» equivale a ___.",
   ["tinha feito", "fizesse", "faria"], "tinha feito",
   "El mais-que-perfeito simples y tinha feito dicen lo mismo; el simple es literario.",
   prompt="Elegí la equivalencia.")
ch(W, 2, "Tomara que o Flamengo ___ o clássico no domingo.",
   ["ganhe", "ganha", "ganhou"], "ganhe",
   "tomara que (ojalá) pide subjuntivo: tomara que ganhe.")
ch(W, 2, "Ela trabalhou doze horas no plantão. — ___! Está exausta.",
   ["Pudera", "Tomara", "Quem me dera"], "Pudera",
   "*Pudera!* es «¡con razón!, ¡no es para menos!». *Tomara* y *quem me dera* expresan deseo, como «ojalá».")
ch(W, 2, "___ ter uma casa em Paraty!",
   ["Quem me dera", "Pudera", "Tomara que"], "Quem me dera",
   "*Quem me dera* + infinitivo expresa un deseo difícil: «¡quién pudiera!, ¡ojalá!». *Tomara que* pediría un verbo conjugado.")
ch(W, 2, "Era manhã de 1.º de novembro de 1755 em Lisboa. De repente, a terra ___.",
   ["tremeu", "tremia", "tremera"], "tremeu",
   "La acción que hace avanzar el relato va en perfeito: tremeu. El imperfeito pinta el fondo; el mais-que-perfeito, lo anterior.")

cl(W, 0, "Quando chegamos ao cais, o navio já ___ (partir, mais-que-perfeito simples).", "partira",
   "partiram → partira (había partido).", alt=["tinha partido", "havia partido"])
cl(W, 0, "Eles nunca ___ (ver, mais-que-perfeito simples) o mar antes de chegar ao Rio.", "viram",
   "En 3.ª plural el mais-que-perfeito es igual al perfeito: viram. El contexto («antes de») marca la anterioridad.",
   alt=["tinham visto", "haviam visto"])
cl(W, 0, "Nós ___ (estar, mais-que-perfeito simples) em Coimbra dois anos antes.", "estivéramos",
   "estiveram → estivéramos, con tilde en la 1.ª plural.", alt=["tínhamos estado", "havíamos estado"])
cl(W, 0, "Saramago contou que na juventude ___ (ser, mais-que-perfeito simples) serralheiro mecânico.", "fora",
   "ser e ir: foram → fora. Saramago trabajó de joven como cerrajero mecánico antes de ser escritor.",
   alt=["tinha sido", "havia sido"])
cl(W, 0, "Eu ___ (dizer, mais-que-perfeito simples) a verdade, mas ninguém acreditou.", "dissera",
   "disseram → dissera (había dicho), no «dijera».", alt=["tinha dito", "havia dito"])
cl(W, 1, "Quando a ditadura acabou, muitos exilados já ___ (voltar, habla) com a Anistia de 1979.", "tinham voltado",
   "En el habla: tinha + participio. La Lei da Anistia es de 1979; el régimen militar terminó en 1985.",
   alt=["haviam voltado", "voltaram"])
cl(W, 1, "Quando publicou A Hora da Estrela, em 1977, Clarice já ___ (escrever, mais-que-perfeito simples) A Paixão segundo G.H.", "escrevera",
   "escreveram → escrevera. A Paixão segundo G.H. es de 1964.", alt=["tinha escrito", "havia escrito"])
cl(W, 1, "O jornal noticiou que o incêndio ___ (começar, mais-que-perfeito simples) de madrugada.", "começara",
   "começaram → começara: la prensa escrita todavía usa esta forma.", alt=["tinha começado", "havia começado"])
cl(W, 2, "Quem me ___ (dar) morar perto do mar!", "dera",
   "quem me dera es una fórmula fija: el mais-que-perfeito de dar.")
cl(W, 2, "Tomara que ela ___ (vir) ao ensaio da Portela.", "venha",
   "tomara que + subjuntivo presente: venha.")
cl(W, 2, "Era tarde. Joana ___ (fechar, perfeito) a janela e se deitou.", "fechou",
   "La acción que avanza en el relato va en perfeito: fechou.")
cl(W, 2, "Quando a moça acordou, o sol já ___ (nascer, mais-que-perfeito simples).", "nascera",
   "nasceram → nascera: pasó antes de que ella se despertara.", alt=["tinha nascido", "havia nascido"])

tr(W, 0, "Cuando llegué, ella ya había salido.",
   "Quando cheguei, ela já tinha saído.",
   ["Quando eu cheguei, ela já tinha saído", "Quando cheguei, ela já havia saído",
    "Quando eu cheguei, ela já havia saído", "Quando cheguei, ela já saíra",
    "Quando eu cheguei, ela já saíra"],
   "«Había salido» es *tinha saído* en el habla; en la escritura, *havia saído* o el mais-que-perfeito simple *saíra*.")
tr(W, 0, "Si tuviera tiempo, leería a Eça de Queirós.",
   "Se eu tivesse tempo, leria Eça de Queirós.",
   ["Se tivesse tempo, leria Eça de Queirós", "Se eu tivesse tempo, eu leria Eça de Queirós",
    "Se eu tivesse tempo, leria o Eça de Queirós", "Se tivesse tempo, leria o Eça de Queirós"],
   "«Tuviera» = tivesse, nunca «tivera». Y sin «a»: ler Eça de Queirós, autor de Os Maias.")
tr(W, 1, "Nunca había visto el Cristo de cerca.",
   "Eu nunca tinha visto o Cristo de perto.",
   ["Nunca tinha visto o Cristo de perto", "Nunca havia visto o Cristo de perto",
    "Eu nunca havia visto o Cristo de perto", "Nunca vira o Cristo de perto",
    "Eu nunca vira o Cristo de perto"],
   "«Había visto» se dice *tinha visto* en el habla, *havia visto* o *vira* en la escritura. «De cerca» es *de perto*.")
tr(W, 1, "El diario dijo que Jânio Quadros había renunciado.",
   "O jornal disse que Jânio Quadros tinha renunciado.",
   ["O jornal disse que Jânio Quadros havia renunciado", "O jornal disse que Jânio Quadros renunciara",
    "O jornal noticiou que Jânio Quadros tinha renunciado", "O jornal noticiou que Jânio Quadros havia renunciado",
    "O jornal noticiou que Jânio Quadros renunciara"],
   "Jânio Quadros renunció en agosto de 1961, a los siete meses de gobierno.")
tr(W, 1, "Machado ya había fundado la Academia cuando publicó Dom Casmurro.",
   "Machado já tinha fundado a Academia quando publicou Dom Casmurro.",
   ["Machado já havia fundado a Academia quando publicou Dom Casmurro",
    "Machado já fundara a Academia quando publicou Dom Casmurro"],
   "La Academia Brasileira de Letras es de 1897 y Dom Casmurro, de 1899: anterioridad con tinha fundado o fundara.")
tr(W, 2, "¡Ojalá llueva mañana!", "Tomara que chova amanhã!",
   ["Tomara que amanhã chova", "Espero que chova amanhã", "Quem dera chovesse amanhã"],
   "tomara que + subjuntivo presente: chova.")
tr(W, 2, "¡Quién pudiera vivir en Lisboa!", "Quem me dera morar em Lisboa!",
   ["Quem me dera viver em Lisboa", "Quem dera morar em Lisboa", "Quem dera viver em Lisboa"],
   "*Quem me dera* + infinitivo es «¡quién pudiera!»: el deseo se expresa sin conjugar el verbo principal.")
tr(W, 2, "Era de noche. Ana abrió la puerta y vio que alguien había entrado.",
   "Era noite. Ana abriu a porta e viu que alguém tinha entrado.",
   ["Era de noite. Ana abriu a porta e viu que alguém tinha entrado",
    "Era noite. Ana abriu a porta e viu que alguém havia entrado",
    "Era de noite. Ana abriu a porta e viu que alguém havia entrado",
    "Era noite. Ana abriu a porta e viu que alguém entrara",
    "Era de noite. Ana abriu a porta e viu que alguém entrara"],
   "Imperfeito para el fondo (era), perfeito para lo que avanza (abriu, viu) y mais-que-perfeito para lo anterior.")

fx(W, 0, "Se eu tivera mais tempo, estudaria em Coimbra.", "tivera", "tivesse", "subjuntivo",
   "tivera es indicativo (había tenido). La hipótesis pide imperfeito do subjuntivo: se eu tivesse.")
fx(W, 0, "Nós já fizeramos a reserva quando o voo foi cancelado.", "fizeramos", "fizéramos", "ortografia",
   "La 1.ª plural lleva tilde: fizéramos (es esdrújula).")
fx(W, 2, "Tomara que você vem ao ensaio da Mangueira.", "vem", "venha", "subjuntivo",
   "tomara que pide subjuntivo: tomara que você venha.")
fx(W, 1, "Quando cheguei, o filme já tem começado.", "tem começado", "tinha começado", "tempo",
   "Para lo anterior a otro pasado: tinha começado. tem começado sería una acción repetida hasta hoy.")

gd(W, 0, [["fizeram", "fizera"], ["disseram", "dissera"], ["tiveram", "tivera"]],
   "estiveram → (nós) ___", "estivéramos", "estiveramos",
   "La 1.ª plural del mais-que-perfeito es esdrújula y lleva tilde: estivéramos, fizéramos, disséramos.")
gd(W, 0, [["falaram", "falara"], ["comeram", "comera"], ["partiram", "partira"]],
   "puseram → ___", "pusera", "pusiera",
   "La raíz sale del perfeito portugués: puseram → pusera. «Pusiera» es el subjuntivo español.")
gd(W, 0, [["quiseram", "quisera"], ["souberam", "soubera"], ["trouxeram", "trouxera"]],
   "foram → ___", "fora", "fuera",
   "foram → fora (había sido / había ido). «Fuera» es español; en portugués fora también significa «afuera».")

sc(W, 1, ["Quando cheguei, ele já saíra.", "Quando cheguei, ele já tinha saído.",
          "Ela já almoçara quando ligamos.", "Ela já tinha almoçado quando ligamos.",
          "O navio partira de madrugada.", "O navio tinha partido de madrugada."],
   "¿Qué relación hay entre «saíra» y «tinha saído»?",
   ["Significan lo mismo; «saíra» es más literario.",
    "«Saíra» es subjuntivo y «tinha saído», indicativo.",
    "«Saíra» es más reciente que «tinha saído»."],
   "Significan lo mismo; «saíra» es más literario.",
   "Los dos son pluscuamperfecto de indicativo: la forma simple se lee, la compuesta se dice.")
sc(W, 2, ["Era uma noite quente.", "Joana abriu a janela.", "Ninguém dormira ali havia anos.",
          "A rua estava vazia.", "Ela saiu de casa.", "Esquecera as chaves."],
   "¿Qué tiempo usa el relato para lo que ocurrió ANTES de la acción principal?",
   ["El mais-que-perfeito (dormira, esquecera).",
    "El imperfeito (era, estava).",
    "El perfeito (abriu, saiu)."],
   "El mais-que-perfeito (dormira, esquecera).",
   "En un relato, el perfeito hace avanzar la acción, el imperfeito pinta el fondo y el mais-que-perfeito (*dormira, esquecera*) salta hacia atrás.")

ty(W, 0, "Escribí el mais-que-perfeito simples (3.ª persona singular).", "ver → ele ___", "vira",
   "viram → vira (había visto). Ojo: vira también es «da vuelta», de virar.")
ty(W, 0, "Escribí el mais-que-perfeito simples (1.ª persona plural).", "ser → nós ___", "fôramos",
   "foram → fôramos, con circunflejo en la 1.ª plural.")

cb(W, 1, "Pombal reconstruiu a Baixa. O terremoto de 1755 tinha destruído a Baixa. (que)",
   "Pombal reconstruiu a Baixa que o terremoto de 1755 tinha destruído.",
   ["Pombal reconstruiu a Baixa que o terremoto de 1755 destruíra",
    "Pombal reconstruiu a Baixa que o terremoto de 1755 havia destruído"],
   "El relativo retoma la Baixa; el mais-que-perfeito marca que la destrucción fue anterior a la reconstrucción.")
cb(W, 2, "Cheguei à estação. O trem já tinha partido. (quando)",
   "Quando cheguei à estação, o trem já tinha partido.",
   ["O trem já tinha partido quando cheguei à estação",
    "Quando eu cheguei à estação, o trem já tinha partido",
    "Quando cheguei à estação, o trem já partira",
    "Quando cheguei à estação, o trem já havia partido"],
   "quando + perfeito para el momento; el mais-que-perfeito para lo que ya había pasado.")
cb(W, 2, "Cabral chegou à Bahia em 1500. Os tupiniquins já viviam lá havia séculos. (quando)",
   "Quando Cabral chegou à Bahia em 1500, os tupiniquins já viviam lá havia séculos.",
   ["Os tupiniquins já viviam lá havia séculos quando Cabral chegou à Bahia em 1500",
    "Quando Cabral chegou à Bahia, em 1500, os tupiniquins já viviam lá havia séculos"],
   "havia séculos = hacía siglos: en un relato en pasado, haver va en imperfeito. La flota de Cabral llegó a la actual Porto Seguro.")


# ===========================================================================
# Semana 42 — Orações reduzidas
# parts: 0 gerundio, ao + infinitivo, infinitivo pessoal · 1 participio y
# concordancia · 2 desarmar y armar, crónica
# ===========================================================================
W = 42
ch(W, 0, "___ ao Arpoador, vimos o pôr do sol.",
   ["Chegando", "Chegado", "Chegar"], "Chegando",
   "Gerundio con valor temporal: chegando = cuando llegamos.")
ch(W, 0, "___ Os Lusíadas, a gente entende a obsessão portuguesa pelo mar.",
   ["Lendo", "Leyendo", "Lido"], "Lendo",
   "ler → lendo, sin la y del español. Os Lusíadas (1572), de Camões, cantan el viaje de Vasco da Gama.")
ch(W, 0, "___ o livro na mesa, ele saiu sem dizer nada.",
   ["Pondo", "Poniendo", "Pôndo"], "Pondo",
   "pôr → pondo, sin tilde y sin la -ni- del español.")
ch(W, 0, "Ao ___ ao Rio, em 1808, D. João criou o Jardim Botânico.",
   ["chegar", "chegando", "chegado"], "chegar",
   "ao + infinitivo = al + infinitivo. El Jardim Botânico se fundó en 1808, el año de la llegada de la corte.")
ch(W, 0, "Depois de ___ do show, eles foram ao Bar Luiz.",
   ["saírem", "saíram", "saiam"], "saírem",
   "Tras preposición va infinitivo; con sujeto plural, el infinitivo pessoal: depois de saírem.")
ch(W, 0, "Por ___ ricos em ouro, os rios de Minas atraíram milhares de pessoas no século XVIII.",
   ["serem", "eram", "sejam"], "serem",
   "por + infinitivo pessoal = causa: por serem ricos. El ciclo del oro de Minas Gerais fue en el siglo XVIII.")
ch(W, 1, "___ a Lei Áurea, milhares de libertos ficaram sem terra nem trabalho.",
   ["Assinada", "Assinado", "Assinando"], "Assinada",
   "El participio concuerda con a Lei Áurea (femenino): assinada. La abolición de 1888 no previó ninguna reparación.")
ch(W, 1, "___ as contas, vimos que a viagem era cara.",
   ["Feitas", "Feito", "Fazidas"], "Feitas",
   "fazer → feito, y concuerda con as contas: feitas.")
ch(W, 1, "___ o boleto, a matrícula é confirmada.",
   ["Pago", "Pagado", "Pagada"], "Pago",
   "Con ser/estar y en la reducida se usa el participio corto: pago.")
ch(W, 1, "___ as inscrições, a fila chegou à esquina.",
   ["Abertas", "Aberto", "Abrindo"], "Abertas",
   "abrir → aberto, concordado con as inscrições: abertas.")
ch(W, 2, "Apesar de ___ caro, o bondinho do Pão de Açúcar vale a pena.",
   ["ser", "seja", "é"], "ser",
   "apesar de + infinitivo; embora + subjuntivo. Nunca «apesar de é».")
ch(W, 2, "Encerrado o carnaval, a cidade volta à rotina. = ___, a cidade volta à rotina.",
   ["Quando o carnaval termina", "Enquanto o carnaval termina", "Para que o carnaval termine"],
   "Quando o carnaval termina",
   "La reducida de participio expresa algo ya cumplido: quando / depois que termina.",
   prompt="Elegí la versión desarrollada.")

cl(W, 0, "___ (sair) cedo, você pega a praia vazia.", "Saindo",
   "Gerundio con valor condicional: saindo cedo = si salís temprano.")
cl(W, 0, "___ (estar) cansada, ela dormiu no ônibus.", "Estando",
   "Gerundio causal: estando cansada = como estaba cansada.", alt=["Por estar"])
cl(W, 0, "Ao ___ (ver) o Maracanã lotado, o jogador se emocionou.", "ver",
   "ao + infinitivo: ao ver = al ver.")
cl(W, 0, "Ao ___ (chegar, nós) a Salvador, fomos ao Pelourinho.", "chegarmos",
   "Infinitivo pessoal: ao chegarmos marca el sujeto nós.")
cl(W, 0, "Depois de ___ (ler, eles) Vidas Secas, discutiram a seca no Nordeste.", "lerem",
   "ler → lerem (infinitivo pessoal). Vidas Secas (1938), de Graciliano Ramos.")
cl(W, 0, "Por ___ (ser, eles) estrangeiros, pagaram mais caro.", "serem",
   "*Por* + infinitivo pessoal da la causa: *por serem estrangeiros* «por ser extranjeros, porque eran». El infinitivo concuerda con *eles*.")
cl(W, 1, "___ (fazer) as malas, partimos para Paraty.", "Feitas",
   "Participio concordado con as malas: feitas.")
cl(W, 1, "___ (resolver) o problema, a obra recomeçou.", "Resolvido",
   "Participio concordado con o problema: resolvido.")
cl(W, 1, "___ (proclamar) a Independência, em 1822, D. Pedro virou imperador.", "Proclamada",
   "Participio concordado con a Independência: proclamada.")
cl(W, 1, "___ (entregar) as chaves, o inquilino foi embora.", "Entregues",
   "entregar tiene participio corto entregue; en plural, entregues.")
cl(W, 2, "Embora ___ (ser) longo, Grande Sertão: Veredas é fascinante.", "seja",
   "embora + subjuntivo. Su versión reducida sería apesar de ser longo.")
cl(W, 2, "Apesar de ___ (viver) na favela do Canindé, Carolina Maria de Jesus escrevia todos os dias.", "viver",
   "apesar de + infinitivo. Su diario se publicó en 1960 como Quarto de Despejo.")

tr(W, 0, "Al llegar a casa, llamé a mi madre.",
   "Ao chegar em casa, liguei para minha mãe.",
   ["Ao chegar a casa, liguei para minha mãe", "Ao chegar em casa, liguei para a minha mãe",
    "Ao chegar a casa, liguei para a minha mãe", "Chegando em casa, liguei para minha mãe",
    "Chegando em casa, liguei para a minha mãe", "Ao chegar em casa, liguei pra minha mãe"],
   "«Al llegar» es *ao chegar*. Y «llamar a alguien» por teléfono se dice *ligar para alguém*.")
tr(W, 0, "Antes de salir, cerrá la ventana.", "Antes de sair, feche a janela.",
   ["Antes de sair, fecha a janela"],
   "antes de + infinitivo, como en español.")
tr(W, 0, "Al llegar nosotros, la fiesta ya había terminado.",
   "Ao chegarmos, a festa já tinha terminado.",
   ["Ao chegarmos, a festa já havia terminado", "Ao chegarmos, a festa já terminara",
    "Ao chegarmos, a festa já tinha acabado", "Ao chegarmos, a festa já havia acabado",
    "Quando chegamos, a festa já tinha terminado", "Quando chegamos, a festa já tinha acabado"],
   "«Al llegar nosotros» = ao chegarmos: el infinitivo pessoal marca el sujeto.")
tr(W, 0, "Después de leer a Paulo Freire, cambié mi manera de enseñar.",
   "Depois de ler Paulo Freire, mudei minha maneira de ensinar.",
   ["Depois de ler Paulo Freire, mudei a minha maneira de ensinar",
    "Depois de ler Paulo Freire, mudei meu jeito de ensinar",
    "Depois de ler Paulo Freire, mudei o meu jeito de ensinar",
    "Depois de ler Paulo Freire, mudei minha forma de ensinar",
    "Depois de ler Paulo Freire, mudei a minha forma de ensinar",
    "Após ler Paulo Freire, mudei minha maneira de ensinar"],
   "Sin «a» ante el autor: ler Paulo Freire, el de Pedagogia do Oprimido.")
tr(W, 1, "Terminada la reunión, fuimos a la playa.",
   "Terminada a reunião, fomos à praia.",
   ["Terminada a reunião, fomos para a praia", "Acabada a reunião, fomos à praia",
    "Encerrada a reunião, fomos à praia", "Acabada a reunião, fomos para a praia"],
   "Participio concordado con a reunião; ir a + a praia = à praia.")
tr(W, 1, "Hechas las cuentas, sobró poco dinero.",
   "Feitas as contas, sobrou pouco dinheiro.", [],
   "fazer → feito → feitas (concuerda con as contas).")
tr(W, 2, "Aunque es caro, el teleférico vale la pena.",
   "Embora seja caro, o bondinho vale a pena.",
   ["Apesar de ser caro, o bondinho vale a pena", "Embora seja caro, o teleférico vale a pena",
    "Apesar de ser caro, o teleférico vale a pena"],
   "*Embora* («aunque») pide subjuntivo: *embora seja caro*. También se puede reducir: *apesar de ser caro*.")
tr(W, 2, "Derrotado en 1578, el rey Sebastián nunca volvió.",
   "Derrotado em 1578, o rei D. Sebastião nunca voltou.",
   ["Derrotado em 1578, o rei Sebastião nunca voltou", "Derrotado em 1578, D. Sebastião nunca voltou",
    "Derrotado em 1578, dom Sebastião nunca voltou", "Derrotado em 1578, o rei dom Sebastião nunca voltou"],
   "Reducida de participio. De su desaparición en Alcácer-Quibir nació el sebastianismo.")

fx(W, 0, "Poniendo o celular no bolso, ele saiu.", "Poniendo", "Pondo", "espanol",
   "pôr → pondo. «Poniendo» es el gerundio español.")
fx(W, 0, "Al sair do metrô, vi o Theatro Municipal.", "Al", "Ao", "contraccion",
   "«Al» = ao (a + o): ao sair.")
fx(W, 1, "Feito as contas, decidimos ficar em casa.", "Feito", "Feitas", "concordancia",
   "El participio de la reducida concuerda con su sujeto: feitas as contas.")
fx(W, 1, "Pagado o boleto, a matrícula foi confirmada.", "Pagado", "Pago", "participio",
   "En la reducida y con ser/estar va el participio corto: pago o boleto.")

gd(W, 0, [["falar", "falando"], ["comer", "comendo"], ["partir", "partindo"]],
   "pedir → ___", "pedindo", "pidindo",
   "pedir hace pedindo: el gerúndio sale del infinitivo, sin el cambio e → i del español «pidiendo».")
gd(W, 0, [["olhar", "olhando"], ["correr", "correndo"], ["abrir", "abrindo"]],
   "dormir → ___", "dormindo", "durmindo",
   "dormir → dormindo, regular. El español cambia la vocal («durmiendo»); el portugués no.")
gd(W, 1, [["terminar a reunião", "terminada a reunião"], ["fechar o bar", "fechado o bar"],
          ["resolver as questões", "resolvidas as questões"]],
   "fazer as contas → ___", "feitas as contas", "fazidas as contas",
   "fazer tiene participio irregular: feito, y concuerda: feitas as contas.")

sc(W, 1, ["Terminada a reunião, saímos.", "Terminado o jogo, saímos.", "Terminadas as aulas, saímos.",
          "Terminados os exames, saímos.", "Feita a reserva, viajamos.", "Feitos os planos, viajamos."],
   "¿Con qué concuerda el participio?",
   ["Con el sustantivo que lo sigue.",
    "Con el sujeto de la oración principal (nós).",
    "Con nada: queda siempre en -o."],
   "Con el sustantivo que lo sigue.",
   "En la reducida, el sustantivo que sigue es el sujeto del participio: terminadas as aulas.")
sc(W, 0, ["Ao chegar, liguei.", "Ao chegarmos, ligamos.", "Ao chegarem, ligaram.",
          "Antes de sair, fechei a porta.", "Antes de saírem, fecharam a porta.",
          "Para chegarmos cedo, saímos às seis."],
   "¿Cuándo se agrega -mos o -em al infinitivo?",
   ["Cuando hay que marcar el sujeto (nós, eles), sobre todo si es plural o distinto.",
    "Solo después de «ao».",
    "Nunca en la escritura formal."],
   "Cuando hay que marcar el sujeto (nós, eles), sobre todo si es plural o distinto.",
   "El infinitivo pessoal marca quién hace la acción; es muy frecuente en la escritura formal.")

ty(W, 0, "Escribí el gerundio.", "ler → ___", "lendo",
   "ler → lendo, sin y.")
ty(W, 1, "Escribí el participio corto, concordado.", "___ (aceitar) as condições, assinamos o contrato.", "Aceitas",
   "aceitar tiene participio corto aceito; con as condições, aceitas.")

cb(W, 0, "Cheguei em casa. Liguei para você. (ao + infinitivo)",
   "Ao chegar em casa, liguei para você.",
   ["Ao chegar a casa, liguei para você", "Liguei para você ao chegar em casa"],
   "ao + infinitivo reemplaza a quando + verbo conjugado.")
cb(W, 1, "A reunião terminou. Fomos ao boteco. (participio)",
   "Terminada a reunião, fomos ao boteco.",
   ["Acabada a reunião, fomos ao boteco", "Encerrada a reunião, fomos ao boteco"],
   "Participio concordado + sujeto al principio: terminada a reunião.")
cb(W, 2, "O bondinho é caro. Vale a pena. (apesar de + infinitivo)",
   "Apesar de ser caro, o bondinho vale a pena.",
   ["O bondinho vale a pena, apesar de ser caro"],
   "apesar de + infinitivo es la versión reducida de embora + subjuntivo.")


# ===========================================================================
# Semana 43 — Correspondência formal
# parts: 0 abrir y cerrar · 1 tratamiento y fórmulas · 2 pedir, crase
# ===========================================================================
W = 43
ch(W, 0, "___ Senhora Diretora,",
   ["Prezada", "Prezado", "Querida"], "Prezada",
   "Apertura formal: Prezado(a), concordado con el destinatario. Querida es solo para gente cercana.")
ch(W, 0, "Cierre de un mail al consulado: «___, Lucas Fernández».",
   ["Atenciosamente", "Um grande beijo", "Saudos cordiais"], "Atenciosamente",
   "El cierre formal estándar en Brasil es Atenciosamente. «Um grande beijo» es para gente cercana y «saudos» no existe. «Atentamente» también existe, pero es mucho menos frecuente y suena a traducción.")
ch(W, 0, "Mail a un grupo de profesores: «___ professores,»",
   ["Prezados", "Prezado", "Prezada"], "Prezados",
   "A un grupo, en plural: Prezados professores, Prezados(as).")
ch(W, 0, "A Carta de Pero Vaz de Caminha, de 1500, é dirigida ___ rei D. Manuel.",
   ["ao", "o", "à"], "ao",
   "*Dirigir-se a* + *o rei* da *ao rei*; con sustantivo masculino no hay *crase*. La carta de Caminha es el primer texto escrito sobre Brasil.")
ch(W, 1, "O senhor ___ confirmar a reserva?",
   ["poderia", "poderias", "poderíeis"], "poderia",
   "o senhor / a senhora van con verbo en 3.ª persona: poderia.")
ch(W, 1, "Vossa Senhoria ___ os documentos até sexta.",
   ["deve enviar", "deveis enviar", "deves enviar"], "deve enviar",
   "Aunque diga Vossa, el verbo va en 3.ª: Vossa Senhoria deve.")
ch(W, 1, "Informamos que Vossa Senhoria receberá ___ certificado pelo correio.",
   ["seu", "vosso", "teu"], "seu",
   "Con los tratamientos, el posesivo es de 3.ª persona: seu, sua.")
ch(W, 1, "___ em anexo os comprovantes de pagamento.",
   ["Seguem", "Segue", "Sigue"], "Seguem",
   "seguir concuerda con lo adjuntado (os comprovantes): seguem.")
ch(W, 1, "Fico no ___ de sua resposta.",
   ["aguardo", "espero", "aguardamento"], "aguardo",
   "Fórmula fija: fico no aguardo = quedo a la espera.")
ch(W, 2, "Agradeceria se o senhor ___ o prazo.",
   ["prorrogasse", "prorrogue", "prorrogar"], "prorrogasse",
   "agradeceria se + imperfeito do subjuntivo: prorrogasse.")
ch(W, 2, "Fico ___ disposição para qualquer esclarecimento.",
   ["à", "a", "na"], "à",
   "à disposição lleva crase siempre.")
ch(W, 2, "Solicito ___ Vossa Excelência a revisão do processo.",
   ["a", "à", "ao"], "a",
   "Los pronombres de tratamiento no llevan artículo, así que no hay crase: a Vossa Excelência.")

cl(W, 0, "___ Senhor Coordenador, (apertura formal)", "Prezado",
   "Prezado + tratamiento, concordado en masculino.")
cl(W, 0, "Desde já, ___ (agradecer, eu) a atenção.", "agradeço",
   "agradecer → agradeço (c → ç ante o). Fórmula de cierre muy usada.")
cl(W, 1, "Venho, por meio ___, solicitar uma declaração de matrícula.", "desta",
   "*Venho, por meio desta* es la fórmula de apertura de una carta formal: «por la presente». *Desta* es *de + esta* (carta).")
cl(W, 1, "Conforme ___ (combinar), envio o contrato assinado.", "combinado",
   "*Conforme combinado* es «según lo acordado»: *combinar* es «acordar, quedar en algo» y el participio va solo, sin artículo.")
cl(W, 1, "Segue ___ anexo o currículo.", "em",
   "segue em anexo: anexo queda invariable tras em.")
cl(W, 1, "Seguem ___ (anexo) as fotos do evento.", "anexas",
   "Sin em, anexo es adjetivo y concuerda: seguem anexas as fotos.")
cl(W, 1, "A senhora poderia me ___ (enviar) o formulário?", "enviar",
   "poderia + infinitivo: el pedido cortés más frecuente.")
cl(W, 2, "Agradeceria se a senhora ___ (poder) me atender na quarta.", "pudesse",
   "poder → pudesse (imperfeito do subjuntivo), tras agradeceria se.")
cl(W, 2, "Gostaria ___ solicitar a segunda via do diploma.", "de",
   "gostaria de + infinitivo, siempre con de.")
cl(W, 2, "Em relação ___ sua solicitação, informo que foi deferida.", "à",
   "*Em relação a* + *a sua solicitação* lleva *crase*: *em relação à sua solicitação*. Delante del posesivo femenino, la *crase* es habitual.")
cl(W, 2, "Encaminho o pedido ___ setor de matrículas.", "ao",
   "encaminhar algo a alguém: a + o setor = ao setor.")
cl(W, 2, "Informo ___ V. Sa. que o prazo foi prorrogado.", "a",
   "Ante V. Sa. no hay artículo, así que no hay crase: informo a V. Sa.")

tr(W, 0, "Estimada señora Souza:", "Prezada Senhora Souza,",
   ["Prezada Sra. Souza", "Prezada senhora Souza"],
   "«Estimado/a» = Prezado/a; en portugués se suele cerrar el saludo con coma.")
tr(W, 0, "Quedo a la espera de su respuesta. Atentamente,",
   "Fico no aguardo de sua resposta. Atenciosamente,",
   ["Fico no aguardo da sua resposta. Atenciosamente", "Aguardo sua resposta. Atenciosamente",
    "Fico aguardando sua resposta. Atenciosamente", "Fico à espera de sua resposta. Atenciosamente",
    "Aguardo a sua resposta. Atenciosamente"],
   "Dos fórmulas fijas del mail formal: fico no aguardo y Atenciosamente.")
tr(W, 1, "Adjunto el certificado médico.", "Segue em anexo o atestado médico.",
   ["Segue anexo o atestado médico", "Envio em anexo o atestado médico",
    "Segue o atestado médico em anexo", "Encaminho em anexo o atestado médico"],
   "«Adjunto» se dice con segue em anexo; el certificado médico es o atestado.")
tr(W, 1, "Adjunto los documentos solicitados.", "Seguem em anexo os documentos solicitados.",
   ["Seguem anexos os documentos solicitados", "Envio em anexo os documentos solicitados",
    "Seguem os documentos solicitados em anexo", "Encaminho em anexo os documentos solicitados"],
   "Con plural, seguem: el verbo concuerda con os documentos.")
tr(W, 1, "¿Usted podría confirmar el horario? (a un señor)", "O senhor poderia confirmar o horário?",
   ["O Sr. poderia confirmar o horário"],
   "«Usted» se dice *o senhor / a senhora*, con el verbo en 3.ª persona: *o senhor poderia*. Con *você* sería trato de igual a igual.")
tr(W, 2, "Quisiera solicitar una prórroga del plazo.",
   "Gostaria de solicitar uma prorrogação do prazo.",
   ["Gostaria de solicitar a prorrogação do prazo", "Eu gostaria de solicitar uma prorrogação do prazo",
    "Eu gostaria de solicitar a prorrogação do prazo"],
   "Para pedir con cortesía se usa *gostaria de* (futuro do pretérito), no un subjuntivo como «quisiera». «Prórroga» es *prorrogação*.")
tr(W, 2, "Le agradecería si pudiera responder hasta el viernes.",
   "Agradeceria se pudesse responder até sexta.",
   ["Agradeceria se o senhor pudesse responder até sexta", "Agradeceria se a senhora pudesse responder até sexta",
    "Agradeceria se pudesse responder até sexta-feira", "Eu agradeceria se pudesse responder até sexta",
    "Agradeceria se o senhor pudesse responder até sexta-feira",
    "Agradeceria se a senhora pudesse responder até sexta-feira"],
   "agradeceria se + imperfeito do subjuntivo: pudesse.")
tr(W, 2, "Quedo a disposición para cualquier aclaración.",
   "Fico à disposição para qualquer esclarecimento.",
   ["Estou à disposição para qualquer esclarecimento", "Fico à disposição para quaisquer esclarecimentos",
    "Permaneço à disposição para qualquer esclarecimento", "Fico à disposição para qualquer dúvida"],
   "à disposição, con crase; «aclaración» = esclarecimento.")

fx(W, 1, "Segue em anexo os documentos pedidos.", "Segue", "Seguem", "concordancia",
   "El verbo concuerda con os documentos: seguem em anexo.")
fx(W, 1, "Vossa Senhoria deveis assinar o requerimento.", "deveis", "deve", "persona",
   "Vossa Senhoria lleva verbo en 3.ª persona: deve.")
fx(W, 2, "Fico a disposição para qualquer dúvida.", "a disposição", "à disposição", "crase",
   "à disposição: preposición a + artículo a.")
fx(W, 0, "Saudos cordiais, Martín", "Saudos cordiais", "Atenciosamente", "espanol",
   "«Saludos cordiales» no se calca: en un mail formal, Atenciosamente o Cordialmente.",
   goodAlt=["Cordialmente"], alt=["Cordialmente, Martín"])

gd(W, 2, [["poder", "poderia"], ["gostar", "gostaria"], ["agradecer", "agradeceria"]],
   "desfazer → ___", "desfaria", "desfazeria",
   "desfazer se conjuga como fazer: desfaria (como faria). El patrón regular engaña.")
gd(W, 2, [["solicitar", "solicitaria"], ["enviar", "enviaria"], ["precisar", "precisaria"]],
   "refazer → ___", "refaria", "refazeria",
   "refazer se conjuga como fazer: refaria (como faria), sin la -ze-.")
gd(W, 2, [["poder", "se pudesse"], ["enviar", "se enviasse"], ["responder", "se respondesse"]],
   "vir → ___", "se viesse", "se vinesse",
   "El imperfeito do subjuntivo sale del perfeito vieram: viesse.")

sc(W, 1, ["O senhor pode entrar.", "A senhora quer um café?", "Vossa Senhoria deve assinar aqui.",
          "Vossa Excelência está convidado.", "O senhor esqueceu seu guarda-chuva.",
          "V. Sa. receberá sua resposta."],
   "¿En qué persona va el verbo con los tratamientos?",
   ["En tercera persona, y el posesivo es «seu».",
    "En segunda del plural, como con «vós».",
    "En tercera con «o senhor» y en segunda con «Vossa»."],
   "En tercera persona, y el posesivo es «seu».",
   "Todos los tratamientos (o senhor, V. Sa., V. Exa.) van con verbo y posesivo de 3.ª persona.")
sc(W, 2, ["Informo à senhora que...", "Envio à diretora o relatório.", "Informo a V. Sa. que...",
          "Solicito a Vossa Excelência...", "Peço a você que...", "Encaminho ao senhor o contrato."],
   "¿Por qué «à senhora» lleva crase y «a V. Sa.» no?",
   ["«A senhora» lleva artículo; los tratamientos como V. Sa. no.",
    "Porque V. Sa. es masculino.",
    "La crase es opcional ante tratamientos."],
   "«A senhora» lleva artículo; los tratamientos como V. Sa. no.",
   "Crase = preposición a + artículo a. Vossa Senhoria, Vossa Excelência y você no admiten artículo.")

ty(W, 0, "Escribí el cierre formal estándar de un mail en Brasil.", "___, (firma)", "Atenciosamente",
   "Atenciosamente es el cierre formal por defecto.", alt=["Cordialmente"])
ty(W, 1, "Escribí la abreviatura de «Vossa Senhoria».", "___", "V. Sa.",
   "V. Sa. (también V. S.ª). Va con verbo en 3.ª persona.", alt=["V.Sa.", "V. S.ª", "V. Sª"])

cb(W, 1, "Envio o currículo. O currículo está em anexo. (segue em anexo)",
   "Segue em anexo o currículo.",
   ["Segue o currículo em anexo", "Segue anexo o currículo"],
   "segue em anexo resume las dos frases en una fórmula.")
cb(W, 2, "O senhor pode responder até sexta. Eu agradeceria. (agradeceria se)",
   "Agradeceria se o senhor pudesse responder até sexta.",
   ["Eu agradeceria se o senhor pudesse responder até sexta",
    "Agradeceria se o senhor pudesse responder até sexta-feira"],
   "agradeceria se + imperfeito do subjuntivo: pode → pudesse.")
cb(W, 2, "Recebi sua solicitação. Informo que ela foi deferida. (em relação à)",
   "Em relação à sua solicitação, informo que foi deferida.",
   ["Em relação à sua solicitação, informo que ela foi deferida",
    "Informo, em relação à sua solicitação, que foi deferida"],
   "em relação à + sustantivo femenino, con crase. deferir = aprobar un pedido.")


# ===========================================================================
# Semana 44 — Formação de palavras
# parts: 0 sufijos que hacen sustantivos · 1 -eiro, -ada, prefijos ·
# 2 diminutivos y aumentativos · 3 formá la palabra (producir)
# ===========================================================================
W = 44
ch(W, 0, "A ___ do Rio impressionou Stefan Zweig, que escreveu «Brasil, país do futuro».",
   ["beleza", "belidade", "belice"], "beleza",
   "belo → a beleza (-eza). Zweig publicó ese libro en 1941 y vivió sus últimos meses en Petrópolis.")
ch(W, 0, "Que ___ esse discurso de duas horas!",
   ["chatice", "chateza", "chatidade"], "chatice",
   "chato → a chatice: -ice es el sufijo típico para lo molesto o lo tonto (burrice, criancice).")
ch(W, 0, "Para Sérgio Buarque, a ___ é um traço do brasileiro.",
   ["cordialidade", "cordialeza", "cordialice"], "cordialidade",
   "El sufijo *-dade* corresponde a nuestro «-dad»: *cordial* da *a cordialidade*. En Raízes do Brasil, «cordial» viene de *cor*, corazón.")
ch(W, 0, "A ___ de uma língua estrangeira exige paciência.",
   ["aprendizagem", "aprendizaje", "aprendimento"], "aprendizagem",
   "-aje → -agem, y femenino: a aprendizagem.")
ch(W, 0, "O ___ é a crença na volta de D. Sebastião.",
   ["sebastianismo", "sebastianidade", "sebastianice"], "sebastianismo",
   "-ismo forma doctrinas y movimientos: sebastianismo, modernismo, coronelismo.")
ch(W, 1, "O pneu furou; procure um ___ na estrada.",
   ["borracheiro", "gomero", "borrachista"], "borracheiro",
   "borracha (caucho) → borracheiro, el gomero: -eiro nombra oficios.")
ch(W, 1, "Na esquina, o ___ vende pão quentinho às seis da manhã.",
   ["padeiro", "panadeiro", "pãozeiro"], "padeiro",
   "pão → padeiro (del latín panis → pad-).")
ch(W, 1, "Dá uma ___ nesse poema de Drummond.",
   ["olhada", "olhação", "olhamento"], "olhada",
   "dar uma olhada = echar un vistazo: -ada forma gestos y golpes.")
ch(W, 1, "Estou fazendo ___ em História na UFF.",
   ["pós-graduação", "posgraduação", "pósgraduação"], "pós-graduação",
   "pós- tónico va con tilde y guion: pós-graduação.")
ch(W, 1, "O editor pediu para eu ___ o texto inteiro.",
   ["refazer", "rehacer", "re-fazer"], "refazer",
   "re- se pega sin guion: refazer, reler, reabrir.")
ch(W, 2, "Vamos tomar um ___ na padaria?",
   ["cafezinho", "cafeinho", "cafecito"], "cafezinho",
   "Tras vocal tónica (café) va -zinho: cafezinho.")
ch(W, 2, "De manhã comprei seis ___ na padaria.",
   ["pãezinhos", "pãozinhos", "pãoezinhos"], "pãezinhos",
   "En la norma, el plural del diminutivo pluraliza la base: pães → pãezinhos. En el habla se oye «pãozinhos».",
   prompt="Elegí la forma de la norma culta.")

cl(W, 0, "A ___ (triste) do fado é famosa no mundo todo.", "tristeza",
   "triste → a tristeza (-eza). El fado es patrimonio inmaterial de la UNESCO desde 2011.")
cl(W, 0, "Na ___ (velho), Oscar Niemeyer continuou projetando.", "velhice",
   "El sufijo *-ice* forma sustantivos de cualidad o etapa: *velho* da *a velhice* «la vejez». Niemeyer trabajó hasta pasados los cien años.")
cl(W, 0, "A ___ (votar) da nova Constituição terminou em 1988.", "votação",
   "votar → a votação (-ção).")
cl(W, 0, "O ___ (casar) foi na Igreja da Candelária.", "casamento",
   "casar → o casamento (-mento, masculino).")
cl(W, 0, "A ___ (igual) racial ainda é um desafio no Brasil.", "igualdade",
   "El sufijo *-dade* corresponde a «-dad»: *igual* da *a igualdade*. Estos sustantivos son todos femeninos.")
cl(W, 1, "O ___ (carta) passa todo dia às dez.", "carteiro",
   "carta → o carteiro, oficio en -eiro.")
cl(W, 1, "Plantamos uma ___ (laranja) no quintal.", "laranjeira",
   "laranja → a laranjeira (el naranjo): los frutales en -eira.")
cl(W, 1, "A ___ (garoto) lotou a praia no feriado.", "garotada",
   "garoto → a garotada: -ada forma colectivos.")
cl(W, 2, "Espera um ___ (minuto), já volto.", "minutinho",
   "minuto termina en -o átona: minutinho. Es cortesía, no tamaño.")
cl(W, 2, "Que ___ (gol) do Zico!", "golaço",
   "gol → golaço: -aço intensifica.")
cl(W, 2, "Eles moram num ___ (casa, aumentativo) em Santa Teresa.", "casarão",
   "casa → o casarão: el aumentativo pasa a masculino.")
cl(W, 2, "Houve ___ (panela, aumentativo) nas janelas de Copacabana.", "panelaço",
   "panela → o panelaço, el cacerolazo.")

tr(W, 0, "La belleza de Lisboa me sorprendió.", "A beleza de Lisboa me surpreendeu.",
   ["A beleza de Lisboa surpreendeu-me"],
   "belo → beleza; «sorprender» = surpreender.")
tr(W, 0, "El aprendizaje de un idioma lleva años.", "A aprendizagem de uma língua leva anos.",
   ["A aprendizagem de um idioma leva anos", "O aprendizado de uma língua leva anos",
    "O aprendizado de um idioma leva anos", "A aprendizagem de uma língua demora anos",
    "O aprendizado de uma língua demora anos", "A aprendizagem de um idioma demora anos",
    "O aprendizado de um idioma demora anos"],
   "a aprendizagem (femenino) u o aprendizado.")
tr(W, 0, "La felicidad es un tema de la bossa nova.", "A felicidade é um tema da bossa nova.",
   ["A felicidade é tema da bossa nova"],
   "-dad → -dade. «A Felicidade» es una canción de Tom Jobim y Vinicius de Moraes.")
tr(W, 1, "El gomero arregló la goma.", "O borracheiro consertou o pneu.",
   ["O borracheiro arrumou o pneu"],
   "o borracheiro (oficio) y o pneu (la goma del auto).")
tr(W, 1, "Echale un vistazo a este libro de Darcy Ribeiro.", "Dá uma olhada neste livro do Darcy Ribeiro.",
   ["Dá uma olhada nesse livro do Darcy Ribeiro", "Dá uma olhada neste livro de Darcy Ribeiro",
    "Dá uma olhada nesse livro de Darcy Ribeiro", "Dê uma olhada neste livro de Darcy Ribeiro",
    "Dê uma olhada nesse livro de Darcy Ribeiro", "Dê uma olhada neste livro do Darcy Ribeiro",
    "Dê uma olhada nesse livro do Darcy Ribeiro"],
   "«Echar un vistazo a» es *dar uma olhada em*: el verbo es *dar* y la preposición *em*, que se contrae: *neste livro*.")
tr(W, 1, "Mi ex novio hace un posgrado en Coimbra.", "Meu ex-namorado faz pós-graduação em Coimbra.",
   ["O meu ex-namorado faz pós-graduação em Coimbra", "Meu ex-namorado está fazendo pós-graduação em Coimbra",
    "Meu ex-namorado faz uma pós-graduação em Coimbra", "O meu ex-namorado faz uma pós-graduação em Coimbra"],
   "ex- y pós- con guion: ex-namorado, pós-graduação.")
tr(W, 2, "¿Vamos a tomar un cafecito?", "Vamos tomar um cafezinho?",
   ["Bora tomar um cafezinho", "Vamos tomar um cafezinho"],
   "cafecito → cafezinho; vamos + infinitivo, sin «a».")
tr(W, 2, "Viven en una casona en Santa Teresa.", "Eles moram num casarão em Santa Teresa.",
   ["Moram num casarão em Santa Teresa", "Eles moram em um casarão em Santa Teresa",
    "Moram em um casarão em Santa Teresa", "Eles vivem num casarão em Santa Teresa",
    "Vivem num casarão em Santa Teresa"],
   "casa → o casarão, masculino.")

fx(W, 0, "A felicidad não se compra.", "felicidad", "felicidade", "espanol",
   "-dad → -dade: felicidade, cidade, verdade.")
fx(W, 0, "O aprendizagem do português leva tempo.", "O aprendizagem", "A aprendizagem", "genero",
   "Los sustantivos en -agem son femeninos: a aprendizagem, a viagem.")
fx(W, 2, "Vamos tomar um cafecito na padaria?", "cafecito", "cafezinho", "espanol",
   "El diminutivo portugués es -inho / -zinho: cafezinho.")
fx(W, 1, "Faço posgraduação na PUC-Rio.", "posgraduação", "pós-graduação", "ortografia",
   "pós- tónico: con tilde y guion.")

gd(W, 2, [["casa", "casinha"], ["gato", "gatinho"], ["festa", "festinha"]],
   "pé → ___", "pezinho", "peinho",
   "Tras vocal tónica va -zinho: pé → pezinho, café → cafezinho.")
gd(W, 2, [["o carrinho", "os carrinhos"], ["a casinha", "as casinhas"], ["o gatinho", "os gatinhos"]],
   "o pãozinho → os ___", "pãezinhos", "pãozinhos",
   "Con -zinho, la norma pluraliza la base: pães → pãezinhos; flores → florezinhas.")
gd(W, 0, [["feliz", "a felicidade"], ["igual", "a igualdade"], ["real", "a realidade"]],
   "velho → ___", "a velhice", "a velhidade",
   "velho no da -dade sino -ice: a velhice (la vejez).")

sc(W, 2, ["casa → casinha", "livro → livrinho", "mesa → mesinha", "café → cafezinho",
          "pão → pãozinho", "flor → florzinha"],
   "¿Cuándo va -zinho en lugar de -inho?",
   ["Tras vocal tónica, nasal o consonante; -inho con -o / -a átonas.",
    "Con palabras masculinas (cafezinho, pãozinho); -inho con femeninas.",
    "Con palabras cortas; -inho con largas."],
   "Tras vocal tónica, nasal o consonante; -inho con -o / -a átonas.",
   "casa → casinha (a átona); café → cafezinho (é tónica); pão → pãozinho (nasal).")
sc(W, 1, ["pão → padeiro", "pedra → pedreiro", "carta → carteiro", "laranja → laranjeira",
          "coco → coqueiro", "cinza → cinzeiro"],
   "¿Qué nombra el sufijo -eiro / -eira?",
   ["Oficios, árboles y recipientes relacionados con la base.",
    "Solo profesiones.",
    "Lugares donde se vende la cosa."],
   "Oficios, árboles y recipientes relacionados con la base.",
   "padeiro (oficio), laranjeira (árbol), cinzeiro (recipiente).")

ty(W, 2, "Escribí el diminutivo.", "agora → ___", "agorinha",
   "El diminutivo también va con adverbios: agorinha, cedinho, pertinho.")
ty(W, 0, "Escribí el sustantivo abstracto.", "belo → a ___", "beleza",
   "belo → a beleza.")

cb(W, 0, "Vargas criou a CLT em 1943. Isso mudou o trabalho no Brasil. (a criação de)",
   "A criação da CLT por Vargas em 1943 mudou o trabalho no Brasil.",
   ["A criação da CLT por Vargas, em 1943, mudou o trabalho no Brasil",
    "Em 1943, a criação da CLT por Vargas mudou o trabalho no Brasil",
    "A criação da CLT, em 1943, por Vargas, mudou o trabalho no Brasil"],
   "Nominalización: criar → a criação. La Consolidação das Leis do Trabalho es de 1943.")
cb(W, 1, "Vou dar uma olhada no mapa. Depois a gente sai. (antes de)",
   "Vou dar uma olhada no mapa antes de a gente sair.",
   ["Antes de a gente sair, vou dar uma olhada no mapa",
    "Vou dar uma olhada no mapa antes da gente sair",
    "Antes da gente sair, vou dar uma olhada no mapa"],
   "antes de + infinitivo con sujeto. La norma no contrae (antes de a gente); el habla, sí (antes da gente).")
cb(W, 2, "Moramos numa casinha. A casinha fica pertinho da praia. (que)",
   "Moramos numa casinha que fica pertinho da praia.",
   ["Moramos em uma casinha que fica pertinho da praia"],
   "El relativo que retoma casinha; pertinho = cerquita.")

# Formá la palabra (parte 3): producir con los sufijos y prefijos de la semana
# (auditoría 3.0, E-portugues §2.4: la 44 como semana de producir).
FP = "Formá la palabra."
cl(W, 3, "A ___ (organizar) do bloco começa em janeiro.", "organização",
   "organizar → a organização: -ar da -ação, femenino y con til. En plural, -ções.", prompt=FP)
cl(W, 3, "O ___ (atender) no posto de saúde foi rápido.", "atendimento",
   "atender → o atendimento: -mento hace sustantivos masculinos de acción; la -e- del verbo pasa a -i-.", prompt=FP)
cl(W, 3, "A ___ (curioso) das crianças não tem fim.", "curiosidade",
   "curioso → a curiosidade: -oso pierde la -o y suma -idade («-dad»).", prompt=FP)
cl(W, 3, "A ___ (limpo) da praia depende de todos.", "limpeza",
   "limpo → a limpeza: -eza forma cualidades de adjetivos (beleza, tristeza, pureza).", prompt=FP)
cl(W, 3, "Preciso de um encanador ___ (confiar) para consertar o chuveiro.", "confiável",
   "confiar → confiável: -ar da -ável, con tilde. «Que se puede» + verbo.", prompt=FP)
cl(W, 3, "O ___ (táxi) conhecia um atalho pela Lagoa.", "taxista",
   "táxi → o taxista: -ista nombra el oficio y sirve para los dos géneros (o / a taxista). La tilde se va.", prompt=FP)
cl(W, 3, "A ___ (dente) mandou eu voltar daqui a seis meses.", "dentista",
   "dente → a dentista: -ista, igual en masculino y femenino; el artículo dice el género.", prompt=FP)
cl(W, 3, "Depois da festa, a sala ficou toda ___ (arrumado, o contrário).", "desarrumada",
   "arrumado → desarrumado: des- da el contrario. Concuerda con a sala: desarrumada.", prompt=FP)
cl(W, 3, "Chegar atrasado todo dia é ___ (aceitável, o contrário).", "inaceitável",
   "aceitável → inaceitável: in- da el contrario; ante vocal queda in- (inútil, inesquecível).", prompt=FP)
cl(W, 3, "A prefeitura promete ___ (abrir de novo) o teatro em dezembro.", "reabrir",
   "abrir → reabrir: re- («de nuevo») se pega sin guion: refazer, reler, reabrir.", prompt=FP)


# ===========================================================================
# Semana 45 — Falsos amigos e heterossemânticos
# parts: 0 clásicos, adjetivos y verbos · 1 mesa y trabajo · 2 género y
# acento
# ===========================================================================
W = 45
ch(W, 0, "O bacalhau estava ___! Parabéns ao cozinheiro.",
   ["delicioso", "esquisito", "exquisito"], "delicioso",
   "esquisito significa raro. «Exquisito» se dice delicioso o gostoso.")
ch(W, 0, "No Mercado do Bolhão, no Porto, comprei ___ para o almoço.",
   ["polvo", "pulpo", "pó"], "polvo",
   "Falso amigo: *polvo* es «pulpo». El polvo del español se dice *pó* o *poeira*.")
ch(W, 0, "Me empresta a ___? Errei uma palavra.",
   ["borracha", "goma", "apagadora"], "borracha",
   "Falso amigo: *borracha* es «goma de borrar». Una mujer borracha es *bêbada*.")
ch(W, 0, "A Avenida Presidente Vargas é muito ___: tem várias pistas.",
   ["larga", "comprida", "ancha"], "larga",
   "Falso amigo: *largo* es «ancho». Para la longitud («largo») se dice *comprido*.")
ch(W, 0, "Ela é ___: tem o cabelo cor de fogo.",
   ["ruiva", "roxa", "rubia"], "ruiva",
   "ruivo = pelirrojo. roxo = violeta; «rubia» se dice loira.")
ch(W, 0, "Você ___ que ele cortou o cabelo?",
   ["reparou", "consertou", "arrumou"], "reparou",
   "Falso amigo: *reparar (em)* es «notar, fijarse». Arreglar algo roto se dice *consertar*.")
ch(W, 0, "Na porta do boteco está escrito «___»: é para empurrar.",
   ["Empurre", "Puxe", "Empuxe"], "Empurre",
   "Falso amigo de las puertas: *empurrar* es «empujar» y *puxar* es «tirar hacia vos». En la puerta: *Empurre / Puxe*.")
ch(W, 1, "Garçom, me traz um ___ d'água, por favor.",
   ["copo", "vaso", "taça"], "copo",
   "Falso amigo: para beber se pide un *copo*. *Vaso* es maceta o inodoro, y *taça* es copa.")
ch(W, 1, "Deixei o carro na ___ para trocar o óleo.",
   ["oficina", "escritório", "ofício"], "oficina",
   "Falso amigo: *oficina* es el «taller» mecánico. La oficina donde se trabaja es el *escritório*.")
ch(W, 1, "Depois do jantar, pedimos ___: pudim de leite.",
   ["sobremesa", "postre", "sobrejantar"], "sobremesa",
   "Falso amigo: *sobremesa* es el «postre», no la charla después de comer.")
ch(W, 2, "___ leite está ___.",
   ["O / frio", "A / fria", "O / fria"], "O / frio",
   "leite es masculino en portugués: o leite frio.")
ch(W, 2, "___ viagem para Portugal foi ___.",
   ["A / longa", "O / longo", "A / longo"], "A / longa",
   "Los sustantivos en -agem son femeninos: a viagem longa.")

cl(W, 0, "Meu ___ (apodo) na escola era «Magrelo».", "apelido",
   "Falso amigo: *apelido* es «apodo». El apellido se dice *sobrenome*.")
cl(W, 0, "O cachorro do vizinho ___ (ladrar, perfeito) a noite toda.", "latiu",
   "latir = ladrar. Ojo: cachorro = perro, no cría.")
cl(W, 0, "O advogado ___ (cuestionar, perfeito) a multa.", "contestou",
   "Falso amigo: *contestar* es «cuestionar, impugnar». «Contestar» (responder) se dice *responder*.")
cl(W, 0, "Ela pintou o cabelo de ___ (violeta).", "roxo",
   "Falso amigo de colores: *roxo* es «violeta, morado», no «rojo», que se dice *vermelho*. *Pintar o cabelo de roxo* es teñirse de violeta.")
cl(W, 1, "Trabalho num ___ (oficina) no Centro.", "escritório",
   "La oficina donde se trabaja es o escritório.")
cl(W, 1, "Brindamos com uma ___ (copa) de vinho do Porto.", "taça",
   "Para el vino se usa *taça* («copa»). *Copo* es el vaso común para agua; *vaso* es maceta.")
cl(W, 1, "Comprei um ___ (maceta) para a samambaia.", "vaso",
   "Falso amigo: *vaso* es «maceta» (y también el inodoro). El vaso para beber es el *copo*.")
cl(W, 1, "Um sanduíche de ___ (jamón) e queijo.", "presunto",
   "Falso amigo: *presunto* es «jamón». «Presunto» (supuesto) se dice *suposto* o *suspeito*.")
cl(W, 2, "Estou com ___ dor terrível nas costas.", "uma",
   "dor es femenino: uma dor, a dor.")
cl(W, 2, "A ponte Rio-Niterói é muito ___ (larga, de longitud).", "comprida",
   "ponte es femenina y «largo» de longitud es comprido o longo: comprida / longa.", alt=["longa"])
cl(W, 2, "Vou à ___ (gimnasio) três vezes por semana.", "academia",
   "Falso amigo: *academia* es el «gimnasio» (*vou à academia*, con *crase*). Se pronuncia a-ca-de-MI-a, con acento en la *i*.")
cl(W, 2, "A ___ (policía) fechou a rua.", "polícia",
   "polícia: po-LÍ-cia, con tilde en la í.")

tr(W, 0, "La comida era rara, no exquisita.", "A comida era esquisita, não deliciosa.",
   ["A comida era esquisita e não deliciosa", "A comida estava esquisita, não deliciosa",
    "A comida era estranha, não deliciosa", "A comida estava estranha, não deliciosa"],
   "Falso amigo: *esquisito* es «raro, extraño»; lo exquisito se dice *delicioso* o *requintado*.")
tr(W, 0, "Mi apellido es Silva y mi apodo, Tuca.", "Meu sobrenome é Silva e meu apelido, Tuca.",
   ["O meu sobrenome é Silva e o meu apelido, Tuca", "Meu sobrenome é Silva e meu apelido é Tuca",
    "O meu sobrenome é Silva e o meu apelido é Tuca"],
   "Falsos amigos cruzados: el apellido es *sobrenome* y el apodo *apelido*. «Mi apellido es Silva» se dice *meu sobrenome é Silva*.")
tr(W, 0, "La calle es ancha y larga.", "A rua é larga e comprida.", [],
   "Falso amigo: *largo* es «ancho» y «largo» (longitud) se dice *comprido*: *a rua é larga e comprida*.")
tr(W, 1, "¿Me das un vaso de agua?", "Me dá um copo d'água?",
   ["Me dá um copo de água", "Você me dá um copo d'água", "Você me dá um copo de água",
    "Pode me dar um copo d'água", "Pode me dar um copo de água", "Me vê um copo d'água",
    "Me vê um copo de água"],
   "El vaso para beber es copo.")
tr(W, 1, "Voy a la oficina en metro.", "Vou ao escritório de metrô.",
   ["Eu vou ao escritório de metrô", "Vou para o escritório de metrô",
    "Eu vou para o escritório de metrô", "Vou pro escritório de metrô"],
   "oficina → escritório; los medios de transporte van con de: de metrô.")
tr(W, 2, "La sal está en la mesa.", "O sal está na mesa.", [],
   "sal es masculino en portugués: o sal.")
tr(W, 2, "El puente Río-Niterói es largo.", "A ponte Rio-Niterói é comprida.",
   ["A ponte Rio-Niterói é longa"],
   "«Largo» (longitud) se dice *comprido* o *longo*; *largo* sería «ancho». *Ponte* es femenina: *a ponte é comprida*.")
tr(W, 2, "La policía llegó rápido.", "A polícia chegou rápido.",
   ["A polícia chegou rapidamente", "A polícia chegou depressa"],
   "polícia, con acento en la í.")

fx(W, 0, "O feijão da minha avó é exquisito!", "exquisito", "delicioso", "falso_amigo",
   "«Exquisito» no existe: delicioso o gostoso. Y esquisito sería «raro».",
   goodAlt=["gostoso", "uma delícia"])
fx(W, 1, "Trabalho numa oficina de advocacia em Botafogo.", "numa oficina", "num escritório", "falso_amigo",
   "El estudio de abogados es um escritório de advocacia, masculino: num escritório. Oficina es el taller.")
fx(W, 2, "A leite estava quente demais.", "A leite", "O leite", "genero",
   "leite es masculino: o leite.")
fx(W, 2, "Ontem senti um dor forte nas costas.", "um dor", "uma dor", "genero",
   "dor es femenino: uma dor.")

gd(W, 2, [["el vino", "o vinho"], ["el queso", "o queijo"], ["el pan", "o pão"]],
   "la leche → ___", "o leite", "a leite",
   "Hasta acá todo coincidía, pero leite es masculino: o leite.")
gd(W, 2, [["la casa", "a casa"], ["la mesa", "a mesa"], ["la calle", "a rua"]],
   "la sangre → ___", "o sangue", "a sangue",
   "sangue es masculino en portugués: o sangue.")
gd(W, 2, [["el libro", "o livro"], ["el barco", "o barco"], ["el mar", "o mar"]],
   "el viaje → ___", "a viagem", "o viagem",
   "Los sustantivos en -agem son femeninos: a viagem.")

sc(W, 2, ["o leite quente", "o sangue vermelho", "o mel doce", "a dor forte", "a ponte velha",
          "a viagem longa"],
   "¿Qué pasa con estos sustantivos?",
   ["Tienen el género contrario al español, y el adjetivo concuerda con el género portugués.",
    "Tienen el mismo género que en español.",
    "Son neutros y aceptan los dos artículos."],
   "Tienen el género contrario al español, y el adjetivo concuerda con el género portugués.",
   "Heterogenéricos: cambian artículo y adjetivo: o leite frio, a dor forte.")
sc(W, 2, ["polícia (po-LÍ-cia)", "academia (a-ca-de-MI-a)", "alergia (a-ler-GI-a)",
          "nível (NÍ-vel)", "oxigênio (o-xi-GÊ-nio)", "limite (li-MI-te)"],
   "¿Qué tienen en común?",
   ["El acento cae en otra sílaba que en español.",
    "Se escriben y suenan igual que en español.",
    "Son todas palabras de origen tupí."],
   "El acento cae en otra sílaba que en español.",
   "Heterotónicos: casi iguales en la escritura, distintos en el acento.")

ty(W, 1, "Escribí la palabra portuguesa para «taza».", "Uma ___ de café, por favor.", "xícara",
   "«Taza» se dice *xícara* (de café o de té); *taça* es copa. Se pide *uma xícara de café*.")
ty(W, 0, "Escribí el verbo portugués para «empujar» (infinitivo).", "___", "empurrar",
   "Falso amigo de las puertas: *empurrar* es «empujar» y *puxar* es «tirar hacia vos». *Puxar* no se parece a «pujar».")

cb(W, 0, "Saramago escreveu Ensaio sobre a Cegueira. O livro é esquisito e genial. (que)",
   "Saramago escreveu Ensaio sobre a Cegueira, que é esquisito e genial.",
   ["Saramago escreveu o Ensaio sobre a Cegueira, que é esquisito e genial",
    "Saramago escreveu Ensaio sobre a Cegueira, livro que é esquisito e genial"],
   "esquisito = raro, extraño. Ensaio sobre a Cegueira es de 1995; Saramago ganó el Nobel en 1998.")
cb(W, 1, "Deixei o carro na oficina. Fui a pé para o escritório. (e depois)",
   "Deixei o carro na oficina e depois fui a pé para o escritório.",
   ["Deixei o carro na oficina e depois fui para o escritório a pé",
    "Deixei o carro na oficina e depois fui a pé ao escritório"],
   "Falsos amigos cruzados: *oficina* es el «taller» y *escritório* es la «oficina». Y «a pie» es *a pé*.")
cb(W, 2, "A viagem foi longa. A viagem valeu a pena. (embora)",
   "Embora a viagem tenha sido longa, valeu a pena.",
   ["A viagem valeu a pena, embora tenha sido longa",
    "Embora a viagem tenha sido longa, ela valeu a pena"],
   "viagem es femenina (longa). embora + subjuntivo: tenha sido.")


# ===========================================================================
# Semana 46 — Variação: Brasil, Portugal e África
# parts: 0 Brasil y Portugal · 1 sonidos y regiones · 2 África y ortografía
# ===========================================================================
W = 46
PT = "Elegí la forma del portugués europeo."
ch(W, 0, "(PT) O que estás ___?",
   ["a fazer", "fazendo", "a fazendo"], "a fazer",
   "En Portugal, la acción en curso es estar a + infinitivo: estás a fazer. En Brasil, estar + gerundio.",
   prompt=PT)
ch(W, 0, "(BR, habla) ___ o sal, por favor.",
   ["Me passa", "Passa-me", "Passe-me"], "Me passa",
   "En el habla de Brasil el pronombre va antes: me passa. Passa-me es europeo.",
   prompt="Elegí la forma más natural en Brasil.")
ch(W, 0, "(PT) Em Lisboa, apanhei o ___ para Belém.",
   ["autocarro", "ônibus", "comboio"], "autocarro",
   "El colectivo: ônibus en Brasil, autocarro en Portugal. comboio es el tren.",
   prompt=PT)
ch(W, 0, "Em Portugal, o celular se chama ___.",
   ["telemóvel", "telefonino", "móvil"], "telemóvel",
   "Brasil y Portugal difieren en léxico cotidiano: el celular es *celular* en Brasil y *telemóvel* en Portugal. *Telefonino* es italiano.")
ch(W, 0, "No Brasil, a primeira refeição do dia é o ___.",
   ["café da manhã", "pequeno-almoço", "almoço"], "café da manhã",
   "El desayuno es *café da manhã* en Brasil y *pequeno-almoço* en Portugal; *almoço* es el almuerzo en los dos.")
ch(W, 0, "(PT) ___ uma coisa: onde fica o Chiado?",
   ["Diz-me", "Me diz", "Me diga"], "Diz-me",
   "En Portugal, al inicio de la frase, el pronombre va después: diz-me.", prompt=PT)
ch(W, 1, "No Rio, a mandioca se chama ___.",
   ["aipim", "macaxeira", "batata-doce"], "aipim",
   "aipim en Rio, macaxeira en el Nordeste, mandioca en São Paulo y en casi todo el país.")
ch(W, 1, "Em Minas, «___» pode significar «cosa»: «que ___ é esse?».",
   ["trem", "bonde", "carro"], "trem",
   "En Minas Gerais, *trem* se usa para «cosa, cualquier cosa» (*que trem é esse?*), además de «tren». Y *uai* es la interjección típica mineira.")
ch(W, 1, "(Porto Alegre) Bah, ___ viste o jogo do Grêmio?",
   ["tu", "vós", "te"], "tu",
   "En el Sur se usa tu como pronombre de 2.ª persona.")
ch(W, 2, "Mia Couto, autor de Terra Sonâmbula, é de ___.",
   ["Moçambique", "Angola", "Cabo Verde"], "Moçambique",
   "Mia Couto nació en Beira, Mozambique, en 1955; ganó el Prêmio Camões en 2013.")
ch(W, 2, "Tenho uma ___ ótima para o fim de semana.",
   ["ideia", "idéia", "idea"], "ideia",
   "Desde el Acuerdo de 1990, ideia se escribe sin tilde en Brasil y en Portugal.",
   prompt="Elegí la grafía brasileña actual.")
ch(W, 2, "No Brasil se escreve «___» (hecho); em Portugal, «facto».",
   ["fato", "facto", "feito"], "fato",
   "fato (BR) / facto (PT). En Portugal, fato además es «traje».")

cl(W, 0, "(PT) Estou ___ (ler) um livro de Eça de Queirós.", "a ler",
   "Portugal: estar a + infinitivo. Eça escribió Os Maias (1888).")
cl(W, 0, "(BR) Estou ___ (ler) Os Maias.", "lendo",
   "Brasil: estar + gerundio.")
cl(W, 0, "No Brasil, «suco»; em Portugal, «___».", "sumo",
   "Brasil y Portugal difieren: el jugo es *suco* en Brasil y *sumo* en Portugal. En Brasil, *sumo* es un verbo (*sumir*, «desaparecer»).")
cl(W, 0, "(PT) O ___ (tren) para o Porto sai às nove.", "comboio",
   "El tren es *trem* en Brasil y *comboio* en Portugal. En Brasil *comboio* es solo una caravana de vehículos.")
cl(W, 1, "(Nordeste) ___, que calor!", "Oxente",
   "oxente (u oxe) es la interjección nordestina de sorpresa.", alt=["Oxe", "Ôxe"])
cl(W, 1, "(Minas) ___, cadê o pão de queijo?", "Uai",
   "uai es la marca de Minas Gerais: sorpresa, obviedad.")
cl(W, 1, "(Sur) O ___ (niño) está brincando no pátio.", "guri",
   "En Rio Grande do Sul, *guri / guria* es «nene, pibe, chica», como en el Uruguay vecino. En el resto de Brasil, *menino / menina*.")
cl(W, 1, "No Rio, «mesmo» soa «meshmo»: é o ___ carioca.", "chiado",
   "El chiado: la s ante consonante o al final suena «sh», como en Lisboa.")
cl(W, 2, "Em Angola, «___» quer dizer «muito».", "bué",
   "bué viene de Angola y hoy lo usan los jóvenes de Lisboa.")
cl(W, 2, "Pessoa, como Bernardo Soares, escreveu: «Minha pátria é a língua ___».", "portuguesa",
   "La frase está en el Livro do Desassossego, atribuido al semi-heterónimo Bernardo Soares.")
cl(W, 2, "Antes de 1990 se escrevia «vôo»; hoje se escreve «___».", "voo",
   "El Acuerdo eliminó el circunflejo de voo, enjoo, leem, veem.")
cl(W, 2, "Cafuné, caçula e moleque são palavras de origem ___.", "banta",
   "Vienen de lenguas bantúes (sobre todo el quimbundo), traídas por africanos esclavizados.",
   alt=["banto", "bantu", "africana"])

tr(W, 0, "(Brasil) ¿Qué estás haciendo?", "O que você está fazendo?",
   ["O que você tá fazendo", "Você está fazendo o quê", "Que você está fazendo",
    "O que está fazendo", "O que é que você está fazendo", "O que cê tá fazendo"],
   "Brasil: você + estar + gerundio.")
tr(W, 0, "(Portugal) ¿Qué estás haciendo?", "O que estás a fazer?",
   ["Que estás a fazer", "O que é que estás a fazer", "O que tu estás a fazer",
    "Tu estás a fazer o quê", "Estás a fazer o quê"],
   "Portugal: tu (o sin pronombre) + estar a + infinitivo.")
tr(W, 0, "Tomé el tren de Lisboa a Coimbra.", "Apanhei o comboio de Lisboa para Coimbra.",
   ["Apanhei o comboio de Lisboa a Coimbra", "Eu apanhei o comboio de Lisboa para Coimbra",
    "Apanhei o comboio de Lisboa até Coimbra"],
   "En Portugal: apanhar (tomar) o comboio (el tren).",
   prompt="Traducí al portugués de Portugal.")
tr(W, 0, "Se me murió el celular.", "Meu celular morreu.",
   ["O meu celular morreu", "Meu celular descarregou", "O meu celular descarregou",
    "Acabou a bateria do meu celular"],
   "En Brasil, celular; en Portugal sería o telemóvel.",
   prompt="Traducí al portugués de Brasil.")
tr(W, 1, "En Río decimos aipim; en Recife, macaxeira.", "No Rio a gente diz aipim; em Recife, macaxeira.",
   ["No Rio dizemos aipim; em Recife, macaxeira", "No Rio dizemos aipim e em Recife macaxeira",
    "No Rio a gente fala aipim; em Recife, macaxeira", "No Rio falamos aipim; em Recife, macaxeira",
    "No Rio a gente diz aipim e em Recife macaxeira"],
   "Rio: aipim; Nordeste: macaxeira. em + o Rio = no Rio; Recife va sin artículo.")
tr(W, 1, "El chiado carioca se parece al de Lisboa.", "O chiado carioca se parece com o de Lisboa.",
   ["O chiado carioca parece-se com o de Lisboa", "O chiado carioca é parecido com o de Lisboa",
    ],
   "«Parecerse a» es *parecer-se com*: la preposición es *com*, no *a*. *O chiado carioca se parece com o de Lisboa*.")
tr(W, 2, "Mia Couto es mozambiqueño y escribe en portugués.", "Mia Couto é moçambicano e escreve em português.", [],
   "moçambicano, con ç. La norma escrita de Mozambique sigue a la de Portugal.")
tr(W, 2, "Pessoa escribió que su patria era la lengua portuguesa.",
   "Pessoa escreveu que sua pátria era a língua portuguesa.",
   ["Pessoa escreveu que a sua pátria era a língua portuguesa", "Pessoa escreveu que a pátria dele era a língua portuguesa",
    "Fernando Pessoa escreveu que sua pátria era a língua portuguesa",
    "Fernando Pessoa escreveu que a sua pátria era a língua portuguesa",
    "Fernando Pessoa escreveu que a pátria dele era a língua portuguesa"],
   "pátria, con tilde; língua, también.")

fx(W, 0, "Estou a fazendo o jantar.", "a fazendo", "a fazer", "tempo",
   "En Portugal: estar a + infinitivo (a fazer). En Brasil: estar + gerundio (fazendo). Nunca mezclados.")
# La etiqueta del registro va en la consigna, no dentro de lo que se escribe.
ITEMS[-1].update(prompt="Portugués de Portugal. " + FX)
fx(W, 2, "Tive uma idéia ótima para a viagem.", "idéia", "ideia", "ortografia",
   "Desde 1990, ideia sin tilde: los diptongos abiertos éi, ói de las llanas la perdieron.")
fx(W, 2, "O meu vôo para Lisboa sai às dez.", "vôo", "voo", "ortografia",
   "Desde 1990, voo sin circunflejo.")
fx(W, 1, "Tu vai receber a resposta amanhã.", "Tu vai", "Você vai", "persona",
   "«Tu vai» es habla (carioca, gaúcha). En lo escrito: você vai o tu vais.",
   goodAlt=["Tu vais"])
ITEMS[-1].update(prompt="Texto formal. " + FX)

gd(W, 0, [["me diz", "diz-me"], ["me ajuda", "ajuda-me"], ["te conto", "conto-te"]],
   "não me diz → (PT) ___", "não me diz", "não diz-me",
   "También en Portugal la negación atrae al pronombre: não me diz. La ênclise no es automática.")
gd(W, 0, [["estou comendo", "estou a comer"], ["está falando", "está a falar"], ["estamos lendo", "estamos a ler"]],
   "estão pondo → ___", "estão a pôr", "estão a pondo",
   "Portugal cambia el gerundio por a + infinitivo: pondo → a pôr.")
gd(W, 2, [["econômico (BR)", "económico (PT)"], ["gênero (BR)", "género (PT)"], ["Antônio (BR)", "António (PT)"]],
   "ideia (BR) → ___ (PT)", "ideia", "idéia",
   "Hay tildes distintas entre variedades, pero ideia se escribe igual en las dos desde 1990.")

sc(W, 0, ["BR: Você está bem?", "PT: Estás bem?", "BR: Estou comendo.", "PT: Estou a comer.",
          "BR: Me diz.", "PT: Diz-me."],
   "¿Qué rasgos distinguen el portugués europeo?",
   ["Tu, «a» + infinitivo y pronombre después del verbo.",
    "Você, gerundio y pronombre antes del verbo, como en Brasil.",
    "Solo cambia el vocabulario."],
   "Tu, «a» + infinitivo y pronombre después del verbo.",
   "Tres marcas del europeo: tu, estar a + infinitivo, ênclise.")
sc(W, 1, ["Rio: aipim", "Nordeste: macaxeira", "São Paulo: mandioca", "Sul: guri", "Minas: uai",
          "Nordeste: oxente"],
   "¿Qué muestran estos datos?",
   ["El léxico varía por región dentro de Brasil.",
    "Son errores frente a la norma culta.",
    "Son palabras de Portugal."],
   "El léxico varía por región dentro de Brasil.",
   "Brasil es enorme: el léxico cotidiano cambia de región a región sin que ninguna forma sea un error.")

ty(W, 0, "Escribí la palabra de Portugal para «ônibus».", "___", "autocarro",
   "El colectivo es *ônibus* en Brasil y *autocarro* en Portugal. El metro es *metrô* en Brasil y *metro* en Portugal.")
ty(W, 1, "Escribí la palabra carioca para «mandioca».", "___", "aipim",
   "aipim en Rio; macaxeira en el Nordeste.")

cb(W, 0, "No Brasil se diz «trem». Em Portugal se diz «comboio». (enquanto)",
   "No Brasil se diz «trem», enquanto em Portugal se diz «comboio».",
   ["Enquanto no Brasil se diz trem, em Portugal se diz comboio",
    "No Brasil diz-se trem, enquanto em Portugal se diz comboio"],
   "enquanto también contrasta: mientras que.")
cb(W, 2, "Mia Couto nasceu na Beira. Ele ganhou o Prêmio Camões em 2013. (que)",
   "Mia Couto, que nasceu na Beira, ganhou o Prêmio Camões em 2013.",
   ["Mia Couto, que nasceu na Beira, ganhou em 2013 o Prêmio Camões",
    "Mia Couto, nascido na Beira, ganhou o Prêmio Camões em 2013"],
   "Relativa explicativa entre comas. El Prêmio Camões es el mayor premio de la lengua portuguesa.")
cb(W, 2, "O Acordo Ortográfico foi assinado em 1990. Ele unificou quase toda a grafia. (que)",
   "O Acordo Ortográfico, que foi assinado em 1990, unificou quase toda a grafia.",
   ["O Acordo Ortográfico assinado em 1990 unificou quase toda a grafia",
    "O Acordo Ortográfico, assinado em 1990, unificou quase toda a grafia"],
   "El relativo evita repetir el sujeto. En Brasil el Acuerdo es obligatorio desde 2016.")


# ===========================================================================
# Semana 47 — Argumentação e modalização
# parts: 0 modalizar y opinar · 1 conceder y contraargumentar · 2 ordenar y
# concluir
# ===========================================================================
W = 47
ch(W, 0, "É possível que a reforma ___ aprovada ainda este ano.",
   ["seja", "é", "será"], "seja",
   "é possível que + subjuntivo: seja.")
ch(W, 0, "Tudo indica que a economia ___ crescer pouco este ano.",
   ["vai", "vá", "fosse"], "vai",
   "tudo indica que presenta algo como probable: indicativo, igual que en español.")
ch(W, 0, "Não acho que a solução ___ tão simples.",
   ["seja", "é", "será"], "seja",
   "achar que + indicativo; negado (não acho que), subjuntivo.")
ch(W, 0, "Pode ser que Freyre ___ exagerado a harmonia entre as raças.",
   ["tenha", "tem", "teria"], "tenha",
   "pode ser que + subjuntivo (aquí, perfeito do subjuntivo: tenha exagerado). La idea de «democracia racial» atribuida a Freyre fue muy criticada.")
ch(W, 0, "___, o Rio precisa de mais saneamento básico.",
   ["A meu ver", "Em mi opinião", "A meu ponto de vista"], "A meu ver",
   "Para dar la opinión: *a meu ver* («a mi ver», sin artículo), *na minha opinião* («en mi opinión») o *do meu ponto de vista*. ✗*em mi* no existe.")
ch(W, 1, "Embora a Constituição de 1988 ___ direitos sociais, a desigualdade continua.",
   ["garanta", "garante", "garantia"], "garanta",
   "embora + subjuntivo siempre, aunque el hecho sea real.")
ch(W, 1, "Mesmo que ___, o bloco vai sair.",
   ["chova", "chove", "choverá"], "chova",
   "mesmo que + subjuntivo: chova.")
ch(W, 1, "Por mais que eu ___, não entendo Grande Sertão: Veredas.",
   ["leia", "leio", "lia"], "leia",
   "por mais que + subjuntivo: leia. La novela de Guimarães Rosa (1956) es famosa por su lenguaje inventado.")
ch(W, 1, "Apesar de ___ importante, Formação do Brasil Contemporâneo é pouco lido hoje.",
   ["ser", "seja", "é"], "ser",
   "apesar de + infinitivo. El libro de Caio Prado Jr. es de 1942.")
ch(W, 2, "O projeto é caro. ___, não resolve o problema.",
   ["Além disso", "Demais", "Aliás de"], "Além disso",
   "«Además» se dice *além disso* (o *ademais*, formal). Ojo: *demais* significa «demasiado».")
ch(W, 2, "___ do exposto, conclui-se que a reforma é necessária.",
   ["Diante", "Adiante", "Delante"], "Diante",
   "*Diante do exposto* es la fórmula de conclusión formal: «por lo expuesto». *Diante de* es «ante, frente a».")
ch(W, 2, "Não só os moradores ___ os turistas reclamaram.",
   ["como também", "sino también", "como tampouco"], "como também",
   "não só... como também (o mas também) = no solo... sino también.")

cl(W, 0, "É provável que a tarifa ___ (subir) em janeiro.", "suba",
   "é provável que + subjuntivo: suba.")
cl(W, 0, "Tudo indica que a economia ___ (crescer, presente) pouco.", "cresce",
   "tudo indica que + indicativo: cresce.")
cl(W, 0, "Não creio que Darcy Ribeiro ___ (estar) errado sobre isso.", "esteja",
   "não creio que + subjuntivo: esteja.")
cl(W, 0, "Ao que ___ (parecer), o VLT funciona bem.", "parece",
   "*Ao que parece* es una fórmula fija con indicativo: «al parecer». El verbo no cambia: *ao que parece*.")
cl(W, 1, "Embora ___ (ser) um clássico, Os Sertões é difícil de ler.", "seja",
   "embora + subjuntivo. Os Sertões (1902), de Euclides da Cunha, narra la guerra de Canudos.")
cl(W, 1, "Ainda que ___ (ter, nós) pouco tempo, vamos visitar Ouro Preto.", "tenhamos",
   "ainda que + subjuntivo: tenhamos.")
cl(W, 1, "Por mais que o governo ___ (prometer), as obras não saem.", "prometa",
   "por mais que + subjuntivo: prometa.")
cl(W, 1, "É verdade que o turismo gera emprego; ___ entanto, também encarece a cidade.", "no",
   "*No entanto* es «sin embargo», con *no* (*em + o*) obligatorio. Es de registro escrito, como *porém* y *contudo*.")
cl(W, 2, "Em ___ lugar, é preciso ouvir os moradores.", "primeiro",
   "em primeiro lugar abre la serie de argumentos.")
cl(W, 2, "Por um lado, a obra é útil; por ___, é caríssima.", "outro",
   "por um lado... por outro (lado).", alt=["outro lado"])
cl(W, 2, "Em ___, a cidade precisa de mais árvores.", "suma",
   "*Em suma* es «en suma, en resumen»: sirve para cerrar un argumento, igual que en español.", alt=["resumo"])
cl(W, 2, "___ forma, seria possível reduzir o lixo nas praias.", "Dessa",
   "*Dessa forma* es «de esa manera»: *de + essa* se contrae. También *desse modo*, *dessa maneira*.", alt=["Desta"])

tr(W, 0, "Es posible que la tarifa aumente.", "É possível que a tarifa aumente.",
   ["É possível que a passagem aumente", "Pode ser que a tarifa aumente", "Pode ser que a passagem aumente"],
   "é possível que + subjuntivo.")
tr(W, 0, "No creo que sea tan simple.", "Não acho que seja tão simples.",
   ["Não creio que seja tão simples", "Eu não acho que seja tão simples",
    "Não acredito que seja tão simples", "Eu não acredito que seja tão simples",
    "Eu não creio que seja tão simples"],
   "Negación + subjuntivo: não acho que seja.")
tr(W, 0, "Al parecer, el museo va a reabrir.", "Ao que parece, o museu vai reabrir.",
   ["Aparentemente, o museu vai reabrir", "Parece que o museu vai reabrir",
    "Ao que parece, o museu vai ser reaberto", "Ao que parece, o museu reabrirá"],
   "«Al parecer» se dice *ao que parece*, con *ao* (*a + o*) y el relativo *que*. *Ao parecer* es un calco.")
tr(W, 1, "Aunque la playa está sucia, está llena.", "Embora a praia esteja suja, está cheia.",
   ["Embora a praia esteja suja, ela está cheia", "Apesar de a praia estar suja, está cheia",
    "Apesar de a praia estar suja, ela está cheia", "A praia está suja, mas está cheia",
    "Embora esteja suja, a praia está cheia"],
   "embora + subjuntivo, aunque sea un hecho.")
tr(W, 1, "Por más que estudie, siempre me equivoco con la crase.", "Por mais que eu estude, sempre erro a crase.",
   ["Por mais que eu estude, sempre erro na crase", "Por mais que estude, sempre erro a crase",
    "Por mais que estude, sempre erro na crase", "Por mais que eu estude, eu sempre erro a crase",
    "Por mais que eu estude, eu sempre erro na crase", "Por mais que eu estude, sempre me engano com a crase"],
   "*Por mais que* («por más que») pide subjuntivo: *por mais que eu estude*. Ojo: *mais* con *i*.")
tr(W, 1, "Aunque llueva, vamos a Petrópolis.", "Mesmo que chova, vamos a Petrópolis.",
   ["Ainda que chova, vamos a Petrópolis", "Mesmo que chova, a gente vai a Petrópolis",
    "Mesmo que chova, vamos para Petrópolis", "Ainda que chova, vamos para Petrópolis",
    "Mesmo que chova, iremos a Petrópolis", "Mesmo que chova, a gente vai para Petrópolis"],
   "mesmo que / ainda que + subjuntivo.")
tr(W, 2, "Además, el presupuesto se duplicó.", "Além disso, o orçamento dobrou.",
   ["Ademais, o orçamento dobrou", "Além disso, o orçamento duplicou", "Ademais, o orçamento duplicou"],
   "«Además» es *além disso*; «presupuesto» es *orçamento*. «Duplicarse» se dice *dobrar*, sin pronombre.")
tr(W, 2, "Por lo tanto, es urgente limpiar la Bahía de Guanabara.", "Portanto, é urgente limpar a Baía de Guanabara.",
   ["Por isso, é urgente limpar a Baía de Guanabara", "Logo, é urgente limpar a Baía de Guanabara",
    "Assim, é urgente limpar a Baía de Guanabara", "Portanto, é urgente despoluir a Baía de Guanabara"],
   "portanto = por lo tanto. Ojo: Baía (de Guanabara), sin h; Bahia es el estado.")

fx(W, 1, "Embora a praia está suja, muita gente vai lá.", "está", "esteja", "subjuntivo",
   "embora exige subjuntivo: embora esteja.")
fx(W, 0, "En minha opinião, a reforma é necessária.", "En minha", "Na minha", "contraccion",
   "«En» es el error: se dice em minha opinião o na minha opinião (em + a = na).",
   alt=["Em minha opinião, a reforma é necessária."])
fx(W, 2, "Además, o projeto não resolve nada.", "Además", "Além disso", "espanol",
   "«Además» se dice *além disso* (o *ademais*, formal). *Además* no existe en portugués.", goodAlt=["Ademais"])
fx(W, 1, "Apesar de que é caro, vale a pena.", "Apesar de que é", "Apesar de ser", "espanol",
   "«A pesar de que es» → apesar de ser (o embora seja).", goodAlt=["Embora seja"])

gd(W, 1, [["estudar", "por mais que eu estude"], ["correr", "por mais que eu corra"], ["tentar", "por mais que eu tente"]],
   "fazer → ___", "por mais que eu faça", "por mais que eu faza",
   "El subjuntivo sale de la 1.ª persona del presente: faço → faça.")
gd(W, 1, [["falar", "embora ele fale"], ["comer", "embora ele coma"], ["abrir", "embora ele abra"]],
   "dizer → ___", "embora ele diga", "embora ele diza",
   "digo → diga: la raíz de la 1.ª persona del presente.")
gd(W, 0, [["acho que é", "não acho que seja"], ["acho que vem", "não acho que venha"], ["acho que sabe", "não acho que saiba"]],
   "acho que pode → ___", "não acho que possa", "não acho que poda",
   "posso → possa. «Poda» es del verbo podar.")

sc(W, 1, ["Embora esteja cansado, vou.", "Ainda que chova, o bloco sai.", "Mesmo que seja caro, compro.",
          "Por mais que eu estude, erro.", "Embora a praia esteja suja, está cheia.",
          "Ainda que fosse difícil, tentaria."],
   "¿Qué modo sigue a los conectores concesivos?",
   ["Siempre subjuntivo, aunque el hecho sea real.",
    "Indicativo si el hecho es real, como en español.",
    "Infinitivo."],
   "Siempre subjuntivo, aunque el hecho sea real.",
   "embora, ainda que, mesmo que, por mais que: subjuntivo siempre.")
sc(W, 0, ["É possível que chova.", "Pode ser que chova.", "É provável que chova.",
          "Tudo indica que vai chover.", "Parece que vai chover.", "Ao que parece, vai chover."],
   "¿Qué modo pide cada modalizador?",
   ["«É possível / provável que» y «pode ser que»: subjuntivo; «tudo indica que», «parece que»: indicativo.",
    "Todos piden subjuntivo porque expresan duda.",
    "Todos piden indicativo."],
   "«É possível / provável que» y «pode ser que»: subjuntivo; «tudo indica que», «parece que»: indicativo.",
   "Los que evalúan una posibilidad piden subjuntivo; los que informan una evidencia, indicativo.")

ty(W, 2, "Escribí el conector de conclusión que significa «en suma».", "___, a cidade precisa de mais árvores.", "Em suma",
   "em suma, em resumo: cierran el texto.", alt=["Em resumo"])
ty(W, 1, "Escribí el subjuntivo de «ser» (3.ª persona).", "Embora ___ tarde, vamos ao show.", "seja",
   "embora + subjuntivo: seja.")

cb(W, 1, "A praia está suja. Está cheia. (embora)",
   "Embora a praia esteja suja, está cheia.",
   ["Embora esteja suja, a praia está cheia", "A praia está cheia, embora esteja suja",
    "Embora a praia esteja suja, ela está cheia"],
   "embora + subjuntivo: está → esteja.")
cb(W, 1, "A Constituição de 1988 ampliou direitos. Muitos não saíram do papel. (é verdade que... mas)",
   "É verdade que a Constituição de 1988 ampliou direitos, mas muitos não saíram do papel.",
   ["É verdade que a Constituição de 1988 ampliou os direitos, mas muitos não saíram do papel"],
   "Concedés primero (é verdade que) y rebatís después (mas).")
cb(W, 2, "O metrô é caro. É lento. (não só... como também)",
   "O metrô não só é caro como também é lento.",
   ["O metrô não só é caro, como também é lento", "O metrô não é só caro, como também é lento",
    "O metrô não só é caro como também lento", "Não só o metrô é caro como também é lento"],
   "não só... como também suma dos argumentos en una sola frase.")


# ===========================================================================
# Semana 48 — Resumo e reformulação
# parts: 0 verbos para citar y su regencia · 1 atribuir y reformular ·
# 2 el resumo y el condicional del rumor
# ===========================================================================
W = 48
ch(W, 0, "Concordo ___ o autor sobre o papel da escravidão.",
   ["com", "a", "de"], "com",
   "«Estar de acuerdo con» se dice *concordar com*: *concordo com o autor*. El verbo *concordar* reemplaza a «estar de acuerdo».")
ch(W, 0, "Florestan Fernandes discorda ___ ideia de «democracia racial».",
   ["da", "na", "à"], "da",
   "discordar de: de + a = da. Florestan mostró la discriminación que la idea de «democracia racial» ocultaba.")
ch(W, 0, "O texto se refere ___ Revolução dos Cravos.",
   ["à", "a", "na"], "à",
   "*Referir-se a* + *a Revolução* dá *à Revolução*, con *crase*. La Revolução dos Cravos derribó al Estado Novo el 25 de abril de 1974.")
ch(W, 0, "Lélia Gonzalez chama a atenção ___ o racismo na língua e na cultura.",
   ["para", "a", "em"], "para",
   "chamar a atenção para = llamar la atención sobre. Lélia Gonzalez acuñó «pretuguês» para el portugués marcado por lo africano.")
ch(W, 0, "O réu ___ inocência, mas ninguém acreditou.",
   ["alegou", "alegrou", "alojou"], "alegou",
   "*Alegar* es «alegar», a menudo con matiz de excusa: *alegou inocência*. *Alegrar* es «poner contento».")
ch(W, 1, "___ o IBGE, a população do Rio passa de seis milhões.",
   ["Segundo", "Según", "Seguindo"], "Segundo",
   "«Según» se dice *segundo* (o *conforme*, *de acordo com*): *segundo o IBGE*. *Según* no existe.")
ch(W, 1, "Segundo ___, a obra termina em maio.",
   ["ele", "dele", "lhe"], "ele",
   "segundo + pronombre sujeto: segundo ele, segundo ela.")
ch(W, 1, "A inflação caiu 0,1%, ___, quase nada.",
   ["ou seja", "o seja", "ou sea"], "ou seja",
   "«O sea» es *ou seja*: la conjunción «o» en portugués se escribe *ou*.")
ch(W, 1, "___ o relatório, a água está própria para banho.",
   ["Conforme", "Conformo", "Confirme"], "Conforme",
   "*Conforme* + fuente es «según»: *conforme o relatório*. También funciona como «a medida que»: *conforme o tempo passa*.")
ch(W, 2, "O texto ___ da ocupação da orla.",
   ["trata", "tratam", "trata-se"], "trata",
   "O texto trata de...: el texto es sujeto. trata-se de es impersonal (se trata de), sin sujeto.")
ch(W, 2, "Segundo testemunhas, o motorista ___ bêbado.",
   ["estaria", "estará", "esteja"], "estaria",
   "El futuro do pretérito marca lo no confirmado: estaria (estaría, según dicen).")
ch(W, 2, "O jogador ___ pedido aumento, segundo a imprensa.",
   ["teria", "terá", "tenha"], "teria",
   "*Teria* + participio es el condicional del rumor en pasado: *teria pedido* «habría pedido» (según dicen). La prensa lo usa para lo no confirmado.")

cl(W, 0, "Sérgio Buarque ___ (sustentar, presente) que o brasileiro age pelo coração.", "sustenta",
   "*Sustentar* es «sostener con argumentos»: *sustenta que*. Así lee el «homem cordial» de Raízes do Brasil.")
cl(W, 0, "Schwarz ___ (apontar, perfeito) a contradição entre liberalismo e escravidão.", "apontou",
   "*Apontar* es «señalar» (una idea, un error): *apontou a contradição*. Es la tesis de «As ideias fora do lugar», de Roberto Schwarz.")
cl(W, 0, "O estudo ___ (ressaltar, presente) a importância do saneamento.", "ressalta",
   "*Ressaltar* es «destacar, subrayar»: *o estudo ressalta*. Se escribe con doble *s*, para el sonido [s] entre vocales.")
cl(W, 0, "A matéria faz referência ___ Constituição de 1988.", "à",
   "*Fazer referência a* + *a Constituição* lleva *crase*: *à Constituição*. «Hacer referencia a», con la misma preposición.")
cl(W, 1, "De acordo ___ a pesquisa, 40% dos cariocas usam o transporte público.", "com",
   "«De acuerdo con» es *de acordo com*: *acordo* es «acuerdo». Para citar fuentes también *segundo*, *conforme*.")
cl(W, 1, "O Arpoador, ___ é, a pedra entre Ipanema e Copacabana, lota ao pôr do sol.", "isto",
   "*Isto é* es «es decir»: introduce una aclaración, como *ou seja*. Se usa *isto*, el neutro «esto».")
cl(W, 1, "Em outras ___, o projeto parou.", "palavras",
   "*Em outras palavras* es «en otras palabras»: *em* en lugar de «en» y *palavras* con *v*.")
cl(W, 1, "Chego às oito, ou ___, às nove.", "melhor",
   "ou melhor = mejor dicho: corrige lo anterior.")
cl(W, 2, "O artigo ___ (abordar, presente) o problema do lixo na Baía de Guanabara.", "aborda",
   "abordar un tema: verbo típico del resumo.")
cl(W, 2, "Por fim, a autora ___ (concluir, presente) que falta verba.", "conclui",
   "concluir → conclui (3.ª persona, sin tilde).")
cl(W, 2, "Segundo a polícia, o suspeito ___ (fugir, condicional compuesto) pela Linha Vermelha.", "teria fugido",
   "*Teria* + participio presenta un hecho no confirmado: *teria fugido* «habría huido» (según la policía). Es el condicional del periodismo.")
cl(W, 2, "O cantor ___ (cancelar, condicional compuesto) o show, segundo fãs.", "teria cancelado",
   "Condicional del rumor: teria cancelado.")

tr(W, 0, "Estoy de acuerdo con el autor.", "Concordo com o autor.",
   ["Eu concordo com o autor", "Estou de acordo com o autor"],
   "concordar com = estar de acordo com. Ojo con la preposición: se concuerda «com» alguien, no «a».")
tr(W, 0, "El texto se refiere a la dictadura militar.", "O texto se refere à ditadura militar.",
   ["O texto refere-se à ditadura militar", "O texto faz referência à ditadura militar"],
   "*Referir-se a* + *a ditadura* se contrae en *à ditadura*: la *crase* une la preposición del verbo y el artículo femenino.")
tr(W, 0, "DaMatta destaca el «jeitinho» brasileño.", "DaMatta ressalta o jeitinho brasileiro.",
   ["DaMatta destaca o jeitinho brasileiro", "DaMatta salienta o jeitinho brasileiro",
    "DaMatta enfatiza o jeitinho brasileiro", "DaMatta ressalta o «jeitinho» brasileiro"],
   "ressaltar / destacar / salientar. DaMatta analiza el jeitinho en O que faz o brasil, Brasil? (1984).")
tr(W, 1, "Según el IBGE, Río tiene más de seis millones de habitantes.",
   "Segundo o IBGE, o Rio tem mais de seis milhões de habitantes.",
   ["De acordo com o IBGE, o Rio tem mais de seis milhões de habitantes",
    "Conforme o IBGE, o Rio tem mais de seis milhões de habitantes",
    "Segundo o IBGE, o Rio de Janeiro tem mais de seis milhões de habitantes",
    "De acordo com o IBGE, o Rio de Janeiro tem mais de seis milhões de habitantes"],
   "segundo / de acordo com / conforme. o Rio lleva artículo.")
tr(W, 1, "O sea, nadie leyó el informe.", "Ou seja, ninguém leu o relatório.",
   ["Isto é, ninguém leu o relatório", "Quer dizer, ninguém leu o relatório"],
   "«O sea» es *ou seja*; «informe» se dice *relatório*. «Nadie» es *ninguém*, que al inicio no necesita *não*.")
tr(W, 1, "Según ella, el libro es un clásico.", "Segundo ela, o livro é um clássico.",
   ["De acordo com ela, o livro é um clássico", "Para ela, o livro é um clássico"],
   "segundo + pronombre sujeto: segundo ela.")
tr(W, 2, "El texto trata sobre la Revolución de los Claveles.", "O texto trata da Revolução dos Cravos.",
   ["O texto aborda a Revolução dos Cravos", "O texto fala da Revolução dos Cravos",
    "O texto fala sobre a Revolução dos Cravos", "O texto trata sobre a Revolução dos Cravos"],
   "tratar de + a = da. El 25 de abril de 1974 terminó con casi medio siglo de dictadura en Portugal.")
tr(W, 2, "El ministro habría mentido.", "O ministro teria mentido.", [],
   "Condicional del rumor: teria + participio.")

fx(W, 1, "Según o autor, o Brasil é um país cordial.", "Según", "Segundo", "espanol",
   "«Según» se dice *segundo*: *segundo o autor*. *Según* no existe en portugués.")
fx(W, 1, "O seja, a proposta não mudou nada.", "O seja", "Ou seja", "espanol",
   "«O sea» es *ou seja*: la conjunción disyuntiva se escribe *ou*, no «o».")
fx(W, 0, "O artigo se refere a crise da água no Rio.", "a crise", "à crise", "crase",
   "*Referir-se a* + *a crise* lleva *crase*: *se refere à crise*. Sin acento, faltaría la preposición.")
fx(W, 1, "Segundo dele, o prazo acabou.", "Segundo dele", "Segundo ele", "pronome",
   "segundo va con pronombre sujeto: segundo ele.")

gd(W, 0, [["afirmar", "a afirmação"], ["declarar", "a declaração"], ["informar", "a informação"]],
   "defender → ___", "a defesa", "a defensão",
   "defender no sigue el patrón -ção: a defesa (la defensa).")
gd(W, 0, [["argumentar", "o argumento"], ["pensar", "o pensamento"], ["tratar", "o tratamento"]],
   "resumir → ___", "o resumo", "o resumimento",
   "resumir → o resumo, sin sufijo.")
gd(W, 0, [["citar", "a citação"], ["alegar", "a alegação"], ["explicar", "a explicação"]],
   "concluir → ___", "a conclusão", "a concluição",
   "concluir → conclusão (como incluir → inclusão). Ojo: no es regla general de -uir: construir → construção, contribuir → contribuição.")

sc(W, 2, ["O suspeito teria fugido.", "O ministro teria mentido.", "O jogador estaria lesionado.",
          "Segundo fontes, o show seria cancelado.", "A polícia confirmou: o suspeito fugiu.",
          "O ministro admitiu: mentiu."],
   "¿Qué diferencia hay entre «teria fugido» y «fugiu»?",
   ["«Teria fugido» no está confirmado; «fugiu» sí.",
    "«Teria fugido» es un futuro posible; «fugiu», un pasado.",
    "No hay diferencia de sentido."],
   "«Teria fugido» no está confirmado; «fugiu» sí.",
   "La prensa usa el futuro do pretérito para tomar distancia de lo que no confirmó.")
sc(W, 0, ["O autor afirma que...", "A autora defende que...", "O réu alega que...",
          "O estudo aponta que...", "A pesquisa ressalta que...", "O texto sustenta que..."],
   "¿Qué verbo muestra que quien cita duda de lo citado?",
   ["alegar", "ressaltar", "apontar"], "alegar",
   "alegar sugiere una justificación dudosa; los otros solo señalan o destacan.")

ty(W, 1, "Escribí la expresión portuguesa de «o sea».", "___", "ou seja",
   "ou seja, con u y con el subjuntivo seja.")
ty(W, 0, "Escribí la preposición.", "O texto chama a atenção ___ a desigualdade.", "para",
   "chamar a atenção para.")

cb(W, 1, "O IBGE publicou dados. A população do Rio envelheceu. (segundo)",
   "Segundo o IBGE, a população do Rio envelheceu.",
   ["A população do Rio envelheceu, segundo o IBGE", "Segundo dados do IBGE, a população do Rio envelheceu",
    "Segundo os dados do IBGE, a população do Rio envelheceu"],
   "segundo + fuente atribuye la información.")
cb(W, 1, "A inflação caiu 0,1%. Não caiu quase nada. (ou seja)",
   "A inflação caiu 0,1%, ou seja, quase nada.",
   ["A inflação caiu 0,1%, ou seja, não caiu quase nada"],
   "ou seja reformula lo anterior con otras palabras.")
cb(W, 2, "O autor apresenta o tema. Depois discute soluções. (em seguida)",
   "O autor apresenta o tema e, em seguida, discute soluções.",
   ["O autor apresenta o tema; em seguida, discute soluções",
    "O autor apresenta o tema. Em seguida, discute soluções"],
   "em seguida ordena los pasos del resumo, en presente y 3.ª persona.")


# ===========================================================================
# Semana 49 — Registro culto e coloquial
# parts: 0 a gente, pronombres, tem / há · 1 reducciones y pronombres
# formales · 2 vocabulario y el camino de vuelta
# ===========================================================================
W = 49
FM = "Elegí la versión formal."
ch(W, 0, "A gente vai ao Maracanã. → ___ ao Maracanã.",
   ["Nós vamos", "A gente vamos", "Nós vai"], "Nós vamos",
   "a gente va con verbo en 3.ª singular; nós, con 1.ª plural. Nunca mezclados.", prompt=FM)
ch(W, 0, "Vi ele ontem. → ___ ontem.",
   ["Vi-o", "Vi-lo", "Vi-lhe"], "Vi-o",
   "Tras verbo terminado en vocal, o / a: vi-o. -lo va tras -r, -s, -z.", prompt=FM)
ch(W, 0, "Vou ajudar ele. → Vou ___.",
   ["ajudá-lo", "ajudar-lo", "ajudar-o"], "ajudá-lo",
   "ajudar + o → ajudá-lo: cae la -r, entra la l y la vocal lleva tilde.", prompt=FM)
ch(W, 0, "Tem muita gente na praia. → ___ muitas pessoas na praia.",
   ["Há", "Hão", "Têm"], "Há",
   "tem existencial → há, siempre singular.", prompt=FM)
ch(W, 0, "Teve um apagão ontem. → ___ um apagão ontem.",
   ["Houve", "Houveram", "Haverá"], "Houve",
   "teve → houve (perfeito de haver).", prompt=FM)
ch(W, 1, "Cadê o relatório? → ___ o relatório?",
   ["Onde está", "Aonde está", "Cadê está"], "Onde está",
   "*Cadê?* (coloquial) equivale a *onde está?* en registro neutro. *Aonde* va solo con verbos de movimiento (*aonde vai?*).", prompt=FM)
ch(W, 1, "Vou pro Centro. → Vou ___ Centro.",
   ["para o", "pra o", "para"], "para o",
   "pro = para o, pra = para (a): en lo escrito, enteras.", prompt=FM)
ch(W, 1, "Me disseram que o prazo acabou. → ___ que o prazo acabou.",
   ["Disseram-me", "Me disseram", "Disseram-lhe"], "Disseram-me",
   "En la escritura formal no se empieza con pronombre átono: Disseram-me.", prompt=FM)
ch(W, 1, "Vou te dizer a verdade. → (muy formal) ___ a verdade.",
   ["Dir-te-ei", "Direi-te", "Te direi"], "Dir-te-ei",
   "Futuro + pronombre al inicio = mesóclise: dir-te-ei. «Direi-te» es error.", prompt=FM)
ch(W, 2, "Não temos grana para a obra. → Não temos ___ para a obra.",
   ["recursos", "granas", "guita"], "recursos",
   "grana es coloquial; en lo formal, dinheiro o recursos.", prompt=FM)
ch(W, 2, "Rolou um problema na reunião. → ___ um problema na reunião.",
   ["Ocorreu", "Rolou-se", "Ocorreram"], "Ocorreu",
   "*Rolar* (coloquial) es «pasar, ocurrir»; en neutro: *ocorrer*, *acontecer*. El verbo concuerda con el sujeto singular *um problema*.", prompt=FM)
ch(W, 2, "Haverá reunião amanhã. → (charla) ___ reunião amanhã.",
   ["Vai ter", "Vão ter", "Haverão"], "Vai ter",
   "En la charla, vai ter (singular). Haverá en WhatsApp suena a comunicado oficial.",
   prompt="Elegí la versión coloquial.")

cl(W, 0, "A gente precisa de ajuda. → ___ (precisar, nós) de ajuda.", "Precisamos",
   "a gente precisa → nós precisamos.")
cl(W, 0, "Conheço ela. → Conheço-___.", "a",
   "ela como objeto → a: conheço-a.")
cl(W, 0, "Vou chamar eles. → Vou ___ (chamar + os).", "chamá-los",
   "chamar + os → chamá-los.")
cl(W, 0, "Tinha muita gente no bloco. → ___ muitas pessoas no bloco.", "Havia",
   "tinha existencial → havia.")
cl(W, 0, "«No meio do caminho tinha uma pedra» → en prosa formal: «No meio do caminho ___ uma pedra».", "havia",
   "Drummond usó a propósito el «tinha» del habla (1928); la norma escrita diría havia.")
cl(W, 1, "Tô chegando. → ___ chegando.", "Estou",
   "En el habla, *estou* se reduce a *tô*: *tô chegando*. En la escritura neutra, siempre *estou*.")
cl(W, 1, "Tá tudo certo? → ___ tudo certo?", "Está",
   "En el habla, *está* se reduce a *tá*: *tá tudo certo?* En la escritura neutra, *está*.")
cl(W, 1, "Me parece que... → ___-me que... (formal)", "Parece",
   "Al inicio, ênclise: parece-me.")
cl(W, 1, "Isso se faria depois. → Far-___-ia isso depois.", "se",
   "Mesóclise con condicional: far-se-ia.")
cl(W, 2, "Curti a palestra. → ___ (gostar, perfeito) da palestra.", "Gostei",
   "curtir (coloquial) = gostar de; ojo con la preposición: gostei da palestra.")
cl(W, 2, "Não saquei nada. → Não ___ (entender, perfeito) nada.", "entendi",
   "*Sacar* (coloquial) es «entender, cazar»; en neutro, *entender*. En Brasil *sacar* también es retirar dinero del banco.")
cl(W, 2, "Encontrei-o ontem. → (charla) Encontrei ___ ontem.", "ele",
   "En el habla de Brasil, ele como objeto: encontrei ele.")

tr(W, 0, "Vamos a solicitar una reunión.", "Nós vamos solicitar uma reunião.",
   ["Vamos solicitar uma reunião", "Solicitaremos uma reunião", "Nós solicitaremos uma reunião"],
   "En lo formal, nós en lugar de a gente.", prompt="Traducí al portugués formal.")
tr(W, 0, "Lo vi ayer en el congreso.", "Eu o vi ontem no congresso.",
   ["Vi-o ontem no congresso", "Eu o vi no congresso ontem", "Vi-o no congresso ontem"],
   "Formal: eu o vi o vi-o, nunca «vi ele».", prompt="Traducí al portugués formal.")
tr(W, 0, "Hubo muchas quejas.", "Houve muitas reclamações.",
   ["Houve muitas queixas"],
   "houve, singular; «queja» = reclamação o queixa.", prompt="Traducí al portugués formal.")
tr(W, 1, "¿Dónde está el informe?", "Onde está o relatório?", [],
   "Formal: onde está, no cadê.", prompt="Traducí al portugués formal.")
tr(W, 1, "Me dijeron que el plazo terminó.", "Disseram-me que o prazo terminou.",
   ["Disseram-me que o prazo acabou", "Informaram-me que o prazo terminou",
    "Informaram-me que o prazo acabou", "Disseram-me que o prazo se encerrou"],
   "Formal: no se empieza con pronombre átono.", prompt="Traducí al portugués formal.")
tr(W, 2, "¿Me mandás el archivo?", "Me manda o arquivo?",
   ["Você me manda o arquivo", "Manda o arquivo pra mim", "Me manda o arquivo aí",
    "Cê me manda o arquivo", "Pode me mandar o arquivo"],
   "En la charla, pronombre adelante y forma de tu: me manda.",
   prompt="Traducí al portugués coloquial de Brasil.")
tr(W, 2, "Mañana hay reunión.", "Amanhã vai ter reunião.",
   ["Vai ter reunião amanhã", "Amanhã tem reunião", "Tem reunião amanhã"],
   "En la charla, ter existencial: tem, vai ter.", prompt="Traducí al portugués coloquial de Brasil.")
tr(W, 2, "¡El show estuvo buenísimo!", "O show foi irado!",
   ["O show foi maneiro", "O show foi muito bom", "O show foi sinistro", "O show foi demais",
    "O show foi ótimo", "O show tava irado", "O show estava irado", "O show foi incrível"],
   "irado, maneiro, sinistro: elogios cariocas.", prompt="Traducí al portugués coloquial de Brasil.")

fx(W, 0, "A gente vamos ao Maracanã domingo.", "vamos", "vai", "concordancia",
   "a gente va con verbo en 3.ª singular: a gente vai.")
fx(W, 0, "Houveram muitas reclamações sobre o BRT.", "Houveram", "Houve", "concordancia",
   "haver existencial es impersonal: houve.")
fx(W, 1, "Me parece, Senhor Diretor, que o prazo é curto.", "Me parece", "Parece-me", "colocacao",
   "En lo formal, sin pronombre átono al inicio: parece-me.")
fx(W, 1, "Vou comprar-o amanhã.", "comprar-o", "comprá-lo", "pronome",
   "Tras -r: comprar + o → comprá-lo.")

gd(W, 0, [["vi ele", "vi-o"], ["conheço ela", "conheço-a"], ["encontrei eles", "encontrei-os"]],
   "vou comprar ele → ___", "vou comprá-lo", "vou comprar-o",
   "Tras -r el pronombre toma l y la -r cae: comprá-lo.")
gd(W, 0, [["chamei ele", "chamei-o"], ["ajudo ela", "ajudo-a"], ["vendi eles", "vendi-os"]],
   "estudamos ele → ___", "estudamo-lo", "estudamos-o",
   "Tras -s también: estudamos + o → estudamo-lo.")
gd(W, 0, [["vejo ela", "vejo-a"], ["levo ele", "levo-o"], ["trouxe eles", "trouxe-os"]],
   "dão ele → ___", "dão-no", "dão-o",
   "Tras nasal (-ão, -am, -em) el pronombre toma n: dão-no, fazem-no.")

sc(W, 1, ["Disseram-me a verdade.", "Não me disseram nada.", "Quem me contou foi ela.",
          "Já lhe enviei o documento.", "Enviei-lhe o documento.", "Dir-lhe-ei amanhã."],
   "¿Cuándo va el pronombre antes del verbo en la escritura formal?",
   ["Tras palabras que lo atraen: não, quem, já, que...",
    "Siempre, como en el habla de Brasil.",
    "Solo con el futuro."],
   "Tras palabras que lo atraen: não, quem, já, que...",
   "Sin atractor: ênclise (enviei-lhe) o mesóclise (dir-lhe-ei). Con atractor: próclise (não me disseram).")
sc(W, 0, ["Tem gente. → Há pessoas.", "Tinha fila. → Havia fila.", "Teve festa. → Houve festa.",
          "Vai ter show. → Haverá show.", "Tem muitos turistas. → Há muitos turistas.",
          "Teve protestos. → Houve protestos."],
   "¿Qué cambia al pasar de «ter» a «haver» existencial?",
   ["El verbo, que queda siempre en singular.",
    "El verbo, que concuerda con el sustantivo.",
    "Nada: son intercambiables en cualquier registro."],
   "El verbo, que queda siempre en singular.",
   "ter existencial es del habla; haver, de lo escrito. Los dos, impersonales.")

ty(W, 2, "Escribí la palabra formal para «grana».", "___", "dinheiro",
   "*Grana* (coloquial) es «guita, plata»; en neutro se dice *dinheiro*. «Plata» como metal es *prata*.", alt=["recursos"])
ty(W, 1, "Escribí la forma formal de «cadê».", "___ o documento?", "Onde está",
   "*Cadê* (coloquial) es *onde está / onde estão* en registro neutro. En la escritura formal no se usa *cadê*.")

cb(W, 0, "Tinha muita gente. Não conseguimos entrar. (como; versión formal)",
   "Como havia muitas pessoas, não conseguimos entrar.",
   ["Como havia muita gente, não conseguimos entrar", "Não conseguimos entrar, porque havia muitas pessoas",
    "Não conseguimos entrar porque havia muita gente"],
   "En la versión formal, tinha → havia.")
cb(W, 1, "Me mandaram o convite. Não fui. (embora; versión formal)",
   "Embora me tenham mandado o convite, não fui.",
   ["Embora tenham me mandado o convite, não fui", "Embora me tenham enviado o convite, não fui",
    "Embora tenham me enviado o convite, não fui"],
   "embora atrae el pronombre (me tenham); y pide subjuntivo.")
cb(W, 2, "Haverá reunião amanhã. Não posso ir. (mas; versión coloquial)",
   "Vai ter reunião amanhã, mas não posso ir.",
   ["Amanhã vai ter reunião, mas não posso ir", "Vai ter reunião amanhã, mas eu não posso ir",
    "Amanhã tem reunião, mas não posso ir", "Tem reunião amanhã, mas não posso ir",
    "Vai ter reunião amanhã, mas não vou poder ir"],
   "En la charla, vai ter / tem en lugar de haverá.")


# ===========================================================================
# Semana 50 — Colocações e expressões idiomáticas
# parts: 0 verbos soporte y calcos · 1 expresiones del día a día ·
# 2 refranes y colocaciones formales
# ===========================================================================
W = 50
ch(W, 0, "Faço ___ de pagar o chope.",
   ["questão", "pergunta", "questões"], "questão",
   "*Fazer questão de* + infinitivo es «insistir en, empeñarse en»: *faço questão de pagar*. *Fazer uma pergunta* es «hacer una pregunta».")
ch(W, 0, "Tomara que o plano ___ certo.",
   ["dê", "dá", "faça"], "dê",
   "dar certo = salir bien; tras tomara que, subjuntivo: dê.")
ch(W, 0, "Ninguém ___ a sério o aviso da Defesa Civil.",
   ["levou", "tomou", "fez"], "levou",
   "«Tomar en serio» se dice *levar a sério*, con *levar* y *a*: *ninguém levou a sério*. ✗*tomar a sério* es calco.", prompt="Elegí la forma natural en Brasil.")
ch(W, 0, "Amanhã eu ___ 30 anos.",
   ["faço", "cumpro", "tenho"], "faço",
   "«Cumplir años» = fazer anos: faço 30 anos. cumprir es cumplir una promesa o una ley.")
ch(W, 0, "Você pode ___ uma foto nossa?",
   ["tirar", "sacar", "tomar"], "tirar",
   "«Sacar una foto» se dice *tirar uma foto*. En Brasil *sacar* es retirar dinero o, coloquial, entender.")
ch(W, 0, "___ reservar antes de subir ao Cristo.",
   ["É preciso", "Faz falta", "Hace falta"], "É preciso",
   "«Hace falta + infinitivo» es *é preciso* + infinitivo: *é preciso reservar*. *Faz falta* significa «se echa de menos».")
ch(W, 1, "Esqueci o aniversário dela. ___ na bola.",
   ["Pisei", "Chutei", "Meti"], "Pisei",
   "*Pisar na bola* es «meter la pata»: se pisa *na* bola, no se patea. Registro coloquial.")
ch(W, 1, "Não tem mesa, mas o garçom vai dar um ___.",
   ["jeito", "modo", "forma"], "jeito",
   "*Dar um jeito* es «arreglárselas, encontrar la vuelta»: el verbo es *dar*. De ahí el «jeitinho brasileiro» que estudió DaMatta.")
ch(W, 1, "Fiquei com a ___ atrás da orelha.",
   ["pulga", "mosca", "barata"], "pulga",
   "En portugués es una pulga: estar com a pulga atrás da orelha.")
ch(W, 1, "O apartamento no Leblon custa os ___ da cara.",
   ["olhos", "ojos", "olho"], "olhos",
   "custar os olhos da cara: los ojos, en plural.")
ch(W, 2, "Quem não tem cão caça com ___.",
   ["gato", "cachorro", "rato"], "gato",
   "Equivale a «a falta de pan, buenas son tortas».")
ch(W, 2, "É preciso levar ___ conta o custo da obra.",
   ["em", "na", "a"], "em",
   "«Tener en cuenta» se dice *levar em conta*: el verbo es *levar* (llevar) y *em conta* va sin artículo.")

cl(W, 0, "Vou tomar ___ e já desço.", "banho",
   "*Tomar banho* es «bañarse, ducharse», sin pronombre reflexivo: *vou tomar banho*.")
cl(W, 0, "O Rio me ___ (fazer, presente) muita falta.", "faz",
   "fazer falta = echar de menos: o Rio me faz falta.")
cl(W, 0, "Ela deu ___ luz em março.", "à",
   "dar à luz: a + a luz, con crase.")
cl(W, 0, "Não leve isso ___ sério.", "a",
   "levar a sério, sin artículo: a.")
cl(W, 1, "Hoje vou ficar de ___ em casa.", "boa",
   "*Ficar de boa* (coloquial) es «quedarse tranqui, sin hacer nada». *Ficar* reemplaza a «quedarse», sin pronombre.")
cl(W, 1, "Ele me deu um ___ e não apareceu.", "bolo",
   "*Dar um bolo* (coloquial) es «dejar plantado»: literalmente «dar una torta». *Levar um bolo* es quedar plantado.")
cl(W, 1, "Só depois caiu a ___.", "ficha",
   "*Cair a ficha* es «caer la ficha, darse cuenta», como en el Río de la Plata. El sujeto va detrás: *caiu a ficha*.")
cl(W, 1, "Paguei ___ cantando no karaokê.", "mico",
   "*Pagar mico* es «hacer el ridículo, pasar vergüenza»: *mico* es un monito. Registro coloquial.")
cl(W, 2, "De grão em grão, a galinha enche o ___.", "papo",
   "Refrán: *de grão em grão, a galinha enche o papo* (*papo* «buche»). Equivale a «de a poco se llega lejos».")
cl(W, 2, "Água mole em pedra dura, tanto bate até que ___.", "fura",
   "Refrán: *água mole em pedra dura, tanto bate até que fura* (*furar* «agujerear»). Equivale a «la gota horada la piedra».")
cl(W, 2, "A prefeitura prometeu tomar ___ (medidas).", "providências",
   "«Tomar medidas» se dice *tomar providências*: *providência* es «medida, disposición», no la providencia divina.")
cl(W, 2, "As partes chegaram ___ um acordo.", "a",
   "*Chegar a um acordo* es «llegar a un acuerdo», con la misma preposición *a*. *Chegar* siempre pide *a* (en el habla, *em*).")

tr(W, 0, "Insisto en pagar la cena.", "Faço questão de pagar o jantar.",
   ["Eu faço questão de pagar o jantar"],
   "fazer questão de = insistir en; la cena es o jantar.")
tr(W, 0, "Nadie se toma en serio la ley.", "Ninguém leva a lei a sério.",
   ["Ninguém leva a sério a lei"],
   "«Tomar en serio» se dice *levar a sério*, con *levar* y el complemento en medio: *leva a lei a sério*.")
tr(W, 0, "El Cristo cumplió 90 años en 2021.", "O Cristo fez 90 anos em 2021.",
   ["O Cristo Redentor fez 90 anos em 2021", "O Cristo completou 90 anos em 2021",
    "O Cristo Redentor completou 90 anos em 2021"],
   "fazer / completar anos, nunca «cumprir». El Cristo Redentor se inauguró en octubre de 1931.")
tr(W, 1, "Metí la pata con mi jefe.", "Pisei na bola com o meu chefe.",
   ["Pisei na bola com meu chefe", "Eu pisei na bola com o meu chefe", "Eu pisei na bola com meu chefe"],
   "«Meter la pata» se dice *pisar na bola*, con el verbo *pisar* y *na* (*em + a*). Registro coloquial.")
tr(W, 1, "Nos las arreglamos para entrar.", "A gente deu um jeito de entrar.",
   ["Demos um jeito de entrar", "Nós demos um jeito de entrar", "A gente deu um jeito para entrar",
    "Demos um jeito para entrar", "Nós demos um jeito para entrar"],
   "«Arreglárselas para» es *dar um jeito de* + infinitivo: *a gente deu um jeito de entrar*.")
tr(W, 1, "Me dejó plantado.", "Ele me deu um bolo.",
   ["Me deu um bolo", "Ela me deu um bolo"],
   "«Dejar plantado» es *dar um bolo* (coloquial): *ele me deu um bolo*. Quien queda plantado *leva um bolo*.")
tr(W, 2, "Hay que tener en cuenta el clima.", "É preciso levar em conta o clima.",
   ["É preciso levar o clima em conta", "Tem que levar em conta o clima",
    "É necessário levar em conta o clima", "É preciso levar em consideração o clima",
    "Temos que levar em conta o clima", "É preciso considerar o clima"],
   "«Tener en cuenta» es *levar em conta*; «hay que» se dice *é preciso*: *é preciso levar em conta o clima*.")
tr(W, 2, "Las partes llegaron a un acuerdo.", "As partes chegaram a um acordo.", [],
   "chegar a um acordo, igual que en español pero con acordo.")

fx(W, 0, "Amanhã eu cumpro 25 anos.", "cumpro", "faço", "falso_amigo",
   "«Cumplir años» se dice *fazer anos*: *amanhã eu faço 25 anos*. *Cumprir* es cumplir una promesa o una ley.", goodAlt=["completo"])
fx(W, 0, "Faz falta reservar mesa no sábado.", "Faz falta", "É preciso", "espanol",
   "«Hace falta + infinitivo» = é preciso; faz falta es echar de menos.",
   goodAlt=["É necessário"])
fx(W, 2, "É preciso ter em cuenta o orçamento.", "ter em cuenta", "levar em conta", "espanol",
   "«Tener en cuenta» es *levar em conta*: el verbo es *levar* y la palabra es *conta*, no *cuenta*.")
fx(W, 1, "Estou com a mosca atrás da orelha.", "mosca", "pulga", "espanol",
   "En portugués: estar com a pulga atrás da orelha.")

gd(W, 0, [["hacer una pregunta", "fazer uma pergunta"], ["hacer una fiesta", "fazer uma festa"],
          ["hacer ejercicio", "fazer exercício"]],
   "hacer falta (es necesario) → ___", "é preciso", "fazer falta",
   "El calco con fazer funciona muchas veces, pero no acá: «hace falta reservar» = é preciso reservar.")
gd(W, 0, [["cumplir una promesa", "cumprir uma promessa"], ["cumplir un plazo", "cumprir um prazo"],
          ["cumplir la ley", "cumprir a lei"]],
   "cumplir 30 años → ___", "fazer 30 anos", "cumprir 30 anos",
   "cumprir sirve para promesas, plazos y leyes, pero los años se hacen: fazer 30 anos.",
   alt=["completar 30 anos"])
gd(W, 0, [["dar un paseo", "dar um passeio"], ["dar una vuelta", "dar uma volta"], ["dar un abrazo", "dar um abraço"]],
   "dar a luz → ___", "dar à luz", "dar a luz",
   "dar à luz lleva crase: a (preposición) + a luz.")

sc(W, 0, ["tomar banho", "tomar café", "dar certo", "dar errado", "fazer questão", "levar a sério"],
   "¿Cómo conviene aprender estas combinaciones?",
   ["Enteras: el verbo no se deduce del español.",
    "Traduciendo cada palabra por separado.",
    "Cambiando el verbo por «fazer» cuando dudes."],
   "Enteras: el verbo no se deduce del español.",
   "Las colocaciones se memorizan en bloque: dar certo, no «salir bien».")
sc(W, 2, ["Quem não tem cão caça com gato.", "De grão em grão, a galinha enche o papo.",
          "Deus ajuda quem cedo madruga.", "Quem vê cara não vê coração.",
          "Água mole em pedra dura, tanto bate até que fura.", "A cavalo dado não se olham os dentes."],
   "¿Qué refrán equivale a «a falta de pan, buenas son tortas»?",
   ["Quem não tem cão caça com gato.", "Deus ajuda quem cedo madruga.", "Quem vê cara não vê coração."],
   "Quem não tem cão caça com gato.",
   "Si no tenés lo ideal, te arreglás con lo que hay.")

ty(W, 1, "Completá la expresión (meter la pata).", "pisar na ___", "bola",
   "pisar na bola.")
ty(W, 2, "Completá el refrán.", "Quem vê cara não vê ___.", "coração",
   "Las apariencias engañan.")

cb(W, 1, "DaMatta estudou o jeitinho. O jeitinho é uma forma de contornar as regras. (que)",
   "DaMatta estudou o jeitinho, que é uma forma de contornar as regras.",
   ["DaMatta estudou o jeitinho, uma forma de contornar as regras"],
   "El relativo que retoma o jeitinho. contornar = sortear.")
cb(W, 0, "O plano deu certo. Ninguém acreditava nele. (embora)",
   "O plano deu certo, embora ninguém acreditasse nele.",
   ["Embora ninguém acreditasse nele, o plano deu certo"],
   "embora + imperfeito do subjuntivo en un relato en pasado: acreditasse.")
cb(W, 2, "O governo tomou providências. Antes houve muitas reclamações. (depois que)",
   "O governo tomou providências depois que houve muitas reclamações.",
   ["Depois que houve muitas reclamações, o governo tomou providências"],
   "tomar providências = tomar medidas; houve, singular.")


# ===========================================================================
# Semana 51 — Revisão B2-C1
# parts: 0 futuro do subjuntivo, infinitivo pessoal, perfeito composto ·
# 1 contracciones, crase, regencia · 2 léxico y registro
# ===========================================================================
W = 51
ch(W, 0, "Quando você ___ ao Rio, me liga.",
   ["chegar", "chegue", "chega"], "chegar",
   "quando + futuro = futuro do subjuntivo: quando você chegar. Nunca «chegue».")
ch(W, 0, "Se eu ___, vou a Ouro Preto no feriado.",
   ["puder", "posso", "poder"], "puder",
   "se + futuro: futuro do subjuntivo (puderam → puder).")
ch(W, 0, "Assim que ___ o resultado, te aviso.",
   ["souber", "saber", "saiba"], "souber",
   "souberam → souber.")
ch(W, 0, "Trouxe o livro para vocês ___.",
   ["lerem", "ler", "leiam"], "lerem",
   "Infinitivo pessoal tras para, con sujeto propio: para vocês lerem.")
ch(W, 0, "É melhor nós ___ cedo.",
   ["sairmos", "sair", "saímos"], "sairmos",
   "é melhor + sujeto + infinitivo pessoal: nós sairmos.")
ch(W, 0, "Ultimamente ___ muito calor em São Paulo.",
   ["tem feito", "fez", "ha feito"], "tem feito",
   "Repetición hasta hoy: perfeito composto (tem feito = viene haciendo).")
ch(W, 1, "Vou ___ feira ___ oito.",
   ["à / às", "a / as", "à / as"], "à / às",
   "à feira (a + a) y às oito (a + as): las horas siempre con crase.")
ch(W, 1, "Moro ___ Tijuca.",
   ["na", "em a", "em"], "na",
   "*Morar em* + *a Tijuca* se contrae en *na Tijuca*; los barrios suelen llevar artículo. ✗*em a* no existe.")
ch(W, 1, "Ela namora ___ Rafa há dois anos.",
   ["o", "com o", "com"], "o",
   "namorar alguém, sin preposición en la norma. «namorar com» es regional.",
   prompt="Elegí la forma de la norma culta.")
ch(W, 1, "Ontem assistimos ___ show do Caetano.",
   ["ao", "o", "no"], "ao",
   "assistir a (= ver un espectáculo): ao show. En el habla se oye «assistimos o show».",
   prompt="Elegí la forma de la norma culta.")
ch(W, 2, "Deixei o carro na ___ para consertar o freio.",
   ["oficina", "escritório", "loja"], "oficina",
   "Falso amigo: *oficina* es el «taller mecánico», adonde se lleva el auto. La oficina es el *escritório*.")
ch(W, 2, "(Mail formal) ___ vagas disponíveis no curso?",
   ["Há", "Tem", "Têm"], "Há",
   "En lo escrito, haver existencial: há.")

cl(W, 0, "Quando vocês ___ (ir) a Salvador, provem o acarajé.", "forem",
   "foram → forem: futuro do subjuntivo de ir.")
cl(W, 0, "Se ___ (fazer) sol, vamos à praia.", "fizer",
   "fizeram → fizer.")
cl(W, 0, "Enquanto ___ (haver) samba, a gente fica.", "houver",
   "houveram → houver: enquanto + futuro.")
cl(W, 0, "É importante eles ___ (saber) a verdade.", "saberem",
   "Infinitivo pessoal con sujeto propio: eles saberem.")
cl(W, 0, "Eu ___ (estudar, perfeito composto) muito para o Celpe-Bras.", "tenho estudado",
   "*Ter* + participio (*tenho estudado*) es algo repetido que llega hasta hoy: «vengo estudiando». No equivale a «he estudiado».")
cl(W, 1, "Passei ___ orla de bicicleta.", "pela",
   "*Por* + *a orla* se contrae en *pela orla*: la contracción con *por* es obligatoria.")
cl(W, 1, "Refiro-me ___ (a + aquele) bar da Lapa.", "àquele",
   "La preposición *a* se funde con *aquele*: *àquele*, con *crase*. *Referir-se a* lo pide.")
cl(W, 1, "Penso muito ___ (em + a) minha família.", "na",
   "pensar em: em + a = na.")
cl(W, 1, "Sonhei ___ o mar de Arraial do Cabo.", "com",
   "«Soñar con» es *sonhar com*, con la misma preposición. Ojo con la grafía: *sonhar* lleva *nh*.")
cl(W, 2, "A ___ (viaje) foi longa.", "viagem",
   "a viagem, femenina.")
cl(W, 2, "Moramos numa rua ___ (ancha).", "larga",
   "Falso amigo: *largo/larga* es «ancho/a». «Largo» (longitud) se dice *comprido*.")
cl(W, 2, "(Formal) ___ (haver, perfeito) muitos protestos em 2013.", "Houve",
   "houve, singular.")

tr(W, 0, "Cuando llegues, llamame.", "Quando você chegar, me liga.",
   ["Quando chegar, me liga", "Quando você chegar, me ligue", "Quando chegar, me ligue",
    "Quando você chegar, liga pra mim", "Quando você chegar, liga para mim",
    "Quando você chegar, ligue para mim", "Quando chegares, liga-me"],
   "*Quando* con valor futuro pide futuro do subjuntivo: *quando você chegar*. En el habla, el imperativo con *você* va con pronombre delante: *me liga*.")
tr(W, 0, "Si podés, vení al ensayo de la Mangueira.", "Se você puder, venha ao ensaio da Mangueira.",
   ["Se puder, venha ao ensaio da Mangueira", "Se você puder, vem ao ensaio da Mangueira",
    "Se puder, vem ao ensaio da Mangueira", "Se você puder, venha para o ensaio da Mangueira",
    "Se puder, venha para o ensaio da Mangueira"],
   "Un *se* con valor futuro pide futuro do subjuntivo: *se você puder* «si podés». El español usa presente de indicativo.")
tr(W, 0, "Es bueno que salgamos temprano.", "É bom sairmos cedo.",
   ["É bom que saiamos cedo", "É bom a gente sair cedo", "É bom nós sairmos cedo"],
   "Infinitivo pessoal (sairmos) o que + subjuntivo (saiamos).")
tr(W, 0, "Vengo estudiando mucho.", "Tenho estudado muito.",
   ["Eu tenho estudado muito", "Ando estudando muito", "Venho estudando muito",
    "Eu ando estudando muito", "Eu venho estudando muito"],
   "«Venir + gerundio» (algo repetido hasta hoy) se dice *ter* + participio: *tenho estudado muito*.")
tr(W, 1, "Vamos a la playa a las tres.", "Vamos à praia às três.",
   ["Vamos à praia às três horas", "A gente vai à praia às três", "A gente vai à praia às três horas"],
   "à praia, às três: dos crases.")
tr(W, 1, "Conocí a João en la feria.", "Conheci o João na feira.",
   ["Eu conheci o João na feira", "Conheci João na feira", "Eu conheci João na feira"],
   "Sin a personal: conheci o João (o es artículo).")
tr(W, 2, "El dolor era fuerte.", "A dor era forte.",
   ["A dor estava forte"],
   "dor es femenino.")
tr(W, 2, "Hubo muchos problemas en la obra.", "Houve muitos problemas na obra.", [],
   "houve, singular; em + a = na.", prompt="Traducí al portugués formal.")

fx(W, 0, "Quando você chegue ao Rio, me avisa.", "chegue", "chegar", "futuro_subj",
   "quando + futuro: futuro do subjuntivo, quando você chegar.")
fx(W, 0, "Eu tenho estado em Lisboa uma vez.", "tenho estado", "estive", "perfeito_composto",
   "Una vez = perfeito simple: estive. tenho estado sería una acción repetida.")
fx(W, 1, "Visitei a meus avós em Niterói.", "a meus avós", "meus avós", "a_personal",
   "Sin a personal: visitei meus avós (o os meus avós).", goodAlt=["os meus avós"])
fx(W, 1, "Vou a praia amanhã cedo.", "a praia", "à praia", "crase",
   "*Ir a* + *a praia* lleva *crase*: *vou à praia*. Sin el acento grave, falta la preposición.")

gd(W, 0, [["falar", "quando eu falar"], ["comer", "quando eu comer"], ["abrir", "quando eu abrir"]],
   "fazer → ___", "quando eu fizer", "quando eu fazer",
   "En los regulares el futuro do subjuntivo coincide con el infinitivo; en los irregulares sale del perfeito: fizeram → fizer.")
gd(W, 0, [["ele", "para ele sair"], ["eu", "para eu sair"], ["você", "para você sair"]],
   "eles → ___", "para eles saírem", "para eles sair",
   "En singular el infinitivo pessoal no cambia, pero en plural sí: saírem.")
gd(W, 2, [["el libro", "o livro"], ["el vino", "o vinho"], ["el barco", "o barco"]],
   "el dolor → ___", "a dor", "o dor",
   "dor es femenino: a dor.")

sc(W, 0, ["Se eu for, te aviso.", "Quando ele vier, a gente sai.", "Assim que souber, ligo.",
          "Se você quiser, vamos.", "Enquanto houver sol, fico.", "Quando tiver tempo, leio Saramago."],
   "¿De dónde sale la forma del futuro do subjuntivo?",
   ["De la 3.ª plural del perfeito sin -ram (foram → for).",
    "Del infinitivo, siempre igual.",
    "Del presente del subjuntivo cambiando la vocal (seja → for)."],
   "De la 3.ª plural del perfeito sin -ram (foram → for).",
   "vieram → vier, souberam → souber, quiseram → quiser, tiveram → tiver.")
sc(W, 1, ["Vou à praia.", "Vou ao mercado.", "Chego às três.", "Refiro-me àquele bar.",
          "Vou a pé.", "Começou a chover."],
   "¿Cuándo hay crase?",
   ["Cuando se juntan la preposición «a» y el artículo «a» (o «aquele»).",
    "Siempre que hay una «a» antes de un sustantivo o de un verbo (a chover).",
    "Antes de verbos y masculinos."],
   "Cuando se juntan la preposición «a» y el artículo «a» (o «aquele»).",
   "Truco: si con un masculino queda ao, con el femenino va à.")

ty(W, 0, "Escribí el futuro do subjuntivo.", "se eu (ter) → se eu ___", "tiver",
   "tiveram → tiver.")
ty(W, 2, "Escribí cómo se dice «oficina» (lugar de trabajo) en Brasil.", "___", "escritório",
   "La oficina es o escritório; oficina es el taller.")

cb(W, 0, "Vocês vão chegar. Eu vou sair antes. (antes de + infinitivo pessoal)",
   "Vou sair antes de vocês chegarem.",
   ["Antes de vocês chegarem, vou sair", "Eu vou sair antes de vocês chegarem",
    "Antes de vocês chegarem, eu vou sair"],
   "antes de + sujeto + infinitivo pessoal: antes de vocês chegarem.")
cb(W, 0, "Você vai ter tempo. Leia Grande Sertão: Veredas. (quando)",
   "Quando você tiver tempo, leia Grande Sertão: Veredas.",
   ["Quando tiver tempo, leia Grande Sertão: Veredas", "Leia Grande Sertão: Veredas quando você tiver tempo",
    "Quando você tiver tempo, lê Grande Sertão: Veredas", "Leia Grande Sertão: Veredas quando tiver tempo"],
   "quando + futuro do subjuntivo: tiver.")
cb(W, 2, "Havia muita gente. Conseguimos entrar. (embora)",
   "Embora houvesse muita gente, conseguimos entrar.",
   ["Conseguimos entrar, embora houvesse muita gente", "Embora houvesse muitas pessoas, conseguimos entrar",
    "Conseguimos entrar embora houvesse muitas pessoas"],
   "embora + imperfeito do subjuntivo en pasado: havia → houvesse.")
