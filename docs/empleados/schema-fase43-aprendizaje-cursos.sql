-- ─────────────────────────────────────────────────────────────────────────────
-- FASE 43 · Vínculo "por aprendizaje" + catálogo de cursos
--   • Nuevo modo de pago 'aprendizaje': vínculo SIN remuneración (valor 0). No genera
--     contrato con obligación de pago sino un ACUERDO DE PARTICIPACIÓN.
--   • Cursos/educación: enlaces a plataformas externas, abiertos a todo el equipo.
-- Ejecuta en: Supabase → SQL Editor → New query → Run
-- ─────────────────────────────────────────────────────────────────────────────

-- 1) Ampliar los CHECK de freelance_modo para aceptar 'aprendizaje'.
alter table contratos drop constraint if exists contratos_freelance_modo_check;
alter table contratos add constraint contratos_freelance_modo_check
  check (freelance_modo is null or freelance_modo in ('por_hora','por_mes','fijo','por_proyecto','aprendizaje'));

alter table empleados drop constraint if exists empleados_freelance_modo_check;
alter table empleados add constraint empleados_freelance_modo_check
  check (freelance_modo is null or freelance_modo in ('por_hora','por_mes','fijo','por_proyecto','aprendizaje'));

-- 2) Cursos / educación: el CEO registra enlaces a plataformas externas y quedan
--    visibles para todo el equipo. 'activo' permite publicarlos o esconderlos.
create table if not exists cursos (
  id          uuid primary key default gen_random_uuid(),
  titulo      text not null,
  descripcion text,
  plataforma  text,               -- "Platzi", "Coursera", "YouTube"…
  url         text not null,
  categoria   text,               -- "Diseño", "Desarrollo", "Liderazgo"…
  activo      boolean not null default true,
  orden       int not null default 0,
  creado_en   timestamptz not null default now()
);
alter table cursos enable row level security;

-- 3) Evaluaciones de desempeño: el CEO las habilita/deshabilita globalmente.
alter table empresa_config add column if not exists evaluaciones_habilitadas boolean not null default false;

-- 4) Gastos recurrentes: día de cobro del mes y si se debita automáticamente.
--    Los que NO son débito automático se recuerdan en "Cuentas por pagar" del dashboard.
alter table gastos_recurrentes add column if not exists dia_cobro int check (dia_cobro is null or (dia_cobro between 1 and 31));
alter table gastos_recurrentes add column if not exists debito_automatico boolean not null default false;

notify pgrst, 'reload schema';
