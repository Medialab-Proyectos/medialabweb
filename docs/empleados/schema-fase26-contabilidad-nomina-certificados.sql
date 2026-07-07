-- ─────────────────────────────────────────────────────────────────────────────
-- FASE 26 · Contabilidad ampliada + nómina + certificados
--   • Movimientos: vínculo a empleado (pagos de nómina) + IVA (incluido/exento).
--   • Cuentas de cobro: IVA + fee (costo bancario / de transferencia).
--   • Gastos recurrentes: catálogo (Google, dominio, ChatGPT, Claude, Figma,
--     contador…) con "registrar pago del mes".
--   • Certificado de Ingresos y Retenciones (DIAN): el CEO sube un PDF por
--     empleado laboral y año, y lo publica para que el empleado lo descargue.
-- Requiere schema-fase11-contabilidad.sql, schema-fase13-contabilidad-ampliada.sql
-- y schema-fase15-cuentas-cobro.sql.
-- Ejecuta en: Supabase → SQL Editor → New query → Run
-- ─────────────────────────────────────────────────────────────────────────────

-- 1) Movimientos: pago vinculado a un empleado (nómina) + IVA
alter table movimientos add column if not exists empleado_id uuid;
alter table movimientos add column if not exists iva_tipo text
  check (iva_tipo is null or iva_tipo in ('na', 'incluido', 'exento'));
alter table movimientos add column if not exists iva_valor numeric;

-- 2) Cuentas de cobro: IVA + fee (costo del banco / transferencia)
alter table cuentas_cobro add column if not exists iva_tipo text
  check (iva_tipo is null or iva_tipo in ('na', 'incluido', 'exento'));
alter table cuentas_cobro add column if not exists iva_valor numeric;
alter table cuentas_cobro add column if not exists fee numeric;

-- 3) Gastos recurrentes (catálogo)
create table if not exists gastos_recurrentes (
  id         uuid primary key default gen_random_uuid(),
  nombre     text not null,
  categoria  text,
  proveedor  text,
  moneda     text not null default 'COP',
  valor      numeric not null default 0,
  cuenta_id  uuid,
  activo     boolean not null default true,
  orden      integer not null default 0,
  creado_en  timestamptz not null default now()
);

-- 4) Certificado de Ingresos y Retenciones (DIAN), subido por el CEO
create table if not exists certificados_ir (
  id             uuid primary key default gen_random_uuid(),
  empleado_id    uuid not null,
  anio           integer not null,
  archivo_path   text,
  publicado      boolean not null default false,
  creado_en      timestamptz not null default now(),
  actualizado_en timestamptz not null default now(),
  unique (empleado_id, anio)
);

notify pgrst, 'reload schema';
