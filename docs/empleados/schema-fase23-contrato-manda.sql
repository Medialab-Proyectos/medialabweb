-- ─────────────────────────────────────────────────────────────────────────────
-- FASE 23 · El contrato manda
--   El contrato pasa a ser la fuente de verdad de: rol, vinculación (laboral /
--   freelance / prestación), líder, fecha de ingreso, cargo y condiciones de pago
--   (salario para laboral, o pago acordado para freelance). Estos valores se
--   sincronizan (denormalizados) hacia la ficha del empleado — así el login
--   (empleados.rol) y los filtros existentes siguen funcionando.
--
--   • Sin contrato → el empleado es "empleado" básico (rol por defecto).
--   • El rol/vinculación/pago ya NO se editan en la ficha, solo en el contrato.
-- Requiere schema-fase3-contratos.sql y schema-fase22-contratos-empresa.sql.
-- Ejecuta en: Supabase → SQL Editor → New query → Run
-- ─────────────────────────────────────────────────────────────────────────────

alter table contratos add column if not exists rol text
  check (rol in ('ceo','lider','empleado'));
alter table contratos add column if not exists tipo_vinculacion text
  check (tipo_vinculacion in ('empleado','freelance','prestacion_servicios'));
alter table contratos add column if not exists freelance_modo text
  check (freelance_modo in ('por_hora','por_mes','fijo'));
alter table contratos add column if not exists freelance_tarifa numeric;
alter table contratos add column if not exists freelance_moneda text
  check (freelance_moneda in ('COP','USD'));

notify pgrst, 'reload schema';
