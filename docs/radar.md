# Prompt — Actualización manual del Experience Radar (Mundial 2026)

**manual**
(los crons automáticos están desactivados a propósito).

---

```text
Actúa como mi motor de análisis del Experience Radar (especial Mundial 2026). NO uses
OpenAI ni datos inventados: investiga con tus herramientas (WebSearch/WebFetch) y verifica
todo contra fuentes reales antes de escribir.

PARTIDO(S) A ACTUALIZAR: los pendientes del día anterior y los partidos de hoy; se
actualiza la previa si están a 24 horas o se llenan completos si ya jugaron. Valida que
estén todos los partidos e incluye los partidos a 48 horas que no estén, pero todavía como
notas no accesibles.

VENTANA PRIORITARIA DE 24 HORAS: al inicio de CADA corrida, calcula la hora actual con
zona horaria y revisa todos los partidos que comiencen durante las siguientes 24 horas.
Contrasta horario, sede, novedades de plantilla, declaraciones y conversación previa en
al menos 3 fuentes. Actualiza su previa aunque ya exista. Si no hay partidos en la ventana,
déjalo registrado expresamente en el reporte final con la hora exacta del corte.
No crees una segunda previa ni reemplaces una previa editorial completa: si ya existe,
solo actualízala cuando haya un dato nuevo, verificable y relevante.

PASOS:
1) INVESTIGA cada partido en al menos 3 fuentes y CRUZA datos:
   - Resultado y desarrollo: FIFA oficial, ESPN, AS/Marca, medios deportivos serios.
   - Voz de la hinchada (sentimiento, memes, quejas, euforia): Latingoles, Reddit (r/soccer
     y subs de cada selección), X/redes, Google Trends, Instagram, Facebook, YouTube
     (comentarios y/o chat visible), páginas de comentaristas/analistas de fútbol y, cuando
     aporte algo verificable al partido, páginas de data como 365Scores (p. ej. mapa de tiros,
     tiros al arco, momentum o eventos del encuentro). Las cuotas de apuestas NO son fuente
     permitida ni señal editorial válida.
   - Diferencia obligatoria: una red social o scraper "intentado" NO cuenta como fuente
     analizada si devuelve 0 señales, bloqueo, CAPTCHA, login requerido o error de conexión.
     En ese caso repórtalo al final como intento fallido/best-effort y NO escribas en la nota
     que el sentimiento fue medido en Instagram, YouTube, X o Facebook. Solo usa esas redes en
     el análisis cuando haya posts, comentarios, hilos o señales públicas verificables.
   - Confirma marcador EXACTO, goleadores con minuto, polémicas arbitrales y frases reales.
   Si un dato no se puede verificar, NO lo incluyas.

   HORARIOS (kickoffAt) — REGLA CRÍTICA:
   - `kickoffAt` SIEMPRE se guarda en UTC (sufijo `Z`, p. ej. `2026-06-16T19:00:00.000Z`).
   - VERIFICA la hora oficial de cada partido en una fuente seria (FIFA/ESPN/AS) y conviértela
     bien a UTC. En junio, la hora del Este de EE. UU. es EDT = UTC−4 (ET + 4h = UTC); Colombia
     es UTC−5. Ej.: 3:00 p. m. ET → 19:00 UTC → 2:00 p. m. en Colombia.
   - NO asumas la grilla del día (12pm/3pm/6pm/9pm ET): cada jornada empieza a una hora distinta.
     Comprueba el partido concreto, no el patrón. Un error típico es correr todo el día un turno
     (−3 h). Si el último partido del día arranca pasada la medianoche UTC, su `kickoffAt` lleva
     la fecha del día siguiente (la `date` editorial puede seguir siendo la del día del fixture).
   - La hora se MUESTRA en la zona horaria del visitante (la del navegador), con el nombre de la
     zona (p. ej. "GMT−5"), vía el componente `LocalMatchTime`. NO formatees horas con zona fija
     en el servidor. Si pones horas dentro de textos (keyPlays, etc.), aclara la zona: por
     ejemplo "20:00 Bogotá / 21:00 ET", y mantenla coherente con el `kickoffAt` en UTC.

2) ANALIZA con lente de UX y comportamiento (no como cronista deportivo): qué sesgos
   cognitivos aparecieron (regla pico-fin, sesgo de recencia, aversión a la pérdida,
   punto de referencia/encuadre, prueba social, etc.), cómo se movió la emoción de la
   hinchada antes→durante→después, y qué enseña sobre diseño de experiencias y productos.

3) ESCRIBE/ACTUALIZA en src/lib/experience-radar/articleData.ts. Si la nota está como
   upcomingMatch(...) (previa) y el partido ya se jugó, conviértela a finishedMatch(...)
   con TODOS estos campos llenos en español, específicos al partido (nada genérico):
   - matchScore {home, away, homeGoals, awayGoals, scoreDetail con goleadores y minutos}
   - seoTitle, hook, matchSummary, quickSummary, whatHappened, aiSummary, uxFinding
   - TITULAR CON MARCADOR: toda nota finalizada debe comenzar su `seoTitle` con los equipos
     y el marcador exacto, por ejemplo `Canadá 1-1 Bosnia: ...`. Comprueba también el HTML
     final: una versión antigua del store nunca puede reemplazarlo por un titular sin score.
   - TITULAR CAPITALIZADO: después del marcador y los dos puntos, el titular debe iniciar
     con mayúscula. Correcto: `Catar 1-1 Suiza: El gol agónico...`; incorrecto:
     `Catar 1-1 Suiza: el gol agónico...`.
   - keyPlays[], controversies[], statements[] (frases reales citadas con su fuente)
   - combined: expectativa/realidad/percepcion — cada una con los 6 ejes 0–100
     (euforia, confianza, ansiedad, frustracion, incertidumbre, optimismo) coherentes
     con lo que realmente pasó.
   - teamsData[2] (FinishedTeam): expectedEmotion, dominantConversation, fanConfidence,
     mainNarrative, howTheyArrived, whatHappened, expectationVsReality, mood,
     behaviorEffect, current{6 ejes}, predicted{6 ejes}.
   - PREVIA ANALIZADA (analyzedUpcomingMatch): pasa `teamsData` con la lectura DISTINTA de
     cada hinchada (expectedEmotion, dominantConversation, fanConfidence, mainNarrative). Si
     no se aporta, ambas cajas muestran el mismo texto y la UI las colapsa en "Ambas
     hinchadas". Para dos lecturas separadas, llena `teamsData` con datos propios de cada país.
   - IMAGEN DE PREVIA ANALIZADA: toda `analyzedUpcomingMatch(...)` debe traer una imagen
     editorial propia de la previa, descargada y guardada localmente en
     `public/images/experience-radar/mundial-2026/`. No uses imágenes genéricas del radar,
     fallback del sitio ni hotlinks externos para una previa ya analizada. Si no hay foto de
     Latingoles o Win Sports, insiste con FIFA, The Guardian, AP, Reuters, ESPN, ESPN
     Colombia, AS, Marca, El País, El Mundo, El Diario, Goal u otra fuente periodística
     verificable y registra qué fuente quedó.
   - userExperience POR EQUIPO: cómo consume y reacciona EN DIGITAL la hinchada de ESE
     país, por etapa { expectativa?, realidad?, percepcion? }. DEBE ser específico de cada
     selección (memes, hashtags, apps, quejas propias de esa afición) y DISTINTO entre los
     dos equipos. Si no hay señal real de un país en una etapa, OMITE esa etapa para ese
     equipo (no inventes, no copies el texto del otro: el bloque solo sale si hay dato y
     puede aparecer en una caja y en la otra no).
   - lessons[3] {term, explanation} — los 3 hallazgos de comportamiento del partido.
   - matchInterpretations (3 fases × 6 emociones) específicas al partido.
   - humanBehavior, cognitiveBiases[], emotionalReaction, digitalPatterns.
   - productApplications[], fanPulse {concerns, emotions, frustrations, enthusiasm}.
   - sources[] con name, url y kind reales (las que de verdad consultaste).
   - IMÁGENES: antes de tocar una nota, revisa su `imageUrl`, `imageCredit` e
     `imageSourceUrl` actuales y determina en qué etapa está: `previa`, `en_vivo` o
     `finalizado`/pronóstico.
   - Las imágenes de la previa y de la noticia/análisis actualizado DEBEN ser diferentes.
     Cada partido puede tener dos imágenes editoriales: una de previa (antes del partido) y
     una última imagen de análisis (durante/finalizado/pronóstico). Cuando el encuentro ya
     fue analizado, CONSERVA la última imagen exactamente; esa es la imagen aprobada que no
     debe volver a cambiarse en corridas posteriores.
   - Si una nota sigue en `previa`, conserva la imagen de previa si ya existe. Si pasa de
     `previa` a `en_vivo` o `finalizado`, NO reutilices la foto de previa: busca y guarda
     una imagen distinta, más actual, de la noticia o del partido. Desde ese momento esa
     nueva imagen debe quedar en `imageUrl`, `imageCredit` e `imageSourceUrl`.
   - NO pierdas la imagen inicial: cuando reemplaces la imagen del análisis, conserva la
     foto de antes del partido en `previewImageUrl`, `previewImageAlt`, `previewImageCredit`
     y `previewImageSourceUrl`. Si el archivo local de previa fue pisado, vuelve a
     descargarlo o guárdalo con sufijo `-previa` antes de publicar.
   - En el especial/listado de `/experience-radar/mundial-2026`, una nota analizada debe
     mostrar SIEMPRE la imagen final de análisis (`imageUrl`). La imagen de previa solo se
     muestra mientras el partido está en `previa` o dentro de la nota cuando el usuario
     selecciona la fase «Antes del partido».
   - Al entrar a una nota ya analizada/finalizada, la fase inicial debe ser «Durante el
     partido» (`realidad`) si existe. No debe abrir mostrando «Antes del partido» salvo que
     la nota todavía sea previa o no tenga datos de realidad.
   - Para los partidos de hoy y de ayer, valida explícitamente esta regla: si tienen previa
     y ya fueron jugados o están en análisis, cambia a la imagen final; si ya tienen imagen
     final aprobada, consérvala sin tocar.
   - Solo busca imagen cuando la etapa requiere una imagen y la nota NO tiene la imagen
     correcta para esa etapa. La búsqueda es OBLIGATORIA e insistente:
     prueba primero el scraping y la noticia específica en `https://latingoles.com/` y
     `https://www.winsports.co/`; si no aparece o bloquea la descarga, continúa con FIFA,
     AP, Reuters, The Guardian, ESPN, ESPN Colombia, AS, Marca, El País, El Mundo, El Diario,
     Cadena SER y otros medios serios.
     No abandones la búsqueda tras una sola URL, un 403 o un CDN bloqueado: prueba la imagen
     original, `og:image`, variantes del CDN y otra fuente periodística. Registra en el
     reporte final qué dominios intentaste y por qué no se obtuvo imagen, si ese fue el caso.
   - Usa una fotografía real del partido procedente de una fuente autorizada, verifica
     visualmente que corresponda a los equipos y descarga una copia en
     `public/images/experience-radar/mundial-2026/`. `imageUrl` debe apuntar a la ruta local
     `/images/experience-radar/mundial-2026/<slug-corto>.jpg`; conserva el crédito y la URL
     de la noticia original en `imageCredit` e `imageSourceUrl`.
   - NO uses composiciones, collages, pósters de boletería ni gráficos promocionales como
     imagen principal de una previa, salvo que el usuario lo apruebe explícitamente para un
     caso concreto. Si no hay foto exacta del cruce, usa una foto real de previa/noticia de
     uno de los equipos publicada por una fuente autorizada y deja claro en `imageAlt`,
     `imageCredit` e `imageSourceUrl` qué equipo/fuente corresponde.
   - La descarga y adición de imágenes al repositorio es AUTOMÁTICA: no pidas confirmación
     editorial antes de descargar, validar, guardar y preparar la imagen para publicación.
   - Si encuentras una imagen válida y verificable para la nota correcta, súbela al repo en la
     misma corrida sin preguntarme; la revisión editorial ya queda delegada a estas reglas.
   - NO uses hotlink como `imageUrl`: una URL externa puede responder 409/403 o bloquearse
     por referer y hacer que aparezca el respaldo aunque la foto exista. Comprueba que el
     archivo descargado sea una imagen válida, no HTML, y que tenga tamaño/dimensiones
     razonables. Si no consigues una foto verificable, deja `imageUrl` vacío; el sistema
     escogerá un respaldo local estable según el slug.
   - Las imágenes finales declaradas en `RADAR_ARTICLE_SEED` quedan bloqueadas por slug
     mediante `LOCKED_SEED_IMAGES`. No elimines ese bloqueo ni permitas que el store, el
     scraping, X, Reddit, Latingoles o una ejecución posterior del generador sobrescriban
     la última imagen aprobada del partido.
   - ORDEN DIARIO: dentro de cada fecha, la nota analizada o actualizada más recientemente
     debe aparecer primero. Conserva `analyzedPreviaAt`/`analyzedFinalAt` para ese orden.

