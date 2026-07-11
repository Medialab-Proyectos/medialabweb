-- ─────────────────────────────────────────────────────────────────────────────
-- FASE 41 · Solicitud de retiro parcial de cesantías (empleado activo)
-- El empleado pide un retiro parcial por causal de ley (vivienda/educación); el
-- líder o el CEO lo aprueba y la empresa emite la carta dirigida al fondo.
-- Ejecuta en: Supabase → SQL Editor → New query → Run
-- ─────────────────────────────────────────────────────────────────────────────

create table if not exists solicitudes_cesantias (
  id             uuid primary key default gen_random_uuid(),
  empleado_id    uuid not null references empleados(id) on delete cascade,
  causal         text not null check (causal in
                   ('compra_vivienda','mejoras_vivienda','obligacion_hipotecaria','educacion')),
  valor          numeric not null default 0 check (valor > 0),
  detalle        text,                              -- descripción opcional del destino
  estado         text not null default 'pendiente' check (estado in ('pendiente','aprobada','rechazada')),
  aprobado_por   uuid references empleados(id) on delete set null,
  comentario     text,
  creado_en      timestamptz not null default now(),
  decidido_en    timestamptz
);
create index if not exists idx_sol_cesantias_empleado on solicitudes_cesantias(empleado_id);
create index if not exists idx_sol_cesantias_estado   on solicitudes_cesantias(estado);

alter table solicitudes_cesantias enable row level security;

notify pgrst, 'reload schema';
