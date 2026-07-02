#!/usr/bin/env node
/** Verifica conexión a Supabase y que el esquema del portal exista. */
import { readFileSync } from "node:fs"
import { createClient } from "@supabase/supabase-js"

function loadEnv() {
  try {
    const txt = readFileSync(new URL("../.env.local", import.meta.url), "utf8")
    for (const line of txt.split(/\r?\n/)) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/)
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "")
    }
  } catch {}
}

loadEnv()
const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const key = process.env.SUPABASE_SERVICE_ROLE_KEY
if (!url || !key) {
  console.error("❌ Faltan NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY en .env.local")
  process.exit(1)
}
const sb = createClient(url, key, { auth: { persistSession: false } })

for (const tabla of ["empleados", "desprendibles", "evaluaciones"]) {
  const { count, error } = await sb.from(tabla).select("*", { count: "exact", head: true })
  if (error) {
    console.error(`❌ Tabla "${tabla}": ${error.message}`)
    if (/does not exist|schema cache/i.test(error.message)) {
      console.error("   → Parece que aún no corriste docs/empleados/schema.sql en el SQL Editor de Supabase.")
    }
    process.exit(1)
  }
  console.log(`✅ Tabla "${tabla}" OK (${count} filas)`)
}
console.log("\n🎉 Conexión y esquema correctos. Ya puedes crear el CEO (paso siguiente).")
