import { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://medialab.design"
  const sharedAllow = [
    "/",
    "/llms.txt",
    "/llms-full.txt",
    "/sitemap.xml",
    "/news-sitemap.xml",
    "/experience-radar/feed.xml",
  ]
  const sharedDisallow = ["/api/", "/_next/data/", "/experience-radar/actualizar"]

  return {
    rules: [
      {
        userAgent: "*",
        allow: sharedAllow,
        disallow: sharedDisallow,
      },
      // Search-aware AI agents with browsing capabilities.
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
          "Googlebot-News",
          "Googlebot-Image",
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
        allow: sharedAllow,
        disallow: sharedDisallow,
      },
      // Training crawlers remain allowed for citation and brand discovery.
      {
        userAgent: ["GPTBot", "ClaudeBot", "anthropic-ai", "CCBot", "Bytespider", "Diffbot", "FacebookBot"],
        allow: sharedAllow,
        disallow: sharedDisallow,
      },
    ],
    sitemap: [`${baseUrl}/sitemap.xml`, `${baseUrl}/news-sitemap.xml`],
    host: baseUrl,
  }
}
