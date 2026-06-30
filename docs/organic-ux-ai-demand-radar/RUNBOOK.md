# 🛰️ Organic UX & AI Demand Radar — Runbook diario (motor = Claude Code)

> **Cómo se usa:** este `.md` NO es código. Es el guion que ejecuta Claude Code.
> Tú abres el proyecto y escribes una de las **frases gatillo** de abajo; Claude
> sigue las fases de este runbook y te deja el reporte escrito en `reports/`.
> No hay `npm`, no hay cron, no hay servidor. Todo es manual y a demanda.

## 🎛️ Frases gatillo (los "comandos")

| Si escribes… | Claude ejecuta |
|---|---|
| **`radar mañana`** | Auditoría completa → `reports/manual-runs/morning-report-<fecha>.md` |
| **`radar noche`** | Auditoría completa → `reports/manual-runs/evening-report-<fecha>.md` |
| **`radar general`** | Auditoría completa sin etiqueta horaria → `manual-report-<fecha>.md` |
| **`radar comparar`** | Compara el último morning vs evening del día → `reports/comparisons/...` |
| **`radar tendencias`** | Solo el módulo AI Trends → reporte independiente |
| **`radar briefs`** | Genera briefs desde las oportunidades del último reporte |
| **`radar test`** | Lista qué insumos hay (sitemap accesible, CSVs presentes, datos GSC pegados) y qué falta |

> Puedes añadir contexto: `radar mañana solo home y servicios` · `radar tendencias enfoque agentes IA`.

---

## 🎯 Objetivo y alcance

Mejorar la **presencia orgánica** de MediaLab detectando, cada día, problemas y
oportunidades de SEO, UX, UX-para-IA, diseño, desarrollo, accesibilidad,
preparación para buscadores de IA (AEO/GEO) y tendencias del ecosistema IA —
y convertirlos en un **backlog de máximo 5 tareas** y **briefs accionables**.

- **Sitio objetivo:** `https://medialab.design`
- **Sitemap:** `https://medialab.design/sitemap.xml`
- **País prioritario:** Colombia (CO)
- **Código fuente disponible para Claude:** `medialabweb/` (NO tocar — solo lectura)
- **Salidas:** `organic-ux-ai-demand-radar/reports/`

### Servicios REALES de MediaLab (a esto deben mapear las oportunidades comerciales)
MediaLab vende: **Diseño UX/UI + diseño conductual** · **Discovery con IA / mejorar flujos con IA**
(acelerar el diseño aportando más insumos al desarrollo) · **Desarrollo de producto a la medida** ·
**CRO para SaaS** (conversión). Complementos: Curso UX+IA, Portafolio, industrias (fintech, banca,
ecommerce, educación, movilidad, startups), recurso Analizador UX-IA, UXGreen.
Páginas reales: `/servicios/diseno-ux-ui`, `/servicios/discovery-con-ia`,
`/servicios/desarrollo-producto-digital`, `/servicios/cro-saas`.

> ⛔ **MediaLab NO vende posicionamiento / SEO / AEO como servicio.** El SEO/AEO se usa SOLO para la
> **visibilidad propia** del sitio (que la agencia sea encontrada y reciba leads). Por tanto: **nunca
> recomiendes landings comerciales de "posicionamiento/AEO"** — las landings/contenidos comerciales
> deben mapear a los servicios reales de arriba. El "Lente AEO" de abajo es para optimizar EL PROPIO
> sitio de MediaLab, no un producto a vender.

### Keywords estratégicas (mapean a servicios reales; comercial salvo nota)
`agencia ux ui colombia` · `diseño ux ui colombia` · `consultoría ux colombia` ·
`auditoría ux página web` · `diseño conductual` · `diseño de producto digital colombia` ·
`desarrollo de producto a medida` · `ux con ia` · `diseño aumentado con ia` ·
`optimización ux con inteligencia artificial` · `investigación ux con ia` ·
`mejorar flujos con ia` · `cro conversión saas` ·
*(informacionales)* `diseño con ia` · `cómo mejorar conversión página web`

