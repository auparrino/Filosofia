# Auditoría semanal: semana por semana, ejercicio por ejercicio, idioma por idioma

Fecha: 2026-09-29 · Versión auditada: v1.55 (`38d98e6`) · Alcance: 52 semanas + material transversal (banco de frases, errores, léxico, transferencia, escenas, textos de la interfaz).

## 1. Resumen

- **Estado de las capas automáticas:** `npm test` en verde; `check_lessons` (1.442 controles) y `check_letture` sin errores; `lint.js` marca 144 casos, todos falsos positivos didácticos (formas erradas a propósito como *aprito*, *dyelato*, fragmentos como *-isc-*).
- **Revisión nativa** (un revisor por semana y 10 lotes transversales, luego verificación independiente de los 167 «errores» reportados): **123 confirmados o parcialmente confirmados y 44 rechazados** (26 % de falsos positivos en la categoría «error»); a esos 123 se suma `esit:9`, hallado por el último lote y verificado a mano, para un total de **124**.
- **Veredicto por semana:** 44 «bien con reparos», 8 «necesita trabajo» (1, 6, 8, 41, 42, 43, 49, 50). Ninguna semana «bien» sin reparos.
- **Lo que está bien:** los bancos son sólidos: los 10 lotes transversales (≈3.600 frases, errores, entradas léxicas, escenas y ~900 textos de interfaz) dieron «bien» o «bien con reparos», con muy pocos errores duros; **0 inglés visible confirmado**. Los errores reales son puntuales (una nota, una glosa, un `accept` incompleto), no sistémicos.
- **Lo que está mal:** (a) errores puntuales de **notas y glosas en español** (28 confirmados, el idioma con más fallas), (b) **respuestas aceptadas incompletas o incorrectas** y ejercicios ambiguos (56), (c) **reglas absolutas o falsas** en teoría y notas (27), (d) **desajuste entre lo que la lección enseña y lo que los ejercicios exigen** en casi todas las semanas.
- **Lo que se puede mejorar (lo más importante):** ver sección 6.

### Por idioma (solo hallazgos confirmados tras verificación)

| Idioma / tipo | Confirmados | Comentario |
|---|---|---|
| Italiano (`it`) | 13 | Sobre todo en textos de lectura (*w-42, w-48, w-49, fl-gerundio*) y en `accept` de ítems del banco. |
| Español (`es`) | 28 | Glosas y notas falsas o mal formuladas (*stagionato = estacionado*, *negozio = negocio*, notas de pares mínimos). |
| Inglés (`en`) | 0 | Los hallazgos de inglés eran la etiqueta `chapterTitle` de las sfide («The subjunctive»…): **la app no la muestra** (usa solo el número de capítulo). Sin inglés visible confirmado. |
| Reglas / contenido (`regla`) | 27 | Reglas absolutas («nunca condizionale después de *se*»), notas fonéticas (*zucchero, pranzo* con [ts] en vez de [dz]), pares mínimos que no existen. |
| Diseño de ejercicio (`ejercicio`) | 56 | `accept` faltantes, opciones con dos respuestas válidas, consignas ambiguas, ítems de suoni con audio idéntico. |

## 2. Método y límites (leer antes de usar los datos)

1. Se armó un dossier por semana (teoría, ejercicios, lectura, dictogloss, suoni) y se auditó con un revisor por semana; el material sin semana (banco, léxico, escenas, interfaz) en 10 lotes. Cada «error» pasó por un **verificador independiente** que lo confirmó, lo redujo o lo rechazó.
2. **Defecto del método, corregido en el análisis:** el dossier atribuyó los desafíos (*sfide*) por el campo `challenge.week` (semana de muestreo del jefe) y no por `weeks[].challenges` (donde realmente se sirven). Por eso los reportes semanales dicen cosas como «las 20 sfide de la semana 1 son de B1-C1»: **es falso** (la semana 1 no tiene sfide). Los hallazgos de *contenido* de esas sfide siguen valiendo; los de *ubicación* se reemplazan por la medición de la sección 5.
3. Los ítems se atribuyeron a la primera semana que los lista; por eso algunos reportes dicen «solo 2 ítems» en semanas 40-51 cuando en realidad esas semanas trabajan sobre todo con ítems de sfide (Routledge) reutilizados. Cifras reales por semana: sección 5.
4. Los «dudas» y «mejoras» **no** fueron verificadas (los revisores estimaron 15-40 % de falsos positivos): tomarlas como candidatas a revisar, no como defectos.
5. No se ejecutó la app en un navegador ni se escuchó el audio: las observaciones de suoni son de texto y notas.

## 3. Errores confirmados

### 3.1 Italiano (13)

| Dónde | Id | Problema | Corrección recomendada | Estado |
|---|---|---|---|---|
| Sem 9 | `p-084` | «venne» tiene una sola pronunciación (é cerrada); «vènne» no existe. El glosario está invertido (marca vénne como inexistente) y written idéntico en ambas. | P("p-084", "vocali", 9, "vénti", "vènti", "veinte", "vientos", VOC, ["venti", "venti"]), | confirmado |
| Sem 19 | `suoni p-091` | «volgo» (volgere y el pueblo) lleva /ɔ/ en ambos casos; no hay oposición ó/ò y las formas de audio son idénticas. | Reemplazar por un par real, p. ej. P("p-091","vocali",19,"cólto","còlto","culto","recogido (p. p. de cogliere)",VOC,["colto","colto"]) | confirmado |
| Sem 20 | `vocab:volentieri` | Real (menor): el ejemplo se extrae mecánicamente del stem de s:r21-02:a (sin mayúscula ni coma) y se muestra en minúscula, sin coma y sin sujeto; aparece también para «appuntamento». El stem de la sfida tampoco lleva coma. | ESEMPI["volentieri"] = "Verrei volentieri, ma ho un appuntamento." (y stem: «___ volentieri, ma ho un appuntamento. (venire – io)») | confirmado |
| Sem 22 | `lettura fl-combinati` | La frase es incoherente: en el texto Martín solo tiene el diccionario y la profesora ofrece dejarle sus apuntes; «se li ha ancora» (usted los tiene) no tiene sentido; lo natural es «se li ho ancora». Ligera ambigüedad si Martín hubiera prestado apuntes, pero e | E gli appunti del corso, se li ho ancora, glieli lascio volentieri. | parcial |
| Sem 23 | `item c1-comp-04` | «Ha» (3.ª) con «sembri» (2.ª): no concuerdan. (Además «di quanto non + congiuntivo» se ve en sem. 23 antes del congiuntivo, pero para 2.ª sg. la forma coincide con el indicativo.) | stem="Hai più soldi ___ non sembri." | confirmado |
| Sem 25 | `a-023` | La palabra es desìdero /deˈzidero/ (acento en «si»); ninguna de las opciones ofrecidas es correcta. | { id: "a-023", week: 25, say: "desìdero", answer: "desìdero", options: ["desìdero", "dèsidero"], es: "deseo (yo)", note: "de-SÌ-de-ro: esdrújula con el acento en la segunda sílaba (desìdero), no en la primera.", fake: true } | confirmado |
| Sem 41 | `item g2-ct-55` | Lo + ho exige elisión obligatoria: «lo ho» es incorrecto. | Quitar alt=["Lo ho visto uscire dall'ufficio"] | confirmado |
| Sem 42 | `lettura w-42` | «prima la sera» no es italiano. | …di tornare a casa prima di sera e ha provato… | confirmado |
| Sem 44 | `lettura fl-gerundio` | «essendo le tre di notte» es causal con sujeto distinto (contradice la regla del gerundio) y el sentido es concesivo. | Lei risponde subito, pur essendo le tre di notte a Buenos Aires | confirmado |
| Sem 48 | `lettura w-48` | «a lui» dislocado exige la retoma con «gli»; lo natural y la regla de la semana es «non gliel'ho mai detto». | Ma questo, a lui, non gliel'ho mai detto. | confirmado |
| Sem 49 | `lettura w-49` | «la cui durata si prevede di due settimane» es agramatical. | la cui durata è prevista in due settimane | confirmado |
| Sem 52 | `item ex-cl-10` | «si risparmi» es agramatical; con «pur + gerundio» va indicativo. | ___ lavorando da casa si risparmia tempo, si rischia di isolarsi. | confirmado |
| Sem 52 | `item ex-rg-08` | El destino es registro formal (Lei) pero el stem usa «trovi» (tu); la forma de cortesía es «trova». | (informale) Te lo mando insieme alla mail → (formale) Lo trova ___ | confirmado |

### 3.2 Español (28)

| Dónde | Id | Problema | Corrección recomendada | Estado |
|---|---|---|---|---|
| Transv. errori-2 | `errore:392` | Para un rioplatense «cartera» es el bolso de mujer (borsa) y «billetera» es portafoglio; la nota es peninsular/mexicana. El ejercicio sirve (portafoglio es correcto), pero la nota confunde. | Nota: «Cartera» es falso amigo: en España/México es billetera (portafoglio); en Argentina es el bolso de mujer (borsa). Cartella = carpeta o mochila escolar. Agregar «la borsa» a las respuestas aceptadas si no es contexto inequívoco. | parcial |
| Transv. frasi-banca-2 | `frase:671` | «Hartarse = stufarsi» es equivalencia válida, pero el es dice «me cansé»; la nota nombra otro verbo. Problema menor. | Cansarse (de) = stufarsi / stancarsi (hartarse = stufarsi, con más fastidio). | parcial |
| Transv. lessico-2 | `parole:0` | «en el médico» no es español natural; dal medico = a lo del médico / al consultorio. «al médico» sí es aceptable. | da + il. Dal medico = al médico / en lo del médico. | parcial |
| Transv. lessico-2 | `parole:1` | «o sino» no es traducción de «oppure»; corresponde «o bien». | ("oppure", "o / o bien", "congiunzione", "A2", "") | confirmado |
| Transv. transfer-1 | `esit:9` | «Estuve» es solo de estar; lo que se comparte es «stato» en italiano. | Estuve = sono stato. En italiano essere y stare comparten el participio (stato). | confirmado |
| Sem 1 | `lesson:block:1` | La columna «Suena» usa «che, chi» para ce/ci y la fila siguiente usa «che, chi» como grafía (suena ke, ki); la advertencia «che se lee ke, nunca che» tampoco ayuda. Ambigüedad real, aunque el sonido de ce/ci sí es «ch» de chico. | Fila ce, ci → Suena: «ch de chico (tʃe, tʃi)»; fila che, chi → «k de queso (ke, ki)». Warn: «*che* y *chi* suenan «ke», «ki», no «che», «chi»; *ce, ci* sí suenan «che, chi».» | parcial |
| Sem 2 | `p-011` | Sin coma, «si no cambia mucho el sentido» se lee al revés de lo que se quiere decir. | Un clásico: «ho trent'anni» con doble n; si no, cambia mucho el sentido. | confirmado |
| Sem 5 | `lettura ep2` | «estacionado» no es glosa válida de stagionato (en rioplatense estacionado = parqueado; el motivo del revisor sobre «aparcado» es incorrecto, pero la glosa igual es mala). Idéntico problema en letture_settimana.js:330. | stagionato: "curado, añejado" (en letture_settimana.js: stagionato: "curado") | confirmado |
| Sem 7 | `s:r07-03:d` | La nota sugiere que existe un «ustedes» formal en plural; en rioplatense «ustedes» es único. Confunde (mismo texto en la nota de la letra b). | «Ustedes» es «voi» (en plural no hay distinción formal/informal). | confirmado |
| Sem 10 | `p-085` | messe (mésse, cosecha) es singular; la glosa plural «cosechas» es incorrecta. La otra (mèsse = misas, plural de messa) está bien. | P("p-085", "vocali", 10, "mésse", "mèsse", "cosecha", "misas", VOC, ["messe", "messe"]) | confirmado |
| Sem 11 | `g2-gd-12` | «Nací» es pretérito simple, sin auxiliar; la comparación con haber es falsa. | ... En castellano «nacido» es regular y «he nacido» va con haber: acá cambian las dos cosas (essere y concordancia: nata/nato). | confirmado |
| Sem 11 | `p-046` | Errata: «dello» en lugar de «detto». | Los participios detto, fatto, letto, scritto llevan doble. | confirmado |
| Sem 12 | `l2-c-87` | Nota truncada: «*Porsi a no» es ininteligible. | Ponerse a + infinitivo → mettersi a + infinitivo. «Porsi a + infinitivo» no existe; y sin pronombre, «mettere» significa poner algo (no ponerse a). | confirmado |
| Sem 20 | `lettura w-20` | «Ristorante al mare» = frente/junto al mar; «en el mar» sugiere dentro del agua. Cambiar opción y respuesta. | ["¿Qué quiere hacer Marco?", ["abrir un restaurante frente al mar", ...], "abrir un restaurante frente al mar"] | confirmado |
| Sem 23 | `suoni a-022` | fàcile es sdrucciola (tónica en la 1ª de 3 sílabas) pero «fácil» en español es llana: la comparación es falsa. | note: «Esdrújula (sdrucciola): FÀ-ci-le, aunque en español «fácil» sea llana.» | confirmado |
| Sem 27 | `a-024` | La nota describe la palabra equivocada: la respuesta es casìno (llana, lío) y la nota habla de casinò (aguda). | note: "Llana: ca-SÌ-no = lío, desorden. La aguda con acento escrito es casinò (el casino de juego)." | confirmado |
| Sem 35 | `lettura w-35` | «Estacionado» es calco; en rioplatense «estacionar» es aparcar. Mismo problema en la pregunta. (letture.js:56 tiene «estacionado, curado»: conviene quitar «estacionado».) | stagionato: "madurado, curado"; pregunta: "¿Cuánto tiempo madura como mínimo?" | confirmado |
| Sem 37 | `item rf2-37-01` | Es un error de tipeo: el patrón enseñado es 1-3-6 (io, lui, loro: nacqui, nacque, nacquero); mismo «1-3-3» en un comentario de conjugator.js. | nascere, irregular en el patrón 1-3-6: nacqui, nascesti, nacque, nascemmo, nasceste, nacquero. | confirmado |
| Sem 42 | `vocab pregare` | La glosa de la lista de vocab de la semana 42 dice solo «rezar», pero el ejemplo «Ti prego, non dirlo a nessuno» es «rogar»; el banco ya tiene «rezar / rogar». | ["pregare","rogar / rezar","Ti prego, non dirlo a nessuno."] | confirmado |
| Sem 42 | `vocab ringraziati` | «Agradecidos» en español es adjetivo (grateful); el participio de «li ho ringraziati» es «(los) agradecí»/«a quienes se agradeció». Error real pero menor. | "ringraziati": ("agradecidos (part. de ringraziare: «los agradecí»)", "A2") | parcial |
| Sem 45 | `item g2-va-63` | «Tardar» personal es metterci (ci metto due ore), no volerci; la nota contradice otras lecciones (s2.py:548, s4.py:374, lessico2.py:397). Volerci = hacer falta / llevar (tiempo, impersonal). | Hacer falta / llevar (tiempo) = volerci, con ci obligatorio y concordado: ci vuole un'ora, ci vogliono due ore. Tardar (una persona) = metterci: ci metto due ore. | confirmado |
| Sem 45 | `item rf-46-01` | «vosotros» es peninsular; el curso es rioplatense (vos/ustedes). | Imperativo de andarsene: vattene (vos), andatevene (ustedes). | confirmado |
| Sem 46 | `item d03-056` | «Mariíta» no es grafía española estándar; además la glosa es confusa. | Mariita, con cariño (Maria + -uccia) → ___ (mejor: «María, en diminutivo cariñoso (Maria + -uccia) → ___») | confirmado |
| Sem 48 | `item rf-48-22` | «Al vino lo trajo Luca» es agramatical en español (objeto inanimado no lleva «a») y contradice la nota. | stem: "El vino lo trajo Luca."; note: "El objeto dislocado va al principio y lo retoma un pronombre átono: il vino l'ha portato Luca." | confirmado |
| Sem 50 | `lettura w-50` | «salsa» existe en italiano; para pasta 'sugo' es lo habitual, pero presentarlo como falso amigo es exagerado; el episodio enseña un matiz, no un error. | in un negozio ha chiesto una "salsa" per la pasta: in italiano per la pasta si dice "sugo" (salsa indica quelle fredde o da condimento); o sustituir por un falso amigo real (p. ej. «burro»). | parcial |
| Sem 50 | `lettura w-50` | «salsa» existe en italiano con el mismo sentido (no es falso amigo); el relato es inválido y 'sugo' no lo corrige. Además «negozio: negocio» engaña (negozio = tienda). | targets: ["imbarazzata", "largo"]; reescribir el episodio de salsa con un falso amigo real (p. ej. «burro» = manteca, no el animal) y ajustar gloss/questions/vf; negozio: «tienda». | confirmado |
| Sem 52 | `item ex-fp-20` | En castellano «famoso» también lleva s simple: el contraste no existe. | Sufijo -oso: famoso. Igual que en castellano. | confirmado |
| Sem 52 | `lettura w-52` | «agio» = comodidad/holgura, no «gusto». | agio: "comodidad (a suo agio = cómoda)" | confirmado |

### 3.3 Reglas y contenido (27)

