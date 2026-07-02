-- ─────────────────────────────────────────────────────────────────────────────
-- FASE 3 · Contratos, condiciones salariales, otrosíes y prima de servicios
-- Requiere haber corrido antes schema.sql (tabla empleados + set_actualizado_en()).
-- Ejecuta en: Supabase → SQL Editor → New query → Run
-- ─────────────────────────────────────────────────────────────────────────────

-- ── Contratos (condiciones versionadas: append-only) ─────────────────────────
-- Cada fila es una VERSIÓN de las condiciones del empleado.
--   • La primera (tipo='inicial') es la línea base del contrato.
--   • Las siguientes (tipo='otrosi') son ajustes: aumento, nuevo auxilio, cambio de cargo…
-- Las condiciones VIGENTES = la fila con mayor vigente_desde (<= hoy).
-- El HISTORIAL = todas las filas del empleado ordenadas por vigente_desde desc.
create table if not exists contratos (
  id                 uuid primary key default gen_random_uuid(),
  empleado_id        uuid not null references empleados(id) on delete cascade,
  tipo               text not null check (tipo in ('inicial','otrosi')),
  vigente_desde      date not null,                         -- fecha efectiva del cambio
  salario_basico     numeric not null default 0,
  auxilio_transporte numeric not null default 0,
  otros_devengos     jsonb not null default '[]'::jsonb,    -- [{concepto, valor}] fijos (conectividad, bono…)
  tipo_contrato      text,                                  -- término fijo/indefinido/obra o labor (opcional)
  jornada            text,                                  -- opcional
  cargo              text,                                  -- puede cambiar en un otrosí
  motivo             text,                                  -- "aumento salarial", "auxilio de transporte"…
  archivo_path       text,                                  -- PDF del otrosí/contrato físico en Storage (opcional)
  creado_por         uuid references empleados(id) on delete set null,
  creado_en          timestamptz not null default now()
);
create index if not exists idx_contratos_empleado on contratos(empleado_id);

-- ── Primas de servicios (junio y diciembre) ──────────────────────────────────
create table if not exists primas (
  id             uuid primary key default gen_random_uuid(),
  empleado_id    uuid not null references empleados(id) on delete cascade,
  anio           int not null,
  semestre       int not null check (semestre in (1,2)),   -- 1 = enero-junio (pago junio), 2 = julio-diciembre (pago diciembre)
  dias           numeric not null default 180,
  base           numeric not null default 0,               -- salario básico + auxilio de transporte
  valor          numeric not null default 0,               -- prima calculada (editable antes de publicar)
  observaciones  text,
  publicado      boolean not null default false,           -- visible para el empleado
  creado_en      timestamptz not null default now(),
  actualizado_en timestamptz not null default now(),
  unique (empleado_id, anio, semestre)
);
create index if not exists idx_primas_empleado on primas(empleado_id);

-- ── Seguridad (RLS) ──────────────────────────────────────────────────────────
-- Igual que el resto del portal: RLS activo SIN policies públicas. Todo el acceso
-- pasa por el servidor de Next con la SERVICE ROLE key (que ignora RLS).
alter table contratos enable row level security;
alter table primas    enable row level security;

-- Mantener actualizado_en en primas (la función ya existe desde schema.sql)
drop trigger if exists trg_primas_updated on primas;
create trigger trg_primas_updated before update on primas
  for each row execute function set_actualizado_en();

-- ── Storage ──────────────────────────────────────────────────────────────────
-- Crea un bucket PRIVADO llamado 'contratos' en:  Supabase → Storage → New bucket
--   • Nombre: contratos
--   • Public: NO (privado)
-- Los adjuntos (contrato físico / otrosíes) se suben y descargan siempre por el
-- servidor con la service-role key; nunca se expone la URL directa al cliente.

-- ── Refrescar la caché de esquema de la API (PostgREST) ──────────────────────
-- Sin esto, la API puede responder "PGRST205: Could not find the table ... in the
-- schema cache" aunque la tabla exista. Ejecutar SIEMPRE al final.
notify pgrst, 'reload schema';
