-- ─────────────────────────────────────────────────────────────────────────────
-- FASE 42 · Horario laboral por empleado + permisos por horas
-- El empleado registra su horario (lun–vie); el líder lo aprueba y solo entonces entra
-- en vigencia. El CEO ve "quién está activo ahora" cruzando horario + permisos aprobados.
-- Ejecuta en: Supabase → SQL Editor → New query → Run
-- ─────────────────────────────────────────────────────────────────────────────

-- Horarios (append-only por versión): el VIGENTE es el más reciente con estado 'aprobado';
-- una propuesta nueva nace 'pendiente' y no rige hasta que el líder la apruebe.
create table if not exists horarios_empleado (
  id            uuid primary key default gen_random_uuid(),
  empleado_id   uuid not null references empleados(id) on delete cascade,
  horario       jsonb not null,                    -- Semana A: { lun:{activo,entrada,salida,almuerzoInicio,almuerzoFin}, ... }
  horario_b     jsonb,                             -- Semana B (solo si alterna); se turna cada semana
  alterna       boolean not null default false,    -- horario alternado quincenal
  horas_semana  numeric not null default 0,
  estado        text not null default 'pendiente' check (estado in ('pendiente','aprobado','rechazado')),
  aprobado_por  uuid references empleados(id) on delete set null,
  comentario    text,
  creado_en     timestamptz not null default now(),
  decidido_en   timestamptz
);
create index if not exists idx_horarios_empleado on horarios_empleado(empleado_id);
create index if not exists idx_horarios_estado   on horarios_empleado(estado);

alter table horarios_empleado enable row level security;

-- Si la tabla se creó en una corrida ANTERIOR (sin alternancia), 'create table if not exists' la
-- deja intacta y estas columnas faltarían. Se agregan idempotentemente para que exista horario_b/alterna.
alter table horarios_empleado add column if not exists horario_b jsonb;
alter table horarios_empleado add column if not exists alterna boolean not null default false;

-- Permisos por HORAS: un permiso que no es vacaciones puede ser por día (como hoy) o por horas.
alter table solicitudes_ausencia add column if not exists por_horas boolean not null default false;
alter table solicitudes_ausencia add column if not exists hora_inicio text; -- "14:00" (solo si por_horas)
alter table solicitudes_ausencia add column if not exists hora_fin    text; -- "16:00"

-- Nuevo tipo "permiso_remunerado" (horas pagadas por no-disponibilidad). Se recrea el CHECK completo.
alter table solicitudes_ausencia drop constraint if exists solicitudes_ausencia_tipo_check;
alter table solicitudes_ausencia add constraint solicitudes_ausencia_tipo_check
  check (tipo in (
    'vacaciones','adelanto_vacaciones','permiso_remunerado','permiso_no_remunerado','licencia_maternidad',
    'licencia_paternidad','licencia_luto','dia_familia','dia_votacion',
    'media_jornada_cumpleanos','media_jornada_evento','otra'));

-- La encuesta de satisfacción se habilita SOLO por decisión del CEO (arranca deshabilitada).
alter table empresa_config add column if not exists encuesta_habilitada boolean not null default false;

-- Acuerdo de Confidencialidad y No Divulgación (NDA): todos deben descargarlo, firmarlo y subirlo.
alter table empleados add column if not exists nda_path text;          -- doc firmado en bucket 'contratos'
alter table empleados add column if not exists nda_firmado_en timestamptz;

-- Horario para freelance/prestación: el CEO decide si lo habilita (los laborales siempre lo tienen).
alter table empleados add column if not exists horario_habilitado boolean not null default false;

-- Máximo de horas al mes pactado en el contrato (freelance por hora, y referencia general).
alter table contratos add column if not exists freelance_max_horas_mes numeric;

-- Suspensión de contrato: solo se paga seguridad social (pensión). La causa se documenta como
-- otrosí y el empleado aporta una carta (no la genera el sistema). Puede tener fecha estimada o no.
alter table empleados add column if not exists suspension_motivo text;
alter table empleados add column if not exists suspension_hasta date;         -- null = sin fecha estimada
alter table empleados add column if not exists suspension_carta_path text;    -- carta del empleado (bucket 'contratos')

-- Directorio de contactos aliados (contador, medicina prepagada, ARL, etc.) — lo ve todo el equipo.
create table if not exists contactos_aliados (
  id         uuid primary key default gen_random_uuid(),
  nombre     text not null,
  rol        text,              -- "Contador", "Medicina prepagada", "ARL"…
  empresa    text,
  telefono   text,
  email      text,
  notas      text,
  orden      int not null default 0,
  creado_en  timestamptz not null default now()
);
alter table contactos_aliados enable row level security;

-- Fechas especiales que agrega Talento Humano/CEO (efemérides, capacitaciones, cierres, etc.).
-- Aparecen en "Próximas fechas" junto a cumpleaños y aniversarios. Si es recurrente, se repite cada año.
create table if not exists fechas_especiales (
  id          uuid primary key default gen_random_uuid(),
  titulo      text not null,
  fecha       date not null,
  recurrente  boolean not null default true,   -- true = se repite cada año (solo importa mes-día)
  nota        text,
  creado_en   timestamptz not null default now()
);
alter table fechas_especiales enable row level security;

notify pgrst, 'reload schema';