4) ELIMINACIÓN: si una selección de la nota ya quedó fuera del Mundial, agrega su nombre a
   `eliminatedTeams` en esa nota para marcarla visualmente como eliminada.
   - OJO: `eliminatedTeams` NO significa automáticamente "sin pronóstico". Si esa selección
     todavía tiene un partido pendiente en el calendario, el pronóstico se mantiene y debe
     seguir mostrando su próximo rival.
   - Solo se oculta el pronóstico cuando la selección ya no tiene más partidos o no existe un
     próximo rival verificado/deducible.

4b) PRÓXIMO RIVAL: llena `nextOpponents` (clave = equipo, valor = rival) con el próximo
   contrincante VERIFICADO de cada selección del partido, según el fixture oficial. Es lo que
   hace que el pronóstico diga "Para el próximo partido vs X".
   - Si la nota del próximo partido ya existe en el calendario, el rival se infiere solo; igual
     conviene ponerlo explícito para los equipos cuyo siguiente cruce aún no está cargado
     (p. ej. Irán → su rival real).
   - Si una selección está eliminada pero todavía tiene una fecha pendiente, `nextOpponents`
     sigue siendo obligatorio para que el pronóstico no desaparezca por error.
   - Si todavía no existe rival confirmado, la UI debe caer en un texto del tipo "rival por
     definir", no en un falso "sin próximo partido".