### Competidores
Definir en `data/competitors.json` (máx 10 páginas por competidor, fetch responsable).

---

## 🧭 Reglas de oro para el motor (Claude)

1. **Nunca te detengas por una falla.** Si una página no responde o falta una API/CSV,
   registra un *warning*, continúa y **igual entrega el reporte**.
2. **No inventes datos.** Si no hay dato real (ej. GSC sin pegar), escríbelo como
   `⚠️ no disponible` y marca qué necesita el usuario para completarlo.
3. **Siempre cita la señal** que originó cada recomendación (de dónde salió).
4. **Respeta a Google:** nada de scrapear SERPs ni simular tráfico. Solo análisis propio.
5. **Backlog SIEMPRE ≤ 5 tareas.** Priorizadas, concretas, ejecutables mañana.
6. **Sé honesto con los límites:** marca lo que es aproximación heurística vs dato medido.

---

## 🔁 FASES DE EJECUCIÓN (para `radar mañana` / `radar noche` / `radar general`)

### FASE 0 — Preparación
- Fija fecha/hora actual y tipo de corrida (morning/evening/manual).
- Revisa insumos: ¿hay datos GSC pegados? ¿CSVs en `data/`? Lista lo presente y lo ausente.

### FASE 1 — Descubrimiento de URLs
- WebFetch a `sitemap.xml` (soporta sitemap index/anidados).
- Limpia: fuera imágenes, PDFs, query params, hash, dominios externos.
- Prioriza: **Home → Servicios → Landings → Casos → Blog → Recursos → Otras**.
- Limita a **máx 15–20 páginas** por corrida (las más estratégicas primero).
- Si el sitemap falla: audita solo `SITE_URL` y registra warning.

### FASE 2 — Auditoría por página (WebFetch a cada URL priorizada)
Para cada página evalúa y anota hallazgos + recomendaciones:

**a) SEO técnico** — title (30–65), meta (90–160), 1 solo H1, H2 suficientes,
canonical correcto, `noindex` accidental, OG/Twitter, JSON-LD (Organization/Service/
Article/FAQ/Breadcrumb/LocalBusiness), nº palabras (comercial ≥500), enlaces internos,
imágenes sin ALT (>30% = problema), CTAs (`contactar/agenda/cotizar/whatsapp/...`),
tipo de página (home/service/landing/blog/case/contact/legal/other).

**b) UX heurístico (UXScore 0–100)** — propuesta de valor clara en 5s, CTA arriba del fold,
nº de CTAs primarios (>3 = ruido), prueba social, casos/evidencia, escaneabilidad,
densidad de texto, claridad de navegación, fricción, objeciones respondidas, UX mobile,
formularios (campos excesivos), microcopy.

**c) UX para IA (AIServicesUXScore 0–100)** — ¿explica qué hace la IA vs el humano?,
¿evita "potenciado por IA" sin prueba?, ¿privacidad/datos?, ¿supervisión humana?,
¿límites?, ¿casos concretos?, ¿fallback humano?, ¿ética/autonomía?

**d) AEO / GEO — AI Search Readiness (0–100)** — puntúa:
respuesta directa en primeras ~150 palabras (15) · FAQ/preguntas reales como H2 (15) ·
schema relevante (15) · autoría/confianza (15) · casos/evidencia (15) ·
enlazado interno (10) · contenido específico (15).
Clasifica: **80–100 preparado · 60–79 mejorable · <60 débil**.

**e) Desarrollo/Performance (heurístico, DevScore 0–100)** — pesos aparentes, imágenes
no WebP/AVIF, lazy loading, fuentes/`font-display`, scripts de terceros, security headers
(CSP, HSTS, X-Content-Type-Options, X-Frame-Options, Referrer-Policy, Permissions-Policy),
HTTPS/mixed content, recursos 404, errores de consola.
> ⚠️ Para CWV exactos (LCP/CLS/INP) el usuario pega resultados de PageSpeed o pide
> `corre lighthouse en <url>` (Claude lo intenta con Playwright si el entorno lo permite).

