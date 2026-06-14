# Plan diario de lanzamiento — Experience Radar Mundial 2026

## Objetivo

Convertir cada partido en una pieza de actualidad con una lectura propia: no competir por
el marcador, sino por explicar qué enseña sobre emoción, comportamiento y diseño de
experiencias.

## Cadencia por partido

Usar la hora de Bogotá como referencia.

| Momento | Canal | Pieza | Objetivo |
| --- | --- | --- | --- |
| 3-6 h antes | Instagram Stories | Encuesta + radar previo | Activar participación |
| 15-30 min después | Instagram Stories | Marcador + emoción dominante | Capturar el pico |
| 60-120 min después | Instagram carrusel | 6 láminas | Alcance y guardados |
| 2-4 h después | LinkedIn | Análisis de 180-260 palabras | Autoridad y clics |
| Día siguiente, 8:00 a. m. | LinkedIn o Instagram | Hallazgo UX del día | Recirculación |

No publicar todos los partidos con el mismo peso. Priorizar anfitriones, selecciones
latinoamericanas, sorpresas, remontadas, polémicas verificadas y cambios emocionales fuertes.

## Horarios recomendados

- LinkedIn: 8:00-9:00 a. m. o 12:00-1:00 p. m.
- Instagram carrusel: 7:00-9:00 p. m.
- Stories: alrededor del partido, sin esperar la franja principal.
- Si un partido termina después de las 10:00 p. m., publicar Stories esa noche y el
  carrusel/LinkedIn a las 8:00 a. m. del día siguiente.

## Carrusel de Instagram

1. Portada: `EQUIPO 2-0 EQUIPO` + hallazgo de máximo 8 palabras.
2. El momento que cambió la emoción.
3. Cómo lo vivió la hinchada A.
4. Cómo lo vivió la hinchada B.
5. El sesgo cognitivo observado.
6. Aplicación a producto + CTA: `Lee el análisis completo en medialab.design`.

Formato: 1080 × 1350 px, zona segura central, alto contraste y máximo 18 palabras por lámina.

## Plantilla de LinkedIn

```text
[MARCADOR]: el partido no se decidió solo en la cancha. También cambió la forma en que
dos hinchadas interpretaron la misma experiencia.

El punto de quiebre fue [MOMENTO VERIFICADO]. Para [EQUIPO A], significó [EMOCIÓN].
Para [EQUIPO B], activó [EMOCIÓN/CONVERSACIÓN].

El hallazgo de comportamiento: [SESGO COGNITIVO EN UNA FRASE].

En producto ocurre igual: [APLICACIÓN UX CONCRETA].

Analizamos el partido con datos verificados, conversación digital y una lectura de UX:
[URL CANÓNICA]

#ExperienceRadar #UX #BehavioralDesign #Mundial2026 #ProductDesign
```

## Prompt maestro de imagen por partido

```text
Crea una portada editorial deportiva vertical 4:5, 1080x1350, para una serie llamada
"Experience Radar". Partido: [EQUIPO A] vs [EQUIPO B]. Resultado: [MARCADOR]. Hallazgo
emocional: [HALLAZGO]. Representa a dos grupos de aficionados mediante colores nacionales,
gestos, luz y atmósfera, sin copiar rostros de jugadores reales. Integra un radar emocional
abstracto de seis ejes, ondas de conversación digital y tensión visual antes-durante-después.
Estética de periodismo de datos premium, fotografía editorial cinematográfica combinada con
infografía limpia, fondo oscuro, alto contraste, composición con espacio libre arriba y abajo
para añadir texto después. Sin logos de FIFA, sin escudos oficiales, sin marcas, sin trofeos
oficiales, sin texto generado, sin apuestas, sin cuotas, sin marcas de agua.
```

### Variante previa

```text
La escena ocurre antes del partido: expectativa, ansiedad e incertidumbre. No mostrar un
marcador ni insinuar un ganador. El radar debe destacar [EMOCIONES PREVIAS].
```

### Variante final

```text
La escena ocurre después del partido. El lado de [GANADOR/EQUIPO SATISFECHO] comunica
[EMOCIÓN]; el lado de [PERDEDOR/EQUIPO FRUSTRADO] comunica [EMOCIÓN]. El punto visual
central representa [JUGADA O MOMENTO], sin recrear literalmente a jugadores reales.
```

## Programación

Crear en Meta Business Suite dos piezas por partido: Stories cerca del pitazo final y
carrusel en la franja nocturna o a la mañana siguiente. Programar LinkedIn desde la página
de empresa para 2-4 horas después del partido; si el análisis no está verificado a esa hora,
moverlo a las 8:00 a. m. siguiente. La URL siempre debe ser la canónica de la nota.

## Checklist SEO diario

1. Confirmar que la nota devuelve HTTP 200 y no contiene `noindex`.
2. Confirmar canonical, título, descripción, imagen OG y JSON-LD `NewsArticle`.
3. Verificar presencia en `/sitemap.xml`, `/news-sitemap.xml` y `/experience-radar/feed.xml`.
4. En Search Console, inspeccionar la URL y solicitar indexación solo al finalizar la nota.
5. Publicar enlaces desde LinkedIn, Instagram bio/Story y una página interna ya indexada.
6. Revisar a las 24-72 horas con `site:medialab.design/experience-radar/mundial-2026` y
   con el informe de indexación de Search Console.
7. No usar la API de indexación de Google para estas notas: oficialmente está limitada a
   ofertas de empleo y transmisiones en vivo.

## Consultas de seguimiento

- Google: `site:medialab.design/experience-radar/mundial-2026`
- Google: `site:medialab.design "EQUIPO A" "EQUIPO B"`
- Google/Gemini: `Experience Radar MediaLab EQUIPO A EQUIPO B`
- Search Console: filtrar páginas por `/experience-radar/mundial-2026/`.

`llms.txt` ayuda a describir la publicación, pero no fuerza la inclusión en Google o Gemini.
Para aparecer en experiencias generativas de Google, primero hay que ser rastreable,
indexable, útil y elegible en el índice normal de Google.