CUMPLIMIENTO (obligatorio):
   - Sin contenido de apuestas ni cuotas. Sin logos oficiales de FIFA.
   - No reproduzcas notas completas: resumen propio + enlaces de referencia.
   - El pronóstico es lectura de ánimo colectivo, NO predicción de marcador ni cuota.
   - Corrige cualquier dato fabricado que encuentres por uno verificado.
   - SEO / INDEXACIÓN DEL ESPECIAL: las notas de `/experience-radar/mundial-2026/[slug]`
     deben publicarse como contenido de **Experience Radar**, no como marca genérica del
     dominio. Verifica que el HTML renderizado incluya:
     - `<title>` con formato `<seoTitle> | Experience Radar`.
     - `openGraph.siteName`, `applicationName` y `publisher` como `Experience Radar`.
     - `NewsArticle.author.name` y `NewsArticle.publisher.name` como `Experience Radar`.
     - `news-sitemap.xml` con `<news:name>Experience Radar</news:name>`.
     - La URL canónica en español y `hreflang` coherente con la ruta espejo en inglés.
   - Tras cambios de título, metadata, JSON-LD o sitemap de noticias, solicita recrawl /
     reindexación en Search Console para las URLs afectadas y vuelve a enviar o validar
     `https://medialab.design/news-sitemap.xml`.

