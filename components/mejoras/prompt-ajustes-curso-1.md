# PROMPT — Ajustes a la página del curso (medialab.design/curso)

## Contexto
Eres un ingeniero front-end senior + UX writer. Vas a optimizar la landing del
curso **"Arquitecto de Experiencia de Usuario con IA"** en medialab.design/curso
(Next.js, dark theme, verde de marca `#10b981` sobre fondo `#0a0a0a`).

A diferencia de la home, esta página YA comunica bien: el hero es claro, tiene
precio, garantía, urgencia y buena estructura de venta. NO la reescribas entera.
Aplica solo los ajustes de abajo, que vienen de una revisión de conversión y de
los mismos patrones de "dolor" detectados en la home (scroll infinito, UXGreen™
enterrado).

## Objetivo
Aumentar la conversión a inscripción reduciendo fricción: que el precio y el
formulario sean alcanzables antes, eliminar señales que dañan credibilidad, y
acortar duplicados. Prioridad mobile-first.

## Restricciones
- Conservar dark theme + verde `#10b981` / `#047857`.
- Lenguaje claro y directo, sin frases rebuscadas.
- No inventar métricas; mantener las existentes (40+ productos, 4.7/5, 30 cupos,
  $995/$2400, etc.).
- No tocar la metadata, SEO ni accesibilidad ya existentes.

---

## AJUSTES PRIORITARIOS

### 1. CONTADOR EN CERO — verificar y corregir (CRÍTICO, credibilidad)
El bloque de precio muestra el temporizador de prelanzamiento en
`00d 00h 00m 00s`. Un contador en cero comunica que la oferta YA VENCIÓ → mata la
urgencia y genera desconfianza.
- Verificar si el contador está realmente en cero o es un fallo de render.
- Si la oferta sigue activa: que el contador apunte a una fecha futura real.
- Si ya venció: quitar el contador y reemplazar la urgencia por algo verdadero
  (p. ej. "Cohorte 02 · quedan X de 30 cupos"). NO mostrar un contador muerto.

### 2. ANCLA DE PRECIO ARRIBA / CTA PERSISTENTE (conversión)
Hoy el precio ($995 USD, $124/semana, garantía) solo aparece al final. Quien
tiene intención de compra debe recorrer ~15 bloques para verlo.
- Añadir cerca del hero una referencia ligera de precio, p. ej.
  "Desde $124/semana · Garantía semana 1" bajo los CTAs del hero.
- Añadir un **botón flotante / sticky** en móvil ("Inscribirme — $995") que
  ancle a #registro y esté visible durante todo el scroll.

### 3. ACORTAR EL SCROLL — eliminar duplicados
- El programa de módulos aparece DOS veces: la versión interactiva
  ("clic para ver más") y "Programa completo". Dejar UNA sola versión canónica
  (preferir la interactiva con expand/colapso) + el botón "Descargar currículo
  en PDF". Eliminar la repetición.
- Revisar el bloque de testimonios + "si te identificaste con esto" + mid-CTAs:
  hay varios CTA-imagen intermedios muy seguidos. Conservar máximo 2 mid-CTAs
  bien espaciados.

### 4. ENFOCAR "¿PARA QUIÉN ES?" (claridad)
Hoy lista 8 perfiles + 12 carreras universitarias. Demasiada inclusión diluye el
foco ("si es para todos, no es para nadie").
- Destacar 3-4 perfiles PRIMARIOS arriba (p. ej. UX/UI Designers, Product
  Designers, Developers, Founders/CEOs).
- Mover el resto (entusiastas, post-bootcamp, las 12 carreras) a un bloque
  secundario colapsable "¿Vienes de otra disciplina?" para no robar foco.

### 5. UXGREEN™ — sacarlo del footer (consistencia con la home)
- Ya existe el módulo "07+ Diseño de Tendencias y UX Green" en el temario: bien.
- Añadir el sello UXGreen™ como chip tappable cerca del hero o en la barra de
  credenciales ("40+ productos · Autores de Zero UI · 🌱 UXGreen™ Certified").
- Incluir el bloque UXGreen™ al final del menú hamburguesa (igual que en la home).
- Copy concreto y verificable, sin greenwashing.

### 6. MENÚ MÓVIL (consistencia con la home)
- Asegurar enlaces: Servicios, Portafolio, Curso, UXBox, UXGreen™, Blog,
  Contacto. (Hoy el header del curso dice "Educación" → considerar "Curso" para
  que coincida con lo que el usuario busca.)
- Bloque UXGreen™ al final del menú.

---

## ENTREGABLES
1. Corrección del contador (con lógica de fecha real o su eliminación).
2. CTA sticky de inscripción para móvil + ancla de precio en el hero.
3. Refactor que elimina el programa duplicado y deja una sola versión.
4. Reorganización del bloque "¿para quién es?" con primarios + secundario
   colapsable.
5. Chip UXGreen™ + bloque en menú hamburguesa.

## CRITERIOS DE ACEPTACIÓN
- No hay ningún contador en cero visible.
- El usuario puede llegar al precio o al formulario sin recorrer toda la página
  (vía sticky CTA o ancla de precio).
- El programa de módulos aparece una sola vez.
- "¿Para quién es?" muestra 3-4 perfiles primarios con foco claro.
- UXGreen™ visible sin llegar al footer.
- Todo legible y usable en celular primero.
- Metadata, SEO y accesibilidad intactos.
