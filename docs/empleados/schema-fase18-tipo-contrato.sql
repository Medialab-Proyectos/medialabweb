-- ─────────────────────────────────────────────────────────────────────────────
-- FASE 18 · Tipo de contrato laboral en el empleado
--   • Para vinculación laboral: indefinido / término fijo / obra o labor.
-- Requiere schema.sql. Ejecuta en: Supabase → SQL Editor → New query → Run
-- ─────────────────────────────────────────────────────────────────────────────

alter table empleados add column if not exists tipo_contrato text;  -- indefinido / fijo / obra (solo laboral)

notify pgrst, 'reload schema';
