-- ─────────────────────────────────────────────────────────────────────────────
-- Portal de Empleados — MediaLab Ingeniería · Esquema Supabase (Postgres)
-- Ejecuta este archivo completo en:  Supabase → SQL Editor → New query → Run
-- ─────────────────────────────────────────────────────────────────────────────

create extension if not exists "pgcrypto";

-- ── Empleados + jerarquía ────────────────────────────────────────────────────
create table if not exists empleados (
  id                    uuid primary key default gen_random_uuid(),
  cedula                text unique not null,
  nombre                text not null,
  email                 text not null,
  password_hash         text not null,
  must_change_password  boolean not null default true,
  rol                   text not null default 'empleado' check (rol in ('ceo','lider','empleado')),
  lider_id              uuid references empleados(id) on delete set null,
  cargo                 text,
  fecha_ingreso         date,
  fecha_egreso          date,
  particularidades      text,              -- otrosíes, cambios de cargo, notas
  estado                text not null default 'activo' check (estado in ('activo','terminado')),
  creado_en             timestamptz not null default now(),
  actualizado_en        timestamptz not null default now()
);
create index if not exists idx_empleados_lider  on empleados(lider_id);
create index if not exists idx_empleados_cedula on empleados(cedula);

-- ── Desprendibles / vouchers de pago (Fase 2) ────────────────────────────────
create table if not exists desprendibles (
  id            uuid primary key default gen_random_uuid(),
  empleado_id   uuid not null references empleados(id) on delete cascade,
  anio          int not null,
  mes           int not null check (mes between 1 and 12),
  archivo_path  text not null,             -- ruta en Supabase Storage (bucket privado 'desprendibles')
  subido_en     timestamptz not null default now(),
  unique (empleado_id, anio, mes)
);
create index if not exists idx_desprendibles_empleado on desprendibles(empleado_id);

-- ── Evaluaciones de desempeño (Fase 4) ───────────────────────────────────────
create table if not exists evaluaciones (
  id             uuid primary key default gen_random_uuid(),
  evaluado_id    uuid not null references empleados(id) on delete cascade,
  evaluador_id   uuid not null references empleados(id) on delete cascade,
  periodo        text not null,            -- ej. '2026-Q1'
  estado         text not null default 'abierta' check (estado in ('abierta','completada')),
  puntajes       jsonb,                    -- criterios y puntajes de la plantilla UX/TI
  puntos_mejora  text,
  puntos_criticos text,
  comentarios    text,
  creado_en      timestamptz not null default now(),
  completado_en  timestamptz,
  unique (evaluado_id, evaluador_id, periodo)
);

-- ── Seguridad (RLS) ──────────────────────────────────────────────────────────
-- Activamos RLS y NO creamos policies públicas: con la anon key nadie puede
-- leer/escribir. Todo el acceso pasa por el servidor de Next con la SERVICE ROLE
-- key (que ignora RLS) y allí se aplican las reglas de rol/jerarquía.
alter table empleados     enable row level security;
alter table desprendibles enable row level security;
alter table evaluaciones  enable row level security;

-- Mantener actualizado_en al modificar un empleado
create or replace function set_actualizado_en() returns trigger as $$
begin new.actualizado_en = now(); return new; end;
$$ language plpgsql;
drop trigger if exists trg_empleados_updated on empleados;
create trigger trg_empleados_updated before update on empleados
  for each row execute function set_actualizado_en();
