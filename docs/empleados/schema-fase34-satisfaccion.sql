-- ─────────────────────────────────────────────────────────────────────────────
-- FASE 34 · Encuestas de satisfacción
--   • empleados.email_empresarial: correo corporativo (para enviar la encuesta).
--   • satisfaccion: respuestas de empleados (desde su portal) y registros de
--     satisfacción de empresas (los ingresa el CEO; NO se envía nada a clientes).
-- Ejecuta en: Supabase → SQL Editor → New query → Run
-- ─────────────────────────────────────────────────────────────────────────────

alter table empleados add column if not exists email_empresarial text;

create table if not exists satisfaccion (
  id            uuid primary key default gen_random_uuid(),
  origen        text not null check (origen in ('empleado','empresa')),
  empleado_id   uuid references empleados(id) on delete cascade,   -- origen = 'empleado'
  empresa       text,                                              -- origen = 'empresa' (nombre)
  periodo       text not null,               -- 'YYYY-MM'
  puntaje       numeric not null,            -- 0..100
  recomendacion int,                         -- 0..10 (eNPS), opcional
  comentario    text,
  creado_por    text,
  creado_en     timestamptz not null default now()
);
-- Una respuesta por empleado y periodo.
create unique index if not exists uniq_satisfaccion_empleado on satisfaccion (empleado_id, periodo) where origen = 'empleado';
create index if not exists idx_satisfaccion_periodo on satisfaccion (periodo);

alter table satisfaccion enable row level security;

notify pgrst, 'reload schema';
