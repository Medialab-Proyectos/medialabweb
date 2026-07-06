-- ─────────────────────────────────────────────────────────────────────────────
-- FASE 8 · Liquidaciones (finalización de contrato) — SOLO CEO / administrador
-- El empleado NUNCA la ve: al generarla, el vínculo queda cerrado (estado
-- 'terminado', que ya bloquea el acceso). La liquidación ES el pago (no un
-- certificado aparte): se genera el PDF, se descarga y se envía por fuera.
-- Requiere schema.sql (empleados + set_actualizado_en()) y la fase 3 (contratos).
-- Ejecuta en: Supabase → SQL Editor → New query → Run
-- ─────────────────────────────────────────────────────────────────────────────

create table if not exists liquidaciones (
  id                       uuid primary key default gen_random_uuid(),
  empleado_id              uuid not null references empleados(id) on delete cascade,

  -- Terminación
  tipo_terminacion         text not null check (tipo_terminacion in ('justa_causa','sin_justa_causa')),
  motivo                   text,                                  -- causa / descripción
  fecha_ingreso            date,                                  -- snapshot para el corte
  fecha_egreso             date not null,                         -- día de la renuncia (corte)

  -- Base salarial usada (snapshot del contrato vigente al egreso)
  salario_basico           numeric not null default 0,
  auxilio_transporte       numeric not null default 0,
  base                     numeric not null default 0,            -- básico + auxilio (cesantías/prima)
  tipo_contrato            text,                                  -- indefinido / fijo / obra (indemnización)
  fecha_fin_contrato       date,                                  -- solo fijo/obra (indemnización)

  -- Rubros de la liquidación (días causados + valor, editables antes de generar)
  cesantias_dias           numeric not null default 0,
  cesantias                numeric not null default 0,
  intereses_cesantias      numeric not null default 0,
  prima_dias               numeric not null default 0,
  prima                    numeric not null default 0,
  vacaciones_dias          numeric not null default 0,            -- días hábiles pendientes
  vacaciones               numeric not null default 0,
  indemnizacion_dias       numeric not null default 0,
  indemnizacion            numeric not null default 0,
  otros_conceptos          jsonb not null default '[]'::jsonb,    -- [{concepto, valor}] (+ bonos / − deducciones)

  -- Seguridad social (informativo: no altera el neto al empleado)
  seguridad_social_pagada  boolean not null default false,
  seguridad_social_saldo   numeric not null default 0,            -- costo pendiente de aportar por el mes de egreso

  total                    numeric not null default 0,            -- neto a pagar al empleado
  carta_path               text,                                  -- adjunto renuncia / certificado de finalización (bucket 'contratos')
  observaciones            text,

  estado                   text not null default 'borrador' check (estado in ('borrador','generada')),
  generado_por             uuid references empleados(id) on delete set null,
  generado_en              timestamptz,
  creado_en                timestamptz not null default now(),
  actualizado_en           timestamptz not null default now(),

  -- Una liquidación por empleado (la finalización del vínculo es un acto único).
  unique (empleado_id)
);
create index if not exists idx_liquidaciones_empleado on liquidaciones(empleado_id);

-- ── Seguridad (RLS) ──────────────────────────────────────────────────────────
-- Igual que el resto del portal: RLS activo SIN policies públicas. Todo el acceso
-- pasa por el servidor de Next con la SERVICE ROLE key (que ignora RLS). Como
-- SOLO el CEO consulta liquidaciones, nunca hay lectura por parte del empleado.
alter table liquidaciones enable row level security;

-- Mantener actualizado_en (la función ya existe desde schema.sql)
drop trigger if exists trg_liquidaciones_updated on liquidaciones;
create trigger trg_liquidaciones_updated before update on liquidaciones
  for each row execute function set_actualizado_en();

-- ── Storage ──────────────────────────────────────────────────────────────────
-- El adjunto de la carta de renuncia / certificado de finalización se guarda en el
-- bucket privado 'contratos' que ya creaste en la fase 3 (no hace falta uno nuevo).
-- Ruta usada: liquidaciones/<empleado_id>/<liquidacion_id>.<ext>

-- ── Refrescar caché de esquema de PostgREST ──────────────────────────────────
notify pgrst, 'reload schema';
