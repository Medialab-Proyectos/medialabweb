# Prompt — Actualización manual del Experience Radar (Mundial 2026)

**manual**
(los crons automáticos están desactivados a propósito).

---

```text
Actúa como mi motor de análisis del Experience Radar (especial Mundial 2026). NO uses
OpenAI ni datos inventados: investiga con tus herramientas (WebSearch/WebFetch) y verifica
todo contra fuentes reales antes de escribir.

PARTIDO(S) A ACTUALIZAR: los pendientes del día anterior; se actualiza la previa si están
a 24 horas o se llenan completos si ya jugaron. Valida que estén todos los partidos e
incluye los partidos a 48 horas que no estén, pero todavía como notas no accesibles.

VENTANA PRIORITARIA DE 12 HORAS: al inicio de CADA corrida, calcula la hora actual con
zona horaria y revisa todos los partidos que comiencen durante las siguientes 12 horas.
Contrasta horario, sede, novedades de plantilla, declaraciones y conversación previa en
al menos 3 fuentes. Actualiza su previa aunque ya exista. Si no hay partidos en la ventana,
déjalo registrado expresamente en el reporte final con la hora exacta del corte.
No crees una segunda previa ni reemplaces una previa editorial completa: si ya existe,
solo actualízala cuando haya un dato nuevo, verificable y relevante.

PASOS:
1) INVESTIGA cada partido en al menos 3 fuentes y CRUZA datos:
   - Resultado y desarrollo: FIFA oficial, ESPN, AS/Marca, medios deportivos serios.
   - Voz de la hinchada (sentimiento, memes, quejas, euforia): Latingoles, Reddit (r/soccer
     y subs de cada selección), X/redes, Google Trends.
   - Confirma marcador EXACTO, goleadores con minuto, polémicas arbitrales y frases reales.
   Si un dato no se puede verificar, NO lo incluyas.

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
   - keyPlays[], controversies[], statements[] (frases reales citadas con su fuente)
   - combined: expectativa/realidad/percepcion — cada una con los 6 ejes 0–100
     (euforia, confianza, ansiedad, frustracion, incertidumbre, optimismo) coherentes
     con lo que realmente pasó.
   - teamsData[2] (FinishedTeam): expectedEmotion, dominantConversation, fanConfidence,
     mainNarrative, howTheyArrived, whatHappened, expectationVsReality, mood,
     behaviorEffect, current{6 ejes}, predicted{6 ejes}.
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
     `imageSourceUrl` actuales. Si ya tiene una imagen aprobada, CONSÉRVALA exactamente:
     actualizar el análisis, marcador o fuentes NUNCA autoriza cambiar la foto.
   - Solo busca imagen cuando la nota NO tenga una. La búsqueda es OBLIGATORIA e insistente:
     prueba primero el scraping y la noticia específica en `https://latingoles.com/` y
     `https://www.winsports.co/`; si no aparece o bloquea la descarga, continúa con FIFA,
     AP, Reuters, The Guardian, ESPN, AS, Marca, El País, Cadena SER y otros medios serios.
     No abandones la búsqueda tras una sola URL, un 403 o un CDN bloqueado: prueba la imagen
     original, `og:image`, variantes del CDN y otra fuente periodística. Registra en el
     reporte final qué dominios intentaste y por qué no se obtuvo imagen, si ese fue el caso.
   - Usa una fotografía real del partido procedente de una fuente autorizada, verifica
     visualmente que corresponda a los equipos y descarga una copia en
     `public/images/experience-radar/mundial-2026/`. `imageUrl` debe apuntar a la ruta local
     `/images/experience-radar/mundial-2026/<slug-corto>.jpg`; conserva el crédito y la URL
     de la noticia original en `imageCredit` e `imageSourceUrl`.
   - La descarga y adición de imágenes al repositorio es AUTOMÁTICA: no pidas confirmación
     editorial antes de descargar, validar, guardar y preparar la imagen para publicación.
   - NO uses hotlink como `imageUrl`: una URL externa puede responder 409/403 o bloquearse
     por referer y hacer que aparezca el respaldo aunque la foto exista. Comprueba que el
     archivo descargado sea una imagen válida, no HTML, y que tenga tamaño/dimensiones
     razonables. Si no consigues una foto verificable, deja `imageUrl` vacío; el sistema
     escogerá un respaldo local estable según el slug.
   - Las imágenes declaradas en `RADAR_ARTICLE_SEED` quedan bloqueadas por slug mediante
     `LOCKED_SEED_IMAGES`. No elimines ese bloqueo ni permitas que el store, el scraping,
     X, Reddit, Latingoles o una ejecución posterior del generador las sobrescriban.
   - ORDEN DIARIO: dentro de cada fecha, la nota analizada o actualizada más recientemente
     debe aparecer primero. Conserva `analyzedPreviaAt`/`analyzedFinalAt` para ese orden.

4) ELIMINACIÓN: si una selección de la nota ya quedó fuera del Mundial (sin más partidos),
   agrega su nombre a eliminatedTeams en esa nota, para que NO se habilite el pronóstico.

CUMPLIMIENTO (obligatorio):
   - Sin contenido de apuestas ni cuotas. Sin logos oficiales de FIFA.
   - No reproduzcas notas completas: resumen propio + enlaces de referencia.
   - El pronóstico es lectura de ánimo colectivo, NO predicción de marcador ni cuota.
   - Corrige cualquier dato fabricado que encuentres por uno verificado.

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
   - Dime qué partidos actualizaste, el marcador verificado, las fuentes usadas y cuáles
     imágenes nuevas agregaste o cuáles preservaste sin cambios.
```

---

## Notas de implementación (referencia rápida)

- **Imágenes editoriales fijas**: las fotos aprobadas viven en
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
- **Estados de la nota**: `previa` no es accesible hasta que el partido pasa a en vivo /
  finalizado. El marcador hace que se trate como finalizado aunque el agente no lo marque.
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
