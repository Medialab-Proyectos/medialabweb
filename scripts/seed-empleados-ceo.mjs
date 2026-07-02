#!/usr/bin/env node
/**
 * Crea (o actualiza) la cuenta CEO/administrador del Portal de Empleados.
 *
 * Uso:
 *   node scripts/seed-empleados-ceo.mjs <cedula> <contraseña> ["Nombre Completo"] [correo]
 *
 * Ejemplo:
 *   node scripts/seed-empleados-ceo.mjs 1234567890 "MiClaveSegura123" "Christian Benavides" medialabproyectos@gmail.com
 *
 * Lee las credenciales de Supabase desde .env.local. El hash usa el mismo formato
 * que lib/empleados/auth.ts (scrypt: "saltHex:hashHex").
 */
import { readFileSync } from "node:fs"
import { scryptSync, randomBytes } from "node:crypto"
import { createClient } from "@supabase/supabase-js"

function loadEnv() {
  try {
    const txt = readFileSync(new URL("../.env.local", import.meta.url), "utf8")
    for (const line of txt.split(/\r?\n/)) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/)
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "")
    }
  } catch {
    /* sin .env.local: se usan las variables ya presentes en el entorno */
  }
}

function hashPassword(pw) {
  const salt = randomBytes(16)
  const hash = scryptSync(pw, salt, 64)
  return `${salt.toString("hex")}:${hash.toString("hex")}`
}

async function main() {
  loadEnv()
  const [cedula, password, nombre, email] = process.argv.slice(2)
  if (!cedula || !password) {
    console.error("Uso: node scripts/seed-empleados-ceo.mjs <cedula> <contraseña> [\"Nombre\"] [correo]")
    process.exit(1)
  }
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) {
    console.error("Faltan NEXT_PUBLIC_SUPABASE_URL y/o SUPABASE_SERVICE_ROLE_KEY en .env.local")
    process.exit(1)
  }
  const sb = createClient(url, key, { auth: { persistSession: false } })

  const payload = {
    cedula: String(cedula).trim(),
    nombre: nombre || "Christian Benavides",
    email: email || process.env.ADMIN_EMAIL || "medialabproyectos@gmail.com",
    password_hash: hashPassword(password),
    must_change_password: false,
    rol: "ceo",
    estado: "activo",
  }

  const { data, error } = await sb
    .from("empleados")
    .upsert(payload, { onConflict: "cedula" })
    .select("id,cedula,nombre,email,rol")
    .single()

  if (error) {
    console.error("Error al crear el CEO:", error.message)
    process.exit(1)
  }
  console.log("✅ CEO listo:", data)
  console.log("   Ingresa en /empleados con la cédula y la contraseña indicadas.")
}

main()
