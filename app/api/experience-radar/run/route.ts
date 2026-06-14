import { NextRequest, NextResponse } from "next/server"
import { runExperienceRadarDailyAgent } from "@/src/lib/experience-radar"
import { generateAndStoreArticlesFromReport } from "@/src/lib/experience-radar/generateArticles"
import { getAllRadarArticles } from "@/src/lib/experience-radar/articleData"
import { notifyNewlyPublishedArticles } from "@/src/lib/experience-radar/notifyPublishedArticles"

export const dynamic = "force-dynamic"
export const maxDuration = 60

export async function GET(request: NextRequest) {
  return handle(request)
}

export async function POST(request: NextRequest) {
  let bodySecret = ""
  try {
    const body = await request.json() as { secret?: unknown }
    bodySecret = typeof body.secret === "string" ? body.secret : ""
  } catch {
    // Vercel Cron does not send a JSON body.
  }
  return handle(request, bodySecret)
}

async function handle(request: NextRequest, bodySecret = "") {
  const cronSecret = process.env.CRON_SECRET?.trim()
  const headerAuthorized = request.headers.get("authorization") === `Bearer ${cronSecret}`
  const bodyAuthorized = bodySecret === cronSecret
  if (cronSecret && !headerAuthorized && !bodyAuthorized) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 })
  }

  try {
    const report = await runExperienceRadarDailyAgent()

    // Conexión con la capa de artículos: convierte el reporte del día en artículos
    // SEO (10 secciones) y los persiste. Modo seguro heredado: draft / reviewed:false.
    const articles = await generateAndStoreArticlesFromReport(report)

    // Envío AUTOMÁTICO de push: tras persistir, avisa de las notas que recién quedaron
    // accesibles (en vivo/finalizado) y no se habían notificado. Best-effort: si falla,
    // no rompe la corrida. Se evalúa el universo completo (no solo lo reescrito hoy) para
    // cubrir notas que se vuelven accesibles solo por el paso del tiempo (kickoff).
    const notify = await notifyNewlyPublishedArticles(await getAllRadarArticles())

    return NextResponse.json(
      {
        ok: true,
        agentName: report.agentName,
        safeMode: {
          status: report.status,
          reviewed: report.reviewed,
          autoPublished: report.autoPublished,
        },
        aiAnalysis: report.aiAnalysis,
        articles: {
          count: articles.length,
          items: articles.map((a) => ({ slug: a.slug, seoTitle: a.seoTitle, radarScore: a.radarScore.total })),
        },
        push: { notified: notify.notified.length, slugs: notify.notified, result: notify.push, error: notify.error },
        report,
      },
      { headers: { "Cache-Control": "no-store" } },
    )
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: "experience_radar_run_failed", detail: String(error) },
      { status: 500 },
    )
  }
}
