/**
 * Experience Radar — artículos editoriales (borradores de ejemplo).
 *
 * Contenido propio de MediaLab. NO reproduce noticias completas de terceros: cada
 * artículo enlaza a fuentes oficiales/autorizadas solo como referencia. Datos de
 * partido mostrados como ejemplo editorial en estado BORRADOR, pendientes de
 * verificación y revisión humana antes de publicar.
 */

import { generateRadarArticle, type RadarArticle, type RadarArticleInput } from "./articles"
import { getStoredRadarArticles } from "./articleStore"

const ARTICLE_INPUTS: RadarArticleInput[] = [
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
    imageUrl: "https://latingoles.com/wp-content/uploads/2026/06/mexico.jpg",
    imageAlt: "Julián Quiñones y Raúl Jiménez celebran la victoria de México sobre Sudáfrica en el Mundial 2026",
    imageCredit: "Imagen editorial: Latingoles",
    imageSourceUrl: "https://latingoles.com/historico-en-el-azteca-colombiano-quinones-y-mexicano-jimenez-rompen-la-maldicion-de-mexico/",
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

  // ───────────────────────── Artículo 2 · PREVIA ─────────────────────────
  // Partido REAL del fixture: Brasil vs Marruecos, 13 jun 2026, Nueva Jersey (MetLife).
  {
    category: "Fan Experience",
    date: "2026-06-13",
    kickoffAt: "2026-06-13T22:00:00.000Z",
    slug: "brasil-marruecos-mundial-2026",
    matchState: "previa",
    matchSummary:
      "Brasil y Marruecos jugarán el 13 de junio a las 22:00 UTC en Nueva York/Nueva Jersey. FIFA presenta el cruce entre el cinco veces campeón y el semifinalista de 2022 como uno de los partidos destacados de la fase de grupos. La previa enfrenta dos expectativas: la obligación histórica de Brasil y la legitimidad competitiva que Marruecos construyó en Qatar.",
    matchPhases: {
      // Solo expectativa: lo que ambas hinchadas proyectan antes del partido.
      expectativa: { euforia: 80, confianza: 76, ansiedad: 56, frustracion: 26, incertidumbre: 54, optimismo: 78 },
    },
    teamApproach: [
      {
        team: "Brasil",
        expectedEmotion: "Euforia con presión: se da por hecho el favoritismo.",
        dominantConversation: "El mandato de volver a ganar y exhibir el jogo bonito.",
        fanConfidence: "Confianza muy alta, casi de obligación de ganar.",
        mainNarrative: "El gigante que debe reafirmar su jerarquía desde el debut.",
      },
      {
        team: "Marruecos",
        expectedEmotion: "Ilusión y confianza tras el envión de 2022.",
        dominantConversation: "El orgullo de competir de igual a igual con una potencia.",
        fanConfidence: "Confianza alta y unida, sin miedo escénico.",
        mainNarrative: "El equipo que ya demostró que puede dar el golpe.",
      },
    ],
    seoTitle:
      "Brasil vs Marruecos: previa, expectativa y por qué este partido paraliza al Mundial 2026",
    teams: ["Brasil", "Marruecos"],
    event: "Mundial 2026 — Fase de grupos",
    hook: "El debut más esperado de la primera fecha",
    quickSummary:
      "Antes de Brasil–Marruecos, el interés está marcado por el peso histórico de Brasil y el recuerdo de Marruecos como semifinalista de 2022. Esta nota registra la expectativa editorial previa; tras el partido se actualizará con resultado, conversación y percepción observables.",
    whatHappened:
      "El partido aún no se juega. FIFA confirma el horario y el escenario, y su previa destaca el cruce entre el cinco veces campeón y una selección marroquí que llegó a semifinales en 2022. AP también registra una expectativa alta en Brasil y dudas sobre el estado físico de Neymar. Este marco emocional condicionará cómo ambas hinchadas interpreten las primeras jugadas.",
    keyPlays: [
      "Aún sin jugarse: se actualizará tras el partido.",
    ],
    controversies: [
      "La disponibilidad física de Neymar añade incertidumbre a la expectativa brasileña.",
    ],
    statements: [
      "El seleccionador de Marruecos ha planteado competir por el primer lugar del grupo; Brasil llega con la presión histórica de aspirar al título.",
    ],
    fanPulse: {
      concerns: [
        "¿Quién llega mejor de forma?",
        "¿A qué hora y dónde verlo?",
        "¿Cómo afecta el antecedente de 2022?",
      ],
      emotions: ["Euforia anticipada", "Ansiedad por el debut", "Orgullo de pertenencia"],
      frustrations: [
        "Sobrecarga de opiniones contradictorias antes del partido.",
      ],
      enthusiasm: [
        "Expectativa máxima por el cruce de estilos.",
        "Interés por un cruce entre un campeón histórico y el semifinalista africano de 2022.",
      ],
      sources: [
        { name: "FIFA — previa Brasil vs Marruecos", url: "https://www.fifa.com/en/tournaments/mens/worldcup/canadamexicousa2026/articles/brazil-morocco-preview-live-stream-team-news-tickets", kind: "oficial" },
      ],
    },
    mediaLabInsight: {
      humanBehavior:
        "Antes de un evento muy esperado, las personas construyen expectativas sobre la memoria emocional más que sobre datos: lo que sentimos que va a pasar pesa más que lo probable.",
      cognitiveBiases: [
        "Sesgo de optimismo: cada hinchada sobreestima las probabilidades de su equipo.",
        "Efecto halo: los éxitos recientes hacen ver al equipo mejor de lo que los datos sostienen.",
        "Prueba social: cuando todo el feed coincide, la expectativa se siente como certeza.",
      ],
      emotionalReaction:
        "La euforia previa eleva el listón: si la realidad no la iguala, la decepción posterior será mayor aunque el desempeño sea bueno.",
      digitalPatterns:
        "Búsquedas de alineaciones y horarios, confrontación entre aficiones y consumo intensivo de contenido previo.",
    },
    productApplications: [
      {
        sector: "Ecommerce",
        application:
          "Antes de un lanzamiento muy esperado, gestionar la expectativa con información clara evita que la euforia previa se convierta en decepción si algo no cumple.",
      },
      {
        sector: "Producto digital",
        application:
          "En el onboarding de una función muy anunciada, alinear lo prometido con lo entregado protege la percepción posterior del usuario.",
      },
    ],
    emotionalRadar: {
      euforia: 80,
      confianza: 76,
      ansiedad: 56,
      frustracion: 26,
      incertidumbre: 54,
      optimismo: 78,
    },
    uxFinding:
      "La expectativa previa fija el listón con el que se juzgará la experiencia real. Gestionar lo que la gente espera, antes del evento, define qué tan satisfecha quedará después.",
    aiSummary:
      "Nota previa de Brasil–Marruecos del Mundial 2026 (13 de junio, Nueva Jersey). El Experience Radar de MediaLab analiza la expectativa antes del pitazo: ambas aficiones construyen su confianza sobre la memoria emocional —el favoritismo de Brasil y la gesta de Marruecos en 2022, prueba social— más que sobre datos de rendimiento. El aprendizaje para productos digitales es que la expectativa previa fija el listón con el que se juzgará la experiencia real; gestionar lo prometido evita que la euforia se convierta en decepción. La nota se actualizará con la realidad y la percepción tras el partido.",
    scoreFactors: {
      emotionalImpact: 88,
      digitalConversation: 92,
      virality: 90,
      userInterest: 95,
    },
    sources: [
      { name: "FIFA — centro de partido Brasil vs Marruecos", url: "https://www.fifa.com/en/match-centre/match/17/285023/289273/400021456", kind: "oficial" },
      { name: "FIFA — previa Brasil vs Marruecos", url: "https://www.fifa.com/en/tournaments/mens/worldcup/canadamexicousa2026/articles/brazil-morocco-preview-live-stream-team-news-tickets", kind: "oficial" },
      { name: "AP — expectativa de Brasil y estado de Neymar", url: "https://apnews.com/article/brazil-world-cup-neymar-ancelotti-ebdba3dcbf32124a38b388775cc20b38", kind: "referencia" },
    ],
  },
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
  const list = stored && stored.length ? stored : RADAR_ARTICLE_SEED
  return dedupeByMatch(list).sort((a, b) => b.date.localeCompare(a.date))
}

/** Busca un artículo por slug (store con fallback al seed). */
export async function getRadarArticleBySlug(slug: string): Promise<RadarArticle | undefined> {
  const all = await getAllRadarArticles()
  return all.find((a) => a.slug === slug)
}