AL TERMINAR:
   - Corre `npx tsc --noEmit` y `npm run build`.
   - Verifica que cada ruta local de imagen responda HTTP 200 y `Content-Type: image/*`.
   - Comprueba en el HTML de `/experience-radar/mundial-2026` que cada partido conserve su
     ruta local y que la imagen real NO tenga `opacity-0`. El componente `NoteImage` debe
     mostrar la imagen real inmediatamente y usar el fallback solo después de `onError`.
   - Si publicas cambios, confirma que producción ya entrega las rutas locales antes de
     decir que terminó. Incógnito no corrige un cambio que todavía no fue desplegado.
   - PUSH AUTOMÁTICO OBLIGATORIO: después de persistir/publicar notas que acaban de quedar
     accesibles, ejecuta `notifyNewlyPublishedArticles(await getAllRadarArticles())` o la
     ruta `/api/experience-radar/run`, que ya lo invoca. No dependas de un envío manual.
     Verifica y reporta `push.notified`, los slugs notificados y cualquier error. El push
     sigue siendo best-effort y no debe romper la publicación, pero siempre debe intentarse.
   - GIT AUTOMÁTICO OBLIGATORIO: al terminar la revisión, ejecuta pruebas, agrega únicamente
     los cambios del radar, crea un commit descriptivo y haz `git push` a la rama activa sin
     pedir confirmación adicional. Si el push falla, reporta el error exacto.
   - El flujo esperado es continuo: descarga de imagen -> guardado local -> commit de radar ->
     `git push`. No dejes imágenes nuevas fuera del commit ni pidas permiso extra para subirlas.
   - Dime qué partidos actualizaste, el marcador verificado, las fuentes usadas y cuáles
     imágenes nuevas agregaste o cuáles preservaste sin cambios.
