-- ─────────────────────────────────────────────────────────────────────────────
-- FASE 9 · Beneficios
--   (a) Permisos de MEDIA JORNADA (cumpleaños / eventos) como tipos de ausencia
--       → van por el mismo flujo de aprobación del líder. NO descuentan vacaciones
--         y NO son permisos obligatorios de ley (política interna de la empresa).
--   (b) Medicina prepagada: el empleado la activa desde el portal (meta: MedPlus).
-- Requiere schema.sql y schema-fase4-ausencias.sql.
-- Ejecuta en: Supabase → SQL Editor → New query → Run
-- ─────────────────────────────────────────────────────────────────────────────

-- 1) Nuevos tipos de ausencia: media jornada por cumpleaños y por evento especial.
alter table solicitudes_ausencia drop constraint if exists solicitudes_ausencia_tipo_check;
alter table solicitudes_ausencia add constraint solicitudes_ausencia_tipo_check
  check (tipo in (
    'vacaciones','adelanto_vacaciones','permiso_no_remunerado','licencia_maternidad',
    'licencia_paternidad','licencia_luto','dia_familia','dia_votacion',
    'media_jornada_cumpleanos','media_jornada_evento','otra'));

-- 2) Activaciones de beneficios por empleado (por ahora: medicina prepagada).
create table if not exists beneficios (
  id             uuid primary key default gen_random_uuid(),
  empleado_id    uuid not null references empleados(id) on delete cascade,
  tipo           text not null check (tipo in ('medicina_prepagada')),
  estado         text not null default 'solicitado' check (estado in ('solicitado','activo','inactivo')),
  proveedor      text,                              -- p.ej. MedPlus
  datos          jsonb not null default '{}'::jsonb, -- plan, beneficiarios, etc.
  observaciones  text,
  creado_en      timestamptz not null default now(),
  actualizado_en timestamptz not null default now(),
  unique (empleado_id, tipo)
);
create index if not exists idx_beneficios_empleado on beneficios(empleado_id);

-- ── Seguridad (RLS) ──────────────────────────────────────────────────────────
alter table beneficios enable row level security;

drop trigger if exists trg_beneficios_updated on beneficios;
create trigger trg_beneficios_updated before update on beneficios
  for each row execute function set_actualizado_en();

notify pgrst, 'reload schema';
