# PROMPT — Rediseño de la home de MediaLab.design para reducir el rebote

## Contexto
Eres un ingeniero front-end senior + UX writer. Vas a reestructurar la home de
**medialab.design** (Next.js, dark theme, verde de marca `#10b981` sobre fondo
`#0a0a0a`). El sitio es técnicamente sólido (SEO, metadata, accesibilidad
correctos) pero tiene un **rebote del ~88%** con ~500 visitas. El problema NO es
técnico: es de claridad y arquitectura de decisión.

## Problemas confirmados por entrevistas a usuarios
1. El hero actual ("Productos digitales que las personas aman") es una promesa
   emocional que NO dice qué hace la empresa. El usuario no entiende el negocio
   en los primeros 5 segundos.
2. El CTA "Probar UXBox gratis" aparece en el hero, pero la explicación de qué es
   UXBox está a 8 scrolls de distancia → botón misterioso que nadie toca.
3. Las tres unidades de negocio (UXFactory, UXSchool, UXLab) solo aparecen como
   logos SVG sin texto ni enlace. El usuario no encuentra dónde hacer clic.
4. La página es un scroll infinito que repite el ecosistema 3 veces. El curso
   (UXSchool) queda perdido al final.
5. El sello de sostenibilidad **UXGreen™** está enterrado en el footer.
6. La mayoría de usuarios navega desde el celular.

## Objetivo
Que un visitante entienda en 5 segundos QUÉ hace MediaLab y encuentre de
inmediato SU camino (empresa, profesional o curioso), sin scroll innecesario.
Meta: reducir el rebote sustancialmente. Prioridad mobile-first.

## Restricciones de marca y tono
- Conservar dark theme + verde `#10b981` (acento) / `#047857` (profundo).
- Lenguaje claro, directo, sin frases rebuscadas ni academicismos.
- Mantener el carácter humano/emocional, PERO siempre después de la claridad.
- No inventar métricas; mantener las existentes (40+ productos, 98%, 7 países,
  4.8/5) y etiquetar como aproximadas si aplica.

---

## INSTRUCCIONES SECCIÓN POR SECCIÓN

### 1. HERO (reemplazar el actual)
**Titular (dice qué hacemos, literal):**
> Diseñamos, construimos y optimizamos **productos digitales** con IA y
> psicología del consumidor

(la palabra "productos digitales" en verde)

**Subtítulo (la promesa emocional pasa aquí):**
> De una idea vaga a un producto que tus usuarios aman — validado con evidencia
> real, no con suposiciones.

**Chips superiores (dos, lado a lado):**
- `40+ productos en producción · 7 países`
- `🌱 UXGreen™ Certified` (verde, tappable → /uxgreen)

**CTAs (dos):**
- Primario: "Quiero transformar mi producto" → #contact
- Secundario (ghost): "Probar UXBox gratis" → #uxbox

**Línea de contexto bajo los CTAs (resuelve el botón misterioso):**
> **UXBox** · tu brief de producto con IA en minutos · 30 min gratis, respuesta en 24h

### 2. TRES PUERTAS DE ENTRADA (nueva sección, justo bajo el hero)
Tres tarjetas en grid (3 col desktop, 1 col móvil). Cada una con ícono,
etiqueta de audiencia, título, descripción de 1-2 líneas y enlace propio.
Hover: borde verde + leve elevación.

**Tarjeta 1 — UXFactory** (etiqueta "Para empresas")
> Diseñamos y construimos tu producto digital a la medida: web, apps,
> dashboards y MVPs listos para validar.
> → "Ver servicios y portafolio" → /portafolio

**Tarjeta 2 — UXSchool** (etiqueta "Para profesionales")
> Conviértete en Arquitecto de Experiencias con IA. 9 módulos, criterio humano
> primero. Cohorte 02 abierta.
> → "Explorar el curso" → /curso

**Tarjeta 3 — UXLab** (etiqueta "Nuestros productos")
> Apps propias como SinDeudas y Electrolineras. Demostramos lo que hacemos
> viviéndolo nosotros primero.
> → "Conocer los productos" → (ancla a sección UXLab)

### 3. UXBOX — dar contexto antes del CTA
Mantener la sección del generador con IA, pero subir un resumen de 1 frase
("¿Qué es UXBox?: analiza tu idea y te entrega un brief accionable en minutos")
INMEDIATAMENTE visible, no oculto tras scroll. El CTA del hero debe anclar
directo a esta sección.

### 4. ACORTAR EL SCROLL (deduplicación)
- El bloque "ecosistema" se repite ~3 veces. Dejar UNA aparición canónica
  (las 3 puertas del punto 2 ya cumplen esa función) y eliminar las repeticiones.
- Mover el detalle profundo de cada servicio a sus páginas internas (ya existen:
  /servicios/diseno-ux-ui, /servicios/discovery-con-ia, etc.). En la home dejar
  solo el resumen + enlace "Conoce más".
- La home debe funcionar como ÍNDICE DE DECISIÓN, no como documento completo.
- Orden sugerido de la home: Hero → 3 Puertas → Problema/solución (1 bloque) →
  Cómo trabajamos (5 pasos, compacto) → UXBox → UXSchool destacado →
  Testimonios (máx 3) → Industrias → UXLab → FAQ → Contacto → Footer.

### 5. RESCATAR UXSCHOOL (el curso)
Además de su tarjeta en las 3 puertas, mantener su bloque dedicado pero subirlo
en el orden (antes estaba casi al final). Debe tener CTA claro "Explorar el
curso" y mencionar "Cohorte 02 · cupos limitados".

### 6. UXGREEN™ — sacarlo del footer
- Chip verde en el hero (ya incluido en punto 1), tappable → /uxgreen.
- Bloque sutil al final del menú hamburguesa (clave en móvil): sello + línea
  "Sitio certificado UXGreen™ · Eficiencia digital sostenible. Web ligera que
  consume menos energía."
- NO hacer un despliegue de producto; solo informarlo con dignidad. El copy debe
  ser concreto y verificable (peso de página / consumo), sin greenwashing.

### 7. MENÚ MÓVIL (hamburguesa)
- Enlaces principales: Servicios, Portafolio, Curso · UXSchool, UXBox, UXGreen™,
  Contacto.
- Asegurar que "Curso" sea visible y no se confunda con "Educación".
- Al final, el bloque UXGreen™ descrito arriba.

---

## ENTREGABLES
1. Componente(s) React/Next.js del nuevo hero + sección de 3 puertas, mobile-first,
   con los estilos en línea con el sistema actual (verde `#10b981`, fuentes
   existentes).
2. Ajuste del menú hamburguesa con el bloque UXGreen™.
3. Lista de secciones a eliminar/colapsar para acortar el scroll.
4. Conservar toda la metadata, SEO y accesibilidad ya existentes.

## CRITERIOS DE ACEPTACIÓN
- El titular dice qué hace la empresa de forma literal.
- Las 3 unidades de negocio son clicables y autoexplicativas sobre el pliegue.
- UXBox tiene contexto antes de cualquier CTA hacia él.
- UXGreen™ visible sin llegar al footer.
- La home es navegable sin scroll infinito; el detalle vive en páginas internas.
- Todo legible y usable en pantalla de celular primero.
