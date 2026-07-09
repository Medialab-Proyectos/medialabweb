-- ─────────────────────────────────────────────────────────────────────────────
-- FASE 35 · Fecha de fundación de la empresa (para la historia laboral)
-- Ejecuta en: Supabase → SQL Editor → New query → Run
-- ─────────────────────────────────────────────────────────────────────────────

alter table empresa_config add column if not exists fecha_fundacion date;

notify pgrst, 'reload schema';
