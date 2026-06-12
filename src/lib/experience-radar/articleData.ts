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
