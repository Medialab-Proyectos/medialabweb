-- ─────────────────────────────────────────────────────────────────────────────
-- FASE 16 · Contrato / convenio adjunto + fecha probable de finalización
--   • Documento del contrato o convenio de cada empleado (adjunto, bucket 'contratos').
--   • Fecha probable de finalización (modificable) — útil en obra/labor o convenios.
-- Requiere schema.sql. Ejecuta en: Supabase → SQL Editor → New query → Run
-- ─────────────────────────────────────────────────────────────────────────────

alter table empleados add column if not exists convenio_path      text;   -- contrato/convenio adjunto
alter table empleados add column if not exists fecha_fin_probable date;    -- fin estimado (modificable)

notify pgrst, 'reload schema';
