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

function analyzedUpcomingMatch(input: {
  date: string
  kickoffAt: string
  slug: string
  teams: [string, string]
  group: string
  seoTitle: string
  hook: string
  quickSummary: string
  whatHappened: string
  uxFinding: string
  keyPlays: string[]
  statements: string[]
  sources: Array<{ name: string; url: string; kind: ArticleSourceRef["kind"] }>
  imageUrl: string
  imageAlt: string
  imageCredit: string
  imageSourceUrl: string
  emotionalRadar: EmotionalRadarValues
  analyzedAt: string
  /** Lectura POR HINCHADA (opcional): si se da, cada caja de país es distinta (no se colapsan). */
  teamsData?: Array<{
    team: string
    expectedEmotion: string
    dominantConversation: string
    fanConfidence: string
    mainNarrative: string
    userExperience?: { expectativa?: string; realidad?: string; percepcion?: string }
  }>
}): RadarArticleInput {
  const label = input.teams.join(" vs ")
  return {
    category: "Fan Experience",
    date: input.date,
    kickoffAt: input.kickoffAt,
    slug: input.slug,
    matchState: "previa",
    updateState: "ready",
    placeholder: false,
    analyzedPreviaAt: input.analyzedAt,
    seoTitle: input.seoTitle,
    teams: input.teams,
    event: `Mundial 2026 — ${input.group}`,
    hook: input.hook,
    quickSummary: input.quickSummary,
    matchSummary: input.quickSummary,
    whatHappened: input.whatHappened,
    keyPlays: input.keyPlays,
    controversies: [],
    statements: input.statements,
    fanPulse: {
      concerns: ["Alineación y estado físico", "Cómo reducir la incertidumbre antes del debut", "Qué narrativa dominará el inicio"],
      emotions: ["Expectativa", "Ansiedad previa", "Optimismo cauteloso"],
      frustrations: ["Información dispersa y cambios de última hora"],
      enthusiasm: [input.hook],
      sources: input.sources.filter((source) => source.kind === "conversacion" || source.kind === "tendencia"),
    },
    mediaLabInsight: {
      humanBehavior: "Antes de un debut, la audiencia convierte cada novedad de alineación, viaje o estado físico en una señal sobre el resultado futuro.",
      cognitiveBiases: ["Efecto de disponibilidad", "Sesgo de confirmación", "Aversión a la incertidumbre"],
      emotionalReaction: "La cercanía del inicio aumenta la búsqueda compulsiva de novedades y amplifica el peso de la última información disponible.",
      digitalPatterns: `La conversación sobre ${label} se concentra en horarios, posibles titulares, ausencias y clips de llegada o entrenamiento.`,
    },
    productApplications: [
      { sector: "Producto digital", application: "Separar hechos confirmados, dudas y hora de próxima actualización evita que una novedad menor se convierta en certeza falsa." },
      { sector: "Streaming", application: "Mostrar acceso, horario local y estado de la transmisión antes del pico reduce soporte y recargas compulsivas." },
      { sector: "SaaS", application: "En procesos sensibles, una línea de tiempo visible ayuda a distinguir el estado actual de la interpretación del usuario." },
    ],
    emotionalRadar: input.emotionalRadar,
    matchPhases: { expectativa: input.emotionalRadar },
    // Lectura por hinchada (si se aporta): evita que ambas cajas muestren el mismo texto.
    teamApproach: input.teamsData?.map((t) => ({
      team: t.team,
      expectedEmotion: t.expectedEmotion,
      dominantConversation: t.dominantConversation,
      fanConfidence: t.fanConfidence,
      mainNarrative: t.mainNarrative,
      userExperience: t.userExperience,
    })),
    scoreFactors: { emotionalImpact: 76, digitalConversation: 72, virality: 68, userInterest: 84 },
    uxFinding: input.uxFinding,
    aiSummary: `${input.quickSummary} El análisis separa hechos verificados de expectativas y observa cómo la última novedad disponible moldea confianza, ansiedad y conversación digital.`,
    sources: input.sources,
    imageUrl: input.imageUrl,
    imageAlt: input.imageAlt,
    imageCredit: input.imageCredit,
    imageSourceUrl: input.imageSourceUrl,
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
  matchInterpretations?: RadarArticle["matchInterpretations"]
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
  previewImageUrl?: string
  previewImageAlt?: string
  previewImageCredit?: string
  previewImageSourceUrl?: string
  analyzedAt?: string
  /** Próximo rival por selección (clave = equipo). Para el pronóstico "vs X". */
  nextOpponents?: Record<string, string>
  /** Selecciones eliminadas (sin más partidos): no se habilita su pronóstico. */
  eliminatedTeams?: string[]
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
    analyzedFinalAt: input.analyzedAt,
    nextOpponents: input.nextOpponents,
    eliminatedTeams: input.eliminatedTeams,
    imageUrl: input.imageUrl,
    imageAlt: input.imageAlt,
    imageCredit: input.imageCredit,
    imageSourceUrl: input.imageSourceUrl,
    previewImageUrl: input.previewImageUrl,
    previewImageAlt: input.previewImageAlt,
    previewImageCredit: input.previewImageCredit,
    previewImageSourceUrl: input.previewImageSourceUrl,
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
    matchInterpretations: input.matchInterpretations,
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
    imageUrl: "/images/experience-radar/mundial-2026/canada-bosnia.jpg",
    imageAlt: "Canadá vs Bosnia y Herzegovina — empate 1-1 en BMO Field, Mundial 2026",
    imageCredit: "Win Sports",
    imageSourceUrl: "https://www.winsports.co/futbol-internacional/noticias/en-vivo-canada-vs-bosnia-minuto-a-minuto-y-goles-copa-mundial-de-la-fifa-438126",
    matchScore: {
      home: "Canadá",
      away: "Bosnia y Herzegovina",
      homeGoals: 1,
      awayGoals: 1,
      detail: "Bosnia y Herzegovina: Jovo Lukić 21'. Canadá: Cyle Larin 78'. Asistencia: Promise David. 43.002 asistentes en Toronto Stadium.",
    },
    matchSummary:
      "Canadá rescató un 1-1 ante Bosnia y Herzegovina en Toronto Stadium y sumó su primer punto en la historia de los Mundiales. Jovo Lukić abrió el marcador de cabeza al 21' y Cyle Larin, dos minutos después de entrar, igualó al 78' tras pase de Promise David. Canadá tuvo 61% de posesión, 13 remates y dos balones salvados sobre la línea; Bosnia convirtió su fortaleza aérea en una ventaja que no pudo cerrar.",
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
        userExperience: {
          expectativa: "En r/CanadaSoccer, la previa mezcló predicciones de 1-0 o 1-1, coordinación de watch parties y preguntas sobre entradas y transmisión. El debut en casa se consumía como un acontecimiento nacional, no como un partido más.",
          realidad: "El hilo de partido pasó del temor de repetir la historia tras el 0-1 a compartir compulsivamente el gol de Larin. En X, «Canada Earns First World Cup Point» se convirtió en tendencia y los clips oficiales concentraron la conversación alrededor del minuto 78.",
          percepcion: "El post-partido dividió a la afición entre orgullo histórico y sensación de que Canadá debió ganar: el hilo específico de r/CanadaSoccer superó los 700 comentarios y reencuadró el empate como piso, no como techo.",
        },
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
        userExperience: {
          expectativa: "Videos de aficionados bosnios ocupando calles de Toronto y reuniones en Sarajevo reforzaron una experiencia de diáspora: jugar fuera de casa se sintió también como una toma simbólica de la ciudad anfitriona.",
          realidad: "El gol de Lukić disparó videos de celebración en Sarajevo; después, los hilos internacionales se concentraron en la resistencia defensiva, las salvadas sobre la línea y el desgaste físico para sostener la ventaja.",
          percepcion: "La conversación bosnia quedó entre satisfacción por competir y amargura por perder el control al final. El punto se evaluó contra haber ido 1-0 durante 57 minutos, no contra la dificultad previa del debut.",
        },
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
      "Canadá empató 1-1 con Bosnia y Herzegovina y logró su primer punto mundialista. Lukić marcó al 21' y Larin igualó al 78', dos minutos después de entrar. Canadá dominó 61%-39% la posesión y remató 13 veces, pero necesitó un final de alto impacto para transformar la frustración en orgullo. X, r/CanadaSoccer y r/soccer mostraron dos lecturas simultáneas: hito histórico y oportunidad perdida.",
    whatHappened:
      "Bosnia golpeó al 21': Vasić ejecutó el córner, Kolašinac prolongó y Jovo Lukić cabeceó el 0-1. Canadá acumuló 61% de posesión, nueve córners y 13 remates, pero su recorrido estuvo dominado por la fricción: Jonathan David y Oluwaseyi desperdiciaron opciones y Kolašinac y Katić salvaron dos acciones sobre la línea. Jesse Marsch cambió el ataque al 76'; dos minutos después Promise David asistió a Cyle Larin para el 1-1. Ante 43.002 personas, el final convirtió una actuación frustrante en el primer punto mundialista de Canadá. El partido también produjo una novedad reglamentaria compartida ampliamente: el árbitro Facundo Tello sancionó a Kolašinac por exceder el límite de cinco segundos en un saque de banda, primera aplicación de esa regla en el torneo.",
    keyPlays: [
      "21': Lukić cabecea el 0-1 después de la prolongación de Kolašinac en un córner de Vasić.",
      "53': Kolašinac despeja sobre la línea y envía al travesaño una ocasión que ya superaba al guardameta Vasilj.",
      "78': Larin controla el pase de Promise David, gira y marca el 1-1 dos minutos después de ingresar.",
    ],
    controversies: [
      "Facundo Tello revirtió un saque de banda de Bosnia porque Kolašinac excedió el nuevo límite de cinco segundos; fue la primera aplicación mundialista difundida de la regla.",
      "Canadá reclamó una colisión entre Nikola Vasilj y Tani Oluwaseyi, pero la jugada no produjo penal; no hubo una decisión arbitral que alterara el marcador.",
    ],
    statements: [
      "Major League Soccer describió el gol de Larin como «one of the biggest goals in Canada history» en su publicación posterior al partido.",
      "Jesse Marsch destacó que los suplentes tuvieron un «big impact», especialmente Larin, según su rueda de prensa posterior.",
      "Sergej Barbarez dijo quedar con un sabor amargo pese a estar satisfecho con el rendimiento general de Bosnia (beIN Sports).",
    ],
    fanPulse: {
      concerns: ["¿Por qué concedimos el primer gol?", "¿Alcanza este nivel para competir el grupo?", "¿Cómo llega Canadá al próximo partido?"],
      emotions: ["Tensión con el 0-1", "Alivio con el empate", "Orgullo por el primer punto"],
      frustrations: ["El bache defensivo del gol de Bosnia.", "El miedo a repetir la racha de derrotas."],
      enthusiasm: ["Festejo por el hito histórico en casa.", "Ilusión renovada para el resto del grupo."],
      sources: [
        { name: "X — tendencia Canada Earns First World Cup Point", url: "https://x.com/i/trending/2065707467984572545", kind: "tendencia" },
        { name: "Reddit r/CanadaSoccer — post-partido", url: "https://www.reddit.com/r/CanadaSoccer/comments/1u47hbf/postmatch_thread_bosniaherzegovina_vs_canada_fifa/", kind: "conversacion" },
        { name: "Reddit r/soccer — post-partido y estadísticas", url: "https://www.reddit.com/r/soccer/comments/1u47h37/post_match_thread_canada_1_1_bosniaherzegovina/", kind: "conversacion" },
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
        "En Canadá, X concentró el hito en el gol de Larin y Reddit añadió una capa crítica sobre definición y ranking. En Bosnia, los videos de aficionados en Toronto y Sarajevo dieron visibilidad a la diáspora antes de que el empate desplazara la conversación hacia los dos puntos perdidos.",
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
      "Canadá empató 1-1 con Bosnia y Herzegovina y consiguió su primer punto mundialista: Lukić marcó al 21' y Larin al 78'. Canadá tuvo 61% de posesión y 13 remates, pero dos salvadas sobre la línea prolongaron la frustración hasta el pico emocional del final. X convirtió el gol en tendencia y los hilos específicos de Reddit discutieron tanto el hito como las ocasiones desperdiciadas. El caso muestra cómo la regla pico-fin y el punto de referencia permiten que un empate sea simultáneamente memoria histórica para Canadá y pérdida para Bosnia.",
    sources: [
      { name: "FIFA — reporte oficial Canadá 1-1 Bosnia y Herzegovina", url: "https://www.fifa.com/en/tournaments/mens/worldcup/canadamexicousa2026/articles/canada-bosnia-and-herzegovina-highlights-match-report", kind: "oficial" },
      { name: "FIFA — reporte completo y estadísticas", url: "https://fdp.fifa.org/assetspublic/ce281/r12458/pdf/FullTimeMatchReport-English.pdf", kind: "oficial" },
      { name: "ESPN — Canadá logra su primer punto mundialista", url: "https://www.espn.com/soccer/match/_/gameId/760416/bosnia-herzegovina-canada", kind: "referencia" },
      { name: "Win Sports — Canadá y Bosnia se repartieron puntos", url: "https://www.winsports.co/futbol-internacional/noticias/en-vivo-canada-vs-bosnia-minuto-a-minuto-y-goles-copa-mundial-de-la-fifa-438126", kind: "referencia" },
      { name: "Latingoles — Canadá empata con Bosnia en Toronto", url: "https://latingoles.com/tropiezo-en-el-debut-canada-empata-con-bosnia-como-anfitrion-en-toronto/", kind: "referencia" },
      { name: "The Guardian — minuto a minuto y reacción", url: "https://www.theguardian.com/football/live/2026/jun/12/canada-v-bosnia-and-herzegovina-world-cup-2026-live", kind: "referencia" },
      { name: "X — tendencia sobre el primer punto de Canadá", url: "https://x.com/i/trending/2065707467984572545", kind: "tendencia" },
      { name: "Reddit r/CanadaSoccer — post-partido", url: "https://www.reddit.com/r/CanadaSoccer/comments/1u47hbf/postmatch_thread_bosniaherzegovina_vs_canada_fifa/", kind: "conversacion" },
      { name: "Reddit r/soccer — post-partido", url: "https://www.reddit.com/r/soccer/comments/1u47h37/post_match_thread_canada_1_1_bosniaherzegovina/", kind: "conversacion" },
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
    imageUrl: "/images/experience-radar/mundial-2026/estados-unidos-paraguay.jpg",
    imageCredit: "Win Sports",
    imageSourceUrl: "https://www.winsports.co/futbol-internacional/noticias/en-vivo-estados-unidos-vs-paraguay-minuto-a-minuto-y-goles-copa-mundial-de-la-fifa-438190",
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
    imageUrl: "/images/experience-radar/mundial-2026/mexico-sudafrica.jpg",
    imageCredit: "Win Sports",
    imageSourceUrl: "https://www.winsports.co/futbol-internacional/noticias/en-vivo-mexico-vs-sudafrica-minuto-a-minuto-y-goles-copa-mundial-de-la-fifa-2026-437905",
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
    imageUrl: "/images/experience-radar/mundial-2026/corea-del-sur-chequia.jpg",
    imageCredit: "Win Sports",
    imageSourceUrl: "https://www.winsports.co/futbol-internacional/noticias/en-vivo-corea-vs-chequia-minuto-a-minuto-y-goles-copa-mundial-de-la-fifa-437986",
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
    imageUrl: "/images/experience-radar/mundial-2026/brasil-marruecos.jpg",
    imageAlt: "Brasil y Marruecos durante el empate 1-1 en el Mundial 2026",
    imageCredit: "Win Sports",
    imageSourceUrl: "https://www.winsports.co/futbol-internacional/noticias/en-vivo-brasil-vs-marruecos-minuto-a-minuto-y-goles-copa-mundial-de-la-fifa-438365",
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
    imageUrl: "/images/experience-radar/mundial-2026/catar-suiza.jpg",
    imageAlt: "Catar ante Suiza en el empate 1-1 del Mundial 2026",
    imageCredit: "Win Sports",
    imageSourceUrl: "https://www.winsports.co/futbol-internacional/noticias/en-vivo-qatar-vs-suiza-minuto-a-minuto-y-goles-copa-mundial-de-la-fifa-438318",
    homeGoals: 1,
    awayGoals: 1,
    scoreDetail: "Suiza: Breel Embolo de penal 17'. Catar: Boualem Khoukhi de cabeza 90+4'. Catar sumó su primer punto en un Mundial; Suiza dominó (xG 3.24 vs 0.76).",
    seoTitle: "Catar 1-1 Suiza: El gol agónico que dio a Catar su primer punto mundialista (Mundial 2026)",
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
    imageUrl: "/images/experience-radar/mundial-2026/haiti-escocia.jpg",
    imageAlt: "Escocia durante su victoria 1-0 ante Haití en el Mundial 2026",
    imageCredit: "Win Sports",
    imageSourceUrl: "https://www.winsports.co/futbol-internacional/noticias/en-vivo-haiti-vs-escocia-minuto-a-minuto-y-goles-copa-mundial-de-la-fifa-438440",
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
    imageUrl: "/images/experience-radar/mundial-2026/australia-turquia.jpg",
    imageAlt: "Australia celebra su victoria 2-0 ante Turquía en el Mundial 2026",
    imageCredit: "Win Sports",
    imageSourceUrl: "https://www.winsports.co/futbol-internacional/noticias/australia-sorprende-a-turquia-con-un-triunfo-clave-en-la-copa-mundial-de-la-fifa-438506",
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
  finishedMatch({
    date: "2026-06-14",
    kickoffAt: "2026-06-14T17:00:00.000Z",
    slug: "alemania-curazao-mundial-2026",
    group: "Grupo E",
    home: "Alemania",
    away: "Curazao",
    homeGoals: 7,
    awayGoals: 1,
    scoreDetail: "Alemania: Felix Nmecha 6', Nico Schlotterbeck 38', Kai Havertz 45+4' (penal) y 88', Jamal Musiala 47', Nathaniel Brown 68', Deniz Undav 78'. Curazao: Livano Comenencia 21'.",
    seoTitle: "Alemania 7-1 Curazao: una goleada y un gol que Curazao recordará para siempre",
    hook: "El marcador fue alemán; el momento más humano perteneció al debutante",
    matchSummary: "Alemania goleó 7-1 a Curazao en Houston, pero el partido tuvo dos memorias. La potencia europea repartió siete goles y disipó la ansiedad de sus últimas eliminaciones tempranas; Curazao, la nación más pequeña en disputar un Mundial, celebró con Comenencia (21') el primer gol de su historia en el torneo.",
    quickSummary: "Alemania venció 7-1 a Curazao con doblete de Havertz y goles de Nmecha, Schlotterbeck, Musiala, Brown y Undav. Comenencia empató momentáneamente al 21' y marcó el primer gol mundialista de Curazao. En digital, el 7-1 activó comparaciones con Brasil 2014, pero los videos más emocionales fueron el gol caribeño, las lágrimas de Dick Advocaat y la reacción orgullosa de sus aficionados.",
    whatHappened: "Nmecha adelantó a Alemania al 6', pero Comenencia respondió al 21' con un remate desviado que igualó el partido y produjo el mayor pico emocional de Curazao. La resistencia duró hasta el 38', cuando Schlotterbeck marcó de cabeza; Havertz hizo el 3-1 de penal en el 45+4'. Musiala anotó 69 segundos después del descanso y Brown (68'), Undav (78') y Havertz (88') llevaron el marcador al 7-1. Alemania convirtió el susto en demostración de profundidad; Curazao perdió por seis, pero salió con una escena fundacional que no depende del resultado final.",
    keyPlays: [
      "21': Livano Comenencia empata 1-1 y marca el primer gol de Curazao en una Copa del Mundo.",
      "45+4': Havertz convierte el penal para el 3-1 justo antes del descanso y rompe la resistencia emocional del debutante.",
      "47': Musiala anota 69 segundos después de la reanudación; el partido pasa de competitivo a goleada.",
      "88': Havertz completa su doblete y fija el 7-1 que dispara comparaciones digitales con Alemania-Brasil de 2014.",
    ],
    controversies: [
      "El penal del 45+4' terminó de inclinar el partido, aunque las crónicas no registraron una polémica arbitral decisiva.",
      "La conversación debatió si el 7-1 debía leerse como fortaleza alemana o como una desigualdad inevitable entre una potencia y el país más pequeño que ha jugado un Mundial.",
    ],
    statements: [
      "Dick Advocaat había pedido antes del partido: «No estén nerviosos» y aseguró que Curazao intentaría hacerle la vida difícil a Alemania (FOX/AP).",
      "Squawka destacó en X que Curazao, con unos 158.000 habitantes, marcó en su primer partido mundialista ante un tetracampeón.",
      "The Guardian definió el empate de Comenencia como el momento del partido pese al resultado final.",
    ],
    combined: {
      expectativa: { euforia: 68, confianza: 70, ansiedad: 58, frustracion: 24, incertidumbre: 50, optimismo: 72 },
      realidad: { euforia: 82, confianza: 84, ansiedad: 54, frustracion: 38, incertidumbre: 30, optimismo: 82 },
      percepcion: { euforia: 84, confianza: 86, ansiedad: 28, frustracion: 34, incertidumbre: 24, optimismo: 84 },
    },
    teamsData: [
      {
        team: "Alemania",
        expectedEmotion: "Confianza con ansiedad por las eliminaciones en fase de grupos de 2018 y 2022.",
        dominantConversation: "Ganar no bastaba: se esperaba una actuación que confirmara que Alemania volvió a ser candidata.",
        fanConfidence: "Alta ante el rival, pero condicionada por los fantasmas recientes del torneo.",
        mainNarrative: "La potencia que necesitaba eliminar cualquier duda desde el debut.",
        howTheyArrived: "Con enorme favoritismo y presión por evitar otro inicio traumático.",
        whatHappened: "Recibieron el 1-1 histórico, reaccionaron antes del descanso y terminaron repartiendo siete goles.",
        expectationVsReality: "El susto inicial elevó el alivio: la goleada terminó validando profundidad, reacción y contundencia.",
        userExperience: {
          expectativa: "En foros alemanes y r/soccer, el foco no era si Alemania ganaría sino cuánto tardaría en dominar y si el equipo había superado sus fracasos mundialistas recientes.",
          realidad: "El 1-1 activó bromas y ansiedad durante 17 minutos; después, los clips de Musiala, Havertz y los cambios ofensivos desplazaron la conversación hacia la amplitud del plantel.",
          percepcion: "El 7-1 reactivó inevitablemente memes de Brasil 2014. Aun así, parte de la afición mantuvo cautela: golear a Curazao no resuelve cómo responderá Alemania ante rivales de élite.",
        },
        mood: "Alivio, confianza y cautela tras una goleada esperada",
        behaviorEffect: "La goleada reduce el ruido sobre los últimos Mundiales y eleva la expectativa para el duelo con Costa de Marfil.",
        current: { euforia: 88, confianza: 90, ansiedad: 24, frustracion: 16, incertidumbre: 22, optimismo: 88 },
        predicted: { euforia: 78, confianza: 84, ansiedad: 42, frustracion: 24, incertidumbre: 38, optimismo: 84 },
      },
      {
        team: "Curazao",
        expectedEmotion: "Orgullo, asombro y libertad por disputar el primer Mundial de su historia.",
        dominantConversation: "Ser el país más pequeño del torneo y demostrar que el debut tenía valor más allá del marcador.",
        fanConfidence: "Baja para ganar, alta para competir con valentía y producir un momento histórico.",
        mainNarrative: "La isla que ya había ganado visibilidad antes de patear el balón.",
        howTheyArrived: "Con Dick Advocaat emocionado, una diáspora movilizada y nada que perder ante un tetracampeón.",
        whatHappened: "Comenencia empató 1-1 y escribió el primer gol del país; luego la diferencia técnica produjo seis goles más.",
        expectationVsReality: "La derrota fue más amplia de lo deseado, pero el objetivo emocional de dejar una huella se cumplió en el minuto 21.",
        userExperience: {
          expectativa: "La previa digital giró alrededor del tamaño de la isla, la edad récord de Advocaat y el orgullo de la diáspora neerlandesa y caribeña. La clasificación ya funcionaba como celebración identitaria.",
          realidad: "El clip del 1-1 se compartió como una victoria instantánea; en Reddit, usuarios pasaron de la sorpresa a celebrar que Curazao al menos había marcado, incluso mientras crecía la goleada.",
          percepcion: "Las imágenes de Advocaat secándose las lágrimas y de un aficionado reaccionando al séptimo gol convivieron con orgullo. La memoria colectiva se ancló en Comenencia, no en los seis goles de diferencia.",
        },
        mood: "Dolor por la goleada y orgullo intacto por el primer gol",
        behaviorEffect: "La hinchada puede sostener el vínculo si el equipo y los medios encuadran el debut alrededor del hito, sin negar la necesidad de ajustar defensivamente.",
        current: { euforia: 44, confianza: 34, ansiedad: 68, frustracion: 76, incertidumbre: 62, optimismo: 46 },
        predicted: { euforia: 50, confianza: 42, ansiedad: 62, frustracion: 58, incertidumbre: 58, optimismo: 54 },
      },
    ],
    lessons: [
      { term: "Regla pico-fin", explanation: "Curazao recibió siete goles, pero su pico emocional fue el 1-1 histórico. Un momento intenso puede dominar el recuerdo de una experiencia objetivamente adversa." },
      { term: "Efecto de encuadre", explanation: "El mismo 7-1 puede titularse como humillación o como debut con primer gol mundialista. El marco no cambia los datos, pero sí la capacidad de recuperarse." },
      { term: "Adaptación hedónica", explanation: "Alemania pasó rápidamente de celebrar a exigir ocho goles y rivales más fuertes; cuando el éxito se vuelve esperado, cada nuevo logro aporta menos satisfacción." },
    ],
    humanBehavior: "En experiencias asimétricas, cada audiencia usa una métrica distinta: Alemania midió dominio y candidatura; Curazao midió pertenencia, visibilidad y un primer gol. Diseñar una sola definición de éxito habría ignorado a la mitad de la audiencia.",
    cognitiveBiases: ["Regla pico-fin", "Efecto de encuadre", "Adaptación hedónica", "Comparación social con Brasil 2014"],
    emotionalReaction: "Alemania pasó del breve miedo al alivio y luego a la normalización de la goleada. Curazao vivió euforia pura durante el 1-1, seguida de dolor, humor defensivo y orgullo por haber dejado una marca.",
    digitalPatterns: "El 7-1 produjo memes de Brasil 2014 y demanda de un octavo gol; el contenido más compartido de Curazao fue el tanto de Comenencia, las lágrimas de Advocaat y las reacciones de aficionados, señales de identidad antes que de rendimiento.",
    productApplications: [
      { sector: "Producto digital", application: "Define éxito por segmento: el usuario experto y el nuevo no evalúan el mismo recorrido con la misma vara." },
      { sector: "Onboarding", application: "Un primer logro pequeño y visible puede sostener la motivación incluso si el usuario falla después; celebra el hito sin ocultar la fricción." },
      { sector: "Analítica", application: "No resumas una experiencia con una sola métrica agregada. El 7-1 explica el rendimiento, pero no explica por qué Curazao recordará el partido con orgullo." },
    ],
    fanPulse: {
      concerns: ["¿La goleada alemana se sostendrá ante rivales más fuertes?", "¿Cómo se recupera Curazao defensivamente?", "¿Puede el primer gol convertirse en confianza para los siguientes partidos?"],
      emotions: ["Alivio alemán", "Orgullo curazoleño", "Asombro por el 1-1", "Fatiga y frustración durante la goleada"],
      frustrations: ["Curazao concedió dos goles en momentos psicológicos críticos: antes y después del descanso.", "Alemania permitió un empate que reactivó dudas durante el primer tiempo."],
      enthusiasm: ["Primer gol mundialista de Curazao.", "Doblete de Havertz y profundidad ofensiva alemana.", "Celebración de una nación de unos 158.000 habitantes."],
    },
    uxFinding: "Una experiencia no tiene una sola definición de éxito. Reconocer el primer logro del usuario puede preservar orgullo, vínculo y continuidad incluso dentro de un resultado global adverso.",
    aiSummary: "Alemania goleó 7-1 a Curazao con tantos de Nmecha, Schlotterbeck, Havertz (dos), Musiala, Brown y Undav. Comenencia marcó al 21' el primer gol mundialista de Curazao y convirtió un partido desigual en una memoria fundacional. La regla pico-fin y el efecto de encuadre explican por qué Alemania recuerda una demostración de fuerza mientras Curazao conserva orgullo dentro de la derrota. Para productos digitales, la lección es segmentar la definición de éxito y hacer visible el primer logro.",
    imageUrl: "/images/experience-radar/mundial-2026/alemania-curazao.jpg",
    imageAlt: "Alemania y Curazao durante el debut mundialista del conjunto caribeño en Houston",
    imageCredit: "Lars Baron/Getty Images vía The Guardian",
    imageSourceUrl: "https://www.theguardian.com/football/2026/jun/14/germany-curacao-world-cup-match-report",
    sources: [
      { name: "FIFA — Alemania vs Curazao", url: "https://www.fifa.com/en/match-centre/match/17/285023/289273/400021464", kind: "oficial" },
      { name: "ESPN — Alemania 7-1 Curazao", url: "https://www.espn.com/soccer/match/_/gameId/760422/curacao-germany", kind: "referencia" },
      { name: "The Guardian — Alemania 7-1 Curazao", url: "https://www.theguardian.com/football/live/2026/jun/14/germany-v-curacao-world-cup-2026-live", kind: "referencia" },
      { name: "AP — crónica Alemania 7-1 Curazao", url: "https://www.wral.com/news/ap/c6e9f-germany-surges-to-a-3-1-halftime-lead-as-curacao-nets-its-1st-world-cup-goal/", kind: "referencia" },
      { name: "Reddit r/soccer — gol histórico de Comenencia", url: "https://www.reddit.com/r/soccer/comments/1u5r15s/germany_1_1_curacao_l_comenencia_21/", kind: "conversacion" },
      { name: "Reddit r/soccer — reacción de un aficionado de Curazao", url: "https://www.reddit.com/r/soccer/comments/1u5tk4n/a_curacao_fans_reaction_to_germanys_seventh_goal/", kind: "conversacion" },
      { name: "X — conversación sobre el primer gol de Curazao", url: "https://x.com/Squawka", kind: "tendencia" },
    ],
  }),
  finishedMatch({
    date: "2026-06-14",
    kickoffAt: "2026-06-14T20:00:00.000Z",
    slug: "paises-bajos-japon-mundial-2026",
    group: "Grupo F",
    home: "Países Bajos",
    away: "Japón",
    homeGoals: 2,
    awayGoals: 2,
    scoreDetail: "Países Bajos: Virgil van Dijk 51', Crysencio Summerville 64'. Japón: Keito Nakamura 57', Daichi Kamada 89'.",
    seoTitle: "Países Bajos 2-2 Japón: Kamada premia la insistencia japonesa al final",
    hook: "Dos ventajas no alcanzaron: Japón convirtió la persistencia en recuerdo",
    matchSummary: "Países Bajos y Japón empataron 2-2 en Arlington. Van Dijk y Summerville adelantaron dos veces a la Oranje, pero Nakamura y Kamada respondieron; el empate del 89' llegó cuando Japón ya dominaba el tramo final.",
    quickSummary: "Países Bajos se puso dos veces en ventaja, con Van Dijk (51') y Summerville (64'), y Japón contestó con Nakamura (57') y Kamada (89'). El cambio neerlandés a una línea de cinco no protegió el resultado. Para Japón, insistir hasta el cierre convirtió un partido cuesta arriba en una señal de confianza; para la Oranje, el mismo 2-2 quedó asociado a una ventaja desperdiciada.",
    whatHappened: "Tras un primer tiempo prudente, Van Dijk abrió el marcador de cabeza al 51'. Nakamura igualó seis minutos después con un remate desviado y Summerville devolvió la ventaja neerlandesa al 64' con una definición precisa. Japón aumentó la presión, sumó dos delanteros y encontró el 2-2 al 89': Ogawa cabeceó un córner, el balón golpeó en Kamada y superó a Verbruggen. El empate fue coherente con el dominio japonés del último cuarto de hora y castigó el repliegue final de Países Bajos.",
    aiSummary: "Países Bajos y Japón empataron 2-2: Van Dijk y Summerville adelantaron dos veces a la Oranje; Nakamura y Kamada respondieron, el último al 89'. Japón transformó persistencia y ajustes ofensivos en un punto emocionalmente valioso, mientras el repliegue neerlandés reforzó la sensación de pérdida. La aversión a la pérdida, la regla pico-fin y el sesgo de acción explican las lecturas opuestas. En producto, el caso recuerda que cerrar una experiencia exige preservar claridad y control, no solo añadir defensas o pasos al final.",
    uxFinding: "Añadir protección al final no garantiza seguridad: si el cambio reduce la iniciativa y aumenta la presión percibida, puede empeorar justo el momento que más pesa en el recuerdo.",
    keyPlays: [
      "51': Van Dijk cabecea el 1-0 tras asistencia de Ryan Gravenberch.",
      "57': Nakamura empata con un remate que cambia de trayectoria.",
      "64': Summerville marca el 2-1, su primer gol internacional, también asistido por Gravenberch.",
      "89': el cabezazo de Ogawa rebota en Kamada y fija el 2-2.",
    ],
    controversies: [
      "El cambio de Ronald Koeman a una línea de cinco quedó bajo crítica porque Japón empató después y dominó el cierre.",
      "Los dos goles japoneses tuvieron desvíos, pero las crónicas coincidieron en que el empate reflejó el empuje del tramo final.",
    ],
    statements: [
      "The Guardian describió el segundo tiempo como un duelo emocionante y consideró justo el empate por la reacción japonesa.",
      "La crónica destacó que Japón mostró su mejor ataque cuando estuvo por detrás y terminó dominando el último cuarto.",
      "Summerville celebró su primer gol internacional apenas semanas después de debutar con Países Bajos.",
    ],
    combined: {
      expectativa: { euforia: 68, confianza: 70, ansiedad: 52, frustracion: 24, incertidumbre: 50, optimismo: 72 },
      realidad: { euforia: 76, confianza: 62, ansiedad: 74, frustracion: 54, incertidumbre: 68, optimismo: 70 },
      percepcion: { euforia: 68, confianza: 58, ansiedad: 48, frustracion: 58, incertidumbre: 48, optimismo: 66 },
    },
    teamsData: [
      {
        team: "Países Bajos",
        expectedEmotion: "Confianza cauta ante un rival técnicamente fuerte.",
        dominantConversation: "Confirmar que la Oranje podía controlar un grupo exigente desde el debut.",
        fanConfidence: "Alta en el talento, con dudas sobre la gestión de ventajas.",
        mainNarrative: "El favorito que debía imponer jerarquía sin perder control.",
        howTheyArrived: "Con favoritismo estrecho y presión por empezar mandando en el Grupo F.",
        whatHappened: "Se adelantaron dos veces, replegaron al final y concedieron el empate en el 89'.",
        expectationVsReality: "La calidad ofensiva apareció, pero la gestión del cierre quedó por debajo de la expectativa.",
        mood: "Frustración por una ventaja perdida y dudas sobre el cierre",
        behaviorEffect: "La conversación llega al duelo con Suecia enfocada en los cambios, el repliegue y la capacidad de sostener resultados.",
        current: { euforia: 48, confianza: 54, ansiedad: 58, frustracion: 70, incertidumbre: 58, optimismo: 56 },
        predicted: { euforia: 58, confianza: 62, ansiedad: 54, frustracion: 48, incertidumbre: 50, optimismo: 64 },
        userExperience: {
          realidad: "Los clips de Van Dijk y Summerville sostuvieron dos picos de celebración, pero el debate digital cambió tras el ingreso de defensores y el empate tardío.",
          percepcion: "El 2-2 se leyó desde la ventaja perdida: comentarios y crónicas pusieron el foco en la línea de cinco y en la dificultad para cerrar el partido.",
        },
      },
      {
        team: "Japón",
        expectedEmotion: "Ambición prudente y confianza en la estructura colectiva.",
        dominantConversation: "Demostrar que competir de igual a igual con una potencia ya no era sorpresa.",
        fanConfidence: "Moderada-alta por la cohesión y la capacidad de presión.",
        mainNarrative: "El aspirante que podía convertir orden y paciencia en una declaración.",
        howTheyArrived: "Con respeto por la Oranje, pero sin asumir un papel defensivo permanente.",
        whatHappened: "Respondieron dos veces y dominaron el cierre hasta empatar al 89'.",
        expectationVsReality: "La reacción confirmó la expectativa de un equipo resiliente y técnicamente competitivo.",
        mood: "Orgullo y confianza por rescatar dos veces el partido",
        behaviorEffect: "La hinchada llega al cruce con Túnez con mayor participación y una narrativa de persistencia comprobada.",
        current: { euforia: 82, confianza: 80, ansiedad: 34, frustracion: 24, incertidumbre: 36, optimismo: 84 },
        predicted: { euforia: 74, confianza: 78, ansiedad: 42, frustracion: 28, incertidumbre: 40, optimismo: 82 },
        userExperience: {
          realidad: "Cada respuesta japonesa produjo una nueva ola de clips y comentarios; el empuje del último cuarto convirtió el partido en una experiencia de insistencia compartida.",
          percepcion: "El gol fortuito de Kamada se volvió el pico final: el detalle del rebote importó menos que la sensación de que seguir atacando tuvo recompensa.",
        },
      },
    ],
    lessons: [
      { term: "Regla pico-fin", explanation: "El empate del 89' domina el recuerdo: Japón conserva la recompensa final y Países Bajos la pérdida, aunque ambos sumaron lo mismo." },
      { term: "Aversión a la pérdida", explanation: "Para la Oranje, ceder dos ventajas duele más que el valor objetivo de un punto; Japón encuadra ese mismo punto como ganancia." },
      { term: "Sesgo de acción", explanation: "Agregar una línea de cinco pareció una intervención protectora, pero actuar más no equivale a controlar mejor el cierre." },
    ],
    humanBehavior: "Las personas evalúan un empate desde la trayectoria que las llevó hasta él: quien pierde una ventaja siente deterioro; quien alcanza al rival siente progreso.",
    cognitiveBiases: ["Regla pico-fin", "Aversión a la pérdida", "Sesgo de acción"],
    emotionalReaction: "Japón terminó en euforia y validación colectiva; Países Bajos pasó de dos celebraciones a frustración, porque el último evento reescribió el balance emocional.",
    digitalPatterns: "Los goles y el debut goleador de Summerville dominaron primero; después, el empate de Kamada, el rebote y la decisión neerlandesa de replegar concentraron la conversación.",
    productApplications: [
      { sector: "Producto digital", application: "Diseña el cierre como una fase propia: mostrar control, progreso y próximos pasos evita que un buen recorrido termine asociado a pérdida." },
      { sector: "SaaS", application: "No añadas pasos de confirmación solo para parecer más seguro; mide si realmente reducen errores o si trasladan ansiedad al final." },
      { sector: "Servicio", application: "Cuando una recuperación llega tarde, haz visible que la insistencia del usuario produjo resultado; ese reconocimiento amplifica la confianza." },
    ],
    fanPulse: {
      concerns: ["¿Puede Países Bajos sostener una ventaja?", "¿Mantendrá Japón su agresividad desde el inicio?", "¿Qué ajustes dejará el empate para la segunda jornada?"],
      emotions: ["Frustración neerlandesa", "Orgullo japonés", "Ansiedad de un cierre abierto"],
      frustrations: ["Dos ventajas neerlandesas desperdiciadas.", "Un primer tiempo demasiado prudente."],
      enthusiasm: ["La reacción japonesa.", "El primer gol internacional de Summerville.", "Un grupo que queda completamente abierto."],
    },
    sources: [
      { name: "FIFA — calendario y resultados del Mundial 2026", url: "https://www.fifa.com/en/tournaments/mens/worldcup/canadamexicousa2026/scores-fixtures", kind: "oficial" },
      { name: "Associated Press — Japón rescata el 2-2 ante Países Bajos", url: "https://apnews.com/article/world-cup-netherlands-japan-score-d5cb428f3a5f1199345894d44a6bdded", kind: "referencia" },
      { name: "The Guardian — Países Bajos 2-2 Japón", url: "https://www.theguardian.com/football/live/2026/jun/14/netherlands-v-japan-world-cup-2026-live", kind: "referencia" },
      { name: "El País — Países Bajos 2-2 Japón", url: "https://elpais.com/deportes/mundial-futbol/2026-06-14/paises-bajos-japon-en-directo-partido-del-grupo-f-del-mundial-2026-en-vivo.html", kind: "referencia" },
      { name: "SB Nation — los cuatro goles del empate", url: "https://www.sbnation.com/fifa-world-cup/1118493/world-cup-2026-every-goal-from-the-netherlands-japan-thriller", kind: "referencia" },
    ],
    imageUrl: "/images/experience-radar/mundial-2026/paises-bajos-japon.jpg",
    imageAlt: "Virgil van Dijk y Ayase Ueda disputan el balón durante Países Bajos 2-2 Japón",
    imageCredit: "Kai Pfaffenbach/Reuters vía El País",
    imageSourceUrl: "https://elpais.com/deportes/mundial-futbol/2026-06-14/paises-bajos-japon-en-directo-partido-del-grupo-f-del-mundial-2026-en-vivo.html",
  }),
  finishedMatch({
    date: "2026-06-14",
    kickoffAt: "2026-06-14T23:00:00.000Z",
    slug: "costa-de-marfil-ecuador-mundial-2026",
    group: "Grupo E",
    home: "Costa de Marfil",
    away: "Ecuador",
    homeGoals: 1,
    awayGoals: 0,
    scoreDetail: "Costa de Marfil: Amad Diallo 90'. Asistencia: Wilfried Singo.",
    seoTitle: "Costa de Marfil 1-0 Ecuador: Amad convierte el último minuto en un golpe emocional",
    hook: "Un partido de equilibrio terminó definido por el único momento que nadie pudo corregir",
    matchSummary: "Costa de Marfil venció 1-0 a Ecuador en Filadelfia con un gol de Amad Diallo al 90'. Ecuador tuvo más posesión y golpeó dos veces el poste; los marfileños produjeron cuatro remates al arco contra uno y premiaron su insistencia final.",
    quickSummary: "Amad Diallo entró al 56' y marcó al 90' tras una carrera de Wilfried Singo. Ecuador perdió un invicto de 19 partidos y convirtió la falta de definición en la narrativa dominante. En Reddit, el desenlace fue descrito como un golpe al estómago; para Costa de Marfil, la regla pico-fin borró casi todo lo anterior y dejó una memoria de recompensa.",
    whatHappened: "Ecuador controló tramos del primer tiempo y estrelló remates de Alan Minda y Enner Valencia en la madera. Elye Wahi respondió con otro travesaño al 52'. Cuando el empate parecía cerrado, Singo rompió por la derecha y Amad, suplente desde el 56', definió de zurda al 90'. La diferencia no estuvo en el volumen, sino en convertir la última oportunidad disponible.",
    aiSummary: "Costa de Marfil derrotó 1-0 a Ecuador con Amad Diallo al 90'. El partido dejó tres señales: la última acción dominó el recuerdo, Ecuador sufrió más por las ocasiones desperdiciadas que por el equilibrio global y la entrada de Amad validó una intervención tardía. En productos digitales, el cierre y la capacidad de recuperar valor antes de terminar pueden redefinir toda la experiencia.",
    uxFinding: "El último momento útil puede reescribir una experiencia completa: conviene diseñar cierres con capacidad real de recuperación, no tratarlos como un trámite.",
    keyPlays: ["29': Alan Minda remata al travesaño.", "45': Enner Valencia golpea el poste izquierdo.", "52': Elye Wahi estrella otro balón en el travesaño.", "90': Singo rompe por derecha y Amad Diallo define el 1-0."],
    controversies: ["Ecuador reclamó una falta de Guéla Doué en el segundo tiempo; no derivó en una decisión que cambiara el marcador.", "Beccacece consideró injusta la derrota por el desarrollo, aunque reconoció que el fútbol premia convertir las ocasiones."],
    statements: ["Emerse Faé dijo que el gol reflejó una jugada trabajada y celebró la asistencia de Singo y la definición de Amad.", "Sebastián Beccacece afirmó que la derrota dolía y debía fortalecer al equipo para lo que sigue."],
    combined: {
      expectativa: { euforia: 64, confianza: 68, ansiedad: 52, frustracion: 24, incertidumbre: 54, optimismo: 70 },
      realidad: { euforia: 60, confianza: 54, ansiedad: 74, frustracion: 62, incertidumbre: 70, optimismo: 58 },
      percepcion: { euforia: 78, confianza: 72, ansiedad: 40, frustracion: 52, incertidumbre: 42, optimismo: 74 },
    },
    teamsData: [
      {
        team: "Costa de Marfil", expectedEmotion: "Ambición cauta en su regreso al Mundial.", dominantConversation: "Competir por avanzar y confirmar el crecimiento de una generación joven.", fanConfidence: "Moderada, apoyada en velocidad y profundidad ofensiva.", mainNarrative: "Volver después de doce años y demostrar que el equipo puede cerrar partidos.", howTheyArrived: "Con confianza defensiva y un ataque capaz de cambiar desde el banco.", whatHappened: "Resistieron los postes ecuatorianos y ganaron con dos suplentes decisivos en el minuto 90.", expectationVsReality: "La victoria llegó más tarde y con más tensión de la esperada, pero reforzó la idea de profundidad.", mood: "Euforia por una recompensa tardía", behaviorEffect: "El gol instala a Amad como símbolo de soluciones desde el banco y aumenta la confianza antes de Alemania.", current: { euforia: 86, confianza: 80, ansiedad: 30, frustracion: 18, incertidumbre: 32, optimismo: 84 }, predicted: { euforia: 72, confianza: 74, ansiedad: 50, frustracion: 24, incertidumbre: 46, optimismo: 76 },
        userExperience: { realidad: "Los clips del gol concentraron la conversación en la carrera de Singo y en la petición de que Amad sea titular.", percepcion: "Reddit y X encuadraron el 1-0 como recompensa merecida y como prueba de que el banco podía cambiar el partido." },
      },
      {
        team: "Ecuador", expectedEmotion: "Confianza por una larga racha invicta y una defensa estable.", dominantConversation: "Confirmar competitividad y corregir la falta de gol.", fanConfidence: "Alta en la estructura, más baja en la definición.", mainNarrative: "Una selección difícil de vencer que necesitaba convertir control en goles.", howTheyArrived: "Con 19 partidos sin perder y expectativas de puntuar en el debut.", whatHappened: "Golpearon la madera dos veces, no marcaron y concedieron en la última acción decisiva.", expectationVsReality: "El rendimiento pareció suficiente para sumar, pero el marcador convirtió la falta de definición en crisis.", mood: "Dolor y urgencia por una oportunidad perdida", behaviorEffect: "La conversación se desplaza hacia la obligación de marcar varios goles ante Curazao y la presión sobre los atacantes.", current: { euforia: 22, confianza: 46, ansiedad: 72, frustracion: 82, incertidumbre: 62, optimismo: 42 }, predicted: { euforia: 48, confianza: 58, ansiedad: 64, frustracion: 56, incertidumbre: 52, optimismo: 62 },
        userExperience: { realidad: "Los postes y las ocasiones falladas generaron una espera cada vez más tensa; el gol tardío produjo una caída abrupta de ánimo.", percepcion: "En Reddit, la reacción mezcló 'golpe al estómago' con temor a que la falta de gol provoque una eliminación temprana." },
      },
    ],
    lessons: [
      { term: "Regla pico-fin", explanation: "El gol del 90' domina el recuerdo y reduce un partido equilibrado a recompensa para unos y golpe para otros." },
      { term: "Aversión a la pérdida", explanation: "Ecuador no procesa solo una derrota: procesa los postes, el invicto roto y el punto que parecía asegurado." },
      { term: "Sesgo de resultado", explanation: "La misma actuación ecuatoriana habría parecido sólida con 0-0; el último gol hace que se evalúe como fracaso de definición." },
    ],
    matchInterpretations: {
      expectativa: { euforia: "El regreso marfileño y el invicto ecuatoriano sostenían ilusión en ambos lados.", confianza: "Ecuador confiaba en su estructura; Costa de Marfil, en su profundidad.", ansiedad: "El debut elevó la tensión sin un favorito claro.", frustracion: "Todavía baja: ambas hinchadas esperaban un partido cerrado.", incertidumbre: "Alta por el equilibrio previo del Grupo E.", optimismo: "Los dos equipos veían una oportunidad real de sumar." },
      realidad: { euforia: "Los postes generaron picos incompletos hasta la explosión del gol de Amad.", confianza: "La confianza ecuatoriana cayó con cada ocasión fallada; la marfileña creció con los cambios.", ansiedad: "El 0-0 prolongado convirtió cada transición en amenaza.", frustracion: "Ecuador acumuló frustración por no convertir su mejor tramo.", incertidumbre: "Se mantuvo hasta el minuto 90.", optimismo: "Costa de Marfil conservó iniciativa suficiente para buscar una última acción." },
      percepcion: { euforia: "Para Costa de Marfil, todo el partido quedó resumido en la celebración final.", confianza: "Amad y Singo validaron la profundidad del plantel.", ansiedad: "Ecuador sale con presión inmediata por el siguiente partido.", frustracion: "Los postes y el invicto roto amplifican el dolor ecuatoriano.", incertidumbre: "La clasificación ecuatoriana queda más abierta de lo previsto.", optimismo: "Los marfileños leen el triunfo como una base real para competir el grupo." },
    },
    humanBehavior: "Las personas no promedian una experiencia: el último evento de alta intensidad puede reemplazar el balance acumulado.",
    cognitiveBiases: ["Regla pico-fin", "Aversión a la pérdida", "Sesgo de resultado"],
    emotionalReaction: "Costa de Marfil pasó de tensión a euforia instantánea; Ecuador, de aceptar un empate a sentir una pérdida total.",
    digitalPatterns: "El clip del gol desplazó rápidamente los postes y el desarrollo; en Ecuador dominaron preguntas sobre definición y diferencia de gol futura.",
    productApplications: [
      { sector: "Producto digital", application: "Diseñar una recuperación útil antes de cerrar puede cambiar el recuerdo de una sesión con fricción." },
      { sector: "SaaS", application: "El resumen final debe contextualizar el progreso para que un último error no borre todo el valor entregado." },
      { sector: "Servicio", application: "Una solución tardía todavía genera confianza si llega antes de que el usuario abandone y reconoce el esfuerzo previo." },
    ],
    fanPulse: { concerns: ["La falta de gol de Ecuador", "La titularidad de Amad", "El impacto sobre la diferencia de gol"], emotions: ["Euforia tardía", "Dolor ecuatoriano", "Alivio marfileño"], frustrations: ["Dos postes sin recompensa", "Perder en el minuto 90"], enthusiasm: ["La carrera de Singo", "El impacto de Amad desde el banco"] },
    sources: [
      { name: "FIFA — calendario y resultados", url: "https://www.fifa.com/en/tournaments/mens/worldcup/canadamexicousa2026/scores-fixtures", kind: "oficial" },
      { name: "ESPN — Costa de Marfil 1-0 Ecuador", url: "https://www.espn.com/soccer/report/_/gameId/760423", kind: "referencia" },
      { name: "Latingoles — Amad castiga a Ecuador", url: "https://latingoles.com/golpe-al-invicto-marfileno-diallo-castiga-a-ecuatorianos-valencia-minda-y-yeboah/", kind: "referencia" },
      { name: "The Guardian — relato del partido", url: "https://www.theguardian.com/football/live/2026/jun/14/cote-d-ivoire-v-ecuador-world-cup-2026-live", kind: "referencia" },
      { name: "Reddit r/soccer — post-partido", url: "https://www.reddit.com/r/soccer/comments/1u6277d/post_match_thread_ivory_coast_1_0_ecuador_fifa/", kind: "conversacion" },
      { name: "X — reacción al gol de Amad", url: "https://x.com/ManUtd/status/2066424471028711598", kind: "tendencia" },
    ],
    imageUrl: "/images/experience-radar/mundial-2026/costa-de-marfil-ecuador.jpg",
    imageAlt: "Jugadores de Costa de Marfil celebran el gol tardío ante Ecuador",
    imageCredit: "Latingoles",
    imageSourceUrl: "https://latingoles.com/golpe-al-invicto-marfileno-diallo-castiga-a-ecuatorianos-valencia-minda-y-yeboah/",
    analyzedAt: "2026-06-15T13:50:00.000Z",
  }),
  finishedMatch({
    date: "2026-06-14",
    kickoffAt: "2026-06-15T02:00:00.000Z",
    slug: "suecia-tunez-mundial-2026",
    group: "Grupo F",
    home: "Suecia",
    away: "Túnez",
    homeGoals: 5,
    awayGoals: 1,
    scoreDetail: "Suecia: Yasin Ayari 7', 90+6'; Alexander Isak 30'; Viktor Gyökeres 59'; Mattias Svanberg 84'. Túnez: Omar Rekik 43'.",
    seoTitle: "Suecia 5-1 Túnez: Ayari convierte una goleada en validación colectiva",
    hook: "Suecia marcó en una noche más goles que durante toda su clasificación mundialista",
    matchSummary: "Suecia goleó 5-1 a Túnez en Monterrey con doblete de Yasin Ayari y goles de Isak, Gyökeres y Svanberg. Rekik descontó antes del descanso, pero los errores tunecinos y la eficiencia sueca abrieron una diferencia mayor de lo que sugerían la posesión y el xG.",
    quickSummary: "Ayari abrió al 7' y cerró al 90+6'; no celebró el primero por respeto a sus raíces tunecinas. Suecia produjo siete remates al arco y convirtió cinco, mientras Reddit pasó de celebrar el regreso mundialista a preguntar por el techo real del equipo. Túnez quedó atrapada entre errores defensivos, frustración y debate sobre su dirección técnica.",
    whatHappened: "Ayari castigó un rebote al 7' e Isak amplió al 30'. Rekik redujo al 43' y abrió una breve posibilidad de remontada, pero Isak robó y asistió a Gyökeres para el 3-1 al 59'. Svanberg marcó 18 segundos después de entrar al 84', validado por VAR, y Ayari cerró con un remate lejano al 90+6'. Suecia convirtió una noche de bajo margen previo en una demostración de eficacia.",
    aiSummary: "Suecia venció 5-1 a Túnez con doblete de Ayari y goles de Isak, Gyökeres y Svanberg. La goleada reencuadró meses de dudas y produjo prueba social inmediata alrededor del proyecto de Graham Potter. Para Túnez, cada error confirmó la narrativa negativa y amplificó la frustración. La lección de producto es que una secuencia de éxitos visibles puede reconstruir confianza rápidamente, pero también que los fallos encadenados necesitan una interrupción clara antes de convertirse en identidad.",
    uxFinding: "La confianza puede reconstruirse con evidencia visible y acumulativa: cada éxito reduce la carga del anterior fracaso y cambia la expectativa del siguiente paso.",
    keyPlays: ["7': Ayari abre con una volea y evita celebrarlo por sus raíces tunecinas.", "30': Isak marca el 2-0.", "43': Rekik descuenta de cabeza.", "59': Gyökeres convierte tras robo y asistencia de Isak.", "84': Svanberg marca 18 segundos después de entrar; VAR valida.", "90+6': Ayari completa su doblete desde fuera del área."],
    controversies: ["El 4-1 de Svanberg requirió una revisión larga de VAR por posible fuera de juego.", "La magnitud de la derrota reabrió de inmediato el debate sobre la continuidad de Sabri Lamouchi."],
    statements: ["Graham Potter destacó la química entre Isak y Gyökeres, aunque señaló que el equipo todavía podía mejorar.", "Ayari explicó que no celebró su primer gol por respeto a Túnez, país ligado a su familia."],
    combined: { expectativa: { euforia: 56, confianza: 48, ansiedad: 62, frustracion: 44, incertidumbre: 66, optimismo: 58 }, realidad: { euforia: 82, confianza: 78, ansiedad: 48, frustracion: 42, incertidumbre: 42, optimismo: 80 }, percepcion: { euforia: 86, confianza: 84, ansiedad: 30, frustracion: 34, incertidumbre: 30, optimismo: 88 } },
    teamsData: [
      { team: "Suecia", expectedEmotion: "Ilusión prudente tras una clasificación muy difícil.", dominantConversation: "Comprobar si Potter había cambiado realmente al equipo.", fanConfidence: "Moderada y todavía frágil.", mainNarrative: "Volver al Mundial y dejar atrás una clasificación sin victorias.", howTheyArrived: "Por repechaje, con dudas acumuladas y talento ofensivo evidente.", whatHappened: "Marcaron cinco, lideraron el grupo y conectaron a Isak, Gyökeres y Ayari.", expectationVsReality: "La eficacia superó ampliamente la expectativa y convirtió dudas en entusiasmo.", mood: "Euforia y sensación de renacimiento", behaviorEffect: "La hinchada eleva el techo esperado y llega al duelo con Países Bajos buscando confirmación, no supervivencia.", current: { euforia: 92, confianza: 88, ansiedad: 24, frustracion: 12, incertidumbre: 26, optimismo: 92 }, predicted: { euforia: 78, confianza: 82, ansiedad: 44, frustracion: 22, incertidumbre: 40, optimismo: 84 }, userExperience: { realidad: "Los goles sucesivos transformaron el hilo de partido en una celebración de eficacia; el gesto de Ayari añadió una capa emocional compartible.", percepcion: "Reddit destacó que Suecia marcó más en un partido que en toda la clasificación y empezó a discutir cuánto puede avanzar el equipo." } },
      { team: "Túnez", expectedEmotion: "Esperanza de competir desde el orden y aprovechar la presión sueca.", dominantConversation: "Romper el techo histórico de la fase de grupos.", fanConfidence: "Baja-moderada tras cambios recientes de entrenador.", mainNarrative: "Un equipo obligado a ser compacto para sostenerse.", howTheyArrived: "Con dudas tácticas y señales defensivas preocupantes.", whatHappened: "Concedieron temprano, reaccionaron con el 2-1 y volvieron a derrumbarse por errores propios.", expectationVsReality: "La estructura no resistió y la derrota confirmó los temores previos.", mood: "Frustración, vergüenza y búsqueda de responsables", behaviorEffect: "La conversación se concentra en el entrenador, la selección de jugadores y la necesidad de una ruptura antes de enfrentar a Japón.", current: { euforia: 12, confianza: 22, ansiedad: 82, frustracion: 92, incertidumbre: 84, optimismo: 18 }, predicted: { euforia: 24, confianza: 30, ansiedad: 76, frustracion: 74, incertidumbre: 72, optimismo: 32 }, userExperience: { realidad: "El descuento de Rekik produjo una breve recuperación, pero el 3-1 reactivó la sensación de desorden y los últimos goles aceleraron el abandono emocional.", percepcion: "Los comentarios pasaron del análisis del partido a cuestionar la dirección técnica y describir los errores como evitables." } },
    ],
    lessons: [
      { term: "Prueba social", explanation: "Cada gol reforzó la idea de que el cambio sueco era real; la confianza colectiva creció porque todos veían la misma evidencia." },
      { term: "Sesgo de confirmación", explanation: "En Túnez, cada error posterior fue leído como confirmación de una preparación deficiente y no como incidente aislado." },
      { term: "Efecto de contraste", explanation: "La goleada se percibió aún mayor al compararse con una clasificación sueca en la que el equipo apenas había marcado." },
    ],
    matchInterpretations: {
      expectativa: { euforia: "Suecia celebraba volver, pero sin certeza sobre su nivel real.", confianza: "El talento ofensivo sostenía una confianza todavía condicionada.", ansiedad: "La mala clasificación seguía presente en la memoria.", frustracion: "Había cansancio por meses de bajo rendimiento.", incertidumbre: "Potter todavía necesitaba una prueba competitiva.", optimismo: "Isak y Gyökeres daban razones para esperar una mejora." },
      realidad: { euforia: "Los goles sucesivos convirtieron el partido en una liberación colectiva.", confianza: "Cada combinación ofensiva elevó la seguridad sueca.", ansiedad: "El 2-1 abrió una pausa breve; el 3-1 la cerró.", frustracion: "Túnez acumuló frustración con errores que parecían repetirse.", incertidumbre: "El VAR del cuarto gol alargó una duda ya menor sobre el resultado.", optimismo: "Suecia terminó jugando y pensando como líder del grupo." },
      percepcion: { euforia: "La mayor victoria del ciclo se convirtió en símbolo de renacimiento.", confianza: "La conversación ya no pregunta si Suecia compite, sino hasta dónde llega.", ansiedad: "Baja en Suecia y se dispara en Túnez.", frustracion: "La derrota tunecina se interpreta como falla estructural.", incertidumbre: "Túnez entra en crisis de dirección; Suecia reduce sus dudas.", optimismo: "El ataque sueco instala una expectativa alta para el siguiente partido." },
    },
    humanBehavior: "Una cadena de resultados visibles puede cambiar rápidamente la identidad percibida de un grupo; una cadena de errores puede hacer lo mismo en dirección opuesta.",
    cognitiveBiases: ["Prueba social", "Sesgo de confirmación", "Efecto de contraste"],
    emotionalReaction: "Suecia pasó de cautela a euforia acumulativa; Túnez tuvo un breve alivio con el 2-1 antes de caer en frustración y desconexión.",
    digitalPatterns: "Los clips de Ayari, la sociedad Isak-Gyökeres y la cifra de cinco goles dominaron X; Reddit añadió comparaciones con la clasificación y críticas tácticas a Túnez.",
    productApplications: [
      { sector: "Producto digital", application: "Haz visibles pequeños éxitos consecutivos para reconstruir confianza después de un periodo de bajo rendimiento." },
      { sector: "SaaS", application: "Interrumpe una cadena de errores con diagnóstico y recuperación claros antes de que el usuario la convierta en una expectativa permanente." },
      { sector: "Educación", application: "Comparar progreso reciente con el punto de partida correcto puede activar motivación sin inflar promesas." },
    ],
    fanPulse: { concerns: ["La defensa sueca ante rivales superiores", "La continuidad técnica de Túnez", "Si la eficacia se sostendrá"], emotions: ["Euforia sueca", "Respeto por Ayari", "Frustración tunecina"], frustrations: ["Errores defensivos evitables", "Una reacción tunecina demasiado breve"], enthusiasm: ["La dupla Isak-Gyökeres", "El doblete de Ayari", "El liderato del grupo"] },
    sources: [
      { name: "FIFA — Suecia vs Túnez", url: "https://www.fifa.com/en/match-centre/match/17/285023/289273/400021474", kind: "oficial" },
      { name: "Win Sports — Suecia goleó a Túnez", url: "https://www.winsports.co/futbol-internacional/noticias/en-vivo-suecia-vs-tunez-minuto-a-minuto-y-goles-copa-mundial-de-la-fifa-438701", kind: "referencia" },
      { name: "The Guardian — Suecia 5-1 Túnez", url: "https://www.theguardian.com/football/2026/jun/15/sweden-tunisia-world-cup-match-report", kind: "referencia" },
      { name: "Associated Press — doblete de Ayari", url: "https://www.washingtonpost.com/sports/soccer/2026/06/15/world-cup-sweden-tunisia-score/1ab746e8-6871-11f1-830e-133d20cadd28_story.html", kind: "referencia" },
      { name: "Reddit r/soccer — post-partido", url: "https://www.reddit.com/r/soccer/comments/1u65r5e/post_match_thread_sweden_5_1_tunisia_fifa_world/", kind: "conversacion" },
      { name: "X — conversación sobre Ayari", url: "https://x.com/TouchlineX/status/2066345165703545206", kind: "tendencia" },
    ],
    imageUrl: "/images/experience-radar/mundial-2026/suecia-tunez.jpg",
    imageAlt: "Jugadores de Suecia celebran durante la goleada 5-1 ante Túnez",
    imageCredit: "@svenskfotboll vía Win Sports",
    imageSourceUrl: "https://www.winsports.co/futbol-internacional/noticias/en-vivo-suecia-vs-tunez-minuto-a-minuto-y-goles-copa-mundial-de-la-fifa-438701",
    analyzedAt: "2026-06-15T13:51:00.000Z",
  }),
  // 15 jun 2026 (hora ET): España–Cabo Verde 12pm, Bélgica–Egipto 3pm,
  // Arabia Saudita–Uruguay 6pm, Irán–Nueva Zelanda 9pm. Todos dentro del corte de 48h.
  finishedMatch({
    date: "2026-06-15",
    kickoffAt: "2026-06-15T16:00:00.000Z",
    slug: "espana-cabo-verde-mundial-2026",
    group: "Grupo H",
    home: "España",
    away: "Cabo Verde",
    homeGoals: 0,
    awayGoals: 0,
    scoreDetail: "Empate sin goles en Atlanta Stadium. España tuvo cerca del 74% de la posesión; Cabo Verde cerró su debut mundialista con un punto histórico.",
    seoTitle: "España 0-0 Cabo Verde: el control sin gol chocó con un debut sin miedo",
    hook: "Cabo Verde convirtió su primer partido mundialista en una prueba de paciencia para España",
    matchSummary: "España empató 0-0 con Cabo Verde en Atlanta en un partido de posesión española, baja claridad en el área y enorme disciplina defensiva del debutante africano. El 74% de posesión y el volumen territorial no alcanzaron para romper una resistencia que transformó el punto en memoria histórica para Cabo Verde.",
    quickSummary: "Cabo Verde sacó un 0-0 histórico ante España en su estreno absoluto en la Copa del Mundo. Reddit lo leyó como una sorpresa del día y Opta destacó que los africanos concedieron una sola falta pese al dominio español. Para España, la experiencia dejó frustración por control sin premio; para Cabo Verde, una validación inmediata de pertenencia.",
    whatHappened: "España instaló el partido en campo rival y administró la pelota durante casi todo el encuentro, pero la circulación encontró pocas ventajas limpias en el último tercio. Cabo Verde defendió con una concentración extraordinaria, rebajó la fricción, concedió muy poco desorden y convirtió cada despeje y cada pausa en una reafirmación colectiva. El marcador terminó haciendo visible una tensión frecuente en producto: tener el control del flujo no garantiza producir valor percibido.",
    aiSummary: "España empató 0-0 con Cabo Verde en Atlanta y dejó una lectura emocional asimétrica: el favorito sintió pérdida de eficacia pese al dominio, mientras el debutante convirtió el punto en un hito de identidad. La conversación digital premió la disciplina defensiva de Cabo Verde y cuestionó la falta de profundidad española. La lección para producto es clara: controlar la interfaz o el proceso no basta si el usuario no obtiene una resolución visible; en cambio, una experiencia ordenada y resistente puede sentirse como victoria aunque el volumen objetivo sea menor.",
    uxFinding: "El control sin resolución genera frustración más rápido que la inferioridad asumida: si no conviertes dominio en progreso visible, la percepción se vuelve adversa.",
    keyPlays: ["Cabo Verde sostuvo el 0-0 durante los 90 minutos en su primer partido mundialista.", "España dominó la posesión y el territorio, pero no transformó esa ventaja en gol.", "La defensa caboverdiana cerró espacios y convirtió cada minuto sobrevivido en una señal de confianza."],
    controversies: ["La frustración española se concentró más en la falta de profundidad que en decisiones arbitrales puntuales.", "El debate digital giró sobre si España administró demasiado y aceleró demasiado poco en el último tercio."],
    statements: ["La reseña oficial de FIFA encuadró el resultado como una actuación extraordinaria de Cabo Verde ante una potencia global.", "El resumen del día de FIFA presentó el empate como uno de los grandes golpes narrativos de la jornada."],
    combined: {
      expectativa: { euforia: 68, confianza: 72, ansiedad: 42, frustracion: 18, incertidumbre: 38, optimismo: 74 },
      realidad: { euforia: 54, confianza: 52, ansiedad: 60, frustracion: 58, incertidumbre: 50, optimismo: 56 },
      percepcion: { euforia: 72, confianza: 62, ansiedad: 40, frustracion: 48, incertidumbre: 38, optimismo: 68 },
    },
    teamsData: [
      {
        team: "España",
        expectedEmotion: "Confianza alta con presión por empezar mandando.",
        dominantConversation: "Confirmar jerarquía y evitar un debut trabado.",
        fanConfidence: "Alta por plantel, baja tolerancia al tropiezo.",
        mainNarrative: "La favorita que debía transformar posesión en autoridad real.",
        howTheyArrived: "Como campeona europea y con margen teórico amplio ante un debutante.",
        whatHappened: "Tuvieron la pelota, pero no abrieron una defensa compacta ni generaron una secuencia final convincente.",
        expectationVsReality: "El dominio territorial se sintió insuficiente porque no produjo gol ni sensación de control total.",
        mood: "Frustración contenida y debate sobre profundidad",
        behaviorEffect: "La conversación se mueve hacia ajustes ofensivos y hacia la exigencia de convertir control en amenaza real en la siguiente jornada.",
        current: { euforia: 34, confianza: 56, ansiedad: 58, frustracion: 72, incertidumbre: 50, optimismo: 52 },
        predicted: { euforia: 56, confianza: 66, ansiedad: 48, frustracion: 42, incertidumbre: 42, optimismo: 64 },
        userExperience: {
          realidad: "Cada posesión larga sin remate claro elevó la sensación de atasco; la experiencia fue de expectativa acumulada sin recompensa.",
          percepcion: "El 0-0 cambió la lectura del control: dejó de verse como autoridad y empezó a verse como ineficacia.",
        },
      },
      {
        team: "Cabo Verde",
        expectedEmotion: "Orgullo, curiosidad global y nervio competitivo.",
        dominantConversation: "Sobrevivir al estreno y demostrar que el escenario no les quedaba grande.",
        fanConfidence: "Moderada, apoyada en disciplina y en el valor simbólico del debut.",
        mainNarrative: "El debutante que podía convertir orden y valentía en una afirmación histórica.",
        howTheyArrived: "Sin experiencia mundialista, pero con una oportunidad única de definir identidad ante millones.",
        whatHappened: "Defendieron con foco, redujeron faltas y sostuvieron un empate que se sintió como conquista.",
        expectationVsReality: "La realidad superó la expectativa: no solo compitieron, también frenaron a un favorito sin perder la calma.",
        mood: "Orgullo eufórico y sensación de legitimidad",
        behaviorEffect: "La hinchada pasa del relato del debut al relato de la competitividad; el siguiente partido ya no se mira solo como experiencia, sino como posibilidad.",
        current: { euforia: 92, confianza: 84, ansiedad: 22, frustracion: 10, incertidumbre: 28, optimismo: 90 },
        predicted: { euforia: 76, confianza: 78, ansiedad: 42, frustracion: 18, incertidumbre: 40, optimismo: 82 },
        userExperience: {
          realidad: "Cada despeje y cada tramo sin conceder gol reforzaron la sensación de hazaña en tiempo real.",
          percepcion: "El punto se volvió evidencia de pertenencia: la conversación dejó de celebrar solo el debut y empezó a respetar el rendimiento.",
        },
      },
    ],
    lessons: [
      { term: "Sesgo de resultado", explanation: "El dominio español se reevalúa a la baja porque el 0-0 borra buena parte de su control territorial." },
      { term: "Punto de referencia", explanation: "El mismo empate vale poco para España y muchísimo para Cabo Verde porque ambos llegan con expectativas opuestas." },
      { term: "Prueba social", explanation: "La cascada de reacciones sobre el hito caboverdiano convirtió el punto en una validación colectiva casi instantánea." },
    ],
    matchInterpretations: {
      expectativa: { euforia: "España esperaba una entrada limpia al torneo; Cabo Verde vivía el partido como un umbral histórico.", confianza: "La confianza estaba del lado español; Cabo Verde la construía desde la disciplina.", ansiedad: "La ansiedad era mayor en el debutante, aunque la presión competitiva pesaba más sobre España.", frustracion: "Todavía baja antes del inicio.", incertidumbre: "La gran duda era si Cabo Verde resistiría el contexto del estreno.", optimismo: "Ambas hinchadas encontraban razones distintas para ilusionarse." },
      realidad: { euforia: "España no encontró picos sostenidos; Cabo Verde transformó cada resistencia en microcelebración.", confianza: "La confianza española cayó al no romper el bloque; la caboverdiana creció con cada tramo superado.", ansiedad: "Subió en España al correr el reloj y bajó en Cabo Verde a medida que el plan funcionó.", frustracion: "La falta de gol volvió espesa la experiencia española.", incertidumbre: "El 0-0 prolongado hizo que el partido se sintiera cada vez más abierto a una sorpresa.", optimismo: "Cabo Verde encontró optimismo en la consistencia defensiva más que en el volumen ofensivo." },
      percepcion: { euforia: "El recuerdo pertenece a Cabo Verde, que convirtió el empate en una gesta.", confianza: "España conserva confianza estructural, pero ya no invulnerabilidad simbólica.", ansiedad: "España sale con urgencia de corregir; Cabo Verde reduce parte del nervio inicial.", frustracion: "La frustración española domina el análisis posterior del favorito.", incertidumbre: "El grupo se percibe más abierto tras el resultado.", optimismo: "Cabo Verde sale con optimismo de pertenencia real; España, con optimismo condicionado a ajustes." },
    },
    humanBehavior: "Las personas no valoran un resultado solo por el marcador, sino por la distancia entre lo esperado y lo vivido.",
    cognitiveBiases: ["Sesgo de resultado", "Punto de referencia", "Prueba social"],
    emotionalReaction: "España pasó de seguridad a impaciencia; Cabo Verde transformó la tensión del debut en orgullo expansivo.",
    digitalPatterns: "Reddit celebró la sorpresa y Opta amplificó la disciplina caboverdiana; la conversación sobre España se movió hacia posesión sin filo y necesidad de ajuste.",
    productApplications: [
      { sector: "Producto digital", application: "No confundas actividad o permanencia con valor entregado: si el usuario no ve resolución, el control del flujo no alcanza." },
      { sector: "SaaS", application: "Cuando un proceso largo no produce un cierre visible, conviene mostrar avances concretos o una intervención que cambie la percepción de estancamiento." },
      { sector: "Educación", application: "Contextualizar un empate o un progreso intermedio según el punto de partida ayuda a que la evaluación sea más justa y motivadora." },
    ],
    fanPulse: { concerns: ["La falta de profundidad de España", "Si Cabo Verde puede repetir la disciplina defensiva", "Cómo cambia el grupo tras el empate"], emotions: ["Orgullo caboverdiano", "Frustración española", "Sorpresa general"], frustrations: ["Control español sin gol", "Pocas ventajas limpias en el área"], enthusiasm: ["El primer punto mundialista de Cabo Verde", "La resistencia defensiva", "Un grupo que se abre temprano"] },
    sources: [
      { name: "FIFA — España 0-0 Cabo Verde", url: "https://www.fifa.com/en/tournaments/mens/worldcup/canadamexicousa2026/articles/spain-cabo-verde-highlights-match-report", kind: "oficial" },
      { name: "FIFA — resumen de la jornada 5", url: "https://www.fifa.com/en/tournaments/mens/worldcup/canadamexicousa2026/articles/matchday-5-round-up-review-highlights", kind: "oficial" },
      { name: "Reddit r/soccer — post-partido", url: "https://www.reddit.com/r/soccer/comments/1u6o1wx/post_match_thread_spain_0_0_cape_verde_fifa_world/", kind: "conversacion" },
      { name: "Reddit r/soccer — dato de Opta sobre Cabo Verde", url: "https://www.reddit.com/r/soccer/comments/1u6ogon/1_despite_spain_having_74_possession_cabo_verde/", kind: "conversacion" },
    ],
    imageUrl: "/images/experience-radar/mundial-2026/espana-cabo-verde.jpg",
    imageAlt: "España y Cabo Verde disputan el balón durante el empate 0-0 en Atlanta",
    imageCredit: "Latingoles",
    imageSourceUrl: "https://latingoles.com/0-0-espana-revive-fantasmas-del-mundial/",
    previewImageUrl: "/images/experience-radar/mundial-2026/espana-cabo-verde-previa.jpg",
    previewImageAlt: "Luis de la Fuente en la previa de España ante Cabo Verde",
    previewImageCredit: "Latingoles",
    previewImageSourceUrl: "https://latingoles.com/no-arrancan-espanoles-yamal-williams-y-munoz-esperan-su-turno-ante-cabo-verde/",
    analyzedAt: "2026-06-16T10:22:00.000Z",
  }),
  finishedMatch({
    date: "2026-06-15",
    kickoffAt: "2026-06-15T19:00:00.000Z",
    slug: "belgica-egipto-mundial-2026",
    group: "Grupo G",
    home: "Bélgica",
    away: "Egipto",
    homeGoals: 1,
    awayGoals: 1,
    scoreDetail: "Egipto: Emam Ashour 19'. Bélgica: autogol de Mohamed Hany 66', forzado tras la entrada de Romelu Lukaku.",
    seoTitle: "Bélgica 1-1 Egipto: Lukaku cambió el tono, no el veredicto completo",
    hook: "Un cambio de treinta segundos modificó la emoción del partido sin borrar la sensación de oportunidad perdida",
    matchSummary: "Bélgica empató 1-1 con Egipto en Seattle. Emam Ashour adelantó a los egipcios al 19' y la entrada de Romelu Lukaku alteró el partido de inmediato: a los pocos segundos, la presión belga terminó en el autogol de Mohamed Hany para el 1-1. Egipto dejó escapar una posible primera victoria mundialista; Bélgica evitó el daño mayor, pero no disipó sus dudas.",
    quickSummary: "Ashour puso a Egipto por delante y Lukaku, recién ingresado, desató el empate casi instantáneo que terminó registrado como autogol de Mohamed Hany. Reddit y X giraron alrededor del impacto inmediato del cambio y de otra tarde en la que Bélgica necesitó reaccionar desde atrás. La memoria emocional quedó partida: alivio belga y dolor egipcio por una victoria histórica que estuvo cerca.",
    whatHappened: "Egipto aprovechó mejor su claridad inicial y encontró ventaja con Emam Ashour. Bélgica controló más volumen y mejoró su amenaza cuando Lukaku entró desde el banco: la presión sobre el área y el rebote emocional del cambio alteraron el partido en segundos. Aun así, el empate no limpió por completo la sensación de rigidez belga ni la percepción egipcia de haber dejado escapar una oportunidad enorme.",
    aiSummary: "Bélgica y Egipto empataron 1-1 en Seattle después de un partido que cambió de tono con una sola sustitución. Egipto abrió con Emam Ashour y estuvo cerca de su primera victoria mundialista, pero la entrada de Romelu Lukaku produjo un empate casi inmediato, registrado como autogol de Mohamed Hany. La conversación digital quedó dividida entre el impacto del cambio y la oportunidad histórica perdida. La lección de producto es que una intervención tardía puede rescatar la experiencia, pero no siempre corrige la percepción acumulada de rigidez o de oportunidad desperdiciada.",
    uxFinding: "Una intervención correcta en el momento justo puede salvar el flujo, pero si llega tarde no borra del todo la fricción ya acumulada.",
    keyPlays: ["19': Emam Ashour adelanta a Egipto.", "Lukaku entra desde el banco y Bélgica empata casi de inmediato.", "El 1-1 final deja a ambos con la sensación de que el partido pudo inclinarse del todo."],
    controversies: ["La decisión de no iniciar con Lukaku concentró parte de la crítica inmediata a Bélgica.", "El empate fue leído por parte de la conversación como reacción salvadora y por otra como síntoma de dependencia tardía."],
    statements: ["FIFA destacó que la llegada de Lukaku ayudó a Bélgica a rescatar el empate.", "El hilo post-partido en Reddit condensó la lectura del encuentro en dos ideas: reacción belga y oportunidad histórica egipcia perdida."],
    combined: {
      expectativa: { euforia: 62, confianza: 64, ansiedad: 50, frustracion: 24, incertidumbre: 48, optimismo: 66 },
      realidad: { euforia: 60, confianza: 54, ansiedad: 66, frustracion: 56, incertidumbre: 58, optimismo: 58 },
      percepcion: { euforia: 58, confianza: 56, ansiedad: 48, frustracion: 60, incertidumbre: 50, optimismo: 60 },
    },
    teamsData: [
      {
        team: "Bélgica",
        expectedEmotion: "Confianza exigente y poca paciencia con un mal inicio.",
        dominantConversation: "Demostrar que la etiqueta histórica no pesa más que el presente.",
        fanConfidence: "Moderada-alta en el talento, frágil en la continuidad.",
        mainNarrative: "El favorito que necesita confirmarse sin volver a quedar atrapado en su propia reputación.",
        howTheyArrived: "Con veteranos ilustres, nombres de élite y obligación de mandar el grupo.",
        whatHappened: "Concedieron primero, mejoraron con Lukaku y rescataron un empate que supo a respuesta incompleta.",
        expectationVsReality: "El cambio funcionó, pero la actuación no alcanzó para disipar las dudas de fondo.",
        mood: "Alivio parcial y discusión táctica",
        behaviorEffect: "La conversación belga se concentra en alineación inicial, dependencia de Lukaku y necesidad de acelerar antes el siguiente partido.",
        current: { euforia: 44, confianza: 58, ansiedad: 56, frustracion: 64, incertidumbre: 54, optimismo: 56 },
        predicted: { euforia: 60, confianza: 68, ansiedad: 48, frustracion: 40, incertidumbre: 44, optimismo: 66 },
        userExperience: {
          realidad: "El ingreso de Lukaku produjo un pico inmediato de esperanza y alivio, pero el resto del flujo siguió sintiéndose irregular.",
          percepcion: "La narrativa final no fue 'Bélgica remontó', sino 'Bélgica volvió a necesitar una corrección tardía'.",
        },
      },
      {
        team: "Egipto",
        expectedEmotion: "Ilusión prudente por competir de igual a igual y acercarse a una victoria histórica.",
        dominantConversation: "Romper por fin la barrera de la primera victoria mundialista.",
        fanConfidence: "Moderada, apoyada en Salah, Marmoush y una estructura defensiva fiable.",
        mainNarrative: "La selección que podía convertir orden y ambición en una afirmación internacional.",
        howTheyArrived: "Con identidad defensiva y la sensación de que un debut serio podía alterar el grupo.",
        whatHappened: "Se adelantaron, gestionaron bien tramos del partido y vieron cómo el empate llegaba justo después de un cambio rival decisivo.",
        expectationVsReality: "El rendimiento validó la competitividad egipcia, pero el desenlace dejó dolor por lo que estuvo al alcance.",
        mood: "Orgullo herido y sensación de ocasión perdida",
        behaviorEffect: "La hinchada sale más convencida de que el equipo puede competir, aunque con el duelo interior de haber dejado escapar una ventana histórica.",
        current: { euforia: 52, confianza: 66, ansiedad: 46, frustracion: 72, incertidumbre: 48, optimismo: 68 },
        predicted: { euforia: 64, confianza: 70, ansiedad: 42, frustracion: 44, incertidumbre: 40, optimismo: 72 },
        userExperience: {
          realidad: "El gol de Ashour abrió una experiencia de posibilidad real; el empate inmediato después del ingreso de Lukaku produjo una caída emocional muy brusca.",
          percepcion: "El 1-1 se recuerda menos como punto ganado que como victoria histórica que pasó demasiado cerca.",
        },
      },
    ],
    lessons: [
      { term: "Regla pico-fin", explanation: "El impacto inmediato de Lukaku y el desenlace 1-1 dominan el recuerdo por encima del resto del desarrollo." },
      { term: "Aversión a la pérdida", explanation: "Egipto procesa más la victoria que se escapó que el valor objetivo del punto conseguido." },
      { term: "Efecto halo", explanation: "La entrada de una figura puede reorganizar en segundos la percepción de amenaza y de control." },
    ],
    matchInterpretations: {
      expectativa: { euforia: "Bélgica esperaba empezar desde la jerarquía; Egipto veía una oportunidad rara pero posible.", confianza: "La confianza belga estaba anclada al talento; la egipcia, a la estructura.", ansiedad: "Ambas hinchadas sentían el debut como prueba identitaria.", frustracion: "Aún baja al inicio.", incertidumbre: "Persistía la duda sobre cuánto peso tendría el relato histórico en el rendimiento real.", optimismo: "Había optimismo en ambos lados, con escalas distintas." },
      realidad: { euforia: "Egipto vivió el pico inicial con Ashour; Bélgica lo recuperó con el efecto Lukaku.", confianza: "La confianza cambió de manos con rapidez a partir de los goles.", ansiedad: "El tramo posterior al 1-1 mantuvo la tensión abierta.", frustracion: "Bélgica frustró su propio arranque; Egipto frustró el cierre del resultado.", incertidumbre: "El empate dejó a ambos sin veredicto pleno.", optimismo: "El punto deja argumentos positivos y dudas simultáneas en cada selección." },
      percepcion: { euforia: "La euforia quedó rebajada por la ausencia de un ganador claro.", confianza: "Egipto sale reforzado en competitividad; Bélgica mantiene crédito, pero no tranquilidad.", ansiedad: "Bélgica conserva presión; Egipto la transforma en ambición para lo siguiente.", frustracion: "La mayor frustración pertenece a Egipto por la cercanía del hito.", incertidumbre: "El grupo queda más abierto de lo previsto.", optimismo: "Ambos encuentran razones para creer, aunque Egipto siente más premio moral que Bélgica." },
    },
    humanBehavior: "Una sola intervención visible puede cambiar el tono emocional de una experiencia, aunque no siempre reescriba por completo la evaluación final.",
    cognitiveBiases: ["Regla pico-fin", "Aversión a la pérdida", "Efecto halo"],
    emotionalReaction: "Bélgica salió del borde del daño con alivio; Egipto pasó del orgullo expansivo al dolor por una recompensa incompleta.",
    digitalPatterns: "X se concentró en el impacto inmediato de Lukaku y en el autogol forzado; Reddit sostuvo el debate sobre alineaciones, dependencia de figuras y ocasión egipcia perdida.",
    productApplications: [
      { sector: "Producto digital", application: "Un cambio relevante bien temporizado puede rescatar la sesión, pero conviene detectar antes la fricción para no depender siempre de una intervención de emergencia." },
      { sector: "SaaS", application: "Las funciones estrella no deberían ser el único camino de recuperación; diseña resiliencia desde el flujo principal." },
      { sector: "Servicio", application: "Cuando el usuario estuvo cerca de conseguir un logro grande, reconoce explícitamente ese avance para evitar que el cierre se sienta solo como pérdida." },
    ],
    fanPulse: { concerns: ["La dependencia belga de Lukaku", "Cómo sostener la competitividad egipcia", "La apertura real del Grupo G"], emotions: ["Alivio belga", "Dolor egipcio", "Respeto por Ashour"], frustrations: ["Un arranque belga poco fluido", "La victoria egipcia que no se cerró"], enthusiasm: ["El impacto instantáneo de Lukaku", "La competitividad egipcia", "Un grupo sin jerarquías claras"] },
    sources: [
      { name: "FIFA — Bélgica 1-1 Egipto", url: "https://www.fifa.com/en/tournaments/mens/worldcup/canadamexicousa2026/articles/belgium-egypt-highlights-match-report", kind: "oficial" },
      { name: "FIFA — resumen de la jornada 5", url: "https://www.fifa.com/en/tournaments/mens/worldcup/canadamexicousa2026/articles/matchday-5-round-up-review-highlights", kind: "oficial" },
      { name: "Reddit r/soccer — post-partido", url: "https://www.reddit.com/r/soccer/comments/1u6t67u/postmatch_thread_belgium_11_egypt_fifa_world_cup/", kind: "conversacion" },
      { name: "X — Lukaku provoca el empate al instante", url: "https://x.com/OptaAnalyst/status/2066627130197164096", kind: "tendencia" },
    ],
    imageUrl: "/images/experience-radar/mundial-2026/belgica-egipto.jpg",
    imageAlt: "Bélgica y Egipto disputan el balón durante el empate 1-1 en Seattle",
    imageCredit: "CiberCuba",
    imageSourceUrl: "https://www.cibercuba.com/noticias/2026-06-16-u1-e199854-s27066-nid332375-belgica-egipto-empatan-1-1-debut-mundial-2026",
    previewImageUrl: "/images/experience-radar/mundial-2026/belgica-egipto.png",
    previewImageAlt: "Vista previa del Bélgica vs Egipto en Lumen Field",
    previewImageCredit: "Seattle Sounders FC",
    previewImageSourceUrl: "https://www.soundersfc.com/news/belvegy-101-preview-all-you-need-to-know-when-belgium-faces-egypt-in-fifa-world-cup-2026tm-at-lumen-field",
    analyzedAt: "2026-06-16T10:31:00.000Z",
  }),
  finishedMatch({
    date: "2026-06-15",
    kickoffAt: "2026-06-15T22:00:00.000Z",
    slug: "arabia-saudita-uruguay-mundial-2026",
    group: "Grupo H",
    home: "Arabia Saudita",
    away: "Uruguay",
    homeGoals: 1,
    awayGoals: 1,
    scoreDetail: "Arabia Saudita: Abdulelah Al Amri 41'. Uruguay: Maximiliano Araújo 80'.",
    seoTitle: "Arabia Saudita 1-1 Uruguay: la logística pesó, pero el cierre definió la memoria",
    hook: "Uruguay volvió desde una noche incómoda y Arabia Saudita convirtió la disciplina en amenaza real",
    matchSummary: "Arabia Saudita y Uruguay empataron 1-1 en Miami. Abdulelah Al Amri adelantó a los saudíes al 41' y Maximiliano Araújo igualó al 80' para una Celeste que llegó al debut marcada por un viaje alterado y un arranque trabado. Arabia Saudita convirtió su orden en ventaja; Uruguay rescató el punto sin borrar del todo la sensación de preparación fragmentada.",
    quickSummary: "Al Amri abrió el marcador en la primera parte y Maxi Araújo empató a diez minutos del final. En X y Reddit, el partido se leyó como una mezcla de reacción uruguaya y validación saudí: el favorito evitó la caída, pero no escapó de las dudas sobre arranque y funcionamiento. La percepción final dejó alivio para Uruguay y orgullo competitivo para Arabia Saudita.",
    whatHappened: "Uruguay tardó en asentarse y Arabia Saudita aprovechó mejor la primera mitad para convertir orden defensivo y balón parado en ventaja. La Celeste mejoró con el paso de los minutos y terminó encontrando el empate mediante Maxi Araújo, pero el 1-1 no consiguió borrar la sensación de que la logística previa y el arranque espeso sí tuvieron un costo emocional y competitivo. Arabia Saudita, en cambio, salió validada por haber sostenido el plan frente a una selección de mayor cartel.",
    aiSummary: "Arabia Saudita y Uruguay empataron 1-1 en Miami con goles de Abdulelah Al Amri y Maximiliano Araújo. El partido dejó dos lecturas complementarias: Arabia Saudita confirmó que podía competir desde el orden y Uruguay recuperó el punto, aunque sin disipar la sospecha de que su preparación alterada le restó claridad al inicio. La lección de producto es que la experiencia empieza antes del momento principal: si la logística falla, el sistema debe compensar rápido o el usuario llega ya desgastado al núcleo del servicio.",
    uxFinding: "La experiencia no arranca en el evento principal: si el sistema falla antes, el usuario llega emocionalmente degradado y necesita una recuperación visible.",
    keyPlays: ["41': Abdulelah Al Amri marca el 1-0 para Arabia Saudita.", "Uruguay necesita corregir desde el descanso tras un primer tiempo incómodo.", "80': Maximiliano Araújo encuentra el 1-1 y evita la derrota celeste."],
    controversies: ["El debate posterior se centró en cuánto influyó realmente la preparación alterada de Uruguay.", "La lectura sobre Bielsa quedó partida entre quienes vieron reacción suficiente y quienes vieron un equipo demasiado dependiente del ajuste tardío."],
    statements: ["FIFA resumió el partido como un empate rescatado por Uruguay gracias al gol tardío de Maxi Araújo.", "La conversación pública subrayó que Arabia Saudita hizo pagar el mal arranque uruguayo y que la Celeste solo corrigió parcialmente a tiempo."],
    combined: {
      expectativa: { euforia: 58, confianza: 60, ansiedad: 64, frustracion: 30, incertidumbre: 62, optimismo: 60 },
      realidad: { euforia: 56, confianza: 54, ansiedad: 68, frustracion: 58, incertidumbre: 62, optimismo: 56 },
      percepcion: { euforia: 60, confianza: 58, ansiedad: 44, frustracion: 52, incertidumbre: 50, optimismo: 62 },
    },
    teamsData: [
      {
        team: "Arabia Saudita",
        expectedEmotion: "Cautela ambiciosa ante un rival de mayor jerarquía percibida.",
        dominantConversation: "Convertir preparación corta y orden táctico en una prueba de credibilidad.",
        fanConfidence: "Moderada, sostenida por disciplina más que por favoritismo.",
        mainNarrative: "El equipo que podía castigar cualquier desconexión del favorito.",
        howTheyArrived: "Con menos tiempo de trabajo, pero con una oportunidad clara de explotar el contexto previo de Uruguay.",
        whatHappened: "Tomaron ventaja, sostuvieron largos tramos y dejaron la sensación de que el empate pudo ser incluso algo menos de lo merecido.",
        expectationVsReality: "La actuación validó que el plan y la concentración eran suficientes para competir el partido.",
        mood: "Orgullo competitivo con un matiz de oportunidad perdida",
        behaviorEffect: "La hinchada saudí sale con mayor confianza en el proyecto y con expectativa real sobre su capacidad de puntuar otra vez.",
        current: { euforia: 72, confianza: 70, ansiedad: 34, frustracion: 48, incertidumbre: 42, optimismo: 74 },
        predicted: { euforia: 66, confianza: 68, ansiedad: 44, frustracion: 34, incertidumbre: 40, optimismo: 72 },
        userExperience: {
          realidad: "El gol de Al Amri convirtió una previa de resistencia en una experiencia de posibilidad real y visible.",
          percepcion: "El empate dejó un doble registro: satisfacción por competir y la sensación de que el triunfo estuvo al alcance.",
        },
      },
      {
        team: "Uruguay",
        expectedEmotion: "Confianza con irritación previa por una logística que rompió el ritmo.",
        dominantConversation: "Demostrar que el ruido previo no alteraría la autoridad competitiva.",
        fanConfidence: "Alta en nombres y entrenador, más frágil en el estado emocional del debut.",
        mainNarrative: "La Celeste debía imponer oficio incluso en un contexto adverso.",
        howTheyArrived: "Con una preparación perturbada por retrasos y con señales públicas de incomodidad.",
        whatHappened: "Encajaron primero, necesitaron corregir sobre la marcha y solo rescataron el empate en el tramo final.",
        expectationVsReality: "El punto evita el golpe, pero no cumple con la expectativa de autoridad que acompañaba al equipo.",
        mood: "Alivio incompleto y revisión interna",
        behaviorEffect: "La conversación uruguaya se mueve hacia el coste real del arranque, la gestión de Bielsa y la necesidad de entrar mejor desde el primer minuto.",
        current: { euforia: 42, confianza: 56, ansiedad: 58, frustracion: 66, incertidumbre: 56, optimismo: 54 },
        predicted: { euforia: 60, confianza: 68, ansiedad: 48, frustracion: 40, incertidumbre: 44, optimismo: 66 },
        userExperience: {
          realidad: "El partido se sintió cuesta arriba desde antes del pitazo y el 1-0 saudí convirtió esa percepción en algo tangible.",
          percepcion: "El empate de Araújo alivió el daño, pero no desmontó la idea de una noche administrada por debajo de lo esperado.",
        },
      },
    ],
    lessons: [
      { term: "Primacía", explanation: "El mal arranque uruguayo condicionó la lectura de todo el partido, incluso después del empate." },
      { term: "Aversión a la incertidumbre", explanation: "Las fricciones previas amplificaron la necesidad de señales rápidas de control y afectaron la tolerancia al error." },
      { term: "Regla pico-fin", explanation: "El gol tardío de Araújo suaviza la memoria uruguaya, mientras Arabia Saudita recuerda más el haber competido que el empate en sí." },
    ],
    matchInterpretations: {
      expectativa: { euforia: "Arabia Saudita veía una oportunidad; Uruguay, una obligación incómoda.", confianza: "La confianza uruguaya seguía alta, aunque rozada por la previa; la saudí dependía del orden.", ansiedad: "La ansiedad estaba más del lado celeste por el ruido logístico.", frustracion: "Ya existía una base de irritación uruguaya antes de jugar.", incertidumbre: "La preparación alterada aumentó la sensación de partido abierto.", optimismo: "Ambas selecciones veían opciones, por razones distintas." },
      realidad: { euforia: "El 1-0 saudí transformó cautela en entusiasmo; Uruguay solo recuperó ese tono al final.", confianza: "Arabia Saudita ganó seguridad con el partido vivo; Uruguay tardó en recuperar la suya.", ansiedad: "La ansiedad celeste creció mientras el empate no aparecía.", frustracion: "Uruguay acumuló frustración por el arranque y la falta de claridad.", incertidumbre: "El partido nunca se sintió del todo estabilizado.", optimismo: "El empate tardío devolvió a Uruguay una salida emocional menos dura." },
      percepcion: { euforia: "No hay euforia plena, pero sí una fuerte validación saudí.", confianza: "Uruguay mantiene crédito, aunque con más preguntas que certezas.", ansiedad: "La Celeste sale con menos margen emocional; Arabia Saudita reduce su ansiedad para la siguiente fecha.", frustracion: "Uruguay lamenta no haber impuesto jerarquía; Arabia Saudita lamenta no haber cerrado un golpe mayor.", incertidumbre: "El grupo gana imprevisibilidad.", optimismo: "Ambos encuentran combustible: uno desde la corrección, el otro desde la confirmación." },
    },
    humanBehavior: "Las fricciones previas no desaparecen al comenzar la experiencia principal: muchas veces reconfiguran cómo se interpreta cada minuto posterior.",
    cognitiveBiases: ["Primacía", "Aversión a la incertidumbre", "Regla pico-fin"],
    emotionalReaction: "Arabia Saudita pasó de prudencia a validación; Uruguay del fastidio previo al alivio parcial.",
    digitalPatterns: "X impulsó el empate de Araújo como rescate tardío; Reddit mantuvo más peso en la discusión sobre la preparación uruguaya, el plan saudí y el valor simbólico del punto.",
    productApplications: [
      { sector: "Producto digital", application: "Cuando hay una falla previa al flujo principal, muestra recuperación y contexto de inmediato para que el usuario no llegue desgastado al momento clave." },
      { sector: "SaaS", application: "El onboarding o la autenticación son parte del producto, no un prefacio: si fallan, contaminan la evaluación del resto." },
      { sector: "Servicios en vivo", application: "Una corrección tardía ayuda, pero conviene acompañarla con visibilidad de causa e impacto para reconstruir confianza completa." },
    ],
    fanPulse: { concerns: ["El arranque de Uruguay", "Si Arabia Saudita puede sostener este nivel", "Cuánto pesó la preparación previa"], emotions: ["Alivio celeste", "Orgullo saudí", "Tensión persistente"], frustrations: ["La falta de claridad inicial de Uruguay", "No haber cerrado el triunfo saudí"], enthusiasm: ["El impacto de Al Amri", "La reacción de Araújo", "Un grupo que no se ordena por jerarquía"] },
    sources: [
      { name: "FIFA — Arabia Saudita 1-1 Uruguay", url: "https://www.fifa.com/en/tournaments/mens/worldcup/canadamexicousa2026/articles/saudi-arabia-uruguay-highlights-match-report", kind: "oficial" },
      { name: "The Guardian — retraso del viaje uruguayo", url: "https://www.theguardian.com/football/2026/jun/15/uruguay-delayed-by-plane-paperwork-as-world-cup-travel-challenges-continue", kind: "referencia" },
      { name: "Reddit r/soccer — post-partido", url: "https://www.reddit.com/r/soccer/comments/1u6xuvb/post_match_thread_saudi_arabia_1_1_uruguay_fifa/", kind: "conversacion" },
      { name: "X — Maxi Araújo empata para Uruguay", url: "https://x.com/brfootball/status/2066671435741806851", kind: "tendencia" },
    ],
    imageUrl: "/images/experience-radar/mundial-2026/arabia-saudita-uruguay.jpg",
    imageAlt: "Maxi Araújo celebra el empate de Uruguay ante Arabia Saudita en Miami",
    imageCredit: "Carmen Mandato/FIFA/Getty Images vía The Guardian",
    imageSourceUrl: "https://www.theguardian.com/football/2026/jun/16/saudi-arabia-uruguay-world-cup-match-report",
    previewImageUrl: "/images/experience-radar/mundial-2026/arabia-saudita-uruguay-previa.jpg",
    previewImageAlt: "Jugadores de Uruguay en la previa del debut ante Arabia Saudita",
    previewImageCredit: "Latingoles",
    previewImageSourceUrl: "https://latingoles.com/celeste-en-alerta-uruguayos-valverde-nunez-y-araujo-retan-al-saudi-al-dawsari/",
    analyzedAt: "2026-06-16T10:39:00.000Z",
  }),
  finishedMatch({
    date: "2026-06-15",
    kickoffAt: "2026-06-16T01:00:00.000Z",
    slug: "iran-nueva-zelanda-mundial-2026",
    group: "Grupo G",
    home: "Irán",
    away: "Nueva Zelanda",
    homeGoals: 2,
    awayGoals: 2,
    // Grupo G, jornada 2 (fixture oficial): Irán→Bélgica (21 jun), Nueva Zelanda→Egipto.
    nextOpponents: { "Irán": "Bélgica", "Nueva Zelanda": "Egipto" },
    scoreDetail: "Nueva Zelanda: Elijah Just 7', 54'. Irán: Ramin Rezaeian 32', Mohammad Mohebi 64'.",
    seoTitle: "Irán 2-2 Nueva Zelanda: dos remontadas parciales y una identidad en disputa",
    hook: "Nueva Zelanda golpeó dos veces; Irán respondió dos veces y dejó el partido más vibrante del cierre del día",
    matchSummary: "Irán empató 2-2 con Nueva Zelanda en Los Ángeles en un partido abierto y emocional. Elijah Just marcó al 7' y al 54' para los oceánicos; Ramin Rezaeian igualó antes del descanso y Mohammad Mohebi firmó el 2-2 al 64'. Nueva Zelanda volvió a quedarse sin su primera victoria mundialista, mientras Irán convirtió la resiliencia en el principal aprendizaje competitivo de la noche.",
    quickSummary: "Elijah Just adelantó dos veces a Nueva Zelanda, pero Irán respondió con goles de Rezaeian y Mohebi. Reddit definió el cierre de la jornada como uno de los mejores partidos hasta ahora y X elevó el segundo empate iraní a momento de alto voltaje. La experiencia quedó marcada por una doble lectura: frustración neozelandesa por no cerrar y alivio iraní por responder pese al contexto pesado de la previa.",
    whatHappened: "Nueva Zelanda atacó con claridad vertical y golpeó pronto con Elijah Just tras asistencia de Chris Wood. Irán respondió con carácter y calidad para llegar al 1-1 antes del descanso, pero volvió a quedar abajo al 54'. El segundo empate, con centro de Rezaeian y cabezazo de Mohebi, reforzó la lectura del partido como una batalla de persistencia y oportunidad incompleta: Nueva Zelanda sintió que dejó escapar su puerta histórica; Irán, que evitó un daño mayor sin resolver del todo sus vulnerabilidades defensivas.",
    aiSummary: "Irán y Nueva Zelanda empataron 2-2 en el cierre de la jornada 5 con un partido de alta energía y dos remontadas parciales iraníes. Elijah Just marcó dos veces para los neozelandeses; Ramin Rezaeian y Mohammad Mohebi sostuvieron la respuesta asiática. La conversación digital lo elevó como uno de los partidos más entretenidos del torneo hasta ahora. La lección de producto es que, cuando el contexto externo ya llega cargado de tensión, separar capas de información y ofrecer señales rápidas de recuperación ayuda a evitar que el usuario sienta que todo el sistema está fuera de control.",
    uxFinding: "Cuando el contexto externo ya carga ansiedad, la recuperación visible importa más que la perfección: el usuario necesita señales claras de que todavía hay salida.",
    keyPlays: ["7': Elijah Just adelanta a Nueva Zelanda tras asistencia de Chris Wood.", "32': Ramin Rezaeian iguala para Irán antes del descanso.", "54': Just firma su doblete y devuelve la ventaja oceánica.", "64': Mohammad Mohebi cabecea el 2-2 con asistencia de Rezaeian."],
    controversies: ["La sensación posterior en Nueva Zelanda fue de oportunidad histórica perdida más que de simple punto sumado.", "En Irán, parte del análisis separó el alivio del resultado de la preocupación por las dos ventajas concedidas."],
    statements: ["FIFA resumió el partido como un empate en el que Irán negó a Nueva Zelanda su primera victoria mundialista.", "La conversación deportiva en X y Reddit resaltó el partido como uno de los más entretenidos del día por el intercambio de golpes y el ritmo emocional."],
    combined: {
      expectativa: { euforia: 52, confianza: 56, ansiedad: 74, frustracion: 42, incertidumbre: 72, optimismo: 58 },
      realidad: { euforia: 68, confianza: 60, ansiedad: 72, frustracion: 56, incertidumbre: 62, optimismo: 64 },
      percepcion: { euforia: 64, confianza: 62, ansiedad: 46, frustracion: 54, incertidumbre: 48, optimismo: 66 },
    },
    teamsData: [
      {
        team: "Irán",
        expectedEmotion: "Tensión alta por el contexto previo y necesidad de sostener foco competitivo.",
        dominantConversation: "Separar el ruido externo del rendimiento en cancha.",
        fanConfidence: "Moderada, apoyada en Taremi y en la experiencia de competir bajo presión.",
        mainNarrative: "El equipo que debía demostrar que podía responder incluso en un entorno emocionalmente denso.",
        howTheyArrived: "Con logística compleja, tensión política alrededor y sensación de experiencia menos liviana de lo habitual.",
        whatHappened: "Quedaron abajo dos veces, respondieron dos veces y usaron la resiliencia como argumento principal.",
        expectationVsReality: "No resolvieron todas sus grietas, pero sí validaron capacidad de reacción cuando el partido amenazó con romperse.",
        mood: "Alivio combativo y atención a las fragilidades",
        behaviorEffect: "La hinchada iraní sale menos temerosa del colapso, aunque con exigencia de corregir la defensa para sostenerse en el grupo.",
        current: { euforia: 62, confianza: 64, ansiedad: 48, frustracion: 50, incertidumbre: 46, optimismo: 68 },
        predicted: { euforia: 64, confianza: 68, ansiedad: 46, frustracion: 38, incertidumbre: 40, optimismo: 70 },
        userExperience: {
          realidad: "Cada empate devolvió sensación de oxígeno y control mínimo en un contexto ya saturado por tensión externa.",
          percepcion: "El 2-2 no se lee como exhibición, sino como prueba de resistencia útil para seguir en pie.",
        },
      },
      {
        team: "Nueva Zelanda",
        expectedEmotion: "Ilusión rara y deseo de convertir el regreso al Mundial en una declaración.",
        dominantConversation: "Acercarse por fin a una victoria histórica.",
        fanConfidence: "Moderada, reforzada por Chris Wood y por una generación cohesionada.",
        mainNarrative: "La selección que podía transformar un escenario poco frecuente en una noche fundacional.",
        howTheyArrived: "Con menos cartel que Irán, pero con una estructura capaz de castigar espacios y transiciones.",
        whatHappened: "Se adelantaron dos veces con Elijah Just y no consiguieron sostener ninguna de las dos ventajas.",
        expectationVsReality: "El rendimiento confirma competitividad real, pero el resultado deja dolor por la puerta histórica que siguió cerrada.",
        mood: "Orgullo mezclado con frustración",
        behaviorEffect: "La hinchada neozelandesa sale convencida de que el equipo puede competir, aunque con una sensación punzante de oportunidad desaprovechada.",
        current: { euforia: 58, confianza: 68, ansiedad: 42, frustracion: 70, incertidumbre: 46, optimismo: 72 },
        predicted: { euforia: 62, confianza: 70, ansiedad: 40, frustracion: 44, incertidumbre: 38, optimismo: 74 },
        userExperience: {
          realidad: "Cada ventaja amplificó la sensación de que la historia estaba al alcance; cada empate iraní produjo una caída emocional inmediata.",
          percepcion: "El 2-2 deja orgullo por el partido y una herida clara por no haber sostenido el golpe dos veces.",
        },
      },
    ],
    lessons: [
      { term: "Aversión a la pérdida", explanation: "Nueva Zelanda siente más el triunfo que se escapó que el valor objetivo del punto obtenido." },
      { term: "Resiliencia percibida", explanation: "Irán refuerza identidad no por dominar, sino por demostrar que puede responder bajo presión repetida." },
      { term: "Disponibilidad", explanation: "Los dos empates iraníes, por su intensidad y cercanía visual, dominan el recuerdo posterior del partido." },
    ],
    matchInterpretations: {
      expectativa: { euforia: "Nueva Zelanda veía una ocasión rara; Irán necesitaba convertir tensión en concentración.", confianza: "La confianza estaba repartida y condicionada por el contexto.", ansiedad: "La ansiedad era alta por razones distintas: contexto en Irán, oportunidad histórica en Nueva Zelanda.", frustracion: "Había temor previo a que factores externos contaminaran el juego.", incertidumbre: "El partido se percibía abierto y delicado.", optimismo: "Ambos equipos encontraban una puerta real hacia un debut positivo." },
      realidad: { euforia: "Los goles de Just y las respuestas iraníes produjeron cuatro olas emocionales muy claras.", confianza: "La confianza cambió de manos cada vez que se modificó el marcador.", ansiedad: "El partido vivió en ansiedad casi continua porque ninguna ventaja pareció estable.", frustracion: "Nueva Zelanda acumuló frustración al no sostener ninguna renta; Irán al conceder dos veces.", incertidumbre: "La sensación de descontrol parcial hizo del partido un intercambio abierto.", optimismo: "Cada respuesta devolvió optimismo al equipo que estaba abajo." },
      percepcion: { euforia: "La euforia queda limitada por la falta de victoria, pero el partido gana prestigio emocional.", confianza: "Irán sale validado en resiliencia; Nueva Zelanda en competitividad.", ansiedad: "Ambas hinchadas reducen ansiedad extrema, aunque conservan preguntas defensivas.", frustracion: "La mayor frustración recae en Nueva Zelanda por el hito que no llegó.", incertidumbre: "El grupo permanece muy abierto tras el empate.", optimismo: "Los dos equipos salen creyendo más en sus posibilidades que antes del inicio." },
    },
    humanBehavior: "Cuando una experiencia ya viene cargada de tensión, la capacidad de recuperación visible pesa más en la evaluación que la ausencia total de errores.",
    cognitiveBiases: ["Aversión a la pérdida", "Resiliencia percibida", "Disponibilidad"],
    emotionalReaction: "Irán pasó del nervio al alivio sostenido; Nueva Zelanda del sueño repetido a la frustración por no cerrarlo.",
    digitalPatterns: "Reddit elevó el partido como uno de los mejores de la jornada y X convirtió el 2-2 iraní en un momento de alta circulación; el doblete de Elijah Just también ganó visibilidad propia.",
    productApplications: [
      { sector: "Producto digital", application: "En contextos tensos, muestra recuperaciones y estados confirmados con claridad: la sensación de salida disponible reduce la angustia acumulada." },
      { sector: "SaaS", application: "No prometas estabilidad absoluta cuando el entorno es volátil; diseña respuestas rápidas y visibles ante quiebres parciales." },
      { sector: "Medios en vivo", application: "Separar hechos, contexto y actualización de estado ayuda a que una experiencia cargada no se perciba como puro caos." },
    ],
    fanPulse: { concerns: ["La defensa iraní ante ataques directos", "La gestión neozelandesa de las ventajas", "Cómo se reordena el Grupo G"], emotions: ["Alivio iraní", "Frustración neozelandesa", "Entusiasmo neutral por el partidazo"], frustrations: ["Dos ventajas neozelandesas perdidas", "Las facilidades defensivas de Irán"], enthusiasm: ["El doblete de Elijah Just", "La reacción de Rezaeian y Mohebi", "El mejor cierre emocional del día"] },
    sources: [
      { name: "FIFA — Irán 2-2 Nueva Zelanda", url: "https://www.fifa.com/en/tournaments/mens/worldcup/canadamexicousa2026/articles/ir-iran-new-zealand-highlights-match-report", kind: "oficial" },
      { name: "The Guardian — llegada y contexto de Irán", url: "https://www.theguardian.com/football/2026/jun/15/iran-world-cup-mehdi-taremi-amir-ghalenoei-fifa-tension-peace-deal", kind: "referencia" },
      { name: "Reddit r/soccer — post-partido", url: "https://www.reddit.com/r/soccer/comments/1u71qrn/post_match_thread_iran_2_2_new_zealand_fifa_world/", kind: "conversacion" },
      { name: "X — Gol Bezan siguió el empate de Irán", url: "https://x.com/GolBezan", kind: "tendencia" },
    ],
    imageUrl: "/images/experience-radar/mundial-2026/iran-nueva-zelanda.jpg",
    imageAlt: "Irán y Nueva Zelanda durante el empate 2-2 en Los Ángeles",
    imageCredit: "EFE/Omar Alonso vía Latingoles",
    imageSourceUrl: "https://latingoles.com/partido-de-resistencia-neozelandes-just-e-iranies-rezaeian-y-mohebi-firman-empate-mundialista/",
    previewImageUrl: "/images/experience-radar/mundial-2026/iran-nueva-zelanda-previa.jpg",
    previewImageAlt: "Aficionados iraníes arropan a Irán en la previa del debut ante Nueva Zelanda",
    previewImageCredit: "Latingoles",
    previewImageSourceUrl: "https://latingoles.com/despedida-mundialista-iranies-arropan-a-iran-en-tijuana-antes-del-debut-ante-nueva-zelanda/",
    analyzedAt: "2026-06-16T10:48:00.000Z",
  }),
  analyzedUpcomingMatch({
    date: "2026-06-16",
    kickoffAt: "2026-06-16T19:00:00.000Z",
    slug: "francia-senegal-mundial-2026",
    teams: ["Francia", "Senegal"],
    group: "Grupo I",
    seoTitle: "Francia vs Senegal: previa, figuras y radar emocional del debut en el Grupo I",
    hook: "El estreno francés enfrenta poder de plantilla y una memoria senegalesa que no llega a intimidarse",
    quickSummary: "Francia debuta ante Senegal en New York/New Jersey Stadium en un cruce que mezcla jerarquía de plantel, paciencia pedida por Warren Zaïre-Emery y Youssouf Koné, y la capacidad senegalesa de competir sin complejo frente a selecciones de primera línea. La previa se mueve entre expectativa de autoridad francesa y respeto por un rival que no acepta el papel de comparsa.",
    whatHappened: "La conversación previa no se limita a Mbappé o al favoritismo francés. FIFA empujó una lectura de paciencia y madurez competitiva desde voces del propio grupo, mientras la previa general del día presentó el partido como uno de los focos del inicio de la jornada 6. Para Senegal, el reto es resistir la narrativa de jerarquía ajena; para Francia, demostrar control sin sobreactuar presión.",
    uxFinding: "Cuando una marca favorita enfrenta un retador con identidad propia, la experiencia mejora si separa expectativa pública de evidencia real en lugar de asumir superioridad automática.",
    keyPlays: ["14:00 Bogotá / 15:00 ET: inicio en New York/New Jersey Stadium.", "Francia abre su participación en el Grupo I.", "La previa oficial insiste en paciencia y control emocional para el estreno francés."],
    statements: ["FIFA destacó declaraciones de Warren Zaïre-Emery y Youssouf Koné sobre la necesidad de paciencia en el debut.", "La previa global de la jornada 6 de FIFA ubica este cruce como uno de los grandes focos del día."],
    sources: [
      { name: "FIFA — previa Francia vs Senegal", url: "https://www.fifa.com/en/tournaments/mens/worldcup/canadamexicousa2026/articles/france-senegal-preview-live-stream-team-news-tickets", kind: "oficial" },
      { name: "FIFA — Zaïre-Emery y Koné hablan de paciencia", url: "https://www.fifa.com/en/tournaments/mens/worldcup/canadamexicousa2026/articles/zaire-emery-kone-france-preview-senegal", kind: "oficial" },
      { name: "FIFA — previa de la jornada 6", url: "https://www.fifa.com/en/tournaments/mens/worldcup/canadamexicousa2026/articles/matchday-6-preview-2026", kind: "oficial" },
    ],
    imageUrl: "/images/experience-radar/mundial-2026/francia-senegal.jpg",
    imageAlt: "Jugadores de Francia celebran antes del debut ante Senegal",
    imageCredit: "Sports Illustrated",
    imageSourceUrl: "https://www.si.com/soccer/france-2026-world-cup-preview",
    emotionalRadar: { euforia: 74, confianza: 72, ansiedad: 44, frustracion: 18, incertidumbre: 46, optimismo: 76 },
    analyzedAt: "2026-06-16T09:52:00.000Z",
  }),
  analyzedUpcomingMatch({
    date: "2026-06-16",
    kickoffAt: "2026-06-16T22:00:00.000Z",
    slug: "iraq-noruega-mundial-2026",
    teams: ["Irak", "Noruega"],
    group: "Grupo I",
    seoTitle: "Irak vs Noruega: previa, Haaland y radar emocional del Grupo I",
    hook: "El regreso iraquí al gran escenario choca con una Noruega que llega convertida en vehículo de expectativa alrededor de Haaland",
    quickSummary: "Irak y Noruega se enfrentan en Boston en un duelo de expectativas asimétricas. FIFA presenta el partido como una batalla del Grupo I y la conversación paralela gira alrededor del debut mundialista de Erling Haaland, mientras Irak intenta que el relato no sea solo el de su rival, sino el de un retorno competitivo con identidad propia.",
    whatHappened: "La previa combina dos intensidades distintas: Noruega concentra atención masiva por Haaland y por el volumen simbólico de su regreso mundialista; Irak busca desplazar la mirada desde la celebridad rival hacia su propia narrativa de pertenencia. Cuando una conversación nace tan inclinada hacia una figura, la experiencia del otro lado depende de encontrar señales tempranas de dignidad competitiva.",
    uxFinding: "Si una audiencia llega atraída por una sola figura, el diseño debe abrir espacio para que el resto de actores también construyan significado desde el primer minuto.",
    keyPlays: ["17:00 Bogotá / 18:00 ET: inicio en Boston.", "Haaland concentra gran parte de la conversación previa sobre Noruega.", "Irak abre su ruta en el Grupo I intentando competir también por relato, no solo por resultado."],
    statements: ["La previa oficial de FIFA encuadra el duelo como una batalla abierta del Grupo I.", "Latingoles subraya el foco sobre Haaland en el debut noruego ante Irak."],
    sources: [
      { name: "FIFA — previa Irak vs Noruega", url: "https://www.fifa.com/en/tournaments/mens/worldcup/canadamexicousa2026/articles/iraq-norway-live-stream-team-news-tickets", kind: "oficial" },
      { name: "FIFA — previa de la jornada 6", url: "https://www.fifa.com/en/tournaments/mens/worldcup/canadamexicousa2026/articles/matchday-6-preview-2026", kind: "oficial" },
      { name: "Latingoles — Haaland entra en escena ante Irak", url: "https://latingoles.com/haaland-entra-en-escena-en-su-debut-mundialista-ante-irak/", kind: "referencia" },
    ],
    imageUrl: "/images/experience-radar/mundial-2026/irak-noruega.jpg",
    imageAlt: "Erling Haaland en la previa del debut de Noruega frente a Irak",
    imageCredit: "Latingoles",
    imageSourceUrl: "https://latingoles.com/haaland-entra-en-escena-en-su-debut-mundialista-ante-irak/",
    emotionalRadar: { euforia: 72, confianza: 68, ansiedad: 50, frustracion: 20, incertidumbre: 52, optimismo: 74 },
    analyzedAt: "2026-06-16T10:07:00.000Z",
  }),
  analyzedUpcomingMatch({
    date: "2026-06-16",
    kickoffAt: "2026-06-17T01:00:00.000Z",
    slug: "argentina-argelia-mundial-2026",
    teams: ["Argentina", "Argelia"],
    group: "Grupo J",
    seoTitle: "Argentina vs Argelia: previa, Messi y radar emocional del estreno en el Grupo J",
    hook: "Argentina abre su Mundial entre el arrastre global de Messi y una Argelia que quiere convertir la atención ajena en oportunidad propia",
    quickSummary: "Argentina debuta ante Argelia en Kansas City en un partido que FIFA sitúa entre los focos centrales de la jornada 6. La conversación pública se inclina hacia Messi y la jerarquía campeona, mientras Argelia intenta entrar al escenario sin aceptar el rol de simple telón de fondo. La previa exige distinguir magnetismo global de superioridad automática.",
    whatHappened: "El partido llega envuelto en una lógica conocida: una selección campeona y una figura total concentran el volumen emocional de la previa. Pero esa concentración también crea una oportunidad para el rival, que puede ganar relevancia si convierte cualquier tramo competitivo en una historia de interrupción del guion esperado. Para producto, es un caso claro de atención desbalanceada y redistribución potencial del interés en tiempo real.",
    uxFinding: "Cuando una experiencia está dominada por una marca o figura total, conviene diseñar puntos de entrada que permitan al resto del sistema ganar atención si la narrativa empieza a cambiar.",
    keyPlays: ["20:00 Bogotá / 21:00 ET: inicio en Kansas City Stadium.", "Argentina abre su ruta en el Grupo J con Messi como centro gravitacional de la conversación.", "FIFA incluye el partido entre los principales focos de la jornada 6."],
    statements: ["La previa oficial de FIFA presenta el encuentro con foco en transmisión, contexto y arranque de grupo.", "Latingoles enfatiza el pulso emocional argentino a través de Messi, Martínez y Álvarez antes del cruce con Argelia."],
    sources: [
      { name: "FIFA — previa Argentina vs Argelia", url: "https://www.fifa.com/en/tournaments/mens/worldcup/canadamexicousa2026/articles/argentina-algeria-preview-live-stream-team-news-tickets", kind: "oficial" },
      { name: "FIFA — previa de la jornada 6", url: "https://www.fifa.com/en/tournaments/mens/worldcup/canadamexicousa2026/articles/matchday-6-preview-2026", kind: "oficial" },
      { name: "Latingoles — Messi, Martínez y Álvarez marcan el pulso", url: "https://latingoles.com/alerta-campeon-argentinos-messi-martinez-y-alvarez-marcan-el-pulso-de-argentina-ante-argelia/", kind: "referencia" },
    ],
    imageUrl: "/images/experience-radar/mundial-2026/argentina-argelia.jpg",
    imageAlt: "Jugadores de Argentina en la previa del debut frente a Argelia",
    imageCredit: "Latingoles",
    imageSourceUrl: "https://latingoles.com/alerta-campeon-argentinos-messi-martinez-y-alvarez-marcan-el-pulso-de-argentina-ante-argelia/",
    emotionalRadar: { euforia: 80, confianza: 78, ansiedad: 38, frustracion: 14, incertidumbre: 42, optimismo: 82 },
    analyzedAt: "2026-06-16T10:16:00.000Z",
  }),
  upcomingMatch({
    date: "2026-06-16",
    kickoffAt: "2026-06-17T04:00:00.000Z",
    slug: "austria-jordania-mundial-2026",
    teams: ["Austria", "Jordania"],
    group: "Grupo J",
    officialUrl: "https://www.fifa.com/en/tournaments/mens/worldcup/canadamexicousa2026/scores-fixtures",
  }),
  finishedMatch({
    date: "2026-06-17",
    kickoffAt: "2026-06-17T23:00:00.000Z",
    slug: "ghana-panama-mundial-2026",
    group: "Grupo L",
    home: "Ghana",
    away: "Panama",
    homeGoals: 1,
    awayGoals: 0,
    scoreDetail: "Ghana: Caleb Yirenkyi 90+5'.",
    seoTitle: "Ghana 1-0 Panama: Yirenkyi rompio el cero al 90+5 y cambio el Grupo L",
    hook: "Ghana sobrevivio al partido mas trabado de la noche y encontro en el ultimo suspiro el gol que deja a Panama sin margen de error.",
    matchSummary: "Ghana vencio 1-0 a Panama en Toronto con un gol de Caleb Yirenkyi al 90+5'. El partido tuvo pocas ocasiones limpias y se resolvio cuando parecia cerrado en empate.",
    quickSummary: "Ghana 1-0 Panama: el cierre parecia escrito para un punto gris, pero un ultimo cruce de area transformo el relato completo del Grupo L.",
    whatHappened: "Panama empezo mejor y exigio pronto a Lawrence Ati-Zigi, pero el partido fue perdiendo claridad a medida que avanzaron la lluvia, los roces y la tension. Ghana sostuvo el tramo incomodo, ajusto mejor el desgaste y encontro su premio cuando Brandon Thomas-Asante envio un servicio que Caleb Yirenkyi empujo en el 90+5'. Ese gol no solo resolvio el marcador: altero toda la lectura emocional. Lo que para Panama ya parecia resistencia util, para Ghana se convirtio en afirmacion tardia y en una victoria que la deja a la altura de Inglaterra.",
    aiSummary: "Ghana derroto 1-0 a Panama con un gol de Caleb Yirenkyi en el 90+5'. Experience Radar lee el partido como una prueba extrema de paciencia competitiva: cuando nadie domina, el equipo que mejor tolera el desgaste emocional suele apropiarse del momento final.",
    uxFinding: "En experiencias largas y tensas, el usuario no recuerda tanto la cantidad de intentos como quien convierte la ultima ventana util en una senal definitiva.",
    keyPlays: ["9': Ati-Zigi evita el gol panameno en el mejor arranque de Los Canaleros.", "45': Ghana pierde a Ati-Zigi y reajusta su estructura tras el descanso.", "90+5': Caleb Yirenkyi empuja el centro de Brandon Thomas-Asante para el 1-0.", "90+12': Panama lanza su ultimo envio al area, pero no encuentra el empate."],
    controversies: ["El partido se corto varias veces por faltas y ritmo trabado, lo que elevo la frustracion panamena en el cierre.", "Panama quedo bajo critica por no capitalizar su mejor tramo antes del gol decisivo."],
    statements: ["FIFA registro el 90+5' de Caleb Yirenkyi como el gol que aseguro la victoria de Ghana.", "The Guardian describio el cruce como un partido de pocas ocasiones definido en el descuento.", "Latingoles remarco el golpe amargo para Panama por haber estado tan cerca del empate."],
    combined: {
      expectativa: { euforia: 60, confianza: 58, ansiedad: 56, frustracion: 26, incertidumbre: 60, optimismo: 62 },
      realidad: { euforia: 68, confianza: 54, ansiedad: 74, frustracion: 48, incertidumbre: 66, optimismo: 64 },
      percepcion: { euforia: 76, confianza: 70, ansiedad: 28, frustracion: 40, incertidumbre: 42, optimismo: 74 },
    },
    teamsData: [
      {
        team: "Ghana",
        expectedEmotion: "Necesidad de empezar con puntos para no dejar todo el peso del grupo al duelo con Inglaterra.",
        dominantConversation: "Orden, energia fisica y capacidad de sostener el plan si el partido se hacia espeso.",
        fanConfidence: "Alta tras ganar un partido que parecia escaparse del control tradicional.",
        mainNarrative: "La seleccion que aguanto la friccion hasta convertir el ultimo minuto en pertenencia.",
        howTheyArrived: "Con respeto por el grupo y la urgencia de no regalar el debut frente a un rival directo.",
        whatHappened: "No brillo durante largos tramos, pero resistio el momento panameno y golpeo en la ultima jugada util.",
        expectationVsReality: "La expectativa era una victoria trabajada; la realidad fue una prueba de paciencia aun mas extrema.",
        mood: "Alivio euforico.",
        behaviorEffect: "La hinchada ghanesa cambia de la incomodidad por el tramite a la celebracion de un gol que sabe a punto de inflexion.",
        current: { euforia: 84, confianza: 76, ansiedad: 26, frustracion: 18, incertidumbre: 34, optimismo: 82 },
        predicted: { euforia: 64, confianza: 62, ansiedad: 48, frustracion: 26, incertidumbre: 52, optimismo: 66 },
        userExperience: {
          realidad: "La experiencia digital de Ghana paso de revisar faltas y cortes a viralizar el 90+5' como prueba de caracter competitivo.",
          percepcion: "En X, el nombre de Yirenkyi y la idea de victoria agonica dominaron el relato inmediato.",
        },
      },
      {
        team: "Panama",
        expectedEmotion: "Tension competitiva con la necesidad de puntuar ante un rival del mismo escalon.",
        dominantConversation: "Aprovechar los tramos de control y no regalar detalles en un partido de margen corto.",
        fanConfidence: "Media-baja tras una derrota que llego cuando el empate ya parecia asegurado.",
        mainNarrative: "El equipo que tuvo el partido a distancia de un punto y lo perdio en el ultimo cruce.",
        howTheyArrived: "Con la ilusion de raspar un resultado util antes de medirse con Croacia.",
        whatHappened: "Empezo con mejores sintomas, pero fue perdiendo filo y termino castigado en el peor momento posible.",
        expectationVsReality: "La expectativa era competir de igual a igual; la realidad deja la sensacion de oportunidad desprendida de las manos.",
        mood: "Frustracion seca.",
        behaviorEffect: "La aficion panamena gira rapido hacia reproches por no haber aprovechado sus primeras llegadas y por el cierre defensivo.",
        current: { euforia: 24, confianza: 38, ansiedad: 68, frustracion: 80, incertidumbre: 64, optimismo: 36 },
        predicted: { euforia: 46, confianza: 52, ansiedad: 52, frustracion: 34, incertidumbre: 50, optimismo: 48 },
        userExperience: {
          realidad: "La conversacion panamena se concentra en el dolor del 90+5' y en la sensacion de que el punto ya estaba en la mano.",
          percepcion: "Reddit y X empujan una lectura de castigo cruel para un equipo que habia sobrevivido al contexto.",
        },
      },
    ],
    lessons: [
      { term: "Regla pico-fin", explanation: "El recuerdo del partido queda dominado por el 90+5', no por la suma de tramos grises anteriores." },
      { term: "Costo hundido emocional", explanation: "Cuanto mas cerca se siente un empate util, mas doloroso se vuelve perderlo en la ultima accion." },
      { term: "Paciencia competitiva", explanation: "En contextos de baja claridad, sostener el plan un minuto mas puede cambiar por completo la experiencia percibida." },
    ],
    humanBehavior: "Cuando un escenario parece degradarse hacia el empate, la audiencia redistribuye todo su juicio alrededor del ultimo evento decisivo.",
    cognitiveBiases: ["Regla pico-fin", "Aversión a la perdida", "Recencia"],
    emotionalReaction: "Ghana paso de la incomodidad a la celebracion catartica; Panama de la resistencia pragmatica a un golpe emocional muy dificil de amortiguar.",
    digitalPatterns: "X y Reddit comprimieron el partido a dos ideas: la angustia del tramite y el estallido del 90+5' de Yirenkyi.",
    productApplications: [
      { sector: "Producto digital", application: "En flujos largos, una confirmacion visible al final puede redefinir por completo la satisfaccion del usuario." },
      { sector: "Streaming deportivo", application: "Destacar el momento pico-fin ayuda a explicar por que un partido opaco genera una reaccion desproporcionada al cierre." },
      { sector: "Contenido SEO/GEO", application: "El titular con marcador y minuto exacto captura la intencion factual y mejora la respuesta postpartido." },
    ],
    fanPulse: { concerns: ["La eficacia panamena", "La consistencia ofensiva de Ghana", "La presion del siguiente partido del Grupo L"], emotions: ["Euforia ghanesa", "Desolacion panamena", "Sorpresa neutral"], frustrations: ["Panama no convirtio su mejor arranque", "El tramite tuvo demasiados cortes y poca claridad"], enthusiasm: ["Gol agonico de Yirenkyi", "Ghana iguala a Inglaterra en la cima", "Partido decidido en el ultimo instante"] },
    sources: [
      { name: "FIFA - Ghana 1-0 Panama", url: "https://www.fifa.com/en/tournaments/mens/worldcup/canadamexicousa2026/articles/ghana-panama-highlights-match-report", kind: "oficial" },
      { name: "The Guardian - Ghana v Panama report", url: "https://www.theguardian.com/football/2026/jun/18/ghana-panama-world-cup-2026-match-report-group-l", kind: "referencia" },
      { name: "Latingoles - Ghana castiga a Panama al 94", url: "https://latingoles.com/amargo-debut-ghana-castiga-a-panama-con-gol-al-minuto-94/", kind: "referencia" },
      { name: "X - busqueda Ghana Panama Yirenkyi", url: "https://x.com/search?q=Ghana%20Panama%20Yirenkyi%20World%20Cup&src=typed_query", kind: "tendencia" },
      { name: "Reddit r/soccer - busqueda Ghana Panama 1-0", url: "https://www.reddit.com/r/soccer/search/?q=Ghana%201-0%20Panama%20World%20Cup%202026&restrict_sr=1&sort=new", kind: "conversacion" },
    ],
    imageUrl: "/images/experience-radar/mundial-2026/ghana-panama.jpg",
    imageAlt: "Ghana celebra el 1-0 agonico sobre Panama en Toronto",
    imageCredit: "The Guardian",
    imageSourceUrl: "https://www.theguardian.com/football/2026/jun/18/ghana-panama-world-cup-2026-match-report-group-l",
    analyzedAt: "2026-06-18T10:12:00.000Z",
    nextOpponents: { Ghana: "Inglaterra", Panama: "Croacia" },
  }),
  finishedMatch({
    date: "2026-06-17",
    kickoffAt: "2026-06-18T02:00:00.000Z",
    slug: "uzbekistan-colombia-mundial-2026",
    group: "Grupo K",
    home: "Uzbekistan",
    away: "Colombia",
    homeGoals: 1,
    awayGoals: 3,
    scoreDetail: "Uzbekistan: Abbosbek Fayzullaev 60'. Colombia: Daniel Munoz 40', Luis Diaz 65', Jaminton Campaz 90+9'.",
    seoTitle: "Uzbekistan 1-3 Colombia: Diaz marco el pulso y Colombia tomo el Grupo K",
    hook: "Colombia encontro resistencia real de Uzbekistan, pero respondio con jerarquia cada vez que el partido amenazo con igualarse de verdad.",
    matchSummary: "Colombia vencio 3-1 a Uzbekistan en el Azteca con goles de Daniel Munoz, Luis Diaz y Jaminton Campaz. Fayzullaev marco el primer gol mundialista de los uzbekos y obligo a Colombia a responder de inmediato.",
    quickSummary: "Uzbekistan 1-3 Colombia: el debut sudamericano tuvo menos comodidad de la que sugiere el marcador, pero gano autoridad por la velocidad con la que reacciono al empate.",
    whatHappened: "Colombia controlo mas tiempo y pelota, pero le costo abrir una defensa uzbeka ordenada hasta que Daniel Munoz llego al 40' para romper el cerrojo. El partido cambio de temperatura en el 60', cuando Abbosbek Fayzullaev marco el primer gol mundialista de Uzbekistan y obligo a reinterpretar todo. La ventaja emocional del empate duro poco: Luis Diaz respondio al 65' con el gol que devolvio la jerarquia al favorito, y Jaminton Campaz cerro al 90+9' una noche en la que Colombia fue eficaz justo despues de cada amenaza. Con Portugal atascado ante RD Congo, el triunfo la deja primera del Grupo K.",
    aiSummary: "Colombia supero 3-1 a Uzbekistan con gol y asistencia de Luis Diaz, mas los aportes de Daniel Munoz y Jaminton Campaz. Experience Radar interpreta el partido como una demostracion de autoridad reactiva: no fue un dominio constante, pero si una capacidad clara para responder en el momento exacto.",
    uxFinding: "El usuario tolera mejor los tramos trabados cuando percibe que la respuesta al error o al golpe rival llega rapido y con firma reconocible.",
    keyPlays: ["40': Daniel Munoz abre el marcador para Colombia.", "60': Abbosbek Fayzullaev anota el primer gol mundialista de Uzbekistan.", "65': Luis Diaz responde rapido y devuelve la ventaja amplia a Colombia.", "90+9': Jaminton Campaz cierra el 1-3 y consolida el liderato del Grupo K."],
    controversies: ["La previa del partido estuvo marcada por lluvia y dificultades de acceso al Azteca reportadas por medios britanicos.", "La igualdad parcial expuso por minutos la falta de profundidad colombiana ante un bloque muy bajo."],
    statements: ["FIFA registro a Luis Diaz con gol y asistencia en el debut colombiano.", "Win Sports resumio el partido como un triunfo apretado de Colombia ante una Uzbekistan muy ordenada.", "Latingoles lo presento como un golpe de autoridad que deja a Colombia lider del grupo."],
    combined: {
      expectativa: { euforia: 72, confianza: 74, ansiedad: 42, frustracion: 18, incertidumbre: 44, optimismo: 78 },
      realidad: { euforia: 76, confianza: 68, ansiedad: 58, frustracion: 28, incertidumbre: 52, optimismo: 74 },
      percepcion: { euforia: 84, confianza: 82, ansiedad: 22, frustracion: 18, incertidumbre: 30, optimismo: 86 },
    },
    teamsData: [
      {
        team: "Uzbekistan",
        expectedEmotion: "Orgullo de debut con la ilusion de incomodar al favorito mas tiempo del esperado.",
        dominantConversation: "Bloque bajo, disciplina tactica y la oportunidad historica de marcar en su primera Copa.",
        fanConfidence: "Media: la derrota duele, pero el primer gol mundialista sostiene un relato de pertenencia.",
        mainNarrative: "El debutante que hizo trabajar a Colombia y escribio su primer hito antes de ceder.",
        howTheyArrived: "Con muy poco que perder y con la expectativa de competir desde el orden.",
        whatHappened: "Aguanto largos tramos, encontro el 1-1 y obligo al favorito a responder sin demora.",
        expectationVsReality: "La expectativa era resistir con dignidad; la realidad añade un momento historico aunque sin puntos.",
        mood: "Orgullo dolido.",
        behaviorEffect: "La aficion uzbeka eleva a Fayzullaev como simbolo del debut y discute si el equipo merecio alargar mas la igualdad.",
        current: { euforia: 48, confianza: 56, ansiedad: 52, frustracion: 60, incertidumbre: 54, optimismo: 52 },
        predicted: { euforia: 40, confianza: 46, ansiedad: 54, frustracion: 42, incertidumbre: 58, optimismo: 44 },
        userExperience: {
          realidad: "La experiencia de Uzbekistan mezcla orgullo por el 60' historico con la sensacion de que la alegria duro demasiado poco.",
          percepcion: "En Reddit se repite la idea de un debut competitivo que no debe leerse solo por el marcador final.",
        },
      },
      {
        team: "Colombia",
        expectedEmotion: "Confianza alta con exigencia de mostrarse superior desde el arranque.",
        dominantConversation: "Luis Diaz, jerarquia ofensiva y la necesidad de evitar un debut enredado.",
        fanConfidence: "Alta tras ganar y quedar lider del grupo, aunque con advertencias sobre la fluidez ofensiva.",
        mainNarrative: "El favorito que no domino siempre, pero respondio a tiempo cada vez que el partido se tenso.",
        howTheyArrived: "Con impulso de clasificacion y la expectativa de marcar territorio desde la primera fecha.",
        whatHappened: "Abrio con Munoz, sufrio el 1-1 y reimpuso distancia emocional con Luis Diaz y Campaz.",
        expectationVsReality: "La expectativa era un triunfo claro; la realidad fue un examen mas fisico y menos limpio de lo previsto.",
        mood: "Satisfaccion vigilante.",
        behaviorEffect: "La hinchada colombiana celebra el liderato, pero mantiene abierta la conversacion sobre volumen ofensivo y control de los segundos tiempos.",
        current: { euforia: 86, confianza: 84, ansiedad: 20, frustracion: 18, incertidumbre: 28, optimismo: 88 },
        predicted: { euforia: 74, confianza: 78, ansiedad: 34, frustracion: 20, incertidumbre: 36, optimismo: 80 },
        userExperience: {
          realidad: "La audiencia colombiana vivio el 65' de Diaz como reinicio emocional inmediato y el 90+9' de Campaz como sello de jerarquia.",
          percepcion: "En X, Diaz concentra elogios; en Reddit, el foco esta en la respuesta rapida tras el empate uzbeko.",
        },
      },
    ],
    lessons: [
      { term: "Respuesta inmediata", explanation: "El 65' de Diaz vale mas que un dominio prolongado porque reordena la ansiedad en segundos." },
      { term: "Jerarquia reactiva", explanation: "La superioridad se percibe menos por la posesion que por la velocidad de respuesta ante el golpe rival." },
      { term: "Hito fundador", explanation: "El primer gol mundialista de Uzbekistan crea memoria positiva aun dentro de una derrota." },
    ],
    humanBehavior: "La audiencia concede margen a un favorito si siente que conserva respuestas claras y casi instantaneas cuando el guion se complica.",
    cognitiveBiases: ["Recencia", "Efecto de autoridad", "Regla pico-fin"],
    emotionalReaction: "Uzbekistan se aferro al orgullo de su primer gol; Colombia paso del susto parcial a la confianza reforzada por su capacidad de reaccion.",
    digitalPatterns: "X se lleno de clips de Diaz y del 1-1 uzbeko; Reddit discute menos la posesion y mas la capacidad colombiana de responder en cinco minutos.",
    productApplications: [
      { sector: "Producto digital", application: "Responder rapido a un error visible reduce mas ansiedad que esconderlo bajo una estabilidad aparente." },
      { sector: "Streaming deportivo", application: "Etiquetar el tramo 60'-65' como cambio de narrativa permite explicar por que el partido se sintio mas ajustado que el 1-3 final." },
      { sector: "Contenido SEO/GEO", application: "Combinar marcador, figura y efecto en el grupo mejora la cobertura postpartido y la intencion de consulta." },
    ],
    fanPulse: { concerns: ["La profundidad ofensiva de Colombia", "La capacidad de Uzbekistan para sostener su bloque ante otro rival directo", "El peso del Portugal vs Colombia de la siguiente fecha"], emotions: ["Alivio colombiano", "Orgullo uzbeko", "Respeto neutral"], frustrations: ["Colombia permitio un empate que estiro dudas por unos minutos", "Uzbekistan no pudo sostener el 1-1"], enthusiasm: ["Gol y asistencia de Luis Diaz", "Primer gol mundialista de Uzbekistan", "Colombia queda lider del Grupo K"] },
    sources: [
      { name: "FIFA - Uzbekistan 1-3 Colombia", url: "https://www.fifa.com/en/tournaments/mens/worldcup/canadamexicousa2026/articles/uzbekistan-colombia-match-report-highlights", kind: "oficial" },
      { name: "Win Sports - Colombia gana en el debut", url: "https://www.winsports.co/seleccion-colombia/noticias/en-vivo-uzbekistan-vs-colombia-minuto-a-minuto-y-goles-copa-mundial-de-la-fifa-439451", kind: "referencia" },
      { name: "Latingoles - Munoz, Diaz y Campaz impulsan a Colombia", url: "https://latingoles.com/golpe-de-autoridad-munoz-diaz-y-campaz-impulsan-a-colombia-al-liderato-del-grupo/", kind: "referencia" },
      { name: "X - busqueda Uzbekistan Colombia Luis Diaz", url: "https://x.com/search?q=Uzbekistan%20Colombia%20Luis%20Diaz%20World%20Cup&src=typed_query", kind: "tendencia" },
      { name: "Reddit r/soccer - busqueda Uzbekistan Colombia 1-3", url: "https://www.reddit.com/r/soccer/search/?q=Uzbekistan%201-3%20Colombia%20World%20Cup%202026&restrict_sr=1&sort=new", kind: "conversacion" },
    ],
    imageUrl: "/images/experience-radar/mundial-2026/uzbekistan-colombia.jpg",
    imageAlt: "Colombia celebra el 3-1 sobre Uzbekistan en el Estadio Azteca",
    imageCredit: "The Guardian",
    imageSourceUrl: "https://www.theguardian.com/football/2026/jun/18/uzbekistan-colombia-world-cup-2026-group-k-match-report",
    analyzedAt: "2026-06-18T10:20:00.000Z",
    nextOpponents: { Uzbekistan: "Portugal", Colombia: "RD Congo" },
  }),
  finishedMatch({
    date: "2026-06-16",
    kickoffAt: "2026-06-17T04:00:00.000Z",
    slug: "austria-jordania-mundial-2026",
    group: "Grupo J",
    home: "Austria",
    away: "Jordania",
    homeGoals: 3,
    awayGoals: 1,
    scoreDetail: "Austria: Romano Schmid 20', Yazan Al-Arab en contra 77', Marko Arnautovic 90+11' (penal). Jordania: Ali Olwan 50'.",
    seoTitle: "Austria 3-1 Jordania: Schmid, el autogol y Arnautovic castigaron el debut jordano",
    hook: "Jordania igualo y compitio, pero Austria encontro el quiebre emocional con un autogol y un penal revisado por VAR.",
    matchSummary: "Austria volvio a un Mundial con un 3-1 ante Jordania en Santa Clara. Schmid abrio con un remate lejano, Olwan firmo el primer gol mundialista jordano, Al-Arab marco en propia puerta al 77' y Arnautovic cerro de penal en el 90+11'.",
    quickSummary: "Austria 3-1 Jordania: el marcador parece comodo, pero el partido vivio en equilibrio hasta el minuto 77. Jordania tuvo volumen y orgullo de debutante; Austria convirtio mejor los momentos criticos y salio del estreno con alivio competitivo.",
    whatHappened: "El partido fue una prueba de gestion emocional. Austria empezo con el golpe de Schmid al 20', pero Jordania respondio con Ali Olwan al 50' y durante buena parte del segundo tiempo obligo al favorito europeo a convivir con incertidumbre. El autogol de Al-Arab tras corner de Posch rompio el empate y cambio el encuadre: de debut jordano historico a castigo por detalles. El penal de Arnautovic, concedido despues de revision por mano, fijo un 3-1 que amplia la diferencia emocional mas que la futbolistica.",
    aiSummary: "Austria vencio 3-1 a Jordania con goles de Schmid, autogol de Al-Arab y penal de Arnautovic; Olwan marco el primer gol mundialista jordano. Para Experience Radar, el caso muestra como un debutante puede ganar simpatia y atencion aunque pierda, mientras el favorito necesita convertir momentos de borde en alivio. El VAR final y el autogol concentraron la memoria emocional.",
    uxFinding: "En una experiencia pareja, los errores visibles al final pesan mas que la calidad sostenida: el usuario recuerda el quiebre que reorganiza el relato.",
    keyPlays: ["20': Schmid pone el 1-0 con remate lejano.", "50': Ali Olwan empata y firma el primer gol mundialista de Jordania.", "77': Al-Arab marca en propia puerta tras corner de Posch.", "90+11': Arnautovic convierte un penal concedido por VAR."],
    controversies: ["El 3-1 llego tras revision de VAR por mano de Salim Obaid en el area.", "The Guardian registro un gol anulado a Arnautovic antes del autogol que finalmente puso el 2-1."],
    statements: ["The Guardian remarco que el 3-1 fue mas cerrado de lo que indica el marcador.", "ESPN confirmo el resultado del Grupo J y el horario de cierre de la jornada.", "TyC Sports destaco que Austria alcanzo a Argentina en la linea del Grupo J."],
    combined: {
      expectativa: { euforia: 68, confianza: 62, ansiedad: 54, frustracion: 18, incertidumbre: 56, optimismo: 70 },
      realidad: { euforia: 72, confianza: 58, ansiedad: 76, frustracion: 48, incertidumbre: 70, optimismo: 66 },
      percepcion: { euforia: 78, confianza: 74, ansiedad: 36, frustracion: 40, incertidumbre: 44, optimismo: 78 },
    },
    teamsData: [
      {
        team: "Austria",
        expectedEmotion: "Ilusion por regresar al Mundial con obligacion de no fallar ante un debutante.",
        dominantConversation: "Rangnick, el regreso tras 28 anos y la necesidad de empezar con tres puntos.",
        fanConfidence: "Alta con matiz: el resultado tranquiliza, el tramite deja alertas.",
        mainNarrative: "El favorito que sufrio mas de lo esperado, pero resolvio los detalles.",
        howTheyArrived: "Con presion de estreno y expectativa europea de control.",
        whatHappened: "Gano por eficacia en los momentos criticos: golazo, autogol forzado y penal final.",
        expectationVsReality: "La expectativa era superioridad clara; la realidad fue un partido incomodo que se salvo por cierre.",
        mood: "Alivio con celebracion; tres puntos antes de Argentina pesan mas que las dudas.",
        behaviorEffect: "La hinchada consume el triunfo como validacion minima y mira de inmediato el cruce con Argentina.",
        current: { euforia: 80, confianza: 76, ansiedad: 34, frustracion: 30, incertidumbre: 42, optimismo: 80 },
        predicted: { euforia: 72, confianza: 68, ansiedad: 56, frustracion: 34, incertidumbre: 58, optimismo: 70 },
        userExperience: {
          realidad: "Los comentarios en vivo se movieron entre alivio por el gol de Schmid y nervio tras el empate jordano; el 2-1 en propia puerta funciono como desbloqueo mas que como euforia pura.",
          percepcion: "El consumo posterior prioriza tabla y proximo rival: el usuario austriaco cierra rapido el partido y abre el escenario Argentina.",
        },
      },
      {
        team: "Jordania",
        expectedEmotion: "Orgullo historico por debutar y ansiedad por pertenecer al escenario.",
        dominantConversation: "Primer Mundial, primer gol posible y prueba ante una seleccion europea.",
        fanConfidence: "Media: la derrota duele, pero el gol de Olwan crea memoria positiva.",
        mainNarrative: "El debutante que compitio y tuvo un hito, pero fue castigado por detalles.",
        howTheyArrived: "Con energia de estreno y mucha necesidad de senales tempranas de legitimidad.",
        whatHappened: "Empato, genero mas tiros a puerta que Austria segun The Guardian, pero un autogol y un penal final rompieron el relato.",
        expectationVsReality: "La expectativa era resistencia; la realidad fue pertenencia competitiva con dolor por el cierre.",
        mood: "Orgullo frustrado.",
        behaviorEffect: "La hinchada jordana comparte el gol historico y transforma el partido ante Argelia en urgencia emocional.",
        current: { euforia: 54, confianza: 58, ansiedad: 60, frustracion: 68, incertidumbre: 62, optimismo: 56 },
        predicted: { euforia: 60, confianza: 62, ansiedad: 54, frustracion: 46, incertidumbre: 52, optimismo: 64 },
        userExperience: {
          realidad: "El gol de Olwan crea el clip fundacional del debut jordano: aunque el resultado sea negativo, la experiencia digital ya tiene una pieza de orgullo.",
          percepcion: "La conversacion posterior separa marcador de identidad: se lamentan el autogol y el penal, pero se conserva la sensacion de haber competido.",
        },
      },
    ],
    lessons: [
      { term: "Error saliente", explanation: "Un autogol cerca del final domina la memoria porque convierte un empate posible en perdida inmediata." },
      { term: "Orgullo de debut", explanation: "Un hito identitario, como el primer gol mundialista, puede amortiguar una derrota." },
      { term: "Recencia emocional", explanation: "El penal del 90+11' exagera la sensacion de superioridad austriaca frente a un tramite mas parejo." },
    ],
    matchInterpretations: {
      expectativa: { euforia: "Austria celebraba el regreso; Jordania celebraba pertenecer.", confianza: "Austria partia con mas confianza estructural.", ansiedad: "Jordania tenia ansiedad de debut; Austria de obligacion.", frustracion: "Baja antes del inicio.", incertidumbre: "Alta por el desconocimiento competitivo entre ambos.", optimismo: "Ambas hinchadas encontraban motivos claros de optimismo." },
      realidad: { euforia: "Sube con Schmid, cae con Olwan y vuelve con el autogol.", confianza: "Austria recupera confianza solo despues del 2-1.", ansiedad: "El empate eleva ansiedad de Austria y expectativa jordana.", frustracion: "Jordania acumula frustracion por el autogol y el penal.", incertidumbre: "Hasta el 77' el partido esta abierto.", optimismo: "Austria cierra con optimismo; Jordania conserva parte por rendimiento." },
      percepcion: { euforia: "Austria celebra los tres puntos; Jordania el hito de Olwan.", confianza: "Austria gana confianza practica, no plena.", ansiedad: "Austria traslada ansiedad a Argentina; Jordania a Argelia.", frustracion: "La frustracion jordana queda atada al autogol.", incertidumbre: "El grupo se abre con Argentina y Austria arriba.", optimismo: "Austria cree; Jordania aun tiene narrativa para competir." },
    },
    humanBehavior: "Las audiencias evaluaan el cierre como prueba de control, incluso cuando el desarrollo fue equilibrado.",
    cognitiveBiases: ["Sesgo de recencia", "Regla pico-fin", "Aversión a la perdida"],
    emotionalReaction: "Austria paso de obligacion a alivio; Jordania de orgullo historico a frustracion por detalles.",
    digitalPatterns: "La imagen compartible de Jordania es el gol de Olwan; la de Austria es Arnautovic cerrando con penal y el regreso mundialista.",
    productApplications: [
      { sector: "Producto digital", application: "En procesos parejos, marca claramente los eventos decisivos para que el usuario entienda por que cambio el estado." },
      { sector: "Comunidades", application: "Permitir celebrar hitos parciales reduce abandono emocional aun cuando el resultado final es negativo." },
      { sector: "Medios en vivo", application: "Separar marcador final de lectura del tramite evita una narrativa enganosa." },
    ],
    fanPulse: { concerns: ["Austria sufrio mas de lo previsto", "Jordania debe convertir su buena imagen en puntos", "Argentina y Argelia cambian la presion del grupo"], emotions: ["Alivio austriaco", "Orgullo jordano", "Frustracion por el autogol"], frustrations: ["Autogol de Al-Arab", "Penal tardio", "Diferencia final exagerada"], enthusiasm: ["Gol historico de Olwan", "Regreso austriaco al Mundial", "Schmid y Arnautovic como puntos de memoria"] },
    sources: [
      { name: "ESPN — calendario y resultado Austria 3-1 Jordania", url: "https://www.espn.com/soccer/story/_/id/48939282/2026-fifa-world-cup-fixtures-results-match-schedule-group-stage-knockout-rounds-bracket", kind: "referencia" },
      { name: "The Guardian — Austria 3-1 Jordan live", url: "https://www.theguardian.com/football/live/2026/jun/17/fifa-world-cup-2026-live-austria-v-jordan-updates-aut-vs-jor-group-j-match-score-latest", kind: "referencia" },
      { name: "TyC Sports — Austria se hizo fuerte y vencio a Jordania", url: "https://www.tycsports.com/mundial/fifa-mundial-mx-usa-can-2026-austria-vs-jordania-grupo-j-fecha-1-id736283.html", kind: "referencia" },
      { name: "X — busqueda Austria Jordania Mundial 2026", url: "https://x.com/search?q=Austria%20Jordania%203-1%20Mundial%202026&src=typed_query", kind: "tendencia" },
      { name: "Reddit r/soccer — busqueda Austria Jordan", url: "https://www.reddit.com/r/soccer/search/?q=Austria%20Jordan%203-1%20World%20Cup%202026&restrict_sr=1&sort=new", kind: "conversacion" },
    ],
    imageUrl: "/images/experience-radar/mundial-2026/austria-jordania.jpg",
    imageAlt: "Marko Arnautovic convierte el penal de Austria ante Jordania en el Mundial 2026",
    imageCredit: "Reuters vía The Guardian",
    imageSourceUrl: "https://www.theguardian.com/football/live/2026/jun/17/fifa-world-cup-2026-live-austria-v-jordan-updates-aut-vs-jor-group-j-match-score-latest",
    analyzedAt: "2026-06-17T09:36:00.000Z",
    nextOpponents: { Austria: "Argentina", Jordania: "Argelia" },
  }),
  finishedMatch({
    date: "2026-06-16",
    kickoffAt: "2026-06-17T01:00:00.000Z",
    slug: "argentina-argelia-mundial-2026",
    group: "Grupo J",
    home: "Argentina",
    away: "Argelia",
    homeGoals: 3,
    awayGoals: 0,
    scoreDetail: "Argentina: Lionel Messi 18', 60' y 76'. Goles anulados: Messi 6' y Argelia 8'.",
    seoTitle: "Argentina 3-0 Argelia: Messi igualo a Klose y transformo el debut en hito global",
    hook: "Messi marco triplete, llego a 16 goles mundialistas y Argentina resolvio el estreno despues de dos avisos anulados por fuera de juego.",
    matchSummary: "Argentina vencio 3-0 a Argelia en Kansas City con triplete de Lionel Messi. Win Sports registro goles anulados a Messi al 6' y a Argelia al 8', el 1-0 argentino al 18', el segundo al 60' tras rebote y el tercero al 76'.",
    quickSummary: "Argentina 3-0 Argelia: Messi hizo tres goles e igualo a Miroslav Klose como maximo goleador historico de los Mundiales. La experiencia paso de susto inicial por VAR a fiesta de confirmacion para la hinchada argentina.",
    whatHappened: "El partido empezo con dos microshocks: un gol anulado a Messi y otro a Argelia. Esa doble interrupcion puso la atencion en VAR, ansiedad y posibilidad de guion roto. Al 18', Messi marco de media distancia y cambio el centro emocional. El doblete al 60' y el tercero al 76' convirtieron el debut en celebracion historica. La polemica quedo en una dura entrada de Messi sobre Mandi que Win Sports registro como debate de roja sin sancion disciplinaria.",
    aiSummary: "Argentina gano 3-0 a Argelia con triplete de Messi, quien igualo el record de Klose con 16 goles mundialistas. Para Experience Radar, el partido muestra como una figura dominante absorbe incertidumbre, convierte anulaciones y polemicas en ruido secundario y produce una experiencia digital de hito: clips, records, debates y orgullo compartido.",
    uxFinding: "Una figura-icono simplifica la navegacion emocional de una audiencia: cuando aparece, reduce incertidumbre y organiza la memoria del evento.",
    keyPlays: ["6': gol anulado a Messi por fuera de juego.", "8': gol anulado a Argelia tras revision por fuera de juego.", "18': Messi marca el 1-0 con remate de media distancia.", "60': Messi aprovecha rebote de Zidane para el 2-0.", "76': Messi completa el triplete y empata el record de Klose."],
    controversies: ["Win Sports registro debate por una dura entrada de Messi sobre Aissa Mandi que no recibio amarilla ni revision determinante del VAR."],
    statements: ["Win Sports informo que Messi igualo a Klose como maximo goleador historico del Mundial.", "The Guardian encuadro el partido como una noche de record y capitan numero 200.", "ESPN confirmo el 3-0 de Argentina sobre Argelia en el Grupo J."],
    combined: {
      expectativa: { euforia: 80, confianza: 78, ansiedad: 38, frustracion: 14, incertidumbre: 42, optimismo: 82 },
      realidad: { euforia: 92, confianza: 88, ansiedad: 42, frustracion: 20, incertidumbre: 28, optimismo: 92 },
      percepcion: { euforia: 96, confianza: 92, ansiedad: 18, frustracion: 12, incertidumbre: 20, optimismo: 96 },
    },
    teamsData: [
      {
        team: "Argentina",
        expectedEmotion: "Euforia de campeon defensor, atravesada por la pregunta sobre Messi y su vigencia.",
        dominantConversation: "Messi, capitania historica, record de goles y defensa del titulo.",
        fanConfidence: "Muy alta despues del triplete.",
        mainNarrative: "El campeon que convierte su debut en ritual de confirmacion.",
        howTheyArrived: "Con magnetismo global y expectativa desbalanceada hacia su figura principal.",
        whatHappened: "Messi resolvio la noche con tres goles y absorbio la conversacion global.",
        expectationVsReality: "La expectativa era victoria; la realidad fue hito historico.",
        mood: "Euforia total con sensacion de control.",
        behaviorEffect: "La hinchada comparte records, clips y comparaciones historicas; el proximo partido ante Austria se mira desde superioridad emocional.",
        current: { euforia: 98, confianza: 94, ansiedad: 16, frustracion: 10, incertidumbre: 18, optimismo: 96 },
        predicted: { euforia: 90, confianza: 88, ansiedad: 30, frustracion: 16, incertidumbre: 30, optimismo: 92 },
        userExperience: {
          realidad: "En X, highlights y medios argentinos, la experiencia se volvio una secuencia de clips de Messi: gol anulado, gol valido, record y tercer tanto.",
          percepcion: "El usuario argentino no solo consume resultado; consume pertenencia historica. El triplete ordena titulares, memes y orgullo colectivo.",
        },
      },
      {
        team: "Argelia",
        expectedEmotion: "Esperanza de golpe narrativo ante el campeon.",
        dominantConversation: "Volver al Mundial y medir identidad ante Messi.",
        fanConfidence: "Baja tras el 3-0, pero con foco en reponerse ante Jordania.",
        mainNarrative: "El rival que tuvo un aviso temprano anulado y luego quedo atrapado por la figura total.",
        howTheyArrived: "Con deseo de interrumpir la fiesta argentina.",
        whatHappened: "El gol anulado al 8' fue su mayor momento emocional; despues sufrio cada aparicion de Messi.",
        expectationVsReality: "La esperanza de sorpresa se convirtio en frustracion por no sostener el primer golpe.",
        mood: "Frustracion y urgencia competitiva.",
        behaviorEffect: "La conversacion argelina se desplaza a la polemica, el VAR temprano y la necesidad de puntos frente a Jordania.",
        current: { euforia: 30, confianza: 42, ansiedad: 68, frustracion: 72, incertidumbre: 64, optimismo: 40 },
        predicted: { euforia: 54, confianza: 58, ansiedad: 54, frustracion: 42, incertidumbre: 52, optimismo: 60 },
        userExperience: {
          realidad: "El usuario argelino vivio el gol anulado como ventana de posibilidad; despues, la interfaz emocional del partido fue cada vez mas defensiva.",
          percepcion: "La derrota se procesa con busquedas de explicacion: offsides, falta no sancionada de Messi y como reconstruir el animo antes de Jordania.",
        },
      },
    ],
    lessons: [
      { term: "Efecto halo", explanation: "La figura de Messi hace que el rendimiento completo se perciba mas coherente y dominante." },
      { term: "Anclaje historico", explanation: "El record de Klose se vuelve referencia central para valorar una victoria que ya era clara." },
      { term: "Ruido tolerado", explanation: "Las polemicas iniciales pierden peso cuando el resultado ofrece una narrativa emocional mas fuerte." },
    ],
    matchInterpretations: {
      expectativa: { euforia: "Argentina llegaba con aura de campeon; Argelia con ilusion de sorpresa.", confianza: "La confianza argentina era muy alta por Messi y el titulo.", ansiedad: "La ansiedad existia por el peso del debut.", frustracion: "Baja antes del inicio.", incertidumbre: "El VAR temprano aumento la sensacion de guion abierto.", optimismo: "Argentina partia con optimismo masivo; Argelia con esperanza puntual." },
      realidad: { euforia: "Cada gol de Messi elevo la euforia hasta convertir el partido en celebracion.", confianza: "La confianza argentina se dispara con el 2-0.", ansiedad: "Los goles anulados abren ansiedad, luego baja.", frustracion: "Argelia acumula frustracion tras el 1-0 y el rebote del 2-0.", incertidumbre: "El triplete reduce casi toda incertidumbre.", optimismo: "Argentina termina mirando hacia arriba; Argelia hacia recomposicion." },
      percepcion: { euforia: "El recuerdo dominante es Messi y el record.", confianza: "Argentina queda validada.", ansiedad: "La ansiedad argentina cae fuerte.", frustracion: "Argelia conserva bronca por los detalles iniciales.", incertidumbre: "El grupo J se ordena alrededor de Argentina y Austria.", optimismo: "Argentina amplifica optimismo; Argelia lo reserva para Jordania." },
    },
    humanBehavior: "Cuando una experiencia entrega un hito historico claro, la audiencia perdona fricciones menores y compacta el recuerdo en una sola figura.",
    cognitiveBiases: ["Efecto halo", "Sesgo de autoridad", "Regla pico-fin"],
    emotionalReaction: "Argentina paso de susto por VAR a euforia historica; Argelia de esperanza temprana a frustracion defensiva.",
    digitalPatterns: "El consumo se concentro en clips de Messi, titulares de record, debate por la falta a Mandi y busquedas de maximos goleadores mundialistas.",
    productApplications: [
      { sector: "Producto digital", application: "Cuando hay un hito, dale jerarquia visual inmediata: reduce busquedas repetidas y organiza la conversacion." },
      { sector: "Medios y SEO", application: "Combina marcador, protagonista y record en el titulo para responder busqueda humana y de asistentes IA." },
      { sector: "Comunidades", application: "Permite capas de lectura: celebracion del ganador y ruta de recuperacion del perdedor." },
    ],
    fanPulse: { concerns: ["La gestion del favoritismo argentino", "La recuperacion animica de Argelia", "El impacto de la polemica no sancionada"], emotions: ["Euforia argentina", "Frustracion argelina", "Asombro neutral por Messi"], frustrations: ["Gol argelino anulado", "Entrada de Messi sin tarjeta", "Derrota amplia"], enthusiasm: ["Triplete de Messi", "Record historico", "Debut dominante del campeon"] },
    sources: [
      { name: "ESPN — Argentina 3-0 Argelia", url: "https://www.espn.com.co/futbol/partido/_/juegoId/760433/argelia-argentina", kind: "referencia" },
      { name: "Win Sports — minuto a minuto Argentina vs Argelia", url: "https://www.winsports.co/futbol-internacional/noticias/en-vivo-argentina-vs-argelia-minuto-a-minuto-y-goles-copa-mundial-de-la-fifa-439185", kind: "referencia" },
      { name: "The Guardian — Messi iguala record", url: "https://www.theguardian.com/football/2026/jun/16/argentina-algeria-world-cup-group-j-match-report", kind: "referencia" },
      { name: "X — busqueda Argentina Argelia Messi", url: "https://x.com/search?q=Argentina%20Argelia%20Messi%203-0&src=typed_query", kind: "tendencia" },
      { name: "Reddit r/soccer — busqueda Argentina Algeria", url: "https://www.reddit.com/r/soccer/search/?q=Argentina%203-0%20Algeria%20Messi&restrict_sr=1&sort=new", kind: "conversacion" },
    ],
    imageUrl: "/images/experience-radar/mundial-2026/argentina-argelia.jpg",
    imageAlt: "Lionel Messi durante Argentina 3-0 Argelia en el Mundial 2026",
    imageCredit: "FIFA vía Win Sports",
    imageSourceUrl: "https://www.winsports.co/futbol-internacional/noticias/en-vivo-argentina-vs-argelia-minuto-a-minuto-y-goles-copa-mundial-de-la-fifa-439185",
    previewImageUrl: "/images/experience-radar/mundial-2026/argentina-argelia-previa.jpg",
    previewImageAlt: "Jugadores de Argentina en la previa del debut frente a Argelia",
    previewImageCredit: "Latingoles",
    previewImageSourceUrl: "https://latingoles.com/alerta-campeon-argentinos-messi-martinez-y-alvarez-marcan-el-pulso-de-argentina-ante-argelia/",
    analyzedAt: "2026-06-17T09:30:00.000Z",
    nextOpponents: { Argentina: "Austria", Argelia: "Jordania" },
  }),
  finishedMatch({
    date: "2026-06-16",
    kickoffAt: "2026-06-16T22:00:00.000Z",
    slug: "iraq-noruega-mundial-2026",
    group: "Grupo I",
    home: "Irak",
    away: "Noruega",
    homeGoals: 1,
    awayGoals: 4,
    scoreDetail: "Noruega: Erling Haaland 29' y 43', Leo Ostigard 76', autogol iraqui 90+6'. Irak: Aymen Hussein 39'.",
    seoTitle: "Irak 1-4 Noruega: Haaland debuto con doblete y convirtio expectativa en avalancha",
    hook: "Haaland marco dos veces, Irak empato por Hussein y Noruega rompio el partido antes y despues del descanso.",
    matchSummary: "Noruega vencio 4-1 a Irak en Foxborough. Haaland abrio al 29', Aymen Hussein empato al 39', Haaland devolvio la ventaja al 43', Ostigard amplio de cabeza y un autogol en el 90+6' cerro la goleada.",
    quickSummary: "Irak 1-4 Noruega: Haaland hizo doblete en su debut mundialista y Noruega lidera el Grupo I. Irak compitio mejor de lo que indica el marcador, pero el error antes del descanso y la potencia aerea noruega cambiaron la percepcion.",
    whatHappened: "El partido arranco como prueba de expectativa alrededor de Haaland. Noruega encontro el 1-0 al 29', pero Irak respondio con Aymen Hussein y por unos minutos recupero pertenencia emocional. El segundo gol noruego antes del descanso fue el verdadero quiebre: transformo una posible historia de resistencia iraqui en confirmacion de jerarquia. En el segundo tiempo, Ostigard y el autogol final ampliaron una diferencia que las fuentes describen como mas contundente en marcador que en sensaciones.",
    aiSummary: "Noruega derroto 4-1 a Irak con doblete de Haaland. La nota muestra como una expectativa centrada en una estrella puede cumplirse sin borrar del todo la lectura del rival: Irak produjo resistencia, empato y genero conversacion positiva, pero los errores de borde y la pegada noruega fijaron una memoria de goleada.",
    uxFinding: "Cuando una promesa de producto gira alrededor de una figura, el cumplimiento temprano reduce ansiedad y convierte atencion previa en confianza durable.",
    keyPlays: ["29': Haaland pone el 0-1.", "39': Aymen Hussein empata para Irak.", "43': Haaland firma el 1-2 antes del descanso.", "76': Ostigard marca de cabeza.", "90+6': autogol iraqui cierra el 1-4."],
    controversies: ["The Guardian remarco que el 1-4 fue mas competido de lo que sugiere el marcador, con Irak presionando y mostrando tramos creativos."],
    statements: ["ESPN confirmo el 1-4 y el doblete de Haaland.", "Cadena SER titulo el partido alrededor del debut mundialista de Haaland.", "Latingoles encuadro el resultado como golpe vikingo."],
    combined: {
      expectativa: { euforia: 72, confianza: 68, ansiedad: 50, frustracion: 20, incertidumbre: 52, optimismo: 74 },
      realidad: { euforia: 80, confianza: 72, ansiedad: 58, frustracion: 42, incertidumbre: 48, optimismo: 78 },
      percepcion: { euforia: 88, confianza: 84, ansiedad: 24, frustracion: 28, incertidumbre: 30, optimismo: 88 },
    },
    teamsData: [
      {
        team: "Irak",
        expectedEmotion: "Orgullo por volver al Mundial y necesidad de que el partido no fuera solo Haaland.",
        dominantConversation: "Resistencia, regreso historico y capacidad para incomodar a Noruega.",
        fanConfidence: "Baja tras la goleada, aunque con respeto por el tramo del empate.",
        mainNarrative: "El regreso que tuvo un momento de pertenencia, pero fue castigado por errores.",
        howTheyArrived: "Con relato de retorno y de desventaja simbolica ante la estrella rival.",
        whatHappened: "Empato con Hussein, pero concedio muy pronto el 1-2 y se desordeno al final.",
        expectationVsReality: "La expectativa era competir con dignidad; la realidad mostro chispas y un marcador duro.",
        mood: "Frustracion con pequenas senales de orgullo.",
        behaviorEffect: "La hinchada iraqui se aferra al gol de Hussein y discute ajustes defensivos para Francia y Senegal.",
        current: { euforia: 36, confianza: 44, ansiedad: 70, frustracion: 76, incertidumbre: 68, optimismo: 42 },
        predicted: { euforia: 46, confianza: 50, ansiedad: 62, frustracion: 54, incertidumbre: 60, optimismo: 50 },
        userExperience: {
          realidad: "El empate de Hussein fue el pico compartible de Irak: durante minutos, X y los comentarios en vivo permitieron imaginar una interrupcion del guion Haaland.",
          percepcion: "Tras el 1-4, la experiencia digital iraqui se mueve a diagnostico: errores de cierre, defensa aerea y como sostener los buenos minutos.",
        },
      },
      {
        team: "Noruega",
        expectedEmotion: "Expectativa alta por el regreso mundialista y por ver a Haaland en el escenario total.",
        dominantConversation: "Haaland, Odegaard y una generacion que debia confirmar el hype.",
        fanConfidence: "Muy alta tras el doblete y la goleada.",
        mainNarrative: "La promesa cumplida: la estrella entrega y el equipo acompana.",
        howTheyArrived: "Con atencion global concentrada en Haaland.",
        whatHappened: "Haaland marco dos veces, Ostigard amplio y Noruega convirtio tramos abiertos en goleada.",
        expectationVsReality: "La expectativa era que Haaland apareciera; la realidad fue validacion inmediata.",
        mood: "Euforia y confianza.",
        behaviorEffect: "La hinchada noruega comparte el doblete como prueba de pertenencia al torneo y mira a Senegal con ambicion.",
        current: { euforia: 92, confianza: 88, ansiedad: 20, frustracion: 14, incertidumbre: 24, optimismo: 92 },
        predicted: { euforia: 84, confianza: 82, ansiedad: 36, frustracion: 18, incertidumbre: 36, optimismo: 86 },
        userExperience: {
          realidad: "Los clips del doblete funcionan como onboarding emocional de Noruega al Mundial: una promesa previa convertida en prueba visual.",
          percepcion: "La conversacion posterior organiza la confianza alrededor de Haaland, pero tambien abre dudas sobre vulnerabilidades defensivas que Irak alcanzo a mostrar.",
        },
      },
    ],
    lessons: [
      { term: "Promesa cumplida", explanation: "Cuando la estrella responde temprano, la audiencia siente que la atencion previa estuvo justificada." },
      { term: "Marcador vs tramite", explanation: "Un 1-4 puede ocultar tramos de competencia; el analisis debe separar resultado de percepcion." },
      { term: "Momento bisagra", explanation: "El segundo gol antes del descanso pesa como ruptura de esperanza, no solo como cambio numerico." },
    ],
    matchInterpretations: {
      expectativa: { euforia: "Noruega llegaba electrica por Haaland; Irak con orgullo de regreso.", confianza: "Noruega confiaba mas por talento ofensivo.", ansiedad: "Irak cargaba ansiedad de pertenencia.", frustracion: "Baja antes del partido.", incertidumbre: "Habia duda sobre como responderia Irak tras anos fuera.", optimismo: "Noruega tenia optimismo alto; Irak uno prudente." },
      realidad: { euforia: "El gol de Hussein dio pico iraqui; el doblete de Haaland disparo euforia noruega.", confianza: "Noruega recupera confianza con el 1-2.", ansiedad: "El empate subio ansiedad noruega por minutos.", frustracion: "Irak se frustra por conceder antes del descanso.", incertidumbre: "El partido se abre hasta el tercer gol.", optimismo: "Noruega cierra con optimismo alto." },
      percepcion: { euforia: "La memoria noruega es de debut ideal.", confianza: "Haaland valida el plan.", ansiedad: "Noruega reduce ansiedad, Irak la traslada al siguiente juego.", frustracion: "Irak siente marcador excesivo.", incertidumbre: "Noruega queda mejor ubicada; Irak con dudas defensivas.", optimismo: "Noruega mira a Senegal con fuerza; Irak busca recomponerse." },
    },
    humanBehavior: "La atencion masiva sobre una figura necesita confirmacion rapida; cuando llega, el resto de la experiencia se lee con mas benevolencia.",
    cognitiveBiases: ["Efecto halo", "Sesgo de confirmacion", "Aversión a la perdida"],
    emotionalReaction: "Noruega paso de expectativa a euforia; Irak de orgullo a frustracion por una diferencia ampliada al final.",
    digitalPatterns: "X y medios de video empujaron el doblete de Haaland; Reddit y comentarios neutrales destacaron que Irak compitio mas de lo esperado.",
    productApplications: [
      { sector: "Producto digital", application: "Si una funcionalidad estrella concentra expectativa, haz visible su valor pronto y con evidencia clara." },
      { sector: "Analitica de eventos", application: "No uses solo marcador final: incorpora secuencia temporal para entender percepcion real." },
      { sector: "Contenido GEO", application: "Responder quien marco y cuando permite que asistentes de IA citen la nota sin perder contexto emocional." },
    ],
    fanPulse: { concerns: ["Fragilidad defensiva noruega en tramos", "Errores iraquies antes del descanso", "Presion de los siguientes rivales"], emotions: ["Euforia noruega", "Orgullo iraqui puntual", "Frustracion por goleada"], frustrations: ["1-2 antes del descanso", "Autogol final", "Marcador duro para Irak"], enthusiasm: ["Doblete de Haaland", "Gol de Hussein", "Regreso noruego con autoridad"] },
    sources: [
      { name: "ESPN Deportes — Irak 1-4 Noruega", url: "https://espndeportes.espn.com/futbol/partido/_/juegoId/760430/noruega-irak", kind: "referencia" },
      { name: "The Guardian — Iraq 1-4 Norway live", url: "https://www.theguardian.com/football/live/2026/jun/16/iraq-v-norway-world-cup-2026-live", kind: "referencia" },
      { name: "Cadena SER — Irak 1-4 Noruega", url: "https://cadenaser.com/nacional/2026/06/17/irak-1-4-noruega-resumen-resultado-y-goles-del-partido-del-grupo-i-en-el-mundial-2026-cadena-ser/", kind: "referencia" },
      { name: "Latingoles — golpe vikingo", url: "https://latingoles.com/golpe-vikingo-noruego-haaland-firma-doblete-e-iraqui-hussein-no-evita-la-goleada-de-noruega/", kind: "referencia" },
      { name: "X — busqueda Irak Noruega Haaland", url: "https://x.com/search?q=Irak%20Noruega%20Haaland%201-4&src=typed_query", kind: "tendencia" },
      { name: "Reddit r/soccer — busqueda Iraq Norway", url: "https://www.reddit.com/r/soccer/search/?q=Iraq%201-4%20Norway%20Haaland&restrict_sr=1&sort=new", kind: "conversacion" },
    ],
    imageUrl: "/images/experience-radar/mundial-2026/irak-noruega.jpg",
    imageAlt: "Erling Haaland celebra durante Irak 1-4 Noruega en el Mundial 2026",
    imageCredit: "EFE vía Latingoles",
    imageSourceUrl: "https://latingoles.com/golpe-vikingo-noruego-haaland-firma-doblete-e-iraqui-hussein-no-evita-la-goleada-de-noruega/",
    previewImageUrl: "/images/experience-radar/mundial-2026/irak-noruega-previa.jpg",
    previewImageAlt: "Erling Haaland en la previa del debut de Noruega frente a Irak",
    previewImageCredit: "Latingoles",
    previewImageSourceUrl: "https://latingoles.com/haaland-entra-en-escena-en-su-debut-mundialista-ante-irak/",
    analyzedAt: "2026-06-17T09:24:00.000Z",
    nextOpponents: { Irak: "Francia", Noruega: "Senegal" },
  }),
  finishedMatch({
    date: "2026-06-16",
    kickoffAt: "2026-06-16T19:00:00.000Z",
    slug: "francia-senegal-mundial-2026",
    group: "Grupo I",
    home: "Francia",
    away: "Senegal",
    homeGoals: 3,
    awayGoals: 1,
    scoreDetail: "Francia: Kylian Mbappe 66' y 90+5', Bradley Barcola 82'. Senegal: Mbaye 90+5'.",
    seoTitle: "Francia 3-1 Senegal: Mbappe convirtio paciencia en autoridad emocional",
    hook: "Mbappe abrio y cerro el partido, Barcola amplio la ventaja y Senegal sostuvo la duda hasta el tramo final.",
    matchSummary: "Francia vencio 3-1 a Senegal en East Rutherford despues de un primer tiempo incomodo. Mbappe rompio el 0-0 al 66' tras asistencia de Olise, Barcola marco el 2-0 al 82' y Mbaye desconto antes del cierre definitivo de Mbappe.",
    quickSummary: "Francia 3-1 Senegal: Mbappe marco dos veces, Barcola aporto el segundo y Senegal dejo una sensacion mas competitiva que el marcador. La conversacion paso del temor a un debut trabado a la confirmacion de candidatura.",
    whatHappened: "La primera mitad dejo a Senegal vivo y a Francia atrapada en una expectativa de superioridad que no encontraba prueba visible. Tras el descanso, el primer gol de Mbappe movio el punto de referencia: lo que parecia impaciencia empezo a verse como control. El descuento senegales al final no cambio el resultado, pero si evito una lectura de dominio absoluto.",
    aiSummary: "Francia derroto 3-1 a Senegal con doblete de Mbappe y gol de Barcola. El partido muestra como una audiencia favorita tolera mejor la espera cuando recibe una senal clara de control. Senegal, pese a perder, mantuvo una narrativa competitiva por el primer tiempo y el descuento tardio.",
    uxFinding: "Cuando una experiencia tarda en cumplir su promesa, una senal clara de avance reordena la paciencia de la audiencia.",
    keyPlays: ["66': Mbappe abre el marcador tras pase de Olise.", "82': Barcola define el 2-0.", "90+5': Mbaye descuenta y Mbappe responde con el 3-1 definitivo."],
    controversies: ["Al 59', Win Sports registro un roce sobre Mbappe en el area que el arbitro dejo seguir."],
    statements: ["AP titulo la victoria alrededor del doblete de Mbappe.", "Win Sports destaco el gol final de Mbappe fuera del area.", "Latingoles encuadro el resultado como golpe de candidato frances."],
    combined: {
      expectativa: { euforia: 74, confianza: 72, ansiedad: 44, frustracion: 18, incertidumbre: 46, optimismo: 76 },
      realidad: { euforia: 78, confianza: 70, ansiedad: 62, frustracion: 34, incertidumbre: 54, optimismo: 74 },
      percepcion: { euforia: 86, confianza: 84, ansiedad: 28, frustracion: 20, incertidumbre: 30, optimismo: 88 },
    },
    teamsData: [
      {
        team: "Francia",
        expectedEmotion: "Confianza alta, pero con obligacion de demostrar desde el debut.",
        dominantConversation: "Mbappe, Olise y la capacidad de Francia para madurar un partido cerrado.",
        fanConfidence: "Alta tras el 3-1; el doblete funciona como prueba social de candidato.",
        mainNarrative: "El favorito que no se desespera y convierte paciencia en autoridad.",
        howTheyArrived: "Con una previa cargada de jerarquia y presion por resolver rapido.",
        whatHappened: "Tardo en abrir el partido, pero Mbappe y Barcola hicieron visible la diferencia en el segundo tiempo.",
        expectationVsReality: "La expectativa era dominio temprano; la realidad fue control tardio.",
        mood: "Euforia sobria.",
        behaviorEffect: "La hinchada francesa comparte clips del doblete y reencuadra el primer tiempo como paciencia competitiva.",
        current: { euforia: 88, confianza: 86, ansiedad: 24, frustracion: 16, incertidumbre: 26, optimismo: 90 },
        predicted: { euforia: 82, confianza: 84, ansiedad: 32, frustracion: 18, incertidumbre: 34, optimismo: 86 },
        userExperience: {
          realidad: "En X y medios de highlights, la experiencia francesa se concentro en clips de Mbappe y en el cambio de tono tras el 1-0.",
          percepcion: "La conversacion posterior convirtio el doblete en senal de candidatura.",
        },
      },
      {
        team: "Senegal",
        expectedEmotion: "Orgullo competitivo y deseo de interrumpir el relato del favorito.",
        dominantConversation: "Competir sin complejo ante Francia.",
        fanConfidence: "Media: la derrota duele, pero el rendimiento inicial evita derrumbe emocional.",
        mainNarrative: "El retador que incomodo, pero pago caro no convertir antes.",
        howTheyArrived: "Con expectativa de resistencia.",
        whatHappened: "Sostuvo el 0-0 hasta el 66' y desconto tarde, pero sufrio el golpe de calidad francesa.",
        expectationVsReality: "La realidad confirma dignidad competitiva, aunque el 3-1 aumenta la frustracion.",
        mood: "Frustracion contenida con orgullo por la primera mitad.",
        behaviorEffect: "La aficion senegalesa discute ocasiones perdidas y pide convertir la buena imagen en puntos.",
        current: { euforia: 46, confianza: 56, ansiedad: 58, frustracion: 62, incertidumbre: 58, optimismo: 54 },
        predicted: { euforia: 58, confianza: 60, ansiedad: 52, frustracion: 42, incertidumbre: 50, optimismo: 62 },
        userExperience: {
          realidad: "La hinchada senegalesa vivio el primer tiempo como confirmacion de que el partido podia competir por relato.",
          percepcion: "Tras el 3-1, el consumo digital se mueve hacia explicaciones: eficacia francesa y ocasiones propias.",
        },
      },
    ],
    lessons: [
      { term: "Paciencia verificable", explanation: "La espera se tolera cuando el sistema entrega una senal fuerte de avance." },
      { term: "Pico-final", explanation: "El doblete de Mbappe al cierre domina la memoria del partido." },
      { term: "Encuadre del retador", explanation: "Senegal pierde, pero conserva valor emocional por competir mejor de lo esperado." },
    ],
    matchInterpretations: {
      expectativa: { euforia: "Francia llegaba con energia de candidato; Senegal con orgullo de desafio.", confianza: "La confianza francesa era alta por plantilla.", ansiedad: "La obligacion de Francia elevaba ansiedad antes del gol.", frustracion: "Baja antes del inicio.", incertidumbre: "La duda estaba en cuanto tardaria Francia.", optimismo: "Ambas hinchadas encontraban razones para creer." },
      realidad: { euforia: "Subio con el gol de Mbappe y exploto con el cierre.", confianza: "La confianza francesa se reconstruyo despues del 66'.", ansiedad: "El 0-0 largo aumento ansiedad.", frustracion: "Senegal acumula frustracion por resistir tanto y conceder tres veces.", incertidumbre: "Hasta el primer gol, el partido seguia abierto.", optimismo: "Francia sale reforzada; Senegal conserva optimismo limitado." },
      percepcion: { euforia: "El resultado queda asociado al doblete de Mbappe.", confianza: "Francia consolida confianza de candidato.", ansiedad: "La ansiedad francesa baja.", frustracion: "La frustracion senegalesa se concentra en la falta de premio.", incertidumbre: "El grupo queda menos incierto para Francia.", optimismo: "Francia mira a Irak con impulso." },
    },
    humanBehavior: "La audiencia reescribe una espera incomoda cuando el desenlace confirma la promesa central de la experiencia.",
    cognitiveBiases: ["Regla pico-fin", "Sesgo de confirmacion", "Efecto halo"],
    emotionalReaction: "Francia paso de impaciencia a alivio y orgullo; Senegal de ilusion competitiva a frustracion por eficacia ajena.",
    digitalPatterns: "Los clips de Mbappe concentraron la conversacion en X y video; AP, Win Sports y Latingoles indexaron el partido alrededor de goles e historia.",
    productApplications: [
      { sector: "Producto digital", application: "Cuando el valor tarda en aparecer, muestra senales parciales de progreso." },
      { sector: "Streaming deportivo", application: "Resaltar momentos de cambio narrativo ayuda a entender por que un partido se transformo." },
      { sector: "Contenido SEO/GEO", application: "Un titulo con marcador y protagonista satisface busqueda factual y abre paso al analisis." },
    ],
    fanPulse: { concerns: ["Dependencia francesa del talento final", "Eficacia senegalesa", "Peso del siguiente partido"], emotions: ["Alivio frances", "Orgullo senegales", "Frustracion por el cierre"], frustrations: ["0-0 demasiado largo", "Senegal no sostuvo el tramo decisivo"], enthusiasm: ["Doblete de Mbappe", "Impacto de Barcola", "Senegal compitio mas de lo que sugiere el 3-1"] },
    sources: [
      { name: "ESPN — resultado Francia 3-1 Senegal", url: "https://www.espn.com/soccer/story/_/id/48939282/2026-fifa-world-cup-fixtures-results-match-schedule-group-stage-knockout-rounds-bracket", kind: "referencia" },
      { name: "AP — Mbappe impulsa a Francia", url: "https://apnews.com/article/france-senegal-score-world-cup-4e7efa9c28339e91437c08334978add9", kind: "referencia" },
      { name: "Win Sports — minuto a minuto Francia vs Senegal", url: "https://www.winsports.co/futbol-internacional/noticias/en-vivo-francia-vs-senegal-minuto-a-minuto-y-goles-copa-mundial-de-la-fifa-439107", kind: "referencia" },
      { name: "Latingoles — Mbappe y Barcola frenan a Senegal", url: "https://latingoles.com/golpe-de-candidato-franceses-mbappe-y-barcola-frenan-el-grito-del-senegales-mbaye/", kind: "referencia" },
      { name: "X — busqueda France Senegal Mbappe", url: "https://x.com/search?q=France%20Senegal%20Mbappe%203-1&src=typed_query", kind: "tendencia" },
      { name: "Reddit r/soccer — busqueda France Senegal", url: "https://www.reddit.com/r/soccer/search/?q=France%203-1%20Senegal%20World%20Cup%202026&restrict_sr=1&sort=new", kind: "conversacion" },
    ],
    imageUrl: "/images/experience-radar/mundial-2026/francia-senegal.jpg",
    imageAlt: "Kylian Mbappe celebra durante Francia 3-1 Senegal en el Mundial 2026",
    imageCredit: "EFE via Latingoles",
    imageSourceUrl: "https://latingoles.com/golpe-de-candidato-franceses-mbappe-y-barcola-frenan-el-grito-del-senegales-mbaye/",
    previewImageUrl: "/images/experience-radar/mundial-2026/francia-senegal-previa.jpg",
    previewImageAlt: "Jugadores de Francia celebran antes del debut ante Senegal",
    previewImageCredit: "Sports Illustrated",
    previewImageSourceUrl: "https://www.si.com/soccer/france-2026-world-cup-preview",
    analyzedAt: "2026-06-17T09:18:00.000Z",
    nextOpponents: { Francia: "Irak", Senegal: "Noruega" },
  }),
  analyzedUpcomingMatch({
    date: "2026-06-17",
    kickoffAt: "2026-06-17T17:00:00.000Z",
    slug: "portugal-rd-congo-mundial-2026",
    teams: ["Portugal", "RD Congo"],
    group: "Grupo K",
    seoTitle: "Portugal vs RD Congo: previa, retorno africano y radar emocional del Grupo K",
    hook: "Portugal abre el Grupo K ante una RD Congo que vuelve al Mundial con una carga simbolica enorme",
    quickSummary: "Portugal y RD Congo juegan en Houston a las 12:00 local / 13:00 ET / 12:00 Bogota. ESPN y FIFA ubican el partido como el primer cruce del Grupo K del 17 de junio; la previa mezcla expectativa portuguesa de control con el retorno congoles despues de decadas fuera del torneo.",
    whatHappened: "La ventana de 12 horas del corte 2026-06-17T04:36:50-05:00 incluye Portugal vs RD Congo. La lectura previa separa el favoritismo portugues de la energia emocional de un regreso africano: para Portugal, el reto es iniciar sin convertir jerarquia en exceso de confianza; para RD Congo, lograr que el debut no se reduzca a resistencia.",
    uxFinding: "Cuando un favorito enfrenta un regreso historico, el producto editorial debe mostrar dos motivaciones distintas: control esperado y pertenencia recuperada.",
    keyPlays: ["12:00 Bogota / 13:00 ET: inicio en Houston.", "Portugal abre su participacion en el Grupo K.", "RD Congo vuelve a una Copa del Mundo y compite por resultado y memoria colectiva."],
    statements: ["ESPN lista Portugal vs RD Congo para el 17 de junio a la 1 p. m. ET.", "FIFA ubica el cruce dentro de la primera fecha del Grupo K.", "SBNation destaca el regreso mundialista de RD Congo y el foco de nueva generacion en Portugal."],
    sources: [
      { name: "ESPN — calendario Mundial 2026", url: "https://www.espn.com/soccer/story/_/id/48939282/2026-fifa-world-cup-fixtures-results-match-schedule-group-stage-knockout-rounds-bracket", kind: "referencia" },
      { name: "FIFA — calendario oficial", url: "https://www.fifa.com/en/tournaments/mens/worldcup/canadamexicousa2026/scores-fixtures", kind: "oficial" },
      { name: "SBNation — Day 7 Portugal vs DR Congo", url: "https://weaintgotnohistory.sbnation.com/chelsea-fc-international-duty/169493/2026-world-cup-day-7-portugal-vs-dr-congo-england-vs-croatia-ghana-vs-panama-uzbekistan-vs-colombia", kind: "referencia" },
      { name: "X — busqueda Portugal RD Congo", url: "https://x.com/search?q=Portugal%20DR%20Congo%20World%20Cup%202026&src=typed_query", kind: "tendencia" },
      { name: "Reddit r/soccer — busqueda Portugal DR Congo", url: "https://www.reddit.com/r/soccer/search/?q=Portugal%20DR%20Congo%20World%20Cup%202026&restrict_sr=1&sort=new", kind: "conversacion" },
    ],
    imageUrl: "/images/experience-radar/mundial-2026/portugal-rd-congo-previa.jpg",
    imageAlt: "Cristiano Ronaldo durante la previa de Portugal antes del debut frente a RD Congo",
    imageCredit: "The Guardian",
    imageSourceUrl: "https://www.theguardian.com/football/2026/jun/17/portugal-cristiano-ronaldo-world-cup-drc",
    emotionalRadar: { euforia: 74, confianza: 70, ansiedad: 48, frustracion: 16, incertidumbre: 54, optimismo: 76 },
    analyzedAt: "2026-06-17T09:42:00.000Z",
    teamsData: [
      { team: "Portugal", expectedEmotion: "Confianza de favorito con presion de iniciar limpio.", dominantConversation: "Nueva generacion, control del Grupo K y necesidad de no ceder el relato.", fanConfidence: "Alta, aunque vigilante del primer tramo.", mainNarrative: "El favorito que debe convertir jerarquia en calma.", userExperience: { expectativa: "La hinchada portuguesa busca horario, once y senales de renovacion; la conversacion digital se concentra en si el equipo puede mandar desde el primer partido." } },
      { team: "RD Congo", expectedEmotion: "Orgullo de regreso y ansiedad por legitimarse.", dominantConversation: "Volver al Mundial y demostrar que el debut no sera solo defensivo.", fanConfidence: "Media, sostenida por identidad y novedad.", mainNarrative: "El regreso que busca una escena propia.", userExperience: { expectativa: "La aficion congolesa consume el partido como hito de pertenencia: mas que previa tactica, hay busquedas de transmision, identidad y memoria de regreso." } },
    ],
  }),
  analyzedUpcomingMatch({
    date: "2026-06-17",
    kickoffAt: "2026-06-17T20:00:00.000Z",
    slug: "inglaterra-croacia-mundial-2026",
    teams: ["Inglaterra", "Croacia"],
    group: "Grupo L",
    seoTitle: "Inglaterra vs Croacia: previa, memoria reciente y radar emocional del Grupo L",
    hook: "Inglaterra y Croacia abren un duelo de alto recuerdo competitivo donde la expectativa pesa tanto como el presente",
    quickSummary: "Inglaterra vs Croacia entra en la ventana de 12 horas desde el corte local. ESPN lo programa para el 17 de junio a las 4 p. m. ET en Arlington; Dallas FWC confirma el horario local de 3 p. m. CT. La previa se mueve entre el liderazgo de Kane, el ciclo de Tuchel y la memoria croata de torneos recientes.",
    whatHappened: "La previa no es neutra: Inglaterra carga expectativa de plantilla y un historial de ansiedad en grandes torneos; Croacia llega con memoria competitiva, dudas por renovacion y el peso simbolico de Modric. La experiencia digital esperada sera de comparacion constante: nombres, edad, gestion emocional y cuanto tarda cada hinchada en convertir el debut en confianza o inquietud.",
    uxFinding: "Las experiencias con historia previa necesitan contexto visible: la audiencia no evalua solo el presente, tambien compara contra memorias emocionales anteriores.",
    keyPlays: ["15:00 CT / 16:00 ET / 15:00 Bogota: inicio en Dallas Stadium.", "Inglaterra debuta en el Grupo L bajo alta expectativa.", "Croacia vuelve a activar memoria de semifinales y cruces recientes ante Inglaterra."],
    statements: ["ESPN lista Inglaterra vs Croacia para el 17 de junio a las 4 p. m. ET.", "Dallas FWC confirma el partido en Arlington a las 3 p. m. CT.", "Times of India presenta el cruce como uno de los focos centrales del 17 de junio."],
    sources: [
      { name: "ESPN — calendario Mundial 2026", url: "https://www.espn.com/soccer/story/_/id/48939282/2026-fifa-world-cup-fixtures-results-match-schedule-group-stage-knockout-rounds-bracket", kind: "referencia" },
      { name: "Dallas FWC 26 — England vs Croatia", url: "https://www.dallasfwc26.com/our-venues/match-schedule/", kind: "oficial" },
      { name: "Times of India — partidos del 17 de junio", url: "https://timesofindia.indiatimes.com/sports/football/fifa-world-cup/fifa-world-cup-2026-matches-today-harry-kanes-england-face-croatia-colombia-begin-campaign-as-four-games-take-center-stage/articleshow/131791456.cms", kind: "referencia" },
      { name: "X — busqueda England Croatia 2026", url: "https://x.com/search?q=England%20Croatia%20World%20Cup%202026&src=typed_query", kind: "tendencia" },
      { name: "Reddit r/soccer — busqueda England Croatia", url: "https://www.reddit.com/r/soccer/search/?q=England%20Croatia%20World%20Cup%202026&restrict_sr=1&sort=new", kind: "conversacion" },
    ],
    imageUrl: "/images/experience-radar/mundial-2026/inglaterra-croacia-previa.jpg",
    imageAlt: "Thomas Tuchel dirige la preparacion de Inglaterra antes del debut frente a Croacia",
    imageCredit: "The Guardian",
    imageSourceUrl: "https://www.theguardian.com/football/2026/jun/17/thomas-tuchel-world-cup-opener-england-croatia",
    emotionalRadar: { euforia: 78, confianza: 70, ansiedad: 58, frustracion: 18, incertidumbre: 50, optimismo: 76 },
    analyzedAt: "2026-06-17T09:45:00.000Z",
    teamsData: [
      { team: "Inglaterra", expectedEmotion: "Expectativa alta con ansiedad historica de debut grande.", dominantConversation: "Kane, Tuchel, talento acumulado y necesidad de no empezar con dudas.", fanConfidence: "Alta pero volatil.", mainNarrative: "El candidato que debe mostrar cohesion antes que nombres.", userExperience: { expectativa: "La hinchada inglesa consume alineaciones, debates de roles y comparaciones con torneos anteriores; la ansiedad digital suele subir antes del primer error." } },
      { team: "Croacia", expectedEmotion: "Orgullo competitivo con incertidumbre por renovacion.", dominantConversation: "Modric, memoria de 2018/2022 y capacidad de sostener prestigio.", fanConfidence: "Media-alta desde la experiencia, no desde favoritismo.", mainNarrative: "El equipo que usa memoria de torneos como escudo emocional.", userExperience: { expectativa: "La aficion croata se mueve menos por volumen y mas por identidad: clips de lideres, orgullo de ciclo y preguntas sobre piernas para competir otra vez." } },
    ],
  }),
  finishedMatch({
    date: "2026-06-17",
    kickoffAt: "2026-06-17T17:00:00.000Z",
    slug: "portugal-rd-congo-mundial-2026",
    group: "Grupo K",
    home: "Portugal",
    away: "RD Congo",
    homeGoals: 1,
    awayGoals: 1,
    scoreDetail: "Portugal: Joao Neves 6'. RD Congo: Yoane Wissa 45+5'.",
    seoTitle: "Portugal 1-1 RD Congo: Wissa freno a Cristiano y abrio el Grupo K",
    hook: "Portugal golpeo pronto, pero RD Congo transformo el cierre del primer tiempo en un punto historico.",
    matchSummary: "Portugal y RD Congo empataron 1-1 en Houston. Joao Neves marco al 6', pero Yoane Wissa igualo en el 45+5' y le dio a los congoleses su primer gol y su primer punto mundialista.",
    quickSummary: "Portugal 1-1 RD Congo: el favorito marco temprano, no liquido y termino atrapado por la respuesta mas simbolica del rival. El empate reabre por completo el Grupo K.",
    whatHappened: "Portugal parecio confirmar el guion con el cabezazo de Joao Neves a los seis minutos, pero no logro convertir ese dominio inicial en cierre. RD Congo sostuvo el primer golpe, encontro confianza y empato con Yoane Wissa justo antes del descanso. Ese 45+5' cambio el partido y tambien la emocion dominante. El segundo tiempo ya no se jugo desde la jerarquia lusa sino desde la incertidumbre: Cristiano Ronaldo fallo una opcion clara y el gol acrobatico de Joao Cancelo no conto por fuera de juego. El 1-1 deja a Portugal con frustracion funcional y a RD Congo con una irrupcion de pertenencia plena.",
    aiSummary: "Portugal empato 1-1 con RD Congo tras adelantarse por Joao Neves y ceder el empate a Yoane Wissa. Experience Radar lee el partido como un caso de control que no se convierte en cierre: basta una respuesta simbolica fuerte del retador para que toda la percepcion cambie de manos.",
    uxFinding: "Cuando la experiencia promete control absoluto y no lo sostiene, una sola senal del retador basta para reescribir la confianza del usuario.",
    keyPlays: ["6': Joao Neves abre de cabeza tras centro de Pedro Neto.", "45+5': Yoane Wissa empata de cabeza y firma el primer gol mundialista de RD Congo.", "54': el gol acrobatico de Joao Cancelo no cuenta por fuera de juego.", "73': Cristiano Ronaldo falla la opcion mas clara del segundo tiempo."],
    controversies: ["El segundo gol de Portugal no subio por fuera de juego de Joao Cancelo.", "La gestion portuguesa del 1-0 quedo bajo escrutinio tras no ampliar la ventaja."],
    statements: ["FIFA remarco que RD Congo consiguio su primer gol y su primer punto en el Mundial.", "Win Sports encuadro el 1-1 como una de las primeras sorpresas del Grupo K.", "ESPN cerro el resultado oficial en empate."],
    combined: {
      expectativa: { euforia: 74, confianza: 70, ansiedad: 48, frustracion: 16, incertidumbre: 54, optimismo: 76 },
      realidad: { euforia: 62, confianza: 50, ansiedad: 72, frustracion: 54, incertidumbre: 68, optimismo: 58 },
      percepcion: { euforia: 70, confianza: 58, ansiedad: 46, frustracion: 50, incertidumbre: 52, optimismo: 64 },
    },
    teamsData: [
      {
        team: "Portugal",
        expectedEmotion: "Confianza alta de favorito con presion por iniciar limpio.",
        dominantConversation: "Cristiano, jerarquia de plantilla y necesidad de mandar desde la primera fecha.",
        fanConfidence: "Media-alta, pero golpeada por no haber cerrado el partido.",
        mainNarrative: "El favorito que abrio rapido, pero dejo crecer la duda.",
        howTheyArrived: "Con expectativa de control y un debut tratado como tramite inicial.",
        whatHappened: "Marco al 6', genero sensacion de partido administrable y despues perdio autoridad emocional.",
        expectationVsReality: "La expectativa era un estreno limpio; la realidad fue un empate que hace visible la vulnerabilidad.",
        mood: "Frustracion sobria.",
        behaviorEffect: "La hinchada portuguesa pasa de los clips de bienvenida a preguntas sobre eficacia y ritmo real.",
        current: { euforia: 54, confianza: 56, ansiedad: 62, frustracion: 64, incertidumbre: 58, optimismo: 60 },
        predicted: { euforia: 68, confianza: 66, ansiedad: 44, frustracion: 34, incertidumbre: 42, optimismo: 70 },
        userExperience: {
          realidad: "La experiencia digital portuguesa salto del alivio temprano a una busqueda compulsiva de ocasiones perdidas y explicaciones tacticas.",
          percepcion: "En X, el empate dispara la pregunta de si Portugal controla de verdad o solo monopoliza la atencion.",
        },
      },
      {
        team: "RD Congo",
        expectedEmotion: "Orgullo de regreso y necesidad de demostrar que no habia vuelto solo a resistir.",
        dominantConversation: "Regreso historico, pertenencia y deseo de no quedar reducido al papel de invitado.",
        fanConfidence: "Alta en terminos emocionales: el punto se vive como validacion plena.",
        mainNarrative: "El retorno que encontro un momento historico y lo convirtio en identidad.",
        howTheyArrived: "Con una previa dominada por la novedad del regreso y la energia simbolica de volver a la Copa.",
        whatHappened: "Soporto el golpe inicial, encontro el empate con Wissa y defendio el punto con calma creciente.",
        expectationVsReality: "La expectativa era competir con dignidad; la realidad fue salir con un resultado que altera el grupo.",
        mood: "Euforia serena con orgullo colectivo.",
        behaviorEffect: "La aficion congolesa se apropia del punto como entrada legitima al torneo y eleva a Wissa como simbolo de presencia.",
        current: { euforia: 86, confianza: 78, ansiedad: 34, frustracion: 20, incertidumbre: 38, optimismo: 82 },
        predicted: { euforia: 74, confianza: 70, ansiedad: 40, frustracion: 28, incertidumbre: 44, optimismo: 76 },
        userExperience: {
          realidad: "La audiencia congolesa vivio el 45+5' como el instante de entrada real al torneo, con circulacion alta de clips y titulares historicos.",
          percepcion: "Reddit y X empujan una lectura de sorpresa legitima: ya no es un actor decorativo del grupo.",
        },
      },
    ],
    lessons: [
      { term: "Punto de referencia", explanation: "El 1-0 temprano hizo que Portugal evaluara todo el partido desde la idea de que ya debia tenerlo resuelto." },
      { term: "Pico narrativo", explanation: "El cabezazo de Wissa en el 45+5' domina el recuerdo porque corta el guion justo antes de la pausa." },
      { term: "Prueba social", explanation: "Un empate historico activa pertenencia y eleva instantaneamente la confianza de la hinchada menos favorecida." },
    ],
    humanBehavior: "Un sistema favorito pierde autoridad rapido cuando no convierte dominio temprano en cierre; el retador gana pertenencia con un solo momento simbolico bien situado.",
    cognitiveBiases: ["Punto de referencia", "Regla pico-fin", "Prueba social"],
    emotionalReaction: "Portugal paso del control a la inquietud; RD Congo del respeto previo a la celebracion de legitimidad.",
    digitalPatterns: "X giro alrededor de Wissa, Cristiano y la sorpresa del Grupo K, mientras Reddit elevo el empate como una de las alteraciones del dia.",
    productApplications: [
      { sector: "Producto digital", application: "No basta con mostrar un avance temprano: si el usuario no percibe cierre, la confianza vuelve a cero muy rapido." },
      { sector: "Streaming deportivo", application: "Marcar hitos emocionales claros en el timeline ayuda a entender por que un partido cambia de manos sin un aluvion de goles." },
      { sector: "Contenido SEO/GEO", application: "Titulos con marcador y protagonista historico capturan la busqueda factual y abren paso a una lectura mas profunda del comportamiento." },
    ],
    fanPulse: { concerns: ["La eficacia de Portugal", "La capacidad de RD Congo para sostener el impulso", "El nuevo equilibrio del Grupo K"], emotions: ["Frustracion portuguesa", "Orgullo congoles", "Sorpresa neutral"], frustrations: ["El favoritismo portugues no se tradujo en cierre", "Cristiano no encontro el gol de la victoria"], enthusiasm: ["El cabezazo de Wissa", "El primer punto mundialista de RD Congo", "El grupo queda completamente abierto"] },
    sources: [
      { name: "FIFA â€” Portugal 1-1 RD Congo", url: "https://www.fifa.com/en/tournaments/mens/worldcup/canadamexicousa2026/articles/portugal-congo-dr-highlights-match-report", kind: "oficial" },
      { name: "ESPN â€” resultados del Mundial 2026", url: "https://www.espn.com/soccer/story/_/id/48939282/2026-fifa-world-cup-fixtures-results-match-schedule-group-stage-knockout-rounds-bracket", kind: "referencia" },
      { name: "Win Sports â€” Portugal empato con RD Congo", url: "https://www.winsports.co/futbol-internacional/noticias/en-vivo-portugal-vs-rd-congo-minuto-a-minuto-y-goles-copa-mundial-de-la-fifa-439333", kind: "referencia" },
      { name: "X â€” busqueda Portugal RD Congo Wissa", url: "https://x.com/search?q=Portugal%20RD%20Congo%20Wissa%20World%20Cup&src=typed_query", kind: "tendencia" },
      { name: "Reddit r/soccer â€” busqueda Portugal RD Congo", url: "https://www.reddit.com/r/soccer/search/?q=Portugal%201-1%20DR%20Congo%20World%20Cup%202026&restrict_sr=1&sort=new", kind: "conversacion" },
    ],
    imageUrl: "/images/experience-radar/mundial-2026/portugal-rd-congo.jpg",
    imageAlt: "RD Congo celebra el empate 1-1 ante Portugal en Houston",
    imageCredit: "Win Sports / @FIFAcom",
    imageSourceUrl: "https://www.winsports.co/futbol-internacional/noticias/en-vivo-portugal-vs-rd-congo-minuto-a-minuto-y-goles-copa-mundial-de-la-fifa-439333",
    previewImageUrl: "/images/experience-radar/mundial-2026/portugal-rd-congo-previa.jpg",
    previewImageAlt: "Cristiano Ronaldo durante la previa de Portugal antes del debut frente a RD Congo",
    previewImageCredit: "The Guardian",
    previewImageSourceUrl: "https://www.theguardian.com/football/2026/jun/17/portugal-cristiano-ronaldo-world-cup-drc",
    analyzedAt: "2026-06-18T09:50:00.000Z",
    nextOpponents: { Portugal: "Uzbekistan", "RD Congo": "Colombia" },
  }),
  finishedMatch({
    date: "2026-06-17",
    kickoffAt: "2026-06-17T20:00:00.000Z",
    slug: "inglaterra-croacia-mundial-2026",
    group: "Grupo L",
    home: "Inglaterra",
    away: "Croacia",
    homeGoals: 4,
    awayGoals: 2,
    scoreDetail: "Inglaterra: Harry Kane 12' (penal), 42'; Jude Bellingham 47'; Marcus Rashford 85'. Croacia: Maturina 35'; Musa 45+6'.",
    seoTitle: "Inglaterra 4-2 Croacia: Kane y Bellingham reordenaron un estreno caotico",
    hook: "Inglaterra convirtio un debut volatil en una demostracion de respuesta cada vez que Croacia amenazo con romperle el relato.",
    matchSummary: "Inglaterra vencio 4-2 a Croacia en Arlington. Kane marco dos veces, Maturina y Musa empataron para los croatas, Bellingham devolvio la ventaja al inicio del segundo tiempo y Rashford cerro el partido al 85'.",
    quickSummary: "Inglaterra 4-2 Croacia: el marcador final suena solido, pero el partido fue un intercambio de golpes hasta el arranque del complemento. Inglaterra salio reforzada por su capacidad de responder.",
    whatHappened: "El partido empezo como una afirmacion inglesa con el penal convertido por Kane, pero Croacia encontro en Maturina el primer recordatorio de que la jerarquia no bastaba por si sola. Kane devolvio la ventaja antes del descanso y, cuando parecia que Inglaterra recuperaba el control, Musa firmo el 2-2 en el 45+6' para cargar el entretiempo de incertidumbre. El quiebre emocional llego casi de inmediato: Bellingham marco al 47' y le devolvio a Inglaterra la capacidad de narrar el partido desde el protagonismo. Rashford, ya en el cierre, puso el 4-2 definitivo que FIFA y ESPN registran como prueba de candidatura.",
    aiSummary: "Inglaterra supero 4-2 a Croacia con doblete de Kane y goles de Bellingham y Rashford, tras ser empatada dos veces. Experience Radar lee el caso como una demostracion de resiliencia visible: la audiencia tolera el caos si su equipo responde rapido y con señales claras de control.",
    uxFinding: "Cuando la promesa principal tambalea, la recuperacion inmediata vale mas que un dominio largo pero silencioso.",
    keyPlays: ["12': Kane abre de penal.", "35': Maturina empata con remate de media distancia.", "42': Kane devuelve la ventaja inglesa.", "45+6': Musa firma el 2-2.", "47': Bellingham marca el 3-2 en el arranque del segundo tiempo.", "85': Rashford cierra el 4-2 definitivo."],
    controversies: [],
    statements: ["FIFA remarco el doblete de Kane y el peso inmediato del gol de Bellingham tras el descanso.", "ESPN cerro el resultado oficial en 4-2 para Inglaterra.", "Win Sports describio el cruce como un partidazo de arranque para el Grupo L."],
    combined: {
      expectativa: { euforia: 78, confianza: 70, ansiedad: 58, frustracion: 18, incertidumbre: 50, optimismo: 76 },
      realidad: { euforia: 82, confianza: 68, ansiedad: 70, frustracion: 38, incertidumbre: 62, optimismo: 76 },
      percepcion: { euforia: 88, confianza: 84, ansiedad: 28, frustracion: 24, incertidumbre: 34, optimismo: 86 },
    },
    teamsData: [
      {
        team: "Inglaterra",
        expectedEmotion: "Expectativa muy alta y ansiedad historica por empezar un gran torneo sin dudas.",
        dominantConversation: "Kane, Bellingham, Tuchel y la necesidad de que el talento se viera en estructura real.",
        fanConfidence: "Alta tras el 4-2, sobre todo por la capacidad de responder dos veces.",
        mainNarrative: "El candidato que no nego el caos, pero lo resolvio mejor que su rival.",
        howTheyArrived: "Con presion de favoritismo y memoria de debuts ingleses emocionalmente inestables.",
        whatHappened: "Cada vez que Croacia empato, Inglaterra encontro una respuesta visible y rapida.",
        expectationVsReality: "La expectativa era control lineal; la realidad fue un examen de resiliencia ofensiva.",
        mood: "Alivio euforico.",
        behaviorEffect: "La hinchada inglesa recicla rapido el nervio del 2-2 hacia clips de Kane, Bellingham y Rashford como pruebas de autoridad.",
        current: { euforia: 90, confianza: 86, ansiedad: 24, frustracion: 18, incertidumbre: 28, optimismo: 90 },
        predicted: { euforia: 80, confianza: 82, ansiedad: 34, frustracion: 18, incertidumbre: 36, optimismo: 84 },
        userExperience: {
          realidad: "Durante el partido, la experiencia inglesa salto entre celebracion y alarma; el 47' de Bellingham funciono como reinicio emocional instantaneo.",
          percepcion: "En X, la memoria del debut queda anclada al doblete de Kane y a la respuesta inmediata tras el descanso.",
        },
      },
      {
        team: "Croacia",
        expectedEmotion: "Orgullo competitivo con mezcla de experiencia y dudas por renovacion.",
        dominantConversation: "Memoria de torneos grandes, liderazgo de Modric y capacidad de no desordenarse ante un favorito.",
        fanConfidence: "Media: la derrota duele menos por el nivel de competencia mostrado.",
        mainNarrative: "El veterano que encontro dos veces el empate, pero no sostuvo el tercer golpe ingles.",
        howTheyArrived: "Con memoria fuerte y un relato de resistencia inteligente.",
        whatHappened: "Empato dos veces, pero el gol de Bellingham al arranque del complemento desajusto su energia.",
        expectationVsReality: "La realidad confirma que Croacia compite, aunque sufre cuando el partido se acelera.",
        mood: "Frustracion orgullosa.",
        behaviorEffect: "La aficion croata mezcla elogio al caracter con reproches por conceder demasiado pronto despues del entretiempo.",
        current: { euforia: 42, confianza: 58, ansiedad: 56, frustracion: 66, incertidumbre: 54, optimismo: 56 },
        predicted: { euforia: 56, confianza: 62, ansiedad: 48, frustracion: 40, incertidumbre: 46, optimismo: 60 },
        userExperience: {
          realidad: "La conversacion croata premio la capacidad de volver dos veces al partido, pero el 47' ingles concentro la sensacion de oportunidad perdida.",
          percepcion: "Reddit reordena la lectura hacia un Croacia aun competitivo, aunque menos estable cuando el rival acelera.",
        },
      },
    ],
    lessons: [
      { term: "Recuperacion visible", explanation: "Una respuesta inmediata despues de un golpe fuerte restaura mas confianza que un dominio difuso." },
      { term: "Regla pico-fin", explanation: "El 2-2 de Musa elevo la ansiedad, pero el 4-2 de Rashford y el doblete de Kane terminan gobernando el recuerdo." },
      { term: "Memoria comparativa", explanation: "Las hinchadas no viven el debut en vacio: lo comparan con torneos previos y con identidades ya establecidas." },
    ],
    humanBehavior: "La audiencia acepta un debut caotico si percibe que su equipo sabe responder mejor que el rival cada vez que el contexto se complica.",
    cognitiveBiases: ["Regla pico-fin", "Efecto de recencia", "Memoria comparativa"],
    emotionalReaction: "Inglaterra alterno nervio y alivio antes de cerrar en euforia; Croacia paso del orgullo competitivo a la sensacion de no haber aprovechado sus ventanas.",
    digitalPatterns: "X concentro el relato en Kane, Bellingham y el ida y vuelta del primer tiempo; Reddit elevo el partido como uno de los mejores arranques del torneo.",
    productApplications: [
      { sector: "Producto digital", application: "Cuando un flujo se interrumpe, una respuesta inmediata y visible vale mas que una estabilidad aparente pero tardia." },
      { sector: "Streaming deportivo", application: "Marcar los cambios de narrativa ayuda a que el usuario entienda por que un partido se siente mucho mas grande que su resumen estadistico." },
      { sector: "Contenido SEO/GEO", application: "Un titular con marcador, figuras y giro emocional responde mejor a la intencion de busqueda postpartido." },
    ],
    fanPulse: { concerns: ["La estabilidad defensiva inglesa", "La capacidad croata para sostener ritmo alto", "El peso del siguiente partido en el Grupo L"], emotions: ["Alivio ingles", "Orgullo croata", "Adrenalina neutral"], frustrations: ["Croacia concedio demasiado pronto tras el descanso", "Inglaterra no pudo gestionar calma tras sus ventajas"], enthusiasm: ["Doblete de Kane", "Impacto de Bellingham", "Uno de los partidos mas intensos de la jornada"] },
    sources: [
      { name: "FIFA â€” Inglaterra 4-2 Croacia", url: "https://www.fifa.com/en/tournaments/mens/worldcup/canadamexicousa2026/articles/england-croatia-highlights-match-report", kind: "oficial" },
      { name: "ESPN â€” resultados del Mundial 2026", url: "https://www.espn.com/soccer/story/_/id/48939282/2026-fifa-world-cup-fixtures-results-match-schedule-group-stage-knockout-rounds-bracket", kind: "referencia" },
      { name: "Win Sports â€” Inglaterra vs Croacia", url: "https://www.winsports.co/futbol-internacional/noticias/en-vivo-inglaterra-vs-croacia-minuto-a-minuto-y-goles-copa-mundial-de-la-fifa-439363", kind: "referencia" },
      { name: "X â€” busqueda England Croatia Kane Bellingham", url: "https://x.com/search?q=England%20Croatia%20Kane%20Bellingham%20World%20Cup&src=typed_query", kind: "tendencia" },
      { name: "Reddit r/soccer â€” busqueda England Croatia 4-2", url: "https://www.reddit.com/r/soccer/search/?q=England%204-2%20Croatia%20World%20Cup%202026&restrict_sr=1&sort=new", kind: "conversacion" },
    ],
    imageUrl: "/images/experience-radar/mundial-2026/inglaterra-croacia.jpg",
    imageAlt: "Inglaterra celebra el 4-2 sobre Croacia en Arlington",
    imageCredit: "Win Sports",
    imageSourceUrl: "https://www.winsports.co/futbol-internacional/noticias/en-vivo-inglaterra-vs-croacia-minuto-a-minuto-y-goles-copa-mundial-de-la-fifa-439363",
    previewImageUrl: "/images/experience-radar/mundial-2026/inglaterra-croacia-previa.jpg",
    previewImageAlt: "Thomas Tuchel dirige la preparacion de Inglaterra antes del debut frente a Croacia",
    previewImageCredit: "The Guardian",
    previewImageSourceUrl: "https://www.theguardian.com/football/2026/jun/17/thomas-tuchel-world-cup-opener-england-croatia",
    analyzedAt: "2026-06-18T09:58:00.000Z",
    nextOpponents: { Inglaterra: "Ghana", Croacia: "Panama" },
  }),
  analyzedUpcomingMatch({
    date: "2026-06-18",
    kickoffAt: "2026-06-18T16:00:00.000Z",
    slug: "chequia-sudafrica-mundial-2026",
    teams: ["Chequia", "Sudafrica"],
    group: "Grupo A",
    seoTitle: "Chequia vs Sudafrica: previa, urgencia y radar emocional de un duelo sin margen",
    hook: "Chequia y Sudafrica entran al partido con presion temprana: una derrota las acerca demasiado pronto a la salida.",
    quickSummary: "Chequia y Sudafrica abren la jornada del 18 de junio en Atlanta con un cruce de supervivencia. FIFA y Win Sports lo ubican a las 11:00 a. m. de Colombia / 12:00 p. m. ET, y el contexto es directo: ambos quedaron por detras de Mexico y Corea del Sur tras la primera fecha.",
    whatHappened: "La previa de este partido no se mueve por favoritismo, sino por urgencia. Sudafrica llega golpeada por la derrota inaugural ante Mexico; Chequia, por haber dejado escapar su ventaja frente a Corea del Sur. En X y Reddit la conversacion gira menos sobre estrellas y mas sobre tolerancia al error: quien se desordene primero puede quedar a un paso de la eliminacion. Para Experience Radar, es un partido de ansiedad funcional, donde la experiencia del fan depende de si su equipo convierte el miedo temprano en claridad competitiva.",
    uxFinding: "Cuando una experiencia nace sin margen, la audiencia necesita senales rapidas de control; si no aparecen, la ansiedad reemplaza al plan.",
    keyPlays: ["11:00 Bogota / 12:00 ET: inicio en Atlanta Stadium.", "Las dos selecciones llegan sin puntos tras la primera fecha del Grupo A.", "La designacion arbitral y el margen minimo amplifican la atencion al detalle."],
    statements: ["FIFA presenta el cruce como un partido para evitar una salida temprana del torneo.", "Win Sports mantiene el partido en su grilla de las 11:00 a. m. de Colombia.", "La previa oficial de Matchday 8 lo trata como un cruce de urgencia competitiva."],
    sources: [
      { name: "FIFA â€” Czechia vs South Africa", url: "https://www.fifa.com/en/tournaments/mens/worldcup/canadamexicousa2026/articles/czechia-south-africa-live-stream-team-news-tickets", kind: "oficial" },
      { name: "FIFA â€” previa Matchday 8", url: "https://www.fifa.com/en/tournaments/mens/worldcup/canadamexicousa2026/articles/preview-matchday-eight", kind: "oficial" },
      { name: "Win Sports â€” calendario Mundial 2026", url: "https://www.winsports.co/futbol-internacional/noticias/copa-mundial-de-la-fifa-2026-mira-el-calendario-completo-437848", kind: "referencia" },
      { name: "X â€” busqueda Czechia South Africa World Cup", url: "https://x.com/search?q=Czechia%20South%20Africa%20World%20Cup%202026&src=typed_query", kind: "tendencia" },
      { name: "Reddit r/soccer â€” busqueda Czechia South Africa", url: "https://www.reddit.com/r/soccer/search/?q=Czechia%20South%20Africa%20World%20Cup%202026&restrict_sr=1&sort=new", kind: "conversacion" },
    ],
    imageUrl: "/images/experience-radar/mundial-2026/chequia-sudafrica-previa.jpg",
    imageAlt: "Adam Hlozek en una imagen editorial de Chequia antes del duelo ante Sudafrica",
    imageCredit: "AP",
    imageSourceUrl: "https://apnews.com/article/czech-squad-world-cup-sochrek-c6ab1d1855e1509579ef5b9a022c7951",
    emotionalRadar: { euforia: 58, confianza: 54, ansiedad: 72, frustracion: 34, incertidumbre: 70, optimismo: 56 },
    analyzedAt: "2026-06-18T09:28:00.000Z",
    teamsData: [
      { team: "Chequia", expectedEmotion: "Nervio competitivo por haber dejado ir una ventaja en el debut.", dominantConversation: "Como corregir la fragilidad emocional del cierre ante Corea del Sur.", fanConfidence: "Media-baja hasta ver una reaccion temprana.", mainNarrative: "El equipo que necesita demostrar que su primer golpe si puede sostenerse.", userExperience: { expectativa: "La aficion checa mezcla revision del 2-1 ante Corea con busquedas de once, ajustes y tolerancia minima a un mal arranque." } },
      { team: "Sudafrica", expectedEmotion: "Urgencia defensiva y deseo de que el debut ante Mexico no defina toda la narrativa.", dominantConversation: "Orden, disciplina y como recuperar autoestima tras la derrota inaugural.", fanConfidence: "Media, sostenida por la necesidad mas que por evidencias recientes.", mainNarrative: "La seleccion que juega por permanencia emocional y matematica al mismo tiempo.", userExperience: { expectativa: "La aficion sudafricana consume la previa como examen de reaccion: menos hype, mas preguntas sobre caracter, orden y respuesta al primer golpe." } },
    ],
  }),
  analyzedUpcomingMatch({
    date: "2026-06-18",
    kickoffAt: "2026-06-18T19:00:00.000Z",
    slug: "suiza-bosnia-mundial-2026",
    teams: ["Suiza", "Bosnia y Herzegovina"],
    group: "Grupo B",
    seoTitle: "Suiza vs Bosnia: previa, equilibrio y radar emocional del grupo mas parejo",
    hook: "Suiza y Bosnia llegan con la sensacion de que un acierto cambia toda la jerarquia del grupo.",
    quickSummary: "Suiza enfrenta a Bosnia y Herzegovina a las 2:00 p. m. de Colombia / 12:00 p. m. PT en Los Angeles Stadium. Tras los empates de la primera fecha del Grupo B, el cruce aparece como una oportunidad real de despegar en una zona donde todos siguen con margen.",
    whatHappened: "La previa vive de equilibrio puro. Suiza salio de su 1-1 con Catar con la sensacion de haber dejado escapar control; Bosnia se fue del 1-1 ante Canada con el sabor de haber competido bien sin despegarse. FIFA recoge una lectura de presente concentrado desde el entorno bosnio, y eso resume el tono del cruce: menos grandilocuencia y mas administracion de momento. En X y Reddit no domina una figura unica; domina la idea de un grupo donde nadie logro imponer todavia su identidad.",
    uxFinding: "Cuando todos parten casi igualados, la audiencia valora mas las senales de direccion que las promesas de superioridad.",
    keyPlays: ["14:00 Bogota / 12:00 PT: inicio en Los Angeles Stadium.", "Suiza y Bosnia llegan despues de sumar un punto en la primera jornada.", "La previa oficial insiste en enfocarse en el presente y no sobrerreaccionar al primer partido."],
    statements: ["FIFA publica la previa oficial del cruce y mantiene la informacion de sede, hora y entradas.", "Sergej Barbarez pidio a Bosnia jugar feliz y presente antes de enfrentar a Suiza.", "Win Sports programa el partido a las 2:00 p. m. en Colombia."],
    sources: [
      { name: "FIFA â€” Switzerland vs Bosnia and Herzegovina", url: "https://www.fifa.com/en/tournaments/mens/worldcup/canadamexicousa2026/articles/switzerland-bosnia-and-herzegovina-live-stream-team-news-tickets", kind: "oficial" },
      { name: "FIFA â€” Barbarez pide vivir el momento", url: "https://www.fifa.com/en/articles/barbarez-bosnia-switzerland-preview", kind: "oficial" },
      { name: "Win Sports â€” programacion", url: "https://www.winsports.co/programacion", kind: "referencia" },
      { name: "X â€” busqueda Switzerland Bosnia World Cup", url: "https://x.com/search?q=Switzerland%20Bosnia%20World%20Cup%202026&src=typed_query", kind: "tendencia" },
      { name: "Reddit r/soccer â€” busqueda Switzerland Bosnia", url: "https://www.reddit.com/r/soccer/search/?q=Switzerland%20Bosnia%20World%20Cup%202026&restrict_sr=1&sort=new", kind: "conversacion" },
    ],
    imageUrl: "/images/experience-radar/mundial-2026/suiza-bosnia-previa.jpg",
    imageAlt: "Aficion bosnia en una imagen editorial antes del duelo ante Suiza",
    imageCredit: "AP",
    imageSourceUrl: "https://apnews.com/article/bosnia-st-louis-world-cup-1b1b8dd27146087e215e3d5dbf587a83",
    emotionalRadar: { euforia: 60, confianza: 58, ansiedad: 56, frustracion: 26, incertidumbre: 68, optimismo: 64 },
    analyzedAt: "2026-06-18T09:36:00.000Z",
    teamsData: [
      { team: "Suiza", expectedEmotion: "Confianza templada, con la sensacion de que el grupo aun puede inclinarse si muestra control.", dominantConversation: "Si el empate con Catar fue un aviso o solo un comienzo prudente.", fanConfidence: "Media-alta, todavia sin euforia.", mainNarrative: "El equipo que quiere ordenar el grupo desde la calma.", userExperience: { expectativa: "La aficion suiza busca formacion, repite clips del primer partido y consume la previa con control vigilante, no con ansiedad extrema." } },
      { team: "Bosnia y Herzegovina", expectedEmotion: "Esperanza competitiva con deseo de que el punto inicial tenga continuidad real.", dominantConversation: "Aprovechar el buen tono ante Canada y jugar sin perder el presente.", fanConfidence: "Media, pero creciendo.", mainNarrative: "La seleccion que siente que este grupo no pertenece a nadie todavia.", userExperience: { expectativa: "La conversacion bosnia premia el enfoque del momento: menos promesa grandiosa, mas orgullo por competir y sostenerse en partido largo." } },
    ],
  }),
  analyzedUpcomingMatch({
    date: "2026-06-18",
    kickoffAt: "2026-06-18T22:00:00.000Z",
    slug: "canada-catar-mundial-2026",
    teams: ["Canada", "Catar"],
    group: "Grupo B",
    seoTitle: "Canada vs Catar: previa, anfitrionia y radar emocional del punto de quiebre",
    hook: "Canada vuelve a jugar en casa con la necesidad de transformar pertenencia en ventaja visible, mientras Catar llega sabiendo que el grupo no castiga a nadie todavia.",
    quickSummary: "Canada y Catar juegan en Vancouver a las 5:00 p. m. de Colombia / 3:00 p. m. PT. Los dos llegan con un punto de la primera fecha y ven este partido como el punto mas directo para tomar impulso real en el Grupo B.",
    whatHappened: "La previa combina dos ansiedades distintas. Canada carga el peso de la anfitrionia y la sensacion de que un punto ante Bosnia fue insuficiente para capitalizar el entorno local. Catar, en cambio, llega desde un empate sufrido frente a Suiza que le deja abierta la puerta del grupo. En X y Reddit el partido se discute desde contexto de oportunidad: quien gane pasara de la zona gris a una posicion de mando.",
    uxFinding: "La localia promete ventaja emocional, pero si no se traduce pronto en claridad, puede convertirse en una exigencia extra para el usuario.",
    keyPlays: ["17:00 Bogota / 15:00 PT: inicio en BC Place Vancouver.", "Canada vuelve a jugar como local en un grupo donde todos siguen con margen.", "Catar llega desde un empate que mantuvo abierta toda la zona."],
    statements: ["FIFA publica la previa oficial del primer Canada vs Catar en una Copa del Mundo.", "Win Sports mantiene el partido en su franja de las 5:00 p. m. de Colombia.", "La previa de Matchday 8 de FIFA presenta el cruce como una oportunidad de impulso real."],
    sources: [
      { name: "FIFA â€” Canada vs Qatar", url: "https://www.fifa.com/en/tournaments/mens/worldcup/canadamexicousa2026/articles/canada-qatar-preview-live-stream-team-news-tickets", kind: "oficial" },
      { name: "FIFA â€” previa Matchday 8", url: "https://www.fifa.com/en/tournaments/mens/worldcup/canadamexicousa2026/articles/preview-matchday-eight", kind: "oficial" },
      { name: "Win Sports â€” programacion", url: "https://www.winsports.co/programacion", kind: "referencia" },
      { name: "X â€” busqueda Canada Qatar World Cup", url: "https://x.com/search?q=Canada%20Qatar%20World%20Cup%202026&src=typed_query", kind: "tendencia" },
      { name: "Reddit r/soccer â€” busqueda Canada Qatar", url: "https://www.reddit.com/r/soccer/search/?q=Canada%20Qatar%20World%20Cup%202026&restrict_sr=1&sort=new", kind: "conversacion" },
    ],
    imageUrl: "/images/experience-radar/mundial-2026/canada-catar-previa.jpg",
    imageAlt: "Ali Ahmed con Canada en la previa del duelo ante Catar",
    imageCredit: "AP",
    imageSourceUrl: "https://apnews.com/article/world-cup-canada-ali-ahmed-vancouver-whitecaps-20565c30a3cfde605eb258143ce1fbf6",
    emotionalRadar: { euforia: 68, confianza: 62, ansiedad: 60, frustracion: 24, incertidumbre: 62, optimismo: 70 },
    analyzedAt: "2026-06-18T09:45:00.000Z",
    teamsData: [
      { team: "Canada", expectedEmotion: "Ilusion de anfitrion mezclada con presion por convertir ambiente en puntos.", dominantConversation: "Como usar la localia de Vancouver para ponerse cerca de la clasificacion.", fanConfidence: "Media-alta, pero dependiente de un arranque visible.", mainNarrative: "El coanfitrion que no puede dejar pasar otra ventana de impulso.", userExperience: { expectativa: "La aficion canadiense consume la previa entre orgullo local, preguntas de logistica y necesidad de una senal rapida de autoridad." } },
      { team: "Catar", expectedEmotion: "Calma vigilante tras comprobar que el grupo sigue abierto.", dominantConversation: "Si el empate con Suiza fue un piso real para competir toda la fase.", fanConfidence: "Media y creciendo.", mainNarrative: "El equipo que llega sin ruido excesivo, pero con margen real de sorpresa.", userExperience: { expectativa: "La conversacion qatari se mueve alrededor del orden, la resistencia y la idea de golpear sin cargar todo el peso del relato." } },
    ],
  }),
  analyzedUpcomingMatch({
    date: "2026-06-18",
    kickoffAt: "2026-06-19T01:00:00.000Z",
    slug: "mexico-corea-del-sur-mundial-2026",
    teams: ["Mexico", "Corea del Sur"],
    group: "Grupo A",
    seoTitle: "Mexico vs Corea del Sur: previa, clasificacion y radar emocional del partido bisagra",
    hook: "Mexico y Corea del Sur llegan a Guadalajara con la posibilidad real de asegurar su pase y con dos entusiasmos de naturaleza distinta.",
    quickSummary: "Mexico y Corea del Sur cierran la jornada del 18 de junio a las 8:00 p. m. de Colombia / 7:00 p. m. local en Guadalajara. Los dos ganaron en la primera fecha y ahora juegan un partido que puede definir al clasificado principal del Grupo A.",
    whatHappened: "La previa es enorme porque enfrenta dos victorias que nacieron de emociones distintas. Mexico abrio el torneo con una noche de anfitrionia cargada de simbolismo y ahora debe transformar ese orgullo en continuidad menos ruidosa y mas precisa. Corea del Sur llega desde una remontada ante Chequia que reforzo su identidad de respuesta. FIFA presenta el partido como oportunidad de clasificacion, y eso empuja una conversacion muy intensa en X y Reddit: no se trata solo de sumar tres puntos, sino de comprobar si el impulso mexicano se sostiene contra un rival que ya mostro capacidad para reescribir el partido en vivo.",
    uxFinding: "Cuando dos experiencias positivas chocan tan pronto, la audiencia busca pruebas de consistencia, no solo destellos emotivos.",
    keyPlays: ["20:00 Bogota / 19:00 local Guadalajara: inicio del partido.", "Mexico puede sellar su pase en casa si vuelve a imponerse.", "Corea del Sur llega despues de remontar a Chequia y entra con confianza creciente."],
    statements: ["FIFA enmarca el duelo como una oportunidad de clasificacion para anfitriones y surcoreanos.", "Win Sports fija el partido a las 8:00 p. m. de Colombia en su programacion.", "La previa oficial de Matchday 8 lo trata como uno de los cruces centrales del dia."],
    sources: [
      { name: "FIFA â€” Mexico vs Korea Republic", url: "https://www.fifa.com/en/tournaments/mens/worldcup/canadamexicousa2026/articles/mexico-korea-republic-preview-live-stream-team-news-tickets", kind: "oficial" },
      { name: "FIFA â€” previa Matchday 8", url: "https://www.fifa.com/en/tournaments/mens/worldcup/canadamexicousa2026/articles/preview-matchday-eight", kind: "oficial" },
      { name: "Win Sports â€” programacion", url: "https://www.winsports.co/programacion", kind: "referencia" },
      { name: "X â€” busqueda Mexico Korea Republic World Cup", url: "https://x.com/search?q=Mexico%20Korea%20Republic%20World%20Cup%202026&src=typed_query", kind: "tendencia" },
      { name: "Reddit r/soccer â€” busqueda Mexico Korea Republic", url: "https://www.reddit.com/r/soccer/search/?q=Mexico%20Korea%20Republic%20World%20Cup%202026&restrict_sr=1&sort=new", kind: "conversacion" },
    ],
    imageUrl: "/images/experience-radar/mundial-2026/mexico-corea-del-sur-previa.jpg",
    imageAlt: "Corea del Sur en entrenamiento antes del duelo ante Mexico",
    imageCredit: "AP",
    imageSourceUrl: "https://apnews.com/article/mexico-drone-south-korea-world-cup-guadalajara-f652d627c1c6e7b8bb6e19c238dde3d3",
    emotionalRadar: { euforia: 82, confianza: 72, ansiedad: 52, frustracion: 18, incertidumbre: 44, optimismo: 80 },
    analyzedAt: "2026-06-18T09:55:00.000Z",
    teamsData: [
      { team: "Mexico", expectedEmotion: "Euforia anfitriona con la obligacion de validar que el arranque no fue solo ceremonia.", dominantConversation: "Clasificar en casa, sostener la intensidad y manejar la presion de volver a ser foco total.", fanConfidence: "Alta, aunque mas exigente que relajada.", mainNarrative: "El coanfitrion que quiere convertir fiesta en autoridad sostenida.", userExperience: { expectativa: "La hinchada mexicana vive la previa como una segunda inauguracion emocional: busca alineacion, rutas de acceso y una prueba de continuidad." } },
      { team: "Corea del Sur", expectedEmotion: "Confianza ascendente por haber remontado y por sentir que el grupo no pertenece solo al local.", dominantConversation: "Responder al entorno mexicano sin perder la valentia que aparecio ante Chequia.", fanConfidence: "Alta-moderada, apoyada en el caracter mostrado en el debut.", mainNarrative: "El equipo que quiere usar la remontada inicial como licencia para competirle al anfitrion.", userExperience: { expectativa: "La aficion surcoreana mezcla orgullo por la reaccion del primer partido con preocupacion por calor, contexto y capacidad de sostener posesiones largas en Guadalajara." } },
    ],
  }),
]

/**
 * Seed estático: artículos editoriales de ejemplo. Sirven como fallback cuando el
 * agente diario todavía no ha generado y persistido artículos en el store.
 */
export const RADAR_ARTICLE_SEED: RadarArticle[] = ARTICLE_INPUTS.map(generateRadarArticle)
const LOCKED_SEED_IMAGES = new Map(
  RADAR_ARTICLE_SEED
    .filter((article) => Boolean(article.imageUrl))
    .map((article) => [article.slug, article]),
)

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
    if (wins) {
      best.set(key, cur?.imageUrl && !a.imageUrl ? preserveImage(a, cur) : a)
    } else if (cur && !cur.imageUrl && a.imageUrl) {
      best.set(key, preserveImage(cur, a))
    }
  }
  return [...best.values()]
}

function preserveImage(article: RadarArticle, source: RadarArticle): RadarArticle {
  return {
    ...article,
    imageUrl: source.imageUrl,
    imageAlt: source.imageAlt,
    imageCredit: source.imageCredit,
    imageSourceUrl: source.imageSourceUrl,
    previewImageUrl: source.previewImageUrl,
    previewImageAlt: source.previewImageAlt,
    previewImageCredit: source.previewImageCredit,
    previewImageSourceUrl: source.previewImageSourceUrl,
  }
}

function preserveVerifiedMatchData(article: RadarArticle, source: RadarArticle): RadarArticle {
  if (!source.matchScore) return article
  const score = `${source.matchScore.homeGoals}-${source.matchScore.awayGoals}`
  const hasScoreInTitle = article.seoTitle.includes(score)
  if (article.matchScore && hasScoreInTitle) return article
  // Una reescritura genérica del store no reemplaza la edición completa verificada.
  if (!hasScoreInTitle) return source
  return {
    ...article,
    matchState: "finalizado",
    matchScore: article.matchScore ?? source.matchScore,
    matchSummary: article.matchSummary || source.matchSummary,
    // Una versión antigua del store no puede ocultar el marcador confirmado del titular.
    seoTitle: hasScoreInTitle ? article.seoTitle : source.seoTitle,
  }
}

function applyLockedSeedImage(article: RadarArticle): RadarArticle {
  const locked = LOCKED_SEED_IMAGES.get(article.slug)
  return locked?.imageUrl ? preserveImage(article, locked) : article
}

function containsLegacyGenericCopy(article: RadarArticle): boolean {
  const text = JSON.stringify(article).toLowerCase()
  return text.includes("los asistentes con ia durante el evento")
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
  const seedByMatch = new Map(RADAR_ARTICLE_SEED.map((article) => [matchKey(article), article]))
  const seedBySlug = new Map(RADAR_ARTICLE_SEED.map((article) => [article.slug, article]))
  const sanitized = list.flatMap((article) => {
    if (!containsLegacyGenericCopy(article)) return [article]
    const seed = seedBySlug.get(article.slug)
    return seed ? [seed] : []
  })
  return dedupeByMatch(sanitized)
    .map((article) => preserveVerifiedMatchData(article, seedByMatch.get(matchKey(article)) ?? article))
    .map(applyLockedSeedImage)
    .sort((a, b) => compareForFeed(a, b))
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
