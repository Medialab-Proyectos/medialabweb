/**
 * Experience Radar — artículos editoriales (borradores de ejemplo).
 *
 * Contenido propio de MediaLab. NO reproduce noticias completas de terceros: cada
 * artículo enlaza a fuentes oficiales/autorizadas solo como referencia. Datos de
 * partido mostrados como ejemplo editorial en estado BORRADOR, pendientes de
 * verificación y revisión humana antes de publicar.
 */

import {
  generateRadarArticle,
  type ArticleSourceRef,
  type EmotionalRadarValues,
  type ProductApplication,
  type RadarArticle,
  type RadarArticleInput,
  type TeamRadar,
} from "./articles"
import { getStoredRadarArticles } from "./articleStore"
import { compareForFeed } from "./articleAvailability"

function upcomingMatch(input: {
  date: string
  kickoffAt: string
  slug: string
  teams: [string, string]
  group: string
  officialUrl: string
}): RadarArticleInput {
  const label = input.teams.join(" vs ")
  return {
    category: "Fan Experience",
    date: input.date,
    kickoffAt: input.kickoffAt,
    slug: input.slug,
    matchState: "previa",
    updateState: "ready",
    // Marcador de calendario: se ve en el listado pero no se abre hasta tener análisis real.
    placeholder: true,
    seoTitle: `${label}: previa y expectativa del Mundial 2026`,
    teams: input.teams,
    event: `Mundial 2026 — ${input.group}`,
    hook: `La expectativa de las hinchadas antes de ${label}`,
    quickSummary: `${label} está en el calendario del Mundial 2026. La nota se habilita cuando nuestro equipo complete el análisis de la experiencia y la conversación de las hinchadas; por ahora es solo referencia del fixture.`,
    whatHappened: `El partido todavía no ha comenzado. Experience Radar activa esta nota exactamente dentro de las 24 horas previas para registrar cómo evolucionan la expectativa, la ansiedad informativa y las narrativas colectivas alrededor de ${label}. Después del encuentro, la misma nota se actualizará con el análisis final.`,
    keyPlays: ["El partido aún no comienza; este bloque se actualizará después del encuentro."],
    controversies: [],
    statements: ["Horario y encuentro contrastados con el calendario oficial de FIFA."],
    fanPulse: {
      concerns: ["Horario y disponibilidad del partido", "Alineaciones y estado de los equipos", "Expectativa antes del debut"],
      emotions: ["Expectativa", "Ansiedad previa", "Sentido de pertenencia"],
      frustrations: ["Información dispersa antes del partido"],
      enthusiasm: ["Inicio de la participación de ambas selecciones"],
      sources: [{ name: `FIFA — ${label}`, url: input.officialUrl, kind: "oficial" }],
    },
    mediaLabInsight: {
      humanBehavior: "En las horas previas, la audiencia convierte información incompleta en expectativas firmes y busca señales que reduzcan la incertidumbre.",
      cognitiveBiases: ["Sesgo de optimismo", "Prueba social", "Efecto de disponibilidad"],
      emotionalReaction: "La cercanía del inicio eleva simultáneamente la emoción y la necesidad de información confiable.",
      digitalPatterns: "Aumentan las búsquedas de horario, alineación, transmisión y noticias recientes de los equipos.",
    },
    productApplications: [
      { sector: "Producto digital", application: "Mostrar estado, hora y próxima actualización reduce la incertidumbre antes de un evento importante." },
      { sector: "Streaming", application: "Preparar acceso y mensajes de capacidad antes del pico evita fricción en los minutos previos." },
    ],
    emotionalRadar: { euforia: 70, confianza: 62, ansiedad: 58, frustracion: 24, incertidumbre: 55, optimismo: 68 },
    scoreFactors: { emotionalImpact: 76, digitalConversation: 70, virality: 66, userInterest: 82 },
    uxFinding: "La experiencia comienza antes del evento: reducir incertidumbre y mantener visible la próxima actualización protege la confianza.",
    aiSummary: `${label} entra en la ventana de análisis de 24 horas del Experience Radar. La nota observa expectativa, ansiedad informativa y conversación digital antes del inicio, usando el calendario oficial como referencia. Tras el partido, esta misma URL se actualizará con el análisis final de comportamiento, emociones y aprendizajes para productos digitales.`,
    sources: [{ name: `FIFA — ${label}`, url: input.officialUrl, kind: "oficial" }],
  }
}

/** Una hinchada en una nota finalizada: narrativa + radar emocional (actual y próximo). */
interface FinishedTeam {
  team: string
  expectedEmotion: string
  dominantConversation: string
  fanConfidence: string
  mainNarrative: string
  howTheyArrived: string
  whatHappened: string
  expectationVsReality: string
  mood: string
  behaviorEffect: string
  current: EmotionalRadarValues
  predicted: EmotionalRadarValues
  /** Experiencia de usuario vivida ESPECÍFICA de esta hinchada, por etapa (opcional). */
  userExperience?: { expectativa?: string; realidad?: string; percepcion?: string }
}

/**
 * Nota de partido FINALIZADO con datos reales. Ensambla la estructura completa (estado,
 * marcador, fases, radar por hinchada, hinchadas, aprendizajes) a partir de la narrativa
 * y deja la prosa específica en cada llamada. Mantiene consistencia y evita olvidar campos.
 */
function finishedMatch(input: {
  date: string
  kickoffAt: string
  slug: string
  group: string
  home: string
  away: string
  homeGoals: number
  awayGoals: number
  scoreDetail: string
  seoTitle: string
  hook: string
  matchSummary: string
  quickSummary: string
  whatHappened: string
  aiSummary: string
  uxFinding: string
  keyPlays: string[]
  controversies: string[]
  statements: string[]
  combined: { expectativa: EmotionalRadarValues; realidad: EmotionalRadarValues; percepcion: EmotionalRadarValues }
  teamsData: [FinishedTeam, FinishedTeam]
  lessons: Array<{ term: string; explanation: string }>
  humanBehavior: string
  cognitiveBiases: string[]
  emotionalReaction: string
  digitalPatterns: string
  productApplications: ProductApplication[]
  fanPulse: { concerns: string[]; emotions: string[]; frustrations: string[]; enthusiasm: string[] }
  sources: Array<{ name: string; url: string; kind: ArticleSourceRef["kind"] }>
  imageUrl?: string
  imageAlt?: string
  imageCredit?: string
  imageSourceUrl?: string
}): RadarArticleInput {
  const teamRadars: TeamRadar[] = input.teamsData.map((t) => ({
    team: t.team,
    current: { score: avgEmo(t.current), emotional: t.current },
    predicted: { score: avgEmo(t.predicted), emotional: t.predicted },
  }))
  return {
    category: "Fan Experience",
    date: input.date,
    kickoffAt: input.kickoffAt,
    slug: input.slug,
    matchState: "finalizado",
    updateState: "ready",
    imageUrl: input.imageUrl,
    imageAlt: input.imageAlt,
    imageCredit: input.imageCredit,
    imageSourceUrl: input.imageSourceUrl,
    matchScore: {
      home: input.home,
      away: input.away,
      homeGoals: input.homeGoals,
      awayGoals: input.awayGoals,
      detail: input.scoreDetail,
    },
    matchSummary: input.matchSummary,
    matchPhases: input.combined,
    teamApproach: input.teamsData.map((t) => ({
      team: t.team,
      expectedEmotion: t.expectedEmotion,
      dominantConversation: t.dominantConversation,
      fanConfidence: t.fanConfidence,
      mainNarrative: t.mainNarrative,
      howTheyArrived: t.howTheyArrived,
      whatHappened: t.whatHappened,
      expectationVsReality: t.expectationVsReality,
      userExperience: t.userExperience,
    })),
    teamRadars,
    collectiveByTeam: input.teamsData.map((t) => ({ team: t.team, mood: t.mood, behaviorEffect: t.behaviorEffect })),
    lessons: input.lessons.map((l) => ({ ...l, phase: "despues" as const })),
    seoTitle: input.seoTitle,
    teams: [input.home, input.away],
    event: `Mundial 2026 — ${input.group}`,
    hook: input.hook,
    quickSummary: input.quickSummary,
    whatHappened: input.whatHappened,
    keyPlays: input.keyPlays,
    controversies: input.controversies,
    statements: input.statements,
    fanPulse: {
      ...input.fanPulse,
      sources: input.sources.filter((s) => s.kind === "conversacion" || s.kind === "tendencia").slice(0, 3),
    },
    mediaLabInsight: {
      humanBehavior: input.humanBehavior,
      cognitiveBiases: input.cognitiveBiases,
      emotionalReaction: input.emotionalReaction,
      digitalPatterns: input.digitalPatterns,
    },
    productApplications: input.productApplications,
    emotionalRadar: input.combined.percepcion,
    scoreFactors: { emotionalImpact: 86, digitalConversation: 84, virality: 86, userInterest: 88 },
    uxFinding: input.uxFinding,
    aiSummary: input.aiSummary,
    sources: input.sources,
  }
}

const avgEmo = (e: EmotionalRadarValues): number =>
  Math.round(Object.values(e).reduce((a, b) => a + b, 0) / Object.values(e).length)

