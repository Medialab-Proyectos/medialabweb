-- ─────────────────────────────────────────────────────────────────────────────
-- FASE 38 · Certificados de afiliación (EPS, cesantías, pensión)
--   Se adjuntan al empleado (bucket privado 'contratos').
-- Ejecuta en: Supabase → SQL Editor → New query → Run
-- ─────────────────────────────────────────────────────────────────────────────

alter table empleados add column if not exists cert_eps_path       text;
alter table empleados add column if not exists cert_cesantias_path text;
alter table empleados add column if not exists cert_pension_path   text;

notify pgrst, 'reload schema';
