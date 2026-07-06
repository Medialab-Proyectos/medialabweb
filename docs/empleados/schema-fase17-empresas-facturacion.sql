-- ─────────────────────────────────────────────────────────────────────────────
-- FASE 17 · Condiciones de facturación por empresa
--   • Cada empresa/cliente puede tener definido cómo se le factura: por hora o por
--     mes, con su tarifa y moneda. Las cuentas de cobro heredan estos valores.
-- Requiere schema-fase13-contabilidad-ampliada.sql (tabla empresas).
-- Ejecuta en: Supabase → SQL Editor → New query → Run
-- ─────────────────────────────────────────────────────────────────────────────

alter table empresas add column if not exists modo   text
  check (modo in ('por_hora','por_mes'));               -- cómo se factura
alter table empresas add column if not exists tarifa numeric not null default 0;  -- valor hora / valor mes
alter table empresas add column if not exists moneda text not null default 'COP'
  check (moneda in ('COP','USD'));

notify pgrst, 'reload schema';