const ARTICLE_INPUTS: RadarArticleInput[] = [
  {
    category: "Fan Experience",
    date: "2026-06-12",
    kickoffAt: "2026-06-12T19:00:00.000Z",
    slug: "canada-bosnia-herzegovina-mundial-2026",
    matchState: "finalizado",
    updateState: "ready",
    imageAlt: "Canadá vs Bosnia y Herzegovina — empate 1-1 en BMO Field, Mundial 2026",
    matchScore: {
      home: "Canadá",
      away: "Bosnia y Herzegovina",
      homeGoals: 1,
      awayGoals: 1,
      detail: "Bosnia: Lukić (1ª mitad). Canadá: Cyle Larin 78'. Empate y primer punto de Canadá en la historia de los Mundiales.",
    },
    matchSummary:
      "Canadá rescató un 1-1 ante Bosnia y Herzegovina en BMO Field y sumó su PRIMER punto en la historia de los Mundiales (había perdido los seis partidos de 1986 y 2022). Bosnia se adelantó con el primer gol internacional de Lukić; Canadá empató con Cyle Larin (78'). El mismo marcador se vivió de forma opuesta: fiesta para el anfitrión, decepción para Bosnia.",
    matchPhases: {
      // Antes: ilusión nerviosa del anfitrión en su estreno en casa.
      expectativa: { euforia: 64, confianza: 56, ansiedad: 58, frustracion: 26, incertidumbre: 56, optimismo: 66 },
      // Durante: tensión con el 0-1 y alivio con el empate sobre el tramo final.
      realidad: { euforia: 64, confianza: 54, ansiedad: 76, frustracion: 58, incertidumbre: 66, optimismo: 64 },
      // Después: el empate se ENCUADRA como hito histórico para Canadá → euforia.
      percepcion: { euforia: 80, confianza: 72, ansiedad: 34, frustracion: 30, incertidumbre: 34, optimismo: 82 },
    },
    matchInterpretations: {
      expectativa: {
        euforia: "Canadá llegó ilusionada a su estreno en casa, con la energía de jugar un Mundial como anfitrión.",
        confianza: "Confianza moderada: ganas de competir, pero con el peso de no haber sumado nunca en un Mundial.",
        ansiedad: "Ansiedad alta por el debut en casa y por romper una racha histórica de derrotas.",
        frustracion: "Baja antes del pitazo; dominaba la ilusión del estreno.",
        incertidumbre: "Incógnita real sobre el nivel del equipo frente a una Bosnia ordenada.",
        optimismo: "Optimismo prudente, apoyado en el empuje del público local.",
      },
      realidad: {
        euforia: "La euforia llegó con el empate de Larin (78'): el público pasó del silencio a la celebración en segundos.",
        confianza: "La confianza cayó con el 0-1 y se recuperó al empatar; el relato pasó de 'otra vez no' a 'al menos un punto'.",
        ansiedad: "El pico de ansiedad fue ir por detrás en casa, con la racha histórica pesando sobre cada minuto.",
        frustracion: "La frustración del gol de Bosnia fue intensa; el empate la convirtió en alivio.",
        incertidumbre: "Mientras el marcador estuvo en contra, la duda de 'sumaremos algún día' volvió a aparecer.",
        optimismo: "El gol del empate reconstruyó el optimismo: un punto en casa se sintió como un avance real.",
      },
      percepcion: {
        euforia: "El recuerdo es de fiesta: un empate se celebra como triunfo cuando tu referencia es no haber sumado nunca.",
        confianza: "Queda confianza: 'ya sabemos lo que es sumar en un Mundial'. El punto rompe un techo psicológico.",
        ansiedad: "Baja con fuerza: el hito histórico disuelve la presión acumulada.",
        frustracion: "Para Canadá casi desaparece; para Bosnia crece, porque iban ganando.",
        incertidumbre: "Se reduce la incertidumbre identitaria del equipo: ya tiene un primer logro en el torneo.",
        optimismo: "El optimismo se dispara de cara al grupo: el primer punto cambia la forma de mirar lo que viene.",
      },
    },
    teamApproach: [
      {
        team: "Canadá",
        expectedEmotion: "Ilusión nerviosa por debutar como anfitrión.",
        dominantConversation: "Soñar con sumar por primera vez en un Mundial, en casa.",
        fanConfidence: "Confianza moderada, con el peso de una racha histórica de derrotas.",
        mainNarrative: "El anfitrión que quiere escribir una primera página positiva.",
        howTheyArrived: "Por detrás en el marcador tras el gol de Bosnia en la primera mitad.",
        whatHappened: "Empataron con Cyle Larin (78') y lograron su PRIMER punto mundialista.",
        expectationVsReality: "Un empate que, por su historia, se vivió como un triunfo y un alivio enorme.",
      },
      {
        team: "Bosnia y Herzegovina",
        expectedEmotion: "Expectativa de dar el golpe ante un anfitrión con presión.",
        dominantConversation: "Aprovechar el debut para sumar de visitante.",
        fanConfidence: "Confianza de competir de igual a igual.",
        mainNarrative: "Sorprender y arrancar con buen pie el grupo.",
        howTheyArrived: "Golpearon primero con el debut goleador de Lukić y acariciaron el triunfo.",
        whatHappened: "Se dejaron empatar sobre el cierre y sintieron el 1-1 como dos puntos perdidos.",
        expectationVsReality: "Estuvieron a minutos de ganar; el mismo empate les supo a decepción.",
      },
    ],
    lessons: [
      { term: "Punto de referencia", explanation: "El valor de un resultado es relativo a una expectativa, no absoluto: un empate es triunfo para quien nunca sumó y decepción para quien iba ganando.", phase: "despues" },
      { term: "Efecto de encuadre", explanation: "El mismo dato cambia de significado según cómo se enmarque: '1-1' o 'primer punto histórico' producen emociones opuestas.", phase: "despues" },
      { term: "Aversión a la pérdida", explanation: "Bosnia sintió más el punto perdido (iban ganando) que Canadá el punto ganado: perder duele más que ganar lo mismo alegra.", phase: "despues" },
    ],
    teams: ["Canadá", "Bosnia y Herzegovina"],
    event: "Mundial 2026 — Grupo B",
    hook: "El primer punto de Canadá en la historia de los Mundiales",
    seoTitle:
      "Canadá 1-1 Bosnia: resultado, resumen y el primer punto histórico del anfitrión en el Mundial 2026",
    quickSummary:
      "Canadá empató 1-1 con Bosnia y Herzegovina en su estreno como anfitrión y sumó su PRIMER punto en la historia de los Mundiales tras seis derrotas en 1986 y 2022. Bosnia se adelantó con el gol de Lukić y Cyle Larin igualó (78'). El partido es un caso claro de cómo el mismo resultado se vive como triunfo o como decepción según el punto de referencia de cada hinchada.",
    whatHappened:
      "En BMO Field, Toronto, Canadá debutaba como anfitrión cargando una estadística incómoda: ningún punto en sus dos Mundiales previos (1986 y 2022), seis partidos y seis derrotas. Bosnia y Herzegovina golpeó primero, con el primer gol internacional de Lukić que puso el 0-1 antes del descanso y silenció a un estadio expectante. Durante buena parte del segundo tiempo, la afición local revivió el fantasma de la racha. La reacción llegó con Cyle Larin, que entró desde el banco y empató en el 78' para desatar la celebración. El 1-1 final dejó dos lecturas opuestas: para Canadá, un punto histórico que se festejó como una victoria; para Bosnia, dos puntos que se escaparon teniendo el partido controlado. La conversación digital reflejó ese contraste de marcos: euforia y orgullo de un lado, frustración del otro, ante exactamente el mismo marcador.",
    keyPlays: [
      "Primer gol internacional de Lukić para el 0-1 de Bosnia (1ª mitad).",
      "Ingreso de Cyle Larin desde el banco y empate en el 78'.",
      "Canadá rompe su racha y suma su primer punto mundialista.",
    ],
    controversies: [
      "Canadá lamentó la fragilidad defensiva en el gol de Bosnia.",
      "Bosnia se reprochó no haber cerrado un partido que ganaba.",
    ],
    statements: [
      "La afición canadiense celebró el punto como un hito, más que el nivel de juego.",
      "El entorno de Bosnia vivió el empate como una oportunidad perdida.",
    ],
    fanPulse: {
      concerns: ["¿Por qué concedimos el primer gol?", "¿Alcanza este nivel para competir el grupo?", "¿Cómo llega Canadá al próximo partido?"],
      emotions: ["Tensión con el 0-1", "Alivio con el empate", "Orgullo por el primer punto"],
      frustrations: ["El bache defensivo del gol de Bosnia.", "El miedo a repetir la racha de derrotas."],
      enthusiasm: ["Festejo por el hito histórico en casa.", "Ilusión renovada para el resto del grupo."],
      sources: [
        { name: "Reddit — r/soccer (match thread)", url: "https://www.reddit.com/r/soccer/", kind: "conversacion" },
        { name: "Google Trends — picos de búsqueda en vivo", url: "https://trends.google.com/trends/", kind: "tendencia" },
      ],
    },
    mediaLabInsight: {
      humanBehavior:
        "No juzgamos un resultado en absoluto, sino respecto a un punto de referencia. El mismo 1-1 es un triunfo para quien nunca había sumado y una decepción para quien iba ganando: la expectativa define la emoción.",
      cognitiveBiases: [
        "Punto de referencia: el valor percibido es relativo a una expectativa, no absoluto.",
        "Efecto de encuadre: '1-1' vs 'primer punto histórico' producen reacciones opuestas.",
        "Aversión a la pérdida: a Bosnia le dolió más el punto perdido que a Canadá le alegró el ganado.",
      ],
      emotionalReaction:
        "La carga emocional no la dio el marcador, sino la distancia entre lo esperado y lo logrado por cada hinchada.",
      digitalPatterns:
        "Dos conversaciones paralelas con el mismo dato: celebración e hito de un lado, frustración y autocrítica del otro.",
    },
    productApplications: [
      {
        sector: "Producto digital",
        application:
          "El mismo resultado se siente como éxito o fracaso según la expectativa que fijaste: encuadrar y anclar bien las expectativas cambia la satisfacción percibida sin cambiar el producto.",
      },
      {
        sector: "Fintech",
        application:
          "Un rendimiento o un reembolso parcial se vive distinto según el punto de referencia mostrado: comunicar el marco correcto evita que un resultado neutro se perciba como pérdida.",
      },
      {
        sector: "SaaS / Onboarding",
        application:
          "Ancla metas alcanzables al inicio: un avance modesto se siente como logro si la referencia está bien puesta, y eso sostiene la activación.",
      },
    ],
    emotionalRadar: { euforia: 80, confianza: 72, ansiedad: 40, frustracion: 32, incertidumbre: 36, optimismo: 82 },
    collectiveByTeam: [
      {
        team: "Canadá",
        mood: "Orgullo y alivio por el primer punto",
        behaviorEffect:
          "Llegan al próximo partido envalentonados: el techo psicológico roto eleva la confianza pública, la participación y la narrativa de 'ya sumamos, ahora vamos por más'.",
      },
      {
        team: "Bosnia y Herzegovina",
        mood: "Frustración por dejar escapar la victoria",
        behaviorEffect:
          "Llegan con autocrítica: la conversación se centra en cerrar partidos y en no repetir el desenlace, con más cautela que euforia.",
      },
    ],
    teamRadars: [
      {
        team: "Canadá",
        // Empate vivido como hito histórico (primer punto): euforia y orgullo altos.
        current: {
          score: 80,
          emotional: { euforia: 80, confianza: 72, ansiedad: 34, frustracion: 28, incertidumbre: 34, optimismo: 82 },
        },
        predicted: {
          score: 74,
          emotional: { euforia: 72, confianza: 74, ansiedad: 42, frustracion: 32, incertidumbre: 42, optimismo: 80 },
        },
      },
      {
        team: "Bosnia y Herzegovina",
        // Iban ganando y se dejaron empatar: el 1-1 supo a dos puntos perdidos.
        current: {
          score: 46,
          emotional: { euforia: 30, confianza: 40, ansiedad: 60, frustracion: 70, incertidumbre: 58, optimismo: 40 },
        },
        predicted: {
          score: 52,
          emotional: { euforia: 42, confianza: 48, ansiedad: 54, frustracion: 54, incertidumbre: 52, optimismo: 50 },
        },
      },
    ],
    scoreFactors: { emotionalImpact: 84, digitalConversation: 80, virality: 82, userInterest: 84 },
    uxFinding:
      "La satisfacción no depende del resultado absoluto sino de la expectativa con la que se compara. Fijar el punto de referencia adecuado puede convertir un resultado neutro en una experiencia percibida como un triunfo.",
    aiSummary:
      "Canadá empató 1-1 con Bosnia y Herzegovina en el Mundial 2026 y logró su primer punto histórico tras seis derrotas en sus dos participaciones previas: Lukić adelantó a Bosnia y Cyle Larin igualó (78'). Experience Radar de MediaLab lo analiza desde el comportamiento: por el punto de referencia y el efecto de encuadre, el mismo marcador se vivió como triunfo (Canadá) y como decepción (Bosnia). Para productos digitales —fintech, SaaS, producto— la lección es que la satisfacción es relativa a la expectativa: encuadrar y anclar bien las expectativas cambia el valor percibido sin cambiar el resultado.",
    sources: [
      { name: "FIFA — reporte oficial Canadá 1-1 Bosnia y Herzegovina", url: "https://www.fifa.com/en/tournaments/mens/worldcup/canadamexicousa2026", kind: "oficial" },
      { name: "ESPN — Canadá logra su primer punto mundialista", url: "https://www.espn.com/soccer/match/_/gameId/760416/bosnia-herzegovina-canada", kind: "referencia" },
      { name: "Reddit r/soccer — hilo posterior del partido", url: "https://www.reddit.com/r/soccer/", kind: "conversacion" },
    ],
  },
  // ─────────────── Estados Unidos 4-1 Paraguay · FINALIZADO (datos reales) ───────────────
  {
    category: "Fan Experience",
    date: "2026-06-12",
    kickoffAt: "2026-06-13T01:00:00.000Z",
    slug: "estados-unidos-paraguay-mundial-2026",
    matchState: "finalizado",
    updateState: "ready",
    matchScore: {
      home: "Estados Unidos",
      away: "Paraguay",
      homeGoals: 4,
      awayGoals: 1,
      detail: "EE. UU.: autogol de Bobadilla 7', Folarin Balogun 31' y 45'+, Gio Reyna. Paraguay: Mauricio. Posesión 63-37 y 17 remates a 8 para el anfitrión.",
    },
    imageAlt: "Estados Unidos 4-1 Paraguay — debut del anfitrión en el Mundial 2026, Los Ángeles",
    matchSummary:
      "Estados Unidos arrancó su Mundial como local con un contundente 4-1 ante Paraguay en Los Ángeles. Un autogol tempranero de Bobadilla (7') encarriló el partido, Folarin Balogun firmó un doblete en la primera mitad y Gio Reyna cerró la goleada; Mauricio marcó el descuento. Más que el resultado, lo relevante es cómo un debut dominante dispara la euforia y, con ella, una expectativa difícil de sostener.",
    matchPhases: {
      expectativa: { euforia: 66, confianza: 60, ansiedad: 54, frustracion: 28, incertidumbre: 58, optimismo: 64 },
      realidad: { euforia: 86, confianza: 80, ansiedad: 40, frustracion: 30, incertidumbre: 32, optimismo: 84 },
      percepcion: { euforia: 90, confianza: 86, ansiedad: 30, frustracion: 24, incertidumbre: 26, optimismo: 90 },
    },
    teamApproach: [
      {
        team: "Estados Unidos",
        expectedEmotion: "Ansiedad de anfitrión: presión por validar el proyecto en casa.",
        dominantConversation: "Dudas sobre el nivel real del equipo frente a una Sudamérica incómoda.",
        fanConfidence: "Confianza contenida, marcada por años de altibajos de la selección.",
        mainNarrative: "El anfitrión que necesita un debut convincente para ilusionar al país.",
        howTheyArrived: "Con la presión del estreno y el autogol tempranero a favor que aflojó la tensión.",
        whatHappened: "El doblete de Balogun y el cierre de Reyna convirtieron la ansiedad en fiesta: 4-1 y sensación de poderío.",
        expectationVsReality: "Esperaban un debut exigente y se llevaron una goleada que disparó la euforia por encima de lo previsto.",
      },
      {
        team: "Paraguay",
        expectedEmotion: "Confianza competitiva apoyada en su solidez sudamericana.",
        dominantConversation: "Aguantar al anfitrión y golpear en las transiciones.",
        fanConfidence: "Confianza serena, sin sobrevender el debut.",
        mainNarrative: "Equipo ordenado que esperaba dar pelea de igual a igual.",
        howTheyArrived: "Golpeados por el autogol temprano y desbordados por el ritmo local.",
        whatHappened: "El 0-4 dejó al margen su plan; el gol de Mauricio fue apenas un consuelo estadístico.",
        expectationVsReality: "La expectativa de competir se transformó en una derrota dura que obliga a recomponer el ánimo.",
      },
    ],
    lessons: [
      { term: "Efecto halo", explanation: "Un primer gran resultado tiñe toda la percepción: tras el 4-1, cada virtud del equipo se magnifica y los defectos se minimizan.", phase: "despues" },
      { term: "Anclaje de expectativas", explanation: "Una goleada de debut fija un listón alto: el próximo partido se juzgará contra ese 4-1, no contra la realidad.", phase: "despues" },
      { term: "Exceso de confianza", explanation: "El riesgo de un arranque dominante es que la euforia se confunda con certeza y relaje la exigencia del siguiente reto.", phase: "despues" },
    ],
    seoTitle:
      "Estados Unidos 4-1 Paraguay: resultado, goles y el debut soñado del anfitrión en el Mundial 2026",
    teams: ["Estados Unidos", "Paraguay"],
    event: "Mundial 2026 — Grupo D",
    hook: "El debut goleador del anfitrión y la euforia que dispara",
    quickSummary:
      "Estados Unidos goleó 4-1 a Paraguay en su debut como anfitrión del Mundial 2026, en Los Ángeles. Un autogol de Bobadilla (7') abrió el camino, Folarin Balogun marcó dos veces en la primera mitad y Gio Reyna selló la goleada; Mauricio descontó. Experience Radar observa cómo un arranque dominante dispara la euforia colectiva y, con ella, una expectativa que el equipo deberá sostener.",
    whatHappened:
      "El anfitrión necesitaba un debut tranquilizador y lo consiguió de la forma más cómoda. A los siete minutos, un autogol de Damián Bobadilla puso el 1-0 y desactivó la ansiedad inicial del estadio. Folarin Balogun tomó el protagonismo con un doblete en la primera mitad —un gran remate al 31' y otro sobre el cierre del primer tiempo— y Gio Reyna redondeó la goleada con un disparo con el exterior del pie. Paraguay, superado en posesión (63-37) y en remates (17 a 8), apenas pudo descontar con Mauricio. La conversación digital pasó de la cautela previa al entusiasmo desbordado: el debut soñado del anfitrión. La lectura de experiencia no es el marcador en sí, sino el cambio de marco emocional: un arranque dominante reescribe las expectativas de toda una afición en noventa minutos.",
    keyPlays: [
      "Autogol de Damián Bobadilla al 7' para el 1-0 de Estados Unidos.",
      "Doblete de Folarin Balogun en la primera mitad (31' y cierre del primer tiempo).",
      "Gol de Gio Reyna para el 4-0 y descuento de Mauricio para Paraguay.",
    ],
    controversies: [
      "El autogol tempranero condicionó por completo el plan de Paraguay.",
      "El nivel real del anfitrión queda por confirmar ante un rival que se desordenó pronto.",
    ],
    statements: [
      "La afición estadounidense celebró el doblete de Balogun como la confirmación de su '9'.",
      "El entorno de Paraguay pidió calma: el 4-1 no debería definir todo el grupo.",
    ],
    fanPulse: {
      concerns: ["¿Es tan bueno este equipo o Paraguay se desarmó solo?", "¿Aguantará el nivel ante rivales más ordenados?", "¿Cómo gestionar la euforia hacia el próximo partido?"],
      emotions: ["Alivio con el gol tempranero", "Euforia con el doblete de Balogun", "Orgullo de anfitrión"],
      frustrations: ["La duda de fondo sobre el nivel real del rival.", "El miedo a que la euforia infle expectativas."],
      enthusiasm: ["La irrupción goleadora de Balogun.", "Un debut de local que ilusiona a todo el país."],
      sources: [
        { name: "Reddit — r/soccer (match thread)", url: "https://www.reddit.com/r/ussoccer/", kind: "conversacion" },
        { name: "Google Trends — picos de búsqueda en vivo", url: "https://trends.google.com/trends/", kind: "tendencia" },
      ],
    },
    mediaLabInsight: {
      humanBehavior:
        "Una primera impresión potente reordena toda la percepción posterior: tras un debut goleador, la afición proyecta esa imagen sobre todo lo que viene y eleva el listón con el que juzgará al equipo.",
      cognitiveBiases: [
        "Efecto halo: un gran resultado magnifica las virtudes y oculta las dudas.",
        "Anclaje: el 4-1 se vuelve la referencia con la que se medirá el próximo partido.",
        "Exceso de confianza: la euforia puede confundirse con certeza y relajar la exigencia.",
      ],
      emotionalReaction:
        "La euforia del debut no nace solo del marcador, sino del contraste con la ansiedad previa del anfitrión: cuanto mayor era la presión, mayor el desahogo.",
      digitalPatterns:
        "Explosión de búsquedas del goleador, clips del doblete y conversación que salta de la cautela a la euforia en cuestión de minutos.",
    },
    productApplications: [
      {
        sector: "SaaS / Onboarding",
        application:
          "Una primera experiencia excelente fija el estándar con el que el usuario juzgará todo lo demás: cuida el debut, pero no prometas un nivel que no puedas sostener después.",
      },
      {
        sector: "Ecommerce",
        application:
          "Un primer pedido impecable ancla expectativas altas; gestionar la consistencia evita que la segunda compra se perciba como un bajón.",
      },
      {
        sector: "Producto digital",
        application:
          "El efecto halo de un buen lanzamiento ayuda a la adopción, pero infla expectativas: comunica el roadmap para que la euforia no se convierta en decepción.",
      },
    ],
    emotionalRadar: { euforia: 90, confianza: 86, ansiedad: 32, frustracion: 26, incertidumbre: 28, optimismo: 90 },
    collectiveByTeam: [
      {
        team: "Estados Unidos",
        mood: "Euforia y orgullo de anfitrión",
        behaviorEffect:
          "Llegan al próximo partido con confianza disparada y alta participación pública; el riesgo es el exceso de optimismo y un listón difícil de igualar.",
      },
      {
        team: "Paraguay",
        mood: "Golpe anímico tras una derrota dura",
        behaviorEffect:
          "Llegan obligados a recomponer: la conversación se centra en separar el 4-1 del resto del grupo y en recuperar confianza.",
      },
    ],
    teamRadars: [
      {
        team: "Estados Unidos",
        // Durante/después: euforia del 4-1, confianza disparada, casi nula frustración.
        current: {
          score: 86,
          emotional: { euforia: 90, confianza: 86, ansiedad: 30, frustracion: 22, incertidumbre: 26, optimismo: 90 },
        },
        // Próximo partido: confianza alta con riesgo de exceso; algo más de ansiedad.
        predicted: {
          score: 76,
          emotional: { euforia: 76, confianza: 80, ansiedad: 42, frustracion: 28, incertidumbre: 42, optimismo: 82 },
        },
      },
      {
        team: "Paraguay",
        // Durante/después de la goleada: tristeza y frustración altas, casi sin euforia.
        current: {
          score: 38,
          emotional: { euforia: 16, confianza: 24, ansiedad: 72, frustracion: 84, incertidumbre: 66, optimismo: 26 },
        },
        // Próximo partido: intentan recomponer; sube algo la confianza, baja la euforia rota.
        predicted: {
          score: 48,
          emotional: { euforia: 34, confianza: 44, ansiedad: 60, frustracion: 58, incertidumbre: 56, optimismo: 46 },
        },
      },
    ],
    scoreFactors: { emotionalImpact: 86, digitalConversation: 84, virality: 86, userInterest: 90 },
    uxFinding:
      "Una primera impresión sobresaliente ancla las expectativas del usuario: define el estándar con el que juzgará todo lo siguiente. El reto no es impresionar una vez, sino sostener el nivel que esa primera vez prometió.",
    aiSummary:
      "Estados Unidos goleó 4-1 a Paraguay en su debut como anfitrión del Mundial 2026 (Los Ángeles): autogol de Bobadilla (7'), doblete de Folarin Balogun y gol de Gio Reyna; Mauricio descontó. Experience Radar de MediaLab lo analiza desde el comportamiento: por el efecto halo y el anclaje, un debut dominante reordena la percepción de toda la afición y eleva el listón para el próximo partido. Para productos digitales —SaaS, ecommerce, producto— la lección es que una primera impresión potente fija el estándar de juicio: el reto no es impresionar una vez, sino sostener el nivel prometido.",
    sources: [
      { name: "ESPN — USA 4-1 Paraguay (Final Score)", url: "https://www.espn.com/soccer/match/_/gameId/760417/paraguay-united-states", kind: "referencia" },
      { name: "CBS Sports — Balogun brace en el debut de EE. UU.", url: "https://www.cbssports.com/soccer/news/usa-paraguay-live-updates-world-cup-2026-score-result/live/", kind: "referencia" },
      { name: "Telemundo — Estados Unidos 4-1 Paraguay (en vivo)", url: "https://www.telemundo.com/noticias/noticias-telemundo/internacional/live-blog/mundial-2026-en-vivo-hoy-estados-unidos-vs-paraguay-resultados-goles-y-rcna349762", kind: "referencia" },
      { name: "FIFA — Mundial 2026 (centro del torneo)", url: "https://www.fifa.com/en/tournaments/mens/worldcup/canadamexicousa2026", kind: "oficial" },
    ],
  },
  // ───────────────────────── Artículo 1 ─────────────────────────
  {
    category: "Trust",
    date: "2026-06-11",
    kickoffAt: "2026-06-11T19:00:00.000Z",
    slug: "mexico-sudafrica-resultado-resumen-polemica-arbitral",
    matchState: "finalizado",
    matchScore: {
      home: "México",
      away: "Sudáfrica",
      homeGoals: 2,
      awayGoals: 0,
      detail: "Goles: Julián Quiñones 9' y Raúl Jiménez 67'. Tres expulsiones en el partido.",
    },
    matchSummary:
      "México venció 2-0 a Sudáfrica en el partido inaugural del Mundial 2026. Julián Quiñones abrió el marcador al minuto 9 y Raúl Jiménez amplió la ventaja al 67. El encuentro terminó con tres expulsiones y convirtió la conversación posterior en una mezcla de orgullo local, tensión y debate sobre el arbitraje.",
    matchPhases: {
      // Antes: confianza y optimismo altos, poca tensión.
      expectativa: { euforia: 70, confianza: 72, ansiedad: 40, frustracion: 30, incertidumbre: 45, optimismo: 75 },
      // Durante: victoria clara, alta tensión disciplinaria y discusión arbitral.
      realidad: { euforia: 84, confianza: 76, ansiedad: 68, frustracion: 58, incertidumbre: 44, optimismo: 82 },
      // Después: el recuerdo amplifica la frustración (sesgo de recencia).
      percepcion: { euforia: 88, confianza: 82, ansiedad: 48, frustracion: 42, incertidumbre: 32, optimismo: 86 },
    },
    // Interpretación específica por fase/categoría (datos reales + lo que dice la gente).
    matchInterpretations: {
      expectativa: {
        euforia: "Antes del pitazo, la euforia venía de la ilusión del debut en casa y del favoritismo sobre Sudáfrica.",
        confianza: "La afición llegó confiada: anfitrión, Azteca lleno y un rival al que se daba por inferior.",
        ansiedad: "La tensión previa era baja; la conversación giraba más sobre la fiesta que sobre el riesgo.",
        frustracion: "Apenas asomaba molestia: solo dudas sobre el once titular y el calor del mediodía.",
        incertidumbre: "Pocas preguntas abiertas: el relato dominante daba por hecho el triunfo local.",
        optimismo: "Optimismo alto, alimentado por jugar la inauguración del Mundial en casa.",
      },
      realidad: {
        euforia: "El 2-0 con goles de Quiñones y Jiménez encendió al Azteca: la conversación se llenó de orgullo por 'romper la maldición' del debut.",
        confianza: "La ventaja dio un relato claro —'México controló'—, aunque las tres expulsiones abrieron el debate de si fue dominio o partido roto.",
        ansiedad: "Cada expulsión y revisión del VAR disparó búsquedas de '¿por qué la roja?' por encima del propio marcador.",
        frustracion: "La molestia dominante no fue el resultado sino el criterio arbitral: muchos sintieron las tres expulsiones desproporcionadas.",
        incertidumbre: "Quedó la duda de si el nivel se sostiene once contra once; la goleada convivió con un juego desordenado por las tarjetas.",
        optimismo: "Ganar la inauguración en casa disparó la ilusión de avanzar; la afición ya proyecta el siguiente partido.",
      },
      percepcion: {
        euforia: "Con los días, el recuerdo se queda con la fiesta del 2-0 y los goleadores, más que con el desorden disciplinario.",
        confianza: "El resultado consolidó un relato positivo del anfitrión de cara al grupo.",
        ansiedad: "Baja la urgencia informativa: ya hay una explicación aceptada de lo que pasó.",
        frustracion: "La indignación por el arbitraje persiste como nota de fondo, lista para reactivarse a la próxima jugada dudosa.",
        incertidumbre: "La lectura se estabiliza: 'ganamos cómodos pese al lío de tarjetas'.",
        optimismo: "El recuerdo del debut alimenta una expectativa alta para el próximo encuentro.",
      },
    },
    teamApproach: [
      {
        team: "México",
        expectedEmotion: "Optimismo y hambre de protagonismo en el debut.",
        dominantConversation: "Ilusión por el estreno y por ver a sus figuras en escena.",
        fanConfidence: "Confianza alta, con la expectativa de arrancar ganando el grupo.",
        mainNarrative: "El debut como punto de partida para soñar con avanzar.",
        howTheyArrived: "Con confianza y altas expectativas tras un buen camino previo.",
        whatHappened: "El gol temprano redujo la ansiedad y el 2-0 convirtió la presión del debut en celebración, aunque las expulsiones mantuvieron alta la tensión.",
        expectationVsReality: "Esperaban un debut exigente y obtuvieron una victoria clara; la conversación pasó del miedo al tropiezo al orgullo por el arranque.",
      },
      {
        team: "Sudáfrica",
        expectedEmotion: "Cautela disciplinada y respeto por el rival.",
        dominantConversation: "Confianza en el plan de juego más que en nombres propios.",
        fanConfidence: "Confianza contenida, sin grandes alardes públicos.",
        mainNarrative: "Competir de igual a igual apoyados en el orden colectivo.",
        howTheyArrived: "Mesurados, sin sobrevender sus opciones.",
        whatHappened: "El gol temprano alteró su plan y las dos expulsiones redujeron cualquier posibilidad de reacción.",
        expectationVsReality: "La expectativa de competir con orden terminó desplazada por frustración y discusión sobre las decisiones disciplinarias.",
      },
    ],
    lessons: [
      { term: "Efecto de primacía", explanation: "El gol de Quiñones al minuto 9 fijó temprano el relato emocional: México pasó de la presión del debut a controlar la expectativa." },
      { term: "Sesgo de resultado", explanation: "La victoria hace que la experiencia mexicana se recuerde como positiva, aunque el partido tuviera alta tensión y tres expulsiones." },
      { term: "Contagio emocional", explanation: "La celebración del estadio reforzó el orgullo colectivo; la misma dinámica amplificó el enojo alrededor de las tarjetas rojas." },
    ],
    seoTitle:
      "México 2-0 Sudáfrica: resultado, goles y tres expulsiones en el partido inaugural",
    imageAlt: "México vs Sudáfrica — partido inaugural del Mundial 2026",
    teams: ["México", "Sudáfrica"],
    event: "Mundial 2026 — Fase de grupos",
    hook: "Victoria de México y récord disciplinario en el partido inaugural",
    quickSummary:
      "México abrió el Mundial 2026 con una victoria 2-0 sobre Sudáfrica. Quiñones marcó al 9 y Jiménez al 67; el partido tuvo tres expulsiones, más tarjetas rojas que goles. Experience Radar observa cómo un gol temprano cambió el estado emocional del estadio y cómo la dureza del juego desplazó parte de la conversación desde el resultado hacia el arbitraje.",
    whatHappened:
      "México tomó ventaja a los nueve minutos con Julián Quiñones y amplió al 67 por medio de Raúl Jiménez. Sudáfrica terminó con dos jugadores expulsados y México con uno. La conversación visible en el hilo posterior de r/soccer mezcló alivio mexicano, críticas a la calidad del juego y bromas sobre que hubo más expulsiones que goles. La lectura de experiencia no es que el público rechazara el resultado, sino que un evento cargado de orgullo nacional también produjo una segunda capa de atención: entender y discutir las decisiones disciplinarias.",
    keyPlays: [
      "Gol de Julián Quiñones al minuto 9, que redujo la presión inicial sobre México.",
      "Gol de Raúl Jiménez al minuto 67 para establecer el 2-0.",
      "Tres expulsiones: dos para Sudáfrica y una para México.",
    ],
    controversies: [
      "El volumen de expulsiones desplazó parte de la conversación desde el juego hacia el criterio arbitral.",
      "La segunda roja de Sudáfrica, revisada por VAR, fue discutida por su cuerpo técnico.",
    ],
    statements: [
      "FIFA confirmó el 2-0 y los goles de Quiñones y Jiménez en su reporte oficial.",
      "La conversación posterior destacó que fue el primer partido inaugural de un Mundial con tres expulsiones.",
    ],
    fanPulse: {
      concerns: [
        "¿Cómo condicionarán las expulsiones los siguientes partidos?",
        "¿Qué cambió emocionalmente después del gol temprano?",
        "¿Dónde consultar las jugadas y decisiones oficiales?",
      ],
      emotions: ["Ansiedad durante la espera", "Euforia y enojo casi simultáneos", "Necesidad de validación inmediata"],
      frustrations: ["Interrupciones y tensión por las expulsiones.", "Conversación dividida sobre el criterio arbitral."],
      enthusiasm: [
        "Orgullo y pertenencia alrededor de la selección.",
        "Celebración por la primera victoria mexicana en un partido inaugural del Mundial.",
      ],
      sources: [
        { name: "Reddit — hilo posterior México 2-0 Sudáfrica", url: "https://www.reddit.com/r/soccer/comments/1u3bgvm/post_match_thread_mexico_2_0_south_africa_fifa/", kind: "conversacion" },
      ],
    },
    mediaLabInsight: {
      humanBehavior:
        "Un evento colectivo se recuerda por sus momentos iniciales y finales: el gol temprano orientó la confianza mexicana y las expulsiones dominaron la conversación posterior.",
      cognitiveBiases: [
        "Efecto de primacía: el primer gol fijó el tono emocional del partido.",
        "Sesgo de resultado: ganar suaviza el recuerdo de una experiencia tensa.",
        "Contagio emocional: estadio y conversación digital amplifican orgullo y enojo.",
      ],
      emotionalReaction:
        "La victoria produjo euforia y confianza en la hinchada mexicana, mientras las expulsiones mantuvieron una capa de ansiedad y discusión que sobrevivió al pitazo final.",
      digitalPatterns:
        "Consumo paralelo de transmisión, clips de las tarjetas y conversación social para interpretar el tono físico del partido.",
    },
    productApplications: [
      {
        sector: "Banco",
        application:
          "En una transacción retenida por revisión antifraude, mostrar estado, motivo y tiempo estimado reduce la ansiedad igual que una explicación clara del VAR.",
      },
      {
        sector: "Ecommerce",
        application:
          "Durante un pago en verificación, comunicar 'estamos confirmando tu compra' con progreso visible evita el abandono por incertidumbre.",
      },
      {
        sector: "Plataforma educativa",
        application:
          "Al calificar o validar una entrega automáticamente, mostrar el criterio y la evidencia reduce la sensación de decisión arbitraria.",
      },
      {
        sector: "SaaS B2B",
        application:
          "En procesos asíncronos (aprobaciones, despliegues), un estado transparente con log de pasos sostiene la confianza del usuario.",
      },
    ],
    emotionalRadar: {
      euforia: 84,
      confianza: 76,
      ansiedad: 68,
      frustracion: 58,
      incertidumbre: 44,
      optimismo: 82,
    },
    collectiveByTeam: [
      {
        team: "México",
        mood: "Euforia y alivio tras el debut",
        behaviorEffect:
          "Llega al próximo partido con confianza reforzada por el resultado, pero con atención especial a la disciplina tras terminar también con un jugador expulsado.",
      },
      {
        team: "Sudáfrica",
        mood: "Frustración y necesidad de recomponer",
        behaviorEffect:
          "Llega al próximo partido con presión por recuperar orden y confianza; las dos expulsiones pueden mantener la conversación centrada en disciplina y control emocional.",
      },
    ],
    teamRadars: [
      {
        team: "México",
        current: {
          score: 86,
          emotional: { euforia: 88, confianza: 82, ansiedad: 48, frustracion: 34, incertidumbre: 30, optimismo: 86 },
        },
        // Próximo partido: la indignación se convierte en revancha; baja la frustración,
        // sube el optimismo, pero la ansiedad sigue alta y poco tolerante a lo dudoso.
        predicted: {
          score: 74,
          emotional: { euforia: 76, confianza: 78, ansiedad: 56, frustracion: 38, incertidumbre: 42, optimismo: 80 },
        },
      },
      {
        team: "Sudáfrica",
        current: {
          score: 62,
          emotional: { euforia: 30, confianza: 36, ansiedad: 74, frustracion: 82, incertidumbre: 64, optimismo: 38 },
        },
        // Próximo partido: confianza serena, menos ruido emocional.
        predicted: {
          score: 56,
          emotional: { euforia: 42, confianza: 48, ansiedad: 68, frustracion: 62, incertidumbre: 58, optimismo: 50 },
        },
      },
    ],
    nextMatchWatch: {
      dominantEmotion:
        "Confianza reforzada en México y necesidad de recuperación en Sudáfrica después de un debut definido temprano y condicionado por tres expulsiones.",
      playerOrTeamToWatch:
        "México deberá convertir la euforia del 2-0 en consistencia; Sudáfrica necesitará recuperar disciplina y estabilidad emocional.",
      biasToWatch:
        "Sesgo de resultado: México puede sobrevalorar el 2-0 y Sudáfrica reducir toda la derrota a las expulsiones.",
      dataToCheck:
        "Cambios de disciplina, volumen de tarjetas, confianza de las hinchadas y reacción ante el primer momento adverso del siguiente partido.",
      questionToFollow:
        "¿México sostiene la confianza sin caer en exceso de seguridad y Sudáfrica logra separar el siguiente partido del recuerdo de las expulsiones?",
      collectiveBehaviorNote:
        "La victoria y la derrota crean marcos opuestos: una hinchada espera continuidad y la otra busca reparación. Ambas pueden sobrevalorar el partido más reciente al interpretar lo que venga.",
    },
    scoreFactors: {
      emotionalImpact: 92,
      digitalConversation: 88,
      virality: 84,
      userInterest: 90,
    },
    uxFinding:
      "En experiencias de alta emoción, el resultado principal no elimina la necesidad de contexto. Mostrar decisiones, consecuencias y próximos pasos evita que un momento secundario domine el recuerdo completo.",
    aiSummary:
      "México venció 2-0 a Sudáfrica en la apertura del Mundial 2026, con goles de Julián Quiñones y Raúl Jiménez. El partido registró tres expulsiones. Experience Radar analiza cómo el gol temprano redujo la presión del anfitrión y cómo las decisiones disciplinarias compitieron con la victoria por definir el recuerdo colectivo. La lección de producto es acompañar los momentos de alta emoción con contexto visible y consecuencias claras.",
    sources: [
      { name: "FIFA — reporte oficial México 2-0 Sudáfrica", url: "https://www.fifa.com/en/tournaments/mens/worldcup/canadamexicousa2026/articles/mexico-south-africa-highlights-match-report", kind: "oficial" },
      { name: "Latingoles — resumen del partido inaugural", url: "https://latingoles.com/historico-en-el-azteca-colombiano-quinones-y-mexicano-jimenez-rompen-la-maldicion-de-mexico/", kind: "referencia" },
      { name: "Reddit r/soccer — hilo posterior del partido", url: "https://www.reddit.com/r/soccer/comments/1u3bgvm/post_match_thread_mexico_2_0_south_africa_fifa/", kind: "conversacion" },
    ],
  },

  // ───────────────────────── Artículo 2 · FINALIZADO ─────────────────────────
  // Partido REAL del fixture: Corea del Sur vs Chequia, 11 jun 2026, Guadalajara.
  {
    category: "Fan Experience",
    date: "2026-06-11",
    kickoffAt: "2026-06-12T02:00:00.000Z",
    slug: "corea-del-sur-chequia-resultado-remontada-mundial-2026",
    matchState: "finalizado",
    imageUrl: "https://latingoles.com/wp-content/uploads/2026/06/rss-efe6c0e5c0700b2b8a21b6094f046456b33aa8b26e8w.jpg",
    imageCredit: "Latingoles",
    imageSourceUrl: "https://latingoles.com/corea-del-sur-aspira-al-liderato-del-grupo-a-a-pesar-de-que-mexico-es-favorito/",
    matchScore: {
      home: "Corea del Sur",
      away: "Chequia",
      homeGoals: 2,
      awayGoals: 1,
      detail: "Chequia: Krejčí 59'. Corea del Sur: Hwang In-beom y Oh Hyeon-gyu 80' (remontada).",
    },
    imageAlt: "Corea del Sur vs Chequia — remontada 2-1 en Guadalajara, Mundial 2026",
    matchSummary:
      "Corea del Sur remontó y venció 2-1 a Chequia en Guadalajara: Krejčí adelantó a los checos de cabeza (59') y, cuando la afición coreana ya temía la derrota, Hwang In-beom igualó y Oh Hyeon-gyu firmó el triunfo sobre el cierre (80'). Más que el resultado, lo que define el partido es la curva emocional: de la ansiedad del marcador en contra a la euforia de ganarlo sobre la hora.",
    matchPhases: {
      // Antes: ilusión alta por el debut de su generación.
      expectativa: { euforia: 72, confianza: 68, ansiedad: 40, frustracion: 26, incertidumbre: 44, optimismo: 74 },
      // Durante: montaña rusa — tensión y frustración con el 0-1, euforia con la remontada.
      realidad: { euforia: 70, confianza: 58, ansiedad: 78, frustracion: 60, incertidumbre: 66, optimismo: 72 },
      // Después: el final feliz reescribe el recuerdo (regla pico-fin): triunfo épico.
      percepcion: { euforia: 90, confianza: 82, ansiedad: 34, frustracion: 28, incertidumbre: 30, optimismo: 90 },
    },
    // Interpretación específica por fase/categoría (datos reales + lo que dice la gente).
    matchInterpretations: {
      expectativa: {
        euforia: "La hinchada coreana llegó eufórica por ver a su nueva generación debutar y pelear el liderato del Grupo A.",
        confianza: "Confianza alta: se daba por hecho un buen arranque ante Chequia.",
        ansiedad: "Ansiedad baja antes del pitazo; la conversación era ilusión, no temor.",
        frustracion: "Casi nula: nadie anticipaba ir por detrás en el marcador.",
        incertidumbre: "Pocas dudas sobre el equipo; el rival se veía asumible.",
        optimismo: "Optimismo marcado por la sensación de una generación lista para dar el golpe.",
      },
      realidad: {
        euforia: "La euforia llegó tarde pero explosiva: el gol de Oh Hyeon-gyu sobre el cierre desató la celebración tras minutos de tensión.",
        confianza: "La confianza tembló con el 0-1 de Krejčí y se recuperó de golpe con la remontada; el relato pasó de 'nos cuesta' a 'tenemos carácter'.",
        ansiedad: "El pico de ansiedad fue real y deportivo: ir por detrás (59') con el reloj corriendo disparó las búsquedas de '¿cómo va?' y la tensión en redes.",
        frustracion: "La frustración del 0-1 fue intensa pero breve: la igualó Hwang In-beom y la borró el gol del triunfo.",
        incertidumbre: "Durante el tramo en desventaja, la incertidumbre fue máxima: nadie sabía si llegaría la reacción.",
        optimismo: "El optimismo se reconstruyó en minutos: de temer la derrota a creer en la remontada apenas llegó el empate.",
      },
      percepcion: {
        euforia: "El recuerdo se queda con la remontada, no con el susto: el final feliz domina toda la memoria del partido (regla pico-fin).",
        confianza: "Queda una confianza reforzada: 'este equipo no se rinde'. El carácter mostrado pesa más que el bache del 0-1.",
        ansiedad: "Baja casi por completo: el triunfo sobre la hora disuelve la tensión vivida.",
        frustracion: "El sesgo de recencia hace que el gol del cierre borre la frustración del gol en contra.",
        incertidumbre: "Se estabiliza la lectura: el equipo demostró que puede dar vuelta un partido cuesta arriba.",
        optimismo: "El optimismo se dispara de cara al próximo partido: una remontada genera más fe que una victoria cómoda.",
      },
    },
    teamApproach: [
      {
        team: "Corea del Sur",
        expectedEmotion: "Euforia e ilusión de su afición por el debut de su nueva generación.",
        dominantConversation: "Pelear el liderato del Grupo A; confianza en imponerse a Chequia.",
        fanConfidence: "Confianza alta, con la expectativa de arrancar ganando.",
        mainNarrative: "Una generación lista para dar el golpe en el Mundial.",
        howTheyArrived: "Sufriendo: se vieron 0-1 (Krejčí 59') antes de reaccionar.",
        whatHappened: "Remontaron con Hwang In-beom y el gol de Oh Hyeon-gyu sobre el cierre (80') para ganar 2-1.",
        expectationVsReality: "Esperaban un triunfo cómodo; se llevaron una victoria épica que vale doble por el carácter mostrado.",
      },
      {
        team: "Chequia",
        expectedEmotion: "Expectativa moderada y respeto por un rival con más presión social.",
        dominantConversation: "Competir con orden y aprovechar sus pelotas paradas.",
        fanConfidence: "Confianza serena, sin grandes alardes.",
        mainNarrative: "Dar la sorpresa apoyados en el orden y el juego aéreo.",
        howTheyArrived: "Golpearon primero con el cabezazo de Krejčí y acariciaron la sorpresa.",
        whatHappened: "Se les escapó sobre el cierre: encajaron dos goles y la remontada los dejó sin nada.",
        expectationVsReality: "Estuvieron a 30 minutos de un triunfo histórico; la decepción es proporcional a lo cerca que estuvieron.",
      },
    ],
    lessons: [
      { term: "Regla pico-fin", explanation: "Recordamos una experiencia por su momento más intenso y por su final. La remontada hizo que el partido se recuerde como épico, no como un susto.", phase: "despues" },
      { term: "Sesgo de recencia", explanation: "Lo último que pasó pesa más que todo lo anterior: el gol del triunfo borró la frustración del 0-1.", phase: "despues" },
      { term: "Paradoja de la recuperación", explanation: "Superar un bajón puede dejar mejor recuerdo que una experiencia plana sin problemas: el carácter en la adversidad genera más lealtad.", phase: "despues" },
    ],
    seoTitle:
      "Corea del Sur 2-1 Chequia: resultado, resumen y la remontada que cambió el Grupo A del Mundial 2026",
    teams: ["Corea del Sur", "Chequia"],
    event: "Mundial 2026 — Fase de grupos",
    hook: "Remontada de Corea del Sur sobre el cierre",
    quickSummary:
      "Corea del Sur remontó 2-1 a Chequia en el debut del Mundial 2026: los checos pegaron primero con Krejčí (59'), pero Hwang In-beom igualó y Oh Hyeon-gyu marcó el gol del triunfo sobre el cierre (80'). El partido es un caso de manual sobre cómo la emoción de un final feliz reescribe el recuerdo de toda la experiencia, por encima de la angustia vivida con el marcador en contra.",
    whatHappened:
      "Corea del Sur llegaba como favorito ante una Chequia ordenada, pero el guion se torció: en el 59', Ladislav Krejčí se elevó para poner el 0-1 de cabeza y silenciar a la hinchada coreana. Durante poco más de quince minutos, la afición vivió la versión más tensa del partido: marcador en contra, reloj corriendo y la sensación de un debut amargo. La reacción llegó con Hwang In-beom, que empató y devolvió la fe, y se completó con Oh Hyeon-gyu, que firmó el 2-1 definitivo cerca del 80'. La conversación digital reflejó la curva entera: del bajón con el gol checo a la explosión de alivio y euforia con la remontada. Más allá del resultado, el partido dejó la sensación —repetida en redes— de que ganar sufriendo sabe mejor: el carácter para dar vuelta un marcador adverso quedó como el gran titular del día para Corea.",
    keyPlays: [
      "Cabezazo de Ladislav Krejčí para el 0-1 de Chequia (59').",
      "Empate de Hwang In-beom que devolvió la fe a Corea.",
      "Gol de Oh Hyeon-gyu sobre el cierre (80') para el 2-1 definitivo.",
    ],
    controversies: [
      "El tramo con el 0-1 disparó dudas sobre la solidez defensiva de Corea ante el balón parado.",
      "Chequia lamentó no haber cerrado el partido teniendo la ventaja.",
    ],
    statements: [
      "La afición coreana destacó el carácter para remontar más que el nivel de juego.",
      "El cuerpo técnico checo reconoció el golpe de perder un partido que tenía controlado.",
    ],
    fanPulse: {
      concerns: ["¿Por qué sufrimos tanto con el balón parado?", "¿Aguantará el equipo partidos cerrados?", "¿Cómo llega Corea al próximo cruce?"],
      emotions: ["Angustia con el 0-1", "Alivio con el empate", "Euforia con el gol del triunfo"],
      frustrations: ["El bache defensivo en el córner del gol checo.", "Los minutos de ansiedad con el marcador en contra."],
      enthusiasm: ["Orgullo por el carácter para remontar.", "Ilusión renovada de cara al liderato del grupo."],
      sources: [
        { name: "Reddit — r/soccer (match thread)", url: "https://www.reddit.com/r/soccer/", kind: "conversacion" },
        { name: "Google Trends — picos de búsqueda en vivo", url: "https://trends.google.com/trends/", kind: "tendencia" },
      ],
    },
    mediaLabInsight: {
      humanBehavior:
        "Las personas no recuerdan una experiencia por su promedio, sino por su pico emocional y su final. Una remontada concentra ambos: el momento más intenso y un cierre feliz, y por eso deja una huella desproporcionadamente positiva.",
      cognitiveBiases: [
        "Regla pico-fin: el recuerdo se ancla en el momento más intenso y en el final, no en el conjunto.",
        "Sesgo de recencia: el gol del triunfo borra la frustración del gol en contra.",
        "Paradoja de la recuperación: superar un problema puede generar más lealtad que no haberlo tenido.",
      ],
      emotionalReaction:
        "La angustia del marcador en contra amplifica la euforia de la remontada: el contraste emocional es lo que vuelve memorable la experiencia.",
      digitalPatterns:
        "Caída y repunte de sentimiento en redes en cuestión de minutos, picos de búsqueda en el gol en contra y explosión de celebración con el gol del triunfo.",
    },
    productApplications: [
      {
        sector: "Banco",
        application:
          "Un trámite que tropieza pero se recupera con rapidez y claridad puede terminar con MÁS confianza que un flujo impecable pero olvidable: cuida el final del proceso, no solo el promedio.",
      },
      {
        sector: "Ecommerce",
        application:
          "Convertir un problema (faltante, demora) en una recuperación memorable —comunicación proactiva y un gesto— activa la paradoja de la recuperación y fideliza más que no haber fallado.",
      },
      {
        sector: "SaaS / Onboarding",
        application:
          "Diseña deliberadamente los finales (confirmaciones, estados de éxito): es el momento que el usuario recuerda y el que define si vuelve.",
      },
    ],
    emotionalRadar: { euforia: 90, confianza: 82, ansiedad: 40, frustracion: 32, incertidumbre: 34, optimismo: 90 },
    collectiveByTeam: [
      {
        team: "Corea del Sur",
        mood: "Euforia y orgullo por remontar",
        behaviorEffect:
          "Llegan al próximo partido envalentonados: más confianza pública, mayor participación en encuestas y votaciones, y una narrativa de 'equipo con carácter' que eleva la expectativa.",
      },
      {
        team: "Chequia",
        mood: "Decepción por dejar escapar la ventaja",
        behaviorEffect:
          "Llegan tocados anímicamente: la conversación se centra en cómo cerrar partidos y en no repetir el desenlace, con más autocrítica que ilusión.",
      },
    ],
    teamRadars: [
      {
        team: "Corea del Sur",
        // Remontada épica: euforia y optimismo disparados tras el sufrimiento.
        current: {
          score: 88,
          emotional: { euforia: 90, confianza: 82, ansiedad: 36, frustracion: 26, incertidumbre: 30, optimismo: 90 },
        },
        predicted: {
          score: 80,
          emotional: { euforia: 80, confianza: 80, ansiedad: 44, frustracion: 30, incertidumbre: 40, optimismo: 84 },
        },
      },
      {
        team: "Chequia",
        // Iban ganando y lo perdieron sobre el cierre: frustración y tristeza altas.
        current: {
          score: 40,
          emotional: { euforia: 22, confianza: 30, ansiedad: 68, frustracion: 80, incertidumbre: 62, optimismo: 30 },
        },
        predicted: {
          score: 48,
          emotional: { euforia: 38, confianza: 46, ansiedad: 58, frustracion: 56, incertidumbre: 54, optimismo: 46 },
        },
      },
    ],
    scoreFactors: { emotionalImpact: 90, digitalConversation: 86, virality: 88, userInterest: 88 },
    uxFinding:
      "El recuerdo de una experiencia lo define su pico emocional y su final, no su promedio. Recuperarse bien de un bajón puede dejar mejor recuerdo —y más lealtad— que una experiencia plana sin fricción.",
    aiSummary:
      "Corea del Sur remontó 2-1 a Chequia en el Mundial 2026: Krejčí adelantó a los checos (59') y Hwang In-beom y Oh Hyeon-gyu dieron vuelta el partido sobre el cierre (80'). Experience Radar de MediaLab lo analiza desde el comportamiento: por la regla pico-fin y el sesgo de recencia, una remontada reescribe el recuerdo de toda la experiencia —la euforia del final feliz pesa más que la angustia del marcador en contra—. Para productos digitales —banca, ecommerce, SaaS— la lección es la paradoja de la recuperación: cuidar el final y recuperarse bien de un fallo puede generar más confianza y lealtad que una experiencia impecable pero olvidable.",
    sources: [
      { name: "FIFA — reporte oficial Corea del Sur 2-1 Chequia", url: "https://www.fifa.com/en/tournaments/mens/worldcup/canadamexicousa2026", kind: "oficial" },
      { name: "Al Jazeera — Corea remonta a Chequia 2-1", url: "https://www.aljazeera.com/sports/2026/6/12/south-korea-vs-czechia-world-cup-2026-oh-hyeon-gyu-hwang-in-beom", kind: "referencia" },
      { name: "Reddit r/soccer — hilo posterior del partido", url: "https://www.reddit.com/r/soccer/", kind: "conversacion" },
    ],
  },

  // ─────────────────── Brasil 1-1 Marruecos · FINALIZADO (datos reales) ───────────────────
  // 13 jun 2026, MetLife (Nueva Jersey). Saibari 21' (MAR), Vinícius 32' (BRA). 80.663 asistentes.
  {
    category: "Fan Experience",
    date: "2026-06-13",
    kickoffAt: "2026-06-13T22:00:00.000Z",
    slug: "brasil-marruecos-mundial-2026",
    matchState: "finalizado",
    matchScore: {
      home: "Brasil",
      away: "Marruecos",
      homeGoals: 1,
      awayGoals: 1,
      detail: "Marruecos: Ismael Saibari 21'. Brasil: Vinícius Júnior 32'. 80.663 espectadores en el MetLife.",
    },
    matchSummary:
      "Brasil y Marruecos empataron 1-1 en el MetLife ante 80.663 espectadores. Saibari adelantó a Marruecos (21') y Vinícius Júnior igualó de derecha (32'). El pentacampeón no pudo con el semifinalista de 2022: para Brasil, un empate que sabe a poco; para Marruecos, el orgullo de volver a plantarle cara a un gigante.",
    matchPhases: {
      // Antes: euforia con presión de favorito. Durante: tensión por ir por detrás y no poder
      // con Marruecos. Después: en Brasil queda frustración; en la lectura general, respeto al rival.
      expectativa: { euforia: 80, confianza: 76, ansiedad: 56, frustracion: 26, incertidumbre: 54, optimismo: 78 },
      realidad: { euforia: 64, confianza: 58, ansiedad: 72, frustracion: 58, incertidumbre: 60, optimismo: 64 },
      percepcion: { euforia: 66, confianza: 62, ansiedad: 46, frustracion: 52, incertidumbre: 44, optimismo: 66 },
    },
    teamApproach: [
      {
        team: "Brasil",
        expectedEmotion: "Euforia con presión: se da por hecho el favoritismo.",
        dominantConversation: "El mandato de volver a ganar y exhibir el jogo bonito.",
        fanConfidence: "Confianza muy alta, casi de obligación de ganar.",
        mainNarrative: "El gigante que debe reafirmar su jerarquía desde el debut.",
        howTheyArrived: "Por detrás tras el gol de Saibari (21'), obligados a remar contra un rival incómodo.",
        whatHappened: "Vinícius igualó (32') pero el pentacampeón no pudo pasar del 1-1.",
        expectationVsReality: "Se daba por hecha la victoria; el empate ante Marruecos se vivió como decepción.",
      },
      {
        team: "Marruecos",
        expectedEmotion: "Ilusión y confianza tras el envión de 2022.",
        dominantConversation: "El orgullo de competir de igual a igual con una potencia.",
        fanConfidence: "Confianza alta y unida, sin miedo escénico.",
        mainNarrative: "El equipo que ya demostró que puede dar el golpe.",
        howTheyArrived: "Golpeando primero con Saibari y dominando tramos ante el pentacampeón.",
        whatHappened: "Aguantaron el 1-1 y le sacaron un punto a Brasil, reforzando su prestigio.",
        expectationVsReality: "Empatar al cinco veces campeón se sintió casi como una victoria moral.",
      },
    ],
    lessons: [
      { term: "Punto de referencia", explanation: "El mismo 1-1 es decepción para Brasil (esperaba ganar) y casi victoria para Marruecos (esperaba competir): el valor de un resultado depende de la expectativa, no es absoluto." },
      { term: "Efecto David vs Goliat", explanation: "Frenar a un gigante eleva el prestigio del 'pequeño' más de lo que el empate baja al grande: la conversación premia al que rinde por encima de lo esperado." },
      { term: "Sesgo de expectativa", explanation: "La presión de favorito convierte un empate digno en frustración; la expectativa fija el listón con el que se juzga la experiencia." },
    ],
    collectiveByTeam: [
      {
        team: "Brasil",
        mood: "Frustración por un empate que sabe a poco",
        behaviorEffect:
          "Llegan con autoexigencia: la conversación pide más contundencia y pone bajo lupa a sus figuras.",
      },
      {
        team: "Marruecos",
        mood: "Orgullo por plantarle cara al pentacampeón",
        behaviorEffect:
          "Llegan reforzados: el 'efecto 2022' se renueva y eleva la confianza pública y la participación.",
      },
    ],
    teamRadars: [
      {
        team: "Brasil",
        current: {
          score: 52,
          emotional: { euforia: 50, confianza: 52, ansiedad: 66, frustracion: 70, incertidumbre: 58, optimismo: 52 },
        },
        predicted: {
          score: 62,
          emotional: { euforia: 58, confianza: 64, ansiedad: 54, frustracion: 52, incertidumbre: 50, optimismo: 64 },
        },
      },
      {
        team: "Marruecos",
        current: {
          score: 80,
          emotional: { euforia: 82, confianza: 78, ansiedad: 38, frustracion: 26, incertidumbre: 36, optimismo: 84 },
        },
        predicted: {
          score: 76,
          emotional: { euforia: 74, confianza: 76, ansiedad: 42, frustracion: 30, incertidumbre: 42, optimismo: 80 },
        },
      },
    ],
    seoTitle:
      "Brasil 1-1 Marruecos: resultado, goles y el empate que sabe distinto para cada hinchada (Mundial 2026)",
    teams: ["Brasil", "Marruecos"],
    event: "Mundial 2026 — Grupo C",
    hook: "El debut más esperado de la primera fecha",
    quickSummary:
      "Brasil empató 1-1 con Marruecos en el MetLife (Grupo C, 80.663 espectadores). Saibari adelantó a los africanos (21') y Vinícius Júnior igualó (32'). El pentacampeón no pudo con el semifinalista de 2022 y el mismo empate se vivió al revés en cada hinchada: frustración brasileña por no ganar y orgullo marroquí por frenar a un gigante. El antecedente pesaba: Marruecos ya había vencido a Brasil por primera vez en un amistoso en Tánger (2-1, marzo 2023).",
    whatHappened:
      "Marruecos volvió a plantarle cara al pentacampeón. Ismael Saibari adelantó a los africanos al 21' y dominó tramos del partido ante 80.663 espectadores en el MetLife; Vinícius Júnior, tras combinar con Bruno Guimarães, igualó con un derechazo (32', su décimo gol internacional). El 1-1 final dejó dos lecturas opuestas: para Brasil, una decepción —se daba por hecha la victoria y la conversación pidió más contundencia y puso bajo lupa a sus figuras—; para Marruecos, casi una victoria moral que renueva el 'efecto 2022' y su prestigio. La memoria reciente alimentaba el morbo: en Francia 1998 Brasil ganó 3-0, pero en marzo de 2023 Marruecos lo venció por primera vez en Tánger (2-1).",
    keyPlays: [
      "Gol de Ismael Saibari para el 0-1 de Marruecos (21').",
      "Empate de Vinícius Júnior con un derechazo (32'), su décimo gol internacional.",
      "Marruecos aguanta el 1-1 y le saca un punto al pentacampeón.",
    ],
    controversies: [
      "Brasil terminó señalado por no superar a Marruecos pese a su favoritismo.",
      "El empate reabrió el debate sobre el nivel real del pentacampeón y el estado de sus figuras.",
    ],
    statements: [
      "La afición brasileña vivió el empate como decepción; el entorno marroquí, como una validación de su crecimiento.",
    ],
    fanPulse: {
      concerns: [
        "¿Por qué no pudimos con Marruecos?",
        "¿Cuál es el nivel real de Brasil?",
        "¿Sigue vigente el 'efecto 2022' de Marruecos?",
      ],
      emotions: ["Frustración brasileña", "Orgullo marroquí", "Tensión por ir por detrás"],
      frustrations: [
        "Brasil: la falta de contundencia ante un rival incómodo.",
        "La sensación de que el favoritismo no se tradujo en victoria.",
      ],
      enthusiasm: [
        "Marruecos renueva su prestigio ante un gigante.",
        "El gol de Vinícius mantiene viva la conversación brasileña.",
      ],
      sources: [
        { name: "Reddit r/soccer — hilo posterior del partido", url: "https://www.reddit.com/r/soccer/", kind: "conversacion" },
        { name: "Google Trends — picos de búsqueda en vivo", url: "https://trends.google.com/trends/", kind: "tendencia" },
      ],
    },
    mediaLabInsight: {
      humanBehavior:
        "No juzgamos un resultado en absoluto, sino respecto a una expectativa: el mismo 1-1 es decepción para quien debía ganar y casi victoria para quien debía competir.",
      cognitiveBiases: [
        "Punto de referencia: el valor del empate es relativo a lo que cada hinchada esperaba.",
        "Efecto David vs Goliat: frenar a un gigante eleva más al pequeño de lo que baja al grande.",
        "Sesgo de expectativa: la presión de favorito convierte un empate digno en frustración.",
      ],
      emotionalReaction:
        "La carga emocional no la dio el marcador, sino la distancia entre lo esperado y lo logrado: frustración de un lado, orgullo del otro.",
      digitalPatterns:
        "Dos conversaciones paralelas con el mismo dato: autocrítica y exigencia en Brasil; celebración y validación en Marruecos.",
    },
    productApplications: [
      {
        sector: "Producto digital",
        application:
          "El mismo resultado se siente como éxito o fracaso según la expectativa fijada: encuadrar y anclar bien las expectativas cambia la satisfacción percibida sin cambiar el producto.",
      },
      {
        sector: "SaaS B2B",
        application:
          "Si te posicionas como líder de categoría, subes el listón: un buen resultado puede leerse como decepción si no deslumbra.",
      },
      {
        sector: "Startups",
        application:
          "Para el 'pequeño', competir de igual a igual con un grande genera más prestigio que un resultado modesto frente a un par: aprovecha el efecto David vs Goliat en tu narrativa.",
      },
    ],
    emotionalRadar: { euforia: 66, confianza: 62, ansiedad: 46, frustracion: 52, incertidumbre: 44, optimismo: 66 },
    uxFinding:
      "La satisfacción no depende del resultado absoluto sino de la expectativa con la que se compara. Fijar el punto de referencia adecuado convierte un mismo resultado en triunfo o en decepción.",
    aiSummary:
      "Brasil empató 1-1 con Marruecos en el Mundial 2026 (MetLife, 80.663 espectadores): Saibari adelantó a los africanos y Vinícius Júnior igualó. Experience Radar de MediaLab lo analiza desde el comportamiento: por el punto de referencia y el efecto David vs Goliat, el mismo empate se vivió como decepción (Brasil, que debía ganar) y como casi victoria (Marruecos, que debía competir). Para productos digitales —producto, SaaS, startups— la lección es que la expectativa fijada define el valor percibido más que el resultado en sí.",
    scoreFactors: {
      emotionalImpact: 90,
      digitalConversation: 92,
      virality: 90,
      userInterest: 95,
    },
    sources: [
      { name: "ESPN — Brazil 1-1 Morocco (Game Analysis)", url: "https://www.espn.com/soccer/report/_/gameId/760419", kind: "referencia" },
      { name: "FIFA — centro de partido Brasil vs Marruecos", url: "https://www.fifa.com/en/match-centre/match/17/285023/289273/400021456", kind: "oficial" },
      { name: "WinSports — cobertura del Mundial 2026", url: "https://www.winsports.co/futbol-internacional/noticias/copa-mundial-de-la-fifa-2026-mira-el-calendario-completo-437848", kind: "referencia" },
      { name: "Reddit r/soccer — hilo posterior del partido", url: "https://www.reddit.com/r/soccer/", kind: "conversacion" },
    ],
  },

  // ─────────── Calendario: próximos partidos (previas, sin marcador inventado) ───────────
  // Fixtures verificados (FIFA/ESPN). Horarios convertidos a UTC desde la hora del este.
  // ── Sábado 13 de junio: Catar-Suiza (3pm ET), Brasil-Marruecos (6pm), Haití-Escocia
  //    (9pm) y Australia-Turquía (12am ET / 9pm en Vancouver). Las 4 del día. ──
  // ── Catar 1-1 Suiza · FINALIZADO (datos reales) ──
  finishedMatch({
    date: "2026-06-13",
    kickoffAt: "2026-06-13T19:00:00.000Z",
    slug: "catar-suiza-mundial-2026",
    group: "Grupo B",
    home: "Catar",
    away: "Suiza",
    homeGoals: 1,
    awayGoals: 1,
    scoreDetail: "Suiza: Breel Embolo de penal 17'. Catar: Boualem Khoukhi de cabeza 90+4'. Catar sumó su primer punto en un Mundial; Suiza dominó (xG 3.24 vs 0.76).",
    seoTitle: "Catar 1-1 Suiza: el gol agónico que dio a Catar su primer punto mundialista (Mundial 2026)",
    hook: "El empate sobre la hora que reescribió 90 minutos de dominio suizo",
    matchSummary:
      "Catar empató 1-1 con Suiza en el minuto 90+4 y logró su PRIMER punto en la historia de los Mundiales. Embolo había puesto el 0-1 de penal (17') y Suiza dominó casi todo (xG 3.24 a 0.76), pero el cabezazo de Khoukhi sobre la hora cambió el partido entero: euforia catarí y frustración suiza por exactamente el mismo marcador.",
    quickSummary:
      "Catar rescató un 1-1 ante Suiza con un cabezazo de Khoukhi en el 90+4 y consiguió su primer punto mundialista. Suiza, que dominó de principio a fin (xG 3.24 vs 0.76) y se adelantó con un penal de Embolo, lo dejó escapar sobre la hora. El mismo empate se vivió como triunfo (Catar) y como dos puntos perdidos (Suiza): un caso de regla pico-fin y aversión a la pérdida.",
    whatHappened:
      "Suiza llevó el partido durante 90 minutos: golpeó primero con un penal de Breel Embolo (17') tras falta sobre Freuler y acumuló ocasiones (3.24 goles esperados frente a apenas 0.76 de Catar). Pero en el cuarto minuto de descuento, el capitán Boualem Khoukhi conectó un cabezazo y desató la fiesta catarí: su primer punto en un Mundial. La conversación digital giró por completo en esos segundos finales: de la resignación local a la explosión de celebración, y de la tranquilidad suiza a la bronca por dejar escapar un partido controlado. El marcador fue el mismo para ambos; la experiencia, opuesta.",
    keyPlays: [
      "Penal de Embolo para el 0-1 de Suiza (17').",
      "Suiza domina las ocasiones pero no liquida (xG 3.24 vs 0.76).",
      "Cabezazo de Khoukhi en el 90+4 para el 1-1 y el primer punto de Catar.",
    ],
    controversies: [
      "Suiza lamentó la cantidad de ocasiones falladas que terminaron costándole dos puntos.",
      "El penal del 17' marcó el guion, pero el descuento lo reescribió.",
    ],
    statements: [
      "La afición catarí celebró el punto como un hito; el entorno suizo habló de oportunidad perdida.",
    ],
    combined: {
      expectativa: { euforia: 62, confianza: 64, ansiedad: 50, frustracion: 28, incertidumbre: 54, optimismo: 64 },
      realidad: { euforia: 60, confianza: 56, ansiedad: 78, frustracion: 58, incertidumbre: 64, optimismo: 60 },
      percepcion: { euforia: 72, confianza: 60, ansiedad: 40, frustracion: 50, incertidumbre: 40, optimismo: 66 },
    },
    teamsData: [
      {
        team: "Catar",
        expectedEmotion: "Ilusión cautelosa de local-anfitrión regional ante una potencia.",
        dominantConversation: "Competir con orden y soñar con el primer punto histórico.",
        fanConfidence: "Confianza contenida, con el peso de no haber sumado nunca.",
        mainNarrative: "El equipo que busca su primera alegría mundialista.",
        howTheyArrived: "Por detrás casi todo el partido, resistiendo el dominio suizo.",
        whatHappened: "El cabezazo de Khoukhi en el 90+4 firmó el 1-1 y el primer punto mundialista de Catar.",
        expectationVsReality: "Un empate que, por su historia, se festejó como un triunfo y un alivio enorme.",
        mood: "Euforia agónica por el primer punto histórico",
        behaviorEffect:
          "Llegan envalentonados: el gol sobre la hora rompe un techo psicológico y dispara la confianza pública y la participación.",
        current: { euforia: 86, confianza: 70, ansiedad: 34, frustracion: 24, incertidumbre: 34, optimismo: 84 },
        predicted: { euforia: 72, confianza: 68, ansiedad: 44, frustracion: 32, incertidumbre: 44, optimismo: 76 },
      },
      {
        team: "Suiza",
        expectedEmotion: "Confianza de favorito, con la obligación de empezar ganando.",
        dominantConversation: "Imponer su juego y llevarse los tres puntos sin sobresaltos.",
        fanConfidence: "Confianza alta, casi de trámite.",
        mainNarrative: "La potencia europea que debía resolver con solvencia.",
        howTheyArrived: "Mandando: se adelantó pronto y acumuló ocasiones toda la tarde.",
        whatHappened: "No liquidó y encajó en el 90+4; el dominio no se tradujo en victoria.",
        expectationVsReality: "Esperaban ganar cómodos; el empate sobre la hora supo a dos puntos regalados.",
        mood: "Frustración por dejar escapar un partido controlado",
        behaviorEffect:
          "Llegan con autocrítica: la conversación se centra en la falta de contundencia y en cerrar los partidos.",
        current: { euforia: 28, confianza: 44, ansiedad: 66, frustracion: 78, incertidumbre: 58, optimismo: 40 },
        predicted: { euforia: 44, confianza: 56, ansiedad: 54, frustracion: 54, incertidumbre: 50, optimismo: 54 },
      },
    ],
    lessons: [
      { term: "Regla pico-fin", explanation: "El recuerdo se ancla en el momento más intenso y en el final: un gol en el 90+4 redefine cómo se vive todo el partido, por encima de lo que pasó antes." },
      { term: "Aversión a la pérdida", explanation: "A Suiza le dolió más perder dos puntos que tenía que a Catar le alegró sumar uno inesperado: perder lo seguro pesa más que ganar lo improbable." },
      { term: "Sesgo de recencia", explanation: "Lo último que ocurre tiñe la experiencia entera; el descuento borró 90 minutos de dominio suizo en la conversación." },
    ],
    humanBehavior:
      "No juzgamos el resultado en absoluto, sino respecto a una expectativa: el mismo 1-1 es triunfo para quien nunca sumó y fracaso para quien dominó. El cierre define el recuerdo.",
    cognitiveBiases: [
      "Regla pico-fin: el gol del descuento marca el recuerdo de todo el partido.",
      "Aversión a la pérdida: pesa más perder lo seguro que ganar lo improbable.",
      "Sesgo de recencia: el último minuto reescribe los noventa anteriores.",
    ],
    emotionalReaction:
      "La euforia catarí y la frustración suiza no nacen del marcador, sino de la distancia entre lo esperado y lo vivido por cada hinchada.",
    digitalPatterns:
      "Sentimiento que se invierte en segundos: resignación local y calma suiza hasta el 90+4, y luego explosión de celebración frente a bronca y autocrítica.",
    productApplications: [
      { sector: "Producto digital", application: "El final de un flujo define la satisfacción más que el promedio: cuida el cierre (confirmaciones, estados de éxito) porque es lo que el usuario recuerda." },
      { sector: "Fintech", application: "Un resultado neutro se vive como pérdida o ganancia según la referencia mostrada: encuadrar bien evita que un dato neutral se perciba como fracaso." },
      { sector: "SaaS / Onboarding", application: "Ancla expectativas alcanzables: un logro modesto se siente como éxito si la referencia está bien puesta." },
    ],
    fanPulse: {
      concerns: ["¿Cómo desperdiciamos tantas ocasiones?", "¿Sirve este punto de cara al grupo?", "¿Cómo llega cada equipo al próximo partido?"],
      emotions: ["Resignación que se vuelve euforia (Catar)", "Calma que se vuelve bronca (Suiza)", "Tensión hasta el último minuto"],
      frustrations: ["Suiza: la falta de contundencia.", "Catar: el sufrimiento de ir por detrás casi todo el partido."],
      enthusiasm: ["Catar celebra su primer punto mundialista.", "El golpe de efecto del gol en el descuento."],
    },
    uxFinding:
      "La satisfacción depende de la expectativa con la que se compara y del momento final, no del promedio. Un buen cierre puede convertir un resultado neutro en una experiencia recordada como victoria.",
    aiSummary:
      "Catar empató 1-1 con Suiza en el Mundial 2026 con un cabezazo de Khoukhi en el 90+4 y sumó su primer punto histórico; Embolo había marcado de penal y Suiza dominó (xG 3.24 vs 0.76). Experience Radar de MediaLab lo analiza desde el comportamiento: por la regla pico-fin y la aversión a la pérdida, el mismo empate se vivió como triunfo (Catar) y como fracaso (Suiza). Para productos digitales —fintech, SaaS, producto— la lección es que el final y el marco de referencia definen el valor percibido más que el promedio.",
    sources: [
      { name: "ESPN — Qatar 1-1 Switzerland (Final Score)", url: "https://www.espn.com/soccer/match/_/gameId/760420/switzerland-qatar", kind: "referencia" },
      { name: "FIFA — Mundial 2026 (centro del torneo)", url: "https://www.fifa.com/en/tournaments/mens/worldcup/canadamexicousa2026", kind: "oficial" },
      { name: "Reddit r/soccer — hilo posterior del partido", url: "https://www.reddit.com/r/soccer/", kind: "conversacion" },
    ],
  }),
  // ── Haití 0-1 Escocia · FINALIZADO (datos reales) ──
  finishedMatch({
    date: "2026-06-13",
    kickoffAt: "2026-06-14T01:00:00.000Z",
    slug: "haiti-escocia-mundial-2026",
    group: "Grupo C",
    home: "Haití",
    away: "Escocia",
    homeGoals: 0,
    awayGoals: 1,
    scoreDetail: "Escocia: John McGinn 28' (con desvío). Escocia logró una victoria histórica y lideró por momentos el Grupo C tras el empate Brasil-Marruecos.",
    seoTitle: "Haití 0-1 Escocia: McGinn rompe la sequía mundialista del Tartan Army (Mundial 2026)",
    hook: "El alivio escocés tras años de espera y un debut digno de Haití",
    matchSummary:
      "Escocia venció 0-1 a Haití con un gol de John McGinn (28', con desvío) y rompió una larga sequía: para el Tartan Army, más que tres puntos, fue alivio acumulado. Haití firmó un debut digno y competitivo, pero la derrota deja el sabor de no haber puntuado pese a competir.",
    quickSummary:
      "Escocia ganó 0-1 a Haití con un gol de McGinn (28') y celebró como un desahogo: el peso de años de frustración mundialista se transformó en euforia y alivio. Haití compitió y se fue con la cabeza en alto, pero la derrota duele. El partido muestra cómo el alivio tras una larga espera amplifica la emoción de una victoria ajustada.",
    whatHappened:
      "Escocia abrió el marcador al 28' con un remate de John McGinn que se desvió en un defensa y descolocó al portero Placide. El 1-0 resistió un partido tenso en Boston: Haití, en su debut, compitió con orden y generó respeto, pero no encontró el empate. Para la afición escocesa, la conversación digital no fue de euforia futbolística pura, sino de alivio: el desahogo de romper una sequía y, por momentos, liderar el Grupo C tras el empate entre Brasil y Marruecos. Haití se fue con orgullo por el debut, pero con la frustración de competir y no sumar.",
    keyPlays: [
      "Gol de John McGinn al 28' (con desvío) para el 0-1.",
      "Haití compite y genera respeto en su debut, sin concretar el empate.",
      "Escocia aguanta el 1-0 y rompe su sequía mundialista.",
    ],
    controversies: [
      "El desvío en el gol escocés alimentó el debate sobre la fortuna del resultado.",
      "Haití lamentó la falta de eficacia para premiar su buen debut.",
    ],
    statements: [
      "La afición escocesa vivió el triunfo como un alivio histórico más que como una goleada festiva.",
    ],
    combined: {
      expectativa: { euforia: 64, confianza: 58, ansiedad: 56, frustracion: 30, incertidumbre: 58, optimismo: 64 },
      realidad: { euforia: 58, confianza: 60, ansiedad: 70, frustracion: 48, incertidumbre: 58, optimismo: 62 },
      percepcion: { euforia: 66, confianza: 66, ansiedad: 42, frustracion: 40, incertidumbre: 40, optimismo: 68 },
    },
    teamsData: [
      {
        team: "Haití",
        expectedEmotion: "Ilusión del debutante con poco que perder.",
        dominantConversation: "Competir con orgullo y dar la sorpresa.",
        fanConfidence: "Confianza humilde, apoyada en la garra.",
        mainNarrative: "El debutante que quiere dejar una buena imagen.",
        howTheyArrived: "Compitiendo de igual a igual, sin concretar sus opciones.",
        whatHappened: "Encajaron un gol con desvío y no encontraron el empate pese a competir.",
        expectationVsReality: "Hicieron un buen debut, pero la derrota deja el sabor de no haber sumado.",
        mood: "Orgullo del debut con frustración por no puntuar",
        behaviorEffect:
          "Llegan con autoestima por competir, pero con la conversación centrada en mejorar la puntería y sumar.",
        current: { euforia: 40, confianza: 46, ansiedad: 58, frustracion: 62, incertidumbre: 58, optimismo: 48 },
        predicted: { euforia: 48, confianza: 52, ansiedad: 52, frustracion: 50, incertidumbre: 52, optimismo: 56 },
      },
      {
        team: "Escocia",
        expectedEmotion: "Tensión y ansiedad por años de frustración mundialista.",
        dominantConversation: "La presión de por fin ganar en un Mundial.",
        fanConfidence: "Confianza con miedo escénico, marcada por el historial.",
        mainNarrative: "El Tartan Army que arrastra una larga espera.",
        howTheyArrived: "Tensos, con el peso de la sequía sobre cada jugada.",
        whatHappened: "Ganaron 0-1 con el gol de McGinn y rompieron la sequía.",
        expectationVsReality: "Más que una goleada, fue un alivio: el desahogo de por fin ganar.",
        mood: "Alivio y euforia por romper la sequía",
        behaviorEffect:
          "Llegan liberados: el techo psicológico roto eleva la confianza y la narrativa de 'esta vez sí'.",
        current: { euforia: 82, confianza: 74, ansiedad: 36, frustracion: 26, incertidumbre: 34, optimismo: 82 },
        predicted: { euforia: 72, confianza: 74, ansiedad: 42, frustracion: 30, incertidumbre: 42, optimismo: 78 },
      },
    ],
    lessons: [
      { term: "Efecto de alivio", explanation: "Tras una larga espera, una victoria ajustada genera más emoción que una goleada sin historia: el desahogo amplifica el valor percibido." },
      { term: "Punto de referencia", explanation: "Escocia midió el resultado contra años sin ganar; Haití contra la ilusión del debut: la misma jugada produce alivio o frustración según la referencia." },
      { term: "Sesgo de resultado", explanation: "Un gol con desvío se recuerda como mérito cuando se gana; la suerte se reencuadra como justicia desde el lado ganador." },
    ],
    humanBehavior:
      "El valor de un logro depende de la espera que lo precede: romper una sequía convierte una victoria modesta en una experiencia emocional enorme.",
    cognitiveBiases: [
      "Efecto de alivio: la espera acumulada amplifica la emoción del desenlace.",
      "Punto de referencia: alivio (Escocia) vs frustración (Haití) ante el mismo 0-1.",
      "Sesgo de resultado: ganar reencuadra la fortuna como mérito.",
    ],
    emotionalReaction:
      "La euforia escocesa fue desahogo más que fiesta; la de Haití, orgullo con sabor amargo. La emoción la define la historia previa, no solo el marcador.",
    digitalPatterns:
      "Conversación de desahogo y memoria histórica del lado escocés; orgullo y autoexigencia del lado haitiano, con foco en la eficacia.",
    productApplications: [
      { sector: "Producto digital", application: "Un avance modesto se siente como gran logro si la referencia (la espera, el esfuerzo) está bien encuadrada: celebra los hitos en su contexto." },
      { sector: "SaaS / Onboarding", application: "Reconocer el esfuerzo acumulado del usuario antes de un logro multiplica la satisfacción percibida del momento." },
      { sector: "Ecommerce", application: "Tras una espera (stock, lista de deseos), confirmar la compra con un gesto de reconocimiento convierte un evento normal en memorable." },
    ],
    fanPulse: {
      concerns: ["¿Aguantará Escocia el nivel?", "¿Cómo mejora Haití su puntería?", "¿Alcanza este punto de partida para el grupo?"],
      emotions: ["Alivio y desahogo (Escocia)", "Orgullo con frustración (Haití)", "Tensión durante el 1-0"],
      frustrations: ["Haití: competir y no puntuar.", "Escocia: sufrir un 1-0 corto hasta el final."],
      enthusiasm: ["Escocia rompe su sequía mundialista.", "Haití deja una buena imagen en su debut."],
    },
    uxFinding:
      "El valor percibido de un logro depende de la espera previa. Encuadrar el esfuerzo acumulado convierte un resultado modesto en una experiencia emocional fuerte.",
    aiSummary:
      "Escocia venció 0-1 a Haití en el Mundial 2026 con un gol de McGinn (28') y rompió una larga sequía mundialista. Experience Radar de MediaLab lo analiza desde el comportamiento: por el efecto de alivio y el punto de referencia, una victoria ajustada se vivió como un desahogo histórico (Escocia) y como orgullo frustrado (Haití). Para productos digitales la lección es que el valor percibido de un logro depende de la espera previa: encuadrar el esfuerzo acumulado amplifica la satisfacción.",
    sources: [
      { name: "ESPN — Haiti 0-1 Scotland (recap)", url: "https://www.espn.com/soccer/match/_/gameId/760418/scotland-haiti", kind: "referencia" },
      { name: "FIFA — Mundial 2026 (centro del torneo)", url: "https://www.fifa.com/en/tournaments/mens/worldcup/canadamexicousa2026", kind: "oficial" },
      { name: "Reddit r/soccer — hilo posterior del partido", url: "https://www.reddit.com/r/soccer/", kind: "conversacion" },
    ],
  }),
  // ── Australia 2-0 Turquía · FINALIZADO (datos reales) ──
  finishedMatch({
    date: "2026-06-13",
    kickoffAt: "2026-06-14T04:00:00.000Z",
    slug: "australia-turquia-mundial-2026",
    group: "Grupo D",
    home: "Australia",
    away: "Turquía",
    homeGoals: 2,
    awayGoals: 0,
    scoreDetail: "Australia: Nestory Irankunda 27', Connor Metcalfe 75'. Patrick Beach sostuvo el arco en cero con ocho atajadas.",
    seoTitle: "Australia 2-0 Turquía: Irankunda, Metcalfe y Beach firman el golpe del Mundial 2026",
    hook: "Turquía tuvo la pelota; Australia se quedó con los momentos que la memoria retiene",
    matchSummary:
      "Australia venció 2-0 a Turquía en Vancouver con goles de Nestory Irankunda (27') y Connor Metcalfe (75'). Turquía acumuló 72% de posesión y 30 remates, pero Patrick Beach respondió con ocho atajadas en su debut competitivo: el partido premió la eficacia y la resistencia, no el volumen.",
    quickSummary:
      "Australia venció 2-0 a Turquía con dos contragolpes decisivos: Irankunda marcó al 27' y Metcalfe al 75'. Beach hizo ocho atajadas ante un rival que tuvo 72% de posesión y 30 tiros. En Australia, las pantallas públicas, los festejos y la reivindicación del plan de Tony Popovic convirtieron el triunfo en validación colectiva; en Turquía, la conversación pasó de la superioridad prometida a cuestionar la alineación, el sistema y la falta de definición.",
    whatHappened:
      "Turquía gobernó la posesión y produjo 30 remates, pero Australia diseñó una experiencia de pocos momentos y enorme impacto. Tras una atajada de Beach ante Arda Güler, el equipo salió rápido y Paul Okon-Engstler habilitó a Irankunda para el 1-0 al 27'. Turquía siguió atacando sin convertir; Beach también desvió al poste un remate de Abdülkerim Bardakcı. Cuando la presión crecía, Metcalfe condujo y remató desde fuera del área para el 2-0 al 75'. El cierre reescribió la lectura del partido: la posesión turca se percibió estéril y el repliegue australiano, valiente y deliberado.",
    keyPlays: [
      "27': después de una intervención de Beach ante Güler, Australia acelera la transición y Nestory Irankunda define abajo para el 1-0.",
      "Beach desvía al poste el potente remate de Abdülkerim Bardakcı y termina el encuentro con ocho atajadas.",
      "75': Connor Metcalfe rompe por el centro y sentencia el 2-0 con un remate bajo desde fuera del área.",
    ],
    controversies: [
      "La decisión de Tony Popovic de iniciar con el joven Patrick Beach en lugar del veterano Mat Ryan fue cuestionada antes del partido y quedó reivindicada por sus ocho atajadas.",
      "En Turquía, la selección de jugadores, los cambios de Vincenzo Montella y un sistema incapaz de transformar 30 remates en gol concentraron la crítica posterior; no se registró una polémica arbitral decisiva.",
    ],
    statements: [
      "Patrick Beach describió la celebración del primer gol como «absolute limbs» y destacó la energía del grupo (The Guardian).",
      "Vincenzo Montella afirmó: «Respeto mucho a Australia. Esperaba que jugaran de esta manera» (Associated Press).",
      "Tony Popovic calificó el triunfo como «una noche especial para los Socceroos» (ESPN).",
    ],
    combined: {
      expectativa: { euforia: 62, confianza: 58, ansiedad: 60, frustracion: 28, incertidumbre: 62, optimismo: 60 },
      realidad: { euforia: 76, confianza: 72, ansiedad: 72, frustracion: 48, incertidumbre: 50, optimismo: 76 },
      percepcion: { euforia: 82, confianza: 78, ansiedad: 42, frustracion: 46, incertidumbre: 36, optimismo: 80 },
    },
    teamsData: [
      {
        team: "Australia",
        expectedEmotion: "Confianza tranquila, sin ser favorito declarado.",
        dominantConversation: "Las dudas sobre las elecciones de Popovic y si un bloque bajo resistiría ante el talento turco.",
        fanConfidence: "Moderada: había identidad competitiva, pero abundaban los pronósticos que ubicaban a Australia al fondo del grupo.",
        mainNarrative: "El equipo subestimado que debía demostrar que su plan sí podía sostenerse en un Mundial.",
        howTheyArrived: "Con diez debutantes mundialistas y la sorpresa de Beach como titular por delante de Mat Ryan.",
        whatHappened: "Cedieron 72% de posesión, golpearon en dos transiciones y protegieron el cero con ocho atajadas de Beach.",
        expectationVsReality: "La realidad superó el marco previo: las decisiones criticadas de Popovic se convirtieron en la explicación central del triunfo.",
        userExperience: {
          expectativa: "En r/Aleague y r/socceroos, la previa mezcló dudas sobre el plan de Popovic con coordinación de puntos de encuentro y la expectativa de volver a llenar Federation Square.",
          realidad: "Los clips del gol de Irankunda y las imágenes de Federation Square circularon entre bengalas, cánticos y celebraciones; la atajada de Beach y el homenaje de Irankunda a Tim Cahill fueron los picos compartibles.",
          percepcion: "El meme digital cambió de cuestionar a Popovic a «HOW GOOD'S POPPA?!?!»: el resultado convirtió una selección discutida en prueba de lectura táctica y reforzó la ilusión ante Estados Unidos.",
        },
        mood: "Euforia y reivindicación por un triunfo inesperado",
        behaviorEffect:
          "Llegan reforzados: la conversación celebra el orden y proyecta un grupo competitivo.",
        current: { euforia: 90, confianza: 84, ansiedad: 30, frustracion: 18, incertidumbre: 26, optimismo: 88 },
        predicted: { euforia: 76, confianza: 80, ansiedad: 48, frustracion: 26, incertidumbre: 44, optimismo: 82 },
      },
      {
        team: "Turquía",
        expectedEmotion: "Confianza de favorito con presión por rendir.",
        dominantConversation: "El regreso al Mundial tras 24 años y la promesa pública de que Turquía era técnicamente superior.",
        fanConfidence: "Alta, apoyada en ocho partidos invicta y en figuras como Arda Güler y Hakan Çalhanoğlu.",
        mainNarrative: "El regreso que debía confirmar el crecimiento mostrado desde la Euro 2024.",
        howTheyArrived: "Con favoritismo, una larga espera mundialista y un discurso de superioridad técnica.",
        whatHappened: "Tuvieron 72% de posesión y 30 tiros, pero no superaron a Beach y concedieron dos contragolpes.",
        expectationVsReality: "La brecha fue extrema: dominar los indicadores de volumen y perder 0-2 hizo que la derrota pareciera una falla de sistema, no un accidente.",
        userExperience: {
          expectativa: "La conversación turca amplificó el regreso después de 24 años y las declaraciones de superioridad técnica; transmisiones y reuniones públicas, como la de Yedikule en Estambul, convirtieron el debut en evento nacional.",
          realidad: "Durante el partido, la posesión y los remates sostuvieron la esperanza, pero cada atajada de Beach elevó la frustración; tras el 0-2, clips y comentarios se concentraron en la alineación, los cambios y el sistema de Montella.",
          percepcion: "El contraste entre «somos mucho mejores» y el 0-2 alimentó publicaciones irónicas y una autocrítica inmediata: la estadística de 30 tiros pasó de señal de dominio a evidencia de ineficacia.",
        },
        mood: "Decepción y autocrítica tras un debut fallido",
        behaviorEffect:
          "Llegan tocados: la conversación se centra en el nivel real y en recomponer la confianza.",
        current: { euforia: 20, confianza: 34, ansiedad: 76, frustracion: 86, incertidumbre: 70, optimismo: 32 },
        predicted: { euforia: 38, confianza: 46, ansiedad: 66, frustracion: 62, incertidumbre: 60, optimismo: 46 },
      },
    ],
    lessons: [
      { term: "Regla pico-fin", explanation: "Australia produjo menos volumen, pero concentró la memoria en tres picos: los goles de Irankunda y Metcalfe y las atajadas de Beach. La experiencia se recuerda por esos momentos, no por el 28% de posesión." },
      { term: "Sesgo de resultado", explanation: "La titularidad de Beach y el bloque bajo parecían riesgos antes del inicio; el 2-0 los reencuadró como decisiones maestras. El desenlace cambió la evaluación del proceso." },
      { term: "Aversión a la pérdida", explanation: "Tras 24 años fuera del Mundial, Turquía vivió el 0-2 como pérdida de una oportunidad largamente esperada. Esa inversión emocional elevó la crítica más allá de lo que indican la posesión y los remates." },
    ],
    humanBehavior:
      "Las personas no promedian una experiencia: recuerdan sus picos, su final y si el resultado confirmó o contradijo la historia que traían. Australia convirtió pocos momentos en una memoria enorme; Turquía convirtió mucho control en una sensación de oportunidad perdida.",
    cognitiveBiases: [
      "Regla pico-fin: dos goles y ocho atajadas pesan más que 72% de posesión.",
      "Sesgo de resultado: el marcador reevalúa decisiones discutidas de Popovic como aciertos.",
      "Aversión a la pérdida: 24 años de espera amplifican la frustración turca.",
    ],
    emotionalReaction:
      "Australia pasó de la cautela a una euforia de reivindicación; Turquía transitó de la seguridad previa a la esperanza sostenida por el dominio y terminó en frustración, incredulidad y búsqueda de responsables.",
    digitalPatterns:
      "En Australia dominaron los videos de Federation Square, los goles, las atajadas y la reivindicación humorística de Popovic. En Turquía, las publicaciones giraron hacia la alineación, el sistema, los cambios y la contradicción entre superioridad estadística y derrota.",
    productApplications: [
      { sector: "Producto digital", application: "Diseña y protege dos o tres momentos decisivos del recorrido: un pico bien resuelto y un cierre claro pueden pesar más que una experiencia uniformemente correcta." },
      { sector: "Analítica", application: "No confundas volumen con éxito. Muchas visitas, clics o intentos sin conversión pueden sentirse como el 72% de posesión turca: actividad alta con valor percibido bajo." },
      { sector: "SaaS / Recuperación", application: "Cuando el usuario lleva mucho tiempo esperando, reconoce explícitamente esa inversión y ofrece una salida rápida; la aversión a perder lo acumulado multiplica la frustración." },
    ],
    fanPulse: {
      concerns: ["¿Puede Australia repetir este bloque ante Estados Unidos?", "¿Cómo convierte Turquía su volumen ofensivo en goles?", "¿Mantendrá Montella el sistema y sus titulares?"],
      emotions: ["Reivindicación y euforia australiana", "Frustración e incredulidad turca", "Ansiedad sostenida por las atajadas de Beach"],
      frustrations: ["Turquía produjo 30 remates sin anotar.", "La superioridad de posesión no evitó dos contragolpes decisivos."],
      enthusiasm: ["Irankunda emerge como rostro de una generación joven.", "Beach convierte un debut inesperado en actuación memorable.", "Federation Square transforma el resultado en celebración colectiva."],
    },
    uxFinding:
      "La experiencia no premia el volumen por sí solo: necesita momentos que conviertan. Diseñar picos claros y un cierre contundente puede generar más recuerdo y confianza que dominar todas las métricas intermedias.",
    aiSummary:
      "Australia venció 2-0 a Turquía con goles de Irankunda (27') y Metcalfe (75') y ocho atajadas de Patrick Beach. Aunque Turquía tuvo 72% de posesión y 30 remates, los Socceroos concentraron la memoria del partido en sus picos decisivos. La regla pico-fin, el sesgo de resultado y la aversión a perder una oportunidad tras 24 años explican la euforia australiana y la frustración turca. Para productos digitales, la lección es directa: actividad no equivale a valor; los momentos que convierten y el cierre gobiernan el recuerdo.",
    sources: [
      { name: "FIFA — calendario y resultados del Mundial 2026", url: "https://www.fifa.com/en/tournaments/mens/worldcup/canadamexicousa2026/scores-fixtures", kind: "oficial" },
      { name: "ESPN — Australia 2-0 Türkiye", url: "https://www.espn.com/soccer/match/_/gameId/760421/turkiye-australia", kind: "referencia" },
      { name: "The Guardian — Australia 2-0 Turkey, minuto a minuto", url: "https://www.theguardian.com/football/live/2026/jun/14/fifa-world-cup-2026-live-socceroos-australia-v-turkey-updates-aus-vs-tur-group-d-match-score-latest", kind: "referencia" },
      { name: "Associated Press — crónica y declaraciones", url: "https://www.wral.com/news/ap/69042-australia-spoils-turkeys-return-to-the-world-cup-with-a-2-0-victory/", kind: "referencia" },
      { name: "The Guardian — festejos en Federation Square", url: "https://www.theguardian.com/australia-news/2026/jun/14/world-cup-australia-socceroos-federation-square-melbourne-fans-flares-chants", kind: "conversacion" },
      { name: "Reddit r/Aleague — reacción al gol de Metcalfe", url: "https://www.reddit.com/r/Aleague/comments/1u5cskj/connor_metcalfe_goal_socceroos_2_vs_0_turkey/", kind: "conversacion" },
    ],
  }),
  // 14 jun 2026 (hora ET): Alemania–Curazao 1pm, Países Bajos–Japón 4pm, Costa de Marfil–
  // Ecuador 7pm, Suecia–Túnez 10pm. UTC = ET + 4h (EDT). Verificado con el fixture oficial.
  upcomingMatch({
    date: "2026-06-14",
    kickoffAt: "2026-06-14T17:00:00.000Z",
    slug: "alemania-curazao-mundial-2026",
    teams: ["Alemania", "Curazao"],
    group: "Fase de grupos",
    officialUrl: "https://www.fifa.com/en/tournaments/mens/worldcup/canadamexicousa2026/scores-fixtures",
  }),
  upcomingMatch({
    date: "2026-06-14",
    kickoffAt: "2026-06-14T20:00:00.000Z",
    slug: "paises-bajos-japon-mundial-2026",
    teams: ["Países Bajos", "Japón"],
    group: "Fase de grupos",
    officialUrl: "https://www.fifa.com/en/tournaments/mens/worldcup/canadamexicousa2026/scores-fixtures",
  }),
  upcomingMatch({
    date: "2026-06-14",
    kickoffAt: "2026-06-14T23:00:00.000Z",
    slug: "costa-de-marfil-ecuador-mundial-2026",
    teams: ["Costa de Marfil", "Ecuador"],
    group: "Fase de grupos",
    officialUrl: "https://www.fifa.com/en/tournaments/mens/worldcup/canadamexicousa2026/scores-fixtures",
  }),
  upcomingMatch({
    date: "2026-06-14",
    kickoffAt: "2026-06-15T02:00:00.000Z",
    slug: "suecia-tunez-mundial-2026",
    teams: ["Suecia", "Túnez"],
    group: "Fase de grupos",
    officialUrl: "https://www.fifa.com/en/tournaments/mens/worldcup/canadamexicousa2026/scores-fixtures",
  }),
  // 15 jun 2026 (hora ET): España–Cabo Verde 12pm, Bélgica–Egipto 3pm,
  // Arabia Saudita–Uruguay 6pm, Irán–Nueva Zelanda 9pm. Todos dentro del corte de 48h.
  upcomingMatch({
    date: "2026-06-15",
    kickoffAt: "2026-06-15T16:00:00.000Z",
    slug: "espana-cabo-verde-mundial-2026",
    teams: ["España", "Cabo Verde"],
    group: "Grupo H",
    officialUrl: "https://www.fifa.com/en/tournaments/mens/worldcup/canadamexicousa2026/scores-fixtures",
  }),
  upcomingMatch({
    date: "2026-06-15",
    kickoffAt: "2026-06-15T19:00:00.000Z",
    slug: "belgica-egipto-mundial-2026",
    teams: ["Bélgica", "Egipto"],
    group: "Grupo G",
    officialUrl: "https://www.fifa.com/en/tournaments/mens/worldcup/canadamexicousa2026/scores-fixtures",
  }),
  upcomingMatch({
    date: "2026-06-15",
    kickoffAt: "2026-06-15T22:00:00.000Z",
    slug: "arabia-saudita-uruguay-mundial-2026",
    teams: ["Arabia Saudita", "Uruguay"],
    group: "Grupo H",
    officialUrl: "https://www.fifa.com/en/tournaments/mens/worldcup/canadamexicousa2026/scores-fixtures",
  }),
  upcomingMatch({
    date: "2026-06-15",
    kickoffAt: "2026-06-16T01:00:00.000Z",
    slug: "iran-nueva-zelanda-mundial-2026",
    teams: ["Irán", "Nueva Zelanda"],
    group: "Grupo G",
    officialUrl: "https://www.fifa.com/en/tournaments/mens/worldcup/canadamexicousa2026/scores-fixtures",
  }),
]

