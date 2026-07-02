# Organic UX & AI Demand Radar — Mañana
Fecha: 2026-06-30 04:01 · Sitio: medialab.design
Estado: **Necesita atención**

> Método: auditoría en vivo (WebFetch de Home, /servicios, /servicios/diseno-ux-ui, /curso,
> /portafolio, /llms.txt) + verdad de base del código fuente (`medialabweb/`, solo lectura) +
> investigación de tendencias y voz social (WebSearch + Google News RSS). Reddit RSS dio bloqueo
> de red → cubierto con operadores/News (regla del runbook: no detenerse). GSC y PageSpeed NO se
> pegaron → marcados `⚠️ no disponible`.

## Resumen ejecutivo
El sitio sigue **técnicamente sano y con buen contenido**; las correcciones de marca de días
previos (Cumbreva, OG 1200×630, blog nuevo) **ya están desplegadas y visibles en vivo** —el
`llms.txt` en producción ya cita Cumbreva y el artículo "El gol en pausa". Persisten dos palancas:
**(1)** el **contador del Curso sigue en `00d 00h 00m 00s`** (urgencia rota = daño de confianza y
conversión), arrastrado de la corrida del 27; y **(2)** una **brecha de SEO local + AEO**: ni el
Home ni las landings de servicio dicen "**agencia UX/UI en Colombia**" arriba, justo la keyword
comercial #1. Con los AI Overviews recortando el CTR orgánico ~50–61% (y las marcas citadas
ganando +35% de clics), la ventaja está en **ser citable**: respuesta directa + ubicación + schema.
Demanda IA en pico (**Generative UI** y **agentes**) con cobertura propia aún baja.

## Scores
| Dimensión | Score | Nota |
|---|---|---|
| SEO técnico | **76/100** | 1 H1 por página, FAQ en Home/landings, schema rico en código. Penaliza: titles 75–77 chars y sin "Colombia"; portafolio con texto fino |
| UX heurístico | **76/100** | Home/Curso/Portafolio fuertes, prueba social y métricas reales |
| UX para IA | **58/100** | `/servicios` no separa "qué hace la IA / qué decide el humano"; solo Curso y UXBox lo explican |
| Diseño-IA | **62/100 ⚠️** | Aproximado — sin análisis de screenshots esta corrida |
| Desarrollo | **71/100 ⚠️** | Next.js sólido; analyzer UXGreen reforzado (maxDuration). CWV en vivo sin medir |
| Accesibilidad | **72/100 ⚠️** | Heurístico — para WCAG preciso correr axe/Pa11y |
| AEO / AI-Readiness | **66/100** | `llms.txt` vivo y rico, FAQ+schema en Home y landings, blog firmado. Falta: ubicación/local + FAQ en `/servicios` |
| AI-Trends (oportunidad) | **84/100** | GenUI + agentes en pico de demanda y cobertura del sitio baja = ventana abierta |

## Hallazgos por página
| URL | Tipo | Estado | Issues clave |
|---|---|---|---|
| `/` (Home) | home | 🟡 Bueno | Title **77 chars sin "Colombia"**; hero no dice "agencia UX/UI en Colombia/Latam" (ubicación aparece abajo). 1 H1, FAQ (6 Q), CTAs claros |
| `/servicios` | service | 🟡 Revisar | **Sin FAQ**; IA mencionada pero sin delimitar IA vs humano; ~2.300 palabras (bien). 1 H1 (el doble-H1 del 27 ya está corregido ✅) |
| `/servicios/diseno-ux-ui` | landing | 🟢 Sólido | FAQ (4 Q), 1 H1, ~1.250 palabras, respuesta directa. Falta: **casos/prueba social visibles** y mención de **Colombia** |
| `/curso` | landing | 🟠 Bug | **Contador en `00d 00h 00m 00s`** (urgencia falsa). Resto fuerte: precio $995, 4.7/5, testimonios, FAQ |
| `/portafolio` | case-study | 🟢 Fuerte | 6 casos con métricas reales (+200% tráfico, 95% precisión…). Texto SEO **fino (~300–400 palabras)**; productos propios correctamente NO listados (viven en Home) |
| `/llms.txt` | asset GEO | 🟢 Vivo | Accesible y completo: contacto, servicios, SinDeudas+Cumbreva, curso, blog "El gol en pausa", cierre para LLMs |

## Search Console
`⚠️ no disponible` — pega tu export *Rendimiento → Consultas/Páginas* (CSV) y en la próxima
corrida cruzo Quick Wins (pos 8–20 + impresiones), CTR bajo (<2%) y keywords estratégicas
invisibles. *(Contexto previo: impresiones no-marca ≈ 0 → tráfico de referidos, no de Google;
por eso el SEO local + AEO es la palanca de adquisición.)*

