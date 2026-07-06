-- ─────────────────────────────────────────────────────────────────────────────
-- FASE 11 · Contabilidad (libro de caja simple) — SOLO CEO
--   • Cuentas bancarias con saldo inicial (punto de partida).
--   • Movimientos: ingresos, egresos y traslados entre cuentas, con fecha de entrada
--     y estado realizado/pendiente (lo que falta por cobrar, pagar o transferir).
--   • Pensado para un cierre mensual por el CEO.
-- Requiere schema.sql (empleados + set_actualizado_en()).
-- Ejecuta en: Supabase → SQL Editor → New query → Run
-- ─────────────────────────────────────────────────────────────────────────────

-- 1) Cuentas (bancos / cajas).
create table if not exists cuentas (
  id             uuid primary key default gen_random_uuid(),
  nombre         text not null,
  banco          text,
  moneda         text not null default 'COP' check (moneda in ('COP','USD')),
  saldo_inicial  numeric not null default 0,          -- punto de partida
  activa         boolean not null default true,
  orden          int not null default 0,
  creado_en      timestamptz not null default now(),
  actualizado_en timestamptz not null default now()
);

-- 2) Movimientos (ingreso / egreso / traslado).
create table if not exists movimientos (
  id                uuid primary key default gen_random_uuid(),
  cuenta_id         uuid not null references cuentas(id) on delete cascade,
  cuenta_destino_id uuid references cuentas(id) on delete set null,  -- solo traslados
  fecha             date not null,                                   -- fecha de entrada/registro
  tipo              text not null check (tipo in ('ingreso','egreso','traslado')),
  categoria         text,          -- salario, factura_freelance, servicio, impuesto, arriendo, venta, otro
  concepto          text,
  contraparte       text,          -- de quién entra / a quién se paga
  valor             numeric not null default 0,
  estado            text not null default 'realizado' check (estado in ('pendiente','realizado')),
  referencia        text,          -- N.º de transferencia / factura
  creado_por        uuid references empleados(id) on delete set null,
  creado_en         timestamptz not null default now(),
  actualizado_en    timestamptz not null default now()
);
create index if not exists idx_movimientos_fecha  on movimientos(fecha);
create index if not exists idx_movimientos_cuenta on movimientos(cuenta_id);

-- ── Seguridad (RLS) ──────────────────────────────────────────────────────────
alter table cuentas     enable row level security;
alter table movimientos enable row level security;

drop trigger if exists trg_cuentas_updated on cuentas;
create trigger trg_cuentas_updated before update on cuentas
  for each row execute function set_actualizado_en();
drop trigger if exists trg_movimientos_updated on movimientos;
create trigger trg_movimientos_updated before update on movimientos
  for each row execute function set_actualizado_en();

notify pgrst, 'reload schema';
