-- ─────────────────────────────────────────────────────────────────────────────
-- FASE 13 · Contabilidad ampliada
--   • Empresas (contrapartes) con NIT.
--   • Métodos de pago / plataformas (catálogo extensible: banco, Payoneer, Global66…).
--   • Traslados entre cuentas con tasa del día y costo de plataforma (USD↔COP).
-- Requiere schema-fase11-contabilidad.sql.
-- Ejecuta en: Supabase → SQL Editor → New query → Run
-- ─────────────────────────────────────────────────────────────────────────────

-- 1) Empresas / contrapartes (para movimientos y cuentas de cobro).
create table if not exists empresas (
  id             uuid primary key default gen_random_uuid(),
  nombre         text not null,
  nit            text,
  contacto       text,
  notas          text,
  creado_en      timestamptz not null default now(),
  actualizado_en timestamptz not null default now()
);

-- 2) Métodos de pago / plataformas (catálogo que el CEO puede ampliar).
create table if not exists metodos_pago (
  id        uuid primary key default gen_random_uuid(),
  nombre    text unique not null,
  creado_en timestamptz not null default now()
);
insert into metodos_pago (nombre) values
  ('Banco'), ('Payoneer'), ('Global66'), ('Wise'), ('Efectivo'), ('Nequi'), ('Daviplata')
on conflict (nombre) do nothing;

-- 3) Plataforma/método de cada cuenta.
alter table cuentas add column if not exists plataforma text;

-- 4) Traslados con tasa/costo + destino en otra moneda; contraparte empresa.
alter table movimientos add column if not exists tasa          numeric;             -- tasa de cambio origen→destino
alter table movimientos add column if not exists costo         numeric not null default 0;  -- costo/comisión de la plataforma
alter table movimientos add column if not exists valor_destino numeric;             -- valor que llega al destino (moneda destino)
alter table movimientos add column if not exists empresa_id    uuid references empresas(id) on delete set null;

-- ── Seguridad (RLS) ──────────────────────────────────────────────────────────
alter table empresas     enable row level security;
alter table metodos_pago enable row level security;

drop trigger if exists trg_empresas_updated on empresas;
create trigger trg_empresas_updated before update on empresas
  for each row execute function set_actualizado_en();

notify pgrst, 'reload schema';
