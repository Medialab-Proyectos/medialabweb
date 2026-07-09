-- ─────────────────────────────────────────────────────────────────────────────
-- FASE 30 · Empresa: dirección/ciudad + contrato «requiere cuenta de cobro»
--   • Empresas: dirección y ciudad (para la cuenta de cobro).
--   • Contrato con empresa: bandera «requiere cuenta de cobro». Las empresas que
--     pagan por un contrato mensual ya firmado se marcan en 'false' y no aparecen
--     al emitir cuentas de cobro.
-- Requiere schema-fase22-contratos-empresa.sql y schema-fase24-...sql.
-- Ejecuta en: Supabase → SQL Editor → New query → Run
-- ─────────────────────────────────────────────────────────────────────────────

alter table empresas add column if not exists direccion text;
alter table empresas add column if not exists ciudad text;

alter table contratos_empresa add column if not exists requiere_cuenta_cobro boolean not null default true;

notify pgrst, 'reload schema';
