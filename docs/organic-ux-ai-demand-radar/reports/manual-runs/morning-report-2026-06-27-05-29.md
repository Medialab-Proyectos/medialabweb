# Organic UX & AI Demand Radar — Mañana
Fecha: 2026-06-27 05:29 · Sitio: medialab.design
Estado: **Necesita atención**

> Método: auditoría en vivo (WebFetch de páginas + sitemap) + verdad de base del código fuente
> (`medialabweb/`, solo lectura) + investigación de tendencias (WebSearch). GSC y PageSpeed
> NO se pegaron en esta corrida → marcados `⚠️ no disponible`.

## Resumen ejecutivo
El sitio está **técnicamente sano y con buen contenido** (Home, Curso y Portafolio son páginas
de conversión fuertes, con prueba social y métricas reales). El problema no es calidad: es
**cobertura**. No existe **ninguna landing** para las keywords comerciales estratégicas
(`ux con ia`, `diseño de agentes ia`, `auditoría ux`, `posicionamiento en buscadores ia`),
justo cuando la demanda de IA (agentes, MCP, generative UI) está en pico. Además, hay
**correcciones de marca ya listas en código pero sin desplegar** (title, OG 1200×630, imágenes
de blog locales). La palanca #1 de hoy es **desplegar + abrir 2–3 landings de IA**.

## Scores
| Dimensión | Score | Nota |
|---|---|---|
| SEO técnico | **74/100** | Base sólida; penaliza gaps de contenido comercial y fixes sin deploy |
| UX heurístico | **72/100** | Home/Curso/Portafolio fuertes; `/servicios` con doble H1 |
| UX para IA | **55/100** | No separa "qué hace la IA / qué decide el humano" fuera del Curso |
| Diseño-IA | **60/100 ⚠️** | Aproximado — sin análisis de screenshots esta corrida |
| Desarrollo | **68/100 ⚠️** | Next.js sólido; security headers sin verificar en vivo |
| Accesibilidad | **70/100 ⚠️** | Heurístico — para WCAG preciso correr axe/Pa11y |
| AEO / AI-Readiness | **58/100** | Home con FAQ+schema; `/servicios` sin FAQ; faltan páginas de definición |
| AI-Trends (oportunidad) | **82/100** | Demanda IA alta y cobertura del sitio baja = ventana abierta |

## Hallazgos por página
| URL | Tipo | Estado | Issues clave |
|---|---|---|---|
| `/` (Home) | home | 🟡 Bueno | Hero NO dice "agencia UX/UI en Colombia/Latam"; ubicación aparece abajo, no en el primer pantallazo |
| `/servicios` | service | 🟡 Revisar | **2 H1** (debe haber 1); sin FAQ; IA mencionada pero sin delimitar IA vs humano |
| `/curso` | landing | 🟢 Fuerte | Conversión sólida (precio, audiencia, 4.7/5, 15 FAQ). **Bug: contador en 00d 00h 00m** (urgencia rota) |
| `/portafolio` | case-study | 🟢 Fuerte | 6 casos con métricas reales (+200% tráfico, etc.) y texto SEO-friendly |
| Inventario | — | 🔴 Gap | **0 landings** para keywords IA estratégicas (ver Backlog) |

## Search Console
`⚠️ no disponible` — pega tu export *Rendimiento → Consultas/Páginas* (CSV) y en la próxima
corrida cruzo Quick Wins (pos 8–20), CTR bajo y keywords invisibles. *(Contexto previo conocido:
impresiones no-marca ≈ 0 → el tráfico es de referidos, no de Google.)*

