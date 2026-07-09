-- ─────────────────────────────────────────────────────────────────────────────
-- FASE 39 · Liquidación: causa de terminación
--   Renuncia, despido con/sin justa causa, mutuo acuerdo, fin de plazo/obra.
--   Solo el despido SIN justa causa genera indemnización.
-- Requiere la tabla liquidaciones.
-- Ejecuta en: Supabase → SQL Editor → New query → Run
-- ─────────────────────────────────────────────────────────────────────────────

alter table liquidaciones add column if not exists causa_terminacion text
  check (causa_terminacion in ('renuncia','despido_sin_justa','despido_justa','mutuo_acuerdo','fin_plazo_obra'));

-- Migrar lo existente desde tipo_terminacion.
update liquidaciones set causa_terminacion =
  case when tipo_terminacion = 'sin_justa_causa' then 'despido_sin_justa' else 'renuncia' end
  where causa_terminacion is null;

notify pgrst, 'reload schema';
