-- ─────────────────────────────────────────────────────────────────────────────
-- FASE 4 · Vacaciones y ausencias
-- Ejecuta en: Supabase → SQL Editor → New query → Run
-- ─────────────────────────────────────────────────────────────────────────────

-- Saldo de vacaciones del empleado (punto de partida = pendientes del año anterior).
alter table empleados add column if not exists vacaciones_saldo_inicial numeric not null default 0;
alter table empleados add column if not exists vacaciones_corte date; -- desde cuándo acumula (default: fecha_ingreso)

-- Solicitudes de vacaciones / permisos / licencias.
create table if not exists solicitudes_ausencia (
  id               uuid primary key default gen_random_uuid(),
  empleado_id      uuid not null references empleados(id) on delete cascade,
  tipo             text not null check (tipo in (
                     'vacaciones','permiso_no_remunerado','licencia_maternidad',
                     'licencia_paternidad','licencia_luto','dia_familia','dia_votacion','otra')),
  fecha_inicio     date not null,
  fecha_fin        date not null,
  dias_habiles     numeric not null default 0,   -- excluye fines de semana y festivos CO
  dias_calendario  numeric not null default 0,
  motivo           text,
  estado           text not null default 'pendiente' check (estado in ('pendiente','aprobada','rechazada')),
  aprobado_por     uuid references empleados(id) on delete set null,
  comentario       text,                          -- nota del líder al aprobar/rechazar
  creado_en        timestamptz not null default now(),
  decidido_en      timestamptz
);
create index if not exists idx_ausencias_empleado on solicitudes_ausencia(empleado_id);
create index if not exists idx_ausencias_estado   on solicitudes_ausencia(estado);

alter table solicitudes_ausencia enable row level security;

notify pgrst, 'reload schema';