```

---

## Fuentes sociales ampliadas y proyectos sugeridos

Además de Reddit, X, Latingoles, Win Sports y FIFA, el radar puede ampliar la **voz social**
con Instagram, Facebook, YouTube y páginas de analistas/comentaristas, siempre bajo estas
reglas:

1. **Solo contenido público o sesión propia ya disponible del navegador**. No fuerces login,
   no intentes romper CAPTCHA, no uses credenciales ajenas ni prometas acceso estable cuando
   la plataforma no lo garantiza.
2. **No conviertas una herramienta frágil en fuente única**. Instagram/Facebook/YouTube son
   señales complementarias; el hecho base del partido sigue validándose con FIFA y medios
   periodísticos serios.
3. **No uses cuotas ni picks de apuestas** como señal de sentimiento, predicción o análisis.
   Si una página mezcla estadísticas con betting, toma solo los datos deportivos verificables
   y excluye odds, casas, promociones y lenguaje de apuesta.

### Instagram (best-effort)

- **Proyecto recomendado**: `instaloader`
  - Repo: https://github.com/instaloader/instaloader
  - Docs: https://instaloader.github.io/
  - Útil para perfiles públicos, hashtags, captions, comentarios y metadatos de posts.
  - Uso editorial en el radar: reacciones de cuentas oficiales, captions, comentarios
    visibles, frecuencia de publicación, clips/fotos previas y narrativa visual del partido.
  - Si la plataforma endurece límites, úsalo como señal opcional; nunca bloquees la corrida
    completa del radar por depender de Instagram.
- **Alternativa con sesión propia**: `instagrapi`
  - Repo: https://github.com/subzeroid/instagrapi
  - Útil cuando `instaloader` bloquea perfiles públicos; requiere sesión/cookies propias y
    debe usarse solo para contenido visible con esa sesión.

### X / Twitter (best-effort, sin bearer oficial)

- **Proyecto recomendado con sesión propia**: `twikit`
  - Repo: https://github.com/d60/twikit
  - Usa endpoints internos de X/Twitter y no requiere API key/bearer oficial, pero sí puede
    requerir login/cookies. Úsalo para búsquedas, tweets y respuestas públicas.
- **Alternativa robusta con rotación de cuentas propias**: `twscrape`
  - Repo: https://github.com/vladkens/twscrape
  - Útil para búsquedas, timelines, replies y media usando cookies `auth_token`/`ct0` de una
    cuenta propia. No lo trates como acceso anónimo garantizado.
- **Fallback histórico/multired**: `snscrape`
  - Repo: https://github.com/JustAnotherArchivist/snscrape
  - Soporta varias redes y salidas JSONL, pero X ha cambiado sus barreras con frecuencia; si
    falla, registra el fallo y continúa con Reddit/YouTube/medios.

### Facebook (best-effort)

- **Proyecto recomendado**: `facebook-scraper`
  - Repo: https://github.com/kevinzg/facebook-scraper
  - Útil para páginas públicas y algunos grupos/posts públicos; puede requerir cookies
    exportadas desde una sesión propia del navegador para mejorar estabilidad.
  - Uso editorial en el radar: posts de páginas oficiales o medios, comentarios visibles,
    número y tono de reacciones, conversación de comunidades públicas.
  - No asumas cobertura estable de grupos privados ni de perfiles cerrados.

### YouTube (best-effort)

- **Proyecto ligero recomendado**: `youtube-comment-downloader`
  - Repo: https://github.com/egbertbouman/youtube-comment-downloader
  - Descarga comentarios sin usar la API oficial de YouTube.
- **Proyecto para chats de transmisiones y directos archivados**: `chat-downloader`
  - Repo: https://github.com/xenova/chat-downloader
  - Extrae mensajes de livestreams, videos, clips y broadcasts pasados sin autenticación; úsalo
    cuando haya watchalongs, directos o chats visibles alrededor del partido.
- **Proyecto de exploración/archivo**: `youtube-comment-suite`
  - Repo: https://github.com/mattwright324/youtube-comment-suite
  - Útil cuando haga falta revisar muchos videos/canales y detectar temas recurrentes.
- Uso editorial en el radar: comentarios de transmisiones, resúmenes, previas, ruedas de
  prensa, análisis de canales deportivos y clips postpartido.

### 365Scores y data visual del partido

- **Proyecto sugerido para shot maps/eventos**: helper de `LanusStats`
  - Referencia: https://github.com/federicorabanos/LanusStats/blob/main/LanusStats/threesixfivescores.py
  - Permite extraer `shotmap` y eventos desde URLs de partido de 365Scores.
- **Paquete alterno a evaluar**: https://pypi.org/project/365scores/
- Uso editorial en el radar: mapa de tiros, tiros al arco, secuencia de eventos, momentum y
  apoyos visuales para contrastar si la percepción de dominio coincide con lo que pasó.
- 365Scores **no reemplaza** la verificación oficial del marcador; funciona como capa de
  contexto visual/estadístico.

### Páginas de comentaristas y analistas de fútbol

- Prioriza páginas públicas, blogs, canales y cuentas verificables de analistas cuando
  aporten lectura táctica, explicación de una polémica o interpretación de una jugada.
- Úsalas como **fuente de interpretación**, no como única prueba del hecho.
- Si tomas una frase o lectura táctica, enlaza la URL exacta en `sources[]` y separa siempre
  el dato verificable del comentario editorial.

#### Lista curada de comentaristas / analistas reconocidos

Usa estas referencias como **pool preferente** cuando necesites contexto táctico, lectura de
partido, reacción postpartido o conversación cualificada. No es obligatorio consultar todas;
elige las pertinentes para el partido y la región.

- **Jonathan Wilson (The Guardian)** — análisis, táctica e historia del juego.
  - https://www.theguardian.com/profile/jonathanwilson
- **Tifo Football / The Athletic FC (YouTube)** — táctica, contexto y watchalongs.
  - https://www.youtube.com/channel/UCGYYNGmyhZ_kwBF_lqqXdAQ
- **The Overlap / Stick to Football (YouTube)** — debate de exjugadores y reacción a
  partidos grandes; útil para percepción pública y lectura de vestuario.
  - https://www.youtube.com/%40TheOverlap
- **La Media Inglesa (YouTube)** — análisis reconocido de fútbol inglés e internacional en
  español.
  - https://www.youtube.com/LaMediaInglesa
- **El Enganche / José David López (YouTube)** — fútbol internacional, contexto y análisis
  táctico/editorial en español.
  - https://www.youtube.com/c/elenganche/videos

#### Cómo usarlos dentro del radar

- **Para táctica y explicación de lo ocurrido**: Jonathan Wilson, Tifo Football, El Enganche.
- **Para conversación pública y reacción fuerte postpartido**: The Overlap, La Media Inglesa,
  canales y videos con watchalong o post-match reaction.
- **Para previas y contexto internacional**: El Enganche, La Media Inglesa, Tifo Football.
- **Para partidos del Mundial con mucho arrastre en inglés**: The Guardian, Tifo Football,
  The Overlap.

#### Criterio editorial al usarlos

- No tomes a un comentarista como fuente única del hecho base.
- Si un análisis contradice FIFA o el marcador oficial, prevalece la fuente oficial para el
  dato y el comentarista solo se cita como interpretación.
- Prioriza piezas publicadas el mismo día del partido o en la ventana inmediata posterior.
- Si un canal es demasiado opinativo o partidista para ese caso, úsalo solo como señal de
  comunidad, no como interpretación principal.

### Orden recomendado de consulta social

Cuando busques sentimiento o conversación para una nota, usa este orden de prioridad:

1. Reddit
2. Instagram
3. Facebook
4. YouTube
5. X
6. Google Trends
7. Latingoles / páginas de analistas como capa editorial adicional

> Si alguna plataforma no responde o exige barreras no razonables, sigue con la siguiente y
> deja constancia breve en el reporte final. El radar debe ser resistente a fuentes caídas.

## Submenú de contenido y predicción «Antes» en la nota

Cada **nota de partido** lleva, igual que el home, un **submenú de contenido** que aparece
bajo el header al hacer scroll (`components/experience-radar/match-note-nav.tsx`). Resalta la
sección activa y baja con scroll suave al ancla. Las secciones (y sus `id`) son:

| Menú | `id` | Qué contiene |
| --- | --- | --- |
| Resumen | `#resumen` | Marcador + lectura por fase (antes/ahora/después). |
| **Predicción** | `#prediccion` | El radar de fases **y** la «Ruta emocional del hincha» (journey map). |
| Hinchadas | `#hinchadas` | Cómo llegan / vivieron las hinchadas. |
| Aprendizajes | `#aprendizajes` | Los 3 hallazgos (solo en notas finalizadas). |
| Fuentes | `#fuentes` | Acordeón de fuentes consultadas. |

