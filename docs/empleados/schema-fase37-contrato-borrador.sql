-- ─────────────────────────────────────────────────────────────────────────────
-- FASE 37 · Contrato/otrosí: flujo borrador → previsualizar → enviar
--   enviado_en: cuándo se envió al empleado para firma. NULL = borrador (el CEO
--   lo previsualiza y ajusta; el empleado aún no lo ve). Con fecha = enviado,
--   esperando firma.
-- Requiere schema-fase27-contrato-firma.sql.
-- Ejecuta en: Supabase → SQL Editor → New query → Run
-- ─────────────────────────────────────────────────────────────────────────────

alter table contratos add column if not exists enviado_en timestamptz;

-- Los contratos que YA estaban pendientes de firma se consideran ya enviados
-- (no dejar a nadie sin poder firmar tras la migración).
update contratos set enviado_en = coalesce(enviado_en, creado_en)
  where estado = 'pendiente_firma';

notify pgrst, 'reload schema';
