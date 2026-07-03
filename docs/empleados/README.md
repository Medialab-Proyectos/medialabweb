# Portal de Empleados — Puesta en marcha

Portal privado en **`/empleados`** (no enlazado en la web pública, `noindex`). Fase 1:
login por **cédula + contraseña**, panel del **CEO** (crear empleados, asignar rol/líder/
jerarquía, fechas de ingreso/egreso, particularidades, cerrar contrato, resetear clave) y el
**esqueleto** del portal con 4 secciones (Desprendibles y Certificado laboral → "disponible
pronto"; Cursos y Beneficios → deshabilitadas).

> ⚠️ **Datos sensibles (Ley 1581 / Habeas Data):** cédulas, salarios y contratos. Las
> contraseñas se guardan con hash **scrypt**; el acceso a datos pasa solo por el servidor con
> la *service role key* (nunca se expone al navegador); RLS activo sin policies públicas.

## 1. Crear el proyecto Supabase
1. Entra a https://supabase.com → **New project**.
2. En **SQL Editor** → *New query* → pega y ejecuta **todo** `docs/empleados/schema.sql`.
3. (Para Fase 2) corre `docs/empleados/schema-fase2-desprendibles.sql`.
4. (Para Fase 3) corre `docs/empleados/schema-fase3-contratos.sql` **y** crea el bucket
   **privado** `contratos` en **Storage** → *New bucket* (para los adjuntos de contrato/otrosí).
5. (Para Fase 4 — vacaciones/ausencias) corre `docs/empleados/schema-fase4-ausencias.sql`.
6. (Para Fase 5 — cesantías) corre `docs/empleados/schema-fase5-cesantias.sql`.

## 2. Variables de entorno
En `.env.local` (local) **y** en *Vercel → Settings → Environment Variables* (producción):

```
NEXT_PUBLIC_SUPABASE_URL=  # Supabase → Project Settings → API → Project URL
SUPABASE_SERVICE_ROLE_KEY= # Supabase → Project Settings → API → service_role (SECRETO, solo servidor)
EMPLEADOS_SESSION_SECRET=  # genera uno: openssl rand -hex 32
```

`RESEND_API_KEY` y `FROM_EMAIL` ya existen y se usan para enviar la contraseña temporal por correo.

## 3. Crear la cuenta del CEO (primera clave)
```
node scripts/seed-empleados-ceo.mjs <TU_CEDULA> "<TU_CONTRASEÑA>" "Christian Benavides" medialabproyectos@gmail.com
```
Luego entra en `/empleados` con esa cédula y contraseña. Desde el panel **Administración**
creas al resto (cada uno recibe su contraseña temporal por correo y la cambia al entrar).

## 4. Probar
- `npm run dev` → abre `http://localhost:3000/empleados`.
- Ingresa como CEO → **Administración** → *Nuevo empleado*.

---

## Arquitectura (para retomar en las próximas fases)
- **Auth:** cédula + contraseña. Hash scrypt (`lib/empleados/auth.ts`). Sesión = cookie
  httpOnly firmada con HMAC (`empleados_sesion`, 8 h). Guards `requireEmpleado` / `requireCEO`.
- **DB:** Supabase Postgres. Cliente service-role server-only (`lib/empleados/db.ts`),
  queries tipadas (`lib/empleados/queries.ts`), tablas `empleados`, `desprendibles`,
  `evaluaciones` (`schema.sql`).
- **Rutas API:** `/api/empleados/{login,logout,cambiar-clave,admin}`.
- **Páginas:** `/empleados` (login), `/empleados/inicio` (portal), `/empleados/admin` (CEO).

## Fase 2 — Desprendibles de pago (CONSTRUIDA · data-driven)
El sistema **genera** el comprobante en PDF (plantilla con logo MediaLab, NIT 901.575.423-8);
el CEO llena los datos por empleado/mes (básico, devengos/auxilios, deducciones con botón de
salud+pensión al 4%, bases) y publica; el empleado lo descarga.

**Activar:** en Supabase → SQL Editor, corre **`docs/empleados/schema-fase2-desprendibles.sql`**
(reemplaza la tabla `desprendibles` de Fase 1, que estaba vacía). Requiere `pdf-lib` (ya instalado).
- CEO: `/empleados/admin/desprendibles` (o botón "Desprendibles" en Administración).
- Empleado: tarjeta "Desprendibles de pago" → `/empleados/desprendibles`.

## Fase 3 — Contratos, condiciones salariales y prima (CONSTRUIDA)
Fuente de verdad de las **condiciones** de cada empleado (salario básico + auxilio de
transporte + otros devengos fijos), **versionada**: la primera versión es el *contrato inicial*
y cada cambio es un *otrosí* con fecha de vigencia, motivo y **adjunto opcional** (PDF firmado).
Se muestra el **historial de ajustes**. El generador de desprendibles precarga los datos del
contrato vigente ("Cargar desde contrato"). La **prima de servicios** (junio y diciembre) se
liquida por `(básico + auxilio) × días / 360` (editable) y se entrega como PDF.

**Activar:** corre `docs/empleados/schema-fase3-contratos.sql` y crea el bucket privado
`contratos` en Storage. Tablas nuevas: `contratos`, `primas`.
- CEO: `/empleados/admin/contratos` y `/empleados/admin/primas` (botones en Administración).
- Empleado: tarjetas "Mi contrato" → `/empleados/contrato` y "Prima de servicios" → `/empleados/primas`.

### Pendiente (siguientes fases)
- **Certificado laboral:** generar PDF con fecha de ingreso→hoy (o egreso), cargo y
  particularidades, con el logo. (Falta el **formato/plantilla** que enviará el CEO.)
- **Fase 4 — Evaluaciones de desempeño:** plantilla UX/TI (puntos de mejora/críticos), se abre
  **trimestralmente**, hacia abajo (líder→equipo, CEO→líderes). Tabla `evaluaciones` ya creada.
- **Cursos** y **Beneficios:** hoy deshabilitadas.