/**
 * Seed estático: artículos editoriales de ejemplo. Sirven como fallback cuando el
 * agente diario todavía no ha generado y persistido artículos en el store.
 */
export const RADAR_ARTICLE_SEED: RadarArticle[] = ARTICLE_INPUTS.map(generateRadarArticle)

/**
 * Identidad de PARTIDO: equipos (sin orden) + fecha. Una previa y su finalizado del
 * mismo partido comparten esta clave, así que cuentan como una sola nota.
 */
function matchKey(a: RadarArticle): string {
  const teams = [...a.teams].map((t) => t.trim().toLowerCase()).sort().join("|")
  return `${teams}::${a.date}`
}

/**
 * Una nota por partido: si hay más de una versión del mismo partido (p. ej. previa y
 * finalizado, o duplicados del store), conserva una sola. Gana el estado "finalizado"
 * sobre "previa"; a igualdad de estado, la actualizada más recientemente.
 */
function dedupeByMatch(list: RadarArticle[]): RadarArticle[] {
  const rank = (a: RadarArticle) => (a.matchState === "finalizado" ? 1 : 0)
  const best = new Map<string, RadarArticle>()
  for (const a of list) {
    const key = matchKey(a)
    const cur = best.get(key)
    const wins = !cur || rank(a) > rank(cur) || (rank(a) === rank(cur) && (a.updatedAt ?? "") >= (cur.updatedAt ?? ""))
    if (wins) best.set(key, a)
  }
  return [...best.values()]
}

