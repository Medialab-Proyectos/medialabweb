-- ─────────────────────────────────────────────────────────────────────────────
-- FASE 5 · Cesantías (anual, como primas/salarios)
-- Ejecuta en: Supabase → SQL Editor → New query → Run
-- ─────────────────────────────────────────────────────────────────────────────

create table if not exists cesantias (
  id             uuid primary key default gen_random_uuid(),
  empleado_id    uuid not null references empleados(id) on delete cascade,
  anio           int not null,
  dias           numeric not null default 360,   -- días trabajados en el año (máx 360)
  base           numeric not null default 0,      -- salario básico + auxilio de transporte
  cesantias      numeric not null default 0,      -- valor liquidado (editable)
  intereses      numeric not null default 0,      -- intereses 12% anual (editable)
  fondo          text,                            -- fondo de cesantías (Porvenir, FNA…)
  observaciones  text,
  publicado      boolean not null default false,  -- visible para el empleado
  creado_en      timestamptz not null default now(),
  actualizado_en timestamptz not null default now(),
  unique (empleado_id, anio)
);
create index if not exists idx_cesantias_empleado on cesantias(empleado_id);

alter table cesantias enable row level security;

drop trigger if exists trg_cesantias_updated on cesantias;
create trigger trg_cesantias_updated before update on cesantias
  for each row execute function set_actualizado_en();

notify pgrst, 'reload schema';
