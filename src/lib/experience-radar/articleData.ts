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
      { name: "SB Nation — los cuatro goles del empate", url: "https://www.sbnation.com/fifa-world-cup/1118493/world-cup-2026-every-goal-from-the-netherlands-japan-thriller", kind: "referencia" },
    ],
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
  upcomingMatch({
    date: "2026-06-16",
    kickoffAt: "2026-06-16T16:00:00.000Z",
    slug: "francia-senegal-mundial-2026",
    teams: ["Francia", "Senegal"],
    group: "Grupo I",
    officialUrl: "https://www.fifa.com/en/tournaments/mens/worldcup/canadamexicousa2026/scores-fixtures",
  }),
  upcomingMatch({
    date: "2026-06-16",
    kickoffAt: "2026-06-16T19:00:00.000Z",
    slug: "iraq-noruega-mundial-2026",
    teams: ["Irak", "Noruega"],
    group: "Grupo I",
    officialUrl: "https://www.fifa.com/en/tournaments/mens/worldcup/canadamexicousa2026/scores-fixtures",
  }),
  upcomingMatch({
    date: "2026-06-16",
    kickoffAt: "2026-06-16T22:00:00.000Z",
    slug: "argentina-argelia-mundial-2026",
    teams: ["Argentina", "Argelia"],
    group: "Grupo J",
    officialUrl: "https://www.fifa.com/en/tournaments/mens/worldcup/canadamexicousa2026/scores-fixtures",
  }),
  upcomingMatch({
    date: "2026-06-16",
    kickoffAt: "2026-06-17T01:00:00.000Z",
    slug: "austria-jordania-mundial-2026",
    teams: ["Austria", "Jordania"],
    group: "Grupo J",
    officialUrl: "https://www.fifa.com/en/tournaments/mens/worldcup/canadamexicousa2026/scores-fixtures",
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
  }
}

function preserveVerifiedMatchData(article: RadarArticle, source: RadarArticle): RadarArticle {
  if (article.matchScore || !source.matchScore) return article
  return {
    ...article,
    matchState: "finalizado",
    matchScore: source.matchScore,
    matchSummary: article.matchSummary || source.matchSummary,
  }
}

function applyLockedSeedImage(article: RadarArticle): RadarArticle {
  const locked = LOCKED_SEED_IMAGES.get(article.slug)
  return locked?.imageUrl ? preserveImage(article, locked) : article
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
  return dedupeByMatch(list)
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
