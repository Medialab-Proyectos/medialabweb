-- ─────────────────────────────────────────────────────────────────────────────
-- FASE 28 · Catálogo de funciones por rol + otrosí de condiciones
--   • roles_funciones: el CEO define las funciones de cada rol (Junior/Middle/
--     Senior/Lead UX y de desarrollo). Al generar un otrosí de cambio de rol se
--     insertan las funciones del cargo elegido.
--   • contratos.rol_funciones_id: perfil de funciones asociado a la versión.
--   • contratos.condiciones_adicionales: cláusulas adicionales (texto libre) para
--     el otrosí (o para dejar un otrosí solo de condiciones adicionales).
-- Requiere schema-fase3-contratos.sql.
-- Ejecuta en: Supabase → SQL Editor → New query → Run
-- ─────────────────────────────────────────────────────────────────────────────

create table if not exists roles_funciones (
  id         uuid primary key default gen_random_uuid(),
  nombre     text not null,
  funciones  jsonb not null default '[]'::jsonb,  -- array de strings (bullets)
  orden      integer not null default 0,
  creado_en  timestamptz not null default now()
);

alter table contratos add column if not exists rol_funciones_id uuid;
alter table contratos add column if not exists condiciones_adicionales text;

-- Semilla de roles (el CEO los edita/expande en el portal).
insert into roles_funciones (nombre, orden, funciones) values
('Product Design Lead (UX Lead)', 1, jsonb_build_array(
  'Crear flujos de usuario, wireframes, mockups y prototipos de alta fidelidad siguiendo las guías de estilo y principios comportamentales definidos por el equipo.',
  'Traducir requerimientos funcionales y hallazgos de investigación en interfaces intuitivas y coherentes con el sistema de diseño aplicable.',
  'Establecer y mantener sistemas de diseño escalables, componentes reutilizables y lineamientos visuales que garanticen eficiencia y coherencia.',
  'Implementar componentes reutilizables en Figma y mantener su consistencia con el Design System aplicable al proyecto.',
  'Supervisar y guiar el trabajo de las personas bajo su coordinación directa, asegurando calidad y coherencia visual y funcional. Este rol no implica facultades disciplinarias ni administrativas.',
  'Planificar y coordinar investigaciones de usuario, pruebas de usabilidad, entrevistas y estudios de comportamiento, transformando los resultados en oportunidades de mejora.',
  'Revisar, validar y aprobar flujos, wireframes, mockups y prototipos antes de su presentación o desarrollo, asegurando estándares de accesibilidad y usabilidad.',
  'Liderar las presentaciones y validaciones con clientes, comunicando el valor estratégico del diseño y la justificación de las decisiones.',
  'Impulsar la formación y desarrollo del equipo mediante mentoría y feedback dentro de la jornada laboral.'
)),
('Senior UX', 2, jsonb_build_array(
  'Diseñar flujos, wireframes, mockups y prototipos de alta fidelidad de forma autónoma.',
  'Traducir requerimientos e investigación en soluciones de diseño coherentes con el sistema aplicable.',
  'Mantener y contribuir al sistema de diseño y a los componentes reutilizables.',
  'Planear y ejecutar investigación de usuario y pruebas de usabilidad.',
  'Apoyar y revisar el trabajo de perfiles junior/middle cuando se le solicite.'
)),
('Middle UX', 3, jsonb_build_array(
  'Diseñar wireframes, mockups y prototipos con supervisión de perfiles senior/lead.',
  'Aplicar el sistema de diseño y los lineamientos del proyecto.',
  'Apoyar la investigación de usuario y la documentación de patrones.',
  'Iterar sobre entregables a partir de la retroalimentación del equipo.'
)),
('Junior UX', 4, jsonb_build_array(
  'Apoyar la creación de wireframes, mockups y prototipos bajo supervisión.',
  'Aplicar guías de estilo y componentes del sistema de diseño.',
  'Documentar y ordenar entregables de diseño.',
  'Participar en sesiones de investigación y revisión de trabajo.'
)),
('Lead de Desarrollo (Tech Lead)', 5, jsonb_build_array(
  'Definir la arquitectura técnica y los estándares de código del equipo.',
  'Revisar y aprobar pull requests asegurando calidad, seguridad y mantenibilidad.',
  'Coordinar técnicamente el trabajo del equipo de desarrollo. Este rol no implica facultades disciplinarias ni administrativas.',
  'Planificar la ejecución técnica de los proyectos y estimar esfuerzos.',
  'Mentorear a los desarrolladores y difundir buenas prácticas dentro de la jornada laboral.'
)),
('Senior Desarrollo', 6, jsonb_build_array(
  'Desarrollar funcionalidades complejas de forma autónoma con alta calidad.',
  'Diseñar soluciones técnicas y participar en decisiones de arquitectura.',
  'Revisar código de perfiles junior/middle y proponer mejoras.',
  'Asegurar pruebas, documentación y buenas prácticas.'
)),
('Middle Desarrollo', 7, jsonb_build_array(
  'Desarrollar funcionalidades con supervisión de perfiles senior/lead.',
  'Escribir código mantenible siguiendo los estándares del equipo.',
  'Elaborar pruebas y documentación de lo desarrollado.',
  'Corregir defectos e iterar a partir de las revisiones.'
)),
('Junior Desarrollo', 8, jsonb_build_array(
  'Desarrollar tareas de menor complejidad bajo supervisión.',
  'Seguir los estándares de código y las guías del equipo.',
  'Escribir pruebas básicas y documentar su trabajo.',
  'Aprender y aplicar las buenas prácticas del equipo.'
))
on conflict do nothing;

notify pgrst, 'reload schema';