El menú solo muestra las secciones que existen en esa nota (p. ej. «Aprendizajes» no sale en
una previa). La sección del **journey map se llama «Predicción»** en el menú. Tras el `<h1>`
hay un **botón sutil «Predicción»** que enlaza a `#prediccion` y deja claro de qué partido es
(`title` con los equipos), porque algunos titulares no nombran a las dos selecciones.

**Predicción en «Antes» (journey map).** Antes el paso «Antes» solo mostraba la emoción
dominante; ahora también muestra una **caja de predicción** (Gana/Empata/Pierde + %), igual
que el «Pronóstico» del paso «Predicción». De dónde sale ese valor, en orden:

1. **Análisis previo** — la nota ANTERIOR de esa selección (último partido ya finalizado donde
   jugó). Se hereda su `teamRadars[].predicted.emotional`, que es justo la proyección que allí
   se hizo de cara a ESTE partido. La caja enlaza a esa nota previa.
2. **Voz de la hinchada** — si no hay nota previa con ese dato, se deriva del radar de
   `expectativa` de la propia nota (la lectura del ánimo previo, no una cuota).

> Implicación para el agente: el campo `predicted` de cada equipo NO es decorativo. Es lo que
> alimenta la predicción «Antes» de la SIGUIENTE nota de esa selección. Mantén `predicted`
> coherente con el rival real del próximo partido.

Toda caja de predicción (Antes y Pronóstico) **siempre nombra a la hinchada** y al rival
correspondiente, para que ninguna predicción quede sin equipo.

## Notas de implementación (referencia rápida)

- **Imágenes editoriales por etapa**: cada partido puede tener dos imágenes: una de previa
  y una final/de análisis. La previa se puede reemplazar cuando el partido pasa a en vivo,
  finalizado o pronóstico en el listado, pero debe conservarse en los campos
  `previewImage*`. Una vez analizado el encuentro, se conserva siempre la última imagen
  final en `imageUrl`.
- **Previas sin genéricos**: una previa analizada nunca debe quedar con imagen genérica de
  MediaLab, fallback del radar o `pickMatchImage`. Debe tener `imageUrl`, `imageCredit` e
  `imageSourceUrl` de una foto/noticia real de previa, copiada localmente. Si todavía no se
  consiguió foto verificable, deja la previa como calendario (`upcomingMatch`) hasta hallarla
  o documenta explícitamente el bloqueo.
- **Render por fase**: el especial usa `imageUrl`; la nota usa la imagen según fase. En
  «Antes del partido» puede mostrar `previewImageUrl`; en «Durante el partido» y
  «Pronóstico» debe mostrar `imageUrl`. Las notas finalizadas arrancan en «Durante el
  partido» si tienen `matchPhases.realidad`.
- **SEO de marca para indexación**: Google puede mostrar el dominio si no entiende la marca
  editorial. En las notas del Mundial, la marca visible para metadata, Open Graph, Twitter,
  JSON-LD `NewsArticle` y `news-sitemap.xml` es **Experience Radar**. El dominio sigue siendo
  `medialab.design`, pero el producto editorial se identifica como `Experience Radar`.
