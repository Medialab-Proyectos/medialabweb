import { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://medialab.design"

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/_next/", "/static/"],
      },
      // Search-aware AI agents (real-time browsing for answers — keep allowed for AEO/GEO)
      {
        userAgent: [
          "OAI-SearchBot",
          "ChatGPT-User",
          "PerplexityBot",
          "Perplexity-User",
          "Claude-Web",
          "Claude-User",
          "Claude-SearchBot",
          "Google-Extended",
          "GoogleOther",
          "Applebot",
          "Applebot-Extended",
          "DuckAssistBot",
          "Amazonbot",
          "Meta-ExternalAgent",
          "Meta-ExternalFetcher",
          "Bingbot",
          "MistralAI-User",
          "YouBot",
          "cohere-ai",
        ],
        allow: ["/", "/llms.txt", "/llms-full.txt"],
        disallow: ["/api/"],
      },
      // Training-only crawlers — allow by default to maximize brand citations
      {
        userAgent: ["GPTBot", "ClaudeBot", "anthropic-ai", "CCBot", "Bytespider", "Diffbot", "FacebookBot"],
        allow: ["/", "/llms.txt", "/llms-full.txt"],
        disallow: ["/api/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  }
}
