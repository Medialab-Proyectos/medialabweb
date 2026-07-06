-- ─────────────────────────────────────────────────────────────────────────────
-- FASE 19 · Datos personales del empleado + configuración de empresa
--   • En el empleado van SOLO datos personales: teléfono, dirección, EPS (salud),
--     fondo de cesantías. El cargo/modalidad/salario viven en el CONTRATO.
--   • La caja de compensación es una para toda la empresa → empresa_config.
-- Requiere schema.sql. Ejecuta en: Supabase → SQL Editor → New query → Run
-- ─────────────────────────────────────────────────────────────────────────────

-- 1) Datos personales del empleado.
alter table empleados add column if not exists telefono        text;
alter table empleados add column if not exists direccion       text;
alter table empleados add column if not exists eps             text;   -- entidad de salud
alter table empleados add column if not exists fondo_cesantias text;

-- 2) Configuración de empresa (una sola fila): caja de compensación común.
create table if not exists empresa_config (
  id                int primary key default 1 check (id = 1),
  caja_compensacion text,
  actualizado_en    timestamptz not null default now()
);
insert into empresa_config (id) values (1) on conflict (id) do nothing;

alter table empresa_config enable row level security;

drop trigger if exists trg_empresa_config_updated on empresa_config;
create trigger trg_empresa_config_updated before update on empresa_config
  for each row execute function set_actualizado_en();

notify pgrst, 'reload schema';
