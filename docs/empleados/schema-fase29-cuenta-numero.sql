-- ─────────────────────────────────────────────────────────────────────────────
-- FASE 29 · Número de cuenta bancaria
--   Cada cuenta de contabilidad puede guardar su número de cuenta (además del
--   banco y el método de pago), para verlo en el panel y en las cuentas de cobro.
-- Ejecuta en: Supabase → SQL Editor → New query → Run
-- ─────────────────────────────────────────────────────────────────────────────

alter table cuentas add column if not exists numero_cuenta text;

notify pgrst, 'reload schema';