| Dónde | Id | Problema | Corrección recomendada | Estado |
|---|---|---|---|---|
| Transv. lessico-1 | `nomi:0` | appartamento tiene pp pero una sola t; la nota enseña ortografía falsa. | «Doble p: appartamento (una sola t).» | confirmado |
| Sem 1 | `asc-1-10` | La doble nn no es la ñ; la nota contradice la regla gn=ñ. Solo hay parentesco etimológico. | anno = año (con doble n; sin la doble, «ano» es otra palabra). Ojo: la ñ del español se escribe gn en italiano (bagno). | confirmado |
| Sem 2 | `p-173` | La nota es confusa: «chena» en italiano se lee [kena]; como respelling castellano de [tʃena] induce a error. El par cena/chena es válido como par mínimo, lo malo es la nota. | ce = [tʃe] (como «che» en castellano); che = [ke]: «cena» ≠ «chena» (se lee «kena»). | parcial |
| Sem 3 | `lesson:9` | El criterio «islas chicas/grandes» es falso: Cuba es mayor que Sicilia y Cerdeña. Se repite en ar-u-10 (nota). | Muchas islas van sin artículo (*Malta*, *Cuba*, *Capri*); otras lo llevan: *la Sicilia*, *la Sardegna*. Se memorizan. | confirmado |
| Sem 6 | `item d07-066` | «essere un Cincinnato» = honesto no es expresión corriente (viene del Dummies fuente) y es léxico muy alto para A1; el ítem aparece en semanas 6, 13 y 52. | stem: «Ella está sin un peso. (essere al verde)»; answer/accept: «Lei è al verde.» / «È al verde.» | parcial |
| Sem 6 | `item l2-c-44` | La nota dice que «cola» en italiano es el pegamento: falso, el pegamento es «colla» (con ll). | Hacer la cola → fare la fila (o fare la coda). «Cola» no existe con ese sentido en italiano: el pegamento es «colla» y la cola de un animal es «coda». | confirmado |
| Sem 6 | `item l2-c-63` | «Gettare un'occhiata» es italiano correcto; el ítem tiene dos opciones válidas y la nota es falsa. | options=["dare","mettere","fare"]; note="Echar un vistazo → dare un'occhiata a (fórmula fija; «gettare un'occhiata» también existe, pero es menos corriente)." | confirmado |
| Sem 6 | `item l2-c-65` | «io e mio fratello» es el orden habitual, pero «mio fratello e io» es gramatical; el «no» es demasiado tajante. | Llevarse bien → andare d'accordo. Y fijate: lo más natural es «io e mio fratello» (aunque «mio fratello e io» también es correcto). | parcial |
| Sem 6 | `suoni c-006` | «consonante simple» es falso: bel gruppo, bel trono, bel tipo; las excepciones son s+consonante, z, gn, ps, x. | bello → bel delante de consonante (salvo s + consonante, z, gn, ps, x): un bel giorno, un bel gruppo. | confirmado |
| Sem 8 | `lesson:4` | La regla es absoluta y falsa para sí/no (el propio bloque 0 dice «Marco è a casa?»); vale como tendencia con interrogativos (Dove abita Marco?), no siempre (Perché Marco non viene? es normal). | Con un interrogativo, el sujeto explícito suele ir **después del verbo**, al final (Dove abita Marco?); ponerlo antes (Perché Marco non viene?) también es normal. | confirmado |
| Sem 8 | `lesson:intro` | En italiano la preposición también va delante de la pregunta (Con chi esci?), igual que en castellano; la diferencia es falsa para hispanohablantes. | Preguntar en italiano es casi igual que en castellano: sin inversión ni auxiliar. Cambian sobre todo algunas formas fijas (qual è, come mai, che cosa). | confirmado |
| Sem 12 | `a-014` | La regla es falsa/engañosa: en lontano, americano, italiano la vocal de -ano sí puede ser la tónica; lo correcto es que pàrlano es esdrújula. | PÁR-la-no: en la 3ª persona plural el acento cae en la antepenúltima sílaba. | confirmado |
| Sem 12 | `p-113` | zucchero es /ˈdzukkero/ (z sonora, como dozzina [ddz] en p-108); [ts] es incorrecto en estándar, y la doble c no es el contraste (igual en ambos miembros). | «[dz] (sonora) en zucchero; en succhero la s- es otro sonido. La doble c es igual en las dos.» | confirmado |
| Sem 17 | `item g2-ct-17` | «di mio amico» es agramatical (amico lleva artículo) y contradice g2-va-02; la nota lo declara «aceptable». | Quitar alt=["Questo libro è di mio amico Paolo"]; note: quitar la última frase. | confirmado |
| Sem 17 | `item g2-ct-17` | La alt sin artículo («di mio amico») es incorrecta, no «menos natural»; amico no es pariente. | Quitar la alt/accept «Questo libro è di mio amico Paolo» y la última frase de la nota; poner: «…Sin artículo («di mio amico») es incorrecto.» | confirmado |
| Sem 19 | `s:r19-08:c` | Cambiare → cambierà conserva la i (cambi-erà); lo que cambia es a→e. La nota dice lo contrario. | Cambiare → cambierà (a → e; la i se conserva: cambi-erà; solo -ciare/-giare/-sciare pierden la i). | confirmado |
| Sem 20 | `s:r26-04:d` | Correcto que la nota es engañosa: andavano (imperfetto) no equivale a «tendrían que haber sido» (condicional compuesto); expresa obligación en el pasado. Aunque el imperfetto modal sí se usa para «debería haber sido», la glosa/nota es incoherente. | Consigna: «Le finestre ___ pulite. (había que limpiarlas)»; nota: «Imperfecto de andare = obligación en el pasado: andavano pulite = había que limpiarlas / debían limpiarse.» | parcial |
| Sem 20 | `suoni p-057` | Falso: sarei y avrei llevan una sola r; solo vorrei tiene rr. | Doble r en vorrei (también verrei, berrei); sarei y avrei llevan una sola r. | confirmado |
| Sem 20 | `suoni p-170` | Duplica p-057 (mismo par vorrei/vorei, semana 20) y la nota generaliza mal: solo algunos verbos llevan rr (verrei, terrei, berrei, rimarrei; no dovrei ni avrei). | Eliminar p-170, o reemplazar por P("p-170","vibranti",20,"sera","serra","tarde/noche","invernadero","Una r o dos cambian la palabra: sera / serra.") | confirmado |
| Sem 21 | `lesson:2:warn` | «Sì, vado domani» es gramatical y frecuente; ci es natural pero no obligatorio. «suena incompleto» y «en italiano, sí» exageran. | warn: «Sin *ci* la frase también es correcta, pero en italiano es más habitual retomar el lugar ya nombrado: *sì, ci vado domani*.»; en r cambiar «en italiano, sí» por «en italiano es más habitual» | confirmado |
| Sem 24 | `suoni p-119` | En el estándar (DOP) pranzo lleva [dz] tras n; [ts] es variante del norte. La nota es inexacta aunque no grave. | [dz] tras n en pranzo (estándar; en el norte se oye también [ts]). | parcial |
| Sem 27 | `p-095` | En italiano estándar cóppa (o cerrada) = nuca/salume; còppa (o abierta) = copa/trofeo. Las glosas están invertidas. | P("p-095", "vocali", 27, "cóppa", "còppa", "nuca", "copa (trofeo)", VOC, ["coppa", "coppa"]) | confirmado |
| Sem 28 | `lesson:1` | «siempre al principio» es demasiado absoluto y contradice g2-cb-02 (acepta 'Non sono uscito, siccome pioveva'). Aparece en dos lugares. | *siccome* (como) suele ir al principio de la oración; y en la tabla: «siccome suele ir al principio». | confirmado |
| Sem 30 | `suoni p-187` | Estándar: qui = [kwi] (u semiconsonante), cui = [kui] (u vocal). La nota dice [kui] para ambos y anula el contraste. | "qui = [kwi] (la u es semiconsonante, una sola sílaba); cui = [kui] (la u es vocal, más marcada)." | confirmado |
| Sem 37 | `lesson:2` | «dare» también cambia de raíz en tú/nosotros/vosotros (desti, demmo, deste) y stare (stesti, stemmo, steste); pero el bloque enseña 1-3-6 y esas formas son más bien terminaciones regulares con raíz irregular. Corregir la frase «único irregular entero» que es i | *essere* es irregular entero (*fui, fosti, fu, fummo, foste, furono*). *dare* y *stare* cambian de raíz en todas las personas: *diedi/detti, desti, diede/dette, demmo, deste, diedero/dettero*; *stetti, stesti, stette, stemmo, steste, stettero*. | parcial |
| Sem 47 | `item rf2-47-05` | «mezzo» concuerda: un'ora e mezza, due ore e mezza; solo es mezzo con masculino. | un chilo e mezzo; después de «e», mezzo/mezza concuerda con lo contado: un chilo e mezzo, due ore e mezza, una pizza e mezza. | confirmado |
| Sem 52 | `item ex-cl-51` | «Per la prima volta da vent'anni» existe y es corriente; la nota «no se usa da» es demasiado categórica (aunque con passato remoto «dopo/in» son preferibles). Conviene aceptar «da» y suavizar. | accept/alt: agregar «da»; nota: «Lo más natural: «dopo vent'anni» o «in vent'anni»; «da vent'anni» también se usa.» | parcial |

### 3.4 Ejercicios (respuestas, opciones, consignas) (56)

| Dónde | Id | Problema | Corrección recomendada | Estado |
|---|---|---|---|---|
| Transv. frasi-banca-2 | `frase:404` | «buenísimo» no se traduce con «bellissimo» y la nota habla de «lindo». | es: «Fue un viaje lindísimo.» | confirmado |
| Sem 1 | `d07-*` | Es un hueco de cobertura, no un error: en los 73 ítems de la semana 1 no hay «abbiamo» ni «ho ragione»/«ho voglia di» como respuesta (hanno sí: d07-018, d07-020; ho voglia sí: d07-033). Baja prioridad. | Opcional: agregar un conjugate «Noi ___ una casa grande.» → abbiamo, y un translate «Tengo razón.» → Ho ragione. | parcial |
| Sem 1 | `lesson:block:0` | El ítem citado está bien (signore/gn). El hallazgo real es válido: el 'fare'/tema de la semana 1 (saludos ciao/buongiorno/arrivederci, tu/Lei, deletrear) casi no aparece en la lección (ciao 1 vez, sin buongiorno/arrivederci/Lei/nombres de letras). | Agregar un bloque a la lección de la semana 1 con saludos (ciao/buongiorno/arrivederci), tu vs Lei, mi chiamo y nombres de las letras (a, bi, ci, di...) con un par de preguntas, o ajustar 'fare'/'tema' a lo que sí se enseña. | parcial |
| Sem 2 | `lesson:*` | El fare de la semana 2 es c'è/ci sono y 9+ ítems lo evalúan, pero los 7 bloques de la lección no lo enseñan (solo una mención al pasar en la semana 1: «Hay = c'è / ci sono»). | Agregar bloque «Decir qué hay»: *c'è* + singular (C'è una lavagna), *ci sono* + plural (Ci sono tre sedie); negación *non c'è / non ci sono*; «hay» es invariable en español, en italiano concuerda con lo que hay; error típico: «ci sono molta gente» → *c'è molta | confirmado |
| Sem 2 | `p-174` | Es audio TTS de pares mínimos: «cuesto» se lee [kwesto], igual que «questo», así que no hay contraste audible. Además la nota dice [ku] (mal). | P("p-174", "altro", 2, "questo", "chesto", "este", "(no existe)", "qu = [kw]: «questo», nunca «kesto».") | confirmado |
| Sem 3 | `vocab:ragazzo` | El ejemplo de la palabra de la semana 3 es una lista de sintagmas pegados (respuesta de un ejercicio de artículos tomada automáticamente); se ve en 'Palabras de la semana'. | ESEMPI['ragazzo'] = 'Il ragazzo è simpatico.' | confirmado |
| Sem 5 | `item d06-057` | «Termino.» (terminare) es equivalente natural de «Finisco.»; el prompt no fija el verbo. | alt: ["Io finisco.", "Termino.", "Io termino."] | confirmado |
| Sem 5 | `item d06-065` | Terminare es sinónimo natural de finire y «terminan» se traduce con ambos; hoy solo se aceptan finiscono. | Agregar a alt/accept: «Cominciano ma non terminano.», «Loro cominciano ma non terminano.», «Iniziano ma non terminano.», «Loro iniziano ma non terminano.» | confirmado |
| Sem 6 | `item l2-c-57` | «Il rumore fa fastidio a mia nonna» es correcto y muy frecuente (fare/dare fastidio); dos opciones válidas, solo se acepta «dà». | options=['dà','ha','mette'] (reemplazar «fa») | confirmado |
| Sem 6 | `lettura w-06` | Para volver a la propia casa se dice tornare/rientrare; «viene a casa» es poco natural en tercera persona (narrador en Torino). Es cambio inocuo. | Il pomeriggio torna a casa stanca, ma la sera esce con gli amici. | confirmado |
| Sem 6 | `lettura w-06` | El texto solo dice que mañana debe trabajar temprano; que 'no puede quedarse hasta tarde' es inferencia no escrita y Sara acepta ir al cine. Pregunta mal planteada. | ["¿Qué tiene que hacer Sara mañana?", ["trabajar temprano", "estar enferma", "ir al cine con Laura", "quedarse en casa"], "trabajar temprano"] | parcial |
| Sem 6 | `sfida r19-03b` | Solo vale lo menor: el passato prossimo de «Hanno chiuso» es el estímulo ya enseñado (sem. 19 es posterior a passato prossimo) y el futuro sí se enseña en esa semana; pero la consigna dice «se usa el presente» y el item a acepta «Allora andrò a trovarla.», inc | Quitar «Allora andrò a trovarla.» de alt (o cambiar la consigna a «se usa el presente; el futuro también se oye»). | parcial |
| Sem 8 | `l2-d-03` | «Magari è l'influenza» = quizás sea la gripe es natural; hay dos respuestas válidas y la nota es falsa. | Cambiar el distractor «magari» por «purtroppo» (options: forse, purtroppo, meno male) y nota: «Forse» = quizás; «purtroppo» y «meno male» valoran, no dudan. (Alternativa: accept también «magari».) | confirmado |
| Sem 9 | `l2-c-38` | «Por el centro» se dice naturalmente «per il centro»; falta en las alternativas. | alt agregar "Facciamo una passeggiata per il centro" | confirmado |
| Sem 10 | `l2-c-58` | «Questa musica mi fa fastidio» es igual de correcta y muy frecuente; hoy solo se acepta dà/da. | accept: ["dà", "da", "fa"]; note: «Mi dà fastidio / mi fa fastidio = me molesta. Se acepta «da» sin acento, pero lo correcto es «dà».» | confirmado |
| Sem 11 | `g2-gd-23` | Sin sujeto, «è andato» es igualmente correcto y se marcaría mal; los lead son en 1ª persona (ho), pero el enunciado no lo fija. | alt=["è"] (o stem: «andare → (io) ieri ___ andato al cinema») | confirmado |
| Sem 12 | `s:r12-02:f` | «Nessuno ha visto…?» significa «¿Nadie vio…?» (pregunta sesgada, polaridad negativa); no traduce «¿Alguien vio…?» y la sfida practica qualcuno en preguntas. | alt: ["Ha visto qualcuno i miei occhiali?"] (sacar «Nessuno ha visto i miei occhiali?») | confirmado |
| Sem 15 | `item g2-sc-08-c` | Sin sujeto sirven las 6 personas del imperfetto; solo se aceptan dormivo/dormiva/dormivamo. | alt=["dormiva","dormivamo","dormivi","dormivate","dormivano"] (o stem «Mentre io ___ (dormire)…») | confirmado |
| Sem 15 | `item s:r20-01c:e` | «Mi è piaciuto molto» (el viaje) es igual de natural y hoy no está en accept. | Agregar a alt/accept: «L'anno scorso sono andato in Corsica. Mi è piaciuto molto.», con andata, con coma y con moltissimo. | confirmado |
| Sem 16 | `r26-02b (s:r26-02b:c)` | Con objeto singular «si mette la TV» es formalmente ambiguo (pasivante/impersonal); la clave del libro dice pasivante, pero por la forma no se decide. Vale también para f («si dice ragazzi»). | Cambiar a «Dove si mettono le valigie?» (passivante) o aceptar ambas y aclarar que en singular es ambiguo | parcial |
| Sem 18 | `lettura fl-mica` | Martín nunca dice que no quiere pagar: dice «non ho mica soldi» y paga Giulia; la pregunta presupone algo que el texto no dice (la respuesta correcta habla de plata). | ¿Por qué Martín no puede pagar hoy? | confirmado |
| Sem 19 | `s:r07-01i:c` | Con ha el clítico la se elide: «l'ha ancora mandata»; «non la ha» no es estándar y se enseñaría como válido. | accept: ["l' / mandata"] | confirmado |
| Sem 20 | `g2-sc-16-b` | «Vorrei un tavolo per due» es natural y correcto; el stem no fija sujeto, así que dos opciones valen. | stem: «(Noi) ___ un tavolo per due, per favore.» (o reemplazar el distractor «Vorrei» por «Vuole») | confirmado |
| Sem 21 | `suoni c-028` | Con «say» por audio, «Me ne vado» y «Mene vado» suenan igual; solo difieren por escrito (mala opción para discriminar). | options: ["Me ne vado.","Ne me vado.","Me ne vago."] | confirmado |
| Sem 22 | `item g2-sc-12` | En «dámelo» (da+me+lo) el indirecto va primero también en castellano; el distractor es falso y confunde. | «Primero el directo y después el indirecto: «lo me», «lo gli».» | confirmado |
| Sem 22 | `sfide r20-06:d` | Con verbo reflexivo con essere y objeto nominal pospuesto (Angelo, ti sei messo la giacca) el participio concuerda con el sujeto; «messa» no es estándar. La nota enseña mal. | answer «o / a», sin alt; note: «Con reflexivo el participio concuerda con el sujeto (messo); con la delante, con el objeto (me la sono messa).» | confirmado |
| Sem 23 | `item rf-22-10` | «Oggi Sabato» se lee 'hoy sábado'; el apellido queda ambiguo. | Ernesto Sabato è ___ famoso di Borges. | confirmado |
| Sem 23 | `sfide:r28-01` | Consigna dice «sin preposición» pero c (fare meglio a/ad), f (obbligato a) y h (credo di) llevan preposición. (Se muestra en semana 42.) | Traducí al italiano (verbos seguidos de infinitivo, con o sin preposición). | confirmado |
| Sem 24 | `item c1-cong-05` | «Si dice che è molto brava» es estándar; hay dos opciones válidas (sia y è). | stem="Non credo che ___ molto brava."; note="Con «non credo che» (duda) va congiuntivo: sia." | confirmado |
| Sem 28 | `item g2-cb-02` | La lección de semana 28 dice que siccome va «siempre al principio» y la nota del ítem dice lo mismo, pero accept admite «Non sono uscito, siccome pioveva». | alt=["Siccome pioveva non sono uscito."] (quitar la variante con siccome al final) | confirmado |
| Sem 29 | `s:r24-02b:b` | La consigna pide congiuntivo passato; «Forse è già partito» (indicativo) contradice el objetivo y la propia nota. | Quitar de accept "Forse è già partito." ("Può darsi che sia partito già." es gramatical y puede quedar). | confirmado |
| Sem 30 | `item d22-020` | Gramatical pero forzado: insistere que expresa voluntad y pide imperfetto (scrivessi); con avessi scritto solo cabe leerlo como «sostener que ya había escrito». | stem: «Lui sosteneva che io gli ___ (avere/scrivere).» (answer avessi scritto) | parcial |
| Sem 30 | `item g2-ct-40` | «Quería» es ambiguo (yo/él); voleva che venissi con me es traducción igualmente correcta y no se acepta. | accept/alt: agregar «Voleva che venissi con me», «Voleva che tu venissi con me» (y «Lui voleva…»/«Lei voleva…»). | confirmado |
| Sem 30 | `item g2-ct-41` | «Pensaba que era» es ambiguo (yo/él); la 3ª persona es igual de correcta y hoy se marcaría mal. | alt: ["Credevo che fosse più difficile", "Pensavo fosse più difficile", "Pensava che fosse più difficile", "Credeva che fosse più difficile", "Pensava fosse più difficile"] | confirmado |
| Sem 32 | `g2-sc-17-c` | Con sapere el modo normal es indicativo (avevano); 'avessero' no es la única respuesta y contradice la lección. | stem: «Credevo che loro ___ (avere) un figlio.», answer avessero, note «Credevo → avessero.» | confirmado |
| Sem 33 | `w-33` | La consigna del hunt enumera los targets exactos (foste, fossi, avessi, comandassi): se resuelve sin leer. | label: «Tocá los verbos de las condiciones con «se»» | confirmado |
| Sem 34 | `p-188` | «cuale» suena idéntico a «quale» [ˈkwale]: no es par mínimo auditivo y la nota no distingue nada. | Reemplazar por un par audible, p. ej. P("p-188","altro",34,"che","ce","que","(no existe)","che = [ke]; ce = [tʃe].") | confirmado |
| Sem 35 | `item c1-pass-04` | Hay sentencia con el «si»: es un cloze con oración, así que «no hay oración» es falso. Pero la consigna «Reescribí» no corresponde a un cloze, y el ítem aparece en la semana 35 (voce passiva) cuando el si passivante se enseña en la 36 (tag wk=5 también incorre | prompt: «Completá con el verbo en la forma del «si passivante».»; mover a la semana 36 (o quitarlo de la 35). | parcial |
| Sem 35 | `item c1-pass-05` | El ítem (si impersonale) está en topic «passivo» y se sirve en la semana 35, aunque «Si passivante e si impersonale» se enseña en la 36 (donde también está). Es un desajuste de ubicación, no un error de contenido. | Cambiar topic a "si impersonale" (o darle w=36) para que solo aparezca desde la semana 36. | parcial |
| Sem 35 | `item c1-pass-06` | Evalúa si passivante, enseñado en semana 36; en semana 35 solo hay remisión. El tópico 'passivo' lo manda a 35. | Cambiar topic a 'si impersonale' (semana 36) o asignar w=36 para que no salga en la semana 35. | confirmado |
| Sem 35 | `sfide r26-03` | La lección de la semana 35 no menciona rimanere (0 apariciones), y la consigna lo exige. «è rimasta distrutta» es idiomático (estado resultante) aunque matiza el sentido; no hay que sacar el verbo. | Agregar a la lección de w35: «rimanere + participio = estado resultante: è rimasta distrutta, siamo rimasti stupiti»; mantener el ejercicio. | parcial |
| Sem 36 | `suoni c-043` | [diche] es una transcripción para hispanohablantes («che» = /tʃe/, como en c-029), no IPA; pero el distractor «Si diche» la confunde y los corchetes sugieren IPA. | note: "dice = «DÍ-che» (c ante e suena como «ch»); si (impersonal) sin acento." | parcial |
| Sem 37 | `item g2-sc-21-c` | «divenne» es forma correcta y frecuente del passato remoto de diventare; hoy se marcaría mal. | accept=["diventò", "divenne"] | confirmado |
| Sem 37 | `s:r02-11:a` | La pista (di/dell' – di/del) contradice la respuesta 'd' / di'. | (d'/dell' – di/del) | confirmado |
| Sem 38 | `dictogloss 38` | El título dice telefonata pero el texto (y el es) cuentan un encuentro casual. | title: "Un incontro con Paola" | confirmado |
| Sem 42 | `lettura w-42:q3` | La opción correcta es ambigua ("finge no oír si sigue corriendo") y el distractor «sigue corriendo» no se puede descartar con el texto (nunca se dice si sigue). | ["¿Qué pasa en marzo?", ["su esposa le pregunta si sigue corriendo y él finge no oír", "anuncia que corre todos los días", "vuelve a fumar", "empieza guitarra"], "su esposa le pregunta si sigue corriendo y él finge no oír"] | confirmado |
| Sem 44 | `c1-part-04` | Con «si è lavata le mani» el participio concuerda con el sujeto; «lavate» con objeto pospuesto no es estándar y la propia nota dice que concuerda con el sujeto. | answer 'ta', alt=[] y accept ['ta'] | confirmado |
| Sem 45 | `item g2-cb-38` | El participio assoluto no se enseña en ninguna lección (0 menciones) y no encaja en «Costruzioni verbali speciali». Su tema natural es la semana 44 (Gerundio e participio); el desajuste de 'conector' es cosmético. | Cambiar a w=44 y agregar el participio assoluto (partito il treno...) a la lección de la semana 44; o retirar el ítem. | parcial |
| Sem 45 | `item rf-46-18` | «infischiarsene» no está en la lección ni en las keys de la semana 45 (solo en glosario). | Agregar infischiarsene (di) a la lista de pronominales de la lección semana 45 (y keys), p. ej. «infischiarsene: no importarle nada». | confirmado |
| Sem 45 | `suoni c-049` | «Non ce la faccio più» tiene 5 palabras; answer "6" es incorrecta (cf. c-042 cuenta palabras). | answer: "5"; note: "non / ce / la / faccio / più: cinco palabras; ce la faccio son tres." | confirmado |
| Sem 46 | `item d03-060` | La palabra pedida es correcta pero la derivación indicada es falsa: prenotazione = prenotare (pre-+notare) + -zione, no pre- + notazione. | stem: «reserva (notare + prefijo pre- + sufijo -zione) → ___» | parcial |
| Sem 50 | `item b2-idio-04` | Sin contexto, «Ha freddo oggi» y «È freddo oggi» también son gramaticales; hay más de una opción válida. | prompt="Elegí la forma correcta (tiempo atmosférico)."; stem="Oggi ___ freddo." (o consigna «Hoy hace frío») | confirmado |
| Sem 52 | `item ex-cl-02` | «un lavoratore ogni cinque» es natural y correcto; la nota se contradice (marca * algo que existe). Se acepta «su» como respuesta preferida pero debería aceptarse «ogni». | accept: ["su", "ogni"]; nota: «uno su cinque» = uno de cada cinco (también «uno ogni cinque»). Error típico: *uno di cinque. | parcial |
| Sem 52 | `sfida g2-va-12` | goodAlt ya incluye «Neanche io» y «Nemmeno io» (el fixerr se califica con good/goodAlt, no con accept). Falta «Neppure io» (y «Neanche a me»). | goodAlt: ["Neanche io", "Nemmeno io", "Neppure io", "Neanche a me", "Nemmeno a me"] | parcial |
| Sem 52 | `sfida s:r11-01b:h` | «Ci mancherebbe» = «faltaba más / de nada», no expresa rechazo; contradice «Per carità». «Ma figurati» sí puede rechazar y puede quedar. | Quitar «Ci mancherebbe» de accept | confirmado |
| Sem 52 | `sfida s:r27-06b:b` | La consigna dice que solo e y f admiten varias respuestas y la nota enseña «fagli» con objeto; «Fallo» contradice la regla enseñada. | alt: [] (solo «Fagli») | confirmado |

## 4. Semana por semana

«Errores confirmados» = confirmados o parciales tras verificación. «Dudas» = sin verificar. Detalle completo por semana en la sección 7.

| Sem | Nivel | Tema | Veredicto | Errores confirmados | Dudas | Mejora principal |
|---|---|---|---|---|---|---|
| 1 | A1 | Suoni e ortografia | necesita trabajo | 4 | 12 | Agregar teoría y práctica de lo prometido en «fare/tema»: nombres de las letras (a, bi, ci, di…), ciao/buongiorno/buonasera/arrivederci, mi chiamo, tu vs Lei con essere (Lei è). |
| 2 | A1 | Nomi: genere e numero | bien con reparos | 4 | 5 | Agregar a la lección un bloque de c'è / ci sono (afirmativa, negativa, concordancia con el sustantivo, contraste con «hay») con 3-4 ejemplos del aula. |
| 3 | A1 | Articoli determinativi e indeterminativi | bien con reparos | 2 | 14 | Corregir el criterio de las islas («chicas/grandes») en lesson:9, ar-u-10/11 y s:r02-08:e; y completar la receta de fusión para il/i (nel, dei) en lesson:12. |
| 4 | A1 | Aggettivi qualificativi | bien con reparos | 0 | 14 | Añadir a la lección bloques cortos sobre: plurales en -co/-ca/-go/-ga, molto (adverbio invariable vs adjetivo) y avere + anni/caldo, o mover esos ítems a otra semana. |
| 5 | A1 | Presente indicativo: verbi regolari | bien con reparos | 3 | 20 | Reubicar o eliminar los 27 ítems l2-c-* (avere/essere, prendere, mettere, portare) y sustituirlos por práctica del tema real: más ítems de -isc-, io/tu/voi, y oraciones en contexto |
| 6 | A1 | Presente indicativo: verbi irregolari | necesita trabajo | 9 | 19 | Crear ítems para stare + gerundio (sto leggendo, cosa stai facendo, stiamo cenando) y para la no diptongación (posso/puedo, dormo/duermo, penso/pienso): cloze, choice y fixerr. |
| 7 | A2 | Numeri, date e ora | bien con reparos | 1 | 13 | Completar el tema declarado: días y meses, estaciones y precios, con 6-8 ítems que incluyan mes y precios. |
| 8 | A2 | Domande e interrogativi | necesita trabajo | 3 | 21 | Reescribir/eliminar el bloque «sujeto al final» y los ítems d11-002..010: enseñar que en sí/no el sujeto se queda antes del verbo y que con interrogativo puede ir después; aceptar ambas formas |
| 9 | A2 | Preposizioni di base | bien con reparos | 2 | 20 | Agregar a la lección un bloque de preposiciones articuladas (tabla di/a/da/in/su × il, lo, la, l', i, gli, le) con 3 ejemplos y el aviso «per/tra/con no se funden» |
| 10 | A2 | Pronomi personali | bien con reparos | 2 | 10 | Agregar ítems (recuperar los que faltan si el dossier está truncado: parts declara 84+32 y hay 41) de producción en frase para tónicos (Chiamo te, non lui; Vieni con me?), enclíticos con infinitivo (voglio chiamarti / ti voglio ch |
| 11 | A2 | Passato prossimo | bien con reparos | 3 | 20 | Rebalancear los 126 ítems: hoy ~35 son de pronombres (d16-021..040, g2-out-pro) y ~12 de participios «garden» repiten los verbos de d16-001..010 (fare, leggere, scrivere, prendere, vedere, aprire, dire). Reducir duplicados y liber |
| 12 | A2 | Riflessivi e imperativo | bien con reparos | 4 | 9 | Crear ejercicios para el bloque 5 (dammi, dimmi, fallo, vacci, dagli) y para el bloque 4 (Lei: reconocer Scusi/Senta/Mi dica/Si accomodi, con el pronombre delante). |
| 13 | A2 | BOSS — Livello A2 | bien con reparos | 0 | 4 | Agregar bloque de preposiciones (a/di/da/in/su/per/con + preposiciones articuladas, y a/da con lugar y persona) a la hoja de repaso. |
| 14 | A2 | Piacere e verbi simili | bien con reparos | 0 | 10 | Agregar un bloque de lección y 6-8 ítems para el 'fare' de la semana: invitar (Ti va di...? / Vuoi venire...?), aceptar (Volentieri, Certo, Con piacere) y rechazar (Mi dispiace, non posso, Non mi va), con verbos de hobbies/deporte |
| 15 | A2 | Imperfetto e il contrasto con il passato prossimo | bien con reparos | 2 | 9 | Agregar 10-15 ítems de contraste imperfetto/passato prossimo: choice/cloze con mentre/quando, marcadores (sempre, ogni giorno, ieri, un giorno, all'improvviso), un fixerr de cada tipo y un texto con huecos (racconto). |
| 16 | A2 | Riflessivi al passato | bien con reparos | 1 | 12 | Añadir un mini-bloque de teoría sobre reflexivos en imperfetto vs passato prossimo, o quitar el imperfetto de los ítems d17-011..020. |
| 17 | A2 | Dimostrativi, possessivi, indefiniti | bien con reparos | 2 | 12 | Corregir g2-ct-17: quitar «di mio amico Paolo» de accept y reescribir la nota. |
| 18 | A2 | Negazioni ed esclamazioni | bien con reparos | 1 | 7 | Agregar ítems propios de la semana (unos 8-10): mica (cloze/choice), né… né, non… che = solo (comprensión), non… ancora vs non… più, niente/nulla, nessuno vs nessun, y un typed/cloze de producción con la posición de mai. |
| 19 | B1 | Futuro semplice e anteriore | bien con reparos | 3 | 7 | Rebalancear los ítems propios: bajar los 19 cloze regulares seguidos a ~8 y agregar choice/cloze de raíces irregulares (andare, venire, volere, dovere, potere, rimanere, bere), futuro anteriore (más de 5) y suposición. |
| 20 | B1 | Condizionale presente | bien con reparos | 6 | 16 | Agregar al bloque «Las formas» dos apartados: ortografía (-care/-gare → cher-/gher-, -ciare/-giare pierden i, -iare) y raíces irregulares (andr-, dovr-, potr-, vedr-, vivr-, sapr-, verr-, berr-, rimarr-, dar-/far-/star-), con cont |
| 21 | B1 | Le particelle NE e CI | bien con reparos | 2 | 24 | Corregir la regla «ci obligatorio» (lesson:2) y los ítems/notas que la repiten (g2-ct-25, g2-sc-11), aceptando «Sì, vado domani». |
| 22 | B1 | Pronomi combinati | bien con reparos | 3 | 10 | Agregar a la lección un bloque sobre «ne» (partitivo y di+sustantivo: ne ho, ce ne sono, ce n'è, me ne occupo) y su concordancia con el participio (ne ho comprati tre). |
| 23 | B1 | Comparativi e superlativi | bien con reparos | 4 | 16 | Alinear el tema con los contenidos: 'Ropa, colores, talles' no aparece en ningún ítem ni en la lectura. Incluir ítems y lectura con prendas, talles y precios (più largo, meno caro, la taglia più piccola). |
| 24 | B1 | Congiuntivo presente: forme | bien con reparos | 2 | 11 | Alinear los ítems con lo enseñado: mover c1-cong-05/07/08/09 a la semana 25 o agregar un bloque breve de disparadores (credo che, spero che, voglio che, bisogna che). |
| 25 | B1 | Congiuntivo: quando si usa | bien con reparos | 1 | 8 | Completar la lección con lo que declaran las keys: bloque de conjunciones (benché, sebbene, prima che, affinché, purché, a meno che), negación de verbos declarativos (non dico che sia) y una mención breve de superlativo/antecedent |
| 26 | B1 | BOSS — Livello B1 | bien con reparos | 0 | 8 | Reequilibrar los ítems: hoy 15 de los 22 del dossier son de piacere (d10). Cubrir por igual los 'keys': passato prossimo vs imperfetto, futuro/condizionale con raíces irregulares, combinados y ne/ci, congiuntivo tras opinión/deseo |
| 27 | B1 | Avverbi | bien con reparos | 2 | 5 | Ampliar la lección con lo que realmente se evalúa: (a) comparativos y superlativos de adverbios (meglio/peggio/benissimo/malissimo, più forte); (b) adjetivos usados como adverbios (forte, piano, chiaro, veloce, vicino); (c) excepc |
| 28 | B1 | Connettivi e transizioni | bien con reparos | 2 | 18 | Alinear lección y ejercicios: agregar a la lección anche se + indicativo, comunque/lo stesso, né…né, non solo…ma anche, cioè/ossia, infatti/in effetti, a condizione che/di, o retirar del banco de ítems lo que no se enseña. |
| 29 | B2 | Congiuntivo passato | bien con reparos | 1 | 9 | Añadir ítems de decisión presente/passato (choice y cloze, p. ej. «Credo che ieri ___ / domani ___») y de contraste que-vs-di (Penso di aver capito / Penso che tu abbia capito), que hoy tienen cero ítems pese al bloque 3. |
| 30 | B2 | Congiuntivo imperfetto e trapassato | bien con reparos | 4 | 5 | Agregar ítems de "come se" (cloze/choice, con imperfetto y trapassato) y de "se solo"/magari + trapassato. |
| 31 | B2 | Condizionale passato | bien con reparos | 0 | 11 | Agregar ítems para el Uso 3 (noticia sin confirmar: «Secondo il giornale, il ministro si ___ dimesso») y para aconsejar («Al posto tuo ___ (dire) di no»). |
| 32 | B2 | Concordanza dei tempi | bien con reparos | 1 | 3 | Rebalancear los ítems: bajar los 10 cloze de compuestos a ~5 y agregar ≥8 ítems de condizionale passato (futuro en el pasado), de indicativo (trapassato/imperfetto/condizionale) y de simultáneo con imperfetto tras presente. |
| 33 | B2 | Periodo ipotetico | bien con reparos | 1 | 10 | Rebalancear los ítems: hoy hay 30 cloze casi idénticos (d19-001 a 030) y solo 3-4 producciones completas. Reducir a ~12 cloze y agregar transformaciones (tipo I → II → III de la misma frase), typed con producción libre («Se vinces |
| 34 | B2 | Pronomi relativi | bien con reparos | 1 | 11 | Reducir duplicados (in cui/per cui, refrán ×3, sorella di Marco ×3, libro del que ×3, «lo que decís» = ejemplo de la lección) y reasignar esos cupos a producción de quello che/tutto ciò che/il che y a más ítems fixerr/typed. |
| 35 | B2 | La voce passiva | bien con reparos | 5 | 4 | Sacar c1-pass-04/05/06 (si passivante/impersonale) o pasarlos a la semana 36; reemplazarlos por ítems de la pasiva: agente omitido, tiempos (sarà/sarebbe stato), andare + condizional. |
| 36 | B2 | Si passivante e si impersonale | bien con reparos | 1 | 8 | Corregir c-043: nota fonética ([ˈditʃe]) y cambiar el distractor «Sì dice così.», idéntico en audio. |
| 37 | B2 | Passato remoto e trapassato remoto | bien con reparos | 4 | 10 | Agregar producción real: 6-8 ítems typed/conjugate/translate con verbos regulares -ere (vendei/vendetti) y -ire, y más irregulares (bere, vivere, mettere, rispondere, volere, sapere, conoscere). |
| 38 | B2 | Discorso indiretto | bien con reparos | 1 | 4 | Rebalancear los ejercicios: sacar 2 o 3 ítems de futuro → condizionale passato y agregar ítems de congiuntivo (presente → imperfetto en la subordinada y en preguntas con se), pronombres y personas, y verbos para reportar (completa |
| 39 | B2 | BOSS — Livello B2 | bien con reparos | 0 | 1 | Ampliar los ítems propios de la semana: 6-8 por punto para pasiva (essere/venire/andare), si passivante/impersonale, passato remoto y discurso indirecto, y más de concordancia de congiuntivo (choice, conjugate, fixerr, translate). |
| 40 | C1 | Il causativo: fare e lasciare | bien con reparos | 0 | 3 | Ampliar los ítems (el dossier trae 12, parts declara 62) y repartirlos por regla: pronombres antes de fare (mi fa ridere, li faccio venire), lasciare + pronombres, expresiones fijas (far sapere, far vedere, farsi vivo), farsi + in |
| 41 | C1 | Verbi di percezione | necesita trabajo | 1 | 4 | Crear el banco de ejercicios de la semana (unos 25-30 ítems): reconocer infinitivo / che + ind. / relativa, cloze de la forma correcta, posición del pronombre y concordancia del participio, conjugate, fixerr con 'a' personal y di  |
| 42 | C1 | Verbi e preposizioni | necesita trabajo | 4 | 12 | Completar la práctica: la semana debe tener ítems propios (cloze, choice, translate, fixerr) para cada grupo (a, di, sin prep., pensare a/di, finire di/per) con la proporción declarada de 31 + 59. |
| 43 | C1 | L'infinito | necesita trabajo | 0 | 6 | Ampliar los ejercicios a 20-25 ítems que cubran los cuatro bloques: infinitivo sustantivado (il + inf., un continuo + inf. con cloze/choice), infinitivo compuesto (dopo aver/essere, per essere arrivato, credo di aver capito, con e |
| 44 | C1 | Gerundio e participio | bien con reparos | 2 | 10 | Agregar ítems fixerr/garden para el error típico de sujeto distinto ("Uscendo di casa, ha cominciato a piovere" → mentre + verbo conjugado) y otros de detección del error del hispanohablante. |
| 45 | C1 | Costruzioni verbali speciali | bien con reparos | 5 | 9 | Corregir suoni c-049: respuesta '5' y ajustar la nota. |
| 46 | C1 | Suffissi e alterazione | bien con reparos | 2 | 10 | Reescribir/quitar d03-059, d03-060 y g2-cb-39; si se quiere practicar prefijos, sumar ítems de ri-, s-, stra-, mal- que sí están en la lección. |
| 47 | C1 | Numerali, misure e quantità | bien con reparos | 1 | 5 | Ajustar el nivel: subir ejercicios y lectura a C1 real (numerali en textos periodísticos: «il 3,2%», «un aumento di due punti percentuali», «oltre/circa/quasi», cifras en titulares, «un ottavo», «al 40 per cento») o reclasificar e |
| 48 | C1 | Ordine delle parole e dislocazioni | bien con reparos | 2 | 6 | Agregar la parte del tema declarado: rasgos del italiano neostandard (che polivalente, «a me mi piace», gli por a loro/le, ci por a noi, lui/lei sujeto, tema sociolingüístico regional) con 4-6 ítems. |
| 49 | C1 | Registro alto e coesione testuale | necesita trabajo | 1 | 4 | Ampliar la práctica a unos 20-30 ítems con mezcla de tipos: choice (elegir el conector según la función), cloze (congiuntivo tras benché/qualora/affinché/prima che), fixerr (calcos del español y indicativo tras benché), combina, t |
| 50 | C1 | Lessico avanzato e falsi amici | necesita trabajo | 3 | 7 | Completar los ejercicios: la semana tiene solo 16 ítems, casi todos choice. Agregar al menos 25-30 ítems variados (cloze, translate, fixerr, typed, combina) y ejercicios para los bloques de registro (identificar coloquial/neutro/f |
| 51 | C1 | Ripasso generale C1 | bien con reparos | 0 | 5 | Confirmar por qué el dossier trae solo 2 de 555 ítems y auditar el banco completo de la semana. |
| 52 | C1 | ESAME FINALE — Livello C1 | bien con reparos | 9 | 9 | Reducir la carga: 160 ítems + 25 sfide (128 sub-ítems) y 8 textos de examen frente a las «40 preguntas» que anuncia la lección; definir cuáles 40 entran en cada intento del examen. |

## 5. Mediciones propias (no dependen de los revisores)

### 5.1 Sfide (Routledge) servidas por semana vs. tema de la semana

Cálculo sobre `course.json` (`weeks[].challenges`) con una tabla de afinidad capítulo→semana hecha a mano (aproximada). **En tema: 213 de 329 (65 %)** en las semanas 3-50 con jefes excluidos.

| Sem | En tema / total | Nota |
|---|---|---|
| 3 | 5/5 |  |
| 5 | 1/1 |  |
| 6 | 2/3 |  |
| 7 | 1/1 |  |
| 8 | 2/2 |  |
| 9 | 6/9 |  |
| 10 | 8/8 |  |
| 11 | 3/12 | **relleno**: mayoría de otro capítulo |
| 12 | 3/12 | **relleno**: mayoría de otro capítulo |
| 14 | 2/12 | **relleno**: mayoría de otro capítulo |
| 15 | 3/9 | **relleno**: mayoría de otro capítulo |
| 16 | 3/4 |  |
| 17 | 12/12 |  |
| 18 | 10/12 |  |
| 19 | 12/12 |  |
| 20 | 4/12 | **relleno**: mayoría de otro capítulo |
| 21 | 10/12 |  |
| 22 | 12/12 |  |
| 23 | 0/12 | **relleno**: mayoría de otro capítulo |
| 24 | 2/12 | **relleno**: mayoría de otro capítulo |
| 25 | 5/12 |  |
| 27 | 4/12 | **relleno**: mayoría de otro capítulo |
| 28 | 8/9 |  |
| 29 | 4/4 |  |
| 30 | 3/3 |  |
| 31 | 6/12 |  |
| 32 | 3/3 |  |
| 33 | 3/3 |  |
| 34 | 7/8 |  |
| 35 | 4/4 |  |
| 36 | 3/6 |  |
| 37 | 3/4 |  |
| 40 | 10/10 |  |
| 41 | 6/6 |  |
| 42 | 12/12 |  |
| 43 | 9/12 |  |
| 44 | 5/6 |  |
| 45 | 4/4 |  |
| 46 | 3/3 |  |
| 47 | 1/1 |  |
| 49 | 9/9 |  |
| 50 | 0/12 | **relleno**: mayoría de otro capítulo |

- Semanas con más de dos tercios de relleno fuera de tema: 11, 12, 14, 15, 20, 23, 24, 27, 50. **Semana 23 (comparativos) y 50 (léxico/falsi amici): 0 de 12** en tema.
- Semanas sin ninguna sfide: 1, 2, 4, 38, 48. 28 de las 339 sfide (p. ej. `r01-03`, `r17-01`, `r24-03`) no se sirven en ninguna semana (solo entran al muestreo del jefe).
- El tope de 12 sfide por semana hace que, cuando el capítulo afín tiene pocas, se rellene con capítulos ya vistos (pronombres cap. 7, interrogativos cap. 10, artículos cap. 2). Es repaso, pero no práctica del tema.

### 5.2 Ítems que trabaja cada semana (autor + Dummies + sfide-ítem)

Total de ítems listados por semana (`items` + `parts`): mediana ≈ 60; semanas de jefe (13, 26, 39, 51, 52) reciclan cientos. Semanas con **menos de 40 ítems en total**: 24 (30), 29 (31), 35 (36), 37 (37), 38 (32), 41 (34, de ellos 32 de sfide), 47 (25) y 48 (36, todos de autor). Semanas 40-52 dependen casi por completo de sfide (Routledge, en inglés de origen, traducidas) más un puñado de ítems de autor: **la estación C1 tiene poca práctica de autoría propia** (semanas 41: 2, 43: 6, 49: 7, 42: 11).

## 6. Qué se puede mejorar (priorizado)

### Prioridad alta

1. **Alinear teoría y práctica en cada semana.** Es el hallazgo más repetido (lo dicen los revisores de las semanas 2, 4, 6, 9, 12, 20, 21, 22, 25, 27, 28, 31, 35, 36, 40, 42, 45, 46, 47, 49, 51). Casos concretos: *c'è / ci sono* se practica en la semana 2 y no se enseña; preposiciones articuladas en la 9; *stare + gerundio* y no diptongación (semana 6) con 0 ítems; *ne* en la 22; ortografía *-ghe/-chi/-h* del condizionale (20) y del congiuntivo (24); *lo/la* + *si* (36); volerci/metterci (45); ordinales y partitivo (47); causativo, pasiva, dislocaciones y concesivas en la semana 51 (solo en `keys`). Regla propuesta: cada `key` de la semana debe tener ≥1 bloque de teoría y ≥4 ítems; agregar un chequeo en `tools/it/check_lessons.py`.
2. **Corregir los 124 errores confirmados** (sección 3). Los más dañinos por enseñar mal: la regla «*Sì, voy mañana* suena incompleto: hay que decir *ci vado*» (semana 21, repetida en `g2-ct-25` y `g2-sc-11`); «-ano nunca lleva el acento» (12); pares mínimos que no existen (*vólgo/vòlgo, vénne/vènne, quale/cuale, stato/statto*); notas fonéticas con [ts]/[dz] cambiados (*zucchero, pranzo*); glosas *stagionato = estacionado* y *negozio = negocio*; `accept` que valida «*Lo ho visto*» o rechaza «*A me piace*».
3. **Suoni: auditar los pares y las notas fonéticas con una fuente externa.** Casi cada semana con suoni tiene 1-2 fallas (p-173, p-174, p-184, p-188, p-190, c-043, c-049, a-023, a-024). Un par mínimo que no contrasta ningún sonido, o una respuesta de «contar palabras» equivocada, enseña mal en un módulo que el curso presenta como su punto fuerte. Sugerido: validar cada par contra un diccionario de pronunciación (o eliminarlo si el TTS no distingue).
4. **Rehacer el reparto de sfide** (sección 5.1): eliminar el relleno fuera de tema o marcarlo como «Repaso»; en la 23 y la 50 sustituir por capítulos afines (ch. 5 comparativos/superlativos de Routledge; ch. 6 sufijos y léxico); servir las 28 sin semana.

### Prioridad media

5. **Producción, no solo reconocimiento.** Muchas semanas son casi todo `cloze`/`choice` (p. ej. 30 cloze casi idénticos en las semanas 4 y 33; 10 de 13 ítems iguales en la 29). Sumar `typed`, `fixerr` y traducción inversa en las semanas 27-51.
6. **Nivel real vs. nivel declarado.** Las semanas 46 (sufijos) y 47 (números/medidas) son A2-B1 etiquetadas C1; la semana 1 promete saludos, *tu/Lei* y deletreo y no los enseña ni practica; la 23 promete ropa/colores y no los usa. Reetiquetar o reescribir.
7. **Reglas absolutas → reglas con excepciones.** «Nunca condizionale después de *se*» (33, 39; existe en interrogativas indirectas), «no es *essere* + *da*…», «*siccome* siempre al principio» (28), islas grandes/chicas + artículo (3), «*essere* es el único irregular entero» (37; *dare* también), notas «solo con» / «nunca». Suavizar y dar la excepción.
8. **Ítems de relleno de otras semanas** (colocaciones `l2-c-*` en la semana 5; marcadores `l2-d-*` en la 14 y la 18; artículos/preposiciones en la 16): reubicarlos o etiquetarlos como repaso.
9. **Banco de frases y de errores: subir el techo de nivel.** `frasi_banca` 1-378 es A1-A2, 379-728 casi todo B1 (A2 11 %, B1 60 %, B2 29 %) y no hay C1 ni registro formal *Lei*; el banco de `trova_errore` tiene 299 ítems A1-A2, 61 B1, 4 B2 y **ninguno C1**. Falta cobertura de congiuntivo, periodo ipotetico, pronombres combinados y *si* impersonale en esos bancos.
10. **Léxico:** ~65 % de las entradas de `nomi` tienen la nota vacía (agregar una frase de ejemplo); plurales generados por regla para incontables y meses (*gennai, aprili, sangui, fami*) → mostrar «—»; unificar niveles de nacionalidades y marcas `both`; agregar tema *deporte/ocio* y femeninos de profesiones.

### Prioridad baja

11. Escena «Falsi amici» de Frasi: 5 de 18 frases no son falsos amigos. Unificar las dos fuentes de falsos amigos (`trasferimento.py` y `lab.js`) y retirar los pares débiles (*cugino/cocinero, compito/cómputo, morbido*).
12. Escenas faltantes: teléfono/mensajes, viaje en avión y alquiler, mercado y comida, citas y amistad, tecnología, emergencias.
13. Temas C1 de `frasi_banca` sesgados a historia y filosofía; sumar trabajo, salud, tecnología y trámites.
14. Unificar las dos notas de las horas de la interfaz (*mezzogiorno/mezzanotte*) y completar la regla *di/che* con el caso de dos sustantivos comparados.
15. Corregir `errore:392` («cartera» no es billetera en Argentina) y revisar las ~11 frases `wrong` de `trova_errore` que son aceptables en el uso real (374, 389, 417, 458, 476, 515, 518, 556, 578, 581, 582).

## 7. Material transversal (sin semana)

| Lote | Unidades | Veredicto | Reparo principal |
|---|---|---|---|
| Trova l'errore 1-364 | 364 | bien con reparos | Ampliar a B2-C1: congiuntivo (dopo che/benché/credo che), concordanza dei tempi, periodo ipotetico, pronomi combinati, ci/ne, si passivante/impersonale, pronomi relativi (cui, il quale), gerundio/part |
| Trova l'errore 365-584 | 220 | bien con reparos | Revisar los ítems donde la frase 'wrong' es aceptable (374, 389, 417, 458, 476, 515, 518, 556, 578, 581, 582) y convertirlos en 'mejor opción' con alt válidos, o cambiar el ejemplo por uno inequívocam |
| Frases 1-378 (A1-A2) | 378 | bien | Ampliar a B1/B2: condizionale (solo 'vorrei' en A1), congiuntivo presente, periodo ipotetico, pronomi combinati (glielo, me lo), si impersonale, relativi (che/cui), passato remoto, futuro anteriore. |
| Frases 379-728 (A2-B2) | 351 | bien con reparos | Agregar frases A1 y C1 y rebalancear: hoy A2 11%, B1 60%, B2 29%. |
| Frases 729-864 (B2-C1) | 135 | bien | Suavizar/precisar las notas normativas categóricas (mi risulta che, si dice che, principal en pasado→imperfetto) indicando indicativo vs congiuntivo y registro. |
| Sustantivos (1.560) | 39 | bien con reparos | Corregir la nota de appartamento y revisar con un script todas las notas 'Doble x' contra la palabra. |
| Sustantivos/verbos/adjetivos/parole | 38 | bien | Agregar una frase de ejemplo en las notas de nomi (hoy cerca del 65% de las entradas tienen nota vacía y muchas notas son solo el recordatorio 'Vocal inicial: l'x'/'S + consonante'). |
| Parole (adverbios, pronombres, números) | 5 | bien | Distinguir subcategorías gramaticales (posesivo, demostrativo, indefinido, relativo) en lugar de 'pronome' y 'quantità' genéricos. |
| Escenas de conversación (21) | 21 | bien con reparos | Rehacer la escena Falsi amici con solo falsos amigos reales y notas en todas las frases |
| Transferencia es→it, falsos amigos, grafías, capire | 45 | bien | Revisar y unificar las reglas de correspondencia grafía/puente (ue/ie, h-, ns, cl/pl/fl, y) marcándolas como tendencias, con condición (sílaba abierta/cerrada) y excepciones frecuentes, y con ejemplos |
| Textos de interfaz y diagnóstico | 16 | bien | Unificar las dos notas de las horas y completar la regla di/che con el caso de dos sustantivos. |

## 8. Detalle por semana

### Semana 1 · A1 · Suoni e ortografia — necesita trabajo

Los ejercicios de ortografía y de essere/avere son correctos casi en su totalidad (0 errores de italiano confirmados) y la teoría de sonidos es clara. Pero la semana no cumple su propio objetivo: no enseña ni practica saludos, tu/Lei ni deletreo, y 46 de 73 ítems son essere/avere mientras el título es «Suoni e ortografia». Además trae 20 desafíos (sfide) de capítulos B1-C1 (infinitivo compuesto, «lo si beve», causativos) que no corresponden a un A1 semana 1. Hay un par de notas engañosas (anno/ñ, tabla c/che) y no hay dictogloss ni suoni de habla conectada/entonación/acento.

**Bien:** Ejemplos de dobles y pares mínimos (nono/nonno, sete/sette, casa/cassa) bien elegidos y con contraste en español.; Buena idea de decir qué es realmente el error típico del hispanohablante (doble consonante, e- protética, v/b).; Lecciones cortas con ejemplo + traducción; notas de ítems claras en la mayoría (é/è, ho/o, hanno/anno).; Ítems de essere/avere con expresiones idiomáticas (ho fame/sete/sonno/torto/fretta) que pegan directo con el contraste con el español.

**Mejoras:**
- (alta) Agregar teoría y práctica de lo prometido en «fare/tema»: nombres de las letras (a, bi, ci, di…), ciao/buongiorno/buonasera/arrivederci, mi chiamo, tu vs Lei con essere (Lei è).
- (alta) Reequilibrar ítems: bajar essere/avere de 46 a ~25 y subir ortografía (dictado tipeado, sci/schi, gn/gli, tildes) con tipos de producción (typed, scopri).
- (media) Reescribir la tabla c/g: separar «grafía» y «sonido» con un mismo código (como «chico»/«queso») y unificar la descripción de gli (l palatal, no ll rioplatense) en lección, ítems y suoni.
- (media) Corregir notas: asc-1-10 (anno/ñ), asc-1-05 (z suave), rf-1-09 («shea»); evitar IPA en A1 o explicar la notación una vez.
- (media) Añadir «abbiamo», «hanno» (conjugate) y ho ragione/ho voglia di con ítems; en la lección incluir voglia di (ya se evalúa en d07-033 solo en la nota).

### Semana 2 · A1 · Nomi: genere e numero — bien con reparos

La teoría de género y plural es correcta, ordenada y con buenos contrastes con el castellano (latte, sangue, uova, mano, -ista). El problema principal es estructural: el objetivo comunicativo c'è / ci sono se practica en 9 ítems pero no se enseña en ninguna parte de la lección. Además, los ítems son repetitivos (amico x3, problema x3) y dejan sin práctica muchas reglas enseñadas (irregulares, invariables, -ca/-ga, géneros traicioneros). En suoni hay dos pares defectuosos (questo/cuesto, cena/chena) y una nota con puntuación rota. La lectura es útil pero incoherente en el último párrafo y solo tiene preguntas literales.

**Bien:** Reglas de plural muy completas y correctas para A1 (-chi/-ghi, esdrújulas, -cie/-ce, -io átona/tónica, excepciones amici/greci/nemici).; Buena selección de géneros que no coinciden con el castellano (il latte, il sangue, il sale, la fine, la domenica, l'analisi) y del error típico «la problema».; Los ítems fixerr y garden explican bien la causa del error (gente singular, gatto/mamma, città con acento, -ista sigue al género de la persona).; La lectura recicla casi todo el contenido (uova, foto invariable, re, zii, cugini, lo zucchero) y la caza de formas cubre bien los plurales.

**Mejoras:**
- (alta) Agregar a la lección un bloque de c'è / ci sono (afirmativa, negativa, concordancia con el sustantivo, contraste con «hay») con 3-4 ejemplos del aula.
- (alta) Rebalancear los ítems: quitar duplicados (amico x3, problema x3) y sumar ítems para lo enseñado sin práctica: irregulares (uomo, uovo, braccio, dito), invariables (film, re, foto, moto), -ca/-ga (amica → amiche), -io tónica (zio → zii), género latte/sale/sangue/fine/domenica.
- (alta) Corregir los pares de suoni p-173 (cena/chena) y p-174 (questo/cuesto) y la nota de p-011.
- (media) Sumar ejercicios de producción con artículo (il/lo/la/i/gli/le + sustantivo) y de traducción corta (es → it) o de escucha; hoy todo es reconocimiento, cloze de plural o corrección.
- (media) Enseñar (o al menos mencionar) los artículos plurales gli/lo/i/le que ya aparecen en notas, tablas y lectura.

### Semana 3 · A1 · Articoli determinativi e indeterminativi — bien con reparos

Teoría clara y en general correcta (tablas de artículos, plurales, preposiciones articuladas y partitivo sin errores de forma). El italiano de los ítems, las lecturas y el dictogloss no tiene errores gramaticales confirmados. Los reparos son: una regla falsa sobre islas «chicas/grandes» (Cuba), una receta de preposiciones articuladas incompleta, ejemplos de vocab rotos o demasiado avanzados, pares mínimos con no-palabras, y una carga excesiva para A1 semana 3 (artículos + posesivos + países + preposiciones + partitivo + nessun). Tasa de falsos positivos estimada: ~25% (las dudas).

**Bien:** Tablas completas y correctas de il/lo/l', plurales, un/uno/una/un' y de las 5 preposiciones articuladas.; Contraste constante con el español (il latte, l'acqua femenino, la mano/la foto, la gente singular) y errores típicos del rioplatense.; Reglas cortas con warn/tip útiles: s impura vs s+vocal, un'/un, i amici no existe, con/per no se funden.; La lectura w-03 es natural, A1 y usa artículos, preposiciones articuladas y partitivos en contexto; el dictogloss «Al bar» es coherente con el tema (fare).

**Mejoras:**
- (alta) Corregir el criterio de las islas («chicas/grandes») en lesson:9, ar-u-10/11 y s:r02-08:e; y completar la receta de fusión para il/i (nel, dei) en lesson:12.
- (alta) Arreglar el ejemplo roto de vocab «ragazzo» y reemplazar los ejemplos demasiado avanzados (finestra con condizionale).
- (media) Poner los ejercicios en contexto: casi todos son un artículo aislado + sustantivo. Agregar 8-10 frases cortas (Vorrei un caffè; Ho un'amica; Il sabato c'è il mercato) y ítems de tipo typed/listen sobre el tema «pedir en el bar».
- (media) Asignar a una parte de la lección los ítems huérfanos (g2-gd-38, rf-1-16/17/22/23) y sacar los que exigen contenido no enseñado (numerales 90, elisión novant'anni, lenzuola, neanche).
- (media) Lectura: agregar preguntas vero/falso/non si dice (hoy son 3 preguntas literales de opción múltiple) y arreglar la caza de formas para separar preposiciones articuladas de partitivos; incluir países/posesivos/idioma para cubrir más reglas.

### Semana 4 · A1 · Aggettivi qualificativi — bien con reparos

Semana correcta en italiano: no encontré errores seguros en respuestas, notas ni textos. El problema es de alineación entre teoría y práctica: hay ítems sobre molto, avere (edad, caldo), plurales en -co/-go y che X di Y que la lección no enseña, mientras que faltan nacionalidad y profesiones, prometidas en 'fare' y 'tema'. La práctica es muy repetitiva (30 cloze casi idénticos, simpatiche 4 veces) y casi sin producción libre. Estimo unos 25-30% de falsos positivos en las dudas.

**Bien:** Concordancia -o/-e y los irregulares bello/quello, buono, santo bien explicados con tablas y ejemplos correctos.; Contraste de posición con pares de sentido (vecchio amico / amico vecchio, povero uomo) claros y bien practicados (rf-4-18, 19).; Notas de los ítems mayormente precisas y útiles (h de simpatiche, latte/fiore masculinos, gente singular, «rosse» = rojas).; Lectura natural, con muchos adjetivos de la semana, glosas rioplatenses (remeras, pelo) y distractores bien construidos.

**Mejoras:**
- (alta) Añadir a la lección bloques cortos sobre: plurales en -co/-ca/-go/-ga, molto (adverbio invariable vs adjetivo) y avere + anni/caldo, o mover esos ítems a otra semana.
- (alta) Cubrir el objetivo declarado (nacionalidad, profesiones, aspecto físico): bloque con nacionalidades (-ano, -ese, -ino) y profesiones, más 4-6 ítems (È argentina / Sono insegnante).
- (media) Reducir los 30 cloze de d05 (estructura idéntica) a ~15 y reemplazar por ítems de producción: traducciones (hoy solo 3), typed, qa o descripciones de una persona.
- (media) Eliminar duplicados (simpatiche x4, grandi x2, begli x2) y ampliar la cobertura de quello (solo se practica bello; no hay ítems de quello) y de bell'/quell' femeninos.
- (media) Añadir a la lección un contraste con el español y errores típicos: «molto/mucho» y «muy», concordancia de gente/persone, ausencia de -s.

### Semana 5 · A1 · Presente indicativo: verbi regolari — bien con reparos

El italiano de los ítems propios del tema es correcto y la teoría de conjugaciones y ortografía (h, pérdida de i) es exacta. El problema es de estructura: ~28% de los ítems (l2-c-*) trabajan avere/essere/prendere sin teoría, los desafíos son de otras semanas y de nivel muy superior, y la práctica es casi solo conjugate. Hay pocos errores puntuales (una glosa en español falsa, dos accept faltantes). Tasa estimada de falsos positivos en errores/dudas: ~20%.

**Bien:** Las tablas y reglas de las tres conjugaciones, -isc-, h ante i/e y caída de i son correctas y claras; Las 50 conjugaciones tienen respuesta única y bien formada, con buenos casos de contraste (mangi/studi/scii, cerchi/paghi); Advertencia sobre el acento de loro (PAR-lano) y sobre «Lei è», nunca «Lei sei»: muy útil para hispanohablantes; Dictogloss y entonación pertinentes y con vocabulario de la semana

**Mejoras:**
- (alta) Reubicar o eliminar los 27 ítems l2-c-* (avere/essere, prendere, mettere, portare) y sustituirlos por práctica del tema real: más ítems de -isc-, io/tu/voi, y oraciones en contexto
- (alta) Rebalancear los tipos de ejercicio: hoy 50 conjugate + 18 translate; agregar choice de reconocimiento, cloze con oración completa, fixerr de ortografía (cerci, mangii), un qa de rutina y un listen
- (media) Reescribir la lectura ep2 con verbos regulares y sumar la lectura w-05 con personas io/tu/noi/voi/loro y verbos -care/-gare/-ciare; incluir preguntas vero/falso/non si dice
- (media) Agregar a la teoría una lista de -ire sin -isc- (partire, dormire, sentire, aprire, seguire, servire, offrire) y una nota de errores típicos rioplatenses (acento de loro, tú/vos → tu, omitir el sujeto)
- (media) Repartir mejor la práctica: los -isc- tienen 4 ítems y la ortografía de -iare (studiare/inviare/sciare) 4; balancear io/tu/noi/voi/loro (voi y io están subrepresentados)

### Semana 6 · A1 · Presente indicativo: verbi irregolari — necesita trabajo

La teoría es sólida, corta y con buen contraste con el castellano (h muda, sto stanco, stare+gerundio). El problema es la práctica: 30 de 87 ítems son sobre fare, unos 40 son colocaciones B1 (dare retta, dare del Lei, avere a che fare con) que la lección no enseña, y no hay ni un ítem de stare+gerundio ni de no-diptongación. Las sfide traen capítulos de otras semanas (futuro, infinitivo compuesto, clíticos). Hay pocos errores lingüísticos duros, pero varios ítems con dos opciones válidas, dos notas falsas (gettare, cola/colla) y una pregunta de lectura mal formulada.

**Bien:** Teoría breve, ordenada y con avisos de errores típicos del hispanohablante (ho che andare, sto stanco, h muda, no diptongar).; Tablas completas de los 15 irregulares con ejemplos traducidos al voseo rioplatense.; El dictogloss es natural, breve, usa casi todos los irregulares y modales de la semana y es correcto.; La lectura «Una giornata di Sara» es coherente y natural, recicla fa/esce/va/dice/può/deve/beve/viene.

**Mejoras:**
- (alta) Crear ítems para stare + gerundio (sto leggendo, cosa stai facendo, stiamo cenando) y para la no diptongación (posso/puedo, dormo/duermo, penso/pienso): cloze, choice y fixerr.
- (alta) Retirar de la semana ~30 ítems de colocaciones B1 (dare retta, dare del Lei, avere a che fare con, tenere d'occhio, dare un passaggio, fare il pieno) o crear un bloque «expresiones con fare/dare/stare/andare» en la lección; corregir los que tienen 2 opciones válidas (l2-c-57, l2-c-63, l2-c-59, l2-c-69, l2-c-70).
- (alta) Corregir la pregunta 3 de la lectura y sumar 2-3 preguntas de vero/falso/non si dice.
- (media) Equilibrar cobertura: ~6 ítems por verbo clave; agregar rimanere, bere, sapere, potere, volere, venire y essere (sono stanco / sono a Roma) y un contraste essere/stare; reducir fare de 30 a ~10.
- (media) Introducir tipos de ejercicio variados: listen/typed/scopri/qa para producción y escucha, no solo conjugate/choice.

### Semana 7 · A2 · Numeri, date e ora — bien con reparos

Los ítems propios son correctos en italiano y en español; casi no hay errores duros. La teoría es corta y correcta, pero deja fuera partes del tema (días, meses, estaciones, precios, di mattina/di sera) y la práctica repite muchas veces «il + cardinal». Las sfide provienen de capítulos ajenos (pronombres, posesivos, indefinidos, futuro), hay etiquetas en inglés y pocas notas confusas en español y suoni. Estimo ~25% de falsos positivos en los hallazgos de tipo duda/mejora.

**Bien:** Todas las respuestas numéricas y horarias verificadas son correctas (millenovecentoquarantasette, ventitré, trentuno, seimiladuecentonovantotto...).; Reglas centrales bien formuladas: cardinales pegados, la hora con le en plural, excepciones l'una / mezzogiorno / mezzanotte.; Las listas accept de hora son generosas (24 h, un quarto/quindici, meno un quarto/e quarantacinque, e mezza/e mezzo).; Notas breves y útiles en varios ítems (il lunedì = los lunes, mezzogiorno con è, fare colazione vs pranzare/cenare).

**Mejoras:**
- (alta) Completar el tema declarado: días y meses, estaciones y precios, con 6-8 ítems que incluyan mes y precios.
- (alta) Enseñar en la lección di mattina/del pomeriggio/di sera, lunedì vs il lunedì y ventun/trent'anni.
- (media) Agregar tipos de reconocimiento (choice, listen con horas y fechas, qa) y ordenar la dificultad (empezar con números chicos).
- (media) Reducir los ítems repetidos «il + cardinal» y ampliar los ordinales con -esimo.
- (media) Alinear niveles (semana A2, lectura/dictogloss A1) y traducir los rótulos de capítulo.

### Semana 8 · A2 · Domande e interrogativi — necesita trabajo

La lección es corta y clara en su parte de interrogativos, pero tiene una contradicción interna (sí/no sin inversión vs. «sujeto al final») y la mitad de la práctica (d11-002..010) obliga a una forma poco natural. La intro plantea un contraste con el español que no existe (la preposición también va delante en castellano). Casi no hay práctica de preposición+interrogativo ni de che/quale, y el objetivo declarado (direcciones, ciudad) no aparece. Hay un error de contenido en l2-d-03 (magari). Estimo ~15% de falsos positivos en las dudas y ~5% en los errores.

**Bien:** Tabla de interrogativos completa y con ejemplos claros, glosas rioplatenses (voseo, cartera, lapicera).; Buena advertencia sobre «¿» inexistente y sobre Qual è sin apóstrofo, reforzada en tres ejercicios (a2-ort-05, g2-va-72, c-011).; Ítems de choice quanto/quanta/quanti/quante con distractores basados en la regla de concordancia.; Ítems conjugate d11-036..040 conectan interrogativos con respuestas personales y son correctos.

**Mejoras:**
- (alta) Reescribir/eliminar el bloque «sujeto al final» y los ítems d11-002..010: enseñar que en sí/no el sujeto se queda antes del verbo y que con interrogativo puede ir después; aceptar ambas formas
- (alta) Cumplir el objetivo comunicativo (preguntar y dar direcciones): vocabulario de la ciudad, dov'è/c'è, a destra/sinistra, scusi, y 6-8 ítems en contexto
- (alta) Añadir ejercicios de preposición+interrogativo (di chi, con chi, a che ora, da dove, di che cosa), perché/porque y che vs quale
- (media) Corregir la intro: el contraste de la preposición es con el inglés, no con el español; agregar errores típicos del rioplatense (omitir preposición, calcar ¿qué tal?, «quando» por «adónde»)
- (media) Corregir l2-d-03 (magari = quizás) y ampliar accept en l2-d-04 y ejercicios de traducción/producción libre

### Semana 9 · A2 · Preposizioni di base — bien con reparos

La lección es corta, clara y en general correcta, y los ítems de preposiciones (in/a, da persona, da + tiempo) tienen respuestas acertadas casi siempre. Los problemas son de estructura: las preposiciones articuladas y los medios de transporte, que son parte del tema, no se enseñan. Además, las sfide traen contenido fuera de nivel (participio absoluto, infinitivo compuesto) o de tema. Hay pocos errores duros (un par mínimo falso en suoni y algunas respuestas aceptadas incompletas) y varias reglas exageradas. Tasa estimada de falsos positivos: ~25%.

**Bien:** Reglas cortas con contraste castellano y ejemplos rioplatenses («ceno en lo de Ana», «anteojos de sol»); La advertencia sobre da + persona («vado dal dentista») y presente + da es exactamente el error típico del hispanohablante; Los ítems garden/scopri/fixerr de in/a y da son claros y variados; las notas explican la regla; Las lecturas (fl-da, w-09) practican la gramática de la semana con texto natural y buenos distractores

**Mejoras:**
- (alta) Agregar a la lección un bloque de preposiciones articuladas (tabla di/a/da/in/su × il, lo, la, l', i, gli, le) con 3 ejemplos y el aviso «per/tra/con no se funden»
- (alta) Enseñar de verdad el tema «medios de transporte»: in treno/autobus/macchina/aereo/bici vs a piedi (y con il treno), más vocabulario asociado, con 4 a 6 ítems
- (alta) Rebalancear los ítems: hoy in/a con lugares suma unos 25, mientras tra/fra tiene 0, con 1, su 3, a piedi/al mare/in montagna 0; agregar 6 a 8 ítems de los puntos ausentes y quitar 5 duplicados (b2-prep-01/02/03 y g2-sc-01-a/b repiten d12-*)
- (media) Agregar contraste explícito: sono di Roma / vengo da Roma, per due ore vs da due ore vs fa, y un mini bloque «da quanto tempo / da quando»
- (media) Suavizar las afirmaciones absolutas («Nunca pasado», «suena a extranjero», «se funden siempre», «lugar cerrado») y corregir los ítems con accept incompletas (d12-037, l2-c-38, g2-va-80, c1-prep-05, l2-c-42)

### Semana 10 · A2 · Pronomi personali — bien con reparos

La teoría es corta, correcta y bien contrastada con el español en lo esencial (a personal, telefonare/scrivere como indirectos, tónicos tras preposición, enclíticos con infinitivo). El problema está en los ejercicios: casi todo son cloze aislados de una palabra, 10 ítems son de pronombres sujeto (no enseñados esta semana) y no hay ningún ítem que practique tónicos ni enclíticos; además parts declara 84+32 ítems y el dossier trae 41, así que puede faltar material. Solo hay un error de ejercicio claro (l2-c-58 acepta solo «dà» cuando «fa» es igual de correcto) y un error en un gloss de suoni. La lectura y el dictogloss son naturales y buenos, aunque no cubren tónicos ni enclíticos, y el suoni trae contenido de semanas posteriores (dimmelo, me lo, ce l'ho).

**Bien:** Contrastes muy útiles para rioplatenses: objeto directo de persona sin «a» (vedo Marco, conosco Anna) y telefonare/scrivere como indirectos (gli telefono), con ítems que lo practican (g2-gd-40, g2-ct-03, g2-ct-04).; Tabla completa de átonos/tónicos con la fila formal Lei/La/Le y el caso de loro (li/le, gli/loro); advertencia correcta de que le vedo = «las veo» y de que tras preposición es con me / per te.; Las notas de d08-012, d08-016, d08-017 y d08-021 son precisas (fiore masculino, grupo mixto = li, vi si les hablás, gli vs loro).; La lectura Il regalo per la nonna es natural, cabe en A2, encaja con el tema «Regalos, favores» y recicla le, la, li, gli, mi, vi en contexto.

**Mejoras:**
- (alta) Agregar ítems (recuperar los que faltan si el dossier está truncado: parts declara 84+32 y hay 41) de producción en frase para tónicos (Chiamo te, non lui; Vieni con me?), enclíticos con infinitivo (voglio chiamarti / ti voglio chiamare) y elección lo/gli/le en oraciones completas, en lugar de cloze de una palabra.
- (alta) Reemplazar los 10 ítems d08 de pronombres sujeto y los ítems de verbos de apoyo/marcadores (l2-c, l2-d) por práctica de los pronombres de objeto en contexto (regalos, favores: ¿Mi presti…?, Ti ringrazio, Ti posso aiutare?).
- (media) Completar la lección con las trampas típicas del hispanohablante: le/gli (a ella / a él), «Lo telefono» por «Gli telefono», redundancia «a me mi», y añadir brevemente el lo neutro (non lo so) y volere bene/piacere como verbos con indirecto.
- (media) Alinear suoni con la semana: reemplazar dimmelo/me lo/ce l'ho por pares con clíticos simples (mi vede / ti vede, lo chiamo / la chiamo) y corregir el par mésse/mèsse.
- (media) Sumar preguntas de lectura que obliguen a resolver referentes (¿A quién se refiere «gli»?, ¿Qué es «la» en «la mettiamo»?) y sumar lo, ti y ci al texto; hoy las preguntas son literales y dos distractores son obvios (llora, se enoja).

### Semana 11 · A2 · Passato prossimo — bien con reparos

La teoría es sólida y bien secuenciada (forma, auxiliar, concordancia, doble auxiliar, modales, irregulares, adverbios, pronombre directo) y los ítems de italiano son casi todos correctos. Los reparos son de mecánica y cobertura: faltan ítems de già/mai/ancora, doble auxiliar y reflexivos, hay exceso de pronombres y repetición de participios, las 48 sfide no son de la semana y arrastran gramática posterior, y hay 2 notas en español claramente erróneas (g2-gd-12, p-046). Tasa estimada de falsos positivos en los hallazgos: 15-20 %.

**Bien:** La lección enseña el eje correcto (elección del auxiliar) con tablas por grupos, contraste con el castellano y advertencias sobre errores típicos (camminare/viaggiare con avere, «sono andata» en mujer, «ho facciuto»).; Los participios irregulares están bien elegidos por frecuencia y practicados con cloze, garden y fixerr; las notas de garden explican por qué engaña la analogía con el castellano.; Buena mezcla de tipos y progresión reconocimiento → producción: participio suelto, cloze con auxiliar, choice, fixerr, traducción con puntos de contraste.; Las lecturas ep4 y w-11 son naturales, de nivel A2, usan essere y avere en variedad y la caza de participios está bien acotada.

**Mejoras:**
- (alta) Rebalancear los 126 ítems: hoy ~35 son de pronombres (d16-021..040, g2-out-pro) y ~12 de participios «garden» repiten los verbos de d16-001..010 (fare, leggere, scrivere, prendere, vedere, aprire, dire). Reducir duplicados y liberar lugar para ítems de auxiliar y de adverbios.
- (alta) Corregir las notas falsas o confusas de las garden: g2-gd-12 («nací» con haber), g2-gd-18 («respuesto»), g2-gd-13, g2-gd-22 (piaciuto ≠ sc), y la errata «dello» en p-046.
- (media) Restaurar/mostrar los ejemplos de los ítems garden y scopri («Mirá los tres ejemplos…», «Leé las frases…») y ordenar scopri antes de la práctica del mismo punto.
- (media) Agregar a la lección un mini bloque de expresiones de tiempo del tema de la semana (ieri, ieri sera, l'altro ieri, stamattina, la settimana scorsa, due giorni fa) y de forma negativa/interrogativa (non ho mangiato, hai mangiato?).
- (media) En la lección: (a) enseñar en el bloque de auxiliar un contraste mínimo de los verbos climáticos si se los va a evaluar; (b) mostrar un ejemplo con reflexivo (mi sono alzato/a) y con piacere plural (sono piaciuti); (c) completar la regla del apóstrofo en l'hai/l'ha/l'hanno; (d) no afirmar que el examen exige la forma canónica de los modales.

### Semana 12 · A2 · Riflessivi e imperativo — bien con reparos

La teoría es breve, clara y casi toda correcta, con buenos contrastes con el voseo (parla vs hablá, pronombre pegado). El problema principal es de cobertura: cerca de la mitad de los ítems y de los desafíos son reciclados de otros temas (passato prossimo, piacere, da + presente, interrogativos), mientras que el bloque de formas cortas (dammi, dimmi, fallo) y el imperativo formal Lei no tienen ejercicios propios. El tema declarado (cuerpo, farmacia) no aparece en vocabulario ni práctica. Hay pocos errores de contenido: tres reglas/notas falsas o engañosas y un accept incorrecto.

**Bien:** Contraste explícito con el voseo (acento de parla/hablá, pronombre pegado en chiamami/llamame) y aviso de calco típico (non parla = no habla).; Regla del negativo de tu (non + infinitivo) enunciada con ejemplos y con la advertencia del error frecuente.; Excelente advertencia de las formas cortas (dammi, gli no se duplica) y del 'falso reflexivo' rimanere/restare.; Lectura w-12 (Le regole della nonna) natural, mezcla reflexivos e imperativos tu/voi, afirmativos y negativos, con caza de formas pertinente.

**Mejoras:**
- (alta) Crear ejercicios para el bloque 5 (dammi, dimmi, fallo, vacci, dagli) y para el bloque 4 (Lei: reconocer Scusi/Senta/Mi dica/Si accomodi, con el pronombre delante).
- (alta) Agregar el contenido del tema: partes del cuerpo con artículo (mi lavo le mani), vocabulario de farmacia y consejos con imperativo (Prendi una pastiglia, Non fumare); actualizar el vocabulario semanal (ahora tenere, ritardo, nipote, verità no encajan).
- (media) Diversificar tipos: agregar choice/fixerr de reconocimiento (parla/parli, non parla/non parlare, alzati/alza ti, mi lavo le mani/i miei mani) y ejercicios de imperativo tu afirmativo con -ere/-ire y con pronombre.
- (media) Sumar a la teoría el passato prossimo de los reflexivos (mi sono alzato) y los imperativos irregulares esenciales (sii, abbi, sappi, vieni, esci), o decir explícitamente que van en otra semana.
- (media) Quitar duplicados: 'esco di casa' aparece en g2-ct-08, g2-va-23, r18-01b:a y en el vocabulario; 'chiamami domani' en g2-ct-09 y g2-va-58; radersi en d09-009 y d09-017; divertirsi en d09-016 y r18-04:c.

### Semana 13 · A2 · BOSS — Livello A2 — bien con reparos

Semana de repaso (jefe final) sin teoría nueva. El italiano de los 11 ítems, las tablas y la lectura es correcto y natural; no encontré errores duros. Los reparos son de diseño: la hoja de repaso no cubre 'preposiciones básicas' (que figura en las keys), dos reglas están simplificadas de modo engañoso (avere con objeto directo; 'sin diptongo'), y el par mínimo corre/core afirma que 'core' no existe. Nota: el dossier trae solo 11 de los ~511 ítems declarados en parts (n_items 305/114/92), y ninguno practica pronombres, passato prossimo, reflexivos ni imperativo, así que la cobertura real no se pudo verificar. Tasa estimada de falsos positivos: ~20% (los hallazgos son en su mayoría dudas/mejoras).

**Bien:** Hoja de repaso clara y compacta: tablas de artículos, presente regular/-isc, irregulares y modales, con ejemplos traducidos en voseo natural.; El bloque 'Las cinco trampas del hispanohablante' es muy bueno: contrasta lo que más cuesta (no diptongar, acento de loro, il mio, sin 'a' personal, da + presente) con mini-preguntas de opción única bien diseñadas.; La advertencia sobre venire ('¡ya voy!' = vengo!) es precisa y útil para rioplatenses.; La lectura 'La nuova vicina' es natural, ancla el repaso (presente, passato prossimo, pronombres l'/le/mi) y la caza de formas coincide con lo que se enseña.

**Mejoras:**
- (alta) Agregar bloque de preposiciones (a/di/da/in/su/per/con + preposiciones articuladas, y a/da con lugar y persona) a la hoja de repaso.
- (alta) Corregir/precisar dos reglas: 'avere con objeto directo' y 'Sin diptongo' (ver hallazgos).
- (media) Revisar la muestra de ítems: reponer ítems de pronombres, passato prossimo (auxiliar y concordancia), reflexivos, imperativo y posesivo con artículo, que son las cinco keys, y retirar ítems triviales como 'Luisa canta.'. Verificar por qué el dossier trae solo 11 de ~511.
- (media) Ampliar la hoja con: verbos en -care/-gare/-iare (cerchi, giochi, mangi), passato prossimo de reflexivos, imperativo afirmativo regular y de dire (di', dimmi), y el usted (Lei).
- (media) Sumar un dictogloss corto de repaso y 3-4 pares mínimos/entonación/acento (p. ej. caro/carro, pena/penna, e/è).

### Semana 14 · A2 · Piacere e verbi simili — bien con reparos

La teoría es correcta y clara (mecanismo, tónicos, essere, familia de piacere) y casi todos los ítems son gramaticalmente sólidos. Los problemas están en el diseño: casi no se practica nada de lo que el 'fare' promete (invitar, aceptar, rechazar), hay 10 ítems choice idénticos y ningún tipo de producción libre, servire y el plural del participio no se practican, y unos 14 ítems (marcadores l2-d, ct-68/69, va-27) son ajenos al tema. Un accept faltante seguro (g2-va-57) y algunas consignas que prometen ejemplos que no se muestran.

**Bien:** La lección explica bien el mecanismo sujeto/persona, con el contraste con «gustar» y advertencias precisas (a me mi piace, mi ha piaciuto, mi manchi = te extraño).; Bloque sobre essere + concordancia con lo que gustó, con los cuatro géneros/números en los ejemplos.; La tabla de la familia de piacere es útil y las notas de mancare (sujeto = el que falta) atacan el error típico rioplatense.; Los ítems de mancare (d10-051..055) fuerzan la inversión con distintas personas, con accepts razonables.

**Mejoras:**
- (alta) Agregar un bloque de lección y 6-8 ítems para el 'fare' de la semana: invitar (Ti va di...? / Vuoi venire...?), aceptar (Volentieri, Certo, Con piacere) y rechazar (Mi dispiace, non posso, Non mi va), con verbos de hobbies/deportes/salidas.
- (alta) Sacar o mover a otra semana los 8 ítems de marcadores (l2-d-*), g2-ct-68/69 y g2-va-27, y sustituirlos por ítems de la semana (servire, occorrere, dispiacere, mi manchi/ti manco, Anche a me/Neanche a me).
- (alta) Diversificar tipos: hoy hay 10 choice con la misma consigna, 14 conjugate, 5 translate y casi nada más. Sumar typed/combina (persona + pronombre + verbo), qa (Ti piace...? Sì, mi piace / No, non mi piace), listen y fixerr sobre mi ha piaciuto / a me mi piace.
- (media) Enseñar la tabla de pronombres indirectos (mi, ti, gli, le, ci, vi, gli/a loro) y los tónicos completos (a me, a te, a lui, a lei, a noi, a voi, a loro) antes de los ítems que los usan, y agregar el contraste con Mi piaci / Ti piaccio (personas).
- (media) Equilibrar el pasado: hoy 4 conjugate idénticos con «è piaciuto» y 1 cloze con «è piaciuta»; falta el plural (sono piaciuti/e), la comparación piace vs è piaciuto/piaceva (la consigna la menciona pero ningún ítem exige imperfetto).

### Semana 15 · A2 · Imperfetto e il contrasto con il passato prossimo — bien con reparos

Semana correcta en lo lingüístico: casi no hay errores de italiano ni de español y la teoría es clara y concisa. El problema es de diseño: 20 de 36 ítems son drills de conjugación/traducción del imperfetto y el contraste con el passato prossimo (tema central) tiene pocos ítems; hay ítems y desafíos de otros temas (partitivos, ognuno, da, presente) y contenido de nivel superior (futuro en el pasado). Cortesía, verbos modales y sapere/conoscere sin práctica. Tasa estimada de falsos positivos: ~20-25%.

**Bien:** Regla central bien formulada: no «puntual/duradero» sino qué mira quien habla (fondo vs hechos), con tabla de contraste y advertencia sobre la duración.; Bloque de tabla de conjugación + tip de acentuación de «loro» y bloque de irregulares breves y correctos.; Bloque «El mismo verbo, dos lecturas» (sapere, conoscere, potere...) con paralelo con podía/pude en castellano.; Lecturas naturales y con imperfetto/passato prossimo bien usados (mentre + imperfetto, quando... ), con caza de formas correcta.

**Mejoras:**
- (alta) Agregar 10-15 ítems de contraste imperfetto/passato prossimo: choice/cloze con mentre/quando, marcadores (sempre, ogni giorno, ieri, un giorno, all'improvviso), un fixerr de cada tipo y un texto con huecos (racconto).
- (alta) Agregar ejercicios para lo enseñado sin práctica: irregulares (dire, bere, fare, tradurre en conjugate), cortesía (volevo/cercavo) y contraste sapere/conoscere/potere/volere (imperfetto vs passato prossimo).
- (media) Corregir la coherencia de nivel (A2 vs «B1» en la intro y el dictogloss) y mover r20-07b (futuro en el pasado) a una semana posterior.
- (media) Diversificar lecturas y dictogloss: hoy tres textos repiten «Quando ero piccolo... Un giorno, però, è successa una cosa strana» con un perro; usar un relato con secuencia de passato prossimo (historia ordenada) y otra región.
- (media) Agregar a la lección: marcadores temporales típicos de cada tiempo, stare + gerundio (ya aceptado en accept), imperfetto en discurso indirecto (era grave) y error típico del hispanohablante (usar passato prossimo por «fui/estaba»).

### Semana 16 · A2 · Riflessivi al passato — bien con reparos

El núcleo de la semana (reflexivos con essere, concordancia, recíprocos, modales con pronombre delante/pegado) es correcto y bien explicado, con contraste útil con el español y buena nota de error típico. No encontré errores de italiano en las respuestas aceptadas; los problemas son de diseño: 8 ítems y 5 de las 8 sfide son de otros temas (marcadores, si pasivante, di/a, artículos), los ítems 11-20 exigen imperfetto sin haberlo enseñado, hay ítems casi duplicados y algunas concordancias con el objeto aceptadas con poca base. La lectura es natural pero solo usa 3.ª persona y el dictogloss está marcado B1.

**Bien:** Regla central clara y repetida desde varios ángulos: essere siempre, concordancia con el sujeto, contraste con avere y con el español.; Bloque 2 (mismo verbo con y sin pronombre) y sfide r25-01 (mitad no reflexivas) entrenan justo la confusión típica.; Bloque de modales con las dos opciones y el «no mezclar» explícito; sfide r20-10 lo practica en producción.; Distractores de choice bien pensados (mi ho / sono lavato / concordancia de género) y consignas con indicación de sexo del hablante.

**Mejoras:**
- (alta) Añadir un mini-bloque de teoría sobre reflexivos en imperfetto vs passato prossimo, o quitar el imperfetto de los ítems d17-011..020.
- (media) Sumar producción más libre: typed/translate con 1.ª y 2.ª persona, negación (non mi sono...), pronombre pegado al infinitivo y participios irregulares (messo, visto, seduto).
- (media) Variar la lectura: incluir 1.ª/2.ª persona (diálogo) y añadir preguntas vero/falso/non si dice y una sobre los auxiliares.
- (media) Reducir duplicados (divertirsi/ci siamo divertiti, si è svegliata/si è alzata) y decidir una política única sobre la concordancia con el objeto.

### Semana 17 · A2 · Dimostrativi, possessivi, indefiniti — bien con reparos

La teoría es correcta y concisa, con buenas advertencias sobre suo, qualche y ogni, y los ítems de posesivos y demostrativos son casi todos sólidos. Hay un error real de accept/nota en g2-ct-17 y ejercicios que evalúan cosas no enseñadas (posesivo pronominal, qualsiasi, vari). La cobertura es desigual: sobran ítems de mia madre y faltan de ogni, tutto, molto adverbio y quel/quei. El tema declarado (ambientes y muebles) casi no aparece. Tasa estimada de falsos positivos: ~15%.

**Bien:** Regla de posesivos clara, con concordancia con lo poseído y excepción de parentesco con contraste (mio padre / i miei fratelli / il loro padre).; Advertencias específicas al hispanohablante: suo no mira al dueño, qualche + singular, ogni invariable, molto adverbio.; Ítems de cloze de questo/quello y de traducción de posesivos con respuestas correctas y notas útiles.; Lectura breve que reúne todos los demostrativos e indefinidos con caza de formas coherente con las glosas (quel vecchio specchio bien resuelto).

**Mejoras:**
- (alta) Corregir g2-ct-17: quitar «di mio amico Paolo» de accept y reescribir la nota.
- (alta) Agregar a la lección el posesivo pronominal (il mio, i tuoi, senza nome) y su artículo, o sacar los 10 ítems d13-041 a d13-050.
- (alta) Cubrir el tema declarado: vocabulario de ambientes y muebles (cucina, camera, divano, sedia, tavolo) con frases y algún ítem, y describir la casa.
- (media) Sumar ítems de ogni, tutto, qualche/alcuni en cloze, molto vs molti (adverbio), altro, nessuno + non, y quel/quei; recortar los ítems repetidos de mia madre.
- (media) Sacar los ejemplos de la consigna de d13-011 a d13-030 o enseñar qualsiasi, vari, diversi, parecchio, ognuno, ciascuno.

### Semana 18 · A2 · Negazioni ed esclamazioni — bien con reparos

La teoría es correcta, corta y bien contrastada con el español, y las dos lecturas practican muy bien la gramática de la semana. El italiano de ítems, lecturas y dictogloss está prácticamente limpio. Los problemas están en el ejercicio: solo unos 12 de los 22 ítems son de tema (el resto son marcadores de discurso o frases sueltas), hay puntos enseñados sin ninguna práctica (né…né, mica, non…che, ancora) y todo es de elección o traducción. Además hay un error de nota fonética (cielo), un fixerr discutible y una pregunta de lectura mal formulada. Estimo ~25 % de falsos positivos en las 'dudas'.

**Bien:** La regla central (negativo detrás del verbo lleva non, delante no) está clara y el contraste con el castellano es correcto y tranquilizador.; La advertencia sobre non… che = «solo» y la nota sobre mica (registro, posición inicial sin non) son de gran valor y evitan errores reales.; La lectura fl-mica (Non è mica tardi) es natural, con muchísimas ocurrencias de mica, niente, nessuno, mai, neanche y más, y w-18 recicla né… né, neanche y non… ancora en una historia breve.; Las exclamaciones che / come / quanto están bien delimitadas (che + sust./adj. sin artículo; come/quanto + verbo) con un warn útil.

**Mejoras:**
- (alta) Agregar ítems propios de la semana (unos 8-10): mica (cloze/choice), né… né, non… che = solo (comprensión), non… ancora vs non… più, niente/nulla, nessuno vs nessun, y un typed/cloze de producción con la posición de mai.
- (alta) Reubicar o eliminar ítems ajenos: g2-ct-72 (In bocca al lupo), l2-d-14 y l2-d-34, y aligerar la carga de marcadores de discurso (Magari, Boh, Per carità) que aparecen sin haberse enseñado en la lección.
- (alta) Corregir la nota fonética de cielo/chelo y la pregunta de la lectura fl-mica (no quiere pagar).
- (media) Diversificar tipos de ejercicio: agregar cloze, typed o combina (mica/né…né) y un par de ítems de producción de exclamaciones (Che + adj., Come/Quanto + verbo con transformación).
- (media) Enseñar en la lección la posición de mai/più/ancora con el passato prossimo, o quitarla de la evaluación, y reformular la nota de g2-va-66.

### Semana 19 · B1 · Futuro semplice e anteriore — bien con reparos

La teoría es corta, correcta y bien ordenada (raíces, futuro anteriore, suposición, quando+futuro) y los ítems propios están casi todos bien. Las debilidades son de diseño: 19 cloze regulares seguidos, poca práctica de raíces irregulares, futuro anteriore y suposición, y de los 59 sfide más de la mitad son de otros capítulos. Hay pocos errores duros: una nota falsa sobre cambiare, un accept incorrecto (la ha) y un par mínimo inválido (vólgo/vòlgo). Falsos positivos estimados: ~20-25%.

**Bien:** Teoría breve, con tabla de terminaciones, tabla de raíces irregulares y contraste explícito con el castellano (quando + futuro, no subjuntivo).; Se enseña bien el uso más italiano del futuro (suposición) con ejemplos de hora, edad y lugar, y con la regla ortográfica cercherò/mangerò.; Los ítems de traducción quando/appena/se tienen accept amplio y consignas que avisan de la variante hablada.; Las lecturas usan futuro de forma natural, con temas de la semana (colloquio, vacaciones) y caza de formas completa.

**Mejoras:**
- (alta) Rebalancear los ítems propios: bajar los 19 cloze regulares seguidos a ~8 y agregar choice/cloze de raíces irregulares (andare, venire, volere, dovere, potere, rimanere, bere), futuro anteriore (más de 5) y suposición.
- (media) Agregar a la teoría: presente per futuro (Domani vado...), contraste voy a + inf ≠ andare a, tra/fra un'ora, -iare con i tónica (studierò, cambierò) y el participio concordado en futuro anteriore (saranno partiti).
- (media) Corregir la nota de r19-08:c, el accept de r07-01i:c y el par p-091; revisar p-117/p-142/p-056.
- (media) Sumar ítems quando/appena/se con cloze o choice (no solo traducción) y armar accept coherente con el presente hablado.

### Semana 20 · B1 · Condizionale presente — bien con reparos

La teoría es correcta, corta y bien ejemplificada, y los ítems del condizionale (cloze, translate, choice, fixerr) son casi todos correctos. Los problemas son de diseño: los 19 cloze son idénticos, 12 ítems repasan otros tiempos, y 13 sfide de capítulos ajenos o posteriores inflan la carga (~112 actividades). La lección no enseña ortografía ni raíces irregulares que se exigen, y la noticia no confirmada no tiene ejercicios. Hay pocos errores puntuales: ítem con dos respuestas correctas, una nota falsa en suoni y «en el mar» en una pregunta. Estimo ~15% de falsos positivos entre las dudas.

**Bien:** Teoría concisa con tabla completa, ejemplos traducidos y aviso clave sobre noi (-emmo vs -emo).; Cubre los tres usos del tema (cortesía/deseo/consejo, rumor, adelanto de se) con ejemplos naturales.; Ítems del condizionale casi sin errores de italiano; buenos fixerr (Vorrebbo, potria) y aceptación de variantes en translate.; Sfide r21 bien graduadas: formas regulares, irregulares con doble r, dovere/potere/sapere/volere y piacerebbe.

**Mejoras:**
- (alta) Agregar al bloque «Las formas» dos apartados: ortografía (-care/-gare → cher-/gher-, -ciare/-giare pierden i, -iare) y raíces irregulares (andr-, dovr-, potr-, vedr-, vivr-, sapr-, verr-, berr-, rimarr-, dar-/far-/star-), con contraste futuro/condicional (parlerò/parlerei, parleremo/parleremmo).
- (alta) Añadir ejercicios de reconocimiento y producción del condicional de rumor (elegir «è/sarebbe», reescribir titulares) y de contraste condicional vs futuro; hoy solo la teoría lo trata.
- (media) Variar los 19 cloze d18 (todos idénticos): sumar choice condizionale/futuro, transformar «Voglio…» → «Vorrei…», tú/Lei, mini-diálogos de bar, hotel y oficina (tema de la semana).
- (media) En la teoría, enseñar la diferencia tú/Lei/voi en pedidos (Potresti/Potrebbe/Potreste), «Le dispiacerebbe…?», «Avrei bisogno di…» y un cuadro de errores típicos rioplatenses (vorrei vs voglio, doble m, se avrei).
- (media) Alinear la sección suoni con el tema: pares parleremo/parleremmo, avrei/avrai, sarebbe/sarebbero; eliminar el par duplicado p-170 y corregir la nota de p-057.

### Semana 21 · B1 · Le particelle NE e CI — bien con reparos

Teoría breve y clara con ejemplos rioplatenses y contraste con el español; el núcleo (ne partitivo, ne = di, ci locativo, ci = a, expresiones fijas) está bien cubierto y las lecturas y el dictogloss usan bien la gramática de la semana. Los problemas: una regla exagerada (ci obligatorio), casi un cuarto de los ejercicios (cortesía, dislocación con li, verbos de percepción, pronombres dobles y ne con da) no corresponde a lo enseñado, y algunos ítems de suoni y sfide tienen fallas de diseño. Poca práctica de farcela, avercela y non poterne più, sin ítems de escucha o producción libre.

**Bien:** Reglas cortas con contraste explícito con el español y el criterio práctico «di → ne, a/in/su → ci».; Buena cobertura del ne partitivo con concordancia del participio (c1-ne-03, sfide r07-04i, lectura fl-ne).; Distinción volerci/metterci bien explicada y practicada en varios ítems (c1-ci-03/04, l2-c-96/97/98).; Tres lecturas con contexto verosímil (mercado, biblioteca, bar) y caza de formas pertinente.

**Mejoras:**
- (alta) Corregir la regla «ci obligatorio» (lesson:2) y los ítems/notas que la repiten (g2-ct-25, g2-sc-11), aceptando «Sì, vado domani».
- (alta) Sacar o reubicar los ítems ajenos a NE/CI: 12 de cortesía (g2-out-cor), g2-ct-26, r10-15:a y r27-06c.
- (alta) Agregar a la lección un bloque breve de posición (con infinitivo: vederci, comprarne; imperativo) y de pronombres dobles (me ne vado, ce n'è, se ne sono andati) o retirar los ítems que los exigen.
- (media) Sumar 6-8 ítems propios de expresiones (farcela, avercela, non poterne più, averne abbastanza) y de ci = a con verbos varios (riuscirci, crederci, contarci); hoy casi no se practican.
- (media) Incluir en teoría que ne remite a cosas y para personas se usa di lui/di lei; sumar ne = «de ahí» solo si se lo va a evaluar (r07-04c:g/h).

### Semana 22 · B1 · Pronomi combinati — bien con reparos

La teoría núcleo (tabla mi→me, glielo, participio, imperativo) es correcta y clara, con buenos avisos contra el calco «se lo». Los ítems no tienen errores graves de italiano, pero hay 1 opción distractora que contradice la regla (g2-sc-12), 1 respuesta aceptada incorrecta en una sfida (r20-06:d) y 1 incoherencia en una lectura (fl-combinati). El principal problema es de cobertura: «ne» no se enseña y se exige mucho, y el imperativo y el participio casi no se practican; 10 de 28 ítems son la misma tabla. Varias sfide son de otros temas.

**Bien:** Tabla completa de combinaciones (mi/ti/gli-le/ci/vi/si × lo/la/li/le/ne) y aviso claro «mi lo no existe».; Buen contraste con el castellano: glielo vs «se lo», y se lo reflexivo (se lo mette).; Las sfide de combinados (r07-01g, 02h, 03h, 04g, 06b, 07b) son naturales, contextualizadas y con respuestas correctas y variantes aceptadas amplias.; La lectura fl-combinati muestra bien glielo/gliela/glieli/gliene y las formas pegadas (dirglielo, portaglielo) en un diálogo cotidiano.

**Mejoras:**
- (alta) Agregar a la lección un bloque sobre «ne» (partitivo y di+sustantivo: ne ho, ce ne sono, ce n'è, me ne occupo) y su concordancia con el participio (ne ho comprati tre).
- (alta) Sumar 6-8 ítems propios de producción: imperativo/infinitivo pegado (dammelo, diglielo, portarmelo, non dirmelo) y passato prossimo (me l'ha data, gliele ho date).
- (alta) Reequilibrar los ítems: 10 de 28 son la misma tabla mecánica (d08-031..040). Reducir a 5-6 y agregar ítems en contexto con elección, fixerr con errores típicos (mi lo, gli lo, se lo) y traducción.
- (media) Ampliar el contraste con el castellano: se lo→glielo, nos lo/os lo→ce lo/ve lo, se lo reflexivo, y los errores típicos (mi lo, gli lo, glie lo separado, orden inverso).
- (media) Corregir el punto de imperativo: aclarar que Lei/formal va proclítico y que con «non + infinitivo» valen las dos posiciones.

### Semana 23 · B1 · Comparativi e superlativi — bien con reparos

La teoría de di/che, igualdad, superlativos e irregulares es clara y con buenos ejemplos. Hay pocos errores graves (concordancia en c1-comp-04, 'Oggi Sabato', consigna de r28-01, nota de 'fàcile'), pero el tema declarado (ropa, colores, talles) no se practica, se evalúan estructuras no enseñadas (di quanto) y hay demasiados ítems di/che repetidos, casi todos choice/cloze. Las sfide no se relacionan con el tema.

**Bien:** Regla di/che clara con tabla, ejemplos y la 'idea de fondo' contrastiva.; Advertencia útil sobre migliore/meglio y sobre no repetir el artículo en el superlativo.; Buena cobertura del superlativo absoluto con concordancia (strettissime) y de il più...di.; Lectura natural con comparativos, 'meno', 'quanto', migliore y buonissimi; preguntas verificables.

**Mejoras:**
- (alta) Alinear el tema con los contenidos: 'Ropa, colores, talles' no aparece en ningún ítem ni en la lectura. Incluir ítems y lectura con prendas, talles y precios (più largo, meno caro, la taglia più piccola).
- (alta) Agregar a la teoría 'di quanto / di quel che + verbo' o quitar los ítems que lo exigen (d15-022, c1-comp-04, 'del previsto').
- (alta) Corregir el ítem c1-comp-04 (concordancia sembri/ha) y rf-22-10 (Oggi Sabato), y la consigna de r28-01.
- (media) Sumar tipos de producción: typed/conjugate/qa; hoy predomina choice/cloze con 2 opciones triviales. Solo hay 2 fixerr y ningún listen.
- (media) Ampliar la teoría con 'sempre più', 'molto più', 'più ... che mai', 'più di / meno di' + número, e advertir que 'più grande' es lo normal para tamaño.

### Semana 24 · B1 · Congiuntivo presente: forme — bien con reparos

La teoría de formas es clara y correcta (tablas exactas, irregulares bien elegidos, buen contraste con el castellano) y las respuestas del banco son casi todas correctas. Los problemas son de diseño: los ítems c1-cong exigen decidir por uso lo que la lección posterga a la semana 25, hay ortografía (paghi, comincino, mangi) no enseñada y las sfide mezclan capítulos ajenos (sufijos, pasiva). Hay una nota fonética inexacta (pranzo) y una opción doble en c1-cong-05. Pocos falsos positivos esperables en los errores (~10-15%); las dudas son más discutibles (~35%).

**Bien:** Las tablas del congiuntivo (regulares, -isc y 16 irregulares) son correctas y completas para el nivel.; El truco «noi = indicativo, voi sale de noi» reduce la carga de memoria y es exacto.; La comparación con la vocal del castellano (-ar → e vs -are → i) ataca el error típico del hispanohablante.; El bloque «Ya lo venías usando» conecta con el imperativo formal ya conocido.

**Mejoras:**
- (alta) Alinear los ítems con lo enseñado: mover c1-cong-05/07/08/09 a la semana 25 o agregar un bloque breve de disparadores (credo che, spero che, voglio che, bisogna che).
- (alta) Agregar un bloque de ortografía (-care/-gare, -ciare/-giare, -iare) y una lista corta de verbos -isc (capire, preferire, spedire, tradire).
- (alta) Corregir c1-cong-05 (dos opciones válidas) y su nota sobre «si dice che».
- (media) Diversificar tipos de ejercicio: agregar conjugate/tabla, fixerr («che parla» → «che parli») y typed con noi y voi; hoy solo hay cloze y choice.
- (media) Balancear cobertura: agregar ítems de noi, dovere (debba/debbano), uscire, scegliere, y voi irregular.

### Semana 25 · B1 · Congiuntivo: quando si usa — bien con reparos

La regla central (credo che + congiuntivo frente a so che + indicativo) está bien explicada y practicada con pares de contraste muy buenos. Casi todo el italiano es correcto; hay un error claro en el acento de 'desidero' (a-023). El problema principal es de cobertura: las 'keys' prometen negación de verbos declarativos, conjunciones (benché, sebbene, prima che...), superlativo y relativas, pero la lección solo tiene 4 bloques sobre opinión/hecho/mismo sujeto, y varios ítems evalúan lo no enseñado (sebbene, chiunque). 17 de 36 ítems son cloze de conjugación con el verbo entre paréntesis, lo que practica la forma y no la decisión de modo. Tasa estimada de falsos positivos: ~20-25% en las dudas, ~10% en los errores.

**Bien:** Pares de contraste opinión/hecho (g2-out-cer-01..10: penso che sia / so che è, credo che abbiano / è vero che hanno) que entrenan justo la decisión de modo, que es el foco de la semana.; Buen enfoque contrastivo con el español (creo que es / credo che sia) y tip claro: 'si pasa por la cabeza de alguien, congiuntivo'.; Bloque 'Cuándo NO va congiuntivo' con so che, è vero che, secondo me y la lista extra (è certo, è chiaro, dico che, sono sicuro che).; Traducciones con acepta amplio y notas útiles (io/tu/lui coinciden, sperare admite futuro, ustedes = voi).

**Mejoras:**
- (alta) Completar la lección con lo que declaran las keys: bloque de conjunciones (benché, sebbene, prima che, affinché, purché, a meno che), negación de verbos declarativos (non dico che sia) y una mención breve de superlativo/antecedente indefinido; o mover esos contenidos a la semana siguiente y quitar las keys.
- (alta) Rebalancear los ítems: reducir los cloze de conjugación con el verbo entre paréntesis (d20-0xx) y agregar ítems de decisión (choice congiuntivo/indicativo, fixerr con indicativo tras credo, garden, typed, listen).
- (alta) Corregir a-023: acento de desìdero (opciones y nota).
- (media) Agregar práctica del contraste mismo sujeto/che: Credo di avere / Credo che abbia; Voglio partire / Voglio che tu parta; y de sperare di vs volere sin di.
- (media) Agregar ejercicios para categorías enseñadas sin práctica: aspettare che, emoción (sono contento che / ho paura che), impersonales (è possibile/bisogna) y secondo me + indicativo.

### Semana 26 · B1 · BOSS — Livello B1 — bien con reparos

Semana de repaso (BOSS) con teoría correcta y compacta; no encontré errores gramaticales firmes en italiano ni en las respuestas aceptadas. Los problemas son de diseño: los ítems del dossier se concentran en piacere y en un puñado de temas (los 'keys' de comparativos, negaciones y imperfetto/passato prossimo casi no se practican), las sfide arrastran contenido de capítulos posteriores (percepción con infinitivo, participio absoluto) y faltan variantes en accept. La lectura contradice la regla del congiuntivo y no hay dictogloss; el par de suoni es débil. Estimo ~40% de falsos positivos entre las dudas, porque el dossier trae solo una muestra de los 355 ítems declarados.

**Bien:** Teoría breve y ordenada en 8 bloques, con reglas cortas, ejemplos traducidos y contraste con el español (trapassato, se elige auxiliar, quando + futuro).; Tabla del congiuntivo presente y aviso 'credo che sia' / 'credo di avere ragione' claros y correctos.; Tabla de raíces de futuro/condicional bien elegida y correcta; la regla 'misma raíz para ambos' es útil.; Las notas de los ítems de piacere explican el porqué (costumbre → imperfetto, infinitivo → singular) y el accept de d10-032 admite las dos lecturas válidas.

**Mejoras:**
- (alta) Reequilibrar los ítems: hoy 15 de los 22 del dossier son de piacere (d10). Cubrir por igual los 'keys': passato prossimo vs imperfetto, futuro/condizionale con raíces irregulares, combinados y ne/ci, congiuntivo tras opinión/deseo/duda, comparativos y negaciones.
- (alta) Ampliar el bloque del congiuntivo: verbos en -ire (finisca/dorma), irregulares frecuentes (vada, venga, faccia, possa, voglia, sappia, dica), el uso de 'che io/tu/lui' para desambiguar, y un ejemplo de duda ('dubito che', 'non so se').
- (alta) Agregar a la teoría (y a los ítems) negaciones dobles (non... mai/niente/nessuno), que figuran en los keys pero no en la lección.
- (media) Ampliar pronombres: 'gliene / me ne', concordancia del participio con combinados ('me li ha dati'), 'glielo' para le (formal) y 'ce lo/ce ne'.
- (media) Agregar un dictogloss corto (p. ej. una versión resumida del diario con futuro y congiuntivo) y un par de suoni relevante (raddoppiamenti: parlerò/parlero, parleremo/parleremmo; ho/o).

### Semana 27 · B1 · Avverbi — bien con reparos

El italiano de los ítems y de la lectura es correcto y natural; no encontré errores de lengua en los ejercicios. Los problemas reales están en suoni (un par mínimo con glosas invertidas y una nota que describe la opción equivocada) y en el diseño: la teoría es corta y no cubre buena parte de lo que se evalúa (appena, ormai, fra poco, meglio/peggio/benissimo, adjetivos usados como adverbios, -lentemente, leggermente). Hay sobrerrepresentación de -mente (unos 16 ítems) frente a la posición (unos 6), tres ítems casi duplicados con 'sempre tardi' y un bloque de 10 traducciones de vocabulario sin relación con la lección. Estimo una tasa de falsos positivos de ~15-20% en los hallazgos de tipo 'duda' y ~5% en los 'error'.

**Bien:** La regla central de -mente (femenino + -mente, vocal + -le/-re pierde la e) es correcta y se ejercita con ítems limpios, con notas útiles y con la trampa 'facilemente' explicitada.; El contraste adjetivo/adverbio (bene/buono, meglio/migliore, peggio/peggiore) es el error típico del hispanohablante y está bien elegido, con distractores que evalúan la regla.; La regla de colocación entre auxiliar y participio (ho già mangiato, non sono mai stato) se enseña en el tip y se practica en los ítems.; La lectura 'Il primo mese di Chiara' usa naturalmente los adverbios de la semana, y la caza de formas (6 targets) coincide exactamente con el texto.

**Mejoras:**
- (alta) Ampliar la lección con lo que realmente se evalúa: (a) comparativos y superlativos de adverbios (meglio/peggio/benissimo/malissimo, più forte); (b) adjetivos usados como adverbios (forte, piano, chiaro, veloce, vicino); (c) excepciones de -mente (leggermente, -lentemente); (d) un bloque de 'connettivi/locuzioni de uso frecuente' (appena, ormai, fra poco, domattina, soprattutto, purtroppo).
- (alta) Corregir en suoni el par p-095 (glosas cóppa/còppa invertidas) y la nota de a-024.
- (alta) Agregar el contraste con el español que más rinde en este tema: en español solo el último adverbio de una serie lleva -mente («clara y lentamente»), en italiano lo llevan todos («chiaramente e lentamente»).
- (media) Rebalancear las 45 ítems: reducir los 8 cloze consecutivos de -mente y los ~16 ítems de formación a ~10, y sumar más práctica de posición (ampliar más allá de 1 fixerr y 2 choice): orden con non...mai/più/ancora, adverbio antes de adjetivo, tiempos compuestos.
- (media) Reordenar los ítems por dificultad y agrupar por punto (formación → irregulares/bene-meglio → posición → locuciones), en lugar de mezclar series d15, g2 y rf; usar `parts`, que hoy está vacío.

### Semana 28 · B1 · Connettivi e transizioni — bien con reparos

El italiano de ejercicios, lectura y dictogloss es correcto: no encontré errores gramaticales ni de ortografía. Los problemas son de diseño y de contenido: la regla de siccome ('siempre al principio') es demasiado absoluta y un ítem la contradice, y buena parte de lo que se evalúa no se enseña en la lección (anche se, comunque, lo stesso, né…né, non solo…ma anche, cioè, per quanto, a tal punto, a condizione di). Además, los bloques 2 (prima di/dopo/appena/finché) y 3 (ordenar un argumento) no tienen ningún ejercicio, y falta una producción argumentativa, que es el objetivo del fare. Tasa estimada de falsos positivos: 15-20 % (sobre todo en las dudas).

**Bien:** Italiano de los ítems, la lectura y el dictogloss correcto, natural y sin calcos del español.; Los ejercicios combina (g2-cb-01 a 09) practican conectores en producción, con varias respuestas aceptadas y notas claras.; Lectura 'Città o campagna?' con buena densidad de conectores (infatti, inoltre, tuttavia, quindi, invece, però, comunque) y actividad de caza de formas coherente con el tema.; El dictogloss modela un argumento completo (opinión, concesión, contraste, consecuencia) que encaja con el fare 'Argumentar a favor y en contra'.

**Mejoras:**
- (alta) Alinear lección y ejercicios: agregar a la lección anche se + indicativo, comunque/lo stesso, né…né, non solo…ma anche, cioè/ossia, infatti/in effetti, a condizione che/di, o retirar del banco de ítems lo que no se enseña.
- (alta) Corregir la regla de siccome/perché (pasar de 'siempre/nunca' a 'suele/se prefiere') en lección, keys y notas, y quitar la variante contradictoria de g2-cb-02.
- (alta) Agregar ejercicios para el bloque 2 (prima di/dopo aver/appena/finché) y el bloque 3 (ordenar un argumento: innanzitutto, poi, d'altra parte, infine), hoy con cero ítems.
- (alta) Agregar ejercicios de congiuntivo tras benché/sebbene/affinché/purché/prima che (elegir indicativo/congiuntivo, conjugar) y de contraste con anche se.
- (media) Agregar una actividad final de producción: escribir 4-5 frases o un párrafo argumentativo con conectores dados (tipo 'typed' o 'qa'), o reordenar un texto por conectores.

### Semana 29 · B2 · Congiuntivo passato — bien con reparos

La teoría es correcta, corta y con buenos contrastes con el castellano; el italiano de todos los ítems, lecturas y dictogloss es correcto y natural. Los problemas son de diseño. Hay solo 13 ítems, casi todos cloze idénticos, y ninguno practica la decisión presente/passato (bloque 3) ni los errores típicos. Las sfide arrastran contenido no enseñado esta semana (conjunciones con presente, relativas, reflexivos) y un par de accept/consignas incoherentes. Falta el punto clave del hispanohablante: penso di aver + infinitivo vs. che + congiuntivo.

**Bien:** Regla mínima y clara: abbia/sia + participio, con la tabla completa con avere/essere y la concordancia marcada (andato/a).; El bloque 'Presente o passato' con su tabla (ahora/después vs. antes) resuelve la decisión central del tema con pares mínimos (venga/sia venuto; stia/sia stato).; Contraste constante con el castellano (haya + participio o pretérito) y aviso útil sobre 'dopo che' + indicativo.; Los 10 cloze están equilibrados (5 con avere, 5 con essere), con feminino/plural aceptados en los participios con essere.

**Mejoras:**
- (alta) Añadir ítems de decisión presente/passato (choice y cloze, p. ej. «Credo che ieri ___ / domani ___») y de contraste que-vs-di (Penso di aver capito / Penso che tu abbia capito), que hoy tienen cero ítems pese al bloque 3.
- (alta) Diversificar los tipos de ejercicio: agregar fixerr (dopo che sia, credo che ha mangiato), conjugate, combina y typed; hoy son 10 cloze idénticos, 2 choice y 1 translate.
- (media) Añadir a la lección: nota de que io/tu/lui comparten forma (usar el pronombre), que abbiamo/siamo coinciden con el indicativo, y errores típicos (Credo che ha…, Penso che sono partito); matizar la regla de superlativos (congiuntivo frecuente pero no obligatorio) y comentar el imperfetto («Credo che fosse malato») para acciones durativas.
- (media) Añadir una lectura B2 más centrada en el tema y ampliar suoni (hoy solo un ítem connesso; pares, intonazione y accento vacíos): pares como abbia/abbía, sia/sì, geminadas (arrivato/arivato) y entonación de dubbio.

### Semana 30 · B2 · Congiuntivo imperfetto e trapassato — bien con reparos

La teoría es correcta, corta y bien contrastada con el español; casi todo el italiano es impecable. Los problemas están en el diseño: 12 de 36 ítems no practican el imperfetto ni el trapassato (son presente/indicativo o marcadores discursivos), no hay ningún ítem de "come se" (enseñado en el bloque 4) ni de práctica del tema de la semana (prensa, TV, redes, resumir una noticia). Hay un ítem semánticamente dudoso (d22-020), dos traducciones que rechazan la 3ª persona y un par mínimo (p-187) con nota fonética errónea.

**Bien:** Teoría concisa: forma, irregulares, tabla de correlación de tiempos y aviso sobre io/tu iguales y noi en -ssimo.; Buen contraste con el español (Vorrei che tu venissi = querría que vinieras) y errores típicos como benché + indicativo.; Las sfide (r24-04b, 05b, 01d, 06c) cubren irregulares, trapassato, relación temporal y suavizado de pedidos con variedad de tarea.; Los ítems d20/d22 son pertinentes, con listas accept generosas (con/sin pronombre, credere/pensare, stare + gerundio).

**Mejoras:**
- (alta) Agregar ítems de "come se" (cloze/choice, con imperfetto y trapassato) y de "se solo"/magari + trapassato.
- (alta) Reemplazar los ~12 ítems fuera de tema (c1-cong-03/04/06/10, g2-sc-13-b, g2-cb-10/13/14, l2-d-15/17/44/49) por práctica de imperfetto/trapassato, y revisar la asignación de partes (11 vs 55 ítems).
- (alta) Conectar la semana con el tema y el fare (prensa, TV, redes; resumir una noticia y contar lo que otros querían): ítems con titulares, tuits, discurso indirecto, y vocab de medios.
- (media) Agregar a la teoría el caso principal en presente + hecho pasado (Penso che fosse...), el acuerdo del participio con essere y el error típico de usar indicativo (Credevo che era).
- (media) Diversificar tipos: hoy solo cloze/translate/choice/combina. Sumar fixerr (indicativo en lugar de congiuntivo), conjugate para las formas irregulares, y traducciones con trapassato.

### Semana 31 · B2 · Condizionale passato — bien con reparos

La semana es lingüísticamente sólida: no encontré errores gramaticales en italiano ni en las respuestas aceptadas. Los problemas son de diseño: los ítems son drills muy repetitivos de un solo formato (cloze/translate), casi la mitad no practica el tema (condicional simple, concordancia del subjuntivo, sfide de otros capítulos), el Uso 3 (noticia sin confirmar) y la función «aconsejar» no tienen ningún ejercicio, y la lección no enseña modal+essere (sarebbe dovuto) que sí aparece en ítems y lecturas. Además hay varias respuestas aceptadas incompletas y un par de notas imprecisas.

**Bien:** Forma, tabla y tres usos claramente separados, con ejemplos traducidos y contraste con el español (calco «verrebbe»).; Los cloze/translate con auxiliar avere/essere y participio son correctos y con accept bien pensado para género (venuto/a, state/stati).; La lettura w-31 y fl-condpassato usan el condizionale passato de forma natural (Avrei dovuto..., Ti saresti sentito meglio?) y el hunt de formas es pertinente.; Buen dictogloss «Rimpianti» que reúne los tres usos (arrepentimiento, promesa incumplida, futuro en el pasado) con chunks útiles.

**Mejoras:**
- (alta) Agregar ítems para el Uso 3 (noticia sin confirmar: «Secondo il giornale, il ministro si ___ dimesso») y para aconsejar («Al posto tuo ___ (dire) di no»).
- (alta) Rebalancear los 46 ítems: sacar los 10 de posso/potrei y los 5 de concordancia del subjuntivo y sumar choice de elección de auxiliar, fixerr de «verrebbe», typed de reproches y ítems de contraste uso 1 vs uso 2 vs uso 3.
- (alta) Añadir a la lección el caso modal + infinitivo con verbos de essere (avrebbe/sarebbe dovuto partire), la posición de los clíticos (avresti dovuto dirmelo / me lo avresti dovuto dire) y el imperfetto coloquial como alternativa del futuro en el pasado.
- (media) Sumar a la lección un recuadro de errores típicos del hispanohablante: «avrei venuto», «ha detto che verrebbe», «avrei potuto» vs «potrei» y el «habría» periodístico contra «avrebbe» de deseo.
- (media) Reemplazar la lettura c-garibaldi por un texto B2 relacionado con la semana, o rotularla como lectura cultural B1; sumar preguntas vero/falso/non si dice en w-31.

### Semana 32 · B2 · Concordanza dei tempi — bien con reparos

La teoría es correcta, corta y bien ordenada (dos tablas, pregunta de entrenamiento, aviso del condicional simple del castellano). Casi no hay errores de italiano ni de español. El problema es la práctica: 10 de 20 ítems son el mismo cloze de tiempos compuestos (anterior) y el condizionale passato, el indicativo y el eje 'simultáneo/posterior' casi no se ejercitan. Hay un ítem (g2-sc-17-c) que contradice la propia lección, y varios ítems (l2-d-*) no tienen relación con el tema. Sfide y suoni están vacíos. Falta el vínculo con el tema (italianos y extranjeros).

**Bien:** La lección enseña la lógica en dos preguntas (¿principal presente o pasado? ¿antes, durante o después?) y la repite en el bloque 'Cómo entrenarlo'.; Las dos tablas (con congiuntivo y con indicativo) son claras y coherentes entre sí.; El aviso sobre el condicional simple del castellano («vendría») ataca el error típico del hispanohablante: credevo che sarebbe venuto, no *verrebbe*.; Los ítems d22-021 a d22-030 tienen respuestas correctas, con accept útil (aver/avere, siano partite, si sia perduta) y pistas temporales (già) que hacen el ítem resoluble.

**Mejoras:**
- (alta) Rebalancear los ítems: bajar los 10 cloze de compuestos a ~5 y agregar ≥8 ítems de condizionale passato (futuro en el pasado), de indicativo (trapassato/imperfetto/condizionale) y de simultáneo con imperfetto tras presente.
- (alta) Corregir g2-sc-17-c (aceptar «avevano» o cambiar el verbo) y ajustar la nota «Non sapevo → avessero».
- (alta) Agregar ejercicios de producción (translate del castellano «creía que vendría» → credevo che sarebbe venuto, typed, o fixerr con *verrebbe*) y de discriminación (choice congiuntivo vs. indicativo vs. condizionale).
- (media) Sacar o reubicar l2-d-16/18/46/47 y vincular ítems y lectura con «Italianos y extranjeros» / «Discutir estereotipos» (p. ej. «Pensavo che gli italiani fossero…»).
- (media) Completar la teoría con: principal en condicional (Vorrei che venissi), presente + pasado con imperfetto (Penso che fosse stanco) y una línea sobre el congiuntivo imperfetto para lo posterior tras verbos de opinión.

### Semana 33 · B2 · Periodo ipotetico — bien con reparos

La teoría es correcta, ordenada y con buen contraste con el español; el italiano de los ítems no tiene errores gramaticales confirmados. Los problemas son de diseño: 30 cloze repetitivos, poca producción, puntos enseñados sin ejercicios (doppio imperfetto, purché, qualora), ítems que evalúan lo no enseñado, un desafío que no corresponde al tema, una lectura infantil para B2 y un par mínimo con una no-palabra. La regla «nunca condicional tras se» está sobregeneralizada. Tasa estimada de falsos positivos en errores/dudas: ~25%.

**Bien:** Teoría clara: tabla de los tres tipos, ejemplos con traducción rioplatense y advertencia explícita sobre «se avrei».; Los 30 cloze de tipos I, II y III están bien resueltos: aceptan variantes reales (hai/avrai, fossi stato/stata) y no hay respuestas falsas.; Mixtos y doppio imperfetto están incluidos con la advertencia de registro oral vs escrito.; La lectura ep10 usa naturalmente los tres tipos y cierra el curso con un tono cálido; el dictogloss cubre tipo I, II y III con chunks pertinentes.

**Mejoras:**
- (alta) Rebalancear los ítems: hoy hay 30 cloze casi idénticos (d19-001 a 030) y solo 3-4 producciones completas. Reducir a ~12 cloze y agregar transformaciones (tipo I → II → III de la misma frase), typed con producción libre («Se vincessi la lotteria…») y qa.
- (alta) Cubrir todo lo enseñado: hay 0 ítems para el doppio imperfetto (bloque 4), 0 para purché, a patto che, qualora y nel caso in cui, 1 solo para los mixtos (bloque 2, que tiene dos subtipos: pasado→presente y presente→pasado).
- (alta) Corregir la regla de la prohibición: acotarla a la protasi hipotética y avisar de que «se» interrogativo admite condizionale.
- (alta) Incluir contraste con el español de forma sistemática: mostrar errores típicos del rioplatense (calcar «si tendría»; usar «se + presente» para tipo II; olvidar el auxiliar del trapassato; concordancia essere/avere) en un cuadro de trampas.
- (media) Agregar un bloque breve de repaso/formación de congiuntivo imperfetto y trapassato con verbos irregulares (fare/facessi, dire/dicessi, dare/dessi, stare/stessi, bere/bevessi) y ejercicios de conjugate.

### Semana 34 · B2 · Pronomi relativi — bien con reparos

Semana sólida en contenido: la teoría de che/cui/il cui/il quale/chi/quello che es correcta, corta y con buenos ejemplos, y las respuestas de los ítems son casi todas correctas y con accept generoso. Los reparos son de diseño: mucha redundancia (in cui/per cui, refrán, sorella di Marco, libro del que), poca producción libre de quello che/il che/chi, un solo fixerr, «dove» usado y aceptado sin enseñarse, y un par mínimo de suoni inválido (quale/cuale). Las lecturas son claras pero usan poco il cui, chi y quello che. Hay un ítem ajeno al tema (l2-d-48).

**Bien:** Teoría correcta y ordenada en dos partes (che/cui/il cui; il quale/chi/lo que), con contraste explícito con el castellano y el matiz de «cui» sin «a».; Las notas de los ítems explican la regla (concordancia de il cui con lo poseído, «che» sin preposición) y las respuestas verificadas son correctas.; Buenos ítems de discriminación: c1-rel-02 (ragazza / il cui padre), g2-cb-23 y rf-15 (ambigüedad resuelta con la quale), g2-sc-19 (scopri).; Accept amplio en las traducciones (in cui / dove / nella quale; abito / vivo; passato prossimo / remoto).

**Mejoras:**
- (alta) Reducir duplicados (in cui/per cui, refrán ×3, sorella di Marco ×3, libro del que ×3, «lo que decís» = ejemplo de la lección) y reasignar esos cupos a producción de quello che/tutto ciò che/il che y a más ítems fixerr/typed.
- (alta) Agregar «dove» como relativo de lugar en el bloque de cui y el error típico del hispanohablante (che + preposición, pronombre repetido: «la ragazza che parlo con lei») con más de un fixerr.
- (alta) Reemplazar el par p-188 (quale/cuale) por un par real, p. ej. che [ke] / ce [tʃe], y corregir el acento de «perdòno».
- (media) Ampliar las lecturas para incluir il cui, chi, quello che e il che (fl-relativi y w-34 no los usan) y sustituir c-calvino (B1, congiuntivo) por un texto con relativos.
- (media) Quitar de accept las variantes que ignoran el conector pedido (g2-cb-22, g2-cb-23) y agregar variantes válidas omitidas (alla quale, quel che, da dove, con la quale, è emigrata).

### Semana 35 · B2 · La voce passiva — bien con reparos

La teoría de los tres auxiliares es correcta, corta y con buenos ejemplos y advertencias. El italiano de los ítems, la lectura y el dictogloss no tiene errores. Los problemas están en el diseño: tres ítems evalúan el si passivante/impersonale (semana 36), la sfida usa rimanere sin enseñarlo, el par mínimo de suoni no es un par real, y falta el tema declarado (ecología, instituciones). La práctica es repetitiva (muchos ítems 'è stata/ha stata/è stato') y sin producción libre.

**Bien:** Teoría clara: una regla por auxiliar, con la restricción de venire a tiempos simples y el contraste estado/acción de 'La porta è chiusa' vs 'viene chiusa'.; El bloque 'Cuándo conviene evitarla' con Si dice/Dicono/Mi hanno rubato enseña naturalidad y no solo forma.; Lectura sobre el parmigiano: proceso real, datos correctos y uso natural de venire, essere y 'deve essere stagionato'.; Dictogloss del Duomo: contenido histórico correcto y chunks que recogen las tres pasivas.

**Mejoras:**
- (alta) Sacar c1-pass-04/05/06 (si passivante/impersonale) o pasarlos a la semana 36; reemplazarlos por ítems de la pasiva: agente omitido, tiempos (sarà/sarebbe stato), andare + condizional.
- (media) Agregar tipos de producción y detección: fixerr (è venuta chiusa, vengono firmato, è stato costruita), conjugate (venire/andare en distintos tiempos) y transformación activa->pasiva con agente.
- (media) Practicar el bloque 'Cuándo conviene evitarla' con 2-3 ítems (elegir entre pasiva y Dicono/Hanno + verbo) y practicar andare fuera de presente (andrebbero corretti).
- (media) Enriquecer la lectura: agregar una pregunta con vero/falso/non si dice, una sobre la gramática (¿por qué 'viene munto' y no 'è munto'?) y usar andare en el texto ('la forma va girata').

### Semana 36 · B2 · Si passivante e si impersonale — bien con reparos

Semana italianamente muy limpia: todas las respuestas de los ítems y las reglas centrales (concordancia del passivante, singular del impersonale, adjetivo plural, ci si, essere en compuestos) son correctas. Los problemas reales son la nota fonética falsa y el ítem de escucha ambiguo en suoni, y varios contenidos evaluados sin enseñar (lo si, se ne, ci locativo, passivante compuesto). La práctica es casi toda de reconocimiento y de dificultad más A2-B1 que B2.

**Bien:** Reglas correctas y bien ordenadas: passivante, impersonale, adjetivo plural, ci si, si por noi, con ejemplos traducidos.; Buen contraste con el español y avisos de errores típicos (si vende libri, tranquillo/tranquilli).; Mezcla razonable de tipos: choice, cloze, translate, fixerr, scopri; los accept de traducción son generosos.; El dictogloss del mate es natural, culturalmente correcto y los chunks coinciden con el texto.

**Mejoras:**
- (alta) Corregir c-043: nota fonética ([ˈditʃe]) y cambiar el distractor «Sì dice così.», idéntico en audio.
- (alta) Agregar a la lección un bloque «si con pronombres y tiempos compuestos»: lo si, se ne, ci si è divertiti, si sono bevuti troppi spritz.
- (media) Subir la dificultad a nivel B2: más producción (transformar de «uno/la gente» a si, cloze con adjetivo plural y ci si en compuestos, si + modal + plural: si devono pulire le finestre).
- (media) Reemplazar g2-cb-26 y reducir duplicados (g2-sc-20-a/rf-35-01, g2-sc-20-c/rf-35-03, ct-49/va-62).
- (media) Sumar ítems del si toscano por noi (comprensión: «Allora, si mangia?»).

### Semana 37 · B2 · Passato remoto e trapassato remoto — bien con reparos

Los 24 ítems principales son correctos y bien alineados con la lección: passato remoto regular e irregular 1-3-6, uso frente al prossimo y reconocimiento del trapassato remoto. Los problemas están en una nota con error de tipeo (1-3-3), la afirmación falsa sobre essere como único irregular entero, y sobre todo en las sfide, que arrastran ejercicios de artículos y de discurso indirecto no enseñados esta semana, con pistas contradictorias y un ítem semánticamente raro. Las lecturas y el dictogloss son buenos; falta práctica de producción y del trapassato remoto en contexto.

**Bien:** Lección corta, ordenada y con tabla del patrón 1-3-6; el contraste passato remoto/prossimo y la variación regional están bien explicados.; Las notas de los ítems repiten el paradigma completo (fecero, vide, seppi), lo que refuerza la memoria.; Las dos lecturas (leyenda del tortellino, Colapesce) son auténticas, usan casi solo remoto y tienen caza de formas completa y correcta.; Dictogloss de Leonardo da Vinci con datos históricos exactos y verbos remotos pertinentes (nacque, visse, dipinse, morì).

**Mejoras:**
- (alta) Agregar producción real: 6-8 ítems typed/conjugate/translate con verbos regulares -ere (vendei/vendetti) y -ire, y más irregulares (bere, vivere, mettere, rispondere, volere, sapere, conoscere).
- (alta) Ampliar la tabla de irregulares con los que usan las lecturas y los ítems (nascere, sapere, vivere, bere, volere, scendere, chiudere, correre, decidere, scoprire) y corregir el tip de essere/dare/stare.
- (media) Practicar el trapassato remoto en 3-4 ítems propios (elegir/completar/reformular con dopo aver + infinitivo) e incluirlo en una lectura.
- (media) Agregar a la teoría el contraste con el español (el indefinido cubre remoto y prossimo; error típico: usar remoto para lo de hoy) y el uso combinado remoto + imperfetto en la narración.
- (media) Reordenar los ítems de menor a mayor dificultad y limpiar ítems reciclados (a2-pr, b2-pass-01, g2-gd-25); reducir duplicados de «Dante nacque» (a2-pr-01, rf2-37-01, g2-ct-51).

### Semana 38 · B2 · Discorso indiretto — bien con reparos

El italiano y el español de los ítems son correctos: no encontré errores seguros de gramática ni de ortografía. La teoría de los desplazamientos es clara y contrasta bien con el castellano (condizionale passato vs condicional simple). Los problemas son de cobertura y coherencia: seis ítems repiten futuro → condizionale passato, mientras que congiuntivo, verbos para reportar, preguntas con congiuntivo y pronombres casi no se practican. La lección dice que el congiuntivo en preguntas indirectas es lo preferible, y los ejercicios y la lectura usan indicativo. No hay sfide, y la lectura c-machiavelli no trabaja el tema de la semana. Tasa estimada de falsos positivos: 25-30 % (varios hallazgos son dudas o mejoras).

**Bien:** La regla 'todo baja un escalón' con la tabla de correspondencias es corta, visual y completa en lo básico (presente, passato, futuro, condizionale, imperativo, congiuntivo).; Contrasta explícitamente con el castellano: 'dijo que vendría' = sarebbe venuto, el punto de error típico del rioplatense. Ese contraste se repite en notas e ítems.; La lección incluye deícticos (qui → lì, domani → il giorno dopo, fa → prima) y el cambio de persona y posesivo (mio → suo).; La lectura w-38 usa solo la gramática de la semana con naturalidad (condizionale passato, di + infinito, se + imperfetto). La caza de formas es pertinente, y las preguntas y glosas son correctas.

**Mejoras:**
- (alta) Rebalancear los ejercicios: sacar 2 o 3 ítems de futuro → condizionale passato y agregar ítems de congiuntivo (presente → imperfetto en la subordinada y en preguntas con se), pronombres y personas, y verbos para reportar (completar con ammettere, negare, promettere, suggerire).
- (alta) Unificar el criterio sobre indicativo vs congiuntivo en preguntas indirectas (lección, ítems, lectura).
- (media) Subir la producción: hoy solo hay 4 cloze/translate cortos (más 1 translate largo) frente a 11 choice. Agregar 'combina' o 'typed' con transformación completa (directo → indirecto de una frase con deíctico y persona) y un 'fixerr' más.
- (media) Reemplazar o complementar c-machiavelli por una lectura con entrevista o declaraciones en discorso indiretto.
- (media) Ampliar la teoría con: trapassato → trapassato, congiuntivo passato → trapassato, el caso de lo dicho aún vigente (sin retroceso) y un error típico del hispanohablante (usar condizionale semplice tras verbo en pasado).

### Semana 39 · B2 · BOSS — Livello B2 — bien con reparos

La hoja de repaso es correcta en italiano y en español: no encontré errores gramaticales ni de ortografía en la teoría, los 3 ítems ni la lectura. Los reparos son de cobertura y estructura. Solo hay 3 ítems propios (ninguno sobre pasiva, si, passato remoto ni discurso indirecto), no hay sfide, dictogloss ni suoni, y el bloque 'Las trampas' no pertenece a ninguna parte. Una afirmación ('Nunca condicional después de se') es demasiado absoluta. Puede ser correcto si el examen se arma con ítems de otras semanas (parts declara 189 y 155 ítems), pero el dossier no lo muestra.

**Bien:** La tabla de los cuatro congiuntivos vincula bien el tiempo del principal con el momento de la acción, con ejemplos paralelos presente/pasado.; El bloque de pasiva y si distingue essere, venire, andare, si passivante y si impersonale, y aclara la restricción de venire a los tiempos simples.; La tabla del discurso indirecto es clara (incluye el imperativo → di + infinito) y el tip cubre los cambios deíticos.; 'Las trampas de la estación' recoge errores típicos del hispanohablante (credo che è, se avrei, mi lo, ho tre sin ne, che vivo).

**Mejoras:**
- (alta) Ampliar los ítems propios de la semana: 6-8 por punto para pasiva (essere/venire/andare), si passivante/impersonale, passato remoto y discurso indirecto, y más de concordancia de congiuntivo (choice, conjugate, fixerr, translate). Hoy hay 3 ítems, todos de hipotético/congiuntivo. Si el examen se arma con ítems de otras semanas, mostrarlo en el dossier.
- (media) Matizar 'Nunca condicional después de se' y añadir el periodo misto (Se avessi studiato, ora saprei) y el uso de se + imperfetto por condizionale (Se lo sapevo, te lo dicevo) como nota.
- (media) Mejorar la lectura: más larga (hoy ~110 palabras), con pasiva o si passivante, y con preguntas vero/falso/non si dice.

### Semana 40 · C1 · Il causativo: fare e lasciare — bien con reparos

La teoría es correcta y clara (fare/farsi, pronombres, a/directo-indirecto, lasciare, expresiones fijas) y las lecturas y el dictogloss están bien escritos, sin errores de italiano. El problema principal es la cobertura: el dossier trae solo 12 ítems (parts declara 50+12), muy pocos de producción, y ninguno para pronombres antes de fare, lasciare con pronombres ni expresiones fijas. Hay un dato falso en una nota (mia madre sin artículo) y un par de dudas menores. La teoría no enseña el agente con 'da' (dal meccanico), que sí aparece en vocab, lecturas y dictogloss. Estimo ~25% de falsos positivos en las dudas; el error de la nota de g2-ct-54 lo confirmo.

**Bien:** Contraste claro fare vs farsi (mi sono tagliato vs mi sono fatto tagliare) con ejemplos rioplatenses naturales.; Regla de objeto directo/indirecto (lo / gli / glielo) bien explicada y con mini-preguntas inline.; Advertencias ('nada en el medio', 'sin a si no hay objeto') atacan errores típicos del hispanohablante.; Lecturas y dictogloss usan densamente el causativo (fa spostare, fa venire, mi faccio tagliare, li lascio cucinare) con léxico del tema 'servicios y trámites'.

**Mejoras:**
- (alta) Ampliar los ítems (el dossier trae 12, parts declara 62) y repartirlos por regla: pronombres antes de fare (mi fa ridere, li faccio venire), lasciare + pronombres, expresiones fijas (far sapere, far vedere, farsi vivo), farsi + infinitivo; hoy el bloque 5 no tiene ninguno.
- (alta) Enseñar el agente con da (dal meccanico, da Gino) y cuándo usar a vs da; sumar ítems cloze/typed con ese contraste.
- (media) Más producción (cloze de pronombres, transformación frase → pronombre, fixerr con «faccio la macchina riparare») en vez de choice; los ítems g2-* son genéricos y de nivel bajo para C1.
- (media) Agregar el acuerdo del participio (l'ho fatta riparare) y el pronombre con modales (lo devo far venire / devo farlo venire).

### Semana 41 · C1 · Verbi di percezione — necesita trabajo

La teoría es clara, correcta en lo esencial y bien ordenada (tres construcciones, posición del objeto, pasiva de percepción, polisemia de sentire). El problema es la práctica: solo hay 2 ítems, ningún desafío, ninguna parte y suoni casi vacío (sin pares mínimos, entonación ni acento). Casi nada de lo enseñado se ejercita. La lectura ep11 trabaja sobre todo el causativo, no la percepción, y ambas lecturas son de nivel bastante más bajo que C1. Hay un error real: se acepta 'Lo ho visto' en un ítem.

**Bien:** La lección organiza bien el contraste infinitivo / che + indicativo / che relativa, con tabla, ejemplos con traducción y advertencia sobre la 'a' personal.; Explica la concordancia del participio con el pronombre directo (l'ho vista uscire), un punto típico de error.; Incluye la pasiva de percepción (si è sentito chiamare) y la polisemia de sentire (sentirsi, sentirsela, ci sentiamo), útiles a nivel C1.; El dictogloss 'Dalla finestra' usa muy bien la estructura (vedere/sentire/guardare/osservare + infinitivo) con italiano natural y chunks pertinentes.

**Mejoras:**
- (alta) Crear el banco de ejercicios de la semana (unos 25-30 ítems): reconocer infinitivo / che + ind. / relativa, cloze de la forma correcta, posición del pronombre y concordancia del participio, conjugate, fixerr con 'a' personal y di + infinitivo, y traducciones ES-IT.
- (alta) Cubrir cada bloque: ítems de pasiva de percepción (si è sentito chiamare), de sentire polisémico (oír / sentir / enterarse / sentirsela) y de posición del objeto (Ho sentito cantare Maria / Maria cantare).
- (alta) Corregir el accept de g2-ct-55 (quitar «Lo ho visto») y ampliar variantes válidas.
- (media) Reescribir ep11 para que trabaje percepción, o reasignarlo al causativo; enriquecer w-41 con relativa con che y pronombres; subir el nivel de complejidad a C1 real (registros, subordinadas, contraste imperfetto/passato prossimo).
- (media) Agregar una sección de errores típicos del rioplatense: 'ho visto a Maria uscire', uso de gerundio (ho visto Maria uscendo) y omisión del participio concordado.

### Semana 42 · C1 · Verbi e preposizioni — necesita trabajo

La teoría es correcta y clara (grupos a / di / sin preposición / los que cambian, con contraste con el castellano), pero la semana casi no tiene práctica propia: el dossier trae solo 2 ítems (los 'parts' declaran 31 y 59) y los desafíos son de otros capítulos (imperativo, verbos tipo piacere). El contenido es de nivel A2-B1 aunque la semana está marcada C1 y promete 'mail formal / lenguaje burocrático', y no incluye ningún verbo ni fórmula burocrática. La lectura de la semana es fácil pero útil; la otra lectura (Levi) no tiene relación con el tema. Hay pocos errores de lengua, pero sí un calco/falta en la lectura y glosas de vocabulario engañosas. Suoni casi vacío.

**Bien:** La teoría se organiza en grupos (a / di / sin preposición / cambios) con tablas por 'idea' y contraste explícito con el castellano.; Los avisos (warn) atacan errores típicos del hispanohablante: sposare/aspettare sin a, 'la telefono', convincere a.; El bloque 'Cómo estudiar esto' (memorizar la frase entera, no la lista) es un buen consejo metodológico.; La lectura w-42 (Buoni propositi) concentra muy bien smettere di, cominciare a, riuscire a, provare a, abituarsi a, stancarsi di, con historia natural y humor.

**Mejoras:**
- (alta) Completar la práctica: la semana debe tener ítems propios (cloze, choice, translate, fixerr) para cada grupo (a, di, sin prep., pensare a/di, finire di/per) con la proporción declarada de 31 + 59.
- (alta) Agregar el eje 'mail formal / lenguaje burocrático': rivolgersi a, provvedere a, essere tenuto a, pregare di, chiedere di, comunicare di, riservarsi di, si prega di, restare in attesa di; y una tarea final de redactar el mail.
- (media) Corregir 'prima la sera' en la lectura y rehacer la pregunta 3 y la caza de formas (targets ambiguos).
- (media) Alinear keys/vocab con la lección: enseñar finire per y el sentido de pensare a/di, pentirsi, amare; revisar glosas de vocabulario (pregare, ringraziati, costretto) y evitar vocabulario ajeno (fegato, bevanda, nuotare).
- (media) Ajustar el nivel: subir la lectura y la dificultad a C1 (subordinadas, régimen con nombres y adjetivos: essere in grado di, avere la possibilità di, mostrarsi disposto a) o rebajar la etiqueta de nivel.

### Semana 43 · C1 · L'infinito — necesita trabajo

El italiano de todo el material es correcto y natural; casi no hay errores de lengua. El problema es estructural: solo 6 ítems, de los cuales 4 son 'combina' casi idénticos, sin nada sobre infinitivo sustantivado, orden impersonal ni infinitivo compuesto (más que un choice). El único desafío (sfide) es de passato remoto y no tiene relación con el tema, y su capítulo está en inglés. La teoría es correcta pero básica para C1 (nivel A2-B1 en su mayor parte). La lectura y el dictogloss son buenos pero se solapan.

**Bien:** El italiano de ítems, teoría, lectura y dictogloss no tiene errores gramaticales ni de ortografía detectados.; La teoría es corta, con ejemplos traducidos y avisos útiles (dopo + aver/essere, prima di + infinito simple, mismo sujeto).; Los 'combina' (prima di, senza, invece di, per) tienen buenos accept, con orden alternativo de la frase y variante femenina en g2-cb-29.; La lectura 'Imparare da adulti' usa el infinitivo de forma natural y abundante (dopo aver letto, prima di andare, senza capire, per non perdere).

**Mejoras:**
- (alta) Ampliar los ejercicios a 20-25 ítems que cubran los cuatro bloques: infinitivo sustantivado (il + inf., un continuo + inf. con cloze/choice), infinitivo compuesto (dopo aver/essere, per essere arrivato, credo di aver capito, con essere/avere y concordancia), órdenes impersonales (recetas y carteles: elegir forma, fixerr con 'non fumate' vs 'non fumare') y sujeto igual/distinto (spero di / spero che, cloze y fixerr).
- (alta) Diversificar tipos: hoy son solo 1 choice, 1 translate y 4 combina. Agregar cloze, fixerr, typed, conjugate (infinitivo compuesto), y traducción es→it con mismo sujeto/distinto sujeto.
- (media) Subir el nivel real de la teoría para C1: agregar infinito con a/da (qualcosa da mangiare, a saperlo), essere + agg. + a/di + inf., fare/lasciar/vedere + inf., stare per, infinito narrativo/storico, negación (per non aver capito), doble pronombre (averlo fatto, dopo essersi alzato) y concordancia del participio en el infinitivo compuesto.
- (media) Vincular el vocabulario y los ejemplos con Ciencia y tecnología (p. ej. 'Dopo aver installato l'aggiornamento...', avisos de un dispositivo) y ampliar el vocab, que hoy tiene 2 palabras, una (cioccolatino) sin relación con el tema.
- (media) Diferenciar la lectura y el dictogloss, y sumar a la lectura una pregunta vero/falso/non si dice y una de inferencia.

### Semana 44 · C1 · Gerundio e participio — bien con reparos

Teoría corta y mayormente correcta, con buenos contrastes con el español (seguir + gerundio, sujeto compartido). Los ítems propios son casi todos correctos, pero hay un aceptado erróneo (c1-part-04), un uso de 'essendo' ilógico en la lectura y varios ítems sobre acuerdo del participio que la lección no enseña. Faltan ejercicios de producción y de detección de error (sujeto distinto), y el participio presente no tiene práctica. Las sfide de subjuntivo/discurso indirecto casi no tocan el tema, y suoni tiene un solo par débil.

**Bien:** La lección sigue una progresión clara: gerundio simple, sujeto compartido, compuesto, stare + gerundio, participio absoluto, participio presente.; Buen contraste con el castellano: 'seguir + gerundio' se traduce con continuare a, y stare + gerundio se usa menos que el castellano.; Los accept de combina y translate son generosos (variantes con y sin coma, orden de la frase, aver/avere).; El dictogloss es natural, usa toda la gramática de la semana (gerundio simple y compuesto, pur, participio absoluto) y sus chunks son pertinentes.

**Mejoras:**
- (alta) Agregar ítems fixerr/garden para el error típico de sujeto distinto ("Uscendo di casa, ha cominciato a piovere" → mentre + verbo conjugado) y otros de detección del error del hispanohablante.
- (alta) Alinear el contenido de items con la lección: mover o justificar c1-part-01..05 (acuerdo del participio) y dopo aver/essere, o enseñarlos en un bloque.
- (alta) Corregir la contradicción entre la regla del mismo sujeto y las lecturas (essendo le tre, conoscendole), o matizar la regla en lesson:1.
- (media) Agregar 3-4 ítems de participio presente y 2-3 más de stare + gerundio, gerundio con clíticos (sapendolo, vedendoti) y traducciones de producción; hoy predominan choice de reconocimiento.
- (media) Alinear el tema con 'Ciencia y tecnología': lecturas y dictogloss hablan de un recorrido y de una cena; usar textos científicos o técnicos (informes, artículos) donde el participio absoluto y el gerundio son típicos.

### Semana 45 · C1 · Costruzioni verbali speciali — bien con reparos

Semana con un núcleo sólido (farcela, avercela, prendersela, cavarsela, volerci/metterci, stare per) y buena cobertura de reflexivos idiomáticos. Hay un error de respuesta en suoni (c-049 cuenta 6 palabras cuando son 5), una nota falsa (tardar = volerci), ítems sobre contenidos no enseñados (infischiarsene, prendersela comoda, participio assoluto) y dos lecturas ajenas al tema. Los ejercicios son casi todos de A2-B1 para un curso C1, y el tema 'humor e ironía' no aparece.

**Bien:** Selección de verbos pronominales muy útil y frecuente, con tabla clara y ejemplos traducidos al rioplatense.; Bloque del participio en -a (ce l'ho fatta) con advertencia sobre el error típico del hispanohablante.; Buena práctica de farcela/avercela/volerci/metterci en cloze y translate con accept razonables.; La lectura w-45 y el dictogloss reciclan bien las estructuras de la semana de forma natural.

**Mejoras:**
- (alta) Corregir suoni c-049: respuesta '5' y ajustar la nota.
- (alta) Corregir la nota de g2-va-63 (tardar = metterci; hacer falta = volerci) y cambiar 'vosotros' por 'ustedes' en rf-46-01.
- (alta) Agregar a la lección un bloque de contraste volerci (impersonal, concuerda con lo necesario, essere) vs metterci (personal, avere) con sus compuestos; incluir stare a, finire con l', prendersela comoda e infischiarsene, o quitar los ítems.
- (alta) Reemplazar g2-cb-38 (participio assoluto) y las lecturas ep12 y c-gramsci por materiales de la semana, con humor/ironía y modi di dire.
- (media) Subir la exigencia a C1: producción con frases más largas, registros y matices (prendersela vs avercela: evento vs estado; sentirsela; entrarci; starci; piantarla), más typed/fixerr/garden/qa.

### Semana 46 · C1 · Suffissi e alterazione — bien con reparos

Semana coherente en lo central (sufijos alterativos y falsos alterados): teoría clara y casi toda correcta, ítems cortos y bien resueltos. Los reparos son tres ítems mal hechos o fuera de tema (d03-059/060, g2-cb-39), un typo en español (Mariíta) y una etiqueta en inglés. El nivel real es A2-B1, no C1; hay mucho reconocimiento y poca producción, faltan ortografía (h/interfijos) y contraste ITA-ESP, y suoni está vacío.

**Bien:** Distinción clara entre alterados productivos y falsos alterados (tacchino, mattone, postino) con ejemplos memorables.; Ejemplos y notas en general correctos, con tono rioplatense natural.; Lectura y dictogloss bien construidos con abundante uso de la gramática de la semana y chunks pertinentes.; Buena cobertura de -ino/-one/-accio en ítems (unos 20) y presencia de adverbios alterados (benino, maluccio).

**Mejoras:**
- (alta) Reescribir/quitar d03-059, d03-060 y g2-cb-39; si se quiere practicar prefijos, sumar ítems de ri-, s-, stra-, mal- que sí están en la lección.
- (alta) Subir la dificultad al nivel C1: interfijos (pioggerellina, cagnolino, bastoncino), ortografía (amico→amichetto, poco→pochino), restricciones de combinación, connotación según contexto, register.
- (alta) Agregar contraste con el español (-ito/-illo/-ón/-azo) y errores típicos: calcar el diminutivo español, decir *casita* → *casina*, ignorar el cambio de significado.
- (media) Rebalancear tipos: hoy predominan choice de significado; sumar cloze de producción con contexto, fixerr y combina sobre alterados, y opciones que evalúen la regla (no solo el sentido).
- (media) Completar suoni: acento y ritmo en -ino/-etto, geminadas (-etto, -accio, -uccio), pares como pochino/pochetto, entonación de un «Che tempaccio!» irónico.

### Semana 47 · C1 · Numerali, misure e quantità — bien con reparos

El contenido italiano es en general correcto y natural; hay un solo error de regla claro (nota de 'e mezzo') y dos afirmaciones exageradas en la teoría. El problema mayor es de diseño: la semana es de nivel A2 (ids a2-/rf2-, ejercicios triviales, lectura y teoría básicas) etiquetada C1; la lección no enseña ordinales ni partitivo pese a que los ejercicios y las keys los piden; casi todo es opción múltiple y la sección suoni está vacía. Tasa estimada de falsos positivos: ~15% en errores/dudas.

**Bien:** La teoría es breve, con ejemplos traducidos y contraste explícito con el español (per = por, al chilo, il 30% con artículo).; Los aproximativos (una ventina di, un paio di, centinaia/migliaia femeninos) y los plurales en -a están bien explicados y practicados.; El dictogloss es natural, coherente y realmente usa la gramática de la semana; los chunks coinciden con el texto.; La sfida de cuentas es productiva y su lista de 'accept' es generosa (fa / è uguale a / uguale).

**Mejoras:**
- (alta) Ajustar el nivel: subir ejercicios y lectura a C1 real (numerali en textos periodísticos: «il 3,2%», «un aumento di due punti percentuali», «oltre/circa/quasi», cifras en titulares, «un ottavo», «al 40 per cento») o reclasificar el contenido.
- (alta) Agregar a la lección un bloque de ordinales (primo–decimo, -esimo, ventitreesimo, secoli, «al terzo piano», romanos) y otro de partitivo/quantificatori (del, un po' di, qualche/alcuni).
- (alta) Llenar suoni (vacío): pares mínimos (ventidue/ventitré, sessanta/sessantasei), acento de undicèsimo/ventèsimo, consonantes dobles (settanta, mille/mila), entonación en enumeraciones.
- (media) Diversificar tipos: usar 'numbers' (dictado de cifras/precios), 'listen', 'typed' y 'fixerr' (p. ej. «30% degli studenti» sin artículo, «un dozzina»); reducir choice (15 de 19).
- (media) Agregar ítems para lo enseñado sin práctica: il doppio/il triplo, al chilo, etto/due etti, coma decimal y punto de miles, «mezza», operaciones.

### Semana 48 · C1 · Ordine delle parole e dislocazioni — bien con reparos

La teoría es clara y correcta en lo esencial, y los ítems rf-48 son casi todos impecables en italiano. Hay un error de español (enunciado rf-48-22), un error de coherencia en la lectura w-48 (dativo dislocado sin «gli») y una respuesta aceptada dudosa (calco «è nel 1861 quando»). Lo más flojo es el diseño: casi todo es elección de pronombre entre 3 opciones, hay ítems casi duplicados, no hay sfide, pares mínimos ni entonación, y el tema declarado (neostandard, variedades sociales y geográficas) casi no se toca. Además c'è + relativa se practica sin haberse enseñado.

**Bien:** Teoría breve, con ejemplos oralmente naturales y contraste útil con el rioplatense (dislocación a la izquierda, «el pan lo compro yo»).; La escindida se enseña con las dos variantes (è... che y è stato... a + infinitivo) y hay práctica de ambas (rf-48-20, 21, 24).; Cobertura buena de la retoma por tipo de pronombre: lo/la/li/le, ne, ci y gli/le, con concordancia del participio (rf-48-01 a 05, 11 a 16).; La lectura w-48 y el dictogloss reciclan muy bien la gramática de la semana con registro oral creíble; el dictogloss trae chunks y palabras clave pertinentes.

**Mejoras:**
- (alta) Agregar la parte del tema declarado: rasgos del italiano neostandard (che polivalente, «a me mi piace», gli por a loro/le, ci por a noi, lui/lei sujeto, tema sociolingüístico regional) con 4-6 ítems.
- (alta) Diversificar los ejercicios: agregar fixerr (omitir el clítico, «a» delante del objeto dislocado, «cui» en escindida), typed/cloze de producción libre y reformulación (pasar de orden neutro a marcado), y bajar los ítems de elección de pronombre entre 3 opciones (19 de 36).
- (alta) Corregir rf-48-22 (enunciado en español), el «non l'ho mai detto» de w-48 y quitar «quando» de rf-48-19.
- (media) Agregar bloque para c'è + relativa (c'è Marco che ti aspetta) y otro para la anteposición sin clítico (focalización contrastiva: «Stanco sono» no lleva pronombre; contraste con tema «Il pane lo compro»), y ejercitar ambos.
- (media) Eliminar duplicados (c1-ord-01, g2-sc-25-a y rf-48-13; g2-ct-65 y rf-48-23; g2-sc-25-b y rf-48-12) y reemplazarlos por casos nuevos: retoma con dos clíticos (glielo, me lo), pasado con concordancia, sujeto pospuesto con más verbos.

### Semana 49 · C1 · Registro alto e coesione testuale — necesita trabajo

La teoría es correcta y bien ordenada (conectores por función, congiuntivo, fórmulas impersonales, cohesión, estructura del texto). El problema es la práctica: solo 2 ejercicios (ambos 'combina'), sin sfide, sin partes y con suoni vacío. Además, varios puntos de 'keys' (nominalización, malgrado/laddove/ove, calco del español) no se enseñan ni se practican. Hay un error de italiano en la lectura w-49 y algunas dudas menores de naturalidad. Lo enseñado no llega a producirse.

**Bien:** Tabla de conectores organizada por función (añadir, oponer, conceder, causa, consecuencia, ejemplificar, reformular, concluir), muy útil como referencia.; El bloque de congiuntivo lista los conectores clave con ejemplos naturales y una advertencia correcta (benché + indicativo es error).; Las fórmulas impersonales tienen tabla y equivalencias en español, y la advertencia contra el 'io penso' es buen consejo de registro.; Las dos lecturas (carta al profesor, aviso de consorcio) son de registros formales distintos y muestran affinché, nonostante, qualora, pertanto.

**Mejoras:**
- (alta) Ampliar la práctica a unos 20-30 ítems con mezcla de tipos: choice (elegir el conector según la función), cloze (congiuntivo tras benché/qualora/affinché/prima che), fixerr (calcos del español y indicativo tras benché), combina, translate y typed.
- (alta) Cubrir los objetivos de 'keys' que faltan: nominalización (aumentaron los precios -> l'aumento dei prezzi), malgrado/laddove/ove y calcos del español, con teoría y ejercicios, o retirarlos.
- (alta) Corregir 'la cui durata si prevede di due settimane' en la lectura w-49.
- (media) Completar 'suoni' (entonación de la frase concesiva y de la enumeración in primo luogo / in secondo luogo, acento de palabras como 'altresì', 'sicché', 'benché') o justificar que quede vacío.
- (media) Reemplazar el vocab (server, backup, buio, appartengono) por léxico del debate y la argumentación, con ejemplos completos.

### Semana 50 · C1 · Lessico avanzato e falsi amici — necesita trabajo

La teoría de falsos amigos es mayormente correcta y útil, pero la semana está desbalanceada: solo hay 16 ítems visibles (todos de elección salvo dos), los bloques de registro y preposiciones no tienen ejercicios visibles (parts declara 19 y 161 ítems, lo que no coincide), suoni está vacío y el tema declarado (Autores del Novecento) y las claves (sufijos/alteración, colocaciones) no aparecen. La lectura tiene un error de contenido (salsa/sugo) y una glosa engañosa (negozio). Hay varios ítems que evalúan cosas no enseñadas esta semana y el nivel del material es B2, no C1.

**Bien:** La tabla de falsos amigos es clara y contrastiva (columnas Significa / No significa), con ejemplos traducidos en voseo natural.; Buen foco en el error típico del rioplatense: imbarazzata/embarazada, salire/salir, aceto/aceite, esito/éxito, con notas que dan la palabra italiana correcta (uscire, olio, incinta, successo).; El bloque sapere/conoscere, portare/prendere, andare/venire explica bien el contraste con el castellano, con la advertencia sobre «Sì, vengo».; El dictogloss es natural, breve, y recicla los falsos amigos y las colocaciones clave (prendere una decisione, fare una domanda).

**Mejoras:**
- (alta) Completar los ejercicios: la semana tiene solo 16 ítems, casi todos choice. Agregar al menos 25-30 ítems variados (cloze, translate, fixerr, typed, combina) y ejercicios para los bloques de registro (identificar coloquial/neutro/formal, reescribir un texto informal a formal) y preposiciones (da/di/a/fra: una tazza ___ tè, una gonna ___ quadri, torno ___ un'ora).
- (alta) Revisar la asignación de ítems a partes (parts.n_items 19/161) y verificar que la carga real coincida con la que se muestra.
- (alta) Corregir la lectura: eliminar el falso ejemplo salsa/sugo, cambiar la glosa de negozio a «tienda» y usar más falsos amigos de la lección (aceto, esito, salire) para que la caza de formas sea correcta.
- (alta) Rellenar suoni (pares mínimos, habla conectada, entonación, acento): p. ej. pares con doble consonante (pena/penna, caro/carro), acento de palabras que se parecen al español (ècono·mia/econo·mìa, càpito/capìto) y entonación de la ironía/registro.
- (media) Integrar lo prometido en keys/tema: sufijos y alterados (-one, -ino, -accio) con ejemplos y ejercicios, un bloque de colocaciones (prendere una decisione, fare una domanda, avere fiducia...) y algún anclaje con Autores del Novecento (Calvino, Levi, Ginzburg) en la lectura.

### Semana 51 · C1 · Ripasso generale C1 — bien con reparos

Semana de repaso sin teoría nueva. Lo revisado es correcto en italiano: no encontré errores claros, solo tres dudas de contenido y varias mejoras. El dossier trae apenas 2 ítems, aunque parts declara 555 (176+36+343); no pude auditar el resto. La lección no cubre causativo, pasiva, si passivante, dislocaciones, periodo mixto ni concesión, que sí figuran en keys y vocab. Suoni y sfide están vacíos.

**Bien:** Las listas de control (congiuntivo, tiempos, pronombres, quince faltas) son breves, con tablas claras y ejemplos correctos.; Los contrastes con el español (Ne ho tre, dopo aver mangiato, mi sono lavato) apuntan a errores reales del hispanohablante.; La lettura «Lettera a me stesso» es natural y recicla congiuntivo y periodo hipotético del tercer tipo.; El dictogloss usa muy bien la gramática de la semana (periodo hipotético, fare + infinito, congiuntivo tras che) y sus chunks son pertinentes.

**Mejoras:**
- (alta) Confirmar por qué el dossier trae solo 2 de 555 ítems y auditar el banco completo de la semana.
- (alta) Agregar a la lección bloques de repaso de los puntos de keys: periodo hipotético mixto, causativo (fare + infinito), pasiva/si passivante, dislocaciones y concesiones (sebbene/malgrado/nonostante).
- (media) Completar suoni (pares mínimos, habla conectada, entonación, acento) con contenido de repaso.
- (media) Matizar en la lista de control las reglas absolutas (principal en pasado, «verrebbe», «sto studiando») para no enseñar reglas falsas.
- (media) Agregar a la lettura preguntas vero/falso/non si dice y una lectura más larga con causativo y pasiva.

### Semana 52 · C1 · ESAME FINALE — Livello C1 — bien con reparos

Examen final coherente con el programa: la mayoría de los 160 ítems y de las 25 sfide (128 sub-ítems) es correcta, con notas útiles y buena cobertura de conectores, relativos, congiuntivo, concordanza dei tempi, causativos, formación de palabras y registro. Los textos de examen (2 ascolti, 2 letture, 2 scritture) son naturales, fieles a los hechos históricos y bien construidos. Los problemas están en detalles: dos errores de italiano (ex-cl-10, ex-rg-08), una nota falsa (ex-cl-51), dos glosas/notas en español erróneas y varios accept mal calibrados (sobre todo los causativos con fare/lasciare). La lectura de la semana es demasiado simple para C1 y dictogloss/suoni están vacíos. Tasa estimada de falsos positivos: ~15-20% en las «dudas», ~5% en los «errores».

**Bien:** Los textos de esame (ascolti, letture, scritture) tienen registro C1 natural, hechos históricos correctos, distractores bien construidos y vero/falso equilibrado con cita del texto.; Las notas de los ítems ex-cl/ex-tr explican la regla y el contraste con el castellano (concordanza dei tempi, «il cui», participio absoluto, si passivante).; Buena cobertura de recursos C1: relativos con preposición, conectores formales, nominalización, gerundio/participio absoluto, causativo, discorso indiretto.; El banco de registro (ex-rg) discrimina bien formal/informal con distractores plausibles, y las sfide de formación de palabras (ex-fp) son de buen rendimiento didáctico.

**Mejoras:**
- (media) Nivelar el banco: hay ítems de A1-A2 (plurales, ordinales, da/di, quale/quanto) mezclados con C1; poner peso mayor a los temas C1 (causativo, participio absoluto, dislocaciones, ne/ci, registro).
- (media) Completar la hoja teórica con los recursos C1 nombrados pero sin ejemplo ni práctica directa: pasiva con andare/venire y dislocaciones (hay pocos ítems), ne y ci en todos sus valores (casi ninguno).
- (media) Enriquecer la lectura de la semana (w-52) y agregar vero/falso/non si dice y una caza de formas más amplia (congiuntivo, gerundio compuesto).

## 9. Cómo reproducir

Los dossiers y prompts usados están descritos en la sección 2. Las capas automáticas: `npm test`, `python3 tools/it/check_lessons.py`, `python3 tools/it/check_letture.py`, `node tools/it/audit/corpus.js && node tools/it/audit/lint.js`. Los informes JSON completos de cada revisor y verificador (con el texto exacto de cada hallazgo, incluidas dudas y mejoras no verificadas) están en `tools/it/audit/semanal/` (ver commit).

## 10. Correcciones aplicadas (v1.56) y mejoras estructurales (v1.57)

Se aplicaron en las fuentes (`tools/`, `docs/js/`) los **errores confirmados** de la sección 3, con el build (`npm run build`) regenerado, `npm test` en verde, `check_lessons` y `check_letture` en 0 y `lint.js` en la línea base (144 falsos positivos didácticos). Versión de la app y del service worker: v1.56.

- Aplicados: suoni (24), ejercicios de autor y `c1_*` (22), lecturas y dictogloss (17), refuerzos/esame/lessico2 (19), parches de Routledge/Dummies (21), lecciones y bancos (19) y los cruzados que quedaron entre grupos (`s:r26-04:d`, `s:r26-02b:c`, comentario `1-3-3` del conjugador). Además se acortaron tres textos de lección que pasaban el límite de palabras tras las correcciones y se agregaron bloques nuevos de la semana 1 (saludos, *tu/Lei*, deletreo) y la semana 2 (*c'è / ci sono*).
- **Pendientes** (mejoras estructurales, no errores): alinear teoría y práctica en el resto de las semanas (sección 6, punto 1), rehacer el reparto de sfide (punto 4), práctica de producción en las semanas 27-51 (5), subir el techo de nivel de los bancos (9), `rf-46-18` (*infischiarsene* sin lección en la semana 46) y `s:r26-03` (*rimanere* no enseñado en la semana 35).

### Mejoras estructurales aplicadas (v1.57)

Teoría y práctica alineadas en las semanas **6, 9, 20, 22, 25, 27, 28, 35, 45 y 46** (más los bloques de las semanas 1 y 2 de v1.56):

| Semana | Bloques de teoría nuevos | Ejercicios nuevos |
|---|---|---|
| 6 | tenere/salire; stare + gerundio y no diptongación en ítems | 14 |
| 9 | medios de transporte y *a piedi*; repaso de articuladas; per/da/tra | 14 |
| 20 | ortografía -care/-gare; raíces irregulares (andr-, dovr-, verr-…); registro | 14 |
| 22 | *ne* en combinados (*gliene*, *ce ne*); imperativo con pronombres; errores típicos | 14 |
| 25 | conjunciones con congiuntivo; negación de verbos declarativos; relativas/superlativos | 14 |
| 27 | adjetivo como adverbio; excepciones de -mente; meglio/peggio/benissimo | 13 |
| 28 | anche se/comunque/né…né/non solo…ma anche; matices de *siccome* | 14 |
| 35 | *rimanere/restare* en la pasiva; ecología e instituciones | 13 |
| 45 | volerci vs metterci; stare a / infischiarsene / prendersela comoda | 14 |
| 46 | interfijos y *h*; contraste con el español; prefissoidi | 14 |

Cada bloque y ejercicio nuevo pasó por una revisión independiente que corrigió 34 problemas antes de publicar (una regla falsa sobre *venire*, datos falsos en la tabla de prefissoidi, traducciones erróneas, `alt` incompletos, distractores defendibles). Con esto quedan resueltos `rf-46-18` y `s:r26-03` de la lista de pendientes.

### Segunda tanda (v1.58): las 11 semanas restantes

| Semana | Bloques de teoría nuevos | Ejercicios nuevos |
|---|---|---|
| 4 | plurales -co/-ca/-go/-ga; *molto* y *avere* para edad y sensaciones; nacionalidades y profesiones | 14 |
| 12 | cuerpo con artículo; farmacia y consejos; imperativo con forma propia | 14 |
| 21 | *ne* de + lugar; *ci* con + algo; ¿*ne* o *ci*? la preposición decide | 15 |
| 24 | ortografía h/i; disparadores mínimos | 17 |
| 31 | dovere/potere/volere en el pasado (modal + essere); trampas del hispanohablante | 14 |
| 36 | tiempos compuestos con *si*; *lo si*, *se ne* | 14 |
| 40 | agente con *da*; pronombres, participio y modales con *fare* | 13 |
| 42 | verbos del mail formal; *Con la presente / in allegato* | 14 |
| 47 | ordinales; partitivo y *qualche*; cifras en prensa | 14 |
| 49 | nominalización; *malgrado / laddove / ove*; calcos | 14 |
| 51 | causativo y pasiva; dislocaciones; periodo mixto y concesión | 14 |

La revisión independiente corrigió otros 35 puntos (absolutos falsos como «-iare no repite la i», tabla de ordinales, distractores defendibles, `alt` incompletos). Total de la operación: **21 semanas con teoría y práctica alineadas, unos 300 ejercicios nuevos**. Simulación de la carrera completa: 4 jefes aprobados, nivel 44 *Madrelingua*, 124 h en el año.

**Sigue pendiente:** reparto de sfide (sección 5.1: semanas 23 y 50 sin ninguna en tema, 28 sfide sin semana), práctica de producción en las semanas 27-51 no tratadas, subir el techo de nivel de los bancos de frases y de errores, y las dudas/mejoras no verificadas del informe. Quedan además las semanas con `necesita trabajo` por la práctica escasa: 41 y 43 (agregar ítems propios) y la lectura `w-49` (revisada, pero no reescrita).

## 11. Integración con la línea v3.4 (`main`)

Las correcciones y mejoras de las secciones 10 se hicieron primero sobre la rama antigua (v1.55, solo italiano). Después se **fusionó `origin/main` (v3.4, italiano + portugués)** en esta misma rama y se reaplicaron sobre las rutas nuevas (`tools/it/…`, `docs/lang/it/…`): 38 conflictos de contenido resueltos a mano conservando las mejoras de `main` y las nuestras, datos regenerados con `npm run build`, y `npm test` completo en verde (italiano, portugués, librería y contenido). Versión resultante: 3.4.1.

- La regla nueva de `main` sobre las notas (`tools/lib/test_notas_it.js`: una nota no puede ser solo una equivalencia «A = B») hizo reescribir 17 notas de ejercicios nuevos para que expliquen la regla.
- La regla de `main` sobre los bloques de lección (`tools/lib/test_lecciones.js`: todo bloque necesita algún chequeo) hizo agregar chequeos escritos a mano (`q`) a los tres bloques nuevos de la semana 21.
- **Alcance:** esta auditoría cubrió solo el curso de **italiano**. El curso de portugués (Rumo C1) no se auditó.