- **Imágenes editoriales fijas**: las fotos aprobadas finales viven en
  `public/images/experience-radar/mundial-2026/` y se referencian desde
  `src/lib/experience-radar/articleData.ts`. Actualmente están fijadas las de México vs
  Sudáfrica, Corea del Sur vs Chequia, Estados Unidos vs Paraguay, Canadá vs Bosnia y los
  cuatro partidos del sábado 13: Catar vs Suiza, Brasil vs Marruecos, Haití vs Escocia y
  Australia vs Turquía.
- **Respaldo sin imagen**: `pickMatchImage(seed)` elige una imagen local del pool de forma
  estable. Solo se usa cuando la nota no tiene foto o cuando el navegador dispara
  `onError`; nunca debe reemplazar preventivamente una imagen aprobada.
- **Protección al actualizar**: `generateArticles.ts` toma la imagen exclusivamente de la
  ficha existente del partido; `articleStore.ts` preserva la imagen anterior cuando una
  actualización llega sin imagen; `getAllRadarArticles()` reaplica la imagen bloqueada del
  seed por slug para neutralizar datos antiguos o incompletos guardados en KV/`.data`.
- **Render de imagen**: `components/experience-radar/note-image.tsx` no debe ocultar la
  imagen real esperando hidratación. No restaures la lógica `opacity-0` + `onLoad`, porque
  una imagen en caché puede cargar antes de hidratar React y quedar invisible para siempre.
- **Subida automática de imágenes y push**: cuando una nota cambia de previa a finalizado o
  necesita imagen editorial verificada, el agente debe descargar, validar, guardar y subir la
  imagen local sin pedir confirmación. Tras publicar notas accesibles, debe intentar el push
  automático y reportar `push.notified`, slugs notificados y errores best-effort.
- **Git sin confirmación adicional**: si en la corrida se agregan archivos nuevos de imagen en
  `public/images/experience-radar/mundial-2026/`, el agente debe incluirlos en el commit del
  radar y hacer `git push` a la rama activa sin preguntarme.
- **Imagen descargada = imagen publicada**: si una fuente autorizada entrega una imagen valida
  para una nota de radar, el agente debe descargarla, dejarla referenciada en la nota correcta,
  stagearla en git y subirla junto con el resto de la corrida sin pedir aprobacion extra.
- **Sin relleno ni frases comodin**: elimina cualquier texto generico tipo "los asistentes con IA
  durante el evento", "la tecnologia acompano la experiencia" o formulas parecidas si no salen de
  una fuente real y verificable del partido. Toda nota debe hablar del cruce concreto, no de un
  lugar comun.
- **Voz social real o nada**: Instagram, Facebook, YouTube, Reddit, X, Latingoles, Win Sports y
  paginas de analistas solo cuentan si entregan senales observables (comentarios, titulares,
  frases, clips o patrones de reaccion). Si una plataforma falla, bloquea, exige login o no ofrece
  evidencia clara, no inventes tono de hinchada; documenta el bloqueo y apoyate en las otras
  fuentes disponibles.
- **Robots / LLM / SEO / GEO**: antes de cerrar una corrida del especial, revisa que el contenido
  siga reforzando `Experience Radar` como marca editorial en metadata, JSON-LD, sitemap de
  noticias, `robots`/indexacion, archivos `llms*.txt` y demas superficies GEO/LLM del sitio. Si
  un cambio editorial afecta discoverability o descripcion del producto, actualizalo en la misma
  corrida o reporta el bloqueo exacto.
- **Estados de la nota**: `previa` no es accesible hasta que el partido pasa a en vivo /
  finalizado. El marcador hace que se trate como finalizado aunque el agente no lo marque.
- **"Analizado" SOLO con marcador**: un partido cuya hora ya pasó (finalizado por tiempo)
  pero SIN `matchScore` NO está analizado. La UI lo muestra como **"En análisis"** (píldora) y
  NUNCA recibe el badge **"Último analizado"** del listado. Ese badge marca el `matchScore` más
  reciente. Por tanto, para que un partido cuente como analizado, el agente DEBE llenar
  `matchScore` (y el resto del análisis final); no basta con que la hora haya pasado.
- **Ayer y hoy sin huecos**: antes de cerrar la corrida, revisa de forma explícita TODOS los
  partidos de ayer y de hoy. Si alguno ya terminó, debe quedar como `finishedMatch(...)` con
  marcador exacto, goleadores/minutos y análisis final completo. No puede quedar una previa
  accesible, una nota "en análisis" o una nota con badge de analizado si el partido ya acabó
  pero aún no tiene `matchScore`.
- **Fotos no recicladas entre partidos**: está prohibido reutilizar la foto de un partido A en
  la nota de un partido B aunque se guarde con otro nombre local. Antes de aprobar una imagen,
  valida que el `imageSourceUrl`, el contexto editorial y la foto correspondan al cruce real de
  esa nota. Si la imagen actual proviene de otro partido, reemplázala por una fuente específica
  del encuentro correcto.