## Tendencias IA detectadas (WebSearch + News, junio 2026)
| Tendencia | Señal | Oportunidad MediaLab | Formato |
|---|---|---|---|
| **Generative UI (GenUI)** | Tendencia #1 2026; "interfaces dibujadas en tiempo real según intención" (UX Tigers, Stan.vision) | Diseño aumentado con IA / prototipado | Landing `/diseno-aumentado-con-ia` + artículo |
| **Agentes IA (agentic UX)** | 60% de diseñadores creen impacto mayor en 2026; Double-Diamond agentic (UXmatters) | Flujos con IA / diseño de agentes | Landing `/diseno-agentes-ia` + caso |
| **IA en herramientas de diseño** | Figma AI, Google Stitch ("diseñar por voz sin Figma"), generative UI (News CO/LatAm) | Curso + diseño con IA | Artículo/Reel comparativo |
| **AI Overviews / AEO** | CTR orgánico −50/61% con AIO; marcas **citadas +35% clics** (Seer, Ahrefs) | Visibilidad propia (no servicio) | Reforzar respuesta directa + schema + autoría |
| **"94% falla en usabilidad web"** | Titular regional con tracción (Ecosistema Startup) | Auditoría UX | Artículo + CTA a diseño UX/UI |

## YouTube / Reddit / Social
- **Reddit RSS** → `⚠️ bloqueo de red` esta corrida (429/cortafuegos). Operadores Google tampoco
  devolvieron citas verificables → **no se afirma tono social** (regla: no inventar voz).
- **Google News (es-419, CO)**: dominan *aplicación práctica de IA en herramientas de diseño*
  (Figma AI, Stitch, GenUI) y *capacitación/becas IA*. Señal: demanda de contenido **práctico**
  "cómo usar IA en UX/UI" en español. Fuente: news.google.com (titulares may–jun 2026).

## Competidores
`⚠️ no configurados` — `data/competitors.json` tiene placeholders. Pásame 2–3 dominios reales
(agencias UX/UI Colombia/LatAm) y en la próxima corrida hago *gap analysis* de servicios/IA/AEO.

## 🎯 Backlog (máx 5)
1. **[P1] Reparar o quitar el contador del Curso** (`00d 00h 00m 00s`). Urgencia falsa = daño de
   confianza y conversión. Señal: WebFetch `/curso` (persistente desde 2026-06-27). *(bug de
   conversión — fuera del alcance "solo SEO" pero es la prioridad real del sitio.)*
2. **[P1] SEO local + AEO: inyectar "Colombia/LatAm" arriba.** Titles/metadescriptions del Home y
   landings de servicio con la keyword **"agencia UX/UI Colombia"** (sin tocar layout). Señal:
   keyword estratégica #1 + AIO premia respuesta directa con entidad geográfica. *(aplicado hoy — ver abajo)*
3. **[P2] FAQ real en `/servicios`** (3–4 preguntas con su `FAQPage` JSON-LD) que delimite
   **qué hace la IA vs qué decide el humano**. Sube UX-IA y AEO. Señal: WebFetch `/servicios`.
4. **[P2] Abrir 1 landing de tendencia IA** (`/diseno-aumentado-con-ia` o `/diseno-agentes-ia`)
   mapeada a "flujos con IA / diseño a la medida". Señal: GenUI+agentes en pico, cobertura 0.
5. **[P3] Engordar `/portafolio`** a ≥500 palabras (intro + contexto por caso) y validar
   `ItemList` JSON-LD visible. Señal: WebFetch `/portafolio` (~350 palabras).

## Briefs sugeridos
- Landing `/diseno-aumentado-con-ia` (keyword: "ux con ia" / "diseño aumentado con ia").
- Artículo "Cómo usar IA en UX/UI sin perder criterio" (demanda práctica en News CO).
- FAQ-IA para `/servicios` (qué hace la IA / qué decide el humano / datos / supervisión).

## ✅ Ajustes aplicados en esta corrida (SEO/LLM/GEO, sin tocar estructura)
- **Home title** localizado y acortado: incluye "Colombia" y baja de 77 → ~55 chars.
- **Metadescriptions** de Home y `/servicios` con entidad geográfica ("Colombia/LatAm").
- `/servicios` y `/portafolio` titles afinados con ubicación.
- (Detalle exacto en el commit / diff de la corrida.)

## ⚠️ Warnings / APIs no disponibles
- **GSC**: `⚠️ no disponible` → pega export de *Rendimiento* (CSV) para Quick Wins reales.
- **PageSpeed/CWV**: `⚠️ no medido` → corre pagespeed.web.dev en `/` y `/curso` y pega resultados.
- **Reddit RSS**: `⚠️ bloqueo de red` → reintentar con `t=week` y de a un sub, o pegar CSV.
- **Competidores**: `⚠️ placeholders` → edita `data/competitors.json` con dominios reales.
- **Diseño-IA/Accesibilidad/Dev**: scores heurísticos → para precisión, `corre axe`/Pa11y y Lighthouse.
