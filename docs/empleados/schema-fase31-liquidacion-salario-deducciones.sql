-- ─────────────────────────────────────────────────────────────────────────────
-- FASE 31 · Liquidación: salario del periodo + deducciones de ley
--   Alinea la liquidación con los ejemplos reales del contador:
--   • salario_dias / salario: salario del último periodo no pagado (devengado).
--   • salud_empleado (4%) + pension_empleado (4%) + retencion_fuente: deducciones
--     que se restan del neto a pagar.
-- Requiere schema con la tabla liquidaciones (fase de liquidaciones).
-- Ejecuta en: Supabase → SQL Editor → New query → Run
-- ─────────────────────────────────────────────────────────────────────────────

alter table liquidaciones add column if not exists salario_dias      numeric not null default 0;
alter table liquidaciones add column if not exists salario           numeric not null default 0;
alter table liquidaciones add column if not exists salud_empleado    numeric not null default 0;
alter table liquidaciones add column if not exists pension_empleado  numeric not null default 0;
alter table liquidaciones add column if not exists retencion_fuente  numeric not null default 0;

notify pgrst, 'reload schema';
