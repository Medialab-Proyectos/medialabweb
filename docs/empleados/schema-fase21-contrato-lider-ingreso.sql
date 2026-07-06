-- ─────────────────────────────────────────────────────────────────────────────
-- FASE 21 · Líder (a quién reporta) y fecha de ingreso en el CONTRATO
--   • La línea de reporte puede cambiar en un otrosí; la fecha de ingreso es la
--     del contrato inicial. El sistema las sincroniza a la ficha del empleado
--     (empleados.lider_id / empleados.fecha_ingreso) para aprobaciones, certificado,
--     vacaciones y liquidación.
-- Requiere schema-fase3-contratos.sql. Ejecuta en: Supabase → SQL Editor → Run
-- ─────────────────────────────────────────────────────────────────────────────

alter table contratos add column if not exists lider_id      uuid references empleados(id) on delete set null;
alter table contratos add column if not exists fecha_ingreso date;

notify pgrst, 'reload schema';
