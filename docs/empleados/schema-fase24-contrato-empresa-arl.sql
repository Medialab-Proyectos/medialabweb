-- ─────────────────────────────────────────────────────────────────────────────
-- FASE 24 · Ajustes: empresa (país/teléfono), ARL, contrato ampliado
--   • Empresa: país y teléfono.
--   • Config de empresa: ARL (riesgos laborales), visible en el contrato.
--   • Contrato: descripción, pago por proyecto (dividido en meses o pago único),
--     fecha probable de finalización y fecha de finalización real.
-- Requiere schema-fase23-contrato-manda.sql.
-- Ejecuta en: Supabase → SQL Editor → New query → Run
-- ─────────────────────────────────────────────────────────────────────────────

-- 1) Empresa: país y teléfono
alter table empresas add column if not exists pais text;
alter table empresas add column if not exists telefono text;

-- 2) Config de empresa: ARL
alter table empresa_config add column if not exists arl text;

-- 3) Contrato ampliado
alter table contratos add column if not exists descripcion text;
alter table contratos add column if not exists freelance_meses integer;   -- por proyecto: nº de meses (1 = pago único)
alter table contratos add column if not exists fecha_fin_probable date;
alter table contratos add column if not exists fecha_fin date;            -- finalización real del contrato

-- Ampliar los modos de pago del freelance para incluir 'por_proyecto'
alter table contratos drop constraint if exists contratos_freelance_modo_check;
alter table contratos add constraint contratos_freelance_modo_check
  check (freelance_modo is null or freelance_modo in ('por_hora','por_mes','fijo','por_proyecto'));

alter table empleados drop constraint if exists empleados_freelance_modo_check;
alter table empleados add constraint empleados_freelance_modo_check
  check (freelance_modo is null or freelance_modo in ('por_hora','por_mes','fijo','por_proyecto'));
alter table empleados add column if not exists freelance_meses integer;

notify pgrst, 'reload schema';
