-- ─────────────────────────────────────────────────────────────────────────────
-- FASE 25 · Catálogo de beneficios + horas de factura freelance
--   • Catálogo de beneficios: el CEO crea tipos de beneficio nuevos (nombre,
--     descripción, proveedor). Solo el CEO los activa por empleado.
--   • Factura freelance por hora: se guardan las horas trabajadas del mes.
-- Requiere schema-fase9-beneficios.sql, schema-fase10-freelance.sql y
-- schema-fase24-contrato-empresa-arl.sql.
-- Ejecuta en: Supabase → SQL Editor → New query → Run
-- ─────────────────────────────────────────────────────────────────────────────

-- 1) Factura freelance: horas trabajadas (para el modo "por hora")
alter table freelance_facturas add column if not exists horas numeric;

-- 2) Catálogo de tipos de beneficio (lo gestiona el CEO)
create table if not exists beneficios_tipos (
  id          uuid primary key default gen_random_uuid(),
  slug        text unique not null,
  nombre      text not null,
  descripcion text,
  proveedor   text,
  activo      boolean not null default true,
  orden       integer not null default 0,
  creado_en   timestamptz not null default now()
);

-- Semilla: medicina prepagada (el tipo que ya existía en el código).
insert into beneficios_tipos (slug, nombre, descripcion, proveedor, orden)
values ('medicina_prepagada', 'Medicina prepagada', 'Cobertura de salud complementaria asignada por la empresa.', 'MedPlus', 0)
on conflict (slug) do nothing;

-- 3) beneficios.tipo pasa a ser texto libre (cualquier slug del catálogo).
--    Se elimina el CHECK que solo permitía 'medicina_prepagada'.
do $$
declare c text;
begin
  for c in
    select conname from pg_constraint
    where conrelid = 'beneficios'::regclass and contype = 'c' and conname like '%tipo%'
  loop
    execute format('alter table beneficios drop constraint %I', c);
  end loop;
end $$;

notify pgrst, 'reload schema';
