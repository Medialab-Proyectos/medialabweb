-- ─────────────────────────────────────────────────────────────────────────────
-- FASE 32 · Inversiones (CDTs u otras)
--   Inversiones de la empresa: monto, entidad, apertura, vencimiento y rendimiento.
--   Al cerrar, el rendimiento cuenta como ingreso. Alerta de vencimiento en el
--   panel del CEO.
-- Ejecuta en: Supabase → SQL Editor → New query → Run
-- ─────────────────────────────────────────────────────────────────────────────

create table if not exists inversiones (
  id                    uuid primary key default gen_random_uuid(),
  entidad               text not null,
  tipo                  text,                       -- CDT, fondo, acciones…
  monto                 numeric not null default 0,
  moneda                text not null default 'COP' check (moneda in ('COP','USD')),
  tasa                  numeric,                    -- % de rendimiento (E.A.)
  rendimiento_esperado  numeric not null default 0,
  rendimiento_real      numeric,
  fecha_apertura        date not null,
  fecha_vencimiento     date,
  cuenta_id             uuid references cuentas(id) on delete set null,
  estado                text not null default 'abierta' check (estado in ('abierta','cerrada')),
  notas                 text,
  creado_por            text,
  creado_en             timestamptz not null default now(),
  actualizado_en        timestamptz not null default now()
);
create index if not exists idx_inversiones_estado on inversiones(estado);

alter table inversiones enable row level security;

drop trigger if exists trg_inversiones_updated on inversiones;
create trigger trg_inversiones_updated before update on inversiones
  for each row execute function set_actualizado_en();

notify pgrst, 'reload schema';
