import { NextRequest, NextResponse } from "next/server"
import OpenAI from "openai"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(req: NextRequest) {
  try {
    const { idea, industry, referenceUrls, existingBrand } = await req.json()

    if (!idea) {
      return NextResponse.json({ error: "Se requiere una idea" }, { status: 400 })
    }

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
    console.error("Error generating brief:", err)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