/**
 * Lista de artículos (más recientes primero). Prioriza lo que el agente diario
 * guardó en el store; si no hay nada persistido, usa el seed. Garantiza una sola
 * nota por partido (dedupe por equipos + fecha).
 */
export async function getAllRadarArticles(): Promise<RadarArticle[]> {
  const stored = await getStoredRadarArticles()
  // El agente actualiza partidos concretos; nunca debe borrar del portal los
  // demas encuentros que ya forman parte del calendario editorial.
  const list = stored && stored.length ? [...RADAR_ARTICLE_SEED, ...stored] : RADAR_ARTICLE_SEED
  // Orden del feed: EN VIVO primero, luego lo PRÓXIMO (más cercano), y al final los
  // FINALIZADOS (más reciente primero). Así la destacada es la que se juega ahora.
  return dedupeByMatch(list).sort((a, b) => compareForFeed(a, b))
}

/**
 * Notas del portal: se muestran TODOS los partidos del calendario (en vivo, próximos
 * y finalizados). La tarjeta usa `getArticleAvailability` para decidir si la nota ya es
 * accesible (clic) o aparece como "Próximamente"/"En actualización"; pero el partido
 * siempre se ve. La hora se muestra en la zona local de quien abre la página.
 */
export async function getVisibleRadarArticles(): Promise<RadarArticle[]> {
  return getAllRadarArticles()
}

/** Busca un artículo por slug (store con fallback al seed). */
export async function getRadarArticleBySlug(slug: string): Promise<RadarArticle | undefined> {
  const all = await getAllRadarArticles()
  return all.find((a) => a.slug === slug)
}