**f) Accesibilidad (heurístico, A11yScore 0–100)** — alt en imágenes informativas,
labels en inputs, nombre accesible en botones/CTA, estructura de headings, contraste
aparente del CTA, idioma del documento, skip link, foco visible.
> ⚠️ Para WCAG preciso: `corre axe en <url>` o pega un export de Pa11y.

### FASE 3 — Demanda, búsqueda y tendencias
- **Search Console:** si el usuario pegó datos → analiza *Quick Wins* (pos 8–20 + impresiones
  altas + CTR bajo), CTR bajo (≥100 impresiones y CTR <2%), casi-top-10 (pos 10–15),
  keywords estratégicas invisibles. Si NO hay datos → `⚠️ pega tu export de GSC`.
- **Google Trends:** lee CSV en `data/` si existe; si no, investiga con WebSearch señales
  de interés. Crecimiento **>20% = oportunidad** (comercial→landing, informacional→artículo).
- **AI Trends (ver módulo abajo).**
- **Voz real / social y medios:** ver **«Fuentes de voz real validadas»** abajo (Reddit RSS,
  Google News, operadores, etc.). Solo cuenta como voz medida si hay señales observables.
- **Competidores:** WebFetch (máx 10 págs c/u) → detecta *gaps* de contenido/servicios/IA/UX.

### Fuentes de voz real validadas (gratis, sin API — jun 2026)

Para capturar la conversación real de usuarios y medios especializados. **Solo afirma "la
conversación dice X" si hay posts/comentarios/titulares observables** — nunca inventes tono.

| Fuente | Cómo acceder (sin API) | Para qué |
|---|---|---|
| **Reddit RSS** | `https://www.reddit.com/r/<sub>/top/.rss?sort=top&t=week&limit=15` y combos `r/SEO+UXDesign+artificial+ChatGPT/top/.rss` | Dolores y tendencias SEO/UX/IA |
| **Operadores Reddit** (Google/Bing) | `site:reddit.com/r/SEO "AI Overview"` · `…/r/UXDesign "UX research"` · `…"Figma"` · `…/r/userexperience "design system"` | Conversación indexada por tema |
| **Google News RSS** | `https://news.google.com/rss/search?q=<tema>&hl=es-419&gl=CO&ceid=CO:es` | Cobertura de medios especializados |
| **Google Trends** | CSV exportado o WebSearch; crecimiento **>20% = oportunidad** | Demanda de búsqueda |
| **YouTube** | WebSearch por keyword (o CSV) | Formato/demanda de video |
| **GitHub Trending / Topics** | WebSearch (ai-agents, llm, rag, mcp, generative-ui…) | Tendencias del ecosistema IA |
| **Product Hunt · Hacker News** | WebSearch o CSV | Herramientas y temas emergentes |
| **TikTok Creative Center · X/Twitter trends** | manual/CSV (sin API estable) | Tendencias de formato y hooks |
| **Stack Overflow** | WebSearch por tag | Dudas técnicas reales de devs |
| **RSS de blogs** | feeds de medios UX/SEO/IA | Voz de medios especializados |

**Subreddits clave para MediaLab:** r/SEO, r/UXDesign, r/userexperience, r/artificial, r/ChatGPT.
**Caveat rate-limit:** Reddit RSS puede dar **429** si pides varios feeds seguidos; usa `t=week`,
espacia las peticiones o consulta de a un sub. Si bloquea, sigue con Google News/operadores.

