# -*- coding: utf-8 -*-
"""Las consignas de los ejercicios, en portugués (auditoría v3, P1).

El Celpe-Bras es todo en portugués: el candidato lee el enunciado, la
pregunta y las opciones en la lengua meta.  Un alumno que en la semana 52
todavía lee «Elegí la forma correcta» nunca practicó leer una consigna en
portugués.  Por eso build_course.py cambia la consigna (`prompt`) según la
semana del ítem:

  - desde la semana CORTE_SIMPLES (14), las consignas simples de SIMPLES
    (Complete. Escolha a forma correta. Traduza para o português.);
  - desde la semana CORTE (27), todas las de PT.

La explicación (`note`) queda en castellano: es la regla, y la regla se
entiende mejor en la lengua del alumno.  La consigna original queda en
`prompt_es` (la usa quien quiera mostrar las dos).

Cómo están escritas:
  - con *você* implícito y el imperativo de la norma escrita (Complete,
    Escolha, Traduza, Encontre), como en los enunciados del Celpe-Bras;
  - las de respuesta escrita (`typed`) como pregunta o con «Complete»,
    nunca con «Escreva»: la primera vez que aparece, el ejercicio se
    muestra con botones (drills.js, reconocimiento), y «Escreva» con botones
    no tiene sentido;
  - las palabras entre «» se conservan tal cual: drills.js toma de ahí las
    opciones que la consigna nombra;
  - el castellano que la consigna cita (la palabra que hay que traducir)
    sigue en castellano y entre «».

Una consigna nueva de un ítem de la semana 27 en adelante tiene que estar
en PT: build_course.py lo avisa (y falla con --strict).
"""

CORTE_SIMPLES = 14
CORTE = 27

# Las simples: las que un A2 lee sin esfuerzo y que se repiten cientos de
# veces (desde la 14).
SIMPLES = {
    "Elegí la forma correcta.": "Escolha a forma correta.",
    "Traducí al portugués.": "Traduza para o português.",
    "Completá.": "Complete.",
    "Mirá los tres ejemplos y completá el cuarto.": "Veja os três exemplos e complete o quarto.",
    "Leé las frases y descubrí la regla.": "Leia as frases e descubra a regra.",
    "Encontrá el error: tocá lo que está mal y corregilo.": "Encontre o erro: toque no que está errado e corrija.",
    "Encontrá el error: tocá la palabra que está mal y corregila.": "Encontre o erro: toque na palavra errada e corrija.",
    "Uní las frases en una sola usando el conector entre paréntesis.": "Junte as frases numa só, com o conector entre parênteses.",
    "Completá con la forma correcta del verbo entre paréntesis.": "Complete com a forma correta do verbo entre parênteses.",
    "Completá con de + artículo.": "Complete com de + artigo.",
}

