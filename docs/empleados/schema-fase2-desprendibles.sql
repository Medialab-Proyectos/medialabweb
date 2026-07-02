-- ─────────────────────────────────────────────────────────────────────────────
-- FASE 2 · Desprendibles de pago (data-driven, generados por el sistema)
-- Reemplaza la tabla `desprendibles` de la Fase 1 (que estaba vacía).
-- Ejecuta en: Supabase → SQL Editor → New query → Run
-- ─────────────────────────────────────────────────────────────────────────────

drop table if exists desprendibles cascade;

create table desprendibles (
  id              uuid primary key default gen_random_uuid(),
  empleado_id     uuid not null references empleados(id) on delete cascade,
  anio            int not null,
  mes             int not null check (mes between 1 and 12),
  fecha_nomina    date,                         -- "NOMINA A: 4/30/2026"
  cargo           text,
  dias            numeric not null default 30,
  salario_basico  numeric not null default 0,
  fondo_pension   text,                         -- Porvenir, Colpensiones…
  eps_salud       text,                         -- Salud Total, Sanitas…
  banco           text,
  cuenta          text,
  -- Líneas variables. Cada ítem: { concepto, valor, codigo?, cantidad? }
  devengos        jsonb not null default '[]'::jsonb,   -- auxilios/bonificaciones (SIN el básico)
  deducciones     jsonb not null default '[]'::jsonb,   -- salud, pensión, otros
  -- Bases / retención
  base_salarial   numeric,
  base_pension    numeric,
  base_retencion  numeric,
  porc_retencion  numeric default 0,
  dias_vac_pend   numeric default 0,
  observaciones   text,
  publicado       boolean not null default false,       -- visible para el empleado
  creado_en       timestamptz not null default now(),
  actualizado_en  timestamptz not null default now(),
  unique (empleado_id, anio, mes)
);

create index idx_desprendibles_empleado on desprendibles(empleado_id);

alter table desprendibles enable row level security; -- sin policies públicas: acceso solo por el servidor

drop trigger if exists trg_desprendibles_updated on desprendibles;
create trigger trg_desprendibles_updated before update on desprendibles
  for each row execute function set_actualizado_en();
