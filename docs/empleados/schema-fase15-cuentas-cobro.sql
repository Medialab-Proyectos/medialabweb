-- ─────────────────────────────────────────────────────────────────────────────
-- FASE 15 · Cuentas de cobro
--   • Documento de cobro que emite la empresa (con logo) o el CEO a nombre personal.
--   • Se cobra por horas o por mes de servicio (tarifa × cantidad).
--   • Destinatario = una empresa (con NIT); dice a qué cuenta consignar.
--   • Fecha de pago opcional → recordatorio de "pasar la cuenta de cobro".
-- Requiere schema-fase13-contabilidad-ampliada.sql (empresas, cuentas).
-- Ejecuta en: Supabase → SQL Editor → New query → Run
-- ─────────────────────────────────────────────────────────────────────────────

create table if not exists cuentas_cobro (
  id             uuid primary key default gen_random_uuid(),
  numero         text,                                   -- consecutivo (opcional)
  emisor         text not null default 'empresa'
                   check (emisor in ('empresa','personal')),  -- con logo empresa / a nombre del CEO
  empresa_id     uuid references empresas(id) on delete set null,  -- a quién se le cobra
  modo           text not null default 'por_mes'
                   check (modo in ('por_hora','por_mes')),
  cantidad       numeric not null default 1,             -- nº de horas o de meses
  tarifa         numeric not null default 0,             -- costo por hora o por mes
  moneda         text not null default 'COP' check (moneda in ('COP','USD')),
  mes_servicio   text,                                   -- "Julio 2026" o periodo
  concepto       text,
  cuenta_id      uuid references cuentas(id) on delete set null,   -- a qué cuenta consignar
  fecha_emision  date,
  fecha_pago     date,                                   -- opcional → recordatorio
  observaciones  text,
  estado         text not null default 'borrador'
                   check (estado in ('borrador','emitida','pagada')),
  creado_por     uuid references empleados(id) on delete set null,
  creado_en      timestamptz not null default now(),
  actualizado_en timestamptz not null default now()
);
create index if not exists idx_cuentas_cobro_fecha_pago on cuentas_cobro(fecha_pago);

alter table cuentas_cobro enable row level security;

drop trigger if exists trg_cuentas_cobro_updated on cuentas_cobro;
create trigger trg_cuentas_cobro_updated before update on cuentas_cobro
  for each row execute function set_actualizado_en();

notify pgrst, 'reload schema';
