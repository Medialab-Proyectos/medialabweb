-- ─────────────────────────────────────────────────────────────────────────────
-- FASE 6 · Datos base (caja de compensación por empleado)
-- El contrato de "práctica profesional (solo ARL)" NO requiere cambios de esquema
-- (es un tipo de contrato más en el catálogo).
-- Ejecuta en: Supabase → SQL Editor → New query → Run
-- ─────────────────────────────────────────────────────────────────────────────

alter table empleados add column if not exists caja_compensacion text;

notify pgrst, 'reload schema';
