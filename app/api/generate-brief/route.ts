import { NextRequest, NextResponse } from "next/server"

function generateSimulatedBrief(idea: string, industry: string, referenceUrls: string, existingBrand: string) {
  const industryText = industry || "tecnología"
  const brief = `El proyecto propuesto aborda una necesidad creciente en el sector de ${industryText}: ${idea}. En un mercado donde los usuarios esperan experiencias digitales fluidas, intuitivas y personalizadas, esta solución se posiciona como un diferenciador clave para conectar con el público objetivo de manera significativa y generar valor comercial sostenible.

La solución contempla el desarrollo de una plataforma digital centrada en el usuario que integra flujos de interacción optimizados, arquitectura de información clara y componentes de diseño conductual que guían al usuario hacia acciones de alto valor. Las funcionalidades clave incluyen onboarding adaptativo, dashboards personalizados, sistema de notificaciones inteligentes y módulos de autoservicio que reducen la fricción operativa.

Desde una perspectiva de UX y diseño conductual, el diferenciador estratégico radica en la aplicación de principios de psicología del consumidor — incluyendo nudges, anclas de decisión y micro-recompensas — para maximizar la adopción, retención y satisfacción del usuario. La arquitectura de experiencia emocional propuesta busca no solo resolver problemas funcionales sino crear conexiones significativas con cada punto de contacto digital.

Como próximos pasos recomendados, sugerimos iniciar con una fase de discovery acelerada mediante UXBox para validar las hipótesis de producto, seguida de un sprint de diseño de 2 semanas para prototipar las pantallas principales y realizar pruebas de usabilidad con usuarios reales antes de pasar a desarrollo.`

  const prototype = `Prototipo sugerido: La primera versión del producto contemplaría una landing page con propuesta de valor clara y CTA de registro, un flujo de onboarding de 3 pasos con personalización progresiva, un dashboard principal con métricas clave y accesos rápidos a las funcionalidades más utilizadas, y una vista de detalle con navegación por tabs. La paleta visual combinaría colores de alta confianza con acentos de acción para guiar al usuario de forma natural.`

  return { brief, prototype }
}

export async function POST(req: NextRequest) {
  try {
    const { idea, industry, referenceUrls, existingBrand } = await req.json()

    if (!idea) {
      return NextResponse.json({ error: "Se requiere una idea" }, { status: 400 })
    }

    // Si no hay API key, usar simulación inteligente
    if (!process.env.OPENAI_API_KEY) {
      const simulated = generateSimulatedBrief(idea, industry, referenceUrls, existingBrand)
      return NextResponse.json(simulated)
    }

    const OpenAI = (await import("openai")).default
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

    const prompt = `Eres un experto en product discovery y UX strategy. A continuación recibirás la información de un cliente potencial de MediaLab Ingeniería (agencia de UX, IA y diseño conductual).

Información del cliente:
- Idea del proyecto: "${idea}"
- Industria: "${industry || "No especificada"}"
- Sitios web de referencia: "${referenceUrls || "No proporcionados"}"
- Marca o página web existente: "${existingBrand || "No tiene"}"

Tu tarea es generar una DEFINICIÓN FORMAL DEL PROYECTO en español, profesional y concisa, compuesta por exactamente 3 a 4 párrafos. Cada párrafo debe cubrir:
1. El problema o necesidad que resuelve el producto y el público objetivo
2. La solución propuesta y las funcionalidades clave
3. El diferenciador estratégico y las consideraciones de UX/diseño conductual
4. (Opcional) Próximos pasos recomendados o alcance inicial sugerido

Sé específico, usa lenguaje de negocio y tecnología. No uses bullets ni listas. Solo párrafos fluidos.

Luego, genera una DESCRIPCIÓN DE PROTOTIPO: en 2-3 oraciones descriptivas, imagina cómo se vería la primera versión del producto (pantallas principales, flujo de usuario, elementos visuales clave). Comienza con "Prototipo sugerido:".

Formato de respuesta JSON:
{
  "brief": "Los 3-4 párrafos del brief formal aquí",
  "prototype": "Descripción del prototipo sugerido aquí"
}`

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      response_format: { type: "json_object" },
    })

    const content = completion.choices[0]?.message?.content
    if (!content) {
      return NextResponse.json({ error: "No se pudo generar el brief" }, { status: 500 })
    }

    const parsed = JSON.parse(content)
    return NextResponse.json(parsed)
  } catch (err) {
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
