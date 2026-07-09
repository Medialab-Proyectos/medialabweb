-- ─────────────────────────────────────────────────────────────────────────────
-- FASE 36 · Otrosí: qué conceptos se ajustan
--   Un otrosí solo modifica ciertos conceptos (salario, cargo, etc.). Se guarda
--   la lista de lo que cambia para que el documento muestre solo eso.
-- Requiere schema-fase3-contratos.sql.
-- Ejecuta en: Supabase → SQL Editor → New query → Run
-- ─────────────────────────────────────────────────────────────────────────────

alter table contratos add column if not exists ajustes text[];

notify pgrst, 'reload schema';
