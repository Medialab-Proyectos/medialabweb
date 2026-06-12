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
import { getArticleAvailability, compareForFeed } from "./articleAvailability"

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
    seoTitle: `${label}: previa y expectativa del Mundial 2026`,
    teams: input.teams,
    event: `Mundial 2026 — ${input.group}`,
    hook: `La expectativa de las hinchadas antes de ${label}`,
    quickSummary: `${label} ya está dentro de la ventana de 24 horas del Experience Radar. Esta nota previa reúne el contexto oficial del partido y observa la expectativa, la confianza y la conversación de ambas hinchadas antes del inicio.`,
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

const ARTICLE_INPUTS: RadarArticleInput[] = [
  upcomingMatch({
    date: "2026-06-12",
    kickoffAt: "2026-06-12T19:00:00.000Z",
    slug: "canada-bosnia-herzegovina-mundial-2026",
    teams: ["Canadá", "Bosnia y Herzegovina"],
    group: "Grupo B",
    officialUrl: "https://www.fifa.com/en/match-centre/match/17/285023/289273/400021449?date=2026-06-12",
  }),
  upcomingMatch({
    date: "2026-06-12",
    kickoffAt: "2026-06-13T01:00:00.000Z",
    slug: "estados-unidos-paraguay-mundial-2026",
    teams: ["Estados Unidos", "Paraguay"],
    group: "Grupo D",
    officialUrl: "https://www.fifa.com/en/match-centre/match/17/285023/289273/400021458",
  }),
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
    category: "Streaming",
    date: "2026-06-11",
    kickoffAt: "2026-06-12T02:00:00.000Z",
    slug: "corea-del-sur-chequia-resultado-resumen-caida-transmision",
    matchState: "finalizado",
    imageUrl: "https://latingoles.com/wp-content/uploads/2026/06/rss-efe6c0e5c0700b2b8a21b6094f046456b33aa8b26e8w.jpg",
    imageCredit: "Latingoles",
    imageSourceUrl: "https://latingoles.com/corea-del-sur-aspira-al-liderato-del-grupo-a-a-pesar-de-que-mexico-es-favorito/",
    matchScore: {
      home: "Corea del Sur",
      away: "Chequia",
      homeGoals: 2,
      awayGoals: 1,
      detail: "Goles: Son 12', Lee 67'; Chequia: Schick 80'",
    },
    imageAlt: "Corea del Sur vs Chequia — Mundial 2026, segundo partido de la jornada inaugural",
    matchSummary:
      "Corea del Sur venció 2-1 a Chequia en Guadalajara, pero para millones el partido quedó marcado por una caída de la transmisión en el pico de audiencia. El reclamo dominante no fue el resultado, sino el silencio del servicio: no saber si la falla era propia o de la plataforma.",
    matchPhases: {
      expectativa: { euforia: 72, confianza: 68, ansiedad: 40, frustracion: 26, incertidumbre: 44, optimismo: 73 },
      realidad: { euforia: 54, confianza: 44, ansiedad: 80, frustracion: 90, incertidumbre: 82, optimismo: 48 },
      percepcion: { euforia: 50, confianza: 40, ansiedad: 72, frustracion: 92, incertidumbre: 60, optimismo: 44 },
    },
    // Interpretación específica por fase/categoría (datos reales + lo que dice la gente).
    matchInterpretations: {
      expectativa: {
        euforia: "La hinchada coreana llegó eufórica por ver a Son y a su generación debutar en el Mundial.",
        confianza: "Confianza alta en el equipo, con la expectativa de imponerse a Chequia.",
        ansiedad: "La ansiedad previa era logística: a qué hora y en qué plataforma ver el partido.",
        frustracion: "Casi nula antes del pitazo; la ilusión dominaba la conversación.",
        incertidumbre: "Pocas dudas sobre el equipo; la única incógnita era la transmisión.",
        optimismo: "Optimismo marcado por el envión de la generación de Son.",
      },
      realidad: {
        euforia: "El 2-1 con goles de Son y Lee encendió a la hinchada, pero la euforia compitió con la bronca por no poder ver el partido.",
        confianza: "La victoria dio un relato positivo del equipo; la desconfianza se trasladó a la plataforma de transmisión, no al juego.",
        ansiedad: "El pico de ansiedad no fue el marcador: fue '¿es mi internet o la app?' durante la caída de la señal.",
        frustracion: "La frustración dominante vino del silencio del servicio durante el corte, más que del descuento de Chequia.",
        incertidumbre: "La duda fue si la plataforma aguantaría el resto del torneo; el resultado fue claro, la experiencia no.",
        optimismo: "Gana Corea y eso ilusiona, pero la afición llega al próximo partido con un plan B por si la señal vuelve a fallar.",
      },
      percepcion: {
        euforia: "El recuerdo mezcla la alegría del triunfo con la anécdota del 'partido que no se pudo ver'.",
        confianza: "Queda confianza en el equipo, pero la plataforma arrastra una reputación dañada por el último fallo.",
        ansiedad: "Persiste una ansiedad anticipada: el miedo a que la señal vuelva a caer en el próximo partido.",
        frustracion: "El efecto de recencia fija la caída como lo más memorable, por encima del 2-1.",
        incertidumbre: "Baja la incertidumbre deportiva; sube la duda sobre dónde ver con seguridad el siguiente encuentro.",
        optimismo: "El optimismo deportivo convive con la cautela: ver el próximo partido con alternativas listas.",
      },
    },
    teamApproach: [
      {
        team: "Corea del Sur",
        expectedEmotion: "Euforia y enorme expectativa de su afición hiperconectada.",
        dominantConversation: "Dónde ver el partido y con quién; ilusión por sus figuras en Europa.",
        fanConfidence: "Confianza alta en el equipo y en disfrutar la transmisión.",
        mainNarrative: "Una nueva generación lista para dar el golpe en el Mundial.",
        howTheyArrived: "Con entusiasmo masivo y altísima concurrencia digital simultánea.",
        whatHappened: "Ganaron, pero la caída de la señal convirtió la fiesta en frustración y búsqueda de alternativas.",
        expectationVsReality: "Esperaban celebrar sin fricción; el recuerdo quedó teñido por la falla de la plataforma.",
      },
      {
        team: "Chequia",
        expectedEmotion: "Expectativa moderada y enfoque en el juego.",
        dominantConversation: "Análisis táctico del rival, poco sobre la transmisión.",
        fanConfidence: "Confianza serena, sin grandes expectativas mediáticas.",
        mainNarrative: "Competir con orden frente a un rival con más presión social.",
        howTheyArrived: "Tranquilos y menos expuestos al fallo regional de la señal.",
        whatHappened: "Perdieron sobre el cierre; su conversación se centró en el juego, no en la plataforma.",
        expectationVsReality: "La experiencia coincidió con lo esperado: foco en el partido más que en la transmisión.",
      },
    ],
    lessons: [
      { term: "Sesgo de atribución", explanation: "Sin información, el usuario culpa a su propia conexión, no a la causa real del fallo.", phase: "despues" },
      { term: "Aversión a la pérdida", explanation: "Perderse el momento esperado pesó más que cualquier calidad técnica del servicio.", phase: "despues" },
      { term: "Efecto de recencia", explanation: "El último fallo definió la percepción de toda la plataforma, borrando meses de servicio estable.", phase: "despues" },
    ],
    seoTitle:
      "Corea del Sur 2-1 Chequia: resultado, resumen y la caída de transmisión que frustró a millones",
    teams: ["Corea del Sur", "Chequia"],
    event: "Mundial 2026 — Fase de grupos",
    hook: "Victoria de Corea del Sur y caída de la transmisión en vivo",
    quickSummary:
      "Corea del Sur derrotó 2-1 a Chequia en la jornada inaugural del Mundial 2026, pero una interrupción de la transmisión en el momento de mayor audiencia se robó la conversación. Mientras millones intentaban conectarse a la vez, la plataforma mostró pantallas de carga y errores intermitentes, y la audiencia se volcó a buscar señales alternativas.",
    whatHappened:
      "Corea del Sur se adelantó temprano y manejó el partido frente a una Chequia ordenada que descontó sobre el cierre. Pero pocos minutos después del inicio, con la audiencia entrando de forma simultánea, la transmisión principal empezó a fallar para parte de los usuarios: pantallas de carga indefinidas y errores intermitentes sin explicación. El problema se concentró en los picos de concurrencia. En minutos, la conversación digital se llenó de reportes y preguntas sobre señales alternativas, y muchos no sabían si el problema era de su conexión o de la plataforma. Esa ambigüedad multiplicó la frustración y empujó a la audiencia a saltar entre aplicaciones. Cuando el servicio se recuperó, buena parte del daño ya estaba hecho.",
    keyPlays: [
      "Gol tempranero que encarriló el partido para Corea del Sur.",
      "Fallo de transmisión concentrado en el pico de concurrencia.",
      "Descuento de Chequia sobre el cierre, ya con la señal recuperada.",
    ],
    controversies: [
      "Ausencia de comunicación oficial durante la caída.",
      "Errores sin indicar si el problema era del usuario o de la plataforma.",
    ],
    statements: [
      "Usuarios exigieron transparencia sobre el estado del servicio.",
      "El reclamo dominante fue la falta de mensajes claros, no solo la caída.",
    ],
    fanPulse: {
      concerns: ["¿Es mi internet o la plataforma?", "¿Dónde puedo ver el partido ahora?", "¿Va a volver la señal a tiempo?"],
      emotions: ["Frustración aguda", "Sensación de exclusión", "Urgencia por no perderse el momento"],
      frustrations: ["Pantallas de carga sin información.", "No saber a quién reportar ni dónde mirar el estado."],
      enthusiasm: ["Comunidad ayudándose a encontrar alternativas.", "Alta disposición a volver si la experiencia mejora."],
      sources: [
        { name: "Reddit — match thread y reportes de fallo", url: "https://www.reddit.com/r/soccer/", kind: "conversacion" },
        { name: "Reseñas de apps de streaming (App Store / Play)", url: "https://play.google.com/store", kind: "reseña" },
      ],
    },
    mediaLabInsight: {
      humanBehavior:
        "Ante un fallo, las personas primero intentan diagnosticar la causa. Si el sistema no se lo dice, asumen lo peor y migran a otra opción.",
      cognitiveBiases: [
        "Sesgo de atribución: sin información, el usuario culpa a su propia conexión o al producto al azar.",
        "Aversión a la pérdida: perderse el momento pesa más que la calidad técnica.",
        "Efecto de recencia: el último fallo define la percepción de toda la plataforma.",
      ],
      emotionalReaction:
        "La frustración no viene de la caída en sí, sino del silencio: no saber qué pasa ni qué hacer multiplica la ansiedad.",
      digitalPatterns:
        "Concurrencia simultánea, multitarea entre apps, reporte social inmediato y abandono rápido cuando no hay estado visible.",
    },
    productApplications: [
      {
        sector: "Banco",
        application:
          "Si la app cae en día de pago de nómina, una página de estado honesta ('servicio intermitente, trabajando en ello') retiene más que el silencio.",
      },
      {
        sector: "Ecommerce",
        application:
          "En un lanzamiento o flash sale, comunicar la cola y el estado del sistema evita que el pico de demanda se convierta en pico de abandono.",
      },
      {
        sector: "Fintech",
        application:
          "En picos de transacciones, diferenciar 'error tuyo' de 'error nuestro' con mensajes claros sostiene la confianza operacional.",
      },
    ],
    emotionalRadar: { euforia: 54, confianza: 44, ansiedad: 80, frustracion: 90, incertidumbre: 82, optimismo: 48 },
    collectiveByTeam: [
      {
        team: "Corea del Sur",
        mood: "Alegría empañada por la frustración técnica",
        behaviorEffect:
          "Llegan al próximo partido con desconfianza hacia la plataforma: buscan alternativas con anticipación, comparten reportes de fallos y reducen la participación en transmisiones oficiales hasta recuperar la confianza.",
      },
      {
        team: "Chequia",
        mood: "Decepción deportiva, indiferencia técnica",
        behaviorEffect:
          "Menos afectados por el fallo regional: su conversación se centra en el rendimiento del equipo y mantienen patrones de uso estables.",
      },
    ],
    scoreFactors: { emotionalImpact: 84, digitalConversation: 90, virality: 88, userInterest: 92 },
    uxFinding:
      "Bajo alta demanda, el usuario no perdona el silencio. Una página de estado honesta y mensajes que distingan el origen del error retienen más que una recuperación rápida sin comunicación.",
    aiSummary:
      "Corea del Sur venció 2-1 a Chequia en el Mundial 2026, pero una caída de la transmisión en el pico de audiencia dominó la conversación. Experience Radar concluye que la frustración la causó el silencio del sistema, no solo la caída: sin saber el origen del error, los usuarios asumen lo peor y migran. Para productos de alto tráfico —streaming, banca, ecommerce, fintech— la lección es diseñar la experiencia de fallo como un flujo principal: páginas de estado honestas, mensajes que distingan error del usuario y del servicio, y recuperación transparente.",
    sources: [
      { name: "FIFA — Cómo ver el Mundial (referencia oficial)", url: "https://www.fifa.com/es/tournaments/mens/worldcup/canadamexicousa2026", kind: "oficial" },
      { name: "Reddit r/soccer — reportes de transmisión", url: "https://www.reddit.com/r/soccer/", kind: "conversacion" },
      { name: "Reseñas de apps de streaming", url: "https://play.google.com/store", kind: "reseña" },
    ],
  },

  // ───────────────────────── Artículo 3 · PREVIA ─────────────────────────
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
  // El agente actualiza partidos concretos; nunca debe borrar del portal los
  // demas encuentros que ya forman parte del calendario editorial.
  const list = stored && stored.length ? [...RADAR_ARTICLE_SEED, ...stored] : RADAR_ARTICLE_SEED
  // Orden del feed: EN VIVO primero, luego lo PRÓXIMO (más cercano), y al final los
  // FINALIZADOS (más reciente primero). Así la destacada es la que se juega ahora.
  return dedupeByMatch(list).sort((a, b) => compareForFeed(a, b))
}

/** Notas publicas: solo partidos dentro de las 24 h previas o ya iniciados. */
export async function getVisibleRadarArticles(now: Date = new Date()): Promise<RadarArticle[]> {
  const all = await getAllRadarArticles()
  return all.filter((article) => getArticleAvailability(article, now).visible)
}

/** Busca un artículo por slug (store con fallback al seed). */
export async function getRadarArticleBySlug(slug: string): Promise<RadarArticle | undefined> {
  const all = await getAllRadarArticles()
  return all.find((a) => a.slug === slug)
}
