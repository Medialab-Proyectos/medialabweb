# Prompt — Actualización manual del Experience Radar (Mundial 2026)

**manual**
(los crons automáticos están desactivados a propósito).

---

```text
Actúa como mi motor de análisis del Experience Radar (especial Mundial 2026). NO uses
OpenAI ni datos inventados: investiga con tus herramientas (WebSearch/WebFetch) y verifica
todo contra fuentes reales antes de escribir.

PARTIDO(S) A ACTUALIZAR: los pendientes del día a anetrior a actulizar, se actualiza la previa su estan a 24horas o se llenan completo si ya juagaron, valida que esten tidos los partidos, y se incluyeb los partidos a 48 horas que no esten pero como ya sabes no accesibles

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
   - imageUrl/imageCredit/imageSourceUrl SOLO si la imagen es real y enlazable de un medio
     reconocido. Si no hay, NO pongas imageUrl: el sistema usa el respaldo (imagen de
     anfitrión para México/EE. UU./Canadá si juegan; si no, una del pool aleatorio).

4) ELIMINACIÓN: si una selección de la nota ya quedó fuera del Mundial (sin más partidos),
   agrega su nombre a eliminatedTeams en esa nota, para que NO se habilite el pronóstico.

CUMPLIMIENTO (obligatorio):
   - Sin contenido de apuestas ni cuotas. Sin logos oficiales de FIFA.
   - No reproduzcas notas completas: resumen propio + enlaces de referencia.
   - El pronóstico es lectura de ánimo colectivo, NO predicción de marcador ni cuota.
   - Corrige cualquier dato fabricado que encuentres por uno verificado.

AL TERMINAR: corre `npx tsc --noEmit`, dime qué partidos actualizaste, el marcador
verificado de cada uno y las fuentes que usaste.
```

---

## Notas de implementación (referencia rápida)

- **Imágenes de anfitrión**: `radar-uxschool-futbol-mexico/usa/canada.png` se usan solo en
  partidos de ese equipo y solo como respaldo (no están en el pool aleatorio).
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
