-- ─────────────────────────────────────────────────────────────────────────────
-- FASE 33 · Fecha de nacimiento (para el calendario de cumpleaños del panel CEO)
-- Ejecuta en: Supabase → SQL Editor → New query → Run
-- ─────────────────────────────────────────────────────────────────────────────

alter table empleados add column if not exists fecha_nacimiento date;

notify pgrst, 'reload schema';
