-- ─────────────────────────────────────────────────────────────────────────────
-- FASE 20 · Fondo de pensiones del empleado (dato personal)
-- Requiere schema.sql. Ejecuta en: Supabase → SQL Editor → New query → Run
-- ─────────────────────────────────────────────────────────────────────────────

alter table empleados add column if not exists fondo_pension text;

notify pgrst, 'reload schema';
