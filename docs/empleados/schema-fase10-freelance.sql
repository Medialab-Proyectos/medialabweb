-- ─────────────────────────────────────────────────────────────────────────────
-- FASE 10 · Freelance (vinculación NO laboral)
--   • Personas que trabajan como freelance: para pagarles suben una FACTURA
--     firmada dentro de la plataforma cada mes. Costo en COP o USD, y transferencia
--     a la cuenta bancaria que ellos definen.
--   • Se modela como tipo_vinculacion en empleados (NO un rol nuevo): los roles
--     ceo/lider/empleado siguen siendo jerarquía; la vinculación es la forma de pago.
-- Requiere schema.sql. Ejecuta en: Supabase → SQL Editor → New query → Run
-- ─────────────────────────────────────────────────────────────────────────────

-- 1) Tipo de vinculación (empleado laboral vs freelance).
alter table empleados add column if not exists tipo_vinculacion text not null default 'empleado'
  check (tipo_vinculacion in ('empleado','freelance'));

-- 2) Perfil de pago del freelance (definido al contratar; editable por él o el CEO).
create table if not exists freelance_perfil (
  empleado_id    uuid primary key references empleados(id) on delete cascade,
  moneda         text not null default 'COP' check (moneda in ('COP','USD')),
  banco          text,
  cuenta         text,
  tipo_cuenta    text,                              -- ahorros / corriente / internacional…
  titular        text,
  documento      text,                              -- cédula/ID del titular
  notas          text,
  actualizado_en timestamptz not null default now()
);

-- 3) Facturas mensuales del freelance (firmadas dentro de la plataforma).
create table if not exists freelance_facturas (
  id             uuid primary key default gen_random_uuid(),
  empleado_id    uuid not null references empleados(id) on delete cascade,
  anio           int not null,
  mes            int not null check (mes between 1 and 12),
  numero         text,                              -- número de factura del freelance (opcional)
  concepto       text,
  moneda         text not null default 'COP' check (moneda in ('COP','USD')),
  valor          numeric not null default 0,
  -- Destino del pago (snapshot desde el perfil; editable por factura)
  banco          text,
  cuenta         text,
  tipo_cuenta    text,
  titular        text,
  archivo_path   text,                              -- factura adjunta (bucket privado 'facturas')
  -- Firma dentro de la plataforma (aceptación electrónica)
  firmado        boolean not null default false,
  firmante       text,                              -- nombre con el que firmó
  firmado_en     timestamptz,
  estado         text not null default 'enviada' check (estado in ('enviada','pagada','rechazada')),
  pagado_en      timestamptz,
  observaciones  text,                              -- nota del CEO (p.ej. motivo de rechazo)
  creado_en      timestamptz not null default now(),
  actualizado_en timestamptz not null default now()
);
create index if not exists idx_freelance_facturas_empleado on freelance_facturas(empleado_id);

-- ── Seguridad (RLS) ──────────────────────────────────────────────────────────
alter table freelance_perfil   enable row level security;
alter table freelance_facturas enable row level security;

drop trigger if exists trg_freelance_perfil_updated on freelance_perfil;
create trigger trg_freelance_perfil_updated before update on freelance_perfil
  for each row execute function set_actualizado_en();
drop trigger if exists trg_freelance_facturas_updated on freelance_facturas;
create trigger trg_freelance_facturas_updated before update on freelance_facturas
  for each row execute function set_actualizado_en();

-- ── Storage ──────────────────────────────────────────────────────────────────
-- Crea un bucket PRIVADO llamado 'facturas' en:  Supabase → Storage → New bucket
--   • Nombre: facturas   • Public: NO (privado)
-- Los adjuntos se suben/descargan siempre por el servidor con la service-role key.

notify pgrst, 'reload schema';
