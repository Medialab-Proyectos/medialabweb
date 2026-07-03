-- ─────────────────────────────────────────────────────────────────────────────
-- FASE 7 · Estado "suspendido" + tipo de ausencia "adelanto_vacaciones"
-- Ejecuta en: Supabase → SQL Editor → New query → Run
-- ─────────────────────────────────────────────────────────────────────────────

-- 1) Permitir el estado "suspendido" en empleados (bloqueo temporal de acceso).
alter table empleados drop constraint if exists empleados_estado_check;
alter table empleados add constraint empleados_estado_check
  check (estado in ('activo','terminado','suspendido'));

-- 2) Permitir el tipo "adelanto_vacaciones" (máx. 2 días, se controla en la app).
alter table solicitudes_ausencia drop constraint if exists solicitudes_ausencia_tipo_check;
alter table solicitudes_ausencia add constraint solicitudes_ausencia_tipo_check
  check (tipo in (
    'vacaciones','adelanto_vacaciones','permiso_no_remunerado','licencia_maternidad',
    'licencia_paternidad','licencia_luto','dia_familia','dia_votacion','otra'));

notify pgrst, 'reload schema';
