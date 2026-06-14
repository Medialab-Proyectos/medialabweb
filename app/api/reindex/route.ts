import { NextResponse } from "next/server"
import { getVisibleRadarArticles } from "@/src/lib/experience-radar/articleData"
import { getArticleAvailability } from "@/src/lib/experience-radar/articleAvailability"

export async function GET() {
  const host = "medialab.design"
  const key = "68d839bb87a64c48970e5a95cb88a914"
  const keyLocation = `https://${host}/${key}.txt`

  const staticUrls = [
    `https://${host}/`,
    `https://${host}/en`,
    `https://${host}/curso`,
    `https://${host}/en/curso`,
    `https://${host}/servicios`,
    `https://${host}/en/servicios`,
    `https://${host}/portafolio`,
    `https://${host}/en/portafolio`,
    `https://${host}/blog`,
    `https://${host}/en/blog`,
    `https://${host}/sobre-nosotros`,
    `https://${host}/en/sobre-nosotros`,
    `https://${host}/contacto`,
    `https://${host}/en/contacto`,
    `https://${host}/carreras`,
    `https://${host}/en/carreras`,
    `https://${host}/uxgreen`,
    `https://${host}/en/uxgreen`,
  ]

  const now = new Date()
  const radarUrls = (await getVisibleRadarArticles())
    .filter((article) => getArticleAvailability(article, now).accessible)
    .map((article) => `https://${host}/experience-radar/mundial-2026/${article.slug}`)

  const urls = [...new Set([...staticUrls, ...radarUrls])]

  try {
    // Send to IndexNow API (Bing, Yandex, etc.)
    const response = await fetch("https://api.indexnow.org/IndexNow", {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify({
        host,
        key,
        keyLocation,
        urlList: urls,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      return NextResponse.json(
        {
          success: false,
          error: `IndexNow API returned status ${response.status}: ${errorText}`,
        },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: `IndexNow reindex request successfully submitted for ${urls.length} URLs.`,
      urls,
    })
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || "An unexpected error occurred",
      },
      { status: 500 }
    )
  }
}
