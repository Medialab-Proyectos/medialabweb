-- ─────────────────────────────────────────────────────────────────────────────
-- FASE 14 · Herramientas para empleados
--   • Herramientas 'compartida' (usuario + contraseña de equipo, visibles a todos
--     los empleados activos) o 'libre' (sin clave: solo indicaciones de uso).
--   • El CEO las gestiona; al cambiar la clave o terminar su uso se notifica por
--     correo a los empleados activos. Uso sujeto a normas de uso responsable.
-- Requiere schema.sql (empleados + set_actualizado_en()).
-- Ejecuta en: Supabase → SQL Editor → New query → Run
-- ─────────────────────────────────────────────────────────────────────────────

create table if not exists herramientas (
  id             uuid primary key default gen_random_uuid(),
  nombre         text not null,                        -- ChatGPT, Claude, AI Studio…
  tipo           text not null default 'compartida'
                   check (tipo in ('compartida','libre')),  -- compartida = user+clave; libre = solo indicaciones
  url            text,
  usuario        text,                                 -- solo 'compartida'
  clave          text,                                 -- solo 'compartida' (texto; portal interno)
  indicaciones   text,                                 -- cómo usarla / normas específicas
  activa         boolean not null default true,
  orden          int not null default 0,
  creado_en      timestamptz not null default now(),
  actualizado_en timestamptz not null default now()
);

alter table herramientas enable row level security;

drop trigger if exists trg_herramientas_updated on herramientas;
create trigger trg_herramientas_updated before update on herramientas
  for each row execute function set_actualizado_en();

notify pgrst, 'reload schema';