## Tendencias IA detectadas (WebSearch, junio 2026)
| Tendencia | Señal | Oportunidad MediaLab | Formato |
|---|---|---|---|
| **AI Agents** (multi-agente) | "el año en que los agentes se volvieron mainstream"; AutoGPT 182k★, n8n 162k★ | Landing `/diseno-agentes-ia` (UX de agentes; qué decide el humano) | Landing + artículo + video |
| **MCP** (capa estándar de integración) | MCP "se vuelve el pegamento" del ecosistema | Artículo de autoridad "Qué es MCP y por qué importa al diseñar productos" | Artículo + carrusel |
| **Generative UI** | UI generada por IA en auge | Artículo "Generative UI: cómo cambia el UX/UI" | Artículo + Reel |
| **RAG privado** | RAGFlow/Dify, "privacy-first ya no es nicho" | Servicio: experiencias conversacionales con base de conocimiento | Landing servicio |
| **Vibe/AI coding** | Claude Code 113k★, asistentes de código | `/optimizacion-frontend-con-ia` (encaja con tu Curso) | Landing + artículo |

## YouTube / Reddit / Social
`⚠️ no profundizado esta corrida` — para la próxima exporto CSV o investigo demanda por keyword.
Señal preliminar de la web: alta conversación sobre "agentes" y "AI coding" → coincide con los gaps.

## Competidores
`⚠️ pendiente` — `data/competitors.json` tiene placeholders. Dame 2–3 dominios reales y en la
próxima corrida detecto gaps de servicios/IA/UX frente a ellos.

## 🎯 Backlog (máx 5) — para ejecutar hoy
1. **[P1] Desplegar las correcciones ya hechas** (title → "MediaLab Ingeniería", OG 1200×630,
   imágenes de blog locales, limpieza de `alternateName`). *Ya están en código; solo falta push a Vercel.*
   → Señal: trabajo de las sesiones previas, sin publicar.
2. **[P1] Crear landing `/ux-con-ia`** (keyword comercial estratégica, 0 cobertura, demanda IA en pico).
   → Señal: gap de inventario + AI-Trends 82/100.
3. **[P1] Crear landing `/diseno-agentes-ia`** (tendencia #1 de 2026 + keyword estratégica + 0 cobertura).
   → Señal: WebSearch GitHub (agentes mainstream) + gap de contenido.
4. **[P2] Arreglar `/servicios`**: corregir el **doble H1**, añadir sección "Qué hace la IA / Qué
   decide el humano" y un **FAQ** con preguntas reales. → Señal: auditoría en vivo (UX-IA 55 + AEO 58).
5. **[P2] Crear landing `/auditoria-ux`** (servicio tangible + keyword "auditoría ux página web";
   funciona como lead magnet). → Señal: gap de inventario + intención comercial alta.

**Secundarios (P3, no entran al top-5):** arreglar contador roto del Curso · subir "Bogotá/Latam"
al hero de la Home · verificar security headers en vivo.

## Briefs sugeridos (corre `radar briefs` para generarlos completos)
1. Landing: **UX con IA para productos digitales** (`/ux-con-ia`)
2. Landing: **Diseño de agentes IA** (`/diseno-agentes-ia`)
3. Landing: **Auditoría UX para empresas** (`/auditoria-ux`)
4. Artículo: **Qué es Generative UI y cómo cambia el diseño UX/UI**
5. Video YouTube: **5 señales de que tu web no convierte**

## ⚠️ Warnings / insumos para mejorar el próximo reporte
- **GSC:** pega el export de Consultas/Páginas (desbloquea Quick Wins reales).
- **PageSpeed:** corre pagespeed.web.dev en Home y `/servicios` y pega resultados (CWV exactos).
- **Competidores:** edita `data/competitors.json` con dominios reales.
- **Nota de método:** el lector de WebFetch no parsea el `<head>`, por eso title/meta/OG se
  validaron contra el código fuente (donde sí existen y están correctos).

**Fuentes (tendencias IA):** [OSSInsight Trending AI](https://ossinsight.io/trending/ai) ·
[GitHub Trending: AI Agents and Dev Tools, June 2026](https://startupcorners.com/digest/devtools-digest-2026-06-18) ·
[Top AI GitHub Repositories 2026](https://blog.bytebytego.com/p/top-ai-github-repositories-in-2026)
