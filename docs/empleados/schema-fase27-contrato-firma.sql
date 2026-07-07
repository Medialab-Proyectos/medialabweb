-- ─────────────────────────────────────────────────────────────────────────────
-- FASE 27 · Contrato: estado de firma (generar → firmar → activar)
--   La plataforma puede GENERAR el contrato/otrosí; queda 'pendiente_firma' y NO
--   se hace vigente hasta que se sube el documento firmado (por el empleado, o por
--   el CEO para mantener consistencia). Se pueden registrar otrosíes históricos.
-- Requiere schema-fase3-contratos.sql.
-- Ejecuta en: Supabase → SQL Editor → New query → Run
-- ─────────────────────────────────────────────────────────────────────────────

alter table contratos add column if not exists estado text
  check (estado in ('pendiente_firma', 'firmado'));
alter table contratos add column if not exists firmado_por text
  check (firmado_por is null or firmado_por in ('empleado', 'ceo'));
alter table contratos add column if not exists firmado_en timestamptz;

-- Los contratos YA registrados se consideran firmados (no bloquear a nadie que ya
-- tenga contrato). Solo aplica a los existentes al correr la migración.
update contratos set estado = 'firmado' where estado is null;

-- Los contratos NUEVOS nacen 'pendiente_firma' y NO se hacen vigentes hasta subir el
-- documento firmado. Se fija como default para que un contrato nunca aparezca como
-- "firmado" solo por crearse (la app también lo envía explícito).
alter table contratos alter column estado set default 'pendiente_firma';

notify pgrst, 'reload schema';
