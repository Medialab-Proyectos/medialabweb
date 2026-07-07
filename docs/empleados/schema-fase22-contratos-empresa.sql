-- ─────────────────────────────────────────────────────────────────────────────
-- FASE 22 · Contratos con empresa (cliente) + pago del freelance
--   • Empresa = solo nombre, NIT y correo. Las condiciones de facturación (por
--     hora / por mes + tarifa) pasan a un "contrato con la empresa".
--   • Una cuenta de cobro se emite SOBRE un contrato (que trae empresa + tarifa).
--   • El pago acordado del freelance (modo + tarifa) se define en su ficha (CEO)
--     y lo ve el freelance en su portal.
-- Requiere schema-fase13-contabilidad-ampliada.sql y schema-fase15-cuentas-cobro.sql.
-- Ejecuta en: Supabase → SQL Editor → New query → Run
-- ─────────────────────────────────────────────────────────────────────────────

-- 1) Correo de la empresa (los campos contacto/notas/modo/tarifa/moneda quedan sin uso).
alter table empresas add column if not exists correo text;

-- 2) Contratos con la empresa (cliente): definen cómo se le factura.
create table if not exists contratos_empresa (
  id             uuid primary key default gen_random_uuid(),
  empresa_id     uuid not null references empresas(id) on delete cascade,
  nombre         text,                                   -- descripción/identificador del contrato
  modo           text not null default 'por_mes' check (modo in ('por_hora','por_mes')),
  tarifa         numeric not null default 0,             -- valor hora / valor mes
  moneda         text not null default 'COP' check (moneda in ('COP','USD')),
  activo         boolean not null default true,
  notas          text,
  creado_en      timestamptz not null default now(),
  actualizado_en timestamptz not null default now()
);
create index if not exists idx_contratos_empresa_empresa on contratos_empresa(empresa_id);

-- 3) La cuenta de cobro se emite sobre un contrato con la empresa.
alter table cuentas_cobro add column if not exists contrato_empresa_id uuid references contratos_empresa(id) on delete set null;

-- 4) Pago acordado del freelance (lo define el CEO en la ficha; lo ve el freelance).
alter table empleados add column if not exists freelance_modo   text check (freelance_modo in ('por_hora','por_mes','fijo'));
alter table empleados add column if not exists freelance_tarifa numeric;
alter table empleados add column if not exists freelance_moneda text check (freelance_moneda in ('COP','USD'));

-- ── Seguridad (RLS) ──────────────────────────────────────────────────────────
alter table contratos_empresa enable row level security;

drop trigger if exists trg_contratos_empresa_updated on contratos_empresa;
create trigger trg_contratos_empresa_updated before update on contratos_empresa
  for each row execute function set_actualizado_en();

notify pgrst, 'reload schema';