### 🔭 Lente AEO obligatorio (para la VISIBILIDAD PROPIA de MediaLab — NO es un servicio)
El tema #1 real en r/SEO es el impacto de los **AI Overviews / AI search**: el CTR orgánico cae
**~61%** cuando hay un AI Overview. En cada auditoría evalúa la **preparación AEO/GEO del PROPIO
sitio de MediaLab** (respuesta directa arriba, FAQ con preguntas reales, schema, **autoría/E-E-A-T**,
`llms.txt`) **para que la agencia sea encontrada y citada por las IA** y reciba leads.
⛔ Recuerda: AEO/SEO es **visibilidad propia, no un producto a vender** (ver «Servicios reales» arriba);
las oportunidades comerciales se montan sobre UX, diseño conductual, flujos con IA, aceleración
diseño→desarrollo y desarrollo a medida. Señales reales a vigilar: spam updates de Google, "agentic
browsing", debate sobre `llms.txt`, páginas de autor/E-E-A-T y la ansiedad por caída de tráfico orgánico.

### FASE 4 — Síntesis y priorización
Calcula `opportunityScore` por oportunidad cruzando todas las señales:
```
opportunityScore = trends + searchConsole + aiTrendMarket + aiTrendGitHub
                 + aiTrendContentGap + uxGap + uxAIGap + designAIGap
                 + devGap + youtubeDemand + socialConversation + redditPain
                 + commercialIntent + aeoGap + competitorGap − contentDifficulty
```
Clasifica: **Alta ≥25 · Media 15–24 · Baja menor a 15**.

**Prioridad (para el backlog):**
- **P1 (crítico):** noindex accidental · 4xx/5xx en página estratégica · comercial sin H1/title ·
  hero que no comunica valor en 5s · servicio IA mal explicado · A11y grave en CTA/form ·
  keyword comercial creciente sin landing · tendencia IA relevante sin contenido.
- **P2 (alto):** pos 8–20 con impresiones · CTR bajo · poca prueba social · UX débil ·
  AEO bajo · tendencia UX/IA creciente · tema fuerte en YouTube/Reddit · gap vs competidor.
- **P3 (menor):** schema/OG/canonical ausentes · ALT incompletos · enlazado interno bajo.

➡️ **Backlog final: MÁX 5 tareas**, ordenadas P1→P2→P3, concretas y ejecutables.

### FASE 5 — Escribir el reporte
Crea `reports/manual-runs/<tipo>-report-AAAA-MM-DD-HH-mm.md` (y `.json` con los scores)
usando la **plantilla de reporte** de más abajo.

---

## 🤖 MÓDULO AI TRENDS (para `radar tendencias` o dentro de la auditoría)

**No confundir con AEO:** AEO mide si *tu página* aparece en respuestas de IA.
AI Trends analiza *el ecosistema IA* para saber qué temas nuevos debe cubrir MediaLab.

**Fuentes (usa las que haya, sigue si falta alguna):** GitHub Trending/Topics (vía WebSearch),
`data/ai-trends-example.csv`, `data/ossinsight-ai-trends-example.csv`, Google Trends CSV,
YouTube/Reddit, Awesome-lists.

**Categorías** (`data/ai-trend-categories.json`): AI Agents · AI Coding · AI Design · RAG ·
MCP · Vector DBs · AI Search/GEO · UX Research AI · AI Accessibility · Generative UI ·
AI Product Strategy · AI Prototyping · AI Design Systems.

**Por cada tendencia detectada:** categoría, señales (¿GitHub? ¿Trends? ¿YouTube/Reddit?),
`aiTrendScore` (stars+growth+recency+relevancia-UX/diseño/dev/negocio+gap de contenido),
servicio MediaLab mapeado, ¿el sitio ya lo cubre? (gap), y recomendación
(landing/artículo/video/carrusel/servicio).

**Regla de prioridad:** aparece en **GitHub + YouTube + Reddit** → prioridad alta.
Solo en GitHub → observación. Baja relación con servicios MediaLab → no crear aún.

