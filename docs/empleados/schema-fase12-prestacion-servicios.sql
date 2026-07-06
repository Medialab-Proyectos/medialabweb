-- ─────────────────────────────────────────────────────────────────────────────
-- FASE 12 · Prestación de servicios + soporte de prestaciones sociales
--   • Nuevo tipo de vinculación 'prestacion_servicios': igual que freelance, pero
--     al facturar debe subir el soporte de pago de seguridad social (prestaciones).
--   • (La reorganización del panel del CEO en 3 módulos NO requiere SQL.)
-- Requiere schema-fase10-freelance.sql.
-- Ejecuta en: Supabase → SQL Editor → New query → Run
-- ─────────────────────────────────────────────────────────────────────────────

-- 1) Permitir la vinculación 'prestacion_servicios'.
alter table empleados drop constraint if exists empleados_tipo_vinculacion_check;
alter table empleados add constraint empleados_tipo_vinculacion_check
  check (tipo_vinculacion in ('empleado','freelance','prestacion_servicios'));

-- 2) Soporte de pago de prestaciones sociales por factura (bucket privado 'facturas').
alter table freelance_facturas add column if not exists soporte_path text;

notify pgrst, 'reload schema';