- **"Ambas hinchadas"**: en "Cómo llegan las hinchadas", si las dos selecciones tendrían el
  mismo texto (previa sin `teamsData` por equipo), la UI colapsa las dos tarjetas en una sola
  ("Ambas hinchadas"). Para ver las dos diferenciadas, llena `teamsData` con la lectura propia
  de cada hinchada (ver regla de PREVIA ANALIZADA en el paso 3).
- **Próximo rival**: el pronóstico dice "vs X" tomando `nextOpponents[equipo]` (verificado) o,
  si falta, el siguiente partido de esa selección en el calendario. Llena `nextOpponents`
  cuando el siguiente cruce aún no exista como nota (ver paso 4b). Una selección eliminada puede
  seguir mostrando pronóstico si todavía le queda una fecha; solo desaparece cuando ya no tiene
  rival pendiente o el rival sigue sin definirse.
- **userExperience**: se llena dentro de cada equipo en `teamsData` del `finishedMatch(...)`.
  Ejemplo:
  ```ts
  userExperience: {
    realidad: "Cómo vivió EN DIGITAL la hinchada de ese país durante el partido…",
    percepcion: "…",
  },
  ```

## Notificaciones push (Web Push)

El usuario puede activar avisos de "nuevo análisis" en su dispositivo (botón en la página
del especial). Llega aunque el sitio esté cerrado. Hay **dos formas de enviar**:

- **Automático al publicar** (lo normal): cada vez que corre el agente
  (`/api/experience-radar/run`), al terminar avisa de las notas que recién quedaron
  accesibles (en vivo/finalizado) y no se habían notificado antes. 1 nota → push con su
  título y enlace a la nota; ≥2 notas → un solo push "Hay N análisis nuevos" al índice
  (evita spam). Lleva el control de slugs ya notificados en KV/`.data`, así que no
  repite. Best-effort: si falla el push, NO rompe la corrida del agente.
- **Manual** (puntual): el `curl` de abajo, por si quieres mandar un aviso a la medida.

> Apple/iPhone: el push web solo funciona si el usuario añadió el sitio a la pantalla de
> inicio (PWA, iOS 16.4+); en una pestaña normal de Safari el opt-in no aparece. En
> Android/Chrome funciona en pestaña normal.

### 1. Generar claves VAPID (una sola vez)
```bash
npx web-push generate-vapid-keys
```

### 2. Variables de entorno (Vercel → Settings → Environment Variables)
```
VAPID_PUBLIC_KEY=<clave pública>
VAPID_PRIVATE_KEY=<clave privada>
VAPID_SUBJECT=mailto:hello@medialab.design
NEXT_PUBLIC_VAPID_PUBLIC_KEY=<la MISMA clave pública>   # la usa el navegador
CRON_SECRET=<tu secreto>                                # ya debería existir
```
> `NEXT_PUBLIC_VAPID_PUBLIC_KEY` debe ser idéntica a `VAPID_PUBLIC_KEY`. Sin estas
> variables, el bloque de opt-in no aparece y el envío responde 500. Para persistir
> suscripciones en producción hace falta **Vercel KV** (`KV_REST_API_URL`,
> `KV_REST_API_TOKEN`); sin KV solo se guardan en `.data` local (efímero en Vercel).

### 3. Enviar un push MANUAL (opcional)
El automático ya cubre el caso normal; usa esto solo para un aviso a la medida.
```bash
curl -X POST "https://medialab.design/api/experience-radar/push/send" \
  -H "Authorization: Bearer $CRON_SECRET" \
  -H "Content-Type: application/json" \
  -d '{"title":"Nuevo análisis del Mundial","body":"Ya está el de <partido>","url":"/experience-radar/mundial-2026/<slug>"}'
```
Responde `{ ok, sent, failed, total }`. Las suscripciones caducadas (404/410) se limpian solas.
Nota: el manual NO marca slugs como notificados, así que un push manual sobre una nota que
luego se publique podría sumarse al automático.

### Archivos
- `public/sw.js` — service worker (push + clic).
- `components/experience-radar/push-optin.tsx` — opt-in (valida si ya está activo).
- `src/lib/experience-radar/pushStore.ts` — guarda suscripciones (KV/.data).
- `src/lib/experience-radar/pushSend.ts` — envío reutilizable (`sendRadarPush`), compartido por el manual y el automático.
- `src/lib/experience-radar/notifyPublishedArticles.ts` — envío AUTOMÁTICO al publicar (`notifyNewlyPublishedArticles`); control de slugs notificados.
- `app/api/experience-radar/push/subscribe/route.ts` — alta/baja (POST/DELETE).
- `app/api/experience-radar/push/send/route.ts` — envío manual (POST + Bearer CRON_SECRET).
- `app/api/experience-radar/run/route.ts` — agente diario; dispara el push automático al terminar.