**Oportunidades-tipo (URLs sugeridas):** `/ux-con-ia` · `/diseno-aumentado-con-ia` ·
`/auditoria-ux-con-ia` · `/diseno-agentes-ia` · `/optimizacion-frontend-con-ia` ·
`/investigacion-ux-con-ia` · `/posicionamiento-en-buscadores-ia` ·
`/accesibilidad-web-con-ia` · `/sistemas-de-diseno-con-ia` · `/prototipado-con-ia`.

---

## 🔀 COMPARACIÓN (para `radar comparar`)
1. Toma el `morning-report` y el `evening-report` más recientes del día.
2. Marca cada hallazgo: **persistente** (aparece en ambos) · **observar** (uno) ·
   **mejora detectada** · **prioridad** (empeoró).
3. Escribe `reports/comparisons/manual-comparison-AAAA-MM-DD.md` con:
   resumen ejecutivo · repetido · cambió · problemas persistentes · oportunidades
   confirmadas/descartadas · **Top 5 tareas para mañana** · briefs sugeridos ·
   estado general: **saludable · necesita atención · crítico**.

---

## 🧾 BRIEFS (para `radar briefs`)
Genera en `reports/briefs/` un brief por oportunidad priorizada. Tipos: landing comercial,
artículo, video, Short/Reel, carrusel, thread X, FAQ, comparativa, caso, página UX-IA,
diseño-IA, optimización-dev, landing/artículo de tendencia IA.

**Brief de landing** incluye: URL · keyword principal + secundarias · intención · title ·
meta · H1 · H2s · CTA principal/secundario · FAQs · schema · enlaces internos · pruebas/casos ·
copy de hero · mensaje de valor · objeciones · recomendaciones UX/AEO/visuales.

**Brief UX-IA** incluye: qué problema resuelve · qué hace la IA · qué decide el humano ·
qué datos usa · límites · supervisión · confianza · ejemplos · CTA · evidencia · FAQ.

---

## 📄 PLANTILLA DE REPORTE (salida estándar)

```markdown
# Organic UX & AI Demand Radar — [Mañana|Noche|General]
Fecha: AAAA-MM-DD HH:mm   ·   Sitio: medialab.design
Estado: [saludable | necesita atención | crítico]

## Resumen ejecutivo
(3–6 líneas: lo más importante y por qué)

## Scores
SEO: _/100 · UX: _/100 · UX-IA: _/100 · Diseño-IA: _/100 ·
Desarrollo: _/100 · Accesibilidad: _/100 · AEO/AI-Readiness: _/100 · AI-Trends: _/100

## Hallazgos por página
| URL | Tipo | SEO | UX | AEO | Issues clave |
|-----|------|-----|----|----|--------------|

## Search Console (si hay datos)
Quick Wins · CTR bajo · casi-top-10 · keywords invisibles

## Tendencias IA detectadas
(categoría → señales → oportunidad → formato recomendado)

## YouTube / Reddit / Social
(demanda y dolores reales con la señal de origen)

## Competidores
(gaps detectados y oportunidad de diferenciación)

## 🎯 Backlog (máx 5)
1. [P1] …
2. [P2] …

## Briefs sugeridos
(lista breve)

## ⚠️ Warnings / APIs no disponibles
(qué falló o qué insumo pegar para mejorar el próximo reporte)
```

---

## 📥 Insumos opcionales (péganos lo que tengas para más precisión)
- **GSC:** exporta *Rendimiento → Consultas/Páginas* (CSV) y pégalo, o pega los números.
- **PageSpeed:** corre pagespeed.web.dev en una URL y pega el JSON/resultados.
- **Google Trends / YouTube / Reddit / Instagram / Facebook / X:** exporta CSV a `data/`.
- **Competidores:** edítalos en `data/competitors.json`.

> Sin estos insumos el radar **igual corre** con análisis propio del sitio + investigación
> web; los marca como `⚠️ no disponible` y te dice exactamente qué pegar la próxima vez.