# Todas (desde la 27).  Incluye las simples.
PT = dict(SIMPLES)
PT.update({
    # --- examen (semana 52)
    "Completá con una sola palabra o con la forma pedida del verbo entre paréntesis.":
        "Complete com uma só palavra ou com a forma pedida do verbo entre parênteses.",
    "Reescribí la frase manteniendo el sentido: escribí solo lo que falta en el hueco.":
        "Reformule a frase sem mudar o sentido: complete só o que falta na lacuna.",
    "Formá la palabra.": "Forme a palavra.",
    "Formá la palabra pedida a partir de la que está en la base.":
        "Complete com a palavra pedida, formada a partir da palavra-base.",
    "Elegí el equivalente en el registro pedido.": "Escolha o equivalente no registro pedido.",
    "Elegí la palabra que forma la combinación usual en portugués.":
        "Escolha a palavra que forma a combinação usual em português.",
    "Elegí el significado correcto (ojo con el español).":
        "Escolha o significado correto (cuidado com o espanhol).",
    # --- semanas 14-26 (no se muestran en portugués: quedan por si se adelanta el corte)
    "Mirá los tres ejemplos (imperfeito, eu) y completá el cuarto.": "Veja os três exemplos (imperfeito, eu) e complete o quarto.",
    "Mirá los tres ejemplos (comparativo) y completá el cuarto.": "Veja os três exemplos (comparativo) e complete o quarto.",
    "Mirá los tres ejemplos (ter + participio) y completá el cuarto.": "Veja os três exemplos (ter + particípio) e complete o quarto.",
    "Mirá los tres ejemplos (voz pasiva) y completá el cuarto.": "Veja os três exemplos (voz passiva) e complete o quarto.",
    "Mirá los tres ejemplos (subjuntivo) y completá el cuarto.": "Veja os três exemplos (subjuntivo) e complete o quarto.",
    "Mirá los tres ejemplos y completá el cuarto con el modo correcto.": "Veja os três exemplos e complete o quarto com o modo correto.",
    "Mirá los tres ejemplos y armá el cuarto.": "Veja os três exemplos e monte o quarto.",
    # --- semanas 27-51
    "Mirá los tres ejemplos (quando eu…, futuro do subjuntivo) y completá el cuarto.":
        "Veja os três exemplos (quando eu…, futuro do subjuntivo) e complete o quarto.",
    "Escribí el futuro do subjuntivo (eu) de «querer».": "Qual é o futuro do subjuntivo (eu) de «querer»?",
    "Escribí el futuro do subjuntivo (eles) de «vir» (venir).": "Qual é o futuro do subjuntivo (eles) de «vir»?",
    "Mirá los tres ejemplos (se nós…, imperfeito do subjuntivo) y completá el cuarto.":
        "Veja os três exemplos (se nós…, imperfeito do subjuntivo) e complete o quarto.",
    "Escribí el imperfeito do subjuntivo (eu) de «trazer».": "Qual é o imperfeito do subjuntivo (eu) de «trazer»?",
    "Escribí el imperfeito do subjuntivo (nós) de «ser».": "Qual é o imperfeito do subjuntivo (nós) de «ser»?",
    "Escribí el infinitivo pessoal (nós) de «ser».": "Qual é o infinitivo pessoal (nós) de «ser»?",
    "Escribí el infinitivo pessoal (eles) de «pôr».": "Qual é o infinitivo pessoal (eles) de «pôr»?",
    "Elegí la forma que se usa en el habla.": "Escolha a forma que se usa na fala.",
    "Completá como se dice en el habla (imperfeito en lugar del condicional).":
        "Complete como se diz na fala (imperfeito no lugar do futuro do pretérito).",
    "Mirá los tres participios y completá el cuarto (para «teria…», «tivesse…»).":
        "Veja os três particípios e complete o quarto (para «teria…», «tivesse…»).",
    "Escribí el participio de «dizer».": "Qual é o particípio de «dizer»?",
    "Escribí el participio de «abrir».": "Qual é o particípio de «abrir»?",
    "Pasá al discurso indirecto: elegí la forma correcta.": "Passe para o discurso indireto: escolha a forma correta.",
    "Mirá cómo se reportan los tres ejemplos y completá el cuarto.":
        "Veja como os três exemplos são relatados e complete o quarto.",
    "Escribí cómo cambia «amanhã» en el discurso indirecto (en otro día).":
        "Em que se transforma «amanhã» no discurso indireto (contado em outro dia)?",
    "Escribí cómo cambia «hoje» en el discurso indirecto (en otro día).":
        "Em que se transforma «hoje» no discurso indireto (contado em outro dia)?",
    "Elegí la forma correcta para el cartel.": "Escolha a forma correta para o cartaz.",
    "Completá el cartel con la pasiva con se.": "Complete o cartaz com a passiva com se.",
    "Completá como en el habla (você genérico).": "Complete como na fala (você genérico).",
    "Completá como en el habla (a gente).": "Complete como na fala (a gente).",
    "Mirá cómo pasan al plural los tres carteles y completá el cuarto.":
        "Veja como os três cartazes vão para o plural e complete o quarto.",
    "Escribí el cartel: «Se venden terrenos».": "Como fica o cartaz «Se venden terrenos» em português?",
    "Escribí el cartel: «Se necesita ayudante».": "Como fica o cartaz «Se necesita ayudante» em português?",
    "Elegí la forma de la escritura formal.": "Escolha a forma da escrita formal.",
    "Elegí cómo se dice en el habla de Brasil.": "Escolha como se diz na fala do Brasil.",
    "Uní verbo y pronombre en registro formal.": "Junte verbo e pronome no registro formal.",
    "Completá como en el habla de Brasil.": "Complete como na fala do Brasil.",
    "Texto formal. Encontrá el error: tocá la palabra que está mal y corregila.":
        "Texto formal. Encontre o erro: toque na palavra errada e corrija.",
    "Mirá las tres uniones y completá la cuarta.": "Veja as três junções e complete a quarta.",
    "Uní verbo y pronombre (formal).": "Junte verbo e pronome (registro formal).",
    "Uní con mesóclise (formal).": "Junte com mesóclise (registro formal).",
    "Elegí el conector correcto.": "Escolha o conector correto.",
    "Elegí el significado.": "Escolha o significado.",
    "Completá con el conector adecuado (en paréntesis, el sentido).":
        "Complete com o conector adequado (entre parênteses, o sentido).",
    "Mirá los tres pares español → portugués y completá el cuarto.":
        "Veja os três pares espanhol → português e complete o quarto.",
    "Escribí en portugués «sin embargo» en dos palabras.": "Como se diz «sin embargo» em português, em duas palavras?",
    "Escribí en portugués «por cierto / es más» en una palabra.": "Como se diz «por cierto / es más» em português, numa palavra só?",
    "Elegí la forma de la norma culta.": "Escolha a forma da norma culta.",
    "Completá con la preposición (contraída con el artículo si hace falta).":
        "Complete com a preposição (contraída com o artigo, se for preciso).",
    "Completá con la palabra que falta (preposición o artículo).":
        "Complete com a palavra que falta (preposição ou artigo).",
    "Escribí la preposición que pide «casar».": "Que preposição o verbo «casar» pede?",
    "Escribí la preposición que pide «pensar».": "Que preposição o verbo «pensar» pede?",
    "Elegí: ¿con crase o sin crase?": "Escolha: com crase ou sem crase?",
    "Completá con a, à, às o ao.": "Complete com a, à, às ou ao.",
    "Mirá los tres pares masculino → femenino y completá el cuarto.":
        "Veja os três pares masculino → feminino e complete o quarto.",
    "Escribí la forma correcta: a, à, as o às.": "Qual é a forma correta: a, à, as ou às?",
    "Uní: a + aquilo.": "Junte: a + aquilo.",
    "Mirá los tres perfeitos (ele) y completá el cuarto.": "Veja os três perfeitos (ele) e complete o quarto.",
    "Mirá los tres presentes (eu) y completá el cuarto.": "Veja os três presentes (eu) e complete o quarto.",
    "Escribí el perfeito (ele) de «supor».": "Qual é o perfeito (ele) de «supor»?",
    "Escribí el presente (eu) de «medir».": "Qual é o presente (eu) de «medir»?",
    "Elegí la opción adecuada para el registro formal.": "Escolha a opção adequada ao registro formal.",
    "Escribí la forma reducida del habla.": "Complete com a forma reduzida da fala.",
    "Escribí la forma plena del registro formal.": "Complete com a forma plena do registro formal.",
    "Carta formal. Encontrá el error de registro: tocá la palabra que está mal y corregila.":
        "Carta formal. Encontre o erro de registro: toque na palavra inadequada e corrija.",
    "Mirá las tres reducciones del habla y completá la cuarta.": "Veja as três reduções da fala e complete a quarta.",
    "Escribí la reducción de «para o».": "Como se reduz «para o» na fala?",
    "Escribí en una palabra «¿dónde está?» (habla).": "Como se diz «onde está?» numa palavra só, na fala?",
    "Escribí el infinitivo pessoal (nós) de «ir».": "Qual é o infinitivo pessoal (nós) de «ir»?",
    "Escribí el conector formal de una palabra que empieza con «c» y significa «sin embargo».":
        "Qual é o conector formal de uma palavra, com «c» inicial, que significa «sin embargo»?",
    "Elegí la forma de la norma escrita.": "Escolha a forma da norma escrita.",
    "Escribí el sustantivo, con artículo, que corresponde al verbo.": "Qual é o substantivo, com artigo, que corresponde ao verbo?",
    "Escribí la forma de «haver» de la norma culta.": "Qual é a forma de «haver» da norma culta?",
    "Elegí la forma natural en una charla.": "Escolha a forma natural numa conversa.",
    "Elegí la equivalencia.": "Escolha a equivalência.",
    "Escribí el mais-que-perfeito simples (3.ª persona singular).": "Qual é o mais-que-perfeito simples (3.ª pessoa do singular)?",
    "Escribí el mais-que-perfeito simples (1.ª persona plural).": "Qual é o mais-que-perfeito simples (1.ª pessoa do plural)?",
    "Elegí la versión desarrollada.": "Escolha a versão desenvolvida.",
    "Escribí el gerundio.": "Qual é o gerúndio?",
    "Escribí el participio corto, concordado.": "Qual é o particípio curto, com a concordância?",
    "Escribí el cierre formal estándar de un mail en Brasil.": "Qual é o fecho formal padrão de um e-mail no Brasil?",
    "Escribí la abreviatura de «Vossa Senhoria».": "Qual é a abreviatura de «Vossa Senhoria»?",
    "Escribí el diminutivo.": "Qual é o diminutivo?",
    "Escribí el sustantivo abstracto.": "Qual é o substantivo abstrato?",
    "Escribí la palabra portuguesa para «taza».": "Qual é a palavra portuguesa para «taza»?",
    "Escribí el verbo portugués para «empujar» (infinitivo).": "Qual é o verbo português para «empujar» (infinitivo)?",
    "Elegí la forma del portugués europeo.": "Escolha a forma do português europeu.",
    "Elegí la forma más natural en Brasil.": "Escolha a forma mais natural no Brasil.",
    "Elegí la grafía brasileña actual.": "Escolha a grafia brasileira atual.",
    "Traducí al portugués de Portugal.": "Traduza para o português de Portugal.",
    "Traducí al portugués de Brasil.": "Traduza para o português do Brasil.",
    "Escribí la palabra de Portugal para «ônibus».": "Qual é a palavra de Portugal para «ônibus»?",
    "Escribí la palabra carioca para «mandioca».": "Qual é a palavra carioca para «mandioca»?",
    "Escribí el conector de conclusión que significa «en suma».": "Qual é o conector de conclusão que significa «en suma»?",
    "Escribí el subjuntivo de «ser» (3.ª persona).": "Qual é o subjuntivo de «ser» (3.ª pessoa)?",
    "Escribí la expresión portuguesa de «o sea».": "Qual é a expressão portuguesa para «o sea»?",
    "Escribí la preposición.": "Complete com a preposição.",
    "Elegí la versión formal.": "Escolha a versão formal.",
    "Elegí la versión coloquial.": "Escolha a versão coloquial.",
    "Traducí al portugués formal.": "Traduza para o português formal.",
    "Traducí al portugués coloquial de Brasil.": "Traduza para o português coloquial do Brasil.",
    "Escribí la palabra formal para «grana».": "Qual é a palavra formal para «grana»?",
    "Escribí la forma formal de «cadê».": "Qual é a forma formal de «cadê»?",
    "Elegí la forma natural en Brasil.": "Escolha a forma natural no Brasil.",
    "Completá la expresión (meter la pata).": "Complete a expressão (meter la pata).",
    "Completá el refrán.": "Complete o provérbio.",
    "Escribí el futuro do subjuntivo.": "Qual é o futuro do subjuntivo?",
    "Escribí cómo se dice «oficina» (lugar de trabajo) en Brasil.":
        "Como se diz «oficina» (lugar de trabalho) no Brasil?",
    # --- las consignas de los ítems nuevos (colocações, marcadores, atos de fala)
    "Elegí la palabra que forma la combinación usual.": "Escolha a palavra que forma a combinação usual.",
    "Elegí la respuesta adecuada.": "Escolha a resposta adequada.",
    "Elegí la opción más adecuada a la situación.": "Escolha a opção mais adequada à situação.",
})


_PT_VALUES = set(PT.values())


def consigna(prompt, week):
    """La consigna que ve el alumno en la semana `week`."""
    w = int(week)
    if w >= CORTE and prompt in PT:
        return PT[prompt]
    if w >= CORTE_SIMPLES and prompt in SIMPLES:
        return SIMPLES[prompt]
    return prompt


def falta(prompt, week):
    """True si la consigna tendría que estar en portugués y no está en la tabla."""
    return int(week) >= CORTE and prompt not in PT and prompt not in _PT_VALUES and not _ya_pt(prompt)


def _ya_pt(prompt):
    # una consigna escrita directamente en portugués (los ítems nuevos)
    import re
    return bool(re.match(r"^(Complete|Escolha|Traduza|Encontre|Veja|Leia|Junte|Qual|Como|Que|Em que|Passe|Reformule)\b", prompt))
