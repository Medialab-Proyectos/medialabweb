-- ─────────────────────────────────────────────────────────────────────────────
-- FASE 40 · Horas extra y recargos
-- El empleado reporta horas extra durante el mes; el líder o el CEO las aprueban.
-- Las aprobadas se pagan (desprendible/liquidación) y su promedio mensual entra a la
-- base de cesantías, prima y vacaciones (son constitutivas de salario).
-- Ejecuta en: Supabase → SQL Editor → New query → Run
-- ─────────────────────────────────────────────────────────────────────────────

create table if not exists horas_extras (
  id                    uuid primary key default gen_random_uuid(),
  empleado_id           uuid not null references empleados(id) on delete cascade,
  fecha                 date not null,                       -- día en que se trabajaron
  tipo                  text not null check (tipo in ('diurna','nocturna','recargo_nocturno')),
  horas                 numeric not null default 0 check (horas > 0),
  valor_hora            numeric not null default 0,          -- valor hora ordinaria al reportar
  valor                 numeric not null default 0,          -- valor total del recargo
  constitutivo_salario  boolean not null default true,       -- horas extra = siempre sí
  motivo                text,
  estado                text not null default 'pendiente'
                          check (estado in ('pendiente','aprobada','rechazada','pagada')),
  aprobado_por          uuid references empleados(id) on delete set null,
  comentario            text,                                -- nota del líder/CEO al decidir
  pagada_en             timestamptz,                         -- cuándo se incluyó en un pago
  creado_en             timestamptz not null default now(),
  decidido_en           timestamptz
);
create index if not exists idx_horas_extras_empleado on horas_extras(empleado_id);
create index if not exists idx_horas_extras_estado   on horas_extras(estado);
create index if not exists idx_horas_extras_fecha    on horas_extras(fecha);

alter table horas_extras enable row level security;

notify pgrst, 'reload schema';
