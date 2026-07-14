-- ─────────────────────────────────────────────────────────────────────────────
-- FASE 42 · Horario laboral por empleado + permisos por horas
-- El empleado registra su horario (lun–vie); el líder lo aprueba y solo entonces entra
-- en vigencia. El CEO ve "quién está activo ahora" cruzando horario + permisos aprobados.
-- Ejecuta en: Supabase → SQL Editor → New query → Run
-- ─────────────────────────────────────────────────────────────────────────────

-- Horarios (append-only por versión): el VIGENTE es el más reciente con estado 'aprobado';
-- una propuesta nueva nace 'pendiente' y no rige hasta que el líder la apruebe.
create table if not exists horarios_empleado (
  id            uuid primary key default gen_random_uuid(),
  empleado_id   uuid not null references empleados(id) on delete cascade,
  horario       jsonb not null,                    -- { lun:{activo,entrada,salida,almuerzoInicio,almuerzoFin}, ... }
  horas_semana  numeric not null default 0,
  estado        text not null default 'pendiente' check (estado in ('pendiente','aprobado','rechazado')),
  aprobado_por  uuid references empleados(id) on delete set null,
  comentario    text,
  creado_en     timestamptz not null default now(),
  decidido_en   timestamptz
);
create index if not exists idx_horarios_empleado on horarios_empleado(empleado_id);
create index if not exists idx_horarios_estado   on horarios_empleado(estado);

alter table horarios_empleado enable row level security;

-- Permisos por HORAS: un permiso que no es vacaciones puede ser por día (como hoy) o por horas.
alter table solicitudes_ausencia add column if not exists por_horas boolean not null default false;
alter table solicitudes_ausencia add column if not exists hora_inicio text; -- "14:00" (solo si por_horas)
alter table solicitudes_ausencia add column if not exists hora_fin    text; -- "16:00"

notify pgrst, 'reload schema';
